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
var findStoryMessage_exports = {};
__export(findStoryMessage_exports, {
  findStoryMessage: () => findStoryMessage
});
module.exports = __toCommonJS(findStoryMessage_exports);
var log = __toESM(require("../logging/log"));
var import_iterables = require("./iterables");
var import_helpers = require("../messages/helpers");
var import_timestampLongUtils = require("./timestampLongUtils");
async function findStoryMessage(conversationId, storyContext) {
  if (!storyContext) {
    return;
  }
  const { authorUuid, sentTimestamp } = storyContext;
  if (!authorUuid || !sentTimestamp) {
    return;
  }
  const sentAt = (0, import_timestampLongUtils.getTimestampFromLong)(sentTimestamp);
  const ourConversationId = window.ConversationController.getOurConversationIdOrThrow();
  const inMemoryMessages = window.MessageController.filterBySentAt(sentAt);
  const matchingMessage = (0, import_iterables.find)(inMemoryMessages, (item) => isStoryAMatch(item.attributes, conversationId, ourConversationId, authorUuid, sentAt));
  if (matchingMessage) {
    return matchingMessage;
  }
  log.info("findStoryMessage: db lookup needed", sentAt);
  const messages = await window.Signal.Data.getMessagesBySentAt(sentAt);
  const found = messages.find((item) => isStoryAMatch(item, conversationId, ourConversationId, authorUuid, sentAt));
  if (!found) {
    log.info("findStoryMessage: message not found", sentAt);
    return;
  }
  const message = window.MessageController.register(found.id, found);
  return message;
}
function isStoryAMatch(message, conversationId, ourConversationId, authorUuid, sentTimestamp) {
  if (!message) {
    return false;
  }
  const authorConversation = window.ConversationController.lookupOrCreate({
    e164: void 0,
    uuid: authorUuid
  });
  return message.sent_at === sentTimestamp && (0, import_helpers.getContactId)(message) === authorConversation?.id && (message.conversationId === conversationId || message.conversationId === ourConversationId);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findStoryMessage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZmluZFN0b3J5TWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvbWVzc2FnZXMnO1xuaW1wb3J0IHR5cGUgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IGZpbmQgfSBmcm9tICcuL2l0ZXJhYmxlcyc7XG5pbXBvcnQgeyBnZXRDb250YWN0SWQgfSBmcm9tICcuLi9tZXNzYWdlcy9oZWxwZXJzJztcbmltcG9ydCB7IGdldFRpbWVzdGFtcEZyb21Mb25nIH0gZnJvbSAnLi90aW1lc3RhbXBMb25nVXRpbHMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZFN0b3J5TWVzc2FnZShcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc3RvcnlDb250ZXh0PzogUHJvdG8uRGF0YU1lc3NhZ2UuSVN0b3J5Q29udGV4dFxuKTogUHJvbWlzZTxNZXNzYWdlTW9kZWwgfCB1bmRlZmluZWQ+IHtcbiAgaWYgKCFzdG9yeUNvbnRleHQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IGF1dGhvclV1aWQsIHNlbnRUaW1lc3RhbXAgfSA9IHN0b3J5Q29udGV4dDtcblxuICBpZiAoIWF1dGhvclV1aWQgfHwgIXNlbnRUaW1lc3RhbXApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzZW50QXQgPSBnZXRUaW1lc3RhbXBGcm9tTG9uZyhzZW50VGltZXN0YW1wKTtcbiAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpO1xuXG4gIGNvbnN0IGluTWVtb3J5TWVzc2FnZXMgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIuZmlsdGVyQnlTZW50QXQoc2VudEF0KTtcbiAgY29uc3QgbWF0Y2hpbmdNZXNzYWdlID0gZmluZChpbk1lbW9yeU1lc3NhZ2VzLCBpdGVtID0+XG4gICAgaXNTdG9yeUFNYXRjaChcbiAgICAgIGl0ZW0uYXR0cmlidXRlcyxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgb3VyQ29udmVyc2F0aW9uSWQsXG4gICAgICBhdXRob3JVdWlkLFxuICAgICAgc2VudEF0XG4gICAgKVxuICApO1xuXG4gIGlmIChtYXRjaGluZ01lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWF0Y2hpbmdNZXNzYWdlO1xuICB9XG5cbiAgbG9nLmluZm8oJ2ZpbmRTdG9yeU1lc3NhZ2U6IGRiIGxvb2t1cCBuZWVkZWQnLCBzZW50QXQpO1xuICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRNZXNzYWdlc0J5U2VudEF0KHNlbnRBdCk7XG4gIGNvbnN0IGZvdW5kID0gbWVzc2FnZXMuZmluZChpdGVtID0+XG4gICAgaXNTdG9yeUFNYXRjaChpdGVtLCBjb252ZXJzYXRpb25JZCwgb3VyQ29udmVyc2F0aW9uSWQsIGF1dGhvclV1aWQsIHNlbnRBdClcbiAgKTtcblxuICBpZiAoIWZvdW5kKSB7XG4gICAgbG9nLmluZm8oJ2ZpbmRTdG9yeU1lc3NhZ2U6IG1lc3NhZ2Ugbm90IGZvdW5kJywgc2VudEF0KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKGZvdW5kLmlkLCBmb3VuZCk7XG4gIHJldHVybiBtZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBpc1N0b3J5QU1hdGNoKFxuICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBhdXRob3JVdWlkOiBzdHJpbmcsXG4gIHNlbnRUaW1lc3RhbXA6IG51bWJlclxuKTogbWVzc2FnZSBpcyBNZXNzYWdlQXR0cmlidXRlc1R5cGUge1xuICBpZiAoIW1lc3NhZ2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBhdXRob3JDb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgZTE2NDogdW5kZWZpbmVkLFxuICAgIHV1aWQ6IGF1dGhvclV1aWQsXG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgbWVzc2FnZS5zZW50X2F0ID09PSBzZW50VGltZXN0YW1wICYmXG4gICAgZ2V0Q29udGFjdElkKG1lc3NhZ2UpID09PSBhdXRob3JDb252ZXJzYXRpb24/LmlkICYmXG4gICAgKG1lc3NhZ2UuY29udmVyc2F0aW9uSWQgPT09IGNvbnZlcnNhdGlvbklkIHx8XG4gICAgICBtZXNzYWdlLmNvbnZlcnNhdGlvbklkID09PSBvdXJDb252ZXJzYXRpb25JZClcbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQSxVQUFxQjtBQUNyQix1QkFBcUI7QUFDckIscUJBQTZCO0FBQzdCLGdDQUFxQztBQUVyQyxnQ0FDRSxnQkFDQSxjQUNtQztBQUNuQyxNQUFJLENBQUMsY0FBYztBQUNqQjtBQUFBLEVBQ0Y7QUFFQSxRQUFNLEVBQUUsWUFBWSxrQkFBa0I7QUFFdEMsTUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlO0FBQ2pDO0FBQUEsRUFDRjtBQUVBLFFBQU0sU0FBUyxvREFBcUIsYUFBYTtBQUNqRCxRQUFNLG9CQUNKLE9BQU8sdUJBQXVCLDRCQUE0QjtBQUU1RCxRQUFNLG1CQUFtQixPQUFPLGtCQUFrQixlQUFlLE1BQU07QUFDdkUsUUFBTSxrQkFBa0IsMkJBQUssa0JBQWtCLFVBQzdDLGNBQ0UsS0FBSyxZQUNMLGdCQUNBLG1CQUNBLFlBQ0EsTUFDRixDQUNGO0FBRUEsTUFBSSxpQkFBaUI7QUFDbkIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFJLEtBQUssc0NBQXNDLE1BQU07QUFDckQsUUFBTSxXQUFXLE1BQU0sT0FBTyxPQUFPLEtBQUssb0JBQW9CLE1BQU07QUFDcEUsUUFBTSxRQUFRLFNBQVMsS0FBSyxVQUMxQixjQUFjLE1BQU0sZ0JBQWdCLG1CQUFtQixZQUFZLE1BQU0sQ0FDM0U7QUFFQSxNQUFJLENBQUMsT0FBTztBQUNWLFFBQUksS0FBSyx1Q0FBdUMsTUFBTTtBQUN0RDtBQUFBLEVBQ0Y7QUFFQSxRQUFNLFVBQVUsT0FBTyxrQkFBa0IsU0FBUyxNQUFNLElBQUksS0FBSztBQUNqRSxTQUFPO0FBQ1Q7QUE5Q3NCLEFBZ0R0Qix1QkFDRSxTQUNBLGdCQUNBLG1CQUNBLFlBQ0EsZUFDa0M7QUFDbEMsTUFBSSxDQUFDLFNBQVM7QUFDWixXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0scUJBQXFCLE9BQU8sdUJBQXVCLGVBQWU7QUFBQSxJQUN0RSxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUixDQUFDO0FBRUQsU0FDRSxRQUFRLFlBQVksaUJBQ3BCLGlDQUFhLE9BQU8sTUFBTSxvQkFBb0IsTUFDN0MsU0FBUSxtQkFBbUIsa0JBQzFCLFFBQVEsbUJBQW1CO0FBRWpDO0FBdEJTIiwKICAibmFtZXMiOiBbXQp9Cg==
