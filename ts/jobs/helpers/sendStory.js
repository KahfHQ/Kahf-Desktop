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
var sendStory_exports = {};
__export(sendStory_exports, {
  sendStory: () => sendStory
});
module.exports = __toCommonJS(sendStory_exports);
var import_lodash = require("lodash");
var Errors = __toESM(require("../../types/errors"));
var import_Client = __toESM(require("../../sql/Client"));
var import_protobuf = require("../../protobuf");
var import_getMessageById = require("../../messages/getMessageById");
var import_getSendOptions = require("../../util/getSendOptions");
var import_handleMessageSend = require("../../util/handleMessageSend");
var import_handleMultipleSendErrors = require("./handleMultipleSendErrors");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_isNotNil = require("../../util/isNotNil");
var import_MessageSendState = require("../../messages/MessageSendState");
var import_ourProfileKey = require("../../services/ourProfileKey");
var import_sendToGroup = require("../../util/sendToGroup");
async function sendStory(conversation, {
  isFinalAttempt,
  messaging,
  shouldContinue,
  timeRemaining,
  log
}, data) {
  const { messageIds, timestamp } = data;
  const profileKey = await import_ourProfileKey.ourProfileKeyService.get();
  if (!profileKey) {
    log.info("stories.sendStory: no profile key cannot send");
    return;
  }
  const originalStoryMessage = await (async () => {
    const [messageId] = messageIds;
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      log.info(`stories.sendStory(${messageId}): message was not found, maybe because it was deleted. Giving up on sending it`);
      return;
    }
    const messageConversation = message.getConversation();
    if (messageConversation !== conversation) {
      log.error(`stories.sendStory(${messageId}): Message conversation '${messageConversation?.idForLogging()}' does not match job conversation ${conversation.idForLogging()}`);
      return;
    }
    const attachments = message.get("attachments") || [];
    const [attachment] = attachments;
    if (!attachment) {
      log.info(`stories.sendStory(${messageId}): message does not have any attachments to send. Giving up on sending it`);
      return;
    }
    let textAttachment;
    let fileAttachment;
    if (attachment.textAttachment) {
      textAttachment = attachment.textAttachment;
    } else {
      fileAttachment = await window.Signal.Migrations.loadAttachmentData(attachment);
    }
    const groupV2 = (0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes) ? conversation.getGroupV2Info() : void 0;
    return messaging.getStoryMessage({
      allowsReplies: true,
      fileAttachment,
      groupV2,
      textAttachment,
      profileKey
    });
  })();
  if (!originalStoryMessage) {
    return;
  }
  const canReplyUuids = /* @__PURE__ */ new Set();
  const recipientsByUuid = /* @__PURE__ */ new Map();
  const sentConversationIds = /* @__PURE__ */ new Map();
  const sentUuids = /* @__PURE__ */ new Set();
  function addDistributionListToUuidSent(listId, uuid, canReply) {
    if (conversation.get("uuid") === uuid) {
      return;
    }
    const distributionListIds = recipientsByUuid.get(uuid) || /* @__PURE__ */ new Set();
    if (listId) {
      recipientsByUuid.set(uuid, /* @__PURE__ */ new Set([...distributionListIds, listId]));
    } else {
      recipientsByUuid.set(uuid, distributionListIds);
    }
    if (canReply) {
      canReplyUuids.add(uuid);
    }
  }
  let isSyncMessageUpdate = false;
  await Promise.all(messageIds.map(async (messageId) => {
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      log.info(`stories.sendStory(${messageId}): message was not found, maybe because it was deleted. Giving up on sending it`);
      return;
    }
    const messageConversation = message.getConversation();
    if (messageConversation !== conversation) {
      log.error(`stories.sendStory(${messageId}): Message conversation '${messageConversation?.idForLogging()}' does not match job conversation ${conversation.idForLogging()}`);
      return;
    }
    if (message.isErased() || message.get("deletedForEveryone")) {
      log.info(`stories.sendStory(${messageId}): message was erased. Giving up on sending it`);
      return;
    }
    const listId = message.get("storyDistributionListId");
    const receiverId = (0, import_whatTypeOfConversation.isGroupV2)(messageConversation.attributes) ? messageConversation.id : listId;
    if (!receiverId) {
      log.info(`stories.sendStory(${messageId}): did not get a valid recipient ID for message. Giving up on sending it`);
      return;
    }
    const distributionList = (0, import_whatTypeOfConversation.isGroupV2)(messageConversation.attributes) ? void 0 : await import_Client.default.getStoryDistributionWithMembers(receiverId);
    let messageSendErrors = [];
    const saveErrors = isFinalAttempt ? void 0 : (errors) => {
      messageSendErrors = errors;
    };
    if (!shouldContinue) {
      log.info(`stories.sendStory(${messageId}): ran out of time. Giving up on sending it`);
      await markMessageFailed(message, [
        new Error("Message send ran out of time")
      ]);
      return;
    }
    let originalError;
    const {
      allRecipientIds,
      allowedReplyByUuid,
      pendingSendRecipientIds,
      sentRecipientIds,
      untrustedUuids
    } = getMessageRecipients({
      log,
      message
    });
    try {
      if (untrustedUuids.length) {
        window.reduxActions.conversations.conversationStoppedByMissingVerification({
          conversationId: conversation.id,
          untrustedUuids
        });
        throw new Error(`stories.sendStory(${messageId}): sending blocked because ${untrustedUuids.length} conversation(s) were untrusted. Failing this attempt.`);
      }
      if (!pendingSendRecipientIds.length) {
        allRecipientIds.forEach((uuid) => addDistributionListToUuidSent(listId, uuid, allowedReplyByUuid.get(uuid)));
        return;
      }
      const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
      const recipientsSet = new Set(pendingSendRecipientIds);
      const sendOptions = await (0, import_getSendOptions.getSendOptionsForRecipients)(pendingSendRecipientIds);
      log.info(`stories.sendStory(${messageId}): sending story to ${receiverId}`);
      const storyMessage = new import_protobuf.SignalService.StoryMessage();
      storyMessage.profileKey = originalStoryMessage.profileKey;
      storyMessage.fileAttachment = originalStoryMessage.fileAttachment;
      storyMessage.textAttachment = originalStoryMessage.textAttachment;
      storyMessage.group = originalStoryMessage.group;
      storyMessage.allowsReplies = (0, import_whatTypeOfConversation.isGroupV2)(messageConversation.attributes) || Boolean(distributionList?.allowsReplies);
      const sendTarget = distributionList ? {
        getGroupId: () => void 0,
        getMembers: () => pendingSendRecipientIds.map((uuid) => window.ConversationController.get(uuid)).filter(import_isNotNil.isNotNil),
        hasMember: (uuid) => recipientsSet.has(uuid),
        idForLogging: () => `dl(${receiverId})`,
        isGroupV2: () => true,
        isValid: () => true,
        getSenderKeyInfo: () => distributionList.senderKeyInfo,
        saveSenderKeyInfo: async (senderKeyInfo) => import_Client.default.modifyStoryDistribution({
          ...distributionList,
          senderKeyInfo
        })
      } : conversation.toSenderKeyTarget();
      const contentMessage = new import_protobuf.SignalService.Content();
      contentMessage.storyMessage = storyMessage;
      const innerPromise = (0, import_sendToGroup.sendContentMessageToGroup)({
        contentHint: ContentHint.IMPLICIT,
        contentMessage,
        isPartialSend: false,
        messageId: void 0,
        recipients: pendingSendRecipientIds,
        sendOptions,
        sendTarget,
        sendType: "story",
        timestamp,
        urgent: false
      });
      message.doNotSendSyncMessage = Boolean(distributionList);
      const messageSendPromise = message.send((0, import_handleMessageSend.handleMessageSend)(innerPromise, {
        messageIds: [messageId],
        sendType: "story"
      }), saveErrors);
      try {
        await innerPromise;
      } catch (error) {
        if (error instanceof Error) {
          originalError = error;
        } else {
          log.error(`promiseForError threw something other than an error: ${Errors.toLogFormat(error)}`);
        }
      }
      await messageSendPromise;
      const sendStateByConversationId = message.get("sendStateByConversationId") || {};
      Object.entries(sendStateByConversationId).forEach(([recipientConversationId, sendState]) => {
        if (!(0, import_MessageSendState.isSent)(sendState.status)) {
          return;
        }
        sentConversationIds.set(recipientConversationId, sendState);
        const recipient = window.ConversationController.get(recipientConversationId);
        const uuid = recipient?.get("uuid");
        if (!uuid) {
          return;
        }
        sentUuids.add(uuid);
      });
      allRecipientIds.forEach((uuid) => {
        addDistributionListToUuidSent(listId, uuid, allowedReplyByUuid.get(uuid));
      });
      const didFullySend = !messageSendErrors.length || didSendToEveryone(message);
      if (!didFullySend) {
        throw new Error("message did not fully send");
      }
    } catch (thrownError) {
      const errors = [thrownError, ...messageSendErrors];
      await (0, import_handleMultipleSendErrors.handleMultipleSendErrors)({
        errors,
        isFinalAttempt,
        log,
        markFailed: () => markMessageFailed(message, messageSendErrors),
        timeRemaining,
        toThrow: originalError || thrownError
      });
    } finally {
      isSyncMessageUpdate = sentRecipientIds.length > 0;
    }
  }));
  await Promise.all(messageIds.map(async (messageId) => {
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      return;
    }
    const oldSendStateByConversationId = message.get("sendStateByConversationId") || {};
    const newSendStateByConversationId = Object.keys(oldSendStateByConversationId).reduce((acc, conversationId) => {
      const sendState = sentConversationIds.get(conversationId);
      if (sendState) {
        return {
          ...acc,
          [conversationId]: sendState
        };
      }
      return acc;
    }, {});
    if ((0, import_lodash.isEqual)(oldSendStateByConversationId, newSendStateByConversationId)) {
      return;
    }
    message.set("sendStateByConversationId", newSendStateByConversationId);
    return window.Signal.Data.saveMessage(message.attributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
  }));
  recipientsByUuid.forEach((_value, uuid) => {
    if (sentUuids.has(uuid)) {
      return;
    }
    recipientsByUuid.delete(uuid);
  });
  const storyMessageRecipients = [];
  recipientsByUuid.forEach((distributionListIds, destinationUuid) => {
    storyMessageRecipients.push({
      destinationUuid,
      distributionListIds: Array.from(distributionListIds),
      isAllowedToReply: canReplyUuids.has(destinationUuid)
    });
  });
  const options = await (0, import_getSendOptions.getSendOptions)(conversation.attributes, {
    syncMessage: true
  });
  messaging.sendSyncMessage({
    destination: conversation.get("e164"),
    destinationUuid: conversation.get("uuid"),
    storyMessage: originalStoryMessage,
    storyMessageRecipients,
    expirationStartTimestamp: null,
    isUpdate: isSyncMessageUpdate,
    options,
    timestamp,
    urgent: false
  });
}
function getMessageRecipients({
  log,
  message
}) {
  const allRecipientIds = [];
  const allowedReplyByUuid = /* @__PURE__ */ new Map();
  const pendingSendRecipientIds = [];
  const sentRecipientIds = [];
  const untrustedUuids = [];
  Object.entries(message.get("sendStateByConversationId") || {}).forEach(([recipientConversationId, sendState]) => {
    const recipient = window.ConversationController.get(recipientConversationId);
    if (!recipient) {
      return;
    }
    const isRecipientMe = (0, import_whatTypeOfConversation.isMe)(recipient.attributes);
    if (isRecipientMe) {
      return;
    }
    if (recipient.isUntrusted()) {
      const uuid = recipient.get("uuid");
      if (!uuid) {
        log.error(`stories.sendStory/getMessageRecipients: Untrusted conversation ${recipient.idForLogging()} missing UUID.`);
        return;
      }
      untrustedUuids.push(uuid);
      return;
    }
    if (recipient.isUnregistered()) {
      return;
    }
    const recipientSendTarget = recipient.getSendTarget();
    if (!recipientSendTarget) {
      return;
    }
    allowedReplyByUuid.set(recipientSendTarget, Boolean(sendState.isAllowedToReplyToStory));
    allRecipientIds.push(recipientSendTarget);
    if (sendState.isAlreadyIncludedInAnotherDistributionList) {
      return;
    }
    if ((0, import_MessageSendState.isSent)(sendState.status)) {
      sentRecipientIds.push(recipientSendTarget);
      return;
    }
    pendingSendRecipientIds.push(recipientSendTarget);
  });
  return {
    allRecipientIds,
    allowedReplyByUuid,
    pendingSendRecipientIds,
    sentRecipientIds,
    untrustedUuids
  };
}
async function markMessageFailed(message, errors) {
  message.markFailed();
  message.saveErrors(errors, { skipSave: true });
  await window.Signal.Data.saveMessage(message.attributes, {
    ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
  });
}
function didSendToEveryone(message) {
  const sendStateByConversationId = message.get("sendStateByConversationId") || {};
  return Object.values(sendStateByConversationId).every((sendState) => sendState.isAlreadyIncludedInAnotherDistributionList || (0, import_MessageSendState.isSent)(sendState.status));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZFN0b3J5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlzRXF1YWwgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHR5cGUge1xuICBBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YSxcbiAgVGV4dEF0dGFjaG1lbnRUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uTW9kZWwgfSBmcm9tICcuLi8uLi9tb2RlbHMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvblF1ZXVlSm9iQnVuZGxlLFxuICBTdG9yeUpvYkRhdGEsXG59IGZyb20gJy4uL2NvbnZlcnNhdGlvbkpvYlF1ZXVlJztcbmltcG9ydCB0eXBlIHsgTG9nZ2VyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0xvZ2dpbmcnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTW9kZWwgfSBmcm9tICcuLi8uLi9tb2RlbHMvbWVzc2FnZXMnO1xuaW1wb3J0IHR5cGUgeyBTZW5kZXJLZXlJbmZvVHlwZSB9IGZyb20gJy4uLy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUge1xuICBTZW5kU3RhdGUsXG4gIFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsXG59IGZyb20gJy4uLy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uLy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgZGF0YUludGVyZmFjZSBmcm9tICcuLi8uLi9zcWwvQ2xpZW50JztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi8uLi9wcm90b2J1Zic7XG5pbXBvcnQgeyBnZXRNZXNzYWdlQnlJZCB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL2dldE1lc3NhZ2VCeUlkJztcbmltcG9ydCB7XG4gIGdldFNlbmRPcHRpb25zLFxuICBnZXRTZW5kT3B0aW9uc0ZvclJlY2lwaWVudHMsXG59IGZyb20gJy4uLy4uL3V0aWwvZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHsgaGFuZGxlTWVzc2FnZVNlbmQgfSBmcm9tICcuLi8uLi91dGlsL2hhbmRsZU1lc3NhZ2VTZW5kJztcbmltcG9ydCB7IGhhbmRsZU11bHRpcGxlU2VuZEVycm9ycyB9IGZyb20gJy4vaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzJztcbmltcG9ydCB7IGlzR3JvdXBWMiwgaXNNZSB9IGZyb20gJy4uLy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBpc05vdE5pbCB9IGZyb20gJy4uLy4uL3V0aWwvaXNOb3ROaWwnO1xuaW1wb3J0IHsgaXNTZW50IH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgeyBvdXJQcm9maWxlS2V5U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL291clByb2ZpbGVLZXknO1xuaW1wb3J0IHsgc2VuZENvbnRlbnRNZXNzYWdlVG9Hcm91cCB9IGZyb20gJy4uLy4uL3V0aWwvc2VuZFRvR3JvdXAnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFN0b3J5KFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsLFxuICB7XG4gICAgaXNGaW5hbEF0dGVtcHQsXG4gICAgbWVzc2FnaW5nLFxuICAgIHNob3VsZENvbnRpbnVlLFxuICAgIHRpbWVSZW1haW5pbmcsXG4gICAgbG9nLFxuICB9OiBDb252ZXJzYXRpb25RdWV1ZUpvYkJ1bmRsZSxcbiAgZGF0YTogU3RvcnlKb2JEYXRhXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBtZXNzYWdlSWRzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cbiAgY29uc3QgcHJvZmlsZUtleSA9IGF3YWl0IG91clByb2ZpbGVLZXlTZXJ2aWNlLmdldCgpO1xuXG4gIGlmICghcHJvZmlsZUtleSkge1xuICAgIGxvZy5pbmZvKCdzdG9yaWVzLnNlbmRTdG9yeTogbm8gcHJvZmlsZSBrZXkgY2Fubm90IHNlbmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBXZSB3YW50IHRvIGdlbmVyYXRlIHRoZSBTdG9yeU1lc3NhZ2UgcHJvdG8gb25jZSBhdCB0aGUgdG9wIGxldmVsIHNvIHdlXG4gIC8vIGNhbiByZXVzZSBpdCBidXQgZmlyc3Qgd2UnbGwgbmVlZCB0ZXh0QXR0YWNobWVudCB8IGZpbGVBdHRhY2htZW50LlxuICAvLyBUaGlzIGZ1bmN0aW9uIHB1bGxzIG9mZiB0aGUgYXR0YWNobWVudCBhbmQgZ2VuZXJhdGVzIHRoZSBwcm90byBmcm9tIHRoZVxuICAvLyBmaXJzdCBtZXNzYWdlIG9uIHRoZSBsaXN0IHByaW9yIHRvIGNvbnRpbnVpbmcuXG4gIGNvbnN0IG9yaWdpbmFsU3RvcnlNZXNzYWdlID0gYXdhaXQgKGFzeW5jICgpOiBQcm9taXNlPFxuICAgIFByb3RvLlN0b3J5TWVzc2FnZSB8IHVuZGVmaW5lZFxuICA+ID0+IHtcbiAgICBjb25zdCBbbWVzc2FnZUlkXSA9IG1lc3NhZ2VJZHM7XG4gICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYHN0b3JpZXMuc2VuZFN0b3J5KCR7bWVzc2FnZUlkfSk6IG1lc3NhZ2Ugd2FzIG5vdCBmb3VuZCwgbWF5YmUgYmVjYXVzZSBpdCB3YXMgZGVsZXRlZC4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VDb252ZXJzYXRpb24gPSBtZXNzYWdlLmdldENvbnZlcnNhdGlvbigpO1xuICAgIGlmIChtZXNzYWdlQ29udmVyc2F0aW9uICE9PSBjb252ZXJzYXRpb24pIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHN0b3JpZXMuc2VuZFN0b3J5KCR7bWVzc2FnZUlkfSk6IE1lc3NhZ2UgY29udmVyc2F0aW9uICcke21lc3NhZ2VDb252ZXJzYXRpb24/LmlkRm9yTG9nZ2luZygpfScgZG9lcyBub3QgbWF0Y2ggam9iIGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gbWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW107XG4gICAgY29uc3QgW2F0dGFjaG1lbnRdID0gYXR0YWNobWVudHM7XG5cbiAgICBpZiAoIWF0dGFjaG1lbnQpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc3Rvcmllcy5zZW5kU3RvcnkoJHttZXNzYWdlSWR9KTogbWVzc2FnZSBkb2VzIG5vdCBoYXZlIGFueSBhdHRhY2htZW50cyB0byBzZW5kLiBHaXZpbmcgdXAgb24gc2VuZGluZyBpdGBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRleHRBdHRhY2htZW50OiBUZXh0QXR0YWNobWVudFR5cGUgfCB1bmRlZmluZWQ7XG4gICAgbGV0IGZpbGVBdHRhY2htZW50OiBBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YSB8IHVuZGVmaW5lZDtcblxuICAgIGlmIChhdHRhY2htZW50LnRleHRBdHRhY2htZW50KSB7XG4gICAgICB0ZXh0QXR0YWNobWVudCA9IGF0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVBdHRhY2htZW50ID0gYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmxvYWRBdHRhY2htZW50RGF0YShcbiAgICAgICAgYXR0YWNobWVudFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cFYyID0gaXNHcm91cFYyKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKVxuICAgICAgPyBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBTb21lIGRpc3RyaWJ1dGlvbiBsaXN0cyBuZWVkIGFsbG93c1JlcGxpZXMgZmFsc2UsIHNvbWUgbmVlZCBpdCBzZXQgdG8gdHJ1ZVxuICAgIC8vIHdlIGNyZWF0ZSB0aGlzIHByb3RvIChmb3IgdGhlIHN5bmMgbWVzc2FnZSkgYW5kIGFsc28gdG8gcmUtdXNlIHNvbWUgb2YgdGhlXG4gICAgLy8gYXR0cmlidXRlcyBpbnNpZGUgaXQuXG4gICAgcmV0dXJuIG1lc3NhZ2luZy5nZXRTdG9yeU1lc3NhZ2Uoe1xuICAgICAgYWxsb3dzUmVwbGllczogdHJ1ZSxcbiAgICAgIGZpbGVBdHRhY2htZW50LFxuICAgICAgZ3JvdXBWMixcbiAgICAgIHRleHRBdHRhY2htZW50LFxuICAgICAgcHJvZmlsZUtleSxcbiAgICB9KTtcbiAgfSkoKTtcblxuICBpZiAoIW9yaWdpbmFsU3RvcnlNZXNzYWdlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2FuUmVwbHlVdWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCByZWNpcGllbnRzQnlVdWlkID0gbmV3IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PigpO1xuICBjb25zdCBzZW50Q29udmVyc2F0aW9uSWRzID0gbmV3IE1hcDxzdHJpbmcsIFNlbmRTdGF0ZT4oKTtcbiAgY29uc3Qgc2VudFV1aWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSByZWNpcGllbnRzIHNvIG9uY2Ugd2UncmVcbiAgLy8gZG9uZSB3aXRoIG91ciBzZW5kIHdlIGNhbiBidWlsZCB1cCB0aGUgc3RvcnlNZXNzYWdlUmVjaXBpZW50cyBvYmplY3QgZm9yXG4gIC8vIHNlbmRpbmcgaW4gdGhlIHN5bmMgbWVzc2FnZS5cbiAgZnVuY3Rpb24gYWRkRGlzdHJpYnV0aW9uTGlzdFRvVXVpZFNlbnQoXG4gICAgbGlzdElkOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgdXVpZDogc3RyaW5nLFxuICAgIGNhblJlcGx5PzogYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICBpZiAoY29udmVyc2F0aW9uLmdldCgndXVpZCcpID09PSB1dWlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uTGlzdElkcyA9IHJlY2lwaWVudHNCeVV1aWQuZ2V0KHV1aWQpIHx8IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgaWYgKGxpc3RJZCkge1xuICAgICAgcmVjaXBpZW50c0J5VXVpZC5zZXQodXVpZCwgbmV3IFNldChbLi4uZGlzdHJpYnV0aW9uTGlzdElkcywgbGlzdElkXSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNpcGllbnRzQnlVdWlkLnNldCh1dWlkLCBkaXN0cmlidXRpb25MaXN0SWRzKTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUmVwbHkpIHtcbiAgICAgIGNhblJlcGx5VXVpZHMuYWRkKHV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIGxldCBpc1N5bmNNZXNzYWdlVXBkYXRlID0gZmFsc2U7XG5cbiAgLy8gU2VuZCB0byBhbGwgZGlzdHJpYnV0aW9uIGxpc3RzXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIG1lc3NhZ2VJZHMubWFwKGFzeW5jIG1lc3NhZ2VJZCA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobWVzc2FnZUlkKTtcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgc3Rvcmllcy5zZW5kU3RvcnkoJHttZXNzYWdlSWR9KTogbWVzc2FnZSB3YXMgbm90IGZvdW5kLCBtYXliZSBiZWNhdXNlIGl0IHdhcyBkZWxldGVkLiBHaXZpbmcgdXAgb24gc2VuZGluZyBpdGBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXNzYWdlQ29udmVyc2F0aW9uID0gbWVzc2FnZS5nZXRDb252ZXJzYXRpb24oKTtcbiAgICAgIGlmIChtZXNzYWdlQ29udmVyc2F0aW9uICE9PSBjb252ZXJzYXRpb24pIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBzdG9yaWVzLnNlbmRTdG9yeSgke21lc3NhZ2VJZH0pOiBNZXNzYWdlIGNvbnZlcnNhdGlvbiAnJHttZXNzYWdlQ29udmVyc2F0aW9uPy5pZEZvckxvZ2dpbmcoKX0nIGRvZXMgbm90IG1hdGNoIGpvYiBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChtZXNzYWdlLmlzRXJhc2VkKCkgfHwgbWVzc2FnZS5nZXQoJ2RlbGV0ZWRGb3JFdmVyeW9uZScpKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBzdG9yaWVzLnNlbmRTdG9yeSgke21lc3NhZ2VJZH0pOiBtZXNzYWdlIHdhcyBlcmFzZWQuIEdpdmluZyB1cCBvbiBzZW5kaW5nIGl0YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3RJZCA9IG1lc3NhZ2UuZ2V0KCdzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZCcpO1xuICAgICAgY29uc3QgcmVjZWl2ZXJJZCA9IGlzR3JvdXBWMihtZXNzYWdlQ29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpXG4gICAgICAgID8gbWVzc2FnZUNvbnZlcnNhdGlvbi5pZFxuICAgICAgICA6IGxpc3RJZDtcblxuICAgICAgaWYgKCFyZWNlaXZlcklkKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBzdG9yaWVzLnNlbmRTdG9yeSgke21lc3NhZ2VJZH0pOiBkaWQgbm90IGdldCBhIHZhbGlkIHJlY2lwaWVudCBJRCBmb3IgbWVzc2FnZS4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGlzdHJpYnV0aW9uTGlzdCA9IGlzR3JvdXBWMihtZXNzYWdlQ29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogYXdhaXQgZGF0YUludGVyZmFjZS5nZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKHJlY2VpdmVySWQpO1xuXG4gICAgICBsZXQgbWVzc2FnZVNlbmRFcnJvcnM6IEFycmF5PEVycm9yPiA9IFtdO1xuXG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNhdmUgZXJyb3JzIG9uIG1lc3NhZ2VzIHVubGVzcyB3ZSdyZSBnaXZpbmcgdXAuIElmIGl0J3Mgb3VyXG4gICAgICAvLyAgIGZpbmFsIGF0dGVtcHQsIHdlIGtub3cgdXBmcm9udCB0aGF0IHdlIHdhbnQgdG8gZ2l2ZSB1cC4gSG93ZXZlciwgd2UgbWlnaHQgYWxzb1xuICAgICAgLy8gICB3YW50IHRvIGdpdmUgdXAgaWYgKDEpIHdlIGdldCBhIDUwOCBmcm9tIHRoZSBzZXJ2ZXIsIGFza2luZyB1cyB0byBwbGVhc2Ugc3RvcFxuICAgICAgLy8gICAoMikgd2UgZ2V0IGEgNDI4IGZyb20gdGhlIHNlcnZlciwgZmxhZ2dpbmcgdGhlIG1lc3NhZ2UgZm9yIHNwYW0gKDMpIHNvbWUgb3RoZXJcbiAgICAgIC8vICAgcmVhc29uIG5vdCBrbm93biBhdCB0aGUgdGltZSBvZiB0aGlzIHdyaXRpbmcuXG4gICAgICAvL1xuICAgICAgLy8gVGhpcyBhd2t3YXJkIGNhbGxiYWNrIGxldHMgdXMgaG9sZCBvbnRvIGVycm9ycyB3ZSBtaWdodCB3YW50IHRvIHNhdmUsIHNvIHdlIGNhblxuICAgICAgLy8gICBkZWNpZGUgd2hldGhlciB0byBzYXZlIHRoZW0gbGF0ZXIgb24uXG4gICAgICBjb25zdCBzYXZlRXJyb3JzID0gaXNGaW5hbEF0dGVtcHRcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiAoZXJyb3JzOiBBcnJheTxFcnJvcj4pID0+IHtcbiAgICAgICAgICAgIG1lc3NhZ2VTZW5kRXJyb3JzID0gZXJyb3JzO1xuICAgICAgICAgIH07XG5cbiAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYHN0b3JpZXMuc2VuZFN0b3J5KCR7bWVzc2FnZUlkfSk6IHJhbiBvdXQgb2YgdGltZS4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IG1hcmtNZXNzYWdlRmFpbGVkKG1lc3NhZ2UsIFtcbiAgICAgICAgICBuZXcgRXJyb3IoJ01lc3NhZ2Ugc2VuZCByYW4gb3V0IG9mIHRpbWUnKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG9yaWdpbmFsRXJyb3I6IEVycm9yIHwgdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIGFsbFJlY2lwaWVudElkcyxcbiAgICAgICAgYWxsb3dlZFJlcGx5QnlVdWlkLFxuICAgICAgICBwZW5kaW5nU2VuZFJlY2lwaWVudElkcyxcbiAgICAgICAgc2VudFJlY2lwaWVudElkcyxcbiAgICAgICAgdW50cnVzdGVkVXVpZHMsXG4gICAgICB9ID0gZ2V0TWVzc2FnZVJlY2lwaWVudHMoe1xuICAgICAgICBsb2csXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICB9KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHVudHJ1c3RlZFV1aWRzLmxlbmd0aCkge1xuICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5jb252ZXJzYXRpb25TdG9wcGVkQnlNaXNzaW5nVmVyaWZpY2F0aW9uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgICAgICAgICB1bnRydXN0ZWRVdWlkcyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBzdG9yaWVzLnNlbmRTdG9yeSgke21lc3NhZ2VJZH0pOiBzZW5kaW5nIGJsb2NrZWQgYmVjYXVzZSAke3VudHJ1c3RlZFV1aWRzLmxlbmd0aH0gY29udmVyc2F0aW9uKHMpIHdlcmUgdW50cnVzdGVkLiBGYWlsaW5nIHRoaXMgYXR0ZW1wdC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcGVuZGluZ1NlbmRSZWNpcGllbnRJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgYWxsUmVjaXBpZW50SWRzLmZvckVhY2godXVpZCA9PlxuICAgICAgICAgICAgYWRkRGlzdHJpYnV0aW9uTGlzdFRvVXVpZFNlbnQoXG4gICAgICAgICAgICAgIGxpc3RJZCxcbiAgICAgICAgICAgICAgdXVpZCxcbiAgICAgICAgICAgICAgYWxsb3dlZFJlcGx5QnlVdWlkLmdldCh1dWlkKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgICAgIGNvbnN0IHJlY2lwaWVudHNTZXQgPSBuZXcgU2V0KHBlbmRpbmdTZW5kUmVjaXBpZW50SWRzKTtcblxuICAgICAgICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zRm9yUmVjaXBpZW50cyhcbiAgICAgICAgICBwZW5kaW5nU2VuZFJlY2lwaWVudElkc1xuICAgICAgICApO1xuXG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBzdG9yaWVzLnNlbmRTdG9yeSgke21lc3NhZ2VJZH0pOiBzZW5kaW5nIHN0b3J5IHRvICR7cmVjZWl2ZXJJZH1gXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qgc3RvcnlNZXNzYWdlID0gbmV3IFByb3RvLlN0b3J5TWVzc2FnZSgpO1xuICAgICAgICBzdG9yeU1lc3NhZ2UucHJvZmlsZUtleSA9IG9yaWdpbmFsU3RvcnlNZXNzYWdlLnByb2ZpbGVLZXk7XG4gICAgICAgIHN0b3J5TWVzc2FnZS5maWxlQXR0YWNobWVudCA9IG9yaWdpbmFsU3RvcnlNZXNzYWdlLmZpbGVBdHRhY2htZW50O1xuICAgICAgICBzdG9yeU1lc3NhZ2UudGV4dEF0dGFjaG1lbnQgPSBvcmlnaW5hbFN0b3J5TWVzc2FnZS50ZXh0QXR0YWNobWVudDtcbiAgICAgICAgc3RvcnlNZXNzYWdlLmdyb3VwID0gb3JpZ2luYWxTdG9yeU1lc3NhZ2UuZ3JvdXA7XG4gICAgICAgIHN0b3J5TWVzc2FnZS5hbGxvd3NSZXBsaWVzID1cbiAgICAgICAgICBpc0dyb3VwVjIobWVzc2FnZUNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSB8fFxuICAgICAgICAgIEJvb2xlYW4oZGlzdHJpYnV0aW9uTGlzdD8uYWxsb3dzUmVwbGllcyk7XG5cbiAgICAgICAgY29uc3Qgc2VuZFRhcmdldCA9IGRpc3RyaWJ1dGlvbkxpc3RcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgZ2V0R3JvdXBJZDogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBnZXRNZW1iZXJzOiAoKSA9PlxuICAgICAgICAgICAgICAgIHBlbmRpbmdTZW5kUmVjaXBpZW50SWRzXG4gICAgICAgICAgICAgICAgICAubWFwKHV1aWQgPT4gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHV1aWQpKVxuICAgICAgICAgICAgICAgICAgLmZpbHRlcihpc05vdE5pbCksXG4gICAgICAgICAgICAgIGhhc01lbWJlcjogKHV1aWQ6IFVVSURTdHJpbmdUeXBlKSA9PiByZWNpcGllbnRzU2V0Lmhhcyh1dWlkKSxcbiAgICAgICAgICAgICAgaWRGb3JMb2dnaW5nOiAoKSA9PiBgZGwoJHtyZWNlaXZlcklkfSlgLFxuICAgICAgICAgICAgICBpc0dyb3VwVjI6ICgpID0+IHRydWUsXG4gICAgICAgICAgICAgIGlzVmFsaWQ6ICgpID0+IHRydWUsXG4gICAgICAgICAgICAgIGdldFNlbmRlcktleUluZm86ICgpID0+IGRpc3RyaWJ1dGlvbkxpc3Quc2VuZGVyS2V5SW5mbyxcbiAgICAgICAgICAgICAgc2F2ZVNlbmRlcktleUluZm86IGFzeW5jIChzZW5kZXJLZXlJbmZvOiBTZW5kZXJLZXlJbmZvVHlwZSkgPT5cbiAgICAgICAgICAgICAgICBkYXRhSW50ZXJmYWNlLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uKHtcbiAgICAgICAgICAgICAgICAgIC4uLmRpc3RyaWJ1dGlvbkxpc3QsXG4gICAgICAgICAgICAgICAgICBzZW5kZXJLZXlJbmZvLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogY29udmVyc2F0aW9uLnRvU2VuZGVyS2V5VGFyZ2V0KCk7XG5cbiAgICAgICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgICAgICBjb250ZW50TWVzc2FnZS5zdG9yeU1lc3NhZ2UgPSBzdG9yeU1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgaW5uZXJQcm9taXNlID0gc2VuZENvbnRlbnRNZXNzYWdlVG9Hcm91cCh7XG4gICAgICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LklNUExJQ0lULFxuICAgICAgICAgIGNvbnRlbnRNZXNzYWdlLFxuICAgICAgICAgIGlzUGFydGlhbFNlbmQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2VJZDogdW5kZWZpbmVkLFxuICAgICAgICAgIHJlY2lwaWVudHM6IHBlbmRpbmdTZW5kUmVjaXBpZW50SWRzLFxuICAgICAgICAgIHNlbmRPcHRpb25zLFxuICAgICAgICAgIHNlbmRUYXJnZXQsXG4gICAgICAgICAgc2VuZFR5cGU6ICdzdG9yeScsXG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERvIG5vdCBzZW5kIHN5bmMgbWVzc2FnZXMgZm9yIGRpc3RyaWJ1dGlvbiBsaXN0cyBzaW5jZSB0aGF0J3Mgc2VudFxuICAgICAgICAvLyBpbiBidWxrIGF0IHRoZSBlbmQuXG4gICAgICAgIG1lc3NhZ2UuZG9Ob3RTZW5kU3luY01lc3NhZ2UgPSBCb29sZWFuKGRpc3RyaWJ1dGlvbkxpc3QpO1xuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VTZW5kUHJvbWlzZSA9IG1lc3NhZ2Uuc2VuZChcbiAgICAgICAgICBoYW5kbGVNZXNzYWdlU2VuZChpbm5lclByb21pc2UsIHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZHM6IFttZXNzYWdlSWRdLFxuICAgICAgICAgICAgc2VuZFR5cGU6ICdzdG9yeScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgc2F2ZUVycm9yc1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgbWVzc2FnZS5zZW5kIHN3YWxsb3dzIGFuZCBwcm9jZXNzZXMgZXJyb3JzLCB3ZSdsbCBhd2FpdCB0aGVcbiAgICAgICAgLy8gaW5uZXIgcHJvbWlzZSB0byBnZXQgdGhlIFNlbmRNZXNzYWdlUHJvdG9FcnJvciwgd2hpY2ggZ2l2ZXMgdXNcbiAgICAgICAgLy8gaW5mb3JtYXRpb24gdXBzdHJlYW0gcHJvY2Vzc29ycyBuZWVkIHRvIGRldGVjdCBjZXJ0YWluIGtpbmRzIG9mIHNpdHVhdGlvbnMuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgaW5uZXJQcm9taXNlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEVycm9yID0gZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgICAgYHByb21pc2VGb3JFcnJvciB0aHJldyBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBlcnJvcjogJHtFcnJvcnMudG9Mb2dGb3JtYXQoXG4gICAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICAgKX1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IG1lc3NhZ2VTZW5kUHJvbWlzZTtcblxuICAgICAgICAvLyBUcmFjayBzZW5kU3RhdGUgYWNyb3NzIG1lc3NhZ2Ugc2VuZHMgc28gdGhhdCB3ZSBjYW4gdXBkYXRlIGFsbFxuICAgICAgICAvLyBzdWJzZXF1ZW50IG1lc3NhZ2VzLlxuICAgICAgICBjb25zdCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID1cbiAgICAgICAgICBtZXNzYWdlLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9O1xuICAgICAgICBPYmplY3QuZW50cmllcyhzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKS5mb3JFYWNoKFxuICAgICAgICAgIChbcmVjaXBpZW50Q29udmVyc2F0aW9uSWQsIHNlbmRTdGF0ZV0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXNTZW50KHNlbmRTdGF0ZS5zdGF0dXMpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VudENvbnZlcnNhdGlvbklkcy5zZXQocmVjaXBpZW50Q29udmVyc2F0aW9uSWQsIHNlbmRTdGF0ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChcbiAgICAgICAgICAgICAgcmVjaXBpZW50Q29udmVyc2F0aW9uSWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1dWlkID0gcmVjaXBpZW50Py5nZXQoJ3V1aWQnKTtcbiAgICAgICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW50VXVpZHMuYWRkKHV1aWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBhbGxSZWNpcGllbnRJZHMuZm9yRWFjaCh1dWlkID0+IHtcbiAgICAgICAgICBhZGREaXN0cmlidXRpb25MaXN0VG9VdWlkU2VudChcbiAgICAgICAgICAgIGxpc3RJZCxcbiAgICAgICAgICAgIHV1aWQsXG4gICAgICAgICAgICBhbGxvd2VkUmVwbHlCeVV1aWQuZ2V0KHV1aWQpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGlkRnVsbHlTZW5kID1cbiAgICAgICAgICAhbWVzc2FnZVNlbmRFcnJvcnMubGVuZ3RoIHx8IGRpZFNlbmRUb0V2ZXJ5b25lKG1lc3NhZ2UpO1xuICAgICAgICBpZiAoIWRpZEZ1bGx5U2VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWVzc2FnZSBkaWQgbm90IGZ1bGx5IHNlbmQnKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAodGhyb3duRXJyb3I6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gW3Rocm93bkVycm9yLCAuLi5tZXNzYWdlU2VuZEVycm9yc107XG4gICAgICAgIGF3YWl0IGhhbmRsZU11bHRpcGxlU2VuZEVycm9ycyh7XG4gICAgICAgICAgZXJyb3JzLFxuICAgICAgICAgIGlzRmluYWxBdHRlbXB0LFxuICAgICAgICAgIGxvZyxcbiAgICAgICAgICBtYXJrRmFpbGVkOiAoKSA9PiBtYXJrTWVzc2FnZUZhaWxlZChtZXNzYWdlLCBtZXNzYWdlU2VuZEVycm9ycyksXG4gICAgICAgICAgdGltZVJlbWFpbmluZyxcbiAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhIGZhaWxlZCBncm91cCBzZW5kIHRocm93bkVycm9yIHdpbGwgbm90IGJlXG4gICAgICAgICAgLy8gU2VudE1lc3NhZ2VQcm90b0Vycm9yLCBidXQgd2Ugc2hvdWxkIGhhdmUgYmVlbiBhYmxlIHRvIGhhcnZlc3RcbiAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgZXJyb3IuIEluIHRoZSBOb3RlIHRvIFNlbGYgc2VuZCBjYXNlLCB0aHJvd25FcnJvclxuICAgICAgICAgIC8vIHdpbGwgYmUgdGhlIGVycm9yIHdlIGNhcmUgYWJvdXQsIGFuZCB3ZSB3b24ndCBoYXZlIGFuIG9yaWdpbmFsRXJyb3IuXG4gICAgICAgICAgdG9UaHJvdzogb3JpZ2luYWxFcnJvciB8fCB0aHJvd25FcnJvcixcbiAgICAgICAgfSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpc1N5bmNNZXNzYWdlVXBkYXRlID0gc2VudFJlY2lwaWVudElkcy5sZW5ndGggPiAwO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgLy8gU29tZSBjb250YWN0cyBhcmUgZHVwbGljYXRlZCBhY3Jvc3MgbGlzdHMgYW5kIHdlIGRvbid0IHNlbmQgZHVwbGljYXRlXG4gIC8vIG1lc3NhZ2VzIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkXG4gIC8vIGlzIGtlcHQgaW4gc3luYyBhY3Jvc3MgYWxsIG1lc3NhZ2VzLlxuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBtZXNzYWdlSWRzLm1hcChhc3luYyBtZXNzYWdlSWQgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID1cbiAgICAgICAgbWVzc2FnZS5nZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnKSB8fCB7fTtcblxuICAgICAgY29uc3QgbmV3U2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9IE9iamVjdC5rZXlzKFxuICAgICAgICBvbGRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkXG4gICAgICApLnJlZHVjZSgoYWNjLCBjb252ZXJzYXRpb25JZCkgPT4ge1xuICAgICAgICBjb25zdCBzZW5kU3RhdGUgPSBzZW50Q29udmVyc2F0aW9uSWRzLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgIGlmIChzZW5kU3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgICAgW2NvbnZlcnNhdGlvbklkXTogc2VuZFN0YXRlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30gYXMgU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCk7XG5cbiAgICAgIGlmIChpc0VxdWFsKG9sZFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIG5ld1NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbWVzc2FnZS5zZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnLCBuZXdTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKTtcbiAgICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobWVzc2FnZS5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICB9KVxuICApO1xuXG4gIC8vIFJlbW92ZSBhbnkgdW5zZW50IHJlY2lwaWVudHNcbiAgcmVjaXBpZW50c0J5VXVpZC5mb3JFYWNoKChfdmFsdWUsIHV1aWQpID0+IHtcbiAgICBpZiAoc2VudFV1aWRzLmhhcyh1dWlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlY2lwaWVudHNCeVV1aWQuZGVsZXRlKHV1aWQpO1xuICB9KTtcblxuICAvLyBCdWlsZCB1cCB0aGUgc3luYyBtZXNzYWdlJ3Mgc3RvcnlNZXNzYWdlUmVjaXBpZW50cyBhbmQgc2VuZCBpdFxuICBjb25zdCBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzOiBBcnJheTx7XG4gICAgZGVzdGluYXRpb25VdWlkOiBzdHJpbmc7XG4gICAgZGlzdHJpYnV0aW9uTGlzdElkczogQXJyYXk8c3RyaW5nPjtcbiAgICBpc0FsbG93ZWRUb1JlcGx5OiBib29sZWFuO1xuICB9PiA9IFtdO1xuICByZWNpcGllbnRzQnlVdWlkLmZvckVhY2goKGRpc3RyaWJ1dGlvbkxpc3RJZHMsIGRlc3RpbmF0aW9uVXVpZCkgPT4ge1xuICAgIHN0b3J5TWVzc2FnZVJlY2lwaWVudHMucHVzaCh7XG4gICAgICBkZXN0aW5hdGlvblV1aWQsXG4gICAgICBkaXN0cmlidXRpb25MaXN0SWRzOiBBcnJheS5mcm9tKGRpc3RyaWJ1dGlvbkxpc3RJZHMpLFxuICAgICAgaXNBbGxvd2VkVG9SZXBseTogY2FuUmVwbHlVdWlkcy5oYXMoZGVzdGluYXRpb25VdWlkKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLCB7XG4gICAgc3luY01lc3NhZ2U6IHRydWUsXG4gIH0pO1xuXG4gIG1lc3NhZ2luZy5zZW5kU3luY01lc3NhZ2Uoe1xuICAgIGRlc3RpbmF0aW9uOiBjb252ZXJzYXRpb24uZ2V0KCdlMTY0JyksXG4gICAgZGVzdGluYXRpb25VdWlkOiBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJyksXG4gICAgc3RvcnlNZXNzYWdlOiBvcmlnaW5hbFN0b3J5TWVzc2FnZSxcbiAgICBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzLFxuICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcDogbnVsbCxcbiAgICBpc1VwZGF0ZTogaXNTeW5jTWVzc2FnZVVwZGF0ZSxcbiAgICBvcHRpb25zLFxuICAgIHRpbWVzdGFtcCxcbiAgICB1cmdlbnQ6IGZhbHNlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZVJlY2lwaWVudHMoe1xuICBsb2csXG4gIG1lc3NhZ2UsXG59OiBSZWFkb25seTx7XG4gIGxvZzogTG9nZ2VyVHlwZTtcbiAgbWVzc2FnZTogTWVzc2FnZU1vZGVsO1xufT4pOiB7XG4gIGFsbFJlY2lwaWVudElkczogQXJyYXk8c3RyaW5nPjtcbiAgYWxsb3dlZFJlcGx5QnlVdWlkOiBNYXA8c3RyaW5nLCBib29sZWFuPjtcbiAgcGVuZGluZ1NlbmRSZWNpcGllbnRJZHM6IEFycmF5PHN0cmluZz47XG4gIHNlbnRSZWNpcGllbnRJZHM6IEFycmF5PHN0cmluZz47XG4gIHVudHJ1c3RlZFV1aWRzOiBBcnJheTxzdHJpbmc+O1xufSB7XG4gIGNvbnN0IGFsbFJlY2lwaWVudElkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCBhbGxvd2VkUmVwbHlCeVV1aWQgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgY29uc3QgcGVuZGluZ1NlbmRSZWNpcGllbnRJZHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgY29uc3Qgc2VudFJlY2lwaWVudElkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCB1bnRydXN0ZWRVdWlkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gIE9iamVjdC5lbnRyaWVzKG1lc3NhZ2UuZ2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJykgfHwge30pLmZvckVhY2goXG4gICAgKFtyZWNpcGllbnRDb252ZXJzYXRpb25JZCwgc2VuZFN0YXRlXSkgPT4ge1xuICAgICAgY29uc3QgcmVjaXBpZW50ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KFxuICAgICAgICByZWNpcGllbnRDb252ZXJzYXRpb25JZFxuICAgICAgKTtcbiAgICAgIGlmICghcmVjaXBpZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNSZWNpcGllbnRNZSA9IGlzTWUocmVjaXBpZW50LmF0dHJpYnV0ZXMpO1xuICAgICAgaWYgKGlzUmVjaXBpZW50TWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjaXBpZW50LmlzVW50cnVzdGVkKCkpIHtcbiAgICAgICAgY29uc3QgdXVpZCA9IHJlY2lwaWVudC5nZXQoJ3V1aWQnKTtcbiAgICAgICAgaWYgKCF1dWlkKSB7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgYHN0b3JpZXMuc2VuZFN0b3J5L2dldE1lc3NhZ2VSZWNpcGllbnRzOiBVbnRydXN0ZWQgY29udmVyc2F0aW9uICR7cmVjaXBpZW50LmlkRm9yTG9nZ2luZygpfSBtaXNzaW5nIFVVSUQuYFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHVudHJ1c3RlZFV1aWRzLnB1c2godXVpZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNpcGllbnQuaXNVbnJlZ2lzdGVyZWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudFNlbmRUYXJnZXQgPSByZWNpcGllbnQuZ2V0U2VuZFRhcmdldCgpO1xuICAgICAgaWYgKCFyZWNpcGllbnRTZW5kVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYWxsb3dlZFJlcGx5QnlVdWlkLnNldChcbiAgICAgICAgcmVjaXBpZW50U2VuZFRhcmdldCxcbiAgICAgICAgQm9vbGVhbihzZW5kU3RhdGUuaXNBbGxvd2VkVG9SZXBseVRvU3RvcnkpXG4gICAgICApO1xuICAgICAgYWxsUmVjaXBpZW50SWRzLnB1c2gocmVjaXBpZW50U2VuZFRhcmdldCk7XG5cbiAgICAgIGlmIChzZW5kU3RhdGUuaXNBbHJlYWR5SW5jbHVkZWRJbkFub3RoZXJEaXN0cmlidXRpb25MaXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzU2VudChzZW5kU3RhdGUuc3RhdHVzKSkge1xuICAgICAgICBzZW50UmVjaXBpZW50SWRzLnB1c2gocmVjaXBpZW50U2VuZFRhcmdldCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcGVuZGluZ1NlbmRSZWNpcGllbnRJZHMucHVzaChyZWNpcGllbnRTZW5kVGFyZ2V0KTtcbiAgICB9XG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBhbGxSZWNpcGllbnRJZHMsXG4gICAgYWxsb3dlZFJlcGx5QnlVdWlkLFxuICAgIHBlbmRpbmdTZW5kUmVjaXBpZW50SWRzLFxuICAgIHNlbnRSZWNpcGllbnRJZHMsXG4gICAgdW50cnVzdGVkVXVpZHMsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtNZXNzYWdlRmFpbGVkKFxuICBtZXNzYWdlOiBNZXNzYWdlTW9kZWwsXG4gIGVycm9yczogQXJyYXk8RXJyb3I+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgbWVzc2FnZS5tYXJrRmFpbGVkKCk7XG4gIG1lc3NhZ2Uuc2F2ZUVycm9ycyhlcnJvcnMsIHsgc2tpcFNhdmU6IHRydWUgfSk7XG4gIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlkU2VuZFRvRXZlcnlvbmUobWVzc2FnZTogUmVhZG9ubHk8TWVzc2FnZU1vZGVsPik6IGJvb2xlYW4ge1xuICBjb25zdCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID1cbiAgICBtZXNzYWdlLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9O1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKS5ldmVyeShcbiAgICBzZW5kU3RhdGUgPT5cbiAgICAgIHNlbmRTdGF0ZS5pc0FscmVhZHlJbmNsdWRlZEluQW5vdGhlckRpc3RyaWJ1dGlvbkxpc3QgfHxcbiAgICAgIGlzU2VudChzZW5kU3RhdGUuc3RhdHVzKVxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUF3QjtBQWtCeEIsYUFBd0I7QUFDeEIsb0JBQTBCO0FBQzFCLHNCQUF1QztBQUN2Qyw0QkFBK0I7QUFDL0IsNEJBR087QUFDUCwrQkFBa0M7QUFDbEMsc0NBQXlDO0FBQ3pDLG9DQUFnQztBQUNoQyxzQkFBeUI7QUFDekIsOEJBQXVCO0FBQ3ZCLDJCQUFxQztBQUNyQyx5QkFBMEM7QUFFMUMseUJBQ0UsY0FDQTtBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FFRixNQUNlO0FBQ2YsUUFBTSxFQUFFLFlBQVksY0FBYztBQUVsQyxRQUFNLGFBQWEsTUFBTSwwQ0FBcUIsSUFBSTtBQUVsRCxNQUFJLENBQUMsWUFBWTtBQUNmLFFBQUksS0FBSywrQ0FBK0M7QUFDeEQ7QUFBQSxFQUNGO0FBTUEsUUFBTSx1QkFBdUIsTUFBTyxhQUUvQjtBQUNILFVBQU0sQ0FBQyxhQUFhO0FBQ3BCLFVBQU0sVUFBVSxNQUFNLDBDQUFlLFNBQVM7QUFDOUMsUUFBSSxDQUFDLFNBQVM7QUFDWixVQUFJLEtBQ0YscUJBQXFCLDBGQUN2QjtBQUNBO0FBQUEsSUFDRjtBQUVBLFVBQU0sc0JBQXNCLFFBQVEsZ0JBQWdCO0FBQ3BELFFBQUksd0JBQXdCLGNBQWM7QUFDeEMsVUFBSSxNQUNGLHFCQUFxQixxQ0FBcUMscUJBQXFCLGFBQWEsc0NBQXNDLGFBQWEsYUFBYSxHQUM5SjtBQUNBO0FBQUEsSUFDRjtBQUVBLFVBQU0sY0FB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LFNBQU8sUUFBUSxRQUFRLElBQUksMkJBQTJCLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFDN0QsQ0FBQyxDQUFDLHlCQUF5QixlQUFlO0FBQ3hDLFVBQU0sWUFBWSxPQUFPLHVCQUF1QixJQUM5Qyx1QkFDRjtBQUNBLFFBQUksQ0FBQyxXQUFXO0FBQ2Q7QUFBQSxJQUNGO0FBRUEsVUFBTSxnQkFBZ0Isd0NBQUssVUFBVSxVQUFVO0FBQy9DLFFBQUksZUFBZTtBQUNqQjtBQUFBLElBQ0Y7QUFFQSxRQUFJLFVBQVUsWUFBWSxHQUFHO0FBQzNCLFlBQU0sT0FBTyxVQUFVLElBQUksTUFBTTtBQUNqQyxVQUFJLENBQUMsTUFBTTtBQUNULFlBQUksTUFDRixrRUFBa0UsVUFBVSxhQUFhLGlCQUMzRjtBQUNBO0FBQUEsTUFDRjtBQUNBLHFCQUFlLEtBQUssSUFBSTtBQUN4QjtBQUFBLElBQ0Y7QUFDQSxRQUFJLFVBQVUsZUFBZSxHQUFHO0FBQzlCO0FBQUEsSUFDRjtBQUVBLFVBQU0sc0JBQXNCLFVBQVUsY0FBYztBQUNwRCxRQUFJLENBQUMscUJBQXFCO0FBQ3hCO0FBQUEsSUFDRjtBQUVBLHVCQUFtQixJQUNqQixxQkFDQSxRQUFRLFVBQVUsdUJBQXVCLENBQzNDO0FBQ0Esb0JBQWdCLEtBQUssbUJBQW1CO0FBRXhDLFFBQUksVUFBVSw0Q0FBNEM7QUFDeEQ7QUFBQSxJQUNGO0FBRUEsUUFBSSxvQ0FBTyxVQUFVLE1BQU0sR0FBRztBQUM1Qix1QkFBaUIsS0FBSyxtQkFBbUI7QUFDekM7QUFBQSxJQUNGO0FBRUEsNEJBQXdCLEtBQUssbUJBQW1CO0FBQUEsRUFDbEQsQ0FDRjtBQUVBLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQS9FUyxBQWlGVCxpQ0FDRSxTQUNBLFFBQ2U7QUFDZixVQUFRLFdBQVc7QUFDbkIsVUFBUSxXQUFXLFFBQVEsRUFBRSxVQUFVLEtBQUssQ0FBQztBQUM3QyxRQUFNLE9BQU8sT0FBTyxLQUFLLFlBQVksUUFBUSxZQUFZO0FBQUEsSUFDdkQsU0FBUyxPQUFPLFdBQVcsUUFBUSxLQUFLLGVBQWUsRUFBRSxTQUFTO0FBQUEsRUFDcEUsQ0FBQztBQUNIO0FBVGUsQUFXZiwyQkFBMkIsU0FBMEM7QUFDbkUsUUFBTSw0QkFDSixRQUFRLElBQUksMkJBQTJCLEtBQUssQ0FBQztBQUMvQyxTQUFPLE9BQU8sT0FBTyx5QkFBeUIsRUFBRSxNQUM5QyxlQUNFLFVBQVUsOENBQ1Ysb0NBQU8sVUFBVSxNQUFNLENBQzNCO0FBQ0Y7QUFSUyIsCiAgIm5hbWVzIjogW10KfQo=
