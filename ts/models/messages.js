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
var messages_exports = {};
__export(messages_exports, {
  MessageModel: () => MessageModel
});
module.exports = __toCommonJS(messages_exports);
var import_lodash = require("lodash");
var import_iterables = require("../util/iterables");
var import_isNotNil = require("../util/isNotNil");
var import_isNormalNumber = require("../util/isNormalNumber");
var import_assert = require("../util/assert");
var import_missingCaseError = require("../util/missingCaseError");
var import_dropNull = require("../util/dropNull");
var import_callingNotification = require("../util/callingNotification");
var import_Errors = require("../textsecure/Errors");
var expirationTimer = __toESM(require("../util/expirationTimer"));
var import_userLanguages = require("../util/userLanguages");
var import_UUID = require("../types/UUID");
var reactionUtil = __toESM(require("../reactions/util"));
var Stickers = __toESM(require("../types/Stickers"));
var Errors = __toESM(require("../types/errors"));
var EmbeddedContact = __toESM(require("../types/EmbeddedContact"));
var import_Attachment = require("../types/Attachment");
var Attachment = __toESM(require("../types/Attachment"));
var import_MIME = require("../types/MIME");
var MIME = __toESM(require("../types/MIME"));
var GroupChange = __toESM(require("../groupChange"));
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_MessageSendState = require("../messages/MessageSendState");
var import_migrateLegacyReadStatus = require("../messages/migrateLegacyReadStatus");
var import_migrateLegacySendAttributes = require("../messages/migrateLegacySendAttributes");
var import_getOwn = require("../util/getOwn");
var import_MessageUpdater = require("../services/MessageUpdater");
var import_isMessageUnread = require("../util/isMessageUnread");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_handleMessageSend = require("../util/handleMessageSend");
var import_getSendOptions = require("../util/getSendOptions");
var import_findAndFormatContact = require("../util/findAndFormatContact");
var import_message = require("../state/selectors/message");
var import_calling = require("../state/selectors/calling");
var import_accounts = require("../state/selectors/accounts");
var import_conversations = require("../state/selectors/conversations");
var import_MessageReceipts = require("../messageModifiers/MessageReceipts");
var import_Deletes = require("../messageModifiers/Deletes");
var import_Reactions = require("../messageModifiers/Reactions");
var import_ReactionSource = require("../reactions/ReactionSource");
var import_ReadSyncs = require("../messageModifiers/ReadSyncs");
var import_ViewSyncs = require("../messageModifiers/ViewSyncs");
var import_ViewOnceOpenSyncs = require("../messageModifiers/ViewOnceOpenSyncs");
var LinkPreview = __toESM(require("../types/LinkPreview"));
var import_protobuf = require("../protobuf");
var import_conversationJobQueue = require("../jobs/conversationJobQueue");
var import_notifications = require("../services/notifications");
var log = __toESM(require("../logging/log"));
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var import_cleanup = require("../util/cleanup");
var import_helpers = require("../messages/helpers");
var import_viewOnceOpenJobQueue = require("../jobs/viewOnceOpenJobQueue");
var import_idForLogging = require("../util/idForLogging");
var import_hasAttachmentDownloads = require("../util/hasAttachmentDownloads");
var import_queueAttachmentDownloads = require("../util/queueAttachmentDownloads");
var import_findStoryMessage = require("../util/findStoryMessage");
var import_isConversationAccepted = require("../util/isConversationAccepted");
var import_storyLoader = require("../services/storyLoader");
var import_getMessageById = require("../messages/getMessageById");
var import_shouldDownloadStory = require("../util/shouldDownloadStory");
var import_stories = require("../state/selectors/stories");
var import_MessageSeenStatus = require("../MessageSeenStatus");
var import_util = require("../reactions/util");
var import_parseBadgesFromServer = require("../badges/parseBadgesFromServer");
var import_Message = require("../components/conversation/Message");
var import_downloadAttachment = require("../util/downloadAttachment");
window.Whisper = window.Whisper || {};
const { Message: TypedMessage } = window.Signal.Types;
const { upgradeMessageSchema } = window.Signal.Migrations;
const { getTextWithMentions, GoogleChrome } = window.Signal.Util;
const { getMessageBySender } = window.Signal.Data;
class MessageModel extends window.Backbone.Model {
  initialize(attributes) {
    if (_.isObject(attributes)) {
      this.set(TypedMessage.initializeSchemaVersion({
        message: attributes,
        logger: log
      }));
    }
    const readStatus = (0, import_migrateLegacyReadStatus.migrateLegacyReadStatus)(this.attributes);
    if (readStatus !== void 0) {
      this.set({
        readStatus,
        seenStatus: readStatus === import_MessageReadStatus.ReadStatus.Unread ? import_MessageSeenStatus.SeenStatus.Unseen : import_MessageSeenStatus.SeenStatus.Seen
      }, { silent: true });
    }
    const ourConversationId = window.ConversationController.getOurConversationId();
    if (ourConversationId) {
      const sendStateByConversationId = (0, import_migrateLegacySendAttributes.migrateLegacySendAttributes)(this.attributes, window.ConversationController.get.bind(window.ConversationController), ourConversationId);
      if (sendStateByConversationId) {
        this.set("sendStateByConversationId", sendStateByConversationId, {
          silent: true
        });
      }
    }
    this.CURRENT_PROTOCOL_VERSION = import_protobuf.SignalService.DataMessage.ProtocolVersion.CURRENT;
    this.INITIAL_PROTOCOL_VERSION = import_protobuf.SignalService.DataMessage.ProtocolVersion.INITIAL;
    this.on("change", this.notifyRedux);
  }
  notifyRedux() {
    const { storyChanged } = window.reduxActions.stories;
    if ((0, import_message.isStory)(this.attributes)) {
      const storyData = (0, import_storyLoader.getStoryDataFromMessageAttributes)(this.attributes);
      if (!storyData) {
        return;
      }
      storyChanged(storyData);
      return;
    }
    const { messageChanged } = window.reduxActions.conversations;
    if (messageChanged) {
      const conversationId = this.get("conversationId");
      messageChanged(this.id, conversationId, { ...this.attributes });
    }
  }
  getSenderIdentifier() {
    const sentAt = this.get("sent_at");
    const source = this.get("source");
    const sourceUuid = this.get("sourceUuid");
    const sourceDevice = this.get("sourceDevice");
    const conversation = window.ConversationController.lookupOrCreate({
      e164: source,
      uuid: sourceUuid
    });
    return `${conversation?.id}.${sourceDevice}-${sentAt}`;
  }
  getReceivedAt() {
    return Number(this.get("received_at_ms") || this.get("received_at"));
  }
  isNormalBubble() {
    const { attributes } = this;
    return !(0, import_message.isCallHistory)(attributes) && !(0, import_message.isChatSessionRefreshed)(attributes) && !(0, import_message.isEndSession)(attributes) && !(0, import_message.isExpirationTimerUpdate)(attributes) && !(0, import_message.isGroupUpdate)(attributes) && !(0, import_message.isGroupV2Change)(attributes) && !(0, import_message.isGroupV1Migration)(attributes) && !(0, import_message.isKeyChange)(attributes) && !(0, import_message.isProfileChange)(attributes) && !(0, import_message.isUniversalTimerNotification)(attributes) && !(0, import_message.isUnsupportedMessage)(attributes) && !(0, import_message.isVerifiedChange)(attributes);
  }
  async hydrateStoryContext(inMemoryMessage) {
    const storyId = this.get("storyId");
    if (!storyId) {
      return;
    }
    if (this.get("storyReplyContext")) {
      return;
    }
    const message = inMemoryMessage || await (0, import_getMessageById.getMessageById)(storyId);
    if (!message) {
      const conversation = this.getConversation();
      (0, import_assert.softAssert)(conversation && (0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes), "hydrateStoryContext: Not a type=direct conversation");
      this.set({
        storyReplyContext: {
          attachment: void 0,
          authorUuid: conversation?.get("uuid"),
          messageId: ""
        }
      });
      return;
    }
    const attachments = (0, import_message.getAttachmentsForMessage)({ ...message.attributes });
    this.set({
      storyReplyContext: {
        attachment: attachments ? attachments[0] : void 0,
        authorUuid: message.get("sourceUuid"),
        messageId: message.get("id")
      }
    });
  }
  getPropsForMessageDetail(ourConversationId) {
    const newIdentity = window.i18n("newIdentity");
    const OUTGOING_KEY_ERROR = "OutgoingIdentityKeyError";
    const sendStateByConversationId = this.get("sendStateByConversationId") || {};
    const unidentifiedDeliveries = this.get("unidentifiedDeliveries") || [];
    const unidentifiedDeliveriesSet = new Set((0, import_iterables.map)(unidentifiedDeliveries, (identifier) => window.ConversationController.getConversationId(identifier)));
    let conversationIds;
    if ((0, import_message.isIncoming)(this.attributes)) {
      conversationIds = [(0, import_helpers.getContactId)(this.attributes)];
    } else if (!(0, import_lodash.isEmpty)(sendStateByConversationId)) {
      if ((0, import_MessageSendState.isMessageJustForMe)(sendStateByConversationId, ourConversationId)) {
        conversationIds = [ourConversationId];
      } else {
        conversationIds = Object.keys(sendStateByConversationId).filter((id) => id !== ourConversationId);
      }
    } else {
      conversationIds = (this.getConversation()?.getRecipients() || []).map((id) => window.ConversationController.getConversationId(id));
    }
    const allErrors = (this.get("errors") || []).map((error) => {
      if (error.name === OUTGOING_KEY_ERROR) {
        error.message = newIdentity;
      }
      return error;
    });
    const errors = _.reject(allErrors, (error) => Boolean(error.identifier || error.number));
    const errorsGroupedById = _.groupBy(allErrors, (error) => {
      const identifier = error.identifier || error.number;
      if (!identifier) {
        return null;
      }
      return window.ConversationController.getConversationId(identifier);
    });
    const contacts = conversationIds.map((id) => {
      const errorsForContact = (0, import_getOwn.getOwn)(errorsGroupedById, id);
      const isOutgoingKeyError = Boolean(errorsForContact?.some((error) => error.name === OUTGOING_KEY_ERROR));
      const isUnidentifiedDelivery = window.storage.get("unidentifiedDeliveryIndicators", false) && this.isUnidentifiedDelivery(id, unidentifiedDeliveriesSet);
      const sendState = (0, import_getOwn.getOwn)(sendStateByConversationId, id);
      let status = sendState?.status;
      if (id === ourConversationId && status && (0, import_MessageSendState.isSent)(status)) {
        status = import_MessageSendState.SendStatus.Read;
      }
      const statusTimestamp = sendState?.updatedAt;
      return {
        ...(0, import_findAndFormatContact.findAndFormatContact)(id),
        status,
        statusTimestamp: statusTimestamp === this.get("sent_at") ? void 0 : statusTimestamp,
        errors: errorsForContact,
        isOutgoingKeyError,
        isUnidentifiedDelivery
      };
    });
    return {
      sentAt: this.get("sent_at"),
      receivedAt: this.getReceivedAt(),
      message: (0, import_message.getPropsForMessage)(this.attributes, {
        conversationSelector: import_findAndFormatContact.findAndFormatContact,
        ourConversationId,
        ourNumber: window.textsecure.storage.user.getNumber(),
        ourACI: window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString(),
        ourPNI: window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI).toString(),
        regionCode: window.storage.get("regionCode", "ZZ"),
        accountSelector: (identifier) => {
          const state = window.reduxStore.getState();
          const accountSelector = (0, import_accounts.getAccountSelector)(state);
          return accountSelector(identifier);
        },
        contactNameColorSelector: (conversationId, contactId) => {
          const state = window.reduxStore.getState();
          const contactNameColorSelector = (0, import_conversations.getContactNameColorSelector)(state);
          return contactNameColorSelector(conversationId, contactId);
        }
      }),
      errors,
      contacts
    };
  }
  getConversation() {
    return window.ConversationController.get(this.get("conversationId"));
  }
  getNotificationData() {
    const { attributes } = this;
    if ((0, import_message.isDeliveryIssue)(attributes)) {
      return {
        emoji: "\u26A0\uFE0F",
        text: window.i18n("DeliveryIssue--preview")
      };
    }
    if ((0, import_message.isChatSessionRefreshed)(attributes)) {
      return {
        emoji: "\u{1F501}",
        text: window.i18n("ChatRefresh--notification")
      };
    }
    if ((0, import_message.isUnsupportedMessage)(attributes)) {
      return {
        text: window.i18n("message--getDescription--unsupported-message")
      };
    }
    if ((0, import_message.isGroupV1Migration)(attributes)) {
      return {
        text: window.i18n("GroupV1--Migration--was-upgraded")
      };
    }
    if ((0, import_message.isProfileChange)(attributes)) {
      const change = this.get("profileChange");
      const changedId = this.get("changedId");
      const changedContact = (0, import_findAndFormatContact.findAndFormatContact)(changedId);
      if (!change) {
        throw new Error("getNotificationData: profileChange was missing!");
      }
      return {
        text: window.Signal.Util.getStringForProfileChange(change, changedContact, window.i18n)
      };
    }
    if ((0, import_message.isGroupV2Change)(attributes)) {
      const change = this.get("groupV2Change");
      (0, import_assert.strictAssert)(change, "getNotificationData: isGroupV2Change true, but no groupV2Change!");
      const changes = GroupChange.renderChange(change, {
        i18n: window.i18n,
        ourACI: window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString(),
        ourPNI: window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI).toString(),
        renderContact: (conversationId) => {
          const conversation = window.ConversationController.get(conversationId);
          return conversation ? conversation.getTitle() : window.i18n("unknownContact");
        },
        renderString: (key, _i18n, components) => window.i18n(key, components)
      });
      return { text: changes.map(({ text }) => text).join(" ") };
    }
    const attachments = this.get("attachments") || [];
    if ((0, import_message.isTapToView)(attributes)) {
      if (this.isErased()) {
        return {
          text: window.i18n("message--getDescription--disappearing-media")
        };
      }
      if (Attachment.isImage(attachments)) {
        return {
          text: window.i18n("message--getDescription--disappearing-photo"),
          emoji: "\u{1F4F7}"
        };
      }
      if (Attachment.isVideo(attachments)) {
        return {
          text: window.i18n("message--getDescription--disappearing-video"),
          emoji: "\u{1F3A5}"
        };
      }
      return { text: window.i18n("mediaMessage"), emoji: "\u{1F4CE}" };
    }
    if ((0, import_message.isGroupUpdate)(attributes)) {
      const groupUpdate = this.get("group_update");
      const fromContact = (0, import_helpers.getContact)(this.attributes);
      const messages = [];
      if (!groupUpdate) {
        throw new Error("getNotificationData: Missing group_update");
      }
      if (groupUpdate.left === "You") {
        return { text: window.i18n("youLeftTheGroup") };
      }
      if (groupUpdate.left) {
        return {
          text: window.i18n("leftTheGroup", [
            this.getNameForNumber(groupUpdate.left)
          ])
        };
      }
      if (!fromContact) {
        return { text: "" };
      }
      if ((0, import_whatTypeOfConversation.isMe)(fromContact.attributes)) {
        messages.push(window.i18n("youUpdatedTheGroup"));
      } else {
        messages.push(window.i18n("updatedTheGroup", [fromContact.getTitle()]));
      }
      if (groupUpdate.joined && groupUpdate.joined.length) {
        const joinedContacts = _.map(groupUpdate.joined, (item) => window.ConversationController.getOrCreate(item, "private"));
        const joinedWithoutMe = joinedContacts.filter((contact) => !(0, import_whatTypeOfConversation.isMe)(contact.attributes));
        if (joinedContacts.length > 1) {
          messages.push(window.i18n("multipleJoinedTheGroup", [
            _.map(joinedWithoutMe, (contact) => contact.getTitle()).join(", ")
          ]));
          if (joinedWithoutMe.length < joinedContacts.length) {
            messages.push(window.i18n("youJoinedTheGroup"));
          }
        } else {
          const joinedContact = window.ConversationController.getOrCreate(groupUpdate.joined[0], "private");
          if ((0, import_whatTypeOfConversation.isMe)(joinedContact.attributes)) {
            messages.push(window.i18n("youJoinedTheGroup"));
          } else {
            messages.push(window.i18n("joinedTheGroup", [joinedContacts[0].getTitle()]));
          }
        }
      }
      if (groupUpdate.name) {
        messages.push(window.i18n("titleIsNow", [groupUpdate.name]));
      }
      if (groupUpdate.avatarUpdated) {
        messages.push(window.i18n("updatedGroupAvatar"));
      }
      return { text: messages.join(" ") };
    }
    if ((0, import_message.isEndSession)(attributes)) {
      return { text: window.i18n("sessionEnded") };
    }
    if ((0, import_message.isIncoming)(attributes) && (0, import_message.hasErrors)(attributes)) {
      return { text: window.i18n("incomingError") };
    }
    const body = (this.get("body") || "").trim();
    if (attachments.length) {
      const attachment = attachments[0] || {};
      const { contentType } = attachment;
      if (contentType === MIME.IMAGE_GIF || Attachment.isGIF(attachments)) {
        return {
          text: body || window.i18n("message--getNotificationText--gif"),
          emoji: "\u{1F3A1}"
        };
      }
      if (Attachment.isImage(attachments)) {
        return {
          text: body || window.i18n("message--getNotificationText--photo"),
          emoji: "\u{1F4F7}"
        };
      }
      if (Attachment.isVideo(attachments)) {
        return {
          text: body || window.i18n("message--getNotificationText--video"),
          emoji: "\u{1F3A5}"
        };
      }
      if (Attachment.isVoiceMessage(attachment)) {
        return {
          text: body || window.i18n("message--getNotificationText--voice-message"),
          emoji: "\u{1F3A4}"
        };
      }
      if (Attachment.isAudio(attachments)) {
        return {
          text: body || window.i18n("message--getNotificationText--audio-message"),
          emoji: "\u{1F508}"
        };
      }
      return {
        text: body || window.i18n("message--getNotificationText--file"),
        emoji: "\u{1F4CE}"
      };
    }
    const stickerData = this.get("sticker");
    if (stickerData) {
      const emoji = Stickers.getSticker(stickerData.packId, stickerData.stickerId)?.emoji || stickerData?.emoji;
      if (!emoji) {
        log.warn("Unable to get emoji for sticker");
      }
      return {
        text: window.i18n("message--getNotificationText--stickers"),
        emoji: (0, import_dropNull.dropNull)(emoji)
      };
    }
    if ((0, import_message.isCallHistory)(attributes)) {
      const state = window.reduxStore.getState();
      const callingNotification = (0, import_message.getPropsForCallHistory)(attributes, {
        conversationSelector: import_findAndFormatContact.findAndFormatContact,
        callSelector: (0, import_calling.getCallSelector)(state),
        activeCall: (0, import_calling.getActiveCall)(state)
      });
      if (callingNotification) {
        return {
          text: (0, import_callingNotification.getCallingNotificationText)(callingNotification, window.i18n)
        };
      }
      log.error("This call history message doesn't have valid call history");
    }
    if ((0, import_message.isExpirationTimerUpdate)(attributes)) {
      const { expireTimer } = this.get("expirationTimerUpdate");
      if (!expireTimer) {
        return { text: window.i18n("disappearingMessagesDisabled") };
      }
      return {
        text: window.i18n("timerSetTo", [
          expirationTimer.format(window.i18n, expireTimer)
        ])
      };
    }
    if ((0, import_message.isKeyChange)(attributes)) {
      const identifier = this.get("key_changed");
      const conversation = window.ConversationController.get(identifier);
      return {
        text: window.i18n("safetyNumberChangedGroup", [
          conversation ? conversation.getTitle() : ""
        ])
      };
    }
    const contacts = this.get("contact");
    if (contacts && contacts.length) {
      return {
        text: EmbeddedContact.getName(contacts[0]) || window.i18n("unknownContact"),
        emoji: "\u{1F464}"
      };
    }
    const giftBadge = this.get("giftBadge");
    if (giftBadge) {
      const emoji = "\u{1F381}";
      if ((0, import_message.isOutgoing)(this.attributes)) {
        return {
          emoji,
          text: window.i18n("message--giftBadge--preview--sent")
        };
      }
      return {
        emoji,
        text: giftBadge.state === import_Message.GiftBadgeStates.Unopened ? window.i18n("message--giftBadge--preview--unopened") : window.i18n("message--giftBadge--preview--redeemed")
      };
    }
    if (body) {
      return { text: body };
    }
    return { text: "" };
  }
  getRawText() {
    const body = (this.get("body") || "").trim();
    const { attributes } = this;
    const bodyRanges = (0, import_message.processBodyRanges)(attributes, {
      conversationSelector: import_findAndFormatContact.findAndFormatContact
    });
    if (bodyRanges) {
      return getTextWithMentions(bodyRanges, body);
    }
    return body;
  }
  getNotificationText() {
    const { text, emoji } = this.getNotificationData();
    const { attributes } = this;
    if (attributes.storyReactionEmoji) {
      if (!window.Signal.OS.isLinux()) {
        return attributes.storyReactionEmoji;
      }
      return window.i18n("Quote__story-reaction--single");
    }
    let modifiedText = text;
    const bodyRanges = (0, import_message.processBodyRanges)(attributes, {
      conversationSelector: import_findAndFormatContact.findAndFormatContact
    });
    if (bodyRanges && bodyRanges.length) {
      modifiedText = getTextWithMentions(bodyRanges, modifiedText);
    }
    const shouldIncludeEmoji = Boolean(emoji) && !window.Signal.OS.isLinux();
    if (shouldIncludeEmoji) {
      return window.i18n("message--getNotificationText--text-with-emoji", {
        text: modifiedText,
        emoji
      });
    }
    return modifiedText;
  }
  idForLogging() {
    return (0, import_idForLogging.getMessageIdForLogging)(this.attributes);
  }
  defaults() {
    return {
      timestamp: new Date().getTime(),
      attachments: []
    };
  }
  validate(attributes) {
    const required = ["conversationId", "received_at", "sent_at"];
    const missing = _.filter(required, (attr) => !attributes[attr]);
    if (missing.length) {
      log.warn(`Message missing attributes: ${missing}`);
    }
  }
  merge(model) {
    const attributes = model.attributes || model;
    this.set(attributes);
  }
  getNameForNumber(number) {
    const conversation = window.ConversationController.get(number);
    if (!conversation) {
      return number;
    }
    return conversation.getTitle();
  }
  async cleanup() {
    await (0, import_cleanup.cleanupMessage)(this.attributes);
  }
  async deleteData() {
    await (0, import_cleanup.deleteMessageData)(this.attributes);
  }
  isValidTapToView() {
    const body = this.get("body");
    if (body) {
      return false;
    }
    const attachments = this.get("attachments");
    if (!attachments || attachments.length !== 1) {
      return false;
    }
    const firstAttachment = attachments[0];
    if (!window.Signal.Util.GoogleChrome.isImageTypeSupported(firstAttachment.contentType) && !window.Signal.Util.GoogleChrome.isVideoTypeSupported(firstAttachment.contentType)) {
      return false;
    }
    const quote = this.get("quote");
    const sticker = this.get("sticker");
    const contact = this.get("contact");
    const preview = this.get("preview");
    if (quote || sticker || contact && contact.length > 0 || preview && preview.length > 0) {
      return false;
    }
    return true;
  }
  async markViewOnceMessageViewed(options) {
    const { fromSync } = options || {};
    if (!this.isValidTapToView()) {
      log.warn(`markViewOnceMessageViewed: Message ${this.idForLogging()} is not a valid tap to view message!`);
      return;
    }
    if (this.isErased()) {
      log.warn(`markViewOnceMessageViewed: Message ${this.idForLogging()} is already erased!`);
      return;
    }
    if (this.get("readStatus") !== import_MessageReadStatus.ReadStatus.Viewed) {
      this.set((0, import_MessageUpdater.markViewed)(this.attributes));
    }
    await this.eraseContents();
    if (!fromSync) {
      const senderE164 = (0, import_helpers.getSource)(this.attributes);
      const senderUuid = (0, import_helpers.getSourceUuid)(this.attributes);
      const timestamp = this.get("sent_at");
      if (senderUuid === void 0) {
        throw new Error("markViewOnceMessageViewed: senderUuid is undefined");
      }
      if (window.ConversationController.areWePrimaryDevice()) {
        log.warn("markViewOnceMessageViewed: We are primary device; not sending view once open sync");
        return;
      }
      try {
        await import_viewOnceOpenJobQueue.viewOnceOpenJobQueue.add({
          viewOnceOpens: [
            {
              senderE164,
              senderUuid,
              timestamp
            }
          ]
        });
      } catch (error) {
        log.error("markViewOnceMessageViewed: Failed to queue view once open sync", Errors.toLogFormat(error));
      }
    }
  }
  async doubleCheckMissingQuoteReference() {
    const logId = this.idForLogging();
    const storyId = this.get("storyId");
    if (storyId) {
      log.warn(`doubleCheckMissingQuoteReference/${logId}: missing story reference`);
      const message = window.MessageController.getById(storyId);
      if (!message) {
        return;
      }
      if (this.get("storyReplyContext")) {
        this.unset("storyReplyContext");
      }
      await this.hydrateStoryContext(message);
      return;
    }
    const quote = this.get("quote");
    if (!quote) {
      log.warn(`doubleCheckMissingQuoteReference/${logId}: Missing quote!`);
      return;
    }
    const { authorUuid, author, id: sentAt, referencedMessageNotFound } = quote;
    const contact = window.ConversationController.get(authorUuid || author);
    if (referencedMessageNotFound && contact) {
      log.info(`doubleCheckMissingQuoteReference/${logId}: Verifying reference to ${sentAt}`);
      const inMemoryMessages = window.MessageController.filterBySentAt(Number(sentAt));
      const matchingMessage = (0, import_iterables.find)(inMemoryMessages, (message) => (0, import_helpers.isQuoteAMatch)(message.attributes, this.get("conversationId"), quote));
      if (!matchingMessage) {
        log.info(`doubleCheckMissingQuoteReference/${logId}: No match for ${sentAt}.`);
        return;
      }
      this.set({
        quote: {
          ...quote,
          referencedMessageNotFound: false
        }
      });
      log.info(`doubleCheckMissingQuoteReference/${logId}: Found match for ${sentAt}, updating.`);
      await this.copyQuoteContentFromOriginal(matchingMessage, quote);
      this.set({
        quote: {
          ...quote,
          referencedMessageNotFound: false
        }
      });
      window.Signal.Util.queueUpdateMessage(this.attributes);
    }
  }
  isErased() {
    return Boolean(this.get("isErased"));
  }
  async eraseContents(additionalProperties = {}, shouldPersist = true) {
    log.info(`Erasing data for message ${this.idForLogging()}`);
    try {
      await this.deleteData();
    } catch (error) {
      log.error(`Error erasing data for message ${this.idForLogging()}:`, error && error.stack ? error.stack : error);
    }
    this.set({
      isErased: true,
      body: "",
      bodyRanges: void 0,
      attachments: [],
      quote: void 0,
      contact: [],
      sticker: void 0,
      preview: [],
      ...additionalProperties
    });
    this.getConversation()?.debouncedUpdateLastMessage?.();
    if (shouldPersist) {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
    await window.Signal.Data.deleteSentProtoByMessageId(this.id);
  }
  isEmpty() {
    const { attributes } = this;
    const hasBody = Boolean(this.get("body"));
    const hasAttachment = (this.get("attachments") || []).length > 0;
    const hasEmbeddedContact = (this.get("contact") || []).length > 0;
    const isSticker = Boolean(this.get("sticker"));
    const isCallHistoryValue = (0, import_message.isCallHistory)(attributes);
    const isChatSessionRefreshedValue = (0, import_message.isChatSessionRefreshed)(attributes);
    const isDeliveryIssueValue = (0, import_message.isDeliveryIssue)(attributes);
    const isGiftBadgeValue = (0, import_message.isGiftBadge)(attributes);
    const isGroupUpdateValue = (0, import_message.isGroupUpdate)(attributes);
    const isGroupV2ChangeValue = (0, import_message.isGroupV2Change)(attributes);
    const isEndSessionValue = (0, import_message.isEndSession)(attributes);
    const isExpirationTimerUpdateValue = (0, import_message.isExpirationTimerUpdate)(attributes);
    const isVerifiedChangeValue = (0, import_message.isVerifiedChange)(attributes);
    const isUnsupportedMessageValue = (0, import_message.isUnsupportedMessage)(attributes);
    const isTapToViewValue = (0, import_message.isTapToView)(attributes);
    const hasErrorsValue = (0, import_message.hasErrors)(attributes);
    const isKeyChangeValue = (0, import_message.isKeyChange)(attributes);
    const isProfileChangeValue = (0, import_message.isProfileChange)(attributes);
    const isUniversalTimerNotificationValue = (0, import_message.isUniversalTimerNotification)(attributes);
    const hasSomethingToDisplay = hasBody || hasAttachment || hasEmbeddedContact || isSticker || isCallHistoryValue || isChatSessionRefreshedValue || isDeliveryIssueValue || isGiftBadgeValue || isGroupUpdateValue || isGroupV2ChangeValue || isEndSessionValue || isExpirationTimerUpdateValue || isVerifiedChangeValue || isUnsupportedMessageValue || isTapToViewValue || hasErrorsValue || isKeyChangeValue || isProfileChangeValue || isUniversalTimerNotificationValue;
    return !hasSomethingToDisplay;
  }
  isUnidentifiedDelivery(contactId, unidentifiedDeliveriesSet) {
    if ((0, import_message.isIncoming)(this.attributes)) {
      return Boolean(this.get("unidentifiedDeliveryReceived"));
    }
    return unidentifiedDeliveriesSet.has(contactId);
  }
  async saveErrors(providedErrors, options = {}) {
    const { skipSave } = options;
    let errors;
    if (!(providedErrors instanceof Array)) {
      errors = [providedErrors];
    } else {
      errors = providedErrors;
    }
    errors.forEach((e) => {
      log.error("Message.saveErrors:", e && e.reason ? e.reason : null, e && e.stack ? e.stack : e);
    });
    errors = errors.map((e) => {
      if (e.message && e.stack || e instanceof Error) {
        return _.pick(e, "name", "message", "code", "number", "identifier", "retryAfter", "data", "reason");
      }
      return e;
    });
    errors = errors.concat(this.get("errors") || []);
    this.set({ errors });
    if (!skipSave && !this.doNotSave) {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
  }
  markRead(readAt, options = {}) {
    this.set((0, import_MessageUpdater.markRead)(this.attributes, readAt, options));
  }
  getIncomingContact() {
    if (!(0, import_message.isIncoming)(this.attributes)) {
      return null;
    }
    const source = this.get("source");
    if (!source) {
      return null;
    }
    return window.ConversationController.getOrCreate(source, "private");
  }
  async retrySend() {
    const conversation = this.getConversation();
    const currentConversationRecipients = conversation.getMemberConversationIds();
    const oldSendStateByConversationId = this.get("sendStateByConversationId") || {};
    const newSendStateByConversationId = { ...oldSendStateByConversationId };
    for (const [conversationId, sendState] of Object.entries(oldSendStateByConversationId)) {
      if ((0, import_MessageSendState.isSent)(sendState.status)) {
        continue;
      }
      const recipient = window.ConversationController.get(conversationId);
      if (!recipient || !currentConversationRecipients.has(conversationId) && !(0, import_whatTypeOfConversation.isMe)(recipient.attributes)) {
        continue;
      }
      newSendStateByConversationId[conversationId] = (0, import_MessageSendState.sendStateReducer)(sendState, {
        type: import_MessageSendState.SendActionType.ManuallyRetried,
        updatedAt: Date.now()
      });
    }
    this.set("sendStateByConversationId", newSendStateByConversationId);
    await import_conversationJobQueue.conversationJobQueue.add({
      type: import_conversationJobQueue.conversationQueueJobEnum.enum.NormalMessage,
      conversationId: conversation.id,
      messageId: this.id,
      revision: conversation.get("revision")
    }, async (jobToInsert) => {
      await window.Signal.Data.saveMessage(this.attributes, {
        jobToInsert,
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    });
  }
  isReplayableError(e) {
    return e.name === "MessageError" || e.name === "OutgoingMessageError" || e.name === "SendMessageNetworkError" || e.name === "SendMessageChallengeError" || e.name === "SignedPreKeyRotationError" || e.name === "OutgoingIdentityKeyError";
  }
  hasSuccessfulDelivery() {
    const sendStateByConversationId = this.get("sendStateByConversationId");
    const withoutMe = (0, import_lodash.omit)(sendStateByConversationId, window.ConversationController.getOurConversationIdOrThrow());
    return (0, import_lodash.isEmpty)(withoutMe) || (0, import_MessageSendState.someSendStatus)(withoutMe, import_MessageSendState.isSent);
  }
  markFailed() {
    const now = Date.now();
    this.set("sendStateByConversationId", (0, import_lodash.mapValues)(this.get("sendStateByConversationId") || {}, (sendState) => (0, import_MessageSendState.sendStateReducer)(sendState, {
      type: import_MessageSendState.SendActionType.Failed,
      updatedAt: now
    })));
  }
  removeOutgoingErrors(incomingIdentifier) {
    const incomingConversationId = window.ConversationController.getConversationId(incomingIdentifier);
    const errors = _.partition(this.get("errors"), (e) => window.ConversationController.getConversationId(e.identifier || e.number) === incomingConversationId && (e.name === "MessageError" || e.name === "OutgoingMessageError" || e.name === "SendMessageNetworkError" || e.name === "SendMessageChallengeError" || e.name === "SignedPreKeyRotationError" || e.name === "OutgoingIdentityKeyError"));
    this.set({ errors: errors[1] });
    return errors[0][0];
  }
  async send(promise, saveErrors) {
    const updateLeftPane = this.getConversation()?.debouncedUpdateLastMessage || import_lodash.noop;
    updateLeftPane();
    let result;
    try {
      const value = await promise;
      result = { success: true, value };
    } catch (err) {
      result = { success: false, value: err };
    }
    updateLeftPane();
    const attributesToUpdate = {};
    if ("dataMessage" in result.value && result.value.dataMessage) {
      attributesToUpdate.dataMessage = result.value.dataMessage;
    }
    if (!this.doNotSave) {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
    const sendStateByConversationId = {
      ...this.get("sendStateByConversationId") || {}
    };
    const sendIsNotFinal = "sendIsNotFinal" in result.value && result.value.sendIsNotFinal;
    const sendIsFinal = !sendIsNotFinal;
    const successfulIdentifiers = sendIsFinal && "successfulIdentifiers" in result.value && Array.isArray(result.value.successfulIdentifiers) ? result.value.successfulIdentifiers : [];
    const sentToAtLeastOneRecipient = result.success || Boolean(successfulIdentifiers.length);
    successfulIdentifiers.forEach((identifier) => {
      const conversation = window.ConversationController.get(identifier);
      if (!conversation) {
        return;
      }
      if (conversation.isEverUnregistered()) {
        conversation.setRegistered();
      }
      const previousSendState = (0, import_getOwn.getOwn)(sendStateByConversationId, conversation.id);
      if (previousSendState) {
        sendStateByConversationId[conversation.id] = (0, import_MessageSendState.sendStateReducer)(previousSendState, {
          type: import_MessageSendState.SendActionType.Sent,
          updatedAt: Date.now()
        });
      }
    });
    const previousUnidentifiedDeliveries = this.get("unidentifiedDeliveries") || [];
    const newUnidentifiedDeliveries = sendIsFinal && "unidentifiedDeliveries" in result.value && Array.isArray(result.value.unidentifiedDeliveries) ? result.value.unidentifiedDeliveries : [];
    const promises = [];
    let errors;
    if (result.value instanceof import_Errors.SendMessageProtoError && result.value.errors) {
      ({ errors } = result.value);
    } else if ((0, import_helpers.isCustomError)(result.value)) {
      errors = [result.value];
    } else if (Array.isArray(result.value.errors)) {
      ({ errors } = result.value);
    } else {
      errors = [];
    }
    const errorsToSave = [];
    let hadSignedPreKeyRotationError = false;
    errors.forEach((error) => {
      const conversation = window.ConversationController.get(error.identifier) || window.ConversationController.get(error.number);
      if (conversation && !saveErrors && sendIsFinal) {
        const previousSendState = (0, import_getOwn.getOwn)(sendStateByConversationId, conversation.id);
        if (previousSendState) {
          sendStateByConversationId[conversation.id] = (0, import_MessageSendState.sendStateReducer)(previousSendState, {
            type: import_MessageSendState.SendActionType.Failed,
            updatedAt: Date.now()
          });
        }
      }
      let shouldSaveError = true;
      switch (error.name) {
        case "SignedPreKeyRotationError":
          hadSignedPreKeyRotationError = true;
          break;
        case "OutgoingIdentityKeyError": {
          if (conversation) {
            promises.push(conversation.getProfiles());
          }
          break;
        }
        case "UnregisteredUserError":
          if (conversation && (0, import_whatTypeOfConversation.isGroup)(conversation.attributes)) {
            shouldSaveError = false;
          }
          conversation?.setUnregistered();
          break;
        default:
          break;
      }
      if (shouldSaveError) {
        errorsToSave.push(error);
      }
    });
    if (hadSignedPreKeyRotationError) {
      promises.push(window.getAccountManager().rotateSignedPreKey(import_UUID.UUIDKind.ACI));
    }
    attributesToUpdate.sendStateByConversationId = sendStateByConversationId;
    attributesToUpdate.expirationStartTimestamp = sentToAtLeastOneRecipient ? Date.now() : void 0;
    attributesToUpdate.unidentifiedDeliveries = (0, import_lodash.union)(previousUnidentifiedDeliveries, newUnidentifiedDeliveries);
    attributesToUpdate.errors = [];
    this.set(attributesToUpdate);
    if (saveErrors) {
      saveErrors(errorsToSave);
    } else {
      this.saveErrors(errorsToSave, { skipSave: true });
    }
    if (!this.doNotSave) {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
    updateLeftPane();
    if (sentToAtLeastOneRecipient && !this.doNotSendSyncMessage) {
      promises.push(this.sendSyncMessage());
    }
    await Promise.all(promises);
    const isTotalSuccess = result.success && !this.get("errors")?.length;
    if (isTotalSuccess) {
      delete this.cachedOutgoingPreviewData;
      delete this.cachedOutgoingQuoteData;
      delete this.cachedOutgoingStickerData;
    }
    updateLeftPane();
  }
  async sendSyncMessageOnly(dataMessage, saveErrors) {
    const conv = this.getConversation();
    this.set({ dataMessage });
    const updateLeftPane = conv?.debouncedUpdateLastMessage;
    try {
      this.set({
        expirationStartTimestamp: Date.now(),
        errors: []
      });
      const result = await this.sendSyncMessage();
      this.set({
        unidentifiedDeliveries: result && result.unidentifiedDeliveries ? result.unidentifiedDeliveries : void 0
      });
      return result;
    } catch (error) {
      const resultErrors = error?.errors;
      const errors = Array.isArray(resultErrors) ? resultErrors : [new Error("Unknown error")];
      if (saveErrors) {
        saveErrors(errors);
      } else {
        this.saveErrors(errors, { skipSave: true });
      }
      throw error;
    } finally {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
      if (updateLeftPane) {
        updateLeftPane();
      }
    }
  }
  async sendSyncMessage() {
    const ourConversation = window.ConversationController.getOurConversationOrThrow();
    const sendOptions = await (0, import_getSendOptions.getSendOptions)(ourConversation.attributes, {
      syncMessage: true
    });
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("sendSyncMessage: We are primary device; not sending sync message");
      this.set({ dataMessage: void 0 });
      return;
    }
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("sendSyncMessage: messaging not available!");
    }
    this.syncPromise = this.syncPromise || Promise.resolve();
    const next = /* @__PURE__ */ __name(async () => {
      const dataMessage = this.get("dataMessage");
      if (!dataMessage) {
        return;
      }
      const isUpdate = Boolean(this.get("synced"));
      const conv = this.getConversation();
      const sendEntries = Object.entries(this.get("sendStateByConversationId") || {});
      const sentEntries = (0, import_iterables.filter)(sendEntries, ([_conversationId, { status }]) => (0, import_MessageSendState.isSent)(status));
      const allConversationIdsSentTo = (0, import_iterables.map)(sentEntries, ([conversationId]) => conversationId);
      const conversationIdsSentTo = (0, import_iterables.filter)(allConversationIdsSentTo, (conversationId) => conversationId !== ourConversation.id);
      const unidentifiedDeliveries = this.get("unidentifiedDeliveries") || [];
      const maybeConversationsWithSealedSender = (0, import_iterables.map)(unidentifiedDeliveries, (identifier) => window.ConversationController.get(identifier));
      const conversationsWithSealedSender = (0, import_iterables.filter)(maybeConversationsWithSealedSender, import_isNotNil.isNotNil);
      const conversationIdsWithSealedSender = new Set((0, import_iterables.map)(conversationsWithSealedSender, (c) => c.id));
      return (0, import_handleMessageSend.handleMessageSend)(messaging.sendSyncMessage({
        encodedDataMessage: dataMessage,
        timestamp: this.get("sent_at"),
        destination: conv.get("e164"),
        destinationUuid: conv.get("uuid"),
        expirationStartTimestamp: this.get("expirationStartTimestamp") || null,
        conversationIdsSentTo,
        conversationIdsWithSealedSender,
        isUpdate,
        options: sendOptions,
        urgent: false
      }), { messageIds: this.id ? [this.id] : [], sendType: "sentSync" }).then(async (result) => {
        let newSendStateByConversationId;
        const sendStateByConversationId = this.get("sendStateByConversationId") || {};
        const ourOldSendState = (0, import_getOwn.getOwn)(sendStateByConversationId, ourConversation.id);
        if (ourOldSendState) {
          const ourNewSendState = (0, import_MessageSendState.sendStateReducer)(ourOldSendState, {
            type: import_MessageSendState.SendActionType.Sent,
            updatedAt: Date.now()
          });
          if (ourNewSendState !== ourOldSendState) {
            newSendStateByConversationId = {
              ...sendStateByConversationId,
              [ourConversation.id]: ourNewSendState
            };
          }
        }
        this.set({
          synced: true,
          dataMessage: null,
          ...newSendStateByConversationId ? { sendStateByConversationId: newSendStateByConversationId } : {}
        });
        if (this.doNotSave) {
          return result;
        }
        await window.Signal.Data.saveMessage(this.attributes, {
          ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
        });
        return result;
      });
    }, "next");
    this.syncPromise = this.syncPromise.then(next, next);
    return this.syncPromise;
  }
  hasRequiredAttachmentDownloads() {
    const attachments = this.get("attachments") || [];
    const hasLongMessageAttachments = attachments.some((attachment) => {
      return MIME.isLongMessage(attachment.contentType);
    });
    if (hasLongMessageAttachments) {
      return true;
    }
    const sticker = this.get("sticker");
    if (sticker) {
      return !sticker.data || !sticker.data.path;
    }
    return false;
  }
  hasAttachmentDownloads() {
    return (0, import_hasAttachmentDownloads.hasAttachmentDownloads)(this.attributes);
  }
  async queueAttachmentDownloads() {
    const value = await (0, import_queueAttachmentDownloads.queueAttachmentDownloads)(this.attributes);
    if (!value) {
      return false;
    }
    this.set(value);
    return true;
  }
  markAttachmentAsCorrupted(attachment) {
    if (!attachment.path) {
      throw new Error("Attachment can't be marked as corrupted because it wasn't loaded");
    }
    const attachments = this.get("attachments") || [];
    let changed = false;
    const newAttachments = attachments.map((existing) => {
      if (existing.path !== attachment.path) {
        return existing;
      }
      changed = true;
      return {
        ...existing,
        isCorrupted: true
      };
    });
    if (!changed) {
      throw new Error("Attachment can't be marked as corrupted because it wasn't found");
    }
    log.info("markAttachmentAsCorrupted: marking an attachment as corrupted");
    this.set({
      attachments: newAttachments
    });
  }
  async copyFromQuotedMessage(quote, conversationId) {
    if (!quote) {
      return void 0;
    }
    const { id } = quote;
    (0, import_assert.strictAssert)(id, "Quote must have an id");
    const result = {
      ...quote,
      id,
      attachments: quote.attachments.slice(),
      bodyRanges: quote.bodyRanges.map(({ start, length, mentionUuid }) => {
        (0, import_assert.strictAssert)(start !== void 0 && start !== null, "Received quote with a bodyRange.start == null");
        (0, import_assert.strictAssert)(length !== void 0 && length !== null, "Received quote with a bodyRange.length == null");
        return {
          start,
          length,
          mentionUuid: (0, import_dropNull.dropNull)(mentionUuid)
        };
      }),
      referencedMessageNotFound: false,
      isGiftBadge: quote.type === import_protobuf.SignalService.DataMessage.Quote.Type.GIFT_BADGE,
      isViewOnce: false,
      messageId: ""
    };
    const inMemoryMessages = window.MessageController.filterBySentAt(id);
    const matchingMessage = (0, import_iterables.find)(inMemoryMessages, (item) => (0, import_helpers.isQuoteAMatch)(item.attributes, conversationId, result));
    let queryMessage;
    if (matchingMessage) {
      queryMessage = matchingMessage;
    } else {
      log.info("copyFromQuotedMessage: db lookup needed", id);
      const messages = await window.Signal.Data.getMessagesBySentAt(id);
      const found = messages.find((item) => (0, import_helpers.isQuoteAMatch)(item, conversationId, result));
      if (!found) {
        result.referencedMessageNotFound = true;
        return result;
      }
      queryMessage = window.MessageController.register(found.id, found);
    }
    if (queryMessage) {
      await this.copyQuoteContentFromOriginal(queryMessage, result);
    }
    return result;
  }
  async copyQuoteContentFromOriginal(originalMessage, quote) {
    const { attachments } = quote;
    const firstAttachment = attachments ? attachments[0] : void 0;
    if ((0, import_message.isTapToView)(originalMessage.attributes)) {
      quote.text = void 0;
      quote.attachments = [
        {
          contentType: MIME.IMAGE_JPEG
        }
      ];
      quote.isViewOnce = true;
      return;
    }
    const isMessageAGiftBadge = (0, import_message.isGiftBadge)(originalMessage.attributes);
    if (isMessageAGiftBadge !== quote.isGiftBadge) {
      log.warn(`copyQuoteContentFromOriginal: Quote.isGiftBadge: ${quote.isGiftBadge}, isGiftBadge(message): ${isMessageAGiftBadge}`);
      quote.isGiftBadge = isMessageAGiftBadge;
    }
    if (isMessageAGiftBadge) {
      quote.text = void 0;
      quote.attachments = [];
      return;
    }
    quote.isViewOnce = false;
    quote.text = originalMessage.get("body");
    if (firstAttachment) {
      firstAttachment.thumbnail = null;
    }
    if (!firstAttachment || !firstAttachment.contentType || !GoogleChrome.isImageTypeSupported((0, import_MIME.stringToMIMEType)(firstAttachment.contentType)) && !GoogleChrome.isVideoTypeSupported((0, import_MIME.stringToMIMEType)(firstAttachment.contentType))) {
      return;
    }
    try {
      const schemaVersion = originalMessage.get("schemaVersion");
      if (schemaVersion && schemaVersion < TypedMessage.VERSION_NEEDED_FOR_DISPLAY) {
        const upgradedMessage = await upgradeMessageSchema(originalMessage.attributes);
        originalMessage.set(upgradedMessage);
        await window.Signal.Data.saveMessage(upgradedMessage, {
          ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
        });
      }
    } catch (error) {
      log.error("Problem upgrading message quoted message from database", Errors.toLogFormat(error));
      return;
    }
    const queryAttachments = originalMessage.get("attachments") || [];
    if (queryAttachments.length > 0) {
      const queryFirst = queryAttachments[0];
      const { thumbnail } = queryFirst;
      if (thumbnail && thumbnail.path) {
        firstAttachment.thumbnail = {
          ...thumbnail,
          copied: true
        };
      }
    }
    const queryPreview = originalMessage.get("preview") || [];
    if (queryPreview.length > 0) {
      const queryFirst = queryPreview[0];
      const { image } = queryFirst;
      if (image && image.path) {
        firstAttachment.thumbnail = {
          ...image,
          copied: true
        };
      }
    }
    const sticker = originalMessage.get("sticker");
    if (sticker && sticker.data && sticker.data.path) {
      firstAttachment.thumbnail = {
        ...sticker.data,
        copied: true
      };
    }
  }
  async handleDataMessage(initialMessage, confirm, options = {}) {
    const { data } = options;
    const message = this;
    const source = message.get("source");
    const sourceUuid = message.get("sourceUuid");
    const type = message.get("type");
    const conversationId = message.get("conversationId");
    const GROUP_TYPES = import_protobuf.SignalService.GroupContext.Type;
    const fromContact = (0, import_helpers.getContact)(this.attributes);
    if (fromContact) {
      fromContact.setRegistered();
    }
    const conversation = window.ConversationController.get(conversationId);
    const idLog = conversation.idForLogging();
    await conversation.queueJob("handleDataMessage", async () => {
      log.info(`handleDataMessage/${idLog}: processing message ${message.idForLogging()}`);
      if ((0, import_message.isStory)(message.attributes) && !(0, import_isConversationAccepted.isConversationAccepted)(conversation.attributes, {
        ignoreEmptyConvo: true
      })) {
        log.info(`handleDataMessage/${idLog}: dropping story from !accepted`, this.getSenderIdentifier());
        confirm();
        return;
      }
      const inMemoryMessage = window.MessageController.findBySender(this.getSenderIdentifier())?.attributes;
      if (inMemoryMessage) {
        log.info(`handleDataMessage/${idLog}: cache hit`, this.getSenderIdentifier());
      } else {
        log.info(`handleDataMessage/${idLog}: duplicate check db lookup needed`, this.getSenderIdentifier());
      }
      const existingMessage = inMemoryMessage || await getMessageBySender(this.attributes);
      const isUpdate = Boolean(data && data.isRecipientUpdate);
      const isDuplicateMessage = existingMessage && (type === "incoming" || type === "story" && existingMessage.storyDistributionListId === this.attributes.storyDistributionListId);
      if (isDuplicateMessage) {
        log.warn(`handleDataMessage/${idLog}: Received duplicate message`, this.idForLogging());
        confirm();
        return;
      }
      if (type === "outgoing") {
        if (isUpdate && existingMessage) {
          log.info(`handleDataMessage/${idLog}: Updating message ${message.idForLogging()} with received transcript`);
          const toUpdate = window.MessageController.register(existingMessage.id, existingMessage);
          const unidentifiedDeliveriesSet = new Set(toUpdate.get("unidentifiedDeliveries") ?? []);
          const sendStateByConversationId = {
            ...toUpdate.get("sendStateByConversationId") || {}
          };
          const unidentifiedStatus = data && Array.isArray(data.unidentifiedStatus) ? data.unidentifiedStatus : [];
          unidentifiedStatus.forEach(({ destinationUuid, destination, unidentified }) => {
            const identifier = destinationUuid || destination;
            if (!identifier) {
              return;
            }
            const destinationConversation = window.ConversationController.maybeMergeContacts({
              aci: destinationUuid,
              e164: destination || void 0,
              reason: `handleDataMessage(${initialMessage.timestamp})`
            });
            if (!destinationConversation) {
              return;
            }
            const updatedAt = data && (0, import_isNormalNumber.isNormalNumber)(data.timestamp) ? data.timestamp : Date.now();
            const previousSendState = (0, import_getOwn.getOwn)(sendStateByConversationId, destinationConversation.id);
            sendStateByConversationId[destinationConversation.id] = previousSendState ? (0, import_MessageSendState.sendStateReducer)(previousSendState, {
              type: import_MessageSendState.SendActionType.Sent,
              updatedAt
            }) : {
              status: import_MessageSendState.SendStatus.Sent,
              updatedAt
            };
            if (unidentified) {
              unidentifiedDeliveriesSet.add(identifier);
            }
          });
          toUpdate.set({
            sendStateByConversationId,
            unidentifiedDeliveries: [...unidentifiedDeliveriesSet]
          });
          await window.Signal.Data.saveMessage(toUpdate.attributes, {
            ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
          });
          confirm();
          return;
        }
        if (isUpdate) {
          log.warn(`handleDataMessage/${idLog}: Received update transcript, but no existing entry for message ${message.idForLogging()}. Dropping.`);
          confirm();
          return;
        }
        if (existingMessage) {
          log.warn(`handleDataMessage/${idLog}: Received duplicate transcript for message ${message.idForLogging()}, but it was not an update transcript. Dropping.`);
          confirm();
          return;
        }
      }
      if (initialMessage.groupV2) {
        if ((0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
          const { revision, groupChange } = initialMessage.groupV2;
          await window.Signal.Groups.respondToGroupV2Migration({
            conversation,
            groupChange: groupChange ? {
              base64: groupChange,
              isTrusted: false
            } : void 0,
            newRevision: revision,
            receivedAt: message.get("received_at"),
            sentAt: message.get("sent_at")
          });
        } else if (initialMessage.groupV2.masterKey && initialMessage.groupV2.secretParams && initialMessage.groupV2.publicParams) {
          await conversation.maybeRepairGroupV2({
            masterKey: initialMessage.groupV2.masterKey,
            secretParams: initialMessage.groupV2.secretParams,
            publicParams: initialMessage.groupV2.publicParams
          });
          const existingRevision = conversation.get("revision");
          const isFirstUpdate = !_.isNumber(existingRevision);
          const isV2GroupUpdate = initialMessage.groupV2 && _.isNumber(initialMessage.groupV2.revision) && (isFirstUpdate || initialMessage.groupV2.revision > existingRevision);
          if (isV2GroupUpdate && initialMessage.groupV2) {
            const { revision, groupChange } = initialMessage.groupV2;
            try {
              await window.Signal.Groups.maybeUpdateGroup({
                conversation,
                groupChange: groupChange ? {
                  base64: groupChange,
                  isTrusted: false
                } : void 0,
                newRevision: revision,
                receivedAt: message.get("received_at"),
                sentAt: message.get("sent_at")
              });
            } catch (error) {
              const errorText = error && error.stack ? error.stack : error;
              log.error(`handleDataMessage/${idLog}: Failed to process group update as part of message ${message.idForLogging()}: ${errorText}`);
              throw error;
            }
          }
        }
      }
      const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
      const sender = window.ConversationController.lookupOrCreate({
        e164: source,
        uuid: sourceUuid
      });
      const hasGroupV2Prop = Boolean(initialMessage.groupV2);
      const isV1GroupUpdate = initialMessage.group && initialMessage.group.type !== import_protobuf.SignalService.GroupContext.Type.DELIVER;
      const isBlocked = source && window.storage.blocked.isBlocked(source) || sourceUuid && window.storage.blocked.isUuidBlocked(sourceUuid);
      if (isBlocked) {
        log.info(`handleDataMessage/${idLog}: Dropping message from blocked sender. hasGroupV2Prop: ${hasGroupV2Prop}`);
        confirm();
        return;
      }
      const areWeMember = !conversation.get("left") && conversation.hasMember(ourACI);
      if (type === "incoming" && !(0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes) && hasGroupV2Prop && (!areWeMember || sourceUuid && !conversation.hasMember(new import_UUID.UUID(sourceUuid)))) {
        log.warn(`Received message destined for group ${conversation.idForLogging()}, which we or the sender are not a part of. Dropping.`);
        confirm();
        return;
      }
      if (type === "incoming" && !(0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes) && !hasGroupV2Prop && !isV1GroupUpdate && conversation.get("members") && !areWeMember) {
        log.warn(`Received message destined for group ${conversation.idForLogging()}, which we're not a part of. Dropping.`);
        confirm();
        return;
      }
      if (isV1GroupUpdate && (0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes)) {
        log.warn(`Received GroupV1 update in GroupV2 conversation ${conversation.idForLogging()}. Dropping.`);
        confirm();
        return;
      }
      if (conversation.get("announcementsOnly") && !conversation.isAdmin(import_UUID.UUID.checkedLookup(sender?.id))) {
        confirm();
        return;
      }
      const messageId = message.get("id") || import_UUID.UUID.generate().toString();
      if (type === "incoming" && this.get("unidentifiedDeliveryReceived") && !(0, import_message.hasErrors)(this.attributes) && conversation.getAccepted()) {
        window.Whisper.deliveryReceiptQueue.add(() => {
          window.Whisper.deliveryReceiptBatcher.add({
            messageId,
            senderE164: source,
            senderUuid: sourceUuid,
            timestamp: this.get("sent_at")
          });
        });
      }
      const [quote, storyQuote] = await Promise.all([
        this.copyFromQuotedMessage(initialMessage.quote, conversation.id),
        (0, import_findStoryMessage.findStoryMessage)(conversation.id, initialMessage.storyContext)
      ]);
      if (initialMessage.storyContext && !storyQuote) {
        log.warn(`handleDataMessage/${idLog}: Received storyContext message but no matching story. Dropping.`);
        confirm();
        return;
      }
      const withQuoteReference = {
        ...message.attributes,
        ...initialMessage,
        quote,
        storyId: storyQuote?.id
      };
      const dataMessage = await upgradeMessageSchema(withQuoteReference);
      try {
        const now = new Date().getTime();
        const urls = LinkPreview.findLinks(dataMessage.body || "");
        const incomingPreview = dataMessage.preview || [];
        const preview = incomingPreview.filter((item) => (item.image || item.title) && urls.includes(item.url) && LinkPreview.shouldPreviewHref(item.url));
        if (preview.length < incomingPreview.length) {
          log.info(`${message.idForLogging()}: Eliminated ${preview.length - incomingPreview.length} previews with invalid urls'`);
        }
        message.set({
          id: messageId,
          attachments: dataMessage.attachments,
          body: dataMessage.body,
          bodyRanges: dataMessage.bodyRanges,
          contact: dataMessage.contact,
          conversationId: conversation.id,
          decrypted_at: now,
          errors: [],
          flags: dataMessage.flags,
          giftBadge: initialMessage.giftBadge,
          hasAttachments: dataMessage.hasAttachments,
          hasFileAttachments: dataMessage.hasFileAttachments,
          hasVisualMediaAttachments: dataMessage.hasVisualMediaAttachments,
          isViewOnce: Boolean(dataMessage.isViewOnce),
          preview,
          requiredProtocolVersion: dataMessage.requiredProtocolVersion || this.INITIAL_PROTOCOL_VERSION,
          supportedVersionAtReceive: this.CURRENT_PROTOCOL_VERSION,
          quote: dataMessage.quote,
          schemaVersion: dataMessage.schemaVersion,
          sticker: dataMessage.sticker,
          storyId: dataMessage.storyId
        });
        if (storyQuote) {
          await this.hydrateStoryContext(storyQuote);
        }
        const isSupported = !(0, import_message.isUnsupportedMessage)(message.attributes);
        if (!isSupported) {
          await message.eraseContents();
        }
        if (isSupported) {
          let attributes = {
            ...conversation.attributes
          };
          if (!hasGroupV2Prop && initialMessage.group) {
            const pendingGroupUpdate = {};
            const memberConversations = await Promise.all(initialMessage.group.membersE164.map((e164) => window.ConversationController.getOrCreateAndWait(e164, "private")));
            const members = memberConversations.map((c) => c.get("id"));
            attributes = {
              ...attributes,
              type: "group",
              groupId: initialMessage.group.id
            };
            if (initialMessage.group.type === GROUP_TYPES.UPDATE) {
              attributes = {
                ...attributes,
                name: initialMessage.group.name,
                members: _.union(members, conversation.get("members"))
              };
              if (initialMessage.group.name !== conversation.get("name")) {
                pendingGroupUpdate.name = initialMessage.group.name;
              }
              const avatarAttachment = initialMessage.group.avatar;
              let downloadedAvatar;
              let hash;
              if (avatarAttachment) {
                try {
                  downloadedAvatar = await (0, import_downloadAttachment.downloadAttachment)(avatarAttachment);
                  if (downloadedAvatar) {
                    const loadedAttachment = await window.Signal.Migrations.loadAttachmentData(downloadedAvatar);
                    hash = (0, import_Crypto.computeHash)(loadedAttachment.data);
                  }
                } catch (err) {
                  log.info("handleDataMessage: group avatar download failed");
                }
              }
              const existingAvatar = conversation.get("avatar");
              if (!existingAvatar && avatarAttachment || existingAvatar && existingAvatar.hash !== hash || existingAvatar && !avatarAttachment) {
                if (existingAvatar && existingAvatar.path) {
                  await window.Signal.Migrations.deleteAttachmentData(existingAvatar.path);
                }
                let avatar = null;
                if (downloadedAvatar && avatarAttachment !== null) {
                  const onDiskAttachment = await Attachment.migrateDataToFileSystem(downloadedAvatar, {
                    writeNewAttachmentData: window.Signal.Migrations.writeNewAttachmentData,
                    logger: log
                  });
                  avatar = {
                    ...onDiskAttachment,
                    hash
                  };
                }
                attributes.avatar = avatar;
                pendingGroupUpdate.avatarUpdated = true;
              } else {
                log.info("handleDataMessage: Group avatar hash matched; not replacing group avatar");
              }
              const difference = _.difference(members, conversation.get("members"));
              if (difference.length > 0) {
                const maybeE164s = (0, import_iterables.map)(difference, (id) => window.ConversationController.get(id)?.get("e164"));
                const e164s = (0, import_iterables.filter)(maybeE164s, import_isNotNil.isNotNil);
                pendingGroupUpdate.joined = [...e164s];
              }
              if (conversation.get("left")) {
                log.warn("re-added to a left group");
                attributes.left = false;
                conversation.set({ addedBy: (0, import_helpers.getContactId)(message.attributes) });
              }
            } else if (initialMessage.group.type === GROUP_TYPES.QUIT) {
              const inGroup = Boolean(sender && (conversation.get("members") || []).includes(sender.id));
              if (!inGroup) {
                const senderString = sender ? sender.idForLogging() : null;
                log.info(`Got 'left' message from someone not in group: ${senderString}. Dropping.`);
                return;
              }
              if ((0, import_whatTypeOfConversation.isMe)(sender.attributes)) {
                attributes.left = true;
                pendingGroupUpdate.left = "You";
              } else {
                pendingGroupUpdate.left = sender.get("id");
              }
              attributes.members = _.without(conversation.get("members"), sender.get("id"));
            }
            if (!(0, import_lodash.isEmpty)(pendingGroupUpdate)) {
              message.set("group_update", pendingGroupUpdate);
            }
          }
          if (message.isEmpty()) {
            log.info(`handleDataMessage: Dropping empty message ${message.idForLogging()} in conversation ${conversation.idForLogging()}`);
            confirm();
            return;
          }
          if ((0, import_message.isStory)(message.attributes)) {
            attributes.hasPostedStory = true;
          } else {
            attributes.active_at = now;
          }
          conversation.set(attributes);
          if (dataMessage.expireTimer && !(0, import_message.isExpirationTimerUpdate)(dataMessage)) {
            message.set({ expireTimer: dataMessage.expireTimer });
          }
          if (!hasGroupV2Prop && !(0, import_message.isStory)(message.attributes)) {
            if ((0, import_message.isExpirationTimerUpdate)(message.attributes)) {
              message.set({
                expirationTimerUpdate: {
                  source,
                  sourceUuid,
                  expireTimer: initialMessage.expireTimer
                }
              });
              if (conversation.get("expireTimer") !== dataMessage.expireTimer) {
                log.info("Incoming expirationTimerUpdate changed timer", {
                  id: conversation.idForLogging(),
                  expireTimer: dataMessage.expireTimer || "disabled",
                  source: "handleDataMessage/expirationTimerUpdate"
                });
                conversation.set({
                  expireTimer: dataMessage.expireTimer
                });
              }
            }
            if (dataMessage.expireTimer) {
              conversation.updateExpirationTimer(dataMessage.expireTimer, {
                source,
                receivedAt: message.get("received_at"),
                receivedAtMS: message.get("received_at_ms"),
                sentAt: message.get("sent_at"),
                fromGroupUpdate: (0, import_message.isGroupUpdate)(message.attributes),
                reason: `handleDataMessage(${this.idForLogging()})`
              });
            } else if (!(0, import_message.isGroupUpdate)(message.attributes) && !(0, import_message.isEndSession)(message.attributes)) {
              conversation.updateExpirationTimer(void 0, {
                source,
                receivedAt: message.get("received_at"),
                receivedAtMS: message.get("received_at_ms"),
                sentAt: message.get("sent_at"),
                reason: `handleDataMessage(${this.idForLogging()})`
              });
            }
          }
          if (initialMessage.profileKey) {
            const { profileKey } = initialMessage;
            if (source === window.textsecure.storage.user.getNumber() || sourceUuid === window.textsecure.storage.user.getUuid()?.toString()) {
              conversation.set({ profileSharing: true });
            } else if ((0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes)) {
              conversation.setProfileKey(profileKey);
            } else {
              const local = window.ConversationController.lookupOrCreate({
                e164: source,
                uuid: sourceUuid
              });
              local?.setProfileKey(profileKey);
            }
          }
          if ((0, import_message.isTapToView)(message.attributes) && type === "outgoing") {
            await message.eraseContents();
          }
          if (type === "incoming" && (0, import_message.isTapToView)(message.attributes) && !message.isValidTapToView()) {
            log.warn(`Received tap to view message ${message.idForLogging()} with invalid data. Erasing contents.`);
            message.set({
              isTapToViewInvalid: true
            });
            await message.eraseContents();
          }
        }
        const conversationTimestamp = conversation.get("timestamp");
        const isGroupStoryReply = (0, import_whatTypeOfConversation.isGroup)(conversation.attributes) && message.get("storyId");
        if (!(0, import_message.isStory)(message.attributes) && !isGroupStoryReply && (!conversationTimestamp || message.get("sent_at") > conversationTimestamp)) {
          conversation.set({
            lastMessage: message.getNotificationText(),
            timestamp: message.get("sent_at")
          });
        }
        window.MessageController.register(message.id, message);
        conversation.incrementMessageCount();
        window.Signal.Data.updateConversation(conversation.attributes);
        const reduxState = window.reduxStore.getState();
        const giftBadge = message.get("giftBadge");
        if (giftBadge) {
          const { level } = giftBadge;
          const { updatesUrl } = window.SignalContext.config;
          (0, import_assert.strictAssert)(typeof updatesUrl === "string", "getProfile: expected updatesUrl to be a defined string");
          const userLanguages = (0, import_userLanguages.getUserLanguages)(navigator.languages, window.getLocale());
          const { messaging } = window.textsecure;
          if (!messaging) {
            throw new Error("handleDataMessage: messaging is not available");
          }
          const response = await messaging.server.getBoostBadgesFromServer(userLanguages);
          const boostBadgesByLevel = (0, import_parseBadgesFromServer.parseBoostBadgeListFromServer)(response, updatesUrl);
          const badge = boostBadgesByLevel[level];
          if (!badge) {
            log.error(`handleDataMessage: gift badge with level ${level} not found on server`);
          } else {
            await window.reduxActions.badges.updateOrCreate([badge]);
            giftBadge.id = badge.id;
          }
        }
        const attachments = this.get("attachments") || [];
        let queueStoryForDownload = false;
        if ((0, import_message.isStory)(message.attributes)) {
          const isShowingStories = (0, import_stories.shouldShowStoriesView)(reduxState);
          queueStoryForDownload = isShowingStories || await (0, import_shouldDownloadStory.shouldDownloadStory)(conversation.attributes);
        }
        const shouldHoldOffDownload = (0, import_message.isStory)(message.attributes) && !queueStoryForDownload || !(0, import_message.isStory)(message.attributes) && ((0, import_Attachment.isImage)(attachments) || (0, import_Attachment.isVideo)(attachments)) && (0, import_calling.isInCall)(reduxState);
        if (this.hasAttachmentDownloads() && (conversation.getAccepted() || (0, import_message.isOutgoing)(message.attributes)) && !shouldHoldOffDownload) {
          if (window.attachmentDownloadQueue) {
            window.attachmentDownloadQueue.unshift(message);
            log.info("Adding to attachmentDownloadQueue", message.get("sent_at"));
          } else {
            await message.queueAttachmentDownloads();
          }
        }
        const isFirstRun = true;
        await this.modifyTargetMessage(conversation, isFirstRun);
        log.info("handleDataMessage: Batching save for", message.get("sent_at"));
        this.saveAndNotify(conversation, confirm);
      } catch (error) {
        const errorForLog = error && error.stack ? error.stack : error;
        log.error("handleDataMessage", message.idForLogging(), "error:", errorForLog);
        throw error;
      }
    });
  }
  async saveAndNotify(conversation, confirm) {
    await window.Signal.Util.saveNewMessageBatcher.add(this.attributes);
    log.info("Message saved", this.get("sent_at"));
    conversation.trigger("newmessage", this);
    const isFirstRun = false;
    await this.modifyTargetMessage(conversation, isFirstRun);
    const isGroupStoryReply = (0, import_whatTypeOfConversation.isGroup)(conversation.attributes) && this.get("storyId");
    if ((0, import_isMessageUnread.isMessageUnread)(this.attributes) && !isGroupStoryReply) {
      await conversation.notify(this);
    }
    if (this.get("type") === "outgoing") {
      conversation.incrementSentMessageCount();
    }
    window.Whisper.events.trigger("incrementProgress");
    confirm();
    if (!(0, import_message.isStory)(this.attributes)) {
      conversation.queueJob("updateUnread", () => conversation.updateUnread());
    }
  }
  async modifyTargetMessage(conversation, isFirstRun) {
    const message = this;
    const type = message.get("type");
    let changed = false;
    if (type === "outgoing") {
      const sendActions = import_MessageReceipts.MessageReceipts.getSingleton().forMessage(conversation, message).map((receipt) => {
        let sendActionType;
        const receiptType = receipt.get("type");
        switch (receiptType) {
          case import_MessageReceipts.MessageReceiptType.Delivery:
            sendActionType = import_MessageSendState.SendActionType.GotDeliveryReceipt;
            break;
          case import_MessageReceipts.MessageReceiptType.Read:
            sendActionType = import_MessageSendState.SendActionType.GotReadReceipt;
            break;
          case import_MessageReceipts.MessageReceiptType.View:
            sendActionType = import_MessageSendState.SendActionType.GotViewedReceipt;
            break;
          default:
            throw (0, import_missingCaseError.missingCaseError)(receiptType);
        }
        return {
          destinationConversationId: receipt.get("sourceConversationId"),
          action: {
            type: sendActionType,
            updatedAt: receipt.get("receiptTimestamp")
          }
        };
      });
      const oldSendStateByConversationId = this.get("sendStateByConversationId") || {};
      const newSendStateByConversationId = (0, import_iterables.reduce)(sendActions, (result, { destinationConversationId, action }) => {
        const oldSendState = (0, import_getOwn.getOwn)(result, destinationConversationId);
        if (!oldSendState) {
          log.warn(`Got a receipt for a conversation (${destinationConversationId}), but we have no record of sending to them`);
          return result;
        }
        const newSendState = (0, import_MessageSendState.sendStateReducer)(oldSendState, action);
        return {
          ...result,
          [destinationConversationId]: newSendState
        };
      }, oldSendStateByConversationId);
      if (!(0, import_lodash.isEqual)(oldSendStateByConversationId, newSendStateByConversationId)) {
        message.set("sendStateByConversationId", newSendStateByConversationId);
        changed = true;
      }
    }
    if (type === "incoming") {
      const readSync = import_ReadSyncs.ReadSyncs.getSingleton().forMessage(message);
      const readSyncs = readSync ? [readSync] : [];
      const viewSyncs = import_ViewSyncs.ViewSyncs.getSingleton().forMessage(message);
      const isGroupStoryReply = (0, import_whatTypeOfConversation.isGroup)(conversation.attributes) && message.get("storyId");
      const keepMutedChatsArchived = window.storage.get("keepMutedChatsArchived") ?? false;
      const keepThisConversationArchived = keepMutedChatsArchived && conversation.isMuted();
      if (readSyncs.length !== 0 || viewSyncs.length !== 0) {
        const markReadAt = Math.min(Date.now(), ...readSyncs.map((sync) => sync.get("readAt")), ...viewSyncs.map((sync) => sync.get("viewedAt")));
        if (message.get("expireTimer")) {
          const existingExpirationStartTimestamp = message.get("expirationStartTimestamp");
          message.set("expirationStartTimestamp", Math.min(existingExpirationStartTimestamp ?? Date.now(), markReadAt));
          changed = true;
        }
        let newReadStatus;
        if (viewSyncs.length) {
          newReadStatus = import_MessageReadStatus.ReadStatus.Viewed;
        } else {
          (0, import_assert.strictAssert)(readSyncs.length !== 0, "Should have either view or read syncs");
          newReadStatus = import_MessageReadStatus.ReadStatus.Read;
        }
        message.set({
          readStatus: newReadStatus,
          seenStatus: import_MessageSeenStatus.SeenStatus.Seen
        });
        changed = true;
        this.pendingMarkRead = Math.min(this.pendingMarkRead ?? Date.now(), markReadAt);
      } else if (isFirstRun && !isGroupStoryReply && !keepThisConversationArchived) {
        conversation.set({
          isArchived: false
        });
      }
      if (!isFirstRun && this.pendingMarkRead) {
        const markReadAt = this.pendingMarkRead;
        this.pendingMarkRead = void 0;
        message.getConversation()?.onReadMessage(message, markReadAt);
      }
      if ((0, import_message.isTapToView)(message.attributes)) {
        const viewOnceOpenSync = import_ViewOnceOpenSyncs.ViewOnceOpenSyncs.getSingleton().forMessage(message);
        if (viewOnceOpenSync) {
          await message.markViewOnceMessageViewed({ fromSync: true });
          changed = true;
        }
      }
    }
    if ((0, import_message.isStory)(message.attributes) && !message.get("expirationStartTimestamp")) {
      message.set("expirationStartTimestamp", Math.min(message.get("serverTimestamp") || message.get("timestamp"), Date.now()));
      changed = true;
    }
    const reactions = import_Reactions.Reactions.getSingleton().forMessage(message);
    await Promise.all(reactions.map(async (reaction) => {
      await message.handleReaction(reaction, false);
      changed = true;
    }));
    const deletes = import_Deletes.Deletes.getSingleton().forMessage(message);
    await Promise.all(deletes.map(async (del) => {
      await window.Signal.Util.deleteForEveryone(message, del, false);
      changed = true;
    }));
    if (changed && !isFirstRun) {
      log.info(`modifyTargetMessage/${this.idForLogging()}: Changes in second run; saving.`);
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
  }
  async handleReaction(reaction, shouldPersist = true) {
    const { attributes } = this;
    if (this.get("deletedForEveryone")) {
      return;
    }
    if ((0, import_message.hasErrors)(attributes) && ((0, import_message.isIncoming)(attributes) || (0, import_message.getMessagePropStatus)(attributes, window.ConversationController.getOurConversationIdOrThrow()) !== "partial-sent")) {
      return;
    }
    const conversation = this.getConversation();
    if (!conversation) {
      return;
    }
    const previousLength = (this.get("reactions") || []).length;
    if (reaction.get("source") === import_ReactionSource.ReactionSource.FromThisDevice) {
      log.info(`handleReaction: sending reaction to ${this.idForLogging()} from this device`);
      const newReaction = {
        emoji: reaction.get("remove") ? void 0 : reaction.get("emoji"),
        fromId: reaction.get("fromId"),
        targetAuthorUuid: reaction.get("targetAuthorUuid"),
        targetTimestamp: reaction.get("targetTimestamp"),
        timestamp: reaction.get("timestamp"),
        isSentByConversationId: (0, import_iterables.zipObject)(conversation.getMemberConversationIds(), (0, import_iterables.repeat)(false))
      };
      const reactions = reactionUtil.addOutgoingReaction(this.get("reactions") || [], newReaction, (0, import_message.isStory)(this.attributes));
      this.set({ reactions });
    } else {
      const oldReactions = this.get("reactions") || [];
      let reactions;
      const oldReaction = oldReactions.find((re) => (0, import_util.isNewReactionReplacingPrevious)(re, reaction.attributes, this.attributes));
      if (oldReaction) {
        this.clearNotifications(oldReaction);
      }
      if (reaction.get("remove")) {
        log.info("handleReaction: removing reaction for message", this.idForLogging());
        if (reaction.get("source") === import_ReactionSource.ReactionSource.FromSync) {
          reactions = oldReactions.filter((re) => !(0, import_util.isNewReactionReplacingPrevious)(re, reaction.attributes, this.attributes) || re.timestamp > reaction.get("timestamp"));
        } else {
          reactions = oldReactions.filter((re) => !(0, import_util.isNewReactionReplacingPrevious)(re, reaction.attributes, this.attributes));
        }
        this.set({ reactions });
        await window.Signal.Data.removeReactionFromConversation({
          emoji: reaction.get("emoji"),
          fromId: reaction.get("fromId"),
          targetAuthorUuid: reaction.get("targetAuthorUuid"),
          targetTimestamp: reaction.get("targetTimestamp")
        });
      } else {
        log.info("handleReaction: adding reaction for message", this.idForLogging());
        let reactionToAdd;
        if (reaction.get("source") === import_ReactionSource.ReactionSource.FromSync) {
          const ourReactions = [
            reaction.toJSON(),
            ...oldReactions.filter((re) => re.fromId === reaction.get("fromId"))
          ];
          reactionToAdd = (0, import_lodash.maxBy)(ourReactions, "timestamp");
        } else {
          reactionToAdd = reaction.toJSON();
        }
        reactions = oldReactions.filter((re) => !(0, import_util.isNewReactionReplacingPrevious)(re, reaction.attributes, this.attributes));
        reactions.push(reactionToAdd);
        this.set({ reactions });
        if ((0, import_message.isOutgoing)(this.attributes) && reaction.get("source") === import_ReactionSource.ReactionSource.FromSomeoneElse) {
          conversation.notify(this, reaction);
        }
        await window.Signal.Data.addReaction({
          conversationId: this.get("conversationId"),
          emoji: reaction.get("emoji"),
          fromId: reaction.get("fromId"),
          messageId: this.id,
          messageReceivedAt: this.get("received_at"),
          targetAuthorUuid: reaction.get("targetAuthorUuid"),
          targetTimestamp: reaction.get("targetTimestamp")
        });
      }
    }
    const currentLength = (this.get("reactions") || []).length;
    log.info("handleReaction:", `Done processing reaction for message ${this.idForLogging()}.`, `Went from ${previousLength} to ${currentLength} reactions.`);
    if (reaction.get("source") === import_ReactionSource.ReactionSource.FromThisDevice) {
      const jobData = {
        type: import_conversationJobQueue.conversationQueueJobEnum.enum.Reaction,
        conversationId: conversation.id,
        messageId: this.id,
        revision: conversation.get("revision")
      };
      if (shouldPersist) {
        await import_conversationJobQueue.conversationJobQueue.add(jobData, async (jobToInsert) => {
          log.info(`enqueueReactionForSend: saving message ${this.idForLogging()} and job ${jobToInsert.id}`);
          await window.Signal.Data.saveMessage(this.attributes, {
            jobToInsert,
            ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
          });
        });
      } else {
        await import_conversationJobQueue.conversationJobQueue.add(jobData);
      }
    } else if (shouldPersist) {
      await window.Signal.Data.saveMessage(this.attributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
  }
  async handleDeleteForEveryone(del, shouldPersist = true) {
    log.info("Handling DOE.", {
      fromId: del.get("fromId"),
      targetSentTimestamp: del.get("targetSentTimestamp"),
      messageServerTimestamp: this.get("serverTimestamp"),
      deleteServerTimestamp: del.get("serverTimestamp")
    });
    import_notifications.notificationService.removeBy({ messageId: this.get("id") });
    await this.eraseContents({ deletedForEveryone: true, reactions: [] }, shouldPersist);
    this.getConversation()?.updateLastMessage();
  }
  clearNotifications(reaction = {}) {
    import_notifications.notificationService.removeBy({
      ...reaction,
      messageId: this.id
    });
  }
}
window.Whisper.Message = MessageModel;
window.Whisper.Message.getLongMessageAttachment = ({
  body,
  attachments,
  now
}) => {
  if (!body || body.length <= 2048) {
    return {
      body,
      attachments
    };
  }
  const data = Bytes.fromString(body);
  const attachment = {
    contentType: MIME.LONG_MESSAGE,
    fileName: `long-message-${now}.txt`,
    data,
    size: data.byteLength
  };
  return {
    body: body.slice(0, 2048),
    attachments: [attachment, ...attachments]
  };
};
window.Whisper.MessageCollection = window.Backbone.Collection.extend({
  model: window.Whisper.Message,
  comparator(left, right) {
    if (left.get("received_at") === right.get("received_at")) {
      return (left.get("sent_at") || 0) - (right.get("sent_at") || 0);
    }
    return (left.get("received_at") || 0) - (right.get("received_at") || 0);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageModel
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWVzc2FnZXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBpc0VtcHR5LCBpc0VxdWFsLCBtYXBWYWx1ZXMsIG1heEJ5LCBub29wLCBvbWl0LCB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdHlwZSB7XG4gIEN1c3RvbUVycm9yLFxuICBHcm91cFYxVXBkYXRlLFxuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gIE1lc3NhZ2VSZWFjdGlvblR5cGUsXG4gIFF1b3RlZE1lc3NhZ2VUeXBlLFxufSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB7XG4gIGZpbHRlcixcbiAgZmluZCxcbiAgbWFwLFxuICByZWR1Y2UsXG4gIHJlcGVhdCxcbiAgemlwT2JqZWN0LFxufSBmcm9tICcuLi91dGlsL2l0ZXJhYmxlcyc7XG5pbXBvcnQgdHlwZSB7IERlbGV0ZU1vZGVsIH0gZnJvbSAnLi4vbWVzc2FnZU1vZGlmaWVycy9EZWxldGVzJztcbmltcG9ydCB0eXBlIHsgU2VudEV2ZW50RGF0YSB9IGZyb20gJy4uL3RleHRzZWN1cmUvbWVzc2FnZVJlY2VpdmVyRXZlbnRzJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBpc05vcm1hbE51bWJlciB9IGZyb20gJy4uL3V0aWwvaXNOb3JtYWxOdW1iZXInO1xuaW1wb3J0IHsgc29mdEFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgeyBkcm9wTnVsbCB9IGZyb20gJy4uL3V0aWwvZHJvcE51bGwnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4vY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIE93blByb3BzIGFzIFNtYXJ0TWVzc2FnZURldGFpbFByb3BzVHlwZSxcbiAgQ29udGFjdCBhcyBTbWFydE1lc3NhZ2VEZXRhaWxDb250YWN0LFxufSBmcm9tICcuLi9zdGF0ZS9zbWFydC9NZXNzYWdlRGV0YWlsJztcbmltcG9ydCB7IGdldENhbGxpbmdOb3RpZmljYXRpb25UZXh0IH0gZnJvbSAnLi4vdXRpbC9jYWxsaW5nTm90aWZpY2F0aW9uJztcbmltcG9ydCB0eXBlIHtcbiAgUHJvY2Vzc2VkRGF0YU1lc3NhZ2UsXG4gIFByb2Nlc3NlZFF1b3RlLFxuICBQcm9jZXNzZWRVbmlkZW50aWZpZWREZWxpdmVyeVN0YXR1cyxcbiAgQ2FsbGJhY2tSZXN1bHRUeXBlLFxufSBmcm9tICcuLi90ZXh0c2VjdXJlL1R5cGVzLmQnO1xuaW1wb3J0IHsgU2VuZE1lc3NhZ2VQcm90b0Vycm9yIH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9FcnJvcnMnO1xuaW1wb3J0ICogYXMgZXhwaXJhdGlvblRpbWVyIGZyb20gJy4uL3V0aWwvZXhwaXJhdGlvblRpbWVyJztcbmltcG9ydCB7IGdldFVzZXJMYW5ndWFnZXMgfSBmcm9tICcuLi91dGlsL3VzZXJMYW5ndWFnZXMnO1xuXG5pbXBvcnQgdHlwZSB7IFJlYWN0aW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL1JlYWN0aW9ucyc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0ICogYXMgcmVhY3Rpb25VdGlsIGZyb20gJy4uL3JlYWN0aW9ucy91dGlsJztcbmltcG9ydCAqIGFzIFN0aWNrZXJzIGZyb20gJy4uL3R5cGVzL1N0aWNrZXJzJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0ICogYXMgRW1iZWRkZWRDb250YWN0IGZyb20gJy4uL3R5cGVzL0VtYmVkZGVkQ29udGFjdCc7XG5pbXBvcnQgdHlwZSB7XG4gIEF0dGFjaG1lbnRUeXBlLFxuICBBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YSxcbn0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBpc0ltYWdlLCBpc1ZpZGVvIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgKiBhcyBBdHRhY2htZW50IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHsgc3RyaW5nVG9NSU1FVHlwZSB9IGZyb20gJy4uL3R5cGVzL01JTUUnO1xuaW1wb3J0ICogYXMgTUlNRSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCAqIGFzIEdyb3VwQ2hhbmdlIGZyb20gJy4uL2dyb3VwQ2hhbmdlJztcbmltcG9ydCB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgdHlwZSB7IFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCB7XG4gIFNlbmRBY3Rpb25UeXBlLFxuICBTZW5kU3RhdHVzLFxuICBpc01lc3NhZ2VKdXN0Rm9yTWUsXG4gIGlzU2VudCxcbiAgc2VuZFN0YXRlUmVkdWNlcixcbiAgc29tZVNlbmRTdGF0dXMsXG59IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgbWlncmF0ZUxlZ2FjeVJlYWRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9taWdyYXRlTGVnYWN5UmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBtaWdyYXRlTGVnYWN5U2VuZEF0dHJpYnV0ZXMgfSBmcm9tICcuLi9tZXNzYWdlcy9taWdyYXRlTGVnYWN5U2VuZEF0dHJpYnV0ZXMnO1xuaW1wb3J0IHsgZ2V0T3duIH0gZnJvbSAnLi4vdXRpbC9nZXRPd24nO1xuaW1wb3J0IHsgbWFya1JlYWQsIG1hcmtWaWV3ZWQgfSBmcm9tICcuLi9zZXJ2aWNlcy9NZXNzYWdlVXBkYXRlcic7XG5pbXBvcnQgeyBpc01lc3NhZ2VVbnJlYWQgfSBmcm9tICcuLi91dGlsL2lzTWVzc2FnZVVucmVhZCc7XG5pbXBvcnQge1xuICBpc0RpcmVjdENvbnZlcnNhdGlvbixcbiAgaXNHcm91cCxcbiAgaXNHcm91cFYxLFxuICBpc0dyb3VwVjIsXG4gIGlzTWUsXG59IGZyb20gJy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBoYW5kbGVNZXNzYWdlU2VuZCB9IGZyb20gJy4uL3V0aWwvaGFuZGxlTWVzc2FnZVNlbmQnO1xuaW1wb3J0IHsgZ2V0U2VuZE9wdGlvbnMgfSBmcm9tICcuLi91dGlsL2dldFNlbmRPcHRpb25zJztcbmltcG9ydCB7IGZpbmRBbmRGb3JtYXRDb250YWN0IH0gZnJvbSAnLi4vdXRpbC9maW5kQW5kRm9ybWF0Q29udGFjdCc7XG5pbXBvcnQge1xuICBnZXRBdHRhY2htZW50c0Zvck1lc3NhZ2UsXG4gIGdldE1lc3NhZ2VQcm9wU3RhdHVzLFxuICBnZXRQcm9wc0ZvckNhbGxIaXN0b3J5LFxuICBnZXRQcm9wc0Zvck1lc3NhZ2UsXG4gIGhhc0Vycm9ycyxcbiAgaXNDYWxsSGlzdG9yeSxcbiAgaXNDaGF0U2Vzc2lvblJlZnJlc2hlZCxcbiAgaXNEZWxpdmVyeUlzc3VlLFxuICBpc0VuZFNlc3Npb24sXG4gIGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlLFxuICBpc0dpZnRCYWRnZSxcbiAgaXNHcm91cFVwZGF0ZSxcbiAgaXNHcm91cFYxTWlncmF0aW9uLFxuICBpc0dyb3VwVjJDaGFuZ2UsXG4gIGlzSW5jb21pbmcsXG4gIGlzS2V5Q2hhbmdlLFxuICBpc091dGdvaW5nLFxuICBpc1N0b3J5LFxuICBpc1Byb2ZpbGVDaGFuZ2UsXG4gIGlzVGFwVG9WaWV3LFxuICBpc1VuaXZlcnNhbFRpbWVyTm90aWZpY2F0aW9uLFxuICBpc1Vuc3VwcG9ydGVkTWVzc2FnZSxcbiAgaXNWZXJpZmllZENoYW5nZSxcbiAgcHJvY2Vzc0JvZHlSYW5nZXMsXG59IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9tZXNzYWdlJztcbmltcG9ydCB7XG4gIGlzSW5DYWxsLFxuICBnZXRDYWxsU2VsZWN0b3IsXG4gIGdldEFjdGl2ZUNhbGwsXG59IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9jYWxsaW5nJztcbmltcG9ydCB7IGdldEFjY291bnRTZWxlY3RvciB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9hY2NvdW50cyc7XG5pbXBvcnQgeyBnZXRDb250YWN0TmFtZUNvbG9yU2VsZWN0b3IgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQge1xuICBNZXNzYWdlUmVjZWlwdHMsXG4gIE1lc3NhZ2VSZWNlaXB0VHlwZSxcbn0gZnJvbSAnLi4vbWVzc2FnZU1vZGlmaWVycy9NZXNzYWdlUmVjZWlwdHMnO1xuaW1wb3J0IHsgRGVsZXRlcyB9IGZyb20gJy4uL21lc3NhZ2VNb2RpZmllcnMvRGVsZXRlcyc7XG5pbXBvcnQgdHlwZSB7IFJlYWN0aW9uTW9kZWwgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL1JlYWN0aW9ucyc7XG5pbXBvcnQgeyBSZWFjdGlvbnMgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL1JlYWN0aW9ucyc7XG5pbXBvcnQgeyBSZWFjdGlvblNvdXJjZSB9IGZyb20gJy4uL3JlYWN0aW9ucy9SZWFjdGlvblNvdXJjZSc7XG5pbXBvcnQgeyBSZWFkU3luY3MgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL1JlYWRTeW5jcyc7XG5pbXBvcnQgeyBWaWV3U3luY3MgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL1ZpZXdTeW5jcyc7XG5pbXBvcnQgeyBWaWV3T25jZU9wZW5TeW5jcyB9IGZyb20gJy4uL21lc3NhZ2VNb2RpZmllcnMvVmlld09uY2VPcGVuU3luY3MnO1xuaW1wb3J0ICogYXMgTGlua1ByZXZpZXcgZnJvbSAnLi4vdHlwZXMvTGlua1ByZXZpZXcnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uL3Byb3RvYnVmJztcbmltcG9ydCB7XG4gIGNvbnZlcnNhdGlvbkpvYlF1ZXVlLFxuICBjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0sXG59IGZyb20gJy4uL2pvYnMvY29udmVyc2F0aW9uSm9iUXVldWUnO1xuaW1wb3J0IHsgbm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rUHJldmlld1R5cGUgfSBmcm9tICcuLi90eXBlcy9tZXNzYWdlL0xpbmtQcmV2aWV3cyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHsgY29tcHV0ZUhhc2ggfSBmcm9tICcuLi9DcnlwdG8nO1xuaW1wb3J0IHsgY2xlYW51cE1lc3NhZ2UsIGRlbGV0ZU1lc3NhZ2VEYXRhIH0gZnJvbSAnLi4vdXRpbC9jbGVhbnVwJztcbmltcG9ydCB7XG4gIGdldENvbnRhY3QsXG4gIGdldENvbnRhY3RJZCxcbiAgZ2V0U291cmNlLFxuICBnZXRTb3VyY2VVdWlkLFxuICBpc0N1c3RvbUVycm9yLFxuICBpc1F1b3RlQU1hdGNoLFxufSBmcm9tICcuLi9tZXNzYWdlcy9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUmVwbGFjZW1lbnRWYWx1ZXNUeXBlIH0gZnJvbSAnLi4vdHlwZXMvSTE4Tic7XG5pbXBvcnQgeyB2aWV3T25jZU9wZW5Kb2JRdWV1ZSB9IGZyb20gJy4uL2pvYnMvdmlld09uY2VPcGVuSm9iUXVldWUnO1xuaW1wb3J0IHsgZ2V0TWVzc2FnZUlkRm9yTG9nZ2luZyB9IGZyb20gJy4uL3V0aWwvaWRGb3JMb2dnaW5nJztcbmltcG9ydCB7IGhhc0F0dGFjaG1lbnREb3dubG9hZHMgfSBmcm9tICcuLi91dGlsL2hhc0F0dGFjaG1lbnREb3dubG9hZHMnO1xuaW1wb3J0IHsgcXVldWVBdHRhY2htZW50RG93bmxvYWRzIH0gZnJvbSAnLi4vdXRpbC9xdWV1ZUF0dGFjaG1lbnREb3dubG9hZHMnO1xuaW1wb3J0IHsgZmluZFN0b3J5TWVzc2FnZSB9IGZyb20gJy4uL3V0aWwvZmluZFN0b3J5TWVzc2FnZSc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvbkFjY2VwdGVkIH0gZnJvbSAnLi4vdXRpbC9pc0NvbnZlcnNhdGlvbkFjY2VwdGVkJztcbmltcG9ydCB7IGdldFN0b3J5RGF0YUZyb21NZXNzYWdlQXR0cmlidXRlcyB9IGZyb20gJy4uL3NlcnZpY2VzL3N0b3J5TG9hZGVyJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uUXVldWVKb2JEYXRhIH0gZnJvbSAnLi4vam9icy9jb252ZXJzYXRpb25Kb2JRdWV1ZSc7XG5pbXBvcnQgeyBnZXRNZXNzYWdlQnlJZCB9IGZyb20gJy4uL21lc3NhZ2VzL2dldE1lc3NhZ2VCeUlkJztcbmltcG9ydCB7IHNob3VsZERvd25sb2FkU3RvcnkgfSBmcm9tICcuLi91dGlsL3Nob3VsZERvd25sb2FkU3RvcnknO1xuaW1wb3J0IHsgc2hvdWxkU2hvd1N0b3JpZXNWaWV3IH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL3N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBDb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyIH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9TZW5kTWVzc2FnZSc7XG5pbXBvcnQgeyBTZWVuU3RhdHVzIH0gZnJvbSAnLi4vTWVzc2FnZVNlZW5TdGF0dXMnO1xuaW1wb3J0IHsgaXNOZXdSZWFjdGlvblJlcGxhY2luZ1ByZXZpb3VzIH0gZnJvbSAnLi4vcmVhY3Rpb25zL3V0aWwnO1xuaW1wb3J0IHsgcGFyc2VCb29zdEJhZGdlTGlzdEZyb21TZXJ2ZXIgfSBmcm9tICcuLi9iYWRnZXMvcGFyc2VCYWRnZXNGcm9tU2VydmVyJztcbmltcG9ydCB7IEdpZnRCYWRnZVN0YXRlcyB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL01lc3NhZ2UnO1xuaW1wb3J0IHsgZG93bmxvYWRBdHRhY2htZW50IH0gZnJvbSAnLi4vdXRpbC9kb3dubG9hZEF0dGFjaG1lbnQnO1xuaW1wb3J0IHR5cGUgeyBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSB9IGZyb20gJy4uL3R5cGVzL1N0aWNrZXJzJztcblxuLyogZXNsaW50LWRpc2FibGUgbW9yZS9uby10aGVuICovXG5cbnR5cGUgUHJvcHNGb3JNZXNzYWdlRGV0YWlsID0gUGljazxcbiAgU21hcnRNZXNzYWdlRGV0YWlsUHJvcHNUeXBlLFxuICAnc2VudEF0JyB8ICdyZWNlaXZlZEF0JyB8ICdtZXNzYWdlJyB8ICdlcnJvcnMnIHwgJ2NvbnRhY3RzJ1xuPjtcblxuZGVjbGFyZSBjb25zdCBfOiB0eXBlb2Ygd2luZG93Ll87XG5cbndpbmRvdy5XaGlzcGVyID0gd2luZG93LldoaXNwZXIgfHwge307XG5cbmNvbnN0IHsgTWVzc2FnZTogVHlwZWRNZXNzYWdlIH0gPSB3aW5kb3cuU2lnbmFsLlR5cGVzO1xuY29uc3QgeyB1cGdyYWRlTWVzc2FnZVNjaGVtYSB9ID0gd2luZG93LlNpZ25hbC5NaWdyYXRpb25zO1xuY29uc3QgeyBnZXRUZXh0V2l0aE1lbnRpb25zLCBHb29nbGVDaHJvbWUgfSA9IHdpbmRvdy5TaWduYWwuVXRpbDtcbmNvbnN0IHsgZ2V0TWVzc2FnZUJ5U2VuZGVyIH0gPSB3aW5kb3cuU2lnbmFsLkRhdGE7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlTW9kZWwgZXh0ZW5kcyB3aW5kb3cuQmFja2JvbmUuTW9kZWw8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiB7XG4gIHN0YXRpYyBnZXRMb25nTWVzc2FnZUF0dGFjaG1lbnQ6IChvcHRzOiB7XG4gICAgYXR0YWNobWVudHM6IEFycmF5PEF0dGFjaG1lbnRXaXRoSHlkcmF0ZWREYXRhPjtcbiAgICBib2R5Pzogc3RyaW5nO1xuICAgIG5vdzogbnVtYmVyO1xuICB9KSA9PiB7XG4gICAgYm9keT86IHN0cmluZztcbiAgICBhdHRhY2htZW50czogQXJyYXk8QXR0YWNobWVudFdpdGhIeWRyYXRlZERhdGE+O1xuICB9O1xuXG4gIENVUlJFTlRfUFJPVE9DT0xfVkVSU0lPTj86IG51bWJlcjtcblxuICAvLyBTZXQgd2hlbiBzZW5kaW5nIHNvbWUgc3luYyBtZXNzYWdlcywgc28gd2UgZ2V0IHRoZSBmdW5jdGlvbmFsaXR5IG9mXG4gIC8vICAgc2VuZCgpLCB3aXRob3V0IHpvbWJpZSBtZXNzYWdlcyBnb2luZyBpbnRvIHRoZSBkYXRhYmFzZS5cbiAgZG9Ob3RTYXZlPzogYm9vbGVhbjtcbiAgLy8gU2V0IHdoZW4gc2VuZGluZyBzdG9yaWVzLCBzbyB3ZSBnZXQgdGhlIGZ1bmN0aW9uYWxpdHkgb2Ygc2VuZCgpIGJ1dCB3ZSBhcmVcbiAgLy8gICBhYmxlIHRvIHNlbmQgdGhlIHN5bmMgbWVzc2FnZSBlbHNld2hlcmUuXG4gIGRvTm90U2VuZFN5bmNNZXNzYWdlPzogYm9vbGVhbjtcblxuICBJTklUSUFMX1BST1RPQ09MX1ZFUlNJT04/OiBudW1iZXI7XG5cbiAgaXNTZWxlY3RlZD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBwZW5kaW5nTWFya1JlYWQ/OiBudW1iZXI7XG5cbiAgc3luY1Byb21pc2U/OiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZSB8IHZvaWQ+O1xuXG4gIGNhY2hlZE91dGdvaW5nQ29udGFjdERhdGE/OiBBcnJheTxDb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyPjtcblxuICBjYWNoZWRPdXRnb2luZ1ByZXZpZXdEYXRhPzogQXJyYXk8TGlua1ByZXZpZXdUeXBlPjtcblxuICBjYWNoZWRPdXRnb2luZ1F1b3RlRGF0YT86IFF1b3RlZE1lc3NhZ2VUeXBlO1xuXG4gIGNhY2hlZE91dGdvaW5nU3RpY2tlckRhdGE/OiBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YTtcblxuICBvdmVycmlkZSBpbml0aWFsaXplKGF0dHJpYnV0ZXM6IHVua25vd24pOiB2b2lkIHtcbiAgICBpZiAoXy5pc09iamVjdChhdHRyaWJ1dGVzKSkge1xuICAgICAgdGhpcy5zZXQoXG4gICAgICAgIFR5cGVkTWVzc2FnZS5pbml0aWFsaXplU2NoZW1hVmVyc2lvbih7XG4gICAgICAgICAgbWVzc2FnZTogYXR0cmlidXRlcyBhcyBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gICAgICAgICAgbG9nZ2VyOiBsb2csXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRTdGF0dXMgPSBtaWdyYXRlTGVnYWN5UmVhZFN0YXR1cyh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIGlmIChyZWFkU3RhdHVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KFxuICAgICAgICB7XG4gICAgICAgICAgcmVhZFN0YXR1cyxcbiAgICAgICAgICBzZWVuU3RhdHVzOlxuICAgICAgICAgICAgcmVhZFN0YXR1cyA9PT0gUmVhZFN0YXR1cy5VbnJlYWRcbiAgICAgICAgICAgICAgPyBTZWVuU3RhdHVzLlVuc2VlblxuICAgICAgICAgICAgICA6IFNlZW5TdGF0dXMuU2VlbixcbiAgICAgICAgfSxcbiAgICAgICAgeyBzaWxlbnQ6IHRydWUgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXJDb252ZXJzYXRpb25JZCA9XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZCgpO1xuICAgIGlmIChvdXJDb252ZXJzYXRpb25JZCkge1xuICAgICAgY29uc3Qgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9IG1pZ3JhdGVMZWdhY3lTZW5kQXR0cmlidXRlcyhcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLFxuICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQuYmluZCh3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlciksXG4gICAgICAgIG91ckNvbnZlcnNhdGlvbklkXG4gICAgICApO1xuICAgICAgaWYgKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpIHtcbiAgICAgICAgdGhpcy5zZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnLCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLCB7XG4gICAgICAgICAgc2lsZW50OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLkNVUlJFTlRfUFJPVE9DT0xfVkVSU0lPTiA9IFByb3RvLkRhdGFNZXNzYWdlLlByb3RvY29sVmVyc2lvbi5DVVJSRU5UO1xuICAgIHRoaXMuSU5JVElBTF9QUk9UT0NPTF9WRVJTSU9OID0gUHJvdG8uRGF0YU1lc3NhZ2UuUHJvdG9jb2xWZXJzaW9uLklOSVRJQUw7XG5cbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCB0aGlzLm5vdGlmeVJlZHV4KTtcbiAgfVxuXG4gIG5vdGlmeVJlZHV4KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgc3RvcnlDaGFuZ2VkIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLnN0b3JpZXM7XG5cbiAgICBpZiAoaXNTdG9yeSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBjb25zdCBzdG9yeURhdGEgPSBnZXRTdG9yeURhdGFGcm9tTWVzc2FnZUF0dHJpYnV0ZXModGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgICAgaWYgKCFzdG9yeURhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzdG9yeUNoYW5nZWQoc3RvcnlEYXRhKTtcblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FudCBtZXNzYWdlQ2hhbmdlZCB0byBydW5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1lc3NhZ2VDaGFuZ2VkIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnM7XG5cbiAgICBpZiAobWVzc2FnZUNoYW5nZWQpIHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gdGhpcy5nZXQoJ2NvbnZlcnNhdGlvbklkJyk7XG4gICAgICAvLyBOb3RlOiBUaGUgY2xvbmUgaXMgaW1wb3J0YW50IGZvciB0cmlnZ2VyaW5nIGEgcmUtcnVuIG9mIHNlbGVjdG9yc1xuICAgICAgbWVzc2FnZUNoYW5nZWQodGhpcy5pZCwgY29udmVyc2F0aW9uSWQsIHsgLi4udGhpcy5hdHRyaWJ1dGVzIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFNlbmRlcklkZW50aWZpZXIoKTogc3RyaW5nIHtcbiAgICBjb25zdCBzZW50QXQgPSB0aGlzLmdldCgnc2VudF9hdCcpO1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZ2V0KCdzb3VyY2UnKTtcbiAgICBjb25zdCBzb3VyY2VVdWlkID0gdGhpcy5nZXQoJ3NvdXJjZVV1aWQnKTtcbiAgICBjb25zdCBzb3VyY2VEZXZpY2UgPSB0aGlzLmdldCgnc291cmNlRGV2aWNlJyk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgIGUxNjQ6IHNvdXJjZSxcbiAgICAgIHV1aWQ6IHNvdXJjZVV1aWQsXG4gICAgfSkhO1xuXG4gICAgcmV0dXJuIGAke2NvbnZlcnNhdGlvbj8uaWR9LiR7c291cmNlRGV2aWNlfS0ke3NlbnRBdH1gO1xuICB9XG5cbiAgZ2V0UmVjZWl2ZWRBdCgpOiBudW1iZXIge1xuICAgIC8vIFdlIHdvdWxkIGxpa2UgdG8gZ2V0IHRoZSByZWNlaXZlZF9hdF9tcyBpZGVhbGx5IHNpbmNlIHJlY2VpdmVkX2F0IGlzXG4gICAgLy8gbm93IGFuIGluY3JlbWVudGluZyBjb3VudGVyIGZvciBtZXNzYWdlcyBhbmQgbm90IHRoZSBhY3R1YWwgdGltZSB0aGF0XG4gICAgLy8gdGhlIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkLiBJZiB0aGlzIGZpZWxkIGRvZXNuJ3QgZXhpc3Qgb24gdGhlIG1lc3NhZ2VcbiAgICAvLyB0aGVuIHdlIGNhbiB0cnVzdCByZWNlaXZlZF9hdC5cbiAgICByZXR1cm4gTnVtYmVyKHRoaXMuZ2V0KCdyZWNlaXZlZF9hdF9tcycpIHx8IHRoaXMuZ2V0KCdyZWNlaXZlZF9hdCcpKTtcbiAgfVxuXG4gIGlzTm9ybWFsQnViYmxlKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gdGhpcztcblxuICAgIHJldHVybiAoXG4gICAgICAhaXNDYWxsSGlzdG9yeShhdHRyaWJ1dGVzKSAmJlxuICAgICAgIWlzQ2hhdFNlc3Npb25SZWZyZXNoZWQoYXR0cmlidXRlcykgJiZcbiAgICAgICFpc0VuZFNlc3Npb24oYXR0cmlidXRlcykgJiZcbiAgICAgICFpc0V4cGlyYXRpb25UaW1lclVwZGF0ZShhdHRyaWJ1dGVzKSAmJlxuICAgICAgIWlzR3JvdXBVcGRhdGUoYXR0cmlidXRlcykgJiZcbiAgICAgICFpc0dyb3VwVjJDaGFuZ2UoYXR0cmlidXRlcykgJiZcbiAgICAgICFpc0dyb3VwVjFNaWdyYXRpb24oYXR0cmlidXRlcykgJiZcbiAgICAgICFpc0tleUNoYW5nZShhdHRyaWJ1dGVzKSAmJlxuICAgICAgIWlzUHJvZmlsZUNoYW5nZShhdHRyaWJ1dGVzKSAmJlxuICAgICAgIWlzVW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb24oYXR0cmlidXRlcykgJiZcbiAgICAgICFpc1Vuc3VwcG9ydGVkTWVzc2FnZShhdHRyaWJ1dGVzKSAmJlxuICAgICAgIWlzVmVyaWZpZWRDaGFuZ2UoYXR0cmlidXRlcylcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgaHlkcmF0ZVN0b3J5Q29udGV4dChpbk1lbW9yeU1lc3NhZ2U/OiBNZXNzYWdlTW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdG9yeUlkID0gdGhpcy5nZXQoJ3N0b3J5SWQnKTtcbiAgICBpZiAoIXN0b3J5SWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nZXQoJ3N0b3J5UmVwbHlDb250ZXh0JykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gaW5NZW1vcnlNZXNzYWdlIHx8IChhd2FpdCBnZXRNZXNzYWdlQnlJZChzdG9yeUlkKSk7XG5cbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHRoaXMuZ2V0Q29udmVyc2F0aW9uKCk7XG4gICAgICBzb2Z0QXNzZXJ0KFxuICAgICAgICBjb252ZXJzYXRpb24gJiYgaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpLFxuICAgICAgICAnaHlkcmF0ZVN0b3J5Q29udGV4dDogTm90IGEgdHlwZT1kaXJlY3QgY29udmVyc2F0aW9uJ1xuICAgICAgKTtcbiAgICAgIHRoaXMuc2V0KHtcbiAgICAgICAgc3RvcnlSZXBseUNvbnRleHQ6IHtcbiAgICAgICAgICBhdHRhY2htZW50OiB1bmRlZmluZWQsXG4gICAgICAgICAgLy8gVGhpcyBpcyBvayB0byBkbyBiZWNhdXNlIHN0b3J5IHJlcGxpZXMgb25seSBzaG93IGluIDE6MSBjb252ZXJzYXRpb25zXG4gICAgICAgICAgLy8gc28gdGhlIHN0b3J5IHRoYXQgd2FzIHF1b3RlZCBzaG91bGQgYmUgZnJvbSB0aGUgc2FtZSBjb252ZXJzYXRpb24uXG4gICAgICAgICAgYXV0aG9yVXVpZDogY29udmVyc2F0aW9uPy5nZXQoJ3V1aWQnKSxcbiAgICAgICAgICAvLyBObyBtZXNzYWdlSWQsIHJlZmVyZW5jZWQgc3Rvcnkgbm90IGZvdW5kIVxuICAgICAgICAgIG1lc3NhZ2VJZDogJycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2htZW50cyA9IGdldEF0dGFjaG1lbnRzRm9yTWVzc2FnZSh7IC4uLm1lc3NhZ2UuYXR0cmlidXRlcyB9KTtcblxuICAgIHRoaXMuc2V0KHtcbiAgICAgIHN0b3J5UmVwbHlDb250ZXh0OiB7XG4gICAgICAgIGF0dGFjaG1lbnQ6IGF0dGFjaG1lbnRzID8gYXR0YWNobWVudHNbMF0gOiB1bmRlZmluZWQsXG4gICAgICAgIGF1dGhvclV1aWQ6IG1lc3NhZ2UuZ2V0KCdzb3VyY2VVdWlkJyksXG4gICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZS5nZXQoJ2lkJyksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JNZXNzYWdlRGV0YWlsKG91ckNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiBQcm9wc0Zvck1lc3NhZ2VEZXRhaWwge1xuICAgIGNvbnN0IG5ld0lkZW50aXR5ID0gd2luZG93LmkxOG4oJ25ld0lkZW50aXR5Jyk7XG4gICAgY29uc3QgT1VUR09JTkdfS0VZX0VSUk9SID0gJ091dGdvaW5nSWRlbnRpdHlLZXlFcnJvcic7XG5cbiAgICBjb25zdCBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID1cbiAgICAgIHRoaXMuZ2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJykgfHwge307XG5cbiAgICBjb25zdCB1bmlkZW50aWZpZWREZWxpdmVyaWVzID0gdGhpcy5nZXQoJ3VuaWRlbnRpZmllZERlbGl2ZXJpZXMnKSB8fCBbXTtcbiAgICBjb25zdCB1bmlkZW50aWZpZWREZWxpdmVyaWVzU2V0ID0gbmV3IFNldChcbiAgICAgIG1hcChcbiAgICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcmllcyxcbiAgICAgICAgaWRlbnRpZmllciA9PlxuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldENvbnZlcnNhdGlvbklkKGlkZW50aWZpZXIpIGFzIHN0cmluZ1xuICAgICAgKVxuICAgICk7XG5cbiAgICBsZXQgY29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+O1xuICAgIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb24gKi9cbiAgICBpZiAoaXNJbmNvbWluZyh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBjb252ZXJzYXRpb25JZHMgPSBbZ2V0Q29udGFjdElkKHRoaXMuYXR0cmlidXRlcykhXTtcbiAgICB9IGVsc2UgaWYgKCFpc0VtcHR5KHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpKSB7XG4gICAgICBpZiAoaXNNZXNzYWdlSnVzdEZvck1lKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIG91ckNvbnZlcnNhdGlvbklkKSkge1xuICAgICAgICBjb252ZXJzYXRpb25JZHMgPSBbb3VyQ29udmVyc2F0aW9uSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udmVyc2F0aW9uSWRzID0gT2JqZWN0LmtleXMoc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCkuZmlsdGVyKFxuICAgICAgICAgIGlkID0+IGlkICE9PSBvdXJDb252ZXJzYXRpb25JZFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPbGRlciBtZXNzYWdlcyBkb24ndCBoYXZlIHRoZSByZWNpcGllbnRzIGluY2x1ZGVkIG9uIHRoZSBtZXNzYWdlLCBzbyB3ZSBmYWxsIGJhY2tcbiAgICAgIC8vICAgdG8gdGhlIGNvbnZlcnNhdGlvbidzIGN1cnJlbnQgcmVjaXBpZW50c1xuICAgICAgY29udmVyc2F0aW9uSWRzID0gKHRoaXMuZ2V0Q29udmVyc2F0aW9uKCk/LmdldFJlY2lwaWVudHMoKSB8fCBbXSkubWFwKFxuICAgICAgICAoaWQ6IHN0cmluZykgPT4gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0Q29udmVyc2F0aW9uSWQoaWQpIVxuICAgICAgKTtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uICovXG5cbiAgICAvLyBUaGlzIHdpbGwgbWFrZSB0aGUgZXJyb3IgbWVzc2FnZSBmb3Igb3V0Z29pbmcga2V5IGVycm9ycyBhIGJpdCBuaWNlclxuICAgIGNvbnN0IGFsbEVycm9ycyA9ICh0aGlzLmdldCgnZXJyb3JzJykgfHwgW10pLm1hcChlcnJvciA9PiB7XG4gICAgICBpZiAoZXJyb3IubmFtZSA9PT0gT1VUR09JTkdfS0VZX0VSUk9SKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBlcnJvci5tZXNzYWdlID0gbmV3SWRlbnRpdHk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9KTtcblxuICAgIC8vIElmIGFuIGVycm9yIGhhcyBhIHNwZWNpZmljIG51bWJlciBpdCdzIGFzc29jaWF0ZWQgd2l0aCwgd2UnbGwgc2hvdyBpdCBuZXh0IHRvXG4gICAgLy8gICB0aGF0IGNvbnRhY3QuIE90aGVyd2lzZSwgaXQgd2lsbCBiZSBhIHN0YW5kYWxvbmUgZW50cnkuXG4gICAgY29uc3QgZXJyb3JzID0gXy5yZWplY3QoYWxsRXJyb3JzLCBlcnJvciA9PlxuICAgICAgQm9vbGVhbihlcnJvci5pZGVudGlmaWVyIHx8IGVycm9yLm51bWJlcilcbiAgICApO1xuICAgIGNvbnN0IGVycm9yc0dyb3VwZWRCeUlkID0gXy5ncm91cEJ5KGFsbEVycm9ycywgZXJyb3IgPT4ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGVycm9yLmlkZW50aWZpZXIgfHwgZXJyb3IubnVtYmVyO1xuICAgICAgaWYgKCFpZGVudGlmaWVyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0Q29udmVyc2F0aW9uSWQoaWRlbnRpZmllcik7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWN0czogUmVhZG9ubHlBcnJheTxTbWFydE1lc3NhZ2VEZXRhaWxDb250YWN0PiA9XG4gICAgICBjb252ZXJzYXRpb25JZHMubWFwKGlkID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JzRm9yQ29udGFjdCA9IGdldE93bihlcnJvcnNHcm91cGVkQnlJZCwgaWQpO1xuICAgICAgICBjb25zdCBpc091dGdvaW5nS2V5RXJyb3IgPSBCb29sZWFuKFxuICAgICAgICAgIGVycm9yc0ZvckNvbnRhY3Q/LnNvbWUoZXJyb3IgPT4gZXJyb3IubmFtZSA9PT0gT1VUR09JTkdfS0VZX0VSUk9SKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBpc1VuaWRlbnRpZmllZERlbGl2ZXJ5ID1cbiAgICAgICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3VuaWRlbnRpZmllZERlbGl2ZXJ5SW5kaWNhdG9ycycsIGZhbHNlKSAmJlxuICAgICAgICAgIHRoaXMuaXNVbmlkZW50aWZpZWREZWxpdmVyeShpZCwgdW5pZGVudGlmaWVkRGVsaXZlcmllc1NldCk7XG5cbiAgICAgICAgY29uc3Qgc2VuZFN0YXRlID0gZ2V0T3duKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsIGlkKTtcblxuICAgICAgICBsZXQgc3RhdHVzID0gc2VuZFN0YXRlPy5zdGF0dXM7XG5cbiAgICAgICAgLy8gSWYgYSBtZXNzYWdlIHdhcyBvbmx5IHNlbnQgdG8geW91cnNlbGYgKE5vdGUgdG8gU2VsZiBvciBhIGxvbmVseSBncm91cCksIGl0XG4gICAgICAgIC8vICAgaXMgc2hvd24gcmVhZC5cbiAgICAgICAgaWYgKGlkID09PSBvdXJDb252ZXJzYXRpb25JZCAmJiBzdGF0dXMgJiYgaXNTZW50KHN0YXR1cykpIHtcbiAgICAgICAgICBzdGF0dXMgPSBTZW5kU3RhdHVzLlJlYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0dXNUaW1lc3RhbXAgPSBzZW5kU3RhdGU/LnVwZGF0ZWRBdDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmZpbmRBbmRGb3JtYXRDb250YWN0KGlkKSxcbiAgICAgICAgICBzdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGltZXN0YW1wOlxuICAgICAgICAgICAgc3RhdHVzVGltZXN0YW1wID09PSB0aGlzLmdldCgnc2VudF9hdCcpXG4gICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgIDogc3RhdHVzVGltZXN0YW1wLFxuICAgICAgICAgIGVycm9yczogZXJyb3JzRm9yQ29udGFjdCxcbiAgICAgICAgICBpc091dGdvaW5nS2V5RXJyb3IsXG4gICAgICAgICAgaXNVbmlkZW50aWZpZWREZWxpdmVyeSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbnRBdDogdGhpcy5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgIHJlY2VpdmVkQXQ6IHRoaXMuZ2V0UmVjZWl2ZWRBdCgpLFxuICAgICAgbWVzc2FnZTogZ2V0UHJvcHNGb3JNZXNzYWdlKHRoaXMuYXR0cmlidXRlcywge1xuICAgICAgICBjb252ZXJzYXRpb25TZWxlY3RvcjogZmluZEFuZEZvcm1hdENvbnRhY3QsXG4gICAgICAgIG91ckNvbnZlcnNhdGlvbklkLFxuICAgICAgICBvdXJOdW1iZXI6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXROdW1iZXIoKSxcbiAgICAgICAgb3VyQUNJOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAgICAgICAuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKVxuICAgICAgICAgIC50b1N0cmluZygpLFxuICAgICAgICBvdXJQTkk6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlclxuICAgICAgICAgIC5nZXRDaGVja2VkVXVpZChVVUlES2luZC5QTkkpXG4gICAgICAgICAgLnRvU3RyaW5nKCksXG4gICAgICAgIHJlZ2lvbkNvZGU6IHdpbmRvdy5zdG9yYWdlLmdldCgncmVnaW9uQ29kZScsICdaWicpLFxuICAgICAgICBhY2NvdW50U2VsZWN0b3I6IChpZGVudGlmaWVyPzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGFjY291bnRTZWxlY3RvciA9IGdldEFjY291bnRTZWxlY3RvcihzdGF0ZSk7XG4gICAgICAgICAgcmV0dXJuIGFjY291bnRTZWxlY3RvcihpZGVudGlmaWVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFjdE5hbWVDb2xvclNlbGVjdG9yOiAoXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgICAgICAgICBjb250YWN0SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuICAgICAgICApID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgY29udGFjdE5hbWVDb2xvclNlbGVjdG9yID0gZ2V0Q29udGFjdE5hbWVDb2xvclNlbGVjdG9yKHN0YXRlKTtcbiAgICAgICAgICByZXR1cm4gY29udGFjdE5hbWVDb2xvclNlbGVjdG9yKGNvbnZlcnNhdGlvbklkLCBjb250YWN0SWQpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBlcnJvcnMsXG4gICAgICBjb250YWN0cyxcbiAgICB9O1xuICB9XG5cbiAgLy8gRGVwZW5kZW5jaWVzIG9mIHByb3AtZ2VuZXJhdGlvbiBmdW5jdGlvbnNcbiAgZ2V0Q29udmVyc2F0aW9uKCk6IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHRoaXMuZ2V0KCdjb252ZXJzYXRpb25JZCcpKTtcbiAgfVxuXG4gIGdldE5vdGlmaWNhdGlvbkRhdGEoKTogeyBlbW9qaT86IHN0cmluZzsgdGV4dDogc3RyaW5nIH0ge1xuICAgIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gdGhpcztcblxuICAgIGlmIChpc0RlbGl2ZXJ5SXNzdWUoYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVtb2ppOiAnXHUyNkEwXHVGRTBGJyxcbiAgICAgICAgdGV4dDogd2luZG93LmkxOG4oJ0RlbGl2ZXJ5SXNzdWUtLXByZXZpZXcnKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGlzQ2hhdFNlc3Npb25SZWZyZXNoZWQoYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVtb2ppOiAnXHVEODNEXHVERDAxJyxcbiAgICAgICAgdGV4dDogd2luZG93LmkxOG4oJ0NoYXRSZWZyZXNoLS1ub3RpZmljYXRpb24nKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGlzVW5zdXBwb3J0ZWRNZXNzYWdlKGF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0RGVzY3JpcHRpb24tLXVuc3VwcG9ydGVkLW1lc3NhZ2UnKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGlzR3JvdXBWMU1pZ3JhdGlvbihhdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogd2luZG93LmkxOG4oJ0dyb3VwVjEtLU1pZ3JhdGlvbi0td2FzLXVwZ3JhZGVkJyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChpc1Byb2ZpbGVDaGFuZ2UoYXR0cmlidXRlcykpIHtcbiAgICAgIGNvbnN0IGNoYW5nZSA9IHRoaXMuZ2V0KCdwcm9maWxlQ2hhbmdlJyk7XG4gICAgICBjb25zdCBjaGFuZ2VkSWQgPSB0aGlzLmdldCgnY2hhbmdlZElkJyk7XG4gICAgICBjb25zdCBjaGFuZ2VkQ29udGFjdCA9IGZpbmRBbmRGb3JtYXRDb250YWN0KGNoYW5nZWRJZCk7XG4gICAgICBpZiAoIWNoYW5nZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE5vdGlmaWNhdGlvbkRhdGE6IHByb2ZpbGVDaGFuZ2Ugd2FzIG1pc3NpbmchJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHdpbmRvdy5TaWduYWwuVXRpbC5nZXRTdHJpbmdGb3JQcm9maWxlQ2hhbmdlKFxuICAgICAgICAgIGNoYW5nZSxcbiAgICAgICAgICBjaGFuZ2VkQ29udGFjdCxcbiAgICAgICAgICB3aW5kb3cuaTE4blxuICAgICAgICApLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoaXNHcm91cFYyQ2hhbmdlKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBjb25zdCBjaGFuZ2UgPSB0aGlzLmdldCgnZ3JvdXBWMkNoYW5nZScpO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBjaGFuZ2UsXG4gICAgICAgICdnZXROb3RpZmljYXRpb25EYXRhOiBpc0dyb3VwVjJDaGFuZ2UgdHJ1ZSwgYnV0IG5vIGdyb3VwVjJDaGFuZ2UhJ1xuICAgICAgKTtcblxuICAgICAgY29uc3QgY2hhbmdlcyA9IEdyb3VwQ2hhbmdlLnJlbmRlckNoYW5nZTxzdHJpbmc+KGNoYW5nZSwge1xuICAgICAgICBpMThuOiB3aW5kb3cuaTE4bixcbiAgICAgICAgb3VyQUNJOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAgICAgICAuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKVxuICAgICAgICAgIC50b1N0cmluZygpLFxuICAgICAgICBvdXJQTkk6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlclxuICAgICAgICAgIC5nZXRDaGVja2VkVXVpZChVVUlES2luZC5QTkkpXG4gICAgICAgICAgLnRvU3RyaW5nKCksXG4gICAgICAgIHJlbmRlckNvbnRhY3Q6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udmVyc2F0aW9uID1cbiAgICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgcmV0dXJuIGNvbnZlcnNhdGlvblxuICAgICAgICAgICAgPyBjb252ZXJzYXRpb24uZ2V0VGl0bGUoKVxuICAgICAgICAgICAgOiB3aW5kb3cuaTE4bigndW5rbm93bkNvbnRhY3QnKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyU3RyaW5nOiAoXG4gICAgICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgICAgX2kxOG46IHVua25vd24sXG4gICAgICAgICAgY29tcG9uZW50czogQXJyYXk8c3RyaW5nPiB8IFJlcGxhY2VtZW50VmFsdWVzVHlwZTxzdHJpbmc+IHwgdW5kZWZpbmVkXG4gICAgICAgICkgPT4gd2luZG93LmkxOG4oa2V5LCBjb21wb25lbnRzKSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4geyB0ZXh0OiBjaGFuZ2VzLm1hcCgoeyB0ZXh0IH0pID0+IHRleHQpLmpvaW4oJyAnKSB9O1xuICAgIH1cblxuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gdGhpcy5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW107XG5cbiAgICBpZiAoaXNUYXBUb1ZpZXcoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmICh0aGlzLmlzRXJhc2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0RGVzY3JpcHRpb24tLWRpc2FwcGVhcmluZy1tZWRpYScpLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoQXR0YWNobWVudC5pc0ltYWdlKGF0dGFjaG1lbnRzKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IHdpbmRvdy5pMThuKCdtZXNzYWdlLS1nZXREZXNjcmlwdGlvbi0tZGlzYXBwZWFyaW5nLXBob3RvJyksXG4gICAgICAgICAgZW1vamk6ICdcdUQ4M0RcdURDRjcnLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKEF0dGFjaG1lbnQuaXNWaWRlbyhhdHRhY2htZW50cykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0RGVzY3JpcHRpb24tLWRpc2FwcGVhcmluZy12aWRlbycpLFxuICAgICAgICAgIGVtb2ppOiAnXHVEODNDXHVERkE1JyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8vIFRoZXJlIHNob3VsZCBiZSBhbiBpbWFnZSBvciB2aWRlbyBhdHRhY2htZW50LCBidXQgd2UgaGF2ZSBhIGZhbGxiYWNrIGp1c3QgaW5cbiAgICAgIC8vICAgY2FzZS5cbiAgICAgIHJldHVybiB7IHRleHQ6IHdpbmRvdy5pMThuKCdtZWRpYU1lc3NhZ2UnKSwgZW1vamk6ICdcdUQ4M0RcdURDQ0UnIH07XG4gICAgfVxuXG4gICAgaWYgKGlzR3JvdXBVcGRhdGUoYXR0cmlidXRlcykpIHtcbiAgICAgIGNvbnN0IGdyb3VwVXBkYXRlID0gdGhpcy5nZXQoJ2dyb3VwX3VwZGF0ZScpO1xuICAgICAgY29uc3QgZnJvbUNvbnRhY3QgPSBnZXRDb250YWN0KHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgaWYgKCFncm91cFVwZGF0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE5vdGlmaWNhdGlvbkRhdGE6IE1pc3NpbmcgZ3JvdXBfdXBkYXRlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChncm91cFVwZGF0ZS5sZWZ0ID09PSAnWW91Jykge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiB3aW5kb3cuaTE4bigneW91TGVmdFRoZUdyb3VwJykgfTtcbiAgICAgIH1cbiAgICAgIGlmIChncm91cFVwZGF0ZS5sZWZ0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDogd2luZG93LmkxOG4oJ2xlZnRUaGVHcm91cCcsIFtcbiAgICAgICAgICAgIHRoaXMuZ2V0TmFtZUZvck51bWJlcihncm91cFVwZGF0ZS5sZWZ0KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmcm9tQ29udGFjdCkge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiAnJyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNNZShmcm9tQ29udGFjdC5hdHRyaWJ1dGVzKSkge1xuICAgICAgICBtZXNzYWdlcy5wdXNoKHdpbmRvdy5pMThuKCd5b3VVcGRhdGVkVGhlR3JvdXAnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlcy5wdXNoKHdpbmRvdy5pMThuKCd1cGRhdGVkVGhlR3JvdXAnLCBbZnJvbUNvbnRhY3QuZ2V0VGl0bGUoKV0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGdyb3VwVXBkYXRlLmpvaW5lZCAmJiBncm91cFVwZGF0ZS5qb2luZWQubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGpvaW5lZENvbnRhY3RzID0gXy5tYXAoZ3JvdXBVcGRhdGUuam9pbmVkLCBpdGVtID0+XG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoaXRlbSwgJ3ByaXZhdGUnKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBqb2luZWRXaXRob3V0TWUgPSBqb2luZWRDb250YWN0cy5maWx0ZXIoXG4gICAgICAgICAgY29udGFjdCA9PiAhaXNNZShjb250YWN0LmF0dHJpYnV0ZXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGpvaW5lZENvbnRhY3RzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICAgICAgd2luZG93LmkxOG4oJ211bHRpcGxlSm9pbmVkVGhlR3JvdXAnLCBbXG4gICAgICAgICAgICAgIF8ubWFwKGpvaW5lZFdpdGhvdXRNZSwgY29udGFjdCA9PiBjb250YWN0LmdldFRpdGxlKCkpLmpvaW4oJywgJyksXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoam9pbmVkV2l0aG91dE1lLmxlbmd0aCA8IGpvaW5lZENvbnRhY3RzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh3aW5kb3cuaTE4bigneW91Sm9pbmVkVGhlR3JvdXAnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGpvaW5lZENvbnRhY3QgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShcbiAgICAgICAgICAgIGdyb3VwVXBkYXRlLmpvaW5lZFswXSxcbiAgICAgICAgICAgICdwcml2YXRlJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGlzTWUoam9pbmVkQ29udGFjdC5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh3aW5kb3cuaTE4bigneW91Sm9pbmVkVGhlR3JvdXAnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goXG4gICAgICAgICAgICAgIHdpbmRvdy5pMThuKCdqb2luZWRUaGVHcm91cCcsIFtqb2luZWRDb250YWN0c1swXS5nZXRUaXRsZSgpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChncm91cFVwZGF0ZS5uYW1lKSB7XG4gICAgICAgIG1lc3NhZ2VzLnB1c2god2luZG93LmkxOG4oJ3RpdGxlSXNOb3cnLCBbZ3JvdXBVcGRhdGUubmFtZV0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChncm91cFVwZGF0ZS5hdmF0YXJVcGRhdGVkKSB7XG4gICAgICAgIG1lc3NhZ2VzLnB1c2god2luZG93LmkxOG4oJ3VwZGF0ZWRHcm91cEF2YXRhcicpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdGV4dDogbWVzc2FnZXMuam9pbignICcpIH07XG4gICAgfVxuICAgIGlmIChpc0VuZFNlc3Npb24oYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiB7IHRleHQ6IHdpbmRvdy5pMThuKCdzZXNzaW9uRW5kZWQnKSB9O1xuICAgIH1cbiAgICBpZiAoaXNJbmNvbWluZyhhdHRyaWJ1dGVzKSAmJiBoYXNFcnJvcnMoYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiB7IHRleHQ6IHdpbmRvdy5pMThuKCdpbmNvbWluZ0Vycm9yJykgfTtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gKHRoaXMuZ2V0KCdib2R5JykgfHwgJycpLnRyaW0oKTtcblxuICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbiBidXQgd2Ugd2FudCB0byBiZSBleHRyYS1jYXJlZnVsLlxuICAgICAgY29uc3QgYXR0YWNobWVudCA9IGF0dGFjaG1lbnRzWzBdIHx8IHt9O1xuICAgICAgY29uc3QgeyBjb250ZW50VHlwZSB9ID0gYXR0YWNobWVudDtcblxuICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBNSU1FLklNQUdFX0dJRiB8fCBBdHRhY2htZW50LmlzR0lGKGF0dGFjaG1lbnRzKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IGJvZHkgfHwgd2luZG93LmkxOG4oJ21lc3NhZ2UtLWdldE5vdGlmaWNhdGlvblRleHQtLWdpZicpLFxuICAgICAgICAgIGVtb2ppOiAnXHVEODNDXHVERkExJyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChBdHRhY2htZW50LmlzSW1hZ2UoYXR0YWNobWVudHMpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDogYm9keSB8fCB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0Tm90aWZpY2F0aW9uVGV4dC0tcGhvdG8nKSxcbiAgICAgICAgICBlbW9qaTogJ1x1RDgzRFx1RENGNycsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoQXR0YWNobWVudC5pc1ZpZGVvKGF0dGFjaG1lbnRzKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IGJvZHkgfHwgd2luZG93LmkxOG4oJ21lc3NhZ2UtLWdldE5vdGlmaWNhdGlvblRleHQtLXZpZGVvJyksXG4gICAgICAgICAgZW1vamk6ICdcdUQ4M0NcdURGQTUnLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKEF0dGFjaG1lbnQuaXNWb2ljZU1lc3NhZ2UoYXR0YWNobWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgYm9keSB8fCB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0Tm90aWZpY2F0aW9uVGV4dC0tdm9pY2UtbWVzc2FnZScpLFxuICAgICAgICAgIGVtb2ppOiAnXHVEODNDXHVERkE0JyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChBdHRhY2htZW50LmlzQXVkaW8oYXR0YWNobWVudHMpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgIGJvZHkgfHwgd2luZG93LmkxOG4oJ21lc3NhZ2UtLWdldE5vdGlmaWNhdGlvblRleHQtLWF1ZGlvLW1lc3NhZ2UnKSxcbiAgICAgICAgICBlbW9qaTogJ1x1RDgzRFx1REQwOCcsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiBib2R5IHx8IHdpbmRvdy5pMThuKCdtZXNzYWdlLS1nZXROb3RpZmljYXRpb25UZXh0LS1maWxlJyksXG4gICAgICAgIGVtb2ppOiAnXHVEODNEXHVEQ0NFJyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3Qgc3RpY2tlckRhdGEgPSB0aGlzLmdldCgnc3RpY2tlcicpO1xuICAgIGlmIChzdGlja2VyRGF0YSkge1xuICAgICAgY29uc3QgZW1vamkgPVxuICAgICAgICBTdGlja2Vycy5nZXRTdGlja2VyKHN0aWNrZXJEYXRhLnBhY2tJZCwgc3RpY2tlckRhdGEuc3RpY2tlcklkKT8uZW1vamkgfHxcbiAgICAgICAgc3RpY2tlckRhdGE/LmVtb2ppO1xuXG4gICAgICBpZiAoIWVtb2ppKSB7XG4gICAgICAgIGxvZy53YXJuKCdVbmFibGUgdG8gZ2V0IGVtb2ppIGZvciBzdGlja2VyJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0Tm90aWZpY2F0aW9uVGV4dC0tc3RpY2tlcnMnKSxcbiAgICAgICAgZW1vamk6IGRyb3BOdWxsKGVtb2ppKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGlzQ2FsbEhpc3RvcnkoYXR0cmlidXRlcykpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gd2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgIGNvbnN0IGNhbGxpbmdOb3RpZmljYXRpb24gPSBnZXRQcm9wc0ZvckNhbGxIaXN0b3J5KGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3I6IGZpbmRBbmRGb3JtYXRDb250YWN0LFxuICAgICAgICBjYWxsU2VsZWN0b3I6IGdldENhbGxTZWxlY3RvcihzdGF0ZSksXG4gICAgICAgIGFjdGl2ZUNhbGw6IGdldEFjdGl2ZUNhbGwoc3RhdGUpLFxuICAgICAgfSk7XG4gICAgICBpZiAoY2FsbGluZ05vdGlmaWNhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IGdldENhbGxpbmdOb3RpZmljYXRpb25UZXh0KGNhbGxpbmdOb3RpZmljYXRpb24sIHdpbmRvdy5pMThuKSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgbG9nLmVycm9yKFwiVGhpcyBjYWxsIGhpc3RvcnkgbWVzc2FnZSBkb2Vzbid0IGhhdmUgdmFsaWQgY2FsbCBoaXN0b3J5XCIpO1xuICAgIH1cbiAgICBpZiAoaXNFeHBpcmF0aW9uVGltZXJVcGRhdGUoYXR0cmlidXRlcykpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICBjb25zdCB7IGV4cGlyZVRpbWVyIH0gPSB0aGlzLmdldCgnZXhwaXJhdGlvblRpbWVyVXBkYXRlJykhO1xuICAgICAgaWYgKCFleHBpcmVUaW1lcikge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiB3aW5kb3cuaTE4bignZGlzYXBwZWFyaW5nTWVzc2FnZXNEaXNhYmxlZCcpIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHdpbmRvdy5pMThuKCd0aW1lclNldFRvJywgW1xuICAgICAgICAgIGV4cGlyYXRpb25UaW1lci5mb3JtYXQod2luZG93LmkxOG4sIGV4cGlyZVRpbWVyKSxcbiAgICAgICAgXSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChpc0tleUNoYW5nZShhdHRyaWJ1dGVzKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMuZ2V0KCdrZXlfY2hhbmdlZCcpO1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogd2luZG93LmkxOG4oJ3NhZmV0eU51bWJlckNoYW5nZWRHcm91cCcsIFtcbiAgICAgICAgICBjb252ZXJzYXRpb24gPyBjb252ZXJzYXRpb24uZ2V0VGl0bGUoKSA6ICcnLFxuICAgICAgICBdKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGNvbnRhY3RzID0gdGhpcy5nZXQoJ2NvbnRhY3QnKTtcbiAgICBpZiAoY29udGFjdHMgJiYgY29udGFjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OlxuICAgICAgICAgIEVtYmVkZGVkQ29udGFjdC5nZXROYW1lKGNvbnRhY3RzWzBdKSB8fCB3aW5kb3cuaTE4bigndW5rbm93bkNvbnRhY3QnKSxcbiAgICAgICAgZW1vamk6ICdcdUQ4M0RcdURDNjQnLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBnaWZ0QmFkZ2UgPSB0aGlzLmdldCgnZ2lmdEJhZGdlJyk7XG4gICAgaWYgKGdpZnRCYWRnZSkge1xuICAgICAgY29uc3QgZW1vamkgPSAnXHVEODNDXHVERjgxJztcblxuICAgICAgaWYgKGlzT3V0Z29pbmcodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVtb2ppLFxuICAgICAgICAgIHRleHQ6IHdpbmRvdy5pMThuKCdtZXNzYWdlLS1naWZ0QmFkZ2UtLXByZXZpZXctLXNlbnQnKSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW1vamksXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgZ2lmdEJhZGdlLnN0YXRlID09PSBHaWZ0QmFkZ2VTdGF0ZXMuVW5vcGVuZWRcbiAgICAgICAgICAgID8gd2luZG93LmkxOG4oJ21lc3NhZ2UtLWdpZnRCYWRnZS0tcHJldmlldy0tdW5vcGVuZWQnKVxuICAgICAgICAgICAgOiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2lmdEJhZGdlLS1wcmV2aWV3LS1yZWRlZW1lZCcpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoYm9keSkge1xuICAgICAgcmV0dXJuIHsgdGV4dDogYm9keSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IHRleHQ6ICcnIH07XG4gIH1cblxuICBnZXRSYXdUZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3QgYm9keSA9ICh0aGlzLmdldCgnYm9keScpIHx8ICcnKS50cmltKCk7XG4gICAgY29uc3QgeyBhdHRyaWJ1dGVzIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgYm9keVJhbmdlcyA9IHByb2Nlc3NCb2R5UmFuZ2VzKGF0dHJpYnV0ZXMsIHtcbiAgICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yOiBmaW5kQW5kRm9ybWF0Q29udGFjdCxcbiAgICB9KTtcbiAgICBpZiAoYm9keVJhbmdlcykge1xuICAgICAgcmV0dXJuIGdldFRleHRXaXRoTWVudGlvbnMoYm9keVJhbmdlcywgYm9keSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICBnZXROb3RpZmljYXRpb25UZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3QgeyB0ZXh0LCBlbW9qaSB9ID0gdGhpcy5nZXROb3RpZmljYXRpb25EYXRhKCk7XG4gICAgY29uc3QgeyBhdHRyaWJ1dGVzIH0gPSB0aGlzO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMuc3RvcnlSZWFjdGlvbkVtb2ppKSB7XG4gICAgICBpZiAoIXdpbmRvdy5TaWduYWwuT1MuaXNMaW51eCgpKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLnN0b3J5UmVhY3Rpb25FbW9qaTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRvdy5pMThuKCdRdW90ZV9fc3RvcnktcmVhY3Rpb24tLXNpbmdsZScpO1xuICAgIH1cblxuICAgIGxldCBtb2RpZmllZFRleHQgPSB0ZXh0O1xuXG4gICAgY29uc3QgYm9keVJhbmdlcyA9IHByb2Nlc3NCb2R5UmFuZ2VzKGF0dHJpYnV0ZXMsIHtcbiAgICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yOiBmaW5kQW5kRm9ybWF0Q29udGFjdCxcbiAgICB9KTtcblxuICAgIGlmIChib2R5UmFuZ2VzICYmIGJvZHlSYW5nZXMubGVuZ3RoKSB7XG4gICAgICBtb2RpZmllZFRleHQgPSBnZXRUZXh0V2l0aE1lbnRpb25zKGJvZHlSYW5nZXMsIG1vZGlmaWVkVGV4dCk7XG4gICAgfVxuXG4gICAgLy8gTGludXggZW1vamkgc3VwcG9ydCBpcyBtaXhlZCwgc28gd2UgZGlzYWJsZSBpdC4gKE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgdG91Y2hcbiAgICAvLyAgIHRoZSBgdGV4dGAsIHdoaWNoIGNhbiBjb250YWluIGVtb2ppLilcbiAgICBjb25zdCBzaG91bGRJbmNsdWRlRW1vamkgPSBCb29sZWFuKGVtb2ppKSAmJiAhd2luZG93LlNpZ25hbC5PUy5pc0xpbnV4KCk7XG4gICAgaWYgKHNob3VsZEluY2x1ZGVFbW9qaSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pMThuKCdtZXNzYWdlLS1nZXROb3RpZmljYXRpb25UZXh0LS10ZXh0LXdpdGgtZW1vamknLCB7XG4gICAgICAgIHRleHQ6IG1vZGlmaWVkVGV4dCxcbiAgICAgICAgZW1vamksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZGlmaWVkVGV4dDtcbiAgfVxuXG4gIC8vIEdlbmVyYWxcbiAgaWRGb3JMb2dnaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldE1lc3NhZ2VJZEZvckxvZ2dpbmcodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGRlZmF1bHRzKCk6IFBhcnRpYWw8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICBhdHRhY2htZW50czogW10sXG4gICAgfTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZhbGlkYXRlKGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSBbJ2NvbnZlcnNhdGlvbklkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXTtcbiAgICBjb25zdCBtaXNzaW5nID0gXy5maWx0ZXIocmVxdWlyZWQsIGF0dHIgPT4gIWF0dHJpYnV0ZXNbYXR0cl0pO1xuICAgIGlmIChtaXNzaW5nLmxlbmd0aCkge1xuICAgICAgbG9nLndhcm4oYE1lc3NhZ2UgbWlzc2luZyBhdHRyaWJ1dGVzOiAke21pc3Npbmd9YCk7XG4gICAgfVxuICB9XG5cbiAgbWVyZ2UobW9kZWw6IE1lc3NhZ2VNb2RlbCk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBtb2RlbC5hdHRyaWJ1dGVzIHx8IG1vZGVsO1xuICAgIHRoaXMuc2V0KGF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgZ2V0TmFtZUZvck51bWJlcihudW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KG51bWJlcik7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfVxuICAgIHJldHVybiBjb252ZXJzYXRpb24uZ2V0VGl0bGUoKTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFudXAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgY2xlYW51cE1lc3NhZ2UodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZURhdGEoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgZGVsZXRlTWVzc2FnZURhdGEodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlzVmFsaWRUYXBUb1ZpZXcoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYm9keSA9IHRoaXMuZ2V0KCdib2R5Jyk7XG4gICAgaWYgKGJvZHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2htZW50cyA9IHRoaXMuZ2V0KCdhdHRhY2htZW50cycpO1xuICAgIGlmICghYXR0YWNobWVudHMgfHwgYXR0YWNobWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RBdHRhY2htZW50ID0gYXR0YWNobWVudHNbMF07XG4gICAgaWYgKFxuICAgICAgIXdpbmRvdy5TaWduYWwuVXRpbC5Hb29nbGVDaHJvbWUuaXNJbWFnZVR5cGVTdXBwb3J0ZWQoXG4gICAgICAgIGZpcnN0QXR0YWNobWVudC5jb250ZW50VHlwZVxuICAgICAgKSAmJlxuICAgICAgIXdpbmRvdy5TaWduYWwuVXRpbC5Hb29nbGVDaHJvbWUuaXNWaWRlb1R5cGVTdXBwb3J0ZWQoXG4gICAgICAgIGZpcnN0QXR0YWNobWVudC5jb250ZW50VHlwZVxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHF1b3RlID0gdGhpcy5nZXQoJ3F1b3RlJyk7XG4gICAgY29uc3Qgc3RpY2tlciA9IHRoaXMuZ2V0KCdzdGlja2VyJyk7XG4gICAgY29uc3QgY29udGFjdCA9IHRoaXMuZ2V0KCdjb250YWN0Jyk7XG4gICAgY29uc3QgcHJldmlldyA9IHRoaXMuZ2V0KCdwcmV2aWV3Jyk7XG5cbiAgICBpZiAoXG4gICAgICBxdW90ZSB8fFxuICAgICAgc3RpY2tlciB8fFxuICAgICAgKGNvbnRhY3QgJiYgY29udGFjdC5sZW5ndGggPiAwKSB8fFxuICAgICAgKHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGggPiAwKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgbWFya1ZpZXdPbmNlTWVzc2FnZVZpZXdlZChvcHRpb25zPzoge1xuICAgIGZyb21TeW5jPzogYm9vbGVhbjtcbiAgfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgZnJvbVN5bmMgfSA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZFRhcFRvVmlldygpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYG1hcmtWaWV3T25jZU1lc3NhZ2VWaWV3ZWQ6IE1lc3NhZ2UgJHt0aGlzLmlkRm9yTG9nZ2luZygpfSBpcyBub3QgYSB2YWxpZCB0YXAgdG8gdmlldyBtZXNzYWdlIWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRXJhc2VkKCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgbWFya1ZpZXdPbmNlTWVzc2FnZVZpZXdlZDogTWVzc2FnZSAke3RoaXMuaWRGb3JMb2dnaW5nKCl9IGlzIGFscmVhZHkgZXJhc2VkIWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0KCdyZWFkU3RhdHVzJykgIT09IFJlYWRTdGF0dXMuVmlld2VkKSB7XG4gICAgICB0aGlzLnNldChtYXJrVmlld2VkKHRoaXMuYXR0cmlidXRlcykpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZXJhc2VDb250ZW50cygpO1xuXG4gICAgaWYgKCFmcm9tU3luYykge1xuICAgICAgY29uc3Qgc2VuZGVyRTE2NCA9IGdldFNvdXJjZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgY29uc3Qgc2VuZGVyVXVpZCA9IGdldFNvdXJjZVV1aWQodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IHRoaXMuZ2V0KCdzZW50X2F0Jyk7XG5cbiAgICAgIGlmIChzZW5kZXJVdWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJrVmlld09uY2VNZXNzYWdlVmlld2VkOiBzZW5kZXJVdWlkIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAod2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuYXJlV2VQcmltYXJ5RGV2aWNlKCkpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgJ21hcmtWaWV3T25jZU1lc3NhZ2VWaWV3ZWQ6IFdlIGFyZSBwcmltYXJ5IGRldmljZTsgbm90IHNlbmRpbmcgdmlldyBvbmNlIG9wZW4gc3luYydcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB2aWV3T25jZU9wZW5Kb2JRdWV1ZS5hZGQoe1xuICAgICAgICAgIHZpZXdPbmNlT3BlbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VuZGVyRTE2NCxcbiAgICAgICAgICAgICAgc2VuZGVyVXVpZCxcbiAgICAgICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAnbWFya1ZpZXdPbmNlTWVzc2FnZVZpZXdlZDogRmFpbGVkIHRvIHF1ZXVlIHZpZXcgb25jZSBvcGVuIHN5bmMnLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG5cbiAgICBjb25zdCBzdG9yeUlkID0gdGhpcy5nZXQoJ3N0b3J5SWQnKTtcbiAgICBpZiAoc3RvcnlJZCkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZS8ke2xvZ0lkfTogbWlzc2luZyBzdG9yeSByZWZlcmVuY2VgXG4gICAgICApO1xuXG4gICAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQoc3RvcnlJZCk7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5nZXQoJ3N0b3J5UmVwbHlDb250ZXh0JykpIHtcbiAgICAgICAgdGhpcy51bnNldCgnc3RvcnlSZXBseUNvbnRleHQnKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuaHlkcmF0ZVN0b3J5Q29udGV4dChtZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBxdW90ZSA9IHRoaXMuZ2V0KCdxdW90ZScpO1xuICAgIGlmICghcXVvdGUpIHtcbiAgICAgIGxvZy53YXJuKGBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZS8ke2xvZ0lkfTogTWlzc2luZyBxdW90ZSFgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGF1dGhvclV1aWQsIGF1dGhvciwgaWQ6IHNlbnRBdCwgcmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZCB9ID0gcXVvdGU7XG4gICAgY29uc3QgY29udGFjdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChhdXRob3JVdWlkIHx8IGF1dGhvcik7XG5cbiAgICAvLyBJcyB0aGUgcXVvdGUgcmVhbGx5IHdpdGhvdXQgYSByZWZlcmVuY2U/IENoZWNrIHdpdGggb3VyIGluIG1lbW9yeSBzdG9yZVxuICAgIC8vIGZpcnN0IHRvIG1ha2Ugc3VyZSBpdCdzIG5vdCB0aGVyZS5cbiAgICBpZiAocmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZCAmJiBjb250YWN0KSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGRvdWJsZUNoZWNrTWlzc2luZ1F1b3RlUmVmZXJlbmNlLyR7bG9nSWR9OiBWZXJpZnlpbmcgcmVmZXJlbmNlIHRvICR7c2VudEF0fWBcbiAgICAgICk7XG4gICAgICBjb25zdCBpbk1lbW9yeU1lc3NhZ2VzID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmZpbHRlckJ5U2VudEF0KFxuICAgICAgICBOdW1iZXIoc2VudEF0KVxuICAgICAgKTtcbiAgICAgIGNvbnN0IG1hdGNoaW5nTWVzc2FnZSA9IGZpbmQoaW5NZW1vcnlNZXNzYWdlcywgbWVzc2FnZSA9PlxuICAgICAgICBpc1F1b3RlQU1hdGNoKG1lc3NhZ2UuYXR0cmlidXRlcywgdGhpcy5nZXQoJ2NvbnZlcnNhdGlvbklkJyksIHF1b3RlKVxuICAgICAgKTtcbiAgICAgIGlmICghbWF0Y2hpbmdNZXNzYWdlKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZS8ke2xvZ0lkfTogTm8gbWF0Y2ggZm9yICR7c2VudEF0fS5gXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldCh7XG4gICAgICAgIHF1b3RlOiB7XG4gICAgICAgICAgLi4ucXVvdGUsXG4gICAgICAgICAgcmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZS8ke2xvZ0lkfTogRm91bmQgbWF0Y2ggZm9yICR7c2VudEF0fSwgdXBkYXRpbmcuYFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgdGhpcy5jb3B5UXVvdGVDb250ZW50RnJvbU9yaWdpbmFsKG1hdGNoaW5nTWVzc2FnZSwgcXVvdGUpO1xuICAgICAgdGhpcy5zZXQoe1xuICAgICAgICBxdW90ZToge1xuICAgICAgICAgIC4uLnF1b3RlLFxuICAgICAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICB3aW5kb3cuU2lnbmFsLlV0aWwucXVldWVVcGRhdGVNZXNzYWdlKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfVxuICB9XG5cbiAgaXNFcmFzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXQoJ2lzRXJhc2VkJykpO1xuICB9XG5cbiAgYXN5bmMgZXJhc2VDb250ZW50cyhcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllcyA9IHt9LFxuICAgIHNob3VsZFBlcnNpc3QgPSB0cnVlXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKGBFcmFzaW5nIGRhdGEgZm9yIG1lc3NhZ2UgJHt0aGlzLmlkRm9yTG9nZ2luZygpfWApO1xuXG4gICAgLy8gTm90ZTogVGhlcmUgYXJlIGNhc2VzIHdoZXJlIHdlIHdhbnQgdG8gcmUtZXJhc2UgYSBnaXZlbiBtZXNzYWdlLiBGb3IgZXhhbXBsZSwgd2hlblxuICAgIC8vICAgYSB2aWV3ZWQgKG9yIG91dGdvaW5nKSBWaWV3LU9uY2UgbWVzc2FnZSBpcyBkZWxldGVkIGZvciBldmVyeW9uZS5cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmRlbGV0ZURhdGEoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgRXJyb3IgZXJhc2luZyBkYXRhIGZvciBtZXNzYWdlICR7dGhpcy5pZEZvckxvZ2dpbmcoKX06YCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KHtcbiAgICAgIGlzRXJhc2VkOiB0cnVlLFxuICAgICAgYm9keTogJycsXG4gICAgICBib2R5UmFuZ2VzOiB1bmRlZmluZWQsXG4gICAgICBhdHRhY2htZW50czogW10sXG4gICAgICBxdW90ZTogdW5kZWZpbmVkLFxuICAgICAgY29udGFjdDogW10sXG4gICAgICBzdGlja2VyOiB1bmRlZmluZWQsXG4gICAgICBwcmV2aWV3OiBbXSxcbiAgICAgIC4uLmFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgIH0pO1xuICAgIHRoaXMuZ2V0Q29udmVyc2F0aW9uKCk/LmRlYm91bmNlZFVwZGF0ZUxhc3RNZXNzYWdlPy4oKTtcblxuICAgIGlmIChzaG91bGRQZXJzaXN0KSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UodGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZGVsZXRlU2VudFByb3RvQnlNZXNzYWdlSWQodGhpcy5pZCk7XG4gIH1cblxuICBvdmVycmlkZSBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gdGhpcztcblxuICAgIC8vIENvcmUgbWVzc2FnZSB0eXBlcyAtIHdlIGNoZWNrIGZvciBhbGwgZm91ciBiZWNhdXNlIHRoZXkgY2FuIGVhY2ggc3RhbmQgYWxvbmVcbiAgICBjb25zdCBoYXNCb2R5ID0gQm9vbGVhbih0aGlzLmdldCgnYm9keScpKTtcbiAgICBjb25zdCBoYXNBdHRhY2htZW50ID0gKHRoaXMuZ2V0KCdhdHRhY2htZW50cycpIHx8IFtdKS5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGhhc0VtYmVkZGVkQ29udGFjdCA9ICh0aGlzLmdldCgnY29udGFjdCcpIHx8IFtdKS5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGlzU3RpY2tlciA9IEJvb2xlYW4odGhpcy5nZXQoJ3N0aWNrZXInKSk7XG5cbiAgICAvLyBSZW5kZXJlZCBzeW5jIG1lc3NhZ2VzXG4gICAgY29uc3QgaXNDYWxsSGlzdG9yeVZhbHVlID0gaXNDYWxsSGlzdG9yeShhdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBpc0NoYXRTZXNzaW9uUmVmcmVzaGVkVmFsdWUgPSBpc0NoYXRTZXNzaW9uUmVmcmVzaGVkKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzRGVsaXZlcnlJc3N1ZVZhbHVlID0gaXNEZWxpdmVyeUlzc3VlKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzR2lmdEJhZGdlVmFsdWUgPSBpc0dpZnRCYWRnZShhdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBpc0dyb3VwVXBkYXRlVmFsdWUgPSBpc0dyb3VwVXBkYXRlKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzR3JvdXBWMkNoYW5nZVZhbHVlID0gaXNHcm91cFYyQ2hhbmdlKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzRW5kU2Vzc2lvblZhbHVlID0gaXNFbmRTZXNzaW9uKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlVmFsdWUgPSBpc0V4cGlyYXRpb25UaW1lclVwZGF0ZShhdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBpc1ZlcmlmaWVkQ2hhbmdlVmFsdWUgPSBpc1ZlcmlmaWVkQ2hhbmdlKGF0dHJpYnV0ZXMpO1xuXG4gICAgLy8gUGxhY2Vob2xkZXIgbWVzc2FnZXNcbiAgICBjb25zdCBpc1Vuc3VwcG9ydGVkTWVzc2FnZVZhbHVlID0gaXNVbnN1cHBvcnRlZE1lc3NhZ2UoYXR0cmlidXRlcyk7XG4gICAgY29uc3QgaXNUYXBUb1ZpZXdWYWx1ZSA9IGlzVGFwVG9WaWV3KGF0dHJpYnV0ZXMpO1xuXG4gICAgLy8gRXJyb3JzXG4gICAgY29uc3QgaGFzRXJyb3JzVmFsdWUgPSBoYXNFcnJvcnMoYXR0cmlidXRlcyk7XG5cbiAgICAvLyBMb2NhbGx5LWdlbmVyYXRlZCBub3RpZmljYXRpb25zXG4gICAgY29uc3QgaXNLZXlDaGFuZ2VWYWx1ZSA9IGlzS2V5Q2hhbmdlKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzUHJvZmlsZUNoYW5nZVZhbHVlID0gaXNQcm9maWxlQ2hhbmdlKGF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IGlzVW5pdmVyc2FsVGltZXJOb3RpZmljYXRpb25WYWx1ZSA9XG4gICAgICBpc1VuaXZlcnNhbFRpbWVyTm90aWZpY2F0aW9uKGF0dHJpYnV0ZXMpO1xuXG4gICAgLy8gTm90ZTogbm90IGFsbCBvZiB0aGVzZSBtZXNzYWdlIHR5cGVzIGdvIHRocm91Z2ggbWVzc2FnZS5oYW5kbGVEYXRhTWVzc2FnZVxuXG4gICAgY29uc3QgaGFzU29tZXRoaW5nVG9EaXNwbGF5ID1cbiAgICAgIC8vIENvcmUgbWVzc2FnZSB0eXBlc1xuICAgICAgaGFzQm9keSB8fFxuICAgICAgaGFzQXR0YWNobWVudCB8fFxuICAgICAgaGFzRW1iZWRkZWRDb250YWN0IHx8XG4gICAgICBpc1N0aWNrZXIgfHxcbiAgICAgIC8vIFJlbmRlcmVkIHN5bmMgbWVzc2FnZXNcbiAgICAgIGlzQ2FsbEhpc3RvcnlWYWx1ZSB8fFxuICAgICAgaXNDaGF0U2Vzc2lvblJlZnJlc2hlZFZhbHVlIHx8XG4gICAgICBpc0RlbGl2ZXJ5SXNzdWVWYWx1ZSB8fFxuICAgICAgaXNHaWZ0QmFkZ2VWYWx1ZSB8fFxuICAgICAgaXNHcm91cFVwZGF0ZVZhbHVlIHx8XG4gICAgICBpc0dyb3VwVjJDaGFuZ2VWYWx1ZSB8fFxuICAgICAgaXNFbmRTZXNzaW9uVmFsdWUgfHxcbiAgICAgIGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlVmFsdWUgfHxcbiAgICAgIGlzVmVyaWZpZWRDaGFuZ2VWYWx1ZSB8fFxuICAgICAgLy8gUGxhY2Vob2xkZXIgbWVzc2FnZXNcbiAgICAgIGlzVW5zdXBwb3J0ZWRNZXNzYWdlVmFsdWUgfHxcbiAgICAgIGlzVGFwVG9WaWV3VmFsdWUgfHxcbiAgICAgIC8vIEVycm9yc1xuICAgICAgaGFzRXJyb3JzVmFsdWUgfHxcbiAgICAgIC8vIExvY2FsbHktZ2VuZXJhdGVkIG5vdGlmaWNhdGlvbnNcbiAgICAgIGlzS2V5Q2hhbmdlVmFsdWUgfHxcbiAgICAgIGlzUHJvZmlsZUNoYW5nZVZhbHVlIHx8XG4gICAgICBpc1VuaXZlcnNhbFRpbWVyTm90aWZpY2F0aW9uVmFsdWU7XG5cbiAgICByZXR1cm4gIWhhc1NvbWV0aGluZ1RvRGlzcGxheTtcbiAgfVxuXG4gIGlzVW5pZGVudGlmaWVkRGVsaXZlcnkoXG4gICAgY29udGFjdElkOiBzdHJpbmcsXG4gICAgdW5pZGVudGlmaWVkRGVsaXZlcmllc1NldDogUmVhZG9ubHk8U2V0PHN0cmluZz4+XG4gICk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0luY29taW5nKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0KCd1bmlkZW50aWZpZWREZWxpdmVyeVJlY2VpdmVkJykpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmlkZW50aWZpZWREZWxpdmVyaWVzU2V0Lmhhcyhjb250YWN0SWQpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZUVycm9ycyhcbiAgICBwcm92aWRlZEVycm9yczogRXJyb3IgfCBBcnJheTxFcnJvcj4sXG4gICAgb3B0aW9uczogeyBza2lwU2F2ZT86IGJvb2xlYW4gfSA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgc2tpcFNhdmUgfSA9IG9wdGlvbnM7XG5cbiAgICBsZXQgZXJyb3JzOiBBcnJheTxDdXN0b21FcnJvcj47XG5cbiAgICBpZiAoIShwcm92aWRlZEVycm9ycyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgZXJyb3JzID0gW3Byb3ZpZGVkRXJyb3JzXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JzID0gcHJvdmlkZWRFcnJvcnM7XG4gICAgfVxuXG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdNZXNzYWdlLnNhdmVFcnJvcnM6JyxcbiAgICAgICAgZSAmJiBlLnJlYXNvbiA/IGUucmVhc29uIDogbnVsbCxcbiAgICAgICAgZSAmJiBlLnN0YWNrID8gZS5zdGFjayA6IGVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgZXJyb3JzID0gZXJyb3JzLm1hcChlID0+IHtcbiAgICAgIC8vIE5vdGU6IGluIG91ciBlbnZpcm9ubWVudCwgaW5zdGFuY2VvZiBjYW4gYmUgc2NhcnksIHNvIHdlIGhhdmUgYSBiYWNrdXAgY2hlY2tcbiAgICAgIC8vICAgKE5vZGUuanMgdnMgQnJvd3NlciBjb250ZXh0KS5cbiAgICAgIC8vIFdlIGNoZWNrIGluc3RhbmNlb2Ygc2Vjb25kIGJlY2F1c2UgdHlwZXNjcmlwdCBiZWxpZXZlcyB0aGF0IGFueXRoaW5nIHRoYXQgY29tZXNcbiAgICAgIC8vICAgdGhyb3VnaCBoZXJlIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRXJyb3IsIHNvIGUgaXMgJ25ldmVyJyBhZnRlciB0aGF0IGNoZWNrLlxuICAgICAgaWYgKChlLm1lc3NhZ2UgJiYgZS5zdGFjaykgfHwgZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHJldHVybiBfLnBpY2soXG4gICAgICAgICAgZSxcbiAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgJ21lc3NhZ2UnLFxuICAgICAgICAgICdjb2RlJyxcbiAgICAgICAgICAnbnVtYmVyJyxcbiAgICAgICAgICAnaWRlbnRpZmllcicsXG4gICAgICAgICAgJ3JldHJ5QWZ0ZXInLFxuICAgICAgICAgICdkYXRhJyxcbiAgICAgICAgICAncmVhc29uJ1xuICAgICAgICApIGFzIFJlcXVpcmVkPEVycm9yPjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlO1xuICAgIH0pO1xuICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQodGhpcy5nZXQoJ2Vycm9ycycpIHx8IFtdKTtcblxuICAgIHRoaXMuc2V0KHsgZXJyb3JzIH0pO1xuXG4gICAgaWYgKCFza2lwU2F2ZSAmJiAhdGhpcy5kb05vdFNhdmUpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG1hcmtSZWFkKHJlYWRBdD86IG51bWJlciwgb3B0aW9ucyA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5zZXQobWFya1JlYWQodGhpcy5hdHRyaWJ1dGVzLCByZWFkQXQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGdldEluY29taW5nQ29udGFjdCgpOiBDb252ZXJzYXRpb25Nb2RlbCB8IHVuZGVmaW5lZCB8IG51bGwge1xuICAgIGlmICghaXNJbmNvbWluZyh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlID0gdGhpcy5nZXQoJ3NvdXJjZScpO1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoc291cmNlLCAncHJpdmF0ZScpO1xuICB9XG5cbiAgYXN5bmMgcmV0cnlTZW5kKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gdGhpcy5nZXRDb252ZXJzYXRpb24oKSE7XG5cbiAgICBjb25zdCBjdXJyZW50Q29udmVyc2F0aW9uUmVjaXBpZW50cyA9XG4gICAgICBjb252ZXJzYXRpb24uZ2V0TWVtYmVyQ29udmVyc2F0aW9uSWRzKCk7XG5cbiAgICAvLyBEZXRlcm1pbmUgcmV0cnkgcmVjaXBpZW50cyBhbmQgZ2V0IHRoZWlyIG1vc3QgdXAtdG8tZGF0ZSBhZGRyZXNzaW5nIGluZm9ybWF0aW9uXG4gICAgY29uc3Qgb2xkU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9XG4gICAgICB0aGlzLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9O1xuXG4gICAgY29uc3QgbmV3U2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9IHsgLi4ub2xkU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCB9O1xuICAgIGZvciAoY29uc3QgW2NvbnZlcnNhdGlvbklkLCBzZW5kU3RhdGVdIG9mIE9iamVjdC5lbnRyaWVzKFxuICAgICAgb2xkU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZFxuICAgICkpIHtcbiAgICAgIGlmIChpc1NlbnQoc2VuZFN0YXRlLnN0YXR1cykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICBpZiAoXG4gICAgICAgICFyZWNpcGllbnQgfHxcbiAgICAgICAgKCFjdXJyZW50Q29udmVyc2F0aW9uUmVjaXBpZW50cy5oYXMoY29udmVyc2F0aW9uSWQpICYmXG4gICAgICAgICAgIWlzTWUocmVjaXBpZW50LmF0dHJpYnV0ZXMpKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBuZXdTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkW2NvbnZlcnNhdGlvbklkXSA9IHNlbmRTdGF0ZVJlZHVjZXIoXG4gICAgICAgIHNlbmRTdGF0ZSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFNlbmRBY3Rpb25UeXBlLk1hbnVhbGx5UmV0cmllZCxcbiAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnLCBuZXdTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkKTtcblxuICAgIGF3YWl0IGNvbnZlcnNhdGlvbkpvYlF1ZXVlLmFkZChcbiAgICAgIHtcbiAgICAgICAgdHlwZTogY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLmVudW0uTm9ybWFsTWVzc2FnZSxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgbWVzc2FnZUlkOiB0aGlzLmlkLFxuICAgICAgICByZXZpc2lvbjogY29udmVyc2F0aW9uLmdldCgncmV2aXNpb24nKSxcbiAgICAgIH0sXG4gICAgICBhc3luYyBqb2JUb0luc2VydCA9PiB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICBqb2JUb0luc2VydCxcbiAgICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgaXNSZXBsYXlhYmxlRXJyb3IoZTogRXJyb3IpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgZS5uYW1lID09PSAnTWVzc2FnZUVycm9yJyB8fFxuICAgICAgZS5uYW1lID09PSAnT3V0Z29pbmdNZXNzYWdlRXJyb3InIHx8XG4gICAgICBlLm5hbWUgPT09ICdTZW5kTWVzc2FnZU5ldHdvcmtFcnJvcicgfHxcbiAgICAgIGUubmFtZSA9PT0gJ1NlbmRNZXNzYWdlQ2hhbGxlbmdlRXJyb3InIHx8XG4gICAgICBlLm5hbWUgPT09ICdTaWduZWRQcmVLZXlSb3RhdGlvbkVycm9yJyB8fFxuICAgICAgZS5uYW1lID09PSAnT3V0Z29pbmdJZGVudGl0eUtleUVycm9yJ1xuICAgICk7XG4gIH1cblxuICBwdWJsaWMgaGFzU3VjY2Vzc2Z1bERlbGl2ZXJ5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPSB0aGlzLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpO1xuICAgIGNvbnN0IHdpdGhvdXRNZSA9IG9taXQoXG4gICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KClcbiAgICApO1xuICAgIHJldHVybiBpc0VtcHR5KHdpdGhvdXRNZSkgfHwgc29tZVNlbmRTdGF0dXMod2l0aG91dE1lLCBpc1NlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSBhbnkgUGVuZGluZyBzZW5kIHN0YXRlIHRvIEZhaWxlZC4gTm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgbWFyayBzdWNjZXNzZnVsXG4gICAqIHNlbmRzIGZhaWxlZC5cbiAgICovXG4gIHB1YmxpYyBtYXJrRmFpbGVkKCk6IHZvaWQge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgdGhpcy5zZXQoXG4gICAgICAnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcsXG4gICAgICBtYXBWYWx1ZXModGhpcy5nZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnKSB8fCB7fSwgc2VuZFN0YXRlID0+XG4gICAgICAgIHNlbmRTdGF0ZVJlZHVjZXIoc2VuZFN0YXRlLCB7XG4gICAgICAgICAgdHlwZTogU2VuZEFjdGlvblR5cGUuRmFpbGVkLFxuICAgICAgICAgIHVwZGF0ZWRBdDogbm93LFxuICAgICAgICB9KVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICByZW1vdmVPdXRnb2luZ0Vycm9ycyhpbmNvbWluZ0lkZW50aWZpZXI6IHN0cmluZyk6IEN1c3RvbUVycm9yIHtcbiAgICBjb25zdCBpbmNvbWluZ0NvbnZlcnNhdGlvbklkID1cbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldENvbnZlcnNhdGlvbklkKGluY29taW5nSWRlbnRpZmllcik7XG4gICAgY29uc3QgZXJyb3JzID0gXy5wYXJ0aXRpb24oXG4gICAgICB0aGlzLmdldCgnZXJyb3JzJyksXG4gICAgICBlID0+XG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldENvbnZlcnNhdGlvbklkKFxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgZS5pZGVudGlmaWVyIHx8IGUubnVtYmVyIVxuICAgICAgICApID09PSBpbmNvbWluZ0NvbnZlcnNhdGlvbklkICYmXG4gICAgICAgIChlLm5hbWUgPT09ICdNZXNzYWdlRXJyb3InIHx8XG4gICAgICAgICAgZS5uYW1lID09PSAnT3V0Z29pbmdNZXNzYWdlRXJyb3InIHx8XG4gICAgICAgICAgZS5uYW1lID09PSAnU2VuZE1lc3NhZ2VOZXR3b3JrRXJyb3InIHx8XG4gICAgICAgICAgZS5uYW1lID09PSAnU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvcicgfHxcbiAgICAgICAgICBlLm5hbWUgPT09ICdTaWduZWRQcmVLZXlSb3RhdGlvbkVycm9yJyB8fFxuICAgICAgICAgIGUubmFtZSA9PT0gJ091dGdvaW5nSWRlbnRpdHlLZXlFcnJvcicpXG4gICAgKTtcbiAgICB0aGlzLnNldCh7IGVycm9yczogZXJyb3JzWzFdIH0pO1xuICAgIHJldHVybiBlcnJvcnNbMF1bMF07XG4gIH1cblxuICBhc3luYyBzZW5kKFxuICAgIHByb21pc2U6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlIHwgdm9pZCB8IG51bGw+LFxuICAgIHNhdmVFcnJvcnM/OiAoZXJyb3JzOiBBcnJheTxFcnJvcj4pID0+IHZvaWRcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdXBkYXRlTGVmdFBhbmUgPVxuICAgICAgdGhpcy5nZXRDb252ZXJzYXRpb24oKT8uZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2UgfHwgbm9vcDtcblxuICAgIHVwZGF0ZUxlZnRQYW5lKCk7XG5cbiAgICBsZXQgcmVzdWx0OlxuICAgICAgfCB7IHN1Y2Nlc3M6IHRydWU7IHZhbHVlOiBDYWxsYmFja1Jlc3VsdFR5cGUgfVxuICAgICAgfCB7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2U7XG4gICAgICAgICAgdmFsdWU6IEN1c3RvbUVycm9yIHwgU2VuZE1lc3NhZ2VQcm90b0Vycm9yO1xuICAgICAgICB9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IChwcm9taXNlIGFzIFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPik7XG4gICAgICByZXN1bHQgPSB7IHN1Y2Nlc3M6IHRydWUsIHZhbHVlIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXN1bHQgPSB7IHN1Y2Nlc3M6IGZhbHNlLCB2YWx1ZTogZXJyIH07XG4gICAgfVxuXG4gICAgdXBkYXRlTGVmdFBhbmUoKTtcblxuICAgIGNvbnN0IGF0dHJpYnV0ZXNUb1VwZGF0ZTogUGFydGlhbDxNZXNzYWdlQXR0cmlidXRlc1R5cGU+ID0ge307XG5cbiAgICAvLyBUaGlzIGlzIHVzZWQgYnkgc2VuZFN5bmNNZXNzYWdlLCB0aGVuIHNldCB0byBudWxsXG4gICAgaWYgKCdkYXRhTWVzc2FnZScgaW4gcmVzdWx0LnZhbHVlICYmIHJlc3VsdC52YWx1ZS5kYXRhTWVzc2FnZSkge1xuICAgICAgYXR0cmlidXRlc1RvVXBkYXRlLmRhdGFNZXNzYWdlID0gcmVzdWx0LnZhbHVlLmRhdGFNZXNzYWdlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kb05vdFNhdmUpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPSB7XG4gICAgICAuLi4odGhpcy5nZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnKSB8fCB7fSksXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbmRJc05vdEZpbmFsID1cbiAgICAgICdzZW5kSXNOb3RGaW5hbCcgaW4gcmVzdWx0LnZhbHVlICYmIHJlc3VsdC52YWx1ZS5zZW5kSXNOb3RGaW5hbDtcbiAgICBjb25zdCBzZW5kSXNGaW5hbCA9ICFzZW5kSXNOb3RGaW5hbDtcblxuICAgIC8vIENhcHR1cmUgc3VjY2Vzc2Z1bCBzZW5kc1xuICAgIGNvbnN0IHN1Y2Nlc3NmdWxJZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPiA9XG4gICAgICBzZW5kSXNGaW5hbCAmJlxuICAgICAgJ3N1Y2Nlc3NmdWxJZGVudGlmaWVycycgaW4gcmVzdWx0LnZhbHVlICYmXG4gICAgICBBcnJheS5pc0FycmF5KHJlc3VsdC52YWx1ZS5zdWNjZXNzZnVsSWRlbnRpZmllcnMpXG4gICAgICAgID8gcmVzdWx0LnZhbHVlLnN1Y2Nlc3NmdWxJZGVudGlmaWVyc1xuICAgICAgICA6IFtdO1xuICAgIGNvbnN0IHNlbnRUb0F0TGVhc3RPbmVSZWNpcGllbnQgPVxuICAgICAgcmVzdWx0LnN1Y2Nlc3MgfHwgQm9vbGVhbihzdWNjZXNzZnVsSWRlbnRpZmllcnMubGVuZ3RoKTtcblxuICAgIHN1Y2Nlc3NmdWxJZGVudGlmaWVycy5mb3JFYWNoKGlkZW50aWZpZXIgPT4ge1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuICAgICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBzdWNjZXNzZnVsbHkgc2VudCB0byBhIHVzZXIsIHdlIGNhbiByZW1vdmUgb3VyIHVucmVnaXN0ZXJlZCBmbGFnLlxuICAgICAgaWYgKGNvbnZlcnNhdGlvbi5pc0V2ZXJVbnJlZ2lzdGVyZWQoKSkge1xuICAgICAgICBjb252ZXJzYXRpb24uc2V0UmVnaXN0ZXJlZCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcmV2aW91c1NlbmRTdGF0ZSA9IGdldE93bihcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCxcbiAgICAgICAgY29udmVyc2F0aW9uLmlkXG4gICAgICApO1xuICAgICAgaWYgKHByZXZpb3VzU2VuZFN0YXRlKSB7XG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRbY29udmVyc2F0aW9uLmlkXSA9IHNlbmRTdGF0ZVJlZHVjZXIoXG4gICAgICAgICAgcHJldmlvdXNTZW5kU3RhdGUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogU2VuZEFjdGlvblR5cGUuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJbnRlZ3JhdGUgc2VuZHMgdmlhIHNlYWxlZCBzZW5kZXJcbiAgICBjb25zdCBwcmV2aW91c1VuaWRlbnRpZmllZERlbGl2ZXJpZXMgPVxuICAgICAgdGhpcy5nZXQoJ3VuaWRlbnRpZmllZERlbGl2ZXJpZXMnKSB8fCBbXTtcbiAgICBjb25zdCBuZXdVbmlkZW50aWZpZWREZWxpdmVyaWVzID1cbiAgICAgIHNlbmRJc0ZpbmFsICYmXG4gICAgICAndW5pZGVudGlmaWVkRGVsaXZlcmllcycgaW4gcmVzdWx0LnZhbHVlICYmXG4gICAgICBBcnJheS5pc0FycmF5KHJlc3VsdC52YWx1ZS51bmlkZW50aWZpZWREZWxpdmVyaWVzKVxuICAgICAgICA/IHJlc3VsdC52YWx1ZS51bmlkZW50aWZpZWREZWxpdmVyaWVzXG4gICAgICAgIDogW107XG5cbiAgICBjb25zdCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTx1bmtub3duPj4gPSBbXTtcblxuICAgIC8vIFByb2Nlc3MgZXJyb3JzXG4gICAgbGV0IGVycm9yczogQXJyYXk8Q3VzdG9tRXJyb3I+O1xuICAgIGlmIChyZXN1bHQudmFsdWUgaW5zdGFuY2VvZiBTZW5kTWVzc2FnZVByb3RvRXJyb3IgJiYgcmVzdWx0LnZhbHVlLmVycm9ycykge1xuICAgICAgKHsgZXJyb3JzIH0gPSByZXN1bHQudmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaXNDdXN0b21FcnJvcihyZXN1bHQudmFsdWUpKSB7XG4gICAgICBlcnJvcnMgPSBbcmVzdWx0LnZhbHVlXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0LnZhbHVlLmVycm9ycykpIHtcbiAgICAgICh7IGVycm9ycyB9ID0gcmVzdWx0LnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JzID0gW107XG4gICAgfVxuXG4gICAgLy8gSW4gZ3JvdXBzLCB3ZSBkb24ndCB0cmVhdCB1bnJlZ2lzdGVyZWQgdXNlcnMgYXMgYSB1c2VyLXZpc2libGVcbiAgICAvLyAgIGVycm9yLiBUaGUgbWVzc2FnZSB3aWxsIGxvb2sgc3VjY2Vzc2Z1bCwgYnV0IHRoZSBkZXRhaWxzXG4gICAgLy8gICBzY3JlZW4gd2lsbCBzaG93IHRoYXQgd2UgZGlkbid0IHNlbmQgdG8gdGhlc2UgdW5yZWdpc3RlcmVkIHVzZXJzLlxuICAgIGNvbnN0IGVycm9yc1RvU2F2ZTogQXJyYXk8Q3VzdG9tRXJyb3I+ID0gW107XG5cbiAgICBsZXQgaGFkU2lnbmVkUHJlS2V5Um90YXRpb25FcnJvciA9IGZhbHNlO1xuICAgIGVycm9ycy5mb3JFYWNoKGVycm9yID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9XG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChlcnJvci5pZGVudGlmaWVyKSB8fFxuICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZXJyb3IubnVtYmVyKTtcblxuICAgICAgaWYgKGNvbnZlcnNhdGlvbiAmJiAhc2F2ZUVycm9ycyAmJiBzZW5kSXNGaW5hbCkge1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbmRTdGF0ZSA9IGdldE93bihcbiAgICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbi5pZFxuICAgICAgICApO1xuICAgICAgICBpZiAocHJldmlvdXNTZW5kU3RhdGUpIHtcbiAgICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkW2NvbnZlcnNhdGlvbi5pZF0gPSBzZW5kU3RhdGVSZWR1Y2VyKFxuICAgICAgICAgICAgcHJldmlvdXNTZW5kU3RhdGUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFNlbmRBY3Rpb25UeXBlLkZhaWxlZCxcbiAgICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHNob3VsZFNhdmVFcnJvciA9IHRydWU7XG4gICAgICBzd2l0Y2ggKGVycm9yLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnU2lnbmVkUHJlS2V5Um90YXRpb25FcnJvcic6XG4gICAgICAgICAgaGFkU2lnbmVkUHJlS2V5Um90YXRpb25FcnJvciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ091dGdvaW5nSWRlbnRpdHlLZXlFcnJvcic6IHtcbiAgICAgICAgICBpZiAoY29udmVyc2F0aW9uKSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKGNvbnZlcnNhdGlvbi5nZXRQcm9maWxlcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnVW5yZWdpc3RlcmVkVXNlckVycm9yJzpcbiAgICAgICAgICBpZiAoY29udmVyc2F0aW9uICYmIGlzR3JvdXAoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBzaG91bGRTYXZlRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSWYgd2UganVzdCBmb3VuZCBvdXQgdGhhdCB3ZSBjb3VsZG4ndCBzZW5kIHRvIGEgdXNlciBiZWNhdXNlIHRoZXkgYXJlIG5vXG4gICAgICAgICAgLy8gICBsb25nZXIgcmVnaXN0ZXJlZCwgd2Ugd2lsbCB1cGRhdGUgb3VyIHVucmVnaXN0ZXJlZCBmbGFnLiBJbiBncm91cHMgd2VcbiAgICAgICAgICAvLyAgIHdpbGwgbm90IGV2ZW50IHRyeSB0byBzZW5kIHRvIHRoZW0gZm9yIDYgaG91cnMuIEFuZCB3ZSB3aWxsIG5ldmVyIHRyeVxuICAgICAgICAgIC8vICAgdG8gZmV0Y2ggdGhlbSBvbiBzdGFydHVwIGFnYWluLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gVGhlIHdheSB0byBkaXNjb3ZlciByZWdpc3RyYXRpb24gb25jZSBtb3JlIGlzOlxuICAgICAgICAgIC8vICAgMSkgYW55IGF0dGVtcHQgdG8gc2VuZCB0byB0aGVtIGluIDE6MSBjb252ZXJzYXRpb25cbiAgICAgICAgICAvLyAgIDIpIHRoZSBzaXgtaG91ciB0aW1lIHBlcmlvZCBoYXMgcGFzc2VkIGFuZCB3ZSBzZW5kIGluIGEgZ3JvdXAgYWdhaW5cbiAgICAgICAgICBjb252ZXJzYXRpb24/LnNldFVucmVnaXN0ZXJlZCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hvdWxkU2F2ZUVycm9yKSB7XG4gICAgICAgIGVycm9yc1RvU2F2ZS5wdXNoKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChoYWRTaWduZWRQcmVLZXlSb3RhdGlvbkVycm9yKSB7XG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICB3aW5kb3cuZ2V0QWNjb3VudE1hbmFnZXIoKS5yb3RhdGVTaWduZWRQcmVLZXkoVVVJREtpbmQuQUNJKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzVG9VcGRhdGUuc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ7XG4gICAgYXR0cmlidXRlc1RvVXBkYXRlLmV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9IHNlbnRUb0F0TGVhc3RPbmVSZWNpcGllbnRcbiAgICAgID8gRGF0ZS5ub3coKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gICAgYXR0cmlidXRlc1RvVXBkYXRlLnVuaWRlbnRpZmllZERlbGl2ZXJpZXMgPSB1bmlvbihcbiAgICAgIHByZXZpb3VzVW5pZGVudGlmaWVkRGVsaXZlcmllcyxcbiAgICAgIG5ld1VuaWRlbnRpZmllZERlbGl2ZXJpZXNcbiAgICApO1xuICAgIC8vIFdlIG1heSBvdmVyd3JpdGUgdGhpcyBpbiB0aGUgYHNhdmVFcnJvcnNgIGNhbGwgYmVsb3cuXG4gICAgYXR0cmlidXRlc1RvVXBkYXRlLmVycm9ycyA9IFtdO1xuXG4gICAgdGhpcy5zZXQoYXR0cmlidXRlc1RvVXBkYXRlKTtcbiAgICBpZiAoc2F2ZUVycm9ycykge1xuICAgICAgc2F2ZUVycm9ycyhlcnJvcnNUb1NhdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBza2lwIHNhdmUgYmVjYXVzZSB3ZSdsbCBzYXZlIGluIHRoZSBuZXh0IHN0ZXAuXG4gICAgICB0aGlzLnNhdmVFcnJvcnMoZXJyb3JzVG9TYXZlLCB7IHNraXBTYXZlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5kb05vdFNhdmUpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUxlZnRQYW5lKCk7XG5cbiAgICBpZiAoc2VudFRvQXRMZWFzdE9uZVJlY2lwaWVudCAmJiAhdGhpcy5kb05vdFNlbmRTeW5jTWVzc2FnZSkge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnNlbmRTeW5jTWVzc2FnZSgpKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cbiAgICBjb25zdCBpc1RvdGFsU3VjY2VzczogYm9vbGVhbiA9XG4gICAgICByZXN1bHQuc3VjY2VzcyAmJiAhdGhpcy5nZXQoJ2Vycm9ycycpPy5sZW5ndGg7XG4gICAgaWYgKGlzVG90YWxTdWNjZXNzKSB7XG4gICAgICBkZWxldGUgdGhpcy5jYWNoZWRPdXRnb2luZ1ByZXZpZXdEYXRhO1xuICAgICAgZGVsZXRlIHRoaXMuY2FjaGVkT3V0Z29pbmdRdW90ZURhdGE7XG4gICAgICBkZWxldGUgdGhpcy5jYWNoZWRPdXRnb2luZ1N0aWNrZXJEYXRhO1xuICAgIH1cblxuICAgIHVwZGF0ZUxlZnRQYW5lKCk7XG4gIH1cblxuICBhc3luYyBzZW5kU3luY01lc3NhZ2VPbmx5KFxuICAgIGRhdGFNZXNzYWdlOiBVaW50OEFycmF5LFxuICAgIHNhdmVFcnJvcnM/OiAoZXJyb3JzOiBBcnJheTxFcnJvcj4pID0+IHZvaWRcbiAgKTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGUgfCB2b2lkPiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICBjb25zdCBjb252ID0gdGhpcy5nZXRDb252ZXJzYXRpb24oKSE7XG4gICAgdGhpcy5zZXQoeyBkYXRhTWVzc2FnZSB9KTtcblxuICAgIGNvbnN0IHVwZGF0ZUxlZnRQYW5lID0gY29udj8uZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2U7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXQoe1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBzYW1lIGFzIGEgbm9ybWFsIHNlbmQoKVxuICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIGVycm9yczogW10sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuc2VuZFN5bmNNZXNzYWdlKCk7XG4gICAgICB0aGlzLnNldCh7XG4gICAgICAgIC8vIFdlIGhhdmUgdG8gZG8gdGhpcyBhZnRlcndhcmQsIHNpbmNlIHdlIGRpZG4ndCBoYXZlIGEgcHJldmlvdXMgc2VuZCFcbiAgICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcmllczpcbiAgICAgICAgICByZXN1bHQgJiYgcmVzdWx0LnVuaWRlbnRpZmllZERlbGl2ZXJpZXNcbiAgICAgICAgICAgID8gcmVzdWx0LnVuaWRlbnRpZmllZERlbGl2ZXJpZXNcbiAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCByZXN1bHRFcnJvcnMgPSBlcnJvcj8uZXJyb3JzO1xuICAgICAgY29uc3QgZXJyb3JzID0gQXJyYXkuaXNBcnJheShyZXN1bHRFcnJvcnMpXG4gICAgICAgID8gcmVzdWx0RXJyb3JzXG4gICAgICAgIDogW25ldyBFcnJvcignVW5rbm93biBlcnJvcicpXTtcbiAgICAgIGlmIChzYXZlRXJyb3JzKSB7XG4gICAgICAgIHNhdmVFcnJvcnMoZXJyb3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGRvbid0IHNhdmUgYmVjYXVzZSB3ZSdyZSBhYm91dCB0byBzYXZlIGJlbG93LlxuICAgICAgICB0aGlzLnNhdmVFcnJvcnMoZXJyb3JzLCB7IHNraXBTYXZlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodXBkYXRlTGVmdFBhbmUpIHtcbiAgICAgICAgdXBkYXRlTGVmdFBhbmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kU3luY01lc3NhZ2UoKTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGUgfCB2b2lkPiB7XG4gICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uID1cbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbk9yVGhyb3coKTtcbiAgICBjb25zdCBzZW5kT3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKG91ckNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLCB7XG4gICAgICBzeW5jTWVzc2FnZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGlmICh3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5hcmVXZVByaW1hcnlEZXZpY2UoKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzZW5kU3luY01lc3NhZ2U6IFdlIGFyZSBwcmltYXJ5IGRldmljZTsgbm90IHNlbmRpbmcgc3luYyBtZXNzYWdlJ1xuICAgICAgKTtcbiAgICAgIHRoaXMuc2V0KHsgZGF0YU1lc3NhZ2U6IHVuZGVmaW5lZCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gICAgaWYgKCFtZXNzYWdpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VuZFN5bmNNZXNzYWdlOiBtZXNzYWdpbmcgbm90IGF2YWlsYWJsZSEnKTtcbiAgICB9XG5cbiAgICB0aGlzLnN5bmNQcm9taXNlID0gdGhpcy5zeW5jUHJvbWlzZSB8fCBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBjb25zdCBuZXh0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YU1lc3NhZ2UgPSB0aGlzLmdldCgnZGF0YU1lc3NhZ2UnKTtcbiAgICAgIGlmICghZGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgaXNVcGRhdGUgPSBCb29sZWFuKHRoaXMuZ2V0KCdzeW5jZWQnKSk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgY29uc3QgY29udiA9IHRoaXMuZ2V0Q29udmVyc2F0aW9uKCkhO1xuXG4gICAgICBjb25zdCBzZW5kRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKFxuICAgICAgICB0aGlzLmdldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcpIHx8IHt9XG4gICAgICApO1xuICAgICAgY29uc3Qgc2VudEVudHJpZXMgPSBmaWx0ZXIoc2VuZEVudHJpZXMsIChbX2NvbnZlcnNhdGlvbklkLCB7IHN0YXR1cyB9XSkgPT5cbiAgICAgICAgaXNTZW50KHN0YXR1cylcbiAgICAgICk7XG4gICAgICBjb25zdCBhbGxDb252ZXJzYXRpb25JZHNTZW50VG8gPSBtYXAoXG4gICAgICAgIHNlbnRFbnRyaWVzLFxuICAgICAgICAoW2NvbnZlcnNhdGlvbklkXSkgPT4gY29udmVyc2F0aW9uSWRcbiAgICAgICk7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25JZHNTZW50VG8gPSBmaWx0ZXIoXG4gICAgICAgIGFsbENvbnZlcnNhdGlvbklkc1NlbnRUbyxcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPT4gY29udmVyc2F0aW9uSWQgIT09IG91ckNvbnZlcnNhdGlvbi5pZFxuICAgICAgKTtcblxuICAgICAgY29uc3QgdW5pZGVudGlmaWVkRGVsaXZlcmllcyA9IHRoaXMuZ2V0KCd1bmlkZW50aWZpZWREZWxpdmVyaWVzJykgfHwgW107XG4gICAgICBjb25zdCBtYXliZUNvbnZlcnNhdGlvbnNXaXRoU2VhbGVkU2VuZGVyID0gbWFwKFxuICAgICAgICB1bmlkZW50aWZpZWREZWxpdmVyaWVzLFxuICAgICAgICBpZGVudGlmaWVyID0+IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZGVudGlmaWVyKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbnNXaXRoU2VhbGVkU2VuZGVyID0gZmlsdGVyKFxuICAgICAgICBtYXliZUNvbnZlcnNhdGlvbnNXaXRoU2VhbGVkU2VuZGVyLFxuICAgICAgICBpc05vdE5pbFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkc1dpdGhTZWFsZWRTZW5kZXIgPSBuZXcgU2V0KFxuICAgICAgICBtYXAoY29udmVyc2F0aW9uc1dpdGhTZWFsZWRTZW5kZXIsIGMgPT4gYy5pZClcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgbWVzc2FnaW5nLnNlbmRTeW5jTWVzc2FnZSh7XG4gICAgICAgICAgZW5jb2RlZERhdGFNZXNzYWdlOiBkYXRhTWVzc2FnZSxcbiAgICAgICAgICB0aW1lc3RhbXA6IHRoaXMuZ2V0KCdzZW50X2F0JyksXG4gICAgICAgICAgZGVzdGluYXRpb246IGNvbnYuZ2V0KCdlMTY0JyksXG4gICAgICAgICAgZGVzdGluYXRpb25VdWlkOiBjb252LmdldCgndXVpZCcpLFxuICAgICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcDpcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAnKSB8fCBudWxsLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkc1NlbnRUbyxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZHNXaXRoU2VhbGVkU2VuZGVyLFxuICAgICAgICAgIGlzVXBkYXRlLFxuICAgICAgICAgIG9wdGlvbnM6IHNlbmRPcHRpb25zLFxuICAgICAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgICAvLyBOb3RlOiBpbiBzb21lIHNpdHVhdGlvbnMsIGZvciBkb05vdFNhdmUgbWVzc2FnZXMsIHRoZSBtZXNzYWdlIGhhcyBub1xuICAgICAgICAvLyAgIGlkLCBzbyB3ZSBwcm92aWRlIGFuIGVtcHR5IGFycmF5IGhlcmUuXG4gICAgICAgIHsgbWVzc2FnZUlkczogdGhpcy5pZCA/IFt0aGlzLmlkXSA6IFtdLCBzZW5kVHlwZTogJ3NlbnRTeW5jJyB9XG4gICAgICApLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgbGV0IG5ld1NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHVuZGVmaW5lZCB8IFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ7XG4gICAgICAgIGNvbnN0IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPVxuICAgICAgICAgIHRoaXMuZ2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJykgfHwge307XG4gICAgICAgIGNvbnN0IG91ck9sZFNlbmRTdGF0ZSA9IGdldE93bihcbiAgICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIG91ckNvbnZlcnNhdGlvbi5pZFxuICAgICAgICApO1xuICAgICAgICBpZiAob3VyT2xkU2VuZFN0YXRlKSB7XG4gICAgICAgICAgY29uc3Qgb3VyTmV3U2VuZFN0YXRlID0gc2VuZFN0YXRlUmVkdWNlcihvdXJPbGRTZW5kU3RhdGUsIHtcbiAgICAgICAgICAgIHR5cGU6IFNlbmRBY3Rpb25UeXBlLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKG91ck5ld1NlbmRTdGF0ZSAhPT0gb3VyT2xkU2VuZFN0YXRlKSB7XG4gICAgICAgICAgICBuZXdTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkID0ge1xuICAgICAgICAgICAgICAuLi5zZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uLmlkXTogb3VyTmV3U2VuZFN0YXRlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldCh7XG4gICAgICAgICAgc3luY2VkOiB0cnVlLFxuICAgICAgICAgIGRhdGFNZXNzYWdlOiBudWxsLFxuICAgICAgICAgIC4uLihuZXdTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkXG4gICAgICAgICAgICA/IHsgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDogbmV3U2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCB9XG4gICAgICAgICAgICA6IHt9KSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGVhcmx5LCBza2lwIHRoZSBzYXZlXG4gICAgICAgIGlmICh0aGlzLmRvTm90U2F2ZSkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UodGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5zeW5jUHJvbWlzZSA9IHRoaXMuc3luY1Byb21pc2UudGhlbihuZXh0LCBuZXh0KTtcblxuICAgIHJldHVybiB0aGlzLnN5bmNQcm9taXNlO1xuICB9XG5cbiAgaGFzUmVxdWlyZWRBdHRhY2htZW50RG93bmxvYWRzKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBSZWFkb25seUFycmF5PEF0dGFjaG1lbnRUeXBlPiA9XG4gICAgICB0aGlzLmdldCgnYXR0YWNobWVudHMnKSB8fCBbXTtcblxuICAgIGNvbnN0IGhhc0xvbmdNZXNzYWdlQXR0YWNobWVudHMgPSBhdHRhY2htZW50cy5zb21lKGF0dGFjaG1lbnQgPT4ge1xuICAgICAgcmV0dXJuIE1JTUUuaXNMb25nTWVzc2FnZShhdHRhY2htZW50LmNvbnRlbnRUeXBlKTtcbiAgICB9KTtcblxuICAgIGlmIChoYXNMb25nTWVzc2FnZUF0dGFjaG1lbnRzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGlja2VyID0gdGhpcy5nZXQoJ3N0aWNrZXInKTtcbiAgICBpZiAoc3RpY2tlcikge1xuICAgICAgcmV0dXJuICFzdGlja2VyLmRhdGEgfHwgIXN0aWNrZXIuZGF0YS5wYXRoO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc0F0dGFjaG1lbnREb3dubG9hZHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc0F0dGFjaG1lbnREb3dubG9hZHModGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGFzeW5jIHF1ZXVlQXR0YWNobWVudERvd25sb2FkcygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IHF1ZXVlQXR0YWNobWVudERvd25sb2Fkcyh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkKGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlKTogdm9pZCB7XG4gICAgaWYgKCFhdHRhY2htZW50LnBhdGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJBdHRhY2htZW50IGNhbid0IGJlIG1hcmtlZCBhcyBjb3JydXB0ZWQgYmVjYXVzZSBpdCB3YXNuJ3QgbG9hZGVkXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCBjaGVjayBpbiBxdW90ZXMvc3RpY2tlcnMvY29udGFjdHMvLi4uIGhlcmUsXG4gICAgLy8gYmVjYXVzZSB0aGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQgb25seSBmb3Igc29tZXRoaW5nIHRoYXQgY2FuXG4gICAgLy8gYmUgZGlzcGxheWVkIGFzIGEgZ2VuZXJpYyBhdHRhY2htZW50LlxuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBSZWFkb25seUFycmF5PEF0dGFjaG1lbnRUeXBlPiA9XG4gICAgICB0aGlzLmdldCgnYXR0YWNobWVudHMnKSB8fCBbXTtcblxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgY29uc3QgbmV3QXR0YWNobWVudHMgPSBhdHRhY2htZW50cy5tYXAoZXhpc3RpbmcgPT4ge1xuICAgICAgaWYgKGV4aXN0aW5nLnBhdGggIT09IGF0dGFjaG1lbnQucGF0aCkge1xuICAgICAgICByZXR1cm4gZXhpc3Rpbmc7XG4gICAgICB9XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAgIGlzQ29ycnVwdGVkOiB0cnVlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGlmICghY2hhbmdlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIkF0dGFjaG1lbnQgY2FuJ3QgYmUgbWFya2VkIGFzIGNvcnJ1cHRlZCBiZWNhdXNlIGl0IHdhc24ndCBmb3VuZFwiXG4gICAgICApO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCdtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkOiBtYXJraW5nIGFuIGF0dGFjaG1lbnQgYXMgY29ycnVwdGVkJyk7XG5cbiAgICB0aGlzLnNldCh7XG4gICAgICBhdHRhY2htZW50czogbmV3QXR0YWNobWVudHMsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjb3B5RnJvbVF1b3RlZE1lc3NhZ2UoXG4gICAgcXVvdGU6IFByb2Nlc3NlZFF1b3RlIHwgdW5kZWZpbmVkLFxuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxRdW90ZWRNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICghcXVvdGUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgeyBpZCB9ID0gcXVvdGU7XG4gICAgc3RyaWN0QXNzZXJ0KGlkLCAnUXVvdGUgbXVzdCBoYXZlIGFuIGlkJyk7XG5cbiAgICBjb25zdCByZXN1bHQ6IFF1b3RlZE1lc3NhZ2VUeXBlID0ge1xuICAgICAgLi4ucXVvdGUsXG5cbiAgICAgIGlkLFxuXG4gICAgICBhdHRhY2htZW50czogcXVvdGUuYXR0YWNobWVudHMuc2xpY2UoKSxcbiAgICAgIGJvZHlSYW5nZXM6IHF1b3RlLmJvZHlSYW5nZXMubWFwKCh7IHN0YXJ0LCBsZW5ndGgsIG1lbnRpb25VdWlkIH0pID0+IHtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgIHN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgc3RhcnQgIT09IG51bGwsXG4gICAgICAgICAgJ1JlY2VpdmVkIHF1b3RlIHdpdGggYSBib2R5UmFuZ2Uuc3RhcnQgPT0gbnVsbCdcbiAgICAgICAgKTtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgIGxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGxlbmd0aCAhPT0gbnVsbCxcbiAgICAgICAgICAnUmVjZWl2ZWQgcXVvdGUgd2l0aCBhIGJvZHlSYW5nZS5sZW5ndGggPT0gbnVsbCdcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBtZW50aW9uVXVpZDogZHJvcE51bGwobWVudGlvblV1aWQpLFxuICAgICAgICB9O1xuICAgICAgfSksXG5cbiAgICAgIC8vIEp1c3QgcGxhY2Vob2xkZXIgdmFsdWVzIGZvciB0aGUgZmllbGRzXG4gICAgICByZWZlcmVuY2VkTWVzc2FnZU5vdEZvdW5kOiBmYWxzZSxcbiAgICAgIGlzR2lmdEJhZGdlOiBxdW90ZS50eXBlID09PSBQcm90by5EYXRhTWVzc2FnZS5RdW90ZS5UeXBlLkdJRlRfQkFER0UsXG4gICAgICBpc1ZpZXdPbmNlOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2VJZDogJycsXG4gICAgfTtcblxuICAgIGNvbnN0IGluTWVtb3J5TWVzc2FnZXMgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIuZmlsdGVyQnlTZW50QXQoaWQpO1xuICAgIGNvbnN0IG1hdGNoaW5nTWVzc2FnZSA9IGZpbmQoaW5NZW1vcnlNZXNzYWdlcywgaXRlbSA9PlxuICAgICAgaXNRdW90ZUFNYXRjaChpdGVtLmF0dHJpYnV0ZXMsIGNvbnZlcnNhdGlvbklkLCByZXN1bHQpXG4gICAgKTtcblxuICAgIGxldCBxdWVyeU1lc3NhZ2U6IHVuZGVmaW5lZCB8IE1lc3NhZ2VNb2RlbDtcblxuICAgIGlmIChtYXRjaGluZ01lc3NhZ2UpIHtcbiAgICAgIHF1ZXJ5TWVzc2FnZSA9IG1hdGNoaW5nTWVzc2FnZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oJ2NvcHlGcm9tUXVvdGVkTWVzc2FnZTogZGIgbG9va3VwIG5lZWRlZCcsIGlkKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldE1lc3NhZ2VzQnlTZW50QXQoaWQpO1xuICAgICAgY29uc3QgZm91bmQgPSBtZXNzYWdlcy5maW5kKGl0ZW0gPT5cbiAgICAgICAgaXNRdW90ZUFNYXRjaChpdGVtLCBjb252ZXJzYXRpb25JZCwgcmVzdWx0KVxuICAgICAgKTtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICByZXN1bHQucmVmZXJlbmNlZE1lc3NhZ2VOb3RGb3VuZCA9IHRydWU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5TWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3Rlcihmb3VuZC5pZCwgZm91bmQpO1xuICAgIH1cblxuICAgIGlmIChxdWVyeU1lc3NhZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuY29weVF1b3RlQ29udGVudEZyb21PcmlnaW5hbChxdWVyeU1lc3NhZ2UsIHJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFzeW5jIGNvcHlRdW90ZUNvbnRlbnRGcm9tT3JpZ2luYWwoXG4gICAgb3JpZ2luYWxNZXNzYWdlOiBNZXNzYWdlTW9kZWwsXG4gICAgcXVvdGU6IFF1b3RlZE1lc3NhZ2VUeXBlXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgYXR0YWNobWVudHMgfSA9IHF1b3RlO1xuICAgIGNvbnN0IGZpcnN0QXR0YWNobWVudCA9IGF0dGFjaG1lbnRzID8gYXR0YWNobWVudHNbMF0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoaXNUYXBUb1ZpZXcob3JpZ2luYWxNZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIHF1b3RlLnRleHQgPSB1bmRlZmluZWQ7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIHF1b3RlLmF0dGFjaG1lbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGVudFR5cGU6IE1JTUUuSU1BR0VfSlBFRyxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIHF1b3RlLmlzVmlld09uY2UgPSB0cnVlO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNNZXNzYWdlQUdpZnRCYWRnZSA9IGlzR2lmdEJhZGdlKG9yaWdpbmFsTWVzc2FnZS5hdHRyaWJ1dGVzKTtcbiAgICBpZiAoaXNNZXNzYWdlQUdpZnRCYWRnZSAhPT0gcXVvdGUuaXNHaWZ0QmFkZ2UpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgY29weVF1b3RlQ29udGVudEZyb21PcmlnaW5hbDogUXVvdGUuaXNHaWZ0QmFkZ2U6ICR7cXVvdGUuaXNHaWZ0QmFkZ2V9LCBpc0dpZnRCYWRnZShtZXNzYWdlKTogJHtpc01lc3NhZ2VBR2lmdEJhZGdlfWBcbiAgICAgICk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIHF1b3RlLmlzR2lmdEJhZGdlID0gaXNNZXNzYWdlQUdpZnRCYWRnZTtcbiAgICB9XG4gICAgaWYgKGlzTWVzc2FnZUFHaWZ0QmFkZ2UpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgcXVvdGUudGV4dCA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgcXVvdGUuYXR0YWNobWVudHMgPSBbXTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHF1b3RlLmlzVmlld09uY2UgPSBmYWxzZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHF1b3RlLnRleHQgPSBvcmlnaW5hbE1lc3NhZ2UuZ2V0KCdib2R5Jyk7XG4gICAgaWYgKGZpcnN0QXR0YWNobWVudCkge1xuICAgICAgZmlyc3RBdHRhY2htZW50LnRodW1ibmFpbCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWZpcnN0QXR0YWNobWVudCB8fFxuICAgICAgIWZpcnN0QXR0YWNobWVudC5jb250ZW50VHlwZSB8fFxuICAgICAgKCFHb29nbGVDaHJvbWUuaXNJbWFnZVR5cGVTdXBwb3J0ZWQoXG4gICAgICAgIHN0cmluZ1RvTUlNRVR5cGUoZmlyc3RBdHRhY2htZW50LmNvbnRlbnRUeXBlKVxuICAgICAgKSAmJlxuICAgICAgICAhR29vZ2xlQ2hyb21lLmlzVmlkZW9UeXBlU3VwcG9ydGVkKFxuICAgICAgICAgIHN0cmluZ1RvTUlNRVR5cGUoZmlyc3RBdHRhY2htZW50LmNvbnRlbnRUeXBlKVxuICAgICAgICApKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzY2hlbWFWZXJzaW9uID0gb3JpZ2luYWxNZXNzYWdlLmdldCgnc2NoZW1hVmVyc2lvbicpO1xuICAgICAgaWYgKFxuICAgICAgICBzY2hlbWFWZXJzaW9uICYmXG4gICAgICAgIHNjaGVtYVZlcnNpb24gPCBUeXBlZE1lc3NhZ2UuVkVSU0lPTl9ORUVERURfRk9SX0RJU1BMQVlcbiAgICAgICkge1xuICAgICAgICBjb25zdCB1cGdyYWRlZE1lc3NhZ2UgPSBhd2FpdCB1cGdyYWRlTWVzc2FnZVNjaGVtYShcbiAgICAgICAgICBvcmlnaW5hbE1lc3NhZ2UuYXR0cmlidXRlc1xuICAgICAgICApO1xuICAgICAgICBvcmlnaW5hbE1lc3NhZ2Uuc2V0KHVwZ3JhZGVkTWVzc2FnZSk7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh1cGdyYWRlZE1lc3NhZ2UsIHtcbiAgICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnUHJvYmxlbSB1cGdyYWRpbmcgbWVzc2FnZSBxdW90ZWQgbWVzc2FnZSBmcm9tIGRhdGFiYXNlJyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeUF0dGFjaG1lbnRzID0gb3JpZ2luYWxNZXNzYWdlLmdldCgnYXR0YWNobWVudHMnKSB8fCBbXTtcbiAgICBpZiAocXVlcnlBdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBxdWVyeUZpcnN0ID0gcXVlcnlBdHRhY2htZW50c1swXTtcbiAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBxdWVyeUZpcnN0O1xuXG4gICAgICBpZiAodGh1bWJuYWlsICYmIHRodW1ibmFpbC5wYXRoKSB7XG4gICAgICAgIGZpcnN0QXR0YWNobWVudC50aHVtYm5haWwgPSB7XG4gICAgICAgICAgLi4udGh1bWJuYWlsLFxuICAgICAgICAgIGNvcGllZDogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeVByZXZpZXcgPSBvcmlnaW5hbE1lc3NhZ2UuZ2V0KCdwcmV2aWV3JykgfHwgW107XG4gICAgaWYgKHF1ZXJ5UHJldmlldy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBxdWVyeUZpcnN0ID0gcXVlcnlQcmV2aWV3WzBdO1xuICAgICAgY29uc3QgeyBpbWFnZSB9ID0gcXVlcnlGaXJzdDtcblxuICAgICAgaWYgKGltYWdlICYmIGltYWdlLnBhdGgpIHtcbiAgICAgICAgZmlyc3RBdHRhY2htZW50LnRodW1ibmFpbCA9IHtcbiAgICAgICAgICAuLi5pbWFnZSxcbiAgICAgICAgICBjb3BpZWQ6IHRydWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RpY2tlciA9IG9yaWdpbmFsTWVzc2FnZS5nZXQoJ3N0aWNrZXInKTtcbiAgICBpZiAoc3RpY2tlciAmJiBzdGlja2VyLmRhdGEgJiYgc3RpY2tlci5kYXRhLnBhdGgpIHtcbiAgICAgIGZpcnN0QXR0YWNobWVudC50aHVtYm5haWwgPSB7XG4gICAgICAgIC4uLnN0aWNrZXIuZGF0YSxcbiAgICAgICAgY29waWVkOiB0cnVlLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBoYW5kbGVEYXRhTWVzc2FnZShcbiAgICBpbml0aWFsTWVzc2FnZTogUHJvY2Vzc2VkRGF0YU1lc3NhZ2UsXG4gICAgY29uZmlybTogKCkgPT4gdm9pZCxcbiAgICBvcHRpb25zOiB7IGRhdGE/OiBTZW50RXZlbnREYXRhIH0gPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbnM7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmcm9tIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCBpbiBhIGZldyBzY2VuYXJpb3M6XG4gICAgLy8gICAxLiBvbiBhbiBpbmNvbWluZyBtZXNzYWdlXG4gICAgLy8gICAyLiBvbiBhIHNlbnQgbWVzc2FnZSBzeW5jJ2QgZnJvbSBhbm90aGVyIGRldmljZVxuICAgIC8vICAgMy4gaW4gcmFyZSBjYXNlcywgYW4gaW5jb21pbmcgbWVzc2FnZSBjYW4gYmUgcmV0cmllZCwgdGhvdWdoIGl0IHdpbGxcbiAgICAvLyAgICAgIHN0aWxsIGdvIHRocm91Z2ggb25lIG9mIHRoZSBwcmV2aW91cyB0d28gY29kZXBhdGhzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXM7XG4gICAgY29uc3Qgc291cmNlID0gbWVzc2FnZS5nZXQoJ3NvdXJjZScpO1xuICAgIGNvbnN0IHNvdXJjZVV1aWQgPSBtZXNzYWdlLmdldCgnc291cmNlVXVpZCcpO1xuICAgIGNvbnN0IHR5cGUgPSBtZXNzYWdlLmdldCgndHlwZScpO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gbWVzc2FnZS5nZXQoJ2NvbnZlcnNhdGlvbklkJyk7XG4gICAgY29uc3QgR1JPVVBfVFlQRVMgPSBQcm90by5Hcm91cENvbnRleHQuVHlwZTtcblxuICAgIGNvbnN0IGZyb21Db250YWN0ID0gZ2V0Q29udGFjdCh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIGlmIChmcm9tQ29udGFjdCkge1xuICAgICAgZnJvbUNvbnRhY3Quc2V0UmVnaXN0ZXJlZCgpO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKSE7XG4gICAgY29uc3QgaWRMb2cgPSBjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uLnF1ZXVlSm9iKCdoYW5kbGVEYXRhTWVzc2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgaGFuZGxlRGF0YU1lc3NhZ2UvJHtpZExvZ306IHByb2Nlc3NpbmcgbWVzc2FnZSAke21lc3NhZ2UuaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgKTtcblxuICAgICAgaWYgKFxuICAgICAgICBpc1N0b3J5KG1lc3NhZ2UuYXR0cmlidXRlcykgJiZcbiAgICAgICAgIWlzQ29udmVyc2F0aW9uQWNjZXB0ZWQoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICBpZ25vcmVFbXB0eUNvbnZvOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBoYW5kbGVEYXRhTWVzc2FnZS8ke2lkTG9nfTogZHJvcHBpbmcgc3RvcnkgZnJvbSAhYWNjZXB0ZWRgLFxuICAgICAgICAgIHRoaXMuZ2V0U2VuZGVySWRlbnRpZmllcigpXG4gICAgICAgICk7XG4gICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXJzdCwgY2hlY2sgZm9yIGR1cGxpY2F0ZXMuIElmIHdlIGZpbmQgb25lLCBzdG9wIHByb2Nlc3NpbmcgaGVyZS5cbiAgICAgIGNvbnN0IGluTWVtb3J5TWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5maW5kQnlTZW5kZXIoXG4gICAgICAgIHRoaXMuZ2V0U2VuZGVySWRlbnRpZmllcigpXG4gICAgICApPy5hdHRyaWJ1dGVzO1xuICAgICAgaWYgKGluTWVtb3J5TWVzc2FnZSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgaGFuZGxlRGF0YU1lc3NhZ2UvJHtpZExvZ306IGNhY2hlIGhpdGAsXG4gICAgICAgICAgdGhpcy5nZXRTZW5kZXJJZGVudGlmaWVyKClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBoYW5kbGVEYXRhTWVzc2FnZS8ke2lkTG9nfTogZHVwbGljYXRlIGNoZWNrIGRiIGxvb2t1cCBuZWVkZWRgLFxuICAgICAgICAgIHRoaXMuZ2V0U2VuZGVySWRlbnRpZmllcigpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBleGlzdGluZ01lc3NhZ2UgPVxuICAgICAgICBpbk1lbW9yeU1lc3NhZ2UgfHwgKGF3YWl0IGdldE1lc3NhZ2VCeVNlbmRlcih0aGlzLmF0dHJpYnV0ZXMpKTtcbiAgICAgIGNvbnN0IGlzVXBkYXRlID0gQm9vbGVhbihkYXRhICYmIGRhdGEuaXNSZWNpcGllbnRVcGRhdGUpO1xuXG4gICAgICBjb25zdCBpc0R1cGxpY2F0ZU1lc3NhZ2UgPVxuICAgICAgICBleGlzdGluZ01lc3NhZ2UgJiZcbiAgICAgICAgKHR5cGUgPT09ICdpbmNvbWluZycgfHxcbiAgICAgICAgICAodHlwZSA9PT0gJ3N0b3J5JyAmJlxuICAgICAgICAgICAgZXhpc3RpbmdNZXNzYWdlLnN0b3J5RGlzdHJpYnV0aW9uTGlzdElkID09PVxuICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuc3RvcnlEaXN0cmlidXRpb25MaXN0SWQpKTtcblxuICAgICAgaWYgKGlzRHVwbGljYXRlTWVzc2FnZSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgaGFuZGxlRGF0YU1lc3NhZ2UvJHtpZExvZ306IFJlY2VpdmVkIGR1cGxpY2F0ZSBtZXNzYWdlYCxcbiAgICAgICAgICB0aGlzLmlkRm9yTG9nZ2luZygpXG4gICAgICAgICk7XG4gICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdvdXRnb2luZycpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlICYmIGV4aXN0aW5nTWVzc2FnZSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYGhhbmRsZURhdGFNZXNzYWdlLyR7aWRMb2d9OiBVcGRhdGluZyBtZXNzYWdlICR7bWVzc2FnZS5pZEZvckxvZ2dpbmcoKX0gd2l0aCByZWNlaXZlZCB0cmFuc2NyaXB0YFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCB0b1VwZGF0ZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgICAgICAgIGV4aXN0aW5nTWVzc2FnZS5pZCxcbiAgICAgICAgICAgIGV4aXN0aW5nTWVzc2FnZVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCB1bmlkZW50aWZpZWREZWxpdmVyaWVzU2V0ID0gbmV3IFNldDxzdHJpbmc+KFxuICAgICAgICAgICAgdG9VcGRhdGUuZ2V0KCd1bmlkZW50aWZpZWREZWxpdmVyaWVzJykgPz8gW11cbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPSB7XG4gICAgICAgICAgICAuLi4odG9VcGRhdGUuZ2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJykgfHwge30pLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCB1bmlkZW50aWZpZWRTdGF0dXM6IEFycmF5PFByb2Nlc3NlZFVuaWRlbnRpZmllZERlbGl2ZXJ5U3RhdHVzPiA9XG4gICAgICAgICAgICBkYXRhICYmIEFycmF5LmlzQXJyYXkoZGF0YS51bmlkZW50aWZpZWRTdGF0dXMpXG4gICAgICAgICAgICAgID8gZGF0YS51bmlkZW50aWZpZWRTdGF0dXNcbiAgICAgICAgICAgICAgOiBbXTtcblxuICAgICAgICAgIHVuaWRlbnRpZmllZFN0YXR1cy5mb3JFYWNoKFxuICAgICAgICAgICAgKHsgZGVzdGluYXRpb25VdWlkLCBkZXN0aW5hdGlvbiwgdW5pZGVudGlmaWVkIH0pID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IGRlc3RpbmF0aW9uVXVpZCB8fCBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgaWYgKCFpZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb25Db252ZXJzYXRpb24gPVxuICAgICAgICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgICAgICAgICBhY2k6IGRlc3RpbmF0aW9uVXVpZCxcbiAgICAgICAgICAgICAgICAgIGUxNjQ6IGRlc3RpbmF0aW9uIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogYGhhbmRsZURhdGFNZXNzYWdlKCR7aW5pdGlhbE1lc3NhZ2UudGltZXN0YW1wfSlgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoIWRlc3RpbmF0aW9uQ29udmVyc2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZEF0OiBudW1iZXIgPVxuICAgICAgICAgICAgICAgIGRhdGEgJiYgaXNOb3JtYWxOdW1iZXIoZGF0YS50aW1lc3RhbXApXG4gICAgICAgICAgICAgICAgICA/IGRhdGEudGltZXN0YW1wXG4gICAgICAgICAgICAgICAgICA6IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNTZW5kU3RhdGUgPSBnZXRPd24oXG4gICAgICAgICAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbkNvbnZlcnNhdGlvbi5pZFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkW2Rlc3RpbmF0aW9uQ29udmVyc2F0aW9uLmlkXSA9XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTZW5kU3RhdGVcbiAgICAgICAgICAgICAgICAgID8gc2VuZFN0YXRlUmVkdWNlcihwcmV2aW91c1NlbmRTdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFNlbmRBY3Rpb25UeXBlLlNlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEF0LFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEF0LFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmICh1bmlkZW50aWZpZWQpIHtcbiAgICAgICAgICAgICAgICB1bmlkZW50aWZpZWREZWxpdmVyaWVzU2V0LmFkZChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB0b1VwZGF0ZS5zZXQoe1xuICAgICAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJpZXM6IFsuLi51bmlkZW50aWZpZWREZWxpdmVyaWVzU2V0XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UodG9VcGRhdGUuYXR0cmlidXRlcywge1xuICAgICAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgaGFuZGxlRGF0YU1lc3NhZ2UvJHtpZExvZ306IFJlY2VpdmVkIHVwZGF0ZSB0cmFuc2NyaXB0LCBidXQgbm8gZXhpc3RpbmcgZW50cnkgZm9yIG1lc3NhZ2UgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfS4gRHJvcHBpbmcuYFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25maXJtKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleGlzdGluZ01lc3NhZ2UpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBoYW5kbGVEYXRhTWVzc2FnZS8ke2lkTG9nfTogUmVjZWl2ZWQgZHVwbGljYXRlIHRyYW5zY3JpcHQgZm9yIG1lc3NhZ2UgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfSwgYnV0IGl0IHdhcyBub3QgYW4gdXBkYXRlIHRyYW5zY3JpcHQuIERyb3BwaW5nLmBcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29uZmlybSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBHcm91cFYyXG5cbiAgICAgIGlmIChpbml0aWFsTWVzc2FnZS5ncm91cFYyKSB7XG4gICAgICAgIGlmIChpc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgLy8gSWYgd2UgcmVjZWl2ZWQgYSBHcm91cFYyIG1lc3NhZ2UgaW4gYSBHcm91cFYxIGdyb3VwLCB3ZSBtaWdyYXRlIVxuXG4gICAgICAgICAgY29uc3QgeyByZXZpc2lvbiwgZ3JvdXBDaGFuZ2UgfSA9IGluaXRpYWxNZXNzYWdlLmdyb3VwVjI7XG4gICAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5Hcm91cHMucmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbih7XG4gICAgICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgICAgICBncm91cENoYW5nZTogZ3JvdXBDaGFuZ2VcbiAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICBiYXNlNjQ6IGdyb3VwQ2hhbmdlLFxuICAgICAgICAgICAgICAgICAgaXNUcnVzdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmV3UmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgICAgICAgcmVjZWl2ZWRBdDogbWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0JyksXG4gICAgICAgICAgICBzZW50QXQ6IG1lc3NhZ2UuZ2V0KCdzZW50X2F0JyksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgaW5pdGlhbE1lc3NhZ2UuZ3JvdXBWMi5tYXN0ZXJLZXkgJiZcbiAgICAgICAgICBpbml0aWFsTWVzc2FnZS5ncm91cFYyLnNlY3JldFBhcmFtcyAmJlxuICAgICAgICAgIGluaXRpYWxNZXNzYWdlLmdyb3VwVjIucHVibGljUGFyYW1zXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIFJlcGFpciBjb3JlIEdyb3VwVjIgZGF0YSBpZiBuZWVkZWRcbiAgICAgICAgICBhd2FpdCBjb252ZXJzYXRpb24ubWF5YmVSZXBhaXJHcm91cFYyKHtcbiAgICAgICAgICAgIG1hc3RlcktleTogaW5pdGlhbE1lc3NhZ2UuZ3JvdXBWMi5tYXN0ZXJLZXksXG4gICAgICAgICAgICBzZWNyZXRQYXJhbXM6IGluaXRpYWxNZXNzYWdlLmdyb3VwVjIuc2VjcmV0UGFyYW1zLFxuICAgICAgICAgICAgcHVibGljUGFyYW1zOiBpbml0aWFsTWVzc2FnZS5ncm91cFYyLnB1YmxpY1BhcmFtcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUmV2aXNpb24gPSBjb252ZXJzYXRpb24uZ2V0KCdyZXZpc2lvbicpO1xuICAgICAgICAgIGNvbnN0IGlzRmlyc3RVcGRhdGUgPSAhXy5pc051bWJlcihleGlzdGluZ1JldmlzaW9uKTtcblxuICAgICAgICAgIC8vIFN0YW5kYXJkIEdyb3VwVjIgbW9kaWZpY2F0aW9uIGNvZGVwYXRoXG4gICAgICAgICAgY29uc3QgaXNWMkdyb3VwVXBkYXRlID1cbiAgICAgICAgICAgIGluaXRpYWxNZXNzYWdlLmdyb3VwVjIgJiZcbiAgICAgICAgICAgIF8uaXNOdW1iZXIoaW5pdGlhbE1lc3NhZ2UuZ3JvdXBWMi5yZXZpc2lvbikgJiZcbiAgICAgICAgICAgIChpc0ZpcnN0VXBkYXRlIHx8XG4gICAgICAgICAgICAgIGluaXRpYWxNZXNzYWdlLmdyb3VwVjIucmV2aXNpb24gPiBleGlzdGluZ1JldmlzaW9uKTtcblxuICAgICAgICAgIGlmIChpc1YyR3JvdXBVcGRhdGUgJiYgaW5pdGlhbE1lc3NhZ2UuZ3JvdXBWMikge1xuICAgICAgICAgICAgY29uc3QgeyByZXZpc2lvbiwgZ3JvdXBDaGFuZ2UgfSA9IGluaXRpYWxNZXNzYWdlLmdyb3VwVjI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5tYXliZVVwZGF0ZUdyb3VwKHtcbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgICAgICAgICAgZ3JvdXBDaGFuZ2U6IGdyb3VwQ2hhbmdlXG4gICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICBiYXNlNjQ6IGdyb3VwQ2hhbmdlLFxuICAgICAgICAgICAgICAgICAgICAgIGlzVHJ1c3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5ld1JldmlzaW9uOiByZXZpc2lvbixcbiAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBtZXNzYWdlLmdldCgncmVjZWl2ZWRfYXQnKSxcbiAgICAgICAgICAgICAgICBzZW50QXQ6IG1lc3NhZ2UuZ2V0KCdzZW50X2F0JyksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yO1xuICAgICAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAgICAgYGhhbmRsZURhdGFNZXNzYWdlLyR7aWRMb2d9OiBGYWlsZWQgdG8gcHJvY2VzcyBncm91cCB1cGRhdGUgYXMgcGFydCBvZiBtZXNzYWdlICR7bWVzc2FnZS5pZEZvckxvZ2dpbmcoKX06ICR7ZXJyb3JUZXh0fWBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91ckFDSSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChcbiAgICAgICAgVVVJREtpbmQuQUNJXG4gICAgICApO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgIGNvbnN0IHNlbmRlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgZTE2NDogc291cmNlLFxuICAgICAgICB1dWlkOiBzb3VyY2VVdWlkLFxuICAgICAgfSkhO1xuICAgICAgY29uc3QgaGFzR3JvdXBWMlByb3AgPSBCb29sZWFuKGluaXRpYWxNZXNzYWdlLmdyb3VwVjIpO1xuICAgICAgY29uc3QgaXNWMUdyb3VwVXBkYXRlID1cbiAgICAgICAgaW5pdGlhbE1lc3NhZ2UuZ3JvdXAgJiZcbiAgICAgICAgaW5pdGlhbE1lc3NhZ2UuZ3JvdXAudHlwZSAhPT0gUHJvdG8uR3JvdXBDb250ZXh0LlR5cGUuREVMSVZFUjtcblxuICAgICAgLy8gRHJvcCBpZiBmcm9tIGJsb2NrZWQgdXNlci4gT25seSBHcm91cFYyIG1lc3NhZ2VzIHNob3VsZCBuZWVkIHRvIGJlIGRyb3BwZWQgaGVyZS5cbiAgICAgIGNvbnN0IGlzQmxvY2tlZCA9XG4gICAgICAgIChzb3VyY2UgJiYgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5pc0Jsb2NrZWQoc291cmNlKSkgfHxcbiAgICAgICAgKHNvdXJjZVV1aWQgJiYgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5pc1V1aWRCbG9ja2VkKHNvdXJjZVV1aWQpKTtcbiAgICAgIGlmIChpc0Jsb2NrZWQpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYGhhbmRsZURhdGFNZXNzYWdlLyR7aWRMb2d9OiBEcm9wcGluZyBtZXNzYWdlIGZyb20gYmxvY2tlZCBzZW5kZXIuIGhhc0dyb3VwVjJQcm9wOiAke2hhc0dyb3VwVjJQcm9wfWBcbiAgICAgICAgKTtcblxuICAgICAgICBjb25maXJtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXJlV2VNZW1iZXIgPVxuICAgICAgICAhY29udmVyc2F0aW9uLmdldCgnbGVmdCcpICYmIGNvbnZlcnNhdGlvbi5oYXNNZW1iZXIob3VyQUNJKTtcblxuICAgICAgLy8gRHJvcCBhbiBpbmNvbWluZyBHcm91cFYyIG1lc3NhZ2UgaWYgd2Ugb3IgdGhlIHNlbmRlciBhcmUgbm90IHBhcnQgb2YgdGhlIGdyb3VwXG4gICAgICAvLyAgIGFmdGVyIGFwcGx5aW5nIHRoZSBtZXNzYWdlJ3MgYXNzb2NpYXRlZCBncm91cCBjaGFuZ2VzLlxuICAgICAgaWYgKFxuICAgICAgICB0eXBlID09PSAnaW5jb21pbmcnICYmXG4gICAgICAgICFpc0RpcmVjdENvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcykgJiZcbiAgICAgICAgaGFzR3JvdXBWMlByb3AgJiZcbiAgICAgICAgKCFhcmVXZU1lbWJlciB8fFxuICAgICAgICAgIChzb3VyY2VVdWlkICYmICFjb252ZXJzYXRpb24uaGFzTWVtYmVyKG5ldyBVVUlEKHNvdXJjZVV1aWQpKSkpXG4gICAgICApIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYFJlY2VpdmVkIG1lc3NhZ2UgZGVzdGluZWQgZm9yIGdyb3VwICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfSwgd2hpY2ggd2Ugb3IgdGhlIHNlbmRlciBhcmUgbm90IGEgcGFydCBvZi4gRHJvcHBpbmcuYFxuICAgICAgICApO1xuICAgICAgICBjb25maXJtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZHJvcCBpbmNvbWluZyBtZXNzYWdlcyBmb3IgdjEgZ3JvdXBzIHdlIGFscmVhZHkga25vdyBhYm91dCwgd2hpY2ggd2UncmUgbm90XG4gICAgICAvLyAgIGEgcGFydCBvZiwgZXhjZXB0IGZvciBncm91cCB1cGRhdGVzLiBCZWNhdXNlIGdyb3VwIHYxIHVwZGF0ZXMgaGF2ZW4ndCBiZWVuXG4gICAgICAvLyAgIGFwcGxpZWQgYnkgdGhpcyBwb2ludC5cbiAgICAgIC8vIE5vdGU6IGlmIHdlIGhhdmUgbm8gaW5mb3JtYXRpb24gYWJvdXQgYSBncm91cCBhdCBhbGwsIHdlIHdpbGwgYWNjZXB0IHRob3NlXG4gICAgICAvLyAgIG1lc3NhZ2VzLiBXZSBkZXRlY3QgdGhhdCB2aWEgYSBtaXNzaW5nICdtZW1iZXJzJyBmaWVsZC5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZSA9PT0gJ2luY29taW5nJyAmJlxuICAgICAgICAhaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICFoYXNHcm91cFYyUHJvcCAmJlxuICAgICAgICAhaXNWMUdyb3VwVXBkYXRlICYmXG4gICAgICAgIGNvbnZlcnNhdGlvbi5nZXQoJ21lbWJlcnMnKSAmJlxuICAgICAgICAhYXJlV2VNZW1iZXJcbiAgICAgICkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgUmVjZWl2ZWQgbWVzc2FnZSBkZXN0aW5lZCBmb3IgZ3JvdXAgJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9LCB3aGljaCB3ZSdyZSBub3QgYSBwYXJ0IG9mLiBEcm9wcGluZy5gXG4gICAgICAgICk7XG4gICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBCZWNhdXNlIEdyb3VwVjEgbWVzc2FnZXMgY2FuIG5vdyBiZSBtdWx0aXBsZXhlZCBpbnRvIEdyb3VwVjIgY29udmVyc2F0aW9ucywgd2VcbiAgICAgIC8vICAgZHJvcCBHcm91cFYxIHVwZGF0ZXMgaW4gR3JvdXBWMiBncm91cHMuXG4gICAgICBpZiAoaXNWMUdyb3VwVXBkYXRlICYmIGlzR3JvdXBWMihjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYFJlY2VpdmVkIEdyb3VwVjEgdXBkYXRlIGluIEdyb3VwVjIgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfS4gRHJvcHBpbmcuYFxuICAgICAgICApO1xuICAgICAgICBjb25maXJtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gRHJvcCBpbmNvbWluZyBtZXNzYWdlcyB0byBhbm5vdW5jZW1lbnQgb25seSBncm91cHMgd2hlcmUgc2VuZGVyIGlzIG5vdCBhZG1pblxuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCdhbm5vdW5jZW1lbnRzT25seScpICYmXG4gICAgICAgICFjb252ZXJzYXRpb24uaXNBZG1pbihVVUlELmNoZWNrZWRMb29rdXAoc2VuZGVyPy5pZCkpXG4gICAgICApIHtcbiAgICAgICAgY29uZmlybSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VJZCA9IG1lc3NhZ2UuZ2V0KCdpZCcpIHx8IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuXG4gICAgICAvLyBTZW5kIGRlbGl2ZXJ5IHJlY2VpcHRzLCBidXQgb25seSBmb3IgaW5jb21pbmcgc2VhbGVkIHNlbmRlciBtZXNzYWdlc1xuICAgICAgLy8gYW5kIG5vdCBmb3IgbWVzc2FnZXMgZnJvbSB1bmFjY2VwdGVkIGNvbnZlcnNhdGlvbnNcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZSA9PT0gJ2luY29taW5nJyAmJlxuICAgICAgICB0aGlzLmdldCgndW5pZGVudGlmaWVkRGVsaXZlcnlSZWNlaXZlZCcpICYmXG4gICAgICAgICFoYXNFcnJvcnModGhpcy5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICBjb252ZXJzYXRpb24uZ2V0QWNjZXB0ZWQoKVxuICAgICAgKSB7XG4gICAgICAgIC8vIE5vdGU6IFdlIGJvdGggcXVldWUgYW5kIGJhdGNoIGJlY2F1c2Ugd2Ugd2FudCB0byB3YWl0IHVudGlsIHdlIGFyZSBkb25lXG4gICAgICAgIC8vICAgcHJvY2Vzc2luZyBpbmNvbWluZyBtZXNzYWdlcyB0byBzdGFydCBzZW5kaW5nIG91dGdvaW5nIGRlbGl2ZXJ5IHJlY2VpcHRzLlxuICAgICAgICAvLyAgIFRoZSBxdWV1ZSBjYW4gYmUgcGF1c2VkIGVhc2lseS5cbiAgICAgICAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0UXVldWUuYWRkKCgpID0+IHtcbiAgICAgICAgICB3aW5kb3cuV2hpc3Blci5kZWxpdmVyeVJlY2VpcHRCYXRjaGVyLmFkZCh7XG4gICAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgICBzZW5kZXJFMTY0OiBzb3VyY2UsXG4gICAgICAgICAgICBzZW5kZXJVdWlkOiBzb3VyY2VVdWlkLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aGlzLmdldCgnc2VudF9hdCcpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgW3F1b3RlLCBzdG9yeVF1b3RlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgdGhpcy5jb3B5RnJvbVF1b3RlZE1lc3NhZ2UoaW5pdGlhbE1lc3NhZ2UucXVvdGUsIGNvbnZlcnNhdGlvbi5pZCksXG4gICAgICAgIGZpbmRTdG9yeU1lc3NhZ2UoY29udmVyc2F0aW9uLmlkLCBpbml0aWFsTWVzc2FnZS5zdG9yeUNvbnRleHQpLFxuICAgICAgXSk7XG5cbiAgICAgIGlmIChpbml0aWFsTWVzc2FnZS5zdG9yeUNvbnRleHQgJiYgIXN0b3J5UXVvdGUpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGhhbmRsZURhdGFNZXNzYWdlLyR7aWRMb2d9OiBSZWNlaXZlZCBzdG9yeUNvbnRleHQgbWVzc2FnZSBidXQgbm8gbWF0Y2hpbmcgc3RvcnkuIERyb3BwaW5nLmBcbiAgICAgICAgKTtcblxuICAgICAgICBjb25maXJtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2l0aFF1b3RlUmVmZXJlbmNlID0ge1xuICAgICAgICAuLi5tZXNzYWdlLmF0dHJpYnV0ZXMsXG4gICAgICAgIC4uLmluaXRpYWxNZXNzYWdlLFxuICAgICAgICBxdW90ZSxcbiAgICAgICAgc3RvcnlJZDogc3RvcnlRdW90ZT8uaWQsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBkYXRhTWVzc2FnZSA9IGF3YWl0IHVwZ3JhZGVNZXNzYWdlU2NoZW1hKHdpdGhRdW90ZVJlZmVyZW5jZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGNvbnN0IHVybHMgPSBMaW5rUHJldmlldy5maW5kTGlua3MoZGF0YU1lc3NhZ2UuYm9keSB8fCAnJyk7XG4gICAgICAgIGNvbnN0IGluY29taW5nUHJldmlldyA9IGRhdGFNZXNzYWdlLnByZXZpZXcgfHwgW107XG4gICAgICAgIGNvbnN0IHByZXZpZXcgPSBpbmNvbWluZ1ByZXZpZXcuZmlsdGVyKFxuICAgICAgICAgIChpdGVtOiBMaW5rUHJldmlld1R5cGUpID0+XG4gICAgICAgICAgICAoaXRlbS5pbWFnZSB8fCBpdGVtLnRpdGxlKSAmJlxuICAgICAgICAgICAgdXJscy5pbmNsdWRlcyhpdGVtLnVybCkgJiZcbiAgICAgICAgICAgIExpbmtQcmV2aWV3LnNob3VsZFByZXZpZXdIcmVmKGl0ZW0udXJsKVxuICAgICAgICApO1xuICAgICAgICBpZiAocHJldmlldy5sZW5ndGggPCBpbmNvbWluZ1ByZXZpZXcubGVuZ3RoKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICBgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfTogRWxpbWluYXRlZCAke1xuICAgICAgICAgICAgICBwcmV2aWV3Lmxlbmd0aCAtIGluY29taW5nUHJldmlldy5sZW5ndGhcbiAgICAgICAgICAgIH0gcHJldmlld3Mgd2l0aCBpbnZhbGlkIHVybHMnYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBtZXNzYWdlLnNldCh7XG4gICAgICAgICAgaWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICBhdHRhY2htZW50czogZGF0YU1lc3NhZ2UuYXR0YWNobWVudHMsXG4gICAgICAgICAgYm9keTogZGF0YU1lc3NhZ2UuYm9keSxcbiAgICAgICAgICBib2R5UmFuZ2VzOiBkYXRhTWVzc2FnZS5ib2R5UmFuZ2VzLFxuICAgICAgICAgIGNvbnRhY3Q6IGRhdGFNZXNzYWdlLmNvbnRhY3QsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICBkZWNyeXB0ZWRfYXQ6IG5vdyxcbiAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgIGZsYWdzOiBkYXRhTWVzc2FnZS5mbGFncyxcbiAgICAgICAgICBnaWZ0QmFkZ2U6IGluaXRpYWxNZXNzYWdlLmdpZnRCYWRnZSxcbiAgICAgICAgICBoYXNBdHRhY2htZW50czogZGF0YU1lc3NhZ2UuaGFzQXR0YWNobWVudHMsXG4gICAgICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzOiBkYXRhTWVzc2FnZS5oYXNGaWxlQXR0YWNobWVudHMsXG4gICAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50czogZGF0YU1lc3NhZ2UuaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cyxcbiAgICAgICAgICBpc1ZpZXdPbmNlOiBCb29sZWFuKGRhdGFNZXNzYWdlLmlzVmlld09uY2UpLFxuICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgcmVxdWlyZWRQcm90b2NvbFZlcnNpb246XG4gICAgICAgICAgICBkYXRhTWVzc2FnZS5yZXF1aXJlZFByb3RvY29sVmVyc2lvbiB8fFxuICAgICAgICAgICAgdGhpcy5JTklUSUFMX1BST1RPQ09MX1ZFUlNJT04sXG4gICAgICAgICAgc3VwcG9ydGVkVmVyc2lvbkF0UmVjZWl2ZTogdGhpcy5DVVJSRU5UX1BST1RPQ09MX1ZFUlNJT04sXG4gICAgICAgICAgcXVvdGU6IGRhdGFNZXNzYWdlLnF1b3RlLFxuICAgICAgICAgIHNjaGVtYVZlcnNpb246IGRhdGFNZXNzYWdlLnNjaGVtYVZlcnNpb24sXG4gICAgICAgICAgc3RpY2tlcjogZGF0YU1lc3NhZ2Uuc3RpY2tlcixcbiAgICAgICAgICBzdG9yeUlkOiBkYXRhTWVzc2FnZS5zdG9yeUlkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc3RvcnlRdW90ZSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuaHlkcmF0ZVN0b3J5Q29udGV4dChzdG9yeVF1b3RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzU3VwcG9ydGVkID0gIWlzVW5zdXBwb3J0ZWRNZXNzYWdlKG1lc3NhZ2UuYXR0cmlidXRlcyk7XG4gICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICBhd2FpdCBtZXNzYWdlLmVyYXNlQ29udGVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1N1cHBvcnRlZCkge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0ge1xuICAgICAgICAgICAgLi4uY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIEdyb3VwVjFcbiAgICAgICAgICBpZiAoIWhhc0dyb3VwVjJQcm9wICYmIGluaXRpYWxNZXNzYWdlLmdyb3VwKSB7XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nR3JvdXBVcGRhdGU6IEdyb3VwVjFVcGRhdGUgPSB7fTtcblxuICAgICAgICAgICAgY29uc3QgbWVtYmVyQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+ID1cbiAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgaW5pdGlhbE1lc3NhZ2UuZ3JvdXAubWVtYmVyc0UxNjQubWFwKChlMTY0OiBzdHJpbmcpID0+XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZUFuZFdhaXQoXG4gICAgICAgICAgICAgICAgICAgIGUxNjQsXG4gICAgICAgICAgICAgICAgICAgICdwcml2YXRlJ1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtZW1iZXJDb252ZXJzYXRpb25zLm1hcChjID0+IGMuZ2V0KCdpZCcpKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSB7XG4gICAgICAgICAgICAgIC4uLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgICAgICAgIGdyb3VwSWQ6IGluaXRpYWxNZXNzYWdlLmdyb3VwLmlkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpbml0aWFsTWVzc2FnZS5ncm91cC50eXBlID09PSBHUk9VUF9UWVBFUy5VUERBVEUpIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlcyA9IHtcbiAgICAgICAgICAgICAgICAuLi5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIG5hbWU6IGluaXRpYWxNZXNzYWdlLmdyb3VwLm5hbWUsXG4gICAgICAgICAgICAgICAgbWVtYmVyczogXy51bmlvbihtZW1iZXJzLCBjb252ZXJzYXRpb24uZ2V0KCdtZW1iZXJzJykpLFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmIChpbml0aWFsTWVzc2FnZS5ncm91cC5uYW1lICE9PSBjb252ZXJzYXRpb24uZ2V0KCduYW1lJykpIHtcbiAgICAgICAgICAgICAgICBwZW5kaW5nR3JvdXBVcGRhdGUubmFtZSA9IGluaXRpYWxNZXNzYWdlLmdyb3VwLm5hbWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCBhdmF0YXJBdHRhY2htZW50ID0gaW5pdGlhbE1lc3NhZ2UuZ3JvdXAuYXZhdGFyO1xuXG4gICAgICAgICAgICAgIGxldCBkb3dubG9hZGVkQXZhdGFyO1xuICAgICAgICAgICAgICBsZXQgaGFzaDtcbiAgICAgICAgICAgICAgaWYgKGF2YXRhckF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZG93bmxvYWRlZEF2YXRhciA9IGF3YWl0IGRvd25sb2FkQXR0YWNobWVudChhdmF0YXJBdHRhY2htZW50KTtcblxuICAgICAgICAgICAgICAgICAgaWYgKGRvd25sb2FkZWRBdmF0YXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZGVkQXR0YWNobWVudCA9XG4gICAgICAgICAgICAgICAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmxvYWRBdHRhY2htZW50RGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvd25sb2FkZWRBdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGhhc2ggPSBjb21wdXRlSGFzaChsb2FkZWRBdHRhY2htZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgbG9nLmluZm8oJ2hhbmRsZURhdGFNZXNzYWdlOiBncm91cCBhdmF0YXIgZG93bmxvYWQgZmFpbGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdBdmF0YXIgPSBjb252ZXJzYXRpb24uZ2V0KCdhdmF0YXInKTtcblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgLy8gQXZhdGFyIGFkZGVkXG4gICAgICAgICAgICAgICAgKCFleGlzdGluZ0F2YXRhciAmJiBhdmF0YXJBdHRhY2htZW50KSB8fFxuICAgICAgICAgICAgICAgIC8vIEF2YXRhciBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgKGV4aXN0aW5nQXZhdGFyICYmIGV4aXN0aW5nQXZhdGFyLmhhc2ggIT09IGhhc2gpIHx8XG4gICAgICAgICAgICAgICAgLy8gQXZhdGFyIHJlbW92ZWRcbiAgICAgICAgICAgICAgICAoZXhpc3RpbmdBdmF0YXIgJiYgIWF2YXRhckF0dGFjaG1lbnQpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZXMgZXhpc3RpbmcgYXZhdGFyIGZyb20gZGlza1xuICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ0F2YXRhciAmJiBleGlzdGluZ0F2YXRhci5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZGVsZXRlQXR0YWNobWVudERhdGEoXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nQXZhdGFyLnBhdGhcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGF2YXRhciA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGRvd25sb2FkZWRBdmF0YXIgJiYgYXZhdGFyQXR0YWNobWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgY29uc3Qgb25EaXNrQXR0YWNobWVudCA9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEF0dGFjaG1lbnQubWlncmF0ZURhdGFUb0ZpbGVTeXN0ZW0oZG93bmxvYWRlZEF2YXRhciwge1xuICAgICAgICAgICAgICAgICAgICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGE6XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMud3JpdGVOZXdBdHRhY2htZW50RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICBsb2dnZXI6IGxvZyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBhdmF0YXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9uRGlza0F0dGFjaG1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGhhc2gsXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuYXZhdGFyID0gYXZhdGFyO1xuXG4gICAgICAgICAgICAgICAgcGVuZGluZ0dyb3VwVXBkYXRlLmF2YXRhclVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgICAgICAgJ2hhbmRsZURhdGFNZXNzYWdlOiBHcm91cCBhdmF0YXIgaGFzaCBtYXRjaGVkOyBub3QgcmVwbGFjaW5nIGdyb3VwIGF2YXRhcidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IF8uZGlmZmVyZW5jZShcbiAgICAgICAgICAgICAgICBtZW1iZXJzLFxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAgICAgY29udmVyc2F0aW9uLmdldCgnbWVtYmVycycpIVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAoZGlmZmVyZW5jZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSBHcm91cFYxIGdyb3VwcyBhcmUgYmFzZWQgb24gZTE2NCBvbmx5XG4gICAgICAgICAgICAgICAgY29uc3QgbWF5YmVFMTY0cyA9IG1hcChkaWZmZXJlbmNlLCBpZCA9PlxuICAgICAgICAgICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKT8uZ2V0KCdlMTY0JylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGUxNjRzID0gZmlsdGVyKG1heWJlRTE2NHMsIGlzTm90TmlsKTtcbiAgICAgICAgICAgICAgICBwZW5kaW5nR3JvdXBVcGRhdGUuam9pbmVkID0gWy4uLmUxNjRzXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoY29udmVyc2F0aW9uLmdldCgnbGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgbG9nLndhcm4oJ3JlLWFkZGVkIHRvIGEgbGVmdCBncm91cCcpO1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5zZXQoeyBhZGRlZEJ5OiBnZXRDb250YWN0SWQobWVzc2FnZS5hdHRyaWJ1dGVzKSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbml0aWFsTWVzc2FnZS5ncm91cC50eXBlID09PSBHUk9VUF9UWVBFUy5RVUlUKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGluR3JvdXAgPSBCb29sZWFuKFxuICAgICAgICAgICAgICAgIHNlbmRlciAmJlxuICAgICAgICAgICAgICAgICAgKGNvbnZlcnNhdGlvbi5nZXQoJ21lbWJlcnMnKSB8fCBbXSkuaW5jbHVkZXMoc2VuZGVyLmlkKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAoIWluR3JvdXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJTdHJpbmcgPSBzZW5kZXIgPyBzZW5kZXIuaWRGb3JMb2dnaW5nKCkgOiBudWxsO1xuICAgICAgICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgICAgICAgYEdvdCAnbGVmdCcgbWVzc2FnZSBmcm9tIHNvbWVvbmUgbm90IGluIGdyb3VwOiAke3NlbmRlclN0cmluZ30uIERyb3BwaW5nLmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChpc01lKHNlbmRlci5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGVuZGluZ0dyb3VwVXBkYXRlLmxlZnQgPSAnWW91JztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZW5kaW5nR3JvdXBVcGRhdGUubGVmdCA9IHNlbmRlci5nZXQoJ2lkJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXR0cmlidXRlcy5tZW1iZXJzID0gXy53aXRob3V0KFxuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5nZXQoJ21lbWJlcnMnKSxcbiAgICAgICAgICAgICAgICBzZW5kZXIuZ2V0KCdpZCcpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNFbXB0eShwZW5kaW5nR3JvdXBVcGRhdGUpKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2Uuc2V0KCdncm91cF91cGRhdGUnLCBwZW5kaW5nR3JvdXBVcGRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERyb3AgZW1wdHkgbWVzc2FnZXMgYWZ0ZXIuIFRoaXMgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHRoZSBpbml0aWFsXG4gICAgICAgICAgLy8gbWVzc2FnZS5zZXQgY2FsbCBhbmQgYWZ0ZXIgR3JvdXBWMSBwcm9jZXNzaW5nIHRvIG1ha2Ugc3VyZSBhbGwgcG9zc2libGVcbiAgICAgICAgICAvLyBwcm9wZXJ0aWVzIGFyZSBzZXQgYmVmb3JlIHdlIGRldGVybWluZSB0aGF0IGEgbWVzc2FnZSBpcyBlbXB0eS5cbiAgICAgICAgICBpZiAobWVzc2FnZS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgICBgaGFuZGxlRGF0YU1lc3NhZ2U6IERyb3BwaW5nIGVtcHR5IG1lc3NhZ2UgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfSBpbiBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbmZpcm0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNTdG9yeShtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmhhc1Bvc3RlZFN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5hY3RpdmVfYXQgPSBub3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udmVyc2F0aW9uLnNldChhdHRyaWJ1dGVzKTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGFNZXNzYWdlLmV4cGlyZVRpbWVyICYmXG4gICAgICAgICAgICAhaXNFeHBpcmF0aW9uVGltZXJVcGRhdGUoZGF0YU1lc3NhZ2UpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBtZXNzYWdlLnNldCh7IGV4cGlyZVRpbWVyOiBkYXRhTWVzc2FnZS5leHBpcmVUaW1lciB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWhhc0dyb3VwVjJQcm9wICYmICFpc1N0b3J5KG1lc3NhZ2UuYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgIGlmIChpc0V4cGlyYXRpb25UaW1lclVwZGF0ZShtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2Uuc2V0KHtcbiAgICAgICAgICAgICAgICBleHBpcmF0aW9uVGltZXJVcGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZVV1aWQsXG4gICAgICAgICAgICAgICAgICBleHBpcmVUaW1lcjogaW5pdGlhbE1lc3NhZ2UuZXhwaXJlVGltZXIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ2V4cGlyZVRpbWVyJykgIT09IGRhdGFNZXNzYWdlLmV4cGlyZVRpbWVyKSB7XG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ0luY29taW5nIGV4cGlyYXRpb25UaW1lclVwZGF0ZSBjaGFuZ2VkIHRpbWVyJywge1xuICAgICAgICAgICAgICAgICAgaWQ6IGNvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKSxcbiAgICAgICAgICAgICAgICAgIGV4cGlyZVRpbWVyOiBkYXRhTWVzc2FnZS5leHBpcmVUaW1lciB8fCAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgICAgICAgc291cmNlOiAnaGFuZGxlRGF0YU1lc3NhZ2UvZXhwaXJhdGlvblRpbWVyVXBkYXRlJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb24uc2V0KHtcbiAgICAgICAgICAgICAgICAgIGV4cGlyZVRpbWVyOiBkYXRhTWVzc2FnZS5leHBpcmVUaW1lcixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3RlOiBGb3IgaW5jb21pbmcgZXhwaXJlIHRpbWVyIHVwZGF0ZXMgKG5vdCBub3JtYWwgbWVzc2FnZXMgdGhhdCBjb21lXG4gICAgICAgICAgICAvLyAgIGFsb25nIHdpdGggYW4gZXhwaXJlVGltZXIpLCB0aGUgY29udmVyc2F0aW9uIHdpbGwgYmUgdXBkYXRlZCBieSB0aGlzXG4gICAgICAgICAgICAvLyAgIHBvaW50IGFuZCB0aGVzZSBjYWxscyB3aWxsIHJldHVybiBlYXJseS5cbiAgICAgICAgICAgIGlmIChkYXRhTWVzc2FnZS5leHBpcmVUaW1lcikge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb24udXBkYXRlRXhwaXJhdGlvblRpbWVyKGRhdGFNZXNzYWdlLmV4cGlyZVRpbWVyLCB7XG4gICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IG1lc3NhZ2UuZ2V0KCdyZWNlaXZlZF9hdCcpLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXRNUzogbWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0X21zJyksXG4gICAgICAgICAgICAgICAgc2VudEF0OiBtZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgICAgICAgICAgIGZyb21Hcm91cFVwZGF0ZTogaXNHcm91cFVwZGF0ZShtZXNzYWdlLmF0dHJpYnV0ZXMpLFxuICAgICAgICAgICAgICAgIHJlYXNvbjogYGhhbmRsZURhdGFNZXNzYWdlKCR7dGhpcy5pZEZvckxvZ2dpbmcoKX0pYCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAvLyBXZSB3b24ndCB0dXJuIG9mZiB0aW1lcnMgZm9yIHRoZXNlIGtpbmRzIG9mIG1lc3NhZ2VzOlxuICAgICAgICAgICAgICAhaXNHcm91cFVwZGF0ZShtZXNzYWdlLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICAgICAgICFpc0VuZFNlc3Npb24obWVzc2FnZS5hdHRyaWJ1dGVzKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi51cGRhdGVFeHBpcmF0aW9uVGltZXIodW5kZWZpbmVkLCB7XG4gICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IG1lc3NhZ2UuZ2V0KCdyZWNlaXZlZF9hdCcpLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXRNUzogbWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0X21zJyksXG4gICAgICAgICAgICAgICAgc2VudEF0OiBtZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgICAgICAgICAgIHJlYXNvbjogYGhhbmRsZURhdGFNZXNzYWdlKCR7dGhpcy5pZEZvckxvZ2dpbmcoKX0pYCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGluaXRpYWxNZXNzYWdlLnByb2ZpbGVLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvZmlsZUtleSB9ID0gaW5pdGlhbE1lc3NhZ2U7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHNvdXJjZSA9PT0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpIHx8XG4gICAgICAgICAgICAgIHNvdXJjZVV1aWQgPT09XG4gICAgICAgICAgICAgICAgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKT8udG9TdHJpbmcoKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5zZXQoeyBwcm9maWxlU2hhcmluZzogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5zZXRQcm9maWxlS2V5KHByb2ZpbGVLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgZTE2NDogc291cmNlLFxuICAgICAgICAgICAgICAgIHV1aWQ6IHNvdXJjZVV1aWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBsb2NhbD8uc2V0UHJvZmlsZUtleShwcm9maWxlS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNUYXBUb1ZpZXcobWVzc2FnZS5hdHRyaWJ1dGVzKSAmJiB0eXBlID09PSAnb3V0Z29pbmcnKSB7XG4gICAgICAgICAgICBhd2FpdCBtZXNzYWdlLmVyYXNlQ29udGVudHMoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlID09PSAnaW5jb21pbmcnICYmXG4gICAgICAgICAgICBpc1RhcFRvVmlldyhtZXNzYWdlLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICAgICAhbWVzc2FnZS5pc1ZhbGlkVGFwVG9WaWV3KClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgICBgUmVjZWl2ZWQgdGFwIHRvIHZpZXcgbWVzc2FnZSAke21lc3NhZ2UuaWRGb3JMb2dnaW5nKCl9IHdpdGggaW52YWxpZCBkYXRhLiBFcmFzaW5nIGNvbnRlbnRzLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtZXNzYWdlLnNldCh7XG4gICAgICAgICAgICAgIGlzVGFwVG9WaWV3SW52YWxpZDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgbWVzc2FnZS5lcmFzZUNvbnRlbnRzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udmVyc2F0aW9uVGltZXN0YW1wID0gY29udmVyc2F0aW9uLmdldCgndGltZXN0YW1wJyk7XG4gICAgICAgIGNvbnN0IGlzR3JvdXBTdG9yeVJlcGx5ID1cbiAgICAgICAgICBpc0dyb3VwKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJiBtZXNzYWdlLmdldCgnc3RvcnlJZCcpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWlzU3RvcnkobWVzc2FnZS5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICAgICFpc0dyb3VwU3RvcnlSZXBseSAmJlxuICAgICAgICAgICghY29udmVyc2F0aW9uVGltZXN0YW1wIHx8XG4gICAgICAgICAgICBtZXNzYWdlLmdldCgnc2VudF9hdCcpID4gY29udmVyc2F0aW9uVGltZXN0YW1wKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb252ZXJzYXRpb24uc2V0KHtcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiBtZXNzYWdlLmdldE5vdGlmaWNhdGlvblRleHQoKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihtZXNzYWdlLmlkLCBtZXNzYWdlKTtcbiAgICAgICAgY29udmVyc2F0aW9uLmluY3JlbWVudE1lc3NhZ2VDb3VudCgpO1xuICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcblxuICAgICAgICBjb25zdCByZWR1eFN0YXRlID0gd2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgICAgICBjb25zdCBnaWZ0QmFkZ2UgPSBtZXNzYWdlLmdldCgnZ2lmdEJhZGdlJyk7XG4gICAgICAgIGlmIChnaWZ0QmFkZ2UpIHtcbiAgICAgICAgICBjb25zdCB7IGxldmVsIH0gPSBnaWZ0QmFkZ2U7XG4gICAgICAgICAgY29uc3QgeyB1cGRhdGVzVXJsIH0gPSB3aW5kb3cuU2lnbmFsQ29udGV4dC5jb25maWc7XG4gICAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgICAgdHlwZW9mIHVwZGF0ZXNVcmwgPT09ICdzdHJpbmcnLFxuICAgICAgICAgICAgJ2dldFByb2ZpbGU6IGV4cGVjdGVkIHVwZGF0ZXNVcmwgdG8gYmUgYSBkZWZpbmVkIHN0cmluZydcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IHVzZXJMYW5ndWFnZXMgPSBnZXRVc2VyTGFuZ3VhZ2VzKFxuICAgICAgICAgICAgbmF2aWdhdG9yLmxhbmd1YWdlcyxcbiAgICAgICAgICAgIHdpbmRvdy5nZXRMb2NhbGUoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgICAgICAgIGlmICghbWVzc2FnaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hhbmRsZURhdGFNZXNzYWdlOiBtZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG1lc3NhZ2luZy5zZXJ2ZXIuZ2V0Qm9vc3RCYWRnZXNGcm9tU2VydmVyKFxuICAgICAgICAgICAgdXNlckxhbmd1YWdlc1xuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgYm9vc3RCYWRnZXNCeUxldmVsID0gcGFyc2VCb29zdEJhZGdlTGlzdEZyb21TZXJ2ZXIoXG4gICAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICAgIHVwZGF0ZXNVcmxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGJhZGdlID0gYm9vc3RCYWRnZXNCeUxldmVsW2xldmVsXTtcbiAgICAgICAgICBpZiAoIWJhZGdlKSB7XG4gICAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAgIGBoYW5kbGVEYXRhTWVzc2FnZTogZ2lmdCBiYWRnZSB3aXRoIGxldmVsICR7bGV2ZWx9IG5vdCBmb3VuZCBvbiBzZXJ2ZXJgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cucmVkdXhBY3Rpb25zLmJhZGdlcy51cGRhdGVPckNyZWF0ZShbYmFkZ2VdKTtcbiAgICAgICAgICAgIGdpZnRCYWRnZS5pZCA9IGJhZGdlLmlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9ubHkgcXVldWUgYXR0YWNobWVudHMgZm9yIGRvd25sb2FkcyBpZiB0aGlzIGlzIGEgc3Rvcnkgb3JcbiAgICAgICAgLy8gb3V0Z29pbmcgbWVzc2FnZSBvciB3ZSd2ZSBhY2NlcHRlZCB0aGUgY29udmVyc2F0aW9uXG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gdGhpcy5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW107XG5cbiAgICAgICAgbGV0IHF1ZXVlU3RvcnlGb3JEb3dubG9hZCA9IGZhbHNlO1xuICAgICAgICBpZiAoaXNTdG9yeShtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgY29uc3QgaXNTaG93aW5nU3RvcmllcyA9IHNob3VsZFNob3dTdG9yaWVzVmlldyhyZWR1eFN0YXRlKTtcblxuICAgICAgICAgIHF1ZXVlU3RvcnlGb3JEb3dubG9hZCA9XG4gICAgICAgICAgICBpc1Nob3dpbmdTdG9yaWVzIHx8XG4gICAgICAgICAgICAoYXdhaXQgc2hvdWxkRG93bmxvYWRTdG9yeShjb252ZXJzYXRpb24uYXR0cmlidXRlcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkSG9sZE9mZkRvd25sb2FkID1cbiAgICAgICAgICAoaXNTdG9yeShtZXNzYWdlLmF0dHJpYnV0ZXMpICYmICFxdWV1ZVN0b3J5Rm9yRG93bmxvYWQpIHx8XG4gICAgICAgICAgKCFpc1N0b3J5KG1lc3NhZ2UuYXR0cmlidXRlcykgJiZcbiAgICAgICAgICAgIChpc0ltYWdlKGF0dGFjaG1lbnRzKSB8fCBpc1ZpZGVvKGF0dGFjaG1lbnRzKSkgJiZcbiAgICAgICAgICAgIGlzSW5DYWxsKHJlZHV4U3RhdGUpKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5oYXNBdHRhY2htZW50RG93bmxvYWRzKCkgJiZcbiAgICAgICAgICAoY29udmVyc2F0aW9uLmdldEFjY2VwdGVkKCkgfHwgaXNPdXRnb2luZyhtZXNzYWdlLmF0dHJpYnV0ZXMpKSAmJlxuICAgICAgICAgICFzaG91bGRIb2xkT2ZmRG93bmxvYWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5hdHRhY2htZW50RG93bmxvYWRRdWV1ZSkge1xuICAgICAgICAgICAgd2luZG93LmF0dGFjaG1lbnREb3dubG9hZFF1ZXVlLnVuc2hpZnQobWVzc2FnZSk7XG4gICAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgICAgJ0FkZGluZyB0byBhdHRhY2htZW50RG93bmxvYWRRdWV1ZScsXG4gICAgICAgICAgICAgIG1lc3NhZ2UuZ2V0KCdzZW50X2F0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IG1lc3NhZ2UucXVldWVBdHRhY2htZW50RG93bmxvYWRzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNGaXJzdFJ1biA9IHRydWU7XG4gICAgICAgIGF3YWl0IHRoaXMubW9kaWZ5VGFyZ2V0TWVzc2FnZShjb252ZXJzYXRpb24sIGlzRmlyc3RSdW4pO1xuXG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdoYW5kbGVEYXRhTWVzc2FnZTogQmF0Y2hpbmcgc2F2ZSBmb3InLFxuICAgICAgICAgIG1lc3NhZ2UuZ2V0KCdzZW50X2F0JylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zYXZlQW5kTm90aWZ5KGNvbnZlcnNhdGlvbiwgY29uZmlybSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvckZvckxvZyA9IGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvcjtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdoYW5kbGVEYXRhTWVzc2FnZScsXG4gICAgICAgICAgbWVzc2FnZS5pZEZvckxvZ2dpbmcoKSxcbiAgICAgICAgICAnZXJyb3I6JyxcbiAgICAgICAgICBlcnJvckZvckxvZ1xuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVBbmROb3RpZnkoXG4gICAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbCxcbiAgICBjb25maXJtOiAoKSA9PiB2b2lkXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuVXRpbC5zYXZlTmV3TWVzc2FnZUJhdGNoZXIuYWRkKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBsb2cuaW5mbygnTWVzc2FnZSBzYXZlZCcsIHRoaXMuZ2V0KCdzZW50X2F0JykpO1xuXG4gICAgY29udmVyc2F0aW9uLnRyaWdnZXIoJ25ld21lc3NhZ2UnLCB0aGlzKTtcblxuICAgIGNvbnN0IGlzRmlyc3RSdW4gPSBmYWxzZTtcbiAgICBhd2FpdCB0aGlzLm1vZGlmeVRhcmdldE1lc3NhZ2UoY29udmVyc2F0aW9uLCBpc0ZpcnN0UnVuKTtcblxuICAgIGNvbnN0IGlzR3JvdXBTdG9yeVJlcGx5ID1cbiAgICAgIGlzR3JvdXAoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpICYmIHRoaXMuZ2V0KCdzdG9yeUlkJyk7XG5cbiAgICBpZiAoaXNNZXNzYWdlVW5yZWFkKHRoaXMuYXR0cmlidXRlcykgJiYgIWlzR3JvdXBTdG9yeVJlcGx5KSB7XG4gICAgICBhd2FpdCBjb252ZXJzYXRpb24ubm90aWZ5KHRoaXMpO1xuICAgIH1cblxuICAgIC8vIEluY3JlbWVudCB0aGUgc2VudCBtZXNzYWdlIGNvdW50IGlmIHRoaXMgaXMgYW4gb3V0Z29pbmcgbWVzc2FnZVxuICAgIGlmICh0aGlzLmdldCgndHlwZScpID09PSAnb3V0Z29pbmcnKSB7XG4gICAgICBjb252ZXJzYXRpb24uaW5jcmVtZW50U2VudE1lc3NhZ2VDb3VudCgpO1xuICAgIH1cblxuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCdpbmNyZW1lbnRQcm9ncmVzcycpO1xuICAgIGNvbmZpcm0oKTtcblxuICAgIGlmICghaXNTdG9yeSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBjb252ZXJzYXRpb24ucXVldWVKb2IoJ3VwZGF0ZVVucmVhZCcsICgpID0+IGNvbnZlcnNhdGlvbi51cGRhdGVVbnJlYWQoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgdHdpY2UgLSBvbmNlIGZyb20gaGFuZGxlRGF0YU1lc3NhZ2UsIGFuZCB0aGVuIGFnYWluIGZyb21cbiAgLy8gICAgc2F2ZUFuZE5vdGlmeSwgYSBmdW5jdGlvbiBjYWxsZWQgYXQgdGhlIGVuZCBvZiBoYW5kbGVEYXRhTWVzc2FnZSBhcyBhIGNsZWFudXAgZm9yXG4gIC8vICAgIGFueSBtaXNzZWQgb3V0LW9mLW9yZGVyIGV2ZW50cy5cbiAgYXN5bmMgbW9kaWZ5VGFyZ2V0TWVzc2FnZShcbiAgICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsLFxuICAgIGlzRmlyc3RSdW46IGJvb2xlYW5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXM7XG4gICAgY29uc3QgdHlwZSA9IG1lc3NhZ2UuZ2V0KCd0eXBlJyk7XG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlID09PSAnb3V0Z29pbmcnKSB7XG4gICAgICBjb25zdCBzZW5kQWN0aW9ucyA9IE1lc3NhZ2VSZWNlaXB0cy5nZXRTaW5nbGV0b24oKVxuICAgICAgICAuZm9yTWVzc2FnZShjb252ZXJzYXRpb24sIG1lc3NhZ2UpXG4gICAgICAgIC5tYXAocmVjZWlwdCA9PiB7XG4gICAgICAgICAgbGV0IHNlbmRBY3Rpb25UeXBlOiBTZW5kQWN0aW9uVHlwZTtcbiAgICAgICAgICBjb25zdCByZWNlaXB0VHlwZSA9IHJlY2VpcHQuZ2V0KCd0eXBlJyk7XG4gICAgICAgICAgc3dpdGNoIChyZWNlaXB0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBNZXNzYWdlUmVjZWlwdFR5cGUuRGVsaXZlcnk6XG4gICAgICAgICAgICAgIHNlbmRBY3Rpb25UeXBlID0gU2VuZEFjdGlvblR5cGUuR290RGVsaXZlcnlSZWNlaXB0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVJlY2VpcHRUeXBlLlJlYWQ6XG4gICAgICAgICAgICAgIHNlbmRBY3Rpb25UeXBlID0gU2VuZEFjdGlvblR5cGUuR290UmVhZFJlY2VpcHQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBNZXNzYWdlUmVjZWlwdFR5cGUuVmlldzpcbiAgICAgICAgICAgICAgc2VuZEFjdGlvblR5cGUgPSBTZW5kQWN0aW9uVHlwZS5Hb3RWaWV3ZWRSZWNlaXB0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IocmVjZWlwdFR5cGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbkNvbnZlcnNhdGlvbklkOiByZWNlaXB0LmdldCgnc291cmNlQ29udmVyc2F0aW9uSWQnKSxcbiAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICB0eXBlOiBzZW5kQWN0aW9uVHlwZSxcbiAgICAgICAgICAgICAgdXBkYXRlZEF0OiByZWNlaXB0LmdldCgncmVjZWlwdFRpbWVzdGFtcCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgb2xkU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCA9XG4gICAgICAgIHRoaXMuZ2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJykgfHwge307XG5cbiAgICAgIGNvbnN0IG5ld1NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPSByZWR1Y2UoXG4gICAgICAgIHNlbmRBY3Rpb25zLFxuICAgICAgICAoXG4gICAgICAgICAgcmVzdWx0OiBTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIHsgZGVzdGluYXRpb25Db252ZXJzYXRpb25JZCwgYWN0aW9uIH1cbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkU2VuZFN0YXRlID0gZ2V0T3duKHJlc3VsdCwgZGVzdGluYXRpb25Db252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgaWYgKCFvbGRTZW5kU3RhdGUpIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgICBgR290IGEgcmVjZWlwdCBmb3IgYSBjb252ZXJzYXRpb24gKCR7ZGVzdGluYXRpb25Db252ZXJzYXRpb25JZH0pLCBidXQgd2UgaGF2ZSBubyByZWNvcmQgb2Ygc2VuZGluZyB0byB0aGVtYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbmV3U2VuZFN0YXRlID0gc2VuZFN0YXRlUmVkdWNlcihvbGRTZW5kU3RhdGUsIGFjdGlvbik7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgIFtkZXN0aW5hdGlvbkNvbnZlcnNhdGlvbklkXTogbmV3U2VuZFN0YXRlLFxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG9sZFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRcbiAgICAgICk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWlzRXF1YWwob2xkU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCwgbmV3U2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZClcbiAgICAgICkge1xuICAgICAgICBtZXNzYWdlLnNldCgnc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCcsIG5ld1NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpO1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ2luY29taW5nJykge1xuICAgICAgLy8gSW4gYSBmb2xsb3d1cCAoc2VlIERFU0tUT1AtMjEwMCksIHdlIHdhbnQgdG8gbWFrZSBgUmVhZFN5bmNzI2Zvck1lc3NhZ2VgIHJldHVyblxuICAgICAgLy8gICBhbiBhcnJheSwgbm90IGFuIG9iamVjdC4gVGhpcyBhcnJheSB3cmFwcGluZyBtYWtlcyB0aGF0IGZ1dHVyZSBhIGJpdCBlYXNpZXIuXG4gICAgICBjb25zdCByZWFkU3luYyA9IFJlYWRTeW5jcy5nZXRTaW5nbGV0b24oKS5mb3JNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgY29uc3QgcmVhZFN5bmNzID0gcmVhZFN5bmMgPyBbcmVhZFN5bmNdIDogW107XG5cbiAgICAgIGNvbnN0IHZpZXdTeW5jcyA9IFZpZXdTeW5jcy5nZXRTaW5nbGV0b24oKS5mb3JNZXNzYWdlKG1lc3NhZ2UpO1xuXG4gICAgICBjb25zdCBpc0dyb3VwU3RvcnlSZXBseSA9XG4gICAgICAgIGlzR3JvdXAoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpICYmIG1lc3NhZ2UuZ2V0KCdzdG9yeUlkJyk7XG5cbiAgICAgIGNvbnN0IGtlZXBNdXRlZENoYXRzQXJjaGl2ZWQgPVxuICAgICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ2tlZXBNdXRlZENoYXRzQXJjaGl2ZWQnKSA/PyBmYWxzZTtcbiAgICAgIGNvbnN0IGtlZXBUaGlzQ29udmVyc2F0aW9uQXJjaGl2ZWQgPVxuICAgICAgICBrZWVwTXV0ZWRDaGF0c0FyY2hpdmVkICYmIGNvbnZlcnNhdGlvbi5pc011dGVkKCk7XG5cbiAgICAgIGlmIChyZWFkU3luY3MubGVuZ3RoICE9PSAwIHx8IHZpZXdTeW5jcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgY29uc3QgbWFya1JlYWRBdCA9IE1hdGgubWluKFxuICAgICAgICAgIERhdGUubm93KCksXG4gICAgICAgICAgLi4ucmVhZFN5bmNzLm1hcChzeW5jID0+IHN5bmMuZ2V0KCdyZWFkQXQnKSksXG4gICAgICAgICAgLi4udmlld1N5bmNzLm1hcChzeW5jID0+IHN5bmMuZ2V0KCd2aWV3ZWRBdCcpKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChtZXNzYWdlLmdldCgnZXhwaXJlVGltZXInKSkge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wID0gbWVzc2FnZS5nZXQoXG4gICAgICAgICAgICAnZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgbWVzc2FnZS5zZXQoXG4gICAgICAgICAgICAnZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wJyxcbiAgICAgICAgICAgIE1hdGgubWluKGV4aXN0aW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wID8/IERhdGUubm93KCksIG1hcmtSZWFkQXQpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdSZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQgfCBSZWFkU3RhdHVzLlZpZXdlZDtcbiAgICAgICAgaWYgKHZpZXdTeW5jcy5sZW5ndGgpIHtcbiAgICAgICAgICBuZXdSZWFkU3RhdHVzID0gUmVhZFN0YXR1cy5WaWV3ZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgICAgcmVhZFN5bmNzLmxlbmd0aCAhPT0gMCxcbiAgICAgICAgICAgICdTaG91bGQgaGF2ZSBlaXRoZXIgdmlldyBvciByZWFkIHN5bmNzJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgbmV3UmVhZFN0YXR1cyA9IFJlYWRTdGF0dXMuUmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1lc3NhZ2Uuc2V0KHtcbiAgICAgICAgICByZWFkU3RhdHVzOiBuZXdSZWFkU3RhdHVzLFxuICAgICAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuU2VlbixcbiAgICAgICAgfSk7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucGVuZGluZ01hcmtSZWFkID0gTWF0aC5taW4oXG4gICAgICAgICAgdGhpcy5wZW5kaW5nTWFya1JlYWQgPz8gRGF0ZS5ub3coKSxcbiAgICAgICAgICBtYXJrUmVhZEF0XG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBpc0ZpcnN0UnVuICYmXG4gICAgICAgICFpc0dyb3VwU3RvcnlSZXBseSAmJlxuICAgICAgICAha2VlcFRoaXNDb252ZXJzYXRpb25BcmNoaXZlZFxuICAgICAgKSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbi5zZXQoe1xuICAgICAgICAgIGlzQXJjaGl2ZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0ZpcnN0UnVuICYmIHRoaXMucGVuZGluZ01hcmtSZWFkKSB7XG4gICAgICAgIGNvbnN0IG1hcmtSZWFkQXQgPSB0aGlzLnBlbmRpbmdNYXJrUmVhZDtcbiAgICAgICAgdGhpcy5wZW5kaW5nTWFya1JlYWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBwcmltYXJpbHkgdG8gYWxsb3cgdGhlIGNvbnZlcnNhdGlvbiB0byBtYXJrIGFsbCBvbGRlclxuICAgICAgICAvLyBtZXNzYWdlcyBhcyByZWFkLCBhcyBpcyBkb25lIHdoZW4gd2UgcmVjZWl2ZSBhIHJlYWQgc3luYyBmb3JcbiAgICAgICAgLy8gYSBtZXNzYWdlIHdlIGFscmVhZHkga25vdyBhYm91dC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgcnVuIHRoaXMgd2hlbiBgaXNGaXJzdFJ1bmAgaXMgZmFsc2Ugc28gdGhhdCBpdCB0cmlnZ2VycyB3aGVuIHRoZVxuICAgICAgICAvLyBtZXNzYWdlIGFuZCB0aGUgb3RoZXIgb25lcyBhY2NvbXBhbnlpbmcgaXQgaW4gdGhlIGJhdGNoIGFyZSBmdWxseSBpblxuICAgICAgICAvLyB0aGUgZGF0YWJhc2UuXG4gICAgICAgIG1lc3NhZ2UuZ2V0Q29udmVyc2F0aW9uKCk/Lm9uUmVhZE1lc3NhZ2UobWVzc2FnZSwgbWFya1JlYWRBdCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciBvdXQtb2Ytb3JkZXIgdmlldyBvbmNlIG9wZW4gc3luY3NcbiAgICAgIGlmIChpc1RhcFRvVmlldyhtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGNvbnN0IHZpZXdPbmNlT3BlblN5bmMgPVxuICAgICAgICAgIFZpZXdPbmNlT3BlblN5bmNzLmdldFNpbmdsZXRvbigpLmZvck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIGlmICh2aWV3T25jZU9wZW5TeW5jKSB7XG4gICAgICAgICAgYXdhaXQgbWVzc2FnZS5tYXJrVmlld09uY2VNZXNzYWdlVmlld2VkKHsgZnJvbVN5bmM6IHRydWUgfSk7XG4gICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBpc1N0b3J5KG1lc3NhZ2UuYXR0cmlidXRlcykgJiZcbiAgICAgICFtZXNzYWdlLmdldCgnZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wJylcbiAgICApIHtcbiAgICAgIG1lc3NhZ2Uuc2V0KFxuICAgICAgICAnZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wJyxcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgbWVzc2FnZS5nZXQoJ3NlcnZlclRpbWVzdGFtcCcpIHx8IG1lc3NhZ2UuZ2V0KCd0aW1lc3RhbXAnKSxcbiAgICAgICAgICBEYXRlLm5vdygpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBEb2VzIHRoaXMgbWVzc2FnZSBoYXZlIGFueSBwZW5kaW5nLCBwcmV2aW91c2x5LXJlY2VpdmVkIGFzc29jaWF0ZWQgcmVhY3Rpb25zP1xuICAgIGNvbnN0IHJlYWN0aW9ucyA9IFJlYWN0aW9ucy5nZXRTaW5nbGV0b24oKS5mb3JNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgcmVhY3Rpb25zLm1hcChhc3luYyByZWFjdGlvbiA9PiB7XG4gICAgICAgIGF3YWl0IG1lc3NhZ2UuaGFuZGxlUmVhY3Rpb24ocmVhY3Rpb24sIGZhbHNlKTtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBEb2VzIHRoaXMgbWVzc2FnZSBoYXZlIGFueSBwZW5kaW5nLCBwcmV2aW91c2x5LXJlY2VpdmVkIGFzc29jaWF0ZWRcbiAgICAvLyBkZWxldGUgZm9yIGV2ZXJ5b25lIG1lc3NhZ2VzP1xuICAgIGNvbnN0IGRlbGV0ZXMgPSBEZWxldGVzLmdldFNpbmdsZXRvbigpLmZvck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBkZWxldGVzLm1hcChhc3luYyBkZWwgPT4ge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLlV0aWwuZGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZSwgZGVsLCBmYWxzZSk7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgaWYgKGNoYW5nZWQgJiYgIWlzRmlyc3RSdW4pIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgbW9kaWZ5VGFyZ2V0TWVzc2FnZS8ke3RoaXMuaWRGb3JMb2dnaW5nKCl9OiBDaGFuZ2VzIGluIHNlY29uZCBydW47IHNhdmluZy5gXG4gICAgICApO1xuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKHRoaXMuYXR0cmlidXRlcywge1xuICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaGFuZGxlUmVhY3Rpb24oXG4gICAgcmVhY3Rpb246IFJlYWN0aW9uTW9kZWwsXG4gICAgc2hvdWxkUGVyc2lzdCA9IHRydWVcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBhdHRyaWJ1dGVzIH0gPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuZ2V0KCdkZWxldGVkRm9yRXZlcnlvbmUnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIGFsbG93IHlvdSB0byByZWFjdCB0byBtZXNzYWdlcyB3aXRoIG91dGdvaW5nIGVycm9ycyBvbmx5IGlmIGl0IGhhcyBzZW50XG4gICAgLy8gICBzdWNjZXNzZnVsbHkgdG8gYXQgbGVhc3Qgb25lIHBlcnNvbi5cbiAgICBpZiAoXG4gICAgICBoYXNFcnJvcnMoYXR0cmlidXRlcykgJiZcbiAgICAgIChpc0luY29taW5nKGF0dHJpYnV0ZXMpIHx8XG4gICAgICAgIGdldE1lc3NhZ2VQcm9wU3RhdHVzKFxuICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KClcbiAgICAgICAgKSAhPT0gJ3BhcnRpYWwtc2VudCcpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gdGhpcy5nZXRDb252ZXJzYXRpb24oKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZpb3VzTGVuZ3RoID0gKHRoaXMuZ2V0KCdyZWFjdGlvbnMnKSB8fCBbXSkubGVuZ3RoO1xuICAgIGlmIChyZWFjdGlvbi5nZXQoJ3NvdXJjZScpID09PSBSZWFjdGlvblNvdXJjZS5Gcm9tVGhpc0RldmljZSkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBoYW5kbGVSZWFjdGlvbjogc2VuZGluZyByZWFjdGlvbiB0byAke3RoaXMuaWRGb3JMb2dnaW5nKCl9IGZyb20gdGhpcyBkZXZpY2VgXG4gICAgICApO1xuXG4gICAgICBjb25zdCBuZXdSZWFjdGlvbiA9IHtcbiAgICAgICAgZW1vamk6IHJlYWN0aW9uLmdldCgncmVtb3ZlJykgPyB1bmRlZmluZWQgOiByZWFjdGlvbi5nZXQoJ2Vtb2ppJyksXG4gICAgICAgIGZyb21JZDogcmVhY3Rpb24uZ2V0KCdmcm9tSWQnKSxcbiAgICAgICAgdGFyZ2V0QXV0aG9yVXVpZDogcmVhY3Rpb24uZ2V0KCd0YXJnZXRBdXRob3JVdWlkJyksXG4gICAgICAgIHRhcmdldFRpbWVzdGFtcDogcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKSxcbiAgICAgICAgdGltZXN0YW1wOiByZWFjdGlvbi5nZXQoJ3RpbWVzdGFtcCcpLFxuICAgICAgICBpc1NlbnRCeUNvbnZlcnNhdGlvbklkOiB6aXBPYmplY3QoXG4gICAgICAgICAgY29udmVyc2F0aW9uLmdldE1lbWJlckNvbnZlcnNhdGlvbklkcygpLFxuICAgICAgICAgIHJlcGVhdChmYWxzZSlcbiAgICAgICAgKSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJlYWN0aW9ucyA9IHJlYWN0aW9uVXRpbC5hZGRPdXRnb2luZ1JlYWN0aW9uKFxuICAgICAgICB0aGlzLmdldCgncmVhY3Rpb25zJykgfHwgW10sXG4gICAgICAgIG5ld1JlYWN0aW9uLFxuICAgICAgICBpc1N0b3J5KHRoaXMuYXR0cmlidXRlcylcbiAgICAgICk7XG4gICAgICB0aGlzLnNldCh7IHJlYWN0aW9ucyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2xkUmVhY3Rpb25zID0gdGhpcy5nZXQoJ3JlYWN0aW9ucycpIHx8IFtdO1xuICAgICAgbGV0IHJlYWN0aW9uczogQXJyYXk8TWVzc2FnZVJlYWN0aW9uVHlwZT47XG4gICAgICBjb25zdCBvbGRSZWFjdGlvbiA9IG9sZFJlYWN0aW9ucy5maW5kKHJlID0+XG4gICAgICAgIGlzTmV3UmVhY3Rpb25SZXBsYWNpbmdQcmV2aW91cyhyZSwgcmVhY3Rpb24uYXR0cmlidXRlcywgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgKTtcbiAgICAgIGlmIChvbGRSZWFjdGlvbikge1xuICAgICAgICB0aGlzLmNsZWFyTm90aWZpY2F0aW9ucyhvbGRSZWFjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWFjdGlvbi5nZXQoJ3JlbW92ZScpKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdoYW5kbGVSZWFjdGlvbjogcmVtb3ZpbmcgcmVhY3Rpb24gZm9yIG1lc3NhZ2UnLFxuICAgICAgICAgIHRoaXMuaWRGb3JMb2dnaW5nKClcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAocmVhY3Rpb24uZ2V0KCdzb3VyY2UnKSA9PT0gUmVhY3Rpb25Tb3VyY2UuRnJvbVN5bmMpIHtcbiAgICAgICAgICByZWFjdGlvbnMgPSBvbGRSZWFjdGlvbnMuZmlsdGVyKFxuICAgICAgICAgICAgcmUgPT5cbiAgICAgICAgICAgICAgIWlzTmV3UmVhY3Rpb25SZXBsYWNpbmdQcmV2aW91cyhcbiAgICAgICAgICAgICAgICByZSxcbiAgICAgICAgICAgICAgICByZWFjdGlvbi5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1xuICAgICAgICAgICAgICApIHx8IHJlLnRpbWVzdGFtcCA+IHJlYWN0aW9uLmdldCgndGltZXN0YW1wJylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlYWN0aW9ucyA9IG9sZFJlYWN0aW9ucy5maWx0ZXIoXG4gICAgICAgICAgICByZSA9PlxuICAgICAgICAgICAgICAhaXNOZXdSZWFjdGlvblJlcGxhY2luZ1ByZXZpb3VzKFxuICAgICAgICAgICAgICAgIHJlLFxuICAgICAgICAgICAgICAgIHJlYWN0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KHsgcmVhY3Rpb25zIH0pO1xuXG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVSZWFjdGlvbkZyb21Db252ZXJzYXRpb24oe1xuICAgICAgICAgIGVtb2ppOiByZWFjdGlvbi5nZXQoJ2Vtb2ppJyksXG4gICAgICAgICAgZnJvbUlkOiByZWFjdGlvbi5nZXQoJ2Zyb21JZCcpLFxuICAgICAgICAgIHRhcmdldEF1dGhvclV1aWQ6IHJlYWN0aW9uLmdldCgndGFyZ2V0QXV0aG9yVXVpZCcpLFxuICAgICAgICAgIHRhcmdldFRpbWVzdGFtcDogcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAnaGFuZGxlUmVhY3Rpb246IGFkZGluZyByZWFjdGlvbiBmb3IgbWVzc2FnZScsXG4gICAgICAgICAgdGhpcy5pZEZvckxvZ2dpbmcoKVxuICAgICAgICApO1xuXG4gICAgICAgIGxldCByZWFjdGlvblRvQWRkOiBNZXNzYWdlUmVhY3Rpb25UeXBlO1xuICAgICAgICBpZiAocmVhY3Rpb24uZ2V0KCdzb3VyY2UnKSA9PT0gUmVhY3Rpb25Tb3VyY2UuRnJvbVN5bmMpIHtcbiAgICAgICAgICBjb25zdCBvdXJSZWFjdGlvbnMgPSBbXG4gICAgICAgICAgICByZWFjdGlvbi50b0pTT04oKSxcbiAgICAgICAgICAgIC4uLm9sZFJlYWN0aW9ucy5maWx0ZXIocmUgPT4gcmUuZnJvbUlkID09PSByZWFjdGlvbi5nZXQoJ2Zyb21JZCcpKSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIHJlYWN0aW9uVG9BZGQgPSBtYXhCeShvdXJSZWFjdGlvbnMsICd0aW1lc3RhbXAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWFjdGlvblRvQWRkID0gcmVhY3Rpb24udG9KU09OKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZWFjdGlvbnMgPSBvbGRSZWFjdGlvbnMuZmlsdGVyKFxuICAgICAgICAgIHJlID0+XG4gICAgICAgICAgICAhaXNOZXdSZWFjdGlvblJlcGxhY2luZ1ByZXZpb3VzKFxuICAgICAgICAgICAgICByZSxcbiAgICAgICAgICAgICAgcmVhY3Rpb24uYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIHJlYWN0aW9ucy5wdXNoKHJlYWN0aW9uVG9BZGQpO1xuICAgICAgICB0aGlzLnNldCh7IHJlYWN0aW9ucyB9KTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNPdXRnb2luZyh0aGlzLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICAgcmVhY3Rpb24uZ2V0KCdzb3VyY2UnKSA9PT0gUmVhY3Rpb25Tb3VyY2UuRnJvbVNvbWVvbmVFbHNlXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbi5ub3RpZnkodGhpcywgcmVhY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmFkZFJlYWN0aW9uKHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5nZXQoJ2NvbnZlcnNhdGlvbklkJyksXG4gICAgICAgICAgZW1vamk6IHJlYWN0aW9uLmdldCgnZW1vamknKSxcbiAgICAgICAgICBmcm9tSWQ6IHJlYWN0aW9uLmdldCgnZnJvbUlkJyksXG4gICAgICAgICAgbWVzc2FnZUlkOiB0aGlzLmlkLFxuICAgICAgICAgIG1lc3NhZ2VSZWNlaXZlZEF0OiB0aGlzLmdldCgncmVjZWl2ZWRfYXQnKSxcbiAgICAgICAgICB0YXJnZXRBdXRob3JVdWlkOiByZWFjdGlvbi5nZXQoJ3RhcmdldEF1dGhvclV1aWQnKSxcbiAgICAgICAgICB0YXJnZXRUaW1lc3RhbXA6IHJlYWN0aW9uLmdldCgndGFyZ2V0VGltZXN0YW1wJyksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRMZW5ndGggPSAodGhpcy5nZXQoJ3JlYWN0aW9ucycpIHx8IFtdKS5sZW5ndGg7XG4gICAgbG9nLmluZm8oXG4gICAgICAnaGFuZGxlUmVhY3Rpb246JyxcbiAgICAgIGBEb25lIHByb2Nlc3NpbmcgcmVhY3Rpb24gZm9yIG1lc3NhZ2UgJHt0aGlzLmlkRm9yTG9nZ2luZygpfS5gLFxuICAgICAgYFdlbnQgZnJvbSAke3ByZXZpb3VzTGVuZ3RofSB0byAke2N1cnJlbnRMZW5ndGh9IHJlYWN0aW9ucy5gXG4gICAgKTtcblxuICAgIGlmIChyZWFjdGlvbi5nZXQoJ3NvdXJjZScpID09PSBSZWFjdGlvblNvdXJjZS5Gcm9tVGhpc0RldmljZSkge1xuICAgICAgY29uc3Qgam9iRGF0YTogQ29udmVyc2F0aW9uUXVldWVKb2JEYXRhID0ge1xuICAgICAgICB0eXBlOiBjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0uZW51bS5SZWFjdGlvbixcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgbWVzc2FnZUlkOiB0aGlzLmlkLFxuICAgICAgICByZXZpc2lvbjogY29udmVyc2F0aW9uLmdldCgncmV2aXNpb24nKSxcbiAgICAgIH07XG4gICAgICBpZiAoc2hvdWxkUGVyc2lzdCkge1xuICAgICAgICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoam9iRGF0YSwgYXN5bmMgam9iVG9JbnNlcnQgPT4ge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYGVucXVldWVSZWFjdGlvbkZvclNlbmQ6IHNhdmluZyBtZXNzYWdlICR7dGhpcy5pZEZvckxvZ2dpbmcoKX0gYW5kIGpvYiAke1xuICAgICAgICAgICAgICBqb2JUb0luc2VydC5pZFxuICAgICAgICAgICAgfWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZSh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGpvYlRvSW5zZXJ0LFxuICAgICAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoam9iRGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzaG91bGRQZXJzaXN0KSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UodGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBoYW5kbGVEZWxldGVGb3JFdmVyeW9uZShcbiAgICBkZWw6IERlbGV0ZU1vZGVsLFxuICAgIHNob3VsZFBlcnNpc3QgPSB0cnVlXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdIYW5kbGluZyBET0UuJywge1xuICAgICAgZnJvbUlkOiBkZWwuZ2V0KCdmcm9tSWQnKSxcbiAgICAgIHRhcmdldFNlbnRUaW1lc3RhbXA6IGRlbC5nZXQoJ3RhcmdldFNlbnRUaW1lc3RhbXAnKSxcbiAgICAgIG1lc3NhZ2VTZXJ2ZXJUaW1lc3RhbXA6IHRoaXMuZ2V0KCdzZXJ2ZXJUaW1lc3RhbXAnKSxcbiAgICAgIGRlbGV0ZVNlcnZlclRpbWVzdGFtcDogZGVsLmdldCgnc2VydmVyVGltZXN0YW1wJyksXG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgYW55IG5vdGlmaWNhdGlvbnMgZm9yIHRoaXMgbWVzc2FnZVxuICAgIG5vdGlmaWNhdGlvblNlcnZpY2UucmVtb3ZlQnkoeyBtZXNzYWdlSWQ6IHRoaXMuZ2V0KCdpZCcpIH0pO1xuXG4gICAgLy8gRXJhc2UgdGhlIGNvbnRlbnRzIG9mIHRoaXMgbWVzc2FnZVxuICAgIGF3YWl0IHRoaXMuZXJhc2VDb250ZW50cyhcbiAgICAgIHsgZGVsZXRlZEZvckV2ZXJ5b25lOiB0cnVlLCByZWFjdGlvbnM6IFtdIH0sXG4gICAgICBzaG91bGRQZXJzaXN0XG4gICAgKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgY29udmVyc2F0aW9uJ3MgbGFzdCBtZXNzYWdlIGluIGNhc2UgdGhpcyB3YXMgdGhlIGxhc3QgbWVzc2FnZVxuICAgIHRoaXMuZ2V0Q29udmVyc2F0aW9uKCk/LnVwZGF0ZUxhc3RNZXNzYWdlKCk7XG4gIH1cblxuICBjbGVhck5vdGlmaWNhdGlvbnMocmVhY3Rpb246IFBhcnRpYWw8UmVhY3Rpb25UeXBlPiA9IHt9KTogdm9pZCB7XG4gICAgbm90aWZpY2F0aW9uU2VydmljZS5yZW1vdmVCeSh7XG4gICAgICAuLi5yZWFjdGlvbixcbiAgICAgIG1lc3NhZ2VJZDogdGhpcy5pZCxcbiAgICB9KTtcbiAgfVxufVxuXG53aW5kb3cuV2hpc3Blci5NZXNzYWdlID0gTWVzc2FnZU1vZGVsO1xuXG53aW5kb3cuV2hpc3Blci5NZXNzYWdlLmdldExvbmdNZXNzYWdlQXR0YWNobWVudCA9ICh7XG4gIGJvZHksXG4gIGF0dGFjaG1lbnRzLFxuICBub3csXG59KSA9PiB7XG4gIGlmICghYm9keSB8fCBib2R5Lmxlbmd0aCA8PSAyMDQ4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJvZHksXG4gICAgICBhdHRhY2htZW50cyxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IEJ5dGVzLmZyb21TdHJpbmcoYm9keSk7XG4gIGNvbnN0IGF0dGFjaG1lbnQgPSB7XG4gICAgY29udGVudFR5cGU6IE1JTUUuTE9OR19NRVNTQUdFLFxuICAgIGZpbGVOYW1lOiBgbG9uZy1tZXNzYWdlLSR7bm93fS50eHRgLFxuICAgIGRhdGEsXG4gICAgc2l6ZTogZGF0YS5ieXRlTGVuZ3RoLFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYm9keTogYm9keS5zbGljZSgwLCAyMDQ4KSxcbiAgICBhdHRhY2htZW50czogW2F0dGFjaG1lbnQsIC4uLmF0dGFjaG1lbnRzXSxcbiAgfTtcbn07XG5cbndpbmRvdy5XaGlzcGVyLk1lc3NhZ2VDb2xsZWN0aW9uID0gd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2UsXG4gIGNvbXBhcmF0b3IobGVmdDogUmVhZG9ubHk8TWVzc2FnZU1vZGVsPiwgcmlnaHQ6IFJlYWRvbmx5PE1lc3NhZ2VNb2RlbD4pIHtcbiAgICBpZiAobGVmdC5nZXQoJ3JlY2VpdmVkX2F0JykgPT09IHJpZ2h0LmdldCgncmVjZWl2ZWRfYXQnKSkge1xuICAgICAgcmV0dXJuIChsZWZ0LmdldCgnc2VudF9hdCcpIHx8IDApIC0gKHJpZ2h0LmdldCgnc2VudF9hdCcpIHx8IDApO1xuICAgIH1cblxuICAgIHJldHVybiAobGVmdC5nZXQoJ3JlY2VpdmVkX2F0JykgfHwgMCkgLSAocmlnaHQuZ2V0KCdyZWNlaXZlZF9hdCcpIHx8IDApO1xuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXNFO0FBUXRFLHVCQU9PO0FBR1Asc0JBQXlCO0FBQ3pCLDRCQUErQjtBQUMvQixvQkFBeUM7QUFDekMsOEJBQWlDO0FBQ2pDLHNCQUF5QjtBQU16QixpQ0FBMkM7QUFPM0Msb0JBQXNDO0FBQ3RDLHNCQUFpQztBQUNqQywyQkFBaUM7QUFHakMsa0JBQStCO0FBQy9CLG1CQUE4QjtBQUM5QixlQUEwQjtBQUMxQixhQUF3QjtBQUN4QixzQkFBaUM7QUFLakMsd0JBQWlDO0FBQ2pDLGlCQUE0QjtBQUM1QixrQkFBaUM7QUFDakMsV0FBc0I7QUFDdEIsa0JBQTZCO0FBQzdCLCtCQUEyQjtBQUUzQiw4QkFPTztBQUNQLHFDQUF3QztBQUN4Qyx5Q0FBNEM7QUFDNUMsb0JBQXVCO0FBQ3ZCLDRCQUFxQztBQUNyQyw2QkFBZ0M7QUFDaEMsb0NBTU87QUFDUCwrQkFBa0M7QUFDbEMsNEJBQStCO0FBQy9CLGtDQUFxQztBQUNyQyxxQkF5Qk87QUFDUCxxQkFJTztBQUNQLHNCQUFtQztBQUNuQywyQkFBNEM7QUFDNUMsNkJBR087QUFDUCxxQkFBd0I7QUFFeEIsdUJBQTBCO0FBQzFCLDRCQUErQjtBQUMvQix1QkFBMEI7QUFDMUIsdUJBQTBCO0FBQzFCLCtCQUFrQztBQUNsQyxrQkFBNkI7QUFDN0Isc0JBQXVDO0FBQ3ZDLGtDQUdPO0FBQ1AsMkJBQW9DO0FBRXBDLFVBQXFCO0FBQ3JCLFlBQXVCO0FBQ3ZCLG9CQUE0QjtBQUM1QixxQkFBa0Q7QUFDbEQscUJBT087QUFFUCxrQ0FBcUM7QUFDckMsMEJBQXVDO0FBQ3ZDLG9DQUF1QztBQUN2QyxzQ0FBeUM7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
