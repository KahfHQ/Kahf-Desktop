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
var conversations_exports = {};
__export(conversations_exports, {
  ConversationModel: () => ConversationModel
});
module.exports = __toCommonJS(conversations_exports);
var import_lodash = require("lodash");
var import_react_redux = require("react-redux");
var import_uuid = require("uuid");
var import_getInitials = require("../util/getInitials");
var import_normalizeUuid = require("../util/normalizeUuid");
var import_libphonenumberUtil = require("../util/libphonenumberUtil");
var import_clearTimeoutIfNecessary = require("../util/clearTimeoutIfNecessary");
var import_timestamp = require("../util/timestamp");
var import_Attachment = require("../types/Attachment");
var import_Calling = require("../types/Calling");
var EmbeddedContact = __toESM(require("../types/EmbeddedContact"));
var Conversation = __toESM(require("../types/Conversation"));
var Stickers = __toESM(require("../types/Stickers"));
var import_TaskWithTimeout = __toESM(require("../textsecure/TaskWithTimeout"));
var import_SendMessage = __toESM(require("../textsecure/SendMessage"));
var import_helpers = require("../messages/helpers");
var import_assert = require("../util/assert");
var import_isConversationMuted = require("../util/isConversationMuted");
var import_isConversationSMSOnly = require("../util/isConversationSMSOnly");
var import_isConversationUnregistered = require("../util/isConversationUnregistered");
var import_missingCaseError = require("../util/missingCaseError");
var import_sniffImageMimeType = require("../util/sniffImageMimeType");
var import_isValidE164 = require("../util/isValidE164");
var import_MIME = require("../types/MIME");
var import_UUID = require("../types/UUID");
var import_Crypto = require("../Crypto");
var Bytes = __toESM(require("../Bytes"));
var import_getTextWithMentions = require("../util/getTextWithMentions");
var import_migrateColor = require("../util/migrateColor");
var import_isNotNil = require("../util/isNotNil");
var import_dropNull = require("../util/dropNull");
var import_notifications = require("../services/notifications");
var import_getSendOptions = require("../util/getSendOptions");
var import_isConversationAccepted = require("../util/isConversationAccepted");
var import_markConversationRead = require("../util/markConversationRead");
var import_handleMessageSend = require("../util/handleMessageSend");
var import_getConversationMembers = require("../util/getConversationMembers");
var import_updateConversationsWithUuidLookup = require("../updateConversationsWithUuidLookup");
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_MessageSendState = require("../messages/MessageSendState");
var durations = __toESM(require("../util/durations"));
var import_iterables = require("../util/iterables");
var universalExpireTimer = __toESM(require("../util/universalExpireTimer"));
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_protobuf = require("../protobuf");
var import_message = require("../state/selectors/message");
var import_conversationJobQueue = require("../jobs/conversationJobQueue");
var import_readReceiptsJobQueue = require("../jobs/readReceiptsJobQueue");
var import_isAnnouncementGroupReady = require("../util/isAnnouncementGroupReady");
var import_getProfile = require("../util/getProfile");
var import_SealedSender = require("../types/SealedSender");
var import_getAvatarData = require("../util/getAvatarData");
var import_createIdenticon = require("../util/createIdenticon");
var log = __toESM(require("../logging/log"));
var Errors = __toESM(require("../types/errors"));
var import_isMessageUnread = require("../util/isMessageUnread");
var import_singleProtoJobQueue = require("../jobs/singleProtoJobQueue");
var import_timelineUtil = require("../util/timelineUtil");
var import_MessageSeenStatus = require("../MessageSeenStatus");
var import_idForLogging = require("../util/idForLogging");
var import_getSendTarget = require("../util/getSendTarget");
var import_getRecipients = require("../util/getRecipients");
var import_validateConversation = require("../util/validateConversation");
window.Whisper = window.Whisper || {};
const { Services, Util } = window.Signal;
const { Message } = window.Signal.Types;
const {
  deleteAttachmentData,
  doesAttachmentExist,
  getAbsoluteAttachmentPath,
  loadAttachmentData,
  readStickerData,
  upgradeMessageSchema,
  writeNewAttachmentData
} = window.Signal.Migrations;
const {
  addStickerPackReference,
  getConversationRangeCenteredOnMessage,
  getOlderMessagesByConversation,
  getMessageMetricsForConversation,
  getMessageById,
  getNewerMessagesByConversation
} = window.Signal.Data;
const FIVE_MINUTES = durations.MINUTE * 5;
const JOB_REPORTING_THRESHOLD_MS = 25;
const SEND_REPORTING_THRESHOLD_MS = 25;
const MESSAGE_LOAD_CHUNK_SIZE = 30;
const ATTRIBUTES_THAT_DONT_INVALIDATE_PROPS_CACHE = /* @__PURE__ */ new Set([
  "lastProfile",
  "profileLastFetchedAt",
  "needsStorageServiceSync",
  "storageID",
  "storageVersion",
  "storageUnknownFields"
]);
class ConversationModel extends window.Backbone.Model {
  constructor() {
    super(...arguments);
    this.intlCollator = new Intl.Collator(void 0, { sensitivity: "base" });
    this.isInReduxBatch = false;
  }
  defaults() {
    return {
      unreadCount: 0,
      verified: window.textsecure.storage.protocol.VerifiedStatus.DEFAULT,
      messageCount: 0,
      sentMessageCount: 0
    };
  }
  idForLogging() {
    return (0, import_idForLogging.getConversationIdForLogging)(this.attributes);
  }
  getSendTarget() {
    return (0, import_getSendTarget.getSendTarget)(this.attributes);
  }
  getContactCollection() {
    const collection = new window.Backbone.Collection();
    const collator = new Intl.Collator(void 0, { sensitivity: "base" });
    collection.comparator = (left, right) => {
      return collator.compare(left.getTitle(), right.getTitle());
    };
    return collection;
  }
  initialize(attributes = {}) {
    const uuid = this.get("uuid");
    const normalizedUuid = uuid && (0, import_normalizeUuid.normalizeUuid)(uuid, "ConversationModel.initialize");
    if (uuid && normalizedUuid !== uuid) {
      log.warn(`ConversationModel.initialize: normalizing uuid from ${uuid} to ${normalizedUuid}`);
      this.set("uuid", normalizedUuid);
    }
    if ((0, import_isValidE164.isValidE164)(attributes.id, false)) {
      this.set({ id: import_UUID.UUID.generate().toString(), e164: attributes.id });
    }
    this.storeName = "conversations";
    this.verifiedEnum = window.textsecure.storage.protocol.VerifiedStatus;
    this.initialPromise = Promise.resolve();
    this.throttledBumpTyping = (0, import_lodash.throttle)(this.bumpTyping, 300);
    this.debouncedUpdateLastMessage = (0, import_lodash.debounce)(this.updateLastMessage.bind(this), 200);
    this.throttledUpdateSharedGroups = this.throttledUpdateSharedGroups || (0, import_lodash.throttle)(this.updateSharedGroups.bind(this), FIVE_MINUTES);
    this.contactCollection = this.getContactCollection();
    this.contactCollection.on("change:name change:profileName change:profileFamilyName change:e164", this.debouncedUpdateLastMessage, this);
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      this.contactCollection.on("change:verified", this.onMemberVerifiedChange.bind(this));
    }
    this.on("newmessage", this.onNewMessage);
    this.on("change:profileKey", this.onChangeProfileKey);
    const sealedSender = this.get("sealedSender");
    if (sealedSender === void 0) {
      this.set({ sealedSender: import_SealedSender.SEALED_SENDER.UNKNOWN });
    }
    this.unset("unidentifiedDelivery");
    this.unset("unidentifiedDeliveryUnrestricted");
    this.unset("hasFetchedProfile");
    this.unset("tokens");
    this.on("change:members change:membersV2", this.fetchContacts);
    this.typingRefreshTimer = null;
    this.typingPauseTimer = null;
    this.on("change", (_model, options = {}) => {
      const changedKeys = Object.keys(this.changed || {});
      const isPropsCacheStillValid = !options.force && Boolean(changedKeys.length && changedKeys.every((key) => ATTRIBUTES_THAT_DONT_INVALIDATE_PROPS_CACHE.has(key)));
      if (isPropsCacheStillValid) {
        return;
      }
      if (this.cachedProps) {
        this.oldCachedProps = this.cachedProps;
      }
      this.cachedProps = null;
      this.trigger("props-change", this, this.isInReduxBatch);
    });
    this.isFetchingUUID = this.isSMSOnly();
    this.throttledFetchSMSOnlyUUID = (0, import_lodash.throttle)(this.fetchSMSOnlyUUID.bind(this), FIVE_MINUTES);
    this.throttledMaybeMigrateV1Group = (0, import_lodash.throttle)(this.maybeMigrateV1Group.bind(this), FIVE_MINUTES);
    const migratedColor = this.getColor();
    if (this.get("color") !== migratedColor) {
      this.set("color", migratedColor);
    }
  }
  toSenderKeyTarget() {
    return {
      getGroupId: () => this.get("groupId"),
      getMembers: () => this.getMembers(),
      hasMember: (uuid) => this.hasMember(new import_UUID.UUID(uuid)),
      idForLogging: () => this.idForLogging(),
      isGroupV2: () => (0, import_whatTypeOfConversation.isGroupV2)(this.attributes),
      isValid: () => (0, import_whatTypeOfConversation.isGroupV2)(this.attributes),
      getSenderKeyInfo: () => this.get("senderKeyInfo"),
      saveSenderKeyInfo: async (senderKeyInfo) => {
        this.set({ senderKeyInfo });
        window.Signal.Data.updateConversation(this.attributes);
      }
    };
  }
  isMemberRequestingToJoin(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const pendingAdminApprovalV2 = this.get("pendingAdminApprovalV2");
    if (!pendingAdminApprovalV2 || !pendingAdminApprovalV2.length) {
      return false;
    }
    return pendingAdminApprovalV2.some((item) => item.uuid === uuid.toString());
  }
  isMemberPending(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const pendingMembersV2 = this.get("pendingMembersV2");
    if (!pendingMembersV2 || !pendingMembersV2.length) {
      return false;
    }
    return pendingMembersV2.some((item) => item.uuid === uuid.toString());
  }
  isMemberBanned(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const bannedMembersV2 = this.get("bannedMembersV2");
    if (!bannedMembersV2 || !bannedMembersV2.length) {
      return false;
    }
    return bannedMembersV2.some((member) => member.uuid === uuid.toString());
  }
  isMemberAwaitingApproval(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const pendingAdminApprovalV2 = this.get("pendingAdminApprovalV2");
    if (!pendingAdminApprovalV2 || !pendingAdminApprovalV2.length) {
      return false;
    }
    return pendingAdminApprovalV2.some((member) => member.uuid === uuid.toString());
  }
  isMember(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const membersV2 = this.get("membersV2");
    if (!membersV2 || !membersV2.length) {
      return false;
    }
    return window._.any(membersV2, (item) => item.uuid === uuid.toString());
  }
  async updateExpirationTimerInGroupV2(seconds) {
    const idLog = this.idForLogging();
    const current = this.get("expireTimer");
    const bothFalsey = Boolean(current) === false && Boolean(seconds) === false;
    if (current === seconds || bothFalsey) {
      log.warn(`updateExpirationTimerInGroupV2/${idLog}: Requested timer ${seconds} is unchanged from existing ${current}.`);
      return void 0;
    }
    return window.Signal.Groups.buildDisappearingMessagesTimerChange({
      expireTimer: seconds || 0,
      group: this.attributes
    });
  }
  async promotePendingMember(uuidKind) {
    const idLog = this.idForLogging();
    const us = window.ConversationController.getOurConversationOrThrow();
    const uuid = window.storage.user.getCheckedUuid(uuidKind);
    if (!this.isMemberPending(uuid)) {
      log.warn(`promotePendingMember/${idLog}: we are not a pending member of group. Returning early.`);
      return void 0;
    }
    if (uuidKind === import_UUID.UUIDKind.ACI) {
      if (!us.get("profileKeyCredential")) {
        await us.getProfiles();
      }
      const profileKeyCredentialBase64 = us.get("profileKeyCredential");
      (0, import_assert.strictAssert)(profileKeyCredentialBase64, "Must have profileKeyCredential");
      return window.Signal.Groups.buildPromoteMemberChange({
        group: this.attributes,
        profileKeyCredentialBase64,
        serverPublicParamsBase64: window.getServerPublicParams()
      });
    }
    (0, import_assert.strictAssert)(uuidKind === import_UUID.UUIDKind.PNI, "Must be a PNI promotion");
    if (!us.get("pniCredential")) {
      await us.getProfiles();
    }
    const pniCredentialBase64 = us.get("pniCredential");
    (0, import_assert.strictAssert)(pniCredentialBase64, "Must have pniCredential");
    return window.Signal.Groups.buildPromoteMemberChange({
      group: this.attributes,
      pniCredentialBase64,
      serverPublicParamsBase64: window.getServerPublicParams()
    });
  }
  async approvePendingApprovalRequest(uuid) {
    const idLog = this.idForLogging();
    if (!this.isMemberRequestingToJoin(uuid)) {
      log.warn(`approvePendingApprovalRequest/${idLog}: ${uuid} is not requesting to join the group. Returning early.`);
      return void 0;
    }
    return window.Signal.Groups.buildPromotePendingAdminApprovalMemberChange({
      group: this.attributes,
      uuid
    });
  }
  async denyPendingApprovalRequest(uuid) {
    const idLog = this.idForLogging();
    if (!this.isMemberRequestingToJoin(uuid)) {
      log.warn(`denyPendingApprovalRequest/${idLog}: ${uuid} is not requesting to join the group. Returning early.`);
      return void 0;
    }
    const ourUuid = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
    return window.Signal.Groups.buildDeletePendingAdminApprovalMemberChange({
      group: this.attributes,
      ourUuid,
      uuid
    });
  }
  async addPendingApprovalRequest() {
    const idLog = this.idForLogging();
    const conversationId = window.ConversationController.getOurConversationIdOrThrow();
    const toRequest = window.ConversationController.get(conversationId);
    if (!toRequest) {
      throw new Error(`addPendingApprovalRequest/${idLog}: No conversation found for conversation ${conversationId}`);
    }
    const uuid = toRequest.getCheckedUuid(`addPendingApprovalRequest/${idLog}`);
    let profileKeyCredentialBase64 = toRequest.get("profileKeyCredential");
    if (!profileKeyCredentialBase64) {
      await toRequest.getProfiles();
      profileKeyCredentialBase64 = toRequest.get("profileKeyCredential");
      if (!profileKeyCredentialBase64) {
        throw new Error(`promotePendingMember/${idLog}: No profileKeyCredential for conversation ${toRequest.idForLogging()}`);
      }
    }
    if (this.isMemberAwaitingApproval(uuid)) {
      log.warn(`addPendingApprovalRequest/${idLog}: ${toRequest.idForLogging()} already in pending approval.`);
      return void 0;
    }
    return window.Signal.Groups.buildAddPendingAdminApprovalMemberChange({
      group: this.attributes,
      profileKeyCredentialBase64,
      serverPublicParamsBase64: window.getServerPublicParams()
    });
  }
  async addMember(uuid) {
    const idLog = this.idForLogging();
    const toRequest = window.ConversationController.get(uuid.toString());
    if (!toRequest) {
      throw new Error(`addMember/${idLog}: No conversation found for ${uuid}`);
    }
    let profileKeyCredentialBase64 = toRequest.get("profileKeyCredential");
    if (!profileKeyCredentialBase64) {
      await toRequest.getProfiles();
      profileKeyCredentialBase64 = toRequest.get("profileKeyCredential");
      if (!profileKeyCredentialBase64) {
        throw new Error(`addMember/${idLog}: No profileKeyCredential for conversation ${toRequest.idForLogging()}`);
      }
    }
    if (this.isMember(uuid)) {
      log.warn(`addMember/${idLog}: ${toRequest.idForLogging()} is already a member.`);
      return void 0;
    }
    return window.Signal.Groups.buildAddMember({
      group: this.attributes,
      profileKeyCredentialBase64,
      serverPublicParamsBase64: window.getServerPublicParams(),
      uuid
    });
  }
  async removePendingMember(uuids) {
    const idLog = this.idForLogging();
    const pendingUuids = uuids.map((uuid) => {
      if (!this.isMemberPending(uuid)) {
        log.warn(`removePendingMember/${idLog}: ${uuid} is not a pending member of group. Returning early.`);
        return void 0;
      }
      return uuid;
    }).filter(import_isNotNil.isNotNil);
    if (!uuids.length) {
      return void 0;
    }
    return window.Signal.Groups.buildDeletePendingMemberChange({
      group: this.attributes,
      uuids: pendingUuids
    });
  }
  async removeMember(uuid) {
    const idLog = this.idForLogging();
    if (!this.isMember(uuid)) {
      log.warn(`removeMember/${idLog}: ${uuid} is not a pending member of group. Returning early.`);
      return void 0;
    }
    const ourUuid = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
    return window.Signal.Groups.buildDeleteMemberChange({
      group: this.attributes,
      ourUuid,
      uuid
    });
  }
  async toggleAdminChange(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return void 0;
    }
    const idLog = this.idForLogging();
    if (!this.isMember(uuid)) {
      log.warn(`toggleAdminChange/${idLog}: ${uuid} is not a pending member of group. Returning early.`);
      return void 0;
    }
    const MEMBER_ROLES = import_protobuf.SignalService.Member.Role;
    const role = this.isAdmin(uuid) ? MEMBER_ROLES.DEFAULT : MEMBER_ROLES.ADMINISTRATOR;
    return window.Signal.Groups.buildModifyMemberRoleChange({
      group: this.attributes,
      uuid,
      role
    });
  }
  async modifyGroupV2({
    usingCredentialsFrom,
    createGroupChange,
    extraConversationsForSend,
    inviteLinkPassword,
    name
  }) {
    await window.Signal.Groups.modifyGroupV2({
      conversation: this,
      usingCredentialsFrom,
      createGroupChange,
      extraConversationsForSend,
      inviteLinkPassword,
      name
    });
  }
  isEverUnregistered() {
    return Boolean(this.get("discoveredUnregisteredAt"));
  }
  isUnregistered() {
    return (0, import_isConversationUnregistered.isConversationUnregistered)(this.attributes);
  }
  isSMSOnly() {
    return (0, import_isConversationSMSOnly.isConversationSMSOnly)({
      ...this.attributes,
      type: (0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) ? "direct" : "unknown"
    });
  }
  setUnregistered() {
    log.info(`Conversation ${this.idForLogging()} is now unregistered`);
    this.set({
      discoveredUnregisteredAt: Date.now()
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  setRegistered() {
    if (this.get("discoveredUnregisteredAt") === void 0) {
      return;
    }
    log.info(`Conversation ${this.idForLogging()} is registered once again`);
    this.set({
      discoveredUnregisteredAt: void 0
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  isGroupV1AndDisabled() {
    return (0, import_whatTypeOfConversation.isGroupV1)(this.attributes);
  }
  isBlocked() {
    const uuid = this.get("uuid");
    if (uuid) {
      return window.storage.blocked.isUuidBlocked(uuid);
    }
    const e164 = this.get("e164");
    if (e164) {
      return window.storage.blocked.isBlocked(e164);
    }
    const groupId = this.get("groupId");
    if (groupId) {
      return window.storage.blocked.isGroupBlocked(groupId);
    }
    return false;
  }
  block({ viaStorageServiceSync = false } = {}) {
    let blocked = false;
    const wasBlocked = this.isBlocked();
    const uuid = this.get("uuid");
    if (uuid) {
      window.storage.blocked.addBlockedUuid(uuid);
      blocked = true;
    }
    const e164 = this.get("e164");
    if (e164) {
      window.storage.blocked.addBlockedNumber(e164);
      blocked = true;
    }
    const groupId = this.get("groupId");
    if (groupId) {
      window.storage.blocked.addBlockedGroup(groupId);
      blocked = true;
    }
    if (blocked && !wasBlocked) {
      this.trigger("change", this, { force: true });
      if (!viaStorageServiceSync) {
        this.captureChange("block");
      }
    }
  }
  unblock({ viaStorageServiceSync = false } = {}) {
    let unblocked = false;
    const wasBlocked = this.isBlocked();
    const uuid = this.get("uuid");
    if (uuid) {
      window.storage.blocked.removeBlockedUuid(uuid);
      unblocked = true;
    }
    const e164 = this.get("e164");
    if (e164) {
      window.storage.blocked.removeBlockedNumber(e164);
      unblocked = true;
    }
    const groupId = this.get("groupId");
    if (groupId) {
      window.storage.blocked.removeBlockedGroup(groupId);
      unblocked = true;
    }
    if (unblocked && wasBlocked) {
      this.trigger("change", this, { force: true });
      if (!viaStorageServiceSync) {
        this.captureChange("unblock");
      }
      this.fetchLatestGroupV2Data({ force: true });
    }
    return unblocked;
  }
  enableProfileSharing({ viaStorageServiceSync = false } = {}) {
    log.info(`enableProfileSharing: ${this.idForLogging()} storage? ${viaStorageServiceSync}`);
    const before = this.get("profileSharing");
    this.set({ profileSharing: true });
    const after = this.get("profileSharing");
    if (!viaStorageServiceSync && Boolean(before) !== Boolean(after)) {
      this.captureChange("enableProfileSharing");
    }
  }
  disableProfileSharing({ viaStorageServiceSync = false } = {}) {
    log.info(`disableProfileSharing: ${this.idForLogging()} storage? ${viaStorageServiceSync}`);
    const before = this.get("profileSharing");
    this.set({ profileSharing: false });
    const after = this.get("profileSharing");
    if (!viaStorageServiceSync && Boolean(before) !== Boolean(after)) {
      this.captureChange("disableProfileSharing");
    }
  }
  hasDraft() {
    const draftAttachments = this.get("draftAttachments") || [];
    return this.get("draft") || this.get("quotedMessageId") || draftAttachments.length > 0;
  }
  getDraftPreview() {
    const draft = this.get("draft");
    if (draft) {
      const bodyRanges = this.get("draftBodyRanges") || [];
      return (0, import_getTextWithMentions.getTextWithMentions)(bodyRanges, draft);
    }
    const draftAttachments = this.get("draftAttachments") || [];
    if (draftAttachments.length > 0) {
      return window.i18n("Conversation--getDraftPreview--attachment");
    }
    const quotedMessageId = this.get("quotedMessageId");
    if (quotedMessageId) {
      return window.i18n("Conversation--getDraftPreview--quote");
    }
    return window.i18n("Conversation--getDraftPreview--draft");
  }
  bumpTyping() {
    if (!window.Events.getTypingIndicatorSetting()) {
      return;
    }
    if (!this.typingRefreshTimer) {
      const isTyping = true;
      this.setTypingRefreshTimer();
      this.sendTypingMessage(isTyping);
    }
    this.setTypingPauseTimer();
  }
  setTypingRefreshTimer() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.typingRefreshTimer);
    this.typingRefreshTimer = setTimeout(this.onTypingRefreshTimeout.bind(this), 10 * 1e3);
  }
  onTypingRefreshTimeout() {
    const isTyping = true;
    this.sendTypingMessage(isTyping);
    this.setTypingRefreshTimer();
  }
  setTypingPauseTimer() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.typingPauseTimer);
    this.typingPauseTimer = setTimeout(this.onTypingPauseTimeout.bind(this), 3 * 1e3);
  }
  onTypingPauseTimeout() {
    const isTyping = false;
    this.sendTypingMessage(isTyping);
    this.clearTypingTimers();
  }
  clearTypingTimers() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.typingPauseTimer);
    this.typingPauseTimer = null;
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.typingRefreshTimer);
    this.typingRefreshTimer = null;
  }
  async fetchLatestGroupV2Data(options = {}) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    await window.Signal.Groups.waitThenMaybeUpdateGroup({
      force: options.force,
      conversation: this
    });
  }
  async fetchSMSOnlyUUID() {
    const { messaging } = window.textsecure;
    if (!messaging) {
      return;
    }
    if (!this.isSMSOnly()) {
      return;
    }
    log.info(`Fetching uuid for a sms-only conversation ${this.idForLogging()}`);
    this.isFetchingUUID = true;
    this.trigger("change", this, { force: true });
    try {
      await (0, import_updateConversationsWithUuidLookup.updateConversationsWithUuidLookup)({
        conversationController: window.ConversationController,
        conversations: [this],
        messaging
      });
    } finally {
      this.isFetchingUUID = false;
      this.trigger("change", this, { force: true });
      log.info(`Done fetching uuid for a sms-only conversation ${this.idForLogging()}`);
    }
    if (!this.get("uuid")) {
      return;
    }
    this.setRegistered();
  }
  isValid() {
    return (0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) || (0, import_whatTypeOfConversation.isGroupV1)(this.attributes) || (0, import_whatTypeOfConversation.isGroupV2)(this.attributes);
  }
  async maybeMigrateV1Group() {
    if (!(0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
      return;
    }
    const isMigrated = await window.Signal.Groups.hasV1GroupBeenMigrated(this);
    if (!isMigrated) {
      return;
    }
    await window.Signal.Groups.waitThenRespondToGroupV2Migration({
      conversation: this
    });
  }
  maybeRepairGroupV2(data) {
    if (this.get("groupVersion") && this.get("masterKey") && this.get("secretParams") && this.get("publicParams")) {
      return;
    }
    log.info(`Repairing GroupV2 conversation ${this.idForLogging()}`);
    const { masterKey, secretParams, publicParams } = data;
    this.set({ masterKey, secretParams, publicParams, groupVersion: 2 });
    window.Signal.Data.updateConversation(this.attributes);
  }
  getGroupV2Info(options = {}) {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) || !(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return void 0;
    }
    return {
      masterKey: Bytes.fromBase64(this.get("masterKey")),
      revision: this.get("revision"),
      members: "members" in options ? options.members : this.getRecipients(options),
      groupChange: options.groupChange
    };
  }
  getGroupV1Info(members) {
    const groupId = this.get("groupId");
    const groupVersion = this.get("groupVersion");
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) || !groupId || groupVersion && groupVersion > 0) {
      return void 0;
    }
    return {
      id: groupId,
      members: members || this.getRecipients()
    };
  }
  getGroupIdBuffer() {
    const groupIdString = this.get("groupId");
    if (!groupIdString) {
      return void 0;
    }
    if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
      return Bytes.fromBinary(groupIdString);
    }
    if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return Bytes.fromBase64(groupIdString);
    }
    return void 0;
  }
  async sendTypingMessage(isTyping) {
    const { messaging } = window.textsecure;
    if (!messaging) {
      return;
    }
    if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
      return;
    }
    this.lastIsTyping = isTyping;
    await this.queueJob("sendTypingMessage", async () => {
      const groupMembers = this.getRecipients();
      if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) && !groupMembers.length) {
        return;
      }
      if (this.lastIsTyping === void 0) {
        log.info(`sendTypingMessage(${this.idForLogging()}): ignoring`);
        return;
      }
      const recipientId = (0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) ? this.getSendTarget() : void 0;
      const groupId = this.getGroupIdBuffer();
      const timestamp = Date.now();
      const content = {
        recipientId,
        groupId,
        groupMembers,
        isTyping: this.lastIsTyping,
        timestamp
      };
      this.lastIsTyping = void 0;
      log.info(`sendTypingMessage(${this.idForLogging()}): sending ${content.isTyping}`);
      const contentMessage = messaging.getTypingContentMessage(content);
      const { ContentHint } = import_protobuf.SignalService.UnidentifiedSenderMessage.Message;
      const sendOptions = {
        ...await (0, import_getSendOptions.getSendOptions)(this.attributes),
        online: true
      };
      if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
        await (0, import_handleMessageSend.handleMessageSend)(messaging.sendMessageProtoAndWait({
          contentHint: ContentHint.IMPLICIT,
          groupId: void 0,
          options: sendOptions,
          proto: contentMessage,
          recipients: groupMembers,
          timestamp,
          urgent: false
        }), { messageIds: [], sendType: "typing" });
      } else {
        await (0, import_handleMessageSend.handleMessageSend)(window.Signal.Util.sendContentMessageToGroup({
          contentHint: ContentHint.IMPLICIT,
          contentMessage,
          messageId: void 0,
          online: true,
          recipients: groupMembers,
          sendOptions,
          sendTarget: this.toSenderKeyTarget(),
          sendType: "typing",
          timestamp,
          urgent: false
        }), { messageIds: [], sendType: "typing" });
      }
    });
  }
  async onNewMessage(message) {
    const uuid = message.get("sourceUuid");
    const e164 = message.get("source");
    const sourceDevice = message.get("sourceDevice");
    const source = window.ConversationController.lookupOrCreate({
      uuid,
      e164
    });
    const typingToken = `${source?.id}.${sourceDevice}`;
    this.clearContactTypingTimer(typingToken);
    const isGroupStoryReply = (0, import_whatTypeOfConversation.isGroup)(this.attributes) && message.get("storyId");
    if (isGroupStoryReply || (0, import_message.isStory)(message.attributes)) {
      return;
    }
    this.addSingleMessage(message);
  }
  async addSingleMessage(message, { isJustSent } = { isJustSent: false }) {
    await this.beforeAddSingleMessage();
    this.doAddSingleMessage(message, { isJustSent });
    this.debouncedUpdateLastMessage();
  }
  async beforeAddSingleMessage() {
    if (!this.newMessageQueue) {
      this.newMessageQueue = new window.PQueue({
        concurrency: 1,
        timeout: durations.MINUTE * 30
      });
    }
    await this.newMessageQueue.add(async () => {
      await this.inProgressFetch;
    });
  }
  doAddSingleMessage(message, { isJustSent }) {
    const { messagesAdded } = window.reduxActions.conversations;
    const { conversations } = window.reduxStore.getState();
    const { messagesByConversation } = conversations;
    const conversationId = this.id;
    const existingConversation = messagesByConversation[conversationId];
    const newestId = existingConversation?.metrics?.newest?.id;
    const messageIds = existingConversation?.messageIds;
    const isLatestInMemory = newestId && messageIds && messageIds[messageIds.length - 1] === newestId;
    if (isJustSent && existingConversation && !isLatestInMemory) {
      this.loadNewestMessages(void 0, void 0);
    } else {
      messagesAdded({
        conversationId,
        messages: [{ ...message.attributes }],
        isActive: window.SignalContext.activeWindowService.isActive(),
        isJustSent,
        isNewMessage: true
      });
    }
  }
  setInProgressFetch() {
    let resolvePromise;
    this.inProgressFetch = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    const finish = /* @__PURE__ */ __name(() => {
      resolvePromise();
      this.inProgressFetch = void 0;
    }, "finish");
    return finish;
  }
  async loadNewestMessages(newestMessageId, setFocus) {
    const { messagesReset, setMessageLoadingState } = window.reduxActions.conversations;
    const conversationId = this.id;
    setMessageLoadingState(conversationId, import_timelineUtil.TimelineMessageLoadingState.DoingInitialLoad);
    const finish = this.setInProgressFetch();
    try {
      let scrollToLatestUnread = true;
      if (newestMessageId) {
        const newestInMemoryMessage = await getMessageById(newestMessageId);
        if (newestInMemoryMessage) {
          if ((0, import_isMessageUnread.isMessageUnread)(newestInMemoryMessage)) {
            scrollToLatestUnread = false;
          }
        } else {
          log.warn(`loadNewestMessages: did not find message ${newestMessageId}`);
        }
      }
      const metrics = await getMessageMetricsForConversation(conversationId, void 0, (0, import_whatTypeOfConversation.isGroup)(this.attributes));
      if (!newestMessageId && !this.getAccepted() && metrics.oldest) {
        this.loadAndScroll(metrics.oldest.id, { disableScroll: true });
        return;
      }
      if (scrollToLatestUnread && metrics.oldestUnseen) {
        this.loadAndScroll(metrics.oldestUnseen.id, {
          disableScroll: !setFocus
        });
        return;
      }
      const messages = await getOlderMessagesByConversation(conversationId, {
        isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
        limit: MESSAGE_LOAD_CHUNK_SIZE,
        storyId: void 0
      });
      const cleaned = await this.cleanModels(messages);
      const scrollToMessageId = setFocus && metrics.newest ? metrics.newest.id : void 0;
      const unboundedFetch = true;
      messagesReset({
        conversationId,
        messages: cleaned.map((messageModel) => ({
          ...messageModel.attributes
        })),
        metrics,
        scrollToMessageId,
        unboundedFetch
      });
    } catch (error) {
      setMessageLoadingState(conversationId, void 0);
      throw error;
    } finally {
      finish();
    }
  }
  async loadOlderMessages(oldestMessageId) {
    const { messagesAdded, setMessageLoadingState, repairOldestMessage } = window.reduxActions.conversations;
    const conversationId = this.id;
    setMessageLoadingState(conversationId, import_timelineUtil.TimelineMessageLoadingState.LoadingOlderMessages);
    const finish = this.setInProgressFetch();
    try {
      const message = await getMessageById(oldestMessageId);
      if (!message) {
        throw new Error(`loadOlderMessages: failed to load message ${oldestMessageId}`);
      }
      const receivedAt = message.received_at;
      const sentAt = message.sent_at;
      const models = await getOlderMessagesByConversation(conversationId, {
        isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
        limit: MESSAGE_LOAD_CHUNK_SIZE,
        messageId: oldestMessageId,
        receivedAt,
        sentAt,
        storyId: void 0
      });
      if (models.length < 1) {
        log.warn("loadOlderMessages: requested, but loaded no messages");
        repairOldestMessage(conversationId);
        return;
      }
      const cleaned = await this.cleanModels(models);
      messagesAdded({
        conversationId,
        messages: cleaned.map((messageModel) => ({
          ...messageModel.attributes
        })),
        isActive: window.SignalContext.activeWindowService.isActive(),
        isJustSent: false,
        isNewMessage: false
      });
    } catch (error) {
      setMessageLoadingState(conversationId, void 0);
      throw error;
    } finally {
      finish();
    }
  }
  async loadNewerMessages(newestMessageId) {
    const { messagesAdded, setMessageLoadingState, repairNewestMessage } = window.reduxActions.conversations;
    const conversationId = this.id;
    setMessageLoadingState(conversationId, import_timelineUtil.TimelineMessageLoadingState.LoadingNewerMessages);
    const finish = this.setInProgressFetch();
    try {
      const message = await getMessageById(newestMessageId);
      if (!message) {
        throw new Error(`loadNewerMessages: failed to load message ${newestMessageId}`);
      }
      const receivedAt = message.received_at;
      const sentAt = message.sent_at;
      const models = await getNewerMessagesByConversation(conversationId, {
        isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
        limit: MESSAGE_LOAD_CHUNK_SIZE,
        receivedAt,
        sentAt,
        storyId: void 0
      });
      if (models.length < 1) {
        log.warn("loadNewerMessages: requested, but loaded no messages");
        repairNewestMessage(conversationId);
        return;
      }
      const cleaned = await this.cleanModels(models);
      messagesAdded({
        conversationId,
        messages: cleaned.map((messageModel) => ({
          ...messageModel.attributes
        })),
        isActive: window.SignalContext.activeWindowService.isActive(),
        isJustSent: false,
        isNewMessage: false
      });
    } catch (error) {
      setMessageLoadingState(conversationId, void 0);
      throw error;
    } finally {
      finish();
    }
  }
  async loadAndScroll(messageId, options) {
    const { messagesReset, setMessageLoadingState } = window.reduxActions.conversations;
    const conversationId = this.id;
    setMessageLoadingState(conversationId, import_timelineUtil.TimelineMessageLoadingState.DoingInitialLoad);
    const finish = this.setInProgressFetch();
    try {
      const message = await getMessageById(messageId);
      if (!message) {
        throw new Error(`loadMoreAndScroll: failed to load message ${messageId}`);
      }
      const receivedAt = message.received_at;
      const sentAt = message.sent_at;
      const { older, newer, metrics } = await getConversationRangeCenteredOnMessage({
        conversationId,
        isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
        limit: MESSAGE_LOAD_CHUNK_SIZE,
        messageId,
        receivedAt,
        sentAt,
        storyId: void 0
      });
      const all = [...older, message, ...newer];
      const cleaned = await this.cleanModels(all);
      const scrollToMessageId = options && options.disableScroll ? void 0 : messageId;
      messagesReset({
        conversationId,
        messages: cleaned.map((messageModel) => ({
          ...messageModel.attributes
        })),
        metrics,
        scrollToMessageId
      });
    } catch (error) {
      setMessageLoadingState(conversationId, void 0);
      throw error;
    } finally {
      finish();
    }
  }
  async cleanModels(messages) {
    const result = messages.filter((message) => Boolean(message.id)).map((message) => window.MessageController.register(message.id, message));
    const eliminated = messages.length - result.length;
    if (eliminated > 0) {
      log.warn(`cleanModels: Eliminated ${eliminated} messages without an id`);
    }
    const ourUuid = window.textsecure.storage.user.getCheckedUuid().toString();
    let upgraded = 0;
    for (let max = result.length, i = 0; i < max; i += 1) {
      const message = result[i];
      const { attributes } = message;
      const { schemaVersion } = attributes;
      if (schemaVersion < Message.VERSION_NEEDED_FOR_DISPLAY) {
        const upgradedMessage = await upgradeMessageSchema(attributes);
        message.set(upgradedMessage);
        await window.Signal.Data.saveMessage(upgradedMessage, { ourUuid });
        upgraded += 1;
      }
    }
    if (upgraded > 0) {
      log.warn(`cleanModels: Upgraded schema of ${upgraded} messages`);
    }
    await Promise.all(result.map((model) => model.hydrateStoryContext()));
    return result;
  }
  format() {
    if (this.cachedProps) {
      return this.cachedProps;
    }
    const oldFormat = this.format;
    this.format = () => {
      if (!this.oldCachedProps) {
        throw new Error(`Conversation.format()/${this.idForLogging()} reentrant call, no old cached props!`);
      }
      const { stack } = new Error("for stack");
      log.warn(`Conversation.format()/${this.idForLogging()} reentrant call! ${stack}`);
      return this.oldCachedProps;
    };
    try {
      this.cachedProps = this.getProps();
      return this.cachedProps;
    } finally {
      this.format = oldFormat;
    }
  }
  getProps() {
    const color = this.getColor();
    let lastMessage;
    if (this.get("lastMessageDeletedForEveryone")) {
      lastMessage = { deletedForEveryone: true };
    } else {
      const lastMessageText = this.get("lastMessage");
      if (lastMessageText) {
        lastMessage = {
          status: (0, import_dropNull.dropNull)(this.get("lastMessageStatus")),
          text: lastMessageText,
          deletedForEveryone: false
        };
      }
    }
    const typingValues = window._.values(this.contactTypingTimers || {});
    const typingMostRecent = window._.first(window._.sortBy(typingValues, "timestamp"));
    const timestamp = this.get("timestamp");
    const draftTimestamp = this.get("draftTimestamp");
    const draftPreview = this.getDraftPreview();
    const draftText = this.get("draft");
    const draftBodyRanges = this.get("draftBodyRanges");
    const shouldShowDraft = this.hasDraft() && draftTimestamp && draftTimestamp >= timestamp;
    const inboxPosition = this.get("inbox_position");
    const messageRequestsEnabled = window.Signal.RemoteConfig.isEnabled("desktop.messageRequests");
    const ourConversationId = window.ConversationController.getOurConversationId();
    let groupVersion;
    if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
      groupVersion = 1;
    } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      groupVersion = 2;
    }
    const sortedGroupMembers = (0, import_whatTypeOfConversation.isGroupV2)(this.attributes) ? this.getMembers().sort((left, right) => sortConversationTitles(left, right, this.intlCollator)).map((member) => member.format()).filter(import_isNotNil.isNotNil) : void 0;
    const { customColor, customColorId } = this.getCustomColorData();
    const ourACI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI);
    const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
    return {
      id: this.id,
      uuid: this.get("uuid"),
      e164: this.get("e164"),
      username: (0, import_dropNull.dropNull)(this.get("username")),
      about: this.getAboutText(),
      aboutText: this.get("about"),
      aboutEmoji: this.get("aboutEmoji"),
      acceptedMessageRequest: this.getAccepted(),
      activeAt: this.get("active_at"),
      areWePending: ourACI && (this.isMemberPending(ourACI) || Boolean(ourPNI && !this.isMember(ourACI) && this.isMemberPending(ourPNI))),
      areWePendingApproval: Boolean(ourConversationId && ourACI && this.isMemberAwaitingApproval(ourACI)),
      areWeAdmin: this.areWeAdmin(),
      avatars: (0, import_getAvatarData.getAvatarData)(this.attributes),
      badges: this.get("badges") || [],
      canChangeTimer: this.canChangeTimer(),
      canEditGroupInfo: this.canEditGroupInfo(),
      avatarPath: this.getAbsoluteAvatarPath(),
      avatarHash: this.getAvatarHash(),
      unblurredAvatarPath: this.getAbsoluteUnblurredAvatarPath(),
      profileAvatarPath: this.getAbsoluteProfileAvatarPath(),
      color,
      conversationColor: this.getConversationColor(),
      customColor,
      customColorId,
      discoveredUnregisteredAt: this.get("discoveredUnregisteredAt"),
      draftBodyRanges,
      draftPreview,
      draftText,
      familyName: this.get("profileFamilyName"),
      firstName: this.get("profileName"),
      groupDescription: this.get("description"),
      groupVersion,
      groupId: this.get("groupId"),
      groupLink: this.getGroupLink(),
      isGroupStorySendReady: Boolean(this.get("isGroupStorySendReady")),
      hideStory: Boolean(this.get("hideStory")),
      inboxPosition,
      isArchived: this.get("isArchived"),
      isBlocked: this.isBlocked(),
      isMe: (0, import_whatTypeOfConversation.isMe)(this.attributes),
      isGroupV1AndDisabled: this.isGroupV1AndDisabled(),
      isPinned: this.get("isPinned"),
      isUntrusted: this.isUntrusted(),
      isVerified: this.isVerified(),
      isFetchingUUID: this.isFetchingUUID,
      lastMessage,
      lastUpdated: this.get("timestamp"),
      left: Boolean(this.get("left")),
      markedUnread: this.get("markedUnread"),
      membersCount: this.getMembersCount(),
      memberships: this.getMemberships(),
      messageCount: this.get("messageCount") || 0,
      pendingMemberships: this.getPendingMemberships(),
      pendingApprovalMemberships: this.getPendingApprovalMemberships(),
      bannedMemberships: this.getBannedMemberships(),
      profileKey: this.get("profileKey"),
      messageRequestsEnabled,
      accessControlAddFromInviteLink: this.get("accessControl")?.addFromInviteLink,
      accessControlAttributes: this.get("accessControl")?.attributes,
      accessControlMembers: this.get("accessControl")?.members,
      announcementsOnly: Boolean(this.get("announcementsOnly")),
      announcementsOnlyReady: this.canBeAnnouncementGroup(),
      expireTimer: this.get("expireTimer"),
      muteExpiresAt: this.get("muteExpiresAt"),
      dontNotifyForMentionsIfMuted: this.get("dontNotifyForMentionsIfMuted"),
      name: this.get("name"),
      phoneNumber: this.getNumber(),
      profileName: this.getProfileName(),
      profileSharing: this.get("profileSharing"),
      publicParams: this.get("publicParams"),
      secretParams: this.get("secretParams"),
      shouldShowDraft,
      sortedGroupMembers,
      timestamp,
      title: this.getTitle(),
      typingContactId: typingMostRecent?.senderId,
      searchableTitle: (0, import_whatTypeOfConversation.isMe)(this.attributes) ? window.i18n("noteToSelf") : this.getTitle(),
      unreadCount: this.get("unreadCount") || 0,
      ...(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) ? {
        type: "direct",
        sharedGroupNames: this.get("sharedGroupNames") || []
      } : {
        type: "group",
        acknowledgedGroupNameCollisions: this.get("acknowledgedGroupNameCollisions") || {},
        sharedGroupNames: []
      }
    };
  }
  updateE164(e164) {
    const oldValue = this.get("e164");
    if (e164 !== oldValue) {
      this.set("e164", e164 || void 0);
      if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
        this.set({ pniCredential: null });
      }
      if (oldValue && e164) {
        this.addChangeNumberNotification(oldValue, e164);
      }
      window.Signal.Data.updateConversation(this.attributes);
      this.trigger("idUpdated", this, "e164", oldValue);
      this.captureChange("updateE164");
    }
  }
  updateUuid(uuid) {
    const oldValue = this.get("uuid");
    if (uuid !== oldValue) {
      this.set("uuid", uuid ? import_UUID.UUID.cast(uuid.toLowerCase()) : void 0);
      window.Signal.Data.updateConversation(this.attributes);
      this.trigger("idUpdated", this, "uuid", oldValue);
      this.captureChange("updateUuid");
    }
  }
  updatePni(pni) {
    const oldValue = this.get("pni");
    if (pni !== oldValue) {
      this.set("pni", pni ? import_UUID.UUID.cast(pni.toLowerCase()) : void 0);
      if (oldValue && pni && (!this.get("uuid") || this.get("uuid") === oldValue)) {
        this.addKeyChange(import_UUID.UUID.checkedLookup(oldValue));
      }
      window.Signal.Data.updateConversation(this.attributes);
      this.trigger("idUpdated", this, "pni", oldValue);
      this.captureChange("updatePni");
    }
  }
  updateGroupId(groupId) {
    const oldValue = this.get("groupId");
    if (groupId && groupId !== oldValue) {
      this.set("groupId", groupId);
      window.Signal.Data.updateConversation(this.attributes);
      this.trigger("idUpdated", this, "groupId", oldValue);
    }
  }
  incrementMessageCount() {
    this.set({
      messageCount: (this.get("messageCount") || 0) + 1
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  getMembersCount() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return void 0;
    }
    const memberList = this.get("membersV2") || this.get("members");
    if (memberList && memberList.length) {
      return memberList.length;
    }
    const temporaryMemberCount = this.get("temporaryMemberCount");
    if ((0, import_lodash.isNumber)(temporaryMemberCount)) {
      return temporaryMemberCount;
    }
    return void 0;
  }
  decrementMessageCount() {
    this.set({
      messageCount: Math.max((this.get("messageCount") || 0) - 1, 0)
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  incrementSentMessageCount({ dry = false } = {}) {
    const update = {
      messageCount: (this.get("messageCount") || 0) + 1,
      sentMessageCount: (this.get("sentMessageCount") || 0) + 1
    };
    if (dry) {
      return update;
    }
    this.set(update);
    window.Signal.Data.updateConversation(this.attributes);
    return void 0;
  }
  decrementSentMessageCount() {
    this.set({
      messageCount: Math.max((this.get("messageCount") || 0) - 1, 0),
      sentMessageCount: Math.max((this.get("sentMessageCount") || 0) - 1, 0)
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  async handleReadAndDownloadAttachments(options = {}) {
    const { isLocalAction } = options;
    const ourUuid = window.textsecure.storage.user.getCheckedUuid().toString();
    let messages;
    do {
      const first = messages ? messages[0] : void 0;
      messages = await window.Signal.Data.getOlderMessagesByConversation(this.get("id"), {
        isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
        limit: 100,
        messageId: first ? first.id : void 0,
        receivedAt: first ? first.received_at : void 0,
        sentAt: first ? first.sent_at : void 0,
        storyId: void 0
      });
      if (!messages.length) {
        return;
      }
      const readMessages = messages.filter((m) => !(0, import_message.hasErrors)(m) && (0, import_message.isIncoming)(m));
      if (isLocalAction) {
        await import_readReceiptsJobQueue.readReceiptsJobQueue.addIfAllowedByUser(window.storage, readMessages.map((m) => ({
          messageId: m.id,
          senderE164: m.source,
          senderUuid: m.sourceUuid,
          timestamp: m.sent_at
        })));
      }
      await Promise.all(readMessages.map(async (m) => {
        const registered = window.MessageController.register(m.id, m);
        const shouldSave = await registered.queueAttachmentDownloads();
        if (shouldSave) {
          await window.Signal.Data.saveMessage(registered.attributes, {
            ourUuid
          });
        }
      }));
    } while (messages.length > 0);
  }
  async applyMessageRequestResponse(response, { fromSync = false, viaStorageServiceSync = false } = {}) {
    try {
      const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
      const isLocalAction = !fromSync && !viaStorageServiceSync;
      const currentMessageRequestState = this.get("messageRequestResponseType");
      const didResponseChange = response !== currentMessageRequestState;
      const wasPreviouslyAccepted = this.getAccepted();
      this.set({
        messageRequestResponseType: response
      });
      if (response === messageRequestEnum.ACCEPT) {
        this.unblock({ viaStorageServiceSync });
        this.enableProfileSharing({ viaStorageServiceSync });
        if (didResponseChange && !wasPreviouslyAccepted) {
          await this.handleReadAndDownloadAttachments({ isLocalAction });
        }
        if (isLocalAction) {
          const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
          const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
          const ourConversation = window.ConversationController.getOurConversationOrThrow();
          if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes) || (0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
            this.sendProfileKeyUpdate();
          } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes) && this.isMemberPending(ourACI)) {
            await this.modifyGroupV2({
              name: "promotePendingMember",
              usingCredentialsFrom: [ourConversation],
              createGroupChange: () => this.promotePendingMember(import_UUID.UUIDKind.ACI)
            });
          } else if (ourPNI && (0, import_whatTypeOfConversation.isGroupV2)(this.attributes) && this.isMemberPending(ourPNI)) {
            await this.modifyGroupV2({
              name: "promotePendingMember",
              usingCredentialsFrom: [ourConversation],
              createGroupChange: () => this.promotePendingMember(import_UUID.UUIDKind.PNI)
            });
          } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes) && this.isMember(ourACI)) {
            log.info("applyMessageRequestResponse/accept: Already a member of v2 group");
          } else {
            log.error("applyMessageRequestResponse/accept: Neither member nor pending member of v2 group");
          }
        }
      } else if (response === messageRequestEnum.BLOCK) {
        this.block({ viaStorageServiceSync });
        this.disableProfileSharing({ viaStorageServiceSync });
        if (isLocalAction) {
          if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
            await this.leaveGroup();
          } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
            await this.leaveGroupV2();
          }
        }
      } else if (response === messageRequestEnum.DELETE) {
        this.disableProfileSharing({ viaStorageServiceSync });
        await this.destroyMessages();
        this.updateLastMessage();
        if (isLocalAction) {
          this.trigger("unload", "deleted from message request");
          if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
            await this.leaveGroup();
          } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
            await this.leaveGroupV2();
          }
        }
      } else if (response === messageRequestEnum.BLOCK_AND_DELETE) {
        this.block({ viaStorageServiceSync });
        this.disableProfileSharing({ viaStorageServiceSync });
        await this.destroyMessages();
        this.updateLastMessage();
        if (isLocalAction) {
          this.trigger("unload", "blocked and deleted from message request");
          if ((0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
            await this.leaveGroup();
          } else if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
            await this.leaveGroupV2();
          }
        }
      }
    } finally {
      window.Signal.Data.updateConversation(this.attributes);
    }
  }
  async joinGroupV2ViaLinkAndMigrate({
    approvalRequired,
    inviteLinkPassword,
    revision
  }) {
    await window.Signal.Groups.joinGroupV2ViaLinkAndMigrate({
      approvalRequired,
      conversation: this,
      inviteLinkPassword,
      revision
    });
  }
  async joinGroupV2ViaLink({
    inviteLinkPassword,
    approvalRequired
  }) {
    const ourACI = window.textsecure.storage.user.getCheckedUuid();
    const ourConversation = window.ConversationController.getOurConversationOrThrow();
    try {
      if (approvalRequired) {
        await this.modifyGroupV2({
          name: "requestToJoin",
          usingCredentialsFrom: [ourConversation],
          inviteLinkPassword,
          createGroupChange: () => this.addPendingApprovalRequest()
        });
      } else {
        await this.modifyGroupV2({
          name: "joinGroup",
          usingCredentialsFrom: [ourConversation],
          inviteLinkPassword,
          createGroupChange: () => this.addMember(ourACI)
        });
      }
    } catch (error) {
      const ALREADY_REQUESTED_TO_JOIN = '{"code":400,"message":"cannot ask to join via invite link if already asked to join"}';
      if (!error.response) {
        throw error;
      } else {
        const errorDetails = Bytes.toString(error.response);
        if (errorDetails !== ALREADY_REQUESTED_TO_JOIN) {
          throw error;
        } else {
          log.info("joinGroupV2ViaLink: Got 400, but server is telling us we have already requested to join. Forcing that local state");
          this.set({
            pendingAdminApprovalV2: [
              {
                uuid: ourACI.toString(),
                timestamp: Date.now()
              }
            ]
          });
        }
      }
    }
    const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
    this.set({
      messageRequestResponseType: messageRequestEnum.ACCEPT,
      active_at: this.get("active_at") || Date.now()
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  async cancelJoinRequest() {
    const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
    const inviteLinkPassword = this.get("groupInviteLinkPassword");
    if (!inviteLinkPassword) {
      log.warn(`cancelJoinRequest/${this.idForLogging()}: We don't have an inviteLinkPassword!`);
    }
    await this.modifyGroupV2({
      name: "cancelJoinRequest",
      usingCredentialsFrom: [],
      inviteLinkPassword,
      createGroupChange: () => this.denyPendingApprovalRequest(ourACI)
    });
  }
  async addMembersV2(conversationIds) {
    await this.modifyGroupV2({
      name: "addMembersV2",
      usingCredentialsFrom: conversationIds.map((id) => window.ConversationController.get(id)).filter(import_isNotNil.isNotNil),
      createGroupChange: () => window.Signal.Groups.buildAddMembersChange(this.attributes, conversationIds)
    });
  }
  async updateGroupAttributesV2(attributes) {
    await this.modifyGroupV2({
      name: "updateGroupAttributesV2",
      usingCredentialsFrom: [],
      createGroupChange: () => window.Signal.Groups.buildUpdateAttributesChange({
        id: this.id,
        publicParams: this.get("publicParams"),
        revision: this.get("revision"),
        secretParams: this.get("secretParams")
      }, attributes)
    });
  }
  async leaveGroupV2() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
    const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
    const ourConversation = window.ConversationController.getOurConversationOrThrow();
    if (this.isMemberPending(ourACI)) {
      await this.modifyGroupV2({
        name: "delete",
        usingCredentialsFrom: [],
        createGroupChange: () => this.removePendingMember([ourACI])
      });
    } else if (this.isMember(ourACI)) {
      await this.modifyGroupV2({
        name: "delete",
        usingCredentialsFrom: [ourConversation],
        createGroupChange: () => this.removeMember(ourACI)
      });
    } else if (ourPNI && this.isMemberPending(ourPNI)) {
      await this.modifyGroupV2({
        name: "delete",
        usingCredentialsFrom: [],
        createGroupChange: () => this.removePendingMember([ourPNI])
      });
    } else {
      const logId = this.idForLogging();
      log.error(`leaveGroupV2: We were neither a member nor a pending member of the group ${logId}`);
    }
  }
  async addBannedMember(uuid) {
    if (this.isMember(uuid)) {
      log.warn("addBannedMember: Member is a part of the group!");
      return;
    }
    if (this.isMemberPending(uuid)) {
      log.warn("addBannedMember: Member is pending to be added to group!");
      return;
    }
    if (this.isMemberBanned(uuid)) {
      log.warn("addBannedMember: Member is already banned!");
      return;
    }
    return window.Signal.Groups.buildAddBannedMemberChange({
      group: this.attributes,
      uuid
    });
  }
  async blockGroupLinkRequests(uuid) {
    await this.modifyGroupV2({
      name: "addBannedMember",
      usingCredentialsFrom: [],
      createGroupChange: async () => this.addBannedMember(new import_UUID.UUID(uuid))
    });
  }
  async toggleAdmin(conversationId) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const logId = this.idForLogging();
    const member = window.ConversationController.get(conversationId);
    if (!member) {
      log.error(`toggleAdmin/${logId}: ${conversationId} does not exist`);
      return;
    }
    const uuid = member.getCheckedUuid(`toggleAdmin/${logId}`);
    if (!this.isMember(uuid)) {
      log.error(`toggleAdmin: Member ${conversationId} is not a member of the group`);
      return;
    }
    await this.modifyGroupV2({
      name: "toggleAdmin",
      usingCredentialsFrom: [member],
      createGroupChange: () => this.toggleAdminChange(uuid)
    });
  }
  async approvePendingMembershipFromGroupV2(conversationId) {
    const logId = this.idForLogging();
    const pendingMember = window.ConversationController.get(conversationId);
    if (!pendingMember) {
      throw new Error(`approvePendingMembershipFromGroupV2/${logId}: No conversation found for conversation ${conversationId}`);
    }
    const uuid = pendingMember.getCheckedUuid(`approvePendingMembershipFromGroupV2/${logId}`);
    if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes) && this.isMemberRequestingToJoin(uuid)) {
      await this.modifyGroupV2({
        name: "approvePendingApprovalRequest",
        usingCredentialsFrom: [pendingMember],
        createGroupChange: () => this.approvePendingApprovalRequest(uuid)
      });
    }
  }
  async revokePendingMembershipsFromGroupV2(conversationIds) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    if (conversationIds.length > 1) {
      const uuids = conversationIds.map((id) => {
        const uuid2 = window.ConversationController.get(id)?.getUuid();
        (0, import_assert.strictAssert)(uuid2, `UUID does not exist for ${id}`);
        return uuid2;
      });
      await this.modifyGroupV2({
        name: "removePendingMember",
        usingCredentialsFrom: [],
        createGroupChange: () => this.removePendingMember(uuids),
        extraConversationsForSend: conversationIds
      });
      return;
    }
    const [conversationId] = conversationIds;
    const pendingMember = window.ConversationController.get(conversationId);
    if (!pendingMember) {
      const logId = this.idForLogging();
      throw new Error(`revokePendingMembershipsFromGroupV2/${logId}: No conversation found for conversation ${conversationId}`);
    }
    const uuid = pendingMember.getCheckedUuid("revokePendingMembershipsFromGroupV2");
    if (this.isMemberRequestingToJoin(uuid)) {
      await this.modifyGroupV2({
        name: "denyPendingApprovalRequest",
        usingCredentialsFrom: [],
        createGroupChange: () => this.denyPendingApprovalRequest(uuid),
        extraConversationsForSend: [conversationId]
      });
    } else if (this.isMemberPending(uuid)) {
      await this.modifyGroupV2({
        name: "removePendingMember",
        usingCredentialsFrom: [],
        createGroupChange: () => this.removePendingMember([uuid]),
        extraConversationsForSend: [conversationId]
      });
    }
  }
  async removeFromGroupV2(conversationId) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const logId = this.idForLogging();
    const pendingMember = window.ConversationController.get(conversationId);
    if (!pendingMember) {
      throw new Error(`removeFromGroupV2/${logId}: No conversation found for conversation ${conversationId}`);
    }
    const uuid = pendingMember.getCheckedUuid(`removeFromGroupV2/${logId}`);
    if (this.isMemberRequestingToJoin(uuid)) {
      await this.modifyGroupV2({
        name: "denyPendingApprovalRequest",
        usingCredentialsFrom: [],
        createGroupChange: () => this.denyPendingApprovalRequest(uuid),
        extraConversationsForSend: [conversationId]
      });
    } else if (this.isMemberPending(uuid)) {
      await this.modifyGroupV2({
        name: "removePendingMember",
        usingCredentialsFrom: [],
        createGroupChange: () => this.removePendingMember([uuid]),
        extraConversationsForSend: [conversationId]
      });
    } else if (this.isMember(uuid)) {
      await this.modifyGroupV2({
        name: "removeFromGroup",
        usingCredentialsFrom: [pendingMember],
        createGroupChange: () => this.removeMember(uuid),
        extraConversationsForSend: [conversationId]
      });
    } else {
      log.error(`removeFromGroupV2: Member ${conversationId} is neither a member nor a pending member of the group`);
    }
  }
  async syncMessageRequestResponse(response) {
    await this.applyMessageRequestResponse(response);
    const groupId = this.getGroupIdBuffer();
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("syncMessageRequestResponse: We are primary device; not sending message request sync");
      return;
    }
    try {
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getMessageRequestResponseSync({
        threadE164: this.get("e164"),
        threadUuid: this.get("uuid"),
        groupId,
        type: response
      }));
    } catch (error) {
      log.error("syncMessageRequestResponse: Failed to queue sync message", Errors.toLogFormat(error));
    }
  }
  async safeGetVerified() {
    const uuid = this.getUuid();
    if (!uuid) {
      return window.textsecure.storage.protocol.VerifiedStatus.DEFAULT;
    }
    const promise = window.textsecure.storage.protocol.getVerified(uuid);
    return promise.catch(() => window.textsecure.storage.protocol.VerifiedStatus.DEFAULT);
  }
  async updateVerified() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      await this.initialPromise;
      const verified = await this.safeGetVerified();
      if (this.get("verified") !== verified) {
        this.set({ verified });
        window.Signal.Data.updateConversation(this.attributes);
      }
      return;
    }
    this.fetchContacts();
    await Promise.all(this.contactCollection.map(async (contact) => {
      if (!(0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        await contact.updateVerified();
      }
    }));
  }
  setVerifiedDefault(options) {
    const { DEFAULT } = this.verifiedEnum;
    return this.queueJob("setVerifiedDefault", () => this._setVerified(DEFAULT, options));
  }
  setVerified(options) {
    const { VERIFIED } = this.verifiedEnum;
    return this.queueJob("setVerified", () => this._setVerified(VERIFIED, options));
  }
  setUnverified(options) {
    const { UNVERIFIED } = this.verifiedEnum;
    return this.queueJob("setUnverified", () => this._setVerified(UNVERIFIED, options));
  }
  async _setVerified(verified, providedOptions) {
    const options = providedOptions || {};
    window._.defaults(options, {
      viaStorageServiceSync: false,
      key: null
    });
    const { VERIFIED, DEFAULT } = this.verifiedEnum;
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      throw new Error("You cannot verify a group conversation. You must verify individual contacts.");
    }
    const uuid = this.getUuid();
    const beginningVerified = this.get("verified");
    let keyChange = false;
    if (options.viaStorageServiceSync) {
      (0, import_assert.strictAssert)(uuid, `Sync message didn't update uuid for conversation: ${this.id}`);
      keyChange = await window.textsecure.storage.protocol.processVerifiedMessage(uuid, verified, options.key || void 0);
    } else if (uuid) {
      await window.textsecure.storage.protocol.setVerified(uuid, verified);
    } else {
      log.warn(`_setVerified(${this.id}): no uuid to update protocol storage`);
    }
    this.set({ verified });
    if (!options.viaStorageServiceSync) {
      window.Signal.Data.updateConversation(this.attributes);
    }
    if (!options.viaStorageServiceSync) {
      if (keyChange) {
        this.captureChange("keyChange");
      }
      if (beginningVerified !== verified) {
        this.captureChange(`verified from=${beginningVerified} to=${verified}`);
      }
    }
    const didVerifiedChange = beginningVerified !== verified;
    const isExplicitUserAction = !options.viaStorageServiceSync;
    const shouldShowFromStorageSync = options.viaStorageServiceSync && verified !== DEFAULT;
    if (didVerifiedChange && isExplicitUserAction || didVerifiedChange && shouldShowFromStorageSync || keyChange && verified === VERIFIED) {
      await this.addVerifiedChange(this.id, verified === VERIFIED, {
        local: isExplicitUserAction
      });
    }
    if (isExplicitUserAction && uuid) {
      await this.sendVerifySyncMessage(this.get("e164"), uuid, verified);
    }
    return keyChange;
  }
  async sendVerifySyncMessage(e164, uuid, state) {
    const identifier = uuid ? uuid.toString() : e164;
    if (!identifier) {
      throw new Error("sendVerifySyncMessage: Neither e164 nor UUID were provided");
    }
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("sendVerifySyncMessage: We are primary device; not sending sync");
      return;
    }
    const key = await window.textsecure.storage.protocol.loadIdentityKey(import_UUID.UUID.checkedLookup(identifier));
    if (!key) {
      throw new Error(`sendVerifySyncMessage: No identity key found for identifier ${identifier}`);
    }
    try {
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getVerificationSync(e164, uuid.toString(), state, key));
    } catch (error) {
      log.error("sendVerifySyncMessage: Failed to queue sync message", Errors.toLogFormat(error));
    }
  }
  isVerified() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return this.get("verified") === this.verifiedEnum.VERIFIED;
    }
    if (!this.contactCollection?.length) {
      return false;
    }
    return this.contactCollection?.every((contact) => {
      if ((0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        return true;
      }
      return contact.isVerified();
    });
  }
  isUnverified() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      const verified = this.get("verified");
      return verified !== this.verifiedEnum.VERIFIED && verified !== this.verifiedEnum.DEFAULT;
    }
    if (!this.contactCollection?.length) {
      return true;
    }
    return this.contactCollection?.some((contact) => {
      if ((0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        return false;
      }
      return contact.isUnverified();
    });
  }
  getUnverified() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return this.isUnverified() ? [this] : [];
    }
    return this.contactCollection?.filter((contact) => {
      if ((0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        return false;
      }
      return contact.isUnverified();
    }) || [];
  }
  async setApproved() {
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      throw new Error("You cannot set a group conversation as trusted. You must set individual contacts as trusted.");
    }
    const uuid = this.getUuid();
    if (!uuid) {
      log.warn(`setApproved(${this.id}): no uuid, ignoring`);
      return;
    }
    return window.textsecure.storage.protocol.setApproval(uuid, true);
  }
  safeIsUntrusted() {
    try {
      const uuid = this.getUuid();
      (0, import_assert.strictAssert)(uuid, `No uuid for conversation: ${this.id}`);
      return window.textsecure.storage.protocol.isUntrusted(uuid);
    } catch (err) {
      return false;
    }
  }
  isUntrusted() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return this.safeIsUntrusted();
    }
    if (!this.contactCollection.length) {
      return false;
    }
    return this.contactCollection.any((contact) => {
      if ((0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        return false;
      }
      return contact.safeIsUntrusted();
    });
  }
  getUntrusted() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      if (this.isUntrusted()) {
        return [this];
      }
      return [];
    }
    return this.contactCollection?.filter((contact) => {
      if ((0, import_whatTypeOfConversation.isMe)(contact.attributes)) {
        return false;
      }
      return contact.isUntrusted();
    }) || [];
  }
  getSentMessageCount() {
    return this.get("sentMessageCount") || 0;
  }
  getMessageRequestResponseType() {
    return this.get("messageRequestResponseType") || 0;
  }
  getAboutText() {
    if (!this.get("about")) {
      return void 0;
    }
    const emoji = this.get("aboutEmoji");
    const text = this.get("about");
    if (!emoji) {
      return text;
    }
    return window.i18n("message--getNotificationText--text-with-emoji", {
      text,
      emoji
    });
  }
  getAccepted() {
    return (0, import_isConversationAccepted.isConversationAccepted)(this.attributes);
  }
  onMemberVerifiedChange() {
    this.trigger("change:verified", this);
    this.trigger("change", this, { force: true });
  }
  async toggleVerified() {
    if (this.isVerified()) {
      return this.setVerifiedDefault();
    }
    return this.setVerified();
  }
  async addChatSessionRefreshed({
    receivedAt,
    receivedAtCounter
  }) {
    log.info(`addChatSessionRefreshed: adding for ${this.idForLogging()}`, {
      receivedAt
    });
    const message = {
      conversationId: this.id,
      type: "chat-session-refreshed",
      sent_at: receivedAt,
      received_at: receivedAtCounter,
      received_at_ms: receivedAt,
      readStatus: import_MessageReadStatus.ReadStatus.Unread,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    this.trigger("newmessage", model);
    this.updateUnread();
  }
  async addDeliveryIssue({
    receivedAt,
    receivedAtCounter,
    senderUuid,
    sentAt
  }) {
    log.info(`addDeliveryIssue: adding for ${this.idForLogging()}`, {
      sentAt,
      senderUuid
    });
    const message = {
      conversationId: this.id,
      type: "delivery-issue",
      sourceUuid: senderUuid,
      sent_at: receivedAt,
      received_at: receivedAtCounter,
      received_at_ms: receivedAt,
      readStatus: import_MessageReadStatus.ReadStatus.Unread,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    this.trigger("newmessage", model);
    await this.notify(model);
    this.updateUnread();
  }
  async addKeyChange(keyChangedId) {
    log.info("adding key change advisory for", this.idForLogging(), keyChangedId.toString(), this.get("timestamp"));
    const timestamp = Date.now();
    const message = {
      conversationId: this.id,
      type: "keychange",
      sent_at: this.get("timestamp"),
      received_at: window.Signal.Util.incrementMessageCounter(),
      received_at_ms: timestamp,
      key_changed: keyChangedId.toString(),
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen,
      schemaVersion: Message.VERSION_NEEDED_FOR_DISPLAY
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    const isUntrusted = await this.isUntrusted();
    this.trigger("newmessage", model);
    const uuid = this.get("uuid");
    if (isUntrusted && uuid) {
      window.reduxActions.calling.keyChanged({ uuid });
    }
  }
  async addVerifiedChange(verifiedChangeId, verified, options = { local: true }) {
    if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
      log.info("refusing to add verified change advisory for our own number");
      return;
    }
    const lastMessage = this.get("timestamp") || Date.now();
    log.info("adding verified change advisory for", this.idForLogging(), verifiedChangeId, lastMessage);
    const shouldBeUnseen = !options.local && !verified;
    const timestamp = Date.now();
    const message = {
      id: (0, import_uuid.v4)(),
      conversationId: this.id,
      local: Boolean(options.local),
      readStatus: shouldBeUnseen ? import_MessageReadStatus.ReadStatus.Unread : import_MessageReadStatus.ReadStatus.Read,
      received_at_ms: timestamp,
      received_at: window.Signal.Util.incrementMessageCounter(),
      seenStatus: shouldBeUnseen ? import_MessageSeenStatus.SeenStatus.Unseen : import_MessageSeenStatus.SeenStatus.Unseen,
      sent_at: lastMessage,
      timestamp,
      type: "verified-change",
      verified,
      verifiedChanged: verifiedChangeId
    };
    await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString(),
      forceSave: true
    });
    const model = window.MessageController.register(message.id, new window.Whisper.Message(message));
    this.trigger("newmessage", model);
    this.updateUnread();
    const uuid = this.getUuid();
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) && uuid) {
      window.ConversationController.getAllGroupsInvolvingUuid(uuid).then((groups) => {
        window._.forEach(groups, (group) => {
          group.addVerifiedChange(this.id, verified, options);
        });
      });
    }
  }
  async addCallHistory(callHistoryDetails, receivedAtCounter) {
    let timestamp;
    let unread;
    let detailsToSave;
    switch (callHistoryDetails.callMode) {
      case import_Calling.CallMode.Direct:
        timestamp = callHistoryDetails.endedTime;
        unread = !callHistoryDetails.wasDeclined && !callHistoryDetails.acceptedTime;
        detailsToSave = {
          ...callHistoryDetails,
          callMode: import_Calling.CallMode.Direct
        };
        break;
      case import_Calling.CallMode.Group:
        timestamp = callHistoryDetails.startedTime;
        unread = false;
        detailsToSave = callHistoryDetails;
        break;
      default:
        throw (0, import_missingCaseError.missingCaseError)(callHistoryDetails);
    }
    const message = {
      conversationId: this.id,
      type: "call-history",
      sent_at: timestamp,
      received_at: receivedAtCounter || window.Signal.Util.incrementMessageCounter(),
      received_at_ms: timestamp,
      readStatus: unread ? import_MessageReadStatus.ReadStatus.Unread : import_MessageReadStatus.ReadStatus.Read,
      seenStatus: unread ? import_MessageSeenStatus.SeenStatus.Unseen : import_MessageSeenStatus.SeenStatus.NotApplicable,
      callHistoryDetails: detailsToSave
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    this.trigger("newmessage", model);
    this.updateUnread();
  }
  async updateCallHistoryForGroupCall(eraId, creatorUuid) {
    const oldCachedEraId = this.cachedLatestGroupCallEraId;
    this.cachedLatestGroupCallEraId = eraId;
    const alreadyHasMessage = oldCachedEraId && oldCachedEraId === eraId || await window.Signal.Data.hasGroupCallHistoryMessage(this.id, eraId);
    if (alreadyHasMessage) {
      this.updateLastMessage();
      return false;
    }
    await this.addCallHistory({
      callMode: import_Calling.CallMode.Group,
      creatorUuid,
      eraId,
      startedTime: Date.now()
    }, void 0);
    return true;
  }
  async addProfileChange(profileChange, conversationId) {
    const now = Date.now();
    const message = {
      conversationId: this.id,
      type: "profile-change",
      sent_at: now,
      received_at: window.Signal.Util.incrementMessageCounter(),
      received_at_ms: now,
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: import_MessageSeenStatus.SeenStatus.NotApplicable,
      changedId: conversationId || this.id,
      profileChange
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    this.trigger("newmessage", model);
    const uuid = this.getUuid();
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) && uuid) {
      window.ConversationController.getAllGroupsInvolvingUuid(uuid).then((groups) => {
        window._.forEach(groups, (group) => {
          group.addProfileChange(profileChange, this.id);
        });
      });
    }
  }
  async addNotification(type, extra = {}) {
    const now = Date.now();
    const message = {
      conversationId: this.id,
      type,
      sent_at: now,
      received_at: window.Signal.Util.incrementMessageCounter(),
      received_at_ms: now,
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: import_MessageSeenStatus.SeenStatus.NotApplicable,
      ...extra
    };
    const id = await window.Signal.Data.saveMessage(message, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    const model = window.MessageController.register(id, new window.Whisper.Message({
      ...message,
      id
    }));
    this.trigger("newmessage", model);
    return id;
  }
  async maybeSetPendingUniversalTimer(hasUserInitiatedMessages) {
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return;
    }
    if (this.isSMSOnly()) {
      return;
    }
    if (hasUserInitiatedMessages) {
      await this.maybeRemoveUniversalTimer();
      return;
    }
    if (this.get("pendingUniversalTimer") || this.get("expireTimer")) {
      return;
    }
    const expireTimer = universalExpireTimer.get();
    if (!expireTimer) {
      return;
    }
    log.info(`maybeSetPendingUniversalTimer(${this.idForLogging()}): added notification`);
    const notificationId = await this.addNotification("universal-timer-notification");
    this.set("pendingUniversalTimer", notificationId);
  }
  async maybeApplyUniversalTimer() {
    if (!await this.maybeRemoveUniversalTimer()) {
      return;
    }
    if (this.get("expireTimer")) {
      return;
    }
    const expireTimer = universalExpireTimer.get();
    if (expireTimer) {
      log.info(`maybeApplyUniversalTimer(${this.idForLogging()}): applying timer`);
      await this.updateExpirationTimer(expireTimer, {
        reason: "maybeApplyUniversalTimer"
      });
    }
  }
  async maybeRemoveUniversalTimer() {
    const notificationId = this.get("pendingUniversalTimer");
    if (!notificationId) {
      return false;
    }
    this.set("pendingUniversalTimer", void 0);
    log.info(`maybeRemoveUniversalTimer(${this.idForLogging()}): removed notification`);
    const message = window.MessageController.getById(notificationId);
    if (message) {
      await window.Signal.Data.removeMessage(message.id);
    }
    return true;
  }
  async addChangeNumberNotification(oldValue, newValue) {
    const sourceUuid = this.getCheckedUuid("Change number notification without uuid");
    const { storage } = window.textsecure;
    if (storage.user.getOurUuidKind(sourceUuid) !== import_UUID.UUIDKind.Unknown) {
      log.info(`Conversation ${this.idForLogging()}: not adding change number notification for ourselves`);
      return;
    }
    log.info(`Conversation ${this.idForLogging()}: adding change number notification for ${sourceUuid.toString()} from ${oldValue} to ${newValue}`);
    const convos = [
      this,
      ...await window.ConversationController.getAllGroupsInvolvingUuid(sourceUuid)
    ];
    await Promise.all(convos.map((convo) => {
      return convo.addNotification("change-number-notification", {
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Unseen,
        sourceUuid: sourceUuid.toString()
      });
    }));
  }
  async onReadMessage(message, readAt) {
    return this.queueJob("onReadMessage", () => this.markRead(message.get("received_at"), {
      newestSentAt: message.get("sent_at"),
      sendReadReceipts: false,
      readAt
    }));
  }
  validate(attributes = this.attributes) {
    return (0, import_validateConversation.validateConversation)(attributes);
  }
  queueJob(name, callback) {
    this.jobQueue = this.jobQueue || new window.PQueue({ concurrency: 1 });
    const taskWithTimeout = (0, import_TaskWithTimeout.default)(callback, `conversation ${this.idForLogging()}`);
    const abortController = new AbortController();
    const { signal: abortSignal } = abortController;
    const queuedAt = Date.now();
    return this.jobQueue.add(async () => {
      const startedAt = Date.now();
      const waitTime = startedAt - queuedAt;
      if (waitTime > JOB_REPORTING_THRESHOLD_MS) {
        log.info(`Conversation job ${name} was blocked for ${waitTime}ms`);
      }
      try {
        return await taskWithTimeout(abortSignal);
      } catch (error) {
        abortController.abort();
        throw error;
      } finally {
        const duration = Date.now() - startedAt;
        if (duration > JOB_REPORTING_THRESHOLD_MS) {
          log.info(`Conversation job ${name} took ${duration}ms`);
        }
      }
    });
  }
  isAdmin(uuid) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const members = this.get("membersV2") || [];
    const member = members.find((x) => x.uuid === uuid.toString());
    if (!member) {
      return false;
    }
    const MEMBER_ROLES = import_protobuf.SignalService.Member.Role;
    return member.role === MEMBER_ROLES.ADMINISTRATOR;
  }
  getUuid() {
    try {
      const value = this.get("uuid");
      return value ? new import_UUID.UUID(value) : void 0;
    } catch (err) {
      log.warn(`getUuid(): failed to obtain conversation(${this.id}) uuid due to`, Errors.toLogFormat(err));
      return void 0;
    }
  }
  getCheckedUuid(reason) {
    const result = this.getUuid();
    (0, import_assert.strictAssert)(result !== void 0, reason);
    return result;
  }
  getMemberships() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return [];
    }
    const members = this.get("membersV2") || [];
    return members.map((member) => ({
      isAdmin: member.role === import_protobuf.SignalService.Member.Role.ADMINISTRATOR,
      uuid: member.uuid
    }));
  }
  getGroupLink() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return void 0;
    }
    if (!this.get("groupInviteLinkPassword")) {
      return void 0;
    }
    return window.Signal.Groups.buildGroupLink(this);
  }
  getPendingMemberships() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return [];
    }
    const members = this.get("pendingMembersV2") || [];
    return members.map((member) => ({
      addedByUserId: member.addedByUserId,
      uuid: member.uuid
    }));
  }
  getPendingApprovalMemberships() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return [];
    }
    const members = this.get("pendingAdminApprovalV2") || [];
    return members.map((member) => ({
      uuid: member.uuid
    }));
  }
  getBannedMemberships() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return [];
    }
    return (this.get("bannedMembersV2") || []).map((member) => member.uuid);
  }
  getMembers(options = {}) {
    return (0, import_lodash.compact)((0, import_getConversationMembers.getConversationMembers)(this.attributes, options).map((conversationAttrs) => window.ConversationController.get(conversationAttrs.id)));
  }
  canBeAnnouncementGroup() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    if (!(0, import_isAnnouncementGroupReady.isAnnouncementGroupReady)()) {
      return false;
    }
    return true;
  }
  getMemberIds() {
    const members = this.getMembers();
    return members.map((member) => member.id);
  }
  getMemberUuids() {
    const members = this.getMembers();
    return members.map((member) => {
      return member.getCheckedUuid("Group member without uuid");
    });
  }
  getRecipients({
    includePendingMembers,
    extraConversationsForSend
  } = {}) {
    return (0, import_getRecipients.getRecipients)(this.attributes, {
      includePendingMembers,
      extraConversationsForSend
    });
  }
  getMemberConversationIds() {
    return new Set((0, import_iterables.map)(this.getMembers(), (conversation) => conversation.id));
  }
  async getQuoteAttachment(attachments, preview, sticker) {
    if (attachments && attachments.length) {
      const attachmentsToUse = Array.from((0, import_iterables.take)(attachments, 1));
      const isGIFQuote = (0, import_Attachment.isGIF)(attachmentsToUse);
      return Promise.all((0, import_iterables.map)(attachmentsToUse, async (attachment) => {
        const { path, fileName, thumbnail, contentType } = attachment;
        if (!path) {
          return {
            contentType: isGIFQuote ? import_MIME.IMAGE_GIF : contentType,
            fileName: fileName || null,
            thumbnail: null
          };
        }
        return {
          contentType: isGIFQuote ? import_MIME.IMAGE_GIF : contentType,
          fileName: fileName || null,
          thumbnail: thumbnail ? {
            ...await loadAttachmentData(thumbnail),
            objectUrl: thumbnail.path ? getAbsoluteAttachmentPath(thumbnail.path) : void 0
          } : null
        };
      }));
    }
    if (preview && preview.length) {
      const previewImages = (0, import_iterables.collect)(preview, (prev) => prev.image);
      const previewImagesToUse = (0, import_iterables.take)(previewImages, 1);
      return Promise.all((0, import_iterables.map)(previewImagesToUse, async (image) => {
        const { contentType } = image;
        return {
          contentType,
          fileName: null,
          thumbnail: image ? {
            ...await loadAttachmentData(image),
            objectUrl: image.path ? getAbsoluteAttachmentPath(image.path) : void 0
          } : null
        };
      }));
    }
    if (sticker && sticker.data && sticker.data.path) {
      const { path, contentType } = sticker.data;
      return [
        {
          contentType,
          fileName: null,
          thumbnail: {
            ...await loadAttachmentData(sticker.data),
            objectUrl: path ? getAbsoluteAttachmentPath(path) : void 0
          }
        }
      ];
    }
    return [];
  }
  async makeQuote(quotedMessage) {
    const { getName } = EmbeddedContact;
    const contact = (0, import_helpers.getContact)(quotedMessage.attributes);
    const attachments = quotedMessage.get("attachments");
    const preview = quotedMessage.get("preview");
    const sticker = quotedMessage.get("sticker");
    const body = quotedMessage.get("body");
    const embeddedContact = quotedMessage.get("contact");
    const embeddedContactName = embeddedContact && embeddedContact.length > 0 ? getName(embeddedContact[0]) : "";
    return {
      authorUuid: contact.get("uuid"),
      attachments: (0, import_message.isTapToView)(quotedMessage.attributes) ? [{ contentType: import_MIME.IMAGE_JPEG, fileName: null }] : await this.getQuoteAttachment(attachments, preview, sticker),
      bodyRanges: quotedMessage.get("bodyRanges"),
      id: quotedMessage.get("sent_at"),
      isViewOnce: (0, import_message.isTapToView)(quotedMessage.attributes),
      isGiftBadge: (0, import_message.isGiftBadge)(quotedMessage.attributes),
      messageId: quotedMessage.get("id"),
      referencedMessageNotFound: false,
      text: body || embeddedContactName
    };
  }
  async sendStickerMessage(packId, stickerId) {
    const packData = Stickers.getStickerPack(packId);
    const stickerData = Stickers.getSticker(packId, stickerId);
    if (!stickerData || !packData) {
      log.warn(`Attempted to send nonexistent (${packId}, ${stickerId}) sticker!`);
      return;
    }
    const { key } = packData;
    const { emoji, path, width, height } = stickerData;
    const data = await readStickerData(path);
    let contentType;
    const sniffedMimeType = (0, import_sniffImageMimeType.sniffImageMimeType)(data);
    if (sniffedMimeType) {
      contentType = sniffedMimeType;
    } else {
      log.warn("sendStickerMessage: Unable to sniff sticker MIME type; falling back to WebP");
      contentType = import_MIME.IMAGE_WEBP;
    }
    const sticker = {
      packId,
      stickerId,
      packKey: key,
      emoji,
      data: {
        size: data.byteLength,
        data,
        contentType,
        width,
        height,
        blurHash: await window.imageToBlurHash(new Blob([data], {
          type: import_MIME.IMAGE_JPEG
        }))
      }
    };
    this.enqueueMessageForSend({
      body: void 0,
      attachments: [],
      sticker
    });
    window.reduxActions.stickers.useSticker(packId, stickerId);
  }
  async sendProfileKeyUpdate() {
    if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
      return;
    }
    if (!this.get("profileSharing")) {
      log.error("sendProfileKeyUpdate: profileSharing not enabled for conversation", this.idForLogging());
      return;
    }
    try {
      await import_conversationJobQueue.conversationJobQueue.add({
        type: import_conversationJobQueue.conversationQueueJobEnum.enum.ProfileKey,
        conversationId: this.id,
        revision: this.get("revision")
      });
    } catch (error) {
      log.error("sendProfileKeyUpdate: Failed to queue profile share", Errors.toLogFormat(error));
    }
  }
  async enqueueMessageForSend({
    attachments,
    body,
    contact,
    mentions,
    preview,
    quote,
    sticker
  }, {
    dontClearDraft,
    sendHQImages,
    storyId,
    timestamp,
    extraReduxActions
  } = {}) {
    if (this.isGroupV1AndDisabled()) {
      return;
    }
    const now = timestamp || Date.now();
    log.info("Sending message to conversation", this.idForLogging(), "with timestamp", now);
    this.clearTypingTimers();
    const mandatoryProfileSharingEnabled = window.Signal.RemoteConfig.isEnabled("desktop.mandatoryProfileSharing");
    await this.maybeApplyUniversalTimer();
    const expireTimer = this.get("expireTimer");
    const recipientMaybeConversations = (0, import_iterables.map)(this.getRecipients(), (identifier) => window.ConversationController.get(identifier));
    const recipientConversations = (0, import_iterables.filter)(recipientMaybeConversations, import_isNotNil.isNotNil);
    const recipientConversationIds = (0, import_iterables.concat)((0, import_iterables.map)(recipientConversations, (c) => c.id), [window.ConversationController.getOurConversationIdOrThrow()]);
    const attachmentsToSend = preview && preview.length ? [] : attachments;
    if (preview && preview.length) {
      attachments.forEach((attachment) => {
        if (attachment.path) {
          deleteAttachmentData(attachment.path);
        }
      });
    }
    const attributes = await upgradeMessageSchema({
      id: import_UUID.UUID.generate().toString(),
      timestamp: now,
      type: "outgoing",
      body,
      conversationId: this.id,
      contact,
      quote,
      preview,
      attachments: attachmentsToSend,
      sent_at: now,
      received_at: window.Signal.Util.incrementMessageCounter(),
      received_at_ms: now,
      expireTimer,
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: import_MessageSeenStatus.SeenStatus.NotApplicable,
      sticker,
      bodyRanges: mentions,
      sendHQImages,
      sendStateByConversationId: (0, import_iterables.zipObject)(recipientConversationIds, (0, import_iterables.repeat)({
        status: import_MessageSendState.SendStatus.Pending,
        updatedAt: now
      })),
      storyId
    });
    const model = new window.Whisper.Message(attributes);
    const message = window.MessageController.register(model.id, model);
    message.cachedOutgoingContactData = contact;
    message.cachedOutgoingPreviewData = preview;
    message.cachedOutgoingQuoteData = quote;
    message.cachedOutgoingStickerData = sticker;
    const dbStart = Date.now();
    (0, import_assert.strictAssert)(typeof message.attributes.timestamp === "number", "Expected a timestamp");
    await import_conversationJobQueue.conversationJobQueue.add({
      type: import_conversationJobQueue.conversationQueueJobEnum.enum.NormalMessage,
      conversationId: this.id,
      messageId: message.id,
      revision: this.get("revision")
    }, async (jobToInsert) => {
      log.info(`enqueueMessageForSend: saving message ${message.id} and job ${jobToInsert.id}`);
      await window.Signal.Data.saveMessage(message.attributes, {
        jobToInsert,
        forceSave: true,
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    });
    const dbDuration = Date.now() - dbStart;
    if (dbDuration > SEND_REPORTING_THRESHOLD_MS) {
      log.info(`ConversationModel(${this.idForLogging()}.sendMessage(${now}): db save took ${dbDuration}ms`);
    }
    const renderStart = Date.now();
    await this.beforeAddSingleMessage();
    this.isInReduxBatch = true;
    (0, import_react_redux.batch)(() => {
      try {
        const { clearUnreadMetrics } = window.reduxActions.conversations;
        clearUnreadMetrics(this.id);
        const enabledProfileSharing = Boolean(mandatoryProfileSharingEnabled && !this.get("profileSharing"));
        const unarchivedConversation = Boolean(this.get("isArchived"));
        this.doAddSingleMessage(model, { isJustSent: true });
        const draftProperties = dontClearDraft ? {} : {
          draft: null,
          draftTimestamp: null,
          lastMessage: model.getNotificationText(),
          lastMessageStatus: "sending"
        };
        this.set({
          ...draftProperties,
          ...enabledProfileSharing ? { profileSharing: true } : {},
          ...this.incrementSentMessageCount({ dry: true }),
          active_at: now,
          timestamp: now,
          ...unarchivedConversation ? { isArchived: false } : {}
        });
        if (enabledProfileSharing) {
          this.captureChange("enqueueMessageForSend/mandatoryProfileSharing");
        }
        if (unarchivedConversation) {
          this.captureChange("enqueueMessageForSend/unarchive");
        }
        extraReduxActions?.();
      } finally {
        this.isInReduxBatch = false;
      }
    });
    if (sticker) {
      await addStickerPackReference(model.id, sticker.packId);
    }
    const renderDuration = Date.now() - renderStart;
    if (renderDuration > SEND_REPORTING_THRESHOLD_MS) {
      log.info(`ConversationModel(${this.idForLogging()}.sendMessage(${now}): render save took ${renderDuration}ms`);
    }
    window.Signal.Data.updateConversation(this.attributes);
    return attributes;
  }
  isFromOrAddedByTrustedContact() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return Boolean(this.get("name")) || Boolean(this.get("profileSharing"));
    }
    const addedBy = this.get("addedBy");
    if (!addedBy) {
      return false;
    }
    const conv = window.ConversationController.get(addedBy);
    if (!conv) {
      return false;
    }
    return Boolean((0, import_whatTypeOfConversation.isMe)(conv.attributes) || conv.get("name") || conv.get("profileSharing"));
  }
  async updateLastMessage() {
    if (!this.id) {
      return;
    }
    const ourConversationId = window.ConversationController.getOurConversationId();
    if (!ourConversationId) {
      throw new Error("updateLastMessage: Failed to fetch ourConversationId");
    }
    const conversationId = this.id;
    const ourUuid = window.textsecure.storage.user.getCheckedUuid().toString();
    const stats = await window.Signal.Data.getConversationMessageStats({
      conversationId,
      isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes),
      ourUuid
    });
    this.queueJob("maybeSetPendingUniversalTimer", async () => this.maybeSetPendingUniversalTimer(stats.hasUserInitiatedMessages));
    const { preview, activity } = stats;
    let previewMessage;
    let activityMessage;
    if (preview) {
      previewMessage = window.MessageController.register(preview.id, preview);
    }
    if (activity) {
      activityMessage = window.MessageController.register(activity.id, activity);
    }
    if (this.hasDraft() && this.get("draftTimestamp") && (!previewMessage || previewMessage.get("sent_at") < this.get("draftTimestamp"))) {
      return;
    }
    const currentTimestamp = this.get("timestamp") || null;
    const timestamp = activityMessage ? activityMessage.get("sent_at") || activityMessage.get("received_at") || currentTimestamp : currentTimestamp;
    this.set({
      lastMessage: (previewMessage ? previewMessage.getNotificationText() : "") || "",
      lastMessageStatus: (previewMessage ? (0, import_message.getMessagePropStatus)(previewMessage.attributes, ourConversationId) : null) || null,
      timestamp,
      lastMessageDeletedForEveryone: previewMessage ? previewMessage.get("deletedForEveryone") : false
    });
    window.Signal.Data.updateConversation(this.attributes);
  }
  setArchived(isArchived) {
    const before = this.get("isArchived");
    this.set({ isArchived });
    window.Signal.Data.updateConversation(this.attributes);
    const after = this.get("isArchived");
    if (Boolean(before) !== Boolean(after)) {
      if (after) {
        this.unpin();
      }
      this.captureChange("isArchived");
    }
  }
  setMarkedUnread(markedUnread) {
    const previousMarkedUnread = this.get("markedUnread");
    this.set({ markedUnread });
    window.Signal.Data.updateConversation(this.attributes);
    if (Boolean(previousMarkedUnread) !== Boolean(markedUnread)) {
      this.captureChange("markedUnread");
    }
  }
  async refreshGroupLink() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const groupInviteLinkPassword = Bytes.toBase64(window.Signal.Groups.generateGroupInviteLinkPassword());
    log.info("refreshGroupLink for conversation", this.idForLogging());
    await this.modifyGroupV2({
      name: "updateInviteLinkPassword",
      usingCredentialsFrom: [],
      createGroupChange: async () => window.Signal.Groups.buildInviteLinkPasswordChange(this.attributes, groupInviteLinkPassword)
    });
    this.set({ groupInviteLinkPassword });
  }
  async toggleGroupLink(value) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const shouldCreateNewGroupLink = value && !this.get("groupInviteLinkPassword");
    const groupInviteLinkPassword = this.get("groupInviteLinkPassword") || Bytes.toBase64(window.Signal.Groups.generateGroupInviteLinkPassword());
    log.info("toggleGroupLink for conversation", this.idForLogging(), value);
    const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
    const addFromInviteLink = value ? ACCESS_ENUM.ANY : ACCESS_ENUM.UNSATISFIABLE;
    if (shouldCreateNewGroupLink) {
      await this.modifyGroupV2({
        name: "updateNewGroupLink",
        usingCredentialsFrom: [],
        createGroupChange: async () => window.Signal.Groups.buildNewGroupLinkChange(this.attributes, groupInviteLinkPassword, addFromInviteLink)
      });
    } else {
      await this.modifyGroupV2({
        name: "updateAccessControlAddFromInviteLink",
        usingCredentialsFrom: [],
        createGroupChange: async () => window.Signal.Groups.buildAccessControlAddFromInviteLinkChange(this.attributes, addFromInviteLink)
      });
    }
    this.set({
      accessControl: {
        addFromInviteLink,
        attributes: this.get("accessControl")?.attributes || ACCESS_ENUM.MEMBER,
        members: this.get("accessControl")?.members || ACCESS_ENUM.MEMBER
      }
    });
    if (shouldCreateNewGroupLink) {
      this.set({ groupInviteLinkPassword });
    }
  }
  async updateAccessControlAddFromInviteLink(value) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
    const addFromInviteLink = value ? ACCESS_ENUM.ADMINISTRATOR : ACCESS_ENUM.ANY;
    await this.modifyGroupV2({
      name: "updateAccessControlAddFromInviteLink",
      usingCredentialsFrom: [],
      createGroupChange: async () => window.Signal.Groups.buildAccessControlAddFromInviteLinkChange(this.attributes, addFromInviteLink)
    });
    this.set({
      accessControl: {
        addFromInviteLink,
        attributes: this.get("accessControl")?.attributes || ACCESS_ENUM.MEMBER,
        members: this.get("accessControl")?.members || ACCESS_ENUM.MEMBER
      }
    });
  }
  async updateAccessControlAttributes(value) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    await this.modifyGroupV2({
      name: "updateAccessControlAttributes",
      usingCredentialsFrom: [],
      createGroupChange: async () => window.Signal.Groups.buildAccessControlAttributesChange(this.attributes, value)
    });
    const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
    this.set({
      accessControl: {
        addFromInviteLink: this.get("accessControl")?.addFromInviteLink || ACCESS_ENUM.MEMBER,
        attributes: value,
        members: this.get("accessControl")?.members || ACCESS_ENUM.MEMBER
      }
    });
  }
  async updateAccessControlMembers(value) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return;
    }
    await this.modifyGroupV2({
      name: "updateAccessControlMembers",
      usingCredentialsFrom: [],
      createGroupChange: async () => window.Signal.Groups.buildAccessControlMembersChange(this.attributes, value)
    });
    const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
    this.set({
      accessControl: {
        addFromInviteLink: this.get("accessControl")?.addFromInviteLink || ACCESS_ENUM.MEMBER,
        attributes: this.get("accessControl")?.attributes || ACCESS_ENUM.MEMBER,
        members: value
      }
    });
  }
  async updateAnnouncementsOnly(value) {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes) || !this.canBeAnnouncementGroup()) {
      return;
    }
    await this.modifyGroupV2({
      name: "updateAnnouncementsOnly",
      usingCredentialsFrom: [],
      createGroupChange: async () => window.Signal.Groups.buildAnnouncementsOnlyChange(this.attributes, value)
    });
    this.set({ announcementsOnly: value });
  }
  async updateExpirationTimer(providedExpireTimer, {
    reason,
    receivedAt,
    receivedAtMS = Date.now(),
    sentAt: providedSentAt,
    source: providedSource,
    fromSync = false,
    isInitialSync = false,
    fromGroupUpdate = false
  }) {
    const isSetByOther = providedSource || providedSentAt !== void 0;
    if ((0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      if (isSetByOther) {
        throw new Error("updateExpirationTimer: GroupV2 timers are not updated this way");
      }
      await this.modifyGroupV2({
        name: "updateExpirationTimer",
        usingCredentialsFrom: [],
        createGroupChange: () => this.updateExpirationTimerInGroupV2(providedExpireTimer)
      });
      return false;
    }
    if (!isSetByOther && this.isGroupV1AndDisabled()) {
      throw new Error("updateExpirationTimer: GroupV1 is deprecated; cannot update expiration timer");
    }
    let expireTimer = providedExpireTimer;
    let source = providedSource;
    if (this.get("left")) {
      return false;
    }
    if (!expireTimer) {
      expireTimer = void 0;
    }
    if (this.get("expireTimer") === expireTimer || !expireTimer && !this.get("expireTimer")) {
      return null;
    }
    const logId = `updateExpirationTimer(${this.idForLogging()}, ${expireTimer || "disabled"}) source=${source ?? "?"} reason=${reason}`;
    log.info(`${logId}: updating`);
    if (!isSetByOther) {
      try {
        await import_conversationJobQueue.conversationJobQueue.add({
          type: import_conversationJobQueue.conversationQueueJobEnum.enum.DirectExpirationTimerUpdate,
          conversationId: this.id,
          expireTimer
        });
      } catch (error) {
        log.error(`${logId}: Failed to queue expiration timer update`, Errors.toLogFormat(error));
        throw error;
      }
    }
    source = source || window.ConversationController.getOurConversationId();
    this.set({ expireTimer });
    await this.maybeRemoveUniversalTimer();
    window.Signal.Data.updateConversation(this.attributes);
    const sentAt = (providedSentAt || receivedAtMS) - 1;
    const isNoteToSelf = (0, import_whatTypeOfConversation.isMe)(this.attributes);
    const shouldBeRead = isNoteToSelf || isInitialSync;
    const model = new window.Whisper.Message({
      conversationId: this.id,
      expirationTimerUpdate: {
        expireTimer,
        source,
        fromSync,
        fromGroupUpdate
      },
      flags: import_protobuf.SignalService.DataMessage.Flags.EXPIRATION_TIMER_UPDATE,
      readStatus: shouldBeRead ? import_MessageReadStatus.ReadStatus.Read : import_MessageReadStatus.ReadStatus.Unread,
      received_at_ms: receivedAtMS,
      received_at: receivedAt ?? window.Signal.Util.incrementMessageCounter(),
      seenStatus: shouldBeRead ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen,
      sent_at: sentAt,
      type: "timer-notification"
    });
    const id = await window.Signal.Data.saveMessage(model.attributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    model.set({ id });
    const message = window.MessageController.register(id, model);
    this.addSingleMessage(message);
    this.updateUnread();
    log.info(`${logId}: added a notification received_at=${model.get("received_at")}`);
    return message;
  }
  isSearchable() {
    return !this.get("left");
  }
  async leaveGroup() {
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("leaveGroup: Cannot leave v1 group when offline!");
    }
    if (!(0, import_whatTypeOfConversation.isGroupV1)(this.attributes)) {
      throw new Error(`leaveGroup: Group ${this.idForLogging()} is not GroupV1!`);
    }
    const now = Date.now();
    const groupId = this.get("groupId");
    if (!groupId) {
      throw new Error(`leaveGroup/${this.idForLogging()}: No groupId!`);
    }
    const groupIdentifiers = this.getRecipients();
    this.set({ left: true });
    window.Signal.Data.updateConversation(this.attributes);
    const model = new window.Whisper.Message({
      conversationId: this.id,
      group_update: { left: "You" },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      received_at_ms: now,
      received_at: window.Signal.Util.incrementMessageCounter(),
      seenStatus: import_MessageSeenStatus.SeenStatus.NotApplicable,
      sent_at: now,
      type: "group"
    });
    const id = await window.Signal.Data.saveMessage(model.attributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
    model.set({ id });
    const message = window.MessageController.register(model.id, model);
    this.addSingleMessage(message);
    const options = await (0, import_getSendOptions.getSendOptions)(this.attributes);
    message.send((0, import_handleMessageSend.handleMessageSend)(messaging.leaveGroup(groupId, groupIdentifiers, options), { messageIds: [], sendType: "legacyGroupChange" }));
  }
  async markRead(newestUnreadAt, options = {
    sendReadReceipts: true
  }) {
    await (0, import_markConversationRead.markConversationRead)(this.attributes, newestUnreadAt, options);
    await this.updateUnread();
  }
  async updateUnread() {
    const unreadCount = await window.Signal.Data.getTotalUnreadForConversation(this.id, {
      storyId: void 0,
      isGroup: (0, import_whatTypeOfConversation.isGroup)(this.attributes)
    });
    const prevUnreadCount = this.get("unreadCount");
    if (prevUnreadCount !== unreadCount) {
      this.set({ unreadCount });
      window.Signal.Data.updateConversation(this.attributes);
    }
  }
  async updateSharedGroups() {
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return;
    }
    if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
      return;
    }
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const theirUuid = this.getUuid();
    if (!theirUuid) {
      return;
    }
    const ourGroups = await window.ConversationController.getAllGroupsInvolvingUuid(ourUuid);
    const sharedGroups = ourGroups.filter((c) => c.hasMember(ourUuid) && c.hasMember(theirUuid)).sort((left, right) => (right.get("timestamp") || 0) - (left.get("timestamp") || 0));
    const sharedGroupNames = sharedGroups.map((conversation) => conversation.getTitle());
    this.set({ sharedGroupNames });
  }
  onChangeProfileKey() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      this.getProfiles();
    }
  }
  async getProfiles() {
    const conversations = this.getMembers();
    await Promise.all(conversations.map((conversation) => (0, import_getProfile.getProfile)(conversation.get("uuid"), conversation.get("e164"))));
  }
  async setEncryptedProfileName(encryptedName, decryptionKey) {
    if (!encryptedName) {
      return;
    }
    const { given, family } = (0, import_Crypto.decryptProfileName)(encryptedName, decryptionKey);
    const profileName = given ? Bytes.toString(given) : void 0;
    const profileFamilyName = family ? Bytes.toString(family) : void 0;
    const oldName = this.getProfileName();
    const hadPreviousName = Boolean(oldName);
    this.set({ profileName, profileFamilyName });
    const newName = this.getProfileName();
    const nameChanged = oldName !== newName;
    if (!(0, import_whatTypeOfConversation.isMe)(this.attributes) && hadPreviousName && nameChanged) {
      const change = {
        type: "name",
        oldName,
        newName
      };
      await this.addProfileChange(change);
    }
  }
  async setProfileAvatar(avatarPath, decryptionKey) {
    if ((0, import_whatTypeOfConversation.isMe)(this.attributes)) {
      if (avatarPath) {
        window.storage.put("avatarUrl", avatarPath);
      } else {
        window.storage.remove("avatarUrl");
      }
    }
    if (!avatarPath) {
      this.set({ profileAvatar: void 0 });
      return;
    }
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("setProfileAvatar: Cannot fetch avatar when offline!");
    }
    const avatar = await messaging.getAvatar(avatarPath);
    const decrypted = (0, import_Crypto.decryptProfile)(avatar, decryptionKey);
    if (decrypted) {
      const newAttributes = await Conversation.maybeUpdateProfileAvatar(this.attributes, decrypted, {
        writeNewAttachmentData,
        deleteAttachmentData,
        doesAttachmentExist
      });
      this.set(newAttributes);
    }
  }
  async setProfileKey(profileKey, { viaStorageServiceSync = false } = {}) {
    if (this.get("profileKey") !== profileKey) {
      log.info(`Setting sealedSender to UNKNOWN for conversation ${this.idForLogging()}`);
      this.set({
        profileKeyCredential: null,
        profileKeyCredentialExpiration: null,
        pniCredential: null,
        accessKey: null,
        sealedSender: import_SealedSender.SEALED_SENDER.UNKNOWN
      });
      this.set({ profileKey }, { silent: viaStorageServiceSync });
      if (!viaStorageServiceSync && profileKey) {
        this.captureChange("profileKey");
      }
      this.deriveAccessKeyIfNeeded();
      if (!viaStorageServiceSync) {
        window.Signal.Data.updateConversation(this.attributes);
      }
      return true;
    }
    return false;
  }
  hasProfileKeyCredentialExpired() {
    const profileKey = this.get("profileKey");
    if (!profileKey) {
      return false;
    }
    const profileKeyCredential = this.get("profileKeyCredential");
    const profileKeyCredentialExpiration = this.get("profileKeyCredentialExpiration");
    if (!profileKeyCredential) {
      return true;
    }
    if (!(0, import_lodash.isNumber)(profileKeyCredentialExpiration)) {
      const logId = this.idForLogging();
      log.warn(`hasProfileKeyCredentialExpired(${logId}): missing expiration`);
      return true;
    }
    const today = (0, import_timestamp.toDayMillis)(Date.now());
    return profileKeyCredentialExpiration <= today;
  }
  deriveAccessKeyIfNeeded() {
    const profileKey = this.get("profileKey");
    if (!profileKey) {
      return;
    }
    if (this.get("accessKey")) {
      return;
    }
    const profileKeyBuffer = Bytes.fromBase64(profileKey);
    const accessKeyBuffer = (0, import_Crypto.deriveAccessKey)(profileKeyBuffer);
    const accessKey = Bytes.toBase64(accessKeyBuffer);
    this.set({ accessKey });
  }
  deriveProfileKeyVersion() {
    const profileKey = this.get("profileKey");
    if (!profileKey) {
      return;
    }
    const uuid = this.get("uuid");
    if (!uuid) {
      return;
    }
    const lastProfile = this.get("lastProfile");
    if (lastProfile?.profileKey === profileKey) {
      return lastProfile.profileKeyVersion;
    }
    const profileKeyVersion = Util.zkgroup.deriveProfileKeyVersion(profileKey, uuid);
    if (!profileKeyVersion) {
      log.warn("deriveProfileKeyVersion: Failed to derive profile key version, clearing profile key.");
      this.setProfileKey(void 0);
      return;
    }
    return profileKeyVersion;
  }
  async updateLastProfile(oldValue, { profileKey, profileKeyVersion }) {
    const lastProfile = this.get("lastProfile");
    if (lastProfile !== oldValue) {
      return;
    }
    if (lastProfile?.profileKey === profileKey && lastProfile?.profileKeyVersion === profileKeyVersion) {
      return;
    }
    log.warn("ConversationModel.updateLastProfile: updating for", this.idForLogging());
    this.set({ lastProfile: { profileKey, profileKeyVersion } });
    await window.Signal.Data.updateConversation(this.attributes);
  }
  async removeLastProfile(oldValue) {
    if (this.get("lastProfile") !== oldValue) {
      return;
    }
    log.warn("ConversationModel.removeLastProfile: called for", this.idForLogging());
    this.set({
      lastProfile: void 0,
      about: void 0,
      aboutEmoji: void 0,
      profileAvatar: void 0
    });
    await window.Signal.Data.updateConversation(this.attributes);
  }
  hasMember(uuid) {
    const members = this.getMembers();
    return members.some((member) => member.get("uuid") === uuid.toString());
  }
  fetchContacts() {
    const members = this.getMembers();
    this.contactCollection.reset(members);
  }
  async destroyMessages() {
    this.set({
      lastMessage: null,
      timestamp: null,
      active_at: null,
      pendingUniversalTimer: void 0
    });
    window.Signal.Data.updateConversation(this.attributes);
    await window.Signal.Data.removeAllMessagesInConversation(this.id, {
      logId: this.idForLogging()
    });
  }
  getTitle() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      const username = this.get("username");
      return this.get("name") || this.getProfileName() || this.getNumber() || username && window.i18n("at-username", { username }) || window.i18n("unknownContact");
    }
    return this.get("name") || window.i18n("unknownGroup");
  }
  getProfileName() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return Util.combineNames(this.get("profileName"), this.get("profileFamilyName"));
    }
    return void 0;
  }
  getNumber() {
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return "";
    }
    const number = this.get("e164");
    try {
      const parsedNumber = window.libphonenumberInstance.parse(number);
      const regionCode = (0, import_libphonenumberUtil.getRegionCodeForNumber)(number);
      if (regionCode === window.storage.get("regionCode")) {
        return window.libphonenumberInstance.format(parsedNumber, window.libphonenumberFormat.NATIONAL);
      }
      return window.libphonenumberInstance.format(parsedNumber, window.libphonenumberFormat.INTERNATIONAL);
    } catch (e) {
      return number;
    }
  }
  getColor() {
    return (0, import_migrateColor.migrateColor)(this.get("color"));
  }
  getConversationColor() {
    return this.get("conversationColor");
  }
  getCustomColorData() {
    if (this.getConversationColor() !== "custom") {
      return {
        customColor: void 0,
        customColorId: void 0
      };
    }
    return {
      customColor: this.get("customColor"),
      customColorId: this.get("customColorId")
    };
  }
  getAvatarPath() {
    const shouldShowProfileAvatar = (0, import_whatTypeOfConversation.isMe)(this.attributes) || window.storage.get("preferContactAvatars") === false;
    const avatar = shouldShowProfileAvatar ? this.get("profileAvatar") || this.get("avatar") : this.get("avatar") || this.get("profileAvatar");
    return avatar?.path || void 0;
  }
  getAvatarHash() {
    const avatar = (0, import_whatTypeOfConversation.isMe)(this.attributes) ? this.get("profileAvatar") || this.get("avatar") : this.get("avatar") || this.get("profileAvatar");
    return avatar?.hash || void 0;
  }
  getAbsoluteAvatarPath() {
    const avatarPath = this.getAvatarPath();
    return avatarPath ? getAbsoluteAttachmentPath(avatarPath) : void 0;
  }
  getAbsoluteProfileAvatarPath() {
    const avatarPath = this.get("profileAvatar")?.path;
    return avatarPath ? getAbsoluteAttachmentPath(avatarPath) : void 0;
  }
  getAbsoluteUnblurredAvatarPath() {
    const unblurredAvatarPath = this.get("unblurredAvatarPath");
    return unblurredAvatarPath ? getAbsoluteAttachmentPath(unblurredAvatarPath) : void 0;
  }
  unblurAvatar() {
    const avatarPath = this.getAvatarPath();
    if (avatarPath) {
      this.set("unblurredAvatarPath", avatarPath);
    } else {
      this.unset("unblurredAvatarPath");
    }
  }
  canChangeTimer() {
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      return true;
    }
    if (this.isGroupV1AndDisabled()) {
      return false;
    }
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return true;
    }
    const accessControlEnum = import_protobuf.SignalService.AccessControl.AccessRequired;
    const accessControl = this.get("accessControl");
    const canAnyoneChangeTimer = accessControl && (accessControl.attributes === accessControlEnum.ANY || accessControl.attributes === accessControlEnum.MEMBER);
    if (canAnyoneChangeTimer) {
      return true;
    }
    return this.areWeAdmin();
  }
  canEditGroupInfo() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    if (this.get("left")) {
      return false;
    }
    return this.areWeAdmin() || this.get("accessControl")?.attributes === import_protobuf.SignalService.AccessControl.AccessRequired.MEMBER;
  }
  areWeAdmin() {
    if (!(0, import_whatTypeOfConversation.isGroupV2)(this.attributes)) {
      return false;
    }
    const memberEnum = import_protobuf.SignalService.Member.Role;
    const members = this.get("membersV2") || [];
    const ourUuid = window.textsecure.storage.user.getUuid()?.toString();
    const me = members.find((item) => item.uuid === ourUuid);
    if (!me) {
      return false;
    }
    return me.role === memberEnum.ADMINISTRATOR;
  }
  captureChange(logMessage) {
    log.info("storageService[captureChange]", logMessage, this.idForLogging());
    this.set({ needsStorageServiceSync: true });
    this.queueJob("captureChange", async () => {
      Services.storageServiceUploadJob();
    });
  }
  startMuteTimer({ viaStorageServiceSync = false } = {}) {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.muteTimer);
    this.muteTimer = void 0;
    const muteExpiresAt = this.get("muteExpiresAt");
    if ((0, import_lodash.isNumber)(muteExpiresAt) && muteExpiresAt < Number.MAX_SAFE_INTEGER) {
      const delay = muteExpiresAt - Date.now();
      if (delay <= 0) {
        this.setMuteExpiration(0, { viaStorageServiceSync });
        return;
      }
      this.muteTimer = setTimeout(() => this.setMuteExpiration(0), delay);
    }
  }
  toggleHideStories() {
    this.set({ hideStory: !this.get("hideStory") });
    this.captureChange("hideStory");
  }
  setMuteExpiration(muteExpiresAt = 0, { viaStorageServiceSync = false } = {}) {
    const prevExpiration = this.get("muteExpiresAt");
    if (prevExpiration === muteExpiresAt) {
      return;
    }
    this.set({ muteExpiresAt });
    this.startMuteTimer({ viaStorageServiceSync: true });
    if (!viaStorageServiceSync) {
      this.captureChange("mutedUntilTimestamp");
      window.Signal.Data.updateConversation(this.attributes);
    }
  }
  isMuted() {
    return (0, import_isConversationMuted.isConversationMuted)(this.attributes);
  }
  async notify(message, reaction) {
    if (!import_notifications.notificationService.isEnabled) {
      return;
    }
    if (this.isMuted()) {
      if (this.get("dontNotifyForMentionsIfMuted")) {
        return;
      }
      const ourUuid = window.textsecure.storage.user.getUuid()?.toString();
      const mentionsMe = (message.get("bodyRanges") || []).some((range) => range.mentionUuid && range.mentionUuid === ourUuid);
      if (!mentionsMe) {
        return;
      }
    }
    if (!(0, import_message.isIncoming)(message.attributes) && !reaction) {
      return;
    }
    const conversationId = this.id;
    const sender = reaction ? window.ConversationController.get(reaction.get("fromId")) : (0, import_helpers.getContact)(message.attributes);
    const senderName = sender ? sender.getTitle() : window.i18n("unknownContact");
    const senderTitle = (0, import_whatTypeOfConversation.isDirectConversation)(this.attributes) ? senderName : window.i18n("notificationSenderInGroup", {
      sender: senderName,
      group: this.getTitle()
    });
    let notificationIconUrl;
    const avatar = this.get("avatar") || this.get("profileAvatar");
    if (avatar && avatar.path) {
      notificationIconUrl = getAbsoluteAttachmentPath(avatar.path);
    } else if ((0, import_whatTypeOfConversation.isDirectConversation)(this.attributes)) {
      notificationIconUrl = await this.getIdenticon();
    } else {
      notificationIconUrl = void 0;
    }
    const messageJSON = message.toJSON();
    const messageId = message.id;
    const isExpiringMessage = Message.hasExpiration(messageJSON);
    import_notifications.notificationService.add({
      senderTitle,
      conversationId,
      notificationIconUrl,
      isExpiringMessage,
      message: message.getNotificationText(),
      messageId,
      reaction: reaction ? reaction.toJSON() : null
    });
  }
  async getIdenticon() {
    const color = this.getColor();
    const title = this.getTitle();
    const content = title && (0, import_getInitials.getInitials)(title) || "#";
    const cached = this.cachedIdenticon;
    if (cached && cached.content === content && cached.color === color) {
      return cached.url;
    }
    const url = await (0, import_createIdenticon.createIdenticon)(color, content);
    this.cachedIdenticon = { content, color, url };
    return url;
  }
  notifyTyping(options) {
    const { isTyping, senderId, fromMe, senderDevice } = options;
    if (fromMe) {
      return;
    }
    const sender = window.ConversationController.get(senderId);
    if (!sender) {
      return;
    }
    const senderUuid = sender.getUuid();
    if (!senderUuid) {
      return;
    }
    if (this.get("announcementsOnly") && !this.isAdmin(senderUuid)) {
      return;
    }
    const typingToken = `${senderId}.${senderDevice}`;
    this.contactTypingTimers = this.contactTypingTimers || {};
    const record = this.contactTypingTimers[typingToken];
    if (record) {
      clearTimeout(record.timer);
    }
    if (isTyping) {
      this.contactTypingTimers[typingToken] = this.contactTypingTimers[typingToken] || {
        timestamp: Date.now(),
        senderId,
        senderDevice
      };
      this.contactTypingTimers[typingToken].timer = setTimeout(this.clearContactTypingTimer.bind(this, typingToken), 15 * 1e3);
      if (!record) {
        this.trigger("change", this, { force: true });
      }
    } else {
      delete this.contactTypingTimers[typingToken];
      if (record) {
        this.trigger("change", this, { force: true });
      }
    }
  }
  clearContactTypingTimer(typingToken) {
    this.contactTypingTimers = this.contactTypingTimers || {};
    const record = this.contactTypingTimers[typingToken];
    if (record) {
      clearTimeout(record.timer);
      delete this.contactTypingTimers[typingToken];
      this.trigger("change", this, { force: true });
    }
  }
  pin() {
    if (this.get("isPinned")) {
      return;
    }
    log.info("pinning", this.idForLogging());
    const pinnedConversationIds = new Set(window.storage.get("pinnedConversationIds", new Array()));
    pinnedConversationIds.add(this.id);
    this.writePinnedConversations([...pinnedConversationIds]);
    this.set("isPinned", true);
    if (this.get("isArchived")) {
      this.set({ isArchived: false });
    }
    window.Signal.Data.updateConversation(this.attributes);
  }
  unpin() {
    if (!this.get("isPinned")) {
      return;
    }
    log.info("un-pinning", this.idForLogging());
    const pinnedConversationIds = new Set(window.storage.get("pinnedConversationIds", new Array()));
    pinnedConversationIds.delete(this.id);
    this.writePinnedConversations([...pinnedConversationIds]);
    this.set("isPinned", false);
    window.Signal.Data.updateConversation(this.attributes);
  }
  writePinnedConversations(pinnedConversationIds) {
    window.storage.put("pinnedConversationIds", pinnedConversationIds);
    const myId = window.ConversationController.getOurConversationId();
    const me = window.ConversationController.get(myId);
    if (me) {
      me.captureChange("pin");
    }
  }
  setDontNotifyForMentionsIfMuted(newValue) {
    const previousValue = Boolean(this.get("dontNotifyForMentionsIfMuted"));
    if (previousValue === newValue) {
      return;
    }
    this.set({ dontNotifyForMentionsIfMuted: newValue });
    window.Signal.Data.updateConversation(this.attributes);
    this.captureChange("dontNotifyForMentionsIfMuted");
  }
  acknowledgeGroupMemberNameCollisions(groupNameCollisions) {
    this.set("acknowledgedGroupNameCollisions", groupNameCollisions);
    window.Signal.Data.updateConversation(this.attributes);
  }
  onOpenStart() {
    log.info(`conversation ${this.idForLogging()} open start`);
    window.ConversationController.onConvoOpenStart(this.id);
  }
  onOpenComplete(startedAt) {
    const now = Date.now();
    const delta = now - startedAt;
    log.info(`conversation ${this.idForLogging()} open took ${delta}ms`);
    window.CI?.handleEvent("conversation:open", { delta });
  }
  async flushDebouncedUpdates() {
    try {
      await this.debouncedUpdateLastMessage?.flush();
    } catch (error) {
      const logId = this.idForLogging();
      log.error(`flushDebouncedUpdates(${logId}): got error`, Errors.toLogFormat(error));
    }
  }
}
window.Whisper.Conversation = ConversationModel;
window.Whisper.ConversationCollection = window.Backbone.Collection.extend({
  model: window.Whisper.Conversation,
  initialize() {
    this.eraseLookups();
    this.on("idUpdated", (model, idProp, oldValue) => {
      if (oldValue) {
        if (idProp === "e164") {
          delete this._byE164[oldValue];
        }
        if (idProp === "uuid") {
          delete this._byUuid[oldValue];
        }
        if (idProp === "pni") {
          delete this._byPni[oldValue];
        }
        if (idProp === "groupId") {
          delete this._byGroupId[oldValue];
        }
      }
      const e164 = model.get("e164");
      if (e164) {
        this._byE164[e164] = model;
      }
      const uuid = model.get("uuid");
      if (uuid) {
        this._byUuid[uuid] = model;
      }
      const pni = model.get("pni");
      if (pni) {
        this._byPni[pni] = model;
      }
      const groupId = model.get("groupId");
      if (groupId) {
        this._byGroupId[groupId] = model;
      }
    });
  },
  reset(models, options) {
    window.Backbone.Collection.prototype.reset.call(this, models, options);
    this.resetLookups();
  },
  resetLookups() {
    this.eraseLookups();
    this.generateLookups(this.models);
  },
  generateLookups(models) {
    models.forEach((model) => {
      const e164 = model.get("e164");
      if (e164) {
        const existing = this._byE164[e164];
        if (!existing || existing && !existing.get("uuid")) {
          this._byE164[e164] = model;
        }
      }
      const uuid = model.get("uuid");
      if (uuid) {
        const existing = this._byUuid[uuid];
        if (!existing || existing && !existing.get("e164")) {
          this._byUuid[uuid] = model;
        }
      }
      const pni = model.get("pni");
      if (pni) {
        const existing = this._byPni[pni];
        if (!existing || existing && !existing.get("uuid")) {
          this._byPni[pni] = model;
        }
      }
      const groupId = model.get("groupId");
      if (groupId) {
        this._byGroupId[groupId] = model;
      }
    });
  },
  eraseLookups() {
    this._byE164 = /* @__PURE__ */ Object.create(null);
    this._byUuid = /* @__PURE__ */ Object.create(null);
    this._byPni = /* @__PURE__ */ Object.create(null);
    this._byGroupId = /* @__PURE__ */ Object.create(null);
  },
  add(data) {
    let hydratedData;
    if (Array.isArray(data)) {
      hydratedData = [];
      for (let i = 0, max = data.length; i < max; i += 1) {
        const item = data[i];
        if ((0, import_lodash.has)(item, "get")) {
          hydratedData.push(item);
        } else {
          hydratedData.push(new window.Whisper.Conversation(item));
        }
      }
    } else if ((0, import_lodash.has)(data, "get")) {
      hydratedData = data;
    } else {
      hydratedData = new window.Whisper.Conversation(data);
    }
    this.generateLookups(Array.isArray(hydratedData) ? hydratedData : [hydratedData]);
    window.Backbone.Collection.prototype.add.call(this, hydratedData);
    return hydratedData;
  },
  get(id) {
    return this._byE164[id] || this._byE164[`+${id}`] || this._byUuid[id] || this._byPni[id] || this._byGroupId[id] || window.Backbone.Collection.prototype.get.call(this, id);
  },
  comparator(m) {
    return -(m.get("active_at") || 0);
  }
});
const sortConversationTitles = /* @__PURE__ */ __name((left, right, collator) => {
  return collator.compare(left.getTitle(), right.getTitle());
}, "sortConversationTitles");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationModel
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGNvbXBhY3QsIGhhcywgaXNOdW1iZXIsIHRocm90dGxlLCBkZWJvdW5jZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBiYXRjaCBhcyBiYXRjaERpc3BhdGNoIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgdjQgYXMgZ2VuZXJhdGVHdWlkIH0gZnJvbSAndXVpZCc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIENvbnZlcnNhdGlvbkxhc3RQcm9maWxlVHlwZSxcbiAgTGFzdE1lc3NhZ2VTdGF0dXMsXG4gIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgUXVvdGVkTWVzc2FnZVR5cGUsXG4gIFNlbmRlcktleUluZm9UeXBlLFxuICBWZXJpZmljYXRpb25PcHRpb25zLFxufSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB7IGdldEluaXRpYWxzIH0gZnJvbSAnLi4vdXRpbC9nZXRJbml0aWFscyc7XG5pbXBvcnQgeyBub3JtYWxpemVVdWlkIH0gZnJvbSAnLi4vdXRpbC9ub3JtYWxpemVVdWlkJztcbmltcG9ydCB7IGdldFJlZ2lvbkNvZGVGb3JOdW1iZXIgfSBmcm9tICcuLi91dGlsL2xpYnBob25lbnVtYmVyVXRpbCc7XG5pbXBvcnQgeyBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSB9IGZyb20gJy4uL3V0aWwvY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnknO1xuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSwgVGh1bWJuYWlsVHlwZSB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHsgdG9EYXlNaWxsaXMgfSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBpc0dJRiB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHR5cGUgeyBDYWxsSGlzdG9yeURldGFpbHNUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQ2FsbGluZyc7XG5pbXBvcnQgeyBDYWxsTW9kZSB9IGZyb20gJy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0ICogYXMgRW1iZWRkZWRDb250YWN0IGZyb20gJy4uL3R5cGVzL0VtYmVkZGVkQ29udGFjdCc7XG5pbXBvcnQgKiBhcyBDb252ZXJzYXRpb24gZnJvbSAnLi4vdHlwZXMvQ29udmVyc2F0aW9uJztcbmltcG9ydCB0eXBlIHsgU3RpY2tlclR5cGUsIFN0aWNrZXJXaXRoSHlkcmF0ZWREYXRhIH0gZnJvbSAnLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0ICogYXMgU3RpY2tlcnMgZnJvbSAnLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHR5cGUge1xuICBDb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyLFxuICBHcm91cFYxSW5mb1R5cGUsXG4gIEdyb3VwVjJJbmZvVHlwZSxcbn0gZnJvbSAnLi4vdGV4dHNlY3VyZS9TZW5kTWVzc2FnZSc7XG5pbXBvcnQgY3JlYXRlVGFza1dpdGhUaW1lb3V0IGZyb20gJy4uL3RleHRzZWN1cmUvVGFza1dpdGhUaW1lb3V0JztcbmltcG9ydCBNZXNzYWdlU2VuZGVyIGZyb20gJy4uL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuaW1wb3J0IHR5cGUgeyBDYWxsYmFja1Jlc3VsdFR5cGUgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1R5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIEF2YXRhckNvbG9yVHlwZSxcbiAgQ29udmVyc2F0aW9uQ29sb3JUeXBlLFxuICBDdXN0b21Db2xvclR5cGUsXG59IGZyb20gJy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgZ2V0Q29udGFjdCB9IGZyb20gJy4uL21lc3NhZ2VzL2hlbHBlcnMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25NdXRlZCB9IGZyb20gJy4uL3V0aWwvaXNDb252ZXJzYXRpb25NdXRlZCc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvblNNU09ubHkgfSBmcm9tICcuLi91dGlsL2lzQ29udmVyc2F0aW9uU01TT25seSc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCB9IGZyb20gJy4uL3V0aWwvaXNDb252ZXJzYXRpb25VbnJlZ2lzdGVyZWQnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgeyBzbmlmZkltYWdlTWltZVR5cGUgfSBmcm9tICcuLi91dGlsL3NuaWZmSW1hZ2VNaW1lVHlwZSc7XG5pbXBvcnQgeyBpc1ZhbGlkRTE2NCB9IGZyb20gJy4uL3V0aWwvaXNWYWxpZEUxNjQnO1xuaW1wb3J0IHR5cGUgeyBNSU1FVHlwZSB9IGZyb20gJy4uL3R5cGVzL01JTUUnO1xuaW1wb3J0IHsgSU1BR0VfSlBFRywgSU1BR0VfR0lGLCBJTUFHRV9XRUJQIH0gZnJvbSAnLi4vdHlwZXMvTUlNRSc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgZGVyaXZlQWNjZXNzS2V5LCBkZWNyeXB0UHJvZmlsZU5hbWUsIGRlY3J5cHRQcm9maWxlIH0gZnJvbSAnLi4vQ3J5cHRvJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB0eXBlIHsgQm9keVJhbmdlc1R5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IGdldFRleHRXaXRoTWVudGlvbnMgfSBmcm9tICcuLi91dGlsL2dldFRleHRXaXRoTWVudGlvbnMnO1xuaW1wb3J0IHsgbWlncmF0ZUNvbG9yIH0gZnJvbSAnLi4vdXRpbC9taWdyYXRlQ29sb3InO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuLi91dGlsL2lzTm90TmlsJztcbmltcG9ydCB7IGRyb3BOdWxsIH0gZnJvbSAnLi4vdXRpbC9kcm9wTnVsbCc7XG5pbXBvcnQgeyBub3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4uL3V0aWwvZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25BY2NlcHRlZCB9IGZyb20gJy4uL3V0aWwvaXNDb252ZXJzYXRpb25BY2NlcHRlZCc7XG5pbXBvcnQgeyBtYXJrQ29udmVyc2F0aW9uUmVhZCB9IGZyb20gJy4uL3V0aWwvbWFya0NvbnZlcnNhdGlvblJlYWQnO1xuaW1wb3J0IHsgaGFuZGxlTWVzc2FnZVNlbmQgfSBmcm9tICcuLi91dGlsL2hhbmRsZU1lc3NhZ2VTZW5kJztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvbk1lbWJlcnMgfSBmcm9tICcuLi91dGlsL2dldENvbnZlcnNhdGlvbk1lbWJlcnMnO1xuaW1wb3J0IHsgdXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwIH0gZnJvbSAnLi4vdXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwJztcbmltcG9ydCB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBTZW5kU3RhdHVzIH0gZnJvbSAnLi4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgdHlwZSB7IExpbmtQcmV2aWV3VHlwZSB9IGZyb20gJy4uL3R5cGVzL21lc3NhZ2UvTGlua1ByZXZpZXdzJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQge1xuICBjb25jYXQsXG4gIGZpbHRlcixcbiAgbWFwLFxuICB0YWtlLFxuICByZXBlYXQsXG4gIHppcE9iamVjdCxcbiAgY29sbGVjdCxcbn0gZnJvbSAnLi4vdXRpbC9pdGVyYWJsZXMnO1xuaW1wb3J0ICogYXMgdW5pdmVyc2FsRXhwaXJlVGltZXIgZnJvbSAnLi4vdXRpbC91bml2ZXJzYWxFeHBpcmVUaW1lcic7XG5pbXBvcnQgdHlwZSB7IEdyb3VwTmFtZUNvbGxpc2lvbnNXaXRoSWRzQnlUaXRsZSB9IGZyb20gJy4uL3V0aWwvZ3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9ucyc7XG5pbXBvcnQge1xuICBpc0RpcmVjdENvbnZlcnNhdGlvbixcbiAgaXNHcm91cCxcbiAgaXNHcm91cFYxLFxuICBpc0dyb3VwVjIsXG4gIGlzTWUsXG59IGZyb20gJy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0IHtcbiAgZ2V0TWVzc2FnZVByb3BTdGF0dXMsXG4gIGhhc0Vycm9ycyxcbiAgaXNHaWZ0QmFkZ2UsXG4gIGlzSW5jb21pbmcsXG4gIGlzU3RvcnksXG4gIGlzVGFwVG9WaWV3LFxufSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQge1xuICBjb252ZXJzYXRpb25Kb2JRdWV1ZSxcbiAgY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLFxufSBmcm9tICcuLi9qb2JzL2NvbnZlcnNhdGlvbkpvYlF1ZXVlJztcbmltcG9ydCB7IHJlYWRSZWNlaXB0c0pvYlF1ZXVlIH0gZnJvbSAnLi4vam9icy9yZWFkUmVjZWlwdHNKb2JRdWV1ZSc7XG5pbXBvcnQgdHlwZSB7IFJlYWN0aW9uTW9kZWwgfSBmcm9tICcuLi9tZXNzYWdlTW9kaWZpZXJzL1JlYWN0aW9ucyc7XG5pbXBvcnQgeyBpc0Fubm91bmNlbWVudEdyb3VwUmVhZHkgfSBmcm9tICcuLi91dGlsL2lzQW5ub3VuY2VtZW50R3JvdXBSZWFkeSc7XG5pbXBvcnQgeyBnZXRQcm9maWxlIH0gZnJvbSAnLi4vdXRpbC9nZXRQcm9maWxlJztcbmltcG9ydCB7IFNFQUxFRF9TRU5ERVIgfSBmcm9tICcuLi90eXBlcy9TZWFsZWRTZW5kZXInO1xuaW1wb3J0IHsgZ2V0QXZhdGFyRGF0YSB9IGZyb20gJy4uL3V0aWwvZ2V0QXZhdGFyRGF0YSc7XG5pbXBvcnQgeyBjcmVhdGVJZGVudGljb24gfSBmcm9tICcuLi91dGlsL2NyZWF0ZUlkZW50aWNvbic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBpc01lc3NhZ2VVbnJlYWQgfSBmcm9tICcuLi91dGlsL2lzTWVzc2FnZVVucmVhZCc7XG5pbXBvcnQgdHlwZSB7IFNlbmRlcktleVRhcmdldFR5cGUgfSBmcm9tICcuLi91dGlsL3NlbmRUb0dyb3VwJztcbmltcG9ydCB7IHNpbmdsZVByb3RvSm9iUXVldWUgfSBmcm9tICcuLi9qb2JzL3NpbmdsZVByb3RvSm9iUXVldWUnO1xuaW1wb3J0IHsgVGltZWxpbmVNZXNzYWdlTG9hZGluZ1N0YXRlIH0gZnJvbSAnLi4vdXRpbC90aW1lbGluZVV0aWwnO1xuaW1wb3J0IHsgU2VlblN0YXR1cyB9IGZyb20gJy4uL01lc3NhZ2VTZWVuU3RhdHVzJztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvbklkRm9yTG9nZ2luZyB9IGZyb20gJy4uL3V0aWwvaWRGb3JMb2dnaW5nJztcbmltcG9ydCB7IGdldFNlbmRUYXJnZXQgfSBmcm9tICcuLi91dGlsL2dldFNlbmRUYXJnZXQnO1xuaW1wb3J0IHsgZ2V0UmVjaXBpZW50cyB9IGZyb20gJy4uL3V0aWwvZ2V0UmVjaXBpZW50cyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUNvbnZlcnNhdGlvbiB9IGZyb20gJy4uL3V0aWwvdmFsaWRhdGVDb252ZXJzYXRpb24nO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtb3JlL25vLXRoZW4gKi9cbndpbmRvdy5XaGlzcGVyID0gd2luZG93LldoaXNwZXIgfHwge307XG5cbmNvbnN0IHsgU2VydmljZXMsIFV0aWwgfSA9IHdpbmRvdy5TaWduYWw7XG5jb25zdCB7IE1lc3NhZ2UgfSA9IHdpbmRvdy5TaWduYWwuVHlwZXM7XG5jb25zdCB7XG4gIGRlbGV0ZUF0dGFjaG1lbnREYXRhLFxuICBkb2VzQXR0YWNobWVudEV4aXN0LFxuICBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoLFxuICBsb2FkQXR0YWNobWVudERhdGEsXG4gIHJlYWRTdGlja2VyRGF0YSxcbiAgdXBncmFkZU1lc3NhZ2VTY2hlbWEsXG4gIHdyaXRlTmV3QXR0YWNobWVudERhdGEsXG59ID0gd2luZG93LlNpZ25hbC5NaWdyYXRpb25zO1xuY29uc3Qge1xuICBhZGRTdGlja2VyUGFja1JlZmVyZW5jZSxcbiAgZ2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZSxcbiAgZ2V0T2xkZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uLFxuICBnZXRNZXNzYWdlTWV0cmljc0ZvckNvbnZlcnNhdGlvbixcbiAgZ2V0TWVzc2FnZUJ5SWQsXG4gIGdldE5ld2VyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbixcbn0gPSB3aW5kb3cuU2lnbmFsLkRhdGE7XG5cbmNvbnN0IEZJVkVfTUlOVVRFUyA9IGR1cmF0aW9ucy5NSU5VVEUgKiA1O1xuXG5jb25zdCBKT0JfUkVQT1JUSU5HX1RIUkVTSE9MRF9NUyA9IDI1O1xuY29uc3QgU0VORF9SRVBPUlRJTkdfVEhSRVNIT0xEX01TID0gMjU7XG5cbmNvbnN0IE1FU1NBR0VfTE9BRF9DSFVOS19TSVpFID0gMzA7XG5cbmNvbnN0IEFUVFJJQlVURVNfVEhBVF9ET05UX0lOVkFMSURBVEVfUFJPUFNfQ0FDSEUgPSBuZXcgU2V0KFtcbiAgJ2xhc3RQcm9maWxlJyxcbiAgJ3Byb2ZpbGVMYXN0RmV0Y2hlZEF0JyxcbiAgJ25lZWRzU3RvcmFnZVNlcnZpY2VTeW5jJyxcbiAgJ3N0b3JhZ2VJRCcsXG4gICdzdG9yYWdlVmVyc2lvbicsXG4gICdzdG9yYWdlVW5rbm93bkZpZWxkcycsXG5dKTtcblxudHlwZSBDYWNoZWRJZGVudGljb24gPSB7XG4gIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICByZWFkb25seSBjb250ZW50OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNvbG9yOiBBdmF0YXJDb2xvclR5cGU7XG59O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uTW9kZWwgZXh0ZW5kcyB3aW5kb3cuQmFja2JvbmVcbiAgLk1vZGVsPENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlPiB7XG4gIHN0YXRpYyBDT0xPUlM6IHN0cmluZztcblxuICBjYWNoZWRQcm9wcz86IENvbnZlcnNhdGlvblR5cGUgfCBudWxsO1xuXG4gIG9sZENhY2hlZFByb3BzPzogQ29udmVyc2F0aW9uVHlwZSB8IG51bGw7XG5cbiAgY29udGFjdFR5cGluZ1RpbWVycz86IFJlY29yZDxcbiAgICBzdHJpbmcsXG4gICAgeyBzZW5kZXJJZDogc3RyaW5nOyB0aW1lcjogTm9kZUpTLlRpbWVyIH1cbiAgPjtcblxuICBjb250YWN0Q29sbGVjdGlvbj86IEJhY2tib25lLkNvbGxlY3Rpb248Q29udmVyc2F0aW9uTW9kZWw+O1xuXG4gIGRlYm91bmNlZFVwZGF0ZUxhc3RNZXNzYWdlPzogKCgpID0+IHZvaWQpICYgeyBmbHVzaCgpOiB2b2lkIH07XG5cbiAgaW5pdGlhbFByb21pc2U/OiBQcm9taXNlPHVua25vd24+O1xuXG4gIGluUHJvZ3Jlc3NGZXRjaD86IFByb21pc2U8dW5rbm93bj47XG5cbiAgbmV3TWVzc2FnZVF1ZXVlPzogdHlwZW9mIHdpbmRvdy5QUXVldWVUeXBlO1xuXG4gIGpvYlF1ZXVlPzogdHlwZW9mIHdpbmRvdy5QUXVldWVUeXBlO1xuXG4gIHN0b3JlTmFtZT86IHN0cmluZyB8IG51bGw7XG5cbiAgdGhyb3R0bGVkQnVtcFR5cGluZz86ICgpID0+IHZvaWQ7XG5cbiAgdGhyb3R0bGVkRmV0Y2hTTVNPbmx5VVVJRD86ICgpID0+IFByb21pc2U8dm9pZD4gfCB2b2lkO1xuXG4gIHRocm90dGxlZE1heWJlTWlncmF0ZVYxR3JvdXA/OiAoKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZDtcblxuICB0aHJvdHRsZWRHZXRQcm9maWxlcz86ICgpID0+IFByb21pc2U8dm9pZD47XG5cbiAgdHlwaW5nUmVmcmVzaFRpbWVyPzogTm9kZUpTLlRpbWVyIHwgbnVsbDtcblxuICB0eXBpbmdQYXVzZVRpbWVyPzogTm9kZUpTLlRpbWVyIHwgbnVsbDtcblxuICB2ZXJpZmllZEVudW0/OiB0eXBlb2Ygd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5WZXJpZmllZFN0YXR1cztcblxuICBpbnRsQ29sbGF0b3IgPSBuZXcgSW50bC5Db2xsYXRvcih1bmRlZmluZWQsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJyB9KTtcblxuICBsYXN0U3VjY2Vzc2Z1bEdyb3VwRmV0Y2g/OiBudW1iZXI7XG5cbiAgdGhyb3R0bGVkVXBkYXRlU2hhcmVkR3JvdXBzPzogKCkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNhY2hlZExhdGVzdEdyb3VwQ2FsbEVyYUlkPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgY2FjaGVkSWRlbnRpY29uPzogQ2FjaGVkSWRlbnRpY29uO1xuXG4gIHByaXZhdGUgaXNGZXRjaGluZ1VVSUQ/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgbGFzdElzVHlwaW5nPzogYm9vbGVhbjtcblxuICBwcml2YXRlIG11dGVUaW1lcj86IE5vZGVKUy5UaW1lcjtcblxuICBwcml2YXRlIGlzSW5SZWR1eEJhdGNoID0gZmFsc2U7XG5cbiAgb3ZlcnJpZGUgZGVmYXVsdHMoKTogUGFydGlhbDxDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZT4ge1xuICAgIHJldHVybiB7XG4gICAgICB1bnJlYWRDb3VudDogMCxcbiAgICAgIHZlcmlmaWVkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICBtZXNzYWdlQ291bnQ6IDAsXG4gICAgICBzZW50TWVzc2FnZUNvdW50OiAwLFxuICAgIH07XG4gIH1cblxuICBpZEZvckxvZ2dpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0Q29udmVyc2F0aW9uSWRGb3JMb2dnaW5nKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICAvLyBUaGlzIGlzIG9uZSBvZiB0aGUgZmV3IHRpbWVzIHRoYXQgd2Ugd2FudCB0byBjb2xsYXBzZSBvdXIgdXVpZC9lMTY0IHBhaXIgZG93biBpbnRvXG4gIC8vICAganVzdCBvbmUgYml0IG9mIGRhdGEuIElmIHdlIGhhdmUgYSBVVUlELCB3ZSdsbCBzZW5kIHVzaW5nIGl0LlxuICBnZXRTZW5kVGFyZ2V0KCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGdldFNlbmRUYXJnZXQodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGdldENvbnRhY3RDb2xsZWN0aW9uKCk6IEJhY2tib25lLkNvbGxlY3Rpb248Q29udmVyc2F0aW9uTW9kZWw+IHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gbmV3IHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uPENvbnZlcnNhdGlvbk1vZGVsPigpO1xuICAgIGNvbnN0IGNvbGxhdG9yID0gbmV3IEludGwuQ29sbGF0b3IodW5kZWZpbmVkLCB7IHNlbnNpdGl2aXR5OiAnYmFzZScgfSk7XG4gICAgY29sbGVjdGlvbi5jb21wYXJhdG9yID0gKFxuICAgICAgbGVmdDogQ29udmVyc2F0aW9uTW9kZWwsXG4gICAgICByaWdodDogQ29udmVyc2F0aW9uTW9kZWxcbiAgICApID0+IHtcbiAgICAgIHJldHVybiBjb2xsYXRvci5jb21wYXJlKGxlZnQuZ2V0VGl0bGUoKSwgcmlnaHQuZ2V0VGl0bGUoKSk7XG4gICAgfTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIG92ZXJyaWRlIGluaXRpYWxpemUoXG4gICAgYXR0cmlidXRlczogUGFydGlhbDxDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZT4gPSB7fVxuICApOiB2b2lkIHtcbiAgICBjb25zdCB1dWlkID0gdGhpcy5nZXQoJ3V1aWQnKTtcbiAgICBjb25zdCBub3JtYWxpemVkVXVpZCA9XG4gICAgICB1dWlkICYmIG5vcm1hbGl6ZVV1aWQodXVpZCwgJ0NvbnZlcnNhdGlvbk1vZGVsLmluaXRpYWxpemUnKTtcbiAgICBpZiAodXVpZCAmJiBub3JtYWxpemVkVXVpZCAhPT0gdXVpZCkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdDb252ZXJzYXRpb25Nb2RlbC5pbml0aWFsaXplOiBub3JtYWxpemluZyB1dWlkIGZyb20gJyArXG4gICAgICAgICAgYCR7dXVpZH0gdG8gJHtub3JtYWxpemVkVXVpZH1gXG4gICAgICApO1xuICAgICAgdGhpcy5zZXQoJ3V1aWQnLCBub3JtYWxpemVkVXVpZCk7XG4gICAgfVxuXG4gICAgaWYgKGlzVmFsaWRFMTY0KGF0dHJpYnV0ZXMuaWQsIGZhbHNlKSkge1xuICAgICAgdGhpcy5zZXQoeyBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksIGUxNjQ6IGF0dHJpYnV0ZXMuaWQgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9yZU5hbWUgPSAnY29udmVyc2F0aW9ucyc7XG5cbiAgICB0aGlzLnZlcmlmaWVkRW51bSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuVmVyaWZpZWRTdGF0dXM7XG5cbiAgICAvLyBUaGlzIG1heSBiZSBvdmVycmlkZGVuIGJ5IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlLCBhbmQgc2lnbmlmeVxuICAgIC8vICAgb3VyIGZpcnN0IHNhdmUgdG8gdGhlIGRhdGFiYXNlLiBPciBmaXJzdCBmZXRjaCBmcm9tIHRoZSBkYXRhYmFzZS5cbiAgICB0aGlzLmluaXRpYWxQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICB0aGlzLnRocm90dGxlZEJ1bXBUeXBpbmcgPSB0aHJvdHRsZSh0aGlzLmJ1bXBUeXBpbmcsIDMwMCk7XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGVMYXN0TWVzc2FnZSA9IGRlYm91bmNlKFxuICAgICAgdGhpcy51cGRhdGVMYXN0TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgMjAwXG4gICAgKTtcbiAgICB0aGlzLnRocm90dGxlZFVwZGF0ZVNoYXJlZEdyb3VwcyA9XG4gICAgICB0aGlzLnRocm90dGxlZFVwZGF0ZVNoYXJlZEdyb3VwcyB8fFxuICAgICAgdGhyb3R0bGUodGhpcy51cGRhdGVTaGFyZWRHcm91cHMuYmluZCh0aGlzKSwgRklWRV9NSU5VVEVTKTtcblxuICAgIHRoaXMuY29udGFjdENvbGxlY3Rpb24gPSB0aGlzLmdldENvbnRhY3RDb2xsZWN0aW9uKCk7XG4gICAgdGhpcy5jb250YWN0Q29sbGVjdGlvbi5vbihcbiAgICAgICdjaGFuZ2U6bmFtZSBjaGFuZ2U6cHJvZmlsZU5hbWUgY2hhbmdlOnByb2ZpbGVGYW1pbHlOYW1lIGNoYW5nZTplMTY0JyxcbiAgICAgIHRoaXMuZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2UsXG4gICAgICB0aGlzXG4gICAgKTtcbiAgICBpZiAoIWlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHRoaXMuY29udGFjdENvbGxlY3Rpb24ub24oXG4gICAgICAgICdjaGFuZ2U6dmVyaWZpZWQnLFxuICAgICAgICB0aGlzLm9uTWVtYmVyVmVyaWZpZWRDaGFuZ2UuYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uKCduZXdtZXNzYWdlJywgdGhpcy5vbk5ld01lc3NhZ2UpO1xuICAgIHRoaXMub24oJ2NoYW5nZTpwcm9maWxlS2V5JywgdGhpcy5vbkNoYW5nZVByb2ZpbGVLZXkpO1xuXG4gICAgY29uc3Qgc2VhbGVkU2VuZGVyID0gdGhpcy5nZXQoJ3NlYWxlZFNlbmRlcicpO1xuICAgIGlmIChzZWFsZWRTZW5kZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXQoeyBzZWFsZWRTZW5kZXI6IFNFQUxFRF9TRU5ERVIuVU5LTk9XTiB9KTtcbiAgICB9XG4gICAgdGhpcy51bnNldCgndW5pZGVudGlmaWVkRGVsaXZlcnknKTtcbiAgICB0aGlzLnVuc2V0KCd1bmlkZW50aWZpZWREZWxpdmVyeVVucmVzdHJpY3RlZCcpO1xuICAgIHRoaXMudW5zZXQoJ2hhc0ZldGNoZWRQcm9maWxlJyk7XG4gICAgdGhpcy51bnNldCgndG9rZW5zJyk7XG5cbiAgICB0aGlzLm9uKCdjaGFuZ2U6bWVtYmVycyBjaGFuZ2U6bWVtYmVyc1YyJywgdGhpcy5mZXRjaENvbnRhY3RzKTtcblxuICAgIHRoaXMudHlwaW5nUmVmcmVzaFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLnR5cGluZ1BhdXNlVGltZXIgPSBudWxsO1xuXG4gICAgLy8gV2UgY2xlYXIgb3VyIGNhY2hlZCBwcm9wcyB3aGVuZXZlciB3ZSBjaGFuZ2Ugc28gdGhhdCB0aGUgbmV4dCBjYWxsIHRvIGZvcm1hdCgpIHdpbGxcbiAgICAvLyAgIHJlc3VsdCBpbiByZWZyZXNoIHZpYSBhIGdldFByb3BzKCkgY2FsbC4gU2VlIGZvcm1hdCgpIGJlbG93LlxuICAgIHRoaXMub24oXG4gICAgICAnY2hhbmdlJyxcbiAgICAgIChfbW9kZWw6IE1lc3NhZ2VNb2RlbCwgb3B0aW9uczogeyBmb3JjZT86IGJvb2xlYW4gfSA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZWRLZXlzID0gT2JqZWN0LmtleXModGhpcy5jaGFuZ2VkIHx8IHt9KTtcbiAgICAgICAgY29uc3QgaXNQcm9wc0NhY2hlU3RpbGxWYWxpZCA9XG4gICAgICAgICAgIW9wdGlvbnMuZm9yY2UgJiZcbiAgICAgICAgICBCb29sZWFuKFxuICAgICAgICAgICAgY2hhbmdlZEtleXMubGVuZ3RoICYmXG4gICAgICAgICAgICAgIGNoYW5nZWRLZXlzLmV2ZXJ5KGtleSA9PlxuICAgICAgICAgICAgICAgIEFUVFJJQlVURVNfVEhBVF9ET05UX0lOVkFMSURBVEVfUFJPUFNfQ0FDSEUuaGFzKGtleSlcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIGlmIChpc1Byb3BzQ2FjaGVTdGlsbFZhbGlkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkUHJvcHMpIHtcbiAgICAgICAgICB0aGlzLm9sZENhY2hlZFByb3BzID0gdGhpcy5jYWNoZWRQcm9wcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlZFByb3BzID0gbnVsbDtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdwcm9wcy1jaGFuZ2UnLCB0aGlzLCB0aGlzLmlzSW5SZWR1eEJhdGNoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gU2V0IGBpc0ZldGNoaW5nVVVJRGAgZWFnZXJseSB0byBhdm9pZCBVSSBmbGlja2VyIHdoZW4gb3BlbmluZyB0aGVcbiAgICAvLyBjb252ZXJzYXRpb24gZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgIHRoaXMuaXNGZXRjaGluZ1VVSUQgPSB0aGlzLmlzU01TT25seSgpO1xuXG4gICAgdGhpcy50aHJvdHRsZWRGZXRjaFNNU09ubHlVVUlEID0gdGhyb3R0bGUoXG4gICAgICB0aGlzLmZldGNoU01TT25seVVVSUQuYmluZCh0aGlzKSxcbiAgICAgIEZJVkVfTUlOVVRFU1xuICAgICk7XG4gICAgdGhpcy50aHJvdHRsZWRNYXliZU1pZ3JhdGVWMUdyb3VwID0gdGhyb3R0bGUoXG4gICAgICB0aGlzLm1heWJlTWlncmF0ZVYxR3JvdXAuYmluZCh0aGlzKSxcbiAgICAgIEZJVkVfTUlOVVRFU1xuICAgICk7XG5cbiAgICBjb25zdCBtaWdyYXRlZENvbG9yID0gdGhpcy5nZXRDb2xvcigpO1xuICAgIGlmICh0aGlzLmdldCgnY29sb3InKSAhPT0gbWlncmF0ZWRDb2xvcikge1xuICAgICAgdGhpcy5zZXQoJ2NvbG9yJywgbWlncmF0ZWRDb2xvcik7XG4gICAgICAvLyBOb3Qgc2F2aW5nIHRoZSBjb252ZXJzYXRpb24gaGVyZSB3ZSdyZSBob3BpbmcgaXQnbGwgYmUgc2F2ZWQgZWxzZXdoZXJlXG4gICAgICAvLyB0aGlzIG1heSBjYXVzZSBzb21lIGNvbG9yIHRocmFzaGluZyBpZiBTaWduYWwgaXMgcmVzdGFydGVkIHdpdGhvdXRcbiAgICAgIC8vIHRoZSBjb252byBzYXZpbmcuIElmIHRoYXQgaXMgaW5kZWVkIHRoZSBjYXNlIGFuZCBpdCdzIHRvbyBkaXNydXB0aXZlXG4gICAgICAvLyB3ZSBzaG91bGQgYWRkIGJhdGNoZWQgc2F2aW5nLlxuICAgIH1cbiAgfVxuXG4gIHRvU2VuZGVyS2V5VGFyZ2V0KCk6IFNlbmRlcktleVRhcmdldFR5cGUge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRHcm91cElkOiAoKSA9PiB0aGlzLmdldCgnZ3JvdXBJZCcpLFxuICAgICAgZ2V0TWVtYmVyczogKCkgPT4gdGhpcy5nZXRNZW1iZXJzKCksXG4gICAgICBoYXNNZW1iZXI6ICh1dWlkOiBVVUlEU3RyaW5nVHlwZSkgPT4gdGhpcy5oYXNNZW1iZXIobmV3IFVVSUQodXVpZCkpLFxuICAgICAgaWRGb3JMb2dnaW5nOiAoKSA9PiB0aGlzLmlkRm9yTG9nZ2luZygpLFxuICAgICAgaXNHcm91cFYyOiAoKSA9PiBpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgIGlzVmFsaWQ6ICgpID0+IGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpLFxuXG4gICAgICBnZXRTZW5kZXJLZXlJbmZvOiAoKSA9PiB0aGlzLmdldCgnc2VuZGVyS2V5SW5mbycpLFxuICAgICAgc2F2ZVNlbmRlcktleUluZm86IGFzeW5jIChzZW5kZXJLZXlJbmZvOiBTZW5kZXJLZXlJbmZvVHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnNldCh7IHNlbmRlcktleUluZm8gfSk7XG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaXNNZW1iZXJSZXF1ZXN0aW5nVG9Kb2luKHV1aWQ6IFVVSUQpOiBib29sZWFuIHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlbmRpbmdBZG1pbkFwcHJvdmFsVjIgPSB0aGlzLmdldCgncGVuZGluZ0FkbWluQXBwcm92YWxWMicpO1xuXG4gICAgaWYgKCFwZW5kaW5nQWRtaW5BcHByb3ZhbFYyIHx8ICFwZW5kaW5nQWRtaW5BcHByb3ZhbFYyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBwZW5kaW5nQWRtaW5BcHByb3ZhbFYyLnNvbWUoaXRlbSA9PiBpdGVtLnV1aWQgPT09IHV1aWQudG9TdHJpbmcoKSk7XG4gIH1cblxuICBpc01lbWJlclBlbmRpbmcodXVpZDogVVVJRCk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVuZGluZ01lbWJlcnNWMiA9IHRoaXMuZ2V0KCdwZW5kaW5nTWVtYmVyc1YyJyk7XG5cbiAgICBpZiAoIXBlbmRpbmdNZW1iZXJzVjIgfHwgIXBlbmRpbmdNZW1iZXJzVjIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmdNZW1iZXJzVjIuc29tZShpdGVtID0+IGl0ZW0udXVpZCA9PT0gdXVpZC50b1N0cmluZygpKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNNZW1iZXJCYW5uZWQodXVpZDogVVVJRCk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgYmFubmVkTWVtYmVyc1YyID0gdGhpcy5nZXQoJ2Jhbm5lZE1lbWJlcnNWMicpO1xuXG4gICAgaWYgKCFiYW5uZWRNZW1iZXJzVjIgfHwgIWJhbm5lZE1lbWJlcnNWMi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFubmVkTWVtYmVyc1YyLnNvbWUobWVtYmVyID0+IG1lbWJlci51dWlkID09PSB1dWlkLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgaXNNZW1iZXJBd2FpdGluZ0FwcHJvdmFsKHV1aWQ6IFVVSUQpOiBib29sZWFuIHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlbmRpbmdBZG1pbkFwcHJvdmFsVjIgPSB0aGlzLmdldCgncGVuZGluZ0FkbWluQXBwcm92YWxWMicpO1xuXG4gICAgaWYgKCFwZW5kaW5nQWRtaW5BcHByb3ZhbFYyIHx8ICFwZW5kaW5nQWRtaW5BcHByb3ZhbFYyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBwZW5kaW5nQWRtaW5BcHByb3ZhbFYyLnNvbWUoXG4gICAgICBtZW1iZXIgPT4gbWVtYmVyLnV1aWQgPT09IHV1aWQudG9TdHJpbmcoKVxuICAgICk7XG4gIH1cblxuICBpc01lbWJlcih1dWlkOiBVVUlEKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBtZW1iZXJzVjIgPSB0aGlzLmdldCgnbWVtYmVyc1YyJyk7XG5cbiAgICBpZiAoIW1lbWJlcnNWMiB8fCAhbWVtYmVyc1YyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuXy5hbnkobWVtYmVyc1YyLCBpdGVtID0+IGl0ZW0udXVpZCA9PT0gdXVpZC50b1N0cmluZygpKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUV4cGlyYXRpb25UaW1lckluR3JvdXBWMihcbiAgICBzZWNvbmRzPzogbnVtYmVyXG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5nZXQoJ2V4cGlyZVRpbWVyJyk7XG4gICAgY29uc3QgYm90aEZhbHNleSA9IEJvb2xlYW4oY3VycmVudCkgPT09IGZhbHNlICYmIEJvb2xlYW4oc2Vjb25kcykgPT09IGZhbHNlO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IHNlY29uZHMgfHwgYm90aEZhbHNleSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGB1cGRhdGVFeHBpcmF0aW9uVGltZXJJbkdyb3VwVjIvJHtpZExvZ306IFJlcXVlc3RlZCB0aW1lciAke3NlY29uZHN9IGlzIHVuY2hhbmdlZCBmcm9tIGV4aXN0aW5nICR7Y3VycmVudH0uYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkRGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lckNoYW5nZSh7XG4gICAgICBleHBpcmVUaW1lcjogc2Vjb25kcyB8fCAwLFxuICAgICAgZ3JvdXA6IHRoaXMuYXR0cmlidXRlcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvbW90ZVBlbmRpbmdNZW1iZXIoXG4gICAgdXVpZEtpbmQ6IFVVSURLaW5kXG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcblxuICAgIGNvbnN0IHVzID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uT3JUaHJvdygpO1xuICAgIGNvbnN0IHV1aWQgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKHV1aWRLaW5kKTtcblxuICAgIC8vIFRoaXMgdXNlcidzIHBlbmRpbmcgc3RhdGUgbWF5IGhhdmUgY2hhbmdlZCBpbiB0aGUgdGltZSBiZXR3ZWVuIHRoZSB1c2VyJ3NcbiAgICAvLyAgIGJ1dHRvbiBwcmVzcyBhbmQgd2hlbiB3ZSBnZXQgaGVyZS4gSXQncyBlc3BlY2lhbGx5IGltcG9ydGFudCB0byBjaGVjayBoZXJlXG4gICAgLy8gICBpbiBjb25mbGljdC9yZXRyeSBjYXNlcy5cbiAgICBpZiAoIXRoaXMuaXNNZW1iZXJQZW5kaW5nKHV1aWQpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHByb21vdGVQZW5kaW5nTWVtYmVyLyR7aWRMb2d9OiB3ZSBhcmUgbm90IGEgcGVuZGluZyBtZW1iZXIgb2YgZ3JvdXAuIFJldHVybmluZyBlYXJseS5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRoZSB1c2VyJ3MgcHJvZmlsZUtleUNyZWRlbnRpYWwsIHdoaWNoIHJlcXVpcmVzIGEgcm91bmR0cmlwIHdpdGggdGhlXG4gICAgLy8gICBzZXJ2ZXIsIGFuZCBtb3N0IGRlZmluaXRlbHkgdGhlaXIgcHJvZmlsZUtleS4gQSBnZXRQcm9maWxlcygpIGNhbGwgd2lsbFxuICAgIC8vICAgZW5zdXJlIHRoYXQgd2UgaGF2ZSBhcyBtdWNoIGFzIHdlIGNhbiBnZXQgd2l0aCB0aGUgZGF0YSB3ZSBoYXZlLlxuICAgIGlmICh1dWlkS2luZCA9PT0gVVVJREtpbmQuQUNJKSB7XG4gICAgICBpZiAoIXVzLmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKSkge1xuICAgICAgICBhd2FpdCB1cy5nZXRQcm9maWxlcygpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCA9IHVzLmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKTtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgICAgICdNdXN0IGhhdmUgcHJvZmlsZUtleUNyZWRlbnRpYWwnXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gd2luZG93LlNpZ25hbC5Hcm91cHMuYnVpbGRQcm9tb3RlTWVtYmVyQ2hhbmdlKHtcbiAgICAgICAgZ3JvdXA6IHRoaXMuYXR0cmlidXRlcyxcbiAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NDogd2luZG93LmdldFNlcnZlclB1YmxpY1BhcmFtcygpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RyaWN0QXNzZXJ0KHV1aWRLaW5kID09PSBVVUlES2luZC5QTkksICdNdXN0IGJlIGEgUE5JIHByb21vdGlvbicpO1xuXG4gICAgLy8gU2ltaWxhcmx5IHdlIG5lZWQgYHBuaUNyZWRlbnRpYWxgIGV2ZW4gaWYgdGhpcyB3b3VsZCByZXF1aXJlIGEgc2VydmVyXG4gICAgLy8gcm91bmR0cmlwLlxuICAgIGlmICghdXMuZ2V0KCdwbmlDcmVkZW50aWFsJykpIHtcbiAgICAgIGF3YWl0IHVzLmdldFByb2ZpbGVzKCk7XG4gICAgfVxuICAgIGNvbnN0IHBuaUNyZWRlbnRpYWxCYXNlNjQgPSB1cy5nZXQoJ3BuaUNyZWRlbnRpYWwnKTtcbiAgICBzdHJpY3RBc3NlcnQocG5pQ3JlZGVudGlhbEJhc2U2NCwgJ011c3QgaGF2ZSBwbmlDcmVkZW50aWFsJyk7XG5cbiAgICByZXR1cm4gd2luZG93LlNpZ25hbC5Hcm91cHMuYnVpbGRQcm9tb3RlTWVtYmVyQ2hhbmdlKHtcbiAgICAgIGdyb3VwOiB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICBwbmlDcmVkZW50aWFsQmFzZTY0LFxuICAgICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0OiB3aW5kb3cuZ2V0U2VydmVyUHVibGljUGFyYW1zKCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcHJvdmVQZW5kaW5nQXBwcm92YWxSZXF1ZXN0KFxuICAgIHV1aWQ6IFVVSURcbiAgKTogUHJvbWlzZTxQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgaWRMb2cgPSB0aGlzLmlkRm9yTG9nZ2luZygpO1xuXG4gICAgLy8gVGhpcyB1c2VyJ3MgcGVuZGluZyBzdGF0ZSBtYXkgaGF2ZSBjaGFuZ2VkIGluIHRoZSB0aW1lIGJldHdlZW4gdGhlIHVzZXInc1xuICAgIC8vICAgYnV0dG9uIHByZXNzIGFuZCB3aGVuIHdlIGdldCBoZXJlLiBJdCdzIGVzcGVjaWFsbHkgaW1wb3J0YW50IHRvIGNoZWNrIGhlcmVcbiAgICAvLyAgIGluIGNvbmZsaWN0L3JldHJ5IGNhc2VzLlxuICAgIGlmICghdGhpcy5pc01lbWJlclJlcXVlc3RpbmdUb0pvaW4odXVpZCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgYXBwcm92ZVBlbmRpbmdBcHByb3ZhbFJlcXVlc3QvJHtpZExvZ306ICR7dXVpZH0gaXMgbm90IHJlcXVlc3RpbmcgYCArXG4gICAgICAgICAgJ3RvIGpvaW4gdGhlIGdyb3VwLiBSZXR1cm5pbmcgZWFybHkuJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkUHJvbW90ZVBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlKHtcbiAgICAgIGdyb3VwOiB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICB1dWlkLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkZW55UGVuZGluZ0FwcHJvdmFsUmVxdWVzdChcbiAgICB1dWlkOiBVVUlEXG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcblxuICAgIC8vIFRoaXMgdXNlcidzIHBlbmRpbmcgc3RhdGUgbWF5IGhhdmUgY2hhbmdlZCBpbiB0aGUgdGltZSBiZXR3ZWVuIHRoZSB1c2VyJ3NcbiAgICAvLyAgIGJ1dHRvbiBwcmVzcyBhbmQgd2hlbiB3ZSBnZXQgaGVyZS4gSXQncyBlc3BlY2lhbGx5IGltcG9ydGFudCB0byBjaGVjayBoZXJlXG4gICAgLy8gICBpbiBjb25mbGljdC9yZXRyeSBjYXNlcy5cbiAgICBpZiAoIXRoaXMuaXNNZW1iZXJSZXF1ZXN0aW5nVG9Kb2luKHV1aWQpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGRlbnlQZW5kaW5nQXBwcm92YWxSZXF1ZXN0LyR7aWRMb2d9OiAke3V1aWR9IGlzIG5vdCByZXF1ZXN0aW5nIGAgK1xuICAgICAgICAgICd0byBqb2luIHRoZSBncm91cC4gUmV0dXJuaW5nIGVhcmx5LidcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZERlbGV0ZVBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlKHtcbiAgICAgIGdyb3VwOiB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICBvdXJVdWlkLFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGFkZFBlbmRpbmdBcHByb3ZhbFJlcXVlc3QoKTogUHJvbWlzZTxcbiAgICBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHwgdW5kZWZpbmVkXG4gID4ge1xuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcblxuICAgIC8vIEhhcmQtY29kZWQgdG8gb3VyIG93biBJRCwgYmVjYXVzZSB5b3UgZG9uJ3QgYWRkIG90aGVyIHVzZXJzIGZvciBhZG1pbiBhcHByb3ZhbFxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID1cbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpO1xuXG4gICAgY29uc3QgdG9SZXF1ZXN0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoIXRvUmVxdWVzdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgYWRkUGVuZGluZ0FwcHJvdmFsUmVxdWVzdC8ke2lkTG9nfTogTm8gY29udmVyc2F0aW9uIGZvdW5kIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSB0b1JlcXVlc3QuZ2V0Q2hlY2tlZFV1aWQoYGFkZFBlbmRpbmdBcHByb3ZhbFJlcXVlc3QvJHtpZExvZ31gKTtcblxuICAgIC8vIFdlIG5lZWQgdGhlIHVzZXIncyBwcm9maWxlS2V5Q3JlZGVudGlhbCwgd2hpY2ggcmVxdWlyZXMgYSByb3VuZHRyaXAgd2l0aCB0aGVcbiAgICAvLyAgIHNlcnZlciwgYW5kIG1vc3QgZGVmaW5pdGVseSB0aGVpciBwcm9maWxlS2V5LiBBIGdldFByb2ZpbGVzKCkgY2FsbCB3aWxsXG4gICAgLy8gICBlbnN1cmUgdGhhdCB3ZSBoYXZlIGFzIG11Y2ggYXMgd2UgY2FuIGdldCB3aXRoIHRoZSBkYXRhIHdlIGhhdmUuXG4gICAgbGV0IHByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0ID0gdG9SZXF1ZXN0LmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKTtcbiAgICBpZiAoIXByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0KSB7XG4gICAgICBhd2FpdCB0b1JlcXVlc3QuZ2V0UHJvZmlsZXMoKTtcblxuICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQgPSB0b1JlcXVlc3QuZ2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpO1xuICAgICAgaWYgKCFwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYHByb21vdGVQZW5kaW5nTWVtYmVyLyR7aWRMb2d9OiBObyBwcm9maWxlS2V5Q3JlZGVudGlhbCBmb3IgY29udmVyc2F0aW9uICR7dG9SZXF1ZXN0LmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIHVzZXIncyBwZW5kaW5nIHN0YXRlIG1heSBoYXZlIGNoYW5nZWQgaW4gdGhlIHRpbWUgYmV0d2VlbiB0aGUgdXNlcidzXG4gICAgLy8gICBidXR0b24gcHJlc3MgYW5kIHdoZW4gd2UgZ2V0IGhlcmUuIEl0J3MgZXNwZWNpYWxseSBpbXBvcnRhbnQgdG8gY2hlY2sgaGVyZVxuICAgIC8vICAgaW4gY29uZmxpY3QvcmV0cnkgY2FzZXMuXG4gICAgaWYgKHRoaXMuaXNNZW1iZXJBd2FpdGluZ0FwcHJvdmFsKHV1aWQpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFkZFBlbmRpbmdBcHByb3ZhbFJlcXVlc3QvJHtpZExvZ306IGAgK1xuICAgICAgICAgIGAke3RvUmVxdWVzdC5pZEZvckxvZ2dpbmcoKX0gYWxyZWFkeSBpbiBwZW5kaW5nIGFwcHJvdmFsLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEFkZFBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlKHtcbiAgICAgIGdyb3VwOiB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCxcbiAgICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NDogd2luZG93LmdldFNlcnZlclB1YmxpY1BhcmFtcygpLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgYWRkTWVtYmVyKHV1aWQ6IFVVSUQpOiBQcm9taXNlPFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBpZExvZyA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG5cbiAgICBjb25zdCB0b1JlcXVlc3QgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQodXVpZC50b1N0cmluZygpKTtcbiAgICBpZiAoIXRvUmVxdWVzdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBhZGRNZW1iZXIvJHtpZExvZ306IE5vIGNvbnZlcnNhdGlvbiBmb3VuZCBmb3IgJHt1dWlkfWApO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdGhlIHVzZXIncyBwcm9maWxlS2V5Q3JlZGVudGlhbCwgd2hpY2ggcmVxdWlyZXMgYSByb3VuZHRyaXAgd2l0aCB0aGVcbiAgICAvLyAgIHNlcnZlciwgYW5kIG1vc3QgZGVmaW5pdGVseSB0aGVpciBwcm9maWxlS2V5LiBBIGdldFByb2ZpbGVzKCkgY2FsbCB3aWxsXG4gICAgLy8gICBlbnN1cmUgdGhhdCB3ZSBoYXZlIGFzIG11Y2ggYXMgd2UgY2FuIGdldCB3aXRoIHRoZSBkYXRhIHdlIGhhdmUuXG4gICAgbGV0IHByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0ID0gdG9SZXF1ZXN0LmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKTtcbiAgICBpZiAoIXByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0KSB7XG4gICAgICBhd2FpdCB0b1JlcXVlc3QuZ2V0UHJvZmlsZXMoKTtcblxuICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQgPSB0b1JlcXVlc3QuZ2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpO1xuICAgICAgaWYgKCFwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGFkZE1lbWJlci8ke2lkTG9nfTogTm8gcHJvZmlsZUtleUNyZWRlbnRpYWwgZm9yIGNvbnZlcnNhdGlvbiAke3RvUmVxdWVzdC5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyB1c2VyJ3MgcGVuZGluZyBzdGF0ZSBtYXkgaGF2ZSBjaGFuZ2VkIGluIHRoZSB0aW1lIGJldHdlZW4gdGhlIHVzZXInc1xuICAgIC8vICAgYnV0dG9uIHByZXNzIGFuZCB3aGVuIHdlIGdldCBoZXJlLiBJdCdzIGVzcGVjaWFsbHkgaW1wb3J0YW50IHRvIGNoZWNrIGhlcmVcbiAgICAvLyAgIGluIGNvbmZsaWN0L3JldHJ5IGNhc2VzLlxuICAgIGlmICh0aGlzLmlzTWVtYmVyKHV1aWQpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFkZE1lbWJlci8ke2lkTG9nfTogJHt0b1JlcXVlc3QuaWRGb3JMb2dnaW5nKCl9IGAgK1xuICAgICAgICAgICdpcyBhbHJlYWR5IGEgbWVtYmVyLidcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEFkZE1lbWJlcih7XG4gICAgICBncm91cDogdGhpcy5hdHRyaWJ1dGVzLFxuICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgICBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQ6IHdpbmRvdy5nZXRTZXJ2ZXJQdWJsaWNQYXJhbXMoKSxcbiAgICAgIHV1aWQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbW92ZVBlbmRpbmdNZW1iZXIoXG4gICAgdXVpZHM6IFJlYWRvbmx5QXJyYXk8VVVJRD5cbiAgKTogUHJvbWlzZTxQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgaWRMb2cgPSB0aGlzLmlkRm9yTG9nZ2luZygpO1xuXG4gICAgY29uc3QgcGVuZGluZ1V1aWRzID0gdXVpZHNcbiAgICAgIC5tYXAodXVpZCA9PiB7XG4gICAgICAgIC8vIFRoaXMgdXNlcidzIHBlbmRpbmcgc3RhdGUgbWF5IGhhdmUgY2hhbmdlZCBpbiB0aGUgdGltZSBiZXR3ZWVuIHRoZSB1c2VyJ3NcbiAgICAgICAgLy8gICBidXR0b24gcHJlc3MgYW5kIHdoZW4gd2UgZ2V0IGhlcmUuIEl0J3MgZXNwZWNpYWxseSBpbXBvcnRhbnQgdG8gY2hlY2sgaGVyZVxuICAgICAgICAvLyAgIGluIGNvbmZsaWN0L3JldHJ5IGNhc2VzLlxuICAgICAgICBpZiAoIXRoaXMuaXNNZW1iZXJQZW5kaW5nKHV1aWQpKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgcmVtb3ZlUGVuZGluZ01lbWJlci8ke2lkTG9nfTogJHt1dWlkfSBpcyBub3QgYSBwZW5kaW5nIG1lbWJlciBvZiBncm91cC4gUmV0dXJuaW5nIGVhcmx5LmBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXVpZDtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGlzTm90TmlsKTtcblxuICAgIGlmICghdXVpZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZERlbGV0ZVBlbmRpbmdNZW1iZXJDaGFuZ2Uoe1xuICAgICAgZ3JvdXA6IHRoaXMuYXR0cmlidXRlcyxcbiAgICAgIHV1aWRzOiBwZW5kaW5nVXVpZHMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbW92ZU1lbWJlcihcbiAgICB1dWlkOiBVVUlEXG4gICk6IFByb21pc2U8UHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcblxuICAgIC8vIFRoaXMgdXNlcidzIHBlbmRpbmcgc3RhdGUgbWF5IGhhdmUgY2hhbmdlZCBpbiB0aGUgdGltZSBiZXR3ZWVuIHRoZSB1c2VyJ3NcbiAgICAvLyAgIGJ1dHRvbiBwcmVzcyBhbmQgd2hlbiB3ZSBnZXQgaGVyZS4gSXQncyBlc3BlY2lhbGx5IGltcG9ydGFudCB0byBjaGVjayBoZXJlXG4gICAgLy8gICBpbiBjb25mbGljdC9yZXRyeSBjYXNlcy5cbiAgICBpZiAoIXRoaXMuaXNNZW1iZXIodXVpZCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgcmVtb3ZlTWVtYmVyLyR7aWRMb2d9OiAke3V1aWR9IGlzIG5vdCBhIHBlbmRpbmcgbWVtYmVyIG9mIGdyb3VwLiBSZXR1cm5pbmcgZWFybHkuYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpO1xuXG4gICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkRGVsZXRlTWVtYmVyQ2hhbmdlKHtcbiAgICAgIGdyb3VwOiB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICBvdXJVdWlkLFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdG9nZ2xlQWRtaW5DaGFuZ2UoXG4gICAgdXVpZDogVVVJRFxuICApOiBQcm9taXNlPFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMgfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGlkTG9nID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcblxuICAgIGlmICghdGhpcy5pc01lbWJlcih1dWlkKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGB0b2dnbGVBZG1pbkNoYW5nZS8ke2lkTG9nfTogJHt1dWlkfSBpcyBub3QgYSBwZW5kaW5nIG1lbWJlciBvZiBncm91cC4gUmV0dXJuaW5nIGVhcmx5LmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IE1FTUJFUl9ST0xFUyA9IFByb3RvLk1lbWJlci5Sb2xlO1xuXG4gICAgY29uc3Qgcm9sZSA9IHRoaXMuaXNBZG1pbih1dWlkKVxuICAgICAgPyBNRU1CRVJfUk9MRVMuREVGQVVMVFxuICAgICAgOiBNRU1CRVJfUk9MRVMuQURNSU5JU1RSQVRPUjtcblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZE1vZGlmeU1lbWJlclJvbGVDaGFuZ2Uoe1xuICAgICAgZ3JvdXA6IHRoaXMuYXR0cmlidXRlcyxcbiAgICAgIHV1aWQsXG4gICAgICByb2xlLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbW9kaWZ5R3JvdXBWMih7XG4gICAgdXNpbmdDcmVkZW50aWFsc0Zyb20sXG4gICAgY3JlYXRlR3JvdXBDaGFuZ2UsXG4gICAgZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZCxcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gICAgbmFtZSxcbiAgfToge1xuICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvbk1vZGVsPjtcbiAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT4gUHJvbWlzZTxQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHwgdW5kZWZpbmVkPjtcbiAgICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kPzogQXJyYXk8c3RyaW5nPjtcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQ/OiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5Hcm91cHMubW9kaWZ5R3JvdXBWMih7XG4gICAgICBjb252ZXJzYXRpb246IHRoaXMsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbSxcbiAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlLFxuICAgICAgZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZCxcbiAgICAgIGludml0ZUxpbmtQYXNzd29yZCxcbiAgICAgIG5hbWUsXG4gICAgfSk7XG4gIH1cblxuICBpc0V2ZXJVbnJlZ2lzdGVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXQoJ2Rpc2NvdmVyZWRVbnJlZ2lzdGVyZWRBdCcpKTtcbiAgfVxuXG4gIGlzVW5yZWdpc3RlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCh0aGlzLmF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgaXNTTVNPbmx5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0NvbnZlcnNhdGlvblNNU09ubHkoe1xuICAgICAgLi4udGhpcy5hdHRyaWJ1dGVzLFxuICAgICAgdHlwZTogaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSA/ICdkaXJlY3QnIDogJ3Vua25vd24nLFxuICAgIH0pO1xuICB9XG5cbiAgc2V0VW5yZWdpc3RlcmVkKCk6IHZvaWQge1xuICAgIGxvZy5pbmZvKGBDb252ZXJzYXRpb24gJHt0aGlzLmlkRm9yTG9nZ2luZygpfSBpcyBub3cgdW5yZWdpc3RlcmVkYCk7XG4gICAgdGhpcy5zZXQoe1xuICAgICAgZGlzY292ZXJlZFVucmVnaXN0ZXJlZEF0OiBEYXRlLm5vdygpLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIHNldFJlZ2lzdGVyZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ2V0KCdkaXNjb3ZlcmVkVW5yZWdpc3RlcmVkQXQnKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oYENvbnZlcnNhdGlvbiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9IGlzIHJlZ2lzdGVyZWQgb25jZSBhZ2FpbmApO1xuICAgIHRoaXMuc2V0KHtcbiAgICAgIGRpc2NvdmVyZWRVbnJlZ2lzdGVyZWRBdDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlzR3JvdXBWMUFuZERpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0dyb3VwVjEodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlzQmxvY2tlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB1dWlkID0gdGhpcy5nZXQoJ3V1aWQnKTtcbiAgICBpZiAodXVpZCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQuaXNVdWlkQmxvY2tlZCh1dWlkKTtcbiAgICB9XG5cbiAgICBjb25zdCBlMTY0ID0gdGhpcy5nZXQoJ2UxNjQnKTtcbiAgICBpZiAoZTE2NCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQuaXNCbG9ja2VkKGUxNjQpO1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VwSWQgPSB0aGlzLmdldCgnZ3JvdXBJZCcpO1xuICAgIGlmIChncm91cElkKSB7XG4gICAgICByZXR1cm4gd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5pc0dyb3VwQmxvY2tlZChncm91cElkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBibG9jayh7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyA9IGZhbHNlIH0gPSB7fSk6IHZvaWQge1xuICAgIGxldCBibG9ja2VkID0gZmFsc2U7XG4gICAgY29uc3Qgd2FzQmxvY2tlZCA9IHRoaXMuaXNCbG9ja2VkKCk7XG5cbiAgICBjb25zdCB1dWlkID0gdGhpcy5nZXQoJ3V1aWQnKTtcbiAgICBpZiAodXVpZCkge1xuICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5hZGRCbG9ja2VkVXVpZCh1dWlkKTtcbiAgICAgIGJsb2NrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGUxNjQgPSB0aGlzLmdldCgnZTE2NCcpO1xuICAgIGlmIChlMTY0KSB7XG4gICAgICB3aW5kb3cuc3RvcmFnZS5ibG9ja2VkLmFkZEJsb2NrZWROdW1iZXIoZTE2NCk7XG4gICAgICBibG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cElkID0gdGhpcy5nZXQoJ2dyb3VwSWQnKTtcbiAgICBpZiAoZ3JvdXBJZCkge1xuICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5hZGRCbG9ja2VkR3JvdXAoZ3JvdXBJZCk7XG4gICAgICBibG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoYmxvY2tlZCAmJiAhd2FzQmxvY2tlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBmb3JjZSBhIHByb3BzIHJlZnJlc2ggLSBibG9ja2VkIHN0YXRlIGlzIG5vdCBpbiBiYWNrYm9uZSBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMsIHsgZm9yY2U6IHRydWUgfSk7XG5cbiAgICAgIGlmICghdmlhU3RvcmFnZVNlcnZpY2VTeW5jKSB7XG4gICAgICAgIHRoaXMuY2FwdHVyZUNoYW5nZSgnYmxvY2snKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bmJsb2NrKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jID0gZmFsc2UgfSA9IHt9KTogYm9vbGVhbiB7XG4gICAgbGV0IHVuYmxvY2tlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHdhc0Jsb2NrZWQgPSB0aGlzLmlzQmxvY2tlZCgpO1xuXG4gICAgY29uc3QgdXVpZCA9IHRoaXMuZ2V0KCd1dWlkJyk7XG4gICAgaWYgKHV1aWQpIHtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQucmVtb3ZlQmxvY2tlZFV1aWQodXVpZCk7XG4gICAgICB1bmJsb2NrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGUxNjQgPSB0aGlzLmdldCgnZTE2NCcpO1xuICAgIGlmIChlMTY0KSB7XG4gICAgICB3aW5kb3cuc3RvcmFnZS5ibG9ja2VkLnJlbW92ZUJsb2NrZWROdW1iZXIoZTE2NCk7XG4gICAgICB1bmJsb2NrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VwSWQgPSB0aGlzLmdldCgnZ3JvdXBJZCcpO1xuICAgIGlmIChncm91cElkKSB7XG4gICAgICB3aW5kb3cuc3RvcmFnZS5ibG9ja2VkLnJlbW92ZUJsb2NrZWRHcm91cChncm91cElkKTtcbiAgICAgIHVuYmxvY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHVuYmxvY2tlZCAmJiB3YXNCbG9ja2VkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGZvcmNlIGEgcHJvcHMgcmVmcmVzaCAtIGJsb2NrZWQgc3RhdGUgaXMgbm90IGluIGJhY2tib25lIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcywgeyBmb3JjZTogdHJ1ZSB9KTtcblxuICAgICAgaWYgKCF2aWFTdG9yYWdlU2VydmljZVN5bmMpIHtcbiAgICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCd1bmJsb2NrJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmV0Y2hMYXRlc3RHcm91cFYyRGF0YSh7IGZvcmNlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB1bmJsb2NrZWQ7XG4gIH1cblxuICBlbmFibGVQcm9maWxlU2hhcmluZyh7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyA9IGZhbHNlIH0gPSB7fSk6IHZvaWQge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGVuYWJsZVByb2ZpbGVTaGFyaW5nOiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9IHN0b3JhZ2U/ICR7dmlhU3RvcmFnZVNlcnZpY2VTeW5jfWBcbiAgICApO1xuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpO1xuXG4gICAgdGhpcy5zZXQoeyBwcm9maWxlU2hhcmluZzogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXQoJ3Byb2ZpbGVTaGFyaW5nJyk7XG5cbiAgICBpZiAoIXZpYVN0b3JhZ2VTZXJ2aWNlU3luYyAmJiBCb29sZWFuKGJlZm9yZSkgIT09IEJvb2xlYW4oYWZ0ZXIpKSB7XG4gICAgICB0aGlzLmNhcHR1cmVDaGFuZ2UoJ2VuYWJsZVByb2ZpbGVTaGFyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZVByb2ZpbGVTaGFyaW5nKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jID0gZmFsc2UgfSA9IHt9KTogdm9pZCB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgZGlzYWJsZVByb2ZpbGVTaGFyaW5nOiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9IHN0b3JhZ2U/ICR7dmlhU3RvcmFnZVNlcnZpY2VTeW5jfWBcbiAgICApO1xuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpO1xuXG4gICAgdGhpcy5zZXQoeyBwcm9maWxlU2hhcmluZzogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBhZnRlciA9IHRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpO1xuXG4gICAgaWYgKCF2aWFTdG9yYWdlU2VydmljZVN5bmMgJiYgQm9vbGVhbihiZWZvcmUpICE9PSBCb29sZWFuKGFmdGVyKSkge1xuICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCdkaXNhYmxlUHJvZmlsZVNoYXJpbmcnKTtcbiAgICB9XG4gIH1cblxuICBoYXNEcmFmdCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBkcmFmdEF0dGFjaG1lbnRzID0gdGhpcy5nZXQoJ2RyYWZ0QXR0YWNobWVudHMnKSB8fCBbXTtcbiAgICByZXR1cm4gKHRoaXMuZ2V0KCdkcmFmdCcpIHx8XG4gICAgICB0aGlzLmdldCgncXVvdGVkTWVzc2FnZUlkJykgfHxcbiAgICAgIGRyYWZ0QXR0YWNobWVudHMubGVuZ3RoID4gMCkgYXMgYm9vbGVhbjtcbiAgfVxuXG4gIGdldERyYWZ0UHJldmlldygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRyYWZ0ID0gdGhpcy5nZXQoJ2RyYWZ0Jyk7XG5cbiAgICBpZiAoZHJhZnQpIHtcbiAgICAgIGNvbnN0IGJvZHlSYW5nZXMgPSB0aGlzLmdldCgnZHJhZnRCb2R5UmFuZ2VzJykgfHwgW107XG5cbiAgICAgIHJldHVybiBnZXRUZXh0V2l0aE1lbnRpb25zKGJvZHlSYW5nZXMsIGRyYWZ0KTtcbiAgICB9XG5cbiAgICBjb25zdCBkcmFmdEF0dGFjaG1lbnRzID0gdGhpcy5nZXQoJ2RyYWZ0QXR0YWNobWVudHMnKSB8fCBbXTtcbiAgICBpZiAoZHJhZnRBdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gd2luZG93LmkxOG4oJ0NvbnZlcnNhdGlvbi0tZ2V0RHJhZnRQcmV2aWV3LS1hdHRhY2htZW50Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVvdGVkTWVzc2FnZUlkID0gdGhpcy5nZXQoJ3F1b3RlZE1lc3NhZ2VJZCcpO1xuICAgIGlmIChxdW90ZWRNZXNzYWdlSWQpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuaTE4bignQ29udmVyc2F0aW9uLS1nZXREcmFmdFByZXZpZXctLXF1b3RlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvdy5pMThuKCdDb252ZXJzYXRpb24tLWdldERyYWZ0UHJldmlldy0tZHJhZnQnKTtcbiAgfVxuXG4gIGJ1bXBUeXBpbmcoKTogdm9pZCB7XG4gICAgLy8gV2UgZG9uJ3Qgc2VuZCB0eXBpbmcgbWVzc2FnZXMgaWYgdGhlIHNldHRpbmcgaXMgZGlzYWJsZWRcbiAgICBpZiAoIXdpbmRvdy5FdmVudHMuZ2V0VHlwaW5nSW5kaWNhdG9yU2V0dGluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnR5cGluZ1JlZnJlc2hUaW1lcikge1xuICAgICAgY29uc3QgaXNUeXBpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5zZXRUeXBpbmdSZWZyZXNoVGltZXIoKTtcbiAgICAgIHRoaXMuc2VuZFR5cGluZ01lc3NhZ2UoaXNUeXBpbmcpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VHlwaW5nUGF1c2VUaW1lcigpO1xuICB9XG5cbiAgc2V0VHlwaW5nUmVmcmVzaFRpbWVyKCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRoaXMudHlwaW5nUmVmcmVzaFRpbWVyKTtcbiAgICB0aGlzLnR5cGluZ1JlZnJlc2hUaW1lciA9IHNldFRpbWVvdXQoXG4gICAgICB0aGlzLm9uVHlwaW5nUmVmcmVzaFRpbWVvdXQuYmluZCh0aGlzKSxcbiAgICAgIDEwICogMTAwMFxuICAgICk7XG4gIH1cblxuICBvblR5cGluZ1JlZnJlc2hUaW1lb3V0KCk6IHZvaWQge1xuICAgIGNvbnN0IGlzVHlwaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNlbmRUeXBpbmdNZXNzYWdlKGlzVHlwaW5nKTtcblxuICAgIC8vIFRoaXMgdGltZXIgd2lsbCBjb250aW51ZSB0byByZXNldCBpdHNlbGYgdW50aWwgdGhlIHBhdXNlIHRpbWVyIHN0b3BzIGl0XG4gICAgdGhpcy5zZXRUeXBpbmdSZWZyZXNoVGltZXIoKTtcbiAgfVxuXG4gIHNldFR5cGluZ1BhdXNlVGltZXIoKTogdm9pZCB7XG4gICAgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkodGhpcy50eXBpbmdQYXVzZVRpbWVyKTtcbiAgICB0aGlzLnR5cGluZ1BhdXNlVGltZXIgPSBzZXRUaW1lb3V0KFxuICAgICAgdGhpcy5vblR5cGluZ1BhdXNlVGltZW91dC5iaW5kKHRoaXMpLFxuICAgICAgMyAqIDEwMDBcbiAgICApO1xuICB9XG5cbiAgb25UeXBpbmdQYXVzZVRpbWVvdXQoKTogdm9pZCB7XG4gICAgY29uc3QgaXNUeXBpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnNlbmRUeXBpbmdNZXNzYWdlKGlzVHlwaW5nKTtcblxuICAgIHRoaXMuY2xlYXJUeXBpbmdUaW1lcnMoKTtcbiAgfVxuXG4gIGNsZWFyVHlwaW5nVGltZXJzKCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRoaXMudHlwaW5nUGF1c2VUaW1lcik7XG4gICAgdGhpcy50eXBpbmdQYXVzZVRpbWVyID0gbnVsbDtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aGlzLnR5cGluZ1JlZnJlc2hUaW1lcik7XG4gICAgdGhpcy50eXBpbmdSZWZyZXNoVGltZXIgPSBudWxsO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hMYXRlc3RHcm91cFYyRGF0YShcbiAgICBvcHRpb25zOiB7IGZvcmNlPzogYm9vbGVhbiB9ID0ge31cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuR3JvdXBzLndhaXRUaGVuTWF5YmVVcGRhdGVHcm91cCh7XG4gICAgICBmb3JjZTogb3B0aW9ucy5mb3JjZSxcbiAgICAgIGNvbnZlcnNhdGlvbjogdGhpcyxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoU01TT25seVVVSUQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgIGlmICghbWVzc2FnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1NNU09ubHkoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYEZldGNoaW5nIHV1aWQgZm9yIGEgc21zLW9ubHkgY29udmVyc2F0aW9uICR7dGhpcy5pZEZvckxvZ2dpbmcoKX1gXG4gICAgKTtcblxuICAgIHRoaXMuaXNGZXRjaGluZ1VVSUQgPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcywgeyBmb3JjZTogdHJ1ZSB9KTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBBdHRlbXB0IHRvIGZldGNoIFVVSURcbiAgICAgIGF3YWl0IHVwZGF0ZUNvbnZlcnNhdGlvbnNXaXRoVXVpZExvb2t1cCh7XG4gICAgICAgIGNvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLFxuICAgICAgICBjb252ZXJzYXRpb25zOiBbdGhpc10sXG4gICAgICAgIG1lc3NhZ2luZyxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBObyByZWR1eCB1cGRhdGUgaGVyZVxuICAgICAgdGhpcy5pc0ZldGNoaW5nVVVJRCA9IGZhbHNlO1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCB7IGZvcmNlOiB0cnVlIH0pO1xuXG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYERvbmUgZmV0Y2hpbmcgdXVpZCBmb3IgYSBzbXMtb25seSBjb252ZXJzYXRpb24gJHt0aGlzLmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdldCgndXVpZCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT24gc3VjY2Vzc2Z1bCBmZXRjaCAtIG1hcmsgY29udGFjdCBhcyByZWdpc3RlcmVkLlxuICAgIHRoaXMuc2V0UmVnaXN0ZXJlZCgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSB8fFxuICAgICAgaXNHcm91cFYxKHRoaXMuYXR0cmlidXRlcykgfHxcbiAgICAgIGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIG1heWJlTWlncmF0ZVYxR3JvdXAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFpc0dyb3VwVjEodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzTWlncmF0ZWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5oYXNWMUdyb3VwQmVlbk1pZ3JhdGVkKHRoaXMpO1xuICAgIGlmICghaXNNaWdyYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuR3JvdXBzLndhaXRUaGVuUmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbih7XG4gICAgICBjb252ZXJzYXRpb246IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICBtYXliZVJlcGFpckdyb3VwVjIoZGF0YToge1xuICAgIG1hc3RlcktleTogc3RyaW5nO1xuICAgIHNlY3JldFBhcmFtczogc3RyaW5nO1xuICAgIHB1YmxpY1BhcmFtczogc3RyaW5nO1xuICB9KTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5nZXQoJ2dyb3VwVmVyc2lvbicpICYmXG4gICAgICB0aGlzLmdldCgnbWFzdGVyS2V5JykgJiZcbiAgICAgIHRoaXMuZ2V0KCdzZWNyZXRQYXJhbXMnKSAmJlxuICAgICAgdGhpcy5nZXQoJ3B1YmxpY1BhcmFtcycpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oYFJlcGFpcmluZyBHcm91cFYyIGNvbnZlcnNhdGlvbiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9YCk7XG4gICAgY29uc3QgeyBtYXN0ZXJLZXksIHNlY3JldFBhcmFtcywgcHVibGljUGFyYW1zIH0gPSBkYXRhO1xuXG4gICAgdGhpcy5zZXQoeyBtYXN0ZXJLZXksIHNlY3JldFBhcmFtcywgcHVibGljUGFyYW1zLCBncm91cFZlcnNpb246IDIgfSk7XG5cbiAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICBnZXRHcm91cFYySW5mbyhcbiAgICBvcHRpb25zOiBSZWFkb25seTxcbiAgICAgIHsgZ3JvdXBDaGFuZ2U/OiBVaW50OEFycmF5IH0gJiAoXG4gICAgICAgIHwge1xuICAgICAgICAgICAgaW5jbHVkZVBlbmRpbmdNZW1iZXJzPzogYm9vbGVhbjtcbiAgICAgICAgICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQ/OiBBcnJheTxzdHJpbmc+O1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7IG1lbWJlcnM6IEFycmF5PHN0cmluZz4gfVxuICAgICAgKVxuICAgID4gPSB7fVxuICApOiBHcm91cFYySW5mb1R5cGUgfCB1bmRlZmluZWQge1xuICAgIGlmIChpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpIHx8ICFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG1hc3RlcktleTogQnl0ZXMuZnJvbUJhc2U2NChcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgdGhpcy5nZXQoJ21hc3RlcktleScpIVxuICAgICAgKSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICByZXZpc2lvbjogdGhpcy5nZXQoJ3JldmlzaW9uJykhLFxuICAgICAgbWVtYmVyczpcbiAgICAgICAgJ21lbWJlcnMnIGluIG9wdGlvbnMgPyBvcHRpb25zLm1lbWJlcnMgOiB0aGlzLmdldFJlY2lwaWVudHMob3B0aW9ucyksXG4gICAgICBncm91cENoYW5nZTogb3B0aW9ucy5ncm91cENoYW5nZSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0R3JvdXBWMUluZm8obWVtYmVycz86IEFycmF5PHN0cmluZz4pOiBHcm91cFYxSW5mb1R5cGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGdyb3VwSWQgPSB0aGlzLmdldCgnZ3JvdXBJZCcpO1xuICAgIGNvbnN0IGdyb3VwVmVyc2lvbiA9IHRoaXMuZ2V0KCdncm91cFZlcnNpb24nKTtcblxuICAgIGlmIChcbiAgICAgIGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykgfHxcbiAgICAgICFncm91cElkIHx8XG4gICAgICAoZ3JvdXBWZXJzaW9uICYmIGdyb3VwVmVyc2lvbiA+IDApXG4gICAgKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpZDogZ3JvdXBJZCxcbiAgICAgIG1lbWJlcnM6IG1lbWJlcnMgfHwgdGhpcy5nZXRSZWNpcGllbnRzKCksXG4gICAgfTtcbiAgfVxuXG4gIGdldEdyb3VwSWRCdWZmZXIoKTogVWludDhBcnJheSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZ3JvdXBJZFN0cmluZyA9IHRoaXMuZ2V0KCdncm91cElkJyk7XG5cbiAgICBpZiAoIWdyb3VwSWRTdHJpbmcpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGlzR3JvdXBWMSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gQnl0ZXMuZnJvbUJpbmFyeShncm91cElkU3RyaW5nKTtcbiAgICB9XG4gICAgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gQnl0ZXMuZnJvbUJhc2U2NChncm91cElkU3RyaW5nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgYXN5bmMgc2VuZFR5cGluZ01lc3NhZ2UoaXNUeXBpbmc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG5cbiAgICBpZiAoIW1lc3NhZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IHNlbmQgdHlwaW5nIG1lc3NhZ2VzIHRvIG91ciBvdGhlciBkZXZpY2VzXG4gICAgaWYgKGlzTWUodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvYWxlc2NlIG11bHRpcGxlIHNlbmRUeXBpbmdNZXNzYWdlIGNhbGxzIGludG8gb25lLlxuICAgIC8vXG4gICAgLy8gYGxhc3RJc1R5cGluZ2AgaXMgc2V0IHRvIHRoZSBsYXN0IGBpc1R5cGluZ2AgdmFsdWUgcGFzc2VkIHRvIHRoZVxuICAgIC8vIGBzZW5kVHlwaW5nTWVzc2FnZWAuIFRoZSBmaXJzdCAnc2VuZFR5cGluZ01lc3NhZ2UnIGpvYiB0byBydW4gd2lsbFxuICAgIC8vIHBpY2sgaXQgYW5kIHJlc2V0IGl0IGJhY2sgdG8gYHVuZGVmaW5lZGAgc28gdGhhdCBsYXRlciBqb2JzIHdpbGxcbiAgICAvLyBpbiBlZmZlY3QgYmUgaWdub3JlZC5cbiAgICB0aGlzLmxhc3RJc1R5cGluZyA9IGlzVHlwaW5nO1xuXG4gICAgYXdhaXQgdGhpcy5xdWV1ZUpvYignc2VuZFR5cGluZ01lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBncm91cE1lbWJlcnMgPSB0aGlzLmdldFJlY2lwaWVudHMoKTtcblxuICAgICAgLy8gV2UgZG9uJ3Qgc2VuZCB0eXBpbmcgbWVzc2FnZXMgaWYgb3VyIHJlY2lwaWVudHMgbGlzdCBpcyBlbXB0eVxuICAgICAgaWYgKCFpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpICYmICFncm91cE1lbWJlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGFzdElzVHlwaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbG9nLmluZm8oYHNlbmRUeXBpbmdNZXNzYWdlKCR7dGhpcy5pZEZvckxvZ2dpbmcoKX0pOiBpZ25vcmluZ2ApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudElkID0gaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICA/IHRoaXMuZ2V0U2VuZFRhcmdldCgpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgZ3JvdXBJZCA9IHRoaXMuZ2V0R3JvdXBJZEJ1ZmZlcigpO1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgY29udGVudCA9IHtcbiAgICAgICAgcmVjaXBpZW50SWQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGdyb3VwTWVtYmVycyxcbiAgICAgICAgaXNUeXBpbmc6IHRoaXMubGFzdElzVHlwaW5nLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICB9O1xuICAgICAgdGhpcy5sYXN0SXNUeXBpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc2VuZFR5cGluZ01lc3NhZ2UoJHt0aGlzLmlkRm9yTG9nZ2luZygpfSk6IHNlbmRpbmcgJHtjb250ZW50LmlzVHlwaW5nfWBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnRNZXNzYWdlID0gbWVzc2FnaW5nLmdldFR5cGluZ0NvbnRlbnRNZXNzYWdlKGNvbnRlbnQpO1xuXG4gICAgICBjb25zdCB7IENvbnRlbnRIaW50IH0gPSBQcm90by5VbmlkZW50aWZpZWRTZW5kZXJNZXNzYWdlLk1lc3NhZ2U7XG5cbiAgICAgIGNvbnN0IHNlbmRPcHRpb25zID0ge1xuICAgICAgICAuLi4oYXdhaXQgZ2V0U2VuZE9wdGlvbnModGhpcy5hdHRyaWJ1dGVzKSksXG4gICAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgICBhd2FpdCBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgICBtZXNzYWdpbmcuc2VuZE1lc3NhZ2VQcm90b0FuZFdhaXQoe1xuICAgICAgICAgICAgY29udGVudEhpbnQ6IENvbnRlbnRIaW50LklNUExJQ0lULFxuICAgICAgICAgICAgZ3JvdXBJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb3B0aW9uczogc2VuZE9wdGlvbnMsXG4gICAgICAgICAgICBwcm90bzogY29udGVudE1lc3NhZ2UsXG4gICAgICAgICAgICByZWNpcGllbnRzOiBncm91cE1lbWJlcnMsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHsgbWVzc2FnZUlkczogW10sIHNlbmRUeXBlOiAndHlwaW5nJyB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgICB3aW5kb3cuU2lnbmFsLlV0aWwuc2VuZENvbnRlbnRNZXNzYWdlVG9Hcm91cCh7XG4gICAgICAgICAgICBjb250ZW50SGludDogQ29udGVudEhpbnQuSU1QTElDSVQsXG4gICAgICAgICAgICBjb250ZW50TWVzc2FnZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICAgICAgcmVjaXBpZW50czogZ3JvdXBNZW1iZXJzLFxuICAgICAgICAgICAgc2VuZE9wdGlvbnMsXG4gICAgICAgICAgICBzZW5kVGFyZ2V0OiB0aGlzLnRvU2VuZGVyS2V5VGFyZ2V0KCksXG4gICAgICAgICAgICBzZW5kVHlwZTogJ3R5cGluZycsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHsgbWVzc2FnZUlkczogW10sIHNlbmRUeXBlOiAndHlwaW5nJyB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBvbk5ld01lc3NhZ2UobWVzc2FnZTogTWVzc2FnZU1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdXVpZCA9IG1lc3NhZ2UuZ2V0KCdzb3VyY2VVdWlkJyk7XG4gICAgY29uc3QgZTE2NCA9IG1lc3NhZ2UuZ2V0KCdzb3VyY2UnKTtcbiAgICBjb25zdCBzb3VyY2VEZXZpY2UgPSBtZXNzYWdlLmdldCgnc291cmNlRGV2aWNlJyk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICB1dWlkLFxuICAgICAgZTE2NCxcbiAgICB9KTtcbiAgICBjb25zdCB0eXBpbmdUb2tlbiA9IGAke3NvdXJjZT8uaWR9LiR7c291cmNlRGV2aWNlfWA7XG5cbiAgICAvLyBDbGVhciB0eXBpbmcgaW5kaWNhdG9yIGZvciBhIGdpdmVuIGNvbnRhY3QgaWYgd2UgcmVjZWl2ZSBhIG1lc3NhZ2UgZnJvbSB0aGVtXG4gICAgdGhpcy5jbGVhckNvbnRhY3RUeXBpbmdUaW1lcih0eXBpbmdUb2tlbik7XG5cbiAgICAvLyBJZiBpdCdzIGEgZ3JvdXAgc3RvcnkgcmVwbHkgb3IgYSBzdG9yeSBtZXNzYWdlLCB3ZSBkb24ndCB3YW50IHRvIHVwZGF0ZVxuICAgIC8vIHRoZSBsYXN0IG1lc3NhZ2Ugb3IgYWRkIG5ldyBtZXNzYWdlcyB0byByZWR1eC5cbiAgICBjb25zdCBpc0dyb3VwU3RvcnlSZXBseSA9XG4gICAgICBpc0dyb3VwKHRoaXMuYXR0cmlidXRlcykgJiYgbWVzc2FnZS5nZXQoJ3N0b3J5SWQnKTtcbiAgICBpZiAoaXNHcm91cFN0b3J5UmVwbHkgfHwgaXNTdG9yeShtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hZGRTaW5nbGVNZXNzYWdlKG1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gTmV3IG1lc3NhZ2VzIG1pZ2h0IGFycml2ZSB3aGlsZSB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGEgYnVsayBmZXRjaCBmcm9tIHRoZVxuICAvLyAgIGRhdGFiYXNlLiBXZSdsbCB3YWl0IHVudGlsIHRoYXQgaXMgZG9uZSBiZWZvcmUgbW92aW5nIGZvcndhcmQuXG4gIGFzeW5jIGFkZFNpbmdsZU1lc3NhZ2UoXG4gICAgbWVzc2FnZTogTWVzc2FnZU1vZGVsLFxuICAgIHsgaXNKdXN0U2VudCB9OiB7IGlzSnVzdFNlbnQ6IGJvb2xlYW4gfSA9IHsgaXNKdXN0U2VudDogZmFsc2UgfVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmJlZm9yZUFkZFNpbmdsZU1lc3NhZ2UoKTtcbiAgICB0aGlzLmRvQWRkU2luZ2xlTWVzc2FnZShtZXNzYWdlLCB7IGlzSnVzdFNlbnQgfSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIHRoaXMuZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2UhKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGJlZm9yZUFkZFNpbmdsZU1lc3NhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLm5ld01lc3NhZ2VRdWV1ZSkge1xuICAgICAgdGhpcy5uZXdNZXNzYWdlUXVldWUgPSBuZXcgd2luZG93LlBRdWV1ZSh7XG4gICAgICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgICAgICB0aW1lb3V0OiBkdXJhdGlvbnMuTUlOVVRFICogMzAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXZSB1c2UgYSBxdWV1ZSBoZXJlIHRvIGVuc3VyZSBtZXNzYWdlcyBhcmUgYWRkZWQgdG8gdGhlIFVJIGluIHRoZSBvcmRlciByZWNlaXZlZFxuICAgIGF3YWl0IHRoaXMubmV3TWVzc2FnZVF1ZXVlLmFkZChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLmluUHJvZ3Jlc3NGZXRjaDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZG9BZGRTaW5nbGVNZXNzYWdlKFxuICAgIG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCxcbiAgICB7IGlzSnVzdFNlbnQgfTogeyBpc0p1c3RTZW50OiBib29sZWFuIH1cbiAgKTogdm9pZCB7XG4gICAgY29uc3QgeyBtZXNzYWdlc0FkZGVkIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnM7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25zIH0gPSB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpO1xuICAgIGNvbnN0IHsgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbiB9ID0gY29udmVyc2F0aW9ucztcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gdGhpcy5pZDtcbiAgICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9IG1lc3NhZ2VzQnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdO1xuICAgIGNvbnN0IG5ld2VzdElkID0gZXhpc3RpbmdDb252ZXJzYXRpb24/Lm1ldHJpY3M/Lm5ld2VzdD8uaWQ7XG4gICAgY29uc3QgbWVzc2FnZUlkcyA9IGV4aXN0aW5nQ29udmVyc2F0aW9uPy5tZXNzYWdlSWRzO1xuXG4gICAgY29uc3QgaXNMYXRlc3RJbk1lbW9yeSA9XG4gICAgICBuZXdlc3RJZCAmJiBtZXNzYWdlSWRzICYmIG1lc3NhZ2VJZHNbbWVzc2FnZUlkcy5sZW5ndGggLSAxXSA9PT0gbmV3ZXN0SWQ7XG5cbiAgICBpZiAoaXNKdXN0U2VudCAmJiBleGlzdGluZ0NvbnZlcnNhdGlvbiAmJiAhaXNMYXRlc3RJbk1lbW9yeSkge1xuICAgICAgdGhpcy5sb2FkTmV3ZXN0TWVzc2FnZXModW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlc0FkZGVkKHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIG1lc3NhZ2VzOiBbeyAuLi5tZXNzYWdlLmF0dHJpYnV0ZXMgfV0sXG4gICAgICAgIGlzQWN0aXZlOiB3aW5kb3cuU2lnbmFsQ29udGV4dC5hY3RpdmVXaW5kb3dTZXJ2aWNlLmlzQWN0aXZlKCksXG4gICAgICAgIGlzSnVzdFNlbnQsXG4gICAgICAgIGlzTmV3TWVzc2FnZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldEluUHJvZ3Jlc3NGZXRjaCgpOiAoKSA9PiB1bmtub3duIHtcbiAgICBsZXQgcmVzb2x2ZVByb21pc2U6ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWQ7XG4gICAgdGhpcy5pblByb2dyZXNzRmV0Y2ggPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmVQcm9taXNlKCk7XG4gICAgICB0aGlzLmluUHJvZ3Jlc3NGZXRjaCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZpbmlzaDtcbiAgfVxuXG4gIGFzeW5jIGxvYWROZXdlc3RNZXNzYWdlcyhcbiAgICBuZXdlc3RNZXNzYWdlSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBzZXRGb2N1czogYm9vbGVhbiB8IHVuZGVmaW5lZFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1lc3NhZ2VzUmVzZXQsIHNldE1lc3NhZ2VMb2FkaW5nU3RhdGUgfSA9XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnM7XG4gICAgY29uc3QgY29udmVyc2F0aW9uSWQgPSB0aGlzLmlkO1xuXG4gICAgc2V0TWVzc2FnZUxvYWRpbmdTdGF0ZShcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgVGltZWxpbmVNZXNzYWdlTG9hZGluZ1N0YXRlLkRvaW5nSW5pdGlhbExvYWRcbiAgICApO1xuICAgIGNvbnN0IGZpbmlzaCA9IHRoaXMuc2V0SW5Qcm9ncmVzc0ZldGNoKCk7XG5cbiAgICB0cnkge1xuICAgICAgbGV0IHNjcm9sbFRvTGF0ZXN0VW5yZWFkID0gdHJ1ZTtcblxuICAgICAgaWYgKG5ld2VzdE1lc3NhZ2VJZCkge1xuICAgICAgICBjb25zdCBuZXdlc3RJbk1lbW9yeU1lc3NhZ2UgPSBhd2FpdCBnZXRNZXNzYWdlQnlJZChuZXdlc3RNZXNzYWdlSWQpO1xuICAgICAgICBpZiAobmV3ZXN0SW5NZW1vcnlNZXNzYWdlKSB7XG4gICAgICAgICAgLy8gSWYgbmV3ZXN0IGluLW1lbW9yeSBtZXNzYWdlIGlzIHVucmVhZCwgc2Nyb2xsaW5nIGRvd24gd291bGQgbWVhbiBnb2luZyB0b1xuICAgICAgICAgIC8vICAgdGhlIHZlcnkgYm90dG9tLCBub3QgdGhlIG9sZGVzdCB1bnJlYWQuXG4gICAgICAgICAgaWYgKGlzTWVzc2FnZVVucmVhZChuZXdlc3RJbk1lbW9yeU1lc3NhZ2UpKSB7XG4gICAgICAgICAgICBzY3JvbGxUb0xhdGVzdFVucmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBsb2FkTmV3ZXN0TWVzc2FnZXM6IGRpZCBub3QgZmluZCBtZXNzYWdlICR7bmV3ZXN0TWVzc2FnZUlkfWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1ldHJpY3MgPSBhd2FpdCBnZXRNZXNzYWdlTWV0cmljc0ZvckNvbnZlcnNhdGlvbihcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgaXNHcm91cCh0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICApO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgbWVzc2FnZSByZXF1ZXN0IHRoYXQgaGFzIG5vdCB5ZXQgYmVlbiBhY2NlcHRlZCwgd2UgYWx3YXlzIHNob3cgdGhlXG4gICAgICAvLyAgIG9sZGVzdCBtZXNzYWdlcywgdG8gZW5zdXJlIHRoYXQgdGhlIENvbnZlcnNhdGlvbkhlcm8gaXMgc2hvd24uIFdlIGRvbid0IHdhbnQgdG9cbiAgICAgIC8vICAgc2Nyb2xsIGRpcmVjdGx5IHRvIHRoZSBvbGRlc3QgbWVzc2FnZSwgYmVjYXVzZSB0aGF0IGNvdWxkIHNjcm9sbCB0aGUgaGVybyBvZmZcbiAgICAgIC8vICAgdGhlIHNjcmVlbi5cbiAgICAgIGlmICghbmV3ZXN0TWVzc2FnZUlkICYmICF0aGlzLmdldEFjY2VwdGVkKCkgJiYgbWV0cmljcy5vbGRlc3QpIHtcbiAgICAgICAgdGhpcy5sb2FkQW5kU2Nyb2xsKG1ldHJpY3Mub2xkZXN0LmlkLCB7IGRpc2FibGVTY3JvbGw6IHRydWUgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbFRvTGF0ZXN0VW5yZWFkICYmIG1ldHJpY3Mub2xkZXN0VW5zZWVuKSB7XG4gICAgICAgIHRoaXMubG9hZEFuZFNjcm9sbChtZXRyaWNzLm9sZGVzdFVuc2Vlbi5pZCwge1xuICAgICAgICAgIGRpc2FibGVTY3JvbGw6ICFzZXRGb2N1cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBnZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oY29udmVyc2F0aW9uSWQsIHtcbiAgICAgICAgaXNHcm91cDogaXNHcm91cCh0aGlzLmF0dHJpYnV0ZXMpLFxuICAgICAgICBsaW1pdDogTUVTU0FHRV9MT0FEX0NIVU5LX1NJWkUsXG4gICAgICAgIHN0b3J5SWQ6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjbGVhbmVkOiBBcnJheTxNZXNzYWdlTW9kZWw+ID0gYXdhaXQgdGhpcy5jbGVhbk1vZGVscyhtZXNzYWdlcyk7XG4gICAgICBjb25zdCBzY3JvbGxUb01lc3NhZ2VJZCA9XG4gICAgICAgIHNldEZvY3VzICYmIG1ldHJpY3MubmV3ZXN0ID8gbWV0cmljcy5uZXdlc3QuaWQgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIEJlY2F1c2Ugb3VyIGBnZXRPbGRlck1lc3NhZ2VzYCBmZXRjaCBhYm92ZSBkaWRuJ3Qgc3BlY2lmeSBhIHJlY2VpdmVkQXQsIHdlIGdvdFxuICAgICAgLy8gICB0aGUgbW9zdCByZWNlbnQgTiBtZXNzYWdlcyBpbiB0aGUgY29udmVyc2F0aW9uLiBJZiBpdCBoYXMgYSBjb25mbGljdCB3aXRoXG4gICAgICAvLyAgIG1ldHJpY3MsIGZldGNoZWQgYSBiaXQgYmVmb3JlLCB0aGF0J3MgbGlrZWx5IGEgcmFjZSBjb25kaXRpb24uIFNvIHdlIHRlbGwgb3VyXG4gICAgICAvLyAgIHJlZHVjZXIgdG8gdHJ1c3QgdGhlIG1lc3NhZ2Ugc2V0IHdlIGp1c3QgZmV0Y2hlZCBmb3IgZGV0ZXJtaW5pbmcgaWYgd2UgaGF2ZVxuICAgICAgLy8gICB0aGUgbmV3ZXN0IG1lc3NhZ2UgbG9hZGVkLlxuICAgICAgY29uc3QgdW5ib3VuZGVkRmV0Y2ggPSB0cnVlO1xuICAgICAgbWVzc2FnZXNSZXNldCh7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBtZXNzYWdlczogY2xlYW5lZC5tYXAoKG1lc3NhZ2VNb2RlbDogTWVzc2FnZU1vZGVsKSA9PiAoe1xuICAgICAgICAgIC4uLm1lc3NhZ2VNb2RlbC5hdHRyaWJ1dGVzLFxuICAgICAgICB9KSksXG4gICAgICAgIG1ldHJpY3MsXG4gICAgICAgIHNjcm9sbFRvTWVzc2FnZUlkLFxuICAgICAgICB1bmJvdW5kZWRGZXRjaCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlKGNvbnZlcnNhdGlvbklkLCB1bmRlZmluZWQpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH1cbiAgfVxuICBhc3luYyBsb2FkT2xkZXJNZXNzYWdlcyhvbGRlc3RNZXNzYWdlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbWVzc2FnZXNBZGRlZCwgc2V0TWVzc2FnZUxvYWRpbmdTdGF0ZSwgcmVwYWlyT2xkZXN0TWVzc2FnZSB9ID1cbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucztcbiAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHRoaXMuaWQ7XG5cbiAgICBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlKFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBUaW1lbGluZU1lc3NhZ2VMb2FkaW5nU3RhdGUuTG9hZGluZ09sZGVyTWVzc2FnZXNcbiAgICApO1xuICAgIGNvbnN0IGZpbmlzaCA9IHRoaXMuc2V0SW5Qcm9ncmVzc0ZldGNoKCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG9sZGVzdE1lc3NhZ2VJZCk7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBsb2FkT2xkZXJNZXNzYWdlczogZmFpbGVkIHRvIGxvYWQgbWVzc2FnZSAke29sZGVzdE1lc3NhZ2VJZH1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY2VpdmVkQXQgPSBtZXNzYWdlLnJlY2VpdmVkX2F0O1xuICAgICAgY29uc3Qgc2VudEF0ID0gbWVzc2FnZS5zZW50X2F0O1xuICAgICAgY29uc3QgbW9kZWxzID0gYXdhaXQgZ2V0T2xkZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkLCB7XG4gICAgICAgIGlzR3JvdXA6IGlzR3JvdXAodGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgICAgbGltaXQ6IE1FU1NBR0VfTE9BRF9DSFVOS19TSVpFLFxuICAgICAgICBtZXNzYWdlSWQ6IG9sZGVzdE1lc3NhZ2VJZCxcbiAgICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgICAgc2VudEF0LFxuICAgICAgICBzdG9yeUlkOiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgaWYgKG1vZGVscy5sZW5ndGggPCAxKSB7XG4gICAgICAgIGxvZy53YXJuKCdsb2FkT2xkZXJNZXNzYWdlczogcmVxdWVzdGVkLCBidXQgbG9hZGVkIG5vIG1lc3NhZ2VzJyk7XG4gICAgICAgIHJlcGFpck9sZGVzdE1lc3NhZ2UoY29udmVyc2F0aW9uSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNsZWFuZWQgPSBhd2FpdCB0aGlzLmNsZWFuTW9kZWxzKG1vZGVscyk7XG5cbiAgICAgIG1lc3NhZ2VzQWRkZWQoe1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgbWVzc2FnZXM6IGNsZWFuZWQubWFwKChtZXNzYWdlTW9kZWw6IE1lc3NhZ2VNb2RlbCkgPT4gKHtcbiAgICAgICAgICAuLi5tZXNzYWdlTW9kZWwuYXR0cmlidXRlcyxcbiAgICAgICAgfSkpLFxuICAgICAgICBpc0FjdGl2ZTogd2luZG93LlNpZ25hbENvbnRleHQuYWN0aXZlV2luZG93U2VydmljZS5pc0FjdGl2ZSgpLFxuICAgICAgICBpc0p1c3RTZW50OiBmYWxzZSxcbiAgICAgICAgaXNOZXdNZXNzYWdlOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlKGNvbnZlcnNhdGlvbklkLCB1bmRlZmluZWQpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWROZXdlck1lc3NhZ2VzKG5ld2VzdE1lc3NhZ2VJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtZXNzYWdlc0FkZGVkLCBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlLCByZXBhaXJOZXdlc3RNZXNzYWdlIH0gPVxuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gdGhpcy5pZDtcblxuICAgIHNldE1lc3NhZ2VMb2FkaW5nU3RhdGUoXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIFRpbWVsaW5lTWVzc2FnZUxvYWRpbmdTdGF0ZS5Mb2FkaW5nTmV3ZXJNZXNzYWdlc1xuICAgICk7XG4gICAgY29uc3QgZmluaXNoID0gdGhpcy5zZXRJblByb2dyZXNzRmV0Y2goKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobmV3ZXN0TWVzc2FnZUlkKTtcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGxvYWROZXdlck1lc3NhZ2VzOiBmYWlsZWQgdG8gbG9hZCBtZXNzYWdlICR7bmV3ZXN0TWVzc2FnZUlkfWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVjZWl2ZWRBdCA9IG1lc3NhZ2UucmVjZWl2ZWRfYXQ7XG4gICAgICBjb25zdCBzZW50QXQgPSBtZXNzYWdlLnNlbnRfYXQ7XG4gICAgICBjb25zdCBtb2RlbHMgPSBhd2FpdCBnZXROZXdlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oY29udmVyc2F0aW9uSWQsIHtcbiAgICAgICAgaXNHcm91cDogaXNHcm91cCh0aGlzLmF0dHJpYnV0ZXMpLFxuICAgICAgICBsaW1pdDogTUVTU0FHRV9MT0FEX0NIVU5LX1NJWkUsXG4gICAgICAgIHJlY2VpdmVkQXQsXG4gICAgICAgIHNlbnRBdCxcbiAgICAgICAgc3RvcnlJZDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChtb2RlbHMubGVuZ3RoIDwgMSkge1xuICAgICAgICBsb2cud2FybignbG9hZE5ld2VyTWVzc2FnZXM6IHJlcXVlc3RlZCwgYnV0IGxvYWRlZCBubyBtZXNzYWdlcycpO1xuICAgICAgICByZXBhaXJOZXdlc3RNZXNzYWdlKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjbGVhbmVkID0gYXdhaXQgdGhpcy5jbGVhbk1vZGVscyhtb2RlbHMpO1xuICAgICAgbWVzc2FnZXNBZGRlZCh7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBtZXNzYWdlczogY2xlYW5lZC5tYXAoKG1lc3NhZ2VNb2RlbDogTWVzc2FnZU1vZGVsKSA9PiAoe1xuICAgICAgICAgIC4uLm1lc3NhZ2VNb2RlbC5hdHRyaWJ1dGVzLFxuICAgICAgICB9KSksXG4gICAgICAgIGlzQWN0aXZlOiB3aW5kb3cuU2lnbmFsQ29udGV4dC5hY3RpdmVXaW5kb3dTZXJ2aWNlLmlzQWN0aXZlKCksXG4gICAgICAgIGlzSnVzdFNlbnQ6IGZhbHNlLFxuICAgICAgICBpc05ld01lc3NhZ2U6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNldE1lc3NhZ2VMb2FkaW5nU3RhdGUoY29udmVyc2F0aW9uSWQsIHVuZGVmaW5lZCk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZmluaXNoKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZEFuZFNjcm9sbChcbiAgICBtZXNzYWdlSWQ6IHN0cmluZyxcbiAgICBvcHRpb25zPzogeyBkaXNhYmxlU2Nyb2xsPzogYm9vbGVhbiB9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbWVzc2FnZXNSZXNldCwgc2V0TWVzc2FnZUxvYWRpbmdTdGF0ZSB9ID1cbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucztcbiAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHRoaXMuaWQ7XG5cbiAgICBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlKFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBUaW1lbGluZU1lc3NhZ2VMb2FkaW5nU3RhdGUuRG9pbmdJbml0aWFsTG9hZFxuICAgICk7XG4gICAgY29uc3QgZmluaXNoID0gdGhpcy5zZXRJblByb2dyZXNzRmV0Y2goKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobWVzc2FnZUlkKTtcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGxvYWRNb3JlQW5kU2Nyb2xsOiBmYWlsZWQgdG8gbG9hZCBtZXNzYWdlICR7bWVzc2FnZUlkfWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVjZWl2ZWRBdCA9IG1lc3NhZ2UucmVjZWl2ZWRfYXQ7XG4gICAgICBjb25zdCBzZW50QXQgPSBtZXNzYWdlLnNlbnRfYXQ7XG4gICAgICBjb25zdCB7IG9sZGVyLCBuZXdlciwgbWV0cmljcyB9ID1cbiAgICAgICAgYXdhaXQgZ2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZSh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgaXNHcm91cDogaXNHcm91cCh0aGlzLmF0dHJpYnV0ZXMpLFxuICAgICAgICAgIGxpbWl0OiBNRVNTQUdFX0xPQURfQ0hVTktfU0laRSxcbiAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgICAgICBzZW50QXQsXG4gICAgICAgICAgc3RvcnlJZDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IGFsbCA9IFsuLi5vbGRlciwgbWVzc2FnZSwgLi4ubmV3ZXJdO1xuXG4gICAgICBjb25zdCBjbGVhbmVkOiBBcnJheTxNZXNzYWdlTW9kZWw+ID0gYXdhaXQgdGhpcy5jbGVhbk1vZGVscyhhbGwpO1xuICAgICAgY29uc3Qgc2Nyb2xsVG9NZXNzYWdlSWQgPVxuICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMuZGlzYWJsZVNjcm9sbCA/IHVuZGVmaW5lZCA6IG1lc3NhZ2VJZDtcblxuICAgICAgbWVzc2FnZXNSZXNldCh7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBtZXNzYWdlczogY2xlYW5lZC5tYXAoKG1lc3NhZ2VNb2RlbDogTWVzc2FnZU1vZGVsKSA9PiAoe1xuICAgICAgICAgIC4uLm1lc3NhZ2VNb2RlbC5hdHRyaWJ1dGVzLFxuICAgICAgICB9KSksXG4gICAgICAgIG1ldHJpY3MsXG4gICAgICAgIHNjcm9sbFRvTWVzc2FnZUlkLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNldE1lc3NhZ2VMb2FkaW5nU3RhdGUoY29udmVyc2F0aW9uSWQsIHVuZGVmaW5lZCk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZmluaXNoKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xlYW5Nb2RlbHMoXG4gICAgbWVzc2FnZXM6IFJlYWRvbmx5QXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPlxuICApOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VNb2RlbD4+IHtcbiAgICBjb25zdCByZXN1bHQgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcihtZXNzYWdlID0+IEJvb2xlYW4obWVzc2FnZS5pZCkpXG4gICAgICAubWFwKG1lc3NhZ2UgPT4gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKG1lc3NhZ2UuaWQsIG1lc3NhZ2UpKTtcblxuICAgIGNvbnN0IGVsaW1pbmF0ZWQgPSBtZXNzYWdlcy5sZW5ndGggLSByZXN1bHQubGVuZ3RoO1xuICAgIGlmIChlbGltaW5hdGVkID4gMCkge1xuICAgICAgbG9nLndhcm4oYGNsZWFuTW9kZWxzOiBFbGltaW5hdGVkICR7ZWxpbWluYXRlZH0gbWVzc2FnZXMgd2l0aG91dCBhbiBpZGApO1xuICAgIH1cbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKTtcblxuICAgIGxldCB1cGdyYWRlZCA9IDA7XG4gICAgZm9yIChsZXQgbWF4ID0gcmVzdWx0Lmxlbmd0aCwgaSA9IDA7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3VsdFtpXTtcbiAgICAgIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gbWVzc2FnZTtcbiAgICAgIGNvbnN0IHsgc2NoZW1hVmVyc2lvbiB9ID0gYXR0cmlidXRlcztcblxuICAgICAgaWYgKHNjaGVtYVZlcnNpb24gPCBNZXNzYWdlLlZFUlNJT05fTkVFREVEX0ZPUl9ESVNQTEFZKSB7XG4gICAgICAgIC8vIFllcCwgd2UgcmVhbGx5IGRvIHdhbnQgdG8gd2FpdCBmb3IgZWFjaCBvZiB0aGVzZVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBjb25zdCB1cGdyYWRlZE1lc3NhZ2UgPSBhd2FpdCB1cGdyYWRlTWVzc2FnZVNjaGVtYShhdHRyaWJ1dGVzKTtcbiAgICAgICAgbWVzc2FnZS5zZXQodXBncmFkZWRNZXNzYWdlKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKHVwZ3JhZGVkTWVzc2FnZSwgeyBvdXJVdWlkIH0pO1xuICAgICAgICB1cGdyYWRlZCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodXBncmFkZWQgPiAwKSB7XG4gICAgICBsb2cud2FybihgY2xlYW5Nb2RlbHM6IFVwZ3JhZGVkIHNjaGVtYSBvZiAke3VwZ3JhZGVkfSBtZXNzYWdlc2ApO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHJlc3VsdC5tYXAobW9kZWwgPT4gbW9kZWwuaHlkcmF0ZVN0b3J5Q29udGV4dCgpKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZm9ybWF0KCk6IENvbnZlcnNhdGlvblR5cGUge1xuICAgIGlmICh0aGlzLmNhY2hlZFByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZWRQcm9wcztcbiAgICB9XG5cbiAgICBjb25zdCBvbGRGb3JtYXQgPSB0aGlzLmZvcm1hdDtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIGNyYXNoIG9yIGhhdmUgYW4gaW5maW5pdGUgbG9vcCBpZiB3ZSBsb29wIGJhY2sgaW50byB0aGlzIGZ1bmN0aW9uXG4gICAgLy8gICBhZ2Fpbi4gV2UnbGwgbG9nIGEgd2FybmluZyBhbmQgcmV0dXJuZWQgb2xkIGNhY2hlZCBwcm9wcyBvciB0aHJvdyBhbiBlcnJvci5cbiAgICB0aGlzLmZvcm1hdCA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5vbGRDYWNoZWRQcm9wcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENvbnZlcnNhdGlvbi5mb3JtYXQoKS8ke3RoaXMuaWRGb3JMb2dnaW5nKCl9IHJlZW50cmFudCBjYWxsLCBubyBvbGQgY2FjaGVkIHByb3BzIWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gbmV3IEVycm9yKCdmb3Igc3RhY2snKTtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgQ29udmVyc2F0aW9uLmZvcm1hdCgpLyR7dGhpcy5pZEZvckxvZ2dpbmcoKX0gcmVlbnRyYW50IGNhbGwhICR7c3RhY2t9YFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHRoaXMub2xkQ2FjaGVkUHJvcHM7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmNhY2hlZFByb3BzID0gdGhpcy5nZXRQcm9wcygpO1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUHJvcHM7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuZm9ybWF0ID0gb2xkRm9ybWF0O1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdGU6IHRoaXMgc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCBkaXJlY3RseS4gVXNlIGNvbnZlcnNhdGlvbi5mb3JtYXQoKSBpbnN0ZWFkLCB3aGljaFxuICAvLyAgIG1haW50YWlucyBhIGNhY2hlLCBhbmQgcHJvdGVjdHMgYWdhaW5zdCByZWVudHJhbnQgY2FsbHMuXG4gIC8vIE5vdGU6IFdoZW4gd3JpdGluZyBjb2RlIGluc2lkZSB0aGlzIGZ1bmN0aW9uLCBkbyBub3QgY2FsbCAuZm9ybWF0KCkgb24gYSBjb252ZXJzYXRpb25cbiAgLy8gICB1bmxlc3MgeW91IGFyZSBzdXJlIHRoYXQgaXQncyBub3QgdGhpcyB2ZXJ5IHNhbWUgY29udmVyc2F0aW9uLlxuICAvLyBOb3RlOiBJZiB5b3Ugc3RhcnQgcmVseWluZyBvbiBhbiBhdHRyaWJ1dGUgdGhhdCBpcyBpblxuICAvLyAgIGBBVFRSSUJVVEVTX1RIQVRfRE9OVF9JTlZBTElEQVRFX1BST1BTX0NBQ0hFYCwgcmVtb3ZlIGl0IGZyb20gdGhhdCBsaXN0LlxuICBwcml2YXRlIGdldFByb3BzKCk6IENvbnZlcnNhdGlvblR5cGUge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmdldENvbG9yKCkhO1xuXG4gICAgbGV0IGxhc3RNZXNzYWdlOlxuICAgICAgfCB1bmRlZmluZWRcbiAgICAgIHwge1xuICAgICAgICAgIHN0YXR1cz86IExhc3RNZXNzYWdlU3RhdHVzO1xuICAgICAgICAgIHRleHQ6IHN0cmluZztcbiAgICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB8IHsgZGVsZXRlZEZvckV2ZXJ5b25lOiB0cnVlIH07XG5cbiAgICBpZiAodGhpcy5nZXQoJ2xhc3RNZXNzYWdlRGVsZXRlZEZvckV2ZXJ5b25lJykpIHtcbiAgICAgIGxhc3RNZXNzYWdlID0geyBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGFzdE1lc3NhZ2VUZXh0ID0gdGhpcy5nZXQoJ2xhc3RNZXNzYWdlJyk7XG4gICAgICBpZiAobGFzdE1lc3NhZ2VUZXh0KSB7XG4gICAgICAgIGxhc3RNZXNzYWdlID0ge1xuICAgICAgICAgIHN0YXR1czogZHJvcE51bGwodGhpcy5nZXQoJ2xhc3RNZXNzYWdlU3RhdHVzJykpLFxuICAgICAgICAgIHRleHQ6IGxhc3RNZXNzYWdlVGV4dCxcbiAgICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHR5cGluZ1ZhbHVlcyA9IHdpbmRvdy5fLnZhbHVlcyh0aGlzLmNvbnRhY3RUeXBpbmdUaW1lcnMgfHwge30pO1xuICAgIGNvbnN0IHR5cGluZ01vc3RSZWNlbnQgPSB3aW5kb3cuXy5maXJzdChcbiAgICAgIHdpbmRvdy5fLnNvcnRCeSh0eXBpbmdWYWx1ZXMsICd0aW1lc3RhbXAnKVxuICAgICk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IHRoaXMuZ2V0KCd0aW1lc3RhbXAnKSE7XG4gICAgY29uc3QgZHJhZnRUaW1lc3RhbXAgPSB0aGlzLmdldCgnZHJhZnRUaW1lc3RhbXAnKTtcbiAgICBjb25zdCBkcmFmdFByZXZpZXcgPSB0aGlzLmdldERyYWZ0UHJldmlldygpO1xuICAgIGNvbnN0IGRyYWZ0VGV4dCA9IHRoaXMuZ2V0KCdkcmFmdCcpO1xuICAgIGNvbnN0IGRyYWZ0Qm9keVJhbmdlcyA9IHRoaXMuZ2V0KCdkcmFmdEJvZHlSYW5nZXMnKTtcbiAgICBjb25zdCBzaG91bGRTaG93RHJhZnQgPSAodGhpcy5oYXNEcmFmdCgpICYmXG4gICAgICBkcmFmdFRpbWVzdGFtcCAmJlxuICAgICAgZHJhZnRUaW1lc3RhbXAgPj0gdGltZXN0YW1wKSBhcyBib29sZWFuO1xuICAgIGNvbnN0IGluYm94UG9zaXRpb24gPSB0aGlzLmdldCgnaW5ib3hfcG9zaXRpb24nKTtcbiAgICBjb25zdCBtZXNzYWdlUmVxdWVzdHNFbmFibGVkID0gd2luZG93LlNpZ25hbC5SZW1vdGVDb25maWcuaXNFbmFibGVkKFxuICAgICAgJ2Rlc2t0b3AubWVzc2FnZVJlcXVlc3RzJ1xuICAgICk7XG4gICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcblxuICAgIGxldCBncm91cFZlcnNpb246IHVuZGVmaW5lZCB8IDEgfCAyO1xuICAgIGlmIChpc0dyb3VwVjEodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgZ3JvdXBWZXJzaW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBncm91cFZlcnNpb24gPSAyO1xuICAgIH1cblxuICAgIGNvbnN0IHNvcnRlZEdyb3VwTWVtYmVycyA9IGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICA/IHRoaXMuZ2V0TWVtYmVycygpXG4gICAgICAgICAgLnNvcnQoKGxlZnQsIHJpZ2h0KSA9PlxuICAgICAgICAgICAgc29ydENvbnZlcnNhdGlvblRpdGxlcyhsZWZ0LCByaWdodCwgdGhpcy5pbnRsQ29sbGF0b3IpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5tYXAobWVtYmVyID0+IG1lbWJlci5mb3JtYXQoKSlcbiAgICAgICAgICAuZmlsdGVyKGlzTm90TmlsKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCB7IGN1c3RvbUNvbG9yLCBjdXN0b21Db2xvcklkIH0gPSB0aGlzLmdldEN1c3RvbUNvbG9yRGF0YSgpO1xuXG4gICAgY29uc3Qgb3VyQUNJID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgICBjb25zdCBvdXJQTkkgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuXG4gICAgLy8gVE9ETzogREVTS1RPUC03MjBcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICB1dWlkOiB0aGlzLmdldCgndXVpZCcpLFxuICAgICAgZTE2NDogdGhpcy5nZXQoJ2UxNjQnKSxcblxuICAgICAgLy8gV2UgaGFkIHByZXZpb3VzbHkgc3RvcmVkIGBudWxsYCBpbnN0ZWFkIG9mIGB1bmRlZmluZWRgIGluIHNvbWUgY2FzZXMuIFdlIHNob3VsZFxuICAgICAgLy8gICBiZSBhYmxlIHRvIHJlbW92ZSB0aGlzIGBkcm9wTnVsbGAgb25jZSB1c2VybmFtZXMgaGF2ZSBnb25lIHRvIHByb2R1Y3Rpb24uXG4gICAgICB1c2VybmFtZTogZHJvcE51bGwodGhpcy5nZXQoJ3VzZXJuYW1lJykpLFxuXG4gICAgICBhYm91dDogdGhpcy5nZXRBYm91dFRleHQoKSxcbiAgICAgIGFib3V0VGV4dDogdGhpcy5nZXQoJ2Fib3V0JyksXG4gICAgICBhYm91dEVtb2ppOiB0aGlzLmdldCgnYWJvdXRFbW9qaScpLFxuICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogdGhpcy5nZXRBY2NlcHRlZCgpLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgIGFjdGl2ZUF0OiB0aGlzLmdldCgnYWN0aXZlX2F0JykhLFxuICAgICAgYXJlV2VQZW5kaW5nOlxuICAgICAgICBvdXJBQ0kgJiZcbiAgICAgICAgKHRoaXMuaXNNZW1iZXJQZW5kaW5nKG91ckFDSSkgfHxcbiAgICAgICAgICBCb29sZWFuKFxuICAgICAgICAgICAgb3VyUE5JICYmICF0aGlzLmlzTWVtYmVyKG91ckFDSSkgJiYgdGhpcy5pc01lbWJlclBlbmRpbmcob3VyUE5JKVxuICAgICAgICAgICkpLFxuICAgICAgYXJlV2VQZW5kaW5nQXBwcm92YWw6IEJvb2xlYW4oXG4gICAgICAgIG91ckNvbnZlcnNhdGlvbklkICYmIG91ckFDSSAmJiB0aGlzLmlzTWVtYmVyQXdhaXRpbmdBcHByb3ZhbChvdXJBQ0kpXG4gICAgICApLFxuICAgICAgYXJlV2VBZG1pbjogdGhpcy5hcmVXZUFkbWluKCksXG4gICAgICBhdmF0YXJzOiBnZXRBdmF0YXJEYXRhKHRoaXMuYXR0cmlidXRlcyksXG4gICAgICBiYWRnZXM6IHRoaXMuZ2V0KCdiYWRnZXMnKSB8fCBbXSxcbiAgICAgIGNhbkNoYW5nZVRpbWVyOiB0aGlzLmNhbkNoYW5nZVRpbWVyKCksXG4gICAgICBjYW5FZGl0R3JvdXBJbmZvOiB0aGlzLmNhbkVkaXRHcm91cEluZm8oKSxcbiAgICAgIGF2YXRhclBhdGg6IHRoaXMuZ2V0QWJzb2x1dGVBdmF0YXJQYXRoKCksXG4gICAgICBhdmF0YXJIYXNoOiB0aGlzLmdldEF2YXRhckhhc2goKSxcbiAgICAgIHVuYmx1cnJlZEF2YXRhclBhdGg6IHRoaXMuZ2V0QWJzb2x1dGVVbmJsdXJyZWRBdmF0YXJQYXRoKCksXG4gICAgICBwcm9maWxlQXZhdGFyUGF0aDogdGhpcy5nZXRBYnNvbHV0ZVByb2ZpbGVBdmF0YXJQYXRoKCksXG4gICAgICBjb2xvcixcbiAgICAgIGNvbnZlcnNhdGlvbkNvbG9yOiB0aGlzLmdldENvbnZlcnNhdGlvbkNvbG9yKCksXG4gICAgICBjdXN0b21Db2xvcixcbiAgICAgIGN1c3RvbUNvbG9ySWQsXG4gICAgICBkaXNjb3ZlcmVkVW5yZWdpc3RlcmVkQXQ6IHRoaXMuZ2V0KCdkaXNjb3ZlcmVkVW5yZWdpc3RlcmVkQXQnKSxcbiAgICAgIGRyYWZ0Qm9keVJhbmdlcyxcbiAgICAgIGRyYWZ0UHJldmlldyxcbiAgICAgIGRyYWZ0VGV4dCxcbiAgICAgIGZhbWlseU5hbWU6IHRoaXMuZ2V0KCdwcm9maWxlRmFtaWx5TmFtZScpLFxuICAgICAgZmlyc3ROYW1lOiB0aGlzLmdldCgncHJvZmlsZU5hbWUnKSxcbiAgICAgIGdyb3VwRGVzY3JpcHRpb246IHRoaXMuZ2V0KCdkZXNjcmlwdGlvbicpLFxuICAgICAgZ3JvdXBWZXJzaW9uLFxuICAgICAgZ3JvdXBJZDogdGhpcy5nZXQoJ2dyb3VwSWQnKSxcbiAgICAgIGdyb3VwTGluazogdGhpcy5nZXRHcm91cExpbmsoKSxcbiAgICAgIGlzR3JvdXBTdG9yeVNlbmRSZWFkeTogQm9vbGVhbih0aGlzLmdldCgnaXNHcm91cFN0b3J5U2VuZFJlYWR5JykpLFxuICAgICAgaGlkZVN0b3J5OiBCb29sZWFuKHRoaXMuZ2V0KCdoaWRlU3RvcnknKSksXG4gICAgICBpbmJveFBvc2l0aW9uLFxuICAgICAgaXNBcmNoaXZlZDogdGhpcy5nZXQoJ2lzQXJjaGl2ZWQnKSxcbiAgICAgIGlzQmxvY2tlZDogdGhpcy5pc0Jsb2NrZWQoKSxcbiAgICAgIGlzTWU6IGlzTWUodGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgIGlzR3JvdXBWMUFuZERpc2FibGVkOiB0aGlzLmlzR3JvdXBWMUFuZERpc2FibGVkKCksXG4gICAgICBpc1Bpbm5lZDogdGhpcy5nZXQoJ2lzUGlubmVkJyksXG4gICAgICBpc1VudHJ1c3RlZDogdGhpcy5pc1VudHJ1c3RlZCgpLFxuICAgICAgaXNWZXJpZmllZDogdGhpcy5pc1ZlcmlmaWVkKCksXG4gICAgICBpc0ZldGNoaW5nVVVJRDogdGhpcy5pc0ZldGNoaW5nVVVJRCxcbiAgICAgIGxhc3RNZXNzYWdlLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgIGxhc3RVcGRhdGVkOiB0aGlzLmdldCgndGltZXN0YW1wJykhLFxuICAgICAgbGVmdDogQm9vbGVhbih0aGlzLmdldCgnbGVmdCcpKSxcbiAgICAgIG1hcmtlZFVucmVhZDogdGhpcy5nZXQoJ21hcmtlZFVucmVhZCcpLFxuICAgICAgbWVtYmVyc0NvdW50OiB0aGlzLmdldE1lbWJlcnNDb3VudCgpLFxuICAgICAgbWVtYmVyc2hpcHM6IHRoaXMuZ2V0TWVtYmVyc2hpcHMoKSxcbiAgICAgIG1lc3NhZ2VDb3VudDogdGhpcy5nZXQoJ21lc3NhZ2VDb3VudCcpIHx8IDAsXG4gICAgICBwZW5kaW5nTWVtYmVyc2hpcHM6IHRoaXMuZ2V0UGVuZGluZ01lbWJlcnNoaXBzKCksXG4gICAgICBwZW5kaW5nQXBwcm92YWxNZW1iZXJzaGlwczogdGhpcy5nZXRQZW5kaW5nQXBwcm92YWxNZW1iZXJzaGlwcygpLFxuICAgICAgYmFubmVkTWVtYmVyc2hpcHM6IHRoaXMuZ2V0QmFubmVkTWVtYmVyc2hpcHMoKSxcbiAgICAgIHByb2ZpbGVLZXk6IHRoaXMuZ2V0KCdwcm9maWxlS2V5JyksXG4gICAgICBtZXNzYWdlUmVxdWVzdHNFbmFibGVkLFxuICAgICAgYWNjZXNzQ29udHJvbEFkZEZyb21JbnZpdGVMaW5rOlxuICAgICAgICB0aGlzLmdldCgnYWNjZXNzQ29udHJvbCcpPy5hZGRGcm9tSW52aXRlTGluayxcbiAgICAgIGFjY2Vzc0NvbnRyb2xBdHRyaWJ1dGVzOiB0aGlzLmdldCgnYWNjZXNzQ29udHJvbCcpPy5hdHRyaWJ1dGVzLFxuICAgICAgYWNjZXNzQ29udHJvbE1lbWJlcnM6IHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/Lm1lbWJlcnMsXG4gICAgICBhbm5vdW5jZW1lbnRzT25seTogQm9vbGVhbih0aGlzLmdldCgnYW5ub3VuY2VtZW50c09ubHknKSksXG4gICAgICBhbm5vdW5jZW1lbnRzT25seVJlYWR5OiB0aGlzLmNhbkJlQW5ub3VuY2VtZW50R3JvdXAoKSxcbiAgICAgIGV4cGlyZVRpbWVyOiB0aGlzLmdldCgnZXhwaXJlVGltZXInKSxcbiAgICAgIG11dGVFeHBpcmVzQXQ6IHRoaXMuZ2V0KCdtdXRlRXhwaXJlc0F0JyksXG4gICAgICBkb250Tm90aWZ5Rm9yTWVudGlvbnNJZk11dGVkOiB0aGlzLmdldCgnZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZCcpLFxuICAgICAgbmFtZTogdGhpcy5nZXQoJ25hbWUnKSxcbiAgICAgIHBob25lTnVtYmVyOiB0aGlzLmdldE51bWJlcigpLFxuICAgICAgcHJvZmlsZU5hbWU6IHRoaXMuZ2V0UHJvZmlsZU5hbWUoKSxcbiAgICAgIHByb2ZpbGVTaGFyaW5nOiB0aGlzLmdldCgncHJvZmlsZVNoYXJpbmcnKSxcbiAgICAgIHB1YmxpY1BhcmFtczogdGhpcy5nZXQoJ3B1YmxpY1BhcmFtcycpLFxuICAgICAgc2VjcmV0UGFyYW1zOiB0aGlzLmdldCgnc2VjcmV0UGFyYW1zJyksXG4gICAgICBzaG91bGRTaG93RHJhZnQsXG4gICAgICBzb3J0ZWRHcm91cE1lbWJlcnMsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB0aXRsZTogdGhpcy5nZXRUaXRsZSgpLFxuICAgICAgdHlwaW5nQ29udGFjdElkOiB0eXBpbmdNb3N0UmVjZW50Py5zZW5kZXJJZCxcbiAgICAgIHNlYXJjaGFibGVUaXRsZTogaXNNZSh0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICAgID8gd2luZG93LmkxOG4oJ25vdGVUb1NlbGYnKVxuICAgICAgICA6IHRoaXMuZ2V0VGl0bGUoKSxcbiAgICAgIHVucmVhZENvdW50OiB0aGlzLmdldCgndW5yZWFkQ291bnQnKSB8fCAwLFxuICAgICAgLi4uKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgPyB7XG4gICAgICAgICAgICB0eXBlOiAnZGlyZWN0JyBhcyBjb25zdCxcbiAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM6IHRoaXMuZ2V0KCdzaGFyZWRHcm91cE5hbWVzJykgfHwgW10sXG4gICAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHR5cGU6ICdncm91cCcgYXMgY29uc3QsXG4gICAgICAgICAgICBhY2tub3dsZWRnZWRHcm91cE5hbWVDb2xsaXNpb25zOlxuICAgICAgICAgICAgICB0aGlzLmdldCgnYWNrbm93bGVkZ2VkR3JvdXBOYW1lQ29sbGlzaW9ucycpIHx8IHt9LFxuICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lczogW10sXG4gICAgICAgICAgfSksXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUUxNjQoZTE2ND86IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuZ2V0KCdlMTY0Jyk7XG4gICAgaWYgKGUxNjQgIT09IG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLnNldCgnZTE2NCcsIGUxNjQgfHwgdW5kZWZpbmVkKTtcblxuICAgICAgLy8gV2hlbiBvdXIgb3duIG51bWJlciBoYXMgY2hhbmdlZCAtIHJlc2V0IHBuaUNyZWRlbnRpYWxcbiAgICAgIGlmIChpc01lKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgICAgdGhpcy5zZXQoeyBwbmlDcmVkZW50aWFsOiBudWxsIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob2xkVmFsdWUgJiYgZTE2NCkge1xuICAgICAgICB0aGlzLmFkZENoYW5nZU51bWJlck5vdGlmaWNhdGlvbihvbGRWYWx1ZSwgZTE2NCk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIHRoaXMudHJpZ2dlcignaWRVcGRhdGVkJywgdGhpcywgJ2UxNjQnLCBvbGRWYWx1ZSk7XG4gICAgICB0aGlzLmNhcHR1cmVDaGFuZ2UoJ3VwZGF0ZUUxNjQnKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVVdWlkKHV1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuZ2V0KCd1dWlkJyk7XG4gICAgaWYgKHV1aWQgIT09IG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLnNldCgndXVpZCcsIHV1aWQgPyBVVUlELmNhc3QodXVpZC50b0xvd2VyQ2FzZSgpKSA6IHVuZGVmaW5lZCk7XG4gICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2lkVXBkYXRlZCcsIHRoaXMsICd1dWlkJywgb2xkVmFsdWUpO1xuICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCd1cGRhdGVVdWlkJyk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUG5pKHBuaT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5nZXQoJ3BuaScpO1xuICAgIGlmIChwbmkgIT09IG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLnNldCgncG5pJywgcG5pID8gVVVJRC5jYXN0KHBuaS50b0xvd2VyQ2FzZSgpKSA6IHVuZGVmaW5lZCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgb2xkVmFsdWUgJiZcbiAgICAgICAgcG5pICYmXG4gICAgICAgICghdGhpcy5nZXQoJ3V1aWQnKSB8fCB0aGlzLmdldCgndXVpZCcpID09PSBvbGRWYWx1ZSlcbiAgICAgICkge1xuICAgICAgICAvLyBUT0RPOiBERVNLVE9QLTM5NzRcbiAgICAgICAgdGhpcy5hZGRLZXlDaGFuZ2UoVVVJRC5jaGVja2VkTG9va3VwKG9sZFZhbHVlKSk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIHRoaXMudHJpZ2dlcignaWRVcGRhdGVkJywgdGhpcywgJ3BuaScsIG9sZFZhbHVlKTtcbiAgICAgIHRoaXMuY2FwdHVyZUNoYW5nZSgndXBkYXRlUG5pJyk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlR3JvdXBJZChncm91cElkPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmdldCgnZ3JvdXBJZCcpO1xuICAgIGlmIChncm91cElkICYmIGdyb3VwSWQgIT09IG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLnNldCgnZ3JvdXBJZCcsIGdyb3VwSWQpO1xuICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdpZFVwZGF0ZWQnLCB0aGlzLCAnZ3JvdXBJZCcsIG9sZFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBpbmNyZW1lbnRNZXNzYWdlQ291bnQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXQoe1xuICAgICAgbWVzc2FnZUNvdW50OiAodGhpcy5nZXQoJ21lc3NhZ2VDb3VudCcpIHx8IDApICsgMSxcbiAgICB9KTtcbiAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICBnZXRNZW1iZXJzQ291bnQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBtZW1iZXJMaXN0ID0gdGhpcy5nZXQoJ21lbWJlcnNWMicpIHx8IHRoaXMuZ2V0KCdtZW1iZXJzJyk7XG5cbiAgICAvLyBXZSdsbCBmYWlsIG92ZXIgaWYgdGhlIG1lbWJlciBsaXN0IGlzIGVtcHR5XG4gICAgaWYgKG1lbWJlckxpc3QgJiYgbWVtYmVyTGlzdC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBtZW1iZXJMaXN0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wb3JhcnlNZW1iZXJDb3VudCA9IHRoaXMuZ2V0KCd0ZW1wb3JhcnlNZW1iZXJDb3VudCcpO1xuICAgIGlmIChpc051bWJlcih0ZW1wb3JhcnlNZW1iZXJDb3VudCkpIHtcbiAgICAgIHJldHVybiB0ZW1wb3JhcnlNZW1iZXJDb3VudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZGVjcmVtZW50TWVzc2FnZUNvdW50KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0KHtcbiAgICAgIG1lc3NhZ2VDb3VudDogTWF0aC5tYXgoKHRoaXMuZ2V0KCdtZXNzYWdlQ291bnQnKSB8fCAwKSAtIDEsIDApLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGluY3JlbWVudFNlbnRNZXNzYWdlQ291bnQoeyBkcnkgPSBmYWxzZSB9OiB7IGRyeT86IGJvb2xlYW4gfSA9IHt9KTpcbiAgICB8IFBhcnRpYWw8Q29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU+XG4gICAgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIG1lc3NhZ2VDb3VudDogKHRoaXMuZ2V0KCdtZXNzYWdlQ291bnQnKSB8fCAwKSArIDEsXG4gICAgICBzZW50TWVzc2FnZUNvdW50OiAodGhpcy5nZXQoJ3NlbnRNZXNzYWdlQ291bnQnKSB8fCAwKSArIDEsXG4gICAgfTtcblxuICAgIGlmIChkcnkpIHtcbiAgICAgIHJldHVybiB1cGRhdGU7XG4gICAgfVxuICAgIHRoaXMuc2V0KHVwZGF0ZSk7XG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGRlY3JlbWVudFNlbnRNZXNzYWdlQ291bnQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXQoe1xuICAgICAgbWVzc2FnZUNvdW50OiBNYXRoLm1heCgodGhpcy5nZXQoJ21lc3NhZ2VDb3VudCcpIHx8IDApIC0gMSwgMCksXG4gICAgICBzZW50TWVzc2FnZUNvdW50OiBNYXRoLm1heCgodGhpcy5nZXQoJ3NlbnRNZXNzYWdlQ291bnQnKSB8fCAwKSAtIDEsIDApLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgbWVzc2FnZSByZXF1ZXN0IGlzIGFjY2VwdGVkIGluIG9yZGVyIHRvXG4gICAqIGhhbmRsZSBzZW5kaW5nIHJlYWQgcmVjZWlwdHMgYW5kIGRvd25sb2FkIGFueSBwZW5kaW5nIGF0dGFjaG1lbnRzLlxuICAgKi9cbiAgYXN5bmMgaGFuZGxlUmVhZEFuZERvd25sb2FkQXR0YWNobWVudHMoXG4gICAgb3B0aW9uczogeyBpc0xvY2FsQWN0aW9uPzogYm9vbGVhbiB9ID0ge31cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBpc0xvY2FsQWN0aW9uIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpO1xuXG4gICAgbGV0IG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+IHwgdW5kZWZpbmVkO1xuICAgIGRvIHtcbiAgICAgIGNvbnN0IGZpcnN0ID0gbWVzc2FnZXMgPyBtZXNzYWdlc1swXSA6IHVuZGVmaW5lZDtcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIG1lc3NhZ2VzID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldE9sZGVyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbihcbiAgICAgICAgdGhpcy5nZXQoJ2lkJyksXG4gICAgICAgIHtcbiAgICAgICAgICBpc0dyb3VwOiBpc0dyb3VwKHRoaXMuYXR0cmlidXRlcyksXG4gICAgICAgICAgbGltaXQ6IDEwMCxcbiAgICAgICAgICBtZXNzYWdlSWQ6IGZpcnN0ID8gZmlyc3QuaWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgcmVjZWl2ZWRBdDogZmlyc3QgPyBmaXJzdC5yZWNlaXZlZF9hdCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzZW50QXQ6IGZpcnN0ID8gZmlyc3Quc2VudF9hdCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzdG9yeUlkOiB1bmRlZmluZWQsXG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVhZE1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKG0gPT4gIWhhc0Vycm9ycyhtKSAmJiBpc0luY29taW5nKG0pKTtcblxuICAgICAgaWYgKGlzTG9jYWxBY3Rpb24pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgcmVhZFJlY2VpcHRzSm9iUXVldWUuYWRkSWZBbGxvd2VkQnlVc2VyKFxuICAgICAgICAgIHdpbmRvdy5zdG9yYWdlLFxuICAgICAgICAgIHJlYWRNZXNzYWdlcy5tYXAobSA9PiAoe1xuICAgICAgICAgICAgbWVzc2FnZUlkOiBtLmlkLFxuICAgICAgICAgICAgc2VuZGVyRTE2NDogbS5zb3VyY2UsXG4gICAgICAgICAgICBzZW5kZXJVdWlkOiBtLnNvdXJjZVV1aWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG0uc2VudF9hdCxcbiAgICAgICAgICB9KSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICByZWFkTWVzc2FnZXMubWFwKGFzeW5jIG0gPT4ge1xuICAgICAgICAgIGNvbnN0IHJlZ2lzdGVyZWQgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIobS5pZCwgbSk7XG4gICAgICAgICAgY29uc3Qgc2hvdWxkU2F2ZSA9IGF3YWl0IHJlZ2lzdGVyZWQucXVldWVBdHRhY2htZW50RG93bmxvYWRzKCk7XG4gICAgICAgICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZShyZWdpc3RlcmVkLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgICAgb3VyVXVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSB3aGlsZSAobWVzc2FnZXMubGVuZ3RoID4gMCk7XG4gIH1cblxuICBhc3luYyBhcHBseU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoXG4gICAgcmVzcG9uc2U6IG51bWJlcixcbiAgICB7IGZyb21TeW5jID0gZmFsc2UsIHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyA9IGZhbHNlIH0gPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZVJlcXVlc3RFbnVtID0gUHJvdG8uU3luY01lc3NhZ2UuTWVzc2FnZVJlcXVlc3RSZXNwb25zZS5UeXBlO1xuICAgICAgY29uc3QgaXNMb2NhbEFjdGlvbiA9ICFmcm9tU3luYyAmJiAhdmlhU3RvcmFnZVNlcnZpY2VTeW5jO1xuXG4gICAgICBjb25zdCBjdXJyZW50TWVzc2FnZVJlcXVlc3RTdGF0ZSA9IHRoaXMuZ2V0KCdtZXNzYWdlUmVxdWVzdFJlc3BvbnNlVHlwZScpO1xuICAgICAgY29uc3QgZGlkUmVzcG9uc2VDaGFuZ2UgPSByZXNwb25zZSAhPT0gY3VycmVudE1lc3NhZ2VSZXF1ZXN0U3RhdGU7XG4gICAgICBjb25zdCB3YXNQcmV2aW91c2x5QWNjZXB0ZWQgPSB0aGlzLmdldEFjY2VwdGVkKCk7XG5cbiAgICAgIC8vIEFwcGx5IG1lc3NhZ2UgcmVxdWVzdCByZXNwb25zZSBsb2NhbGx5XG4gICAgICB0aGlzLnNldCh7XG4gICAgICAgIG1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlOiByZXNwb25zZSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzcG9uc2UgPT09IG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFQpIHtcbiAgICAgICAgdGhpcy51bmJsb2NrKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jIH0pO1xuICAgICAgICB0aGlzLmVuYWJsZVByb2ZpbGVTaGFyaW5nKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jIH0pO1xuXG4gICAgICAgIC8vIFdlIHJlYWxseSBkb24ndCB3YW50IHRvIGNhbGwgdGhpcyBpZiB3ZSBkb24ndCBoYXZlIHRvLiBJdCBjYW4gdGFrZSBhIGxvdCBvZlxuICAgICAgICAvLyAgIHRpbWUgdG8gZ28gdGhyb3VnaCBvbGQgbWVzc2FnZXMgdG8gZG93bmxvYWQgYXR0YWNobWVudHMuXG4gICAgICAgIGlmIChkaWRSZXNwb25zZUNoYW5nZSAmJiAhd2FzUHJldmlvdXNseUFjY2VwdGVkKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5oYW5kbGVSZWFkQW5kRG93bmxvYWRBdHRhY2htZW50cyh7IGlzTG9jYWxBY3Rpb24gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNMb2NhbEFjdGlvbikge1xuICAgICAgICAgIGNvbnN0IG91ckFDSSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChcbiAgICAgICAgICAgIFVVSURLaW5kLkFDSVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3Qgb3VyUE5JID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoVVVJREtpbmQuUE5JKTtcbiAgICAgICAgICBjb25zdCBvdXJDb252ZXJzYXRpb24gPVxuICAgICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uT3JUaHJvdygpO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXNHcm91cFYxKHRoaXMuYXR0cmlidXRlcykgfHxcbiAgICAgICAgICAgIGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2VuZFByb2ZpbGVLZXlVcGRhdGUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykgJiZcbiAgICAgICAgICAgIHRoaXMuaXNNZW1iZXJQZW5kaW5nKG91ckFDSSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubW9kaWZ5R3JvdXBWMih7XG4gICAgICAgICAgICAgIG5hbWU6ICdwcm9tb3RlUGVuZGluZ01lbWJlcicsXG4gICAgICAgICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbb3VyQ29udmVyc2F0aW9uXSxcbiAgICAgICAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IHRoaXMucHJvbW90ZVBlbmRpbmdNZW1iZXIoVVVJREtpbmQuQUNJKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBvdXJQTkkgJiZcbiAgICAgICAgICAgIGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpICYmXG4gICAgICAgICAgICB0aGlzLmlzTWVtYmVyUGVuZGluZyhvdXJQTkkpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICAgICAgICBuYW1lOiAncHJvbW90ZVBlbmRpbmdNZW1iZXInLFxuICAgICAgICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW291ckNvbnZlcnNhdGlvbl0sXG4gICAgICAgICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLnByb21vdGVQZW5kaW5nTWVtYmVyKFVVSURLaW5kLlBOSSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpICYmIHRoaXMuaXNNZW1iZXIob3VyQUNJKSkge1xuICAgICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAgICdhcHBseU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UvYWNjZXB0OiBBbHJlYWR5IGEgbWVtYmVyIG9mIHYyIGdyb3VwJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICAnYXBwbHlNZXNzYWdlUmVxdWVzdFJlc3BvbnNlL2FjY2VwdDogTmVpdGhlciBtZW1iZXIgbm9yIHBlbmRpbmcgbWVtYmVyIG9mIHYyIGdyb3VwJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT09IG1lc3NhZ2VSZXF1ZXN0RW51bS5CTE9DSykge1xuICAgICAgICAvLyBCbG9jayBsb2NhbGx5LCBvdGhlciBkZXZpY2VzIHNob3VsZCBibG9jayB1cG9uIHJlY2VpdmluZyB0aGUgc3luYyBtZXNzYWdlXG4gICAgICAgIHRoaXMuYmxvY2soeyB2aWFTdG9yYWdlU2VydmljZVN5bmMgfSk7XG4gICAgICAgIHRoaXMuZGlzYWJsZVByb2ZpbGVTaGFyaW5nKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jIH0pO1xuXG4gICAgICAgIGlmIChpc0xvY2FsQWN0aW9uKSB7XG4gICAgICAgICAgaWYgKGlzR3JvdXBWMSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXAoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXBWMigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZXNwb25zZSA9PT0gbWVzc2FnZVJlcXVlc3RFbnVtLkRFTEVURSkge1xuICAgICAgICB0aGlzLmRpc2FibGVQcm9maWxlU2hhcmluZyh7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyB9KTtcblxuICAgICAgICAvLyBEZWxldGUgbWVzc2FnZXMgbG9jYWxseSwgb3RoZXIgZGV2aWNlcyBzaG91bGQgZGVsZXRlIHVwb24gcmVjZWl2aW5nXG4gICAgICAgIC8vIHRoZSBzeW5jIG1lc3NhZ2VcbiAgICAgICAgYXdhaXQgdGhpcy5kZXN0cm95TWVzc2FnZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMYXN0TWVzc2FnZSgpO1xuXG4gICAgICAgIGlmIChpc0xvY2FsQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd1bmxvYWQnLCAnZGVsZXRlZCBmcm9tIG1lc3NhZ2UgcmVxdWVzdCcpO1xuXG4gICAgICAgICAgaWYgKGlzR3JvdXBWMSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXAoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXBWMigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZXNwb25zZSA9PT0gbWVzc2FnZVJlcXVlc3RFbnVtLkJMT0NLX0FORF9ERUxFVEUpIHtcbiAgICAgICAgLy8gQmxvY2sgbG9jYWxseSwgb3RoZXIgZGV2aWNlcyBzaG91bGQgYmxvY2sgdXBvbiByZWNlaXZpbmcgdGhlIHN5bmMgbWVzc2FnZVxuICAgICAgICB0aGlzLmJsb2NrKHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jIH0pO1xuICAgICAgICB0aGlzLmRpc2FibGVQcm9maWxlU2hhcmluZyh7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyB9KTtcblxuICAgICAgICAvLyBEZWxldGUgbWVzc2FnZXMgbG9jYWxseSwgb3RoZXIgZGV2aWNlcyBzaG91bGQgZGVsZXRlIHVwb24gcmVjZWl2aW5nXG4gICAgICAgIC8vIHRoZSBzeW5jIG1lc3NhZ2VcbiAgICAgICAgYXdhaXQgdGhpcy5kZXN0cm95TWVzc2FnZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMYXN0TWVzc2FnZSgpO1xuXG4gICAgICAgIGlmIChpc0xvY2FsQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd1bmxvYWQnLCAnYmxvY2tlZCBhbmQgZGVsZXRlZCBmcm9tIG1lc3NhZ2UgcmVxdWVzdCcpO1xuXG4gICAgICAgICAgaWYgKGlzR3JvdXBWMSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXAoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxlYXZlR3JvdXBWMigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgam9pbkdyb3VwVjJWaWFMaW5rQW5kTWlncmF0ZSh7XG4gICAgYXBwcm92YWxSZXF1aXJlZCxcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gICAgcmV2aXNpb24sXG4gIH06IHtcbiAgICBhcHByb3ZhbFJlcXVpcmVkOiBib29sZWFuO1xuICAgIGludml0ZUxpbmtQYXNzd29yZDogc3RyaW5nO1xuICAgIHJldmlzaW9uOiBudW1iZXI7XG4gIH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5qb2luR3JvdXBWMlZpYUxpbmtBbmRNaWdyYXRlKHtcbiAgICAgIGFwcHJvdmFsUmVxdWlyZWQsXG4gICAgICBjb252ZXJzYXRpb246IHRoaXMsXG4gICAgICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gICAgICByZXZpc2lvbixcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGpvaW5Hcm91cFYyVmlhTGluayh7XG4gICAgaW52aXRlTGlua1Bhc3N3b3JkLFxuICAgIGFwcHJvdmFsUmVxdWlyZWQsXG4gIH06IHtcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQ6IHN0cmluZztcbiAgICBhcHByb3ZhbFJlcXVpcmVkOiBib29sZWFuO1xuICB9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgb3VyQUNJID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uID1cbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbk9yVGhyb3coKTtcbiAgICB0cnkge1xuICAgICAgaWYgKGFwcHJvdmFsUmVxdWlyZWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgICBuYW1lOiAncmVxdWVzdFRvSm9pbicsXG4gICAgICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IFtvdXJDb252ZXJzYXRpb25dLFxuICAgICAgICAgIGludml0ZUxpbmtQYXNzd29yZCxcbiAgICAgICAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT4gdGhpcy5hZGRQZW5kaW5nQXBwcm92YWxSZXF1ZXN0KCksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgICBuYW1lOiAnam9pbkdyb3VwJyxcbiAgICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW291ckNvbnZlcnNhdGlvbl0sXG4gICAgICAgICAgaW52aXRlTGlua1Bhc3N3b3JkLFxuICAgICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLmFkZE1lbWJlcihvdXJBQ0kpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc3QgQUxSRUFEWV9SRVFVRVNURURfVE9fSk9JTiA9XG4gICAgICAgICd7XCJjb2RlXCI6NDAwLFwibWVzc2FnZVwiOlwiY2Fubm90IGFzayB0byBqb2luIHZpYSBpbnZpdGUgbGluayBpZiBhbHJlYWR5IGFza2VkIHRvIGpvaW5cIn0nO1xuICAgICAgaWYgKCFlcnJvci5yZXNwb25zZSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVycm9yRGV0YWlscyA9IEJ5dGVzLnRvU3RyaW5nKGVycm9yLnJlc3BvbnNlKTtcbiAgICAgICAgaWYgKGVycm9yRGV0YWlscyAhPT0gQUxSRUFEWV9SRVFVRVNURURfVE9fSk9JTikge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgJ2pvaW5Hcm91cFYyVmlhTGluazogR290IDQwMCwgYnV0IHNlcnZlciBpcyB0ZWxsaW5nIHVzIHdlIGhhdmUgYWxyZWFkeSByZXF1ZXN0ZWQgdG8gam9pbi4gRm9yY2luZyB0aGF0IGxvY2FsIHN0YXRlJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5zZXQoe1xuICAgICAgICAgICAgcGVuZGluZ0FkbWluQXBwcm92YWxWMjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogb3VyQUNJLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VSZXF1ZXN0RW51bSA9IFByb3RvLlN5bmNNZXNzYWdlLk1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UuVHlwZTtcblxuICAgIC8vIEVuc3VyZSBhY3RpdmVfYXQgaXMgc2V0LCBiZWNhdXNlIHRoaXMgaXMgYW4gZXZlbnQgdGhhdCBqdXN0aWZpZXMgcHV0dGluZyB0aGUgZ3JvdXBcbiAgICAvLyAgIGluIHRoZSBsZWZ0IHBhbmUuXG4gICAgdGhpcy5zZXQoe1xuICAgICAgbWVzc2FnZVJlcXVlc3RSZXNwb25zZVR5cGU6IG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFQsXG4gICAgICBhY3RpdmVfYXQ6IHRoaXMuZ2V0KCdhY3RpdmVfYXQnKSB8fCBEYXRlLm5vdygpLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGFzeW5jIGNhbmNlbEpvaW5SZXF1ZXN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcblxuICAgIGNvbnN0IGludml0ZUxpbmtQYXNzd29yZCA9IHRoaXMuZ2V0KCdncm91cEludml0ZUxpbmtQYXNzd29yZCcpO1xuICAgIGlmICghaW52aXRlTGlua1Bhc3N3b3JkKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGNhbmNlbEpvaW5SZXF1ZXN0LyR7dGhpcy5pZEZvckxvZ2dpbmcoKX06IFdlIGRvbid0IGhhdmUgYW4gaW52aXRlTGlua1Bhc3N3b3JkIWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICdjYW5jZWxKb2luUmVxdWVzdCcsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gICAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT4gdGhpcy5kZW55UGVuZGluZ0FwcHJvdmFsUmVxdWVzdChvdXJBQ0kpLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgYWRkTWVtYmVyc1YyKGNvbnZlcnNhdGlvbklkczogUmVhZG9ubHlBcnJheTxzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICdhZGRNZW1iZXJzVjInLFxuICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IGNvbnZlcnNhdGlvbklkc1xuICAgICAgICAubWFwKGlkID0+IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZCkpXG4gICAgICAgIC5maWx0ZXIoaXNOb3ROaWwpLFxuICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+XG4gICAgICAgIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkQWRkTWVtYmVyc0NoYW5nZShcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWRzXG4gICAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVHcm91cEF0dHJpYnV0ZXNWMihcbiAgICBhdHRyaWJ1dGVzOiBSZWFkb25seTx7XG4gICAgICBhdmF0YXI/OiB1bmRlZmluZWQgfCBVaW50OEFycmF5O1xuICAgICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gICAgICB0aXRsZT86IHN0cmluZztcbiAgICB9PlxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgbmFtZTogJ3VwZGF0ZUdyb3VwQXR0cmlidXRlc1YyJyxcbiAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PlxuICAgICAgICB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZFVwZGF0ZUF0dHJpYnV0ZXNDaGFuZ2UoXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBwdWJsaWNQYXJhbXM6IHRoaXMuZ2V0KCdwdWJsaWNQYXJhbXMnKSxcbiAgICAgICAgICAgIHJldmlzaW9uOiB0aGlzLmdldCgncmV2aXNpb24nKSxcbiAgICAgICAgICAgIHNlY3JldFBhcmFtczogdGhpcy5nZXQoJ3NlY3JldFBhcmFtcycpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbGVhdmVHcm91cFYyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgICBjb25zdCBvdXJQTkkgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuICAgIGNvbnN0IG91ckNvbnZlcnNhdGlvbiA9XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25PclRocm93KCk7XG5cbiAgICBpZiAodGhpcy5pc01lbWJlclBlbmRpbmcob3VyQUNJKSkge1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ2RlbGV0ZScsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IHRoaXMucmVtb3ZlUGVuZGluZ01lbWJlcihbb3VyQUNJXSksXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNNZW1iZXIob3VyQUNJKSkge1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ2RlbGV0ZScsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbb3VyQ29udmVyc2F0aW9uXSxcbiAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IHRoaXMucmVtb3ZlTWVtYmVyKG91ckFDSSksXG4gICAgICB9KTtcbiAgICAgIC8vIEtlZXAgUE5JIGluIHBlbmRpbmcgaWYgQUNJIHdhcyBhIG1lbWJlci5cbiAgICB9IGVsc2UgaWYgKG91clBOSSAmJiB0aGlzLmlzTWVtYmVyUGVuZGluZyhvdXJQTkkpKSB7XG4gICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiAnZGVsZXRlJyxcbiAgICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IFtdLFxuICAgICAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT4gdGhpcy5yZW1vdmVQZW5kaW5nTWVtYmVyKFtvdXJQTkldKSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdsZWF2ZUdyb3VwVjI6IFdlIHdlcmUgbmVpdGhlciBhIG1lbWJlciBub3IgYSBwZW5kaW5nIG1lbWJlciBvZiAnICtcbiAgICAgICAgICBgdGhlIGdyb3VwICR7bG9nSWR9YFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBhZGRCYW5uZWRNZW1iZXIoXG4gICAgdXVpZDogVVVJRFxuICApOiBQcm9taXNlPFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMgfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAodGhpcy5pc01lbWJlcih1dWlkKSkge1xuICAgICAgbG9nLndhcm4oJ2FkZEJhbm5lZE1lbWJlcjogTWVtYmVyIGlzIGEgcGFydCBvZiB0aGUgZ3JvdXAhJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc01lbWJlclBlbmRpbmcodXVpZCkpIHtcbiAgICAgIGxvZy53YXJuKCdhZGRCYW5uZWRNZW1iZXI6IE1lbWJlciBpcyBwZW5kaW5nIHRvIGJlIGFkZGVkIHRvIGdyb3VwIScpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNNZW1iZXJCYW5uZWQodXVpZCkpIHtcbiAgICAgIGxvZy53YXJuKCdhZGRCYW5uZWRNZW1iZXI6IE1lbWJlciBpcyBhbHJlYWR5IGJhbm5lZCEnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEFkZEJhbm5lZE1lbWJlckNoYW5nZSh7XG4gICAgICBncm91cDogdGhpcy5hdHRyaWJ1dGVzLFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGJsb2NrR3JvdXBMaW5rUmVxdWVzdHModXVpZDogVVVJRFN0cmluZ1R5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgbmFtZTogJ2FkZEJhbm5lZE1lbWJlcicsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICBjcmVhdGVHcm91cENoYW5nZTogYXN5bmMgKCkgPT4gdGhpcy5hZGRCYW5uZWRNZW1iZXIobmV3IFVVSUQodXVpZCkpLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlQWRtaW4oY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG5cbiAgICBjb25zdCBtZW1iZXIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghbWVtYmVyKSB7XG4gICAgICBsb2cuZXJyb3IoYHRvZ2dsZUFkbWluLyR7bG9nSWR9OiAke2NvbnZlcnNhdGlvbklkfSBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSBtZW1iZXIuZ2V0Q2hlY2tlZFV1aWQoYHRvZ2dsZUFkbWluLyR7bG9nSWR9YCk7XG5cbiAgICBpZiAoIXRoaXMuaXNNZW1iZXIodXVpZCkpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHRvZ2dsZUFkbWluOiBNZW1iZXIgJHtjb252ZXJzYXRpb25JZH0gaXMgbm90IGEgbWVtYmVyIG9mIHRoZSBncm91cGBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICd0b2dnbGVBZG1pbicsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW21lbWJlcl0sXG4gICAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT4gdGhpcy50b2dnbGVBZG1pbkNoYW5nZSh1dWlkKSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGFwcHJvdmVQZW5kaW5nTWVtYmVyc2hpcEZyb21Hcm91cFYyKFxuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbG9nSWQgPSB0aGlzLmlkRm9yTG9nZ2luZygpO1xuXG4gICAgY29uc3QgcGVuZGluZ01lbWJlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFwZW5kaW5nTWVtYmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBhcHByb3ZlUGVuZGluZ01lbWJlcnNoaXBGcm9tR3JvdXBWMi8ke2xvZ0lkfTogTm8gY29udmVyc2F0aW9uIGZvdW5kIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSBwZW5kaW5nTWVtYmVyLmdldENoZWNrZWRVdWlkKFxuICAgICAgYGFwcHJvdmVQZW5kaW5nTWVtYmVyc2hpcEZyb21Hcm91cFYyLyR7bG9nSWR9YFxuICAgICk7XG5cbiAgICBpZiAoaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykgJiYgdGhpcy5pc01lbWJlclJlcXVlc3RpbmdUb0pvaW4odXVpZCkpIHtcbiAgICAgIGF3YWl0IHRoaXMubW9kaWZ5R3JvdXBWMih7XG4gICAgICAgIG5hbWU6ICdhcHByb3ZlUGVuZGluZ0FwcHJvdmFsUmVxdWVzdCcsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbcGVuZGluZ01lbWJlcl0sXG4gICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLmFwcHJvdmVQZW5kaW5nQXBwcm92YWxSZXF1ZXN0KHV1aWQpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmV2b2tlUGVuZGluZ01lbWJlcnNoaXBzRnJvbUdyb3VwVjIoXG4gICAgY29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHBlbmRpbmcgbWVtYmVyc2hpcHMgY2FuIGJlIHJldm9rZWQgZm9yIG11bHRpcGxlIG1lbWJlcnMgYXQgb25jZVxuICAgIGlmIChjb252ZXJzYXRpb25JZHMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgdXVpZHMgPSBjb252ZXJzYXRpb25JZHMubWFwKGlkID0+IHtcbiAgICAgICAgY29uc3QgdXVpZCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZCk/LmdldFV1aWQoKTtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KHV1aWQsIGBVVUlEIGRvZXMgbm90IGV4aXN0IGZvciAke2lkfWApO1xuICAgICAgICByZXR1cm4gdXVpZDtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ3JlbW92ZVBlbmRpbmdNZW1iZXInLFxuICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLnJlbW92ZVBlbmRpbmdNZW1iZXIodXVpZHMpLFxuICAgICAgICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kOiBjb252ZXJzYXRpb25JZHMsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBbY29udmVyc2F0aW9uSWRdID0gY29udmVyc2F0aW9uSWRzO1xuXG4gICAgY29uc3QgcGVuZGluZ01lbWJlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFwZW5kaW5nTWVtYmVyKSB7XG4gICAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGByZXZva2VQZW5kaW5nTWVtYmVyc2hpcHNGcm9tR3JvdXBWMi8ke2xvZ0lkfTogTm8gY29udmVyc2F0aW9uIGZvdW5kIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSBwZW5kaW5nTWVtYmVyLmdldENoZWNrZWRVdWlkKFxuICAgICAgJ3Jldm9rZVBlbmRpbmdNZW1iZXJzaGlwc0Zyb21Hcm91cFYyJ1xuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc01lbWJlclJlcXVlc3RpbmdUb0pvaW4odXVpZCkpIHtcbiAgICAgIGF3YWl0IHRoaXMubW9kaWZ5R3JvdXBWMih7XG4gICAgICAgIG5hbWU6ICdkZW55UGVuZGluZ0FwcHJvdmFsUmVxdWVzdCcsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IHRoaXMuZGVueVBlbmRpbmdBcHByb3ZhbFJlcXVlc3QodXVpZCksXG4gICAgICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQ6IFtjb252ZXJzYXRpb25JZF0sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNNZW1iZXJQZW5kaW5nKHV1aWQpKSB7XG4gICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiAncmVtb3ZlUGVuZGluZ01lbWJlcicsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IHRoaXMucmVtb3ZlUGVuZGluZ01lbWJlcihbdXVpZF0pLFxuICAgICAgICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kOiBbY29udmVyc2F0aW9uSWRdLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVtb3ZlRnJvbUdyb3VwVjIoY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG4gICAgY29uc3QgcGVuZGluZ01lbWJlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFwZW5kaW5nTWVtYmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGByZW1vdmVGcm9tR3JvdXBWMi8ke2xvZ0lkfTogTm8gY29udmVyc2F0aW9uIGZvdW5kIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSBwZW5kaW5nTWVtYmVyLmdldENoZWNrZWRVdWlkKGByZW1vdmVGcm9tR3JvdXBWMi8ke2xvZ0lkfWApO1xuXG4gICAgaWYgKHRoaXMuaXNNZW1iZXJSZXF1ZXN0aW5nVG9Kb2luKHV1aWQpKSB7XG4gICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiAnZGVueVBlbmRpbmdBcHByb3ZhbFJlcXVlc3QnLFxuICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLmRlbnlQZW5kaW5nQXBwcm92YWxSZXF1ZXN0KHV1aWQpLFxuICAgICAgICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kOiBbY29udmVyc2F0aW9uSWRdLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTWVtYmVyUGVuZGluZyh1dWlkKSkge1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ3JlbW92ZVBlbmRpbmdNZW1iZXInLFxuICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLnJlbW92ZVBlbmRpbmdNZW1iZXIoW3V1aWRdKSxcbiAgICAgICAgZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZDogW2NvbnZlcnNhdGlvbklkXSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc01lbWJlcih1dWlkKSkge1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ3JlbW92ZUZyb21Hcm91cCcsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbcGVuZGluZ01lbWJlcl0sXG4gICAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiAoKSA9PiB0aGlzLnJlbW92ZU1lbWJlcih1dWlkKSxcbiAgICAgICAgZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZDogW2NvbnZlcnNhdGlvbklkXSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGByZW1vdmVGcm9tR3JvdXBWMjogTWVtYmVyICR7Y29udmVyc2F0aW9uSWR9IGlzIG5laXRoZXIgYSBtZW1iZXIgbm9yIGEgcGVuZGluZyBtZW1iZXIgb2YgdGhlIGdyb3VwYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShyZXNwb25zZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gSW4gR3JvdXBzVjIsIHRoaXMgbWF5IG1vZGlmeSB0aGUgc2VydmVyLiBXZSBvbmx5IHdhbnQgdG8gY29udGludWUgaWYgdGhvc2VcbiAgICAvLyAgIHNlcnZlciB1cGRhdGVzIHdlcmUgc3VjY2Vzc2Z1bC5cbiAgICBhd2FpdCB0aGlzLmFwcGx5TWVzc2FnZVJlcXVlc3RSZXNwb25zZShyZXNwb25zZSk7XG5cbiAgICBjb25zdCBncm91cElkID0gdGhpcy5nZXRHcm91cElkQnVmZmVyKCk7XG5cbiAgICBpZiAod2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuYXJlV2VQcmltYXJ5RGV2aWNlKCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICAnc3luY01lc3NhZ2VSZXF1ZXN0UmVzcG9uc2U6IFdlIGFyZSBwcmltYXJ5IGRldmljZTsgbm90IHNlbmRpbmcgbWVzc2FnZSByZXF1ZXN0IHN5bmMnXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBzaW5nbGVQcm90b0pvYlF1ZXVlLmFkZChcbiAgICAgICAgTWVzc2FnZVNlbmRlci5nZXRNZXNzYWdlUmVxdWVzdFJlc3BvbnNlU3luYyh7XG4gICAgICAgICAgdGhyZWFkRTE2NDogdGhpcy5nZXQoJ2UxNjQnKSxcbiAgICAgICAgICB0aHJlYWRVdWlkOiB0aGlzLmdldCgndXVpZCcpLFxuICAgICAgICAgIGdyb3VwSWQsXG4gICAgICAgICAgdHlwZTogcmVzcG9uc2UsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZTogRmFpbGVkIHRvIHF1ZXVlIHN5bmMgbWVzc2FnZScsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2FmZUdldFZlcmlmaWVkKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3QgdXVpZCA9IHRoaXMuZ2V0VXVpZCgpO1xuICAgIGlmICghdXVpZCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuVmVyaWZpZWRTdGF0dXMuREVGQVVMVDtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5nZXRWZXJpZmllZCh1dWlkKTtcbiAgICByZXR1cm4gcHJvbWlzZS5jYXRjaChcbiAgICAgICgpID0+IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuVmVyaWZpZWRTdGF0dXMuREVGQVVMVFxuICAgICk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVWZXJpZmllZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgYXdhaXQgdGhpcy5pbml0aWFsUHJvbWlzZTtcbiAgICAgIGNvbnN0IHZlcmlmaWVkID0gYXdhaXQgdGhpcy5zYWZlR2V0VmVyaWZpZWQoKTtcblxuICAgICAgaWYgKHRoaXMuZ2V0KCd2ZXJpZmllZCcpICE9PSB2ZXJpZmllZCkge1xuICAgICAgICB0aGlzLnNldCh7IHZlcmlmaWVkIH0pO1xuICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmZldGNoQ29udGFjdHMoKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgIHRoaXMuY29udGFjdENvbGxlY3Rpb24hLm1hcChhc3luYyBjb250YWN0ID0+IHtcbiAgICAgICAgaWYgKCFpc01lKGNvbnRhY3QuYXR0cmlidXRlcykpIHtcbiAgICAgICAgICBhd2FpdCBjb250YWN0LnVwZGF0ZVZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHNldFZlcmlmaWVkRGVmYXVsdChvcHRpb25zPzogVmVyaWZpY2F0aW9uT3B0aW9ucyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgeyBERUZBVUxUIH0gPSB0aGlzLnZlcmlmaWVkRW51bSE7XG4gICAgcmV0dXJuIHRoaXMucXVldWVKb2IoJ3NldFZlcmlmaWVkRGVmYXVsdCcsICgpID0+XG4gICAgICB0aGlzLl9zZXRWZXJpZmllZChERUZBVUxULCBvcHRpb25zKVxuICAgICk7XG4gIH1cblxuICBzZXRWZXJpZmllZChvcHRpb25zPzogVmVyaWZpY2F0aW9uT3B0aW9ucyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgeyBWRVJJRklFRCB9ID0gdGhpcy52ZXJpZmllZEVudW0hO1xuICAgIHJldHVybiB0aGlzLnF1ZXVlSm9iKCdzZXRWZXJpZmllZCcsICgpID0+XG4gICAgICB0aGlzLl9zZXRWZXJpZmllZChWRVJJRklFRCwgb3B0aW9ucylcbiAgICApO1xuICB9XG5cbiAgc2V0VW52ZXJpZmllZChvcHRpb25zOiBWZXJpZmljYXRpb25PcHRpb25zKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICBjb25zdCB7IFVOVkVSSUZJRUQgfSA9IHRoaXMudmVyaWZpZWRFbnVtITtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZUpvYignc2V0VW52ZXJpZmllZCcsICgpID0+XG4gICAgICB0aGlzLl9zZXRWZXJpZmllZChVTlZFUklGSUVELCBvcHRpb25zKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9zZXRWZXJpZmllZChcbiAgICB2ZXJpZmllZDogbnVtYmVyLFxuICAgIHByb3ZpZGVkT3B0aW9ucz86IFZlcmlmaWNhdGlvbk9wdGlvbnNcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHByb3ZpZGVkT3B0aW9ucyB8fCB7fTtcbiAgICB3aW5kb3cuXy5kZWZhdWx0cyhvcHRpb25zLCB7XG4gICAgICB2aWFTdG9yYWdlU2VydmljZVN5bmM6IGZhbHNlLFxuICAgICAga2V5OiBudWxsLFxuICAgIH0pO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICBjb25zdCB7IFZFUklGSUVELCBERUZBVUxUIH0gPSB0aGlzLnZlcmlmaWVkRW51bSE7XG5cbiAgICBpZiAoIWlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1lvdSBjYW5ub3QgdmVyaWZ5IGEgZ3JvdXAgY29udmVyc2F0aW9uLiAnICtcbiAgICAgICAgICAnWW91IG11c3QgdmVyaWZ5IGluZGl2aWR1YWwgY29udGFjdHMuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB1dWlkID0gdGhpcy5nZXRVdWlkKCk7XG4gICAgY29uc3QgYmVnaW5uaW5nVmVyaWZpZWQgPSB0aGlzLmdldCgndmVyaWZpZWQnKTtcbiAgICBsZXQga2V5Q2hhbmdlID0gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMudmlhU3RvcmFnZVNlcnZpY2VTeW5jKSB7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIHV1aWQsXG4gICAgICAgIGBTeW5jIG1lc3NhZ2UgZGlkbid0IHVwZGF0ZSB1dWlkIGZvciBjb252ZXJzYXRpb246ICR7dGhpcy5pZH1gXG4gICAgICApO1xuXG4gICAgICAvLyBoYW5kbGUgdGhlIGluY29taW5nIGtleSBmcm9tIHRoZSBzeW5jIG1lc3NhZ2VzIC0gbmVlZCBkaWZmZXJlbnRcbiAgICAgIC8vIGJlaGF2aW9yIGlmIHRoYXQga2V5IGRvZXNuJ3QgbWF0Y2ggdGhlIGN1cnJlbnQga2V5XG4gICAgICBrZXlDaGFuZ2UgPVxuICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLnByb2Nlc3NWZXJpZmllZE1lc3NhZ2UoXG4gICAgICAgICAgdXVpZCxcbiAgICAgICAgICB2ZXJpZmllZCxcbiAgICAgICAgICBvcHRpb25zLmtleSB8fCB1bmRlZmluZWRcbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHV1aWQpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuc2V0VmVyaWZpZWQodXVpZCwgdmVyaWZpZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihgX3NldFZlcmlmaWVkKCR7dGhpcy5pZH0pOiBubyB1dWlkIHRvIHVwZGF0ZSBwcm90b2NvbCBzdG9yYWdlYCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoeyB2ZXJpZmllZCB9KTtcblxuICAgIC8vIFdlIHdpbGwgdXBkYXRlIHRoZSBjb252ZXJzYXRpb24gZHVyaW5nIHN0b3JhZ2Ugc2VydmljZSBzeW5jXG4gICAgaWYgKCFvcHRpb25zLnZpYVN0b3JhZ2VTZXJ2aWNlU3luYykge1xuICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy52aWFTdG9yYWdlU2VydmljZVN5bmMpIHtcbiAgICAgIGlmIChrZXlDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCdrZXlDaGFuZ2UnKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWdpbm5pbmdWZXJpZmllZCAhPT0gdmVyaWZpZWQpIHtcbiAgICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKGB2ZXJpZmllZCBmcm9tPSR7YmVnaW5uaW5nVmVyaWZpZWR9IHRvPSR7dmVyaWZpZWR9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGlkVmVyaWZpZWRDaGFuZ2UgPSBiZWdpbm5pbmdWZXJpZmllZCAhPT0gdmVyaWZpZWQ7XG4gICAgY29uc3QgaXNFeHBsaWNpdFVzZXJBY3Rpb24gPSAhb3B0aW9ucy52aWFTdG9yYWdlU2VydmljZVN5bmM7XG4gICAgY29uc3Qgc2hvdWxkU2hvd0Zyb21TdG9yYWdlU3luYyA9XG4gICAgICBvcHRpb25zLnZpYVN0b3JhZ2VTZXJ2aWNlU3luYyAmJiB2ZXJpZmllZCAhPT0gREVGQVVMVDtcbiAgICBpZiAoXG4gICAgICAvLyBUaGUgbWVzc2FnZSBjYW1lIGZyb20gYW4gZXhwbGljaXQgdmVyaWZpY2F0aW9uIGluIGEgY2xpZW50IChub3RcbiAgICAgIC8vIHN0b3JhZ2Ugc2VydmljZSBzeW5jKVxuICAgICAgKGRpZFZlcmlmaWVkQ2hhbmdlICYmIGlzRXhwbGljaXRVc2VyQWN0aW9uKSB8fFxuICAgICAgLy8gVGhlIHZlcmlmaWNhdGlvbiB2YWx1ZSByZWNlaXZlZCBieSB0aGUgc3RvcmFnZSBzeW5jIGlzIGRpZmZlcmVudCBmcm9tIHdoYXQgd2VcbiAgICAgIC8vICAgaGF2ZSBvbiByZWNvcmQgKGFuZCBpdCdzIG5vdCBhIHRyYW5zaXRpb24gdG8gVU5WRVJJRklFRClcbiAgICAgIChkaWRWZXJpZmllZENoYW5nZSAmJiBzaG91bGRTaG93RnJvbVN0b3JhZ2VTeW5jKSB8fFxuICAgICAgLy8gT3VyIGxvY2FsIHZlcmlmaWNhdGlvbiBzdGF0dXMgaXMgVkVSSUZJRUQgYW5kIGl0IGhhc24ndCBjaGFuZ2VkLCBidXQgdGhlIGtleSBkaWRcbiAgICAgIC8vICAgY2hhbmdlIChLZXkxL1ZFUklGSUVEIC0+IEtleTIvVkVSSUZJRUQpLCBidXQgd2UgZG9uJ3Qgd2FudCB0byBzaG93IERFRkFVTFQgLT5cbiAgICAgIC8vICAgREVGQVVMVCBvciBVTlZFUklGSUVEIC0+IFVOVkVSSUZJRURcbiAgICAgIChrZXlDaGFuZ2UgJiYgdmVyaWZpZWQgPT09IFZFUklGSUVEKVxuICAgICkge1xuICAgICAgYXdhaXQgdGhpcy5hZGRWZXJpZmllZENoYW5nZSh0aGlzLmlkLCB2ZXJpZmllZCA9PT0gVkVSSUZJRUQsIHtcbiAgICAgICAgbG9jYWw6IGlzRXhwbGljaXRVc2VyQWN0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc0V4cGxpY2l0VXNlckFjdGlvbiAmJiB1dWlkKSB7XG4gICAgICBhd2FpdCB0aGlzLnNlbmRWZXJpZnlTeW5jTWVzc2FnZSh0aGlzLmdldCgnZTE2NCcpLCB1dWlkLCB2ZXJpZmllZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleUNoYW5nZTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRWZXJpZnlTeW5jTWVzc2FnZShcbiAgICBlMTY0OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgdXVpZDogVVVJRCxcbiAgICBzdGF0ZTogbnVtYmVyXG4gICk6IFByb21pc2U8Q2FsbGJhY2tSZXN1bHRUeXBlIHwgdm9pZD4ge1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSB1dWlkID8gdXVpZC50b1N0cmluZygpIDogZTE2NDtcbiAgICBpZiAoIWlkZW50aWZpZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3NlbmRWZXJpZnlTeW5jTWVzc2FnZTogTmVpdGhlciBlMTY0IG5vciBVVUlEIHdlcmUgcHJvdmlkZWQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5hcmVXZVByaW1hcnlEZXZpY2UoKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzZW5kVmVyaWZ5U3luY01lc3NhZ2U6IFdlIGFyZSBwcmltYXJ5IGRldmljZTsgbm90IHNlbmRpbmcgc3luYydcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5sb2FkSWRlbnRpdHlLZXkoXG4gICAgICBVVUlELmNoZWNrZWRMb29rdXAoaWRlbnRpZmllcilcbiAgICApO1xuICAgIGlmICgha2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBzZW5kVmVyaWZ5U3luY01lc3NhZ2U6IE5vIGlkZW50aXR5IGtleSBmb3VuZCBmb3IgaWRlbnRpZmllciAke2lkZW50aWZpZXJ9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2luZ2xlUHJvdG9Kb2JRdWV1ZS5hZGQoXG4gICAgICAgIE1lc3NhZ2VTZW5kZXIuZ2V0VmVyaWZpY2F0aW9uU3luYyhlMTY0LCB1dWlkLnRvU3RyaW5nKCksIHN0YXRlLCBrZXkpXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzZW5kVmVyaWZ5U3luY01lc3NhZ2U6IEZhaWxlZCB0byBxdWV1ZSBzeW5jIG1lc3NhZ2UnLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlzVmVyaWZpZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICByZXR1cm4gdGhpcy5nZXQoJ3ZlcmlmaWVkJykgPT09IHRoaXMudmVyaWZpZWRFbnVtIS5WRVJJRklFRDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY29udGFjdENvbGxlY3Rpb24/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbnRhY3RDb2xsZWN0aW9uPy5ldmVyeShjb250YWN0ID0+IHtcbiAgICAgIGlmIChpc01lKGNvbnRhY3QuYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGFjdC5pc1ZlcmlmaWVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBpc1VudmVyaWZpZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIGNvbnN0IHZlcmlmaWVkID0gdGhpcy5nZXQoJ3ZlcmlmaWVkJyk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICB2ZXJpZmllZCAhPT0gdGhpcy52ZXJpZmllZEVudW0hLlZFUklGSUVEICYmXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgIHZlcmlmaWVkICE9PSB0aGlzLnZlcmlmaWVkRW51bSEuREVGQVVMVFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY29udGFjdENvbGxlY3Rpb24/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGFjdENvbGxlY3Rpb24/LnNvbWUoY29udGFjdCA9PiB7XG4gICAgICBpZiAoaXNNZShjb250YWN0LmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250YWN0LmlzVW52ZXJpZmllZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VW52ZXJpZmllZCgpOiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4ge1xuICAgIGlmIChpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1VudmVyaWZpZWQoKSA/IFt0aGlzXSA6IFtdO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5jb250YWN0Q29sbGVjdGlvbj8uZmlsdGVyKGNvbnRhY3QgPT4ge1xuICAgICAgICBpZiAoaXNNZShjb250YWN0LmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250YWN0LmlzVW52ZXJpZmllZCgpO1xuICAgICAgfSkgfHwgW11cbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc2V0QXBwcm92ZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdZb3UgY2Fubm90IHNldCBhIGdyb3VwIGNvbnZlcnNhdGlvbiBhcyB0cnVzdGVkLiAnICtcbiAgICAgICAgICAnWW91IG11c3Qgc2V0IGluZGl2aWR1YWwgY29udGFjdHMgYXMgdHJ1c3RlZC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSB0aGlzLmdldFV1aWQoKTtcbiAgICBpZiAoIXV1aWQpIHtcbiAgICAgIGxvZy53YXJuKGBzZXRBcHByb3ZlZCgke3RoaXMuaWR9KTogbm8gdXVpZCwgaWdub3JpbmdgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5zZXRBcHByb3ZhbCh1dWlkLCB0cnVlKTtcbiAgfVxuXG4gIHNhZmVJc1VudHJ1c3RlZCgpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXVpZCA9IHRoaXMuZ2V0VXVpZCgpO1xuICAgICAgc3RyaWN0QXNzZXJ0KHV1aWQsIGBObyB1dWlkIGZvciBjb252ZXJzYXRpb246ICR7dGhpcy5pZH1gKTtcbiAgICAgIHJldHVybiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmlzVW50cnVzdGVkKHV1aWQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlzVW50cnVzdGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zYWZlSXNVbnRydXN0ZWQoKTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICBpZiAoIXRoaXMuY29udGFjdENvbGxlY3Rpb24hLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgcmV0dXJuIHRoaXMuY29udGFjdENvbGxlY3Rpb24hLmFueShjb250YWN0ID0+IHtcbiAgICAgIGlmIChpc01lKGNvbnRhY3QuYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRhY3Quc2FmZUlzVW50cnVzdGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRVbnRydXN0ZWQoKTogQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+IHtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgaWYgKHRoaXMuaXNVbnRydXN0ZWQoKSkge1xuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmNvbnRhY3RDb2xsZWN0aW9uPy5maWx0ZXIoY29udGFjdCA9PiB7XG4gICAgICAgIGlmIChpc01lKGNvbnRhY3QuYXR0cmlidXRlcykpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRhY3QuaXNVbnRydXN0ZWQoKTtcbiAgICAgIH0pIHx8IFtdXG4gICAgKTtcbiAgfVxuXG4gIGdldFNlbnRNZXNzYWdlQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ3NlbnRNZXNzYWdlQ291bnQnKSB8fCAwO1xuICB9XG5cbiAgZ2V0TWVzc2FnZVJlcXVlc3RSZXNwb25zZVR5cGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ21lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlJykgfHwgMDtcbiAgfVxuXG4gIGdldEFib3V0VGV4dCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5nZXQoJ2Fib3V0JykpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgZW1vamkgPSB0aGlzLmdldCgnYWJvdXRFbW9qaScpO1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLmdldCgnYWJvdXQnKTtcblxuICAgIGlmICghZW1vamkpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuaTE4bignbWVzc2FnZS0tZ2V0Tm90aWZpY2F0aW9uVGV4dC0tdGV4dC13aXRoLWVtb2ppJywge1xuICAgICAgdGV4dCxcbiAgICAgIGVtb2ppLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSBpZiB0aGlzIGNvbnZlcnNhdGlvbiBzaG91bGQgYmUgY29uc2lkZXJlZCBcImFjY2VwdGVkXCIgaW4gdGVybXNcbiAgICogb2YgbWVzc2FnZSByZXF1ZXN0c1xuICAgKi9cbiAgZ2V0QWNjZXB0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzQ29udmVyc2F0aW9uQWNjZXB0ZWQodGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIG9uTWVtYmVyVmVyaWZpZWRDaGFuZ2UoKTogdm9pZCB7XG4gICAgLy8gSWYgdGhlIHZlcmlmaWVkIHN0YXRlIG9mIGEgbWVtYmVyIGNoYW5nZXMsIG91ciBhZ2dyZWdhdGUgc3RhdGUgY2hhbmdlcy5cbiAgICAvLyBXZSB0cmlnZ2VyIGJvdGggZXZlbnRzIHRvIHJlcGxpY2F0ZSB0aGUgYmVoYXZpb3Igb2Ygd2luZG93LkJhY2tib25lLk1vZGVsLnNldCgpXG4gICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2U6dmVyaWZpZWQnLCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMsIHsgZm9yY2U6IHRydWUgfSk7XG4gIH1cblxuICBhc3luYyB0b2dnbGVWZXJpZmllZCgpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICBpZiAodGhpcy5pc1ZlcmlmaWVkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFZlcmlmaWVkRGVmYXVsdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZXRWZXJpZmllZCgpO1xuICB9XG5cbiAgYXN5bmMgYWRkQ2hhdFNlc3Npb25SZWZyZXNoZWQoe1xuICAgIHJlY2VpdmVkQXQsXG4gICAgcmVjZWl2ZWRBdENvdW50ZXIsXG4gIH06IHtcbiAgICByZWNlaXZlZEF0OiBudW1iZXI7XG4gICAgcmVjZWl2ZWRBdENvdW50ZXI6IG51bWJlcjtcbiAgfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKGBhZGRDaGF0U2Vzc2lvblJlZnJlc2hlZDogYWRkaW5nIGZvciAke3RoaXMuaWRGb3JMb2dnaW5nKCl9YCwge1xuICAgICAgcmVjZWl2ZWRBdCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5pZCxcbiAgICAgIHR5cGU6ICdjaGF0LXNlc3Npb24tcmVmcmVzaGVkJyxcbiAgICAgIHNlbnRfYXQ6IHJlY2VpdmVkQXQsXG4gICAgICByZWNlaXZlZF9hdDogcmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICByZWNlaXZlZF9hdF9tczogcmVjZWl2ZWRBdCxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuVW5yZWFkLFxuICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICAvLyBUT0RPOiBERVNLVE9QLTcyMlxuICAgICAgLy8gdGhpcyB0eXBlIGRvZXMgbm90IGZ1bGx5IGltcGxlbWVudCB0aGUgaW50ZXJmYWNlIGl0IGlzIGV4cGVjdGVkIHRvXG4gICAgfSBhcyB1bmtub3duIGFzIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZTtcblxuICAgIGNvbnN0IGlkID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UsIHtcbiAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgfSk7XG4gICAgY29uc3QgbW9kZWwgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICBpZCxcbiAgICAgIG5ldyB3aW5kb3cuV2hpc3Blci5NZXNzYWdlKHtcbiAgICAgICAgLi4ubWVzc2FnZSxcbiAgICAgICAgaWQsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ25ld21lc3NhZ2UnLCBtb2RlbCk7XG4gICAgdGhpcy51cGRhdGVVbnJlYWQoKTtcbiAgfVxuXG4gIGFzeW5jIGFkZERlbGl2ZXJ5SXNzdWUoe1xuICAgIHJlY2VpdmVkQXQsXG4gICAgcmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgc2VuZGVyVXVpZCxcbiAgICBzZW50QXQsXG4gIH06IHtcbiAgICByZWNlaXZlZEF0OiBudW1iZXI7XG4gICAgcmVjZWl2ZWRBdENvdW50ZXI6IG51bWJlcjtcbiAgICBzZW5kZXJVdWlkOiBzdHJpbmc7XG4gICAgc2VudEF0OiBudW1iZXI7XG4gIH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbyhgYWRkRGVsaXZlcnlJc3N1ZTogYWRkaW5nIGZvciAke3RoaXMuaWRGb3JMb2dnaW5nKCl9YCwge1xuICAgICAgc2VudEF0LFxuICAgICAgc2VuZGVyVXVpZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5pZCxcbiAgICAgIHR5cGU6ICdkZWxpdmVyeS1pc3N1ZScsXG4gICAgICBzb3VyY2VVdWlkOiBzZW5kZXJVdWlkLFxuICAgICAgc2VudF9hdDogcmVjZWl2ZWRBdCxcbiAgICAgIHJlY2VpdmVkX2F0OiByZWNlaXZlZEF0Q291bnRlcixcbiAgICAgIHJlY2VpdmVkX2F0X21zOiByZWNlaXZlZEF0LFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5VbnJlYWQsXG4gICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLlVuc2VlbixcbiAgICAgIC8vIFRPRE86IERFU0tUT1AtNzIyXG4gICAgICAvLyB0aGlzIHR5cGUgZG9lcyBub3QgZnVsbHkgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UgaXQgaXMgZXhwZWN0ZWQgdG9cbiAgICB9IGFzIHVua25vd24gYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlO1xuXG4gICAgY29uc3QgaWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobWVzc2FnZSwge1xuICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgICBjb25zdCBtb2RlbCA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgIGlkLFxuICAgICAgbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgICAuLi5tZXNzYWdlLFxuICAgICAgICBpZCxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMudHJpZ2dlcignbmV3bWVzc2FnZScsIG1vZGVsKTtcblxuICAgIGF3YWl0IHRoaXMubm90aWZ5KG1vZGVsKTtcbiAgICB0aGlzLnVwZGF0ZVVucmVhZCgpO1xuICB9XG5cbiAgYXN5bmMgYWRkS2V5Q2hhbmdlKGtleUNoYW5nZWRJZDogVVVJRCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKFxuICAgICAgJ2FkZGluZyBrZXkgY2hhbmdlIGFkdmlzb3J5IGZvcicsXG4gICAgICB0aGlzLmlkRm9yTG9nZ2luZygpLFxuICAgICAga2V5Q2hhbmdlZElkLnRvU3RyaW5nKCksXG4gICAgICB0aGlzLmdldCgndGltZXN0YW1wJylcbiAgICApO1xuXG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICB0eXBlOiAna2V5Y2hhbmdlJyxcbiAgICAgIHNlbnRfYXQ6IHRoaXMuZ2V0KCd0aW1lc3RhbXAnKSxcbiAgICAgIHJlY2VpdmVkX2F0OiB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiB0aW1lc3RhbXAsXG4gICAgICBrZXlfY2hhbmdlZDoga2V5Q2hhbmdlZElkLnRvU3RyaW5nKCksXG4gICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLlVuc2VlbixcbiAgICAgIHNjaGVtYVZlcnNpb246IE1lc3NhZ2UuVkVSU0lPTl9ORUVERURfRk9SX0RJU1BMQVksXG4gICAgICAvLyBUT0RPOiBERVNLVE9QLTcyMlxuICAgICAgLy8gdGhpcyB0eXBlIGRvZXMgbm90IGZ1bGx5IGltcGxlbWVudCB0aGUgaW50ZXJmYWNlIGl0IGlzIGV4cGVjdGVkIHRvXG4gICAgfSBhcyB1bmtub3duIGFzIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZTtcblxuICAgIGNvbnN0IGlkID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UsIHtcbiAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgfSk7XG4gICAgY29uc3QgbW9kZWwgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICBpZCxcbiAgICAgIG5ldyB3aW5kb3cuV2hpc3Blci5NZXNzYWdlKHtcbiAgICAgICAgLi4ubWVzc2FnZSxcbiAgICAgICAgaWQsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBjb25zdCBpc1VudHJ1c3RlZCA9IGF3YWl0IHRoaXMuaXNVbnRydXN0ZWQoKTtcblxuICAgIHRoaXMudHJpZ2dlcignbmV3bWVzc2FnZScsIG1vZGVsKTtcblxuICAgIGNvbnN0IHV1aWQgPSB0aGlzLmdldCgndXVpZCcpO1xuICAgIC8vIEdyb3VwIGNhbGxzIGFyZSBhbHdheXMgd2l0aCBmb2xrcyB0aGF0IGhhdmUgYSBVVUlEXG4gICAgaWYgKGlzVW50cnVzdGVkICYmIHV1aWQpIHtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY2FsbGluZy5rZXlDaGFuZ2VkKHsgdXVpZCB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBhZGRWZXJpZmllZENoYW5nZShcbiAgICB2ZXJpZmllZENoYW5nZUlkOiBzdHJpbmcsXG4gICAgdmVyaWZpZWQ6IGJvb2xlYW4sXG4gICAgb3B0aW9uczogeyBsb2NhbD86IGJvb2xlYW4gfSA9IHsgbG9jYWw6IHRydWUgfVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoaXNNZSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBsb2cuaW5mbygncmVmdXNpbmcgdG8gYWRkIHZlcmlmaWVkIGNoYW5nZSBhZHZpc29yeSBmb3Igb3VyIG93biBudW1iZXInKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0TWVzc2FnZSA9IHRoaXMuZ2V0KCd0aW1lc3RhbXAnKSB8fCBEYXRlLm5vdygpO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICAnYWRkaW5nIHZlcmlmaWVkIGNoYW5nZSBhZHZpc29yeSBmb3InLFxuICAgICAgdGhpcy5pZEZvckxvZ2dpbmcoKSxcbiAgICAgIHZlcmlmaWVkQ2hhbmdlSWQsXG4gICAgICBsYXN0TWVzc2FnZVxuICAgICk7XG5cbiAgICBjb25zdCBzaG91bGRCZVVuc2VlbiA9ICFvcHRpb25zLmxvY2FsICYmICF2ZXJpZmllZDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAgIGlkOiBnZW5lcmF0ZUd1aWQoKSxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLmlkLFxuICAgICAgbG9jYWw6IEJvb2xlYW4ob3B0aW9ucy5sb2NhbCksXG4gICAgICByZWFkU3RhdHVzOiBzaG91bGRCZVVuc2VlbiA/IFJlYWRTdGF0dXMuVW5yZWFkIDogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgcmVjZWl2ZWRfYXRfbXM6IHRpbWVzdGFtcCxcbiAgICAgIHJlY2VpdmVkX2F0OiB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgIHNlZW5TdGF0dXM6IHNob3VsZEJlVW5zZWVuID8gU2VlblN0YXR1cy5VbnNlZW4gOiBTZWVuU3RhdHVzLlVuc2VlbixcbiAgICAgIHNlbnRfYXQ6IGxhc3RNZXNzYWdlLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgdHlwZTogJ3ZlcmlmaWVkLWNoYW5nZScsXG4gICAgICB2ZXJpZmllZCxcbiAgICAgIHZlcmlmaWVkQ2hhbmdlZDogdmVyaWZpZWRDaGFuZ2VJZCxcbiAgICB9O1xuXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UsIHtcbiAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICBmb3JjZVNhdmU6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3QgbW9kZWwgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICBtZXNzYWdlLmlkLFxuICAgICAgbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2UobWVzc2FnZSlcbiAgICApO1xuXG4gICAgdGhpcy50cmlnZ2VyKCduZXdtZXNzYWdlJywgbW9kZWwpO1xuICAgIHRoaXMudXBkYXRlVW5yZWFkKCk7XG5cbiAgICBjb25zdCB1dWlkID0gdGhpcy5nZXRVdWlkKCk7XG4gICAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykgJiYgdXVpZCkge1xuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0QWxsR3JvdXBzSW52b2x2aW5nVXVpZCh1dWlkKS50aGVuKFxuICAgICAgICBncm91cHMgPT4ge1xuICAgICAgICAgIHdpbmRvdy5fLmZvckVhY2goZ3JvdXBzLCBncm91cCA9PiB7XG4gICAgICAgICAgICBncm91cC5hZGRWZXJpZmllZENoYW5nZSh0aGlzLmlkLCB2ZXJpZmllZCwgb3B0aW9ucyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWRkQ2FsbEhpc3RvcnkoXG4gICAgY2FsbEhpc3RvcnlEZXRhaWxzOiBDYWxsSGlzdG9yeURldGFpbHNUeXBlLFxuICAgIHJlY2VpdmVkQXRDb3VudGVyOiBudW1iZXIgfCB1bmRlZmluZWRcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIGxldCB1bnJlYWQ6IGJvb2xlYW47XG4gICAgbGV0IGRldGFpbHNUb1NhdmU6IENhbGxIaXN0b3J5RGV0YWlsc1R5cGU7XG5cbiAgICBzd2l0Y2ggKGNhbGxIaXN0b3J5RGV0YWlscy5jYWxsTW9kZSkge1xuICAgICAgY2FzZSBDYWxsTW9kZS5EaXJlY3Q6XG4gICAgICAgIHRpbWVzdGFtcCA9IGNhbGxIaXN0b3J5RGV0YWlscy5lbmRlZFRpbWU7XG4gICAgICAgIHVucmVhZCA9XG4gICAgICAgICAgIWNhbGxIaXN0b3J5RGV0YWlscy53YXNEZWNsaW5lZCAmJiAhY2FsbEhpc3RvcnlEZXRhaWxzLmFjY2VwdGVkVGltZTtcbiAgICAgICAgZGV0YWlsc1RvU2F2ZSA9IHtcbiAgICAgICAgICAuLi5jYWxsSGlzdG9yeURldGFpbHMsXG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENhbGxNb2RlLkdyb3VwOlxuICAgICAgICB0aW1lc3RhbXAgPSBjYWxsSGlzdG9yeURldGFpbHMuc3RhcnRlZFRpbWU7XG4gICAgICAgIHVucmVhZCA9IGZhbHNlO1xuICAgICAgICBkZXRhaWxzVG9TYXZlID0gY2FsbEhpc3RvcnlEZXRhaWxzO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoY2FsbEhpc3RvcnlEZXRhaWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICB0eXBlOiAnY2FsbC1oaXN0b3J5JyxcbiAgICAgIHNlbnRfYXQ6IHRpbWVzdGFtcCxcbiAgICAgIHJlY2VpdmVkX2F0OlxuICAgICAgICByZWNlaXZlZEF0Q291bnRlciB8fCB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiB0aW1lc3RhbXAsXG4gICAgICByZWFkU3RhdHVzOiB1bnJlYWQgPyBSZWFkU3RhdHVzLlVucmVhZCA6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlZW5TdGF0dXM6IHVucmVhZCA/IFNlZW5TdGF0dXMuVW5zZWVuIDogU2VlblN0YXR1cy5Ob3RBcHBsaWNhYmxlLFxuICAgICAgY2FsbEhpc3RvcnlEZXRhaWxzOiBkZXRhaWxzVG9TYXZlLFxuICAgICAgLy8gVE9ETzogREVTS1RPUC03MjJcbiAgICB9IGFzIHVua25vd24gYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlO1xuXG4gICAgY29uc3QgaWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobWVzc2FnZSwge1xuICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgICBjb25zdCBtb2RlbCA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgIGlkLFxuICAgICAgbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgICAuLi5tZXNzYWdlLFxuICAgICAgICBpZCxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMudHJpZ2dlcignbmV3bWVzc2FnZScsIG1vZGVsKTtcbiAgICB0aGlzLnVwZGF0ZVVucmVhZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBncm91cCBjYWxsIGhpc3RvcnkgbWVzc2FnZSBpZiBvbmUgaXMgbmVlZGVkLiBJdCB3b24ndCBhZGQgaGlzdG9yeSBtZXNzYWdlcyBmb3JcbiAgICogdGhlIHNhbWUgZ3JvdXAgY2FsbCBlcmEgSUQuXG4gICAqXG4gICAqIFJlc29sdmVzIHdpdGggYHRydWVgIGlmIGEgbmV3IG1lc3NhZ2Ugd2FzIGFkZGVkLCBhbmQgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBhc3luYyB1cGRhdGVDYWxsSGlzdG9yeUZvckdyb3VwQ2FsbChcbiAgICBlcmFJZDogc3RyaW5nLFxuICAgIGNyZWF0b3JVdWlkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2Ugd2FudCB0byB1cGRhdGUgdGhlIGNhY2hlIHF1aWNrbHkgaW4gY2FzZSB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICBjb25zdCBvbGRDYWNoZWRFcmFJZCA9IHRoaXMuY2FjaGVkTGF0ZXN0R3JvdXBDYWxsRXJhSWQ7XG4gICAgdGhpcy5jYWNoZWRMYXRlc3RHcm91cENhbGxFcmFJZCA9IGVyYUlkO1xuXG4gICAgY29uc3QgYWxyZWFkeUhhc01lc3NhZ2UgPVxuICAgICAgKG9sZENhY2hlZEVyYUlkICYmIG9sZENhY2hlZEVyYUlkID09PSBlcmFJZCkgfHxcbiAgICAgIChhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuaGFzR3JvdXBDYWxsSGlzdG9yeU1lc3NhZ2UodGhpcy5pZCwgZXJhSWQpKTtcblxuICAgIGlmIChhbHJlYWR5SGFzTWVzc2FnZSkge1xuICAgICAgdGhpcy51cGRhdGVMYXN0TWVzc2FnZSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYWRkQ2FsbEhpc3RvcnkoXG4gICAgICB7XG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgY3JlYXRvclV1aWQsXG4gICAgICAgIGVyYUlkLFxuICAgICAgICBzdGFydGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgICB1bmRlZmluZWRcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgYWRkUHJvZmlsZUNoYW5nZShcbiAgICBwcm9maWxlQ2hhbmdlOiB1bmtub3duLFxuICAgIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLmlkLFxuICAgICAgdHlwZTogJ3Byb2ZpbGUtY2hhbmdlJyxcbiAgICAgIHNlbnRfYXQ6IG5vdyxcbiAgICAgIHJlY2VpdmVkX2F0OiB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiBub3csXG4gICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLk5vdEFwcGxpY2FibGUsXG4gICAgICBjaGFuZ2VkSWQ6IGNvbnZlcnNhdGlvbklkIHx8IHRoaXMuaWQsXG4gICAgICBwcm9maWxlQ2hhbmdlLFxuICAgICAgLy8gVE9ETzogREVTS1RPUC03MjJcbiAgICB9IGFzIHVua25vd24gYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlO1xuXG4gICAgY29uc3QgaWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobWVzc2FnZSwge1xuICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgICBjb25zdCBtb2RlbCA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgIGlkLFxuICAgICAgbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgICAuLi5tZXNzYWdlLFxuICAgICAgICBpZCxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMudHJpZ2dlcignbmV3bWVzc2FnZScsIG1vZGVsKTtcblxuICAgIGNvbnN0IHV1aWQgPSB0aGlzLmdldFV1aWQoKTtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSAmJiB1dWlkKSB7XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKHV1aWQpLnRoZW4oXG4gICAgICAgIGdyb3VwcyA9PiB7XG4gICAgICAgICAgd2luZG93Ll8uZm9yRWFjaChncm91cHMsIGdyb3VwID0+IHtcbiAgICAgICAgICAgIGdyb3VwLmFkZFByb2ZpbGVDaGFuZ2UocHJvZmlsZUNoYW5nZSwgdGhpcy5pZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWRkTm90aWZpY2F0aW9uKFxuICAgIHR5cGU6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVsndHlwZSddLFxuICAgIGV4dHJhOiBQYXJ0aWFsPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT4gPSB7fVxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgbWVzc2FnZTogUGFydGlhbDxNZXNzYWdlQXR0cmlidXRlc1R5cGU+ID0ge1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICB0eXBlLFxuICAgICAgc2VudF9hdDogbm93LFxuICAgICAgcmVjZWl2ZWRfYXQ6IHdpbmRvdy5TaWduYWwuVXRpbC5pbmNyZW1lbnRNZXNzYWdlQ291bnRlcigpLFxuICAgICAgcmVjZWl2ZWRfYXRfbXM6IG5vdyxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuTm90QXBwbGljYWJsZSxcblxuICAgICAgLi4uZXh0cmEsXG4gICAgfTtcblxuICAgIGNvbnN0IGlkID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKFxuICAgICAgLy8gVE9ETzogREVTS1RPUC03MjJcbiAgICAgIG1lc3NhZ2UgYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICAgICAge1xuICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgfVxuICAgICk7XG4gICAgY29uc3QgbW9kZWwgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICBpZCxcbiAgICAgIG5ldyB3aW5kb3cuV2hpc3Blci5NZXNzYWdlKHtcbiAgICAgICAgLi4uKG1lc3NhZ2UgYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlKSxcbiAgICAgICAgaWQsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ25ld21lc3NhZ2UnLCBtb2RlbCk7XG5cbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBhc3luYyBtYXliZVNldFBlbmRpbmdVbml2ZXJzYWxUaW1lcihcbiAgICBoYXNVc2VySW5pdGlhdGVkTWVzc2FnZXM6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTTVNPbmx5KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGFzVXNlckluaXRpYXRlZE1lc3NhZ2VzKSB7XG4gICAgICBhd2FpdCB0aGlzLm1heWJlUmVtb3ZlVW5pdmVyc2FsVGltZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nZXQoJ3BlbmRpbmdVbml2ZXJzYWxUaW1lcicpIHx8IHRoaXMuZ2V0KCdleHBpcmVUaW1lcicpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXhwaXJlVGltZXIgPSB1bml2ZXJzYWxFeHBpcmVUaW1lci5nZXQoKTtcbiAgICBpZiAoIWV4cGlyZVRpbWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oXG4gICAgICBgbWF5YmVTZXRQZW5kaW5nVW5pdmVyc2FsVGltZXIoJHt0aGlzLmlkRm9yTG9nZ2luZygpfSk6IGFkZGVkIG5vdGlmaWNhdGlvbmBcbiAgICApO1xuICAgIGNvbnN0IG5vdGlmaWNhdGlvbklkID0gYXdhaXQgdGhpcy5hZGROb3RpZmljYXRpb24oXG4gICAgICAndW5pdmVyc2FsLXRpbWVyLW5vdGlmaWNhdGlvbidcbiAgICApO1xuICAgIHRoaXMuc2V0KCdwZW5kaW5nVW5pdmVyc2FsVGltZXInLCBub3RpZmljYXRpb25JZCk7XG4gIH1cblxuICBhc3luYyBtYXliZUFwcGx5VW5pdmVyc2FsVGltZXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQ2hlY2sgaWYgd2UgaGFkIGEgbm90aWZpY2F0aW9uXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5tYXliZVJlbW92ZVVuaXZlcnNhbFRpbWVyKCkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgYWxyZWFkeSBoYXZlIGFuIGV4cGlyYXRpb24gdGltZXJcbiAgICBpZiAodGhpcy5nZXQoJ2V4cGlyZVRpbWVyJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBleHBpcmVUaW1lciA9IHVuaXZlcnNhbEV4cGlyZVRpbWVyLmdldCgpO1xuICAgIGlmIChleHBpcmVUaW1lcikge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBtYXliZUFwcGx5VW5pdmVyc2FsVGltZXIoJHt0aGlzLmlkRm9yTG9nZ2luZygpfSk6IGFwcGx5aW5nIHRpbWVyYFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgdGhpcy51cGRhdGVFeHBpcmF0aW9uVGltZXIoZXhwaXJlVGltZXIsIHtcbiAgICAgICAgcmVhc29uOiAnbWF5YmVBcHBseVVuaXZlcnNhbFRpbWVyJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1heWJlUmVtb3ZlVW5pdmVyc2FsVGltZXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uSWQgPSB0aGlzLmdldCgncGVuZGluZ1VuaXZlcnNhbFRpbWVyJyk7XG4gICAgaWYgKCFub3RpZmljYXRpb25JZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KCdwZW5kaW5nVW5pdmVyc2FsVGltZXInLCB1bmRlZmluZWQpO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYG1heWJlUmVtb3ZlVW5pdmVyc2FsVGltZXIoJHt0aGlzLmlkRm9yTG9nZ2luZygpfSk6IHJlbW92ZWQgbm90aWZpY2F0aW9uYFxuICAgICk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobm90aWZpY2F0aW9uSWQpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlTWVzc2FnZShtZXNzYWdlLmlkKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBhZGRDaGFuZ2VOdW1iZXJOb3RpZmljYXRpb24oXG4gICAgb2xkVmFsdWU6IHN0cmluZyxcbiAgICBuZXdWYWx1ZTogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNvdXJjZVV1aWQgPSB0aGlzLmdldENoZWNrZWRVdWlkKFxuICAgICAgJ0NoYW5nZSBudW1iZXIgbm90aWZpY2F0aW9uIHdpdGhvdXQgdXVpZCdcbiAgICApO1xuXG4gICAgY29uc3QgeyBzdG9yYWdlIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgICBpZiAoc3RvcmFnZS51c2VyLmdldE91clV1aWRLaW5kKHNvdXJjZVV1aWQpICE9PSBVVUlES2luZC5Vbmtub3duKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYENvbnZlcnNhdGlvbiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9OiBub3QgYWRkaW5nIGNoYW5nZSBudW1iZXIgYCArXG4gICAgICAgICAgJ25vdGlmaWNhdGlvbiBmb3Igb3Vyc2VsdmVzJ1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBDb252ZXJzYXRpb24gJHt0aGlzLmlkRm9yTG9nZ2luZygpfTogYWRkaW5nIGNoYW5nZSBudW1iZXIgYCArXG4gICAgICAgIGBub3RpZmljYXRpb24gZm9yICR7c291cmNlVXVpZC50b1N0cmluZygpfSBmcm9tICR7b2xkVmFsdWV9IHRvICR7bmV3VmFsdWV9YFxuICAgICk7XG5cbiAgICBjb25zdCBjb252b3MgPSBbXG4gICAgICB0aGlzLFxuICAgICAgLi4uKGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldEFsbEdyb3Vwc0ludm9sdmluZ1V1aWQoXG4gICAgICAgIHNvdXJjZVV1aWRcbiAgICAgICkpLFxuICAgIF07XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGNvbnZvcy5tYXAoY29udm8gPT4ge1xuICAgICAgICByZXR1cm4gY29udm8uYWRkTm90aWZpY2F0aW9uKCdjaGFuZ2UtbnVtYmVyLW5vdGlmaWNhdGlvbicsIHtcbiAgICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICAgICAgc291cmNlVXVpZDogc291cmNlVXVpZC50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIG9uUmVhZE1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZU1vZGVsLCByZWFkQXQ/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBXZSBtYXJrIGFzIHJlYWQgZXZlcnl0aGluZyBvbGRlciB0aGFuIHRoaXMgbWVzc2FnZSAtIHRvIGNsZWFuIHVwIG9sZCBzdHVmZlxuICAgIC8vICAgc3RpbGwgbWFya2VkIHVucmVhZCBpbiB0aGUgZGF0YWJhc2UuIElmIHRoZSB1c2VyIGdlbmVyYWxseSBkb2Vzbid0IHJlYWQgaW5cbiAgICAvLyAgIHRoZSBkZXNrdG9wIGFwcCwgc28gdGhlIGRlc2t0b3AgYXBwIG9ubHkgZ2V0cyByZWFkIHN5bmNzLCB3ZSBjYW4gdmVyeVxuICAgIC8vICAgZWFzaWx5IGVuZCB1cCB3aXRoIG1lc3NhZ2VzIG5ldmVyIG1hcmtlZCBhcyByZWFkIChvdXIgcHJldmlvdXMgZWFybHkgcmVhZFxuICAgIC8vICAgc3luYyBoYW5kbGluZywgcmVhZCBzeW5jcyBuZXZlciBzZW50IGJlY2F1c2UgYXBwIHdhcyBvZmZsaW5lKVxuXG4gICAgLy8gV2UgcXVldWUgaXQgYmVjYXVzZSB3ZSBvZnRlbiBnZXQgYSB3aG9sZSBsb3Qgb2YgcmVhZCBzeW5jcyBhdCBvbmNlLCBhbmRcbiAgICAvLyAgIHRoZWlyIG1hcmtSZWFkIGNhbGxzIGNvdWxkIHZlcnkgZWFzaWx5IG92ZXJsYXAgZ2l2ZW4gdGhlIGFzeW5jIHB1bGwgZnJvbSBEQi5cblxuICAgIC8vIExhc3RseSwgd2UgZG9uJ3Qgc2VuZCByZWFkIHN5bmNzIGZvciBhbnkgbWVzc2FnZSBtYXJrZWQgcmVhZCBkdWUgdG8gYSByZWFkXG4gICAgLy8gICBzeW5jLiBUaGF0J3MgYSBub3RpZmljYXRpb24gZXhwbG9zaW9uIHdlIGRvbid0IG5lZWQuXG4gICAgcmV0dXJuIHRoaXMucXVldWVKb2IoJ29uUmVhZE1lc3NhZ2UnLCAoKSA9PlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgIHRoaXMubWFya1JlYWQobWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0JykhLCB7XG4gICAgICAgIG5ld2VzdFNlbnRBdDogbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgICAgc2VuZFJlYWRSZWNlaXB0czogZmFsc2UsXG4gICAgICAgIHJlYWRBdCxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZhbGlkYXRlKGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdmFsaWRhdGVDb252ZXJzYXRpb24oYXR0cmlidXRlcyk7XG4gIH1cblxuICBxdWV1ZUpvYjxUPihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s6IChhYm9ydFNpZ25hbDogQWJvcnRTaWduYWwpID0+IFByb21pc2U8VD5cbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgdGhpcy5qb2JRdWV1ZSA9IHRoaXMuam9iUXVldWUgfHwgbmV3IHdpbmRvdy5QUXVldWUoeyBjb25jdXJyZW5jeTogMSB9KTtcblxuICAgIGNvbnN0IHRhc2tXaXRoVGltZW91dCA9IGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAgIGNhbGxiYWNrLFxuICAgICAgYGNvbnZlcnNhdGlvbiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9YFxuICAgICk7XG5cbiAgICBjb25zdCBhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgY29uc3QgeyBzaWduYWw6IGFib3J0U2lnbmFsIH0gPSBhYm9ydENvbnRyb2xsZXI7XG5cbiAgICBjb25zdCBxdWV1ZWRBdCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuIHRoaXMuam9iUXVldWUuYWRkKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0ZWRBdCA9IERhdGUubm93KCk7XG4gICAgICBjb25zdCB3YWl0VGltZSA9IHN0YXJ0ZWRBdCAtIHF1ZXVlZEF0O1xuXG4gICAgICBpZiAod2FpdFRpbWUgPiBKT0JfUkVQT1JUSU5HX1RIUkVTSE9MRF9NUykge1xuICAgICAgICBsb2cuaW5mbyhgQ29udmVyc2F0aW9uIGpvYiAke25hbWV9IHdhcyBibG9ja2VkIGZvciAke3dhaXRUaW1lfW1zYCk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0YXNrV2l0aFRpbWVvdXQoYWJvcnRTaWduYWwpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSBEYXRlLm5vdygpIC0gc3RhcnRlZEF0O1xuXG4gICAgICAgIGlmIChkdXJhdGlvbiA+IEpPQl9SRVBPUlRJTkdfVEhSRVNIT0xEX01TKSB7XG4gICAgICAgICAgbG9nLmluZm8oYENvbnZlcnNhdGlvbiBqb2IgJHtuYW1lfSB0b29rICR7ZHVyYXRpb259bXNgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaXNBZG1pbih1dWlkOiBVVUlEKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmdldCgnbWVtYmVyc1YyJykgfHwgW107XG4gICAgY29uc3QgbWVtYmVyID0gbWVtYmVycy5maW5kKHggPT4geC51dWlkID09PSB1dWlkLnRvU3RyaW5nKCkpO1xuICAgIGlmICghbWVtYmVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgTUVNQkVSX1JPTEVTID0gUHJvdG8uTWVtYmVyLlJvbGU7XG5cbiAgICByZXR1cm4gbWVtYmVyLnJvbGUgPT09IE1FTUJFUl9ST0xFUy5BRE1JTklTVFJBVE9SO1xuICB9XG5cbiAgZ2V0VXVpZCgpOiBVVUlEIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldCgndXVpZCcpO1xuICAgICAgcmV0dXJuIHZhbHVlID8gbmV3IFVVSUQodmFsdWUpIDogdW5kZWZpbmVkO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBnZXRVdWlkKCk6IGZhaWxlZCB0byBvYnRhaW4gY29udmVyc2F0aW9uKCR7dGhpcy5pZH0pIHV1aWQgZHVlIHRvYCxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGdldENoZWNrZWRVdWlkKHJlYXNvbjogc3RyaW5nKTogVVVJRCB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRVdWlkKCk7XG4gICAgc3RyaWN0QXNzZXJ0KHJlc3VsdCAhPT0gdW5kZWZpbmVkLCByZWFzb24pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGdldE1lbWJlcnNoaXBzKCk6IEFycmF5PHtcbiAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgICBpc0FkbWluOiBib29sZWFuO1xuICB9PiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmdldCgnbWVtYmVyc1YyJykgfHwgW107XG4gICAgcmV0dXJuIG1lbWJlcnMubWFwKG1lbWJlciA9PiAoe1xuICAgICAgaXNBZG1pbjogbWVtYmVyLnJvbGUgPT09IFByb3RvLk1lbWJlci5Sb2xlLkFETUlOSVNUUkFUT1IsXG4gICAgICB1dWlkOiBtZW1iZXIudXVpZCxcbiAgICB9KSk7XG4gIH1cblxuICBnZXRHcm91cExpbmsoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nZXQoJ2dyb3VwSW52aXRlTGlua1Bhc3N3b3JkJykpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkR3JvdXBMaW5rKHRoaXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQZW5kaW5nTWVtYmVyc2hpcHMoKTogQXJyYXk8e1xuICAgIGFkZGVkQnlVc2VySWQ/OiBVVUlEU3RyaW5nVHlwZTtcbiAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgfT4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5nZXQoJ3BlbmRpbmdNZW1iZXJzVjInKSB8fCBbXTtcbiAgICByZXR1cm4gbWVtYmVycy5tYXAobWVtYmVyID0+ICh7XG4gICAgICBhZGRlZEJ5VXNlcklkOiBtZW1iZXIuYWRkZWRCeVVzZXJJZCxcbiAgICAgIHV1aWQ6IG1lbWJlci51dWlkLFxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGVuZGluZ0FwcHJvdmFsTWVtYmVyc2hpcHMoKTogQXJyYXk8eyB1dWlkOiBVVUlEU3RyaW5nVHlwZSB9PiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmdldCgncGVuZGluZ0FkbWluQXBwcm92YWxWMicpIHx8IFtdO1xuICAgIHJldHVybiBtZW1iZXJzLm1hcChtZW1iZXIgPT4gKHtcbiAgICAgIHV1aWQ6IG1lbWJlci51dWlkLFxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmFubmVkTWVtYmVyc2hpcHMoKTogQXJyYXk8VVVJRFN0cmluZ1R5cGU+IHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLmdldCgnYmFubmVkTWVtYmVyc1YyJykgfHwgW10pLm1hcChtZW1iZXIgPT4gbWVtYmVyLnV1aWQpO1xuICB9XG5cbiAgZ2V0TWVtYmVycyhcbiAgICBvcHRpb25zOiB7IGluY2x1ZGVQZW5kaW5nTWVtYmVycz86IGJvb2xlYW4gfSA9IHt9XG4gICk6IEFycmF5PENvbnZlcnNhdGlvbk1vZGVsPiB7XG4gICAgcmV0dXJuIGNvbXBhY3QoXG4gICAgICBnZXRDb252ZXJzYXRpb25NZW1iZXJzKHRoaXMuYXR0cmlidXRlcywgb3B0aW9ucykubWFwKGNvbnZlcnNhdGlvbkF0dHJzID0+XG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25BdHRycy5pZClcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgY2FuQmVBbm5vdW5jZW1lbnRHcm91cCgpOiBib29sZWFuIHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFpc0Fubm91bmNlbWVudEdyb3VwUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0TWVtYmVySWRzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmdldE1lbWJlcnMoKTtcbiAgICByZXR1cm4gbWVtYmVycy5tYXAobWVtYmVyID0+IG1lbWJlci5pZCk7XG4gIH1cblxuICBnZXRNZW1iZXJVdWlkcygpOiBBcnJheTxVVUlEPiB7XG4gICAgY29uc3QgbWVtYmVycyA9IHRoaXMuZ2V0TWVtYmVycygpO1xuICAgIHJldHVybiBtZW1iZXJzLm1hcChtZW1iZXIgPT4ge1xuICAgICAgcmV0dXJuIG1lbWJlci5nZXRDaGVja2VkVXVpZCgnR3JvdXAgbWVtYmVyIHdpdGhvdXQgdXVpZCcpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjaXBpZW50cyh7XG4gICAgaW5jbHVkZVBlbmRpbmdNZW1iZXJzLFxuICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQsXG4gIH06IHtcbiAgICBpbmNsdWRlUGVuZGluZ01lbWJlcnM/OiBib29sZWFuO1xuICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQ/OiBBcnJheTxzdHJpbmc+O1xuICB9ID0ge30pOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gZ2V0UmVjaXBpZW50cyh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgIGluY2x1ZGVQZW5kaW5nTWVtYmVycyxcbiAgICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQsXG4gICAgfSk7XG4gIH1cblxuICAvLyBNZW1iZXJzIGlzIGFsbCBwZW9wbGUgaW4gdGhlIGdyb3VwXG4gIGdldE1lbWJlckNvbnZlcnNhdGlvbklkcygpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBTZXQobWFwKHRoaXMuZ2V0TWVtYmVycygpLCBjb252ZXJzYXRpb24gPT4gY29udmVyc2F0aW9uLmlkKSk7XG4gIH1cblxuICBhc3luYyBnZXRRdW90ZUF0dGFjaG1lbnQoXG4gICAgYXR0YWNobWVudHM/OiBBcnJheTxBdHRhY2htZW50VHlwZT4sXG4gICAgcHJldmlldz86IEFycmF5PExpbmtQcmV2aWV3VHlwZT4sXG4gICAgc3RpY2tlcj86IFN0aWNrZXJUeXBlXG4gICk6IFByb21pc2U8XG4gICAgQXJyYXk8e1xuICAgICAgY29udGVudFR5cGU6IE1JTUVUeXBlO1xuICAgICAgZmlsZU5hbWU6IHN0cmluZyB8IG51bGw7XG4gICAgICB0aHVtYm5haWw6IFRodW1ibmFpbFR5cGUgfCBudWxsO1xuICAgIH0+XG4gID4ge1xuICAgIGlmIChhdHRhY2htZW50cyAmJiBhdHRhY2htZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGF0dGFjaG1lbnRzVG9Vc2UgPSBBcnJheS5mcm9tKHRha2UoYXR0YWNobWVudHMsIDEpKTtcbiAgICAgIGNvbnN0IGlzR0lGUXVvdGUgPSBpc0dJRihhdHRhY2htZW50c1RvVXNlKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBtYXAoYXR0YWNobWVudHNUb1VzZSwgYXN5bmMgYXR0YWNobWVudCA9PiB7XG4gICAgICAgICAgY29uc3QgeyBwYXRoLCBmaWxlTmFtZSwgdGh1bWJuYWlsLCBjb250ZW50VHlwZSB9ID0gYXR0YWNobWVudDtcblxuICAgICAgICAgIGlmICghcGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6IGlzR0lGUXVvdGUgPyBJTUFHRV9HSUYgOiBjb250ZW50VHlwZSxcbiAgICAgICAgICAgICAgLy8gT3VyIHByb3RvcyBsaWJyYXJ5IGNvbXBsYWlucyBhYm91dCB0aGlzIGZpZWxkIGJlaW5nIHVuZGVmaW5lZCwgc28gd2VcbiAgICAgICAgICAgICAgLy8gICBmb3JjZSBpdCB0byBudWxsXG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSB8fCBudWxsLFxuICAgICAgICAgICAgICB0aHVtYm5haWw6IG51bGwsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogaXNHSUZRdW90ZSA/IElNQUdFX0dJRiA6IGNvbnRlbnRUeXBlLFxuICAgICAgICAgICAgLy8gT3VyIHByb3RvcyBsaWJyYXJ5IGNvbXBsYWlucyBhYm91dCB0aGlzIGZpZWxkIGJlaW5nIHVuZGVmaW5lZCwgc28gd2UgZm9yY2VcbiAgICAgICAgICAgIC8vICAgaXQgdG8gbnVsbFxuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lIHx8IG51bGwsXG4gICAgICAgICAgICB0aHVtYm5haWw6IHRodW1ibmFpbFxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIC4uLihhd2FpdCBsb2FkQXR0YWNobWVudERhdGEodGh1bWJuYWlsKSksXG4gICAgICAgICAgICAgICAgICBvYmplY3RVcmw6IHRodW1ibmFpbC5wYXRoXG4gICAgICAgICAgICAgICAgICAgID8gZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCh0aHVtYm5haWwucGF0aClcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHByZXZpZXdJbWFnZXMgPSBjb2xsZWN0KHByZXZpZXcsIHByZXYgPT4gcHJldi5pbWFnZSk7XG4gICAgICBjb25zdCBwcmV2aWV3SW1hZ2VzVG9Vc2UgPSB0YWtlKHByZXZpZXdJbWFnZXMsIDEpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIG1hcChwcmV2aWV3SW1hZ2VzVG9Vc2UsIGFzeW5jIGltYWdlID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNvbnRlbnRUeXBlIH0gPSBpbWFnZTtcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50VHlwZSxcbiAgICAgICAgICAgIC8vIE91ciBwcm90b3MgbGlicmFyeSBjb21wbGFpbnMgYWJvdXQgdGhpcyBmaWVsZCBiZWluZyB1bmRlZmluZWQsIHNvIHdlXG4gICAgICAgICAgICAvLyAgIGZvcmNlIGl0IHRvIG51bGxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBudWxsLFxuICAgICAgICAgICAgdGh1bWJuYWlsOiBpbWFnZVxuICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgIC4uLihhd2FpdCBsb2FkQXR0YWNobWVudERhdGEoaW1hZ2UpKSxcbiAgICAgICAgICAgICAgICAgIG9iamVjdFVybDogaW1hZ2UucGF0aFxuICAgICAgICAgICAgICAgICAgICA/IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgoaW1hZ2UucGF0aClcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHN0aWNrZXIgJiYgc3RpY2tlci5kYXRhICYmIHN0aWNrZXIuZGF0YS5wYXRoKSB7XG4gICAgICBjb25zdCB7IHBhdGgsIGNvbnRlbnRUeXBlIH0gPSBzdGlja2VyLmRhdGE7XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZW50VHlwZSxcbiAgICAgICAgICAvLyBPdXIgcHJvdG9zIGxpYnJhcnkgY29tcGxhaW5zIGFib3V0IHRoaXMgZmllbGQgYmVpbmcgdW5kZWZpbmVkLCBzbyB3ZVxuICAgICAgICAgIC8vICAgZm9yY2UgaXQgdG8gbnVsbFxuICAgICAgICAgIGZpbGVOYW1lOiBudWxsLFxuICAgICAgICAgIHRodW1ibmFpbDoge1xuICAgICAgICAgICAgLi4uKGF3YWl0IGxvYWRBdHRhY2htZW50RGF0YShzdGlja2VyLmRhdGEpKSxcbiAgICAgICAgICAgIG9iamVjdFVybDogcGF0aCA/IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgocGF0aCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYXN5bmMgbWFrZVF1b3RlKHF1b3RlZE1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCk6IFByb21pc2U8UXVvdGVkTWVzc2FnZVR5cGU+IHtcbiAgICBjb25zdCB7IGdldE5hbWUgfSA9IEVtYmVkZGVkQ29udGFjdDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IGNvbnRhY3QgPSBnZXRDb250YWN0KHF1b3RlZE1lc3NhZ2UuYXR0cmlidXRlcykhO1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gcXVvdGVkTWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJyk7XG4gICAgY29uc3QgcHJldmlldyA9IHF1b3RlZE1lc3NhZ2UuZ2V0KCdwcmV2aWV3Jyk7XG4gICAgY29uc3Qgc3RpY2tlciA9IHF1b3RlZE1lc3NhZ2UuZ2V0KCdzdGlja2VyJyk7XG5cbiAgICBjb25zdCBib2R5ID0gcXVvdGVkTWVzc2FnZS5nZXQoJ2JvZHknKTtcbiAgICBjb25zdCBlbWJlZGRlZENvbnRhY3QgPSBxdW90ZWRNZXNzYWdlLmdldCgnY29udGFjdCcpO1xuICAgIGNvbnN0IGVtYmVkZGVkQ29udGFjdE5hbWUgPVxuICAgICAgZW1iZWRkZWRDb250YWN0ICYmIGVtYmVkZGVkQ29udGFjdC5sZW5ndGggPiAwXG4gICAgICAgID8gZ2V0TmFtZShlbWJlZGRlZENvbnRhY3RbMF0pXG4gICAgICAgIDogJyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYXV0aG9yVXVpZDogY29udGFjdC5nZXQoJ3V1aWQnKSxcbiAgICAgIGF0dGFjaG1lbnRzOiBpc1RhcFRvVmlldyhxdW90ZWRNZXNzYWdlLmF0dHJpYnV0ZXMpXG4gICAgICAgID8gW3sgY29udGVudFR5cGU6IElNQUdFX0pQRUcsIGZpbGVOYW1lOiBudWxsIH1dXG4gICAgICAgIDogYXdhaXQgdGhpcy5nZXRRdW90ZUF0dGFjaG1lbnQoYXR0YWNobWVudHMsIHByZXZpZXcsIHN0aWNrZXIpLFxuICAgICAgYm9keVJhbmdlczogcXVvdGVkTWVzc2FnZS5nZXQoJ2JvZHlSYW5nZXMnKSxcbiAgICAgIGlkOiBxdW90ZWRNZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgaXNWaWV3T25jZTogaXNUYXBUb1ZpZXcocXVvdGVkTWVzc2FnZS5hdHRyaWJ1dGVzKSxcbiAgICAgIGlzR2lmdEJhZGdlOiBpc0dpZnRCYWRnZShxdW90ZWRNZXNzYWdlLmF0dHJpYnV0ZXMpLFxuICAgICAgbWVzc2FnZUlkOiBxdW90ZWRNZXNzYWdlLmdldCgnaWQnKSxcbiAgICAgIHJlZmVyZW5jZWRNZXNzYWdlTm90Rm91bmQ6IGZhbHNlLFxuICAgICAgdGV4dDogYm9keSB8fCBlbWJlZGRlZENvbnRhY3ROYW1lLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBzZW5kU3RpY2tlck1lc3NhZ2UocGFja0lkOiBzdHJpbmcsIHN0aWNrZXJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGFja0RhdGEgPSBTdGlja2Vycy5nZXRTdGlja2VyUGFjayhwYWNrSWQpO1xuICAgIGNvbnN0IHN0aWNrZXJEYXRhID0gU3RpY2tlcnMuZ2V0U3RpY2tlcihwYWNrSWQsIHN0aWNrZXJJZCk7XG4gICAgaWYgKCFzdGlja2VyRGF0YSB8fCAhcGFja0RhdGEpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgQXR0ZW1wdGVkIHRvIHNlbmQgbm9uZXhpc3RlbnQgKCR7cGFja0lkfSwgJHtzdGlja2VySWR9KSBzdGlja2VyIWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBrZXkgfSA9IHBhY2tEYXRhO1xuICAgIGNvbnN0IHsgZW1vamksIHBhdGgsIHdpZHRoLCBoZWlnaHQgfSA9IHN0aWNrZXJEYXRhO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZWFkU3RpY2tlckRhdGEocGF0aCk7XG5cbiAgICAvLyBXZSBuZWVkIHRoaXMgY29udGVudCB0eXBlIHRvIGJlIGFuIGltYWdlIHNvIHdlIGNhbiBkaXNwbGF5IGFuIGA8aW1nPmAgaW5zdGVhZCBvZiBhXG4gICAgLy8gICBgPHZpZGVvPmAgb3IgYW4gZXJyb3IsIGJ1dCBpdCdzIG5vdCBjcml0aWNhbCB0aGF0IHdlIGdldCB0aGUgZnVsbCB0eXBlIGNvcnJlY3QuXG4gICAgLy8gICBJbiBvdGhlciB3b3JkcywgaXQncyBwcm9iYWJseSBmaW5lIGlmIHdlIHNheSB0aGF0IGEgR0lGIGlzIGBpbWFnZS9wbmdgLCBidXQgaXQnc1xuICAgIC8vICAgYnV0IGl0J3MgYmFkIGlmIHdlIHNheSBpdCdzIGB2aWRlby9tcDRgIG9yIGB0ZXh0L3BsYWluYC4gV2UgZG8gb3VyIGJlc3QgdG8gc25pZmZcbiAgICAvLyAgIHRoZSBNSU1FIHR5cGUgaGVyZSwgYnV0IGl0J3Mgb2theSBpZiB3ZSBoYXZlIHRvIHVzZSBhIHBvc3NpYmx5LWluY29ycmVjdFxuICAgIC8vICAgZmFsbGJhY2suXG4gICAgbGV0IGNvbnRlbnRUeXBlOiBNSU1FVHlwZTtcbiAgICBjb25zdCBzbmlmZmVkTWltZVR5cGUgPSBzbmlmZkltYWdlTWltZVR5cGUoZGF0YSk7XG4gICAgaWYgKHNuaWZmZWRNaW1lVHlwZSkge1xuICAgICAgY29udGVudFR5cGUgPSBzbmlmZmVkTWltZVR5cGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICAnc2VuZFN0aWNrZXJNZXNzYWdlOiBVbmFibGUgdG8gc25pZmYgc3RpY2tlciBNSU1FIHR5cGU7IGZhbGxpbmcgYmFjayB0byBXZWJQJ1xuICAgICAgKTtcbiAgICAgIGNvbnRlbnRUeXBlID0gSU1BR0VfV0VCUDtcbiAgICB9XG5cbiAgICBjb25zdCBzdGlja2VyOiBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSA9IHtcbiAgICAgIHBhY2tJZCxcbiAgICAgIHN0aWNrZXJJZCxcbiAgICAgIHBhY2tLZXk6IGtleSxcbiAgICAgIGVtb2ppLFxuICAgICAgZGF0YToge1xuICAgICAgICBzaXplOiBkYXRhLmJ5dGVMZW5ndGgsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGNvbnRlbnRUeXBlLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBibHVySGFzaDogYXdhaXQgd2luZG93LmltYWdlVG9CbHVySGFzaChcbiAgICAgICAgICBuZXcgQmxvYihbZGF0YV0sIHtcbiAgICAgICAgICAgIHR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHRoaXMuZW5xdWV1ZU1lc3NhZ2VGb3JTZW5kKHtcbiAgICAgIGJvZHk6IHVuZGVmaW5lZCxcbiAgICAgIGF0dGFjaG1lbnRzOiBbXSxcbiAgICAgIHN0aWNrZXIsXG4gICAgfSk7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5zdGlja2Vycy51c2VTdGlja2VyKHBhY2tJZCwgc3RpY2tlcklkKTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRQcm9maWxlS2V5VXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChpc01lKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzZW5kUHJvZmlsZUtleVVwZGF0ZTogcHJvZmlsZVNoYXJpbmcgbm90IGVuYWJsZWQgZm9yIGNvbnZlcnNhdGlvbicsXG4gICAgICAgIHRoaXMuaWRGb3JMb2dnaW5nKClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNvbnZlcnNhdGlvbkpvYlF1ZXVlLmFkZCh7XG4gICAgICAgIHR5cGU6IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLlByb2ZpbGVLZXksXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLmlkLFxuICAgICAgICByZXZpc2lvbjogdGhpcy5nZXQoJ3JldmlzaW9uJyksXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnc2VuZFByb2ZpbGVLZXlVcGRhdGU6IEZhaWxlZCB0byBxdWV1ZSBwcm9maWxlIHNoYXJlJyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBlbnF1ZXVlTWVzc2FnZUZvclNlbmQoXG4gICAge1xuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBib2R5LFxuICAgICAgY29udGFjdCxcbiAgICAgIG1lbnRpb25zLFxuICAgICAgcHJldmlldyxcbiAgICAgIHF1b3RlLFxuICAgICAgc3RpY2tlcixcbiAgICB9OiB7XG4gICAgICBhdHRhY2htZW50czogQXJyYXk8QXR0YWNobWVudFR5cGU+O1xuICAgICAgYm9keTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgY29udGFjdD86IEFycmF5PENvbnRhY3RXaXRoSHlkcmF0ZWRBdmF0YXI+O1xuICAgICAgbWVudGlvbnM/OiBCb2R5UmFuZ2VzVHlwZTtcbiAgICAgIHByZXZpZXc/OiBBcnJheTxMaW5rUHJldmlld1R5cGU+O1xuICAgICAgcXVvdGU/OiBRdW90ZWRNZXNzYWdlVHlwZTtcbiAgICAgIHN0aWNrZXI/OiBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YTtcbiAgICB9LFxuICAgIHtcbiAgICAgIGRvbnRDbGVhckRyYWZ0LFxuICAgICAgc2VuZEhRSW1hZ2VzLFxuICAgICAgc3RvcnlJZCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIGV4dHJhUmVkdXhBY3Rpb25zLFxuICAgIH06IHtcbiAgICAgIGRvbnRDbGVhckRyYWZ0PzogYm9vbGVhbjtcbiAgICAgIHNlbmRIUUltYWdlcz86IGJvb2xlYW47XG4gICAgICBzdG9yeUlkPzogc3RyaW5nO1xuICAgICAgdGltZXN0YW1wPzogbnVtYmVyO1xuICAgICAgZXh0cmFSZWR1eEFjdGlvbnM/OiAoKSA9PiB2b2lkO1xuICAgIH0gPSB7fVxuICApOiBQcm9taXNlPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICh0aGlzLmlzR3JvdXBWMUFuZERpc2FibGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBub3cgPSB0aW1lc3RhbXAgfHwgRGF0ZS5ub3coKTtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgJ1NlbmRpbmcgbWVzc2FnZSB0byBjb252ZXJzYXRpb24nLFxuICAgICAgdGhpcy5pZEZvckxvZ2dpbmcoKSxcbiAgICAgICd3aXRoIHRpbWVzdGFtcCcsXG4gICAgICBub3dcbiAgICApO1xuXG4gICAgdGhpcy5jbGVhclR5cGluZ1RpbWVycygpO1xuXG4gICAgY29uc3QgbWFuZGF0b3J5UHJvZmlsZVNoYXJpbmdFbmFibGVkID0gd2luZG93LlNpZ25hbC5SZW1vdGVDb25maWcuaXNFbmFibGVkKFxuICAgICAgJ2Rlc2t0b3AubWFuZGF0b3J5UHJvZmlsZVNoYXJpbmcnXG4gICAgKTtcblxuICAgIGF3YWl0IHRoaXMubWF5YmVBcHBseVVuaXZlcnNhbFRpbWVyKCk7XG5cbiAgICBjb25zdCBleHBpcmVUaW1lciA9IHRoaXMuZ2V0KCdleHBpcmVUaW1lcicpO1xuXG4gICAgY29uc3QgcmVjaXBpZW50TWF5YmVDb252ZXJzYXRpb25zID0gbWFwKHRoaXMuZ2V0UmVjaXBpZW50cygpLCBpZGVudGlmaWVyID0+XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoaWRlbnRpZmllcilcbiAgICApO1xuICAgIGNvbnN0IHJlY2lwaWVudENvbnZlcnNhdGlvbnMgPSBmaWx0ZXIoXG4gICAgICByZWNpcGllbnRNYXliZUNvbnZlcnNhdGlvbnMsXG4gICAgICBpc05vdE5pbFxuICAgICk7XG4gICAgY29uc3QgcmVjaXBpZW50Q29udmVyc2F0aW9uSWRzID0gY29uY2F0KFxuICAgICAgbWFwKHJlY2lwaWVudENvbnZlcnNhdGlvbnMsIGMgPT4gYy5pZCksXG4gICAgICBbd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KCldXG4gICAgKTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBsaW5rIHByZXZpZXdzIHByZXNlbnQgaW4gdGhlIG1lc3NhZ2Ugd2Ugc2hvdWxkbid0IGluY2x1ZGVcbiAgICAvLyBhbnkgYXR0YWNobWVudHMgYXMgd2VsbC5cbiAgICBjb25zdCBhdHRhY2htZW50c1RvU2VuZCA9IHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGggPyBbXSA6IGF0dGFjaG1lbnRzO1xuXG4gICAgaWYgKHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGgpIHtcbiAgICAgIGF0dGFjaG1lbnRzLmZvckVhY2goYXR0YWNobWVudCA9PiB7XG4gICAgICAgIGlmIChhdHRhY2htZW50LnBhdGgpIHtcbiAgICAgICAgICBkZWxldGVBdHRhY2htZW50RGF0YShhdHRhY2htZW50LnBhdGgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIZXJlIHdlIG1vdmUgYXR0YWNobWVudHMgdG8gZGlza1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBhd2FpdCB1cGdyYWRlTWVzc2FnZVNjaGVtYSh7XG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgIHR5cGU6ICdvdXRnb2luZycsXG4gICAgICBib2R5LFxuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICBjb250YWN0LFxuICAgICAgcXVvdGUsXG4gICAgICBwcmV2aWV3LFxuICAgICAgYXR0YWNobWVudHM6IGF0dGFjaG1lbnRzVG9TZW5kLFxuICAgICAgc2VudF9hdDogbm93LFxuICAgICAgcmVjZWl2ZWRfYXQ6IHdpbmRvdy5TaWduYWwuVXRpbC5pbmNyZW1lbnRNZXNzYWdlQ291bnRlcigpLFxuICAgICAgcmVjZWl2ZWRfYXRfbXM6IG5vdyxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5Ob3RBcHBsaWNhYmxlLFxuICAgICAgc3RpY2tlcixcbiAgICAgIGJvZHlSYW5nZXM6IG1lbnRpb25zLFxuICAgICAgc2VuZEhRSW1hZ2VzLFxuICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDogemlwT2JqZWN0KFxuICAgICAgICByZWNpcGllbnRDb252ZXJzYXRpb25JZHMsXG4gICAgICAgIHJlcGVhdCh7XG4gICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgICAgdXBkYXRlZEF0OiBub3csXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgc3RvcnlJZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vZGVsID0gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2UoYXR0cmlidXRlcyk7XG4gICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3Rlcihtb2RlbC5pZCwgbW9kZWwpO1xuICAgIG1lc3NhZ2UuY2FjaGVkT3V0Z29pbmdDb250YWN0RGF0YSA9IGNvbnRhY3Q7XG4gICAgbWVzc2FnZS5jYWNoZWRPdXRnb2luZ1ByZXZpZXdEYXRhID0gcHJldmlldztcbiAgICBtZXNzYWdlLmNhY2hlZE91dGdvaW5nUXVvdGVEYXRhID0gcXVvdGU7XG4gICAgbWVzc2FnZS5jYWNoZWRPdXRnb2luZ1N0aWNrZXJEYXRhID0gc3RpY2tlcjtcblxuICAgIGNvbnN0IGRiU3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgdHlwZW9mIG1lc3NhZ2UuYXR0cmlidXRlcy50aW1lc3RhbXAgPT09ICdudW1iZXInLFxuICAgICAgJ0V4cGVjdGVkIGEgdGltZXN0YW1wJ1xuICAgICk7XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLk5vcm1hbE1lc3NhZ2UsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLmlkLFxuICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2UuaWQsXG4gICAgICAgIHJldmlzaW9uOiB0aGlzLmdldCgncmV2aXNpb24nKSxcbiAgICAgIH0sXG4gICAgICBhc3luYyBqb2JUb0luc2VydCA9PiB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBlbnF1ZXVlTWVzc2FnZUZvclNlbmQ6IHNhdmluZyBtZXNzYWdlICR7bWVzc2FnZS5pZH0gYW5kIGpvYiAke2pvYlRvSW5zZXJ0LmlkfWBcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1lc3NhZ2UuYXR0cmlidXRlcywge1xuICAgICAgICAgIGpvYlRvSW5zZXJ0LFxuICAgICAgICAgIGZvcmNlU2F2ZTogdHJ1ZSxcbiAgICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgZGJEdXJhdGlvbiA9IERhdGUubm93KCkgLSBkYlN0YXJ0O1xuICAgIGlmIChkYkR1cmF0aW9uID4gU0VORF9SRVBPUlRJTkdfVEhSRVNIT0xEX01TKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYENvbnZlcnNhdGlvbk1vZGVsKCR7dGhpcy5pZEZvckxvZ2dpbmcoKX0uc2VuZE1lc3NhZ2UoJHtub3d9KTogYCArXG4gICAgICAgICAgYGRiIHNhdmUgdG9vayAke2RiRHVyYXRpb259bXNgXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlclN0YXJ0ID0gRGF0ZS5ub3coKTtcblxuICAgIC8vIFBlcmZvcm0gYXN5bmNocm9ub3VzIHRhc2tzIGJlZm9yZSBlbnRlcmluZyB0aGUgYmF0Y2hpbmcgbW9kZVxuICAgIGF3YWl0IHRoaXMuYmVmb3JlQWRkU2luZ2xlTWVzc2FnZSgpO1xuXG4gICAgdGhpcy5pc0luUmVkdXhCYXRjaCA9IHRydWU7XG4gICAgYmF0Y2hEaXNwYXRjaCgoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNsZWFyVW5yZWFkTWV0cmljcyB9ID0gd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zO1xuICAgICAgICBjbGVhclVucmVhZE1ldHJpY3ModGhpcy5pZCk7XG5cbiAgICAgICAgY29uc3QgZW5hYmxlZFByb2ZpbGVTaGFyaW5nID0gQm9vbGVhbihcbiAgICAgICAgICBtYW5kYXRvcnlQcm9maWxlU2hhcmluZ0VuYWJsZWQgJiYgIXRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHVuYXJjaGl2ZWRDb252ZXJzYXRpb24gPSBCb29sZWFuKHRoaXMuZ2V0KCdpc0FyY2hpdmVkJykpO1xuXG4gICAgICAgIHRoaXMuZG9BZGRTaW5nbGVNZXNzYWdlKG1vZGVsLCB7IGlzSnVzdFNlbnQ6IHRydWUgfSk7XG5cbiAgICAgICAgY29uc3QgZHJhZnRQcm9wZXJ0aWVzID0gZG9udENsZWFyRHJhZnRcbiAgICAgICAgICA/IHt9XG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAgIGRyYWZ0OiBudWxsLFxuICAgICAgICAgICAgICBkcmFmdFRpbWVzdGFtcDogbnVsbCxcbiAgICAgICAgICAgICAgbGFzdE1lc3NhZ2U6IG1vZGVsLmdldE5vdGlmaWNhdGlvblRleHQoKSxcbiAgICAgICAgICAgICAgbGFzdE1lc3NhZ2VTdGF0dXM6ICdzZW5kaW5nJyBhcyBjb25zdCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXQoe1xuICAgICAgICAgIC4uLmRyYWZ0UHJvcGVydGllcyxcbiAgICAgICAgICAuLi4oZW5hYmxlZFByb2ZpbGVTaGFyaW5nID8geyBwcm9maWxlU2hhcmluZzogdHJ1ZSB9IDoge30pLFxuICAgICAgICAgIC4uLnRoaXMuaW5jcmVtZW50U2VudE1lc3NhZ2VDb3VudCh7IGRyeTogdHJ1ZSB9KSxcbiAgICAgICAgICBhY3RpdmVfYXQ6IG5vdyxcbiAgICAgICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgICAgICAuLi4odW5hcmNoaXZlZENvbnZlcnNhdGlvbiA/IHsgaXNBcmNoaXZlZDogZmFsc2UgfSA6IHt9KSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGVuYWJsZWRQcm9maWxlU2hhcmluZykge1xuICAgICAgICAgIHRoaXMuY2FwdHVyZUNoYW5nZSgnZW5xdWV1ZU1lc3NhZ2VGb3JTZW5kL21hbmRhdG9yeVByb2ZpbGVTaGFyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuYXJjaGl2ZWRDb252ZXJzYXRpb24pIHtcbiAgICAgICAgICB0aGlzLmNhcHR1cmVDaGFuZ2UoJ2VucXVldWVNZXNzYWdlRm9yU2VuZC91bmFyY2hpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4dHJhUmVkdXhBY3Rpb25zPy4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaXNJblJlZHV4QmF0Y2ggPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzdGlja2VyKSB7XG4gICAgICBhd2FpdCBhZGRTdGlja2VyUGFja1JlZmVyZW5jZShtb2RlbC5pZCwgc3RpY2tlci5wYWNrSWQpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlckR1cmF0aW9uID0gRGF0ZS5ub3coKSAtIHJlbmRlclN0YXJ0O1xuXG4gICAgaWYgKHJlbmRlckR1cmF0aW9uID4gU0VORF9SRVBPUlRJTkdfVEhSRVNIT0xEX01TKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYENvbnZlcnNhdGlvbk1vZGVsKCR7dGhpcy5pZEZvckxvZ2dpbmcoKX0uc2VuZE1lc3NhZ2UoJHtub3d9KTogYCArXG4gICAgICAgICAgYHJlbmRlciBzYXZlIHRvb2sgJHtyZW5kZXJEdXJhdGlvbn1tc2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICAvLyBJcyB0aGlzIHNvbWVvbmUgd2hvIGlzIGEgY29udGFjdCwgb3IgYXJlIHdlIHNoYXJpbmcgb3VyIHByb2ZpbGUgd2l0aCB0aGVtP1xuICAvLyAgIE9yIGlzIHRoZSBwZXJzb24gd2hvIGFkZGVkIHVzIHRvIHRoaXMgZ3JvdXAgYSBjb250YWN0IG9yIGFyZSB3ZSBzaGFyaW5nIHByb2ZpbGVcbiAgLy8gICB3aXRoIHRoZW0/XG4gIGlzRnJvbU9yQWRkZWRCeVRydXN0ZWRDb250YWN0KCk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLmdldCgnbmFtZScpKSB8fCBCb29sZWFuKHRoaXMuZ2V0KCdwcm9maWxlU2hhcmluZycpKTtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRlZEJ5ID0gdGhpcy5nZXQoJ2FkZGVkQnknKTtcbiAgICBpZiAoIWFkZGVkQnkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGFkZGVkQnkpO1xuICAgIGlmICghY29udikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgaXNNZShjb252LmF0dHJpYnV0ZXMpIHx8IGNvbnYuZ2V0KCduYW1lJykgfHwgY29udi5nZXQoJ3Byb2ZpbGVTaGFyaW5nJylcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlTGFzdE1lc3NhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcbiAgICBpZiAoIW91ckNvbnZlcnNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VwZGF0ZUxhc3RNZXNzYWdlOiBGYWlsZWQgdG8gZmV0Y2ggb3VyQ29udmVyc2F0aW9uSWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHRoaXMuaWQ7XG5cbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKTtcbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRDb252ZXJzYXRpb25NZXNzYWdlU3RhdHMoe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBpc0dyb3VwOiBpc0dyb3VwKHRoaXMuYXR0cmlidXRlcyksXG4gICAgICBvdXJVdWlkLFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBydW5zIGFzIGEgam9iIHRvIGF2b2lkIHJhY2UgY29uZGl0aW9uc1xuICAgIHRoaXMucXVldWVKb2IoJ21heWJlU2V0UGVuZGluZ1VuaXZlcnNhbFRpbWVyJywgYXN5bmMgKCkgPT5cbiAgICAgIHRoaXMubWF5YmVTZXRQZW5kaW5nVW5pdmVyc2FsVGltZXIoc3RhdHMuaGFzVXNlckluaXRpYXRlZE1lc3NhZ2VzKVxuICAgICk7XG5cbiAgICBjb25zdCB7IHByZXZpZXcsIGFjdGl2aXR5IH0gPSBzdGF0cztcbiAgICBsZXQgcHJldmlld01lc3NhZ2U6IE1lc3NhZ2VNb2RlbCB8IHVuZGVmaW5lZDtcbiAgICBsZXQgYWN0aXZpdHlNZXNzYWdlOiBNZXNzYWdlTW9kZWwgfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBSZWdpc3RlciB0aGUgbWVzc2FnZSB3aXRoIE1lc3NhZ2VDb250cm9sbGVyIHNvIHRoYXQgaWYgaXQgYWxyZWFkeSBleGlzdHNcbiAgICAvLyBpbiBtZW1vcnkgd2UgdXNlIHRoYXQgZGF0YSBpbnN0ZWFkIG9mIHRoZSBkYXRhIGZyb20gdGhlIGRiIHdoaWNoIG1heVxuICAgIC8vIGJlIG91dCBvZiBkYXRlLlxuICAgIGlmIChwcmV2aWV3KSB7XG4gICAgICBwcmV2aWV3TWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihwcmV2aWV3LmlkLCBwcmV2aWV3KTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZpdHkpIHtcbiAgICAgIGFjdGl2aXR5TWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgICAgYWN0aXZpdHkuaWQsXG4gICAgICAgIGFjdGl2aXR5XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMuaGFzRHJhZnQoKSAmJlxuICAgICAgdGhpcy5nZXQoJ2RyYWZ0VGltZXN0YW1wJykgJiZcbiAgICAgICghcHJldmlld01lc3NhZ2UgfHxcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgcHJldmlld01lc3NhZ2UuZ2V0KCdzZW50X2F0JykgPCB0aGlzLmdldCgnZHJhZnRUaW1lc3RhbXAnKSEpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudFRpbWVzdGFtcCA9IHRoaXMuZ2V0KCd0aW1lc3RhbXAnKSB8fCBudWxsO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IGFjdGl2aXR5TWVzc2FnZVxuICAgICAgPyBhY3Rpdml0eU1lc3NhZ2UuZ2V0KCdzZW50X2F0JykgfHxcbiAgICAgICAgYWN0aXZpdHlNZXNzYWdlLmdldCgncmVjZWl2ZWRfYXQnKSB8fFxuICAgICAgICBjdXJyZW50VGltZXN0YW1wXG4gICAgICA6IGN1cnJlbnRUaW1lc3RhbXA7XG5cbiAgICB0aGlzLnNldCh7XG4gICAgICBsYXN0TWVzc2FnZTpcbiAgICAgICAgKHByZXZpZXdNZXNzYWdlID8gcHJldmlld01lc3NhZ2UuZ2V0Tm90aWZpY2F0aW9uVGV4dCgpIDogJycpIHx8ICcnLFxuICAgICAgbGFzdE1lc3NhZ2VTdGF0dXM6XG4gICAgICAgIChwcmV2aWV3TWVzc2FnZVxuICAgICAgICAgID8gZ2V0TWVzc2FnZVByb3BTdGF0dXMocHJldmlld01lc3NhZ2UuYXR0cmlidXRlcywgb3VyQ29udmVyc2F0aW9uSWQpXG4gICAgICAgICAgOiBudWxsKSB8fCBudWxsLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgbGFzdE1lc3NhZ2VEZWxldGVkRm9yRXZlcnlvbmU6IHByZXZpZXdNZXNzYWdlXG4gICAgICAgID8gcHJldmlld01lc3NhZ2UuZ2V0KCdkZWxldGVkRm9yRXZlcnlvbmUnKVxuICAgICAgICA6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgc2V0QXJjaGl2ZWQoaXNBcmNoaXZlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0KCdpc0FyY2hpdmVkJyk7XG5cbiAgICB0aGlzLnNldCh7IGlzQXJjaGl2ZWQgfSk7XG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldCgnaXNBcmNoaXZlZCcpO1xuXG4gICAgaWYgKEJvb2xlYW4oYmVmb3JlKSAhPT0gQm9vbGVhbihhZnRlcikpIHtcbiAgICAgIGlmIChhZnRlcikge1xuICAgICAgICB0aGlzLnVucGluKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNhcHR1cmVDaGFuZ2UoJ2lzQXJjaGl2ZWQnKTtcbiAgICB9XG4gIH1cblxuICBzZXRNYXJrZWRVbnJlYWQobWFya2VkVW5yZWFkOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgcHJldmlvdXNNYXJrZWRVbnJlYWQgPSB0aGlzLmdldCgnbWFya2VkVW5yZWFkJyk7XG5cbiAgICB0aGlzLnNldCh7IG1hcmtlZFVucmVhZCB9KTtcbiAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBpZiAoQm9vbGVhbihwcmV2aW91c01hcmtlZFVucmVhZCkgIT09IEJvb2xlYW4obWFya2VkVW5yZWFkKSkge1xuICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCdtYXJrZWRVbnJlYWQnKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZWZyZXNoR3JvdXBMaW5rKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cEludml0ZUxpbmtQYXNzd29yZCA9IEJ5dGVzLnRvQmFzZTY0KFxuICAgICAgd2luZG93LlNpZ25hbC5Hcm91cHMuZ2VuZXJhdGVHcm91cEludml0ZUxpbmtQYXNzd29yZCgpXG4gICAgKTtcblxuICAgIGxvZy5pbmZvKCdyZWZyZXNoR3JvdXBMaW5rIGZvciBjb252ZXJzYXRpb24nLCB0aGlzLmlkRm9yTG9nZ2luZygpKTtcblxuICAgIGF3YWl0IHRoaXMubW9kaWZ5R3JvdXBWMih7XG4gICAgICBuYW1lOiAndXBkYXRlSW52aXRlTGlua1Bhc3N3b3JkJyxcbiAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiBhc3luYyAoKSA9PlxuICAgICAgICB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEludml0ZUxpbmtQYXNzd29yZENoYW5nZShcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmRcbiAgICAgICAgKSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0KHsgZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQgfSk7XG4gIH1cblxuICBhc3luYyB0b2dnbGVHcm91cExpbmsodmFsdWU6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvdWxkQ3JlYXRlTmV3R3JvdXBMaW5rID1cbiAgICAgIHZhbHVlICYmICF0aGlzLmdldCgnZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQnKTtcbiAgICBjb25zdCBncm91cEludml0ZUxpbmtQYXNzd29yZCA9XG4gICAgICB0aGlzLmdldCgnZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQnKSB8fFxuICAgICAgQnl0ZXMudG9CYXNlNjQod2luZG93LlNpZ25hbC5Hcm91cHMuZ2VuZXJhdGVHcm91cEludml0ZUxpbmtQYXNzd29yZCgpKTtcblxuICAgIGxvZy5pbmZvKCd0b2dnbGVHcm91cExpbmsgZm9yIGNvbnZlcnNhdGlvbicsIHRoaXMuaWRGb3JMb2dnaW5nKCksIHZhbHVlKTtcblxuICAgIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcbiAgICBjb25zdCBhZGRGcm9tSW52aXRlTGluayA9IHZhbHVlXG4gICAgICA/IEFDQ0VTU19FTlVNLkFOWVxuICAgICAgOiBBQ0NFU1NfRU5VTS5VTlNBVElTRklBQkxFO1xuXG4gICAgaWYgKHNob3VsZENyZWF0ZU5ld0dyb3VwTGluaykge1xuICAgICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgICAgbmFtZTogJ3VwZGF0ZU5ld0dyb3VwTGluaycsXG4gICAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6IGFzeW5jICgpID0+XG4gICAgICAgICAgd2luZG93LlNpZ25hbC5Hcm91cHMuYnVpbGROZXdHcm91cExpbmtDaGFuZ2UoXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBncm91cEludml0ZUxpbmtQYXNzd29yZCxcbiAgICAgICAgICAgIGFkZEZyb21JbnZpdGVMaW5rXG4gICAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiAndXBkYXRlQWNjZXNzQ29udHJvbEFkZEZyb21JbnZpdGVMaW5rJyxcbiAgICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IFtdLFxuICAgICAgICBjcmVhdGVHcm91cENoYW5nZTogYXN5bmMgKCkgPT5cbiAgICAgICAgICB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEFjY2Vzc0NvbnRyb2xBZGRGcm9tSW52aXRlTGlua0NoYW5nZShcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyxcbiAgICAgICAgICAgIGFkZEZyb21JbnZpdGVMaW5rXG4gICAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KHtcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IHtcbiAgICAgICAgYWRkRnJvbUludml0ZUxpbmssXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/LmF0dHJpYnV0ZXMgfHwgQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgICAgICBtZW1iZXJzOiB0aGlzLmdldCgnYWNjZXNzQ29udHJvbCcpPy5tZW1iZXJzIHx8IEFDQ0VTU19FTlVNLk1FTUJFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoc2hvdWxkQ3JlYXRlTmV3R3JvdXBMaW5rKSB7XG4gICAgICB0aGlzLnNldCh7IGdyb3VwSW52aXRlTGlua1Bhc3N3b3JkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFjY2Vzc0NvbnRyb2xBZGRGcm9tSW52aXRlTGluayh2YWx1ZTogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBBQ0NFU1NfRU5VTSA9IFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQ7XG5cbiAgICBjb25zdCBhZGRGcm9tSW52aXRlTGluayA9IHZhbHVlXG4gICAgICA/IEFDQ0VTU19FTlVNLkFETUlOSVNUUkFUT1JcbiAgICAgIDogQUNDRVNTX0VOVU0uQU5ZO1xuXG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICd1cGRhdGVBY2Nlc3NDb250cm9sQWRkRnJvbUludml0ZUxpbmsnLFxuICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IFtdLFxuICAgICAgY3JlYXRlR3JvdXBDaGFuZ2U6IGFzeW5jICgpID0+XG4gICAgICAgIHdpbmRvdy5TaWduYWwuR3JvdXBzLmJ1aWxkQWNjZXNzQ29udHJvbEFkZEZyb21JbnZpdGVMaW5rQ2hhbmdlKFxuICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyxcbiAgICAgICAgICBhZGRGcm9tSW52aXRlTGlua1xuICAgICAgICApLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXQoe1xuICAgICAgYWNjZXNzQ29udHJvbDoge1xuICAgICAgICBhZGRGcm9tSW52aXRlTGluayxcbiAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXQoJ2FjY2Vzc0NvbnRyb2wnKT8uYXR0cmlidXRlcyB8fCBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgICAgIG1lbWJlcnM6IHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/Lm1lbWJlcnMgfHwgQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFjY2Vzc0NvbnRyb2xBdHRyaWJ1dGVzKHZhbHVlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICd1cGRhdGVBY2Nlc3NDb250cm9sQXR0cmlidXRlcycsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICBjcmVhdGVHcm91cENoYW5nZTogYXN5bmMgKCkgPT5cbiAgICAgICAgd2luZG93LlNpZ25hbC5Hcm91cHMuYnVpbGRBY2Nlc3NDb250cm9sQXR0cmlidXRlc0NoYW5nZShcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcbiAgICB0aGlzLnNldCh7XG4gICAgICBhY2Nlc3NDb250cm9sOiB7XG4gICAgICAgIGFkZEZyb21JbnZpdGVMaW5rOlxuICAgICAgICAgIHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/LmFkZEZyb21JbnZpdGVMaW5rIHx8IEFDQ0VTU19FTlVNLk1FTUJFUixcbiAgICAgICAgYXR0cmlidXRlczogdmFsdWUsXG4gICAgICAgIG1lbWJlcnM6IHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/Lm1lbWJlcnMgfHwgQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFjY2Vzc0NvbnRyb2xNZW1iZXJzKHZhbHVlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5tb2RpZnlHcm91cFYyKHtcbiAgICAgIG5hbWU6ICd1cGRhdGVBY2Nlc3NDb250cm9sTWVtYmVycycsXG4gICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbTogW10sXG4gICAgICBjcmVhdGVHcm91cENoYW5nZTogYXN5bmMgKCkgPT5cbiAgICAgICAgd2luZG93LlNpZ25hbC5Hcm91cHMuYnVpbGRBY2Nlc3NDb250cm9sTWVtYmVyc0NoYW5nZShcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcbiAgICB0aGlzLnNldCh7XG4gICAgICBhY2Nlc3NDb250cm9sOiB7XG4gICAgICAgIGFkZEZyb21JbnZpdGVMaW5rOlxuICAgICAgICAgIHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/LmFkZEZyb21JbnZpdGVMaW5rIHx8IEFDQ0VTU19FTlVNLk1FTUJFUixcbiAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXQoJ2FjY2Vzc0NvbnRyb2wnKT8uYXR0cmlidXRlcyB8fCBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgICAgIG1lbWJlcnM6IHZhbHVlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFubm91bmNlbWVudHNPbmx5KHZhbHVlOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSB8fCAhdGhpcy5jYW5CZUFubm91bmNlbWVudEdyb3VwKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgbmFtZTogJ3VwZGF0ZUFubm91bmNlbWVudHNPbmx5JyxcbiAgICAgIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBbXSxcbiAgICAgIGNyZWF0ZUdyb3VwQ2hhbmdlOiBhc3luYyAoKSA9PlxuICAgICAgICB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5idWlsZEFubm91bmNlbWVudHNPbmx5Q2hhbmdlKFxuICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyxcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICApLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXQoeyBhbm5vdW5jZW1lbnRzT25seTogdmFsdWUgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVFeHBpcmF0aW9uVGltZXIoXG4gICAgcHJvdmlkZWRFeHBpcmVUaW1lcjogbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIHtcbiAgICAgIHJlYXNvbixcbiAgICAgIHJlY2VpdmVkQXQsXG4gICAgICByZWNlaXZlZEF0TVMgPSBEYXRlLm5vdygpLFxuICAgICAgc2VudEF0OiBwcm92aWRlZFNlbnRBdCxcbiAgICAgIHNvdXJjZTogcHJvdmlkZWRTb3VyY2UsXG4gICAgICBmcm9tU3luYyA9IGZhbHNlLFxuICAgICAgaXNJbml0aWFsU3luYyA9IGZhbHNlLFxuICAgICAgZnJvbUdyb3VwVXBkYXRlID0gZmFsc2UsXG4gICAgfToge1xuICAgICAgcmVhc29uOiBzdHJpbmc7XG4gICAgICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICAgICAgcmVjZWl2ZWRBdE1TPzogbnVtYmVyO1xuICAgICAgc2VudEF0PzogbnVtYmVyO1xuICAgICAgc291cmNlPzogc3RyaW5nO1xuICAgICAgZnJvbVN5bmM/OiBib29sZWFuO1xuICAgICAgaXNJbml0aWFsU3luYz86IGJvb2xlYW47XG4gICAgICBmcm9tR3JvdXBVcGRhdGU/OiBib29sZWFuO1xuICAgIH1cbiAgKTogUHJvbWlzZTxib29sZWFuIHwgbnVsbCB8IE1lc3NhZ2VNb2RlbCB8IHZvaWQ+IHtcbiAgICBjb25zdCBpc1NldEJ5T3RoZXIgPSBwcm92aWRlZFNvdXJjZSB8fCBwcm92aWRlZFNlbnRBdCAhPT0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKGlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZiAoaXNTZXRCeU90aGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAndXBkYXRlRXhwaXJhdGlvblRpbWVyOiBHcm91cFYyIHRpbWVycyBhcmUgbm90IHVwZGF0ZWQgdGhpcyB3YXknXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLm1vZGlmeUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiAndXBkYXRlRXhwaXJhdGlvblRpbWVyJyxcbiAgICAgICAgdXNpbmdDcmVkZW50aWFsc0Zyb206IFtdLFxuICAgICAgICBjcmVhdGVHcm91cENoYW5nZTogKCkgPT5cbiAgICAgICAgICB0aGlzLnVwZGF0ZUV4cGlyYXRpb25UaW1lckluR3JvdXBWMihwcm92aWRlZEV4cGlyZVRpbWVyKSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXNTZXRCeU90aGVyICYmIHRoaXMuaXNHcm91cFYxQW5kRGlzYWJsZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndXBkYXRlRXhwaXJhdGlvblRpbWVyOiBHcm91cFYxIGlzIGRlcHJlY2F0ZWQ7IGNhbm5vdCB1cGRhdGUgZXhwaXJhdGlvbiB0aW1lcidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGV4cGlyZVRpbWVyOiBudW1iZXIgfCB1bmRlZmluZWQgPSBwcm92aWRlZEV4cGlyZVRpbWVyO1xuICAgIGxldCBzb3VyY2UgPSBwcm92aWRlZFNvdXJjZTtcbiAgICBpZiAodGhpcy5nZXQoJ2xlZnQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghZXhwaXJlVGltZXIpIHtcbiAgICAgIGV4cGlyZVRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0aGlzLmdldCgnZXhwaXJlVGltZXInKSA9PT0gZXhwaXJlVGltZXIgfHxcbiAgICAgICghZXhwaXJlVGltZXIgJiYgIXRoaXMuZ2V0KCdleHBpcmVUaW1lcicpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nSWQgPVxuICAgICAgYHVwZGF0ZUV4cGlyYXRpb25UaW1lcigke3RoaXMuaWRGb3JMb2dnaW5nKCl9LCBgICtcbiAgICAgIGAke2V4cGlyZVRpbWVyIHx8ICdkaXNhYmxlZCd9KSBgICtcbiAgICAgIGBzb3VyY2U9JHtzb3VyY2UgPz8gJz8nfSByZWFzb249JHtyZWFzb259YDtcblxuICAgIGxvZy5pbmZvKGAke2xvZ0lkfTogdXBkYXRpbmdgKTtcblxuICAgIC8vIGlmIGNoYW5nZSB3YXNuJ3QgbWFkZSByZW1vdGVseSwgc2VuZCBpdCB0byB0aGUgbnVtYmVyL2dyb3VwXG4gICAgaWYgKCFpc1NldEJ5T3RoZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbnZlcnNhdGlvbkpvYlF1ZXVlLmFkZCh7XG4gICAgICAgICAgdHlwZTogY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLmVudW0uRGlyZWN0RXhwaXJhdGlvblRpbWVyVXBkYXRlLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLmlkLFxuICAgICAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICBgJHtsb2dJZH06IEZhaWxlZCB0byBxdWV1ZSBleHBpcmF0aW9uIHRpbWVyIHVwZGF0ZWAsXG4gICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzb3VyY2UgPSBzb3VyY2UgfHwgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcblxuICAgIHRoaXMuc2V0KHsgZXhwaXJlVGltZXIgfSk7XG5cbiAgICAvLyBUaGlzIGNhbGwgYWN0dWFsbHkgcmVtb3ZlcyB1bml2ZXJzYWwgdGltZXIgbm90aWZpY2F0aW9uIGFuZCBjbGVhcnNcbiAgICAvLyB0aGUgcGVuZGluZyBmbGFncy5cbiAgICBhd2FpdCB0aGlzLm1heWJlUmVtb3ZlVW5pdmVyc2FsVGltZXIoKTtcblxuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgIC8vIFdoZW4gd2UgYWRkIGEgZGlzYXBwZWFyaW5nIG1lc3NhZ2VzIG5vdGlmaWNhdGlvbiB0byB0aGUgY29udmVyc2F0aW9uLCB3ZSB3YW50IGl0XG4gICAgLy8gICB0byBiZSBhYm92ZSB0aGUgbWVzc2FnZSB0aGF0IGluaXRpYXRlZCB0aGF0IGNoYW5nZSwgaGVuY2UgdGhlIHN1YnRyYWN0aW9uLlxuICAgIGNvbnN0IHNlbnRBdCA9IChwcm92aWRlZFNlbnRBdCB8fCByZWNlaXZlZEF0TVMpIC0gMTtcblxuICAgIGNvbnN0IGlzTm90ZVRvU2VsZiA9IGlzTWUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBzaG91bGRCZVJlYWQgPSBpc05vdGVUb1NlbGYgfHwgaXNJbml0aWFsU3luYztcblxuICAgIGNvbnN0IG1vZGVsID0gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICBleHBpcmF0aW9uVGltZXJVcGRhdGU6IHtcbiAgICAgICAgZXhwaXJlVGltZXIsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgZnJvbVN5bmMsXG4gICAgICAgIGZyb21Hcm91cFVwZGF0ZSxcbiAgICAgIH0sXG4gICAgICBmbGFnczogUHJvdG8uRGF0YU1lc3NhZ2UuRmxhZ3MuRVhQSVJBVElPTl9USU1FUl9VUERBVEUsXG4gICAgICByZWFkU3RhdHVzOiBzaG91bGRCZVJlYWQgPyBSZWFkU3RhdHVzLlJlYWQgOiBSZWFkU3RhdHVzLlVucmVhZCxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiByZWNlaXZlZEF0TVMsXG4gICAgICByZWNlaXZlZF9hdDogcmVjZWl2ZWRBdCA/PyB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgIHNlZW5TdGF0dXM6IHNob3VsZEJlUmVhZCA/IFNlZW5TdGF0dXMuU2VlbiA6IFNlZW5TdGF0dXMuVW5zZWVuLFxuICAgICAgc2VudF9hdDogc2VudEF0LFxuICAgICAgdHlwZTogJ3RpbWVyLW5vdGlmaWNhdGlvbicsXG4gICAgICAvLyBUT0RPOiBERVNLVE9QLTcyMlxuICAgIH0gYXMgdW5rbm93biBhcyBNZXNzYWdlQXR0cmlidXRlc1R5cGUpO1xuXG4gICAgY29uc3QgaWQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobW9kZWwuYXR0cmlidXRlcywge1xuICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcblxuICAgIG1vZGVsLnNldCh7IGlkIH0pO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihpZCwgbW9kZWwpO1xuXG4gICAgdGhpcy5hZGRTaW5nbGVNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIHRoaXMudXBkYXRlVW5yZWFkKCk7XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGAke2xvZ0lkfTogYWRkZWQgYSBub3RpZmljYXRpb24gcmVjZWl2ZWRfYXQ9JHttb2RlbC5nZXQoJ3JlY2VpdmVkX2F0Jyl9YFxuICAgICk7XG5cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIGlzU2VhcmNoYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZ2V0KCdsZWZ0Jyk7XG4gIH1cblxuICAvLyBEZXByZWNhdGVkOiBvbmx5IGFwcGxpZXMgdG8gR3JvdXBWMVxuICBhc3luYyBsZWF2ZUdyb3VwKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbWVzc2FnaW5nIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgICBpZiAoIW1lc3NhZ2luZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdsZWF2ZUdyb3VwOiBDYW5ub3QgbGVhdmUgdjEgZ3JvdXAgd2hlbiBvZmZsaW5lIScpO1xuICAgIH1cblxuICAgIGlmICghaXNHcm91cFYxKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGxlYXZlR3JvdXA6IEdyb3VwICR7dGhpcy5pZEZvckxvZ2dpbmcoKX0gaXMgbm90IEdyb3VwVjEhYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGdyb3VwSWQgPSB0aGlzLmdldCgnZ3JvdXBJZCcpO1xuXG4gICAgaWYgKCFncm91cElkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGxlYXZlR3JvdXAvJHt0aGlzLmlkRm9yTG9nZ2luZygpfTogTm8gZ3JvdXBJZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cElkZW50aWZpZXJzID0gdGhpcy5nZXRSZWNpcGllbnRzKCk7XG4gICAgdGhpcy5zZXQoeyBsZWZ0OiB0cnVlIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IG1vZGVsID0gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHRoaXMuaWQsXG4gICAgICBncm91cF91cGRhdGU6IHsgbGVmdDogJ1lvdScgfSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiBub3csXG4gICAgICByZWNlaXZlZF9hdDogd2luZG93LlNpZ25hbC5VdGlsLmluY3JlbWVudE1lc3NhZ2VDb3VudGVyKCksXG4gICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLk5vdEFwcGxpY2FibGUsXG4gICAgICBzZW50X2F0OiBub3csXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgLy8gVE9ETzogREVTS1RPUC03MjJcbiAgICB9IGFzIHVua25vd24gYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlKTtcblxuICAgIGNvbnN0IGlkID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKG1vZGVsLmF0dHJpYnV0ZXMsIHtcbiAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgfSk7XG4gICAgbW9kZWwuc2V0KHsgaWQgfSk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgdGhpcy5hZGRTaW5nbGVNZXNzYWdlKG1lc3NhZ2UpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgbWVzc2FnZS5zZW5kKFxuICAgICAgaGFuZGxlTWVzc2FnZVNlbmQoXG4gICAgICAgIG1lc3NhZ2luZy5sZWF2ZUdyb3VwKGdyb3VwSWQsIGdyb3VwSWRlbnRpZmllcnMsIG9wdGlvbnMpLFxuICAgICAgICB7IG1lc3NhZ2VJZHM6IFtdLCBzZW5kVHlwZTogJ2xlZ2FjeUdyb3VwQ2hhbmdlJyB9XG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIG1hcmtSZWFkKFxuICAgIG5ld2VzdFVucmVhZEF0OiBudW1iZXIsXG4gICAgb3B0aW9uczoge1xuICAgICAgcmVhZEF0PzogbnVtYmVyO1xuICAgICAgc2VuZFJlYWRSZWNlaXB0czogYm9vbGVhbjtcbiAgICAgIG5ld2VzdFNlbnRBdD86IG51bWJlcjtcbiAgICB9ID0ge1xuICAgICAgc2VuZFJlYWRSZWNlaXB0czogdHJ1ZSxcbiAgICB9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IG1hcmtDb252ZXJzYXRpb25SZWFkKHRoaXMuYXR0cmlidXRlcywgbmV3ZXN0VW5yZWFkQXQsIG9wdGlvbnMpO1xuICAgIGF3YWl0IHRoaXMudXBkYXRlVW5yZWFkKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVVbnJlYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdW5yZWFkQ291bnQgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0VG90YWxVbnJlYWRGb3JDb252ZXJzYXRpb24oXG4gICAgICB0aGlzLmlkLFxuICAgICAge1xuICAgICAgICBzdG9yeUlkOiB1bmRlZmluZWQsXG4gICAgICAgIGlzR3JvdXA6IGlzR3JvdXAodGhpcy5hdHRyaWJ1dGVzKSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgcHJldlVucmVhZENvdW50ID0gdGhpcy5nZXQoJ3VucmVhZENvdW50Jyk7XG4gICAgaWYgKHByZXZVbnJlYWRDb3VudCAhPT0gdW5yZWFkQ291bnQpIHtcbiAgICAgIHRoaXMuc2V0KHsgdW5yZWFkQ291bnQgfSk7XG4gICAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyBpcyBhbiBleHBlbnNpdmUgb3BlcmF0aW9uIHdlIHVzZSB0byBwb3B1bGF0ZSB0aGUgbWVzc2FnZSByZXF1ZXN0IGhlcm8gcm93LiBJdFxuICAvLyAgIHNob3dzIGdyb3VwcyB0aGUgY3VycmVudCB1c2VyIGhhcyBpbiBjb21tb24gd2l0aCB0aGlzIHBvdGVudGlhbCBuZXcgY29udGFjdC5cbiAgYXN5bmMgdXBkYXRlU2hhcmVkR3JvdXBzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNNZSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuICAgIGNvbnN0IHRoZWlyVXVpZCA9IHRoaXMuZ2V0VXVpZCgpO1xuICAgIGlmICghdGhlaXJVdWlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3VyR3JvdXBzID1cbiAgICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldEFsbEdyb3Vwc0ludm9sdmluZ1V1aWQob3VyVXVpZCk7XG4gICAgY29uc3Qgc2hhcmVkR3JvdXBzID0gb3VyR3JvdXBzXG4gICAgICAuZmlsdGVyKGMgPT4gYy5oYXNNZW1iZXIob3VyVXVpZCkgJiYgYy5oYXNNZW1iZXIodGhlaXJVdWlkKSlcbiAgICAgIC5zb3J0KFxuICAgICAgICAobGVmdCwgcmlnaHQpID0+XG4gICAgICAgICAgKHJpZ2h0LmdldCgndGltZXN0YW1wJykgfHwgMCkgLSAobGVmdC5nZXQoJ3RpbWVzdGFtcCcpIHx8IDApXG4gICAgICApO1xuXG4gICAgY29uc3Qgc2hhcmVkR3JvdXBOYW1lcyA9IHNoYXJlZEdyb3Vwcy5tYXAoY29udmVyc2F0aW9uID0+XG4gICAgICBjb252ZXJzYXRpb24uZ2V0VGl0bGUoKVxuICAgICk7XG5cbiAgICB0aGlzLnNldCh7IHNoYXJlZEdyb3VwTmFtZXMgfSk7XG4gIH1cblxuICBvbkNoYW5nZVByb2ZpbGVLZXkoKTogdm9pZCB7XG4gICAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHRoaXMuZ2V0UHJvZmlsZXMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRQcm9maWxlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyByZXF1ZXN0IGFsbCBjb252ZXJzYXRpb24gbWVtYmVycycga2V5c1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbnMgPVxuICAgICAgdGhpcy5nZXRNZW1iZXJzKCkgYXMgdW5rbm93biBhcyBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD47XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGNvbnZlcnNhdGlvbnMubWFwKGNvbnZlcnNhdGlvbiA9PlxuICAgICAgICBnZXRQcm9maWxlKGNvbnZlcnNhdGlvbi5nZXQoJ3V1aWQnKSwgY29udmVyc2F0aW9uLmdldCgnZTE2NCcpKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBhc3luYyBzZXRFbmNyeXB0ZWRQcm9maWxlTmFtZShcbiAgICBlbmNyeXB0ZWROYW1lOiBzdHJpbmcsXG4gICAgZGVjcnlwdGlvbktleTogVWludDhBcnJheVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWVuY3J5cHRlZE5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBkZWNyeXB0XG4gICAgY29uc3QgeyBnaXZlbiwgZmFtaWx5IH0gPSBkZWNyeXB0UHJvZmlsZU5hbWUoZW5jcnlwdGVkTmFtZSwgZGVjcnlwdGlvbktleSk7XG5cbiAgICAvLyBlbmNvZGVcbiAgICBjb25zdCBwcm9maWxlTmFtZSA9IGdpdmVuID8gQnl0ZXMudG9TdHJpbmcoZ2l2ZW4pIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHByb2ZpbGVGYW1pbHlOYW1lID0gZmFtaWx5ID8gQnl0ZXMudG9TdHJpbmcoZmFtaWx5KSA6IHVuZGVmaW5lZDtcblxuICAgIC8vIHNldCB0aGVuIGNoZWNrIGZvciBjaGFuZ2VzXG4gICAgY29uc3Qgb2xkTmFtZSA9IHRoaXMuZ2V0UHJvZmlsZU5hbWUoKTtcbiAgICBjb25zdCBoYWRQcmV2aW91c05hbWUgPSBCb29sZWFuKG9sZE5hbWUpO1xuICAgIHRoaXMuc2V0KHsgcHJvZmlsZU5hbWUsIHByb2ZpbGVGYW1pbHlOYW1lIH0pO1xuXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXMuZ2V0UHJvZmlsZU5hbWUoKTtcblxuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb21wYXJlIHRoZSBjb21iaW5lZCBuYW1lcyB0byBlbnN1cmUgdGhhdCB3ZSBkb24ndCBwcmVzZW50IHRoZSBleGFjdFxuICAgIC8vICAgc2FtZSBiZWZvcmUvYWZ0ZXIgc3RyaW5nLCBldmVuIGlmIHNvbWVvbmUgaXMgbW92aW5nIGZyb20ganVzdCBmaXJzdCBuYW1lIHRvXG4gICAgLy8gICBmaXJzdC9sYXN0IG5hbWUgaW4gdGhlaXIgcHJvZmlsZSBkYXRhLlxuICAgIGNvbnN0IG5hbWVDaGFuZ2VkID0gb2xkTmFtZSAhPT0gbmV3TmFtZTtcblxuICAgIGlmICghaXNNZSh0aGlzLmF0dHJpYnV0ZXMpICYmIGhhZFByZXZpb3VzTmFtZSAmJiBuYW1lQ2hhbmdlZCkge1xuICAgICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgICB0eXBlOiAnbmFtZScsXG4gICAgICAgIG9sZE5hbWUsXG4gICAgICAgIG5ld05hbWUsXG4gICAgICB9O1xuXG4gICAgICBhd2FpdCB0aGlzLmFkZFByb2ZpbGVDaGFuZ2UoY2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZXRQcm9maWxlQXZhdGFyKFxuICAgIGF2YXRhclBhdGg6IHVuZGVmaW5lZCB8IG51bGwgfCBzdHJpbmcsXG4gICAgZGVjcnlwdGlvbktleTogVWludDhBcnJheVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoaXNNZSh0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZiAoYXZhdGFyUGF0aCkge1xuICAgICAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ2F2YXRhclVybCcsIGF2YXRhclBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnN0b3JhZ2UucmVtb3ZlKCdhdmF0YXJVcmwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWF2YXRhclBhdGgpIHtcbiAgICAgIHRoaXMuc2V0KHsgcHJvZmlsZUF2YXRhcjogdW5kZWZpbmVkIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbWVzc2FnaW5nIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgICBpZiAoIW1lc3NhZ2luZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRQcm9maWxlQXZhdGFyOiBDYW5ub3QgZmV0Y2ggYXZhdGFyIHdoZW4gb2ZmbGluZSEnKTtcbiAgICB9XG4gICAgY29uc3QgYXZhdGFyID0gYXdhaXQgbWVzc2FnaW5nLmdldEF2YXRhcihhdmF0YXJQYXRoKTtcblxuICAgIC8vIGRlY3J5cHRcbiAgICBjb25zdCBkZWNyeXB0ZWQgPSBkZWNyeXB0UHJvZmlsZShhdmF0YXIsIGRlY3J5cHRpb25LZXkpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSBjb252ZXJzYXRpb24gYXZhdGFyIG9ubHkgaWYgaGFzaCBkaWZmZXJzXG4gICAgaWYgKGRlY3J5cHRlZCkge1xuICAgICAgY29uc3QgbmV3QXR0cmlidXRlcyA9IGF3YWl0IENvbnZlcnNhdGlvbi5tYXliZVVwZGF0ZVByb2ZpbGVBdmF0YXIoXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyxcbiAgICAgICAgZGVjcnlwdGVkLFxuICAgICAgICB7XG4gICAgICAgICAgd3JpdGVOZXdBdHRhY2htZW50RGF0YSxcbiAgICAgICAgICBkZWxldGVBdHRhY2htZW50RGF0YSxcbiAgICAgICAgICBkb2VzQXR0YWNobWVudEV4aXN0LFxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgdGhpcy5zZXQobmV3QXR0cmlidXRlcyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2V0UHJvZmlsZUtleShcbiAgICBwcm9maWxlS2V5OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgeyB2aWFTdG9yYWdlU2VydmljZVN5bmMgPSBmYWxzZSB9ID0ge31cbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gcHJvZmlsZUtleSBpcyBhIHN0cmluZyBzbyB3ZSBjYW4gY29tcGFyZSBpdCBkaXJlY3RseVxuICAgIGlmICh0aGlzLmdldCgncHJvZmlsZUtleScpICE9PSBwcm9maWxlS2V5KSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYFNldHRpbmcgc2VhbGVkU2VuZGVyIHRvIFVOS05PV04gZm9yIGNvbnZlcnNhdGlvbiAke3RoaXMuaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgKTtcbiAgICAgIHRoaXMuc2V0KHtcbiAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWw6IG51bGwsXG4gICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbjogbnVsbCxcbiAgICAgICAgcG5pQ3JlZGVudGlhbDogbnVsbCxcbiAgICAgICAgYWNjZXNzS2V5OiBudWxsLFxuICAgICAgICBzZWFsZWRTZW5kZXI6IFNFQUxFRF9TRU5ERVIuVU5LTk9XTixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBEb24ndCB0cmlnZ2VyIGltbWVkaWF0ZSBwcm9maWxlIGZldGNoZXMgd2hlbiBzeW5jaW5nIHRvIHJlbW90ZSBzdG9yYWdlXG4gICAgICB0aGlzLnNldCh7IHByb2ZpbGVLZXkgfSwgeyBzaWxlbnQ6IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyB9KTtcblxuICAgICAgLy8gSWYgb3VyIHByb2ZpbGUga2V5IHdhcyBjbGVhcmVkIGFib3ZlLCB3ZSBkb24ndCB0ZWxsIG91ciBsaW5rZWQgZGV2aWNlcyBhYm91dCBpdC5cbiAgICAgIC8vICAgV2Ugd2FudCBsaW5rZWQgZGV2aWNlcyB0byB0ZWxsIHVzIHdoYXQgaXQgc2hvdWxkIGJlLCBpbnN0ZWFkIG9mIHRlbGxpbmcgdGhlbSB0b1xuICAgICAgLy8gICBlcmFzZSB0aGVpciBsb2NhbCB2YWx1ZS5cbiAgICAgIGlmICghdmlhU3RvcmFnZVNlcnZpY2VTeW5jICYmIHByb2ZpbGVLZXkpIHtcbiAgICAgICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCdwcm9maWxlS2V5Jyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGVyaXZlQWNjZXNzS2V5SWZOZWVkZWQoKTtcblxuICAgICAgLy8gV2Ugd2lsbCB1cGRhdGUgdGhlIGNvbnZlcnNhdGlvbiBkdXJpbmcgc3RvcmFnZSBzZXJ2aWNlIHN5bmNcbiAgICAgIGlmICghdmlhU3RvcmFnZVNlcnZpY2VTeW5jKSB7XG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc1Byb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwcm9maWxlS2V5ID0gdGhpcy5nZXQoJ3Byb2ZpbGVLZXknKTtcbiAgICBpZiAoIXByb2ZpbGVLZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9maWxlS2V5Q3JlZGVudGlhbCA9IHRoaXMuZ2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpO1xuICAgIGNvbnN0IHByb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbiA9IHRoaXMuZ2V0KFxuICAgICAgJ3Byb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbidcbiAgICApO1xuXG4gICAgaWYgKCFwcm9maWxlS2V5Q3JlZGVudGlhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFpc051bWJlcihwcm9maWxlS2V5Q3JlZGVudGlhbEV4cGlyYXRpb24pKSB7XG4gICAgICBjb25zdCBsb2dJZCA9IHRoaXMuaWRGb3JMb2dnaW5nKCk7XG4gICAgICBsb2cud2FybihgaGFzUHJvZmlsZUtleUNyZWRlbnRpYWxFeHBpcmVkKCR7bG9nSWR9KTogbWlzc2luZyBleHBpcmF0aW9uYCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2RheSA9IHRvRGF5TWlsbGlzKERhdGUubm93KCkpO1xuXG4gICAgcmV0dXJuIHByb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbiA8PSB0b2RheTtcbiAgfVxuXG4gIGRlcml2ZUFjY2Vzc0tleUlmTmVlZGVkKCk6IHZvaWQge1xuICAgIGNvbnN0IHByb2ZpbGVLZXkgPSB0aGlzLmdldCgncHJvZmlsZUtleScpO1xuICAgIGlmICghcHJvZmlsZUtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXQoJ2FjY2Vzc0tleScpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvZmlsZUtleUJ1ZmZlciA9IEJ5dGVzLmZyb21CYXNlNjQocHJvZmlsZUtleSk7XG4gICAgY29uc3QgYWNjZXNzS2V5QnVmZmVyID0gZGVyaXZlQWNjZXNzS2V5KHByb2ZpbGVLZXlCdWZmZXIpO1xuICAgIGNvbnN0IGFjY2Vzc0tleSA9IEJ5dGVzLnRvQmFzZTY0KGFjY2Vzc0tleUJ1ZmZlcik7XG4gICAgdGhpcy5zZXQoeyBhY2Nlc3NLZXkgfSk7XG4gIH1cblxuICBkZXJpdmVQcm9maWxlS2V5VmVyc2lvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHByb2ZpbGVLZXkgPSB0aGlzLmdldCgncHJvZmlsZUtleScpO1xuICAgIGlmICghcHJvZmlsZUtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSB0aGlzLmdldCgndXVpZCcpO1xuICAgIGlmICghdXVpZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RQcm9maWxlID0gdGhpcy5nZXQoJ2xhc3RQcm9maWxlJyk7XG4gICAgaWYgKGxhc3RQcm9maWxlPy5wcm9maWxlS2V5ID09PSBwcm9maWxlS2V5KSB7XG4gICAgICByZXR1cm4gbGFzdFByb2ZpbGUucHJvZmlsZUtleVZlcnNpb247XG4gICAgfVxuXG4gICAgY29uc3QgcHJvZmlsZUtleVZlcnNpb24gPSBVdGlsLnprZ3JvdXAuZGVyaXZlUHJvZmlsZUtleVZlcnNpb24oXG4gICAgICBwcm9maWxlS2V5LFxuICAgICAgdXVpZFxuICAgICk7XG4gICAgaWYgKCFwcm9maWxlS2V5VmVyc2lvbikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdkZXJpdmVQcm9maWxlS2V5VmVyc2lvbjogRmFpbGVkIHRvIGRlcml2ZSBwcm9maWxlIGtleSB2ZXJzaW9uLCAnICtcbiAgICAgICAgICAnY2xlYXJpbmcgcHJvZmlsZSBrZXkuJ1xuICAgICAgKTtcbiAgICAgIHRoaXMuc2V0UHJvZmlsZUtleSh1bmRlZmluZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9maWxlS2V5VmVyc2lvbjtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUxhc3RQcm9maWxlKFxuICAgIG9sZFZhbHVlOiBDb252ZXJzYXRpb25MYXN0UHJvZmlsZVR5cGUgfCB1bmRlZmluZWQsXG4gICAgeyBwcm9maWxlS2V5LCBwcm9maWxlS2V5VmVyc2lvbiB9OiBDb252ZXJzYXRpb25MYXN0UHJvZmlsZVR5cGVcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbGFzdFByb2ZpbGUgPSB0aGlzLmdldCgnbGFzdFByb2ZpbGUnKTtcblxuICAgIC8vIEF0b21pYyB1cGRhdGVzIG9ubHlcbiAgICBpZiAobGFzdFByb2ZpbGUgIT09IG9sZFZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbGFzdFByb2ZpbGU/LnByb2ZpbGVLZXkgPT09IHByb2ZpbGVLZXkgJiZcbiAgICAgIGxhc3RQcm9maWxlPy5wcm9maWxlS2V5VmVyc2lvbiA9PT0gcHJvZmlsZUtleVZlcnNpb25cbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cud2FybihcbiAgICAgICdDb252ZXJzYXRpb25Nb2RlbC51cGRhdGVMYXN0UHJvZmlsZTogdXBkYXRpbmcgZm9yJyxcbiAgICAgIHRoaXMuaWRGb3JMb2dnaW5nKClcbiAgICApO1xuXG4gICAgdGhpcy5zZXQoeyBsYXN0UHJvZmlsZTogeyBwcm9maWxlS2V5LCBwcm9maWxlS2V5VmVyc2lvbiB9IH0pO1xuXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlTGFzdFByb2ZpbGUoXG4gICAgb2xkVmFsdWU6IENvbnZlcnNhdGlvbkxhc3RQcm9maWxlVHlwZSB8IHVuZGVmaW5lZFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBBdG9taWMgdXBkYXRlcyBvbmx5XG4gICAgaWYgKHRoaXMuZ2V0KCdsYXN0UHJvZmlsZScpICE9PSBvbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy53YXJuKFxuICAgICAgJ0NvbnZlcnNhdGlvbk1vZGVsLnJlbW92ZUxhc3RQcm9maWxlOiBjYWxsZWQgZm9yJyxcbiAgICAgIHRoaXMuaWRGb3JMb2dnaW5nKClcbiAgICApO1xuXG4gICAgdGhpcy5zZXQoe1xuICAgICAgbGFzdFByb2ZpbGU6IHVuZGVmaW5lZCxcblxuICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhbnkga25vd2xlZGdlIG9mIHByb2ZpbGUgYW55bW9yZS4gRHJvcCBhbGwgYXNzb2NpYXRlZFxuICAgICAgLy8gZGF0YS5cbiAgICAgIGFib3V0OiB1bmRlZmluZWQsXG4gICAgICBhYm91dEVtb2ppOiB1bmRlZmluZWQsXG4gICAgICBwcm9maWxlQXZhdGFyOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICBoYXNNZW1iZXIodXVpZDogVVVJRCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmdldE1lbWJlcnMoKTtcblxuICAgIHJldHVybiBtZW1iZXJzLnNvbWUobWVtYmVyID0+IG1lbWJlci5nZXQoJ3V1aWQnKSA9PT0gdXVpZC50b1N0cmluZygpKTtcbiAgfVxuXG4gIGZldGNoQ29udGFjdHMoKTogdm9pZCB7XG4gICAgY29uc3QgbWVtYmVycyA9IHRoaXMuZ2V0TWVtYmVycygpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICB0aGlzLmNvbnRhY3RDb2xsZWN0aW9uIS5yZXNldChtZW1iZXJzKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3lNZXNzYWdlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldCh7XG4gICAgICBsYXN0TWVzc2FnZTogbnVsbCxcbiAgICAgIHRpbWVzdGFtcDogbnVsbCxcbiAgICAgIGFjdGl2ZV9hdDogbnVsbCxcbiAgICAgIHBlbmRpbmdVbml2ZXJzYWxUaW1lcjogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVBbGxNZXNzYWdlc0luQ29udmVyc2F0aW9uKHRoaXMuaWQsIHtcbiAgICAgIGxvZ0lkOiB0aGlzLmlkRm9yTG9nZ2luZygpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgY29uc3QgdXNlcm5hbWUgPSB0aGlzLmdldCgndXNlcm5hbWUnKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5nZXQoJ25hbWUnKSB8fFxuICAgICAgICB0aGlzLmdldFByb2ZpbGVOYW1lKCkgfHxcbiAgICAgICAgdGhpcy5nZXROdW1iZXIoKSB8fFxuICAgICAgICAodXNlcm5hbWUgJiYgd2luZG93LmkxOG4oJ2F0LXVzZXJuYW1lJywgeyB1c2VybmFtZSB9KSkgfHxcbiAgICAgICAgd2luZG93LmkxOG4oJ3Vua25vd25Db250YWN0JylcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldCgnbmFtZScpIHx8IHdpbmRvdy5pMThuKCd1bmtub3duR3JvdXAnKTtcbiAgfVxuXG4gIGdldFByb2ZpbGVOYW1lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBVdGlsLmNvbWJpbmVOYW1lcyhcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgdGhpcy5nZXQoJ3Byb2ZpbGVOYW1lJykhLFxuICAgICAgICB0aGlzLmdldCgncHJvZmlsZUZhbWlseU5hbWUnKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0TnVtYmVyKCk6IHN0cmluZyB7XG4gICAgaWYgKCFpc0RpcmVjdENvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgbnVtYmVyID0gdGhpcy5nZXQoJ2UxNjQnKSE7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZE51bWJlciA9IHdpbmRvdy5saWJwaG9uZW51bWJlckluc3RhbmNlLnBhcnNlKG51bWJlcik7XG4gICAgICBjb25zdCByZWdpb25Db2RlID0gZ2V0UmVnaW9uQ29kZUZvck51bWJlcihudW1iZXIpO1xuICAgICAgaWYgKHJlZ2lvbkNvZGUgPT09IHdpbmRvdy5zdG9yYWdlLmdldCgncmVnaW9uQ29kZScpKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubGlicGhvbmVudW1iZXJJbnN0YW5jZS5mb3JtYXQoXG4gICAgICAgICAgcGFyc2VkTnVtYmVyLFxuICAgICAgICAgIHdpbmRvdy5saWJwaG9uZW51bWJlckZvcm1hdC5OQVRJT05BTFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdpbmRvdy5saWJwaG9uZW51bWJlckluc3RhbmNlLmZvcm1hdChcbiAgICAgICAgcGFyc2VkTnVtYmVyLFxuICAgICAgICB3aW5kb3cubGlicGhvbmVudW1iZXJGb3JtYXQuSU5URVJOQVRJT05BTFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbG9yKCk6IEF2YXRhckNvbG9yVHlwZSB7XG4gICAgcmV0dXJuIG1pZ3JhdGVDb2xvcih0aGlzLmdldCgnY29sb3InKSk7XG4gIH1cblxuICBnZXRDb252ZXJzYXRpb25Db2xvcigpOiBDb252ZXJzYXRpb25Db2xvclR5cGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmdldCgnY29udmVyc2F0aW9uQ29sb3InKTtcbiAgfVxuXG4gIGdldEN1c3RvbUNvbG9yRGF0YSgpOiB7XG4gICAgY3VzdG9tQ29sb3I/OiBDdXN0b21Db2xvclR5cGU7XG4gICAgY3VzdG9tQ29sb3JJZD86IHN0cmluZztcbiAgfSB7XG4gICAgaWYgKHRoaXMuZ2V0Q29udmVyc2F0aW9uQ29sb3IoKSAhPT0gJ2N1c3RvbScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGN1c3RvbUNvbG9yOiB1bmRlZmluZWQsXG4gICAgICAgIGN1c3RvbUNvbG9ySWQ6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1c3RvbUNvbG9yOiB0aGlzLmdldCgnY3VzdG9tQ29sb3InKSxcbiAgICAgIGN1c3RvbUNvbG9ySWQ6IHRoaXMuZ2V0KCdjdXN0b21Db2xvcklkJyksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXZhdGFyUGF0aCgpOiB1bmRlZmluZWQgfCBzdHJpbmcge1xuICAgIGNvbnN0IHNob3VsZFNob3dQcm9maWxlQXZhdGFyID1cbiAgICAgIGlzTWUodGhpcy5hdHRyaWJ1dGVzKSB8fFxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdwcmVmZXJDb250YWN0QXZhdGFycycpID09PSBmYWxzZTtcbiAgICBjb25zdCBhdmF0YXIgPSBzaG91bGRTaG93UHJvZmlsZUF2YXRhclxuICAgICAgPyB0aGlzLmdldCgncHJvZmlsZUF2YXRhcicpIHx8IHRoaXMuZ2V0KCdhdmF0YXInKVxuICAgICAgOiB0aGlzLmdldCgnYXZhdGFyJykgfHwgdGhpcy5nZXQoJ3Byb2ZpbGVBdmF0YXInKTtcbiAgICByZXR1cm4gYXZhdGFyPy5wYXRoIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXZhdGFySGFzaCgpOiB1bmRlZmluZWQgfCBzdHJpbmcge1xuICAgIGNvbnN0IGF2YXRhciA9IGlzTWUodGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgPyB0aGlzLmdldCgncHJvZmlsZUF2YXRhcicpIHx8IHRoaXMuZ2V0KCdhdmF0YXInKVxuICAgICAgOiB0aGlzLmdldCgnYXZhdGFyJykgfHwgdGhpcy5nZXQoJ3Byb2ZpbGVBdmF0YXInKTtcbiAgICByZXR1cm4gYXZhdGFyPy5oYXNoIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFic29sdXRlQXZhdGFyUGF0aCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGF2YXRhclBhdGggPSB0aGlzLmdldEF2YXRhclBhdGgoKTtcbiAgICByZXR1cm4gYXZhdGFyUGF0aCA/IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgoYXZhdGFyUGF0aCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRBYnNvbHV0ZVByb2ZpbGVBdmF0YXJQYXRoKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgYXZhdGFyUGF0aCA9IHRoaXMuZ2V0KCdwcm9maWxlQXZhdGFyJyk/LnBhdGg7XG4gICAgcmV0dXJuIGF2YXRhclBhdGggPyBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKGF2YXRhclBhdGgpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0QWJzb2x1dGVVbmJsdXJyZWRBdmF0YXJQYXRoKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgdW5ibHVycmVkQXZhdGFyUGF0aCA9IHRoaXMuZ2V0KCd1bmJsdXJyZWRBdmF0YXJQYXRoJyk7XG4gICAgcmV0dXJuIHVuYmx1cnJlZEF2YXRhclBhdGhcbiAgICAgID8gZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCh1bmJsdXJyZWRBdmF0YXJQYXRoKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICB1bmJsdXJBdmF0YXIoKTogdm9pZCB7XG4gICAgY29uc3QgYXZhdGFyUGF0aCA9IHRoaXMuZ2V0QXZhdGFyUGF0aCgpO1xuICAgIGlmIChhdmF0YXJQYXRoKSB7XG4gICAgICB0aGlzLnNldCgndW5ibHVycmVkQXZhdGFyUGF0aCcsIGF2YXRhclBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuc2V0KCd1bmJsdXJyZWRBdmF0YXJQYXRoJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYW5DaGFuZ2VUaW1lcigpOiBib29sZWFuIHtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNHcm91cFYxQW5kRGlzYWJsZWQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXNHcm91cFYyKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY2Vzc0NvbnRyb2xFbnVtID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcbiAgICBjb25zdCBhY2Nlc3NDb250cm9sID0gdGhpcy5nZXQoJ2FjY2Vzc0NvbnRyb2wnKTtcbiAgICBjb25zdCBjYW5BbnlvbmVDaGFuZ2VUaW1lciA9XG4gICAgICBhY2Nlc3NDb250cm9sICYmXG4gICAgICAoYWNjZXNzQ29udHJvbC5hdHRyaWJ1dGVzID09PSBhY2Nlc3NDb250cm9sRW51bS5BTlkgfHxcbiAgICAgICAgYWNjZXNzQ29udHJvbC5hdHRyaWJ1dGVzID09PSBhY2Nlc3NDb250cm9sRW51bS5NRU1CRVIpO1xuICAgIGlmIChjYW5BbnlvbmVDaGFuZ2VUaW1lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXJlV2VBZG1pbigpO1xuICB9XG5cbiAgY2FuRWRpdEdyb3VwSW5mbygpOiBib29sZWFuIHtcbiAgICBpZiAoIWlzR3JvdXBWMih0aGlzLmF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0KCdsZWZ0JykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5hcmVXZUFkbWluKCkgfHxcbiAgICAgIHRoaXMuZ2V0KCdhY2Nlc3NDb250cm9sJyk/LmF0dHJpYnV0ZXMgPT09XG4gICAgICAgIFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQuTUVNQkVSXG4gICAgKTtcbiAgfVxuXG4gIGFyZVdlQWRtaW4oKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpc0dyb3VwVjIodGhpcy5hdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbWJlckVudW0gPSBQcm90by5NZW1iZXIuUm9sZTtcbiAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5nZXQoJ21lbWJlcnNWMicpIHx8IFtdO1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZCgpPy50b1N0cmluZygpO1xuICAgIGNvbnN0IG1lID0gbWVtYmVycy5maW5kKGl0ZW0gPT4gaXRlbS51dWlkID09PSBvdXJVdWlkKTtcbiAgICBpZiAoIW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lLnJvbGUgPT09IG1lbWJlckVudW0uQURNSU5JU1RSQVRPUjtcbiAgfVxuXG4gIC8vIFNldCBvZiBpdGVtcyB0byBjYXB0dXJlQ2hhbmdlcyBvbjpcbiAgLy8gWy1dIHV1aWRcbiAgLy8gWy1dIGUxNjRcbiAgLy8gW1hdIHByb2ZpbGVLZXlcbiAgLy8gWy1dIGlkZW50aXR5S2V5XG4gIC8vIFtYXSB2ZXJpZmllZCFcbiAgLy8gWy1dIHByb2ZpbGVOYW1lXG4gIC8vIFstXSBwcm9maWxlRmFtaWx5TmFtZVxuICAvLyBbWF0gYmxvY2tlZFxuICAvLyBbWF0gd2hpdGVsaXN0ZWRcbiAgLy8gW1hdIGFyY2hpdmVkXG4gIC8vIFtYXSBtYXJrZWRVbnJlYWRcbiAgLy8gW1hdIGRvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWRcbiAgY2FwdHVyZUNoYW5nZShsb2dNZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsb2cuaW5mbygnc3RvcmFnZVNlcnZpY2VbY2FwdHVyZUNoYW5nZV0nLCBsb2dNZXNzYWdlLCB0aGlzLmlkRm9yTG9nZ2luZygpKTtcbiAgICB0aGlzLnNldCh7IG5lZWRzU3RvcmFnZVNlcnZpY2VTeW5jOiB0cnVlIH0pO1xuXG4gICAgdGhpcy5xdWV1ZUpvYignY2FwdHVyZUNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIFNlcnZpY2VzLnN0b3JhZ2VTZXJ2aWNlVXBsb2FkSm9iKCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydE11dGVUaW1lcih7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYyA9IGZhbHNlIH0gPSB7fSk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRoaXMubXV0ZVRpbWVyKTtcbiAgICB0aGlzLm11dGVUaW1lciA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IG11dGVFeHBpcmVzQXQgPSB0aGlzLmdldCgnbXV0ZUV4cGlyZXNBdCcpO1xuICAgIGlmIChpc051bWJlcihtdXRlRXhwaXJlc0F0KSAmJiBtdXRlRXhwaXJlc0F0IDwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgIGNvbnN0IGRlbGF5ID0gbXV0ZUV4cGlyZXNBdCAtIERhdGUubm93KCk7XG4gICAgICBpZiAoZGVsYXkgPD0gMCkge1xuICAgICAgICB0aGlzLnNldE11dGVFeHBpcmF0aW9uKDAsIHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubXV0ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldE11dGVFeHBpcmF0aW9uKDApLCBkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlSGlkZVN0b3JpZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zZXQoeyBoaWRlU3Rvcnk6ICF0aGlzLmdldCgnaGlkZVN0b3J5JykgfSk7XG4gICAgdGhpcy5jYXB0dXJlQ2hhbmdlKCdoaWRlU3RvcnknKTtcbiAgfVxuXG4gIHNldE11dGVFeHBpcmF0aW9uKFxuICAgIG11dGVFeHBpcmVzQXQgPSAwLFxuICAgIHsgdmlhU3RvcmFnZVNlcnZpY2VTeW5jID0gZmFsc2UgfSA9IHt9XG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHByZXZFeHBpcmF0aW9uID0gdGhpcy5nZXQoJ211dGVFeHBpcmVzQXQnKTtcblxuICAgIGlmIChwcmV2RXhwaXJhdGlvbiA9PT0gbXV0ZUV4cGlyZXNBdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KHsgbXV0ZUV4cGlyZXNBdCB9KTtcblxuICAgIC8vIERvbid0IGNhdXNlIGR1cGxpY2F0ZSBjYXB0dXJlQ2hhbmdlXG4gICAgdGhpcy5zdGFydE11dGVUaW1lcih7IHZpYVN0b3JhZ2VTZXJ2aWNlU3luYzogdHJ1ZSB9KTtcblxuICAgIGlmICghdmlhU3RvcmFnZVNlcnZpY2VTeW5jKSB7XG4gICAgICB0aGlzLmNhcHR1cmVDaGFuZ2UoJ211dGVkVW50aWxUaW1lc3RhbXAnKTtcbiAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH1cblxuICBpc011dGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0NvbnZlcnNhdGlvbk11dGVkKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICBhc3luYyBub3RpZnkoXG4gICAgbWVzc2FnZTogUmVhZG9ubHk8TWVzc2FnZU1vZGVsPixcbiAgICByZWFjdGlvbj86IFJlYWRvbmx5PFJlYWN0aW9uTW9kZWw+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIEFzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uIGRvbid0IHBlcmZvcm0gYW55IHdvcmsgaWYgbm90aWZpY2F0aW9ucyBhcmVcbiAgICAvLyBkaXNhYmxlZC5cbiAgICBpZiAoIW5vdGlmaWNhdGlvblNlcnZpY2UuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNNdXRlZCgpKSB7XG4gICAgICBpZiAodGhpcy5nZXQoJ2RvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWQnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZCgpPy50b1N0cmluZygpO1xuICAgICAgY29uc3QgbWVudGlvbnNNZSA9IChtZXNzYWdlLmdldCgnYm9keVJhbmdlcycpIHx8IFtdKS5zb21lKFxuICAgICAgICByYW5nZSA9PiByYW5nZS5tZW50aW9uVXVpZCAmJiByYW5nZS5tZW50aW9uVXVpZCA9PT0gb3VyVXVpZFxuICAgICAgKTtcbiAgICAgIGlmICghbWVudGlvbnNNZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc0luY29taW5nKG1lc3NhZ2UuYXR0cmlidXRlcykgJiYgIXJlYWN0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uSWQgPSB0aGlzLmlkO1xuXG4gICAgY29uc3Qgc2VuZGVyID0gcmVhY3Rpb25cbiAgICAgID8gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHJlYWN0aW9uLmdldCgnZnJvbUlkJykpXG4gICAgICA6IGdldENvbnRhY3QobWVzc2FnZS5hdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBzZW5kZXJOYW1lID0gc2VuZGVyXG4gICAgICA/IHNlbmRlci5nZXRUaXRsZSgpXG4gICAgICA6IHdpbmRvdy5pMThuKCd1bmtub3duQ29udGFjdCcpO1xuICAgIGNvbnN0IHNlbmRlclRpdGxlID0gaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgPyBzZW5kZXJOYW1lXG4gICAgICA6IHdpbmRvdy5pMThuKCdub3RpZmljYXRpb25TZW5kZXJJbkdyb3VwJywge1xuICAgICAgICAgIHNlbmRlcjogc2VuZGVyTmFtZSxcbiAgICAgICAgICBncm91cDogdGhpcy5nZXRUaXRsZSgpLFxuICAgICAgICB9KTtcblxuICAgIGxldCBub3RpZmljYXRpb25JY29uVXJsO1xuICAgIGNvbnN0IGF2YXRhciA9IHRoaXMuZ2V0KCdhdmF0YXInKSB8fCB0aGlzLmdldCgncHJvZmlsZUF2YXRhcicpO1xuICAgIGlmIChhdmF0YXIgJiYgYXZhdGFyLnBhdGgpIHtcbiAgICAgIG5vdGlmaWNhdGlvbkljb25VcmwgPSBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKGF2YXRhci5wYXRoKTtcbiAgICB9IGVsc2UgaWYgKGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcykpIHtcbiAgICAgIG5vdGlmaWNhdGlvbkljb25VcmwgPSBhd2FpdCB0aGlzLmdldElkZW50aWNvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOb3QgdGVjaG5pY2FsbHkgbmVlZGVkLCBidXQgaGVscHMgdXMgYmUgZXhwbGljaXQ6IHdlIGRvbid0IHNob3cgYW4gaWNvbiBmb3IgYVxuICAgICAgLy8gICBncm91cCB0aGF0IGRvZXNuJ3QgaGF2ZSBhbiBpY29uLlxuICAgICAgbm90aWZpY2F0aW9uSWNvblVybCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlSlNPTiA9IG1lc3NhZ2UudG9KU09OKCk7XG4gICAgY29uc3QgbWVzc2FnZUlkID0gbWVzc2FnZS5pZDtcbiAgICBjb25zdCBpc0V4cGlyaW5nTWVzc2FnZSA9IE1lc3NhZ2UuaGFzRXhwaXJhdGlvbihtZXNzYWdlSlNPTik7XG5cbiAgICBub3RpZmljYXRpb25TZXJ2aWNlLmFkZCh7XG4gICAgICBzZW5kZXJUaXRsZSxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgbm90aWZpY2F0aW9uSWNvblVybCxcbiAgICAgIGlzRXhwaXJpbmdNZXNzYWdlLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZS5nZXROb3RpZmljYXRpb25UZXh0KCksXG4gICAgICBtZXNzYWdlSWQsXG4gICAgICByZWFjdGlvbjogcmVhY3Rpb24gPyByZWFjdGlvbi50b0pTT04oKSA6IG51bGwsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldElkZW50aWNvbigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5nZXRDb2xvcigpO1xuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xuXG4gICAgY29uc3QgY29udGVudCA9ICh0aXRsZSAmJiBnZXRJbml0aWFscyh0aXRsZSkpIHx8ICcjJztcblxuICAgIGNvbnN0IGNhY2hlZCA9IHRoaXMuY2FjaGVkSWRlbnRpY29uO1xuICAgIGlmIChjYWNoZWQgJiYgY2FjaGVkLmNvbnRlbnQgPT09IGNvbnRlbnQgJiYgY2FjaGVkLmNvbG9yID09PSBjb2xvcikge1xuICAgICAgcmV0dXJuIGNhY2hlZC51cmw7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gYXdhaXQgY3JlYXRlSWRlbnRpY29uKGNvbG9yLCBjb250ZW50KTtcblxuICAgIHRoaXMuY2FjaGVkSWRlbnRpY29uID0geyBjb250ZW50LCBjb2xvciwgdXJsIH07XG5cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgbm90aWZ5VHlwaW5nKG9wdGlvbnM6IHtcbiAgICBpc1R5cGluZzogYm9vbGVhbjtcbiAgICBzZW5kZXJJZDogc3RyaW5nO1xuICAgIGZyb21NZTogYm9vbGVhbjtcbiAgICBzZW5kZXJEZXZpY2U6IG51bWJlcjtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHsgaXNUeXBpbmcsIHNlbmRlcklkLCBmcm9tTWUsIHNlbmRlckRldmljZSB9ID0gb3B0aW9ucztcblxuICAgIC8vIFdlIGRvbid0IGRvIGFueXRoaW5nIHdpdGggdHlwaW5nIG1lc3NhZ2VzIGZyb20gb3VyIG90aGVyIGRldmljZXNcbiAgICBpZiAoZnJvbU1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VuZGVyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHNlbmRlcklkKTtcbiAgICBpZiAoIXNlbmRlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRlclV1aWQgPSBzZW5kZXIuZ2V0VXVpZCgpO1xuICAgIGlmICghc2VuZGVyVXVpZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERyb3AgdHlwaW5nIGluZGljYXRvcnMgZm9yIGFubm91bmNlbWVudCBvbmx5IGdyb3VwcyB3aGVyZSB0aGUgc2VuZGVyXG4gICAgLy8gaXMgbm90IGFuIGFkbWluXG4gICAgaWYgKHRoaXMuZ2V0KCdhbm5vdW5jZW1lbnRzT25seScpICYmICF0aGlzLmlzQWRtaW4oc2VuZGVyVXVpZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBpbmdUb2tlbiA9IGAke3NlbmRlcklkfS4ke3NlbmRlckRldmljZX1gO1xuXG4gICAgdGhpcy5jb250YWN0VHlwaW5nVGltZXJzID0gdGhpcy5jb250YWN0VHlwaW5nVGltZXJzIHx8IHt9O1xuICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY29udGFjdFR5cGluZ1RpbWVyc1t0eXBpbmdUb2tlbl07XG5cbiAgICBpZiAocmVjb3JkKSB7XG4gICAgICBjbGVhclRpbWVvdXQocmVjb3JkLnRpbWVyKTtcbiAgICB9XG5cbiAgICBpZiAoaXNUeXBpbmcpIHtcbiAgICAgIHRoaXMuY29udGFjdFR5cGluZ1RpbWVyc1t0eXBpbmdUb2tlbl0gPSB0aGlzLmNvbnRhY3RUeXBpbmdUaW1lcnNbXG4gICAgICAgIHR5cGluZ1Rva2VuXG4gICAgICBdIHx8IHtcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICBzZW5kZXJJZCxcbiAgICAgICAgc2VuZGVyRGV2aWNlLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5jb250YWN0VHlwaW5nVGltZXJzW3R5cGluZ1Rva2VuXS50aW1lciA9IHNldFRpbWVvdXQoXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWN0VHlwaW5nVGltZXIuYmluZCh0aGlzLCB0eXBpbmdUb2tlbiksXG4gICAgICAgIDE1ICogMTAwMFxuICAgICAgKTtcbiAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgIC8vIFVzZXIgd2FzIG5vdCBwcmV2aW91c2x5IHR5cGluZyBiZWZvcmUuIFN0YXRlIGNoYW5nZSFcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCB7IGZvcmNlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdGhpcy5jb250YWN0VHlwaW5nVGltZXJzW3R5cGluZ1Rva2VuXTtcbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgLy8gVXNlciB3YXMgcHJldmlvdXNseSB0eXBpbmcsIGFuZCBpcyBubyBsb25nZXIuIFN0YXRlIGNoYW5nZSFcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCB7IGZvcmNlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyQ29udGFjdFR5cGluZ1RpbWVyKHR5cGluZ1Rva2VuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhY3RUeXBpbmdUaW1lcnMgPSB0aGlzLmNvbnRhY3RUeXBpbmdUaW1lcnMgfHwge307XG4gICAgY29uc3QgcmVjb3JkID0gdGhpcy5jb250YWN0VHlwaW5nVGltZXJzW3R5cGluZ1Rva2VuXTtcblxuICAgIGlmIChyZWNvcmQpIHtcbiAgICAgIGNsZWFyVGltZW91dChyZWNvcmQudGltZXIpO1xuICAgICAgZGVsZXRlIHRoaXMuY29udGFjdFR5cGluZ1RpbWVyc1t0eXBpbmdUb2tlbl07XG5cbiAgICAgIC8vIFVzZXIgd2FzIHByZXZpb3VzbHkgdHlwaW5nLCBidXQgdGltZWQgb3V0IG9yIHdlIHJlY2VpdmVkIG1lc3NhZ2UuIFN0YXRlIGNoYW5nZSFcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcywgeyBmb3JjZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cblxuICBwaW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ2V0KCdpc1Bpbm5lZCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oJ3Bpbm5pbmcnLCB0aGlzLmlkRm9yTG9nZ2luZygpKTtcbiAgICBjb25zdCBwaW5uZWRDb252ZXJzYXRpb25JZHMgPSBuZXcgU2V0KFxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdwaW5uZWRDb252ZXJzYXRpb25JZHMnLCBuZXcgQXJyYXk8c3RyaW5nPigpKVxuICAgICk7XG5cbiAgICBwaW5uZWRDb252ZXJzYXRpb25JZHMuYWRkKHRoaXMuaWQpO1xuXG4gICAgdGhpcy53cml0ZVBpbm5lZENvbnZlcnNhdGlvbnMoWy4uLnBpbm5lZENvbnZlcnNhdGlvbklkc10pO1xuXG4gICAgdGhpcy5zZXQoJ2lzUGlubmVkJywgdHJ1ZSk7XG5cbiAgICBpZiAodGhpcy5nZXQoJ2lzQXJjaGl2ZWQnKSkge1xuICAgICAgdGhpcy5zZXQoeyBpc0FyY2hpdmVkOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgdW5waW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmdldCgnaXNQaW5uZWQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCd1bi1waW5uaW5nJywgdGhpcy5pZEZvckxvZ2dpbmcoKSk7XG5cbiAgICBjb25zdCBwaW5uZWRDb252ZXJzYXRpb25JZHMgPSBuZXcgU2V0KFxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdwaW5uZWRDb252ZXJzYXRpb25JZHMnLCBuZXcgQXJyYXk8c3RyaW5nPigpKVxuICAgICk7XG5cbiAgICBwaW5uZWRDb252ZXJzYXRpb25JZHMuZGVsZXRlKHRoaXMuaWQpO1xuXG4gICAgdGhpcy53cml0ZVBpbm5lZENvbnZlcnNhdGlvbnMoWy4uLnBpbm5lZENvbnZlcnNhdGlvbklkc10pO1xuXG4gICAgdGhpcy5zZXQoJ2lzUGlubmVkJywgZmFsc2UpO1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIHdyaXRlUGlubmVkQ29udmVyc2F0aW9ucyhwaW5uZWRDb252ZXJzYXRpb25JZHM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3Bpbm5lZENvbnZlcnNhdGlvbklkcycsIHBpbm5lZENvbnZlcnNhdGlvbklkcyk7XG5cbiAgICBjb25zdCBteUlkID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcbiAgICBjb25zdCBtZSA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChteUlkKTtcblxuICAgIGlmIChtZSkge1xuICAgICAgbWUuY2FwdHVyZUNoYW5nZSgncGluJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0RG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZChuZXdWYWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSBCb29sZWFuKHRoaXMuZ2V0KCdkb250Tm90aWZ5Rm9yTWVudGlvbnNJZk11dGVkJykpO1xuICAgIGlmIChwcmV2aW91c1ZhbHVlID09PSBuZXdWYWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KHsgZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZDogbmV3VmFsdWUgfSk7XG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbih0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuY2FwdHVyZUNoYW5nZSgnZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZCcpO1xuICB9XG5cbiAgYWNrbm93bGVkZ2VHcm91cE1lbWJlck5hbWVDb2xsaXNpb25zKFxuICAgIGdyb3VwTmFtZUNvbGxpc2lvbnM6IFJlYWRvbmx5PEdyb3VwTmFtZUNvbGxpc2lvbnNXaXRoSWRzQnlUaXRsZT5cbiAgKTogdm9pZCB7XG4gICAgdGhpcy5zZXQoJ2Fja25vd2xlZGdlZEdyb3VwTmFtZUNvbGxpc2lvbnMnLCBncm91cE5hbWVDb2xsaXNpb25zKTtcbiAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKHRoaXMuYXR0cmlidXRlcyk7XG4gIH1cblxuICBvbk9wZW5TdGFydCgpOiB2b2lkIHtcbiAgICBsb2cuaW5mbyhgY29udmVyc2F0aW9uICR7dGhpcy5pZEZvckxvZ2dpbmcoKX0gb3BlbiBzdGFydGApO1xuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm9uQ29udm9PcGVuU3RhcnQodGhpcy5pZCk7XG4gIH1cblxuICBvbk9wZW5Db21wbGV0ZShzdGFydGVkQXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZGVsdGEgPSBub3cgLSBzdGFydGVkQXQ7XG5cbiAgICBsb2cuaW5mbyhgY29udmVyc2F0aW9uICR7dGhpcy5pZEZvckxvZ2dpbmcoKX0gb3BlbiB0b29rICR7ZGVsdGF9bXNgKTtcbiAgICB3aW5kb3cuQ0k/LmhhbmRsZUV2ZW50KCdjb252ZXJzYXRpb246b3BlbicsIHsgZGVsdGEgfSk7XG4gIH1cblxuICBhc3luYyBmbHVzaERlYm91bmNlZFVwZGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2U/LmZsdXNoKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IGxvZ0lkID0gdGhpcy5pZEZvckxvZ2dpbmcoKTtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYGZsdXNoRGVib3VuY2VkVXBkYXRlcygke2xvZ0lkfSk6IGdvdCBlcnJvcmAsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbndpbmRvdy5XaGlzcGVyLkNvbnZlcnNhdGlvbiA9IENvbnZlcnNhdGlvbk1vZGVsO1xuXG53aW5kb3cuV2hpc3Blci5Db252ZXJzYXRpb25Db2xsZWN0aW9uID0gd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IHdpbmRvdy5XaGlzcGVyLkNvbnZlcnNhdGlvbixcblxuICAvKipcbiAgICogd2luZG93LkJhY2tib25lIGRlZmluZXMgYSBgX2J5SWRgIGZpZWxkLiBIZXJlIHdlIHNldCB1cCBhZGRpdGlvbmFsIGBfYnlFMTY0YCxcbiAgICogYF9ieVV1aWRgLCBhbmQgYF9ieUdyb3VwSWRgIGZpZWxkcyBzbyB3ZSBjYW4gdHJhY2sgY29udmVyc2F0aW9ucyBieSBtb3JlXG4gICAqIHRoYW4ganVzdCB0aGVpciBpZC5cbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5lcmFzZUxvb2t1cHMoKTtcbiAgICB0aGlzLm9uKFxuICAgICAgJ2lkVXBkYXRlZCcsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgKG1vZGVsOiBDb252ZXJzYXRpb25Nb2RlbCwgaWRQcm9wOiBzdHJpbmcsIG9sZFZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKGlkUHJvcCA9PT0gJ2UxNjQnKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYnlFMTY0W29sZFZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkUHJvcCA9PT0gJ3V1aWQnKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYnlVdWlkW29sZFZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkUHJvcCA9PT0gJ3BuaScpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ieVBuaVtvbGRWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZFByb3AgPT09ICdncm91cElkJykge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2J5R3JvdXBJZFtvbGRWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGUxNjQgPSBtb2RlbC5nZXQoJ2UxNjQnKTtcbiAgICAgICAgaWYgKGUxNjQpIHtcbiAgICAgICAgICB0aGlzLl9ieUUxNjRbZTE2NF0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1dWlkID0gbW9kZWwuZ2V0KCd1dWlkJyk7XG4gICAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgICAgdGhpcy5fYnlVdWlkW3V1aWRdID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG5pID0gbW9kZWwuZ2V0KCdwbmknKTtcbiAgICAgICAgaWYgKHBuaSkge1xuICAgICAgICAgIHRoaXMuX2J5UG5pW3BuaV0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cElkID0gbW9kZWwuZ2V0KCdncm91cElkJyk7XG4gICAgICAgIGlmIChncm91cElkKSB7XG4gICAgICAgICAgdGhpcy5fYnlHcm91cElkW2dyb3VwSWRdID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuXG4gIHJlc2V0KG1vZGVscz86IEFycmF5PENvbnZlcnNhdGlvbk1vZGVsPiwgb3B0aW9ucz86IEJhY2tib25lLlNpbGVuY2VhYmxlKSB7XG4gICAgd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlc2V0LmNhbGwodGhpcywgbW9kZWxzLCBvcHRpb25zKTtcbiAgICB0aGlzLnJlc2V0TG9va3VwcygpO1xuICB9LFxuXG4gIHJlc2V0TG9va3VwcygpIHtcbiAgICB0aGlzLmVyYXNlTG9va3VwcygpO1xuICAgIHRoaXMuZ2VuZXJhdGVMb29rdXBzKHRoaXMubW9kZWxzKTtcbiAgfSxcblxuICBnZW5lcmF0ZUxvb2t1cHMobW9kZWxzOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvbk1vZGVsPikge1xuICAgIG1vZGVscy5mb3JFYWNoKG1vZGVsID0+IHtcbiAgICAgIGNvbnN0IGUxNjQgPSBtb2RlbC5nZXQoJ2UxNjQnKTtcbiAgICAgIGlmIChlMTY0KSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5fYnlFMTY0W2UxNjRdO1xuXG4gICAgICAgIC8vIFByZWZlciB0aGUgY29udGFjdCB3aXRoIGJvdGggZTE2NCBhbmQgdXVpZFxuICAgICAgICBpZiAoIWV4aXN0aW5nIHx8IChleGlzdGluZyAmJiAhZXhpc3RpbmcuZ2V0KCd1dWlkJykpKSB7XG4gICAgICAgICAgdGhpcy5fYnlFMTY0W2UxNjRdID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdXVpZCA9IG1vZGVsLmdldCgndXVpZCcpO1xuICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLl9ieVV1aWRbdXVpZF07XG5cbiAgICAgICAgLy8gUHJlZmVyIHRoZSBjb250YWN0IHdpdGggYm90aCBlMTY0IGFuZCB1dWlkXG4gICAgICAgIGlmICghZXhpc3RpbmcgfHwgKGV4aXN0aW5nICYmICFleGlzdGluZy5nZXQoJ2UxNjQnKSkpIHtcbiAgICAgICAgICB0aGlzLl9ieVV1aWRbdXVpZF0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBwbmkgPSBtb2RlbC5nZXQoJ3BuaScpO1xuICAgICAgaWYgKHBuaSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuX2J5UG5pW3BuaV07XG5cbiAgICAgICAgLy8gUHJlZmVyIHRoZSBjb250YWN0IHdpdGggYm90aCB1dWlkIGFuZCBwbmlcbiAgICAgICAgaWYgKCFleGlzdGluZyB8fCAoZXhpc3RpbmcgJiYgIWV4aXN0aW5nLmdldCgndXVpZCcpKSkge1xuICAgICAgICAgIHRoaXMuX2J5UG5pW3BuaV0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBncm91cElkID0gbW9kZWwuZ2V0KCdncm91cElkJyk7XG4gICAgICBpZiAoZ3JvdXBJZCkge1xuICAgICAgICB0aGlzLl9ieUdyb3VwSWRbZ3JvdXBJZF0gPSBtb2RlbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBlcmFzZUxvb2t1cHMoKSB7XG4gICAgdGhpcy5fYnlFMTY0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ieVV1aWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2J5UG5pID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ieUdyb3VwSWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9LFxuXG4gIGFkZChcbiAgICBkYXRhOlxuICAgICAgfCBDb252ZXJzYXRpb25Nb2RlbFxuICAgICAgfCBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVxuICAgICAgfCBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD5cbiAgICAgIHwgQXJyYXk8Q29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU+XG4gICkge1xuICAgIGxldCBoeWRyYXRlZERhdGE6IEFycmF5PENvbnZlcnNhdGlvbk1vZGVsPiB8IENvbnZlcnNhdGlvbk1vZGVsO1xuXG4gICAgLy8gRmlyc3QsIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgdGhlIGRhdGEgd2UncmUgd29ya2luZyB3aXRoIGlzIENvbnZlcnNhdGlvbiBtb2RlbHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgaHlkcmF0ZWREYXRhID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gZGF0YS5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBpdGVtID0gZGF0YVtpXTtcblxuICAgICAgICAvLyBXZSBjcmVhdGUgYSBuZXcgbW9kZWwgaWYgaXQncyBub3QgYWxyZWFkeSBhIG1vZGVsXG4gICAgICAgIGlmIChoYXMoaXRlbSwgJ2dldCcpKSB7XG4gICAgICAgICAgaHlkcmF0ZWREYXRhLnB1c2goaXRlbSBhcyBDb252ZXJzYXRpb25Nb2RlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaHlkcmF0ZWREYXRhLnB1c2goXG4gICAgICAgICAgICBuZXcgd2luZG93LldoaXNwZXIuQ29udmVyc2F0aW9uKGl0ZW0gYXMgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGFzKGRhdGEsICdnZXQnKSkge1xuICAgICAgaHlkcmF0ZWREYXRhID0gZGF0YSBhcyBDb252ZXJzYXRpb25Nb2RlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaHlkcmF0ZWREYXRhID0gbmV3IHdpbmRvdy5XaGlzcGVyLkNvbnZlcnNhdGlvbihcbiAgICAgICAgZGF0YSBhcyBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBOZXh0LCB3ZSB1cGRhdGUgb3VyIGxvb2t1cHMgZmlyc3QgdG8gcHJldmVudCBpbmZpbml0ZSBsb29wcyBvbiB0aGUgJ2FkZCcgZXZlbnRcbiAgICB0aGlzLmdlbmVyYXRlTG9va3VwcyhcbiAgICAgIEFycmF5LmlzQXJyYXkoaHlkcmF0ZWREYXRhKSA/IGh5ZHJhdGVkRGF0YSA6IFtoeWRyYXRlZERhdGFdXG4gICAgKTtcblxuICAgIC8vIExhc3RseSwgd2UgZmlyZSBvZmYgdGhlIGFkZCBldmVudHMgcmVsYXRlZCB0byB0aGlzIGNoYW5nZVxuICAgIC8vIEdvIGhvbWUgQmFja2JvbmUsIHlvdSdyZSBkcnVuay5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBoeWRyYXRlZERhdGEgYXMgYW55KTtcblxuICAgIHJldHVybiBoeWRyYXRlZERhdGE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIHdpbmRvdy5CYWNrYm9uZSBjb2xsZWN0aW9ucyBoYXZlIGEgYF9ieUlkYCBmaWVsZCB0aGF0IGBnZXRgIGRlZmVycyB0by4gSGVyZSwgd2VcbiAgICogb3ZlcnJpZGUgYGdldGAgdG8gZmlyc3QgYWNjZXNzIG91ciBjdXN0b20gYF9ieUUxNjRgLCBgX2J5VXVpZGAsIGFuZFxuICAgKiBgX2J5R3JvdXBJZGAgZnVuY3Rpb25zLCBmb2xsb3dlZCBieSBmYWxsaW5nIGJhY2sgdG8gdGhlIG9yaWdpbmFsXG4gICAqIHdpbmRvdy5CYWNrYm9uZSBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG4gIGdldChpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2J5RTE2NFtpZF0gfHxcbiAgICAgIHRoaXMuX2J5RTE2NFtgKyR7aWR9YF0gfHxcbiAgICAgIHRoaXMuX2J5VXVpZFtpZF0gfHxcbiAgICAgIHRoaXMuX2J5UG5pW2lkXSB8fFxuICAgICAgdGhpcy5fYnlHcm91cElkW2lkXSB8fFxuICAgICAgd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldC5jYWxsKHRoaXMsIGlkKVxuICAgICk7XG4gIH0sXG5cbiAgY29tcGFyYXRvcihtOiBDb252ZXJzYXRpb25Nb2RlbCkge1xuICAgIHJldHVybiAtKG0uZ2V0KCdhY3RpdmVfYXQnKSB8fCAwKTtcbiAgfSxcbn0pO1xuXG50eXBlIFNvcnRhYmxlQnlUaXRsZSA9IHtcbiAgZ2V0VGl0bGU6ICgpID0+IHN0cmluZztcbn07XG5cbmNvbnN0IHNvcnRDb252ZXJzYXRpb25UaXRsZXMgPSAoXG4gIGxlZnQ6IFNvcnRhYmxlQnlUaXRsZSxcbiAgcmlnaHQ6IFNvcnRhYmxlQnlUaXRsZSxcbiAgY29sbGF0b3I6IEludGwuQ29sbGF0b3JcbikgPT4ge1xuICByZXR1cm4gY29sbGF0b3IuY29tcGFyZShsZWZ0LmdldFRpdGxlKCksIHJpZ2h0LmdldFRpdGxlKCkpO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBMkQ7QUFDM0QseUJBQXVDO0FBQ3ZDLGtCQUFtQztBQVduQyx5QkFBNEI7QUFDNUIsMkJBQThCO0FBQzlCLGdDQUF1QztBQUN2QyxxQ0FBd0M7QUFFeEMsdUJBQTRCO0FBQzVCLHdCQUFzQjtBQUV0QixxQkFBeUI7QUFDekIsc0JBQWlDO0FBQ2pDLG1CQUE4QjtBQUU5QixlQUEwQjtB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
