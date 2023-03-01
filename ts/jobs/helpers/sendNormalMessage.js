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
var sendNormalMessage_exports = {};
__export(sendNormalMessage_exports, {
  sendNormalMessage: () => sendNormalMessage
});
module.exports = __toCommonJS(sendNormalMessage_exports);
var import_lodash = require("lodash");
var Errors = __toESM(require("../../types/errors"));
var import_getMessageById = require("../../messages/getMessageById");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_getSendOptions = require("../../util/getSendOptions");
var import_protobuf = require("../../protobuf");
var import_handleMessageSend = require("../../util/handleMessageSend");
var import_MessageSendState = require("../../messages/MessageSendState");
var import_message = require("../../state/selectors/message");
var import_handleMultipleSendErrors = require("./handleMultipleSendErrors");
var import_ourProfileKey = require("../../services/ourProfileKey");
var import_isConversationUnregistered = require("../../util/isConversationUnregistered");
var import_isConversationAccepted = require("../../util/isConversationAccepted");
var import_sendToGroup = require("../../util/sendToGroup");
async function sendNormalMessage(conversation, {
  isFinalAttempt,
  messaging,
  shouldContinue,
  timeRemaining,
  log
}, data) {
  const { Message } = window.Signal.Types;
  const { messageId, revision } = data;
  const message = await (0, import_getMessageById.getMessageById)(messageId);
  if (!message) {
    log.info(`message ${messageId} was not found, maybe because it was deleted. Giving up on sending it`);
    return;
  }
  const messageConversation = message.getConversation();
  if (messageConversation !== conversation) {
    log.error(`Message conversation '${messageConversation?.idForLogging()}' does not match job conversation ${conversation.idForLogging()}`);
    return;
  }
  if (!(0, import_message.isOutgoing)(message.attributes)) {
    log.error(`message ${messageId} was not an outgoing message to begin with. This is probably a bogus job. Giving up on sending it`);
    return;
  }
  if (message.isErased() || message.get("deletedForEveryone")) {
    log.info(`message ${messageId} was erased. Giving up on sending it`);
    return;
  }
  let messageSendErrors = [];
  const saveErrors = isFinalAttempt ? void 0 : (errors) => {
    messageSendErrors = errors;
  };
  if (!shouldContinue) {
    log.info(`message ${messageId} ran out of time. Giving up on sending it`);
    await markMessageFailed(message, [
      new Error("Message send ran out of time")
    ]);
    return;
  }
  let profileKey;
  if (conversation.get("profileSharing")) {
    profileKey = await import_ourProfileKey.ourProfileKeyService.get();
  }
  let originalError;
  try {
    const {
      allRecipientIdentifiers,
      recipientIdentifiersWithoutMe,
      sentRecipientIdentifiers,
      untrustedUuids
    } = getMessageRecipients({
      log,
      message,
      conversation
    });
    if (untrustedUuids.length) {
      window.reduxActions.conversations.conversationStoppedByMissingVerification({
        conversationId: conversation.id,
        untrustedUuids
      });
      throw new Error(`Message ${messageId} sending blocked because ${untrustedUuids.length} conversation(s) were untrusted. Failing this attempt.`);
    }
    if (!allRecipientIdentifiers.length) {
      log.warn(`trying to send message ${messageId} but it looks like it was already sent to everyone. This is unexpected, but we're giving up`);
      return;
    }
    const {
      attachments,
      body,
      contact,
      deletedForEveryoneTimestamp,
      expireTimer,
      mentions,
      messageTimestamp,
      preview,
      quote,
      sticker,
      storyContext
    } = await getMessageSendData({ log, message });
    let messageSendPromise;
    if (recipientIdentifiersWithoutMe.length === 0) {
      if (!(0, import_whatTypeOfConversation.isMe)(conversation.attributes) && !(0, import_whatTypeOfConversation.isGroup)(conversation.attributes) && sentRecipientIdentifiers.length === 0) {
        log.info("No recipients; not sending to ourselves or to group, and no successful sends. Failing job.");
        markMessageFailed(message, [new Error("No valid recipients")]);
        return;
      }
      log.info("sending sync message only");
      const dataMessage = await messaging.getDataMessage({
        attachments,
        body,
        contact,
        deletedForEveryoneTimestamp,
        expireTimer,
        groupV2: conversation.getGroupV2Info({
          members: recipientIdentifiersWithoutMe
        }),
        preview,
        profileKey,
        quote,
        recipients: allRecipientIdentifiers,
        sticker,
        timestamp: messageTimestamp
      });
      messageSendPromise = message.sendSyncMessageOnly(dataMessage, saveErrors);
    } else {
      const conversationType = conversation.get("type");
      const sendOptions = await (0, import_getSendOptions.getSendOptions)(conversation.attributes);
      const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
      let innerPromise;
      if (conversationType === Message.GROUP) {
        if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes) && !(0, import_lodash.isNumber)(revision)) {
          log.error("No revision provided, but conversation is GroupV2");
        }
        const groupV2Info = conversation.getGroupV2Info({
          members: recipientIdentifiersWithoutMe
        });
        if (groupV2Info && (0, import_lodash.isNumber)(revision)) {
          groupV2Info.revision = revision;
        }
        log.info("sending group message");
        innerPromise = conversation.queueJob("conversationQueue/sendNormalMessage", (abortSignal) => (0, import_sendToGroup.sendToGroup)({
          abortSignal,
          contentHint: ContentHint.RESENDABLE,
          groupSendOptions: {
            attachments,
            contact,
            deletedForEveryoneTimestamp,
            expireTimer,
            groupV1: conversation.getGroupV1Info(recipientIdentifiersWithoutMe),
            groupV2: groupV2Info,
            messageText: body,
            preview,
            profileKey,
            quote,
            sticker,
            storyContext,
            timestamp: messageTimestamp,
            mentions
          },
          messageId,
          sendOptions,
          sendTarget: conversation.toSenderKeyTarget(),
          sendType: "message",
          urgent: true
        }));
      } else {
        if (!(0, import_isConversationAccepted.isConversationAccepted)(conversation.attributes)) {
          log.info(`conversation ${conversation.idForLogging()} is not accepted; refusing to send`);
          markMessageFailed(message, [
            new Error("Message request was not accepted")
          ]);
          return;
        }
        if ((0, import_isConversationUnregistered.isConversationUnregistered)(conversation.attributes)) {
          log.info(`conversation ${conversation.idForLogging()} is unregistered; refusing to send`);
          markMessageFailed(message, [
            new Error("Contact no longer has a Signal account")
          ]);
          return;
        }
        if (conversation.isBlocked()) {
          log.info(`conversation ${conversation.idForLogging()} is blocked; refusing to send`);
          markMessageFailed(message, [new Error("Contact is blocked")]);
          return;
        }
        log.info("sending direct message");
        innerPromise = messaging.sendMessageToIdentifier({
          attachments,
          contact,
          contentHint: ContentHint.RESENDABLE,
          deletedForEveryoneTimestamp,
          expireTimer,
          groupId: void 0,
          identifier: recipientIdentifiersWithoutMe[0],
          messageText: body,
          options: sendOptions,
          preview,
          profileKey,
          quote,
          reaction: void 0,
          sticker,
          storyContext,
          timestamp: messageTimestamp,
          urgent: true
        });
      }
      messageSendPromise = message.send((0, import_handleMessageSend.handleMessageSend)(innerPromise, {
        messageIds: [messageId],
        sendType: "message"
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
    }
    await messageSendPromise;
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
  }
}
function getMessageRecipients({
  log,
  conversation,
  message
}) {
  const allRecipientIdentifiers = [];
  const recipientIdentifiersWithoutMe = [];
  const untrustedUuids = [];
  const sentRecipientIdentifiers = [];
  const currentConversationRecipients = conversation.getMemberConversationIds();
  Object.entries(message.get("sendStateByConversationId") || {}).forEach(([recipientConversationId, sendState]) => {
    const recipient = window.ConversationController.get(recipientConversationId);
    if (!recipient) {
      return;
    }
    const isRecipientMe = (0, import_whatTypeOfConversation.isMe)(recipient.attributes);
    if (!currentConversationRecipients.has(recipientConversationId) && !isRecipientMe) {
      return;
    }
    if (recipient.isUntrusted()) {
      const uuid = recipient.get("uuid");
      if (!uuid) {
        log.error(`sendNormalMessage/getMessageRecipients: Untrusted conversation ${recipient.idForLogging()} missing UUID.`);
        return;
      }
      untrustedUuids.push(uuid);
      return;
    }
    if (recipient.isUnregistered()) {
      return;
    }
    const recipientIdentifier = recipient.getSendTarget();
    if (!recipientIdentifier) {
      return;
    }
    if ((0, import_MessageSendState.isSent)(sendState.status)) {
      sentRecipientIdentifiers.push(recipientIdentifier);
      return;
    }
    allRecipientIdentifiers.push(recipientIdentifier);
    if (!isRecipientMe) {
      recipientIdentifiersWithoutMe.push(recipientIdentifier);
    }
  });
  return {
    allRecipientIdentifiers,
    recipientIdentifiersWithoutMe,
    sentRecipientIdentifiers,
    untrustedUuids
  };
}
async function getMessageSendData({
  log,
  message
}) {
  const {
    loadAttachmentData,
    loadContactData,
    loadPreviewData,
    loadQuoteData,
    loadStickerData
  } = window.Signal.Migrations;
  let messageTimestamp;
  const sentAt = message.get("sent_at");
  const timestamp = message.get("timestamp");
  if (sentAt) {
    messageTimestamp = sentAt;
  } else if (timestamp) {
    log.error("message lacked sent_at. Falling back to timestamp");
    messageTimestamp = timestamp;
  } else {
    log.error("message lacked sent_at and timestamp. Falling back to current time");
    messageTimestamp = Date.now();
  }
  const storyId = message.get("storyId");
  const [attachmentsWithData, contact, preview, quote, sticker, storyMessage] = await Promise.all([
    Promise.all((message.get("attachments") ?? []).map(loadAttachmentData)),
    message.cachedOutgoingContactData || loadContactData(message.get("contact")),
    message.cachedOutgoingPreviewData || loadPreviewData(message.get("preview")),
    message.cachedOutgoingQuoteData || loadQuoteData(message.get("quote")),
    message.cachedOutgoingStickerData || loadStickerData(message.get("sticker")),
    storyId ? (0, import_getMessageById.getMessageById)(storyId) : void 0
  ]);
  const { body, attachments } = window.Whisper.Message.getLongMessageAttachment({
    body: message.get("body"),
    attachments: attachmentsWithData,
    now: messageTimestamp
  });
  return {
    attachments,
    body,
    contact,
    deletedForEveryoneTimestamp: message.get("deletedForEveryoneTimestamp"),
    expireTimer: message.get("expireTimer"),
    mentions: message.get("bodyRanges"),
    messageTimestamp,
    preview,
    quote,
    sticker,
    storyContext: storyMessage ? {
      authorUuid: storyMessage.get("sourceUuid"),
      timestamp: storyMessage.get("sent_at")
    } : void 0
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
  return Object.values(sendStateByConversationId).every((sendState) => (0, import_MessageSendState.isSent)(sendState.status));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendNormalMessage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZE5vcm1hbE1lc3NhZ2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL21lc3NhZ2VzJztcbmltcG9ydCB7IGdldE1lc3NhZ2VCeUlkIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvZ2V0TWVzc2FnZUJ5SWQnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGlzR3JvdXAsIGlzR3JvdXBWMiwgaXNNZSB9IGZyb20gJy4uLy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uLy4uL3Byb3RvYnVmJztcbmltcG9ydCB7IGhhbmRsZU1lc3NhZ2VTZW5kIH0gZnJvbSAnLi4vLi4vdXRpbC9oYW5kbGVNZXNzYWdlU2VuZCc7XG5pbXBvcnQgdHlwZSB7IENhbGxiYWNrUmVzdWx0VHlwZSB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvVHlwZXMuZCc7XG5pbXBvcnQgeyBpc1NlbnQgfSBmcm9tICcuLi8uLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCB7IGlzT3V0Z29pbmcgfSBmcm9tICcuLi8uLi9zdGF0ZS9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgdHlwZSB7XG4gIEF0dGFjaG1lbnRUeXBlLFxuICBDb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyLFxufSBmcm9tICcuLi8uLi90ZXh0c2VjdXJlL1NlbmRNZXNzYWdlJztcbmltcG9ydCB0eXBlIHsgTGlua1ByZXZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvbWVzc2FnZS9MaW5rUHJldmlld3MnO1xuaW1wb3J0IHR5cGUgeyBCb2R5UmFuZ2VzVHlwZSwgU3RvcnlDb250ZXh0VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTG9nZ2luZyc7XG5pbXBvcnQgdHlwZSB7IFN0aWNrZXJXaXRoSHlkcmF0ZWREYXRhIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHR5cGUgeyBRdW90ZWRNZXNzYWdlVHlwZSB9IGZyb20gJy4uLy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25RdWV1ZUpvYkJ1bmRsZSxcbiAgTm9ybWFsTWVzc2FnZVNlbmRKb2JEYXRhLFxufSBmcm9tICcuLi9jb252ZXJzYXRpb25Kb2JRdWV1ZSc7XG5cbmltcG9ydCB7IGhhbmRsZU11bHRpcGxlU2VuZEVycm9ycyB9IGZyb20gJy4vaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzJztcbmltcG9ydCB7IG91clByb2ZpbGVLZXlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvb3VyUHJvZmlsZUtleSc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCB9IGZyb20gJy4uLy4uL3V0aWwvaXNDb252ZXJzYXRpb25VbnJlZ2lzdGVyZWQnO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25BY2NlcHRlZCB9IGZyb20gJy4uLy4uL3V0aWwvaXNDb252ZXJzYXRpb25BY2NlcHRlZCc7XG5pbXBvcnQgeyBzZW5kVG9Hcm91cCB9IGZyb20gJy4uLy4uL3V0aWwvc2VuZFRvR3JvdXAnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE5vcm1hbE1lc3NhZ2UoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwsXG4gIHtcbiAgICBpc0ZpbmFsQXR0ZW1wdCxcbiAgICBtZXNzYWdpbmcsXG4gICAgc2hvdWxkQ29udGludWUsXG4gICAgdGltZVJlbWFpbmluZyxcbiAgICBsb2csXG4gIH06IENvbnZlcnNhdGlvblF1ZXVlSm9iQnVuZGxlLFxuICBkYXRhOiBOb3JtYWxNZXNzYWdlU2VuZEpvYkRhdGFcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IE1lc3NhZ2UgfSA9IHdpbmRvdy5TaWduYWwuVHlwZXM7XG5cbiAgY29uc3QgeyBtZXNzYWdlSWQsIHJldmlzaW9uIH0gPSBkYXRhO1xuICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobWVzc2FnZUlkKTtcbiAgaWYgKCFtZXNzYWdlKSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgbWVzc2FnZSAke21lc3NhZ2VJZH0gd2FzIG5vdCBmb3VuZCwgbWF5YmUgYmVjYXVzZSBpdCB3YXMgZGVsZXRlZC4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtZXNzYWdlQ29udmVyc2F0aW9uID0gbWVzc2FnZS5nZXRDb252ZXJzYXRpb24oKTtcbiAgaWYgKG1lc3NhZ2VDb252ZXJzYXRpb24gIT09IGNvbnZlcnNhdGlvbikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBNZXNzYWdlIGNvbnZlcnNhdGlvbiAnJHttZXNzYWdlQ29udmVyc2F0aW9uPy5pZEZvckxvZ2dpbmcoKX0nIGRvZXMgbm90IG1hdGNoIGpvYiBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFpc091dGdvaW5nKG1lc3NhZ2UuYXR0cmlidXRlcykpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgbWVzc2FnZSAke21lc3NhZ2VJZH0gd2FzIG5vdCBhbiBvdXRnb2luZyBtZXNzYWdlIHRvIGJlZ2luIHdpdGguIFRoaXMgaXMgcHJvYmFibHkgYSBib2d1cyBqb2IuIEdpdmluZyB1cCBvbiBzZW5kaW5nIGl0YFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG1lc3NhZ2UuaXNFcmFzZWQoKSB8fCBtZXNzYWdlLmdldCgnZGVsZXRlZEZvckV2ZXJ5b25lJykpIHtcbiAgICBsb2cuaW5mbyhgbWVzc2FnZSAke21lc3NhZ2VJZH0gd2FzIGVyYXNlZC4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgbWVzc2FnZVNlbmRFcnJvcnM6IEFycmF5PEVycm9yPiA9IFtdO1xuXG4gIC8vIFdlIGRvbid0IHdhbnQgdG8gc2F2ZSBlcnJvcnMgb24gbWVzc2FnZXMgdW5sZXNzIHdlJ3JlIGdpdmluZyB1cC4gSWYgaXQncyBvdXJcbiAgLy8gICBmaW5hbCBhdHRlbXB0LCB3ZSBrbm93IHVwZnJvbnQgdGhhdCB3ZSB3YW50IHRvIGdpdmUgdXAuIEhvd2V2ZXIsIHdlIG1pZ2h0IGFsc29cbiAgLy8gICB3YW50IHRvIGdpdmUgdXAgaWYgKDEpIHdlIGdldCBhIDUwOCBmcm9tIHRoZSBzZXJ2ZXIsIGFza2luZyB1cyB0byBwbGVhc2Ugc3RvcFxuICAvLyAgICgyKSB3ZSBnZXQgYSA0MjggZnJvbSB0aGUgc2VydmVyLCBmbGFnZ2luZyB0aGUgbWVzc2FnZSBmb3Igc3BhbSAoMykgc29tZSBvdGhlclxuICAvLyAgIHJlYXNvbiBub3Qga25vd24gYXQgdGhlIHRpbWUgb2YgdGhpcyB3cml0aW5nLlxuICAvL1xuICAvLyBUaGlzIGF3a3dhcmQgY2FsbGJhY2sgbGV0cyB1cyBob2xkIG9udG8gZXJyb3JzIHdlIG1pZ2h0IHdhbnQgdG8gc2F2ZSwgc28gd2UgY2FuXG4gIC8vICAgZGVjaWRlIHdoZXRoZXIgdG8gc2F2ZSB0aGVtIGxhdGVyIG9uLlxuICBjb25zdCBzYXZlRXJyb3JzID0gaXNGaW5hbEF0dGVtcHRcbiAgICA/IHVuZGVmaW5lZFxuICAgIDogKGVycm9yczogQXJyYXk8RXJyb3I+KSA9PiB7XG4gICAgICAgIG1lc3NhZ2VTZW5kRXJyb3JzID0gZXJyb3JzO1xuICAgICAgfTtcblxuICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgbG9nLmluZm8oYG1lc3NhZ2UgJHttZXNzYWdlSWR9IHJhbiBvdXQgb2YgdGltZS4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgaXRgKTtcbiAgICBhd2FpdCBtYXJrTWVzc2FnZUZhaWxlZChtZXNzYWdlLCBbXG4gICAgICBuZXcgRXJyb3IoJ01lc3NhZ2Ugc2VuZCByYW4gb3V0IG9mIHRpbWUnKSxcbiAgICBdKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgcHJvZmlsZUtleTogVWludDhBcnJheSB8IHVuZGVmaW5lZDtcbiAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJykpIHtcbiAgICBwcm9maWxlS2V5ID0gYXdhaXQgb3VyUHJvZmlsZUtleVNlcnZpY2UuZ2V0KCk7XG4gIH1cblxuICBsZXQgb3JpZ2luYWxFcnJvcjogRXJyb3IgfCB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7XG4gICAgICBhbGxSZWNpcGllbnRJZGVudGlmaWVycyxcbiAgICAgIHJlY2lwaWVudElkZW50aWZpZXJzV2l0aG91dE1lLFxuICAgICAgc2VudFJlY2lwaWVudElkZW50aWZpZXJzLFxuICAgICAgdW50cnVzdGVkVXVpZHMsXG4gICAgfSA9IGdldE1lc3NhZ2VSZWNpcGllbnRzKHtcbiAgICAgIGxvZyxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBjb252ZXJzYXRpb24sXG4gICAgfSk7XG5cbiAgICBpZiAodW50cnVzdGVkVXVpZHMubGVuZ3RoKSB7XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuY29udmVyc2F0aW9uU3RvcHBlZEJ5TWlzc2luZ1ZlcmlmaWNhdGlvbihcbiAgICAgICAge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb24uaWQsXG4gICAgICAgICAgdW50cnVzdGVkVXVpZHMsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBNZXNzYWdlICR7bWVzc2FnZUlkfSBzZW5kaW5nIGJsb2NrZWQgYmVjYXVzZSAke3VudHJ1c3RlZFV1aWRzLmxlbmd0aH0gY29udmVyc2F0aW9uKHMpIHdlcmUgdW50cnVzdGVkLiBGYWlsaW5nIHRoaXMgYXR0ZW1wdC5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghYWxsUmVjaXBpZW50SWRlbnRpZmllcnMubGVuZ3RoKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHRyeWluZyB0byBzZW5kIG1lc3NhZ2UgJHttZXNzYWdlSWR9IGJ1dCBpdCBsb29rcyBsaWtlIGl0IHdhcyBhbHJlYWR5IHNlbnQgdG8gZXZlcnlvbmUuIFRoaXMgaXMgdW5leHBlY3RlZCwgYnV0IHdlJ3JlIGdpdmluZyB1cGBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBib2R5LFxuICAgICAgY29udGFjdCxcbiAgICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVRpbWVzdGFtcCxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgbWVudGlvbnMsXG4gICAgICBtZXNzYWdlVGltZXN0YW1wLFxuICAgICAgcHJldmlldyxcbiAgICAgIHF1b3RlLFxuICAgICAgc3RpY2tlcixcbiAgICAgIHN0b3J5Q29udGV4dCxcbiAgICB9ID0gYXdhaXQgZ2V0TWVzc2FnZVNlbmREYXRhKHsgbG9nLCBtZXNzYWdlIH0pO1xuXG4gICAgbGV0IG1lc3NhZ2VTZW5kUHJvbWlzZTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGUgfCB2b2lkPjtcblxuICAgIGlmIChyZWNpcGllbnRJZGVudGlmaWVyc1dpdGhvdXRNZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChcbiAgICAgICAgIWlzTWUoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICFpc0dyb3VwKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICBzZW50UmVjaXBpZW50SWRlbnRpZmllcnMubGVuZ3RoID09PSAwXG4gICAgICApIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ05vIHJlY2lwaWVudHM7IG5vdCBzZW5kaW5nIHRvIG91cnNlbHZlcyBvciB0byBncm91cCwgYW5kIG5vIHN1Y2Nlc3NmdWwgc2VuZHMuIEZhaWxpbmcgam9iLidcbiAgICAgICAgKTtcbiAgICAgICAgbWFya01lc3NhZ2VGYWlsZWQobWVzc2FnZSwgW25ldyBFcnJvcignTm8gdmFsaWQgcmVjaXBpZW50cycpXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gV2UncmUgc2VuZGluZyB0byBOb3RlIHRvIFNlbGYgb3IgYSAnbG9uZWx5IGdyb3VwJyB3aXRoIGp1c3QgdXMgaW4gaXRcbiAgICAgIGxvZy5pbmZvKCdzZW5kaW5nIHN5bmMgbWVzc2FnZSBvbmx5Jyk7XG4gICAgICBjb25zdCBkYXRhTWVzc2FnZSA9IGF3YWl0IG1lc3NhZ2luZy5nZXREYXRhTWVzc2FnZSh7XG4gICAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgICBib2R5LFxuICAgICAgICBjb250YWN0LFxuICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXAsXG4gICAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgICBncm91cFYyOiBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgICAgICAgIG1lbWJlcnM6IHJlY2lwaWVudElkZW50aWZpZXJzV2l0aG91dE1lLFxuICAgICAgICB9KSxcbiAgICAgICAgcHJldmlldyxcbiAgICAgICAgcHJvZmlsZUtleSxcbiAgICAgICAgcXVvdGUsXG4gICAgICAgIHJlY2lwaWVudHM6IGFsbFJlY2lwaWVudElkZW50aWZpZXJzLFxuICAgICAgICBzdGlja2VyLFxuICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICAgIG1lc3NhZ2VTZW5kUHJvbWlzZSA9IG1lc3NhZ2Uuc2VuZFN5bmNNZXNzYWdlT25seShkYXRhTWVzc2FnZSwgc2F2ZUVycm9ycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvblR5cGUgPSBjb252ZXJzYXRpb24uZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICAgIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcblxuICAgICAgbGV0IGlubmVyUHJvbWlzZTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+O1xuICAgICAgaWYgKGNvbnZlcnNhdGlvblR5cGUgPT09IE1lc3NhZ2UuR1JPVVApIHtcbiAgICAgICAgLy8gTm90ZTogdGhpcyB3aWxsIGhhcHBlbiBmb3IgYWxsIG9sZCBqb2JzIHF1ZXVlZCBiZW9yZSA1LjMyLnhcbiAgICAgICAgaWYgKGlzR3JvdXBWMihjb252ZXJzYXRpb24uYXR0cmlidXRlcykgJiYgIWlzTnVtYmVyKHJldmlzaW9uKSkge1xuICAgICAgICAgIGxvZy5lcnJvcignTm8gcmV2aXNpb24gcHJvdmlkZWQsIGJ1dCBjb252ZXJzYXRpb24gaXMgR3JvdXBWMicpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ3JvdXBWMkluZm8gPSBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgICAgICAgIG1lbWJlcnM6IHJlY2lwaWVudElkZW50aWZpZXJzV2l0aG91dE1lLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGdyb3VwVjJJbmZvICYmIGlzTnVtYmVyKHJldmlzaW9uKSkge1xuICAgICAgICAgIGdyb3VwVjJJbmZvLnJldmlzaW9uID0gcmV2aXNpb247XG4gICAgICAgIH1cblxuICAgICAgICBsb2cuaW5mbygnc2VuZGluZyBncm91cCBtZXNzYWdlJyk7XG4gICAgICAgIGlubmVyUHJvbWlzZSA9IGNvbnZlcnNhdGlvbi5xdWV1ZUpvYihcbiAgICAgICAgICAnY29udmVyc2F0aW9uUXVldWUvc2VuZE5vcm1hbE1lc3NhZ2UnLFxuICAgICAgICAgIGFib3J0U2lnbmFsID0+XG4gICAgICAgICAgICBzZW5kVG9Hcm91cCh7XG4gICAgICAgICAgICAgIGFib3J0U2lnbmFsLFxuICAgICAgICAgICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgICAgICAgICAgZ3JvdXBTZW5kT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgICAgICAgICAgIGNvbnRhY3QsXG4gICAgICAgICAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wLFxuICAgICAgICAgICAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgICAgICAgICAgIGdyb3VwVjE6IGNvbnZlcnNhdGlvbi5nZXRHcm91cFYxSW5mbyhcbiAgICAgICAgICAgICAgICAgIHJlY2lwaWVudElkZW50aWZpZXJzV2l0aG91dE1lXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBncm91cFYyOiBncm91cFYySW5mbyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGV4dDogYm9keSxcbiAgICAgICAgICAgICAgICBwcmV2aWV3LFxuICAgICAgICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgICAgICAgcXVvdGUsXG4gICAgICAgICAgICAgICAgc3RpY2tlcixcbiAgICAgICAgICAgICAgICBzdG9yeUNvbnRleHQsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlVGltZXN0YW1wLFxuICAgICAgICAgICAgICAgIG1lbnRpb25zLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgIHNlbmRPcHRpb25zLFxuICAgICAgICAgICAgICBzZW5kVGFyZ2V0OiBjb252ZXJzYXRpb24udG9TZW5kZXJLZXlUYXJnZXQoKSxcbiAgICAgICAgICAgICAgc2VuZFR5cGU6ICdtZXNzYWdlJyxcbiAgICAgICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNDb252ZXJzYXRpb25BY2NlcHRlZChjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgIGBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGlzIG5vdCBhY2NlcHRlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICAgICApO1xuICAgICAgICAgIG1hcmtNZXNzYWdlRmFpbGVkKG1lc3NhZ2UsIFtcbiAgICAgICAgICAgIG5ldyBFcnJvcignTWVzc2FnZSByZXF1ZXN0IHdhcyBub3QgYWNjZXB0ZWQnKSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgdW5yZWdpc3RlcmVkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgICAgICk7XG4gICAgICAgICAgbWFya01lc3NhZ2VGYWlsZWQobWVzc2FnZSwgW1xuICAgICAgICAgICAgbmV3IEVycm9yKCdDb250YWN0IG5vIGxvbmdlciBoYXMgYSBTaWduYWwgYWNjb3VudCcpLFxuICAgICAgICAgIF0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udmVyc2F0aW9uLmlzQmxvY2tlZCgpKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICBgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfSBpcyBibG9ja2VkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgICAgICk7XG4gICAgICAgICAgbWFya01lc3NhZ2VGYWlsZWQobWVzc2FnZSwgW25ldyBFcnJvcignQ29udGFjdCBpcyBibG9ja2VkJyldKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsb2cuaW5mbygnc2VuZGluZyBkaXJlY3QgbWVzc2FnZScpO1xuICAgICAgICBpbm5lclByb21pc2UgPSBtZXNzYWdpbmcuc2VuZE1lc3NhZ2VUb0lkZW50aWZpZXIoe1xuICAgICAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgICAgIGNvbnRhY3QsXG4gICAgICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wLFxuICAgICAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgICAgIGdyb3VwSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBpZGVudGlmaWVyOiByZWNpcGllbnRJZGVudGlmaWVyc1dpdGhvdXRNZVswXSxcbiAgICAgICAgICBtZXNzYWdlVGV4dDogYm9keSxcbiAgICAgICAgICBvcHRpb25zOiBzZW5kT3B0aW9ucyxcbiAgICAgICAgICBwcmV2aWV3LFxuICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgcXVvdGUsXG4gICAgICAgICAgcmVhY3Rpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICBzdGlja2VyLFxuICAgICAgICAgIHN0b3J5Q29udGV4dCxcbiAgICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgbWVzc2FnZVNlbmRQcm9taXNlID0gbWVzc2FnZS5zZW5kKFxuICAgICAgICBoYW5kbGVNZXNzYWdlU2VuZChpbm5lclByb21pc2UsIHtcbiAgICAgICAgICBtZXNzYWdlSWRzOiBbbWVzc2FnZUlkXSxcbiAgICAgICAgICBzZW5kVHlwZTogJ21lc3NhZ2UnLFxuICAgICAgICB9KSxcbiAgICAgICAgc2F2ZUVycm9yc1xuICAgICAgKTtcblxuICAgICAgLy8gQmVjYXVzZSBtZXNzYWdlLnNlbmQgc3dhbGxvd3MgYW5kIHByb2Nlc3NlcyBlcnJvcnMsIHdlJ2xsIGF3YWl0IHRoZSBpbm5lciBwcm9taXNlXG4gICAgICAvLyAgIHRvIGdldCB0aGUgU2VuZE1lc3NhZ2VQcm90b0Vycm9yLCB3aGljaCBnaXZlcyB1cyBpbmZvcm1hdGlvbiB1cHN0cmVhbVxuICAgICAgLy8gICBwcm9jZXNzb3JzIG5lZWQgdG8gZGV0ZWN0IGNlcnRhaW4ga2luZHMgb2Ygc2l0dWF0aW9ucy5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGlubmVyUHJvbWlzZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvciA9IGVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgIGBwcm9taXNlRm9yRXJyb3IgdGhyZXcgc29tZXRoaW5nIG90aGVyIHRoYW4gYW4gZXJyb3I6ICR7RXJyb3JzLnRvTG9nRm9ybWF0KFxuICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgKX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IG1lc3NhZ2VTZW5kUHJvbWlzZTtcblxuICAgIGNvbnN0IGRpZEZ1bGx5U2VuZCA9XG4gICAgICAhbWVzc2FnZVNlbmRFcnJvcnMubGVuZ3RoIHx8IGRpZFNlbmRUb0V2ZXJ5b25lKG1lc3NhZ2UpO1xuICAgIGlmICghZGlkRnVsbHlTZW5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2UgZGlkIG5vdCBmdWxseSBzZW5kJyk7XG4gICAgfVxuICB9IGNhdGNoICh0aHJvd25FcnJvcjogdW5rbm93bikge1xuICAgIGNvbnN0IGVycm9ycyA9IFt0aHJvd25FcnJvciwgLi4ubWVzc2FnZVNlbmRFcnJvcnNdO1xuICAgIGF3YWl0IGhhbmRsZU11bHRpcGxlU2VuZEVycm9ycyh7XG4gICAgICBlcnJvcnMsXG4gICAgICBpc0ZpbmFsQXR0ZW1wdCxcbiAgICAgIGxvZyxcbiAgICAgIG1hcmtGYWlsZWQ6ICgpID0+IG1hcmtNZXNzYWdlRmFpbGVkKG1lc3NhZ2UsIG1lc3NhZ2VTZW5kRXJyb3JzKSxcbiAgICAgIHRpbWVSZW1haW5pbmcsXG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhIGZhaWxlZCBncm91cCBzZW5kIHRocm93bkVycm9yIHdpbGwgbm90IGJlIFNlbnRNZXNzYWdlUHJvdG9FcnJvcixcbiAgICAgIC8vICAgYnV0IHdlIHNob3VsZCBoYXZlIGJlZW4gYWJsZSB0byBoYXJ2ZXN0IHRoZSBvcmlnaW5hbCBlcnJvci4gSW4gdGhlIE5vdGUgdG8gU2VsZlxuICAgICAgLy8gICBzZW5kIGNhc2UsIHRocm93bkVycm9yIHdpbGwgYmUgdGhlIGVycm9yIHdlIGNhcmUgYWJvdXQsIGFuZCB3ZSB3b24ndCBoYXZlIGFuXG4gICAgICAvLyAgIG9yaWdpbmFsRXJyb3IuXG4gICAgICB0b1Rocm93OiBvcmlnaW5hbEVycm9yIHx8IHRocm93bkVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2VSZWNpcGllbnRzKHtcbiAgbG9nLFxuICBjb252ZXJzYXRpb24sXG4gIG1lc3NhZ2UsXG59OiBSZWFkb25seTx7XG4gIGxvZzogTG9nZ2VyVHlwZTtcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbDtcbiAgbWVzc2FnZTogTWVzc2FnZU1vZGVsO1xufT4pOiB7XG4gIGFsbFJlY2lwaWVudElkZW50aWZpZXJzOiBBcnJheTxzdHJpbmc+O1xuICByZWNpcGllbnRJZGVudGlmaWVyc1dpdGhvdXRNZTogQXJyYXk8c3RyaW5nPjtcbiAgc2VudFJlY2lwaWVudElkZW50aWZpZXJzOiBBcnJheTxzdHJpbmc+O1xuICB1bnRydXN0ZWRVdWlkczogQXJyYXk8c3RyaW5nPjtcbn0ge1xuICBjb25zdCBhbGxSZWNpcGllbnRJZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCByZWNpcGllbnRJZGVudGlmaWVyc1dpdGhvdXRNZTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCB1bnRydXN0ZWRVdWlkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCBzZW50UmVjaXBpZW50SWRlbnRpZmllcnM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBjb25zdCBjdXJyZW50Q29udmVyc2F0aW9uUmVjaXBpZW50cyA9IGNvbnZlcnNhdGlvbi5nZXRNZW1iZXJDb252ZXJzYXRpb25JZHMoKTtcblxuICBPYmplY3QuZW50cmllcyhtZXNzYWdlLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9KS5mb3JFYWNoKFxuICAgIChbcmVjaXBpZW50Q29udmVyc2F0aW9uSWQsIHNlbmRTdGF0ZV0pID0+IHtcbiAgICAgIGNvbnN0IHJlY2lwaWVudCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChcbiAgICAgICAgcmVjaXBpZW50Q29udmVyc2F0aW9uSWRcbiAgICAgICk7XG4gICAgICBpZiAoIXJlY2lwaWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzUmVjaXBpZW50TWUgPSBpc01lKHJlY2lwaWVudC5hdHRyaWJ1dGVzKTtcblxuICAgICAgaWYgKFxuICAgICAgICAhY3VycmVudENvbnZlcnNhdGlvblJlY2lwaWVudHMuaGFzKHJlY2lwaWVudENvbnZlcnNhdGlvbklkKSAmJlxuICAgICAgICAhaXNSZWNpcGllbnRNZVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY2lwaWVudC5pc1VudHJ1c3RlZCgpKSB7XG4gICAgICAgIGNvbnN0IHV1aWQgPSByZWNpcGllbnQuZ2V0KCd1dWlkJyk7XG4gICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgIGBzZW5kTm9ybWFsTWVzc2FnZS9nZXRNZXNzYWdlUmVjaXBpZW50czogVW50cnVzdGVkIGNvbnZlcnNhdGlvbiAke3JlY2lwaWVudC5pZEZvckxvZ2dpbmcoKX0gbWlzc2luZyBVVUlELmBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1bnRydXN0ZWRVdWlkcy5wdXNoKHV1aWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocmVjaXBpZW50LmlzVW5yZWdpc3RlcmVkKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWNpcGllbnRJZGVudGlmaWVyID0gcmVjaXBpZW50LmdldFNlbmRUYXJnZXQoKTtcbiAgICAgIGlmICghcmVjaXBpZW50SWRlbnRpZmllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1NlbnQoc2VuZFN0YXRlLnN0YXR1cykpIHtcbiAgICAgICAgc2VudFJlY2lwaWVudElkZW50aWZpZXJzLnB1c2gocmVjaXBpZW50SWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYWxsUmVjaXBpZW50SWRlbnRpZmllcnMucHVzaChyZWNpcGllbnRJZGVudGlmaWVyKTtcbiAgICAgIGlmICghaXNSZWNpcGllbnRNZSkge1xuICAgICAgICByZWNpcGllbnRJZGVudGlmaWVyc1dpdGhvdXRNZS5wdXNoKHJlY2lwaWVudElkZW50aWZpZXIpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGFsbFJlY2lwaWVudElkZW50aWZpZXJzLFxuICAgIHJlY2lwaWVudElkZW50aWZpZXJzV2l0aG91dE1lLFxuICAgIHNlbnRSZWNpcGllbnRJZGVudGlmaWVycyxcbiAgICB1bnRydXN0ZWRVdWlkcyxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZVNlbmREYXRhKHtcbiAgbG9nLFxuICBtZXNzYWdlLFxufTogUmVhZG9ubHk8e1xuICBsb2c6IExvZ2dlclR5cGU7XG4gIG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbDtcbn0+KTogUHJvbWlzZTx7XG4gIGF0dGFjaG1lbnRzOiBBcnJheTxBdHRhY2htZW50VHlwZT47XG4gIGJvZHk6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgY29udGFjdD86IEFycmF5PENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXI+O1xuICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA6IHVuZGVmaW5lZCB8IG51bWJlcjtcbiAgZXhwaXJlVGltZXI6IHVuZGVmaW5lZCB8IG51bWJlcjtcbiAgbWVudGlvbnM6IHVuZGVmaW5lZCB8IEJvZHlSYW5nZXNUeXBlO1xuICBtZXNzYWdlVGltZXN0YW1wOiBudW1iZXI7XG4gIHByZXZpZXc6IEFycmF5PExpbmtQcmV2aWV3VHlwZT47XG4gIHF1b3RlOiBRdW90ZWRNZXNzYWdlVHlwZSB8IG51bGw7XG4gIHN0aWNrZXI6IFN0aWNrZXJXaXRoSHlkcmF0ZWREYXRhIHwgdW5kZWZpbmVkO1xuICBzdG9yeUNvbnRleHQ/OiBTdG9yeUNvbnRleHRUeXBlO1xufT4ge1xuICBjb25zdCB7XG4gICAgbG9hZEF0dGFjaG1lbnREYXRhLFxuICAgIGxvYWRDb250YWN0RGF0YSxcbiAgICBsb2FkUHJldmlld0RhdGEsXG4gICAgbG9hZFF1b3RlRGF0YSxcbiAgICBsb2FkU3RpY2tlckRhdGEsXG4gIH0gPSB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnM7XG5cbiAgbGV0IG1lc3NhZ2VUaW1lc3RhbXA6IG51bWJlcjtcbiAgY29uc3Qgc2VudEF0ID0gbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKTtcbiAgY29uc3QgdGltZXN0YW1wID0gbWVzc2FnZS5nZXQoJ3RpbWVzdGFtcCcpO1xuICBpZiAoc2VudEF0KSB7XG4gICAgbWVzc2FnZVRpbWVzdGFtcCA9IHNlbnRBdDtcbiAgfSBlbHNlIGlmICh0aW1lc3RhbXApIHtcbiAgICBsb2cuZXJyb3IoJ21lc3NhZ2UgbGFja2VkIHNlbnRfYXQuIEZhbGxpbmcgYmFjayB0byB0aW1lc3RhbXAnKTtcbiAgICBtZXNzYWdlVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICB9IGVsc2Uge1xuICAgIGxvZy5lcnJvcihcbiAgICAgICdtZXNzYWdlIGxhY2tlZCBzZW50X2F0IGFuZCB0aW1lc3RhbXAuIEZhbGxpbmcgYmFjayB0byBjdXJyZW50IHRpbWUnXG4gICAgKTtcbiAgICBtZXNzYWdlVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIGNvbnN0IHN0b3J5SWQgPSBtZXNzYWdlLmdldCgnc3RvcnlJZCcpO1xuXG4gIGNvbnN0IFthdHRhY2htZW50c1dpdGhEYXRhLCBjb250YWN0LCBwcmV2aWV3LCBxdW90ZSwgc3RpY2tlciwgc3RvcnlNZXNzYWdlXSA9XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgLy8gV2UgZG9uJ3QgdXBkYXRlIHRoZSBjYWNoZXMgaGVyZSBiZWNhdXNlICgxKSB3ZSBleHBlY3QgdGhlIGNhY2hlcyB0byBiZSBwb3B1bGF0ZWRcbiAgICAgIC8vICAgb24gaW5pdGlhbCBzZW5kLCBzbyB0aGV5IHNob3VsZCBiZSB0aGVyZSBpbiB0aGUgOTklIGNhc2UgKDIpIGlmIHlvdSdyZSByZXRyeWluZ1xuICAgICAgLy8gICBhIGZhaWxlZCBtZXNzYWdlIGFjcm9zcyByZXN0YXJ0cywgd2UgZG9uJ3QgdG91Y2ggdGhlIGNhY2hlIGZvciBzaW1wbGljaXR5LiBJZlxuICAgICAgLy8gICBzZW5kcyBhcmUgZmFpbGluZywgbGV0J3Mgbm90IGFkZCB0aGUgY29tcGxpY2F0aW9uIG9mIGEgY2FjaGUuXG4gICAgICBQcm9taXNlLmFsbCgobWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJykgPz8gW10pLm1hcChsb2FkQXR0YWNobWVudERhdGEpKSxcbiAgICAgIG1lc3NhZ2UuY2FjaGVkT3V0Z29pbmdDb250YWN0RGF0YSB8fFxuICAgICAgICBsb2FkQ29udGFjdERhdGEobWVzc2FnZS5nZXQoJ2NvbnRhY3QnKSksXG4gICAgICBtZXNzYWdlLmNhY2hlZE91dGdvaW5nUHJldmlld0RhdGEgfHxcbiAgICAgICAgbG9hZFByZXZpZXdEYXRhKG1lc3NhZ2UuZ2V0KCdwcmV2aWV3JykpLFxuICAgICAgbWVzc2FnZS5jYWNoZWRPdXRnb2luZ1F1b3RlRGF0YSB8fCBsb2FkUXVvdGVEYXRhKG1lc3NhZ2UuZ2V0KCdxdW90ZScpKSxcbiAgICAgIG1lc3NhZ2UuY2FjaGVkT3V0Z29pbmdTdGlja2VyRGF0YSB8fFxuICAgICAgICBsb2FkU3RpY2tlckRhdGEobWVzc2FnZS5nZXQoJ3N0aWNrZXInKSksXG4gICAgICBzdG9yeUlkID8gZ2V0TWVzc2FnZUJ5SWQoc3RvcnlJZCkgOiB1bmRlZmluZWQsXG4gICAgXSk7XG5cbiAgY29uc3QgeyBib2R5LCBhdHRhY2htZW50cyB9ID0gd2luZG93LldoaXNwZXIuTWVzc2FnZS5nZXRMb25nTWVzc2FnZUF0dGFjaG1lbnQoXG4gICAge1xuICAgICAgYm9keTogbWVzc2FnZS5nZXQoJ2JvZHknKSxcbiAgICAgIGF0dGFjaG1lbnRzOiBhdHRhY2htZW50c1dpdGhEYXRhLFxuICAgICAgbm93OiBtZXNzYWdlVGltZXN0YW1wLFxuICAgIH1cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGF0dGFjaG1lbnRzLFxuICAgIGJvZHksXG4gICAgY29udGFjdCxcbiAgICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA6IG1lc3NhZ2UuZ2V0KCdkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXAnKSxcbiAgICBleHBpcmVUaW1lcjogbWVzc2FnZS5nZXQoJ2V4cGlyZVRpbWVyJyksXG4gICAgbWVudGlvbnM6IG1lc3NhZ2UuZ2V0KCdib2R5UmFuZ2VzJyksXG4gICAgbWVzc2FnZVRpbWVzdGFtcCxcbiAgICBwcmV2aWV3LFxuICAgIHF1b3RlLFxuICAgIHN0aWNrZXIsXG4gICAgc3RvcnlDb250ZXh0OiBzdG9yeU1lc3NhZ2VcbiAgICAgID8ge1xuICAgICAgICAgIGF1dGhvclV1aWQ6IHN0b3J5TWVzc2FnZS5nZXQoJ3NvdXJjZVV1aWQnKSxcbiAgICAgICAgICB0aW1lc3RhbXA6IHN0b3J5TWVzc2FnZS5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtNZXNzYWdlRmFpbGVkKFxuICBtZXNzYWdlOiBNZXNzYWdlTW9kZWwsXG4gIGVycm9yczogQXJyYXk8RXJyb3I+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgbWVzc2FnZS5tYXJrRmFpbGVkKCk7XG4gIG1lc3NhZ2Uuc2F2ZUVycm9ycyhlcnJvcnMsIHsgc2tpcFNhdmU6IHRydWUgfSk7XG4gIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlkU2VuZFRvRXZlcnlvbmUobWVzc2FnZTogUmVhZG9ubHk8TWVzc2FnZU1vZGVsPik6IGJvb2xlYW4ge1xuICBjb25zdCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID1cbiAgICBtZXNzYWdlLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9O1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKS5ldmVyeShzZW5kU3RhdGUgPT5cbiAgICBpc1NlbnQoc2VuZFN0YXRlLnN0YXR1cylcbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBeUI7QUFFekIsYUFBd0I7QUFFeEIsNEJBQStCO0FBRS9CLG9DQUF5QztBQUN6Qyw0QkFBK0I7QUFDL0Isc0JBQXVDO0FBQ3ZDLCtCQUFrQztBQUVsQyw4QkFBdUI7QUFDdkIscUJBQTJCO0FBZTNCLHNDQUF5QztBQUN6QywyQkFBcUM7QUFDckMsd0NBQTJDO0FBQzNDLG9DQUF1QztBQUN2Qyx5QkFBNEI7QUFFNUIsaUNBQ0UsY0FDQTtBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FFRixNQUNlO0FBQ2YsUUFBTSxFQUFFLFlBQVksT0FBTyxPQUFPO0FBRWxDLFFBQU0sRUFBRSxXQUFXLGFBQWE7QUFDaEMsUUFBTSxVQUFVLE1BQU0sMENBQWUsU0FBUztBQUM5QyxNQUFJLENBQUMsU0FBUztBQUNaLFFBQUksS0FDRixXQUFXLGdGQUNiO0FBQ0E7QUFBQSxFQUNGO0FBRUEsUUFBTSxzQkFBc0IsUUFBUSxnQkFBZ0I7QUFDcEQsTUFBSSx3QkFBd0IsY0FBYztBQUN4QyxRQUFJLE1BQ0YseUJBQXlCLHFCQUFxQixhQUFhLHNDQUFzQyxhQUFhLGFBQWEsR0FDN0g7QUFDQTtBQUFBLEVBQ0Y7QUFFQSxNQUFJLENBQUMsK0JBQVcsUUFBUSxVQUFVLEdBQUc7QUFDbkMsUUFBSSxNQUNGLFdBQVcsNEdBQ2I7QUFDQTtBQUFBLEVBQ0Y7QUFFQSxNQUFJLFFBQVEsU0FBUyxLQUFLLFFBQVEsSUFBSSxvQkFBb0IsR0FBRztBQUMzRCxRQUFJLEtBQUssV0FBVywrQ0FBK0M7QUFDbkU7QUFBQSxFQUNGO0FBRUEsTUFBSSxvQkFBa0MsQ0FBQztBQVV2QyxRQUFNLGFBQWEsaUJBQ2YsU0FDQSxDQUFDLFdBQXlCO0FBQ3hCLHdCQUFvQjtBQUFBLEVBQ3RCO0FBRUosTUFBSSxDQUFDLGdCQUFnQjtBQUNuQixRQUFJLEtBQUssV0FBVyxvREFBb0Q7QUFDeEUsVUFBTSxrQkFBa0IsU0FBUztBQUFBLE1BQy9CLElBQUksTUFBTSw4QkFBOEI7QUFBQSxJQUMxQyxDQUFDO0FBQ0Q7QUFBQSxFQUNGO0FBRUEsTUFBSTtBQUNKLE1BQUksYUFBYSxJQUFJLGdCQUFnQixHQUFHO0FBQ3RDLGlCQUFhLE1BQU0sMENBQXFCLElBQUk7QUFBQSxFQUM5QztBQUVBLE1BQUk7QUFFSixNQUFJO0FBQ0YsVUFBTTtBQUFBLE1BQ0o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNFLHFCQUFxQjtBQUFBLE1BQ3ZCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFFRCxRQUFJLGVBQWUsUUFBUTtBQUN6QixhQUFPLGFBQWEsY0FBYyx5Q0FDaEM7QUFBQSxRQUNFLGdCQUFnQixhQUFhO0FBQUEsUUFDN0I7QUFBQSxNQUNGLENBQ0Y7QUFDQSxZQUFNLElBQUksTUFDUixXQUFXLHFDQUFxQyxlQUFlLDhEQUNqRTtBQUFBLElBQ0Y7QUFFQSxRQUFJLENBQUMsd0JBQXdCLFFBQVE7QUFDbkMsVUFBSSxLQUNGLDBCQUEwQixzR0FDNUI7QUFDQTtBQUFBLElBQ0Y7QUFFQSxVQUFNO0FBQUEsTUFDSjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU0sbUJBQW1CLEVBQUUsS0FBSyxRQUFRLENBQUM7QUFFN0MsUUFBSTtBQUVKLFFBQUksOEJBQThCLFdBQVcsR0FBRztBQUM5QyxVQUNFLENBQUMsd0NBQUssYUFBYSxVQUFVLEtBQzdCLENBQUMsMkNBQVEsYUFBYSxVQUFVLEtBQ2hDLHlCQUF5QixXQUFXLEdBQ3BDO0FBQ0EsWUFBSSxLQUNGLDRGQUNGO0FBQ0EsMEJBQWtCLFNBQVMsQ0FBQyxJQUFJLE1BQU0scUJBQXFCLENBQUMsQ0FBQztBQUM3RDtBQUFBLE1BQ0Y7QUFHQSxVQUFJLEtBQUssMkJBQTJCO0FBQ3BDLFlBQU0sY0FBYyxNQUFNLFVBQVUsZUFBZTtBQUFBLFFBQ2pEO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsU0FBUyxhQUFhLGVBQWU7QUFBQSxVQUNuQyxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsUUFDRDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZO0FBQUEsUUFDWjtBQUFBLFFBQ0EsV0FBVztBQUFBLE1BQ2IsQ0FBQztBQUNELDJCQUFxQixRQUFRLG9CQUFvQixhQUFhLFVBQVU7QUFBQSxJQUMxRSxPQUFPO0FBQ0wsWUFBTSxtQkFBbUIsYUFBYSxJQUFJLE1BQU07QUFDaEQsWUFBTSxjQUFjLE1BQU0sMENBQWUsYUFBYSxVQUFVO0FBQ2hFLFlBQU0sRUFBRSxnQkFBZ0IsOEJBQU0sMEJBQTBCO0FBRXhELFVBQUk7QUFDSixVQUFJLHFCQUFxQixRQUFRLE9BQU87QUFFdEMsWUFBSSw2Q0FBVSxhQUFhLFVBQVUsS0FBSyxDQUFDLDRCQUFTLFFBQVEsR0FBRztBQUM3RCxjQUFJLE1BQU0sbURBQW1EO0FBQUEsUUFDL0Q7QUFFQSxjQUFNLGNBQWMsYUFBYSxlQUFlO0FBQUEsVUFDOUMsU0FBUztBQUFBLFFBQ1gsQ0FBQztBQUNELFlBQUksZUFBZSw0QkFBUyxRQUFRLEdBQUc7QUFDckMsc0JBQVksV0FBVztBQUFBLFFBQ3pCO0FBRUEsWUFBSSxLQUFLLHVCQUF1QjtBQUNoQyx1QkFBZSxhQUFhLFNBQzFCLHVDQUNBLGlCQUNFLG9DQUFZO0FBQUEsVUFDVjtBQUFBLFVBQ0EsYUFBYSxZQUFZO0FBQUEsVUFDekIsa0JBQWtCO0FBQUEsWUFDaEI7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVMsYUFBYSxlQUNwQiw2QkFDRjtBQUFBLFlBQ0EsU0FBUztBQUFBLFlBQ1QsYUFBYTtBQUFBLFlBQ2I7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQSxXQUFXO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0EsWUFBWSxhQUFhLGtCQUFrQjtBQUFBLFVBQzNDLFVBQVU7QUFBQSxVQUNWLFFBQVE7QUFBQSxRQUNWLENBQUMsQ0FDTDtBQUFBLE1BQ0YsT0FBTztBQUNMLFlBQUksQ0FBQywwREFBdUIsYUFBYSxVQUFVLEdBQUc7QUFDcEQsY0FBSSxLQUNGLGdCQUFnQixhQUFhLGFBQWEscUNBQzVDO0FBQ0EsNEJBQWtCLFNBQVM7QUFBQSxZQUN6QixJQUFJLE1BQU0sa0NBQWtDO0FBQUEsVUFDOUMsQ0FBQztBQUNEO0FBQUEsUUFDRjtBQUNBLFlBQUksa0VBQTJCLGFBQWEsVUFBVSxHQUFHO0FBQ3ZELGNBQUksS0FDRixnQkFBZ0IsYUFBYSxhQUFhLHFDQUM1QztBQUNBLDRCQUFrQixTQUFTO0FBQUEsWUFDekIsSUFBSSxNQUFNLHdDQUF3QztBQUFBLFVBQ3BELENBQUM7QUFDRDtBQUFBLFFBQ0Y7QUFDQSxZQUFJLGFBQWEsVUFBVSxHQUFHO0FBQzVCLGNBQUksS0FDRixnQkFBZ0IsYUFBYSxhQUFhLGdDQUM1QztBQUNBLDRCQUFrQixTQUFTLENBQUMsSUFBSSxNQUFNLG9CQUFvQixDQUFDLENBQUM7QUFDNUQ7QUFBQSxRQUNGO0FBRUEsWUFBSSxLQUFLLHdCQUF3QjtBQUNqQyx1QkFBZSxVQUFVLHdCQUF3QjtBQUFBLFVBQy9DO0FBQUEsVUFDQTtBQUFBLFVBQ0EsYUFBYSxZQUFZO0FBQUEsVUFDekI7QUFBQSxVQUNBO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxZQUFZLDhCQUE4QjtBQUFBLFVBQzFDLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLFVBQVU7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFVBQ0EsV0FBVztBQUFBLFVBQ1gsUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFFQSwyQkFBcUIsUUFBUSxLQUMzQixnREFBa0IsY0FBYztBQUFBLFFBQzlCLFlBQVksQ0FBQyxTQUFTO0FBQUEsUUFDdEIsVUFBVTtBQUFBLE1BQ1osQ0FBQyxHQUNELFVBQ0Y7QUFLQSxVQUFJO0FBQ0YsY0FBTTtBQUFBLE1BQ1IsU0FBUyxPQUFQO0FBQ0EsWUFBSSxpQkFBaUIsT0FBTztBQUMxQiwwQkFBZ0I7QUFBQSxRQUNsQixPQUFPO0FBQ0wsY0FBSSxNQUNGLHdEQUF3RCxPQUFPLFlBQzdELEtBQ0YsR0FDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLFVBQU07QUFFTixVQUFNLGVBQ0osQ0FBQyxrQkFBa0IsVUFBVSxrQkFBa0IsT0FBTztBQUN4RCxRQUFJLENBQUMsY0FBYztBQUNqQixZQUFNLElBQUksTUFBTSw0QkFBNEI7QUFBQSxJQUM5QztBQUFBLEVBQ0YsU0FBUyxhQUFQO0FBQ0EsVUFBTSxTQUFTLENBQUMsYUFBYSxHQUFHLGlCQUFpQjtBQUNqRCxVQUFNLDhEQUF5QjtBQUFBLE1BQzdCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFlBQVksTUFBTSxrQkFBa0IsU0FBUyxpQkFBaUI7QUFBQSxNQUM5RDtBQUFBLE1BS0EsU0FBUyxpQkFBaUI7QUFBQSxJQUM1QixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBNVNzQixBQThTdEIsOEJBQThCO0FBQUEsRUFDNUI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBVUE7QUFDQSxRQUFNLDBCQUF5QyxDQUFDO0FBQ2hELFFBQU0sZ0NBQStDLENBQUM7QUFDdEQsUUFBTSxpQkFBZ0MsQ0FBQztBQUN2QyxRQUFNLDJCQUEwQyxDQUFDO0FBRWpELFFBQU0sZ0NBQWdDLGFBQWEseUJBQXlCO0FBRTVFLFNBQU8sUUFBUSxRQUFRLElBQUksMkJBQTJCLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFDN0QsQ0FBQyxDQUFDLHlCQUF5QixlQUFlO0FBQ3hDLFVBQU0sWUFBWSxPQUFPLHVCQUF1QixJQUM5Qyx1QkFDRjtBQUNBLFFBQUksQ0FBQyxXQUFXO0FBQ2Q7QUFBQSxJQUNGO0FBRUEsVUFBTSxnQkFBZ0Isd0NBQUssVUFBVSxVQUFVO0FBRS9DLFFBQ0UsQ0FBQyw4QkFBOEIsSUFBSSx1QkFBdUIsS0FDMUQsQ0FBQyxlQUNEO0FBQ0E7QUFBQSxJQUNGO0FBRUEsUUFBSSxVQUFVLFlBQVksR0FBRztBQUMzQixZQUFNLE9BQU8sVUFBVSxJQUFJLE1BQU07QUFDakMsVUFBSSxDQUFDLE1BQU07QUFDVCxZQUFJLE1BQ0Ysa0VBQWtFLFVBQVUsYUFBYSxpQkFDM0Y7QUFDQTtBQUFBLE1BQ0Y7QUFDQSxxQkFBZSxLQUFLLElBQUk7QUFDeEI7QUFBQSxJQUNGO0FBQ0EsUUFBSSxVQUFVLGVBQWUsR0FBRztBQUM5QjtBQUFBLElBQ0Y7QUFFQSxVQUFNLHNCQUFzQixVQUFVLGNBQWM7QUFDcEQsUUFBSSxDQUFDLHFCQUFxQjtBQUN4QjtBQUFBLElBQ0Y7QUFFQSxRQUFJLG9DQUFPLFVBQVUsTUFBTSxHQUFHO0FBQzVCLCtCQUF5QixLQUFLLG1CQUFtQjtBQUNqRDtBQUFBLElBQ0Y7QUFFQSw0QkFBd0IsS0FBSyxtQkFBbUI7QUFDaEQsUUFBSSxDQUFDLGVBQWU7QUFDbEIsb0NBQThCLEtBQUssbUJBQW1CO0FBQUEsSUFDeEQ7QUFBQSxFQUNGLENBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQTdFUyxBQStFVCxrQ0FBa0M7QUFBQSxFQUNoQztBQUFBLEVBQ0E7QUFBQSxHQWdCQztBQUNELFFBQU07QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLE1BQ0UsT0FBTyxPQUFPO0FBRWxCLE1BQUk7QUFDSixRQUFNLFNBQVMsUUFBUSxJQUFJLFNBQVM7QUFDcEMsUUFBTSxZQUFZLFFBQVEsSUFBSSxXQUFXO0FBQ3pDLE1BQUksUUFBUTtBQUNWLHVCQUFtQjtBQUFBLEVBQ3JCLFdBQVcsV0FBVztBQUNwQixRQUFJLE1BQU0sbURBQW1EO0FBQzdELHVCQUFtQjtBQUFBLEVBQ3JCLE9BQU87QUFDTCxRQUFJLE1BQ0Ysb0VBQ0Y7QUFDQSx1QkFBbUIsS0FBSyxJQUFJO0FBQUEsRUFDOUI7QUFFQSxRQUFNLFVBQVUsUUFBUSxJQUFJLFNBQVM7QUFFckMsUUFBTSxDQUFDLHFCQUFxQixTQUFTLFNBQVMsT0FBTyxTQUFTLGdCQUM1RCxNQUFNLFFBQVEsSUFBSTtBQUFBLElBS2hCLFFBQVEsSUFBSyxTQUFRLElBQUksYUFBYSxLQUFLLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDO0FBQUEsSUFDdEUsUUFBUSw2QkFDTixnQkFBZ0IsUUFBUSxJQUFJLFNBQVMsQ0FBQztBQUFBLElBQ3hDLFFBQVEsNkJBQ04sZ0JBQWdCLFFBQVEsSUFBSSxTQUFTLENBQUM7QUFBQSxJQUN4QyxRQUFRLDJCQUEyQixjQUFjLFFBQVEsSUFBSSxPQUFPLENBQUM7QUFBQSxJQUNyRSxRQUFRLDZCQUNOLGdCQUFnQixRQUFRLElBQUksU0FBUyxDQUFDO0FBQUEsSUFDeEMsVUFBVSwwQ0FBZSxPQUFPLElBQUk7QUFBQSxFQUN0QyxDQUFDO0FBRUgsUUFBTSxFQUFFLE1BQU0sZ0JBQWdCLE9BQU8sUUFBUSxRQUFRLHlCQUNuRDtBQUFBLElBQ0UsTUFBTSxRQUFRLElBQUksTUFBTTtBQUFBLElBQ3hCLGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQSxFQUNQLENBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSw2QkFBNkIsUUFBUSxJQUFJLDZCQUE2QjtBQUFBLElBQ3RFLGFBQWEsUUFBUSxJQUFJLGFBQWE7QUFBQSxJQUN0QyxVQUFVLFFBQVEsSUFBSSxZQUFZO0FBQUEsSUFDbEM7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLGNBQWMsZUFDVjtBQUFBLE1BQ0UsWUFBWSxhQUFhLElBQUksWUFBWTtBQUFBLE1BQ3pDLFdBQVcsYUFBYSxJQUFJLFNBQVM7QUFBQSxJQUN2QyxJQUNBO0FBQUEsRUFDTjtBQUNGO0FBdkZlLEFBeUZmLGlDQUNFLFNBQ0EsUUFDZTtBQUNmLFVBQVEsV0FBVztBQUNuQixVQUFRLFdBQVcsUUFBUSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQzdDLFFBQU0sT0FBTyxPQUFPLEtBQUssWUFBWSxRQUFRLFlBQVk7QUFBQSxJQUN2RCxTQUFTLE9BQU8sV0FBVyxRQUFRLEtBQUssZUFBZSxFQUFFLFNBQVM7QUFBQSxFQUNwRSxDQUFDO0FBQ0g7QUFUZSxBQVdmLDJCQUEyQixTQUEwQztBQUNuRSxRQUFNLDRCQUNKLFFBQVEsSUFBSSwyQkFBMkIsS0FBSyxDQUFDO0FBQy9DLFNBQU8sT0FBTyxPQUFPLHlCQUF5QixFQUFFLE1BQU0sZUFDcEQsb0NBQU8sVUFBVSxNQUFNLENBQ3pCO0FBQ0Y7QUFOUyIsCiAgIm5hbWVzIjogW10KfQo=
