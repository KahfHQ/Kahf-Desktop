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
var ConversationHero_exports = {};
__export(ConversationHero_exports, {
  ConversationHero: () => ConversationHero
});
module.exports = __toCommonJS(ConversationHero_exports);
var import_react = __toESM(require("react"));
var import_Avatar = require("../Avatar");
var import_ContactName = require("./ContactName");
var import_About = require("./About");
var import_GroupDescription = require("./GroupDescription");
var import_SharedGroupNames = require("../SharedGroupNames");
var import_ConfirmationDialog = require("../ConfirmationDialog");
var import_Button = require("../Button");
var import_shouldBlurAvatar = require("../../util/shouldBlurAvatar");
var import_openLinkInWebBrowser = require("../../util/openLinkInWebBrowser");
const renderMembershipRow = /* @__PURE__ */ __name(({
  acceptedMessageRequest,
  conversationType,
  i18n,
  isMe,
  onClickMessageRequestWarning,
  phoneNumber,
  sharedGroupNames
}) => {
  const className = "module-conversation-hero__membership";
  if (conversationType !== "direct") {
    return null;
  }
  if (isMe) {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className
    }, i18n("noteToSelfHero"));
  }
  if (sharedGroupNames.length > 0) {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className
    }, /* @__PURE__ */ import_react.default.createElement(import_SharedGroupNames.SharedGroupNames, {
      i18n,
      nameClassName: `${className}__name`,
      sharedGroupNames
    }));
  }
  if (acceptedMessageRequest) {
    if (phoneNumber) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className
    }, i18n("no-groups-in-common"));
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-conversation-hero__message-request-warning"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-conversation-hero__message-request-warning__message"
  }, i18n("no-groups-in-common-warning")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    onClick: onClickMessageRequestWarning,
    size: import_Button.ButtonSize.Small,
    variant: import_Button.ButtonVariant.SecondaryAffirmative
  }, i18n("MessageRequestWarning__learn-more")));
}, "renderMembershipRow");
const ConversationHero = /* @__PURE__ */ __name(({
  i18n,
  about,
  acceptedMessageRequest,
  avatarPath,
  badge,
  color,
  conversationType,
  groupDescription,
  hasStories,
  id,
  isMe,
  membersCount,
  sharedGroupNames = [],
  name,
  phoneNumber,
  profileName,
  theme,
  title,
  unblurAvatar,
  unblurredAvatarPath,
  updateSharedGroups,
  viewUserStories
}) => {
  const [isShowingMessageRequestWarning, setIsShowingMessageRequestWarning] = (0, import_react.useState)(false);
  const closeMessageRequestWarning = /* @__PURE__ */ __name(() => {
    setIsShowingMessageRequestWarning(false);
  }, "closeMessageRequestWarning");
  (0, import_react.useEffect)(() => {
    updateSharedGroups();
  }, [updateSharedGroups]);
  let avatarBlur = import_Avatar.AvatarBlur.NoBlur;
  let avatarOnClick;
  if ((0, import_shouldBlurAvatar.shouldBlurAvatar)({
    acceptedMessageRequest,
    avatarPath,
    isMe,
    sharedGroupNames,
    unblurredAvatarPath
  })) {
    avatarBlur = import_Avatar.AvatarBlur.BlurPictureWithClickToView;
    avatarOnClick = unblurAvatar;
  } else if (hasStories) {
    avatarOnClick = /* @__PURE__ */ __name(() => {
      viewUserStories(id);
    }, "avatarOnClick");
  }
  const phoneNumberOnly = Boolean(!name && !profileName && conversationType === "direct");
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-conversation-hero"
  }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest,
    avatarPath,
    badge,
    blur: avatarBlur,
    className: "module-conversation-hero__avatar",
    color,
    conversationType,
    i18n,
    isMe,
    name,
    noteToSelf: isMe,
    onClick: avatarOnClick,
    profileName,
    sharedGroupNames,
    size: 112,
    storyRing: hasStories,
    theme,
    title
  }), /* @__PURE__ */ import_react.default.createElement("h1", {
    className: "module-conversation-hero__profile-name"
  }, isMe ? i18n("noteToSelf") : /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
    title
  })), about && !isMe && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-about__container"
  }, /* @__PURE__ */ import_react.default.createElement(import_About.About, {
    text: about
  })), !isMe ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-conversation-hero__with"
  }, groupDescription ? /* @__PURE__ */ import_react.default.createElement(import_GroupDescription.GroupDescription, {
    i18n,
    title,
    text: groupDescription
  }) : membersCount === 1 ? i18n("ConversationHero--members-1") : membersCount !== void 0 ? i18n("ConversationHero--members", [`${membersCount}`]) : phoneNumberOnly ? null : phoneNumber) : null, renderMembershipRow({
    acceptedMessageRequest,
    conversationType,
    i18n,
    isMe,
    onClickMessageRequestWarning() {
      setIsShowingMessageRequestWarning(true);
    },
    phoneNumber,
    sharedGroupNames
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-conversation-hero__linkNotification"
  }, i18n("messageHistoryUnsynced"))), isShowingMessageRequestWarning && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    i18n,
    onClose: closeMessageRequestWarning,
    actions: [
      {
        text: i18n("MessageRequestWarning__dialog__learn-even-more"),
        action: () => {
          (0, import_openLinkInWebBrowser.openLinkInWebBrowser)("https://support.signal.org/hc/articles/360007459591");
          closeMessageRequestWarning();
        }
      }
    ]
  }, i18n("MessageRequestWarning__dialog__details")));
}, "ConversationHero");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationHero
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uSGVyby50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgQXZhdGFyUHJvcHMgfSBmcm9tICcuLi9BdmF0YXInO1xuaW1wb3J0IHsgQXZhdGFyLCBBdmF0YXJCbHVyIH0gZnJvbSAnLi4vQXZhdGFyJztcbmltcG9ydCB7IENvbnRhY3ROYW1lIH0gZnJvbSAnLi9Db250YWN0TmFtZSc7XG5pbXBvcnQgeyBBYm91dCB9IGZyb20gJy4vQWJvdXQnO1xuaW1wb3J0IHsgR3JvdXBEZXNjcmlwdGlvbiB9IGZyb20gJy4vR3JvdXBEZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBTaGFyZWRHcm91cE5hbWVzIH0gZnJvbSAnLi4vU2hhcmVkR3JvdXBOYW1lcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIFRoZW1lVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBDb25maXJtYXRpb25EaWFsb2cgfSBmcm9tICcuLi9Db25maXJtYXRpb25EaWFsb2cnO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25TaXplLCBCdXR0b25WYXJpYW50IH0gZnJvbSAnLi4vQnV0dG9uJztcbmltcG9ydCB7IHNob3VsZEJsdXJBdmF0YXIgfSBmcm9tICcuLi8uLi91dGlsL3Nob3VsZEJsdXJBdmF0YXInO1xuaW1wb3J0IHsgb3BlbkxpbmtJbldlYkJyb3dzZXIgfSBmcm9tICcuLi8uLi91dGlsL29wZW5MaW5rSW5XZWJCcm93c2VyJztcblxuZXhwb3J0IHR5cGUgUHJvcHMgPSB7XG4gIGFib3V0Pzogc3RyaW5nO1xuICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PzogYm9vbGVhbjtcbiAgZ3JvdXBEZXNjcmlwdGlvbj86IHN0cmluZztcbiAgaGFzU3Rvcmllcz86IEhhc1N0b3JpZXM7XG4gIGlkOiBzdHJpbmc7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIGlzTWU6IGJvb2xlYW47XG4gIG1lbWJlcnNDb3VudD86IG51bWJlcjtcbiAgcGhvbmVOdW1iZXI/OiBzdHJpbmc7XG4gIHNoYXJlZEdyb3VwTmFtZXM/OiBBcnJheTxzdHJpbmc+O1xuICB1bmJsdXJBdmF0YXI6ICgpID0+IHZvaWQ7XG4gIHVuYmx1cnJlZEF2YXRhclBhdGg/OiBzdHJpbmc7XG4gIHVwZGF0ZVNoYXJlZEdyb3VwczogKCkgPT4gdW5rbm93bjtcbiAgdGhlbWU6IFRoZW1lVHlwZTtcbiAgdmlld1VzZXJTdG9yaWVzOiAoY2lkOiBzdHJpbmcpID0+IHVua25vd247XG59ICYgT21pdDxBdmF0YXJQcm9wcywgJ29uQ2xpY2snIHwgJ3NpemUnIHwgJ25vdGVUb1NlbGYnPjtcblxuY29uc3QgcmVuZGVyTWVtYmVyc2hpcFJvdyA9ICh7XG4gIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gIGNvbnZlcnNhdGlvblR5cGUsXG4gIGkxOG4sXG4gIGlzTWUsXG4gIG9uQ2xpY2tNZXNzYWdlUmVxdWVzdFdhcm5pbmcsXG4gIHBob25lTnVtYmVyLFxuICBzaGFyZWRHcm91cE5hbWVzLFxufTogUGljazxcbiAgUHJvcHMsXG4gIHwgJ2FjY2VwdGVkTWVzc2FnZVJlcXVlc3QnXG4gIHwgJ2NvbnZlcnNhdGlvblR5cGUnXG4gIHwgJ2kxOG4nXG4gIHwgJ2lzTWUnXG4gIHwgJ3Bob25lTnVtYmVyJ1xuPiAmXG4gIFJlcXVpcmVkPFBpY2s8UHJvcHMsICdzaGFyZWRHcm91cE5hbWVzJz4+ICYge1xuICAgIG9uQ2xpY2tNZXNzYWdlUmVxdWVzdFdhcm5pbmc6ICgpID0+IHZvaWQ7XG4gIH0pID0+IHtcbiAgY29uc3QgY2xhc3NOYW1lID0gJ21vZHVsZS1jb252ZXJzYXRpb24taGVyb19fbWVtYmVyc2hpcCc7XG5cbiAgaWYgKGNvbnZlcnNhdGlvblR5cGUgIT09ICdkaXJlY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoaXNNZSkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57aTE4bignbm90ZVRvU2VsZkhlcm8nKX08L2Rpdj47XG4gIH1cblxuICBpZiAoc2hhcmVkR3JvdXBOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICA8U2hhcmVkR3JvdXBOYW1lc1xuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgbmFtZUNsYXNzTmFtZT17YCR7Y2xhc3NOYW1lfV9fbmFtZWB9XG4gICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17c2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgaWYgKGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QpIHtcbiAgICBpZiAocGhvbmVOdW1iZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2kxOG4oJ25vLWdyb3Vwcy1pbi1jb21tb24nKX08L2Rpdj47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWNvbnZlcnNhdGlvbi1oZXJvX19tZXNzYWdlLXJlcXVlc3Qtd2FybmluZ1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtY29udmVyc2F0aW9uLWhlcm9fX21lc3NhZ2UtcmVxdWVzdC13YXJuaW5nX19tZXNzYWdlXCI+XG4gICAgICAgIHtpMThuKCduby1ncm91cHMtaW4tY29tbW9uLXdhcm5pbmcnKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPEJ1dHRvblxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrTWVzc2FnZVJlcXVlc3RXYXJuaW5nfVxuICAgICAgICBzaXplPXtCdXR0b25TaXplLlNtYWxsfVxuICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlNlY29uZGFyeUFmZmlybWF0aXZlfVxuICAgICAgPlxuICAgICAgICB7aTE4bignTWVzc2FnZVJlcXVlc3RXYXJuaW5nX19sZWFybi1tb3JlJyl9XG4gICAgICA8L0J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBDb252ZXJzYXRpb25IZXJvID0gKHtcbiAgaTE4bixcbiAgYWJvdXQsXG4gIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gIGF2YXRhclBhdGgsXG4gIGJhZGdlLFxuICBjb2xvcixcbiAgY29udmVyc2F0aW9uVHlwZSxcbiAgZ3JvdXBEZXNjcmlwdGlvbixcbiAgaGFzU3RvcmllcyxcbiAgaWQsXG4gIGlzTWUsXG4gIG1lbWJlcnNDb3VudCxcbiAgc2hhcmVkR3JvdXBOYW1lcyA9IFtdLFxuICBuYW1lLFxuICBwaG9uZU51bWJlcixcbiAgcHJvZmlsZU5hbWUsXG4gIHRoZW1lLFxuICB0aXRsZSxcbiAgdW5ibHVyQXZhdGFyLFxuICB1bmJsdXJyZWRBdmF0YXJQYXRoLFxuICB1cGRhdGVTaGFyZWRHcm91cHMsXG4gIHZpZXdVc2VyU3Rvcmllcyxcbn06IFByb3BzKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbaXNTaG93aW5nTWVzc2FnZVJlcXVlc3RXYXJuaW5nLCBzZXRJc1Nob3dpbmdNZXNzYWdlUmVxdWVzdFdhcm5pbmddID1cbiAgICB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGNsb3NlTWVzc2FnZVJlcXVlc3RXYXJuaW5nID0gKCkgPT4ge1xuICAgIHNldElzU2hvd2luZ01lc3NhZ2VSZXF1ZXN0V2FybmluZyhmYWxzZSk7XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBLaWNrIG9mZiB0aGUgZXhwZW5zaXZlIGh5ZHJhdGlvbiBvZiB0aGUgY3VycmVudCBzaGFyZWRHcm91cE5hbWVzXG4gICAgdXBkYXRlU2hhcmVkR3JvdXBzKCk7XG4gIH0sIFt1cGRhdGVTaGFyZWRHcm91cHNdKTtcblxuICBsZXQgYXZhdGFyQmx1cjogQXZhdGFyQmx1ciA9IEF2YXRhckJsdXIuTm9CbHVyO1xuICBsZXQgYXZhdGFyT25DbGljazogdW5kZWZpbmVkIHwgKCgpID0+IHZvaWQpO1xuICBpZiAoXG4gICAgc2hvdWxkQmx1ckF2YXRhcih7XG4gICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0LFxuICAgICAgYXZhdGFyUGF0aCxcbiAgICAgIGlzTWUsXG4gICAgICBzaGFyZWRHcm91cE5hbWVzLFxuICAgICAgdW5ibHVycmVkQXZhdGFyUGF0aCxcbiAgICB9KVxuICApIHtcbiAgICBhdmF0YXJCbHVyID0gQXZhdGFyQmx1ci5CbHVyUGljdHVyZVdpdGhDbGlja1RvVmlldztcbiAgICBhdmF0YXJPbkNsaWNrID0gdW5ibHVyQXZhdGFyO1xuICB9IGVsc2UgaWYgKGhhc1N0b3JpZXMpIHtcbiAgICBhdmF0YXJPbkNsaWNrID0gKCkgPT4ge1xuICAgICAgdmlld1VzZXJTdG9yaWVzKGlkKTtcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgcGhvbmVOdW1iZXJPbmx5ID0gQm9vbGVhbihcbiAgICAhbmFtZSAmJiAhcHJvZmlsZU5hbWUgJiYgY29udmVyc2F0aW9uVHlwZSA9PT0gJ2RpcmVjdCdcbiAgKTtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1jb252ZXJzYXRpb24taGVyb1wiPlxuICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17YWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICBhdmF0YXJQYXRoPXthdmF0YXJQYXRofVxuICAgICAgICAgIGJhZGdlPXtiYWRnZX1cbiAgICAgICAgICBibHVyPXthdmF0YXJCbHVyfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1jb252ZXJzYXRpb24taGVyb19fYXZhdGFyXCJcbiAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgY29udmVyc2F0aW9uVHlwZT17Y29udmVyc2F0aW9uVHlwZX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIGlzTWU9e2lzTWV9XG4gICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICBub3RlVG9TZWxmPXtpc01lfVxuICAgICAgICAgIG9uQ2xpY2s9e2F2YXRhck9uQ2xpY2t9XG4gICAgICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e3NoYXJlZEdyb3VwTmFtZXN9XG4gICAgICAgICAgc2l6ZT17MTEyfVxuICAgICAgICAgIHN0b3J5UmluZz17aGFzU3Rvcmllc31cbiAgICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICAvPlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwibW9kdWxlLWNvbnZlcnNhdGlvbi1oZXJvX19wcm9maWxlLW5hbWVcIj5cbiAgICAgICAgICB7aXNNZSA/IGkxOG4oJ25vdGVUb1NlbGYnKSA6IDxDb250YWN0TmFtZSB0aXRsZT17dGl0bGV9IC8+fVxuICAgICAgICA8L2gxPlxuICAgICAgICB7YWJvdXQgJiYgIWlzTWUgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWFib3V0X19jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxBYm91dCB0ZXh0PXthYm91dH0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgeyFpc01lID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWNvbnZlcnNhdGlvbi1oZXJvX193aXRoXCI+XG4gICAgICAgICAgICB7Z3JvdXBEZXNjcmlwdGlvbiA/IChcbiAgICAgICAgICAgICAgPEdyb3VwRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgICAgICAgICB0ZXh0PXtncm91cERlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IG1lbWJlcnNDb3VudCA9PT0gMSA/IChcbiAgICAgICAgICAgICAgaTE4bignQ29udmVyc2F0aW9uSGVyby0tbWVtYmVycy0xJylcbiAgICAgICAgICAgICkgOiBtZW1iZXJzQ291bnQgIT09IHVuZGVmaW5lZCA/IChcbiAgICAgICAgICAgICAgaTE4bignQ29udmVyc2F0aW9uSGVyby0tbWVtYmVycycsIFtgJHttZW1iZXJzQ291bnR9YF0pXG4gICAgICAgICAgICApIDogcGhvbmVOdW1iZXJPbmx5ID8gbnVsbCA6IChcbiAgICAgICAgICAgICAgcGhvbmVOdW1iZXJcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICB7cmVuZGVyTWVtYmVyc2hpcFJvdyh7XG4gICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCxcbiAgICAgICAgICBjb252ZXJzYXRpb25UeXBlLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgaXNNZSxcbiAgICAgICAgICBvbkNsaWNrTWVzc2FnZVJlcXVlc3RXYXJuaW5nKCkge1xuICAgICAgICAgICAgc2V0SXNTaG93aW5nTWVzc2FnZVJlcXVlc3RXYXJuaW5nKHRydWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcGhvbmVOdW1iZXIsXG4gICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgICAgICAgfSl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWNvbnZlcnNhdGlvbi1oZXJvX19saW5rTm90aWZpY2F0aW9uXCI+XG4gICAgICAgICAge2kxOG4oJ21lc3NhZ2VIaXN0b3J5VW5zeW5jZWQnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtpc1Nob3dpbmdNZXNzYWdlUmVxdWVzdFdhcm5pbmcgJiYgKFxuICAgICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBvbkNsb3NlPXtjbG9zZU1lc3NhZ2VSZXF1ZXN0V2FybmluZ31cbiAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ01lc3NhZ2VSZXF1ZXN0V2FybmluZ19fZGlhbG9nX19sZWFybi1ldmVuLW1vcmUnKSxcbiAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3BlbkxpbmtJbldlYkJyb3dzZXIoXG4gICAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zdXBwb3J0LnNpZ25hbC5vcmcvaGMvYXJ0aWNsZXMvMzYwMDA3NDU5NTkxJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY2xvc2VNZXNzYWdlUmVxdWVzdFdhcm5pbmcoKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdNZXNzYWdlUmVxdWVzdFdhcm5pbmdfX2RpYWxvZ19fZGV0YWlscycpfVxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQTJDO0FBRTNDLG9CQUFtQztBQUNuQyx5QkFBNEI7QUFDNUIsbUJBQXNCO0FBQ3RCLDhCQUFp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
