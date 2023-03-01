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
var MessageDetail_exports = {};
__export(MessageDetail_exports, {
  MessageDetail: () => MessageDetail
});
module.exports = __toCommonJS(MessageDetail_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var import_Avatar = require("../Avatar");
var import_ContactName = require("./ContactName");
var import_ContextMenu = require("../ContextMenu");
var import_Time = require("../Time");
var import_Message = require("./Message");
var import_mapUtil = require("../../util/mapUtil");
var import_MessageSendState = require("../../messages/MessageSendState");
var import_util = require("../_util");
var log = __toESM(require("../../logging/log"));
var import_timestamp = require("../../util/timestamp");
const contactSortCollator = new Intl.Collator();
const _keyForError = /* @__PURE__ */ __name((error) => {
  return `${error.name}-${error.message}`;
}, "_keyForError");
class MessageDetail extends import_react.default.Component {
  constructor() {
    super(...arguments);
    this.focusRef = import_react.default.createRef();
    this.messageContainerRef = import_react.default.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.focusRef.current) {
        this.focusRef.current.focus();
      }
    });
  }
  renderAvatar(contact) {
    const { getPreferredBadge, i18n, theme } = this.props;
    const {
      acceptedMessageRequest,
      avatarPath,
      badges,
      color,
      isMe,
      name,
      phoneNumber,
      profileName,
      sharedGroupNames,
      title,
      unblurredAvatarPath
    } = contact;
    return /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest,
      avatarPath,
      badge: getPreferredBadge(badges),
      color,
      conversationType: "direct",
      i18n,
      isMe,
      name,
      phoneNumber,
      profileName,
      theme,
      title,
      sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      unblurredAvatarPath
    });
  }
  renderContact(contact) {
    const { i18n, showSafetyNumber } = this.props;
    const errors = contact.errors || [];
    const errorComponent = contact.isOutgoingKeyError ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__contact__error-buttons"
    }, /* @__PURE__ */ import_react.default.createElement("button", {
      type: "button",
      className: "module-message-detail__contact__show-safety-number",
      onClick: () => showSafetyNumber(contact.id)
    }, i18n("showSafetyNumber"))) : null;
    const unidentifiedDeliveryComponent = contact.isUnidentifiedDelivery ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__contact__unidentified-delivery-icon"
    }) : null;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: contact.id,
      className: "module-message-detail__contact"
    }, this.renderAvatar(contact), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__contact__text"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__contact__name"
    }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
      title: contact.title
    })), errors.map((error) => /* @__PURE__ */ import_react.default.createElement("div", {
      key: _keyForError(error),
      className: "module-message-detail__contact__error"
    }, error.message))), errorComponent, unidentifiedDeliveryComponent, contact.statusTimestamp && /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
      className: "module-message-detail__status-timestamp",
      timestamp: contact.statusTimestamp
    }, (0, import_timestamp.formatDateTimeLong)(i18n, contact.statusTimestamp)));
  }
  renderContactGroup(sendStatus, contacts) {
    const { i18n } = this.props;
    if (!contacts || !contacts.length) {
      return null;
    }
    const i18nKey = sendStatus === void 0 ? "from" : `MessageDetailsHeader--${sendStatus}`;
    const sortedContacts = [...contacts].sort((a, b) => contactSortCollator.compare(a.title, b.title));
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: i18nKey,
      className: "module-message-detail__contact-group"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-message-detail__contact-group__header", sendStatus && `module-message-detail__contact-group__header--${sendStatus}`)
    }, i18n(i18nKey)), sortedContacts.map((contact) => this.renderContact(contact)));
  }
  renderContacts() {
    const { contacts } = this.props;
    const contactsBySendStatus = (0, import_mapUtil.groupBy)(contacts, (contact) => contact.status);
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__contact-container"
    }, [
      void 0,
      import_MessageSendState.SendStatus.Failed,
      import_MessageSendState.SendStatus.Viewed,
      import_MessageSendState.SendStatus.Read,
      import_MessageSendState.SendStatus.Delivered,
      import_MessageSendState.SendStatus.Sent,
      import_MessageSendState.SendStatus.Pending
    ].map((sendStatus) => this.renderContactGroup(sendStatus, contactsBySendStatus.get(sendStatus))));
  }
  render() {
    const {
      errors,
      message,
      receivedAt,
      sentAt,
      checkForAccount,
      clearSelectedMessage,
      contactNameColor,
      displayTapToViewMessage,
      doubleCheckMissingQuoteReference,
      getPreferredBadge,
      i18n,
      interactionMode,
      kickOffAttachmentDownload,
      markAttachmentAsCorrupted,
      markViewed,
      openConversation,
      openGiftBadge,
      openLink,
      reactToMessage,
      renderAudioAttachment,
      renderEmojiPicker,
      renderReactionPicker,
      replyToMessage,
      retryDeleteForEveryone,
      retrySend,
      showContactDetail,
      showContactModal,
      showExpiredIncomingTapToViewToast,
      showExpiredOutgoingTapToViewToast,
      showForwardMessageModal,
      showVisualAttachment,
      startConversation,
      theme,
      viewStory
    } = this.props;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail",
      tabIndex: 0,
      ref: this.focusRef
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-message-detail__message-container",
      ref: this.messageContainerRef
    }, /* @__PURE__ */ import_react.default.createElement(import_Message.Message, {
      ...message,
      renderingContext: "conversation/MessageDetail",
      checkForAccount,
      clearSelectedMessage,
      contactNameColor,
      containerElementRef: this.messageContainerRef,
      containerWidthBreakpoint: import_util.WidthBreakpoint.Wide,
      deleteMessage: () => log.warn("MessageDetail: deleteMessage called!"),
      deleteMessageForEveryone: () => log.warn("MessageDetail: deleteMessageForEveryone called!"),
      disableMenu: true,
      disableScroll: true,
      displayLimit: Number.MAX_SAFE_INTEGER,
      displayTapToViewMessage,
      downloadAttachment: () => log.warn("MessageDetail: deleteMessageForEveryone called!"),
      doubleCheckMissingQuoteReference,
      getPreferredBadge,
      i18n,
      interactionMode,
      kickOffAttachmentDownload,
      markAttachmentAsCorrupted,
      markViewed,
      messageExpanded: import_lodash.noop,
      openConversation,
      openGiftBadge,
      openLink,
      reactToMessage,
      renderAudioAttachment,
      renderEmojiPicker,
      renderReactionPicker,
      replyToMessage,
      retryDeleteForEveryone,
      retrySend,
      shouldCollapseAbove: false,
      shouldCollapseBelow: false,
      shouldHideMetadata: false,
      showForwardMessageModal,
      scrollToQuotedMessage: () => {
        log.warn("MessageDetail: scrollToQuotedMessage called!");
      },
      showContactDetail,
      showContactModal,
      showExpiredIncomingTapToViewToast,
      showExpiredOutgoingTapToViewToast,
      showMessageDetail: () => {
        log.warn("MessageDetail: deleteMessageForEveryone called!");
      },
      showVisualAttachment,
      startConversation,
      theme,
      viewStory
    })), /* @__PURE__ */ import_react.default.createElement("table", {
      className: "module-message-detail__info"
    }, /* @__PURE__ */ import_react.default.createElement("tbody", null, (errors || []).map((error) => /* @__PURE__ */ import_react.default.createElement("tr", {
      key: _keyForError(error)
    }, /* @__PURE__ */ import_react.default.createElement("td", {
      className: "module-message-detail__label"
    }, i18n("error")), /* @__PURE__ */ import_react.default.createElement("td", null, " ", /* @__PURE__ */ import_react.default.createElement("span", {
      className: "error-message"
    }, error.message), " "))), /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", {
      className: "module-message-detail__label"
    }, i18n("sent")), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      i18n,
      menuOptions: [
        {
          icon: "StoryDetailsModal__copy-icon",
          label: i18n("StoryDetailsModal__copy-timestamp"),
          onClick: () => {
            window.navigator.clipboard.writeText(String(sentAt));
          }
        }
      ]
    }, /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
      timestamp: sentAt
    }, (0, import_timestamp.formatDateTimeLong)(i18n, sentAt)), " ", /* @__PURE__ */ import_react.default.createElement("span", {
      className: "module-message-detail__unix-timestamp"
    }, "(", sentAt, ")"))))), receivedAt && message.direction === "incoming" ? /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", {
      className: "module-message-detail__label"
    }, i18n("received")), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
      timestamp: receivedAt
    }, (0, import_timestamp.formatDateTimeLong)(i18n, receivedAt)), " ", /* @__PURE__ */ import_react.default.createElement("span", {
      className: "module-message-detail__unix-timestamp"
    }, "(", receivedAt, ")"))) : null)), this.renderContacts());
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageDetail
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZURldGFpbC50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFJlYWN0Q2hpbGQsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBBdmF0YXIsIEF2YXRhclNpemUgfSBmcm9tICcuLi9BdmF0YXInO1xuaW1wb3J0IHsgQ29udGFjdE5hbWUgfSBmcm9tICcuL0NvbnRhY3ROYW1lJztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi4vQ29udGV4dE1lbnUnO1xuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4uL1RpbWUnO1xuaW1wb3J0IHR5cGUge1xuICBQcm9wcyBhcyBNZXNzYWdlUHJvcHNUeXBlLFxuICBQcm9wc0RhdGEgYXMgTWVzc2FnZVByb3BzRGF0YVR5cGUsXG59IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSwgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB7IGdyb3VwQnkgfSBmcm9tICcuLi8uLi91dGlsL21hcFV0aWwnO1xuaW1wb3J0IHR5cGUgeyBDb250YWN0TmFtZUNvbG9yVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgeyBTZW5kU3RhdHVzIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgeyBXaWR0aEJyZWFrcG9pbnQgfSBmcm9tICcuLi9fdXRpbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgZm9ybWF0RGF0ZVRpbWVMb25nIH0gZnJvbSAnLi4vLi4vdXRpbC90aW1lc3RhbXAnO1xuXG5leHBvcnQgdHlwZSBDb250YWN0ID0gUGljazxcbiAgQ29udmVyc2F0aW9uVHlwZSxcbiAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgfCAnYXZhdGFyUGF0aCdcbiAgfCAnYmFkZ2VzJ1xuICB8ICdjb2xvcidcbiAgfCAnaWQnXG4gIHwgJ2lzTWUnXG4gIHwgJ25hbWUnXG4gIHwgJ3Bob25lTnVtYmVyJ1xuICB8ICdwcm9maWxlTmFtZSdcbiAgfCAnc2hhcmVkR3JvdXBOYW1lcydcbiAgfCAndGl0bGUnXG4gIHwgJ3VuYmx1cnJlZEF2YXRhclBhdGgnXG4+ICYge1xuICBzdGF0dXM/OiBTZW5kU3RhdHVzO1xuICBzdGF0dXNUaW1lc3RhbXA/OiBudW1iZXI7XG5cbiAgaXNPdXRnb2luZ0tleUVycm9yOiBib29sZWFuO1xuICBpc1VuaWRlbnRpZmllZERlbGl2ZXJ5OiBib29sZWFuO1xuXG4gIGVycm9ycz86IEFycmF5PEVycm9yPjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzRGF0YSA9IHtcbiAgLy8gQW4gdW5kZWZpbmVkIHN0YXR1cyBtZWFucyB0aGV5IHdlcmUgdGhlIHNlbmRlciBhbmQgaXQncyBhbiBpbmNvbWluZyBtZXNzYWdlLiBJZlxuICAvLyAgIGB1bmRlZmluZWRgIGlzIGEgc3RhdHVzLCB0aGVyZSBzaG91bGQgYmUgbm8gb3RoZXIgaXRlbXMgaW4gdGhlIGFycmF5OyBpZiB0aGVyZSBhcmVcbiAgLy8gICBhbnkgZGVmaW5lZCBzdGF0dXNlcywgYHVuZGVmaW5lZGAgc2hvdWxkbid0IGJlIHByZXNlbnQuXG4gIGNvbnRhY3RzOiBSZWFkb25seUFycmF5PENvbnRhY3Q+O1xuXG4gIGNvbnRhY3ROYW1lQ29sb3I/OiBDb250YWN0TmFtZUNvbG9yVHlwZTtcbiAgZXJyb3JzOiBBcnJheTxFcnJvcj47XG4gIG1lc3NhZ2U6IE9taXQ8TWVzc2FnZVByb3BzRGF0YVR5cGUsICdyZW5kZXJpbmdDb250ZXh0Jz47XG4gIHJlY2VpdmVkQXQ6IG51bWJlcjtcbiAgc2VudEF0OiBudW1iZXI7XG5cbiAgc2hvd1NhZmV0eU51bWJlcjogKGNvbnRhY3RJZDogc3RyaW5nKSA9PiB2b2lkO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICB0aGVtZTogVGhlbWVUeXBlO1xuICBnZXRQcmVmZXJyZWRCYWRnZTogUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGU7XG59ICYgUGljazxNZXNzYWdlUHJvcHNUeXBlLCAnZ2V0UHJlZmVycmVkQmFkZ2UnIHwgJ2ludGVyYWN0aW9uTW9kZSc+O1xuXG5leHBvcnQgdHlwZSBQcm9wc0JhY2tib25lQWN0aW9ucyA9IFBpY2s8XG4gIE1lc3NhZ2VQcm9wc1R5cGUsXG4gIHwgJ2Rpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlJ1xuICB8ICdraWNrT2ZmQXR0YWNobWVudERvd25sb2FkJ1xuICB8ICdtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkJ1xuICB8ICdtYXJrVmlld2VkJ1xuICB8ICdvcGVuQ29udmVyc2F0aW9uJ1xuICB8ICdvcGVuR2lmdEJhZGdlJ1xuICB8ICdvcGVuTGluaydcbiAgfCAncmVhY3RUb01lc3NhZ2UnXG4gIHwgJ3JlbmRlckF1ZGlvQXR0YWNobWVudCdcbiAgfCAncmVuZGVyRW1vamlQaWNrZXInXG4gIHwgJ3JlbmRlclJlYWN0aW9uUGlja2VyJ1xuICB8ICdyZXBseVRvTWVzc2FnZSdcbiAgfCAncmV0cnlEZWxldGVGb3JFdmVyeW9uZSdcbiAgfCAncmV0cnlTZW5kJ1xuICB8ICdzaG93Q29udGFjdERldGFpbCdcbiAgfCAnc2hvd0NvbnRhY3RNb2RhbCdcbiAgfCAnc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0J1xuICB8ICdzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3QnXG4gIHwgJ3Nob3dGb3J3YXJkTWVzc2FnZU1vZGFsJ1xuICB8ICdzaG93VmlzdWFsQXR0YWNobWVudCdcbiAgfCAnc3RhcnRDb252ZXJzYXRpb24nXG4+O1xuXG5leHBvcnQgdHlwZSBQcm9wc1JlZHV4QWN0aW9ucyA9IFBpY2s8XG4gIE1lc3NhZ2VQcm9wc1R5cGUsXG4gIHwgJ2NsZWFyU2VsZWN0ZWRNZXNzYWdlJ1xuICB8ICdkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSdcbiAgfCAnY2hlY2tGb3JBY2NvdW50J1xuICB8ICd2aWV3U3RvcnknXG4+O1xuXG5leHBvcnQgdHlwZSBFeHRlcm5hbFByb3BzID0gUHJvcHNEYXRhICYgUHJvcHNCYWNrYm9uZUFjdGlvbnM7XG5leHBvcnQgdHlwZSBQcm9wcyA9IFByb3BzRGF0YSAmIFByb3BzQmFja2JvbmVBY3Rpb25zICYgUHJvcHNSZWR1eEFjdGlvbnM7XG5cbmNvbnN0IGNvbnRhY3RTb3J0Q29sbGF0b3IgPSBuZXcgSW50bC5Db2xsYXRvcigpO1xuXG5jb25zdCBfa2V5Rm9yRXJyb3IgPSAoZXJyb3I6IEVycm9yKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGAke2Vycm9yLm5hbWV9LSR7ZXJyb3IubWVzc2FnZX1gO1xufTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VEZXRhaWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHM+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBmb2N1c1JlZiA9IFJlYWN0LmNyZWF0ZVJlZjxIVE1MRGl2RWxlbWVudD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBtZXNzYWdlQ29udGFpbmVyUmVmID0gUmVhY3QuY3JlYXRlUmVmPEhUTUxEaXZFbGVtZW50PigpO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBjb21wb25lbnREaWRNb3VudCgpOiB2b2lkIHtcbiAgICAvLyBXaGVuIHRoaXMgY29tcG9uZW50IGlzIGNyZWF0ZWQsIGl0J3MgaW5pdGlhbGx5IG5vdCBwYXJ0IG9mIHRoZSBET00sIGFuZCB0aGVuIGl0J3NcbiAgICAvLyAgIGFkZGVkIG9mZi1zY3JlZW4gYW5kIGFuaW1hdGVkIGluLiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgZm9jdXMgdGFrZXMuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5mb2N1c1JlZi5jdXJyZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXNSZWYuY3VycmVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlbmRlckF2YXRhcihjb250YWN0OiBDb250YWN0KTogSlNYLkVsZW1lbnQge1xuICAgIGNvbnN0IHsgZ2V0UHJlZmVycmVkQmFkZ2UsIGkxOG4sIHRoZW1lIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gICAgICBhdmF0YXJQYXRoLFxuICAgICAgYmFkZ2VzLFxuICAgICAgY29sb3IsXG4gICAgICBpc01lLFxuICAgICAgbmFtZSxcbiAgICAgIHBob25lTnVtYmVyLFxuICAgICAgcHJvZmlsZU5hbWUsXG4gICAgICBzaGFyZWRHcm91cE5hbWVzLFxuICAgICAgdGl0bGUsXG4gICAgICB1bmJsdXJyZWRBdmF0YXJQYXRoLFxuICAgIH0gPSBjb250YWN0O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBdmF0YXJcbiAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17YWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgYXZhdGFyUGF0aD17YXZhdGFyUGF0aH1cbiAgICAgICAgYmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlKGJhZGdlcyl9XG4gICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgY29udmVyc2F0aW9uVHlwZT1cImRpcmVjdFwiXG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGlzTWU9e2lzTWV9XG4gICAgICAgIG5hbWU9e25hbWV9XG4gICAgICAgIHBob25lTnVtYmVyPXtwaG9uZU51bWJlcn1cbiAgICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17c2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICB1bmJsdXJyZWRBdmF0YXJQYXRoPXt1bmJsdXJyZWRBdmF0YXJQYXRofVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlbmRlckNvbnRhY3QoY29udGFjdDogQ29udGFjdCk6IEpTWC5FbGVtZW50IHtcbiAgICBjb25zdCB7IGkxOG4sIHNob3dTYWZldHlOdW1iZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZXJyb3JzID0gY29udGFjdC5lcnJvcnMgfHwgW107XG5cbiAgICBjb25zdCBlcnJvckNvbXBvbmVudCA9IGNvbnRhY3QuaXNPdXRnb2luZ0tleUVycm9yID8gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZS1kZXRhaWxfX2NvbnRhY3RfX2Vycm9yLWJ1dHRvbnNcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlLWRldGFpbF9fY29udGFjdF9fc2hvdy1zYWZldHktbnVtYmVyXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzaG93U2FmZXR5TnVtYmVyKGNvbnRhY3QuaWQpfVxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ3Nob3dTYWZldHlOdW1iZXInKX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgICBjb25zdCB1bmlkZW50aWZpZWREZWxpdmVyeUNvbXBvbmVudCA9IGNvbnRhY3QuaXNVbmlkZW50aWZpZWREZWxpdmVyeSA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19jb250YWN0X191bmlkZW50aWZpZWQtZGVsaXZlcnktaWNvblwiIC8+XG4gICAgKSA6IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e2NvbnRhY3QuaWR9IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlLWRldGFpbF9fY29udGFjdFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJBdmF0YXIoY29udGFjdCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19jb250YWN0X190ZXh0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZS1kZXRhaWxfX2NvbnRhY3RfX25hbWVcIj5cbiAgICAgICAgICAgIDxDb250YWN0TmFtZSB0aXRsZT17Y29udGFjdC50aXRsZX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7ZXJyb3JzLm1hcChlcnJvciA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17X2tleUZvckVycm9yKGVycm9yKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19jb250YWN0X19lcnJvclwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtlcnJvci5tZXNzYWdlfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7ZXJyb3JDb21wb25lbnR9XG4gICAgICAgIHt1bmlkZW50aWZpZWREZWxpdmVyeUNvbXBvbmVudH1cbiAgICAgICAge2NvbnRhY3Quc3RhdHVzVGltZXN0YW1wICYmIChcbiAgICAgICAgICA8VGltZVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19zdGF0dXMtdGltZXN0YW1wXCJcbiAgICAgICAgICAgIHRpbWVzdGFtcD17Y29udGFjdC5zdGF0dXNUaW1lc3RhbXB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2Zvcm1hdERhdGVUaW1lTG9uZyhpMThuLCBjb250YWN0LnN0YXR1c1RpbWVzdGFtcCl9XG4gICAgICAgICAgPC9UaW1lPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ29udGFjdEdyb3VwKFxuICAgIHNlbmRTdGF0dXM6IHVuZGVmaW5lZCB8IFNlbmRTdGF0dXMsXG4gICAgY29udGFjdHM6IHVuZGVmaW5lZCB8IFJlYWRvbmx5QXJyYXk8Q29udGFjdD5cbiAgKTogUmVhY3ROb2RlIHtcbiAgICBjb25zdCB7IGkxOG4gfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKCFjb250YWN0cyB8fCAhY29udGFjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpMThuS2V5ID1cbiAgICAgIHNlbmRTdGF0dXMgPT09IHVuZGVmaW5lZCA/ICdmcm9tJyA6IGBNZXNzYWdlRGV0YWlsc0hlYWRlci0tJHtzZW5kU3RhdHVzfWA7XG5cbiAgICBjb25zdCBzb3J0ZWRDb250YWN0cyA9IFsuLi5jb250YWN0c10uc29ydCgoYSwgYikgPT5cbiAgICAgIGNvbnRhY3RTb3J0Q29sbGF0b3IuY29tcGFyZShhLnRpdGxlLCBiLnRpdGxlKVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e2kxOG5LZXl9IGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlLWRldGFpbF9fY29udGFjdC1ncm91cFwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgJ21vZHVsZS1tZXNzYWdlLWRldGFpbF9fY29udGFjdC1ncm91cF9faGVhZGVyJyxcbiAgICAgICAgICAgIHNlbmRTdGF0dXMgJiZcbiAgICAgICAgICAgICAgYG1vZHVsZS1tZXNzYWdlLWRldGFpbF9fY29udGFjdC1ncm91cF9faGVhZGVyLS0ke3NlbmRTdGF0dXN9YFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICB7aTE4bihpMThuS2V5KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtzb3J0ZWRDb250YWN0cy5tYXAoY29udGFjdCA9PiB0aGlzLnJlbmRlckNvbnRhY3QoY29udGFjdCkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ29udGFjdHMoKTogUmVhY3RDaGlsZCB7XG4gICAgLy8gVGhpcyBhc3N1bWVzIHRoYXQgdGhlIGxpc3QgZWl0aGVyIGNvbnRhaW5zIG9uZSBzZW5kZXIgKGEgc3RhdHVzIG9mIGB1bmRlZmluZWRgKSBvclxuICAgIC8vICAgMSsgY29udGFjdHMgd2l0aCBgU2VuZFN0YXR1c2BlcywgYnV0IGl0IGRvZXNuJ3QgY2hlY2sgdGhhdCBhc3N1bXB0aW9uLlxuICAgIGNvbnN0IHsgY29udGFjdHMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBjb250YWN0c0J5U2VuZFN0YXR1cyA9IGdyb3VwQnkoY29udGFjdHMsIGNvbnRhY3QgPT4gY29udGFjdC5zdGF0dXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19jb250YWN0LWNvbnRhaW5lclwiPlxuICAgICAgICB7W1xuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICBTZW5kU3RhdHVzLkZhaWxlZCxcbiAgICAgICAgICBTZW5kU3RhdHVzLlZpZXdlZCxcbiAgICAgICAgICBTZW5kU3RhdHVzLlJlYWQsXG4gICAgICAgICAgU2VuZFN0YXR1cy5EZWxpdmVyZWQsXG4gICAgICAgICAgU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgIFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgXS5tYXAoc2VuZFN0YXR1cyA9PlxuICAgICAgICAgIHRoaXMucmVuZGVyQ29udGFjdEdyb3VwKFxuICAgICAgICAgICAgc2VuZFN0YXR1cyxcbiAgICAgICAgICAgIGNvbnRhY3RzQnlTZW5kU3RhdHVzLmdldChzZW5kU3RhdHVzKVxuICAgICAgICAgIClcbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgb3ZlcnJpZGUgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcbiAgICBjb25zdCB7XG4gICAgICBlcnJvcnMsXG4gICAgICBtZXNzYWdlLFxuICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgIHNlbnRBdCxcblxuICAgICAgY2hlY2tGb3JBY2NvdW50LFxuICAgICAgY2xlYXJTZWxlY3RlZE1lc3NhZ2UsXG4gICAgICBjb250YWN0TmFtZUNvbG9yLFxuICAgICAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2UsXG4gICAgICBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSxcbiAgICAgIGdldFByZWZlcnJlZEJhZGdlLFxuICAgICAgaTE4bixcbiAgICAgIGludGVyYWN0aW9uTW9kZSxcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQsXG4gICAgICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkLFxuICAgICAgbWFya1ZpZXdlZCxcbiAgICAgIG9wZW5Db252ZXJzYXRpb24sXG4gICAgICBvcGVuR2lmdEJhZGdlLFxuICAgICAgb3BlbkxpbmssXG4gICAgICByZWFjdFRvTWVzc2FnZSxcbiAgICAgIHJlbmRlckF1ZGlvQXR0YWNobWVudCxcbiAgICAgIHJlbmRlckVtb2ppUGlja2VyLFxuICAgICAgcmVuZGVyUmVhY3Rpb25QaWNrZXIsXG4gICAgICByZXBseVRvTWVzc2FnZSxcbiAgICAgIHJldHJ5RGVsZXRlRm9yRXZlcnlvbmUsXG4gICAgICByZXRyeVNlbmQsXG4gICAgICBzaG93Q29udGFjdERldGFpbCxcbiAgICAgIHNob3dDb250YWN0TW9kYWwsXG4gICAgICBzaG93RXhwaXJlZEluY29taW5nVGFwVG9WaWV3VG9hc3QsXG4gICAgICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3QsXG4gICAgICBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbCxcbiAgICAgIHNob3dWaXN1YWxBdHRhY2htZW50LFxuICAgICAgc3RhcnRDb252ZXJzYXRpb24sXG4gICAgICB0aGVtZSxcbiAgICAgIHZpZXdTdG9yeSxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvbm8tbm9uaW50ZXJhY3RpdmUtdGFiaW5kZXhcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsXCIgdGFiSW5kZXg9ezB9IHJlZj17dGhpcy5mb2N1c1JlZn0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZS1kZXRhaWxfX21lc3NhZ2UtY29udGFpbmVyXCJcbiAgICAgICAgICByZWY9e3RoaXMubWVzc2FnZUNvbnRhaW5lclJlZn1cbiAgICAgICAgPlxuICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICB7Li4ubWVzc2FnZX1cbiAgICAgICAgICAgIHJlbmRlcmluZ0NvbnRleHQ9XCJjb252ZXJzYXRpb24vTWVzc2FnZURldGFpbFwiXG4gICAgICAgICAgICBjaGVja0ZvckFjY291bnQ9e2NoZWNrRm9yQWNjb3VudH1cbiAgICAgICAgICAgIGNsZWFyU2VsZWN0ZWRNZXNzYWdlPXtjbGVhclNlbGVjdGVkTWVzc2FnZX1cbiAgICAgICAgICAgIGNvbnRhY3ROYW1lQ29sb3I9e2NvbnRhY3ROYW1lQ29sb3J9XG4gICAgICAgICAgICBjb250YWluZXJFbGVtZW50UmVmPXt0aGlzLm1lc3NhZ2VDb250YWluZXJSZWZ9XG4gICAgICAgICAgICBjb250YWluZXJXaWR0aEJyZWFrcG9pbnQ9e1dpZHRoQnJlYWtwb2ludC5XaWRlfVxuICAgICAgICAgICAgZGVsZXRlTWVzc2FnZT17KCkgPT5cbiAgICAgICAgICAgICAgbG9nLndhcm4oJ01lc3NhZ2VEZXRhaWw6IGRlbGV0ZU1lc3NhZ2UgY2FsbGVkIScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmU9eygpID0+XG4gICAgICAgICAgICAgIGxvZy53YXJuKCdNZXNzYWdlRGV0YWlsOiBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUgY2FsbGVkIScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNhYmxlTWVudVxuICAgICAgICAgICAgZGlzYWJsZVNjcm9sbFxuICAgICAgICAgICAgZGlzcGxheUxpbWl0PXtOdW1iZXIuTUFYX1NBRkVfSU5URUdFUn1cbiAgICAgICAgICAgIGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlPXtkaXNwbGF5VGFwVG9WaWV3TWVzc2FnZX1cbiAgICAgICAgICAgIGRvd25sb2FkQXR0YWNobWVudD17KCkgPT5cbiAgICAgICAgICAgICAgbG9nLndhcm4oJ01lc3NhZ2VEZXRhaWw6IGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZSBjYWxsZWQhJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvdWJsZUNoZWNrTWlzc2luZ1F1b3RlUmVmZXJlbmNlPXtkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZX1cbiAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpbnRlcmFjdGlvbk1vZGU9e2ludGVyYWN0aW9uTW9kZX1cbiAgICAgICAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQ9e2tpY2tPZmZBdHRhY2htZW50RG93bmxvYWR9XG4gICAgICAgICAgICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkPXttYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkfVxuICAgICAgICAgICAgbWFya1ZpZXdlZD17bWFya1ZpZXdlZH1cbiAgICAgICAgICAgIG1lc3NhZ2VFeHBhbmRlZD17bm9vcH1cbiAgICAgICAgICAgIG9wZW5Db252ZXJzYXRpb249e29wZW5Db252ZXJzYXRpb259XG4gICAgICAgICAgICBvcGVuR2lmdEJhZGdlPXtvcGVuR2lmdEJhZGdlfVxuICAgICAgICAgICAgb3Blbkxpbms9e29wZW5MaW5rfVxuICAgICAgICAgICAgcmVhY3RUb01lc3NhZ2U9e3JlYWN0VG9NZXNzYWdlfVxuICAgICAgICAgICAgcmVuZGVyQXVkaW9BdHRhY2htZW50PXtyZW5kZXJBdWRpb0F0dGFjaG1lbnR9XG4gICAgICAgICAgICByZW5kZXJFbW9qaVBpY2tlcj17cmVuZGVyRW1vamlQaWNrZXJ9XG4gICAgICAgICAgICByZW5kZXJSZWFjdGlvblBpY2tlcj17cmVuZGVyUmVhY3Rpb25QaWNrZXJ9XG4gICAgICAgICAgICByZXBseVRvTWVzc2FnZT17cmVwbHlUb01lc3NhZ2V9XG4gICAgICAgICAgICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lPXtyZXRyeURlbGV0ZUZvckV2ZXJ5b25lfVxuICAgICAgICAgICAgcmV0cnlTZW5kPXtyZXRyeVNlbmR9XG4gICAgICAgICAgICBzaG91bGRDb2xsYXBzZUFib3ZlPXtmYWxzZX1cbiAgICAgICAgICAgIHNob3VsZENvbGxhcHNlQmVsb3c9e2ZhbHNlfVxuICAgICAgICAgICAgc2hvdWxkSGlkZU1ldGFkYXRhPXtmYWxzZX1cbiAgICAgICAgICAgIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsPXtzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbH1cbiAgICAgICAgICAgIHNjcm9sbFRvUXVvdGVkTWVzc2FnZT17KCkgPT4ge1xuICAgICAgICAgICAgICBsb2cud2FybignTWVzc2FnZURldGFpbDogc2Nyb2xsVG9RdW90ZWRNZXNzYWdlIGNhbGxlZCEnKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzaG93Q29udGFjdERldGFpbD17c2hvd0NvbnRhY3REZXRhaWx9XG4gICAgICAgICAgICBzaG93Q29udGFjdE1vZGFsPXtzaG93Q29udGFjdE1vZGFsfVxuICAgICAgICAgICAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0PXtcbiAgICAgICAgICAgICAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3Q9e1xuICAgICAgICAgICAgICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3dNZXNzYWdlRGV0YWlsPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGxvZy53YXJuKCdNZXNzYWdlRGV0YWlsOiBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUgY2FsbGVkIScpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHNob3dWaXN1YWxBdHRhY2htZW50PXtzaG93VmlzdWFsQXR0YWNobWVudH1cbiAgICAgICAgICAgIHN0YXJ0Q29udmVyc2F0aW9uPXtzdGFydENvbnZlcnNhdGlvbn1cbiAgICAgICAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgICAgICAgIHZpZXdTdG9yeT17dmlld1N0b3J5fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19pbmZvXCI+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgeyhlcnJvcnMgfHwgW10pLm1hcChlcnJvciA9PiAoXG4gICAgICAgICAgICAgIDx0ciBrZXk9e19rZXlGb3JFcnJvcihlcnJvcil9PlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZS1kZXRhaWxfX2xhYmVsXCI+XG4gICAgICAgICAgICAgICAgICB7aTE4bignZXJyb3InKX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJlcnJvci1tZXNzYWdlXCI+e2Vycm9yLm1lc3NhZ2V9PC9zcGFuPnsnICd9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19sYWJlbFwiPntpMThuKCdzZW50Jyl9PC90ZD5cbiAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgIDxDb250ZXh0TWVudVxuICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgIG1lbnVPcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnU3RvcnlEZXRhaWxzTW9kYWxfX2NvcHktaWNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5RGV0YWlsc01vZGFsX19jb3B5LXRpbWVzdGFtcCcpLFxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChTdHJpbmcoc2VudEF0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgPFRpbWUgdGltZXN0YW1wPXtzZW50QXR9PlxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlVGltZUxvbmcoaTE4biwgc2VudEF0KX1cbiAgICAgICAgICAgICAgICAgICAgPC9UaW1lPnsnICd9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vZHVsZS1tZXNzYWdlLWRldGFpbF9fdW5peC10aW1lc3RhbXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAoe3NlbnRBdH0pXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgIDwvQ29udGV4dE1lbnU+XG4gICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAge3JlY2VpdmVkQXQgJiYgbWVzc2FnZS5kaXJlY3Rpb24gPT09ICdpbmNvbWluZycgPyAoXG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibW9kdWxlLW1lc3NhZ2UtZGV0YWlsX19sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAge2kxOG4oJ3JlY2VpdmVkJyl9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICA8VGltZSB0aW1lc3RhbXA9e3JlY2VpdmVkQXR9PlxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZVRpbWVMb25nKGkxOG4sIHJlY2VpdmVkQXQpfVxuICAgICAgICAgICAgICAgICAgPC9UaW1lPnsnICd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb2R1bGUtbWVzc2FnZS1kZXRhaWxfX3VuaXgtdGltZXN0YW1wXCI+XG4gICAgICAgICAgICAgICAgICAgICh7cmVjZWl2ZWRBdH0pXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbnRhY3RzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBQ2xCLHdCQUF1QjtBQUN2QixvQkFBcUI7QUFFckIsb0JBQW1DO0FBQ25DLHlCQUE0QjtBQUM1Qix5QkFBNEI7QUFDNUIsa0JBQXFCO0FBS3JCLHFCQUF3QjtBQUl4QixxQkFBd0I7QUFFeEIsOEJBQTJCO0FBQzNCLGtCQUFnQztBQUNoQyxVQUFxQjtBQUNyQix1QkFBbUM7QUFnRm5DLE1BQU0sc0JBQXNCLElBQUksS0FBSyxTQUFTO0FBRTlDLE1BQU0sZUFBZSx3QkFBQyxVQUF5QjtBQUM3QyxTQUFPLEdBQUcsTUFBTSxRQUFRLE1BQU07QUFDaEMsR0FGcUI7QUFJZCxNQUFNLHNCQUFzQixxQkFBTSxVQUFpQjtBQUFBLEVBQW5EO0FBQUE7QUFDWSxvQkFBVyxxQkFBTSxVQUEwQjtBQUMzQywrQkFBc0IscUJBQU0sVUFBMEI7QUFBQTtBQUFBLEVBRXZELG9CQUEwQjtBQUd4QyxlQUFXLE1BQU07QUFDZixVQUFJLEtBQUssU0FBUyxTQUFTO0FBQ3pCLGFBQUssU0FBUyxRQUFRLE1BQU07QUFBQSxNQUM5QjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVPLGFBQWEsU0FBK0I7QUFDakQsVUFBTSxFQUFFLG1CQUFtQixNQUFNLFVBQVUsS0FBSztBQUNoRCxVQUFNO0FBQUEsTUFDSjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNFO0FBRUosV0FDRSxtREFBQztBQUFBLE1BQ0M7QUFB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
