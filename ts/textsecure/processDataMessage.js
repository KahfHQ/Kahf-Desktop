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
var processDataMessage_exports = {};
__export(processDataMessage_exports, {
  ATTACHMENT_MAX: () => ATTACHMENT_MAX,
  processAttachment: () => processAttachment,
  processContact: () => processContact,
  processDataMessage: () => processDataMessage,
  processDelete: () => processDelete,
  processGiftBadge: () => processGiftBadge,
  processGroupV2Context: () => processGroupV2Context,
  processPreview: () => processPreview,
  processQuote: () => processQuote,
  processReaction: () => processReaction,
  processSticker: () => processSticker
});
module.exports = __toCommonJS(processDataMessage_exports);
var import_long = __toESM(require("long"));
var import_zkgroup = require("@signalapp/libsignal-client/zkgroup");
var import_lodash = require("lodash");
var import_assert = require("../util/assert");
var import_dropNull = require("../util/dropNull");
var import_protobuf = require("../protobuf");
var import_groups = require("../groups");
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var import_Errors = require("./Errors");
var import_Message = require("../components/conversation/Message");
var import_MIME = require("../types/MIME");
var import_durations = require("../util/durations");
const FLAGS = import_protobuf.SignalService.DataMessage.Flags;
const ATTACHMENT_MAX = 32;
function processAttachment(attachment) {
  if (!attachment) {
    return void 0;
  }
  const { cdnId } = attachment;
  const hasCdnId = import_long.default.isLong(cdnId) ? !cdnId.isZero() : Boolean(cdnId);
  const { contentType, digest, key, size } = attachment;
  if (!(0, import_lodash.isNumber)(size)) {
    throw new Error("Missing size on incoming attachment!");
  }
  return {
    ...(0, import_dropNull.shallowDropNull)(attachment),
    cdnId: hasCdnId ? String(cdnId) : void 0,
    contentType: contentType ? (0, import_MIME.stringToMIMEType)(contentType) : import_MIME.APPLICATION_OCTET_STREAM,
    digest: digest ? Bytes.toBase64(digest) : void 0,
    key: key ? Bytes.toBase64(key) : void 0,
    size
  };
}
function processGroupContext(group) {
  if (!group) {
    return void 0;
  }
  (0, import_assert.strictAssert)(group.id, "group context without id");
  (0, import_assert.strictAssert)(group.type !== void 0 && group.type !== null, "group context without type");
  const masterKey = (0, import_Crypto.deriveMasterKeyFromGroupV1)(group.id);
  const data = (0, import_groups.deriveGroupFields)(masterKey);
  const derivedGroupV2Id = Bytes.toBase64(data.id);
  const result = {
    id: Bytes.toBinary(group.id),
    type: group.type,
    name: (0, import_dropNull.dropNull)(group.name),
    membersE164: group.membersE164 ?? [],
    avatar: processAttachment(group.avatar),
    derivedGroupV2Id
  };
  if (result.type === import_protobuf.SignalService.GroupContext.Type.DELIVER) {
    result.name = void 0;
    result.membersE164 = [];
    result.avatar = void 0;
  }
  return result;
}
function processGroupV2Context(groupV2) {
  if (!groupV2) {
    return void 0;
  }
  (0, import_assert.strictAssert)(groupV2.masterKey, "groupV2 context without masterKey");
  const data = (0, import_groups.deriveGroupFields)(groupV2.masterKey);
  return {
    masterKey: Bytes.toBase64(groupV2.masterKey),
    revision: (0, import_dropNull.dropNull)(groupV2.revision),
    groupChange: groupV2.groupChange ? Bytes.toBase64(groupV2.groupChange) : void 0,
    id: Bytes.toBase64(data.id),
    secretParams: Bytes.toBase64(data.secretParams),
    publicParams: Bytes.toBase64(data.publicParams)
  };
}
function processQuote(quote) {
  if (!quote) {
    return void 0;
  }
  return {
    id: quote.id?.toNumber(),
    authorUuid: (0, import_dropNull.dropNull)(quote.authorUuid),
    text: (0, import_dropNull.dropNull)(quote.text),
    attachments: (quote.attachments ?? []).map((attachment) => {
      return {
        contentType: (0, import_dropNull.dropNull)(attachment.contentType),
        fileName: (0, import_dropNull.dropNull)(attachment.fileName),
        thumbnail: processAttachment(attachment.thumbnail)
      };
    }),
    bodyRanges: quote.bodyRanges ?? [],
    type: quote.type || import_protobuf.SignalService.DataMessage.Quote.Type.NORMAL
  };
}
function processContact(contact) {
  if (!contact) {
    return void 0;
  }
  return contact.map((item) => {
    return {
      ...item,
      avatar: item.avatar ? {
        avatar: processAttachment(item.avatar.avatar),
        isProfile: Boolean(item.avatar.isProfile)
      } : void 0
    };
  });
}
function isLinkPreviewDateValid(value) {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value) && value > 0;
}
function cleanLinkPreviewDate(value) {
  const result = value?.toNumber();
  return isLinkPreviewDateValid(result) ? result : void 0;
}
function processPreview(preview) {
  if (!preview) {
    return void 0;
  }
  return preview.map((item) => {
    return {
      url: (0, import_dropNull.dropNull)(item.url),
      title: (0, import_dropNull.dropNull)(item.title),
      image: item.image ? processAttachment(item.image) : void 0,
      description: (0, import_dropNull.dropNull)(item.description),
      date: cleanLinkPreviewDate(item.date)
    };
  });
}
function processSticker(sticker) {
  if (!sticker) {
    return void 0;
  }
  return {
    packId: sticker.packId ? Bytes.toHex(sticker.packId) : void 0,
    packKey: sticker.packKey ? Bytes.toBase64(sticker.packKey) : void 0,
    stickerId: (0, import_dropNull.dropNull)(sticker.stickerId),
    emoji: (0, import_dropNull.dropNull)(sticker.emoji),
    data: processAttachment(sticker.data)
  };
}
function processReaction(reaction) {
  if (!reaction) {
    return void 0;
  }
  return {
    emoji: (0, import_dropNull.dropNull)(reaction.emoji),
    remove: Boolean(reaction.remove),
    targetAuthorUuid: (0, import_dropNull.dropNull)(reaction.targetAuthorUuid),
    targetTimestamp: reaction.targetTimestamp?.toNumber()
  };
}
function processDelete(del) {
  if (!del) {
    return void 0;
  }
  return {
    targetSentTimestamp: del.targetSentTimestamp?.toNumber()
  };
}
function processGiftBadge(giftBadge) {
  if (!giftBadge || !giftBadge.receiptCredentialPresentation || giftBadge.receiptCredentialPresentation.length === 0) {
    return void 0;
  }
  const receipt = new import_zkgroup.ReceiptCredentialPresentation(Buffer.from(giftBadge.receiptCredentialPresentation));
  return {
    expiration: Number(receipt.getReceiptExpirationTime()) * import_durations.SECOND,
    id: void 0,
    level: Number(receipt.getReceiptLevel()),
    receiptCredentialPresentation: Bytes.toBase64(giftBadge.receiptCredentialPresentation),
    state: import_Message.GiftBadgeStates.Unopened
  };
}
async function processDataMessage(message, envelopeTimestamp) {
  if (!message.timestamp) {
    throw new Error("Missing timestamp on dataMessage");
  }
  const timestamp = message.timestamp?.toNumber();
  if (envelopeTimestamp !== timestamp) {
    throw new Error(`Timestamp ${timestamp} in DataMessage did not match envelope timestamp ${envelopeTimestamp}`);
  }
  const result = {
    body: (0, import_dropNull.dropNull)(message.body),
    attachments: (message.attachments ?? []).map((attachment) => processAttachment(attachment)),
    group: processGroupContext(message.group),
    groupV2: processGroupV2Context(message.groupV2),
    flags: message.flags ?? 0,
    expireTimer: message.expireTimer ?? 0,
    profileKey: message.profileKey && message.profileKey.length > 0 ? Bytes.toBase64(message.profileKey) : void 0,
    timestamp,
    quote: processQuote(message.quote),
    contact: processContact(message.contact),
    preview: processPreview(message.preview),
    sticker: processSticker(message.sticker),
    requiredProtocolVersion: (0, import_dropNull.dropNull)(message.requiredProtocolVersion),
    isViewOnce: Boolean(message.isViewOnce),
    reaction: processReaction(message.reaction),
    delete: processDelete(message.delete),
    bodyRanges: message.bodyRanges ?? [],
    groupCallUpdate: (0, import_dropNull.dropNull)(message.groupCallUpdate),
    storyContext: (0, import_dropNull.dropNull)(message.storyContext),
    giftBadge: processGiftBadge(message.giftBadge)
  };
  const isEndSession = Boolean(result.flags & FLAGS.END_SESSION);
  const isExpirationTimerUpdate = Boolean(result.flags & FLAGS.EXPIRATION_TIMER_UPDATE);
  const isProfileKeyUpdate = Boolean(result.flags & FLAGS.PROFILE_KEY_UPDATE);
  const flagCount = [
    isEndSession,
    isExpirationTimerUpdate,
    isProfileKeyUpdate
  ].filter(Boolean).length;
  (0, import_assert.assert)(flagCount <= 1, `Expected exactly <=1 flags to be set, but got ${flagCount}`);
  if (isEndSession) {
    result.body = void 0;
    result.attachments = [];
    result.group = void 0;
    return result;
  }
  if (isExpirationTimerUpdate) {
    result.body = void 0;
    result.attachments = [];
  } else if (isProfileKeyUpdate) {
    result.body = void 0;
    result.attachments = [];
  } else if (result.flags !== 0) {
    throw new Error(`Unknown flags in message: ${result.flags}`);
  }
  if (result.group) {
    switch (result.group.type) {
      case import_protobuf.SignalService.GroupContext.Type.UPDATE:
        result.body = void 0;
        result.attachments = [];
        break;
      case import_protobuf.SignalService.GroupContext.Type.QUIT:
        result.body = void 0;
        result.attachments = [];
        break;
      case import_protobuf.SignalService.GroupContext.Type.DELIVER:
        break;
      default: {
        throw new import_Errors.WarnOnlyError(`Unknown group message type: ${result.group.type}`);
      }
    }
  }
  const attachmentCount = result.attachments.length;
  if (attachmentCount > ATTACHMENT_MAX) {
    throw new Error(`Too many attachments: ${attachmentCount} included in one message, max is ${ATTACHMENT_MAX}`);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTACHMENT_MAX,
  processAttachment,
  processContact,
  processDataMessage,
  processDelete,
  processGiftBadge,
  processGroupV2Context,
  processPreview,
  processQuote,
  processReaction,
  processSticker
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJvY2Vzc0RhdGFNZXNzYWdlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IExvbmcgZnJvbSAnbG9uZyc7XG5pbXBvcnQgeyBSZWNlaXB0Q3JlZGVudGlhbFByZXNlbnRhdGlvbiB9IGZyb20gJ0BzaWduYWxhcHAvbGlic2lnbmFsLWNsaWVudC96a2dyb3VwJztcbmltcG9ydCB7IGlzTnVtYmVyIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgYXNzZXJ0LCBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBkcm9wTnVsbCwgc2hhbGxvd0Ryb3BOdWxsIH0gZnJvbSAnLi4vdXRpbC9kcm9wTnVsbCc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0IHsgZGVyaXZlR3JvdXBGaWVsZHMgfSBmcm9tICcuLi9ncm91cHMnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHsgZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEgfSBmcm9tICcuLi9DcnlwdG8nO1xuXG5pbXBvcnQgdHlwZSB7XG4gIFByb2Nlc3NlZEF0dGFjaG1lbnQsXG4gIFByb2Nlc3NlZERhdGFNZXNzYWdlLFxuICBQcm9jZXNzZWRHcm91cENvbnRleHQsXG4gIFByb2Nlc3NlZEdyb3VwVjJDb250ZXh0LFxuICBQcm9jZXNzZWRRdW90ZSxcbiAgUHJvY2Vzc2VkQ29udGFjdCxcbiAgUHJvY2Vzc2VkUHJldmlldyxcbiAgUHJvY2Vzc2VkU3RpY2tlcixcbiAgUHJvY2Vzc2VkUmVhY3Rpb24sXG4gIFByb2Nlc3NlZERlbGV0ZSxcbiAgUHJvY2Vzc2VkR2lmdEJhZGdlLFxufSBmcm9tICcuL1R5cGVzLmQnO1xuaW1wb3J0IHsgV2Fybk9ubHlFcnJvciB9IGZyb20gJy4vRXJyb3JzJztcbmltcG9ydCB7IEdpZnRCYWRnZVN0YXRlcyB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL01lc3NhZ2UnO1xuaW1wb3J0IHsgQVBQTElDQVRJT05fT0NURVRfU1RSRUFNLCBzdHJpbmdUb01JTUVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvTUlNRSc7XG5pbXBvcnQgeyBTRUNPTkQgfSBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5cbmNvbnN0IEZMQUdTID0gUHJvdG8uRGF0YU1lc3NhZ2UuRmxhZ3M7XG5leHBvcnQgY29uc3QgQVRUQUNITUVOVF9NQVggPSAzMjtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NBdHRhY2htZW50KFxuICBhdHRhY2htZW50OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXJcbik6IFByb2Nlc3NlZEF0dGFjaG1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0F0dGFjaG1lbnQoXG4gIGF0dGFjaG1lbnQ/OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXIgfCBudWxsXG4pOiBQcm9jZXNzZWRBdHRhY2htZW50IHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0F0dGFjaG1lbnQoXG4gIGF0dGFjaG1lbnQ/OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXIgfCBudWxsXG4pOiBQcm9jZXNzZWRBdHRhY2htZW50IHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHsgY2RuSWQgfSA9IGF0dGFjaG1lbnQ7XG4gIGNvbnN0IGhhc0NkbklkID0gTG9uZy5pc0xvbmcoY2RuSWQpID8gIWNkbklkLmlzWmVybygpIDogQm9vbGVhbihjZG5JZCk7XG5cbiAgY29uc3QgeyBjb250ZW50VHlwZSwgZGlnZXN0LCBrZXksIHNpemUgfSA9IGF0dGFjaG1lbnQ7XG4gIGlmICghaXNOdW1iZXIoc2l6ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgc2l6ZSBvbiBpbmNvbWluZyBhdHRhY2htZW50IScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zaGFsbG93RHJvcE51bGwoYXR0YWNobWVudCksXG5cbiAgICBjZG5JZDogaGFzQ2RuSWQgPyBTdHJpbmcoY2RuSWQpIDogdW5kZWZpbmVkLFxuICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZVxuICAgICAgPyBzdHJpbmdUb01JTUVUeXBlKGNvbnRlbnRUeXBlKVxuICAgICAgOiBBUFBMSUNBVElPTl9PQ1RFVF9TVFJFQU0sXG4gICAgZGlnZXN0OiBkaWdlc3QgPyBCeXRlcy50b0Jhc2U2NChkaWdlc3QpIDogdW5kZWZpbmVkLFxuICAgIGtleToga2V5ID8gQnl0ZXMudG9CYXNlNjQoa2V5KSA6IHVuZGVmaW5lZCxcbiAgICBzaXplLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzR3JvdXBDb250ZXh0KFxuICBncm91cD86IFByb3RvLklHcm91cENvbnRleHQgfCBudWxsXG4pOiBQcm9jZXNzZWRHcm91cENvbnRleHQgfCB1bmRlZmluZWQge1xuICBpZiAoIWdyb3VwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHN0cmljdEFzc2VydChncm91cC5pZCwgJ2dyb3VwIGNvbnRleHQgd2l0aG91dCBpZCcpO1xuICBzdHJpY3RBc3NlcnQoXG4gICAgZ3JvdXAudHlwZSAhPT0gdW5kZWZpbmVkICYmIGdyb3VwLnR5cGUgIT09IG51bGwsXG4gICAgJ2dyb3VwIGNvbnRleHQgd2l0aG91dCB0eXBlJ1xuICApO1xuXG4gIGNvbnN0IG1hc3RlcktleSA9IGRlcml2ZU1hc3RlcktleUZyb21Hcm91cFYxKGdyb3VwLmlkKTtcbiAgY29uc3QgZGF0YSA9IGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleSk7XG5cbiAgY29uc3QgZGVyaXZlZEdyb3VwVjJJZCA9IEJ5dGVzLnRvQmFzZTY0KGRhdGEuaWQpO1xuXG4gIGNvbnN0IHJlc3VsdDogUHJvY2Vzc2VkR3JvdXBDb250ZXh0ID0ge1xuICAgIGlkOiBCeXRlcy50b0JpbmFyeShncm91cC5pZCksXG4gICAgdHlwZTogZ3JvdXAudHlwZSxcbiAgICBuYW1lOiBkcm9wTnVsbChncm91cC5uYW1lKSxcbiAgICBtZW1iZXJzRTE2NDogZ3JvdXAubWVtYmVyc0UxNjQgPz8gW10sXG4gICAgYXZhdGFyOiBwcm9jZXNzQXR0YWNobWVudChncm91cC5hdmF0YXIpLFxuICAgIGRlcml2ZWRHcm91cFYySWQsXG4gIH07XG5cbiAgaWYgKHJlc3VsdC50eXBlID09PSBQcm90by5Hcm91cENvbnRleHQuVHlwZS5ERUxJVkVSKSB7XG4gICAgcmVzdWx0Lm5hbWUgPSB1bmRlZmluZWQ7XG4gICAgcmVzdWx0Lm1lbWJlcnNFMTY0ID0gW107XG4gICAgcmVzdWx0LmF2YXRhciA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzR3JvdXBWMkNvbnRleHQoXG4gIGdyb3VwVjI/OiBQcm90by5JR3JvdXBDb250ZXh0VjIgfCBudWxsXG4pOiBQcm9jZXNzZWRHcm91cFYyQ29udGV4dCB8IHVuZGVmaW5lZCB7XG4gIGlmICghZ3JvdXBWMikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBzdHJpY3RBc3NlcnQoZ3JvdXBWMi5tYXN0ZXJLZXksICdncm91cFYyIGNvbnRleHQgd2l0aG91dCBtYXN0ZXJLZXknKTtcbiAgY29uc3QgZGF0YSA9IGRlcml2ZUdyb3VwRmllbGRzKGdyb3VwVjIubWFzdGVyS2V5KTtcblxuICByZXR1cm4ge1xuICAgIG1hc3RlcktleTogQnl0ZXMudG9CYXNlNjQoZ3JvdXBWMi5tYXN0ZXJLZXkpLFxuICAgIHJldmlzaW9uOiBkcm9wTnVsbChncm91cFYyLnJldmlzaW9uKSxcbiAgICBncm91cENoYW5nZTogZ3JvdXBWMi5ncm91cENoYW5nZVxuICAgICAgPyBCeXRlcy50b0Jhc2U2NChncm91cFYyLmdyb3VwQ2hhbmdlKVxuICAgICAgOiB1bmRlZmluZWQsXG4gICAgaWQ6IEJ5dGVzLnRvQmFzZTY0KGRhdGEuaWQpLFxuICAgIHNlY3JldFBhcmFtczogQnl0ZXMudG9CYXNlNjQoZGF0YS5zZWNyZXRQYXJhbXMpLFxuICAgIHB1YmxpY1BhcmFtczogQnl0ZXMudG9CYXNlNjQoZGF0YS5wdWJsaWNQYXJhbXMpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc1F1b3RlKFxuICBxdW90ZT86IFByb3RvLkRhdGFNZXNzYWdlLklRdW90ZSB8IG51bGxcbik6IFByb2Nlc3NlZFF1b3RlIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFxdW90ZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGlkOiBxdW90ZS5pZD8udG9OdW1iZXIoKSxcbiAgICBhdXRob3JVdWlkOiBkcm9wTnVsbChxdW90ZS5hdXRob3JVdWlkKSxcbiAgICB0ZXh0OiBkcm9wTnVsbChxdW90ZS50ZXh0KSxcbiAgICBhdHRhY2htZW50czogKHF1b3RlLmF0dGFjaG1lbnRzID8/IFtdKS5tYXAoYXR0YWNobWVudCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb250ZW50VHlwZTogZHJvcE51bGwoYXR0YWNobWVudC5jb250ZW50VHlwZSksXG4gICAgICAgIGZpbGVOYW1lOiBkcm9wTnVsbChhdHRhY2htZW50LmZpbGVOYW1lKSxcbiAgICAgICAgdGh1bWJuYWlsOiBwcm9jZXNzQXR0YWNobWVudChhdHRhY2htZW50LnRodW1ibmFpbCksXG4gICAgICB9O1xuICAgIH0pLFxuICAgIGJvZHlSYW5nZXM6IHF1b3RlLmJvZHlSYW5nZXMgPz8gW10sXG4gICAgdHlwZTogcXVvdGUudHlwZSB8fCBQcm90by5EYXRhTWVzc2FnZS5RdW90ZS5UeXBlLk5PUk1BTCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NDb250YWN0KFxuICBjb250YWN0PzogUmVhZG9ubHlBcnJheTxQcm90by5EYXRhTWVzc2FnZS5JQ29udGFjdD4gfCBudWxsXG4pOiBSZWFkb25seUFycmF5PFByb2Nlc3NlZENvbnRhY3Q+IHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFjb250YWN0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBjb250YWN0Lm1hcChpdGVtID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uaXRlbSxcbiAgICAgIGF2YXRhcjogaXRlbS5hdmF0YXJcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBhdmF0YXI6IHByb2Nlc3NBdHRhY2htZW50KGl0ZW0uYXZhdGFyLmF2YXRhciksXG4gICAgICAgICAgICBpc1Byb2ZpbGU6IEJvb2xlYW4oaXRlbS5hdmF0YXIuaXNQcm9maWxlKSxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc0xpbmtQcmV2aWV3RGF0ZVZhbGlkKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgbnVtYmVyIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgIU51bWJlci5pc05hTih2YWx1ZSkgJiZcbiAgICBOdW1iZXIuaXNGaW5pdGUodmFsdWUpICYmXG4gICAgdmFsdWUgPiAwXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuTGlua1ByZXZpZXdEYXRlKHZhbHVlPzogTG9uZyB8IG51bGwpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCByZXN1bHQgPSB2YWx1ZT8udG9OdW1iZXIoKTtcbiAgcmV0dXJuIGlzTGlua1ByZXZpZXdEYXRlVmFsaWQocmVzdWx0KSA/IHJlc3VsdCA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NQcmV2aWV3KFxuICBwcmV2aWV3PzogUmVhZG9ubHlBcnJheTxQcm90by5EYXRhTWVzc2FnZS5JUHJldmlldz4gfCBudWxsXG4pOiBSZWFkb25seUFycmF5PFByb2Nlc3NlZFByZXZpZXc+IHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFwcmV2aWV3KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBwcmV2aWV3Lm1hcChpdGVtID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBkcm9wTnVsbChpdGVtLnVybCksXG4gICAgICB0aXRsZTogZHJvcE51bGwoaXRlbS50aXRsZSksXG4gICAgICBpbWFnZTogaXRlbS5pbWFnZSA/IHByb2Nlc3NBdHRhY2htZW50KGl0ZW0uaW1hZ2UpIDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246IGRyb3BOdWxsKGl0ZW0uZGVzY3JpcHRpb24pLFxuICAgICAgZGF0ZTogY2xlYW5MaW5rUHJldmlld0RhdGUoaXRlbS5kYXRlKSxcbiAgICB9O1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NTdGlja2VyKFxuICBzdGlja2VyPzogUHJvdG8uRGF0YU1lc3NhZ2UuSVN0aWNrZXIgfCBudWxsXG4pOiBQcm9jZXNzZWRTdGlja2VyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFzdGlja2VyKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGFja0lkOiBzdGlja2VyLnBhY2tJZCA/IEJ5dGVzLnRvSGV4KHN0aWNrZXIucGFja0lkKSA6IHVuZGVmaW5lZCxcbiAgICBwYWNrS2V5OiBzdGlja2VyLnBhY2tLZXkgPyBCeXRlcy50b0Jhc2U2NChzdGlja2VyLnBhY2tLZXkpIDogdW5kZWZpbmVkLFxuICAgIHN0aWNrZXJJZDogZHJvcE51bGwoc3RpY2tlci5zdGlja2VySWQpLFxuICAgIGVtb2ppOiBkcm9wTnVsbChzdGlja2VyLmVtb2ppKSxcbiAgICBkYXRhOiBwcm9jZXNzQXR0YWNobWVudChzdGlja2VyLmRhdGEpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc1JlYWN0aW9uKFxuICByZWFjdGlvbj86IFByb3RvLkRhdGFNZXNzYWdlLklSZWFjdGlvbiB8IG51bGxcbik6IFByb2Nlc3NlZFJlYWN0aW9uIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFyZWFjdGlvbikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVtb2ppOiBkcm9wTnVsbChyZWFjdGlvbi5lbW9qaSksXG4gICAgcmVtb3ZlOiBCb29sZWFuKHJlYWN0aW9uLnJlbW92ZSksXG4gICAgdGFyZ2V0QXV0aG9yVXVpZDogZHJvcE51bGwocmVhY3Rpb24udGFyZ2V0QXV0aG9yVXVpZCksXG4gICAgdGFyZ2V0VGltZXN0YW1wOiByZWFjdGlvbi50YXJnZXRUaW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRGVsZXRlKFxuICBkZWw/OiBQcm90by5EYXRhTWVzc2FnZS5JRGVsZXRlIHwgbnVsbFxuKTogUHJvY2Vzc2VkRGVsZXRlIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFkZWwpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YXJnZXRTZW50VGltZXN0YW1wOiBkZWwudGFyZ2V0U2VudFRpbWVzdGFtcD8udG9OdW1iZXIoKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NHaWZ0QmFkZ2UoXG4gIGdpZnRCYWRnZTogUHJvdG8uRGF0YU1lc3NhZ2UuSUdpZnRCYWRnZSB8IG51bGwgfCB1bmRlZmluZWRcbik6IFByb2Nlc3NlZEdpZnRCYWRnZSB8IHVuZGVmaW5lZCB7XG4gIGlmIChcbiAgICAhZ2lmdEJhZGdlIHx8XG4gICAgIWdpZnRCYWRnZS5yZWNlaXB0Q3JlZGVudGlhbFByZXNlbnRhdGlvbiB8fFxuICAgIGdpZnRCYWRnZS5yZWNlaXB0Q3JlZGVudGlhbFByZXNlbnRhdGlvbi5sZW5ndGggPT09IDBcbiAgKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHJlY2VpcHQgPSBuZXcgUmVjZWlwdENyZWRlbnRpYWxQcmVzZW50YXRpb24oXG4gICAgQnVmZmVyLmZyb20oZ2lmdEJhZGdlLnJlY2VpcHRDcmVkZW50aWFsUHJlc2VudGF0aW9uKVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgZXhwaXJhdGlvbjogTnVtYmVyKHJlY2VpcHQuZ2V0UmVjZWlwdEV4cGlyYXRpb25UaW1lKCkpICogU0VDT05ELFxuICAgIGlkOiB1bmRlZmluZWQsXG4gICAgbGV2ZWw6IE51bWJlcihyZWNlaXB0LmdldFJlY2VpcHRMZXZlbCgpKSxcbiAgICByZWNlaXB0Q3JlZGVudGlhbFByZXNlbnRhdGlvbjogQnl0ZXMudG9CYXNlNjQoXG4gICAgICBnaWZ0QmFkZ2UucmVjZWlwdENyZWRlbnRpYWxQcmVzZW50YXRpb25cbiAgICApLFxuICAgIHN0YXRlOiBHaWZ0QmFkZ2VTdGF0ZXMuVW5vcGVuZWQsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9jZXNzRGF0YU1lc3NhZ2UoXG4gIG1lc3NhZ2U6IFByb3RvLklEYXRhTWVzc2FnZSxcbiAgZW52ZWxvcGVUaW1lc3RhbXA6IG51bWJlclxuKTogUHJvbWlzZTxQcm9jZXNzZWREYXRhTWVzc2FnZT4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG5cbiAgLy8gTm93IHRoYXQgaXRzIGRlY3J5cHRlZCwgdmFsaWRhdGUgdGhlIG1lc3NhZ2UgYW5kIGNsZWFuIGl0IHVwIGZvciBjb25zdW1lclxuICAvLyAgIHByb2Nlc3NpbmdcbiAgLy8gTm90ZSB0aGF0IG1lc3NhZ2VzIG1heSAoZ2VuZXJhbGx5KSBvbmx5IHBlcmZvcm0gb25lIGFjdGlvbiBhbmQgd2UgaWdub3JlIHJlbWFpbmluZ1xuICAvLyAgIGZpZWxkcyBhZnRlciB0aGUgZmlyc3QgYWN0aW9uLlxuXG4gIGlmICghbWVzc2FnZS50aW1lc3RhbXApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgdGltZXN0YW1wIG9uIGRhdGFNZXNzYWdlJyk7XG4gIH1cblxuICBjb25zdCB0aW1lc3RhbXAgPSBtZXNzYWdlLnRpbWVzdGFtcD8udG9OdW1iZXIoKTtcblxuICBpZiAoZW52ZWxvcGVUaW1lc3RhbXAgIT09IHRpbWVzdGFtcCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBUaW1lc3RhbXAgJHt0aW1lc3RhbXB9IGluIERhdGFNZXNzYWdlIGRpZCBub3QgYCArXG4gICAgICAgIGBtYXRjaCBlbnZlbG9wZSB0aW1lc3RhbXAgJHtlbnZlbG9wZVRpbWVzdGFtcH1gXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdDogUHJvY2Vzc2VkRGF0YU1lc3NhZ2UgPSB7XG4gICAgYm9keTogZHJvcE51bGwobWVzc2FnZS5ib2R5KSxcbiAgICBhdHRhY2htZW50czogKG1lc3NhZ2UuYXR0YWNobWVudHMgPz8gW10pLm1hcChcbiAgICAgIChhdHRhY2htZW50OiBQcm90by5JQXR0YWNobWVudFBvaW50ZXIpID0+IHByb2Nlc3NBdHRhY2htZW50KGF0dGFjaG1lbnQpXG4gICAgKSxcbiAgICBncm91cDogcHJvY2Vzc0dyb3VwQ29udGV4dChtZXNzYWdlLmdyb3VwKSxcbiAgICBncm91cFYyOiBwcm9jZXNzR3JvdXBWMkNvbnRleHQobWVzc2FnZS5ncm91cFYyKSxcbiAgICBmbGFnczogbWVzc2FnZS5mbGFncyA/PyAwLFxuICAgIGV4cGlyZVRpbWVyOiBtZXNzYWdlLmV4cGlyZVRpbWVyID8/IDAsXG4gICAgcHJvZmlsZUtleTpcbiAgICAgIG1lc3NhZ2UucHJvZmlsZUtleSAmJiBtZXNzYWdlLnByb2ZpbGVLZXkubGVuZ3RoID4gMFxuICAgICAgICA/IEJ5dGVzLnRvQmFzZTY0KG1lc3NhZ2UucHJvZmlsZUtleSlcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgdGltZXN0YW1wLFxuICAgIHF1b3RlOiBwcm9jZXNzUXVvdGUobWVzc2FnZS5xdW90ZSksXG4gICAgY29udGFjdDogcHJvY2Vzc0NvbnRhY3QobWVzc2FnZS5jb250YWN0KSxcbiAgICBwcmV2aWV3OiBwcm9jZXNzUHJldmlldyhtZXNzYWdlLnByZXZpZXcpLFxuICAgIHN0aWNrZXI6IHByb2Nlc3NTdGlja2VyKG1lc3NhZ2Uuc3RpY2tlciksXG4gICAgcmVxdWlyZWRQcm90b2NvbFZlcnNpb246IGRyb3BOdWxsKG1lc3NhZ2UucmVxdWlyZWRQcm90b2NvbFZlcnNpb24pLFxuICAgIGlzVmlld09uY2U6IEJvb2xlYW4obWVzc2FnZS5pc1ZpZXdPbmNlKSxcbiAgICByZWFjdGlvbjogcHJvY2Vzc1JlYWN0aW9uKG1lc3NhZ2UucmVhY3Rpb24pLFxuICAgIGRlbGV0ZTogcHJvY2Vzc0RlbGV0ZShtZXNzYWdlLmRlbGV0ZSksXG4gICAgYm9keVJhbmdlczogbWVzc2FnZS5ib2R5UmFuZ2VzID8/IFtdLFxuICAgIGdyb3VwQ2FsbFVwZGF0ZTogZHJvcE51bGwobWVzc2FnZS5ncm91cENhbGxVcGRhdGUpLFxuICAgIHN0b3J5Q29udGV4dDogZHJvcE51bGwobWVzc2FnZS5zdG9yeUNvbnRleHQpLFxuICAgIGdpZnRCYWRnZTogcHJvY2Vzc0dpZnRCYWRnZShtZXNzYWdlLmdpZnRCYWRnZSksXG4gIH07XG5cbiAgY29uc3QgaXNFbmRTZXNzaW9uID0gQm9vbGVhbihyZXN1bHQuZmxhZ3MgJiBGTEFHUy5FTkRfU0VTU0lPTik7XG4gIGNvbnN0IGlzRXhwaXJhdGlvblRpbWVyVXBkYXRlID0gQm9vbGVhbihcbiAgICByZXN1bHQuZmxhZ3MgJiBGTEFHUy5FWFBJUkFUSU9OX1RJTUVSX1VQREFURVxuICApO1xuICBjb25zdCBpc1Byb2ZpbGVLZXlVcGRhdGUgPSBCb29sZWFuKHJlc3VsdC5mbGFncyAmIEZMQUdTLlBST0ZJTEVfS0VZX1VQREFURSk7XG4gIC8vIFRoZSBmb2xsb3dpbmcgYXNzZXJ0aW9uIGNvZGlmaWVzIGFuIGFzc3VtcHRpb246IDAgb3IgMSBmbGFncyBhcmUgc2V0LCBidXQgbmV2ZXJcbiAgLy8gICBtb3JlLiBUaGlzIGFzc3VtcHRpb24gaXMgZmluZSBhcyBvZiB0aGlzIHdyaXRpbmcsIGJ1dCBtYXkgbm90IGFsd2F5cyBiZS5cbiAgY29uc3QgZmxhZ0NvdW50ID0gW1xuICAgIGlzRW5kU2Vzc2lvbixcbiAgICBpc0V4cGlyYXRpb25UaW1lclVwZGF0ZSxcbiAgICBpc1Byb2ZpbGVLZXlVcGRhdGUsXG4gIF0uZmlsdGVyKEJvb2xlYW4pLmxlbmd0aDtcbiAgYXNzZXJ0KFxuICAgIGZsYWdDb3VudCA8PSAxLFxuICAgIGBFeHBlY3RlZCBleGFjdGx5IDw9MSBmbGFncyB0byBiZSBzZXQsIGJ1dCBnb3QgJHtmbGFnQ291bnR9YFxuICApO1xuXG4gIGlmIChpc0VuZFNlc3Npb24pIHtcbiAgICByZXN1bHQuYm9keSA9IHVuZGVmaW5lZDtcbiAgICByZXN1bHQuYXR0YWNobWVudHMgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXAgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChpc0V4cGlyYXRpb25UaW1lclVwZGF0ZSkge1xuICAgIHJlc3VsdC5ib2R5ID0gdW5kZWZpbmVkO1xuICAgIHJlc3VsdC5hdHRhY2htZW50cyA9IFtdO1xuICB9IGVsc2UgaWYgKGlzUHJvZmlsZUtleVVwZGF0ZSkge1xuICAgIHJlc3VsdC5ib2R5ID0gdW5kZWZpbmVkO1xuICAgIHJlc3VsdC5hdHRhY2htZW50cyA9IFtdO1xuICB9IGVsc2UgaWYgKHJlc3VsdC5mbGFncyAhPT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBmbGFncyBpbiBtZXNzYWdlOiAke3Jlc3VsdC5mbGFnc31gKTtcbiAgfVxuXG4gIGlmIChyZXN1bHQuZ3JvdXApIHtcbiAgICBzd2l0Y2ggKHJlc3VsdC5ncm91cC50eXBlKSB7XG4gICAgICBjYXNlIFByb3RvLkdyb3VwQ29udGV4dC5UeXBlLlVQREFURTpcbiAgICAgICAgcmVzdWx0LmJvZHkgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJlc3VsdC5hdHRhY2htZW50cyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJvdG8uR3JvdXBDb250ZXh0LlR5cGUuUVVJVDpcbiAgICAgICAgcmVzdWx0LmJvZHkgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJlc3VsdC5hdHRhY2htZW50cyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJvdG8uR3JvdXBDb250ZXh0LlR5cGUuREVMSVZFUjpcbiAgICAgICAgLy8gQ2xlYW5lZCB1cCBpbiBgcHJvY2Vzc0dyb3VwQ29udGV4dGBcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHRocm93IG5ldyBXYXJuT25seUVycm9yKFxuICAgICAgICAgIGBVbmtub3duIGdyb3VwIG1lc3NhZ2UgdHlwZTogJHtyZXN1bHQuZ3JvdXAudHlwZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYXR0YWNobWVudENvdW50ID0gcmVzdWx0LmF0dGFjaG1lbnRzLmxlbmd0aDtcbiAgaWYgKGF0dGFjaG1lbnRDb3VudCA+IEFUVEFDSE1FTlRfTUFYKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFRvbyBtYW55IGF0dGFjaG1lbnRzOiAke2F0dGFjaG1lbnRDb3VudH0gaW5jbHVkZWQgaW4gb25lIG1lc3NhZ2UsIGAgK1xuICAgICAgICBgbWF4IGlzICR7QVRUQUNITUVOVF9NQVh9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esa0JBQWlCO0FBQ2pCLHFCQUE4QztBQUM5QyxvQkFBeUI7QUFFekIsb0JBQXFDO0FBQ3JDLHNCQUEwQztBQUMxQyxzQkFBdUM7QUFDdkMsb0JBQWtDO0FBQ2xDLFlBQXVCO0FBQ3ZCLG9CQUEyQztBQWUzQyxv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