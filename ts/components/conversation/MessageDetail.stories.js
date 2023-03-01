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
var MessageDetail_stories_exports = {};
__export(MessageDetail_stories_exports, {
  AllErrors: () => AllErrors,
  DeliveredIncoming: () => DeliveredIncoming,
  DeliveredOutgoing: () => DeliveredOutgoing,
  MessageStatuses: () => MessageStatuses,
  NoContacts: () => NoContacts,
  NotDelivered: () => NotDelivered,
  default: () => MessageDetail_stories_default
});
module.exports = __toCommonJS(MessageDetail_stories_exports);
var React = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_addon_knobs = require("@storybook/addon-knobs");
var import_Message = require("./Message");
var import_MessageDetail = require("./MessageDetail");
var import_MessageSendState = require("../../messages/MessageSendState");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_getFakeBadge = require("../../test-both/helpers/getFakeBadge");
var import_Util = require("../../types/Util");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var MessageDetail_stories_default = {
  title: "Components/Conversation/MessageDetail"
};
const defaultMessage = {
  author: (0, import_getDefaultConversation.getDefaultConversation)({
    id: "some-id",
    title: "Max"
  }),
  canReact: true,
  canReply: true,
  canRetry: true,
  canRetryDeleteForEveryone: true,
  canDeleteForEveryone: true,
  canDownload: true,
  conversationColor: "crimson",
  conversationId: "my-convo",
  conversationTitle: "Conversation Title",
  conversationType: "direct",
  direction: "incoming",
  id: "my-message",
  renderingContext: "storybook",
  isBlocked: false,
  isMessageRequestAccepted: true,
  previews: [],
  readStatus: import_MessageReadStatus.ReadStatus.Read,
  status: "sent",
  text: "A message from Max",
  textDirection: import_Message.TextDirection.Default,
  timestamp: Date.now()
};
const createProps = /* @__PURE__ */ __name((overrideProps = {}) => ({
  contacts: overrideProps.contacts || [
    {
      ...(0, import_getDefaultConversation.getDefaultConversation)({
        title: "Just Max"
      }),
      isOutgoingKeyError: false,
      isUnidentifiedDelivery: false,
      status: import_MessageSendState.SendStatus.Delivered
    }
  ],
  errors: overrideProps.errors || [],
  message: overrideProps.message || defaultMessage,
  receivedAt: (0, import_addon_knobs.number)("receivedAt", overrideProps.receivedAt || Date.now()),
  sentAt: (0, import_addon_knobs.number)("sentAt", overrideProps.sentAt || Date.now()),
  getPreferredBadge: () => (0, import_getFakeBadge.getFakeBadge)(),
  i18n,
  interactionMode: "keyboard",
  theme: import_Util.ThemeType.light,
  showSafetyNumber: (0, import_addon_actions.action)("showSafetyNumber"),
  checkForAccount: (0, import_addon_actions.action)("checkForAccount"),
  clearSelectedMessage: (0, import_addon_actions.action)("clearSelectedMessage"),
  displayTapToViewMessage: (0, import_addon_actions.action)("displayTapToViewMessage"),
  doubleCheckMissingQuoteReference: (0, import_addon_actions.action)("doubleCheckMissingQuoteReference"),
  kickOffAttachmentDownload: (0, import_addon_actions.action)("kickOffAttachmentDownload"),
  markAttachmentAsCorrupted: (0, import_addon_actions.action)("markAttachmentAsCorrupted"),
  markViewed: (0, import_addon_actions.action)("markViewed"),
  openConversation: (0, import_addon_actions.action)("openConversation"),
  openGiftBadge: (0, import_addon_actions.action)("openGiftBadge"),
  openLink: (0, import_addon_actions.action)("openLink"),
  reactToMessage: (0, import_addon_actions.action)("reactToMessage"),
  renderAudioAttachment: () => /* @__PURE__ */ React.createElement("div", null, "*AudioAttachment*"),
  renderEmojiPicker: () => /* @__PURE__ */ React.createElement("div", null),
  renderReactionPicker: () => /* @__PURE__ */ React.createElement("div", null),
  replyToMessage: (0, import_addon_actions.action)("replyToMessage"),
  retrySend: (0, import_addon_actions.action)("retrySend"),
  retryDeleteForEveryone: (0, import_addon_actions.action)("retryDeleteForEveryone"),
  showContactDetail: (0, import_addon_actions.action)("showContactDetail"),
  showContactModal: (0, import_addon_actions.action)("showContactModal"),
  showExpiredIncomingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  showExpiredOutgoingTapToViewToast: (0, import_addon_actions.action)("showExpiredOutgoingTapToViewToast"),
  showForwardMessageModal: (0, import_addon_actions.action)("showForwardMessageModal"),
  showVisualAttachment: (0, import_addon_actions.action)("showVisualAttachment"),
  startConversation: (0, import_addon_actions.action)("startConversation"),
  viewStory: (0, import_addon_actions.action)("viewStory")
}), "createProps");
const DeliveredIncoming = /* @__PURE__ */ __name(() => {
  const props = createProps({
    contacts: [
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          color: "forest",
          title: "Max"
        }),
        status: void 0,
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false
      }
    ]
  });
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "DeliveredIncoming");
const DeliveredOutgoing = /* @__PURE__ */ __name(() => {
  const props = createProps({
    message: {
      ...defaultMessage,
      direction: "outgoing",
      text: "A message to Max"
    }
  });
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "DeliveredOutgoing");
const MessageStatuses = /* @__PURE__ */ __name(() => {
  const props = createProps({
    contacts: [
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Max"
        }),
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Sent
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Sally"
        }),
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Pending
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Terry"
        }),
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Failed
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Theo"
        }),
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Delivered
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Nikki"
        }),
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Read
      }
    ],
    message: {
      ...defaultMessage,
      conversationType: "group",
      text: "A message to you all!"
    }
  });
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "MessageStatuses");
const NotDelivered = /* @__PURE__ */ __name(() => {
  const props = createProps({
    message: {
      ...defaultMessage,
      direction: "outgoing",
      text: "A message to Max"
    }
  });
  props.receivedAt = void 0;
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "NotDelivered");
const NoContacts = /* @__PURE__ */ __name(() => {
  const props = createProps({
    contacts: [],
    message: {
      ...defaultMessage,
      direction: "outgoing",
      text: "Is anybody there?"
    }
  });
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "NoContacts");
const AllErrors = /* @__PURE__ */ __name(() => {
  const props = createProps({
    errors: [
      {
        name: "Another Error",
        message: "Wow, that went bad."
      }
    ],
    message: {
      ...defaultMessage
    },
    contacts: [
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Max"
        }),
        isOutgoingKeyError: true,
        isUnidentifiedDelivery: false,
        status: import_MessageSendState.SendStatus.Failed
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Sally"
        }),
        errors: [
          {
            name: "Big Error",
            message: "Stuff happened, in a bad way."
          }
        ],
        isOutgoingKeyError: false,
        isUnidentifiedDelivery: true,
        status: import_MessageSendState.SendStatus.Failed
      },
      {
        ...(0, import_getDefaultConversation.getDefaultConversation)({
          title: "Terry"
        }),
        isOutgoingKeyError: true,
        isUnidentifiedDelivery: true,
        status: import_MessageSendState.SendStatus.Failed
      }
    ]
  });
  return /* @__PURE__ */ React.createElement(import_MessageDetail.MessageDetail, {
    ...props
  });
}, "AllErrors");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AllErrors,
  DeliveredIncoming,
  DeliveredOutgoing,
  MessageStatuses,
  NoContacts,
  NotDelivered
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZURldGFpbC5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgYWN0aW9uIH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1hY3Rpb25zJztcbmltcG9ydCB7IG51bWJlciB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24ta25vYnMnO1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzRGF0YSBhcyBNZXNzYWdlRGF0YVByb3BzVHlwZSB9IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBUZXh0RGlyZWN0aW9uIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL01lc3NhZ2VEZXRhaWwnO1xuaW1wb3J0IHsgTWVzc2FnZURldGFpbCB9IGZyb20gJy4vTWVzc2FnZURldGFpbCc7XG5pbXBvcnQgeyBTZW5kU3RhdHVzIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVJlYWRTdGF0dXMnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uLy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBnZXRGYWtlQmFkZ2UgfSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9nZXRGYWtlQmFkZ2UnO1xuaW1wb3J0IHsgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL0NvbnZlcnNhdGlvbi9NZXNzYWdlRGV0YWlsJyxcbn07XG5cbmNvbnN0IGRlZmF1bHRNZXNzYWdlOiBNZXNzYWdlRGF0YVByb3BzVHlwZSA9IHtcbiAgYXV0aG9yOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICBpZDogJ3NvbWUtaWQnLFxuICAgIHRpdGxlOiAnTWF4JyxcbiAgfSksXG4gIGNhblJlYWN0OiB0cnVlLFxuICBjYW5SZXBseTogdHJ1ZSxcbiAgY2FuUmV0cnk6IHRydWUsXG4gIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gIGNhbkRlbGV0ZUZvckV2ZXJ5b25lOiB0cnVlLFxuICBjYW5Eb3dubG9hZDogdHJ1ZSxcbiAgY29udmVyc2F0aW9uQ29sb3I6ICdjcmltc29uJyxcbiAgY29udmVyc2F0aW9uSWQ6ICdteS1jb252bycsXG4gIGNvbnZlcnNhdGlvblRpdGxlOiAnQ29udmVyc2F0aW9uIFRpdGxlJyxcbiAgY29udmVyc2F0aW9uVHlwZTogJ2RpcmVjdCcsXG4gIGRpcmVjdGlvbjogJ2luY29taW5nJyxcbiAgaWQ6ICdteS1tZXNzYWdlJyxcbiAgcmVuZGVyaW5nQ29udGV4dDogJ3N0b3J5Ym9vaycsXG4gIGlzQmxvY2tlZDogZmFsc2UsXG4gIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZDogdHJ1ZSxcbiAgcHJldmlld3M6IFtdLFxuICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gIHN0YXR1czogJ3NlbnQnLFxuICB0ZXh0OiAnQSBtZXNzYWdlIGZyb20gTWF4JyxcbiAgdGV4dERpcmVjdGlvbjogVGV4dERpcmVjdGlvbi5EZWZhdWx0LFxuICB0aW1lc3RhbXA6IERhdGUubm93KCksXG59O1xuXG5jb25zdCBjcmVhdGVQcm9wcyA9IChvdmVycmlkZVByb3BzOiBQYXJ0aWFsPFByb3BzPiA9IHt9KTogUHJvcHMgPT4gKHtcbiAgY29udGFjdHM6IG92ZXJyaWRlUHJvcHMuY29udGFjdHMgfHwgW1xuICAgIHtcbiAgICAgIC4uLmdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICB0aXRsZTogJ0p1c3QgTWF4JyxcbiAgICAgIH0pLFxuICAgICAgaXNPdXRnb2luZ0tleUVycm9yOiBmYWxzZSxcbiAgICAgIGlzVW5pZGVudGlmaWVkRGVsaXZlcnk6IGZhbHNlLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICB9LFxuICBdLFxuICBlcnJvcnM6IG92ZXJyaWRlUHJvcHMuZXJyb3JzIHx8IFtdLFxuICBtZXNzYWdlOiBvdmVycmlkZVByb3BzLm1lc3NhZ2UgfHwgZGVmYXVsdE1lc3NhZ2UsXG4gIHJlY2VpdmVkQXQ6IG51bWJlcigncmVjZWl2ZWRBdCcsIG92ZXJyaWRlUHJvcHMucmVjZWl2ZWRBdCB8fCBEYXRlLm5vdygpKSxcbiAgc2VudEF0OiBudW1iZXIoJ3NlbnRBdCcsIG92ZXJyaWRlUHJvcHMuc2VudEF0IHx8IERhdGUubm93KCkpLFxuXG4gIGdldFByZWZlcnJlZEJhZGdlOiAoKSA9PiBnZXRGYWtlQmFkZ2UoKSxcbiAgaTE4bixcbiAgaW50ZXJhY3Rpb25Nb2RlOiAna2V5Ym9hcmQnLFxuICB0aGVtZTogVGhlbWVUeXBlLmxpZ2h0LFxuXG4gIHNob3dTYWZldHlOdW1iZXI6IGFjdGlvbignc2hvd1NhZmV0eU51bWJlcicpLFxuXG4gIGNoZWNrRm9yQWNjb3VudDogYWN0aW9uKCdjaGVja0ZvckFjY291bnQnKSxcbiAgY2xlYXJTZWxlY3RlZE1lc3NhZ2U6IGFjdGlvbignY2xlYXJTZWxlY3RlZE1lc3NhZ2UnKSxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IGFjdGlvbignZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnKSxcbiAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2U6IGFjdGlvbignZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UnKSxcbiAga2lja09mZkF0dGFjaG1lbnREb3dubG9hZDogYWN0aW9uKCdraWNrT2ZmQXR0YWNobWVudERvd25sb2FkJyksXG4gIG1hcmtBdHRhY2htZW50QXNDb3JydXB0ZWQ6IGFjdGlvbignbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZCcpLFxuICBtYXJrVmlld2VkOiBhY3Rpb24oJ21hcmtWaWV3ZWQnKSxcbiAgb3BlbkNvbnZlcnNhdGlvbjogYWN0aW9uKCdvcGVuQ29udmVyc2F0aW9uJyksXG4gIG9wZW5HaWZ0QmFkZ2U6IGFjdGlvbignb3BlbkdpZnRCYWRnZScpLFxuICBvcGVuTGluazogYWN0aW9uKCdvcGVuTGluaycpLFxuICByZWFjdFRvTWVzc2FnZTogYWN0aW9uKCdyZWFjdFRvTWVzc2FnZScpLFxuICByZW5kZXJBdWRpb0F0dGFjaG1lbnQ6ICgpID0+IDxkaXY+KkF1ZGlvQXR0YWNobWVudCo8L2Rpdj4sXG4gIHJlbmRlckVtb2ppUGlja2VyOiAoKSA9PiA8ZGl2IC8+LFxuICByZW5kZXJSZWFjdGlvblBpY2tlcjogKCkgPT4gPGRpdiAvPixcbiAgcmVwbHlUb01lc3NhZ2U6IGFjdGlvbigncmVwbHlUb01lc3NhZ2UnKSxcbiAgcmV0cnlTZW5kOiBhY3Rpb24oJ3JldHJ5U2VuZCcpLFxuICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiBhY3Rpb24oJ3JldHJ5RGVsZXRlRm9yRXZlcnlvbmUnKSxcbiAgc2hvd0NvbnRhY3REZXRhaWw6IGFjdGlvbignc2hvd0NvbnRhY3REZXRhaWwnKSxcbiAgc2hvd0NvbnRhY3RNb2RhbDogYWN0aW9uKCdzaG93Q29udGFjdE1vZGFsJyksXG4gIHNob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdDogYWN0aW9uKFxuICAgICdzaG93RXhwaXJlZEluY29taW5nVGFwVG9WaWV3VG9hc3QnXG4gICksXG4gIHNob3dFeHBpcmVkT3V0Z29pbmdUYXBUb1ZpZXdUb2FzdDogYWN0aW9uKFxuICAgICdzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3QnXG4gICksXG4gIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsOiBhY3Rpb24oJ3Nob3dGb3J3YXJkTWVzc2FnZU1vZGFsJyksXG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiBhY3Rpb24oJ3Nob3dWaXN1YWxBdHRhY2htZW50JyksXG4gIHN0YXJ0Q29udmVyc2F0aW9uOiBhY3Rpb24oJ3N0YXJ0Q29udmVyc2F0aW9uJyksXG4gIHZpZXdTdG9yeTogYWN0aW9uKCd2aWV3U3RvcnknKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgRGVsaXZlcmVkSW5jb21pbmcgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IGNyZWF0ZVByb3BzKHtcbiAgICBjb250YWN0czogW1xuICAgICAge1xuICAgICAgICAuLi5nZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgICBjb2xvcjogJ2ZvcmVzdCcsXG4gICAgICAgICAgdGl0bGU6ICdNYXgnLFxuICAgICAgICB9KSxcbiAgICAgICAgc3RhdHVzOiB1bmRlZmluZWQsXG4gICAgICAgIGlzT3V0Z29pbmdLZXlFcnJvcjogZmFsc2UsXG4gICAgICAgIGlzVW5pZGVudGlmaWVkRGVsaXZlcnk6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbiAgcmV0dXJuIDxNZXNzYWdlRGV0YWlsIHsuLi5wcm9wc30gLz47XG59O1xuXG5leHBvcnQgY29uc3QgRGVsaXZlcmVkT3V0Z29pbmcgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IGNyZWF0ZVByb3BzKHtcbiAgICBtZXNzYWdlOiB7XG4gICAgICAuLi5kZWZhdWx0TWVzc2FnZSxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIHRleHQ6ICdBIG1lc3NhZ2UgdG8gTWF4JyxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIDxNZXNzYWdlRGV0YWlsIHsuLi5wcm9wc30gLz47XG59O1xuXG5leHBvcnQgY29uc3QgTWVzc2FnZVN0YXR1c2VzID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHMgPSBjcmVhdGVQcm9wcyh7XG4gICAgY29udGFjdHM6IFtcbiAgICAgIHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6ICdNYXgnLFxuICAgICAgICB9KSxcbiAgICAgICAgaXNPdXRnb2luZ0tleUVycm9yOiBmYWxzZSxcbiAgICAgICAgaXNVbmlkZW50aWZpZWREZWxpdmVyeTogZmFsc2UsXG4gICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6ICdTYWxseScsXG4gICAgICAgIH0pLFxuICAgICAgICBpc091dGdvaW5nS2V5RXJyb3I6IGZhbHNlLFxuICAgICAgICBpc1VuaWRlbnRpZmllZERlbGl2ZXJ5OiBmYWxzZSxcbiAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAuLi5nZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgICB0aXRsZTogJ1RlcnJ5JyxcbiAgICAgICAgfSksXG4gICAgICAgIGlzT3V0Z29pbmdLZXlFcnJvcjogZmFsc2UsXG4gICAgICAgIGlzVW5pZGVudGlmaWVkRGVsaXZlcnk6IGZhbHNlLFxuICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuRmFpbGVkLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6ICdUaGVvJyxcbiAgICAgICAgfSksXG4gICAgICAgIGlzT3V0Z29pbmdLZXlFcnJvcjogZmFsc2UsXG4gICAgICAgIGlzVW5pZGVudGlmaWVkRGVsaXZlcnk6IGZhbHNlLFxuICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuRGVsaXZlcmVkLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6ICdOaWtraScsXG4gICAgICAgIH0pLFxuICAgICAgICBpc091dGdvaW5nS2V5RXJyb3I6IGZhbHNlLFxuICAgICAgICBpc1VuaWRlbnRpZmllZERlbGl2ZXJ5OiBmYWxzZSxcbiAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlJlYWQsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbWVzc2FnZToge1xuICAgICAgLi4uZGVmYXVsdE1lc3NhZ2UsXG4gICAgICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICAgICAgdGV4dDogJ0EgbWVzc2FnZSB0byB5b3UgYWxsIScsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiA8TWVzc2FnZURldGFpbCB7Li4ucHJvcHN9IC8+O1xufTtcblxuZXhwb3J0IGNvbnN0IE5vdERlbGl2ZXJlZCA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gY3JlYXRlUHJvcHMoe1xuICAgIG1lc3NhZ2U6IHtcbiAgICAgIC4uLmRlZmF1bHRNZXNzYWdlLFxuICAgICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICAgICAgdGV4dDogJ0EgbWVzc2FnZSB0byBNYXgnLFxuICAgIH0sXG4gIH0pO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBwcm9wcy5yZWNlaXZlZEF0ID0gdW5kZWZpbmVkIGFzIGFueTtcblxuICByZXR1cm4gPE1lc3NhZ2VEZXRhaWwgey4uLnByb3BzfSAvPjtcbn07XG5cbmV4cG9ydCBjb25zdCBOb0NvbnRhY3RzID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHMgPSBjcmVhdGVQcm9wcyh7XG4gICAgY29udGFjdHM6IFtdLFxuICAgIG1lc3NhZ2U6IHtcbiAgICAgIC4uLmRlZmF1bHRNZXNzYWdlLFxuICAgICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICAgICAgdGV4dDogJ0lzIGFueWJvZHkgdGhlcmU/JyxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIDxNZXNzYWdlRGV0YWlsIHsuLi5wcm9wc30gLz47XG59O1xuXG5leHBvcnQgY29uc3QgQWxsRXJyb3JzID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHMgPSBjcmVhdGVQcm9wcyh7XG4gICAgZXJyb3JzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdBbm90aGVyIEVycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ1dvdywgdGhhdCB3ZW50IGJhZC4nLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG1lc3NhZ2U6IHtcbiAgICAgIC4uLmRlZmF1bHRNZXNzYWdlLFxuICAgIH0sXG4gICAgY29udGFjdHM6IFtcbiAgICAgIHtcbiAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6ICdNYXgnLFxuICAgICAgICB9KSxcbiAgICAgICAgaXNPdXRnb2luZ0tleUVycm9yOiB0cnVlLFxuICAgICAgICBpc1VuaWRlbnRpZmllZERlbGl2ZXJ5OiBmYWxzZSxcbiAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkZhaWxlZCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC4uLmdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICAgIHRpdGxlOiAnU2FsbHknLFxuICAgICAgICB9KSxcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0JpZyBFcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnU3R1ZmYgaGFwcGVuZWQsIGluIGEgYmFkIHdheS4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlzT3V0Z29pbmdLZXlFcnJvcjogZmFsc2UsXG4gICAgICAgIGlzVW5pZGVudGlmaWVkRGVsaXZlcnk6IHRydWUsXG4gICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5GYWlsZWQsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAuLi5nZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgICB0aXRsZTogJ1RlcnJ5JyxcbiAgICAgICAgfSksXG4gICAgICAgIGlzT3V0Z29pbmdLZXlFcnJvcjogdHJ1ZSxcbiAgICAgICAgaXNVbmlkZW50aWZpZWREZWxpdmVyeTogdHJ1ZSxcbiAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkZhaWxlZCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG4gIHJldHVybiA8TWVzc2FnZURldGFpbCB7Li4ucHJvcHN9IC8+O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxZQUF1QjtBQUV2QiwyQkFBdUI7QUFDdkIseUJBQXVCO0FBR3ZCLHFCQUE4QjtBQUU5QiwyQkFBOEI7QUFDOUIsOEJBQTJCO0FBQzNCLCtCQUEyQjtBQUMzQixvQ0FBdUM7QUFDdkMsdUJBQTBCO0FBQzFCLHNCQUF1QjtBQUN2QiwwQkFBNkI7QUFDN0Isa0JBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sZ0NBQVE7QUFBQSxFQUNiLE9BQU87QUFDVDtBQUVBLE1BQU0saUJBQXVDO0FBQUEsRUFDM0MsUUFBUSwwREFBdUI7QUFBQSxJQUM3QixJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsRUFDVCxDQUFDO0FBQUEsRUFDRCxVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDViwyQkFBMkI7QUFBQSxFQUMzQixzQkFBc0I7QUFBQSxFQUN0QixhQUFhO0FBQUEsRUFDYixtQkFBbUI7QUFBQSxFQUNuQixnQkFB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
