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
var storageRecordOps_exports = {};
__export(storageRecordOps_exports, {
  mergeAccountRecord: () => mergeAccountRecord,
  mergeContactRecord: () => mergeContactRecord,
  mergeGroupV1Record: () => mergeGroupV1Record,
  mergeGroupV2Record: () => mergeGroupV2Record,
  mergeStickerPackRecord: () => mergeStickerPackRecord,
  mergeStoryDistributionListRecord: () => mergeStoryDistributionListRecord,
  toAccountRecord: () => toAccountRecord,
  toContactRecord: () => toContactRecord,
  toGroupV1Record: () => toGroupV1Record,
  toGroupV2Record: () => toGroupV2Record,
  toStickerPackRecord: () => toStickerPackRecord,
  toStoryDistributionListRecord: () => toStoryDistributionListRecord
});
module.exports = __toCommonJS(storageRecordOps_exports);
var import_lodash = require("lodash");
var import_long = __toESM(require("long"));
var import_Crypto = require("../Crypto");
var Bytes = __toESM(require("../Bytes"));
var import_groups = require("../groups");
var import_assert = require("../util/assert");
var import_dropNull = require("../util/dropNull");
var import_normalizeUuid = require("../util/normalizeUuid");
var import_missingCaseError = require("../util/missingCaseError");
var import_phoneNumberSharingMode = require("../util/phoneNumberSharingMode");
var import_phoneNumberDiscoverability = require("../util/phoneNumberDiscoverability");
var import_arePinnedConversationsEqual = require("../util/arePinnedConversationsEqual");
var import_timestampLongUtils = require("../util/timestampLongUtils");
var import_universalExpireTimer = require("../util/universalExpireTimer");
var import_ourProfileKey = require("./ourProfileKey");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_UUID = require("../types/UUID");
var preferredReactionEmoji = __toESM(require("../reactions/preferredReactionEmoji"));
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var Stickers = __toESM(require("../types/Stickers"));
var import_Client = __toESM(require("../sql/Client"));
var import_Stories = require("../types/Stories");
const MY_STORIES_BYTES = (0, import_Crypto.uuidToBytes)(import_Stories.MY_STORIES_ID);
function toRecordVerified(verified) {
  const VERIFIED_ENUM = window.textsecure.storage.protocol.VerifiedStatus;
  const STATE_ENUM = import_protobuf.SignalService.ContactRecord.IdentityState;
  switch (verified) {
    case VERIFIED_ENUM.VERIFIED:
      return STATE_ENUM.VERIFIED;
    case VERIFIED_ENUM.UNVERIFIED:
      return STATE_ENUM.UNVERIFIED;
    default:
      return STATE_ENUM.DEFAULT;
  }
}
function addUnknownFields(record, conversation, details) {
  if (record.__unknownFields) {
    details.push("adding unknown fields");
    conversation.set({
      storageUnknownFields: Bytes.toBase64(Bytes.concatenate(record.__unknownFields))
    });
  } else if (conversation.get("storageUnknownFields")) {
    details.push("clearing unknown fields");
    conversation.unset("storageUnknownFields");
  }
}
function applyUnknownFields(record, conversation) {
  const storageUnknownFields = conversation.get("storageUnknownFields");
  if (storageUnknownFields) {
    log.info("storageService.applyUnknownFields: Applying unknown fields for", conversation.idForLogging());
    record.__unknownFields = [Bytes.fromBase64(storageUnknownFields)];
  }
}
async function toContactRecord(conversation) {
  const contactRecord = new import_protobuf.SignalService.ContactRecord();
  const uuid = conversation.getUuid();
  if (uuid) {
    contactRecord.serviceUuid = uuid.toString();
  }
  const e164 = conversation.get("e164");
  if (e164) {
    contactRecord.serviceE164 = e164;
  }
  const pni = conversation.get("pni");
  if (pni) {
    contactRecord.pni = pni;
  }
  const profileKey = conversation.get("profileKey");
  if (profileKey) {
    contactRecord.profileKey = Bytes.fromBase64(String(profileKey));
  }
  const identityKey = uuid ? await window.textsecure.storage.protocol.loadIdentityKey(uuid) : void 0;
  if (identityKey) {
    contactRecord.identityKey = identityKey;
  }
  const verified = conversation.get("verified");
  if (verified) {
    contactRecord.identityState = toRecordVerified(Number(verified));
  }
  const profileName = conversation.get("profileName");
  if (profileName) {
    contactRecord.givenName = profileName;
  }
  const profileFamilyName = conversation.get("profileFamilyName");
  if (profileFamilyName) {
    contactRecord.familyName = profileFamilyName;
  }
  contactRecord.blocked = conversation.isBlocked();
  contactRecord.whitelisted = Boolean(conversation.get("profileSharing"));
  contactRecord.archived = Boolean(conversation.get("isArchived"));
  contactRecord.markedUnread = Boolean(conversation.get("markedUnread"));
  contactRecord.mutedUntilTimestamp = (0, import_timestampLongUtils.getSafeLongFromTimestamp)(conversation.get("muteExpiresAt"));
  if (conversation.get("hideStory") !== void 0) {
    contactRecord.hideStory = Boolean(conversation.get("hideStory"));
  }
  applyUnknownFields(contactRecord, conversation);
  return contactRecord;
}
function toAccountRecord(conversation) {
  const accountRecord = new import_protobuf.SignalService.AccountRecord();
  if (conversation.get("profileKey")) {
    accountRecord.profileKey = Bytes.fromBase64(String(conversation.get("profileKey")));
  }
  if (conversation.get("profileName")) {
    accountRecord.givenName = conversation.get("profileName") || "";
  }
  if (conversation.get("profileFamilyName")) {
    accountRecord.familyName = conversation.get("profileFamilyName") || "";
  }
  const avatarUrl = window.storage.get("avatarUrl");
  if (avatarUrl !== void 0) {
    accountRecord.avatarUrl = avatarUrl;
  }
  accountRecord.noteToSelfArchived = Boolean(conversation.get("isArchived"));
  accountRecord.noteToSelfMarkedUnread = Boolean(conversation.get("markedUnread"));
  accountRecord.readReceipts = Boolean(window.Events.getReadReceiptSetting());
  accountRecord.sealedSenderIndicators = Boolean(window.storage.get("sealedSenderIndicators"));
  accountRecord.typingIndicators = Boolean(window.Events.getTypingIndicatorSetting());
  accountRecord.linkPreviews = Boolean(window.Events.getLinkPreviewSetting());
  const preferContactAvatars = window.storage.get("preferContactAvatars");
  if (preferContactAvatars !== void 0) {
    accountRecord.preferContactAvatars = Boolean(preferContactAvatars);
  }
  const primarySendsSms = window.storage.get("primarySendsSms");
  if (primarySendsSms !== void 0) {
    accountRecord.primarySendsSms = Boolean(primarySendsSms);
  }
  const accountE164 = window.storage.get("accountE164");
  if (accountE164 !== void 0) {
    accountRecord.e164 = accountE164;
  }
  const rawPreferredReactionEmoji = window.storage.get("preferredReactionEmoji");
  if (preferredReactionEmoji.canBeSynced(rawPreferredReactionEmoji)) {
    accountRecord.preferredReactionEmoji = rawPreferredReactionEmoji;
  }
  const universalExpireTimer = (0, import_universalExpireTimer.get)();
  if (universalExpireTimer) {
    accountRecord.universalExpireTimer = Number(universalExpireTimer);
  }
  const PHONE_NUMBER_SHARING_MODE_ENUM = import_protobuf.SignalService.AccountRecord.PhoneNumberSharingMode;
  const phoneNumberSharingMode = (0, import_phoneNumberSharingMode.parsePhoneNumberSharingMode)(window.storage.get("phoneNumberSharingMode"));
  switch (phoneNumberSharingMode) {
    case import_phoneNumberSharingMode.PhoneNumberSharingMode.Everybody:
      accountRecord.phoneNumberSharingMode = PHONE_NUMBER_SHARING_MODE_ENUM.EVERYBODY;
      break;
    case import_phoneNumberSharingMode.PhoneNumberSharingMode.ContactsOnly:
      accountRecord.phoneNumberSharingMode = PHONE_NUMBER_SHARING_MODE_ENUM.CONTACTS_ONLY;
      break;
    case import_phoneNumberSharingMode.PhoneNumberSharingMode.Nobody:
      accountRecord.phoneNumberSharingMode = PHONE_NUMBER_SHARING_MODE_ENUM.NOBODY;
      break;
    default:
      throw (0, import_missingCaseError.missingCaseError)(phoneNumberSharingMode);
  }
  const phoneNumberDiscoverability = (0, import_phoneNumberDiscoverability.parsePhoneNumberDiscoverability)(window.storage.get("phoneNumberDiscoverability"));
  switch (phoneNumberDiscoverability) {
    case import_phoneNumberDiscoverability.PhoneNumberDiscoverability.Discoverable:
      accountRecord.notDiscoverableByPhoneNumber = false;
      break;
    case import_phoneNumberDiscoverability.PhoneNumberDiscoverability.NotDiscoverable:
      accountRecord.notDiscoverableByPhoneNumber = true;
      break;
    default:
      throw (0, import_missingCaseError.missingCaseError)(phoneNumberDiscoverability);
  }
  const pinnedConversations = window.storage.get("pinnedConversationIds", new Array()).map((id) => {
    const pinnedConversation = window.ConversationController.get(id);
    if (pinnedConversation) {
      const pinnedConversationRecord = new import_protobuf.SignalService.AccountRecord.PinnedConversation();
      if (pinnedConversation.get("type") === "private") {
        pinnedConversationRecord.identifier = "contact";
        pinnedConversationRecord.contact = {
          uuid: pinnedConversation.get("uuid"),
          e164: pinnedConversation.get("e164")
        };
      } else if ((0, import_whatTypeOfConversation.isGroupV1)(pinnedConversation.attributes)) {
        pinnedConversationRecord.identifier = "legacyGroupId";
        const groupId = pinnedConversation.get("groupId");
        if (!groupId) {
          throw new Error("toAccountRecord: trying to pin a v1 Group without groupId");
        }
        pinnedConversationRecord.legacyGroupId = Bytes.fromBinary(groupId);
      } else if ((0, import_whatTypeOfConversation.isGroupV2)(pinnedConversation.attributes)) {
        pinnedConversationRecord.identifier = "groupMasterKey";
        const masterKey = pinnedConversation.get("masterKey");
        if (!masterKey) {
          throw new Error("toAccountRecord: trying to pin a v2 Group without masterKey");
        }
        pinnedConversationRecord.groupMasterKey = Bytes.fromBase64(masterKey);
      }
      return pinnedConversationRecord;
    }
    return void 0;
  }).filter((pinnedConversationClass) => pinnedConversationClass !== void 0);
  accountRecord.pinnedConversations = pinnedConversations;
  const subscriberId = window.storage.get("subscriberId");
  if (subscriberId instanceof Uint8Array) {
    accountRecord.subscriberId = subscriberId;
  }
  const subscriberCurrencyCode = window.storage.get("subscriberCurrencyCode");
  if (typeof subscriberCurrencyCode === "string") {
    accountRecord.subscriberCurrencyCode = subscriberCurrencyCode;
  }
  const displayBadgesOnProfile = window.storage.get("displayBadgesOnProfile");
  if (displayBadgesOnProfile !== void 0) {
    accountRecord.displayBadgesOnProfile = displayBadgesOnProfile;
  }
  const keepMutedChatsArchived = window.storage.get("keepMutedChatsArchived");
  if (keepMutedChatsArchived !== void 0) {
    accountRecord.keepMutedChatsArchived = keepMutedChatsArchived;
  }
  applyUnknownFields(accountRecord, conversation);
  return accountRecord;
}
function toGroupV1Record(conversation) {
  const groupV1Record = new import_protobuf.SignalService.GroupV1Record();
  groupV1Record.id = Bytes.fromBinary(String(conversation.get("groupId")));
  groupV1Record.blocked = conversation.isBlocked();
  groupV1Record.whitelisted = Boolean(conversation.get("profileSharing"));
  groupV1Record.archived = Boolean(conversation.get("isArchived"));
  groupV1Record.markedUnread = Boolean(conversation.get("markedUnread"));
  groupV1Record.mutedUntilTimestamp = (0, import_timestampLongUtils.getSafeLongFromTimestamp)(conversation.get("muteExpiresAt"));
  applyUnknownFields(groupV1Record, conversation);
  return groupV1Record;
}
function toGroupV2Record(conversation) {
  const groupV2Record = new import_protobuf.SignalService.GroupV2Record();
  const masterKey = conversation.get("masterKey");
  if (masterKey !== void 0) {
    groupV2Record.masterKey = Bytes.fromBase64(masterKey);
  }
  groupV2Record.blocked = conversation.isBlocked();
  groupV2Record.whitelisted = Boolean(conversation.get("profileSharing"));
  groupV2Record.archived = Boolean(conversation.get("isArchived"));
  groupV2Record.markedUnread = Boolean(conversation.get("markedUnread"));
  groupV2Record.mutedUntilTimestamp = (0, import_timestampLongUtils.getSafeLongFromTimestamp)(conversation.get("muteExpiresAt"));
  groupV2Record.dontNotifyForMentionsIfMuted = Boolean(conversation.get("dontNotifyForMentionsIfMuted"));
  groupV2Record.hideStory = Boolean(conversation.get("hideStory"));
  applyUnknownFields(groupV2Record, conversation);
  return groupV2Record;
}
function toStoryDistributionListRecord(storyDistributionList) {
  const storyDistributionListRecord = new import_protobuf.SignalService.StoryDistributionListRecord();
  storyDistributionListRecord.identifier = (0, import_Crypto.uuidToBytes)(storyDistributionList.id);
  storyDistributionListRecord.name = storyDistributionList.name;
  storyDistributionListRecord.deletedAtTimestamp = (0, import_timestampLongUtils.getSafeLongFromTimestamp)(storyDistributionList.deletedAtTimestamp);
  storyDistributionListRecord.allowsReplies = Boolean(storyDistributionList.allowsReplies);
  storyDistributionListRecord.isBlockList = Boolean(storyDistributionList.isBlockList);
  storyDistributionListRecord.recipientUuids = storyDistributionList.members;
  if (storyDistributionList.storageUnknownFields) {
    storyDistributionListRecord.__unknownFields = [
      storyDistributionList.storageUnknownFields
    ];
  }
  return storyDistributionListRecord;
}
function toStickerPackRecord(stickerPack) {
  const stickerPackRecord = new import_protobuf.SignalService.StickerPackRecord();
  stickerPackRecord.packId = Bytes.fromHex(stickerPack.id);
  if (stickerPack.uninstalledAt !== void 0) {
    stickerPackRecord.deletedAtTimestamp = import_long.default.fromNumber(stickerPack.uninstalledAt);
  } else {
    stickerPackRecord.packKey = Bytes.fromBase64(stickerPack.key);
    if (stickerPack.position) {
      stickerPackRecord.position = stickerPack.position;
    }
  }
  if (stickerPack.storageUnknownFields) {
    stickerPackRecord.__unknownFields = [stickerPack.storageUnknownFields];
  }
  return stickerPackRecord;
}
function applyMessageRequestState(record, conversation) {
  const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
  if (record.blocked) {
    conversation.applyMessageRequestResponse(messageRequestEnum.BLOCK, {
      fromSync: true,
      viaStorageServiceSync: true
    });
  } else if (record.whitelisted) {
    conversation.applyMessageRequestResponse(messageRequestEnum.ACCEPT, {
      fromSync: true,
      viaStorageServiceSync: true
    });
  } else if (!record.blocked) {
    conversation.unblock({ viaStorageServiceSync: true });
  }
  if (record.whitelisted === false) {
    conversation.disableProfileSharing({ viaStorageServiceSync: true });
  }
}
function doRecordsConflict(localRecord, remoteRecord) {
  const details = new Array();
  for (const key of Object.keys(remoteRecord)) {
    const localValue = localRecord[key];
    const remoteValue = remoteRecord[key];
    if (localValue instanceof Uint8Array) {
      const areEqual2 = Bytes.areEqual(localValue, remoteValue);
      if (!areEqual2) {
        details.push(`key=${key}: different bytes`);
      }
      continue;
    }
    if (import_long.default.isLong(localValue) || typeof localValue === "number") {
      if (!import_long.default.isLong(remoteValue) && typeof remoteValue !== "number") {
        details.push(`key=${key}: type mismatch`);
        continue;
      }
      const areEqual2 = import_long.default.fromValue(localValue).equals(import_long.default.fromValue(remoteValue));
      if (!areEqual2) {
        details.push(`key=${key}: different integers`);
      }
      continue;
    }
    if (key === "pinnedConversations") {
      const areEqual2 = (0, import_arePinnedConversationsEqual.arePinnedConversationsEqual)(localValue, remoteValue);
      if (!areEqual2) {
        details.push("pinnedConversations");
      }
      continue;
    }
    if (localValue === remoteValue) {
      continue;
    }
    if (remoteValue === null && (localValue === false || localValue === "" || localValue === 0 || import_long.default.isLong(localValue) && localValue.toNumber() === 0)) {
      continue;
    }
    const areEqual = (0, import_lodash.isEqual)(localValue, remoteValue);
    if (!areEqual) {
      details.push(`key=${key}: different values`);
    }
  }
  return {
    hasConflict: details.length > 0,
    details
  };
}
function doesRecordHavePendingChanges(mergedRecord, serviceRecord, conversation) {
  const shouldSync = Boolean(conversation.get("needsStorageServiceSync"));
  if (!shouldSync) {
    return { hasConflict: false, details: [] };
  }
  const { hasConflict, details } = doRecordsConflict(mergedRecord, serviceRecord);
  if (!hasConflict) {
    conversation.set({ needsStorageServiceSync: false });
  }
  return {
    hasConflict,
    details
  };
}
async function mergeGroupV1Record(storageID, storageVersion, groupV1Record) {
  if (!groupV1Record.id) {
    throw new Error(`No ID for ${storageID}`);
  }
  const groupId = Bytes.toBinary(groupV1Record.id);
  let details = new Array();
  let conversation = window.ConversationController.get(groupId);
  if (conversation && !(0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
    throw new Error(`Record has group type mismatch ${conversation.idForLogging()}`);
  }
  if (!conversation) {
    const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(groupV1Record.id);
    const fields = (0, import_groups.deriveGroupFields)(masterKeyBuffer);
    const derivedGroupV2Id = Bytes.toBase64(fields.id);
    details.push(`failed to find group by v1 id attempting lookup by v2 groupv2(${derivedGroupV2Id})`);
    conversation = window.ConversationController.get(derivedGroupV2Id);
  }
  if (!conversation) {
    if (groupV1Record.id.byteLength !== 16) {
      throw new Error("Not a valid gv1");
    }
    conversation = await window.ConversationController.getOrCreateAndWait(groupId, "group");
    details.push("created a new group locally");
  }
  const oldStorageID = conversation.get("storageID");
  const oldStorageVersion = conversation.get("storageVersion");
  if (!(0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
    details.push("GV1 record for GV2 group, dropping");
    return {
      hasConflict: false,
      shouldDrop: true,
      conversation,
      oldStorageID,
      oldStorageVersion,
      details
    };
  }
  conversation.set({
    isArchived: Boolean(groupV1Record.archived),
    markedUnread: Boolean(groupV1Record.markedUnread),
    storageID,
    storageVersion
  });
  conversation.setMuteExpiration((0, import_timestampLongUtils.getTimestampFromLong)(groupV1Record.mutedUntilTimestamp), {
    viaStorageServiceSync: true
  });
  applyMessageRequestState(groupV1Record, conversation);
  let hasPendingChanges;
  if ((0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
    addUnknownFields(groupV1Record, conversation, details);
    const { hasConflict, details: extraDetails } = doesRecordHavePendingChanges(toGroupV1Record(conversation), groupV1Record, conversation);
    details = details.concat(extraDetails);
    hasPendingChanges = hasConflict;
  } else {
    hasPendingChanges = true;
    details.push("marking v1 group for an update to v2");
  }
  return {
    hasConflict: hasPendingChanges,
    conversation,
    oldStorageID,
    oldStorageVersion,
    details,
    updatedConversations: [conversation]
  };
}
function getGroupV2Conversation(masterKeyBuffer) {
  const groupFields = (0, import_groups.deriveGroupFields)(masterKeyBuffer);
  const groupId = Bytes.toBase64(groupFields.id);
  const masterKey = Bytes.toBase64(masterKeyBuffer);
  const secretParams = Bytes.toBase64(groupFields.secretParams);
  const publicParams = Bytes.toBase64(groupFields.publicParams);
  const groupV2 = window.ConversationController.get(groupId);
  if (groupV2) {
    groupV2.maybeRepairGroupV2({
      masterKey,
      secretParams,
      publicParams
    });
    return groupV2;
  }
  const groupV1 = window.ConversationController.getByDerivedGroupV2Id(groupId);
  if (groupV1) {
    return groupV1;
  }
  const conversationId = window.ConversationController.ensureGroup(groupId, {
    groupVersion: 2,
    masterKey,
    secretParams,
    publicParams
  });
  const conversation = window.ConversationController.get(conversationId);
  if (!conversation) {
    throw new Error(`getGroupV2Conversation: Failed to create conversation for groupv2(${groupId})`);
  }
  return conversation;
}
async function mergeGroupV2Record(storageID, storageVersion, groupV2Record) {
  if (!groupV2Record.masterKey) {
    throw new Error(`No master key for ${storageID}`);
  }
  const masterKeyBuffer = groupV2Record.masterKey;
  const conversation = getGroupV2Conversation(masterKeyBuffer);
  const oldStorageID = conversation.get("storageID");
  const oldStorageVersion = conversation.get("storageVersion");
  conversation.set({
    hideStory: Boolean(groupV2Record.hideStory),
    isArchived: Boolean(groupV2Record.archived),
    markedUnread: Boolean(groupV2Record.markedUnread),
    dontNotifyForMentionsIfMuted: Boolean(groupV2Record.dontNotifyForMentionsIfMuted),
    storageID,
    storageVersion
  });
  conversation.setMuteExpiration((0, import_timestampLongUtils.getTimestampFromLong)(groupV2Record.mutedUntilTimestamp), {
    viaStorageServiceSync: true
  });
  applyMessageRequestState(groupV2Record, conversation);
  let details = new Array();
  addUnknownFields(groupV2Record, conversation, details);
  const { hasConflict, details: extraDetails } = doesRecordHavePendingChanges(toGroupV2Record(conversation), groupV2Record, conversation);
  details = details.concat(extraDetails);
  const isGroupNewToUs = !(0, import_lodash.isNumber)(conversation.get("revision"));
  const isFirstSync = !window.storage.get("storageFetchComplete");
  const dropInitialJoinMessage = isFirstSync;
  if ((0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
    (0, import_groups.waitThenRespondToGroupV2Migration)({
      conversation
    });
  } else if (isGroupNewToUs) {
    (0, import_groups.waitThenMaybeUpdateGroup)({
      conversation,
      dropInitialJoinMessage
    }, { viaFirstStorageSync: isFirstSync });
  }
  return {
    hasConflict,
    conversation,
    updatedConversations: [conversation],
    oldStorageID,
    oldStorageVersion,
    details
  };
}
async function mergeContactRecord(storageID, storageVersion, originalContactRecord) {
  const contactRecord = {
    ...originalContactRecord,
    serviceUuid: originalContactRecord.serviceUuid ? (0, import_normalizeUuid.normalizeUuid)(originalContactRecord.serviceUuid, "ContactRecord.serviceUuid") : void 0
  };
  const e164 = (0, import_dropNull.dropNull)(contactRecord.serviceE164);
  const uuid = (0, import_dropNull.dropNull)(contactRecord.serviceUuid);
  const pni = (0, import_dropNull.dropNull)(contactRecord.pni);
  if (!uuid) {
    return { hasConflict: false, shouldDrop: true, details: ["no uuid"] };
  }
  if (!(0, import_UUID.isValidUuid)(uuid)) {
    return { hasConflict: false, shouldDrop: true, details: ["invalid uuid"] };
  }
  if (window.storage.user.getOurUuidKind(new import_UUID.UUID(uuid)) !== import_UUID.UUIDKind.Unknown) {
    return { hasConflict: false, shouldDrop: true, details: ["our own uuid"] };
  }
  const conversation = window.ConversationController.maybeMergeContacts({
    aci: uuid,
    e164,
    pni,
    reason: "mergeContactRecord"
  });
  if (!conversation) {
    throw new Error(`No conversation for ${storageID}`);
  }
  if (conversation.get("uuid") !== uuid) {
    log.warn(`mergeContactRecord: ${conversation.idForLogging()} with storageId ${conversation.get("storageID")} had uuid that didn't match provided uuid ${uuid}`);
    return {
      hasConflict: false,
      shouldDrop: true,
      details: []
    };
  }
  let needsProfileFetch = false;
  if (contactRecord.profileKey && contactRecord.profileKey.length > 0) {
    needsProfileFetch = await conversation.setProfileKey(Bytes.toBase64(contactRecord.profileKey), { viaStorageServiceSync: true });
  }
  let details = new Array();
  const remoteName = (0, import_dropNull.dropNull)(contactRecord.givenName);
  const remoteFamilyName = (0, import_dropNull.dropNull)(contactRecord.familyName);
  const localName = conversation.get("profileName");
  const localFamilyName = conversation.get("profileFamilyName");
  if (remoteName && (localName !== remoteName || localFamilyName !== remoteFamilyName)) {
    if (localName) {
      conversation.getProfiles();
      details.push("refreshing profile");
    } else {
      conversation.set({
        profileName: remoteName,
        profileFamilyName: remoteFamilyName
      });
      details.push("updated profile name");
    }
  }
  if (contactRecord.identityKey) {
    const verified = await conversation.safeGetVerified();
    const storageServiceVerified = contactRecord.identityState || 0;
    const verifiedOptions = {
      key: contactRecord.identityKey,
      viaStorageServiceSync: true
    };
    const STATE_ENUM = import_protobuf.SignalService.ContactRecord.IdentityState;
    if (verified !== storageServiceVerified) {
      details.push(`updating verified state to=${verified}`);
    }
    let keyChange;
    switch (storageServiceVerified) {
      case STATE_ENUM.VERIFIED:
        keyChange = await conversation.setVerified(verifiedOptions);
        break;
      case STATE_ENUM.UNVERIFIED:
        keyChange = await conversation.setUnverified(verifiedOptions);
        break;
      default:
        keyChange = await conversation.setVerifiedDefault(verifiedOptions);
    }
    if (keyChange) {
      details.push("key changed");
    }
  }
  applyMessageRequestState(contactRecord, conversation);
  addUnknownFields(contactRecord, conversation, details);
  const oldStorageID = conversation.get("storageID");
  const oldStorageVersion = conversation.get("storageVersion");
  conversation.set({
    hideStory: Boolean(contactRecord.hideStory),
    isArchived: Boolean(contactRecord.archived),
    markedUnread: Boolean(contactRecord.markedUnread),
    storageID,
    storageVersion
  });
  conversation.setMuteExpiration((0, import_timestampLongUtils.getTimestampFromLong)(contactRecord.mutedUntilTimestamp), {
    viaStorageServiceSync: true
  });
  const { hasConflict, details: extraDetails } = doesRecordHavePendingChanges(await toContactRecord(conversation), contactRecord, conversation);
  details = details.concat(extraDetails);
  return {
    hasConflict,
    conversation,
    updatedConversations: [conversation],
    needsProfileFetch,
    oldStorageID,
    oldStorageVersion,
    details
  };
}
async function mergeAccountRecord(storageID, storageVersion, accountRecord) {
  let details = new Array();
  const {
    linkPreviews,
    notDiscoverableByPhoneNumber,
    noteToSelfArchived,
    noteToSelfMarkedUnread,
    phoneNumberSharingMode,
    pinnedConversations,
    profileKey,
    readReceipts,
    sealedSenderIndicators,
    typingIndicators,
    preferContactAvatars,
    primarySendsSms,
    universalExpireTimer,
    e164: accountE164,
    preferredReactionEmoji: rawPreferredReactionEmoji,
    subscriberId,
    subscriberCurrencyCode,
    displayBadgesOnProfile,
    keepMutedChatsArchived
  } = accountRecord;
  const updatedConversations = new Array();
  window.storage.put("read-receipt-setting", Boolean(readReceipts));
  if (typeof sealedSenderIndicators === "boolean") {
    window.storage.put("sealedSenderIndicators", sealedSenderIndicators);
  }
  if (typeof typingIndicators === "boolean") {
    window.storage.put("typingIndicators", typingIndicators);
  }
  if (typeof linkPreviews === "boolean") {
    window.storage.put("linkPreviews", linkPreviews);
  }
  if (typeof preferContactAvatars === "boolean") {
    const previous = window.storage.get("preferContactAvatars");
    window.storage.put("preferContactAvatars", preferContactAvatars);
    if (Boolean(previous) !== Boolean(preferContactAvatars)) {
      window.ConversationController.forceRerender();
    }
  }
  if (typeof primarySendsSms === "boolean") {
    window.storage.put("primarySendsSms", primarySendsSms);
  }
  if (typeof accountE164 === "string" && accountE164) {
    window.storage.put("accountE164", accountE164);
    window.storage.user.setNumber(accountE164);
  }
  if (preferredReactionEmoji.canBeSynced(rawPreferredReactionEmoji)) {
    const localPreferredReactionEmoji = window.storage.get("preferredReactionEmoji") || [];
    if (!(0, import_lodash.isEqual)(localPreferredReactionEmoji, rawPreferredReactionEmoji)) {
      log.warn("storageService: remote and local preferredReactionEmoji do not match", localPreferredReactionEmoji.length, rawPreferredReactionEmoji.length);
    }
    window.storage.put("preferredReactionEmoji", rawPreferredReactionEmoji);
  }
  (0, import_universalExpireTimer.set)(universalExpireTimer || 0);
  const PHONE_NUMBER_SHARING_MODE_ENUM = import_protobuf.SignalService.AccountRecord.PhoneNumberSharingMode;
  let phoneNumberSharingModeToStore;
  switch (phoneNumberSharingMode) {
    case void 0:
    case null:
    case PHONE_NUMBER_SHARING_MODE_ENUM.EVERYBODY:
      phoneNumberSharingModeToStore = import_phoneNumberSharingMode.PhoneNumberSharingMode.Everybody;
      break;
    case PHONE_NUMBER_SHARING_MODE_ENUM.CONTACTS_ONLY:
      phoneNumberSharingModeToStore = import_phoneNumberSharingMode.PhoneNumberSharingMode.ContactsOnly;
      break;
    case PHONE_NUMBER_SHARING_MODE_ENUM.NOBODY:
      phoneNumberSharingModeToStore = import_phoneNumberSharingMode.PhoneNumberSharingMode.Nobody;
      break;
    default:
      (0, import_assert.assert)(false, `storageService.mergeAccountRecord: Got an unexpected phone number sharing mode: ${phoneNumberSharingMode}. Falling back to default`);
      phoneNumberSharingModeToStore = import_phoneNumberSharingMode.PhoneNumberSharingMode.Everybody;
      break;
  }
  window.storage.put("phoneNumberSharingMode", phoneNumberSharingModeToStore);
  const discoverability = notDiscoverableByPhoneNumber ? import_phoneNumberDiscoverability.PhoneNumberDiscoverability.NotDiscoverable : import_phoneNumberDiscoverability.PhoneNumberDiscoverability.Discoverable;
  window.storage.put("phoneNumberDiscoverability", discoverability);
  if (profileKey) {
    import_ourProfileKey.ourProfileKeyService.set(profileKey);
  }
  if (pinnedConversations) {
    const modelPinnedConversations = window.getConversations().filter((conversation2) => Boolean(conversation2.get("isPinned")));
    const modelPinnedConversationIds = modelPinnedConversations.map((conversation2) => conversation2.get("id"));
    const missingStoragePinnedConversationIds = window.storage.get("pinnedConversationIds", new Array()).filter((id) => !modelPinnedConversationIds.includes(id));
    if (missingStoragePinnedConversationIds.length !== 0) {
      log.warn("mergeAccountRecord: pinnedConversationIds in storage does not match pinned Conversation models");
    }
    const locallyPinnedConversations = modelPinnedConversations.concat(missingStoragePinnedConversationIds.map((conversationId) => window.ConversationController.get(conversationId)).filter((conversation2) => conversation2 !== void 0));
    details.push(`local pinned=${locallyPinnedConversations.length}`, `remote pinned=${pinnedConversations.length}`);
    const remotelyPinnedConversationPromises = pinnedConversations.map(async ({ contact, legacyGroupId, groupMasterKey }) => {
      let conversation2;
      if (contact) {
        conversation2 = window.ConversationController.lookupOrCreate(contact);
      } else if (legacyGroupId && legacyGroupId.length) {
        const groupId = Bytes.toBinary(legacyGroupId);
        conversation2 = window.ConversationController.get(groupId);
      } else if (groupMasterKey && groupMasterKey.length) {
        const groupFields = (0, import_groups.deriveGroupFields)(groupMasterKey);
        const groupId = Bytes.toBase64(groupFields.id);
        conversation2 = window.ConversationController.get(groupId);
      } else {
        log.error("storageService.mergeAccountRecord: Invalid identifier received");
      }
      if (!conversation2) {
        log.error("storageService.mergeAccountRecord: missing conversation id.");
        return void 0;
      }
      return conversation2;
    });
    const remotelyPinnedConversations = (await Promise.all(remotelyPinnedConversationPromises)).filter((conversation2) => conversation2 !== void 0);
    const remotelyPinnedConversationIds = remotelyPinnedConversations.map(({ id }) => id);
    const conversationsToUnpin = locallyPinnedConversations.filter(({ id }) => !remotelyPinnedConversationIds.includes(id));
    details.push(`unpinning=${conversationsToUnpin.length}`, `pinning=${remotelyPinnedConversations.length}`);
    conversationsToUnpin.forEach((conversation2) => {
      conversation2.set({ isPinned: false });
      updatedConversations.push(conversation2);
    });
    remotelyPinnedConversations.forEach((conversation2) => {
      conversation2.set({ isPinned: true, isArchived: false });
      updatedConversations.push(conversation2);
    });
    window.storage.put("pinnedConversationIds", remotelyPinnedConversationIds);
  }
  if (subscriberId instanceof Uint8Array) {
    window.storage.put("subscriberId", subscriberId);
  }
  if (typeof subscriberCurrencyCode === "string") {
    window.storage.put("subscriberCurrencyCode", subscriberCurrencyCode);
  }
  window.storage.put("displayBadgesOnProfile", Boolean(displayBadgesOnProfile));
  window.storage.put("keepMutedChatsArchived", Boolean(keepMutedChatsArchived));
  const ourID = window.ConversationController.getOurConversationId();
  if (!ourID) {
    throw new Error("Could not find ourID");
  }
  const conversation = await window.ConversationController.getOrCreateAndWait(ourID, "private");
  addUnknownFields(accountRecord, conversation, details);
  const oldStorageID = conversation.get("storageID");
  const oldStorageVersion = conversation.get("storageVersion");
  conversation.set({
    isArchived: Boolean(noteToSelfArchived),
    markedUnread: Boolean(noteToSelfMarkedUnread),
    storageID,
    storageVersion
  });
  let needsProfileFetch = false;
  if (profileKey && profileKey.length > 0) {
    needsProfileFetch = await conversation.setProfileKey(Bytes.toBase64(profileKey), { viaStorageServiceSync: true });
    const avatarUrl = (0, import_dropNull.dropNull)(accountRecord.avatarUrl);
    await conversation.setProfileAvatar(avatarUrl, profileKey);
    window.storage.put("avatarUrl", avatarUrl);
  }
  const { hasConflict, details: extraDetails } = doesRecordHavePendingChanges(toAccountRecord(conversation), accountRecord, conversation);
  updatedConversations.push(conversation);
  details = details.concat(extraDetails);
  return {
    hasConflict,
    conversation,
    updatedConversations,
    needsProfileFetch,
    oldStorageID,
    oldStorageVersion,
    details
  };
}
async function mergeStoryDistributionListRecord(storageID, storageVersion, storyDistributionListRecord) {
  if (!storyDistributionListRecord.identifier) {
    throw new Error(`No storyDistributionList identifier for ${storageID}`);
  }
  const details = [];
  const listId = Bytes.areEqual(MY_STORIES_BYTES, storyDistributionListRecord.identifier) ? import_Stories.MY_STORIES_ID : (0, import_Crypto.bytesToUuid)(storyDistributionListRecord.identifier);
  if (!listId) {
    throw new Error("Could not parse distribution list id");
  }
  const localStoryDistributionList = await import_Client.default.getStoryDistributionWithMembers(listId);
  const remoteListMembers = (storyDistributionListRecord.recipientUuids || []).map(import_UUID.UUID.cast);
  if (storyDistributionListRecord.__unknownFields) {
    details.push("adding unknown fields");
  }
  const storyDistribution = {
    id: listId,
    name: String(storyDistributionListRecord.name),
    deletedAtTimestamp: (0, import_timestampLongUtils.getTimestampFromLong)(storyDistributionListRecord.deletedAtTimestamp),
    allowsReplies: Boolean(storyDistributionListRecord.allowsReplies),
    isBlockList: Boolean(storyDistributionListRecord.isBlockList),
    members: remoteListMembers,
    senderKeyInfo: localStoryDistributionList?.senderKeyInfo,
    storageID,
    storageVersion,
    storageUnknownFields: storyDistributionListRecord.__unknownFields ? Bytes.concatenate(storyDistributionListRecord.__unknownFields) : null,
    storageNeedsSync: Boolean(localStoryDistributionList?.storageNeedsSync)
  };
  if (!localStoryDistributionList) {
    await import_Client.default.createNewStoryDistribution(storyDistribution);
    const shouldSave = false;
    window.reduxActions.storyDistributionLists.createDistributionList(storyDistribution.name, remoteListMembers, storyDistribution, shouldSave);
    return {
      details,
      hasConflict: false
    };
  }
  const oldStorageID = localStoryDistributionList.storageID;
  const oldStorageVersion = localStoryDistributionList.storageVersion;
  const needsToClearUnknownFields = !storyDistributionListRecord.__unknownFields && localStoryDistributionList.storageUnknownFields;
  if (needsToClearUnknownFields) {
    details.push("clearing unknown fields");
  }
  const { hasConflict, details: conflictDetails } = doRecordsConflict(toStoryDistributionListRecord(storyDistribution), storyDistributionListRecord);
  const localMembersListSet = new Set(localStoryDistributionList.members);
  const toAdd = remoteListMembers.filter((uuid) => !localMembersListSet.has(uuid));
  const remoteMemberListSet = new Set(remoteListMembers);
  const toRemove = localStoryDistributionList.members.filter((uuid) => !remoteMemberListSet.has(uuid));
  const needsUpdate = Boolean(needsToClearUnknownFields || hasConflict || toAdd.length || toRemove.length);
  if (!needsUpdate) {
    return {
      details: [...details, ...conflictDetails],
      hasConflict,
      oldStorageID,
      oldStorageVersion
    };
  }
  if (needsUpdate) {
    await import_Client.default.modifyStoryDistributionWithMembers(storyDistribution, {
      toAdd,
      toRemove
    });
    window.reduxActions.storyDistributionLists.modifyDistributionList({
      allowsReplies: Boolean(storyDistribution.allowsReplies),
      deletedAtTimestamp: storyDistribution.deletedAtTimestamp,
      id: storyDistribution.id,
      isBlockList: Boolean(storyDistribution.isBlockList),
      membersToAdd: toAdd,
      membersToRemove: toRemove,
      name: storyDistribution.name
    });
  }
  return {
    details: [...details, ...conflictDetails],
    hasConflict,
    oldStorageID,
    oldStorageVersion
  };
}
async function mergeStickerPackRecord(storageID, storageVersion, stickerPackRecord) {
  if (!stickerPackRecord.packId || Bytes.isEmpty(stickerPackRecord.packId)) {
    throw new Error(`No stickerPackRecord identifier for ${storageID}`);
  }
  const details = [];
  const id = Bytes.toHex(stickerPackRecord.packId);
  const localStickerPack = await import_Client.default.getStickerPackInfo(id);
  if (stickerPackRecord.__unknownFields) {
    details.push("adding unknown fields");
  }
  const storageUnknownFields = stickerPackRecord.__unknownFields ? Bytes.concatenate(stickerPackRecord.__unknownFields) : null;
  let stickerPack;
  if (stickerPackRecord.deletedAtTimestamp?.toNumber()) {
    stickerPack = {
      id,
      uninstalledAt: stickerPackRecord.deletedAtTimestamp.toNumber(),
      storageID,
      storageVersion,
      storageUnknownFields,
      storageNeedsSync: false
    };
  } else {
    if (!stickerPackRecord.packKey || Bytes.isEmpty(stickerPackRecord.packKey)) {
      throw new Error(`No stickerPackRecord key for ${storageID}`);
    }
    stickerPack = {
      id,
      key: Bytes.toBase64(stickerPackRecord.packKey),
      position: "position" in stickerPackRecord ? stickerPackRecord.position : localStickerPack?.position ?? void 0,
      storageID,
      storageVersion,
      storageUnknownFields,
      storageNeedsSync: false
    };
  }
  const oldStorageID = localStickerPack?.storageID;
  const oldStorageVersion = localStickerPack?.storageVersion;
  const needsToClearUnknownFields = !stickerPack.storageUnknownFields && localStickerPack?.storageUnknownFields;
  if (needsToClearUnknownFields) {
    details.push("clearing unknown fields");
  }
  const { hasConflict, details: conflictDetails } = doRecordsConflict(toStickerPackRecord(stickerPack), stickerPackRecord);
  const wasUninstalled = Boolean(localStickerPack?.uninstalledAt);
  const isUninstalled = Boolean(stickerPack.uninstalledAt);
  details.push(`wasUninstalled=${wasUninstalled}`, `isUninstalled=${isUninstalled}`, `oldPosition=${localStickerPack?.position ?? "?"}`, `newPosition=${stickerPack.position ?? "?"}`);
  if ((!localStickerPack || !wasUninstalled) && isUninstalled) {
    (0, import_assert.assert)(localStickerPack?.key, "Installed sticker pack has no key");
    window.reduxActions.stickers.uninstallStickerPack(localStickerPack.id, localStickerPack.key, { fromStorageService: true });
  } else if ((!localStickerPack || wasUninstalled) && !isUninstalled) {
    (0, import_assert.assert)(stickerPack.key, "Sticker pack does not have key");
    const status = Stickers.getStickerPackStatus(stickerPack.id);
    if (status === "downloaded") {
      window.reduxActions.stickers.installStickerPack(stickerPack.id, stickerPack.key, {
        fromStorageService: true
      });
    } else {
      Stickers.downloadStickerPack(stickerPack.id, stickerPack.key, {
        finalStatus: "installed",
        fromStorageService: true
      });
    }
  }
  await import_Client.default.updateStickerPackInfo(stickerPack);
  return {
    details: [...details, ...conflictDetails],
    hasConflict,
    oldStorageID,
    oldStorageVersion
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeAccountRecord,
  mergeContactRecord,
  mergeGroupV1Record,
  mergeGroupV2Record,
  mergeStickerPackRecord,
  mergeStoryDistributionListRecord,
  toAccountRecord,
  toContactRecord,
  toGroupV1Record,
  toGroupV2Record,
  toStickerPackRecord,
  toStoryDistributionListRecord
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcmFnZVJlY29yZE9wcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlzRXF1YWwsIGlzTnVtYmVyIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBMb25nIGZyb20gJ2xvbmcnO1xuXG5pbXBvcnQge1xuICB1dWlkVG9CeXRlcyxcbiAgYnl0ZXNUb1V1aWQsXG4gIGRlcml2ZU1hc3RlcktleUZyb21Hcm91cFYxLFxufSBmcm9tICcuLi9DcnlwdG8nO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHtcbiAgZGVyaXZlR3JvdXBGaWVsZHMsXG4gIHdhaXRUaGVuTWF5YmVVcGRhdGVHcm91cCxcbiAgd2FpdFRoZW5SZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uLFxufSBmcm9tICcuLi9ncm91cHMnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgZHJvcE51bGwgfSBmcm9tICcuLi91dGlsL2Ryb3BOdWxsJztcbmltcG9ydCB7IG5vcm1hbGl6ZVV1aWQgfSBmcm9tICcuLi91dGlsL25vcm1hbGl6ZVV1aWQnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQge1xuICBQaG9uZU51bWJlclNoYXJpbmdNb2RlLFxuICBwYXJzZVBob25lTnVtYmVyU2hhcmluZ01vZGUsXG59IGZyb20gJy4uL3V0aWwvcGhvbmVOdW1iZXJTaGFyaW5nTW9kZSc7XG5pbXBvcnQge1xuICBQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSxcbiAgcGFyc2VQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSxcbn0gZnJvbSAnLi4vdXRpbC9waG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSc7XG5pbXBvcnQgeyBhcmVQaW5uZWRDb252ZXJzYXRpb25zRXF1YWwgfSBmcm9tICcuLi91dGlsL2FyZVBpbm5lZENvbnZlcnNhdGlvbnNFcXVhbCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0U2FmZUxvbmdGcm9tVGltZXN0YW1wLFxuICBnZXRUaW1lc3RhbXBGcm9tTG9uZyxcbn0gZnJvbSAnLi4vdXRpbC90aW1lc3RhbXBMb25nVXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0IGFzIGdldFVuaXZlcnNhbEV4cGlyZVRpbWVyLFxuICBzZXQgYXMgc2V0VW5pdmVyc2FsRXhwaXJlVGltZXIsXG59IGZyb20gJy4uL3V0aWwvdW5pdmVyc2FsRXhwaXJlVGltZXInO1xuaW1wb3J0IHsgb3VyUHJvZmlsZUtleVNlcnZpY2UgfSBmcm9tICcuL291clByb2ZpbGVLZXknO1xuaW1wb3J0IHsgaXNHcm91cFYxLCBpc0dyb3VwVjIgfSBmcm9tICcuLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgaXNWYWxpZFV1aWQsIFVVSUQsIFVVSURLaW5kIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgKiBhcyBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppIGZyb20gJy4uL3JlYWN0aW9ucy9wcmVmZXJyZWRSZWFjdGlvbkVtb2ppJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0ICogYXMgU3RpY2tlcnMgZnJvbSAnLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHR5cGUge1xuICBTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZSxcbiAgU3RpY2tlclBhY2tJbmZvVHlwZSxcbn0gZnJvbSAnLi4vc3FsL0ludGVyZmFjZSc7XG5pbXBvcnQgZGF0YUludGVyZmFjZSBmcm9tICcuLi9zcWwvQ2xpZW50JztcbmltcG9ydCB7IE1ZX1NUT1JJRVNfSUQgfSBmcm9tICcuLi90eXBlcy9TdG9yaWVzJztcblxuY29uc3QgTVlfU1RPUklFU19CWVRFUyA9IHV1aWRUb0J5dGVzKE1ZX1NUT1JJRVNfSUQpO1xuXG50eXBlIFJlY29yZENsYXNzID1cbiAgfCBQcm90by5JQWNjb3VudFJlY29yZFxuICB8IFByb3RvLklDb250YWN0UmVjb3JkXG4gIHwgUHJvdG8uSUdyb3VwVjFSZWNvcmRcbiAgfCBQcm90by5JR3JvdXBWMlJlY29yZDtcblxuZXhwb3J0IHR5cGUgTWVyZ2VSZXN1bHRUeXBlID0gUmVhZG9ubHk8e1xuICBoYXNDb25mbGljdDogYm9vbGVhbjtcbiAgc2hvdWxkRHJvcD86IGJvb2xlYW47XG4gIGNvbnZlcnNhdGlvbj86IENvbnZlcnNhdGlvbk1vZGVsO1xuICBuZWVkc1Byb2ZpbGVGZXRjaD86IGJvb2xlYW47XG4gIHVwZGF0ZWRDb252ZXJzYXRpb25zPzogUmVhZG9ubHlBcnJheTxDb252ZXJzYXRpb25Nb2RlbD47XG4gIG9sZFN0b3JhZ2VJRD86IHN0cmluZztcbiAgb2xkU3RvcmFnZVZlcnNpb24/OiBudW1iZXI7XG4gIGRldGFpbHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbn0+O1xuXG50eXBlIEhhc0NvbmZsaWN0UmVzdWx0VHlwZSA9IFJlYWRvbmx5PHtcbiAgaGFzQ29uZmxpY3Q6IGJvb2xlYW47XG4gIGRldGFpbHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbn0+O1xuXG5mdW5jdGlvbiB0b1JlY29yZFZlcmlmaWVkKHZlcmlmaWVkOiBudW1iZXIpOiBQcm90by5Db250YWN0UmVjb3JkLklkZW50aXR5U3RhdGUge1xuICBjb25zdCBWRVJJRklFRF9FTlVNID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5WZXJpZmllZFN0YXR1cztcbiAgY29uc3QgU1RBVEVfRU5VTSA9IFByb3RvLkNvbnRhY3RSZWNvcmQuSWRlbnRpdHlTdGF0ZTtcblxuICBzd2l0Y2ggKHZlcmlmaWVkKSB7XG4gICAgY2FzZSBWRVJJRklFRF9FTlVNLlZFUklGSUVEOlxuICAgICAgcmV0dXJuIFNUQVRFX0VOVU0uVkVSSUZJRUQ7XG4gICAgY2FzZSBWRVJJRklFRF9FTlVNLlVOVkVSSUZJRUQ6XG4gICAgICByZXR1cm4gU1RBVEVfRU5VTS5VTlZFUklGSUVEO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gU1RBVEVfRU5VTS5ERUZBVUxUO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZFVua25vd25GaWVsZHMoXG4gIHJlY29yZDogUmVjb3JkQ2xhc3MsXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwsXG4gIGRldGFpbHM6IEFycmF5PHN0cmluZz5cbik6IHZvaWQge1xuICBpZiAocmVjb3JkLl9fdW5rbm93bkZpZWxkcykge1xuICAgIGRldGFpbHMucHVzaCgnYWRkaW5nIHVua25vd24gZmllbGRzJyk7XG4gICAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogQnl0ZXMudG9CYXNlNjQoXG4gICAgICAgIEJ5dGVzLmNvbmNhdGVuYXRlKHJlY29yZC5fX3Vua25vd25GaWVsZHMpXG4gICAgICApLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VVbmtub3duRmllbGRzJykpIHtcbiAgICAvLyBJZiB0aGUgcmVjb3JkIGRvZXNuJ3QgaGF2ZSB1bmtub3duIGZpZWxkcyBhdHRhY2hlZCBidXQgd2UgaGF2ZSB0aGVtXG4gICAgLy8gc2F2ZWQgbG9jYWxseSB0aGVuIHdlIG5lZWQgdG8gY2xlYXIgaXQgb3V0XG4gICAgZGV0YWlscy5wdXNoKCdjbGVhcmluZyB1bmtub3duIGZpZWxkcycpO1xuICAgIGNvbnZlcnNhdGlvbi51bnNldCgnc3RvcmFnZVVua25vd25GaWVsZHMnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBseVVua25vd25GaWVsZHMoXG4gIHJlY29yZDogUmVjb3JkQ2xhc3MsXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWxcbik6IHZvaWQge1xuICBjb25zdCBzdG9yYWdlVW5rbm93bkZpZWxkcyA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VVbmtub3duRmllbGRzJyk7XG4gIGlmIChzdG9yYWdlVW5rbm93bkZpZWxkcykge1xuICAgIGxvZy5pbmZvKFxuICAgICAgJ3N0b3JhZ2VTZXJ2aWNlLmFwcGx5VW5rbm93bkZpZWxkczogQXBwbHlpbmcgdW5rbm93biBmaWVsZHMgZm9yJyxcbiAgICAgIGNvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKVxuICAgICk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgcmVjb3JkLl9fdW5rbm93bkZpZWxkcyA9IFtCeXRlcy5mcm9tQmFzZTY0KHN0b3JhZ2VVbmtub3duRmllbGRzKV07XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvQ29udGFjdFJlY29yZChcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbFxuKTogUHJvbWlzZTxQcm90by5Db250YWN0UmVjb3JkPiB7XG4gIGNvbnN0IGNvbnRhY3RSZWNvcmQgPSBuZXcgUHJvdG8uQ29udGFjdFJlY29yZCgpO1xuICBjb25zdCB1dWlkID0gY29udmVyc2F0aW9uLmdldFV1aWQoKTtcbiAgaWYgKHV1aWQpIHtcbiAgICBjb250YWN0UmVjb3JkLnNlcnZpY2VVdWlkID0gdXVpZC50b1N0cmluZygpO1xuICB9XG4gIGNvbnN0IGUxNjQgPSBjb252ZXJzYXRpb24uZ2V0KCdlMTY0Jyk7XG4gIGlmIChlMTY0KSB7XG4gICAgY29udGFjdFJlY29yZC5zZXJ2aWNlRTE2NCA9IGUxNjQ7XG4gIH1cbiAgY29uc3QgcG5pID0gY29udmVyc2F0aW9uLmdldCgncG5pJyk7XG4gIGlmIChwbmkpIHtcbiAgICBjb250YWN0UmVjb3JkLnBuaSA9IHBuaTtcbiAgfVxuICBjb25zdCBwcm9maWxlS2V5ID0gY29udmVyc2F0aW9uLmdldCgncHJvZmlsZUtleScpO1xuICBpZiAocHJvZmlsZUtleSkge1xuICAgIGNvbnRhY3RSZWNvcmQucHJvZmlsZUtleSA9IEJ5dGVzLmZyb21CYXNlNjQoU3RyaW5nKHByb2ZpbGVLZXkpKTtcbiAgfVxuXG4gIGNvbnN0IGlkZW50aXR5S2V5ID0gdXVpZFxuICAgID8gYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5sb2FkSWRlbnRpdHlLZXkodXVpZClcbiAgICA6IHVuZGVmaW5lZDtcbiAgaWYgKGlkZW50aXR5S2V5KSB7XG4gICAgY29udGFjdFJlY29yZC5pZGVudGl0eUtleSA9IGlkZW50aXR5S2V5O1xuICB9XG4gIGNvbnN0IHZlcmlmaWVkID0gY29udmVyc2F0aW9uLmdldCgndmVyaWZpZWQnKTtcbiAgaWYgKHZlcmlmaWVkKSB7XG4gICAgY29udGFjdFJlY29yZC5pZGVudGl0eVN0YXRlID0gdG9SZWNvcmRWZXJpZmllZChOdW1iZXIodmVyaWZpZWQpKTtcbiAgfVxuICBjb25zdCBwcm9maWxlTmFtZSA9IGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVOYW1lJyk7XG4gIGlmIChwcm9maWxlTmFtZSkge1xuICAgIGNvbnRhY3RSZWNvcmQuZ2l2ZW5OYW1lID0gcHJvZmlsZU5hbWU7XG4gIH1cbiAgY29uc3QgcHJvZmlsZUZhbWlseU5hbWUgPSBjb252ZXJzYXRpb24uZ2V0KCdwcm9maWxlRmFtaWx5TmFtZScpO1xuICBpZiAocHJvZmlsZUZhbWlseU5hbWUpIHtcbiAgICBjb250YWN0UmVjb3JkLmZhbWlseU5hbWUgPSBwcm9maWxlRmFtaWx5TmFtZTtcbiAgfVxuICBjb250YWN0UmVjb3JkLmJsb2NrZWQgPSBjb252ZXJzYXRpb24uaXNCbG9ja2VkKCk7XG4gIGNvbnRhY3RSZWNvcmQud2hpdGVsaXN0ZWQgPSBCb29sZWFuKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJykpO1xuICBjb250YWN0UmVjb3JkLmFyY2hpdmVkID0gQm9vbGVhbihjb252ZXJzYXRpb24uZ2V0KCdpc0FyY2hpdmVkJykpO1xuICBjb250YWN0UmVjb3JkLm1hcmtlZFVucmVhZCA9IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnbWFya2VkVW5yZWFkJykpO1xuICBjb250YWN0UmVjb3JkLm11dGVkVW50aWxUaW1lc3RhbXAgPSBnZXRTYWZlTG9uZ0Zyb21UaW1lc3RhbXAoXG4gICAgY29udmVyc2F0aW9uLmdldCgnbXV0ZUV4cGlyZXNBdCcpXG4gICk7XG4gIGlmIChjb252ZXJzYXRpb24uZ2V0KCdoaWRlU3RvcnknKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29udGFjdFJlY29yZC5oaWRlU3RvcnkgPSBCb29sZWFuKGNvbnZlcnNhdGlvbi5nZXQoJ2hpZGVTdG9yeScpKTtcbiAgfVxuXG4gIGFwcGx5VW5rbm93bkZpZWxkcyhjb250YWN0UmVjb3JkLCBjb252ZXJzYXRpb24pO1xuXG4gIHJldHVybiBjb250YWN0UmVjb3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY2NvdW50UmVjb3JkKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsXG4pOiBQcm90by5BY2NvdW50UmVjb3JkIHtcbiAgY29uc3QgYWNjb3VudFJlY29yZCA9IG5ldyBQcm90by5BY2NvdW50UmVjb3JkKCk7XG5cbiAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVLZXknKSkge1xuICAgIGFjY291bnRSZWNvcmQucHJvZmlsZUtleSA9IEJ5dGVzLmZyb21CYXNlNjQoXG4gICAgICBTdHJpbmcoY29udmVyc2F0aW9uLmdldCgncHJvZmlsZUtleScpKVxuICAgICk7XG4gIH1cbiAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVOYW1lJykpIHtcbiAgICBhY2NvdW50UmVjb3JkLmdpdmVuTmFtZSA9IGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVOYW1lJykgfHwgJyc7XG4gIH1cbiAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVGYW1pbHlOYW1lJykpIHtcbiAgICBhY2NvdW50UmVjb3JkLmZhbWlseU5hbWUgPSBjb252ZXJzYXRpb24uZ2V0KCdwcm9maWxlRmFtaWx5TmFtZScpIHx8ICcnO1xuICB9XG4gIGNvbnN0IGF2YXRhclVybCA9IHdpbmRvdy5zdG9yYWdlLmdldCgnYXZhdGFyVXJsJyk7XG4gIGlmIChhdmF0YXJVcmwgIT09IHVuZGVmaW5lZCkge1xuICAgIGFjY291bnRSZWNvcmQuYXZhdGFyVXJsID0gYXZhdGFyVXJsO1xuICB9XG4gIGFjY291bnRSZWNvcmQubm90ZVRvU2VsZkFyY2hpdmVkID0gQm9vbGVhbihjb252ZXJzYXRpb24uZ2V0KCdpc0FyY2hpdmVkJykpO1xuICBhY2NvdW50UmVjb3JkLm5vdGVUb1NlbGZNYXJrZWRVbnJlYWQgPSBCb29sZWFuKFxuICAgIGNvbnZlcnNhdGlvbi5nZXQoJ21hcmtlZFVucmVhZCcpXG4gICk7XG4gIGFjY291bnRSZWNvcmQucmVhZFJlY2VpcHRzID0gQm9vbGVhbih3aW5kb3cuRXZlbnRzLmdldFJlYWRSZWNlaXB0U2V0dGluZygpKTtcbiAgYWNjb3VudFJlY29yZC5zZWFsZWRTZW5kZXJJbmRpY2F0b3JzID0gQm9vbGVhbihcbiAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3NlYWxlZFNlbmRlckluZGljYXRvcnMnKVxuICApO1xuICBhY2NvdW50UmVjb3JkLnR5cGluZ0luZGljYXRvcnMgPSBCb29sZWFuKFxuICAgIHdpbmRvdy5FdmVudHMuZ2V0VHlwaW5nSW5kaWNhdG9yU2V0dGluZygpXG4gICk7XG4gIGFjY291bnRSZWNvcmQubGlua1ByZXZpZXdzID0gQm9vbGVhbih3aW5kb3cuRXZlbnRzLmdldExpbmtQcmV2aWV3U2V0dGluZygpKTtcblxuICBjb25zdCBwcmVmZXJDb250YWN0QXZhdGFycyA9IHdpbmRvdy5zdG9yYWdlLmdldCgncHJlZmVyQ29udGFjdEF2YXRhcnMnKTtcbiAgaWYgKHByZWZlckNvbnRhY3RBdmF0YXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICBhY2NvdW50UmVjb3JkLnByZWZlckNvbnRhY3RBdmF0YXJzID0gQm9vbGVhbihwcmVmZXJDb250YWN0QXZhdGFycyk7XG4gIH1cblxuICBjb25zdCBwcmltYXJ5U2VuZHNTbXMgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ3ByaW1hcnlTZW5kc1NtcycpO1xuICBpZiAocHJpbWFyeVNlbmRzU21zICE9PSB1bmRlZmluZWQpIHtcbiAgICBhY2NvdW50UmVjb3JkLnByaW1hcnlTZW5kc1NtcyA9IEJvb2xlYW4ocHJpbWFyeVNlbmRzU21zKTtcbiAgfVxuXG4gIGNvbnN0IGFjY291bnRFMTY0ID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdhY2NvdW50RTE2NCcpO1xuICBpZiAoYWNjb3VudEUxNjQgIT09IHVuZGVmaW5lZCkge1xuICAgIGFjY291bnRSZWNvcmQuZTE2NCA9IGFjY291bnRFMTY0O1xuICB9XG5cbiAgY29uc3QgcmF3UHJlZmVycmVkUmVhY3Rpb25FbW9qaSA9IHdpbmRvdy5zdG9yYWdlLmdldChcbiAgICAncHJlZmVycmVkUmVhY3Rpb25FbW9qaSdcbiAgKTtcbiAgaWYgKHByZWZlcnJlZFJlYWN0aW9uRW1vamkuY2FuQmVTeW5jZWQocmF3UHJlZmVycmVkUmVhY3Rpb25FbW9qaSkpIHtcbiAgICBhY2NvdW50UmVjb3JkLnByZWZlcnJlZFJlYWN0aW9uRW1vamkgPSByYXdQcmVmZXJyZWRSZWFjdGlvbkVtb2ppO1xuICB9XG5cbiAgY29uc3QgdW5pdmVyc2FsRXhwaXJlVGltZXIgPSBnZXRVbml2ZXJzYWxFeHBpcmVUaW1lcigpO1xuICBpZiAodW5pdmVyc2FsRXhwaXJlVGltZXIpIHtcbiAgICBhY2NvdW50UmVjb3JkLnVuaXZlcnNhbEV4cGlyZVRpbWVyID0gTnVtYmVyKHVuaXZlcnNhbEV4cGlyZVRpbWVyKTtcbiAgfVxuXG4gIGNvbnN0IFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTSA9XG4gICAgUHJvdG8uQWNjb3VudFJlY29yZC5QaG9uZU51bWJlclNoYXJpbmdNb2RlO1xuICBjb25zdCBwaG9uZU51bWJlclNoYXJpbmdNb2RlID0gcGFyc2VQaG9uZU51bWJlclNoYXJpbmdNb2RlKFxuICAgIHdpbmRvdy5zdG9yYWdlLmdldCgncGhvbmVOdW1iZXJTaGFyaW5nTW9kZScpXG4gICk7XG4gIHN3aXRjaCAocGhvbmVOdW1iZXJTaGFyaW5nTW9kZSkge1xuICAgIGNhc2UgUGhvbmVOdW1iZXJTaGFyaW5nTW9kZS5FdmVyeWJvZHk6XG4gICAgICBhY2NvdW50UmVjb3JkLnBob25lTnVtYmVyU2hhcmluZ01vZGUgPVxuICAgICAgICBQSE9ORV9OVU1CRVJfU0hBUklOR19NT0RFX0VOVU0uRVZFUllCT0RZO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQaG9uZU51bWJlclNoYXJpbmdNb2RlLkNvbnRhY3RzT25seTpcbiAgICAgIGFjY291bnRSZWNvcmQucGhvbmVOdW1iZXJTaGFyaW5nTW9kZSA9XG4gICAgICAgIFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTS5DT05UQUNUU19PTkxZO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQaG9uZU51bWJlclNoYXJpbmdNb2RlLk5vYm9keTpcbiAgICAgIGFjY291bnRSZWNvcmQucGhvbmVOdW1iZXJTaGFyaW5nTW9kZSA9XG4gICAgICAgIFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTS5OT0JPRFk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihwaG9uZU51bWJlclNoYXJpbmdNb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHBob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5ID0gcGFyc2VQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eShcbiAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3Bob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5JylcbiAgKTtcbiAgc3dpdGNoIChwaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSkge1xuICAgIGNhc2UgUGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHkuRGlzY292ZXJhYmxlOlxuICAgICAgYWNjb3VudFJlY29yZC5ub3REaXNjb3ZlcmFibGVCeVBob25lTnVtYmVyID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5Lk5vdERpc2NvdmVyYWJsZTpcbiAgICAgIGFjY291bnRSZWNvcmQubm90RGlzY292ZXJhYmxlQnlQaG9uZU51bWJlciA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihwaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSk7XG4gIH1cblxuICBjb25zdCBwaW5uZWRDb252ZXJzYXRpb25zID0gd2luZG93LnN0b3JhZ2VcbiAgICAuZ2V0KCdwaW5uZWRDb252ZXJzYXRpb25JZHMnLCBuZXcgQXJyYXk8c3RyaW5nPigpKVxuICAgIC5tYXAoaWQgPT4ge1xuICAgICAgY29uc3QgcGlubmVkQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKTtcblxuICAgICAgaWYgKHBpbm5lZENvbnZlcnNhdGlvbikge1xuICAgICAgICBjb25zdCBwaW5uZWRDb252ZXJzYXRpb25SZWNvcmQgPVxuICAgICAgICAgIG5ldyBQcm90by5BY2NvdW50UmVjb3JkLlBpbm5lZENvbnZlcnNhdGlvbigpO1xuXG4gICAgICAgIGlmIChwaW5uZWRDb252ZXJzYXRpb24uZ2V0KCd0eXBlJykgPT09ICdwcml2YXRlJykge1xuICAgICAgICAgIHBpbm5lZENvbnZlcnNhdGlvblJlY29yZC5pZGVudGlmaWVyID0gJ2NvbnRhY3QnO1xuICAgICAgICAgIHBpbm5lZENvbnZlcnNhdGlvblJlY29yZC5jb250YWN0ID0ge1xuICAgICAgICAgICAgdXVpZDogcGlubmVkQ29udmVyc2F0aW9uLmdldCgndXVpZCcpLFxuICAgICAgICAgICAgZTE2NDogcGlubmVkQ29udmVyc2F0aW9uLmdldCgnZTE2NCcpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNHcm91cFYxKHBpbm5lZENvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIHBpbm5lZENvbnZlcnNhdGlvblJlY29yZC5pZGVudGlmaWVyID0gJ2xlZ2FjeUdyb3VwSWQnO1xuICAgICAgICAgIGNvbnN0IGdyb3VwSWQgPSBwaW5uZWRDb252ZXJzYXRpb24uZ2V0KCdncm91cElkJyk7XG4gICAgICAgICAgaWYgKCFncm91cElkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICd0b0FjY291bnRSZWNvcmQ6IHRyeWluZyB0byBwaW4gYSB2MSBHcm91cCB3aXRob3V0IGdyb3VwSWQnXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwaW5uZWRDb252ZXJzYXRpb25SZWNvcmQubGVnYWN5R3JvdXBJZCA9IEJ5dGVzLmZyb21CaW5hcnkoZ3JvdXBJZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNHcm91cFYyKHBpbm5lZENvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIHBpbm5lZENvbnZlcnNhdGlvblJlY29yZC5pZGVudGlmaWVyID0gJ2dyb3VwTWFzdGVyS2V5JztcbiAgICAgICAgICBjb25zdCBtYXN0ZXJLZXkgPSBwaW5uZWRDb252ZXJzYXRpb24uZ2V0KCdtYXN0ZXJLZXknKTtcbiAgICAgICAgICBpZiAoIW1hc3RlcktleSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAndG9BY2NvdW50UmVjb3JkOiB0cnlpbmcgdG8gcGluIGEgdjIgR3JvdXAgd2l0aG91dCBtYXN0ZXJLZXknXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwaW5uZWRDb252ZXJzYXRpb25SZWNvcmQuZ3JvdXBNYXN0ZXJLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KG1hc3RlcktleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGlubmVkQ29udmVyc2F0aW9uUmVjb3JkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pXG4gICAgLmZpbHRlcihcbiAgICAgIChcbiAgICAgICAgcGlubmVkQ29udmVyc2F0aW9uQ2xhc3NcbiAgICAgICk6IHBpbm5lZENvbnZlcnNhdGlvbkNsYXNzIGlzIFByb3RvLkFjY291bnRSZWNvcmQuUGlubmVkQ29udmVyc2F0aW9uID0+XG4gICAgICAgIHBpbm5lZENvbnZlcnNhdGlvbkNsYXNzICE9PSB1bmRlZmluZWRcbiAgICApO1xuXG4gIGFjY291bnRSZWNvcmQucGlubmVkQ29udmVyc2F0aW9ucyA9IHBpbm5lZENvbnZlcnNhdGlvbnM7XG5cbiAgY29uc3Qgc3Vic2NyaWJlcklkID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdzdWJzY3JpYmVySWQnKTtcbiAgaWYgKHN1YnNjcmliZXJJZCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICBhY2NvdW50UmVjb3JkLnN1YnNjcmliZXJJZCA9IHN1YnNjcmliZXJJZDtcbiAgfVxuICBjb25zdCBzdWJzY3JpYmVyQ3VycmVuY3lDb2RlID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdzdWJzY3JpYmVyQ3VycmVuY3lDb2RlJyk7XG4gIGlmICh0eXBlb2Ygc3Vic2NyaWJlckN1cnJlbmN5Q29kZSA9PT0gJ3N0cmluZycpIHtcbiAgICBhY2NvdW50UmVjb3JkLnN1YnNjcmliZXJDdXJyZW5jeUNvZGUgPSBzdWJzY3JpYmVyQ3VycmVuY3lDb2RlO1xuICB9XG4gIGNvbnN0IGRpc3BsYXlCYWRnZXNPblByb2ZpbGUgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ2Rpc3BsYXlCYWRnZXNPblByb2ZpbGUnKTtcbiAgaWYgKGRpc3BsYXlCYWRnZXNPblByb2ZpbGUgIT09IHVuZGVmaW5lZCkge1xuICAgIGFjY291bnRSZWNvcmQuZGlzcGxheUJhZGdlc09uUHJvZmlsZSA9IGRpc3BsYXlCYWRnZXNPblByb2ZpbGU7XG4gIH1cbiAgY29uc3Qga2VlcE11dGVkQ2hhdHNBcmNoaXZlZCA9IHdpbmRvdy5zdG9yYWdlLmdldCgna2VlcE11dGVkQ2hhdHNBcmNoaXZlZCcpO1xuICBpZiAoa2VlcE11dGVkQ2hhdHNBcmNoaXZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYWNjb3VudFJlY29yZC5rZWVwTXV0ZWRDaGF0c0FyY2hpdmVkID0ga2VlcE11dGVkQ2hhdHNBcmNoaXZlZDtcbiAgfVxuXG4gIGFwcGx5VW5rbm93bkZpZWxkcyhhY2NvdW50UmVjb3JkLCBjb252ZXJzYXRpb24pO1xuXG4gIHJldHVybiBhY2NvdW50UmVjb3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Hcm91cFYxUmVjb3JkKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsXG4pOiBQcm90by5Hcm91cFYxUmVjb3JkIHtcbiAgY29uc3QgZ3JvdXBWMVJlY29yZCA9IG5ldyBQcm90by5Hcm91cFYxUmVjb3JkKCk7XG5cbiAgZ3JvdXBWMVJlY29yZC5pZCA9IEJ5dGVzLmZyb21CaW5hcnkoU3RyaW5nKGNvbnZlcnNhdGlvbi5nZXQoJ2dyb3VwSWQnKSkpO1xuICBncm91cFYxUmVjb3JkLmJsb2NrZWQgPSBjb252ZXJzYXRpb24uaXNCbG9ja2VkKCk7XG4gIGdyb3VwVjFSZWNvcmQud2hpdGVsaXN0ZWQgPSBCb29sZWFuKGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJykpO1xuICBncm91cFYxUmVjb3JkLmFyY2hpdmVkID0gQm9vbGVhbihjb252ZXJzYXRpb24uZ2V0KCdpc0FyY2hpdmVkJykpO1xuICBncm91cFYxUmVjb3JkLm1hcmtlZFVucmVhZCA9IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnbWFya2VkVW5yZWFkJykpO1xuICBncm91cFYxUmVjb3JkLm11dGVkVW50aWxUaW1lc3RhbXAgPSBnZXRTYWZlTG9uZ0Zyb21UaW1lc3RhbXAoXG4gICAgY29udmVyc2F0aW9uLmdldCgnbXV0ZUV4cGlyZXNBdCcpXG4gICk7XG5cbiAgYXBwbHlVbmtub3duRmllbGRzKGdyb3VwVjFSZWNvcmQsIGNvbnZlcnNhdGlvbik7XG5cbiAgcmV0dXJuIGdyb3VwVjFSZWNvcmQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0dyb3VwVjJSZWNvcmQoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWxcbik6IFByb3RvLkdyb3VwVjJSZWNvcmQge1xuICBjb25zdCBncm91cFYyUmVjb3JkID0gbmV3IFByb3RvLkdyb3VwVjJSZWNvcmQoKTtcblxuICBjb25zdCBtYXN0ZXJLZXkgPSBjb252ZXJzYXRpb24uZ2V0KCdtYXN0ZXJLZXknKTtcbiAgaWYgKG1hc3RlcktleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZ3JvdXBWMlJlY29yZC5tYXN0ZXJLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KG1hc3RlcktleSk7XG4gIH1cbiAgZ3JvdXBWMlJlY29yZC5ibG9ja2VkID0gY29udmVyc2F0aW9uLmlzQmxvY2tlZCgpO1xuICBncm91cFYyUmVjb3JkLndoaXRlbGlzdGVkID0gQm9vbGVhbihjb252ZXJzYXRpb24uZ2V0KCdwcm9maWxlU2hhcmluZycpKTtcbiAgZ3JvdXBWMlJlY29yZC5hcmNoaXZlZCA9IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnaXNBcmNoaXZlZCcpKTtcbiAgZ3JvdXBWMlJlY29yZC5tYXJrZWRVbnJlYWQgPSBCb29sZWFuKGNvbnZlcnNhdGlvbi5nZXQoJ21hcmtlZFVucmVhZCcpKTtcbiAgZ3JvdXBWMlJlY29yZC5tdXRlZFVudGlsVGltZXN0YW1wID0gZ2V0U2FmZUxvbmdGcm9tVGltZXN0YW1wKFxuICAgIGNvbnZlcnNhdGlvbi5nZXQoJ211dGVFeHBpcmVzQXQnKVxuICApO1xuICBncm91cFYyUmVjb3JkLmRvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWQgPSBCb29sZWFuKFxuICAgIGNvbnZlcnNhdGlvbi5nZXQoJ2RvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWQnKVxuICApO1xuICBncm91cFYyUmVjb3JkLmhpZGVTdG9yeSA9IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnaGlkZVN0b3J5JykpO1xuXG4gIGFwcGx5VW5rbm93bkZpZWxkcyhncm91cFYyUmVjb3JkLCBjb252ZXJzYXRpb24pO1xuXG4gIHJldHVybiBncm91cFYyUmVjb3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQoXG4gIHN0b3J5RGlzdHJpYnV0aW9uTGlzdDogU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGVcbik6IFByb3RvLlN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZCB7XG4gIGNvbnN0IHN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZCA9IG5ldyBQcm90by5TdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQoKTtcblxuICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuaWRlbnRpZmllciA9IHV1aWRUb0J5dGVzKFxuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdC5pZFxuICApO1xuICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQubmFtZSA9IHN0b3J5RGlzdHJpYnV0aW9uTGlzdC5uYW1lO1xuICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuZGVsZXRlZEF0VGltZXN0YW1wID0gZ2V0U2FmZUxvbmdGcm9tVGltZXN0YW1wKFxuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdC5kZWxldGVkQXRUaW1lc3RhbXBcbiAgKTtcbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLmFsbG93c1JlcGxpZXMgPSBCb29sZWFuKFxuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdC5hbGxvd3NSZXBsaWVzXG4gICk7XG4gIHN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZC5pc0Jsb2NrTGlzdCA9IEJvb2xlYW4oXG4gICAgc3RvcnlEaXN0cmlidXRpb25MaXN0LmlzQmxvY2tMaXN0XG4gICk7XG4gIHN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZC5yZWNpcGllbnRVdWlkcyA9IHN0b3J5RGlzdHJpYnV0aW9uTGlzdC5tZW1iZXJzO1xuXG4gIGlmIChzdG9yeURpc3RyaWJ1dGlvbkxpc3Quc3RvcmFnZVVua25vd25GaWVsZHMpIHtcbiAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuX191bmtub3duRmllbGRzID0gW1xuICAgICAgc3RvcnlEaXN0cmlidXRpb25MaXN0LnN0b3JhZ2VVbmtub3duRmllbGRzLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TdGlja2VyUGFja1JlY29yZChcbiAgc3RpY2tlclBhY2s6IFN0aWNrZXJQYWNrSW5mb1R5cGVcbik6IFByb3RvLlN0aWNrZXJQYWNrUmVjb3JkIHtcbiAgY29uc3Qgc3RpY2tlclBhY2tSZWNvcmQgPSBuZXcgUHJvdG8uU3RpY2tlclBhY2tSZWNvcmQoKTtcblxuICBzdGlja2VyUGFja1JlY29yZC5wYWNrSWQgPSBCeXRlcy5mcm9tSGV4KHN0aWNrZXJQYWNrLmlkKTtcblxuICBpZiAoc3RpY2tlclBhY2sudW5pbnN0YWxsZWRBdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RpY2tlclBhY2tSZWNvcmQuZGVsZXRlZEF0VGltZXN0YW1wID0gTG9uZy5mcm9tTnVtYmVyKFxuICAgICAgc3RpY2tlclBhY2sudW5pbnN0YWxsZWRBdFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgc3RpY2tlclBhY2tSZWNvcmQucGFja0tleSA9IEJ5dGVzLmZyb21CYXNlNjQoc3RpY2tlclBhY2sua2V5KTtcbiAgICBpZiAoc3RpY2tlclBhY2sucG9zaXRpb24pIHtcbiAgICAgIHN0aWNrZXJQYWNrUmVjb3JkLnBvc2l0aW9uID0gc3RpY2tlclBhY2sucG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0aWNrZXJQYWNrLnN0b3JhZ2VVbmtub3duRmllbGRzKSB7XG4gICAgc3RpY2tlclBhY2tSZWNvcmQuX191bmtub3duRmllbGRzID0gW3N0aWNrZXJQYWNrLnN0b3JhZ2VVbmtub3duRmllbGRzXTtcbiAgfVxuXG4gIHJldHVybiBzdGlja2VyUGFja1JlY29yZDtcbn1cblxudHlwZSBNZXNzYWdlUmVxdWVzdENhcGFibGVSZWNvcmQgPSBQcm90by5JQ29udGFjdFJlY29yZCB8IFByb3RvLklHcm91cFYxUmVjb3JkO1xuXG5mdW5jdGlvbiBhcHBseU1lc3NhZ2VSZXF1ZXN0U3RhdGUoXG4gIHJlY29yZDogTWVzc2FnZVJlcXVlc3RDYXBhYmxlUmVjb3JkLFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsXG4pOiB2b2lkIHtcbiAgY29uc3QgbWVzc2FnZVJlcXVlc3RFbnVtID0gUHJvdG8uU3luY01lc3NhZ2UuTWVzc2FnZVJlcXVlc3RSZXNwb25zZS5UeXBlO1xuXG4gIGlmIChyZWNvcmQuYmxvY2tlZCkge1xuICAgIGNvbnZlcnNhdGlvbi5hcHBseU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UobWVzc2FnZVJlcXVlc3RFbnVtLkJMT0NLLCB7XG4gICAgICBmcm9tU3luYzogdHJ1ZSxcbiAgICAgIHZpYVN0b3JhZ2VTZXJ2aWNlU3luYzogdHJ1ZSxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChyZWNvcmQud2hpdGVsaXN0ZWQpIHtcbiAgICAvLyB1bmJsb2NraW5nIGlzIGFsc28gaGFuZGxlZCBieSB0aGlzIGZ1bmN0aW9uIHdoaWNoIGlzIHdoeSB0aGUgbmV4dFxuICAgIC8vIGNvbmRpdGlvbiBpcyBwYXJ0IG9mIHRoZSBlbHNlLWlmIGFuZCBub3Qgc2VwYXJhdGVcbiAgICBjb252ZXJzYXRpb24uYXBwbHlNZXNzYWdlUmVxdWVzdFJlc3BvbnNlKG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFQsIHtcbiAgICAgIGZyb21TeW5jOiB0cnVlLFxuICAgICAgdmlhU3RvcmFnZVNlcnZpY2VTeW5jOiB0cnVlLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKCFyZWNvcmQuYmxvY2tlZCkge1xuICAgIC8vIGlmIHRoZSBjb25kaXRpb24gYWJvdmUgZmFpbGVkIHRoZSBzdGF0ZSBjb3VsZCBzdGlsbCBiZSBibG9ja2VkPWZhbHNlXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgdW5ibG9jayB0aGUgY29udmVyc2F0aW9uXG4gICAgY29udmVyc2F0aW9uLnVuYmxvY2soeyB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUgfSk7XG4gIH1cblxuICBpZiAocmVjb3JkLndoaXRlbGlzdGVkID09PSBmYWxzZSkge1xuICAgIGNvbnZlcnNhdGlvbi5kaXNhYmxlUHJvZmlsZVNoYXJpbmcoeyB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUgfSk7XG4gIH1cbn1cblxudHlwZSBSZWNvcmRDbGFzc09iamVjdCA9IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgW2tleTogc3RyaW5nXTogYW55O1xufTtcblxuZnVuY3Rpb24gZG9SZWNvcmRzQ29uZmxpY3QoXG4gIGxvY2FsUmVjb3JkOiBSZWNvcmRDbGFzc09iamVjdCxcbiAgcmVtb3RlUmVjb3JkOiBSZWNvcmRDbGFzc09iamVjdFxuKTogSGFzQ29uZmxpY3RSZXN1bHRUeXBlIHtcbiAgY29uc3QgZGV0YWlscyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVtb3RlUmVjb3JkKSkge1xuICAgIGNvbnN0IGxvY2FsVmFsdWUgPSBsb2NhbFJlY29yZFtrZXldO1xuICAgIGNvbnN0IHJlbW90ZVZhbHVlID0gcmVtb3RlUmVjb3JkW2tleV07XG5cbiAgICAvLyBTb21ldGltZXMgd2UgaGF2ZSBhIEJ5dGVCdWZmZXIgYW5kIGFuIFVpbnQ4QXJyYXksIHRoaXMgZW5zdXJlcyB0aGF0IHdlXG4gICAgLy8gYXJlIGNvbXBhcmluZyB0aGVtIGJvdGggZXF1YWxseSBieSBjb252ZXJ0aW5nIHRoZW0gaW50byBiYXNlNjQgc3RyaW5nLlxuICAgIGlmIChsb2NhbFZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgY29uc3QgYXJlRXF1YWwgPSBCeXRlcy5hcmVFcXVhbChsb2NhbFZhbHVlLCByZW1vdGVWYWx1ZSk7XG4gICAgICBpZiAoIWFyZUVxdWFsKSB7XG4gICAgICAgIGRldGFpbHMucHVzaChga2V5PSR7a2V5fTogZGlmZmVyZW50IGJ5dGVzYCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBJZiBib3RoIHR5cGVzIGFyZSBMb25nIHdlIGNhbiB1c2UgTG9uZydzIGVxdWFscyB0byBjb21wYXJlIHRoZW1cbiAgICBpZiAoTG9uZy5pc0xvbmcobG9jYWxWYWx1ZSkgfHwgdHlwZW9mIGxvY2FsVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBpZiAoIUxvbmcuaXNMb25nKHJlbW90ZVZhbHVlKSAmJiB0eXBlb2YgcmVtb3RlVmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGRldGFpbHMucHVzaChga2V5PSR7a2V5fTogdHlwZSBtaXNtYXRjaGApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXJlRXF1YWwgPSBMb25nLmZyb21WYWx1ZShsb2NhbFZhbHVlKS5lcXVhbHMoXG4gICAgICAgIExvbmcuZnJvbVZhbHVlKHJlbW90ZVZhbHVlKVxuICAgICAgKTtcbiAgICAgIGlmICghYXJlRXF1YWwpIHtcbiAgICAgICAgZGV0YWlscy5wdXNoKGBrZXk9JHtrZXl9OiBkaWZmZXJlbnQgaW50ZWdlcnNgKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdwaW5uZWRDb252ZXJzYXRpb25zJykge1xuICAgICAgY29uc3QgYXJlRXF1YWwgPSBhcmVQaW5uZWRDb252ZXJzYXRpb25zRXF1YWwobG9jYWxWYWx1ZSwgcmVtb3RlVmFsdWUpO1xuICAgICAgaWYgKCFhcmVFcXVhbCkge1xuICAgICAgICBkZXRhaWxzLnB1c2goJ3Bpbm5lZENvbnZlcnNhdGlvbnMnKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFZhbHVlID09PSByZW1vdGVWYWx1ZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gU29tZXRpbWVzIHdlIGdldCBgbnVsbGAgdmFsdWVzIGZyb20gUHJvdG9idWYgYW5kIHRoZXkgc2hvdWxkIGRlZmF1bHQgdG9cbiAgICAvLyBmYWxzZSwgZW1wdHkgc3RyaW5nLCBvciAwIGZvciB0aGVzZSByZWNvcmRzIHdlIGRvIG5vdCBjb3VudCB0aGVtIGFzXG4gICAgLy8gY29uZmxpY3RpbmcuXG4gICAgaWYgKFxuICAgICAgcmVtb3RlVmFsdWUgPT09IG51bGwgJiZcbiAgICAgIChsb2NhbFZhbHVlID09PSBmYWxzZSB8fFxuICAgICAgICBsb2NhbFZhbHVlID09PSAnJyB8fFxuICAgICAgICBsb2NhbFZhbHVlID09PSAwIHx8XG4gICAgICAgIChMb25nLmlzTG9uZyhsb2NhbFZhbHVlKSAmJiBsb2NhbFZhbHVlLnRvTnVtYmVyKCkgPT09IDApKVxuICAgICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgYXJlRXF1YWwgPSBpc0VxdWFsKGxvY2FsVmFsdWUsIHJlbW90ZVZhbHVlKTtcblxuICAgIGlmICghYXJlRXF1YWwpIHtcbiAgICAgIGRldGFpbHMucHVzaChga2V5PSR7a2V5fTogZGlmZmVyZW50IHZhbHVlc2ApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzQ29uZmxpY3Q6IGRldGFpbHMubGVuZ3RoID4gMCxcbiAgICBkZXRhaWxzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBkb2VzUmVjb3JkSGF2ZVBlbmRpbmdDaGFuZ2VzKFxuICBtZXJnZWRSZWNvcmQ6IFJlY29yZENsYXNzLFxuICBzZXJ2aWNlUmVjb3JkOiBSZWNvcmRDbGFzcyxcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbFxuKTogSGFzQ29uZmxpY3RSZXN1bHRUeXBlIHtcbiAgY29uc3Qgc2hvdWxkU3luYyA9IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnbmVlZHNTdG9yYWdlU2VydmljZVN5bmMnKSk7XG5cbiAgaWYgKCFzaG91bGRTeW5jKSB7XG4gICAgcmV0dXJuIHsgaGFzQ29uZmxpY3Q6IGZhbHNlLCBkZXRhaWxzOiBbXSB9O1xuICB9XG5cbiAgY29uc3QgeyBoYXNDb25mbGljdCwgZGV0YWlscyB9ID0gZG9SZWNvcmRzQ29uZmxpY3QoXG4gICAgbWVyZ2VkUmVjb3JkLFxuICAgIHNlcnZpY2VSZWNvcmRcbiAgKTtcblxuICBpZiAoIWhhc0NvbmZsaWN0KSB7XG4gICAgY29udmVyc2F0aW9uLnNldCh7IG5lZWRzU3RvcmFnZVNlcnZpY2VTeW5jOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzQ29uZmxpY3QsXG4gICAgZGV0YWlscyxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1lcmdlR3JvdXBWMVJlY29yZChcbiAgc3RvcmFnZUlEOiBzdHJpbmcsXG4gIHN0b3JhZ2VWZXJzaW9uOiBudW1iZXIsXG4gIGdyb3VwVjFSZWNvcmQ6IFByb3RvLklHcm91cFYxUmVjb3JkXG4pOiBQcm9taXNlPE1lcmdlUmVzdWx0VHlwZT4ge1xuICBpZiAoIWdyb3VwVjFSZWNvcmQuaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIElEIGZvciAke3N0b3JhZ2VJRH1gKTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwSWQgPSBCeXRlcy50b0JpbmFyeShncm91cFYxUmVjb3JkLmlkKTtcbiAgbGV0IGRldGFpbHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIC8vIEF0dGVtcHQgdG8gZmV0Y2ggYW4gZXhpc3RpbmcgZ3JvdXAgcGVydGFpbmluZyB0byB0aGUgYGdyb3VwSWRgIG9yIGNyZWF0ZVxuICAvLyBhIG5ldyBncm91cCBhbmQgcG9wdWxhdGUgaXQgd2l0aCB0aGUgYXR0cmlidXRlcyBmcm9tIHRoZSByZWNvcmQuXG4gIGxldCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZ3JvdXBJZCk7XG5cbiAgLy8gQmVjYXVzZSBDb252ZXJzYXRpb25Db250cm9sbGVyLmdldCByZXRyaWV2ZXMgYWxsIHR5cGVzIG9mIHJlY29yZHMgd2VcbiAgLy8gbWF5IHNvbWV0aW1lcyBoYXZlIGEgc2l0dWF0aW9uIHdoZXJlIHdlIGdldCBhIHJlY29yZCBvZiBncm91cHYxIHR5cGVcbiAgLy8gd2hlcmUgdGhlIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiBpdHMgSUQgbWF0Y2hlcyBhIHYyIHJlY29yZCBpbiBtZW1vcnkuXG4gIC8vIEhlcmUgd2UgZW5zdXJlIHRoYXQgdGhlIHJlY29yZCB3ZSdyZSBhYm91dCB0byBwcm9jZXNzIGlzIEdWMSBvdGhlcndpc2VcbiAgLy8gd2UgZHJvcCB0aGUgdXBkYXRlLlxuICBpZiAoY29udmVyc2F0aW9uICYmICFpc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFJlY29yZCBoYXMgZ3JvdXAgdHlwZSBtaXNtYXRjaCAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gXG4gICAgKTtcbiAgfVxuXG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgLy8gSXQncyBwb3NzaWJsZSB0aGlzIGdyb3VwIHdhcyBtaWdyYXRlZCB0byBhIEdWMiBpZiBzbyB3ZSBhdHRlbXB0IHRvXG4gICAgLy8gcmV0cmlldmUgdGhlIG1hc3RlciBrZXkgYW5kIGZpbmQgdGhlIGNvbnZlcnNhdGlvbiBsb2NhbGx5LiBJZiB3ZVxuICAgIC8vIGFyZSBzdWNjZXNzZnVsIHRoZW4gd2UgY29udGludWUgc2V0dGluZyBhbmQgYXBwbHlpbmcgc3RhdGUuXG4gICAgY29uc3QgbWFzdGVyS2V5QnVmZmVyID0gZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEoZ3JvdXBWMVJlY29yZC5pZCk7XG4gICAgY29uc3QgZmllbGRzID0gZGVyaXZlR3JvdXBGaWVsZHMobWFzdGVyS2V5QnVmZmVyKTtcbiAgICBjb25zdCBkZXJpdmVkR3JvdXBWMklkID0gQnl0ZXMudG9CYXNlNjQoZmllbGRzLmlkKTtcblxuICAgIGRldGFpbHMucHVzaChcbiAgICAgICdmYWlsZWQgdG8gZmluZCBncm91cCBieSB2MSBpZCAnICtcbiAgICAgICAgYGF0dGVtcHRpbmcgbG9va3VwIGJ5IHYyIGdyb3VwdjIoJHtkZXJpdmVkR3JvdXBWMklkfSlgXG4gICAgKTtcbiAgICBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZGVyaXZlZEdyb3VwVjJJZCk7XG4gIH1cbiAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICBpZiAoZ3JvdXBWMVJlY29yZC5pZC5ieXRlTGVuZ3RoICE9PSAxNikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBndjEnKTtcbiAgICB9XG5cbiAgICBjb252ZXJzYXRpb24gPSBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZUFuZFdhaXQoXG4gICAgICBncm91cElkLFxuICAgICAgJ2dyb3VwJ1xuICAgICk7XG4gICAgZGV0YWlscy5wdXNoKCdjcmVhdGVkIGEgbmV3IGdyb3VwIGxvY2FsbHknKTtcbiAgfVxuXG4gIGNvbnN0IG9sZFN0b3JhZ2VJRCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VJRCcpO1xuICBjb25zdCBvbGRTdG9yYWdlVmVyc2lvbiA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VWZXJzaW9uJyk7XG5cbiAgaWYgKCFpc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgZGV0YWlscy5wdXNoKCdHVjEgcmVjb3JkIGZvciBHVjIgZ3JvdXAsIGRyb3BwaW5nJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gTm90ZTogY29uZmxpY3RzIGNhdXNlIGltbWVkaWF0ZSB1cGxvYWRzLCBidXQgd2Ugc2hvdWxkIHVwbG9hZFxuICAgICAgLy8gb25seSBpbiByZXNwb25zZSB0byB1c2VyJ3MgYWN0aW9uLlxuICAgICAgaGFzQ29uZmxpY3Q6IGZhbHNlLFxuICAgICAgc2hvdWxkRHJvcDogdHJ1ZSxcbiAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgIG9sZFN0b3JhZ2VJRCxcbiAgICAgIG9sZFN0b3JhZ2VWZXJzaW9uLFxuICAgICAgZGV0YWlscyxcbiAgICB9O1xuICB9XG5cbiAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgaXNBcmNoaXZlZDogQm9vbGVhbihncm91cFYxUmVjb3JkLmFyY2hpdmVkKSxcbiAgICBtYXJrZWRVbnJlYWQ6IEJvb2xlYW4oZ3JvdXBWMVJlY29yZC5tYXJrZWRVbnJlYWQpLFxuICAgIHN0b3JhZ2VJRCxcbiAgICBzdG9yYWdlVmVyc2lvbixcbiAgfSk7XG5cbiAgY29udmVyc2F0aW9uLnNldE11dGVFeHBpcmF0aW9uKFxuICAgIGdldFRpbWVzdGFtcEZyb21Mb25nKGdyb3VwVjFSZWNvcmQubXV0ZWRVbnRpbFRpbWVzdGFtcCksXG4gICAge1xuICAgICAgdmlhU3RvcmFnZVNlcnZpY2VTeW5jOiB0cnVlLFxuICAgIH1cbiAgKTtcblxuICBhcHBseU1lc3NhZ2VSZXF1ZXN0U3RhdGUoZ3JvdXBWMVJlY29yZCwgY29udmVyc2F0aW9uKTtcblxuICBsZXQgaGFzUGVuZGluZ0NoYW5nZXM6IGJvb2xlYW47XG5cbiAgaWYgKGlzR3JvdXBWMShjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICBhZGRVbmtub3duRmllbGRzKGdyb3VwVjFSZWNvcmQsIGNvbnZlcnNhdGlvbiwgZGV0YWlscyk7XG5cbiAgICBjb25zdCB7IGhhc0NvbmZsaWN0LCBkZXRhaWxzOiBleHRyYURldGFpbHMgfSA9IGRvZXNSZWNvcmRIYXZlUGVuZGluZ0NoYW5nZXMoXG4gICAgICB0b0dyb3VwVjFSZWNvcmQoY29udmVyc2F0aW9uKSxcbiAgICAgIGdyb3VwVjFSZWNvcmQsXG4gICAgICBjb252ZXJzYXRpb25cbiAgICApO1xuXG4gICAgZGV0YWlscyA9IGRldGFpbHMuY29uY2F0KGV4dHJhRGV0YWlscyk7XG4gICAgaGFzUGVuZGluZ0NoYW5nZXMgPSBoYXNDb25mbGljdDtcbiAgfSBlbHNlIHtcbiAgICAvLyBXZSBjYW5ub3QgcHJlc2VydmUgdW5rbm93biBmaWVsZHMgaWYgbG9jYWwgZ3JvdXAgaXMgVjIgYW5kIHRoZSByZW1vdGUgaXNcbiAgICAvLyBzdGlsbCBWMSwgYmVjYXVzZSB0aGUgc3RvcmFnZUl0ZW0gdGhhdCB3ZSdsbCBwdXQgaW50byBtYW5pZmVzdCB3aWxsIGhhdmVcbiAgICAvLyBhIGRpZmZlcmVudCByZWNvcmQgdHlwZS5cblxuICAgIC8vIFdlIHdhbnQgdG8gdXBncmFkZSBncm91cCBpbiB0aGUgc3RvcmFnZSBhZnRlciBtZXJnaW5nIGl0LlxuICAgIGhhc1BlbmRpbmdDaGFuZ2VzID0gdHJ1ZTtcbiAgICBkZXRhaWxzLnB1c2goJ21hcmtpbmcgdjEgZ3JvdXAgZm9yIGFuIHVwZGF0ZSB0byB2MicpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBoYXNDb25mbGljdDogaGFzUGVuZGluZ0NoYW5nZXMsXG4gICAgY29udmVyc2F0aW9uLFxuICAgIG9sZFN0b3JhZ2VJRCxcbiAgICBvbGRTdG9yYWdlVmVyc2lvbixcbiAgICBkZXRhaWxzLFxuICAgIHVwZGF0ZWRDb252ZXJzYXRpb25zOiBbY29udmVyc2F0aW9uXSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0R3JvdXBWMkNvbnZlcnNhdGlvbihcbiAgbWFzdGVyS2V5QnVmZmVyOiBVaW50OEFycmF5XG4pOiBDb252ZXJzYXRpb25Nb2RlbCB7XG4gIGNvbnN0IGdyb3VwRmllbGRzID0gZGVyaXZlR3JvdXBGaWVsZHMobWFzdGVyS2V5QnVmZmVyKTtcblxuICBjb25zdCBncm91cElkID0gQnl0ZXMudG9CYXNlNjQoZ3JvdXBGaWVsZHMuaWQpO1xuICBjb25zdCBtYXN0ZXJLZXkgPSBCeXRlcy50b0Jhc2U2NChtYXN0ZXJLZXlCdWZmZXIpO1xuICBjb25zdCBzZWNyZXRQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChncm91cEZpZWxkcy5zZWNyZXRQYXJhbXMpO1xuICBjb25zdCBwdWJsaWNQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChncm91cEZpZWxkcy5wdWJsaWNQYXJhbXMpO1xuXG4gIC8vIEZpcnN0IHdlIGNoZWNrIGZvciBhbiBleGlzdGluZyBHcm91cFYyIGdyb3VwXG4gIGNvbnN0IGdyb3VwVjIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZ3JvdXBJZCk7XG4gIGlmIChncm91cFYyKSB7XG4gICAgZ3JvdXBWMi5tYXliZVJlcGFpckdyb3VwVjIoe1xuICAgICAgbWFzdGVyS2V5LFxuICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgcHVibGljUGFyYW1zLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyb3VwVjI7XG4gIH1cblxuICAvLyBUaGVuIGNoZWNrIGZvciBWMSBncm91cCB3aXRoIG1hdGNoaW5nIGRlcml2ZWQgR1YyIGlkXG4gIGNvbnN0IGdyb3VwVjEgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRCeURlcml2ZWRHcm91cFYySWQoZ3JvdXBJZCk7XG4gIGlmIChncm91cFYxKSB7XG4gICAgcmV0dXJuIGdyb3VwVjE7XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmVuc3VyZUdyb3VwKGdyb3VwSWQsIHtcbiAgICAvLyBOb3RlOiBXZSBkb24ndCBzZXQgYWN0aXZlX2F0LCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIGdyb3VwIHRvIHNob3cgdW50aWxcbiAgICAvLyAgIHdlIGhhdmUgaW5mb3JtYXRpb24gYWJvdXQgaXQgYmV5b25kIHRoZXNlIGluaXRpYWwgZGV0YWlscy5cbiAgICAvLyAgIHNlZSBtYXliZVVwZGF0ZUdyb3VwKCkuXG4gICAgZ3JvdXBWZXJzaW9uOiAyLFxuICAgIG1hc3RlcktleSxcbiAgICBzZWNyZXRQYXJhbXMsXG4gICAgcHVibGljUGFyYW1zLFxuICB9KTtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgZ2V0R3JvdXBWMkNvbnZlcnNhdGlvbjogRmFpbGVkIHRvIGNyZWF0ZSBjb252ZXJzYXRpb24gZm9yIGdyb3VwdjIoJHtncm91cElkfSlgXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJzYXRpb247XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZXJnZUdyb3VwVjJSZWNvcmQoXG4gIHN0b3JhZ2VJRDogc3RyaW5nLFxuICBzdG9yYWdlVmVyc2lvbjogbnVtYmVyLFxuICBncm91cFYyUmVjb3JkOiBQcm90by5JR3JvdXBWMlJlY29yZFxuKTogUHJvbWlzZTxNZXJnZVJlc3VsdFR5cGU+IHtcbiAgaWYgKCFncm91cFYyUmVjb3JkLm1hc3RlcktleSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTm8gbWFzdGVyIGtleSBmb3IgJHtzdG9yYWdlSUR9YCk7XG4gIH1cblxuICBjb25zdCBtYXN0ZXJLZXlCdWZmZXIgPSBncm91cFYyUmVjb3JkLm1hc3RlcktleTtcbiAgY29uc3QgY29udmVyc2F0aW9uID0gZ2V0R3JvdXBWMkNvbnZlcnNhdGlvbihtYXN0ZXJLZXlCdWZmZXIpO1xuXG4gIGNvbnN0IG9sZFN0b3JhZ2VJRCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VJRCcpO1xuICBjb25zdCBvbGRTdG9yYWdlVmVyc2lvbiA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VWZXJzaW9uJyk7XG5cbiAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgaGlkZVN0b3J5OiBCb29sZWFuKGdyb3VwVjJSZWNvcmQuaGlkZVN0b3J5KSxcbiAgICBpc0FyY2hpdmVkOiBCb29sZWFuKGdyb3VwVjJSZWNvcmQuYXJjaGl2ZWQpLFxuICAgIG1hcmtlZFVucmVhZDogQm9vbGVhbihncm91cFYyUmVjb3JkLm1hcmtlZFVucmVhZCksXG4gICAgZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZDogQm9vbGVhbihcbiAgICAgIGdyb3VwVjJSZWNvcmQuZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZFxuICAgICksXG4gICAgc3RvcmFnZUlELFxuICAgIHN0b3JhZ2VWZXJzaW9uLFxuICB9KTtcblxuICBjb252ZXJzYXRpb24uc2V0TXV0ZUV4cGlyYXRpb24oXG4gICAgZ2V0VGltZXN0YW1wRnJvbUxvbmcoZ3JvdXBWMlJlY29yZC5tdXRlZFVudGlsVGltZXN0YW1wKSxcbiAgICB7XG4gICAgICB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUsXG4gICAgfVxuICApO1xuXG4gIGFwcGx5TWVzc2FnZVJlcXVlc3RTdGF0ZShncm91cFYyUmVjb3JkLCBjb252ZXJzYXRpb24pO1xuXG4gIGxldCBkZXRhaWxzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBhZGRVbmtub3duRmllbGRzKGdyb3VwVjJSZWNvcmQsIGNvbnZlcnNhdGlvbiwgZGV0YWlscyk7XG5cbiAgY29uc3QgeyBoYXNDb25mbGljdCwgZGV0YWlsczogZXh0cmFEZXRhaWxzIH0gPSBkb2VzUmVjb3JkSGF2ZVBlbmRpbmdDaGFuZ2VzKFxuICAgIHRvR3JvdXBWMlJlY29yZChjb252ZXJzYXRpb24pLFxuICAgIGdyb3VwVjJSZWNvcmQsXG4gICAgY29udmVyc2F0aW9uXG4gICk7XG5cbiAgZGV0YWlscyA9IGRldGFpbHMuY29uY2F0KGV4dHJhRGV0YWlscyk7XG5cbiAgY29uc3QgaXNHcm91cE5ld1RvVXMgPSAhaXNOdW1iZXIoY29udmVyc2F0aW9uLmdldCgncmV2aXNpb24nKSk7XG4gIGNvbnN0IGlzRmlyc3RTeW5jID0gIXdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZUZldGNoQ29tcGxldGUnKTtcbiAgY29uc3QgZHJvcEluaXRpYWxKb2luTWVzc2FnZSA9IGlzRmlyc3RTeW5jO1xuXG4gIGlmIChpc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgLy8gSWYgd2UgZm91bmQgYSBHcm91cFYxIGNvbnZlcnNhdGlvbiBmcm9tIHRoaXMgaW5jb21pbmcgR3JvdXBWMiByZWNvcmQsIHdlIG5lZWQgdG9cbiAgICAvLyAgIG1pZ3JhdGUgaXQhXG5cbiAgICAvLyBXZSBkb24ndCBhd2FpdCB0aGlzIGJlY2F1c2UgdGhpcyBjb3VsZCB0YWtlIGEgdmVyeSBsb25nIHRpbWUsIHdhaXRpbmcgZm9yIHF1ZXVlcyB0b1xuICAgIC8vICAgZW1wdHksIGV0Yy5cbiAgICB3YWl0VGhlblJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24oe1xuICAgICAgY29udmVyc2F0aW9uLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKGlzR3JvdXBOZXdUb1VzKSB7XG4gICAgLy8gV2UgZG9uJ3QgbmVlZCB0byB1cGRhdGUgR3JvdXBWMiBncm91cHMgYWxsIHRoZSB0aW1lLiBXZSBmZXRjaCBncm91cCBzdGF0ZSB0aGUgZmlyc3RcbiAgICAvLyAgIHRpbWUgd2UgaGVhciBhYm91dCB0aGVzZSBncm91cHMsIGZyb20gdGhlbiBvbiB3ZSByZWx5IG9uIGluY29taW5nIG1lc3NhZ2VzIG9yXG4gICAgLy8gICB0aGUgdXNlciBvcGVuaW5nIHRoYXQgY29udmVyc2F0aW9uLlxuXG4gICAgLy8gV2UgZG9uJ3QgYXdhaXQgdGhpcyBiZWNhdXNlIHRoaXMgY291bGQgdGFrZSBhIHZlcnkgbG9uZyB0aW1lLCB3YWl0aW5nIGZvciBxdWV1ZXMgdG9cbiAgICAvLyAgIGVtcHR5LCBldGMuXG4gICAgd2FpdFRoZW5NYXliZVVwZGF0ZUdyb3VwKFxuICAgICAge1xuICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UsXG4gICAgICB9LFxuICAgICAgeyB2aWFGaXJzdFN0b3JhZ2VTeW5jOiBpc0ZpcnN0U3luYyB9XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzQ29uZmxpY3QsXG4gICAgY29udmVyc2F0aW9uLFxuICAgIHVwZGF0ZWRDb252ZXJzYXRpb25zOiBbY29udmVyc2F0aW9uXSxcbiAgICBvbGRTdG9yYWdlSUQsXG4gICAgb2xkU3RvcmFnZVZlcnNpb24sXG4gICAgZGV0YWlscyxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1lcmdlQ29udGFjdFJlY29yZChcbiAgc3RvcmFnZUlEOiBzdHJpbmcsXG4gIHN0b3JhZ2VWZXJzaW9uOiBudW1iZXIsXG4gIG9yaWdpbmFsQ29udGFjdFJlY29yZDogUHJvdG8uSUNvbnRhY3RSZWNvcmRcbik6IFByb21pc2U8TWVyZ2VSZXN1bHRUeXBlPiB7XG4gIGNvbnN0IGNvbnRhY3RSZWNvcmQgPSB7XG4gICAgLi4ub3JpZ2luYWxDb250YWN0UmVjb3JkLFxuXG4gICAgc2VydmljZVV1aWQ6IG9yaWdpbmFsQ29udGFjdFJlY29yZC5zZXJ2aWNlVXVpZFxuICAgICAgPyBub3JtYWxpemVVdWlkKFxuICAgICAgICAgIG9yaWdpbmFsQ29udGFjdFJlY29yZC5zZXJ2aWNlVXVpZCxcbiAgICAgICAgICAnQ29udGFjdFJlY29yZC5zZXJ2aWNlVXVpZCdcbiAgICAgICAgKVxuICAgICAgOiB1bmRlZmluZWQsXG4gIH07XG5cbiAgY29uc3QgZTE2NCA9IGRyb3BOdWxsKGNvbnRhY3RSZWNvcmQuc2VydmljZUUxNjQpO1xuICBjb25zdCB1dWlkID0gZHJvcE51bGwoY29udGFjdFJlY29yZC5zZXJ2aWNlVXVpZCk7XG4gIGNvbnN0IHBuaSA9IGRyb3BOdWxsKGNvbnRhY3RSZWNvcmQucG5pKTtcblxuICAvLyBBbGwgY29udGFjdHMgbXVzdCBoYXZlIFVVSURcbiAgaWYgKCF1dWlkKSB7XG4gICAgcmV0dXJuIHsgaGFzQ29uZmxpY3Q6IGZhbHNlLCBzaG91bGREcm9wOiB0cnVlLCBkZXRhaWxzOiBbJ25vIHV1aWQnXSB9O1xuICB9XG5cbiAgaWYgKCFpc1ZhbGlkVXVpZCh1dWlkKSkge1xuICAgIHJldHVybiB7IGhhc0NvbmZsaWN0OiBmYWxzZSwgc2hvdWxkRHJvcDogdHJ1ZSwgZGV0YWlsczogWydpbnZhbGlkIHV1aWQnXSB9O1xuICB9XG5cbiAgaWYgKHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0T3VyVXVpZEtpbmQobmV3IFVVSUQodXVpZCkpICE9PSBVVUlES2luZC5Vbmtub3duKSB7XG4gICAgcmV0dXJuIHsgaGFzQ29uZmxpY3Q6IGZhbHNlLCBzaG91bGREcm9wOiB0cnVlLCBkZXRhaWxzOiBbJ291ciBvd24gdXVpZCddIH07XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgIGFjaTogdXVpZCxcbiAgICBlMTY0LFxuICAgIHBuaSxcbiAgICByZWFzb246ICdtZXJnZUNvbnRhY3RSZWNvcmQnLFxuICB9KTtcblxuICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgTm8gY29udmVyc2F0aW9uIGZvciAke3N0b3JhZ2VJRH1gKTtcbiAgfVxuXG4gIC8vIFdlJ3JlIGdvaW5nIHRvIGlnbm9yZSB0aGlzOyBpdCdzIGxpa2VseSBhIFBOSS1vbmx5IGNvbnRhY3Qgd2UndmUgYWxyZWFkeSBtZXJnZWRcbiAgaWYgKGNvbnZlcnNhdGlvbi5nZXQoJ3V1aWQnKSAhPT0gdXVpZCkge1xuICAgIGxvZy53YXJuKFxuICAgICAgYG1lcmdlQ29udGFjdFJlY29yZDogJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGAgK1xuICAgICAgICBgd2l0aCBzdG9yYWdlSWQgJHtjb252ZXJzYXRpb24uZ2V0KCdzdG9yYWdlSUQnKX0gYCArXG4gICAgICAgIGBoYWQgdXVpZCB0aGF0IGRpZG4ndCBtYXRjaCBwcm92aWRlZCB1dWlkICR7dXVpZH1gXG4gICAgKTtcbiAgICByZXR1cm4ge1xuICAgICAgaGFzQ29uZmxpY3Q6IGZhbHNlLFxuICAgICAgc2hvdWxkRHJvcDogdHJ1ZSxcbiAgICAgIGRldGFpbHM6IFtdLFxuICAgIH07XG4gIH1cblxuICBsZXQgbmVlZHNQcm9maWxlRmV0Y2ggPSBmYWxzZTtcbiAgaWYgKGNvbnRhY3RSZWNvcmQucHJvZmlsZUtleSAmJiBjb250YWN0UmVjb3JkLnByb2ZpbGVLZXkubGVuZ3RoID4gMCkge1xuICAgIG5lZWRzUHJvZmlsZUZldGNoID0gYXdhaXQgY29udmVyc2F0aW9uLnNldFByb2ZpbGVLZXkoXG4gICAgICBCeXRlcy50b0Jhc2U2NChjb250YWN0UmVjb3JkLnByb2ZpbGVLZXkpLFxuICAgICAgeyB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUgfVxuICAgICk7XG4gIH1cblxuICBsZXQgZGV0YWlscyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gIGNvbnN0IHJlbW90ZU5hbWUgPSBkcm9wTnVsbChjb250YWN0UmVjb3JkLmdpdmVuTmFtZSk7XG4gIGNvbnN0IHJlbW90ZUZhbWlseU5hbWUgPSBkcm9wTnVsbChjb250YWN0UmVjb3JkLmZhbWlseU5hbWUpO1xuICBjb25zdCBsb2NhbE5hbWUgPSBjb252ZXJzYXRpb24uZ2V0KCdwcm9maWxlTmFtZScpO1xuICBjb25zdCBsb2NhbEZhbWlseU5hbWUgPSBjb252ZXJzYXRpb24uZ2V0KCdwcm9maWxlRmFtaWx5TmFtZScpO1xuICBpZiAoXG4gICAgcmVtb3RlTmFtZSAmJlxuICAgIChsb2NhbE5hbWUgIT09IHJlbW90ZU5hbWUgfHwgbG9jYWxGYW1pbHlOYW1lICE9PSByZW1vdGVGYW1pbHlOYW1lKVxuICApIHtcbiAgICAvLyBMb2NhbCBuYW1lIGRvZXNuJ3QgbWF0Y2ggcmVtb3RlIG5hbWUsIGZldGNoIHByb2ZpbGVcbiAgICBpZiAobG9jYWxOYW1lKSB7XG4gICAgICBjb252ZXJzYXRpb24uZ2V0UHJvZmlsZXMoKTtcbiAgICAgIGRldGFpbHMucHVzaCgncmVmcmVzaGluZyBwcm9maWxlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnZlcnNhdGlvbi5zZXQoe1xuICAgICAgICBwcm9maWxlTmFtZTogcmVtb3RlTmFtZSxcbiAgICAgICAgcHJvZmlsZUZhbWlseU5hbWU6IHJlbW90ZUZhbWlseU5hbWUsXG4gICAgICB9KTtcbiAgICAgIGRldGFpbHMucHVzaCgndXBkYXRlZCBwcm9maWxlIG5hbWUnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY29udGFjdFJlY29yZC5pZGVudGl0eUtleSkge1xuICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgY29udmVyc2F0aW9uLnNhZmVHZXRWZXJpZmllZCgpO1xuICAgIGNvbnN0IHN0b3JhZ2VTZXJ2aWNlVmVyaWZpZWQgPSBjb250YWN0UmVjb3JkLmlkZW50aXR5U3RhdGUgfHwgMDtcbiAgICBjb25zdCB2ZXJpZmllZE9wdGlvbnMgPSB7XG4gICAgICBrZXk6IGNvbnRhY3RSZWNvcmQuaWRlbnRpdHlLZXksXG4gICAgICB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUsXG4gICAgfTtcbiAgICBjb25zdCBTVEFURV9FTlVNID0gUHJvdG8uQ29udGFjdFJlY29yZC5JZGVudGl0eVN0YXRlO1xuXG4gICAgaWYgKHZlcmlmaWVkICE9PSBzdG9yYWdlU2VydmljZVZlcmlmaWVkKSB7XG4gICAgICBkZXRhaWxzLnB1c2goYHVwZGF0aW5nIHZlcmlmaWVkIHN0YXRlIHRvPSR7dmVyaWZpZWR9YCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHZlcmlmaWVkIHN0YXR1cyB1bmNvbmRpdGlvbmFsbHkgdG8gbWFrZSBzdXJlIHdlIHdpbGwgdGFrZSB0aGVcbiAgICAvLyBsYXRlc3QgaWRlbnRpdHkga2V5IGZyb20gdGhlIG1hbmlmZXN0LlxuICAgIGxldCBrZXlDaGFuZ2U6IGJvb2xlYW47XG4gICAgc3dpdGNoIChzdG9yYWdlU2VydmljZVZlcmlmaWVkKSB7XG4gICAgICBjYXNlIFNUQVRFX0VOVU0uVkVSSUZJRUQ6XG4gICAgICAgIGtleUNoYW5nZSA9IGF3YWl0IGNvbnZlcnNhdGlvbi5zZXRWZXJpZmllZCh2ZXJpZmllZE9wdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1RBVEVfRU5VTS5VTlZFUklGSUVEOlxuICAgICAgICBrZXlDaGFuZ2UgPSBhd2FpdCBjb252ZXJzYXRpb24uc2V0VW52ZXJpZmllZCh2ZXJpZmllZE9wdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGtleUNoYW5nZSA9IGF3YWl0IGNvbnZlcnNhdGlvbi5zZXRWZXJpZmllZERlZmF1bHQodmVyaWZpZWRPcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoa2V5Q2hhbmdlKSB7XG4gICAgICBkZXRhaWxzLnB1c2goJ2tleSBjaGFuZ2VkJyk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlNZXNzYWdlUmVxdWVzdFN0YXRlKGNvbnRhY3RSZWNvcmQsIGNvbnZlcnNhdGlvbik7XG5cbiAgYWRkVW5rbm93bkZpZWxkcyhjb250YWN0UmVjb3JkLCBjb252ZXJzYXRpb24sIGRldGFpbHMpO1xuXG4gIGNvbnN0IG9sZFN0b3JhZ2VJRCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VJRCcpO1xuICBjb25zdCBvbGRTdG9yYWdlVmVyc2lvbiA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VWZXJzaW9uJyk7XG5cbiAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgaGlkZVN0b3J5OiBCb29sZWFuKGNvbnRhY3RSZWNvcmQuaGlkZVN0b3J5KSxcbiAgICBpc0FyY2hpdmVkOiBCb29sZWFuKGNvbnRhY3RSZWNvcmQuYXJjaGl2ZWQpLFxuICAgIG1hcmtlZFVucmVhZDogQm9vbGVhbihjb250YWN0UmVjb3JkLm1hcmtlZFVucmVhZCksXG4gICAgc3RvcmFnZUlELFxuICAgIHN0b3JhZ2VWZXJzaW9uLFxuICB9KTtcblxuICBjb252ZXJzYXRpb24uc2V0TXV0ZUV4cGlyYXRpb24oXG4gICAgZ2V0VGltZXN0YW1wRnJvbUxvbmcoY29udGFjdFJlY29yZC5tdXRlZFVudGlsVGltZXN0YW1wKSxcbiAgICB7XG4gICAgICB2aWFTdG9yYWdlU2VydmljZVN5bmM6IHRydWUsXG4gICAgfVxuICApO1xuXG4gIGNvbnN0IHsgaGFzQ29uZmxpY3QsIGRldGFpbHM6IGV4dHJhRGV0YWlscyB9ID0gZG9lc1JlY29yZEhhdmVQZW5kaW5nQ2hhbmdlcyhcbiAgICBhd2FpdCB0b0NvbnRhY3RSZWNvcmQoY29udmVyc2F0aW9uKSxcbiAgICBjb250YWN0UmVjb3JkLFxuICAgIGNvbnZlcnNhdGlvblxuICApO1xuICBkZXRhaWxzID0gZGV0YWlscy5jb25jYXQoZXh0cmFEZXRhaWxzKTtcblxuICByZXR1cm4ge1xuICAgIGhhc0NvbmZsaWN0LFxuICAgIGNvbnZlcnNhdGlvbixcbiAgICB1cGRhdGVkQ29udmVyc2F0aW9uczogW2NvbnZlcnNhdGlvbl0sXG4gICAgbmVlZHNQcm9maWxlRmV0Y2gsXG4gICAgb2xkU3RvcmFnZUlELFxuICAgIG9sZFN0b3JhZ2VWZXJzaW9uLFxuICAgIGRldGFpbHMsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZXJnZUFjY291bnRSZWNvcmQoXG4gIHN0b3JhZ2VJRDogc3RyaW5nLFxuICBzdG9yYWdlVmVyc2lvbjogbnVtYmVyLFxuICBhY2NvdW50UmVjb3JkOiBQcm90by5JQWNjb3VudFJlY29yZFxuKTogUHJvbWlzZTxNZXJnZVJlc3VsdFR5cGU+IHtcbiAgbGV0IGRldGFpbHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBjb25zdCB7XG4gICAgbGlua1ByZXZpZXdzLFxuICAgIG5vdERpc2NvdmVyYWJsZUJ5UGhvbmVOdW1iZXIsXG4gICAgbm90ZVRvU2VsZkFyY2hpdmVkLFxuICAgIG5vdGVUb1NlbGZNYXJrZWRVbnJlYWQsXG4gICAgcGhvbmVOdW1iZXJTaGFyaW5nTW9kZSxcbiAgICBwaW5uZWRDb252ZXJzYXRpb25zLFxuICAgIHByb2ZpbGVLZXksXG4gICAgcmVhZFJlY2VpcHRzLFxuICAgIHNlYWxlZFNlbmRlckluZGljYXRvcnMsXG4gICAgdHlwaW5nSW5kaWNhdG9ycyxcbiAgICBwcmVmZXJDb250YWN0QXZhdGFycyxcbiAgICBwcmltYXJ5U2VuZHNTbXMsXG4gICAgdW5pdmVyc2FsRXhwaXJlVGltZXIsXG4gICAgZTE2NDogYWNjb3VudEUxNjQsXG4gICAgcHJlZmVycmVkUmVhY3Rpb25FbW9qaTogcmF3UHJlZmVycmVkUmVhY3Rpb25FbW9qaSxcbiAgICBzdWJzY3JpYmVySWQsXG4gICAgc3Vic2NyaWJlckN1cnJlbmN5Q29kZSxcbiAgICBkaXNwbGF5QmFkZ2VzT25Qcm9maWxlLFxuICAgIGtlZXBNdXRlZENoYXRzQXJjaGl2ZWQsXG4gIH0gPSBhY2NvdW50UmVjb3JkO1xuXG4gIGNvbnN0IHVwZGF0ZWRDb252ZXJzYXRpb25zID0gbmV3IEFycmF5PENvbnZlcnNhdGlvbk1vZGVsPigpO1xuXG4gIHdpbmRvdy5zdG9yYWdlLnB1dCgncmVhZC1yZWNlaXB0LXNldHRpbmcnLCBCb29sZWFuKHJlYWRSZWNlaXB0cykpO1xuXG4gIGlmICh0eXBlb2Ygc2VhbGVkU2VuZGVySW5kaWNhdG9ycyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgd2luZG93LnN0b3JhZ2UucHV0KCdzZWFsZWRTZW5kZXJJbmRpY2F0b3JzJywgc2VhbGVkU2VuZGVySW5kaWNhdG9ycyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGluZ0luZGljYXRvcnMgPT09ICdib29sZWFuJykge1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgndHlwaW5nSW5kaWNhdG9ycycsIHR5cGluZ0luZGljYXRvcnMpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBsaW5rUHJldmlld3MgPT09ICdib29sZWFuJykge1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnbGlua1ByZXZpZXdzJywgbGlua1ByZXZpZXdzKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcHJlZmVyQ29udGFjdEF2YXRhcnMgPT09ICdib29sZWFuJykge1xuICAgIGNvbnN0IHByZXZpb3VzID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdwcmVmZXJDb250YWN0QXZhdGFycycpO1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgncHJlZmVyQ29udGFjdEF2YXRhcnMnLCBwcmVmZXJDb250YWN0QXZhdGFycyk7XG5cbiAgICBpZiAoQm9vbGVhbihwcmV2aW91cykgIT09IEJvb2xlYW4ocHJlZmVyQ29udGFjdEF2YXRhcnMpKSB7XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5mb3JjZVJlcmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBwcmltYXJ5U2VuZHNTbXMgPT09ICdib29sZWFuJykge1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgncHJpbWFyeVNlbmRzU21zJywgcHJpbWFyeVNlbmRzU21zKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYWNjb3VudEUxNjQgPT09ICdzdHJpbmcnICYmIGFjY291bnRFMTY0KSB7XG4gICAgd2luZG93LnN0b3JhZ2UucHV0KCdhY2NvdW50RTE2NCcsIGFjY291bnRFMTY0KTtcbiAgICB3aW5kb3cuc3RvcmFnZS51c2VyLnNldE51bWJlcihhY2NvdW50RTE2NCk7XG4gIH1cblxuICBpZiAocHJlZmVycmVkUmVhY3Rpb25FbW9qaS5jYW5CZVN5bmNlZChyYXdQcmVmZXJyZWRSZWFjdGlvbkVtb2ppKSkge1xuICAgIGNvbnN0IGxvY2FsUHJlZmVycmVkUmVhY3Rpb25FbW9qaSA9XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3ByZWZlcnJlZFJlYWN0aW9uRW1vamknKSB8fCBbXTtcbiAgICBpZiAoIWlzRXF1YWwobG9jYWxQcmVmZXJyZWRSZWFjdGlvbkVtb2ppLCByYXdQcmVmZXJyZWRSZWFjdGlvbkVtb2ppKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzdG9yYWdlU2VydmljZTogcmVtb3RlIGFuZCBsb2NhbCBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppIGRvIG5vdCBtYXRjaCcsXG4gICAgICAgIGxvY2FsUHJlZmVycmVkUmVhY3Rpb25FbW9qaS5sZW5ndGgsXG4gICAgICAgIHJhd1ByZWZlcnJlZFJlYWN0aW9uRW1vamkubGVuZ3RoXG4gICAgICApO1xuICAgIH1cbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3ByZWZlcnJlZFJlYWN0aW9uRW1vamknLCByYXdQcmVmZXJyZWRSZWFjdGlvbkVtb2ppKTtcbiAgfVxuXG4gIHNldFVuaXZlcnNhbEV4cGlyZVRpbWVyKHVuaXZlcnNhbEV4cGlyZVRpbWVyIHx8IDApO1xuXG4gIGNvbnN0IFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTSA9XG4gICAgUHJvdG8uQWNjb3VudFJlY29yZC5QaG9uZU51bWJlclNoYXJpbmdNb2RlO1xuICBsZXQgcGhvbmVOdW1iZXJTaGFyaW5nTW9kZVRvU3RvcmU6IFBob25lTnVtYmVyU2hhcmluZ01vZGU7XG4gIHN3aXRjaCAocGhvbmVOdW1iZXJTaGFyaW5nTW9kZSkge1xuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgIGNhc2UgbnVsbDpcbiAgICBjYXNlIFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTS5FVkVSWUJPRFk6XG4gICAgICBwaG9uZU51bWJlclNoYXJpbmdNb2RlVG9TdG9yZSA9IFBob25lTnVtYmVyU2hhcmluZ01vZGUuRXZlcnlib2R5O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBQSE9ORV9OVU1CRVJfU0hBUklOR19NT0RFX0VOVU0uQ09OVEFDVFNfT05MWTpcbiAgICAgIHBob25lTnVtYmVyU2hhcmluZ01vZGVUb1N0b3JlID0gUGhvbmVOdW1iZXJTaGFyaW5nTW9kZS5Db250YWN0c09ubHk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFBIT05FX05VTUJFUl9TSEFSSU5HX01PREVfRU5VTS5OT0JPRFk6XG4gICAgICBwaG9uZU51bWJlclNoYXJpbmdNb2RlVG9TdG9yZSA9IFBob25lTnVtYmVyU2hhcmluZ01vZGUuTm9ib2R5O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGFzc2VydChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS5tZXJnZUFjY291bnRSZWNvcmQ6IEdvdCBhbiB1bmV4cGVjdGVkIHBob25lIG51bWJlciBzaGFyaW5nIG1vZGU6ICR7cGhvbmVOdW1iZXJTaGFyaW5nTW9kZX0uIEZhbGxpbmcgYmFjayB0byBkZWZhdWx0YFxuICAgICAgKTtcbiAgICAgIHBob25lTnVtYmVyU2hhcmluZ01vZGVUb1N0b3JlID0gUGhvbmVOdW1iZXJTaGFyaW5nTW9kZS5FdmVyeWJvZHk7XG4gICAgICBicmVhaztcbiAgfVxuICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3Bob25lTnVtYmVyU2hhcmluZ01vZGUnLCBwaG9uZU51bWJlclNoYXJpbmdNb2RlVG9TdG9yZSk7XG5cbiAgY29uc3QgZGlzY292ZXJhYmlsaXR5ID0gbm90RGlzY292ZXJhYmxlQnlQaG9uZU51bWJlclxuICAgID8gUGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHkuTm90RGlzY292ZXJhYmxlXG4gICAgOiBQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eS5EaXNjb3ZlcmFibGU7XG4gIHdpbmRvdy5zdG9yYWdlLnB1dCgncGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHknLCBkaXNjb3ZlcmFiaWxpdHkpO1xuXG4gIGlmIChwcm9maWxlS2V5KSB7XG4gICAgb3VyUHJvZmlsZUtleVNlcnZpY2Uuc2V0KHByb2ZpbGVLZXkpO1xuICB9XG5cbiAgaWYgKHBpbm5lZENvbnZlcnNhdGlvbnMpIHtcbiAgICBjb25zdCBtb2RlbFBpbm5lZENvbnZlcnNhdGlvbnMgPSB3aW5kb3dcbiAgICAgIC5nZXRDb252ZXJzYXRpb25zKClcbiAgICAgIC5maWx0ZXIoY29udmVyc2F0aW9uID0+IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnaXNQaW5uZWQnKSkpO1xuXG4gICAgY29uc3QgbW9kZWxQaW5uZWRDb252ZXJzYXRpb25JZHMgPSBtb2RlbFBpbm5lZENvbnZlcnNhdGlvbnMubWFwKFxuICAgICAgY29udmVyc2F0aW9uID0+IGNvbnZlcnNhdGlvbi5nZXQoJ2lkJylcbiAgICApO1xuXG4gICAgY29uc3QgbWlzc2luZ1N0b3JhZ2VQaW5uZWRDb252ZXJzYXRpb25JZHMgPSB3aW5kb3cuc3RvcmFnZVxuICAgICAgLmdldCgncGlubmVkQ29udmVyc2F0aW9uSWRzJywgbmV3IEFycmF5PHN0cmluZz4oKSlcbiAgICAgIC5maWx0ZXIoaWQgPT4gIW1vZGVsUGlubmVkQ29udmVyc2F0aW9uSWRzLmluY2x1ZGVzKGlkKSk7XG5cbiAgICBpZiAobWlzc2luZ1N0b3JhZ2VQaW5uZWRDb252ZXJzYXRpb25JZHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgJ21lcmdlQWNjb3VudFJlY29yZDogcGlubmVkQ29udmVyc2F0aW9uSWRzIGluIHN0b3JhZ2UgZG9lcyBub3QgbWF0Y2ggcGlubmVkIENvbnZlcnNhdGlvbiBtb2RlbHMnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsbHlQaW5uZWRDb252ZXJzYXRpb25zID0gbW9kZWxQaW5uZWRDb252ZXJzYXRpb25zLmNvbmNhdChcbiAgICAgIG1pc3NpbmdTdG9yYWdlUGlubmVkQ29udmVyc2F0aW9uSWRzXG4gICAgICAgIC5tYXAoY29udmVyc2F0aW9uSWQgPT5cbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpXG4gICAgICAgIClcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoY29udmVyc2F0aW9uKTogY29udmVyc2F0aW9uIGlzIENvbnZlcnNhdGlvbk1vZGVsID0+XG4gICAgICAgICAgICBjb252ZXJzYXRpb24gIT09IHVuZGVmaW5lZFxuICAgICAgICApXG4gICAgKTtcblxuICAgIGRldGFpbHMucHVzaChcbiAgICAgIGBsb2NhbCBwaW5uZWQ9JHtsb2NhbGx5UGlubmVkQ29udmVyc2F0aW9ucy5sZW5ndGh9YCxcbiAgICAgIGByZW1vdGUgcGlubmVkPSR7cGlubmVkQ29udmVyc2F0aW9ucy5sZW5ndGh9YFxuICAgICk7XG5cbiAgICBjb25zdCByZW1vdGVseVBpbm5lZENvbnZlcnNhdGlvblByb21pc2VzID0gcGlubmVkQ29udmVyc2F0aW9ucy5tYXAoXG4gICAgICBhc3luYyAoeyBjb250YWN0LCBsZWdhY3lHcm91cElkLCBncm91cE1hc3RlcktleSB9KSA9PiB7XG4gICAgICAgIGxldCBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChjb250YWN0KSB7XG4gICAgICAgICAgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoY29udGFjdCk7XG4gICAgICAgIH0gZWxzZSBpZiAobGVnYWN5R3JvdXBJZCAmJiBsZWdhY3lHcm91cElkLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGdyb3VwSWQgPSBCeXRlcy50b0JpbmFyeShsZWdhY3lHcm91cElkKTtcbiAgICAgICAgICBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZ3JvdXBJZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBNYXN0ZXJLZXkgJiYgZ3JvdXBNYXN0ZXJLZXkubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXBGaWVsZHMgPSBkZXJpdmVHcm91cEZpZWxkcyhncm91cE1hc3RlcktleSk7XG4gICAgICAgICAgY29uc3QgZ3JvdXBJZCA9IEJ5dGVzLnRvQmFzZTY0KGdyb3VwRmllbGRzLmlkKTtcblxuICAgICAgICAgIGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChncm91cElkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnc3RvcmFnZVNlcnZpY2UubWVyZ2VBY2NvdW50UmVjb3JkOiBJbnZhbGlkIGlkZW50aWZpZXIgcmVjZWl2ZWQnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgJ3N0b3JhZ2VTZXJ2aWNlLm1lcmdlQWNjb3VudFJlY29yZDogbWlzc2luZyBjb252ZXJzYXRpb24gaWQuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHJlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9ucyA9IChcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9uUHJvbWlzZXMpXG4gICAgKS5maWx0ZXIoXG4gICAgICAoY29udmVyc2F0aW9uKTogY29udmVyc2F0aW9uIGlzIENvbnZlcnNhdGlvbk1vZGVsID0+XG4gICAgICAgIGNvbnZlcnNhdGlvbiAhPT0gdW5kZWZpbmVkXG4gICAgKTtcblxuICAgIGNvbnN0IHJlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9uSWRzID0gcmVtb3RlbHlQaW5uZWRDb252ZXJzYXRpb25zLm1hcChcbiAgICAgICh7IGlkIH0pID0+IGlkXG4gICAgKTtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbnNUb1VucGluID0gbG9jYWxseVBpbm5lZENvbnZlcnNhdGlvbnMuZmlsdGVyKFxuICAgICAgKHsgaWQgfSkgPT4gIXJlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9uSWRzLmluY2x1ZGVzKGlkKVxuICAgICk7XG5cbiAgICBkZXRhaWxzLnB1c2goXG4gICAgICBgdW5waW5uaW5nPSR7Y29udmVyc2F0aW9uc1RvVW5waW4ubGVuZ3RofWAsXG4gICAgICBgcGlubmluZz0ke3JlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9ucy5sZW5ndGh9YFxuICAgICk7XG5cbiAgICBjb252ZXJzYXRpb25zVG9VbnBpbi5mb3JFYWNoKGNvbnZlcnNhdGlvbiA9PiB7XG4gICAgICBjb252ZXJzYXRpb24uc2V0KHsgaXNQaW5uZWQ6IGZhbHNlIH0pO1xuICAgICAgdXBkYXRlZENvbnZlcnNhdGlvbnMucHVzaChjb252ZXJzYXRpb24pO1xuICAgIH0pO1xuXG4gICAgcmVtb3RlbHlQaW5uZWRDb252ZXJzYXRpb25zLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgIGNvbnZlcnNhdGlvbi5zZXQoeyBpc1Bpbm5lZDogdHJ1ZSwgaXNBcmNoaXZlZDogZmFsc2UgfSk7XG4gICAgICB1cGRhdGVkQ29udmVyc2F0aW9ucy5wdXNoKGNvbnZlcnNhdGlvbik7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3Bpbm5lZENvbnZlcnNhdGlvbklkcycsIHJlbW90ZWx5UGlubmVkQ29udmVyc2F0aW9uSWRzKTtcbiAgfVxuXG4gIGlmIChzdWJzY3JpYmVySWQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgd2luZG93LnN0b3JhZ2UucHV0KCdzdWJzY3JpYmVySWQnLCBzdWJzY3JpYmVySWQpO1xuICB9XG4gIGlmICh0eXBlb2Ygc3Vic2NyaWJlckN1cnJlbmN5Q29kZSA9PT0gJ3N0cmluZycpIHtcbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3N1YnNjcmliZXJDdXJyZW5jeUNvZGUnLCBzdWJzY3JpYmVyQ3VycmVuY3lDb2RlKTtcbiAgfVxuICB3aW5kb3cuc3RvcmFnZS5wdXQoJ2Rpc3BsYXlCYWRnZXNPblByb2ZpbGUnLCBCb29sZWFuKGRpc3BsYXlCYWRnZXNPblByb2ZpbGUpKTtcbiAgd2luZG93LnN0b3JhZ2UucHV0KCdrZWVwTXV0ZWRDaGF0c0FyY2hpdmVkJywgQm9vbGVhbihrZWVwTXV0ZWRDaGF0c0FyY2hpdmVkKSk7XG5cbiAgY29uc3Qgb3VySUQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZCgpO1xuXG4gIGlmICghb3VySUQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIG91cklEJyk7XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZUFuZFdhaXQoXG4gICAgb3VySUQsXG4gICAgJ3ByaXZhdGUnXG4gICk7XG5cbiAgYWRkVW5rbm93bkZpZWxkcyhhY2NvdW50UmVjb3JkLCBjb252ZXJzYXRpb24sIGRldGFpbHMpO1xuXG4gIGNvbnN0IG9sZFN0b3JhZ2VJRCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VJRCcpO1xuICBjb25zdCBvbGRTdG9yYWdlVmVyc2lvbiA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VWZXJzaW9uJyk7XG5cbiAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgaXNBcmNoaXZlZDogQm9vbGVhbihub3RlVG9TZWxmQXJjaGl2ZWQpLFxuICAgIG1hcmtlZFVucmVhZDogQm9vbGVhbihub3RlVG9TZWxmTWFya2VkVW5yZWFkKSxcbiAgICBzdG9yYWdlSUQsXG4gICAgc3RvcmFnZVZlcnNpb24sXG4gIH0pO1xuXG4gIGxldCBuZWVkc1Byb2ZpbGVGZXRjaCA9IGZhbHNlO1xuICBpZiAocHJvZmlsZUtleSAmJiBwcm9maWxlS2V5Lmxlbmd0aCA+IDApIHtcbiAgICBuZWVkc1Byb2ZpbGVGZXRjaCA9IGF3YWl0IGNvbnZlcnNhdGlvbi5zZXRQcm9maWxlS2V5KFxuICAgICAgQnl0ZXMudG9CYXNlNjQocHJvZmlsZUtleSksXG4gICAgICB7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYzogdHJ1ZSB9XG4gICAgKTtcblxuICAgIGNvbnN0IGF2YXRhclVybCA9IGRyb3BOdWxsKGFjY291bnRSZWNvcmQuYXZhdGFyVXJsKTtcbiAgICBhd2FpdCBjb252ZXJzYXRpb24uc2V0UHJvZmlsZUF2YXRhcihhdmF0YXJVcmwsIHByb2ZpbGVLZXkpO1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnYXZhdGFyVXJsJywgYXZhdGFyVXJsKTtcbiAgfVxuXG4gIGNvbnN0IHsgaGFzQ29uZmxpY3QsIGRldGFpbHM6IGV4dHJhRGV0YWlscyB9ID0gZG9lc1JlY29yZEhhdmVQZW5kaW5nQ2hhbmdlcyhcbiAgICB0b0FjY291bnRSZWNvcmQoY29udmVyc2F0aW9uKSxcbiAgICBhY2NvdW50UmVjb3JkLFxuICAgIGNvbnZlcnNhdGlvblxuICApO1xuXG4gIHVwZGF0ZWRDb252ZXJzYXRpb25zLnB1c2goY29udmVyc2F0aW9uKTtcblxuICBkZXRhaWxzID0gZGV0YWlscy5jb25jYXQoZXh0cmFEZXRhaWxzKTtcblxuICByZXR1cm4ge1xuICAgIGhhc0NvbmZsaWN0LFxuICAgIGNvbnZlcnNhdGlvbixcbiAgICB1cGRhdGVkQ29udmVyc2F0aW9ucyxcbiAgICBuZWVkc1Byb2ZpbGVGZXRjaCxcbiAgICBvbGRTdG9yYWdlSUQsXG4gICAgb2xkU3RvcmFnZVZlcnNpb24sXG4gICAgZGV0YWlscyxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1lcmdlU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkKFxuICBzdG9yYWdlSUQ6IHN0cmluZyxcbiAgc3RvcmFnZVZlcnNpb246IG51bWJlcixcbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkOiBQcm90by5JU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkXG4pOiBQcm9taXNlPE1lcmdlUmVzdWx0VHlwZT4ge1xuICBpZiAoIXN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZC5pZGVudGlmaWVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdG9yeURpc3RyaWJ1dGlvbkxpc3QgaWRlbnRpZmllciBmb3IgJHtzdG9yYWdlSUR9YCk7XG4gIH1cblxuICBjb25zdCBkZXRhaWxzOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgY29uc3QgbGlzdElkID0gQnl0ZXMuYXJlRXF1YWwoXG4gICAgTVlfU1RPUklFU19CWVRFUyxcbiAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuaWRlbnRpZmllclxuICApXG4gICAgPyBNWV9TVE9SSUVTX0lEXG4gICAgOiBieXRlc1RvVXVpZChzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuaWRlbnRpZmllcik7XG5cbiAgaWYgKCFsaXN0SWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBkaXN0cmlidXRpb24gbGlzdCBpZCcpO1xuICB9XG5cbiAgY29uc3QgbG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3QgPVxuICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UuZ2V0U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhsaXN0SWQpO1xuXG4gIGNvbnN0IHJlbW90ZUxpc3RNZW1iZXJzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT4gPSAoXG4gICAgc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLnJlY2lwaWVudFV1aWRzIHx8IFtdXG4gICkubWFwKFVVSUQuY2FzdCk7XG5cbiAgaWYgKHN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZC5fX3Vua25vd25GaWVsZHMpIHtcbiAgICBkZXRhaWxzLnB1c2goJ2FkZGluZyB1bmtub3duIGZpZWxkcycpO1xuICB9XG5cbiAgY29uc3Qgc3RvcnlEaXN0cmlidXRpb246IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlID0ge1xuICAgIGlkOiBsaXN0SWQsXG4gICAgbmFtZTogU3RyaW5nKHN0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZC5uYW1lKSxcbiAgICBkZWxldGVkQXRUaW1lc3RhbXA6IGdldFRpbWVzdGFtcEZyb21Mb25nKFxuICAgICAgc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLmRlbGV0ZWRBdFRpbWVzdGFtcFxuICAgICksXG4gICAgYWxsb3dzUmVwbGllczogQm9vbGVhbihzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuYWxsb3dzUmVwbGllcyksXG4gICAgaXNCbG9ja0xpc3Q6IEJvb2xlYW4oc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLmlzQmxvY2tMaXN0KSxcbiAgICBtZW1iZXJzOiByZW1vdGVMaXN0TWVtYmVycyxcbiAgICBzZW5kZXJLZXlJbmZvOiBsb2NhbFN0b3J5RGlzdHJpYnV0aW9uTGlzdD8uc2VuZGVyS2V5SW5mbyxcblxuICAgIHN0b3JhZ2VJRCxcbiAgICBzdG9yYWdlVmVyc2lvbixcbiAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogc3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLl9fdW5rbm93bkZpZWxkc1xuICAgICAgPyBCeXRlcy5jb25jYXRlbmF0ZShzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuX191bmtub3duRmllbGRzKVxuICAgICAgOiBudWxsLFxuICAgIHN0b3JhZ2VOZWVkc1N5bmM6IEJvb2xlYW4obG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3Q/LnN0b3JhZ2VOZWVkc1N5bmMpLFxuICB9O1xuXG4gIGlmICghbG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3QpIHtcbiAgICBhd2FpdCBkYXRhSW50ZXJmYWNlLmNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uKHN0b3J5RGlzdHJpYnV0aW9uKTtcblxuICAgIGNvbnN0IHNob3VsZFNhdmUgPSBmYWxzZTtcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLnN0b3J5RGlzdHJpYnV0aW9uTGlzdHMuY3JlYXRlRGlzdHJpYnV0aW9uTGlzdChcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uLm5hbWUsXG4gICAgICByZW1vdGVMaXN0TWVtYmVycyxcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uLFxuICAgICAgc2hvdWxkU2F2ZVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGV0YWlscyxcbiAgICAgIGhhc0NvbmZsaWN0OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3Qgb2xkU3RvcmFnZUlEID0gbG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3Quc3RvcmFnZUlEO1xuICBjb25zdCBvbGRTdG9yYWdlVmVyc2lvbiA9IGxvY2FsU3RvcnlEaXN0cmlidXRpb25MaXN0LnN0b3JhZ2VWZXJzaW9uO1xuXG4gIGNvbnN0IG5lZWRzVG9DbGVhclVua25vd25GaWVsZHMgPVxuICAgICFzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQuX191bmtub3duRmllbGRzICYmXG4gICAgbG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3Quc3RvcmFnZVVua25vd25GaWVsZHM7XG5cbiAgaWYgKG5lZWRzVG9DbGVhclVua25vd25GaWVsZHMpIHtcbiAgICBkZXRhaWxzLnB1c2goJ2NsZWFyaW5nIHVua25vd24gZmllbGRzJyk7XG4gIH1cblxuICBjb25zdCB7IGhhc0NvbmZsaWN0LCBkZXRhaWxzOiBjb25mbGljdERldGFpbHMgfSA9IGRvUmVjb3Jkc0NvbmZsaWN0KFxuICAgIHRvU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkKHN0b3J5RGlzdHJpYnV0aW9uKSxcbiAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RSZWNvcmRcbiAgKTtcblxuICBjb25zdCBsb2NhbE1lbWJlcnNMaXN0U2V0ID0gbmV3IFNldChsb2NhbFN0b3J5RGlzdHJpYnV0aW9uTGlzdC5tZW1iZXJzKTtcbiAgY29uc3QgdG9BZGQ6IEFycmF5PFVVSURTdHJpbmdUeXBlPiA9IHJlbW90ZUxpc3RNZW1iZXJzLmZpbHRlcihcbiAgICB1dWlkID0+ICFsb2NhbE1lbWJlcnNMaXN0U2V0Lmhhcyh1dWlkKVxuICApO1xuXG4gIGNvbnN0IHJlbW90ZU1lbWJlckxpc3RTZXQgPSBuZXcgU2V0KHJlbW90ZUxpc3RNZW1iZXJzKTtcbiAgY29uc3QgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPiA9XG4gICAgbG9jYWxTdG9yeURpc3RyaWJ1dGlvbkxpc3QubWVtYmVycy5maWx0ZXIoXG4gICAgICB1dWlkID0+ICFyZW1vdGVNZW1iZXJMaXN0U2V0Lmhhcyh1dWlkKVxuICAgICk7XG5cbiAgY29uc3QgbmVlZHNVcGRhdGUgPSBCb29sZWFuKFxuICAgIG5lZWRzVG9DbGVhclVua25vd25GaWVsZHMgfHwgaGFzQ29uZmxpY3QgfHwgdG9BZGQubGVuZ3RoIHx8IHRvUmVtb3ZlLmxlbmd0aFxuICApO1xuXG4gIGlmICghbmVlZHNVcGRhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGV0YWlsczogWy4uLmRldGFpbHMsIC4uLmNvbmZsaWN0RGV0YWlsc10sXG4gICAgICBoYXNDb25mbGljdCxcbiAgICAgIG9sZFN0b3JhZ2VJRCxcbiAgICAgIG9sZFN0b3JhZ2VWZXJzaW9uLFxuICAgIH07XG4gIH1cblxuICBpZiAobmVlZHNVcGRhdGUpIHtcbiAgICBhd2FpdCBkYXRhSW50ZXJmYWNlLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoc3RvcnlEaXN0cmlidXRpb24sIHtcbiAgICAgIHRvQWRkLFxuICAgICAgdG9SZW1vdmUsXG4gICAgfSk7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5zdG9yeURpc3RyaWJ1dGlvbkxpc3RzLm1vZGlmeURpc3RyaWJ1dGlvbkxpc3Qoe1xuICAgICAgYWxsb3dzUmVwbGllczogQm9vbGVhbihzdG9yeURpc3RyaWJ1dGlvbi5hbGxvd3NSZXBsaWVzKSxcbiAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogc3RvcnlEaXN0cmlidXRpb24uZGVsZXRlZEF0VGltZXN0YW1wLFxuICAgICAgaWQ6IHN0b3J5RGlzdHJpYnV0aW9uLmlkLFxuICAgICAgaXNCbG9ja0xpc3Q6IEJvb2xlYW4oc3RvcnlEaXN0cmlidXRpb24uaXNCbG9ja0xpc3QpLFxuICAgICAgbWVtYmVyc1RvQWRkOiB0b0FkZCxcbiAgICAgIG1lbWJlcnNUb1JlbW92ZTogdG9SZW1vdmUsXG4gICAgICBuYW1lOiBzdG9yeURpc3RyaWJ1dGlvbi5uYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZXRhaWxzOiBbLi4uZGV0YWlscywgLi4uY29uZmxpY3REZXRhaWxzXSxcbiAgICBoYXNDb25mbGljdCxcbiAgICBvbGRTdG9yYWdlSUQsXG4gICAgb2xkU3RvcmFnZVZlcnNpb24sXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZXJnZVN0aWNrZXJQYWNrUmVjb3JkKFxuICBzdG9yYWdlSUQ6IHN0cmluZyxcbiAgc3RvcmFnZVZlcnNpb246IG51bWJlcixcbiAgc3RpY2tlclBhY2tSZWNvcmQ6IFByb3RvLklTdGlja2VyUGFja1JlY29yZFxuKTogUHJvbWlzZTxNZXJnZVJlc3VsdFR5cGU+IHtcbiAgaWYgKCFzdGlja2VyUGFja1JlY29yZC5wYWNrSWQgfHwgQnl0ZXMuaXNFbXB0eShzdGlja2VyUGFja1JlY29yZC5wYWNrSWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdGlja2VyUGFja1JlY29yZCBpZGVudGlmaWVyIGZvciAke3N0b3JhZ2VJRH1gKTtcbiAgfVxuXG4gIGNvbnN0IGRldGFpbHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgY29uc3QgaWQgPSBCeXRlcy50b0hleChzdGlja2VyUGFja1JlY29yZC5wYWNrSWQpO1xuXG4gIGNvbnN0IGxvY2FsU3RpY2tlclBhY2sgPSBhd2FpdCBkYXRhSW50ZXJmYWNlLmdldFN0aWNrZXJQYWNrSW5mbyhpZCk7XG5cbiAgaWYgKHN0aWNrZXJQYWNrUmVjb3JkLl9fdW5rbm93bkZpZWxkcykge1xuICAgIGRldGFpbHMucHVzaCgnYWRkaW5nIHVua25vd24gZmllbGRzJyk7XG4gIH1cbiAgY29uc3Qgc3RvcmFnZVVua25vd25GaWVsZHMgPSBzdGlja2VyUGFja1JlY29yZC5fX3Vua25vd25GaWVsZHNcbiAgICA/IEJ5dGVzLmNvbmNhdGVuYXRlKHN0aWNrZXJQYWNrUmVjb3JkLl9fdW5rbm93bkZpZWxkcylcbiAgICA6IG51bGw7XG5cbiAgbGV0IHN0aWNrZXJQYWNrOiBTdGlja2VyUGFja0luZm9UeXBlO1xuICBpZiAoc3RpY2tlclBhY2tSZWNvcmQuZGVsZXRlZEF0VGltZXN0YW1wPy50b051bWJlcigpKSB7XG4gICAgc3RpY2tlclBhY2sgPSB7XG4gICAgICBpZCxcbiAgICAgIHVuaW5zdGFsbGVkQXQ6IHN0aWNrZXJQYWNrUmVjb3JkLmRlbGV0ZWRBdFRpbWVzdGFtcC50b051bWJlcigpLFxuICAgICAgc3RvcmFnZUlELFxuICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGZhbHNlLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKFxuICAgICAgIXN0aWNrZXJQYWNrUmVjb3JkLnBhY2tLZXkgfHxcbiAgICAgIEJ5dGVzLmlzRW1wdHkoc3RpY2tlclBhY2tSZWNvcmQucGFja0tleSlcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3RpY2tlclBhY2tSZWNvcmQga2V5IGZvciAke3N0b3JhZ2VJRH1gKTtcbiAgICB9XG5cbiAgICBzdGlja2VyUGFjayA9IHtcbiAgICAgIGlkLFxuICAgICAga2V5OiBCeXRlcy50b0Jhc2U2NChzdGlja2VyUGFja1JlY29yZC5wYWNrS2V5KSxcbiAgICAgIHBvc2l0aW9uOlxuICAgICAgICAncG9zaXRpb24nIGluIHN0aWNrZXJQYWNrUmVjb3JkXG4gICAgICAgICAgPyBzdGlja2VyUGFja1JlY29yZC5wb3NpdGlvblxuICAgICAgICAgIDogbG9jYWxTdGlja2VyUGFjaz8ucG9zaXRpb24gPz8gdW5kZWZpbmVkLFxuICAgICAgc3RvcmFnZUlELFxuICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBvbGRTdG9yYWdlSUQgPSBsb2NhbFN0aWNrZXJQYWNrPy5zdG9yYWdlSUQ7XG4gIGNvbnN0IG9sZFN0b3JhZ2VWZXJzaW9uID0gbG9jYWxTdGlja2VyUGFjaz8uc3RvcmFnZVZlcnNpb247XG5cbiAgY29uc3QgbmVlZHNUb0NsZWFyVW5rbm93bkZpZWxkcyA9XG4gICAgIXN0aWNrZXJQYWNrLnN0b3JhZ2VVbmtub3duRmllbGRzICYmIGxvY2FsU3RpY2tlclBhY2s/LnN0b3JhZ2VVbmtub3duRmllbGRzO1xuXG4gIGlmIChuZWVkc1RvQ2xlYXJVbmtub3duRmllbGRzKSB7XG4gICAgZGV0YWlscy5wdXNoKCdjbGVhcmluZyB1bmtub3duIGZpZWxkcycpO1xuICB9XG5cbiAgY29uc3QgeyBoYXNDb25mbGljdCwgZGV0YWlsczogY29uZmxpY3REZXRhaWxzIH0gPSBkb1JlY29yZHNDb25mbGljdChcbiAgICB0b1N0aWNrZXJQYWNrUmVjb3JkKHN0aWNrZXJQYWNrKSxcbiAgICBzdGlja2VyUGFja1JlY29yZFxuICApO1xuXG4gIGNvbnN0IHdhc1VuaW5zdGFsbGVkID0gQm9vbGVhbihsb2NhbFN0aWNrZXJQYWNrPy51bmluc3RhbGxlZEF0KTtcbiAgY29uc3QgaXNVbmluc3RhbGxlZCA9IEJvb2xlYW4oc3RpY2tlclBhY2sudW5pbnN0YWxsZWRBdCk7XG5cbiAgZGV0YWlscy5wdXNoKFxuICAgIGB3YXNVbmluc3RhbGxlZD0ke3dhc1VuaW5zdGFsbGVkfWAsXG4gICAgYGlzVW5pbnN0YWxsZWQ9JHtpc1VuaW5zdGFsbGVkfWAsXG4gICAgYG9sZFBvc2l0aW9uPSR7bG9jYWxTdGlja2VyUGFjaz8ucG9zaXRpb24gPz8gJz8nfWAsXG4gICAgYG5ld1Bvc2l0aW9uPSR7c3RpY2tlclBhY2sucG9zaXRpb24gPz8gJz8nfWBcbiAgKTtcblxuICBpZiAoKCFsb2NhbFN0aWNrZXJQYWNrIHx8ICF3YXNVbmluc3RhbGxlZCkgJiYgaXNVbmluc3RhbGxlZCkge1xuICAgIGFzc2VydChsb2NhbFN0aWNrZXJQYWNrPy5rZXksICdJbnN0YWxsZWQgc3RpY2tlciBwYWNrIGhhcyBubyBrZXknKTtcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLnN0aWNrZXJzLnVuaW5zdGFsbFN0aWNrZXJQYWNrKFxuICAgICAgbG9jYWxTdGlja2VyUGFjay5pZCxcbiAgICAgIGxvY2FsU3RpY2tlclBhY2sua2V5LFxuICAgICAgeyBmcm9tU3RvcmFnZVNlcnZpY2U6IHRydWUgfVxuICAgICk7XG4gIH0gZWxzZSBpZiAoKCFsb2NhbFN0aWNrZXJQYWNrIHx8IHdhc1VuaW5zdGFsbGVkKSAmJiAhaXNVbmluc3RhbGxlZCkge1xuICAgIGFzc2VydChzdGlja2VyUGFjay5rZXksICdTdGlja2VyIHBhY2sgZG9lcyBub3QgaGF2ZSBrZXknKTtcblxuICAgIGNvbnN0IHN0YXR1cyA9IFN0aWNrZXJzLmdldFN0aWNrZXJQYWNrU3RhdHVzKHN0aWNrZXJQYWNrLmlkKTtcbiAgICBpZiAoc3RhdHVzID09PSAnZG93bmxvYWRlZCcpIHtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuc3RpY2tlcnMuaW5zdGFsbFN0aWNrZXJQYWNrKFxuICAgICAgICBzdGlja2VyUGFjay5pZCxcbiAgICAgICAgc3RpY2tlclBhY2sua2V5LFxuICAgICAgICB7XG4gICAgICAgICAgZnJvbVN0b3JhZ2VTZXJ2aWNlOiB0cnVlLFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBTdGlja2Vycy5kb3dubG9hZFN0aWNrZXJQYWNrKHN0aWNrZXJQYWNrLmlkLCBzdGlja2VyUGFjay5rZXksIHtcbiAgICAgICAgZmluYWxTdGF0dXM6ICdpbnN0YWxsZWQnLFxuICAgICAgICBmcm9tU3RvcmFnZVNlcnZpY2U6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkYXRhSW50ZXJmYWNlLnVwZGF0ZVN0aWNrZXJQYWNrSW5mbyhzdGlja2VyUGFjayk7XG5cbiAgcmV0dXJuIHtcbiAgICBkZXRhaWxzOiBbLi4uZGV0YWlscywgLi4uY29uZmxpY3REZXRhaWxzXSxcbiAgICBoYXNDb25mbGljdCxcbiAgICBvbGRTdG9yYWdlSUQsXG4gICAgb2xkU3RvcmFnZVZlcnNpb24sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7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
