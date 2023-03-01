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
var Timeline_exports = {};
__export(Timeline_exports, {
  Timeline: () => Timeline
});
module.exports = __toCommonJS(Timeline_exports);
var import_lodash = require("lodash");
var import_classnames = __toESM(require("classnames"));
var import_react = __toESM(require("react"));
var import_reselect = require("reselect");
var import_react_measure = __toESM(require("react-measure"));
var import_ScrollDownButton = require("./ScrollDownButton");
var import_assert = require("../../util/assert");
var import_missingCaseError = require("../../util/missingCaseError");
var import_clearTimeoutIfNecessary = require("../../util/clearTimeoutIfNecessary");
var import_util = require("../_util");
var import_ErrorBoundary = require("./ErrorBoundary");
var import_Intl = require("../Intl");
var import_TimelineWarning = require("./TimelineWarning");
var import_TimelineWarnings = require("./TimelineWarnings");
var import_NewlyCreatedGroupInvitedContactsDialog = require("../NewlyCreatedGroupInvitedContactsDialog");
var import_contactSpoofing = require("../../util/contactSpoofing");
var import_groupMemberNameCollisions = require("../../util/groupMemberNameCollisions");
var import_TimelineFloatingHeader = require("./TimelineFloatingHeader");
var import_timelineUtil = require("../../util/timelineUtil");
var import_scrollUtil = require("../../util/scrollUtil");
var import_LastSeenIndicator = require("./LastSeenIndicator");
var import_durations = require("../../util/durations");
const AT_BOTTOM_THRESHOLD = 15;
const AT_BOTTOM_DETECTOR_STYLE = { height: AT_BOTTOM_THRESHOLD };
const MIN_ROW_HEIGHT = 18;
const SCROLL_DOWN_BUTTON_THRESHOLD = 8;
const LOAD_NEWER_THRESHOLD = 5;
const scrollToUnreadIndicator = Symbol("scrollToUnreadIndicator");
const getActions = (0, import_reselect.createSelector)((props) => props, (props) => {
  const unsafe = (0, import_lodash.pick)(props, [
    "acknowledgeGroupMemberNameCollisions",
    "blockGroupLinkRequests",
    "clearInvitedUuidsForNewlyCreatedGroup",
    "closeContactSpoofingReview",
    "setIsNearBottom",
    "reviewGroupMemberNameCollision",
    "reviewMessageRequestNameCollision",
    "learnMoreAboutDeliveryIssue",
    "loadOlderMessages",
    "loadNewerMessages",
    "loadNewestMessages",
    "markMessageRead",
    "markViewed",
    "onBlock",
    "onBlockAndReportSpam",
    "onDelete",
    "onUnblock",
    "peekGroupCallForTheFirstTime",
    "peekGroupCallIfItHasMembers",
    "removeMember",
    "selectMessage",
    "clearSelectedMessage",
    "unblurAvatar",
    "updateSharedGroups",
    "doubleCheckMissingQuoteReference",
    "checkForAccount",
    "reactToMessage",
    "replyToMessage",
    "retryDeleteForEveryone",
    "retrySend",
    "showForwardMessageModal",
    "deleteMessage",
    "deleteMessageForEveryone",
    "showMessageDetail",
    "openConversation",
    "openGiftBadge",
    "showContactDetail",
    "showContactModal",
    "kickOffAttachmentDownload",
    "markAttachmentAsCorrupted",
    "messageExpanded",
    "showVisualAttachment",
    "downloadAttachment",
    "displayTapToViewMessage",
    "openLink",
    "scrollToQuotedMessage",
    "showExpiredIncomingTapToViewToast",
    "showExpiredOutgoingTapToViewToast",
    "startConversation",
    "showIdentity",
    "downloadNewVersion",
    "contactSupport",
    "viewStory"
  ]);
  const safe = unsafe;
  return safe;
});
class Timeline extends import_react.default.Component {
  constructor() {
    super(...arguments);
    this.containerRef = import_react.default.createRef();
    this.messagesRef = import_react.default.createRef();
    this.atBottomDetectorRef = import_react.default.createRef();
    this.lastSeenIndicatorRef = import_react.default.createRef();
    this.maxVisibleRows = Math.ceil(window.innerHeight / MIN_ROW_HEIGHT);
    this.state = {
      hasRecentlyScrolled: true,
      hasDismissedDirectContactSpoofingWarning: false,
      lastMeasuredWarningHeight: 0,
      widthBreakpoint: import_util.WidthBreakpoint.Wide
    };
    this.onScroll = /* @__PURE__ */ __name(() => {
      this.setState((oldState) => oldState.hasRecentlyScrolled ? null : { hasRecentlyScrolled: true });
      (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.hasRecentlyScrolledTimeout);
      this.hasRecentlyScrolledTimeout = setTimeout(() => {
        this.setState({ hasRecentlyScrolled: false });
      }, 3e3);
    }, "onScroll");
    this.scrollToBottom = /* @__PURE__ */ __name((setFocus) => {
      const { selectMessage, id, items } = this.props;
      if (setFocus && items && items.length > 0) {
        const lastIndex = items.length - 1;
        const lastMessageId = items[lastIndex];
        selectMessage(lastMessageId, id);
      } else {
        const containerEl = this.containerRef.current;
        if (containerEl) {
          (0, import_scrollUtil.scrollToBottom)(containerEl);
        }
      }
    }, "scrollToBottom");
    this.onClickScrollDownButton = /* @__PURE__ */ __name(() => {
      this.scrollDown(false);
    }, "onClickScrollDownButton");
    this.scrollDown = /* @__PURE__ */ __name((setFocus) => {
      const {
        haveNewest,
        id,
        items,
        loadNewestMessages,
        messageLoadingState,
        oldestUnseenIndex,
        selectMessage
      } = this.props;
      const { newestBottomVisibleMessageId } = this.state;
      if (!items || items.length < 1) {
        return;
      }
      if (messageLoadingState) {
        this.scrollToBottom(setFocus);
        return;
      }
      if (newestBottomVisibleMessageId && (0, import_lodash.isNumber)(oldestUnseenIndex) && items.findIndex((item) => item === newestBottomVisibleMessageId) < oldestUnseenIndex) {
        if (setFocus) {
          const messageId = items[oldestUnseenIndex];
          selectMessage(messageId, id);
        } else {
          this.scrollToItemIndex(oldestUnseenIndex);
        }
      } else if (haveNewest) {
        this.scrollToBottom(setFocus);
      } else {
        const lastId = (0, import_lodash.last)(items);
        if (lastId) {
          loadNewestMessages(lastId, setFocus);
        }
      }
    }, "scrollDown");
    this.markNewestBottomVisibleMessageRead = (0, import_lodash.throttle)(() => {
      const { markMessageRead } = this.props;
      const { newestBottomVisibleMessageId } = this.state;
      if (newestBottomVisibleMessageId) {
        markMessageRead(newestBottomVisibleMessageId);
      }
    }, 500);
    this.handleBlur = /* @__PURE__ */ __name((event) => {
      const { clearSelectedMessage } = this.props;
      const { currentTarget } = event;
      setTimeout(() => {
        const portals = Array.from(document.querySelectorAll("body > div:not(.inbox)"));
        if (portals.some((el) => el.contains(document.activeElement))) {
          return;
        }
        if (!currentTarget.contains(document.activeElement)) {
          clearSelectedMessage();
        }
      }, 0);
    }, "handleBlur");
    this.handleKeyDown = /* @__PURE__ */ __name((event) => {
      const { selectMessage, selectedMessageId, items, id } = this.props;
      const commandKey = (0, import_lodash.get)(window, "platform") === "darwin" && event.metaKey;
      const controlKey = (0, import_lodash.get)(window, "platform") !== "darwin" && event.ctrlKey;
      const commandOrCtrl = commandKey || controlKey;
      if (!items || items.length < 1) {
        return;
      }
      if (selectedMessageId && !commandOrCtrl && event.key === "ArrowUp") {
        const selectedMessageIndex = items.findIndex((item) => item === selectedMessageId);
        if (selectedMessageIndex < 0) {
          return;
        }
        const targetIndex = selectedMessageIndex - 1;
        if (targetIndex < 0) {
          return;
        }
        const messageId = items[targetIndex];
        selectMessage(messageId, id);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (selectedMessageId && !commandOrCtrl && event.key === "ArrowDown") {
        const selectedMessageIndex = items.findIndex((item) => item === selectedMessageId);
        if (selectedMessageIndex < 0) {
          return;
        }
        const targetIndex = selectedMessageIndex + 1;
        if (targetIndex >= items.length) {
          return;
        }
        const messageId = items[targetIndex];
        selectMessage(messageId, id);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (commandOrCtrl && event.key === "ArrowUp") {
        const firstMessageId = (0, import_lodash.first)(items);
        if (firstMessageId) {
          selectMessage(firstMessageId, id);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      if (commandOrCtrl && event.key === "ArrowDown") {
        this.scrollDown(true);
        event.preventDefault();
        event.stopPropagation();
      }
    }, "handleKeyDown");
  }
  scrollToItemIndex(itemIndex) {
    this.messagesRef.current?.querySelector(`[data-item-index="${itemIndex}"]`)?.scrollIntoViewIfNeeded();
  }
  isAtBottom() {
    const containerEl = this.containerRef.current;
    if (!containerEl) {
      return false;
    }
    const isScrolledNearBottom = (0, import_scrollUtil.getScrollBottom)(containerEl) <= AT_BOTTOM_THRESHOLD;
    const hasScrollbars = containerEl.clientHeight < containerEl.scrollHeight;
    return isScrolledNearBottom || !hasScrollbars;
  }
  updateIntersectionObserver() {
    const containerEl = this.containerRef.current;
    const messagesEl = this.messagesRef.current;
    const atBottomDetectorEl = this.atBottomDetectorRef.current;
    if (!containerEl || !messagesEl || !atBottomDetectorEl) {
      return;
    }
    const {
      haveNewest,
      haveOldest,
      id,
      items,
      loadNewerMessages,
      loadOlderMessages,
      messageLoadingState,
      setIsNearBottom
    } = this.props;
    this.intersectionObserver?.disconnect();
    if (this.intersectionObserverCallbackFrame !== void 0) {
      window.cancelAnimationFrame(this.intersectionObserverCallbackFrame);
    }
    const intersectionRatios = /* @__PURE__ */ new Map();
    const intersectionObserverCallback = /* @__PURE__ */ __name((entries) => {
      entries.forEach((entry) => {
        intersectionRatios.set(entry.target, entry.intersectionRatio);
      });
      let newIsNearBottom = false;
      let oldestPartiallyVisible;
      let newestPartiallyVisible;
      let newestFullyVisible;
      for (const [element, intersectionRatio] of intersectionRatios) {
        if (intersectionRatio === 0) {
          continue;
        }
        if (element === atBottomDetectorEl) {
          newIsNearBottom = true;
        } else {
          oldestPartiallyVisible = oldestPartiallyVisible || element;
          newestPartiallyVisible = element;
          if (intersectionRatio === 1) {
            newestFullyVisible = element;
          }
        }
      }
      let newestBottomVisible;
      if (newestFullyVisible) {
        newestBottomVisible = newestFullyVisible;
      } else if (newIsNearBottom || newestPartiallyVisible !== oldestPartiallyVisible) {
        newestBottomVisible = oldestPartiallyVisible;
      }
      const oldestPartiallyVisibleMessageId = getMessageIdFromElement(oldestPartiallyVisible);
      const newestBottomVisibleMessageId = getMessageIdFromElement(newestBottomVisible);
      this.setState({
        oldestPartiallyVisibleMessageId,
        newestBottomVisibleMessageId
      });
      setIsNearBottom(id, newIsNearBottom);
      if (newestBottomVisibleMessageId) {
        this.markNewestBottomVisibleMessageRead();
        const rowIndex = getRowIndexFromElement(newestBottomVisible);
        const maxRowIndex = items.length - 1;
        if (!messageLoadingState && !haveNewest && (0, import_lodash.isNumber)(rowIndex) && maxRowIndex >= 0 && rowIndex >= maxRowIndex - LOAD_NEWER_THRESHOLD) {
          loadNewerMessages(newestBottomVisibleMessageId);
        }
      }
      if (!messageLoadingState && !haveOldest && oldestPartiallyVisibleMessageId && oldestPartiallyVisibleMessageId === items[0]) {
        loadOlderMessages(oldestPartiallyVisibleMessageId);
      }
    }, "intersectionObserverCallback");
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      (0, import_assert.assert)(this.intersectionObserver === observer, "observer.disconnect() should prevent callbacks from firing");
      this.intersectionObserverCallbackFrame = window.requestAnimationFrame(() => {
        if (this.intersectionObserver !== observer) {
          return;
        }
        intersectionObserverCallback(entries, observer);
      });
    }, {
      root: containerEl,
      threshold: [0, 1]
    });
    for (const child of messagesEl.children) {
      if (child.dataset.messageId) {
        this.intersectionObserver.observe(child);
      }
    }
    this.intersectionObserver.observe(atBottomDetectorEl);
  }
  componentDidMount() {
    const containerEl = this.containerRef.current;
    const messagesEl = this.messagesRef.current;
    const { isConversationSelected } = this.props;
    (0, import_assert.strictAssert)(containerEl && messagesEl || !isConversationSelected, "<Timeline> mounted without some refs");
    this.updateIntersectionObserver();
    window.SignalContext.activeWindowService.registerForActive(this.markNewestBottomVisibleMessageRead);
    this.delayedPeekTimeout = setTimeout(() => {
      const { id, peekGroupCallForTheFirstTime } = this.props;
      this.delayedPeekTimeout = void 0;
      peekGroupCallForTheFirstTime(id);
    }, 500);
    this.peekInterval = setInterval(() => {
      const { id, peekGroupCallIfItHasMembers } = this.props;
      peekGroupCallIfItHasMembers(id);
    }, import_durations.MINUTE);
  }
  componentWillUnmount() {
    const { delayedPeekTimeout, peekInterval } = this;
    window.SignalContext.activeWindowService.unregisterForActive(this.markNewestBottomVisibleMessageRead);
    this.intersectionObserver?.disconnect();
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(delayedPeekTimeout);
    if (peekInterval) {
      clearInterval(peekInterval);
    }
  }
  getSnapshotBeforeUpdate(prevProps) {
    const containerEl = this.containerRef.current;
    if (!containerEl) {
      return null;
    }
    const { props } = this;
    const { scrollToIndex } = props;
    const scrollAnchor = (0, import_timelineUtil.getScrollAnchorBeforeUpdate)(prevProps, props, this.isAtBottom());
    switch (scrollAnchor) {
      case import_timelineUtil.ScrollAnchor.ChangeNothing:
        return null;
      case import_timelineUtil.ScrollAnchor.ScrollToBottom:
        return { scrollBottom: 0 };
      case import_timelineUtil.ScrollAnchor.ScrollToIndex:
        if (scrollToIndex === void 0) {
          (0, import_assert.assert)(false, '<Timeline> got "scroll to index" scroll anchor, but no index');
          return null;
        }
        return { scrollToIndex };
      case import_timelineUtil.ScrollAnchor.ScrollToUnreadIndicator:
        return scrollToUnreadIndicator;
      case import_timelineUtil.ScrollAnchor.Top:
        return { scrollTop: containerEl.scrollTop };
      case import_timelineUtil.ScrollAnchor.Bottom:
        return { scrollBottom: (0, import_scrollUtil.getScrollBottom)(containerEl) };
      default:
        throw (0, import_missingCaseError.missingCaseError)(scrollAnchor);
    }
  }
  componentDidUpdate(prevProps, _prevState, snapshot) {
    const {
      items: oldItems,
      messageChangeCounter: previousMessageChangeCounter,
      messageLoadingState: previousMessageLoadingState
    } = prevProps;
    const {
      discardMessages,
      id,
      items: newItems,
      messageChangeCounter,
      messageLoadingState
    } = this.props;
    const containerEl = this.containerRef.current;
    if (containerEl && snapshot) {
      if (snapshot === scrollToUnreadIndicator) {
        const lastSeenIndicatorEl = this.lastSeenIndicatorRef.current;
        if (lastSeenIndicatorEl) {
          lastSeenIndicatorEl.scrollIntoView();
        } else {
          (0, import_scrollUtil.scrollToBottom)(containerEl);
          (0, import_assert.assert)(false, "<Timeline> expected a last seen indicator but it was not found");
        }
      } else if ("scrollToIndex" in snapshot) {
        this.scrollToItemIndex(snapshot.scrollToIndex);
      } else if ("scrollTop" in snapshot) {
        containerEl.scrollTop = snapshot.scrollTop;
      } else {
        (0, import_scrollUtil.setScrollBottom)(containerEl, snapshot.scrollBottom);
      }
    }
    if (oldItems.length !== newItems.length) {
      this.updateIntersectionObserver();
      const numberToKeepAtBottom = this.maxVisibleRows * 2;
      const shouldDiscardOlderMessages = this.isAtBottom() && newItems.length > numberToKeepAtBottom;
      if (shouldDiscardOlderMessages) {
        discardMessages({
          conversationId: id,
          numberToKeepAtBottom
        });
      }
      const loadingStateThatJustFinished = !messageLoadingState && previousMessageLoadingState ? previousMessageLoadingState : void 0;
      const numberToKeepAtTop = this.maxVisibleRows * 5;
      const shouldDiscardNewerMessages = !this.isAtBottom() && loadingStateThatJustFinished === import_timelineUtil.TimelineMessageLoadingState.LoadingOlderMessages && newItems.length > numberToKeepAtTop;
      if (shouldDiscardNewerMessages) {
        discardMessages({
          conversationId: id,
          numberToKeepAtTop
        });
      }
    }
    if (previousMessageChangeCounter !== messageChangeCounter) {
      this.markNewestBottomVisibleMessageRead();
    }
  }
  render() {
    const {
      acknowledgeGroupMemberNameCollisions,
      clearInvitedUuidsForNewlyCreatedGroup,
      closeContactSpoofingReview,
      contactSpoofingReview,
      getPreferredBadge,
      getTimestampForMessage,
      haveNewest,
      haveOldest,
      i18n,
      id,
      invitedContactsForNewlyCreatedGroup,
      isConversationSelected,
      isGroupV1AndDisabled,
      isSomeoneTyping,
      items,
      messageLoadingState,
      oldestUnseenIndex,
      onBlock,
      onBlockAndReportSpam,
      onDelete,
      onUnblock,
      removeMember,
      renderHeroRow,
      renderItem,
      renderTypingBubble,
      renderContactSpoofingReviewDialog,
      reviewGroupMemberNameCollision,
      reviewMessageRequestNameCollision,
      showContactModal,
      theme,
      totalUnseen,
      unblurAvatar,
      unreadCount,
      updateSharedGroups
    } = this.props;
    const {
      hasRecentlyScrolled,
      lastMeasuredWarningHeight,
      newestBottomVisibleMessageId,
      oldestPartiallyVisibleMessageId,
      widthBreakpoint
    } = this.state;
    if (!isConversationSelected) {
      return null;
    }
    const areThereAnyMessages = items.length > 0;
    const areAnyMessagesUnread = Boolean(unreadCount);
    const areAnyMessagesBelowCurrentPosition = !haveNewest || Boolean(newestBottomVisibleMessageId && newestBottomVisibleMessageId !== (0, import_lodash.last)(items));
    const areSomeMessagesBelowCurrentPosition = !haveNewest || newestBottomVisibleMessageId && !items.slice(-SCROLL_DOWN_BUTTON_THRESHOLD).includes(newestBottomVisibleMessageId);
    const areUnreadBelowCurrentPosition = Boolean(areThereAnyMessages && areAnyMessagesUnread && areAnyMessagesBelowCurrentPosition);
    const shouldShowScrollDownButton = Boolean(areThereAnyMessages && (areUnreadBelowCurrentPosition || areSomeMessagesBelowCurrentPosition));
    const actionProps = getActions(this.props);
    let floatingHeader;
    const oldestPartiallyVisibleMessageTimestamp = oldestPartiallyVisibleMessageId ? getTimestampForMessage(oldestPartiallyVisibleMessageId) : void 0;
    if (oldestPartiallyVisibleMessageId && oldestPartiallyVisibleMessageTimestamp) {
      const isLoadingMessages = Boolean(messageLoadingState);
      floatingHeader = /* @__PURE__ */ import_react.default.createElement(import_TimelineFloatingHeader.TimelineFloatingHeader, {
        i18n,
        isLoading: isLoadingMessages,
        style: lastMeasuredWarningHeight ? { marginTop: lastMeasuredWarningHeight } : void 0,
        timestamp: oldestPartiallyVisibleMessageTimestamp,
        visible: (hasRecentlyScrolled || isLoadingMessages) && (!haveOldest || oldestPartiallyVisibleMessageId !== items[0])
      });
    }
    const messageNodes = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      const previousItemIndex = itemIndex - 1;
      const nextItemIndex = itemIndex + 1;
      const previousMessageId = items[previousItemIndex];
      const nextMessageId = items[nextItemIndex];
      const messageId = items[itemIndex];
      if (!messageId) {
        (0, import_assert.assert)(false, "<Timeline> iterated through items and got an empty message ID");
        continue;
      }
      let unreadIndicatorPlacement;
      if (oldestUnseenIndex === itemIndex) {
        unreadIndicatorPlacement = import_timelineUtil.UnreadIndicatorPlacement.JustAbove;
        messageNodes.push(/* @__PURE__ */ import_react.default.createElement(import_LastSeenIndicator.LastSeenIndicator, {
          key: "last seen indicator",
          count: totalUnseen,
          i18n,
          ref: this.lastSeenIndicatorRef
        }));
      } else if (oldestUnseenIndex === nextItemIndex) {
        unreadIndicatorPlacement = import_timelineUtil.UnreadIndicatorPlacement.JustBelow;
      }
      messageNodes.push(/* @__PURE__ */ import_react.default.createElement("div", {
        key: messageId,
        "data-item-index": itemIndex,
        "data-message-id": messageId
      }, /* @__PURE__ */ import_react.default.createElement(import_ErrorBoundary.ErrorBoundary, {
        i18n,
        showDebugLog
      }, renderItem({
        actionProps,
        containerElementRef: this.containerRef,
        containerWidthBreakpoint: widthBreakpoint,
        conversationId: id,
        isOldestTimelineItem: haveOldest && itemIndex === 0,
        messageId,
        nextMessageId,
        previousMessageId,
        unreadIndicatorPlacement
      }))));
    }
    const warning = Timeline.getWarning(this.props, this.state);
    let timelineWarning;
    if (warning) {
      let text;
      let onClose;
      switch (warning.type) {
        case import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle:
          text = /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
            i18n,
            id: "ContactSpoofing__same-name",
            components: {
              link: /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning.Link, {
                onClick: () => {
                  reviewMessageRequestNameCollision({
                    safeConversationId: warning.safeConversation.id
                  });
                }
              }, i18n("ContactSpoofing__same-name__link"))
            }
          });
          onClose = /* @__PURE__ */ __name(() => {
            this.setState({
              hasDismissedDirectContactSpoofingWarning: true
            });
          }, "onClose");
          break;
        case import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle: {
          const { groupNameCollisions } = warning;
          text = /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
            i18n,
            id: "ContactSpoofing__same-name-in-group",
            components: {
              count: Object.values(groupNameCollisions).reduce((result, conversations) => result + conversations.length, 0).toString(),
              link: /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning.Link, {
                onClick: () => {
                  reviewGroupMemberNameCollision(id);
                }
              }, i18n("ContactSpoofing__same-name-in-group__link"))
            }
          });
          onClose = /* @__PURE__ */ __name(() => {
            acknowledgeGroupMemberNameCollisions(groupNameCollisions);
          }, "onClose");
          break;
        }
        default:
          throw (0, import_missingCaseError.missingCaseError)(warning);
      }
      timelineWarning = /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
        bounds: true,
        onResize: ({ bounds }) => {
          if (!bounds) {
            (0, import_assert.assert)(false, "We should be measuring the bounds");
            return;
          }
          this.setState({ lastMeasuredWarningHeight: bounds.height });
        }
      }, ({ measureRef }) => /* @__PURE__ */ import_react.default.createElement(import_TimelineWarnings.TimelineWarnings, {
        ref: measureRef
      }, /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning, {
        i18n,
        onClose
      }, /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning.IconContainer, null, /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning.GenericIcon, null)), /* @__PURE__ */ import_react.default.createElement(import_TimelineWarning.TimelineWarning.Text, null, text))));
    }
    let contactSpoofingReviewDialog;
    if (contactSpoofingReview) {
      const commonProps = {
        getPreferredBadge,
        i18n,
        onBlock,
        onBlockAndReportSpam,
        onClose: closeContactSpoofingReview,
        onDelete,
        onShowContactModal: showContactModal,
        onUnblock,
        removeMember,
        theme
      };
      switch (contactSpoofingReview.type) {
        case import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle:
          contactSpoofingReviewDialog = renderContactSpoofingReviewDialog({
            ...commonProps,
            type: import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle,
            possiblyUnsafeConversation: contactSpoofingReview.possiblyUnsafeConversation,
            safeConversation: contactSpoofingReview.safeConversation
          });
          break;
        case import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle:
          contactSpoofingReviewDialog = renderContactSpoofingReviewDialog({
            ...commonProps,
            type: import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle,
            groupConversationId: id,
            collisionInfoByTitle: contactSpoofingReview.collisionInfoByTitle
          });
          break;
        default:
          throw (0, import_missingCaseError.missingCaseError)(contactSpoofingReview);
      }
    }
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
      bounds: true,
      onResize: ({ bounds }) => {
        const { isNearBottom } = this.props;
        (0, import_assert.strictAssert)(bounds, "We should be measuring the bounds");
        this.setState({
          widthBreakpoint: (0, import_timelineUtil.getWidthBreakpoint)(bounds.width)
        });
        this.maxVisibleRows = Math.ceil(bounds.height / MIN_ROW_HEIGHT);
        const containerEl = this.containerRef.current;
        if (containerEl && isNearBottom) {
          (0, import_scrollUtil.scrollToBottom)(containerEl);
        }
      }
    }, ({ measureRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-timeline", isGroupV1AndDisabled ? "module-timeline--disabled" : null, `module-timeline--width-${widthBreakpoint}`),
      role: "presentation",
      tabIndex: -1,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown,
      ref: measureRef
    }, timelineWarning, floatingHeader, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-timeline__messages__container",
      onScroll: this.onScroll,
      ref: this.containerRef
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-timeline__messages", haveNewest && "module-timeline__messages--have-newest", haveOldest && "module-timeline__messages--have-oldest"),
      ref: this.messagesRef
    }, haveOldest && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, Timeline.getWarning(this.props, this.state) && /* @__PURE__ */ import_react.default.createElement("div", {
      style: { height: lastMeasuredWarningHeight }
    }), renderHeroRow(id, unblurAvatar, updateSharedGroups)), messageNodes, isSomeoneTyping && haveNewest && renderTypingBubble(id), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-timeline__messages__at-bottom-detector",
      ref: this.atBottomDetectorRef,
      style: AT_BOTTOM_DETECTOR_STYLE
    }))), shouldShowScrollDownButton ? /* @__PURE__ */ import_react.default.createElement(import_ScrollDownButton.ScrollDownButton, {
      conversationId: id,
      unreadCount: areUnreadBelowCurrentPosition ? unreadCount : 0,
      scrollDown: this.onClickScrollDownButton,
      i18n
    }) : null)), Boolean(invitedContactsForNewlyCreatedGroup.length) && /* @__PURE__ */ import_react.default.createElement(import_NewlyCreatedGroupInvitedContactsDialog.NewlyCreatedGroupInvitedContactsDialog, {
      contacts: invitedContactsForNewlyCreatedGroup,
      getPreferredBadge,
      i18n,
      onClose: clearInvitedUuidsForNewlyCreatedGroup,
      theme
    }), contactSpoofingReviewDialog);
  }
  static getWarning({ warning }, state) {
    if (!warning) {
      return void 0;
    }
    switch (warning.type) {
      case import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle: {
        const { hasDismissedDirectContactSpoofingWarning } = state;
        return hasDismissedDirectContactSpoofingWarning ? void 0 : warning;
      }
      case import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle:
        return (0, import_groupMemberNameCollisions.hasUnacknowledgedCollisions)(warning.acknowledgedGroupNameCollisions, warning.groupNameCollisions) ? warning : void 0;
      default:
        throw (0, import_missingCaseError.missingCaseError)(warning);
    }
  }
}
function getMessageIdFromElement(element) {
  return element instanceof HTMLElement ? element.dataset.messageId : void 0;
}
function getRowIndexFromElement(element) {
  return element instanceof HTMLElement && element.dataset.itemIndex ? parseInt(element.dataset.itemIndex, 10) : void 0;
}
function showDebugLog() {
  window.showDebugLog();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Timeline
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGltZWxpbmUudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgZmlyc3QsIGdldCwgaXNOdW1iZXIsIGxhc3QsIHBpY2ssIHRocm90dGxlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHR5cGUgeyBSZWFjdENoaWxkLCBSZWFjdE5vZGUsIFJlZk9iamVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBNZWFzdXJlIGZyb20gJ3JlYWN0LW1lYXN1cmUnO1xuXG5pbXBvcnQgeyBTY3JvbGxEb3duQnV0dG9uIH0gZnJvbSAnLi9TY3JvbGxEb3duQnV0dG9uJztcblxuaW1wb3J0IHR5cGUgeyBBc3NlcnRQcm9wcywgTG9jYWxpemVyVHlwZSwgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgeyBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSB9IGZyb20gJy4uLy4uL3V0aWwvY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnknO1xuaW1wb3J0IHsgV2lkdGhCcmVha3BvaW50IH0gZnJvbSAnLi4vX3V0aWwnO1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzQWN0aW9ucyBhcyBNZXNzYWdlQWN0aW9uc1R5cGUgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHR5cGUgeyBQcm9wc0FjdGlvbnMgYXMgVW5zdXBwb3J0ZWRNZXNzYWdlQWN0aW9uc1R5cGUgfSBmcm9tICcuL1Vuc3VwcG9ydGVkTWVzc2FnZSc7XG5pbXBvcnQgdHlwZSB7IFByb3BzQWN0aW9uc1R5cGUgYXMgQ2hhdFNlc3Npb25SZWZyZXNoZWROb3RpZmljYXRpb25BY3Rpb25zVHlwZSB9IGZyb20gJy4vQ2hhdFNlc3Npb25SZWZyZXNoZWROb3RpZmljYXRpb24nO1xuaW1wb3J0IHR5cGUgeyBQcm9wc0FjdGlvbnNUeXBlIGFzIEdyb3VwVjJDaGFuZ2VBY3Rpb25zVHlwZSB9IGZyb20gJy4vR3JvdXBWMkNoYW5nZSc7XG5pbXBvcnQgeyBFcnJvckJvdW5kYXJ5IH0gZnJvbSAnLi9FcnJvckJvdW5kYXJ5JztcbmltcG9ydCB0eXBlIHsgUHJvcHNBY3Rpb25zIGFzIFNhZmV0eU51bWJlckFjdGlvbnNUeXBlIH0gZnJvbSAnLi9TYWZldHlOdW1iZXJOb3RpZmljYXRpb24nO1xuaW1wb3J0IHsgSW50bCB9IGZyb20gJy4uL0ludGwnO1xuaW1wb3J0IHsgVGltZWxpbmVXYXJuaW5nIH0gZnJvbSAnLi9UaW1lbGluZVdhcm5pbmcnO1xuaW1wb3J0IHsgVGltZWxpbmVXYXJuaW5ncyB9IGZyb20gJy4vVGltZWxpbmVXYXJuaW5ncyc7XG5pbXBvcnQgeyBOZXdseUNyZWF0ZWRHcm91cEludml0ZWRDb250YWN0c0RpYWxvZyB9IGZyb20gJy4uL05ld2x5Q3JlYXRlZEdyb3VwSW52aXRlZENvbnRhY3RzRGlhbG9nJztcbmltcG9ydCB7IENvbnRhY3RTcG9vZmluZ1R5cGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnRhY3RTcG9vZmluZyc7XG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSBhcyBTbWFydENvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZ1Byb3BzVHlwZSB9IGZyb20gJy4uLy4uL3N0YXRlL3NtYXJ0L0NvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZyc7XG5pbXBvcnQgdHlwZSB7IEdyb3VwTmFtZUNvbGxpc2lvbnNXaXRoSWRzQnlUaXRsZSB9IGZyb20gJy4uLy4uL3V0aWwvZ3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9ucyc7XG5pbXBvcnQgeyBoYXNVbmFja25vd2xlZGdlZENvbGxpc2lvbnMgfSBmcm9tICcuLi8uLi91dGlsL2dyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbnMnO1xuaW1wb3J0IHsgVGltZWxpbmVGbG9hdGluZ0hlYWRlciB9IGZyb20gJy4vVGltZWxpbmVGbG9hdGluZ0hlYWRlcic7XG5pbXBvcnQge1xuICBnZXRTY3JvbGxBbmNob3JCZWZvcmVVcGRhdGUsXG4gIGdldFdpZHRoQnJlYWtwb2ludCxcbiAgU2Nyb2xsQW5jaG9yLFxuICBUaW1lbGluZU1lc3NhZ2VMb2FkaW5nU3RhdGUsXG4gIFVucmVhZEluZGljYXRvclBsYWNlbWVudCxcbn0gZnJvbSAnLi4vLi4vdXRpbC90aW1lbGluZVV0aWwnO1xuaW1wb3J0IHtcbiAgZ2V0U2Nyb2xsQm90dG9tLFxuICBzY3JvbGxUb0JvdHRvbSxcbiAgc2V0U2Nyb2xsQm90dG9tLFxufSBmcm9tICcuLi8uLi91dGlsL3Njcm9sbFV0aWwnO1xuaW1wb3J0IHsgTGFzdFNlZW5JbmRpY2F0b3IgfSBmcm9tICcuL0xhc3RTZWVuSW5kaWNhdG9yJztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcblxuY29uc3QgQVRfQk9UVE9NX1RIUkVTSE9MRCA9IDE1O1xuY29uc3QgQVRfQk9UVE9NX0RFVEVDVE9SX1NUWUxFID0geyBoZWlnaHQ6IEFUX0JPVFRPTV9USFJFU0hPTEQgfTtcblxuY29uc3QgTUlOX1JPV19IRUlHSFQgPSAxODtcbmNvbnN0IFNDUk9MTF9ET1dOX0JVVFRPTl9USFJFU0hPTEQgPSA4O1xuY29uc3QgTE9BRF9ORVdFUl9USFJFU0hPTEQgPSA1O1xuXG5leHBvcnQgdHlwZSBXYXJuaW5nVHlwZSA9XG4gIHwge1xuICAgICAgdHlwZTogQ29udGFjdFNwb29maW5nVHlwZS5EaXJlY3RDb252ZXJzYXRpb25XaXRoU2FtZVRpdGxlO1xuICAgICAgc2FmZUNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZTtcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTogQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGU7XG4gICAgICBhY2tub3dsZWRnZWRHcm91cE5hbWVDb2xsaXNpb25zOiBHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGU7XG4gICAgICBncm91cE5hbWVDb2xsaXNpb25zOiBHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGU7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgQ29udGFjdFNwb29maW5nUmV2aWV3UHJvcFR5cGUgPVxuICB8IHtcbiAgICAgIHR5cGU6IENvbnRhY3RTcG9vZmluZ1R5cGUuRGlyZWN0Q29udmVyc2F0aW9uV2l0aFNhbWVUaXRsZTtcbiAgICAgIHBvc3NpYmx5VW5zYWZlQ29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25UeXBlO1xuICAgICAgc2FmZUNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZTtcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTogQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGU7XG4gICAgICBjb2xsaXNpb25JbmZvQnlUaXRsZTogUmVjb3JkPFxuICAgICAgICBzdHJpbmcsXG4gICAgICAgIEFycmF5PHtcbiAgICAgICAgICBvbGROYW1lPzogc3RyaW5nO1xuICAgICAgICAgIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZTtcbiAgICAgICAgfT5cbiAgICAgID47XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgUHJvcHNEYXRhVHlwZSA9IHtcbiAgaGF2ZU5ld2VzdDogYm9vbGVhbjtcbiAgaGF2ZU9sZGVzdDogYm9vbGVhbjtcbiAgbWVzc2FnZUNoYW5nZUNvdW50ZXI6IG51bWJlcjtcbiAgbWVzc2FnZUxvYWRpbmdTdGF0ZT86IFRpbWVsaW5lTWVzc2FnZUxvYWRpbmdTdGF0ZTtcbiAgaXNOZWFyQm90dG9tPzogYm9vbGVhbjtcbiAgaXRlbXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgb2xkZXN0VW5zZWVuSW5kZXg/OiBudW1iZXI7XG4gIHNjcm9sbFRvSW5kZXg/OiBudW1iZXI7XG4gIHNjcm9sbFRvSW5kZXhDb3VudGVyOiBudW1iZXI7XG4gIHRvdGFsVW5zZWVuOiBudW1iZXI7XG59O1xuXG50eXBlIFByb3BzSG91c2VrZWVwaW5nVHlwZSA9IHtcbiAgaWQ6IHN0cmluZztcbiAgaXNDb252ZXJzYXRpb25TZWxlY3RlZDogYm9vbGVhbjtcbiAgaXNHcm91cFYxQW5kRGlzYWJsZWQ/OiBib29sZWFuO1xuICBpc0luY29taW5nTWVzc2FnZVJlcXVlc3Q6IGJvb2xlYW47XG4gIGlzU29tZW9uZVR5cGluZzogYm9vbGVhbjtcbiAgdW5yZWFkQ291bnQ/OiBudW1iZXI7XG5cbiAgc2VsZWN0ZWRNZXNzYWdlSWQ/OiBzdHJpbmc7XG4gIGludml0ZWRDb250YWN0c0Zvck5ld2x5Q3JlYXRlZEdyb3VwOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcblxuICB3YXJuaW5nPzogV2FybmluZ1R5cGU7XG4gIGNvbnRhY3RTcG9vZmluZ1Jldmlldz86IENvbnRhY3RTcG9vZmluZ1Jldmlld1Byb3BUeXBlO1xuXG4gIGRpc2NhcmRNZXNzYWdlczogKFxuICAgIF86IFJlYWRvbmx5PFxuICAgICAgfCB7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICAgICAgICBudW1iZXJUb0tlZXBBdEJvdHRvbTogbnVtYmVyO1xuICAgICAgICB9XG4gICAgICB8IHsgY29udmVyc2F0aW9uSWQ6IHN0cmluZzsgbnVtYmVyVG9LZWVwQXRUb3A6IG51bWJlciB9XG4gICAgPlxuICApID0+IHZvaWQ7XG4gIGdldFRpbWVzdGFtcEZvck1lc3NhZ2U6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdW5kZWZpbmVkIHwgbnVtYmVyO1xuICBnZXRQcmVmZXJyZWRCYWRnZTogUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGU7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIHRoZW1lOiBUaGVtZVR5cGU7XG5cbiAgcmVuZGVySXRlbTogKHByb3BzOiB7XG4gICAgYWN0aW9uUHJvcHM6IFByb3BzQWN0aW9uc1R5cGU7XG4gICAgY29udGFpbmVyRWxlbWVudFJlZjogUmVmT2JqZWN0PEhUTUxFbGVtZW50PjtcbiAgICBjb250YWluZXJXaWR0aEJyZWFrcG9pbnQ6IFdpZHRoQnJlYWtwb2ludDtcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICAgIGlzT2xkZXN0VGltZWxpbmVJdGVtOiBib29sZWFuO1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIG5leHRNZXNzYWdlSWQ6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgICBwcmV2aW91c01lc3NhZ2VJZDogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICAgIHVucmVhZEluZGljYXRvclBsYWNlbWVudDogdW5kZWZpbmVkIHwgVW5yZWFkSW5kaWNhdG9yUGxhY2VtZW50O1xuICB9KSA9PiBKU1guRWxlbWVudDtcbiAgcmVuZGVySGVyb1JvdzogKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdW5ibHVyQXZhdGFyOiAoKSA9PiB2b2lkLFxuICAgIHVwZGF0ZVNoYXJlZEdyb3VwczogKCkgPT4gdW5rbm93blxuICApID0+IEpTWC5FbGVtZW50O1xuICByZW5kZXJUeXBpbmdCdWJibGU6IChpZDogc3RyaW5nKSA9PiBKU1guRWxlbWVudDtcbiAgcmVuZGVyQ29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nOiAoXG4gICAgcHJvcHM6IFNtYXJ0Q29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nUHJvcHNUeXBlXG4gICkgPT4gSlNYLkVsZW1lbnQ7XG59O1xuXG5leHBvcnQgdHlwZSBQcm9wc0FjdGlvbnNUeXBlID0ge1xuICBhY2tub3dsZWRnZUdyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbnM6IChcbiAgICBncm91cE5hbWVDb2xsaXNpb25zOiBSZWFkb25seTxHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGU+XG4gICkgPT4gdm9pZDtcbiAgY2xlYXJJbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cDogKCkgPT4gdm9pZDtcbiAgY2xvc2VDb250YWN0U3Bvb2ZpbmdSZXZpZXc6ICgpID0+IHZvaWQ7XG4gIHNldElzTmVhckJvdHRvbTogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsIGlzTmVhckJvdHRvbTogYm9vbGVhbikgPT4gdW5rbm93bjtcbiAgcmV2aWV3R3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uOiAoZ3JvdXBDb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB2b2lkO1xuICByZXZpZXdNZXNzYWdlUmVxdWVzdE5hbWVDb2xsaXNpb246IChcbiAgICBfOiBSZWFkb25seTx7XG4gICAgICBzYWZlQ29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICB9PlxuICApID0+IHZvaWQ7XG5cbiAgbGVhcm5Nb3JlQWJvdXREZWxpdmVyeUlzc3VlOiAoKSA9PiB1bmtub3duO1xuICBsb2FkT2xkZXJNZXNzYWdlczogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBsb2FkTmV3ZXJNZXNzYWdlczogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBsb2FkTmV3ZXN0TWVzc2FnZXM6IChtZXNzYWdlSWQ6IHN0cmluZywgc2V0Rm9jdXM/OiBib29sZWFuKSA9PiB1bmtub3duO1xuICBtYXJrTWVzc2FnZVJlYWQ6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb25CbG9jazogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG9uQmxvY2tBbmRSZXBvcnRTcGFtOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb25EZWxldGU6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBvblVuYmxvY2s6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcGVla0dyb3VwQ2FsbElmSXRIYXNNZW1iZXJzOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcmVtb3ZlTWVtYmVyOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgc2VsZWN0TWVzc2FnZTogKG1lc3NhZ2VJZDogc3RyaW5nLCBjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBjbGVhclNlbGVjdGVkTWVzc2FnZTogKCkgPT4gdW5rbm93bjtcbiAgdW5ibHVyQXZhdGFyOiAoKSA9PiB2b2lkO1xuICB1cGRhdGVTaGFyZWRHcm91cHM6ICgpID0+IHVua25vd247XG59ICYgTWVzc2FnZUFjdGlvbnNUeXBlICZcbiAgU2FmZXR5TnVtYmVyQWN0aW9uc1R5cGUgJlxuICBVbnN1cHBvcnRlZE1lc3NhZ2VBY3Rpb25zVHlwZSAmXG4gIEdyb3VwVjJDaGFuZ2VBY3Rpb25zVHlwZSAmXG4gIENoYXRTZXNzaW9uUmVmcmVzaGVkTm90aWZpY2F0aW9uQWN0aW9uc1R5cGU7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IFByb3BzRGF0YVR5cGUgJlxuICBQcm9wc0hvdXNla2VlcGluZ1R5cGUgJlxuICBQcm9wc0FjdGlvbnNUeXBlO1xuXG50eXBlIFN0YXRlVHlwZSA9IHtcbiAgaGFzRGlzbWlzc2VkRGlyZWN0Q29udGFjdFNwb29maW5nV2FybmluZzogYm9vbGVhbjtcbiAgaGFzUmVjZW50bHlTY3JvbGxlZDogYm9vbGVhbjtcbiAgbGFzdE1lYXN1cmVkV2FybmluZ0hlaWdodDogbnVtYmVyO1xuICBuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkPzogc3RyaW5nO1xuICBvbGRlc3RQYXJ0aWFsbHlWaXNpYmxlTWVzc2FnZUlkPzogc3RyaW5nO1xuICB3aWR0aEJyZWFrcG9pbnQ6IFdpZHRoQnJlYWtwb2ludDtcbn07XG5cbmNvbnN0IHNjcm9sbFRvVW5yZWFkSW5kaWNhdG9yID0gU3ltYm9sKCdzY3JvbGxUb1VucmVhZEluZGljYXRvcicpO1xuXG50eXBlIFNuYXBzaG90VHlwZSA9XG4gIHwgbnVsbFxuICB8IHR5cGVvZiBzY3JvbGxUb1VucmVhZEluZGljYXRvclxuICB8IHsgc2Nyb2xsVG9JbmRleDogbnVtYmVyIH1cbiAgfCB7IHNjcm9sbFRvcDogbnVtYmVyIH1cbiAgfCB7IHNjcm9sbEJvdHRvbTogbnVtYmVyIH07XG5cbmNvbnN0IGdldEFjdGlvbnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgLy8gSXQgaXMgZXhwZW5zaXZlIHRvIHBpY2sgc28gbWFueSBwcm9wZXJ0aWVzIG91dCBvZiB0aGUgYHByb3BzYCBvYmplY3Qgc28gd2VcbiAgLy8gdXNlIGBjcmVhdGVTZWxlY3RvcmAgdG8gbWVtb2l6ZSB0aGVtIGJ5IHRoZSBsYXN0IHNlZW4gYHByb3BzYCBvYmplY3QuXG4gIChwcm9wczogUHJvcHNUeXBlKSA9PiBwcm9wcyxcblxuICAocHJvcHM6IFByb3BzVHlwZSk6IFByb3BzQWN0aW9uc1R5cGUgPT4ge1xuICAgIGNvbnN0IHVuc2FmZSA9IHBpY2socHJvcHMsIFtcbiAgICAgICdhY2tub3dsZWRnZUdyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbnMnLFxuICAgICAgJ2Jsb2NrR3JvdXBMaW5rUmVxdWVzdHMnLFxuICAgICAgJ2NsZWFySW52aXRlZFV1aWRzRm9yTmV3bHlDcmVhdGVkR3JvdXAnLFxuICAgICAgJ2Nsb3NlQ29udGFjdFNwb29maW5nUmV2aWV3JyxcbiAgICAgICdzZXRJc05lYXJCb3R0b20nLFxuICAgICAgJ3Jldmlld0dyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbicsXG4gICAgICAncmV2aWV3TWVzc2FnZVJlcXVlc3ROYW1lQ29sbGlzaW9uJyxcbiAgICAgICdsZWFybk1vcmVBYm91dERlbGl2ZXJ5SXNzdWUnLFxuICAgICAgJ2xvYWRPbGRlck1lc3NhZ2VzJyxcbiAgICAgICdsb2FkTmV3ZXJNZXNzYWdlcycsXG4gICAgICAnbG9hZE5ld2VzdE1lc3NhZ2VzJyxcbiAgICAgICdtYXJrTWVzc2FnZVJlYWQnLFxuICAgICAgJ21hcmtWaWV3ZWQnLFxuICAgICAgJ29uQmxvY2snLFxuICAgICAgJ29uQmxvY2tBbmRSZXBvcnRTcGFtJyxcbiAgICAgICdvbkRlbGV0ZScsXG4gICAgICAnb25VbmJsb2NrJyxcbiAgICAgICdwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lJyxcbiAgICAgICdwZWVrR3JvdXBDYWxsSWZJdEhhc01lbWJlcnMnLFxuICAgICAgJ3JlbW92ZU1lbWJlcicsXG4gICAgICAnc2VsZWN0TWVzc2FnZScsXG4gICAgICAnY2xlYXJTZWxlY3RlZE1lc3NhZ2UnLFxuICAgICAgJ3VuYmx1ckF2YXRhcicsXG4gICAgICAndXBkYXRlU2hhcmVkR3JvdXBzJyxcblxuICAgICAgJ2RvdWJsZUNoZWNrTWlzc2luZ1F1b3RlUmVmZXJlbmNlJyxcbiAgICAgICdjaGVja0ZvckFjY291bnQnLFxuICAgICAgJ3JlYWN0VG9NZXNzYWdlJyxcbiAgICAgICdyZXBseVRvTWVzc2FnZScsXG4gICAgICAncmV0cnlEZWxldGVGb3JFdmVyeW9uZScsXG4gICAgICAncmV0cnlTZW5kJyxcbiAgICAgICdzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbCcsXG4gICAgICAnZGVsZXRlTWVzc2FnZScsXG4gICAgICAnZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lJyxcbiAgICAgICdzaG93TWVzc2FnZURldGFpbCcsXG4gICAgICAnb3BlbkNvbnZlcnNhdGlvbicsXG4gICAgICAnb3BlbkdpZnRCYWRnZScsXG4gICAgICAnc2hvd0NvbnRhY3REZXRhaWwnLFxuICAgICAgJ3Nob3dDb250YWN0TW9kYWwnLFxuICAgICAgJ2tpY2tPZmZBdHRhY2htZW50RG93bmxvYWQnLFxuICAgICAgJ21hcmtBdHRhY2htZW50QXNDb3JydXB0ZWQnLFxuICAgICAgJ21lc3NhZ2VFeHBhbmRlZCcsXG4gICAgICAnc2hvd1Zpc3VhbEF0dGFjaG1lbnQnLFxuICAgICAgJ2Rvd25sb2FkQXR0YWNobWVudCcsXG4gICAgICAnZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnLFxuICAgICAgJ29wZW5MaW5rJyxcbiAgICAgICdzY3JvbGxUb1F1b3RlZE1lc3NhZ2UnLFxuICAgICAgJ3Nob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdCcsXG4gICAgICAnc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0JyxcbiAgICAgICdzdGFydENvbnZlcnNhdGlvbicsXG5cbiAgICAgICdzaG93SWRlbnRpdHknLFxuXG4gICAgICAnZG93bmxvYWROZXdWZXJzaW9uJyxcblxuICAgICAgJ2NvbnRhY3RTdXBwb3J0JyxcblxuICAgICAgJ3ZpZXdTdG9yeScsXG4gICAgXSk7XG5cbiAgICBjb25zdCBzYWZlOiBBc3NlcnRQcm9wczxQcm9wc0FjdGlvbnNUeXBlLCB0eXBlb2YgdW5zYWZlPiA9IHVuc2FmZTtcblxuICAgIHJldHVybiBzYWZlO1xuICB9XG4pO1xuXG5leHBvcnQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8XG4gIFByb3BzVHlwZSxcbiAgU3RhdGVUeXBlLFxuICBTbmFwc2hvdFR5cGVcbj4ge1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lclJlZiA9IFJlYWN0LmNyZWF0ZVJlZjxIVE1MRGl2RWxlbWVudD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBtZXNzYWdlc1JlZiA9IFJlYWN0LmNyZWF0ZVJlZjxIVE1MRGl2RWxlbWVudD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhdEJvdHRvbURldGVjdG9yUmVmID0gUmVhY3QuY3JlYXRlUmVmPEhUTUxEaXZFbGVtZW50PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxhc3RTZWVuSW5kaWNhdG9yUmVmID0gUmVhY3QuY3JlYXRlUmVmPEhUTUxEaXZFbGVtZW50PigpO1xuICBwcml2YXRlIGludGVyc2VjdGlvbk9ic2VydmVyPzogSW50ZXJzZWN0aW9uT2JzZXJ2ZXI7XG4gIHByaXZhdGUgaW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFja0ZyYW1lPzogbnVtYmVyO1xuXG4gIC8vIFRoaXMgaXMgYSBiZXN0IGd1ZXNzLiBJdCB3aWxsIGxpa2VseSBiZSBvdmVycmlkZGVuIHdoZW4gdGhlIHRpbWVsaW5lIGlzIG1lYXN1cmVkLlxuICBwcml2YXRlIG1heFZpc2libGVSb3dzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lckhlaWdodCAvIE1JTl9ST1dfSEVJR0hUKTtcblxuICBwcml2YXRlIGhhc1JlY2VudGx5U2Nyb2xsZWRUaW1lb3V0PzogTm9kZUpTLlRpbWVvdXQ7XG4gIHByaXZhdGUgZGVsYXllZFBlZWtUaW1lb3V0PzogTm9kZUpTLlRpbWVvdXQ7XG4gIHByaXZhdGUgcGVla0ludGVydmFsPzogTm9kZUpTLlRpbWVvdXQ7XG5cbiAgb3ZlcnJpZGUgc3RhdGU6IFN0YXRlVHlwZSA9IHtcbiAgICBoYXNSZWNlbnRseVNjcm9sbGVkOiB0cnVlLFxuICAgIGhhc0Rpc21pc3NlZERpcmVjdENvbnRhY3RTcG9vZmluZ1dhcm5pbmc6IGZhbHNlLFxuXG4gICAgLy8gVGhlc2UgbWF5IGJlIHN3aWZ0bHkgb3ZlcnJpZGRlbi5cbiAgICBsYXN0TWVhc3VyZWRXYXJuaW5nSGVpZ2h0OiAwLFxuICAgIHdpZHRoQnJlYWtwb2ludDogV2lkdGhCcmVha3BvaW50LldpZGUsXG4gIH07XG5cbiAgcHJpdmF0ZSBvblNjcm9sbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKG9sZFN0YXRlID0+XG4gICAgICAvLyBgb25TY3JvbGxgIGlzIGNhbGxlZCBmcmVxdWVudGx5LCBzbyBpdCdzIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZS4gV2UgdHJ5IG91ciBiZXN0XG4gICAgICAvLyAgIHRvIHJldHVybiBgbnVsbGAgZnJvbSB0aGlzIHVwZGF0ZXIgYmVjYXVzZSBbdGhhdCB3b24ndCBjYXVzZSBhIHJlLXJlbmRlcl1bMF0uXG4gICAgICAvL1xuICAgICAgLy8gWzBdOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yOWI3Yjc3NWYyZWNmODc4ZWFmNjA1YmU5NTlkOTU5MDMwNTk4YjA3L3BhY2thZ2VzL3JlYWN0LXJlY29uY2lsZXIvc3JjL1JlYWN0VXBkYXRlUXVldWUuanMjTDQwMS1MNDA0XG4gICAgICBvbGRTdGF0ZS5oYXNSZWNlbnRseVNjcm9sbGVkID8gbnVsbCA6IHsgaGFzUmVjZW50bHlTY3JvbGxlZDogdHJ1ZSB9XG4gICAgKTtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aGlzLmhhc1JlY2VudGx5U2Nyb2xsZWRUaW1lb3V0KTtcbiAgICB0aGlzLmhhc1JlY2VudGx5U2Nyb2xsZWRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgaGFzUmVjZW50bHlTY3JvbGxlZDogZmFsc2UgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0l0ZW1JbmRleChpdGVtSW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMubWVzc2FnZXNSZWYuY3VycmVudFxuICAgICAgPy5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pdGVtLWluZGV4PVwiJHtpdGVtSW5kZXh9XCJdYClcbiAgICAgID8uc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0JvdHRvbSA9IChzZXRGb2N1cz86IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IHNlbGVjdE1lc3NhZ2UsIGlkLCBpdGVtcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChzZXRGb2N1cyAmJiBpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBsYXN0SW5kZXggPSBpdGVtcy5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgbGFzdE1lc3NhZ2VJZCA9IGl0ZW1zW2xhc3RJbmRleF07XG4gICAgICBzZWxlY3RNZXNzYWdlKGxhc3RNZXNzYWdlSWQsIGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLmNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgaWYgKGNvbnRhaW5lckVsKSB7XG4gICAgICAgIHNjcm9sbFRvQm90dG9tKGNvbnRhaW5lckVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBvbkNsaWNrU2Nyb2xsRG93bkJ1dHRvbiA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLnNjcm9sbERvd24oZmFsc2UpO1xuICB9O1xuXG4gIHByaXZhdGUgc2Nyb2xsRG93biA9IChzZXRGb2N1cz86IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBoYXZlTmV3ZXN0LFxuICAgICAgaWQsXG4gICAgICBpdGVtcyxcbiAgICAgIGxvYWROZXdlc3RNZXNzYWdlcyxcbiAgICAgIG1lc3NhZ2VMb2FkaW5nU3RhdGUsXG4gICAgICBvbGRlc3RVbnNlZW5JbmRleCxcbiAgICAgIHNlbGVjdE1lc3NhZ2UsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2VMb2FkaW5nU3RhdGUpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oc2V0Rm9jdXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIG5ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlSWQgJiZcbiAgICAgIGlzTnVtYmVyKG9sZGVzdFVuc2VlbkluZGV4KSAmJlxuICAgICAgaXRlbXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbSA9PT0gbmV3ZXN0Qm90dG9tVmlzaWJsZU1lc3NhZ2VJZCkgPFxuICAgICAgICBvbGRlc3RVbnNlZW5JbmRleFxuICAgICkge1xuICAgICAgaWYgKHNldEZvY3VzKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VJZCA9IGl0ZW1zW29sZGVzdFVuc2VlbkluZGV4XTtcbiAgICAgICAgc2VsZWN0TWVzc2FnZShtZXNzYWdlSWQsIGlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9JdGVtSW5kZXgob2xkZXN0VW5zZWVuSW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGF2ZU5ld2VzdCkge1xuICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbShzZXRGb2N1cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxhc3RJZCA9IGxhc3QoaXRlbXMpO1xuICAgICAgaWYgKGxhc3RJZCkge1xuICAgICAgICBsb2FkTmV3ZXN0TWVzc2FnZXMobGFzdElkLCBzZXRGb2N1cyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgaXNBdEJvdHRvbSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBjb250YWluZXJFbCA9IHRoaXMuY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFjb250YWluZXJFbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpc1Njcm9sbGVkTmVhckJvdHRvbSA9XG4gICAgICBnZXRTY3JvbGxCb3R0b20oY29udGFpbmVyRWwpIDw9IEFUX0JPVFRPTV9USFJFU0hPTEQ7XG4gICAgY29uc3QgaGFzU2Nyb2xsYmFycyA9IGNvbnRhaW5lckVsLmNsaWVudEhlaWdodCA8IGNvbnRhaW5lckVsLnNjcm9sbEhlaWdodDtcbiAgICByZXR1cm4gaXNTY3JvbGxlZE5lYXJCb3R0b20gfHwgIWhhc1Njcm9sbGJhcnM7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUludGVyc2VjdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gdGhpcy5jb250YWluZXJSZWYuY3VycmVudDtcbiAgICBjb25zdCBtZXNzYWdlc0VsID0gdGhpcy5tZXNzYWdlc1JlZi5jdXJyZW50O1xuICAgIGNvbnN0IGF0Qm90dG9tRGV0ZWN0b3JFbCA9IHRoaXMuYXRCb3R0b21EZXRlY3RvclJlZi5jdXJyZW50O1xuICAgIGlmICghY29udGFpbmVyRWwgfHwgIW1lc3NhZ2VzRWwgfHwgIWF0Qm90dG9tRGV0ZWN0b3JFbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGhhdmVOZXdlc3QsXG4gICAgICBoYXZlT2xkZXN0LFxuICAgICAgaWQsXG4gICAgICBpdGVtcyxcbiAgICAgIGxvYWROZXdlck1lc3NhZ2VzLFxuICAgICAgbG9hZE9sZGVyTWVzc2FnZXMsXG4gICAgICBtZXNzYWdlTG9hZGluZ1N0YXRlLFxuICAgICAgc2V0SXNOZWFyQm90dG9tLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gV2UgcmUtaW5pdGlhbGl6ZSB0aGUgYEludGVyc2VjdGlvbk9ic2VydmVyYC4gV2UgZG9uJ3Qgd2FudCBzdGFsZSByZWZlcmVuY2VzIHRvIG9sZFxuICAgIC8vICAgcHJvcHMsIGFuZCB3ZSBjYXJlIGFib3V0IHRoZSBvcmRlciBvZiBgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeWBzLiAoV2UgY291bGQgZG9cbiAgICAvLyAgIHRoaXMgYW5vdGhlciB3YXksIGJ1dCB0aGlzIGFwcHJvYWNoIHdvcmtzLilcbiAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG5cbiAgICBpZiAodGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlckNhbGxiYWNrRnJhbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFja0ZyYW1lKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnRlcnNlY3Rpb25SYXRpb3MgPSBuZXcgTWFwPEVsZW1lbnQsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IGludGVyc2VjdGlvbk9ic2VydmVyQ2FsbGJhY2s6IEludGVyc2VjdGlvbk9ic2VydmVyQ2FsbGJhY2sgPVxuICAgICAgZW50cmllcyA9PiB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCB0aW1lIHRoaXMgY2FsbGJhY2sgaXMgY2FsbGVkLCB3ZSdsbCBnZXQgZW50cmllcyBpbiBvYnNlcnZhdGlvbiBvcmRlclxuICAgICAgICAvLyAgICh3aGljaCBzaG91bGQgbWF0Y2ggRE9NIG9yZGVyKS4gV2UgZG9uJ3Qgd2FudCB0byBkZWxldGUgYW55dGhpbmcgZnJvbSBvdXIgbWFwXG4gICAgICAgIC8vICAgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBvcmRlciB0byBjaGFuZ2UgYXQgYWxsLlxuICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgIGludGVyc2VjdGlvblJhdGlvcy5zZXQoZW50cnkudGFyZ2V0LCBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBuZXdJc05lYXJCb3R0b20gPSBmYWxzZTtcbiAgICAgICAgbGV0IG9sZGVzdFBhcnRpYWxseVZpc2libGU6IHVuZGVmaW5lZCB8IEVsZW1lbnQ7XG4gICAgICAgIGxldCBuZXdlc3RQYXJ0aWFsbHlWaXNpYmxlOiB1bmRlZmluZWQgfCBFbGVtZW50O1xuICAgICAgICBsZXQgbmV3ZXN0RnVsbHlWaXNpYmxlOiB1bmRlZmluZWQgfCBFbGVtZW50O1xuXG4gICAgICAgIGZvciAoY29uc3QgW2VsZW1lbnQsIGludGVyc2VjdGlvblJhdGlvXSBvZiBpbnRlcnNlY3Rpb25SYXRpb3MpIHtcbiAgICAgICAgICBpZiAoaW50ZXJzZWN0aW9uUmF0aW8gPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFdlIHVzZSB0aGlzIFwiYXQgYm90dG9tIGRldGVjdG9yXCIgZm9yIHR3byByZWFzb25zLCBib3RoIGZvciBwZXJmb3JtYW5jZS4gSXQnc1xuICAgICAgICAgIC8vICAgdXN1YWxseSBmYXN0ZXIgdG8gdXNlIGFuIGBJbnRlcnNlY3Rpb25PYnNlcnZlcmAgaW5zdGVhZCBvZiBhIHNjcm9sbCBldmVudCxcbiAgICAgICAgICAvLyAgIGFuZCB3ZSB3YW50IHRvIGRvIHRoYXQgaGVyZS5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIDEuIFdlIGNhbiBkZXRlcm1pbmUgd2hldGhlciB3ZSdyZSBuZWFyIHRoZSBib3R0b20gd2l0aG91dCBgb25TY3JvbGxgXG4gICAgICAgICAgLy8gMi4gV2UgbmVlZCB0aGlzIGluZm9ybWF0aW9uIHdoZW4gZGVjaWRpbmcgd2hldGhlciB0aGUgYm90dG9tIG9mIHRoZSBsYXN0XG4gICAgICAgICAgLy8gICAgbWVzc2FnZSBpcyB2aXNpYmxlLiBXZSB3YW50IHRvIGdldCBhbiBpbnRlcnNlY3Rpb24gb2JzZXJ2ZXIgZXZlbnQgd2hlbiB0aGVcbiAgICAgICAgICAvLyAgICBib3R0b20gb2YgdGhlIGNvbnRhaW5lciBjb21lcyBpbnRvIHZpZXcuXG4gICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGF0Qm90dG9tRGV0ZWN0b3JFbCkge1xuICAgICAgICAgICAgbmV3SXNOZWFyQm90dG9tID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZSA9IG9sZGVzdFBhcnRpYWxseVZpc2libGUgfHwgZWxlbWVudDtcbiAgICAgICAgICAgIG5ld2VzdFBhcnRpYWxseVZpc2libGUgPSBlbGVtZW50O1xuICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvblJhdGlvID09PSAxKSB7XG4gICAgICAgICAgICAgIG5ld2VzdEZ1bGx5VmlzaWJsZSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgYSBtZXNzYWdlIGlzIGZ1bGx5IHZpc2libGUsIHRoZW4geW91IGNhbiBzZWUgaXRzIGJvdHRvbS4gSWYgbm90LCB0aGVyZSdzIGFcbiAgICAgICAgLy8gICB2ZXJ5IHRhbGwgbWVzc2FnZSBhcm91bmQuIFdlIGFzc3VtZSB5b3UgY2FuIHNlZSB0aGUgYm90dG9tIG9mIGEgbWVzc2FnZSBpZlxuICAgICAgICAvLyAgICgxKSBhbm90aGVyIG1lc3NhZ2UgaXMgcGFydGx5IHZpc2libGUgcmlnaHQgYmVsb3cgaXQsIG9yICgyKSB5b3UncmUgbmVhciB0aGVcbiAgICAgICAgLy8gICBib3R0b20gb2YgdGhlIHNjcm9sbGFibGUgY29udGFpbmVyLlxuICAgICAgICBsZXQgbmV3ZXN0Qm90dG9tVmlzaWJsZTogdW5kZWZpbmVkIHwgRWxlbWVudDtcbiAgICAgICAgaWYgKG5ld2VzdEZ1bGx5VmlzaWJsZSkge1xuICAgICAgICAgIG5ld2VzdEJvdHRvbVZpc2libGUgPSBuZXdlc3RGdWxseVZpc2libGU7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgbmV3SXNOZWFyQm90dG9tIHx8XG4gICAgICAgICAgbmV3ZXN0UGFydGlhbGx5VmlzaWJsZSAhPT0gb2xkZXN0UGFydGlhbGx5VmlzaWJsZVxuICAgICAgICApIHtcbiAgICAgICAgICBuZXdlc3RCb3R0b21WaXNpYmxlID0gb2xkZXN0UGFydGlhbGx5VmlzaWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9sZGVzdFBhcnRpYWxseVZpc2libGVNZXNzYWdlSWQgPSBnZXRNZXNzYWdlSWRGcm9tRWxlbWVudChcbiAgICAgICAgICBvbGRlc3RQYXJ0aWFsbHlWaXNpYmxlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG5ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlSWQgPVxuICAgICAgICAgIGdldE1lc3NhZ2VJZEZyb21FbGVtZW50KG5ld2VzdEJvdHRvbVZpc2libGUpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIG9sZGVzdFBhcnRpYWxseVZpc2libGVNZXNzYWdlSWQsXG4gICAgICAgICAgbmV3ZXN0Qm90dG9tVmlzaWJsZU1lc3NhZ2VJZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0SXNOZWFyQm90dG9tKGlkLCBuZXdJc05lYXJCb3R0b20pO1xuXG4gICAgICAgIGlmIChuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkKSB7XG4gICAgICAgICAgdGhpcy5tYXJrTmV3ZXN0Qm90dG9tVmlzaWJsZU1lc3NhZ2VSZWFkKCk7XG5cbiAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGdldFJvd0luZGV4RnJvbUVsZW1lbnQobmV3ZXN0Qm90dG9tVmlzaWJsZSk7XG4gICAgICAgICAgY29uc3QgbWF4Um93SW5kZXggPSBpdGVtcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1lc3NhZ2VMb2FkaW5nU3RhdGUgJiZcbiAgICAgICAgICAgICFoYXZlTmV3ZXN0ICYmXG4gICAgICAgICAgICBpc051bWJlcihyb3dJbmRleCkgJiZcbiAgICAgICAgICAgIG1heFJvd0luZGV4ID49IDAgJiZcbiAgICAgICAgICAgIHJvd0luZGV4ID49IG1heFJvd0luZGV4IC0gTE9BRF9ORVdFUl9USFJFU0hPTERcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvYWROZXdlck1lc3NhZ2VzKG5ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAhbWVzc2FnZUxvYWRpbmdTdGF0ZSAmJlxuICAgICAgICAgICFoYXZlT2xkZXN0ICYmXG4gICAgICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZCAmJlxuICAgICAgICAgIG9sZGVzdFBhcnRpYWxseVZpc2libGVNZXNzYWdlSWQgPT09IGl0ZW1zWzBdXG4gICAgICAgICkge1xuICAgICAgICAgIGxvYWRPbGRlck1lc3NhZ2VzKG9sZGVzdFBhcnRpYWxseVZpc2libGVNZXNzYWdlSWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihcbiAgICAgIChlbnRyaWVzLCBvYnNlcnZlcikgPT4ge1xuICAgICAgICBhc3NlcnQoXG4gICAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlciA9PT0gb2JzZXJ2ZXIsXG4gICAgICAgICAgJ29ic2VydmVyLmRpc2Nvbm5lY3QoKSBzaG91bGQgcHJldmVudCBjYWxsYmFja3MgZnJvbSBmaXJpbmcnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gYHJlYWN0LW1lYXN1cmVgIHNjaGVkdWxlcyB0aGUgY2FsbGJhY2tzIG9uIHRoZSBuZXh0IHRpY2sgYW5kIHNvXG4gICAgICAgIC8vIHNob3VsZCB3ZSBiZWNhdXNlIHdlIHdhbnQgb3RoZXIgcGFydHMgb2YgdGhpcyBjb21wb25lbnQgdG8gcmVzcG9uZFxuICAgICAgICAvLyB0byByZXNpemUgZXZlbnRzIGJlZm9yZSB3ZSByZWNhbGN1bGF0ZSB3aGF0IGlzIHZpc2libGUuXG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFja0ZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAvLyBPYnNlcnZlciB3YXMgdXBkYXRlZCBmcm9tIHVuZGVyIHVzXG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlciAhPT0gb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb25PYnNlcnZlckNhbGxiYWNrKGVudHJpZXMsIG9ic2VydmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByb290OiBjb250YWluZXJFbCxcbiAgICAgICAgdGhyZXNob2xkOiBbMCwgMV0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbWVzc2FnZXNFbC5jaGlsZHJlbikge1xuICAgICAgaWYgKChjaGlsZCBhcyBIVE1MRWxlbWVudCkuZGF0YXNldC5tZXNzYWdlSWQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlci5vYnNlcnZlKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlci5vYnNlcnZlKGF0Qm90dG9tRGV0ZWN0b3JFbCk7XG4gIH1cblxuICBwcml2YXRlIG1hcmtOZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZVJlYWQgPSB0aHJvdHRsZSgoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgeyBtYXJrTWVzc2FnZVJlYWQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkKSB7XG4gICAgICBtYXJrTWVzc2FnZVJlYWQobmV3ZXN0Qm90dG9tVmlzaWJsZU1lc3NhZ2VJZCk7XG4gICAgfVxuICB9LCA1MDApO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBjb21wb25lbnREaWRNb3VudCgpOiB2b2lkIHtcbiAgICBjb25zdCBjb250YWluZXJFbCA9IHRoaXMuY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgY29uc3QgbWVzc2FnZXNFbCA9IHRoaXMubWVzc2FnZXNSZWYuY3VycmVudDtcbiAgICBjb25zdCB7IGlzQ29udmVyc2F0aW9uU2VsZWN0ZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgLy8gV2UgZG9uJ3QgcmVuZGVyIGFueXRoaW5nIHVubGVzcyB0aGUgY29udmVyc2F0aW9uIGlzIHNlbGVjdGVkXG4gICAgICAoY29udGFpbmVyRWwgJiYgbWVzc2FnZXNFbCkgfHwgIWlzQ29udmVyc2F0aW9uU2VsZWN0ZWQsXG4gICAgICAnPFRpbWVsaW5lPiBtb3VudGVkIHdpdGhvdXQgc29tZSByZWZzJ1xuICAgICk7XG5cbiAgICB0aGlzLnVwZGF0ZUludGVyc2VjdGlvbk9ic2VydmVyKCk7XG5cbiAgICB3aW5kb3cuU2lnbmFsQ29udGV4dC5hY3RpdmVXaW5kb3dTZXJ2aWNlLnJlZ2lzdGVyRm9yQWN0aXZlKFxuICAgICAgdGhpcy5tYXJrTmV3ZXN0Qm90dG9tVmlzaWJsZU1lc3NhZ2VSZWFkXG4gICAgKTtcblxuICAgIHRoaXMuZGVsYXllZFBlZWtUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lIH0gPSB0aGlzLnByb3BzO1xuICAgICAgdGhpcy5kZWxheWVkUGVla1RpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgICBwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lKGlkKTtcbiAgICB9LCA1MDApO1xuXG4gICAgdGhpcy5wZWVrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBwZWVrR3JvdXBDYWxsSWZJdEhhc01lbWJlcnMgfSA9IHRoaXMucHJvcHM7XG4gICAgICBwZWVrR3JvdXBDYWxsSWZJdEhhc01lbWJlcnMoaWQpO1xuICAgIH0sIE1JTlVURSk7XG4gIH1cblxuICBwdWJsaWMgb3ZlcnJpZGUgY29tcG9uZW50V2lsbFVubW91bnQoKTogdm9pZCB7XG4gICAgY29uc3QgeyBkZWxheWVkUGVla1RpbWVvdXQsIHBlZWtJbnRlcnZhbCB9ID0gdGhpcztcblxuICAgIHdpbmRvdy5TaWduYWxDb250ZXh0LmFjdGl2ZVdpbmRvd1NlcnZpY2UudW5yZWdpc3RlckZvckFjdGl2ZShcbiAgICAgIHRoaXMubWFya05ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlUmVhZFxuICAgICk7XG5cbiAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG5cbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeShkZWxheWVkUGVla1RpbWVvdXQpO1xuICAgIGlmIChwZWVrSW50ZXJ2YWwpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwocGVla0ludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb3ZlcnJpZGUgZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUoXG4gICAgcHJldlByb3BzOiBSZWFkb25seTxQcm9wc1R5cGU+XG4gICk6IFNuYXBzaG90VHlwZSB7XG4gICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLmNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgIGlmICghY29udGFpbmVyRWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcHJvcHMgfSA9IHRoaXM7XG4gICAgY29uc3QgeyBzY3JvbGxUb0luZGV4IH0gPSBwcm9wcztcblxuICAgIGNvbnN0IHNjcm9sbEFuY2hvciA9IGdldFNjcm9sbEFuY2hvckJlZm9yZVVwZGF0ZShcbiAgICAgIHByZXZQcm9wcyxcbiAgICAgIHByb3BzLFxuICAgICAgdGhpcy5pc0F0Qm90dG9tKClcbiAgICApO1xuXG4gICAgc3dpdGNoIChzY3JvbGxBbmNob3IpIHtcbiAgICAgIGNhc2UgU2Nyb2xsQW5jaG9yLkNoYW5nZU5vdGhpbmc6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgY2FzZSBTY3JvbGxBbmNob3IuU2Nyb2xsVG9Cb3R0b206XG4gICAgICAgIHJldHVybiB7IHNjcm9sbEJvdHRvbTogMCB9O1xuICAgICAgY2FzZSBTY3JvbGxBbmNob3IuU2Nyb2xsVG9JbmRleDpcbiAgICAgICAgaWYgKHNjcm9sbFRvSW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFzc2VydChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJzxUaW1lbGluZT4gZ290IFwic2Nyb2xsIHRvIGluZGV4XCIgc2Nyb2xsIGFuY2hvciwgYnV0IG5vIGluZGV4J1xuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc2Nyb2xsVG9JbmRleCB9O1xuICAgICAgY2FzZSBTY3JvbGxBbmNob3IuU2Nyb2xsVG9VbnJlYWRJbmRpY2F0b3I6XG4gICAgICAgIHJldHVybiBzY3JvbGxUb1VucmVhZEluZGljYXRvcjtcbiAgICAgIGNhc2UgU2Nyb2xsQW5jaG9yLlRvcDpcbiAgICAgICAgcmV0dXJuIHsgc2Nyb2xsVG9wOiBjb250YWluZXJFbC5zY3JvbGxUb3AgfTtcbiAgICAgIGNhc2UgU2Nyb2xsQW5jaG9yLkJvdHRvbTpcbiAgICAgICAgcmV0dXJuIHsgc2Nyb2xsQm90dG9tOiBnZXRTY3JvbGxCb3R0b20oY29udGFpbmVyRWwpIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKHNjcm9sbEFuY2hvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGNvbXBvbmVudERpZFVwZGF0ZShcbiAgICBwcmV2UHJvcHM6IFJlYWRvbmx5PFByb3BzVHlwZT4sXG4gICAgX3ByZXZTdGF0ZTogUmVhZG9ubHk8U3RhdGVUeXBlPixcbiAgICBzbmFwc2hvdDogUmVhZG9ubHk8U25hcHNob3RUeXBlPlxuICApOiB2b2lkIHtcbiAgICBjb25zdCB7XG4gICAgICBpdGVtczogb2xkSXRlbXMsXG4gICAgICBtZXNzYWdlQ2hhbmdlQ291bnRlcjogcHJldmlvdXNNZXNzYWdlQ2hhbmdlQ291bnRlcixcbiAgICAgIG1lc3NhZ2VMb2FkaW5nU3RhdGU6IHByZXZpb3VzTWVzc2FnZUxvYWRpbmdTdGF0ZSxcbiAgICB9ID0gcHJldlByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIGRpc2NhcmRNZXNzYWdlcyxcbiAgICAgIGlkLFxuICAgICAgaXRlbXM6IG5ld0l0ZW1zLFxuICAgICAgbWVzc2FnZUNoYW5nZUNvdW50ZXIsXG4gICAgICBtZXNzYWdlTG9hZGluZ1N0YXRlLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLmNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgIGlmIChjb250YWluZXJFbCAmJiBzbmFwc2hvdCkge1xuICAgICAgaWYgKHNuYXBzaG90ID09PSBzY3JvbGxUb1VucmVhZEluZGljYXRvcikge1xuICAgICAgICBjb25zdCBsYXN0U2VlbkluZGljYXRvckVsID0gdGhpcy5sYXN0U2VlbkluZGljYXRvclJlZi5jdXJyZW50O1xuICAgICAgICBpZiAobGFzdFNlZW5JbmRpY2F0b3JFbCkge1xuICAgICAgICAgIGxhc3RTZWVuSW5kaWNhdG9yRWwuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY3JvbGxUb0JvdHRvbShjb250YWluZXJFbCk7XG4gICAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAnPFRpbWVsaW5lPiBleHBlY3RlZCBhIGxhc3Qgc2VlbiBpbmRpY2F0b3IgYnV0IGl0IHdhcyBub3QgZm91bmQnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgnc2Nyb2xsVG9JbmRleCcgaW4gc25hcHNob3QpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb0l0ZW1JbmRleChzbmFwc2hvdC5zY3JvbGxUb0luZGV4KTtcbiAgICAgIH0gZWxzZSBpZiAoJ3Njcm9sbFRvcCcgaW4gc25hcHNob3QpIHtcbiAgICAgICAgY29udGFpbmVyRWwuc2Nyb2xsVG9wID0gc25hcHNob3Quc2Nyb2xsVG9wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0U2Nyb2xsQm90dG9tKGNvbnRhaW5lckVsLCBzbmFwc2hvdC5zY3JvbGxCb3R0b20pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvbGRJdGVtcy5sZW5ndGggIT09IG5ld0l0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy51cGRhdGVJbnRlcnNlY3Rpb25PYnNlcnZlcigpO1xuXG4gICAgICAvLyBUaGlzIGNvbmRpdGlvbiBpcyBzb21ld2hhdCBhcmJpdHJhcnkuXG4gICAgICBjb25zdCBudW1iZXJUb0tlZXBBdEJvdHRvbSA9IHRoaXMubWF4VmlzaWJsZVJvd3MgKiAyO1xuICAgICAgY29uc3Qgc2hvdWxkRGlzY2FyZE9sZGVyTWVzc2FnZXM6IGJvb2xlYW4gPVxuICAgICAgICB0aGlzLmlzQXRCb3R0b20oKSAmJiBuZXdJdGVtcy5sZW5ndGggPiBudW1iZXJUb0tlZXBBdEJvdHRvbTtcbiAgICAgIGlmIChzaG91bGREaXNjYXJkT2xkZXJNZXNzYWdlcykge1xuICAgICAgICBkaXNjYXJkTWVzc2FnZXMoe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBpZCxcbiAgICAgICAgICBudW1iZXJUb0tlZXBBdEJvdHRvbSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvYWRpbmdTdGF0ZVRoYXRKdXN0RmluaXNoZWQ6XG4gICAgICAgIHwgdW5kZWZpbmVkXG4gICAgICAgIHwgVGltZWxpbmVNZXNzYWdlTG9hZGluZ1N0YXRlID1cbiAgICAgICAgIW1lc3NhZ2VMb2FkaW5nU3RhdGUgJiYgcHJldmlvdXNNZXNzYWdlTG9hZGluZ1N0YXRlXG4gICAgICAgICAgPyBwcmV2aW91c01lc3NhZ2VMb2FkaW5nU3RhdGVcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IG51bWJlclRvS2VlcEF0VG9wID0gdGhpcy5tYXhWaXNpYmxlUm93cyAqIDU7XG4gICAgICBjb25zdCBzaG91bGREaXNjYXJkTmV3ZXJNZXNzYWdlczogYm9vbGVhbiA9XG4gICAgICAgICF0aGlzLmlzQXRCb3R0b20oKSAmJlxuICAgICAgICBsb2FkaW5nU3RhdGVUaGF0SnVzdEZpbmlzaGVkID09PVxuICAgICAgICAgIFRpbWVsaW5lTWVzc2FnZUxvYWRpbmdTdGF0ZS5Mb2FkaW5nT2xkZXJNZXNzYWdlcyAmJlxuICAgICAgICBuZXdJdGVtcy5sZW5ndGggPiBudW1iZXJUb0tlZXBBdFRvcDtcblxuICAgICAgaWYgKHNob3VsZERpc2NhcmROZXdlck1lc3NhZ2VzKSB7XG4gICAgICAgIGRpc2NhcmRNZXNzYWdlcyh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGlkLFxuICAgICAgICAgIG51bWJlclRvS2VlcEF0VG9wLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXZpb3VzTWVzc2FnZUNoYW5nZUNvdW50ZXIgIT09IG1lc3NhZ2VDaGFuZ2VDb3VudGVyKSB7XG4gICAgICB0aGlzLm1hcmtOZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZVJlYWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUJsdXIgPSAoZXZlbnQ6IFJlYWN0LkZvY3VzRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGNsZWFyU2VsZWN0ZWRNZXNzYWdlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0IH0gPSBldmVudDtcblxuICAgIC8vIFRoYW5rcyB0byBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wc3RvaWNhLzQzMjNkM2U2ZTM3ZThhMjNkZDU5XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBJZiBmb2N1cyBtb3ZlZCB0byBvbmUgb2Ygb3VyIHBvcnRhbHMsIHdlIGRvIG5vdCBjbGVhciB0aGUgc2VsZWN0ZWRcbiAgICAgIC8vIG1lc3NhZ2Ugc28gdGhhdCBmb2N1cyBzdGF5cyBpbnNpZGUgdGhlIHBvcnRhbC4gV2UgbmVlZCB0byBiZSBjYXJlZnVsXG4gICAgICAvLyB0byBub3QgY3JlYXRlIGNvbGxpZGluZyBrZXlib2FyZCBzaG9ydGN1dHMgYmV0d2VlbiBzZWxlY3RlZCBtZXNzYWdlc1xuICAgICAgLy8gYW5kIG91ciBwb3J0YWxzIVxuICAgICAgY29uc3QgcG9ydGFscyA9IEFycmF5LmZyb20oXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2JvZHkgPiBkaXY6bm90KC5pbmJveCknKVxuICAgICAgKTtcbiAgICAgIGlmIChwb3J0YWxzLnNvbWUoZWwgPT4gZWwuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjdXJyZW50VGFyZ2V0LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIGNsZWFyU2VsZWN0ZWRNZXNzYWdlKCk7XG4gICAgICB9XG4gICAgfSwgMCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVLZXlEb3duID0gKFxuICAgIGV2ZW50OiBSZWFjdC5LZXlib2FyZEV2ZW50PEhUTUxEaXZFbGVtZW50PlxuICApOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IHNlbGVjdE1lc3NhZ2UsIHNlbGVjdGVkTWVzc2FnZUlkLCBpdGVtcywgaWQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgY29tbWFuZEtleSA9IGdldCh3aW5kb3csICdwbGF0Zm9ybScpID09PSAnZGFyd2luJyAmJiBldmVudC5tZXRhS2V5O1xuICAgIGNvbnN0IGNvbnRyb2xLZXkgPSBnZXQod2luZG93LCAncGxhdGZvcm0nKSAhPT0gJ2RhcndpbicgJiYgZXZlbnQuY3RybEtleTtcbiAgICBjb25zdCBjb21tYW5kT3JDdHJsID0gY29tbWFuZEtleSB8fCBjb250cm9sS2V5O1xuXG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkTWVzc2FnZUlkICYmICFjb21tYW5kT3JDdHJsICYmIGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE1lc3NhZ2VJbmRleCA9IGl0ZW1zLmZpbmRJbmRleChcbiAgICAgICAgaXRlbSA9PiBpdGVtID09PSBzZWxlY3RlZE1lc3NhZ2VJZFxuICAgICAgKTtcbiAgICAgIGlmIChzZWxlY3RlZE1lc3NhZ2VJbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IHNlbGVjdGVkTWVzc2FnZUluZGV4IC0gMTtcbiAgICAgIGlmICh0YXJnZXRJbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXNzYWdlSWQgPSBpdGVtc1t0YXJnZXRJbmRleF07XG4gICAgICBzZWxlY3RNZXNzYWdlKG1lc3NhZ2VJZCwgaWQpO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRNZXNzYWdlSWQgJiYgIWNvbW1hbmRPckN0cmwgJiYgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRNZXNzYWdlSW5kZXggPSBpdGVtcy5maW5kSW5kZXgoXG4gICAgICAgIGl0ZW0gPT4gaXRlbSA9PT0gc2VsZWN0ZWRNZXNzYWdlSWRcbiAgICAgICk7XG4gICAgICBpZiAoc2VsZWN0ZWRNZXNzYWdlSW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBzZWxlY3RlZE1lc3NhZ2VJbmRleCArIDE7XG4gICAgICBpZiAodGFyZ2V0SW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVzc2FnZUlkID0gaXRlbXNbdGFyZ2V0SW5kZXhdO1xuICAgICAgc2VsZWN0TWVzc2FnZShtZXNzYWdlSWQsIGlkKTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmRPckN0cmwgJiYgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGNvbnN0IGZpcnN0TWVzc2FnZUlkID0gZmlyc3QoaXRlbXMpO1xuICAgICAgaWYgKGZpcnN0TWVzc2FnZUlkKSB7XG4gICAgICAgIHNlbGVjdE1lc3NhZ2UoZmlyc3RNZXNzYWdlSWQsIGlkKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmRPckN0cmwgJiYgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgdGhpcy5zY3JvbGxEb3duKHRydWUpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgb3ZlcnJpZGUgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gICAgY29uc3Qge1xuICAgICAgYWNrbm93bGVkZ2VHcm91cE1lbWJlck5hbWVDb2xsaXNpb25zLFxuICAgICAgY2xlYXJJbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cCxcbiAgICAgIGNsb3NlQ29udGFjdFNwb29maW5nUmV2aWV3LFxuICAgICAgY29udGFjdFNwb29maW5nUmV2aWV3LFxuICAgICAgZ2V0UHJlZmVycmVkQmFkZ2UsXG4gICAgICBnZXRUaW1lc3RhbXBGb3JNZXNzYWdlLFxuICAgICAgaGF2ZU5ld2VzdCxcbiAgICAgIGhhdmVPbGRlc3QsXG4gICAgICBpMThuLFxuICAgICAgaWQsXG4gICAgICBpbnZpdGVkQ29udGFjdHNGb3JOZXdseUNyZWF0ZWRHcm91cCxcbiAgICAgIGlzQ29udmVyc2F0aW9uU2VsZWN0ZWQsXG4gICAgICBpc0dyb3VwVjFBbmREaXNhYmxlZCxcbiAgICAgIGlzU29tZW9uZVR5cGluZyxcbiAgICAgIGl0ZW1zLFxuICAgICAgbWVzc2FnZUxvYWRpbmdTdGF0ZSxcbiAgICAgIG9sZGVzdFVuc2VlbkluZGV4LFxuICAgICAgb25CbG9jayxcbiAgICAgIG9uQmxvY2tBbmRSZXBvcnRTcGFtLFxuICAgICAgb25EZWxldGUsXG4gICAgICBvblVuYmxvY2ssXG4gICAgICByZW1vdmVNZW1iZXIsXG4gICAgICByZW5kZXJIZXJvUm93LFxuICAgICAgcmVuZGVySXRlbSxcbiAgICAgIHJlbmRlclR5cGluZ0J1YmJsZSxcbiAgICAgIHJlbmRlckNvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZyxcbiAgICAgIHJldmlld0dyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbixcbiAgICAgIHJldmlld01lc3NhZ2VSZXF1ZXN0TmFtZUNvbGxpc2lvbixcbiAgICAgIHNob3dDb250YWN0TW9kYWwsXG4gICAgICB0aGVtZSxcbiAgICAgIHRvdGFsVW5zZWVuLFxuICAgICAgdW5ibHVyQXZhdGFyLFxuICAgICAgdW5yZWFkQ291bnQsXG4gICAgICB1cGRhdGVTaGFyZWRHcm91cHMsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge1xuICAgICAgaGFzUmVjZW50bHlTY3JvbGxlZCxcbiAgICAgIGxhc3RNZWFzdXJlZFdhcm5pbmdIZWlnaHQsXG4gICAgICBuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkLFxuICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZCxcbiAgICAgIHdpZHRoQnJlYWtwb2ludCxcbiAgICB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIC8vIEFzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLCB3ZSBkb24ndCBuZWVkIHRvIHJlbmRlciBhbnl0aGluZyBpZiB0aGlzXG4gICAgLy8gICBjb252ZXJzYXRpb24gaXNuJ3QgdGhlIGFjdGl2ZSBvbmUuXG4gICAgaWYgKCFpc0NvbnZlcnNhdGlvblNlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhcmVUaGVyZUFueU1lc3NhZ2VzID0gaXRlbXMubGVuZ3RoID4gMDtcbiAgICBjb25zdCBhcmVBbnlNZXNzYWdlc1VucmVhZCA9IEJvb2xlYW4odW5yZWFkQ291bnQpO1xuICAgIGNvbnN0IGFyZUFueU1lc3NhZ2VzQmVsb3dDdXJyZW50UG9zaXRpb24gPVxuICAgICAgIWhhdmVOZXdlc3QgfHxcbiAgICAgIEJvb2xlYW4oXG4gICAgICAgIG5ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlSWQgJiZcbiAgICAgICAgICBuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkICE9PSBsYXN0KGl0ZW1zKVxuICAgICAgKTtcbiAgICBjb25zdCBhcmVTb21lTWVzc2FnZXNCZWxvd0N1cnJlbnRQb3NpdGlvbiA9XG4gICAgICAhaGF2ZU5ld2VzdCB8fFxuICAgICAgKG5ld2VzdEJvdHRvbVZpc2libGVNZXNzYWdlSWQgJiZcbiAgICAgICAgIWl0ZW1zXG4gICAgICAgICAgLnNsaWNlKC1TQ1JPTExfRE9XTl9CVVRUT05fVEhSRVNIT0xEKVxuICAgICAgICAgIC5pbmNsdWRlcyhuZXdlc3RCb3R0b21WaXNpYmxlTWVzc2FnZUlkKSk7XG5cbiAgICBjb25zdCBhcmVVbnJlYWRCZWxvd0N1cnJlbnRQb3NpdGlvbiA9IEJvb2xlYW4oXG4gICAgICBhcmVUaGVyZUFueU1lc3NhZ2VzICYmXG4gICAgICAgIGFyZUFueU1lc3NhZ2VzVW5yZWFkICYmXG4gICAgICAgIGFyZUFueU1lc3NhZ2VzQmVsb3dDdXJyZW50UG9zaXRpb25cbiAgICApO1xuICAgIGNvbnN0IHNob3VsZFNob3dTY3JvbGxEb3duQnV0dG9uID0gQm9vbGVhbihcbiAgICAgIGFyZVRoZXJlQW55TWVzc2FnZXMgJiZcbiAgICAgICAgKGFyZVVucmVhZEJlbG93Q3VycmVudFBvc2l0aW9uIHx8IGFyZVNvbWVNZXNzYWdlc0JlbG93Q3VycmVudFBvc2l0aW9uKVxuICAgICk7XG5cbiAgICBjb25zdCBhY3Rpb25Qcm9wcyA9IGdldEFjdGlvbnModGhpcy5wcm9wcyk7XG5cbiAgICBsZXQgZmxvYXRpbmdIZWFkZXI6IFJlYWN0Tm9kZTtcbiAgICAvLyBJdCdzIHBvc3NpYmxlIHRoYXQgYSBtZXNzYWdlIHdhcyByZW1vdmVkIGZyb20gYGl0ZW1zYCBidXQgd2Ugc3RpbGwgaGF2ZSBpdHMgSUQgaW5cbiAgICAvLyAgIHN0YXRlLiBgZ2V0VGltZXN0YW1wRm9yTWVzc2FnZWAgbWlnaHQgcmV0dXJuIHVuZGVmaW5lZCBpbiB0aGF0IGNhc2UuXG4gICAgY29uc3Qgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VUaW1lc3RhbXAgPVxuICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZFxuICAgICAgICA/IGdldFRpbWVzdGFtcEZvck1lc3NhZ2Uob2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZClcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgaWYgKFxuICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZCAmJlxuICAgICAgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VUaW1lc3RhbXBcbiAgICApIHtcbiAgICAgIGNvbnN0IGlzTG9hZGluZ01lc3NhZ2VzID0gQm9vbGVhbihtZXNzYWdlTG9hZGluZ1N0YXRlKTtcbiAgICAgIGZsb2F0aW5nSGVhZGVyID0gKFxuICAgICAgICA8VGltZWxpbmVGbG9hdGluZ0hlYWRlclxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmdNZXNzYWdlc31cbiAgICAgICAgICBzdHlsZT17XG4gICAgICAgICAgICBsYXN0TWVhc3VyZWRXYXJuaW5nSGVpZ2h0XG4gICAgICAgICAgICAgID8geyBtYXJnaW5Ub3A6IGxhc3RNZWFzdXJlZFdhcm5pbmdIZWlnaHQgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aW1lc3RhbXA9e29sZGVzdFBhcnRpYWxseVZpc2libGVNZXNzYWdlVGltZXN0YW1wfVxuICAgICAgICAgIHZpc2libGU9e1xuICAgICAgICAgICAgKGhhc1JlY2VudGx5U2Nyb2xsZWQgfHwgaXNMb2FkaW5nTWVzc2FnZXMpICYmXG4gICAgICAgICAgICAoIWhhdmVPbGRlc3QgfHwgb2xkZXN0UGFydGlhbGx5VmlzaWJsZU1lc3NhZ2VJZCAhPT0gaXRlbXNbMF0pXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlTm9kZXM6IEFycmF5PFJlYWN0Q2hpbGQ+ID0gW107XG4gICAgZm9yIChsZXQgaXRlbUluZGV4ID0gMDsgaXRlbUluZGV4IDwgaXRlbXMubGVuZ3RoOyBpdGVtSW5kZXggKz0gMSkge1xuICAgICAgY29uc3QgcHJldmlvdXNJdGVtSW5kZXggPSBpdGVtSW5kZXggLSAxO1xuICAgICAgY29uc3QgbmV4dEl0ZW1JbmRleCA9IGl0ZW1JbmRleCArIDE7XG5cbiAgICAgIGNvbnN0IHByZXZpb3VzTWVzc2FnZUlkOiB1bmRlZmluZWQgfCBzdHJpbmcgPSBpdGVtc1twcmV2aW91c0l0ZW1JbmRleF07XG4gICAgICBjb25zdCBuZXh0TWVzc2FnZUlkOiB1bmRlZmluZWQgfCBzdHJpbmcgPSBpdGVtc1tuZXh0SXRlbUluZGV4XTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VJZCA9IGl0ZW1zW2l0ZW1JbmRleF07XG5cbiAgICAgIGlmICghbWVzc2FnZUlkKSB7XG4gICAgICAgIGFzc2VydChcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnPFRpbWVsaW5lPiBpdGVyYXRlZCB0aHJvdWdoIGl0ZW1zIGFuZCBnb3QgYW4gZW1wdHkgbWVzc2FnZSBJRCdcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB1bnJlYWRJbmRpY2F0b3JQbGFjZW1lbnQ6IHVuZGVmaW5lZCB8IFVucmVhZEluZGljYXRvclBsYWNlbWVudDtcbiAgICAgIGlmIChvbGRlc3RVbnNlZW5JbmRleCA9PT0gaXRlbUluZGV4KSB7XG4gICAgICAgIHVucmVhZEluZGljYXRvclBsYWNlbWVudCA9IFVucmVhZEluZGljYXRvclBsYWNlbWVudC5KdXN0QWJvdmU7XG4gICAgICAgIG1lc3NhZ2VOb2Rlcy5wdXNoKFxuICAgICAgICAgIDxMYXN0U2VlbkluZGljYXRvclxuICAgICAgICAgICAga2V5PVwibGFzdCBzZWVuIGluZGljYXRvclwiXG4gICAgICAgICAgICBjb3VudD17dG90YWxVbnNlZW59XG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgcmVmPXt0aGlzLmxhc3RTZWVuSW5kaWNhdG9yUmVmfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKG9sZGVzdFVuc2VlbkluZGV4ID09PSBuZXh0SXRlbUluZGV4KSB7XG4gICAgICAgIHVucmVhZEluZGljYXRvclBsYWNlbWVudCA9IFVucmVhZEluZGljYXRvclBsYWNlbWVudC5KdXN0QmVsb3c7XG4gICAgICB9XG5cbiAgICAgIG1lc3NhZ2VOb2Rlcy5wdXNoKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXttZXNzYWdlSWR9XG4gICAgICAgICAgZGF0YS1pdGVtLWluZGV4PXtpdGVtSW5kZXh9XG4gICAgICAgICAgZGF0YS1tZXNzYWdlLWlkPXttZXNzYWdlSWR9XG4gICAgICAgID5cbiAgICAgICAgICA8RXJyb3JCb3VuZGFyeSBpMThuPXtpMThufSBzaG93RGVidWdMb2c9e3Nob3dEZWJ1Z0xvZ30+XG4gICAgICAgICAgICB7cmVuZGVySXRlbSh7XG4gICAgICAgICAgICAgIGFjdGlvblByb3BzLFxuICAgICAgICAgICAgICBjb250YWluZXJFbGVtZW50UmVmOiB0aGlzLmNvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50OiB3aWR0aEJyZWFrcG9pbnQsXG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBpZCxcbiAgICAgICAgICAgICAgaXNPbGRlc3RUaW1lbGluZUl0ZW06IGhhdmVPbGRlc3QgJiYgaXRlbUluZGV4ID09PSAwLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgIG5leHRNZXNzYWdlSWQsXG4gICAgICAgICAgICAgIHByZXZpb3VzTWVzc2FnZUlkLFxuICAgICAgICAgICAgICB1bnJlYWRJbmRpY2F0b3JQbGFjZW1lbnQsXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXJuaW5nID0gVGltZWxpbmUuZ2V0V2FybmluZyh0aGlzLnByb3BzLCB0aGlzLnN0YXRlKTtcbiAgICBsZXQgdGltZWxpbmVXYXJuaW5nOiBSZWFjdE5vZGU7XG4gICAgaWYgKHdhcm5pbmcpIHtcbiAgICAgIGxldCB0ZXh0OiBSZWFjdENoaWxkO1xuICAgICAgbGV0IG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG4gICAgICBzd2l0Y2ggKHdhcm5pbmcudHlwZSkge1xuICAgICAgICBjYXNlIENvbnRhY3RTcG9vZmluZ1R5cGUuRGlyZWN0Q29udmVyc2F0aW9uV2l0aFNhbWVUaXRsZTpcbiAgICAgICAgICB0ZXh0ID0gKFxuICAgICAgICAgICAgPEludGxcbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaWQ9XCJDb250YWN0U3Bvb2ZpbmdfX3NhbWUtbmFtZVwiXG4gICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICBsaW5rOiAoXG4gICAgICAgICAgICAgICAgICA8VGltZWxpbmVXYXJuaW5nLkxpbmtcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHJldmlld01lc3NhZ2VSZXF1ZXN0TmFtZUNvbGxpc2lvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWZlQ29udmVyc2F0aW9uSWQ6IHdhcm5pbmcuc2FmZUNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2kxOG4oJ0NvbnRhY3RTcG9vZmluZ19fc2FtZS1uYW1lX19saW5rJyl9XG4gICAgICAgICAgICAgICAgICA8L1RpbWVsaW5lV2FybmluZy5MaW5rPlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgICAgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBoYXNEaXNtaXNzZWREaXJlY3RDb250YWN0U3Bvb2ZpbmdXYXJuaW5nOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb250YWN0U3Bvb2ZpbmdUeXBlLk11bHRpcGxlR3JvdXBNZW1iZXJzV2l0aFNhbWVUaXRsZToge1xuICAgICAgICAgIGNvbnN0IHsgZ3JvdXBOYW1lQ29sbGlzaW9ucyB9ID0gd2FybmluZztcbiAgICAgICAgICB0ZXh0ID0gKFxuICAgICAgICAgICAgPEludGxcbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgaWQ9XCJDb250YWN0U3Bvb2ZpbmdfX3NhbWUtbmFtZS1pbi1ncm91cFwiXG4gICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICBjb3VudDogT2JqZWN0LnZhbHVlcyhncm91cE5hbWVDb2xsaXNpb25zKVxuICAgICAgICAgICAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCwgY29udmVyc2F0aW9ucykgPT4gcmVzdWx0ICsgY29udmVyc2F0aW9ucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGxpbms6IChcbiAgICAgICAgICAgICAgICAgIDxUaW1lbGluZVdhcm5pbmcuTGlua1xuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV2aWV3R3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2kxOG4oJ0NvbnRhY3RTcG9vZmluZ19fc2FtZS1uYW1lLWluLWdyb3VwX19saW5rJyl9XG4gICAgICAgICAgICAgICAgICA8L1RpbWVsaW5lV2FybmluZy5MaW5rPlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgICAgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGFja25vd2xlZGdlR3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9ucyhncm91cE5hbWVDb2xsaXNpb25zKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcih3YXJuaW5nKTtcbiAgICAgIH1cblxuICAgICAgdGltZWxpbmVXYXJuaW5nID0gKFxuICAgICAgICA8TWVhc3VyZVxuICAgICAgICAgIGJvdW5kc1xuICAgICAgICAgIG9uUmVzaXplPXsoeyBib3VuZHMgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFib3VuZHMpIHtcbiAgICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCAnV2Ugc2hvdWxkIGJlIG1lYXN1cmluZyB0aGUgYm91bmRzJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsYXN0TWVhc3VyZWRXYXJuaW5nSGVpZ2h0OiBib3VuZHMuaGVpZ2h0IH0pO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7KHsgbWVhc3VyZVJlZiB9KSA9PiAoXG4gICAgICAgICAgICA8VGltZWxpbmVXYXJuaW5ncyByZWY9e21lYXN1cmVSZWZ9PlxuICAgICAgICAgICAgICA8VGltZWxpbmVXYXJuaW5nIGkxOG49e2kxOG59IG9uQ2xvc2U9e29uQ2xvc2V9PlxuICAgICAgICAgICAgICAgIDxUaW1lbGluZVdhcm5pbmcuSWNvbkNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgIDxUaW1lbGluZVdhcm5pbmcuR2VuZXJpY0ljb24gLz5cbiAgICAgICAgICAgICAgICA8L1RpbWVsaW5lV2FybmluZy5JY29uQ29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxUaW1lbGluZVdhcm5pbmcuVGV4dD57dGV4dH08L1RpbWVsaW5lV2FybmluZy5UZXh0PlxuICAgICAgICAgICAgICA8L1RpbWVsaW5lV2FybmluZz5cbiAgICAgICAgICAgIDwvVGltZWxpbmVXYXJuaW5ncz5cbiAgICAgICAgICApfVxuICAgICAgICA8L01lYXN1cmU+XG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBjb250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2c6IFJlYWN0Tm9kZTtcbiAgICBpZiAoY29udGFjdFNwb29maW5nUmV2aWV3KSB7XG4gICAgICBjb25zdCBjb21tb25Qcm9wcyA9IHtcbiAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2UsXG4gICAgICAgIGkxOG4sXG4gICAgICAgIG9uQmxvY2ssXG4gICAgICAgIG9uQmxvY2tBbmRSZXBvcnRTcGFtLFxuICAgICAgICBvbkNsb3NlOiBjbG9zZUNvbnRhY3RTcG9vZmluZ1JldmlldyxcbiAgICAgICAgb25EZWxldGUsXG4gICAgICAgIG9uU2hvd0NvbnRhY3RNb2RhbDogc2hvd0NvbnRhY3RNb2RhbCxcbiAgICAgICAgb25VbmJsb2NrLFxuICAgICAgICByZW1vdmVNZW1iZXIsXG4gICAgICAgIHRoZW1lLFxuICAgICAgfTtcblxuICAgICAgc3dpdGNoIChjb250YWN0U3Bvb2ZpbmdSZXZpZXcudHlwZSkge1xuICAgICAgICBjYXNlIENvbnRhY3RTcG9vZmluZ1R5cGUuRGlyZWN0Q29udmVyc2F0aW9uV2l0aFNhbWVUaXRsZTpcbiAgICAgICAgICBjb250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2cgPSByZW5kZXJDb250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2coe1xuICAgICAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgICAgICB0eXBlOiBDb250YWN0U3Bvb2ZpbmdUeXBlLkRpcmVjdENvbnZlcnNhdGlvbldpdGhTYW1lVGl0bGUsXG4gICAgICAgICAgICBwb3NzaWJseVVuc2FmZUNvbnZlcnNhdGlvbjpcbiAgICAgICAgICAgICAgY29udGFjdFNwb29maW5nUmV2aWV3LnBvc3NpYmx5VW5zYWZlQ29udmVyc2F0aW9uLFxuICAgICAgICAgICAgc2FmZUNvbnZlcnNhdGlvbjogY29udGFjdFNwb29maW5nUmV2aWV3LnNhZmVDb252ZXJzYXRpb24sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGU6XG4gICAgICAgICAgY29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nID0gcmVuZGVyQ29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nKHtcbiAgICAgICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICAgICAgdHlwZTogQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGUsXG4gICAgICAgICAgICBncm91cENvbnZlcnNhdGlvbklkOiBpZCxcbiAgICAgICAgICAgIGNvbGxpc2lvbkluZm9CeVRpdGxlOiBjb250YWN0U3Bvb2ZpbmdSZXZpZXcuY29sbGlzaW9uSW5mb0J5VGl0bGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihjb250YWN0U3Bvb2ZpbmdSZXZpZXcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICA8TWVhc3VyZVxuICAgICAgICAgIGJvdW5kc1xuICAgICAgICAgIG9uUmVzaXplPXsoeyBib3VuZHMgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBpc05lYXJCb3R0b20gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgICAgIHN0cmljdEFzc2VydChib3VuZHMsICdXZSBzaG91bGQgYmUgbWVhc3VyaW5nIHRoZSBib3VuZHMnKTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoQnJlYWtwb2ludDogZ2V0V2lkdGhCcmVha3BvaW50KGJvdW5kcy53aWR0aCksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5tYXhWaXNpYmxlUm93cyA9IE1hdGguY2VpbChib3VuZHMuaGVpZ2h0IC8gTUlOX1JPV19IRUlHSFQpO1xuXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJFbCA9IHRoaXMuY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyRWwgJiYgaXNOZWFyQm90dG9tKSB7XG4gICAgICAgICAgICAgIHNjcm9sbFRvQm90dG9tKGNvbnRhaW5lckVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgeyh7IG1lYXN1cmVSZWYgfSkgPT4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgJ21vZHVsZS10aW1lbGluZScsXG4gICAgICAgICAgICAgICAgaXNHcm91cFYxQW5kRGlzYWJsZWQgPyAnbW9kdWxlLXRpbWVsaW5lLS1kaXNhYmxlZCcgOiBudWxsLFxuICAgICAgICAgICAgICAgIGBtb2R1bGUtdGltZWxpbmUtLXdpZHRoLSR7d2lkdGhCcmVha3BvaW50fWBcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgICAgICAgIHRhYkluZGV4PXstMX1cbiAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgICAgIG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuICAgICAgICAgICAgICByZWY9e21lYXN1cmVSZWZ9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0aW1lbGluZVdhcm5pbmd9XG5cbiAgICAgICAgICAgICAge2Zsb2F0aW5nSGVhZGVyfVxuXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtdGltZWxpbmVfX21lc3NhZ2VzX19jb250YWluZXJcIlxuICAgICAgICAgICAgICAgIG9uU2Nyb2xsPXt0aGlzLm9uU2Nyb2xsfVxuICAgICAgICAgICAgICAgIHJlZj17dGhpcy5jb250YWluZXJSZWZ9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgICAgICdtb2R1bGUtdGltZWxpbmVfX21lc3NhZ2VzJyxcbiAgICAgICAgICAgICAgICAgICAgaGF2ZU5ld2VzdCAmJiAnbW9kdWxlLXRpbWVsaW5lX19tZXNzYWdlcy0taGF2ZS1uZXdlc3QnLFxuICAgICAgICAgICAgICAgICAgICBoYXZlT2xkZXN0ICYmICdtb2R1bGUtdGltZWxpbmVfX21lc3NhZ2VzLS1oYXZlLW9sZGVzdCdcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICByZWY9e3RoaXMubWVzc2FnZXNSZWZ9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2hhdmVPbGRlc3QgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgIHtUaW1lbGluZS5nZXRXYXJuaW5nKHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiBsYXN0TWVhc3VyZWRXYXJuaW5nSGVpZ2h0IH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICB7cmVuZGVySGVyb1JvdyhpZCwgdW5ibHVyQXZhdGFyLCB1cGRhdGVTaGFyZWRHcm91cHMpfVxuICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgIHttZXNzYWdlTm9kZXN9XG5cbiAgICAgICAgICAgICAgICAgIHtpc1NvbWVvbmVUeXBpbmcgJiYgaGF2ZU5ld2VzdCAmJiByZW5kZXJUeXBpbmdCdWJibGUoaWQpfVxuXG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS10aW1lbGluZV9fbWVzc2FnZXNfX2F0LWJvdHRvbS1kZXRlY3RvclwiXG4gICAgICAgICAgICAgICAgICAgIHJlZj17dGhpcy5hdEJvdHRvbURldGVjdG9yUmVmfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17QVRfQk9UVE9NX0RFVEVDVE9SX1NUWUxFfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAge3Nob3VsZFNob3dTY3JvbGxEb3duQnV0dG9uID8gKFxuICAgICAgICAgICAgICAgIDxTY3JvbGxEb3duQnV0dG9uXG4gICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZD17aWR9XG4gICAgICAgICAgICAgICAgICB1bnJlYWRDb3VudD17YXJlVW5yZWFkQmVsb3dDdXJyZW50UG9zaXRpb24gPyB1bnJlYWRDb3VudCA6IDB9XG4gICAgICAgICAgICAgICAgICBzY3JvbGxEb3duPXt0aGlzLm9uQ2xpY2tTY3JvbGxEb3duQnV0dG9ufVxuICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvTWVhc3VyZT5cblxuICAgICAgICB7Qm9vbGVhbihpbnZpdGVkQ29udGFjdHNGb3JOZXdseUNyZWF0ZWRHcm91cC5sZW5ndGgpICYmIChcbiAgICAgICAgICA8TmV3bHlDcmVhdGVkR3JvdXBJbnZpdGVkQ29udGFjdHNEaWFsb2dcbiAgICAgICAgICAgIGNvbnRhY3RzPXtpbnZpdGVkQ29udGFjdHNGb3JOZXdseUNyZWF0ZWRHcm91cH1cbiAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBvbkNsb3NlPXtjbGVhckludml0ZWRVdWlkc0Zvck5ld2x5Q3JlYXRlZEdyb3VwfVxuICAgICAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge2NvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZ31cbiAgICAgIDwvPlxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXRXYXJuaW5nKFxuICAgIHsgd2FybmluZyB9OiBQcm9wc1R5cGUsXG4gICAgc3RhdGU6IFN0YXRlVHlwZVxuICApOiB1bmRlZmluZWQgfCBXYXJuaW5nVHlwZSB7XG4gICAgaWYgKCF3YXJuaW5nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN3aXRjaCAod2FybmluZy50eXBlKSB7XG4gICAgICBjYXNlIENvbnRhY3RTcG9vZmluZ1R5cGUuRGlyZWN0Q29udmVyc2F0aW9uV2l0aFNhbWVUaXRsZToge1xuICAgICAgICBjb25zdCB7IGhhc0Rpc21pc3NlZERpcmVjdENvbnRhY3RTcG9vZmluZ1dhcm5pbmcgfSA9IHN0YXRlO1xuICAgICAgICByZXR1cm4gaGFzRGlzbWlzc2VkRGlyZWN0Q29udGFjdFNwb29maW5nV2FybmluZyA/IHVuZGVmaW5lZCA6IHdhcm5pbmc7XG4gICAgICB9XG4gICAgICBjYXNlIENvbnRhY3RTcG9vZmluZ1R5cGUuTXVsdGlwbGVHcm91cE1lbWJlcnNXaXRoU2FtZVRpdGxlOlxuICAgICAgICByZXR1cm4gaGFzVW5hY2tub3dsZWRnZWRDb2xsaXNpb25zKFxuICAgICAgICAgIHdhcm5pbmcuYWNrbm93bGVkZ2VkR3JvdXBOYW1lQ29sbGlzaW9ucyxcbiAgICAgICAgICB3YXJuaW5nLmdyb3VwTmFtZUNvbGxpc2lvbnNcbiAgICAgICAgKVxuICAgICAgICAgID8gd2FybmluZ1xuICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcih3YXJuaW5nKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZUlkRnJvbUVsZW1lbnQoXG4gIGVsZW1lbnQ6IHVuZGVmaW5lZCB8IEVsZW1lbnRcbik6IHVuZGVmaW5lZCB8IHN0cmluZyB7XG4gIHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBlbGVtZW50LmRhdGFzZXQubWVzc2FnZUlkIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRSb3dJbmRleEZyb21FbGVtZW50KFxuICBlbGVtZW50OiB1bmRlZmluZWQgfCBFbGVtZW50XG4pOiB1bmRlZmluZWQgfCBudW1iZXIge1xuICByZXR1cm4gZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGVsZW1lbnQuZGF0YXNldC5pdGVtSW5kZXhcbiAgICA/IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC5pdGVtSW5kZXgsIDEwKVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBzaG93RGVidWdMb2coKSB7XG4gIHdpbmRvdy5zaG93RGVidWdMb2coKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBMkQ7QUFDM0Qsd0JBQXVCO0FBRXZCLG1CQUFrQjtBQUNsQixzQkFBK0I7QUFDL0IsMkJBQW9CO0FBRXBCLDhCQUFpQztBQUtqQyxvQkFBcUM7QUFDckMsOEJBQWlDO0FBQ2pDLHFDQUF3QztBQUN4QyxrQkFBZ0M7QUFNaEMsMkJBQThCO0FBRTlCLGtCQUFxQjtBQUNyQiw2QkFBZ0M7QUFDaEMsOEJBQWlDO0FBQ2pDLG9EQUF1RDtBQUN2RCw2QkFBb0M7QUFHcEMsdUNBQTRDO0FBQzVDLG9DQUF1QztBQUN2QywwQkFNTztBQUNQLHdCQUlPO0FBQ1AsK0JBQWtDO0FBQ2xDLHVCQUF1QjtBQUV2QixNQUFNLHNCQUFzQjtBQUM1QixNQUFNLDJCQUEyQixFQUFFLFFBQVEsb0JBQW9CO0FBRS9ELE1BQU0saUJBQWlCO0FBQ3ZCLE1BQU0sK0JBQStCO0FBQ3JDLE1BQU0sdUJBQXVCO0FBOEk3QixNQUFNLDBCQUEwQixPQUFPLHlCQUF5QjtBQVNoRSxNQUFNLGFBQWEsb0NBR2pCLENBQUMsVUFBcUIsT0FFdEIsQ0FBQyxVQUF1QztBQUN0QyxRQUFNLFNBQVMsd0JBQUssT0FBTztBQUFBLElBQ3pCO0FBQUEsSUFDQTtBQUFBLElB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
