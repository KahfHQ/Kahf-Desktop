var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var handleRetry_exports = {};
__export(handleRetry_exports, {
  _getRetryRecord: () => _getRetryRecord,
  onDecryptionError: () => onDecryptionError,
  onRetryRequest: () => onRetryRequest
});
module.exports = __toCommonJS(handleRetry_exports);
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_lodash = require("lodash");
var Bytes = __toESM(require("../Bytes"));
var import_version = require("./version");
var import_assert = require("./assert");
var import_getSendOptions = require("./getSendOptions");
var import_handleMessageSend = require("./handleMessageSend");
var import_whatTypeOfConversation = require("./whatTypeOfConversation");
var import_timestamp = require("./timestamp");
var import_parseIntOrThrow = require("./parseIntOrThrow");
var RemoteConfig = __toESM(require("../RemoteConfig"));
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
var import_ToastDecryptionError = require("../components/ToastDecryptionError");
var import_showToast = require("./showToast");
var Errors = __toESM(require("../types/errors"));
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var import_SendMessage = __toESM(require("../textsecure/SendMessage"));
const RETRY_LIMIT = 5;
const retryRecord = /* @__PURE__ */ new Map();
function _getRetryRecord() {
  return retryRecord;
}
async function onRetryRequest(event) {
  const { confirm, retryRequest } = event;
  const {
    groupId: requestGroupId,
    requesterDevice,
    requesterUuid,
    senderDevice,
    sentAt
  } = retryRequest;
  const logId = `${requesterUuid}.${requesterDevice} ${sentAt}.${senderDevice}`;
  log.info(`onRetryRequest/${logId}: Starting...`);
  if (!RemoteConfig.isEnabled("desktop.senderKey.retry")) {
    log.warn(`onRetryRequest/${logId}: Feature flag disabled, returning early.`);
    confirm();
    return;
  }
  const retryCount = (retryRecord.get(sentAt) || 0) + 1;
  retryRecord.set(sentAt, retryCount);
  if (retryCount > RETRY_LIMIT) {
    log.warn(`onRetryRequest/${logId}: retryCount is ${retryCount}; returning early.`);
    confirm();
    return;
  }
  if (window.RETRY_DELAY) {
    log.warn(`onRetryRequest/${logId}: Delaying because RETRY_DELAY is set...`);
    await new Promise((resolve) => setTimeout(resolve, 5e3));
  }
  const HOUR = 60 * 60 * 1e3;
  const DAY = 24 * HOUR;
  let retryRespondMaxAge = 14 * DAY;
  try {
    retryRespondMaxAge = (0, import_parseIntOrThrow.parseIntOrThrow)(RemoteConfig.getValue("desktop.retryRespondMaxAge"), "retryRespondMaxAge");
  } catch (error) {
    log.warn(`onRetryRequest/${logId}: Failed to parse integer from desktop.retryRespondMaxAge feature flag`, error && error.stack ? error.stack : error);
  }
  const didArchive = await archiveSessionOnMatch(retryRequest);
  if ((0, import_timestamp.isOlderThan)(sentAt, retryRespondMaxAge)) {
    log.info(`onRetryRequest/${logId}: Message is too old, refusing to send again.`);
    await sendDistributionMessageOrNullMessage(logId, retryRequest, didArchive);
    confirm();
    return;
  }
  const sentProto = await window.Signal.Data.getSentProtoByRecipient({
    now: Date.now(),
    recipientUuid: requesterUuid,
    timestamp: sentAt
  });
  if (!sentProto) {
    log.info(`onRetryRequest/${logId}: Did not find sent proto`);
    await sendDistributionMessageOrNullMessage(logId, retryRequest, didArchive);
    confirm();
    return;
  }
  log.info(`onRetryRequest/${logId}: Resending message`);
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error(`onRetryRequest/${logId}: messaging is not available!`);
  }
  const { contentHint, messageIds, proto, timestamp, urgent } = sentProto;
  const { contentProto, groupId } = await maybeAddSenderKeyDistributionMessage({
    contentProto: import_protobuf.SignalService.Content.decode(proto),
    logId,
    messageIds,
    requestGroupId,
    requesterUuid,
    timestamp
  });
  const recipientConversation = window.ConversationController.getOrCreate(requesterUuid, "private");
  const sendOptions = await (0, import_getSendOptions.getSendOptions)(recipientConversation.attributes);
  const promise = messaging.sendMessageProtoAndWait({
    contentHint,
    groupId,
    options: sendOptions,
    proto: new import_protobuf.SignalService.Content(contentProto),
    recipients: [requesterUuid],
    timestamp,
    urgent
  });
  await (0, import_handleMessageSend.handleMessageSend)(promise, {
    messageIds: [],
    sendType: "resendFromLog"
  });
  confirm();
  log.info(`onRetryRequest/${logId}: Resend complete.`);
}
function maybeShowDecryptionToast(logId, name, deviceId) {
  if ((0, import_version.isProduction)(window.getVersion())) {
    return;
  }
  log.info(`maybeShowDecryptionToast/${logId}: Showing decryption error toast`);
  (0, import_showToast.showToast)(import_ToastDecryptionError.ToastDecryptionError, {
    deviceId,
    name,
    onShowDebugLog: () => window.showDebugLog()
  });
}
async function onDecryptionError(event) {
  const { confirm, decryptionError } = event;
  const { senderUuid, senderDevice, timestamp } = decryptionError;
  const logId = `${senderUuid}.${senderDevice} ${timestamp}`;
  log.info(`onDecryptionError/${logId}: Starting...`);
  const retryCount = (retryRecord.get(timestamp) || 0) + 1;
  retryRecord.set(timestamp, retryCount);
  if (retryCount > RETRY_LIMIT) {
    log.warn(`onDecryptionError/${logId}: retryCount is ${retryCount}; returning early.`);
    confirm();
    return;
  }
  const conversation = window.ConversationController.getOrCreate(senderUuid, "private");
  if (!conversation.get("capabilities")?.senderKey) {
    await conversation.getProfiles();
  }
  const name = conversation.getTitle();
  maybeShowDecryptionToast(logId, name, senderDevice);
  if (conversation.get("capabilities")?.senderKey && RemoteConfig.isEnabled("desktop.senderKey.retry")) {
    await requestResend(decryptionError);
  } else {
    await startAutomaticSessionReset(decryptionError);
  }
  confirm();
  log.info(`onDecryptionError/${logId}: ...complete`);
}
async function archiveSessionOnMatch({
  ratchetKey,
  requesterUuid,
  requesterDevice,
  senderDevice
}) {
  const ourDeviceId = (0, import_parseIntOrThrow.parseIntOrThrow)(window.textsecure.storage.user.getDeviceId(), "archiveSessionOnMatch/getDeviceId");
  if (ourDeviceId !== senderDevice || !ratchetKey) {
    return false;
  }
  const ourUuid = window.textsecure.storage.user.getCheckedUuid();
  const address = new import_QualifiedAddress.QualifiedAddress(ourUuid, import_Address.Address.create(requesterUuid, requesterDevice));
  const session = await window.textsecure.storage.protocol.loadSession(address);
  if (session && session.currentRatchetKeyMatches(ratchetKey)) {
    log.info("archiveSessionOnMatch: Matching device and ratchetKey, archiving session");
    await window.textsecure.storage.protocol.archiveSession(address);
    return true;
  }
  return false;
}
async function sendDistributionMessageOrNullMessage(logId, options, didArchive) {
  const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
  const { groupId, requesterUuid } = options;
  let sentDistributionMessage = false;
  log.info(`sendDistributionMessageOrNullMessage/${logId}: Starting...`);
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error(`sendDistributionMessageOrNullMessage/${logId}: messaging is not available!`);
  }
  const conversation = window.ConversationController.getOrCreate(requesterUuid, "private");
  const sendOptions = await (0, import_getSendOptions.getSendOptions)(conversation.attributes);
  if (groupId) {
    const group = window.ConversationController.get(groupId);
    const distributionId = group?.get("senderKeyInfo")?.distributionId;
    if (group && !group.hasMember(new import_UUID.UUID(requesterUuid))) {
      throw new Error(`sendDistributionMessageOrNullMessage/${logId}: Requester ${requesterUuid} is not a member of ${conversation.idForLogging()}`);
    }
    if (group && distributionId) {
      log.info(`sendDistributionMessageOrNullMessage/${logId}: Found matching group, sending sender key distribution message`);
      try {
        await (0, import_handleMessageSend.handleMessageSend)(messaging.sendSenderKeyDistributionMessage({
          contentHint: ContentHint.RESENDABLE,
          distributionId,
          groupId,
          identifiers: [requesterUuid],
          throwIfNotInDatabase: true,
          urgent: false
        }, sendOptions), { messageIds: [], sendType: "senderKeyDistributionMessage" });
        sentDistributionMessage = true;
      } catch (error) {
        log.error(`sendDistributionMessageOrNullMessage/${logId}: Failed to send sender key distribution message`, error && error.stack ? error.stack : error);
      }
    }
  }
  if (!sentDistributionMessage) {
    if (!didArchive) {
      log.info(`sendDistributionMessageOrNullMessage/${logId}: Did't send distribution message and didn't archive session. Returning early.`);
      return;
    }
    log.info(`sendDistributionMessageOrNullMessage/${logId}: Did not send distribution message, sending null message`);
    try {
      const nullMessage = import_SendMessage.default.getNullMessage({
        uuid: requesterUuid
      });
      await (0, import_handleMessageSend.handleMessageSend)(messaging.sendIndividualProto({
        ...nullMessage,
        options: sendOptions,
        proto: import_protobuf.SignalService.Content.decode(Bytes.fromBase64(nullMessage.protoBase64)),
        timestamp: Date.now(),
        urgent: (0, import_lodash.isBoolean)(nullMessage.urgent) ? nullMessage.urgent : true
      }), { messageIds: [], sendType: nullMessage.type });
    } catch (error) {
      log.error("sendDistributionMessageOrNullMessage: Failed to send null message", Errors.toLogFormat(error));
    }
  }
}
async function getRetryConversation({
  logId,
  messageIds,
  requestGroupId
}) {
  if (messageIds.length !== 1) {
    return window.ConversationController.get(requestGroupId);
  }
  const [messageId] = messageIds;
  const message = await window.Signal.Data.getMessageById(messageId);
  if (!message) {
    log.warn(`getRetryConversation/${logId}: Unable to find message ${messageId}`);
    return window.ConversationController.get(requestGroupId);
  }
  const { conversationId } = message;
  return window.ConversationController.get(conversationId);
}
async function maybeAddSenderKeyDistributionMessage({
  contentProto,
  logId,
  messageIds,
  requestGroupId,
  requesterUuid,
  timestamp
}) {
  const conversation = await getRetryConversation({
    logId,
    messageIds,
    requestGroupId
  });
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error(`maybeAddSenderKeyDistributionMessage/${logId}: messaging is not available!`);
  }
  if (!conversation) {
    log.warn(`maybeAddSenderKeyDistributionMessage/${logId}: Unable to find conversation`);
    return {
      contentProto
    };
  }
  if (!conversation.hasMember(new import_UUID.UUID(requesterUuid))) {
    throw new Error(`maybeAddSenderKeyDistributionMessage/${logId}: Recipient ${requesterUuid} is not a member of ${conversation.idForLogging()}`);
  }
  if (!(0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes)) {
    return {
      contentProto
    };
  }
  const senderKeyInfo = conversation.get("senderKeyInfo");
  if (senderKeyInfo && senderKeyInfo.distributionId) {
    const protoWithDistributionMessage = await messaging.getSenderKeyDistributionMessage(senderKeyInfo.distributionId, { throwIfNotInDatabase: true, timestamp });
    return {
      contentProto: {
        ...contentProto,
        senderKeyDistributionMessage: protoWithDistributionMessage.senderKeyDistributionMessage
      },
      groupId: conversation.get("groupId")
    };
  }
  return {
    contentProto,
    groupId: conversation.get("groupId")
  };
}
async function requestResend(decryptionError) {
  const {
    cipherTextBytes,
    cipherTextType,
    contentHint,
    groupId,
    receivedAtCounter,
    receivedAtDate,
    senderDevice,
    senderUuid,
    timestamp
  } = decryptionError;
  const logId = `${senderUuid}.${senderDevice} ${timestamp}`;
  log.info(`requestResend/${logId}: Starting...`, {
    cipherTextBytesLength: cipherTextBytes?.byteLength,
    cipherTextType,
    contentHint,
    groupId: groupId ? `groupv2(${groupId})` : void 0
  });
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error(`requestResend/${logId}: messaging is not available!`);
  }
  const group = groupId ? window.ConversationController.get(groupId) : void 0;
  const sender = window.ConversationController.getOrCreate(senderUuid, "private");
  const conversation = group || sender;
  if (!cipherTextBytes || !(0, import_lodash.isNumber)(cipherTextType)) {
    log.warn(`requestResend/${logId}: Missing cipherText information, failing over to automatic reset`);
    startAutomaticSessionReset(decryptionError);
    return;
  }
  try {
    const message = import_libsignal_client.DecryptionErrorMessage.forOriginal(Buffer.from(cipherTextBytes), cipherTextType, timestamp, senderDevice);
    const plaintext = import_libsignal_client.PlaintextContent.from(message);
    const options = await (0, import_getSendOptions.getSendOptions)(conversation.attributes);
    const result = await (0, import_handleMessageSend.handleMessageSend)(messaging.sendRetryRequest({
      plaintext,
      options,
      groupId,
      uuid: senderUuid
    }), { messageIds: [], sendType: "retryRequest" });
    if (result && result.errors && result.errors.length > 0) {
      throw result.errors[0];
    }
  } catch (error) {
    log.error(`requestResend/${logId}: Failed to send retry request, failing over to automatic reset`, error && error.stack ? error.stack : error);
    startAutomaticSessionReset(decryptionError);
    return;
  }
  const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
  if (contentHint === ContentHint.RESENDABLE) {
    const { retryPlaceholders } = window.Signal.Services;
    (0, import_assert.strictAssert)(retryPlaceholders, "requestResend: adding placeholder");
    log.info(`requestResend/${logId}: Adding placeholder`);
    const state = window.reduxStore.getState();
    const selectedId = state.conversations.selectedConversationId;
    const wasOpened = selectedId === conversation.id;
    await retryPlaceholders.add({
      conversationId: conversation.get("id"),
      receivedAt: receivedAtDate,
      receivedAtCounter,
      sentAt: timestamp,
      senderUuid,
      wasOpened
    });
    return;
  }
  if (contentHint === ContentHint.IMPLICIT) {
    log.info(`requestResend/${logId}: contentHint is IMPLICIT, doing nothing.`);
    return;
  }
  log.warn(`requestResend/${logId}: No content hint, adding error immediately`);
  conversation.queueJob("addDeliveryIssue", async () => {
    conversation.addDeliveryIssue({
      receivedAt: receivedAtDate,
      receivedAtCounter,
      senderUuid,
      sentAt: timestamp
    });
  });
}
function scheduleSessionReset(senderUuid, senderDevice) {
  const { lightSessionResetQueue } = window.Signal.Services;
  if (!lightSessionResetQueue) {
    throw new Error("scheduleSessionReset: lightSessionResetQueue is not available!");
  }
  lightSessionResetQueue.add(async () => {
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    await window.textsecure.storage.protocol.lightSessionReset(new import_QualifiedAddress.QualifiedAddress(ourUuid, import_Address.Address.create(senderUuid, senderDevice)));
  });
}
function startAutomaticSessionReset(decryptionError) {
  const { senderUuid, senderDevice, timestamp } = decryptionError;
  const logId = `${senderUuid}.${senderDevice} ${timestamp}`;
  log.info(`startAutomaticSessionReset/${logId}: Starting...`);
  scheduleSessionReset(senderUuid, senderDevice);
  const conversation = window.ConversationController.lookupOrCreate({
    uuid: senderUuid
  });
  if (!conversation) {
    log.warn("onLightSessionReset: No conversation, cannot add message to timeline");
    return;
  }
  const receivedAt = Date.now();
  const receivedAtCounter = window.Signal.Util.incrementMessageCounter();
  conversation.queueJob("addChatSessionRefreshed", async () => {
    conversation.addChatSessionRefreshed({ receivedAt, receivedAtCounter });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _getRetryRecord,
  onDecryptionError,
  onRetryRequest
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaGFuZGxlUmV0cnkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQge1xuICBEZWNyeXB0aW9uRXJyb3JNZXNzYWdlLFxuICBQbGFpbnRleHRDb250ZW50LFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuaW1wb3J0IHsgaXNCb29sZWFuLCBpc051bWJlciB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB7IGlzUHJvZHVjdGlvbiB9IGZyb20gJy4vdmVyc2lvbic7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4vZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHsgaGFuZGxlTWVzc2FnZVNlbmQgfSBmcm9tICcuL2hhbmRsZU1lc3NhZ2VTZW5kJztcbmltcG9ydCB7IGlzR3JvdXBWMiB9IGZyb20gJy4vd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBpc09sZGVyVGhhbiB9IGZyb20gJy4vdGltZXN0YW1wJztcbmltcG9ydCB7IHBhcnNlSW50T3JUaHJvdyB9IGZyb20gJy4vcGFyc2VJbnRPclRocm93JztcbmltcG9ydCAqIGFzIFJlbW90ZUNvbmZpZyBmcm9tICcuLi9SZW1vdGVDb25maWcnO1xuaW1wb3J0IHsgQWRkcmVzcyB9IGZyb20gJy4uL3R5cGVzL0FkZHJlc3MnO1xuaW1wb3J0IHsgUXVhbGlmaWVkQWRkcmVzcyB9IGZyb20gJy4uL3R5cGVzL1F1YWxpZmllZEFkZHJlc3MnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgVG9hc3REZWNyeXB0aW9uRXJyb3IgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0RGVjcnlwdGlvbkVycm9yJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4vc2hvd1RvYXN0JztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUge1xuICBEZWNyeXB0aW9uRXJyb3JFdmVudCxcbiAgRGVjcnlwdGlvbkVycm9yRXZlbnREYXRhLFxuICBSZXRyeVJlcXVlc3RFdmVudCxcbiAgUmV0cnlSZXF1ZXN0RXZlbnREYXRhLFxufSBmcm9tICcuLi90ZXh0c2VjdXJlL21lc3NhZ2VSZWNlaXZlckV2ZW50cyc7XG5cbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IE1lc3NhZ2VTZW5kZXIgZnJvbSAnLi4vdGV4dHNlY3VyZS9TZW5kTWVzc2FnZSc7XG5cbmNvbnN0IFJFVFJZX0xJTUlUID0gNTtcblxuLy8gTm90ZTogTmVpdGhlciBvZiB0aGUgdGhlIHR3byBmdW5jdGlvbnMgb25SZXRyeVJlcXVlc3QgYW5kIG9uRGVjcnl0aW9uRXJyb3IgdXNlIGEgam9iXG4vLyAgIHF1ZXVlIHRvIG1ha2Ugc3VyZSBzZW5kcyBhcmUgcmVsaWFibGUuIFRoYXQncyB1bm5lY2Vzc2FyeSBiZWNhdXNlIHRoZXNlIHRhc2tzIGFyZVxuLy8gICB0aWVkIHRvIGluY29taW5nIG1lc3NhZ2UgcHJvY2Vzc2luZyBxdWV1ZSwgYW5kIHdpbGwgb25seSBjb25maXJtKCkgY29tcGxldGlvbiBvblxuLy8gICBzdWNjZXNzZnVsIHNlbmQuXG5cbi8vIEVudHJ5cG9pbnRzXG5cbmNvbnN0IHJldHJ5UmVjb3JkID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRSZXRyeVJlY29yZCgpOiBNYXA8bnVtYmVyLCBudW1iZXI+IHtcbiAgcmV0dXJuIHJldHJ5UmVjb3JkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25SZXRyeVJlcXVlc3QoZXZlbnQ6IFJldHJ5UmVxdWVzdEV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgY29uZmlybSwgcmV0cnlSZXF1ZXN0IH0gPSBldmVudDtcbiAgY29uc3Qge1xuICAgIGdyb3VwSWQ6IHJlcXVlc3RHcm91cElkLFxuICAgIHJlcXVlc3RlckRldmljZSxcbiAgICByZXF1ZXN0ZXJVdWlkLFxuICAgIHNlbmRlckRldmljZSxcbiAgICBzZW50QXQsXG4gIH0gPSByZXRyeVJlcXVlc3Q7XG4gIGNvbnN0IGxvZ0lkID0gYCR7cmVxdWVzdGVyVXVpZH0uJHtyZXF1ZXN0ZXJEZXZpY2V9ICR7c2VudEF0fS4ke3NlbmRlckRldmljZX1gO1xuXG4gIGxvZy5pbmZvKGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogU3RhcnRpbmcuLi5gKTtcblxuICBpZiAoIVJlbW90ZUNvbmZpZy5pc0VuYWJsZWQoJ2Rlc2t0b3Auc2VuZGVyS2V5LnJldHJ5JykpIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogRmVhdHVyZSBmbGFnIGRpc2FibGVkLCByZXR1cm5pbmcgZWFybHkuYFxuICAgICk7XG4gICAgY29uZmlybSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJldHJ5Q291bnQgPSAocmV0cnlSZWNvcmQuZ2V0KHNlbnRBdCkgfHwgMCkgKyAxO1xuICByZXRyeVJlY29yZC5zZXQoc2VudEF0LCByZXRyeUNvdW50KTtcbiAgaWYgKHJldHJ5Q291bnQgPiBSRVRSWV9MSU1JVCkge1xuICAgIGxvZy53YXJuKFxuICAgICAgYG9uUmV0cnlSZXF1ZXN0LyR7bG9nSWR9OiByZXRyeUNvdW50IGlzICR7cmV0cnlDb3VudH07IHJldHVybmluZyBlYXJseS5gXG4gICAgKTtcbiAgICBjb25maXJtKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHdpbmRvdy5SRVRSWV9ERUxBWSkge1xuICAgIGxvZy53YXJuKGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogRGVsYXlpbmcgYmVjYXVzZSBSRVRSWV9ERUxBWSBpcyBzZXQuLi5gKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwMCkpO1xuICB9XG5cbiAgY29uc3QgSE9VUiA9IDYwICogNjAgKiAxMDAwO1xuICBjb25zdCBEQVkgPSAyNCAqIEhPVVI7XG4gIGxldCByZXRyeVJlc3BvbmRNYXhBZ2UgPSAxNCAqIERBWTtcbiAgdHJ5IHtcbiAgICByZXRyeVJlc3BvbmRNYXhBZ2UgPSBwYXJzZUludE9yVGhyb3coXG4gICAgICBSZW1vdGVDb25maWcuZ2V0VmFsdWUoJ2Rlc2t0b3AucmV0cnlSZXNwb25kTWF4QWdlJyksXG4gICAgICAncmV0cnlSZXNwb25kTWF4QWdlJ1xuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgb25SZXRyeVJlcXVlc3QvJHtsb2dJZH06IEZhaWxlZCB0byBwYXJzZSBpbnRlZ2VyIGZyb20gZGVza3RvcC5yZXRyeVJlc3BvbmRNYXhBZ2UgZmVhdHVyZSBmbGFnYCxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICk7XG4gIH1cblxuICBjb25zdCBkaWRBcmNoaXZlID0gYXdhaXQgYXJjaGl2ZVNlc3Npb25Pbk1hdGNoKHJldHJ5UmVxdWVzdCk7XG5cbiAgaWYgKGlzT2xkZXJUaGFuKHNlbnRBdCwgcmV0cnlSZXNwb25kTWF4QWdlKSkge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYG9uUmV0cnlSZXF1ZXN0LyR7bG9nSWR9OiBNZXNzYWdlIGlzIHRvbyBvbGQsIHJlZnVzaW5nIHRvIHNlbmQgYWdhaW4uYFxuICAgICk7XG4gICAgYXdhaXQgc2VuZERpc3RyaWJ1dGlvbk1lc3NhZ2VPck51bGxNZXNzYWdlKGxvZ0lkLCByZXRyeVJlcXVlc3QsIGRpZEFyY2hpdmUpO1xuICAgIGNvbmZpcm0oKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzZW50UHJvdG8gPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0U2VudFByb3RvQnlSZWNpcGllbnQoe1xuICAgIG5vdzogRGF0ZS5ub3coKSxcbiAgICByZWNpcGllbnRVdWlkOiByZXF1ZXN0ZXJVdWlkLFxuICAgIHRpbWVzdGFtcDogc2VudEF0LFxuICB9KTtcblxuICBpZiAoIXNlbnRQcm90bykge1xuICAgIGxvZy5pbmZvKGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogRGlkIG5vdCBmaW5kIHNlbnQgcHJvdG9gKTtcbiAgICBhd2FpdCBzZW5kRGlzdHJpYnV0aW9uTWVzc2FnZU9yTnVsbE1lc3NhZ2UobG9nSWQsIHJldHJ5UmVxdWVzdCwgZGlkQXJjaGl2ZSk7XG4gICAgY29uZmlybSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZy5pbmZvKGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogUmVzZW5kaW5nIG1lc3NhZ2VgKTtcblxuICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gIGlmICghbWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBvblJldHJ5UmVxdWVzdC8ke2xvZ0lkfTogbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUhYCk7XG4gIH1cblxuICBjb25zdCB7IGNvbnRlbnRIaW50LCBtZXNzYWdlSWRzLCBwcm90bywgdGltZXN0YW1wLCB1cmdlbnQgfSA9IHNlbnRQcm90bztcblxuICBjb25zdCB7IGNvbnRlbnRQcm90bywgZ3JvdXBJZCB9ID0gYXdhaXQgbWF5YmVBZGRTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKHtcbiAgICBjb250ZW50UHJvdG86IFByb3RvLkNvbnRlbnQuZGVjb2RlKHByb3RvKSxcbiAgICBsb2dJZCxcbiAgICBtZXNzYWdlSWRzLFxuICAgIHJlcXVlc3RHcm91cElkLFxuICAgIHJlcXVlc3RlclV1aWQsXG4gICAgdGltZXN0YW1wLFxuICB9KTtcblxuICBjb25zdCByZWNpcGllbnRDb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShcbiAgICByZXF1ZXN0ZXJVdWlkLFxuICAgICdwcml2YXRlJ1xuICApO1xuICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKHJlY2lwaWVudENvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgY29uc3QgcHJvbWlzZSA9IG1lc3NhZ2luZy5zZW5kTWVzc2FnZVByb3RvQW5kV2FpdCh7XG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZCxcbiAgICBvcHRpb25zOiBzZW5kT3B0aW9ucyxcbiAgICBwcm90bzogbmV3IFByb3RvLkNvbnRlbnQoY29udGVudFByb3RvKSxcbiAgICByZWNpcGllbnRzOiBbcmVxdWVzdGVyVXVpZF0sXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfSk7XG5cbiAgYXdhaXQgaGFuZGxlTWVzc2FnZVNlbmQocHJvbWlzZSwge1xuICAgIG1lc3NhZ2VJZHM6IFtdLFxuICAgIHNlbmRUeXBlOiAncmVzZW5kRnJvbUxvZycsXG4gIH0pO1xuXG4gIGNvbmZpcm0oKTtcbiAgbG9nLmluZm8oYG9uUmV0cnlSZXF1ZXN0LyR7bG9nSWR9OiBSZXNlbmQgY29tcGxldGUuYCk7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2hvd0RlY3J5cHRpb25Ub2FzdChcbiAgbG9nSWQ6IHN0cmluZyxcbiAgbmFtZTogc3RyaW5nLFxuICBkZXZpY2VJZDogbnVtYmVyXG4pIHtcbiAgaWYgKGlzUHJvZHVjdGlvbih3aW5kb3cuZ2V0VmVyc2lvbigpKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZy5pbmZvKGBtYXliZVNob3dEZWNyeXB0aW9uVG9hc3QvJHtsb2dJZH06IFNob3dpbmcgZGVjcnlwdGlvbiBlcnJvciB0b2FzdGApO1xuICBzaG93VG9hc3QoVG9hc3REZWNyeXB0aW9uRXJyb3IsIHtcbiAgICBkZXZpY2VJZCxcbiAgICBuYW1lLFxuICAgIG9uU2hvd0RlYnVnTG9nOiAoKSA9PiB3aW5kb3cuc2hvd0RlYnVnTG9nKCksXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25EZWNyeXB0aW9uRXJyb3IoXG4gIGV2ZW50OiBEZWNyeXB0aW9uRXJyb3JFdmVudFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgY29uZmlybSwgZGVjcnlwdGlvbkVycm9yIH0gPSBldmVudDtcbiAgY29uc3QgeyBzZW5kZXJVdWlkLCBzZW5kZXJEZXZpY2UsIHRpbWVzdGFtcCB9ID0gZGVjcnlwdGlvbkVycm9yO1xuICBjb25zdCBsb2dJZCA9IGAke3NlbmRlclV1aWR9LiR7c2VuZGVyRGV2aWNlfSAke3RpbWVzdGFtcH1gO1xuXG4gIGxvZy5pbmZvKGBvbkRlY3J5cHRpb25FcnJvci8ke2xvZ0lkfTogU3RhcnRpbmcuLi5gKTtcblxuICBjb25zdCByZXRyeUNvdW50ID0gKHJldHJ5UmVjb3JkLmdldCh0aW1lc3RhbXApIHx8IDApICsgMTtcbiAgcmV0cnlSZWNvcmQuc2V0KHRpbWVzdGFtcCwgcmV0cnlDb3VudCk7XG4gIGlmIChyZXRyeUNvdW50ID4gUkVUUllfTElNSVQpIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBvbkRlY3J5cHRpb25FcnJvci8ke2xvZ0lkfTogcmV0cnlDb3VudCBpcyAke3JldHJ5Q291bnR9OyByZXR1cm5pbmcgZWFybHkuYFxuICAgICk7XG4gICAgY29uZmlybSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlKFxuICAgIHNlbmRlclV1aWQsXG4gICAgJ3ByaXZhdGUnXG4gICk7XG4gIGlmICghY29udmVyc2F0aW9uLmdldCgnY2FwYWJpbGl0aWVzJyk/LnNlbmRlcktleSkge1xuICAgIGF3YWl0IGNvbnZlcnNhdGlvbi5nZXRQcm9maWxlcygpO1xuICB9XG5cbiAgY29uc3QgbmFtZSA9IGNvbnZlcnNhdGlvbi5nZXRUaXRsZSgpO1xuICBtYXliZVNob3dEZWNyeXB0aW9uVG9hc3QobG9nSWQsIG5hbWUsIHNlbmRlckRldmljZSk7XG5cbiAgaWYgKFxuICAgIGNvbnZlcnNhdGlvbi5nZXQoJ2NhcGFiaWxpdGllcycpPy5zZW5kZXJLZXkgJiZcbiAgICBSZW1vdGVDb25maWcuaXNFbmFibGVkKCdkZXNrdG9wLnNlbmRlcktleS5yZXRyeScpXG4gICkge1xuICAgIGF3YWl0IHJlcXVlc3RSZXNlbmQoZGVjcnlwdGlvbkVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBzdGFydEF1dG9tYXRpY1Nlc3Npb25SZXNldChkZWNyeXB0aW9uRXJyb3IpO1xuICB9XG5cbiAgY29uZmlybSgpO1xuICBsb2cuaW5mbyhgb25EZWNyeXB0aW9uRXJyb3IvJHtsb2dJZH06IC4uLmNvbXBsZXRlYCk7XG59XG5cbi8vIEhlbHBlcnNcblxuYXN5bmMgZnVuY3Rpb24gYXJjaGl2ZVNlc3Npb25Pbk1hdGNoKHtcbiAgcmF0Y2hldEtleSxcbiAgcmVxdWVzdGVyVXVpZCxcbiAgcmVxdWVzdGVyRGV2aWNlLFxuICBzZW5kZXJEZXZpY2UsXG59OiBSZXRyeVJlcXVlc3RFdmVudERhdGEpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3Qgb3VyRGV2aWNlSWQgPSBwYXJzZUludE9yVGhyb3coXG4gICAgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldERldmljZUlkKCksXG4gICAgJ2FyY2hpdmVTZXNzaW9uT25NYXRjaC9nZXREZXZpY2VJZCdcbiAgKTtcbiAgaWYgKG91ckRldmljZUlkICE9PSBzZW5kZXJEZXZpY2UgfHwgIXJhdGNoZXRLZXkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gIGNvbnN0IGFkZHJlc3MgPSBuZXcgUXVhbGlmaWVkQWRkcmVzcyhcbiAgICBvdXJVdWlkLFxuICAgIEFkZHJlc3MuY3JlYXRlKHJlcXVlc3RlclV1aWQsIHJlcXVlc3RlckRldmljZSlcbiAgKTtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wubG9hZFNlc3Npb24oYWRkcmVzcyk7XG5cbiAgaWYgKHNlc3Npb24gJiYgc2Vzc2lvbi5jdXJyZW50UmF0Y2hldEtleU1hdGNoZXMocmF0Y2hldEtleSkpIHtcbiAgICBsb2cuaW5mbyhcbiAgICAgICdhcmNoaXZlU2Vzc2lvbk9uTWF0Y2g6IE1hdGNoaW5nIGRldmljZSBhbmQgcmF0Y2hldEtleSwgYXJjaGl2aW5nIHNlc3Npb24nXG4gICAgKTtcbiAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVTZXNzaW9uKGFkZHJlc3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZW5kRGlzdHJpYnV0aW9uTWVzc2FnZU9yTnVsbE1lc3NhZ2UoXG4gIGxvZ0lkOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFJldHJ5UmVxdWVzdEV2ZW50RGF0YSxcbiAgZGlkQXJjaGl2ZTogYm9vbGVhblxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcbiAgY29uc3QgeyBncm91cElkLCByZXF1ZXN0ZXJVdWlkIH0gPSBvcHRpb25zO1xuICBsZXQgc2VudERpc3RyaWJ1dGlvbk1lc3NhZ2UgPSBmYWxzZTtcbiAgbG9nLmluZm8oYHNlbmREaXN0cmlidXRpb25NZXNzYWdlT3JOdWxsTWVzc2FnZS8ke2xvZ0lkfTogU3RhcnRpbmcuLi5gKTtcblxuICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gIGlmICghbWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYHNlbmREaXN0cmlidXRpb25NZXNzYWdlT3JOdWxsTWVzc2FnZS8ke2xvZ0lkfTogbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUhYFxuICAgICk7XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShcbiAgICByZXF1ZXN0ZXJVdWlkLFxuICAgICdwcml2YXRlJ1xuICApO1xuICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcblxuICBpZiAoZ3JvdXBJZCkge1xuICAgIGNvbnN0IGdyb3VwID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGdyb3VwSWQpO1xuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbklkID0gZ3JvdXA/LmdldCgnc2VuZGVyS2V5SW5mbycpPy5kaXN0cmlidXRpb25JZDtcblxuICAgIGlmIChncm91cCAmJiAhZ3JvdXAuaGFzTWVtYmVyKG5ldyBVVUlEKHJlcXVlc3RlclV1aWQpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgc2VuZERpc3RyaWJ1dGlvbk1lc3NhZ2VPck51bGxNZXNzYWdlLyR7bG9nSWR9OiBSZXF1ZXN0ZXIgJHtyZXF1ZXN0ZXJVdWlkfSBpcyBub3QgYSBtZW1iZXIgb2YgJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZ3JvdXAgJiYgZGlzdHJpYnV0aW9uSWQpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc2VuZERpc3RyaWJ1dGlvbk1lc3NhZ2VPck51bGxNZXNzYWdlLyR7bG9nSWR9OiBGb3VuZCBtYXRjaGluZyBncm91cCwgc2VuZGluZyBzZW5kZXIga2V5IGRpc3RyaWJ1dGlvbiBtZXNzYWdlYFxuICAgICAgKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgaGFuZGxlTWVzc2FnZVNlbmQoXG4gICAgICAgICAgbWVzc2FnaW5nLnNlbmRTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgICAgICAgICAgZGlzdHJpYnV0aW9uSWQsXG4gICAgICAgICAgICAgIGdyb3VwSWQsXG4gICAgICAgICAgICAgIGlkZW50aWZpZXJzOiBbcmVxdWVzdGVyVXVpZF0sXG4gICAgICAgICAgICAgIHRocm93SWZOb3RJbkRhdGFiYXNlOiB0cnVlLFxuICAgICAgICAgICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbmRPcHRpb25zXG4gICAgICAgICAgKSxcbiAgICAgICAgICB7IG1lc3NhZ2VJZHM6IFtdLCBzZW5kVHlwZTogJ3NlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UnIH1cbiAgICAgICAgKTtcbiAgICAgICAgc2VudERpc3RyaWJ1dGlvbk1lc3NhZ2UgPSB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBzZW5kRGlzdHJpYnV0aW9uTWVzc2FnZU9yTnVsbE1lc3NhZ2UvJHtsb2dJZH06IEZhaWxlZCB0byBzZW5kIHNlbmRlciBrZXkgZGlzdHJpYnV0aW9uIG1lc3NhZ2VgLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghc2VudERpc3RyaWJ1dGlvbk1lc3NhZ2UpIHtcbiAgICBpZiAoIWRpZEFyY2hpdmUpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc2VuZERpc3RyaWJ1dGlvbk1lc3NhZ2VPck51bGxNZXNzYWdlLyR7bG9nSWR9OiBEaWQndCBzZW5kIGRpc3RyaWJ1dGlvbiBtZXNzYWdlIGFuZCBkaWRuJ3QgYXJjaGl2ZSBzZXNzaW9uLiBSZXR1cm5pbmcgZWFybHkuYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBzZW5kRGlzdHJpYnV0aW9uTWVzc2FnZU9yTnVsbE1lc3NhZ2UvJHtsb2dJZH06IERpZCBub3Qgc2VuZCBkaXN0cmlidXRpb24gbWVzc2FnZSwgc2VuZGluZyBudWxsIG1lc3NhZ2VgXG4gICAgKTtcblxuICAgIC8vIEVucXVldWUgYSBudWxsIG1lc3NhZ2UgdXNpbmcgdGhlIG5ld2x5LWNyZWF0ZWQgc2Vzc2lvblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBudWxsTWVzc2FnZSA9IE1lc3NhZ2VTZW5kZXIuZ2V0TnVsbE1lc3NhZ2Uoe1xuICAgICAgICB1dWlkOiByZXF1ZXN0ZXJVdWlkLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgbWVzc2FnaW5nLnNlbmRJbmRpdmlkdWFsUHJvdG8oe1xuICAgICAgICAgIC4uLm51bGxNZXNzYWdlLFxuICAgICAgICAgIG9wdGlvbnM6IHNlbmRPcHRpb25zLFxuICAgICAgICAgIHByb3RvOiBQcm90by5Db250ZW50LmRlY29kZShcbiAgICAgICAgICAgIEJ5dGVzLmZyb21CYXNlNjQobnVsbE1lc3NhZ2UucHJvdG9CYXNlNjQpXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgdXJnZW50OiBpc0Jvb2xlYW4obnVsbE1lc3NhZ2UudXJnZW50KSA/IG51bGxNZXNzYWdlLnVyZ2VudCA6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICB7IG1lc3NhZ2VJZHM6IFtdLCBzZW5kVHlwZTogbnVsbE1lc3NhZ2UudHlwZSB9XG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzZW5kRGlzdHJpYnV0aW9uTWVzc2FnZU9yTnVsbE1lc3NhZ2U6IEZhaWxlZCB0byBzZW5kIG51bGwgbWVzc2FnZScsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJldHJ5Q29udmVyc2F0aW9uKHtcbiAgbG9nSWQsXG4gIG1lc3NhZ2VJZHMsXG4gIHJlcXVlc3RHcm91cElkLFxufToge1xuICBsb2dJZDogc3RyaW5nO1xuICBtZXNzYWdlSWRzOiBBcnJheTxzdHJpbmc+O1xuICByZXF1ZXN0R3JvdXBJZD86IHN0cmluZztcbn0pOiBQcm9taXNlPENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkPiB7XG4gIGlmIChtZXNzYWdlSWRzLmxlbmd0aCAhPT0gMSkge1xuICAgIC8vIEZhaWwgb3ZlciB0byByZXF1ZXN0ZWQgZ3JvdXBJZFxuICAgIHJldHVybiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQocmVxdWVzdEdyb3VwSWQpO1xuICB9XG5cbiAgY29uc3QgW21lc3NhZ2VJZF0gPSBtZXNzYWdlSWRzO1xuICBjb25zdCBtZXNzYWdlID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gIGlmICghbWVzc2FnZSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGdldFJldHJ5Q29udmVyc2F0aW9uLyR7bG9nSWR9OiBVbmFibGUgdG8gZmluZCBtZXNzYWdlICR7bWVzc2FnZUlkfWBcbiAgICApO1xuICAgIC8vIEZhaWwgb3ZlciB0byByZXF1ZXN0ZWQgZ3JvdXBJZFxuICAgIHJldHVybiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQocmVxdWVzdEdyb3VwSWQpO1xuICB9XG5cbiAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gbWVzc2FnZTtcbiAgcmV0dXJuIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1heWJlQWRkU2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZSh7XG4gIGNvbnRlbnRQcm90byxcbiAgbG9nSWQsXG4gIG1lc3NhZ2VJZHMsXG4gIHJlcXVlc3RHcm91cElkLFxuICByZXF1ZXN0ZXJVdWlkLFxuICB0aW1lc3RhbXAsXG59OiB7XG4gIGNvbnRlbnRQcm90bzogUHJvdG8uSUNvbnRlbnQ7XG4gIGxvZ0lkOiBzdHJpbmc7XG4gIG1lc3NhZ2VJZHM6IEFycmF5PHN0cmluZz47XG4gIHJlcXVlc3RHcm91cElkPzogc3RyaW5nO1xuICByZXF1ZXN0ZXJVdWlkOiBzdHJpbmc7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufSk6IFByb21pc2U8e1xuICBjb250ZW50UHJvdG86IFByb3RvLklDb250ZW50O1xuICBncm91cElkPzogc3RyaW5nO1xufT4ge1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCBnZXRSZXRyeUNvbnZlcnNhdGlvbih7XG4gICAgbG9nSWQsXG4gICAgbWVzc2FnZUlkcyxcbiAgICByZXF1ZXN0R3JvdXBJZCxcbiAgfSk7XG5cbiAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICBpZiAoIW1lc3NhZ2luZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBtYXliZUFkZFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UvJHtsb2dJZH06IG1lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlIWBcbiAgICApO1xuICB9XG5cbiAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBtYXliZUFkZFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UvJHtsb2dJZH06IFVuYWJsZSB0byBmaW5kIGNvbnZlcnNhdGlvbmBcbiAgICApO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50UHJvdG8sXG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udmVyc2F0aW9uLmhhc01lbWJlcihuZXcgVVVJRChyZXF1ZXN0ZXJVdWlkKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgbWF5YmVBZGRTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlLyR7bG9nSWR9OiBSZWNpcGllbnQgJHtyZXF1ZXN0ZXJVdWlkfSBpcyBub3QgYSBtZW1iZXIgb2YgJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICk7XG4gIH1cblxuICBpZiAoIWlzR3JvdXBWMihjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudFByb3RvLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBzZW5kZXJLZXlJbmZvID0gY29udmVyc2F0aW9uLmdldCgnc2VuZGVyS2V5SW5mbycpO1xuICBpZiAoc2VuZGVyS2V5SW5mbyAmJiBzZW5kZXJLZXlJbmZvLmRpc3RyaWJ1dGlvbklkKSB7XG4gICAgY29uc3QgcHJvdG9XaXRoRGlzdHJpYnV0aW9uTWVzc2FnZSA9XG4gICAgICBhd2FpdCBtZXNzYWdpbmcuZ2V0U2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZShcbiAgICAgICAgc2VuZGVyS2V5SW5mby5kaXN0cmlidXRpb25JZCxcbiAgICAgICAgeyB0aHJvd0lmTm90SW5EYXRhYmFzZTogdHJ1ZSwgdGltZXN0YW1wIH1cbiAgICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudFByb3RvOiB7XG4gICAgICAgIC4uLmNvbnRlbnRQcm90byxcbiAgICAgICAgc2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZTpcbiAgICAgICAgICBwcm90b1dpdGhEaXN0cmlidXRpb25NZXNzYWdlLnNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UsXG4gICAgICB9LFxuICAgICAgZ3JvdXBJZDogY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNvbnRlbnRQcm90byxcbiAgICBncm91cElkOiBjb252ZXJzYXRpb24uZ2V0KCdncm91cElkJyksXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RSZXNlbmQoZGVjcnlwdGlvbkVycm9yOiBEZWNyeXB0aW9uRXJyb3JFdmVudERhdGEpIHtcbiAgY29uc3Qge1xuICAgIGNpcGhlclRleHRCeXRlcyxcbiAgICBjaXBoZXJUZXh0VHlwZSxcbiAgICBjb250ZW50SGludCxcbiAgICBncm91cElkLFxuICAgIHJlY2VpdmVkQXRDb3VudGVyLFxuICAgIHJlY2VpdmVkQXREYXRlLFxuICAgIHNlbmRlckRldmljZSxcbiAgICBzZW5kZXJVdWlkLFxuICAgIHRpbWVzdGFtcCxcbiAgfSA9IGRlY3J5cHRpb25FcnJvcjtcbiAgY29uc3QgbG9nSWQgPSBgJHtzZW5kZXJVdWlkfS4ke3NlbmRlckRldmljZX0gJHt0aW1lc3RhbXB9YDtcblxuICBsb2cuaW5mbyhgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogU3RhcnRpbmcuLi5gLCB7XG4gICAgY2lwaGVyVGV4dEJ5dGVzTGVuZ3RoOiBjaXBoZXJUZXh0Qnl0ZXM/LmJ5dGVMZW5ndGgsXG4gICAgY2lwaGVyVGV4dFR5cGUsXG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZDogZ3JvdXBJZCA/IGBncm91cHYyKCR7Z3JvdXBJZH0pYCA6IHVuZGVmaW5lZCxcbiAgfSk7XG5cbiAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICBpZiAoIW1lc3NhZ2luZykge1xuICAgIHRocm93IG5ldyBFcnJvcihgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUhYCk7XG4gIH1cblxuICAvLyAxLiBGaW5kIHRoZSB0YXJnZXQgY29udmVyc2F0aW9uXG5cbiAgY29uc3QgZ3JvdXAgPSBncm91cElkXG4gICAgPyB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZ3JvdXBJZClcbiAgICA6IHVuZGVmaW5lZDtcbiAgY29uc3Qgc2VuZGVyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoXG4gICAgc2VuZGVyVXVpZCxcbiAgICAncHJpdmF0ZSdcbiAgKTtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gZ3JvdXAgfHwgc2VuZGVyO1xuXG4gIC8vIDIuIFNlbmQgcmVzZW5kIHJlcXVlc3RcblxuICBpZiAoIWNpcGhlclRleHRCeXRlcyB8fCAhaXNOdW1iZXIoY2lwaGVyVGV4dFR5cGUpKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogTWlzc2luZyBjaXBoZXJUZXh0IGluZm9ybWF0aW9uLCBmYWlsaW5nIG92ZXIgdG8gYXV0b21hdGljIHJlc2V0YFxuICAgICk7XG4gICAgc3RhcnRBdXRvbWF0aWNTZXNzaW9uUmVzZXQoZGVjcnlwdGlvbkVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBEZWNyeXB0aW9uRXJyb3JNZXNzYWdlLmZvck9yaWdpbmFsKFxuICAgICAgQnVmZmVyLmZyb20oY2lwaGVyVGV4dEJ5dGVzKSxcbiAgICAgIGNpcGhlclRleHRUeXBlLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgc2VuZGVyRGV2aWNlXG4gICAgKTtcblxuICAgIGNvbnN0IHBsYWludGV4dCA9IFBsYWludGV4dENvbnRlbnQuZnJvbShtZXNzYWdlKTtcbiAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgZ2V0U2VuZE9wdGlvbnMoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZU1lc3NhZ2VTZW5kKFxuICAgICAgbWVzc2FnaW5nLnNlbmRSZXRyeVJlcXVlc3Qoe1xuICAgICAgICBwbGFpbnRleHQsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIHV1aWQ6IHNlbmRlclV1aWQsXG4gICAgICB9KSxcbiAgICAgIHsgbWVzc2FnZUlkczogW10sIHNlbmRUeXBlOiAncmV0cnlSZXF1ZXN0JyB9XG4gICAgKTtcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5lcnJvcnMgJiYgcmVzdWx0LmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyByZXN1bHQuZXJyb3JzWzBdO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogRmFpbGVkIHRvIHNlbmQgcmV0cnkgcmVxdWVzdCwgZmFpbGluZyBvdmVyIHRvIGF1dG9tYXRpYyByZXNldGAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICAgIHN0YXJ0QXV0b21hdGljU2Vzc2lvblJlc2V0KGRlY3J5cHRpb25FcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gIC8vIDMuIERldGVybWluZSBob3cgdG8gcmVwcmVzZW50IHRoaXMgdG8gdGhlIHVzZXIuIFRocmVlIGRpZmZlcmVudCBvcHRpb25zLlxuXG4gIC8vIFdlIGJlbGlldmUgdGhhdCBpdCBjb3VsZCBiZSBzdWNjZXNzZnVsbHkgcmUtc2VudCwgc28gd2UnbGwgYWRkIGEgcGxhY2Vob2xkZXIuXG4gIGlmIChjb250ZW50SGludCA9PT0gQ29udGVudEhpbnQuUkVTRU5EQUJMRSkge1xuICAgIGNvbnN0IHsgcmV0cnlQbGFjZWhvbGRlcnMgfSA9IHdpbmRvdy5TaWduYWwuU2VydmljZXM7XG4gICAgc3RyaWN0QXNzZXJ0KHJldHJ5UGxhY2Vob2xkZXJzLCAncmVxdWVzdFJlc2VuZDogYWRkaW5nIHBsYWNlaG9sZGVyJyk7XG5cbiAgICBsb2cuaW5mbyhgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogQWRkaW5nIHBsYWNlaG9sZGVyYCk7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRJZCA9IHN0YXRlLmNvbnZlcnNhdGlvbnMuc2VsZWN0ZWRDb252ZXJzYXRpb25JZDtcbiAgICBjb25zdCB3YXNPcGVuZWQgPSBzZWxlY3RlZElkID09PSBjb252ZXJzYXRpb24uaWQ7XG5cbiAgICBhd2FpdCByZXRyeVBsYWNlaG9sZGVycy5hZGQoe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5nZXQoJ2lkJyksXG4gICAgICByZWNlaXZlZEF0OiByZWNlaXZlZEF0RGF0ZSxcbiAgICAgIHJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgc2VudEF0OiB0aW1lc3RhbXAsXG4gICAgICBzZW5kZXJVdWlkLFxuICAgICAgd2FzT3BlbmVkLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhpcyBtZXNzYWdlIGNhbm5vdCBiZSByZXNlbnQuIFdlJ2xsIHNob3cgbm8gZXJyb3IgYW5kIHRydXN0IHRoZSBvdGhlciBzaWRlIHRvXG4gIC8vICAgcmVzZXQgdGhlaXIgc2Vzc2lvbi5cbiAgaWYgKGNvbnRlbnRIaW50ID09PSBDb250ZW50SGludC5JTVBMSUNJVCkge1xuICAgIGxvZy5pbmZvKGByZXF1ZXN0UmVzZW5kLyR7bG9nSWR9OiBjb250ZW50SGludCBpcyBJTVBMSUNJVCwgZG9pbmcgbm90aGluZy5gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2cud2FybihgcmVxdWVzdFJlc2VuZC8ke2xvZ0lkfTogTm8gY29udGVudCBoaW50LCBhZGRpbmcgZXJyb3IgaW1tZWRpYXRlbHlgKTtcbiAgY29udmVyc2F0aW9uLnF1ZXVlSm9iKCdhZGREZWxpdmVyeUlzc3VlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnZlcnNhdGlvbi5hZGREZWxpdmVyeUlzc3VlKHtcbiAgICAgIHJlY2VpdmVkQXQ6IHJlY2VpdmVkQXREYXRlLFxuICAgICAgcmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICBzZW5kZXJVdWlkLFxuICAgICAgc2VudEF0OiB0aW1lc3RhbXAsXG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVNlc3Npb25SZXNldChzZW5kZXJVdWlkOiBzdHJpbmcsIHNlbmRlckRldmljZTogbnVtYmVyKSB7XG4gIC8vIFBvc3Rwb25lIHNlbmRpbmcgbGlnaHQgc2Vzc2lvbiByZXNldHMgdW50aWwgdGhlIHF1ZXVlIGlzIGVtcHR5XG4gIGNvbnN0IHsgbGlnaHRTZXNzaW9uUmVzZXRRdWV1ZSB9ID0gd2luZG93LlNpZ25hbC5TZXJ2aWNlcztcblxuICBpZiAoIWxpZ2h0U2Vzc2lvblJlc2V0UXVldWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnc2NoZWR1bGVTZXNzaW9uUmVzZXQ6IGxpZ2h0U2Vzc2lvblJlc2V0UXVldWUgaXMgbm90IGF2YWlsYWJsZSEnXG4gICAgKTtcbiAgfVxuXG4gIGxpZ2h0U2Vzc2lvblJlc2V0UXVldWUuYWRkKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmxpZ2h0U2Vzc2lvblJlc2V0KFxuICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgQWRkcmVzcy5jcmVhdGUoc2VuZGVyVXVpZCwgc2VuZGVyRGV2aWNlKSlcbiAgICApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRBdXRvbWF0aWNTZXNzaW9uUmVzZXQoZGVjcnlwdGlvbkVycm9yOiBEZWNyeXB0aW9uRXJyb3JFdmVudERhdGEpIHtcbiAgY29uc3QgeyBzZW5kZXJVdWlkLCBzZW5kZXJEZXZpY2UsIHRpbWVzdGFtcCB9ID0gZGVjcnlwdGlvbkVycm9yO1xuICBjb25zdCBsb2dJZCA9IGAke3NlbmRlclV1aWR9LiR7c2VuZGVyRGV2aWNlfSAke3RpbWVzdGFtcH1gO1xuXG4gIGxvZy5pbmZvKGBzdGFydEF1dG9tYXRpY1Nlc3Npb25SZXNldC8ke2xvZ0lkfTogU3RhcnRpbmcuLi5gKTtcblxuICBzY2hlZHVsZVNlc3Npb25SZXNldChzZW5kZXJVdWlkLCBzZW5kZXJEZXZpY2UpO1xuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICB1dWlkOiBzZW5kZXJVdWlkLFxuICB9KTtcbiAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICBsb2cud2FybihcbiAgICAgICdvbkxpZ2h0U2Vzc2lvblJlc2V0OiBObyBjb252ZXJzYXRpb24sIGNhbm5vdCBhZGQgbWVzc2FnZSB0byB0aW1lbGluZSdcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY2VpdmVkQXQgPSBEYXRlLm5vdygpO1xuICBjb25zdCByZWNlaXZlZEF0Q291bnRlciA9IHdpbmRvdy5TaWduYWwuVXRpbC5pbmNyZW1lbnRNZXNzYWdlQ291bnRlcigpO1xuICBjb252ZXJzYXRpb24ucXVldWVKb2IoJ2FkZENoYXRTZXNzaW9uUmVmcmVzaGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnZlcnNhdGlvbi5hZGRDaGF0U2Vzc2lvblJlZnJlc2hlZCh7IHJlY2VpdmVkQXQsIHJlY2VpdmVkQXRDb3VudGVyIH0pO1xuICB9KTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsOEJBR087QUFDUCxvQkFBb0M7QUFFcEMsWUFBdUI7QUFDdkIscUJBQTZCO0FBQzdCLG9CQUE2QjtBQUM3Qiw0QkFB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
