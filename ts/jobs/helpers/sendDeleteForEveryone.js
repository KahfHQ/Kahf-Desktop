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
var sendDeleteForEveryone_exports = {};
__export(sendDeleteForEveryone_exports, {
  sendDeleteForEveryone: () => sendDeleteForEveryone
});
module.exports = __toCommonJS(sendDeleteForEveryone_exports);
var import_lodash = require("lodash");
var Errors = __toESM(require("../../types/errors"));
var import_getSendOptions = require("../../util/getSendOptions");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_protobuf = require("../../protobuf");
var import_handleMultipleSendErrors = require("./handleMultipleSendErrors");
var import_ourProfileKey = require("../../services/ourProfileKey");
var import_wrapWithSyncMessageSend = require("../../util/wrapWithSyncMessageSend");
var import_getUntrustedConversationUuids = require("./getUntrustedConversationUuids");
var import_handleMessageSend = require("../../util/handleMessageSend");
var import_isConversationAccepted = require("../../util/isConversationAccepted");
var import_isConversationUnregistered = require("../../util/isConversationUnregistered");
var import_getMessageById = require("../../messages/getMessageById");
var import_isNotNil = require("../../util/isNotNil");
var import_Errors = require("../../textsecure/Errors");
var import_assert = require("../../util/assert");
async function sendDeleteForEveryone(conversation, {
  isFinalAttempt,
  messaging,
  shouldContinue,
  timestamp,
  timeRemaining,
  log
}, data) {
  const {
    messageId,
    recipients: recipientsFromJob,
    revision,
    targetTimestamp
  } = data;
  const message = await (0, import_getMessageById.getMessageById)(messageId);
  if (!message) {
    log.error(`Failed to fetch message ${messageId}. Failing job.`);
    return;
  }
  if (!shouldContinue) {
    log.info("Ran out of time. Giving up on sending delete for everyone");
    updateMessageWithFailure(message, [new Error("Ran out of time!")], log);
    return;
  }
  const sendType = "deleteForEveryone";
  const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
  const contentHint = ContentHint.RESENDABLE;
  const messageIds = [messageId];
  const logId = `deleteForEveryone/${conversation.idForLogging()}`;
  const deletedForEveryoneSendStatus = message.get("deletedForEveryoneSendStatus");
  const recipients = deletedForEveryoneSendStatus ? getRecipients(deletedForEveryoneSendStatus) : recipientsFromJob;
  const untrustedUuids = (0, import_getUntrustedConversationUuids.getUntrustedConversationUuids)(recipients);
  if (untrustedUuids.length) {
    window.reduxActions.conversations.conversationStoppedByMissingVerification({
      conversationId: conversation.id,
      untrustedUuids
    });
    throw new Error(`Delete for everyone blocked because ${untrustedUuids.length} conversation(s) were untrusted. Failing this attempt.`);
  }
  await conversation.queueJob("conversationQueue/sendDeleteForEveryone", async (abortSignal) => {
    log.info(`Sending deleteForEveryone to conversation ${logId}`, `with timestamp ${timestamp}`, `for message ${targetTimestamp}`);
    let profileKey;
    if (conversation.get("profileSharing")) {
      profileKey = await import_ourProfileKey.ourProfileKeyService.get();
    }
    const sendOptions = await (0, import_getSendOptions.getSendOptions)(conversation.attributes);
    try {
      if ((0, import_whatTypeOfConversation.isMe)(conversation.attributes)) {
        const proto = await messaging.getContentMessage({
          deletedForEveryoneTimestamp: targetTimestamp,
          profileKey,
          recipients: conversation.getRecipients(),
          timestamp
        });
        (0, import_assert.strictAssert)(proto.dataMessage, "ContentMessage must have dataMessage");
        await (0, import_handleMessageSend.handleMessageSend)(messaging.sendSyncMessage({
          encodedDataMessage: import_protobuf.SignalService.DataMessage.encode(proto.dataMessage).finish(),
          destination: conversation.get("e164"),
          destinationUuid: conversation.get("uuid"),
          expirationStartTimestamp: null,
          options: sendOptions,
          timestamp,
          urgent: false
        }), { messageIds, sendType });
        await updateMessageWithSuccessfulSends(message);
      } else if ((0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes)) {
        if (!(0, import_isConversationAccepted.isConversationAccepted)(conversation.attributes)) {
          log.info(`conversation ${conversation.idForLogging()} is not accepted; refusing to send`);
          updateMessageWithFailure(message, [new Error("Message request was not accepted")], log);
          return;
        }
        if ((0, import_isConversationUnregistered.isConversationUnregistered)(conversation.attributes)) {
          log.info(`conversation ${conversation.idForLogging()} is unregistered; refusing to send`);
          updateMessageWithFailure(message, [new Error("Contact no longer has a Signal account")], log);
          return;
        }
        if (conversation.isBlocked()) {
          log.info(`conversation ${conversation.idForLogging()} is blocked; refusing to send`);
          updateMessageWithFailure(message, [new Error("Contact is blocked")], log);
          return;
        }
        await (0, import_wrapWithSyncMessageSend.wrapWithSyncMessageSend)({
          conversation,
          logId,
          messageIds,
          send: async (sender) => sender.sendMessageToIdentifier({
            identifier: conversation.getSendTarget(),
            messageText: void 0,
            attachments: [],
            deletedForEveryoneTimestamp: targetTimestamp,
            timestamp,
            expireTimer: void 0,
            contentHint,
            groupId: void 0,
            profileKey,
            options: sendOptions,
            urgent: true
          }),
          sendType,
          timestamp
        });
        await updateMessageWithSuccessfulSends(message);
      } else {
        if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes) && !(0, import_lodash.isNumber)(revision)) {
          log.error("No revision provided, but conversation is GroupV2");
        }
        const groupV2Info = conversation.getGroupV2Info({
          members: recipients
        });
        if (groupV2Info && (0, import_lodash.isNumber)(revision)) {
          groupV2Info.revision = revision;
        }
        await (0, import_wrapWithSyncMessageSend.wrapWithSyncMessageSend)({
          conversation,
          logId,
          messageIds,
          send: async () => window.Signal.Util.sendToGroup({
            abortSignal,
            contentHint,
            groupSendOptions: {
              groupV1: conversation.getGroupV1Info(recipients),
              groupV2: groupV2Info,
              deletedForEveryoneTimestamp: targetTimestamp,
              timestamp,
              profileKey
            },
            messageId,
            sendOptions,
            sendTarget: conversation.toSenderKeyTarget(),
            sendType: "deleteForEveryone",
            urgent: true
          }),
          sendType,
          timestamp
        });
        await updateMessageWithSuccessfulSends(message);
      }
    } catch (error) {
      if (error instanceof import_Errors.SendMessageProtoError) {
        await updateMessageWithSuccessfulSends(message, error);
      }
      const errors = (0, import_handleMultipleSendErrors.maybeExpandErrors)(error);
      await (0, import_handleMultipleSendErrors.handleMultipleSendErrors)({
        errors,
        isFinalAttempt,
        log,
        markFailed: () => updateMessageWithFailure(message, errors, log),
        timeRemaining,
        toThrow: error
      });
    }
  });
}
function getRecipients(sendStatusByConversationId) {
  return Object.entries(sendStatusByConversationId).filter(([_, isSent]) => !isSent).map(([conversationId]) => {
    const recipient = window.ConversationController.get(conversationId);
    if (!recipient) {
      return null;
    }
    return recipient.get("uuid");
  }).filter(import_isNotNil.isNotNil);
}
async function updateMessageWithSuccessfulSends(message, result) {
  if (!result) {
    message.set({
      deletedForEveryoneSendStatus: {},
      deletedForEveryoneFailed: void 0
    });
    await window.Signal.Data.saveMessage(message.attributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    return;
  }
  const deletedForEveryoneSendStatus = {
    ...message.get("deletedForEveryoneSendStatus")
  };
  result.successfulIdentifiers?.forEach((identifier) => {
    const conversation = window.ConversationController.get(identifier);
    if (!conversation) {
      return;
    }
    deletedForEveryoneSendStatus[conversation.id] = true;
  });
  message.set({
    deletedForEveryoneSendStatus,
    deletedForEveryoneFailed: void 0
  });
  await window.Signal.Data.saveMessage(message.attributes, {
    ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
  });
}
async function updateMessageWithFailure(message, errors, log) {
  log.error("updateMessageWithFailure: Setting this set of errors", errors.map(Errors.toLogFormat));
  message.set({ deletedForEveryoneFailed: true });
  await window.Signal.Data.saveMessage(message.attributes, {
    ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendDeleteForEveryone
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZERlbGV0ZUZvckV2ZXJ5b25lLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlzTnVtYmVyIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uLy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHtcbiAgaXNEaXJlY3RDb252ZXJzYXRpb24sXG4gIGlzR3JvdXBWMixcbiAgaXNNZSxcbn0gZnJvbSAnLi4vLi4vdXRpbC93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi8uLi9wcm90b2J1Zic7XG5pbXBvcnQge1xuICBoYW5kbGVNdWx0aXBsZVNlbmRFcnJvcnMsXG4gIG1heWJlRXhwYW5kRXJyb3JzLFxufSBmcm9tICcuL2hhbmRsZU11bHRpcGxlU2VuZEVycm9ycyc7XG5pbXBvcnQgeyBvdXJQcm9maWxlS2V5U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL291clByb2ZpbGVLZXknO1xuaW1wb3J0IHsgd3JhcFdpdGhTeW5jTWVzc2FnZVNlbmQgfSBmcm9tICcuLi8uLi91dGlsL3dyYXBXaXRoU3luY01lc3NhZ2VTZW5kJztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uUXVldWVKb2JCdW5kbGUsXG4gIERlbGV0ZUZvckV2ZXJ5b25lSm9iRGF0YSxcbn0gZnJvbSAnLi4vY29udmVyc2F0aW9uSm9iUXVldWUnO1xuaW1wb3J0IHsgZ2V0VW50cnVzdGVkQ29udmVyc2F0aW9uVXVpZHMgfSBmcm9tICcuL2dldFVudHJ1c3RlZENvbnZlcnNhdGlvblV1aWRzJztcbmltcG9ydCB7IGhhbmRsZU1lc3NhZ2VTZW5kIH0gZnJvbSAnLi4vLi4vdXRpbC9oYW5kbGVNZXNzYWdlU2VuZCc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvbkFjY2VwdGVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvbkFjY2VwdGVkJztcbmltcG9ydCB7IGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCc7XG5pbXBvcnQgeyBnZXRNZXNzYWdlQnlJZCB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL2dldE1lc3NhZ2VCeUlkJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vLi4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgdHlwZSB7IENhbGxiYWNrUmVzdWx0VHlwZSB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvVHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9tZXNzYWdlcyc7XG5pbXBvcnQgeyBTZW5kTWVzc2FnZVByb3RvRXJyb3IgfSBmcm9tICcuLi8uLi90ZXh0c2VjdXJlL0Vycm9ycyc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi8uLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9Mb2dnaW5nJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmREZWxldGVGb3JFdmVyeW9uZShcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbCxcbiAge1xuICAgIGlzRmluYWxBdHRlbXB0LFxuICAgIG1lc3NhZ2luZyxcbiAgICBzaG91bGRDb250aW51ZSxcbiAgICB0aW1lc3RhbXAsXG4gICAgdGltZVJlbWFpbmluZyxcbiAgICBsb2csXG4gIH06IENvbnZlcnNhdGlvblF1ZXVlSm9iQnVuZGxlLFxuICBkYXRhOiBEZWxldGVGb3JFdmVyeW9uZUpvYkRhdGFcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7XG4gICAgbWVzc2FnZUlkLFxuICAgIHJlY2lwaWVudHM6IHJlY2lwaWVudHNGcm9tSm9iLFxuICAgIHJldmlzaW9uLFxuICAgIHRhcmdldFRpbWVzdGFtcCxcbiAgfSA9IGRhdGE7XG5cbiAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gIGlmICghbWVzc2FnZSkge1xuICAgIGxvZy5lcnJvcihgRmFpbGVkIHRvIGZldGNoIG1lc3NhZ2UgJHttZXNzYWdlSWR9LiBGYWlsaW5nIGpvYi5gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgbG9nLmluZm8oJ1JhbiBvdXQgb2YgdGltZS4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgZGVsZXRlIGZvciBldmVyeW9uZScpO1xuICAgIHVwZGF0ZU1lc3NhZ2VXaXRoRmFpbHVyZShtZXNzYWdlLCBbbmV3IEVycm9yKCdSYW4gb3V0IG9mIHRpbWUhJyldLCBsb2cpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHNlbmRUeXBlID0gJ2RlbGV0ZUZvckV2ZXJ5b25lJztcbiAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuICBjb25zdCBjb250ZW50SGludCA9IENvbnRlbnRIaW50LlJFU0VOREFCTEU7XG4gIGNvbnN0IG1lc3NhZ2VJZHMgPSBbbWVzc2FnZUlkXTtcblxuICBjb25zdCBsb2dJZCA9IGBkZWxldGVGb3JFdmVyeW9uZS8ke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gO1xuXG4gIGNvbnN0IGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXMgPSBtZXNzYWdlLmdldChcbiAgICAnZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cydcbiAgKTtcbiAgY29uc3QgcmVjaXBpZW50cyA9IGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXNcbiAgICA/IGdldFJlY2lwaWVudHMoZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cylcbiAgICA6IHJlY2lwaWVudHNGcm9tSm9iO1xuXG4gIGNvbnN0IHVudHJ1c3RlZFV1aWRzID0gZ2V0VW50cnVzdGVkQ29udmVyc2F0aW9uVXVpZHMocmVjaXBpZW50cyk7XG4gIGlmICh1bnRydXN0ZWRVdWlkcy5sZW5ndGgpIHtcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuY29udmVyc2F0aW9uU3RvcHBlZEJ5TWlzc2luZ1ZlcmlmaWNhdGlvbih7XG4gICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgdW50cnVzdGVkVXVpZHMsXG4gICAgfSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYERlbGV0ZSBmb3IgZXZlcnlvbmUgYmxvY2tlZCBiZWNhdXNlICR7dW50cnVzdGVkVXVpZHMubGVuZ3RofSBjb252ZXJzYXRpb24ocykgd2VyZSB1bnRydXN0ZWQuIEZhaWxpbmcgdGhpcyBhdHRlbXB0LmBcbiAgICApO1xuICB9XG5cbiAgYXdhaXQgY29udmVyc2F0aW9uLnF1ZXVlSm9iKFxuICAgICdjb252ZXJzYXRpb25RdWV1ZS9zZW5kRGVsZXRlRm9yRXZlcnlvbmUnLFxuICAgIGFzeW5jIGFib3J0U2lnbmFsID0+IHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgU2VuZGluZyBkZWxldGVGb3JFdmVyeW9uZSB0byBjb252ZXJzYXRpb24gJHtsb2dJZH1gLFxuICAgICAgICBgd2l0aCB0aW1lc3RhbXAgJHt0aW1lc3RhbXB9YCxcbiAgICAgICAgYGZvciBtZXNzYWdlICR7dGFyZ2V0VGltZXN0YW1wfWBcbiAgICAgICk7XG5cbiAgICAgIGxldCBwcm9maWxlS2V5OiBVaW50OEFycmF5IHwgdW5kZWZpbmVkO1xuICAgICAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJykpIHtcbiAgICAgICAgcHJvZmlsZUtleSA9IGF3YWl0IG91clByb2ZpbGVLZXlTZXJ2aWNlLmdldCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGlzTWUoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBhd2FpdCBtZXNzYWdpbmcuZ2V0Q29udGVudE1lc3NhZ2Uoe1xuICAgICAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wOiB0YXJnZXRUaW1lc3RhbXAsXG4gICAgICAgICAgICBwcm9maWxlS2V5LFxuICAgICAgICAgICAgcmVjaXBpZW50czogY29udmVyc2F0aW9uLmdldFJlY2lwaWVudHMoKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgICAgICBwcm90by5kYXRhTWVzc2FnZSxcbiAgICAgICAgICAgICdDb250ZW50TWVzc2FnZSBtdXN0IGhhdmUgZGF0YU1lc3NhZ2UnXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGF3YWl0IGhhbmRsZU1lc3NhZ2VTZW5kKFxuICAgICAgICAgICAgbWVzc2FnaW5nLnNlbmRTeW5jTWVzc2FnZSh7XG4gICAgICAgICAgICAgIGVuY29kZWREYXRhTWVzc2FnZTogUHJvdG8uRGF0YU1lc3NhZ2UuZW5jb2RlKFxuICAgICAgICAgICAgICAgIHByb3RvLmRhdGFNZXNzYWdlXG4gICAgICAgICAgICAgICkuZmluaXNoKCksXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBjb252ZXJzYXRpb24uZ2V0KCdlMTY0JyksXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uVXVpZDogY29udmVyc2F0aW9uLmdldCgndXVpZCcpLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXA6IG51bGwsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHNlbmRPcHRpb25zLFxuICAgICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHsgbWVzc2FnZUlkcywgc2VuZFR5cGUgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgYXdhaXQgdXBkYXRlTWVzc2FnZVdpdGhTdWNjZXNzZnVsU2VuZHMobWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgaWYgKCFpc0NvbnZlcnNhdGlvbkFjY2VwdGVkKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAgIGBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGlzIG5vdCBhY2NlcHRlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB1cGRhdGVNZXNzYWdlV2l0aEZhaWx1cmUoXG4gICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgIFtuZXcgRXJyb3IoJ01lc3NhZ2UgcmVxdWVzdCB3YXMgbm90IGFjY2VwdGVkJyldLFxuICAgICAgICAgICAgICBsb2dcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZChjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgICBgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfSBpcyB1bnJlZ2lzdGVyZWQ7IHJlZnVzaW5nIHRvIHNlbmRgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdXBkYXRlTWVzc2FnZVdpdGhGYWlsdXJlKFxuICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICBbbmV3IEVycm9yKCdDb250YWN0IG5vIGxvbmdlciBoYXMgYSBTaWduYWwgYWNjb3VudCcpXSxcbiAgICAgICAgICAgICAgbG9nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY29udmVyc2F0aW9uLmlzQmxvY2tlZCgpKSB7XG4gICAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgICAgYGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgYmxvY2tlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB1cGRhdGVNZXNzYWdlV2l0aEZhaWx1cmUoXG4gICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgIFtuZXcgRXJyb3IoJ0NvbnRhY3QgaXMgYmxvY2tlZCcpXSxcbiAgICAgICAgICAgICAgbG9nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF3YWl0IHdyYXBXaXRoU3luY01lc3NhZ2VTZW5kKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICAgICAgIGxvZ0lkLFxuICAgICAgICAgICAgbWVzc2FnZUlkcyxcbiAgICAgICAgICAgIHNlbmQ6IGFzeW5jIHNlbmRlciA9PlxuICAgICAgICAgICAgICBzZW5kZXIuc2VuZE1lc3NhZ2VUb0lkZW50aWZpZXIoe1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogY29udmVyc2F0aW9uLmdldFNlbmRUYXJnZXQoKSEsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVRleHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50czogW10sXG4gICAgICAgICAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wOiB0YXJnZXRUaW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgICAgICAgIGV4cGlyZVRpbWVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgICAgICAgICAgZ3JvdXBJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogc2VuZE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbmRUeXBlLFxuICAgICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgdXBkYXRlTWVzc2FnZVdpdGhTdWNjZXNzZnVsU2VuZHMobWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlzR3JvdXBWMihjb252ZXJzYXRpb24uYXR0cmlidXRlcykgJiYgIWlzTnVtYmVyKHJldmlzaW9uKSkge1xuICAgICAgICAgICAgbG9nLmVycm9yKCdObyByZXZpc2lvbiBwcm92aWRlZCwgYnV0IGNvbnZlcnNhdGlvbiBpcyBHcm91cFYyJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZ3JvdXBWMkluZm8gPSBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgICAgICAgICAgbWVtYmVyczogcmVjaXBpZW50cyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZ3JvdXBWMkluZm8gJiYgaXNOdW1iZXIocmV2aXNpb24pKSB7XG4gICAgICAgICAgICBncm91cFYySW5mby5yZXZpc2lvbiA9IHJldmlzaW9uO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF3YWl0IHdyYXBXaXRoU3luY01lc3NhZ2VTZW5kKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICAgICAgIGxvZ0lkLFxuICAgICAgICAgICAgbWVzc2FnZUlkcyxcbiAgICAgICAgICAgIHNlbmQ6IGFzeW5jICgpID0+XG4gICAgICAgICAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5zZW5kVG9Hcm91cCh7XG4gICAgICAgICAgICAgICAgYWJvcnRTaWduYWwsXG4gICAgICAgICAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgICAgICAgICAgZ3JvdXBTZW5kT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgZ3JvdXBWMTogY29udmVyc2F0aW9uLmdldEdyb3VwVjFJbmZvKHJlY2lwaWVudHMpLFxuICAgICAgICAgICAgICAgICAgZ3JvdXBWMjogZ3JvdXBWMkluZm8sXG4gICAgICAgICAgICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA6IHRhcmdldFRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgc2VuZE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2VuZFRhcmdldDogY29udmVyc2F0aW9uLnRvU2VuZGVyS2V5VGFyZ2V0KCksXG4gICAgICAgICAgICAgICAgc2VuZFR5cGU6ICdkZWxldGVGb3JFdmVyeW9uZScsXG4gICAgICAgICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbmRUeXBlLFxuICAgICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgdXBkYXRlTWVzc2FnZVdpdGhTdWNjZXNzZnVsU2VuZHMobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFNlbmRNZXNzYWdlUHJvdG9FcnJvcikge1xuICAgICAgICAgIGF3YWl0IHVwZGF0ZU1lc3NhZ2VXaXRoU3VjY2Vzc2Z1bFNlbmRzKG1lc3NhZ2UsIGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVycm9ycyA9IG1heWJlRXhwYW5kRXJyb3JzKGVycm9yKTtcbiAgICAgICAgYXdhaXQgaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzKHtcbiAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgaXNGaW5hbEF0dGVtcHQsXG4gICAgICAgICAgbG9nLFxuICAgICAgICAgIG1hcmtGYWlsZWQ6ICgpID0+IHVwZGF0ZU1lc3NhZ2VXaXRoRmFpbHVyZShtZXNzYWdlLCBlcnJvcnMsIGxvZyksXG4gICAgICAgICAgdGltZVJlbWFpbmluZyxcbiAgICAgICAgICB0b1Rocm93OiBlcnJvcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBnZXRSZWNpcGllbnRzKFxuICBzZW5kU3RhdHVzQnlDb252ZXJzYXRpb25JZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj5cbik6IEFycmF5PHN0cmluZz4ge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc2VuZFN0YXR1c0J5Q29udmVyc2F0aW9uSWQpXG4gICAgLmZpbHRlcigoW18sIGlzU2VudF0pID0+ICFpc1NlbnQpXG4gICAgLm1hcCgoW2NvbnZlcnNhdGlvbklkXSkgPT4ge1xuICAgICAgY29uc3QgcmVjaXBpZW50ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGlmICghcmVjaXBpZW50KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlY2lwaWVudC5nZXQoJ3V1aWQnKTtcbiAgICB9KVxuICAgIC5maWx0ZXIoaXNOb3ROaWwpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVNZXNzYWdlV2l0aFN1Y2Nlc3NmdWxTZW5kcyhcbiAgbWVzc2FnZTogTWVzc2FnZU1vZGVsLFxuICByZXN1bHQ/OiBDYWxsYmFja1Jlc3VsdFR5cGUgfCBTZW5kTWVzc2FnZVByb3RvRXJyb3Jcbik6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIXJlc3VsdCkge1xuICAgIG1lc3NhZ2Uuc2V0KHtcbiAgICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXM6IHt9LFxuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lRmFpbGVkOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UuYXR0cmlidXRlcywge1xuICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXMgPSB7XG4gICAgLi4ubWVzc2FnZS5nZXQoJ2RlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXMnKSxcbiAgfTtcblxuICByZXN1bHQuc3VjY2Vzc2Z1bElkZW50aWZpZXJzPy5mb3JFYWNoKGlkZW50aWZpZXIgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZGVudGlmaWVyKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkZWxldGVkRm9yRXZlcnlvbmVTZW5kU3RhdHVzW2NvbnZlcnNhdGlvbi5pZF0gPSB0cnVlO1xuICB9KTtcblxuICBtZXNzYWdlLnNldCh7XG4gICAgZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cyxcbiAgICBkZWxldGVkRm9yRXZlcnlvbmVGYWlsZWQ6IHVuZGVmaW5lZCxcbiAgfSk7XG4gIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlTWVzc2FnZVdpdGhGYWlsdXJlKFxuICBtZXNzYWdlOiBNZXNzYWdlTW9kZWwsXG4gIGVycm9yczogUmVhZG9ubHlBcnJheTx1bmtub3duPixcbiAgbG9nOiBMb2dnZXJUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgbG9nLmVycm9yKFxuICAgICd1cGRhdGVNZXNzYWdlV2l0aEZhaWx1cmU6IFNldHRpbmcgdGhpcyBzZXQgb2YgZXJyb3JzJyxcbiAgICBlcnJvcnMubWFwKEVycm9ycy50b0xvZ0Zvcm1hdClcbiAgKTtcblxuICBtZXNzYWdlLnNldCh7IGRlbGV0ZWRGb3JFdmVyeW9uZUZhaWxlZDogdHJ1ZSB9KTtcbiAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UuYXR0cmlidXRlcywge1xuICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gIH0pO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUF5QjtBQUV6QixhQUF3QjtBQUN4Qiw0QkFBK0I7QUFDL0Isb0NBSU87QUFDUCxzQkFBdUM7QUFDdkMsc0NBR087QUFDUCwyQkFB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
