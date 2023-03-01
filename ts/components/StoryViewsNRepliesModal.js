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
var StoryViewsNRepliesModal_exports = {};
__export(StoryViewsNRepliesModal_exports, {
  StoryViewsNRepliesModal: () => StoryViewsNRepliesModal
});
module.exports = __toCommonJS(StoryViewsNRepliesModal_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_react_popper = require("react-popper");
var import_Avatar = require("./Avatar");
var import_CompositionInput = require("./CompositionInput");
var import_ContactName = require("./conversation/ContactName");
var import_EmojiButton = require("./emoji/EmojiButton");
var import_Emojify = require("./conversation/Emojify");
var import_Message = require("./conversation/Message");
var import_MessageTimestamp = require("./conversation/MessageTimestamp");
var import_Modal = require("./Modal");
var import_Quote = require("./conversation/Quote");
var import_ReactionPicker = require("./conversation/ReactionPicker");
var import_Tabs = require("./Tabs");
var import_theme = require("../util/theme");
var import_Util = require("../types/Util");
var import_util = require("./_util");
var import_Colors = require("../types/Colors");
var import_getStoryReplyText = require("../util/getStoryReplyText");
var import_shouldNeverBeCalled = require("../util/shouldNeverBeCalled");
const MESSAGE_DEFAULT_PROPS = {
  canDeleteForEveryone: false,
  canDownload: false,
  canReact: false,
  canReply: false,
  canRetry: false,
  canRetryDeleteForEveryone: false,
  checkForAccount: import_shouldNeverBeCalled.shouldNeverBeCalled,
  clearSelectedMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  containerWidthBreakpoint: import_util.WidthBreakpoint.Medium,
  deleteMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  deleteMessageForEveryone: import_shouldNeverBeCalled.shouldNeverBeCalled,
  displayTapToViewMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  doubleCheckMissingQuoteReference: import_shouldNeverBeCalled.shouldNeverBeCalled,
  downloadAttachment: import_shouldNeverBeCalled.shouldNeverBeCalled,
  isBlocked: false,
  isMessageRequestAccepted: true,
  kickOffAttachmentDownload: import_shouldNeverBeCalled.shouldNeverBeCalled,
  markAttachmentAsCorrupted: import_shouldNeverBeCalled.shouldNeverBeCalled,
  markViewed: import_shouldNeverBeCalled.shouldNeverBeCalled,
  messageExpanded: import_shouldNeverBeCalled.shouldNeverBeCalled,
  openConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
  openGiftBadge: import_shouldNeverBeCalled.shouldNeverBeCalled,
  openLink: import_shouldNeverBeCalled.shouldNeverBeCalled,
  previews: [],
  reactToMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  renderAudioAttachment: () => /* @__PURE__ */ import_react.default.createElement("div", null),
  renderEmojiPicker: () => /* @__PURE__ */ import_react.default.createElement("div", null),
  renderReactionPicker: () => /* @__PURE__ */ import_react.default.createElement("div", null),
  replyToMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  retryDeleteForEveryone: import_shouldNeverBeCalled.shouldNeverBeCalled,
  retrySend: import_shouldNeverBeCalled.shouldNeverBeCalled,
  scrollToQuotedMessage: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showContactDetail: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showContactModal: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showExpiredIncomingTapToViewToast: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showExpiredOutgoingTapToViewToast: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showForwardMessageModal: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showMessageDetail: import_shouldNeverBeCalled.shouldNeverBeCalled,
  showVisualAttachment: import_shouldNeverBeCalled.shouldNeverBeCalled,
  startConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
  theme: import_Util.ThemeType.dark,
  viewStory: import_shouldNeverBeCalled.shouldNeverBeCalled
};
var Tab = /* @__PURE__ */ ((Tab2) => {
  Tab2["Replies"] = "Replies";
  Tab2["Views"] = "Views";
  return Tab2;
})(Tab || {});
const StoryViewsNRepliesModal = /* @__PURE__ */ __name(({
  authorTitle,
  canReply,
  getPreferredBadge,
  i18n,
  isGroupStory,
  isMyStory,
  onClose,
  onReact,
  onReply,
  onSetSkinTone,
  onTextTooLong,
  onUseEmoji,
  preferredReactionEmoji,
  recentEmojis,
  renderEmojiPicker,
  replies,
  skinTone,
  storyPreviewAttachment,
  views
}) => {
  const containerElementRef = (0, import_react.useRef)(null);
  const inputApiRef = (0, import_react.useRef)();
  const [bottom, setBottom] = (0, import_react.useState)(null);
  const [messageBodyText, setMessageBodyText] = (0, import_react.useState)("");
  const [showReactionPicker, setShowReactionPicker] = (0, import_react.useState)(false);
  const focusComposer = (0, import_react.useCallback)(() => {
    if (inputApiRef.current) {
      inputApiRef.current.focus();
    }
  }, [inputApiRef]);
  const insertEmoji = (0, import_react.useCallback)((e) => {
    if (inputApiRef.current) {
      inputApiRef.current.insertEmoji(e);
      onUseEmoji(e);
    }
  }, [inputApiRef, onUseEmoji]);
  const [referenceElement, setReferenceElement] = (0, import_react.useState)(null);
  const [popperElement, setPopperElement] = (0, import_react.useState)(null);
  const { styles, attributes } = (0, import_react_popper.usePopper)(referenceElement, popperElement, {
    placement: "top-start",
    strategy: "fixed"
  });
  (0, import_react.useEffect)(() => {
    if (replies.length) {
      bottom?.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottom, replies.length]);
  let composerElement;
  if (!isMyStory && canReply) {
    composerElement = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, !isGroupStory && /* @__PURE__ */ import_react.default.createElement(import_Quote.Quote, {
      authorTitle,
      conversationColor: "ultramarine",
      i18n,
      isFromMe: false,
      isGiftBadge: false,
      isStoryReply: true,
      isViewOnce: false,
      moduleClassName: "StoryViewsNRepliesModal__quote",
      rawAttachment: storyPreviewAttachment,
      referencedMessageNotFound: false,
      text: (0, import_getStoryReplyText.getStoryReplyText)(i18n, storyPreviewAttachment)
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__compose-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__composer"
    }, /* @__PURE__ */ import_react.default.createElement(import_CompositionInput.CompositionInput, {
      draftText: messageBodyText,
      getPreferredBadge,
      i18n,
      inputApi: inputApiRef,
      moduleClassName: "StoryViewsNRepliesModal__input",
      onEditorStateChange: (messageText) => {
        setMessageBodyText(messageText);
      },
      onPickEmoji: insertEmoji,
      onSubmit: (...args) => {
        inputApiRef.current?.reset();
        onReply(...args);
      },
      onTextTooLong,
      placeholder: isGroupStory ? i18n("StoryViewer__reply-group") : i18n("StoryViewer__reply"),
      theme: import_Util.ThemeType.dark
    }, /* @__PURE__ */ import_react.default.createElement(import_EmojiButton.EmojiButton, {
      className: "StoryViewsNRepliesModal__emoji-button",
      i18n,
      onPickEmoji: insertEmoji,
      onClose: focusComposer,
      recentEmojis,
      skinTone,
      onSetSkinTone
    }))), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("StoryViewsNRepliesModal__react"),
      className: "StoryViewsNRepliesModal__react",
      onClick: () => {
        setShowReactionPicker(!showReactionPicker);
      },
      ref: setReferenceElement,
      type: "button"
    }), showReactionPicker && /* @__PURE__ */ import_react.default.createElement("div", {
      ref: setPopperElement,
      style: styles.popper,
      ...attributes.popper
    }, /* @__PURE__ */ import_react.default.createElement(import_ReactionPicker.ReactionPicker, {
      i18n,
      onClose: () => {
        setShowReactionPicker(false);
      },
      onPick: (emoji) => {
        setShowReactionPicker(false);
        onReact(emoji);
      },
      onSetSkinTone,
      preferredReactionEmoji,
      renderEmojiPicker
    }))));
  }
  let repliesElement;
  if (replies.length) {
    repliesElement = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__replies",
      ref: containerElementRef
    }, replies.map((reply, index) => reply.reactionEmoji ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__reaction",
      key: reply.id
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__reaction--container"
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: reply.author.acceptedMessageRequest,
      avatarPath: reply.author.avatarPath,
      badge: getPreferredBadge(reply.author.badges),
      color: (0, import_Colors.getAvatarColor)(reply.author.color),
      conversationType: "direct",
      i18n,
      isMe: Boolean(reply.author.isMe),
      name: reply.author.name,
      profileName: reply.author.profileName,
      sharedGroupNames: reply.author.sharedGroupNames || [],
      size: import_Avatar.AvatarSize.TWENTY_EIGHT,
      theme: import_Util.ThemeType.dark,
      title: reply.author.title
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__reaction--body"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__reply--title"
    }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
      contactNameColor: reply.contactNameColor,
      title: reply.author.title
    })), i18n("StoryViewsNRepliesModal__reacted"), /* @__PURE__ */ import_react.default.createElement(import_MessageTimestamp.MessageTimestamp, {
      i18n,
      isRelativeTime: true,
      module: "StoryViewsNRepliesModal__reply--timestamp",
      timestamp: reply.timestamp
    }))), /* @__PURE__ */ import_react.default.createElement(import_Emojify.Emojify, {
      text: reply.reactionEmoji
    })) : /* @__PURE__ */ import_react.default.createElement("div", {
      key: reply.id
    }, /* @__PURE__ */ import_react.default.createElement(import_Message.Message, {
      ...MESSAGE_DEFAULT_PROPS,
      author: reply.author,
      containerElementRef,
      conversationColor: "ultramarine",
      conversationId: reply.conversationId,
      conversationTitle: reply.author.title,
      conversationType: "group",
      direction: "incoming",
      disableMenu: true,
      getPreferredBadge,
      i18n,
      id: reply.id,
      interactionMode: "mouse",
      readStatus: reply.readStatus,
      renderingContext: "StoryViewsNRepliesModal",
      shouldCollapseAbove: reply.conversationId === replies[index - 1]?.conversationId,
      shouldCollapseBelow: reply.conversationId === replies[index + 1]?.conversationId,
      shouldHideMetadata: false,
      text: reply.body,
      textDirection: import_Message.TextDirection.Default,
      timestamp: reply.timestamp
    }))), /* @__PURE__ */ import_react.default.createElement("div", {
      ref: setBottom
    }));
  } else if (isGroupStory) {
    repliesElement = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryViewsNRepliesModal__replies--none"
    }, i18n("StoryViewsNRepliesModal__no-replies"));
  }
  const viewsElement = views.length ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewsNRepliesModal__views"
  }, views.map((view) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewsNRepliesModal__view",
    key: view.recipient.id
  }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest: view.recipient.acceptedMessageRequest,
    avatarPath: view.recipient.avatarPath,
    badge: void 0,
    color: (0, import_Colors.getAvatarColor)(view.recipient.color),
    conversationType: "direct",
    i18n,
    isMe: Boolean(view.recipient.isMe),
    name: view.recipient.name,
    profileName: view.recipient.profileName,
    sharedGroupNames: view.recipient.sharedGroupNames || [],
    size: import_Avatar.AvatarSize.TWENTY_EIGHT,
    title: view.recipient.title
  }), /* @__PURE__ */ import_react.default.createElement("span", {
    className: "StoryViewsNRepliesModal__view--name"
  }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
    title: view.recipient.title
  }))), view.updatedAt && /* @__PURE__ */ import_react.default.createElement(import_MessageTimestamp.MessageTimestamp, {
    i18n,
    module: "StoryViewsNRepliesModal__view--timestamp",
    timestamp: view.updatedAt
  })))) : void 0;
  const tabsElement = views.length && replies.length ? /* @__PURE__ */ import_react.default.createElement(import_Tabs.Tabs, {
    initialSelectedTab: "Views" /* Views */,
    moduleClassName: "StoryViewsNRepliesModal__tabs",
    tabs: [
      {
        id: "Views" /* Views */,
        label: i18n("StoryViewsNRepliesModal__tab--views")
      },
      {
        id: "Replies" /* Replies */,
        label: i18n("StoryViewsNRepliesModal__tab--replies")
      }
    ]
  }, ({ selectedTab }) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, selectedTab === "Views" /* Views */ && viewsElement, selectedTab === "Replies" /* Replies */ && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, repliesElement, composerElement))) : void 0;
  if (!tabsElement && !viewsElement && !repliesElement && !composerElement) {
    return null;
  }
  return /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
    i18n,
    moduleClassName: "StoryViewsNRepliesModal",
    onClose,
    useFocusTrap: Boolean(composerElement),
    theme: import_theme.Theme.Dark
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)({
      "StoryViewsNRepliesModal--group": Boolean(isGroupStory)
    })
  }, tabsElement || /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, viewsElement || repliesElement, composerElement)));
}, "StoryViewsNRepliesModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryViewsNRepliesModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyB1c2VQb3BwZXIgfSBmcm9tICdyZWFjdC1wb3BwZXInO1xuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHR5cGUgeyBCb2R5UmFuZ2VUeXBlLCBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IEVtb2ppUGlja0RhdGFUeXBlIH0gZnJvbSAnLi9lbW9qaS9FbW9qaVBpY2tlcic7XG5pbXBvcnQgdHlwZSB7IElucHV0QXBpIH0gZnJvbSAnLi9Db21wb3NpdGlvbklucHV0JztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyRW1vamlQaWNrZXJQcm9wcyB9IGZyb20gJy4vY29udmVyc2F0aW9uL1JlYWN0aW9uUGlja2VyJztcbmltcG9ydCB0eXBlIHsgUmVwbHlUeXBlLCBTdG9yeVNlbmRTdGF0ZVR5cGUgfSBmcm9tICcuLi90eXBlcy9TdG9yaWVzJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4vQXZhdGFyJztcbmltcG9ydCB7IENvbXBvc2l0aW9uSW5wdXQgfSBmcm9tICcuL0NvbXBvc2l0aW9uSW5wdXQnO1xuaW1wb3J0IHsgQ29udGFjdE5hbWUgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9Db250YWN0TmFtZSc7XG5pbXBvcnQgeyBFbW9qaUJ1dHRvbiB9IGZyb20gJy4vZW1vamkvRW1vamlCdXR0b24nO1xuaW1wb3J0IHsgRW1vamlmeSB9IGZyb20gJy4vY29udmVyc2F0aW9uL0Vtb2ppZnknO1xuaW1wb3J0IHsgTWVzc2FnZSwgVGV4dERpcmVjdGlvbiB9IGZyb20gJy4vY29udmVyc2F0aW9uL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZVRpbWVzdGFtcCB9IGZyb20gJy4vY29udmVyc2F0aW9uL01lc3NhZ2VUaW1lc3RhbXAnO1xuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICcuL01vZGFsJztcbmltcG9ydCB7IFF1b3RlIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vUXVvdGUnO1xuaW1wb3J0IHsgUmVhY3Rpb25QaWNrZXIgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9SZWFjdGlvblBpY2tlcic7XG5pbXBvcnQgeyBUYWJzIH0gZnJvbSAnLi9UYWJzJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IFdpZHRoQnJlYWtwb2ludCB9IGZyb20gJy4vX3V0aWwnO1xuaW1wb3J0IHsgZ2V0QXZhdGFyQ29sb3IgfSBmcm9tICcuLi90eXBlcy9Db2xvcnMnO1xuaW1wb3J0IHsgZ2V0U3RvcnlSZXBseVRleHQgfSBmcm9tICcuLi91dGlsL2dldFN0b3J5UmVwbHlUZXh0JztcbmltcG9ydCB7IHNob3VsZE5ldmVyQmVDYWxsZWQgfSBmcm9tICcuLi91dGlsL3Nob3VsZE5ldmVyQmVDYWxsZWQnO1xuXG4vLyBNZW51IGlzIGRpc2FibGVkIHNvIHRoZXNlIGFjdGlvbnMgYXJlIGluYWNjZXNzaWJsZS4gV2UgYWxzbyBkb24ndCBzdXBwb3J0XG4vLyBsaW5rIHByZXZpZXdzLCB0YXAgdG8gdmlldyBtZXNzYWdlcywgYXR0YWNobWVudHMsIG9yIGdpZnRzLiBKdXN0IHJlZ3VsYXJcbi8vIHRleHQgbWVzc2FnZXMgYW5kIHJlYWN0aW9ucy5cbmNvbnN0IE1FU1NBR0VfREVGQVVMVF9QUk9QUyA9IHtcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICBjYW5Eb3dubG9hZDogZmFsc2UsXG4gIGNhblJlYWN0OiBmYWxzZSxcbiAgY2FuUmVwbHk6IGZhbHNlLFxuICBjYW5SZXRyeTogZmFsc2UsXG4gIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICBjaGVja0ZvckFjY291bnQ6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIGNsZWFyU2VsZWN0ZWRNZXNzYWdlOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBjb250YWluZXJXaWR0aEJyZWFrcG9pbnQ6IFdpZHRoQnJlYWtwb2ludC5NZWRpdW0sXG4gIGRlbGV0ZU1lc3NhZ2U6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZTogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIGRvdWJsZUNoZWNrTWlzc2luZ1F1b3RlUmVmZXJlbmNlOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBkb3dubG9hZEF0dGFjaG1lbnQ6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIGlzQmxvY2tlZDogZmFsc2UsXG4gIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZDogdHJ1ZSxcbiAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZDogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgbWFya1ZpZXdlZDogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgbWVzc2FnZUV4cGFuZGVkOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBvcGVuQ29udmVyc2F0aW9uOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBvcGVuR2lmdEJhZGdlOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBvcGVuTGluazogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgcHJldmlld3M6IFtdLFxuICByZWFjdFRvTWVzc2FnZTogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgcmVuZGVyQXVkaW9BdHRhY2htZW50OiAoKSA9PiA8ZGl2IC8+LFxuICByZW5kZXJFbW9qaVBpY2tlcjogKCkgPT4gPGRpdiAvPixcbiAgcmVuZGVyUmVhY3Rpb25QaWNrZXI6ICgpID0+IDxkaXYgLz4sXG4gIHJlcGx5VG9NZXNzYWdlOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICByZXRyeVNlbmQ6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIHNjcm9sbFRvUXVvdGVkTWVzc2FnZTogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgc2hvd0NvbnRhY3REZXRhaWw6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIHNob3dDb250YWN0TW9kYWw6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIHNob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdDogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0OiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbDogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgc2hvd01lc3NhZ2VEZXRhaWw6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBzdGFydENvbnZlcnNhdGlvbjogc2hvdWxkTmV2ZXJCZUNhbGxlZCxcbiAgdGhlbWU6IFRoZW1lVHlwZS5kYXJrLFxuICB2aWV3U3Rvcnk6IHNob3VsZE5ldmVyQmVDYWxsZWQsXG59O1xuXG5lbnVtIFRhYiB7XG4gIFJlcGxpZXMgPSAnUmVwbGllcycsXG4gIFZpZXdzID0gJ1ZpZXdzJyxcbn1cblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBhdXRob3JUaXRsZTogc3RyaW5nO1xuICBjYW5SZXBseTogYm9vbGVhbjtcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBpc0dyb3VwU3Rvcnk/OiBib29sZWFuO1xuICBpc015U3Rvcnk/OiBib29sZWFuO1xuICBvbkNsb3NlOiAoKSA9PiB1bmtub3duO1xuICBvblJlYWN0OiAoZW1vamk6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb25SZXBseTogKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBtZW50aW9uczogQXJyYXk8Qm9keVJhbmdlVHlwZT4sXG4gICAgdGltZXN0YW1wOiBudW1iZXJcbiAgKSA9PiB1bmtub3duO1xuICBvblNldFNraW5Ub25lOiAodG9uZTogbnVtYmVyKSA9PiB1bmtub3duO1xuICBvblRleHRUb29Mb25nOiAoKSA9PiB1bmtub3duO1xuICBvblVzZUVtb2ppOiAoXzogRW1vamlQaWNrRGF0YVR5cGUpID0+IHVua25vd247XG4gIHByZWZlcnJlZFJlYWN0aW9uRW1vamk6IEFycmF5PHN0cmluZz47XG4gIHJlY2VudEVtb2ppcz86IEFycmF5PHN0cmluZz47XG4gIHJlbmRlckVtb2ppUGlja2VyOiAocHJvcHM6IFJlbmRlckVtb2ppUGlja2VyUHJvcHMpID0+IEpTWC5FbGVtZW50O1xuICByZXBsaWVzOiBBcnJheTxSZXBseVR5cGU+O1xuICBza2luVG9uZT86IG51bWJlcjtcbiAgc3RvcnlQcmV2aWV3QXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlO1xuICB2aWV3czogQXJyYXk8U3RvcnlTZW5kU3RhdGVUeXBlPjtcbn07XG5cbmV4cG9ydCBjb25zdCBTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbCA9ICh7XG4gIGF1dGhvclRpdGxlLFxuICBjYW5SZXBseSxcbiAgZ2V0UHJlZmVycmVkQmFkZ2UsXG4gIGkxOG4sXG4gIGlzR3JvdXBTdG9yeSxcbiAgaXNNeVN0b3J5LFxuICBvbkNsb3NlLFxuICBvblJlYWN0LFxuICBvblJlcGx5LFxuICBvblNldFNraW5Ub25lLFxuICBvblRleHRUb29Mb25nLFxuICBvblVzZUVtb2ppLFxuICBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppLFxuICByZWNlbnRFbW9qaXMsXG4gIHJlbmRlckVtb2ppUGlja2VyLFxuICByZXBsaWVzLFxuICBza2luVG9uZSxcbiAgc3RvcnlQcmV2aWV3QXR0YWNobWVudCxcbiAgdmlld3MsXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCB8IG51bGwgPT4ge1xuICBjb25zdCBjb250YWluZXJFbGVtZW50UmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IGlucHV0QXBpUmVmID0gdXNlUmVmPElucHV0QXBpIHwgdW5kZWZpbmVkPigpO1xuICBjb25zdCBbYm90dG9tLCBzZXRCb3R0b21dID0gdXNlU3RhdGU8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW21lc3NhZ2VCb2R5VGV4dCwgc2V0TWVzc2FnZUJvZHlUZXh0XSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3Nob3dSZWFjdGlvblBpY2tlciwgc2V0U2hvd1JlYWN0aW9uUGlja2VyXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBmb2N1c0NvbXBvc2VyID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpbnB1dEFwaVJlZi5jdXJyZW50KSB7XG4gICAgICBpbnB1dEFwaVJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuICB9LCBbaW5wdXRBcGlSZWZdKTtcblxuICBjb25zdCBpbnNlcnRFbW9qaSA9IHVzZUNhbGxiYWNrKFxuICAgIChlOiBFbW9qaVBpY2tEYXRhVHlwZSkgPT4ge1xuICAgICAgaWYgKGlucHV0QXBpUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgaW5wdXRBcGlSZWYuY3VycmVudC5pbnNlcnRFbW9qaShlKTtcbiAgICAgICAgb25Vc2VFbW9qaShlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtpbnB1dEFwaVJlZiwgb25Vc2VFbW9qaV1cbiAgKTtcblxuICBjb25zdCBbcmVmZXJlbmNlRWxlbWVudCwgc2V0UmVmZXJlbmNlRWxlbWVudF0gPVxuICAgIHVzZVN0YXRlPEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtwb3BwZXJFbGVtZW50LCBzZXRQb3BwZXJFbGVtZW50XSA9IHVzZVN0YXRlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4oXG4gICAgbnVsbFxuICApO1xuXG4gIGNvbnN0IHsgc3R5bGVzLCBhdHRyaWJ1dGVzIH0gPSB1c2VQb3BwZXIocmVmZXJlbmNlRWxlbWVudCwgcG9wcGVyRWxlbWVudCwge1xuICAgIHBsYWNlbWVudDogJ3RvcC1zdGFydCcsXG4gICAgc3RyYXRlZ3k6ICdmaXhlZCcsXG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHJlcGxpZXMubGVuZ3RoKSB7XG4gICAgICBib3R0b20/LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgIH1cbiAgfSwgW2JvdHRvbSwgcmVwbGllcy5sZW5ndGhdKTtcblxuICBsZXQgY29tcG9zZXJFbGVtZW50OiBKU1guRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICBpZiAoIWlzTXlTdG9yeSAmJiBjYW5SZXBseSkge1xuICAgIGNvbXBvc2VyRWxlbWVudCA9IChcbiAgICAgIDw+XG4gICAgICAgIHshaXNHcm91cFN0b3J5ICYmIChcbiAgICAgICAgICA8UXVvdGVcbiAgICAgICAgICAgIGF1dGhvclRpdGxlPXthdXRob3JUaXRsZX1cbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbkNvbG9yPVwidWx0cmFtYXJpbmVcIlxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIGlzRnJvbU1lPXtmYWxzZX1cbiAgICAgICAgICAgIGlzR2lmdEJhZGdlPXtmYWxzZX1cbiAgICAgICAgICAgIGlzU3RvcnlSZXBseVxuICAgICAgICAgICAgaXNWaWV3T25jZT17ZmFsc2V9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcXVvdGVcIlxuICAgICAgICAgICAgcmF3QXR0YWNobWVudD17c3RvcnlQcmV2aWV3QXR0YWNobWVudH1cbiAgICAgICAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ9e2ZhbHNlfVxuICAgICAgICAgICAgdGV4dD17Z2V0U3RvcnlSZXBseVRleHQoaTE4biwgc3RvcnlQcmV2aWV3QXR0YWNobWVudCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fY29tcG9zZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Vmlld3NOUmVwbGllc01vZGFsX19jb21wb3NlclwiPlxuICAgICAgICAgICAgPENvbXBvc2l0aW9uSW5wdXRcbiAgICAgICAgICAgICAgZHJhZnRUZXh0PXttZXNzYWdlQm9keVRleHR9XG4gICAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaW5wdXRBcGk9e2lucHV0QXBpUmVmfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9faW5wdXRcIlxuICAgICAgICAgICAgICBvbkVkaXRvclN0YXRlQ2hhbmdlPXttZXNzYWdlVGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgc2V0TWVzc2FnZUJvZHlUZXh0KG1lc3NhZ2VUZXh0KTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25QaWNrRW1vamk9e2luc2VydEVtb2ppfVxuICAgICAgICAgICAgICBvblN1Ym1pdD17KC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBpbnB1dEFwaVJlZi5jdXJyZW50Py5yZXNldCgpO1xuICAgICAgICAgICAgICAgIG9uUmVwbHkoLi4uYXJncyk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uVGV4dFRvb0xvbmc9e29uVGV4dFRvb0xvbmd9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtcbiAgICAgICAgICAgICAgICBpc0dyb3VwU3RvcnlcbiAgICAgICAgICAgICAgICAgID8gaTE4bignU3RvcnlWaWV3ZXJfX3JlcGx5LWdyb3VwJylcbiAgICAgICAgICAgICAgICAgIDogaTE4bignU3RvcnlWaWV3ZXJfX3JlcGx5JylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxFbW9qaUJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5Vmlld3NOUmVwbGllc01vZGFsX19lbW9qaS1idXR0b25cIlxuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgb25QaWNrRW1vamk9e2luc2VydEVtb2ppfVxuICAgICAgICAgICAgICAgIG9uQ2xvc2U9e2ZvY3VzQ29tcG9zZXJ9XG4gICAgICAgICAgICAgICAgcmVjZW50RW1vamlzPXtyZWNlbnRFbW9qaXN9XG4gICAgICAgICAgICAgICAgc2tpblRvbmU9e3NraW5Ub25lfVxuICAgICAgICAgICAgICAgIG9uU2V0U2tpblRvbmU9e29uU2V0U2tpblRvbmV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0NvbXBvc2l0aW9uSW5wdXQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3JlYWN0Jyl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcmVhY3RcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRTaG93UmVhY3Rpb25QaWNrZXIoIXNob3dSZWFjdGlvblBpY2tlcik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcmVmPXtzZXRSZWZlcmVuY2VFbGVtZW50fVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7c2hvd1JlYWN0aW9uUGlja2VyICYmIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgcmVmPXtzZXRQb3BwZXJFbGVtZW50fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLnBvcHBlcn1cbiAgICAgICAgICAgICAgey4uLmF0dHJpYnV0ZXMucG9wcGVyfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UmVhY3Rpb25QaWNrZXJcbiAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldFNob3dSZWFjdGlvblBpY2tlcihmYWxzZSk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvblBpY2s9e2Vtb2ppID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldFNob3dSZWFjdGlvblBpY2tlcihmYWxzZSk7XG4gICAgICAgICAgICAgICAgICBvblJlYWN0KGVtb2ppKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uU2V0U2tpblRvbmU9e29uU2V0U2tpblRvbmV9XG4gICAgICAgICAgICAgICAgcHJlZmVycmVkUmVhY3Rpb25FbW9qaT17cHJlZmVycmVkUmVhY3Rpb25FbW9qaX1cbiAgICAgICAgICAgICAgICByZW5kZXJFbW9qaVBpY2tlcj17cmVuZGVyRW1vamlQaWNrZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvPlxuICAgICk7XG4gIH1cblxuICBsZXQgcmVwbGllc0VsZW1lbnQ6IEpTWC5FbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIGlmIChyZXBsaWVzLmxlbmd0aCkge1xuICAgIHJlcGxpZXNFbGVtZW50ID0gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcmVwbGllc1wiXG4gICAgICAgIHJlZj17Y29udGFpbmVyRWxlbWVudFJlZn1cbiAgICAgID5cbiAgICAgICAge3JlcGxpZXMubWFwKChyZXBseSwgaW5kZXgpID0+XG4gICAgICAgICAgcmVwbHkucmVhY3Rpb25FbW9qaSA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3JlYWN0aW9uXCIga2V5PXtyZXBseS5pZH0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3JlYWN0aW9uLS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXtyZXBseS5hdXRob3IuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgIGF2YXRhclBhdGg9e3JlcGx5LmF1dGhvci5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICAgICAgYmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlKHJlcGx5LmF1dGhvci5iYWRnZXMpfVxuICAgICAgICAgICAgICAgICAgY29sb3I9e2dldEF2YXRhckNvbG9yKHJlcGx5LmF1dGhvci5jb2xvcil9XG4gICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPVwiZGlyZWN0XCJcbiAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICBpc01lPXtCb29sZWFuKHJlcGx5LmF1dGhvci5pc01lKX1cbiAgICAgICAgICAgICAgICAgIG5hbWU9e3JlcGx5LmF1dGhvci5uYW1lfVxuICAgICAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e3JlcGx5LmF1dGhvci5wcm9maWxlTmFtZX1cbiAgICAgICAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e3JlcGx5LmF1dGhvci5zaGFyZWRHcm91cE5hbWVzIHx8IFtdfVxuICAgICAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5UV0VOVFlfRUlHSFR9XG4gICAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17cmVwbHkuYXV0aG9yLnRpdGxlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcmVhY3Rpb24tLWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3JlcGx5LS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8Q29udGFjdE5hbWVcbiAgICAgICAgICAgICAgICAgICAgICBjb250YWN0TmFtZUNvbG9yPXtyZXBseS5jb250YWN0TmFtZUNvbG9yfVxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtyZXBseS5hdXRob3IudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIHtpMThuKCdTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcmVhY3RlZCcpfVxuICAgICAgICAgICAgICAgICAgPE1lc3NhZ2VUaW1lc3RhbXBcbiAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgaXNSZWxhdGl2ZVRpbWVcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3JlcGx5LS10aW1lc3RhbXBcIlxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA9e3JlcGx5LnRpbWVzdGFtcH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8RW1vamlmeSB0ZXh0PXtyZXBseS5yZWFjdGlvbkVtb2ppfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtyZXBseS5pZH0+XG4gICAgICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICAgICAgey4uLk1FU1NBR0VfREVGQVVMVF9QUk9QU31cbiAgICAgICAgICAgICAgICBhdXRob3I9e3JlcGx5LmF1dGhvcn1cbiAgICAgICAgICAgICAgICBjb250YWluZXJFbGVtZW50UmVmPXtjb250YWluZXJFbGVtZW50UmVmfVxuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbkNvbG9yPVwidWx0cmFtYXJpbmVcIlxuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkPXtyZXBseS5jb252ZXJzYXRpb25JZH1cbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UaXRsZT17cmVwbHkuYXV0aG9yLnRpdGxlfVxuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJncm91cFwiXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uPVwiaW5jb21pbmdcIlxuICAgICAgICAgICAgICAgIGRpc2FibGVNZW51XG4gICAgICAgICAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgaWQ9e3JlcGx5LmlkfVxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uTW9kZT1cIm1vdXNlXCJcbiAgICAgICAgICAgICAgICByZWFkU3RhdHVzPXtyZXBseS5yZWFkU3RhdHVzfVxuICAgICAgICAgICAgICAgIHJlbmRlcmluZ0NvbnRleHQ9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbFwiXG4gICAgICAgICAgICAgICAgc2hvdWxkQ29sbGFwc2VBYm92ZT17XG4gICAgICAgICAgICAgICAgICByZXBseS5jb252ZXJzYXRpb25JZCA9PT0gcmVwbGllc1tpbmRleCAtIDFdPy5jb252ZXJzYXRpb25JZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG91bGRDb2xsYXBzZUJlbG93PXtcbiAgICAgICAgICAgICAgICAgIHJlcGx5LmNvbnZlcnNhdGlvbklkID09PSByZXBsaWVzW2luZGV4ICsgMV0/LmNvbnZlcnNhdGlvbklkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3VsZEhpZGVNZXRhZGF0YT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgdGV4dD17cmVwbHkuYm9keX1cbiAgICAgICAgICAgICAgICB0ZXh0RGlyZWN0aW9uPXtUZXh0RGlyZWN0aW9uLkRlZmF1bHR9XG4gICAgICAgICAgICAgICAgdGltZXN0YW1wPXtyZXBseS50aW1lc3RhbXB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgcmVmPXtzZXRCb3R0b219IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2UgaWYgKGlzR3JvdXBTdG9yeSkge1xuICAgIHJlcGxpZXNFbGVtZW50ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fcmVwbGllcy0tbm9uZVwiPlxuICAgICAgICB7aTE4bignU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX25vLXJlcGxpZXMnKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25zdCB2aWV3c0VsZW1lbnQgPSB2aWV3cy5sZW5ndGggPyAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fdmlld3NcIj5cbiAgICAgIHt2aWV3cy5tYXAodmlldyA9PiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3ZpZXdcIiBrZXk9e3ZpZXcucmVjaXBpZW50LmlkfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXt2aWV3LnJlY2lwaWVudC5hY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0fVxuICAgICAgICAgICAgICBhdmF0YXJQYXRoPXt2aWV3LnJlY2lwaWVudC5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICBiYWRnZT17dW5kZWZpbmVkfVxuICAgICAgICAgICAgICBjb2xvcj17Z2V0QXZhdGFyQ29sb3Iodmlldy5yZWNpcGllbnQuY29sb3IpfVxuICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPVwiZGlyZWN0XCJcbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaXNNZT17Qm9vbGVhbih2aWV3LnJlY2lwaWVudC5pc01lKX1cbiAgICAgICAgICAgICAgbmFtZT17dmlldy5yZWNpcGllbnQubmFtZX1cbiAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e3ZpZXcucmVjaXBpZW50LnByb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXt2aWV3LnJlY2lwaWVudC5zaGFyZWRHcm91cE5hbWVzIHx8IFtdfVxuICAgICAgICAgICAgICBzaXplPXtBdmF0YXJTaXplLlRXRU5UWV9FSUdIVH1cbiAgICAgICAgICAgICAgdGl0bGU9e3ZpZXcucmVjaXBpZW50LnRpdGxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3J5Vmlld3NOUmVwbGllc01vZGFsX192aWV3LS1uYW1lXCI+XG4gICAgICAgICAgICAgIDxDb250YWN0TmFtZSB0aXRsZT17dmlldy5yZWNpcGllbnQudGl0bGV9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3ZpZXcudXBkYXRlZEF0ICYmIChcbiAgICAgICAgICAgIDxNZXNzYWdlVGltZXN0YW1wXG4gICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgIG1vZHVsZT1cIlN0b3J5Vmlld3NOUmVwbGllc01vZGFsX192aWV3LS10aW1lc3RhbXBcIlxuICAgICAgICAgICAgICB0aW1lc3RhbXA9e3ZpZXcudXBkYXRlZEF0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApIDogdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHRhYnNFbGVtZW50ID1cbiAgICB2aWV3cy5sZW5ndGggJiYgcmVwbGllcy5sZW5ndGggPyAoXG4gICAgICA8VGFic1xuICAgICAgICBpbml0aWFsU2VsZWN0ZWRUYWI9e1RhYi5WaWV3c31cbiAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWxfX3RhYnNcIlxuICAgICAgICB0YWJzPXtbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IFRhYi5WaWV3cyxcbiAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbF9fdGFiLS12aWV3cycpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IFRhYi5SZXBsaWVzLFxuICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5Vmlld3NOUmVwbGllc01vZGFsX190YWItLXJlcGxpZXMnKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdfVxuICAgICAgPlxuICAgICAgICB7KHsgc2VsZWN0ZWRUYWIgfSkgPT4gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICB7c2VsZWN0ZWRUYWIgPT09IFRhYi5WaWV3cyAmJiB2aWV3c0VsZW1lbnR9XG4gICAgICAgICAgICB7c2VsZWN0ZWRUYWIgPT09IFRhYi5SZXBsaWVzICYmIChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICB7cmVwbGllc0VsZW1lbnR9XG4gICAgICAgICAgICAgICAge2NvbXBvc2VyRWxlbWVudH1cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9UYWJzPlxuICAgICkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKCF0YWJzRWxlbWVudCAmJiAhdmlld3NFbGVtZW50ICYmICFyZXBsaWVzRWxlbWVudCAmJiAhY29tcG9zZXJFbGVtZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxNb2RhbFxuICAgICAgaTE4bj17aTE4bn1cbiAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3J5Vmlld3NOUmVwbGllc01vZGFsXCJcbiAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICB1c2VGb2N1c1RyYXA9e0Jvb2xlYW4oY29tcG9zZXJFbGVtZW50KX1cbiAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAnU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwtLWdyb3VwJzogQm9vbGVhbihpc0dyb3VwU3RvcnkpLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAge3RhYnNFbGVtZW50IHx8IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAge3ZpZXdzRWxlbWVudCB8fCByZXBsaWVzRWxlbWVudH1cbiAgICAgICAgICAgIHtjb21wb3NlckVsZW1lbnR9XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L01vZGFsPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBZ0U7QUFDaEUsd0JBQXVCO0FBQ3ZCLDBCQUEwQjtBQVExQixvQkFBbUM7QUFDbkMsOEJBQWlDO0FBQ2pDLHlCQUE0QjtBQUM1Qix5QkFBNEI7QUFDNUIscUJBQXdCO0FBQ3hCLHFCQUF1QztBQUN2Qyw4QkFBaUM7QUFDakMsbUJBQXNCO0FBQ3RCLG1CQUFzQjtBQUN0Qiw0QkFBK0I7QUFDL0Isa0JBQXFCO0FBQ3JCLG1CQUFzQjtBQUN0QixrQkFBMEI7QUFDMUIsa0JBQWdDO0FBQ2hDLG9CQUErQjtBQUMvQiwrQkFBa0M7QUFDbEMsaUNBQW9DO0FBS3BDLE1BQU0sd0JBQXdCO0FBQUEsRUFDNUIsc0JBQXNCO0FBQUEsRUFDdEIsYUFBYTtBQUFBLEVBQ2IsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsMkJBQTJCO0FBQUEsRUFDM0IsaUJBQWlCO0FBQUEsRUFDakIsc0JBQXNCO0FBQUEsRUFDdEIsMEJBQTBCLDRCQUFnQjtBQUFBLEVBQzFDLGVBQWU7QUFBQSxFQUNmLDBCQUEwQjtBQUFBLEVBQzFCLHlCQUF5QjtBQUFBLEVBQ3pCLGtDQUFrQztBQUFBLEVBQ2xDLG9CQUFvQjtBQUFBLEVBQ3BCLFdBQVc7QUFBQSxFQUNYLDBCQUEwQjtBQUFBLEVBQzFCLDJCQUEyQjtBQUFBLEVBQzNCLDJCQUEyQjtBQUFBLEVBQzNCLFlBQVk7QUFBQSxFQUNaLGlCQUFpQjtBQUFBLEVBQ2pCLGtCQUFrQjtBQUFBLEVBQ2xCLGVBQWU7QUFBQSxFQUNmLFVBQVU7QUFBQSxFQUNWLFVBQVUsQ0FBQztBQUFBLEVBQ1gsZ0JBQWdCO0FBQUEsRUFDaEIsdUJBQXVCLE1BQU0sbURBQUMsV0FBSTtBQUFBLEVB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
