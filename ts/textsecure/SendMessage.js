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
var SendMessage_exports = {};
__export(SendMessage_exports, {
  default: () => MessageSender,
  singleProtoJobDataSchema: () => singleProtoJobDataSchema
});
module.exports = __toCommonJS(SendMessage_exports);
var import_zod = require("zod");
var import_long = __toESM(require("long"));
var import_p_queue = __toESM(require("p-queue"));
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_SignalProtocolStore = require("../SignalProtocolStore");
var import_assert = require("../util/assert");
var import_parseIntOrThrow = require("../util/parseIntOrThrow");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_LibSignalStores = require("../LibSignalStores");
var import_MIME = require("../types/MIME");
var import_TaskWithTimeout = __toESM(require("./TaskWithTimeout"));
var import_OutgoingMessage = __toESM(require("./OutgoingMessage"));
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var import_Errors = require("./Errors");
var import_iterables = require("../util/iterables");
var import_handleMessageSend = require("../util/handleMessageSend");
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var import_EmbeddedContact = require("../types/EmbeddedContact");
const singleProtoJobDataSchema = import_zod.z.object({
  contentHint: import_zod.z.number(),
  identifier: import_zod.z.string(),
  isSyncMessage: import_zod.z.boolean(),
  messageIds: import_zod.z.array(import_zod.z.string()).optional(),
  protoBase64: import_zod.z.string(),
  type: import_handleMessageSend.sendTypesEnum,
  urgent: import_zod.z.boolean().optional()
});
function makeAttachmentSendReady(attachment) {
  const { data } = attachment;
  if (!data) {
    throw new Error("makeAttachmentSendReady: Missing data, returning undefined");
  }
  return {
    ...attachment,
    contentType: (0, import_MIME.MIMETypeToString)(attachment.contentType),
    data
  };
}
class Message {
  constructor(options) {
    this.attachmentPointers = [];
    this.attachments = options.attachments || [];
    this.body = options.body;
    this.contact = options.contact;
    this.expireTimer = options.expireTimer;
    this.flags = options.flags;
    this.group = options.group;
    this.groupV2 = options.groupV2;
    this.needsSync = options.needsSync;
    this.preview = options.preview;
    this.profileKey = options.profileKey;
    this.quote = options.quote;
    this.recipients = options.recipients;
    this.sticker = options.sticker;
    this.reaction = options.reaction;
    this.timestamp = options.timestamp;
    this.deletedForEveryoneTimestamp = options.deletedForEveryoneTimestamp;
    this.mentions = options.mentions;
    this.groupCallUpdate = options.groupCallUpdate;
    this.storyContext = options.storyContext;
    if (!(this.recipients instanceof Array)) {
      throw new Error("Invalid recipient list");
    }
    if (!this.group && !this.groupV2 && this.recipients.length !== 1) {
      throw new Error("Invalid recipient list for non-group");
    }
    if (typeof this.timestamp !== "number") {
      throw new Error("Invalid timestamp");
    }
    if (this.expireTimer !== void 0 && this.expireTimer !== null) {
      if (typeof this.expireTimer !== "number" || !(this.expireTimer >= 0)) {
        throw new Error("Invalid expireTimer");
      }
    }
    if (this.attachments) {
      if (!(this.attachments instanceof Array)) {
        throw new Error("Invalid message attachments");
      }
    }
    if (this.flags !== void 0) {
      if (typeof this.flags !== "number") {
        throw new Error("Invalid message flags");
      }
    }
    if (this.isEndSession()) {
      if (this.body !== null || this.group !== null || this.attachments.length !== 0) {
        throw new Error("Invalid end session message");
      }
    } else {
      if (typeof this.timestamp !== "number" || this.body && typeof this.body !== "string") {
        throw new Error("Invalid message body");
      }
      if (this.group) {
        if (typeof this.group.id !== "string" || typeof this.group.type !== "number") {
          throw new Error("Invalid group context");
        }
      }
    }
  }
  isEndSession() {
    return (this.flags || 0) & import_protobuf.SignalService.DataMessage.Flags.END_SESSION;
  }
  toProto() {
    if (this.dataMessage) {
      return this.dataMessage;
    }
    const proto = new import_protobuf.SignalService.DataMessage();
    proto.timestamp = import_long.default.fromNumber(this.timestamp);
    proto.attachments = this.attachmentPointers;
    if (this.body) {
      proto.body = this.body;
      const mentionCount = this.mentions ? this.mentions.length : 0;
      const placeholders = this.body.match(/\uFFFC/g);
      const placeholderCount = placeholders ? placeholders.length : 0;
      log.info(`Sending a message with ${mentionCount} mentions and ${placeholderCount} placeholders`);
    }
    if (this.flags) {
      proto.flags = this.flags;
    }
    if (this.groupV2) {
      proto.groupV2 = new import_protobuf.SignalService.GroupContextV2();
      proto.groupV2.masterKey = this.groupV2.masterKey;
      proto.groupV2.revision = this.groupV2.revision;
      proto.groupV2.groupChange = this.groupV2.groupChange || null;
    } else if (this.group) {
      proto.group = new import_protobuf.SignalService.GroupContext();
      proto.group.id = Bytes.fromString(this.group.id);
      proto.group.type = this.group.type;
    }
    if (this.sticker) {
      proto.sticker = new import_protobuf.SignalService.DataMessage.Sticker();
      proto.sticker.packId = Bytes.fromHex(this.sticker.packId);
      proto.sticker.packKey = Bytes.fromBase64(this.sticker.packKey);
      proto.sticker.stickerId = this.sticker.stickerId;
      proto.sticker.emoji = this.sticker.emoji;
      if (this.sticker.attachmentPointer) {
        proto.sticker.data = this.sticker.attachmentPointer;
      }
    }
    if (this.reaction) {
      proto.reaction = new import_protobuf.SignalService.DataMessage.Reaction();
      proto.reaction.emoji = this.reaction.emoji || null;
      proto.reaction.remove = this.reaction.remove || false;
      proto.reaction.targetAuthorUuid = this.reaction.targetAuthorUuid || null;
      proto.reaction.targetTimestamp = this.reaction.targetTimestamp === void 0 ? null : import_long.default.fromNumber(this.reaction.targetTimestamp);
    }
    if (Array.isArray(this.preview)) {
      proto.preview = this.preview.map((preview) => {
        const item = new import_protobuf.SignalService.DataMessage.Preview();
        item.title = preview.title;
        item.url = preview.url;
        item.description = preview.description || null;
        item.date = preview.date || null;
        if (preview.attachmentPointer) {
          item.image = preview.attachmentPointer;
        }
        return item;
      });
    }
    if (Array.isArray(this.contact)) {
      proto.contact = this.contact.map((contact) => {
        const contactProto = new import_protobuf.SignalService.DataMessage.Contact();
        if (contact.name) {
          const nameProto = {
            givenName: contact.name.givenName,
            familyName: contact.name.familyName,
            prefix: contact.name.prefix,
            suffix: contact.name.suffix,
            middleName: contact.name.middleName,
            displayName: contact.name.displayName
          };
          contactProto.name = new import_protobuf.SignalService.DataMessage.Contact.Name(nameProto);
        }
        if (Array.isArray(contact.number)) {
          contactProto.number = contact.number.map((number) => {
            const numberProto = {
              value: number.value,
              type: (0, import_EmbeddedContact.numberToPhoneType)(number.type),
              label: number.label
            };
            return new import_protobuf.SignalService.DataMessage.Contact.Phone(numberProto);
          });
        }
        if (Array.isArray(contact.email)) {
          contactProto.email = contact.email.map((email) => {
            const emailProto = {
              value: email.value,
              type: (0, import_EmbeddedContact.numberToEmailType)(email.type),
              label: email.label
            };
            return new import_protobuf.SignalService.DataMessage.Contact.Email(emailProto);
          });
        }
        if (Array.isArray(contact.address)) {
          contactProto.address = contact.address.map((address) => {
            const addressProto = {
              type: (0, import_EmbeddedContact.numberToAddressType)(address.type),
              label: address.label,
              street: address.street,
              pobox: address.pobox,
              neighborhood: address.neighborhood,
              city: address.city,
              region: address.region,
              postcode: address.postcode,
              country: address.country
            };
            return new import_protobuf.SignalService.DataMessage.Contact.PostalAddress(addressProto);
          });
        }
        if (contact.avatar && contact.avatar.attachmentPointer) {
          const avatarProto = new import_protobuf.SignalService.DataMessage.Contact.Avatar();
          avatarProto.avatar = contact.avatar.attachmentPointer;
          avatarProto.isProfile = Boolean(contact.avatar.isProfile);
          contactProto.avatar = avatarProto;
        }
        if (contact.organization) {
          contactProto.organization = contact.organization;
        }
        return contactProto;
      });
    }
    if (this.quote) {
      const { QuotedAttachment } = import_protobuf.SignalService.DataMessage.Quote;
      const { BodyRange, Quote } = import_protobuf.SignalService.DataMessage;
      proto.quote = new Quote();
      const { quote } = proto;
      if (this.quote.isGiftBadge) {
        quote.type = import_protobuf.SignalService.DataMessage.Quote.Type.GIFT_BADGE;
      } else {
        quote.type = import_protobuf.SignalService.DataMessage.Quote.Type.NORMAL;
      }
      quote.id = this.quote.id === void 0 ? null : import_long.default.fromNumber(this.quote.id);
      quote.authorUuid = this.quote.authorUuid || null;
      quote.text = this.quote.text || null;
      quote.attachments = (this.quote.attachments || []).map((attachment) => {
        const quotedAttachment = new QuotedAttachment();
        quotedAttachment.contentType = attachment.contentType;
        if (attachment.fileName) {
          quotedAttachment.fileName = attachment.fileName;
        }
        if (attachment.attachmentPointer) {
          quotedAttachment.thumbnail = attachment.attachmentPointer;
        }
        return quotedAttachment;
      });
      const bodyRanges = this.quote.bodyRanges || [];
      quote.bodyRanges = bodyRanges.map((range) => {
        const bodyRange = new BodyRange();
        bodyRange.start = range.start;
        bodyRange.length = range.length;
        if (range.mentionUuid !== void 0) {
          bodyRange.mentionUuid = range.mentionUuid;
        }
        return bodyRange;
      });
      if (quote.bodyRanges.length && (!proto.requiredProtocolVersion || proto.requiredProtocolVersion < import_protobuf.SignalService.DataMessage.ProtocolVersion.MENTIONS)) {
        proto.requiredProtocolVersion = import_protobuf.SignalService.DataMessage.ProtocolVersion.MENTIONS;
      }
    }
    if (this.expireTimer) {
      proto.expireTimer = this.expireTimer;
    }
    if (this.profileKey) {
      proto.profileKey = this.profileKey;
    }
    if (this.deletedForEveryoneTimestamp) {
      proto.delete = {
        targetSentTimestamp: import_long.default.fromNumber(this.deletedForEveryoneTimestamp)
      };
    }
    if (this.mentions) {
      proto.requiredProtocolVersion = import_protobuf.SignalService.DataMessage.ProtocolVersion.MENTIONS;
      proto.bodyRanges = this.mentions.map(({ start, length, mentionUuid }) => ({
        start,
        length,
        mentionUuid
      }));
    }
    if (this.groupCallUpdate) {
      const { GroupCallUpdate } = import_protobuf.SignalService.DataMessage;
      const groupCallUpdate = new GroupCallUpdate();
      groupCallUpdate.eraId = this.groupCallUpdate.eraId;
      proto.groupCallUpdate = groupCallUpdate;
    }
    if (this.storyContext) {
      const { StoryContext } = import_protobuf.SignalService.DataMessage;
      const storyContext = new StoryContext();
      if (this.storyContext.authorUuid) {
        storyContext.authorUuid = this.storyContext.authorUuid;
      }
      storyContext.sentTimestamp = import_long.default.fromNumber(this.storyContext.timestamp);
      proto.storyContext = storyContext;
    }
    this.dataMessage = proto;
    return proto;
  }
  encode() {
    return import_protobuf.SignalService.DataMessage.encode(this.toProto()).finish();
  }
}
class MessageSender {
  constructor(server) {
    this.server = server;
    this.pendingMessages = {};
  }
  async queueJobForIdentifier(identifier, runJob) {
    const { id } = await window.ConversationController.getOrCreateAndWait(identifier, "private");
    this.pendingMessages[id] = this.pendingMessages[id] || new import_p_queue.default({ concurrency: 1 });
    const queue = this.pendingMessages[id];
    const taskWithTimeout = (0, import_TaskWithTimeout.default)(runJob, `queueJobForIdentifier ${identifier} ${id}`);
    return queue.add(taskWithTimeout);
  }
  _getAttachmentSizeBucket(size) {
    return Math.max(541, Math.floor(1.05 ** Math.ceil(Math.log(size) / Math.log(1.05))));
  }
  static getRandomPadding() {
    const buffer = (0, import_Crypto.getRandomBytes)(2);
    const paddingLength = (new Uint16Array(buffer)[0] & 511) + 1;
    return (0, import_Crypto.getRandomBytes)(paddingLength);
  }
  getPaddedAttachment(data) {
    const size = data.byteLength;
    const paddedSize = this._getAttachmentSizeBucket(size);
    const padding = (0, import_Crypto.getZeroes)(paddedSize - size);
    return Bytes.concatenate([data, padding]);
  }
  async makeAttachmentPointer(attachment) {
    (0, import_assert.assert)(typeof attachment === "object" && attachment !== null, "Got null attachment in `makeAttachmentPointer`");
    const { data, size, contentType } = attachment;
    if (!(data instanceof Uint8Array)) {
      throw new Error(`makeAttachmentPointer: data was a '${typeof data}' instead of Uint8Array`);
    }
    if (data.byteLength !== size) {
      throw new Error(`makeAttachmentPointer: Size ${size} did not match data.byteLength ${data.byteLength}`);
    }
    if (typeof contentType !== "string") {
      throw new Error(`makeAttachmentPointer: contentType ${contentType} was not a string`);
    }
    const padded = this.getPaddedAttachment(data);
    const key = (0, import_Crypto.getRandomBytes)(64);
    const iv = (0, import_Crypto.getRandomBytes)(16);
    const result = (0, import_Crypto.encryptAttachment)(padded, key, iv);
    const id = await this.server.putAttachment(result.ciphertext);
    const proto = new import_protobuf.SignalService.AttachmentPointer();
    proto.cdnId = import_long.default.fromString(id);
    proto.contentType = attachment.contentType;
    proto.key = key;
    proto.size = data.byteLength;
    proto.digest = result.digest;
    if (attachment.fileName) {
      proto.fileName = attachment.fileName;
    }
    if (attachment.flags) {
      proto.flags = attachment.flags;
    }
    if (attachment.width) {
      proto.width = attachment.width;
    }
    if (attachment.height) {
      proto.height = attachment.height;
    }
    if (attachment.caption) {
      proto.caption = attachment.caption;
    }
    if (attachment.blurHash) {
      proto.blurHash = attachment.blurHash;
    }
    return proto;
  }
  async uploadAttachments(message2) {
    try {
      message2.attachmentPointers = await Promise.all(message2.attachments.map((attachment) => this.makeAttachmentPointer(attachment)));
    } catch (error) {
      if (error instanceof import_Errors.HTTPError) {
        throw new import_Errors.MessageError(message2, error);
      } else {
        throw error;
      }
    }
  }
  async uploadLinkPreviews(message2) {
    try {
      const preview = await Promise.all((message2.preview || []).map(async (item) => {
        if (!item.image) {
          return item;
        }
        const attachment = makeAttachmentSendReady(item.image);
        if (!attachment) {
          return item;
        }
        return {
          ...item,
          attachmentPointer: await this.makeAttachmentPointer(attachment)
        };
      }));
      message2.preview = preview;
    } catch (error) {
      if (error instanceof import_Errors.HTTPError) {
        throw new import_Errors.MessageError(message2, error);
      } else {
        throw error;
      }
    }
  }
  async uploadSticker(message2) {
    try {
      const { sticker } = message2;
      if (!sticker) {
        return;
      }
      if (!sticker.data) {
        throw new Error("uploadSticker: No sticker data to upload!");
      }
      message2.sticker = {
        ...sticker,
        attachmentPointer: await this.makeAttachmentPointer(sticker.data)
      };
    } catch (error) {
      if (error instanceof import_Errors.HTTPError) {
        throw new import_Errors.MessageError(message2, error);
      } else {
        throw error;
      }
    }
  }
  async uploadContactAvatar(message2) {
    const { contact } = message2;
    if (!contact || contact.length === 0) {
      return;
    }
    try {
      await Promise.all(contact.map(async (item) => {
        const itemAvatar = item?.avatar;
        const avatar = itemAvatar?.avatar;
        if (!itemAvatar || !avatar || !avatar.data) {
          return;
        }
        const attachment = makeAttachmentSendReady(avatar);
        if (!attachment) {
          return;
        }
        itemAvatar.attachmentPointer = await this.makeAttachmentPointer(attachment);
      }));
    } catch (error) {
      if (error instanceof import_Errors.HTTPError) {
        throw new import_Errors.MessageError(message2, error);
      } else {
        throw error;
      }
    }
  }
  async uploadThumbnails(message2) {
    const { quote } = message2;
    if (!quote || !quote.attachments || quote.attachments.length === 0) {
      return;
    }
    try {
      await Promise.all(quote.attachments.map(async (attachment) => {
        if (!attachment.thumbnail) {
          return;
        }
        attachment.attachmentPointer = await this.makeAttachmentPointer(attachment.thumbnail);
      }));
    } catch (error) {
      if (error instanceof import_Errors.HTTPError) {
        throw new import_Errors.MessageError(message2, error);
      } else {
        throw error;
      }
    }
  }
  async getTextAttachmentProto(attachmentAttrs) {
    const textAttachment = new import_protobuf.SignalService.TextAttachment();
    if (attachmentAttrs.text) {
      textAttachment.text = attachmentAttrs.text;
    }
    textAttachment.textStyle = attachmentAttrs.textStyle ? Number(attachmentAttrs.textStyle) : 0;
    if (attachmentAttrs.textForegroundColor) {
      textAttachment.textForegroundColor = attachmentAttrs.textForegroundColor;
    }
    if (attachmentAttrs.textBackgroundColor) {
      textAttachment.textBackgroundColor = attachmentAttrs.textBackgroundColor;
    }
    if (attachmentAttrs.preview) {
      const previewImage = attachmentAttrs.preview.image;
      const image = previewImage && previewImage.data ? await this.makeAttachmentPointer(previewImage) : void 0;
      textAttachment.preview = {
        image,
        title: attachmentAttrs.preview.title,
        url: attachmentAttrs.preview.url
      };
    }
    if (attachmentAttrs.gradient) {
      textAttachment.gradient = attachmentAttrs.gradient;
      textAttachment.background = "gradient";
    } else {
      textAttachment.color = attachmentAttrs.color;
      textAttachment.background = "color";
    }
    return textAttachment;
  }
  async getDataMessage(options) {
    const message2 = await this.getHydratedMessage(options);
    return message2.encode();
  }
  async getStoryMessage({
    allowsReplies,
    fileAttachment,
    groupV2,
    profileKey,
    textAttachment
  }) {
    const storyMessage = new import_protobuf.SignalService.StoryMessage();
    storyMessage.profileKey = profileKey;
    if (fileAttachment) {
      try {
        const attachmentPointer = await this.makeAttachmentPointer(fileAttachment);
        storyMessage.fileAttachment = attachmentPointer;
      } catch (error) {
        if (error instanceof import_Errors.HTTPError) {
          throw new import_Errors.MessageError(message, error);
        } else {
          throw error;
        }
      }
    }
    if (textAttachment) {
      storyMessage.textAttachment = await this.getTextAttachmentProto(textAttachment);
    }
    if (groupV2) {
      const groupV2Context = new import_protobuf.SignalService.GroupContextV2();
      groupV2Context.masterKey = groupV2.masterKey;
      groupV2Context.revision = groupV2.revision;
      if (groupV2.groupChange) {
        groupV2Context.groupChange = groupV2.groupChange;
      }
      storyMessage.group = groupV2Context;
    }
    storyMessage.allowsReplies = Boolean(allowsReplies);
    return storyMessage;
  }
  async getContentMessage(options) {
    const message2 = await this.getHydratedMessage(options);
    const dataMessage = message2.toProto();
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.dataMessage = dataMessage;
    return contentMessage;
  }
  async getHydratedMessage(attributes) {
    const message2 = new Message(attributes);
    await Promise.all([
      this.uploadAttachments(message2),
      this.uploadContactAvatar(message2),
      this.uploadThumbnails(message2),
      this.uploadLinkPreviews(message2),
      this.uploadSticker(message2)
    ]);
    return message2;
  }
  getTypingContentMessage(options) {
    const ACTION_ENUM = import_protobuf.SignalService.TypingMessage.Action;
    const { recipientId, groupId, isTyping, timestamp } = options;
    if (!recipientId && !groupId) {
      throw new Error("getTypingContentMessage: Need to provide either recipientId or groupId!");
    }
    const finalTimestamp = timestamp || Date.now();
    const action = isTyping ? ACTION_ENUM.STARTED : ACTION_ENUM.STOPPED;
    const typingMessage = new import_protobuf.SignalService.TypingMessage();
    if (groupId) {
      typingMessage.groupId = groupId;
    }
    typingMessage.action = action;
    typingMessage.timestamp = import_long.default.fromNumber(finalTimestamp);
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.typingMessage = typingMessage;
    return contentMessage;
  }
  getAttrsFromGroupOptions(options) {
    const {
      attachments,
      contact,
      deletedForEveryoneTimestamp,
      expireTimer,
      flags,
      groupCallUpdate,
      groupV1,
      groupV2,
      mentions,
      messageText,
      preview,
      profileKey,
      quote,
      reaction,
      sticker,
      storyContext,
      timestamp
    } = options;
    if (!groupV1 && !groupV2) {
      throw new Error("getAttrsFromGroupOptions: Neither group1 nor groupv2 information provided!");
    }
    const myE164 = window.textsecure.storage.user.getNumber();
    const myUuid = window.textsecure.storage.user.getUuid()?.toString();
    const groupMembers = groupV2?.members || groupV1?.members || [];
    let isNotMe;
    if (myUuid) {
      isNotMe = /* @__PURE__ */ __name((r) => r !== myE164 && r !== myUuid.toString(), "isNotMe");
    } else {
      isNotMe = /* @__PURE__ */ __name((r) => r !== myE164, "isNotMe");
    }
    const blockedIdentifiers = new Set((0, import_iterables.concat)(window.storage.blocked.getBlockedUuids(), window.storage.blocked.getBlockedNumbers()));
    const recipients = groupMembers.filter((recipient) => isNotMe(recipient) && !blockedIdentifiers.has(recipient));
    return {
      attachments,
      body: messageText,
      contact,
      deletedForEveryoneTimestamp,
      expireTimer,
      flags,
      groupCallUpdate,
      groupV2,
      group: groupV1 ? {
        id: groupV1.id,
        type: import_protobuf.SignalService.GroupContext.Type.DELIVER
      } : void 0,
      mentions,
      preview,
      profileKey,
      quote,
      reaction,
      recipients,
      sticker,
      storyContext,
      timestamp
    };
  }
  static createSyncMessage() {
    const syncMessage = new import_protobuf.SignalService.SyncMessage();
    syncMessage.padding = this.getRandomPadding();
    return syncMessage;
  }
  async sendMessage({
    messageOptions,
    contentHint,
    groupId,
    options,
    urgent
  }) {
    const message2 = await this.getHydratedMessage(messageOptions);
    return new Promise((resolve, reject) => {
      this.sendMessageProto({
        callback: (res) => {
          if (res.errors && res.errors.length > 0) {
            reject(new import_Errors.SendMessageProtoError(res));
          } else {
            resolve(res);
          }
        },
        contentHint,
        groupId,
        options,
        proto: message2.toProto(),
        recipients: message2.recipients || [],
        timestamp: message2.timestamp,
        urgent
      });
    });
  }
  sendMessageProto({
    callback,
    contentHint,
    groupId,
    options,
    proto,
    recipients,
    sendLogCallback,
    timestamp,
    urgent
  }) {
    const rejections = window.textsecure.storage.get("signedKeyRotationRejected", 0);
    if (rejections > 5) {
      throw new import_Errors.SignedPreKeyRotationError();
    }
    const outgoing = new import_OutgoingMessage.default({
      callback,
      contentHint,
      groupId,
      identifiers: recipients,
      message: proto,
      options,
      sendLogCallback,
      server: this.server,
      timestamp,
      urgent
    });
    recipients.forEach((identifier) => {
      this.queueJobForIdentifier(identifier, async () => outgoing.sendToIdentifier(identifier));
    });
  }
  async sendMessageProtoAndWait({
    timestamp,
    recipients,
    proto,
    contentHint,
    groupId,
    options,
    urgent
  }) {
    return new Promise((resolve, reject) => {
      const callback = /* @__PURE__ */ __name((result) => {
        if (result && result.errors && result.errors.length > 0) {
          reject(new import_Errors.SendMessageProtoError(result));
          return;
        }
        resolve(result);
      }, "callback");
      this.sendMessageProto({
        callback,
        contentHint,
        groupId,
        options,
        proto,
        recipients,
        timestamp,
        urgent
      });
    });
  }
  async sendIndividualProto({
    contentHint,
    groupId,
    identifier,
    options,
    proto,
    timestamp,
    urgent
  }) {
    (0, import_assert.assert)(identifier, "Identifier can't be undefined");
    return new Promise((resolve, reject) => {
      const callback = /* @__PURE__ */ __name((res) => {
        if (res && res.errors && res.errors.length > 0) {
          reject(new import_Errors.SendMessageProtoError(res));
        } else {
          resolve(res);
        }
      }, "callback");
      this.sendMessageProto({
        callback,
        contentHint,
        groupId,
        options,
        proto,
        recipients: [identifier],
        timestamp,
        urgent
      });
    });
  }
  async sendMessageToIdentifier({
    attachments,
    contact,
    contentHint,
    deletedForEveryoneTimestamp,
    expireTimer,
    groupId,
    identifier,
    messageText,
    options,
    preview,
    profileKey,
    quote,
    reaction,
    sticker,
    storyContext,
    timestamp,
    urgent
  }) {
    return this.sendMessage({
      messageOptions: {
        attachments,
        body: messageText,
        contact,
        deletedForEveryoneTimestamp,
        expireTimer,
        preview,
        profileKey,
        quote,
        reaction,
        recipients: [identifier],
        sticker,
        storyContext,
        timestamp
      },
      contentHint,
      groupId,
      options,
      urgent
    });
  }
  async sendSyncMessage({
    encodedDataMessage,
    timestamp,
    destination,
    destinationUuid,
    expirationStartTimestamp,
    conversationIdsSentTo = [],
    conversationIdsWithSealedSender = /* @__PURE__ */ new Set(),
    isUpdate,
    urgent,
    options,
    storyMessage,
    storyMessageRecipients
  }) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const sentMessage = new import_protobuf.SignalService.SyncMessage.Sent();
    sentMessage.timestamp = import_long.default.fromNumber(timestamp);
    if (encodedDataMessage) {
      const dataMessage = import_protobuf.SignalService.DataMessage.decode(encodedDataMessage);
      sentMessage.message = dataMessage;
    }
    if (destination) {
      sentMessage.destination = destination;
    }
    if (destinationUuid) {
      sentMessage.destinationUuid = destinationUuid;
    }
    if (expirationStartTimestamp) {
      sentMessage.expirationStartTimestamp = import_long.default.fromNumber(expirationStartTimestamp);
    }
    if (storyMessage) {
      sentMessage.storyMessage = storyMessage;
    }
    if (storyMessageRecipients) {
      sentMessage.storyMessageRecipients = storyMessageRecipients.map((recipient) => {
        const storyMessageRecipient = new import_protobuf.SignalService.SyncMessage.Sent.StoryMessageRecipient();
        storyMessageRecipient.destinationUuid = recipient.destinationUuid;
        storyMessageRecipient.distributionListIds = recipient.distributionListIds;
        storyMessageRecipient.isAllowedToReply = recipient.isAllowedToReply;
        return storyMessageRecipient;
      });
    }
    if (isUpdate) {
      sentMessage.isRecipientUpdate = true;
    }
    if (!(0, import_iterables.isEmpty)(conversationIdsSentTo)) {
      sentMessage.unidentifiedStatus = [
        ...(0, import_iterables.map)(conversationIdsSentTo, (conversationId) => {
          const status = new import_protobuf.SignalService.SyncMessage.Sent.UnidentifiedDeliveryStatus();
          const conv = window.ConversationController.get(conversationId);
          if (conv) {
            const e164 = conv.get("e164");
            if (e164) {
              status.destination = e164;
            }
            const uuid = conv.get("uuid");
            if (uuid) {
              status.destinationUuid = uuid;
            }
          }
          status.unidentified = conversationIdsWithSealedSender.has(conversationId);
          return status;
        })
      ];
    }
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.sent = sentMessage;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendIndividualProto({
      identifier: myUuid.toString(),
      proto: contentMessage,
      timestamp,
      contentHint: ContentHint.RESENDABLE,
      options,
      urgent
    });
  }
  static getRequestBlockSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.BLOCKED;
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "blockSyncRequest",
      urgent: false
    };
  }
  static getRequestConfigurationSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.CONFIGURATION;
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "configurationSyncRequest",
      urgent: false
    };
  }
  static getRequestGroupSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.GROUPS;
    const syncMessage = this.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "groupSyncRequest",
      urgent: false
    };
  }
  static getRequestContactSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.CONTACTS;
    const syncMessage = this.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "contactSyncRequest",
      urgent: true
    };
  }
  static getRequestPniIdentitySyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.PNI_IDENTITY;
    const syncMessage = this.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "pniIdentitySyncRequest",
      urgent: true
    };
  }
  static getFetchManifestSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const fetchLatest = new import_protobuf.SignalService.SyncMessage.FetchLatest();
    fetchLatest.type = import_protobuf.SignalService.SyncMessage.FetchLatest.Type.STORAGE_MANIFEST;
    const syncMessage = this.createSyncMessage();
    syncMessage.fetchLatest = fetchLatest;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "fetchLatestManifestSync",
      urgent: false
    };
  }
  static getFetchLocalProfileSyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const fetchLatest = new import_protobuf.SignalService.SyncMessage.FetchLatest();
    fetchLatest.type = import_protobuf.SignalService.SyncMessage.FetchLatest.Type.LOCAL_PROFILE;
    const syncMessage = this.createSyncMessage();
    syncMessage.fetchLatest = fetchLatest;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "fetchLocalProfileSync",
      urgent: false
    };
  }
  static getRequestKeySyncMessage() {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const request = new import_protobuf.SignalService.SyncMessage.Request();
    request.type = import_protobuf.SignalService.SyncMessage.Request.Type.KEYS;
    const syncMessage = this.createSyncMessage();
    syncMessage.request = request;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "keySyncRequest",
      urgent: true
    };
  }
  async syncReadMessages(reads, options) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.read = [];
    for (let i = 0; i < reads.length; i += 1) {
      const proto = new import_protobuf.SignalService.SyncMessage.Read({
        ...reads[i],
        timestamp: import_long.default.fromNumber(reads[i].timestamp)
      });
      syncMessage.read.push(proto);
    }
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendIndividualProto({
      identifier: myUuid.toString(),
      proto: contentMessage,
      timestamp: Date.now(),
      contentHint: ContentHint.RESENDABLE,
      options,
      urgent: true
    });
  }
  async syncView(views, options) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.viewed = views.map((view) => new import_protobuf.SignalService.SyncMessage.Viewed({
      ...view,
      timestamp: import_long.default.fromNumber(view.timestamp)
    }));
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendIndividualProto({
      identifier: myUuid.toString(),
      proto: contentMessage,
      timestamp: Date.now(),
      contentHint: ContentHint.RESENDABLE,
      options,
      urgent: false
    });
  }
  async syncViewOnceOpen(viewOnceOpens, options) {
    if (viewOnceOpens.length !== 1) {
      throw new Error(`syncViewOnceOpen: ${viewOnceOpens.length} opens provided. Can only handle one.`);
    }
    const { senderE164, senderUuid, timestamp } = viewOnceOpens[0];
    if (!senderUuid) {
      throw new Error("syncViewOnceOpen: Missing senderUuid");
    }
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const syncMessage = MessageSender.createSyncMessage();
    const viewOnceOpen = new import_protobuf.SignalService.SyncMessage.ViewOnceOpen();
    if (senderE164 !== void 0) {
      viewOnceOpen.sender = senderE164;
    }
    viewOnceOpen.senderUuid = senderUuid;
    viewOnceOpen.timestamp = import_long.default.fromNumber(timestamp);
    syncMessage.viewOnceOpen = viewOnceOpen;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendIndividualProto({
      identifier: myUuid.toString(),
      proto: contentMessage,
      timestamp: Date.now(),
      contentHint: ContentHint.RESENDABLE,
      options,
      urgent: false
    });
  }
  static getMessageRequestResponseSync(options) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const syncMessage = MessageSender.createSyncMessage();
    const response = new import_protobuf.SignalService.SyncMessage.MessageRequestResponse();
    if (options.threadE164 !== void 0) {
      response.threadE164 = options.threadE164;
    }
    if (options.threadUuid !== void 0) {
      response.threadUuid = options.threadUuid;
    }
    if (options.groupId) {
      response.groupId = options.groupId;
    }
    response.type = options.type;
    syncMessage.messageRequestResponse = response;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "messageRequestSync",
      urgent: false
    };
  }
  static getStickerPackSync(operations) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    const ENUM = import_protobuf.SignalService.SyncMessage.StickerPackOperation.Type;
    const packOperations = operations.map((item) => {
      const { packId, packKey, installed } = item;
      const operation = new import_protobuf.SignalService.SyncMessage.StickerPackOperation();
      operation.packId = Bytes.fromHex(packId);
      operation.packKey = Bytes.fromBase64(packKey);
      operation.type = installed ? ENUM.INSTALL : ENUM.REMOVE;
      return operation;
    });
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.stickerPackOperation = packOperations;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "stickerPackSync",
      urgent: false
    };
  }
  static getVerificationSync(destinationE164, destinationUuid, state, identityKey) {
    const myUuid = window.textsecure.storage.user.getCheckedUuid();
    if (!destinationE164 && !destinationUuid) {
      throw new Error("syncVerification: Neither e164 nor UUID were provided");
    }
    const padding = MessageSender.getRandomPadding();
    const verified = new import_protobuf.SignalService.Verified();
    verified.state = state;
    if (destinationE164) {
      verified.destination = destinationE164;
    }
    if (destinationUuid) {
      verified.destinationUuid = destinationUuid;
    }
    verified.identityKey = identityKey;
    verified.nullMessage = padding;
    const syncMessage = MessageSender.createSyncMessage();
    syncMessage.verified = verified;
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.syncMessage = syncMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier: myUuid.toString(),
      isSyncMessage: true,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "verificationSync",
      urgent: false
    };
  }
  async sendCallingMessage(recipientId, callingMessage, options) {
    const recipients = [recipientId];
    const finalTimestamp = Date.now();
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.callingMessage = callingMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendMessageProtoAndWait({
      timestamp: finalTimestamp,
      recipients,
      proto: contentMessage,
      contentHint: ContentHint.DEFAULT,
      groupId: void 0,
      options,
      urgent: true
    });
  }
  async sendDeliveryReceipt(options) {
    return this.sendReceiptMessage({
      ...options,
      type: import_protobuf.SignalService.ReceiptMessage.Type.DELIVERY
    });
  }
  async sendReadReceipt(options) {
    return this.sendReceiptMessage({
      ...options,
      type: import_protobuf.SignalService.ReceiptMessage.Type.READ
    });
  }
  async sendViewedReceipt(options) {
    return this.sendReceiptMessage({
      ...options,
      type: import_protobuf.SignalService.ReceiptMessage.Type.VIEWED
    });
  }
  async sendReceiptMessage({
    senderE164,
    senderUuid,
    timestamps,
    type,
    options
  }) {
    if (!senderUuid && !senderE164) {
      throw new Error("sendReceiptMessage: Neither uuid nor e164 was provided!");
    }
    const receiptMessage = new import_protobuf.SignalService.ReceiptMessage();
    receiptMessage.type = type;
    receiptMessage.timestamp = timestamps.map((timestamp) => import_long.default.fromNumber(timestamp));
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.receiptMessage = receiptMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendIndividualProto({
      identifier: senderUuid || senderE164,
      proto: contentMessage,
      timestamp: Date.now(),
      contentHint: ContentHint.RESENDABLE,
      options,
      urgent: false
    });
  }
  static getNullMessage({
    uuid,
    e164,
    padding
  }) {
    const nullMessage = new import_protobuf.SignalService.NullMessage();
    const identifier = uuid || e164;
    if (!identifier) {
      throw new Error("sendNullMessage: Got neither uuid nor e164!");
    }
    nullMessage.padding = padding || MessageSender.getRandomPadding();
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.nullMessage = nullMessage;
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return {
      contentHint: ContentHint.RESENDABLE,
      identifier,
      isSyncMessage: false,
      protoBase64: Bytes.toBase64(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      type: "nullMessage",
      urgent: false
    };
  }
  async sendRetryRequest({
    groupId,
    options,
    plaintext,
    uuid
  }) {
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    return this.sendMessageProtoAndWait({
      timestamp: Date.now(),
      recipients: [uuid],
      proto: plaintext,
      contentHint: ContentHint.DEFAULT,
      groupId,
      options,
      urgent: false
    });
  }
  makeSendLogCallback({
    contentHint,
    messageId,
    proto,
    sendType,
    timestamp,
    urgent
  }) {
    let initialSavePromise;
    return async ({
      identifier,
      deviceIds
    }) => {
      if (!(0, import_handleMessageSend.shouldSaveProto)(sendType)) {
        return;
      }
      const conversation = window.ConversationController.get(identifier);
      if (!conversation) {
        log.warn(`makeSendLogCallback: Unable to find conversation for identifier ${identifier}`);
        return;
      }
      const recipientUuid = conversation.get("uuid");
      if (!recipientUuid) {
        log.warn(`makeSendLogCallback: Conversation ${conversation.idForLogging()} had no UUID`);
        return;
      }
      if (!initialSavePromise) {
        initialSavePromise = window.Signal.Data.insertSentProto({
          contentHint,
          proto,
          timestamp,
          urgent
        }, {
          recipients: { [recipientUuid]: deviceIds },
          messageIds: messageId ? [messageId] : []
        });
        await initialSavePromise;
      } else {
        const id = await initialSavePromise;
        await window.Signal.Data.insertProtoRecipients({
          id,
          recipientUuid,
          deviceIds
        });
      }
    };
  }
  async sendGroupProto({
    contentHint,
    groupId,
    options,
    proto,
    recipients,
    sendLogCallback,
    timestamp = Date.now(),
    urgent
  }) {
    const myE164 = window.textsecure.storage.user.getNumber();
    const myUuid = window.textsecure.storage.user.getUuid()?.toString();
    const identifiers = recipients.filter((id) => id !== myE164 && id !== myUuid);
    if (identifiers.length === 0) {
      const dataMessage = proto.dataMessage ? import_protobuf.SignalService.DataMessage.encode(proto.dataMessage).finish() : void 0;
      return Promise.resolve({
        dataMessage,
        errors: [],
        failoverIdentifiers: [],
        successfulIdentifiers: [],
        unidentifiedDeliveries: [],
        contentHint,
        urgent
      });
    }
    return new Promise((resolve, reject) => {
      const callback = /* @__PURE__ */ __name((res) => {
        if (res.errors && res.errors.length > 0) {
          reject(new import_Errors.SendMessageProtoError(res));
        } else {
          resolve(res);
        }
      }, "callback");
      this.sendMessageProto({
        callback,
        contentHint,
        groupId,
        options,
        proto,
        recipients: identifiers,
        sendLogCallback,
        timestamp,
        urgent
      });
    });
  }
  async getSenderKeyDistributionMessage(distributionId, {
    throwIfNotInDatabase,
    timestamp
  }) {
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const ourDeviceId = (0, import_parseIntOrThrow.parseIntOrThrow)(window.textsecure.storage.user.getDeviceId(), "getSenderKeyDistributionMessage");
    const protocolAddress = import_libsignal_client.ProtocolAddress.new(ourUuid.toString(), ourDeviceId);
    const address = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(ourUuid, ourDeviceId));
    const senderKeyDistributionMessage = await window.textsecure.storage.protocol.enqueueSenderKeyJob(address, async () => {
      const senderKeyStore = new import_LibSignalStores.SenderKeys({ ourUuid, zone: import_SignalProtocolStore.GLOBAL_ZONE });
      if (throwIfNotInDatabase) {
        const key = await senderKeyStore.getSenderKey(protocolAddress, distributionId);
        if (!key) {
          throw new Error(`getSenderKeyDistributionMessage: Distribution ${distributionId} was not in database as expected`);
        }
      }
      return import_libsignal_client.SenderKeyDistributionMessage.create(protocolAddress, distributionId, senderKeyStore);
    });
    log.info(`getSenderKeyDistributionMessage: Building ${distributionId} with timestamp ${timestamp}`);
    const contentMessage = new import_protobuf.SignalService.Content();
    contentMessage.senderKeyDistributionMessage = senderKeyDistributionMessage.serialize();
    return contentMessage;
  }
  async sendSenderKeyDistributionMessage({
    contentHint,
    distributionId,
    groupId,
    identifiers,
    throwIfNotInDatabase,
    urgent
  }, options) {
    const timestamp = Date.now();
    const contentMessage = await this.getSenderKeyDistributionMessage(distributionId, {
      throwIfNotInDatabase,
      timestamp
    });
    const sendLogCallback = identifiers.length > 1 ? this.makeSendLogCallback({
      contentHint,
      proto: Buffer.from(import_protobuf.SignalService.Content.encode(contentMessage).finish()),
      sendType: "senderKeyDistributionMessage",
      timestamp,
      urgent
    }) : void 0;
    return this.sendGroupProto({
      contentHint,
      groupId,
      options,
      proto: contentMessage,
      recipients: identifiers,
      sendLogCallback,
      timestamp,
      urgent
    });
  }
  async leaveGroup(groupId, groupIdentifiers, options) {
    const timestamp = Date.now();
    const proto = new import_protobuf.SignalService.Content({
      dataMessage: {
        group: {
          id: Bytes.fromString(groupId),
          type: import_protobuf.SignalService.GroupContext.Type.QUIT
        }
      }
    });
    const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
    const contentHint = ContentHint.RESENDABLE;
    const sendLogCallback = groupIdentifiers.length > 1 ? this.makeSendLogCallback({
      contentHint,
      proto: Buffer.from(import_protobuf.SignalService.Content.encode(proto).finish()),
      sendType: "legacyGroupChange",
      timestamp,
      urgent: false
    }) : void 0;
    return this.sendGroupProto({
      contentHint,
      groupId: void 0,
      options,
      proto,
      recipients: groupIdentifiers,
      sendLogCallback,
      timestamp,
      urgent: false
    });
  }
  async getProfile(uuid, options) {
    if (options.accessKey !== void 0) {
      return this.server.getProfileUnauth(uuid.toString(), options);
    }
    return this.server.getProfile(uuid.toString(), options);
  }
  async checkAccountExistence(uuid) {
    return this.server.checkAccountExistence(uuid);
  }
  async getProfileForUsername(username) {
    return this.server.getProfileForUsername(username);
  }
  async getUuidsForE164s(numbers) {
    return this.server.getUuidsForE164s(numbers);
  }
  async getUuidsForE164sV2(e164s, acis, accessKeys) {
    return this.server.getUuidsForE164sV2({
      e164s,
      acis,
      accessKeys
    });
  }
  async getAvatar(path) {
    return this.server.getAvatar(path);
  }
  async getSticker(packId, stickerId) {
    return this.server.getSticker(packId, stickerId);
  }
  async getStickerPackManifest(packId) {
    return this.server.getStickerPackManifest(packId);
  }
  async createGroup(group, options) {
    return this.server.createGroup(group, options);
  }
  async uploadGroupAvatar(avatar, options) {
    return this.server.uploadGroupAvatar(avatar, options);
  }
  async getGroup(options) {
    return this.server.getGroup(options);
  }
  async getGroupFromLink(groupInviteLink, auth) {
    return this.server.getGroupFromLink(groupInviteLink, auth);
  }
  async getGroupLog(options, credentials) {
    return this.server.getGroupLog(options, credentials);
  }
  async getGroupAvatar(key) {
    return this.server.getGroupAvatar(key);
  }
  async modifyGroup(changes, options, inviteLinkBase64) {
    return this.server.modifyGroup(changes, options, inviteLinkBase64);
  }
  async fetchLinkPreviewMetadata(href, abortSignal) {
    return this.server.fetchLinkPreviewMetadata(href, abortSignal);
  }
  async fetchLinkPreviewImage(href, abortSignal) {
    return this.server.fetchLinkPreviewImage(href, abortSignal);
  }
  async makeProxiedRequest(url, options) {
    return this.server.makeProxiedRequest(url, options);
  }
  async getStorageCredentials() {
    return this.server.getStorageCredentials();
  }
  async getStorageManifest(options) {
    return this.server.getStorageManifest(options);
  }
  async getStorageRecords(data, options) {
    return this.server.getStorageRecords(data, options);
  }
  async modifyStorageRecords(data, options) {
    return this.server.modifyStorageRecords(data, options);
  }
  async getGroupMembershipToken(options) {
    return this.server.getGroupExternalCredential(options);
  }
  async sendChallengeResponse(challengeResponse) {
    return this.server.sendChallengeResponse(challengeResponse);
  }
  async putProfile(jsonData) {
    return this.server.putProfile(jsonData);
  }
  async uploadAvatar(requestHeaders, avatarData) {
    return this.server.uploadAvatar(requestHeaders, avatarData);
  }
  async putUsername(username) {
    return this.server.putUsername(username);
  }
  async deleteUsername() {
    return this.server.deleteUsername();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  singleProtoJobDataSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2VuZE1lc3NhZ2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xuXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB0eXBlIHsgRGljdGlvbmFyeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgTG9uZyBmcm9tICdsb25nJztcbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5pbXBvcnQgdHlwZSB7IFBsYWludGV4dENvbnRlbnQgfSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuaW1wb3J0IHtcbiAgUHJvdG9jb2xBZGRyZXNzLFxuICBTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlLFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuXG5pbXBvcnQgdHlwZSB7IFF1b3RlZE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgeyBHTE9CQUxfWk9ORSB9IGZyb20gJy4uL1NpZ25hbFByb3RvY29sU3RvcmUnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgcGFyc2VJbnRPclRocm93IH0gZnJvbSAnLi4vdXRpbC9wYXJzZUludE9yVGhyb3cnO1xuaW1wb3J0IHsgQWRkcmVzcyB9IGZyb20gJy4uL3R5cGVzL0FkZHJlc3MnO1xuaW1wb3J0IHsgUXVhbGlmaWVkQWRkcmVzcyB9IGZyb20gJy4uL3R5cGVzL1F1YWxpZmllZEFkZHJlc3MnO1xuaW1wb3J0IHsgU2VuZGVyS2V5cyB9IGZyb20gJy4uL0xpYlNpZ25hbFN0b3Jlcyc7XG5pbXBvcnQgdHlwZSB7IExpbmtQcmV2aWV3VHlwZSB9IGZyb20gJy4uL3R5cGVzL21lc3NhZ2UvTGlua1ByZXZpZXdzJztcbmltcG9ydCB7IE1JTUVUeXBlVG9TdHJpbmcgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB0eXBlICogYXMgQXR0YWNobWVudCBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgVVVJRCwgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB0eXBlIHtcbiAgQ2hhbGxlbmdlVHlwZSxcbiAgR2V0R3JvdXBMb2dPcHRpb25zVHlwZSxcbiAgR2V0UHJvZmlsZU9wdGlvbnNUeXBlLFxuICBHZXRQcm9maWxlVW5hdXRoT3B0aW9uc1R5cGUsXG4gIEdyb3VwQ3JlZGVudGlhbHNUeXBlLFxuICBHcm91cExvZ1Jlc3BvbnNlVHlwZSxcbiAgUHJvZmlsZVJlcXVlc3REYXRhVHlwZSxcbiAgUHJveGllZFJlcXVlc3RPcHRpb25zVHlwZSxcbiAgVXBsb2FkQXZhdGFySGVhZGVyc1R5cGUsXG4gIFdlYkFQSVR5cGUsXG59IGZyb20gJy4vV2ViQVBJJztcbmltcG9ydCBjcmVhdGVUYXNrV2l0aFRpbWVvdXQgZnJvbSAnLi9UYXNrV2l0aFRpbWVvdXQnO1xuaW1wb3J0IHR5cGUge1xuICBDYWxsYmFja1Jlc3VsdFR5cGUsXG4gIFN0b3JhZ2VTZXJ2aWNlQ2FsbE9wdGlvbnNUeXBlLFxuICBTdG9yYWdlU2VydmljZUNyZWRlbnRpYWxzLFxufSBmcm9tICcuL1R5cGVzLmQnO1xuaW1wb3J0IHR5cGUge1xuICBTZXJpYWxpemVkQ2VydGlmaWNhdGVUeXBlLFxuICBTZW5kTG9nQ2FsbGJhY2tUeXBlLFxufSBmcm9tICcuL091dGdvaW5nTWVzc2FnZSc7XG5pbXBvcnQgT3V0Z29pbmdNZXNzYWdlIGZyb20gJy4vT3V0Z29pbmdNZXNzYWdlJztcbmltcG9ydCB0eXBlIHsgQ0RTUmVzcG9uc2VUeXBlIH0gZnJvbSAnLi9jZHMvVHlwZXMuZCc7XG5pbXBvcnQgKiBhcyBCeXRlcyBmcm9tICcuLi9CeXRlcyc7XG5pbXBvcnQgeyBnZXRSYW5kb21CeXRlcywgZ2V0WmVyb2VzLCBlbmNyeXB0QXR0YWNobWVudCB9IGZyb20gJy4uL0NyeXB0byc7XG5pbXBvcnQge1xuICBNZXNzYWdlRXJyb3IsXG4gIFNpZ25lZFByZUtleVJvdGF0aW9uRXJyb3IsXG4gIFNlbmRNZXNzYWdlUHJvdG9FcnJvcixcbiAgSFRUUEVycm9yLFxufSBmcm9tICcuL0Vycm9ycyc7XG5pbXBvcnQgdHlwZSB7IEJvZHlSYW5nZXNUeXBlLCBTdG9yeUNvbnRleHRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7XG4gIExpbmtQcmV2aWV3SW1hZ2UsXG4gIExpbmtQcmV2aWV3TWV0YWRhdGEsXG59IGZyb20gJy4uL2xpbmtQcmV2aWV3cy9saW5rUHJldmlld0ZldGNoJztcbmltcG9ydCB7IGNvbmNhdCwgaXNFbXB0eSwgbWFwIH0gZnJvbSAnLi4vdXRpbC9pdGVyYWJsZXMnO1xuaW1wb3J0IHR5cGUgeyBTZW5kVHlwZXNUeXBlIH0gZnJvbSAnLi4vdXRpbC9oYW5kbGVNZXNzYWdlU2VuZCc7XG5pbXBvcnQgeyBzaG91bGRTYXZlUHJvdG8sIHNlbmRUeXBlc0VudW0gfSBmcm9tICcuLi91dGlsL2hhbmRsZU1lc3NhZ2VTZW5kJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHR5cGUgeyBBdmF0YXIsIEVtYmVkZGVkQ29udGFjdFR5cGUgfSBmcm9tICcuLi90eXBlcy9FbWJlZGRlZENvbnRhY3QnO1xuaW1wb3J0IHtcbiAgbnVtYmVyVG9QaG9uZVR5cGUsXG4gIG51bWJlclRvRW1haWxUeXBlLFxuICBudW1iZXJUb0FkZHJlc3NUeXBlLFxufSBmcm9tICcuLi90eXBlcy9FbWJlZGRlZENvbnRhY3QnO1xuaW1wb3J0IHR5cGUgeyBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSB9IGZyb20gJy4uL3R5cGVzL1N0aWNrZXJzJztcblxuZXhwb3J0IHR5cGUgU2VuZE1ldGFkYXRhVHlwZSA9IHtcbiAgW2lkZW50aWZpZXI6IHN0cmluZ106IHtcbiAgICBhY2Nlc3NLZXk6IHN0cmluZztcbiAgICBzZW5kZXJDZXJ0aWZpY2F0ZT86IFNlcmlhbGl6ZWRDZXJ0aWZpY2F0ZVR5cGU7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBTZW5kT3B0aW9uc1R5cGUgPSB7XG4gIHNlbmRNZXRhZGF0YT86IFNlbmRNZXRhZGF0YVR5cGU7XG4gIG9ubGluZT86IGJvb2xlYW47XG59O1xuXG50eXBlIFF1b3RlQXR0YWNobWVudFR5cGUgPSB7XG4gIHRodW1ibmFpbD86IEF0dGFjaG1lbnRUeXBlO1xuICBhdHRhY2htZW50UG9pbnRlcj86IFByb3RvLklBdHRhY2htZW50UG9pbnRlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEdyb3VwVjJJbmZvVHlwZSA9IHtcbiAgZ3JvdXBDaGFuZ2U/OiBVaW50OEFycmF5O1xuICBtYXN0ZXJLZXk6IFVpbnQ4QXJyYXk7XG4gIHJldmlzaW9uOiBudW1iZXI7XG4gIG1lbWJlcnM6IEFycmF5PHN0cmluZz47XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBWMUluZm9UeXBlID0ge1xuICBpZDogc3RyaW5nO1xuICBtZW1iZXJzOiBBcnJheTxzdHJpbmc+O1xufTtcblxudHlwZSBHcm91cENhbGxVcGRhdGVUeXBlID0ge1xuICBlcmFJZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU3RpY2tlclR5cGUgPSBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSAmIHtcbiAgYXR0YWNobWVudFBvaW50ZXI/OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXI7XG59O1xuXG5leHBvcnQgdHlwZSBSZWFjdGlvblR5cGUgPSB7XG4gIGVtb2ppPzogc3RyaW5nO1xuICByZW1vdmU/OiBib29sZWFuO1xuICB0YXJnZXRBdXRob3JVdWlkPzogc3RyaW5nO1xuICB0YXJnZXRUaW1lc3RhbXA/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBBdHRhY2htZW50VHlwZSA9IHtcbiAgc2l6ZTogbnVtYmVyO1xuICBkYXRhOiBVaW50OEFycmF5O1xuICBjb250ZW50VHlwZTogc3RyaW5nO1xuXG4gIGZpbGVOYW1lPzogc3RyaW5nO1xuICBmbGFncz86IG51bWJlcjtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgY2FwdGlvbj86IHN0cmluZztcblxuICBhdHRhY2htZW50UG9pbnRlcj86IFByb3RvLklBdHRhY2htZW50UG9pbnRlcjtcblxuICBibHVySGFzaD86IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBzaW5nbGVQcm90b0pvYkRhdGFTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGNvbnRlbnRIaW50OiB6Lm51bWJlcigpLFxuICBpZGVudGlmaWVyOiB6LnN0cmluZygpLFxuICBpc1N5bmNNZXNzYWdlOiB6LmJvb2xlYW4oKSxcbiAgbWVzc2FnZUlkczogei5hcnJheSh6LnN0cmluZygpKS5vcHRpb25hbCgpLFxuICBwcm90b0Jhc2U2NDogei5zdHJpbmcoKSxcbiAgdHlwZTogc2VuZFR5cGVzRW51bSxcbiAgdXJnZW50OiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCB0eXBlIFNpbmdsZVByb3RvSm9iRGF0YSA9IHouaW5mZXI8dHlwZW9mIHNpbmdsZVByb3RvSm9iRGF0YVNjaGVtYT47XG5cbmZ1bmN0aW9uIG1ha2VBdHRhY2htZW50U2VuZFJlYWR5KFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50LkF0dGFjaG1lbnRUeXBlXG4pOiBBdHRhY2htZW50VHlwZSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXR0YWNobWVudDtcblxuICBpZiAoIWRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnbWFrZUF0dGFjaG1lbnRTZW5kUmVhZHk6IE1pc3NpbmcgZGF0YSwgcmV0dXJuaW5nIHVuZGVmaW5lZCdcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5hdHRhY2htZW50LFxuICAgIGNvbnRlbnRUeXBlOiBNSU1FVHlwZVRvU3RyaW5nKGF0dGFjaG1lbnQuY29udGVudFR5cGUpLFxuICAgIGRhdGEsXG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXIgPSBFbWJlZGRlZENvbnRhY3RUeXBlICYge1xuICBhdmF0YXI/OiBBdmF0YXIgJiB7XG4gICAgYXR0YWNobWVudFBvaW50ZXI/OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXI7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBNZXNzYWdlT3B0aW9uc1R5cGUgPSB7XG4gIGF0dGFjaG1lbnRzPzogUmVhZG9ubHlBcnJheTxBdHRhY2htZW50VHlwZT4gfCBudWxsO1xuICBib2R5Pzogc3RyaW5nO1xuICBjb250YWN0PzogQXJyYXk8Q29udGFjdFdpdGhIeWRyYXRlZEF2YXRhcj47XG4gIGV4cGlyZVRpbWVyPzogbnVtYmVyO1xuICBmbGFncz86IG51bWJlcjtcbiAgZ3JvdXA/OiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB0eXBlOiBudW1iZXI7XG4gIH07XG4gIGdyb3VwVjI/OiBHcm91cFYySW5mb1R5cGU7XG4gIG5lZWRzU3luYz86IGJvb2xlYW47XG4gIHByZXZpZXc/OiBSZWFkb25seUFycmF5PExpbmtQcmV2aWV3VHlwZT47XG4gIHByb2ZpbGVLZXk/OiBVaW50OEFycmF5O1xuICBxdW90ZT86IFF1b3RlZE1lc3NhZ2VUeXBlIHwgbnVsbDtcbiAgcmVjaXBpZW50czogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xuICBzdGlja2VyPzogU3RpY2tlcldpdGhIeWRyYXRlZERhdGE7XG4gIHJlYWN0aW9uPzogUmVhY3Rpb25UeXBlO1xuICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA/OiBudW1iZXI7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICBtZW50aW9ucz86IEJvZHlSYW5nZXNUeXBlO1xuICBncm91cENhbGxVcGRhdGU/OiBHcm91cENhbGxVcGRhdGVUeXBlO1xuICBzdG9yeUNvbnRleHQ/OiBTdG9yeUNvbnRleHRUeXBlO1xufTtcbmV4cG9ydCB0eXBlIEdyb3VwU2VuZE9wdGlvbnNUeXBlID0ge1xuICBhdHRhY2htZW50cz86IEFycmF5PEF0dGFjaG1lbnRUeXBlPjtcbiAgY29udGFjdD86IEFycmF5PENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXI+O1xuICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA/OiBudW1iZXI7XG4gIGV4cGlyZVRpbWVyPzogbnVtYmVyO1xuICBmbGFncz86IG51bWJlcjtcbiAgZ3JvdXBDYWxsVXBkYXRlPzogR3JvdXBDYWxsVXBkYXRlVHlwZTtcbiAgZ3JvdXBWMT86IEdyb3VwVjFJbmZvVHlwZTtcbiAgZ3JvdXBWMj86IEdyb3VwVjJJbmZvVHlwZTtcbiAgbWVudGlvbnM/OiBCb2R5UmFuZ2VzVHlwZTtcbiAgbWVzc2FnZVRleHQ/OiBzdHJpbmc7XG4gIHByZXZpZXc/OiBSZWFkb25seUFycmF5PExpbmtQcmV2aWV3VHlwZT47XG4gIHByb2ZpbGVLZXk/OiBVaW50OEFycmF5O1xuICBxdW90ZT86IFF1b3RlZE1lc3NhZ2VUeXBlIHwgbnVsbDtcbiAgcmVhY3Rpb24/OiBSZWFjdGlvblR5cGU7XG4gIHN0aWNrZXI/OiBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YTtcbiAgc3RvcnlDb250ZXh0PzogU3RvcnlDb250ZXh0VHlwZTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59O1xuXG5jbGFzcyBNZXNzYWdlIHtcbiAgYXR0YWNobWVudHM6IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+O1xuXG4gIGJvZHk/OiBzdHJpbmc7XG5cbiAgY29udGFjdD86IEFycmF5PENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXI+O1xuXG4gIGV4cGlyZVRpbWVyPzogbnVtYmVyO1xuXG4gIGZsYWdzPzogbnVtYmVyO1xuXG4gIGdyb3VwPzoge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdHlwZTogbnVtYmVyO1xuICB9O1xuXG4gIGdyb3VwVjI/OiBHcm91cFYySW5mb1R5cGU7XG5cbiAgbmVlZHNTeW5jPzogYm9vbGVhbjtcblxuICBwcmV2aWV3PzogUmVhZG9ubHlBcnJheTxMaW5rUHJldmlld1R5cGU+O1xuXG4gIHByb2ZpbGVLZXk/OiBVaW50OEFycmF5O1xuXG4gIHF1b3RlPzogUXVvdGVkTWVzc2FnZVR5cGUgfCBudWxsO1xuXG4gIHJlY2lwaWVudHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcblxuICBzdGlja2VyPzogU3RpY2tlclR5cGU7XG5cbiAgcmVhY3Rpb24/OiBSZWFjdGlvblR5cGU7XG5cbiAgdGltZXN0YW1wOiBudW1iZXI7XG5cbiAgZGF0YU1lc3NhZ2U/OiBQcm90by5EYXRhTWVzc2FnZTtcblxuICBhdHRhY2htZW50UG9pbnRlcnM6IEFycmF5PFByb3RvLklBdHRhY2htZW50UG9pbnRlcj4gPSBbXTtcblxuICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXA/OiBudW1iZXI7XG5cbiAgbWVudGlvbnM/OiBCb2R5UmFuZ2VzVHlwZTtcblxuICBncm91cENhbGxVcGRhdGU/OiBHcm91cENhbGxVcGRhdGVUeXBlO1xuXG4gIHN0b3J5Q29udGV4dD86IFN0b3J5Q29udGV4dFR5cGU7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogTWVzc2FnZU9wdGlvbnNUeXBlKSB7XG4gICAgdGhpcy5hdHRhY2htZW50cyA9IG9wdGlvbnMuYXR0YWNobWVudHMgfHwgW107XG4gICAgdGhpcy5ib2R5ID0gb3B0aW9ucy5ib2R5O1xuICAgIHRoaXMuY29udGFjdCA9IG9wdGlvbnMuY29udGFjdDtcbiAgICB0aGlzLmV4cGlyZVRpbWVyID0gb3B0aW9ucy5leHBpcmVUaW1lcjtcbiAgICB0aGlzLmZsYWdzID0gb3B0aW9ucy5mbGFncztcbiAgICB0aGlzLmdyb3VwID0gb3B0aW9ucy5ncm91cDtcbiAgICB0aGlzLmdyb3VwVjIgPSBvcHRpb25zLmdyb3VwVjI7XG4gICAgdGhpcy5uZWVkc1N5bmMgPSBvcHRpb25zLm5lZWRzU3luYztcbiAgICB0aGlzLnByZXZpZXcgPSBvcHRpb25zLnByZXZpZXc7XG4gICAgdGhpcy5wcm9maWxlS2V5ID0gb3B0aW9ucy5wcm9maWxlS2V5O1xuICAgIHRoaXMucXVvdGUgPSBvcHRpb25zLnF1b3RlO1xuICAgIHRoaXMucmVjaXBpZW50cyA9IG9wdGlvbnMucmVjaXBpZW50cztcbiAgICB0aGlzLnN0aWNrZXIgPSBvcHRpb25zLnN0aWNrZXI7XG4gICAgdGhpcy5yZWFjdGlvbiA9IG9wdGlvbnMucmVhY3Rpb247XG4gICAgdGhpcy50aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgICB0aGlzLmRlbGV0ZWRGb3JFdmVyeW9uZVRpbWVzdGFtcCA9IG9wdGlvbnMuZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wO1xuICAgIHRoaXMubWVudGlvbnMgPSBvcHRpb25zLm1lbnRpb25zO1xuICAgIHRoaXMuZ3JvdXBDYWxsVXBkYXRlID0gb3B0aW9ucy5ncm91cENhbGxVcGRhdGU7XG4gICAgdGhpcy5zdG9yeUNvbnRleHQgPSBvcHRpb25zLnN0b3J5Q29udGV4dDtcblxuICAgIGlmICghKHRoaXMucmVjaXBpZW50cyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHJlY2lwaWVudCBsaXN0Jyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdyb3VwICYmICF0aGlzLmdyb3VwVjIgJiYgdGhpcy5yZWNpcGllbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHJlY2lwaWVudCBsaXN0IGZvciBub24tZ3JvdXAnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMudGltZXN0YW1wICE9PSAnbnVtYmVyJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWVzdGFtcCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmV4cGlyZVRpbWVyICE9PSB1bmRlZmluZWQgJiYgdGhpcy5leHBpcmVUaW1lciAhPT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmV4cGlyZVRpbWVyICE9PSAnbnVtYmVyJyB8fCAhKHRoaXMuZXhwaXJlVGltZXIgPj0gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cGlyZVRpbWVyJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXR0YWNobWVudHMpIHtcbiAgICAgIGlmICghKHRoaXMuYXR0YWNobWVudHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1lc3NhZ2UgYXR0YWNobWVudHMnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZmxhZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmZsYWdzICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWVzc2FnZSBmbGFncycpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pc0VuZFNlc3Npb24oKSkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmJvZHkgIT09IG51bGwgfHxcbiAgICAgICAgdGhpcy5ncm91cCAhPT0gbnVsbCB8fFxuICAgICAgICB0aGlzLmF0dGFjaG1lbnRzLmxlbmd0aCAhPT0gMFxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbmQgc2Vzc2lvbiBtZXNzYWdlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHRoaXMudGltZXN0YW1wICE9PSAnbnVtYmVyJyB8fFxuICAgICAgICAodGhpcy5ib2R5ICYmIHR5cGVvZiB0aGlzLmJvZHkgIT09ICdzdHJpbmcnKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtZXNzYWdlIGJvZHknKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdyb3VwKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgdGhpcy5ncm91cC5pZCAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgICB0eXBlb2YgdGhpcy5ncm91cC50eXBlICE9PSAnbnVtYmVyJ1xuICAgICAgICApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZ3JvdXAgY29udGV4dCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNFbmRTZXNzaW9uKCkge1xuICAgIHJldHVybiAodGhpcy5mbGFncyB8fCAwKSAmIFByb3RvLkRhdGFNZXNzYWdlLkZsYWdzLkVORF9TRVNTSU9OO1xuICB9XG5cbiAgdG9Qcm90bygpOiBQcm90by5EYXRhTWVzc2FnZSB7XG4gICAgaWYgKHRoaXMuZGF0YU1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFNZXNzYWdlO1xuICAgIH1cbiAgICBjb25zdCBwcm90byA9IG5ldyBQcm90by5EYXRhTWVzc2FnZSgpO1xuXG4gICAgcHJvdG8udGltZXN0YW1wID0gTG9uZy5mcm9tTnVtYmVyKHRoaXMudGltZXN0YW1wKTtcbiAgICBwcm90by5hdHRhY2htZW50cyA9IHRoaXMuYXR0YWNobWVudFBvaW50ZXJzO1xuXG4gICAgaWYgKHRoaXMuYm9keSkge1xuICAgICAgcHJvdG8uYm9keSA9IHRoaXMuYm9keTtcblxuICAgICAgY29uc3QgbWVudGlvbkNvdW50ID0gdGhpcy5tZW50aW9ucyA/IHRoaXMubWVudGlvbnMubGVuZ3RoIDogMDtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVycyA9IHRoaXMuYm9keS5tYXRjaCgvXFx1RkZGQy9nKTtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyQ291bnQgPSBwbGFjZWhvbGRlcnMgPyBwbGFjZWhvbGRlcnMubGVuZ3RoIDogMDtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgU2VuZGluZyBhIG1lc3NhZ2Ugd2l0aCAke21lbnRpb25Db3VudH0gbWVudGlvbnMgYW5kICR7cGxhY2Vob2xkZXJDb3VudH0gcGxhY2Vob2xkZXJzYFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZmxhZ3MpIHtcbiAgICAgIHByb3RvLmZsYWdzID0gdGhpcy5mbGFncztcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3JvdXBWMikge1xuICAgICAgcHJvdG8uZ3JvdXBWMiA9IG5ldyBQcm90by5Hcm91cENvbnRleHRWMigpO1xuICAgICAgcHJvdG8uZ3JvdXBWMi5tYXN0ZXJLZXkgPSB0aGlzLmdyb3VwVjIubWFzdGVyS2V5O1xuICAgICAgcHJvdG8uZ3JvdXBWMi5yZXZpc2lvbiA9IHRoaXMuZ3JvdXBWMi5yZXZpc2lvbjtcbiAgICAgIHByb3RvLmdyb3VwVjIuZ3JvdXBDaGFuZ2UgPSB0aGlzLmdyb3VwVjIuZ3JvdXBDaGFuZ2UgfHwgbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JvdXApIHtcbiAgICAgIHByb3RvLmdyb3VwID0gbmV3IFByb3RvLkdyb3VwQ29udGV4dCgpO1xuICAgICAgcHJvdG8uZ3JvdXAuaWQgPSBCeXRlcy5mcm9tU3RyaW5nKHRoaXMuZ3JvdXAuaWQpO1xuICAgICAgcHJvdG8uZ3JvdXAudHlwZSA9IHRoaXMuZ3JvdXAudHlwZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RpY2tlcikge1xuICAgICAgcHJvdG8uc3RpY2tlciA9IG5ldyBQcm90by5EYXRhTWVzc2FnZS5TdGlja2VyKCk7XG4gICAgICBwcm90by5zdGlja2VyLnBhY2tJZCA9IEJ5dGVzLmZyb21IZXgodGhpcy5zdGlja2VyLnBhY2tJZCk7XG4gICAgICBwcm90by5zdGlja2VyLnBhY2tLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KHRoaXMuc3RpY2tlci5wYWNrS2V5KTtcbiAgICAgIHByb3RvLnN0aWNrZXIuc3RpY2tlcklkID0gdGhpcy5zdGlja2VyLnN0aWNrZXJJZDtcbiAgICAgIHByb3RvLnN0aWNrZXIuZW1vamkgPSB0aGlzLnN0aWNrZXIuZW1vamk7XG5cbiAgICAgIGlmICh0aGlzLnN0aWNrZXIuYXR0YWNobWVudFBvaW50ZXIpIHtcbiAgICAgICAgcHJvdG8uc3RpY2tlci5kYXRhID0gdGhpcy5zdGlja2VyLmF0dGFjaG1lbnRQb2ludGVyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5yZWFjdGlvbikge1xuICAgICAgcHJvdG8ucmVhY3Rpb24gPSBuZXcgUHJvdG8uRGF0YU1lc3NhZ2UuUmVhY3Rpb24oKTtcbiAgICAgIHByb3RvLnJlYWN0aW9uLmVtb2ppID0gdGhpcy5yZWFjdGlvbi5lbW9qaSB8fCBudWxsO1xuICAgICAgcHJvdG8ucmVhY3Rpb24ucmVtb3ZlID0gdGhpcy5yZWFjdGlvbi5yZW1vdmUgfHwgZmFsc2U7XG4gICAgICBwcm90by5yZWFjdGlvbi50YXJnZXRBdXRob3JVdWlkID0gdGhpcy5yZWFjdGlvbi50YXJnZXRBdXRob3JVdWlkIHx8IG51bGw7XG4gICAgICBwcm90by5yZWFjdGlvbi50YXJnZXRUaW1lc3RhbXAgPVxuICAgICAgICB0aGlzLnJlYWN0aW9uLnRhcmdldFRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiBMb25nLmZyb21OdW1iZXIodGhpcy5yZWFjdGlvbi50YXJnZXRUaW1lc3RhbXApO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJldmlldykpIHtcbiAgICAgIHByb3RvLnByZXZpZXcgPSB0aGlzLnByZXZpZXcubWFwKHByZXZpZXcgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gbmV3IFByb3RvLkRhdGFNZXNzYWdlLlByZXZpZXcoKTtcbiAgICAgICAgaXRlbS50aXRsZSA9IHByZXZpZXcudGl0bGU7XG4gICAgICAgIGl0ZW0udXJsID0gcHJldmlldy51cmw7XG4gICAgICAgIGl0ZW0uZGVzY3JpcHRpb24gPSBwcmV2aWV3LmRlc2NyaXB0aW9uIHx8IG51bGw7XG4gICAgICAgIGl0ZW0uZGF0ZSA9IHByZXZpZXcuZGF0ZSB8fCBudWxsO1xuICAgICAgICBpZiAocHJldmlldy5hdHRhY2htZW50UG9pbnRlcikge1xuICAgICAgICAgIGl0ZW0uaW1hZ2UgPSBwcmV2aWV3LmF0dGFjaG1lbnRQb2ludGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY29udGFjdCkpIHtcbiAgICAgIHByb3RvLmNvbnRhY3QgPSB0aGlzLmNvbnRhY3QubWFwKGNvbnRhY3QgPT4ge1xuICAgICAgICBjb25zdCBjb250YWN0UHJvdG8gPSBuZXcgUHJvdG8uRGF0YU1lc3NhZ2UuQ29udGFjdCgpO1xuICAgICAgICBpZiAoY29udGFjdC5uYW1lKSB7XG4gICAgICAgICAgY29uc3QgbmFtZVByb3RvOiBQcm90by5EYXRhTWVzc2FnZS5Db250YWN0LklOYW1lID0ge1xuICAgICAgICAgICAgZ2l2ZW5OYW1lOiBjb250YWN0Lm5hbWUuZ2l2ZW5OYW1lLFxuICAgICAgICAgICAgZmFtaWx5TmFtZTogY29udGFjdC5uYW1lLmZhbWlseU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IGNvbnRhY3QubmFtZS5wcmVmaXgsXG4gICAgICAgICAgICBzdWZmaXg6IGNvbnRhY3QubmFtZS5zdWZmaXgsXG4gICAgICAgICAgICBtaWRkbGVOYW1lOiBjb250YWN0Lm5hbWUubWlkZGxlTmFtZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBjb250YWN0Lm5hbWUuZGlzcGxheU5hbWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb250YWN0UHJvdG8ubmFtZSA9IG5ldyBQcm90by5EYXRhTWVzc2FnZS5Db250YWN0Lk5hbWUobmFtZVByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250YWN0Lm51bWJlcikpIHtcbiAgICAgICAgICBjb250YWN0UHJvdG8ubnVtYmVyID0gY29udGFjdC5udW1iZXIubWFwKG51bWJlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBudW1iZXJQcm90bzogUHJvdG8uRGF0YU1lc3NhZ2UuQ29udGFjdC5JUGhvbmUgPSB7XG4gICAgICAgICAgICAgIHZhbHVlOiBudW1iZXIudmFsdWUsXG4gICAgICAgICAgICAgIHR5cGU6IG51bWJlclRvUGhvbmVUeXBlKG51bWJlci50eXBlKSxcbiAgICAgICAgICAgICAgbGFiZWw6IG51bWJlci5sYWJlbCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvdG8uRGF0YU1lc3NhZ2UuQ29udGFjdC5QaG9uZShudW1iZXJQcm90byk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGFjdC5lbWFpbCkpIHtcbiAgICAgICAgICBjb250YWN0UHJvdG8uZW1haWwgPSBjb250YWN0LmVtYWlsLm1hcChlbWFpbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbWFpbFByb3RvOiBQcm90by5EYXRhTWVzc2FnZS5Db250YWN0LklFbWFpbCA9IHtcbiAgICAgICAgICAgICAgdmFsdWU6IGVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgICB0eXBlOiBudW1iZXJUb0VtYWlsVHlwZShlbWFpbC50eXBlKSxcbiAgICAgICAgICAgICAgbGFiZWw6IGVtYWlsLmxhYmVsLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm90by5EYXRhTWVzc2FnZS5Db250YWN0LkVtYWlsKGVtYWlsUHJvdG8pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRhY3QuYWRkcmVzcykpIHtcbiAgICAgICAgICBjb250YWN0UHJvdG8uYWRkcmVzcyA9IGNvbnRhY3QuYWRkcmVzcy5tYXAoYWRkcmVzcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzUHJvdG86IFByb3RvLkRhdGFNZXNzYWdlLkNvbnRhY3QuSVBvc3RhbEFkZHJlc3MgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IG51bWJlclRvQWRkcmVzc1R5cGUoYWRkcmVzcy50eXBlKSxcbiAgICAgICAgICAgICAgbGFiZWw6IGFkZHJlc3MubGFiZWwsXG4gICAgICAgICAgICAgIHN0cmVldDogYWRkcmVzcy5zdHJlZXQsXG4gICAgICAgICAgICAgIHBvYm94OiBhZGRyZXNzLnBvYm94LFxuICAgICAgICAgICAgICBuZWlnaGJvcmhvb2Q6IGFkZHJlc3MubmVpZ2hib3Job29kLFxuICAgICAgICAgICAgICBjaXR5OiBhZGRyZXNzLmNpdHksXG4gICAgICAgICAgICAgIHJlZ2lvbjogYWRkcmVzcy5yZWdpb24sXG4gICAgICAgICAgICAgIHBvc3Rjb2RlOiBhZGRyZXNzLnBvc3Rjb2RlLFxuICAgICAgICAgICAgICBjb3VudHJ5OiBhZGRyZXNzLmNvdW50cnksXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3RvLkRhdGFNZXNzYWdlLkNvbnRhY3QuUG9zdGFsQWRkcmVzcyhhZGRyZXNzUHJvdG8pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb250YWN0LmF2YXRhciAmJiBjb250YWN0LmF2YXRhci5hdHRhY2htZW50UG9pbnRlcikge1xuICAgICAgICAgIGNvbnN0IGF2YXRhclByb3RvID0gbmV3IFByb3RvLkRhdGFNZXNzYWdlLkNvbnRhY3QuQXZhdGFyKCk7XG4gICAgICAgICAgYXZhdGFyUHJvdG8uYXZhdGFyID0gY29udGFjdC5hdmF0YXIuYXR0YWNobWVudFBvaW50ZXI7XG4gICAgICAgICAgYXZhdGFyUHJvdG8uaXNQcm9maWxlID0gQm9vbGVhbihjb250YWN0LmF2YXRhci5pc1Byb2ZpbGUpO1xuICAgICAgICAgIGNvbnRhY3RQcm90by5hdmF0YXIgPSBhdmF0YXJQcm90bztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250YWN0Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgIGNvbnRhY3RQcm90by5vcmdhbml6YXRpb24gPSBjb250YWN0Lm9yZ2FuaXphdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250YWN0UHJvdG87XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdW90ZSkge1xuICAgICAgY29uc3QgeyBRdW90ZWRBdHRhY2htZW50IH0gPSBQcm90by5EYXRhTWVzc2FnZS5RdW90ZTtcbiAgICAgIGNvbnN0IHsgQm9keVJhbmdlLCBRdW90ZSB9ID0gUHJvdG8uRGF0YU1lc3NhZ2U7XG5cbiAgICAgIHByb3RvLnF1b3RlID0gbmV3IFF1b3RlKCk7XG4gICAgICBjb25zdCB7IHF1b3RlIH0gPSBwcm90bztcblxuICAgICAgaWYgKHRoaXMucXVvdGUuaXNHaWZ0QmFkZ2UpIHtcbiAgICAgICAgcXVvdGUudHlwZSA9IFByb3RvLkRhdGFNZXNzYWdlLlF1b3RlLlR5cGUuR0lGVF9CQURHRTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1b3RlLnR5cGUgPSBQcm90by5EYXRhTWVzc2FnZS5RdW90ZS5UeXBlLk5PUk1BTDtcbiAgICAgIH1cblxuICAgICAgcXVvdGUuaWQgPVxuICAgICAgICB0aGlzLnF1b3RlLmlkID09PSB1bmRlZmluZWQgPyBudWxsIDogTG9uZy5mcm9tTnVtYmVyKHRoaXMucXVvdGUuaWQpO1xuICAgICAgcXVvdGUuYXV0aG9yVXVpZCA9IHRoaXMucXVvdGUuYXV0aG9yVXVpZCB8fCBudWxsO1xuICAgICAgcXVvdGUudGV4dCA9IHRoaXMucXVvdGUudGV4dCB8fCBudWxsO1xuICAgICAgcXVvdGUuYXR0YWNobWVudHMgPSAodGhpcy5xdW90ZS5hdHRhY2htZW50cyB8fCBbXSkubWFwKFxuICAgICAgICAoYXR0YWNobWVudDogQXR0YWNobWVudFR5cGUpID0+IHtcbiAgICAgICAgICBjb25zdCBxdW90ZWRBdHRhY2htZW50ID0gbmV3IFF1b3RlZEF0dGFjaG1lbnQoKTtcblxuICAgICAgICAgIHF1b3RlZEF0dGFjaG1lbnQuY29udGVudFR5cGUgPSBhdHRhY2htZW50LmNvbnRlbnRUeXBlO1xuICAgICAgICAgIGlmIChhdHRhY2htZW50LmZpbGVOYW1lKSB7XG4gICAgICAgICAgICBxdW90ZWRBdHRhY2htZW50LmZpbGVOYW1lID0gYXR0YWNobWVudC5maWxlTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGF0dGFjaG1lbnQuYXR0YWNobWVudFBvaW50ZXIpIHtcbiAgICAgICAgICAgIHF1b3RlZEF0dGFjaG1lbnQudGh1bWJuYWlsID0gYXR0YWNobWVudC5hdHRhY2htZW50UG9pbnRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcXVvdGVkQXR0YWNobWVudDtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJvZHlSYW5nZXM6IEJvZHlSYW5nZXNUeXBlID0gdGhpcy5xdW90ZS5ib2R5UmFuZ2VzIHx8IFtdO1xuICAgICAgcXVvdGUuYm9keVJhbmdlcyA9IGJvZHlSYW5nZXMubWFwKHJhbmdlID0+IHtcbiAgICAgICAgY29uc3QgYm9keVJhbmdlID0gbmV3IEJvZHlSYW5nZSgpO1xuICAgICAgICBib2R5UmFuZ2Uuc3RhcnQgPSByYW5nZS5zdGFydDtcbiAgICAgICAgYm9keVJhbmdlLmxlbmd0aCA9IHJhbmdlLmxlbmd0aDtcbiAgICAgICAgaWYgKHJhbmdlLm1lbnRpb25VdWlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBib2R5UmFuZ2UubWVudGlvblV1aWQgPSByYW5nZS5tZW50aW9uVXVpZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keVJhbmdlO1xuICAgICAgfSk7XG4gICAgICBpZiAoXG4gICAgICAgIHF1b3RlLmJvZHlSYW5nZXMubGVuZ3RoICYmXG4gICAgICAgICghcHJvdG8ucmVxdWlyZWRQcm90b2NvbFZlcnNpb24gfHxcbiAgICAgICAgICBwcm90by5yZXF1aXJlZFByb3RvY29sVmVyc2lvbiA8XG4gICAgICAgICAgICBQcm90by5EYXRhTWVzc2FnZS5Qcm90b2NvbFZlcnNpb24uTUVOVElPTlMpXG4gICAgICApIHtcbiAgICAgICAgcHJvdG8ucmVxdWlyZWRQcm90b2NvbFZlcnNpb24gPVxuICAgICAgICAgIFByb3RvLkRhdGFNZXNzYWdlLlByb3RvY29sVmVyc2lvbi5NRU5USU9OUztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZXhwaXJlVGltZXIpIHtcbiAgICAgIHByb3RvLmV4cGlyZVRpbWVyID0gdGhpcy5leHBpcmVUaW1lcjtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvZmlsZUtleSkge1xuICAgICAgcHJvdG8ucHJvZmlsZUtleSA9IHRoaXMucHJvZmlsZUtleTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wKSB7XG4gICAgICBwcm90by5kZWxldGUgPSB7XG4gICAgICAgIHRhcmdldFNlbnRUaW1lc3RhbXA6IExvbmcuZnJvbU51bWJlcih0aGlzLmRlbGV0ZWRGb3JFdmVyeW9uZVRpbWVzdGFtcCksXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5tZW50aW9ucykge1xuICAgICAgcHJvdG8ucmVxdWlyZWRQcm90b2NvbFZlcnNpb24gPVxuICAgICAgICBQcm90by5EYXRhTWVzc2FnZS5Qcm90b2NvbFZlcnNpb24uTUVOVElPTlM7XG4gICAgICBwcm90by5ib2R5UmFuZ2VzID0gdGhpcy5tZW50aW9ucy5tYXAoXG4gICAgICAgICh7IHN0YXJ0LCBsZW5ndGgsIG1lbnRpb25VdWlkIH0pID0+ICh7XG4gICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgIG1lbnRpb25VdWlkLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncm91cENhbGxVcGRhdGUpIHtcbiAgICAgIGNvbnN0IHsgR3JvdXBDYWxsVXBkYXRlIH0gPSBQcm90by5EYXRhTWVzc2FnZTtcblxuICAgICAgY29uc3QgZ3JvdXBDYWxsVXBkYXRlID0gbmV3IEdyb3VwQ2FsbFVwZGF0ZSgpO1xuICAgICAgZ3JvdXBDYWxsVXBkYXRlLmVyYUlkID0gdGhpcy5ncm91cENhbGxVcGRhdGUuZXJhSWQ7XG5cbiAgICAgIHByb3RvLmdyb3VwQ2FsbFVwZGF0ZSA9IGdyb3VwQ2FsbFVwZGF0ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdG9yeUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHsgU3RvcnlDb250ZXh0IH0gPSBQcm90by5EYXRhTWVzc2FnZTtcblxuICAgICAgY29uc3Qgc3RvcnlDb250ZXh0ID0gbmV3IFN0b3J5Q29udGV4dCgpO1xuICAgICAgaWYgKHRoaXMuc3RvcnlDb250ZXh0LmF1dGhvclV1aWQpIHtcbiAgICAgICAgc3RvcnlDb250ZXh0LmF1dGhvclV1aWQgPSB0aGlzLnN0b3J5Q29udGV4dC5hdXRob3JVdWlkO1xuICAgICAgfVxuICAgICAgc3RvcnlDb250ZXh0LnNlbnRUaW1lc3RhbXAgPSBMb25nLmZyb21OdW1iZXIodGhpcy5zdG9yeUNvbnRleHQudGltZXN0YW1wKTtcblxuICAgICAgcHJvdG8uc3RvcnlDb250ZXh0ID0gc3RvcnlDb250ZXh0O1xuICAgIH1cblxuICAgIHRoaXMuZGF0YU1lc3NhZ2UgPSBwcm90bztcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBlbmNvZGUoKSB7XG4gICAgcmV0dXJuIFByb3RvLkRhdGFNZXNzYWdlLmVuY29kZSh0aGlzLnRvUHJvdG8oKSkuZmluaXNoKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZVNlbmRlciB7XG4gIHBlbmRpbmdNZXNzYWdlczoge1xuICAgIFtpZDogc3RyaW5nXTogUFF1ZXVlO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzZXJ2ZXI6IFdlYkFQSVR5cGUpIHtcbiAgICB0aGlzLnBlbmRpbmdNZXNzYWdlcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgcXVldWVKb2JGb3JJZGVudGlmaWVyPFQ+KFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBydW5Kb2I6ICgpID0+IFByb21pc2U8VD5cbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgeyBpZCB9ID0gYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGVBbmRXYWl0KFxuICAgICAgaWRlbnRpZmllcixcbiAgICAgICdwcml2YXRlJ1xuICAgICk7XG4gICAgdGhpcy5wZW5kaW5nTWVzc2FnZXNbaWRdID1cbiAgICAgIHRoaXMucGVuZGluZ01lc3NhZ2VzW2lkXSB8fCBuZXcgUFF1ZXVlKHsgY29uY3VycmVuY3k6IDEgfSk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IHRoaXMucGVuZGluZ01lc3NhZ2VzW2lkXTtcblxuICAgIGNvbnN0IHRhc2tXaXRoVGltZW91dCA9IGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAgIHJ1bkpvYixcbiAgICAgIGBxdWV1ZUpvYkZvcklkZW50aWZpZXIgJHtpZGVudGlmaWVyfSAke2lkfWBcbiAgICApO1xuXG4gICAgcmV0dXJuIHF1ZXVlLmFkZCh0YXNrV2l0aFRpbWVvdXQpO1xuICB9XG5cbiAgLy8gQXR0YWNobWVudCB1cGxvYWQgZnVuY3Rpb25zXG5cbiAgX2dldEF0dGFjaG1lbnRTaXplQnVja2V0KHNpemU6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KFxuICAgICAgNTQxLFxuICAgICAgTWF0aC5mbG9vcigxLjA1ICoqIE1hdGguY2VpbChNYXRoLmxvZyhzaXplKSAvIE1hdGgubG9nKDEuMDUpKSlcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbVBhZGRpbmcoKTogVWludDhBcnJheSB7XG4gICAgLy8gR2VuZXJhdGUgYSByYW5kb20gaW50IGZyb20gMSBhbmQgNTEyXG4gICAgY29uc3QgYnVmZmVyID0gZ2V0UmFuZG9tQnl0ZXMoMik7XG4gICAgY29uc3QgcGFkZGluZ0xlbmd0aCA9IChuZXcgVWludDE2QXJyYXkoYnVmZmVyKVswXSAmIDB4MWZmKSArIDE7XG5cbiAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBwYWRkaW5nIGJ1ZmZlciBvZiB0aGUgY2hvc2VuIHNpemVcbiAgICByZXR1cm4gZ2V0UmFuZG9tQnl0ZXMocGFkZGluZ0xlbmd0aCk7XG4gIH1cblxuICBnZXRQYWRkZWRBdHRhY2htZW50KGRhdGE6IFJlYWRvbmx5PFVpbnQ4QXJyYXk+KTogVWludDhBcnJheSB7XG4gICAgY29uc3Qgc2l6ZSA9IGRhdGEuYnl0ZUxlbmd0aDtcbiAgICBjb25zdCBwYWRkZWRTaXplID0gdGhpcy5fZ2V0QXR0YWNobWVudFNpemVCdWNrZXQoc2l6ZSk7XG4gICAgY29uc3QgcGFkZGluZyA9IGdldFplcm9lcyhwYWRkZWRTaXplIC0gc2l6ZSk7XG5cbiAgICByZXR1cm4gQnl0ZXMuY29uY2F0ZW5hdGUoW2RhdGEsIHBhZGRpbmddKTtcbiAgfVxuXG4gIGFzeW5jIG1ha2VBdHRhY2htZW50UG9pbnRlcihcbiAgICBhdHRhY2htZW50OiBSZWFkb25seTxcbiAgICAgIFBhcnRpYWw8QXR0YWNobWVudFR5cGU+ICZcbiAgICAgICAgUGljazxBdHRhY2htZW50VHlwZSwgJ2RhdGEnIHwgJ3NpemUnIHwgJ2NvbnRlbnRUeXBlJz5cbiAgICA+XG4gICk6IFByb21pc2U8UHJvdG8uSUF0dGFjaG1lbnRQb2ludGVyPiB7XG4gICAgYXNzZXJ0KFxuICAgICAgdHlwZW9mIGF0dGFjaG1lbnQgPT09ICdvYmplY3QnICYmIGF0dGFjaG1lbnQgIT09IG51bGwsXG4gICAgICAnR290IG51bGwgYXR0YWNobWVudCBpbiBgbWFrZUF0dGFjaG1lbnRQb2ludGVyYCdcbiAgICApO1xuXG4gICAgY29uc3QgeyBkYXRhLCBzaXplLCBjb250ZW50VHlwZSB9ID0gYXR0YWNobWVudDtcbiAgICBpZiAoIShkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYG1ha2VBdHRhY2htZW50UG9pbnRlcjogZGF0YSB3YXMgYSAnJHt0eXBlb2YgZGF0YX0nIGluc3RlYWQgb2YgVWludDhBcnJheWBcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChkYXRhLmJ5dGVMZW5ndGggIT09IHNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYG1ha2VBdHRhY2htZW50UG9pbnRlcjogU2l6ZSAke3NpemV9IGRpZCBub3QgbWF0Y2ggZGF0YS5ieXRlTGVuZ3RoICR7ZGF0YS5ieXRlTGVuZ3RofWBcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29udGVudFR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBtYWtlQXR0YWNobWVudFBvaW50ZXI6IGNvbnRlbnRUeXBlICR7Y29udGVudFR5cGV9IHdhcyBub3QgYSBzdHJpbmdgXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHBhZGRlZCA9IHRoaXMuZ2V0UGFkZGVkQXR0YWNobWVudChkYXRhKTtcbiAgICBjb25zdCBrZXkgPSBnZXRSYW5kb21CeXRlcyg2NCk7XG4gICAgY29uc3QgaXYgPSBnZXRSYW5kb21CeXRlcygxNik7XG5cbiAgICBjb25zdCByZXN1bHQgPSBlbmNyeXB0QXR0YWNobWVudChwYWRkZWQsIGtleSwgaXYpO1xuICAgIGNvbnN0IGlkID0gYXdhaXQgdGhpcy5zZXJ2ZXIucHV0QXR0YWNobWVudChyZXN1bHQuY2lwaGVydGV4dCk7XG5cbiAgICBjb25zdCBwcm90byA9IG5ldyBQcm90by5BdHRhY2htZW50UG9pbnRlcigpO1xuICAgIHByb3RvLmNkbklkID0gTG9uZy5mcm9tU3RyaW5nKGlkKTtcbiAgICBwcm90by5jb250ZW50VHlwZSA9IGF0dGFjaG1lbnQuY29udGVudFR5cGU7XG4gICAgcHJvdG8ua2V5ID0ga2V5O1xuICAgIHByb3RvLnNpemUgPSBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgcHJvdG8uZGlnZXN0ID0gcmVzdWx0LmRpZ2VzdDtcblxuICAgIGlmIChhdHRhY2htZW50LmZpbGVOYW1lKSB7XG4gICAgICBwcm90by5maWxlTmFtZSA9IGF0dGFjaG1lbnQuZmlsZU5hbWU7XG4gICAgfVxuICAgIGlmIChhdHRhY2htZW50LmZsYWdzKSB7XG4gICAgICBwcm90by5mbGFncyA9IGF0dGFjaG1lbnQuZmxhZ3M7XG4gICAgfVxuICAgIGlmIChhdHRhY2htZW50LndpZHRoKSB7XG4gICAgICBwcm90by53aWR0aCA9IGF0dGFjaG1lbnQud2lkdGg7XG4gICAgfVxuICAgIGlmIChhdHRhY2htZW50LmhlaWdodCkge1xuICAgICAgcHJvdG8uaGVpZ2h0ID0gYXR0YWNobWVudC5oZWlnaHQ7XG4gICAgfVxuICAgIGlmIChhdHRhY2htZW50LmNhcHRpb24pIHtcbiAgICAgIHByb3RvLmNhcHRpb24gPSBhdHRhY2htZW50LmNhcHRpb247XG4gICAgfVxuICAgIGlmIChhdHRhY2htZW50LmJsdXJIYXNoKSB7XG4gICAgICBwcm90by5ibHVySGFzaCA9IGF0dGFjaG1lbnQuYmx1ckhhc2g7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgYXN5bmMgdXBsb2FkQXR0YWNobWVudHMobWVzc2FnZTogTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG1lc3NhZ2UuYXR0YWNobWVudFBvaW50ZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIG1lc3NhZ2UuYXR0YWNobWVudHMubWFwKGF0dGFjaG1lbnQgPT5cbiAgICAgICAgICB0aGlzLm1ha2VBdHRhY2htZW50UG9pbnRlcihhdHRhY2htZW50KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1lc3NhZ2VFcnJvcihtZXNzYWdlLCBlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB1cGxvYWRMaW5rUHJldmlld3MobWVzc2FnZTogTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwcmV2aWV3ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIChtZXNzYWdlLnByZXZpZXcgfHwgW10pLm1hcChhc3luYyAoaXRlbTogUmVhZG9ubHk8TGlua1ByZXZpZXdUeXBlPikgPT4ge1xuICAgICAgICAgIGlmICghaXRlbS5pbWFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBtYWtlQXR0YWNobWVudFNlbmRSZWFkeShpdGVtLmltYWdlKTtcbiAgICAgICAgICBpZiAoIWF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgICAgYXR0YWNobWVudFBvaW50ZXI6IGF3YWl0IHRoaXMubWFrZUF0dGFjaG1lbnRQb2ludGVyKGF0dGFjaG1lbnQpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBtZXNzYWdlLnByZXZpZXcgPSBwcmV2aWV3O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1lc3NhZ2VFcnJvcihtZXNzYWdlLCBlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB1cGxvYWRTdGlja2VyKG1lc3NhZ2U6IE1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzdGlja2VyIH0gPSBtZXNzYWdlO1xuXG4gICAgICBpZiAoIXN0aWNrZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFzdGlja2VyLmRhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1cGxvYWRTdGlja2VyOiBObyBzdGlja2VyIGRhdGEgdG8gdXBsb2FkIScpO1xuICAgICAgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG1lc3NhZ2Uuc3RpY2tlciA9IHtcbiAgICAgICAgLi4uc3RpY2tlcixcbiAgICAgICAgYXR0YWNobWVudFBvaW50ZXI6IGF3YWl0IHRoaXMubWFrZUF0dGFjaG1lbnRQb2ludGVyKHN0aWNrZXIuZGF0YSksXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1lc3NhZ2VFcnJvcihtZXNzYWdlLCBlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB1cGxvYWRDb250YWN0QXZhdGFyKG1lc3NhZ2U6IE1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRhY3QgfSA9IG1lc3NhZ2U7XG4gICAgaWYgKCFjb250YWN0IHx8IGNvbnRhY3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBjb250YWN0Lm1hcChhc3luYyAoaXRlbTogQ29udGFjdFdpdGhIeWRyYXRlZEF2YXRhcikgPT4ge1xuICAgICAgICAgIGNvbnN0IGl0ZW1BdmF0YXIgPSBpdGVtPy5hdmF0YXI7XG4gICAgICAgICAgY29uc3QgYXZhdGFyID0gaXRlbUF2YXRhcj8uYXZhdGFyO1xuXG4gICAgICAgICAgaWYgKCFpdGVtQXZhdGFyIHx8ICFhdmF0YXIgfHwgIWF2YXRhci5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgYXR0YWNobWVudCA9IG1ha2VBdHRhY2htZW50U2VuZFJlYWR5KGF2YXRhcik7XG4gICAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXRlbUF2YXRhci5hdHRhY2htZW50UG9pbnRlciA9IGF3YWl0IHRoaXMubWFrZUF0dGFjaG1lbnRQb2ludGVyKFxuICAgICAgICAgICAgYXR0YWNobWVudFxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1lc3NhZ2VFcnJvcihtZXNzYWdlLCBlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB1cGxvYWRUaHVtYm5haWxzKG1lc3NhZ2U6IE1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHF1b3RlIH0gPSBtZXNzYWdlO1xuICAgIGlmICghcXVvdGUgfHwgIXF1b3RlLmF0dGFjaG1lbnRzIHx8IHF1b3RlLmF0dGFjaG1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgcXVvdGUuYXR0YWNobWVudHMubWFwKGFzeW5jIChhdHRhY2htZW50OiBRdW90ZUF0dGFjaG1lbnRUeXBlKSA9PiB7XG4gICAgICAgICAgaWYgKCFhdHRhY2htZW50LnRodW1ibmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIGF0dGFjaG1lbnQuYXR0YWNobWVudFBvaW50ZXIgPSBhd2FpdCB0aGlzLm1ha2VBdHRhY2htZW50UG9pbnRlcihcbiAgICAgICAgICAgIGF0dGFjaG1lbnQudGh1bWJuYWlsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgTWVzc2FnZUVycm9yKG1lc3NhZ2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFByb3RvIGFzc2VtYmx5XG5cbiAgYXN5bmMgZ2V0VGV4dEF0dGFjaG1lbnRQcm90byhcbiAgICBhdHRhY2htZW50QXR0cnM6IEF0dGFjaG1lbnQuVGV4dEF0dGFjaG1lbnRUeXBlXG4gICk6IFByb21pc2U8UHJvdG8uVGV4dEF0dGFjaG1lbnQ+IHtcbiAgICBjb25zdCB0ZXh0QXR0YWNobWVudCA9IG5ldyBQcm90by5UZXh0QXR0YWNobWVudCgpO1xuXG4gICAgaWYgKGF0dGFjaG1lbnRBdHRycy50ZXh0KSB7XG4gICAgICB0ZXh0QXR0YWNobWVudC50ZXh0ID0gYXR0YWNobWVudEF0dHJzLnRleHQ7XG4gICAgfVxuXG4gICAgdGV4dEF0dGFjaG1lbnQudGV4dFN0eWxlID0gYXR0YWNobWVudEF0dHJzLnRleHRTdHlsZVxuICAgICAgPyBOdW1iZXIoYXR0YWNobWVudEF0dHJzLnRleHRTdHlsZSlcbiAgICAgIDogMDtcblxuICAgIGlmIChhdHRhY2htZW50QXR0cnMudGV4dEZvcmVncm91bmRDb2xvcikge1xuICAgICAgdGV4dEF0dGFjaG1lbnQudGV4dEZvcmVncm91bmRDb2xvciA9IGF0dGFjaG1lbnRBdHRycy50ZXh0Rm9yZWdyb3VuZENvbG9yO1xuICAgIH1cblxuICAgIGlmIChhdHRhY2htZW50QXR0cnMudGV4dEJhY2tncm91bmRDb2xvcikge1xuICAgICAgdGV4dEF0dGFjaG1lbnQudGV4dEJhY2tncm91bmRDb2xvciA9IGF0dGFjaG1lbnRBdHRycy50ZXh0QmFja2dyb3VuZENvbG9yO1xuICAgIH1cblxuICAgIGlmIChhdHRhY2htZW50QXR0cnMucHJldmlldykge1xuICAgICAgY29uc3QgcHJldmlld0ltYWdlID0gYXR0YWNobWVudEF0dHJzLnByZXZpZXcuaW1hZ2U7XG4gICAgICAvLyBUaGlzIGNhc3QgaXMgT0sgYmVjYXVzZSB3ZSdyZSBlbnN1cmluZyB0aGF0IHByZXZpZXdJbWFnZS5kYXRhIGlzIHRydXRoeVxuICAgICAgY29uc3QgaW1hZ2UgPVxuICAgICAgICBwcmV2aWV3SW1hZ2UgJiYgcHJldmlld0ltYWdlLmRhdGFcbiAgICAgICAgICA/IGF3YWl0IHRoaXMubWFrZUF0dGFjaG1lbnRQb2ludGVyKHByZXZpZXdJbWFnZSBhcyBBdHRhY2htZW50VHlwZSlcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgdGV4dEF0dGFjaG1lbnQucHJldmlldyA9IHtcbiAgICAgICAgaW1hZ2UsXG4gICAgICAgIHRpdGxlOiBhdHRhY2htZW50QXR0cnMucHJldmlldy50aXRsZSxcbiAgICAgICAgdXJsOiBhdHRhY2htZW50QXR0cnMucHJldmlldy51cmwsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChhdHRhY2htZW50QXR0cnMuZ3JhZGllbnQpIHtcbiAgICAgIHRleHRBdHRhY2htZW50LmdyYWRpZW50ID0gYXR0YWNobWVudEF0dHJzLmdyYWRpZW50O1xuICAgICAgdGV4dEF0dGFjaG1lbnQuYmFja2dyb3VuZCA9ICdncmFkaWVudCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHRBdHRhY2htZW50LmNvbG9yID0gYXR0YWNobWVudEF0dHJzLmNvbG9yO1xuICAgICAgdGV4dEF0dGFjaG1lbnQuYmFja2dyb3VuZCA9ICdjb2xvcic7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRleHRBdHRhY2htZW50O1xuICB9XG5cbiAgYXN5bmMgZ2V0RGF0YU1lc3NhZ2UoXG4gICAgb3B0aW9uczogUmVhZG9ubHk8TWVzc2FnZU9wdGlvbnNUeXBlPlxuICApOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgdGhpcy5nZXRIeWRyYXRlZE1lc3NhZ2Uob3B0aW9ucyk7XG4gICAgcmV0dXJuIG1lc3NhZ2UuZW5jb2RlKCk7XG4gIH1cblxuICBhc3luYyBnZXRTdG9yeU1lc3NhZ2Uoe1xuICAgIGFsbG93c1JlcGxpZXMsXG4gICAgZmlsZUF0dGFjaG1lbnQsXG4gICAgZ3JvdXBWMixcbiAgICBwcm9maWxlS2V5LFxuICAgIHRleHRBdHRhY2htZW50LFxuICB9OiB7XG4gICAgYWxsb3dzUmVwbGllcz86IGJvb2xlYW47XG4gICAgZmlsZUF0dGFjaG1lbnQ/OiBBdHRhY2htZW50VHlwZTtcbiAgICBncm91cFYyPzogR3JvdXBWMkluZm9UeXBlO1xuICAgIHByb2ZpbGVLZXk6IFVpbnQ4QXJyYXk7XG4gICAgdGV4dEF0dGFjaG1lbnQ/OiBBdHRhY2htZW50LlRleHRBdHRhY2htZW50VHlwZTtcbiAgfSk6IFByb21pc2U8UHJvdG8uU3RvcnlNZXNzYWdlPiB7XG4gICAgY29uc3Qgc3RvcnlNZXNzYWdlID0gbmV3IFByb3RvLlN0b3J5TWVzc2FnZSgpO1xuICAgIHN0b3J5TWVzc2FnZS5wcm9maWxlS2V5ID0gcHJvZmlsZUtleTtcblxuICAgIGlmIChmaWxlQXR0YWNobWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXR0YWNobWVudFBvaW50ZXIgPSBhd2FpdCB0aGlzLm1ha2VBdHRhY2htZW50UG9pbnRlcihcbiAgICAgICAgICBmaWxlQXR0YWNobWVudFxuICAgICAgICApO1xuICAgICAgICBzdG9yeU1lc3NhZ2UuZmlsZUF0dGFjaG1lbnQgPSBhdHRhY2htZW50UG9pbnRlcjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvcikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXNzYWdlRXJyb3IobWVzc2FnZSwgZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRleHRBdHRhY2htZW50KSB7XG4gICAgICBzdG9yeU1lc3NhZ2UudGV4dEF0dGFjaG1lbnQgPSBhd2FpdCB0aGlzLmdldFRleHRBdHRhY2htZW50UHJvdG8oXG4gICAgICAgIHRleHRBdHRhY2htZW50XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChncm91cFYyKSB7XG4gICAgICBjb25zdCBncm91cFYyQ29udGV4dCA9IG5ldyBQcm90by5Hcm91cENvbnRleHRWMigpO1xuICAgICAgZ3JvdXBWMkNvbnRleHQubWFzdGVyS2V5ID0gZ3JvdXBWMi5tYXN0ZXJLZXk7XG4gICAgICBncm91cFYyQ29udGV4dC5yZXZpc2lvbiA9IGdyb3VwVjIucmV2aXNpb247XG5cbiAgICAgIGlmIChncm91cFYyLmdyb3VwQ2hhbmdlKSB7XG4gICAgICAgIGdyb3VwVjJDb250ZXh0Lmdyb3VwQ2hhbmdlID0gZ3JvdXBWMi5ncm91cENoYW5nZTtcbiAgICAgIH1cblxuICAgICAgc3RvcnlNZXNzYWdlLmdyb3VwID0gZ3JvdXBWMkNvbnRleHQ7XG4gICAgfVxuXG4gICAgc3RvcnlNZXNzYWdlLmFsbG93c1JlcGxpZXMgPSBCb29sZWFuKGFsbG93c1JlcGxpZXMpO1xuXG4gICAgcmV0dXJuIHN0b3J5TWVzc2FnZTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbnRlbnRNZXNzYWdlKFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PE1lc3NhZ2VPcHRpb25zVHlwZT5cbiAgKTogUHJvbWlzZTxQcm90by5Db250ZW50PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IHRoaXMuZ2V0SHlkcmF0ZWRNZXNzYWdlKG9wdGlvbnMpO1xuICAgIGNvbnN0IGRhdGFNZXNzYWdlID0gbWVzc2FnZS50b1Byb3RvKCk7XG5cbiAgICBjb25zdCBjb250ZW50TWVzc2FnZSA9IG5ldyBQcm90by5Db250ZW50KCk7XG4gICAgY29udGVudE1lc3NhZ2UuZGF0YU1lc3NhZ2UgPSBkYXRhTWVzc2FnZTtcblxuICAgIHJldHVybiBjb250ZW50TWVzc2FnZTtcbiAgfVxuXG4gIGFzeW5jIGdldEh5ZHJhdGVkTWVzc2FnZShcbiAgICBhdHRyaWJ1dGVzOiBSZWFkb25seTxNZXNzYWdlT3B0aW9uc1R5cGU+XG4gICk6IFByb21pc2U8TWVzc2FnZT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgTWVzc2FnZShhdHRyaWJ1dGVzKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLnVwbG9hZEF0dGFjaG1lbnRzKG1lc3NhZ2UpLFxuICAgICAgdGhpcy51cGxvYWRDb250YWN0QXZhdGFyKG1lc3NhZ2UpLFxuICAgICAgdGhpcy51cGxvYWRUaHVtYm5haWxzKG1lc3NhZ2UpLFxuICAgICAgdGhpcy51cGxvYWRMaW5rUHJldmlld3MobWVzc2FnZSksXG4gICAgICB0aGlzLnVwbG9hZFN0aWNrZXIobWVzc2FnZSksXG4gICAgXSk7XG5cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIGdldFR5cGluZ0NvbnRlbnRNZXNzYWdlKFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PHtcbiAgICAgIHJlY2lwaWVudElkPzogc3RyaW5nO1xuICAgICAgZ3JvdXBJZD86IFVpbnQ4QXJyYXk7XG4gICAgICBncm91cE1lbWJlcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgICAgIGlzVHlwaW5nOiBib29sZWFuO1xuICAgICAgdGltZXN0YW1wPzogbnVtYmVyO1xuICAgIH0+XG4gICk6IFByb3RvLkNvbnRlbnQge1xuICAgIGNvbnN0IEFDVElPTl9FTlVNID0gUHJvdG8uVHlwaW5nTWVzc2FnZS5BY3Rpb247XG4gICAgY29uc3QgeyByZWNpcGllbnRJZCwgZ3JvdXBJZCwgaXNUeXBpbmcsIHRpbWVzdGFtcCB9ID0gb3B0aW9ucztcblxuICAgIGlmICghcmVjaXBpZW50SWQgJiYgIWdyb3VwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2dldFR5cGluZ0NvbnRlbnRNZXNzYWdlOiBOZWVkIHRvIHByb3ZpZGUgZWl0aGVyIHJlY2lwaWVudElkIG9yIGdyb3VwSWQhJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaW5hbFRpbWVzdGFtcCA9IHRpbWVzdGFtcCB8fCBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGFjdGlvbiA9IGlzVHlwaW5nID8gQUNUSU9OX0VOVU0uU1RBUlRFRCA6IEFDVElPTl9FTlVNLlNUT1BQRUQ7XG5cbiAgICBjb25zdCB0eXBpbmdNZXNzYWdlID0gbmV3IFByb3RvLlR5cGluZ01lc3NhZ2UoKTtcbiAgICBpZiAoZ3JvdXBJZCkge1xuICAgICAgdHlwaW5nTWVzc2FnZS5ncm91cElkID0gZ3JvdXBJZDtcbiAgICB9XG4gICAgdHlwaW5nTWVzc2FnZS5hY3Rpb24gPSBhY3Rpb247XG4gICAgdHlwaW5nTWVzc2FnZS50aW1lc3RhbXAgPSBMb25nLmZyb21OdW1iZXIoZmluYWxUaW1lc3RhbXApO1xuXG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnR5cGluZ01lc3NhZ2UgPSB0eXBpbmdNZXNzYWdlO1xuXG4gICAgcmV0dXJuIGNvbnRlbnRNZXNzYWdlO1xuICB9XG5cbiAgZ2V0QXR0cnNGcm9tR3JvdXBPcHRpb25zKFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PEdyb3VwU2VuZE9wdGlvbnNUeXBlPlxuICApOiBNZXNzYWdlT3B0aW9uc1R5cGUge1xuICAgIGNvbnN0IHtcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgY29udGFjdCxcbiAgICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVRpbWVzdGFtcCxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgZmxhZ3MsXG4gICAgICBncm91cENhbGxVcGRhdGUsXG4gICAgICBncm91cFYxLFxuICAgICAgZ3JvdXBWMixcbiAgICAgIG1lbnRpb25zLFxuICAgICAgbWVzc2FnZVRleHQsXG4gICAgICBwcmV2aWV3LFxuICAgICAgcHJvZmlsZUtleSxcbiAgICAgIHF1b3RlLFxuICAgICAgcmVhY3Rpb24sXG4gICAgICBzdGlja2VyLFxuICAgICAgc3RvcnlDb250ZXh0LFxuICAgICAgdGltZXN0YW1wLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgaWYgKCFncm91cFYxICYmICFncm91cFYyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdnZXRBdHRyc0Zyb21Hcm91cE9wdGlvbnM6IE5laXRoZXIgZ3JvdXAxIG5vciBncm91cHYyIGluZm9ybWF0aW9uIHByb3ZpZGVkISdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbXlFMTY0ID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRVdWlkKCk/LnRvU3RyaW5nKCk7XG5cbiAgICBjb25zdCBncm91cE1lbWJlcnMgPSBncm91cFYyPy5tZW1iZXJzIHx8IGdyb3VwVjE/Lm1lbWJlcnMgfHwgW107XG5cbiAgICAvLyBXZSBzaG91bGQgYWx3YXlzIGhhdmUgYSBVVUlEIGJ1dCBoYXZlIHRoaXMgY2hlY2sganVzdCBpbiBjYXNlIHdlIGRvbid0LlxuICAgIGxldCBpc05vdE1lOiAocmVjaXBpZW50OiBzdHJpbmcpID0+IGJvb2xlYW47XG4gICAgaWYgKG15VXVpZCkge1xuICAgICAgaXNOb3RNZSA9IHIgPT4gciAhPT0gbXlFMTY0ICYmIHIgIT09IG15VXVpZC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc05vdE1lID0gciA9PiByICE9PSBteUUxNjQ7XG4gICAgfVxuXG4gICAgY29uc3QgYmxvY2tlZElkZW50aWZpZXJzID0gbmV3IFNldChcbiAgICAgIGNvbmNhdChcbiAgICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5nZXRCbG9ja2VkVXVpZHMoKSxcbiAgICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5nZXRCbG9ja2VkTnVtYmVycygpXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudHMgPSBncm91cE1lbWJlcnMuZmlsdGVyKFxuICAgICAgcmVjaXBpZW50ID0+IGlzTm90TWUocmVjaXBpZW50KSAmJiAhYmxvY2tlZElkZW50aWZpZXJzLmhhcyhyZWNpcGllbnQpXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhdHRhY2htZW50cyxcbiAgICAgIGJvZHk6IG1lc3NhZ2VUZXh0LFxuICAgICAgY29udGFjdCxcbiAgICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVRpbWVzdGFtcCxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgZmxhZ3MsXG4gICAgICBncm91cENhbGxVcGRhdGUsXG4gICAgICBncm91cFYyLFxuICAgICAgZ3JvdXA6IGdyb3VwVjFcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBpZDogZ3JvdXBWMS5pZCxcbiAgICAgICAgICAgIHR5cGU6IFByb3RvLkdyb3VwQ29udGV4dC5UeXBlLkRFTElWRVIsXG4gICAgICAgICAgfVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIG1lbnRpb25zLFxuICAgICAgcHJldmlldyxcbiAgICAgIHByb2ZpbGVLZXksXG4gICAgICBxdW90ZSxcbiAgICAgIHJlYWN0aW9uLFxuICAgICAgcmVjaXBpZW50cyxcbiAgICAgIHN0aWNrZXIsXG4gICAgICBzdG9yeUNvbnRleHQsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVTeW5jTWVzc2FnZSgpOiBQcm90by5TeW5jTWVzc2FnZSB7XG4gICAgY29uc3Qgc3luY01lc3NhZ2UgPSBuZXcgUHJvdG8uU3luY01lc3NhZ2UoKTtcblxuICAgIHN5bmNNZXNzYWdlLnBhZGRpbmcgPSB0aGlzLmdldFJhbmRvbVBhZGRpbmcoKTtcblxuICAgIHJldHVybiBzeW5jTWVzc2FnZTtcbiAgfVxuXG4gIC8vIExvdy1sZXZlbCBzZW5kc1xuXG4gIGFzeW5jIHNlbmRNZXNzYWdlKHtcbiAgICBtZXNzYWdlT3B0aW9ucyxcbiAgICBjb250ZW50SGludCxcbiAgICBncm91cElkLFxuICAgIG9wdGlvbnMsXG4gICAgdXJnZW50LFxuICB9OiBSZWFkb25seTx7XG4gICAgbWVzc2FnZU9wdGlvbnM6IE1lc3NhZ2VPcHRpb25zVHlwZTtcbiAgICBjb250ZW50SGludDogbnVtYmVyO1xuICAgIGdyb3VwSWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlO1xuICAgIHVyZ2VudDogYm9vbGVhbjtcbiAgfT4pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCB0aGlzLmdldEh5ZHJhdGVkTWVzc2FnZShtZXNzYWdlT3B0aW9ucyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZVByb3RvKHtcbiAgICAgICAgY2FsbGJhY2s6IChyZXM6IENhbGxiYWNrUmVzdWx0VHlwZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXMuZXJyb3JzICYmIHJlcy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBTZW5kTWVzc2FnZVByb3RvRXJyb3IocmVzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgICBncm91cElkLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICBwcm90bzogbWVzc2FnZS50b1Byb3RvKCksXG4gICAgICAgIHJlY2lwaWVudHM6IG1lc3NhZ2UucmVjaXBpZW50cyB8fCBbXSxcbiAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlLnRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kTWVzc2FnZVByb3RvKHtcbiAgICBjYWxsYmFjayxcbiAgICBjb250ZW50SGludCxcbiAgICBncm91cElkLFxuICAgIG9wdGlvbnMsXG4gICAgcHJvdG8sXG4gICAgcmVjaXBpZW50cyxcbiAgICBzZW5kTG9nQ2FsbGJhY2ssXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfTogUmVhZG9ubHk8e1xuICAgIGNhbGxiYWNrOiAocmVzdWx0OiBDYWxsYmFja1Jlc3VsdFR5cGUpID0+IHZvaWQ7XG4gICAgY29udGVudEhpbnQ6IG51bWJlcjtcbiAgICBncm91cElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgICBwcm90bzogUHJvdG8uQ29udGVudCB8IFByb3RvLkRhdGFNZXNzYWdlIHwgUGxhaW50ZXh0Q29udGVudDtcbiAgICByZWNpcGllbnRzOiBSZWFkb25seUFycmF5PHN0cmluZz47XG4gICAgc2VuZExvZ0NhbGxiYWNrPzogU2VuZExvZ0NhbGxiYWNrVHlwZTtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICB1cmdlbnQ6IGJvb2xlYW47XG4gIH0+KTogdm9pZCB7XG4gICAgY29uc3QgcmVqZWN0aW9ucyA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UuZ2V0KFxuICAgICAgJ3NpZ25lZEtleVJvdGF0aW9uUmVqZWN0ZWQnLFxuICAgICAgMFxuICAgICk7XG4gICAgaWYgKHJlamVjdGlvbnMgPiA1KSB7XG4gICAgICB0aHJvdyBuZXcgU2lnbmVkUHJlS2V5Um90YXRpb25FcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGdvaW5nID0gbmV3IE91dGdvaW5nTWVzc2FnZSh7XG4gICAgICBjYWxsYmFjayxcbiAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgZ3JvdXBJZCxcbiAgICAgIGlkZW50aWZpZXJzOiByZWNpcGllbnRzLFxuICAgICAgbWVzc2FnZTogcHJvdG8sXG4gICAgICBvcHRpb25zLFxuICAgICAgc2VuZExvZ0NhbGxiYWNrLFxuICAgICAgc2VydmVyOiB0aGlzLnNlcnZlcixcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIHVyZ2VudCxcbiAgICB9KTtcblxuICAgIHJlY2lwaWVudHMuZm9yRWFjaChpZGVudGlmaWVyID0+IHtcbiAgICAgIHRoaXMucXVldWVKb2JGb3JJZGVudGlmaWVyKGlkZW50aWZpZXIsIGFzeW5jICgpID0+XG4gICAgICAgIG91dGdvaW5nLnNlbmRUb0lkZW50aWZpZXIoaWRlbnRpZmllcilcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZW5kTWVzc2FnZVByb3RvQW5kV2FpdCh7XG4gICAgdGltZXN0YW1wLFxuICAgIHJlY2lwaWVudHMsXG4gICAgcHJvdG8sXG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZCxcbiAgICBvcHRpb25zLFxuICAgIHVyZ2VudCxcbiAgfTogUmVhZG9ubHk8e1xuICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIHJlY2lwaWVudHM6IEFycmF5PHN0cmluZz47XG4gICAgcHJvdG86IFByb3RvLkNvbnRlbnQgfCBQcm90by5EYXRhTWVzc2FnZSB8IFBsYWludGV4dENvbnRlbnQ7XG4gICAgY29udGVudEhpbnQ6IG51bWJlcjtcbiAgICBncm91cElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgICB1cmdlbnQ6IGJvb2xlYW47XG4gIH0+KTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSAocmVzdWx0OiBDYWxsYmFja1Jlc3VsdFR5cGUpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuZXJyb3JzICYmIHJlc3VsdC5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlamVjdChuZXcgU2VuZE1lc3NhZ2VQcm90b0Vycm9yKHJlc3VsdCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlUHJvdG8oe1xuICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIHByb3RvLFxuICAgICAgICByZWNpcGllbnRzLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2VuZEluZGl2aWR1YWxQcm90byh7XG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZCxcbiAgICBpZGVudGlmaWVyLFxuICAgIG9wdGlvbnMsXG4gICAgcHJvdG8sXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfTogUmVhZG9ubHk8e1xuICAgIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gICAgZ3JvdXBJZD86IHN0cmluZztcbiAgICBpZGVudGlmaWVyOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgICBwcm90bzogUHJvdG8uRGF0YU1lc3NhZ2UgfCBQcm90by5Db250ZW50IHwgUGxhaW50ZXh0Q29udGVudDtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICB1cmdlbnQ6IGJvb2xlYW47XG4gIH0+KTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICBhc3NlcnQoaWRlbnRpZmllciwgXCJJZGVudGlmaWVyIGNhbid0IGJlIHVuZGVmaW5lZFwiKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSAocmVzOiBDYWxsYmFja1Jlc3VsdFR5cGUpID0+IHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMuZXJyb3JzICYmIHJlcy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlamVjdChuZXcgU2VuZE1lc3NhZ2VQcm90b0Vycm9yKHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2VQcm90byh7XG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICBjb250ZW50SGludCxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgcHJvdG8sXG4gICAgICAgIHJlY2lwaWVudHM6IFtpZGVudGlmaWVyXSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB1cmdlbnQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFlvdSBtaWdodCB3b25kZXIgd2h5IHRoaXMgdGFrZXMgYSBncm91cElkLiBtb2RlbHMvbWVzc2FnZXMucmVzZW5kKCkgY2FuIHNlbmQgYSBncm91cFxuICAvLyAgIG1lc3NhZ2UgdG8ganVzdCBvbmUgcGVyc29uLlxuICBhc3luYyBzZW5kTWVzc2FnZVRvSWRlbnRpZmllcih7XG4gICAgYXR0YWNobWVudHMsXG4gICAgY29udGFjdCxcbiAgICBjb250ZW50SGludCxcbiAgICBkZWxldGVkRm9yRXZlcnlvbmVUaW1lc3RhbXAsXG4gICAgZXhwaXJlVGltZXIsXG4gICAgZ3JvdXBJZCxcbiAgICBpZGVudGlmaWVyLFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9wdGlvbnMsXG4gICAgcHJldmlldyxcbiAgICBwcm9maWxlS2V5LFxuICAgIHF1b3RlLFxuICAgIHJlYWN0aW9uLFxuICAgIHN0aWNrZXIsXG4gICAgc3RvcnlDb250ZXh0LFxuICAgIHRpbWVzdGFtcCxcbiAgICB1cmdlbnQsXG4gIH06IFJlYWRvbmx5PHtcbiAgICBhdHRhY2htZW50czogUmVhZG9ubHlBcnJheTxBdHRhY2htZW50VHlwZT4gfCB1bmRlZmluZWQ7XG4gICAgY29udGFjdD86IEFycmF5PENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXI+O1xuICAgIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgZXhwaXJlVGltZXI6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBncm91cElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgaWRlbnRpZmllcjogc3RyaW5nO1xuICAgIG1lc3NhZ2VUZXh0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgICBwcmV2aWV3PzogUmVhZG9ubHlBcnJheTxMaW5rUHJldmlld1R5cGU+IHwgdW5kZWZpbmVkO1xuICAgIHByb2ZpbGVLZXk/OiBVaW50OEFycmF5O1xuICAgIHF1b3RlPzogUXVvdGVkTWVzc2FnZVR5cGUgfCBudWxsO1xuICAgIHJlYWN0aW9uPzogUmVhY3Rpb25UeXBlO1xuICAgIHN0aWNrZXI/OiBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YTtcbiAgICBzdG9yeUNvbnRleHQ/OiBTdG9yeUNvbnRleHRUeXBlO1xuICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIHVyZ2VudDogYm9vbGVhbjtcbiAgfT4pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICAgIHJldHVybiB0aGlzLnNlbmRNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2VPcHRpb25zOiB7XG4gICAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgICBib2R5OiBtZXNzYWdlVGV4dCxcbiAgICAgICAgY29udGFjdCxcbiAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lVGltZXN0YW1wLFxuICAgICAgICBleHBpcmVUaW1lcixcbiAgICAgICAgcHJldmlldyxcbiAgICAgICAgcHJvZmlsZUtleSxcbiAgICAgICAgcXVvdGUsXG4gICAgICAgIHJlYWN0aW9uLFxuICAgICAgICByZWNpcGllbnRzOiBbaWRlbnRpZmllcl0sXG4gICAgICAgIHN0aWNrZXIsXG4gICAgICAgIHN0b3J5Q29udGV4dCxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgfSxcbiAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgZ3JvdXBJZCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICB1cmdlbnQsXG4gICAgfSk7XG4gIH1cblxuICAvLyBTdXBwb3J0IGZvciBzeW5jIG1lc3NhZ2VzXG5cbiAgLy8gTm90ZTogdGhpcyBpcyB1c2VkIGZvciBzZW5kaW5nIHJlYWwgbWVzc2FnZXMgdG8geW91ciBvdGhlciBkZXZpY2VzIGFmdGVyIHNlbmRpbmcgYVxuICAvLyAgIG1lc3NhZ2UgdG8gb3RoZXJzLlxuICBhc3luYyBzZW5kU3luY01lc3NhZ2Uoe1xuICAgIGVuY29kZWREYXRhTWVzc2FnZSxcbiAgICB0aW1lc3RhbXAsXG4gICAgZGVzdGluYXRpb24sXG4gICAgZGVzdGluYXRpb25VdWlkLFxuICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICBjb252ZXJzYXRpb25JZHNTZW50VG8gPSBbXSxcbiAgICBjb252ZXJzYXRpb25JZHNXaXRoU2VhbGVkU2VuZGVyID0gbmV3IFNldCgpLFxuICAgIGlzVXBkYXRlLFxuICAgIHVyZ2VudCxcbiAgICBvcHRpb25zLFxuICAgIHN0b3J5TWVzc2FnZSxcbiAgICBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzLFxuICB9OiBSZWFkb25seTx7XG4gICAgZW5jb2RlZERhdGFNZXNzYWdlPzogVWludDhBcnJheTtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICBkZXN0aW5hdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGRlc3RpbmF0aW9uVXVpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXA6IG51bWJlciB8IG51bGw7XG4gICAgY29udmVyc2F0aW9uSWRzU2VudFRvPzogSXRlcmFibGU8c3RyaW5nPjtcbiAgICBjb252ZXJzYXRpb25JZHNXaXRoU2VhbGVkU2VuZGVyPzogU2V0PHN0cmluZz47XG4gICAgaXNVcGRhdGU/OiBib29sZWFuO1xuICAgIHVyZ2VudDogYm9vbGVhbjtcbiAgICBvcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlO1xuICAgIHN0b3J5TWVzc2FnZT86IFByb3RvLlN0b3J5TWVzc2FnZTtcbiAgICBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzPzogQXJyYXk8e1xuICAgICAgZGVzdGluYXRpb25VdWlkOiBzdHJpbmc7XG4gICAgICBkaXN0cmlidXRpb25MaXN0SWRzOiBBcnJheTxzdHJpbmc+O1xuICAgICAgaXNBbGxvd2VkVG9SZXBseTogYm9vbGVhbjtcbiAgICB9PjtcbiAgfT4pOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3Qgc2VudE1lc3NhZ2UgPSBuZXcgUHJvdG8uU3luY01lc3NhZ2UuU2VudCgpO1xuICAgIHNlbnRNZXNzYWdlLnRpbWVzdGFtcCA9IExvbmcuZnJvbU51bWJlcih0aW1lc3RhbXApO1xuXG4gICAgaWYgKGVuY29kZWREYXRhTWVzc2FnZSkge1xuICAgICAgY29uc3QgZGF0YU1lc3NhZ2UgPSBQcm90by5EYXRhTWVzc2FnZS5kZWNvZGUoZW5jb2RlZERhdGFNZXNzYWdlKTtcbiAgICAgIHNlbnRNZXNzYWdlLm1lc3NhZ2UgPSBkYXRhTWVzc2FnZTtcbiAgICB9XG4gICAgaWYgKGRlc3RpbmF0aW9uKSB7XG4gICAgICBzZW50TWVzc2FnZS5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgIH1cbiAgICBpZiAoZGVzdGluYXRpb25VdWlkKSB7XG4gICAgICBzZW50TWVzc2FnZS5kZXN0aW5hdGlvblV1aWQgPSBkZXN0aW5hdGlvblV1aWQ7XG4gICAgfVxuICAgIGlmIChleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXApIHtcbiAgICAgIHNlbnRNZXNzYWdlLmV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9IExvbmcuZnJvbU51bWJlcihcbiAgICAgICAgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc3RvcnlNZXNzYWdlKSB7XG4gICAgICBzZW50TWVzc2FnZS5zdG9yeU1lc3NhZ2UgPSBzdG9yeU1lc3NhZ2U7XG4gICAgfVxuICAgIGlmIChzdG9yeU1lc3NhZ2VSZWNpcGllbnRzKSB7XG4gICAgICBzZW50TWVzc2FnZS5zdG9yeU1lc3NhZ2VSZWNpcGllbnRzID0gc3RvcnlNZXNzYWdlUmVjaXBpZW50cy5tYXAoXG4gICAgICAgIHJlY2lwaWVudCA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RvcnlNZXNzYWdlUmVjaXBpZW50ID1cbiAgICAgICAgICAgIG5ldyBQcm90by5TeW5jTWVzc2FnZS5TZW50LlN0b3J5TWVzc2FnZVJlY2lwaWVudCgpO1xuICAgICAgICAgIHN0b3J5TWVzc2FnZVJlY2lwaWVudC5kZXN0aW5hdGlvblV1aWQgPSByZWNpcGllbnQuZGVzdGluYXRpb25VdWlkO1xuICAgICAgICAgIHN0b3J5TWVzc2FnZVJlY2lwaWVudC5kaXN0cmlidXRpb25MaXN0SWRzID1cbiAgICAgICAgICAgIHJlY2lwaWVudC5kaXN0cmlidXRpb25MaXN0SWRzO1xuICAgICAgICAgIHN0b3J5TWVzc2FnZVJlY2lwaWVudC5pc0FsbG93ZWRUb1JlcGx5ID0gcmVjaXBpZW50LmlzQWxsb3dlZFRvUmVwbHk7XG4gICAgICAgICAgcmV0dXJuIHN0b3J5TWVzc2FnZVJlY2lwaWVudDtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgIHNlbnRNZXNzYWdlLmlzUmVjaXBpZW50VXBkYXRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBUaG91Z2ggdGhpcyBmaWVsZCBoYXMgJ3VuaWRlbnRpZmllZCcgaW4gdGhlIG5hbWUsIGl0IHNob3VsZCBoYXZlIGVudHJpZXMgZm9yIGVhY2hcbiAgICAvLyAgIG51bWJlciB3ZSBzZW50IHRvLlxuICAgIGlmICghaXNFbXB0eShjb252ZXJzYXRpb25JZHNTZW50VG8pKSB7XG4gICAgICBzZW50TWVzc2FnZS51bmlkZW50aWZpZWRTdGF0dXMgPSBbXG4gICAgICAgIC4uLm1hcChjb252ZXJzYXRpb25JZHNTZW50VG8sIGNvbnZlcnNhdGlvbklkID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPVxuICAgICAgICAgICAgbmV3IFByb3RvLlN5bmNNZXNzYWdlLlNlbnQuVW5pZGVudGlmaWVkRGVsaXZlcnlTdGF0dXMoKTtcbiAgICAgICAgICBjb25zdCBjb252ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgICBpZiAoY29udikge1xuICAgICAgICAgICAgY29uc3QgZTE2NCA9IGNvbnYuZ2V0KCdlMTY0Jyk7XG4gICAgICAgICAgICBpZiAoZTE2NCkge1xuICAgICAgICAgICAgICBzdGF0dXMuZGVzdGluYXRpb24gPSBlMTY0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdXVpZCA9IGNvbnYuZ2V0KCd1dWlkJyk7XG4gICAgICAgICAgICBpZiAodXVpZCkge1xuICAgICAgICAgICAgICBzdGF0dXMuZGVzdGluYXRpb25VdWlkID0gdXVpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdHVzLnVuaWRlbnRpZmllZCA9XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZHNXaXRoU2VhbGVkU2VuZGVyLmhhcyhjb252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgICAgfSksXG4gICAgICBdO1xuICAgIH1cblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnNlbnQgPSBzZW50TWVzc2FnZTtcbiAgICBjb25zdCBjb250ZW50TWVzc2FnZSA9IG5ldyBQcm90by5Db250ZW50KCk7XG4gICAgY29udGVudE1lc3NhZ2Uuc3luY01lc3NhZ2UgPSBzeW5jTWVzc2FnZTtcblxuICAgIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRJbmRpdmlkdWFsUHJvdG8oe1xuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBwcm90bzogY29udGVudE1lc3NhZ2UsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICB1cmdlbnQsXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0UmVxdWVzdEJsb2NrU3luY01lc3NhZ2UoKTogU2luZ2xlUHJvdG9Kb2JEYXRhIHtcbiAgICBjb25zdCBteVV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUHJvdG8uU3luY01lc3NhZ2UuUmVxdWVzdCgpO1xuICAgIHJlcXVlc3QudHlwZSA9IFByb3RvLlN5bmNNZXNzYWdlLlJlcXVlc3QuVHlwZS5CTE9DS0VEO1xuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBpc1N5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAnYmxvY2tTeW5jUmVxdWVzdCcsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0UmVxdWVzdENvbmZpZ3VyYXRpb25TeW5jTWVzc2FnZSgpOiBTaW5nbGVQcm90b0pvYkRhdGEge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBQcm90by5TeW5jTWVzc2FnZS5SZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC50eXBlID0gUHJvdG8uU3luY01lc3NhZ2UuUmVxdWVzdC5UeXBlLkNPTkZJR1VSQVRJT047XG4gICAgY29uc3Qgc3luY01lc3NhZ2UgPSBNZXNzYWdlU2VuZGVyLmNyZWF0ZVN5bmNNZXNzYWdlKCk7XG4gICAgc3luY01lc3NhZ2UucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnN5bmNNZXNzYWdlID0gc3luY01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICBpZGVudGlmaWVyOiBteVV1aWQudG9TdHJpbmcoKSxcbiAgICAgIGlzU3luY01lc3NhZ2U6IHRydWUsXG4gICAgICBwcm90b0Jhc2U2NDogQnl0ZXMudG9CYXNlNjQoXG4gICAgICAgIFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKVxuICAgICAgKSxcbiAgICAgIHR5cGU6ICdjb25maWd1cmF0aW9uU3luY1JlcXVlc3QnLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldFJlcXVlc3RHcm91cFN5bmNNZXNzYWdlKCk6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLlJlcXVlc3QoKTtcbiAgICByZXF1ZXN0LnR5cGUgPSBQcm90by5TeW5jTWVzc2FnZS5SZXF1ZXN0LlR5cGUuR1JPVVBTO1xuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gdGhpcy5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBpc1N5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAnZ3JvdXBTeW5jUmVxdWVzdCcsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0UmVxdWVzdENvbnRhY3RTeW5jTWVzc2FnZSgpOiBTaW5nbGVQcm90b0pvYkRhdGEge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBQcm90by5TeW5jTWVzc2FnZS5SZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC50eXBlID0gUHJvdG8uU3luY01lc3NhZ2UuUmVxdWVzdC5UeXBlLkNPTlRBQ1RTO1xuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gdGhpcy5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBpc1N5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAnY29udGFjdFN5bmNSZXF1ZXN0JyxcbiAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldFJlcXVlc3RQbmlJZGVudGl0eVN5bmNNZXNzYWdlKCk6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLlJlcXVlc3QoKTtcbiAgICByZXF1ZXN0LnR5cGUgPSBQcm90by5TeW5jTWVzc2FnZS5SZXF1ZXN0LlR5cGUuUE5JX0lERU5USVRZO1xuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gdGhpcy5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBpc1N5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAncG5pSWRlbnRpdHlTeW5jUmVxdWVzdCcsXG4gICAgICB1cmdlbnQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRGZXRjaE1hbmlmZXN0U3luY01lc3NhZ2UoKTogU2luZ2xlUHJvdG9Kb2JEYXRhIHtcbiAgICBjb25zdCBteVV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcblxuICAgIGNvbnN0IGZldGNoTGF0ZXN0ID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLkZldGNoTGF0ZXN0KCk7XG4gICAgZmV0Y2hMYXRlc3QudHlwZSA9IFByb3RvLlN5bmNNZXNzYWdlLkZldGNoTGF0ZXN0LlR5cGUuU1RPUkFHRV9NQU5JRkVTVDtcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gdGhpcy5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLmZldGNoTGF0ZXN0ID0gZmV0Y2hMYXRlc3Q7XG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnN5bmNNZXNzYWdlID0gc3luY01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICBpZGVudGlmaWVyOiBteVV1aWQudG9TdHJpbmcoKSxcbiAgICAgIGlzU3luY01lc3NhZ2U6IHRydWUsXG4gICAgICBwcm90b0Jhc2U2NDogQnl0ZXMudG9CYXNlNjQoXG4gICAgICAgIFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKVxuICAgICAgKSxcbiAgICAgIHR5cGU6ICdmZXRjaExhdGVzdE1hbmlmZXN0U3luYycsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RmV0Y2hMb2NhbFByb2ZpbGVTeW5jTWVzc2FnZSgpOiBTaW5nbGVQcm90b0pvYkRhdGEge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3QgZmV0Y2hMYXRlc3QgPSBuZXcgUHJvdG8uU3luY01lc3NhZ2UuRmV0Y2hMYXRlc3QoKTtcbiAgICBmZXRjaExhdGVzdC50eXBlID0gUHJvdG8uU3luY01lc3NhZ2UuRmV0Y2hMYXRlc3QuVHlwZS5MT0NBTF9QUk9GSUxFO1xuXG4gICAgY29uc3Qgc3luY01lc3NhZ2UgPSB0aGlzLmNyZWF0ZVN5bmNNZXNzYWdlKCk7XG4gICAgc3luY01lc3NhZ2UuZmV0Y2hMYXRlc3QgPSBmZXRjaExhdGVzdDtcbiAgICBjb25zdCBjb250ZW50TWVzc2FnZSA9IG5ldyBQcm90by5Db250ZW50KCk7XG4gICAgY29udGVudE1lc3NhZ2Uuc3luY01lc3NhZ2UgPSBzeW5jTWVzc2FnZTtcblxuICAgIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgIGlkZW50aWZpZXI6IG15VXVpZC50b1N0cmluZygpLFxuICAgICAgaXNTeW5jTWVzc2FnZTogdHJ1ZSxcbiAgICAgIHByb3RvQmFzZTY0OiBCeXRlcy50b0Jhc2U2NChcbiAgICAgICAgUHJvdG8uQ29udGVudC5lbmNvZGUoY29udGVudE1lc3NhZ2UpLmZpbmlzaCgpXG4gICAgICApLFxuICAgICAgdHlwZTogJ2ZldGNoTG9jYWxQcm9maWxlU3luYycsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0UmVxdWVzdEtleVN5bmNNZXNzYWdlKCk6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLlJlcXVlc3QoKTtcbiAgICByZXF1ZXN0LnR5cGUgPSBQcm90by5TeW5jTWVzc2FnZS5SZXF1ZXN0LlR5cGUuS0VZUztcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gdGhpcy5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcjogbXlVdWlkLnRvU3RyaW5nKCksXG4gICAgICBpc1N5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAna2V5U3luY1JlcXVlc3QnLFxuICAgICAgdXJnZW50OiB0cnVlLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBzeW5jUmVhZE1lc3NhZ2VzKFxuICAgIHJlYWRzOiBSZWFkb25seUFycmF5PHtcbiAgICAgIHNlbmRlclV1aWQ/OiBzdHJpbmc7XG4gICAgICBzZW5kZXJFMTY0Pzogc3RyaW5nO1xuICAgICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgfT4sXG4gICAgb3B0aW9ucz86IFJlYWRvbmx5PFNlbmRPcHRpb25zVHlwZT5cbiAgKTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCBteVV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnJlYWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlYWRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBwcm90byA9IG5ldyBQcm90by5TeW5jTWVzc2FnZS5SZWFkKHtcbiAgICAgICAgLi4ucmVhZHNbaV0sXG4gICAgICAgIHRpbWVzdGFtcDogTG9uZy5mcm9tTnVtYmVyKHJlYWRzW2ldLnRpbWVzdGFtcCksXG4gICAgICB9KTtcblxuICAgICAgc3luY01lc3NhZ2UucmVhZC5wdXNoKHByb3RvKTtcbiAgICB9XG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnN5bmNNZXNzYWdlID0gc3luY01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kSW5kaXZpZHVhbFByb3RvKHtcbiAgICAgIGlkZW50aWZpZXI6IG15VXVpZC50b1N0cmluZygpLFxuICAgICAgcHJvdG86IGNvbnRlbnRNZXNzYWdlLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICBvcHRpb25zLFxuICAgICAgdXJnZW50OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc3luY1ZpZXcoXG4gICAgdmlld3M6IFJlYWRvbmx5QXJyYXk8e1xuICAgICAgc2VuZGVyVXVpZD86IHN0cmluZztcbiAgICAgIHNlbmRlckUxNjQ/OiBzdHJpbmc7XG4gICAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICB9PixcbiAgICBvcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlXG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICBjb25zdCBzeW5jTWVzc2FnZSA9IE1lc3NhZ2VTZW5kZXIuY3JlYXRlU3luY01lc3NhZ2UoKTtcbiAgICBzeW5jTWVzc2FnZS52aWV3ZWQgPSB2aWV3cy5tYXAoXG4gICAgICB2aWV3ID0+XG4gICAgICAgIG5ldyBQcm90by5TeW5jTWVzc2FnZS5WaWV3ZWQoe1xuICAgICAgICAgIC4uLnZpZXcsXG4gICAgICAgICAgdGltZXN0YW1wOiBMb25nLmZyb21OdW1iZXIodmlldy50aW1lc3RhbXApLFxuICAgICAgICB9KVxuICAgICk7XG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnN5bmNNZXNzYWdlID0gc3luY01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kSW5kaXZpZHVhbFByb3RvKHtcbiAgICAgIGlkZW50aWZpZXI6IG15VXVpZC50b1N0cmluZygpLFxuICAgICAgcHJvdG86IGNvbnRlbnRNZXNzYWdlLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICBvcHRpb25zLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHN5bmNWaWV3T25jZU9wZW4oXG4gICAgdmlld09uY2VPcGVuczogUmVhZG9ubHlBcnJheTx7XG4gICAgICBzZW5kZXJVdWlkPzogc3RyaW5nO1xuICAgICAgc2VuZGVyRTE2ND86IHN0cmluZztcbiAgICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIH0+LFxuICAgIG9wdGlvbnM/OiBSZWFkb25seTxTZW5kT3B0aW9uc1R5cGU+XG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgaWYgKHZpZXdPbmNlT3BlbnMubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBzeW5jVmlld09uY2VPcGVuOiAke3ZpZXdPbmNlT3BlbnMubGVuZ3RofSBvcGVucyBwcm92aWRlZC4gQ2FuIG9ubHkgaGFuZGxlIG9uZS5gXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCB7IHNlbmRlckUxNjQsIHNlbmRlclV1aWQsIHRpbWVzdGFtcCB9ID0gdmlld09uY2VPcGVuc1swXTtcblxuICAgIGlmICghc2VuZGVyVXVpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzeW5jVmlld09uY2VPcGVuOiBNaXNzaW5nIHNlbmRlclV1aWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBteVV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuXG4gICAgY29uc3Qgdmlld09uY2VPcGVuID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLlZpZXdPbmNlT3BlbigpO1xuICAgIGlmIChzZW5kZXJFMTY0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZXdPbmNlT3Blbi5zZW5kZXIgPSBzZW5kZXJFMTY0O1xuICAgIH1cbiAgICB2aWV3T25jZU9wZW4uc2VuZGVyVXVpZCA9IHNlbmRlclV1aWQ7XG4gICAgdmlld09uY2VPcGVuLnRpbWVzdGFtcCA9IExvbmcuZnJvbU51bWJlcih0aW1lc3RhbXApO1xuICAgIHN5bmNNZXNzYWdlLnZpZXdPbmNlT3BlbiA9IHZpZXdPbmNlT3BlbjtcblxuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zeW5jTWVzc2FnZSA9IHN5bmNNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEluZGl2aWR1YWxQcm90byh7XG4gICAgICBpZGVudGlmaWVyOiBteVV1aWQudG9TdHJpbmcoKSxcbiAgICAgIHByb3RvOiBjb250ZW50TWVzc2FnZSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0TWVzc2FnZVJlcXVlc3RSZXNwb25zZVN5bmMoXG4gICAgb3B0aW9uczogUmVhZG9ubHk8e1xuICAgICAgdGhyZWFkRTE2ND86IHN0cmluZztcbiAgICAgIHRocmVhZFV1aWQ/OiBzdHJpbmc7XG4gICAgICBncm91cElkPzogVWludDhBcnJheTtcbiAgICAgIHR5cGU6IG51bWJlcjtcbiAgICB9PlxuICApOiBTaW5nbGVQcm90b0pvYkRhdGEge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3Qgc3luY01lc3NhZ2UgPSBNZXNzYWdlU2VuZGVyLmNyZWF0ZVN5bmNNZXNzYWdlKCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IG5ldyBQcm90by5TeW5jTWVzc2FnZS5NZXNzYWdlUmVxdWVzdFJlc3BvbnNlKCk7XG4gICAgaWYgKG9wdGlvbnMudGhyZWFkRTE2NCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXNwb25zZS50aHJlYWRFMTY0ID0gb3B0aW9ucy50aHJlYWRFMTY0O1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy50aHJlYWRVdWlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3BvbnNlLnRocmVhZFV1aWQgPSBvcHRpb25zLnRocmVhZFV1aWQ7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmdyb3VwSWQpIHtcbiAgICAgIHJlc3BvbnNlLmdyb3VwSWQgPSBvcHRpb25zLmdyb3VwSWQ7XG4gICAgfVxuICAgIHJlc3BvbnNlLnR5cGUgPSBvcHRpb25zLnR5cGU7XG4gICAgc3luY01lc3NhZ2UubWVzc2FnZVJlcXVlc3RSZXNwb25zZSA9IHJlc3BvbnNlO1xuXG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnN5bmNNZXNzYWdlID0gc3luY01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LlJFU0VOREFCTEUsXG4gICAgICBpZGVudGlmaWVyOiBteVV1aWQudG9TdHJpbmcoKSxcbiAgICAgIGlzU3luY01lc3NhZ2U6IHRydWUsXG4gICAgICBwcm90b0Jhc2U2NDogQnl0ZXMudG9CYXNlNjQoXG4gICAgICAgIFByb3RvLkNvbnRlbnQuZW5jb2RlKGNvbnRlbnRNZXNzYWdlKS5maW5pc2goKVxuICAgICAgKSxcbiAgICAgIHR5cGU6ICdtZXNzYWdlUmVxdWVzdFN5bmMnLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldFN0aWNrZXJQYWNrU3luYyhcbiAgICBvcGVyYXRpb25zOiBSZWFkb25seUFycmF5PHtcbiAgICAgIHBhY2tJZDogc3RyaW5nO1xuICAgICAgcGFja0tleTogc3RyaW5nO1xuICAgICAgaW5zdGFsbGVkOiBib29sZWFuO1xuICAgIH0+XG4gICk6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgY29uc3QgRU5VTSA9IFByb3RvLlN5bmNNZXNzYWdlLlN0aWNrZXJQYWNrT3BlcmF0aW9uLlR5cGU7XG5cbiAgICBjb25zdCBwYWNrT3BlcmF0aW9ucyA9IG9wZXJhdGlvbnMubWFwKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgeyBwYWNrSWQsIHBhY2tLZXksIGluc3RhbGxlZCB9ID0gaXRlbTtcblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gbmV3IFByb3RvLlN5bmNNZXNzYWdlLlN0aWNrZXJQYWNrT3BlcmF0aW9uKCk7XG4gICAgICBvcGVyYXRpb24ucGFja0lkID0gQnl0ZXMuZnJvbUhleChwYWNrSWQpO1xuICAgICAgb3BlcmF0aW9uLnBhY2tLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KHBhY2tLZXkpO1xuICAgICAgb3BlcmF0aW9uLnR5cGUgPSBpbnN0YWxsZWQgPyBFTlVNLklOU1RBTEwgOiBFTlVNLlJFTU9WRTtcblxuICAgICAgcmV0dXJuIG9wZXJhdGlvbjtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnN0aWNrZXJQYWNrT3BlcmF0aW9uID0gcGFja09wZXJhdGlvbnM7XG5cbiAgICBjb25zdCBjb250ZW50TWVzc2FnZSA9IG5ldyBQcm90by5Db250ZW50KCk7XG4gICAgY29udGVudE1lc3NhZ2Uuc3luY01lc3NhZ2UgPSBzeW5jTWVzc2FnZTtcblxuICAgIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgIGlkZW50aWZpZXI6IG15VXVpZC50b1N0cmluZygpLFxuICAgICAgaXNTeW5jTWVzc2FnZTogdHJ1ZSxcbiAgICAgIHByb3RvQmFzZTY0OiBCeXRlcy50b0Jhc2U2NChcbiAgICAgICAgUHJvdG8uQ29udGVudC5lbmNvZGUoY29udGVudE1lc3NhZ2UpLmZpbmlzaCgpXG4gICAgICApLFxuICAgICAgdHlwZTogJ3N0aWNrZXJQYWNrU3luYycsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0VmVyaWZpY2F0aW9uU3luYyhcbiAgICBkZXN0aW5hdGlvbkUxNjQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBkZXN0aW5hdGlvblV1aWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBzdGF0ZTogbnVtYmVyLFxuICAgIGlkZW50aXR5S2V5OiBSZWFkb25seTxVaW50OEFycmF5PlxuICApOiBTaW5nbGVQcm90b0pvYkRhdGEge1xuICAgIGNvbnN0IG15VXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgaWYgKCFkZXN0aW5hdGlvbkUxNjQgJiYgIWRlc3RpbmF0aW9uVXVpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzeW5jVmVyaWZpY2F0aW9uOiBOZWl0aGVyIGUxNjQgbm9yIFVVSUQgd2VyZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhZGRpbmcgPSBNZXNzYWdlU2VuZGVyLmdldFJhbmRvbVBhZGRpbmcoKTtcblxuICAgIGNvbnN0IHZlcmlmaWVkID0gbmV3IFByb3RvLlZlcmlmaWVkKCk7XG4gICAgdmVyaWZpZWQuc3RhdGUgPSBzdGF0ZTtcbiAgICBpZiAoZGVzdGluYXRpb25FMTY0KSB7XG4gICAgICB2ZXJpZmllZC5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uRTE2NDtcbiAgICB9XG4gICAgaWYgKGRlc3RpbmF0aW9uVXVpZCkge1xuICAgICAgdmVyaWZpZWQuZGVzdGluYXRpb25VdWlkID0gZGVzdGluYXRpb25VdWlkO1xuICAgIH1cbiAgICB2ZXJpZmllZC5pZGVudGl0eUtleSA9IGlkZW50aXR5S2V5O1xuICAgIHZlcmlmaWVkLm51bGxNZXNzYWdlID0gcGFkZGluZztcblxuICAgIGNvbnN0IHN5bmNNZXNzYWdlID0gTWVzc2FnZVNlbmRlci5jcmVhdGVTeW5jTWVzc2FnZSgpO1xuICAgIHN5bmNNZXNzYWdlLnZlcmlmaWVkID0gdmVyaWZpZWQ7XG5cbiAgICBjb25zdCBjb250ZW50TWVzc2FnZSA9IG5ldyBQcm90by5Db250ZW50KCk7XG4gICAgY29udGVudE1lc3NhZ2Uuc3luY01lc3NhZ2UgPSBzeW5jTWVzc2FnZTtcblxuICAgIGNvbnN0IHsgQ29udGVudEhpbnQgfSA9IFByb3RvLlVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2UuTWVzc2FnZTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuUkVTRU5EQUJMRSxcbiAgICAgIGlkZW50aWZpZXI6IG15VXVpZC50b1N0cmluZygpLFxuICAgICAgaXNTeW5jTWVzc2FnZTogdHJ1ZSxcbiAgICAgIHByb3RvQmFzZTY0OiBCeXRlcy50b0Jhc2U2NChcbiAgICAgICAgUHJvdG8uQ29udGVudC5lbmNvZGUoY29udGVudE1lc3NhZ2UpLmZpbmlzaCgpXG4gICAgICApLFxuICAgICAgdHlwZTogJ3ZlcmlmaWNhdGlvblN5bmMnLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgLy8gU2VuZGluZyBtZXNzYWdlcyB0byBjb250YWN0c1xuXG4gIGFzeW5jIHNlbmRDYWxsaW5nTWVzc2FnZShcbiAgICByZWNpcGllbnRJZDogc3RyaW5nLFxuICAgIGNhbGxpbmdNZXNzYWdlOiBSZWFkb25seTxQcm90by5JQ2FsbGluZ01lc3NhZ2U+LFxuICAgIG9wdGlvbnM/OiBSZWFkb25seTxTZW5kT3B0aW9uc1R5cGU+XG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgcmVjaXBpZW50cyA9IFtyZWNpcGllbnRJZF07XG4gICAgY29uc3QgZmluYWxUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLmNhbGxpbmdNZXNzYWdlID0gY2FsbGluZ01lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZVByb3RvQW5kV2FpdCh7XG4gICAgICB0aW1lc3RhbXA6IGZpbmFsVGltZXN0YW1wLFxuICAgICAgcmVjaXBpZW50cyxcbiAgICAgIHByb3RvOiBjb250ZW50TWVzc2FnZSxcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5ERUZBVUxULFxuICAgICAgZ3JvdXBJZDogdW5kZWZpbmVkLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmREZWxpdmVyeVJlY2VpcHQoXG4gICAgb3B0aW9uczogUmVhZG9ubHk8e1xuICAgICAgc2VuZGVyRTE2ND86IHN0cmluZztcbiAgICAgIHNlbmRlclV1aWQ/OiBzdHJpbmc7XG4gICAgICB0aW1lc3RhbXBzOiBBcnJheTxudW1iZXI+O1xuICAgICAgb3B0aW9ucz86IFJlYWRvbmx5PFNlbmRPcHRpb25zVHlwZT47XG4gICAgfT5cbiAgKTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVjZWlwdE1lc3NhZ2Uoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHR5cGU6IFByb3RvLlJlY2VpcHRNZXNzYWdlLlR5cGUuREVMSVZFUlksXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZW5kUmVhZFJlY2VpcHQoXG4gICAgb3B0aW9uczogUmVhZG9ubHk8e1xuICAgICAgc2VuZGVyRTE2ND86IHN0cmluZztcbiAgICAgIHNlbmRlclV1aWQ/OiBzdHJpbmc7XG4gICAgICB0aW1lc3RhbXBzOiBBcnJheTxudW1iZXI+O1xuICAgICAgb3B0aW9ucz86IFJlYWRvbmx5PFNlbmRPcHRpb25zVHlwZT47XG4gICAgfT5cbiAgKTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVjZWlwdE1lc3NhZ2Uoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHR5cGU6IFByb3RvLlJlY2VpcHRNZXNzYWdlLlR5cGUuUkVBRCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRWaWV3ZWRSZWNlaXB0KFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PHtcbiAgICAgIHNlbmRlckUxNjQ/OiBzdHJpbmc7XG4gICAgICBzZW5kZXJVdWlkPzogc3RyaW5nO1xuICAgICAgdGltZXN0YW1wczogQXJyYXk8bnVtYmVyPjtcbiAgICAgIG9wdGlvbnM/OiBSZWFkb25seTxTZW5kT3B0aW9uc1R5cGU+O1xuICAgIH0+XG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlY2VpcHRNZXNzYWdlKHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB0eXBlOiBQcm90by5SZWNlaXB0TWVzc2FnZS5UeXBlLlZJRVdFRCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZFJlY2VpcHRNZXNzYWdlKHtcbiAgICBzZW5kZXJFMTY0LFxuICAgIHNlbmRlclV1aWQsXG4gICAgdGltZXN0YW1wcyxcbiAgICB0eXBlLFxuICAgIG9wdGlvbnMsXG4gIH06IFJlYWRvbmx5PHtcbiAgICBzZW5kZXJFMTY0Pzogc3RyaW5nO1xuICAgIHNlbmRlclV1aWQ/OiBzdHJpbmc7XG4gICAgdGltZXN0YW1wczogQXJyYXk8bnVtYmVyPjtcbiAgICB0eXBlOiBQcm90by5SZWNlaXB0TWVzc2FnZS5UeXBlO1xuICAgIG9wdGlvbnM/OiBSZWFkb25seTxTZW5kT3B0aW9uc1R5cGU+O1xuICB9Pik6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgaWYgKCFzZW5kZXJVdWlkICYmICFzZW5kZXJFMTY0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdzZW5kUmVjZWlwdE1lc3NhZ2U6IE5laXRoZXIgdXVpZCBub3IgZTE2NCB3YXMgcHJvdmlkZWQhJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWNlaXB0TWVzc2FnZSA9IG5ldyBQcm90by5SZWNlaXB0TWVzc2FnZSgpO1xuICAgIHJlY2VpcHRNZXNzYWdlLnR5cGUgPSB0eXBlO1xuICAgIHJlY2VpcHRNZXNzYWdlLnRpbWVzdGFtcCA9IHRpbWVzdGFtcHMubWFwKHRpbWVzdGFtcCA9PlxuICAgICAgTG9uZy5mcm9tTnVtYmVyKHRpbWVzdGFtcClcbiAgICApO1xuXG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBuZXcgUHJvdG8uQ29udGVudCgpO1xuICAgIGNvbnRlbnRNZXNzYWdlLnJlY2VpcHRNZXNzYWdlID0gcmVjZWlwdE1lc3NhZ2U7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kSW5kaXZpZHVhbFByb3RvKHtcbiAgICAgIGlkZW50aWZpZXI6IHNlbmRlclV1aWQgfHwgc2VuZGVyRTE2NCxcbiAgICAgIHByb3RvOiBjb250ZW50TWVzc2FnZSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0TnVsbE1lc3NhZ2Uoe1xuICAgIHV1aWQsXG4gICAgZTE2NCxcbiAgICBwYWRkaW5nLFxuICB9OiBSZWFkb25seTx7XG4gICAgdXVpZD86IHN0cmluZztcbiAgICBlMTY0Pzogc3RyaW5nO1xuICAgIHBhZGRpbmc/OiBVaW50OEFycmF5O1xuICB9Pik6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgY29uc3QgbnVsbE1lc3NhZ2UgPSBuZXcgUHJvdG8uTnVsbE1lc3NhZ2UoKTtcblxuICAgIGNvbnN0IGlkZW50aWZpZXIgPSB1dWlkIHx8IGUxNjQ7XG4gICAgaWYgKCFpZGVudGlmaWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbmROdWxsTWVzc2FnZTogR290IG5laXRoZXIgdXVpZCBub3IgZTE2NCEnKTtcbiAgICB9XG5cbiAgICBudWxsTWVzc2FnZS5wYWRkaW5nID0gcGFkZGluZyB8fCBNZXNzYWdlU2VuZGVyLmdldFJhbmRvbVBhZGRpbmcoKTtcblxuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5udWxsTWVzc2FnZSA9IG51bGxNZXNzYWdlO1xuXG4gICAgY29uc3QgeyBDb250ZW50SGludCB9ID0gUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRIaW50OiBDb250ZW50SGludC5SRVNFTkRBQkxFLFxuICAgICAgaWRlbnRpZmllcixcbiAgICAgIGlzU3luY01lc3NhZ2U6IGZhbHNlLFxuICAgICAgcHJvdG9CYXNlNjQ6IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgICBQcm90by5Db250ZW50LmVuY29kZShjb250ZW50TWVzc2FnZSkuZmluaXNoKClcbiAgICAgICksXG4gICAgICB0eXBlOiAnbnVsbE1lc3NhZ2UnLFxuICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2VuZFJldHJ5UmVxdWVzdCh7XG4gICAgZ3JvdXBJZCxcbiAgICBvcHRpb25zLFxuICAgIHBsYWludGV4dCxcbiAgICB1dWlkLFxuICB9OiBSZWFkb25seTx7XG4gICAgZ3JvdXBJZD86IHN0cmluZztcbiAgICBvcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlO1xuICAgIHBsYWludGV4dDogUGxhaW50ZXh0Q29udGVudDtcbiAgICB1dWlkOiBzdHJpbmc7XG4gIH0+KTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZVByb3RvQW5kV2FpdCh7XG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICByZWNpcGllbnRzOiBbdXVpZF0sXG4gICAgICBwcm90bzogcGxhaW50ZXh0LFxuICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LkRFRkFVTFQsXG4gICAgICBncm91cElkLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICAvLyBHcm91cCBzZW5kc1xuXG4gIC8vIFVzZWQgdG8gZW5zdXJlIHRoYXQgd2hlbiB3ZSBzZW5kIHRvIGEgZ3JvdXAgdGhlIG9sZCB3YXksIHdlIHNhdmUgdG8gdGhlIHNlbmQgbG9nIGFzXG4gIC8vICAgd2Ugc2VuZCB0byBlYWNoIHJlY2lwaWVudC4gVGhlbiB3ZSBkb24ndCBoYXZlIGEgbG9uZyBkZWxheSBiZXR3ZWVuIHRoZSBmaXJzdCBzZW5kXG4gIC8vICAgYW5kIHRoZSBmaW5hbCBzYXZlIHRvIHRoZSBkYXRhYmFzZSB3aXRoIGFsbCByZWNpcGllbnRzLlxuICBtYWtlU2VuZExvZ0NhbGxiYWNrKHtcbiAgICBjb250ZW50SGludCxcbiAgICBtZXNzYWdlSWQsXG4gICAgcHJvdG8sXG4gICAgc2VuZFR5cGUsXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfTogUmVhZG9ubHk8e1xuICAgIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gICAgbWVzc2FnZUlkPzogc3RyaW5nO1xuICAgIHByb3RvOiBCdWZmZXI7XG4gICAgc2VuZFR5cGU6IFNlbmRUeXBlc1R5cGU7XG4gICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgdXJnZW50OiBib29sZWFuO1xuICB9Pik6IFNlbmRMb2dDYWxsYmFja1R5cGUge1xuICAgIGxldCBpbml0aWFsU2F2ZVByb21pc2U6IFByb21pc2U8bnVtYmVyPjtcblxuICAgIHJldHVybiBhc3luYyAoe1xuICAgICAgaWRlbnRpZmllcixcbiAgICAgIGRldmljZUlkcyxcbiAgICB9OiB7XG4gICAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gICAgICBkZXZpY2VJZHM6IEFycmF5PG51bWJlcj47XG4gICAgfSkgPT4ge1xuICAgICAgaWYgKCFzaG91bGRTYXZlUHJvdG8oc2VuZFR5cGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuICAgICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYG1ha2VTZW5kTG9nQ2FsbGJhY2s6IFVuYWJsZSB0byBmaW5kIGNvbnZlcnNhdGlvbiBmb3IgaWRlbnRpZmllciAke2lkZW50aWZpZXJ9YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZWNpcGllbnRVdWlkID0gY29udmVyc2F0aW9uLmdldCgndXVpZCcpO1xuICAgICAgaWYgKCFyZWNpcGllbnRVdWlkKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBtYWtlU2VuZExvZ0NhbGxiYWNrOiBDb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGhhZCBubyBVVUlEYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5pdGlhbFNhdmVQcm9taXNlKSB7XG4gICAgICAgIGluaXRpYWxTYXZlUHJvbWlzZSA9IHdpbmRvdy5TaWduYWwuRGF0YS5pbnNlcnRTZW50UHJvdG8oXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgICAgICBwcm90byxcbiAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICAgIHVyZ2VudCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJlY2lwaWVudHM6IHsgW3JlY2lwaWVudFV1aWRdOiBkZXZpY2VJZHMgfSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZHM6IG1lc3NhZ2VJZCA/IFttZXNzYWdlSWRdIDogW10sXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBpbml0aWFsU2F2ZVByb21pc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpZCA9IGF3YWl0IGluaXRpYWxTYXZlUHJvbWlzZTtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmluc2VydFByb3RvUmVjaXBpZW50cyh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcmVjaXBpZW50VXVpZCxcbiAgICAgICAgICBkZXZpY2VJZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBObyBmdW5jdGlvbnMgc2hvdWxkIHJlYWxseSBjYWxsIHRoaXM7IHNpbmNlIG1vc3QgZ3JvdXAgc2VuZHMgYXJlIG5vdyB2aWEgU2VuZGVyIEtleVxuICBhc3luYyBzZW5kR3JvdXBQcm90byh7XG4gICAgY29udGVudEhpbnQsXG4gICAgZ3JvdXBJZCxcbiAgICBvcHRpb25zLFxuICAgIHByb3RvLFxuICAgIHJlY2lwaWVudHMsXG4gICAgc2VuZExvZ0NhbGxiYWNrLFxuICAgIHRpbWVzdGFtcCA9IERhdGUubm93KCksXG4gICAgdXJnZW50LFxuICB9OiBSZWFkb25seTx7XG4gICAgY29udGVudEhpbnQ6IG51bWJlcjtcbiAgICBncm91cElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucz86IFNlbmRPcHRpb25zVHlwZTtcbiAgICBwcm90bzogUHJvdG8uQ29udGVudDtcbiAgICByZWNpcGllbnRzOiBSZWFkb25seUFycmF5PHN0cmluZz47XG4gICAgc2VuZExvZ0NhbGxiYWNrPzogU2VuZExvZ0NhbGxiYWNrVHlwZTtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICB1cmdlbnQ6IGJvb2xlYW47XG4gIH0+KTogUHJvbWlzZTxDYWxsYmFja1Jlc3VsdFR5cGU+IHtcbiAgICBjb25zdCBteUUxNjQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0TnVtYmVyKCk7XG4gICAgY29uc3QgbXlVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKT8udG9TdHJpbmcoKTtcbiAgICBjb25zdCBpZGVudGlmaWVycyA9IHJlY2lwaWVudHMuZmlsdGVyKGlkID0+IGlkICE9PSBteUUxNjQgJiYgaWQgIT09IG15VXVpZCk7XG5cbiAgICBpZiAoaWRlbnRpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBkYXRhTWVzc2FnZSA9IHByb3RvLmRhdGFNZXNzYWdlXG4gICAgICAgID8gUHJvdG8uRGF0YU1lc3NhZ2UuZW5jb2RlKHByb3RvLmRhdGFNZXNzYWdlKS5maW5pc2goKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIGRhdGFNZXNzYWdlLFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICBmYWlsb3ZlcklkZW50aWZpZXJzOiBbXSxcbiAgICAgICAgc3VjY2Vzc2Z1bElkZW50aWZpZXJzOiBbXSxcbiAgICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcmllczogW10sXG4gICAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgICB1cmdlbnQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSAocmVzOiBDYWxsYmFja1Jlc3VsdFR5cGUpID0+IHtcbiAgICAgICAgaWYgKHJlcy5lcnJvcnMgJiYgcmVzLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBTZW5kTWVzc2FnZVByb3RvRXJyb3IocmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlUHJvdG8oe1xuICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIHByb3RvLFxuICAgICAgICByZWNpcGllbnRzOiBpZGVudGlmaWVycyxcbiAgICAgICAgc2VuZExvZ0NhbGxiYWNrLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0U2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZShcbiAgICBkaXN0cmlidXRpb25JZDogc3RyaW5nLFxuICAgIHtcbiAgICAgIHRocm93SWZOb3RJbkRhdGFiYXNlLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH06IHsgdGhyb3dJZk5vdEluRGF0YWJhc2U/OiBib29sZWFuOyB0aW1lc3RhbXA6IG51bWJlciB9XG4gICk6IFByb21pc2U8UHJvdG8uQ29udGVudD4ge1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcbiAgICBjb25zdCBvdXJEZXZpY2VJZCA9IHBhcnNlSW50T3JUaHJvdyhcbiAgICAgIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXREZXZpY2VJZCgpLFxuICAgICAgJ2dldFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UnXG4gICAgKTtcblxuICAgIGNvbnN0IHByb3RvY29sQWRkcmVzcyA9IFByb3RvY29sQWRkcmVzcy5uZXcoXG4gICAgICBvdXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICBvdXJEZXZpY2VJZFxuICAgICk7XG4gICAgY29uc3QgYWRkcmVzcyA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKFxuICAgICAgb3VyVXVpZCxcbiAgICAgIG5ldyBBZGRyZXNzKG91clV1aWQsIG91ckRldmljZUlkKVxuICAgICk7XG5cbiAgICBjb25zdCBzZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlID1cbiAgICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuZW5xdWV1ZVNlbmRlcktleUpvYihcbiAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbmRlcktleVN0b3JlID0gbmV3IFNlbmRlcktleXMoeyBvdXJVdWlkLCB6b25lOiBHTE9CQUxfWk9ORSB9KTtcblxuICAgICAgICAgIGlmICh0aHJvd0lmTm90SW5EYXRhYmFzZSkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgc2VuZGVyS2V5U3RvcmUuZ2V0U2VuZGVyS2V5KFxuICAgICAgICAgICAgICBwcm90b2NvbEFkZHJlc3MsXG4gICAgICAgICAgICAgIGRpc3RyaWJ1dGlvbklkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBnZXRTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlOiBEaXN0cmlidXRpb24gJHtkaXN0cmlidXRpb25JZH0gd2FzIG5vdCBpbiBkYXRhYmFzZSBhcyBleHBlY3RlZGBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gU2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZS5jcmVhdGUoXG4gICAgICAgICAgICBwcm90b2NvbEFkZHJlc3MsXG4gICAgICAgICAgICBkaXN0cmlidXRpb25JZCxcbiAgICAgICAgICAgIHNlbmRlcktleVN0b3JlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgYGdldFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2U6IEJ1aWxkaW5nICR7ZGlzdHJpYnV0aW9uSWR9IHdpdGggdGltZXN0YW1wICR7dGltZXN0YW1wfWBcbiAgICApO1xuICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICBjb250ZW50TWVzc2FnZS5zZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlID1cbiAgICAgIHNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gY29udGVudE1lc3NhZ2U7XG4gIH1cblxuICAvLyBUaGUgb25lIGdyb3VwIHNlbmQgZXhjZXB0aW9uIC0gYSBtZXNzYWdlIHRoYXQgc2hvdWxkIG5ldmVyIGJlIHNlbnQgdmlhIHNlbmRlciBrZXlcbiAgYXN5bmMgc2VuZFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UoXG4gICAge1xuICAgICAgY29udGVudEhpbnQsXG4gICAgICBkaXN0cmlidXRpb25JZCxcbiAgICAgIGdyb3VwSWQsXG4gICAgICBpZGVudGlmaWVycyxcbiAgICAgIHRocm93SWZOb3RJbkRhdGFiYXNlLFxuICAgICAgdXJnZW50LFxuICAgIH06IFJlYWRvbmx5PHtcbiAgICAgIGNvbnRlbnRIaW50OiBudW1iZXI7XG4gICAgICBkaXN0cmlidXRpb25JZDogc3RyaW5nO1xuICAgICAgZ3JvdXBJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgaWRlbnRpZmllcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgICAgIHRocm93SWZOb3RJbkRhdGFiYXNlPzogYm9vbGVhbjtcbiAgICAgIHVyZ2VudDogYm9vbGVhbjtcbiAgICB9PixcbiAgICBvcHRpb25zPzogUmVhZG9ubHk8U2VuZE9wdGlvbnNUeXBlPlxuICApOiBQcm9taXNlPENhbGxiYWNrUmVzdWx0VHlwZT4ge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgY29udGVudE1lc3NhZ2UgPSBhd2FpdCB0aGlzLmdldFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UoXG4gICAgICBkaXN0cmlidXRpb25JZCxcbiAgICAgIHtcbiAgICAgICAgdGhyb3dJZk5vdEluRGF0YWJhc2UsXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3Qgc2VuZExvZ0NhbGxiYWNrID1cbiAgICAgIGlkZW50aWZpZXJzLmxlbmd0aCA+IDFcbiAgICAgICAgPyB0aGlzLm1ha2VTZW5kTG9nQ2FsbGJhY2soe1xuICAgICAgICAgICAgY29udGVudEhpbnQsXG4gICAgICAgICAgICBwcm90bzogQnVmZmVyLmZyb20oUHJvdG8uQ29udGVudC5lbmNvZGUoY29udGVudE1lc3NhZ2UpLmZpbmlzaCgpKSxcbiAgICAgICAgICAgIHNlbmRUeXBlOiAnc2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZScsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB1cmdlbnQsXG4gICAgICAgICAgfSlcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kR3JvdXBQcm90byh7XG4gICAgICBjb250ZW50SGludCxcbiAgICAgIGdyb3VwSWQsXG4gICAgICBvcHRpb25zLFxuICAgICAgcHJvdG86IGNvbnRlbnRNZXNzYWdlLFxuICAgICAgcmVjaXBpZW50czogaWRlbnRpZmllcnMsXG4gICAgICBzZW5kTG9nQ2FsbGJhY2ssXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB1cmdlbnQsXG4gICAgfSk7XG4gIH1cblxuICAvLyBHcm91cFYxLW9ubHkgZnVuY3Rpb25zOyBub3QgdG8gYmUgdXNlZCBpbiB0aGUgZnV0dXJlXG5cbiAgYXN5bmMgbGVhdmVHcm91cChcbiAgICBncm91cElkOiBzdHJpbmcsXG4gICAgZ3JvdXBJZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPixcbiAgICBvcHRpb25zPzogU2VuZE9wdGlvbnNUeXBlXG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlPiB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBwcm90byA9IG5ldyBQcm90by5Db250ZW50KHtcbiAgICAgIGRhdGFNZXNzYWdlOiB7XG4gICAgICAgIGdyb3VwOiB7XG4gICAgICAgICAgaWQ6IEJ5dGVzLmZyb21TdHJpbmcoZ3JvdXBJZCksXG4gICAgICAgICAgdHlwZTogUHJvdG8uR3JvdXBDb250ZXh0LlR5cGUuUVVJVCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICBjb25zdCBjb250ZW50SGludCA9IENvbnRlbnRIaW50LlJFU0VOREFCTEU7XG4gICAgY29uc3Qgc2VuZExvZ0NhbGxiYWNrID1cbiAgICAgIGdyb3VwSWRlbnRpZmllcnMubGVuZ3RoID4gMVxuICAgICAgICA/IHRoaXMubWFrZVNlbmRMb2dDYWxsYmFjayh7XG4gICAgICAgICAgICBjb250ZW50SGludCxcbiAgICAgICAgICAgIHByb3RvOiBCdWZmZXIuZnJvbShQcm90by5Db250ZW50LmVuY29kZShwcm90bykuZmluaXNoKCkpLFxuICAgICAgICAgICAgc2VuZFR5cGU6ICdsZWdhY3lHcm91cENoYW5nZScsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgICAgICAgIH0pXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEdyb3VwUHJvdG8oe1xuICAgICAgY29udGVudEhpbnQsXG4gICAgICBncm91cElkOiB1bmRlZmluZWQsIC8vIG9ubHkgZm9yIEdWMiBpZHNcbiAgICAgIG9wdGlvbnMsXG4gICAgICBwcm90byxcbiAgICAgIHJlY2lwaWVudHM6IGdyb3VwSWRlbnRpZmllcnMsXG4gICAgICBzZW5kTG9nQ2FsbGJhY2ssXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2ltcGxlIHBhc3MtdGhyb3VnaHNcblxuICAvLyBOb3RlOiBpbnN0ZWFkIG9mIHVwZGF0aW5nIHRoZXNlIGZ1bmN0aW9ucywgb3IgYWRkaW5nIG5ldyBvbmVzLCByZW1vdmUgdGhlc2UgYW5kIGdvXG4gIC8vICAgZGlyZWN0bHkgdG8gd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLnNlcnZlci48ZnVuY3Rpb24+XG5cbiAgYXN5bmMgZ2V0UHJvZmlsZShcbiAgICB1dWlkOiBVVUlELFxuICAgIG9wdGlvbnM6IEdldFByb2ZpbGVPcHRpb25zVHlwZSB8IEdldFByb2ZpbGVVbmF1dGhPcHRpb25zVHlwZVxuICApOiBSZXR1cm5UeXBlPFdlYkFQSVR5cGVbJ2dldFByb2ZpbGUnXT4ge1xuICAgIGlmIChvcHRpb25zLmFjY2Vzc0tleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0UHJvZmlsZVVuYXV0aCh1dWlkLnRvU3RyaW5nKCksIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRQcm9maWxlKHV1aWQudG9TdHJpbmcoKSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBjaGVja0FjY291bnRFeGlzdGVuY2UodXVpZDogVVVJRCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5jaGVja0FjY291bnRFeGlzdGVuY2UodXVpZCk7XG4gIH1cblxuICBhc3luYyBnZXRQcm9maWxlRm9yVXNlcm5hbWUoXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICApOiBSZXR1cm5UeXBlPFdlYkFQSVR5cGVbJ2dldFByb2ZpbGVGb3JVc2VybmFtZSddPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLmdldFByb2ZpbGVGb3JVc2VybmFtZSh1c2VybmFtZSk7XG4gIH1cblxuICBhc3luYyBnZXRVdWlkc0ZvckUxNjRzKFxuICAgIG51bWJlcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICApOiBQcm9taXNlPERpY3Rpb25hcnk8VVVJRFN0cmluZ1R5cGUgfCBudWxsPj4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRVdWlkc0ZvckUxNjRzKG51bWJlcnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VXVpZHNGb3JFMTY0c1YyKFxuICAgIGUxNjRzOiBSZWFkb25seUFycmF5PHN0cmluZz4sXG4gICAgYWNpczogUmVhZG9ubHlBcnJheTxVVUlEU3RyaW5nVHlwZT4sXG4gICAgYWNjZXNzS2V5czogUmVhZG9ubHlBcnJheTxzdHJpbmc+XG4gICk6IFByb21pc2U8Q0RTUmVzcG9uc2VUeXBlPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLmdldFV1aWRzRm9yRTE2NHNWMih7XG4gICAgICBlMTY0cyxcbiAgICAgIGFjaXMsXG4gICAgICBhY2Nlc3NLZXlzLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXZhdGFyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8UmV0dXJuVHlwZTxXZWJBUElUeXBlWydnZXRBdmF0YXInXT4+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0QXZhdGFyKHBhdGgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RpY2tlcihcbiAgICBwYWNrSWQ6IHN0cmluZyxcbiAgICBzdGlja2VySWQ6IG51bWJlclxuICApOiBQcm9taXNlPFJldHVyblR5cGU8V2ViQVBJVHlwZVsnZ2V0U3RpY2tlciddPj4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRTdGlja2VyKHBhY2tJZCwgc3RpY2tlcklkKTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0aWNrZXJQYWNrTWFuaWZlc3QoXG4gICAgcGFja0lkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxSZXR1cm5UeXBlPFdlYkFQSVR5cGVbJ2dldFN0aWNrZXJQYWNrTWFuaWZlc3QnXT4+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0U3RpY2tlclBhY2tNYW5pZmVzdChwYWNrSWQpO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlR3JvdXAoXG4gICAgZ3JvdXA6IFJlYWRvbmx5PFByb3RvLklHcm91cD4sXG4gICAgb3B0aW9uczogUmVhZG9ubHk8R3JvdXBDcmVkZW50aWFsc1R5cGU+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5jcmVhdGVHcm91cChncm91cCwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyB1cGxvYWRHcm91cEF2YXRhcihcbiAgICBhdmF0YXI6IFJlYWRvbmx5PFVpbnQ4QXJyYXk+LFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PEdyb3VwQ3JlZGVudGlhbHNUeXBlPlxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci51cGxvYWRHcm91cEF2YXRhcihhdmF0YXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R3JvdXAoXG4gICAgb3B0aW9uczogUmVhZG9ubHk8R3JvdXBDcmVkZW50aWFsc1R5cGU+XG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXA+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0R3JvdXAob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRHcm91cEZyb21MaW5rKFxuICAgIGdyb3VwSW52aXRlTGluazogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIGF1dGg6IFJlYWRvbmx5PEdyb3VwQ3JlZGVudGlhbHNUeXBlPlxuICApOiBQcm9taXNlPFByb3RvLkdyb3VwSm9pbkluZm8+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0R3JvdXBGcm9tTGluayhncm91cEludml0ZUxpbmssIGF1dGgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R3JvdXBMb2coXG4gICAgb3B0aW9uczogR2V0R3JvdXBMb2dPcHRpb25zVHlwZSxcbiAgICBjcmVkZW50aWFsczogR3JvdXBDcmVkZW50aWFsc1R5cGVcbiAgKTogUHJvbWlzZTxHcm91cExvZ1Jlc3BvbnNlVHlwZT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRHcm91cExvZyhvcHRpb25zLCBjcmVkZW50aWFscyk7XG4gIH1cblxuICBhc3luYyBnZXRHcm91cEF2YXRhcihrZXk6IHN0cmluZyk6IFByb21pc2U8VWludDhBcnJheT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRHcm91cEF2YXRhcihrZXkpO1xuICB9XG5cbiAgYXN5bmMgbW9kaWZ5R3JvdXAoXG4gICAgY2hhbmdlczogUmVhZG9ubHk8UHJvdG8uR3JvdXBDaGFuZ2UuSUFjdGlvbnM+LFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PEdyb3VwQ3JlZGVudGlhbHNUeXBlPixcbiAgICBpbnZpdGVMaW5rQmFzZTY0Pzogc3RyaW5nXG4gICk6IFByb21pc2U8UHJvdG8uSUdyb3VwQ2hhbmdlPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLm1vZGlmeUdyb3VwKGNoYW5nZXMsIG9wdGlvbnMsIGludml0ZUxpbmtCYXNlNjQpO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hMaW5rUHJldmlld01ldGFkYXRhKFxuICAgIGhyZWY6IHN0cmluZyxcbiAgICBhYm9ydFNpZ25hbDogQWJvcnRTaWduYWxcbiAgKTogUHJvbWlzZTxudWxsIHwgTGlua1ByZXZpZXdNZXRhZGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5mZXRjaExpbmtQcmV2aWV3TWV0YWRhdGEoaHJlZiwgYWJvcnRTaWduYWwpO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hMaW5rUHJldmlld0ltYWdlKFxuICAgIGhyZWY6IHN0cmluZyxcbiAgICBhYm9ydFNpZ25hbDogQWJvcnRTaWduYWxcbiAgKTogUHJvbWlzZTxudWxsIHwgTGlua1ByZXZpZXdJbWFnZT4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5mZXRjaExpbmtQcmV2aWV3SW1hZ2UoaHJlZiwgYWJvcnRTaWduYWwpO1xuICB9XG5cbiAgYXN5bmMgbWFrZVByb3hpZWRSZXF1ZXN0KFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBSZWFkb25seTxQcm94aWVkUmVxdWVzdE9wdGlvbnNUeXBlPlxuICApOiBQcm9taXNlPFJldHVyblR5cGU8V2ViQVBJVHlwZVsnbWFrZVByb3hpZWRSZXF1ZXN0J10+PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLm1ha2VQcm94aWVkUmVxdWVzdCh1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RvcmFnZUNyZWRlbnRpYWxzKCk6IFByb21pc2U8U3RvcmFnZVNlcnZpY2VDcmVkZW50aWFscz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5nZXRTdG9yYWdlQ3JlZGVudGlhbHMoKTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0b3JhZ2VNYW5pZmVzdChcbiAgICBvcHRpb25zOiBSZWFkb25seTxTdG9yYWdlU2VydmljZUNhbGxPcHRpb25zVHlwZT5cbiAgKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLmdldFN0b3JhZ2VNYW5pZmVzdChvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0b3JhZ2VSZWNvcmRzKFxuICAgIGRhdGE6IFJlYWRvbmx5PFVpbnQ4QXJyYXk+LFxuICAgIG9wdGlvbnM6IFJlYWRvbmx5PFN0b3JhZ2VTZXJ2aWNlQ2FsbE9wdGlvbnNUeXBlPlxuICApOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0U3RvcmFnZVJlY29yZHMoZGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBtb2RpZnlTdG9yYWdlUmVjb3JkcyhcbiAgICBkYXRhOiBSZWFkb25seTxVaW50OEFycmF5PixcbiAgICBvcHRpb25zOiBSZWFkb25seTxTdG9yYWdlU2VydmljZUNhbGxPcHRpb25zVHlwZT5cbiAgKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmVyLm1vZGlmeVN0b3JhZ2VSZWNvcmRzKGRhdGEsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R3JvdXBNZW1iZXJzaGlwVG9rZW4oXG4gICAgb3B0aW9uczogUmVhZG9ubHk8R3JvdXBDcmVkZW50aWFsc1R5cGU+XG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXBFeHRlcm5hbENyZWRlbnRpYWw+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuZ2V0R3JvdXBFeHRlcm5hbENyZWRlbnRpYWwob3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2VuZENoYWxsZW5nZVJlc3BvbnNlKFxuICAgIGNoYWxsZW5nZVJlc3BvbnNlOiBSZWFkb25seTxDaGFsbGVuZ2VUeXBlPlxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIuc2VuZENoYWxsZW5nZVJlc3BvbnNlKGNoYWxsZW5nZVJlc3BvbnNlKTtcbiAgfVxuXG4gIGFzeW5jIHB1dFByb2ZpbGUoXG4gICAganNvbkRhdGE6IFJlYWRvbmx5PFByb2ZpbGVSZXF1ZXN0RGF0YVR5cGU+XG4gICk6IFByb21pc2U8VXBsb2FkQXZhdGFySGVhZGVyc1R5cGUgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIucHV0UHJvZmlsZShqc29uRGF0YSk7XG4gIH1cblxuICBhc3luYyB1cGxvYWRBdmF0YXIoXG4gICAgcmVxdWVzdEhlYWRlcnM6IFJlYWRvbmx5PFVwbG9hZEF2YXRhckhlYWRlcnNUeXBlPixcbiAgICBhdmF0YXJEYXRhOiBSZWFkb25seTxVaW50OEFycmF5PlxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci51cGxvYWRBdmF0YXIocmVxdWVzdEhlYWRlcnMsIGF2YXRhckRhdGEpO1xuICB9XG5cbiAgYXN5bmMgcHV0VXNlcm5hbWUoXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICApOiBQcm9taXNlPFJldHVyblR5cGU8V2ViQVBJVHlwZVsncHV0VXNlcm5hbWUnXT4+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIucHV0VXNlcm5hbWUodXNlcm5hbWUpO1xuICB9XG4gIGFzeW5jIGRlbGV0ZVVzZXJuYW1lKCk6IFByb21pc2U8UmV0dXJuVHlwZTxXZWJBUElUeXBlWydkZWxldGVVc2VybmFtZSddPj4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5kZWxldGVVc2VybmFtZSgpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQSxpQkFBa0I7QUFFbEIsa0JBQWlCO0FBQ2pCLHFCQUFtQjtBQUVuQiw4QkFHTztBQUdQLGlDQUE0QjtBQUM1QixvQkFBdUI7QUFDdkIsNkJBQWdDO0FBQ2hDLHFCQUF3QjtBQUN4Qiw4QkFBaUM7QUFDakMsNkJBQTJCO0FBRTNCLGtCQUFpQztBQWVqQyw2QkFBa0M7QUFV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
