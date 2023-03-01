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
var Message_stories_exports = {};
__export(Message_stories_exports, {
  AllTheContextMenus: () => AllTheContextMenus,
  AudioWithCaption: () => AudioWithCaption,
  AudioWithNotDownloadedAttachment: () => AudioWithNotDownloadedAttachment,
  AudioWithPendingAttachment: () => AudioWithPendingAttachment,
  AvatarInGroup: () => AvatarInGroup,
  BadgeInGroup: () => BadgeInGroup,
  CanDeleteForEveryone: () => CanDeleteForEveryone,
  CollapsingTextOnlyDMs: () => CollapsingTextOnlyDMs,
  CollapsingTextOnlyGroupMessages: () => CollapsingTextOnlyGroupMessages,
  Colors: () => Colors,
  CustomColor: () => CustomColor,
  DangerousFileType: () => DangerousFileType,
  Deleted: () => Deleted,
  DeletedWithError: () => DeletedWithError,
  DeletedWithExpireTimer: () => DeletedWithExpireTimer,
  Delivered: () => Delivered,
  EmbeddedContactFamilyName: () => EmbeddedContactFamilyName,
  EmbeddedContactFullContact: () => EmbeddedContactFullContact,
  EmbeddedContactGivenFamilyName: () => EmbeddedContactGivenFamilyName,
  EmbeddedContactGivenName: () => EmbeddedContactGivenName,
  EmbeddedContactLoadingAvatar: () => EmbeddedContactLoadingAvatar,
  EmbeddedContactOnlyEmail: () => EmbeddedContactOnlyEmail,
  EmbeddedContactOrganization: () => EmbeddedContactOrganization,
  EmbeddedContactWithSendMessage: () => EmbeddedContactWithSendMessage,
  EmojiMessages: () => EmojiMessages,
  Error: () => Error2,
  Expiring: () => Expiring,
  Gif: () => Gif,
  GifInAGroup: () => GifInAGroup,
  GiftBadgeMissingBadge: () => GiftBadgeMissingBadge,
  GiftBadgeOpened60Minutes: () => GiftBadgeOpened60Minutes,
  GiftBadgeOpenedExpired: () => GiftBadgeOpenedExpired,
  GiftBadgeRedeemed1Minute: () => GiftBadgeRedeemed1Minute,
  GiftBadgeRedeemed24Hours: () => GiftBadgeRedeemed24Hours,
  GiftBadgeRedeemed30Days: () => GiftBadgeRedeemed30Days,
  GiftBadgeUnopened: () => GiftBadgeUnopened,
  Image: () => Image,
  ImageWithCaption: () => ImageWithCaption,
  LinkPreviewInGroup: () => LinkPreviewInGroup,
  LinkPreviewWithLongDescription: () => LinkPreviewWithLongDescription,
  LinkPreviewWithNoDate: () => LinkPreviewWithNoDate,
  LinkPreviewWithNoDescription: () => LinkPreviewWithNoDescription,
  LinkPreviewWithQuote: () => LinkPreviewWithQuote,
  LinkPreviewWithSmallImage: () => LinkPreviewWithSmallImage,
  LinkPreviewWithSmallImageLongDescription: () => LinkPreviewWithSmallImageLongDescription,
  LinkPreviewWithTooNewADate: () => LinkPreviewWithTooNewADate,
  LinkPreviewWithoutImage: () => LinkPreviewWithoutImage,
  LongAudio: () => LongAudio,
  LongBodyCanBeDownloaded: () => LongBodyCanBeDownloaded,
  Mentions: () => Mentions,
  MultipleImages2: () => MultipleImages2,
  MultipleImages3: () => MultipleImages3,
  MultipleImages4: () => MultipleImages4,
  MultipleImages5: () => MultipleImages5,
  NotApprovedWithLinkPreview: () => NotApprovedWithLinkPreview,
  NotDownloadedGif: () => NotDownloadedGif,
  Older: () => Older,
  OtherFileType: () => OtherFileType,
  OtherFileTypeWithCaption: () => OtherFileTypeWithCaption,
  OtherFileTypeWithLongFilename: () => OtherFileTypeWithLongFilename,
  PartialSend: () => PartialSend,
  Paused: () => Paused,
  Pending: () => Pending,
  PendingGif: () => PendingGif,
  PlainMessage: () => PlainMessage,
  PlainRtlMessage: () => PlainRtlMessage,
  ReactionsShortMessage: () => ReactionsShortMessage,
  ReactionsWiderMessage: () => ReactionsWiderMessage,
  Read: () => Read,
  Recent: () => Recent,
  Sending: () => Sending,
  Sticker: () => Sticker,
  StoryReply: () => StoryReply,
  StoryReplyEmoji: () => StoryReplyEmoji,
  StoryReplyYours: () => StoryReplyYours,
  TapToViewError: () => TapToViewError,
  TapToViewExpired: () => TapToViewExpired,
  TapToViewGif: () => TapToViewGif,
  TapToViewImage: () => TapToViewImage,
  TapToViewVideo: () => TapToViewVideo,
  WillExpireButStillSending: () => WillExpireButStillSending,
  _Audio: () => _Audio,
  default: () => Message_stories_default
});
module.exports = __toCommonJS(Message_stories_exports);
var React = __toESM(require("react"));
var import_lodash = require("lodash");
var import_addon_actions = require("@storybook/addon-actions");
var import_addon_knobs = require("@storybook/addon-knobs");
var import_protobuf = require("../../protobuf");
var import_Colors = require("../../types/Colors");
var import_EmojiPicker = require("../emoji/EmojiPicker");
var import_Message = require("./Message");
var import_MIME = require("../../types/MIME");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_MessageAudio = require("./MessageAudio");
var import_GlobalAudioContext = require("../GlobalAudioContext");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_Fixtures = require("../../storybook/Fixtures");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_util = require("../_util");
var import_durations = require("../../util/durations");
var import_EmbeddedContact = require("../../types/EmbeddedContact");
var import_fakeAttachment = require("../../test-both/helpers/fakeAttachment");
var import_getFakeBadge = require("../../test-both/helpers/getFakeBadge");
var import_Util = require("../../types/Util");
var import_UUID = require("../../types/UUID");
var import_BadgeCategory = require("../../badges/BadgeCategory");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const quoteOptions = {
  none: void 0,
  basic: {
    conversationColor: import_Colors.ConversationColors[2],
    text: "The quoted message",
    isFromMe: false,
    sentAt: Date.now(),
    authorId: "some-id",
    authorTitle: "Someone",
    referencedMessageNotFound: false,
    isViewOnce: false,
    isGiftBadge: false
  }
};
var Message_stories_default = {
  title: "Components/Conversation/Message",
  argTypes: {
    conversationType: {
      control: "select",
      defaultValue: "direct",
      options: ["direct", "group"]
    },
    quote: {
      control: "select",
      defaultValue: void 0,
      mapping: quoteOptions,
      options: Object.keys(quoteOptions)
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => {
  return renderBothDirections({
    ...createProps(),
    conversationType: "direct",
    quote: void 0,
    ...args
  });
}, "Template");
function getJoyReaction() {
  return {
    emoji: "\u{1F602}",
    from: (0, import_getDefaultConversation.getDefaultConversation)({
      id: "+14155552674",
      phoneNumber: "+14155552674",
      name: "Amelia Briggs",
      title: "Amelia"
    }),
    timestamp: Date.now() - 10
  };
}
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
const MessageAudioContainer = /* @__PURE__ */ __name((props) => {
  const [active, setActive] = React.useState({});
  const audio = React.useMemo(() => new Audio(), []);
  return /* @__PURE__ */ React.createElement(import_MessageAudio.MessageAudio, {
    ...props,
    id: "storybook",
    renderingContext: "storybook",
    audio,
    computePeaks: import_GlobalAudioContext.computePeaks,
    setActiveAudioID: (id, context) => setActive({ id, context }),
    onFirstPlayed: (0, import_addon_actions.action)("onFirstPlayed"),
    activeAudioID: active.id,
    activeAudioContext: active.context
  });
}, "MessageAudioContainer");
const renderAudioAttachment = /* @__PURE__ */ __name((props) => /* @__PURE__ */ React.createElement(MessageAudioContainer, {
  ...props
}), "renderAudioAttachment");
const createProps = /* @__PURE__ */ __name((overrideProps = {}) => ({
  attachments: overrideProps.attachments,
  author: overrideProps.author || (0, import_getDefaultConversation.getDefaultConversation)(),
  reducedMotion: (0, import_addon_knobs.boolean)("reducedMotion", false),
  bodyRanges: overrideProps.bodyRanges,
  canReact: true,
  canReply: true,
  canDownload: true,
  canDeleteForEveryone: overrideProps.canDeleteForEveryone || false,
  canRetry: overrideProps.canRetry || false,
  canRetryDeleteForEveryone: overrideProps.canRetryDeleteForEveryone || false,
  checkForAccount: (0, import_addon_actions.action)("checkForAccount"),
  clearSelectedMessage: (0, import_addon_actions.action)("clearSelectedMessage"),
  containerElementRef: React.createRef(),
  containerWidthBreakpoint: import_util.WidthBreakpoint.Wide,
  conversationColor: overrideProps.conversationColor || (0, import_addon_knobs.select)("conversationColor", import_Colors.ConversationColors, import_Colors.ConversationColors[0]),
  conversationTitle: overrideProps.conversationTitle || (0, import_addon_knobs.text)("conversationTitle", "Conversation Title"),
  conversationId: (0, import_addon_knobs.text)("conversationId", overrideProps.conversationId || ""),
  conversationType: overrideProps.conversationType || "direct",
  contact: overrideProps.contact,
  deletedForEveryone: overrideProps.deletedForEveryone,
  deleteMessage: (0, import_addon_actions.action)("deleteMessage"),
  deleteMessageForEveryone: (0, import_addon_actions.action)("deleteMessageForEveryone"),
  disableMenu: overrideProps.disableMenu,
  disableScroll: overrideProps.disableScroll,
  direction: overrideProps.direction || "incoming",
  displayTapToViewMessage: (0, import_addon_actions.action)("displayTapToViewMessage"),
  doubleCheckMissingQuoteReference: (0, import_addon_actions.action)("doubleCheckMissingQuoteReference"),
  downloadAttachment: (0, import_addon_actions.action)("downloadAttachment"),
  expirationLength: (0, import_addon_knobs.number)("expirationLength", overrideProps.expirationLength || 0) || void 0,
  expirationTimestamp: (0, import_addon_knobs.number)("expirationTimestamp", overrideProps.expirationTimestamp || 0) || void 0,
  getPreferredBadge: overrideProps.getPreferredBadge || (() => void 0),
  giftBadge: overrideProps.giftBadge,
  i18n,
  id: (0, import_addon_knobs.text)("id", overrideProps.id || "random-message-id"),
  renderingContext: "storybook",
  interactionMode: overrideProps.interactionMode || "keyboard",
  isSticker: (0, import_lodash.isBoolean)(overrideProps.isSticker) ? overrideProps.isSticker : false,
  isBlocked: (0, import_lodash.isBoolean)(overrideProps.isBlocked) ? overrideProps.isBlocked : false,
  isMessageRequestAccepted: (0, import_lodash.isBoolean)(overrideProps.isMessageRequestAccepted) ? overrideProps.isMessageRequestAccepted : true,
  isTapToView: overrideProps.isTapToView,
  isTapToViewError: overrideProps.isTapToViewError,
  isTapToViewExpired: overrideProps.isTapToViewExpired,
  kickOffAttachmentDownload: (0, import_addon_actions.action)("kickOffAttachmentDownload"),
  markAttachmentAsCorrupted: (0, import_addon_actions.action)("markAttachmentAsCorrupted"),
  markViewed: (0, import_addon_actions.action)("markViewed"),
  messageExpanded: (0, import_addon_actions.action)("messageExpanded"),
  openConversation: (0, import_addon_actions.action)("openConversation"),
  openGiftBadge: (0, import_addon_actions.action)("openGiftBadge"),
  openLink: (0, import_addon_actions.action)("openLink"),
  previews: overrideProps.previews || [],
  quote: overrideProps.quote || void 0,
  reactions: overrideProps.reactions,
  reactToMessage: (0, import_addon_actions.action)("reactToMessage"),
  readStatus: overrideProps.readStatus === void 0 ? import_MessageReadStatus.ReadStatus.Read : overrideProps.readStatus,
  renderEmojiPicker,
  renderReactionPicker,
  renderAudioAttachment,
  replyToMessage: (0, import_addon_actions.action)("replyToMessage"),
  retrySend: (0, import_addon_actions.action)("retrySend"),
  retryDeleteForEveryone: (0, import_addon_actions.action)("retryDeleteForEveryone"),
  scrollToQuotedMessage: (0, import_addon_actions.action)("scrollToQuotedMessage"),
  selectMessage: (0, import_addon_actions.action)("selectMessage"),
  shouldCollapseAbove: (0, import_lodash.isBoolean)(overrideProps.shouldCollapseAbove) ? overrideProps.shouldCollapseAbove : false,
  shouldCollapseBelow: (0, import_lodash.isBoolean)(overrideProps.shouldCollapseBelow) ? overrideProps.shouldCollapseBelow : false,
  shouldHideMetadata: (0, import_lodash.isBoolean)(overrideProps.shouldHideMetadata) ? overrideProps.shouldHideMetadata : false,
  showContactDetail: (0, import_addon_actions.action)("showContactDetail"),
  showContactModal: (0, import_addon_actions.action)("showContactModal"),
  showExpiredIncomingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  showExpiredOutgoingTapToViewToast: (0, import_addon_actions.action)("showExpiredOutgoingTapToViewToast"),
  showForwardMessageModal: (0, import_addon_actions.action)("showForwardMessageModal"),
  showMessageDetail: (0, import_addon_actions.action)("showMessageDetail"),
  showVisualAttachment: (0, import_addon_actions.action)("showVisualAttachment"),
  startConversation: (0, import_addon_actions.action)("startConversation"),
  status: overrideProps.status || "sent",
  text: overrideProps.text || (0, import_addon_knobs.text)("text", ""),
  textDirection: overrideProps.textDirection || import_Message.TextDirection.Default,
  textAttachment: overrideProps.textAttachment || {
    contentType: import_MIME.LONG_MESSAGE,
    size: 123,
    pending: (0, import_addon_knobs.boolean)("textPending", false)
  },
  theme: import_Util.ThemeType.light,
  timestamp: (0, import_addon_knobs.number)("timestamp", overrideProps.timestamp || Date.now()),
  viewStory: (0, import_addon_actions.action)("viewStory")
}), "createProps");
const createTimelineItem = /* @__PURE__ */ __name((data) => data && {
  type: "message",
  data,
  timestamp: data.timestamp
}, "createTimelineItem");
const renderMany = /* @__PURE__ */ __name((propsArray) => /* @__PURE__ */ React.createElement(React.Fragment, null, propsArray.map((message, index) => /* @__PURE__ */ React.createElement(import_Message.Message, {
  key: message.text,
  ...message,
  shouldCollapseAbove: Boolean(propsArray[index - 1]),
  item: createTimelineItem(message),
  shouldCollapseBelow: Boolean(propsArray[index + 1])
}))), "renderMany");
const renderThree = /* @__PURE__ */ __name((props) => renderMany([props, props, props]), "renderThree");
const renderBothDirections = /* @__PURE__ */ __name((props) => /* @__PURE__ */ React.createElement(React.Fragment, null, renderThree(props), renderThree({
  ...props,
  author: { ...props.author, id: (0, import_getDefaultConversation.getDefaultConversation)().id },
  direction: "outgoing"
})), "renderBothDirections");
const PlainMessage = Template.bind({});
PlainMessage.args = {
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look."
};
const PlainRtlMessage = Template.bind({});
PlainRtlMessage.args = {
  text: '\u0627\u0644\u0623\u0633\u0627\u0646\u0633\u064A\u0631\u060C \u0639\u0644\u0634\u0627\u0646 \u0627\u0644\u0642\u0637\u0637 \u0645\u0627\u062A\u0627\u0643\u0644\u0634 \u0645\u0646\u0647\u0627. \u0648\u0646\u0646\u0633\u0627\u0647\u0627\u060C \u0648\u0646\u0639\u0648\u062F \u0627\u0644\u0649 \u0623\u0648\u0631\u0627\u0642\u0646\u0627 \u0645\u0648\u0635\u062F\u064A\u0646 \u0627\u0644\u0628\u0627\u0628 \u0628\u0625\u062D\u0643\u0627\u0645. \u0646\u062A\u0646\u062D\u0646\u062D\u060C \u0648\u0646\u0642\u0648\u0644: \u0627\u0644\u0628\u062A\u0627\u0639. \u0643\u0644\u0645\u0629 \u062A\u062F\u0644\u0651 \u0639\u0644\u0649 \u0644\u0627 \u0634\u064A\u0621\u060C \u0648\u0639\u0644\u0649 \u0643\u0644\u0651 \u0634\u064A\u0621. \u0648\u0647\u064A \u0645\u0631\u0643\u0632 \u0623\u0628\u062D\u0627\u062B \u0634\u0639\u0628\u064A\u0629 \u0643\u062B\u064A\u0631\u0629\u060C \u062A\u062A\u0639\u062C\u0651\u0628 \u0645\u0646 \u063A\u0631\u0627\u0628\u062A\u0647\u0627 \u0648\u0627\u0644\u0642\u0648\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0627\u0644\u062E\u0627\u0635\u0629 \u0627\u0644\u062A\u064A \u062A\u0639\u0643\u0633\u0647\u0627\u060C \u0627\u0644\u0649 \u062C\u0627\u0646\u0628 \u0627\u0644\u0634\u064A\u0621 \u0627\u0644\u0643\u062B\u064A\u0631 \u0645\u0646 \u0627\u0644\u0639\u0641\u0648\u064A\u0629 \u0648\u062D\u0644\u0627\u0648\u0629 \u0627\u0644\u0631\u0648\u062D. \u0646\u0639\u0645\u060C \u0646\u062D\u0646 \u0642\u0631\u0623\u0646\u0627 \u0648\u0633\u0645\u0639\u0646\u0627 \u0648\u0639\u0631\u0641\u0646\u0627 \u0643\u0644 \u0647\u0630\u0627. \u0644\u0643\u0646\u0647 \u0645\u062D\u0644\u0651 \u0627\u0647\u062A\u0645\u0627\u0645\u0646\u0627 \u0627\u0644\u064A\u0648\u0645 \u0644\u0623\u0633\u0628\u0627\u0628 \u063A\u064A\u0631 \u062A\u0644\u0643 \u0627\u0644\u0623\u0633\u0628\u0627\u0628. \u0643\u0630\u0644\u0643\u060C \u0641\u0625\u0646\u0646\u0627 \u0644\u0639\u0627\u0642\u062F\u0648\u0646 \u0639\u0632\u0645\u0646\u0627 \u0639\u0644\u0649 \u0623\u0646 \u0646\u062A\u062C\u0627\u0648\u0632 \u0642\u0636\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649 \u0648\u0627\u0644\u0639\u0627\u0645\u064A\u0629\u060C \u0648\u062B\u0646\u0627\u0626\u064A\u0629 \u0627\u0644\u0646\u062E\u0628\u0629 \u0648\u0627\u0644\u0631\u0639\u0627\u0639\u060C \u0627\u0644\u062A\u064A \u0643\u062B\u064A\u0631\u0627\u064B \u0645\u0627 \u064A\u0646\u062D\u0648 \u0646\u062D\u0648\u0647\u0627 \u0627\u0644\u062D\u062F\u064A\u062B \u0639\u0646 \u0627\u0644\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0630\u0643\u0648\u0631\u0629. \u0648\u0641\u0648\u0642 \u0647\u0630\u0627 \u0643\u0644\u0647\u060C \u0644\u0633\u0646\u0627 \u0628\u0635\u062F\u062F \u062A\u0641\u0633\u064A\u0631 \u0645\u0639\u0627\u0646\u064A "\u0627\u0644\u0628\u062A\u0627\u0639" \u0643\u0645\u0627 \u062A\u0623\u062A\u064A \u0641\u064A \u0642\u0635\u064A\u062F\u0629 \u0627\u0644\u062D\u0627\u062C \u0623\u062D\u0645\u062F \u0641\u0624\u0627\u062F \u0646\u062C\u0645\u060C \u0648\u0644\u0627 \u0627\u0644\u062A\u062D\u0630\u0644\u0642 \u0648\u0627\u0644\u062A\u0641\u0630\u0644\u0643 \u0641\u064A \u0627\u0644\u0623\u0644\u063A\u0627\u0632 \u0648\u0627\u0644\u0623\u0633\u0631\u0627\u0631 \u0627\u0644\u0645\u0643\u0646\u0648\u0646\u0629. \u0647\u0630\u0627 \u0627\u0644\u0628\u062A\u0627\u0639 - \u0623\u0645 \u0647\u0630\u0647 \u0627\u0644\u0628\u062A',
  textDirection: import_Message.TextDirection.RightToLeft
};
PlainRtlMessage.story = {
  name: "Plain RTL Message"
};
const EmojiMessages = /* @__PURE__ */ __name(() => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}\u{1F600}\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}\u{1F600}\u{1F600}\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({ text: "\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}" })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({
    previews: [
      {
        domain: "signal.org",
        image: (0, import_fakeAttachment.fakeAttachment)({
          contentType: import_MIME.IMAGE_PNG,
          fileName: "the-sax.png",
          height: 240,
          url: import_Fixtures.pngUrl,
          width: 320
        }),
        isStickerPack: false,
        title: "Signal",
        description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
        url: "https://www.signal.org",
        date: new Date(2020, 2, 10).valueOf()
      }
    ],
    text: "\u{1F600}"
  })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/tina-rolf-269345-unsplash.jpg",
        fileName: "tina-rolf-269345-unsplash.jpg",
        contentType: import_MIME.IMAGE_JPEG,
        width: 128,
        height: 128
      })
    ],
    text: "\u{1F600}"
  })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.AUDIO_MP3,
        fileName: "incompetech-com-Agnus-Dei-X.mp3",
        url: "/fixtures/incompetech-com-Agnus-Dei-X.mp3"
      })
    ],
    text: "\u{1F600}"
  })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        contentType: (0, import_MIME.stringToMIMEType)("text/plain"),
        fileName: "my-resume.txt",
        url: "my-resume.txt"
      })
    ],
    text: "\u{1F600}"
  })
}), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
  ...createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.VIDEO_MP4,
        flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
        fileName: "cat-gif.mp4",
        url: "/fixtures/cat-gif.mp4",
        width: 400,
        height: 332
      })
    ],
    text: "\u{1F600}"
  })
})), "EmojiMessages");
const Delivered = Template.bind({});
Delivered.args = {
  status: "delivered",
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look."
};
const Read = Template.bind({});
Read.args = {
  status: "read",
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look."
};
const Sending = Template.bind({});
Sending.args = {
  status: "sending",
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look."
};
const Expiring = Template.bind({});
Expiring.args = {
  expirationLength: 30 * 1e3,
  expirationTimestamp: Date.now() + 30 * 1e3,
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look."
};
const WillExpireButStillSending = Template.bind({});
WillExpireButStillSending.args = {
  status: "sending",
  expirationLength: 30 * 1e3,
  text: "We always show the timer if a message has an expiration length, even if unread or still sending."
};
WillExpireButStillSending.story = {
  name: "Will expire but still sending"
};
const Pending = Template.bind({});
Pending.args = {
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.",
  textAttachment: {
    contentType: import_MIME.LONG_MESSAGE,
    size: 123,
    pending: true
  }
};
const LongBodyCanBeDownloaded = Template.bind({});
LongBodyCanBeDownloaded.args = {
  text: "Hello there from a pal! I am sending a long message so that it will wrap a bit, since I like that look.",
  textAttachment: {
    contentType: import_MIME.LONG_MESSAGE,
    size: 123,
    pending: false,
    error: true,
    digest: "abc",
    key: "def"
  }
};
LongBodyCanBeDownloaded.story = {
  name: "Long body can be downloaded"
};
const Recent = Template.bind({});
Recent.args = {
  text: "Hello there from a pal!",
  timestamp: Date.now() - 30 * 60 * 1e3
};
const Older = Template.bind({});
Older.args = {
  text: "Hello there from a pal!",
  timestamp: Date.now() - 180 * 24 * 60 * 60 * 1e3
};
const ReactionsWiderMessage = Template.bind({});
ReactionsWiderMessage.args = {
  text: "Hello there from a pal!",
  timestamp: Date.now() - 180 * 24 * 60 * 60 * 1e3,
  reactions: [
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        isMe: true,
        id: "+14155552672",
        phoneNumber: "+14155552672",
        name: "Me",
        title: "Me"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552672",
        phoneNumber: "+14155552672",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552673",
        phoneNumber: "+14155552673",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u{1F602}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552674",
        phoneNumber: "+14155552674",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u{1F621}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552677",
        phoneNumber: "+14155552677",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u{1F44E}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552678",
        phoneNumber: "+14155552678",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    },
    {
      emoji: "\u2764\uFE0F",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552679",
        phoneNumber: "+14155552679",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now() - 10
    }
  ]
};
ReactionsWiderMessage.story = {
  name: "Reactions (wider message)"
};
const joyReactions = Array.from({ length: 52 }, () => getJoyReaction());
const ReactionsShortMessage = Template.bind({});
ReactionsShortMessage.args = {
  text: "h",
  timestamp: Date.now(),
  reactions: [
    ...joyReactions,
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        isMe: true,
        id: "+14155552672",
        phoneNumber: "+14155552672",
        name: "Me",
        title: "Me"
      }),
      timestamp: Date.now()
    },
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552672",
        phoneNumber: "+14155552672",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now()
    },
    {
      emoji: "\u{1F44D}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552673",
        phoneNumber: "+14155552673",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now()
    },
    {
      emoji: "\u{1F621}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552677",
        phoneNumber: "+14155552677",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now()
    },
    {
      emoji: "\u{1F44E}",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552678",
        phoneNumber: "+14155552678",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now()
    },
    {
      emoji: "\u2764\uFE0F",
      from: (0, import_getDefaultConversation.getDefaultConversation)({
        id: "+14155552679",
        phoneNumber: "+14155552679",
        name: "Amelia Briggs",
        title: "Amelia"
      }),
      timestamp: Date.now()
    }
  ]
};
ReactionsShortMessage.story = {
  name: "Reactions (short message)"
};
const AvatarInGroup = Template.bind({});
AvatarInGroup.args = {
  author: (0, import_getDefaultConversation.getDefaultConversation)({ avatarPath: import_Fixtures.pngUrl }),
  conversationType: "group",
  status: "sent",
  text: "Hello it is me, the saxophone."
};
AvatarInGroup.story = {
  name: "Avatar in Group"
};
const BadgeInGroup = Template.bind({});
BadgeInGroup.args = {
  conversationType: "group",
  getPreferredBadge: () => (0, import_getFakeBadge.getFakeBadge)(),
  status: "sent",
  text: "Hello it is me, the saxophone."
};
BadgeInGroup.story = {
  name: "Badge in Group"
};
const Sticker = Template.bind({});
Sticker.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/512x515-thumbs-up-lincoln.webp",
      fileName: "512x515-thumbs-up-lincoln.webp",
      contentType: import_MIME.IMAGE_WEBP,
      width: 128,
      height: 128
    })
  ],
  isSticker: true,
  status: "sent"
};
const Deleted = /* @__PURE__ */ __name(() => {
  const propsSent = createProps({
    conversationType: "direct",
    deletedForEveryone: true,
    status: "sent"
  });
  const propsSending = createProps({
    conversationType: "direct",
    deletedForEveryone: true,
    status: "sending"
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderBothDirections(propsSent), renderBothDirections(propsSending));
}, "Deleted");
const DeletedWithExpireTimer = Template.bind({});
DeletedWithExpireTimer.args = {
  timestamp: Date.now() - 60 * 1e3,
  conversationType: "group",
  deletedForEveryone: true,
  expirationLength: 5 * 60 * 1e3,
  expirationTimestamp: Date.now() + 3 * 60 * 1e3,
  status: "sent"
};
DeletedWithExpireTimer.story = {
  name: "Deleted with expireTimer"
};
const DeletedWithError = /* @__PURE__ */ __name(() => {
  const propsPartialError = createProps({
    timestamp: Date.now() - 60 * 1e3,
    canDeleteForEveryone: true,
    conversationType: "group",
    deletedForEveryone: true,
    status: "partial-sent",
    direction: "outgoing"
  });
  const propsError = createProps({
    timestamp: Date.now() - 60 * 1e3,
    canDeleteForEveryone: true,
    conversationType: "group",
    deletedForEveryone: true,
    status: "error",
    direction: "outgoing"
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderThree(propsPartialError), renderThree(propsError));
}, "DeletedWithError");
DeletedWithError.story = {
  name: "Deleted with error"
};
const CanDeleteForEveryone = Template.bind({});
CanDeleteForEveryone.args = {
  status: "read",
  text: "I hope you get this.",
  canDeleteForEveryone: true,
  direction: "outgoing"
};
CanDeleteForEveryone.story = {
  name: "Can delete for everyone"
};
const Error2 = Template.bind({});
Error2.args = {
  status: "error",
  canRetry: true,
  text: "I hope you get this."
};
const Paused = Template.bind({});
Paused.args = {
  status: "paused",
  text: "I am up to a challenge"
};
const PartialSend = Template.bind({});
PartialSend.args = {
  status: "partial-sent",
  text: "I hope you get this."
};
const LinkPreviewInGroup = Template.bind({});
LinkPreviewInGroup.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 240,
        url: import_Fixtures.pngUrl,
        width: 320
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: new Date(2020, 2, 10).valueOf()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org",
  conversationType: "group"
};
LinkPreviewInGroup.story = {
  name: "Link Preview in Group"
};
const LinkPreviewWithQuote = Template.bind({});
LinkPreviewWithQuote.args = {
  quote: {
    conversationColor: import_Colors.ConversationColors[2],
    text: "The quoted message",
    isFromMe: false,
    sentAt: Date.now(),
    authorId: "some-id",
    authorTitle: "Someone",
    referencedMessageNotFound: false,
    isViewOnce: false,
    isGiftBadge: false
  },
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 240,
        url: import_Fixtures.pngUrl,
        width: 320
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: new Date(2020, 2, 10).valueOf()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org",
  conversationType: "group"
};
LinkPreviewWithQuote.story = {
  name: "Link Preview with Quote"
};
const LinkPreviewWithSmallImage = Template.bind({});
LinkPreviewWithSmallImage.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 50,
        url: import_Fixtures.pngUrl,
        width: 50
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: new Date(2020, 2, 10).valueOf()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithSmallImage.story = {
  name: "Link Preview with Small Image"
};
const LinkPreviewWithoutImage = Template.bind({});
LinkPreviewWithoutImage.args = {
  previews: [
    {
      domain: "signal.org",
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: new Date(2020, 2, 10).valueOf()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithoutImage.story = {
  name: "Link Preview without Image"
};
const LinkPreviewWithNoDescription = Template.bind({});
LinkPreviewWithNoDescription.args = {
  previews: [
    {
      domain: "signal.org",
      isStickerPack: false,
      title: "Signal",
      url: "https://www.signal.org",
      date: Date.now()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithNoDescription.story = {
  name: "Link Preview with no description"
};
const LinkPreviewWithLongDescription = Template.bind({});
LinkPreviewWithLongDescription.args = {
  previews: [
    {
      domain: "signal.org",
      isStickerPack: false,
      title: "Signal",
      description: Array(10).fill('Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.').join(" "),
      url: "https://www.signal.org",
      date: Date.now()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithLongDescription.story = {
  name: "Link Preview with long description"
};
const LinkPreviewWithSmallImageLongDescription = Template.bind({});
LinkPreviewWithSmallImageLongDescription.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 50,
        url: import_Fixtures.pngUrl,
        width: 50
      }),
      isStickerPack: false,
      title: "Signal",
      description: Array(10).fill('Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.').join(" "),
      url: "https://www.signal.org",
      date: Date.now()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithSmallImageLongDescription.story = {
  name: "Link Preview with small image, long description"
};
const LinkPreviewWithNoDate = Template.bind({});
LinkPreviewWithNoDate.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 240,
        url: import_Fixtures.pngUrl,
        width: 320
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org"
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithNoDate.story = {
  name: "Link Preview with no date"
};
const LinkPreviewWithTooNewADate = Template.bind({});
LinkPreviewWithTooNewADate.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 240,
        url: import_Fixtures.pngUrl,
        width: 320
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: Date.now() + 3e9
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org"
};
LinkPreviewWithTooNewADate.story = {
  name: "Link Preview with too new a date"
};
const Image = /* @__PURE__ */ __name(() => {
  const darkImageProps = createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/tina-rolf-269345-unsplash.jpg",
        fileName: "tina-rolf-269345-unsplash.jpg",
        contentType: import_MIME.IMAGE_JPEG,
        width: 128,
        height: 128
      })
    ],
    status: "sent"
  });
  const lightImageProps = createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        url: import_Fixtures.pngUrl,
        fileName: "the-sax.png",
        contentType: import_MIME.IMAGE_PNG,
        height: 240,
        width: 320
      })
    ],
    status: "sent"
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderBothDirections(darkImageProps), renderBothDirections(lightImageProps));
}, "Image");
const MultipleImages2 = Template.bind({});
MultipleImages2.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    })
  ],
  status: "sent"
};
const MultipleImages3 = Template.bind({});
MultipleImages3.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    })
  ],
  status: "sent"
};
const MultipleImages4 = Template.bind({});
MultipleImages4.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    })
  ],
  status: "sent"
};
const MultipleImages5 = Template.bind({});
MultipleImages5.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    }),
    (0, import_fakeAttachment.fakeAttachment)({
      url: import_Fixtures.pngUrl,
      fileName: "the-sax.png",
      contentType: import_MIME.IMAGE_PNG,
      height: 240,
      width: 320
    })
  ],
  status: "sent"
};
const ImageWithCaption = Template.bind({});
ImageWithCaption.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/tina-rolf-269345-unsplash.jpg",
      fileName: "tina-rolf-269345-unsplash.jpg",
      contentType: import_MIME.IMAGE_JPEG,
      width: 128,
      height: 128
    })
  ],
  status: "sent",
  text: "This is my home."
};
ImageWithCaption.story = {
  name: "Image with Caption"
};
const Gif = Template.bind({});
Gif.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
      fileName: "cat-gif.mp4",
      url: "/fixtures/cat-gif.mp4",
      width: 400,
      height: 332
    })
  ],
  status: "sent"
};
Gif.story = {
  name: "GIF"
};
const GifInAGroup = Template.bind({});
GifInAGroup.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
      fileName: "cat-gif.mp4",
      url: "/fixtures/cat-gif.mp4",
      width: 400,
      height: 332
    })
  ],
  conversationType: "group",
  status: "sent"
};
GifInAGroup.story = {
  name: "GIF in a group"
};
const NotDownloadedGif = Template.bind({});
NotDownloadedGif.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
      fileName: "cat-gif.mp4",
      fileSize: "188.61 KB",
      blurHash: "LDA,FDBnm+I=p{tkIUI;~UkpELV]",
      width: 400,
      height: 332
    })
  ],
  status: "sent"
};
NotDownloadedGif.story = {
  name: "Not Downloaded GIF"
};
const PendingGif = Template.bind({});
PendingGif.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      pending: true,
      contentType: import_MIME.VIDEO_MP4,
      flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
      fileName: "cat-gif.mp4",
      fileSize: "188.61 KB",
      blurHash: "LDA,FDBnm+I=p{tkIUI;~UkpELV]",
      width: 400,
      height: 332
    })
  ],
  status: "sent"
};
PendingGif.story = {
  name: "Pending GIF"
};
const _Audio = /* @__PURE__ */ __name(() => {
  const Wrapper = /* @__PURE__ */ __name(() => {
    const [isPlayed, setIsPlayed] = React.useState(false);
    const messageProps = createProps({
      attachments: [
        (0, import_fakeAttachment.fakeAttachment)({
          contentType: import_MIME.AUDIO_MP3,
          fileName: "incompetech-com-Agnus-Dei-X.mp3",
          url: "/fixtures/incompetech-com-Agnus-Dei-X.mp3"
        })
      ],
      ...isPlayed ? {
        status: "viewed",
        readStatus: import_MessageReadStatus.ReadStatus.Viewed
      } : {
        status: "read",
        readStatus: import_MessageReadStatus.ReadStatus.Read
      }
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
      type: "button",
      onClick: () => {
        setIsPlayed((old) => !old);
      },
      style: {
        display: "block",
        marginBottom: "2em"
      }
    }, "Toggle played"), renderBothDirections(messageProps));
  }, "Wrapper");
  return /* @__PURE__ */ React.createElement(Wrapper, null);
}, "_Audio");
const LongAudio = Template.bind({});
LongAudio.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.AUDIO_MP3,
      fileName: "long-audio.mp3",
      url: "/fixtures/long-audio.mp3"
    })
  ],
  status: "sent"
};
const AudioWithCaption = Template.bind({});
AudioWithCaption.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.AUDIO_MP3,
      fileName: "incompetech-com-Agnus-Dei-X.mp3",
      url: "/fixtures/incompetech-com-Agnus-Dei-X.mp3"
    })
  ],
  status: "sent",
  text: "This is what I sound like."
};
AudioWithCaption.story = {
  name: "Audio with Caption"
};
const AudioWithNotDownloadedAttachment = Template.bind({});
AudioWithNotDownloadedAttachment.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.AUDIO_MP3,
      fileName: "incompetech-com-Agnus-Dei-X.mp3"
    })
  ],
  status: "sent"
};
AudioWithNotDownloadedAttachment.story = {
  name: "Audio with Not Downloaded Attachment"
};
const AudioWithPendingAttachment = Template.bind({});
AudioWithPendingAttachment.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.AUDIO_MP3,
      fileName: "incompetech-com-Agnus-Dei-X.mp3",
      pending: true
    })
  ],
  status: "sent"
};
AudioWithPendingAttachment.story = {
  name: "Audio with Pending Attachment"
};
const OtherFileType = Template.bind({});
OtherFileType.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: (0, import_MIME.stringToMIMEType)("text/plain"),
      fileName: "my-resume.txt",
      url: "my-resume.txt",
      fileSize: "10MB"
    })
  ],
  status: "sent"
};
const OtherFileTypeWithCaption = Template.bind({});
OtherFileTypeWithCaption.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: (0, import_MIME.stringToMIMEType)("text/plain"),
      fileName: "my-resume.txt",
      url: "my-resume.txt",
      fileSize: "10MB"
    })
  ],
  status: "sent",
  text: "This is what I have done."
};
OtherFileTypeWithCaption.story = {
  name: "Other File Type with Caption"
};
const OtherFileTypeWithLongFilename = Template.bind({});
OtherFileTypeWithLongFilename.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: (0, import_MIME.stringToMIMEType)("text/plain"),
      fileName: "INSERT-APP-NAME_INSERT-APP-APPLE-ID_AppStore_AppsGamesWatch.psd.zip",
      url: "a2/a2334324darewer4234",
      fileSize: "10MB"
    })
  ],
  status: "sent",
  text: "This is what I have done."
};
OtherFileTypeWithLongFilename.story = {
  name: "Other File Type with Long Filename"
};
const TapToViewImage = Template.bind({});
TapToViewImage.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/tina-rolf-269345-unsplash.jpg",
      fileName: "tina-rolf-269345-unsplash.jpg",
      contentType: import_MIME.IMAGE_JPEG,
      width: 128,
      height: 128
    })
  ],
  isTapToView: true,
  status: "sent"
};
TapToViewImage.story = {
  name: "TapToView Image"
};
const TapToViewVideo = Template.bind({});
TapToViewVideo.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      fileName: "pixabay-Soap-Bubble-7141.mp4",
      height: 128,
      url: "/fixtures/pixabay-Soap-Bubble-7141.mp4",
      width: 128
    })
  ],
  isTapToView: true,
  status: "sent"
};
TapToViewVideo.story = {
  name: "TapToView Video"
};
const TapToViewGif = Template.bind({});
TapToViewGif.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      flags: import_protobuf.SignalService.AttachmentPointer.Flags.GIF,
      fileName: "cat-gif.mp4",
      url: "/fixtures/cat-gif.mp4",
      width: 400,
      height: 332
    })
  ],
  isTapToView: true,
  status: "sent"
};
TapToViewGif.story = {
  name: "TapToView GIF"
};
const TapToViewExpired = Template.bind({});
TapToViewExpired.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/tina-rolf-269345-unsplash.jpg",
      fileName: "tina-rolf-269345-unsplash.jpg",
      contentType: import_MIME.IMAGE_JPEG,
      width: 128,
      height: 128
    })
  ],
  isTapToView: true,
  isTapToViewExpired: true,
  status: "sent"
};
TapToViewExpired.story = {
  name: "TapToView Expired"
};
const TapToViewError = Template.bind({});
TapToViewError.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/tina-rolf-269345-unsplash.jpg",
      fileName: "tina-rolf-269345-unsplash.jpg",
      contentType: import_MIME.IMAGE_JPEG,
      width: 128,
      height: 128
    })
  ],
  isTapToView: true,
  isTapToViewError: true,
  status: "sent"
};
TapToViewError.story = {
  name: "TapToView Error"
};
const DangerousFileType = Template.bind({});
DangerousFileType.args = {
  attachments: [
    (0, import_fakeAttachment.fakeAttachment)({
      contentType: (0, import_MIME.stringToMIMEType)("application/vnd.microsoft.portable-executable"),
      fileName: "terrible.exe",
      url: "terrible.exe"
    })
  ],
  status: "sent"
};
const Colors = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, import_Colors.ConversationColors.map((color) => /* @__PURE__ */ React.createElement("div", {
    key: color
  }, renderBothDirections(createProps({
    conversationColor: color,
    text: `Here is a preview of the chat color: ${color}. The color is visible to only you.`
  })))));
}, "Colors");
const Mentions = Template.bind({});
Mentions.args = {
  bodyRanges: [
    {
      start: 0,
      length: 1,
      mentionUuid: "zap",
      replacementText: "Zapp Brannigan"
    }
  ],
  text: "\uFFFC This Is It. The Moment We Should Have Trained For."
};
Mentions.story = {
  name: "@Mentions"
};
const AllTheContextMenus = /* @__PURE__ */ __name(() => {
  const props = createProps({
    attachments: [
      (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/tina-rolf-269345-unsplash.jpg",
        fileName: "tina-rolf-269345-unsplash.jpg",
        contentType: import_MIME.IMAGE_JPEG,
        width: 128,
        height: 128
      })
    ],
    status: "partial-sent",
    canDeleteForEveryone: true,
    canRetry: true,
    canRetryDeleteForEveryone: true
  });
  return /* @__PURE__ */ React.createElement(import_Message.Message, {
    ...props,
    direction: "outgoing"
  });
}, "AllTheContextMenus");
AllTheContextMenus.story = {
  name: "All the context menus"
};
const NotApprovedWithLinkPreview = Template.bind({});
NotApprovedWithLinkPreview.args = {
  previews: [
    {
      domain: "signal.org",
      image: (0, import_fakeAttachment.fakeAttachment)({
        contentType: import_MIME.IMAGE_PNG,
        fileName: "the-sax.png",
        height: 240,
        url: import_Fixtures.pngUrl,
        width: 320
      }),
      isStickerPack: false,
      title: "Signal",
      description: 'Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.',
      url: "https://www.signal.org",
      date: new Date(2020, 2, 10).valueOf()
    }
  ],
  status: "sent",
  text: "Be sure to look at https://www.signal.org",
  isMessageRequestAccepted: false
};
NotApprovedWithLinkPreview.story = {
  name: "Not approved, with link preview"
};
const CustomColor = /* @__PURE__ */ __name(() => /* @__PURE__ */ React.createElement(React.Fragment, null, renderThree({
  ...createProps({ text: "Solid." }),
  direction: "outgoing",
  customColor: {
    start: { hue: 82, saturation: 35 }
  }
}), /* @__PURE__ */ React.createElement("br", {
  style: { clear: "both" }
}), renderThree({
  ...createProps({ text: "Gradient." }),
  direction: "outgoing",
  customColor: {
    deg: 192,
    start: { hue: 304, saturation: 85 },
    end: { hue: 231, saturation: 76 }
  }
})), "CustomColor");
const CollapsingTextOnlyDMs = /* @__PURE__ */ __name(() => {
  const them = (0, import_getDefaultConversation.getDefaultConversation)();
  const me = (0, import_getDefaultConversation.getDefaultConversation)({ isMe: true });
  return renderMany([
    createProps({
      author: them,
      text: "One",
      timestamp: Date.now() - 5 * import_durations.MINUTE
    }),
    createProps({
      author: them,
      text: "Two",
      timestamp: Date.now() - 4 * import_durations.MINUTE
    }),
    createProps({
      author: them,
      text: "Three",
      timestamp: Date.now() - 3 * import_durations.MINUTE
    }),
    createProps({
      author: me,
      direction: "outgoing",
      text: "Four",
      timestamp: Date.now() - 2 * import_durations.MINUTE
    }),
    createProps({
      text: "Five",
      author: me,
      timestamp: Date.now() - import_durations.MINUTE,
      direction: "outgoing"
    }),
    createProps({
      author: me,
      direction: "outgoing",
      text: "Six"
    })
  ]);
}, "CollapsingTextOnlyDMs");
CollapsingTextOnlyDMs.story = {
  name: "Collapsing text-only DMs"
};
const CollapsingTextOnlyGroupMessages = /* @__PURE__ */ __name(() => {
  const author = (0, import_getDefaultConversation.getDefaultConversation)();
  return renderMany([
    createProps({
      author,
      conversationType: "group",
      text: "One",
      timestamp: Date.now() - 2 * import_durations.MINUTE
    }),
    createProps({
      author,
      conversationType: "group",
      text: "Two",
      timestamp: Date.now() - import_durations.MINUTE
    }),
    createProps({
      author,
      conversationType: "group",
      text: "Three"
    })
  ]);
}, "CollapsingTextOnlyGroupMessages");
CollapsingTextOnlyGroupMessages.story = {
  name: "Collapsing text-only group messages"
};
const StoryReply = /* @__PURE__ */ __name(() => {
  const conversation = (0, import_getDefaultConversation.getDefaultConversation)();
  return renderThree({
    ...createProps({ direction: "outgoing", text: "Wow!" }),
    storyReplyContext: {
      authorTitle: conversation.firstName || conversation.title,
      conversationColor: import_Colors.ConversationColors[0],
      isFromMe: false,
      rawAttachment: (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/snow.jpg",
        thumbnail: (0, import_fakeAttachment.fakeThumbnail)("/fixtures/snow.jpg")
      }),
      text: "Photo"
    }
  });
}, "StoryReply");
StoryReply.story = {
  name: "Story reply"
};
const StoryReplyYours = /* @__PURE__ */ __name(() => {
  const conversation = (0, import_getDefaultConversation.getDefaultConversation)();
  return renderThree({
    ...createProps({ direction: "incoming", text: "Wow!" }),
    storyReplyContext: {
      authorTitle: conversation.firstName || conversation.title,
      conversationColor: import_Colors.ConversationColors[0],
      isFromMe: true,
      rawAttachment: (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/snow.jpg",
        thumbnail: (0, import_fakeAttachment.fakeThumbnail)("/fixtures/snow.jpg")
      }),
      text: "Photo"
    }
  });
}, "StoryReplyYours");
StoryReplyYours.story = {
  name: "Story reply (yours)"
};
const StoryReplyEmoji = /* @__PURE__ */ __name(() => {
  const conversation = (0, import_getDefaultConversation.getDefaultConversation)();
  return renderThree({
    ...createProps({ direction: "outgoing", text: "Wow!" }),
    storyReplyContext: {
      authorTitle: conversation.firstName || conversation.title,
      conversationColor: import_Colors.ConversationColors[0],
      emoji: "\u{1F484}",
      isFromMe: false,
      rawAttachment: (0, import_fakeAttachment.fakeAttachment)({
        url: "/fixtures/snow.jpg",
        thumbnail: (0, import_fakeAttachment.fakeThumbnail)("/fixtures/snow.jpg")
      }),
      text: "Photo"
    }
  });
}, "StoryReplyEmoji");
StoryReplyEmoji.story = {
  name: "Story reply (emoji)"
};
const fullContact = {
  avatar: {
    avatar: (0, import_fakeAttachment.fakeAttachment)({
      path: "/fixtures/giphy-GVNvOUpeYmI7e.gif",
      contentType: import_MIME.IMAGE_GIF
    }),
    isProfile: true
  },
  email: [
    {
      value: "jerjor@fakemail.com",
      type: import_EmbeddedContact.ContactFormType.HOME
    }
  ],
  name: {
    givenName: "Jerry",
    familyName: "Jordan",
    prefix: "Dr.",
    suffix: "Jr.",
    middleName: "James",
    displayName: "Jerry Jordan"
  },
  number: [
    {
      value: "555-444-2323",
      type: import_EmbeddedContact.ContactFormType.HOME
    }
  ]
};
const EmbeddedContactFullContact = Template.bind({});
EmbeddedContactFullContact.args = {
  contact: fullContact
};
EmbeddedContactFullContact.story = {
  name: "EmbeddedContact: Full Contact"
};
const EmbeddedContactWithSendMessage = Template.bind({});
EmbeddedContactWithSendMessage.args = {
  contact: {
    ...fullContact,
    firstNumber: fullContact.number[0].value,
    uuid: import_UUID.UUID.generate().toString()
  },
  direction: "incoming"
};
EmbeddedContactWithSendMessage.story = {
  name: "EmbeddedContact: with Send Message"
};
const EmbeddedContactOnlyEmail = Template.bind({});
EmbeddedContactOnlyEmail.args = {
  contact: {
    email: fullContact.email
  }
};
EmbeddedContactOnlyEmail.story = {
  name: "EmbeddedContact: Only Email"
};
const EmbeddedContactGivenName = Template.bind({});
EmbeddedContactGivenName.args = {
  contact: {
    name: {
      givenName: "Jerry"
    }
  }
};
EmbeddedContactGivenName.story = {
  name: "EmbeddedContact: Given Name"
};
const EmbeddedContactOrganization = Template.bind({});
EmbeddedContactOrganization.args = {
  contact: {
    organization: "Company 5"
  }
};
EmbeddedContactOrganization.story = {
  name: "EmbeddedContact: Organization"
};
const EmbeddedContactGivenFamilyName = Template.bind({});
EmbeddedContactGivenFamilyName.args = {
  contact: {
    name: {
      givenName: "Jerry",
      familyName: "FamilyName"
    }
  }
};
EmbeddedContactGivenFamilyName.story = {
  name: "EmbeddedContact: Given + Family Name"
};
const EmbeddedContactFamilyName = Template.bind({});
EmbeddedContactFamilyName.args = {
  contact: {
    name: {
      familyName: "FamilyName"
    }
  }
};
EmbeddedContactFamilyName.story = {
  name: "EmbeddedContact: Family Name"
};
const EmbeddedContactLoadingAvatar = Template.bind({});
EmbeddedContactLoadingAvatar.args = {
  contact: {
    name: {
      displayName: "Jerry Jordan"
    },
    avatar: {
      avatar: (0, import_fakeAttachment.fakeAttachment)({
        pending: true,
        contentType: import_MIME.IMAGE_GIF
      }),
      isProfile: true
    }
  }
};
EmbeddedContactLoadingAvatar.story = {
  name: "EmbeddedContact: Loading Avatar"
};
const GiftBadgeUnopened = Template.bind({});
GiftBadgeUnopened.args = {
  giftBadge: {
    id: "GIFT",
    expiration: Date.now() + import_durations.DAY * 30,
    level: 3,
    state: import_Message.GiftBadgeStates.Unopened
  }
};
GiftBadgeUnopened.story = {
  name: "Gift Badge: Unopened"
};
const getPreferredBadge = /* @__PURE__ */ __name(() => ({
  category: import_BadgeCategory.BadgeCategory.Donor,
  descriptionTemplate: "This is a description of the badge",
  id: "GIFT",
  images: [
    {
      transparent: {
        localPath: "/fixtures/orange-heart.svg",
        url: "http://someplace"
      }
    }
  ],
  name: "heart"
}), "getPreferredBadge");
const GiftBadgeRedeemed30Days = Template.bind({});
GiftBadgeRedeemed30Days.args = {
  getPreferredBadge,
  giftBadge: {
    expiration: Date.now() + import_durations.DAY * 30 + import_durations.SECOND,
    id: "GIFT",
    level: 3,
    state: import_Message.GiftBadgeStates.Redeemed
  }
};
GiftBadgeRedeemed30Days.story = {
  name: "Gift Badge: Redeemed (30 days)"
};
const GiftBadgeRedeemed24Hours = Template.bind({});
GiftBadgeRedeemed24Hours.args = {
  getPreferredBadge,
  giftBadge: {
    expiration: Date.now() + import_durations.DAY + import_durations.SECOND,
    id: "GIFT",
    level: 3,
    state: import_Message.GiftBadgeStates.Redeemed
  }
};
GiftBadgeRedeemed24Hours.story = {
  name: "Gift Badge: Redeemed (24 hours)"
};
const GiftBadgeOpened60Minutes = Template.bind({});
GiftBadgeOpened60Minutes.args = {
  getPreferredBadge,
  giftBadge: {
    expiration: Date.now() + import_durations.HOUR + import_durations.SECOND,
    id: "GIFT",
    level: 3,
    state: import_Message.GiftBadgeStates.Opened
  }
};
GiftBadgeOpened60Minutes.story = {
  name: "Gift Badge: Opened (60 minutes)"
};
const GiftBadgeRedeemed1Minute = Template.bind({});
GiftBadgeRedeemed1Minute.args = {
  getPreferredBadge,
  giftBadge: {
    expiration: Date.now() + import_durations.MINUTE + import_durations.SECOND,
    id: "GIFT",
    level: 3,
    state: import_Message.GiftBadgeStates.Redeemed
  }
};
GiftBadgeRedeemed1Minute.story = {
  name: "Gift Badge: Redeemed (1 minute)"
};
const GiftBadgeOpenedExpired = Template.bind({});
GiftBadgeOpenedExpired.args = {
  getPreferredBadge,
  giftBadge: {
    expiration: Date.now(),
    id: "GIFT",
    level: 3,
    state: import_Message.GiftBadgeStates.Opened
  }
};
GiftBadgeOpenedExpired.story = {
  name: "Gift Badge: Opened (expired)"
};
const GiftBadgeMissingBadge = Template.bind({});
GiftBadgeMissingBadge.args = {
  getPreferredBadge: () => void 0,
  giftBadge: {
    expiration: Date.now() + import_durations.MINUTE + import_durations.SECOND,
    id: "MISSING",
    level: 3,
    state: import_Message.GiftBadgeStates.Redeemed
  }
};
GiftBadgeMissingBadge.story = {
  name: "Gift Badge: Missing Badge"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AllTheContextMenus,
  AudioWithCaption,
  AudioWithNotDownloadedAttachment,
  AudioWithPendingAttachment,
  AvatarInGroup,
  BadgeInGroup,
  CanDeleteForEveryone,
  CollapsingTextOnlyDMs,
  CollapsingTextOnlyGroupMessages,
  Colors,
  CustomColor,
  DangerousFileType,
  Deleted,
  DeletedWithError,
  DeletedWithExpireTimer,
  Delivered,
  EmbeddedContactFamilyName,
  EmbeddedContactFullContact,
  EmbeddedContactGivenFamilyName,
  EmbeddedContactGivenName,
  EmbeddedContactLoadingAvatar,
  EmbeddedContactOnlyEmail,
  EmbeddedContactOrganization,
  EmbeddedContactWithSendMessage,
  EmojiMessages,
  Error,
  Expiring,
  Gif,
  GifInAGroup,
  GiftBadgeMissingBadge,
  GiftBadgeOpened60Minutes,
  GiftBadgeOpenedExpired,
  GiftBadgeRedeemed1Minute,
  GiftBadgeRedeemed24Hours,
  GiftBadgeRedeemed30Days,
  GiftBadgeUnopened,
  Image,
  ImageWithCaption,
  LinkPreviewInGroup,
  LinkPreviewWithLongDescription,
  LinkPreviewWithNoDate,
  LinkPreviewWithNoDescription,
  LinkPreviewWithQuote,
  LinkPreviewWithSmallImage,
  LinkPreviewWithSmallImageLongDescription,
  LinkPreviewWithTooNewADate,
  LinkPreviewWithoutImage,
  LongAudio,
  LongBodyCanBeDownloaded,
  Mentions,
  MultipleImages2,
  MultipleImages3,
  MultipleImages4,
  MultipleImages5,
  NotApprovedWithLinkPreview,
  NotDownloadedGif,
  Older,
  OtherFileType,
  OtherFileTypeWithCaption,
  OtherFileTypeWithLongFilename,
  PartialSend,
  Paused,
  Pending,
  PendingGif,
  PlainMessage,
  PlainRtlMessage,
  ReactionsShortMessage,
  ReactionsWiderMessage,
  Read,
  Recent,
  Sending,
  Sticker,
  StoryReply,
  StoryReplyEmoji,
  StoryReplyYours,
  TapToViewError,
  TapToViewExpired,
  TapToViewGif,
  TapToViewImage,
  TapToViewVideo,
  WillExpireButStillSending,
  _Audio
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZS5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzQm9vbGVhbiB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24tYWN0aW9ucyc7XG5pbXBvcnQgeyBib29sZWFuLCBudW1iZXIsIHNlbGVjdCwgdGV4dCB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24ta25vYnMnO1xuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuXG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcHJvdG9idWYnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uQ29sb3JzIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IEVtb2ppUGlja2VyIH0gZnJvbSAnLi4vZW1vamkvRW1vamlQaWNrZXInO1xuaW1wb3J0IHR5cGUgeyBQcm9wcywgQXVkaW9BdHRhY2htZW50UHJvcHMgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgR2lmdEJhZGdlU3RhdGVzLCBNZXNzYWdlLCBUZXh0RGlyZWN0aW9uIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB7XG4gIEFVRElPX01QMyxcbiAgSU1BR0VfSlBFRyxcbiAgSU1BR0VfUE5HLFxuICBJTUFHRV9XRUJQLFxuICBWSURFT19NUDQsXG4gIExPTkdfTUVTU0FHRSxcbiAgc3RyaW5nVG9NSU1FVHlwZSxcbiAgSU1BR0VfR0lGLFxufSBmcm9tICcuLi8uLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi8uLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBNZXNzYWdlQXVkaW8gfSBmcm9tICcuL01lc3NhZ2VBdWRpbyc7XG5pbXBvcnQgeyBjb21wdXRlUGVha3MgfSBmcm9tICcuLi9HbG9iYWxBdWRpb0NvbnRleHQnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBwbmdVcmwgfSBmcm9tICcuLi8uLi9zdG9yeWJvb2svRml4dHVyZXMnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uLy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgV2lkdGhCcmVha3BvaW50IH0gZnJvbSAnLi4vX3V0aWwnO1xuaW1wb3J0IHsgREFZLCBIT1VSLCBNSU5VVEUsIFNFQ09ORCB9IGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IENvbnRhY3RGb3JtVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0VtYmVkZGVkQ29udGFjdCc7XG5cbmltcG9ydCB7XG4gIGZha2VBdHRhY2htZW50LFxuICBmYWtlVGh1bWJuYWlsLFxufSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9mYWtlQXR0YWNobWVudCc7XG5pbXBvcnQgeyBnZXRGYWtlQmFkZ2UgfSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9nZXRGYWtlQmFkZ2UnO1xuaW1wb3J0IHsgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBCYWRnZUNhdGVnb3J5IH0gZnJvbSAnLi4vLi4vYmFkZ2VzL0JhZGdlQ2F0ZWdvcnknO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5jb25zdCBxdW90ZU9wdGlvbnMgPSB7XG4gIG5vbmU6IHVuZGVmaW5lZCxcbiAgYmFzaWM6IHtcbiAgICBjb252ZXJzYXRpb25Db2xvcjogQ29udmVyc2F0aW9uQ29sb3JzWzJdLFxuICAgIHRleHQ6ICdUaGUgcXVvdGVkIG1lc3NhZ2UnLFxuICAgIGlzRnJvbU1lOiBmYWxzZSxcbiAgICBzZW50QXQ6IERhdGUubm93KCksXG4gICAgYXV0aG9ySWQ6ICdzb21lLWlkJyxcbiAgICBhdXRob3JUaXRsZTogJ1NvbWVvbmUnLFxuICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IGZhbHNlLFxuICAgIGlzVmlld09uY2U6IGZhbHNlLFxuICAgIGlzR2lmdEJhZGdlOiBmYWxzZSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL0NvbnZlcnNhdGlvbi9NZXNzYWdlJyxcbiAgYXJnVHlwZXM6IHtcbiAgICBjb252ZXJzYXRpb25UeXBlOiB7XG4gICAgICBjb250cm9sOiAnc2VsZWN0JyxcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdCcsXG4gICAgICBvcHRpb25zOiBbJ2RpcmVjdCcsICdncm91cCddLFxuICAgIH0sXG4gICAgcXVvdGU6IHtcbiAgICAgIGNvbnRyb2w6ICdzZWxlY3QnLFxuICAgICAgZGVmYXVsdFZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBtYXBwaW5nOiBxdW90ZU9wdGlvbnMsXG4gICAgICBvcHRpb25zOiBPYmplY3Qua2V5cyhxdW90ZU9wdGlvbnMpLFxuICAgIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQYXJ0aWFsPFByb3BzPj4gPSBhcmdzID0+IHtcbiAgcmV0dXJuIHJlbmRlckJvdGhEaXJlY3Rpb25zKHtcbiAgICAuLi5jcmVhdGVQcm9wcygpLFxuICAgIGNvbnZlcnNhdGlvblR5cGU6ICdkaXJlY3QnLFxuICAgIHF1b3RlOiB1bmRlZmluZWQsXG4gICAgLi4uYXJncyxcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXRKb3lSZWFjdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBlbW9qaTogJ1x1RDgzRFx1REUwMicsXG4gICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICBpZDogJysxNDE1NTU1MjY3NCcsXG4gICAgICBwaG9uZU51bWJlcjogJysxNDE1NTU1MjY3NCcsXG4gICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICB0aXRsZTogJ0FtZWxpYScsXG4gICAgfSksXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMTAsXG4gIH07XG59XG5cbmNvbnN0IHJlbmRlckVtb2ppUGlja2VyOiBQcm9wc1sncmVuZGVyRW1vamlQaWNrZXInXSA9ICh7XG4gIG9uQ2xvc2UsXG4gIG9uUGlja0Vtb2ppLFxuICByZWYsXG59KSA9PiAoXG4gIDxFbW9qaVBpY2tlclxuICAgIGkxOG49e3NldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKX1cbiAgICBza2luVG9uZT17MH1cbiAgICBvblNldFNraW5Ub25lPXthY3Rpb24oJ0Vtb2ppUGlja2VyOjpvblNldFNraW5Ub25lJyl9XG4gICAgcmVmPXtyZWZ9XG4gICAgb25DbG9zZT17b25DbG9zZX1cbiAgICBvblBpY2tFbW9qaT17b25QaWNrRW1vaml9XG4gIC8+XG4pO1xuXG5jb25zdCByZW5kZXJSZWFjdGlvblBpY2tlcjogUHJvcHNbJ3JlbmRlclJlYWN0aW9uUGlja2VyJ10gPSAoKSA9PiA8ZGl2IC8+O1xuXG5jb25zdCBNZXNzYWdlQXVkaW9Db250YWluZXI6IFJlYWN0LkZDPEF1ZGlvQXR0YWNobWVudFByb3BzPiA9IHByb3BzID0+IHtcbiAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IFJlYWN0LnVzZVN0YXRlPHtcbiAgICBpZD86IHN0cmluZztcbiAgICBjb250ZXh0Pzogc3RyaW5nO1xuICB9Pih7fSk7XG4gIGNvbnN0IGF1ZGlvID0gUmVhY3QudXNlTWVtbygoKSA9PiBuZXcgQXVkaW8oKSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPE1lc3NhZ2VBdWRpb1xuICAgICAgey4uLnByb3BzfVxuICAgICAgaWQ9XCJzdG9yeWJvb2tcIlxuICAgICAgcmVuZGVyaW5nQ29udGV4dD1cInN0b3J5Ym9va1wiXG4gICAgICBhdWRpbz17YXVkaW99XG4gICAgICBjb21wdXRlUGVha3M9e2NvbXB1dGVQZWFrc31cbiAgICAgIHNldEFjdGl2ZUF1ZGlvSUQ9eyhpZCwgY29udGV4dCkgPT4gc2V0QWN0aXZlKHsgaWQsIGNvbnRleHQgfSl9XG4gICAgICBvbkZpcnN0UGxheWVkPXthY3Rpb24oJ29uRmlyc3RQbGF5ZWQnKX1cbiAgICAgIGFjdGl2ZUF1ZGlvSUQ9e2FjdGl2ZS5pZH1cbiAgICAgIGFjdGl2ZUF1ZGlvQ29udGV4dD17YWN0aXZlLmNvbnRleHR9XG4gICAgLz5cbiAgKTtcbn07XG5cbmNvbnN0IHJlbmRlckF1ZGlvQXR0YWNobWVudDogUHJvcHNbJ3JlbmRlckF1ZGlvQXR0YWNobWVudCddID0gcHJvcHMgPT4gKFxuICA8TWVzc2FnZUF1ZGlvQ29udGFpbmVyIHsuLi5wcm9wc30gLz5cbik7XG5cbmNvbnN0IGNyZWF0ZVByb3BzID0gKG92ZXJyaWRlUHJvcHM6IFBhcnRpYWw8UHJvcHM+ID0ge30pOiBQcm9wcyA9PiAoe1xuICBhdHRhY2htZW50czogb3ZlcnJpZGVQcm9wcy5hdHRhY2htZW50cyxcbiAgYXV0aG9yOiBvdmVycmlkZVByb3BzLmF1dGhvciB8fCBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gIHJlZHVjZWRNb3Rpb246IGJvb2xlYW4oJ3JlZHVjZWRNb3Rpb24nLCBmYWxzZSksXG4gIGJvZHlSYW5nZXM6IG92ZXJyaWRlUHJvcHMuYm9keVJhbmdlcyxcbiAgY2FuUmVhY3Q6IHRydWUsXG4gIGNhblJlcGx5OiB0cnVlLFxuICBjYW5Eb3dubG9hZDogdHJ1ZSxcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IG92ZXJyaWRlUHJvcHMuY2FuRGVsZXRlRm9yRXZlcnlvbmUgfHwgZmFsc2UsXG4gIGNhblJldHJ5OiBvdmVycmlkZVByb3BzLmNhblJldHJ5IHx8IGZhbHNlLFxuICBjYW5SZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiBvdmVycmlkZVByb3BzLmNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmUgfHwgZmFsc2UsXG4gIGNoZWNrRm9yQWNjb3VudDogYWN0aW9uKCdjaGVja0ZvckFjY291bnQnKSxcbiAgY2xlYXJTZWxlY3RlZE1lc3NhZ2U6IGFjdGlvbignY2xlYXJTZWxlY3RlZE1lc3NhZ2UnKSxcbiAgY29udGFpbmVyRWxlbWVudFJlZjogUmVhY3QuY3JlYXRlUmVmPEhUTUxFbGVtZW50PigpLFxuICBjb250YWluZXJXaWR0aEJyZWFrcG9pbnQ6IFdpZHRoQnJlYWtwb2ludC5XaWRlLFxuICBjb252ZXJzYXRpb25Db2xvcjpcbiAgICBvdmVycmlkZVByb3BzLmNvbnZlcnNhdGlvbkNvbG9yIHx8XG4gICAgc2VsZWN0KCdjb252ZXJzYXRpb25Db2xvcicsIENvbnZlcnNhdGlvbkNvbG9ycywgQ29udmVyc2F0aW9uQ29sb3JzWzBdKSxcbiAgY29udmVyc2F0aW9uVGl0bGU6XG4gICAgb3ZlcnJpZGVQcm9wcy5jb252ZXJzYXRpb25UaXRsZSB8fFxuICAgIHRleHQoJ2NvbnZlcnNhdGlvblRpdGxlJywgJ0NvbnZlcnNhdGlvbiBUaXRsZScpLFxuICBjb252ZXJzYXRpb25JZDogdGV4dCgnY29udmVyc2F0aW9uSWQnLCBvdmVycmlkZVByb3BzLmNvbnZlcnNhdGlvbklkIHx8ICcnKSxcbiAgY29udmVyc2F0aW9uVHlwZTogb3ZlcnJpZGVQcm9wcy5jb252ZXJzYXRpb25UeXBlIHx8ICdkaXJlY3QnLFxuICBjb250YWN0OiBvdmVycmlkZVByb3BzLmNvbnRhY3QsXG4gIGRlbGV0ZWRGb3JFdmVyeW9uZTogb3ZlcnJpZGVQcm9wcy5kZWxldGVkRm9yRXZlcnlvbmUsXG4gIGRlbGV0ZU1lc3NhZ2U6IGFjdGlvbignZGVsZXRlTWVzc2FnZScpLFxuICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmU6IGFjdGlvbignZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lJyksXG4gIGRpc2FibGVNZW51OiBvdmVycmlkZVByb3BzLmRpc2FibGVNZW51LFxuICBkaXNhYmxlU2Nyb2xsOiBvdmVycmlkZVByb3BzLmRpc2FibGVTY3JvbGwsXG4gIGRpcmVjdGlvbjogb3ZlcnJpZGVQcm9wcy5kaXJlY3Rpb24gfHwgJ2luY29taW5nJyxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IGFjdGlvbignZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnKSxcbiAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2U6IGFjdGlvbignZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UnKSxcbiAgZG93bmxvYWRBdHRhY2htZW50OiBhY3Rpb24oJ2Rvd25sb2FkQXR0YWNobWVudCcpLFxuICBleHBpcmF0aW9uTGVuZ3RoOlxuICAgIG51bWJlcignZXhwaXJhdGlvbkxlbmd0aCcsIG92ZXJyaWRlUHJvcHMuZXhwaXJhdGlvbkxlbmd0aCB8fCAwKSB8fFxuICAgIHVuZGVmaW5lZCxcbiAgZXhwaXJhdGlvblRpbWVzdGFtcDpcbiAgICBudW1iZXIoJ2V4cGlyYXRpb25UaW1lc3RhbXAnLCBvdmVycmlkZVByb3BzLmV4cGlyYXRpb25UaW1lc3RhbXAgfHwgMCkgfHxcbiAgICB1bmRlZmluZWQsXG4gIGdldFByZWZlcnJlZEJhZGdlOiBvdmVycmlkZVByb3BzLmdldFByZWZlcnJlZEJhZGdlIHx8ICgoKSA9PiB1bmRlZmluZWQpLFxuICBnaWZ0QmFkZ2U6IG92ZXJyaWRlUHJvcHMuZ2lmdEJhZGdlLFxuICBpMThuLFxuICBpZDogdGV4dCgnaWQnLCBvdmVycmlkZVByb3BzLmlkIHx8ICdyYW5kb20tbWVzc2FnZS1pZCcpLFxuICByZW5kZXJpbmdDb250ZXh0OiAnc3Rvcnlib29rJyxcbiAgaW50ZXJhY3Rpb25Nb2RlOiBvdmVycmlkZVByb3BzLmludGVyYWN0aW9uTW9kZSB8fCAna2V5Ym9hcmQnLFxuICBpc1N0aWNrZXI6IGlzQm9vbGVhbihvdmVycmlkZVByb3BzLmlzU3RpY2tlcilcbiAgICA/IG92ZXJyaWRlUHJvcHMuaXNTdGlja2VyXG4gICAgOiBmYWxzZSxcbiAgaXNCbG9ja2VkOiBpc0Jvb2xlYW4ob3ZlcnJpZGVQcm9wcy5pc0Jsb2NrZWQpXG4gICAgPyBvdmVycmlkZVByb3BzLmlzQmxvY2tlZFxuICAgIDogZmFsc2UsXG4gIGlzTWVzc2FnZVJlcXVlc3RBY2NlcHRlZDogaXNCb29sZWFuKG92ZXJyaWRlUHJvcHMuaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkKVxuICAgID8gb3ZlcnJpZGVQcm9wcy5pc01lc3NhZ2VSZXF1ZXN0QWNjZXB0ZWRcbiAgICA6IHRydWUsXG4gIGlzVGFwVG9WaWV3OiBvdmVycmlkZVByb3BzLmlzVGFwVG9WaWV3LFxuICBpc1RhcFRvVmlld0Vycm9yOiBvdmVycmlkZVByb3BzLmlzVGFwVG9WaWV3RXJyb3IsXG4gIGlzVGFwVG9WaWV3RXhwaXJlZDogb3ZlcnJpZGVQcm9wcy5pc1RhcFRvVmlld0V4cGlyZWQsXG4gIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQ6IGFjdGlvbigna2lja09mZkF0dGFjaG1lbnREb3dubG9hZCcpLFxuICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkOiBhY3Rpb24oJ21hcmtBdHRhY2htZW50QXNDb3JydXB0ZWQnKSxcbiAgbWFya1ZpZXdlZDogYWN0aW9uKCdtYXJrVmlld2VkJyksXG4gIG1lc3NhZ2VFeHBhbmRlZDogYWN0aW9uKCdtZXNzYWdlRXhwYW5kZWQnKSxcbiAgb3BlbkNvbnZlcnNhdGlvbjogYWN0aW9uKCdvcGVuQ29udmVyc2F0aW9uJyksXG4gIG9wZW5HaWZ0QmFkZ2U6IGFjdGlvbignb3BlbkdpZnRCYWRnZScpLFxuICBvcGVuTGluazogYWN0aW9uKCdvcGVuTGluaycpLFxuICBwcmV2aWV3czogb3ZlcnJpZGVQcm9wcy5wcmV2aWV3cyB8fCBbXSxcbiAgcXVvdGU6IG92ZXJyaWRlUHJvcHMucXVvdGUgfHwgdW5kZWZpbmVkLFxuICByZWFjdGlvbnM6IG92ZXJyaWRlUHJvcHMucmVhY3Rpb25zLFxuICByZWFjdFRvTWVzc2FnZTogYWN0aW9uKCdyZWFjdFRvTWVzc2FnZScpLFxuICByZWFkU3RhdHVzOlxuICAgIG92ZXJyaWRlUHJvcHMucmVhZFN0YXR1cyA9PT0gdW5kZWZpbmVkXG4gICAgICA/IFJlYWRTdGF0dXMuUmVhZFxuICAgICAgOiBvdmVycmlkZVByb3BzLnJlYWRTdGF0dXMsXG4gIHJlbmRlckVtb2ppUGlja2VyLFxuICByZW5kZXJSZWFjdGlvblBpY2tlcixcbiAgcmVuZGVyQXVkaW9BdHRhY2htZW50LFxuICByZXBseVRvTWVzc2FnZTogYWN0aW9uKCdyZXBseVRvTWVzc2FnZScpLFxuICByZXRyeVNlbmQ6IGFjdGlvbigncmV0cnlTZW5kJyksXG4gIHJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IGFjdGlvbigncmV0cnlEZWxldGVGb3JFdmVyeW9uZScpLFxuICBzY3JvbGxUb1F1b3RlZE1lc3NhZ2U6IGFjdGlvbignc2Nyb2xsVG9RdW90ZWRNZXNzYWdlJyksXG4gIHNlbGVjdE1lc3NhZ2U6IGFjdGlvbignc2VsZWN0TWVzc2FnZScpLFxuICBzaG91bGRDb2xsYXBzZUFib3ZlOiBpc0Jvb2xlYW4ob3ZlcnJpZGVQcm9wcy5zaG91bGRDb2xsYXBzZUFib3ZlKVxuICAgID8gb3ZlcnJpZGVQcm9wcy5zaG91bGRDb2xsYXBzZUFib3ZlXG4gICAgOiBmYWxzZSxcbiAgc2hvdWxkQ29sbGFwc2VCZWxvdzogaXNCb29sZWFuKG92ZXJyaWRlUHJvcHMuc2hvdWxkQ29sbGFwc2VCZWxvdylcbiAgICA/IG92ZXJyaWRlUHJvcHMuc2hvdWxkQ29sbGFwc2VCZWxvd1xuICAgIDogZmFsc2UsXG4gIHNob3VsZEhpZGVNZXRhZGF0YTogaXNCb29sZWFuKG92ZXJyaWRlUHJvcHMuc2hvdWxkSGlkZU1ldGFkYXRhKVxuICAgID8gb3ZlcnJpZGVQcm9wcy5zaG91bGRIaWRlTWV0YWRhdGFcbiAgICA6IGZhbHNlLFxuICBzaG93Q29udGFjdERldGFpbDogYWN0aW9uKCdzaG93Q29udGFjdERldGFpbCcpLFxuICBzaG93Q29udGFjdE1vZGFsOiBhY3Rpb24oJ3Nob3dDb250YWN0TW9kYWwnKSxcbiAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0OiBhY3Rpb24oXG4gICAgJ3Nob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdCdcbiAgKSxcbiAgc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0OiBhY3Rpb24oXG4gICAgJ3Nob3dFeHBpcmVkT3V0Z29pbmdUYXBUb1ZpZXdUb2FzdCdcbiAgKSxcbiAgc2hvd0ZvcndhcmRNZXNzYWdlTW9kYWw6IGFjdGlvbignc2hvd0ZvcndhcmRNZXNzYWdlTW9kYWwnKSxcbiAgc2hvd01lc3NhZ2VEZXRhaWw6IGFjdGlvbignc2hvd01lc3NhZ2VEZXRhaWwnKSxcbiAgc2hvd1Zpc3VhbEF0dGFjaG1lbnQ6IGFjdGlvbignc2hvd1Zpc3VhbEF0dGFjaG1lbnQnKSxcbiAgc3RhcnRDb252ZXJzYXRpb246IGFjdGlvbignc3RhcnRDb252ZXJzYXRpb24nKSxcbiAgc3RhdHVzOiBvdmVycmlkZVByb3BzLnN0YXR1cyB8fCAnc2VudCcsXG4gIHRleHQ6IG92ZXJyaWRlUHJvcHMudGV4dCB8fCB0ZXh0KCd0ZXh0JywgJycpLFxuICB0ZXh0RGlyZWN0aW9uOiBvdmVycmlkZVByb3BzLnRleHREaXJlY3Rpb24gfHwgVGV4dERpcmVjdGlvbi5EZWZhdWx0LFxuICB0ZXh0QXR0YWNobWVudDogb3ZlcnJpZGVQcm9wcy50ZXh0QXR0YWNobWVudCB8fCB7XG4gICAgY29udGVudFR5cGU6IExPTkdfTUVTU0FHRSxcbiAgICBzaXplOiAxMjMsXG4gICAgcGVuZGluZzogYm9vbGVhbigndGV4dFBlbmRpbmcnLCBmYWxzZSksXG4gIH0sXG4gIHRoZW1lOiBUaGVtZVR5cGUubGlnaHQsXG4gIHRpbWVzdGFtcDogbnVtYmVyKCd0aW1lc3RhbXAnLCBvdmVycmlkZVByb3BzLnRpbWVzdGFtcCB8fCBEYXRlLm5vdygpKSxcbiAgdmlld1N0b3J5OiBhY3Rpb24oJ3ZpZXdTdG9yeScpLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVRpbWVsaW5lSXRlbSA9IChkYXRhOiB1bmRlZmluZWQgfCBQcm9wcykgPT5cbiAgZGF0YSAmJiB7XG4gICAgdHlwZTogJ21lc3NhZ2UnIGFzIGNvbnN0LFxuICAgIGRhdGEsXG4gICAgdGltZXN0YW1wOiBkYXRhLnRpbWVzdGFtcCxcbiAgfTtcblxuY29uc3QgcmVuZGVyTWFueSA9IChwcm9wc0FycmF5OiBSZWFkb25seUFycmF5PFByb3BzPikgPT4gKFxuICA8PlxuICAgIHtwcm9wc0FycmF5Lm1hcCgobWVzc2FnZSwgaW5kZXgpID0+IChcbiAgICAgIDxNZXNzYWdlXG4gICAgICAgIGtleT17bWVzc2FnZS50ZXh0fVxuICAgICAgICB7Li4ubWVzc2FnZX1cbiAgICAgICAgc2hvdWxkQ29sbGFwc2VBYm92ZT17Qm9vbGVhbihwcm9wc0FycmF5W2luZGV4IC0gMV0pfVxuICAgICAgICBpdGVtPXtjcmVhdGVUaW1lbGluZUl0ZW0obWVzc2FnZSl9XG4gICAgICAgIHNob3VsZENvbGxhcHNlQmVsb3c9e0Jvb2xlYW4ocHJvcHNBcnJheVtpbmRleCArIDFdKX1cbiAgICAgIC8+XG4gICAgKSl9XG4gIDwvPlxuKTtcblxuY29uc3QgcmVuZGVyVGhyZWUgPSAocHJvcHM6IFByb3BzKSA9PiByZW5kZXJNYW55KFtwcm9wcywgcHJvcHMsIHByb3BzXSk7XG5cbmNvbnN0IHJlbmRlckJvdGhEaXJlY3Rpb25zID0gKHByb3BzOiBQcm9wcykgPT4gKFxuICA8PlxuICAgIHtyZW5kZXJUaHJlZShwcm9wcyl9XG4gICAge3JlbmRlclRocmVlKHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgYXV0aG9yOiB7IC4uLnByb3BzLmF1dGhvciwgaWQ6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKS5pZCB9LFxuICAgICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICAgIH0pfVxuICA8Lz5cbik7XG5cbmV4cG9ydCBjb25zdCBQbGFpbk1lc3NhZ2UgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblBsYWluTWVzc2FnZS5hcmdzID0ge1xuICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSBhIHBhbCEgSSBhbSBzZW5kaW5nIGEgbG9uZyBtZXNzYWdlIHNvIHRoYXQgaXQgd2lsbCB3cmFwIGEgYml0LCBzaW5jZSBJIGxpa2UgdGhhdCBsb29rLicsXG59O1xuXG5leHBvcnQgY29uc3QgUGxhaW5SdGxNZXNzYWdlID0gVGVtcGxhdGUuYmluZCh7fSk7XG5QbGFpblJ0bE1lc3NhZ2UuYXJncyA9IHtcbiAgdGV4dDogJ1x1MDYyN1x1MDY0NFx1MDYyM1x1MDYzM1x1MDYyN1x1MDY0Nlx1MDYzM1x1MDY0QVx1MDYzMVx1MDYwQyBcdTA2MzlcdTA2NDRcdTA2MzRcdTA2MjdcdTA2NDYgXHUwNjI3XHUwNjQ0XHUwNjQyXHUwNjM3XHUwNjM3IFx1MDY0NVx1MDYyN1x1MDYyQVx1MDYyN1x1MDY0M1x1MDY0NFx1MDYzNCBcdTA2NDVcdTA2NDZcdTA2NDdcdTA2MjcuIFx1MDY0OFx1MDY0Nlx1MDY0Nlx1MDYzM1x1MDYyN1x1MDY0N1x1MDYyN1x1MDYwQyBcdTA2NDhcdTA2NDZcdTA2MzlcdTA2NDhcdTA2MkYgXHUwNjI3XHUwNjQ0XHUwNjQ5IFx1MDYyM1x1MDY0OFx1MDYzMVx1MDYyN1x1MDY0Mlx1MDY0Nlx1MDYyNyBcdTA2NDVcdTA2NDhcdTA2MzVcdTA2MkZcdTA2NEFcdTA2NDYgXHUwNjI3XHUwNjQ0XHUwNjI4XHUwNjI3XHUwNjI4IFx1MDYyOFx1MDYyNVx1MDYyRFx1MDY0M1x1MDYyN1x1MDY0NS4gXHUwNjQ2XHUwNjJBXHUwNjQ2XHUwNjJEXHUwNjQ2XHUwNjJEXHUwNjBDIFx1MDY0OFx1MDY0Nlx1MDY0Mlx1MDY0OFx1MDY0NDogXHUwNjI3XHUwNjQ0XHUwNjI4XHUwNjJBXHUwNjI3XHUwNjM5LiBcdTA2NDNcdTA2NDRcdTA2NDVcdTA2MjkgXHUwNjJBXHUwNjJGXHUwNjQ0XHUwNjUxIFx1MDYzOVx1MDY0NFx1MDY0OSBcdTA2NDRcdTA2MjcgXHUwNjM0XHUwNjRBXHUwNjIxXHUwNjBDIFx1MDY0OFx1MDYzOVx1MDY0NFx1MDY0OSBcdTA2NDNcdTA2NDRcdTA2NTEgXHUwNjM0XHUwNjRBXHUwNjIxLiBcdTA2NDhcdTA2NDdcdTA2NEEgXHUwNjQ1XHUwNjMxXHUwNjQzXHUwNjMyIFx1MDYyM1x1MDYyOFx1MDYyRFx1MDYyN1x1MDYyQiBcdTA2MzRcdTA2MzlcdTA2MjhcdTA2NEFcdTA2MjkgXHUwNjQzXHUwNjJCXHUwNjRBXHUwNjMxXHUwNjI5XHUwNjBDIFx1MDYyQVx1MDYyQVx1MDYzOVx1MDYyQ1x1MDY1MVx1MDYyOCBcdTA2NDVcdTA2NDYgXHUwNjNBXHUwNjMxXHUwNjI3XHUwNjI4XHUwNjJBXHUwNjQ3XHUwNjI3IFx1MDY0OFx1MDYyN1x1MDY0NFx1MDY0Mlx1MDY0OFx1MDY0NVx1MDY0QVx1MDYyOSBcdTA2MjdcdTA2NDRcdTA2NDVcdTA2MzVcdTA2MzFcdTA2NEFcdTA2MjkgXHUwNjI3XHUwNjQ0XHUwNjJFXHUwNjI3XHUwNjM1XHUwNjI5IFx1MDYyN1x1MDY0NFx1MDYyQVx1MDY0QSBcdTA2MkFcdTA2MzlcdTA2NDNcdTA2MzNcdTA2NDdcdTA2MjdcdTA2MEMgXHUwNjI3XHUwNjQ0XHUwNjQ5IFx1MDYyQ1x1MDYyN1x1MDY0Nlx1MDYyOCBcdTA2MjdcdTA2NDRcdTA2MzRcdTA2NEFcdTA2MjEgXHUwNjI3XHUwNjQ0XHUwNjQzXHUwNjJCXHUwNjRBXHUwNjMxIFx1MDY0NVx1MDY0NiBcdTA2MjdcdTA2NDRcdTA2MzlcdTA2NDFcdTA2NDhcdTA2NEFcdTA2MjkgXHUwNjQ4XHUwNjJEXHUwNjQ0XHUwNjI3XHUwNjQ4XHUwNjI5IFx1MDYyN1x1MDY0NFx1MDYzMVx1MDY0OFx1MDYyRC4gXHUwNjQ2XHUwNjM5XHUwNjQ1XHUwNjBDIFx1MDY0Nlx1MDYyRFx1MDY0NiBcdTA2NDJcdTA2MzFcdTA2MjNcdTA2NDZcdTA2MjcgXHUwNjQ4XHUwNjMzXHUwNjQ1XHUwNjM5XHUwNjQ2XHUwNjI3IFx1MDY0OFx1MDYzOVx1MDYzMVx1MDY0MVx1MDY0Nlx1MDYyNyBcdTA2NDNcdTA2NDQgXHUwNjQ3XHUwNjMwXHUwNjI3LiBcdTA2NDRcdTA2NDNcdTA2NDZcdTA2NDcgXHUwNjQ1XHUwNjJEXHUwNjQ0XHUwNjUxIFx1MDYyN1x1MDY0N1x1MDYyQVx1MDY0NVx1MDYyN1x1MDY0NVx1MDY0Nlx1MDYyNyBcdTA2MjdcdTA2NDRcdTA2NEFcdTA2NDhcdTA2NDUgXHUwNjQ0XHUwNjIzXHUwNjMzXHUwNjI4XHUwNjI3XHUwNjI4IFx1MDYzQVx1MDY0QVx1MDYzMSBcdTA2MkFcdTA2NDRcdTA2NDMgXHUwNjI3XHUwNjQ0XHUwNjIzXHUwNjMzXHUwNjI4XHUwNjI3XHUwNjI4LiBcdTA2NDNcdTA2MzBcdTA2NDRcdTA2NDNcdTA2MEMgXHUwNjQxXHUwNjI1XHUwNjQ2XHUwNjQ2XHUwNjI3IFx1MDY0NFx1MDYzOVx1MDYyN1x1MDY0Mlx1MDYyRlx1MDY0OFx1MDY0NiBcdTA2MzlcdTA2MzJcdTA2NDVcdTA2NDZcdTA2MjcgXHUwNjM5XHUwNjQ0XHUwNjQ5IFx1MDYyM1x1MDY0NiBcdTA2NDZcdTA2MkFcdTA2MkNcdTA2MjdcdTA2NDhcdTA2MzIgXHUwNjQyXHUwNjM2XHUwNjRBXHUwNjI5IFx1MDYyN1x1MDY0NFx1MDY0MVx1MDYzNVx1MDYyRFx1MDY0OSBcdTA2NDhcdTA2MjdcdTA2NDRcdTA2MzlcdTA2MjdcdTA2NDVcdTA2NEFcdTA2MjlcdTA2MEMgXHUwNjQ4XHUwNjJCXHUwNjQ2XHUwNjI3XHUwNjI2XHUwNjRBXHUwNjI5IFx1MDYyN1x1MDY0NFx1MDY0Nlx1MDYyRVx1MDYyOFx1MDYyOSBcdTA2NDhcdTA2MjdcdTA2NDRcdTA2MzFcdTA2MzlcdTA2MjdcdTA2MzlcdTA2MEMgXHUwNjI3XHUwNjQ0XHUwNjJBXHUwNjRBIFx1MDY0M1x1MDYyQlx1MDY0QVx1MDYzMVx1MDYyN1x1MDY0QiBcdTA2NDVcdTA2MjcgXHUwNjRBXHUwNjQ2XHUwNjJEXHUwNjQ4IFx1MDY0Nlx1MDYyRFx1MDY0OFx1MDY0N1x1MDYyNyBcdTA2MjdcdTA2NDRcdTA2MkRcdTA2MkZcdTA2NEFcdTA2MkIgXHUwNjM5XHUwNjQ2IFx1MDYyN1x1MDY0NFx1MDY0M1x1MDY0NFx1MDY0NVx1MDYyOSBcdTA2MjdcdTA2NDRcdTA2NDVcdTA2MzBcdTA2NDNcdTA2NDhcdTA2MzFcdTA2MjkuIFx1MDY0OFx1MDY0MVx1MDY0OFx1MDY0MiBcdTA2NDdcdTA2MzBcdTA2MjcgXHUwNjQzXHUwNjQ0XHUwNjQ3XHUwNjBDIFx1MDY0NFx1MDYzM1x1MDY0Nlx1MDYyNyBcdTA2MjhcdTA2MzVcdTA2MkZcdTA2MkYgXHUwNjJBXHUwNjQxXHUwNjMzXHUwNjRBXHUwNjMxIFx1MDY0NVx1MDYzOVx1MDYyN1x1MDY0Nlx1MDY0QSBcIlx1MDYyN1x1MDY0NFx1MDYyOFx1MDYyQVx1MDYyN1x1MDYzOVwiIFx1MDY0M1x1MDY0NVx1MDYyNyBcdTA2MkFcdTA2MjNcdTA2MkFcdTA2NEEgXHUwNjQxXHUwNjRBIFx1MDY0Mlx1MDYzNVx1MDY0QVx1MDYyRlx1MDYyOSBcdTA2MjdcdTA2NDRcdTA2MkRcdTA2MjdcdTA2MkMgXHUwNjIzXHUwNjJEXHUwNjQ1XHUwNjJGIFx1MDY0MVx1MDYyNFx1MDYyN1x1MDYyRiBcdTA2NDZcdTA2MkNcdTA2NDVcdTA2MEMgXHUwNjQ4XHUwNjQ0XHUwNjI3IFx1MDYyN1x1MDY0NFx1MDYyQVx1MDYyRFx1MDYzMFx1MDY0NFx1MDY0MiBcdTA2NDhcdTA2MjdcdTA2NDRcdTA2MkFcdTA2NDFcdTA2MzBcdTA2NDRcdTA2NDMgXHUwNjQxXHUwNjRBIFx1MDYyN1x1MDY0NFx1MDYyM1x1MDY0NFx1MDYzQVx1MDYyN1x1MDYzMiBcdTA2NDhcdTA2MjdcdTA2NDRcdTA2MjNcdTA2MzNcdTA2MzFcdTA2MjdcdTA2MzEgXHUwNjI3XHUwNjQ0XHUwNjQ1XHUwNjQzXHUwNjQ2XHUwNjQ4XHUwNjQ2XHUwNjI5LiBcdTA2NDdcdTA2MzBcdTA2MjcgXHUwNjI3XHUwNjQ0XHUwNjI4XHUwNjJBXHUwNjI3XHUwNjM5IC0gXHUwNjIzXHUwNjQ1IFx1MDY0N1x1MDYzMFx1MDY0NyBcdTA2MjdcdTA2NDRcdTA2MjhcdTA2MkEnLFxuICB0ZXh0RGlyZWN0aW9uOiBUZXh0RGlyZWN0aW9uLlJpZ2h0VG9MZWZ0LFxufTtcblBsYWluUnRsTWVzc2FnZS5zdG9yeSA9IHtcbiAgbmFtZTogJ1BsYWluIFJUTCBNZXNzYWdlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBFbW9qaU1lc3NhZ2VzID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPD5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZSB7Li4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwXHVEODNEXHVERTAwJyB9KX0gLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZVxuICAgICAgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgcHJldmlld3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkb21haW46ICdzaWduYWwub3JnJyxcbiAgICAgICAgICAgIGltYWdlOiBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgICAgICAgIGZpbGVOYW1lOiAndGhlLXNheC5wbmcnLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgICAgICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGlzU3RpY2tlclBhY2s6IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGU6ICdTaWduYWwnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LicsXG4gICAgICAgICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEwKS52YWx1ZU9mKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogJ1x1RDgzRFx1REUwMCcsXG4gICAgICB9KX1cbiAgICAvPlxuICAgIDxiciAvPlxuICAgIDxNZXNzYWdlXG4gICAgICB7Li4uY3JlYXRlUHJvcHMoe1xuICAgICAgICBhdHRhY2htZW50czogW1xuICAgICAgICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgICAgIHVybDogJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICAgICAgICBmaWxlTmFtZTogJ3RpbmEtcm9sZi0yNjkzNDUtdW5zcGxhc2guanBnJyxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9KUEVHLFxuICAgICAgICAgICAgd2lkdGg6IDEyOCxcbiAgICAgICAgICAgIGhlaWdodDogMTI4LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiAnXHVEODNEXHVERTAwJyxcbiAgICAgIH0pfVxuICAgIC8+XG4gICAgPGJyIC8+XG4gICAgPE1lc3NhZ2VcbiAgICAgIHsuLi5jcmVhdGVQcm9wcyh7XG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICAgICAgY29udGVudFR5cGU6IEFVRElPX01QMyxcbiAgICAgICAgICAgIGZpbGVOYW1lOiAnaW5jb21wZXRlY2gtY29tLUFnbnVzLURlaS1YLm1wMycsXG4gICAgICAgICAgICB1cmw6ICcvZml4dHVyZXMvaW5jb21wZXRlY2gtY29tLUFnbnVzLURlaS1YLm1wMycsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6ICdcdUQ4M0RcdURFMDAnLFxuICAgICAgfSl9XG4gICAgLz5cbiAgICA8YnIgLz5cbiAgICA8TWVzc2FnZVxuICAgICAgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgYXR0YWNobWVudHM6IFtcbiAgICAgICAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZSgndGV4dC9wbGFpbicpLFxuICAgICAgICAgICAgZmlsZU5hbWU6ICdteS1yZXN1bWUudHh0JyxcbiAgICAgICAgICAgIHVybDogJ215LXJlc3VtZS50eHQnLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiAnXHVEODNEXHVERTAwJyxcbiAgICAgIH0pfVxuICAgIC8+XG4gICAgPGJyIC8+XG4gICAgPE1lc3NhZ2VcbiAgICAgIHsuLi5jcmVhdGVQcm9wcyh7XG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICAgICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICAgICAgICAgIGZsYWdzOiBTaWduYWxTZXJ2aWNlLkF0dGFjaG1lbnRQb2ludGVyLkZsYWdzLkdJRixcbiAgICAgICAgICAgIGZpbGVOYW1lOiAnY2F0LWdpZi5tcDQnLFxuICAgICAgICAgICAgdXJsOiAnL2ZpeHR1cmVzL2NhdC1naWYubXA0JyxcbiAgICAgICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDMzMixcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogJ1x1RDgzRFx1REUwMCcsXG4gICAgICB9KX1cbiAgICAvPlxuICA8Lz5cbik7XG5cbmV4cG9ydCBjb25zdCBEZWxpdmVyZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRlbGl2ZXJlZC5hcmdzID0ge1xuICBzdGF0dXM6ICdkZWxpdmVyZWQnLFxuICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSBhIHBhbCEgSSBhbSBzZW5kaW5nIGEgbG9uZyBtZXNzYWdlIHNvIHRoYXQgaXQgd2lsbCB3cmFwIGEgYml0LCBzaW5jZSBJIGxpa2UgdGhhdCBsb29rLicsXG59O1xuXG5leHBvcnQgY29uc3QgUmVhZCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuUmVhZC5hcmdzID0ge1xuICBzdGF0dXM6ICdyZWFkJyxcbiAgdGV4dDogJ0hlbGxvIHRoZXJlIGZyb20gYSBwYWwhIEkgYW0gc2VuZGluZyBhIGxvbmcgbWVzc2FnZSBzbyB0aGF0IGl0IHdpbGwgd3JhcCBhIGJpdCwgc2luY2UgSSBsaWtlIHRoYXQgbG9vay4nLFxufTtcblxuZXhwb3J0IGNvbnN0IFNlbmRpbmcgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblNlbmRpbmcuYXJncyA9IHtcbiAgc3RhdHVzOiAnc2VuZGluZycsXG4gIHRleHQ6ICdIZWxsbyB0aGVyZSBmcm9tIGEgcGFsISBJIGFtIHNlbmRpbmcgYSBsb25nIG1lc3NhZ2Ugc28gdGhhdCBpdCB3aWxsIHdyYXAgYSBiaXQsIHNpbmNlIEkgbGlrZSB0aGF0IGxvb2suJyxcbn07XG5cbmV4cG9ydCBjb25zdCBFeHBpcmluZyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRXhwaXJpbmcuYXJncyA9IHtcbiAgZXhwaXJhdGlvbkxlbmd0aDogMzAgKiAxMDAwLFxuICBleHBpcmF0aW9uVGltZXN0YW1wOiBEYXRlLm5vdygpICsgMzAgKiAxMDAwLFxuICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSBhIHBhbCEgSSBhbSBzZW5kaW5nIGEgbG9uZyBtZXNzYWdlIHNvIHRoYXQgaXQgd2lsbCB3cmFwIGEgYml0LCBzaW5jZSBJIGxpa2UgdGhhdCBsb29rLicsXG59O1xuXG5leHBvcnQgY29uc3QgV2lsbEV4cGlyZUJ1dFN0aWxsU2VuZGluZyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuV2lsbEV4cGlyZUJ1dFN0aWxsU2VuZGluZy5hcmdzID0ge1xuICBzdGF0dXM6ICdzZW5kaW5nJyxcbiAgZXhwaXJhdGlvbkxlbmd0aDogMzAgKiAxMDAwLFxuICB0ZXh0OiAnV2UgYWx3YXlzIHNob3cgdGhlIHRpbWVyIGlmIGEgbWVzc2FnZSBoYXMgYW4gZXhwaXJhdGlvbiBsZW5ndGgsIGV2ZW4gaWYgdW5yZWFkIG9yIHN0aWxsIHNlbmRpbmcuJyxcbn07XG5XaWxsRXhwaXJlQnV0U3RpbGxTZW5kaW5nLnN0b3J5ID0ge1xuICBuYW1lOiAnV2lsbCBleHBpcmUgYnV0IHN0aWxsIHNlbmRpbmcnLFxufTtcblxuZXhwb3J0IGNvbnN0IFBlbmRpbmcgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblBlbmRpbmcuYXJncyA9IHtcbiAgdGV4dDogJ0hlbGxvIHRoZXJlIGZyb20gYSBwYWwhIEkgYW0gc2VuZGluZyBhIGxvbmcgbWVzc2FnZSBzbyB0aGF0IGl0IHdpbGwgd3JhcCBhIGJpdCwgc2luY2UgSSBsaWtlIHRoYXQgbG9vay4nLFxuICB0ZXh0QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBMT05HX01FU1NBR0UsXG4gICAgc2l6ZTogMTIzLFxuICAgIHBlbmRpbmc6IHRydWUsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTG9uZ0JvZHlDYW5CZURvd25sb2FkZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxvbmdCb2R5Q2FuQmVEb3dubG9hZGVkLmFyZ3MgPSB7XG4gIHRleHQ6ICdIZWxsbyB0aGVyZSBmcm9tIGEgcGFsISBJIGFtIHNlbmRpbmcgYSBsb25nIG1lc3NhZ2Ugc28gdGhhdCBpdCB3aWxsIHdyYXAgYSBiaXQsIHNpbmNlIEkgbGlrZSB0aGF0IGxvb2suJyxcbiAgdGV4dEF0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogTE9OR19NRVNTQUdFLFxuICAgIHNpemU6IDEyMyxcbiAgICBwZW5kaW5nOiBmYWxzZSxcbiAgICBlcnJvcjogdHJ1ZSxcbiAgICBkaWdlc3Q6ICdhYmMnLFxuICAgIGtleTogJ2RlZicsXG4gIH0sXG59O1xuTG9uZ0JvZHlDYW5CZURvd25sb2FkZWQuc3RvcnkgPSB7XG4gIG5hbWU6ICdMb25nIGJvZHkgY2FuIGJlIGRvd25sb2FkZWQnLFxufTtcblxuZXhwb3J0IGNvbnN0IFJlY2VudCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuUmVjZW50LmFyZ3MgPSB7XG4gIHRleHQ6ICdIZWxsbyB0aGVyZSBmcm9tIGEgcGFsIScsXG4gIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDMwICogNjAgKiAxMDAwLFxufTtcblxuZXhwb3J0IGNvbnN0IE9sZGVyID0gVGVtcGxhdGUuYmluZCh7fSk7XG5PbGRlci5hcmdzID0ge1xuICB0ZXh0OiAnSGVsbG8gdGhlcmUgZnJvbSBhIHBhbCEnLFxuICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxODAgKiAyNCAqIDYwICogNjAgKiAxMDAwLFxufTtcblxuZXhwb3J0IGNvbnN0IFJlYWN0aW9uc1dpZGVyTWVzc2FnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuUmVhY3Rpb25zV2lkZXJNZXNzYWdlLmFyZ3MgPSB7XG4gIHRleHQ6ICdIZWxsbyB0aGVyZSBmcm9tIGEgcGFsIScsXG4gIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDE4MCAqIDI0ICogNjAgKiA2MCAqIDEwMDAsXG4gIHJlYWN0aW9uczogW1xuICAgIHtcbiAgICAgIGVtb2ppOiAnXHVEODNEXHVEQzREJyxcbiAgICAgIGZyb206IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICBpc01lOiB0cnVlLFxuICAgICAgICBpZDogJysxNDE1NTU1MjY3MicsXG4gICAgICAgIHBob25lTnVtYmVyOiAnKzE0MTU1NTUyNjcyJyxcbiAgICAgICAgbmFtZTogJ01lJyxcbiAgICAgICAgdGl0bGU6ICdNZScsXG4gICAgICB9KSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDEwLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNEQnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjcyJyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzInLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMTAsXG4gICAgfSxcbiAgICB7XG4gICAgICBlbW9qaTogJ1x1RDgzRFx1REM0RCcsXG4gICAgICBmcm9tOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgaWQ6ICcrMTQxNTU1NTI2NzMnLFxuICAgICAgICBwaG9uZU51bWJlcjogJysxNDE1NTU1MjY3MycsXG4gICAgICAgIG5hbWU6ICdBbWVsaWEgQnJpZ2dzJyxcbiAgICAgICAgdGl0bGU6ICdBbWVsaWEnLFxuICAgICAgfSksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxMCxcbiAgICB9LFxuICAgIHtcbiAgICAgIGVtb2ppOiAnXHVEODNEXHVERTAyJyxcbiAgICAgIGZyb206IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICBpZDogJysxNDE1NTU1MjY3NCcsXG4gICAgICAgIHBob25lTnVtYmVyOiAnKzE0MTU1NTUyNjc0JyxcbiAgICAgICAgbmFtZTogJ0FtZWxpYSBCcmlnZ3MnLFxuICAgICAgICB0aXRsZTogJ0FtZWxpYScsXG4gICAgICB9KSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDEwLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURFMjEnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjc3JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzcnLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMTAsXG4gICAgfSxcbiAgICB7XG4gICAgICBlbW9qaTogJ1x1RDgzRFx1REM0RScsXG4gICAgICBmcm9tOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgICAgaWQ6ICcrMTQxNTU1NTI2NzgnLFxuICAgICAgICBwaG9uZU51bWJlcjogJysxNDE1NTU1MjY3OCcsXG4gICAgICAgIG5hbWU6ICdBbWVsaWEgQnJpZ2dzJyxcbiAgICAgICAgdGl0bGU6ICdBbWVsaWEnLFxuICAgICAgfSksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxMCxcbiAgICB9LFxuICAgIHtcbiAgICAgIGVtb2ppOiAnXHUyNzY0XHVGRTBGJyxcbiAgICAgIGZyb206IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgICBpZDogJysxNDE1NTU1MjY3OScsXG4gICAgICAgIHBob25lTnVtYmVyOiAnKzE0MTU1NTUyNjc5JyxcbiAgICAgICAgbmFtZTogJ0FtZWxpYSBCcmlnZ3MnLFxuICAgICAgICB0aXRsZTogJ0FtZWxpYScsXG4gICAgICB9KSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDEwLFxuICAgIH0sXG4gIF0sXG59O1xuUmVhY3Rpb25zV2lkZXJNZXNzYWdlLnN0b3J5ID0ge1xuICBuYW1lOiAnUmVhY3Rpb25zICh3aWRlciBtZXNzYWdlKScsXG59O1xuXG5jb25zdCBqb3lSZWFjdGlvbnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1MiB9LCAoKSA9PiBnZXRKb3lSZWFjdGlvbigpKTtcblxuZXhwb3J0IGNvbnN0IFJlYWN0aW9uc1Nob3J0TWVzc2FnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuUmVhY3Rpb25zU2hvcnRNZXNzYWdlLmFyZ3MgPSB7XG4gIHRleHQ6ICdoJyxcbiAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICByZWFjdGlvbnM6IFtcbiAgICAuLi5qb3lSZWFjdGlvbnMsXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNEQnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlzTWU6IHRydWUsXG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjcyJyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzInLFxuICAgICAgICBuYW1lOiAnTWUnLFxuICAgICAgICB0aXRsZTogJ01lJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNEQnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjcyJyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzInLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNEQnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjczJyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzMnLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURFMjEnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjc3JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzcnLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNEUnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjc4JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzgnLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gICAge1xuICAgICAgZW1vamk6ICdcdTI3NjRcdUZFMEYnLFxuICAgICAgZnJvbTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICAgIGlkOiAnKzE0MTU1NTUyNjc5JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcrMTQxNTU1NTI2NzknLFxuICAgICAgICBuYW1lOiAnQW1lbGlhIEJyaWdncycsXG4gICAgICAgIHRpdGxlOiAnQW1lbGlhJyxcbiAgICAgIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIF0sXG59O1xuXG5SZWFjdGlvbnNTaG9ydE1lc3NhZ2Uuc3RvcnkgPSB7XG4gIG5hbWU6ICdSZWFjdGlvbnMgKHNob3J0IG1lc3NhZ2UpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBBdmF0YXJJbkdyb3VwID0gVGVtcGxhdGUuYmluZCh7fSk7XG5BdmF0YXJJbkdyb3VwLmFyZ3MgPSB7XG4gIGF1dGhvcjogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7IGF2YXRhclBhdGg6IHBuZ1VybCB9KSxcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdIZWxsbyBpdCBpcyBtZSwgdGhlIHNheG9waG9uZS4nLFxufTtcbkF2YXRhckluR3JvdXAuc3RvcnkgPSB7XG4gIG5hbWU6ICdBdmF0YXIgaW4gR3JvdXAnLFxufTtcblxuZXhwb3J0IGNvbnN0IEJhZGdlSW5Hcm91cCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuQmFkZ2VJbkdyb3VwLmFyZ3MgPSB7XG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG4gIGdldFByZWZlcnJlZEJhZGdlOiAoKSA9PiBnZXRGYWtlQmFkZ2UoKSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdIZWxsbyBpdCBpcyBtZSwgdGhlIHNheG9waG9uZS4nLFxufTtcbkJhZGdlSW5Hcm91cC5zdG9yeSA9IHtcbiAgbmFtZTogJ0JhZGdlIGluIEdyb3VwJyxcbn07XG5cbmV4cG9ydCBjb25zdCBTdGlja2VyID0gVGVtcGxhdGUuYmluZCh7fSk7XG5TdGlja2VyLmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiAnL2ZpeHR1cmVzLzUxMng1MTUtdGh1bWJzLXVwLWxpbmNvbG4ud2VicCcsXG4gICAgICBmaWxlTmFtZTogJzUxMng1MTUtdGh1bWJzLXVwLWxpbmNvbG4ud2VicCcsXG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfV0VCUCxcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDEyOCxcbiAgICB9KSxcbiAgXSxcbiAgaXNTdGlja2VyOiB0cnVlLFxuICBzdGF0dXM6ICdzZW50Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBEZWxldGVkID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgcHJvcHNTZW50ID0gY3JlYXRlUHJvcHMoe1xuICAgIGNvbnZlcnNhdGlvblR5cGU6ICdkaXJlY3QnLFxuICAgIGRlbGV0ZWRGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgICBzdGF0dXM6ICdzZW50JyxcbiAgfSk7XG4gIGNvbnN0IHByb3BzU2VuZGluZyA9IGNyZWF0ZVByb3BzKHtcbiAgICBjb252ZXJzYXRpb25UeXBlOiAnZGlyZWN0JyxcbiAgICBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgc3RhdHVzOiAnc2VuZGluZycsXG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtyZW5kZXJCb3RoRGlyZWN0aW9ucyhwcm9wc1NlbnQpfVxuICAgICAge3JlbmRlckJvdGhEaXJlY3Rpb25zKHByb3BzU2VuZGluZyl9XG4gICAgPC8+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgRGVsZXRlZFdpdGhFeHBpcmVUaW1lciA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGVsZXRlZFdpdGhFeHBpcmVUaW1lci5hcmdzID0ge1xuICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSA2MCAqIDEwMDAsXG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG4gIGRlbGV0ZWRGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgZXhwaXJhdGlvbkxlbmd0aDogNSAqIDYwICogMTAwMCxcbiAgZXhwaXJhdGlvblRpbWVzdGFtcDogRGF0ZS5ub3coKSArIDMgKiA2MCAqIDEwMDAsXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcbkRlbGV0ZWRXaXRoRXhwaXJlVGltZXIuc3RvcnkgPSB7XG4gIG5hbWU6ICdEZWxldGVkIHdpdGggZXhwaXJlVGltZXInLFxufTtcblxuZXhwb3J0IGNvbnN0IERlbGV0ZWRXaXRoRXJyb3IgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wc1BhcnRpYWxFcnJvciA9IGNyZWF0ZVByb3BzKHtcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSA2MCAqIDEwMDAsXG4gICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgICBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgc3RhdHVzOiAncGFydGlhbC1zZW50JyxcbiAgICBkaXJlY3Rpb246ICdvdXRnb2luZycsXG4gIH0pO1xuICBjb25zdCBwcm9wc0Vycm9yID0gY3JlYXRlUHJvcHMoe1xuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDYwICogMTAwMCxcbiAgICBjYW5EZWxldGVGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICAgIGRlbGV0ZWRGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7cmVuZGVyVGhyZWUocHJvcHNQYXJ0aWFsRXJyb3IpfVxuICAgICAge3JlbmRlclRocmVlKHByb3BzRXJyb3IpfVxuICAgIDwvPlxuICApO1xufTtcbkRlbGV0ZWRXaXRoRXJyb3Iuc3RvcnkgPSB7XG4gIG5hbWU6ICdEZWxldGVkIHdpdGggZXJyb3InLFxufTtcblxuZXhwb3J0IGNvbnN0IENhbkRlbGV0ZUZvckV2ZXJ5b25lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5DYW5EZWxldGVGb3JFdmVyeW9uZS5hcmdzID0ge1xuICBzdGF0dXM6ICdyZWFkJyxcbiAgdGV4dDogJ0kgaG9wZSB5b3UgZ2V0IHRoaXMuJyxcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbn07XG5DYW5EZWxldGVGb3JFdmVyeW9uZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0NhbiBkZWxldGUgZm9yIGV2ZXJ5b25lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBFcnJvciA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRXJyb3IuYXJncyA9IHtcbiAgc3RhdHVzOiAnZXJyb3InLFxuICBjYW5SZXRyeTogdHJ1ZSxcbiAgdGV4dDogJ0kgaG9wZSB5b3UgZ2V0IHRoaXMuJyxcbn07XG5cbmV4cG9ydCBjb25zdCBQYXVzZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblBhdXNlZC5hcmdzID0ge1xuICBzdGF0dXM6ICdwYXVzZWQnLFxuICB0ZXh0OiAnSSBhbSB1cCB0byBhIGNoYWxsZW5nZScsXG59O1xuXG5leHBvcnQgY29uc3QgUGFydGlhbFNlbmQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblBhcnRpYWxTZW5kLmFyZ3MgPSB7XG4gIHN0YXR1czogJ3BhcnRpYWwtc2VudCcsXG4gIHRleHQ6ICdJIGhvcGUgeW91IGdldCB0aGlzLicsXG59O1xuXG5leHBvcnQgY29uc3QgTGlua1ByZXZpZXdJbkdyb3VwID0gVGVtcGxhdGUuYmluZCh7fSk7XG5MaW5rUHJldmlld0luR3JvdXAuYXJncyA9IHtcbiAgcHJldmlld3M6IFtcbiAgICB7XG4gICAgICBkb21haW46ICdzaWduYWwub3JnJyxcbiAgICAgIGltYWdlOiBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgIGZpbGVOYW1lOiAndGhlLXNheC5wbmcnLFxuICAgICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICB9KSxcbiAgICAgIGlzU3RpY2tlclBhY2s6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdTaWduYWwnLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LicsXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEwKS52YWx1ZU9mKCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG59O1xuTGlua1ByZXZpZXdJbkdyb3VwLnN0b3J5ID0ge1xuICBuYW1lOiAnTGluayBQcmV2aWV3IGluIEdyb3VwJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rUHJldmlld1dpdGhRdW90ZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTGlua1ByZXZpZXdXaXRoUXVvdGUuYXJncyA9IHtcbiAgcXVvdGU6IHtcbiAgICBjb252ZXJzYXRpb25Db2xvcjogQ29udmVyc2F0aW9uQ29sb3JzWzJdLFxuICAgIHRleHQ6ICdUaGUgcXVvdGVkIG1lc3NhZ2UnLFxuICAgIGlzRnJvbU1lOiBmYWxzZSxcbiAgICBzZW50QXQ6IERhdGUubm93KCksXG4gICAgYXV0aG9ySWQ6ICdzb21lLWlkJyxcbiAgICBhdXRob3JUaXRsZTogJ1NvbWVvbmUnLFxuICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IGZhbHNlLFxuICAgIGlzVmlld09uY2U6IGZhbHNlLFxuICAgIGlzR2lmdEJhZGdlOiBmYWxzZSxcbiAgfSxcbiAgcHJldmlld3M6IFtcbiAgICB7XG4gICAgICBkb21haW46ICdzaWduYWwub3JnJyxcbiAgICAgIGltYWdlOiBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgIGZpbGVOYW1lOiAndGhlLXNheC5wbmcnLFxuICAgICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICB9KSxcbiAgICAgIGlzU3RpY2tlclBhY2s6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdTaWduYWwnLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LicsXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEwKS52YWx1ZU9mKCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG59O1xuTGlua1ByZXZpZXdXaXRoUXVvdGUuc3RvcnkgPSB7XG4gIG5hbWU6ICdMaW5rIFByZXZpZXcgd2l0aCBRdW90ZScsXG59O1xuXG5leHBvcnQgY29uc3QgTGlua1ByZXZpZXdXaXRoU21hbGxJbWFnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTGlua1ByZXZpZXdXaXRoU21hbGxJbWFnZS5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaW1hZ2U6IGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICAgICAgZmlsZU5hbWU6ICd0aGUtc2F4LnBuZycsXG4gICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgIHVybDogcG5nVXJsLFxuICAgICAgICB3aWR0aDogNTAsXG4gICAgICB9KSxcbiAgICAgIGlzU3RpY2tlclBhY2s6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdTaWduYWwnLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LicsXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEwKS52YWx1ZU9mKCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG59O1xuTGlua1ByZXZpZXdXaXRoU21hbGxJbWFnZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0xpbmsgUHJldmlldyB3aXRoIFNtYWxsIEltYWdlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rUHJldmlld1dpdGhvdXRJbWFnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTGlua1ByZXZpZXdXaXRob3V0SW1hZ2UuYXJncyA9IHtcbiAgcHJldmlld3M6IFtcbiAgICB7XG4gICAgICBkb21haW46ICdzaWduYWwub3JnJyxcbiAgICAgIGlzU3RpY2tlclBhY2s6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdTaWduYWwnLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LicsXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEwKS52YWx1ZU9mKCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG59O1xuTGlua1ByZXZpZXdXaXRob3V0SW1hZ2Uuc3RvcnkgPSB7XG4gIG5hbWU6ICdMaW5rIFByZXZpZXcgd2l0aG91dCBJbWFnZScsXG59O1xuXG5leHBvcnQgY29uc3QgTGlua1ByZXZpZXdXaXRoTm9EZXNjcmlwdGlvbiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTGlua1ByZXZpZXdXaXRoTm9EZXNjcmlwdGlvbi5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaXNTdGlja2VyUGFjazogZmFsc2UsXG4gICAgICB0aXRsZTogJ1NpZ25hbCcsXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IERhdGUubm93KCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG59O1xuTGlua1ByZXZpZXdXaXRoTm9EZXNjcmlwdGlvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0xpbmsgUHJldmlldyB3aXRoIG5vIGRlc2NyaXB0aW9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rUHJldmlld1dpdGhMb25nRGVzY3JpcHRpb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxpbmtQcmV2aWV3V2l0aExvbmdEZXNjcmlwdGlvbi5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaXNTdGlja2VyUGFjazogZmFsc2UsXG4gICAgICB0aXRsZTogJ1NpZ25hbCcsXG4gICAgICBkZXNjcmlwdGlvbjogQXJyYXkoMTApXG4gICAgICAgIC5maWxsKFxuICAgICAgICAgICdTYXkgXCJoZWxsb1wiIHRvIGEgZGlmZmVyZW50IG1lc3NhZ2luZyBleHBlcmllbmNlLiBBbiB1bmV4cGVjdGVkIGZvY3VzIG9uIHByaXZhY3ksIGNvbWJpbmVkIHdpdGggYWxsIG9mIHRoZSBmZWF0dXJlcyB5b3UgZXhwZWN0LidcbiAgICAgICAgKVxuICAgICAgICAuam9pbignICcpLFxuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG4gICAgICBkYXRlOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxuICB0ZXh0OiAnQmUgc3VyZSB0byBsb29rIGF0IGh0dHBzOi8vd3d3LnNpZ25hbC5vcmcnLFxufTtcbkxpbmtQcmV2aWV3V2l0aExvbmdEZXNjcmlwdGlvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0xpbmsgUHJldmlldyB3aXRoIGxvbmcgZGVzY3JpcHRpb24nLFxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtQcmV2aWV3V2l0aFNtYWxsSW1hZ2VMb25nRGVzY3JpcHRpb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxpbmtQcmV2aWV3V2l0aFNtYWxsSW1hZ2VMb25nRGVzY3JpcHRpb24uYXJncyA9IHtcbiAgcHJldmlld3M6IFtcbiAgICB7XG4gICAgICBkb21haW46ICdzaWduYWwub3JnJyxcbiAgICAgIGltYWdlOiBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgIGZpbGVOYW1lOiAndGhlLXNheC5wbmcnLFxuICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICB1cmw6IHBuZ1VybCxcbiAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgfSksXG4gICAgICBpc1N0aWNrZXJQYWNrOiBmYWxzZSxcbiAgICAgIHRpdGxlOiAnU2lnbmFsJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBBcnJheSgxMClcbiAgICAgICAgLmZpbGwoXG4gICAgICAgICAgJ1NheSBcImhlbGxvXCIgdG8gYSBkaWZmZXJlbnQgbWVzc2FnaW5nIGV4cGVyaWVuY2UuIEFuIHVuZXhwZWN0ZWQgZm9jdXMgb24gcHJpdmFjeSwgY29tYmluZWQgd2l0aCBhbGwgb2YgdGhlIGZlYXR1cmVzIHlvdSBleHBlY3QuJ1xuICAgICAgICApXG4gICAgICAgIC5qb2luKCcgJyksXG4gICAgICB1cmw6ICdodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgICAgIGRhdGU6IERhdGUubm93KCksXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG59O1xuTGlua1ByZXZpZXdXaXRoU21hbGxJbWFnZUxvbmdEZXNjcmlwdGlvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0xpbmsgUHJldmlldyB3aXRoIHNtYWxsIGltYWdlLCBsb25nIGRlc2NyaXB0aW9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rUHJldmlld1dpdGhOb0RhdGUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxpbmtQcmV2aWV3V2l0aE5vRGF0ZS5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaW1hZ2U6IGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICAgICAgZmlsZU5hbWU6ICd0aGUtc2F4LnBuZycsXG4gICAgICAgIGhlaWdodDogMjQwLFxuICAgICAgICB1cmw6IHBuZ1VybCxcbiAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgIH0pLFxuICAgICAgaXNTdGlja2VyUGFjazogZmFsc2UsXG4gICAgICB0aXRsZTogJ1NpZ25hbCcsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1NheSBcImhlbGxvXCIgdG8gYSBkaWZmZXJlbnQgbWVzc2FnaW5nIGV4cGVyaWVuY2UuIEFuIHVuZXhwZWN0ZWQgZm9jdXMgb24gcHJpdmFjeSwgY29tYmluZWQgd2l0aCBhbGwgb2YgdGhlIGZlYXR1cmVzIHlvdSBleHBlY3QuJyxcbiAgICAgIHVybDogJ2h0dHBzOi8vd3d3LnNpZ25hbC5vcmcnLFxuICAgIH0sXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxuICB0ZXh0OiAnQmUgc3VyZSB0byBsb29rIGF0IGh0dHBzOi8vd3d3LnNpZ25hbC5vcmcnLFxufTtcbkxpbmtQcmV2aWV3V2l0aE5vRGF0ZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0xpbmsgUHJldmlldyB3aXRoIG5vIGRhdGUnLFxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtQcmV2aWV3V2l0aFRvb05ld0FEYXRlID0gVGVtcGxhdGUuYmluZCh7fSk7XG5MaW5rUHJldmlld1dpdGhUb29OZXdBRGF0ZS5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaW1hZ2U6IGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICAgICAgZmlsZU5hbWU6ICd0aGUtc2F4LnBuZycsXG4gICAgICAgIGhlaWdodDogMjQwLFxuICAgICAgICB1cmw6IHBuZ1VybCxcbiAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgIH0pLFxuICAgICAgaXNTdGlja2VyUGFjazogZmFsc2UsXG4gICAgICB0aXRsZTogJ1NpZ25hbCcsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1NheSBcImhlbGxvXCIgdG8gYSBkaWZmZXJlbnQgbWVzc2FnaW5nIGV4cGVyaWVuY2UuIEFuIHVuZXhwZWN0ZWQgZm9jdXMgb24gcHJpdmFjeSwgY29tYmluZWQgd2l0aCBhbGwgb2YgdGhlIGZlYXR1cmVzIHlvdSBleHBlY3QuJyxcbiAgICAgIHVybDogJ2h0dHBzOi8vd3d3LnNpZ25hbC5vcmcnLFxuICAgICAgZGF0ZTogRGF0ZS5ub3coKSArIDMwMDAwMDAwMDAsXG4gICAgfSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdCZSBzdXJlIHRvIGxvb2sgYXQgaHR0cHM6Ly93d3cuc2lnbmFsLm9yZycsXG59O1xuTGlua1ByZXZpZXdXaXRoVG9vTmV3QURhdGUuc3RvcnkgPSB7XG4gIG5hbWU6ICdMaW5rIFByZXZpZXcgd2l0aCB0b28gbmV3IGEgZGF0ZScsXG59O1xuXG5leHBvcnQgY29uc3QgSW1hZ2UgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBkYXJrSW1hZ2VQcm9wcyA9IGNyZWF0ZVByb3BzKHtcbiAgICBhdHRhY2htZW50czogW1xuICAgICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICB1cmw6ICcvZml4dHVyZXMvdGluYS1yb2xmLTI2OTM0NS11bnNwbGFzaC5qcGcnLFxuICAgICAgICBmaWxlTmFtZTogJ3RpbmEtcm9sZi0yNjkzNDUtdW5zcGxhc2guanBnJyxcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgIHdpZHRoOiAxMjgsXG4gICAgICAgIGhlaWdodDogMTI4LFxuICAgICAgfSksXG4gICAgXSxcbiAgICBzdGF0dXM6ICdzZW50JyxcbiAgfSk7XG4gIGNvbnN0IGxpZ2h0SW1hZ2VQcm9wcyA9IGNyZWF0ZVByb3BzKHtcbiAgICBhdHRhY2htZW50czogW1xuICAgICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICB1cmw6IHBuZ1VybCxcbiAgICAgICAgZmlsZU5hbWU6ICd0aGUtc2F4LnBuZycsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgIGhlaWdodDogMjQwLFxuICAgICAgICB3aWR0aDogMzIwLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBzdGF0dXM6ICdzZW50JyxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3JlbmRlckJvdGhEaXJlY3Rpb25zKGRhcmtJbWFnZVByb3BzKX1cbiAgICAgIHtyZW5kZXJCb3RoRGlyZWN0aW9ucyhsaWdodEltYWdlUHJvcHMpfVxuICAgIDwvPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpcGxlSW1hZ2VzMiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTXVsdGlwbGVJbWFnZXMyLmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpcGxlSW1hZ2VzMyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTXVsdGlwbGVJbWFnZXMzLmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpcGxlSW1hZ2VzNCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTXVsdGlwbGVJbWFnZXM0LmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpcGxlSW1hZ2VzNSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTXVsdGlwbGVJbWFnZXM1LmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgdXJsOiBwbmdVcmwsXG4gICAgICBmaWxlTmFtZTogJ3RoZS1zYXgucG5nJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDI0MCxcbiAgICAgIHdpZHRoOiAzMjAsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlV2l0aENhcHRpb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkltYWdlV2l0aENhcHRpb24uYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICB1cmw6ICcvZml4dHVyZXMvdGluYS1yb2xmLTI2OTM0NS11bnNwbGFzaC5qcGcnLFxuICAgICAgZmlsZU5hbWU6ICd0aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDEyOCxcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdUaGlzIGlzIG15IGhvbWUuJyxcbn07XG5JbWFnZVdpdGhDYXB0aW9uLnN0b3J5ID0ge1xuICBuYW1lOiAnSW1hZ2Ugd2l0aCBDYXB0aW9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBHaWYgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdpZi5hcmdzID0ge1xuICBhdHRhY2htZW50czogW1xuICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgIGNvbnRlbnRUeXBlOiBWSURFT19NUDQsXG4gICAgICBmbGFnczogU2lnbmFsU2VydmljZS5BdHRhY2htZW50UG9pbnRlci5GbGFncy5HSUYsXG4gICAgICBmaWxlTmFtZTogJ2NhdC1naWYubXA0JyxcbiAgICAgIHVybDogJy9maXh0dXJlcy9jYXQtZ2lmLm1wNCcsXG4gICAgICB3aWR0aDogNDAwLFxuICAgICAgaGVpZ2h0OiAzMzIsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcbkdpZi5zdG9yeSA9IHtcbiAgbmFtZTogJ0dJRicsXG59O1xuXG5leHBvcnQgY29uc3QgR2lmSW5BR3JvdXAgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdpZkluQUdyb3VwLmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICAgIGZsYWdzOiBTaWduYWxTZXJ2aWNlLkF0dGFjaG1lbnRQb2ludGVyLkZsYWdzLkdJRixcbiAgICAgIGZpbGVOYW1lOiAnY2F0LWdpZi5tcDQnLFxuICAgICAgdXJsOiAnL2ZpeHR1cmVzL2NhdC1naWYubXA0JyxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMzMixcbiAgICB9KSxcbiAgXSxcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuR2lmSW5BR3JvdXAuc3RvcnkgPSB7XG4gIG5hbWU6ICdHSUYgaW4gYSBncm91cCcsXG59O1xuXG5leHBvcnQgY29uc3QgTm90RG93bmxvYWRlZEdpZiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTm90RG93bmxvYWRlZEdpZi5hcmdzID0ge1xuICBhdHRhY2htZW50czogW1xuICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgIGNvbnRlbnRUeXBlOiBWSURFT19NUDQsXG4gICAgICBmbGFnczogU2lnbmFsU2VydmljZS5BdHRhY2htZW50UG9pbnRlci5GbGFncy5HSUYsXG4gICAgICBmaWxlTmFtZTogJ2NhdC1naWYubXA0JyxcbiAgICAgIGZpbGVTaXplOiAnMTg4LjYxIEtCJyxcbiAgICAgIGJsdXJIYXNoOiAnTERBLEZEQm5tK0k9cHt0a0lVSTt+VWtwRUxWXScsXG4gICAgICB3aWR0aDogNDAwLFxuICAgICAgaGVpZ2h0OiAzMzIsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcbk5vdERvd25sb2FkZWRHaWYuc3RvcnkgPSB7XG4gIG5hbWU6ICdOb3QgRG93bmxvYWRlZCBHSUYnLFxufTtcblxuZXhwb3J0IGNvbnN0IFBlbmRpbmdHaWYgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblBlbmRpbmdHaWYuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICAgIGZsYWdzOiBTaWduYWxTZXJ2aWNlLkF0dGFjaG1lbnRQb2ludGVyLkZsYWdzLkdJRixcbiAgICAgIGZpbGVOYW1lOiAnY2F0LWdpZi5tcDQnLFxuICAgICAgZmlsZVNpemU6ICcxODguNjEgS0InLFxuICAgICAgYmx1ckhhc2g6ICdMREEsRkRCbm0rST1we3RrSVVJO35Va3BFTFZdJyxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMzMixcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuUGVuZGluZ0dpZi5zdG9yeSA9IHtcbiAgbmFtZTogJ1BlbmRpbmcgR0lGJyxcbn07XG5cbmV4cG9ydCBjb25zdCBfQXVkaW8gPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBXcmFwcGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IFtpc1BsYXllZCwgc2V0SXNQbGF5ZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgY29uc3QgbWVzc2FnZVByb3BzID0gY3JlYXRlUHJvcHMoe1xuICAgICAgYXR0YWNobWVudHM6IFtcbiAgICAgICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICAgIGNvbnRlbnRUeXBlOiBBVURJT19NUDMsXG4gICAgICAgICAgZmlsZU5hbWU6ICdpbmNvbXBldGVjaC1jb20tQWdudXMtRGVpLVgubXAzJyxcbiAgICAgICAgICB1cmw6ICcvZml4dHVyZXMvaW5jb21wZXRlY2gtY29tLUFnbnVzLURlaS1YLm1wMycsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIC4uLihpc1BsYXllZFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHN0YXR1czogJ3ZpZXdlZCcsXG4gICAgICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlZpZXdlZCxcbiAgICAgICAgICB9XG4gICAgICAgIDoge1xuICAgICAgICAgICAgc3RhdHVzOiAncmVhZCcsXG4gICAgICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgICAgfSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPD5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHNldElzUGxheWVkKG9sZCA9PiAhb2xkKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMmVtJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgVG9nZ2xlIHBsYXllZFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAge3JlbmRlckJvdGhEaXJlY3Rpb25zKG1lc3NhZ2VQcm9wcyl9XG4gICAgICA8Lz5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiA8V3JhcHBlciAvPjtcbn07XG5cbmV4cG9ydCBjb25zdCBMb25nQXVkaW8gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxvbmdBdWRpby5hcmdzID0ge1xuICBhdHRhY2htZW50czogW1xuICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgIGNvbnRlbnRUeXBlOiBBVURJT19NUDMsXG4gICAgICBmaWxlTmFtZTogJ2xvbmctYXVkaW8ubXAzJyxcbiAgICAgIHVybDogJy9maXh0dXJlcy9sb25nLWF1ZGlvLm1wMycsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IEF1ZGlvV2l0aENhcHRpb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkF1ZGlvV2l0aENhcHRpb24uYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogQVVESU9fTVAzLFxuICAgICAgZmlsZU5hbWU6ICdpbmNvbXBldGVjaC1jb20tQWdudXMtRGVpLVgubXAzJyxcbiAgICAgIHVybDogJy9maXh0dXJlcy9pbmNvbXBldGVjaC1jb20tQWdudXMtRGVpLVgubXAzJyxcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdUaGlzIGlzIHdoYXQgSSBzb3VuZCBsaWtlLicsXG59O1xuQXVkaW9XaXRoQ2FwdGlvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0F1ZGlvIHdpdGggQ2FwdGlvbicsXG59O1xuXG5leHBvcnQgY29uc3QgQXVkaW9XaXRoTm90RG93bmxvYWRlZEF0dGFjaG1lbnQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkF1ZGlvV2l0aE5vdERvd25sb2FkZWRBdHRhY2htZW50LmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgY29udGVudFR5cGU6IEFVRElPX01QMyxcbiAgICAgIGZpbGVOYW1lOiAnaW5jb21wZXRlY2gtY29tLUFnbnVzLURlaS1YLm1wMycsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcbkF1ZGlvV2l0aE5vdERvd25sb2FkZWRBdHRhY2htZW50LnN0b3J5ID0ge1xuICBuYW1lOiAnQXVkaW8gd2l0aCBOb3QgRG93bmxvYWRlZCBBdHRhY2htZW50Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBBdWRpb1dpdGhQZW5kaW5nQXR0YWNobWVudCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuQXVkaW9XaXRoUGVuZGluZ0F0dGFjaG1lbnQuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogQVVESU9fTVAzLFxuICAgICAgZmlsZU5hbWU6ICdpbmNvbXBldGVjaC1jb20tQWdudXMtRGVpLVgubXAzJyxcbiAgICAgIHBlbmRpbmc6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcbkF1ZGlvV2l0aFBlbmRpbmdBdHRhY2htZW50LnN0b3J5ID0ge1xuICBuYW1lOiAnQXVkaW8gd2l0aCBQZW5kaW5nIEF0dGFjaG1lbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IE90aGVyRmlsZVR5cGUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk90aGVyRmlsZVR5cGUuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZSgndGV4dC9wbGFpbicpLFxuICAgICAgZmlsZU5hbWU6ICdteS1yZXN1bWUudHh0JyxcbiAgICAgIHVybDogJ215LXJlc3VtZS50eHQnLFxuICAgICAgZmlsZVNpemU6ICcxME1CJyxcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuXG5leHBvcnQgY29uc3QgT3RoZXJGaWxlVHlwZVdpdGhDYXB0aW9uID0gVGVtcGxhdGUuYmluZCh7fSk7XG5PdGhlckZpbGVUeXBlV2l0aENhcHRpb24uYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZSgndGV4dC9wbGFpbicpLFxuICAgICAgZmlsZU5hbWU6ICdteS1yZXN1bWUudHh0JyxcbiAgICAgIHVybDogJ215LXJlc3VtZS50eHQnLFxuICAgICAgZmlsZVNpemU6ICcxME1CJyxcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdUaGlzIGlzIHdoYXQgSSBoYXZlIGRvbmUuJyxcbn07XG5PdGhlckZpbGVUeXBlV2l0aENhcHRpb24uc3RvcnkgPSB7XG4gIG5hbWU6ICdPdGhlciBGaWxlIFR5cGUgd2l0aCBDYXB0aW9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBPdGhlckZpbGVUeXBlV2l0aExvbmdGaWxlbmFtZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuT3RoZXJGaWxlVHlwZVdpdGhMb25nRmlsZW5hbWUuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZSgndGV4dC9wbGFpbicpLFxuICAgICAgZmlsZU5hbWU6XG4gICAgICAgICdJTlNFUlQtQVBQLU5BTUVfSU5TRVJULUFQUC1BUFBMRS1JRF9BcHBTdG9yZV9BcHBzR2FtZXNXYXRjaC5wc2QuemlwJyxcbiAgICAgIHVybDogJ2EyL2EyMzM0MzI0ZGFyZXdlcjQyMzQnLFxuICAgICAgZmlsZVNpemU6ICcxME1CJyxcbiAgICB9KSxcbiAgXSxcbiAgc3RhdHVzOiAnc2VudCcsXG4gIHRleHQ6ICdUaGlzIGlzIHdoYXQgSSBoYXZlIGRvbmUuJyxcbn07XG5PdGhlckZpbGVUeXBlV2l0aExvbmdGaWxlbmFtZS5zdG9yeSA9IHtcbiAgbmFtZTogJ090aGVyIEZpbGUgVHlwZSB3aXRoIExvbmcgRmlsZW5hbWUnLFxufTtcblxuZXhwb3J0IGNvbnN0IFRhcFRvVmlld0ltYWdlID0gVGVtcGxhdGUuYmluZCh7fSk7XG5UYXBUb1ZpZXdJbWFnZS5hcmdzID0ge1xuICBhdHRhY2htZW50czogW1xuICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgIHVybDogJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICBmaWxlTmFtZTogJ3RpbmEtcm9sZi0yNjkzNDUtdW5zcGxhc2guanBnJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9KUEVHLFxuICAgICAgd2lkdGg6IDEyOCxcbiAgICAgIGhlaWdodDogMTI4LFxuICAgIH0pLFxuICBdLFxuICBpc1RhcFRvVmlldzogdHJ1ZSxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuVGFwVG9WaWV3SW1hZ2Uuc3RvcnkgPSB7XG4gIG5hbWU6ICdUYXBUb1ZpZXcgSW1hZ2UnLFxufTtcblxuZXhwb3J0IGNvbnN0IFRhcFRvVmlld1ZpZGVvID0gVGVtcGxhdGUuYmluZCh7fSk7XG5UYXBUb1ZpZXdWaWRlby5hcmdzID0ge1xuICBhdHRhY2htZW50czogW1xuICAgIGZha2VBdHRhY2htZW50KHtcbiAgICAgIGNvbnRlbnRUeXBlOiBWSURFT19NUDQsXG4gICAgICBmaWxlTmFtZTogJ3BpeGFiYXktU29hcC1CdWJibGUtNzE0MS5tcDQnLFxuICAgICAgaGVpZ2h0OiAxMjgsXG4gICAgICB1cmw6ICcvZml4dHVyZXMvcGl4YWJheS1Tb2FwLUJ1YmJsZS03MTQxLm1wNCcsXG4gICAgICB3aWR0aDogMTI4LFxuICAgIH0pLFxuICBdLFxuICBpc1RhcFRvVmlldzogdHJ1ZSxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuVGFwVG9WaWV3VmlkZW8uc3RvcnkgPSB7XG4gIG5hbWU6ICdUYXBUb1ZpZXcgVmlkZW8nLFxufTtcblxuZXhwb3J0IGNvbnN0IFRhcFRvVmlld0dpZiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVGFwVG9WaWV3R2lmLmFyZ3MgPSB7XG4gIGF0dGFjaG1lbnRzOiBbXG4gICAgZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICAgIGZsYWdzOiBTaWduYWxTZXJ2aWNlLkF0dGFjaG1lbnRQb2ludGVyLkZsYWdzLkdJRixcbiAgICAgIGZpbGVOYW1lOiAnY2F0LWdpZi5tcDQnLFxuICAgICAgdXJsOiAnL2ZpeHR1cmVzL2NhdC1naWYubXA0JyxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMzMixcbiAgICB9KSxcbiAgXSxcbiAgaXNUYXBUb1ZpZXc6IHRydWUsXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblRhcFRvVmlld0dpZi5zdG9yeSA9IHtcbiAgbmFtZTogJ1RhcFRvVmlldyBHSUYnLFxufTtcblxuZXhwb3J0IGNvbnN0IFRhcFRvVmlld0V4cGlyZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblRhcFRvVmlld0V4cGlyZWQuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICB1cmw6ICcvZml4dHVyZXMvdGluYS1yb2xmLTI2OTM0NS11bnNwbGFzaC5qcGcnLFxuICAgICAgZmlsZU5hbWU6ICd0aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDEyOCxcbiAgICB9KSxcbiAgXSxcbiAgaXNUYXBUb1ZpZXc6IHRydWUsXG4gIGlzVGFwVG9WaWV3RXhwaXJlZDogdHJ1ZSxcbiAgc3RhdHVzOiAnc2VudCcsXG59O1xuVGFwVG9WaWV3RXhwaXJlZC5zdG9yeSA9IHtcbiAgbmFtZTogJ1RhcFRvVmlldyBFeHBpcmVkJyxcbn07XG5cbmV4cG9ydCBjb25zdCBUYXBUb1ZpZXdFcnJvciA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVGFwVG9WaWV3RXJyb3IuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICB1cmw6ICcvZml4dHVyZXMvdGluYS1yb2xmLTI2OTM0NS11bnNwbGFzaC5qcGcnLFxuICAgICAgZmlsZU5hbWU6ICd0aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDEyOCxcbiAgICB9KSxcbiAgXSxcbiAgaXNUYXBUb1ZpZXc6IHRydWUsXG4gIGlzVGFwVG9WaWV3RXJyb3I6IHRydWUsXG4gIHN0YXR1czogJ3NlbnQnLFxufTtcblRhcFRvVmlld0Vycm9yLnN0b3J5ID0ge1xuICBuYW1lOiAnVGFwVG9WaWV3IEVycm9yJyxcbn07XG5cbmV4cG9ydCBjb25zdCBEYW5nZXJvdXNGaWxlVHlwZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGFuZ2Vyb3VzRmlsZVR5cGUuYXJncyA9IHtcbiAgYXR0YWNobWVudHM6IFtcbiAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZShcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5taWNyb3NvZnQucG9ydGFibGUtZXhlY3V0YWJsZSdcbiAgICAgICksXG4gICAgICBmaWxlTmFtZTogJ3RlcnJpYmxlLmV4ZScsXG4gICAgICB1cmw6ICd0ZXJyaWJsZS5leGUnLFxuICAgIH0pLFxuICBdLFxuICBzdGF0dXM6ICdzZW50Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBDb2xvcnMgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7Q29udmVyc2F0aW9uQ29sb3JzLm1hcChjb2xvciA9PiAoXG4gICAgICAgIDxkaXYga2V5PXtjb2xvcn0+XG4gICAgICAgICAge3JlbmRlckJvdGhEaXJlY3Rpb25zKFxuICAgICAgICAgICAgY3JlYXRlUHJvcHMoe1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25Db2xvcjogY29sb3IsXG4gICAgICAgICAgICAgIHRleHQ6IGBIZXJlIGlzIGEgcHJldmlldyBvZiB0aGUgY2hhdCBjb2xvcjogJHtjb2xvcn0uIFRoZSBjb2xvciBpcyB2aXNpYmxlIHRvIG9ubHkgeW91LmAsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC8+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgTWVudGlvbnMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk1lbnRpb25zLmFyZ3MgPSB7XG4gIGJvZHlSYW5nZXM6IFtcbiAgICB7XG4gICAgICBzdGFydDogMCxcbiAgICAgIGxlbmd0aDogMSxcbiAgICAgIG1lbnRpb25VdWlkOiAnemFwJyxcbiAgICAgIHJlcGxhY2VtZW50VGV4dDogJ1phcHAgQnJhbm5pZ2FuJyxcbiAgICB9LFxuICBdLFxuICB0ZXh0OiAnXFx1RkZGQyBUaGlzIElzIEl0LiBUaGUgTW9tZW50IFdlIFNob3VsZCBIYXZlIFRyYWluZWQgRm9yLicsXG59O1xuTWVudGlvbnMuc3RvcnkgPSB7XG4gIG5hbWU6ICdATWVudGlvbnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IEFsbFRoZUNvbnRleHRNZW51cyA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHByb3BzID0gY3JlYXRlUHJvcHMoe1xuICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgIHVybDogJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICAgIGZpbGVOYW1lOiAndGluYS1yb2xmLTI2OTM0NS11bnNwbGFzaC5qcGcnLFxuICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgICAgd2lkdGg6IDEyOCxcbiAgICAgICAgaGVpZ2h0OiAxMjgsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHN0YXR1czogJ3BhcnRpYWwtc2VudCcsXG4gICAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgY2FuUmV0cnk6IHRydWUsXG4gICAgY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgfSk7XG5cbiAgcmV0dXJuIDxNZXNzYWdlIHsuLi5wcm9wc30gZGlyZWN0aW9uPVwib3V0Z29pbmdcIiAvPjtcbn07XG5BbGxUaGVDb250ZXh0TWVudXMuc3RvcnkgPSB7XG4gIG5hbWU6ICdBbGwgdGhlIGNvbnRleHQgbWVudXMnLFxufTtcblxuZXhwb3J0IGNvbnN0IE5vdEFwcHJvdmVkV2l0aExpbmtQcmV2aWV3ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Ob3RBcHByb3ZlZFdpdGhMaW5rUHJldmlldy5hcmdzID0ge1xuICBwcmV2aWV3czogW1xuICAgIHtcbiAgICAgIGRvbWFpbjogJ3NpZ25hbC5vcmcnLFxuICAgICAgaW1hZ2U6IGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICAgICAgZmlsZU5hbWU6ICd0aGUtc2F4LnBuZycsXG4gICAgICAgIGhlaWdodDogMjQwLFxuICAgICAgICB1cmw6IHBuZ1VybCxcbiAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgIH0pLFxuICAgICAgaXNTdGlja2VyUGFjazogZmFsc2UsXG4gICAgICB0aXRsZTogJ1NpZ25hbCcsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1NheSBcImhlbGxvXCIgdG8gYSBkaWZmZXJlbnQgbWVzc2FnaW5nIGV4cGVyaWVuY2UuIEFuIHVuZXhwZWN0ZWQgZm9jdXMgb24gcHJpdmFjeSwgY29tYmluZWQgd2l0aCBhbGwgb2YgdGhlIGZlYXR1cmVzIHlvdSBleHBlY3QuJyxcbiAgICAgIHVybDogJ2h0dHBzOi8vd3d3LnNpZ25hbC5vcmcnLFxuICAgICAgZGF0ZTogbmV3IERhdGUoMjAyMCwgMiwgMTApLnZhbHVlT2YoKSxcbiAgICB9LFxuICBdLFxuICBzdGF0dXM6ICdzZW50JyxcbiAgdGV4dDogJ0JlIHN1cmUgdG8gbG9vayBhdCBodHRwczovL3d3dy5zaWduYWwub3JnJyxcbiAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiBmYWxzZSxcbn07XG5Ob3RBcHByb3ZlZFdpdGhMaW5rUHJldmlldy5zdG9yeSA9IHtcbiAgbmFtZTogJ05vdCBhcHByb3ZlZCwgd2l0aCBsaW5rIHByZXZpZXcnLFxufTtcblxuZXhwb3J0IGNvbnN0IEN1c3RvbUNvbG9yID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPD5cbiAgICB7cmVuZGVyVGhyZWUoe1xuICAgICAgLi4uY3JlYXRlUHJvcHMoeyB0ZXh0OiAnU29saWQuJyB9KSxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIGN1c3RvbUNvbG9yOiB7XG4gICAgICAgIHN0YXJ0OiB7IGh1ZTogODIsIHNhdHVyYXRpb246IDM1IH0sXG4gICAgICB9LFxuICAgIH0pfVxuICAgIDxiciBzdHlsZT17eyBjbGVhcjogJ2JvdGgnIH19IC8+XG4gICAge3JlbmRlclRocmVlKHtcbiAgICAgIC4uLmNyZWF0ZVByb3BzKHsgdGV4dDogJ0dyYWRpZW50LicgfSksXG4gICAgICBkaXJlY3Rpb246ICdvdXRnb2luZycsXG4gICAgICBjdXN0b21Db2xvcjoge1xuICAgICAgICBkZWc6IDE5MixcbiAgICAgICAgc3RhcnQ6IHsgaHVlOiAzMDQsIHNhdHVyYXRpb246IDg1IH0sXG4gICAgICAgIGVuZDogeyBodWU6IDIzMSwgc2F0dXJhdGlvbjogNzYgfSxcbiAgICAgIH0sXG4gICAgfSl9XG4gIDwvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENvbGxhcHNpbmdUZXh0T25seURNcyA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHRoZW0gPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG4gIGNvbnN0IG1lID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7IGlzTWU6IHRydWUgfSk7XG5cbiAgcmV0dXJuIHJlbmRlck1hbnkoW1xuICAgIGNyZWF0ZVByb3BzKHtcbiAgICAgIGF1dGhvcjogdGhlbSxcbiAgICAgIHRleHQ6ICdPbmUnLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNSAqIE1JTlVURSxcbiAgICB9KSxcbiAgICBjcmVhdGVQcm9wcyh7XG4gICAgICBhdXRob3I6IHRoZW0sXG4gICAgICB0ZXh0OiAnVHdvJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDQgKiBNSU5VVEUsXG4gICAgfSksXG4gICAgY3JlYXRlUHJvcHMoe1xuICAgICAgYXV0aG9yOiB0aGVtLFxuICAgICAgdGV4dDogJ1RocmVlJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDMgKiBNSU5VVEUsXG4gICAgfSksXG4gICAgY3JlYXRlUHJvcHMoe1xuICAgICAgYXV0aG9yOiBtZSxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICAgIHRleHQ6ICdGb3VyJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDIgKiBNSU5VVEUsXG4gICAgfSksXG4gICAgY3JlYXRlUHJvcHMoe1xuICAgICAgdGV4dDogJ0ZpdmUnLFxuICAgICAgYXV0aG9yOiBtZSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIE1JTlVURSxcbiAgICAgIGRpcmVjdGlvbjogJ291dGdvaW5nJyxcbiAgICB9KSxcbiAgICBjcmVhdGVQcm9wcyh7XG4gICAgICBhdXRob3I6IG1lLFxuICAgICAgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLFxuICAgICAgdGV4dDogJ1NpeCcsXG4gICAgfSksXG4gIF0pO1xufTtcblxuQ29sbGFwc2luZ1RleHRPbmx5RE1zLnN0b3J5ID0ge1xuICBuYW1lOiAnQ29sbGFwc2luZyB0ZXh0LW9ubHkgRE1zJyxcbn07XG5cbmV4cG9ydCBjb25zdCBDb2xsYXBzaW5nVGV4dE9ubHlHcm91cE1lc3NhZ2VzID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgYXV0aG9yID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpO1xuXG4gIHJldHVybiByZW5kZXJNYW55KFtcbiAgICBjcmVhdGVQcm9wcyh7XG4gICAgICBhdXRob3IsXG4gICAgICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICAgICAgdGV4dDogJ09uZScsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAyICogTUlOVVRFLFxuICAgIH0pLFxuICAgIGNyZWF0ZVByb3BzKHtcbiAgICAgIGF1dGhvcixcbiAgICAgIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG4gICAgICB0ZXh0OiAnVHdvJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIE1JTlVURSxcbiAgICB9KSxcbiAgICBjcmVhdGVQcm9wcyh7XG4gICAgICBhdXRob3IsXG4gICAgICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICAgICAgdGV4dDogJ1RocmVlJyxcbiAgICB9KSxcbiAgXSk7XG59O1xuXG5Db2xsYXBzaW5nVGV4dE9ubHlHcm91cE1lc3NhZ2VzLnN0b3J5ID0ge1xuICBuYW1lOiAnQ29sbGFwc2luZyB0ZXh0LW9ubHkgZ3JvdXAgbWVzc2FnZXMnLFxufTtcblxuZXhwb3J0IGNvbnN0IFN0b3J5UmVwbHkgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG5cbiAgcmV0dXJuIHJlbmRlclRocmVlKHtcbiAgICAuLi5jcmVhdGVQcm9wcyh7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgdGV4dDogJ1dvdyEnIH0pLFxuICAgIHN0b3J5UmVwbHlDb250ZXh0OiB7XG4gICAgICBhdXRob3JUaXRsZTogY29udmVyc2F0aW9uLmZpcnN0TmFtZSB8fCBjb252ZXJzYXRpb24udGl0bGUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogQ29udmVyc2F0aW9uQ29sb3JzWzBdLFxuICAgICAgaXNGcm9tTWU6IGZhbHNlLFxuICAgICAgcmF3QXR0YWNobWVudDogZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICB1cmw6ICcvZml4dHVyZXMvc25vdy5qcGcnLFxuICAgICAgICB0aHVtYm5haWw6IGZha2VUaHVtYm5haWwoJy9maXh0dXJlcy9zbm93LmpwZycpLFxuICAgICAgfSksXG4gICAgICB0ZXh0OiAnUGhvdG8nLFxuICAgIH0sXG4gIH0pO1xufTtcblxuU3RvcnlSZXBseS5zdG9yeSA9IHtcbiAgbmFtZTogJ1N0b3J5IHJlcGx5Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBTdG9yeVJlcGx5WW91cnMgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG5cbiAgcmV0dXJuIHJlbmRlclRocmVlKHtcbiAgICAuLi5jcmVhdGVQcm9wcyh7IGRpcmVjdGlvbjogJ2luY29taW5nJywgdGV4dDogJ1dvdyEnIH0pLFxuICAgIHN0b3J5UmVwbHlDb250ZXh0OiB7XG4gICAgICBhdXRob3JUaXRsZTogY29udmVyc2F0aW9uLmZpcnN0TmFtZSB8fCBjb252ZXJzYXRpb24udGl0bGUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogQ29udmVyc2F0aW9uQ29sb3JzWzBdLFxuICAgICAgaXNGcm9tTWU6IHRydWUsXG4gICAgICByYXdBdHRhY2htZW50OiBmYWtlQXR0YWNobWVudCh7XG4gICAgICAgIHVybDogJy9maXh0dXJlcy9zbm93LmpwZycsXG4gICAgICAgIHRodW1ibmFpbDogZmFrZVRodW1ibmFpbCgnL2ZpeHR1cmVzL3Nub3cuanBnJyksXG4gICAgICB9KSxcbiAgICAgIHRleHQ6ICdQaG90bycsXG4gICAgfSxcbiAgfSk7XG59O1xuXG5TdG9yeVJlcGx5WW91cnMuc3RvcnkgPSB7XG4gIG5hbWU6ICdTdG9yeSByZXBseSAoeW91cnMpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBTdG9yeVJlcGx5RW1vamkgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG5cbiAgcmV0dXJuIHJlbmRlclRocmVlKHtcbiAgICAuLi5jcmVhdGVQcm9wcyh7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgdGV4dDogJ1dvdyEnIH0pLFxuICAgIHN0b3J5UmVwbHlDb250ZXh0OiB7XG4gICAgICBhdXRob3JUaXRsZTogY29udmVyc2F0aW9uLmZpcnN0TmFtZSB8fCBjb252ZXJzYXRpb24udGl0bGUsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcjogQ29udmVyc2F0aW9uQ29sb3JzWzBdLFxuICAgICAgZW1vamk6ICdcdUQ4M0RcdURDODQnLFxuICAgICAgaXNGcm9tTWU6IGZhbHNlLFxuICAgICAgcmF3QXR0YWNobWVudDogZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICB1cmw6ICcvZml4dHVyZXMvc25vdy5qcGcnLFxuICAgICAgICB0aHVtYm5haWw6IGZha2VUaHVtYm5haWwoJy9maXh0dXJlcy9zbm93LmpwZycpLFxuICAgICAgfSksXG4gICAgICB0ZXh0OiAnUGhvdG8nLFxuICAgIH0sXG4gIH0pO1xufTtcblxuU3RvcnlSZXBseUVtb2ppLnN0b3J5ID0ge1xuICBuYW1lOiAnU3RvcnkgcmVwbHkgKGVtb2ppKScsXG59O1xuXG5jb25zdCBmdWxsQ29udGFjdCA9IHtcbiAgYXZhdGFyOiB7XG4gICAgYXZhdGFyOiBmYWtlQXR0YWNobWVudCh7XG4gICAgICBwYXRoOiAnL2ZpeHR1cmVzL2dpcGh5LUdWTnZPVXBlWW1JN2UuZ2lmJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9HSUYsXG4gICAgfSksXG4gICAgaXNQcm9maWxlOiB0cnVlLFxuICB9LFxuICBlbWFpbDogW1xuICAgIHtcbiAgICAgIHZhbHVlOiAnamVyam9yQGZha2VtYWlsLmNvbScsXG4gICAgICB0eXBlOiBDb250YWN0Rm9ybVR5cGUuSE9NRSxcbiAgICB9LFxuICBdLFxuICBuYW1lOiB7XG4gICAgZ2l2ZW5OYW1lOiAnSmVycnknLFxuICAgIGZhbWlseU5hbWU6ICdKb3JkYW4nLFxuICAgIHByZWZpeDogJ0RyLicsXG4gICAgc3VmZml4OiAnSnIuJyxcbiAgICBtaWRkbGVOYW1lOiAnSmFtZXMnLFxuICAgIGRpc3BsYXlOYW1lOiAnSmVycnkgSm9yZGFuJyxcbiAgfSxcbiAgbnVtYmVyOiBbXG4gICAge1xuICAgICAgdmFsdWU6ICc1NTUtNDQ0LTIzMjMnLFxuICAgICAgdHlwZTogQ29udGFjdEZvcm1UeXBlLkhPTUUsXG4gICAgfSxcbiAgXSxcbn07XG5cbmV4cG9ydCBjb25zdCBFbWJlZGRlZENvbnRhY3RGdWxsQ29udGFjdCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRW1iZWRkZWRDb250YWN0RnVsbENvbnRhY3QuYXJncyA9IHtcbiAgY29udGFjdDogZnVsbENvbnRhY3QsXG59O1xuRW1iZWRkZWRDb250YWN0RnVsbENvbnRhY3Quc3RvcnkgPSB7XG4gIG5hbWU6ICdFbWJlZGRlZENvbnRhY3Q6IEZ1bGwgQ29udGFjdCcsXG59O1xuXG5leHBvcnQgY29uc3QgRW1iZWRkZWRDb250YWN0V2l0aFNlbmRNZXNzYWdlID0gVGVtcGxhdGUuYmluZCh7fSk7XG5FbWJlZGRlZENvbnRhY3RXaXRoU2VuZE1lc3NhZ2UuYXJncyA9IHtcbiAgY29udGFjdDoge1xuICAgIC4uLmZ1bGxDb250YWN0LFxuICAgIGZpcnN0TnVtYmVyOiBmdWxsQ29udGFjdC5udW1iZXJbMF0udmFsdWUsXG4gICAgdXVpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gIH0sXG4gIGRpcmVjdGlvbjogJ2luY29taW5nJyxcbn07XG5FbWJlZGRlZENvbnRhY3RXaXRoU2VuZE1lc3NhZ2Uuc3RvcnkgPSB7XG4gIG5hbWU6ICdFbWJlZGRlZENvbnRhY3Q6IHdpdGggU2VuZCBNZXNzYWdlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBFbWJlZGRlZENvbnRhY3RPbmx5RW1haWwgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkVtYmVkZGVkQ29udGFjdE9ubHlFbWFpbC5hcmdzID0ge1xuICBjb250YWN0OiB7XG4gICAgZW1haWw6IGZ1bGxDb250YWN0LmVtYWlsLFxuICB9LFxufTtcbkVtYmVkZGVkQ29udGFjdE9ubHlFbWFpbC5zdG9yeSA9IHtcbiAgbmFtZTogJ0VtYmVkZGVkQ29udGFjdDogT25seSBFbWFpbCcsXG59O1xuXG5leHBvcnQgY29uc3QgRW1iZWRkZWRDb250YWN0R2l2ZW5OYW1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5FbWJlZGRlZENvbnRhY3RHaXZlbk5hbWUuYXJncyA9IHtcbiAgY29udGFjdDoge1xuICAgIG5hbWU6IHtcbiAgICAgIGdpdmVuTmFtZTogJ0plcnJ5JyxcbiAgICB9LFxuICB9LFxufTtcbkVtYmVkZGVkQ29udGFjdEdpdmVuTmFtZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0VtYmVkZGVkQ29udGFjdDogR2l2ZW4gTmFtZScsXG59O1xuXG5leHBvcnQgY29uc3QgRW1iZWRkZWRDb250YWN0T3JnYW5pemF0aW9uID0gVGVtcGxhdGUuYmluZCh7fSk7XG5FbWJlZGRlZENvbnRhY3RPcmdhbml6YXRpb24uYXJncyA9IHtcbiAgY29udGFjdDoge1xuICAgIG9yZ2FuaXphdGlvbjogJ0NvbXBhbnkgNScsXG4gIH0sXG59O1xuRW1iZWRkZWRDb250YWN0T3JnYW5pemF0aW9uLnN0b3J5ID0ge1xuICBuYW1lOiAnRW1iZWRkZWRDb250YWN0OiBPcmdhbml6YXRpb24nLFxufTtcblxuZXhwb3J0IGNvbnN0IEVtYmVkZGVkQ29udGFjdEdpdmVuRmFtaWx5TmFtZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRW1iZWRkZWRDb250YWN0R2l2ZW5GYW1pbHlOYW1lLmFyZ3MgPSB7XG4gIGNvbnRhY3Q6IHtcbiAgICBuYW1lOiB7XG4gICAgICBnaXZlbk5hbWU6ICdKZXJyeScsXG4gICAgICBmYW1pbHlOYW1lOiAnRmFtaWx5TmFtZScsXG4gICAgfSxcbiAgfSxcbn07XG5FbWJlZGRlZENvbnRhY3RHaXZlbkZhbWlseU5hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdFbWJlZGRlZENvbnRhY3Q6IEdpdmVuICsgRmFtaWx5IE5hbWUnLFxufTtcblxuZXhwb3J0IGNvbnN0IEVtYmVkZGVkQ29udGFjdEZhbWlseU5hbWUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkVtYmVkZGVkQ29udGFjdEZhbWlseU5hbWUuYXJncyA9IHtcbiAgY29udGFjdDoge1xuICAgIG5hbWU6IHtcbiAgICAgIGZhbWlseU5hbWU6ICdGYW1pbHlOYW1lJyxcbiAgICB9LFxuICB9LFxufTtcbkVtYmVkZGVkQ29udGFjdEZhbWlseU5hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdFbWJlZGRlZENvbnRhY3Q6IEZhbWlseSBOYW1lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBFbWJlZGRlZENvbnRhY3RMb2FkaW5nQXZhdGFyID0gVGVtcGxhdGUuYmluZCh7fSk7XG5FbWJlZGRlZENvbnRhY3RMb2FkaW5nQXZhdGFyLmFyZ3MgPSB7XG4gIGNvbnRhY3Q6IHtcbiAgICBuYW1lOiB7XG4gICAgICBkaXNwbGF5TmFtZTogJ0plcnJ5IEpvcmRhbicsXG4gICAgfSxcbiAgICBhdmF0YXI6IHtcbiAgICAgIGF2YXRhcjogZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfR0lGLFxuICAgICAgfSksXG4gICAgICBpc1Byb2ZpbGU6IHRydWUsXG4gICAgfSxcbiAgfSxcbn07XG5FbWJlZGRlZENvbnRhY3RMb2FkaW5nQXZhdGFyLnN0b3J5ID0ge1xuICBuYW1lOiAnRW1iZWRkZWRDb250YWN0OiBMb2FkaW5nIEF2YXRhcicsXG59O1xuXG5leHBvcnQgY29uc3QgR2lmdEJhZGdlVW5vcGVuZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdpZnRCYWRnZVVub3BlbmVkLmFyZ3MgPSB7XG4gIGdpZnRCYWRnZToge1xuICAgIGlkOiAnR0lGVCcsXG4gICAgZXhwaXJhdGlvbjogRGF0ZS5ub3coKSArIERBWSAqIDMwLFxuICAgIGxldmVsOiAzLFxuICAgIHN0YXRlOiBHaWZ0QmFkZ2VTdGF0ZXMuVW5vcGVuZWQsXG4gIH0sXG59O1xuR2lmdEJhZGdlVW5vcGVuZWQuc3RvcnkgPSB7XG4gIG5hbWU6ICdHaWZ0IEJhZGdlOiBVbm9wZW5lZCcsXG59O1xuXG5jb25zdCBnZXRQcmVmZXJyZWRCYWRnZSA9ICgpID0+ICh7XG4gIGNhdGVnb3J5OiBCYWRnZUNhdGVnb3J5LkRvbm9yLFxuICBkZXNjcmlwdGlvblRlbXBsYXRlOiAnVGhpcyBpcyBhIGRlc2NyaXB0aW9uIG9mIHRoZSBiYWRnZScsXG4gIGlkOiAnR0lGVCcsXG4gIGltYWdlczogW1xuICAgIHtcbiAgICAgIHRyYW5zcGFyZW50OiB7XG4gICAgICAgIGxvY2FsUGF0aDogJy9maXh0dXJlcy9vcmFuZ2UtaGVhcnQuc3ZnJyxcbiAgICAgICAgdXJsOiAnaHR0cDovL3NvbWVwbGFjZScsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIG5hbWU6ICdoZWFydCcsXG59KTtcblxuZXhwb3J0IGNvbnN0IEdpZnRCYWRnZVJlZGVlbWVkMzBEYXlzID0gVGVtcGxhdGUuYmluZCh7fSk7XG5HaWZ0QmFkZ2VSZWRlZW1lZDMwRGF5cy5hcmdzID0ge1xuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgZ2lmdEJhZGdlOiB7XG4gICAgZXhwaXJhdGlvbjogRGF0ZS5ub3coKSArIERBWSAqIDMwICsgU0VDT05ELFxuICAgIGlkOiAnR0lGVCcsXG4gICAgbGV2ZWw6IDMsXG4gICAgc3RhdGU6IEdpZnRCYWRnZVN0YXRlcy5SZWRlZW1lZCxcbiAgfSxcbn07XG5HaWZ0QmFkZ2VSZWRlZW1lZDMwRGF5cy5zdG9yeSA9IHtcbiAgbmFtZTogJ0dpZnQgQmFkZ2U6IFJlZGVlbWVkICgzMCBkYXlzKScsXG59O1xuXG5leHBvcnQgY29uc3QgR2lmdEJhZGdlUmVkZWVtZWQyNEhvdXJzID0gVGVtcGxhdGUuYmluZCh7fSk7XG5HaWZ0QmFkZ2VSZWRlZW1lZDI0SG91cnMuYXJncyA9IHtcbiAgZ2V0UHJlZmVycmVkQmFkZ2UsXG4gIGdpZnRCYWRnZToge1xuICAgIGV4cGlyYXRpb246IERhdGUubm93KCkgKyBEQVkgKyBTRUNPTkQsXG4gICAgaWQ6ICdHSUZUJyxcbiAgICBsZXZlbDogMyxcbiAgICBzdGF0ZTogR2lmdEJhZGdlU3RhdGVzLlJlZGVlbWVkLFxuICB9LFxufTtcbkdpZnRCYWRnZVJlZGVlbWVkMjRIb3Vycy5zdG9yeSA9IHtcbiAgbmFtZTogJ0dpZnQgQmFkZ2U6IFJlZGVlbWVkICgyNCBob3VycyknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdpZnRCYWRnZU9wZW5lZDYwTWludXRlcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuR2lmdEJhZGdlT3BlbmVkNjBNaW51dGVzLmFyZ3MgPSB7XG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBnaWZ0QmFkZ2U6IHtcbiAgICBleHBpcmF0aW9uOiBEYXRlLm5vdygpICsgSE9VUiArIFNFQ09ORCxcbiAgICBpZDogJ0dJRlQnLFxuICAgIGxldmVsOiAzLFxuICAgIHN0YXRlOiBHaWZ0QmFkZ2VTdGF0ZXMuT3BlbmVkLFxuICB9LFxufTtcbkdpZnRCYWRnZU9wZW5lZDYwTWludXRlcy5zdG9yeSA9IHtcbiAgbmFtZTogJ0dpZnQgQmFkZ2U6IE9wZW5lZCAoNjAgbWludXRlcyknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdpZnRCYWRnZVJlZGVlbWVkMU1pbnV0ZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuR2lmdEJhZGdlUmVkZWVtZWQxTWludXRlLmFyZ3MgPSB7XG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBnaWZ0QmFkZ2U6IHtcbiAgICBleHBpcmF0aW9uOiBEYXRlLm5vdygpICsgTUlOVVRFICsgU0VDT05ELFxuICAgIGlkOiAnR0lGVCcsXG4gICAgbGV2ZWw6IDMsXG4gICAgc3RhdGU6IEdpZnRCYWRnZVN0YXRlcy5SZWRlZW1lZCxcbiAgfSxcbn07XG5HaWZ0QmFkZ2VSZWRlZW1lZDFNaW51dGUuc3RvcnkgPSB7XG4gIG5hbWU6ICdHaWZ0IEJhZGdlOiBSZWRlZW1lZCAoMSBtaW51dGUpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBHaWZ0QmFkZ2VPcGVuZWRFeHBpcmVkID0gVGVtcGxhdGUuYmluZCh7fSk7XG5HaWZ0QmFkZ2VPcGVuZWRFeHBpcmVkLmFyZ3MgPSB7XG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBnaWZ0QmFkZ2U6IHtcbiAgICBleHBpcmF0aW9uOiBEYXRlLm5vdygpLFxuICAgIGlkOiAnR0lGVCcsXG4gICAgbGV2ZWw6IDMsXG4gICAgc3RhdGU6IEdpZnRCYWRnZVN0YXRlcy5PcGVuZWQsXG4gIH0sXG59O1xuR2lmdEJhZGdlT3BlbmVkRXhwaXJlZC5zdG9yeSA9IHtcbiAgbmFtZTogJ0dpZnQgQmFkZ2U6IE9wZW5lZCAoZXhwaXJlZCknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdpZnRCYWRnZU1pc3NpbmdCYWRnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuR2lmdEJhZGdlTWlzc2luZ0JhZGdlLmFyZ3MgPSB7XG4gIGdldFByZWZlcnJlZEJhZGdlOiAoKSA9PiB1bmRlZmluZWQsXG4gIGdpZnRCYWRnZToge1xuICAgIGV4cGlyYXRpb246IERhdGUubm93KCkgKyBNSU5VVEUgKyBTRUNPTkQsXG4gICAgaWQ6ICdNSVNTSU5HJyxcbiAgICBsZXZlbDogMyxcbiAgICBzdGF0ZTogR2lmdEJhZGdlU3RhdGVzLlJlZGVlbWVkLFxuICB9LFxufTtcbkdpZnRCYWRnZU1pc3NpbmdCYWRnZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0dpZnQgQmFkZ2U6IE1pc3NpbmcgQmFkZ2UnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLFlBQXVCO0FBQ3ZCLG9CQUEwQjtBQUUxQiwyQkFBdUI7QUFDdkIseUJBQThDO0FBRzlDLHNCQUE4QjtBQUM5QixvQkFBbUM7QUFDbkMseUJBQTRCO0FBRTVCLHFCQUF3RDtBQUN4RCxrQkFTTztBQUNQLCtCQUEyQjtBQUMzQiwwQkFBNkI7QUFDN0IsZ0NBQTZCO0FBQzdCLHVCQUEwQjtBQUMxQixzQkFBdUI7QUFDdkIsc0JBQXVCO0FBQ3ZCLG9DQUF1QztBQUN2QyxrQkFBZ0M7QUFDaEMsdUJBQTBDO0FBQzFDLDZCQUFnQztBQUVoQyw0QkFHTztBQUNQLDBCQUE2QjtBQUM3QixrQkFBMEI7QUFDMUIs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
