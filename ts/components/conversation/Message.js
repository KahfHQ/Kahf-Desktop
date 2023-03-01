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
var Message_exports = {};
__export(Message_exports, {
  Directions: () => Directions,
  GiftBadgeStates: () => GiftBadgeStates,
  Message: () => Message,
  MessageStatuses: () => MessageStatuses,
  TextDirection: () => TextDirection
});
module.exports = __toCommonJS(Message_exports);
var import_react = __toESM(require("react"));
var import_react_dom = __toESM(require("react-dom"));
var import_classnames = __toESM(require("classnames"));
var import_direction = __toESM(require("direction"));
var import_lodash = require("lodash");
var import_react_contextmenu = require("react-contextmenu");
var import_react_popper = require("react-popper");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_Avatar = require("../Avatar");
var import_AvatarSpacer = require("../AvatarSpacer");
var import_Spinner = require("../Spinner");
var import_MessageBodyReadMore = require("./MessageBodyReadMore");
var import_MessageMetadata = require("./MessageMetadata");
var import_MessageTextMetadataSpacer = require("./MessageTextMetadataSpacer");
var import_ImageGrid = require("./ImageGrid");
var import_GIF = require("./GIF");
var import_Image = require("./Image");
var import_ContactName = require("./ContactName");
var import_Quote = require("./Quote");
var import_EmbeddedContact = require("./EmbeddedContact");
var import_ReactionViewer = require("./ReactionViewer");
var import_Emoji = require("../emoji/Emoji");
var import_LinkPreviewDate = require("./LinkPreviewDate");
var import_shouldUseFullSizeLinkPreviewImage = require("../../linkPreviews/shouldUseFullSizeLinkPreviewImage");
var import_util = require("../_util");
var import_OutgoingGiftBadgeModal = require("../OutgoingGiftBadgeModal");
var log = __toESM(require("../../logging/log"));
var import_Stories = require("../../types/Stories");
var import_Attachment = require("../../types/Attachment");
var import_timer = require("../../util/timer");
var import_clearTimeoutIfNecessary = require("../../util/clearTimeoutIfNecessary");
var import_isFileDangerous = require("../../util/isFileDangerous");
var import_missingCaseError = require("../../util/missingCaseError");
var import_refMerger = require("../../util/refMerger");
var import_lib = require("../emoji/lib");
var import_isEmojiOnlyText = require("../../util/isEmojiOnlyText");
var import_getCustomColorStyle = require("../../util/getCustomColorStyle");
var import_popperUtil = require("../../util/popperUtil");
var KeyboardLayout = __toESM(require("../../services/keyboardLayout"));
var import_StopPropagation = require("../StopPropagation");
var import_durations = require("../../util/durations");
var import_BadgeImageTheme = require("../../badges/BadgeImageTheme");
var import_getBadgeImageFileLocalPath = require("../../badges/getBadgeImageFileLocalPath");
const GUESS_METADATA_WIDTH_TIMESTAMP_SIZE = 10;
const GUESS_METADATA_WIDTH_EXPIRE_TIMER_SIZE = 18;
const GUESS_METADATA_WIDTH_OUTGOING_SIZE = {
  delivered: 24,
  error: 24,
  paused: 18,
  "partial-sent": 24,
  read: 24,
  sending: 18,
  sent: 24,
  viewed: 24
};
const EXPIRATION_CHECK_MINIMUM = 2e3;
const EXPIRED_DELAY = 600;
const GROUP_AVATAR_SIZE = import_Avatar.AvatarSize.TWENTY_EIGHT;
const STICKER_SIZE = 200;
const GIF_SIZE = 300;
const SELECTED_TIMEOUT = 1200;
const THREE_HOURS = 3 * 60 * 60 * 1e3;
const SENT_STATUSES = /* @__PURE__ */ new Set([
  "delivered",
  "read",
  "sent",
  "viewed"
]);
const GIFT_BADGE_UPDATE_INTERVAL = 30 * import_durations.SECOND;
var MetadataPlacement = /* @__PURE__ */ ((MetadataPlacement2) => {
  MetadataPlacement2[MetadataPlacement2["NotRendered"] = 0] = "NotRendered";
  MetadataPlacement2[MetadataPlacement2["RenderedByMessageAudioComponent"] = 1] = "RenderedByMessageAudioComponent";
  MetadataPlacement2[MetadataPlacement2["InlineWithText"] = 2] = "InlineWithText";
  MetadataPlacement2[MetadataPlacement2["Bottom"] = 3] = "Bottom";
  return MetadataPlacement2;
})(MetadataPlacement || {});
var TextDirection = /* @__PURE__ */ ((TextDirection2) => {
  TextDirection2["LeftToRight"] = "LeftToRight";
  TextDirection2["RightToLeft"] = "RightToLeft";
  TextDirection2["Default"] = "Default";
  TextDirection2["None"] = "None";
  return TextDirection2;
})(TextDirection || {});
const MessageStatuses = [
  "delivered",
  "error",
  "paused",
  "partial-sent",
  "read",
  "sending",
  "sent",
  "viewed"
];
const Directions = ["incoming", "outgoing"];
var GiftBadgeStates = /* @__PURE__ */ ((GiftBadgeStates2) => {
  GiftBadgeStates2["Unopened"] = "Unopened";
  GiftBadgeStates2["Opened"] = "Opened";
  GiftBadgeStates2["Redeemed"] = "Redeemed";
  return GiftBadgeStates2;
})(GiftBadgeStates || {});
class Message extends import_react.default.PureComponent {
  constructor(props) {
    super(props);
    this.focusRef = import_react.default.createRef();
    this.audioButtonRef = import_react.default.createRef();
    this.reactionsContainerRef = import_react.default.createRef();
    this.reactionsContainerRefMerger = (0, import_refMerger.createRefMerger)();
    this.captureMenuTrigger = /* @__PURE__ */ __name((triggerRef) => {
      this.menuTriggerRef = triggerRef;
    }, "captureMenuTrigger");
    this.showMenu = /* @__PURE__ */ __name((event) => {
      if (this.menuTriggerRef) {
        this.menuTriggerRef.handleContextClick(event);
      }
    }, "showMenu");
    this.showContextMenu = /* @__PURE__ */ __name((event) => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        return;
      }
      if (event.target instanceof HTMLAnchorElement) {
        return;
      }
      this.showMenu(event);
    }, "showContextMenu");
    this.handleImageError = /* @__PURE__ */ __name(() => {
      const { id } = this.props;
      log.info(`Message ${id}: Image failed to load; failing over to placeholder`);
      this.setState({
        imageBroken: true
      });
    }, "handleImageError");
    this.handleFocus = /* @__PURE__ */ __name(() => {
      const { interactionMode } = this.props;
      if (interactionMode === "keyboard") {
        this.setSelected();
      }
    }, "handleFocus");
    this.setSelected = /* @__PURE__ */ __name(() => {
      const { id, conversationId, selectMessage } = this.props;
      if (selectMessage) {
        selectMessage(id, conversationId);
      }
    }, "setSelected");
    this.setFocus = /* @__PURE__ */ __name(() => {
      const container = this.focusRef.current;
      if (container && !container.contains(document.activeElement)) {
        container.focus();
      }
    }, "setFocus");
    this.updateMetadataWidth = /* @__PURE__ */ __name((newMetadataWidth) => {
      this.setState(({ metadataWidth }) => ({
        metadataWidth: Math.max(metadataWidth, newMetadataWidth)
      }));
    }, "updateMetadataWidth");
    this.toggleReactionViewer = /* @__PURE__ */ __name((onlyRemove = false) => {
      this.setState(({ reactionViewerRoot }) => {
        if (reactionViewerRoot) {
          document.body.removeChild(reactionViewerRoot);
          document.body.removeEventListener("click", this.handleClickOutsideReactionViewer, true);
          return { reactionViewerRoot: null };
        }
        if (!onlyRemove) {
          const root = document.createElement("div");
          document.body.appendChild(root);
          document.body.addEventListener("click", this.handleClickOutsideReactionViewer, true);
          return {
            reactionViewerRoot: root
          };
        }
        return null;
      });
    }, "toggleReactionViewer");
    this.toggleReactionPicker = /* @__PURE__ */ __name((onlyRemove = false) => {
      this.setState(({ reactionPickerRoot }) => {
        if (reactionPickerRoot) {
          document.body.removeChild(reactionPickerRoot);
          document.body.removeEventListener("click", this.handleClickOutsideReactionPicker, true);
          return { reactionPickerRoot: null };
        }
        if (!onlyRemove) {
          const root = document.createElement("div");
          document.body.appendChild(root);
          document.body.addEventListener("click", this.handleClickOutsideReactionPicker, true);
          return {
            reactionPickerRoot: root
          };
        }
        return null;
      });
    }, "toggleReactionPicker");
    this.handleClickOutsideReactionViewer = /* @__PURE__ */ __name((e) => {
      const { reactionViewerRoot } = this.state;
      const { current: reactionsContainer } = this.reactionsContainerRef;
      if (reactionViewerRoot && reactionsContainer) {
        if (!reactionViewerRoot.contains(e.target) && !reactionsContainer.contains(e.target)) {
          this.toggleReactionViewer(true);
        }
      }
    }, "handleClickOutsideReactionViewer");
    this.handleClickOutsideReactionPicker = /* @__PURE__ */ __name((e) => {
      const { reactionPickerRoot } = this.state;
      if (reactionPickerRoot) {
        if (!reactionPickerRoot.contains(e.target)) {
          this.toggleReactionPicker(true);
        }
      }
    }, "handleClickOutsideReactionPicker");
    this.handleOpen = /* @__PURE__ */ __name((event) => {
      const {
        attachments,
        contact,
        displayTapToViewMessage,
        direction,
        giftBadge,
        id,
        isTapToView,
        isTapToViewExpired,
        kickOffAttachmentDownload,
        startConversation,
        openGiftBadge,
        showContactDetail,
        showVisualAttachment,
        showExpiredIncomingTapToViewToast,
        showExpiredOutgoingTapToViewToast
      } = this.props;
      const { imageBroken } = this.state;
      const isAttachmentPending = this.isAttachmentPending();
      if (giftBadge && giftBadge.state === "Unopened" /* Unopened */) {
        openGiftBadge(id);
        return;
      }
      if (isTapToView) {
        if (isAttachmentPending) {
          log.info("<Message> handleOpen: tap-to-view attachment is pending; not showing the lightbox");
          return;
        }
        if (attachments && !(0, import_Attachment.isDownloaded)(attachments[0])) {
          event.preventDefault();
          event.stopPropagation();
          kickOffAttachmentDownload({
            attachment: attachments[0],
            messageId: id
          });
          return;
        }
        if (isTapToViewExpired) {
          const action = direction === "outgoing" ? showExpiredOutgoingTapToViewToast : showExpiredIncomingTapToViewToast;
          action();
        } else {
          event.preventDefault();
          event.stopPropagation();
          displayTapToViewMessage(id);
        }
        return;
      }
      if (!imageBroken && attachments && attachments.length > 0 && !isAttachmentPending && ((0, import_Attachment.isImage)(attachments) || (0, import_Attachment.isVideo)(attachments)) && !(0, import_Attachment.isDownloaded)(attachments[0])) {
        event.preventDefault();
        event.stopPropagation();
        const attachment = attachments[0];
        kickOffAttachmentDownload({ attachment, messageId: id });
        return;
      }
      if (!imageBroken && attachments && attachments.length > 0 && !isAttachmentPending && (0, import_Attachment.canDisplayImage)(attachments) && ((0, import_Attachment.isImage)(attachments) && (0, import_Attachment.hasImage)(attachments) || (0, import_Attachment.isVideo)(attachments) && (0, import_Attachment.hasVideoScreenshot)(attachments))) {
        event.preventDefault();
        event.stopPropagation();
        const attachment = attachments[0];
        showVisualAttachment({ attachment, messageId: id });
        return;
      }
      if (attachments && attachments.length === 1 && !isAttachmentPending && !(0, import_Attachment.isAudio)(attachments)) {
        event.preventDefault();
        event.stopPropagation();
        this.openGenericAttachment();
        return;
      }
      if (!isAttachmentPending && (0, import_Attachment.isAudio)(attachments) && this.audioButtonRef && this.audioButtonRef.current) {
        event.preventDefault();
        event.stopPropagation();
        this.audioButtonRef.current.click();
        return;
      }
      if (contact && contact.firstNumber && contact.uuid) {
        startConversation(contact.firstNumber, contact.uuid);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (contact) {
        const signalAccount = contact.firstNumber && contact.uuid ? {
          phoneNumber: contact.firstNumber,
          uuid: contact.uuid
        } : void 0;
        showContactDetail({ contact, signalAccount });
        event.preventDefault();
        event.stopPropagation();
      }
    }, "handleOpen");
    this.openGenericAttachment = /* @__PURE__ */ __name((event) => {
      const {
        id,
        attachments,
        downloadAttachment,
        timestamp,
        kickOffAttachmentDownload
      } = this.props;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (!attachments || attachments.length !== 1) {
        return;
      }
      const attachment = attachments[0];
      if (!(0, import_Attachment.isDownloaded)(attachment)) {
        kickOffAttachmentDownload({
          attachment,
          messageId: id
        });
        return;
      }
      const { fileName } = attachment;
      const isDangerous = (0, import_isFileDangerous.isFileDangerous)(fileName || "");
      downloadAttachment({
        isDangerous,
        attachment,
        timestamp
      });
    }, "openGenericAttachment");
    this.handleKeyDown = /* @__PURE__ */ __name((event) => {
      const { canReact } = this.props;
      const key = KeyboardLayout.lookup(event.nativeEvent);
      if ((key === "E" || key === "e") && (event.metaKey || event.ctrlKey) && event.shiftKey && canReact) {
        this.toggleReactionPicker();
      }
      if (event.key !== "Enter" && event.key !== "Space") {
        return;
      }
      this.handleOpen(event);
    }, "handleKeyDown");
    this.handleClick = /* @__PURE__ */ __name((event) => {
      const { text } = this.props;
      if (text && text.length > 0) {
        return;
      }
      this.handleOpen(event);
    }, "handleClick");
    this.state = {
      metadataWidth: this.guessMetadataWidth(),
      expiring: false,
      expired: false,
      imageBroken: false,
      isSelected: props.isSelected,
      prevSelectedCounter: props.isSelectedCounter,
      reactionViewerRoot: null,
      reactionPickerRoot: null,
      giftBadgeCounter: null,
      showOutgoingGiftBadgeModal: false,
      hasDeleteForEveryoneTimerExpired: this.getTimeRemainingForDeleteForEveryone() <= 0
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (!props.isSelected) {
      return {
        ...state,
        isSelected: false,
        prevSelectedCounter: 0
      };
    }
    if (props.isSelected && props.isSelectedCounter !== state.prevSelectedCounter) {
      return {
        ...state,
        isSelected: props.isSelected,
        prevSelectedCounter: props.isSelectedCounter
      };
    }
    return state;
  }
  hasReactions() {
    const { reactions } = this.props;
    return Boolean(reactions && reactions.length);
  }
  componentDidMount() {
    const { conversationId } = this.props;
    window.ConversationController?.onConvoMessageMount(conversationId);
    this.startSelectedTimer();
    this.startDeleteForEveryoneTimerIfApplicable();
    this.startGiftBadgeInterval();
    const { isSelected } = this.props;
    if (isSelected) {
      this.setFocus();
    }
    const { expirationLength } = this.props;
    if (expirationLength) {
      const increment = (0, import_timer.getIncrement)(expirationLength);
      const checkFrequency = Math.max(EXPIRATION_CHECK_MINIMUM, increment);
      this.checkExpired();
      this.expirationCheckInterval = setInterval(() => {
        this.checkExpired();
      }, checkFrequency);
    }
    const { contact, checkForAccount } = this.props;
    if (contact && contact.firstNumber && !contact.uuid) {
      checkForAccount(contact.firstNumber);
    }
  }
  componentWillUnmount() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.selectedTimeout);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.expirationCheckInterval);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.expiredTimeout);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.deleteForEveryoneTimeout);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.giftBadgeInterval);
    this.toggleReactionViewer(true);
    this.toggleReactionPicker(true);
  }
  componentDidUpdate(prevProps) {
    const { isSelected, status, timestamp } = this.props;
    this.startSelectedTimer();
    this.startDeleteForEveryoneTimerIfApplicable();
    if (!prevProps.isSelected && isSelected) {
      this.setFocus();
    }
    this.checkExpired();
    if (prevProps.status === "sending" && (status === "sent" || status === "delivered" || status === "read" || status === "viewed")) {
      const delta = Date.now() - timestamp;
      window.CI?.handleEvent("message:send-complete", {
        timestamp,
        delta
      });
      log.info(`Message.tsx: Rendered 'send complete' for message ${timestamp}; took ${delta}ms`);
    }
  }
  getMetadataPlacement({
    attachments,
    deletedForEveryone,
    direction,
    expirationLength,
    expirationTimestamp,
    giftBadge,
    i18n,
    shouldHideMetadata,
    status,
    text,
    textDirection
  } = this.props) {
    const isRTL = textDirection === "RightToLeft" /* RightToLeft */;
    if (!expirationLength && !expirationTimestamp && (!status || SENT_STATUSES.has(status)) && shouldHideMetadata) {
      return 0 /* NotRendered */;
    }
    if (giftBadge) {
      const description = i18n(`message--giftBadge--unopened--${direction}`);
      const isDescriptionRTL = (0, import_direction.default)(description) === "rtl";
      if (giftBadge.state === "Unopened" /* Unopened */ && !isDescriptionRTL) {
        return 2 /* InlineWithText */;
      }
      return 3 /* Bottom */;
    }
    if (!text && !deletedForEveryone) {
      return (0, import_Attachment.isAudio)(attachments) ? 1 /* RenderedByMessageAudioComponent */ : 3 /* Bottom */;
    }
    if (this.canRenderStickerLikeEmoji()) {
      return 3 /* Bottom */;
    }
    if (isRTL) {
      return 3 /* Bottom */;
    }
    return 2 /* InlineWithText */;
  }
  guessMetadataWidth() {
    const { direction, expirationLength, status } = this.props;
    let result = GUESS_METADATA_WIDTH_TIMESTAMP_SIZE;
    const hasExpireTimer = Boolean(expirationLength);
    if (hasExpireTimer) {
      result += GUESS_METADATA_WIDTH_EXPIRE_TIMER_SIZE;
    }
    if (direction === "outgoing" && status) {
      result += GUESS_METADATA_WIDTH_OUTGOING_SIZE[status];
    }
    return result;
  }
  startSelectedTimer() {
    const { clearSelectedMessage, interactionMode } = this.props;
    const { isSelected } = this.state;
    if (interactionMode === "keyboard" || !isSelected) {
      return;
    }
    if (!this.selectedTimeout) {
      this.selectedTimeout = setTimeout(() => {
        this.selectedTimeout = void 0;
        this.setState({ isSelected: false });
        clearSelectedMessage();
      }, SELECTED_TIMEOUT);
    }
  }
  startGiftBadgeInterval() {
    const { giftBadge } = this.props;
    if (!giftBadge) {
      return;
    }
    this.giftBadgeInterval = setInterval(() => {
      this.updateGiftBadgeCounter();
    }, GIFT_BADGE_UPDATE_INTERVAL);
  }
  updateGiftBadgeCounter() {
    this.setState((state) => ({
      giftBadgeCounter: (state.giftBadgeCounter || 0) + 1
    }));
  }
  getTimeRemainingForDeleteForEveryone() {
    const { timestamp } = this.props;
    return Math.max(timestamp - Date.now() + THREE_HOURS, 0);
  }
  canDeleteForEveryone() {
    const { canDeleteForEveryone } = this.props;
    const { hasDeleteForEveryoneTimerExpired } = this.state;
    return canDeleteForEveryone && !hasDeleteForEveryoneTimerExpired;
  }
  startDeleteForEveryoneTimerIfApplicable() {
    const { canDeleteForEveryone } = this.props;
    const { hasDeleteForEveryoneTimerExpired } = this.state;
    if (!canDeleteForEveryone || hasDeleteForEveryoneTimerExpired || this.deleteForEveryoneTimeout) {
      return;
    }
    this.deleteForEveryoneTimeout = setTimeout(() => {
      this.setState({ hasDeleteForEveryoneTimerExpired: true });
      delete this.deleteForEveryoneTimeout;
    }, this.getTimeRemainingForDeleteForEveryone());
  }
  checkExpired() {
    const now = Date.now();
    const { expirationTimestamp, expirationLength } = this.props;
    if (!expirationTimestamp || !expirationLength) {
      return;
    }
    if (this.expiredTimeout) {
      return;
    }
    if (now >= expirationTimestamp) {
      this.setState({
        expiring: true
      });
      const setExpired = /* @__PURE__ */ __name(() => {
        this.setState({
          expired: true
        });
      }, "setExpired");
      this.expiredTimeout = setTimeout(setExpired, EXPIRED_DELAY);
    }
  }
  areLinksEnabled() {
    const { isMessageRequestAccepted, isBlocked } = this.props;
    return isMessageRequestAccepted && !isBlocked;
  }
  shouldRenderAuthor() {
    const { author, conversationType, direction, shouldCollapseAbove } = this.props;
    return Boolean(direction === "incoming" && conversationType === "group" && author.title && !shouldCollapseAbove);
  }
  canRenderStickerLikeEmoji() {
    const { text, quote, attachments, previews } = this.props;
    return Boolean(text && (0, import_isEmojiOnlyText.isEmojiOnlyText)(text) && (0, import_lib.getEmojiCount)(text) < 6 && !quote && (!attachments || !attachments.length) && (!previews || !previews.length));
  }
  renderMetadata() {
    let isInline;
    const metadataPlacement = this.getMetadataPlacement();
    switch (metadataPlacement) {
      case 0 /* NotRendered */:
      case 1 /* RenderedByMessageAudioComponent */:
        return null;
      case 2 /* InlineWithText */:
        isInline = true;
        break;
      case 3 /* Bottom */:
        isInline = false;
        break;
      default:
        log.error((0, import_missingCaseError.missingCaseError)(metadataPlacement));
        isInline = false;
        break;
    }
    const {
      deletedForEveryone,
      direction,
      expirationLength,
      expirationTimestamp,
      isSticker,
      isTapToViewExpired,
      status,
      i18n,
      text,
      textAttachment,
      timestamp,
      id,
      showMessageDetail
    } = this.props;
    const isStickerLike = isSticker || this.canRenderStickerLikeEmoji();
    return /* @__PURE__ */ import_react.default.createElement(import_MessageMetadata.MessageMetadata, {
      deletedForEveryone,
      direction,
      expirationLength,
      expirationTimestamp,
      hasText: Boolean(text),
      i18n,
      id,
      isInline,
      isShowingImage: this.isShowingImage(),
      isSticker: isStickerLike,
      isTapToViewExpired,
      onWidthMeasured: isInline ? this.updateMetadataWidth : void 0,
      showMessageDetail,
      status,
      textPending: textAttachment?.pending,
      timestamp
    });
  }
  renderAuthor() {
    const {
      author,
      contactNameColor,
      isSticker,
      isTapToView,
      isTapToViewExpired
    } = this.props;
    if (!this.shouldRenderAuthor()) {
      return null;
    }
    const withTapToViewExpired = isTapToView && isTapToViewExpired;
    const stickerSuffix = isSticker ? "_with_sticker" : "";
    const tapToViewSuffix = withTapToViewExpired ? "--with-tap-to-view-expired" : "";
    const moduleName = `module-message__author${stickerSuffix}${tapToViewSuffix}`;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: moduleName
    }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
      contactNameColor,
      title: author.title,
      module: moduleName
    }));
  }
  renderAttachment() {
    const {
      attachments,
      direction,
      expirationLength,
      expirationTimestamp,
      i18n,
      id,
      isSticker,
      kickOffAttachmentDownload,
      markAttachmentAsCorrupted,
      markViewed,
      quote,
      readStatus,
      reducedMotion,
      renderAudioAttachment,
      renderingContext,
      showMessageDetail,
      showVisualAttachment,
      shouldCollapseAbove,
      shouldCollapseBelow,
      status,
      text,
      textAttachment,
      theme,
      timestamp
    } = this.props;
    const { imageBroken } = this.state;
    const collapseMetadata = this.getMetadataPlacement() === 0 /* NotRendered */;
    if (!attachments || !attachments[0]) {
      return null;
    }
    const firstAttachment = attachments[0];
    const withContentBelow = Boolean(text);
    const withContentAbove = Boolean(quote) || this.shouldRenderAuthor();
    const displayImage = (0, import_Attachment.canDisplayImage)(attachments);
    if (displayImage && !imageBroken) {
      const prefix = isSticker ? "sticker" : "attachment";
      const containerClassName = (0, import_classnames.default)(`module-message__${prefix}-container`, withContentAbove ? `module-message__${prefix}-container--with-content-above` : null, withContentBelow ? "module-message__attachment-container--with-content-below" : null, isSticker && !collapseMetadata ? "module-message__sticker-container--with-content-below" : null);
      if ((0, import_Attachment.isGIF)(attachments)) {
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: containerClassName
        }, /* @__PURE__ */ import_react.default.createElement(import_GIF.GIF, {
          attachment: firstAttachment,
          size: GIF_SIZE,
          theme,
          i18n,
          tabIndex: 0,
          reducedMotion,
          onError: this.handleImageError,
          showVisualAttachment: () => {
            showVisualAttachment({
              attachment: firstAttachment,
              messageId: id
            });
          },
          kickOffAttachmentDownload: () => {
            kickOffAttachmentDownload({
              attachment: firstAttachment,
              messageId: id
            });
          }
        }));
      }
      if ((0, import_Attachment.isImage)(attachments) || (0, import_Attachment.isVideo)(attachments)) {
        const bottomOverlay = !isSticker && !collapseMetadata;
        const tabIndex = attachments.length > 1 ? 0 : -1;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: containerClassName
        }, /* @__PURE__ */ import_react.default.createElement(import_ImageGrid.ImageGrid, {
          attachments,
          direction,
          withContentAbove: isSticker || withContentAbove,
          withContentBelow: isSticker || withContentBelow,
          isSticker,
          stickerSize: STICKER_SIZE,
          bottomOverlay,
          i18n,
          onError: this.handleImageError,
          theme,
          shouldCollapseAbove,
          shouldCollapseBelow,
          tabIndex,
          onClick: (attachment) => {
            if (!(0, import_Attachment.isDownloaded)(attachment)) {
              kickOffAttachmentDownload({ attachment, messageId: id });
            } else {
              showVisualAttachment({ attachment, messageId: id });
            }
          }
        }));
      }
    }
    if ((0, import_Attachment.isAudio)(attachments)) {
      let played;
      switch (direction) {
        case "outgoing":
          played = status === "viewed";
          break;
        case "incoming":
          played = readStatus === import_MessageReadStatus.ReadStatus.Viewed;
          break;
        default:
          log.error((0, import_missingCaseError.missingCaseError)(direction));
          played = false;
          break;
      }
      return renderAudioAttachment({
        i18n,
        buttonRef: this.audioButtonRef,
        renderingContext,
        theme,
        attachment: firstAttachment,
        collapseMetadata,
        withContentAbove,
        withContentBelow,
        direction,
        expirationLength,
        expirationTimestamp,
        id,
        played,
        showMessageDetail,
        status,
        textPending: textAttachment?.pending,
        timestamp,
        kickOffAttachmentDownload() {
          kickOffAttachmentDownload({
            attachment: firstAttachment,
            messageId: id
          });
        },
        onCorrupted() {
          markAttachmentAsCorrupted({
            attachment: firstAttachment,
            messageId: id
          });
        },
        onFirstPlayed() {
          markViewed(id);
        }
      });
    }
    const { pending, fileName, fileSize, contentType } = firstAttachment;
    const extension = (0, import_Attachment.getExtensionForDisplay)({ contentType, fileName });
    const isDangerous = (0, import_isFileDangerous.isFileDangerous)(fileName || "");
    return /* @__PURE__ */ import_react.default.createElement("button", {
      type: "button",
      className: (0, import_classnames.default)("module-message__generic-attachment", withContentBelow ? "module-message__generic-attachment--with-content-below" : null, withContentAbove ? "module-message__generic-attachment--with-content-above" : null, !firstAttachment.url ? "module-message__generic-attachment--not-active" : null),
      tabIndex: -1,
      onClick: this.openGenericAttachment
    }, pending ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__spinner-container"
    }, /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      svgSize: "small",
      size: "24px",
      direction
    })) : /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__icon-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__icon"
    }, extension ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__icon__extension"
    }, extension) : null), isDangerous ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__icon-dangerous-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__icon-dangerous"
    })) : null), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__generic-attachment__text"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__generic-attachment__file-name", `module-message__generic-attachment__file-name--${direction}`)
    }, fileName), /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__generic-attachment__file-size", `module-message__generic-attachment__file-size--${direction}`)
    }, fileSize)));
  }
  renderPreview() {
    const {
      attachments,
      conversationType,
      direction,
      i18n,
      id,
      kickOffAttachmentDownload,
      openLink,
      previews,
      quote,
      shouldCollapseAbove,
      theme
    } = this.props;
    if (attachments && attachments.length) {
      return null;
    }
    if (!previews || previews.length < 1) {
      return null;
    }
    const first = previews[0];
    if (!first) {
      return null;
    }
    const withContentAbove = Boolean(quote) || !shouldCollapseAbove && conversationType === "group" && direction === "incoming";
    const previewHasImage = (0, import_Attachment.isImageAttachment)(first.image);
    const isFullSizeImage = (0, import_shouldUseFullSizeLinkPreviewImage.shouldUseFullSizeLinkPreviewImage)(first);
    const linkPreviewDate = first.date || null;
    const isClickable = this.areLinksEnabled();
    const className = (0, import_classnames.default)("module-message__link-preview", `module-message__link-preview--${direction}`, {
      "module-message__link-preview--with-content-above": withContentAbove,
      "module-message__link-preview--nonclickable": !isClickable
    });
    const onPreviewImageClick = /* @__PURE__ */ __name(() => {
      if (first.image && !(0, import_Attachment.isDownloaded)(first.image)) {
        kickOffAttachmentDownload({
          attachment: first.image,
          messageId: id
        });
        return;
      }
      openLink(first.url);
    }, "onPreviewImageClick");
    const contents = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, first.image && previewHasImage && isFullSizeImage ? /* @__PURE__ */ import_react.default.createElement(import_ImageGrid.ImageGrid, {
      attachments: [first.image],
      withContentAbove,
      direction,
      shouldCollapseAbove,
      withContentBelow: true,
      onError: this.handleImageError,
      i18n,
      theme,
      onClick: onPreviewImageClick
    }) : null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__content"
    }, first.image && first.domain && previewHasImage && !isFullSizeImage ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__icon_container"
    }, /* @__PURE__ */ import_react.default.createElement(import_Image.Image, {
      noBorder: true,
      noBackground: true,
      curveBottomLeft: withContentAbove ? import_Image.CurveType.Tiny : import_Image.CurveType.Small,
      curveBottomRight: import_Image.CurveType.Tiny,
      curveTopRight: import_Image.CurveType.Tiny,
      curveTopLeft: import_Image.CurveType.Tiny,
      alt: i18n("previewThumbnail", [first.domain]),
      height: 72,
      width: 72,
      url: first.image.url,
      attachment: first.image,
      blurHash: first.image.blurHash,
      onError: this.handleImageError,
      i18n,
      onClick: onPreviewImageClick
    })) : null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__link-preview__text", previewHasImage && !isFullSizeImage ? "module-message__link-preview__text--with-icon" : null)
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__title"
    }, first.title), first.description && /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__description"
    }, (0, import_lodash.unescape)(first.description)), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__footer"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__link-preview__location"
    }, first.domain), /* @__PURE__ */ import_react.default.createElement(import_LinkPreviewDate.LinkPreviewDate, {
      date: linkPreviewDate,
      className: "module-message__link-preview__date"
    })))));
    return isClickable ? /* @__PURE__ */ import_react.default.createElement("div", {
      role: "link",
      tabIndex: 0,
      className,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === "Space") {
          event.stopPropagation();
          event.preventDefault();
          openLink(first.url);
        }
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        openLink(first.url);
      }
    }, contents) : /* @__PURE__ */ import_react.default.createElement("div", {
      className
    }, contents);
  }
  renderGiftBadge() {
    const { conversationTitle, direction, getPreferredBadge, giftBadge, i18n } = this.props;
    const { showOutgoingGiftBadgeModal } = this.state;
    if (!giftBadge) {
      return null;
    }
    if (giftBadge.state === "Unopened" /* Unopened */) {
      const description = i18n(`message--giftBadge--unopened--${direction}`);
      const isRTL = (0, import_direction.default)(description) === "rtl";
      const { metadataWidth } = this.state;
      return /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__unopened-gift-badge__container"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: (0, import_classnames.default)("module-message__unopened-gift-badge", `module-message__unopened-gift-badge--${direction}`),
        "aria-label": i18n("message--giftBadge--unopened--label")
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__unopened-gift-badge__ribbon-horizontal",
        "aria-hidden": true
      }), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__unopened-gift-badge__ribbon-vertical",
        "aria-hidden": true
      }), /* @__PURE__ */ import_react.default.createElement("img", {
        className: "module-message__unopened-gift-badge__bow",
        src: "images/gift-bow.svg",
        alt: "",
        "aria-hidden": true
      })), /* @__PURE__ */ import_react.default.createElement("div", {
        className: (0, import_classnames.default)("module-message__unopened-gift-badge__text", `module-message__unopened-gift-badge__text--${direction}`)
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: (0, import_classnames.default)("module-message__text", `module-message__text--${direction}`),
        dir: isRTL ? "rtl" : void 0
      }, description, this.getMetadataPlacement() === 2 /* InlineWithText */ && /* @__PURE__ */ import_react.default.createElement(import_MessageTextMetadataSpacer.MessageTextMetadataSpacer, {
        metadataWidth
      })), this.renderMetadata()));
    }
    if (giftBadge.state === "Redeemed" /* Redeemed */ || giftBadge.state === "Opened" /* Opened */) {
      const badgeId = giftBadge.id || `BOOST-${giftBadge.level}`;
      const badgeSize = 64;
      const badge = getPreferredBadge([{ id: badgeId }]);
      const badgeImagePath = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, badgeSize, import_BadgeImageTheme.BadgeImageTheme.Transparent);
      let remaining;
      const duration = giftBadge.expiration - Date.now();
      const remainingDays = Math.floor(duration / import_durations.DAY);
      const remainingHours = Math.floor(duration / import_durations.HOUR);
      const remainingMinutes = Math.floor(duration / import_durations.MINUTE);
      if (remainingDays > 1) {
        remaining = i18n("message--giftBadge--remaining--days", {
          days: remainingDays
        });
      } else if (remainingHours > 1) {
        remaining = i18n("message--giftBadge--remaining--hours", {
          hours: remainingHours
        });
      } else if (remainingMinutes > 1) {
        remaining = i18n("message--giftBadge--remaining--minutes", {
          minutes: remainingMinutes
        });
      } else if (remainingMinutes === 1) {
        remaining = i18n("message--giftBadge--remaining--one-minute");
      } else {
        remaining = i18n("message--giftBadge--expired");
      }
      const wasSent = direction === "outgoing";
      const buttonContents = wasSent ? i18n("message--giftBadge--view") : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", {
        className: (0, import_classnames.default)("module-message__redeemed-gift-badge__icon-check", `module-message__redeemed-gift-badge__icon-check--${direction}`)
      }), " ", i18n("message--giftBadge--redeemed"));
      const badgeElement = badge ? /* @__PURE__ */ import_react.default.createElement("img", {
        className: "module-message__redeemed-gift-badge__badge",
        src: badgeImagePath,
        alt: badge.name
      }) : /* @__PURE__ */ import_react.default.createElement("div", {
        className: (0, import_classnames.default)("module-message__redeemed-gift-badge__badge", `module-message__redeemed-gift-badge__badge--missing-${direction}`),
        "aria-label": i18n("giftBadge--missing")
      });
      return /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__redeemed-gift-badge__container"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__redeemed-gift-badge"
      }, badgeElement, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__redeemed-gift-badge__text"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__redeemed-gift-badge__title"
      }, i18n("message--giftBadge")), /* @__PURE__ */ import_react.default.createElement("div", {
        className: (0, import_classnames.default)("module-message__redeemed-gift-badge__remaining", `module-message__redeemed-gift-badge__remaining--${direction}`)
      }, remaining))), /* @__PURE__ */ import_react.default.createElement("button", {
        className: (0, import_classnames.default)("module-message__redeemed-gift-badge__button", `module-message__redeemed-gift-badge__button--${direction}`),
        disabled: !wasSent,
        onClick: wasSent ? () => this.setState({ showOutgoingGiftBadgeModal: true }) : void 0,
        type: "button"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-message__redeemed-gift-badge__button__text"
      }, buttonContents)), this.renderMetadata(), showOutgoingGiftBadgeModal ? /* @__PURE__ */ import_react.default.createElement(import_OutgoingGiftBadgeModal.OutgoingGiftBadgeModal, {
        i18n,
        recipientTitle: conversationTitle,
        badgeId,
        getPreferredBadge,
        hideOutgoingGiftBadgeModal: () => this.setState({ showOutgoingGiftBadgeModal: false })
      }) : null);
    }
    throw (0, import_missingCaseError.missingCaseError)(giftBadge.state);
  }
  renderQuote() {
    const {
      conversationColor,
      customColor,
      direction,
      disableScroll,
      doubleCheckMissingQuoteReference,
      i18n,
      id,
      quote,
      scrollToQuotedMessage
    } = this.props;
    if (!quote) {
      return null;
    }
    const { isGiftBadge, isViewOnce, referencedMessageNotFound } = quote;
    const clickHandler = disableScroll ? void 0 : () => {
      scrollToQuotedMessage({
        authorId: quote.authorId,
        sentAt: quote.sentAt
      });
    };
    const isIncoming = direction === "incoming";
    return /* @__PURE__ */ import_react.default.createElement(import_Quote.Quote, {
      i18n,
      onClick: clickHandler,
      text: quote.text,
      rawAttachment: quote.rawAttachment,
      isIncoming,
      authorTitle: quote.authorTitle,
      bodyRanges: quote.bodyRanges,
      conversationColor,
      customColor,
      isViewOnce,
      isGiftBadge,
      referencedMessageNotFound,
      isFromMe: quote.isFromMe,
      doubleCheckMissingQuoteReference: () => doubleCheckMissingQuoteReference(id)
    });
  }
  renderStoryReplyContext() {
    const {
      conversationColor,
      customColor,
      direction,
      i18n,
      storyReplyContext,
      viewStory
    } = this.props;
    if (!storyReplyContext) {
      return null;
    }
    const isIncoming = direction === "incoming";
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, storyReplyContext.emoji && /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__quote-story-reaction-header"
    }, i18n("Quote__story-reaction", [storyReplyContext.authorTitle])), /* @__PURE__ */ import_react.default.createElement(import_Quote.Quote, {
      authorTitle: storyReplyContext.authorTitle,
      conversationColor,
      customColor,
      i18n,
      isFromMe: storyReplyContext.isFromMe,
      isGiftBadge: false,
      isIncoming,
      isStoryReply: true,
      isViewOnce: false,
      moduleClassName: "StoryReplyQuote",
      onClick: () => {
        viewStory({
          storyId: storyReplyContext.storyId,
          storyViewMode: import_Stories.StoryViewModeType.Single
        });
      },
      rawAttachment: storyReplyContext.rawAttachment,
      reactionEmoji: storyReplyContext.emoji,
      referencedMessageNotFound: !storyReplyContext.storyId,
      text: storyReplyContext.text
    }));
  }
  renderEmbeddedContact() {
    const {
      contact,
      conversationType,
      direction,
      i18n,
      showContactDetail,
      text
    } = this.props;
    if (!contact) {
      return null;
    }
    const withCaption = Boolean(text);
    const withContentAbove = conversationType === "group" && direction === "incoming";
    const withContentBelow = withCaption || this.getMetadataPlacement() !== 0 /* NotRendered */;
    const otherContent = contact && contact.firstNumber && contact.uuid || withCaption;
    const tabIndex = otherContent ? 0 : -1;
    return /* @__PURE__ */ import_react.default.createElement(import_EmbeddedContact.EmbeddedContact, {
      contact,
      isIncoming: direction === "incoming",
      i18n,
      onClick: () => {
        const signalAccount = contact.firstNumber && contact.uuid ? {
          phoneNumber: contact.firstNumber,
          uuid: contact.uuid
        } : void 0;
        showContactDetail({
          contact,
          signalAccount
        });
      },
      withContentAbove,
      withContentBelow,
      tabIndex
    });
  }
  renderSendMessageButton() {
    const { contact, direction, shouldCollapseBelow, startConversation, i18n } = this.props;
    const noBottomLeftCurve = direction === "incoming" && shouldCollapseBelow;
    const noBottomRightCurve = direction === "outgoing" && shouldCollapseBelow;
    if (!contact) {
      return null;
    }
    const { firstNumber, uuid } = contact;
    if (!firstNumber || !uuid) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("button", {
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        startConversation(firstNumber, uuid);
      },
      className: (0, import_classnames.default)("module-message__send-message-button", noBottomLeftCurve && "module-message__send-message-button--no-bottom-left-curve", noBottomRightCurve && "module-message__send-message-button--no-bottom-right-curve")
    }, i18n("sendMessageToContact"));
  }
  renderAvatar() {
    const {
      author,
      conversationId,
      conversationType,
      direction,
      getPreferredBadge,
      i18n,
      shouldCollapseBelow,
      showContactModal,
      theme
    } = this.props;
    if (conversationType !== "group" || direction !== "incoming") {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__author-avatar-container", {
        "module-message__author-avatar-container--with-reactions": this.hasReactions()
      })
    }, shouldCollapseBelow ? /* @__PURE__ */ import_react.default.createElement(import_AvatarSpacer.AvatarSpacer, {
      size: GROUP_AVATAR_SIZE
    }) : /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: author.acceptedMessageRequest,
      avatarPath: author.avatarPath,
      badge: getPreferredBadge(author.badges),
      color: author.color,
      conversationType: "direct",
      i18n,
      isMe: author.isMe,
      name: author.name,
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        showContactModal(author.id, conversationId);
      },
      phoneNumber: author.phoneNumber,
      profileName: author.profileName,
      sharedGroupNames: author.sharedGroupNames,
      size: GROUP_AVATAR_SIZE,
      theme,
      title: author.title,
      unblurredAvatarPath: author.unblurredAvatarPath
    }));
  }
  renderText() {
    const {
      bodyRanges,
      deletedForEveryone,
      direction,
      displayLimit,
      i18n,
      id,
      messageExpanded,
      openConversation,
      kickOffAttachmentDownload,
      status,
      text,
      textDirection,
      textAttachment
    } = this.props;
    const { metadataWidth } = this.state;
    const isRTL = textDirection === "RightToLeft" /* RightToLeft */;
    const contents = deletedForEveryone ? i18n("message--deletedForEveryone") : direction === "incoming" && status === "error" ? i18n("incomingError") : text;
    if (!contents) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__text", `module-message__text--${direction}`, status === "error" && direction === "incoming" ? "module-message__text--error" : null, deletedForEveryone ? "module-message__text--delete-for-everyone" : null),
      dir: isRTL ? "rtl" : void 0
    }, /* @__PURE__ */ import_react.default.createElement(import_MessageBodyReadMore.MessageBodyReadMore, {
      bodyRanges,
      disableLinks: !this.areLinksEnabled(),
      direction,
      displayLimit,
      i18n,
      id,
      messageExpanded,
      openConversation,
      kickOffBodyDownload: () => {
        if (!textAttachment) {
          return;
        }
        kickOffAttachmentDownload({
          attachment: textAttachment,
          messageId: id
        });
      },
      text: contents || "",
      textAttachment
    }), !isRTL && this.getMetadataPlacement() === 2 /* InlineWithText */ && /* @__PURE__ */ import_react.default.createElement(import_MessageTextMetadataSpacer.MessageTextMetadataSpacer, {
      metadataWidth
    }));
  }
  renderError() {
    const { status, direction } = this.props;
    if (status !== "paused" && status !== "error" && status !== "partial-sent") {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__error-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__error", `module-message__error--${direction}`, `module-message__error--${status}`)
    }));
  }
  renderMenu(triggerId) {
    const {
      attachments,
      canDownload,
      canReact,
      canReply,
      direction,
      disableMenu,
      i18n,
      id,
      isSticker,
      isTapToView,
      reactToMessage,
      renderEmojiPicker,
      renderReactionPicker,
      replyToMessage,
      selectedReaction
    } = this.props;
    if (disableMenu) {
      return null;
    }
    const { reactionPickerRoot } = this.state;
    const multipleAttachments = attachments && attachments.length > 1;
    const firstAttachment = attachments && attachments[0];
    const downloadButton = !isSticker && !multipleAttachments && !isTapToView && firstAttachment && !firstAttachment.pending ? /* @__PURE__ */ import_react.default.createElement("div", {
      onClick: this.openGenericAttachment,
      role: "button",
      "aria-label": i18n("downloadAttachment"),
      className: (0, import_classnames.default)("module-message__buttons__download", `module-message__buttons__download--${direction}`)
    }) : null;
    const reactButton = /* @__PURE__ */ import_react.default.createElement(import_react_popper.Reference, null, ({ ref: popperRef }) => {
      const maybePopperRef = this.isWindowWidthNotNarrow() ? popperRef : void 0;
      return /* @__PURE__ */ import_react.default.createElement("div", {
        ref: maybePopperRef,
        onClick: (event) => {
          event.stopPropagation();
          event.preventDefault();
          this.toggleReactionPicker();
        },
        role: "button",
        className: "module-message__buttons__react",
        "aria-label": i18n("reactToMessage")
      });
    });
    const replyButton = /* @__PURE__ */ import_react.default.createElement("div", {
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        replyToMessage(id);
      },
      role: "button",
      "aria-label": i18n("replyToMessage"),
      className: (0, import_classnames.default)("module-message__buttons__reply", `module-message__buttons__download--${direction}`)
    });
    const menuButton = /* @__PURE__ */ import_react.default.createElement(import_react_popper.Reference, null, ({ ref: popperRef }) => {
      const maybePopperRef = !this.isWindowWidthNotNarrow() ? popperRef : void 0;
      return /* @__PURE__ */ import_react.default.createElement(import_StopPropagation.StopPropagation, {
        className: "module-message__buttons__menu--container"
      }, /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.ContextMenuTrigger, {
        id: triggerId,
        ref: this.captureMenuTrigger
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        ref: maybePopperRef,
        role: "button",
        onClick: this.showMenu,
        "aria-label": i18n("messageContextMenuButton"),
        className: (0, import_classnames.default)("module-message__buttons__menu", `module-message__buttons__download--${direction}`)
      })));
    });
    return /* @__PURE__ */ import_react.default.createElement(import_react_popper.Manager, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__buttons", `module-message__buttons--${direction}`)
    }, this.isWindowWidthNotNarrow() && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, canReact ? reactButton : null, canDownload ? downloadButton : null, canReply ? replyButton : null), menuButton), reactionPickerRoot && (0, import_react_dom.createPortal)(/* @__PURE__ */ import_react.default.createElement(import_StopPropagation.StopPropagation, null, /* @__PURE__ */ import_react.default.createElement(import_react_popper.Popper, {
      placement: "top",
      modifiers: [
        (0, import_popperUtil.offsetDistanceModifier)(4),
        this.popperPreventOverflowModifier()
      ]
    }, ({ ref, style }) => renderReactionPicker({
      ref,
      style,
      selected: selectedReaction,
      onClose: this.toggleReactionPicker,
      onPick: (emoji) => {
        this.toggleReactionPicker(true);
        reactToMessage(id, {
          emoji,
          remove: emoji === selectedReaction
        });
      },
      renderEmojiPicker
    }))), reactionPickerRoot));
  }
  renderContextMenu(triggerId) {
    const {
      attachments,
      canDownload,
      contact,
      canReact,
      canReply,
      canRetry,
      canRetryDeleteForEveryone,
      deleteMessage,
      deleteMessageForEveryone,
      deletedForEveryone,
      giftBadge,
      i18n,
      id,
      isSticker,
      isTapToView,
      replyToMessage,
      retrySend,
      retryDeleteForEveryone,
      showForwardMessageModal,
      showMessageDetail,
      text
    } = this.props;
    const canForward = !isTapToView && !deletedForEveryone && !giftBadge && !contact;
    const multipleAttachments = attachments && attachments.length > 1;
    const shouldShowAdditional = (0, import_MessageBodyReadMore.doesMessageBodyOverflow)(text || "") || !this.isWindowWidthNotNarrow();
    const menu = /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.ContextMenu, {
      id: triggerId
    }, canDownload && shouldShowAdditional && !isSticker && !multipleAttachments && !isTapToView && attachments && attachments[0] ? /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__download"
      },
      onClick: this.openGenericAttachment
    }, i18n("downloadAttachment")) : null, shouldShowAdditional ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, canReply && /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__reply"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        replyToMessage(id);
      }
    }, i18n("replyToMessage")), canReact && /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__react"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.toggleReactionPicker();
      }
    }, i18n("reactToMessage"))) : null, /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__more-info"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        showMessageDetail(id);
      }
    }, i18n("moreInfo")), canRetry ? /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__retry-send"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        retrySend(id);
      }
    }, i18n("retrySend")) : null, canRetryDeleteForEveryone ? /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__delete-message-for-everyone"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        retryDeleteForEveryone(id);
      }
    }, i18n("retryDeleteForEveryone")) : null, canForward ? /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__forward-message"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        showForwardMessageModal(id);
      }
    }, i18n("forwardMessage")) : null, /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__delete-message"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        deleteMessage(id);
      }
    }, i18n("deleteMessage")), this.canDeleteForEveryone() ? /* @__PURE__ */ import_react.default.createElement(import_react_contextmenu.MenuItem, {
      attributes: {
        className: "module-message__context--icon module-message__context__delete-message-for-everyone"
      },
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        deleteMessageForEveryone(id);
      }
    }, i18n("deleteMessageForEveryone")) : null);
    return import_react_dom.default.createPortal(menu, document.body);
  }
  isWindowWidthNotNarrow() {
    const { containerWidthBreakpoint } = this.props;
    return containerWidthBreakpoint !== import_util.WidthBreakpoint.Narrow;
  }
  getWidth() {
    const { attachments, giftBadge, isSticker, previews } = this.props;
    if (giftBadge) {
      return 240;
    }
    if (attachments && attachments.length) {
      if ((0, import_Attachment.isGIF)(attachments)) {
        return GIF_SIZE + 2;
      }
      if (isSticker) {
        return STICKER_SIZE + 8 * 2;
      }
      const dimensions = (0, import_Attachment.getGridDimensions)(attachments);
      if (dimensions) {
        return dimensions.width;
      }
    }
    const firstLinkPreview = (previews || [])[0];
    if (firstLinkPreview && firstLinkPreview.image && (0, import_shouldUseFullSizeLinkPreviewImage.shouldUseFullSizeLinkPreviewImage)(firstLinkPreview)) {
      const dimensions = (0, import_Attachment.getImageDimensions)(firstLinkPreview.image);
      if (dimensions) {
        return dimensions.width;
      }
    }
    return void 0;
  }
  isShowingImage() {
    const { isTapToView, attachments, previews } = this.props;
    const { imageBroken } = this.state;
    if (imageBroken || isTapToView) {
      return false;
    }
    if (attachments && attachments.length) {
      const displayImage = (0, import_Attachment.canDisplayImage)(attachments);
      return displayImage && ((0, import_Attachment.isImage)(attachments) || (0, import_Attachment.isVideo)(attachments));
    }
    if (previews && previews.length) {
      const first = previews[0];
      const { image } = first;
      return (0, import_Attachment.isImageAttachment)(image);
    }
    return false;
  }
  isAttachmentPending() {
    const { attachments } = this.props;
    if (!attachments || attachments.length < 1) {
      return false;
    }
    const first = attachments[0];
    return Boolean(first.pending);
  }
  renderTapToViewIcon() {
    const { direction, isTapToViewExpired } = this.props;
    const isDownloadPending = this.isAttachmentPending();
    return !isTapToViewExpired && isDownloadPending ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__tap-to-view__spinner-container"
    }, /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      svgSize: "small",
      size: "20px",
      direction
    })) : /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__tap-to-view__icon", `module-message__tap-to-view__icon--${direction}`, isTapToViewExpired ? "module-message__tap-to-view__icon--expired" : null)
    });
  }
  renderTapToViewText() {
    const {
      attachments,
      direction,
      i18n,
      isTapToViewExpired,
      isTapToViewError
    } = this.props;
    const incomingString = isTapToViewExpired ? i18n("Message--tap-to-view-expired") : i18n(`Message--tap-to-view--incoming${(0, import_Attachment.isVideo)(attachments) ? "-video" : ""}`);
    const outgoingString = i18n("Message--tap-to-view--outgoing");
    const isDownloadPending = this.isAttachmentPending();
    if (isDownloadPending) {
      return;
    }
    return isTapToViewError ? i18n("incomingError") : direction === "outgoing" ? outgoingString : incomingString;
  }
  renderTapToView() {
    const {
      conversationType,
      direction,
      isTapToViewExpired,
      isTapToViewError
    } = this.props;
    const collapseMetadata = this.getMetadataPlacement() === 0 /* NotRendered */;
    const withContentBelow = !collapseMetadata;
    const withContentAbove = !collapseMetadata && conversationType === "group" && direction === "incoming";
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__tap-to-view", withContentBelow ? "module-message__tap-to-view--with-content-below" : null, withContentAbove ? "module-message__tap-to-view--with-content-above" : null)
    }, isTapToViewError ? null : this.renderTapToViewIcon(), /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message__tap-to-view__text", `module-message__tap-to-view__text--${direction}`, isTapToViewExpired ? `module-message__tap-to-view__text--${direction}-expired` : null, isTapToViewError ? `module-message__tap-to-view__text--${direction}-error` : null)
    }, this.renderTapToViewText()));
  }
  popperPreventOverflowModifier() {
    const { containerElementRef } = this.props;
    return {
      name: "preventOverflow",
      options: {
        altAxis: true,
        boundary: containerElementRef.current || void 0,
        padding: {
          bottom: 16,
          left: 8,
          right: 8,
          top: 16
        }
      }
    };
  }
  renderReactions(outgoing) {
    const { getPreferredBadge, reactions = [], i18n, theme } = this.props;
    if (!this.hasReactions()) {
      return null;
    }
    const reactionsWithEmojiData = reactions.map((reaction) => ({
      ...reaction,
      ...(0, import_lib.emojiToData)(reaction.emoji)
    }));
    const groupedAndSortedReactions = Object.values((0, import_lodash.groupBy)(reactionsWithEmojiData, "short_name")).map((groupedReactions) => (0, import_lodash.orderBy)(groupedReactions, [(reaction) => reaction.from.isMe, "timestamp"], ["desc", "desc"]));
    const ordered = (0, import_lodash.orderBy)(groupedAndSortedReactions, ["length", ([{ timestamp }]) => timestamp], ["desc", "desc"]);
    const toRender = (0, import_lodash.take)(ordered, 3).map((res) => ({
      emoji: res[0].emoji,
      count: res.length,
      isMe: res.some((re) => Boolean(re.from.isMe))
    }));
    const someNotRendered = ordered.length > 3;
    const maybeNotRendered = (0, import_lodash.drop)(ordered, 2);
    const maybeNotRenderedTotal = maybeNotRendered.reduce((sum, res) => sum + res.length, 0);
    const notRenderedIsMe = someNotRendered && maybeNotRendered.some((res) => res.some((re) => Boolean(re.from.isMe)));
    const { reactionViewerRoot } = this.state;
    const popperPlacement = outgoing ? "bottom-end" : "bottom-start";
    return /* @__PURE__ */ import_react.default.createElement(import_react_popper.Manager, null, /* @__PURE__ */ import_react.default.createElement(import_react_popper.Reference, null, ({ ref: popperRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
      ref: this.reactionsContainerRefMerger(this.reactionsContainerRef, popperRef),
      className: (0, import_classnames.default)("module-message__reactions", outgoing ? "module-message__reactions--outgoing" : "module-message__reactions--incoming")
    }, toRender.map((re, i) => {
      const isLast = i === toRender.length - 1;
      const isMore = isLast && someNotRendered;
      const isMoreWithMe = isMore && notRenderedIsMe;
      return /* @__PURE__ */ import_react.default.createElement("button", {
        type: "button",
        key: `${re.emoji}-${i}`,
        className: (0, import_classnames.default)("module-message__reactions__reaction", re.count > 1 ? "module-message__reactions__reaction--with-count" : null, outgoing ? "module-message__reactions__reaction--outgoing" : "module-message__reactions__reaction--incoming", isMoreWithMe || re.isMe && !isMoreWithMe ? "module-message__reactions__reaction--is-me" : null),
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.toggleReactionViewer(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
          }
        }
      }, isMore ? /* @__PURE__ */ import_react.default.createElement("span", {
        className: (0, import_classnames.default)("module-message__reactions__reaction__count", "module-message__reactions__reaction__count--no-emoji", isMoreWithMe ? "module-message__reactions__reaction__count--is-me" : null)
      }, "+", maybeNotRenderedTotal) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Emoji.Emoji, {
        size: 16,
        emoji: re.emoji
      }), re.count > 1 ? /* @__PURE__ */ import_react.default.createElement("span", {
        className: (0, import_classnames.default)("module-message__reactions__reaction__count", re.isMe ? "module-message__reactions__reaction__count--is-me" : null)
      }, re.count) : null));
    }))), reactionViewerRoot && (0, import_react_dom.createPortal)(/* @__PURE__ */ import_react.default.createElement(import_StopPropagation.StopPropagation, null, /* @__PURE__ */ import_react.default.createElement(import_react_popper.Popper, {
      placement: popperPlacement,
      strategy: "fixed",
      modifiers: [this.popperPreventOverflowModifier()]
    }, ({ ref, style }) => /* @__PURE__ */ import_react.default.createElement(import_ReactionViewer.ReactionViewer, {
      ref,
      style: {
        ...style,
        zIndex: 2
      },
      getPreferredBadge,
      reactions,
      i18n,
      onClose: this.toggleReactionViewer,
      theme
    }))), reactionViewerRoot));
  }
  renderContents() {
    const { giftBadge, isTapToView, deletedForEveryone } = this.props;
    if (deletedForEveryone) {
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, this.renderText(), this.renderMetadata());
    }
    if (giftBadge) {
      return this.renderGiftBadge();
    }
    if (isTapToView) {
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, this.renderTapToView(), this.renderMetadata());
    }
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, this.renderQuote(), this.renderStoryReplyContext(), this.renderAttachment(), this.renderPreview(), this.renderEmbeddedContact(), this.renderText(), this.renderMetadata(), this.renderSendMessageButton());
  }
  renderContainer() {
    const {
      attachments,
      conversationColor,
      customColor,
      deletedForEveryone,
      direction,
      giftBadge,
      isSticker,
      isTapToView,
      isTapToViewExpired,
      isTapToViewError,
      text
    } = this.props;
    const { isSelected } = this.state;
    const isAttachmentPending = this.isAttachmentPending();
    const width = this.getWidth();
    const shouldUseWidth = Boolean(giftBadge || this.isShowingImage());
    const isEmojiOnly = this.canRenderStickerLikeEmoji();
    const isStickerLike = isSticker || isEmojiOnly;
    const lighterSelect = isSelected && direction === "incoming" && !isStickerLike && (text || !(0, import_Attachment.isVideo)(attachments) && !(0, import_Attachment.isImage)(attachments));
    const containerClassnames = (0, import_classnames.default)("module-message__container", (0, import_Attachment.isGIF)(attachments) ? "module-message__container--gif" : null, isSelected ? "module-message__container--selected" : null, lighterSelect ? "module-message__container--selected-lighter" : null, !isStickerLike ? `module-message__container--${direction}` : null, isEmojiOnly ? "module-message__container--emoji" : null, isTapToView ? "module-message__container--with-tap-to-view" : null, isTapToView && isTapToViewExpired ? "module-message__container--with-tap-to-view-expired" : null, !isStickerLike && direction === "outgoing" ? `module-message__container--outgoing-${conversationColor}` : null, isTapToView && isAttachmentPending && !isTapToViewExpired ? "module-message__container--with-tap-to-view-pending" : null, isTapToView && isAttachmentPending && !isTapToViewExpired ? `module-message__container--${direction}-${conversationColor}-tap-to-view-pending` : null, isTapToViewError ? "module-message__container--with-tap-to-view-error" : null, this.hasReactions() ? "module-message__container--with-reactions" : null, deletedForEveryone ? "module-message__container--deleted-for-everyone" : null);
    const containerStyles = {
      width: shouldUseWidth ? width : void 0
    };
    if (!isStickerLike && !deletedForEveryone && direction === "outgoing") {
      Object.assign(containerStyles, (0, import_getCustomColorStyle.getCustomColorStyle)(customColor));
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message__container-outer"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: containerClassnames,
      style: containerStyles,
      onContextMenu: this.showContextMenu,
      role: "row",
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick,
      tabIndex: -1
    }, this.renderAuthor(), this.renderContents()), this.renderReactions(direction === "outgoing"));
  }
  render() {
    const {
      author,
      attachments,
      direction,
      id,
      isSticker,
      shouldCollapseAbove,
      shouldCollapseBelow,
      timestamp
    } = this.props;
    const { expired, expiring, imageBroken, isSelected } = this.state;
    const triggerId = String(id || `${author.id}-${timestamp}`);
    if (expired) {
      return null;
    }
    if (isSticker && (imageBroken || !attachments || !attachments.length)) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message", `module-message--${direction}`, shouldCollapseAbove && "module-message--collapsed-above", shouldCollapseBelow && "module-message--collapsed-below", isSelected ? "module-message--selected" : null, expiring ? "module-message--expired" : null),
      tabIndex: 0,
      role: "row",
      onKeyDown: this.handleKeyDown,
      onFocus: this.handleFocus,
      ref: this.focusRef
    }, this.renderError(), this.renderAvatar(), this.renderContainer(), this.renderMenu(triggerId), this.renderContextMenu(triggerId));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Directions,
  GiftBadgeStates,
  Message,
  MessageStatuses,
  TextDirection
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZS50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSwgUmVmT2JqZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSwgeyBjcmVhdGVQb3J0YWwgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgZ2V0RGlyZWN0aW9uIGZyb20gJ2RpcmVjdGlvbic7XG5pbXBvcnQgeyBkcm9wLCBncm91cEJ5LCBvcmRlckJ5LCB0YWtlLCB1bmVzY2FwZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBDb250ZXh0TWVudSwgQ29udGV4dE1lbnVUcmlnZ2VyLCBNZW51SXRlbSB9IGZyb20gJ3JlYWN0LWNvbnRleHRtZW51JztcbmltcG9ydCB7IE1hbmFnZXIsIFBvcHBlciwgUmVmZXJlbmNlIH0gZnJvbSAncmVhY3QtcG9wcGVyJztcbmltcG9ydCB0eXBlIHsgUHJldmVudE92ZXJmbG93TW9kaWZpZXIgfSBmcm9tICdAcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdyc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uVHlwZSxcbiAgQ29udmVyc2F0aW9uVHlwZVR5cGUsXG4gIEludGVyYWN0aW9uTW9kZVR5cGUsXG59IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBWaWV3U3RvcnlBY3Rpb25DcmVhdG9yVHlwZSB9IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL3N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBUaW1lbGluZUl0ZW1UeXBlIH0gZnJvbSAnLi9UaW1lbGluZUl0ZW0nO1xuaW1wb3J0IHsgUmVhZFN0YXR1cyB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL01lc3NhZ2VSZWFkU3RhdHVzJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4uL0F2YXRhcic7XG5pbXBvcnQgeyBBdmF0YXJTcGFjZXIgfSBmcm9tICcuLi9BdmF0YXJTcGFjZXInO1xuaW1wb3J0IHsgU3Bpbm5lciB9IGZyb20gJy4uL1NwaW5uZXInO1xuaW1wb3J0IHtcbiAgZG9lc01lc3NhZ2VCb2R5T3ZlcmZsb3csXG4gIE1lc3NhZ2VCb2R5UmVhZE1vcmUsXG59IGZyb20gJy4vTWVzc2FnZUJvZHlSZWFkTW9yZSc7XG5pbXBvcnQgeyBNZXNzYWdlTWV0YWRhdGEgfSBmcm9tICcuL01lc3NhZ2VNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXNzYWdlVGV4dE1ldGFkYXRhU3BhY2VyIH0gZnJvbSAnLi9NZXNzYWdlVGV4dE1ldGFkYXRhU3BhY2VyJztcbmltcG9ydCB7IEltYWdlR3JpZCB9IGZyb20gJy4vSW1hZ2VHcmlkJztcbmltcG9ydCB7IEdJRiB9IGZyb20gJy4vR0lGJztcbmltcG9ydCB7IEN1cnZlVHlwZSwgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJztcbmltcG9ydCB7IENvbnRhY3ROYW1lIH0gZnJvbSAnLi9Db250YWN0TmFtZSc7XG5pbXBvcnQgdHlwZSB7IFF1b3RlZEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi9RdW90ZSc7XG5pbXBvcnQgeyBRdW90ZSB9IGZyb20gJy4vUXVvdGUnO1xuaW1wb3J0IHsgRW1iZWRkZWRDb250YWN0IH0gZnJvbSAnLi9FbWJlZGRlZENvbnRhY3QnO1xuaW1wb3J0IHR5cGUgeyBPd25Qcm9wcyBhcyBSZWFjdGlvblZpZXdlclByb3BzIH0gZnJvbSAnLi9SZWFjdGlvblZpZXdlcic7XG5pbXBvcnQgeyBSZWFjdGlvblZpZXdlciB9IGZyb20gJy4vUmVhY3Rpb25WaWV3ZXInO1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBSZWFjdGlvblBpY2tlclByb3BzIH0gZnJvbSAnLi9SZWFjdGlvblBpY2tlcic7XG5pbXBvcnQgeyBFbW9qaSB9IGZyb20gJy4uL2Vtb2ppL0Vtb2ppJztcbmltcG9ydCB7IExpbmtQcmV2aWV3RGF0ZSB9IGZyb20gJy4vTGlua1ByZXZpZXdEYXRlJztcbmltcG9ydCB0eXBlIHsgTGlua1ByZXZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvbWVzc2FnZS9MaW5rUHJldmlld3MnO1xuaW1wb3J0IHsgc2hvdWxkVXNlRnVsbFNpemVMaW5rUHJldmlld0ltYWdlIH0gZnJvbSAnLi4vLi4vbGlua1ByZXZpZXdzL3Nob3VsZFVzZUZ1bGxTaXplTGlua1ByZXZpZXdJbWFnZSc7XG5pbXBvcnQgeyBXaWR0aEJyZWFrcG9pbnQgfSBmcm9tICcuLi9fdXRpbCc7XG5pbXBvcnQgeyBPdXRnb2luZ0dpZnRCYWRnZU1vZGFsIH0gZnJvbSAnLi4vT3V0Z29pbmdHaWZ0QmFkZ2VNb2RhbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgU3RvcnlWaWV3TW9kZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9TdG9yaWVzJztcblxuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHtcbiAgY2FuRGlzcGxheUltYWdlLFxuICBnZXRFeHRlbnNpb25Gb3JEaXNwbGF5LFxuICBnZXRHcmlkRGltZW5zaW9ucyxcbiAgZ2V0SW1hZ2VEaW1lbnNpb25zLFxuICBoYXNJbWFnZSxcbiAgaXNEb3dubG9hZGVkLFxuICBoYXNWaWRlb1NjcmVlbnNob3QsXG4gIGlzQXVkaW8sXG4gIGlzSW1hZ2UsXG4gIGlzSW1hZ2VBdHRhY2htZW50LFxuICBpc1ZpZGVvLFxuICBpc0dJRixcbn0gZnJvbSAnLi4vLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgdHlwZSB7IEVtYmVkZGVkQ29udGFjdFR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9FbWJlZGRlZENvbnRhY3QnO1xuXG5pbXBvcnQgeyBnZXRJbmNyZW1lbnQgfSBmcm9tICcuLi8uLi91dGlsL3RpbWVyJztcbmltcG9ydCB7IGNsZWFyVGltZW91dElmTmVjZXNzYXJ5IH0gZnJvbSAnLi4vLi4vdXRpbC9jbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSc7XG5pbXBvcnQgeyBpc0ZpbGVEYW5nZXJvdXMgfSBmcm9tICcuLi8uLi91dGlsL2lzRmlsZURhbmdlcm91cyc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcbmltcG9ydCB0eXBlIHtcbiAgQm9keVJhbmdlc1R5cGUsXG4gIExvY2FsaXplclR5cGUsXG4gIFRoZW1lVHlwZSxcbn0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5cbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udGFjdE5hbWVDb2xvclR5cGUsXG4gIENvbnZlcnNhdGlvbkNvbG9yVHlwZSxcbiAgQ3VzdG9tQ29sb3JUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcy9Db2xvcnMnO1xuaW1wb3J0IHsgY3JlYXRlUmVmTWVyZ2VyIH0gZnJvbSAnLi4vLi4vdXRpbC9yZWZNZXJnZXInO1xuaW1wb3J0IHsgZW1vamlUb0RhdGEsIGdldEVtb2ppQ291bnQgfSBmcm9tICcuLi9lbW9qaS9saWInO1xuaW1wb3J0IHsgaXNFbW9qaU9ubHlUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbC9pc0Vtb2ppT25seVRleHQnO1xuaW1wb3J0IHR5cGUgeyBTbWFydFJlYWN0aW9uUGlja2VyIH0gZnJvbSAnLi4vLi4vc3RhdGUvc21hcnQvUmVhY3Rpb25QaWNrZXInO1xuaW1wb3J0IHsgZ2V0Q3VzdG9tQ29sb3JTdHlsZSB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0Q3VzdG9tQ29sb3JTdHlsZSc7XG5pbXBvcnQgeyBvZmZzZXREaXN0YW5jZU1vZGlmaWVyIH0gZnJvbSAnLi4vLi4vdXRpbC9wb3BwZXJVdGlsJztcbmltcG9ydCAqIGFzIEtleWJvYXJkTGF5b3V0IGZyb20gJy4uLy4uL3NlcnZpY2VzL2tleWJvYXJkTGF5b3V0JztcbmltcG9ydCB7IFN0b3BQcm9wYWdhdGlvbiB9IGZyb20gJy4uL1N0b3BQcm9wYWdhdGlvbic7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBEQVksIEhPVVIsIE1JTlVURSwgU0VDT05EIH0gZnJvbSAnLi4vLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgQmFkZ2VJbWFnZVRoZW1lIH0gZnJvbSAnLi4vLi4vYmFkZ2VzL0JhZGdlSW1hZ2VUaGVtZSc7XG5pbXBvcnQgeyBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCB9IGZyb20gJy4uLy4uL2JhZGdlcy9nZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCc7XG5cbnR5cGUgVHJpZ2dlciA9IHtcbiAgaGFuZGxlQ29udGV4dENsaWNrOiAoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiB2b2lkO1xufTtcblxuY29uc3QgR1VFU1NfTUVUQURBVEFfV0lEVEhfVElNRVNUQU1QX1NJWkUgPSAxMDtcbmNvbnN0IEdVRVNTX01FVEFEQVRBX1dJRFRIX0VYUElSRV9USU1FUl9TSVpFID0gMTg7XG5jb25zdCBHVUVTU19NRVRBREFUQV9XSURUSF9PVVRHT0lOR19TSVpFOiBSZWNvcmQ8TWVzc2FnZVN0YXR1c1R5cGUsIG51bWJlcj4gPSB7XG4gIGRlbGl2ZXJlZDogMjQsXG4gIGVycm9yOiAyNCxcbiAgcGF1c2VkOiAxOCxcbiAgJ3BhcnRpYWwtc2VudCc6IDI0LFxuICByZWFkOiAyNCxcbiAgc2VuZGluZzogMTgsXG4gIHNlbnQ6IDI0LFxuICB2aWV3ZWQ6IDI0LFxufTtcblxuY29uc3QgRVhQSVJBVElPTl9DSEVDS19NSU5JTVVNID0gMjAwMDtcbmNvbnN0IEVYUElSRURfREVMQVkgPSA2MDA7XG5jb25zdCBHUk9VUF9BVkFUQVJfU0laRSA9IEF2YXRhclNpemUuVFdFTlRZX0VJR0hUO1xuY29uc3QgU1RJQ0tFUl9TSVpFID0gMjAwO1xuY29uc3QgR0lGX1NJWkUgPSAzMDA7XG4vLyBOb3RlOiB0aGlzIG5lZWRzIHRvIG1hdGNoIHRoZSBhbmltYXRpb24gdGltZVxuY29uc3QgU0VMRUNURURfVElNRU9VVCA9IDEyMDA7XG5jb25zdCBUSFJFRV9IT1VSUyA9IDMgKiA2MCAqIDYwICogMTAwMDtcbmNvbnN0IFNFTlRfU1RBVFVTRVMgPSBuZXcgU2V0PE1lc3NhZ2VTdGF0dXNUeXBlPihbXG4gICdkZWxpdmVyZWQnLFxuICAncmVhZCcsXG4gICdzZW50JyxcbiAgJ3ZpZXdlZCcsXG5dKTtcbmNvbnN0IEdJRlRfQkFER0VfVVBEQVRFX0lOVEVSVkFMID0gMzAgKiBTRUNPTkQ7XG5cbmVudW0gTWV0YWRhdGFQbGFjZW1lbnQge1xuICBOb3RSZW5kZXJlZCxcbiAgUmVuZGVyZWRCeU1lc3NhZ2VBdWRpb0NvbXBvbmVudCxcbiAgSW5saW5lV2l0aFRleHQsXG4gIEJvdHRvbSxcbn1cblxuZXhwb3J0IGVudW0gVGV4dERpcmVjdGlvbiB7XG4gIExlZnRUb1JpZ2h0ID0gJ0xlZnRUb1JpZ2h0JyxcbiAgUmlnaHRUb0xlZnQgPSAnUmlnaHRUb0xlZnQnLFxuICBEZWZhdWx0ID0gJ0RlZmF1bHQnLFxuICBOb25lID0gJ05vbmUnLFxufVxuXG5leHBvcnQgY29uc3QgTWVzc2FnZVN0YXR1c2VzID0gW1xuICAnZGVsaXZlcmVkJyxcbiAgJ2Vycm9yJyxcbiAgJ3BhdXNlZCcsXG4gICdwYXJ0aWFsLXNlbnQnLFxuICAncmVhZCcsXG4gICdzZW5kaW5nJyxcbiAgJ3NlbnQnLFxuICAndmlld2VkJyxcbl0gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBNZXNzYWdlU3RhdHVzVHlwZSA9IHR5cGVvZiBNZXNzYWdlU3RhdHVzZXNbbnVtYmVyXTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdGlvbnMgPSBbJ2luY29taW5nJywgJ291dGdvaW5nJ10gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBEaXJlY3Rpb25UeXBlID0gdHlwZW9mIERpcmVjdGlvbnNbbnVtYmVyXTtcblxuZXhwb3J0IHR5cGUgQXVkaW9BdHRhY2htZW50UHJvcHMgPSB7XG4gIHJlbmRlcmluZ0NvbnRleHQ6IHN0cmluZztcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgYnV0dG9uUmVmOiBSZWFjdC5SZWZPYmplY3Q8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuICB0aGVtZTogVGhlbWVUeXBlIHwgdW5kZWZpbmVkO1xuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZTtcbiAgY29sbGFwc2VNZXRhZGF0YTogYm9vbGVhbjtcbiAgd2l0aENvbnRlbnRBYm92ZTogYm9vbGVhbjtcbiAgd2l0aENvbnRlbnRCZWxvdzogYm9vbGVhbjtcblxuICBkaXJlY3Rpb246IERpcmVjdGlvblR5cGU7XG4gIGV4cGlyYXRpb25MZW5ndGg/OiBudW1iZXI7XG4gIGV4cGlyYXRpb25UaW1lc3RhbXA/OiBudW1iZXI7XG4gIGlkOiBzdHJpbmc7XG4gIHBsYXllZDogYm9vbGVhbjtcbiAgc2hvd01lc3NhZ2VEZXRhaWw6IChpZDogc3RyaW5nKSA9PiB2b2lkO1xuICBzdGF0dXM/OiBNZXNzYWdlU3RhdHVzVHlwZTtcbiAgdGV4dFBlbmRpbmc/OiBib29sZWFuO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcblxuICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkKCk6IHZvaWQ7XG4gIG9uQ29ycnVwdGVkKCk6IHZvaWQ7XG4gIG9uRmlyc3RQbGF5ZWQoKTogdm9pZDtcbn07XG5cbmV4cG9ydCBlbnVtIEdpZnRCYWRnZVN0YXRlcyB7XG4gIFVub3BlbmVkID0gJ1Vub3BlbmVkJyxcbiAgT3BlbmVkID0gJ09wZW5lZCcsXG4gIFJlZGVlbWVkID0gJ1JlZGVlbWVkJyxcbn1cbmV4cG9ydCB0eXBlIEdpZnRCYWRnZVR5cGUgPSB7XG4gIGV4cGlyYXRpb246IG51bWJlcjtcbiAgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbGV2ZWw6IG51bWJlcjtcbiAgc3RhdGU6IEdpZnRCYWRnZVN0YXRlcztcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzRGF0YSA9IHtcbiAgaWQ6IHN0cmluZztcbiAgcmVuZGVyaW5nQ29udGV4dDogc3RyaW5nO1xuICBjb250YWN0TmFtZUNvbG9yPzogQ29udGFjdE5hbWVDb2xvclR5cGU7XG4gIGNvbnZlcnNhdGlvbkNvbG9yOiBDb252ZXJzYXRpb25Db2xvclR5cGU7XG4gIGNvbnZlcnNhdGlvblRpdGxlOiBzdHJpbmc7XG4gIGN1c3RvbUNvbG9yPzogQ3VzdG9tQ29sb3JUeXBlO1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBkaXNwbGF5TGltaXQ/OiBudW1iZXI7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIHRleHREaXJlY3Rpb246IFRleHREaXJlY3Rpb247XG4gIHRleHRBdHRhY2htZW50PzogQXR0YWNobWVudFR5cGU7XG4gIGlzU3RpY2tlcj86IGJvb2xlYW47XG4gIGlzU2VsZWN0ZWQ/OiBib29sZWFuO1xuICBpc1NlbGVjdGVkQ291bnRlcj86IG51bWJlcjtcbiAgZGlyZWN0aW9uOiBEaXJlY3Rpb25UeXBlO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgc3RhdHVzPzogTWVzc2FnZVN0YXR1c1R5cGU7XG4gIGNvbnRhY3Q/OiBFbWJlZGRlZENvbnRhY3RUeXBlO1xuICBhdXRob3I6IFBpY2s8XG4gICAgQ29udmVyc2F0aW9uVHlwZSxcbiAgICB8ICdhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0J1xuICAgIHwgJ2F2YXRhclBhdGgnXG4gICAgfCAnYmFkZ2VzJ1xuICAgIHwgJ2NvbG9yJ1xuICAgIHwgJ2lkJ1xuICAgIHwgJ2lzTWUnXG4gICAgfCAnbmFtZSdcbiAgICB8ICdwaG9uZU51bWJlcidcbiAgICB8ICdwcm9maWxlTmFtZSdcbiAgICB8ICdzaGFyZWRHcm91cE5hbWVzJ1xuICAgIHwgJ3RpdGxlJ1xuICAgIHwgJ3VuYmx1cnJlZEF2YXRhclBhdGgnXG4gID47XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICBjb252ZXJzYXRpb25UeXBlOiBDb252ZXJzYXRpb25UeXBlVHlwZTtcbiAgYXR0YWNobWVudHM/OiBBcnJheTxBdHRhY2htZW50VHlwZT47XG4gIGdpZnRCYWRnZT86IEdpZnRCYWRnZVR5cGU7XG4gIHF1b3RlPzoge1xuICAgIGNvbnZlcnNhdGlvbkNvbG9yOiBDb252ZXJzYXRpb25Db2xvclR5cGU7XG4gICAgY3VzdG9tQ29sb3I/OiBDdXN0b21Db2xvclR5cGU7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIHJhd0F0dGFjaG1lbnQ/OiBRdW90ZWRBdHRhY2htZW50VHlwZTtcbiAgICBpc0Zyb21NZTogYm9vbGVhbjtcbiAgICBzZW50QXQ6IG51bWJlcjtcbiAgICBhdXRob3JJZDogc3RyaW5nO1xuICAgIGF1dGhvclBob25lTnVtYmVyPzogc3RyaW5nO1xuICAgIGF1dGhvclByb2ZpbGVOYW1lPzogc3RyaW5nO1xuICAgIGF1dGhvclRpdGxlOiBzdHJpbmc7XG4gICAgYXV0aG9yTmFtZT86IHN0cmluZztcbiAgICBib2R5UmFuZ2VzPzogQm9keVJhbmdlc1R5cGU7XG4gICAgcmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZDogYm9vbGVhbjtcbiAgICBpc1ZpZXdPbmNlOiBib29sZWFuO1xuICAgIGlzR2lmdEJhZGdlOiBib29sZWFuO1xuICB9O1xuICBzdG9yeVJlcGx5Q29udGV4dD86IHtcbiAgICBhdXRob3JUaXRsZTogc3RyaW5nO1xuICAgIGNvbnZlcnNhdGlvbkNvbG9yOiBDb252ZXJzYXRpb25Db2xvclR5cGU7XG4gICAgY3VzdG9tQ29sb3I/OiBDdXN0b21Db2xvclR5cGU7XG4gICAgZW1vamk/OiBzdHJpbmc7XG4gICAgaXNGcm9tTWU6IGJvb2xlYW47XG4gICAgcmF3QXR0YWNobWVudD86IFF1b3RlZEF0dGFjaG1lbnRUeXBlO1xuICAgIHN0b3J5SWQ/OiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICB9O1xuICBwcmV2aWV3czogQXJyYXk8TGlua1ByZXZpZXdUeXBlPjtcblxuICBpc1RhcFRvVmlldz86IGJvb2xlYW47XG4gIGlzVGFwVG9WaWV3RXhwaXJlZD86IGJvb2xlYW47XG4gIGlzVGFwVG9WaWV3RXJyb3I/OiBib29sZWFuO1xuXG4gIHJlYWRTdGF0dXM/OiBSZWFkU3RhdHVzO1xuXG4gIGV4cGlyYXRpb25MZW5ndGg/OiBudW1iZXI7XG4gIGV4cGlyYXRpb25UaW1lc3RhbXA/OiBudW1iZXI7XG5cbiAgcmVhY3Rpb25zPzogUmVhY3Rpb25WaWV3ZXJQcm9wc1sncmVhY3Rpb25zJ107XG4gIHNlbGVjdGVkUmVhY3Rpb24/OiBzdHJpbmc7XG5cbiAgZGVsZXRlZEZvckV2ZXJ5b25lPzogYm9vbGVhbjtcblxuICBjYW5SZXRyeTogYm9vbGVhbjtcbiAgY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZTogYm9vbGVhbjtcbiAgY2FuUmVhY3Q6IGJvb2xlYW47XG4gIGNhblJlcGx5OiBib29sZWFuO1xuICBjYW5Eb3dubG9hZDogYm9vbGVhbjtcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGJvb2xlYW47XG4gIGlzQmxvY2tlZDogYm9vbGVhbjtcbiAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiBib29sZWFuO1xuICBib2R5UmFuZ2VzPzogQm9keVJhbmdlc1R5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBQcm9wc0hvdXNla2VlcGluZyA9IHtcbiAgY29udGFpbmVyRWxlbWVudFJlZjogUmVmT2JqZWN0PEhUTUxFbGVtZW50PjtcbiAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50OiBXaWR0aEJyZWFrcG9pbnQ7XG4gIGRpc2FibGVNZW51PzogYm9vbGVhbjtcbiAgZGlzYWJsZVNjcm9sbD86IGJvb2xlYW47XG4gIGdldFByZWZlcnJlZEJhZGdlOiBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZTtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgaW50ZXJhY3Rpb25Nb2RlOiBJbnRlcmFjdGlvbk1vZGVUeXBlO1xuICBpdGVtPzogVGltZWxpbmVJdGVtVHlwZTtcbiAgcmVuZGVyQXVkaW9BdHRhY2htZW50OiAocHJvcHM6IEF1ZGlvQXR0YWNobWVudFByb3BzKSA9PiBKU1guRWxlbWVudDtcbiAgcmVuZGVyUmVhY3Rpb25QaWNrZXI6IChcbiAgICBwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFNtYXJ0UmVhY3Rpb25QaWNrZXI+XG4gICkgPT4gSlNYLkVsZW1lbnQ7XG4gIHNob3VsZENvbGxhcHNlQWJvdmU6IGJvb2xlYW47XG4gIHNob3VsZENvbGxhcHNlQmVsb3c6IGJvb2xlYW47XG4gIHNob3VsZEhpZGVNZXRhZGF0YTogYm9vbGVhbjtcbiAgdGhlbWU6IFRoZW1lVHlwZTtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzQWN0aW9ucyA9IHtcbiAgY2xlYXJTZWxlY3RlZE1lc3NhZ2U6ICgpID0+IHVua25vd247XG4gIGRvdWJsZUNoZWNrTWlzc2luZ1F1b3RlUmVmZXJlbmNlOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG1lc3NhZ2VFeHBhbmRlZDogKGlkOiBzdHJpbmcsIGRpc3BsYXlMaW1pdDogbnVtYmVyKSA9PiB1bmtub3duO1xuICBjaGVja0ZvckFjY291bnQ6IChwaG9uZU51bWJlcjogc3RyaW5nKSA9PiB1bmtub3duO1xuXG4gIHJlYWN0VG9NZXNzYWdlOiAoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB7IGVtb2ppLCByZW1vdmUgfTogeyBlbW9qaTogc3RyaW5nOyByZW1vdmU6IGJvb2xlYW4gfVxuICApID0+IHZvaWQ7XG4gIHJlcGx5VG9NZXNzYWdlOiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgcmV0cnlEZWxldGVGb3JFdmVyeW9uZTogKGlkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHJldHJ5U2VuZDogKGlkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsOiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgZGVsZXRlTWVzc2FnZTogKGlkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZTogKGlkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNob3dNZXNzYWdlRGV0YWlsOiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcblxuICBzdGFydENvbnZlcnNhdGlvbjogKGUxNjQ6IHN0cmluZywgdXVpZDogVVVJRFN0cmluZ1R5cGUpID0+IHZvaWQ7XG4gIG9wZW5Db252ZXJzYXRpb246IChjb252ZXJzYXRpb25JZDogc3RyaW5nLCBtZXNzYWdlSWQ/OiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9wZW5HaWZ0QmFkZ2U6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgc2hvd0NvbnRhY3REZXRhaWw6IChvcHRpb25zOiB7XG4gICAgY29udGFjdDogRW1iZWRkZWRDb250YWN0VHlwZTtcbiAgICBzaWduYWxBY2NvdW50Pzoge1xuICAgICAgcGhvbmVOdW1iZXI6IHN0cmluZztcbiAgICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICAgIH07XG4gIH0pID0+IHZvaWQ7XG4gIHNob3dDb250YWN0TW9kYWw6IChjb250YWN0SWQ6IHN0cmluZywgY29udmVyc2F0aW9uSWQ/OiBzdHJpbmcpID0+IHZvaWQ7XG5cbiAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZDogKG9wdGlvbnM6IHtcbiAgICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZTtcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgfSkgPT4gdm9pZDtcbiAgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogKG9wdGlvbnM6IHtcbiAgICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZTtcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgfSkgPT4gdm9pZDtcbiAgbWFya1ZpZXdlZChtZXNzYWdlSWQ6IHN0cmluZyk6IHZvaWQ7XG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiAob3B0aW9uczoge1xuICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICB9KSA9PiB2b2lkO1xuICBkb3dubG9hZEF0dGFjaG1lbnQ6IChvcHRpb25zOiB7XG4gICAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGU7XG4gICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgaXNEYW5nZXJvdXM6IGJvb2xlYW47XG4gIH0pID0+IHZvaWQ7XG4gIGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG5cbiAgb3Blbkxpbms6ICh1cmw6IHN0cmluZykgPT4gdm9pZDtcbiAgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlOiAob3B0aW9uczoge1xuICAgIGF1dGhvcklkOiBzdHJpbmc7XG4gICAgc2VudEF0OiBudW1iZXI7XG4gIH0pID0+IHZvaWQ7XG4gIHNlbGVjdE1lc3NhZ2U/OiAobWVzc2FnZUlkOiBzdHJpbmcsIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG5cbiAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0OiAoKSA9PiB1bmtub3duO1xuICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3Q6ICgpID0+IHVua25vd247XG4gIHZpZXdTdG9yeTogVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IFByb3BzRGF0YSAmXG4gIFByb3BzSG91c2VrZWVwaW5nICZcbiAgUHJvcHNBY3Rpb25zICZcbiAgUGljazxSZWFjdGlvblBpY2tlclByb3BzLCAncmVuZGVyRW1vamlQaWNrZXInPjtcblxudHlwZSBTdGF0ZSA9IHtcbiAgbWV0YWRhdGFXaWR0aDogbnVtYmVyO1xuXG4gIGV4cGlyaW5nOiBib29sZWFuO1xuICBleHBpcmVkOiBib29sZWFuO1xuICBpbWFnZUJyb2tlbjogYm9vbGVhbjtcblxuICBpc1NlbGVjdGVkPzogYm9vbGVhbjtcbiAgcHJldlNlbGVjdGVkQ291bnRlcj86IG51bWJlcjtcblxuICByZWFjdGlvblZpZXdlclJvb3Q6IEhUTUxEaXZFbGVtZW50IHwgbnVsbDtcbiAgcmVhY3Rpb25QaWNrZXJSb290OiBIVE1MRGl2RWxlbWVudCB8IG51bGw7XG5cbiAgZ2lmdEJhZGdlQ291bnRlcjogbnVtYmVyIHwgbnVsbDtcbiAgc2hvd091dGdvaW5nR2lmdEJhZGdlTW9kYWw6IGJvb2xlYW47XG5cbiAgaGFzRGVsZXRlRm9yRXZlcnlvbmVUaW1lckV4cGlyZWQ6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIHB1YmxpYyBtZW51VHJpZ2dlclJlZjogVHJpZ2dlciB8IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgZm9jdXNSZWY6IFJlYWN0LlJlZk9iamVjdDxIVE1MRGl2RWxlbWVudD4gPSBSZWFjdC5jcmVhdGVSZWYoKTtcblxuICBwdWJsaWMgYXVkaW9CdXR0b25SZWY6IFJlYWN0LlJlZk9iamVjdDxIVE1MQnV0dG9uRWxlbWVudD4gPSBSZWFjdC5jcmVhdGVSZWYoKTtcblxuICBwdWJsaWMgcmVhY3Rpb25zQ29udGFpbmVyUmVmOiBSZWFjdC5SZWZPYmplY3Q8SFRNTERpdkVsZW1lbnQ+ID1cbiAgICBSZWFjdC5jcmVhdGVSZWYoKTtcblxuICBwdWJsaWMgcmVhY3Rpb25zQ29udGFpbmVyUmVmTWVyZ2VyID0gY3JlYXRlUmVmTWVyZ2VyKCk7XG5cbiAgcHVibGljIGV4cGlyYXRpb25DaGVja0ludGVydmFsOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgZ2lmdEJhZGdlSW50ZXJ2YWw6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkO1xuXG4gIHB1YmxpYyBleHBpcmVkVGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIHNlbGVjdGVkVGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGRlbGV0ZUZvckV2ZXJ5b25lVGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXRhZGF0YVdpZHRoOiB0aGlzLmd1ZXNzTWV0YWRhdGFXaWR0aCgpLFxuXG4gICAgICBleHBpcmluZzogZmFsc2UsXG4gICAgICBleHBpcmVkOiBmYWxzZSxcbiAgICAgIGltYWdlQnJva2VuOiBmYWxzZSxcblxuICAgICAgaXNTZWxlY3RlZDogcHJvcHMuaXNTZWxlY3RlZCxcbiAgICAgIHByZXZTZWxlY3RlZENvdW50ZXI6IHByb3BzLmlzU2VsZWN0ZWRDb3VudGVyLFxuXG4gICAgICByZWFjdGlvblZpZXdlclJvb3Q6IG51bGwsXG4gICAgICByZWFjdGlvblBpY2tlclJvb3Q6IG51bGwsXG5cbiAgICAgIGdpZnRCYWRnZUNvdW50ZXI6IG51bGwsXG4gICAgICBzaG93T3V0Z29pbmdHaWZ0QmFkZ2VNb2RhbDogZmFsc2UsXG5cbiAgICAgIGhhc0RlbGV0ZUZvckV2ZXJ5b25lVGltZXJFeHBpcmVkOlxuICAgICAgICB0aGlzLmdldFRpbWVSZW1haW5pbmdGb3JEZWxldGVGb3JFdmVyeW9uZSgpIDw9IDAsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wcywgc3RhdGU6IFN0YXRlKTogU3RhdGUge1xuICAgIGlmICghcHJvcHMuaXNTZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBwcmV2U2VsZWN0ZWRDb3VudGVyOiAwLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBwcm9wcy5pc1NlbGVjdGVkICYmXG4gICAgICBwcm9wcy5pc1NlbGVjdGVkQ291bnRlciAhPT0gc3RhdGUucHJldlNlbGVjdGVkQ291bnRlclxuICAgICkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGlzU2VsZWN0ZWQ6IHByb3BzLmlzU2VsZWN0ZWQsXG4gICAgICAgIHByZXZTZWxlY3RlZENvdW50ZXI6IHByb3BzLmlzU2VsZWN0ZWRDb3VudGVyLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBwcml2YXRlIGhhc1JlYWN0aW9ucygpOiBib29sZWFuIHtcbiAgICBjb25zdCB7IHJlYWN0aW9ucyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gQm9vbGVhbihyZWFjdGlvbnMgJiYgcmVhY3Rpb25zLmxlbmd0aCk7XG4gIH1cblxuICBwdWJsaWMgY2FwdHVyZU1lbnVUcmlnZ2VyID0gKHRyaWdnZXJSZWY6IFRyaWdnZXIpOiB2b2lkID0+IHtcbiAgICB0aGlzLm1lbnVUcmlnZ2VyUmVmID0gdHJpZ2dlclJlZjtcbiAgfTtcblxuICBwdWJsaWMgc2hvd01lbnUgPSAoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMubWVudVRyaWdnZXJSZWYpIHtcbiAgICAgIHRoaXMubWVudVRyaWdnZXJSZWYuaGFuZGxlQ29udGV4dENsaWNrKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHNob3dDb250ZXh0TWVudSA9IChldmVudDogUmVhY3QuTW91c2VFdmVudDxIVE1MRGl2RWxlbWVudD4pOiB2b2lkID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbGVjdGlvbiAmJiAhc2VsZWN0aW9uLmlzQ29sbGFwc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNob3dNZW51KGV2ZW50KTtcbiAgfTtcblxuICBwdWJsaWMgaGFuZGxlSW1hZ2VFcnJvciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGlkIH0gPSB0aGlzLnByb3BzO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYE1lc3NhZ2UgJHtpZH06IEltYWdlIGZhaWxlZCB0byBsb2FkOyBmYWlsaW5nIG92ZXIgdG8gcGxhY2Vob2xkZXJgXG4gICAgKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGltYWdlQnJva2VuOiB0cnVlLFxuICAgIH0pO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVGb2N1cyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGludGVyYWN0aW9uTW9kZSB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChpbnRlcmFjdGlvbk1vZGUgPT09ICdrZXlib2FyZCcpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHNldFNlbGVjdGVkID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgaWQsIGNvbnZlcnNhdGlvbklkLCBzZWxlY3RNZXNzYWdlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKHNlbGVjdE1lc3NhZ2UpIHtcbiAgICAgIHNlbGVjdE1lc3NhZ2UoaWQsIGNvbnZlcnNhdGlvbklkKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHNldEZvY3VzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZm9jdXNSZWYuY3VycmVudDtcblxuICAgIGlmIChjb250YWluZXIgJiYgIWNvbnRhaW5lci5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgY29udGFpbmVyLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBvdmVycmlkZSBjb21wb25lbnREaWRNb3VudCgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkIH0gPSB0aGlzLnByb3BzO1xuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyPy5vbkNvbnZvTWVzc2FnZU1vdW50KGNvbnZlcnNhdGlvbklkKTtcblxuICAgIHRoaXMuc3RhcnRTZWxlY3RlZFRpbWVyKCk7XG4gICAgdGhpcy5zdGFydERlbGV0ZUZvckV2ZXJ5b25lVGltZXJJZkFwcGxpY2FibGUoKTtcbiAgICB0aGlzLnN0YXJ0R2lmdEJhZGdlSW50ZXJ2YWwoKTtcblxuICAgIGNvbnN0IHsgaXNTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZXRGb2N1cygpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZXhwaXJhdGlvbkxlbmd0aCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoZXhwaXJhdGlvbkxlbmd0aCkge1xuICAgICAgY29uc3QgaW5jcmVtZW50ID0gZ2V0SW5jcmVtZW50KGV4cGlyYXRpb25MZW5ndGgpO1xuICAgICAgY29uc3QgY2hlY2tGcmVxdWVuY3kgPSBNYXRoLm1heChFWFBJUkFUSU9OX0NIRUNLX01JTklNVU0sIGluY3JlbWVudCk7XG5cbiAgICAgIHRoaXMuY2hlY2tFeHBpcmVkKCk7XG5cbiAgICAgIHRoaXMuZXhwaXJhdGlvbkNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hlY2tFeHBpcmVkKCk7XG4gICAgICB9LCBjaGVja0ZyZXF1ZW5jeSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb250YWN0LCBjaGVja0ZvckFjY291bnQgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGNvbnRhY3QgJiYgY29udGFjdC5maXJzdE51bWJlciAmJiAhY29udGFjdC51dWlkKSB7XG4gICAgICBjaGVja0ZvckFjY291bnQoY29udGFjdC5maXJzdE51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGNvbXBvbmVudFdpbGxVbm1vdW50KCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRoaXMuc2VsZWN0ZWRUaW1lb3V0KTtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aGlzLmV4cGlyYXRpb25DaGVja0ludGVydmFsKTtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aGlzLmV4cGlyZWRUaW1lb3V0KTtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aGlzLmRlbGV0ZUZvckV2ZXJ5b25lVGltZW91dCk7XG4gICAgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkodGhpcy5naWZ0QmFkZ2VJbnRlcnZhbCk7XG4gICAgdGhpcy50b2dnbGVSZWFjdGlvblZpZXdlcih0cnVlKTtcbiAgICB0aGlzLnRvZ2dsZVJlYWN0aW9uUGlja2VyKHRydWUpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IFJlYWRvbmx5PFByb3BzPik6IHZvaWQge1xuICAgIGNvbnN0IHsgaXNTZWxlY3RlZCwgc3RhdHVzLCB0aW1lc3RhbXAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnN0YXJ0U2VsZWN0ZWRUaW1lcigpO1xuICAgIHRoaXMuc3RhcnREZWxldGVGb3JFdmVyeW9uZVRpbWVySWZBcHBsaWNhYmxlKCk7XG5cbiAgICBpZiAoIXByZXZQcm9wcy5pc1NlbGVjdGVkICYmIGlzU2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrRXhwaXJlZCgpO1xuXG4gICAgaWYgKFxuICAgICAgcHJldlByb3BzLnN0YXR1cyA9PT0gJ3NlbmRpbmcnICYmXG4gICAgICAoc3RhdHVzID09PSAnc2VudCcgfHxcbiAgICAgICAgc3RhdHVzID09PSAnZGVsaXZlcmVkJyB8fFxuICAgICAgICBzdGF0dXMgPT09ICdyZWFkJyB8fFxuICAgICAgICBzdGF0dXMgPT09ICd2aWV3ZWQnKVxuICAgICkge1xuICAgICAgY29uc3QgZGVsdGEgPSBEYXRlLm5vdygpIC0gdGltZXN0YW1wO1xuICAgICAgd2luZG93LkNJPy5oYW5kbGVFdmVudCgnbWVzc2FnZTpzZW5kLWNvbXBsZXRlJywge1xuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIGRlbHRhLFxuICAgICAgfSk7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYE1lc3NhZ2UudHN4OiBSZW5kZXJlZCAnc2VuZCBjb21wbGV0ZScgZm9yIG1lc3NhZ2UgJHt0aW1lc3RhbXB9OyB0b29rICR7ZGVsdGF9bXNgXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWV0YWRhdGFQbGFjZW1lbnQoXG4gICAge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBkZWxldGVkRm9yRXZlcnlvbmUsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBleHBpcmF0aW9uTGVuZ3RoLFxuICAgICAgZXhwaXJhdGlvblRpbWVzdGFtcCxcbiAgICAgIGdpZnRCYWRnZSxcbiAgICAgIGkxOG4sXG4gICAgICBzaG91bGRIaWRlTWV0YWRhdGEsXG4gICAgICBzdGF0dXMsXG4gICAgICB0ZXh0LFxuICAgICAgdGV4dERpcmVjdGlvbixcbiAgICB9OiBSZWFkb25seTxQcm9wcz4gPSB0aGlzLnByb3BzXG4gICk6IE1ldGFkYXRhUGxhY2VtZW50IHtcbiAgICBjb25zdCBpc1JUTCA9IHRleHREaXJlY3Rpb24gPT09IFRleHREaXJlY3Rpb24uUmlnaHRUb0xlZnQ7XG5cbiAgICBpZiAoXG4gICAgICAhZXhwaXJhdGlvbkxlbmd0aCAmJlxuICAgICAgIWV4cGlyYXRpb25UaW1lc3RhbXAgJiZcbiAgICAgICghc3RhdHVzIHx8IFNFTlRfU1RBVFVTRVMuaGFzKHN0YXR1cykpICYmXG4gICAgICBzaG91bGRIaWRlTWV0YWRhdGFcbiAgICApIHtcbiAgICAgIHJldHVybiBNZXRhZGF0YVBsYWNlbWVudC5Ob3RSZW5kZXJlZDtcbiAgICB9XG5cbiAgICBpZiAoZ2lmdEJhZGdlKSB7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGkxOG4oYG1lc3NhZ2UtLWdpZnRCYWRnZS0tdW5vcGVuZWQtLSR7ZGlyZWN0aW9ufWApO1xuICAgICAgY29uc3QgaXNEZXNjcmlwdGlvblJUTCA9IGdldERpcmVjdGlvbihkZXNjcmlwdGlvbikgPT09ICdydGwnO1xuXG4gICAgICBpZiAoZ2lmdEJhZGdlLnN0YXRlID09PSBHaWZ0QmFkZ2VTdGF0ZXMuVW5vcGVuZWQgJiYgIWlzRGVzY3JpcHRpb25SVEwpIHtcbiAgICAgICAgcmV0dXJuIE1ldGFkYXRhUGxhY2VtZW50LklubGluZVdpdGhUZXh0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gTWV0YWRhdGFQbGFjZW1lbnQuQm90dG9tO1xuICAgIH1cblxuICAgIGlmICghdGV4dCAmJiAhZGVsZXRlZEZvckV2ZXJ5b25lKSB7XG4gICAgICByZXR1cm4gaXNBdWRpbyhhdHRhY2htZW50cylcbiAgICAgICAgPyBNZXRhZGF0YVBsYWNlbWVudC5SZW5kZXJlZEJ5TWVzc2FnZUF1ZGlvQ29tcG9uZW50XG4gICAgICAgIDogTWV0YWRhdGFQbGFjZW1lbnQuQm90dG9tO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhblJlbmRlclN0aWNrZXJMaWtlRW1vamkoKSkge1xuICAgICAgcmV0dXJuIE1ldGFkYXRhUGxhY2VtZW50LkJvdHRvbTtcbiAgICB9XG5cbiAgICBpZiAoaXNSVEwpIHtcbiAgICAgIHJldHVybiBNZXRhZGF0YVBsYWNlbWVudC5Cb3R0b207XG4gICAgfVxuXG4gICAgcmV0dXJuIE1ldGFkYXRhUGxhY2VtZW50LklubGluZVdpdGhUZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbG90IG9mIHRoZSB0aW1lLCB3ZSBhZGQgYW4gaW52aXNpYmxlIGlubGluZSBzcGFjZXIgZm9yIG1lc3NhZ2VzLiBUaGlzIHNwYWNlciBpcyB0aGVcbiAgICogc2FtZSBzaXplIGFzIHRoZSBtZXNzYWdlIG1ldGFkYXRhLiBVbmZvcnR1bmF0ZWx5LCB3ZSBkb24ndCBrbm93IGhvdyB3aWRlIGl0IGlzIHVudGlsXG4gICAqIHdlIHJlbmRlciBpdC5cbiAgICpcbiAgICogVGhpcyB3aWxsIHByb2JhYmx5IGd1ZXNzIHdyb25nLCBidXQgaXQncyB2YWx1YWJsZSB0byBnZXQgY2xvc2UgdG8gdGhlIHJlYWwgdmFsdWVcbiAgICogYmVjYXVzZSBpdCBjYW4gcmVkdWNlIGxheW91dCBqdW1waW5lc3MuXG4gICAqL1xuICBwcml2YXRlIGd1ZXNzTWV0YWRhdGFXaWR0aCgpOiBudW1iZXIge1xuICAgIGNvbnN0IHsgZGlyZWN0aW9uLCBleHBpcmF0aW9uTGVuZ3RoLCBzdGF0dXMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgcmVzdWx0ID0gR1VFU1NfTUVUQURBVEFfV0lEVEhfVElNRVNUQU1QX1NJWkU7XG5cbiAgICBjb25zdCBoYXNFeHBpcmVUaW1lciA9IEJvb2xlYW4oZXhwaXJhdGlvbkxlbmd0aCk7XG4gICAgaWYgKGhhc0V4cGlyZVRpbWVyKSB7XG4gICAgICByZXN1bHQgKz0gR1VFU1NfTUVUQURBVEFfV0lEVEhfRVhQSVJFX1RJTUVSX1NJWkU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ291dGdvaW5nJyAmJiBzdGF0dXMpIHtcbiAgICAgIHJlc3VsdCArPSBHVUVTU19NRVRBREFUQV9XSURUSF9PVVRHT0lOR19TSVpFW3N0YXR1c107XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydFNlbGVjdGVkVGltZXIoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjbGVhclNlbGVjdGVkTWVzc2FnZSwgaW50ZXJhY3Rpb25Nb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaXNTZWxlY3RlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChpbnRlcmFjdGlvbk1vZGUgPT09ICdrZXlib2FyZCcgfHwgIWlzU2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc2VsZWN0ZWRUaW1lb3V0KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGltZW91dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzU2VsZWN0ZWQ6IGZhbHNlIH0pO1xuICAgICAgICBjbGVhclNlbGVjdGVkTWVzc2FnZSgpO1xuICAgICAgfSwgU0VMRUNURURfVElNRU9VVCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXJ0R2lmdEJhZGdlSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgY29uc3QgeyBnaWZ0QmFkZ2UgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWdpZnRCYWRnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ2lmdEJhZGdlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUdpZnRCYWRnZUNvdW50ZXIoKTtcbiAgICB9LCBHSUZUX0JBREdFX1VQREFURV9JTlRFUlZBTCk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlR2lmdEJhZGdlQ291bnRlcigpOiB2b2lkIHtcbiAgICB0aGlzLnNldFN0YXRlKChzdGF0ZTogU3RhdGUpID0+ICh7XG4gICAgICBnaWZ0QmFkZ2VDb3VudGVyOiAoc3RhdGUuZ2lmdEJhZGdlQ291bnRlciB8fCAwKSArIDEsXG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUaW1lUmVtYWluaW5nRm9yRGVsZXRlRm9yRXZlcnlvbmUoKTogbnVtYmVyIHtcbiAgICBjb25zdCB7IHRpbWVzdGFtcCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gTWF0aC5tYXgodGltZXN0YW1wIC0gRGF0ZS5ub3coKSArIFRIUkVFX0hPVVJTLCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuRGVsZXRlRm9yRXZlcnlvbmUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBjYW5EZWxldGVGb3JFdmVyeW9uZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGhhc0RlbGV0ZUZvckV2ZXJ5b25lVGltZXJFeHBpcmVkIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiBjYW5EZWxldGVGb3JFdmVyeW9uZSAmJiAhaGFzRGVsZXRlRm9yRXZlcnlvbmVUaW1lckV4cGlyZWQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0RGVsZXRlRm9yRXZlcnlvbmVUaW1lcklmQXBwbGljYWJsZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNhbkRlbGV0ZUZvckV2ZXJ5b25lIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaGFzRGVsZXRlRm9yRXZlcnlvbmVUaW1lckV4cGlyZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKFxuICAgICAgIWNhbkRlbGV0ZUZvckV2ZXJ5b25lIHx8XG4gICAgICBoYXNEZWxldGVGb3JFdmVyeW9uZVRpbWVyRXhwaXJlZCB8fFxuICAgICAgdGhpcy5kZWxldGVGb3JFdmVyeW9uZVRpbWVvdXRcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRlbGV0ZUZvckV2ZXJ5b25lVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGhhc0RlbGV0ZUZvckV2ZXJ5b25lVGltZXJFeHBpcmVkOiB0cnVlIH0pO1xuICAgICAgZGVsZXRlIHRoaXMuZGVsZXRlRm9yRXZlcnlvbmVUaW1lb3V0O1xuICAgIH0sIHRoaXMuZ2V0VGltZVJlbWFpbmluZ0ZvckRlbGV0ZUZvckV2ZXJ5b25lKCkpO1xuICB9XG5cbiAgcHVibGljIGNoZWNrRXhwaXJlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHsgZXhwaXJhdGlvblRpbWVzdGFtcCwgZXhwaXJhdGlvbkxlbmd0aCB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZXhwaXJhdGlvblRpbWVzdGFtcCB8fCAhZXhwaXJhdGlvbkxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5leHBpcmVkVGltZW91dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub3cgPj0gZXhwaXJhdGlvblRpbWVzdGFtcCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGV4cGlyaW5nOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNldEV4cGlyZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGV4cGlyZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuZXhwaXJlZFRpbWVvdXQgPSBzZXRUaW1lb3V0KHNldEV4cGlyZWQsIEVYUElSRURfREVMQVkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXJlTGlua3NFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkLCBpc0Jsb2NrZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZCAmJiAhaXNCbG9ja2VkO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRSZW5kZXJBdXRob3IoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBhdXRob3IsIGNvbnZlcnNhdGlvblR5cGUsIGRpcmVjdGlvbiwgc2hvdWxkQ29sbGFwc2VBYm92ZSB9ID1cbiAgICAgIHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICBkaXJlY3Rpb24gPT09ICdpbmNvbWluZycgJiZcbiAgICAgICAgY29udmVyc2F0aW9uVHlwZSA9PT0gJ2dyb3VwJyAmJlxuICAgICAgICBhdXRob3IudGl0bGUgJiZcbiAgICAgICAgIXNob3VsZENvbGxhcHNlQWJvdmVcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5SZW5kZXJTdGlja2VyTGlrZUVtb2ppKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgdGV4dCwgcXVvdGUsIGF0dGFjaG1lbnRzLCBwcmV2aWV3cyB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgdGV4dCAmJlxuICAgICAgICBpc0Vtb2ppT25seVRleHQodGV4dCkgJiZcbiAgICAgICAgZ2V0RW1vamlDb3VudCh0ZXh0KSA8IDYgJiZcbiAgICAgICAgIXF1b3RlICYmXG4gICAgICAgICghYXR0YWNobWVudHMgfHwgIWF0dGFjaG1lbnRzLmxlbmd0aCkgJiZcbiAgICAgICAgKCFwcmV2aWV3cyB8fCAhcHJldmlld3MubGVuZ3RoKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU1ldGFkYXRhV2lkdGggPSAobmV3TWV0YWRhdGFXaWR0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSgoeyBtZXRhZGF0YVdpZHRoIH0pID0+ICh7XG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRleHQgdG8ganVtcCBhcm91bmQgaWYgdGhlIG1ldGFkYXRhIHNocmlua3MsIGJ1dCB3ZSB3YW50IHRvIG1ha2VcbiAgICAgIC8vICAgc3VyZSB3ZSBoYXZlIGVub3VnaCByb29tLlxuICAgICAgbWV0YWRhdGFXaWR0aDogTWF0aC5tYXgobWV0YWRhdGFXaWR0aCwgbmV3TWV0YWRhdGFXaWR0aCksXG4gICAgfSkpO1xuICB9O1xuXG4gIHByaXZhdGUgcmVuZGVyTWV0YWRhdGEoKTogUmVhY3ROb2RlIHtcbiAgICBsZXQgaXNJbmxpbmU6IGJvb2xlYW47XG4gICAgY29uc3QgbWV0YWRhdGFQbGFjZW1lbnQgPSB0aGlzLmdldE1ldGFkYXRhUGxhY2VtZW50KCk7XG4gICAgc3dpdGNoIChtZXRhZGF0YVBsYWNlbWVudCkge1xuICAgICAgY2FzZSBNZXRhZGF0YVBsYWNlbWVudC5Ob3RSZW5kZXJlZDpcbiAgICAgIGNhc2UgTWV0YWRhdGFQbGFjZW1lbnQuUmVuZGVyZWRCeU1lc3NhZ2VBdWRpb0NvbXBvbmVudDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBjYXNlIE1ldGFkYXRhUGxhY2VtZW50LklubGluZVdpdGhUZXh0OlxuICAgICAgICBpc0lubGluZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNZXRhZGF0YVBsYWNlbWVudC5Cb3R0b206XG4gICAgICAgIGlzSW5saW5lID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbG9nLmVycm9yKG1pc3NpbmdDYXNlRXJyb3IobWV0YWRhdGFQbGFjZW1lbnQpKTtcbiAgICAgICAgaXNJbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgZXhwaXJhdGlvbkxlbmd0aCxcbiAgICAgIGV4cGlyYXRpb25UaW1lc3RhbXAsXG4gICAgICBpc1N0aWNrZXIsXG4gICAgICBpc1RhcFRvVmlld0V4cGlyZWQsXG4gICAgICBzdGF0dXMsXG4gICAgICBpMThuLFxuICAgICAgdGV4dCxcbiAgICAgIHRleHRBdHRhY2htZW50LFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgaWQsXG4gICAgICBzaG93TWVzc2FnZURldGFpbCxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGlzU3RpY2tlckxpa2UgPSBpc1N0aWNrZXIgfHwgdGhpcy5jYW5SZW5kZXJTdGlja2VyTGlrZUVtb2ppKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE1lc3NhZ2VNZXRhZGF0YVxuICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU9e2RlbGV0ZWRGb3JFdmVyeW9uZX1cbiAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgIGV4cGlyYXRpb25MZW5ndGg9e2V4cGlyYXRpb25MZW5ndGh9XG4gICAgICAgIGV4cGlyYXRpb25UaW1lc3RhbXA9e2V4cGlyYXRpb25UaW1lc3RhbXB9XG4gICAgICAgIGhhc1RleHQ9e0Jvb2xlYW4odGV4dCl9XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGlkPXtpZH1cbiAgICAgICAgaXNJbmxpbmU9e2lzSW5saW5lfVxuICAgICAgICBpc1Nob3dpbmdJbWFnZT17dGhpcy5pc1Nob3dpbmdJbWFnZSgpfVxuICAgICAgICBpc1N0aWNrZXI9e2lzU3RpY2tlckxpa2V9XG4gICAgICAgIGlzVGFwVG9WaWV3RXhwaXJlZD17aXNUYXBUb1ZpZXdFeHBpcmVkfVxuICAgICAgICBvbldpZHRoTWVhc3VyZWQ9e2lzSW5saW5lID8gdGhpcy51cGRhdGVNZXRhZGF0YVdpZHRoIDogdW5kZWZpbmVkfVxuICAgICAgICBzaG93TWVzc2FnZURldGFpbD17c2hvd01lc3NhZ2VEZXRhaWx9XG4gICAgICAgIHN0YXR1cz17c3RhdHVzfVxuICAgICAgICB0ZXh0UGVuZGluZz17dGV4dEF0dGFjaG1lbnQ/LnBlbmRpbmd9XG4gICAgICAgIHRpbWVzdGFtcD17dGltZXN0YW1wfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBdXRob3IoKTogUmVhY3ROb2RlIHtcbiAgICBjb25zdCB7XG4gICAgICBhdXRob3IsXG4gICAgICBjb250YWN0TmFtZUNvbG9yLFxuICAgICAgaXNTdGlja2VyLFxuICAgICAgaXNUYXBUb1ZpZXcsXG4gICAgICBpc1RhcFRvVmlld0V4cGlyZWQsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXRoaXMuc2hvdWxkUmVuZGVyQXV0aG9yKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhUYXBUb1ZpZXdFeHBpcmVkID0gaXNUYXBUb1ZpZXcgJiYgaXNUYXBUb1ZpZXdFeHBpcmVkO1xuXG4gICAgY29uc3Qgc3RpY2tlclN1ZmZpeCA9IGlzU3RpY2tlciA/ICdfd2l0aF9zdGlja2VyJyA6ICcnO1xuICAgIGNvbnN0IHRhcFRvVmlld1N1ZmZpeCA9IHdpdGhUYXBUb1ZpZXdFeHBpcmVkXG4gICAgICA/ICctLXdpdGgtdGFwLXRvLXZpZXctZXhwaXJlZCdcbiAgICAgIDogJyc7XG4gICAgY29uc3QgbW9kdWxlTmFtZSA9IGBtb2R1bGUtbWVzc2FnZV9fYXV0aG9yJHtzdGlja2VyU3VmZml4fSR7dGFwVG9WaWV3U3VmZml4fWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e21vZHVsZU5hbWV9PlxuICAgICAgICA8Q29udGFjdE5hbWVcbiAgICAgICAgICBjb250YWN0TmFtZUNvbG9yPXtjb250YWN0TmFtZUNvbG9yfVxuICAgICAgICAgIHRpdGxlPXthdXRob3IudGl0bGV9XG4gICAgICAgICAgbW9kdWxlPXttb2R1bGVOYW1lfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJBdHRhY2htZW50KCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gICAgY29uc3Qge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBleHBpcmF0aW9uTGVuZ3RoLFxuICAgICAgZXhwaXJhdGlvblRpbWVzdGFtcCxcbiAgICAgIGkxOG4sXG4gICAgICBpZCxcbiAgICAgIGlzU3RpY2tlcixcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQsXG4gICAgICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkLFxuICAgICAgbWFya1ZpZXdlZCxcbiAgICAgIHF1b3RlLFxuICAgICAgcmVhZFN0YXR1cyxcbiAgICAgIHJlZHVjZWRNb3Rpb24sXG4gICAgICByZW5kZXJBdWRpb0F0dGFjaG1lbnQsXG4gICAgICByZW5kZXJpbmdDb250ZXh0LFxuICAgICAgc2hvd01lc3NhZ2VEZXRhaWwsXG4gICAgICBzaG93VmlzdWFsQXR0YWNobWVudCxcbiAgICAgIHNob3VsZENvbGxhcHNlQWJvdmUsXG4gICAgICBzaG91bGRDb2xsYXBzZUJlbG93LFxuICAgICAgc3RhdHVzLFxuICAgICAgdGV4dCxcbiAgICAgIHRleHRBdHRhY2htZW50LFxuICAgICAgdGhlbWUsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IGltYWdlQnJva2VuIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgY29sbGFwc2VNZXRhZGF0YSA9XG4gICAgICB0aGlzLmdldE1ldGFkYXRhUGxhY2VtZW50KCkgPT09IE1ldGFkYXRhUGxhY2VtZW50Lk5vdFJlbmRlcmVkO1xuXG4gICAgaWYgKCFhdHRhY2htZW50cyB8fCAhYXR0YWNobWVudHNbMF0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBmaXJzdEF0dGFjaG1lbnQgPSBhdHRhY2htZW50c1swXTtcblxuICAgIC8vIEZvciBhdHRhY2htZW50cyB3aGljaCBhcmVuJ3QgZnVsbC1mcmFtZVxuICAgIGNvbnN0IHdpdGhDb250ZW50QmVsb3cgPSBCb29sZWFuKHRleHQpO1xuICAgIGNvbnN0IHdpdGhDb250ZW50QWJvdmUgPSBCb29sZWFuKHF1b3RlKSB8fCB0aGlzLnNob3VsZFJlbmRlckF1dGhvcigpO1xuICAgIGNvbnN0IGRpc3BsYXlJbWFnZSA9IGNhbkRpc3BsYXlJbWFnZShhdHRhY2htZW50cyk7XG5cbiAgICBpZiAoZGlzcGxheUltYWdlICYmICFpbWFnZUJyb2tlbikge1xuICAgICAgY29uc3QgcHJlZml4ID0gaXNTdGlja2VyID8gJ3N0aWNrZXInIDogJ2F0dGFjaG1lbnQnO1xuICAgICAgY29uc3QgY29udGFpbmVyQ2xhc3NOYW1lID0gY2xhc3NOYW1lcyhcbiAgICAgICAgYG1vZHVsZS1tZXNzYWdlX18ke3ByZWZpeH0tY29udGFpbmVyYCxcbiAgICAgICAgd2l0aENvbnRlbnRBYm92ZVxuICAgICAgICAgID8gYG1vZHVsZS1tZXNzYWdlX18ke3ByZWZpeH0tY29udGFpbmVyLS13aXRoLWNvbnRlbnQtYWJvdmVgXG4gICAgICAgICAgOiBudWxsLFxuICAgICAgICB3aXRoQ29udGVudEJlbG93XG4gICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX2F0dGFjaG1lbnQtY29udGFpbmVyLS13aXRoLWNvbnRlbnQtYmVsb3cnXG4gICAgICAgICAgOiBudWxsLFxuICAgICAgICBpc1N0aWNrZXIgJiYgIWNvbGxhcHNlTWV0YWRhdGFcbiAgICAgICAgICA/ICdtb2R1bGUtbWVzc2FnZV9fc3RpY2tlci1jb250YWluZXItLXdpdGgtY29udGVudC1iZWxvdydcbiAgICAgICAgICA6IG51bGxcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0dJRihhdHRhY2htZW50cykpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y29udGFpbmVyQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgIDxHSUZcbiAgICAgICAgICAgICAgYXR0YWNobWVudD17Zmlyc3RBdHRhY2htZW50fVxuICAgICAgICAgICAgICBzaXplPXtHSUZfU0laRX1cbiAgICAgICAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgcmVkdWNlZE1vdGlvbj17cmVkdWNlZE1vdGlvbn1cbiAgICAgICAgICAgICAgb25FcnJvcj17dGhpcy5oYW5kbGVJbWFnZUVycm9yfVxuICAgICAgICAgICAgICBzaG93VmlzdWFsQXR0YWNobWVudD17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNob3dWaXN1YWxBdHRhY2htZW50KHtcbiAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IGZpcnN0QXR0YWNobWVudCxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogaWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQ9eygpID0+IHtcbiAgICAgICAgICAgICAgICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkKHtcbiAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IGZpcnN0QXR0YWNobWVudCxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogaWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNJbWFnZShhdHRhY2htZW50cykgfHwgaXNWaWRlbyhhdHRhY2htZW50cykpIHtcbiAgICAgICAgY29uc3QgYm90dG9tT3ZlcmxheSA9ICFpc1N0aWNrZXIgJiYgIWNvbGxhcHNlTWV0YWRhdGE7XG4gICAgICAgIC8vIFdlIG9ubHkgd2FudCB1c2VycyB0byB0YWIgaW50byB0aGlzIGlmIHRoZXJlJ3MgbW9yZSB0aGFuIG9uZVxuICAgICAgICBjb25zdCB0YWJJbmRleCA9IGF0dGFjaG1lbnRzLmxlbmd0aCA+IDEgPyAwIDogLTE7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y29udGFpbmVyQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgIDxJbWFnZUdyaWRcbiAgICAgICAgICAgICAgYXR0YWNobWVudHM9e2F0dGFjaG1lbnRzfVxuICAgICAgICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgICAgICAgd2l0aENvbnRlbnRBYm92ZT17aXNTdGlja2VyIHx8IHdpdGhDb250ZW50QWJvdmV9XG4gICAgICAgICAgICAgIHdpdGhDb250ZW50QmVsb3c9e2lzU3RpY2tlciB8fCB3aXRoQ29udGVudEJlbG93fVxuICAgICAgICAgICAgICBpc1N0aWNrZXI9e2lzU3RpY2tlcn1cbiAgICAgICAgICAgICAgc3RpY2tlclNpemU9e1NUSUNLRVJfU0laRX1cbiAgICAgICAgICAgICAgYm90dG9tT3ZlcmxheT17Ym90dG9tT3ZlcmxheX1cbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgb25FcnJvcj17dGhpcy5oYW5kbGVJbWFnZUVycm9yfVxuICAgICAgICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgICAgICAgIHNob3VsZENvbGxhcHNlQWJvdmU9e3Nob3VsZENvbGxhcHNlQWJvdmV9XG4gICAgICAgICAgICAgIHNob3VsZENvbGxhcHNlQmVsb3c9e3Nob3VsZENvbGxhcHNlQmVsb3d9XG4gICAgICAgICAgICAgIHRhYkluZGV4PXt0YWJJbmRleH1cbiAgICAgICAgICAgICAgb25DbGljaz17YXR0YWNobWVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0Rvd25sb2FkZWQoYXR0YWNobWVudCkpIHtcbiAgICAgICAgICAgICAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQoeyBhdHRhY2htZW50LCBtZXNzYWdlSWQ6IGlkIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzaG93VmlzdWFsQXR0YWNobWVudCh7IGF0dGFjaG1lbnQsIG1lc3NhZ2VJZDogaWQgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQXVkaW8oYXR0YWNobWVudHMpKSB7XG4gICAgICBsZXQgcGxheWVkOiBib29sZWFuO1xuICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnb3V0Z29pbmcnOlxuICAgICAgICAgIHBsYXllZCA9IHN0YXR1cyA9PT0gJ3ZpZXdlZCc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2luY29taW5nJzpcbiAgICAgICAgICBwbGF5ZWQgPSByZWFkU3RhdHVzID09PSBSZWFkU3RhdHVzLlZpZXdlZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBsb2cuZXJyb3IobWlzc2luZ0Nhc2VFcnJvcihkaXJlY3Rpb24pKTtcbiAgICAgICAgICBwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbmRlckF1ZGlvQXR0YWNobWVudCh7XG4gICAgICAgIGkxOG4sXG4gICAgICAgIGJ1dHRvblJlZjogdGhpcy5hdWRpb0J1dHRvblJlZixcbiAgICAgICAgcmVuZGVyaW5nQ29udGV4dCxcbiAgICAgICAgdGhlbWUsXG4gICAgICAgIGF0dGFjaG1lbnQ6IGZpcnN0QXR0YWNobWVudCxcbiAgICAgICAgY29sbGFwc2VNZXRhZGF0YSxcbiAgICAgICAgd2l0aENvbnRlbnRBYm92ZSxcbiAgICAgICAgd2l0aENvbnRlbnRCZWxvdyxcblxuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIGV4cGlyYXRpb25MZW5ndGgsXG4gICAgICAgIGV4cGlyYXRpb25UaW1lc3RhbXAsXG4gICAgICAgIGlkLFxuICAgICAgICBwbGF5ZWQsXG4gICAgICAgIHNob3dNZXNzYWdlRGV0YWlsLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHRleHRQZW5kaW5nOiB0ZXh0QXR0YWNobWVudD8ucGVuZGluZyxcbiAgICAgICAgdGltZXN0YW1wLFxuXG4gICAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQoKSB7XG4gICAgICAgICAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZCh7XG4gICAgICAgICAgICBhdHRhY2htZW50OiBmaXJzdEF0dGFjaG1lbnQsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IGlkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvcnJ1cHRlZCgpIHtcbiAgICAgICAgICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkKHtcbiAgICAgICAgICAgIGF0dGFjaG1lbnQ6IGZpcnN0QXR0YWNobWVudCxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogaWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRmlyc3RQbGF5ZWQoKSB7XG4gICAgICAgICAgbWFya1ZpZXdlZChpZCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgeyBwZW5kaW5nLCBmaWxlTmFtZSwgZmlsZVNpemUsIGNvbnRlbnRUeXBlIH0gPSBmaXJzdEF0dGFjaG1lbnQ7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uRm9yRGlzcGxheSh7IGNvbnRlbnRUeXBlLCBmaWxlTmFtZSB9KTtcbiAgICBjb25zdCBpc0Rhbmdlcm91cyA9IGlzRmlsZURhbmdlcm91cyhmaWxlTmFtZSB8fCAnJyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fZ2VuZXJpYy1hdHRhY2htZW50JyxcbiAgICAgICAgICB3aXRoQ29udGVudEJlbG93XG4gICAgICAgICAgICA/ICdtb2R1bGUtbWVzc2FnZV9fZ2VuZXJpYy1hdHRhY2htZW50LS13aXRoLWNvbnRlbnQtYmVsb3cnXG4gICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgd2l0aENvbnRlbnRBYm92ZVxuICAgICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudC0td2l0aC1jb250ZW50LWFib3ZlJ1xuICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICFmaXJzdEF0dGFjaG1lbnQudXJsXG4gICAgICAgICAgICA/ICdtb2R1bGUtbWVzc2FnZV9fZ2VuZXJpYy1hdHRhY2htZW50LS1ub3QtYWN0aXZlJ1xuICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICl9XG4gICAgICAgIC8vIFRoZXJlJ3Mgb25seSBldmVyIG9uZSBvZiB0aGVzZSwgc28gd2UgZG9uJ3Qgd2FudCB1c2VycyB0byB0YWIgaW50byBpdFxuICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkdlbmVyaWNBdHRhY2htZW50fVxuICAgICAgPlxuICAgICAgICB7cGVuZGluZyA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19nZW5lcmljLWF0dGFjaG1lbnRfX3NwaW5uZXItY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8U3Bpbm5lciBzdmdTaXplPVwic21hbGxcIiBzaXplPVwiMjRweFwiIGRpcmVjdGlvbj17ZGlyZWN0aW9ufSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9faWNvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9faWNvblwiPlxuICAgICAgICAgICAgICB7ZXh0ZW5zaW9uID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9faWNvbl9fZXh0ZW5zaW9uXCI+XG4gICAgICAgICAgICAgICAgICB7ZXh0ZW5zaW9ufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2lzRGFuZ2Vyb3VzID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19nZW5lcmljLWF0dGFjaG1lbnRfX2ljb24tZGFuZ2Vyb3VzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9faWNvbi1kYW5nZXJvdXNcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19nZW5lcmljLWF0dGFjaG1lbnRfX3RleHRcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fZ2VuZXJpYy1hdHRhY2htZW50X19maWxlLW5hbWUnLFxuICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9fZmlsZS1uYW1lLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICApfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtmaWxlTmFtZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fZ2VuZXJpYy1hdHRhY2htZW50X19maWxlLXNpemUnLFxuICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX2dlbmVyaWMtYXR0YWNobWVudF9fZmlsZS1zaXplLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICApfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtmaWxlU2l6ZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlbmRlclByZXZpZXcoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7XG4gICAgICBhdHRhY2htZW50cyxcbiAgICAgIGNvbnZlcnNhdGlvblR5cGUsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpMThuLFxuICAgICAgaWQsXG4gICAgICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkLFxuICAgICAgb3BlbkxpbmssXG4gICAgICBwcmV2aWV3cyxcbiAgICAgIHF1b3RlLFxuICAgICAgc2hvdWxkQ29sbGFwc2VBYm92ZSxcbiAgICAgIHRoZW1lLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gQXR0YWNobWVudHMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgTGluayBQcmV2aWV3c1xuICAgIGlmIChhdHRhY2htZW50cyAmJiBhdHRhY2htZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICghcHJldmlld3MgfHwgcHJldmlld3MubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3QgPSBwcmV2aWV3c1swXTtcbiAgICBpZiAoIWZpcnN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoQ29udGVudEFib3ZlID1cbiAgICAgIEJvb2xlYW4ocXVvdGUpIHx8XG4gICAgICAoIXNob3VsZENvbGxhcHNlQWJvdmUgJiZcbiAgICAgICAgY29udmVyc2F0aW9uVHlwZSA9PT0gJ2dyb3VwJyAmJlxuICAgICAgICBkaXJlY3Rpb24gPT09ICdpbmNvbWluZycpO1xuXG4gICAgY29uc3QgcHJldmlld0hhc0ltYWdlID0gaXNJbWFnZUF0dGFjaG1lbnQoZmlyc3QuaW1hZ2UpO1xuICAgIGNvbnN0IGlzRnVsbFNpemVJbWFnZSA9IHNob3VsZFVzZUZ1bGxTaXplTGlua1ByZXZpZXdJbWFnZShmaXJzdCk7XG5cbiAgICBjb25zdCBsaW5rUHJldmlld0RhdGUgPSBmaXJzdC5kYXRlIHx8IG51bGw7XG5cbiAgICBjb25zdCBpc0NsaWNrYWJsZSA9IHRoaXMuYXJlTGlua3NFbmFibGVkKCk7XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSBjbGFzc05hbWVzKFxuICAgICAgJ21vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXcnLFxuICAgICAgYG1vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXctLSR7ZGlyZWN0aW9ufWAsXG4gICAgICB7XG4gICAgICAgICdtb2R1bGUtbWVzc2FnZV9fbGluay1wcmV2aWV3LS13aXRoLWNvbnRlbnQtYWJvdmUnOiB3aXRoQ29udGVudEFib3ZlLFxuICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2xpbmstcHJldmlldy0tbm9uY2xpY2thYmxlJzogIWlzQ2xpY2thYmxlLFxuICAgICAgfVxuICAgICk7XG4gICAgY29uc3Qgb25QcmV2aWV3SW1hZ2VDbGljayA9ICgpID0+IHtcbiAgICAgIGlmIChmaXJzdC5pbWFnZSAmJiAhaXNEb3dubG9hZGVkKGZpcnN0LmltYWdlKSkge1xuICAgICAgICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkKHtcbiAgICAgICAgICBhdHRhY2htZW50OiBmaXJzdC5pbWFnZSxcbiAgICAgICAgICBtZXNzYWdlSWQ6IGlkLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgb3BlbkxpbmsoZmlyc3QudXJsKTtcbiAgICB9O1xuICAgIGNvbnN0IGNvbnRlbnRzID0gKFxuICAgICAgPD5cbiAgICAgICAge2ZpcnN0LmltYWdlICYmIHByZXZpZXdIYXNJbWFnZSAmJiBpc0Z1bGxTaXplSW1hZ2UgPyAoXG4gICAgICAgICAgPEltYWdlR3JpZFxuICAgICAgICAgICAgYXR0YWNobWVudHM9e1tmaXJzdC5pbWFnZV19XG4gICAgICAgICAgICB3aXRoQ29udGVudEFib3ZlPXt3aXRoQ29udGVudEFib3ZlfVxuICAgICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgICBzaG91bGRDb2xsYXBzZUFib3ZlPXtzaG91bGRDb2xsYXBzZUFib3ZlfVxuICAgICAgICAgICAgd2l0aENvbnRlbnRCZWxvd1xuICAgICAgICAgICAgb25FcnJvcj17dGhpcy5oYW5kbGVJbWFnZUVycm9yfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uUHJldmlld0ltYWdlQ2xpY2t9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2xpbmstcHJldmlld19fY29udGVudFwiPlxuICAgICAgICAgIHtmaXJzdC5pbWFnZSAmJlxuICAgICAgICAgIGZpcnN0LmRvbWFpbiAmJlxuICAgICAgICAgIHByZXZpZXdIYXNJbWFnZSAmJlxuICAgICAgICAgICFpc0Z1bGxTaXplSW1hZ2UgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXdfX2ljb25fY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxJbWFnZVxuICAgICAgICAgICAgICAgIG5vQm9yZGVyXG4gICAgICAgICAgICAgICAgbm9CYWNrZ3JvdW5kXG4gICAgICAgICAgICAgICAgY3VydmVCb3R0b21MZWZ0PXtcbiAgICAgICAgICAgICAgICAgIHdpdGhDb250ZW50QWJvdmUgPyBDdXJ2ZVR5cGUuVGlueSA6IEN1cnZlVHlwZS5TbWFsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJ2ZUJvdHRvbVJpZ2h0PXtDdXJ2ZVR5cGUuVGlueX1cbiAgICAgICAgICAgICAgICBjdXJ2ZVRvcFJpZ2h0PXtDdXJ2ZVR5cGUuVGlueX1cbiAgICAgICAgICAgICAgICBjdXJ2ZVRvcExlZnQ9e0N1cnZlVHlwZS5UaW55fVxuICAgICAgICAgICAgICAgIGFsdD17aTE4bigncHJldmlld1RodW1ibmFpbCcsIFtmaXJzdC5kb21haW5dKX1cbiAgICAgICAgICAgICAgICBoZWlnaHQ9ezcyfVxuICAgICAgICAgICAgICAgIHdpZHRoPXs3Mn1cbiAgICAgICAgICAgICAgICB1cmw9e2ZpcnN0LmltYWdlLnVybH1cbiAgICAgICAgICAgICAgICBhdHRhY2htZW50PXtmaXJzdC5pbWFnZX1cbiAgICAgICAgICAgICAgICBibHVySGFzaD17Zmlyc3QuaW1hZ2UuYmx1ckhhc2h9XG4gICAgICAgICAgICAgICAgb25FcnJvcj17dGhpcy5oYW5kbGVJbWFnZUVycm9yfVxuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgb25DbGljaz17b25QcmV2aWV3SW1hZ2VDbGlja31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXdfX3RleHQnLFxuICAgICAgICAgICAgICBwcmV2aWV3SGFzSW1hZ2UgJiYgIWlzRnVsbFNpemVJbWFnZVxuICAgICAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXdfX3RleHQtLXdpdGgtaWNvbidcbiAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZV9fbGluay1wcmV2aWV3X190aXRsZVwiPlxuICAgICAgICAgICAgICB7Zmlyc3QudGl0bGV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtmaXJzdC5kZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2xpbmstcHJldmlld19fZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICB7dW5lc2NhcGUoZmlyc3QuZGVzY3JpcHRpb24pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXdfX2Zvb3RlclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19saW5rLXByZXZpZXdfX2xvY2F0aW9uXCI+XG4gICAgICAgICAgICAgICAge2ZpcnN0LmRvbWFpbn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxMaW5rUHJldmlld0RhdGVcbiAgICAgICAgICAgICAgICBkYXRlPXtsaW5rUHJldmlld0RhdGV9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2xpbmstcHJldmlld19fZGF0ZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8Lz5cbiAgICApO1xuXG4gICAgcmV0dXJuIGlzQ2xpY2thYmxlID8gKFxuICAgICAgPGRpdlxuICAgICAgICByb2xlPVwibGlua1wiXG4gICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgb25LZXlEb3duPXsoZXZlbnQ6IFJlYWN0LktleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBvcGVuTGluayhmaXJzdC51cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIG9wZW5MaW5rKGZpcnN0LnVybCk7XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtjb250ZW50c31cbiAgICAgIDwvZGl2PlxuICAgICkgOiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57Y29udGVudHN9PC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJHaWZ0QmFkZ2UoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvblRpdGxlLCBkaXJlY3Rpb24sIGdldFByZWZlcnJlZEJhZGdlLCBnaWZ0QmFkZ2UsIGkxOG4gfSA9XG4gICAgICB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc2hvd091dGdvaW5nR2lmdEJhZGdlTW9kYWwgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFnaWZ0QmFkZ2UpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChnaWZ0QmFkZ2Uuc3RhdGUgPT09IEdpZnRCYWRnZVN0YXRlcy5Vbm9wZW5lZCkge1xuICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBpMThuKGBtZXNzYWdlLS1naWZ0QmFkZ2UtLXVub3BlbmVkLS0ke2RpcmVjdGlvbn1gKTtcbiAgICAgIGNvbnN0IGlzUlRMID0gZ2V0RGlyZWN0aW9uKGRlc2NyaXB0aW9uKSA9PT0gJ3J0bCc7XG4gICAgICBjb25zdCB7IG1ldGFkYXRhV2lkdGggfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX3Vub3BlbmVkLWdpZnQtYmFkZ2VfX2NvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX191bm9wZW5lZC1naWZ0LWJhZGdlJyxcbiAgICAgICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX191bm9wZW5lZC1naWZ0LWJhZGdlLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignbWVzc2FnZS0tZ2lmdEJhZGdlLS11bm9wZW5lZC0tbGFiZWwnKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX191bm9wZW5lZC1naWZ0LWJhZGdlX19yaWJib24taG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZV9fdW5vcGVuZWQtZ2lmdC1iYWRnZV9fcmliYm9uLXZlcnRpY2FsXCJcbiAgICAgICAgICAgICAgYXJpYS1oaWRkZW5cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX191bm9wZW5lZC1naWZ0LWJhZGdlX19ib3dcIlxuICAgICAgICAgICAgICBzcmM9XCJpbWFnZXMvZ2lmdC1ib3cuc3ZnXCJcbiAgICAgICAgICAgICAgYWx0PVwiXCJcbiAgICAgICAgICAgICAgYXJpYS1oaWRkZW5cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3Vub3BlbmVkLWdpZnQtYmFkZ2VfX3RleHQnLFxuICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX3Vub3BlbmVkLWdpZnQtYmFkZ2VfX3RleHQtLSR7ZGlyZWN0aW9ufWBcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX190ZXh0JyxcbiAgICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX3RleHQtLSR7ZGlyZWN0aW9ufWBcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgZGlyPXtpc1JUTCA/ICdydGwnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgIHt0aGlzLmdldE1ldGFkYXRhUGxhY2VtZW50KCkgPT09XG4gICAgICAgICAgICAgICAgTWV0YWRhdGFQbGFjZW1lbnQuSW5saW5lV2l0aFRleHQgJiYgKFxuICAgICAgICAgICAgICAgIDxNZXNzYWdlVGV4dE1ldGFkYXRhU3BhY2VyIG1ldGFkYXRhV2lkdGg9e21ldGFkYXRhV2lkdGh9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlck1ldGFkYXRhKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBnaWZ0QmFkZ2Uuc3RhdGUgPT09IEdpZnRCYWRnZVN0YXRlcy5SZWRlZW1lZCB8fFxuICAgICAgZ2lmdEJhZGdlLnN0YXRlID09PSBHaWZ0QmFkZ2VTdGF0ZXMuT3BlbmVkXG4gICAgKSB7XG4gICAgICBjb25zdCBiYWRnZUlkID0gZ2lmdEJhZGdlLmlkIHx8IGBCT09TVC0ke2dpZnRCYWRnZS5sZXZlbH1gO1xuICAgICAgY29uc3QgYmFkZ2VTaXplID0gNjQ7XG4gICAgICBjb25zdCBiYWRnZSA9IGdldFByZWZlcnJlZEJhZGdlKFt7IGlkOiBiYWRnZUlkIH1dKTtcbiAgICAgIGNvbnN0IGJhZGdlSW1hZ2VQYXRoID0gZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgoXG4gICAgICAgIGJhZGdlLFxuICAgICAgICBiYWRnZVNpemUsXG4gICAgICAgIEJhZGdlSW1hZ2VUaGVtZS5UcmFuc3BhcmVudFxuICAgICAgKTtcblxuICAgICAgbGV0IHJlbWFpbmluZzogc3RyaW5nO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBnaWZ0QmFkZ2UuZXhwaXJhdGlvbiAtIERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IHJlbWFpbmluZ0RheXMgPSBNYXRoLmZsb29yKGR1cmF0aW9uIC8gREFZKTtcbiAgICAgIGNvbnN0IHJlbWFpbmluZ0hvdXJzID0gTWF0aC5mbG9vcihkdXJhdGlvbiAvIEhPVVIpO1xuICAgICAgY29uc3QgcmVtYWluaW5nTWludXRlcyA9IE1hdGguZmxvb3IoZHVyYXRpb24gLyBNSU5VVEUpO1xuXG4gICAgICBpZiAocmVtYWluaW5nRGF5cyA+IDEpIHtcbiAgICAgICAgcmVtYWluaW5nID0gaTE4bignbWVzc2FnZS0tZ2lmdEJhZGdlLS1yZW1haW5pbmctLWRheXMnLCB7XG4gICAgICAgICAgZGF5czogcmVtYWluaW5nRGF5cyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHJlbWFpbmluZ0hvdXJzID4gMSkge1xuICAgICAgICByZW1haW5pbmcgPSBpMThuKCdtZXNzYWdlLS1naWZ0QmFkZ2UtLXJlbWFpbmluZy0taG91cnMnLCB7XG4gICAgICAgICAgaG91cnM6IHJlbWFpbmluZ0hvdXJzLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocmVtYWluaW5nTWludXRlcyA+IDEpIHtcbiAgICAgICAgcmVtYWluaW5nID0gaTE4bignbWVzc2FnZS0tZ2lmdEJhZGdlLS1yZW1haW5pbmctLW1pbnV0ZXMnLCB7XG4gICAgICAgICAgbWludXRlczogcmVtYWluaW5nTWludXRlcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHJlbWFpbmluZ01pbnV0ZXMgPT09IDEpIHtcbiAgICAgICAgcmVtYWluaW5nID0gaTE4bignbWVzc2FnZS0tZ2lmdEJhZGdlLS1yZW1haW5pbmctLW9uZS1taW51dGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZyA9IGkxOG4oJ21lc3NhZ2UtLWdpZnRCYWRnZS0tZXhwaXJlZCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3YXNTZW50ID0gZGlyZWN0aW9uID09PSAnb3V0Z29pbmcnO1xuICAgICAgY29uc3QgYnV0dG9uQ29udGVudHMgPSB3YXNTZW50ID8gKFxuICAgICAgICBpMThuKCdtZXNzYWdlLS1naWZ0QmFkZ2UtLXZpZXcnKVxuICAgICAgKSA6IChcbiAgICAgICAgPD5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VfX2ljb24tY2hlY2snLFxuICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VfX2ljb24tY2hlY2stLSR7ZGlyZWN0aW9ufWBcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgLz57JyAnfVxuICAgICAgICAgIHtpMThuKCdtZXNzYWdlLS1naWZ0QmFkZ2UtLXJlZGVlbWVkJyl9XG4gICAgICAgIDwvPlxuICAgICAgKTtcblxuICAgICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gYmFkZ2UgPyAoXG4gICAgICAgIDxpbWdcbiAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZV9fcmVkZWVtZWQtZ2lmdC1iYWRnZV9fYmFkZ2VcIlxuICAgICAgICAgIHNyYz17YmFkZ2VJbWFnZVBhdGh9XG4gICAgICAgICAgYWx0PXtiYWRnZS5uYW1lfVxuICAgICAgICAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fcmVkZWVtZWQtZ2lmdC1iYWRnZV9fYmFkZ2UnLFxuICAgICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX19yZWRlZW1lZC1naWZ0LWJhZGdlX19iYWRnZS0tbWlzc2luZy0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgKX1cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdnaWZ0QmFkZ2UtLW1pc3NpbmcnKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VfX2NvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VcIj5cbiAgICAgICAgICAgIHtiYWRnZUVsZW1lbnR9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19yZWRlZW1lZC1naWZ0LWJhZGdlX190ZXh0XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VfX3RpdGxlXCI+XG4gICAgICAgICAgICAgICAge2kxOG4oJ21lc3NhZ2UtLWdpZnRCYWRnZScpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fcmVkZWVtZWQtZ2lmdC1iYWRnZV9fcmVtYWluaW5nJyxcbiAgICAgICAgICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZV9fcmVkZWVtZWQtZ2lmdC1iYWRnZV9fcmVtYWluaW5nLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtyZW1haW5pbmd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3JlZGVlbWVkLWdpZnQtYmFkZ2VfX2J1dHRvbicsXG4gICAgICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZV9fcmVkZWVtZWQtZ2lmdC1iYWRnZV9fYnV0dG9uLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF3YXNTZW50fVxuICAgICAgICAgICAgb25DbGljaz17XG4gICAgICAgICAgICAgIHdhc1NlbnRcbiAgICAgICAgICAgICAgICA/ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBzaG93T3V0Z29pbmdHaWZ0QmFkZ2VNb2RhbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19yZWRlZW1lZC1naWZ0LWJhZGdlX19idXR0b25fX3RleHRcIj5cbiAgICAgICAgICAgICAge2J1dHRvbkNvbnRlbnRzfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucmVuZGVyTWV0YWRhdGEoKX1cbiAgICAgICAgICB7c2hvd091dGdvaW5nR2lmdEJhZGdlTW9kYWwgPyAoXG4gICAgICAgICAgICA8T3V0Z29pbmdHaWZ0QmFkZ2VNb2RhbFxuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICByZWNpcGllbnRUaXRsZT17Y29udmVyc2F0aW9uVGl0bGV9XG4gICAgICAgICAgICAgIGJhZGdlSWQ9e2JhZGdlSWR9XG4gICAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgICAgaGlkZU91dGdvaW5nR2lmdEJhZGdlTW9kYWw9eygpID0+XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dPdXRnb2luZ0dpZnRCYWRnZU1vZGFsOiBmYWxzZSB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihnaWZ0QmFkZ2Uuc3RhdGUpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlclF1b3RlKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gICAgY29uc3Qge1xuICAgICAgY29udmVyc2F0aW9uQ29sb3IsXG4gICAgICBjdXN0b21Db2xvcixcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGRpc2FibGVTY3JvbGwsXG4gICAgICBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSxcbiAgICAgIGkxOG4sXG4gICAgICBpZCxcbiAgICAgIHF1b3RlLFxuICAgICAgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFxdW90ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBpc0dpZnRCYWRnZSwgaXNWaWV3T25jZSwgcmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZCB9ID0gcXVvdGU7XG5cbiAgICBjb25zdCBjbGlja0hhbmRsZXIgPSBkaXNhYmxlU2Nyb2xsXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiAoKSA9PiB7XG4gICAgICAgICAgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlKHtcbiAgICAgICAgICAgIGF1dGhvcklkOiBxdW90ZS5hdXRob3JJZCxcbiAgICAgICAgICAgIHNlbnRBdDogcXVvdGUuc2VudEF0LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgY29uc3QgaXNJbmNvbWluZyA9IGRpcmVjdGlvbiA9PT0gJ2luY29taW5nJztcblxuICAgIHJldHVybiAoXG4gICAgICA8UXVvdGVcbiAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgb25DbGljaz17Y2xpY2tIYW5kbGVyfVxuICAgICAgICB0ZXh0PXtxdW90ZS50ZXh0fVxuICAgICAgICByYXdBdHRhY2htZW50PXtxdW90ZS5yYXdBdHRhY2htZW50fVxuICAgICAgICBpc0luY29taW5nPXtpc0luY29taW5nfVxuICAgICAgICBhdXRob3JUaXRsZT17cXVvdGUuYXV0aG9yVGl0bGV9XG4gICAgICAgIGJvZHlSYW5nZXM9e3F1b3RlLmJvZHlSYW5nZXN9XG4gICAgICAgIGNvbnZlcnNhdGlvbkNvbG9yPXtjb252ZXJzYXRpb25Db2xvcn1cbiAgICAgICAgY3VzdG9tQ29sb3I9e2N1c3RvbUNvbG9yfVxuICAgICAgICBpc1ZpZXdPbmNlPXtpc1ZpZXdPbmNlfVxuICAgICAgICBpc0dpZnRCYWRnZT17aXNHaWZ0QmFkZ2V9XG4gICAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ9e3JlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmR9XG4gICAgICAgIGlzRnJvbU1lPXtxdW90ZS5pc0Zyb21NZX1cbiAgICAgICAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2U9eygpID0+XG4gICAgICAgICAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UoaWQpXG4gICAgICAgIH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJTdG9yeVJlcGx5Q29udGV4dCgpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgICAgY3VzdG9tQ29sb3IsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpMThuLFxuICAgICAgc3RvcnlSZXBseUNvbnRleHQsXG4gICAgICB2aWV3U3RvcnksXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXN0b3J5UmVwbHlDb250ZXh0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpc0luY29taW5nID0gZGlyZWN0aW9uID09PSAnaW5jb21pbmcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDw+XG4gICAgICAgIHtzdG9yeVJlcGx5Q29udGV4dC5lbW9qaSAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZV9fcXVvdGUtc3RvcnktcmVhY3Rpb24taGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignUXVvdGVfX3N0b3J5LXJlYWN0aW9uJywgW3N0b3J5UmVwbHlDb250ZXh0LmF1dGhvclRpdGxlXSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxRdW90ZVxuICAgICAgICAgIGF1dGhvclRpdGxlPXtzdG9yeVJlcGx5Q29udGV4dC5hdXRob3JUaXRsZX1cbiAgICAgICAgICBjb252ZXJzYXRpb25Db2xvcj17Y29udmVyc2F0aW9uQ29sb3J9XG4gICAgICAgICAgY3VzdG9tQ29sb3I9e2N1c3RvbUNvbG9yfVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgaXNGcm9tTWU9e3N0b3J5UmVwbHlDb250ZXh0LmlzRnJvbU1lfVxuICAgICAgICAgIGlzR2lmdEJhZGdlPXtmYWxzZX1cbiAgICAgICAgICBpc0luY29taW5nPXtpc0luY29taW5nfVxuICAgICAgICAgIGlzU3RvcnlSZXBseVxuICAgICAgICAgIGlzVmlld09uY2U9e2ZhbHNlfVxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3J5UmVwbHlRdW90ZVwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgdmlld1N0b3J5KHtcbiAgICAgICAgICAgICAgc3RvcnlJZDogc3RvcnlSZXBseUNvbnRleHQuc3RvcnlJZCxcbiAgICAgICAgICAgICAgc3RvcnlWaWV3TW9kZTogU3RvcnlWaWV3TW9kZVR5cGUuU2luZ2xlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICByYXdBdHRhY2htZW50PXtzdG9yeVJlcGx5Q29udGV4dC5yYXdBdHRhY2htZW50fVxuICAgICAgICAgIHJlYWN0aW9uRW1vamk9e3N0b3J5UmVwbHlDb250ZXh0LmVtb2ppfVxuICAgICAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ9eyFzdG9yeVJlcGx5Q29udGV4dC5zdG9yeUlkfVxuICAgICAgICAgIHRleHQ9e3N0b3J5UmVwbHlDb250ZXh0LnRleHR9XG4gICAgICAgIC8+XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlbmRlckVtYmVkZGVkQ29udGFjdCgpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnRhY3QsXG4gICAgICBjb252ZXJzYXRpb25UeXBlLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgaTE4bixcbiAgICAgIHNob3dDb250YWN0RGV0YWlsLFxuICAgICAgdGV4dCxcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoIWNvbnRhY3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhDYXB0aW9uID0gQm9vbGVhbih0ZXh0KTtcbiAgICBjb25zdCB3aXRoQ29udGVudEFib3ZlID1cbiAgICAgIGNvbnZlcnNhdGlvblR5cGUgPT09ICdncm91cCcgJiYgZGlyZWN0aW9uID09PSAnaW5jb21pbmcnO1xuICAgIGNvbnN0IHdpdGhDb250ZW50QmVsb3cgPVxuICAgICAgd2l0aENhcHRpb24gfHxcbiAgICAgIHRoaXMuZ2V0TWV0YWRhdGFQbGFjZW1lbnQoKSAhPT0gTWV0YWRhdGFQbGFjZW1lbnQuTm90UmVuZGVyZWQ7XG5cbiAgICBjb25zdCBvdGhlckNvbnRlbnQgPVxuICAgICAgKGNvbnRhY3QgJiYgY29udGFjdC5maXJzdE51bWJlciAmJiBjb250YWN0LnV1aWQpIHx8IHdpdGhDYXB0aW9uO1xuICAgIGNvbnN0IHRhYkluZGV4ID0gb3RoZXJDb250ZW50ID8gMCA6IC0xO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxFbWJlZGRlZENvbnRhY3RcbiAgICAgICAgY29udGFjdD17Y29udGFjdH1cbiAgICAgICAgaXNJbmNvbWluZz17ZGlyZWN0aW9uID09PSAnaW5jb21pbmcnfVxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2lnbmFsQWNjb3VudCA9XG4gICAgICAgICAgICBjb250YWN0LmZpcnN0TnVtYmVyICYmIGNvbnRhY3QudXVpZFxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiBjb250YWN0LmZpcnN0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgdXVpZDogY29udGFjdC51dWlkLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBzaG93Q29udGFjdERldGFpbCh7XG4gICAgICAgICAgICBjb250YWN0LFxuICAgICAgICAgICAgc2lnbmFsQWNjb3VudCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfX1cbiAgICAgICAgd2l0aENvbnRlbnRBYm92ZT17d2l0aENvbnRlbnRBYm92ZX1cbiAgICAgICAgd2l0aENvbnRlbnRCZWxvdz17d2l0aENvbnRlbnRCZWxvd31cbiAgICAgICAgdGFiSW5kZXg9e3RhYkluZGV4fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlbmRlclNlbmRNZXNzYWdlQnV0dG9uKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gICAgY29uc3QgeyBjb250YWN0LCBkaXJlY3Rpb24sIHNob3VsZENvbGxhcHNlQmVsb3csIHN0YXJ0Q29udmVyc2F0aW9uLCBpMThuIH0gPVxuICAgICAgdGhpcy5wcm9wcztcbiAgICBjb25zdCBub0JvdHRvbUxlZnRDdXJ2ZSA9IGRpcmVjdGlvbiA9PT0gJ2luY29taW5nJyAmJiBzaG91bGRDb2xsYXBzZUJlbG93O1xuICAgIGNvbnN0IG5vQm90dG9tUmlnaHRDdXJ2ZSA9IGRpcmVjdGlvbiA9PT0gJ291dGdvaW5nJyAmJiBzaG91bGRDb2xsYXBzZUJlbG93O1xuXG4gICAgaWYgKCFjb250YWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBmaXJzdE51bWJlciwgdXVpZCB9ID0gY29udGFjdDtcbiAgICBpZiAoIWZpcnN0TnVtYmVyIHx8ICF1dWlkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgc3RhcnRDb252ZXJzYXRpb24oZmlyc3ROdW1iZXIsIHV1aWQpO1xuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19zZW5kLW1lc3NhZ2UtYnV0dG9uJyxcbiAgICAgICAgICBub0JvdHRvbUxlZnRDdXJ2ZSAmJlxuICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19zZW5kLW1lc3NhZ2UtYnV0dG9uLS1uby1ib3R0b20tbGVmdC1jdXJ2ZScsXG4gICAgICAgICAgbm9Cb3R0b21SaWdodEN1cnZlICYmXG4gICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3NlbmQtbWVzc2FnZS1idXR0b24tLW5vLWJvdHRvbS1yaWdodC1jdXJ2ZSdcbiAgICAgICAgKX1cbiAgICAgID5cbiAgICAgICAge2kxOG4oJ3NlbmRNZXNzYWdlVG9Db250YWN0Jyl9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBdmF0YXIoKTogUmVhY3ROb2RlIHtcbiAgICBjb25zdCB7XG4gICAgICBhdXRob3IsXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGNvbnZlcnNhdGlvblR5cGUsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgICAgIGkxOG4sXG4gICAgICBzaG91bGRDb2xsYXBzZUJlbG93LFxuICAgICAgc2hvd0NvbnRhY3RNb2RhbCxcbiAgICAgIHRoZW1lLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGNvbnZlcnNhdGlvblR5cGUgIT09ICdncm91cCcgfHwgZGlyZWN0aW9uICE9PSAnaW5jb21pbmcnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ21vZHVsZS1tZXNzYWdlX19hdXRob3ItYXZhdGFyLWNvbnRhaW5lcicsIHtcbiAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2F1dGhvci1hdmF0YXItY29udGFpbmVyLS13aXRoLXJlYWN0aW9ucyc6XG4gICAgICAgICAgICB0aGlzLmhhc1JlYWN0aW9ucygpLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAge3Nob3VsZENvbGxhcHNlQmVsb3cgPyAoXG4gICAgICAgICAgPEF2YXRhclNwYWNlciBzaXplPXtHUk9VUF9BVkFUQVJfU0laRX0gLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXthdXRob3IuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgIGF2YXRhclBhdGg9e2F1dGhvci5hdmF0YXJQYXRofVxuICAgICAgICAgICAgYmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlKGF1dGhvci5iYWRnZXMpfVxuICAgICAgICAgICAgY29sb3I9e2F1dGhvci5jb2xvcn1cbiAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIGlzTWU9e2F1dGhvci5pc01lfVxuICAgICAgICAgICAgbmFtZT17YXV0aG9yLm5hbWV9XG4gICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiB7XG4gICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgIHNob3dDb250YWN0TW9kYWwoYXV0aG9yLmlkLCBjb252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcGhvbmVOdW1iZXI9e2F1dGhvci5waG9uZU51bWJlcn1cbiAgICAgICAgICAgIHByb2ZpbGVOYW1lPXthdXRob3IucHJvZmlsZU5hbWV9XG4gICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXthdXRob3Iuc2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgICAgIHNpemU9e0dST1VQX0FWQVRBUl9TSVpFfVxuICAgICAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICAgICAgdGl0bGU9e2F1dGhvci50aXRsZX1cbiAgICAgICAgICAgIHVuYmx1cnJlZEF2YXRhclBhdGg9e2F1dGhvci51bmJsdXJyZWRBdmF0YXJQYXRofVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlbmRlclRleHQoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7XG4gICAgICBib2R5UmFuZ2VzLFxuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgZGlzcGxheUxpbWl0LFxuICAgICAgaTE4bixcbiAgICAgIGlkLFxuICAgICAgbWVzc2FnZUV4cGFuZGVkLFxuICAgICAgb3BlbkNvbnZlcnNhdGlvbixcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQsXG4gICAgICBzdGF0dXMsXG4gICAgICB0ZXh0LFxuICAgICAgdGV4dERpcmVjdGlvbixcbiAgICAgIHRleHRBdHRhY2htZW50LFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgbWV0YWRhdGFXaWR0aCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBpc1JUTCA9IHRleHREaXJlY3Rpb24gPT09IFRleHREaXJlY3Rpb24uUmlnaHRUb0xlZnQ7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgICBjb25zdCBjb250ZW50cyA9IGRlbGV0ZWRGb3JFdmVyeW9uZVxuICAgICAgPyBpMThuKCdtZXNzYWdlLS1kZWxldGVkRm9yRXZlcnlvbmUnKVxuICAgICAgOiBkaXJlY3Rpb24gPT09ICdpbmNvbWluZycgJiYgc3RhdHVzID09PSAnZXJyb3InXG4gICAgICA/IGkxOG4oJ2luY29taW5nRXJyb3InKVxuICAgICAgOiB0ZXh0O1xuXG4gICAgaWYgKCFjb250ZW50cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fdGV4dCcsXG4gICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX190ZXh0LS0ke2RpcmVjdGlvbn1gLFxuICAgICAgICAgIHN0YXR1cyA9PT0gJ2Vycm9yJyAmJiBkaXJlY3Rpb24gPT09ICdpbmNvbWluZydcbiAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX190ZXh0LS1lcnJvcidcbiAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmVcbiAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX190ZXh0LS1kZWxldGUtZm9yLWV2ZXJ5b25lJ1xuICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICl9XG4gICAgICAgIGRpcj17aXNSVEwgPyAncnRsJyA6IHVuZGVmaW5lZH1cbiAgICAgID5cbiAgICAgICAgPE1lc3NhZ2VCb2R5UmVhZE1vcmVcbiAgICAgICAgICBib2R5UmFuZ2VzPXtib2R5UmFuZ2VzfVxuICAgICAgICAgIGRpc2FibGVMaW5rcz17IXRoaXMuYXJlTGlua3NFbmFibGVkKCl9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgZGlzcGxheUxpbWl0PXtkaXNwbGF5TGltaXR9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgbWVzc2FnZUV4cGFuZGVkPXttZXNzYWdlRXhwYW5kZWR9XG4gICAgICAgICAgb3BlbkNvbnZlcnNhdGlvbj17b3BlbkNvbnZlcnNhdGlvbn1cbiAgICAgICAgICBraWNrT2ZmQm9keURvd25sb2FkPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRleHRBdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQoe1xuICAgICAgICAgICAgICBhdHRhY2htZW50OiB0ZXh0QXR0YWNobWVudCxcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiBpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH19XG4gICAgICAgICAgdGV4dD17Y29udGVudHMgfHwgJyd9XG4gICAgICAgICAgdGV4dEF0dGFjaG1lbnQ9e3RleHRBdHRhY2htZW50fVxuICAgICAgICAvPlxuICAgICAgICB7IWlzUlRMICYmXG4gICAgICAgICAgdGhpcy5nZXRNZXRhZGF0YVBsYWNlbWVudCgpID09PSBNZXRhZGF0YVBsYWNlbWVudC5JbmxpbmVXaXRoVGV4dCAmJiAoXG4gICAgICAgICAgICA8TWVzc2FnZVRleHRNZXRhZGF0YVNwYWNlciBtZXRhZGF0YVdpZHRoPXttZXRhZGF0YVdpZHRofSAvPlxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFcnJvcigpOiBSZWFjdE5vZGUge1xuICAgIGNvbnN0IHsgc3RhdHVzLCBkaXJlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoXG4gICAgICBzdGF0dXMgIT09ICdwYXVzZWQnICYmXG4gICAgICBzdGF0dXMgIT09ICdlcnJvcicgJiZcbiAgICAgIHN0YXR1cyAhPT0gJ3BhcnRpYWwtc2VudCdcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19lcnJvci1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fZXJyb3InLFxuICAgICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX19lcnJvci0tJHtkaXJlY3Rpb259YCxcbiAgICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZV9fZXJyb3ItLSR7c3RhdHVzfWBcbiAgICAgICAgICApfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyTWVudSh0cmlnZ2VySWQ6IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgY29uc3Qge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBjYW5Eb3dubG9hZCxcbiAgICAgIGNhblJlYWN0LFxuICAgICAgY2FuUmVwbHksXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBkaXNhYmxlTWVudSxcbiAgICAgIGkxOG4sXG4gICAgICBpZCxcbiAgICAgIGlzU3RpY2tlcixcbiAgICAgIGlzVGFwVG9WaWV3LFxuICAgICAgcmVhY3RUb01lc3NhZ2UsXG4gICAgICByZW5kZXJFbW9qaVBpY2tlcixcbiAgICAgIHJlbmRlclJlYWN0aW9uUGlja2VyLFxuICAgICAgcmVwbHlUb01lc3NhZ2UsXG4gICAgICBzZWxlY3RlZFJlYWN0aW9uLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGRpc2FibGVNZW51KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHJlYWN0aW9uUGlja2VyUm9vdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IG11bHRpcGxlQXR0YWNobWVudHMgPSBhdHRhY2htZW50cyAmJiBhdHRhY2htZW50cy5sZW5ndGggPiAxO1xuICAgIGNvbnN0IGZpcnN0QXR0YWNobWVudCA9IGF0dGFjaG1lbnRzICYmIGF0dGFjaG1lbnRzWzBdO1xuXG4gICAgY29uc3QgZG93bmxvYWRCdXR0b24gPVxuICAgICAgIWlzU3RpY2tlciAmJlxuICAgICAgIW11bHRpcGxlQXR0YWNobWVudHMgJiZcbiAgICAgICFpc1RhcFRvVmlldyAmJlxuICAgICAgZmlyc3RBdHRhY2htZW50ICYmXG4gICAgICAhZmlyc3RBdHRhY2htZW50LnBlbmRpbmcgPyAoXG4gICAgICAgIC8vIFRoaXMgYSBtZW51IG1lYW50IGZvciBtb3VzZSB1c2Ugb25seVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvaW50ZXJhY3RpdmUtc3VwcG9ydHMtZm9jdXMsIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkdlbmVyaWNBdHRhY2htZW50fVxuICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ2Rvd25sb2FkQXR0YWNobWVudCcpfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fYnV0dG9uc19fZG93bmxvYWQnLFxuICAgICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX19idXR0b25zX19kb3dubG9hZC0tJHtkaXJlY3Rpb259YFxuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbDtcblxuICAgIGNvbnN0IHJlYWN0QnV0dG9uID0gKFxuICAgICAgPFJlZmVyZW5jZT5cbiAgICAgICAgeyh7IHJlZjogcG9wcGVyUmVmIH0pID0+IHtcbiAgICAgICAgICAvLyBPbmx5IGF0dGFjaCB0aGUgcG9wcGVyIHJlZmVyZW5jZSB0byB0aGUgcmVhY3Rpb24gYnV0dG9uIGlmIGl0IGlzXG4gICAgICAgICAgLy8gICB2aXNpYmxlIChpdCBpcyBoaWRkZW4gd2hlbiB0aGUgdGltZWxpbmUgaXMgbmFycm93KVxuICAgICAgICAgIGNvbnN0IG1heWJlUG9wcGVyUmVmID0gdGhpcy5pc1dpbmRvd1dpZHRoTm90TmFycm93KClcbiAgICAgICAgICAgID8gcG9wcGVyUmVmXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAvLyBUaGlzIGEgbWVudSBtZWFudCBmb3IgbW91c2UgdXNlIG9ubHlcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvaW50ZXJhY3RpdmUtc3VwcG9ydHMtZm9jdXMsIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgcmVmPXttYXliZVBvcHBlclJlZn1cbiAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlUmVhY3Rpb25QaWNrZXIoKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19idXR0b25zX19yZWFjdFwiXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ3JlYWN0VG9NZXNzYWdlJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L1JlZmVyZW5jZT5cbiAgICApO1xuXG4gICAgY29uc3QgcmVwbHlCdXR0b24gPSAoXG4gICAgICAvLyBUaGlzIGEgbWVudSBtZWFudCBmb3IgbW91c2UgdXNlIG9ubHlcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvaW50ZXJhY3RpdmUtc3VwcG9ydHMtZm9jdXMsIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcbiAgICAgIDxkaXZcbiAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIHJlcGx5VG9NZXNzYWdlKGlkKTtcbiAgICAgICAgfX1cbiAgICAgICAgLy8gVGhpcyBhIG1lbnUgbWVhbnQgZm9yIG1vdXNlIHVzZSBvbmx5XG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdyZXBseVRvTWVzc2FnZScpfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19idXR0b25zX19yZXBseScsXG4gICAgICAgICAgYG1vZHVsZS1tZXNzYWdlX19idXR0b25zX19kb3dubG9hZC0tJHtkaXJlY3Rpb259YFxuICAgICAgICApfVxuICAgICAgLz5cbiAgICApO1xuXG4gICAgLy8gVGhpcyBhIG1lbnUgbWVhbnQgZm9yIG1vdXNlIHVzZSBvbmx5XG4gICAgLyogZXNsaW50LWRpc2FibGUganN4LWExMXkvaW50ZXJhY3RpdmUtc3VwcG9ydHMtZm9jdXMgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBqc3gtYTExeS9jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzICovXG4gICAgY29uc3QgbWVudUJ1dHRvbiA9IChcbiAgICAgIDxSZWZlcmVuY2U+XG4gICAgICAgIHsoeyByZWY6IHBvcHBlclJlZiB9KSA9PiB7XG4gICAgICAgICAgLy8gT25seSBhdHRhY2ggdGhlIHBvcHBlciByZWZlcmVuY2UgdG8gdGhlIGNvbGxhcHNlZCBtZW51IGJ1dHRvbiBpZiB0aGUgcmVhY3Rpb25cbiAgICAgICAgICAvLyAgIGJ1dHRvbiBpcyBub3QgdmlzaWJsZSAoaXQgaXMgaGlkZGVuIHdoZW4gdGhlIHRpbWVsaW5lIGlzIG5hcnJvdylcbiAgICAgICAgICBjb25zdCBtYXliZVBvcHBlclJlZiA9ICF0aGlzLmlzV2luZG93V2lkdGhOb3ROYXJyb3coKVxuICAgICAgICAgICAgPyBwb3BwZXJSZWZcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxTdG9wUHJvcGFnYXRpb24gY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2VfX2J1dHRvbnNfX21lbnUtLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8Q29udGV4dE1lbnVUcmlnZ2VyXG4gICAgICAgICAgICAgICAgaWQ9e3RyaWdnZXJJZH1cbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgICAgIHJlZj17dGhpcy5jYXB0dXJlTWVudVRyaWdnZXIgYXMgYW55fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgcmVmPXttYXliZVBvcHBlclJlZn1cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zaG93TWVudX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ21lc3NhZ2VDb250ZXh0TWVudUJ1dHRvbicpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2J1dHRvbnNfX21lbnUnLFxuICAgICAgICAgICAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX2J1dHRvbnNfX2Rvd25sb2FkLS0ke2RpcmVjdGlvbn1gXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQ29udGV4dE1lbnVUcmlnZ2VyPlxuICAgICAgICAgICAgPC9TdG9wUHJvcGFnYXRpb24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvUmVmZXJlbmNlPlxuICAgICk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBqc3gtYTExeS9pbnRlcmFjdGl2ZS1zdXBwb3J0cy1mb2N1cyAqL1xuICAgIC8qIGVzbGludC1lbmFibGUganN4LWExMXkvY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAqL1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxNYW5hZ2VyPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19idXR0b25zJyxcbiAgICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZV9fYnV0dG9ucy0tJHtkaXJlY3Rpb259YFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5pc1dpbmRvd1dpZHRoTm90TmFycm93KCkgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAge2NhblJlYWN0ID8gcmVhY3RCdXR0b24gOiBudWxsfVxuICAgICAgICAgICAgICB7Y2FuRG93bmxvYWQgPyBkb3dubG9hZEJ1dHRvbiA6IG51bGx9XG4gICAgICAgICAgICAgIHtjYW5SZXBseSA/IHJlcGx5QnV0dG9uIDogbnVsbH1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge21lbnVCdXR0b259XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7cmVhY3Rpb25QaWNrZXJSb290ICYmXG4gICAgICAgICAgY3JlYXRlUG9ydGFsKFxuICAgICAgICAgICAgPFN0b3BQcm9wYWdhdGlvbj5cbiAgICAgICAgICAgICAgPFBvcHBlclxuICAgICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgICAgbW9kaWZpZXJzPXtbXG4gICAgICAgICAgICAgICAgICBvZmZzZXREaXN0YW5jZU1vZGlmaWVyKDQpLFxuICAgICAgICAgICAgICAgICAgdGhpcy5wb3BwZXJQcmV2ZW50T3ZlcmZsb3dNb2RpZmllcigpLFxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7KHsgcmVmLCBzdHlsZSB9KSA9PlxuICAgICAgICAgICAgICAgICAgcmVuZGVyUmVhY3Rpb25QaWNrZXIoe1xuICAgICAgICAgICAgICAgICAgICByZWYsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRSZWFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgb25DbG9zZTogdGhpcy50b2dnbGVSZWFjdGlvblBpY2tlcixcbiAgICAgICAgICAgICAgICAgICAgb25QaWNrOiBlbW9qaSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGVSZWFjdGlvblBpY2tlcih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICByZWFjdFRvTWVzc2FnZShpZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1vamksXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmU6IGVtb2ppID09PSBzZWxlY3RlZFJlYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJFbW9qaVBpY2tlcixcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L1BvcHBlcj5cbiAgICAgICAgICAgIDwvU3RvcFByb3BhZ2F0aW9uPixcbiAgICAgICAgICAgIHJlYWN0aW9uUGlja2VyUm9vdFxuICAgICAgICAgICl9XG4gICAgICA8L01hbmFnZXI+XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJDb250ZXh0TWVudSh0cmlnZ2VySWQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcbiAgICBjb25zdCB7XG4gICAgICBhdHRhY2htZW50cyxcbiAgICAgIGNhbkRvd25sb2FkLFxuICAgICAgY29udGFjdCxcbiAgICAgIGNhblJlYWN0LFxuICAgICAgY2FuUmVwbHksXG4gICAgICBjYW5SZXRyeSxcbiAgICAgIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmUsXG4gICAgICBkZWxldGVNZXNzYWdlLFxuICAgICAgZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lLFxuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lLFxuICAgICAgZ2lmdEJhZGdlLFxuICAgICAgaTE4bixcbiAgICAgIGlkLFxuICAgICAgaXNTdGlja2VyLFxuICAgICAgaXNUYXBUb1ZpZXcsXG4gICAgICByZXBseVRvTWVzc2FnZSxcbiAgICAgIHJldHJ5U2VuZCxcbiAgICAgIHJldHJ5RGVsZXRlRm9yRXZlcnlvbmUsXG4gICAgICBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbCxcbiAgICAgIHNob3dNZXNzYWdlRGV0YWlsLFxuICAgICAgdGV4dCxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGNhbkZvcndhcmQgPVxuICAgICAgIWlzVGFwVG9WaWV3ICYmICFkZWxldGVkRm9yRXZlcnlvbmUgJiYgIWdpZnRCYWRnZSAmJiAhY29udGFjdDtcbiAgICBjb25zdCBtdWx0aXBsZUF0dGFjaG1lbnRzID0gYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoID4gMTtcblxuICAgIGNvbnN0IHNob3VsZFNob3dBZGRpdGlvbmFsID1cbiAgICAgIGRvZXNNZXNzYWdlQm9keU92ZXJmbG93KHRleHQgfHwgJycpIHx8ICF0aGlzLmlzV2luZG93V2lkdGhOb3ROYXJyb3coKTtcblxuICAgIGNvbnN0IG1lbnUgPSAoXG4gICAgICA8Q29udGV4dE1lbnUgaWQ9e3RyaWdnZXJJZH0+XG4gICAgICAgIHtjYW5Eb3dubG9hZCAmJlxuICAgICAgICBzaG91bGRTaG93QWRkaXRpb25hbCAmJlxuICAgICAgICAhaXNTdGlja2VyICYmXG4gICAgICAgICFtdWx0aXBsZUF0dGFjaG1lbnRzICYmXG4gICAgICAgICFpc1RhcFRvVmlldyAmJlxuICAgICAgICBhdHRhY2htZW50cyAmJlxuICAgICAgICBhdHRhY2htZW50c1swXSA/IChcbiAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXM9e3tcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGV4dC0taWNvbiBtb2R1bGUtbWVzc2FnZV9fY29udGV4dF9fZG93bmxvYWQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkdlbmVyaWNBdHRhY2htZW50fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdkb3dubG9hZEF0dGFjaG1lbnQnKX1cbiAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge3Nob3VsZFNob3dBZGRpdGlvbmFsID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICB7Y2FuUmVwbHkgJiYgKFxuICAgICAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzPXt7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6XG4gICAgICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGV4dC0taWNvbiBtb2R1bGUtbWVzc2FnZV9fY29udGV4dF9fcmVwbHknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgIHJlcGx5VG9NZXNzYWdlKGlkKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2kxOG4oJ3JlcGx5VG9NZXNzYWdlJyl9XG4gICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2NhblJlYWN0ICYmIChcbiAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcz17e1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHQtLWljb24gbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHRfX3JlYWN0JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudDogUmVhY3QuTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVJlYWN0aW9uUGlja2VyKCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpMThuKCdyZWFjdFRvTWVzc2FnZScpfVxuICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxNZW51SXRlbVxuICAgICAgICAgIGF0dHJpYnV0ZXM9e3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTpcbiAgICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX19jb250ZXh0LS1pY29uIG1vZHVsZS1tZXNzYWdlX19jb250ZXh0X19tb3JlLWluZm8nLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNob3dNZXNzYWdlRGV0YWlsKGlkKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ21vcmVJbmZvJyl9XG4gICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgIHtjYW5SZXRyeSA/IChcbiAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXM9e3tcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGV4dC0taWNvbiBtb2R1bGUtbWVzc2FnZV9fY29udGV4dF9fcmV0cnktc2VuZCcsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgIHJldHJ5U2VuZChpZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdyZXRyeVNlbmQnKX1cbiAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge2NhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmUgPyAoXG4gICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICBhdHRyaWJ1dGVzPXt7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTpcbiAgICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHQtLWljb24gbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHRfX2RlbGV0ZS1tZXNzYWdlLWZvci1ldmVyeW9uZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgIHJldHJ5RGVsZXRlRm9yRXZlcnlvbmUoaWQpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bigncmV0cnlEZWxldGVGb3JFdmVyeW9uZScpfVxuICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICB7Y2FuRm9yd2FyZCA/IChcbiAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXM9e3tcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGV4dC0taWNvbiBtb2R1bGUtbWVzc2FnZV9fY29udGV4dF9fZm9yd2FyZC1tZXNzYWdlJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgc2hvd0ZvcndhcmRNZXNzYWdlTW9kYWwoaWQpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignZm9yd2FyZE1lc3NhZ2UnKX1cbiAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgYXR0cmlidXRlcz17e1xuICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHQtLWljb24gbW9kdWxlLW1lc3NhZ2VfX2NvbnRleHRfX2RlbGV0ZS1tZXNzYWdlJyxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9eyhldmVudDogUmVhY3QuTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBkZWxldGVNZXNzYWdlKGlkKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ2RlbGV0ZU1lc3NhZ2UnKX1cbiAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAge3RoaXMuY2FuRGVsZXRlRm9yRXZlcnlvbmUoKSA/IChcbiAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXM9e3tcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOlxuICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGV4dC0taWNvbiBtb2R1bGUtbWVzc2FnZV9fY29udGV4dF9fZGVsZXRlLW1lc3NhZ2UtZm9yLWV2ZXJ5b25lJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lKGlkKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2RlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZScpfVxuICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9Db250ZXh0TWVudT5cbiAgICApO1xuXG4gICAgcmV0dXJuIFJlYWN0RE9NLmNyZWF0ZVBvcnRhbChtZW51LCBkb2N1bWVudC5ib2R5KTtcbiAgfVxuXG4gIHByaXZhdGUgaXNXaW5kb3dXaWR0aE5vdE5hcnJvdygpOiBib29sZWFuIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lcldpZHRoQnJlYWtwb2ludCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gY29udGFpbmVyV2lkdGhCcmVha3BvaW50ICE9PSBXaWR0aEJyZWFrcG9pbnQuTmFycm93O1xuICB9XG5cbiAgcHVibGljIGdldFdpZHRoKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgeyBhdHRhY2htZW50cywgZ2lmdEJhZGdlLCBpc1N0aWNrZXIsIHByZXZpZXdzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGdpZnRCYWRnZSkge1xuICAgICAgcmV0dXJuIDI0MDtcbiAgICB9XG5cbiAgICBpZiAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICBpZiAoaXNHSUYoYXR0YWNobWVudHMpKSB7XG4gICAgICAgIC8vIE1lc3NhZ2UgY29udGFpbmVyIGJvcmRlclxuICAgICAgICByZXR1cm4gR0lGX1NJWkUgKyAyO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNTdGlja2VyKSB7XG4gICAgICAgIC8vIFBhZGRpbmcgaXMgOHB4LCBvbiBib3RoIHNpZGVzXG4gICAgICAgIHJldHVybiBTVElDS0VSX1NJWkUgKyA4ICogMjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IGdldEdyaWREaW1lbnNpb25zKGF0dGFjaG1lbnRzKTtcbiAgICAgIGlmIChkaW1lbnNpb25zKSB7XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zLndpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0TGlua1ByZXZpZXcgPSAocHJldmlld3MgfHwgW10pWzBdO1xuICAgIGlmIChcbiAgICAgIGZpcnN0TGlua1ByZXZpZXcgJiZcbiAgICAgIGZpcnN0TGlua1ByZXZpZXcuaW1hZ2UgJiZcbiAgICAgIHNob3VsZFVzZUZ1bGxTaXplTGlua1ByZXZpZXdJbWFnZShmaXJzdExpbmtQcmV2aWV3KVxuICAgICkge1xuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IGdldEltYWdlRGltZW5zaW9ucyhmaXJzdExpbmtQcmV2aWV3LmltYWdlKTtcbiAgICAgIGlmIChkaW1lbnNpb25zKSB7XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zLndpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgaXNTaG93aW5nSW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBpc1RhcFRvVmlldywgYXR0YWNobWVudHMsIHByZXZpZXdzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaW1hZ2VCcm9rZW4gfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoaW1hZ2VCcm9rZW4gfHwgaXNUYXBUb1ZpZXcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBkaXNwbGF5SW1hZ2UgPSBjYW5EaXNwbGF5SW1hZ2UoYXR0YWNobWVudHMpO1xuXG4gICAgICByZXR1cm4gZGlzcGxheUltYWdlICYmIChpc0ltYWdlKGF0dGFjaG1lbnRzKSB8fCBpc1ZpZGVvKGF0dGFjaG1lbnRzKSk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZpZXdzICYmIHByZXZpZXdzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZmlyc3QgPSBwcmV2aWV3c1swXTtcbiAgICAgIGNvbnN0IHsgaW1hZ2UgfSA9IGZpcnN0O1xuXG4gICAgICByZXR1cm4gaXNJbWFnZUF0dGFjaG1lbnQoaW1hZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBpc0F0dGFjaG1lbnRQZW5kaW5nKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgYXR0YWNobWVudHMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWF0dGFjaG1lbnRzIHx8IGF0dGFjaG1lbnRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdCA9IGF0dGFjaG1lbnRzWzBdO1xuXG4gICAgcmV0dXJuIEJvb2xlYW4oZmlyc3QucGVuZGluZyk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyVGFwVG9WaWV3SWNvbigpOiBKU1guRWxlbWVudCB7XG4gICAgY29uc3QgeyBkaXJlY3Rpb24sIGlzVGFwVG9WaWV3RXhwaXJlZCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpc0Rvd25sb2FkUGVuZGluZyA9IHRoaXMuaXNBdHRhY2htZW50UGVuZGluZygpO1xuXG4gICAgcmV0dXJuICFpc1RhcFRvVmlld0V4cGlyZWQgJiYgaXNEb3dubG9hZFBlbmRpbmcgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX190YXAtdG8tdmlld19fc3Bpbm5lci1jb250YWluZXJcIj5cbiAgICAgICAgPFNwaW5uZXIgc3ZnU2l6ZT1cInNtYWxsXCIgc2l6ZT1cIjIwcHhcIiBkaXJlY3Rpb249e2RpcmVjdGlvbn0gLz5cbiAgICAgIDwvZGl2PlxuICAgICkgOiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3X19pY29uJyxcbiAgICAgICAgICBgbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3X19pY29uLS0ke2RpcmVjdGlvbn1gLFxuICAgICAgICAgIGlzVGFwVG9WaWV3RXhwaXJlZFxuICAgICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3X19pY29uLS1leHBpcmVkJ1xuICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyVGFwVG9WaWV3VGV4dCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHtcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgaTE4bixcbiAgICAgIGlzVGFwVG9WaWV3RXhwaXJlZCxcbiAgICAgIGlzVGFwVG9WaWV3RXJyb3IsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBpbmNvbWluZ1N0cmluZyA9IGlzVGFwVG9WaWV3RXhwaXJlZFxuICAgICAgPyBpMThuKCdNZXNzYWdlLS10YXAtdG8tdmlldy1leHBpcmVkJylcbiAgICAgIDogaTE4bihcbiAgICAgICAgICBgTWVzc2FnZS0tdGFwLXRvLXZpZXctLWluY29taW5nJHtcbiAgICAgICAgICAgIGlzVmlkZW8oYXR0YWNobWVudHMpID8gJy12aWRlbycgOiAnJ1xuICAgICAgICAgIH1gXG4gICAgICAgICk7XG4gICAgY29uc3Qgb3V0Z29pbmdTdHJpbmcgPSBpMThuKCdNZXNzYWdlLS10YXAtdG8tdmlldy0tb3V0Z29pbmcnKTtcbiAgICBjb25zdCBpc0Rvd25sb2FkUGVuZGluZyA9IHRoaXMuaXNBdHRhY2htZW50UGVuZGluZygpO1xuXG4gICAgaWYgKGlzRG93bmxvYWRQZW5kaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XG4gICAgcmV0dXJuIGlzVGFwVG9WaWV3RXJyb3JcbiAgICAgID8gaTE4bignaW5jb21pbmdFcnJvcicpXG4gICAgICA6IGRpcmVjdGlvbiA9PT0gJ291dGdvaW5nJ1xuICAgICAgPyBvdXRnb2luZ1N0cmluZ1xuICAgICAgOiBpbmNvbWluZ1N0cmluZztcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJUYXBUb1ZpZXcoKTogSlNYLkVsZW1lbnQge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvblR5cGUsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpc1RhcFRvVmlld0V4cGlyZWQsXG4gICAgICBpc1RhcFRvVmlld0Vycm9yLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgY29sbGFwc2VNZXRhZGF0YSA9XG4gICAgICB0aGlzLmdldE1ldGFkYXRhUGxhY2VtZW50KCkgPT09IE1ldGFkYXRhUGxhY2VtZW50Lk5vdFJlbmRlcmVkO1xuICAgIGNvbnN0IHdpdGhDb250ZW50QmVsb3cgPSAhY29sbGFwc2VNZXRhZGF0YTtcbiAgICBjb25zdCB3aXRoQ29udGVudEFib3ZlID1cbiAgICAgICFjb2xsYXBzZU1ldGFkYXRhICYmXG4gICAgICBjb252ZXJzYXRpb25UeXBlID09PSAnZ3JvdXAnICYmXG4gICAgICBkaXJlY3Rpb24gPT09ICdpbmNvbWluZyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgJ21vZHVsZS1tZXNzYWdlX190YXAtdG8tdmlldycsXG4gICAgICAgICAgd2l0aENvbnRlbnRCZWxvd1xuICAgICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3LS13aXRoLWNvbnRlbnQtYmVsb3cnXG4gICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgd2l0aENvbnRlbnRBYm92ZVxuICAgICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3LS13aXRoLWNvbnRlbnQtYWJvdmUnXG4gICAgICAgICAgICA6IG51bGxcbiAgICAgICAgKX1cbiAgICAgID5cbiAgICAgICAge2lzVGFwVG9WaWV3RXJyb3IgPyBudWxsIDogdGhpcy5yZW5kZXJUYXBUb1ZpZXdJY29uKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3X190ZXh0JyxcbiAgICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZV9fdGFwLXRvLXZpZXdfX3RleHQtLSR7ZGlyZWN0aW9ufWAsXG4gICAgICAgICAgICBpc1RhcFRvVmlld0V4cGlyZWRcbiAgICAgICAgICAgICAgPyBgbW9kdWxlLW1lc3NhZ2VfX3RhcC10by12aWV3X190ZXh0LS0ke2RpcmVjdGlvbn0tZXhwaXJlZGBcbiAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgaXNUYXBUb1ZpZXdFcnJvclxuICAgICAgICAgICAgICA/IGBtb2R1bGUtbWVzc2FnZV9fdGFwLXRvLXZpZXdfX3RleHQtLSR7ZGlyZWN0aW9ufS1lcnJvcmBcbiAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgKX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRhcFRvVmlld1RleHQoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3BwZXJQcmV2ZW50T3ZlcmZsb3dNb2RpZmllcigpOiBQYXJ0aWFsPFByZXZlbnRPdmVyZmxvd01vZGlmaWVyPiB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbGVtZW50UmVmIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWx0QXhpczogdHJ1ZSxcbiAgICAgICAgYm91bmRhcnk6IGNvbnRhaW5lckVsZW1lbnRSZWYuY3VycmVudCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICBib3R0b206IDE2LFxuICAgICAgICAgIGxlZnQ6IDgsXG4gICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgdG9wOiAxNixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGVSZWFjdGlvblZpZXdlciA9IChvbmx5UmVtb3ZlID0gZmFsc2UpOiB2b2lkID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKCh7IHJlYWN0aW9uVmlld2VyUm9vdCB9KSA9PiB7XG4gICAgICBpZiAocmVhY3Rpb25WaWV3ZXJSb290KSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocmVhY3Rpb25WaWV3ZXJSb290KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgdGhpcy5oYW5kbGVDbGlja091dHNpZGVSZWFjdGlvblZpZXdlcixcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHsgcmVhY3Rpb25WaWV3ZXJSb290OiBudWxsIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghb25seVJlbW92ZSkge1xuICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocm9vdCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2tPdXRzaWRlUmVhY3Rpb25WaWV3ZXIsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVhY3Rpb25WaWV3ZXJSb290OiByb290LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfTtcblxuICBwdWJsaWMgdG9nZ2xlUmVhY3Rpb25QaWNrZXIgPSAob25seVJlbW92ZSA9IGZhbHNlKTogdm9pZCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSgoeyByZWFjdGlvblBpY2tlclJvb3QgfSkgPT4ge1xuICAgICAgaWYgKHJlYWN0aW9uUGlja2VyUm9vdCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHJlYWN0aW9uUGlja2VyUm9vdCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2tPdXRzaWRlUmVhY3Rpb25QaWNrZXIsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7IHJlYWN0aW9uUGlja2VyUm9vdDogbnVsbCB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9ubHlSZW1vdmUpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJvb3QpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZVJlYWN0aW9uUGlja2VyLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlYWN0aW9uUGlja2VyUm9vdDogcm9vdCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUNsaWNrT3V0c2lkZVJlYWN0aW9uVmlld2VyID0gKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IHJlYWN0aW9uVmlld2VyUm9vdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IGN1cnJlbnQ6IHJlYWN0aW9uc0NvbnRhaW5lciB9ID0gdGhpcy5yZWFjdGlvbnNDb250YWluZXJSZWY7XG4gICAgaWYgKHJlYWN0aW9uVmlld2VyUm9vdCAmJiByZWFjdGlvbnNDb250YWluZXIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXJlYWN0aW9uVmlld2VyUm9vdC5jb250YWlucyhlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkgJiZcbiAgICAgICAgIXJlYWN0aW9uc0NvbnRhaW5lci5jb250YWlucyhlLnRhcmdldCBhcyBIVE1MRWxlbWVudClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnRvZ2dsZVJlYWN0aW9uVmlld2VyKHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgaGFuZGxlQ2xpY2tPdXRzaWRlUmVhY3Rpb25QaWNrZXIgPSAoZTogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgcmVhY3Rpb25QaWNrZXJSb290IH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChyZWFjdGlvblBpY2tlclJvb3QpIHtcbiAgICAgIGlmICghcmVhY3Rpb25QaWNrZXJSb290LmNvbnRhaW5zKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICB0aGlzLnRvZ2dsZVJlYWN0aW9uUGlja2VyKHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgcmVuZGVyUmVhY3Rpb25zKG91dGdvaW5nOiBib29sZWFuKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7IGdldFByZWZlcnJlZEJhZGdlLCByZWFjdGlvbnMgPSBbXSwgaTE4biwgdGhlbWUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIXRoaXMuaGFzUmVhY3Rpb25zKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWN0aW9uc1dpdGhFbW9qaURhdGEgPSByZWFjdGlvbnMubWFwKHJlYWN0aW9uID0+ICh7XG4gICAgICAuLi5yZWFjdGlvbixcbiAgICAgIC4uLmVtb2ppVG9EYXRhKHJlYWN0aW9uLmVtb2ppKSxcbiAgICB9KSk7XG5cbiAgICAvLyBHcm91cCBieSBlbW9qaSBhbmQgb3JkZXIgZWFjaCBncm91cCBieSB0aW1lc3RhbXAgZGVzY2VuZGluZ1xuICAgIGNvbnN0IGdyb3VwZWRBbmRTb3J0ZWRSZWFjdGlvbnMgPSBPYmplY3QudmFsdWVzKFxuICAgICAgZ3JvdXBCeShyZWFjdGlvbnNXaXRoRW1vamlEYXRhLCAnc2hvcnRfbmFtZScpXG4gICAgKS5tYXAoZ3JvdXBlZFJlYWN0aW9ucyA9PlxuICAgICAgb3JkZXJCeShcbiAgICAgICAgZ3JvdXBlZFJlYWN0aW9ucyxcbiAgICAgICAgW3JlYWN0aW9uID0+IHJlYWN0aW9uLmZyb20uaXNNZSwgJ3RpbWVzdGFtcCddLFxuICAgICAgICBbJ2Rlc2MnLCAnZGVzYyddXG4gICAgICApXG4gICAgKTtcbiAgICAvLyBPcmRlciBncm91cHMgYnkgbGVuZ3RoIGFuZCBzdWJzZXF1ZW50bHkgYnkgbW9zdCByZWNlbnQgcmVhY3Rpb25cbiAgICBjb25zdCBvcmRlcmVkID0gb3JkZXJCeShcbiAgICAgIGdyb3VwZWRBbmRTb3J0ZWRSZWFjdGlvbnMsXG4gICAgICBbJ2xlbmd0aCcsIChbeyB0aW1lc3RhbXAgfV0pID0+IHRpbWVzdGFtcF0sXG4gICAgICBbJ2Rlc2MnLCAnZGVzYyddXG4gICAgKTtcbiAgICAvLyBUYWtlIHRoZSBmaXJzdCB0aHJlZSBncm91cHMgZm9yIHJlbmRlcmluZ1xuICAgIGNvbnN0IHRvUmVuZGVyID0gdGFrZShvcmRlcmVkLCAzKS5tYXAocmVzID0+ICh7XG4gICAgICBlbW9qaTogcmVzWzBdLmVtb2ppLFxuICAgICAgY291bnQ6IHJlcy5sZW5ndGgsXG4gICAgICBpc01lOiByZXMuc29tZShyZSA9PiBCb29sZWFuKHJlLmZyb20uaXNNZSkpLFxuICAgIH0pKTtcbiAgICBjb25zdCBzb21lTm90UmVuZGVyZWQgPSBvcmRlcmVkLmxlbmd0aCA+IDM7XG4gICAgLy8gV2Ugb25seSBkcm9wIHR3byBoZXJlIGJlY2F1c2UgdGhlIHRoaXJkIGVtb2ppIHdvdWxkIGJlIHJlcGxhY2VkIGJ5IHRoZVxuICAgIC8vIG1vcmUgYnV0dG9uXG4gICAgY29uc3QgbWF5YmVOb3RSZW5kZXJlZCA9IGRyb3Aob3JkZXJlZCwgMik7XG4gICAgY29uc3QgbWF5YmVOb3RSZW5kZXJlZFRvdGFsID0gbWF5YmVOb3RSZW5kZXJlZC5yZWR1Y2UoXG4gICAgICAoc3VtLCByZXMpID0+IHN1bSArIHJlcy5sZW5ndGgsXG4gICAgICAwXG4gICAgKTtcbiAgICBjb25zdCBub3RSZW5kZXJlZElzTWUgPVxuICAgICAgc29tZU5vdFJlbmRlcmVkICYmXG4gICAgICBtYXliZU5vdFJlbmRlcmVkLnNvbWUocmVzID0+IHJlcy5zb21lKHJlID0+IEJvb2xlYW4ocmUuZnJvbS5pc01lKSkpO1xuXG4gICAgY29uc3QgeyByZWFjdGlvblZpZXdlclJvb3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBwb3BwZXJQbGFjZW1lbnQgPSBvdXRnb2luZyA/ICdib3R0b20tZW5kJyA6ICdib3R0b20tc3RhcnQnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxNYW5hZ2VyPlxuICAgICAgICA8UmVmZXJlbmNlPlxuICAgICAgICAgIHsoeyByZWY6IHBvcHBlclJlZiB9KSA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHJlZj17dGhpcy5yZWFjdGlvbnNDb250YWluZXJSZWZNZXJnZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5yZWFjdGlvbnNDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3JlYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgb3V0Z29pbmdcbiAgICAgICAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19yZWFjdGlvbnMtLW91dGdvaW5nJ1xuICAgICAgICAgICAgICAgICAgOiAnbW9kdWxlLW1lc3NhZ2VfX3JlYWN0aW9ucy0taW5jb21pbmcnXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0b1JlbmRlci5tYXAoKHJlLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gdG9SZW5kZXIubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc01vcmUgPSBpc0xhc3QgJiYgc29tZU5vdFJlbmRlcmVkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzTW9yZVdpdGhNZSA9IGlzTW9yZSAmJiBub3RSZW5kZXJlZElzTWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2Ake3JlLmVtb2ppfS0ke2l9YH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fcmVhY3Rpb25zX19yZWFjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgcmUuY291bnQgPiAxXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdtb2R1bGUtbWVzc2FnZV9fcmVhY3Rpb25zX19yZWFjdGlvbi0td2l0aC1jb3VudCdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX3JlYWN0aW9uc19fcmVhY3Rpb24tLW91dGdvaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAnbW9kdWxlLW1lc3NhZ2VfX3JlYWN0aW9uc19fcmVhY3Rpb24tLWluY29taW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICBpc01vcmVXaXRoTWUgfHwgKHJlLmlzTWUgJiYgIWlzTW9yZVdpdGhNZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19yZWFjdGlvbnNfX3JlYWN0aW9uLS1pcy1tZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVJlYWN0aW9uVmlld2VyKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IGVudGVyIGtleSBmcm9tIG9wZW5pbmcgc3RpY2tlcnMvYXR0YWNobWVudHNcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7aXNNb3JlID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fcmVhY3Rpb25zX19yZWFjdGlvbl9fY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2VfX3JlYWN0aW9uc19fcmVhY3Rpb25fX2NvdW50LS1uby1lbW9qaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzTW9yZVdpdGhNZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19yZWFjdGlvbnNfX3JlYWN0aW9uX19jb3VudC0taXMtbWUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICt7bWF5YmVOb3RSZW5kZXJlZFRvdGFsfVxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEVtb2ppIHNpemU9ezE2fSBlbW9qaT17cmUuZW1vaml9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cmUuY291bnQgPiAxID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtb2R1bGUtbWVzc2FnZV9fcmVhY3Rpb25zX19yZWFjdGlvbl9fY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmUuaXNNZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdtb2R1bGUtbWVzc2FnZV9fcmVhY3Rpb25zX19yZWFjdGlvbl9fY291bnQtLWlzLW1lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlLmNvdW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9SZWZlcmVuY2U+XG4gICAgICAgIHtyZWFjdGlvblZpZXdlclJvb3QgJiZcbiAgICAgICAgICBjcmVhdGVQb3J0YWwoXG4gICAgICAgICAgICA8U3RvcFByb3BhZ2F0aW9uPlxuICAgICAgICAgICAgICA8UG9wcGVyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50PXtwb3BwZXJQbGFjZW1lbnR9XG4gICAgICAgICAgICAgICAgc3RyYXRlZ3k9XCJmaXhlZFwiXG4gICAgICAgICAgICAgICAgbW9kaWZpZXJzPXtbdGhpcy5wb3BwZXJQcmV2ZW50T3ZlcmZsb3dNb2RpZmllcigpXX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsoeyByZWYsIHN0eWxlIH0pID0+IChcbiAgICAgICAgICAgICAgICAgIDxSZWFjdGlvblZpZXdlclxuICAgICAgICAgICAgICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgICAgICAgICAgcmVhY3Rpb25zPXtyZWFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9e3RoaXMudG9nZ2xlUmVhY3Rpb25WaWV3ZXJ9XG4gICAgICAgICAgICAgICAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9Qb3BwZXI+XG4gICAgICAgICAgICA8L1N0b3BQcm9wYWdhdGlvbj4sXG4gICAgICAgICAgICByZWFjdGlvblZpZXdlclJvb3RcbiAgICAgICAgICApfVxuICAgICAgPC9NYW5hZ2VyPlxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyQ29udGVudHMoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7IGdpZnRCYWRnZSwgaXNUYXBUb1ZpZXcsIGRlbGV0ZWRGb3JFdmVyeW9uZSB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChkZWxldGVkRm9yRXZlcnlvbmUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAge3RoaXMucmVuZGVyVGV4dCgpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlck1ldGFkYXRhKCl9XG4gICAgICAgIDwvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZ2lmdEJhZGdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJHaWZ0QmFkZ2UoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNUYXBUb1ZpZXcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAge3RoaXMucmVuZGVyVGFwVG9WaWV3KCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyTWV0YWRhdGEoKX1cbiAgICAgICAgPC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICB7dGhpcy5yZW5kZXJRdW90ZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJTdG9yeVJlcGx5Q29udGV4dCgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJBdHRhY2htZW50KCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclByZXZpZXcoKX1cbiAgICAgICAge3RoaXMucmVuZGVyRW1iZWRkZWRDb250YWN0KCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclRleHQoKX1cbiAgICAgICAge3RoaXMucmVuZGVyTWV0YWRhdGEoKX1cbiAgICAgICAge3RoaXMucmVuZGVyU2VuZE1lc3NhZ2VCdXR0b24oKX1cbiAgICAgIDwvPlxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlT3BlbiA9IChcbiAgICBldmVudDogUmVhY3QuS2V5Ym9hcmRFdmVudDxIVE1MRGl2RWxlbWVudD4gfCBSZWFjdC5Nb3VzZUV2ZW50XG4gICk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgY29udGFjdCxcbiAgICAgIGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgZ2lmdEJhZGdlLFxuICAgICAgaWQsXG4gICAgICBpc1RhcFRvVmlldyxcbiAgICAgIGlzVGFwVG9WaWV3RXhwaXJlZCxcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQsXG4gICAgICBzdGFydENvbnZlcnNhdGlvbixcbiAgICAgIG9wZW5HaWZ0QmFkZ2UsXG4gICAgICBzaG93Q29udGFjdERldGFpbCxcbiAgICAgIHNob3dWaXN1YWxBdHRhY2htZW50LFxuICAgICAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0LFxuICAgICAgc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0LFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaW1hZ2VCcm9rZW4gfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBpc0F0dGFjaG1lbnRQZW5kaW5nID0gdGhpcy5pc0F0dGFjaG1lbnRQZW5kaW5nKCk7XG5cbiAgICBpZiAoZ2lmdEJhZGdlICYmIGdpZnRCYWRnZS5zdGF0ZSA9PT0gR2lmdEJhZGdlU3RhdGVzLlVub3BlbmVkKSB7XG4gICAgICBvcGVuR2lmdEJhZGdlKGlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNUYXBUb1ZpZXcpIHtcbiAgICAgIGlmIChpc0F0dGFjaG1lbnRQZW5kaW5nKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICc8TWVzc2FnZT4gaGFuZGxlT3BlbjogdGFwLXRvLXZpZXcgYXR0YWNobWVudCBpcyBwZW5kaW5nOyBub3Qgc2hvd2luZyB0aGUgbGlnaHRib3gnXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dGFjaG1lbnRzICYmICFpc0Rvd25sb2FkZWQoYXR0YWNobWVudHNbMF0pKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkKHtcbiAgICAgICAgICBhdHRhY2htZW50OiBhdHRhY2htZW50c1swXSxcbiAgICAgICAgICBtZXNzYWdlSWQ6IGlkLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNUYXBUb1ZpZXdFeHBpcmVkKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9XG4gICAgICAgICAgZGlyZWN0aW9uID09PSAnb3V0Z29pbmcnXG4gICAgICAgICAgICA/IHNob3dFeHBpcmVkT3V0Z29pbmdUYXBUb1ZpZXdUb2FzdFxuICAgICAgICAgICAgOiBzaG93RXhwaXJlZEluY29taW5nVGFwVG9WaWV3VG9hc3Q7XG4gICAgICAgIGFjdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2UoaWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWltYWdlQnJva2VuICYmXG4gICAgICBhdHRhY2htZW50cyAmJlxuICAgICAgYXR0YWNobWVudHMubGVuZ3RoID4gMCAmJlxuICAgICAgIWlzQXR0YWNobWVudFBlbmRpbmcgJiZcbiAgICAgIChpc0ltYWdlKGF0dGFjaG1lbnRzKSB8fCBpc1ZpZGVvKGF0dGFjaG1lbnRzKSkgJiZcbiAgICAgICFpc0Rvd25sb2FkZWQoYXR0YWNobWVudHNbMF0pXG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBhdHRhY2htZW50c1swXTtcblxuICAgICAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZCh7IGF0dGFjaG1lbnQsIG1lc3NhZ2VJZDogaWQgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhaW1hZ2VCcm9rZW4gJiZcbiAgICAgIGF0dGFjaG1lbnRzICYmXG4gICAgICBhdHRhY2htZW50cy5sZW5ndGggPiAwICYmXG4gICAgICAhaXNBdHRhY2htZW50UGVuZGluZyAmJlxuICAgICAgY2FuRGlzcGxheUltYWdlKGF0dGFjaG1lbnRzKSAmJlxuICAgICAgKChpc0ltYWdlKGF0dGFjaG1lbnRzKSAmJiBoYXNJbWFnZShhdHRhY2htZW50cykpIHx8XG4gICAgICAgIChpc1ZpZGVvKGF0dGFjaG1lbnRzKSAmJiBoYXNWaWRlb1NjcmVlbnNob3QoYXR0YWNobWVudHMpKSlcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY29uc3QgYXR0YWNobWVudCA9IGF0dGFjaG1lbnRzWzBdO1xuXG4gICAgICBzaG93VmlzdWFsQXR0YWNobWVudCh7IGF0dGFjaG1lbnQsIG1lc3NhZ2VJZDogaWQgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhdHRhY2htZW50cyAmJlxuICAgICAgYXR0YWNobWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhaXNBdHRhY2htZW50UGVuZGluZyAmJlxuICAgICAgIWlzQXVkaW8oYXR0YWNobWVudHMpXG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMub3BlbkdlbmVyaWNBdHRhY2htZW50KCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhaXNBdHRhY2htZW50UGVuZGluZyAmJlxuICAgICAgaXNBdWRpbyhhdHRhY2htZW50cykgJiZcbiAgICAgIHRoaXMuYXVkaW9CdXR0b25SZWYgJiZcbiAgICAgIHRoaXMuYXVkaW9CdXR0b25SZWYuY3VycmVudFxuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICB0aGlzLmF1ZGlvQnV0dG9uUmVmLmN1cnJlbnQuY2xpY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29udGFjdCAmJiBjb250YWN0LmZpcnN0TnVtYmVyICYmIGNvbnRhY3QudXVpZCkge1xuICAgICAgc3RhcnRDb252ZXJzYXRpb24oY29udGFjdC5maXJzdE51bWJlciwgY29udGFjdC51dWlkKTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb250YWN0KSB7XG4gICAgICBjb25zdCBzaWduYWxBY2NvdW50ID1cbiAgICAgICAgY29udGFjdC5maXJzdE51bWJlciAmJiBjb250YWN0LnV1aWRcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6IGNvbnRhY3QuZmlyc3ROdW1iZXIsXG4gICAgICAgICAgICAgIHV1aWQ6IGNvbnRhY3QudXVpZCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIHNob3dDb250YWN0RGV0YWlsKHsgY29udGFjdCwgc2lnbmFsQWNjb3VudCB9KTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgb3BlbkdlbmVyaWNBdHRhY2htZW50ID0gKGV2ZW50PzogUmVhY3QuTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkLFxuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBkb3dubG9hZEF0dGFjaG1lbnQsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKCFhdHRhY2htZW50cyB8fCBhdHRhY2htZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2htZW50ID0gYXR0YWNobWVudHNbMF07XG4gICAgaWYgKCFpc0Rvd25sb2FkZWQoYXR0YWNobWVudCkpIHtcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQoe1xuICAgICAgICBhdHRhY2htZW50LFxuICAgICAgICBtZXNzYWdlSWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBmaWxlTmFtZSB9ID0gYXR0YWNobWVudDtcbiAgICBjb25zdCBpc0Rhbmdlcm91cyA9IGlzRmlsZURhbmdlcm91cyhmaWxlTmFtZSB8fCAnJyk7XG5cbiAgICBkb3dubG9hZEF0dGFjaG1lbnQoe1xuICAgICAgaXNEYW5nZXJvdXMsXG4gICAgICBhdHRhY2htZW50LFxuICAgICAgdGltZXN0YW1wLFxuICAgIH0pO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVLZXlEb3duID0gKGV2ZW50OiBSZWFjdC5LZXlib2FyZEV2ZW50PEhUTUxEaXZFbGVtZW50Pik6IHZvaWQgPT4ge1xuICAgIC8vIERvIG5vdCBhbGxvdyByZWFjdGlvbnMgdG8gZXJyb3IgbWVzc2FnZXNcbiAgICBjb25zdCB7IGNhblJlYWN0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qga2V5ID0gS2V5Ym9hcmRMYXlvdXQubG9va3VwKGV2ZW50Lm5hdGl2ZUV2ZW50KTtcblxuICAgIGlmIChcbiAgICAgIChrZXkgPT09ICdFJyB8fCBrZXkgPT09ICdlJykgJiZcbiAgICAgIChldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkpICYmXG4gICAgICBldmVudC5zaGlmdEtleSAmJlxuICAgICAgY2FuUmVhY3RcbiAgICApIHtcbiAgICAgIHRoaXMudG9nZ2xlUmVhY3Rpb25QaWNrZXIoKTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ICE9PSAnRW50ZXInICYmIGV2ZW50LmtleSAhPT0gJ1NwYWNlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlT3BlbihldmVudCk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCBjbGlja3Mgb24gYm9keSB0ZXh0IHRvIHJlc3VsdCBpbiB0aGUgJ2RlZmF1bHQgYWN0aW9uJyBmb3IgdGhlIG1lc3NhZ2VcbiAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVPcGVuKGV2ZW50KTtcbiAgfTtcblxuICBwdWJsaWMgcmVuZGVyQ29udGFpbmVyKCk6IEpTWC5FbGVtZW50IHtcbiAgICBjb25zdCB7XG4gICAgICBhdHRhY2htZW50cyxcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgICAgY3VzdG9tQ29sb3IsXG4gICAgICBkZWxldGVkRm9yRXZlcnlvbmUsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBnaWZ0QmFkZ2UsXG4gICAgICBpc1N0aWNrZXIsXG4gICAgICBpc1RhcFRvVmlldyxcbiAgICAgIGlzVGFwVG9WaWV3RXhwaXJlZCxcbiAgICAgIGlzVGFwVG9WaWV3RXJyb3IsXG4gICAgICB0ZXh0LFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaXNTZWxlY3RlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGlzQXR0YWNobWVudFBlbmRpbmcgPSB0aGlzLmlzQXR0YWNobWVudFBlbmRpbmcoKTtcblxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5nZXRXaWR0aCgpO1xuICAgIGNvbnN0IHNob3VsZFVzZVdpZHRoID0gQm9vbGVhbihnaWZ0QmFkZ2UgfHwgdGhpcy5pc1Nob3dpbmdJbWFnZSgpKTtcblxuICAgIGNvbnN0IGlzRW1vamlPbmx5ID0gdGhpcy5jYW5SZW5kZXJTdGlja2VyTGlrZUVtb2ppKCk7XG4gICAgY29uc3QgaXNTdGlja2VyTGlrZSA9IGlzU3RpY2tlciB8fCBpc0Vtb2ppT25seTtcblxuICAgIC8vIElmIGl0J3MgYSBtb3N0bHktbm9ybWFsIGdyYXkgaW5jb21pbmcgdGV4dCBib3gsIHdlIGRvbid0IHdhbnQgdG8gZGFya2VuIGl0IGFzIG11Y2hcbiAgICBjb25zdCBsaWdodGVyU2VsZWN0ID1cbiAgICAgIGlzU2VsZWN0ZWQgJiZcbiAgICAgIGRpcmVjdGlvbiA9PT0gJ2luY29taW5nJyAmJlxuICAgICAgIWlzU3RpY2tlckxpa2UgJiZcbiAgICAgICh0ZXh0IHx8ICghaXNWaWRlbyhhdHRhY2htZW50cykgJiYgIWlzSW1hZ2UoYXR0YWNobWVudHMpKSk7XG5cbiAgICBjb25zdCBjb250YWluZXJDbGFzc25hbWVzID0gY2xhc3NOYW1lcyhcbiAgICAgICdtb2R1bGUtbWVzc2FnZV9fY29udGFpbmVyJyxcbiAgICAgIGlzR0lGKGF0dGFjaG1lbnRzKSA/ICdtb2R1bGUtbWVzc2FnZV9fY29udGFpbmVyLS1naWYnIDogbnVsbCxcbiAgICAgIGlzU2VsZWN0ZWQgPyAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0tc2VsZWN0ZWQnIDogbnVsbCxcbiAgICAgIGxpZ2h0ZXJTZWxlY3QgPyAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0tc2VsZWN0ZWQtbGlnaHRlcicgOiBudWxsLFxuICAgICAgIWlzU3RpY2tlckxpa2UgPyBgbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0tJHtkaXJlY3Rpb259YCA6IG51bGwsXG4gICAgICBpc0Vtb2ppT25seSA/ICdtb2R1bGUtbWVzc2FnZV9fY29udGFpbmVyLS1lbW9qaScgOiBudWxsLFxuICAgICAgaXNUYXBUb1ZpZXcgPyAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0td2l0aC10YXAtdG8tdmlldycgOiBudWxsLFxuICAgICAgaXNUYXBUb1ZpZXcgJiYgaXNUYXBUb1ZpZXdFeHBpcmVkXG4gICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19jb250YWluZXItLXdpdGgtdGFwLXRvLXZpZXctZXhwaXJlZCdcbiAgICAgICAgOiBudWxsLFxuICAgICAgIWlzU3RpY2tlckxpa2UgJiYgZGlyZWN0aW9uID09PSAnb3V0Z29pbmcnXG4gICAgICAgID8gYG1vZHVsZS1tZXNzYWdlX19jb250YWluZXItLW91dGdvaW5nLSR7Y29udmVyc2F0aW9uQ29sb3J9YFxuICAgICAgICA6IG51bGwsXG4gICAgICBpc1RhcFRvVmlldyAmJiBpc0F0dGFjaG1lbnRQZW5kaW5nICYmICFpc1RhcFRvVmlld0V4cGlyZWRcbiAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0td2l0aC10YXAtdG8tdmlldy1wZW5kaW5nJ1xuICAgICAgICA6IG51bGwsXG4gICAgICBpc1RhcFRvVmlldyAmJiBpc0F0dGFjaG1lbnRQZW5kaW5nICYmICFpc1RhcFRvVmlld0V4cGlyZWRcbiAgICAgICAgPyBgbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0tJHtkaXJlY3Rpb259LSR7Y29udmVyc2F0aW9uQ29sb3J9LXRhcC10by12aWV3LXBlbmRpbmdgXG4gICAgICAgIDogbnVsbCxcbiAgICAgIGlzVGFwVG9WaWV3RXJyb3JcbiAgICAgICAgPyAnbW9kdWxlLW1lc3NhZ2VfX2NvbnRhaW5lci0td2l0aC10YXAtdG8tdmlldy1lcnJvcidcbiAgICAgICAgOiBudWxsLFxuICAgICAgdGhpcy5oYXNSZWFjdGlvbnMoKSA/ICdtb2R1bGUtbWVzc2FnZV9fY29udGFpbmVyLS13aXRoLXJlYWN0aW9ucycgOiBudWxsLFxuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lXG4gICAgICAgID8gJ21vZHVsZS1tZXNzYWdlX19jb250YWluZXItLWRlbGV0ZWQtZm9yLWV2ZXJ5b25lJ1xuICAgICAgICA6IG51bGxcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lclN0eWxlcyA9IHtcbiAgICAgIHdpZHRoOiBzaG91bGRVc2VXaWR0aCA/IHdpZHRoIDogdW5kZWZpbmVkLFxuICAgIH07XG4gICAgaWYgKCFpc1N0aWNrZXJMaWtlICYmICFkZWxldGVkRm9yRXZlcnlvbmUgJiYgZGlyZWN0aW9uID09PSAnb3V0Z29pbmcnKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGNvbnRhaW5lclN0eWxlcywgZ2V0Q3VzdG9tQ29sb3JTdHlsZShjdXN0b21Db2xvcikpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlX19jb250YWluZXItb3V0ZXJcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y29udGFpbmVyQ2xhc3NuYW1lc31cbiAgICAgICAgICBzdHlsZT17Y29udGFpbmVyU3R5bGVzfVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9e3RoaXMuc2hvd0NvbnRleHRNZW51fVxuICAgICAgICAgIHJvbGU9XCJyb3dcIlxuICAgICAgICAgIG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgdGFiSW5kZXg9ey0xfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyQXV0aG9yKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29udGVudHMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlclJlYWN0aW9ucyhkaXJlY3Rpb24gPT09ICdvdXRnb2luZycpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSByZW5kZXIoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7XG4gICAgICBhdXRob3IsXG4gICAgICBhdHRhY2htZW50cyxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGlkLFxuICAgICAgaXNTdGlja2VyLFxuICAgICAgc2hvdWxkQ29sbGFwc2VBYm92ZSxcbiAgICAgIHNob3VsZENvbGxhcHNlQmVsb3csXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBleHBpcmVkLCBleHBpcmluZywgaW1hZ2VCcm9rZW4sIGlzU2VsZWN0ZWQgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAvLyBUaGlzIGlkIGlzIHdoYXQgY29ubmVjdHMgb3VyIHRyaXBsZS1kb3QgY2xpY2sgd2l0aCBvdXIgYXNzb2NpYXRlZCBwb3AtdXAgbWVudS5cbiAgICAvLyAgIEl0IG5lZWRzIHRvIGJlIHVuaXF1ZS5cbiAgICBjb25zdCB0cmlnZ2VySWQgPSBTdHJpbmcoaWQgfHwgYCR7YXV0aG9yLmlkfS0ke3RpbWVzdGFtcH1gKTtcblxuICAgIGlmIChleHBpcmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoaXNTdGlja2VyICYmIChpbWFnZUJyb2tlbiB8fCAhYXR0YWNobWVudHMgfHwgIWF0dGFjaG1lbnRzLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAnbW9kdWxlLW1lc3NhZ2UnLFxuICAgICAgICAgIGBtb2R1bGUtbWVzc2FnZS0tJHtkaXJlY3Rpb259YCxcbiAgICAgICAgICBzaG91bGRDb2xsYXBzZUFib3ZlICYmICdtb2R1bGUtbWVzc2FnZS0tY29sbGFwc2VkLWFib3ZlJyxcbiAgICAgICAgICBzaG91bGRDb2xsYXBzZUJlbG93ICYmICdtb2R1bGUtbWVzc2FnZS0tY29sbGFwc2VkLWJlbG93JyxcbiAgICAgICAgICBpc1NlbGVjdGVkID8gJ21vZHVsZS1tZXNzYWdlLS1zZWxlY3RlZCcgOiBudWxsLFxuICAgICAgICAgIGV4cGlyaW5nID8gJ21vZHVsZS1tZXNzYWdlLS1leHBpcmVkJyA6IG51bGxcbiAgICAgICAgKX1cbiAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gaGF2ZSBhIHJvbGUgYmVjYXVzZSBzY3JlZW5yZWFkZXJzIG5lZWQgdG8gYmUgYWJsZSB0byBmb2N1cyBoZXJlIHRvXG4gICAgICAgIC8vICAgcmVhZCB0aGUgbWVzc2FnZSwgYnV0IHdlIGNhbid0IGJlIGEgYnV0dG9uOyB0aGF0IHdvdWxkIGJyZWFrIGlubmVyIGJ1dHRvbnMuXG4gICAgICAgIHJvbGU9XCJyb3dcIlxuICAgICAgICBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgb25Gb2N1cz17dGhpcy5oYW5kbGVGb2N1c31cbiAgICAgICAgcmVmPXt0aGlzLmZvY3VzUmVmfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5yZW5kZXJFcnJvcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJBdmF0YXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29udGFpbmVyKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlck1lbnUodHJpZ2dlcklkKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29udGV4dE1lbnUodHJpZ2dlcklkKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFrQjtBQUNsQix1QkFBdUM7QUFDdkMsd0JBQXVCO0FBQ3ZCLHVCQUF5QjtBQUN6QixvQkFBdUQ7QUFDdkQsK0JBQTBEO0FBQzFELDBCQUEyQztBQVUzQywrQkFBMkI7QUFDM0Isb0JBQW1DO0FBQ25DLDBCQUE2QjtBQUM3QixxQkFBd0I7QUFDeEIsaUNBR087QUFDUCw2QkFBZ0M7QUFDaEMsdUNBQTBDO0FBQzFDLHVCQUEwQjtBQUMxQixpQkFBb0I7QUFDcEIsbUJBQWlDO0FBQ2pDLHlCQUE0QjtBQUU1QixtQkFBc0I7QUFDdEIsNkJBQWdDO0FBRWhDLDRCQUErQjtBQUUvQixtQkFBc0I7QUFDdEIsNkJBQWdDO0FBRWhDLCtDQUFrRDtBQUNsRCxrQkFBZ0M7QUFDaEMsb0NBQXVDO0FBQ3ZDLFVBQXFCO0FBQ3JCLHFCQUFrQztBQUdsQyx3QkFhTztBQUdQLG1CQUE2QjtBQUM3Qixx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
