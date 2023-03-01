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
var getStoryDuration_exports = {};
__export(getStoryDuration_exports, {
  getStoryDuration: () => getStoryDuration
});
module.exports = __toCommonJS(getStoryDuration_exports);
var import_Attachment = require("../types/Attachment");
var import_grapheme = require("./grapheme");
var import_durations = require("./durations");
const DEFAULT_DURATION = 5 * import_durations.SECOND;
const MAX_VIDEO_DURATION = 30 * import_durations.SECOND;
const MIN_TEXT_DURATION = 3 * import_durations.SECOND;
async function getStoryDuration(attachment) {
  if ((0, import_Attachment.hasFailed)(attachment)) {
    return DEFAULT_DURATION;
  }
  if (!(0, import_Attachment.isDownloaded)(attachment) || (0, import_Attachment.hasNotResolved)(attachment)) {
    return;
  }
  if ((0, import_Attachment.isGIF)([attachment]) || (0, import_Attachment.isVideo)([attachment])) {
    const videoEl = document.createElement("video");
    if (!attachment.url) {
      return DEFAULT_DURATION;
    }
    videoEl.src = attachment.url;
    await new Promise((resolve) => {
      function resolveAndRemove() {
        resolve();
        videoEl.removeEventListener("loadedmetadata", resolveAndRemove);
      }
      videoEl.addEventListener("loadedmetadata", resolveAndRemove);
    });
    const duration = Math.ceil(videoEl.duration * import_durations.SECOND);
    if ((0, import_Attachment.isGIF)([attachment])) {
      return Math.min(Math.max(duration * 3, DEFAULT_DURATION), MAX_VIDEO_DURATION);
    }
    return Math.min(duration, MAX_VIDEO_DURATION);
  }
  if (attachment.textAttachment && attachment.textAttachment.text) {
    const length = (0, import_grapheme.count)(attachment.textAttachment.text);
    const additionalSeconds = (Math.ceil(length / 15) - 1) * import_durations.SECOND;
    const linkPreviewSeconds = attachment.textAttachment.preview ? 2 * import_durations.SECOND : 0;
    return MIN_TEXT_DURATION + additionalSeconds + linkPreviewSeconds;
  }
  return DEFAULT_DURATION;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStoryDuration
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0U3RvcnlEdXJhdGlvbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQge1xuICBoYXNGYWlsZWQsXG4gIGhhc05vdFJlc29sdmVkLFxuICBpc0Rvd25sb2FkZWQsXG4gIGlzR0lGLFxuICBpc1ZpZGVvLFxufSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGNvdW50IH0gZnJvbSAnLi9ncmFwaGVtZSc7XG5pbXBvcnQgeyBTRUNPTkQgfSBmcm9tICcuL2R1cmF0aW9ucyc7XG5cbmNvbnN0IERFRkFVTFRfRFVSQVRJT04gPSA1ICogU0VDT05EO1xuY29uc3QgTUFYX1ZJREVPX0RVUkFUSU9OID0gMzAgKiBTRUNPTkQ7XG5jb25zdCBNSU5fVEVYVF9EVVJBVElPTiA9IDMgKiBTRUNPTkQ7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTdG9yeUR1cmF0aW9uKFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZVxuKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgaWYgKGhhc0ZhaWxlZChhdHRhY2htZW50KSkge1xuICAgIHJldHVybiBERUZBVUxUX0RVUkFUSU9OO1xuICB9XG5cbiAgaWYgKCFpc0Rvd25sb2FkZWQoYXR0YWNobWVudCkgfHwgaGFzTm90UmVzb2x2ZWQoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNHSUYoW2F0dGFjaG1lbnRdKSB8fCBpc1ZpZGVvKFthdHRhY2htZW50XSkpIHtcbiAgICBjb25zdCB2aWRlb0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICBpZiAoIWF0dGFjaG1lbnQudXJsKSB7XG4gICAgICByZXR1cm4gREVGQVVMVF9EVVJBVElPTjtcbiAgICB9XG4gICAgdmlkZW9FbC5zcmMgPSBhdHRhY2htZW50LnVybDtcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZUFuZFJlbW92ZSgpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB2aWRlb0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgcmVzb2x2ZUFuZFJlbW92ZSk7XG4gICAgICB9XG5cbiAgICAgIHZpZGVvRWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCByZXNvbHZlQW5kUmVtb3ZlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC5jZWlsKHZpZGVvRWwuZHVyYXRpb24gKiBTRUNPTkQpO1xuXG4gICAgaWYgKGlzR0lGKFthdHRhY2htZW50XSkpIHtcbiAgICAgIC8vIEdJRnM6IExvb3AgZ2lmcyAzIHRpbWVzIG9yIHBsYXkgZm9yIDUgc2Vjb25kcywgd2hpY2hldmVyIGlzIGxvbmdlci5cbiAgICAgIHJldHVybiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5tYXgoZHVyYXRpb24gKiAzLCBERUZBVUxUX0RVUkFUSU9OKSxcbiAgICAgICAgTUFYX1ZJREVPX0RVUkFUSU9OXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFZpZGVvIG1heCBkdXJhdGlvbjogMzAgc2Vjb25kc1xuICAgIHJldHVybiBNYXRoLm1pbihkdXJhdGlvbiwgTUFYX1ZJREVPX0RVUkFUSU9OKTtcbiAgfVxuXG4gIGlmIChhdHRhY2htZW50LnRleHRBdHRhY2htZW50ICYmIGF0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnQudGV4dCkge1xuICAgIC8vIE1pbmltdW0gMyBzZWNvbmRzLiArMSBzZWNvbmQgZm9yIGV2ZXJ5IDE1IGNoYXJhY3RlcnMgcGFzdCB0aGUgZmlyc3RcbiAgICAvLyAxNSBjaGFyYWN0ZXJzIChyb3VuZCB1cCkuXG4gICAgLy8gRm9yIHRleHQgc3RvcmllcyB0aGF0IGluY2x1ZGUgYSBsaW5rLCArMiBzZWNvbmRzIHRvIHRoZSBwbGF5YmFjayB0aW1lLlxuICAgIGNvbnN0IGxlbmd0aCA9IGNvdW50KGF0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnQudGV4dCk7XG4gICAgY29uc3QgYWRkaXRpb25hbFNlY29uZHMgPSAoTWF0aC5jZWlsKGxlbmd0aCAvIDE1KSAtIDEpICogU0VDT05EO1xuICAgIGNvbnN0IGxpbmtQcmV2aWV3U2Vjb25kcyA9IGF0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnQucHJldmlld1xuICAgICAgPyAyICogU0VDT05EXG4gICAgICA6IDA7XG4gICAgcmV0dXJuIE1JTl9URVhUX0RVUkFUSU9OICsgYWRkaXRpb25hbFNlY29uZHMgKyBsaW5rUHJldmlld1NlY29uZHM7XG4gIH1cblxuICByZXR1cm4gREVGQVVMVF9EVVJBVElPTjtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSx3QkFNTztBQUNQLHNCQUFzQjtBQUN0Qix1QkFBdUI7QUFFdkIsTUFBTSxtQkFBbUIsSUFBSTtBQUM3QixNQUFNLHFCQUFxQixLQUFLO0FBQ2hDLE1BQU0sb0JBQW9CLElBQUk7QUFFOUIsZ0NBQ0UsWUFDNkI7QUFDN0IsTUFBSSxpQ0FBVSxVQUFVLEdBQUc7QUFDekIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFJLENBQUMsb0NBQWEsVUFBVSxLQUFLLHNDQUFlLFVBQVUsR0FBRztBQUMzRDtBQUFBLEVBQ0Y7QUFFQSxNQUFJLDZCQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssK0JBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRztBQUNoRCxVQUFNLFVBQVUsU0FBUyxjQUFjLE9BQU87QUFDOUMsUUFBSSxDQUFDLFdBQVcsS0FBSztBQUNuQixhQUFPO0FBQUEsSUFDVDtBQUNBLFlBQVEsTUFBTSxXQUFXO0FBRXpCLFVBQU0sSUFBSSxRQUFjLGFBQVc7QUFDakMsa0NBQTRCO0FBQzFCLGdCQUFRO0FBQ1IsZ0JBQVEsb0JBQW9CLGtCQUFrQixnQkFBZ0I7QUFBQSxNQUNoRTtBQUhTLEFBS1QsY0FBUSxpQkFBaUIsa0JBQWtCLGdCQUFnQjtBQUFBLElBQzdELENBQUM7QUFFRCxVQUFNLFdBQVcsS0FBSyxLQUFLLFFBQVEsV0FBVyx1QkFBTTtBQUVwRCxRQUFJLDZCQUFNLENBQUMsVUFBVSxDQUFDLEdBQUc7QUFFdkIsYUFBTyxLQUFLLElBQ1YsS0FBSyxJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsR0FDdkMsa0JBQ0Y7QUFBQSxJQUNGO0FBR0EsV0FBTyxLQUFLLElBQUksVUFBVSxrQkFBa0I7QUFBQSxFQUM5QztBQUVBLE1BQUksV0FBVyxrQkFBa0IsV0FBVyxlQUFlLE1BQU07QUFJL0QsVUFBTSxTQUFTLDJCQUFNLFdBQVcsZUFBZSxJQUFJO0FBQ25ELFVBQU0sb0JBQXFCLE1BQUssS0FBSyxTQUFTLEVBQUUsSUFBSSxLQUFLO0FBQ3pELFVBQU0scUJBQXFCLFdBQVcsZUFBZSxVQUNqRCxJQUFJLDBCQUNKO0FBQ0osV0FBTyxvQkFBb0Isb0JBQW9CO0FBQUEsRUFDakQ7QUFFQSxTQUFPO0FBQ1Q7QUF0RHNCIiwKICAibmFtZXMiOiBbXQp9Cg==
