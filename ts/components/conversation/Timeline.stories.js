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
var Timeline_stories_exports = {};
__export(Timeline_stories_exports, {
  EmptyJustHero: () => EmptyJustHero,
  LastSeen: () => LastSeen,
  OldestAndNewest: () => OldestAndNewest,
  TargetIndexToTop: () => TargetIndexToTop,
  TypingIndicator: () => TypingIndicator,
  WithActiveMessageRequest: () => WithActiveMessageRequest,
  WithInvitedContactsForANewlyCreatedGroup: () => WithInvitedContactsForANewlyCreatedGroup,
  WithSameNameInDirectConversationWarning: () => WithSameNameInDirectConversationWarning,
  WithSameNameInGroupConversationWarning: () => WithSameNameInGroupConversationWarning,
  WithoutNewestMessage: () => WithoutNewestMessage,
  WithoutNewestMessageActiveMessageRequest: () => WithoutNewestMessageActiveMessageRequest,
  WithoutOldestMessage: () => WithoutOldestMessage,
  default: () => Timeline_stories_default
});
module.exports = __toCommonJS(Timeline_stories_exports);
var React = __toESM(require("react"));
var moment = __toESM(require("moment"));
var import_lodash = require("lodash");
var import_uuid = require("uuid");
var import_addon_knobs = require("@storybook/addon-knobs");
var import_addon_actions = require("@storybook/addon-actions");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_Timeline = require("./Timeline");
var import_TimelineItem = require("./TimelineItem");
var import_ContactSpoofingReviewDialog = require("./ContactSpoofingReviewDialog");
var import_StorybookThemeContext = require("../../../.storybook/StorybookThemeContext");
var import_ConversationHero = require("./ConversationHero");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_getRandomColor = require("../../test-both/helpers/getRandomColor");
var import_TypingBubble = require("./TypingBubble");
var import_contactSpoofing = require("../../util/contactSpoofing");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_Util = require("../../types/Util");
var import_Message = require("./Message");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var Timeline_stories_default = {
  title: "Components/Conversation/Timeline"
};
const noop = /* @__PURE__ */ __name(() => {
}, "noop");
const items = {
  "id-1": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({
        phoneNumber: "(202) 555-2001"
      }),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "forest",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "incoming",
      id: "id-1",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      text: "\u{1F525}",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-2": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "forest",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "incoming",
      id: "id-2",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      text: "Hello there from the new world! http://somewhere.com",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-2.5": {
    type: "unsupportedMessage",
    data: {
      canProcessNow: false,
      contact: {
        id: "061d3783-5736-4145-b1a2-6b6cf1156393",
        isMe: false,
        phoneNumber: "(202) 555-1000",
        profileName: "Mr. Pig",
        title: "Mr. Pig"
      }
    },
    timestamp: Date.now()
  },
  "id-3": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "crimson",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "incoming",
      id: "id-3",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      text: "Hello there from the new world!",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-4": {
    type: "timerNotification",
    data: {
      disabled: false,
      expireTimer: moment.duration(2, "hours").asSeconds(),
      title: "It's Me",
      type: "fromMe"
    },
    timestamp: Date.now()
  },
  "id-5": {
    type: "timerNotification",
    data: {
      disabled: false,
      expireTimer: moment.duration(2, "hours").asSeconds(),
      title: "(202) 555-0000",
      type: "fromOther"
    },
    timestamp: Date.now()
  },
  "id-6": {
    type: "safetyNumberNotification",
    data: {
      contact: {
        id: "+1202555000",
        title: "Mr. Fire"
      },
      isGroup: true
    },
    timestamp: Date.now()
  },
  "id-7": {
    type: "verificationNotification",
    data: {
      contact: { title: "Mrs. Ice" },
      isLocal: true,
      type: "markVerified"
    },
    timestamp: Date.now()
  },
  "id-8": {
    type: "groupNotification",
    data: {
      changes: [
        {
          type: "name",
          newName: "Squirrels and their uses"
        },
        {
          type: "add",
          contacts: [
            (0, import_getDefaultConversation.getDefaultConversation)({
              phoneNumber: "(202) 555-0002",
              title: "Mr. Fire"
            }),
            (0, import_getDefaultConversation.getDefaultConversation)({
              phoneNumber: "(202) 555-0003",
              title: "Ms. Water"
            })
          ]
        }
      ],
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        phoneNumber: "(202) 555-0001",
        title: "Mrs. Ice",
        isMe: false
      })
    },
    timestamp: Date.now()
  },
  "id-9": {
    type: "resetSessionNotification",
    data: null,
    timestamp: Date.now()
  },
  "id-10": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "plum",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "outgoing",
      id: "id-6",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      status: "sent",
      text: "\u{1F525}",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-11": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "crimson",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "outgoing",
      id: "id-7",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      status: "read",
      text: "Hello there from the new world! http://somewhere.com",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-12": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "crimson",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "outgoing",
      id: "id-8",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      status: "sent",
      text: "Hello there from the new world! \u{1F525}",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-13": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "crimson",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "outgoing",
      id: "id-9",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      status: "sent",
      text: "Hello there from the new world! And this is multiple lines of text. Lines and lines and lines.",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  },
  "id-14": {
    type: "message",
    data: {
      author: (0, import_getDefaultConversation.getDefaultConversation)({}),
      canDeleteForEveryone: false,
      canDownload: true,
      canReact: true,
      canReply: true,
      canRetry: true,
      canRetryDeleteForEveryone: true,
      conversationColor: "crimson",
      conversationId: "conversation-id",
      conversationTitle: "Conversation Title",
      conversationType: "group",
      direction: "outgoing",
      id: "id-10",
      isBlocked: false,
      isMessageRequestAccepted: true,
      previews: [],
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      status: "read",
      text: "Hello there from the new world! And this is multiple lines of text. Lines and lines and lines.",
      textDirection: import_Message.TextDirection.Default,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  }
};
const actions = /* @__PURE__ */ __name(() => ({
  acknowledgeGroupMemberNameCollisions: (0, import_addon_actions.action)("acknowledgeGroupMemberNameCollisions"),
  blockGroupLinkRequests: (0, import_addon_actions.action)("blockGroupLinkRequests"),
  checkForAccount: (0, import_addon_actions.action)("checkForAccount"),
  clearInvitedUuidsForNewlyCreatedGroup: (0, import_addon_actions.action)("clearInvitedUuidsForNewlyCreatedGroup"),
  setIsNearBottom: (0, import_addon_actions.action)("setIsNearBottom"),
  learnMoreAboutDeliveryIssue: (0, import_addon_actions.action)("learnMoreAboutDeliveryIssue"),
  loadOlderMessages: (0, import_addon_actions.action)("loadOlderMessages"),
  loadNewerMessages: (0, import_addon_actions.action)("loadNewerMessages"),
  loadNewestMessages: (0, import_addon_actions.action)("loadNewestMessages"),
  markMessageRead: (0, import_addon_actions.action)("markMessageRead"),
  selectMessage: (0, import_addon_actions.action)("selectMessage"),
  clearSelectedMessage: (0, import_addon_actions.action)("clearSelectedMessage"),
  updateSharedGroups: (0, import_addon_actions.action)("updateSharedGroups"),
  reactToMessage: (0, import_addon_actions.action)("reactToMessage"),
  replyToMessage: (0, import_addon_actions.action)("replyToMessage"),
  retryDeleteForEveryone: (0, import_addon_actions.action)("retryDeleteForEveryone"),
  retrySend: (0, import_addon_actions.action)("retrySend"),
  deleteMessage: (0, import_addon_actions.action)("deleteMessage"),
  deleteMessageForEveryone: (0, import_addon_actions.action)("deleteMessageForEveryone"),
  showMessageDetail: (0, import_addon_actions.action)("showMessageDetail"),
  openConversation: (0, import_addon_actions.action)("openConversation"),
  showContactDetail: (0, import_addon_actions.action)("showContactDetail"),
  showContactModal: (0, import_addon_actions.action)("showContactModal"),
  kickOffAttachmentDownload: (0, import_addon_actions.action)("kickOffAttachmentDownload"),
  markAttachmentAsCorrupted: (0, import_addon_actions.action)("markAttachmentAsCorrupted"),
  markViewed: (0, import_addon_actions.action)("markViewed"),
  messageExpanded: (0, import_addon_actions.action)("messageExpanded"),
  showVisualAttachment: (0, import_addon_actions.action)("showVisualAttachment"),
  downloadAttachment: (0, import_addon_actions.action)("downloadAttachment"),
  displayTapToViewMessage: (0, import_addon_actions.action)("displayTapToViewMessage"),
  doubleCheckMissingQuoteReference: (0, import_addon_actions.action)("doubleCheckMissingQuoteReference"),
  openLink: (0, import_addon_actions.action)("openLink"),
  openGiftBadge: (0, import_addon_actions.action)("openGiftBadge"),
  scrollToQuotedMessage: (0, import_addon_actions.action)("scrollToQuotedMessage"),
  showExpiredIncomingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  showExpiredOutgoingTapToViewToast: (0, import_addon_actions.action)("showExpiredOutgoingTapToViewToast"),
  showForwardMessageModal: (0, import_addon_actions.action)("showForwardMessageModal"),
  showIdentity: (0, import_addon_actions.action)("showIdentity"),
  downloadNewVersion: (0, import_addon_actions.action)("downloadNewVersion"),
  startCallingLobby: (0, import_addon_actions.action)("startCallingLobby"),
  startConversation: (0, import_addon_actions.action)("startConversation"),
  returnToActiveCall: (0, import_addon_actions.action)("returnToActiveCall"),
  contactSupport: (0, import_addon_actions.action)("contactSupport"),
  closeContactSpoofingReview: (0, import_addon_actions.action)("closeContactSpoofingReview"),
  reviewGroupMemberNameCollision: (0, import_addon_actions.action)("reviewGroupMemberNameCollision"),
  reviewMessageRequestNameCollision: (0, import_addon_actions.action)("reviewMessageRequestNameCollision"),
  onBlock: (0, import_addon_actions.action)("onBlock"),
  onBlockAndReportSpam: (0, import_addon_actions.action)("onBlockAndReportSpam"),
  onDelete: (0, import_addon_actions.action)("onDelete"),
  onUnblock: (0, import_addon_actions.action)("onUnblock"),
  removeMember: (0, import_addon_actions.action)("removeMember"),
  unblurAvatar: (0, import_addon_actions.action)("unblurAvatar"),
  peekGroupCallForTheFirstTime: (0, import_addon_actions.action)("peekGroupCallForTheFirstTime"),
  peekGroupCallIfItHasMembers: (0, import_addon_actions.action)("peekGroupCallIfItHasMembers"),
  viewStory: (0, import_addon_actions.action)("viewStory")
}), "actions");
const renderItem = /* @__PURE__ */ __name(({
  messageId,
  containerElementRef,
  containerWidthBreakpoint
}) => /* @__PURE__ */ React.createElement(import_TimelineItem.TimelineItem, {
  getPreferredBadge: () => void 0,
  id: "",
  isSelected: false,
  renderEmojiPicker: () => /* @__PURE__ */ React.createElement("div", null),
  renderReactionPicker: () => /* @__PURE__ */ React.createElement("div", null),
  item: items[messageId],
  i18n,
  interactionMode: "keyboard",
  isNextItemCallingNotification: false,
  theme: import_Util.ThemeType.light,
  containerElementRef,
  containerWidthBreakpoint,
  conversationId: "",
  renderContact: () => "*ContactName*",
  renderUniversalTimerNotification: () => /* @__PURE__ */ React.createElement("div", null, "*UniversalTimerNotification*"),
  renderAudioAttachment: () => /* @__PURE__ */ React.createElement("div", null, "*AudioAttachment*"),
  shouldCollapseAbove: false,
  shouldCollapseBelow: false,
  shouldHideMetadata: false,
  shouldRenderDateHeader: false,
  ...actions()
}), "renderItem");
const renderContactSpoofingReviewDialog = /* @__PURE__ */ __name((props) => {
  if (props.type === import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle) {
    return /* @__PURE__ */ React.createElement(import_ContactSpoofingReviewDialog.ContactSpoofingReviewDialog, {
      ...props,
      group: {
        ...(0, import_getDefaultConversation.getDefaultConversation)(),
        areWeAdmin: true
      }
    });
  }
  return /* @__PURE__ */ React.createElement(import_ContactSpoofingReviewDialog.ContactSpoofingReviewDialog, {
    ...props
  });
}, "renderContactSpoofingReviewDialog");
const getAbout = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("about", "\u{1F44D} Free to chat"), "getAbout");
const getTitle = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("name", "Cayce Bollard"), "getTitle");
const getName = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("name", "Cayce Bollard"), "getName");
const getProfileName = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("profileName", "Cayce Bollard (profile)"), "getProfileName");
const getAvatarPath = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("avatarPath", "/fixtures/kitten-4-112-112.jpg"), "getAvatarPath");
const getPhoneNumber = /* @__PURE__ */ __name(() => (0, import_addon_knobs.text)("phoneNumber", "+1 (808) 555-1234"), "getPhoneNumber");
const renderHeroRow = /* @__PURE__ */ __name(() => {
  const Wrapper = /* @__PURE__ */ __name(() => {
    const theme = React.useContext(import_StorybookThemeContext.StorybookThemeContext);
    return /* @__PURE__ */ React.createElement(import_ConversationHero.ConversationHero, {
      about: getAbout(),
      acceptedMessageRequest: true,
      avatarPath: getAvatarPath(),
      badge: void 0,
      conversationType: "direct",
      id: (0, import_getDefaultConversation.getDefaultConversation)().id,
      i18n,
      isMe: false,
      name: getName(),
      phoneNumber: getPhoneNumber(),
      profileName: getProfileName(),
      sharedGroupNames: ["NYC Rock Climbers", "Dinner Party"],
      theme,
      title: getTitle(),
      unblurAvatar: (0, import_addon_actions.action)("unblurAvatar"),
      updateSharedGroups: noop,
      viewUserStories: (0, import_addon_actions.action)("viewUserStories")
    });
  }, "Wrapper");
  return /* @__PURE__ */ React.createElement(Wrapper, null);
}, "renderHeroRow");
const renderTypingBubble = /* @__PURE__ */ __name(() => /* @__PURE__ */ React.createElement(import_TypingBubble.TypingBubble, {
  acceptedMessageRequest: true,
  badge: void 0,
  color: (0, import_getRandomColor.getRandomColor)(),
  conversationType: "direct",
  phoneNumber: "+18005552222",
  i18n,
  isMe: false,
  title: "title",
  theme: import_Util.ThemeType.light,
  sharedGroupNames: []
}), "renderTypingBubble");
const useProps = /* @__PURE__ */ __name((overrideProps = {}) => ({
  discardMessages: (0, import_addon_actions.action)("discardMessages"),
  getPreferredBadge: () => void 0,
  i18n,
  theme: React.useContext(import_StorybookThemeContext.StorybookThemeContext),
  getTimestampForMessage: Date.now,
  haveNewest: (0, import_addon_knobs.boolean)("haveNewest", overrideProps.haveNewest !== false),
  haveOldest: (0, import_addon_knobs.boolean)("haveOldest", overrideProps.haveOldest !== false),
  isConversationSelected: true,
  isIncomingMessageRequest: (0, import_addon_knobs.boolean)("isIncomingMessageRequest", overrideProps.isIncomingMessageRequest === true),
  items: overrideProps.items || Object.keys(items),
  messageChangeCounter: 0,
  scrollToIndex: overrideProps.scrollToIndex,
  scrollToIndexCounter: 0,
  totalUnseen: (0, import_addon_knobs.number)("totalUnseen", overrideProps.totalUnseen || 0),
  oldestUnseenIndex: (0, import_addon_knobs.number)("oldestUnseenIndex", overrideProps.oldestUnseenIndex || 0) || void 0,
  invitedContactsForNewlyCreatedGroup: overrideProps.invitedContactsForNewlyCreatedGroup || [],
  warning: overrideProps.warning,
  id: (0, import_uuid.v4)(),
  renderItem,
  renderHeroRow,
  renderTypingBubble,
  renderContactSpoofingReviewDialog,
  isSomeoneTyping: overrideProps.isSomeoneTyping || false,
  ...actions()
}), "useProps");
const OldestAndNewest = /* @__PURE__ */ __name(() => {
  const props = useProps();
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "OldestAndNewest");
OldestAndNewest.story = {
  name: "Oldest and Newest"
};
const WithActiveMessageRequest = /* @__PURE__ */ __name(() => {
  const props = useProps({
    isIncomingMessageRequest: true
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithActiveMessageRequest");
WithActiveMessageRequest.story = {
  name: "With active message request"
};
const WithoutNewestMessage = /* @__PURE__ */ __name(() => {
  const props = useProps({
    haveNewest: false
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithoutNewestMessage");
const WithoutNewestMessageActiveMessageRequest = /* @__PURE__ */ __name(() => {
  const props = useProps({
    haveOldest: false,
    isIncomingMessageRequest: true
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithoutNewestMessageActiveMessageRequest");
WithoutNewestMessageActiveMessageRequest.story = {
  name: "Without newest message, active message request"
};
const WithoutOldestMessage = /* @__PURE__ */ __name(() => {
  const props = useProps({
    haveOldest: false,
    scrollToIndex: -1
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithoutOldestMessage");
const EmptyJustHero = /* @__PURE__ */ __name(() => {
  const props = useProps({
    items: []
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "EmptyJustHero");
EmptyJustHero.story = {
  name: "Empty (just hero)"
};
const LastSeen = /* @__PURE__ */ __name(() => {
  const props = useProps({
    oldestUnseenIndex: 13,
    totalUnseen: 2
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "LastSeen");
const TargetIndexToTop = /* @__PURE__ */ __name(() => {
  const props = useProps({
    scrollToIndex: 0
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "TargetIndexToTop");
TargetIndexToTop.story = {
  name: "Target Index to Top"
};
const TypingIndicator = /* @__PURE__ */ __name(() => {
  const props = useProps({ isSomeoneTyping: true });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "TypingIndicator");
const WithInvitedContactsForANewlyCreatedGroup = /* @__PURE__ */ __name(() => {
  const props = useProps({
    invitedContactsForNewlyCreatedGroup: [
      (0, import_getDefaultConversation.getDefaultConversation)({
        id: "abc123",
        title: "John Bon Bon Jovi"
      }),
      (0, import_getDefaultConversation.getDefaultConversation)({
        id: "def456",
        title: "Bon John Bon Jovi"
      })
    ]
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithInvitedContactsForANewlyCreatedGroup");
WithInvitedContactsForANewlyCreatedGroup.story = {
  name: "With invited contacts for a newly-created group"
};
const WithSameNameInDirectConversationWarning = /* @__PURE__ */ __name(() => {
  const props = useProps({
    warning: {
      type: import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle,
      safeConversation: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    items: []
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithSameNameInDirectConversationWarning");
WithSameNameInDirectConversationWarning.story = {
  name: 'With "same name in direct conversation" warning'
};
const WithSameNameInGroupConversationWarning = /* @__PURE__ */ __name(() => {
  const props = useProps({
    warning: {
      type: import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle,
      acknowledgedGroupNameCollisions: {},
      groupNameCollisions: {
        Alice: (0, import_lodash.times)(2, () => (0, import_uuid.v4)()),
        Bob: (0, import_lodash.times)(3, () => (0, import_uuid.v4)())
      }
    },
    items: []
  });
  return /* @__PURE__ */ React.createElement(import_Timeline.Timeline, {
    ...props
  });
}, "WithSameNameInGroupConversationWarning");
WithSameNameInGroupConversationWarning.story = {
  name: 'With "same name in group conversation" warning'
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmptyJustHero,
  LastSeen,
  OldestAndNewest,
  TargetIndexToTop,
  TypingIndicator,
  WithActiveMessageRequest,
  WithInvitedContactsForANewlyCreatedGroup,
  WithSameNameInDirectConversationWarning,
  WithSameNameInGroupConversationWarning,
  WithoutNewestMessage,
  WithoutNewestMessageActiveMessageRequest,
  WithoutOldestMessage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGltZWxpbmUuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IHRpbWVzIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHRleHQsIGJvb2xlYW4sIG51bWJlciB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24ta25vYnMnO1xuaW1wb3J0IHsgYWN0aW9uIH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1hY3Rpb25zJztcblxuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSB9IGZyb20gJy4vVGltZWxpbmUnO1xuaW1wb3J0IHsgVGltZWxpbmUgfSBmcm9tICcuL1RpbWVsaW5lJztcbmltcG9ydCB0eXBlIHsgVGltZWxpbmVJdGVtVHlwZSB9IGZyb20gJy4vVGltZWxpbmVJdGVtJztcbmltcG9ydCB7IFRpbWVsaW5lSXRlbSB9IGZyb20gJy4vVGltZWxpbmVJdGVtJztcbmltcG9ydCB7IENvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZyB9IGZyb20gJy4vQ29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nJztcbmltcG9ydCB7IFN0b3J5Ym9va1RoZW1lQ29udGV4dCB9IGZyb20gJy4uLy4uLy4uLy5zdG9yeWJvb2svU3Rvcnlib29rVGhlbWVDb250ZXh0JztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkhlcm8gfSBmcm9tICcuL0NvbnZlcnNhdGlvbkhlcm8nO1xuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgYXMgU21hcnRDb250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2dQcm9wc1R5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9zbWFydC9Db250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2cnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uLy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9nZXRSYW5kb21Db2xvcic7XG5pbXBvcnQgeyBUeXBpbmdCdWJibGUgfSBmcm9tICcuL1R5cGluZ0J1YmJsZSc7XG5pbXBvcnQgeyBDb250YWN0U3Bvb2ZpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbC9jb250YWN0U3Bvb2ZpbmcnO1xuaW1wb3J0IHsgUmVhZFN0YXR1cyB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL01lc3NhZ2VSZWFkU3RhdHVzJztcbmltcG9ydCB0eXBlIHsgV2lkdGhCcmVha3BvaW50IH0gZnJvbSAnLi4vX3V0aWwnO1xuaW1wb3J0IHsgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBUZXh0RGlyZWN0aW9uIH0gZnJvbSAnLi9NZXNzYWdlJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvQ29udmVyc2F0aW9uL1RpbWVsaW5lJyxcbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5jb25zdCBpdGVtczogUmVjb3JkPHN0cmluZywgVGltZWxpbmVJdGVtVHlwZT4gPSB7XG4gICdpZC0xJzoge1xuICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICBkYXRhOiB7XG4gICAgICBhdXRob3I6IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0yMDAxJyxcbiAgICAgIH0pLFxuICAgICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgY2FuRG93bmxvYWQ6IHRydWUsXG4gICAgICBjYW5SZWFjdDogdHJ1ZSxcbiAgICAgIGNhblJlcGx5OiB0cnVlLFxuICAgICAgY2FuUmV0cnk6IHRydWUsXG4gICAgICBjYW5SZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiB0cnVlLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3I6ICdmb3Jlc3QnLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgY29udmVyc2F0aW9uVGl0bGU6ICdDb252ZXJzYXRpb24gVGl0bGUnLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICAgIGRpcmVjdGlvbjogJ2luY29taW5nJyxcbiAgICAgIGlkOiAnaWQtMScsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgdGV4dDogJ1x1RDgzRFx1REQyNScsXG4gICAgICB0ZXh0RGlyZWN0aW9uOiBUZXh0RGlyZWN0aW9uLkRlZmF1bHQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC0yJzoge1xuICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICBkYXRhOiB7XG4gICAgICBhdXRob3I6IGdldERlZmF1bHRDb252ZXJzYXRpb24oe30pLFxuICAgICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgY2FuRG93bmxvYWQ6IHRydWUsXG4gICAgICBjYW5SZWFjdDogdHJ1ZSxcbiAgICAgIGNhblJlcGx5OiB0cnVlLFxuICAgICAgY2FuUmV0cnk6IHRydWUsXG4gICAgICBjYW5SZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiB0cnVlLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3I6ICdmb3Jlc3QnLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgY29udmVyc2F0aW9uVGl0bGU6ICdDb252ZXJzYXRpb24gVGl0bGUnLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICAgIGRpcmVjdGlvbjogJ2luY29taW5nJyxcbiAgICAgIGlkOiAnaWQtMicsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgdGV4dDogJ0hlbGxvIHRoZXJlIGZyb20gdGhlIG5ldyB3b3JsZCEgaHR0cDovL3NvbWV3aGVyZS5jb20nLFxuICAgICAgdGV4dERpcmVjdGlvbjogVGV4dERpcmVjdGlvbi5EZWZhdWx0LFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICB9LFxuICAnaWQtMi41Jzoge1xuICAgIHR5cGU6ICd1bnN1cHBvcnRlZE1lc3NhZ2UnLFxuICAgIGRhdGE6IHtcbiAgICAgIGNhblByb2Nlc3NOb3c6IGZhbHNlLFxuICAgICAgY29udGFjdDoge1xuICAgICAgICBpZDogJzA2MWQzNzgzLTU3MzYtNDE0NS1iMWEyLTZiNmNmMTE1NjM5MycsXG4gICAgICAgIGlzTWU6IGZhbHNlLFxuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0xMDAwJyxcbiAgICAgICAgcHJvZmlsZU5hbWU6ICdNci4gUGlnJyxcbiAgICAgICAgdGl0bGU6ICdNci4gUGlnJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC0zJzoge1xuICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICBkYXRhOiB7XG4gICAgICBhdXRob3I6IGdldERlZmF1bHRDb252ZXJzYXRpb24oe30pLFxuICAgICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgY2FuRG93bmxvYWQ6IHRydWUsXG4gICAgICBjYW5SZWFjdDogdHJ1ZSxcbiAgICAgIGNhblJlcGx5OiB0cnVlLFxuICAgICAgY2FuUmV0cnk6IHRydWUsXG4gICAgICBjYW5SZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiB0cnVlLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3I6ICdjcmltc29uJyxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiAnY29udmVyc2F0aW9uLWlkJyxcbiAgICAgIGNvbnZlcnNhdGlvblRpdGxlOiAnQ29udmVyc2F0aW9uIFRpdGxlJyxcbiAgICAgIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG4gICAgICBkaXJlY3Rpb246ICdpbmNvbWluZycsXG4gICAgICBpZDogJ2lkLTMnLFxuICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZDogdHJ1ZSxcbiAgICAgIHByZXZpZXdzOiBbXSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHRleHQ6ICdIZWxsbyB0aGVyZSBmcm9tIHRoZSBuZXcgd29ybGQhJyxcbiAgICAgIHRleHREaXJlY3Rpb246IFRleHREaXJlY3Rpb24uRGVmYXVsdCxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgfSxcbiAgJ2lkLTQnOiB7XG4gICAgdHlwZTogJ3RpbWVyTm90aWZpY2F0aW9uJyxcbiAgICBkYXRhOiB7XG4gICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICBleHBpcmVUaW1lcjogbW9tZW50LmR1cmF0aW9uKDIsICdob3VycycpLmFzU2Vjb25kcygpLFxuICAgICAgdGl0bGU6IFwiSXQncyBNZVwiLFxuICAgICAgdHlwZTogJ2Zyb21NZScsXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC01Jzoge1xuICAgIHR5cGU6ICd0aW1lck5vdGlmaWNhdGlvbicsXG4gICAgZGF0YToge1xuICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgZXhwaXJlVGltZXI6IG1vbWVudC5kdXJhdGlvbigyLCAnaG91cnMnKS5hc1NlY29uZHMoKSxcbiAgICAgIHRpdGxlOiAnKDIwMikgNTU1LTAwMDAnLFxuICAgICAgdHlwZTogJ2Zyb21PdGhlcicsXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC02Jzoge1xuICAgIHR5cGU6ICdzYWZldHlOdW1iZXJOb3RpZmljYXRpb24nLFxuICAgIGRhdGE6IHtcbiAgICAgIGNvbnRhY3Q6IHtcbiAgICAgICAgaWQ6ICcrMTIwMjU1NTAwMCcsXG4gICAgICAgIHRpdGxlOiAnTXIuIEZpcmUnLFxuICAgICAgfSxcbiAgICAgIGlzR3JvdXA6IHRydWUsXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC03Jzoge1xuICAgIHR5cGU6ICd2ZXJpZmljYXRpb25Ob3RpZmljYXRpb24nLFxuICAgIGRhdGE6IHtcbiAgICAgIGNvbnRhY3Q6IHsgdGl0bGU6ICdNcnMuIEljZScgfSxcbiAgICAgIGlzTG9jYWw6IHRydWUsXG4gICAgICB0eXBlOiAnbWFya1ZlcmlmaWVkJyxcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgfSxcbiAgJ2lkLTgnOiB7XG4gICAgdHlwZTogJ2dyb3VwTm90aWZpY2F0aW9uJyxcbiAgICBkYXRhOiB7XG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnbmFtZScsXG4gICAgICAgICAgbmV3TmFtZTogJ1NxdWlycmVscyBhbmQgdGhlaXIgdXNlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYWRkJyxcbiAgICAgICAgICBjb250YWN0czogW1xuICAgICAgICAgICAgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDInLFxuICAgICAgICAgICAgICB0aXRsZTogJ01yLiBGaXJlJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDMnLFxuICAgICAgICAgICAgICB0aXRsZTogJ01zLiBXYXRlcicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGZyb206IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0wMDAxJyxcbiAgICAgICAgdGl0bGU6ICdNcnMuIEljZScsXG4gICAgICAgIGlzTWU6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC05Jzoge1xuICAgIHR5cGU6ICdyZXNldFNlc3Npb25Ob3RpZmljYXRpb24nLFxuICAgIGRhdGE6IG51bGwsXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICB9LFxuICAnaWQtMTAnOiB7XG4gICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhvcjogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7fSksXG4gICAgICBjYW5EZWxldGVGb3JFdmVyeW9uZTogZmFsc2UsXG4gICAgICBjYW5Eb3dubG9hZDogdHJ1ZSxcbiAgICAgIGNhblJlYWN0OiB0cnVlLFxuICAgICAgY2FuUmVwbHk6IHRydWUsXG4gICAgICBjYW5SZXRyeTogdHJ1ZSxcbiAgICAgIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogJ3BsdW0nLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgY29udmVyc2F0aW9uVGl0bGU6ICdDb252ZXJzYXRpb24gVGl0bGUnLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIGlkOiAnaWQtNicsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc3RhdHVzOiAnc2VudCcsXG4gICAgICB0ZXh0OiAnXHVEODNEXHVERDI1JyxcbiAgICAgIHRleHREaXJlY3Rpb246IFRleHREaXJlY3Rpb24uRGVmYXVsdCxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgfSxcbiAgJ2lkLTExJzoge1xuICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICBkYXRhOiB7XG4gICAgICBhdXRob3I6IGdldERlZmF1bHRDb252ZXJzYXRpb24oe30pLFxuICAgICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgY2FuRG93bmxvYWQ6IHRydWUsXG4gICAgICBjYW5SZWFjdDogdHJ1ZSxcbiAgICAgIGNhblJlcGx5OiB0cnVlLFxuICAgICAgY2FuUmV0cnk6IHRydWUsXG4gICAgICBjYW5SZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiB0cnVlLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3I6ICdjcmltc29uJyxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiAnY29udmVyc2F0aW9uLWlkJyxcbiAgICAgIGNvbnZlcnNhdGlvblRpdGxlOiAnQ29udmVyc2F0aW9uIFRpdGxlJyxcbiAgICAgIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG4gICAgICBkaXJlY3Rpb246ICdvdXRnb2luZycsXG4gICAgICBpZDogJ2lkLTcnLFxuICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZDogdHJ1ZSxcbiAgICAgIHByZXZpZXdzOiBbXSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHN0YXR1czogJ3JlYWQnLFxuICAgICAgdGV4dDogJ0hlbGxvIHRoZXJlIGZyb20gdGhlIG5ldyB3b3JsZCEgaHR0cDovL3NvbWV3aGVyZS5jb20nLFxuICAgICAgdGV4dERpcmVjdGlvbjogVGV4dERpcmVjdGlvbi5EZWZhdWx0LFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICB9LFxuICAnaWQtMTInOiB7XG4gICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhvcjogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7fSksXG4gICAgICBjYW5EZWxldGVGb3JFdmVyeW9uZTogZmFsc2UsXG4gICAgICBjYW5Eb3dubG9hZDogdHJ1ZSxcbiAgICAgIGNhblJlYWN0OiB0cnVlLFxuICAgICAgY2FuUmVwbHk6IHRydWUsXG4gICAgICBjYW5SZXRyeTogdHJ1ZSxcbiAgICAgIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogJ2NyaW1zb24nLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgY29udmVyc2F0aW9uVGl0bGU6ICdDb252ZXJzYXRpb24gVGl0bGUnLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIGlkOiAnaWQtOCcsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc3RhdHVzOiAnc2VudCcsXG4gICAgICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSB0aGUgbmV3IHdvcmxkISBcdUQ4M0RcdUREMjUnLFxuICAgICAgdGV4dERpcmVjdGlvbjogVGV4dERpcmVjdGlvbi5EZWZhdWx0LFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICB9LFxuICAnaWQtMTMnOiB7XG4gICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhvcjogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7fSksXG4gICAgICBjYW5EZWxldGVGb3JFdmVyeW9uZTogZmFsc2UsXG4gICAgICBjYW5Eb3dubG9hZDogdHJ1ZSxcbiAgICAgIGNhblJlYWN0OiB0cnVlLFxuICAgICAgY2FuUmVwbHk6IHRydWUsXG4gICAgICBjYW5SZXRyeTogdHJ1ZSxcbiAgICAgIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogJ2NyaW1zb24nLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgY29udmVyc2F0aW9uVGl0bGU6ICdDb252ZXJzYXRpb24gVGl0bGUnLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIGlkOiAnaWQtOScsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc3RhdHVzOiAnc2VudCcsXG4gICAgICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSB0aGUgbmV3IHdvcmxkISBBbmQgdGhpcyBpcyBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0LiBMaW5lcyBhbmQgbGluZXMgYW5kIGxpbmVzLicsXG4gICAgICB0ZXh0RGlyZWN0aW9uOiBUZXh0RGlyZWN0aW9uLkRlZmF1bHQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG4gICdpZC0xNCc6IHtcbiAgICB0eXBlOiAnbWVzc2FnZScsXG4gICAgZGF0YToge1xuICAgICAgYXV0aG9yOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHt9KSxcbiAgICAgIGNhbkRlbGV0ZUZvckV2ZXJ5b25lOiBmYWxzZSxcbiAgICAgIGNhbkRvd25sb2FkOiB0cnVlLFxuICAgICAgY2FuUmVhY3Q6IHRydWUsXG4gICAgICBjYW5SZXBseTogdHJ1ZSxcbiAgICAgIGNhblJldHJ5OiB0cnVlLFxuICAgICAgY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yOiAnY3JpbXNvbicsXG4gICAgICBjb252ZXJzYXRpb25JZDogJ2NvbnZlcnNhdGlvbi1pZCcsXG4gICAgICBjb252ZXJzYXRpb25UaXRsZTogJ0NvbnZlcnNhdGlvbiBUaXRsZScsXG4gICAgICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICAgICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICAgICAgaWQ6ICdpZC0xMCcsXG4gICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiB0cnVlLFxuICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc3RhdHVzOiAncmVhZCcsXG4gICAgICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSB0aGUgbmV3IHdvcmxkISBBbmQgdGhpcyBpcyBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0LiBMaW5lcyBhbmQgbGluZXMgYW5kIGxpbmVzLicsXG4gICAgICB0ZXh0RGlyZWN0aW9uOiBUZXh0RGlyZWN0aW9uLkRlZmF1bHQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgfSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0sXG59O1xuXG5jb25zdCBhY3Rpb25zID0gKCkgPT4gKHtcbiAgYWNrbm93bGVkZ2VHcm91cE1lbWJlck5hbWVDb2xsaXNpb25zOiBhY3Rpb24oXG4gICAgJ2Fja25vd2xlZGdlR3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9ucydcbiAgKSxcbiAgYmxvY2tHcm91cExpbmtSZXF1ZXN0czogYWN0aW9uKCdibG9ja0dyb3VwTGlua1JlcXVlc3RzJyksXG4gIGNoZWNrRm9yQWNjb3VudDogYWN0aW9uKCdjaGVja0ZvckFjY291bnQnKSxcbiAgY2xlYXJJbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cDogYWN0aW9uKFxuICAgICdjbGVhckludml0ZWRVdWlkc0Zvck5ld2x5Q3JlYXRlZEdyb3VwJ1xuICApLFxuICBzZXRJc05lYXJCb3R0b206IGFjdGlvbignc2V0SXNOZWFyQm90dG9tJyksXG4gIGxlYXJuTW9yZUFib3V0RGVsaXZlcnlJc3N1ZTogYWN0aW9uKCdsZWFybk1vcmVBYm91dERlbGl2ZXJ5SXNzdWUnKSxcbiAgbG9hZE9sZGVyTWVzc2FnZXM6IGFjdGlvbignbG9hZE9sZGVyTWVzc2FnZXMnKSxcbiAgbG9hZE5ld2VyTWVzc2FnZXM6IGFjdGlvbignbG9hZE5ld2VyTWVzc2FnZXMnKSxcbiAgbG9hZE5ld2VzdE1lc3NhZ2VzOiBhY3Rpb24oJ2xvYWROZXdlc3RNZXNzYWdlcycpLFxuICBtYXJrTWVzc2FnZVJlYWQ6IGFjdGlvbignbWFya01lc3NhZ2VSZWFkJyksXG4gIHNlbGVjdE1lc3NhZ2U6IGFjdGlvbignc2VsZWN0TWVzc2FnZScpLFxuICBjbGVhclNlbGVjdGVkTWVzc2FnZTogYWN0aW9uKCdjbGVhclNlbGVjdGVkTWVzc2FnZScpLFxuICB1cGRhdGVTaGFyZWRHcm91cHM6IGFjdGlvbigndXBkYXRlU2hhcmVkR3JvdXBzJyksXG5cbiAgcmVhY3RUb01lc3NhZ2U6IGFjdGlvbigncmVhY3RUb01lc3NhZ2UnKSxcbiAgcmVwbHlUb01lc3NhZ2U6IGFjdGlvbigncmVwbHlUb01lc3NhZ2UnKSxcbiAgcmV0cnlEZWxldGVGb3JFdmVyeW9uZTogYWN0aW9uKCdyZXRyeURlbGV0ZUZvckV2ZXJ5b25lJyksXG4gIHJldHJ5U2VuZDogYWN0aW9uKCdyZXRyeVNlbmQnKSxcbiAgZGVsZXRlTWVzc2FnZTogYWN0aW9uKCdkZWxldGVNZXNzYWdlJyksXG4gIGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZTogYWN0aW9uKCdkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUnKSxcbiAgc2hvd01lc3NhZ2VEZXRhaWw6IGFjdGlvbignc2hvd01lc3NhZ2VEZXRhaWwnKSxcbiAgb3BlbkNvbnZlcnNhdGlvbjogYWN0aW9uKCdvcGVuQ29udmVyc2F0aW9uJyksXG4gIHNob3dDb250YWN0RGV0YWlsOiBhY3Rpb24oJ3Nob3dDb250YWN0RGV0YWlsJyksXG4gIHNob3dDb250YWN0TW9kYWw6IGFjdGlvbignc2hvd0NvbnRhY3RNb2RhbCcpLFxuICBraWNrT2ZmQXR0YWNobWVudERvd25sb2FkOiBhY3Rpb24oJ2tpY2tPZmZBdHRhY2htZW50RG93bmxvYWQnKSxcbiAgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogYWN0aW9uKCdtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkJyksXG4gIG1hcmtWaWV3ZWQ6IGFjdGlvbignbWFya1ZpZXdlZCcpLFxuICBtZXNzYWdlRXhwYW5kZWQ6IGFjdGlvbignbWVzc2FnZUV4cGFuZGVkJyksXG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiBhY3Rpb24oJ3Nob3dWaXN1YWxBdHRhY2htZW50JyksXG4gIGRvd25sb2FkQXR0YWNobWVudDogYWN0aW9uKCdkb3dubG9hZEF0dGFjaG1lbnQnKSxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IGFjdGlvbignZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnKSxcbiAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2U6IGFjdGlvbignZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UnKSxcblxuICBvcGVuTGluazogYWN0aW9uKCdvcGVuTGluaycpLFxuICBvcGVuR2lmdEJhZGdlOiBhY3Rpb24oJ29wZW5HaWZ0QmFkZ2UnKSxcbiAgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlOiBhY3Rpb24oJ3Njcm9sbFRvUXVvdGVkTWVzc2FnZScpLFxuICBzaG93RXhwaXJlZEluY29taW5nVGFwVG9WaWV3VG9hc3Q6IGFjdGlvbihcbiAgICAnc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0J1xuICApLFxuICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3Q6IGFjdGlvbihcbiAgICAnc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0J1xuICApLFxuICBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbDogYWN0aW9uKCdzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbCcpLFxuXG4gIHNob3dJZGVudGl0eTogYWN0aW9uKCdzaG93SWRlbnRpdHknKSxcblxuICBkb3dubG9hZE5ld1ZlcnNpb246IGFjdGlvbignZG93bmxvYWROZXdWZXJzaW9uJyksXG5cbiAgc3RhcnRDYWxsaW5nTG9iYnk6IGFjdGlvbignc3RhcnRDYWxsaW5nTG9iYnknKSxcbiAgc3RhcnRDb252ZXJzYXRpb246IGFjdGlvbignc3RhcnRDb252ZXJzYXRpb24nKSxcbiAgcmV0dXJuVG9BY3RpdmVDYWxsOiBhY3Rpb24oJ3JldHVyblRvQWN0aXZlQ2FsbCcpLFxuXG4gIGNvbnRhY3RTdXBwb3J0OiBhY3Rpb24oJ2NvbnRhY3RTdXBwb3J0JyksXG5cbiAgY2xvc2VDb250YWN0U3Bvb2ZpbmdSZXZpZXc6IGFjdGlvbignY2xvc2VDb250YWN0U3Bvb2ZpbmdSZXZpZXcnKSxcbiAgcmV2aWV3R3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uOiBhY3Rpb24oJ3Jldmlld0dyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbicpLFxuICByZXZpZXdNZXNzYWdlUmVxdWVzdE5hbWVDb2xsaXNpb246IGFjdGlvbihcbiAgICAncmV2aWV3TWVzc2FnZVJlcXVlc3ROYW1lQ29sbGlzaW9uJ1xuICApLFxuXG4gIG9uQmxvY2s6IGFjdGlvbignb25CbG9jaycpLFxuICBvbkJsb2NrQW5kUmVwb3J0U3BhbTogYWN0aW9uKCdvbkJsb2NrQW5kUmVwb3J0U3BhbScpLFxuICBvbkRlbGV0ZTogYWN0aW9uKCdvbkRlbGV0ZScpLFxuICBvblVuYmxvY2s6IGFjdGlvbignb25VbmJsb2NrJyksXG4gIHJlbW92ZU1lbWJlcjogYWN0aW9uKCdyZW1vdmVNZW1iZXInKSxcblxuICB1bmJsdXJBdmF0YXI6IGFjdGlvbigndW5ibHVyQXZhdGFyJyksXG5cbiAgcGVla0dyb3VwQ2FsbEZvclRoZUZpcnN0VGltZTogYWN0aW9uKCdwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lJyksXG4gIHBlZWtHcm91cENhbGxJZkl0SGFzTWVtYmVyczogYWN0aW9uKCdwZWVrR3JvdXBDYWxsSWZJdEhhc01lbWJlcnMnKSxcblxuICB2aWV3U3Rvcnk6IGFjdGlvbigndmlld1N0b3J5JyksXG59KTtcblxuY29uc3QgcmVuZGVySXRlbSA9ICh7XG4gIG1lc3NhZ2VJZCxcbiAgY29udGFpbmVyRWxlbWVudFJlZixcbiAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50LFxufToge1xuICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgY29udGFpbmVyRWxlbWVudFJlZjogUmVhY3QuUmVmT2JqZWN0PEhUTUxFbGVtZW50PjtcbiAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50OiBXaWR0aEJyZWFrcG9pbnQ7XG59KSA9PiAoXG4gIDxUaW1lbGluZUl0ZW1cbiAgICBnZXRQcmVmZXJyZWRCYWRnZT17KCkgPT4gdW5kZWZpbmVkfVxuICAgIGlkPVwiXCJcbiAgICBpc1NlbGVjdGVkPXtmYWxzZX1cbiAgICByZW5kZXJFbW9qaVBpY2tlcj17KCkgPT4gPGRpdiAvPn1cbiAgICByZW5kZXJSZWFjdGlvblBpY2tlcj17KCkgPT4gPGRpdiAvPn1cbiAgICBpdGVtPXtpdGVtc1ttZXNzYWdlSWRdfVxuICAgIGkxOG49e2kxOG59XG4gICAgaW50ZXJhY3Rpb25Nb2RlPVwia2V5Ym9hcmRcIlxuICAgIGlzTmV4dEl0ZW1DYWxsaW5nTm90aWZpY2F0aW9uPXtmYWxzZX1cbiAgICB0aGVtZT17VGhlbWVUeXBlLmxpZ2h0fVxuICAgIGNvbnRhaW5lckVsZW1lbnRSZWY9e2NvbnRhaW5lckVsZW1lbnRSZWZ9XG4gICAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50PXtjb250YWluZXJXaWR0aEJyZWFrcG9pbnR9XG4gICAgY29udmVyc2F0aW9uSWQ9XCJcIlxuICAgIHJlbmRlckNvbnRhY3Q9eygpID0+ICcqQ29udGFjdE5hbWUqJ31cbiAgICByZW5kZXJVbml2ZXJzYWxUaW1lck5vdGlmaWNhdGlvbj17KCkgPT4gKFxuICAgICAgPGRpdj4qVW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24qPC9kaXY+XG4gICAgKX1cbiAgICByZW5kZXJBdWRpb0F0dGFjaG1lbnQ9eygpID0+IDxkaXY+KkF1ZGlvQXR0YWNobWVudCo8L2Rpdj59XG4gICAgc2hvdWxkQ29sbGFwc2VBYm92ZT17ZmFsc2V9XG4gICAgc2hvdWxkQ29sbGFwc2VCZWxvdz17ZmFsc2V9XG4gICAgc2hvdWxkSGlkZU1ldGFkYXRhPXtmYWxzZX1cbiAgICBzaG91bGRSZW5kZXJEYXRlSGVhZGVyPXtmYWxzZX1cbiAgICB7Li4uYWN0aW9ucygpfVxuICAvPlxuKTtcblxuY29uc3QgcmVuZGVyQ29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nID0gKFxuICBwcm9wczogU21hcnRDb250YWN0U3Bvb2ZpbmdSZXZpZXdEaWFsb2dQcm9wc1R5cGVcbikgPT4ge1xuICBpZiAocHJvcHMudHlwZSA9PT0gQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZ1xuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgIGdyb3VwPXt7XG4gICAgICAgICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgICAgIGFyZVdlQWRtaW46IHRydWUsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gPENvbnRhY3RTcG9vZmluZ1Jldmlld0RpYWxvZyB7Li4ucHJvcHN9IC8+O1xufTtcblxuY29uc3QgZ2V0QWJvdXQgPSAoKSA9PiB0ZXh0KCdhYm91dCcsICdcdUQ4M0RcdURDNEQgRnJlZSB0byBjaGF0Jyk7XG5jb25zdCBnZXRUaXRsZSA9ICgpID0+IHRleHQoJ25hbWUnLCAnQ2F5Y2UgQm9sbGFyZCcpO1xuY29uc3QgZ2V0TmFtZSA9ICgpID0+IHRleHQoJ25hbWUnLCAnQ2F5Y2UgQm9sbGFyZCcpO1xuY29uc3QgZ2V0UHJvZmlsZU5hbWUgPSAoKSA9PiB0ZXh0KCdwcm9maWxlTmFtZScsICdDYXljZSBCb2xsYXJkIChwcm9maWxlKScpO1xuY29uc3QgZ2V0QXZhdGFyUGF0aCA9ICgpID0+XG4gIHRleHQoJ2F2YXRhclBhdGgnLCAnL2ZpeHR1cmVzL2tpdHRlbi00LTExMi0xMTIuanBnJyk7XG5jb25zdCBnZXRQaG9uZU51bWJlciA9ICgpID0+IHRleHQoJ3Bob25lTnVtYmVyJywgJysxICg4MDgpIDU1NS0xMjM0Jyk7XG5cbmNvbnN0IHJlbmRlckhlcm9Sb3cgPSAoKSA9PiB7XG4gIGNvbnN0IFdyYXBwZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgdGhlbWUgPSBSZWFjdC51c2VDb250ZXh0KFN0b3J5Ym9va1RoZW1lQ29udGV4dCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb252ZXJzYXRpb25IZXJvXG4gICAgICAgIGFib3V0PXtnZXRBYm91dCgpfVxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0XG4gICAgICAgIGF2YXRhclBhdGg9e2dldEF2YXRhclBhdGgoKX1cbiAgICAgICAgYmFkZ2U9e3VuZGVmaW5lZH1cbiAgICAgICAgY29udmVyc2F0aW9uVHlwZT1cImRpcmVjdFwiXG4gICAgICAgIGlkPXtnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkuaWR9XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGlzTWU9e2ZhbHNlfVxuICAgICAgICBuYW1lPXtnZXROYW1lKCl9XG4gICAgICAgIHBob25lTnVtYmVyPXtnZXRQaG9uZU51bWJlcigpfVxuICAgICAgICBwcm9maWxlTmFtZT17Z2V0UHJvZmlsZU5hbWUoKX1cbiAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17WydOWUMgUm9jayBDbGltYmVycycsICdEaW5uZXIgUGFydHknXX1cbiAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICB0aXRsZT17Z2V0VGl0bGUoKX1cbiAgICAgICAgdW5ibHVyQXZhdGFyPXthY3Rpb24oJ3VuYmx1ckF2YXRhcicpfVxuICAgICAgICB1cGRhdGVTaGFyZWRHcm91cHM9e25vb3B9XG4gICAgICAgIHZpZXdVc2VyU3Rvcmllcz17YWN0aW9uKCd2aWV3VXNlclN0b3JpZXMnKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIDxXcmFwcGVyIC8+O1xufTtcbmNvbnN0IHJlbmRlclR5cGluZ0J1YmJsZSA9ICgpID0+IChcbiAgPFR5cGluZ0J1YmJsZVxuICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3RcbiAgICBiYWRnZT17dW5kZWZpbmVkfVxuICAgIGNvbG9yPXtnZXRSYW5kb21Db2xvcigpfVxuICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgIHBob25lTnVtYmVyPVwiKzE4MDA1NTUyMjIyXCJcbiAgICBpMThuPXtpMThufVxuICAgIGlzTWU9e2ZhbHNlfVxuICAgIHRpdGxlPVwidGl0bGVcIlxuICAgIHRoZW1lPXtUaGVtZVR5cGUubGlnaHR9XG4gICAgc2hhcmVkR3JvdXBOYW1lcz17W119XG4gIC8+XG4pO1xuXG5jb25zdCB1c2VQcm9wcyA9IChvdmVycmlkZVByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7fSk6IFByb3BzVHlwZSA9PiAoe1xuICBkaXNjYXJkTWVzc2FnZXM6IGFjdGlvbignZGlzY2FyZE1lc3NhZ2VzJyksXG4gIGdldFByZWZlcnJlZEJhZGdlOiAoKSA9PiB1bmRlZmluZWQsXG4gIGkxOG4sXG4gIHRoZW1lOiBSZWFjdC51c2VDb250ZXh0KFN0b3J5Ym9va1RoZW1lQ29udGV4dCksXG5cbiAgZ2V0VGltZXN0YW1wRm9yTWVzc2FnZTogRGF0ZS5ub3csXG4gIGhhdmVOZXdlc3Q6IGJvb2xlYW4oJ2hhdmVOZXdlc3QnLCBvdmVycmlkZVByb3BzLmhhdmVOZXdlc3QgIT09IGZhbHNlKSxcbiAgaGF2ZU9sZGVzdDogYm9vbGVhbignaGF2ZU9sZGVzdCcsIG92ZXJyaWRlUHJvcHMuaGF2ZU9sZGVzdCAhPT0gZmFsc2UpLFxuICBpc0NvbnZlcnNhdGlvblNlbGVjdGVkOiB0cnVlLFxuICBpc0luY29taW5nTWVzc2FnZVJlcXVlc3Q6IGJvb2xlYW4oXG4gICAgJ2lzSW5jb21pbmdNZXNzYWdlUmVxdWVzdCcsXG4gICAgb3ZlcnJpZGVQcm9wcy5pc0luY29taW5nTWVzc2FnZVJlcXVlc3QgPT09IHRydWVcbiAgKSxcbiAgaXRlbXM6IG92ZXJyaWRlUHJvcHMuaXRlbXMgfHwgT2JqZWN0LmtleXMoaXRlbXMpLFxuICBtZXNzYWdlQ2hhbmdlQ291bnRlcjogMCxcbiAgc2Nyb2xsVG9JbmRleDogb3ZlcnJpZGVQcm9wcy5zY3JvbGxUb0luZGV4LFxuICBzY3JvbGxUb0luZGV4Q291bnRlcjogMCxcbiAgdG90YWxVbnNlZW46IG51bWJlcigndG90YWxVbnNlZW4nLCBvdmVycmlkZVByb3BzLnRvdGFsVW5zZWVuIHx8IDApLFxuICBvbGRlc3RVbnNlZW5JbmRleDpcbiAgICBudW1iZXIoJ29sZGVzdFVuc2VlbkluZGV4Jywgb3ZlcnJpZGVQcm9wcy5vbGRlc3RVbnNlZW5JbmRleCB8fCAwKSB8fFxuICAgIHVuZGVmaW5lZCxcbiAgaW52aXRlZENvbnRhY3RzRm9yTmV3bHlDcmVhdGVkR3JvdXA6XG4gICAgb3ZlcnJpZGVQcm9wcy5pbnZpdGVkQ29udGFjdHNGb3JOZXdseUNyZWF0ZWRHcm91cCB8fCBbXSxcbiAgd2FybmluZzogb3ZlcnJpZGVQcm9wcy53YXJuaW5nLFxuXG4gIGlkOiB1dWlkKCksXG4gIHJlbmRlckl0ZW0sXG4gIHJlbmRlckhlcm9Sb3csXG4gIHJlbmRlclR5cGluZ0J1YmJsZSxcbiAgcmVuZGVyQ29udGFjdFNwb29maW5nUmV2aWV3RGlhbG9nLFxuICBpc1NvbWVvbmVUeXBpbmc6IG92ZXJyaWRlUHJvcHMuaXNTb21lb25lVHlwaW5nIHx8IGZhbHNlLFxuXG4gIC4uLmFjdGlvbnMoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgT2xkZXN0QW5kTmV3ZXN0ID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHMgPSB1c2VQcm9wcygpO1xuXG4gIHJldHVybiA8VGltZWxpbmUgey4uLnByb3BzfSAvPjtcbn07XG5cbk9sZGVzdEFuZE5ld2VzdC5zdG9yeSA9IHtcbiAgbmFtZTogJ09sZGVzdCBhbmQgTmV3ZXN0Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBXaXRoQWN0aXZlTWVzc2FnZVJlcXVlc3QgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IHVzZVByb3BzKHtcbiAgICBpc0luY29taW5nTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gIH0pO1xuXG4gIHJldHVybiA8VGltZWxpbmUgey4uLnByb3BzfSAvPjtcbn07XG5cbldpdGhBY3RpdmVNZXNzYWdlUmVxdWVzdC5zdG9yeSA9IHtcbiAgbmFtZTogJ1dpdGggYWN0aXZlIG1lc3NhZ2UgcmVxdWVzdCcsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aG91dE5ld2VzdE1lc3NhZ2UgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IHVzZVByb3BzKHtcbiAgICBoYXZlTmV3ZXN0OiBmYWxzZSxcbiAgfSk7XG5cbiAgcmV0dXJuIDxUaW1lbGluZSB7Li4ucHJvcHN9IC8+O1xufTtcblxuZXhwb3J0IGNvbnN0IFdpdGhvdXROZXdlc3RNZXNzYWdlQWN0aXZlTWVzc2FnZVJlcXVlc3QgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IHVzZVByb3BzKHtcbiAgICBoYXZlT2xkZXN0OiBmYWxzZSxcbiAgICBpc0luY29taW5nTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gIH0pO1xuXG4gIHJldHVybiA8VGltZWxpbmUgey4uLnByb3BzfSAvPjtcbn07XG5cbldpdGhvdXROZXdlc3RNZXNzYWdlQWN0aXZlTWVzc2FnZVJlcXVlc3Quc3RvcnkgPSB7XG4gIG5hbWU6ICdXaXRob3V0IG5ld2VzdCBtZXNzYWdlLCBhY3RpdmUgbWVzc2FnZSByZXF1ZXN0Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBXaXRob3V0T2xkZXN0TWVzc2FnZSA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gdXNlUHJvcHMoe1xuICAgIGhhdmVPbGRlc3Q6IGZhbHNlLFxuICAgIHNjcm9sbFRvSW5kZXg6IC0xLFxuICB9KTtcblxuICByZXR1cm4gPFRpbWVsaW5lIHsuLi5wcm9wc30gLz47XG59O1xuXG5leHBvcnQgY29uc3QgRW1wdHlKdXN0SGVybyA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gdXNlUHJvcHMoe1xuICAgIGl0ZW1zOiBbXSxcbiAgfSk7XG5cbiAgcmV0dXJuIDxUaW1lbGluZSB7Li4ucHJvcHN9IC8+O1xufTtcblxuRW1wdHlKdXN0SGVyby5zdG9yeSA9IHtcbiAgbmFtZTogJ0VtcHR5IChqdXN0IGhlcm8pJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMYXN0U2VlbiA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gdXNlUHJvcHMoe1xuICAgIG9sZGVzdFVuc2VlbkluZGV4OiAxMyxcbiAgICB0b3RhbFVuc2VlbjogMixcbiAgfSk7XG5cbiAgcmV0dXJuIDxUaW1lbGluZSB7Li4ucHJvcHN9IC8+O1xufTtcblxuZXhwb3J0IGNvbnN0IFRhcmdldEluZGV4VG9Ub3AgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IHVzZVByb3BzKHtcbiAgICBzY3JvbGxUb0luZGV4OiAwLFxuICB9KTtcblxuICByZXR1cm4gPFRpbWVsaW5lIHsuLi5wcm9wc30gLz47XG59O1xuXG5UYXJnZXRJbmRleFRvVG9wLnN0b3J5ID0ge1xuICBuYW1lOiAnVGFyZ2V0IEluZGV4IHRvIFRvcCcsXG59O1xuXG5leHBvcnQgY29uc3QgVHlwaW5nSW5kaWNhdG9yID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHMgPSB1c2VQcm9wcyh7IGlzU29tZW9uZVR5cGluZzogdHJ1ZSB9KTtcblxuICByZXR1cm4gPFRpbWVsaW5lIHsuLi5wcm9wc30gLz47XG59O1xuXG5leHBvcnQgY29uc3QgV2l0aEludml0ZWRDb250YWN0c0ZvckFOZXdseUNyZWF0ZWRHcm91cCA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gdXNlUHJvcHMoe1xuICAgIGludml0ZWRDb250YWN0c0Zvck5ld2x5Q3JlYXRlZEdyb3VwOiBbXG4gICAgICBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgaWQ6ICdhYmMxMjMnLFxuICAgICAgICB0aXRsZTogJ0pvaG4gQm9uIEJvbiBKb3ZpJyxcbiAgICAgIH0pLFxuICAgICAgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnZGVmNDU2JyxcbiAgICAgICAgdGl0bGU6ICdCb24gSm9obiBCb24gSm92aScsXG4gICAgICB9KSxcbiAgICBdLFxuICB9KTtcblxuICByZXR1cm4gPFRpbWVsaW5lIHsuLi5wcm9wc30gLz47XG59O1xuXG5XaXRoSW52aXRlZENvbnRhY3RzRm9yQU5ld2x5Q3JlYXRlZEdyb3VwLnN0b3J5ID0ge1xuICBuYW1lOiAnV2l0aCBpbnZpdGVkIGNvbnRhY3RzIGZvciBhIG5ld2x5LWNyZWF0ZWQgZ3JvdXAnLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpdGhTYW1lTmFtZUluRGlyZWN0Q29udmVyc2F0aW9uV2FybmluZyA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gdXNlUHJvcHMoe1xuICAgIHdhcm5pbmc6IHtcbiAgICAgIHR5cGU6IENvbnRhY3RTcG9vZmluZ1R5cGUuRGlyZWN0Q29udmVyc2F0aW9uV2l0aFNhbWVUaXRsZSxcbiAgICAgIHNhZmVDb252ZXJzYXRpb246IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICB9LFxuICAgIGl0ZW1zOiBbXSxcbiAgfSk7XG5cbiAgcmV0dXJuIDxUaW1lbGluZSB7Li4ucHJvcHN9IC8+O1xufTtcblxuV2l0aFNhbWVOYW1lSW5EaXJlY3RDb252ZXJzYXRpb25XYXJuaW5nLnN0b3J5ID0ge1xuICBuYW1lOiAnV2l0aCBcInNhbWUgbmFtZSBpbiBkaXJlY3QgY29udmVyc2F0aW9uXCIgd2FybmluZycsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aFNhbWVOYW1lSW5Hcm91cENvbnZlcnNhdGlvbldhcm5pbmcgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IHVzZVByb3BzKHtcbiAgICB3YXJuaW5nOiB7XG4gICAgICB0eXBlOiBDb250YWN0U3Bvb2ZpbmdUeXBlLk11bHRpcGxlR3JvdXBNZW1iZXJzV2l0aFNhbWVUaXRsZSxcbiAgICAgIGFja25vd2xlZGdlZEdyb3VwTmFtZUNvbGxpc2lvbnM6IHt9LFxuICAgICAgZ3JvdXBOYW1lQ29sbGlzaW9uczoge1xuICAgICAgICBBbGljZTogdGltZXMoMiwgKCkgPT4gdXVpZCgpKSxcbiAgICAgICAgQm9iOiB0aW1lcygzLCAoKSA9PiB1dWlkKCkpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGl0ZW1zOiBbXSxcbiAgfSk7XG5cbiAgcmV0dXJuIDxUaW1lbGluZSB7Li4ucHJvcHN9IC8+O1xufTtcblxuV2l0aFNhbWVOYW1lSW5Hcm91cENvbnZlcnNhdGlvbldhcm5pbmcuc3RvcnkgPSB7XG4gIG5hbWU6ICdXaXRoIFwic2FtZSBuYW1lIGluIGdyb3VwIGNvbnZlcnNhdGlvblwiIHdhcm5pbmcnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxZQUF1QjtBQUN2QixhQUF3QjtBQUN4QixvQkFBc0I7QUFDdEIsa0JBQTJCO0FBQzNCLHlCQUFzQztBQUN0QywyQkFBdUI7QUFFdkIsdUJBQTBCO0FBQzFCLHNCQUF1QjtBQUV2QixzQkFBeUI7QUFFekIsMEJBQTZCO0FBQzdCLHlDQUE0QztBQUM1QyxtQ0FBc0M7QUFDdEMsOEJBQWlDO0FBRWpDLG9DQUF1QztBQUN2Qyw0QkFBK0I7QUFDL0IsMEJBQTZCO0FBQzdCLDZCQUFvQztBQUNwQywrQkFBMkI7QUFFM0Isa0JBQTBCO0FBQzFCLHFCQUE4QjtBQUU5QixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLDJCQUFRO0FBQUEsRUFDYixPQUFPO0FBQ1Q7QUFHQSxNQUFNLE9BQU8sNkJBQU07QUFBQyxHQUFQO0FBRWIsTUFBTSxRQUEwQztBQUFBLEVBQzlDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxNQUNKLFFBQVEsMERBQXVCO0FBQUEsUUFDN0IsYUFBYTtBQUFBLE1B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
