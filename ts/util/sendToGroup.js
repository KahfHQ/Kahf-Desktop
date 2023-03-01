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
var sendToGroup_exports = {};
__export(sendToGroup_exports, {
  _analyzeSenderKeyDevices: () => _analyzeSenderKeyDevices,
  _shouldFailSend: () => _shouldFailSend,
  _waitForAll: () => _waitForAll,
  sendContentMessageToGroup: () => sendContentMessageToGroup,
  sendToGroup: () => sendToGroup,
  sendToGroupViaSenderKey: () => sendToGroupViaSenderKey
});
module.exports = __toCommonJS(sendToGroup_exports);
var import_lodash = require("lodash");
var import_p_queue = __toESM(require("p-queue"));
var import_libsignal_client = require("@signalapp/libsignal-client");
var Bytes = __toESM(require("../Bytes"));
var import_senderCertificate = require("../services/senderCertificate");
var import_OutgoingMessage = require("../textsecure/OutgoingMessage");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
var import_RemoteConfig = require("../RemoteConfig");
var import_isRecord = require("./isRecord");
var import_timestamp = require("./timestamp");
var import_Errors = require("../textsecure/Errors");
var import_LibSignalStores = require("../LibSignalStores");
var import_getKeysForIdentifier = require("../textsecure/getKeysForIdentifier");
var import_handleMessageSend = require("./handleMessageSend");
var import_SealedSender = require("../types/SealedSender");
var import_parseIntOrThrow = require("./parseIntOrThrow");
var import_WebAPI = require("../textsecure/WebAPI");
var import_protobuf = require("../protobuf");
var import_assert = require("./assert");
var log = __toESM(require("../logging/log"));
var import_SignalProtocolStore = require("../SignalProtocolStore");
var import_durations = require("./durations");
const ERROR_EXPIRED_OR_MISSING_DEVICES = 409;
const ERROR_STALE_DEVICES = 410;
const HOUR = 60 * 60 * 1e3;
const DAY = 24 * HOUR;
const MAX_CONCURRENCY = 5;
const MAX_RECURSION = 10;
const ACCESS_KEY_LENGTH = 16;
const ZERO_ACCESS_KEY = Bytes.toBase64(new Uint8Array(ACCESS_KEY_LENGTH));
async function sendToGroup({
  abortSignal,
  contentHint,
  groupSendOptions,
  isPartialSend,
  messageId,
  sendOptions,
  sendTarget,
  sendType,
  urgent
}) {
  (0, import_assert.strictAssert)(window.textsecure.messaging, "sendToGroup: textsecure.messaging not available!");
  const { timestamp } = groupSendOptions;
  const recipients = getRecipients(groupSendOptions);
  const protoAttributes = window.textsecure.messaging.getAttrsFromGroupOptions(groupSendOptions);
  const contentMessage = await window.textsecure.messaging.getContentMessage(protoAttributes);
  if (abortSignal?.aborted) {
    throw new Error("sendToGroup was aborted");
  }
  return sendContentMessageToGroup({
    contentHint,
    contentMessage,
    isPartialSend,
    messageId,
    recipients,
    sendOptions,
    sendTarget,
    sendType,
    timestamp,
    urgent
  });
}
async function sendContentMessageToGroup({
  contentHint,
  contentMessage,
  isPartialSend,
  messageId,
  online,
  recipients,
  sendOptions,
  sendTarget,
  sendType,
  timestamp,
  urgent
}) {
  const logId = sendTarget.idForLogging();
  (0, import_assert.strictAssert)(window.textsecure.messaging, "sendContentMessageToGroup: textsecure.messaging not available!");
  const ourConversationId = window.ConversationController.getOurConversationIdOrThrow();
  const ourConversation = window.ConversationController.get(ourConversationId);
  if ((0, import_RemoteConfig.isEnabled)("desktop.sendSenderKey3") && (0, import_RemoteConfig.isEnabled)("desktop.senderKey.send") && ourConversation?.get("capabilities")?.senderKey && sendTarget.isValid()) {
    try {
      return await sendToGroupViaSenderKey({
        contentHint,
        contentMessage,
        isPartialSend,
        messageId,
        online,
        recipients,
        recursionCount: 0,
        sendOptions,
        sendTarget,
        sendType,
        timestamp,
        urgent
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      if (_shouldFailSend(error, logId)) {
        throw error;
      }
      log.error(`sendToGroup/${logId}: Sender Key send failed, logging, proceeding to normal send`, error && error.stack ? error.stack : error);
    }
  }
  const sendLogCallback = window.textsecure.messaging.makeSendLogCallback({
    contentHint,
    messageId,
    proto: Buffer.from(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
    sendType,
    timestamp,
    urgent
  });
  const groupId = sendTarget.isGroupV2() ? sendTarget.getGroupId() : void 0;
  return window.textsecure.messaging.sendGroupProto({
    contentHint,
    groupId,
    options: { ...sendOptions, online },
    proto: contentMessage,
    recipients,
    sendLogCallback,
    timestamp,
    urgent
  });
}
async function sendToGroupViaSenderKey(options) {
  const {
    contentHint,
    contentMessage,
    isPartialSend,
    messageId,
    online,
    recipients,
    recursionCount,
    sendOptions,
    sendTarget,
    sendType,
    timestamp,
    urgent
  } = options;
  const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
  const logId = sendTarget.idForLogging();
  log.info(`sendToGroupViaSenderKey/${logId}: Starting ${timestamp}, recursion count ${recursionCount}...`);
  if (recursionCount > MAX_RECURSION) {
    throw new Error(`sendToGroupViaSenderKey/${logId}: Too much recursion! Count is at ${recursionCount}`);
  }
  const groupId = sendTarget.getGroupId();
  if (!sendTarget.isValid()) {
    throw new Error(`sendToGroupViaSenderKey/${logId}: sendTarget is not valid!`);
  }
  if (contentHint !== ContentHint.DEFAULT && contentHint !== ContentHint.RESENDABLE && contentHint !== ContentHint.IMPLICIT) {
    throw new Error(`sendToGroupViaSenderKey/${logId}: Invalid contentHint ${contentHint}`);
  }
  (0, import_assert.strictAssert)(window.textsecure.messaging, "sendToGroupViaSenderKey: textsecure.messaging not available!");
  const EXPIRE_DURATION = getSenderKeyExpireDuration();
  const senderKeyInfo = sendTarget.getSenderKeyInfo();
  if (!senderKeyInfo) {
    log.info(`sendToGroupViaSenderKey/${logId}: Adding initial sender key info`);
    await sendTarget.saveSenderKeyInfo({
      createdAtDate: Date.now(),
      distributionId: import_UUID.UUID.generate().toString(),
      memberDevices: []
    });
    return sendToGroupViaSenderKey({
      ...options,
      recursionCount: recursionCount + 1
    });
  }
  if ((0, import_timestamp.isOlderThan)(senderKeyInfo.createdAtDate, EXPIRE_DURATION)) {
    const { createdAtDate: createdAtDate2 } = senderKeyInfo;
    log.info(`sendToGroupViaSenderKey/${logId}: Resetting sender key; ${createdAtDate2} is too old`);
    await resetSenderKey(sendTarget);
    return sendToGroupViaSenderKey({
      ...options,
      recursionCount: recursionCount + 1
    });
  }
  const ourUuid = window.textsecure.storage.user.getCheckedUuid();
  const { devices: currentDevices, emptyIdentifiers } = await window.textsecure.storage.protocol.getOpenDevices(ourUuid, recipients);
  if (emptyIdentifiers.length > 0 && emptyIdentifiers.some(isIdentifierRegistered)) {
    await fetchKeysForIdentifiers(emptyIdentifiers);
    return sendToGroupViaSenderKey({
      ...options,
      recursionCount: recursionCount + 1
    });
  }
  const { memberDevices, distributionId, createdAtDate } = senderKeyInfo;
  const memberSet = new Set(sendTarget.getMembers());
  const [devicesForSenderKey, devicesForNormalSend] = (0, import_lodash.partition)(currentDevices, (device) => isValidSenderKeyRecipient(memberSet, device.identifier));
  const senderKeyRecipients = getUuidsFromDevices(devicesForSenderKey);
  const normalSendRecipients = getUuidsFromDevices(devicesForNormalSend);
  log.info(`sendToGroupViaSenderKey/${logId}: ${senderKeyRecipients.length} accounts for sender key (${devicesForSenderKey.length} devices), ${normalSendRecipients.length} accounts for normal send (${devicesForNormalSend.length} devices)`);
  if (senderKeyRecipients.length < 2) {
    throw new Error(`sendToGroupViaSenderKey/${logId}: Not enough recipients for Sender Key message. Failing over.`);
  }
  const {
    newToMemberDevices,
    newToMemberUuids,
    removedFromMemberDevices,
    removedFromMemberUuids
  } = _analyzeSenderKeyDevices(memberDevices, devicesForSenderKey, isPartialSend);
  const keyNeedsReset = Array.from(removedFromMemberUuids).some((uuid) => !sendTarget.hasMember(uuid));
  if (keyNeedsReset) {
    await resetSenderKey(sendTarget);
    return sendToGroupViaSenderKey({
      ...options,
      recursionCount: recursionCount + 1
    });
  }
  if (newToMemberUuids.length > 0) {
    log.info(`sendToGroupViaSenderKey/${logId}: Sending sender key to ${newToMemberUuids.length} members: ${JSON.stringify(newToMemberUuids)}`);
    try {
      await (0, import_handleMessageSend.handleMessageSend)(window.textsecure.messaging.sendSenderKeyDistributionMessage({
        contentHint: ContentHint.RESENDABLE,
        distributionId,
        groupId,
        identifiers: newToMemberUuids,
        urgent
      }, sendOptions ? { ...sendOptions, online: false } : void 0), { messageIds: [], sendType: "senderKeyDistributionMessage" });
    } catch (error) {
      if (error instanceof import_Errors.SendMessageProtoError) {
        throw new import_Errors.SendMessageProtoError({
          ...error,
          sendIsNotFinal: true
        });
      }
      throw error;
    }
    const updatedMemberDevices = [...memberDevices, ...newToMemberDevices];
    await sendTarget.saveSenderKeyInfo({
      createdAtDate,
      distributionId,
      memberDevices: updatedMemberDevices
    });
    return sendToGroupViaSenderKey({
      ...options,
      recursionCount: recursionCount + 1
    });
  }
  if (removedFromMemberDevices.length > 0) {
    const updatedMemberDevices = [
      ...(0, import_lodash.differenceWith)(memberDevices, removedFromMemberDevices, deviceComparator)
    ];
    await sendTarget.saveSenderKeyInfo({
      createdAtDate,
      distributionId,
      memberDevices: updatedMemberDevices
    });
  }
  let sendLogId;
  let senderKeyRecipientsWithDevices = {};
  devicesForSenderKey.forEach((item) => {
    const { id, identifier } = item;
    senderKeyRecipientsWithDevices[identifier] || (senderKeyRecipientsWithDevices[identifier] = []);
    senderKeyRecipientsWithDevices[identifier].push(id);
  });
  try {
    const messageBuffer = await encryptForSenderKey({
      contentHint,
      devices: devicesForSenderKey,
      distributionId,
      contentMessage: import_protobuf.SignalService.Content.encode(contentMessage).finish(),
      groupId
    });
    const accessKeys = getXorOfAccessKeys(devicesForSenderKey);
    const result = await window.textsecure.messaging.server.sendWithSenderKey(messageBuffer, accessKeys, timestamp, { online, urgent });
    const parsed = import_WebAPI.multiRecipient200ResponseSchema.safeParse(result);
    if (parsed.success) {
      const { uuids404 } = parsed.data;
      if (uuids404 && uuids404.length > 0) {
        await _waitForAll({
          tasks: uuids404.map((uuid) => async () => markIdentifierUnregistered(uuid))
        });
      }
      senderKeyRecipientsWithDevices = (0, import_lodash.omit)(senderKeyRecipientsWithDevices, uuids404 || []);
    } else {
      log.error(`sendToGroupViaSenderKey/${logId}: Server returned unexpected 200 response ${JSON.stringify(parsed.error.flatten())}`);
    }
    if ((0, import_handleMessageSend.shouldSaveProto)(sendType)) {
      sendLogId = await window.Signal.Data.insertSentProto({
        contentHint,
        proto: Buffer.from(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
        timestamp,
        urgent
      }, {
        recipients: senderKeyRecipientsWithDevices,
        messageIds: messageId ? [messageId] : []
      });
    }
  } catch (error) {
    if (error.code === ERROR_EXPIRED_OR_MISSING_DEVICES) {
      await handle409Response(logId, error);
      return sendToGroupViaSenderKey({
        ...options,
        recursionCount: recursionCount + 1
      });
    }
    if (error.code === ERROR_STALE_DEVICES) {
      await handle410Response(sendTarget, error);
      return sendToGroupViaSenderKey({
        ...options,
        recursionCount: recursionCount + 1
      });
    }
    if (error.code === import_libsignal_client.ErrorCode.InvalidRegistrationId && error.addr) {
      const address = error.addr;
      const name = address.name();
      const brokenAccount = window.ConversationController.get(name);
      if (brokenAccount) {
        log.warn(`sendToGroupViaSenderKey/${logId}: Disabling sealed sender for ${brokenAccount.idForLogging()}`);
        brokenAccount.set({ sealedSender: import_SealedSender.SEALED_SENDER.DISABLED });
        window.Signal.Data.updateConversation(brokenAccount.attributes);
        return sendToGroupViaSenderKey({
          ...options,
          recursionCount: recursionCount + 1
        });
      }
    }
    throw new Error(`sendToGroupViaSenderKey/${logId}: Returned unexpected error ${error.code}. Failing over. ${error.stack || error}`);
  }
  if (normalSendRecipients.length === 0) {
    return {
      dataMessage: contentMessage.dataMessage ? import_protobuf.SignalService.DataMessage.encode(contentMessage.dataMessage).finish() : void 0,
      successfulIdentifiers: senderKeyRecipients,
      unidentifiedDeliveries: senderKeyRecipients,
      contentHint,
      timestamp,
      contentProto: Buffer.from(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      recipients: senderKeyRecipientsWithDevices,
      urgent
    };
  }
  const sendLogCallback = /* @__PURE__ */ __name(async ({
    identifier,
    deviceIds
  }) => {
    if (!(0, import_handleMessageSend.shouldSaveProto)(sendType)) {
      return;
    }
    const sentToConversation = window.ConversationController.get(identifier);
    if (!sentToConversation) {
      log.warn(`sendToGroupViaSenderKey/callback: Unable to find conversation for identifier ${identifier}`);
      return;
    }
    const recipientUuid = sentToConversation.get("uuid");
    if (!recipientUuid) {
      log.warn(`sendToGroupViaSenderKey/callback: Conversation ${sentToConversation.idForLogging()} had no UUID`);
      return;
    }
    await window.Signal.Data.insertProtoRecipients({
      id: sendLogId,
      recipientUuid,
      deviceIds
    });
  }, "sendLogCallback");
  try {
    const normalSendResult = await window.textsecure.messaging.sendGroupProto({
      contentHint,
      groupId,
      options: { ...sendOptions, online },
      proto: contentMessage,
      recipients: normalSendRecipients,
      sendLogCallback,
      timestamp,
      urgent
    });
    return mergeSendResult({
      result: normalSendResult,
      senderKeyRecipients,
      senderKeyRecipientsWithDevices
    });
  } catch (error) {
    if (error instanceof import_Errors.SendMessageProtoError) {
      const callbackResult = mergeSendResult({
        result: error,
        senderKeyRecipients,
        senderKeyRecipientsWithDevices
      });
      throw new import_Errors.SendMessageProtoError(callbackResult);
    }
    throw error;
  }
}
function mergeSendResult({
  result,
  senderKeyRecipients,
  senderKeyRecipientsWithDevices
}) {
  return {
    ...result,
    successfulIdentifiers: [
      ...result.successfulIdentifiers || [],
      ...senderKeyRecipients
    ],
    unidentifiedDeliveries: [
      ...result.unidentifiedDeliveries || [],
      ...senderKeyRecipients
    ],
    recipients: {
      ...result.recipients,
      ...senderKeyRecipientsWithDevices
    }
  };
}
const MAX_SENDER_KEY_EXPIRE_DURATION = 90 * DAY;
function getSenderKeyExpireDuration() {
  try {
    const parsed = (0, import_parseIntOrThrow.parseIntOrThrow)((0, import_RemoteConfig.getValue)("desktop.senderKeyMaxAge"), "getSenderKeyExpireDuration");
    const duration = Math.min(parsed, MAX_SENDER_KEY_EXPIRE_DURATION);
    log.info(`getSenderKeyExpireDuration: using expire duration of ${duration}`);
    return duration;
  } catch (error) {
    log.warn(`getSenderKeyExpireDuration: Failed to parse integer. Using default of ${MAX_SENDER_KEY_EXPIRE_DURATION}.`, error && error.stack ? error.stack : error);
    return MAX_SENDER_KEY_EXPIRE_DURATION;
  }
}
function _shouldFailSend(error, logId) {
  const logError = /* @__PURE__ */ __name((message) => {
    log.error(`_shouldFailSend/${logId}: ${message}`);
  }, "logError");
  if (error instanceof Error && error.message.includes("untrusted identity")) {
    logError("'untrusted identity' error, failing.");
    return true;
  }
  if (error instanceof import_Errors.OutgoingIdentityKeyError) {
    logError("OutgoingIdentityKeyError error, failing.");
    return true;
  }
  if (error instanceof import_Errors.UnregisteredUserError) {
    logError("UnregisteredUserError error, failing.");
    return true;
  }
  if (error instanceof import_Errors.ConnectTimeoutError) {
    logError("ConnectTimeoutError error, failing.");
    return true;
  }
  if ((0, import_isRecord.isRecord)(error) && typeof error.code === "number") {
    if (error.code === 400) {
      logError("Invalid request, failing.");
      return true;
    }
    if (error.code === 401) {
      logError("Permissions error, failing.");
      return true;
    }
    if (error.code === 404) {
      logError("Missing user or endpoint error, failing.");
      return true;
    }
    if (error.code === 413 || error.code === 429) {
      logError("Rate limit error, failing.");
      return true;
    }
    if (error.code === 428) {
      logError("Challenge error, failing.");
      return true;
    }
    if (error.code === 500) {
      logError("Server error, failing.");
      return true;
    }
    if (error.code === 508) {
      logError("Fail job error, failing.");
      return true;
    }
  }
  if (error instanceof import_Errors.SendMessageProtoError) {
    if (!error.errors || !error.errors.length) {
      logError("SendMessageProtoError had no errors, failing.");
      return true;
    }
    for (const innerError of error.errors) {
      const shouldFail = _shouldFailSend(innerError, logId);
      if (shouldFail) {
        return true;
      }
    }
  }
  return false;
}
async function _waitForAll({
  tasks,
  maxConcurrency = MAX_CONCURRENCY
}) {
  const queue = new import_p_queue.default({
    concurrency: maxConcurrency,
    timeout: import_durations.MINUTE * 30,
    throwOnTimeout: true
  });
  return queue.addAll(tasks);
}
function getRecipients(options) {
  if (options.groupV2) {
    return options.groupV2.members;
  }
  if (options.groupV1) {
    return options.groupV1.members;
  }
  throw new Error("getRecipients: Unable to extract recipients!");
}
async function markIdentifierUnregistered(identifier) {
  const conversation = window.ConversationController.getOrCreate(identifier, "private");
  conversation.setUnregistered();
  window.Signal.Data.updateConversation(conversation.attributes);
  const uuid = import_UUID.UUID.lookup(identifier);
  if (!uuid) {
    log.warn(`No uuid found for ${identifier}`);
    return;
  }
  await window.textsecure.storage.protocol.archiveAllSessions(uuid);
}
function isIdentifierRegistered(identifier) {
  const conversation = window.ConversationController.getOrCreate(identifier, "private");
  const isUnregistered = conversation.isUnregistered();
  return !isUnregistered;
}
async function handle409Response(logId, error) {
  const parsed = import_WebAPI.multiRecipient409ResponseSchema.safeParse(error.response);
  if (parsed.success) {
    await _waitForAll({
      tasks: parsed.data.map((item) => async () => {
        const { uuid, devices } = item;
        if (devices.missingDevices && devices.missingDevices.length > 0) {
          await fetchKeysForIdentifier(uuid, devices.missingDevices);
        }
        if (devices.extraDevices && devices.extraDevices.length > 0) {
          const ourUuid = window.textsecure.storage.user.getCheckedUuid();
          await _waitForAll({
            tasks: devices.extraDevices.map((deviceId) => async () => {
              await window.textsecure.storage.protocol.archiveSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, import_Address.Address.create(uuid, deviceId)));
            })
          });
        }
      }),
      maxConcurrency: 2
    });
  } else {
    log.error(`handle409Response/${logId}: Server returned unexpected 409 response ${JSON.stringify(parsed.error.flatten())}`);
    throw error;
  }
}
async function handle410Response(sendTarget, error) {
  const logId = sendTarget.idForLogging();
  const parsed = import_WebAPI.multiRecipient410ResponseSchema.safeParse(error.response);
  if (parsed.success) {
    await _waitForAll({
      tasks: parsed.data.map((item) => async () => {
        const { uuid, devices } = item;
        if (devices.staleDevices && devices.staleDevices.length > 0) {
          const ourUuid = window.textsecure.storage.user.getCheckedUuid();
          await _waitForAll({
            tasks: devices.staleDevices.map((deviceId) => async () => {
              await window.textsecure.storage.protocol.archiveSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, import_Address.Address.create(uuid, deviceId)));
            })
          });
          await fetchKeysForIdentifier(uuid, devices.staleDevices);
          const senderKeyInfo = sendTarget.getSenderKeyInfo();
          if (senderKeyInfo) {
            const devicesToRemove = devices.staleDevices.map((id) => ({ id, identifier: uuid }));
            await sendTarget.saveSenderKeyInfo({
              ...senderKeyInfo,
              memberDevices: (0, import_lodash.differenceWith)(senderKeyInfo.memberDevices, devicesToRemove, partialDeviceComparator)
            });
          }
        }
      }),
      maxConcurrency: 2
    });
  } else {
    log.error(`handle410Response/${logId}: Server returned unexpected 410 response ${JSON.stringify(parsed.error.flatten())}`);
    throw error;
  }
}
function getXorOfAccessKeys(devices) {
  const uuids = getUuidsFromDevices(devices);
  const result = Buffer.alloc(ACCESS_KEY_LENGTH);
  (0, import_assert.strictAssert)(result.length === ACCESS_KEY_LENGTH, "getXorOfAccessKeys starting value");
  uuids.forEach((uuid) => {
    const conversation = window.ConversationController.get(uuid);
    if (!conversation) {
      throw new Error(`getXorOfAccessKeys: Unable to fetch conversation for UUID ${uuid}`);
    }
    const accessKey = getAccessKey(conversation.attributes);
    if (!accessKey) {
      throw new Error(`getXorOfAccessKeys: No accessKey for UUID ${uuid}`);
    }
    const accessKeyBuffer = Buffer.from(accessKey, "base64");
    if (accessKeyBuffer.length !== ACCESS_KEY_LENGTH) {
      throw new Error(`getXorOfAccessKeys: Access key for ${uuid} had length ${accessKeyBuffer.length}`);
    }
    for (let i = 0; i < ACCESS_KEY_LENGTH; i += 1) {
      result[i] ^= accessKeyBuffer[i];
    }
  });
  return result;
}
async function encryptForSenderKey({
  contentHint,
  contentMessage,
  devices,
  distributionId,
  groupId
}) {
  const ourUuid = window.textsecure.storage.user.getCheckedUuid();
  const ourDeviceId = window.textsecure.storage.user.getDeviceId();
  if (!ourDeviceId) {
    throw new Error("encryptForSenderKey: Unable to fetch our uuid or deviceId");
  }
  const sender = import_libsignal_client.ProtocolAddress.new(ourUuid.toString(), (0, import_parseIntOrThrow.parseIntOrThrow)(ourDeviceId, "encryptForSenderKey, ourDeviceId"));
  const ourAddress = getOurAddress();
  const senderKeyStore = new import_LibSignalStores.SenderKeys({ ourUuid, zone: import_SignalProtocolStore.GLOBAL_ZONE });
  const message = Buffer.from((0, import_OutgoingMessage.padMessage)(contentMessage));
  const ciphertextMessage = await window.textsecure.storage.protocol.enqueueSenderKeyJob(new import_QualifiedAddress.QualifiedAddress(ourUuid, ourAddress), () => (0, import_libsignal_client.groupEncrypt)(sender, distributionId, senderKeyStore, message));
  const groupIdBuffer = groupId ? Buffer.from(groupId, "base64") : null;
  const senderCertificateObject = await import_senderCertificate.senderCertificateService.get(import_OutgoingMessage.SenderCertificateMode.WithoutE164);
  if (!senderCertificateObject) {
    throw new Error("encryptForSenderKey: Unable to fetch sender certificate!");
  }
  const senderCertificate = import_libsignal_client.SenderCertificate.deserialize(Buffer.from(senderCertificateObject.serialized));
  const content = import_libsignal_client.UnidentifiedSenderMessageContent.new(ciphertextMessage, senderCertificate, contentHint, groupIdBuffer);
  const recipients = devices.slice().sort((a, b) => {
    if (a.identifier === b.identifier) {
      return 0;
    }
    if (a.identifier < b.identifier) {
      return -1;
    }
    return 1;
  }).map((device) => {
    return import_libsignal_client.ProtocolAddress.new(import_UUID.UUID.checkedLookup(device.identifier).toString(), device.id);
  });
  const identityKeyStore = new import_LibSignalStores.IdentityKeys({ ourUuid });
  const sessionStore = new import_LibSignalStores.Sessions({ ourUuid });
  return (0, import_libsignal_client.sealedSenderMultiRecipientEncrypt)(content, recipients, identityKeyStore, sessionStore);
}
function isValidSenderKeyRecipient(members, uuid) {
  const memberConversation = window.ConversationController.get(uuid);
  if (!memberConversation) {
    log.warn(`isValidSenderKeyRecipient: Missing conversation model for member ${uuid}`);
    return false;
  }
  if (!members.has(memberConversation)) {
    log.info(`isValidSenderKeyRecipient: Sending to ${uuid}, not a group member`);
    return false;
  }
  const capabilities = memberConversation.get("capabilities");
  if (!capabilities?.senderKey) {
    return false;
  }
  if (!getAccessKey(memberConversation.attributes)) {
    return false;
  }
  if (memberConversation.isUnregistered()) {
    log.warn(`isValidSenderKeyRecipient: Member ${uuid} is unregistered`);
    return false;
  }
  return true;
}
function deviceComparator(left, right) {
  return Boolean(left && right && left.id === right.id && left.identifier === right.identifier && left.registrationId === right.registrationId);
}
function partialDeviceComparator(left, right) {
  return Boolean(left && right && left.id === right.id && left.identifier === right.identifier);
}
function getUuidsFromDevices(devices) {
  const uuids = /* @__PURE__ */ new Set();
  devices.forEach((device) => {
    uuids.add(import_UUID.UUID.checkedLookup(device.identifier).toString());
  });
  return Array.from(uuids);
}
function _analyzeSenderKeyDevices(memberDevices, devicesForSend, isPartialSend) {
  const newToMemberDevices = (0, import_lodash.differenceWith)(devicesForSend, memberDevices, deviceComparator);
  const newToMemberUuids = getUuidsFromDevices(newToMemberDevices);
  if (isPartialSend) {
    return {
      newToMemberDevices,
      newToMemberUuids,
      removedFromMemberDevices: [],
      removedFromMemberUuids: []
    };
  }
  const removedFromMemberDevices = (0, import_lodash.differenceWith)(memberDevices, devicesForSend, deviceComparator);
  const removedFromMemberUuids = getUuidsFromDevices(removedFromMemberDevices);
  return {
    newToMemberDevices,
    newToMemberUuids,
    removedFromMemberDevices,
    removedFromMemberUuids
  };
}
function getOurAddress() {
  const ourUuid = window.textsecure.storage.user.getCheckedUuid();
  const ourDeviceId = window.textsecure.storage.user.getDeviceId();
  if (!ourDeviceId) {
    throw new Error("getOurAddress: Unable to fetch our deviceId");
  }
  return new import_Address.Address(ourUuid, ourDeviceId);
}
async function resetSenderKey(sendTarget) {
  const logId = sendTarget.idForLogging();
  log.info(`resetSenderKey/${logId}: Sender key needs reset. Clearing data...`);
  const senderKeyInfo = sendTarget.getSenderKeyInfo();
  if (!senderKeyInfo) {
    log.warn(`resetSenderKey/${logId}: No sender key info`);
    return;
  }
  const { distributionId } = senderKeyInfo;
  const ourAddress = getOurAddress();
  await sendTarget.saveSenderKeyInfo({
    createdAtDate: Date.now(),
    distributionId,
    memberDevices: []
  });
  const ourUuid = window.storage.user.getCheckedUuid();
  await window.textsecure.storage.protocol.removeSenderKey(new import_QualifiedAddress.QualifiedAddress(ourUuid, ourAddress), distributionId);
}
function getAccessKey(attributes) {
  const { sealedSender, accessKey } = attributes;
  if (sealedSender === import_SealedSender.SEALED_SENDER.ENABLED) {
    return accessKey || void 0;
  }
  if (sealedSender === import_SealedSender.SEALED_SENDER.UNKNOWN || sealedSender === import_SealedSender.SEALED_SENDER.UNRESTRICTED) {
    return ZERO_ACCESS_KEY;
  }
  return void 0;
}
async function fetchKeysForIdentifiers(identifiers) {
  log.info(`fetchKeysForIdentifiers: Fetching keys for ${identifiers.length} identifiers`);
  try {
    await _waitForAll({
      tasks: identifiers.map((identifier) => async () => fetchKeysForIdentifier(identifier))
    });
  } catch (error) {
    log.error("fetchKeysForIdentifiers: Failed to fetch keys:", error && error.stack ? error.stack : error);
    throw error;
  }
}
async function fetchKeysForIdentifier(identifier, devices) {
  log.info(`fetchKeysForIdentifier: Fetching ${devices || "all"} devices for ${identifier}`);
  if (!window.textsecure?.messaging?.server) {
    throw new Error("fetchKeysForIdentifier: No server available!");
  }
  const emptyConversation = window.ConversationController.getOrCreate(identifier, "private");
  try {
    const { accessKeyFailed } = await (0, import_getKeysForIdentifier.getKeysForIdentifier)(identifier, window.textsecure?.messaging?.server, devices, getAccessKey(emptyConversation.attributes));
    if (accessKeyFailed) {
      log.info(`fetchKeysForIdentifiers: Setting sealedSender to DISABLED for conversation ${emptyConversation.idForLogging()}`);
      emptyConversation.set({
        sealedSender: import_SealedSender.SEALED_SENDER.DISABLED
      });
      window.Signal.Data.updateConversation(emptyConversation.attributes);
    }
  } catch (error) {
    if (error instanceof import_Errors.UnregisteredUserError) {
      await markIdentifierUnregistered(identifier);
      return;
    }
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _analyzeSenderKeyDevices,
  _shouldFailSend,
  _waitForAll,
  sendContentMessageToGroup,
  sendToGroup,
  sendToGroupViaSenderKey
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZFRvR3JvdXAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBkaWZmZXJlbmNlV2l0aCwgb21pdCwgcGFydGl0aW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5cbmltcG9ydCB7XG4gIEVycm9yQ29kZSxcbiAgZ3JvdXBFbmNyeXB0LFxuICBQcm90b2NvbEFkZHJlc3MsXG4gIHNlYWxlZFNlbmRlck11bHRpUmVjaXBpZW50RW5jcnlwdCxcbiAgU2VuZGVyQ2VydGlmaWNhdGUsXG4gIFVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2VDb250ZW50LFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHsgc2VuZGVyQ2VydGlmaWNhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc2VuZGVyQ2VydGlmaWNhdGUnO1xuaW1wb3J0IHR5cGUgeyBTZW5kTG9nQ2FsbGJhY2tUeXBlIH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9PdXRnb2luZ01lc3NhZ2UnO1xuaW1wb3J0IHtcbiAgcGFkTWVzc2FnZSxcbiAgU2VuZGVyQ2VydGlmaWNhdGVNb2RlLFxufSBmcm9tICcuLi90ZXh0c2VjdXJlL091dGdvaW5nTWVzc2FnZSc7XG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvQWRkcmVzcyc7XG5pbXBvcnQgeyBRdWFsaWZpZWRBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvUXVhbGlmaWVkQWRkcmVzcyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBnZXRWYWx1ZSwgaXNFbmFibGVkIH0gZnJvbSAnLi4vUmVtb3RlQ29uZmlnJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IGlzUmVjb3JkIH0gZnJvbSAnLi9pc1JlY29yZCc7XG5cbmltcG9ydCB7IGlzT2xkZXJUaGFuIH0gZnJvbSAnLi90aW1lc3RhbXAnO1xuaW1wb3J0IHR5cGUge1xuICBHcm91cFNlbmRPcHRpb25zVHlwZSxcbiAgU2VuZE9wdGlvbnNUeXBlLFxufSBmcm9tICcuLi90ZXh0c2VjdXJlL1NlbmRNZXNzYWdlJztcbmltcG9ydCB7XG4gIENvbm5lY3RUaW1lb3V0RXJyb3IsXG4gIE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvcixcbiAgU2VuZE1lc3NhZ2VQcm90b0Vycm9yLFxuICBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IsXG59IGZyb20gJy4uL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCB0eXBlIHsgSFRUUEVycm9yIH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9FcnJvcnMnO1xuaW1wb3J0IHsgSWRlbnRpdHlLZXlzLCBTZW5kZXJLZXlzLCBTZXNzaW9ucyB9IGZyb20gJy4uL0xpYlNpZ25hbFN0b3Jlcyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBEZXZpY2VUeXBlLCBDYWxsYmFja1Jlc3VsdFR5cGUgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1R5cGVzLmQnO1xuaW1wb3J0IHsgZ2V0S2V5c0ZvcklkZW50aWZpZXIgfSBmcm9tICcuLi90ZXh0c2VjdXJlL2dldEtleXNGb3JJZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIFNlbmRlcktleUluZm9UeXBlLFxufSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB0eXBlIHsgU2VuZFR5cGVzVHlwZSB9IGZyb20gJy4vaGFuZGxlTWVzc2FnZVNlbmQnO1xuaW1wb3J0IHsgaGFuZGxlTWVzc2FnZVNlbmQsIHNob3VsZFNhdmVQcm90byB9IGZyb20gJy4vaGFuZGxlTWVzc2FnZVNlbmQnO1xuaW1wb3J0IHsgU0VBTEVEX1NFTkRFUiB9IGZyb20gJy4uL3R5cGVzL1NlYWxlZFNlbmRlcic7XG5pbXBvcnQgeyBwYXJzZUludE9yVGhyb3cgfSBmcm9tICcuL3BhcnNlSW50T3JUaHJvdyc7XG5pbXBvcnQge1xuICBtdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlU2NoZW1hLFxuICBtdWx0aVJlY2lwaWVudDQwOVJlc3BvbnNlU2NoZW1hLFxuICBtdWx0aVJlY2lwaWVudDQxMFJlc3BvbnNlU2NoZW1hLFxufSBmcm9tICcuLi90ZXh0c2VjdXJlL1dlYkFQSSc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuXG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgR0xPQkFMX1pPTkUgfSBmcm9tICcuLi9TaWduYWxQcm90b2NvbFN0b3JlJztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4vZHVyYXRpb25zJztcblxuY29uc3QgRVJST1JfRVhQSVJFRF9PUl9NSVNTSU5HX0RFVklDRVMgPSA0MDk7XG5jb25zdCBFUlJPUl9TVEFMRV9ERVZJQ0VTID0gNDEwO1xuXG5jb25zdCBIT1VSID0gNjAgKiA2MCAqIDEwMDA7XG5jb25zdCBEQVkgPSAyNCAqIEhPVVI7XG5cbmNvbnN0IE1BWF9DT05DVVJSRU5DWSA9IDU7XG5cbi8vIHNlbmRXaXRoU2VuZGVyS2V5IGlzIHJlY3Vyc2l2ZSwgYnV0IHdlIGRvbid0IHdhbnQgdG8gbG9vcCBiYWNrIHRvbyBtYW55IHRpbWVzLlxuY29uc3QgTUFYX1JFQ1VSU0lPTiA9IDEwO1xuXG5jb25zdCBBQ0NFU1NfS0VZX0xFTkdUSCA9IDE2O1xuY29uc3QgWkVST19BQ0NFU1NfS0VZID0gQnl0ZXMudG9CYXNlNjQobmV3IFVpbnQ4QXJyYXkoQUNDRVNTX0tFWV9MRU5HVEgpKTtcblxuLy8gUHVibGljIEFQSTpcblxuZXhwb3J0IHR5cGUgU2VuZGVyS2V5VGFyZ2V0VHlwZSA9IHtcbiAgZ2V0R3JvdXBJZDogKCkgPT4gc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBnZXRNZW1iZXJzOiAoKSA9PiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD47XG4gIGhhc01lbWJlcjogKHV1aWQ6IFVVSURTdHJpbmdUeXBlKSA9PiBib29sZWFuO1xuICBpZEZvckxvZ2dpbmc6ICgpID0+IHN0cmluZztcbiAgaXNHcm91cFYyOiAoKSA9PiBib29sZWFuO1xuICBpc1ZhbGlkOiAoKSA9PiBib29sZWFuO1xuXG4gIGdldFNlbmRlcktleUluZm86ICgpID0+IFNlbmRlcktleUluZm9UeXBlIHwgdW5kZWZpbmVkO1xuICBzYXZlU2VuZGVyS2V5SW5mbzogKHNlbmRlcktleUluZm86IFNlbmRlcktleUluZm9UeXBlKSA9PiBQcm9taXNlPHZvaWQ+O1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRUb0dyb3VwKHtcbiAgYWJvcnRTaWduYWwsXG4gIGNvbnRlbnRIaW50LFxuICBncm91cFNlbmRPcHRpb25zLFxuICBpc1BhcnRpYWxTZW5kLFxuICBtZXNzYWdlSWQsXG4gIHNlbmRPcHRpb25zLFxuICBzZW5kVGFyZ2V0LFxuICBzZW5kVHlwZSxcbiAgdXJnZW50LFxufToge1xuICBhYm9ydFNpZ25hbD86IEFib3J0U2lnbmFsO1xuICBjb250ZW50SGludDogbnVtYmVyO1xuICBncm91cFNlbmRPcHRpb25zOiBHcm91cFNlbmRPcHRpb25zVHlwZTtcbiAgaXNQYXJ0aWFsU2VuZD86IGJvb2xlYW47XG4gIG1lc3NhZ2VJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBzZW5kT3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgc2VuZFRhcmdldDogU2VuZGVyS2V5VGFyZ2V0VHlwZTtcbiAgc2VuZFR5cGU6IFNlbmRUeXBlc1R5cGU7XG4gIHVyZ2VudDogYm9vbGVhbjtcbn0pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICBzdHJpY3RBc3NlcnQoXG4gICAgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLFxuICAgICdzZW5kVG9Hcm91cDogdGV4dHNlY3VyZS5tZXNzYWdpbmcgbm90IGF2YWlsYWJsZSEnXG4gICk7XG5cbiAgY29uc3QgeyB0aW1lc3RhbXAgfSA9IGdyb3VwU2VuZE9wdGlvbnM7XG4gIGNvbnN0IHJlY2lwaWVudHMgPSBnZXRSZWNpcGllbnRzKGdyb3VwU2VuZE9wdGlvbnMpO1xuXG4gIC8vIEZpcnN0LCBkbyB0aGUgYXR0YWNobWVudCB1cGxvYWQgYW5kIHByZXBhcmUgdGhlIHByb3RvIHdlJ2xsIGJlIHNlbmRpbmdcbiAgY29uc3QgcHJvdG9BdHRyaWJ1dGVzID1cbiAgICB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcuZ2V0QXR0cnNGcm9tR3JvdXBPcHRpb25zKGdyb3VwU2VuZE9wdGlvbnMpO1xuICBjb25zdCBjb250ZW50TWVzc2FnZSA9IGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZy5nZXRDb250ZW50TWVzc2FnZShcbiAgICBwcm90b0F0dHJpYnV0ZXNcbiAgKTtcblxuICAvLyBBdHRhY2htZW50IHVwbG9hZCBtaWdodCB0YWtlIHRvbyBsb25nIHRvIHN1Y2NlZWQgLSB3ZSBkb24ndCB3YW50IHRvIHByb2NlZWRcbiAgLy8gd2l0aCB0aGUgc2VuZCBpZiB0aGUgY2FsbGVyIGFib3J0ZWQgdGhpcyBjYWxsLlxuICBpZiAoYWJvcnRTaWduYWw/LmFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbmRUb0dyb3VwIHdhcyBhYm9ydGVkJyk7XG4gIH1cblxuICByZXR1cm4gc2VuZENvbnRlbnRNZXNzYWdlVG9Hcm91cCh7XG4gICAgY29udGVudEhpbnQsXG4gICAgY29udGVudE1lc3NhZ2UsXG4gICAgaXNQYXJ0aWFsU2VuZCxcbiAgICBtZXNzYWdlSWQsXG4gICAgcmVjaXBpZW50cyxcbiAgICBzZW5kT3B0aW9ucyxcbiAgICBzZW5kVGFyZ2V0LFxuICAgIHNlbmRUeXBlLFxuICAgIHRpbWVzdGFtcCxcbiAgICB1cmdlbnQsXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZENvbnRlbnRNZXNzYWdlVG9Hcm91cCh7XG4gIGNvbnRlbnRIaW50LFxuICBjb250ZW50TWVzc2FnZSxcbiAgaXNQYXJ0aWFsU2VuZCxcbiAgbWVzc2FnZUlkLFxuICBvbmxpbmUsXG4gIHJlY2lwaWVudHMsXG4gIHNlbmRPcHRpb25zLFxuICBzZW5kVGFyZ2V0LFxuICBzZW5kVHlwZSxcbiAgdGltZXN0YW1wLFxuICB1cmdlbnQsXG59OiB7XG4gIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gIGNvbnRlbnRNZXNzYWdlOiBQcm90by5Db250ZW50O1xuICBpc1BhcnRpYWxTZW5kPzogYm9vbGVhbjtcbiAgbWVzc2FnZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIG9ubGluZT86IGJvb2xlYW47XG4gIHJlY2lwaWVudHM6IEFycmF5PHN0cmluZz47XG4gIHNlbmRPcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlO1xuICBzZW5kVGFyZ2V0OiBTZW5kZXJLZXlUYXJnZXRUeXBlO1xuICBzZW5kVHlwZTogU2VuZFR5cGVzVHlwZTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIHVyZ2VudDogYm9vbGVhbjtcbn0pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICBjb25zdCBsb2dJZCA9IHNlbmRUYXJnZXQuaWRGb3JMb2dnaW5nKCk7XG4gIHN0cmljdEFzc2VydChcbiAgICB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcsXG4gICAgJ3NlbmRDb250ZW50TWVzc2FnZVRvR3JvdXA6IHRleHRzZWN1cmUubWVzc2FnaW5nIG5vdCBhdmFpbGFibGUhJ1xuICApO1xuXG4gIGNvbnN0IG91ckNvbnZlcnNhdGlvbklkID1cbiAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZE9yVGhyb3coKTtcbiAgY29uc3Qgb3VyQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KG91ckNvbnZlcnNhdGlvbklkKTtcblxuICBpZiAoXG4gICAgaXNFbmFibGVkKCdkZXNrdG9wLnNlbmRTZW5kZXJLZXkzJykgJiZcbiAgICBpc0VuYWJsZWQoJ2Rlc2t0b3Auc2VuZGVyS2V5LnNlbmQnKSAmJlxuICAgIG91ckNvbnZlcnNhdGlvbj8uZ2V0KCdjYXBhYmlsaXRpZXMnKT8uc2VuZGVyS2V5ICYmXG4gICAgc2VuZFRhcmdldC5pc1ZhbGlkKClcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBzZW5kVG9Hcm91cFZpYVNlbmRlcktleSh7XG4gICAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgICBjb250ZW50TWVzc2FnZSxcbiAgICAgICAgaXNQYXJ0aWFsU2VuZCxcbiAgICAgICAgbWVzc2FnZUlkLFxuICAgICAgICBvbmxpbmUsXG4gICAgICAgIHJlY2lwaWVudHMsXG4gICAgICAgIHJlY3Vyc2lvbkNvdW50OiAwLFxuICAgICAgICBzZW5kT3B0aW9ucyxcbiAgICAgICAgc2VuZFRhcmdldCxcbiAgICAgICAgc2VuZFR5cGUsXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3Nob3VsZEZhaWxTZW5kKGVycm9yLCBsb2dJZCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHNlbmRUb0dyb3VwLyR7bG9nSWR9OiBTZW5kZXIgS2V5IHNlbmQgZmFpbGVkLCBsb2dnaW5nLCBwcm9jZWVkaW5nIHRvIG5vcm1hbCBzZW5kYCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNlbmRMb2dDYWxsYmFjayA9IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZy5tYWtlU2VuZExvZ0NhbGxiYWNrKHtcbiAgICBjb250ZW50SGludCxcbiAgICBtZXNzYWdlSWQsXG4gICAgcHJvdG86IEJ1ZmZlci5mcm9tKFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKSksXG4gICAgc2VuZFR5cGUsXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfSk7XG4gIGNvbnN0IGdyb3VwSWQgPSBzZW5kVGFyZ2V0LmlzR3JvdXBWMigpID8gc2VuZFRhcmdldC5nZXRHcm91cElkKCkgOiB1bmRlZmluZWQ7XG4gIHJldHVybiB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcuc2VuZEdyb3VwUHJvdG8oe1xuICAgIGNvbnRlbnRIaW50LFxuICAgIGdyb3VwSWQsXG4gICAgb3B0aW9uczogeyAuLi5zZW5kT3B0aW9ucywgb25saW5lIH0sXG4gICAgcHJvdG86IGNvbnRlbnRNZXNzYWdlLFxuICAgIHJlY2lwaWVudHMsXG4gICAgc2VuZExvZ0NhbGxiYWNrLFxuICAgIHRpbWVzdGFtcCxcbiAgICB1cmdlbnQsXG4gIH0pO1xufVxuXG4vLyBUaGUgUHJpbWFyeSBTZW5kZXIgS2V5IHdvcmtmbG93XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kVG9Hcm91cFZpYVNlbmRlcktleShvcHRpb25zOiB7XG4gIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gIGNvbnRlbnRNZXNzYWdlOiBQcm90by5Db250ZW50O1xuICBpc1BhcnRpYWxTZW5kPzogYm9vbGVhbjtcbiAgbWVzc2FnZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIG9ubGluZT86IGJvb2xlYW47XG4gIHJlY2lwaWVudHM6IEFycmF5PHN0cmluZz47XG4gIHJlY3Vyc2lvbkNvdW50OiBudW1iZXI7XG4gIHNlbmRPcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlO1xuICBzZW5kVGFyZ2V0OiBTZW5kZXJLZXlUYXJnZXRUeXBlO1xuICBzZW5kVHlwZTogU2VuZFR5cGVzVHlwZTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIHVyZ2VudDogYm9vbGVhbjtcbn0pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICBjb25zdCB7XG4gICAgY29udGVudEhpbnQsXG4gICAgY29udGVudE1lc3NhZ2UsXG4gICAgaXNQYXJ0aWFsU2VuZCxcbiAgICBtZXNzYWdlSWQsXG4gICAgb25saW5lLFxuICAgIHJlY2lwaWVudHMsXG4gICAgcmVjdXJzaW9uQ291bnQsXG4gICAgc2VuZE9wdGlvbnMsXG4gICAgc2VuZFRhcmdldCxcbiAgICBzZW5kVHlwZSxcbiAgICB0aW1lc3RhbXAsXG4gICAgdXJnZW50LFxuICB9ID0gb3B0aW9ucztcbiAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gIGNvbnN0IGxvZ0lkID0gc2VuZFRhcmdldC5pZEZvckxvZ2dpbmcoKTtcbiAgbG9nLmluZm8oXG4gICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5LyR7bG9nSWR9OiBTdGFydGluZyAke3RpbWVzdGFtcH0sIHJlY3Vyc2lvbiBjb3VudCAke3JlY3Vyc2lvbkNvdW50fS4uLmBcbiAgKTtcblxuICBpZiAocmVjdXJzaW9uQ291bnQgPiBNQVhfUkVDVVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5LyR7bG9nSWR9OiBUb28gbXVjaCByZWN1cnNpb24hIENvdW50IGlzIGF0ICR7cmVjdXJzaW9uQ291bnR9YFxuICAgICk7XG4gIH1cblxuICBjb25zdCBncm91cElkID0gc2VuZFRhcmdldC5nZXRHcm91cElkKCk7XG4gIGlmICghc2VuZFRhcmdldC5pc1ZhbGlkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkvJHtsb2dJZH06IHNlbmRUYXJnZXQgaXMgbm90IHZhbGlkIWBcbiAgICApO1xuICB9XG5cbiAgaWYgKFxuICAgIGNvbnRlbnRIaW50ICE9PSBDb250ZW50SGludC5ERUZBVUxUICYmXG4gICAgY29udGVudEhpbnQgIT09IENvbnRlbnRIaW50LlJFU0VOREFCTEUgJiZcbiAgICBjb250ZW50SGludCAhPT0gQ29udGVudEhpbnQuSU1QTElDSVRcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5LyR7bG9nSWR9OiBJbnZhbGlkIGNvbnRlbnRIaW50ICR7Y29udGVudEhpbnR9YFxuICAgICk7XG4gIH1cblxuICBzdHJpY3RBc3NlcnQoXG4gICAgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLFxuICAgICdzZW5kVG9Hcm91cFZpYVNlbmRlcktleTogdGV4dHNlY3VyZS5tZXNzYWdpbmcgbm90IGF2YWlsYWJsZSEnXG4gICk7XG5cbiAgLy8gMS4gQWRkIHNlbmRlciBrZXkgaW5mbyBpZiB3ZSBoYXZlIG5vbmUsIG9yIGNsZWFyIG91dCBpZiBpdCdzIHRvbyBvbGRcbiAgY29uc3QgRVhQSVJFX0RVUkFUSU9OID0gZ2V0U2VuZGVyS2V5RXhwaXJlRHVyYXRpb24oKTtcblxuICAvLyBOb3RlOiBGcm9tIGhlcmUgb24sIGdlbmVyYWxseSBuZWVkIHRvIHJlY3Vyc2UgaWYgd2UgY2hhbmdlIHNlbmRlcktleUluZm9cbiAgY29uc3Qgc2VuZGVyS2V5SW5mbyA9IHNlbmRUYXJnZXQuZ2V0U2VuZGVyS2V5SW5mbygpO1xuXG4gIGlmICghc2VuZGVyS2V5SW5mbykge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5LyR7bG9nSWR9OiBBZGRpbmcgaW5pdGlhbCBzZW5kZXIga2V5IGluZm9gXG4gICAgKTtcbiAgICBhd2FpdCBzZW5kVGFyZ2V0LnNhdmVTZW5kZXJLZXlJbmZvKHtcbiAgICAgIGNyZWF0ZWRBdERhdGU6IERhdGUubm93KCksXG4gICAgICBkaXN0cmlidXRpb25JZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBtZW1iZXJEZXZpY2VzOiBbXSxcbiAgICB9KTtcblxuICAgIC8vIFJlc3RhcnQgaGVyZSBiZWNhdXNlIHdlIHVwZGF0ZWQgc2VuZGVyS2V5SW5mb1xuICAgIHJldHVybiBzZW5kVG9Hcm91cFZpYVNlbmRlcktleSh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgcmVjdXJzaW9uQ291bnQ6IHJlY3Vyc2lvbkNvdW50ICsgMSxcbiAgICB9KTtcbiAgfVxuICBpZiAoaXNPbGRlclRoYW4oc2VuZGVyS2V5SW5mby5jcmVhdGVkQXREYXRlLCBFWFBJUkVfRFVSQVRJT04pKSB7XG4gICAgY29uc3QgeyBjcmVhdGVkQXREYXRlIH0gPSBzZW5kZXJLZXlJbmZvO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5LyR7bG9nSWR9OiBSZXNldHRpbmcgc2VuZGVyIGtleTsgJHtjcmVhdGVkQXREYXRlfSBpcyB0b28gb2xkYFxuICAgICk7XG4gICAgYXdhaXQgcmVzZXRTZW5kZXJLZXkoc2VuZFRhcmdldCk7XG5cbiAgICAvLyBSZXN0YXJ0IGhlcmUgYmVjYXVzZSB3ZSB1cGRhdGVkIHNlbmRlcktleUluZm9cbiAgICByZXR1cm4gc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHJlY3Vyc2lvbkNvdW50OiByZWN1cnNpb25Db3VudCArIDEsXG4gICAgfSk7XG4gIH1cblxuICAvLyAyLiBGZXRjaCBhbGwgZGV2aWNlcyB3ZSBiZWxpZXZlIHdlJ2xsIGJlIHNlbmRpbmcgdG9cbiAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuICBjb25zdCB7IGRldmljZXM6IGN1cnJlbnREZXZpY2VzLCBlbXB0eUlkZW50aWZpZXJzIH0gPVxuICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuZ2V0T3BlbkRldmljZXMoXG4gICAgICBvdXJVdWlkLFxuICAgICAgcmVjaXBpZW50c1xuICAgICk7XG5cbiAgLy8gMy4gSWYgd2UgaGF2ZSBubyBvcGVuIHNlc3Npb25zIHdpdGggcGVvcGxlIHdlIGJlbGlldmUgd2UgYXJlIHNlbmRpbmcgdG8sIGFuZCB3ZVxuICAvLyAgIGJlbGlldmUgdGhhdCBhbnkgaGF2ZSBzaWduYWwgYWNjb3VudHMsIGZldGNoIHRoZWlyIHByZWtleSBidW5kbGUgYW5kIHN0YXJ0XG4gIC8vICAgc2Vzc2lvbnMgd2l0aCB0aGVtLlxuICBpZiAoXG4gICAgZW1wdHlJZGVudGlmaWVycy5sZW5ndGggPiAwICYmXG4gICAgZW1wdHlJZGVudGlmaWVycy5zb21lKGlzSWRlbnRpZmllclJlZ2lzdGVyZWQpXG4gICkge1xuICAgIGF3YWl0IGZldGNoS2V5c0ZvcklkZW50aWZpZXJzKGVtcHR5SWRlbnRpZmllcnMpO1xuXG4gICAgLy8gUmVzdGFydCBoZXJlIHRvIGNhcHR1cmUgZGV2aWNlcyBmb3IgYWNjb3VudHMgd2UganVzdCBzdGFydGVkIHNlc3Npb25zIHdpdGhcbiAgICByZXR1cm4gc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHJlY3Vyc2lvbkNvdW50OiByZWN1cnNpb25Db3VudCArIDEsXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCB7IG1lbWJlckRldmljZXMsIGRpc3RyaWJ1dGlvbklkLCBjcmVhdGVkQXREYXRlIH0gPSBzZW5kZXJLZXlJbmZvO1xuICBjb25zdCBtZW1iZXJTZXQgPSBuZXcgU2V0KHNlbmRUYXJnZXQuZ2V0TWVtYmVycygpKTtcblxuICAvLyA0LiBQYXJ0aXRpb24gZGV2aWNlcyBpbnRvIHNlbmRlciBrZXkgYW5kIG5vbi1zZW5kZXIga2V5IGdyb3Vwc1xuICBjb25zdCBbZGV2aWNlc0ZvclNlbmRlcktleSwgZGV2aWNlc0Zvck5vcm1hbFNlbmRdID0gcGFydGl0aW9uKFxuICAgIGN1cnJlbnREZXZpY2VzLFxuICAgIGRldmljZSA9PiBpc1ZhbGlkU2VuZGVyS2V5UmVjaXBpZW50KG1lbWJlclNldCwgZGV2aWNlLmlkZW50aWZpZXIpXG4gICk7XG5cbiAgY29uc3Qgc2VuZGVyS2V5UmVjaXBpZW50cyA9IGdldFV1aWRzRnJvbURldmljZXMoZGV2aWNlc0ZvclNlbmRlcktleSk7XG4gIGNvbnN0IG5vcm1hbFNlbmRSZWNpcGllbnRzID0gZ2V0VXVpZHNGcm9tRGV2aWNlcyhkZXZpY2VzRm9yTm9ybWFsU2VuZCk7XG4gIGxvZy5pbmZvKFxuICAgIGBzZW5kVG9Hcm91cFZpYVNlbmRlcktleS8ke2xvZ0lkfTpgICtcbiAgICAgIGAgJHtzZW5kZXJLZXlSZWNpcGllbnRzLmxlbmd0aH0gYWNjb3VudHMgZm9yIHNlbmRlciBrZXkgKCR7ZGV2aWNlc0ZvclNlbmRlcktleS5sZW5ndGh9IGRldmljZXMpLGAgK1xuICAgICAgYCAke25vcm1hbFNlbmRSZWNpcGllbnRzLmxlbmd0aH0gYWNjb3VudHMgZm9yIG5vcm1hbCBzZW5kICgke2RldmljZXNGb3JOb3JtYWxTZW5kLmxlbmd0aH0gZGV2aWNlcylgXG4gICk7XG5cbiAgLy8gNS4gRW5zdXJlIHdlIGhhdmUgZW5vdWdoIHJlY2lwaWVudHNcbiAgaWYgKHNlbmRlcktleVJlY2lwaWVudHMubGVuZ3RoIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBzZW5kVG9Hcm91cFZpYVNlbmRlcktleS8ke2xvZ0lkfTogTm90IGVub3VnaCByZWNpcGllbnRzIGZvciBTZW5kZXIgS2V5IG1lc3NhZ2UuIEZhaWxpbmcgb3Zlci5gXG4gICAgKTtcbiAgfVxuXG4gIC8vIDYuIEFuYWx5emUgdGFyZ2V0IGRldmljZXMgZm9yIHNlbmRlciBrZXksIGRldGVybWluZSB3aGljaCBoYXZlIGJlZW4gYWRkZWQgb3IgcmVtb3ZlZFxuICBjb25zdCB7XG4gICAgbmV3VG9NZW1iZXJEZXZpY2VzLFxuICAgIG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgcmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLFxuICAgIHJlbW92ZWRGcm9tTWVtYmVyVXVpZHMsXG4gIH0gPSBfYW5hbHl6ZVNlbmRlcktleURldmljZXMoXG4gICAgbWVtYmVyRGV2aWNlcyxcbiAgICBkZXZpY2VzRm9yU2VuZGVyS2V5LFxuICAgIGlzUGFydGlhbFNlbmRcbiAgKTtcblxuICAvLyA3LiBJZiBtZW1iZXJzIGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLCB3ZSBuZWVkIHRvIHJlc2V0IG91ciBzZW5kZXIga2V5LCB0aGVuXG4gIC8vICAgc3RhcnQgb3ZlciB0byBnZXQgYSBmcmVzaCBzZXQgb2YgdGFyZ2V0IGRldmljZXMuXG4gIGNvbnN0IGtleU5lZWRzUmVzZXQgPSBBcnJheS5mcm9tKHJlbW92ZWRGcm9tTWVtYmVyVXVpZHMpLnNvbWUoXG4gICAgdXVpZCA9PiAhc2VuZFRhcmdldC5oYXNNZW1iZXIodXVpZClcbiAgKTtcbiAgaWYgKGtleU5lZWRzUmVzZXQpIHtcbiAgICBhd2FpdCByZXNldFNlbmRlcktleShzZW5kVGFyZ2V0KTtcblxuICAgIC8vIFJlc3RhcnQgaGVyZSB0byBzdGFydCBvdmVyOyBlbXB0eSBtZW1iZXJEZXZpY2VzIG1lYW5zIHdlJ2xsIHNlbmQgZGlzdHJpYnV0aW9uXG4gICAgLy8gICBtZXNzYWdlIHRvIGV2ZXJ5b25lLlxuICAgIHJldHVybiBzZW5kVG9Hcm91cFZpYVNlbmRlcktleSh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgcmVjdXJzaW9uQ291bnQ6IHJlY3Vyc2lvbkNvdW50ICsgMSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIDguIElmIHRoZXJlIGFyZSBuZXcgbWVtYmVycyBvciBuZXcgZGV2aWNlcyBpbiB0aGUgZ3JvdXAsIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgdGhleVxuICAvLyAgIGhhdmUgb3VyIHNlbmRlciBrZXkgYmVmb3JlIHdlIHNlbmQgc2VuZGVyIGtleSBtZXNzYWdlcyB0byB0aGVtLlxuICBpZiAobmV3VG9NZW1iZXJVdWlkcy5sZW5ndGggPiAwKSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkvJHtsb2dJZH06IFNlbmRpbmcgc2VuZGVyIGtleSB0byAke1xuICAgICAgICBuZXdUb01lbWJlclV1aWRzLmxlbmd0aFxuICAgICAgfSBtZW1iZXJzOiAke0pTT04uc3RyaW5naWZ5KG5ld1RvTWVtYmVyVXVpZHMpfWBcbiAgICApO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLnNlbmRTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgICAgICAgZGlzdHJpYnV0aW9uSWQsXG4gICAgICAgICAgICBncm91cElkLFxuICAgICAgICAgICAgaWRlbnRpZmllcnM6IG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgICAgICAgICB1cmdlbnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZW5kT3B0aW9ucyA/IHsgLi4uc2VuZE9wdGlvbnMsIG9ubGluZTogZmFsc2UgfSA6IHVuZGVmaW5lZFxuICAgICAgICApLFxuICAgICAgICB7IG1lc3NhZ2VJZHM6IFtdLCBzZW5kVHlwZTogJ3NlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UnIH1cbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIElmIHdlIHBhcnRpYWxseSBmYWlsIHRvIHNlbmQgdGhlIHNlbmRlciBrZXkgZGlzdHJpYnV0aW9uIG1lc3NhZ2UgKFNLRE0pLCB3ZSBkb24ndFxuICAgICAgLy8gICB3YW50IHRoZSBzdWNjZXNzZnVsIFNLRE0gc2VuZHMgdG8gYmUgY29uc2lkZXJlZCBhbiBvdmVyYWxsIHN1Y2Nlc3MuXG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBTZW5kTWVzc2FnZVByb3RvRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlbmRNZXNzYWdlUHJvdG9FcnJvcih7XG4gICAgICAgICAgLi4uZXJyb3IsXG4gICAgICAgICAgc2VuZElzTm90RmluYWw6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbWVtYmVyRGV2aWNlcyB3aXRoIG5ldyBkZXZpY2VzXG4gICAgY29uc3QgdXBkYXRlZE1lbWJlckRldmljZXMgPSBbLi4ubWVtYmVyRGV2aWNlcywgLi4ubmV3VG9NZW1iZXJEZXZpY2VzXTtcblxuICAgIGF3YWl0IHNlbmRUYXJnZXQuc2F2ZVNlbmRlcktleUluZm8oe1xuICAgICAgY3JlYXRlZEF0RGF0ZSxcbiAgICAgIGRpc3RyaWJ1dGlvbklkLFxuICAgICAgbWVtYmVyRGV2aWNlczogdXBkYXRlZE1lbWJlckRldmljZXMsXG4gICAgfSk7XG5cbiAgICAvLyBSZXN0YXJ0IGhlcmUgYmVjYXVzZSB3ZSBtaWdodCBoYXZlIGRpc2NvdmVyZWQgbmV3IG9yIGRyb3BwZWQgZGV2aWNlcyBhcyBwYXJ0IG9mXG4gICAgLy8gICBkaXN0cmlidXRpbmcgb3VyIHNlbmRlciBrZXkuXG4gICAgcmV0dXJuIHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5KHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICByZWN1cnNpb25Db3VudDogcmVjdXJzaW9uQ291bnQgKyAxLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gOS4gVXBkYXRlIG1lbWJlckRldmljZXMgd2l0aCByZW1vdmFscyB3aGljaCBkaWRuJ3QgcmVxdWlyZSBhIHJlc2V0LlxuICBpZiAocmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCB1cGRhdGVkTWVtYmVyRGV2aWNlcyA9IFtcbiAgICAgIC4uLmRpZmZlcmVuY2VXaXRoPERldmljZVR5cGUsIERldmljZVR5cGU+KFxuICAgICAgICBtZW1iZXJEZXZpY2VzLFxuICAgICAgICByZW1vdmVkRnJvbU1lbWJlckRldmljZXMsXG4gICAgICAgIGRldmljZUNvbXBhcmF0b3JcbiAgICAgICksXG4gICAgXTtcblxuICAgIGF3YWl0IHNlbmRUYXJnZXQuc2F2ZVNlbmRlcktleUluZm8oe1xuICAgICAgY3JlYXRlZEF0RGF0ZSxcbiAgICAgIGRpc3RyaWJ1dGlvbklkLFxuICAgICAgbWVtYmVyRGV2aWNlczogdXBkYXRlZE1lbWJlckRldmljZXMsXG4gICAgfSk7XG5cbiAgICAvLyBOb3RlLCB3ZSBkbyBub3QgbmVlZCB0byByZXN0YXJ0IGhlcmUgYmVjYXVzZSB3ZSBkb24ndCByZWZlciBiYWNrIHRvIHNlbmRlcktleUluZm9cbiAgICAvLyAgIGFmdGVyIHRoaXMgcG9pbnQuXG4gIH1cblxuICAvLyAxMC4gU2VuZCB0aGUgU2VuZGVyIEtleSBtZXNzYWdlIVxuICBsZXQgc2VuZExvZ0lkOiBudW1iZXI7XG4gIGxldCBzZW5kZXJLZXlSZWNpcGllbnRzV2l0aERldmljZXM6IFJlY29yZDxzdHJpbmcsIEFycmF5PG51bWJlcj4+ID0ge307XG4gIGRldmljZXNGb3JTZW5kZXJLZXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICBjb25zdCB7IGlkLCBpZGVudGlmaWVyIH0gPSBpdGVtO1xuICAgIHNlbmRlcktleVJlY2lwaWVudHNXaXRoRGV2aWNlc1tpZGVudGlmaWVyXSB8fD0gW107XG4gICAgc2VuZGVyS2V5UmVjaXBpZW50c1dpdGhEZXZpY2VzW2lkZW50aWZpZXJdLnB1c2goaWQpO1xuICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IG1lc3NhZ2VCdWZmZXIgPSBhd2FpdCBlbmNyeXB0Rm9yU2VuZGVyS2V5KHtcbiAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgZGV2aWNlczogZGV2aWNlc0ZvclNlbmRlcktleSxcbiAgICAgIGRpc3RyaWJ1dGlvbklkLFxuICAgICAgY29udGVudE1lc3NhZ2U6IFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKSxcbiAgICAgIGdyb3VwSWQsXG4gICAgfSk7XG4gICAgY29uc3QgYWNjZXNzS2V5cyA9IGdldFhvck9mQWNjZXNzS2V5cyhkZXZpY2VzRm9yU2VuZGVyS2V5KTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZy5zZXJ2ZXIuc2VuZFdpdGhTZW5kZXJLZXkoXG4gICAgICBtZXNzYWdlQnVmZmVyLFxuICAgICAgYWNjZXNzS2V5cyxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIHsgb25saW5lLCB1cmdlbnQgfVxuICAgICk7XG5cbiAgICBjb25zdCBwYXJzZWQgPSBtdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlU2NoZW1hLnNhZmVQYXJzZShyZXN1bHQpO1xuICAgIGlmIChwYXJzZWQuc3VjY2Vzcykge1xuICAgICAgY29uc3QgeyB1dWlkczQwNCB9ID0gcGFyc2VkLmRhdGE7XG4gICAgICBpZiAodXVpZHM0MDQgJiYgdXVpZHM0MDQubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBfd2FpdEZvckFsbCh7XG4gICAgICAgICAgdGFza3M6IHV1aWRzNDA0Lm1hcChcbiAgICAgICAgICAgIHV1aWQgPT4gYXN5bmMgKCkgPT4gbWFya0lkZW50aWZpZXJVbnJlZ2lzdGVyZWQodXVpZClcbiAgICAgICAgICApLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc2VuZGVyS2V5UmVjaXBpZW50c1dpdGhEZXZpY2VzID0gb21pdChcbiAgICAgICAgc2VuZGVyS2V5UmVjaXBpZW50c1dpdGhEZXZpY2VzLFxuICAgICAgICB1dWlkczQwNCB8fCBbXVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkvJHtsb2dJZH06IFNlcnZlciByZXR1cm5lZCB1bmV4cGVjdGVkIDIwMCByZXNwb25zZSAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgIHBhcnNlZC5lcnJvci5mbGF0dGVuKClcbiAgICAgICAgKX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRTYXZlUHJvdG8oc2VuZFR5cGUpKSB7XG4gICAgICBzZW5kTG9nSWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuaW5zZXJ0U2VudFByb3RvKFxuICAgICAgICB7XG4gICAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgICAgcHJvdG86IEJ1ZmZlci5mcm9tKFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKSksXG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIHVyZ2VudCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlY2lwaWVudHM6IHNlbmRlcktleVJlY2lwaWVudHNXaXRoRGV2aWNlcyxcbiAgICAgICAgICBtZXNzYWdlSWRzOiBtZXNzYWdlSWQgPyBbbWVzc2FnZUlkXSA6IFtdLFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IuY29kZSA9PT0gRVJST1JfRVhQSVJFRF9PUl9NSVNTSU5HX0RFVklDRVMpIHtcbiAgICAgIGF3YWl0IGhhbmRsZTQwOVJlc3BvbnNlKGxvZ0lkLCBlcnJvcik7XG5cbiAgICAgIC8vIFJlc3RhcnQgaGVyZSB0byBjYXB0dXJlIHRoZSByaWdodCBzZXQgb2YgZGV2aWNlcyBmb3Igb3VyIG5leHQgc2VuZC5cbiAgICAgIHJldHVybiBzZW5kVG9Hcm91cFZpYVNlbmRlcktleSh7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHJlY3Vyc2lvbkNvdW50OiByZWN1cnNpb25Db3VudCArIDEsXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGVycm9yLmNvZGUgPT09IEVSUk9SX1NUQUxFX0RFVklDRVMpIHtcbiAgICAgIGF3YWl0IGhhbmRsZTQxMFJlc3BvbnNlKHNlbmRUYXJnZXQsIGVycm9yKTtcblxuICAgICAgLy8gUmVzdGFydCBoZXJlIHRvIHVzZSB0aGUgcmlnaHQgcmVnaXN0cmF0aW9uSWRzIGZvciBkZXZpY2VzIHdlIGFscmVhZHkga25ldyBhYm91dCxcbiAgICAgIC8vICAgYXMgd2VsbCBhcyBzZW5kIG91ciBzZW5kZXIga2V5IHRvIHRoZXNlIHJlLXJlZ2lzdGVyZWQgb3IgcmUtbGlua2VkIGRldmljZXMuXG4gICAgICByZXR1cm4gc2VuZFRvR3JvdXBWaWFTZW5kZXJLZXkoe1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICByZWN1cnNpb25Db3VudDogcmVjdXJzaW9uQ291bnQgKyAxLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChlcnJvci5jb2RlID09PSBFcnJvckNvZGUuSW52YWxpZFJlZ2lzdHJhdGlvbklkICYmIGVycm9yLmFkZHIpIHtcbiAgICAgIGNvbnN0IGFkZHJlc3MgPSBlcnJvci5hZGRyIGFzIFByb3RvY29sQWRkcmVzcztcbiAgICAgIGNvbnN0IG5hbWUgPSBhZGRyZXNzLm5hbWUoKTtcblxuICAgICAgY29uc3QgYnJva2VuQWNjb3VudCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChuYW1lKTtcbiAgICAgIGlmIChicm9rZW5BY2NvdW50KSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBzZW5kVG9Hcm91cFZpYVNlbmRlcktleS8ke2xvZ0lkfTogRGlzYWJsaW5nIHNlYWxlZCBzZW5kZXIgZm9yICR7YnJva2VuQWNjb3VudC5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICAgICk7XG4gICAgICAgIGJyb2tlbkFjY291bnQuc2V0KHsgc2VhbGVkU2VuZGVyOiBTRUFMRURfU0VOREVSLkRJU0FCTEVEIH0pO1xuICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKGJyb2tlbkFjY291bnQuYXR0cmlidXRlcyk7XG5cbiAgICAgICAgLy8gTm93IHRoYXQgd2UndmUgZWxpbWluYXRlIHRoaXMgcHJvYmxlbWF0aWMgYWNjb3VudCwgd2UgY2FuIHRyeSB0aGUgc2VuZCBhZ2Fpbi5cbiAgICAgICAgcmV0dXJuIHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5KHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIHJlY3Vyc2lvbkNvdW50OiByZWN1cnNpb25Db3VudCArIDEsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBzZW5kVG9Hcm91cFZpYVNlbmRlcktleS8ke2xvZ0lkfTogUmV0dXJuZWQgdW5leHBlY3RlZCBlcnJvciAke1xuICAgICAgICBlcnJvci5jb2RlXG4gICAgICB9LiBGYWlsaW5nIG92ZXIuICR7ZXJyb3Iuc3RhY2sgfHwgZXJyb3J9YFxuICAgICk7XG4gIH1cblxuICAvLyAxMS4gUmV0dXJuIGVhcmx5IGlmIHRoZXJlIGFyZSBubyBub3JtYWwgc2VuZCByZWNpcGllbnRzXG4gIGlmIChub3JtYWxTZW5kUmVjaXBpZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YU1lc3NhZ2U6IGNvbnRlbnRNZXNzYWdlLmRhdGFNZXNzYWdlXG4gICAgICAgID8gUHJvdG8uRGF0YU1lc3NhZ2UuZW5jb2RlKGNvbnRlbnRNZXNzYWdlLmRhdGFNZXNzYWdlKS5maW5pc2goKVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2Nlc3NmdWxJZGVudGlmaWVyczogc2VuZGVyS2V5UmVjaXBpZW50cyxcbiAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJpZXM6IHNlbmRlcktleVJlY2lwaWVudHMsXG5cbiAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgY29udGVudFByb3RvOiBCdWZmZXIuZnJvbShQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKCkpLFxuICAgICAgcmVjaXBpZW50czogc2VuZGVyS2V5UmVjaXBpZW50c1dpdGhEZXZpY2VzLFxuICAgICAgdXJnZW50LFxuICAgIH07XG4gIH1cblxuICAvLyAxMi4gU2VuZCBub3JtYWwgbWVzc2FnZSB0byB0aGUgbGVmdG92ZXIgbm9ybWFsIHJlY2lwaWVudHMuIFRoZW4gY29tYmluZSBub3JtYWwgc2VuZFxuICAvLyAgICByZXN1bHQgd2l0aCByZXN1bHQgZnJvbSBzZW5kZXIga2V5IHNlbmQgZm9yIGZpbmFsIHJldHVybiB2YWx1ZS5cblxuICAvLyBXZSBkb24ndCB3YW50IHRvIHVzZSBhIG5vcm1hbCBzZW5kIGxvZyBjYWxsYmFjayBoZXJlLCBiZWNhdXNlIHRoZSBwcm90byBoYXMgYWxyZWFkeVxuICAvLyAgIGJlZW4gc2F2ZWQgYXMgcGFydCBvZiB0aGUgU2VuZGVyIEtleSBzZW5kLiBXZSdyZSBqdXN0IGFkZGluZyByZWNpcGllbnRzIGhlcmUuXG4gIGNvbnN0IHNlbmRMb2dDYWxsYmFjazogU2VuZExvZ0NhbGxiYWNrVHlwZSA9IGFzeW5jICh7XG4gICAgaWRlbnRpZmllcixcbiAgICBkZXZpY2VJZHMsXG4gIH06IHtcbiAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gICAgZGV2aWNlSWRzOiBBcnJheTxudW1iZXI+O1xuICB9KSA9PiB7XG4gICAgaWYgKCFzaG91bGRTYXZlUHJvdG8oc2VuZFR5cGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VudFRvQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuICAgIGlmICghc2VudFRvQ29udmVyc2F0aW9uKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5L2NhbGxiYWNrOiBVbmFibGUgdG8gZmluZCBjb252ZXJzYXRpb24gZm9yIGlkZW50aWZpZXIgJHtpZGVudGlmaWVyfWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlY2lwaWVudFV1aWQgPSBzZW50VG9Db252ZXJzYXRpb24uZ2V0KCd1dWlkJyk7XG4gICAgaWYgKCFyZWNpcGllbnRVdWlkKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHNlbmRUb0dyb3VwVmlhU2VuZGVyS2V5L2NhbGxiYWNrOiBDb252ZXJzYXRpb24gJHtzZW50VG9Db252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGhhZCBubyBVVUlEYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuaW5zZXJ0UHJvdG9SZWNpcGllbnRzKHtcbiAgICAgIGlkOiBzZW5kTG9nSWQsXG4gICAgICByZWNpcGllbnRVdWlkLFxuICAgICAgZGV2aWNlSWRzLFxuICAgIH0pO1xuICB9O1xuXG4gIHRyeSB7XG4gICAgY29uc3Qgbm9ybWFsU2VuZFJlc3VsdCA9IGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZy5zZW5kR3JvdXBQcm90byh7XG4gICAgICBjb250ZW50SGludCxcbiAgICAgIGdyb3VwSWQsXG4gICAgICBvcHRpb25zOiB7IC4uLnNlbmRPcHRpb25zLCBvbmxpbmUgfSxcbiAgICAgIHByb3RvOiBjb250ZW50TWVzc2FnZSxcbiAgICAgIHJlY2lwaWVudHM6IG5vcm1hbFNlbmRSZWNpcGllbnRzLFxuICAgICAgc2VuZExvZ0NhbGxiYWNrLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgdXJnZW50LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1lcmdlU2VuZFJlc3VsdCh7XG4gICAgICByZXN1bHQ6IG5vcm1hbFNlbmRSZXN1bHQsXG4gICAgICBzZW5kZXJLZXlSZWNpcGllbnRzLFxuICAgICAgc2VuZGVyS2V5UmVjaXBpZW50c1dpdGhEZXZpY2VzLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFNlbmRNZXNzYWdlUHJvdG9FcnJvcikge1xuICAgICAgY29uc3QgY2FsbGJhY2tSZXN1bHQgPSBtZXJnZVNlbmRSZXN1bHQoe1xuICAgICAgICByZXN1bHQ6IGVycm9yLFxuICAgICAgICBzZW5kZXJLZXlSZWNpcGllbnRzLFxuICAgICAgICBzZW5kZXJLZXlSZWNpcGllbnRzV2l0aERldmljZXMsXG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBTZW5kTWVzc2FnZVByb3RvRXJyb3IoY2FsbGJhY2tSZXN1bHQpO1xuICAgIH1cblxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8vIFV0aWxpdHkgTWV0aG9kc1xuXG5mdW5jdGlvbiBtZXJnZVNlbmRSZXN1bHQoe1xuICByZXN1bHQsXG4gIHNlbmRlcktleVJlY2lwaWVudHMsXG4gIHNlbmRlcktleVJlY2lwaWVudHNXaXRoRGV2aWNlcyxcbn06IHtcbiAgcmVzdWx0OiBDYWxsYmFja1Jlc3VsdFR5cGUgfCBTZW5kTWVzc2FnZVByb3RvRXJyb3I7XG4gIHNlbmRlcktleVJlY2lwaWVudHM6IEFycmF5PHN0cmluZz47XG4gIHNlbmRlcktleVJlY2lwaWVudHNXaXRoRGV2aWNlczogUmVjb3JkPHN0cmluZywgQXJyYXk8bnVtYmVyPj47XG59KTogQ2FsbGJhY2tSZXN1bHRUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN1bHQsXG4gICAgc3VjY2Vzc2Z1bElkZW50aWZpZXJzOiBbXG4gICAgICAuLi4ocmVzdWx0LnN1Y2Nlc3NmdWxJZGVudGlmaWVycyB8fCBbXSksXG4gICAgICAuLi5zZW5kZXJLZXlSZWNpcGllbnRzLFxuICAgIF0sXG4gICAgdW5pZGVudGlmaWVkRGVsaXZlcmllczogW1xuICAgICAgLi4uKHJlc3VsdC51bmlkZW50aWZpZWREZWxpdmVyaWVzIHx8IFtdKSxcbiAgICAgIC4uLnNlbmRlcktleVJlY2lwaWVudHMsXG4gICAgXSxcbiAgICByZWNpcGllbnRzOiB7XG4gICAgICAuLi5yZXN1bHQucmVjaXBpZW50cyxcbiAgICAgIC4uLnNlbmRlcktleVJlY2lwaWVudHNXaXRoRGV2aWNlcyxcbiAgICB9LFxuICB9O1xufVxuXG5jb25zdCBNQVhfU0VOREVSX0tFWV9FWFBJUkVfRFVSQVRJT04gPSA5MCAqIERBWTtcblxuZnVuY3Rpb24gZ2V0U2VuZGVyS2V5RXhwaXJlRHVyYXRpb24oKTogbnVtYmVyIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludE9yVGhyb3coXG4gICAgICBnZXRWYWx1ZSgnZGVza3RvcC5zZW5kZXJLZXlNYXhBZ2UnKSxcbiAgICAgICdnZXRTZW5kZXJLZXlFeHBpcmVEdXJhdGlvbidcbiAgICApO1xuXG4gICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLm1pbihwYXJzZWQsIE1BWF9TRU5ERVJfS0VZX0VYUElSRV9EVVJBVElPTik7XG4gICAgbG9nLmluZm8oXG4gICAgICBgZ2V0U2VuZGVyS2V5RXhwaXJlRHVyYXRpb246IHVzaW5nIGV4cGlyZSBkdXJhdGlvbiBvZiAke2R1cmF0aW9ufWBcbiAgICApO1xuXG4gICAgcmV0dXJuIGR1cmF0aW9uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGdldFNlbmRlcktleUV4cGlyZUR1cmF0aW9uOiBGYWlsZWQgdG8gcGFyc2UgaW50ZWdlci4gVXNpbmcgZGVmYXVsdCBvZiAke01BWF9TRU5ERVJfS0VZX0VYUElSRV9EVVJBVElPTn0uYCxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICk7XG4gICAgcmV0dXJuIE1BWF9TRU5ERVJfS0VZX0VYUElSRV9EVVJBVElPTjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3Nob3VsZEZhaWxTZW5kKGVycm9yOiB1bmtub3duLCBsb2dJZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGxvZ0Vycm9yID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgIGxvZy5lcnJvcihgX3Nob3VsZEZhaWxTZW5kLyR7bG9nSWR9OiAke21lc3NhZ2V9YCk7XG4gIH07XG5cbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygndW50cnVzdGVkIGlkZW50aXR5JykpIHtcbiAgICBsb2dFcnJvcihcIid1bnRydXN0ZWQgaWRlbnRpdHknIGVycm9yLCBmYWlsaW5nLlwiKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChlcnJvciBpbnN0YW5jZW9mIE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvcikge1xuICAgIGxvZ0Vycm9yKCdPdXRnb2luZ0lkZW50aXR5S2V5RXJyb3IgZXJyb3IsIGZhaWxpbmcuJyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IpIHtcbiAgICBsb2dFcnJvcignVW5yZWdpc3RlcmVkVXNlckVycm9yIGVycm9yLCBmYWlsaW5nLicpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgQ29ubmVjdFRpbWVvdXRFcnJvcikge1xuICAgIGxvZ0Vycm9yKCdDb25uZWN0VGltZW91dEVycm9yIGVycm9yLCBmYWlsaW5nLicpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gS25vd24gZXJyb3IgdHlwZXMgY2FwdHVyZWQgaGVyZTpcbiAgLy8gICBIVFRQRXJyb3JcbiAgLy8gICBPdXRnb2luZ01lc3NhZ2VFcnJvclxuICAvLyAgIFNlbmRNZXNzYWdlTmV0d29ya0Vycm9yXG4gIC8vICAgU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvclxuICAvLyAgIE1lc3NhZ2VFcnJvclxuICBpZiAoaXNSZWNvcmQoZXJyb3IpICYmIHR5cGVvZiBlcnJvci5jb2RlID09PSAnbnVtYmVyJykge1xuICAgIGlmIChlcnJvci5jb2RlID09PSA0MDApIHtcbiAgICAgIGxvZ0Vycm9yKCdJbnZhbGlkIHJlcXVlc3QsIGZhaWxpbmcuJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IuY29kZSA9PT0gNDAxKSB7XG4gICAgICBsb2dFcnJvcignUGVybWlzc2lvbnMgZXJyb3IsIGZhaWxpbmcuJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IuY29kZSA9PT0gNDA0KSB7XG4gICAgICBsb2dFcnJvcignTWlzc2luZyB1c2VyIG9yIGVuZHBvaW50IGVycm9yLCBmYWlsaW5nLicpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IDQxMyB8fCBlcnJvci5jb2RlID09PSA0MjkpIHtcbiAgICAgIGxvZ0Vycm9yKCdSYXRlIGxpbWl0IGVycm9yLCBmYWlsaW5nLicpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IDQyOCkge1xuICAgICAgbG9nRXJyb3IoJ0NoYWxsZW5nZSBlcnJvciwgZmFpbGluZy4nKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChlcnJvci5jb2RlID09PSA1MDApIHtcbiAgICAgIGxvZ0Vycm9yKCdTZXJ2ZXIgZXJyb3IsIGZhaWxpbmcuJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IuY29kZSA9PT0gNTA4KSB7XG4gICAgICBsb2dFcnJvcignRmFpbCBqb2IgZXJyb3IsIGZhaWxpbmcuJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBTZW5kTWVzc2FnZVByb3RvRXJyb3IpIHtcbiAgICBpZiAoIWVycm9yLmVycm9ycyB8fCAhZXJyb3IuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgbG9nRXJyb3IoJ1NlbmRNZXNzYWdlUHJvdG9FcnJvciBoYWQgbm8gZXJyb3JzLCBmYWlsaW5nLicpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBpbm5lckVycm9yIG9mIGVycm9yLmVycm9ycykge1xuICAgICAgY29uc3Qgc2hvdWxkRmFpbCA9IF9zaG91bGRGYWlsU2VuZChpbm5lckVycm9yLCBsb2dJZCk7XG4gICAgICBpZiAoc2hvdWxkRmFpbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfd2FpdEZvckFsbDxUPih7XG4gIHRhc2tzLFxuICBtYXhDb25jdXJyZW5jeSA9IE1BWF9DT05DVVJSRU5DWSxcbn06IHtcbiAgdGFza3M6IEFycmF5PCgpID0+IFByb21pc2U8VD4+O1xuICBtYXhDb25jdXJyZW5jeT86IG51bWJlcjtcbn0pOiBQcm9taXNlPEFycmF5PFQ+PiB7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IFBRdWV1ZSh7XG4gICAgY29uY3VycmVuY3k6IG1heENvbmN1cnJlbmN5LFxuICAgIHRpbWVvdXQ6IE1JTlVURSAqIDMwLFxuICAgIHRocm93T25UaW1lb3V0OiB0cnVlLFxuICB9KTtcbiAgcmV0dXJuIHF1ZXVlLmFkZEFsbCh0YXNrcyk7XG59XG5cbmZ1bmN0aW9uIGdldFJlY2lwaWVudHMob3B0aW9uczogR3JvdXBTZW5kT3B0aW9uc1R5cGUpOiBBcnJheTxzdHJpbmc+IHtcbiAgaWYgKG9wdGlvbnMuZ3JvdXBWMikge1xuICAgIHJldHVybiBvcHRpb25zLmdyb3VwVjIubWVtYmVycztcbiAgfVxuICBpZiAob3B0aW9ucy5ncm91cFYxKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZ3JvdXBWMS5tZW1iZXJzO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdnZXRSZWNpcGllbnRzOiBVbmFibGUgdG8gZXh0cmFjdCByZWNpcGllbnRzIScpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrSWRlbnRpZmllclVucmVnaXN0ZXJlZChpZGVudGlmaWVyOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoXG4gICAgaWRlbnRpZmllcixcbiAgICAncHJpdmF0ZSdcbiAgKTtcblxuICBjb252ZXJzYXRpb24uc2V0VW5yZWdpc3RlcmVkKCk7XG4gIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuXG4gIGNvbnN0IHV1aWQgPSBVVUlELmxvb2t1cChpZGVudGlmaWVyKTtcbiAgaWYgKCF1dWlkKSB7XG4gICAgbG9nLndhcm4oYE5vIHV1aWQgZm91bmQgZm9yICR7aWRlbnRpZmllcn1gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVBbGxTZXNzaW9ucyh1dWlkKTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyUmVnaXN0ZXJlZChpZGVudGlmaWVyOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoXG4gICAgaWRlbnRpZmllcixcbiAgICAncHJpdmF0ZSdcbiAgKTtcbiAgY29uc3QgaXNVbnJlZ2lzdGVyZWQgPSBjb252ZXJzYXRpb24uaXNVbnJlZ2lzdGVyZWQoKTtcblxuICByZXR1cm4gIWlzVW5yZWdpc3RlcmVkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGU0MDlSZXNwb25zZShsb2dJZDogc3RyaW5nLCBlcnJvcjogSFRUUEVycm9yKSB7XG4gIGNvbnN0IHBhcnNlZCA9IG11bHRpUmVjaXBpZW50NDA5UmVzcG9uc2VTY2hlbWEuc2FmZVBhcnNlKGVycm9yLnJlc3BvbnNlKTtcbiAgaWYgKHBhcnNlZC5zdWNjZXNzKSB7XG4gICAgYXdhaXQgX3dhaXRGb3JBbGwoe1xuICAgICAgdGFza3M6IHBhcnNlZC5kYXRhLm1hcChpdGVtID0+IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgeyB1dWlkLCBkZXZpY2VzIH0gPSBpdGVtO1xuICAgICAgICAvLyBTdGFydCBuZXcgc2Vzc2lvbnMgd2l0aCBkZXZpY2VzIHdlIGRpZG4ndCBrbm93IGFib3V0IGJlZm9yZVxuICAgICAgICBpZiAoZGV2aWNlcy5taXNzaW5nRGV2aWNlcyAmJiBkZXZpY2VzLm1pc3NpbmdEZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhd2FpdCBmZXRjaEtleXNGb3JJZGVudGlmaWVyKHV1aWQsIGRldmljZXMubWlzc2luZ0RldmljZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXJjaGl2ZSBzZXNzaW9ucyB3aXRoIGRldmljZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZFxuICAgICAgICBpZiAoZGV2aWNlcy5leHRyYURldmljZXMgJiYgZGV2aWNlcy5leHRyYURldmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcblxuICAgICAgICAgIGF3YWl0IF93YWl0Rm9yQWxsKHtcbiAgICAgICAgICAgIHRhc2tzOiBkZXZpY2VzLmV4dHJhRGV2aWNlcy5tYXAoZGV2aWNlSWQgPT4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVTZXNzaW9uKFxuICAgICAgICAgICAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIEFkZHJlc3MuY3JlYXRlKHV1aWQsIGRldmljZUlkKSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIG1heENvbmN1cnJlbmN5OiAyLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBoYW5kbGU0MDlSZXNwb25zZS8ke2xvZ0lkfTogU2VydmVyIHJldHVybmVkIHVuZXhwZWN0ZWQgNDA5IHJlc3BvbnNlICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIHBhcnNlZC5lcnJvci5mbGF0dGVuKClcbiAgICAgICl9YFxuICAgICk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlNDEwUmVzcG9uc2UoXG4gIHNlbmRUYXJnZXQ6IFNlbmRlcktleVRhcmdldFR5cGUsXG4gIGVycm9yOiBIVFRQRXJyb3Jcbikge1xuICBjb25zdCBsb2dJZCA9IHNlbmRUYXJnZXQuaWRGb3JMb2dnaW5nKCk7XG5cbiAgY29uc3QgcGFyc2VkID0gbXVsdGlSZWNpcGllbnQ0MTBSZXNwb25zZVNjaGVtYS5zYWZlUGFyc2UoZXJyb3IucmVzcG9uc2UpO1xuICBpZiAocGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICBhd2FpdCBfd2FpdEZvckFsbCh7XG4gICAgICB0YXNrczogcGFyc2VkLmRhdGEubWFwKGl0ZW0gPT4gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB7IHV1aWQsIGRldmljZXMgfSA9IGl0ZW07XG4gICAgICAgIGlmIChkZXZpY2VzLnN0YWxlRGV2aWNlcyAmJiBkZXZpY2VzLnN0YWxlRGV2aWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgICAgICAgLy8gRmlyc3QsIGFyY2hpdmUgb3VyIGV4aXN0aW5nIHNlc3Npb25zIHdpdGggdGhlc2UgZGV2aWNlc1xuICAgICAgICAgIGF3YWl0IF93YWl0Rm9yQWxsKHtcbiAgICAgICAgICAgIHRhc2tzOiBkZXZpY2VzLnN0YWxlRGV2aWNlcy5tYXAoZGV2aWNlSWQgPT4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVTZXNzaW9uKFxuICAgICAgICAgICAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIEFkZHJlc3MuY3JlYXRlKHV1aWQsIGRldmljZUlkKSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gU3RhcnQgbmV3IHNlc3Npb25zIHdpdGggdGhlc2UgZGV2aWNlc1xuICAgICAgICAgIGF3YWl0IGZldGNoS2V5c0ZvcklkZW50aWZpZXIodXVpZCwgZGV2aWNlcy5zdGFsZURldmljZXMpO1xuXG4gICAgICAgICAgLy8gRm9yZ2V0IHRoYXQgd2UndmUgc2VudCBvdXIgc2VuZGVyIGtleSB0byB0aGVzZSBkZXZpY2VzLCBzaW5jZSB0aGV5J3ZlXG4gICAgICAgICAgLy8gICBiZWVuIHJlLXJlZ2lzdGVyZWQgb3IgcmUtbGlua2VkLlxuICAgICAgICAgIGNvbnN0IHNlbmRlcktleUluZm8gPSBzZW5kVGFyZ2V0LmdldFNlbmRlcktleUluZm8oKTtcbiAgICAgICAgICBpZiAoc2VuZGVyS2V5SW5mbykge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlc1RvUmVtb3ZlOiBBcnJheTxQYXJ0aWFsRGV2aWNlVHlwZT4gPVxuICAgICAgICAgICAgICBkZXZpY2VzLnN0YWxlRGV2aWNlcy5tYXAoaWQgPT4gKHsgaWQsIGlkZW50aWZpZXI6IHV1aWQgfSkpO1xuICAgICAgICAgICAgYXdhaXQgc2VuZFRhcmdldC5zYXZlU2VuZGVyS2V5SW5mbyh7XG4gICAgICAgICAgICAgIC4uLnNlbmRlcktleUluZm8sXG4gICAgICAgICAgICAgIG1lbWJlckRldmljZXM6IGRpZmZlcmVuY2VXaXRoKFxuICAgICAgICAgICAgICAgIHNlbmRlcktleUluZm8ubWVtYmVyRGV2aWNlcyxcbiAgICAgICAgICAgICAgICBkZXZpY2VzVG9SZW1vdmUsXG4gICAgICAgICAgICAgICAgcGFydGlhbERldmljZUNvbXBhcmF0b3JcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBtYXhDb25jdXJyZW5jeTogMixcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgaGFuZGxlNDEwUmVzcG9uc2UvJHtsb2dJZH06IFNlcnZlciByZXR1cm5lZCB1bmV4cGVjdGVkIDQxMCByZXNwb25zZSAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICBwYXJzZWQuZXJyb3IuZmxhdHRlbigpXG4gICAgICApfWBcbiAgICApO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFhvck9mQWNjZXNzS2V5cyhkZXZpY2VzOiBBcnJheTxEZXZpY2VUeXBlPik6IEJ1ZmZlciB7XG4gIGNvbnN0IHV1aWRzID0gZ2V0VXVpZHNGcm9tRGV2aWNlcyhkZXZpY2VzKTtcblxuICBjb25zdCByZXN1bHQgPSBCdWZmZXIuYWxsb2MoQUNDRVNTX0tFWV9MRU5HVEgpO1xuICBzdHJpY3RBc3NlcnQoXG4gICAgcmVzdWx0Lmxlbmd0aCA9PT0gQUNDRVNTX0tFWV9MRU5HVEgsXG4gICAgJ2dldFhvck9mQWNjZXNzS2V5cyBzdGFydGluZyB2YWx1ZSdcbiAgKTtcblxuICB1dWlkcy5mb3JFYWNoKHV1aWQgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldCh1dWlkKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZ2V0WG9yT2ZBY2Nlc3NLZXlzOiBVbmFibGUgdG8gZmV0Y2ggY29udmVyc2F0aW9uIGZvciBVVUlEICR7dXVpZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY2Vzc0tleSA9IGdldEFjY2Vzc0tleShjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgaWYgKCFhY2Nlc3NLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZ2V0WG9yT2ZBY2Nlc3NLZXlzOiBObyBhY2Nlc3NLZXkgZm9yIFVVSUQgJHt1dWlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY2Vzc0tleUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGFjY2Vzc0tleSwgJ2Jhc2U2NCcpO1xuICAgIGlmIChhY2Nlc3NLZXlCdWZmZXIubGVuZ3RoICE9PSBBQ0NFU1NfS0VZX0xFTkdUSCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZ2V0WG9yT2ZBY2Nlc3NLZXlzOiBBY2Nlc3Mga2V5IGZvciAke3V1aWR9IGhhZCBsZW5ndGggJHthY2Nlc3NLZXlCdWZmZXIubGVuZ3RofWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBBQ0NFU1NfS0VZX0xFTkdUSDsgaSArPSAxKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgICAgcmVzdWx0W2ldIF49IGFjY2Vzc0tleUJ1ZmZlcltpXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVuY3J5cHRGb3JTZW5kZXJLZXkoe1xuICBjb250ZW50SGludCxcbiAgY29udGVudE1lc3NhZ2UsXG4gIGRldmljZXMsXG4gIGRpc3RyaWJ1dGlvbklkLFxuICBncm91cElkLFxufToge1xuICBjb250ZW50SGludDogbnVtYmVyO1xuICBjb250ZW50TWVzc2FnZTogVWludDhBcnJheTtcbiAgZGV2aWNlczogQXJyYXk8RGV2aWNlVHlwZT47XG4gIGRpc3RyaWJ1dGlvbklkOiBzdHJpbmc7XG4gIGdyb3VwSWQ/OiBzdHJpbmc7XG59KTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuICBjb25zdCBvdXJEZXZpY2VJZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXREZXZpY2VJZCgpO1xuICBpZiAoIW91ckRldmljZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2VuY3J5cHRGb3JTZW5kZXJLZXk6IFVuYWJsZSB0byBmZXRjaCBvdXIgdXVpZCBvciBkZXZpY2VJZCdcbiAgICApO1xuICB9XG5cbiAgY29uc3Qgc2VuZGVyID0gUHJvdG9jb2xBZGRyZXNzLm5ldyhcbiAgICBvdXJVdWlkLnRvU3RyaW5nKCksXG4gICAgcGFyc2VJbnRPclRocm93KG91ckRldmljZUlkLCAnZW5jcnlwdEZvclNlbmRlcktleSwgb3VyRGV2aWNlSWQnKVxuICApO1xuICBjb25zdCBvdXJBZGRyZXNzID0gZ2V0T3VyQWRkcmVzcygpO1xuICBjb25zdCBzZW5kZXJLZXlTdG9yZSA9IG5ldyBTZW5kZXJLZXlzKHsgb3VyVXVpZCwgem9uZTogR0xPQkFMX1pPTkUgfSk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShwYWRNZXNzYWdlKGNvbnRlbnRNZXNzYWdlKSk7XG5cbiAgY29uc3QgY2lwaGVydGV4dE1lc3NhZ2UgPVxuICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuZW5xdWV1ZVNlbmRlcktleUpvYihcbiAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG91ckFkZHJlc3MpLFxuICAgICAgKCkgPT4gZ3JvdXBFbmNyeXB0KHNlbmRlciwgZGlzdHJpYnV0aW9uSWQsIHNlbmRlcktleVN0b3JlLCBtZXNzYWdlKVxuICAgICk7XG5cbiAgY29uc3QgZ3JvdXBJZEJ1ZmZlciA9IGdyb3VwSWQgPyBCdWZmZXIuZnJvbShncm91cElkLCAnYmFzZTY0JykgOiBudWxsO1xuICBjb25zdCBzZW5kZXJDZXJ0aWZpY2F0ZU9iamVjdCA9IGF3YWl0IHNlbmRlckNlcnRpZmljYXRlU2VydmljZS5nZXQoXG4gICAgU2VuZGVyQ2VydGlmaWNhdGVNb2RlLldpdGhvdXRFMTY0XG4gICk7XG4gIGlmICghc2VuZGVyQ2VydGlmaWNhdGVPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuY3J5cHRGb3JTZW5kZXJLZXk6IFVuYWJsZSB0byBmZXRjaCBzZW5kZXIgY2VydGlmaWNhdGUhJyk7XG4gIH1cblxuICBjb25zdCBzZW5kZXJDZXJ0aWZpY2F0ZSA9IFNlbmRlckNlcnRpZmljYXRlLmRlc2VyaWFsaXplKFxuICAgIEJ1ZmZlci5mcm9tKHNlbmRlckNlcnRpZmljYXRlT2JqZWN0LnNlcmlhbGl6ZWQpXG4gICk7XG4gIGNvbnN0IGNvbnRlbnQgPSBVbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlQ29udGVudC5uZXcoXG4gICAgY2lwaGVydGV4dE1lc3NhZ2UsXG4gICAgc2VuZGVyQ2VydGlmaWNhdGUsXG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZEJ1ZmZlclxuICApO1xuXG4gIGNvbnN0IHJlY2lwaWVudHMgPSBkZXZpY2VzXG4gICAgLnNsaWNlKClcbiAgICAuc29ydCgoYSwgYik6IG51bWJlciA9PiB7XG4gICAgICBpZiAoYS5pZGVudGlmaWVyID09PSBiLmlkZW50aWZpZXIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChhLmlkZW50aWZpZXIgPCBiLmlkZW50aWZpZXIpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gMTtcbiAgICB9KVxuICAgIC5tYXAoZGV2aWNlID0+IHtcbiAgICAgIHJldHVybiBQcm90b2NvbEFkZHJlc3MubmV3KFxuICAgICAgICBVVUlELmNoZWNrZWRMb29rdXAoZGV2aWNlLmlkZW50aWZpZXIpLnRvU3RyaW5nKCksXG4gICAgICAgIGRldmljZS5pZFxuICAgICAgKTtcbiAgICB9KTtcbiAgY29uc3QgaWRlbnRpdHlLZXlTdG9yZSA9IG5ldyBJZGVudGl0eUtleXMoeyBvdXJVdWlkIH0pO1xuICBjb25zdCBzZXNzaW9uU3RvcmUgPSBuZXcgU2Vzc2lvbnMoeyBvdXJVdWlkIH0pO1xuICByZXR1cm4gc2VhbGVkU2VuZGVyTXVsdGlSZWNpcGllbnRFbmNyeXB0KFxuICAgIGNvbnRlbnQsXG4gICAgcmVjaXBpZW50cyxcbiAgICBpZGVudGl0eUtleVN0b3JlLFxuICAgIHNlc3Npb25TdG9yZVxuICApO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkU2VuZGVyS2V5UmVjaXBpZW50KFxuICBtZW1iZXJzOiBTZXQ8Q29udmVyc2F0aW9uTW9kZWw+LFxuICB1dWlkOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICBjb25zdCBtZW1iZXJDb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQodXVpZCk7XG4gIGlmICghbWVtYmVyQ29udmVyc2F0aW9uKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgaXNWYWxpZFNlbmRlcktleVJlY2lwaWVudDogTWlzc2luZyBjb252ZXJzYXRpb24gbW9kZWwgZm9yIG1lbWJlciAke3V1aWR9YFxuICAgICk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFtZW1iZXJzLmhhcyhtZW1iZXJDb252ZXJzYXRpb24pKSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgaXNWYWxpZFNlbmRlcktleVJlY2lwaWVudDogU2VuZGluZyB0byAke3V1aWR9LCBub3QgYSBncm91cCBtZW1iZXJgXG4gICAgKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjYXBhYmlsaXRpZXMgPSBtZW1iZXJDb252ZXJzYXRpb24uZ2V0KCdjYXBhYmlsaXRpZXMnKTtcbiAgaWYgKCFjYXBhYmlsaXRpZXM/LnNlbmRlcktleSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghZ2V0QWNjZXNzS2V5KG1lbWJlckNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChtZW1iZXJDb252ZXJzYXRpb24uaXNVbnJlZ2lzdGVyZWQoKSkge1xuICAgIGxvZy53YXJuKGBpc1ZhbGlkU2VuZGVyS2V5UmVjaXBpZW50OiBNZW1iZXIgJHt1dWlkfSBpcyB1bnJlZ2lzdGVyZWRgKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGV2aWNlQ29tcGFyYXRvcihsZWZ0PzogRGV2aWNlVHlwZSwgcmlnaHQ/OiBEZXZpY2VUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKFxuICAgIGxlZnQgJiZcbiAgICAgIHJpZ2h0ICYmXG4gICAgICBsZWZ0LmlkID09PSByaWdodC5pZCAmJlxuICAgICAgbGVmdC5pZGVudGlmaWVyID09PSByaWdodC5pZGVudGlmaWVyICYmXG4gICAgICBsZWZ0LnJlZ2lzdHJhdGlvbklkID09PSByaWdodC5yZWdpc3RyYXRpb25JZFxuICApO1xufVxuXG50eXBlIFBhcnRpYWxEZXZpY2VUeXBlID0gT21pdDxEZXZpY2VUeXBlLCAncmVnaXN0cmF0aW9uSWQnPjtcblxuZnVuY3Rpb24gcGFydGlhbERldmljZUNvbXBhcmF0b3IoXG4gIGxlZnQ/OiBQYXJ0aWFsRGV2aWNlVHlwZSxcbiAgcmlnaHQ/OiBQYXJ0aWFsRGV2aWNlVHlwZVxuKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKFxuICAgIGxlZnQgJiZcbiAgICAgIHJpZ2h0ICYmXG4gICAgICBsZWZ0LmlkID09PSByaWdodC5pZCAmJlxuICAgICAgbGVmdC5pZGVudGlmaWVyID09PSByaWdodC5pZGVudGlmaWVyXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFV1aWRzRnJvbURldmljZXMoXG4gIGRldmljZXM6IEFycmF5PERldmljZVR5cGU+XG4pOiBBcnJheTxVVUlEU3RyaW5nVHlwZT4ge1xuICBjb25zdCB1dWlkcyA9IG5ldyBTZXQ8VVVJRFN0cmluZ1R5cGU+KCk7XG4gIGRldmljZXMuZm9yRWFjaChkZXZpY2UgPT4ge1xuICAgIHV1aWRzLmFkZChVVUlELmNoZWNrZWRMb29rdXAoZGV2aWNlLmlkZW50aWZpZXIpLnRvU3RyaW5nKCkpO1xuICB9KTtcblxuICByZXR1cm4gQXJyYXkuZnJvbSh1dWlkcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfYW5hbHl6ZVNlbmRlcktleURldmljZXMoXG4gIG1lbWJlckRldmljZXM6IEFycmF5PERldmljZVR5cGU+LFxuICBkZXZpY2VzRm9yU2VuZDogQXJyYXk8RGV2aWNlVHlwZT4sXG4gIGlzUGFydGlhbFNlbmQ/OiBib29sZWFuXG4pOiB7XG4gIG5ld1RvTWVtYmVyRGV2aWNlczogQXJyYXk8RGV2aWNlVHlwZT47XG4gIG5ld1RvTWVtYmVyVXVpZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPjtcbiAgcmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzOiBBcnJheTxEZXZpY2VUeXBlPjtcbiAgcmVtb3ZlZEZyb21NZW1iZXJVdWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+O1xufSB7XG4gIGNvbnN0IG5ld1RvTWVtYmVyRGV2aWNlcyA9IGRpZmZlcmVuY2VXaXRoPERldmljZVR5cGUsIERldmljZVR5cGU+KFxuICAgIGRldmljZXNGb3JTZW5kLFxuICAgIG1lbWJlckRldmljZXMsXG4gICAgZGV2aWNlQ29tcGFyYXRvclxuICApO1xuICBjb25zdCBuZXdUb01lbWJlclV1aWRzID0gZ2V0VXVpZHNGcm9tRGV2aWNlcyhuZXdUb01lbWJlckRldmljZXMpO1xuXG4gIC8vIElmIHRoaXMgaXMgYSBwYXJ0aWFsIHNlbmQsIHdlIHdvbid0IGRvIGFueXRoaW5nIHdpdGggZGV2aWNlIHJlbW92YWxzXG4gIGlmIChpc1BhcnRpYWxTZW5kKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5ld1RvTWVtYmVyRGV2aWNlcyxcbiAgICAgIG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgICByZW1vdmVkRnJvbU1lbWJlckRldmljZXM6IFtdLFxuICAgICAgcmVtb3ZlZEZyb21NZW1iZXJVdWlkczogW10sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJlbW92ZWRGcm9tTWVtYmVyRGV2aWNlcyA9IGRpZmZlcmVuY2VXaXRoPERldmljZVR5cGUsIERldmljZVR5cGU+KFxuICAgIG1lbWJlckRldmljZXMsXG4gICAgZGV2aWNlc0ZvclNlbmQsXG4gICAgZGV2aWNlQ29tcGFyYXRvclxuICApO1xuICBjb25zdCByZW1vdmVkRnJvbU1lbWJlclV1aWRzID0gZ2V0VXVpZHNGcm9tRGV2aWNlcyhyZW1vdmVkRnJvbU1lbWJlckRldmljZXMpO1xuXG4gIHJldHVybiB7XG4gICAgbmV3VG9NZW1iZXJEZXZpY2VzLFxuICAgIG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgcmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLFxuICAgIHJlbW92ZWRGcm9tTWVtYmVyVXVpZHMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE91ckFkZHJlc3MoKTogQWRkcmVzcyB7XG4gIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcbiAgY29uc3Qgb3VyRGV2aWNlSWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKTtcbiAgaWYgKCFvdXJEZXZpY2VJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0T3VyQWRkcmVzczogVW5hYmxlIHRvIGZldGNoIG91ciBkZXZpY2VJZCcpO1xuICB9XG4gIHJldHVybiBuZXcgQWRkcmVzcyhvdXJVdWlkLCBvdXJEZXZpY2VJZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0U2VuZGVyS2V5KHNlbmRUYXJnZXQ6IFNlbmRlcktleVRhcmdldFR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBzZW5kVGFyZ2V0LmlkRm9yTG9nZ2luZygpO1xuXG4gIGxvZy5pbmZvKGByZXNldFNlbmRlcktleS8ke2xvZ0lkfTogU2VuZGVyIGtleSBuZWVkcyByZXNldC4gQ2xlYXJpbmcgZGF0YS4uLmApO1xuICBjb25zdCBzZW5kZXJLZXlJbmZvID0gc2VuZFRhcmdldC5nZXRTZW5kZXJLZXlJbmZvKCk7XG4gIGlmICghc2VuZGVyS2V5SW5mbykge1xuICAgIGxvZy53YXJuKGByZXNldFNlbmRlcktleS8ke2xvZ0lkfTogTm8gc2VuZGVyIGtleSBpbmZvYCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBkaXN0cmlidXRpb25JZCB9ID0gc2VuZGVyS2V5SW5mbztcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGdldE91ckFkZHJlc3MoKTtcblxuICAvLyBOb3RlOiBXZSBwcmVzZXJ2ZSBleGlzdGluZyBkaXN0cmlidXRpb25JZCB0byBtaW5pbWl6ZSBzcGFjZSBmb3Igc2VuZGVyIGtleSBzdG9yYWdlXG4gIGF3YWl0IHNlbmRUYXJnZXQuc2F2ZVNlbmRlcktleUluZm8oe1xuICAgIGNyZWF0ZWRBdERhdGU6IERhdGUubm93KCksXG4gICAgZGlzdHJpYnV0aW9uSWQsXG4gICAgbWVtYmVyRGV2aWNlczogW10sXG4gIH0pO1xuXG4gIGNvbnN0IG91clV1aWQgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wucmVtb3ZlU2VuZGVyS2V5KFxuICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG91ckFkZHJlc3MpLFxuICAgIGRpc3RyaWJ1dGlvbklkXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldEFjY2Vzc0tleShcbiAgYXR0cmlidXRlczogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGVcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgc2VhbGVkU2VuZGVyLCBhY2Nlc3NLZXkgfSA9IGF0dHJpYnV0ZXM7XG5cbiAgaWYgKHNlYWxlZFNlbmRlciA9PT0gU0VBTEVEX1NFTkRFUi5FTkFCTEVEKSB7XG4gICAgcmV0dXJuIGFjY2Vzc0tleSB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoXG4gICAgc2VhbGVkU2VuZGVyID09PSBTRUFMRURfU0VOREVSLlVOS05PV04gfHxcbiAgICBzZWFsZWRTZW5kZXIgPT09IFNFQUxFRF9TRU5ERVIuVU5SRVNUUklDVEVEXG4gICkge1xuICAgIHJldHVybiBaRVJPX0FDQ0VTU19LRVk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaEtleXNGb3JJZGVudGlmaWVycyhcbiAgaWRlbnRpZmllcnM6IEFycmF5PHN0cmluZz5cbik6IFByb21pc2U8dm9pZD4ge1xuICBsb2cuaW5mbyhcbiAgICBgZmV0Y2hLZXlzRm9ySWRlbnRpZmllcnM6IEZldGNoaW5nIGtleXMgZm9yICR7aWRlbnRpZmllcnMubGVuZ3RofSBpZGVudGlmaWVyc2BcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IF93YWl0Rm9yQWxsKHtcbiAgICAgIHRhc2tzOiBpZGVudGlmaWVycy5tYXAoXG4gICAgICAgIGlkZW50aWZpZXIgPT4gYXN5bmMgKCkgPT4gZmV0Y2hLZXlzRm9ySWRlbnRpZmllcihpZGVudGlmaWVyKVxuICAgICAgKSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICAnZmV0Y2hLZXlzRm9ySWRlbnRpZmllcnM6IEZhaWxlZCB0byBmZXRjaCBrZXlzOicsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoS2V5c0ZvcklkZW50aWZpZXIoXG4gIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgZGV2aWNlcz86IEFycmF5PG51bWJlcj5cbik6IFByb21pc2U8dm9pZD4ge1xuICBsb2cuaW5mbyhcbiAgICBgZmV0Y2hLZXlzRm9ySWRlbnRpZmllcjogRmV0Y2hpbmcgJHtcbiAgICAgIGRldmljZXMgfHwgJ2FsbCdcbiAgICB9IGRldmljZXMgZm9yICR7aWRlbnRpZmllcn1gXG4gICk7XG5cbiAgaWYgKCF3aW5kb3cudGV4dHNlY3VyZT8ubWVzc2FnaW5nPy5zZXJ2ZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZldGNoS2V5c0ZvcklkZW50aWZpZXI6IE5vIHNlcnZlciBhdmFpbGFibGUhJyk7XG4gIH1cblxuICBjb25zdCBlbXB0eUNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlKFxuICAgIGlkZW50aWZpZXIsXG4gICAgJ3ByaXZhdGUnXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IGFjY2Vzc0tleUZhaWxlZCB9ID0gYXdhaXQgZ2V0S2V5c0ZvcklkZW50aWZpZXIoXG4gICAgICBpZGVudGlmaWVyLFxuICAgICAgd2luZG93LnRleHRzZWN1cmU/Lm1lc3NhZ2luZz8uc2VydmVyLFxuICAgICAgZGV2aWNlcyxcbiAgICAgIGdldEFjY2Vzc0tleShlbXB0eUNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKVxuICAgICk7XG4gICAgaWYgKGFjY2Vzc0tleUZhaWxlZCkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBmZXRjaEtleXNGb3JJZGVudGlmaWVyczogU2V0dGluZyBzZWFsZWRTZW5kZXIgdG8gRElTQUJMRUQgZm9yIGNvbnZlcnNhdGlvbiAke2VtcHR5Q29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICk7XG4gICAgICBlbXB0eUNvbnZlcnNhdGlvbi5zZXQoe1xuICAgICAgICBzZWFsZWRTZW5kZXI6IFNFQUxFRF9TRU5ERVIuRElTQUJMRUQsXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oZW1wdHlDb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFVucmVnaXN0ZXJlZFVzZXJFcnJvcikge1xuICAgICAgYXdhaXQgbWFya0lkZW50aWZpZXJVbnJlZ2lzdGVyZWQoaWRlbnRpZmllcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUFnRDtBQUNoRCxxQkFBbUI7QUFFbkIsOEJBT087QUFDUCxZQUF1QjtBQUN2QiwrQkFBeUM7QUFFekMsNkJBR087QUFDUCxxQkFBd0I7QUFDeEIsOEJBQWlDO0FBQ2pDLGtCQUFxQjtBQUNyQiwwQkFBb0M7QUFFcEMsc0JBQXlCO0FBRXpCLHVCQUE0QjtBQUs1QixvQkFLTztBQUVQLDZCQUFtRDtBQUduRCxrQ0FBcUM7QUFNckMsK0JBQW1EO0FBQ25ELDBCQUE4QjtBQUM5Qiw2QkFBZ0M7QUFDaEMsb0JBSU87QUFDUCxzQkFBdUM7QUFFdkMsb0JBQTZCO0FBQzdCLFVBQXFCO0FBQ3JCLGlDQUE0QjtBQUM1Qix1QkFBdUI7QUFFdkIsTUFBTSxtQ0FBbUM7QUFDekMsTUFBTSxzQkFBc0I7QUFFNUIsTUFBTSxPQUFPLEtBQUssS0FBSztBQUN2QixNQUFNLE1BQU0sS0FBSztBQUVqQixNQUFNLGtCQUFrQjtBQUd4QixNQUFNLGdCQUFnQjtBQUV0QixNQUFNLG9CQUFvQjtBQUMxQixNQUFNLGtCQUFrQixNQUFNLFNBQVMsSUFBSSxXQUFXLGlCQUFpQixDQUFDO0FBZ0J4RSwyQkFBa0M7QUFBQSxFQUNoQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FXOEI7QUFDOUIsa0NBQ0UsT0FBTyxXQUFXLFdBQ2xCLGtEQUNGO0FBRUEsUUFBTSxFQUFFLGNBQWM7QUFDdEIsUUFBTSxhQUFhLGNBQWMsZ0JBQWdCO0FBR2pELFFBQU0s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
