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
var helpers_exports = {};
__export(helpers_exports, {
  getContact: () => getContact,
  getContactId: () => getContactId,
  getSource: () => getSource,
  getSourceDevice: () => getSourceDevice,
  getSourceUuid: () => getSourceUuid,
  isCustomError: () => isCustomError,
  isIncoming: () => isIncoming,
  isOutgoing: () => isOutgoing,
  isQuoteAMatch: () => isQuoteAMatch,
  isStory: () => isStory
});
module.exports = __toCommonJS(helpers_exports);
var log = __toESM(require("../logging/log"));
function isIncoming(message) {
  return message.type === "incoming";
}
function isOutgoing(message) {
  return message.type === "outgoing";
}
function isStory(message) {
  return message.type === "story";
}
function isQuoteAMatch(message, conversationId, quote) {
  if (!message) {
    return false;
  }
  const { authorUuid, id } = quote;
  const authorConversation = window.ConversationController.lookupOrCreate({
    e164: "author" in quote ? quote.author : void 0,
    uuid: authorUuid
  });
  return message.sent_at === id && message.conversationId === conversationId && getContactId(message) === authorConversation?.id;
}
function getContactId(message) {
  const source = getSource(message);
  const sourceUuid = getSourceUuid(message);
  if (!source && !sourceUuid) {
    return window.ConversationController.getOurConversationId();
  }
  const conversation = window.ConversationController.lookupOrCreate({
    e164: source,
    uuid: sourceUuid
  });
  return conversation?.id;
}
function getContact(message) {
  const id = getContactId(message);
  return window.ConversationController.get(id);
}
function getSource(message) {
  if (isIncoming(message) || isStory(message)) {
    return message.source;
  }
  if (!isOutgoing(message)) {
    log.warn("Message.getSource: Called for non-incoming/non-outgoing message");
  }
  return window.textsecure.storage.user.getNumber();
}
function getSourceDevice(message) {
  const { sourceDevice } = message;
  if (isIncoming(message) || isStory(message)) {
    return sourceDevice;
  }
  if (!isOutgoing(message)) {
    log.warn("Message.getSourceDevice: Called for non-incoming/non-outgoing message");
  }
  return sourceDevice || window.textsecure.storage.user.getDeviceId();
}
function getSourceUuid(message) {
  if (isIncoming(message) || isStory(message)) {
    return message.sourceUuid;
  }
  if (!isOutgoing(message)) {
    log.warn("Message.getSourceUuid: Called for non-incoming/non-outgoing message");
  }
  return window.textsecure.storage.user.getUuid()?.toString();
}
const isCustomError = /* @__PURE__ */ __name((e) => e instanceof Error, "isCustomError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getContact,
  getContactId,
  getSource,
  getSourceDevice,
  getSourceUuid,
  isCustomError,
  isIncoming,
  isOutgoing,
  isQuoteAMatch,
  isStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaGVscGVycy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHtcbiAgQ3VzdG9tRXJyb3IsXG4gIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgUXVvdGVkTWVzc2FnZVR5cGUsXG59IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJbmNvbWluZyhcbiAgbWVzc2FnZTogUGljazxNZXNzYWdlQXR0cmlidXRlc1R5cGUsICd0eXBlJz5cbik6IGJvb2xlYW4ge1xuICByZXR1cm4gbWVzc2FnZS50eXBlID09PSAnaW5jb21pbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPdXRnb2luZyhcbiAgbWVzc2FnZTogUGljazxNZXNzYWdlQXR0cmlidXRlc1R5cGUsICd0eXBlJz5cbik6IGJvb2xlYW4ge1xuICByZXR1cm4gbWVzc2FnZS50eXBlID09PSAnb3V0Z29pbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdG9yeShtZXNzYWdlOiBQaWNrPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSwgJ3R5cGUnPik6IGJvb2xlYW4ge1xuICByZXR1cm4gbWVzc2FnZS50eXBlID09PSAnc3RvcnknO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNRdW90ZUFNYXRjaChcbiAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgcXVvdGU6IFF1b3RlZE1lc3NhZ2VUeXBlXG4pOiBtZXNzYWdlIGlzIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSB7XG4gIGlmICghbWVzc2FnZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHsgYXV0aG9yVXVpZCwgaWQgfSA9IHF1b3RlO1xuICBjb25zdCBhdXRob3JDb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgZTE2NDogJ2F1dGhvcicgaW4gcXVvdGUgPyBxdW90ZS5hdXRob3IgOiB1bmRlZmluZWQsXG4gICAgdXVpZDogYXV0aG9yVXVpZCxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICBtZXNzYWdlLnNlbnRfYXQgPT09IGlkICYmXG4gICAgbWVzc2FnZS5jb252ZXJzYXRpb25JZCA9PT0gY29udmVyc2F0aW9uSWQgJiZcbiAgICBnZXRDb250YWN0SWQobWVzc2FnZSkgPT09IGF1dGhvckNvbnZlcnNhdGlvbj8uaWRcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRhY3RJZChcbiAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBzb3VyY2UgPSBnZXRTb3VyY2UobWVzc2FnZSk7XG4gIGNvbnN0IHNvdXJjZVV1aWQgPSBnZXRTb3VyY2VVdWlkKG1lc3NhZ2UpO1xuXG4gIGlmICghc291cmNlICYmICFzb3VyY2VVdWlkKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkKCk7XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgZTE2NDogc291cmNlLFxuICAgIHV1aWQ6IHNvdXJjZVV1aWQsXG4gIH0pO1xuICByZXR1cm4gY29udmVyc2F0aW9uPy5pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRhY3QoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVxuKTogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQge1xuICBjb25zdCBpZCA9IGdldENvbnRhY3RJZChtZXNzYWdlKTtcbiAgcmV0dXJuIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3VyY2UobWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGlzSW5jb21pbmcobWVzc2FnZSkgfHwgaXNTdG9yeShtZXNzYWdlKSkge1xuICAgIHJldHVybiBtZXNzYWdlLnNvdXJjZTtcbiAgfVxuICBpZiAoIWlzT3V0Z29pbmcobWVzc2FnZSkpIHtcbiAgICBsb2cud2FybignTWVzc2FnZS5nZXRTb3VyY2U6IENhbGxlZCBmb3Igbm9uLWluY29taW5nL25vbi1vdXRnb2luZyBtZXNzYWdlJyk7XG4gIH1cblxuICByZXR1cm4gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlRGV2aWNlKFxuICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGVcbik6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgc291cmNlRGV2aWNlIH0gPSBtZXNzYWdlO1xuXG4gIGlmIChpc0luY29taW5nKG1lc3NhZ2UpIHx8IGlzU3RvcnkobWVzc2FnZSkpIHtcbiAgICByZXR1cm4gc291cmNlRGV2aWNlO1xuICB9XG4gIGlmICghaXNPdXRnb2luZyhtZXNzYWdlKSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgJ01lc3NhZ2UuZ2V0U291cmNlRGV2aWNlOiBDYWxsZWQgZm9yIG5vbi1pbmNvbWluZy9ub24tb3V0Z29pbmcgbWVzc2FnZSdcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHNvdXJjZURldmljZSB8fCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZVV1aWQoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVxuKTogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQge1xuICBpZiAoaXNJbmNvbWluZyhtZXNzYWdlKSB8fCBpc1N0b3J5KG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2Uuc291cmNlVXVpZDtcbiAgfVxuICBpZiAoIWlzT3V0Z29pbmcobWVzc2FnZSkpIHtcbiAgICBsb2cud2FybihcbiAgICAgICdNZXNzYWdlLmdldFNvdXJjZVV1aWQ6IENhbGxlZCBmb3Igbm9uLWluY29taW5nL25vbi1vdXRnb2luZyBtZXNzYWdlJ1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKT8udG9TdHJpbmcoKTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzQ3VzdG9tRXJyb3IgPSAoZTogdW5rbm93bik6IGUgaXMgQ3VzdG9tRXJyb3IgPT5cbiAgZSBpbnN0YW5jZW9mIEVycm9yO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLFVBQXFCO0FBU2Qsb0JBQ0wsU0FDUztBQUNULFNBQU8sUUFBUSxTQUFTO0FBQzFCO0FBSmdCLEFBTVQsb0JBQ0wsU0FDUztBQUNULFNBQU8sUUFBUSxTQUFTO0FBQzFCO0FBSmdCLEFBTVQsaUJBQWlCLFNBQXVEO0FBQzdFLFNBQU8sUUFBUSxTQUFTO0FBQzFCO0FBRmdCLEFBSVQsdUJBQ0wsU0FDQSxnQkFDQSxPQUNrQztBQUNsQyxNQUFJLENBQUMsU0FBUztBQUNaLFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxFQUFFLFlBQVksT0FBTztBQUMzQixRQUFNLHFCQUFxQixPQUFPLHVCQUF1QixlQUFlO0FBQUEsSUFDdEUsTUFBTSxZQUFZLFFBQVEsTUFBTSxTQUFTO0FBQUEsSUFDekMsTUFBTTtBQUFBLEVBQ1IsQ0FBQztBQUVELFNBQ0UsUUFBUSxZQUFZLE1BQ3BCLFFBQVEsbUJBQW1CLGtCQUMzQixhQUFhLE9BQU8sTUFBTSxvQkFBb0I7QUFFbEQ7QUFwQmdCLEFBc0JULHNCQUNMLFNBQ29CO0FBQ3BCLFFBQU0sU0FBUyxVQUFVLE9BQU87QUFDaEMsUUFBTSxhQUFhLGNBQWMsT0FBTztBQUV4QyxNQUFJLENBQUMsVUFBVSxDQUFDLFlBQVk7QUFDMUIsV0FBTyxPQUFPLHVCQUF1QixxQkFBcUI7QUFBQSxFQUM1RDtBQUVBLFFBQU0sZUFBZSxPQUFPLHVCQUF1QixlQUFlO0FBQUEsSUFDaEUsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1IsQ0FBQztBQUNELFNBQU8sY0FBYztBQUN2QjtBQWZnQixBQWlCVCxvQkFDTCxTQUMrQjtBQUMvQixRQUFNLEtBQUssYUFBYSxPQUFPO0FBQy9CLFNBQU8sT0FBTyx1QkFBdUIsSUFBSSxFQUFFO0FBQzdDO0FBTGdCLEFBT1QsbUJBQW1CLFNBQW9EO0FBQzVFLE1BQUksV0FBVyxPQUFPLEtBQUssUUFBUSxPQUFPLEdBQUc7QUFDM0MsV0FBTyxRQUFRO0FBQUEsRUFDakI7QUFDQSxNQUFJLENBQUMsV0FBVyxPQUFPLEdBQUc7QUFDeEIsUUFBSSxLQUFLLGlFQUFpRTtBQUFBLEVBQzVFO0FBRUEsU0FBTyxPQUFPLFdBQVcsUUFBUSxLQUFLLFVBQVU7QUFDbEQ7QUFUZ0IsQUFXVCx5QkFDTCxTQUM2QjtBQUM3QixRQUFNLEVBQUUsaUJBQWlCO0FBRXpCLE1BQUksV0FBVyxPQUFPLEtBQUssUUFBUSxPQUFPLEdBQUc7QUFDM0MsV0FBTztBQUFBLEVBQ1Q7QUFDQSxNQUFJLENBQUMsV0FBVyxPQUFPLEdBQUc7QUFDeEIsUUFBSSxLQUNGLHVFQUNGO0FBQUEsRUFDRjtBQUVBLFNBQU8sZ0JBQWdCLE9BQU8sV0FBVyxRQUFRLEtBQUssWUFBWTtBQUNwRTtBQWZnQixBQWlCVCx1QkFDTCxTQUM0QjtBQUM1QixNQUFJLFdBQVcsT0FBTyxLQUFLLFFBQVEsT0FBTyxHQUFHO0FBQzNDLFdBQU8sUUFBUTtBQUFBLEVBQ2pCO0FBQ0EsTUFBSSxDQUFDLFdBQVcsT0FBTyxHQUFHO0FBQ3hCLFFBQUksS0FDRixxRUFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUFPLE9BQU8sV0FBVyxRQUFRLEtBQUssUUFBUSxHQUFHLFNBQVM7QUFDNUQ7QUFiZ0IsQUFlVCxNQUFNLGdCQUFnQix3QkFBQyxNQUM1QixhQUFhLE9BRGM7IiwKICAibmFtZXMiOiBbXQp9Cg==
