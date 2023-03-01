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
var getFakeStory_exports = {};
__export(getFakeStory_exports, {
  getFakeMyStory: () => getFakeMyStory,
  getFakeStory: () => getFakeStory,
  getFakeStoryView: () => getFakeStoryView
});
module.exports = __toCommonJS(getFakeStory_exports);
var import_casual = __toESM(require("casual"));
var durations = __toESM(require("../../util/durations"));
var import_UUID = require("../../types/UUID");
var import_getDefaultConversation = require("./getDefaultConversation");
var import_fakeAttachment = require("./fakeAttachment");
var import_Stories = require("../../types/Stories");
function getAttachmentWithThumbnail(url) {
  return (0, import_fakeAttachment.fakeAttachment)({
    url,
    thumbnail: (0, import_fakeAttachment.fakeThumbnail)(url)
  });
}
function getFakeMyStory(id, name) {
  const storyCount = import_casual.default.integer(2, 6);
  return {
    id: id || import_UUID.UUID.generate().toString(),
    name: name || id === import_Stories.MY_STORIES_ID ? "My Stories" : import_casual.default.catch_phrase,
    stories: Array.from(Array(storyCount), () => ({
      ...getFakeStoryView(),
      sendState: [],
      views: import_casual.default.integer(1, 20)
    }))
  };
}
function getFakeStoryView(attachmentUrl, timestamp) {
  const sender = (0, import_getDefaultConversation.getDefaultConversation)();
  return {
    attachment: getAttachmentWithThumbnail(attachmentUrl || "/fixtures/tina-rolf-269345-unsplash.jpg"),
    hasReplies: Boolean(import_casual.default.coin_flip),
    isUnread: Boolean(import_casual.default.coin_flip),
    messageId: import_UUID.UUID.generate().toString(),
    sender,
    timestamp: timestamp || Date.now() - 2 * durations.MINUTE
  };
}
function getFakeStory({
  attachmentUrl,
  group,
  timestamp
}) {
  const storyView = getFakeStoryView(attachmentUrl, timestamp);
  return {
    conversationId: storyView.sender.id,
    group,
    storyView
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFakeMyStory,
  getFakeStory,
  getFakeStoryView
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0RmFrZVN0b3J5LnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgY2FzdWFsIGZyb20gJ2Nhc3VhbCc7XG5cbmltcG9ydCB0eXBlIHsgQXR0YWNobWVudFR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25TdG9yeVR5cGUsXG4gIE15U3RvcnlUeXBlLFxuICBTdG9yeVZpZXdUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcy9TdG9yaWVzJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi9nZXREZWZhdWx0Q29udmVyc2F0aW9uJztcbmltcG9ydCB7IGZha2VBdHRhY2htZW50LCBmYWtlVGh1bWJuYWlsIH0gZnJvbSAnLi9mYWtlQXR0YWNobWVudCc7XG5pbXBvcnQgeyBNWV9TVE9SSUVTX0lEIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5cbmZ1bmN0aW9uIGdldEF0dGFjaG1lbnRXaXRoVGh1bWJuYWlsKHVybDogc3RyaW5nKTogQXR0YWNobWVudFR5cGUge1xuICByZXR1cm4gZmFrZUF0dGFjaG1lbnQoe1xuICAgIHVybCxcbiAgICB0aHVtYm5haWw6IGZha2VUaHVtYm5haWwodXJsKSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGYWtlTXlTdG9yeShpZD86IHN0cmluZywgbmFtZT86IHN0cmluZyk6IE15U3RvcnlUeXBlIHtcbiAgY29uc3Qgc3RvcnlDb3VudCA9IGNhc3VhbC5pbnRlZ2VyKDIsIDYpO1xuXG4gIHJldHVybiB7XG4gICAgaWQ6IGlkIHx8IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIG5hbWU6IG5hbWUgfHwgaWQgPT09IE1ZX1NUT1JJRVNfSUQgPyAnTXkgU3RvcmllcycgOiBjYXN1YWwuY2F0Y2hfcGhyYXNlLFxuICAgIHN0b3JpZXM6IEFycmF5LmZyb20oQXJyYXkoc3RvcnlDb3VudCksICgpID0+ICh7XG4gICAgICAuLi5nZXRGYWtlU3RvcnlWaWV3KCksXG4gICAgICBzZW5kU3RhdGU6IFtdLFxuICAgICAgdmlld3M6IGNhc3VhbC5pbnRlZ2VyKDEsIDIwKSxcbiAgICB9KSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGYWtlU3RvcnlWaWV3KFxuICBhdHRhY2htZW50VXJsPzogc3RyaW5nLFxuICB0aW1lc3RhbXA/OiBudW1iZXJcbik6IFN0b3J5Vmlld1R5cGUge1xuICBjb25zdCBzZW5kZXIgPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBhdHRhY2htZW50OiBnZXRBdHRhY2htZW50V2l0aFRodW1ibmFpbChcbiAgICAgIGF0dGFjaG1lbnRVcmwgfHwgJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZydcbiAgICApLFxuICAgIGhhc1JlcGxpZXM6IEJvb2xlYW4oY2FzdWFsLmNvaW5fZmxpcCksXG4gICAgaXNVbnJlYWQ6IEJvb2xlYW4oY2FzdWFsLmNvaW5fZmxpcCksXG4gICAgbWVzc2FnZUlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICBzZW5kZXIsXG4gICAgdGltZXN0YW1wOiB0aW1lc3RhbXAgfHwgRGF0ZS5ub3coKSAtIDIgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmFrZVN0b3J5KHtcbiAgYXR0YWNobWVudFVybCxcbiAgZ3JvdXAsXG4gIHRpbWVzdGFtcCxcbn06IHtcbiAgYXR0YWNobWVudFVybD86IHN0cmluZztcbiAgZ3JvdXA/OiBDb252ZXJzYXRpb25UeXBlO1xuICB0aW1lc3RhbXA/OiBudW1iZXI7XG59KTogQ29udmVyc2F0aW9uU3RvcnlUeXBlIHtcbiAgY29uc3Qgc3RvcnlWaWV3ID0gZ2V0RmFrZVN0b3J5VmlldyhhdHRhY2htZW50VXJsLCB0aW1lc3RhbXApO1xuXG4gIHJldHVybiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0b3J5Vmlldy5zZW5kZXIuaWQsXG4gICAgZ3JvdXAsXG4gICAgc3RvcnlWaWV3LFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBbUI7QUFTbkIsZ0JBQTJCO0FBQzNCLGtCQUFxQjtBQUNyQixvQ0FBdUM7QUFDdkMsNEJBQThDO0FBQzlDLHFCQUE4QjtBQUU5QixvQ0FBb0MsS0FBNkI7QUFDL0QsU0FBTywwQ0FBZTtBQUFBLElBQ3BCO0FBQUEsSUFDQSxXQUFXLHlDQUFjLEdBQUc7QUFBQSxFQUM5QixDQUFDO0FBQ0g7QUFMUyxBQU9GLHdCQUF3QixJQUFhLE1BQTRCO0FBQ3RFLFFBQU0sYUFBYSxzQkFBTyxRQUFRLEdBQUcsQ0FBQztBQUV0QyxTQUFPO0FBQUEsSUFDTCxJQUFJLE1BQU0saUJBQUssU0FBUyxFQUFFLFNBQVM7QUFBQSxJQUNuQyxNQUFNLFFBQVEsT0FBTywrQkFBZ0IsZUFBZSxzQkFBTztBQUFBLElBQzNELFNBQVMsTUFBTSxLQUFLLE1BQU0sVUFBVSxHQUFHLE1BQU87QUFBQSxTQUN6QyxpQkFBaUI7QUFBQSxNQUNwQixXQUFXLENBQUM7QUFBQSxNQUNaLE9BQU8sc0JBQU8sUUFBUSxHQUFHLEVBQUU7QUFBQSxJQUM3QixFQUFFO0FBQUEsRUFDSjtBQUNGO0FBWmdCLEFBY1QsMEJBQ0wsZUFDQSxXQUNlO0FBQ2YsUUFBTSxTQUFTLDBEQUF1QjtBQUV0QyxTQUFPO0FBQUEsSUFDTCxZQUFZLDJCQUNWLGlCQUFpQix5Q0FDbkI7QUFBQSxJQUNBLFlBQVksUUFBUSxzQkFBTyxTQUFTO0FBQUEsSUFDcEMsVUFBVSxRQUFRLHNCQUFPLFNBQVM7QUFBQSxJQUNsQyxXQUFXLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsSUFDcEM7QUFBQSxJQUNBLFdBQVcsYUFBYSxLQUFLLElBQUksSUFBSSxJQUFJLFVBQVU7QUFBQSxFQUNyRDtBQUNGO0FBaEJnQixBQWtCVCxzQkFBc0I7QUFBQSxFQUMzQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FLd0I7QUFDeEIsUUFBTSxZQUFZLGlCQUFpQixlQUFlLFNBQVM7QUFFM0QsU0FBTztBQUFBLElBQ0wsZ0JBQWdCLFVBQVUsT0FBTztBQUFBLElBQ2pDO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQWhCZ0IiLAogICJuYW1lcyI6IFtdCn0K
