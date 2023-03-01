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
var TimelineItem_stories_exports = {};
__export(TimelineItem_stories_exports, {
  MissingItem: () => MissingItem,
  Notification: () => Notification,
  PlainMessage: () => PlainMessage,
  UnknownType: () => UnknownType,
  default: () => TimelineItem_stories_default
});
module.exports = __toCommonJS(TimelineItem_stories_exports);
var React = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_EmojiPicker = require("../emoji/EmojiPicker");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_TimelineItem = require("./TimelineItem");
var import_UniversalTimerNotification = require("./UniversalTimerNotification");
var import_Calling = require("../../types/Calling");
var import_Colors = require("../../types/Colors");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_util = require("../_util");
var import_Util = require("../../types/Util");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const renderEmojiPicker = /* @__PURE__ */ __name(({
  onClose,
  onPickEmoji,
  ref
}) => /* @__PURE__ */ React.createElement(import_EmojiPicker.EmojiPicker, {
  i18n: (0, import_setupI18n.setupI18n)("en", import_messages.default),
  skinTone: 0,
  onSetSkinTone: (0, import_addon_actions.action)("EmojiPicker::onSetSkinTone"),
  ref,
  onClose,
  onPickEmoji
}), "renderEmojiPicker");
const renderReactionPicker = /* @__PURE__ */ __name(() => /* @__PURE__ */ React.createElement("div", null), "renderReactionPicker");
const renderContact = /* @__PURE__ */ __name((conversationId) => /* @__PURE__ */ React.createElement(React.Fragment, {
  key: conversationId
}, conversationId), "renderContact");
const renderUniversalTimerNotification = /* @__PURE__ */ __name(() => /* @__PURE__ */ React.createElement(import_UniversalTimerNotification.UniversalTimerNotification, {
  i18n,
  expireTimer: 3600
}), "renderUniversalTimerNotification");
const getDefaultProps = /* @__PURE__ */ __name(() => ({
  containerElementRef: React.createRef(),
  containerWidthBreakpoint: import_util.WidthBreakpoint.Wide,
  conversationId: "conversation-id",
  getPreferredBadge: () => void 0,
  id: "asdf",
  isNextItemCallingNotification: false,
  isSelected: false,
  interactionMode: "keyboard",
  theme: import_Util.ThemeType.light,
  selectMessage: (0, import_addon_actions.action)("selectMessage"),
  reactToMessage: (0, import_addon_actions.action)("reactToMessage"),
  checkForAccount: (0, import_addon_actions.action)("checkForAccount"),
  clearSelectedMessage: (0, import_addon_actions.action)("clearSelectedMessage"),
  contactSupport: (0, import_addon_actions.action)("contactSupport"),
  replyToMessage: (0, import_addon_actions.action)("replyToMessage"),
  retryDeleteForEveryone: (0, import_addon_actions.action)("retryDeleteForEveryone"),
  retrySend: (0, import_addon_actions.action)("retrySend"),
  blockGroupLinkRequests: (0, import_addon_actions.action)("blockGroupLinkRequests"),
  deleteMessage: (0, import_addon_actions.action)("deleteMessage"),
  deleteMessageForEveryone: (0, import_addon_actions.action)("deleteMessageForEveryone"),
  kickOffAttachmentDownload: (0, import_addon_actions.action)("kickOffAttachmentDownload"),
  learnMoreAboutDeliveryIssue: (0, import_addon_actions.action)("learnMoreAboutDeliveryIssue"),
  markAttachmentAsCorrupted: (0, import_addon_actions.action)("markAttachmentAsCorrupted"),
  markViewed: (0, import_addon_actions.action)("markViewed"),
  messageExpanded: (0, import_addon_actions.action)("messageExpanded"),
  showMessageDetail: (0, import_addon_actions.action)("showMessageDetail"),
  openConversation: (0, import_addon_actions.action)("openConversation"),
  openGiftBadge: (0, import_addon_actions.action)("openGiftBadge"),
  showContactDetail: (0, import_addon_actions.action)("showContactDetail"),
  showContactModal: (0, import_addon_actions.action)("showContactModal"),
  showForwardMessageModal: (0, import_addon_actions.action)("showForwardMessageModal"),
  showVisualAttachment: (0, import_addon_actions.action)("showVisualAttachment"),
  downloadAttachment: (0, import_addon_actions.action)("downloadAttachment"),
  displayTapToViewMessage: (0, import_addon_actions.action)("displayTapToViewMessage"),
  doubleCheckMissingQuoteReference: (0, import_addon_actions.action)("doubleCheckMissingQuoteReference"),
  showExpiredIncomingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  showExpiredOutgoingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  openLink: (0, import_addon_actions.action)("openLink"),
  scrollToQuotedMessage: (0, import_addon_actions.action)("scrollToQuotedMessage"),
  downloadNewVersion: (0, import_addon_actions.action)("downloadNewVersion"),
  showIdentity: (0, import_addon_actions.action)("showIdentity"),
  startCallingLobby: (0, import_addon_actions.action)("startCallingLobby"),
  startConversation: (0, import_addon_actions.action)("startConversation"),
  returnToActiveCall: (0, import_addon_actions.action)("returnToActiveCall"),
  shouldCollapseAbove: false,
  shouldCollapseBelow: false,
  shouldHideMetadata: false,
  shouldRenderDateHeader: false,
  now: Date.now(),
  renderContact,
  renderUniversalTimerNotification,
  renderEmojiPicker,
  renderReactionPicker,
  renderAudioAttachment: () => /* @__PURE__ */ React.createElement("div", null, "*AudioAttachment*"),
  viewStory: (0, import_addon_actions.action)("viewStory")
}), "getDefaultProps");
var TimelineItem_stories_default = {
  title: "Components/Conversation/TimelineItem"
};
const PlainMessage = /* @__PURE__ */ __name(() => {
  const item = {
    type: "message",
    data: {
      id: "id-1",
      direction: "incoming",
      timestamp: Date.now(),
      author: {
        phoneNumber: "(202) 555-2001",
        color: import_Colors.AvatarColors[0]
      },
      text: "\u{1F525}"
    }
  };
  return /* @__PURE__ */ React.createElement(import_TimelineItem.TimelineItem, {
    ...getDefaultProps(),
    item,
    i18n
  });
}, "PlainMessage");
const Notification = /* @__PURE__ */ __name(() => {
  const items = [
    {
      type: "timerNotification",
      data: {
        phoneNumber: "(202) 555-0000",
        expireTimer: 60,
        ...(0, import_getDefaultConversation.getDefaultConversation)(),
        type: "fromOther"
      }
    },
    {
      type: "universalTimerNotification",
      data: null
    },
    {
      type: "chatSessionRefreshed"
    },
    {
      type: "safetyNumberNotification",
      data: {
        isGroup: false,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "deliveryIssue",
      data: {
        sender: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "changeNumberNotification",
      data: {
        sender: (0, import_getDefaultConversation.getDefaultConversation)(),
        timestamp: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: true,
        wasIncoming: true,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: true,
        wasIncoming: true,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        acceptedTime: Date.now() - 300,
        wasDeclined: false,
        wasIncoming: true,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        acceptedTime: Date.now() - 400,
        wasDeclined: false,
        wasIncoming: true,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: false,
        wasIncoming: true,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: false,
        wasIncoming: true,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        acceptedTime: Date.now() - 200,
        wasDeclined: false,
        wasIncoming: false,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        acceptedTime: Date.now() - 200,
        wasDeclined: false,
        wasIncoming: false,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: true,
        wasIncoming: false,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: true,
        wasIncoming: false,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: false,
        wasIncoming: false,
        wasVideoCall: false,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Direct,
        wasDeclined: false,
        wasIncoming: false,
        wasVideoCall: true,
        endedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        conversationId: "abc123",
        creator: {
          firstName: "Luigi",
          isMe: false,
          title: "Luigi Mario"
        },
        ended: false,
        deviceCount: 1,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        conversationId: "abc123",
        creator: {
          firstName: "Peach",
          isMe: true,
          title: "Princess Peach"
        },
        ended: false,
        deviceCount: 1,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        conversationId: "abc123",
        ended: false,
        deviceCount: 1,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        activeCallConversationId: "abc123",
        conversationId: "abc123",
        creator: {
          firstName: "Luigi",
          isMe: false,
          title: "Luigi Mario"
        },
        ended: false,
        deviceCount: 1,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        activeCallConversationId: "abc123",
        conversationId: "xyz987",
        creator: {
          firstName: "Luigi",
          isMe: false,
          title: "Luigi Mario"
        },
        ended: false,
        deviceCount: 1,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        conversationId: "abc123",
        creator: {
          firstName: "Luigi",
          isMe: false,
          title: "Luigi Mario"
        },
        ended: false,
        deviceCount: 16,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "callHistory",
      data: {
        callMode: import_Calling.CallMode.Group,
        conversationId: "abc123",
        creator: {
          firstName: "Luigi",
          isMe: false,
          title: "Luigi Mario"
        },
        ended: true,
        deviceCount: 0,
        maxDevices: 16,
        startedTime: Date.now()
      }
    },
    {
      type: "profileChange",
      data: {
        change: {
          type: "name",
          oldName: "Fred",
          newName: "John"
        },
        changedContact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "resetSessionNotification",
      data: null
    },
    {
      type: "unsupportedMessage",
      data: {
        canProcessNow: true,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "unsupportedMessage",
      data: {
        canProcessNow: false,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "verificationNotification",
      data: {
        type: "markVerified",
        isLocal: false,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "verificationNotification",
      data: {
        type: "markVerified",
        isLocal: true,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "verificationNotification",
      data: {
        type: "markNotVerified",
        isLocal: false,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    },
    {
      type: "verificationNotification",
      data: {
        type: "markNotVerified",
        isLocal: true,
        contact: (0, import_getDefaultConversation.getDefaultConversation)()
      }
    }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, items.map((item, index) => /* @__PURE__ */ React.createElement(React.Fragment, {
    key: index
  }, /* @__PURE__ */ React.createElement(import_TimelineItem.TimelineItem, {
    ...getDefaultProps(),
    item,
    i18n
  }))));
}, "Notification");
const UnknownType = /* @__PURE__ */ __name(() => {
  const item = {
    type: "random",
    data: {
      somethin: "somethin"
    }
  };
  return /* @__PURE__ */ React.createElement(import_TimelineItem.TimelineItem, {
    ...getDefaultProps(),
    item,
    i18n
  });
}, "UnknownType");
const MissingItem = /* @__PURE__ */ __name(() => {
  const item = null;
  return /* @__PURE__ */ React.createElement(import_TimelineItem.TimelineItem, {
    ...getDefaultProps(),
    item,
    i18n
  });
}, "MissingItem");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MissingItem,
  Notification,
  PlainMessage,
  UnknownType
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGltZWxpbmVJdGVtLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnMnO1xuXG5pbXBvcnQgeyBFbW9qaVBpY2tlciB9IGZyb20gJy4uL2Vtb2ppL0Vtb2ppUGlja2VyJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uLy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgYXMgVGltZWxpbmVJdGVtUHJvcHMgfSBmcm9tICcuL1RpbWVsaW5lSXRlbSc7XG5pbXBvcnQgeyBUaW1lbGluZUl0ZW0gfSBmcm9tICcuL1RpbWVsaW5lSXRlbSc7XG5pbXBvcnQgeyBVbml2ZXJzYWxUaW1lck5vdGlmaWNhdGlvbiB9IGZyb20gJy4vVW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24nO1xuaW1wb3J0IHsgQ2FsbE1vZGUgfSBmcm9tICcuLi8uLi90eXBlcy9DYWxsaW5nJztcbmltcG9ydCB7IEF2YXRhckNvbG9ycyB9IGZyb20gJy4uLy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBXaWR0aEJyZWFrcG9pbnQgfSBmcm9tICcuLi9fdXRpbCc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuY29uc3QgcmVuZGVyRW1vamlQaWNrZXI6IFRpbWVsaW5lSXRlbVByb3BzWydyZW5kZXJFbW9qaVBpY2tlciddID0gKHtcbiAgb25DbG9zZSxcbiAgb25QaWNrRW1vamksXG4gIHJlZixcbn0pID0+IChcbiAgPEVtb2ppUGlja2VyXG4gICAgaTE4bj17c2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpfVxuICAgIHNraW5Ub25lPXswfVxuICAgIG9uU2V0U2tpblRvbmU9e2FjdGlvbignRW1vamlQaWNrZXI6Om9uU2V0U2tpblRvbmUnKX1cbiAgICByZWY9e3JlZn1cbiAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgIG9uUGlja0Vtb2ppPXtvblBpY2tFbW9qaX1cbiAgLz5cbik7XG5cbmNvbnN0IHJlbmRlclJlYWN0aW9uUGlja2VyOiBUaW1lbGluZUl0ZW1Qcm9wc1sncmVuZGVyUmVhY3Rpb25QaWNrZXInXSA9ICgpID0+IChcbiAgPGRpdiAvPlxuKTtcblxuY29uc3QgcmVuZGVyQ29udGFjdCA9IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiAoXG4gIDxSZWFjdC5GcmFnbWVudCBrZXk9e2NvbnZlcnNhdGlvbklkfT57Y29udmVyc2F0aW9uSWR9PC9SZWFjdC5GcmFnbWVudD5cbik7XG5cbmNvbnN0IHJlbmRlclVuaXZlcnNhbFRpbWVyTm90aWZpY2F0aW9uID0gKCkgPT4gKFxuICA8VW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24gaTE4bj17aTE4bn0gZXhwaXJlVGltZXI9ezM2MDB9IC8+XG4pO1xuXG5jb25zdCBnZXREZWZhdWx0UHJvcHMgPSAoKSA9PiAoe1xuICBjb250YWluZXJFbGVtZW50UmVmOiBSZWFjdC5jcmVhdGVSZWY8SFRNTEVsZW1lbnQ+KCksXG4gIGNvbnRhaW5lcldpZHRoQnJlYWtwb2ludDogV2lkdGhCcmVha3BvaW50LldpZGUsXG4gIGNvbnZlcnNhdGlvbklkOiAnY29udmVyc2F0aW9uLWlkJyxcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6ICgpID0+IHVuZGVmaW5lZCxcbiAgaWQ6ICdhc2RmJyxcbiAgaXNOZXh0SXRlbUNhbGxpbmdOb3RpZmljYXRpb246IGZhbHNlLFxuICBpc1NlbGVjdGVkOiBmYWxzZSxcbiAgaW50ZXJhY3Rpb25Nb2RlOiAna2V5Ym9hcmQnIGFzIGNvbnN0LFxuICB0aGVtZTogVGhlbWVUeXBlLmxpZ2h0LFxuICBzZWxlY3RNZXNzYWdlOiBhY3Rpb24oJ3NlbGVjdE1lc3NhZ2UnKSxcbiAgcmVhY3RUb01lc3NhZ2U6IGFjdGlvbigncmVhY3RUb01lc3NhZ2UnKSxcbiAgY2hlY2tGb3JBY2NvdW50OiBhY3Rpb24oJ2NoZWNrRm9yQWNjb3VudCcpLFxuICBjbGVhclNlbGVjdGVkTWVzc2FnZTogYWN0aW9uKCdjbGVhclNlbGVjdGVkTWVzc2FnZScpLFxuICBjb250YWN0U3VwcG9ydDogYWN0aW9uKCdjb250YWN0U3VwcG9ydCcpLFxuICByZXBseVRvTWVzc2FnZTogYWN0aW9uKCdyZXBseVRvTWVzc2FnZScpLFxuICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiBhY3Rpb24oJ3JldHJ5RGVsZXRlRm9yRXZlcnlvbmUnKSxcbiAgcmV0cnlTZW5kOiBhY3Rpb24oJ3JldHJ5U2VuZCcpLFxuICBibG9ja0dyb3VwTGlua1JlcXVlc3RzOiBhY3Rpb24oJ2Jsb2NrR3JvdXBMaW5rUmVxdWVzdHMnKSxcbiAgZGVsZXRlTWVzc2FnZTogYWN0aW9uKCdkZWxldGVNZXNzYWdlJyksXG4gIGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZTogYWN0aW9uKCdkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUnKSxcbiAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZDogYWN0aW9uKCdraWNrT2ZmQXR0YWNobWVudERvd25sb2FkJyksXG4gIGxlYXJuTW9yZUFib3V0RGVsaXZlcnlJc3N1ZTogYWN0aW9uKCdsZWFybk1vcmVBYm91dERlbGl2ZXJ5SXNzdWUnKSxcbiAgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogYWN0aW9uKCdtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkJyksXG4gIG1hcmtWaWV3ZWQ6IGFjdGlvbignbWFya1ZpZXdlZCcpLFxuICBtZXNzYWdlRXhwYW5kZWQ6IGFjdGlvbignbWVzc2FnZUV4cGFuZGVkJyksXG4gIHNob3dNZXNzYWdlRGV0YWlsOiBhY3Rpb24oJ3Nob3dNZXNzYWdlRGV0YWlsJyksXG4gIG9wZW5Db252ZXJzYXRpb246IGFjdGlvbignb3BlbkNvbnZlcnNhdGlvbicpLFxuICBvcGVuR2lmdEJhZGdlOiBhY3Rpb24oJ29wZW5HaWZ0QmFkZ2UnKSxcbiAgc2hvd0NvbnRhY3REZXRhaWw6IGFjdGlvbignc2hvd0NvbnRhY3REZXRhaWwnKSxcbiAgc2hvd0NvbnRhY3RNb2RhbDogYWN0aW9uKCdzaG93Q29udGFjdE1vZGFsJyksXG4gIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsOiBhY3Rpb24oJ3Nob3dGb3J3YXJkTWVzc2FnZU1vZGFsJyksXG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiBhY3Rpb24oJ3Nob3dWaXN1YWxBdHRhY2htZW50JyksXG4gIGRvd25sb2FkQXR0YWNobWVudDogYWN0aW9uKCdkb3dubG9hZEF0dGFjaG1lbnQnKSxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IGFjdGlvbignZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnKSxcbiAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2U6IGFjdGlvbignZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UnKSxcbiAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0OiBhY3Rpb24oXG4gICAgJ3Nob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdCdcbiAgKSxcbiAgc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0OiBhY3Rpb24oXG4gICAgJ3Nob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdCdcbiAgKSxcbiAgb3Blbkxpbms6IGFjdGlvbignb3BlbkxpbmsnKSxcbiAgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlOiBhY3Rpb24oJ3Njcm9sbFRvUXVvdGVkTWVzc2FnZScpLFxuICBkb3dubG9hZE5ld1ZlcnNpb246IGFjdGlvbignZG93bmxvYWROZXdWZXJzaW9uJyksXG4gIHNob3dJZGVudGl0eTogYWN0aW9uKCdzaG93SWRlbnRpdHknKSxcbiAgc3RhcnRDYWxsaW5nTG9iYnk6IGFjdGlvbignc3RhcnRDYWxsaW5nTG9iYnknKSxcbiAgc3RhcnRDb252ZXJzYXRpb246IGFjdGlvbignc3RhcnRDb252ZXJzYXRpb24nKSxcbiAgcmV0dXJuVG9BY3RpdmVDYWxsOiBhY3Rpb24oJ3JldHVyblRvQWN0aXZlQ2FsbCcpLFxuICBzaG91bGRDb2xsYXBzZUFib3ZlOiBmYWxzZSxcbiAgc2hvdWxkQ29sbGFwc2VCZWxvdzogZmFsc2UsXG4gIHNob3VsZEhpZGVNZXRhZGF0YTogZmFsc2UsXG4gIHNob3VsZFJlbmRlckRhdGVIZWFkZXI6IGZhbHNlLFxuXG4gIG5vdzogRGF0ZS5ub3coKSxcblxuICByZW5kZXJDb250YWN0LFxuICByZW5kZXJVbml2ZXJzYWxUaW1lck5vdGlmaWNhdGlvbixcbiAgcmVuZGVyRW1vamlQaWNrZXIsXG4gIHJlbmRlclJlYWN0aW9uUGlja2VyLFxuICByZW5kZXJBdWRpb0F0dGFjaG1lbnQ6ICgpID0+IDxkaXY+KkF1ZGlvQXR0YWNobWVudCo8L2Rpdj4sXG4gIHZpZXdTdG9yeTogYWN0aW9uKCd2aWV3U3RvcnknKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9Db252ZXJzYXRpb24vVGltZWxpbmVJdGVtJyxcbn07XG5cbmV4cG9ydCBjb25zdCBQbGFpbk1lc3NhZ2UgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBpdGVtID0ge1xuICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICBkYXRhOiB7XG4gICAgICBpZDogJ2lkLTEnLFxuICAgICAgZGlyZWN0aW9uOiAnaW5jb21pbmcnLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgYXV0aG9yOiB7XG4gICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTIwMDEnLFxuICAgICAgICBjb2xvcjogQXZhdGFyQ29sb3JzWzBdLFxuICAgICAgfSxcbiAgICAgIHRleHQ6ICdcdUQ4M0RcdUREMjUnLFxuICAgIH0sXG4gIH0gYXMgVGltZWxpbmVJdGVtUHJvcHNbJ2l0ZW0nXTtcblxuICByZXR1cm4gPFRpbWVsaW5lSXRlbSB7Li4uZ2V0RGVmYXVsdFByb3BzKCl9IGl0ZW09e2l0ZW19IGkxOG49e2kxOG59IC8+O1xufTtcblxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvbiA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IGl0ZW1zID0gW1xuICAgIHtcbiAgICAgIHR5cGU6ICd0aW1lck5vdGlmaWNhdGlvbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDAnLFxuICAgICAgICBleHBpcmVUaW1lcjogNjAsXG4gICAgICAgIC4uLmdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgICAgdHlwZTogJ2Zyb21PdGhlcicsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3VuaXZlcnNhbFRpbWVyTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2hhdFNlc3Npb25SZWZyZXNoZWQnLFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3NhZmV0eU51bWJlck5vdGlmaWNhdGlvbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICBjb250YWN0OiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2RlbGl2ZXJ5SXNzdWUnLFxuICAgICAgZGF0YToge1xuICAgICAgICBzZW5kZXI6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2hhbmdlTnVtYmVyTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc2VuZGVyOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBkZWNsaW5lZCBpbmNvbWluZyBhdWRpb1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICB3YXNEZWNsaW5lZDogdHJ1ZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IHRydWUsXG4gICAgICAgIHdhc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgIGVuZGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBkZWNsaW5lZCBpbmNvbWluZyB2aWRlb1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICB3YXNEZWNsaW5lZDogdHJ1ZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IHRydWUsXG4gICAgICAgIHdhc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgZW5kZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC8vIGFjY2VwdGVkIGluY29taW5nIGF1ZGlvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIGFjY2VwdGVkVGltZTogRGF0ZS5ub3coKSAtIDMwMCxcbiAgICAgICAgd2FzRGVjbGluZWQ6IGZhbHNlLFxuICAgICAgICB3YXNJbmNvbWluZzogdHJ1ZSxcbiAgICAgICAgd2FzVmlkZW9DYWxsOiBmYWxzZSxcbiAgICAgICAgZW5kZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC8vIGFjY2VwdGVkIGluY29taW5nIHZpZGVvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIGFjY2VwdGVkVGltZTogRGF0ZS5ub3coKSAtIDQwMCxcbiAgICAgICAgd2FzRGVjbGluZWQ6IGZhbHNlLFxuICAgICAgICB3YXNJbmNvbWluZzogdHJ1ZSxcbiAgICAgICAgd2FzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICBlbmRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2NhbGxIaXN0b3J5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLy8gbWlzc2VkIChuZWl0aGVyIGFjY2VwdGVkIG5vciBkZWNsaW5lZCkgaW5jb21pbmcgYXVkaW9cbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgd2FzRGVjbGluZWQ6IGZhbHNlLFxuICAgICAgICB3YXNJbmNvbWluZzogdHJ1ZSxcbiAgICAgICAgd2FzVmlkZW9DYWxsOiBmYWxzZSxcbiAgICAgICAgZW5kZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC8vIG1pc3NlZCAobmVpdGhlciBhY2NlcHRlZCBub3IgZGVjbGluZWQpIGluY29taW5nIHZpZGVvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIHdhc0RlY2xpbmVkOiBmYWxzZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IHRydWUsXG4gICAgICAgIHdhc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgZW5kZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC8vIGFjY2VwdGVkIG91dGdvaW5nIGF1ZGlvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIGFjY2VwdGVkVGltZTogRGF0ZS5ub3coKSAtIDIwMCxcbiAgICAgICAgd2FzRGVjbGluZWQ6IGZhbHNlLFxuICAgICAgICB3YXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgIHdhc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgIGVuZGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBhY2NlcHRlZCBvdXRnb2luZyB2aWRlb1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICBhY2NlcHRlZFRpbWU6IERhdGUubm93KCkgLSAyMDAsXG4gICAgICAgIHdhc0RlY2xpbmVkOiBmYWxzZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IGZhbHNlLFxuICAgICAgICB3YXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgIGVuZGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBkZWNsaW5lZCBvdXRnb2luZyBhdWRpb1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICB3YXNEZWNsaW5lZDogdHJ1ZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IGZhbHNlLFxuICAgICAgICB3YXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICBlbmRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2NhbGxIaXN0b3J5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLy8gZGVjbGluZWQgb3V0Z29pbmcgdmlkZW9cbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgd2FzRGVjbGluZWQ6IHRydWUsXG4gICAgICAgIHdhc0luY29taW5nOiBmYWxzZSxcbiAgICAgICAgd2FzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICBlbmRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2NhbGxIaXN0b3J5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLy8gdW5hbnN3ZXJlZCAobmVpdGhlciBhY2NlcHRlZCBub3IgZGVjbGluZWQpIG91dGdvaW5nIGF1ZGlvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIHdhc0RlY2xpbmVkOiBmYWxzZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IGZhbHNlLFxuICAgICAgICB3YXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICBlbmRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2NhbGxIaXN0b3J5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLy8gdW5hbnN3ZXJlZCAobmVpdGhlciBhY2NlcHRlZCBub3IgZGVjbGluZWQpIG91dGdvaW5nIHZpZGVvXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIHdhc0RlY2xpbmVkOiBmYWxzZSxcbiAgICAgICAgd2FzSW5jb21pbmc6IGZhbHNlLFxuICAgICAgICB3YXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgIGVuZGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBvbmdvaW5nIGdyb3VwIGNhbGxcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2FiYzEyMycsXG4gICAgICAgIGNyZWF0b3I6IHtcbiAgICAgICAgICBmaXJzdE5hbWU6ICdMdWlnaScsXG4gICAgICAgICAgaXNNZTogZmFsc2UsXG4gICAgICAgICAgdGl0bGU6ICdMdWlnaSBNYXJpbycsXG4gICAgICAgIH0sXG4gICAgICAgIGVuZGVkOiBmYWxzZSxcbiAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBvbmdvaW5nIGdyb3VwIGNhbGwgc3RhcnRlZCBieSB5b3VcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2FiYzEyMycsXG4gICAgICAgIGNyZWF0b3I6IHtcbiAgICAgICAgICBmaXJzdE5hbWU6ICdQZWFjaCcsXG4gICAgICAgICAgaXNNZTogdHJ1ZSxcbiAgICAgICAgICB0aXRsZTogJ1ByaW5jZXNzIFBlYWNoJyxcbiAgICAgICAgfSxcbiAgICAgICAgZW5kZWQ6IGZhbHNlLFxuICAgICAgICBkZXZpY2VDb3VudDogMSxcbiAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgIHN0YXJ0ZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC8vIG9uZ29pbmcgZ3JvdXAgY2FsbCwgY3JlYXRvciB1bmtub3duXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdhYmMxMjMnLFxuICAgICAgICBlbmRlZDogZmFsc2UsXG4gICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICBtYXhEZXZpY2VzOiAxNixcbiAgICAgICAgc3RhcnRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ2NhbGxIaXN0b3J5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLy8gb25nb2luZyBhbmQgYWN0aXZlIGdyb3VwIGNhbGxcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBhY3RpdmVDYWxsQ29udmVyc2F0aW9uSWQ6ICdhYmMxMjMnLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2FiYzEyMycsXG4gICAgICAgIGNyZWF0b3I6IHtcbiAgICAgICAgICBmaXJzdE5hbWU6ICdMdWlnaScsXG4gICAgICAgICAgaXNNZTogZmFsc2UsXG4gICAgICAgICAgdGl0bGU6ICdMdWlnaSBNYXJpbycsXG4gICAgICAgIH0sXG4gICAgICAgIGVuZGVkOiBmYWxzZSxcbiAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBvbmdvaW5nIGdyb3VwIGNhbGwsIGJ1dCB5b3UncmUgaW4gYW5vdGhlciBvbmVcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBhY3RpdmVDYWxsQ29udmVyc2F0aW9uSWQ6ICdhYmMxMjMnLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ3h5ejk4NycsXG4gICAgICAgIGNyZWF0b3I6IHtcbiAgICAgICAgICBmaXJzdE5hbWU6ICdMdWlnaScsXG4gICAgICAgICAgaXNNZTogZmFsc2UsXG4gICAgICAgICAgdGl0bGU6ICdMdWlnaSBNYXJpbycsXG4gICAgICAgIH0sXG4gICAgICAgIGVuZGVkOiBmYWxzZSxcbiAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBvbmdvaW5nIGZ1bGwgZ3JvdXAgY2FsbFxuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnYWJjMTIzJyxcbiAgICAgICAgY3JlYXRvcjoge1xuICAgICAgICAgIGZpcnN0TmFtZTogJ0x1aWdpJyxcbiAgICAgICAgICBpc01lOiBmYWxzZSxcbiAgICAgICAgICB0aXRsZTogJ0x1aWdpIE1hcmlvJyxcbiAgICAgICAgfSxcbiAgICAgICAgZW5kZWQ6IGZhbHNlLFxuICAgICAgICBkZXZpY2VDb3VudDogMTYsXG4gICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnY2FsbEhpc3RvcnknLFxuICAgICAgZGF0YToge1xuICAgICAgICAvLyBmaW5pc2hlZCBjYWxsXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdhYmMxMjMnLFxuICAgICAgICBjcmVhdG9yOiB7XG4gICAgICAgICAgZmlyc3ROYW1lOiAnTHVpZ2knLFxuICAgICAgICAgIGlzTWU6IGZhbHNlLFxuICAgICAgICAgIHRpdGxlOiAnTHVpZ2kgTWFyaW8nLFxuICAgICAgICB9LFxuICAgICAgICBlbmRlZDogdHJ1ZSxcbiAgICAgICAgZGV2aWNlQ291bnQ6IDAsXG4gICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAncHJvZmlsZUNoYW5nZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYW5nZToge1xuICAgICAgICAgIHR5cGU6ICduYW1lJyxcbiAgICAgICAgICBvbGROYW1lOiAnRnJlZCcsXG4gICAgICAgICAgbmV3TmFtZTogJ0pvaG4nLFxuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VkQ29udGFjdDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdyZXNldFNlc3Npb25Ob3RpZmljYXRpb24nLFxuICAgICAgZGF0YTogbnVsbCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICd1bnN1cHBvcnRlZE1lc3NhZ2UnLFxuICAgICAgZGF0YToge1xuICAgICAgICBjYW5Qcm9jZXNzTm93OiB0cnVlLFxuICAgICAgICBjb250YWN0OiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3Vuc3VwcG9ydGVkTWVzc2FnZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNhblByb2Nlc3NOb3c6IGZhbHNlLFxuICAgICAgICBjb250YWN0OiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ3ZlcmlmaWNhdGlvbk5vdGlmaWNhdGlvbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHR5cGU6ICdtYXJrVmVyaWZpZWQnLFxuICAgICAgICBpc0xvY2FsOiBmYWxzZSxcbiAgICAgICAgY29udGFjdDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICd2ZXJpZmljYXRpb25Ob3RpZmljYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICB0eXBlOiAnbWFya1ZlcmlmaWVkJyxcbiAgICAgICAgaXNMb2NhbDogdHJ1ZSxcbiAgICAgICAgY29udGFjdDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICd2ZXJpZmljYXRpb25Ob3RpZmljYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICB0eXBlOiAnbWFya05vdFZlcmlmaWVkJyxcbiAgICAgICAgaXNMb2NhbDogZmFsc2UsXG4gICAgICAgIGNvbnRhY3Q6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAndmVyaWZpY2F0aW9uTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdHlwZTogJ21hcmtOb3RWZXJpZmllZCcsXG4gICAgICAgIGlzTG9jYWw6IHRydWUsXG4gICAgICAgIGNvbnRhY3Q6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7aXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuICAgICAgICA8UmVhY3QuRnJhZ21lbnQga2V5PXtpbmRleH0+XG4gICAgICAgICAgPFRpbWVsaW5lSXRlbVxuICAgICAgICAgICAgey4uLmdldERlZmF1bHRQcm9wcygpfVxuICAgICAgICAgICAgaXRlbT17aXRlbSBhcyBUaW1lbGluZUl0ZW1Qcm9wc1snaXRlbSddfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgKSl9XG4gICAgPC8+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgVW5rbm93blR5cGUgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBpdGVtID0ge1xuICAgIHR5cGU6ICdyYW5kb20nLFxuICAgIGRhdGE6IHtcbiAgICAgIHNvbWV0aGluOiAnc29tZXRoaW4nLFxuICAgIH0sXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgfSBhcyBhbnkgYXMgVGltZWxpbmVJdGVtUHJvcHNbJ2l0ZW0nXTtcblxuICByZXR1cm4gPFRpbWVsaW5lSXRlbSB7Li4uZ2V0RGVmYXVsdFByb3BzKCl9IGl0ZW09e2l0ZW19IGkxOG49e2kxOG59IC8+O1xufTtcblxuZXhwb3J0IGNvbnN0IE1pc3NpbmdJdGVtID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgY29uc3QgaXRlbSA9IG51bGwgYXMgYW55IGFzIFRpbWVsaW5lSXRlbVByb3BzWydpdGVtJ107XG5cbiAgcmV0dXJuIDxUaW1lbGluZUl0ZW0gey4uLmdldERlZmF1bHRQcm9wcygpfSBpdGVtPXtpdGVtfSBpMThuPXtpMThufSAvPjtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxZQUF1QjtBQUV2QiwyQkFBdUI7QUFFdkIseUJBQTRCO0FBQzVCLHVCQUEwQjtBQUMxQixzQkFBdUI7QUFFdkIsMEJBQTZCO0FBQzdCLHdDQUEyQztBQUMzQyxxQkFBeUI7QUFDekIsb0JBQTZCO0FBQzdCLG9DQUF1QztBQUN2QyxrQkFBZ0M7QUFDaEMsa0JBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLE1BQU0sb0JBQTRELHdCQUFDO0FBQUEsRUFDakU7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE1BRUEsb0NBQUM7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
