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
var StoryListItem_exports = {};
__export(StoryListItem_exports, {
  StoryListItem: () => StoryListItem
});
module.exports = __toCommonJS(StoryListItem_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_Avatar = require("./Avatar");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_ContextMenu = require("./ContextMenu");
var import_Stories = require("../types/Stories");
var import_MessageTimestamp = require("./conversation/MessageTimestamp");
var import_StoryImage = require("./StoryImage");
var import_Util = require("../types/Util");
var import_Colors = require("../types/Colors");
function StoryListItemAvatar({
  acceptedMessageRequest,
  avatarPath,
  avatarStoryRing,
  badges,
  color,
  getPreferredBadge,
  i18n,
  isMe,
  name,
  profileName,
  sharedGroupNames,
  title
}) {
  return /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest,
    avatarPath,
    badge: badges ? getPreferredBadge(badges) : void 0,
    color: (0, import_Colors.getAvatarColor)(color),
    conversationType: "direct",
    i18n,
    isMe: Boolean(isMe),
    name,
    profileName,
    sharedGroupNames,
    size: import_Avatar.AvatarSize.FORTY_EIGHT,
    storyRing: avatarStoryRing,
    theme: import_Util.ThemeType.dark,
    title
  });
}
const StoryListItem = /* @__PURE__ */ __name(({
  conversationId,
  getPreferredBadge,
  group,
  i18n,
  isHidden,
  onGoToConversation,
  onHideStory,
  queueStoryDownload,
  story,
  viewUserStories
}) => {
  const [hasConfirmHideStory, setHasConfirmHideStory] = (0, import_react.useState)(false);
  const {
    attachment,
    hasReplies,
    hasRepliesFromSelf,
    isUnread,
    sender,
    timestamp
  } = story;
  const { firstName, title } = sender;
  let avatarStoryRing;
  if (attachment) {
    avatarStoryRing = isUnread ? import_Stories.HasStories.Unread : import_Stories.HasStories.Read;
  }
  let repliesElement;
  if (hasRepliesFromSelf) {
    repliesElement = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryListItem__info--replies--self"
    });
  } else if (hasReplies) {
    repliesElement = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryListItem__info--replies--others"
    });
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    "aria-label": i18n("StoryListItem__label"),
    i18n,
    menuOptions: [
      {
        icon: "StoryListItem__icon--hide",
        label: isHidden ? i18n("StoryListItem__unhide") : i18n("StoryListItem__hide"),
        onClick: () => {
          if (isHidden) {
            onHideStory(conversationId);
          } else {
            setHasConfirmHideStory(true);
          }
        }
      },
      {
        icon: "StoryListItem__icon--info",
        label: i18n("StoryListItem__info"),
        onClick: () => viewUserStories(conversationId, true)
      },
      {
        icon: "StoryListItem__icon--chat",
        label: i18n("StoryListItem__go-to-chat"),
        onClick: () => onGoToConversation(conversationId)
      }
    ],
    moduleClassName: (0, import_classnames.default)("StoryListItem", {
      "StoryListItem--hidden": isHidden
    }),
    onClick: () => viewUserStories(conversationId),
    popperOptions: {
      placement: "bottom",
      strategy: "absolute"
    }
  }, /* @__PURE__ */ import_react.default.createElement(StoryListItemAvatar, {
    avatarStoryRing,
    getPreferredBadge,
    i18n,
    ...group || sender
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__info"
  }, /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__info--title"
  }, group ? group.title : title), /* @__PURE__ */ import_react.default.createElement(import_MessageTimestamp.MessageTimestamp, {
    i18n,
    isRelativeTime: true,
    module: "StoryListItem__info--timestamp",
    timestamp
  })), repliesElement), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryListItem__previews"
  }, /* @__PURE__ */ import_react.default.createElement(import_StoryImage.StoryImage, {
    attachment,
    firstName: firstName || title,
    i18n,
    isThumbnail: true,
    label: "",
    moduleClassName: "StoryListItem__previews--image",
    queueStoryDownload,
    storyId: story.messageId
  }))), hasConfirmHideStory && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        action: () => onHideStory(conversationId),
        style: "affirmative",
        text: i18n("StoryListItem__hide-modal--confirm")
      }
    ],
    i18n,
    onClose: () => {
      setHasConfirmHideStory(false);
    }
  }, i18n("StoryListItem__hide-modal--body", [String(firstName)])));
}, "StoryListItem");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryListItem
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlMaXN0SXRlbS50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uU3RvcnlUeXBlLCBTdG9yeVZpZXdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4vQXZhdGFyJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi9Db250ZXh0TWVudSc7XG5pbXBvcnQgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBNZXNzYWdlVGltZXN0YW1wIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vTWVzc2FnZVRpbWVzdGFtcCc7XG5pbXBvcnQgeyBTdG9yeUltYWdlIH0gZnJvbSAnLi9TdG9yeUltYWdlJztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHsgZ2V0QXZhdGFyQ29sb3IgfSBmcm9tICcuLi90eXBlcy9Db2xvcnMnO1xuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSBQaWNrPENvbnZlcnNhdGlvblN0b3J5VHlwZSwgJ2dyb3VwJyB8ICdpc0hpZGRlbic+ICYge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBnZXRQcmVmZXJyZWRCYWRnZTogUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGU7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIG9uR29Ub0NvbnZlcnNhdGlvbjogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG9uSGlkZVN0b3J5OiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcXVldWVTdG9yeURvd25sb2FkOiAoc3RvcnlJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBzdG9yeTogU3RvcnlWaWV3VHlwZTtcbiAgdmlld1VzZXJTdG9yaWVzOiAoXG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgICBzaG91bGRTaG93RGV0YWlsc01vZGFsPzogYm9vbGVhblxuICApID0+IHVua25vd247XG59O1xuXG5mdW5jdGlvbiBTdG9yeUxpc3RJdGVtQXZhdGFyKHtcbiAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCxcbiAgYXZhdGFyUGF0aCxcbiAgYXZhdGFyU3RvcnlSaW5nLFxuICBiYWRnZXMsXG4gIGNvbG9yLFxuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgaTE4bixcbiAgaXNNZSxcbiAgbmFtZSxcbiAgcHJvZmlsZU5hbWUsXG4gIHNoYXJlZEdyb3VwTmFtZXMsXG4gIHRpdGxlLFxufTogUGljazxcbiAgQ29udmVyc2F0aW9uVHlwZSxcbiAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgfCAnYXZhdGFyUGF0aCdcbiAgfCAnY29sb3InXG4gIHwgJ25hbWUnXG4gIHwgJ3Byb2ZpbGVOYW1lJ1xuICB8ICdzaGFyZWRHcm91cE5hbWVzJ1xuICB8ICd0aXRsZSdcbj4gJiB7XG4gIGF2YXRhclN0b3J5UmluZz86IEhhc1N0b3JpZXM7XG4gIGJhZGdlcz86IENvbnZlcnNhdGlvblR5cGVbJ2JhZGdlcyddO1xuICBnZXRQcmVmZXJyZWRCYWRnZTogUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGU7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIGlzTWU/OiBib29sZWFuO1xufSk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIChcbiAgICA8QXZhdGFyXG4gICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXthY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0fVxuICAgICAgYXZhdGFyUGF0aD17YXZhdGFyUGF0aH1cbiAgICAgIGJhZGdlPXtiYWRnZXMgPyBnZXRQcmVmZXJyZWRCYWRnZShiYWRnZXMpIDogdW5kZWZpbmVkfVxuICAgICAgY29sb3I9e2dldEF2YXRhckNvbG9yKGNvbG9yKX1cbiAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgICAgaTE4bj17aTE4bn1cbiAgICAgIGlzTWU9e0Jvb2xlYW4oaXNNZSl9XG4gICAgICBuYW1lPXtuYW1lfVxuICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgc2hhcmVkR3JvdXBOYW1lcz17c2hhcmVkR3JvdXBOYW1lc31cbiAgICAgIHNpemU9e0F2YXRhclNpemUuRk9SVFlfRUlHSFR9XG4gICAgICBzdG9yeVJpbmc9e2F2YXRhclN0b3J5UmluZ31cbiAgICAgIHRoZW1lPXtUaGVtZVR5cGUuZGFya31cbiAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAvPlxuICApO1xufVxuXG5leHBvcnQgY29uc3QgU3RvcnlMaXN0SXRlbSA9ICh7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgZ3JvdXAsXG4gIGkxOG4sXG4gIGlzSGlkZGVuLFxuICBvbkdvVG9Db252ZXJzYXRpb24sXG4gIG9uSGlkZVN0b3J5LFxuICBxdWV1ZVN0b3J5RG93bmxvYWQsXG4gIHN0b3J5LFxuICB2aWV3VXNlclN0b3JpZXMsXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IFtoYXNDb25maXJtSGlkZVN0b3J5LCBzZXRIYXNDb25maXJtSGlkZVN0b3J5XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7XG4gICAgYXR0YWNobWVudCxcbiAgICBoYXNSZXBsaWVzLFxuICAgIGhhc1JlcGxpZXNGcm9tU2VsZixcbiAgICBpc1VucmVhZCxcbiAgICBzZW5kZXIsXG4gICAgdGltZXN0YW1wLFxuICB9ID0gc3Rvcnk7XG5cbiAgY29uc3QgeyBmaXJzdE5hbWUsIHRpdGxlIH0gPSBzZW5kZXI7XG5cbiAgbGV0IGF2YXRhclN0b3J5UmluZzogSGFzU3RvcmllcyB8IHVuZGVmaW5lZDtcbiAgaWYgKGF0dGFjaG1lbnQpIHtcbiAgICBhdmF0YXJTdG9yeVJpbmcgPSBpc1VucmVhZCA/IEhhc1N0b3JpZXMuVW5yZWFkIDogSGFzU3Rvcmllcy5SZWFkO1xuICB9XG5cbiAgbGV0IHJlcGxpZXNFbGVtZW50OiBKU1guRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgaWYgKGhhc1JlcGxpZXNGcm9tU2VsZikge1xuICAgIHJlcGxpZXNFbGVtZW50ID0gPGRpdiBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19pbmZvLS1yZXBsaWVzLS1zZWxmXCIgLz47XG4gIH0gZWxzZSBpZiAoaGFzUmVwbGllcykge1xuICAgIHJlcGxpZXNFbGVtZW50ID0gPGRpdiBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19pbmZvLS1yZXBsaWVzLS1vdGhlcnNcIiAvPjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxDb250ZXh0TWVudVxuICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdTdG9yeUxpc3RJdGVtX19sYWJlbCcpfVxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGljb246ICdTdG9yeUxpc3RJdGVtX19pY29uLS1oaWRlJyxcbiAgICAgICAgICAgIGxhYmVsOiBpc0hpZGRlblxuICAgICAgICAgICAgICA/IGkxOG4oJ1N0b3J5TGlzdEl0ZW1fX3VuaGlkZScpXG4gICAgICAgICAgICAgIDogaTE4bignU3RvcnlMaXN0SXRlbV9faGlkZScpLFxuICAgICAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBvbkhpZGVTdG9yeShjb252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0SGFzQ29uZmlybUhpZGVTdG9yeSh0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGljb246ICdTdG9yeUxpc3RJdGVtX19pY29uLS1pbmZvJyxcbiAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeUxpc3RJdGVtX19pbmZvJyksXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB2aWV3VXNlclN0b3JpZXMoY29udmVyc2F0aW9uSWQsIHRydWUpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWNvbjogJ1N0b3J5TGlzdEl0ZW1fX2ljb24tLWNoYXQnLFxuICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5TGlzdEl0ZW1fX2dvLXRvLWNoYXQnKSxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IG9uR29Ub0NvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXX1cbiAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPXtjbGFzc05hbWVzKCdTdG9yeUxpc3RJdGVtJywge1xuICAgICAgICAgICdTdG9yeUxpc3RJdGVtLS1oaWRkZW4nOiBpc0hpZGRlbixcbiAgICAgICAgfSl9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHZpZXdVc2VyU3Rvcmllcyhjb252ZXJzYXRpb25JZCl9XG4gICAgICAgIHBvcHBlck9wdGlvbnM9e3tcbiAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RvcnlMaXN0SXRlbUF2YXRhclxuICAgICAgICAgIGF2YXRhclN0b3J5UmluZz17YXZhdGFyU3RvcnlSaW5nfVxuICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIHsuLi4oZ3JvdXAgfHwgc2VuZGVyKX1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19pbmZvXCI+XG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlMaXN0SXRlbV9faW5mby0tdGl0bGVcIj5cbiAgICAgICAgICAgICAge2dyb3VwID8gZ3JvdXAudGl0bGUgOiB0aXRsZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPE1lc3NhZ2VUaW1lc3RhbXBcbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaXNSZWxhdGl2ZVRpbWVcbiAgICAgICAgICAgICAgbW9kdWxlPVwiU3RvcnlMaXN0SXRlbV9faW5mby0tdGltZXN0YW1wXCJcbiAgICAgICAgICAgICAgdGltZXN0YW1wPXt0aW1lc3RhbXB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvPlxuICAgICAgICAgIHtyZXBsaWVzRWxlbWVudH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUxpc3RJdGVtX19wcmV2aWV3c1wiPlxuICAgICAgICAgIDxTdG9yeUltYWdlXG4gICAgICAgICAgICBhdHRhY2htZW50PXthdHRhY2htZW50fVxuICAgICAgICAgICAgZmlyc3ROYW1lPXtmaXJzdE5hbWUgfHwgdGl0bGV9XG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgaXNUaHVtYm5haWxcbiAgICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3J5TGlzdEl0ZW1fX3ByZXZpZXdzLS1pbWFnZVwiXG4gICAgICAgICAgICBxdWV1ZVN0b3J5RG93bmxvYWQ9e3F1ZXVlU3RvcnlEb3dubG9hZH1cbiAgICAgICAgICAgIHN0b3J5SWQ9e3N0b3J5Lm1lc3NhZ2VJZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGV4dE1lbnU+XG4gICAgICB7aGFzQ29uZmlybUhpZGVTdG9yeSAmJiAoXG4gICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gb25IaWRlU3RvcnkoY29udmVyc2F0aW9uSWQpLFxuICAgICAgICAgICAgICBzdHlsZTogJ2FmZmlybWF0aXZlJyxcbiAgICAgICAgICAgICAgdGV4dDogaTE4bignU3RvcnlMaXN0SXRlbV9faGlkZS1tb2RhbC0tY29uZmlybScpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdfVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgICAgc2V0SGFzQ29uZmlybUhpZGVTdG9yeShmYWxzZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdTdG9yeUxpc3RJdGVtX19oaWRlLW1vZGFsLS1ib2R5JywgW1N0cmluZyhmaXJzdE5hbWUpXSl9XG4gICAgICAgIDwvQ29uZmlybWF0aW9uRGlhbG9nPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFB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
