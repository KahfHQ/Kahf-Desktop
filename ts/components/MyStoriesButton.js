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
var MyStoriesButton_exports = {};
__export(MyStoriesButton_exports, {
  MyStoriesButton: () => MyStoriesButton
});
module.exports = __toCommonJS(MyStoriesButton_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_Avatar = require("./Avatar");
var import_StoryImage = require("./StoryImage");
var import_Colors = require("../types/Colors");
const MyStoriesButton = /* @__PURE__ */ __name(({
  hasMultiple,
  i18n,
  me,
  newestStory,
  onAddStory,
  onClick,
  queueStoryDownload
}) => {
  const {
    acceptedMessageRequest,
    avatarPath,
    color,
    isMe,
    name,
    profileName,
    sharedGroupNames,
    title
  } = me;
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__my-stories"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__button"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MyStories__avatar-container"
  }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest,
    avatarPath,
    badge: void 0,
    color: (0, import_Colors.getAvatarColor)(color),
    conversationType: "direct",
    i18n,
    isMe: Boolean(isMe),
    name,
    onClick: onAddStory,
    profileName,
    sharedGroupNames,
    size: import_Avatar.AvatarSize.FORTY_EIGHT,
    title
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    "aria-label": i18n("Stories__add"),
    className: "MyStories__avatar__add-story",
    onClick: (ev) => {
      onAddStory();
      ev.stopPropagation();
      ev.preventDefault();
    },
    onKeyDown: (ev) => {
      if (ev.key === "Enter") {
        onAddStory();
        ev.stopPropagation();
        ev.preventDefault();
      }
    },
    role: "button",
    tabIndex: 0
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__click-container",
    onClick,
    onKeyDown: (ev) => {
      if (ev.key === "Enter") {
        onClick();
        ev.stopPropagation();
        ev.preventDefault();
      }
    },
    role: "button",
    tabIndex: 0
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__info"
  }, /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__info--title"
  }, i18n("Stories__mine")), !newestStory && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__info--timestamp"
  }, i18n("Stories__add")))), /* @__PURE__ */ import_react.default.createElement("div", {
    "aria-label": i18n("StoryListItem__label"),
    className: (0, import_classnames.default)("StoryListItem__previews", {
      "StoryListItem__previews--multiple": hasMultiple
    })
  }, hasMultiple && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__previews--more"
  }), newestStory ? /* @__PURE__ */ import_react.default.createElement(import_StoryImage.StoryImage, {
    attachment: newestStory.attachment,
    firstName: i18n("you"),
    i18n,
    isMe: true,
    isThumbnail: true,
    label: "",
    moduleClassName: "StoryListItem__previews--image",
    queueStoryDownload,
    storyId: newestStory.messageId
  }) : /* @__PURE__ */ import_react.default.createElement("div", {
    "aria-label": i18n("Stories__add"),
    className: "StoryListItem__previews--add StoryListItem__previews--image"
  })))));
}, "MyStoriesButton");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MyStoriesButton
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTXlTdG9yaWVzQnV0dG9uLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeVZpZXdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBBdmF0YXIsIEF2YXRhclNpemUgfSBmcm9tICcuL0F2YXRhcic7XG5pbXBvcnQgeyBTdG9yeUltYWdlIH0gZnJvbSAnLi9TdG9yeUltYWdlJztcbmltcG9ydCB7IGdldEF2YXRhckNvbG9yIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBoYXNNdWx0aXBsZTogYm9vbGVhbjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbWU6IENvbnZlcnNhdGlvblR5cGU7XG4gIG5ld2VzdFN0b3J5PzogU3RvcnlWaWV3VHlwZTtcbiAgb25BZGRTdG9yeTogKCkgPT4gdW5rbm93bjtcbiAgb25DbGljazogKCkgPT4gdW5rbm93bjtcbiAgcXVldWVTdG9yeURvd25sb2FkOiAoc3RvcnlJZDogc3RyaW5nKSA9PiB1bmtub3duO1xufTtcblxuZXhwb3J0IGNvbnN0IE15U3Rvcmllc0J1dHRvbiA9ICh7XG4gIGhhc011bHRpcGxlLFxuICBpMThuLFxuICBtZSxcbiAgbmV3ZXN0U3RvcnksXG4gIG9uQWRkU3RvcnksXG4gIG9uQ2xpY2ssXG4gIHF1ZXVlU3RvcnlEb3dubG9hZCxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3Qge1xuICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gICAgYXZhdGFyUGF0aCxcbiAgICBjb2xvcixcbiAgICBpc01lLFxuICAgIG5hbWUsXG4gICAgcHJvZmlsZU5hbWUsXG4gICAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgICB0aXRsZSxcbiAgfSA9IG1lO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzX19teS1zdG9yaWVzXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5TGlzdEl0ZW1fX2J1dHRvblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk15U3Rvcmllc19fYXZhdGFyLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e2FjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICBhdmF0YXJQYXRoPXthdmF0YXJQYXRofVxuICAgICAgICAgICAgYmFkZ2U9e3VuZGVmaW5lZH1cbiAgICAgICAgICAgIGNvbG9yPXtnZXRBdmF0YXJDb2xvcihjb2xvcil9XG4gICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPVwiZGlyZWN0XCJcbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc01lPXtCb29sZWFuKGlzTWUpfVxuICAgICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWRkU3Rvcnl9XG4gICAgICAgICAgICBwcm9maWxlTmFtZT17cHJvZmlsZU5hbWV9XG4gICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtzaGFyZWRHcm91cE5hbWVzfVxuICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5GT1JUWV9FSUdIVH1cbiAgICAgICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3JpZXNfX2FkZCcpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiTXlTdG9yaWVzX19hdmF0YXJfX2FkZC1zdG9yeVwiXG4gICAgICAgICAgICBvbkNsaWNrPXtldiA9PiB7XG4gICAgICAgICAgICAgIG9uQWRkU3RvcnkoKTtcbiAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25LZXlEb3duPXtldiA9PiB7XG4gICAgICAgICAgICAgIGlmIChldi5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBvbkFkZFN0b3J5KCk7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19jbGljay1jb250YWluZXJcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgb25LZXlEb3duPXtldiA9PiB7XG4gICAgICAgICAgICBpZiAoZXYua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgIG9uQ2xpY2soKTtcbiAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlMaXN0SXRlbV9faW5mb1wiPlxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19pbmZvLS10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHtpMThuKCdTdG9yaWVzX19taW5lJyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7IW5ld2VzdFN0b3J5ICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5TGlzdEl0ZW1fX2luZm8tLXRpbWVzdGFtcFwiPlxuICAgICAgICAgICAgICAgICAge2kxOG4oJ1N0b3JpZXNfX2FkZCcpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdTdG9yeUxpc3RJdGVtX19sYWJlbCcpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdTdG9yeUxpc3RJdGVtX19wcmV2aWV3cycsIHtcbiAgICAgICAgICAgICAgJ1N0b3J5TGlzdEl0ZW1fX3ByZXZpZXdzLS1tdWx0aXBsZSc6IGhhc011bHRpcGxlLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2hhc011bHRpcGxlICYmIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlMaXN0SXRlbV9fcHJldmlld3MtLW1vcmVcIiAvPn1cbiAgICAgICAgICAgIHtuZXdlc3RTdG9yeSA/IChcbiAgICAgICAgICAgICAgPFN0b3J5SW1hZ2VcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50PXtuZXdlc3RTdG9yeS5hdHRhY2htZW50fVxuICAgICAgICAgICAgICAgIGZpcnN0TmFtZT17aTE4bigneW91Jyl9XG4gICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgaXNUaHVtYm5haWxcbiAgICAgICAgICAgICAgICBsYWJlbD1cIlwiXG4gICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlMaXN0SXRlbV9fcHJldmlld3MtLWltYWdlXCJcbiAgICAgICAgICAgICAgICBxdWV1ZVN0b3J5RG93bmxvYWQ9e3F1ZXVlU3RvcnlEb3dubG9hZH1cbiAgICAgICAgICAgICAgICBzdG9yeUlkPXtuZXdlc3RTdG9yeS5tZXNzYWdlSWR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignU3Rvcmllc19fYWRkJyl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlMaXN0SXRlbV9fcHJldmlld3MtLWFkZCBTdG9yeUxpc3RJdGVtX19wcmV2aWV3cy0taW1hZ2VcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHdCQUF1QjtBQUl2QixvQkFBbUM7QUFDbkMsd0JBQTJCO0FBQzNCLG9CQUErQjtBQVl4QixNQUFNLGtCQUFrQix3QkFBQztBQUFBLEVBQzlCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDNEI7QUFDNUIsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsTUFDRTtBQUVKLFNBQ0UsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ2IsbURBQUM7QUFBQSxJQUNDO0FBQUEsSUFDQTtBQUFBLElBQ0EsT0FBTztBQUFBLElBQ1AsT0FBTyxrQ0FBZSxLQUFLO0FBQUEsSUFDM0Isa0JBQWlCO0FBQUEsSUFDakI7QUFBQSxJQUNBLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0EsTUFBTSx5QkFBVztBQUFBLElBQ2pCO0FBQUEsR0FDRixHQUNBLG1EQUFDO0FBQUEsSUFDQyxjQUFZLEtBQUssY0FBYztBQUFBLElBQy9CLFdBQVU7QUFBQSxJQUNWLFNBQVMsUUFBTTtBQUNiLGlCQUFXO0FBQ1gsU0FBRyxnQkFBZ0I7QUFDbkIsU0FBRyxlQUFlO0FBQUEsSUFDcEI7QUFBQSxJQUNBLFdBQVcsUUFBTTtBQUNmLFVBQUksR0FBRyxRQUFRLFNBQVM7QUFDdEIsbUJBQVc7QUFDWCxXQUFHLGdCQUFnQjtBQUNuQixXQUFHLGVBQWU7QUFBQSxNQUNwQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxHQUNaLENBQ0YsR0FDQSxtREFBQztBQUFBLElBQ0MsV0FBVTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFdBQVcsUUFBTTtBQUNmLFVBQUksR0FBRyxRQUFRLFNBQVM7QUFDdEIsZ0JBQVE7QUFDUixXQUFHLGdCQUFnQjtBQUNuQixXQUFHLGVBQWU7QUFBQSxNQUNwQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxLQUVWLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYix3RkFDRSxtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ1osS0FBSyxlQUFlLENBQ3ZCLEdBQ0MsQ0FBQyxlQUNBLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDWixLQUFLLGNBQWMsQ0FDdEIsQ0FFSixDQUNGLEdBRUEsbURBQUM7QUFBQSxJQUNDLGNBQVksS0FBSyxzQkFBc0I7QUFBQSxJQUN2QyxXQUFXLCtCQUFXLDJCQUEyQjtBQUFBLE1BQy9DLHFDQUFxQztBQUFBLElBQ3ZDLENBQUM7QUFBQSxLQUVBLGVBQWUsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxHQUFnQyxHQUM5RCxjQUNDLG1EQUFDO0FBQUEsSUFDQyxZQUFZLFlBQVk7QUFBQSxJQUN4QixXQUFXLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsSUFDQSxNQUFJO0FBQUEsSUFDSixhQUFXO0FBQUEsSUFDWCxPQUFNO0FBQUEsSUFDTixpQkFBZ0I7QUFBQSxJQUNoQjtBQUFBLElBQ0EsU0FBUyxZQUFZO0FBQUEsR0FDdkIsSUFFQSxtREFBQztBQUFBLElBQ0MsY0FBWSxLQUFLLGNBQWM7QUFBQSxJQUMvQixXQUFVO0FBQUEsR0FDWixDQUVKLENBQ0YsQ0FDRixDQUNGO0FBRUosR0FsSCtCOyIsCiAgIm5hbWVzIjogW10KfQo=
