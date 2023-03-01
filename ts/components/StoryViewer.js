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
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var StoryViewer_exports = {};
__export(StoryViewer_exports, {
  StoryViewer: () => StoryViewer
});
module.exports = __toCommonJS(StoryViewer_exports);
var import_focus_trap_react = __toESM(require("focus-trap-react"));
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_web = require("@react-spring/web");
var log = __toESM(require("../logging/log"));
var import_AnimatedEmojiGalore = require("./AnimatedEmojiGalore");
var import_Avatar = require("./Avatar");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_ContextMenu = require("./ContextMenu");
var import_Intl = require("./Intl");
var import_MessageTimestamp = require("./conversation/MessageTimestamp");
var import_MessageSendState = require("../messages/MessageSendState");
var import_StoryDetailsModal = require("./StoryDetailsModal");
var import_StoryViewsNRepliesModal = require("./StoryViewsNRepliesModal");
var import_StoryImage = require("./StoryImage");
var import_Stories = require("../types/Stories");
var import_theme = require("../util/theme");
var import_toast = require("../state/ducks/toast");
var import_Colors = require("../types/Colors");
var import_getStoryBackground = require("../util/getStoryBackground");
var import_getStoryDuration = require("../util/getStoryDuration");
var import_Attachment = require("../types/Attachment");
var import_graphemeAwareSlice = require("../util/graphemeAwareSlice");
var import_useEscapeHandling = require("../hooks/useEscapeHandling");
const CAPTION_BUFFER = 20;
const CAPTION_INITIAL_LENGTH = 200;
const CAPTION_MAX_LENGTH = 700;
const MOUSE_IDLE_TIME = 3e3;
var Arrow = /* @__PURE__ */ ((Arrow2) => {
  Arrow2[Arrow2["None"] = 0] = "None";
  Arrow2[Arrow2["Left"] = 1] = "Left";
  Arrow2[Arrow2["Right"] = 2] = "Right";
  return Arrow2;
})(Arrow || {});
const StoryViewer = /* @__PURE__ */ __name(({
  currentIndex,
  deleteStoryForEveryone,
  getPreferredBadge,
  group,
  hasActiveCall,
  hasAllStoriesMuted,
  i18n,
  loadStoryReplies,
  markStoryRead,
  numStories,
  onGoToConversation,
  onHideStory,
  onReactToStory,
  onReplyToStory,
  onSetSkinTone,
  onTextTooLong,
  onUseEmoji,
  preferredReactionEmoji,
  queueStoryDownload,
  recentEmojis,
  renderEmojiPicker,
  replyState,
  shouldShowDetailsModal,
  showToast,
  skinTone,
  story,
  storyViewMode,
  toggleHasAllStoriesMuted,
  viewStory
}) => {
  const [isShowingContextMenu, setIsShowingContextMenu] = (0, import_react.useState)(false);
  const [storyDuration, setStoryDuration] = (0, import_react.useState)();
  const [hasConfirmHideStory, setHasConfirmHideStory] = (0, import_react.useState)(false);
  const [reactionEmoji, setReactionEmoji] = (0, import_react.useState)();
  const [confirmDeleteStory, setConfirmDeleteStory] = (0, import_react.useState)();
  const { attachment, canReply, isHidden, messageId, sendState, timestamp } = story;
  const {
    acceptedMessageRequest,
    avatarPath,
    color,
    isMe,
    id,
    firstName,
    name,
    profileName,
    sharedGroupNames,
    title
  } = story.sender;
  const [hasStoryViewsNRepliesModal, setHasStoryViewsNRepliesModal] = (0, import_react.useState)(false);
  const [hasStoryDetailsModal, setHasStoryDetailsModal] = (0, import_react.useState)(Boolean(shouldShowDetailsModal));
  const onClose = (0, import_react.useCallback)(() => {
    viewStory({
      closeViewer: true
    });
  }, [viewStory]);
  const onEscape = (0, import_react.useCallback)(() => {
    if (hasStoryViewsNRepliesModal) {
      setHasStoryViewsNRepliesModal(false);
    } else {
      onClose();
    }
  }, [hasStoryViewsNRepliesModal, onClose]);
  (0, import_useEscapeHandling.useEscapeHandling)(onEscape);
  const [hasExpandedCaption, setHasExpandedCaption] = (0, import_react.useState)(false);
  const caption = (0, import_react.useMemo)(() => {
    if (!attachment?.caption) {
      return;
    }
    return (0, import_graphemeAwareSlice.graphemeAwareSlice)(attachment.caption, hasExpandedCaption ? CAPTION_MAX_LENGTH : CAPTION_INITIAL_LENGTH, CAPTION_BUFFER);
  }, [attachment?.caption, hasExpandedCaption]);
  (0, import_react.useEffect)(() => {
    setHasExpandedCaption(false);
  }, [messageId]);
  (0, import_react.useEffect)(() => {
    let shouldCancel = false;
    (async function hydrateStoryDuration() {
      if (!attachment) {
        return;
      }
      const duration = await (0, import_getStoryDuration.getStoryDuration)(attachment);
      if (shouldCancel) {
        return;
      }
      log.info("stories.setStoryDuration", {
        contentType: attachment.textAttachment ? "text" : attachment.contentType,
        duration
      });
      setStoryDuration(duration);
    })();
    return () => {
      shouldCancel = true;
    };
  }, [attachment, messageId]);
  const unmountRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    return () => {
      unmountRef.current = true;
    };
  }, []);
  const [styles, spring] = (0, import_web.useSpring)(() => ({
    from: { width: 0 },
    to: { width: 100 },
    loop: true,
    onRest: {
      width: ({ value }) => {
        if (unmountRef.current) {
          log.info("stories.StoryViewer.spring.onRest: called after component unmounted");
          return;
        }
        if (value === 100) {
          viewStory({
            storyId: story.messageId,
            storyViewMode,
            viewDirection: import_Stories.StoryViewDirectionType.Next
          });
        }
      }
    }
  }), [story.messageId, storyViewMode, viewStory]);
  (0, import_react.useEffect)(() => {
    if (!storyDuration) {
      spring.stop();
      return;
    }
    spring.start({
      config: {
        duration: storyDuration
      },
      from: { width: 0 },
      to: { width: 100 }
    });
    return () => {
      spring.stop();
    };
  }, [currentIndex, spring, storyDuration]);
  const [pauseStory, setPauseStory] = (0, import_react.useState)(false);
  const shouldPauseViewing = hasActiveCall || hasConfirmHideStory || hasExpandedCaption || hasStoryDetailsModal || hasStoryViewsNRepliesModal || isShowingContextMenu || pauseStory || Boolean(reactionEmoji);
  (0, import_react.useEffect)(() => {
    if (shouldPauseViewing) {
      spring.pause();
    } else {
      spring.resume();
    }
  }, [shouldPauseViewing, spring]);
  (0, import_react.useEffect)(() => {
    markStoryRead(messageId);
    log.info("stories.markStoryRead", { messageId });
  }, [markStoryRead, messageId]);
  const navigateStories = (0, import_react.useCallback)((ev) => {
    if (ev.key === "ArrowRight") {
      viewStory({
        storyId: story.messageId,
        storyViewMode,
        viewDirection: import_Stories.StoryViewDirectionType.Next
      });
      ev.preventDefault();
      ev.stopPropagation();
    } else if (ev.key === "ArrowLeft") {
      viewStory({
        storyId: story.messageId,
        storyViewMode,
        viewDirection: import_Stories.StoryViewDirectionType.Previous
      });
      ev.preventDefault();
      ev.stopPropagation();
    }
  }, [story.messageId, storyViewMode, viewStory]);
  (0, import_react.useEffect)(() => {
    document.addEventListener("keydown", navigateStories);
    return () => {
      document.removeEventListener("keydown", navigateStories);
    };
  }, [navigateStories]);
  const groupId = group?.id;
  const isGroupStory = Boolean(groupId);
  (0, import_react.useEffect)(() => {
    if (!groupId) {
      return;
    }
    loadStoryReplies(groupId, messageId);
  }, [groupId, loadStoryReplies, messageId]);
  const [arrowToShow, setArrowToShow] = (0, import_react.useState)(0 /* None */);
  (0, import_react.useEffect)(() => {
    if (arrowToShow === 0 /* None */) {
      return;
    }
    let lastMouseMove;
    function updateLastMouseMove() {
      lastMouseMove = Date.now();
    }
    function checkMouseIdle() {
      requestAnimationFrame(() => {
        if (lastMouseMove && Date.now() - lastMouseMove > MOUSE_IDLE_TIME) {
          setArrowToShow(0 /* None */);
        } else {
          checkMouseIdle();
        }
      });
    }
    checkMouseIdle();
    document.addEventListener("mousemove", updateLastMouseMove);
    return () => {
      lastMouseMove = void 0;
      document.removeEventListener("mousemove", updateLastMouseMove);
    };
  }, [arrowToShow]);
  const replies = replyState && replyState.messageId === messageId ? replyState.replies : [];
  const views = sendState ? sendState.filter(({ status }) => status === import_MessageSendState.SendStatus.Viewed) : [];
  const replyCount = replies.length;
  const viewCount = views.length;
  const hasPrevNextArrows = storyViewMode !== import_Stories.StoryViewModeType.Single;
  const canMuteStory = (0, import_Attachment.isVideoAttachment)(attachment);
  const isStoryMuted = hasAllStoriesMuted || !canMuteStory;
  let muteClassName;
  let muteAriaLabel;
  if (canMuteStory) {
    muteAriaLabel = hasAllStoriesMuted ? i18n("StoryViewer__unmute") : i18n("StoryViewer__mute");
    muteClassName = hasAllStoriesMuted ? "StoryViewer__unmute" : "StoryViewer__mute";
  } else {
    muteAriaLabel = i18n("Stories__toast--hasNoSound");
    muteClassName = "StoryViewer__soundless";
  }
  const contextMenuOptions = sendState ? [
    {
      icon: "StoryListItem__icon--info",
      label: i18n("StoryListItem__info"),
      onClick: () => setHasStoryDetailsModal(true)
    },
    {
      icon: "StoryListItem__icon--delete",
      label: i18n("StoryListItem__delete"),
      onClick: () => setConfirmDeleteStory(story)
    }
  ] : [
    {
      icon: "StoryListItem__icon--info",
      label: i18n("StoryListItem__info"),
      onClick: () => setHasStoryDetailsModal(true)
    },
    {
      icon: "StoryListItem__icon--hide",
      label: isHidden ? i18n("StoryListItem__unhide") : i18n("StoryListItem__hide"),
      onClick: () => {
        if (isHidden) {
          onHideStory(id);
        } else {
          setHasConfirmHideStory(true);
        }
      }
    },
    {
      icon: "StoryListItem__icon--chat",
      label: i18n("StoryListItem__go-to-chat"),
      onClick: () => {
        onGoToConversation(id);
      }
    }
  ];
  return /* @__PURE__ */ import_react.default.createElement(import_focus_trap_react.default, {
    focusTrapOptions: { allowOutsideClick: true }
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__overlay",
    style: { background: (0, import_getStoryBackground.getStoryBackground)(attachment) }
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__content"
  }, hasPrevNextArrows && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("back"),
    className: (0, import_classnames.default)("StoryViewer__arrow StoryViewer__arrow--left", {
      "StoryViewer__arrow--visible": arrowToShow === 1 /* Left */
    }),
    onClick: () => viewStory({
      storyId: story.messageId,
      storyViewMode,
      viewDirection: import_Stories.StoryViewDirectionType.Previous
    }),
    onMouseMove: () => setArrowToShow(1 /* Left */),
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__protection StoryViewer__protection--top"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__container"
  }, /* @__PURE__ */ import_react.default.createElement(import_StoryImage.StoryImage, {
    attachment,
    firstName: firstName || title,
    i18n,
    isPaused: shouldPauseViewing,
    isMuted: isStoryMuted,
    label: i18n("lightboxImageAlt"),
    moduleClassName: "StoryViewer__story",
    queueStoryDownload,
    storyId: messageId
  }, reactionEmoji && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__animated-emojis"
  }, /* @__PURE__ */ import_react.default.createElement(import_AnimatedEmojiGalore.AnimatedEmojiGalore, {
    emoji: reactionEmoji,
    onAnimationEnd: () => {
      setReactionEmoji(void 0);
    }
  }))), hasExpandedCaption && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("close-popup"),
    className: "StoryViewer__caption__overlay",
    onClick: () => setHasExpandedCaption(false),
    type: "button"
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__meta"
  }, caption && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__caption"
  }, caption.text, caption.hasReadMore && !hasExpandedCaption && /* @__PURE__ */ import_react.default.createElement("button", {
    className: "MessageBody__read-more",
    onClick: () => {
      setHasExpandedCaption(true);
    },
    onKeyDown: (ev) => {
      if (ev.key === "Space" || ev.key === "Enter") {
        setHasExpandedCaption(true);
      }
    },
    type: "button"
  }, "...", i18n("MessageBody--read-more"))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__meta__playback-bar"
  }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest,
    avatarPath,
    badge: void 0,
    color: (0, import_Colors.getAvatarColor)(color),
    conversationType: "direct",
    i18n,
    isMe: Boolean(isMe),
    name,
    profileName,
    sharedGroupNames,
    size: import_Avatar.AvatarSize.TWENTY_EIGHT,
    title
  }), group && /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest: group.acceptedMessageRequest,
    avatarPath: group.avatarPath,
    badge: void 0,
    className: "StoryViewer__meta--group-avatar",
    color: (0, import_Colors.getAvatarColor)(group.color),
    conversationType: "group",
    i18n,
    isMe: false,
    name: group.name,
    profileName: group.profileName,
    sharedGroupNames: group.sharedGroupNames,
    size: import_Avatar.AvatarSize.TWENTY_EIGHT,
    title: group.title
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__meta--title"
  }, group ? i18n("Stories__from-to-group", {
    name: title,
    group: group.title
  }) : title), /* @__PURE__ */ import_react.default.createElement(import_MessageTimestamp.MessageTimestamp, {
    i18n,
    isRelativeTime: true,
    module: "StoryViewer__meta--timestamp",
    timestamp
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__meta__playback-controls"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": pauseStory ? i18n("StoryViewer__play") : i18n("StoryViewer__pause"),
    className: pauseStory ? "StoryViewer__play" : "StoryViewer__pause",
    onClick: () => setPauseStory(!pauseStory),
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": muteAriaLabel,
    className: muteClassName,
    onClick: canMuteStory ? toggleHasAllStoriesMuted : () => showToast(import_toast.ToastType.StoryMuted),
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    "aria-label": i18n("MyStories__more"),
    i18n,
    menuOptions: contextMenuOptions,
    moduleClassName: "StoryViewer__more",
    onMenuShowingChanged: setIsShowingContextMenu,
    theme: import_theme.Theme.Dark
  }))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__progress"
  }, Array.from(Array(numStories), (_, index) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__progress--container",
    key: index
  }, currentIndex === index ? /* @__PURE__ */ import_react.default.createElement(import_web.animated.div, {
    className: "StoryViewer__progress--bar",
    style: {
      width: (0, import_web.to)([styles.width], (width) => `${width}%`)
    }
  }) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__progress--bar",
    style: {
      width: currentIndex < index ? "0%" : "100%"
    }
  })))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__actions"
  }, (canReply || sendState) && /* @__PURE__ */ import_react.default.createElement("button", {
    className: "StoryViewer__reply",
    onClick: () => setHasStoryViewsNRepliesModal(true),
    tabIndex: 0,
    type: "button"
  }, /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, sendState || replyCount > 0 ? /* @__PURE__ */ import_react.default.createElement("span", {
    className: "StoryViewer__reply__chevron"
  }, sendState && (viewCount === 1 ? /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    i18n,
    id: "MyStories__views--singular",
    components: [/* @__PURE__ */ import_react.default.createElement("strong", null, viewCount)]
  }) : /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    i18n,
    id: "MyStories__views--plural",
    components: [/* @__PURE__ */ import_react.default.createElement("strong", null, viewCount)]
  })), viewCount > 0 && replyCount > 0 && " ", replyCount > 0 && (replyCount === 1 ? /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    i18n,
    id: "MyStories__replies--singular",
    components: [/* @__PURE__ */ import_react.default.createElement("strong", null, replyCount)]
  }) : /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    i18n,
    id: "MyStories__replies--plural",
    components: [/* @__PURE__ */ import_react.default.createElement("strong", null, replyCount)]
  }))) : null, !sendState && !replyCount && /* @__PURE__ */ import_react.default.createElement("span", {
    className: "StoryViewer__reply__arrow"
  }, isGroupStory ? i18n("StoryViewer__reply-group") : i18n("StoryViewer__reply")))))), hasPrevNextArrows && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("forward"),
    className: (0, import_classnames.default)("StoryViewer__arrow StoryViewer__arrow--right", {
      "StoryViewer__arrow--visible": arrowToShow === 2 /* Right */
    }),
    onClick: () => viewStory({
      storyId: story.messageId,
      storyViewMode,
      viewDirection: import_Stories.StoryViewDirectionType.Next
    }),
    onMouseMove: () => setArrowToShow(2 /* Right */),
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryViewer__protection StoryViewer__protection--bottom"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("close"),
    className: "StoryViewer__close-button",
    onClick: onClose,
    tabIndex: 0,
    type: "button"
  })), hasStoryDetailsModal && /* @__PURE__ */ import_react.default.createElement(import_StoryDetailsModal.StoryDetailsModal, {
    getPreferredBadge,
    i18n,
    onClose: () => setHasStoryDetailsModal(false),
    sender: story.sender,
    sendState,
    size: attachment?.size,
    timestamp
  }), hasStoryViewsNRepliesModal && /* @__PURE__ */ import_react.default.createElement(import_StoryViewsNRepliesModal.StoryViewsNRepliesModal, {
    authorTitle: firstName || title,
    canReply: Boolean(canReply),
    getPreferredBadge,
    i18n,
    isGroupStory,
    isMyStory: isMe,
    onClose: () => setHasStoryViewsNRepliesModal(false),
    onReact: (emoji) => {
      onReactToStory(emoji, story);
      if (!isGroupStory) {
        setHasStoryViewsNRepliesModal(false);
      }
      setReactionEmoji(emoji);
      showToast(import_toast.ToastType.StoryReact);
    },
    onReply: (message, mentions, replyTimestamp) => {
      if (!isGroupStory) {
        setHasStoryViewsNRepliesModal(false);
      }
      onReplyToStory(message, mentions, replyTimestamp, story);
      showToast(import_toast.ToastType.StoryReply);
    },
    onSetSkinTone,
    onTextTooLong,
    onUseEmoji,
    preferredReactionEmoji,
    recentEmojis,
    renderEmojiPicker,
    replies,
    skinTone,
    storyPreviewAttachment: attachment,
    views
  }), hasConfirmHideStory && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        action: () => onHideStory(id),
        style: "affirmative",
        text: i18n("StoryListItem__hide-modal--confirm")
      }
    ],
    i18n,
    onClose: () => {
      setHasConfirmHideStory(false);
    }
  }, i18n("StoryListItem__hide-modal--body", [String(firstName)])), confirmDeleteStory && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        text: i18n("delete"),
        action: () => deleteStoryForEveryone(confirmDeleteStory),
        style: "negative"
      }
    ],
    i18n,
    onClose: () => setConfirmDeleteStory(void 0)
  }, i18n("MyStories__delete"))));
}, "StoryViewer");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryViewer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlWaWV3ZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBGb2N1c1RyYXAgZnJvbSAnZm9jdXMtdHJhcC1yZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyB1c2VTcHJpbmcsIGFuaW1hdGVkLCB0byB9IGZyb20gJ0ByZWFjdC1zcHJpbmcvd2ViJztcbmltcG9ydCB0eXBlIHsgQm9keVJhbmdlVHlwZSwgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBDb250ZXh0TWVudU9wdGlvblR5cGUgfSBmcm9tICcuL0NvbnRleHRNZW51JztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBFbW9qaVBpY2tEYXRhVHlwZSB9IGZyb20gJy4vZW1vamkvRW1vamlQaWNrZXInO1xuaW1wb3J0IHR5cGUgeyBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJFbW9qaVBpY2tlclByb3BzIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vUmVhY3Rpb25QaWNrZXInO1xuaW1wb3J0IHR5cGUgeyBSZXBseVN0YXRlVHlwZSwgU3RvcnlWaWV3VHlwZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBTaG93VG9hc3RBY3Rpb25DcmVhdG9yVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL3RvYXN0JztcbmltcG9ydCB0eXBlIHsgVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBBbmltYXRlZEVtb2ppR2Fsb3JlIH0gZnJvbSAnLi9BbmltYXRlZEVtb2ppR2Fsb3JlJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4vQXZhdGFyJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi9Db250ZXh0TWVudSc7XG5pbXBvcnQgeyBJbnRsIH0gZnJvbSAnLi9JbnRsJztcbmltcG9ydCB7IE1lc3NhZ2VUaW1lc3RhbXAgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9NZXNzYWdlVGltZXN0YW1wJztcbmltcG9ydCB7IFNlbmRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCB7IFN0b3J5RGV0YWlsc01vZGFsIH0gZnJvbSAnLi9TdG9yeURldGFpbHNNb2RhbCc7XG5pbXBvcnQgeyBTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbCB9IGZyb20gJy4vU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwnO1xuaW1wb3J0IHsgU3RvcnlJbWFnZSB9IGZyb20gJy4vU3RvcnlJbWFnZSc7XG5pbXBvcnQgeyBTdG9yeVZpZXdEaXJlY3Rpb25UeXBlLCBTdG9yeVZpZXdNb2RlVHlwZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICcuLi91dGlsL3RoZW1lJztcbmltcG9ydCB7IFRvYXN0VHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL3RvYXN0JztcbmltcG9ydCB7IGdldEF2YXRhckNvbG9yIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IGdldFN0b3J5QmFja2dyb3VuZCB9IGZyb20gJy4uL3V0aWwvZ2V0U3RvcnlCYWNrZ3JvdW5kJztcbmltcG9ydCB7IGdldFN0b3J5RHVyYXRpb24gfSBmcm9tICcuLi91dGlsL2dldFN0b3J5RHVyYXRpb24nO1xuaW1wb3J0IHsgaXNWaWRlb0F0dGFjaG1lbnQgfSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGdyYXBoZW1lQXdhcmVTbGljZSB9IGZyb20gJy4uL3V0aWwvZ3JhcGhlbWVBd2FyZVNsaWNlJztcbmltcG9ydCB7IHVzZUVzY2FwZUhhbmRsaW5nIH0gZnJvbSAnLi4vaG9va3MvdXNlRXNjYXBlSGFuZGxpbmcnO1xuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSB7XG4gIGN1cnJlbnRJbmRleDogbnVtYmVyO1xuICBkZWxldGVTdG9yeUZvckV2ZXJ5b25lOiAoc3Rvcnk6IFN0b3J5Vmlld1R5cGUpID0+IHVua25vd247XG4gIGdldFByZWZlcnJlZEJhZGdlOiBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZTtcbiAgZ3JvdXA/OiBQaWNrPFxuICAgIENvbnZlcnNhdGlvblR5cGUsXG4gICAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgICB8ICdhdmF0YXJQYXRoJ1xuICAgIHwgJ2NvbG9yJ1xuICAgIHwgJ2lkJ1xuICAgIHwgJ25hbWUnXG4gICAgfCAncHJvZmlsZU5hbWUnXG4gICAgfCAnc2hhcmVkR3JvdXBOYW1lcydcbiAgICB8ICd0aXRsZSdcbiAgPjtcbiAgaGFzQWN0aXZlQ2FsbD86IGJvb2xlYW47XG4gIGhhc0FsbFN0b3JpZXNNdXRlZDogYm9vbGVhbjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbG9hZFN0b3J5UmVwbGllczogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsIG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBtYXJrU3RvcnlSZWFkOiAobUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG51bVN0b3JpZXM6IG51bWJlcjtcbiAgb25Hb1RvQ29udmVyc2F0aW9uOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb25IaWRlU3Rvcnk6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBvblNldFNraW5Ub25lOiAodG9uZTogbnVtYmVyKSA9PiB1bmtub3duO1xuICBvblRleHRUb29Mb25nOiAoKSA9PiB1bmtub3duO1xuICBvblJlYWN0VG9TdG9yeTogKGVtb2ppOiBzdHJpbmcsIHN0b3J5OiBTdG9yeVZpZXdUeXBlKSA9PiB1bmtub3duO1xuICBvblJlcGx5VG9TdG9yeTogKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBtZW50aW9uczogQXJyYXk8Qm9keVJhbmdlVHlwZT4sXG4gICAgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgc3Rvcnk6IFN0b3J5Vmlld1R5cGVcbiAgKSA9PiB1bmtub3duO1xuICBvblVzZUVtb2ppOiAoXzogRW1vamlQaWNrRGF0YVR5cGUpID0+IHVua25vd247XG4gIHByZWZlcnJlZFJlYWN0aW9uRW1vamk6IEFycmF5PHN0cmluZz47XG4gIHF1ZXVlU3RvcnlEb3dubG9hZDogKHN0b3J5SWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcmVjZW50RW1vamlzPzogQXJyYXk8c3RyaW5nPjtcbiAgcmVuZGVyRW1vamlQaWNrZXI6IChwcm9wczogUmVuZGVyRW1vamlQaWNrZXJQcm9wcykgPT4gSlNYLkVsZW1lbnQ7XG4gIHJlcGx5U3RhdGU/OiBSZXBseVN0YXRlVHlwZTtcbiAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbD86IGJvb2xlYW47XG4gIHNob3dUb2FzdDogU2hvd1RvYXN0QWN0aW9uQ3JlYXRvclR5cGU7XG4gIHNraW5Ub25lPzogbnVtYmVyO1xuICBzdG9yeTogU3RvcnlWaWV3VHlwZTtcbiAgc3RvcnlWaWV3TW9kZT86IFN0b3J5Vmlld01vZGVUeXBlO1xuICB0b2dnbGVIYXNBbGxTdG9yaWVzTXV0ZWQ6ICgpID0+IHVua25vd247XG4gIHZpZXdTdG9yeTogVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGU7XG59O1xuXG5jb25zdCBDQVBUSU9OX0JVRkZFUiA9IDIwO1xuY29uc3QgQ0FQVElPTl9JTklUSUFMX0xFTkdUSCA9IDIwMDtcbmNvbnN0IENBUFRJT05fTUFYX0xFTkdUSCA9IDcwMDtcbmNvbnN0IE1PVVNFX0lETEVfVElNRSA9IDMwMDA7XG5cbmVudW0gQXJyb3cge1xuICBOb25lLFxuICBMZWZ0LFxuICBSaWdodCxcbn1cblxuZXhwb3J0IGNvbnN0IFN0b3J5Vmlld2VyID0gKHtcbiAgY3VycmVudEluZGV4LFxuICBkZWxldGVTdG9yeUZvckV2ZXJ5b25lLFxuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgZ3JvdXAsXG4gIGhhc0FjdGl2ZUNhbGwsXG4gIGhhc0FsbFN0b3JpZXNNdXRlZCxcbiAgaTE4bixcbiAgbG9hZFN0b3J5UmVwbGllcyxcbiAgbWFya1N0b3J5UmVhZCxcbiAgbnVtU3RvcmllcyxcbiAgb25Hb1RvQ29udmVyc2F0aW9uLFxuICBvbkhpZGVTdG9yeSxcbiAgb25SZWFjdFRvU3RvcnksXG4gIG9uUmVwbHlUb1N0b3J5LFxuICBvblNldFNraW5Ub25lLFxuICBvblRleHRUb29Mb25nLFxuICBvblVzZUVtb2ppLFxuICBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppLFxuICBxdWV1ZVN0b3J5RG93bmxvYWQsXG4gIHJlY2VudEVtb2ppcyxcbiAgcmVuZGVyRW1vamlQaWNrZXIsXG4gIHJlcGx5U3RhdGUsXG4gIHNob3VsZFNob3dEZXRhaWxzTW9kYWwsXG4gIHNob3dUb2FzdCxcbiAgc2tpblRvbmUsXG4gIHN0b3J5LFxuICBzdG9yeVZpZXdNb2RlLFxuICB0b2dnbGVIYXNBbGxTdG9yaWVzTXV0ZWQsXG4gIHZpZXdTdG9yeSxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgW2lzU2hvd2luZ0NvbnRleHRNZW51LCBzZXRJc1Nob3dpbmdDb250ZXh0TWVudV0gPVxuICAgIHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgW3N0b3J5RHVyYXRpb24sIHNldFN0b3J5RHVyYXRpb25dID0gdXNlU3RhdGU8bnVtYmVyIHwgdW5kZWZpbmVkPigpO1xuICBjb25zdCBbaGFzQ29uZmlybUhpZGVTdG9yeSwgc2V0SGFzQ29uZmlybUhpZGVTdG9yeV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtyZWFjdGlvbkVtb2ppLCBzZXRSZWFjdGlvbkVtb2ppXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgW2NvbmZpcm1EZWxldGVTdG9yeSwgc2V0Q29uZmlybURlbGV0ZVN0b3J5XSA9IHVzZVN0YXRlPFxuICAgIFN0b3J5Vmlld1R5cGUgfCB1bmRlZmluZWRcbiAgPigpO1xuXG4gIGNvbnN0IHsgYXR0YWNobWVudCwgY2FuUmVwbHksIGlzSGlkZGVuLCBtZXNzYWdlSWQsIHNlbmRTdGF0ZSwgdGltZXN0YW1wIH0gPVxuICAgIHN0b3J5O1xuICBjb25zdCB7XG4gICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCxcbiAgICBhdmF0YXJQYXRoLFxuICAgIGNvbG9yLFxuICAgIGlzTWUsXG4gICAgaWQsXG4gICAgZmlyc3ROYW1lLFxuICAgIG5hbWUsXG4gICAgcHJvZmlsZU5hbWUsXG4gICAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgICB0aXRsZSxcbiAgfSA9IHN0b3J5LnNlbmRlcjtcblxuICBjb25zdCBbaGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwsIHNldEhhc1N0b3J5Vmlld3NOUmVwbGllc01vZGFsXSA9XG4gICAgdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaGFzU3RvcnlEZXRhaWxzTW9kYWwsIHNldEhhc1N0b3J5RGV0YWlsc01vZGFsXSA9IHVzZVN0YXRlKFxuICAgIEJvb2xlYW4oc2hvdWxkU2hvd0RldGFpbHNNb2RhbClcbiAgKTtcblxuICBjb25zdCBvbkNsb3NlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHZpZXdTdG9yeSh7XG4gICAgICBjbG9zZVZpZXdlcjogdHJ1ZSxcbiAgICB9KTtcbiAgfSwgW3ZpZXdTdG9yeV0pO1xuXG4gIGNvbnN0IG9uRXNjYXBlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChoYXNTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbCkge1xuICAgICAgc2V0SGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbkNsb3NlKCk7XG4gICAgfVxuICB9LCBbaGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwsIG9uQ2xvc2VdKTtcblxuICB1c2VFc2NhcGVIYW5kbGluZyhvbkVzY2FwZSk7XG5cbiAgLy8gQ2FwdGlvbiByZWxhdGVkIGhvb2tzXG4gIGNvbnN0IFtoYXNFeHBhbmRlZENhcHRpb24sIHNldEhhc0V4cGFuZGVkQ2FwdGlvbl0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG5cbiAgY29uc3QgY2FwdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghYXR0YWNobWVudD8uY2FwdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBncmFwaGVtZUF3YXJlU2xpY2UoXG4gICAgICBhdHRhY2htZW50LmNhcHRpb24sXG4gICAgICBoYXNFeHBhbmRlZENhcHRpb24gPyBDQVBUSU9OX01BWF9MRU5HVEggOiBDQVBUSU9OX0lOSVRJQUxfTEVOR1RILFxuICAgICAgQ0FQVElPTl9CVUZGRVJcbiAgICApO1xuICB9LCBbYXR0YWNobWVudD8uY2FwdGlvbiwgaGFzRXhwYW5kZWRDYXB0aW9uXSk7XG5cbiAgLy8gUmVzZXQgZXhwYW5zaW9uIGlmIG1lc3NhZ2VJZCBjaGFuZ2VzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0SGFzRXhwYW5kZWRDYXB0aW9uKGZhbHNlKTtcbiAgfSwgW21lc3NhZ2VJZF0pO1xuXG4gIC8vIG1lc3NhZ2VJZCBpcyBzZXQgYXMgYSBkZXBlbmRlbmN5IHNvIHRoYXQgd2UgY2FuIHJlc2V0IHRoZSBzdG9yeSBkdXJhdGlvblxuICAvLyB3aGVuIGEgbmV3IHN0b3J5IGlzIHNlbGVjdGVkIGluIGNhc2UgdGhlIHNhbWUgc3RvcnkgKGFuZCBzYW1lIGF0dGFjaG1lbnQpXG4gIC8vIGFyZSBzZXF1ZW50aWFsbHkgcG9zdGVkLlxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBzaG91bGRDYW5jZWwgPSBmYWxzZTtcbiAgICAoYXN5bmMgZnVuY3Rpb24gaHlkcmF0ZVN0b3J5RHVyYXRpb24oKSB7XG4gICAgICBpZiAoIWF0dGFjaG1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZHVyYXRpb24gPSBhd2FpdCBnZXRTdG9yeUR1cmF0aW9uKGF0dGFjaG1lbnQpO1xuICAgICAgaWYgKHNob3VsZENhbmNlbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2cuaW5mbygnc3Rvcmllcy5zZXRTdG9yeUR1cmF0aW9uJywge1xuICAgICAgICBjb250ZW50VHlwZTogYXR0YWNobWVudC50ZXh0QXR0YWNobWVudFxuICAgICAgICAgID8gJ3RleHQnXG4gICAgICAgICAgOiBhdHRhY2htZW50LmNvbnRlbnRUeXBlLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgIH0pO1xuICAgICAgc2V0U3RvcnlEdXJhdGlvbihkdXJhdGlvbik7XG4gICAgfSkoKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzaG91bGRDYW5jZWwgPSB0cnVlO1xuICAgIH07XG4gIH0sIFthdHRhY2htZW50LCBtZXNzYWdlSWRdKTtcblxuICBjb25zdCB1bm1vdW50UmVmID0gdXNlUmVmPGJvb2xlYW4+KGZhbHNlKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5tb3VudFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgY29uc3QgW3N0eWxlcywgc3ByaW5nXSA9IHVzZVNwcmluZyhcbiAgICAoKSA9PiAoe1xuICAgICAgZnJvbTogeyB3aWR0aDogMCB9LFxuICAgICAgdG86IHsgd2lkdGg6IDEwMCB9LFxuICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgIG9uUmVzdDoge1xuICAgICAgICB3aWR0aDogKHsgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgIGlmICh1bm1vdW50UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgICAnc3Rvcmllcy5TdG9yeVZpZXdlci5zcHJpbmcub25SZXN0OiBjYWxsZWQgYWZ0ZXIgY29tcG9uZW50IHVubW91bnRlZCdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAxMDApIHtcbiAgICAgICAgICAgIHZpZXdTdG9yeSh7XG4gICAgICAgICAgICAgIHN0b3J5SWQ6IHN0b3J5Lm1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgc3RvcnlWaWV3TW9kZSxcbiAgICAgICAgICAgICAgdmlld0RpcmVjdGlvbjogU3RvcnlWaWV3RGlyZWN0aW9uVHlwZS5OZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBbc3RvcnkubWVzc2FnZUlkLCBzdG9yeVZpZXdNb2RlLCB2aWV3U3RvcnldXG4gICk7XG5cbiAgLy8gV2UgbmVlZCB0byBiZSBjYXJlZnVsIGFib3V0IHRoaXMgZWZmZWN0IHJlZnJlc2hpbmcsIGl0IHNob3VsZCBvbmx5IHJ1blxuICAvLyBldmVyeSB0aW1lIGEgc3RvcnkgY2hhbmdlcyBvciBpdHMgZHVyYXRpb24gY2hhbmdlcy5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXN0b3J5RHVyYXRpb24pIHtcbiAgICAgIHNwcmluZy5zdG9wKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3ByaW5nLnN0YXJ0KHtcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBkdXJhdGlvbjogc3RvcnlEdXJhdGlvbixcbiAgICAgIH0sXG4gICAgICBmcm9tOiB7IHdpZHRoOiAwIH0sXG4gICAgICB0bzogeyB3aWR0aDogMTAwIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3ByaW5nLnN0b3AoKTtcbiAgICB9O1xuICB9LCBbY3VycmVudEluZGV4LCBzcHJpbmcsIHN0b3J5RHVyYXRpb25dKTtcblxuICBjb25zdCBbcGF1c2VTdG9yeSwgc2V0UGF1c2VTdG9yeV0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3Qgc2hvdWxkUGF1c2VWaWV3aW5nID1cbiAgICBoYXNBY3RpdmVDYWxsIHx8XG4gICAgaGFzQ29uZmlybUhpZGVTdG9yeSB8fFxuICAgIGhhc0V4cGFuZGVkQ2FwdGlvbiB8fFxuICAgIGhhc1N0b3J5RGV0YWlsc01vZGFsIHx8XG4gICAgaGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwgfHxcbiAgICBpc1Nob3dpbmdDb250ZXh0TWVudSB8fFxuICAgIHBhdXNlU3RvcnkgfHxcbiAgICBCb29sZWFuKHJlYWN0aW9uRW1vamkpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNob3VsZFBhdXNlVmlld2luZykge1xuICAgICAgc3ByaW5nLnBhdXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwcmluZy5yZXN1bWUoKTtcbiAgICB9XG4gIH0sIFtzaG91bGRQYXVzZVZpZXdpbmcsIHNwcmluZ10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbWFya1N0b3J5UmVhZChtZXNzYWdlSWQpO1xuICAgIGxvZy5pbmZvKCdzdG9yaWVzLm1hcmtTdG9yeVJlYWQnLCB7IG1lc3NhZ2VJZCB9KTtcbiAgfSwgW21hcmtTdG9yeVJlYWQsIG1lc3NhZ2VJZF0pO1xuXG4gIGNvbnN0IG5hdmlnYXRlU3RvcmllcyA9IHVzZUNhbGxiYWNrKFxuICAgIChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2LmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG4gICAgICAgIHZpZXdTdG9yeSh7XG4gICAgICAgICAgc3RvcnlJZDogc3RvcnkubWVzc2FnZUlkLFxuICAgICAgICAgIHN0b3J5Vmlld01vZGUsXG4gICAgICAgICAgdmlld0RpcmVjdGlvbjogU3RvcnlWaWV3RGlyZWN0aW9uVHlwZS5OZXh0LFxuICAgICAgICB9KTtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcbiAgICAgICAgdmlld1N0b3J5KHtcbiAgICAgICAgICBzdG9yeUlkOiBzdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgc3RvcnlWaWV3TW9kZSxcbiAgICAgICAgICB2aWV3RGlyZWN0aW9uOiBTdG9yeVZpZXdEaXJlY3Rpb25UeXBlLlByZXZpb3VzLFxuICAgICAgICB9KTtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbc3RvcnkubWVzc2FnZUlkLCBzdG9yeVZpZXdNb2RlLCB2aWV3U3RvcnldXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgbmF2aWdhdGVTdG9yaWVzKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgbmF2aWdhdGVTdG9yaWVzKTtcbiAgICB9O1xuICB9LCBbbmF2aWdhdGVTdG9yaWVzXSk7XG5cbiAgY29uc3QgZ3JvdXBJZCA9IGdyb3VwPy5pZDtcbiAgY29uc3QgaXNHcm91cFN0b3J5ID0gQm9vbGVhbihncm91cElkKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWdyb3VwSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9hZFN0b3J5UmVwbGllcyhncm91cElkLCBtZXNzYWdlSWQpO1xuICB9LCBbZ3JvdXBJZCwgbG9hZFN0b3J5UmVwbGllcywgbWVzc2FnZUlkXSk7XG5cbiAgY29uc3QgW2Fycm93VG9TaG93LCBzZXRBcnJvd1RvU2hvd10gPSB1c2VTdGF0ZTxBcnJvdz4oQXJyb3cuTm9uZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXJyb3dUb1Nob3cgPT09IEFycm93Lk5vbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbGFzdE1vdXNlTW92ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGFzdE1vdXNlTW92ZSgpIHtcbiAgICAgIGxhc3RNb3VzZU1vdmUgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrTW91c2VJZGxlKCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKGxhc3RNb3VzZU1vdmUgJiYgRGF0ZS5ub3coKSAtIGxhc3RNb3VzZU1vdmUgPiBNT1VTRV9JRExFX1RJTUUpIHtcbiAgICAgICAgICBzZXRBcnJvd1RvU2hvdyhBcnJvdy5Ob25lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGVja01vdXNlSWRsZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgY2hlY2tNb3VzZUlkbGUoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHVwZGF0ZUxhc3RNb3VzZU1vdmUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGxhc3RNb3VzZU1vdmUgPSB1bmRlZmluZWQ7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB1cGRhdGVMYXN0TW91c2VNb3ZlKTtcbiAgICB9O1xuICB9LCBbYXJyb3dUb1Nob3ddKTtcblxuICBjb25zdCByZXBsaWVzID1cbiAgICByZXBseVN0YXRlICYmIHJlcGx5U3RhdGUubWVzc2FnZUlkID09PSBtZXNzYWdlSWQgPyByZXBseVN0YXRlLnJlcGxpZXMgOiBbXTtcbiAgY29uc3Qgdmlld3MgPSBzZW5kU3RhdGVcbiAgICA/IHNlbmRTdGF0ZS5maWx0ZXIoKHsgc3RhdHVzIH0pID0+IHN0YXR1cyA9PT0gU2VuZFN0YXR1cy5WaWV3ZWQpXG4gICAgOiBbXTtcbiAgY29uc3QgcmVwbHlDb3VudCA9IHJlcGxpZXMubGVuZ3RoO1xuICBjb25zdCB2aWV3Q291bnQgPSB2aWV3cy5sZW5ndGg7XG5cbiAgY29uc3QgaGFzUHJldk5leHRBcnJvd3MgPSBzdG9yeVZpZXdNb2RlICE9PSBTdG9yeVZpZXdNb2RlVHlwZS5TaW5nbGU7XG5cbiAgY29uc3QgY2FuTXV0ZVN0b3J5ID0gaXNWaWRlb0F0dGFjaG1lbnQoYXR0YWNobWVudCk7XG4gIGNvbnN0IGlzU3RvcnlNdXRlZCA9IGhhc0FsbFN0b3JpZXNNdXRlZCB8fCAhY2FuTXV0ZVN0b3J5O1xuXG4gIGxldCBtdXRlQ2xhc3NOYW1lOiBzdHJpbmc7XG4gIGxldCBtdXRlQXJpYUxhYmVsOiBzdHJpbmc7XG4gIGlmIChjYW5NdXRlU3RvcnkpIHtcbiAgICBtdXRlQXJpYUxhYmVsID0gaGFzQWxsU3Rvcmllc011dGVkXG4gICAgICA/IGkxOG4oJ1N0b3J5Vmlld2VyX191bm11dGUnKVxuICAgICAgOiBpMThuKCdTdG9yeVZpZXdlcl9fbXV0ZScpO1xuXG4gICAgbXV0ZUNsYXNzTmFtZSA9IGhhc0FsbFN0b3JpZXNNdXRlZFxuICAgICAgPyAnU3RvcnlWaWV3ZXJfX3VubXV0ZSdcbiAgICAgIDogJ1N0b3J5Vmlld2VyX19tdXRlJztcbiAgfSBlbHNlIHtcbiAgICBtdXRlQXJpYUxhYmVsID0gaTE4bignU3Rvcmllc19fdG9hc3QtLWhhc05vU291bmQnKTtcbiAgICBtdXRlQ2xhc3NOYW1lID0gJ1N0b3J5Vmlld2VyX19zb3VuZGxlc3MnO1xuICB9XG5cbiAgY29uc3QgY29udGV4dE1lbnVPcHRpb25zOiBSZWFkb25seUFycmF5PENvbnRleHRNZW51T3B0aW9uVHlwZTx1bmtub3duPj4gPVxuICAgIHNlbmRTdGF0ZVxuICAgICAgPyBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWNvbjogJ1N0b3J5TGlzdEl0ZW1fX2ljb24tLWluZm8nLFxuICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5TGlzdEl0ZW1fX2luZm8nKSxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldEhhc1N0b3J5RGV0YWlsc01vZGFsKHRydWUpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWNvbjogJ1N0b3J5TGlzdEl0ZW1fX2ljb24tLWRlbGV0ZScsXG4gICAgICAgICAgICBsYWJlbDogaTE4bignU3RvcnlMaXN0SXRlbV9fZGVsZXRlJyksXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRDb25maXJtRGVsZXRlU3Rvcnkoc3RvcnkpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICAgIDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGljb246ICdTdG9yeUxpc3RJdGVtX19pY29uLS1pbmZvJyxcbiAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeUxpc3RJdGVtX19pbmZvJyksXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRIYXNTdG9yeURldGFpbHNNb2RhbCh0cnVlKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGljb246ICdTdG9yeUxpc3RJdGVtX19pY29uLS1oaWRlJyxcbiAgICAgICAgICAgIGxhYmVsOiBpc0hpZGRlblxuICAgICAgICAgICAgICA/IGkxOG4oJ1N0b3J5TGlzdEl0ZW1fX3VuaGlkZScpXG4gICAgICAgICAgICAgIDogaTE4bignU3RvcnlMaXN0SXRlbV9faGlkZScpLFxuICAgICAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBvbkhpZGVTdG9yeShpZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0SGFzQ29uZmlybUhpZGVTdG9yeSh0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGljb246ICdTdG9yeUxpc3RJdGVtX19pY29uLS1jaGF0JyxcbiAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeUxpc3RJdGVtX19nby10by1jaGF0JyksXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIG9uR29Ub0NvbnZlcnNhdGlvbihpZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgcmV0dXJuIChcbiAgICA8Rm9jdXNUcmFwIGZvY3VzVHJhcE9wdGlvbnM9e3sgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWUgfX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Vmlld2VyXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fb3ZlcmxheVwiXG4gICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogZ2V0U3RvcnlCYWNrZ3JvdW5kKGF0dGFjaG1lbnQpIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX2NvbnRlbnRcIj5cbiAgICAgICAgICB7aGFzUHJldk5leHRBcnJvd3MgJiYgKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdiYWNrJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAnU3RvcnlWaWV3ZXJfX2Fycm93IFN0b3J5Vmlld2VyX19hcnJvdy0tbGVmdCcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1N0b3J5Vmlld2VyX19hcnJvdy0tdmlzaWJsZSc6IGFycm93VG9TaG93ID09PSBBcnJvdy5MZWZ0LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICB2aWV3U3Rvcnkoe1xuICAgICAgICAgICAgICAgICAgc3RvcnlJZDogc3RvcnkubWVzc2FnZUlkLFxuICAgICAgICAgICAgICAgICAgc3RvcnlWaWV3TW9kZSxcbiAgICAgICAgICAgICAgICAgIHZpZXdEaXJlY3Rpb246IFN0b3J5Vmlld0RpcmVjdGlvblR5cGUuUHJldmlvdXMsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17KCkgPT4gc2V0QXJyb3dUb1Nob3coQXJyb3cuTGVmdCl9XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX3Byb3RlY3Rpb24gU3RvcnlWaWV3ZXJfX3Byb3RlY3Rpb24tLXRvcFwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8U3RvcnlJbWFnZVxuICAgICAgICAgICAgICBhdHRhY2htZW50PXthdHRhY2htZW50fVxuICAgICAgICAgICAgICBmaXJzdE5hbWU9e2ZpcnN0TmFtZSB8fCB0aXRsZX1cbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaXNQYXVzZWQ9e3Nob3VsZFBhdXNlVmlld2luZ31cbiAgICAgICAgICAgICAgaXNNdXRlZD17aXNTdG9yeU11dGVkfVxuICAgICAgICAgICAgICBsYWJlbD17aTE4bignbGlnaHRib3hJbWFnZUFsdCcpfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fc3RvcnlcIlxuICAgICAgICAgICAgICBxdWV1ZVN0b3J5RG93bmxvYWQ9e3F1ZXVlU3RvcnlEb3dubG9hZH1cbiAgICAgICAgICAgICAgc3RvcnlJZD17bWVzc2FnZUlkfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7cmVhY3Rpb25FbW9qaSAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fYW5pbWF0ZWQtZW1vamlzXCI+XG4gICAgICAgICAgICAgICAgICA8QW5pbWF0ZWRFbW9qaUdhbG9yZVxuICAgICAgICAgICAgICAgICAgICBlbW9qaT17cmVhY3Rpb25FbW9qaX1cbiAgICAgICAgICAgICAgICAgICAgb25BbmltYXRpb25FbmQ9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRSZWFjdGlvbkVtb2ppKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9TdG9yeUltYWdlPlxuICAgICAgICAgICAge2hhc0V4cGFuZGVkQ2FwdGlvbiAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdjbG9zZS1wb3B1cCcpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5Vmlld2VyX19jYXB0aW9uX19vdmVybGF5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRIYXNFeHBhbmRlZENhcHRpb24oZmFsc2UpfVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Vmlld2VyX19tZXRhXCI+XG4gICAgICAgICAgICB7Y2FwdGlvbiAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX2NhcHRpb25cIj5cbiAgICAgICAgICAgICAgICB7Y2FwdGlvbi50ZXh0fVxuICAgICAgICAgICAgICAgIHtjYXB0aW9uLmhhc1JlYWRNb3JlICYmICFoYXNFeHBhbmRlZENhcHRpb24gJiYgKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJNZXNzYWdlQm9keV9fcmVhZC1tb3JlXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldEhhc0V4cGFuZGVkQ2FwdGlvbih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZXY6IFJlYWN0LktleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZXYua2V5ID09PSAnU3BhY2UnIHx8IGV2LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGFzRXhwYW5kZWRDYXB0aW9uKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIC4uLlxuICAgICAgICAgICAgICAgICAgICB7aTE4bignTWVzc2FnZUJvZHktLXJlYWQtbW9yZScpfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fbWV0YV9fcGxheWJhY2stYmFyXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17YWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgIGF2YXRhclBhdGg9e2F2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgICBiYWRnZT17dW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgY29sb3I9e2dldEF2YXRhckNvbG9yKGNvbG9yKX1cbiAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgIGlzTWU9e0Jvb2xlYW4oaXNNZSl9XG4gICAgICAgICAgICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17c2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgICAgICAgICAgIHNpemU9e0F2YXRhclNpemUuVFdFTlRZX0VJR0hUfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAge2dyb3VwICYmIChcbiAgICAgICAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17Z3JvdXAuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgYXZhdGFyUGF0aD17Z3JvdXAuYXZhdGFyUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgYmFkZ2U9e3VuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX21ldGEtLWdyb3VwLWF2YXRhclwiXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPXtnZXRBdmF0YXJDb2xvcihncm91cC5jb2xvcil9XG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJncm91cFwiXG4gICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgIGlzTWU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBuYW1lPXtncm91cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlTmFtZT17Z3JvdXAucHJvZmlsZU5hbWV9XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e2dyb3VwLnNoYXJlZEdyb3VwTmFtZXN9XG4gICAgICAgICAgICAgICAgICAgIHNpemU9e0F2YXRhclNpemUuVFdFTlRZX0VJR0hUfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17Z3JvdXAudGl0bGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fbWV0YS0tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIHtncm91cFxuICAgICAgICAgICAgICAgICAgICA/IGkxOG4oJ1N0b3JpZXNfX2Zyb20tdG8tZ3JvdXAnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cC50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICA6IHRpdGxlfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxNZXNzYWdlVGltZXN0YW1wXG4gICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgaXNSZWxhdGl2ZVRpbWVcbiAgICAgICAgICAgICAgICAgIG1vZHVsZT1cIlN0b3J5Vmlld2VyX19tZXRhLS10aW1lc3RhbXBcIlxuICAgICAgICAgICAgICAgICAgdGltZXN0YW1wPXt0aW1lc3RhbXB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX21ldGFfX3BsYXliYWNrLWNvbnRyb2xzXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17XG4gICAgICAgICAgICAgICAgICAgIHBhdXNlU3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICA/IGkxOG4oJ1N0b3J5Vmlld2VyX19wbGF5JylcbiAgICAgICAgICAgICAgICAgICAgICA6IGkxOG4oJ1N0b3J5Vmlld2VyX19wYXVzZScpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgICAgICAgICAgICBwYXVzZVN0b3J5ID8gJ1N0b3J5Vmlld2VyX19wbGF5JyA6ICdTdG9yeVZpZXdlcl9fcGF1c2UnXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYXVzZVN0b3J5KCFwYXVzZVN0b3J5KX1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17bXV0ZUFyaWFMYWJlbH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17bXV0ZUNsYXNzTmFtZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e1xuICAgICAgICAgICAgICAgICAgICBjYW5NdXRlU3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICA/IHRvZ2dsZUhhc0FsbFN0b3JpZXNNdXRlZFxuICAgICAgICAgICAgICAgICAgICAgIDogKCkgPT4gc2hvd1RvYXN0KFRvYXN0VHlwZS5TdG9yeU11dGVkKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8Q29udGV4dE1lbnVcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ015U3Rvcmllc19fbW9yZScpfVxuICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgIG1lbnVPcHRpb25zPXtjb250ZXh0TWVudU9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fbW9yZVwiXG4gICAgICAgICAgICAgICAgICBvbk1lbnVTaG93aW5nQ2hhbmdlZD17c2V0SXNTaG93aW5nQ29udGV4dE1lbnV9XG4gICAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgICAge0FycmF5LmZyb20oQXJyYXkobnVtU3RvcmllcyksIChfLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX3Byb2dyZXNzLS1jb250YWluZXJcIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50SW5kZXggPT09IGluZGV4ID8gKFxuICAgICAgICAgICAgICAgICAgICA8YW5pbWF0ZWQuZGl2XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX3Byb2dyZXNzLS1iYXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdG8oW3N0eWxlcy53aWR0aF0sIHdpZHRoID0+IGAke3dpZHRofSVgKSxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5Vmlld2VyX19wcm9ncmVzcy0tYmFyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGN1cnJlbnRJbmRleCA8IGluZGV4ID8gJzAlJyA6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX2FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgeyhjYW5SZXBseSB8fCBzZW5kU3RhdGUpICYmIChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fcmVwbHlcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwodHJ1ZSl9XG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIHtzZW5kU3RhdGUgfHwgcmVwbHlDb3VudCA+IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX3JlcGx5X19jaGV2cm9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VuZFN0YXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2aWV3Q291bnQgPT09IDEgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEludGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cIk15U3Rvcmllc19fdmlld3MtLXNpbmd1bGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e1s8c3Ryb25nPnt2aWV3Q291bnR9PC9zdHJvbmc+XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbnRsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJNeVN0b3JpZXNfX3ZpZXdzLS1wbHVyYWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cz17WzxzdHJvbmc+e3ZpZXdDb3VudH08L3N0cm9uZz5dfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAge3ZpZXdDb3VudCA+IDAgJiYgcmVwbHlDb3VudCA+IDAgJiYgJyAnfVxuICAgICAgICAgICAgICAgICAgICAgICAge3JlcGx5Q291bnQgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXBseUNvdW50ID09PSAxID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbnRsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJNeVN0b3JpZXNfX3JlcGxpZXMtLXNpbmd1bGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e1s8c3Ryb25nPntyZXBseUNvdW50fTwvc3Ryb25nPl19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW50bFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiTXlTdG9yaWVzX19yZXBsaWVzLS1wbHVyYWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cz17WzxzdHJvbmc+e3JlcGx5Q291bnR9PC9zdHJvbmc+XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICB7IXNlbmRTdGF0ZSAmJiAhcmVwbHlDb3VudCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX3JlcGx5X19hcnJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2lzR3JvdXBTdG9yeVxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IGkxOG4oJ1N0b3J5Vmlld2VyX19yZXBseS1ncm91cCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogaTE4bignU3RvcnlWaWV3ZXJfX3JlcGx5Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7aGFzUHJldk5leHRBcnJvd3MgJiYgKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdmb3J3YXJkJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAnU3RvcnlWaWV3ZXJfX2Fycm93IFN0b3J5Vmlld2VyX19hcnJvdy0tcmlnaHQnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdTdG9yeVZpZXdlcl9fYXJyb3ctLXZpc2libGUnOiBhcnJvd1RvU2hvdyA9PT0gQXJyb3cuUmlnaHQsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgIHZpZXdTdG9yeSh7XG4gICAgICAgICAgICAgICAgICBzdG9yeUlkOiBzdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgICBzdG9yeVZpZXdNb2RlLFxuICAgICAgICAgICAgICAgICAgdmlld0RpcmVjdGlvbjogU3RvcnlWaWV3RGlyZWN0aW9uVHlwZS5OZXh0LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25Nb3VzZU1vdmU9eygpID0+IHNldEFycm93VG9TaG93KEFycm93LlJpZ2h0KX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeVZpZXdlcl9fcHJvdGVjdGlvbiBTdG9yeVZpZXdlcl9fcHJvdGVjdGlvbi0tYm90dG9tXCIgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdjbG9zZScpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlWaWV3ZXJfX2Nsb3NlLWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2hhc1N0b3J5RGV0YWlsc01vZGFsICYmIChcbiAgICAgICAgICA8U3RvcnlEZXRhaWxzTW9kYWxcbiAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRIYXNTdG9yeURldGFpbHNNb2RhbChmYWxzZSl9XG4gICAgICAgICAgICBzZW5kZXI9e3N0b3J5LnNlbmRlcn1cbiAgICAgICAgICAgIHNlbmRTdGF0ZT17c2VuZFN0YXRlfVxuICAgICAgICAgICAgc2l6ZT17YXR0YWNobWVudD8uc2l6ZX1cbiAgICAgICAgICAgIHRpbWVzdGFtcD17dGltZXN0YW1wfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtoYXNTdG9yeVZpZXdzTlJlcGxpZXNNb2RhbCAmJiAoXG4gICAgICAgICAgPFN0b3J5Vmlld3NOUmVwbGllc01vZGFsXG4gICAgICAgICAgICBhdXRob3JUaXRsZT17Zmlyc3ROYW1lIHx8IHRpdGxlfVxuICAgICAgICAgICAgY2FuUmVwbHk9e0Jvb2xlYW4oY2FuUmVwbHkpfVxuICAgICAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIGlzR3JvdXBTdG9yeT17aXNHcm91cFN0b3J5fVxuICAgICAgICAgICAgaXNNeVN0b3J5PXtpc01lfVxuICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwoZmFsc2UpfVxuICAgICAgICAgICAgb25SZWFjdD17ZW1vamkgPT4ge1xuICAgICAgICAgICAgICBvblJlYWN0VG9TdG9yeShlbW9qaSwgc3RvcnkpO1xuICAgICAgICAgICAgICBpZiAoIWlzR3JvdXBTdG9yeSkge1xuICAgICAgICAgICAgICAgIHNldEhhc1N0b3J5Vmlld3NOUmVwbGllc01vZGFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRSZWFjdGlvbkVtb2ppKGVtb2ppKTtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KFRvYXN0VHlwZS5TdG9yeVJlYWN0KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvblJlcGx5PXsobWVzc2FnZSwgbWVudGlvbnMsIHJlcGx5VGltZXN0YW1wKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghaXNHcm91cFN0b3J5KSB7XG4gICAgICAgICAgICAgICAgc2V0SGFzU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwoZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUmVwbHlUb1N0b3J5KG1lc3NhZ2UsIG1lbnRpb25zLCByZXBseVRpbWVzdGFtcCwgc3RvcnkpO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoVG9hc3RUeXBlLlN0b3J5UmVwbHkpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uU2V0U2tpblRvbmU9e29uU2V0U2tpblRvbmV9XG4gICAgICAgICAgICBvblRleHRUb29Mb25nPXtvblRleHRUb29Mb25nfVxuICAgICAgICAgICAgb25Vc2VFbW9qaT17b25Vc2VFbW9qaX1cbiAgICAgICAgICAgIHByZWZlcnJlZFJlYWN0aW9uRW1vamk9e3ByZWZlcnJlZFJlYWN0aW9uRW1vaml9XG4gICAgICAgICAgICByZWNlbnRFbW9qaXM9e3JlY2VudEVtb2ppc31cbiAgICAgICAgICAgIHJlbmRlckVtb2ppUGlja2VyPXtyZW5kZXJFbW9qaVBpY2tlcn1cbiAgICAgICAgICAgIHJlcGxpZXM9e3JlcGxpZXN9XG4gICAgICAgICAgICBza2luVG9uZT17c2tpblRvbmV9XG4gICAgICAgICAgICBzdG9yeVByZXZpZXdBdHRhY2htZW50PXthdHRhY2htZW50fVxuICAgICAgICAgICAgdmlld3M9e3ZpZXdzfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtoYXNDb25maXJtSGlkZVN0b3J5ICYmIChcbiAgICAgICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IG9uSGlkZVN0b3J5KGlkKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogJ2FmZmlybWF0aXZlJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBpMThuKCdTdG9yeUxpc3RJdGVtX19oaWRlLW1vZGFsLS1jb25maXJtJyksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0SGFzQ29uZmlybUhpZGVTdG9yeShmYWxzZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdTdG9yeUxpc3RJdGVtX19oaWRlLW1vZGFsLS1ib2R5JywgW1N0cmluZyhmaXJzdE5hbWUpXSl9XG4gICAgICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgICAgICl9XG4gICAgICAgIHtjb25maXJtRGVsZXRlU3RvcnkgJiYgKFxuICAgICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICAgIGFjdGlvbnM9e1tcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ2RlbGV0ZScpLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gZGVsZXRlU3RvcnlGb3JFdmVyeW9uZShjb25maXJtRGVsZXRlU3RvcnkpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlU3RvcnkodW5kZWZpbmVkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignTXlTdG9yaWVzX19kZWxldGUnKX1cbiAgICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvRm9jdXNUcmFwPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSw4QkFBc0I7QUFDdEIsbUJBTU87QUFDUCx3QkFBdUI7QUFDdkIsaUJBQXdDO0FBVXhDLFVBQXFCO0FBQ3JCLGlDQUFvQztBQUNwQyxvQkFBbUM7QUFDbkMsZ0NBQW1DO0FBQ25DLHlCQUE0QjtBQUM1QixrQkFBcUI7QUFDckIsOEJBQWlDO0FBQ2pDLDhCQUEyQjtBQUMzQiwrQkFBa0M7QUFDbEMscUNBQXdDO0FBQ3hDLHdCQUEyQjtBQUMzQixxQkFBMEQ7QUFDMUQsbUJBQXNCO0FBQ3RCLG1CQUEwQjtBQUMxQixvQkFBK0I7QUFDL0IsZ0NBQW1DO0FBQ25DLDhCQUFpQztBQUNqQyx3QkFBa0M7QUFDbEMsZ0NBQW1DO0FBQ25DLCtCQUFrQztBQWlEbEMsTUFBTSxpQkFBaUI7QUFDdkIsTUFBTSx5QkFBeUI7QUFDL0IsTUFBTSxxQkFBcUI7QUFDM0IsTUFB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QkFBd0IsS0FBSztBQUFBLElBQzVDLFFBQVEsTUFBTTtBQUFBLElBQ2Q7QUFBQSxJQUNBLE1BQU0sWUFBWTtBQUFBLElBQ2xCO0FBQUEsR0FDRixHQUVELDhCQUNDLG1EQUFDO0FBQUEsSUFDQyxhQUFhLGFBQWE7QUFBQSxJQUMxQixVQUFVLFFBQVEsUUFBUTtBQUFBLElBQzFCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLFNBQVMsTUFBTSw4QkFBOEIsS0FBSztBQUFBLElBQ2xELFNBQVMsV0FBUztBQUNoQixxQkFBZSxPQUFPLEtBQUs7QUFDM0IsVUFBSSxDQUFDLGNBQWM7QUFDakIsc0NBQThCLEtBQUs7QUFBQSxNQUNyQztBQUNBLHVCQUFpQixLQUFLO0FBQ3RCLGdCQUFVLHVCQUFVLFVBQVU7QUFBQSxJQUNoQztBQUFBLElBQ0EsU0FBUyxDQUFDLFNBQVMsVUFBVSxtQkFBbUI7QUFDOUMsVUFBSSxDQUFDLGNBQWM7QUFDakIsc0NBQThCLEtBQUs7QUFBQSxNQUNyQztBQUNBLHFCQUFlLFNBQVMsVUFBVSxnQkFBZ0IsS0FBSztBQUN2RCxnQkFBVSx1QkFBVSxVQUFVO0FBQUEsSUFDaEM7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0Esd0JBQXdCO0FBQUEsSUFDeEI7QUFBQSxHQUNGLEdBRUQsdUJBQ0MsbURBQUM7QUFBQSxJQUNDLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxRQUFRLE1BQU0sWUFBWSxFQUFFO0FBQUEsUUFDNUIsT0FBTztBQUFBLFFBQ1AsTUFBTSxLQUFLLG9DQUFvQztBQUFBLE1BQ2pEO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxJQUNBLFNBQVMsTUFBTTtBQUNiLDZCQUF1QixLQUFLO0FBQUEsSUFDOUI7QUFBQSxLQUVDLEtBQUssbUNBQW1DLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUM5RCxHQUVELHNCQUNDLG1EQUFDO0FBQUEsSUFDQyxTQUFTO0FBQUEsTUFDUDtBQUFBLFFBQ0UsTUFBTSxLQUFLLFFBQVE7QUFBQSxRQUNuQixRQUFRLE1BQU0sdUJBQXVCLGtCQUFrQjtBQUFBLFFBQ3ZELE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxJQUNBLFNBQVMsTUFBTSxzQkFBc0IsTUFBUztBQUFBLEtBRTdDLEtBQUssbUJBQW1CLENBQzNCLENBRUosQ0FDRjtBQUVKLEdBenJCMkI7IiwKICAibmFtZXMiOiBbXQp9Cg==
