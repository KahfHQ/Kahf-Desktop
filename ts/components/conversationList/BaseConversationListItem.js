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
var BaseConversationListItem_exports = {};
__export(BaseConversationListItem_exports, {
  BaseConversationListItem: () => BaseConversationListItem,
  DATE_CLASS_NAME: () => DATE_CLASS_NAME,
  HEADER_CONTACT_NAME_CLASS_NAME: () => HEADER_CONTACT_NAME_CLASS_NAME,
  HEADER_NAME_CLASS_NAME: () => HEADER_NAME_CLASS_NAME,
  MESSAGE_TEXT_CLASS_NAME: () => MESSAGE_TEXT_CLASS_NAME
});
module.exports = __toCommonJS(BaseConversationListItem_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var import_uuid = require("uuid");
var import_Avatar = require("../Avatar");
var import_isConversationUnread = require("../../util/isConversationUnread");
var import_util = require("../_util");
var import_Spinner = require("../Spinner");
var import_Time = require("../Time");
var import_timestamp = require("../../util/timestamp");
var durations = __toESM(require("../../util/durations"));
const BASE_CLASS_NAME = "module-conversation-list__item--contact-or-conversation";
const AVATAR_CONTAINER_CLASS_NAME = `${BASE_CLASS_NAME}__avatar-container`;
const CONTENT_CLASS_NAME = `${BASE_CLASS_NAME}__content`;
const HEADER_CLASS_NAME = `${CONTENT_CLASS_NAME}__header`;
const HEADER_NAME_CLASS_NAME = `${HEADER_CLASS_NAME}__name`;
const HEADER_CONTACT_NAME_CLASS_NAME = `${HEADER_NAME_CLASS_NAME}__contact-name`;
const DATE_CLASS_NAME = `${HEADER_CLASS_NAME}__date`;
const MESSAGE_CLASS_NAME = `${CONTENT_CLASS_NAME}__message`;
const MESSAGE_TEXT_CLASS_NAME = `${MESSAGE_CLASS_NAME}__text`;
const CHECKBOX_CONTAINER_CLASS_NAME = `${BASE_CLASS_NAME}__checkbox--container`;
const CHECKBOX_CLASS_NAME = `${BASE_CLASS_NAME}__checkbox`;
const SPINNER_CLASS_NAME = `${BASE_CLASS_NAME}__spinner`;
const BaseConversationListItem = import_react.default.memo(/* @__PURE__ */ __name(function BaseConversationListItem2(props) {
  const {
    acceptedMessageRequest,
    avatarPath,
    checked,
    color,
    conversationType,
    disabled,
    headerDate,
    headerName,
    i18n,
    id,
    isMe,
    isNoteToSelf,
    isUsernameSearchResult,
    isSelected,
    markedUnread,
    messageStatusIcon,
    messageText,
    messageTextIsAlwaysFullSize,
    name,
    onClick,
    phoneNumber,
    profileName,
    sharedGroupNames,
    shouldShowSpinner,
    title,
    unblurredAvatarPath,
    unreadCount
  } = props;
  const identifier = id ? (0, import_util.cleanId)(id) : void 0;
  const htmlId = (0, import_react.useMemo)(() => (0, import_uuid.v4)(), []);
  const isUnread = (0, import_isConversationUnread.isConversationUnread)({ markedUnread, unreadCount });
  const isAvatarNoteToSelf = (0, import_lodash.isBoolean)(isNoteToSelf) ? isNoteToSelf : Boolean(isMe);
  const isCheckbox = (0, import_lodash.isBoolean)(checked);
  let actionNode;
  if (shouldShowSpinner) {
    actionNode = /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      size: "20px",
      svgSize: "small",
      moduleClassName: SPINNER_CLASS_NAME,
      direction: "on-progress-dialog"
    });
  } else if (isCheckbox) {
    let ariaLabel;
    if (disabled) {
      ariaLabel = i18n("cannotSelectContact", [title]);
    } else if (checked) {
      ariaLabel = i18n("deselectContact", [title]);
    } else {
      ariaLabel = i18n("selectContact", [title]);
    }
    actionNode = /* @__PURE__ */ import_react.default.createElement("div", {
      className: CHECKBOX_CONTAINER_CLASS_NAME
    }, /* @__PURE__ */ import_react.default.createElement("input", {
      "aria-label": ariaLabel,
      checked,
      className: CHECKBOX_CLASS_NAME,
      disabled,
      id: htmlId,
      onChange: onClick,
      onKeyDown: (event) => {
        if (onClick && !disabled && event.key === "Enter") {
          onClick();
        }
      },
      type: "checkbox"
    }));
  }
  const contents = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: AVATAR_CONTAINER_CLASS_NAME
  }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
    acceptedMessageRequest,
    avatarPath,
    color,
    conversationType,
    noteToSelf: isAvatarNoteToSelf,
    searchResult: isUsernameSearchResult,
    i18n,
    isMe,
    name,
    phoneNumber,
    profileName,
    title,
    sharedGroupNames,
    size: import_Avatar.AvatarSize.FORTY_EIGHT,
    unblurredAvatarPath,
    ...props.badge ? { badge: props.badge, theme: props.theme } : { badge: void 0 }
  }), /* @__PURE__ */ import_react.default.createElement(UnreadIndicator, {
    count: unreadCount,
    isUnread
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(CONTENT_CLASS_NAME, disabled && `${CONTENT_CLASS_NAME}--disabled`)
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: HEADER_CLASS_NAME
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: `${HEADER_CLASS_NAME}__name`
  }, headerName), /* @__PURE__ */ import_react.default.createElement(Timestamp, {
    timestamp: headerDate,
    i18n
  })), messageText || isUnread ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: MESSAGE_CLASS_NAME
  }, Boolean(messageText) && /* @__PURE__ */ import_react.default.createElement("div", {
    dir: "auto",
    className: (0, import_classnames.default)(MESSAGE_TEXT_CLASS_NAME, messageTextIsAlwaysFullSize && `${MESSAGE_TEXT_CLASS_NAME}--always-full-size`)
  }, messageText), messageStatusIcon, /* @__PURE__ */ import_react.default.createElement(UnreadIndicator, {
    count: unreadCount,
    isUnread
  })) : null), actionNode);
  const commonClassNames = (0, import_classnames.default)(BASE_CLASS_NAME, {
    [`${BASE_CLASS_NAME}--is-selected`]: isSelected
  });
  if (isCheckbox) {
    return /* @__PURE__ */ import_react.default.createElement("label", {
      className: (0, import_classnames.default)(commonClassNames, `${BASE_CLASS_NAME}--is-checkbox`, { [`${BASE_CLASS_NAME}--is-checkbox--disabled`]: disabled }),
      "data-id": identifier,
      htmlFor: htmlId,
      ...disabled ? { onClick } : {}
    }, contents);
  }
  if (onClick) {
    return /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("BaseConversationListItem__aria-label", { title }),
      className: (0, import_classnames.default)(commonClassNames, `${BASE_CLASS_NAME}--is-button`),
      "data-id": identifier,
      disabled,
      onClick,
      type: "button"
    }, contents);
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: commonClassNames,
    "data-id": identifier
  }, contents);
}, "BaseConversationListItem"));
function Timestamp({
  i18n,
  timestamp
}) {
  const getText = (0, import_react.useCallback)(() => (0, import_lodash.isNumber)(timestamp) ? (0, import_timestamp.formatDateTimeShort)(i18n, timestamp) : "", [i18n, timestamp]);
  const [text, setText] = (0, import_react.useState)(getText());
  (0, import_react.useEffect)(() => {
    const update = /* @__PURE__ */ __name(() => setText(getText()), "update");
    update();
    const interval = setInterval(update, durations.MINUTE);
    return () => {
      clearInterval(interval);
    };
  }, [getText]);
  if (!(0, import_lodash.isNumber)(timestamp)) {
    return null;
  }
  return /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
    className: DATE_CLASS_NAME,
    timestamp
  }, text);
}
function UnreadIndicator({
  count = 0,
  isUnread
}) {
  if (!isUnread) {
    return null;
  }
  let classModifier;
  if (count > 99) {
    classModifier = "many";
  } else if (count > 9) {
    classModifier = "two-digits";
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(`${BASE_CLASS_NAME}__unread-indicator`, classModifier && `${BASE_CLASS_NAME}__unread-indicator--${classModifier}`)
  }, Boolean(count) && Math.min(count, 99));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseConversationListItem,
  DATE_CLASS_NAME,
  HEADER_CONTACT_NAME_CLASS_NAME,
  HEADER_NAME_CLASS_NAME,
  MESSAGE_TEXT_CLASS_NAME
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgUmVhY3ROb2RlLCBGdW5jdGlvbkNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgaXNCb29sZWFuLCBpc051bWJlciB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5cbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4uL0F2YXRhcic7XG5pbXBvcnQgdHlwZSB7IEJhZGdlVHlwZSB9IGZyb20gJy4uLy4uL2JhZGdlcy90eXBlcyc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvblVucmVhZCB9IGZyb20gJy4uLy4uL3V0aWwvaXNDb252ZXJzYXRpb25VbnJlYWQnO1xuaW1wb3J0IHsgY2xlYW5JZCB9IGZyb20gJy4uL191dGlsJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSwgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IFNwaW5uZXIgfSBmcm9tICcuLi9TcGlubmVyJztcbmltcG9ydCB7IFRpbWUgfSBmcm9tICcuLi9UaW1lJztcbmltcG9ydCB7IGZvcm1hdERhdGVUaW1lU2hvcnQgfSBmcm9tICcuLi8uLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vLi4vdXRpbC9kdXJhdGlvbnMnO1xuXG5jb25zdCBCQVNFX0NMQVNTX05BTUUgPVxuICAnbW9kdWxlLWNvbnZlcnNhdGlvbi1saXN0X19pdGVtLS1jb250YWN0LW9yLWNvbnZlcnNhdGlvbic7XG5jb25zdCBBVkFUQVJfQ09OVEFJTkVSX0NMQVNTX05BTUUgPSBgJHtCQVNFX0NMQVNTX05BTUV9X19hdmF0YXItY29udGFpbmVyYDtcbmNvbnN0IENPTlRFTlRfQ0xBU1NfTkFNRSA9IGAke0JBU0VfQ0xBU1NfTkFNRX1fX2NvbnRlbnRgO1xuY29uc3QgSEVBREVSX0NMQVNTX05BTUUgPSBgJHtDT05URU5UX0NMQVNTX05BTUV9X19oZWFkZXJgO1xuZXhwb3J0IGNvbnN0IEhFQURFUl9OQU1FX0NMQVNTX05BTUUgPSBgJHtIRUFERVJfQ0xBU1NfTkFNRX1fX25hbWVgO1xuZXhwb3J0IGNvbnN0IEhFQURFUl9DT05UQUNUX05BTUVfQ0xBU1NfTkFNRSA9IGAke0hFQURFUl9OQU1FX0NMQVNTX05BTUV9X19jb250YWN0LW5hbWVgO1xuZXhwb3J0IGNvbnN0IERBVEVfQ0xBU1NfTkFNRSA9IGAke0hFQURFUl9DTEFTU19OQU1FfV9fZGF0ZWA7XG5jb25zdCBNRVNTQUdFX0NMQVNTX05BTUUgPSBgJHtDT05URU5UX0NMQVNTX05BTUV9X19tZXNzYWdlYDtcbmV4cG9ydCBjb25zdCBNRVNTQUdFX1RFWFRfQ0xBU1NfTkFNRSA9IGAke01FU1NBR0VfQ0xBU1NfTkFNRX1fX3RleHRgO1xuY29uc3QgQ0hFQ0tCT1hfQ09OVEFJTkVSX0NMQVNTX05BTUUgPSBgJHtCQVNFX0NMQVNTX05BTUV9X19jaGVja2JveC0tY29udGFpbmVyYDtcbmNvbnN0IENIRUNLQk9YX0NMQVNTX05BTUUgPSBgJHtCQVNFX0NMQVNTX05BTUV9X19jaGVja2JveGA7XG5jb25zdCBTUElOTkVSX0NMQVNTX05BTUUgPSBgJHtCQVNFX0NMQVNTX05BTUV9X19zcGlubmVyYDtcblxudHlwZSBQcm9wc1R5cGUgPSB7XG4gIGNoZWNrZWQ/OiBib29sZWFuO1xuICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnIHwgJ2RpcmVjdCc7XG4gIGRpc2FibGVkPzogYm9vbGVhbjtcbiAgaGVhZGVyRGF0ZT86IG51bWJlcjtcbiAgaGVhZGVyTmFtZTogUmVhY3ROb2RlO1xuICBpZD86IHN0cmluZztcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgaXNOb3RlVG9TZWxmPzogYm9vbGVhbjtcbiAgaXNTZWxlY3RlZDogYm9vbGVhbjtcbiAgaXNVc2VybmFtZVNlYXJjaFJlc3VsdD86IGJvb2xlYW47XG4gIG1hcmtlZFVucmVhZD86IGJvb2xlYW47XG4gIG1lc3NhZ2VJZD86IHN0cmluZztcbiAgbWVzc2FnZVN0YXR1c0ljb24/OiBSZWFjdE5vZGU7XG4gIG1lc3NhZ2VUZXh0PzogUmVhY3ROb2RlO1xuICBtZXNzYWdlVGV4dElzQWx3YXlzRnVsbFNpemU/OiBib29sZWFuO1xuICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcbiAgc2hvdWxkU2hvd1NwaW5uZXI/OiBib29sZWFuO1xuICB1bnJlYWRDb3VudD86IG51bWJlcjtcbn0gJiBQaWNrPFxuICBDb252ZXJzYXRpb25UeXBlLFxuICB8ICdhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0J1xuICB8ICdhdmF0YXJQYXRoJ1xuICB8ICdjb2xvcidcbiAgfCAnaXNNZSdcbiAgfCAnbWFya2VkVW5yZWFkJ1xuICB8ICduYW1lJ1xuICB8ICdwaG9uZU51bWJlcidcbiAgfCAncHJvZmlsZU5hbWUnXG4gIHwgJ3NoYXJlZEdyb3VwTmFtZXMnXG4gIHwgJ3RpdGxlJ1xuICB8ICd1bmJsdXJyZWRBdmF0YXJQYXRoJ1xuPiAmXG4gIChcbiAgICB8IHsgYmFkZ2U/OiB1bmRlZmluZWQ7IHRoZW1lPzogVGhlbWVUeXBlIH1cbiAgICB8IHsgYmFkZ2U6IEJhZGdlVHlwZTsgdGhlbWU6IFRoZW1lVHlwZSB9XG4gICk7XG5cbmV4cG9ydCBjb25zdCBCYXNlQ29udmVyc2F0aW9uTGlzdEl0ZW06IEZ1bmN0aW9uQ29tcG9uZW50PFByb3BzVHlwZT4gPVxuICBSZWFjdC5tZW1vKGZ1bmN0aW9uIEJhc2VDb252ZXJzYXRpb25MaXN0SXRlbShwcm9wcykge1xuICAgIGNvbnN0IHtcbiAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gICAgICBhdmF0YXJQYXRoLFxuICAgICAgY2hlY2tlZCxcbiAgICAgIGNvbG9yLFxuICAgICAgY29udmVyc2F0aW9uVHlwZSxcbiAgICAgIGRpc2FibGVkLFxuICAgICAgaGVhZGVyRGF0ZSxcbiAgICAgIGhlYWRlck5hbWUsXG4gICAgICBpMThuLFxuICAgICAgaWQsXG4gICAgICBpc01lLFxuICAgICAgaXNOb3RlVG9TZWxmLFxuICAgICAgaXNVc2VybmFtZVNlYXJjaFJlc3VsdCxcbiAgICAgIGlzU2VsZWN0ZWQsXG4gICAgICBtYXJrZWRVbnJlYWQsXG4gICAgICBtZXNzYWdlU3RhdHVzSWNvbixcbiAgICAgIG1lc3NhZ2VUZXh0LFxuICAgICAgbWVzc2FnZVRleHRJc0Fsd2F5c0Z1bGxTaXplLFxuICAgICAgbmFtZSxcbiAgICAgIG9uQ2xpY2ssXG4gICAgICBwaG9uZU51bWJlcixcbiAgICAgIHByb2ZpbGVOYW1lLFxuICAgICAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgICAgIHNob3VsZFNob3dTcGlubmVyLFxuICAgICAgdGl0bGUsXG4gICAgICB1bmJsdXJyZWRBdmF0YXJQYXRoLFxuICAgICAgdW5yZWFkQ291bnQsXG4gICAgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgaWRlbnRpZmllciA9IGlkID8gY2xlYW5JZChpZCkgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgaHRtbElkID0gdXNlTWVtbygoKSA9PiB1dWlkKCksIFtdKTtcbiAgICBjb25zdCBpc1VucmVhZCA9IGlzQ29udmVyc2F0aW9uVW5yZWFkKHsgbWFya2VkVW5yZWFkLCB1bnJlYWRDb3VudCB9KTtcblxuICAgIGNvbnN0IGlzQXZhdGFyTm90ZVRvU2VsZiA9IGlzQm9vbGVhbihpc05vdGVUb1NlbGYpXG4gICAgICA/IGlzTm90ZVRvU2VsZlxuICAgICAgOiBCb29sZWFuKGlzTWUpO1xuXG4gICAgY29uc3QgaXNDaGVja2JveCA9IGlzQm9vbGVhbihjaGVja2VkKTtcblxuICAgIGxldCBhY3Rpb25Ob2RlOiBSZWFjdE5vZGU7XG4gICAgaWYgKHNob3VsZFNob3dTcGlubmVyKSB7XG4gICAgICBhY3Rpb25Ob2RlID0gKFxuICAgICAgICA8U3Bpbm5lclxuICAgICAgICAgIHNpemU9XCIyMHB4XCJcbiAgICAgICAgICBzdmdTaXplPVwic21hbGxcIlxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT17U1BJTk5FUl9DTEFTU19OQU1FfVxuICAgICAgICAgIGRpcmVjdGlvbj1cIm9uLXByb2dyZXNzLWRpYWxvZ1wiXG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNDaGVja2JveCkge1xuICAgICAgbGV0IGFyaWFMYWJlbDogc3RyaW5nO1xuICAgICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgIGFyaWFMYWJlbCA9IGkxOG4oJ2Nhbm5vdFNlbGVjdENvbnRhY3QnLCBbdGl0bGVdKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hlY2tlZCkge1xuICAgICAgICBhcmlhTGFiZWwgPSBpMThuKCdkZXNlbGVjdENvbnRhY3QnLCBbdGl0bGVdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyaWFMYWJlbCA9IGkxOG4oJ3NlbGVjdENvbnRhY3QnLCBbdGl0bGVdKTtcbiAgICAgIH1cbiAgICAgIGFjdGlvbk5vZGUgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDSEVDS0JPWF9DT05UQUlORVJfQ0xBU1NfTkFNRX0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWx9XG4gICAgICAgICAgICBjaGVja2VkPXtjaGVja2VkfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtDSEVDS0JPWF9DTEFTU19OQU1FfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgaWQ9e2h0bWxJZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNsaWNrfVxuICAgICAgICAgICAgb25LZXlEb3duPXtldmVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChvbkNsaWNrICYmICFkaXNhYmxlZCAmJiBldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50cyA9IChcbiAgICAgIDw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtBVkFUQVJfQ09OVEFJTkVSX0NMQVNTX05BTUV9PlxuICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e2FjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICBhdmF0YXJQYXRoPXthdmF0YXJQYXRofVxuICAgICAgICAgICAgY29sb3I9e2NvbG9yfVxuICAgICAgICAgICAgY29udmVyc2F0aW9uVHlwZT17Y29udmVyc2F0aW9uVHlwZX1cbiAgICAgICAgICAgIG5vdGVUb1NlbGY9e2lzQXZhdGFyTm90ZVRvU2VsZn1cbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdD17aXNVc2VybmFtZVNlYXJjaFJlc3VsdH1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc01lPXtpc01lfVxuICAgICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICAgIHBob25lTnVtYmVyPXtwaG9uZU51bWJlcn1cbiAgICAgICAgICAgIHByb2ZpbGVOYW1lPXtwcm9maWxlTmFtZX1cbiAgICAgICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e3NoYXJlZEdyb3VwTmFtZXN9XG4gICAgICAgICAgICBzaXplPXtBdmF0YXJTaXplLkZPUlRZX0VJR0hUfVxuICAgICAgICAgICAgdW5ibHVycmVkQXZhdGFyUGF0aD17dW5ibHVycmVkQXZhdGFyUGF0aH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaGVyZSB0byBhcHBlYXNlIHRoZSB0eXBlIGNoZWNrZXIuXG4gICAgICAgICAgICB7Li4uKHByb3BzLmJhZGdlXG4gICAgICAgICAgICAgID8geyBiYWRnZTogcHJvcHMuYmFkZ2UsIHRoZW1lOiBwcm9wcy50aGVtZSB9XG4gICAgICAgICAgICAgIDogeyBiYWRnZTogdW5kZWZpbmVkIH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFVucmVhZEluZGljYXRvciBjb3VudD17dW5yZWFkQ291bnR9IGlzVW5yZWFkPXtpc1VucmVhZH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICBDT05URU5UX0NMQVNTX05BTUUsXG4gICAgICAgICAgICBkaXNhYmxlZCAmJiBgJHtDT05URU5UX0NMQVNTX05BTUV9LS1kaXNhYmxlZGBcbiAgICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0hFQURFUl9DTEFTU19OQU1FfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtIRUFERVJfQ0xBU1NfTkFNRX1fX25hbWVgfT57aGVhZGVyTmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDxUaW1lc3RhbXAgdGltZXN0YW1wPXtoZWFkZXJEYXRlfSBpMThuPXtpMThufSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHttZXNzYWdlVGV4dCB8fCBpc1VucmVhZCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtNRVNTQUdFX0NMQVNTX05BTUV9PlxuICAgICAgICAgICAgICB7Qm9vbGVhbihtZXNzYWdlVGV4dCkgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGRpcj1cImF1dG9cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICBNRVNTQUdFX1RFWFRfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVRleHRJc0Fsd2F5c0Z1bGxTaXplICYmXG4gICAgICAgICAgICAgICAgICAgICAgYCR7TUVTU0FHRV9URVhUX0NMQVNTX05BTUV9LS1hbHdheXMtZnVsbC1zaXplYFxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7bWVzc2FnZVRleHR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHttZXNzYWdlU3RhdHVzSWNvbn1cbiAgICAgICAgICAgICAgPFVucmVhZEluZGljYXRvciBjb3VudD17dW5yZWFkQ291bnR9IGlzVW5yZWFkPXtpc1VucmVhZH0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2FjdGlvbk5vZGV9XG4gICAgICA8Lz5cbiAgICApO1xuXG4gICAgY29uc3QgY29tbW9uQ2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMoQkFTRV9DTEFTU19OQU1FLCB7XG4gICAgICBbYCR7QkFTRV9DTEFTU19OQU1FfS0taXMtc2VsZWN0ZWRgXTogaXNTZWxlY3RlZCxcbiAgICB9KTtcblxuICAgIGlmIChpc0NoZWNrYm94KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bGFiZWxcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICBjb21tb25DbGFzc05hbWVzLFxuICAgICAgICAgICAgYCR7QkFTRV9DTEFTU19OQU1FfS0taXMtY2hlY2tib3hgLFxuICAgICAgICAgICAgeyBbYCR7QkFTRV9DTEFTU19OQU1FfS0taXMtY2hlY2tib3gtLWRpc2FibGVkYF06IGRpc2FibGVkIH1cbiAgICAgICAgICApfVxuICAgICAgICAgIGRhdGEtaWQ9e2lkZW50aWZpZXJ9XG4gICAgICAgICAgaHRtbEZvcj17aHRtbElkfVxuICAgICAgICAgIC8vIGBvbkNsaWNrYCBpcyB3aWxsIGRvdWJsZS1maXJlIGlmIHdlJ3JlIGVuYWJsZWQuIFdlIHdhbnQgaXQgdG8gZmlyZSB3aGVuIHdlJ3JlXG4gICAgICAgICAgLy8gICBkaXNhYmxlZCBzbyB3ZSBjYW4gc2hvdyBhbnkgXCJjYW4ndCBhZGQgY29udGFjdFwiIG1vZGFscywgZXRjLiBUaGlzIHdvbid0XG4gICAgICAgICAgLy8gICB3b3JrIGZvciBrZXlib2FyZCB1c2VycywgdGhvdWdoLCBiZWNhdXNlIGxhYmVscyBhcmUgbm90IHRhYmJhYmxlLlxuICAgICAgICAgIHsuLi4oZGlzYWJsZWQgPyB7IG9uQ2xpY2sgfSA6IHt9KX1cbiAgICAgICAgPlxuICAgICAgICAgIHtjb250ZW50c31cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG9uQ2xpY2spIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdCYXNlQ29udmVyc2F0aW9uTGlzdEl0ZW1fX2FyaWEtbGFiZWwnLCB7IHRpdGxlIH0pfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgIGNvbW1vbkNsYXNzTmFtZXMsXG4gICAgICAgICAgICBgJHtCQVNFX0NMQVNTX05BTUV9LS1pcy1idXR0b25gXG4gICAgICAgICAgKX1cbiAgICAgICAgICBkYXRhLWlkPXtpZGVudGlmaWVyfVxuICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAge2NvbnRlbnRzfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjb21tb25DbGFzc05hbWVzfSBkYXRhLWlkPXtpZGVudGlmaWVyfT5cbiAgICAgICAge2NvbnRlbnRzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSk7XG5cbmZ1bmN0aW9uIFRpbWVzdGFtcCh7XG4gIGkxOG4sXG4gIHRpbWVzdGFtcCxcbn06IFJlYWRvbmx5PHsgaTE4bjogTG9jYWxpemVyVHlwZTsgdGltZXN0YW1wPzogbnVtYmVyIH0+KSB7XG4gIGNvbnN0IGdldFRleHQgPSB1c2VDYWxsYmFjayhcbiAgICAoKSA9PiAoaXNOdW1iZXIodGltZXN0YW1wKSA/IGZvcm1hdERhdGVUaW1lU2hvcnQoaTE4biwgdGltZXN0YW1wKSA6ICcnKSxcbiAgICBbaTE4biwgdGltZXN0YW1wXVxuICApO1xuXG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKGdldFRleHQoKSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiBzZXRUZXh0KGdldFRleHQoKSk7XG4gICAgdXBkYXRlKCk7XG4gICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh1cGRhdGUsIGR1cmF0aW9ucy5NSU5VVEUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9O1xuICB9LCBbZ2V0VGV4dF0pO1xuXG4gIGlmICghaXNOdW1iZXIodGltZXN0YW1wKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8VGltZSBjbGFzc05hbWU9e0RBVEVfQ0xBU1NfTkFNRX0gdGltZXN0YW1wPXt0aW1lc3RhbXB9PlxuICAgICAge3RleHR9XG4gICAgPC9UaW1lPlxuICApO1xufVxuXG5mdW5jdGlvbiBVbnJlYWRJbmRpY2F0b3Ioe1xuICBjb3VudCA9IDAsXG4gIGlzVW5yZWFkLFxufTogUmVhZG9ubHk8eyBjb3VudD86IG51bWJlcjsgaXNVbnJlYWQ6IGJvb2xlYW4gfT4pIHtcbiAgaWYgKCFpc1VucmVhZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGNsYXNzTW9kaWZpZXI6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgaWYgKGNvdW50ID4gOTkpIHtcbiAgICBjbGFzc01vZGlmaWVyID0gJ21hbnknO1xuICB9IGVsc2UgaWYgKGNvdW50ID4gOSkge1xuICAgIGNsYXNzTW9kaWZpZXIgPSAndHdvLWRpZ2l0cyc7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgYCR7QkFTRV9DTEFTU19OQU1FfV9fdW5yZWFkLWluZGljYXRvcmAsXG4gICAgICAgIGNsYXNzTW9kaWZpZXIgJiZcbiAgICAgICAgICBgJHtCQVNFX0NMQVNTX05BTUV9X191bnJlYWQtaW5kaWNhdG9yLS0ke2NsYXNzTW9kaWZpZXJ9YFxuICAgICAgKX1cbiAgICA+XG4gICAgICB7Qm9vbGVhbihjb3VudCkgJiYgTWF0aC5taW4oY291bnQsIDk5KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFpRTtBQUNqRSx3QkFBdUI7QUFDdkIsb0JBQW9DO0FBQ3BDLGtCQUEyQjtBQUUzQixvQkFBbUM7QUFFbkMsa0NBQXFDO0FBQ3JDLGtCQUF3QjtBQUd4QixxQkFBd0I7QUFDeEIsa0JBQXFCO0FBQ3JCLHVCQUFvQztBQUNwQyxnQkFBMkI7QUFFM0IsTUFBTSxrQkFDSjtBQUNGLE1BQU0sOEJBQThCLEdBQUc7QUFDdkMsTUFBTSxxQkFBcUIsR0FB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
