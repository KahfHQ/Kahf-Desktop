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
var Quote_stories_exports = {};
__export(Quote_stories_exports, {
  AudioAttachment: () => AudioAttachment,
  AudioOnly: () => AudioOnly,
  CustomColor: () => CustomColor,
  GiftBadge: () => GiftBadge,
  ImageAttachment: () => ImageAttachment,
  ImageAttachmentNoThumbnail: () => ImageAttachmentNoThumbnail,
  ImageOnly: () => ImageOnly,
  ImageTapToView: () => ImageTapToView,
  IncomingByAnotherAuthor: () => IncomingByAnotherAuthor,
  IncomingByMe: () => IncomingByMe,
  IncomingOutgoingColors: () => IncomingOutgoingColors,
  IsStoryReply: () => IsStoryReply,
  IsStoryReplyEmoji: () => IsStoryReplyEmoji,
  LongMessageAttachmentShouldBeHidden: () => LongMessageAttachmentShouldBeHidden,
  MediaTapToView: () => MediaTapToView,
  MentionIncomingAnotherAuthor: () => MentionIncomingAnotherAuthor,
  MentionIncomingMe: () => MentionIncomingMe,
  MentionOutgoingAnotherAuthor: () => MentionOutgoingAnotherAuthor,
  MentionOutgoingMe: () => MentionOutgoingMe,
  MessageNotFound: () => MessageNotFound,
  MissingTextAttachment: () => MissingTextAttachment,
  NoCloseButton: () => NoCloseButton,
  OtherFileAttachment: () => OtherFileAttachment,
  OtherFileOnly: () => OtherFileOnly,
  OutgoingByAnotherAuthor: () => OutgoingByAnotherAuthor,
  OutgoingByMe: () => OutgoingByMe,
  VideoAttachment: () => VideoAttachment,
  VideoAttachmentNoThumbnail: () => VideoAttachmentNoThumbnail,
  VideoOnly: () => VideoOnly,
  VideoTapToView: () => VideoTapToView,
  VoiceMessageAttachment: () => VoiceMessageAttachment,
  VoiceMessageOnly: () => VoiceMessageOnly,
  default: () => Quote_stories_default
});
module.exports = __toCommonJS(Quote_stories_exports);
var React = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_Colors = require("../../types/Colors");
var import_Fixtures = require("../../storybook/Fixtures");
var import_Message = require("./Message");
var import_MIME = require("../../types/MIME");
var import_Quote = require("./Quote");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_util = require("../_util");
var import_Util = require("../../types/Util");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var Quote_stories_default = {
  component: import_Quote.Quote,
  title: "Components/Conversation/Quote",
  argTypes: {
    authorTitle: {
      defaultValue: "Default Sender"
    },
    conversationColor: {
      defaultValue: "forest"
    },
    doubleCheckMissingQuoteReference: { action: true },
    i18n: {
      defaultValue: i18n
    },
    isFromMe: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    isGiftBadge: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    isIncoming: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    isViewOnce: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    onClick: { action: true },
    onClose: { action: true },
    rawAttachment: {
      defaultValue: void 0
    },
    referencedMessageNotFound: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    text: {
      defaultValue: "A sample message from a pal"
    }
  }
};
const defaultMessageProps = {
  author: (0, import_getDefaultConversation.getDefaultConversation)({
    id: "some-id",
    title: "Person X"
  }),
  canReact: true,
  canReply: true,
  canRetry: true,
  canRetryDeleteForEveryone: true,
  canDeleteForEveryone: true,
  canDownload: true,
  checkForAccount: (0, import_addon_actions.action)("checkForAccount"),
  clearSelectedMessage: (0, import_addon_actions.action)("default--clearSelectedMessage"),
  containerElementRef: React.createRef(),
  containerWidthBreakpoint: import_util.WidthBreakpoint.Wide,
  conversationColor: "crimson",
  conversationId: "conversationId",
  conversationTitle: "Conversation Title",
  conversationType: "direct",
  deleteMessage: (0, import_addon_actions.action)("default--deleteMessage"),
  deleteMessageForEveryone: (0, import_addon_actions.action)("default--deleteMessageForEveryone"),
  direction: "incoming",
  displayTapToViewMessage: (0, import_addon_actions.action)("default--displayTapToViewMessage"),
  downloadAttachment: (0, import_addon_actions.action)("default--downloadAttachment"),
  doubleCheckMissingQuoteReference: (0, import_addon_actions.action)("default--doubleCheckMissingQuoteReference"),
  getPreferredBadge: () => void 0,
  i18n,
  id: "messageId",
  renderingContext: "storybook",
  interactionMode: "keyboard",
  isBlocked: false,
  isMessageRequestAccepted: true,
  kickOffAttachmentDownload: (0, import_addon_actions.action)("default--kickOffAttachmentDownload"),
  markAttachmentAsCorrupted: (0, import_addon_actions.action)("default--markAttachmentAsCorrupted"),
  markViewed: (0, import_addon_actions.action)("default--markViewed"),
  messageExpanded: (0, import_addon_actions.action)("default--message-expanded"),
  openConversation: (0, import_addon_actions.action)("default--openConversation"),
  openGiftBadge: (0, import_addon_actions.action)("openGiftBadge"),
  openLink: (0, import_addon_actions.action)("default--openLink"),
  previews: [],
  reactToMessage: (0, import_addon_actions.action)("default--reactToMessage"),
  readStatus: import_MessageReadStatus.ReadStatus.Read,
  renderEmojiPicker: () => /* @__PURE__ */ React.createElement("div", null),
  renderReactionPicker: () => /* @__PURE__ */ React.createElement("div", null),
  renderAudioAttachment: () => /* @__PURE__ */ React.createElement("div", null, "*AudioAttachment*"),
  replyToMessage: (0, import_addon_actions.action)("default--replyToMessage"),
  retrySend: (0, import_addon_actions.action)("default--retrySend"),
  retryDeleteForEveryone: (0, import_addon_actions.action)("default--retryDeleteForEveryone"),
  scrollToQuotedMessage: (0, import_addon_actions.action)("default--scrollToQuotedMessage"),
  selectMessage: (0, import_addon_actions.action)("default--selectMessage"),
  shouldCollapseAbove: false,
  shouldCollapseBelow: false,
  shouldHideMetadata: false,
  showContactDetail: (0, import_addon_actions.action)("default--showContactDetail"),
  showContactModal: (0, import_addon_actions.action)("default--showContactModal"),
  showExpiredIncomingTapToViewToast: (0, import_addon_actions.action)("showExpiredIncomingTapToViewToast"),
  showExpiredOutgoingTapToViewToast: (0, import_addon_actions.action)("showExpiredOutgoingTapToViewToast"),
  showForwardMessageModal: (0, import_addon_actions.action)("default--showForwardMessageModal"),
  showMessageDetail: (0, import_addon_actions.action)("default--showMessageDetail"),
  showVisualAttachment: (0, import_addon_actions.action)("default--showVisualAttachment"),
  startConversation: (0, import_addon_actions.action)("default--startConversation"),
  status: "sent",
  text: "This is really interesting.",
  textDirection: import_Message.TextDirection.Default,
  theme: import_Util.ThemeType.light,
  timestamp: Date.now(),
  viewStory: (0, import_addon_actions.action)("viewStory")
};
const renderInMessage = /* @__PURE__ */ __name(({
  authorTitle,
  conversationColor,
  isFromMe,
  rawAttachment,
  isViewOnce,
  isGiftBadge,
  referencedMessageNotFound,
  text: quoteText
}) => {
  const messageProps = {
    ...defaultMessageProps,
    conversationColor,
    quote: {
      authorId: "an-author",
      authorTitle,
      conversationColor,
      isFromMe,
      rawAttachment,
      isViewOnce,
      isGiftBadge,
      referencedMessageNotFound,
      sentAt: Date.now() - 30 * 1e3,
      text: quoteText
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    style: { overflow: "hidden" }
  }, /* @__PURE__ */ React.createElement(import_Message.Message, {
    ...messageProps
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_Message.Message, {
    ...messageProps,
    direction: "outgoing"
  }));
}, "renderInMessage");
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ React.createElement(import_Quote.Quote, {
  ...args
}), "Template");
const TemplateInMessage = /* @__PURE__ */ __name((args) => renderInMessage(args), "TemplateInMessage");
const OutgoingByAnotherAuthor = Template.bind({});
OutgoingByAnotherAuthor.args = {
  authorTitle: (0, import_getDefaultConversation.getDefaultConversation)().title
};
OutgoingByAnotherAuthor.story = {
  name: "Outgoing by Another Author"
};
const OutgoingByMe = Template.bind({});
OutgoingByMe.args = {
  isFromMe: true
};
OutgoingByMe.story = {
  name: "Outgoing by Me"
};
const IncomingByAnotherAuthor = Template.bind({});
IncomingByAnotherAuthor.args = {
  authorTitle: (0, import_getDefaultConversation.getDefaultConversation)().title,
  isIncoming: true
};
IncomingByAnotherAuthor.story = {
  name: "Incoming by Another Author"
};
const IncomingByMe = Template.bind({});
IncomingByMe.args = {
  isFromMe: true,
  isIncoming: true
};
IncomingByMe.story = {
  name: "Incoming by Me"
};
const IncomingOutgoingColors = /* @__PURE__ */ __name((args) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, import_Colors.ConversationColors.map((color) => renderInMessage({ ...args, conversationColor: color })));
}, "IncomingOutgoingColors");
IncomingOutgoingColors.args = {};
IncomingOutgoingColors.story = {
  name: "Incoming/Outgoing Colors"
};
const ImageOnly = Template.bind({});
ImageOnly.args = {
  text: "",
  rawAttachment: {
    contentType: import_MIME.IMAGE_PNG,
    fileName: "sax.png",
    isVoiceMessage: false,
    thumbnail: {
      contentType: import_MIME.IMAGE_PNG,
      height: 100,
      width: 100,
      path: import_Fixtures.pngUrl,
      objectUrl: import_Fixtures.pngUrl
    }
  }
};
const ImageAttachment = Template.bind({});
ImageAttachment.args = {
  rawAttachment: {
    contentType: import_MIME.IMAGE_PNG,
    fileName: "sax.png",
    isVoiceMessage: false,
    thumbnail: {
      contentType: import_MIME.IMAGE_PNG,
      height: 100,
      width: 100,
      path: import_Fixtures.pngUrl,
      objectUrl: import_Fixtures.pngUrl
    }
  }
};
const ImageAttachmentNoThumbnail = Template.bind({});
ImageAttachmentNoThumbnail.args = {
  rawAttachment: {
    contentType: import_MIME.IMAGE_PNG,
    fileName: "sax.png",
    isVoiceMessage: false
  }
};
ImageAttachmentNoThumbnail.story = {
  name: "Image Attachment w/o Thumbnail"
};
const ImageTapToView = Template.bind({});
ImageTapToView.args = {
  text: "",
  isViewOnce: true,
  rawAttachment: {
    contentType: import_MIME.IMAGE_PNG,
    fileName: "sax.png",
    isVoiceMessage: false
  }
};
ImageTapToView.story = {
  name: "Image Tap-to-View"
};
const VideoOnly = Template.bind({});
VideoOnly.args = {
  rawAttachment: {
    contentType: import_MIME.VIDEO_MP4,
    fileName: "great-video.mp4",
    isVoiceMessage: false,
    thumbnail: {
      contentType: import_MIME.IMAGE_PNG,
      height: 100,
      width: 100,
      path: import_Fixtures.pngUrl,
      objectUrl: import_Fixtures.pngUrl
    }
  },
  text: void 0
};
const VideoAttachment = Template.bind({});
VideoAttachment.args = {
  rawAttachment: {
    contentType: import_MIME.VIDEO_MP4,
    fileName: "great-video.mp4",
    isVoiceMessage: false,
    thumbnail: {
      contentType: import_MIME.IMAGE_PNG,
      height: 100,
      width: 100,
      path: import_Fixtures.pngUrl,
      objectUrl: import_Fixtures.pngUrl
    }
  }
};
const VideoAttachmentNoThumbnail = Template.bind({});
VideoAttachmentNoThumbnail.args = {
  rawAttachment: {
    contentType: import_MIME.VIDEO_MP4,
    fileName: "great-video.mp4",
    isVoiceMessage: false
  }
};
VideoAttachmentNoThumbnail.story = {
  name: "Video Attachment w/o Thumbnail"
};
const VideoTapToView = Template.bind({});
VideoTapToView.args = {
  text: "",
  isViewOnce: true,
  rawAttachment: {
    contentType: import_MIME.VIDEO_MP4,
    fileName: "great-video.mp4",
    isVoiceMessage: false
  }
};
VideoTapToView.story = {
  name: "Video Tap-to-View"
};
const GiftBadge = TemplateInMessage.bind({});
GiftBadge.args = {
  text: "Some text which shouldn't be rendered",
  isGiftBadge: true
};
const AudioOnly = Template.bind({});
AudioOnly.args = {
  rawAttachment: {
    contentType: import_MIME.AUDIO_MP3,
    fileName: "great-video.mp3",
    isVoiceMessage: false
  },
  text: void 0
};
const AudioAttachment = Template.bind({});
AudioAttachment.args = {
  rawAttachment: {
    contentType: import_MIME.AUDIO_MP3,
    fileName: "great-video.mp3",
    isVoiceMessage: false
  }
};
const VoiceMessageOnly = Template.bind({});
VoiceMessageOnly.args = {
  rawAttachment: {
    contentType: import_MIME.AUDIO_MP3,
    fileName: "great-video.mp3",
    isVoiceMessage: true
  },
  text: void 0
};
const VoiceMessageAttachment = Template.bind({});
VoiceMessageAttachment.args = {
  rawAttachment: {
    contentType: import_MIME.AUDIO_MP3,
    fileName: "great-video.mp3",
    isVoiceMessage: true
  }
};
const OtherFileOnly = Template.bind({});
OtherFileOnly.args = {
  rawAttachment: {
    contentType: (0, import_MIME.stringToMIMEType)("application/json"),
    fileName: "great-data.json",
    isVoiceMessage: false
  },
  text: void 0
};
const MediaTapToView = Template.bind({});
MediaTapToView.args = {
  text: "",
  isViewOnce: true,
  rawAttachment: {
    contentType: import_MIME.AUDIO_MP3,
    fileName: "great-video.mp3",
    isVoiceMessage: false
  }
};
MediaTapToView.story = {
  name: "Media Tap-to-View"
};
const OtherFileAttachment = Template.bind({});
OtherFileAttachment.args = {
  rawAttachment: {
    contentType: (0, import_MIME.stringToMIMEType)("application/json"),
    fileName: "great-data.json",
    isVoiceMessage: false
  }
};
const LongMessageAttachmentShouldBeHidden = Template.bind({});
LongMessageAttachmentShouldBeHidden.args = {
  rawAttachment: {
    contentType: import_MIME.LONG_MESSAGE,
    fileName: "signal-long-message-123.txt",
    isVoiceMessage: false
  }
};
LongMessageAttachmentShouldBeHidden.story = {
  name: "Long message attachment (should be hidden)"
};
const NoCloseButton = Template.bind({});
NoCloseButton.args = {
  onClose: void 0
};
const MessageNotFound = TemplateInMessage.bind({});
MessageNotFound.args = {
  referencedMessageNotFound: true
};
const MissingTextAttachment = Template.bind({});
MissingTextAttachment.args = {
  text: void 0
};
MissingTextAttachment.story = {
  name: "Missing Text & Attachment"
};
const MentionOutgoingAnotherAuthor = Template.bind({});
MentionOutgoingAnotherAuthor.args = {
  authorTitle: "Tony Stark",
  text: "@Captain America Lunch later?"
};
MentionOutgoingAnotherAuthor.story = {
  name: "@mention + outgoing + another author"
};
const MentionOutgoingMe = Template.bind({});
MentionOutgoingMe.args = {
  isFromMe: true,
  text: "@Captain America Lunch later?"
};
MentionOutgoingMe.story = {
  name: "@mention + outgoing + me"
};
const MentionIncomingAnotherAuthor = Template.bind({});
MentionIncomingAnotherAuthor.args = {
  authorTitle: "Captain America",
  isIncoming: true,
  text: "@Tony Stark sure"
};
MentionIncomingAnotherAuthor.story = {
  name: "@mention + incoming + another author"
};
const MentionIncomingMe = Template.bind({});
MentionIncomingMe.args = {
  isFromMe: true,
  isIncoming: true,
  text: "@Tony Stark sure"
};
MentionIncomingMe.story = {
  name: "@mention + incoming + me"
};
const CustomColor = /* @__PURE__ */ __name((args) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_Quote.Quote, {
  ...args,
  customColor: {
    start: { hue: 82, saturation: 35 }
  }
}), /* @__PURE__ */ React.createElement(import_Quote.Quote, {
  ...args,
  isIncoming: false,
  text: "A gradient",
  customColor: {
    deg: 192,
    start: { hue: 304, saturation: 85 },
    end: { hue: 231, saturation: 76 }
  }
})), "CustomColor");
CustomColor.args = {
  isIncoming: true,
  text: "Solid + Gradient"
};
const IsStoryReply = Template.bind({});
IsStoryReply.args = {
  text: "Wow!",
  authorTitle: "Amanda",
  isStoryReply: true,
  moduleClassName: "StoryReplyQuote",
  onClose: void 0,
  rawAttachment: {
    contentType: import_MIME.VIDEO_MP4,
    fileName: "great-video.mp4",
    isVoiceMessage: false
  }
};
IsStoryReply.story = {
  name: "isStoryReply"
};
const IsStoryReplyEmoji = Template.bind({});
IsStoryReplyEmoji.args = {
  authorTitle: (0, import_getDefaultConversation.getDefaultConversation)().firstName,
  isStoryReply: true,
  moduleClassName: "StoryReplyQuote",
  onClose: void 0,
  rawAttachment: {
    contentType: import_MIME.IMAGE_PNG,
    fileName: "sax.png",
    isVoiceMessage: false,
    thumbnail: {
      contentType: import_MIME.IMAGE_PNG,
      height: 100,
      width: 100,
      path: import_Fixtures.pngUrl,
      objectUrl: import_Fixtures.pngUrl
    }
  },
  reactionEmoji: "\u{1F3CB}\uFE0F"
};
IsStoryReplyEmoji.story = {
  name: "isStoryReply emoji"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AudioAttachment,
  AudioOnly,
  CustomColor,
  GiftBadge,
  ImageAttachment,
  ImageAttachmentNoThumbnail,
  ImageOnly,
  ImageTapToView,
  IncomingByAnotherAuthor,
  IncomingByMe,
  IncomingOutgoingColors,
  IsStoryReply,
  IsStoryReplyEmoji,
  LongMessageAttachmentShouldBeHidden,
  MediaTapToView,
  MentionIncomingAnotherAuthor,
  MentionIncomingMe,
  MentionOutgoingAnotherAuthor,
  MentionOutgoingMe,
  MessageNotFound,
  MissingTextAttachment,
  NoCloseButton,
  OtherFileAttachment,
  OtherFileOnly,
  OutgoingByAnotherAuthor,
  OutgoingByMe,
  VideoAttachment,
  VideoAttachmentNoThumbnail,
  VideoOnly,
  VideoTapToView,
  VoiceMessageAttachment,
  VoiceMessageOnly
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUXVvdGUuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24tYWN0aW9ucyc7XG5cbmltcG9ydCB7IENvbnZlcnNhdGlvbkNvbG9ycyB9IGZyb20gJy4uLy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgeyBwbmdVcmwgfSBmcm9tICcuLi8uLi9zdG9yeWJvb2svRml4dHVyZXMnO1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBNZXNzYWdlc1Byb3BzIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB7IE1lc3NhZ2UsIFRleHREaXJlY3Rpb24gfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHtcbiAgQVVESU9fTVAzLFxuICBJTUFHRV9QTkcsXG4gIExPTkdfTUVTU0FHRSxcbiAgVklERU9fTVA0LFxuICBzdHJpbmdUb01JTUVUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcy9NSU1FJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL1F1b3RlJztcbmltcG9ydCB7IFF1b3RlIH0gZnJvbSAnLi9RdW90ZSc7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVJlYWRTdGF0dXMnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBXaWR0aEJyZWFrcG9pbnQgfSBmcm9tICcuLi9fdXRpbCc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnQ6IFF1b3RlLFxuICB0aXRsZTogJ0NvbXBvbmVudHMvQ29udmVyc2F0aW9uL1F1b3RlJyxcbiAgYXJnVHlwZXM6IHtcbiAgICBhdXRob3JUaXRsZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiAnRGVmYXVsdCBTZW5kZXInLFxuICAgIH0sXG4gICAgY29udmVyc2F0aW9uQ29sb3I6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ2ZvcmVzdCcsXG4gICAgfSxcbiAgICBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBpc0Zyb21NZToge1xuICAgICAgY29udHJvbDogeyB0eXBlOiAnY2hlY2tib3gnIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gICAgaXNHaWZ0QmFkZ2U6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ2NoZWNrYm94JyB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIGlzSW5jb21pbmc6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ2NoZWNrYm94JyB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIGlzVmlld09uY2U6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ2NoZWNrYm94JyB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIG9uQ2xpY2s6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25DbG9zZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICByYXdBdHRhY2htZW50OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ2NoZWNrYm94JyB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIHRleHQ6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ0Egc2FtcGxlIG1lc3NhZ2UgZnJvbSBhIHBhbCcsXG4gICAgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgZGVmYXVsdE1lc3NhZ2VQcm9wczogTWVzc2FnZXNQcm9wcyA9IHtcbiAgYXV0aG9yOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICBpZDogJ3NvbWUtaWQnLFxuICAgIHRpdGxlOiAnUGVyc29uIFgnLFxuICB9KSxcbiAgY2FuUmVhY3Q6IHRydWUsXG4gIGNhblJlcGx5OiB0cnVlLFxuICBjYW5SZXRyeTogdHJ1ZSxcbiAgY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmU6IHRydWUsXG4gIGNhbkRvd25sb2FkOiB0cnVlLFxuICBjaGVja0ZvckFjY291bnQ6IGFjdGlvbignY2hlY2tGb3JBY2NvdW50JyksXG4gIGNsZWFyU2VsZWN0ZWRNZXNzYWdlOiBhY3Rpb24oJ2RlZmF1bHQtLWNsZWFyU2VsZWN0ZWRNZXNzYWdlJyksXG4gIGNvbnRhaW5lckVsZW1lbnRSZWY6IFJlYWN0LmNyZWF0ZVJlZjxIVE1MRWxlbWVudD4oKSxcbiAgY29udGFpbmVyV2lkdGhCcmVha3BvaW50OiBXaWR0aEJyZWFrcG9pbnQuV2lkZSxcbiAgY29udmVyc2F0aW9uQ29sb3I6ICdjcmltc29uJyxcbiAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb25JZCcsXG4gIGNvbnZlcnNhdGlvblRpdGxlOiAnQ29udmVyc2F0aW9uIFRpdGxlJyxcbiAgY29udmVyc2F0aW9uVHlwZTogJ2RpcmVjdCcsIC8vIG92ZXJyaWRlXG4gIGRlbGV0ZU1lc3NhZ2U6IGFjdGlvbignZGVmYXVsdC0tZGVsZXRlTWVzc2FnZScpLFxuICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmU6IGFjdGlvbignZGVmYXVsdC0tZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lJyksXG4gIGRpcmVjdGlvbjogJ2luY29taW5nJyxcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IGFjdGlvbignZGVmYXVsdC0tZGlzcGxheVRhcFRvVmlld01lc3NhZ2UnKSxcbiAgZG93bmxvYWRBdHRhY2htZW50OiBhY3Rpb24oJ2RlZmF1bHQtLWRvd25sb2FkQXR0YWNobWVudCcpLFxuICBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZTogYWN0aW9uKFxuICAgICdkZWZhdWx0LS1kb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSdcbiAgKSxcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6ICgpID0+IHVuZGVmaW5lZCxcbiAgaTE4bixcbiAgaWQ6ICdtZXNzYWdlSWQnLFxuICByZW5kZXJpbmdDb250ZXh0OiAnc3Rvcnlib29rJyxcbiAgaW50ZXJhY3Rpb25Nb2RlOiAna2V5Ym9hcmQnLFxuICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICBpc01lc3NhZ2VSZXF1ZXN0QWNjZXB0ZWQ6IHRydWUsXG4gIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQ6IGFjdGlvbignZGVmYXVsdC0ta2lja09mZkF0dGFjaG1lbnREb3dubG9hZCcpLFxuICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkOiBhY3Rpb24oJ2RlZmF1bHQtLW1hcmtBdHRhY2htZW50QXNDb3JydXB0ZWQnKSxcbiAgbWFya1ZpZXdlZDogYWN0aW9uKCdkZWZhdWx0LS1tYXJrVmlld2VkJyksXG4gIG1lc3NhZ2VFeHBhbmRlZDogYWN0aW9uKCdkZWZhdWx0LS1tZXNzYWdlLWV4cGFuZGVkJyksXG4gIG9wZW5Db252ZXJzYXRpb246IGFjdGlvbignZGVmYXVsdC0tb3BlbkNvbnZlcnNhdGlvbicpLFxuICBvcGVuR2lmdEJhZGdlOiBhY3Rpb24oJ29wZW5HaWZ0QmFkZ2UnKSxcbiAgb3Blbkxpbms6IGFjdGlvbignZGVmYXVsdC0tb3BlbkxpbmsnKSxcbiAgcHJldmlld3M6IFtdLFxuICByZWFjdFRvTWVzc2FnZTogYWN0aW9uKCdkZWZhdWx0LS1yZWFjdFRvTWVzc2FnZScpLFxuICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gIHJlbmRlckVtb2ppUGlja2VyOiAoKSA9PiA8ZGl2IC8+LFxuICByZW5kZXJSZWFjdGlvblBpY2tlcjogKCkgPT4gPGRpdiAvPixcbiAgcmVuZGVyQXVkaW9BdHRhY2htZW50OiAoKSA9PiA8ZGl2PipBdWRpb0F0dGFjaG1lbnQqPC9kaXY+LFxuICByZXBseVRvTWVzc2FnZTogYWN0aW9uKCdkZWZhdWx0LS1yZXBseVRvTWVzc2FnZScpLFxuICByZXRyeVNlbmQ6IGFjdGlvbignZGVmYXVsdC0tcmV0cnlTZW5kJyksXG4gIHJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IGFjdGlvbignZGVmYXVsdC0tcmV0cnlEZWxldGVGb3JFdmVyeW9uZScpLFxuICBzY3JvbGxUb1F1b3RlZE1lc3NhZ2U6IGFjdGlvbignZGVmYXVsdC0tc2Nyb2xsVG9RdW90ZWRNZXNzYWdlJyksXG4gIHNlbGVjdE1lc3NhZ2U6IGFjdGlvbignZGVmYXVsdC0tc2VsZWN0TWVzc2FnZScpLFxuICBzaG91bGRDb2xsYXBzZUFib3ZlOiBmYWxzZSxcbiAgc2hvdWxkQ29sbGFwc2VCZWxvdzogZmFsc2UsXG4gIHNob3VsZEhpZGVNZXRhZGF0YTogZmFsc2UsXG4gIHNob3dDb250YWN0RGV0YWlsOiBhY3Rpb24oJ2RlZmF1bHQtLXNob3dDb250YWN0RGV0YWlsJyksXG4gIHNob3dDb250YWN0TW9kYWw6IGFjdGlvbignZGVmYXVsdC0tc2hvd0NvbnRhY3RNb2RhbCcpLFxuICBzaG93RXhwaXJlZEluY29taW5nVGFwVG9WaWV3VG9hc3Q6IGFjdGlvbihcbiAgICAnc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0J1xuICApLFxuICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3Q6IGFjdGlvbihcbiAgICAnc2hvd0V4cGlyZWRPdXRnb2luZ1RhcFRvVmlld1RvYXN0J1xuICApLFxuICBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbDogYWN0aW9uKCdkZWZhdWx0LS1zaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbCcpLFxuICBzaG93TWVzc2FnZURldGFpbDogYWN0aW9uKCdkZWZhdWx0LS1zaG93TWVzc2FnZURldGFpbCcpLFxuICBzaG93VmlzdWFsQXR0YWNobWVudDogYWN0aW9uKCdkZWZhdWx0LS1zaG93VmlzdWFsQXR0YWNobWVudCcpLFxuICBzdGFydENvbnZlcnNhdGlvbjogYWN0aW9uKCdkZWZhdWx0LS1zdGFydENvbnZlcnNhdGlvbicpLFxuICBzdGF0dXM6ICdzZW50JyxcbiAgdGV4dDogJ1RoaXMgaXMgcmVhbGx5IGludGVyZXN0aW5nLicsXG4gIHRleHREaXJlY3Rpb246IFRleHREaXJlY3Rpb24uRGVmYXVsdCxcbiAgdGhlbWU6IFRoZW1lVHlwZS5saWdodCxcbiAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICB2aWV3U3Rvcnk6IGFjdGlvbigndmlld1N0b3J5JyksXG59O1xuXG5jb25zdCByZW5kZXJJbk1lc3NhZ2UgPSAoe1xuICBhdXRob3JUaXRsZSxcbiAgY29udmVyc2F0aW9uQ29sb3IsXG4gIGlzRnJvbU1lLFxuICByYXdBdHRhY2htZW50LFxuICBpc1ZpZXdPbmNlLFxuICBpc0dpZnRCYWRnZSxcbiAgcmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZCxcbiAgdGV4dDogcXVvdGVUZXh0LFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgbWVzc2FnZVByb3BzID0ge1xuICAgIC4uLmRlZmF1bHRNZXNzYWdlUHJvcHMsXG4gICAgY29udmVyc2F0aW9uQ29sb3IsXG4gICAgcXVvdGU6IHtcbiAgICAgIGF1dGhvcklkOiAnYW4tYXV0aG9yJyxcbiAgICAgIGF1dGhvclRpdGxlLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3IsXG4gICAgICBpc0Zyb21NZSxcbiAgICAgIHJhd0F0dGFjaG1lbnQsXG4gICAgICBpc1ZpZXdPbmNlLFxuICAgICAgaXNHaWZ0QmFkZ2UsXG4gICAgICByZWZlcmVuY2VkTWVzc2FnZU5vdEZvdW5kLFxuICAgICAgc2VudEF0OiBEYXRlLm5vdygpIC0gMzAgKiAxMDAwLFxuICAgICAgdGV4dDogcXVvdGVUZXh0LFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgIDxNZXNzYWdlIHsuLi5tZXNzYWdlUHJvcHN9IC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxNZXNzYWdlIHsuLi5tZXNzYWdlUHJvcHN9IGRpcmVjdGlvbj1cIm91dGdvaW5nXCIgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wcz4gPSBhcmdzID0+IDxRdW90ZSB7Li4uYXJnc30gLz47XG5jb25zdCBUZW1wbGF0ZUluTWVzc2FnZTogU3Rvcnk8UHJvcHM+ID0gYXJncyA9PiByZW5kZXJJbk1lc3NhZ2UoYXJncyk7XG5cbmV4cG9ydCBjb25zdCBPdXRnb2luZ0J5QW5vdGhlckF1dGhvciA9IFRlbXBsYXRlLmJpbmQoe30pO1xuT3V0Z29pbmdCeUFub3RoZXJBdXRob3IuYXJncyA9IHtcbiAgYXV0aG9yVGl0bGU6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKS50aXRsZSxcbn07XG5PdXRnb2luZ0J5QW5vdGhlckF1dGhvci5zdG9yeSA9IHtcbiAgbmFtZTogJ091dGdvaW5nIGJ5IEFub3RoZXIgQXV0aG9yJyxcbn07XG5cbmV4cG9ydCBjb25zdCBPdXRnb2luZ0J5TWUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk91dGdvaW5nQnlNZS5hcmdzID0ge1xuICBpc0Zyb21NZTogdHJ1ZSxcbn07XG5PdXRnb2luZ0J5TWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdPdXRnb2luZyBieSBNZScsXG59O1xuXG5leHBvcnQgY29uc3QgSW5jb21pbmdCeUFub3RoZXJBdXRob3IgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkluY29taW5nQnlBbm90aGVyQXV0aG9yLmFyZ3MgPSB7XG4gIGF1dGhvclRpdGxlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkudGl0bGUsXG4gIGlzSW5jb21pbmc6IHRydWUsXG59O1xuSW5jb21pbmdCeUFub3RoZXJBdXRob3Iuc3RvcnkgPSB7XG4gIG5hbWU6ICdJbmNvbWluZyBieSBBbm90aGVyIEF1dGhvcicsXG59O1xuXG5leHBvcnQgY29uc3QgSW5jb21pbmdCeU1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5JbmNvbWluZ0J5TWUuYXJncyA9IHtcbiAgaXNGcm9tTWU6IHRydWUsXG4gIGlzSW5jb21pbmc6IHRydWUsXG59O1xuSW5jb21pbmdCeU1lLnN0b3J5ID0ge1xuICBuYW1lOiAnSW5jb21pbmcgYnkgTWUnLFxufTtcblxuZXhwb3J0IGNvbnN0IEluY29taW5nT3V0Z29pbmdDb2xvcnMgPSAoYXJnczogUHJvcHMpOiBKU1guRWxlbWVudCA9PiB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtDb252ZXJzYXRpb25Db2xvcnMubWFwKGNvbG9yID0+XG4gICAgICAgIHJlbmRlckluTWVzc2FnZSh7IC4uLmFyZ3MsIGNvbnZlcnNhdGlvbkNvbG9yOiBjb2xvciB9KVxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG5JbmNvbWluZ091dGdvaW5nQ29sb3JzLmFyZ3MgPSB7fTtcbkluY29taW5nT3V0Z29pbmdDb2xvcnMuc3RvcnkgPSB7XG4gIG5hbWU6ICdJbmNvbWluZy9PdXRnb2luZyBDb2xvcnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlT25seSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuSW1hZ2VPbmx5LmFyZ3MgPSB7XG4gIHRleHQ6ICcnLFxuICByYXdBdHRhY2htZW50OiB7XG4gICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICBmaWxlTmFtZTogJ3NheC5wbmcnLFxuICAgIGlzVm9pY2VNZXNzYWdlOiBmYWxzZSxcbiAgICB0aHVtYm5haWw6IHtcbiAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHdpZHRoOiAxMDAsXG4gICAgICBwYXRoOiBwbmdVcmwsXG4gICAgICBvYmplY3RVcmw6IHBuZ1VybCxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlQXR0YWNobWVudCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuSW1hZ2VBdHRhY2htZW50LmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgIGZpbGVOYW1lOiAnc2F4LnBuZycsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICAgIHRodW1ibmFpbDoge1xuICAgICAgY29udGVudFR5cGU6IElNQUdFX1BORyxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICAgIHBhdGg6IHBuZ1VybCxcbiAgICAgIG9iamVjdFVybDogcG5nVXJsLFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgSW1hZ2VBdHRhY2htZW50Tm9UaHVtYm5haWwgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkltYWdlQXR0YWNobWVudE5vVGh1bWJuYWlsLmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgIGZpbGVOYW1lOiAnc2F4LnBuZycsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICB9LFxufTtcbkltYWdlQXR0YWNobWVudE5vVGh1bWJuYWlsLnN0b3J5ID0ge1xuICBuYW1lOiAnSW1hZ2UgQXR0YWNobWVudCB3L28gVGh1bWJuYWlsJyxcbn07XG5cbmV4cG9ydCBjb25zdCBJbWFnZVRhcFRvVmlldyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuSW1hZ2VUYXBUb1ZpZXcuYXJncyA9IHtcbiAgdGV4dDogJycsXG4gIGlzVmlld09uY2U6IHRydWUsXG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgIGZpbGVOYW1lOiAnc2F4LnBuZycsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICB9LFxufTtcbkltYWdlVGFwVG9WaWV3LnN0b3J5ID0ge1xuICBuYW1lOiAnSW1hZ2UgVGFwLXRvLVZpZXcnLFxufTtcblxuZXhwb3J0IGNvbnN0IFZpZGVvT25seSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVmlkZW9Pbmx5LmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogVklERU9fTVA0LFxuICAgIGZpbGVOYW1lOiAnZ3JlYXQtdmlkZW8ubXA0JyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogZmFsc2UsXG4gICAgdGh1bWJuYWlsOiB7XG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB3aWR0aDogMTAwLFxuICAgICAgcGF0aDogcG5nVXJsLFxuICAgICAgb2JqZWN0VXJsOiBwbmdVcmwsXG4gICAgfSxcbiAgfSxcbiAgdGV4dDogdW5kZWZpbmVkLFxufTtcblxuZXhwb3J0IGNvbnN0IFZpZGVvQXR0YWNobWVudCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVmlkZW9BdHRhY2htZW50LmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogVklERU9fTVA0LFxuICAgIGZpbGVOYW1lOiAnZ3JlYXQtdmlkZW8ubXA0JyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogZmFsc2UsXG4gICAgdGh1bWJuYWlsOiB7XG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB3aWR0aDogMTAwLFxuICAgICAgcGF0aDogcG5nVXJsLFxuICAgICAgb2JqZWN0VXJsOiBwbmdVcmwsXG4gICAgfSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBWaWRlb0F0dGFjaG1lbnROb1RodW1ibmFpbCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVmlkZW9BdHRhY2htZW50Tm9UaHVtYm5haWwuYXJncyA9IHtcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBWSURFT19NUDQsXG4gICAgZmlsZU5hbWU6ICdncmVhdC12aWRlby5tcDQnLFxuICAgIGlzVm9pY2VNZXNzYWdlOiBmYWxzZSxcbiAgfSxcbn07XG5WaWRlb0F0dGFjaG1lbnROb1RodW1ibmFpbC5zdG9yeSA9IHtcbiAgbmFtZTogJ1ZpZGVvIEF0dGFjaG1lbnQgdy9vIFRodW1ibmFpbCcsXG59O1xuXG5leHBvcnQgY29uc3QgVmlkZW9UYXBUb1ZpZXcgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblZpZGVvVGFwVG9WaWV3LmFyZ3MgPSB7XG4gIHRleHQ6ICcnLFxuICBpc1ZpZXdPbmNlOiB0cnVlLFxuICByYXdBdHRhY2htZW50OiB7XG4gICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICBmaWxlTmFtZTogJ2dyZWF0LXZpZGVvLm1wNCcsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICB9LFxufTtcblZpZGVvVGFwVG9WaWV3LnN0b3J5ID0ge1xuICBuYW1lOiAnVmlkZW8gVGFwLXRvLVZpZXcnLFxufTtcblxuZXhwb3J0IGNvbnN0IEdpZnRCYWRnZSA9IFRlbXBsYXRlSW5NZXNzYWdlLmJpbmQoe30pO1xuR2lmdEJhZGdlLmFyZ3MgPSB7XG4gIHRleHQ6IFwiU29tZSB0ZXh0IHdoaWNoIHNob3VsZG4ndCBiZSByZW5kZXJlZFwiLFxuICBpc0dpZnRCYWRnZTogdHJ1ZSxcbn07XG5cbmV4cG9ydCBjb25zdCBBdWRpb09ubHkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkF1ZGlvT25seS5hcmdzID0ge1xuICByYXdBdHRhY2htZW50OiB7XG4gICAgY29udGVudFR5cGU6IEFVRElPX01QMyxcbiAgICBmaWxlTmFtZTogJ2dyZWF0LXZpZGVvLm1wMycsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICB9LFxuICB0ZXh0OiB1bmRlZmluZWQsXG59O1xuXG5leHBvcnQgY29uc3QgQXVkaW9BdHRhY2htZW50ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5BdWRpb0F0dGFjaG1lbnQuYXJncyA9IHtcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBBVURJT19NUDMsXG4gICAgZmlsZU5hbWU6ICdncmVhdC12aWRlby5tcDMnLFxuICAgIGlzVm9pY2VNZXNzYWdlOiBmYWxzZSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBWb2ljZU1lc3NhZ2VPbmx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Wb2ljZU1lc3NhZ2VPbmx5LmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogQVVESU9fTVAzLFxuICAgIGZpbGVOYW1lOiAnZ3JlYXQtdmlkZW8ubXAzJyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogdHJ1ZSxcbiAgfSxcbiAgdGV4dDogdW5kZWZpbmVkLFxufTtcblxuZXhwb3J0IGNvbnN0IFZvaWNlTWVzc2FnZUF0dGFjaG1lbnQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblZvaWNlTWVzc2FnZUF0dGFjaG1lbnQuYXJncyA9IHtcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBBVURJT19NUDMsXG4gICAgZmlsZU5hbWU6ICdncmVhdC12aWRlby5tcDMnLFxuICAgIGlzVm9pY2VNZXNzYWdlOiB0cnVlLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IE90aGVyRmlsZU9ubHkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk90aGVyRmlsZU9ubHkuYXJncyA9IHtcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBzdHJpbmdUb01JTUVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJyksXG4gICAgZmlsZU5hbWU6ICdncmVhdC1kYXRhLmpzb24nLFxuICAgIGlzVm9pY2VNZXNzYWdlOiBmYWxzZSxcbiAgfSxcbiAgdGV4dDogdW5kZWZpbmVkLFxufTtcblxuZXhwb3J0IGNvbnN0IE1lZGlhVGFwVG9WaWV3ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NZWRpYVRhcFRvVmlldy5hcmdzID0ge1xuICB0ZXh0OiAnJyxcbiAgaXNWaWV3T25jZTogdHJ1ZSxcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBBVURJT19NUDMsXG4gICAgZmlsZU5hbWU6ICdncmVhdC12aWRlby5tcDMnLFxuICAgIGlzVm9pY2VNZXNzYWdlOiBmYWxzZSxcbiAgfSxcbn07XG5NZWRpYVRhcFRvVmlldy5zdG9yeSA9IHtcbiAgbmFtZTogJ01lZGlhIFRhcC10by1WaWV3Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBPdGhlckZpbGVBdHRhY2htZW50ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5PdGhlckZpbGVBdHRhY2htZW50LmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogc3RyaW5nVG9NSU1FVHlwZSgnYXBwbGljYXRpb24vanNvbicpLFxuICAgIGZpbGVOYW1lOiAnZ3JlYXQtZGF0YS5qc29uJyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogZmFsc2UsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgTG9uZ01lc3NhZ2VBdHRhY2htZW50U2hvdWxkQmVIaWRkZW4gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkxvbmdNZXNzYWdlQXR0YWNobWVudFNob3VsZEJlSGlkZGVuLmFyZ3MgPSB7XG4gIHJhd0F0dGFjaG1lbnQ6IHtcbiAgICBjb250ZW50VHlwZTogTE9OR19NRVNTQUdFLFxuICAgIGZpbGVOYW1lOiAnc2lnbmFsLWxvbmctbWVzc2FnZS0xMjMudHh0JyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogZmFsc2UsXG4gIH0sXG59O1xuTG9uZ01lc3NhZ2VBdHRhY2htZW50U2hvdWxkQmVIaWRkZW4uc3RvcnkgPSB7XG4gIG5hbWU6ICdMb25nIG1lc3NhZ2UgYXR0YWNobWVudCAoc2hvdWxkIGJlIGhpZGRlbiknLFxufTtcblxuZXhwb3J0IGNvbnN0IE5vQ2xvc2VCdXR0b24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk5vQ2xvc2VCdXR0b24uYXJncyA9IHtcbiAgb25DbG9zZTogdW5kZWZpbmVkLFxufTtcblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VOb3RGb3VuZCA9IFRlbXBsYXRlSW5NZXNzYWdlLmJpbmQoe30pO1xuTWVzc2FnZU5vdEZvdW5kLmFyZ3MgPSB7XG4gIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgTWlzc2luZ1RleHRBdHRhY2htZW50ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NaXNzaW5nVGV4dEF0dGFjaG1lbnQuYXJncyA9IHtcbiAgdGV4dDogdW5kZWZpbmVkLFxufTtcbk1pc3NpbmdUZXh0QXR0YWNobWVudC5zdG9yeSA9IHtcbiAgbmFtZTogJ01pc3NpbmcgVGV4dCAmIEF0dGFjaG1lbnQnLFxufTtcblxuZXhwb3J0IGNvbnN0IE1lbnRpb25PdXRnb2luZ0Fub3RoZXJBdXRob3IgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk1lbnRpb25PdXRnb2luZ0Fub3RoZXJBdXRob3IuYXJncyA9IHtcbiAgYXV0aG9yVGl0bGU6ICdUb255IFN0YXJrJyxcbiAgdGV4dDogJ0BDYXB0YWluIEFtZXJpY2EgTHVuY2ggbGF0ZXI/Jyxcbn07XG5NZW50aW9uT3V0Z29pbmdBbm90aGVyQXV0aG9yLnN0b3J5ID0ge1xuICBuYW1lOiAnQG1lbnRpb24gKyBvdXRnb2luZyArIGFub3RoZXIgYXV0aG9yJyxcbn07XG5cbmV4cG9ydCBjb25zdCBNZW50aW9uT3V0Z29pbmdNZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTWVudGlvbk91dGdvaW5nTWUuYXJncyA9IHtcbiAgaXNGcm9tTWU6IHRydWUsXG4gIHRleHQ6ICdAQ2FwdGFpbiBBbWVyaWNhIEx1bmNoIGxhdGVyPycsXG59O1xuTWVudGlvbk91dGdvaW5nTWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdAbWVudGlvbiArIG91dGdvaW5nICsgbWUnLFxufTtcblxuZXhwb3J0IGNvbnN0IE1lbnRpb25JbmNvbWluZ0Fub3RoZXJBdXRob3IgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk1lbnRpb25JbmNvbWluZ0Fub3RoZXJBdXRob3IuYXJncyA9IHtcbiAgYXV0aG9yVGl0bGU6ICdDYXB0YWluIEFtZXJpY2EnLFxuICBpc0luY29taW5nOiB0cnVlLFxuICB0ZXh0OiAnQFRvbnkgU3Rhcmsgc3VyZScsXG59O1xuTWVudGlvbkluY29taW5nQW5vdGhlckF1dGhvci5zdG9yeSA9IHtcbiAgbmFtZTogJ0BtZW50aW9uICsgaW5jb21pbmcgKyBhbm90aGVyIGF1dGhvcicsXG59O1xuXG5leHBvcnQgY29uc3QgTWVudGlvbkluY29taW5nTWUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk1lbnRpb25JbmNvbWluZ01lLmFyZ3MgPSB7XG4gIGlzRnJvbU1lOiB0cnVlLFxuICBpc0luY29taW5nOiB0cnVlLFxuICB0ZXh0OiAnQFRvbnkgU3Rhcmsgc3VyZScsXG59O1xuTWVudGlvbkluY29taW5nTWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdAbWVudGlvbiArIGluY29taW5nICsgbWUnLFxufTtcblxuZXhwb3J0IGNvbnN0IEN1c3RvbUNvbG9yID0gKGFyZ3M6IFByb3BzKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8PlxuICAgIDxRdW90ZVxuICAgICAgey4uLmFyZ3N9XG4gICAgICBjdXN0b21Db2xvcj17e1xuICAgICAgICBzdGFydDogeyBodWU6IDgyLCBzYXR1cmF0aW9uOiAzNSB9LFxuICAgICAgfX1cbiAgICAvPlxuICAgIDxRdW90ZVxuICAgICAgey4uLmFyZ3N9XG4gICAgICBpc0luY29taW5nPXtmYWxzZX1cbiAgICAgIHRleHQ9XCJBIGdyYWRpZW50XCJcbiAgICAgIGN1c3RvbUNvbG9yPXt7XG4gICAgICAgIGRlZzogMTkyLFxuICAgICAgICBzdGFydDogeyBodWU6IDMwNCwgc2F0dXJhdGlvbjogODUgfSxcbiAgICAgICAgZW5kOiB7IGh1ZTogMjMxLCBzYXR1cmF0aW9uOiA3NiB9LFxuICAgICAgfX1cbiAgICAvPlxuICA8Lz5cbik7XG5DdXN0b21Db2xvci5hcmdzID0ge1xuICBpc0luY29taW5nOiB0cnVlLFxuICB0ZXh0OiAnU29saWQgKyBHcmFkaWVudCcsXG59O1xuXG5leHBvcnQgY29uc3QgSXNTdG9yeVJlcGx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Jc1N0b3J5UmVwbHkuYXJncyA9IHtcbiAgdGV4dDogJ1dvdyEnLFxuICBhdXRob3JUaXRsZTogJ0FtYW5kYScsXG4gIGlzU3RvcnlSZXBseTogdHJ1ZSxcbiAgbW9kdWxlQ2xhc3NOYW1lOiAnU3RvcnlSZXBseVF1b3RlJyxcbiAgb25DbG9zZTogdW5kZWZpbmVkLFxuICByYXdBdHRhY2htZW50OiB7XG4gICAgY29udGVudFR5cGU6IFZJREVPX01QNCxcbiAgICBmaWxlTmFtZTogJ2dyZWF0LXZpZGVvLm1wNCcsXG4gICAgaXNWb2ljZU1lc3NhZ2U6IGZhbHNlLFxuICB9LFxufTtcbklzU3RvcnlSZXBseS5zdG9yeSA9IHtcbiAgbmFtZTogJ2lzU3RvcnlSZXBseScsXG59O1xuXG5leHBvcnQgY29uc3QgSXNTdG9yeVJlcGx5RW1vamkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbklzU3RvcnlSZXBseUVtb2ppLmFyZ3MgPSB7XG4gIGF1dGhvclRpdGxlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkuZmlyc3ROYW1lLFxuICBpc1N0b3J5UmVwbHk6IHRydWUsXG4gIG1vZHVsZUNsYXNzTmFtZTogJ1N0b3J5UmVwbHlRdW90ZScsXG4gIG9uQ2xvc2U6IHVuZGVmaW5lZCxcbiAgcmF3QXR0YWNobWVudDoge1xuICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgZmlsZU5hbWU6ICdzYXgucG5nJyxcbiAgICBpc1ZvaWNlTWVzc2FnZTogZmFsc2UsXG4gICAgdGh1bWJuYWlsOiB7XG4gICAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB3aWR0aDogMTAwLFxuICAgICAgcGF0aDogcG5nVXJsLFxuICAgICAgb2JqZWN0VXJsOiBwbmdVcmwsXG4gICAgfSxcbiAgfSxcbiAgcmVhY3Rpb25FbW9qaTogJ1x1RDgzQ1x1REZDQlx1RkUwRicsXG59O1xuSXNTdG9yeVJlcGx5RW1vamkuc3RvcnkgPSB7XG4gIG5hbWU6ICdpc1N0b3J5UmVwbHkgZW1vamknLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsWUFBdUI7QUFFdkIsMkJBQXVCO0FBRXZCLG9CQUFtQztBQUNuQyxzQkFBdUI7QUFFdkIscUJBQXVDO0FBQ3ZDLGtCQU1PO0FBRVAsbUJBQXNCO0FBQ3RCLCtCQUEyQjtBQUMzQix1QkFBMEI7QUFDMUIsc0JBQXVCO0FBQ3ZCLG9DQUF1QztBQUN2QyxrQkFBZ0M7QUFDaEMsa0JBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sd0JBQVE7QUFBQSxFQUNiLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxNQUNYLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsbUJBQW1CO0FBQUEsTUFDakIsY0FBYztBQUFBLElBQ2hCO0FB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b0JBQW9CLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDakQsa0JBQWtCLE9BQU87QUFBQSxFQUN2QixVQUFVO0FBQUEsRUFDVixZQUFZO0FBQUEsRUFDWixNQUFNO0FBQ1I7QUFDQSxrQkFBa0IsUUFBUTtBQUFBLEVBQ3hCLE1BQU07QUFDUjtBQUVPLE1BQU0sY0FBYyx3QkFBQyxTQUMxQiwwREFDRSxvQ0FBQztBQUFBLEtBQ0s7QUFBQSxFQUNKLGFBQWE7QUFBQSxJQUNYLE9BQU8sRUFBRSxLQUFLLElBQUksWUFBWSxHQUFHO0FBQUEsRUFDbkM7QUFBQSxDQUNGLEdBQ0Esb0NBQUM7QUFBQSxLQUNLO0FBQUEsRUFDSixZQUFZO0FBQUEsRUFDWixNQUFLO0FBQUEsRUFDTCxhQUFhO0FBQUEsSUFDWCxLQUFLO0FBQUEsSUFDTCxPQUFPLEVBQUUsS0FBSyxLQUFLLFlBQVksR0FBRztBQUFBLElBQ2xDLEtBQUssRUFBRSxLQUFLLEtBQUssWUFBWSxHQUFHO0FBQUEsRUFDbEM7QUFBQSxDQUNGLENBQ0YsR0FsQnlCO0FBb0IzQixZQUFZLE9BQU87QUFBQSxFQUNqQixZQUFZO0FBQUEsRUFDWixNQUFNO0FBQ1I7QUFFTyxNQUFNLGVBQWUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUM1QyxhQUFhLE9BQU87QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixhQUFhO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxpQkFBaUI7QUFBQSxFQUNqQixTQUFTO0FBQUEsRUFDVCxlQUFlO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxFQUNsQjtBQUNGO0FBQ0EsYUFBYSxRQUFRO0FBQUEsRUFDbkIsTUFBTTtBQUNSO0FBRU8sTUFBTSxvQkFBb0IsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNqRCxrQkFBa0IsT0FBTztBQUFBLEVBQ3ZCLGFBQWEsMERBQXVCLEVBQUU7QUFBQSxFQUN0QyxjQUFjO0FBQUEsRUFDZCxpQkFBaUI7QUFBQSxFQUNqQixTQUFTO0FBQUEsRUFDVCxlQUFlO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixXQUFXO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWU7QUFDakI7QUFDQSxrQkFBa0IsUUFBUTtBQUFBLEVBQ3hCLE1BQU07QUFDUjsiLAogICJuYW1lcyI6IFtdCn0K
