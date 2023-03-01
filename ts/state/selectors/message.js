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
var message_exports = {};
__export(message_exports, {
  canDeleteForEveryone: () => canDeleteForEveryone,
  canDownload: () => canDownload,
  canReact: () => canReact,
  canReply: () => canReply,
  canRetryDeleteForEveryone: () => canRetryDeleteForEveryone,
  cleanBodyForDirectionCheck: () => cleanBodyForDirectionCheck,
  getAttachmentsForMessage: () => getAttachmentsForMessage,
  getBubblePropsForMessage: () => getBubblePropsForMessage,
  getContact: () => getContact,
  getContactId: () => getContactId,
  getConversation: () => getConversation,
  getLastChallengeError: () => getLastChallengeError,
  getMessagePropStatus: () => getMessagePropStatus,
  getMessagePropsSelector: () => getMessagePropsSelector,
  getPreviewsForMessage: () => getPreviewsForMessage,
  getPropsForAttachment: () => getPropsForAttachment,
  getPropsForBubble: () => getPropsForBubble,
  getPropsForCallHistory: () => getPropsForCallHistory,
  getPropsForEmbeddedContact: () => getPropsForEmbeddedContact,
  getPropsForMessage: () => getPropsForMessage,
  getPropsForQuote: () => getPropsForQuote,
  getPropsForStoryReplyContext: () => getPropsForStoryReplyContext,
  getReactionsForMessage: () => getReactionsForMessage,
  getSource: () => getSource,
  getSourceDevice: () => getSourceDevice,
  getSourceUuid: () => getSourceUuid,
  hasErrors: () => hasErrors,
  isCallHistory: () => isCallHistory,
  isChangeNumberNotification: () => isChangeNumberNotification,
  isChatSessionRefreshed: () => isChatSessionRefreshed,
  isDeliveryIssue: () => isDeliveryIssue,
  isEndSession: () => isEndSession,
  isExpirationTimerUpdate: () => isExpirationTimerUpdate,
  isGiftBadge: () => isGiftBadge,
  isGroupUpdate: () => isGroupUpdate,
  isGroupV1Migration: () => isGroupV1Migration,
  isGroupV2Change: () => isGroupV2Change,
  isIncoming: () => import_helpers.isIncoming,
  isKeyChange: () => isKeyChange,
  isOutgoing: () => import_helpers.isOutgoing,
  isProfileChange: () => isProfileChange,
  isStory: () => import_helpers.isStory,
  isTapToView: () => isTapToView,
  isUniversalTimerNotification: () => isUniversalTimerNotification,
  isUnsupportedMessage: () => isUnsupportedMessage,
  isVerifiedChange: () => isVerifiedChange,
  processBodyRanges: () => processBodyRanges
});
module.exports = __toCommonJS(message_exports);
var import_lodash = require("lodash");
var import_reselect = require("reselect");
var import_filesize = __toESM(require("filesize"));
var import_direction = __toESM(require("direction"));
var import_emoji_regex = __toESM(require("emoji-regex"));
var import_linkify_it = __toESM(require("linkify-it"));
var import_Message = require("../../components/conversation/Message");
var import_LinkPreview = require("../../types/LinkPreview");
var import_EmbeddedContact = require("../../types/EmbeddedContact");
var import_Message2 = require("../../types/Message");
var import_Calling = require("../../types/Calling");
var import_protobuf = require("../../protobuf");
var import_Attachment = require("../../types/Attachment");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_memoizeByRoot = require("../../util/memoizeByRoot");
var import_missingCaseError = require("../../util/missingCaseError");
var import_isNotNil = require("../../util/isNotNil");
var import_timestamp = require("../../util/timestamp");
var iterables = __toESM(require("../../util/iterables"));
var import_assert = require("../../util/assert");
var import_accounts = require("./accounts");
var import_conversations = require("./conversations");
var import_user = require("./user");
var import_MessageSendState = require("../../messages/MessageSendState");
var log = __toESM(require("../../logging/log"));
var import_getConversationColorAttributes = require("../../util/getConversationColorAttributes");
var import_durations = require("../../util/durations");
var import_getStoryReplyText = require("../../util/getStoryReplyText");
var import_helpers = require("../../messages/helpers");
const THREE_HOURS = 3 * import_durations.HOUR;
const linkify = (0, import_linkify_it.default)();
function hasErrors(message) {
  return message.errors ? message.errors.length > 0 : false;
}
function getSource(message, ourNumber) {
  if ((0, import_helpers.isIncoming)(message)) {
    return message.source;
  }
  if (!(0, import_helpers.isOutgoing)(message)) {
    log.warn("message.getSource: Called for non-incoming/non-outoing message");
  }
  return ourNumber;
}
function getSourceDevice(message, ourDeviceId) {
  const { sourceDevice } = message;
  if ((0, import_helpers.isIncoming)(message)) {
    return sourceDevice;
  }
  if (!(0, import_helpers.isOutgoing)(message)) {
    log.warn("message.getSourceDevice: Called for non-incoming/non-outoing message");
  }
  return sourceDevice || ourDeviceId;
}
function getSourceUuid(message, ourACI) {
  if ((0, import_helpers.isIncoming)(message)) {
    return message.sourceUuid;
  }
  if (!(0, import_helpers.isOutgoing)(message)) {
    log.warn("message.getSourceUuid: Called for non-incoming/non-outoing message");
  }
  return ourACI;
}
function getContactId(message, {
  conversationSelector,
  ourConversationId,
  ourNumber,
  ourACI
}) {
  const source = getSource(message, ourNumber);
  const sourceUuid = getSourceUuid(message, ourACI);
  if (!source && !sourceUuid) {
    return ourConversationId;
  }
  const conversation = conversationSelector(sourceUuid || source);
  return conversation.id;
}
function getContact(message, {
  conversationSelector,
  ourConversationId,
  ourNumber,
  ourACI
}) {
  const source = getSource(message, ourNumber);
  const sourceUuid = getSourceUuid(message, ourACI);
  if (!source && !sourceUuid) {
    return conversationSelector(ourConversationId);
  }
  return conversationSelector(sourceUuid || source);
}
function getConversation(message, conversationSelector) {
  return conversationSelector(message.conversationId);
}
const getAttachmentsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot)(import_lodash.identity, ({ sticker }) => sticker, ({ attachments }) => attachments, (_, sticker, attachments = []) => {
  if (sticker && sticker.data) {
    const { data } = sticker;
    if (!data.blurHash && (data.pending || !data.path)) {
      return [];
    }
    return [
      {
        ...data,
        pending: false,
        url: data.path ? window.Signal.Migrations.getAbsoluteAttachmentPath(data.path) : void 0
      }
    ];
  }
  return attachments.filter((attachment) => !attachment.error || (0, import_Attachment.canBeDownloaded)(attachment)).map((attachment) => getPropsForAttachment(attachment)).filter(import_isNotNil.isNotNil);
});
const processBodyRanges = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, ({ bodyRanges }, { conversationSelector }) => {
  if (!bodyRanges) {
    return void 0;
  }
  return bodyRanges.filter((range) => range.mentionUuid).map((range) => {
    const conversation = conversationSelector(range.mentionUuid);
    return {
      ...range,
      conversationID: conversation.id,
      replacementText: conversation.title
    };
  }).sort((a, b) => b.start - a.start);
}, (_, ranges) => ranges);
const getAuthorForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot)(import_lodash.identity, getContact, (_, convo) => {
  const {
    acceptedMessageRequest,
    avatarPath,
    badges,
    color,
    id,
    isMe,
    name,
    phoneNumber,
    profileName,
    sharedGroupNames,
    title,
    unblurredAvatarPath
  } = convo;
  const unsafe = {
    acceptedMessageRequest,
    avatarPath,
    badges,
    color,
    id,
    isMe,
    name,
    phoneNumber,
    profileName,
    sharedGroupNames,
    title,
    unblurredAvatarPath
  };
  const safe = unsafe;
  return safe;
});
const getCachedAuthorForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, getAuthorForMessage, (_, author) => author);
const getPreviewsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot)(import_lodash.identity, ({ preview }) => preview, (_, previews = []) => {
  return previews.map((preview) => ({
    ...preview,
    isStickerPack: (0, import_LinkPreview.isStickerPack)(preview.url),
    domain: (0, import_LinkPreview.getDomain)(preview.url),
    image: preview.image ? getPropsForAttachment(preview.image) : void 0
  }));
});
const getReactionsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, ({ reactions = [] }, { conversationSelector }) => {
  const reactionBySender = /* @__PURE__ */ new Map();
  for (const reaction of reactions) {
    const existingReaction = reactionBySender.get(reaction.fromId);
    if (!existingReaction || reaction.timestamp > existingReaction.timestamp) {
      reactionBySender.set(reaction.fromId, reaction);
    }
  }
  const reactionsWithEmpties = reactionBySender.values();
  const reactionsWithEmoji = iterables.filter(reactionsWithEmpties, (re) => re.emoji);
  const formattedReactions = iterables.map(reactionsWithEmoji, (re) => {
    const c = conversationSelector(re.fromId);
    const unsafe = (0, import_lodash.pick)(c, [
      "acceptedMessageRequest",
      "avatarPath",
      "badges",
      "color",
      "id",
      "isMe",
      "name",
      "phoneNumber",
      "profileName",
      "sharedGroupNames",
      "title"
    ]);
    const from = unsafe;
    (0, import_assert.strictAssert)(re.emoji, "Expected all reactions to have an emoji");
    return {
      emoji: re.emoji,
      timestamp: re.timestamp,
      from
    };
  });
  return [...formattedReactions];
}, (_, reactions) => reactions);
const getPropsForStoryReplyContext = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, (message, {
  conversationSelector,
  ourConversationId
}) => {
  const { storyReactionEmoji, storyReplyContext } = message;
  if (!storyReplyContext) {
    return void 0;
  }
  const contact = conversationSelector(storyReplyContext.authorUuid);
  const authorTitle = contact.firstName || contact.title;
  const isFromMe = contact.id === ourConversationId;
  const conversation = getConversation(message, conversationSelector);
  const { conversationColor, customColor } = (0, import_getConversationColorAttributes.getConversationColorAttributes)(conversation);
  return {
    authorTitle,
    conversationColor,
    customColor,
    emoji: storyReactionEmoji,
    isFromMe,
    rawAttachment: storyReplyContext.attachment ? processQuoteAttachment(storyReplyContext.attachment) : void 0,
    storyId: storyReplyContext.messageId,
    text: (0, import_getStoryReplyText.getStoryReplyText)(window.i18n, storyReplyContext.attachment)
  };
}, (_, storyReplyContext) => storyReplyContext);
const getPropsForQuote = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, (message, {
  conversationSelector,
  ourConversationId
}) => {
  const { quote } = message;
  if (!quote) {
    return void 0;
  }
  const {
    author,
    authorUuid,
    id: sentAt,
    isViewOnce,
    isGiftBadge: isTargetGiftBadge,
    referencedMessageNotFound,
    text = ""
  } = quote;
  const contact = conversationSelector(authorUuid || author);
  const authorId = contact.id;
  const authorName = contact.name;
  const authorPhoneNumber = contact.phoneNumber;
  const authorProfileName = contact.profileName;
  const authorTitle = contact.title;
  const isFromMe = authorId === ourConversationId;
  const firstAttachment = quote.attachments && quote.attachments[0];
  const conversation = getConversation(message, conversationSelector);
  const { conversationColor, customColor } = (0, import_getConversationColorAttributes.getConversationColorAttributes)(conversation);
  return {
    authorId,
    authorName,
    authorPhoneNumber,
    authorProfileName,
    authorTitle,
    bodyRanges: processBodyRanges(quote, { conversationSelector }),
    conversationColor,
    customColor,
    isFromMe,
    rawAttachment: firstAttachment ? processQuoteAttachment(firstAttachment) : void 0,
    isGiftBadge: Boolean(isTargetGiftBadge),
    isViewOnce,
    referencedMessageNotFound,
    sentAt: Number(sentAt),
    text
  };
}, (_, quote) => quote);
const getShallowPropsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot, import_lodash.isEqual)(import_lodash.identity, (message, {
  accountSelector,
  conversationSelector,
  ourConversationId,
  ourNumber,
  ourACI,
  regionCode,
  selectedMessageId,
  selectedMessageCounter,
  contactNameColorSelector
}) => {
  const { expireTimer, expirationStartTimestamp, conversationId } = message;
  const expirationLength = expireTimer ? expireTimer * 1e3 : void 0;
  const expirationTimestamp = expirationStartTimestamp && expirationLength ? expirationStartTimestamp + expirationLength : void 0;
  const conversation = getConversation(message, conversationSelector);
  const isGroup = conversation.type === "group";
  const { sticker } = message;
  const isMessageTapToView = isTapToView(message);
  const isSelected = message.id === selectedMessageId;
  const selectedReaction = ((message.reactions || []).find((re) => re.fromId === ourConversationId) || {}).emoji;
  const authorId = getContactId(message, {
    conversationSelector,
    ourConversationId,
    ourNumber,
    ourACI
  });
  const contactNameColor = contactNameColorSelector(conversationId, authorId);
  const { conversationColor, customColor } = (0, import_getConversationColorAttributes.getConversationColorAttributes)(conversation);
  return {
    canDeleteForEveryone: canDeleteForEveryone(message),
    canDownload: canDownload(message, conversationSelector),
    canReact: canReact(message, ourConversationId, conversationSelector),
    canReply: canReply(message, ourConversationId, conversationSelector),
    canRetry: hasErrors(message),
    canRetryDeleteForEveryone: canRetryDeleteForEveryone(message),
    contact: getPropsForEmbeddedContact(message, regionCode, accountSelector),
    contactNameColor,
    conversationColor,
    conversationId,
    conversationTitle: conversation.title,
    conversationType: isGroup ? "group" : "direct",
    customColor,
    deletedForEveryone: message.deletedForEveryone || false,
    direction: (0, import_helpers.isIncoming)(message) ? "incoming" : "outgoing",
    displayLimit: message.displayLimit,
    expirationLength,
    expirationTimestamp,
    giftBadge: message.giftBadge,
    id: message.id,
    isBlocked: conversation.isBlocked || false,
    isMessageRequestAccepted: conversation?.acceptedMessageRequest ?? true,
    isSelected,
    isSelectedCounter: isSelected ? selectedMessageCounter : void 0,
    isSticker: Boolean(sticker),
    isTapToView: isMessageTapToView,
    isTapToViewError: isMessageTapToView && (0, import_helpers.isIncoming)(message) && message.isTapToViewInvalid,
    isTapToViewExpired: isMessageTapToView && message.isErased,
    readStatus: message.readStatus ?? import_MessageReadStatus.ReadStatus.Read,
    selectedReaction,
    status: getMessagePropStatus(message, ourConversationId),
    text: message.body,
    textDirection: getTextDirection(message.body),
    timestamp: message.sent_at
  };
}, (_, props) => props);
function getTextAttachment(message) {
  return message.bodyAttachment && getPropsForAttachment(message.bodyAttachment);
}
function cleanBodyForDirectionCheck(text) {
  const MENTIONS_REGEX = (0, import_Message2.getMentionsRegex)();
  const EMOJI_REGEX = (0, import_emoji_regex.default)();
  const initial = text.replace(MENTIONS_REGEX, "").replace(EMOJI_REGEX, "");
  const linkMatches = linkify.match(initial);
  if (!linkMatches || linkMatches.length === 0) {
    return initial;
  }
  let result = "";
  let lastIndex = 0;
  linkMatches.forEach((match) => {
    if (lastIndex < match.index) {
      result += initial.slice(lastIndex, match.index);
    }
    lastIndex = match.lastIndex;
  });
  if (lastIndex < initial.length) {
    result += initial.slice(lastIndex);
  }
  return result;
}
function getTextDirection(body) {
  if (!body) {
    return import_Message.TextDirection.None;
  }
  const cleaned = cleanBodyForDirectionCheck(body);
  const direction = (0, import_direction.default)(cleaned);
  switch (direction) {
    case "ltr":
      return import_Message.TextDirection.LeftToRight;
    case "rtl":
      return import_Message.TextDirection.RightToLeft;
    case "neutral":
      return import_Message.TextDirection.Default;
    default: {
      const unexpected = direction;
      log.warn(`getTextDirection: unexpected direction ${unexpected}`);
      return import_Message.TextDirection.None;
    }
  }
}
const getPropsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot)(import_lodash.identity, getAttachmentsForMessage, processBodyRanges, getCachedAuthorForMessage, getPreviewsForMessage, getReactionsForMessage, getPropsForQuote, getPropsForStoryReplyContext, getTextAttachment, getShallowPropsForMessage, (_, attachments, bodyRanges, author, previews, reactions, quote, storyReplyContext, textAttachment, shallowProps) => {
  return {
    attachments,
    author,
    bodyRanges,
    previews,
    quote,
    reactions,
    storyReplyContext,
    textAttachment,
    ...shallowProps
  };
});
const getMessagePropsSelector = (0, import_reselect.createSelector)(import_conversations.getConversationSelector, import_user.getUserConversationId, import_user.getUserACI, import_user.getUserPNI, import_user.getUserNumber, import_user.getRegionCode, import_accounts.getAccountSelector, import_conversations.getContactNameColorSelector, import_conversations.getSelectedMessage, (conversationSelector, ourConversationId, ourACI, ourPNI, ourNumber, regionCode, accountSelector, contactNameColorSelector, selectedMessage) => (message) => {
  return getPropsForMessage(message, {
    accountSelector,
    contactNameColorSelector,
    conversationSelector,
    ourConversationId,
    ourNumber,
    ourACI,
    ourPNI,
    regionCode,
    selectedMessageCounter: selectedMessage?.counter,
    selectedMessageId: selectedMessage?.id
  });
});
const getBubblePropsForMessage = (0, import_reselect.createSelectorCreator)(import_memoizeByRoot.memoizeByRoot)(import_lodash.identity, getPropsForMessage, (_, data) => ({
  type: "message",
  data,
  timestamp: data.timestamp
}));
function getPropsForBubble(message, options) {
  const { received_at_ms: receivedAt, timestamp: messageTimestamp } = message;
  const timestamp = receivedAt || messageTimestamp;
  if (isUnsupportedMessage(message)) {
    return {
      type: "unsupportedMessage",
      data: getPropsForUnsupportedMessage(message, options),
      timestamp
    };
  }
  if (isGroupV2Change(message)) {
    return {
      type: "groupV2Change",
      data: getPropsForGroupV2Change(message, options),
      timestamp
    };
  }
  if (isGroupV1Migration(message)) {
    return {
      type: "groupV1Migration",
      data: getPropsForGroupV1Migration(message, options),
      timestamp
    };
  }
  if (isExpirationTimerUpdate(message)) {
    return {
      type: "timerNotification",
      data: getPropsForTimerNotification(message, options),
      timestamp
    };
  }
  if (isKeyChange(message)) {
    return {
      type: "safetyNumberNotification",
      data: getPropsForSafetyNumberNotification(message, options),
      timestamp
    };
  }
  if (isVerifiedChange(message)) {
    return {
      type: "verificationNotification",
      data: getPropsForVerificationNotification(message, options),
      timestamp
    };
  }
  if (isGroupUpdate(message)) {
    return {
      type: "groupNotification",
      data: getPropsForGroupNotification(message, options),
      timestamp
    };
  }
  if (isEndSession(message)) {
    return {
      type: "resetSessionNotification",
      data: null,
      timestamp
    };
  }
  if (isCallHistory(message)) {
    return {
      type: "callHistory",
      data: getPropsForCallHistory(message, options),
      timestamp
    };
  }
  if (isProfileChange(message)) {
    return {
      type: "profileChange",
      data: getPropsForProfileChange(message, options),
      timestamp
    };
  }
  if (isUniversalTimerNotification(message)) {
    return {
      type: "universalTimerNotification",
      data: null,
      timestamp
    };
  }
  if (isChangeNumberNotification(message)) {
    return {
      type: "changeNumberNotification",
      data: getPropsForChangeNumberNotification(message, options),
      timestamp
    };
  }
  if (isChatSessionRefreshed(message)) {
    return {
      type: "chatSessionRefreshed",
      data: null,
      timestamp
    };
  }
  if (isDeliveryIssue(message)) {
    return {
      type: "deliveryIssue",
      data: getPropsForDeliveryIssue(message, options),
      timestamp
    };
  }
  return getBubblePropsForMessage(message, options);
}
function isUnsupportedMessage(message) {
  const versionAtReceive = message.supportedVersionAtReceive;
  const requiredVersion = message.requiredProtocolVersion;
  return (0, import_lodash.isNumber)(versionAtReceive) && (0, import_lodash.isNumber)(requiredVersion) && versionAtReceive < requiredVersion;
}
function getPropsForUnsupportedMessage(message, options) {
  const CURRENT_PROTOCOL_VERSION = import_protobuf.SignalService.DataMessage.ProtocolVersion.CURRENT;
  const requiredVersion = message.requiredProtocolVersion;
  const canProcessNow = Boolean(CURRENT_PROTOCOL_VERSION && requiredVersion && CURRENT_PROTOCOL_VERSION >= requiredVersion);
  return {
    canProcessNow,
    contact: getContact(message, options)
  };
}
function isGroupV2Change(message) {
  return Boolean(message.groupV2Change);
}
function getPropsForGroupV2Change(message, { conversationSelector, ourACI, ourPNI }) {
  const change = message.groupV2Change;
  if (!change) {
    throw new Error("getPropsForGroupV2Change: Change is missing!");
  }
  const conversation = getConversation(message, conversationSelector);
  return {
    areWeAdmin: Boolean(conversation.areWeAdmin),
    groupName: conversation?.type === "group" ? conversation?.name : void 0,
    groupMemberships: conversation.memberships,
    groupBannedMemberships: conversation.bannedMemberships,
    ourACI,
    ourPNI,
    change
  };
}
function isGroupV1Migration(message) {
  return message.type === "group-v1-migration";
}
function getPropsForGroupV1Migration(message, { conversationSelector }) {
  const migration = message.groupMigration;
  if (!migration) {
    const invitedGV2Members = message.invitedGV2Members || [];
    const droppedGV2MemberIds = message.droppedGV2MemberIds || [];
    const invitedMembers2 = invitedGV2Members.map((item) => conversationSelector(item.uuid));
    const droppedMembers2 = droppedGV2MemberIds.map((conversationId) => conversationSelector(conversationId));
    return {
      areWeInvited: false,
      droppedMembers: droppedMembers2,
      invitedMembers: invitedMembers2
    };
  }
  const {
    areWeInvited,
    droppedMemberIds,
    invitedMembers: rawInvitedMembers
  } = migration;
  const invitedMembers = rawInvitedMembers.map((item) => conversationSelector(item.uuid));
  const droppedMembers = droppedMemberIds.map((conversationId) => conversationSelector(conversationId));
  return {
    areWeInvited,
    droppedMembers,
    invitedMembers
  };
}
function isExpirationTimerUpdate(message) {
  const flag = import_protobuf.SignalService.DataMessage.Flags.EXPIRATION_TIMER_UPDATE;
  return Boolean(message.flags && message.flags & flag);
}
function getPropsForTimerNotification(message, { ourConversationId, conversationSelector }) {
  const timerUpdate = message.expirationTimerUpdate;
  if (!timerUpdate) {
    throw new Error("getPropsForTimerNotification: missing expirationTimerUpdate!");
  }
  const { expireTimer, fromSync, source, sourceUuid } = timerUpdate;
  const disabled = !expireTimer;
  const sourceId = sourceUuid || source;
  const formattedContact = conversationSelector(sourceId);
  const basicProps = {
    ...formattedContact,
    disabled,
    expireTimer,
    type: "fromOther"
  };
  if (fromSync) {
    return {
      ...basicProps,
      type: "fromSync"
    };
  }
  if (formattedContact.id === ourConversationId) {
    return {
      ...basicProps,
      type: "fromMe"
    };
  }
  if (!sourceId) {
    return {
      ...basicProps,
      type: "fromMember"
    };
  }
  return basicProps;
}
function isKeyChange(message) {
  return message.type === "keychange";
}
function getPropsForSafetyNumberNotification(message, { conversationSelector }) {
  const conversation = getConversation(message, conversationSelector);
  const isGroup = conversation?.type === "group";
  const identifier = message.key_changed;
  const contact = conversationSelector(identifier);
  return {
    isGroup,
    contact
  };
}
function isVerifiedChange(message) {
  return message.type === "verified-change";
}
function getPropsForVerificationNotification(message, { conversationSelector }) {
  const type = message.verified ? "markVerified" : "markNotVerified";
  const isLocal = message.local || false;
  const identifier = message.verifiedChanged;
  return {
    type,
    isLocal,
    contact: conversationSelector(identifier)
  };
}
function isGiftBadge(message) {
  return Boolean(message.giftBadge);
}
function isGroupUpdate(message) {
  return Boolean(message.group_update);
}
function getPropsForGroupNotification(message, options) {
  const groupUpdate = message.group_update;
  if (!groupUpdate) {
    throw new Error("getPropsForGroupNotification: Message missing group_update");
  }
  const { conversationSelector } = options;
  const changes = [];
  if (!groupUpdate.avatarUpdated && !groupUpdate.left && !groupUpdate.joined && !groupUpdate.name) {
    changes.push({
      type: "general"
    });
  }
  if (groupUpdate.joined?.length) {
    changes.push({
      type: "add",
      contacts: (0, import_lodash.map)(Array.isArray(groupUpdate.joined) ? groupUpdate.joined : [groupUpdate.joined], (identifier) => conversationSelector(identifier))
    });
  }
  if (groupUpdate.left === "You") {
    changes.push({
      type: "remove"
    });
  } else if (groupUpdate.left) {
    changes.push({
      type: "remove",
      contacts: (0, import_lodash.map)(Array.isArray(groupUpdate.left) ? groupUpdate.left : [groupUpdate.left], (identifier) => conversationSelector(identifier))
    });
  }
  if (groupUpdate.name) {
    changes.push({
      type: "name",
      newName: groupUpdate.name
    });
  }
  if (groupUpdate.avatarUpdated) {
    changes.push({
      type: "avatar"
    });
  }
  const from = getContact(message, options);
  return {
    from,
    changes
  };
}
function isEndSession(message) {
  const flag = import_protobuf.SignalService.DataMessage.Flags.END_SESSION;
  return Boolean(message.flags && message.flags & flag);
}
function isCallHistory(message) {
  return message.type === "call-history";
}
function getPropsForCallHistory(message, {
  conversationSelector,
  callSelector,
  activeCall
}) {
  const { callHistoryDetails } = message;
  if (!callHistoryDetails) {
    throw new Error("getPropsForCallHistory: Missing callHistoryDetails");
  }
  const activeCallConversationId = activeCall?.conversationId;
  switch (callHistoryDetails.callMode) {
    case void 0:
    case import_Calling.CallMode.Direct:
      return {
        ...callHistoryDetails,
        activeCallConversationId,
        callMode: import_Calling.CallMode.Direct
      };
    case import_Calling.CallMode.Group: {
      const { conversationId } = message;
      if (!conversationId) {
        throw new Error("getPropsForCallHistory: missing conversation ID");
      }
      let call = callSelector(conversationId);
      if (call && call.callMode !== import_Calling.CallMode.Group) {
        log.error("getPropsForCallHistory: there is an unexpected non-group call; pretending it does not exist");
        call = void 0;
      }
      const creator = conversationSelector(callHistoryDetails.creatorUuid);
      const deviceCount = call?.peekInfo?.deviceCount ?? 0;
      return {
        activeCallConversationId,
        callMode: import_Calling.CallMode.Group,
        conversationId,
        creator,
        deviceCount,
        ended: callHistoryDetails.eraId !== call?.peekInfo?.eraId || !deviceCount,
        maxDevices: call?.peekInfo?.maxDevices ?? Infinity,
        startedTime: callHistoryDetails.startedTime
      };
    }
    default:
      throw new Error(`getPropsForCallHistory: missing case ${(0, import_missingCaseError.missingCaseError)(callHistoryDetails)}`);
  }
}
function isProfileChange(message) {
  return message.type === "profile-change";
}
function getPropsForProfileChange(message, { conversationSelector }) {
  const change = message.profileChange;
  const { changedId } = message;
  const changedContact = conversationSelector(changedId);
  if (!change) {
    throw new Error("getPropsForProfileChange: profileChange is undefined");
  }
  return {
    changedContact,
    change
  };
}
function isUniversalTimerNotification(message) {
  return message.type === "universal-timer-notification";
}
function isChangeNumberNotification(message) {
  return message.type === "change-number-notification";
}
function getPropsForChangeNumberNotification(message, { conversationSelector }) {
  return {
    sender: conversationSelector(message.sourceUuid),
    timestamp: message.sent_at
  };
}
function isChatSessionRefreshed(message) {
  return message.type === "chat-session-refreshed";
}
function isDeliveryIssue(message) {
  return message.type === "delivery-issue";
}
function getPropsForDeliveryIssue(message, { conversationSelector }) {
  const sender = conversationSelector(message.sourceUuid);
  const conversation = conversationSelector(message.conversationId);
  return {
    sender,
    inGroup: conversation.type === "group"
  };
}
function isTapToView(message) {
  if (message.deletedForEveryone) {
    return false;
  }
  return Boolean(message.isViewOnce || message.messageTimer);
}
function getMessagePropStatus(message, ourConversationId) {
  if (!(0, import_helpers.isOutgoing)(message)) {
    return hasErrors(message) ? "error" : void 0;
  }
  if (getLastChallengeError(message)) {
    return "paused";
  }
  const {
    deletedForEveryone,
    deletedForEveryoneFailed,
    deletedForEveryoneSendStatus,
    sendStateByConversationId = {}
  } = message;
  if (deletedForEveryone && deletedForEveryoneSendStatus) {
    if (deletedForEveryoneFailed) {
      const anySuccessfulSends = Object.values(deletedForEveryoneSendStatus).some((item) => item);
      return anySuccessfulSends ? "partial-sent" : "error";
    }
    const missingSends = Object.values(deletedForEveryoneSendStatus).some((item) => !item);
    if (missingSends) {
      return "sending";
    }
  }
  if (ourConversationId && (0, import_MessageSendState.isMessageJustForMe)(sendStateByConversationId, ourConversationId)) {
    const status = sendStateByConversationId[ourConversationId]?.status ?? import_MessageSendState.SendStatus.Pending;
    const sent = (0, import_MessageSendState.isSent)(status);
    if (hasErrors(message) || (0, import_MessageSendState.someSendStatus)(sendStateByConversationId, import_MessageSendState.isFailed)) {
      return sent ? "partial-sent" : "error";
    }
    return sent ? "viewed" : "sending";
  }
  const sendStates = Object.values(ourConversationId ? (0, import_lodash.omit)(sendStateByConversationId, ourConversationId) : sendStateByConversationId);
  const highestSuccessfulStatus = sendStates.reduce((result, { status }) => (0, import_MessageSendState.maxStatus)(result, status), import_MessageSendState.SendStatus.Pending);
  if (hasErrors(message) || (0, import_MessageSendState.someSendStatus)(sendStateByConversationId, import_MessageSendState.isFailed)) {
    return (0, import_MessageSendState.isSent)(highestSuccessfulStatus) ? "partial-sent" : "error";
  }
  if ((0, import_MessageSendState.isViewed)(highestSuccessfulStatus)) {
    return "viewed";
  }
  if ((0, import_MessageSendState.isRead)(highestSuccessfulStatus)) {
    return "read";
  }
  if ((0, import_MessageSendState.isDelivered)(highestSuccessfulStatus)) {
    return "delivered";
  }
  if ((0, import_MessageSendState.isSent)(highestSuccessfulStatus)) {
    return "sent";
  }
  return "sending";
}
function getPropsForEmbeddedContact(message, regionCode, accountSelector) {
  const contacts = message.contact;
  if (!contacts || !contacts.length) {
    return void 0;
  }
  const firstContact = contacts[0];
  const numbers = firstContact?.number;
  const firstNumber = numbers && numbers[0] ? numbers[0].value : void 0;
  return (0, import_EmbeddedContact.embeddedContactSelector)(firstContact, {
    regionCode,
    getAbsoluteAttachmentPath: window.Signal.Migrations.getAbsoluteAttachmentPath,
    firstNumber,
    uuid: accountSelector(firstNumber)
  });
}
function getPropsForAttachment(attachment) {
  if (!attachment) {
    return void 0;
  }
  const { path, pending, size, screenshot, thumbnail } = attachment;
  return {
    ...attachment,
    fileSize: size ? (0, import_filesize.default)(size) : void 0,
    isVoiceMessage: (0, import_Attachment.isVoiceMessage)(attachment),
    pending,
    url: path ? window.Signal.Migrations.getAbsoluteAttachmentPath(path) : void 0,
    screenshot: screenshot?.path ? {
      ...screenshot,
      url: window.Signal.Migrations.getAbsoluteAttachmentPath(screenshot.path)
    } : void 0,
    thumbnail: thumbnail?.path ? {
      ...thumbnail,
      url: window.Signal.Migrations.getAbsoluteAttachmentPath(thumbnail.path)
    } : void 0
  };
}
function processQuoteAttachment(attachment) {
  const { thumbnail } = attachment;
  const path = thumbnail && thumbnail.path && window.Signal.Migrations.getAbsoluteAttachmentPath(thumbnail.path);
  const objectUrl = thumbnail && thumbnail.objectUrl;
  const thumbnailWithObjectUrl = !path && !objectUrl || !thumbnail ? void 0 : { ...thumbnail, objectUrl: path || objectUrl };
  return {
    ...attachment,
    isVoiceMessage: (0, import_Attachment.isVoiceMessage)(attachment),
    thumbnail: thumbnailWithObjectUrl
  };
}
function canReplyOrReact(message, ourConversationId, conversation) {
  const { deletedForEveryone, sendStateByConversationId } = message;
  if (!conversation) {
    return false;
  }
  if (conversation.isGroupV1AndDisabled) {
    return false;
  }
  if ((0, import_conversations.isMissingRequiredProfileSharing)(conversation)) {
    return false;
  }
  if (!conversation.acceptedMessageRequest) {
    return false;
  }
  if (deletedForEveryone) {
    return false;
  }
  if ((0, import_helpers.isOutgoing)(message)) {
    return (0, import_MessageSendState.isMessageJustForMe)(sendStateByConversationId, ourConversationId) || (0, import_MessageSendState.someSendStatus)(ourConversationId ? (0, import_lodash.omit)(sendStateByConversationId, ourConversationId) : sendStateByConversationId, import_MessageSendState.isSent);
  }
  if ((0, import_helpers.isIncoming)(message)) {
    return true;
  }
  if ((0, import_helpers.isStory)(message)) {
    return Boolean(message.canReplyToStory);
  }
  return false;
}
function canReply(message, ourConversationId, conversationSelector) {
  const conversation = getConversation(message, conversationSelector);
  if (!conversation || conversation.announcementsOnly && !conversation.areWeAdmin) {
    return false;
  }
  return canReplyOrReact(message, ourConversationId, conversation);
}
function canReact(message, ourConversationId, conversationSelector) {
  const conversation = getConversation(message, conversationSelector);
  return canReplyOrReact(message, ourConversationId, conversation);
}
function canDeleteForEveryone(message) {
  return (0, import_helpers.isOutgoing)(message) && !message.deletedForEveryone && (0, import_timestamp.isMoreRecentThan)(message.sent_at, THREE_HOURS) && (0, import_MessageSendState.someSendStatus)(message.sendStateByConversationId, import_MessageSendState.isSent);
}
function canRetryDeleteForEveryone(message) {
  return Boolean(message.deletedForEveryone && message.deletedForEveryoneFailed && (0, import_timestamp.isMoreRecentThan)(message.sent_at, import_durations.DAY));
}
function canDownload(message, conversationSelector) {
  if ((0, import_helpers.isOutgoing)(message)) {
    return true;
  }
  const conversation = getConversation(message, conversationSelector);
  const isAccepted = Boolean(conversation && conversation.acceptedMessageRequest);
  if (!isAccepted) {
    return false;
  }
  const { attachments } = message;
  if (attachments && attachments.length) {
    return attachments.every((attachment) => Boolean(attachment.path));
  }
  return true;
}
function getLastChallengeError(message) {
  const { errors } = message;
  if (!errors) {
    return void 0;
  }
  const challengeErrors = errors.filter((error) => {
    return error.name === "SendMessageChallengeError" && (0, import_lodash.isNumber)(error.retryAfter) && (0, import_lodash.isObject)(error.data);
  }).sort((a, b) => a.retryAfter - b.retryAfter);
  return challengeErrors.pop();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  canDeleteForEveryone,
  canDownload,
  canReact,
  canReply,
  canRetryDeleteForEveryone,
  cleanBodyForDirectionCheck,
  getAttachmentsForMessage,
  getBubblePropsForMessage,
  getContact,
  getContactId,
  getConversation,
  getLastChallengeError,
  getMessagePropStatus,
  getMessagePropsSelector,
  getPreviewsForMessage,
  getPropsForAttachment,
  getPropsForBubble,
  getPropsForCallHistory,
  getPropsForEmbeddedContact,
  getPropsForMessage,
  getPropsForQuote,
  getPropsForStoryReplyContext,
  getReactionsForMessage,
  getSource,
  getSourceDevice,
  getSourceUuid,
  hasErrors,
  isCallHistory,
  isChangeNumberNotification,
  isChatSessionRefreshed,
  isDeliveryIssue,
  isEndSession,
  isExpirationTimerUpdate,
  isGiftBadge,
  isGroupUpdate,
  isGroupV1Migration,
  isGroupV2Change,
  isIncoming,
  isKeyChange,
  isOutgoing,
  isProfileChange,
  isStory,
  isTapToView,
  isUniversalTimerNotification,
  isUnsupportedMessage,
  isVerifiedChange,
  processBodyRanges
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlkZW50aXR5LCBpc0VxdWFsLCBpc051bWJlciwgaXNPYmplY3QsIG1hcCwgb21pdCwgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciwgY3JlYXRlU2VsZWN0b3JDcmVhdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IGZpbGVzaXplIGZyb20gJ2ZpbGVzaXplJztcbmltcG9ydCBnZXREaXJlY3Rpb24gZnJvbSAnZGlyZWN0aW9uJztcbmltcG9ydCBlbW9qaVJlZ2V4IGZyb20gJ2Vtb2ppLXJlZ2V4JztcbmltcG9ydCBMaW5raWZ5SXQgZnJvbSAnbGlua2lmeS1pdCc7XG5cbmltcG9ydCB0eXBlIHtcbiAgTGFzdE1lc3NhZ2VTdGF0dXMsXG4gIE1lc3NhZ2VSZWFjdGlvblR5cGUsXG4gIFNoYWxsb3dDaGFsbGVuZ2VFcnJvcixcbn0gZnJvbSAnLi4vLi4vbW9kZWwtdHlwZXMuZCc7XG5cbmltcG9ydCB0eXBlIHsgVGltZWxpbmVJdGVtVHlwZSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL1RpbWVsaW5lSXRlbSc7XG5pbXBvcnQgdHlwZSB7IFByb3BzRGF0YSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL01lc3NhZ2UnO1xuaW1wb3J0IHsgVGV4dERpcmVjdGlvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL01lc3NhZ2UnO1xuaW1wb3J0IHR5cGUgeyBQcm9wc0RhdGEgYXMgVGltZXJOb3RpZmljYXRpb25Qcm9wcyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL1RpbWVyTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHNEYXRhIGFzIENoYW5nZU51bWJlck5vdGlmaWNhdGlvblByb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vQ2hhbmdlTnVtYmVyTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHNEYXRhIGFzIFNhZmV0eU51bWJlck5vdGlmaWNhdGlvblByb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vU2FmZXR5TnVtYmVyTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHNEYXRhIGFzIFZlcmlmaWNhdGlvbk5vdGlmaWNhdGlvblByb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vVmVyaWZpY2F0aW9uTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHNEYXRhVHlwZSBhcyBHcm91cHNWMlByb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vR3JvdXBWMkNoYW5nZSc7XG5pbXBvcnQgdHlwZSB7IFByb3BzRGF0YVR5cGUgYXMgR3JvdXBWMU1pZ3JhdGlvblByb3BzVHlwZSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL0dyb3VwVjFNaWdyYXRpb24nO1xuaW1wb3J0IHR5cGUgeyBQcm9wc0RhdGFUeXBlIGFzIERlbGl2ZXJ5SXNzdWVQcm9wc1R5cGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi9EZWxpdmVyeUlzc3VlTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHtcbiAgUHJvcHNEYXRhIGFzIEdyb3VwTm90aWZpY2F0aW9uUHJvcHMsXG4gIENoYW5nZVR5cGUsXG59IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL0dyb3VwTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIGFzIFByb2ZpbGVDaGFuZ2VOb3RpZmljYXRpb25Qcm9wc1R5cGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi9Qcm9maWxlQ2hhbmdlTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHsgUXVvdGVkQXR0YWNobWVudFR5cGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi9RdW90ZSc7XG5cbmltcG9ydCB7IGdldERvbWFpbiwgaXNTdGlja2VyUGFjayB9IGZyb20gJy4uLy4uL3R5cGVzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcblxuaW1wb3J0IHR5cGUgeyBFbWJlZGRlZENvbnRhY3RUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvRW1iZWRkZWRDb250YWN0JztcbmltcG9ydCB7IGVtYmVkZGVkQ29udGFjdFNlbGVjdG9yIH0gZnJvbSAnLi4vLi4vdHlwZXMvRW1iZWRkZWRDb250YWN0JztcbmltcG9ydCB0eXBlIHsgQXNzZXJ0UHJvcHMsIEJvZHlSYW5nZXNUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IExpbmtQcmV2aWV3VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL21lc3NhZ2UvTGlua1ByZXZpZXdzJztcbmltcG9ydCB7IGdldE1lbnRpb25zUmVnZXggfSBmcm9tICcuLi8uLi90eXBlcy9NZXNzYWdlJztcbmltcG9ydCB7IENhbGxNb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ2FsbGluZyc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vLi4vcHJvdG9idWYnO1xuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHsgaXNWb2ljZU1lc3NhZ2UsIGNhbkJlRG93bmxvYWRlZCB9IGZyb20gJy4uLy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHsgUmVhZFN0YXR1cyB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL01lc3NhZ2VSZWFkU3RhdHVzJztcblxuaW1wb3J0IHR5cGUgeyBDYWxsaW5nTm90aWZpY2F0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvY2FsbGluZ05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBtZW1vaXplQnlSb290IH0gZnJvbSAnLi4vLi4vdXRpbC9tZW1vaXplQnlSb290JztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuLi8uLi91dGlsL2lzTm90TmlsJztcbmltcG9ydCB7IGlzTW9yZVJlY2VudFRoYW4gfSBmcm9tICcuLi8uLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgKiBhcyBpdGVyYWJsZXMgZnJvbSAnLi4vLi4vdXRpbC9pdGVyYWJsZXMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuXG5pbXBvcnQgeyBnZXRBY2NvdW50U2VsZWN0b3IgfSBmcm9tICcuL2FjY291bnRzJztcbmltcG9ydCB7XG4gIGdldENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvcixcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIGdldFNlbGVjdGVkTWVzc2FnZSxcbiAgaXNNaXNzaW5nUmVxdWlyZWRQcm9maWxlU2hhcmluZyxcbn0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7XG4gIGdldFJlZ2lvbkNvZGUsXG4gIGdldFVzZXJDb252ZXJzYXRpb25JZCxcbiAgZ2V0VXNlck51bWJlcixcbiAgZ2V0VXNlckFDSSxcbiAgZ2V0VXNlclBOSSxcbn0gZnJvbSAnLi91c2VyJztcblxuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25UeXBlLFxuICBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbn0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5cbmltcG9ydCB0eXBlIHsgQWNjb3VudFNlbGVjdG9yVHlwZSB9IGZyb20gJy4vYWNjb3VudHMnO1xuaW1wb3J0IHR5cGUgeyBDYWxsU2VsZWN0b3JUeXBlLCBDYWxsU3RhdGVUeXBlIH0gZnJvbSAnLi9jYWxsaW5nJztcbmltcG9ydCB0eXBlIHtcbiAgR2V0Q29udmVyc2F0aW9uQnlJZFR5cGUsXG4gIENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvclR5cGUsXG59IGZyb20gJy4vY29udmVyc2F0aW9ucyc7XG5pbXBvcnQge1xuICBTZW5kU3RhdHVzLFxuICBpc0RlbGl2ZXJlZCxcbiAgaXNGYWlsZWQsXG4gIGlzTWVzc2FnZUp1c3RGb3JNZSxcbiAgaXNSZWFkLFxuICBpc1NlbnQsXG4gIGlzVmlld2VkLFxuICBtYXhTdGF0dXMsXG4gIHNvbWVTZW5kU3RhdHVzLFxufSBmcm9tICcuLi8uLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBnZXRDb252ZXJzYXRpb25Db2xvckF0dHJpYnV0ZXMgfSBmcm9tICcuLi8uLi91dGlsL2dldENvbnZlcnNhdGlvbkNvbG9yQXR0cmlidXRlcyc7XG5pbXBvcnQgeyBEQVksIEhPVVIgfSBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBnZXRTdG9yeVJlcGx5VGV4dCB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0U3RvcnlSZXBseVRleHQnO1xuaW1wb3J0IHsgaXNJbmNvbWluZywgaXNPdXRnb2luZywgaXNTdG9yeSB9IGZyb20gJy4uLy4uL21lc3NhZ2VzL2hlbHBlcnMnO1xuXG5leHBvcnQgeyBpc0luY29taW5nLCBpc091dGdvaW5nLCBpc1N0b3J5IH07XG5cbmNvbnN0IFRIUkVFX0hPVVJTID0gMyAqIEhPVVI7XG5jb25zdCBsaW5raWZ5ID0gTGlua2lmeUl0KCk7XG5cbnR5cGUgRm9ybWF0dGVkQ29udGFjdCA9IFBhcnRpYWw8Q29udmVyc2F0aW9uVHlwZT4gJlxuICBQaWNrPFxuICAgIENvbnZlcnNhdGlvblR5cGUsXG4gICAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgICB8ICdpZCdcbiAgICB8ICdpc01lJ1xuICAgIHwgJ3NoYXJlZEdyb3VwTmFtZXMnXG4gICAgfCAndGl0bGUnXG4gICAgfCAndHlwZSdcbiAgICB8ICd1bmJsdXJyZWRBdmF0YXJQYXRoJ1xuICA+O1xuZXhwb3J0IHR5cGUgUHJvcHNGb3JNZXNzYWdlID0gT21pdDxQcm9wc0RhdGEsICdpbnRlcmFjdGlvbk1vZGUnPjtcbnR5cGUgUHJvcHNGb3JVbnN1cHBvcnRlZE1lc3NhZ2UgPSB7XG4gIGNhblByb2Nlc3NOb3c6IGJvb2xlYW47XG4gIGNvbnRhY3Q6IEZvcm1hdHRlZENvbnRhY3Q7XG59O1xuXG5leHBvcnQgdHlwZSBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnMgPSBSZWFkb25seTx7XG4gIGNvbnZlcnNhdGlvblNlbGVjdG9yOiBHZXRDb252ZXJzYXRpb25CeUlkVHlwZTtcbiAgb3VyQ29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gIG91ck51bWJlcj86IHN0cmluZztcbiAgb3VyQUNJPzogVVVJRFN0cmluZ1R5cGU7XG4gIG91clBOST86IFVVSURTdHJpbmdUeXBlO1xuICBzZWxlY3RlZE1lc3NhZ2VJZD86IHN0cmluZztcbiAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcj86IG51bWJlcjtcbiAgcmVnaW9uQ29kZT86IHN0cmluZztcbiAgY2FsbFNlbGVjdG9yOiBDYWxsU2VsZWN0b3JUeXBlO1xuICBhY3RpdmVDYWxsPzogQ2FsbFN0YXRlVHlwZTtcbiAgYWNjb3VudFNlbGVjdG9yOiBBY2NvdW50U2VsZWN0b3JUeXBlO1xuICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3I6IENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvclR5cGU7XG59PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0Vycm9ycyhcbiAgbWVzc2FnZTogUGljazxNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSwgJ2Vycm9ycyc+XG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lc3NhZ2UuZXJyb3JzID8gbWVzc2FnZS5lcnJvcnMubGVuZ3RoID4gMCA6IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlKFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgb3VyTnVtYmVyOiBzdHJpbmcgfCB1bmRlZmluZWRcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmIChpc0luY29taW5nKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2Uuc291cmNlO1xuICB9XG4gIGlmICghaXNPdXRnb2luZyhtZXNzYWdlKSkge1xuICAgIGxvZy53YXJuKCdtZXNzYWdlLmdldFNvdXJjZTogQ2FsbGVkIGZvciBub24taW5jb21pbmcvbm9uLW91dG9pbmcgbWVzc2FnZScpO1xuICB9XG5cbiAgcmV0dXJuIG91ck51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZURldmljZShcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIG91ckRldmljZUlkOiBudW1iZXJcbik6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgc291cmNlRGV2aWNlIH0gPSBtZXNzYWdlO1xuXG4gIGlmIChpc0luY29taW5nKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHNvdXJjZURldmljZTtcbiAgfVxuICBpZiAoIWlzT3V0Z29pbmcobWVzc2FnZSkpIHtcbiAgICBsb2cud2FybihcbiAgICAgICdtZXNzYWdlLmdldFNvdXJjZURldmljZTogQ2FsbGVkIGZvciBub24taW5jb21pbmcvbm9uLW91dG9pbmcgbWVzc2FnZSdcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHNvdXJjZURldmljZSB8fCBvdXJEZXZpY2VJZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZVV1aWQoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICBvdXJBQ0k6IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGlzSW5jb21pbmcobWVzc2FnZSkpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5zb3VyY2VVdWlkO1xuICB9XG4gIGlmICghaXNPdXRnb2luZyhtZXNzYWdlKSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgJ21lc3NhZ2UuZ2V0U291cmNlVXVpZDogQ2FsbGVkIGZvciBub24taW5jb21pbmcvbm9uLW91dG9pbmcgbWVzc2FnZSdcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG91ckFDSTtcbn1cblxuZXhwb3J0IHR5cGUgR2V0Q29udGFjdE9wdGlvbnMgPSBQaWNrPFxuICBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnMsXG4gIHwgJ2NvbnZlcnNhdGlvblNlbGVjdG9yJ1xuICB8ICdvdXJDb252ZXJzYXRpb25JZCdcbiAgfCAnb3VyTnVtYmVyJ1xuICB8ICdvdXJBQ0knXG4gIHwgJ291clBOSSdcbj47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250YWN0SWQoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICB7XG4gICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgb3VyQ29udmVyc2F0aW9uSWQsXG4gICAgb3VyTnVtYmVyLFxuICAgIG91ckFDSSxcbiAgfTogR2V0Q29udGFjdE9wdGlvbnNcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHNvdXJjZSA9IGdldFNvdXJjZShtZXNzYWdlLCBvdXJOdW1iZXIpO1xuICBjb25zdCBzb3VyY2VVdWlkID0gZ2V0U291cmNlVXVpZChtZXNzYWdlLCBvdXJBQ0kpO1xuXG4gIGlmICghc291cmNlICYmICFzb3VyY2VVdWlkKSB7XG4gICAgcmV0dXJuIG91ckNvbnZlcnNhdGlvbklkO1xuICB9XG5cbiAgY29uc3QgY29udmVyc2F0aW9uID0gY29udmVyc2F0aW9uU2VsZWN0b3Ioc291cmNlVXVpZCB8fCBzb3VyY2UpO1xuICByZXR1cm4gY29udmVyc2F0aW9uLmlkO1xufVxuXG4vLyBUT0RPOiBERVNLVE9QLTIxNDVcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250YWN0KFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAge1xuICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yLFxuICAgIG91ckNvbnZlcnNhdGlvbklkLFxuICAgIG91ck51bWJlcixcbiAgICBvdXJBQ0ksXG4gIH06IEdldENvbnRhY3RPcHRpb25zXG4pOiBDb252ZXJzYXRpb25UeXBlIHtcbiAgY29uc3Qgc291cmNlID0gZ2V0U291cmNlKG1lc3NhZ2UsIG91ck51bWJlcik7XG4gIGNvbnN0IHNvdXJjZVV1aWQgPSBnZXRTb3VyY2VVdWlkKG1lc3NhZ2UsIG91ckFDSSk7XG5cbiAgaWYgKCFzb3VyY2UgJiYgIXNvdXJjZVV1aWQpIHtcbiAgICByZXR1cm4gY29udmVyc2F0aW9uU2VsZWN0b3Iob3VyQ29udmVyc2F0aW9uSWQpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnZlcnNhdGlvblNlbGVjdG9yKHNvdXJjZVV1aWQgfHwgc291cmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnZlcnNhdGlvbihcbiAgbWVzc2FnZTogUGljazxNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSwgJ2NvbnZlcnNhdGlvbklkJz4sXG4gIGNvbnZlcnNhdGlvblNlbGVjdG9yOiBHZXRDb252ZXJzYXRpb25CeUlkVHlwZVxuKTogQ29udmVyc2F0aW9uVHlwZSB7XG4gIHJldHVybiBjb252ZXJzYXRpb25TZWxlY3RvcihtZXNzYWdlLmNvbnZlcnNhdGlvbklkKTtcbn1cblxuLy8gTWVzc2FnZVxuXG5leHBvcnQgY29uc3QgZ2V0QXR0YWNobWVudHNGb3JNZXNzYWdlID0gY3JlYXRlU2VsZWN0b3JDcmVhdG9yKG1lbW9pemVCeVJvb3QpKFxuICAvLyBgbWVtb2l6ZUJ5Um9vdGAgcmVxdWlyZW1lbnRcbiAgaWRlbnRpdHksXG5cbiAgKHsgc3RpY2tlciB9OiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSkgPT4gc3RpY2tlcixcbiAgKHsgYXR0YWNobWVudHMgfTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUpID0+IGF0dGFjaG1lbnRzLFxuICAoXywgc3RpY2tlciwgYXR0YWNobWVudHMgPSBbXSk6IEFycmF5PEF0dGFjaG1lbnRUeXBlPiA9PiB7XG4gICAgaWYgKHN0aWNrZXIgJiYgc3RpY2tlci5kYXRhKSB7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IHN0aWNrZXI7XG5cbiAgICAgIC8vIFdlIGRvbid0IHNob3cgYW55dGhpbmcgaWYgd2UgZG9uJ3QgaGF2ZSB0aGUgc3RpY2tlciBvciB0aGUgYmx1cmhhc2guLi5cbiAgICAgIGlmICghZGF0YS5ibHVySGFzaCAmJiAoZGF0YS5wZW5kaW5nIHx8ICFkYXRhLnBhdGgpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgLy8gV2Ugd2FudCB0byBzaG93IHRoZSBibHVyaGFzaCBmb3Igc3RpY2tlcnMsIG5vdCB0aGUgc3Bpbm5lclxuICAgICAgICAgIHBlbmRpbmc6IGZhbHNlLFxuICAgICAgICAgIHVybDogZGF0YS5wYXRoXG4gICAgICAgICAgICA/IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5nZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKGRhdGEucGF0aClcbiAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0YWNobWVudHNcbiAgICAgIC5maWx0ZXIoYXR0YWNobWVudCA9PiAhYXR0YWNobWVudC5lcnJvciB8fCBjYW5CZURvd25sb2FkZWQoYXR0YWNobWVudCkpXG4gICAgICAubWFwKGF0dGFjaG1lbnQgPT4gZ2V0UHJvcHNGb3JBdHRhY2htZW50KGF0dGFjaG1lbnQpKVxuICAgICAgLmZpbHRlcihpc05vdE5pbCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9jZXNzQm9keVJhbmdlcyA9IGNyZWF0ZVNlbGVjdG9yQ3JlYXRvcihtZW1vaXplQnlSb290LCBpc0VxdWFsKShcbiAgLy8gYG1lbW9pemVCeVJvb3RgIHJlcXVpcmVtZW50XG4gIGlkZW50aXR5LFxuXG4gIChcbiAgICB7IGJvZHlSYW5nZXMgfTogUGljazxNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSwgJ2JvZHlSYW5nZXMnPixcbiAgICB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH06IHsgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlIH1cbiAgKTogQm9keVJhbmdlc1R5cGUgfCB1bmRlZmluZWQgPT4ge1xuICAgIGlmICghYm9keVJhbmdlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keVJhbmdlc1xuICAgICAgLmZpbHRlcihyYW5nZSA9PiByYW5nZS5tZW50aW9uVXVpZClcbiAgICAgIC5tYXAocmFuZ2UgPT4ge1xuICAgICAgICBjb25zdCBjb252ZXJzYXRpb24gPSBjb252ZXJzYXRpb25TZWxlY3RvcihyYW5nZS5tZW50aW9uVXVpZCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5yYW5nZSxcbiAgICAgICAgICBjb252ZXJzYXRpb25JRDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgICAgIHJlcGxhY2VtZW50VGV4dDogY29udmVyc2F0aW9uLnRpdGxlLFxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnN0YXJ0IC0gYS5zdGFydCk7XG4gIH0sXG4gIChfLCByYW5nZXMpOiB1bmRlZmluZWQgfCBCb2R5UmFuZ2VzVHlwZSA9PiByYW5nZXNcbik7XG5cbmNvbnN0IGdldEF1dGhvckZvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IobWVtb2l6ZUJ5Um9vdCkoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICBnZXRDb250YWN0LFxuXG4gIChfLCBjb252bzogQ29udmVyc2F0aW9uVHlwZSk6IFByb3BzRGF0YVsnYXV0aG9yJ10gPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3QsXG4gICAgICBhdmF0YXJQYXRoLFxuICAgICAgYmFkZ2VzLFxuICAgICAgY29sb3IsXG4gICAgICBpZCxcbiAgICAgIGlzTWUsXG4gICAgICBuYW1lLFxuICAgICAgcGhvbmVOdW1iZXIsXG4gICAgICBwcm9maWxlTmFtZSxcbiAgICAgIHNoYXJlZEdyb3VwTmFtZXMsXG4gICAgICB0aXRsZSxcbiAgICAgIHVuYmx1cnJlZEF2YXRhclBhdGgsXG4gICAgfSA9IGNvbnZvO1xuXG4gICAgY29uc3QgdW5zYWZlID0ge1xuICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCxcbiAgICAgIGF2YXRhclBhdGgsXG4gICAgICBiYWRnZXMsXG4gICAgICBjb2xvcixcbiAgICAgIGlkLFxuICAgICAgaXNNZSxcbiAgICAgIG5hbWUsXG4gICAgICBwaG9uZU51bWJlcixcbiAgICAgIHByb2ZpbGVOYW1lLFxuICAgICAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgICAgIHRpdGxlLFxuICAgICAgdW5ibHVycmVkQXZhdGFyUGF0aCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2FmZTogQXNzZXJ0UHJvcHM8UHJvcHNEYXRhWydhdXRob3InXSwgdHlwZW9mIHVuc2FmZT4gPSB1bnNhZmU7XG5cbiAgICByZXR1cm4gc2FmZTtcbiAgfVxuKTtcblxuY29uc3QgZ2V0Q2FjaGVkQXV0aG9yRm9yTWVzc2FnZSA9IGNyZWF0ZVNlbGVjdG9yQ3JlYXRvcihtZW1vaXplQnlSb290LCBpc0VxdWFsKShcbiAgLy8gYG1lbW9pemVCeVJvb3RgIHJlcXVpcmVtZW50XG4gIGlkZW50aXR5LFxuICBnZXRBdXRob3JGb3JNZXNzYWdlLFxuICAoXywgYXV0aG9yKTogUHJvcHNEYXRhWydhdXRob3InXSA9PiBhdXRob3Jcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRQcmV2aWV3c0Zvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IobWVtb2l6ZUJ5Um9vdCkoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcbiAgKHsgcHJldmlldyB9OiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSkgPT4gcHJldmlldyxcbiAgKF8sIHByZXZpZXdzID0gW10pOiBBcnJheTxMaW5rUHJldmlld1R5cGU+ID0+IHtcbiAgICByZXR1cm4gcHJldmlld3MubWFwKHByZXZpZXcgPT4gKHtcbiAgICAgIC4uLnByZXZpZXcsXG4gICAgICBpc1N0aWNrZXJQYWNrOiBpc1N0aWNrZXJQYWNrKHByZXZpZXcudXJsKSxcbiAgICAgIGRvbWFpbjogZ2V0RG9tYWluKHByZXZpZXcudXJsKSxcbiAgICAgIGltYWdlOiBwcmV2aWV3LmltYWdlID8gZ2V0UHJvcHNGb3JBdHRhY2htZW50KHByZXZpZXcuaW1hZ2UpIDogdW5kZWZpbmVkLFxuICAgIH0pKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFJlYWN0aW9uc0Zvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXG4gIG1lbW9pemVCeVJvb3QsXG4gIGlzRXF1YWxcbikoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICAoXG4gICAgeyByZWFjdGlvbnMgPSBbXSB9OiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgICB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH06IHsgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlIH1cbiAgKSA9PiB7XG4gICAgY29uc3QgcmVhY3Rpb25CeVNlbmRlciA9IG5ldyBNYXA8c3RyaW5nLCBNZXNzYWdlUmVhY3Rpb25UeXBlPigpO1xuICAgIGZvciAoY29uc3QgcmVhY3Rpb24gb2YgcmVhY3Rpb25zKSB7XG4gICAgICBjb25zdCBleGlzdGluZ1JlYWN0aW9uID0gcmVhY3Rpb25CeVNlbmRlci5nZXQocmVhY3Rpb24uZnJvbUlkKTtcbiAgICAgIGlmIChcbiAgICAgICAgIWV4aXN0aW5nUmVhY3Rpb24gfHxcbiAgICAgICAgcmVhY3Rpb24udGltZXN0YW1wID4gZXhpc3RpbmdSZWFjdGlvbi50aW1lc3RhbXBcbiAgICAgICkge1xuICAgICAgICByZWFjdGlvbkJ5U2VuZGVyLnNldChyZWFjdGlvbi5mcm9tSWQsIHJlYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZWFjdGlvbnNXaXRoRW1wdGllcyA9IHJlYWN0aW9uQnlTZW5kZXIudmFsdWVzKCk7XG4gICAgY29uc3QgcmVhY3Rpb25zV2l0aEVtb2ppID0gaXRlcmFibGVzLmZpbHRlcihcbiAgICAgIHJlYWN0aW9uc1dpdGhFbXB0aWVzLFxuICAgICAgcmUgPT4gcmUuZW1vamlcbiAgICApO1xuICAgIGNvbnN0IGZvcm1hdHRlZFJlYWN0aW9ucyA9IGl0ZXJhYmxlcy5tYXAocmVhY3Rpb25zV2l0aEVtb2ppLCByZSA9PiB7XG4gICAgICBjb25zdCBjID0gY29udmVyc2F0aW9uU2VsZWN0b3IocmUuZnJvbUlkKTtcblxuICAgICAgdHlwZSBGcm9tID0gTm9uTnVsbGFibGU8UHJvcHNEYXRhWydyZWFjdGlvbnMnXT5bMF1bJ2Zyb20nXTtcblxuICAgICAgY29uc3QgdW5zYWZlID0gcGljayhjLCBbXG4gICAgICAgICdhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0JyxcbiAgICAgICAgJ2F2YXRhclBhdGgnLFxuICAgICAgICAnYmFkZ2VzJyxcbiAgICAgICAgJ2NvbG9yJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lzTWUnLFxuICAgICAgICAnbmFtZScsXG4gICAgICAgICdwaG9uZU51bWJlcicsXG4gICAgICAgICdwcm9maWxlTmFtZScsXG4gICAgICAgICdzaGFyZWRHcm91cE5hbWVzJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBmcm9tOiBBc3NlcnRQcm9wczxGcm9tLCB0eXBlb2YgdW5zYWZlPiA9IHVuc2FmZTtcblxuICAgICAgc3RyaWN0QXNzZXJ0KHJlLmVtb2ppLCAnRXhwZWN0ZWQgYWxsIHJlYWN0aW9ucyB0byBoYXZlIGFuIGVtb2ppJyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVtb2ppOiByZS5lbW9qaSxcbiAgICAgICAgdGltZXN0YW1wOiByZS50aW1lc3RhbXAsXG4gICAgICAgIGZyb20sXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFsuLi5mb3JtYXR0ZWRSZWFjdGlvbnNdO1xuICB9LFxuXG4gIChfLCByZWFjdGlvbnMpOiBQcm9wc0RhdGFbJ3JlYWN0aW9ucyddID0+IHJlYWN0aW9uc1xuKTtcblxuZXhwb3J0IGNvbnN0IGdldFByb3BzRm9yU3RvcnlSZXBseUNvbnRleHQgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXG4gIG1lbW9pemVCeVJvb3QsXG4gIGlzRXF1YWxcbikoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICAoXG4gICAgbWVzc2FnZTogUGljazxcbiAgICAgIE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICAgICAgJ2JvZHknIHwgJ2NvbnZlcnNhdGlvbklkJyB8ICdzdG9yeVJlYWN0aW9uRW1vamknIHwgJ3N0b3J5UmVwbHlDb250ZXh0J1xuICAgID4sXG4gICAge1xuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICB9OiB7XG4gICAgICBjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGU7XG4gICAgICBvdXJDb252ZXJzYXRpb25JZD86IHN0cmluZztcbiAgICB9XG4gICk6IFByb3BzRGF0YVsnc3RvcnlSZXBseUNvbnRleHQnXSA9PiB7XG4gICAgY29uc3QgeyBzdG9yeVJlYWN0aW9uRW1vamksIHN0b3J5UmVwbHlDb250ZXh0IH0gPSBtZXNzYWdlO1xuICAgIGlmICghc3RvcnlSZXBseUNvbnRleHQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFjdCA9IGNvbnZlcnNhdGlvblNlbGVjdG9yKHN0b3J5UmVwbHlDb250ZXh0LmF1dGhvclV1aWQpO1xuXG4gICAgY29uc3QgYXV0aG9yVGl0bGUgPSBjb250YWN0LmZpcnN0TmFtZSB8fCBjb250YWN0LnRpdGxlO1xuICAgIGNvbnN0IGlzRnJvbU1lID0gY29udGFjdC5pZCA9PT0gb3VyQ29udmVyc2F0aW9uSWQ7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRDb252ZXJzYXRpb24obWVzc2FnZSwgY29udmVyc2F0aW9uU2VsZWN0b3IpO1xuXG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25Db2xvciwgY3VzdG9tQ29sb3IgfSA9XG4gICAgICBnZXRDb252ZXJzYXRpb25Db2xvckF0dHJpYnV0ZXMoY29udmVyc2F0aW9uKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhdXRob3JUaXRsZSxcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgICAgY3VzdG9tQ29sb3IsXG4gICAgICBlbW9qaTogc3RvcnlSZWFjdGlvbkVtb2ppLFxuICAgICAgaXNGcm9tTWUsXG4gICAgICByYXdBdHRhY2htZW50OiBzdG9yeVJlcGx5Q29udGV4dC5hdHRhY2htZW50XG4gICAgICAgID8gcHJvY2Vzc1F1b3RlQXR0YWNobWVudChzdG9yeVJlcGx5Q29udGV4dC5hdHRhY2htZW50KVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIHN0b3J5SWQ6IHN0b3J5UmVwbHlDb250ZXh0Lm1lc3NhZ2VJZCxcbiAgICAgIHRleHQ6IGdldFN0b3J5UmVwbHlUZXh0KHdpbmRvdy5pMThuLCBzdG9yeVJlcGx5Q29udGV4dC5hdHRhY2htZW50KSxcbiAgICB9O1xuICB9LFxuXG4gIChfLCBzdG9yeVJlcGx5Q29udGV4dCk6IFByb3BzRGF0YVsnc3RvcnlSZXBseUNvbnRleHQnXSA9PiBzdG9yeVJlcGx5Q29udGV4dFxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFByb3BzRm9yUXVvdGUgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IobWVtb2l6ZUJ5Um9vdCwgaXNFcXVhbCkoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICAoXG4gICAgbWVzc2FnZTogUGljazxNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSwgJ2NvbnZlcnNhdGlvbklkJyB8ICdxdW90ZSc+LFxuICAgIHtcbiAgICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yLFxuICAgICAgb3VyQ29udmVyc2F0aW9uSWQsXG4gICAgfToge1xuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlO1xuICAgICAgb3VyQ29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gICAgfVxuICApOiBQcm9wc0RhdGFbJ3F1b3RlJ10gPT4ge1xuICAgIGNvbnN0IHsgcXVvdGUgfSA9IG1lc3NhZ2U7XG4gICAgaWYgKCFxdW90ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBhdXRob3IsXG4gICAgICBhdXRob3JVdWlkLFxuICAgICAgaWQ6IHNlbnRBdCxcbiAgICAgIGlzVmlld09uY2UsXG4gICAgICBpc0dpZnRCYWRnZTogaXNUYXJnZXRHaWZ0QmFkZ2UsXG4gICAgICByZWZlcmVuY2VkTWVzc2FnZU5vdEZvdW5kLFxuICAgICAgdGV4dCA9ICcnLFxuICAgIH0gPSBxdW90ZTtcblxuICAgIGNvbnN0IGNvbnRhY3QgPSBjb252ZXJzYXRpb25TZWxlY3RvcihhdXRob3JVdWlkIHx8IGF1dGhvcik7XG5cbiAgICBjb25zdCBhdXRob3JJZCA9IGNvbnRhY3QuaWQ7XG4gICAgY29uc3QgYXV0aG9yTmFtZSA9IGNvbnRhY3QubmFtZTtcbiAgICBjb25zdCBhdXRob3JQaG9uZU51bWJlciA9IGNvbnRhY3QucGhvbmVOdW1iZXI7XG4gICAgY29uc3QgYXV0aG9yUHJvZmlsZU5hbWUgPSBjb250YWN0LnByb2ZpbGVOYW1lO1xuICAgIGNvbnN0IGF1dGhvclRpdGxlID0gY29udGFjdC50aXRsZTtcbiAgICBjb25zdCBpc0Zyb21NZSA9IGF1dGhvcklkID09PSBvdXJDb252ZXJzYXRpb25JZDtcblxuICAgIGNvbnN0IGZpcnN0QXR0YWNobWVudCA9IHF1b3RlLmF0dGFjaG1lbnRzICYmIHF1b3RlLmF0dGFjaG1lbnRzWzBdO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldENvbnZlcnNhdGlvbihtZXNzYWdlLCBjb252ZXJzYXRpb25TZWxlY3Rvcik7XG5cbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkNvbG9yLCBjdXN0b21Db2xvciB9ID1cbiAgICAgIGdldENvbnZlcnNhdGlvbkNvbG9yQXR0cmlidXRlcyhjb252ZXJzYXRpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGF1dGhvcklkLFxuICAgICAgYXV0aG9yTmFtZSxcbiAgICAgIGF1dGhvclBob25lTnVtYmVyLFxuICAgICAgYXV0aG9yUHJvZmlsZU5hbWUsXG4gICAgICBhdXRob3JUaXRsZSxcbiAgICAgIGJvZHlSYW5nZXM6IHByb2Nlc3NCb2R5UmFuZ2VzKHF1b3RlLCB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH0pLFxuICAgICAgY29udmVyc2F0aW9uQ29sb3IsXG4gICAgICBjdXN0b21Db2xvcixcbiAgICAgIGlzRnJvbU1lLFxuICAgICAgcmF3QXR0YWNobWVudDogZmlyc3RBdHRhY2htZW50XG4gICAgICAgID8gcHJvY2Vzc1F1b3RlQXR0YWNobWVudChmaXJzdEF0dGFjaG1lbnQpXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgaXNHaWZ0QmFkZ2U6IEJvb2xlYW4oaXNUYXJnZXRHaWZ0QmFkZ2UpLFxuICAgICAgaXNWaWV3T25jZSxcbiAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQsXG4gICAgICBzZW50QXQ6IE51bWJlcihzZW50QXQpLFxuICAgICAgdGV4dCxcbiAgICB9O1xuICB9LFxuXG4gIChfLCBxdW90ZSk6IFByb3BzRGF0YVsncXVvdGUnXSA9PiBxdW90ZVxuKTtcblxuZXhwb3J0IHR5cGUgR2V0UHJvcHNGb3JNZXNzYWdlT3B0aW9ucyA9IFBpY2s8XG4gIEdldFByb3BzRm9yQnViYmxlT3B0aW9ucyxcbiAgfCAnY29udmVyc2F0aW9uU2VsZWN0b3InXG4gIHwgJ291ckNvbnZlcnNhdGlvbklkJ1xuICB8ICdvdXJBQ0knXG4gIHwgJ291clBOSSdcbiAgfCAnb3VyTnVtYmVyJ1xuICB8ICdzZWxlY3RlZE1lc3NhZ2VJZCdcbiAgfCAnc2VsZWN0ZWRNZXNzYWdlQ291bnRlcidcbiAgfCAncmVnaW9uQ29kZSdcbiAgfCAnYWNjb3VudFNlbGVjdG9yJ1xuICB8ICdjb250YWN0TmFtZUNvbG9yU2VsZWN0b3InXG4+O1xuXG50eXBlIFNoYWxsb3dQcm9wc1R5cGUgPSBQaWNrPFxuICBQcm9wc0Zvck1lc3NhZ2UsXG4gIHwgJ2NhbkRlbGV0ZUZvckV2ZXJ5b25lJ1xuICB8ICdjYW5Eb3dubG9hZCdcbiAgfCAnY2FuUmVhY3QnXG4gIHwgJ2NhblJlcGx5J1xuICB8ICdjYW5SZXRyeSdcbiAgfCAnY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZSdcbiAgfCAnY29udGFjdCdcbiAgfCAnY29udGFjdE5hbWVDb2xvcidcbiAgfCAnY29udmVyc2F0aW9uQ29sb3InXG4gIHwgJ2NvbnZlcnNhdGlvbklkJ1xuICB8ICdjb252ZXJzYXRpb25UaXRsZSdcbiAgfCAnY29udmVyc2F0aW9uVHlwZSdcbiAgfCAnY3VzdG9tQ29sb3InXG4gIHwgJ2RlbGV0ZWRGb3JFdmVyeW9uZSdcbiAgfCAnZGlyZWN0aW9uJ1xuICB8ICdkaXNwbGF5TGltaXQnXG4gIHwgJ2V4cGlyYXRpb25MZW5ndGgnXG4gIHwgJ2V4cGlyYXRpb25UaW1lc3RhbXAnXG4gIHwgJ2dpZnRCYWRnZSdcbiAgfCAnaWQnXG4gIHwgJ2lzQmxvY2tlZCdcbiAgfCAnaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkJ1xuICB8ICdpc1NlbGVjdGVkJ1xuICB8ICdpc1NlbGVjdGVkQ291bnRlcidcbiAgfCAnaXNTdGlja2VyJ1xuICB8ICdpc1RhcFRvVmlldydcbiAgfCAnaXNUYXBUb1ZpZXdFcnJvcidcbiAgfCAnaXNUYXBUb1ZpZXdFeHBpcmVkJ1xuICB8ICdyZWFkU3RhdHVzJ1xuICB8ICdzZWxlY3RlZFJlYWN0aW9uJ1xuICB8ICdzdGF0dXMnXG4gIHwgJ3RleHQnXG4gIHwgJ3RleHREaXJlY3Rpb24nXG4gIHwgJ3RpbWVzdGFtcCdcbj47XG5cbmNvbnN0IGdldFNoYWxsb3dQcm9wc0Zvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IobWVtb2l6ZUJ5Um9vdCwgaXNFcXVhbCkoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICAoXG4gICAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gICAge1xuICAgICAgYWNjb3VudFNlbGVjdG9yLFxuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgIG91ck51bWJlcixcbiAgICAgIG91ckFDSSxcbiAgICAgIHJlZ2lvbkNvZGUsXG4gICAgICBzZWxlY3RlZE1lc3NhZ2VJZCxcbiAgICAgIHNlbGVjdGVkTWVzc2FnZUNvdW50ZXIsXG4gICAgICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3IsXG4gICAgfTogR2V0UHJvcHNGb3JNZXNzYWdlT3B0aW9uc1xuICApOiBTaGFsbG93UHJvcHNUeXBlID0+IHtcbiAgICBjb25zdCB7IGV4cGlyZVRpbWVyLCBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAsIGNvbnZlcnNhdGlvbklkIH0gPSBtZXNzYWdlO1xuICAgIGNvbnN0IGV4cGlyYXRpb25MZW5ndGggPSBleHBpcmVUaW1lciA/IGV4cGlyZVRpbWVyICogMTAwMCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBleHBpcmF0aW9uVGltZXN0YW1wID1cbiAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCAmJiBleHBpcmF0aW9uTGVuZ3RoXG4gICAgICAgID8gZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wICsgZXhwaXJhdGlvbkxlbmd0aFxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldENvbnZlcnNhdGlvbihtZXNzYWdlLCBjb252ZXJzYXRpb25TZWxlY3Rvcik7XG4gICAgY29uc3QgaXNHcm91cCA9IGNvbnZlcnNhdGlvbi50eXBlID09PSAnZ3JvdXAnO1xuICAgIGNvbnN0IHsgc3RpY2tlciB9ID0gbWVzc2FnZTtcblxuICAgIGNvbnN0IGlzTWVzc2FnZVRhcFRvVmlldyA9IGlzVGFwVG9WaWV3KG1lc3NhZ2UpO1xuXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IG1lc3NhZ2UuaWQgPT09IHNlbGVjdGVkTWVzc2FnZUlkO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRSZWFjdGlvbiA9IChcbiAgICAgIChtZXNzYWdlLnJlYWN0aW9ucyB8fCBbXSkuZmluZChyZSA9PiByZS5mcm9tSWQgPT09IG91ckNvbnZlcnNhdGlvbklkKSB8fFxuICAgICAge31cbiAgICApLmVtb2ppO1xuXG4gICAgY29uc3QgYXV0aG9ySWQgPSBnZXRDb250YWN0SWQobWVzc2FnZSwge1xuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgIG91ck51bWJlcixcbiAgICAgIG91ckFDSSxcbiAgICB9KTtcbiAgICBjb25zdCBjb250YWN0TmFtZUNvbG9yID0gY29udGFjdE5hbWVDb2xvclNlbGVjdG9yKGNvbnZlcnNhdGlvbklkLCBhdXRob3JJZCk7XG5cbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkNvbG9yLCBjdXN0b21Db2xvciB9ID1cbiAgICAgIGdldENvbnZlcnNhdGlvbkNvbG9yQXR0cmlidXRlcyhjb252ZXJzYXRpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbkRlbGV0ZUZvckV2ZXJ5b25lOiBjYW5EZWxldGVGb3JFdmVyeW9uZShtZXNzYWdlKSxcbiAgICAgIGNhbkRvd25sb2FkOiBjYW5Eb3dubG9hZChtZXNzYWdlLCBjb252ZXJzYXRpb25TZWxlY3RvciksXG4gICAgICBjYW5SZWFjdDogY2FuUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGNvbnZlcnNhdGlvblNlbGVjdG9yKSxcbiAgICAgIGNhblJlcGx5OiBjYW5SZXBseShtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCwgY29udmVyc2F0aW9uU2VsZWN0b3IpLFxuICAgICAgY2FuUmV0cnk6IGhhc0Vycm9ycyhtZXNzYWdlKSxcbiAgICAgIGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmU6IGNhblJldHJ5RGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZSksXG4gICAgICBjb250YWN0OiBnZXRQcm9wc0ZvckVtYmVkZGVkQ29udGFjdChtZXNzYWdlLCByZWdpb25Db2RlLCBhY2NvdW50U2VsZWN0b3IpLFxuICAgICAgY29udGFjdE5hbWVDb2xvcixcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBjb252ZXJzYXRpb25UaXRsZTogY29udmVyc2F0aW9uLnRpdGxlLFxuICAgICAgY29udmVyc2F0aW9uVHlwZTogaXNHcm91cCA/ICdncm91cCcgOiAnZGlyZWN0JyxcbiAgICAgIGN1c3RvbUNvbG9yLFxuICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lOiBtZXNzYWdlLmRlbGV0ZWRGb3JFdmVyeW9uZSB8fCBmYWxzZSxcbiAgICAgIGRpcmVjdGlvbjogaXNJbmNvbWluZyhtZXNzYWdlKSA/ICdpbmNvbWluZycgOiAnb3V0Z29pbmcnLFxuICAgICAgZGlzcGxheUxpbWl0OiBtZXNzYWdlLmRpc3BsYXlMaW1pdCxcbiAgICAgIGV4cGlyYXRpb25MZW5ndGgsXG4gICAgICBleHBpcmF0aW9uVGltZXN0YW1wLFxuICAgICAgZ2lmdEJhZGdlOiBtZXNzYWdlLmdpZnRCYWRnZSxcbiAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgaXNCbG9ja2VkOiBjb252ZXJzYXRpb24uaXNCbG9ja2VkIHx8IGZhbHNlLFxuICAgICAgaXNNZXNzYWdlUmVxdWVzdEFjY2VwdGVkOiBjb252ZXJzYXRpb24/LmFjY2VwdGVkTWVzc2FnZVJlcXVlc3QgPz8gdHJ1ZSxcbiAgICAgIGlzU2VsZWN0ZWQsXG4gICAgICBpc1NlbGVjdGVkQ291bnRlcjogaXNTZWxlY3RlZCA/IHNlbGVjdGVkTWVzc2FnZUNvdW50ZXIgOiB1bmRlZmluZWQsXG4gICAgICBpc1N0aWNrZXI6IEJvb2xlYW4oc3RpY2tlciksXG4gICAgICBpc1RhcFRvVmlldzogaXNNZXNzYWdlVGFwVG9WaWV3LFxuICAgICAgaXNUYXBUb1ZpZXdFcnJvcjpcbiAgICAgICAgaXNNZXNzYWdlVGFwVG9WaWV3ICYmIGlzSW5jb21pbmcobWVzc2FnZSkgJiYgbWVzc2FnZS5pc1RhcFRvVmlld0ludmFsaWQsXG4gICAgICBpc1RhcFRvVmlld0V4cGlyZWQ6IGlzTWVzc2FnZVRhcFRvVmlldyAmJiBtZXNzYWdlLmlzRXJhc2VkLFxuICAgICAgcmVhZFN0YXR1czogbWVzc2FnZS5yZWFkU3RhdHVzID8/IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlbGVjdGVkUmVhY3Rpb24sXG4gICAgICBzdGF0dXM6IGdldE1lc3NhZ2VQcm9wU3RhdHVzKG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkKSxcbiAgICAgIHRleHQ6IG1lc3NhZ2UuYm9keSxcbiAgICAgIHRleHREaXJlY3Rpb246IGdldFRleHREaXJlY3Rpb24obWVzc2FnZS5ib2R5KSxcbiAgICAgIHRpbWVzdGFtcDogbWVzc2FnZS5zZW50X2F0LFxuICAgIH07XG4gIH0sXG5cbiAgKF86IHVua25vd24sIHByb3BzOiBTaGFsbG93UHJvcHNUeXBlKSA9PiBwcm9wc1xuKTtcblxuZnVuY3Rpb24gZ2V0VGV4dEF0dGFjaG1lbnQoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlXG4pOiBBdHRhY2htZW50VHlwZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiAoXG4gICAgbWVzc2FnZS5ib2R5QXR0YWNobWVudCAmJiBnZXRQcm9wc0ZvckF0dGFjaG1lbnQobWVzc2FnZS5ib2R5QXR0YWNobWVudClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuQm9keUZvckRpcmVjdGlvbkNoZWNrKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IE1FTlRJT05TX1JFR0VYID0gZ2V0TWVudGlvbnNSZWdleCgpO1xuICBjb25zdCBFTU9KSV9SRUdFWCA9IGVtb2ppUmVnZXgoKTtcbiAgY29uc3QgaW5pdGlhbCA9IHRleHQucmVwbGFjZShNRU5USU9OU19SRUdFWCwgJycpLnJlcGxhY2UoRU1PSklfUkVHRVgsICcnKTtcblxuICBjb25zdCBsaW5rTWF0Y2hlcyA9IGxpbmtpZnkubWF0Y2goaW5pdGlhbCk7XG5cbiAgaWYgKCFsaW5rTWF0Y2hlcyB8fCBsaW5rTWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaW5pdGlhbDtcbiAgfVxuXG4gIGxldCByZXN1bHQgPSAnJztcbiAgbGV0IGxhc3RJbmRleCA9IDA7XG5cbiAgbGlua01hdGNoZXMuZm9yRWFjaChtYXRjaCA9PiB7XG4gICAgaWYgKGxhc3RJbmRleCA8IG1hdGNoLmluZGV4KSB7XG4gICAgICByZXN1bHQgKz0gaW5pdGlhbC5zbGljZShsYXN0SW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICB9XG5cbiAgICAvLyBkcm9wIHRoZSBhY3R1YWwgY29udGVudHMgb2YgdGhlIG1hdGNoXG5cbiAgICBsYXN0SW5kZXggPSBtYXRjaC5sYXN0SW5kZXg7XG4gIH0pO1xuXG4gIGlmIChsYXN0SW5kZXggPCBpbml0aWFsLmxlbmd0aCkge1xuICAgIHJlc3VsdCArPSBpbml0aWFsLnNsaWNlKGxhc3RJbmRleCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0RGlyZWN0aW9uKGJvZHk/OiBzdHJpbmcpOiBUZXh0RGlyZWN0aW9uIHtcbiAgaWYgKCFib2R5KSB7XG4gICAgcmV0dXJuIFRleHREaXJlY3Rpb24uTm9uZTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFuZWQgPSBjbGVhbkJvZHlGb3JEaXJlY3Rpb25DaGVjayhib2R5KTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGNsZWFuZWQpO1xuICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgIGNhc2UgJ2x0cic6XG4gICAgICByZXR1cm4gVGV4dERpcmVjdGlvbi5MZWZ0VG9SaWdodDtcbiAgICBjYXNlICdydGwnOlxuICAgICAgcmV0dXJuIFRleHREaXJlY3Rpb24uUmlnaHRUb0xlZnQ7XG4gICAgY2FzZSAnbmV1dHJhbCc6XG4gICAgICByZXR1cm4gVGV4dERpcmVjdGlvbi5EZWZhdWx0O1xuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IHVuZXhwZWN0ZWQ6IG5ldmVyID0gZGlyZWN0aW9uO1xuICAgICAgbG9nLndhcm4oYGdldFRleHREaXJlY3Rpb246IHVuZXhwZWN0ZWQgZGlyZWN0aW9uICR7dW5leHBlY3RlZH1gKTtcbiAgICAgIHJldHVybiBUZXh0RGlyZWN0aW9uLk5vbmU7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRQcm9wc0Zvck1lc3NhZ2U6IChcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIG9wdGlvbnM6IEdldFByb3BzRm9yTWVzc2FnZU9wdGlvbnNcbikgPT4gT21pdDxQcm9wc0Zvck1lc3NhZ2UsICdyZW5kZXJpbmdDb250ZXh0Jz4gPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IoXG4gIG1lbW9pemVCeVJvb3RcbikoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICBnZXRBdHRhY2htZW50c0Zvck1lc3NhZ2UsXG4gIHByb2Nlc3NCb2R5UmFuZ2VzLFxuICBnZXRDYWNoZWRBdXRob3JGb3JNZXNzYWdlLFxuICBnZXRQcmV2aWV3c0Zvck1lc3NhZ2UsXG4gIGdldFJlYWN0aW9uc0Zvck1lc3NhZ2UsXG4gIGdldFByb3BzRm9yUXVvdGUsXG4gIGdldFByb3BzRm9yU3RvcnlSZXBseUNvbnRleHQsXG4gIGdldFRleHRBdHRhY2htZW50LFxuICBnZXRTaGFsbG93UHJvcHNGb3JNZXNzYWdlLFxuICAoXG4gICAgXyxcbiAgICBhdHRhY2htZW50czogQXJyYXk8QXR0YWNobWVudFR5cGU+LFxuICAgIGJvZHlSYW5nZXM6IEJvZHlSYW5nZXNUeXBlIHwgdW5kZWZpbmVkLFxuICAgIGF1dGhvcjogUHJvcHNEYXRhWydhdXRob3InXSxcbiAgICBwcmV2aWV3czogQXJyYXk8TGlua1ByZXZpZXdUeXBlPixcbiAgICByZWFjdGlvbnM6IFByb3BzRGF0YVsncmVhY3Rpb25zJ10sXG4gICAgcXVvdGU6IFByb3BzRGF0YVsncXVvdGUnXSxcbiAgICBzdG9yeVJlcGx5Q29udGV4dDogUHJvcHNEYXRhWydzdG9yeVJlcGx5Q29udGV4dCddLFxuICAgIHRleHRBdHRhY2htZW50OiBQcm9wc0RhdGFbJ3RleHRBdHRhY2htZW50J10sXG4gICAgc2hhbGxvd1Byb3BzOiBTaGFsbG93UHJvcHNUeXBlXG4gICk6IE9taXQ8UHJvcHNGb3JNZXNzYWdlLCAncmVuZGVyaW5nQ29udGV4dCc+ID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBhdXRob3IsXG4gICAgICBib2R5UmFuZ2VzLFxuICAgICAgcHJldmlld3MsXG4gICAgICBxdW90ZSxcbiAgICAgIHJlYWN0aW9ucyxcbiAgICAgIHN0b3J5UmVwbHlDb250ZXh0LFxuICAgICAgdGV4dEF0dGFjaG1lbnQsXG4gICAgICAuLi5zaGFsbG93UHJvcHMsXG4gICAgfTtcbiAgfVxuKTtcblxuLy8gVGhpcyBpcyBnZXRQcm9wc0Zvck1lc3NhZ2UgYnV0IHdyYXBwZWQgaW4gcmVzZWxlY3QncyBjcmVhdGVTZWxlY3RvciBzbyB0aGF0XG4vLyB3ZSBjYW4gZGVyaXZlIGFsbCBvZiB0aGUgc2VsZWN0b3IgZGVwZW5kZW5jaWVzIHRoYXQgZ2V0UHJvcHNGb3JNZXNzYWdlXG4vLyByZXF1aXJlcyBhbmQgeW91IHdvbid0IGhhdmUgdG8gcGFzcyB0aGVtIGluLiBGb3IgdXNlIHdpdGhpbiBhIHNtYXJ0L2Nvbm5lY3RlZFxuLy8gY29tcG9uZW50IHRoYXQgaGFzIGFjY2VzcyB0byBzZWxlY3RvcnMuXG5leHBvcnQgY29uc3QgZ2V0TWVzc2FnZVByb3BzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIGdldFVzZXJDb252ZXJzYXRpb25JZCxcbiAgZ2V0VXNlckFDSSxcbiAgZ2V0VXNlclBOSSxcbiAgZ2V0VXNlck51bWJlcixcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgZ2V0QWNjb3VudFNlbGVjdG9yLFxuICBnZXRDb250YWN0TmFtZUNvbG9yU2VsZWN0b3IsXG4gIGdldFNlbGVjdGVkTWVzc2FnZSxcbiAgKFxuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgIG91ckFDSSxcbiAgICAgIG91clBOSSxcbiAgICAgIG91ck51bWJlcixcbiAgICAgIHJlZ2lvbkNvZGUsXG4gICAgICBhY2NvdW50U2VsZWN0b3IsXG4gICAgICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3IsXG4gICAgICBzZWxlY3RlZE1lc3NhZ2VcbiAgICApID0+XG4gICAgKG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0UHJvcHNGb3JNZXNzYWdlKG1lc3NhZ2UsIHtcbiAgICAgICAgYWNjb3VudFNlbGVjdG9yLFxuICAgICAgICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3IsXG4gICAgICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yLFxuICAgICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgICAgb3VyTnVtYmVyLFxuICAgICAgICBvdXJBQ0ksXG4gICAgICAgIG91clBOSSxcbiAgICAgICAgcmVnaW9uQ29kZSxcbiAgICAgICAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcjogc2VsZWN0ZWRNZXNzYWdlPy5jb3VudGVyLFxuICAgICAgICBzZWxlY3RlZE1lc3NhZ2VJZDogc2VsZWN0ZWRNZXNzYWdlPy5pZCxcbiAgICAgIH0pO1xuICAgIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRCdWJibGVQcm9wc0Zvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvckNyZWF0b3IobWVtb2l6ZUJ5Um9vdCkoXG4gIC8vIGBtZW1vaXplQnlSb290YCByZXF1aXJlbWVudFxuICBpZGVudGl0eSxcblxuICBnZXRQcm9wc0Zvck1lc3NhZ2UsXG5cbiAgKF8sIGRhdGEpOiBUaW1lbGluZUl0ZW1UeXBlID0+ICh7XG4gICAgdHlwZTogJ21lc3NhZ2UnIGFzIGNvbnN0LFxuICAgIGRhdGEsXG4gICAgdGltZXN0YW1wOiBkYXRhLnRpbWVzdGFtcCxcbiAgfSlcbik7XG5cbi8vIFRvcC1sZXZlbCBwcm9wIGdlbmVyYXRpb24gZm9yIHRoZSBtZXNzYWdlIGJ1YmJsZVxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BzRm9yQnViYmxlKFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgb3B0aW9uczogR2V0UHJvcHNGb3JCdWJibGVPcHRpb25zXG4pOiBUaW1lbGluZUl0ZW1UeXBlIHtcbiAgY29uc3QgeyByZWNlaXZlZF9hdF9tczogcmVjZWl2ZWRBdCwgdGltZXN0YW1wOiBtZXNzYWdlVGltZXN0YW1wIH0gPSBtZXNzYWdlO1xuICBjb25zdCB0aW1lc3RhbXAgPSByZWNlaXZlZEF0IHx8IG1lc3NhZ2VUaW1lc3RhbXA7XG5cbiAgaWYgKGlzVW5zdXBwb3J0ZWRNZXNzYWdlKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICd1bnN1cHBvcnRlZE1lc3NhZ2UnLFxuICAgICAgZGF0YTogZ2V0UHJvcHNGb3JVbnN1cHBvcnRlZE1lc3NhZ2UobWVzc2FnZSwgb3B0aW9ucyksXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuICBpZiAoaXNHcm91cFYyQ2hhbmdlKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdncm91cFYyQ2hhbmdlJyxcbiAgICAgIGRhdGE6IGdldFByb3BzRm9yR3JvdXBWMkNoYW5nZShtZXNzYWdlLCBvcHRpb25zKSxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICB9XG4gIGlmIChpc0dyb3VwVjFNaWdyYXRpb24obWVzc2FnZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dyb3VwVjFNaWdyYXRpb24nLFxuICAgICAgZGF0YTogZ2V0UHJvcHNGb3JHcm91cFYxTWlncmF0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gIH1cbiAgaWYgKGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICd0aW1lck5vdGlmaWNhdGlvbicsXG4gICAgICBkYXRhOiBnZXRQcm9wc0ZvclRpbWVyTm90aWZpY2F0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gIH1cbiAgaWYgKGlzS2V5Q2hhbmdlKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdzYWZldHlOdW1iZXJOb3RpZmljYXRpb24nLFxuICAgICAgZGF0YTogZ2V0UHJvcHNGb3JTYWZldHlOdW1iZXJOb3RpZmljYXRpb24obWVzc2FnZSwgb3B0aW9ucyksXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuICBpZiAoaXNWZXJpZmllZENoYW5nZShtZXNzYWdlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAndmVyaWZpY2F0aW9uTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IGdldFByb3BzRm9yVmVyaWZpY2F0aW9uTm90aWZpY2F0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gIH1cbiAgaWYgKGlzR3JvdXBVcGRhdGUobWVzc2FnZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dyb3VwTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IGdldFByb3BzRm9yR3JvdXBOb3RpZmljYXRpb24obWVzc2FnZSwgb3B0aW9ucyksXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuICBpZiAoaXNFbmRTZXNzaW9uKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZXNldFNlc3Npb25Ob3RpZmljYXRpb24nLFxuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICB9XG4gIGlmIChpc0NhbGxIaXN0b3J5KG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdjYWxsSGlzdG9yeScsXG4gICAgICBkYXRhOiBnZXRQcm9wc0ZvckNhbGxIaXN0b3J5KG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gIH1cbiAgaWYgKGlzUHJvZmlsZUNoYW5nZShtZXNzYWdlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncHJvZmlsZUNoYW5nZScsXG4gICAgICBkYXRhOiBnZXRQcm9wc0ZvclByb2ZpbGVDaGFuZ2UobWVzc2FnZSwgb3B0aW9ucyksXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuICBpZiAoaXNVbml2ZXJzYWxUaW1lck5vdGlmaWNhdGlvbihtZXNzYWdlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAndW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24nLFxuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICB9XG4gIGlmIChpc0NoYW5nZU51bWJlck5vdGlmaWNhdGlvbihtZXNzYWdlKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnY2hhbmdlTnVtYmVyTm90aWZpY2F0aW9uJyxcbiAgICAgIGRhdGE6IGdldFByb3BzRm9yQ2hhbmdlTnVtYmVyTm90aWZpY2F0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gIH1cbiAgaWYgKGlzQ2hhdFNlc3Npb25SZWZyZXNoZWQobWVzc2FnZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2NoYXRTZXNzaW9uUmVmcmVzaGVkJyxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuICBpZiAoaXNEZWxpdmVyeUlzc3VlKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdkZWxpdmVyeUlzc3VlJyxcbiAgICAgIGRhdGE6IGdldFByb3BzRm9yRGVsaXZlcnlJc3N1ZShtZXNzYWdlLCBvcHRpb25zKSxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGdldEJ1YmJsZVByb3BzRm9yTWVzc2FnZShtZXNzYWdlLCBvcHRpb25zKTtcbn1cblxuLy8gVW5zdXBwb3J0ZWQgTWVzc2FnZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVbnN1cHBvcnRlZE1lc3NhZ2UoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlXG4pOiBib29sZWFuIHtcbiAgY29uc3QgdmVyc2lvbkF0UmVjZWl2ZSA9IG1lc3NhZ2Uuc3VwcG9ydGVkVmVyc2lvbkF0UmVjZWl2ZTtcbiAgY29uc3QgcmVxdWlyZWRWZXJzaW9uID0gbWVzc2FnZS5yZXF1aXJlZFByb3RvY29sVmVyc2lvbjtcblxuICByZXR1cm4gKFxuICAgIGlzTnVtYmVyKHZlcnNpb25BdFJlY2VpdmUpICYmXG4gICAgaXNOdW1iZXIocmVxdWlyZWRWZXJzaW9uKSAmJlxuICAgIHZlcnNpb25BdFJlY2VpdmUgPCByZXF1aXJlZFZlcnNpb25cbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHNGb3JVbnN1cHBvcnRlZE1lc3NhZ2UoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICBvcHRpb25zOiBHZXRDb250YWN0T3B0aW9uc1xuKTogUHJvcHNGb3JVbnN1cHBvcnRlZE1lc3NhZ2Uge1xuICBjb25zdCBDVVJSRU5UX1BST1RPQ09MX1ZFUlNJT04gPSBQcm90by5EYXRhTWVzc2FnZS5Qcm90b2NvbFZlcnNpb24uQ1VSUkVOVDtcblxuICBjb25zdCByZXF1aXJlZFZlcnNpb24gPSBtZXNzYWdlLnJlcXVpcmVkUHJvdG9jb2xWZXJzaW9uO1xuICBjb25zdCBjYW5Qcm9jZXNzTm93ID0gQm9vbGVhbihcbiAgICBDVVJSRU5UX1BST1RPQ09MX1ZFUlNJT04gJiZcbiAgICAgIHJlcXVpcmVkVmVyc2lvbiAmJlxuICAgICAgQ1VSUkVOVF9QUk9UT0NPTF9WRVJTSU9OID49IHJlcXVpcmVkVmVyc2lvblxuICApO1xuXG4gIHJldHVybiB7XG4gICAgY2FuUHJvY2Vzc05vdyxcbiAgICBjb250YWN0OiBnZXRDb250YWN0KG1lc3NhZ2UsIG9wdGlvbnMpLFxuICB9O1xufVxuXG4vLyBHcm91cFYyIENoYW5nZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHcm91cFYyQ2hhbmdlKG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKG1lc3NhZ2UuZ3JvdXBWMkNoYW5nZSk7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BzRm9yR3JvdXBWMkNoYW5nZShcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIHsgY29udmVyc2F0aW9uU2VsZWN0b3IsIG91ckFDSSwgb3VyUE5JIH06IEdldFByb3BzRm9yQnViYmxlT3B0aW9uc1xuKTogR3JvdXBzVjJQcm9wcyB7XG4gIGNvbnN0IGNoYW5nZSA9IG1lc3NhZ2UuZ3JvdXBWMkNoYW5nZTtcblxuICBpZiAoIWNoYW5nZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UHJvcHNGb3JHcm91cFYyQ2hhbmdlOiBDaGFuZ2UgaXMgbWlzc2luZyEnKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldENvbnZlcnNhdGlvbihtZXNzYWdlLCBjb252ZXJzYXRpb25TZWxlY3Rvcik7XG5cbiAgcmV0dXJuIHtcbiAgICBhcmVXZUFkbWluOiBCb29sZWFuKGNvbnZlcnNhdGlvbi5hcmVXZUFkbWluKSxcbiAgICBncm91cE5hbWU6IGNvbnZlcnNhdGlvbj8udHlwZSA9PT0gJ2dyb3VwJyA/IGNvbnZlcnNhdGlvbj8ubmFtZSA6IHVuZGVmaW5lZCxcbiAgICBncm91cE1lbWJlcnNoaXBzOiBjb252ZXJzYXRpb24ubWVtYmVyc2hpcHMsXG4gICAgZ3JvdXBCYW5uZWRNZW1iZXJzaGlwczogY29udmVyc2F0aW9uLmJhbm5lZE1lbWJlcnNoaXBzLFxuICAgIG91ckFDSSxcbiAgICBvdXJQTkksXG4gICAgY2hhbmdlLFxuICB9O1xufVxuXG4vLyBHcm91cFYxIE1pZ3JhdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gaXNHcm91cFYxTWlncmF0aW9uKG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICdncm91cC12MS1taWdyYXRpb24nO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wc0Zvckdyb3VwVjFNaWdyYXRpb24oXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH06IEdldFByb3BzRm9yQnViYmxlT3B0aW9uc1xuKTogR3JvdXBWMU1pZ3JhdGlvblByb3BzVHlwZSB7XG4gIGNvbnN0IG1pZ3JhdGlvbiA9IG1lc3NhZ2UuZ3JvdXBNaWdyYXRpb247XG4gIGlmICghbWlncmF0aW9uKSB7XG4gICAgLy8gQmFja3dhcmRzLWNvbXBhdGliaWxpdHkgd2l0aCBkYXRhIHNjaGVtYSBpbiBlYXJseSBiZXRhc1xuICAgIGNvbnN0IGludml0ZWRHVjJNZW1iZXJzID0gbWVzc2FnZS5pbnZpdGVkR1YyTWVtYmVycyB8fCBbXTtcbiAgICBjb25zdCBkcm9wcGVkR1YyTWVtYmVySWRzID0gbWVzc2FnZS5kcm9wcGVkR1YyTWVtYmVySWRzIHx8IFtdO1xuXG4gICAgY29uc3QgaW52aXRlZE1lbWJlcnMgPSBpbnZpdGVkR1YyTWVtYmVycy5tYXAoaXRlbSA9PlxuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IoaXRlbS51dWlkKVxuICAgICk7XG4gICAgY29uc3QgZHJvcHBlZE1lbWJlcnMgPSBkcm9wcGVkR1YyTWVtYmVySWRzLm1hcChjb252ZXJzYXRpb25JZCA9PlxuICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IoY29udmVyc2F0aW9uSWQpXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhcmVXZUludml0ZWQ6IGZhbHNlLFxuICAgICAgZHJvcHBlZE1lbWJlcnMsXG4gICAgICBpbnZpdGVkTWVtYmVycyxcbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGFyZVdlSW52aXRlZCxcbiAgICBkcm9wcGVkTWVtYmVySWRzLFxuICAgIGludml0ZWRNZW1iZXJzOiByYXdJbnZpdGVkTWVtYmVycyxcbiAgfSA9IG1pZ3JhdGlvbjtcbiAgY29uc3QgaW52aXRlZE1lbWJlcnMgPSByYXdJbnZpdGVkTWVtYmVycy5tYXAoaXRlbSA9PlxuICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yKGl0ZW0udXVpZClcbiAgKTtcbiAgY29uc3QgZHJvcHBlZE1lbWJlcnMgPSBkcm9wcGVkTWVtYmVySWRzLm1hcChjb252ZXJzYXRpb25JZCA9PlxuICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yKGNvbnZlcnNhdGlvbklkKVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgYXJlV2VJbnZpdGVkLFxuICAgIGRyb3BwZWRNZW1iZXJzLFxuICAgIGludml0ZWRNZW1iZXJzLFxuICB9O1xufVxuXG4vLyBOb3RlOiBwcm9wcyBhcmUgbnVsbCFcblxuLy8gRXhwaXJhdGlvbiBUaW1lciBVcGRhdGVcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlKFxuICBtZXNzYWdlOiBQaWNrPE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLCAnZmxhZ3MnPlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGZsYWcgPSBQcm90by5EYXRhTWVzc2FnZS5GbGFncy5FWFBJUkFUSU9OX1RJTUVSX1VQREFURTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgcmV0dXJuIEJvb2xlYW4obWVzc2FnZS5mbGFncyAmJiBtZXNzYWdlLmZsYWdzICYgZmxhZyk7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BzRm9yVGltZXJOb3RpZmljYXRpb24oXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICB7IG91ckNvbnZlcnNhdGlvbklkLCBjb252ZXJzYXRpb25TZWxlY3RvciB9OiBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnNcbik6IFRpbWVyTm90aWZpY2F0aW9uUHJvcHMge1xuICBjb25zdCB0aW1lclVwZGF0ZSA9IG1lc3NhZ2UuZXhwaXJhdGlvblRpbWVyVXBkYXRlO1xuICBpZiAoIXRpbWVyVXBkYXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2dldFByb3BzRm9yVGltZXJOb3RpZmljYXRpb246IG1pc3NpbmcgZXhwaXJhdGlvblRpbWVyVXBkYXRlISdcbiAgICApO1xuICB9XG5cbiAgY29uc3QgeyBleHBpcmVUaW1lciwgZnJvbVN5bmMsIHNvdXJjZSwgc291cmNlVXVpZCB9ID0gdGltZXJVcGRhdGU7XG4gIGNvbnN0IGRpc2FibGVkID0gIWV4cGlyZVRpbWVyO1xuICBjb25zdCBzb3VyY2VJZCA9IHNvdXJjZVV1aWQgfHwgc291cmNlO1xuICBjb25zdCBmb3JtYXR0ZWRDb250YWN0ID0gY29udmVyc2F0aW9uU2VsZWN0b3Ioc291cmNlSWQpO1xuXG4gIGNvbnN0IGJhc2ljUHJvcHMgPSB7XG4gICAgLi4uZm9ybWF0dGVkQ29udGFjdCxcbiAgICBkaXNhYmxlZCxcbiAgICBleHBpcmVUaW1lcixcbiAgICB0eXBlOiAnZnJvbU90aGVyJyBhcyBjb25zdCxcbiAgfTtcblxuICBpZiAoZnJvbVN5bmMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmFzaWNQcm9wcyxcbiAgICAgIHR5cGU6ICdmcm9tU3luYycgYXMgY29uc3QsXG4gICAgfTtcbiAgfVxuICBpZiAoZm9ybWF0dGVkQ29udGFjdC5pZCA9PT0gb3VyQ29udmVyc2F0aW9uSWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmFzaWNQcm9wcyxcbiAgICAgIHR5cGU6ICdmcm9tTWUnIGFzIGNvbnN0LFxuICAgIH07XG4gIH1cbiAgaWYgKCFzb3VyY2VJZCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5iYXNpY1Byb3BzLFxuICAgICAgdHlwZTogJ2Zyb21NZW1iZXInIGFzIGNvbnN0LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gYmFzaWNQcm9wcztcbn1cblxuLy8gS2V5IENoYW5nZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXlDaGFuZ2UobWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gJ2tleWNoYW5nZSc7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BzRm9yU2FmZXR5TnVtYmVyTm90aWZpY2F0aW9uKFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgeyBjb252ZXJzYXRpb25TZWxlY3RvciB9OiBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnNcbik6IFNhZmV0eU51bWJlck5vdGlmaWNhdGlvblByb3BzIHtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gZ2V0Q29udmVyc2F0aW9uKG1lc3NhZ2UsIGNvbnZlcnNhdGlvblNlbGVjdG9yKTtcbiAgY29uc3QgaXNHcm91cCA9IGNvbnZlcnNhdGlvbj8udHlwZSA9PT0gJ2dyb3VwJztcbiAgY29uc3QgaWRlbnRpZmllciA9IG1lc3NhZ2Uua2V5X2NoYW5nZWQ7XG4gIGNvbnN0IGNvbnRhY3QgPSBjb252ZXJzYXRpb25TZWxlY3RvcihpZGVudGlmaWVyKTtcblxuICByZXR1cm4ge1xuICAgIGlzR3JvdXAsXG4gICAgY29udGFjdCxcbiAgfTtcbn1cblxuLy8gVmVyaWZpZWQgQ2hhbmdlXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZlcmlmaWVkQ2hhbmdlKG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICd2ZXJpZmllZC1jaGFuZ2UnO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wc0ZvclZlcmlmaWNhdGlvbk5vdGlmaWNhdGlvbihcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIHsgY29udmVyc2F0aW9uU2VsZWN0b3IgfTogR2V0UHJvcHNGb3JCdWJibGVPcHRpb25zXG4pOiBWZXJpZmljYXRpb25Ob3RpZmljYXRpb25Qcm9wcyB7XG4gIGNvbnN0IHR5cGUgPSBtZXNzYWdlLnZlcmlmaWVkID8gJ21hcmtWZXJpZmllZCcgOiAnbWFya05vdFZlcmlmaWVkJztcbiAgY29uc3QgaXNMb2NhbCA9IG1lc3NhZ2UubG9jYWwgfHwgZmFsc2U7XG4gIGNvbnN0IGlkZW50aWZpZXIgPSBtZXNzYWdlLnZlcmlmaWVkQ2hhbmdlZDtcblxuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgaXNMb2NhbCxcbiAgICBjb250YWN0OiBjb252ZXJzYXRpb25TZWxlY3RvcihpZGVudGlmaWVyKSxcbiAgfTtcbn1cblxuLy8gR2lmdCBCYWRnZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHaWZ0QmFkZ2UoXG4gIG1lc3NhZ2U6IFBpY2s8TWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsICdnaWZ0QmFkZ2UnPlxuKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKG1lc3NhZ2UuZ2lmdEJhZGdlKTtcbn1cblxuLy8gR3JvdXAgVXBkYXRlIChWMSlcblxuZXhwb3J0IGZ1bmN0aW9uIGlzR3JvdXBVcGRhdGUoXG4gIG1lc3NhZ2U6IFBpY2s8TWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsICdncm91cF91cGRhdGUnPlxuKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKG1lc3NhZ2UuZ3JvdXBfdXBkYXRlKTtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHNGb3JHcm91cE5vdGlmaWNhdGlvbihcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIG9wdGlvbnM6IEdldENvbnRhY3RPcHRpb25zXG4pOiBHcm91cE5vdGlmaWNhdGlvblByb3BzIHtcbiAgY29uc3QgZ3JvdXBVcGRhdGUgPSBtZXNzYWdlLmdyb3VwX3VwZGF0ZTtcbiAgaWYgKCFncm91cFVwZGF0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdnZXRQcm9wc0Zvckdyb3VwTm90aWZpY2F0aW9uOiBNZXNzYWdlIG1pc3NpbmcgZ3JvdXBfdXBkYXRlJ1xuICAgICk7XG4gIH1cblxuICBjb25zdCB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH0gPSBvcHRpb25zO1xuXG4gIGNvbnN0IGNoYW5nZXMgPSBbXTtcblxuICBpZiAoXG4gICAgIWdyb3VwVXBkYXRlLmF2YXRhclVwZGF0ZWQgJiZcbiAgICAhZ3JvdXBVcGRhdGUubGVmdCAmJlxuICAgICFncm91cFVwZGF0ZS5qb2luZWQgJiZcbiAgICAhZ3JvdXBVcGRhdGUubmFtZVxuICApIHtcbiAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgdHlwZTogJ2dlbmVyYWwnIGFzIENoYW5nZVR5cGUsXG4gICAgfSk7XG4gIH1cblxuICBpZiAoZ3JvdXBVcGRhdGUuam9pbmVkPy5sZW5ndGgpIHtcbiAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgdHlwZTogJ2FkZCcgYXMgQ2hhbmdlVHlwZSxcbiAgICAgIGNvbnRhY3RzOiBtYXAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkoZ3JvdXBVcGRhdGUuam9pbmVkKVxuICAgICAgICAgID8gZ3JvdXBVcGRhdGUuam9pbmVkXG4gICAgICAgICAgOiBbZ3JvdXBVcGRhdGUuam9pbmVkXSxcbiAgICAgICAgaWRlbnRpZmllciA9PiBjb252ZXJzYXRpb25TZWxlY3RvcihpZGVudGlmaWVyKVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChncm91cFVwZGF0ZS5sZWZ0ID09PSAnWW91Jykge1xuICAgIGNoYW5nZXMucHVzaCh7XG4gICAgICB0eXBlOiAncmVtb3ZlJyBhcyBDaGFuZ2VUeXBlLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKGdyb3VwVXBkYXRlLmxlZnQpIHtcbiAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3JlbW92ZScgYXMgQ2hhbmdlVHlwZSxcbiAgICAgIGNvbnRhY3RzOiBtYXAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkoZ3JvdXBVcGRhdGUubGVmdCkgPyBncm91cFVwZGF0ZS5sZWZ0IDogW2dyb3VwVXBkYXRlLmxlZnRdLFxuICAgICAgICBpZGVudGlmaWVyID0+IGNvbnZlcnNhdGlvblNlbGVjdG9yKGlkZW50aWZpZXIpXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGdyb3VwVXBkYXRlLm5hbWUpIHtcbiAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgdHlwZTogJ25hbWUnIGFzIENoYW5nZVR5cGUsXG4gICAgICBuZXdOYW1lOiBncm91cFVwZGF0ZS5uYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGdyb3VwVXBkYXRlLmF2YXRhclVwZGF0ZWQpIHtcbiAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgdHlwZTogJ2F2YXRhcicgYXMgQ2hhbmdlVHlwZSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGZyb20gPSBnZXRDb250YWN0KG1lc3NhZ2UsIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7XG4gICAgZnJvbSxcbiAgICBjaGFuZ2VzLFxuICB9O1xufVxuXG4vLyBFbmQgU2Vzc2lvblxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbmRTZXNzaW9uKFxuICBtZXNzYWdlOiBQaWNrPE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLCAnZmxhZ3MnPlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGZsYWcgPSBQcm90by5EYXRhTWVzc2FnZS5GbGFncy5FTkRfU0VTU0lPTjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgcmV0dXJuIEJvb2xlYW4obWVzc2FnZS5mbGFncyAmJiBtZXNzYWdlLmZsYWdzICYgZmxhZyk7XG59XG5cbi8vIENhbGwgSGlzdG9yeVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDYWxsSGlzdG9yeShtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbWVzc2FnZS50eXBlID09PSAnY2FsbC1oaXN0b3J5Jztcbn1cblxuZXhwb3J0IHR5cGUgR2V0UHJvcHNGb3JDYWxsSGlzdG9yeU9wdGlvbnMgPSBQaWNrPFxuICBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnMsXG4gICdjb252ZXJzYXRpb25TZWxlY3RvcicgfCAnY2FsbFNlbGVjdG9yJyB8ICdhY3RpdmVDYWxsJ1xuPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3BzRm9yQ2FsbEhpc3RvcnkoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICB7XG4gICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgY2FsbFNlbGVjdG9yLFxuICAgIGFjdGl2ZUNhbGwsXG4gIH06IEdldFByb3BzRm9yQ2FsbEhpc3RvcnlPcHRpb25zXG4pOiBDYWxsaW5nTm90aWZpY2F0aW9uVHlwZSB7XG4gIGNvbnN0IHsgY2FsbEhpc3RvcnlEZXRhaWxzIH0gPSBtZXNzYWdlO1xuICBpZiAoIWNhbGxIaXN0b3J5RGV0YWlscykge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0UHJvcHNGb3JDYWxsSGlzdG9yeTogTWlzc2luZyBjYWxsSGlzdG9yeURldGFpbHMnKTtcbiAgfVxuXG4gIGNvbnN0IGFjdGl2ZUNhbGxDb252ZXJzYXRpb25JZCA9IGFjdGl2ZUNhbGw/LmNvbnZlcnNhdGlvbklkO1xuXG4gIHN3aXRjaCAoY2FsbEhpc3RvcnlEZXRhaWxzLmNhbGxNb2RlKSB7XG4gICAgLy8gT2xkIG1lc3NhZ2VzIHdlcmVuJ3Qgc2F2ZWQgd2l0aCBhIGNhbGwgbW9kZS5cbiAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICBjYXNlIENhbGxNb2RlLkRpcmVjdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmNhbGxIaXN0b3J5RGV0YWlscyxcbiAgICAgICAgYWN0aXZlQ2FsbENvbnZlcnNhdGlvbklkLFxuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgfTtcbiAgICBjYXNlIENhbGxNb2RlLkdyb3VwOiB7XG4gICAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkIH0gPSBtZXNzYWdlO1xuICAgICAgaWYgKCFjb252ZXJzYXRpb25JZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFByb3BzRm9yQ2FsbEhpc3Rvcnk6IG1pc3NpbmcgY29udmVyc2F0aW9uIElEJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBjYWxsID0gY2FsbFNlbGVjdG9yKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGlmIChjYWxsICYmIGNhbGwuY2FsbE1vZGUgIT09IENhbGxNb2RlLkdyb3VwKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAnZ2V0UHJvcHNGb3JDYWxsSGlzdG9yeTogdGhlcmUgaXMgYW4gdW5leHBlY3RlZCBub24tZ3JvdXAgY2FsbDsgcHJldGVuZGluZyBpdCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgKTtcbiAgICAgICAgY2FsbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3JlYXRvciA9IGNvbnZlcnNhdGlvblNlbGVjdG9yKGNhbGxIaXN0b3J5RGV0YWlscy5jcmVhdG9yVXVpZCk7XG4gICAgICBjb25zdCBkZXZpY2VDb3VudCA9IGNhbGw/LnBlZWtJbmZvPy5kZXZpY2VDb3VudCA/PyAwO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhY3RpdmVDYWxsQ29udmVyc2F0aW9uSWQsXG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIGNyZWF0b3IsXG4gICAgICAgIGRldmljZUNvdW50LFxuICAgICAgICBlbmRlZDpcbiAgICAgICAgICBjYWxsSGlzdG9yeURldGFpbHMuZXJhSWQgIT09IGNhbGw/LnBlZWtJbmZvPy5lcmFJZCB8fCAhZGV2aWNlQ291bnQsXG4gICAgICAgIG1heERldmljZXM6IGNhbGw/LnBlZWtJbmZvPy5tYXhEZXZpY2VzID8/IEluZmluaXR5LFxuICAgICAgICBzdGFydGVkVGltZTogY2FsbEhpc3RvcnlEZXRhaWxzLnN0YXJ0ZWRUaW1lLFxuICAgICAgfTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGdldFByb3BzRm9yQ2FsbEhpc3Rvcnk6IG1pc3NpbmcgY2FzZSAke21pc3NpbmdDYXNlRXJyb3IoXG4gICAgICAgICAgY2FsbEhpc3RvcnlEZXRhaWxzXG4gICAgICAgICl9YFxuICAgICAgKTtcbiAgfVxufVxuXG4vLyBQcm9maWxlIENoYW5nZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9maWxlQ2hhbmdlKG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICdwcm9maWxlLWNoYW5nZSc7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BzRm9yUHJvZmlsZUNoYW5nZShcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIHsgY29udmVyc2F0aW9uU2VsZWN0b3IgfTogR2V0UHJvcHNGb3JCdWJibGVPcHRpb25zXG4pOiBQcm9maWxlQ2hhbmdlTm90aWZpY2F0aW9uUHJvcHNUeXBlIHtcbiAgY29uc3QgY2hhbmdlID0gbWVzc2FnZS5wcm9maWxlQ2hhbmdlO1xuICBjb25zdCB7IGNoYW5nZWRJZCB9ID0gbWVzc2FnZTtcbiAgY29uc3QgY2hhbmdlZENvbnRhY3QgPSBjb252ZXJzYXRpb25TZWxlY3RvcihjaGFuZ2VkSWQpO1xuXG4gIGlmICghY2hhbmdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRQcm9wc0ZvclByb2ZpbGVDaGFuZ2U6IHByb2ZpbGVDaGFuZ2UgaXMgdW5kZWZpbmVkJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNoYW5nZWRDb250YWN0LFxuICAgIGNoYW5nZSxcbiAgfSBhcyBQcm9maWxlQ2hhbmdlTm90aWZpY2F0aW9uUHJvcHNUeXBlO1xufVxuXG4vLyBVbml2ZXJzYWwgVGltZXIgTm90aWZpY2F0aW9uXG5cbi8vIE5vdGU6IHNtYXJ0LCBzbyBwcm9wcyBub3QgZ2VuZXJhdGVkIGhlcmVcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24oXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gJ3VuaXZlcnNhbC10aW1lci1ub3RpZmljYXRpb24nO1xufVxuXG4vLyBDaGFuZ2UgTnVtYmVyIE5vdGlmaWNhdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGFuZ2VOdW1iZXJOb3RpZmljYXRpb24oXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gJ2NoYW5nZS1udW1iZXItbm90aWZpY2F0aW9uJztcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHNGb3JDaGFuZ2VOdW1iZXJOb3RpZmljYXRpb24oXG4gIG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICB7IGNvbnZlcnNhdGlvblNlbGVjdG9yIH06IEdldFByb3BzRm9yQnViYmxlT3B0aW9uc1xuKTogQ2hhbmdlTnVtYmVyTm90aWZpY2F0aW9uUHJvcHMge1xuICByZXR1cm4ge1xuICAgIHNlbmRlcjogY29udmVyc2F0aW9uU2VsZWN0b3IobWVzc2FnZS5zb3VyY2VVdWlkKSxcbiAgICB0aW1lc3RhbXA6IG1lc3NhZ2Uuc2VudF9hdCxcbiAgfTtcbn1cblxuLy8gQ2hhdCBTZXNzaW9uIFJlZnJlc2hlZFxuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGF0U2Vzc2lvblJlZnJlc2hlZChcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGVcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gbWVzc2FnZS50eXBlID09PSAnY2hhdC1zZXNzaW9uLXJlZnJlc2hlZCc7XG59XG5cbi8vIE5vdGU6IHByb3BzIGFyZSBudWxsXG5cbi8vIERlbGl2ZXJ5IElzc3VlXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlbGl2ZXJ5SXNzdWUobWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gJ2RlbGl2ZXJ5LWlzc3VlJztcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHNGb3JEZWxpdmVyeUlzc3VlKFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgeyBjb252ZXJzYXRpb25TZWxlY3RvciB9OiBHZXRQcm9wc0ZvckJ1YmJsZU9wdGlvbnNcbik6IERlbGl2ZXJ5SXNzdWVQcm9wc1R5cGUge1xuICBjb25zdCBzZW5kZXIgPSBjb252ZXJzYXRpb25TZWxlY3RvcihtZXNzYWdlLnNvdXJjZVV1aWQpO1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBjb252ZXJzYXRpb25TZWxlY3RvcihtZXNzYWdlLmNvbnZlcnNhdGlvbklkKTtcblxuICByZXR1cm4ge1xuICAgIHNlbmRlcixcbiAgICBpbkdyb3VwOiBjb252ZXJzYXRpb24udHlwZSA9PT0gJ2dyb3VwJyxcbiAgfTtcbn1cblxuLy8gT3RoZXIgdXRpbGl0eSBmdW5jdGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGFwVG9WaWV3KG1lc3NhZ2U6IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlKTogYm9vbGVhbiB7XG4gIC8vIElmIGEgbWVzc2FnZSBpcyBkZWxldGVkIGZvciBldmVyeW9uZSwgdGhhdCBvdmVycmlkZXMgYWxsIG90aGVyIHN0eWxpbmdcbiAgaWYgKG1lc3NhZ2UuZGVsZXRlZEZvckV2ZXJ5b25lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIEJvb2xlYW4obWVzc2FnZS5pc1ZpZXdPbmNlIHx8IG1lc3NhZ2UubWVzc2FnZVRpbWVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lc3NhZ2VQcm9wU3RhdHVzKFxuICBtZXNzYWdlOiBQaWNrPFxuICAgIE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLFxuICAgIHwgJ2RlbGV0ZWRGb3JFdmVyeW9uZSdcbiAgICB8ICdkZWxldGVkRm9yRXZlcnlvbmVGYWlsZWQnXG4gICAgfCAnZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cydcbiAgICB8ICdlcnJvcnMnXG4gICAgfCAnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCdcbiAgICB8ICd0eXBlJ1xuICA+LFxuICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nIHwgdW5kZWZpbmVkXG4pOiBMYXN0TWVzc2FnZVN0YXR1cyB8IHVuZGVmaW5lZCB7XG4gIGlmICghaXNPdXRnb2luZyhtZXNzYWdlKSkge1xuICAgIHJldHVybiBoYXNFcnJvcnMobWVzc2FnZSkgPyAnZXJyb3InIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGdldExhc3RDaGFsbGVuZ2VFcnJvcihtZXNzYWdlKSkge1xuICAgIHJldHVybiAncGF1c2VkJztcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBkZWxldGVkRm9yRXZlcnlvbmUsXG4gICAgZGVsZXRlZEZvckV2ZXJ5b25lRmFpbGVkLFxuICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXMsXG4gICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9IHt9LFxuICB9ID0gbWVzc2FnZTtcblxuICAvLyBOb3RlOiB3ZSBvbmx5IGRvIGFueXRoaW5nIGhlcmUgaWYgZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cyBleGlzdHMsIGJlY2F1c2Ugb2xkXG4gIC8vICAgbWVzc2FnZXMgZGVsZXRlZCBmb3IgZXZlcnlvbmUgd29uJ3QgaGF2ZSBzZW5kIHN0YXR1cy5cbiAgaWYgKGRlbGV0ZWRGb3JFdmVyeW9uZSAmJiBkZWxldGVkRm9yRXZlcnlvbmVTZW5kU3RhdHVzKSB7XG4gICAgaWYgKGRlbGV0ZWRGb3JFdmVyeW9uZUZhaWxlZCkge1xuICAgICAgY29uc3QgYW55U3VjY2Vzc2Z1bFNlbmRzID0gT2JqZWN0LnZhbHVlcyhcbiAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1c1xuICAgICAgKS5zb21lKGl0ZW0gPT4gaXRlbSk7XG5cbiAgICAgIHJldHVybiBhbnlTdWNjZXNzZnVsU2VuZHMgPyAncGFydGlhbC1zZW50JyA6ICdlcnJvcic7XG4gICAgfVxuICAgIGNvbnN0IG1pc3NpbmdTZW5kcyA9IE9iamVjdC52YWx1ZXMoZGVsZXRlZEZvckV2ZXJ5b25lU2VuZFN0YXR1cykuc29tZShcbiAgICAgIGl0ZW0gPT4gIWl0ZW1cbiAgICApO1xuICAgIGlmIChtaXNzaW5nU2VuZHMpIHtcbiAgICAgIHJldHVybiAnc2VuZGluZyc7XG4gICAgfVxuICB9XG5cbiAgaWYgKFxuICAgIG91ckNvbnZlcnNhdGlvbklkICYmXG4gICAgaXNNZXNzYWdlSnVzdEZvck1lKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIG91ckNvbnZlcnNhdGlvbklkKVxuICApIHtcbiAgICBjb25zdCBzdGF0dXMgPVxuICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZFtvdXJDb252ZXJzYXRpb25JZF0/LnN0YXR1cyA/P1xuICAgICAgU2VuZFN0YXR1cy5QZW5kaW5nO1xuICAgIGNvbnN0IHNlbnQgPSBpc1NlbnQoc3RhdHVzKTtcbiAgICBpZiAoXG4gICAgICBoYXNFcnJvcnMobWVzc2FnZSkgfHxcbiAgICAgIHNvbWVTZW5kU3RhdHVzKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIGlzRmFpbGVkKVxuICAgICkge1xuICAgICAgcmV0dXJuIHNlbnQgPyAncGFydGlhbC1zZW50JyA6ICdlcnJvcic7XG4gICAgfVxuICAgIHJldHVybiBzZW50ID8gJ3ZpZXdlZCcgOiAnc2VuZGluZyc7XG4gIH1cblxuICBjb25zdCBzZW5kU3RhdGVzID0gT2JqZWN0LnZhbHVlcyhcbiAgICBvdXJDb252ZXJzYXRpb25JZFxuICAgICAgPyBvbWl0KHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIG91ckNvbnZlcnNhdGlvbklkKVxuICAgICAgOiBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkXG4gICk7XG4gIGNvbnN0IGhpZ2hlc3RTdWNjZXNzZnVsU3RhdHVzID0gc2VuZFN0YXRlcy5yZWR1Y2UoXG4gICAgKHJlc3VsdDogU2VuZFN0YXR1cywgeyBzdGF0dXMgfSkgPT4gbWF4U3RhdHVzKHJlc3VsdCwgc3RhdHVzKSxcbiAgICBTZW5kU3RhdHVzLlBlbmRpbmdcbiAgKTtcblxuICBpZiAoXG4gICAgaGFzRXJyb3JzKG1lc3NhZ2UpIHx8XG4gICAgc29tZVNlbmRTdGF0dXMoc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCwgaXNGYWlsZWQpXG4gICkge1xuICAgIHJldHVybiBpc1NlbnQoaGlnaGVzdFN1Y2Nlc3NmdWxTdGF0dXMpID8gJ3BhcnRpYWwtc2VudCcgOiAnZXJyb3InO1xuICB9XG4gIGlmIChpc1ZpZXdlZChoaWdoZXN0U3VjY2Vzc2Z1bFN0YXR1cykpIHtcbiAgICByZXR1cm4gJ3ZpZXdlZCc7XG4gIH1cbiAgaWYgKGlzUmVhZChoaWdoZXN0U3VjY2Vzc2Z1bFN0YXR1cykpIHtcbiAgICByZXR1cm4gJ3JlYWQnO1xuICB9XG4gIGlmIChpc0RlbGl2ZXJlZChoaWdoZXN0U3VjY2Vzc2Z1bFN0YXR1cykpIHtcbiAgICByZXR1cm4gJ2RlbGl2ZXJlZCc7XG4gIH1cbiAgaWYgKGlzU2VudChoaWdoZXN0U3VjY2Vzc2Z1bFN0YXR1cykpIHtcbiAgICByZXR1cm4gJ3NlbnQnO1xuICB9XG4gIHJldHVybiAnc2VuZGluZyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9wc0ZvckVtYmVkZGVkQ29udGFjdChcbiAgbWVzc2FnZTogTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gIHJlZ2lvbkNvZGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgYWNjb3VudFNlbGVjdG9yOiAoaWRlbnRpZmllcj86IHN0cmluZykgPT4gVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWRcbik6IEVtYmVkZGVkQ29udGFjdFR5cGUgfCB1bmRlZmluZWQge1xuICBjb25zdCBjb250YWN0cyA9IG1lc3NhZ2UuY29udGFjdDtcbiAgaWYgKCFjb250YWN0cyB8fCAhY29udGFjdHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGZpcnN0Q29udGFjdCA9IGNvbnRhY3RzWzBdO1xuICBjb25zdCBudW1iZXJzID0gZmlyc3RDb250YWN0Py5udW1iZXI7XG4gIGNvbnN0IGZpcnN0TnVtYmVyID0gbnVtYmVycyAmJiBudW1iZXJzWzBdID8gbnVtYmVyc1swXS52YWx1ZSA6IHVuZGVmaW5lZDtcblxuICByZXR1cm4gZW1iZWRkZWRDb250YWN0U2VsZWN0b3IoZmlyc3RDb250YWN0LCB7XG4gICAgcmVnaW9uQ29kZSxcbiAgICBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoOlxuICAgICAgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmdldEFic29sdXRlQXR0YWNobWVudFBhdGgsXG4gICAgZmlyc3ROdW1iZXIsXG4gICAgdXVpZDogYWNjb3VudFNlbGVjdG9yKGZpcnN0TnVtYmVyKSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9wc0ZvckF0dGFjaG1lbnQoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlXG4pOiBBdHRhY2htZW50VHlwZSB8IHVuZGVmaW5lZCB7XG4gIGlmICghYXR0YWNobWVudCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB7IHBhdGgsIHBlbmRpbmcsIHNpemUsIHNjcmVlbnNob3QsIHRodW1ibmFpbCB9ID0gYXR0YWNobWVudDtcblxuICByZXR1cm4ge1xuICAgIC4uLmF0dGFjaG1lbnQsXG4gICAgZmlsZVNpemU6IHNpemUgPyBmaWxlc2l6ZShzaXplKSA6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWNlTWVzc2FnZTogaXNWb2ljZU1lc3NhZ2UoYXR0YWNobWVudCksXG4gICAgcGVuZGluZyxcbiAgICB1cmw6IHBhdGhcbiAgICAgID8gd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmdldEFic29sdXRlQXR0YWNobWVudFBhdGgocGF0aClcbiAgICAgIDogdW5kZWZpbmVkLFxuICAgIHNjcmVlbnNob3Q6IHNjcmVlbnNob3Q/LnBhdGhcbiAgICAgID8ge1xuICAgICAgICAgIC4uLnNjcmVlbnNob3QsXG4gICAgICAgICAgdXJsOiB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aChcbiAgICAgICAgICAgIHNjcmVlbnNob3QucGF0aFxuICAgICAgICAgICksXG4gICAgICAgIH1cbiAgICAgIDogdW5kZWZpbmVkLFxuICAgIHRodW1ibmFpbDogdGh1bWJuYWlsPy5wYXRoXG4gICAgICA/IHtcbiAgICAgICAgICAuLi50aHVtYm5haWwsXG4gICAgICAgICAgdXJsOiB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aChcbiAgICAgICAgICAgIHRodW1ibmFpbC5wYXRoXG4gICAgICAgICAgKSxcbiAgICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NRdW90ZUF0dGFjaG1lbnQoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlXG4pOiBRdW90ZWRBdHRhY2htZW50VHlwZSB7XG4gIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuICBjb25zdCBwYXRoID1cbiAgICB0aHVtYm5haWwgJiZcbiAgICB0aHVtYm5haWwucGF0aCAmJlxuICAgIHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5nZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKHRodW1ibmFpbC5wYXRoKTtcbiAgY29uc3Qgb2JqZWN0VXJsID0gdGh1bWJuYWlsICYmIHRodW1ibmFpbC5vYmplY3RVcmw7XG5cbiAgY29uc3QgdGh1bWJuYWlsV2l0aE9iamVjdFVybCA9XG4gICAgKCFwYXRoICYmICFvYmplY3RVcmwpIHx8ICF0aHVtYm5haWxcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHsgLi4udGh1bWJuYWlsLCBvYmplY3RVcmw6IHBhdGggfHwgb2JqZWN0VXJsIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5hdHRhY2htZW50LFxuICAgIGlzVm9pY2VNZXNzYWdlOiBpc1ZvaWNlTWVzc2FnZShhdHRhY2htZW50KSxcbiAgICB0aHVtYm5haWw6IHRodW1ibmFpbFdpdGhPYmplY3RVcmwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhblJlcGx5T3JSZWFjdChcbiAgbWVzc2FnZTogUGljazxcbiAgICBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgICB8ICdjYW5SZXBseVRvU3RvcnknXG4gICAgfCAnZGVsZXRlZEZvckV2ZXJ5b25lJ1xuICAgIHwgJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnXG4gICAgfCAndHlwZSdcbiAgPixcbiAgb3VyQ29udmVyc2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgY29udmVyc2F0aW9uOiB1bmRlZmluZWQgfCBSZWFkb25seTxDb252ZXJzYXRpb25UeXBlPlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgZGVsZXRlZEZvckV2ZXJ5b25lLCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkIH0gPSBtZXNzYWdlO1xuXG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGNvbnZlcnNhdGlvbi5pc0dyb3VwVjFBbmREaXNhYmxlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc01pc3NpbmdSZXF1aXJlZFByb2ZpbGVTaGFyaW5nKGNvbnZlcnNhdGlvbikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIWNvbnZlcnNhdGlvbi5hY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGRlbGV0ZWRGb3JFdmVyeW9uZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc091dGdvaW5nKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzTWVzc2FnZUp1c3RGb3JNZShzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLCBvdXJDb252ZXJzYXRpb25JZCkgfHxcbiAgICAgIHNvbWVTZW5kU3RhdHVzKFxuICAgICAgICBvdXJDb252ZXJzYXRpb25JZFxuICAgICAgICAgID8gb21pdChzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLCBvdXJDb252ZXJzYXRpb25JZClcbiAgICAgICAgICA6IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsXG4gICAgICAgIGlzU2VudFxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvLyBJZiB3ZSBnZXQgcGFzdCBhbGwgdGhlIG90aGVyIGNoZWNrcyBhYm92ZSB0aGVuIHdlIGNhbiBhbHdheXMgcmVwbHkgb3JcbiAgLy8gcmVhY3QgaWYgdGhlIG1lc3NhZ2UgdHlwZSBpcyBcImluY29taW5nXCIgfCBcInN0b3J5XCJcbiAgaWYgKGlzSW5jb21pbmcobWVzc2FnZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChpc1N0b3J5KG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4obWVzc2FnZS5jYW5SZXBseVRvU3RvcnkpO1xuICB9XG5cbiAgLy8gRmFpbCBzYWZlLlxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXBseShcbiAgbWVzc2FnZTogUGljazxcbiAgICBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgICB8ICdjYW5SZXBseVRvU3RvcnknXG4gICAgfCAnY29udmVyc2F0aW9uSWQnXG4gICAgfCAnZGVsZXRlZEZvckV2ZXJ5b25lJ1xuICAgIHwgJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnXG4gICAgfCAndHlwZSdcbiAgPixcbiAgb3VyQ29udmVyc2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlXG4pOiBib29sZWFuIHtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gZ2V0Q29udmVyc2F0aW9uKG1lc3NhZ2UsIGNvbnZlcnNhdGlvblNlbGVjdG9yKTtcbiAgaWYgKFxuICAgICFjb252ZXJzYXRpb24gfHxcbiAgICAoY29udmVyc2F0aW9uLmFubm91bmNlbWVudHNPbmx5ICYmICFjb252ZXJzYXRpb24uYXJlV2VBZG1pbilcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBjYW5SZXBseU9yUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGNvbnZlcnNhdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZWFjdChcbiAgbWVzc2FnZTogUGljazxcbiAgICBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgICB8ICdjb252ZXJzYXRpb25JZCdcbiAgICB8ICdkZWxldGVkRm9yRXZlcnlvbmUnXG4gICAgfCAnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCdcbiAgICB8ICd0eXBlJ1xuICA+LFxuICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICBjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGVcbik6IGJvb2xlYW4ge1xuICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRDb252ZXJzYXRpb24obWVzc2FnZSwgY29udmVyc2F0aW9uU2VsZWN0b3IpO1xuICByZXR1cm4gY2FuUmVwbHlPclJlYWN0KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBjb252ZXJzYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuRGVsZXRlRm9yRXZlcnlvbmUoXG4gIG1lc3NhZ2U6IFBpY2s8XG4gICAgTWVzc2FnZVdpdGhVSUZpZWxkc1R5cGUsXG4gICAgJ3R5cGUnIHwgJ2RlbGV0ZWRGb3JFdmVyeW9uZScgfCAnc2VudF9hdCcgfCAnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCdcbiAgPlxuKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgLy8gSXMgdGhpcyBhIG1lc3NhZ2UgSSBzZW50P1xuICAgIGlzT3V0Z29pbmcobWVzc2FnZSkgJiZcbiAgICAvLyBIYXMgdGhlIG1lc3NhZ2UgYWxyZWFkeSBiZWVuIGRlbGV0ZWQ/XG4gICAgIW1lc3NhZ2UuZGVsZXRlZEZvckV2ZXJ5b25lICYmXG4gICAgLy8gSXMgaXQgdG9vIG9sZCB0byBkZWxldGU/XG4gICAgaXNNb3JlUmVjZW50VGhhbihtZXNzYWdlLnNlbnRfYXQsIFRIUkVFX0hPVVJTKSAmJlxuICAgIC8vIElzIGl0IHNlbnQgdG8gYW55b25lP1xuICAgIHNvbWVTZW5kU3RhdHVzKG1lc3NhZ2Uuc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCwgaXNTZW50KVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuUmV0cnlEZWxldGVGb3JFdmVyeW9uZShcbiAgbWVzc2FnZTogUGljazxcbiAgICBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgICAnZGVsZXRlZEZvckV2ZXJ5b25lJyB8ICdkZWxldGVkRm9yRXZlcnlvbmVGYWlsZWQnIHwgJ3NlbnRfYXQnXG4gID5cbik6IGJvb2xlYW4ge1xuICByZXR1cm4gQm9vbGVhbihcbiAgICBtZXNzYWdlLmRlbGV0ZWRGb3JFdmVyeW9uZSAmJlxuICAgICAgbWVzc2FnZS5kZWxldGVkRm9yRXZlcnlvbmVGYWlsZWQgJiZcbiAgICAgIC8vIElzIGl0IHRvbyBvbGQgdG8gZGVsZXRlP1xuICAgICAgaXNNb3JlUmVjZW50VGhhbihtZXNzYWdlLnNlbnRfYXQsIERBWSlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbkRvd25sb2FkKFxuICBtZXNzYWdlOiBNZXNzYWdlV2l0aFVJRmllbGRzVHlwZSxcbiAgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlXG4pOiBib29sZWFuIHtcbiAgaWYgKGlzT3V0Z29pbmcobWVzc2FnZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldENvbnZlcnNhdGlvbihtZXNzYWdlLCBjb252ZXJzYXRpb25TZWxlY3Rvcik7XG4gIGNvbnN0IGlzQWNjZXB0ZWQgPSBCb29sZWFuKFxuICAgIGNvbnZlcnNhdGlvbiAmJiBjb252ZXJzYXRpb24uYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdFxuICApO1xuICBpZiAoIWlzQWNjZXB0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFbnN1cmUgdGhhdCBhbGwgYXR0YWNobWVudHMgYXJlIGRvd25sb2FkYWJsZVxuICBjb25zdCB7IGF0dGFjaG1lbnRzIH0gPSBtZXNzYWdlO1xuICBpZiAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzLmV2ZXJ5KGF0dGFjaG1lbnQgPT4gQm9vbGVhbihhdHRhY2htZW50LnBhdGgpKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFzdENoYWxsZW5nZUVycm9yKFxuICBtZXNzYWdlOiBQaWNrPE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlLCAnZXJyb3JzJz5cbik6IFNoYWxsb3dDaGFsbGVuZ2VFcnJvciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgZXJyb3JzIH0gPSBtZXNzYWdlO1xuICBpZiAoIWVycm9ycykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBjaGFsbGVuZ2VFcnJvcnMgPSBlcnJvcnNcbiAgICAuZmlsdGVyKChlcnJvcik6IGVycm9yIGlzIFNoYWxsb3dDaGFsbGVuZ2VFcnJvciA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBlcnJvci5uYW1lID09PSAnU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvcicgJiZcbiAgICAgICAgaXNOdW1iZXIoZXJyb3IucmV0cnlBZnRlcikgJiZcbiAgICAgICAgaXNPYmplY3QoZXJyb3IuZGF0YSlcbiAgICAgICk7XG4gICAgfSlcbiAgICAuc29ydCgoYSwgYikgPT4gYS5yZXRyeUFmdGVyIC0gYi5yZXRyeUFmdGVyKTtcblxuICByZXR1cm4gY2hhbGxlbmdlRXJyb3JzLnBvcCgpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXVFO0FBQ3ZFLHNCQUFzRDtBQUN0RCxzQkFBcUI7QUFDckIsdUJBQXlCO0FBQ3pCLHlCQUF1QjtBQUN2Qix3QkFBc0I7QUFVdEIscUJBQThCO0FBZTlCLHlCQUF5QztBQUl6Qyw2QkFB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ZTtBQUFBLEVBQ3hDO0FBR0EsU0FBTztBQUNUO0FBekRTLEFBMkRGLGtCQUNMLFNBUUEsbUJBQ0Esc0JBQ1M7QUFDVCxRQUFNLGVBQWUsZ0JBQWdCLFNBQVMsb0JBQW9CO0FBQ2xFLE1BQ0UsQ0FBQyxnQkFDQSxhQUFhLHFCQUFxQixDQUFDLGFBQWEsWUFDakQ7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLFNBQU8sZ0JBQWdCLFNBQVMsbUJBQW1CLFlBQVk7QUFDakU7QUFwQmdCLEFBc0JULGtCQUNMLFNBT0EsbUJBQ0Esc0JBQ1M7QUFDVCxRQUFNLGVBQWUsZ0JBQWdCLFNBQVMsb0JBQW9CO0FBQ2xFLFNBQU8sZ0JBQWdCLFNBQVMsbUJBQW1CLFlBQVk7QUFDakU7QUFiZ0IsQUFlVCw4QkFDTCxTQUlTO0FBQ1QsU0FFRSwrQkFBVyxPQUFPLEtBRWxCLENBQUMsUUFBUSxzQkFFVCx1Q0FBaUIsUUFBUSxTQUFTLFdBQVcsS0FFN0MsNENBQWUsUUFBUSwyQkFBMkIsOEJBQU07QUFFNUQ7QUFoQmdCLEFBa0JULG1DQUNMLFNBSVM7QUFDVCxTQUFPLFFBQ0wsUUFBUSxzQkFDTixRQUFRLDRCQUVSLHVDQUFpQixRQUFRLFNBQVMsb0JBQUcsQ0FDekM7QUFDRjtBQVpnQixBQWNULHFCQUNMLFNBQ0Esc0JBQ1M7QUFDVCxNQUFJLCtCQUFXLE9BQU8sR0FBRztBQUN2QixXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sZUFBZSxnQkFBZ0IsU0FBUyxvQkFBb0I7QUFDbEUsUUFBTSxhQUFhLFFBQ2pCLGdCQUFnQixhQUFhLHNCQUMvQjtBQUNBLE1BQUksQ0FBQyxZQUFZO0FBQ2YsV0FBTztBQUFBLEVBQ1Q7QUFHQSxRQUFNLEVBQUUsZ0JBQWdCO0FBQ3hCLE1BQUksZUFBZSxZQUFZLFFBQVE7QUFDckMsV0FBTyxZQUFZLE1BQU0sZ0JBQWMsUUFBUSxXQUFXLElBQUksQ0FBQztBQUFBLEVBQ2pFO0FBRUEsU0FBTztBQUNUO0FBdkJnQixBQXlCVCwrQkFDTCxTQUNtQztBQUNuQyxRQUFNLEVBQUUsV0FBVztBQUNuQixNQUFJLENBQUMsUUFBUTtBQUNYLFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxrQkFBa0IsT0FDckIsT0FBTyxDQUFDLFVBQTBDO0FBQ2pELFdBQ0UsTUFBTSxTQUFTLCtCQUNmLDRCQUFTLE1BQU0sVUFBVSxLQUN6Qiw0QkFBUyxNQUFNLElBQUk7QUFBQSxFQUV2QixDQUFDLEVBQ0EsS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVO0FBRTdDLFNBQU8sZ0JBQWdCLElBQUk7QUFDN0I7QUFuQmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
