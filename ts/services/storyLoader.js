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
var storyLoader_exports = {};
__export(storyLoader_exports, {
  getStoriesForRedux: () => getStoriesForRedux,
  getStoryDataFromMessageAttributes: () => getStoryDataFromMessageAttributes,
  loadStories: () => loadStories
});
module.exports = __toCommonJS(storyLoader_exports);
var import_lodash = require("lodash");
var durations = __toESM(require("../util/durations"));
var log = __toESM(require("../logging/log"));
var import_Client = __toESM(require("../sql/Client"));
var import_message = require("../state/selectors/message");
var import_isNotNil = require("../util/isNotNil");
var import_assert = require("../util/assert");
let storyData;
async function loadStories() {
  storyData = await import_Client.default.getOlderStories({});
  await repairUnexpiredStories();
}
function getStoryDataFromMessageAttributes(message) {
  const { attachments, deletedForEveryone } = message;
  const unresolvedAttachment = attachments ? attachments[0] : void 0;
  if (!unresolvedAttachment && !deletedForEveryone) {
    log.warn(`getStoryDataFromMessageAttributes: ${message.id} does not have an attachment`);
    return;
  }
  const [attachment] = unresolvedAttachment && unresolvedAttachment.path ? (0, import_message.getAttachmentsForMessage)(message) : [unresolvedAttachment];
  return {
    attachment,
    messageId: message.id,
    ...(0, import_lodash.pick)(message, [
      "canReplyToStory",
      "conversationId",
      "deletedForEveryone",
      "reactions",
      "readStatus",
      "sendStateByConversationId",
      "source",
      "sourceUuid",
      "storyDistributionListId",
      "timestamp",
      "type"
    ])
  };
}
function getStoriesForRedux() {
  (0, import_assert.strictAssert)(storyData, "storyData has not been loaded");
  const stories = storyData.map(getStoryDataFromMessageAttributes).filter(import_isNotNil.isNotNil);
  storyData = void 0;
  return stories;
}
async function repairUnexpiredStories() {
  (0, import_assert.strictAssert)(storyData, "Could not load stories");
  const DAY_AS_SECONDS = durations.DAY / 1e3;
  const storiesWithExpiry = storyData.filter((story) => !story.expirationStartTimestamp || !story.expireTimer || story.expireTimer > DAY_AS_SECONDS).map((story) => ({
    ...story,
    expirationStartTimestamp: Math.min(story.serverTimestamp || story.timestamp, Date.now()),
    expireTimer: Math.min(Math.floor((story.timestamp + durations.DAY - Date.now()) / 1e3), DAY_AS_SECONDS)
  }));
  if (!storiesWithExpiry.length) {
    return;
  }
  log.info("repairUnexpiredStories: repairing number of stories", storiesWithExpiry.length);
  await Promise.all(storiesWithExpiry.map((messageAttributes) => {
    return window.Signal.Data.saveMessage(messageAttributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStoriesForRedux,
  getStoryDataFromMessageAttributes,
  loadStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcnlMb2FkZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeURhdGFUeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3Mvc3Rvcmllcyc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCBkYXRhSW50ZXJmYWNlIGZyb20gJy4uL3NxbC9DbGllbnQnO1xuaW1wb3J0IHsgZ2V0QXR0YWNobWVudHNGb3JNZXNzYWdlIH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL21lc3NhZ2UnO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuLi91dGlsL2lzTm90TmlsJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxubGV0IHN0b3J5RGF0YTogQXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRTdG9yaWVzKCk6IFByb21pc2U8dm9pZD4ge1xuICBzdG9yeURhdGEgPSBhd2FpdCBkYXRhSW50ZXJmYWNlLmdldE9sZGVyU3Rvcmllcyh7fSk7XG4gIGF3YWl0IHJlcGFpclVuZXhwaXJlZFN0b3JpZXMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0b3J5RGF0YUZyb21NZXNzYWdlQXR0cmlidXRlcyhcbiAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlXG4pOiBTdG9yeURhdGFUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgeyBhdHRhY2htZW50cywgZGVsZXRlZEZvckV2ZXJ5b25lIH0gPSBtZXNzYWdlO1xuICBjb25zdCB1bnJlc29sdmVkQXR0YWNobWVudCA9IGF0dGFjaG1lbnRzID8gYXR0YWNobWVudHNbMF0gOiB1bmRlZmluZWQ7XG4gIGlmICghdW5yZXNvbHZlZEF0dGFjaG1lbnQgJiYgIWRlbGV0ZWRGb3JFdmVyeW9uZSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGdldFN0b3J5RGF0YUZyb21NZXNzYWdlQXR0cmlidXRlczogJHttZXNzYWdlLmlkfSBkb2VzIG5vdCBoYXZlIGFuIGF0dGFjaG1lbnRgXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBbYXR0YWNobWVudF0gPVxuICAgIHVucmVzb2x2ZWRBdHRhY2htZW50ICYmIHVucmVzb2x2ZWRBdHRhY2htZW50LnBhdGhcbiAgICAgID8gZ2V0QXR0YWNobWVudHNGb3JNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICA6IFt1bnJlc29sdmVkQXR0YWNobWVudF07XG5cbiAgcmV0dXJuIHtcbiAgICBhdHRhY2htZW50LFxuICAgIG1lc3NhZ2VJZDogbWVzc2FnZS5pZCxcbiAgICAuLi5waWNrKG1lc3NhZ2UsIFtcbiAgICAgICdjYW5SZXBseVRvU3RvcnknLFxuICAgICAgJ2NvbnZlcnNhdGlvbklkJyxcbiAgICAgICdkZWxldGVkRm9yRXZlcnlvbmUnLFxuICAgICAgJ3JlYWN0aW9ucycsXG4gICAgICAncmVhZFN0YXR1cycsXG4gICAgICAnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcsXG4gICAgICAnc291cmNlJyxcbiAgICAgICdzb3VyY2VVdWlkJyxcbiAgICAgICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZCcsXG4gICAgICAndGltZXN0YW1wJyxcbiAgICAgICd0eXBlJyxcbiAgICBdKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0b3JpZXNGb3JSZWR1eCgpOiBBcnJheTxTdG9yeURhdGFUeXBlPiB7XG4gIHN0cmljdEFzc2VydChzdG9yeURhdGEsICdzdG9yeURhdGEgaGFzIG5vdCBiZWVuIGxvYWRlZCcpO1xuXG4gIGNvbnN0IHN0b3JpZXMgPSBzdG9yeURhdGFcbiAgICAubWFwKGdldFN0b3J5RGF0YUZyb21NZXNzYWdlQXR0cmlidXRlcylcbiAgICAuZmlsdGVyKGlzTm90TmlsKTtcblxuICBzdG9yeURhdGEgPSB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHN0b3JpZXM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlcGFpclVuZXhwaXJlZFN0b3JpZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHN0cmljdEFzc2VydChzdG9yeURhdGEsICdDb3VsZCBub3QgbG9hZCBzdG9yaWVzJyk7XG5cbiAgY29uc3QgREFZX0FTX1NFQ09ORFMgPSBkdXJhdGlvbnMuREFZIC8gMTAwMDtcblxuICBjb25zdCBzdG9yaWVzV2l0aEV4cGlyeSA9IHN0b3J5RGF0YVxuICAgIC5maWx0ZXIoXG4gICAgICBzdG9yeSA9PlxuICAgICAgICAhc3RvcnkuZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wIHx8XG4gICAgICAgICFzdG9yeS5leHBpcmVUaW1lciB8fFxuICAgICAgICBzdG9yeS5leHBpcmVUaW1lciA+IERBWV9BU19TRUNPTkRTXG4gICAgKVxuICAgIC5tYXAoc3RvcnkgPT4gKHtcbiAgICAgIC4uLnN0b3J5LFxuICAgICAgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wOiBNYXRoLm1pbihcbiAgICAgICAgc3Rvcnkuc2VydmVyVGltZXN0YW1wIHx8IHN0b3J5LnRpbWVzdGFtcCxcbiAgICAgICAgRGF0ZS5ub3coKVxuICAgICAgKSxcbiAgICAgIGV4cGlyZVRpbWVyOiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5mbG9vcigoc3RvcnkudGltZXN0YW1wICsgZHVyYXRpb25zLkRBWSAtIERhdGUubm93KCkpIC8gMTAwMCksXG4gICAgICAgIERBWV9BU19TRUNPTkRTXG4gICAgICApLFxuICAgIH0pKTtcblxuICBpZiAoIXN0b3JpZXNXaXRoRXhwaXJ5Lmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZy5pbmZvKFxuICAgICdyZXBhaXJVbmV4cGlyZWRTdG9yaWVzOiByZXBhaXJpbmcgbnVtYmVyIG9mIHN0b3JpZXMnLFxuICAgIHN0b3JpZXNXaXRoRXhwaXJ5Lmxlbmd0aFxuICApO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIHN0b3JpZXNXaXRoRXhwaXJ5Lm1hcChtZXNzYWdlQXR0cmlidXRlcyA9PiB7XG4gICAgICByZXR1cm4gd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2VBdHRyaWJ1dGVzLCB7XG4gICAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICB9KVxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBcUI7QUFHckIsZ0JBQTJCO0FBQzNCLFVBQXFCO0FBQ3JCLG9CQUEwQjtBQUMxQixxQkFBeUM7QUFDekMsc0JBQXlCO0FBQ3pCLG9CQUE2QjtBQUU3QixJQUFJO0FBRUosNkJBQW1EO0FBQ2pELGNBQVksTUFBTSxzQkFBYyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sdUJBQXVCO0FBQy9CO0FBSHNCLEFBS2YsMkNBQ0wsU0FDMkI7QUFDM0IsUUFBTSxFQUFFLGFBQWEsdUJBQXVCO0FBQzVDLFFBQU0sdUJBQXVCLGNBQWMsWUFBWSxLQUFLO0FBQzVELE1BQUksQ0FBQyx3QkFBd0IsQ0FBQyxvQkFBb0I7QUFDaEQsUUFBSSxLQUNGLHNDQUFzQyxRQUFRLGdDQUNoRDtBQUNBO0FBQUEsRUFDRjtBQUVBLFFBQU0sQ0FBQyxjQUNMLHdCQUF3QixxQkFBcUIsT0FDekMsNkNBQXlCLE9BQU8sSUFDaEMsQ0FBQyxvQkFBb0I7QUFFM0IsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLFdBQVcsUUFBUTtBQUFBLE9BQ2hCLHdCQUFLLFNBQVM7QUFBQSxNQUNmO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQWxDZ0IsQUFvQ1QsOEJBQW9EO0FBQ3pELGtDQUFhLFdBQVcsK0JBQStCO0FBRXZELFFBQU0sVUFBVSxVQUNiLElBQUksaUNBQWlDLEVBQ3JDLE9BQU8sd0JBQVE7QUFFbEIsY0FBWTtBQUVaLFNBQU87QUFDVDtBQVZnQixBQVloQix3Q0FBdUQ7QUFDckQsa0NBQWEsV0FBVyx3QkFBd0I7QUFFaEQsUUFBTSxpQkFBaUIsVUFBVSxNQUFNO0FBRXZDLFFBQU0sb0JBQW9CLFVBQ3ZCLE9BQ0MsV0FDRSxDQUFDLE1BQU0sNEJBQ1AsQ0FBQyxNQUFNLGVBQ1AsTUFBTSxjQUFjLGNBQ3hCLEVBQ0MsSUFBSSxXQUFVO0FBQUEsT0FDVjtBQUFBLElBQ0gsMEJBQTBCLEtBQUssSUFDN0IsTUFBTSxtQkFBbUIsTUFBTSxXQUMvQixLQUFLLElBQUksQ0FDWDtBQUFBLElBQ0EsYUFBYSxLQUFLLElBQ2hCLEtBQUssTUFBTyxPQUFNLFlBQVksVUFBVSxNQUFNLEtBQUssSUFBSSxLQUFLLEdBQUksR0FDaEUsY0FDRjtBQUFBLEVBQ0YsRUFBRTtBQUVKLE1BQUksQ0FBQyxrQkFBa0IsUUFBUTtBQUM3QjtBQUFBLEVBQ0Y7QUFFQSxNQUFJLEtBQ0YsdURBQ0Esa0JBQWtCLE1BQ3BCO0FBRUEsUUFBTSxRQUFRLElBQ1osa0JBQWtCLElBQUksdUJBQXFCO0FBQ3pDLFdBQU8sT0FBTyxPQUFPLEtBQUssWUFBWSxtQkFBbUI7QUFBQSxNQUN2RCxTQUFTLE9BQU8sV0FBVyxRQUFRLEtBQUssZUFBZSxFQUFFLFNBQVM7QUFBQSxJQUNwRSxDQUFDO0FBQUEsRUFDSCxDQUFDLENBQ0g7QUFDRjtBQXhDZSIsCiAgIm5hbWVzIjogW10KfQo=
