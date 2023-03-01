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
var onStoryRecipientUpdate_exports = {};
__export(onStoryRecipientUpdate_exports, {
  onStoryRecipientUpdate: () => onStoryRecipientUpdate
});
module.exports = __toCommonJS(onStoryRecipientUpdate_exports);
var import_lodash = require("lodash");
var log = __toESM(require("../logging/log"));
var import_Deletes = require("../messageModifiers/Deletes");
var import_MessageSendState = require("../messages/MessageSendState");
var import_deleteForEveryone = require("./deleteForEveryone");
var import_idForLogging = require("./idForLogging");
var import_message = require("../state/selectors/message");
var import_normalizeUuid = require("./normalizeUuid");
var import_messageBatcher = require("./messageBatcher");
async function onStoryRecipientUpdate(event) {
  const { data, confirm } = event;
  const { destinationUuid, timestamp } = data;
  const conversation = window.ConversationController.get(destinationUuid);
  if (!conversation) {
    return;
  }
  const targetConversation = await window.ConversationController.getConversationForTargetMessage(conversation.id, timestamp);
  if (!targetConversation) {
    log.info("onStoryRecipientUpdate !targetConversation", {
      destinationUuid,
      timestamp
    });
    return;
  }
  targetConversation.queueJob("onStoryRecipientUpdate", async () => {
    log.info("onStoryRecipientUpdate updating", timestamp);
    const isAllowedToReply = /* @__PURE__ */ new Map();
    const conversationIdToDistributionListIds = /* @__PURE__ */ new Map();
    data.storyMessageRecipients.forEach((item) => {
      const convo = window.ConversationController.get(item.destinationUuid);
      if (!convo || !item.distributionListIds) {
        return;
      }
      conversationIdToDistributionListIds.set(convo.id, new Set(item.distributionListIds.map((uuid) => (0, import_normalizeUuid.normalizeUuid)(uuid, "onStoryRecipientUpdate.distributionListId"))));
      isAllowedToReply.set(convo.id, item.isAllowedToReply !== false);
    });
    const ourConversationId = window.ConversationController.getOurConversationIdOrThrow();
    const now = Date.now();
    const messages = await window.Signal.Data.getMessagesBySentAt(timestamp);
    messages.forEach((item) => {
      if (!(0, import_message.isStory)(item)) {
        return;
      }
      const { sendStateByConversationId, storyDistributionListId } = item;
      if (!sendStateByConversationId || !storyDistributionListId) {
        return;
      }
      const nextSendStateByConversationId = {
        ...sendStateByConversationId
      };
      conversationIdToDistributionListIds.forEach((distributionListIds, conversationId) => {
        const hasDistributionListId = distributionListIds.has(storyDistributionListId);
        const recipient = window.ConversationController.get(conversationId);
        const conversationIdForLogging = recipient ? (0, import_idForLogging.getConversationIdForLogging)(recipient.attributes) : conversationId;
        if (hasDistributionListId && !sendStateByConversationId[conversationId]) {
          log.info("onStoryRecipientUpdate adding", {
            conversationId: conversationIdForLogging,
            messageId: (0, import_idForLogging.getMessageIdForLogging)(item),
            storyDistributionListId
          });
          nextSendStateByConversationId[conversationId] = {
            isAllowedToReplyToStory: Boolean(isAllowedToReply.get(conversationId)),
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: now
          };
        } else if (sendStateByConversationId[conversationId] && !hasDistributionListId) {
          log.info("onStoryRecipientUpdate removing", {
            conversationId: conversationIdForLogging,
            messageId: (0, import_idForLogging.getMessageIdForLogging)(item),
            storyDistributionListId
          });
          delete nextSendStateByConversationId[conversationId];
        }
      });
      if ((0, import_lodash.isEqual)(sendStateByConversationId, nextSendStateByConversationId)) {
        log.info("onStoryRecipientUpdate: sendStateByConversationId does not need update");
        return;
      }
      const message = window.MessageController.register(item.id, item);
      const sendStateConversationIds = new Set(Object.keys(nextSendStateByConversationId));
      if (sendStateConversationIds.size === 0 || sendStateConversationIds.size === 1 && sendStateConversationIds.has(ourConversationId)) {
        log.info("onStoryRecipientUpdate DOE", {
          messageId: (0, import_idForLogging.getMessageIdForLogging)(item),
          storyDistributionListId
        });
        const delAttributes = {
          fromId: ourConversationId,
          serverTimestamp: Number(item.serverTimestamp),
          targetSentTimestamp: item.timestamp
        };
        const doe = import_Deletes.Deletes.getSingleton().add(delAttributes);
        (0, import_deleteForEveryone.deleteForEveryone)(message, doe);
      } else {
        message.set({
          sendStateByConversationId: nextSendStateByConversationId
        });
        (0, import_messageBatcher.queueUpdateMessage)(message.attributes);
      }
    });
    window.Whisper.events.trigger("incrementProgress");
    confirm();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  onStoryRecipientUpdate
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib25TdG9yeVJlY2lwaWVudFVwZGF0ZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBpc0VxdWFsIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB0eXBlIHsgRGVsZXRlQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL0RlbGV0ZXMnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeVJlY2lwaWVudFVwZGF0ZUV2ZW50IH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9tZXNzYWdlUmVjZWl2ZXJFdmVudHMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IERlbGV0ZXMgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL0RlbGV0ZXMnO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgZGVsZXRlRm9yRXZlcnlvbmUgfSBmcm9tICcuL2RlbGV0ZUZvckV2ZXJ5b25lJztcbmltcG9ydCB7XG4gIGdldENvbnZlcnNhdGlvbklkRm9yTG9nZ2luZyxcbiAgZ2V0TWVzc2FnZUlkRm9yTG9nZ2luZyxcbn0gZnJvbSAnLi9pZEZvckxvZ2dpbmcnO1xuaW1wb3J0IHsgaXNTdG9yeSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9tZXNzYWdlJztcbmltcG9ydCB7IG5vcm1hbGl6ZVV1aWQgfSBmcm9tICcuL25vcm1hbGl6ZVV1aWQnO1xuaW1wb3J0IHsgcXVldWVVcGRhdGVNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlQmF0Y2hlcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvblN0b3J5UmVjaXBpZW50VXBkYXRlKFxuICBldmVudDogU3RvcnlSZWNpcGllbnRVcGRhdGVFdmVudFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgZGF0YSwgY29uZmlybSB9ID0gZXZlbnQ7XG5cbiAgY29uc3QgeyBkZXN0aW5hdGlvblV1aWQsIHRpbWVzdGFtcCB9ID0gZGF0YTtcblxuICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZGVzdGluYXRpb25VdWlkKTtcblxuICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldENvbnZlcnNhdGlvbiA9XG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0Q29udmVyc2F0aW9uRm9yVGFyZ2V0TWVzc2FnZShcbiAgICAgIGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgIHRpbWVzdGFtcFxuICAgICk7XG5cbiAgaWYgKCF0YXJnZXRDb252ZXJzYXRpb24pIHtcbiAgICBsb2cuaW5mbygnb25TdG9yeVJlY2lwaWVudFVwZGF0ZSAhdGFyZ2V0Q29udmVyc2F0aW9uJywge1xuICAgICAgZGVzdGluYXRpb25VdWlkLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGFyZ2V0Q29udmVyc2F0aW9uLnF1ZXVlSm9iKCdvblN0b3J5UmVjaXBpZW50VXBkYXRlJywgYXN5bmMgKCkgPT4ge1xuICAgIGxvZy5pbmZvKCdvblN0b3J5UmVjaXBpZW50VXBkYXRlIHVwZGF0aW5nJywgdGltZXN0YW1wKTtcblxuICAgIC8vIEJ1aWxkIHVwIHNvbWUgbWFwcyBmb3IgZmFzdC9lYXN5IGxvb2t1cHNcbiAgICBjb25zdCBpc0FsbG93ZWRUb1JlcGx5ID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgY29uc3QgY29udmVyc2F0aW9uSWRUb0Rpc3RyaWJ1dGlvbkxpc3RJZHMgPSBuZXcgTWFwPHN0cmluZywgU2V0PHN0cmluZz4+KCk7XG4gICAgZGF0YS5zdG9yeU1lc3NhZ2VSZWNpcGllbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb252byA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpdGVtLmRlc3RpbmF0aW9uVXVpZCk7XG5cbiAgICAgIGlmICghY29udm8gfHwgIWl0ZW0uZGlzdHJpYnV0aW9uTGlzdElkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnZlcnNhdGlvbklkVG9EaXN0cmlidXRpb25MaXN0SWRzLnNldChcbiAgICAgICAgY29udm8uaWQsXG4gICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgaXRlbS5kaXN0cmlidXRpb25MaXN0SWRzLm1hcCh1dWlkID0+XG4gICAgICAgICAgICBub3JtYWxpemVVdWlkKHV1aWQsICdvblN0b3J5UmVjaXBpZW50VXBkYXRlLmRpc3RyaWJ1dGlvbkxpc3RJZCcpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgaXNBbGxvd2VkVG9SZXBseS5zZXQoY29udm8uaWQsIGl0ZW0uaXNBbGxvd2VkVG9SZXBseSAhPT0gZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KCk7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldE1lc3NhZ2VzQnlTZW50QXQodGltZXN0YW1wKTtcblxuICAgIC8vIE5vdyB3ZSBmaWd1cmUgb3V0IHdobyBuZWVkcyB0byBiZSBhZGRlZCBhbmQgd2hvIG5lZWRzIHRvIHJlbW92ZWRcbiAgICBtZXNzYWdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKCFpc1N0b3J5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLCBzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZCB9ID0gaXRlbTtcblxuICAgICAgaWYgKCFzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkIHx8ICFzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5leHRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID0ge1xuICAgICAgICAuLi5zZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgfTtcblxuICAgICAgY29udmVyc2F0aW9uSWRUb0Rpc3RyaWJ1dGlvbkxpc3RJZHMuZm9yRWFjaChcbiAgICAgICAgKGRpc3RyaWJ1dGlvbkxpc3RJZHMsIGNvbnZlcnNhdGlvbklkKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzRGlzdHJpYnV0aW9uTGlzdElkID0gZGlzdHJpYnV0aW9uTGlzdElkcy5oYXMoXG4gICAgICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCByZWNpcGllbnQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkRm9yTG9nZ2luZyA9IHJlY2lwaWVudFxuICAgICAgICAgICAgPyBnZXRDb252ZXJzYXRpb25JZEZvckxvZ2dpbmcocmVjaXBpZW50LmF0dHJpYnV0ZXMpXG4gICAgICAgICAgICA6IGNvbnZlcnNhdGlvbklkO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaGFzRGlzdHJpYnV0aW9uTGlzdElkICYmXG4gICAgICAgICAgICAhc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZFtjb252ZXJzYXRpb25JZF1cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKCdvblN0b3J5UmVjaXBpZW50VXBkYXRlIGFkZGluZycsIHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbklkRm9yTG9nZ2luZyxcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiBnZXRNZXNzYWdlSWRGb3JMb2dnaW5nKGl0ZW0pLFxuICAgICAgICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV4dFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRbY29udmVyc2F0aW9uSWRdID0ge1xuICAgICAgICAgICAgICBpc0FsbG93ZWRUb1JlcGx5VG9TdG9yeTogQm9vbGVhbihcbiAgICAgICAgICAgICAgICBpc0FsbG93ZWRUb1JlcGx5LmdldChjb252ZXJzYXRpb25JZClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICAgIHVwZGF0ZWRBdDogbm93LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZFtjb252ZXJzYXRpb25JZF0gJiZcbiAgICAgICAgICAgICFoYXNEaXN0cmlidXRpb25MaXN0SWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKCdvblN0b3J5UmVjaXBpZW50VXBkYXRlIHJlbW92aW5nJywge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uSWRGb3JMb2dnaW5nLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IGdldE1lc3NhZ2VJZEZvckxvZ2dpbmcoaXRlbSksXG4gICAgICAgICAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdElkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWxldGUgbmV4dFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRbY29udmVyc2F0aW9uSWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgaWYgKGlzRXF1YWwoc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCwgbmV4dFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdvblN0b3J5UmVjaXBpZW50VXBkYXRlOiBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkIGRvZXMgbm90IG5lZWQgdXBkYXRlJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoaXRlbS5pZCwgaXRlbSk7XG5cbiAgICAgIGNvbnN0IHNlbmRTdGF0ZUNvbnZlcnNhdGlvbklkcyA9IG5ldyBTZXQoXG4gICAgICAgIE9iamVjdC5rZXlzKG5leHRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKVxuICAgICAgKTtcblxuICAgICAgaWYgKFxuICAgICAgICBzZW5kU3RhdGVDb252ZXJzYXRpb25JZHMuc2l6ZSA9PT0gMCB8fFxuICAgICAgICAoc2VuZFN0YXRlQ29udmVyc2F0aW9uSWRzLnNpemUgPT09IDEgJiZcbiAgICAgICAgICBzZW5kU3RhdGVDb252ZXJzYXRpb25JZHMuaGFzKG91ckNvbnZlcnNhdGlvbklkKSlcbiAgICAgICkge1xuICAgICAgICBsb2cuaW5mbygnb25TdG9yeVJlY2lwaWVudFVwZGF0ZSBET0UnLCB7XG4gICAgICAgICAgbWVzc2FnZUlkOiBnZXRNZXNzYWdlSWRGb3JMb2dnaW5nKGl0ZW0pLFxuICAgICAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdElkLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGVsQXR0cmlidXRlczogRGVsZXRlQXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICAgICAgZnJvbUlkOiBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgICAgICBzZXJ2ZXJUaW1lc3RhbXA6IE51bWJlcihpdGVtLnNlcnZlclRpbWVzdGFtcCksXG4gICAgICAgICAgdGFyZ2V0U2VudFRpbWVzdGFtcDogaXRlbS50aW1lc3RhbXAsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGRvZSA9IERlbGV0ZXMuZ2V0U2luZ2xldG9uKCkuYWRkKGRlbEF0dHJpYnV0ZXMpO1xuICAgICAgICAvLyBUaGVyZSBhcmUgbm8gbG9uZ2VyIGFueSByZW1haW5pbmcgbWVtYmVycyBmb3IgdGhpcyBtZXNzYWdlIHNvIGxldHNcbiAgICAgICAgLy8gcnVuIGl0IHRocm91Z2ggZGVsZXRlRm9yRXZlcnlvbmUgd2hpY2ggbWFya3MgdGhlIG1lc3NhZ2UgYXNcbiAgICAgICAgLy8gZGVsZXRlZEZvckV2ZXJ5b25lIGxvY2FsbHkuXG4gICAgICAgIGRlbGV0ZUZvckV2ZXJ5b25lKG1lc3NhZ2UsIGRvZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlLnNldCh7XG4gICAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDogbmV4dFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsXG4gICAgICAgIH0pO1xuICAgICAgICBxdWV1ZVVwZGF0ZU1lc3NhZ2UobWVzc2FnZS5hdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCdpbmNyZW1lbnRQcm9ncmVzcycpO1xuICAgIGNvbmZpcm0oKTtcbiAgfSk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXdCO0FBR3hCLFVBQXFCO0FBQ3JCLHFCQUF3QjtBQUN4Qiw4QkFBMkI7QUFDM0IsK0JBQWtDO0FBQ2xDLDBCQUdPO0FBQ1AscUJBQXdCO0FBQ3hCLDJCQUE4QjtBQUM5Qiw0QkFBbUM7QUFFbkMsc0NBQ0UsT0FDZTtBQUNmLFFBQU0sRUFBRSxNQUFNLFlBQVk7QUFFMUIsUUFBTSxFQUFFLGlCQUFpQixjQUFjO0FBRXZDLFFBQU0s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
