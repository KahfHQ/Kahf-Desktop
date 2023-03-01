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
var StoryImage_exports = {};
__export(StoryImage_exports, {
  StoryImage: () => StoryImage
});
module.exports = __toCommonJS(StoryImage_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_react_blurhash = require("react-blurhash");
var import_Spinner = require("./Spinner");
var import_TextAttachment = require("./TextAttachment");
var import_Util = require("../types/Util");
var import_Attachment = require("../types/Attachment");
var import_getClassNamesFor = require("../util/getClassNamesFor");
var import_GoogleChrome = require("../util/GoogleChrome");
const StoryImage = /* @__PURE__ */ __name(({
  attachment,
  children,
  firstName,
  i18n,
  isMe,
  isMuted,
  isPaused,
  isThumbnail,
  label,
  moduleClassName,
  queueStoryDownload,
  storyId
}) => {
  const shouldDownloadAttachment = !(0, import_Attachment.isDownloaded)(attachment) && !(0, import_Attachment.isDownloading)(attachment) || (0, import_Attachment.hasNotResolved)(attachment);
  const [hasImgError, setHasImgError] = (0, import_react.useState)(false);
  const videoRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (shouldDownloadAttachment) {
      queueStoryDownload(storyId);
    }
  }, [queueStoryDownload, shouldDownloadAttachment, storyId]);
  (0, import_react.useEffect)(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPaused]);
  if (!attachment) {
    return null;
  }
  const hasError = hasImgError || (0, import_Attachment.hasFailed)(attachment);
  const isPending = Boolean(attachment.pending) && !attachment.textAttachment && !hasError;
  const isNotReadyToShow = (0, import_Attachment.hasNotResolved)(attachment) || isPending || hasError;
  const isSupportedVideo = (0, import_GoogleChrome.isVideoTypeSupported)(attachment.contentType);
  const getClassName = (0, import_getClassNamesFor.getClassNamesFor)("StoryImage", moduleClassName);
  let storyElement;
  if (attachment.textAttachment) {
    storyElement = /* @__PURE__ */ import_react.default.createElement(import_TextAttachment.TextAttachment, {
      i18n,
      isThumbnail,
      textAttachment: attachment.textAttachment
    });
  } else if (isNotReadyToShow) {
    storyElement = /* @__PURE__ */ import_react.default.createElement(import_react_blurhash.Blurhash, {
      hash: attachment.blurHash || (0, import_Attachment.defaultBlurHash)(import_Util.ThemeType.dark),
      height: attachment.height,
      width: attachment.width
    });
  } else if (!isThumbnail && isSupportedVideo) {
    const shouldLoop = (0, import_Attachment.isGIF)(attachment ? [attachment] : void 0);
    storyElement = /* @__PURE__ */ import_react.default.createElement("video", {
      autoPlay: true,
      className: getClassName("__image"),
      controls: false,
      key: attachment.url,
      loop: shouldLoop,
      muted: isMuted,
      ref: videoRef
    }, /* @__PURE__ */ import_react.default.createElement("source", {
      src: attachment.url
    }));
  } else {
    storyElement = /* @__PURE__ */ import_react.default.createElement("img", {
      alt: label,
      className: getClassName("__image"),
      onError: () => setHasImgError(true),
      src: isThumbnail && attachment.thumbnail ? attachment.thumbnail.url : attachment.url
    });
  }
  let overlay;
  if (isPending) {
    overlay = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryImage__overlay-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryImage__spinner-bubble",
      title: i18n("loading")
    }, /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      moduleClassName: "StoryImage__spinner",
      svgSize: "small"
    })));
  } else if (hasError) {
    let content = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryImage__error"
    });
    if (!isThumbnail) {
      if (isMe) {
        content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, i18n("StoryImage__error--you"));
      } else {
        content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, i18n("StoryImage__error2", [firstName]));
      }
    }
    overlay = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryImage__overlay-container"
    }, content);
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName(""), isThumbnail ? getClassName("--thumbnail") : void 0)
  }, storyElement, overlay, children);
}, "StoryImage");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryImage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlJbWFnZS50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBCbHVyaGFzaCB9IGZyb20gJ3JlYWN0LWJsdXJoYXNoJztcblxuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSAnLi9TcGlubmVyJztcbmltcG9ydCB7IFRleHRBdHRhY2htZW50IH0gZnJvbSAnLi9UZXh0QXR0YWNobWVudCc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7XG4gIGRlZmF1bHRCbHVySGFzaCxcbiAgaGFzRmFpbGVkLFxuICBoYXNOb3RSZXNvbHZlZCxcbiAgaXNEb3dubG9hZGVkLFxuICBpc0Rvd25sb2FkaW5nLFxuICBpc0dJRixcbn0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBnZXRDbGFzc05hbWVzRm9yIH0gZnJvbSAnLi4vdXRpbC9nZXRDbGFzc05hbWVzRm9yJztcbmltcG9ydCB7IGlzVmlkZW9UeXBlU3VwcG9ydGVkIH0gZnJvbSAnLi4vdXRpbC9Hb29nbGVDaHJvbWUnO1xuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSB7XG4gIHJlYWRvbmx5IGF0dGFjaG1lbnQ/OiBBdHRhY2htZW50VHlwZTtcbiAgcmVhZG9ubHkgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIHJlYWRvbmx5IGZpcnN0TmFtZTogc3RyaW5nO1xuICByZWFkb25seSBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICByZWFkb25seSBpc01lPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgaXNNdXRlZD86IGJvb2xlYW47XG4gIHJlYWRvbmx5IGlzUGF1c2VkPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgaXNUaHVtYm5haWw/OiBib29sZWFuO1xuICByZWFkb25seSBsYWJlbDogc3RyaW5nO1xuICByZWFkb25seSBtb2R1bGVDbGFzc05hbWU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHF1ZXVlU3RvcnlEb3dubG9hZDogKHN0b3J5SWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcmVhZG9ubHkgc3RvcnlJZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNvbnN0IFN0b3J5SW1hZ2UgPSAoe1xuICBhdHRhY2htZW50LFxuICBjaGlsZHJlbixcbiAgZmlyc3ROYW1lLFxuICBpMThuLFxuICBpc01lLFxuICBpc011dGVkLFxuICBpc1BhdXNlZCxcbiAgaXNUaHVtYm5haWwsXG4gIGxhYmVsLFxuICBtb2R1bGVDbGFzc05hbWUsXG4gIHF1ZXVlU3RvcnlEb3dubG9hZCxcbiAgc3RvcnlJZCxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50IHwgbnVsbCA9PiB7XG4gIGNvbnN0IHNob3VsZERvd25sb2FkQXR0YWNobWVudCA9XG4gICAgKCFpc0Rvd25sb2FkZWQoYXR0YWNobWVudCkgJiYgIWlzRG93bmxvYWRpbmcoYXR0YWNobWVudCkpIHx8XG4gICAgaGFzTm90UmVzb2x2ZWQoYXR0YWNobWVudCk7XG5cbiAgY29uc3QgW2hhc0ltZ0Vycm9yLCBzZXRIYXNJbWdFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHZpZGVvUmVmID0gdXNlUmVmPEhUTUxWaWRlb0VsZW1lbnQgfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzaG91bGREb3dubG9hZEF0dGFjaG1lbnQpIHtcbiAgICAgIHF1ZXVlU3RvcnlEb3dubG9hZChzdG9yeUlkKTtcbiAgICB9XG4gIH0sIFtxdWV1ZVN0b3J5RG93bmxvYWQsIHNob3VsZERvd25sb2FkQXR0YWNobWVudCwgc3RvcnlJZF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF2aWRlb1JlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICB2aWRlb1JlZi5jdXJyZW50LnBhdXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZGVvUmVmLmN1cnJlbnQucGxheSgpO1xuICAgIH1cbiAgfSwgW2lzUGF1c2VkXSk7XG5cbiAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBoYXNFcnJvciA9IGhhc0ltZ0Vycm9yIHx8IGhhc0ZhaWxlZChhdHRhY2htZW50KTtcbiAgY29uc3QgaXNQZW5kaW5nID1cbiAgICBCb29sZWFuKGF0dGFjaG1lbnQucGVuZGluZykgJiYgIWF0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnQgJiYgIWhhc0Vycm9yO1xuICBjb25zdCBpc05vdFJlYWR5VG9TaG93ID0gaGFzTm90UmVzb2x2ZWQoYXR0YWNobWVudCkgfHwgaXNQZW5kaW5nIHx8IGhhc0Vycm9yO1xuICBjb25zdCBpc1N1cHBvcnRlZFZpZGVvID0gaXNWaWRlb1R5cGVTdXBwb3J0ZWQoYXR0YWNobWVudC5jb250ZW50VHlwZSk7XG5cbiAgY29uc3QgZ2V0Q2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lc0ZvcignU3RvcnlJbWFnZScsIG1vZHVsZUNsYXNzTmFtZSk7XG5cbiAgbGV0IHN0b3J5RWxlbWVudDogSlNYLkVsZW1lbnQ7XG4gIGlmIChhdHRhY2htZW50LnRleHRBdHRhY2htZW50KSB7XG4gICAgc3RvcnlFbGVtZW50ID0gKFxuICAgICAgPFRleHRBdHRhY2htZW50XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGlzVGh1bWJuYWlsPXtpc1RodW1ibmFpbH1cbiAgICAgICAgdGV4dEF0dGFjaG1lbnQ9e2F0dGFjaG1lbnQudGV4dEF0dGFjaG1lbnR9XG4gICAgICAvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAoaXNOb3RSZWFkeVRvU2hvdykge1xuICAgIHN0b3J5RWxlbWVudCA9IChcbiAgICAgIDxCbHVyaGFzaFxuICAgICAgICBoYXNoPXthdHRhY2htZW50LmJsdXJIYXNoIHx8IGRlZmF1bHRCbHVySGFzaChUaGVtZVR5cGUuZGFyayl9XG4gICAgICAgIGhlaWdodD17YXR0YWNobWVudC5oZWlnaHR9XG4gICAgICAgIHdpZHRoPXthdHRhY2htZW50LndpZHRofVxuICAgICAgLz5cbiAgICApO1xuICB9IGVsc2UgaWYgKCFpc1RodW1ibmFpbCAmJiBpc1N1cHBvcnRlZFZpZGVvKSB7XG4gICAgY29uc3Qgc2hvdWxkTG9vcCA9IGlzR0lGKGF0dGFjaG1lbnQgPyBbYXR0YWNobWVudF0gOiB1bmRlZmluZWQpO1xuXG4gICAgc3RvcnlFbGVtZW50ID0gKFxuICAgICAgPHZpZGVvXG4gICAgICAgIGF1dG9QbGF5XG4gICAgICAgIGNsYXNzTmFtZT17Z2V0Q2xhc3NOYW1lKCdfX2ltYWdlJyl9XG4gICAgICAgIGNvbnRyb2xzPXtmYWxzZX1cbiAgICAgICAga2V5PXthdHRhY2htZW50LnVybH1cbiAgICAgICAgbG9vcD17c2hvdWxkTG9vcH1cbiAgICAgICAgbXV0ZWQ9e2lzTXV0ZWR9XG4gICAgICAgIHJlZj17dmlkZW9SZWZ9XG4gICAgICA+XG4gICAgICAgIDxzb3VyY2Ugc3JjPXthdHRhY2htZW50LnVybH0gLz5cbiAgICAgIDwvdmlkZW8+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBzdG9yeUVsZW1lbnQgPSAoXG4gICAgICA8aW1nXG4gICAgICAgIGFsdD17bGFiZWx9XG4gICAgICAgIGNsYXNzTmFtZT17Z2V0Q2xhc3NOYW1lKCdfX2ltYWdlJyl9XG4gICAgICAgIG9uRXJyb3I9eygpID0+IHNldEhhc0ltZ0Vycm9yKHRydWUpfVxuICAgICAgICBzcmM9e1xuICAgICAgICAgIGlzVGh1bWJuYWlsICYmIGF0dGFjaG1lbnQudGh1bWJuYWlsXG4gICAgICAgICAgICA/IGF0dGFjaG1lbnQudGh1bWJuYWlsLnVybFxuICAgICAgICAgICAgOiBhdHRhY2htZW50LnVybFxuICAgICAgICB9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBsZXQgb3ZlcmxheTogSlNYLkVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGlmIChpc1BlbmRpbmcpIHtcbiAgICBvdmVybGF5ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUltYWdlX19vdmVybGF5LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5SW1hZ2VfX3NwaW5uZXItYnViYmxlXCIgdGl0bGU9e2kxOG4oJ2xvYWRpbmcnKX0+XG4gICAgICAgICAgPFNwaW5uZXIgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlJbWFnZV9fc3Bpbm5lclwiIHN2Z1NpemU9XCJzbWFsbFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChoYXNFcnJvcikge1xuICAgIGxldCBjb250ZW50ID0gPGRpdiBjbGFzc05hbWU9XCJTdG9yeUltYWdlX19lcnJvclwiIC8+O1xuICAgIGlmICghaXNUaHVtYm5haWwpIHtcbiAgICAgIGlmIChpc01lKSB7XG4gICAgICAgIGNvbnRlbnQgPSA8PntpMThuKCdTdG9yeUltYWdlX19lcnJvci0teW91Jyl9PC8+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGVudCA9IDw+e2kxOG4oJ1N0b3J5SW1hZ2VfX2Vycm9yMicsIFtmaXJzdE5hbWVdKX08Lz47XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3ZlcmxheSA9IDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlJbWFnZV9fb3ZlcmxheS1jb250YWluZXJcIj57Y29udGVudH08L2Rpdj47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgZ2V0Q2xhc3NOYW1lKCcnKSxcbiAgICAgICAgaXNUaHVtYm5haWwgPyBnZXRDbGFzc05hbWUoJy0tdGh1bWJuYWlsJykgOiB1bmRlZmluZWRcbiAgICAgICl9XG4gICAgPlxuICAgICAge3N0b3J5RWxlbWVudH1cbiAgICAgIHtvdmVybGF5fVxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBbUQ7QUFDbkQsd0JBQXVCO0FBQ3ZCLDRCQUF5QjtBQUl6QixxQkFBd0I7QUFDeEIsNEJBQStCO0FBQy9CLGtCQUEwQjtBQUMxQix3QkFPTztBQUNQLDhCQUFpQztBQUNqQywwQkFBcUM7QUFpQjlCLE1BQU0sYUFBYSx3QkFBQztBQUFBLEVBQ3pCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxNQUNtQztBQUNuQyxRQUFNLDJCQUNILENBQUMsb0NBQWEsVUFBVSxLQUFLLENBQUMscUNBQWMsVUFBVSxLQUN2RCxzQ0FBZSxVQUFVO0FBRTNCLFFBQU0sQ0FBQyxhQUFhLGtCQUFrQiwyQkFBUyxLQUFLO0FBQ3BELFFBQU0sV0FBVyx5QkFBZ0MsSUFBSTtBQUVyRCw4QkFBVSxNQUFNO0FBQ2QsUUFBSSwwQkFBMEI7QUFDNUIseUJBQW1CLE9BQU87QUFBQSxJQUM1QjtBQUFBLEVBQ0YsR0FBRyxDQUFDLG9CQUFvQiwwQkFBMEIsT0FBTyxDQUFDO0FBRTFELDhCQUFVLE1BQU07QUFDZCxRQUFJLENBQUMsU0FBUyxTQUFTO0FBQ3JCO0FBQUEsSUFDRjtBQUVBLFFBQUksVUFBVTtBQUNaLGVBQVMsUUFBUSxNQUFNO0FBQUEsSUFDekIsT0FBTztBQUNMLGVBQVMsUUFBUSxLQUFLO0FBQUEsSUFDeEI7QUFBQSxFQUNGLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFYixNQUFJLENBQUMsWUFBWTtBQUNmLFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxXQUFXLGVBQWUsaUNBQVUsVUFBVTtBQUNwRCxRQUFNLFlBQ0osUUFBUSxXQUFXLE9BQU8sS0FBSyxDQUFDLFdBQVcsa0JBQWtCLENBQUM7QUFDaEUsUUFBTSxtQkFBbUIsc0NBQWUsVUFBVSxLQUFLLGFBQWE7QUFDcEUsUUFBTSxtQkFBbUIsOENBQXFCLFdBQVcsV0FBVztBQUVwRSxRQUFNLGVBQWUsOENBQWlCLGNBQWMsZUFBZTtBQUVuRSxNQUFJO0FBQ0osTUFBSSxXQUFXLGdCQUFnQjtBQUM3QixtQkFDRSxtREFBQztBQUFBLE1BQ0M7QUFBQSxNQUNBO0FBQUEsTUFDQSxnQkFBZ0IsV0FBVztBQUFBLEtBQzdCO0FBQUEsRUFFSixXQUFXLGtCQUFrQjtBQUMzQixtQkFDRSxtREFBQztBQUFBLE1BQ0MsTUFBTSxXQUFXLFlBQVksdUNBQWdCLHNCQUFVLElBQUk7QUFBQSxNQUMzRCxRQUFRLFdBQVc7QUFBQSxNQUNuQixPQUFPLFdBQVc7QUFBQSxLQUNwQjtBQUFBLEVBRUosV0FBVyxDQUFDLGVBQWUsa0JBQWtCO0FBQzNDLFVBQU0sYUFBYSw2QkFBTSxhQUFhLENBQUMsVUFBVSxJQUFJLE1BQVM7QUFFOUQsbUJBQ0UsbURBQUM7QUFBQSxNQUNDLFVBQVE7QUFBQSxNQUNSLFdBQVcsYUFBYSxTQUFTO0FBQUEsTUFDakMsVUFBVTtBQUFBLE1BQ1YsS0FBSyxXQUFXO0FBQUEsTUFDaEIsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsS0FBSztBQUFBLE9BRUwsbURBQUM7QUFBQSxNQUFPLEtBQUssV0FBVztBQUFBLEtBQUssQ0FDL0I7QUFBQSxFQUVKLE9BQU87QUFDTCxtQkFDRSxtREFBQztBQUFBLE1BQ0MsS0FBSztBQUFBLE1BQ0wsV0FBVyxhQUFhLFNBQVM7QUFBQSxNQUNqQyxTQUFTLE1BQU0sZUFBZSxJQUFJO0FBQUEsTUFDbEMsS0FDRSxlQUFlLFdBQVcsWUFDdEIsV0FBVyxVQUFVLE1BQ3JCLFdBQVc7QUFBQSxLQUVuQjtBQUFBLEVBRUo7QUFFQSxNQUFJO0FBQ0osTUFBSSxXQUFXO0FBQ2IsY0FDRSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ2IsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxNQUE2QixPQUFPLEtBQUssU0FBUztBQUFBLE9BQy9ELG1EQUFDO0FBQUEsTUFBUSxpQkFBZ0I7QUFBQSxNQUFzQixTQUFRO0FBQUEsS0FBUSxDQUNqRSxDQUNGO0FBQUEsRUFFSixXQUFXLFVBQVU7QUFDbkIsUUFBSSxVQUFVLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsS0FBb0I7QUFDakQsUUFBSSxDQUFDLGFBQWE7QUFDaEIsVUFBSSxNQUFNO0FBQ1Isa0JBQVUsd0ZBQUcsS0FBSyx3QkFBd0IsQ0FBRTtBQUFBLE1BQzlDLE9BQU87QUFDTCxrQkFBVSx3RkFBRyxLQUFLLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFFO0FBQUEsTUFDdkQ7QUFBQSxJQUNGO0FBRUEsY0FBVSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQWlDLE9BQVE7QUFBQSxFQUNwRTtBQUVBLFNBQ0UsbURBQUM7QUFBQSxJQUNDLFdBQVcsK0JBQ1QsYUFBYSxFQUFFLEdBQ2YsY0FBYyxhQUFhLGFBQWEsSUFBSSxNQUM5QztBQUFBLEtBRUMsY0FDQSxTQUNBLFFBQ0g7QUFFSixHQXJJMEI7IiwKICAibmFtZXMiOiBbXQp9Cg==
