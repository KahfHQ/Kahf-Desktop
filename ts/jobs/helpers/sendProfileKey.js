var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sendProfileKey_exports = {};
__export(sendProfileKey_exports, {
  canAllErrorsBeIgnored: () => canAllErrorsBeIgnored,
  sendProfileKey: () => sendProfileKey
});
module.exports = __toCommonJS(sendProfileKey_exports);
var import_lodash = require("lodash");
var import_handleMessageSend = require("../../util/handleMessageSend");
var import_getSendOptions = require("../../util/getSendOptions");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_protobuf = require("../../protobuf");
var import_handleMultipleSendErrors = require("./handleMultipleSendErrors");
var import_ourProfileKey = require("../../services/ourProfileKey");
var import_isConversationAccepted = require("../../util/isConversationAccepted");
var import_isConversationUnregistered = require("../../util/isConversationUnregistered");
var import_Errors = require("../../textsecure/Errors");
function canAllErrorsBeIgnored(conversation, error) {
  if (error instanceof import_Errors.OutgoingIdentityKeyError || error instanceof import_Errors.SendMessageChallengeError || error instanceof import_Errors.UnregisteredUserError) {
    return true;
  }
  return Boolean((0, import_whatTypeOfConversation.isGroup)(conversation) && error instanceof import_Errors.SendMessageProtoError && error.errors?.every((item) => item instanceof import_Errors.OutgoingIdentityKeyError || item instanceof import_Errors.SendMessageChallengeError || item instanceof import_Errors.UnregisteredUserError));
}
async function sendProfileKey(conversation, {
  isFinalAttempt,
  messaging,
  shouldContinue,
  timestamp,
  timeRemaining,
  log
}, data) {
  if (!shouldContinue) {
    log.info("Ran out of time. Giving up on sending profile key");
    return;
  }
  if (!conversation.get("profileSharing")) {
    log.info("No longer sharing profile. Cancelling job.");
    return;
  }
  const profileKey = await import_ourProfileKey.ourProfileKeyService.get();
  if (!profileKey) {
    log.info("Unable to fetch profile. Cancelling job.");
    return;
  }
  log.info(`starting profile key share to ${conversation.idForLogging()} with timestamp ${timestamp}`);
  const { revision } = data;
  const sendOptions = await (0, import_getSendOptions.getSendOptions)(conversation.attributes);
  const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
  const contentHint = ContentHint.RESENDABLE;
  const sendType = "profileKeyUpdate";
  let sendPromise;
  if ((0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes)) {
    if (!(0, import_isConversationAccepted.isConversationAccepted)(conversation.attributes)) {
      log.info(`conversation ${conversation.idForLogging()} is not accepted; refusing to send`);
      return;
    }
    if ((0, import_isConversationUnregistered.isConversationUnregistered)(conversation.attributes)) {
      log.info(`conversation ${conversation.idForLogging()} is unregistered; refusing to send`);
      return;
    }
    if (conversation.isBlocked()) {
      log.info(`conversation ${conversation.idForLogging()} is blocked; refusing to send`);
      return;
    }
    const proto = await messaging.getContentMessage({
      flags: import_protobuf.SignalService.DataMessage.Flags.PROFILE_KEY_UPDATE,
      profileKey,
      recipients: conversation.getRecipients(),
      timestamp
    });
    sendPromise = messaging.sendIndividualProto({
      contentHint,
      identifier: conversation.getSendTarget(),
      options: sendOptions,
      proto,
      timestamp,
      urgent: false
    });
  } else {
    if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes) && !(0, import_lodash.isNumber)(revision)) {
      log.error("No revision provided, but conversation is GroupV2");
    }
    const groupV2Info = conversation.getGroupV2Info();
    if (groupV2Info && (0, import_lodash.isNumber)(revision)) {
      groupV2Info.revision = revision;
    }
    sendPromise = window.Signal.Util.sendToGroup({
      contentHint,
      groupSendOptions: {
        flags: import_protobuf.SignalService.DataMessage.Flags.PROFILE_KEY_UPDATE,
        groupV1: conversation.getGroupV1Info(),
        groupV2: groupV2Info,
        profileKey,
        timestamp
      },
      messageId: void 0,
      sendOptions,
      sendTarget: conversation.toSenderKeyTarget(),
      sendType,
      urgent: false
    });
  }
  try {
    await (0, import_handleMessageSend.handleMessageSend)(sendPromise, {
      messageIds: [],
      sendType
    });
  } catch (error) {
    if (canAllErrorsBeIgnored(conversation.attributes, error)) {
      log.info("Group send failures were all OutgoingIdentityKeyError, SendMessageChallengeError, or UnregisteredUserError. Returning succcessfully.");
      return;
    }
    await (0, import_handleMultipleSendErrors.handleMultipleSendErrors)({
      errors: (0, import_handleMultipleSendErrors.maybeExpandErrors)(error),
      isFinalAttempt,
      log,
      timeRemaining,
      toThrow: error
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  canAllErrorsBeIgnored,
  sendProfileKey
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZFByb2ZpbGVLZXkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBoYW5kbGVNZXNzYWdlU2VuZCB9IGZyb20gJy4uLy4uL3V0aWwvaGFuZGxlTWVzc2FnZVNlbmQnO1xuaW1wb3J0IHsgZ2V0U2VuZE9wdGlvbnMgfSBmcm9tICcuLi8uLi91dGlsL2dldFNlbmRPcHRpb25zJztcbmltcG9ydCB7XG4gIGlzRGlyZWN0Q29udmVyc2F0aW9uLFxuICBpc0dyb3VwLFxuICBpc0dyb3VwVjIsXG59IGZyb20gJy4uLy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vLi4vcHJvdG9idWYnO1xuaW1wb3J0IHtcbiAgaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzLFxuICBtYXliZUV4cGFuZEVycm9ycyxcbn0gZnJvbSAnLi9oYW5kbGVNdWx0aXBsZVNlbmRFcnJvcnMnO1xuaW1wb3J0IHsgb3VyUHJvZmlsZUtleVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vdXJQcm9maWxlS2V5JztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uUXVldWVKb2JCdW5kbGUsXG4gIFByb2ZpbGVLZXlKb2JEYXRhLFxufSBmcm9tICcuLi9jb252ZXJzYXRpb25Kb2JRdWV1ZSc7XG5pbXBvcnQgdHlwZSB7IENhbGxiYWNrUmVzdWx0VHlwZSB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvVHlwZXMuZCc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvbkFjY2VwdGVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvbkFjY2VwdGVkJztcbmltcG9ydCB7IGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi4vLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQge1xuICBPdXRnb2luZ0lkZW50aXR5S2V5RXJyb3IsXG4gIFNlbmRNZXNzYWdlQ2hhbGxlbmdlRXJyb3IsXG4gIFNlbmRNZXNzYWdlUHJvdG9FcnJvcixcbiAgVW5yZWdpc3RlcmVkVXNlckVycm9yLFxufSBmcm9tICcuLi8uLi90ZXh0c2VjdXJlL0Vycm9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5BbGxFcnJvcnNCZUlnbm9yZWQoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIGVycm9yOiB1bmtub3duXG4pOiBib29sZWFuIHtcbiAgaWYgKFxuICAgIGVycm9yIGluc3RhbmNlb2YgT3V0Z29pbmdJZGVudGl0eUtleUVycm9yIHx8XG4gICAgZXJyb3IgaW5zdGFuY2VvZiBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yIHx8XG4gICAgZXJyb3IgaW5zdGFuY2VvZiBVbnJlZ2lzdGVyZWRVc2VyRXJyb3JcbiAgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gQm9vbGVhbihcbiAgICBpc0dyb3VwKGNvbnZlcnNhdGlvbikgJiZcbiAgICAgIGVycm9yIGluc3RhbmNlb2YgU2VuZE1lc3NhZ2VQcm90b0Vycm9yICYmXG4gICAgICBlcnJvci5lcnJvcnM/LmV2ZXJ5KFxuICAgICAgICBpdGVtID0+XG4gICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvciB8fFxuICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yIHx8XG4gICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIFVucmVnaXN0ZXJlZFVzZXJFcnJvclxuICAgICAgKVxuICApO1xufVxuXG4vLyBOb3RlOiBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYSByZWNpcGllbnQgbWFwLCB3ZSB3aWxsIHJlc2VuZCB0aGlzIG1lc3NhZ2UgdG8gZm9sa3MgdGhhdFxuLy8gICBnb3QgaXQgb24gdGhlIGZpcnN0IGdvLXJvdW5kLCBpZiBzb21lIHNlbmRzIGZhaWwuIFRoaXMgaXMgb2theSwgYmVjYXVzZSBhIHJlY2lwaWVudFxuLy8gICBnZXR0aW5nIHlvdXIgcHJvZmlsZUtleSBhZ2FpbiBpcyBqdXN0IGZpbmUuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFByb2ZpbGVLZXkoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwsXG4gIHtcbiAgICBpc0ZpbmFsQXR0ZW1wdCxcbiAgICBtZXNzYWdpbmcsXG4gICAgc2hvdWxkQ29udGludWUsXG4gICAgdGltZXN0YW1wLFxuICAgIHRpbWVSZW1haW5pbmcsXG4gICAgbG9nLFxuICB9OiBDb252ZXJzYXRpb25RdWV1ZUpvYkJ1bmRsZSxcbiAgZGF0YTogUHJvZmlsZUtleUpvYkRhdGFcbik6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgbG9nLmluZm8oJ1JhbiBvdXQgb2YgdGltZS4gR2l2aW5nIHVwIG9uIHNlbmRpbmcgcHJvZmlsZSBrZXknKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJykpIHtcbiAgICBsb2cuaW5mbygnTm8gbG9uZ2VyIHNoYXJpbmcgcHJvZmlsZS4gQ2FuY2VsbGluZyBqb2IuJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcHJvZmlsZUtleSA9IGF3YWl0IG91clByb2ZpbGVLZXlTZXJ2aWNlLmdldCgpO1xuICBpZiAoIXByb2ZpbGVLZXkpIHtcbiAgICBsb2cuaW5mbygnVW5hYmxlIHRvIGZldGNoIHByb2ZpbGUuIENhbmNlbGxpbmcgam9iLicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZy5pbmZvKFxuICAgIGBzdGFydGluZyBwcm9maWxlIGtleSBzaGFyZSB0byAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gd2l0aCB0aW1lc3RhbXAgJHt0aW1lc3RhbXB9YFxuICApO1xuXG4gIGNvbnN0IHsgcmV2aXNpb24gfSA9IGRhdGE7XG4gIGNvbnN0IHNlbmRPcHRpb25zID0gYXdhaXQgZ2V0U2VuZE9wdGlvbnMoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG4gIGNvbnN0IGNvbnRlbnRIaW50ID0gQ29udGVudEhpbnQuUkVTRU5EQUJMRTtcbiAgY29uc3Qgc2VuZFR5cGUgPSAncHJvZmlsZUtleVVwZGF0ZSc7XG5cbiAgbGV0IHNlbmRQcm9taXNlOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT47XG5cbiAgLy8gTm90ZTogZmxhZ3MgYW5kIHRoZSBwcm9maWxlS2V5IGl0c2VsZiBhcmUgYWxsIHRoYXQgbWF0dGVyIGluIHRoZSBwcm90by5cblxuICAvLyBOb3RlOiB3ZSBkb24ndCBjaGVjayBmb3IgdW50cnVzdGVkIGNvbnZlcnNhdGlvbnMgaGVyZTsgd2UgYXR0ZW1wdCB0byBzZW5kIGFueXdheVxuXG4gIGlmIChpc0RpcmVjdENvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICBpZiAoIWlzQ29udmVyc2F0aW9uQWNjZXB0ZWQoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgbm90IGFjY2VwdGVkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGlzIHVucmVnaXN0ZXJlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb252ZXJzYXRpb24uaXNCbG9ja2VkKCkpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfSBpcyBibG9ja2VkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm90byA9IGF3YWl0IG1lc3NhZ2luZy5nZXRDb250ZW50TWVzc2FnZSh7XG4gICAgICBmbGFnczogUHJvdG8uRGF0YU1lc3NhZ2UuRmxhZ3MuUFJPRklMRV9LRVlfVVBEQVRFLFxuICAgICAgcHJvZmlsZUtleSxcbiAgICAgIHJlY2lwaWVudHM6IGNvbnZlcnNhdGlvbi5nZXRSZWNpcGllbnRzKCksXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfSk7XG4gICAgc2VuZFByb21pc2UgPSBtZXNzYWdpbmcuc2VuZEluZGl2aWR1YWxQcm90byh7XG4gICAgICBjb250ZW50SGludCxcbiAgICAgIGlkZW50aWZpZXI6IGNvbnZlcnNhdGlvbi5nZXRTZW5kVGFyZ2V0KCksXG4gICAgICBvcHRpb25zOiBzZW5kT3B0aW9ucyxcbiAgICAgIHByb3RvLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNHcm91cFYyKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJiAhaXNOdW1iZXIocmV2aXNpb24pKSB7XG4gICAgICBsb2cuZXJyb3IoJ05vIHJldmlzaW9uIHByb3ZpZGVkLCBidXQgY29udmVyc2F0aW9uIGlzIEdyb3VwVjInKTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cFYySW5mbyA9IGNvbnZlcnNhdGlvbi5nZXRHcm91cFYySW5mbygpO1xuICAgIGlmIChncm91cFYySW5mbyAmJiBpc051bWJlcihyZXZpc2lvbikpIHtcbiAgICAgIGdyb3VwVjJJbmZvLnJldmlzaW9uID0gcmV2aXNpb247XG4gICAgfVxuXG4gICAgc2VuZFByb21pc2UgPSB3aW5kb3cuU2lnbmFsLlV0aWwuc2VuZFRvR3JvdXAoe1xuICAgICAgY29udGVudEhpbnQsXG4gICAgICBncm91cFNlbmRPcHRpb25zOiB7XG4gICAgICAgIGZsYWdzOiBQcm90by5EYXRhTWVzc2FnZS5GbGFncy5QUk9GSUxFX0tFWV9VUERBVEUsXG4gICAgICAgIGdyb3VwVjE6IGNvbnZlcnNhdGlvbi5nZXRHcm91cFYxSW5mbygpLFxuICAgICAgICBncm91cFYyOiBncm91cFYySW5mbyxcbiAgICAgICAgcHJvZmlsZUtleSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VJZDogdW5kZWZpbmVkLFxuICAgICAgc2VuZE9wdGlvbnMsXG4gICAgICBzZW5kVGFyZ2V0OiBjb252ZXJzYXRpb24udG9TZW5kZXJLZXlUYXJnZXQoKSxcbiAgICAgIHNlbmRUeXBlLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYXdhaXQgaGFuZGxlTWVzc2FnZVNlbmQoc2VuZFByb21pc2UsIHtcbiAgICAgIG1lc3NhZ2VJZHM6IFtdLFxuICAgICAgc2VuZFR5cGUsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgaWYgKGNhbkFsbEVycm9yc0JlSWdub3JlZChjb252ZXJzYXRpb24uYXR0cmlidXRlcywgZXJyb3IpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ0dyb3VwIHNlbmQgZmFpbHVyZXMgd2VyZSBhbGwgT3V0Z29pbmdJZGVudGl0eUtleUVycm9yLCBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yLCBvciBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IuIFJldHVybmluZyBzdWNjY2Vzc2Z1bGx5LidcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzKHtcbiAgICAgIGVycm9yczogbWF5YmVFeHBhbmRFcnJvcnMoZXJyb3IpLFxuICAgICAgaXNGaW5hbEF0dGVtcHQsXG4gICAgICBsb2csXG4gICAgICB0aW1lUmVtYWluaW5nLFxuICAgICAgdG9UaHJvdzogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUF5QjtBQUV6QiwrQkFBa0M7QUFDbEMsNEJBQStCO0FBQy9CLG9DQUlPO0FBQ1Asc0JBQXVDO0FBQ3ZDLHNDQUdPO0FBQ1AsMkJBQXFDO0FBUXJDLG9DQUF1QztBQUN2Qyx3Q0FBMkM7QUFFM0Msb0JBS087QUFFQSwrQkFDTCxjQUNBLE9BQ1M7QUFDVCxNQUNFLGlCQUFpQiwwQ0FDakIsaUJBQWlCLDJDQUNqQixpQkFBaUIscUNBQ2pCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPLFFBQ0wsMkNBQVEsWUFBWSxLQUNsQixpQkFBaUIsdUNBQ2pCLE1BQU0sUUFBUSxNQUNaLFVBQ0UsZ0JBQWdCLDBDQUNoQixnQkFBZ0IsMkNBQ2hCLGdCQUFnQixtQ0FDcEIsQ0FDSjtBQUNGO0FBdEJnQixBQTJCaEIsOEJBQ0UsY0FDQTtBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBRUYsTUFDZTtBQUNmLE1BQUks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
