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
var groups_exports = {};
__export(groups_exports, {
  ID_LENGTH: () => ID_LENGTH,
  ID_V1_LENGTH: () => ID_V1_LENGTH,
  LINK_VERSION_ERROR: () => LINK_VERSION_ERROR,
  MASTER_KEY_LENGTH: () => MASTER_KEY_LENGTH,
  _isGroupChangeMessageBounceable: () => _isGroupChangeMessageBounceable,
  _maybeBuildAddBannedMemberActions: () => _maybeBuildAddBannedMemberActions,
  _mergeGroupChangeMessages: () => _mergeGroupChangeMessages,
  applyNewAvatar: () => applyNewAvatar,
  buildAccessControlAddFromInviteLinkChange: () => buildAccessControlAddFromInviteLinkChange,
  buildAccessControlAttributesChange: () => buildAccessControlAttributesChange,
  buildAccessControlMembersChange: () => buildAccessControlMembersChange,
  buildAddBannedMemberChange: () => buildAddBannedMemberChange,
  buildAddMember: () => buildAddMember,
  buildAddMembersChange: () => buildAddMembersChange,
  buildAddPendingAdminApprovalMemberChange: () => buildAddPendingAdminApprovalMemberChange,
  buildAnnouncementsOnlyChange: () => buildAnnouncementsOnlyChange,
  buildDeleteMemberChange: () => buildDeleteMemberChange,
  buildDeletePendingAdminApprovalMemberChange: () => buildDeletePendingAdminApprovalMemberChange,
  buildDeletePendingMemberChange: () => buildDeletePendingMemberChange,
  buildDisappearingMessagesTimerChange: () => buildDisappearingMessagesTimerChange,
  buildGroupLink: () => buildGroupLink,
  buildInviteLinkPasswordChange: () => buildInviteLinkPasswordChange,
  buildMigrationBubble: () => buildMigrationBubble,
  buildModifyMemberRoleChange: () => buildModifyMemberRoleChange,
  buildNewGroupLinkChange: () => buildNewGroupLinkChange,
  buildPromoteMemberChange: () => buildPromoteMemberChange,
  buildPromotePendingAdminApprovalMemberChange: () => buildPromotePendingAdminApprovalMemberChange,
  buildUpdateAttributesChange: () => buildUpdateAttributesChange,
  createGroupV2: () => createGroupV2,
  decryptGroupAvatar: () => decryptGroupAvatar,
  decryptGroupDescription: () => decryptGroupDescription,
  decryptGroupTitle: () => decryptGroupTitle,
  deriveGroupFields: () => deriveGroupFields,
  fetchMembershipProof: () => fetchMembershipProof,
  generateGroupInviteLinkPassword: () => generateGroupInviteLinkPassword,
  getBasicMigrationBubble: () => getBasicMigrationBubble,
  getGroupMigrationMembers: () => getGroupMigrationMembers,
  getMembershipList: () => getMembershipList,
  getPreJoinGroupInfo: () => getPreJoinGroupInfo,
  hasV1GroupBeenMigrated: () => hasV1GroupBeenMigrated,
  idForLogging: () => idForLogging,
  initiateMigrationToGroupV2: () => initiateMigrationToGroupV2,
  isGroupEligibleToMigrate: () => isGroupEligibleToMigrate,
  joinGroupV2ViaLinkAndMigrate: () => joinGroupV2ViaLinkAndMigrate,
  joinViaLink: () => import_joinViaLink.joinViaLink,
  maybeDeriveGroupV2Id: () => maybeDeriveGroupV2Id,
  maybeUpdateGroup: () => maybeUpdateGroup,
  modifyGroupV2: () => modifyGroupV2,
  parseGroupLink: () => parseGroupLink,
  respondToGroupV2Migration: () => respondToGroupV2Migration,
  waitThenMaybeUpdateGroup: () => waitThenMaybeUpdateGroup,
  waitThenRespondToGroupV2Migration: () => waitThenRespondToGroupV2Migration
});
module.exports = __toCommonJS(groups_exports);
var import_lodash = require("lodash");
var import_long = __toESM(require("long"));
var import_uuid = require("uuid");
var import_lru_cache = __toESM(require("lru-cache"));
var log = __toESM(require("./logging/log"));
var import_groupCredentialFetcher = require("./services/groupCredentialFetcher");
var import_Client = __toESM(require("./sql/Client"));
var import_webSafeBase64 = require("./util/webSafeBase64");
var import_assert = require("./util/assert");
var import_timestamp = require("./util/timestamp");
var durations = __toESM(require("./util/durations"));
var import_normalizeUuid = require("./util/normalizeUuid");
var import_dropNull = require("./util/dropNull");
var import_zkgroup = require("./util/zkgroup");
var import_Crypto = require("./Crypto");
var import_Errors = require("./textsecure/Errors");
var import_Message2 = require("./types/Message2");
var import_limits = require("./groups/limits");
var import_whatTypeOfConversation = require("./util/whatTypeOfConversation");
var Bytes = __toESM(require("./Bytes"));
var import_UUID = require("./types/UUID");
var Errors = __toESM(require("./types/errors"));
var import_protobuf = require("./protobuf");
var import_isNotNil = require("./util/isNotNil");
var import_util = require("./groups/util");
var import_conversationJobQueue = require("./jobs/conversationJobQueue");
var import_MessageReadStatus = require("./messages/MessageReadStatus");
var import_MessageSeenStatus = require("./MessageSeenStatus");
var import_joinViaLink = require("./groups/joinViaLink");
const MAX_CACHED_GROUP_FIELDS = 100;
const groupFieldsCache = new import_lru_cache.default({
  max: MAX_CACHED_GROUP_FIELDS
});
const { updateConversation } = import_Client.default;
if (!(0, import_lodash.isNumber)(import_Message2.CURRENT_SCHEMA_VERSION)) {
  throw new Error("groups.ts: Unable to capture max message schema from js/modules/types/message");
}
const MASTER_KEY_LENGTH = 32;
const GROUP_TITLE_MAX_ENCRYPTED_BYTES = 1024;
const GROUP_DESC_MAX_ENCRYPTED_BYTES = 8192;
const ID_V1_LENGTH = 16;
const ID_LENGTH = 32;
const TEMPORAL_AUTH_REJECTED_CODE = 401;
const GROUP_ACCESS_DENIED_CODE = 403;
const GROUP_NONEXISTENT_CODE = 404;
const SUPPORTED_CHANGE_EPOCH = 5;
const LINK_VERSION_ERROR = "LINK_VERSION_ERROR";
const GROUP_INVITE_LINK_PASSWORD_LENGTH = 16;
function generateBasicMessage() {
  return {
    id: (0, import_uuid.v4)(),
    schemaVersion: import_Message2.CURRENT_SCHEMA_VERSION
  };
}
function generateGroupInviteLinkPassword() {
  return (0, import_Crypto.getRandomBytes)(GROUP_INVITE_LINK_PASSWORD_LENGTH);
}
async function getPreJoinGroupInfo(inviteLinkPasswordBase64, masterKeyBase64) {
  const data = window.Signal.Groups.deriveGroupFields(Bytes.fromBase64(masterKeyBase64));
  return makeRequestWithTemporalRetry({
    logId: `getPreJoinInfo/groupv2(${data.id})`,
    publicParams: Bytes.toBase64(data.publicParams),
    secretParams: Bytes.toBase64(data.secretParams),
    request: (sender, options) => sender.getGroupFromLink(inviteLinkPasswordBase64, options)
  });
}
function buildGroupLink(conversation) {
  const { masterKey, groupInviteLinkPassword } = conversation.attributes;
  const bytes = import_protobuf.SignalService.GroupInviteLink.encode({
    v1Contents: {
      groupMasterKey: Bytes.fromBase64(masterKey),
      inviteLinkPassword: Bytes.fromBase64(groupInviteLinkPassword)
    }
  }).finish();
  const hash = (0, import_webSafeBase64.toWebSafeBase64)(Bytes.toBase64(bytes));
  return `https://signal.group/#${hash}`;
}
function parseGroupLink(hash) {
  const base64 = (0, import_webSafeBase64.fromWebSafeBase64)(hash);
  const buffer = Bytes.fromBase64(base64);
  const inviteLinkProto = import_protobuf.SignalService.GroupInviteLink.decode(buffer);
  if (inviteLinkProto.contents !== "v1Contents" || !inviteLinkProto.v1Contents) {
    const error = new Error("parseGroupLink: Parsed proto is missing v1Contents");
    error.name = LINK_VERSION_ERROR;
    throw error;
  }
  const {
    groupMasterKey: groupMasterKeyRaw,
    inviteLinkPassword: inviteLinkPasswordRaw
  } = inviteLinkProto.v1Contents;
  if (!groupMasterKeyRaw || !groupMasterKeyRaw.length) {
    throw new Error("v1Contents.groupMasterKey had no data!");
  }
  if (!inviteLinkPasswordRaw || !inviteLinkPasswordRaw.length) {
    throw new Error("v1Contents.inviteLinkPassword had no data!");
  }
  const masterKey = Bytes.toBase64(groupMasterKeyRaw);
  if (masterKey.length !== 44) {
    throw new Error(`masterKey had unexpected length ${masterKey.length}`);
  }
  const inviteLinkPassword = Bytes.toBase64(inviteLinkPasswordRaw);
  if (inviteLinkPassword.length === 0) {
    throw new Error(`inviteLinkPassword had unexpected length ${inviteLinkPassword.length}`);
  }
  return { masterKey, inviteLinkPassword };
}
async function uploadAvatar(options) {
  const { logId, publicParams, secretParams } = options;
  try {
    const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
    let data;
    if ("data" in options) {
      ({ data } = options);
    } else {
      data = await window.Signal.Migrations.readAttachmentData(options.path);
    }
    const hash = (0, import_Crypto.computeHash)(data);
    const blobPlaintext = import_protobuf.SignalService.GroupAttributeBlob.encode({
      avatar: data
    }).finish();
    const ciphertext = (0, import_zkgroup.encryptGroupBlob)(clientZkGroupCipher, blobPlaintext);
    const key = await makeRequestWithTemporalRetry({
      logId: `uploadGroupAvatar/${logId}`,
      publicParams,
      secretParams,
      request: (sender, requestOptions) => sender.uploadGroupAvatar(ciphertext, requestOptions)
    });
    return {
      data,
      hash,
      key
    };
  } catch (error) {
    log.warn(`uploadAvatar/${logId} Failed to upload avatar`, error.stack);
    throw error;
  }
}
function buildGroupTitleBuffer(clientZkGroupCipher, title) {
  const titleBlobPlaintext = import_protobuf.SignalService.GroupAttributeBlob.encode({
    title
  }).finish();
  const result = (0, import_zkgroup.encryptGroupBlob)(clientZkGroupCipher, titleBlobPlaintext);
  if (result.byteLength > GROUP_TITLE_MAX_ENCRYPTED_BYTES) {
    throw new Error("buildGroupTitleBuffer: encrypted group title is too long");
  }
  return result;
}
function buildGroupDescriptionBuffer(clientZkGroupCipher, description) {
  const attrsBlobPlaintext = import_protobuf.SignalService.GroupAttributeBlob.encode({
    descriptionText: description
  }).finish();
  const result = (0, import_zkgroup.encryptGroupBlob)(clientZkGroupCipher, attrsBlobPlaintext);
  if (result.byteLength > GROUP_DESC_MAX_ENCRYPTED_BYTES) {
    throw new Error("buildGroupDescriptionBuffer: encrypted group title is too long");
  }
  return result;
}
function buildGroupProto(attributes) {
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  const logId = `groupv2(${attributes.id})`;
  const { publicParams, secretParams } = attributes;
  if (!publicParams) {
    throw new Error(`buildGroupProto/${logId}: attributes were missing publicParams!`);
  }
  if (!secretParams) {
    throw new Error(`buildGroupProto/${logId}: attributes were missing secretParams!`);
  }
  const serverPublicParamsBase64 = window.getServerPublicParams();
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(serverPublicParamsBase64);
  const proto = new import_protobuf.SignalService.Group();
  proto.publicKey = Bytes.fromBase64(publicParams);
  proto.version = attributes.revision || 0;
  if (attributes.name) {
    proto.title = buildGroupTitleBuffer(clientZkGroupCipher, attributes.name);
  }
  if (attributes.avatarUrl) {
    proto.avatar = attributes.avatarUrl;
  }
  if (attributes.expireTimer) {
    const timerBlobPlaintext = import_protobuf.SignalService.GroupAttributeBlob.encode({
      disappearingMessagesDuration: attributes.expireTimer
    }).finish();
    proto.disappearingMessagesTimer = (0, import_zkgroup.encryptGroupBlob)(clientZkGroupCipher, timerBlobPlaintext);
  }
  const accessControl = new import_protobuf.SignalService.AccessControl();
  if (attributes.accessControl) {
    accessControl.attributes = attributes.accessControl.attributes || ACCESS_ENUM.MEMBER;
    accessControl.members = attributes.accessControl.members || ACCESS_ENUM.MEMBER;
  } else {
    accessControl.attributes = ACCESS_ENUM.MEMBER;
    accessControl.members = ACCESS_ENUM.MEMBER;
  }
  proto.accessControl = accessControl;
  proto.members = (attributes.membersV2 || []).map((item) => {
    const member = new import_protobuf.SignalService.Member();
    const conversation = window.ConversationController.get(item.uuid);
    if (!conversation) {
      throw new Error(`buildGroupProto/${logId}: no conversation for member!`);
    }
    const profileKeyCredentialBase64 = conversation.get("profileKeyCredential");
    if (!profileKeyCredentialBase64) {
      throw new Error(`buildGroupProto/${logId}: member was missing profileKeyCredential!`);
    }
    const presentation = (0, import_zkgroup.createProfileKeyCredentialPresentation)(clientZkProfileCipher, profileKeyCredentialBase64, secretParams);
    member.role = item.role || MEMBER_ROLE_ENUM.DEFAULT;
    member.presentation = presentation;
    return member;
  });
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourACICipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, ourACI);
  proto.membersPendingProfileKey = (attributes.pendingMembersV2 || []).map((item) => {
    const pendingMember = new import_protobuf.SignalService.MemberPendingProfileKey();
    const member = new import_protobuf.SignalService.Member();
    const conversation = window.ConversationController.get(item.uuid);
    if (!conversation) {
      throw new Error("buildGroupProto: no conversation for pending member!");
    }
    const uuid = conversation.getCheckedUuid("buildGroupProto: pending member was missing uuid!");
    const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
    member.userId = uuidCipherTextBuffer;
    member.role = item.role || MEMBER_ROLE_ENUM.DEFAULT;
    pendingMember.member = member;
    pendingMember.timestamp = import_long.default.fromNumber(item.timestamp);
    pendingMember.addedByUserId = ourACICipherTextBuffer;
    return pendingMember;
  });
  return proto;
}
async function buildAddMembersChange(conversation, conversationIds) {
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const { id, publicParams, revision, secretParams } = conversation;
  const logId = `groupv2(${id})`;
  if (!publicParams) {
    throw new Error(`buildAddMembersChange/${logId}: attributes were missing publicParams!`);
  }
  if (!secretParams) {
    throw new Error(`buildAddMembersChange/${logId}: attributes were missing secretParams!`);
  }
  const newGroupVersion = (revision || 0) + 1;
  const serverPublicParamsBase64 = window.getServerPublicParams();
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(serverPublicParamsBase64);
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourACICipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, ourACI);
  const now = Date.now();
  const addMembers = [];
  const addPendingMembers = [];
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  await Promise.all(conversationIds.map(async (conversationId) => {
    const contact = window.ConversationController.get(conversationId);
    if (!contact) {
      (0, import_assert.assert)(false, `buildAddMembersChange/${logId}: missing local contact, skipping`);
      return;
    }
    const uuid = contact.getUuid();
    if (!uuid) {
      (0, import_assert.assert)(false, `buildAddMembersChange/${logId}: missing UUID; skipping`);
      return;
    }
    if (!contact.get("profileKey") || !contact.get("profileKeyCredential")) {
      await contact.getProfiles();
    }
    const profileKey = contact.get("profileKey");
    const profileKeyCredential = contact.get("profileKeyCredential");
    const member = new import_protobuf.SignalService.Member();
    member.userId = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
    member.role = MEMBER_ROLE_ENUM.DEFAULT;
    member.joinedAtVersion = newGroupVersion;
    if (profileKey && profileKeyCredential) {
      member.presentation = (0, import_zkgroup.createProfileKeyCredentialPresentation)(clientZkProfileCipher, profileKeyCredential, secretParams);
      const addMemberAction = new import_protobuf.SignalService.GroupChange.Actions.AddMemberAction();
      addMemberAction.added = member;
      addMemberAction.joinFromInviteLink = false;
      addMembers.push(addMemberAction);
    } else {
      const memberPendingProfileKey = new import_protobuf.SignalService.MemberPendingProfileKey();
      memberPendingProfileKey.member = member;
      memberPendingProfileKey.addedByUserId = ourACICipherTextBuffer;
      memberPendingProfileKey.timestamp = import_long.default.fromNumber(now);
      const addPendingMemberAction = new import_protobuf.SignalService.GroupChange.Actions.AddMemberPendingProfileKeyAction();
      addPendingMemberAction.added = memberPendingProfileKey;
      addPendingMembers.push(addPendingMemberAction);
    }
    const doesMemberNeedUnban = conversation.bannedMembersV2?.find((bannedMember) => bannedMember.uuid === uuid.toString());
    if (doesMemberNeedUnban) {
      const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
      const deleteMemberBannedAction = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberBannedAction();
      deleteMemberBannedAction.deletedUserId = uuidCipherTextBuffer;
      actions.deleteMembersBanned = actions.deleteMembersBanned || [];
      actions.deleteMembersBanned.push(deleteMemberBannedAction);
    }
  }));
  if (!addMembers.length && !addPendingMembers.length) {
    return void 0;
  }
  if (addMembers.length) {
    actions.addMembers = addMembers;
  }
  if (addPendingMembers.length) {
    actions.addPendingMembers = addPendingMembers;
  }
  actions.version = newGroupVersion;
  return actions;
}
async function buildUpdateAttributesChange(conversation, attributes) {
  const { publicParams, secretParams, revision, id } = conversation;
  const logId = `groupv2(${id})`;
  if (!publicParams) {
    throw new Error(`buildUpdateAttributesChange/${logId}: attributes were missing publicParams!`);
  }
  if (!secretParams) {
    throw new Error(`buildUpdateAttributesChange/${logId}: attributes were missing secretParams!`);
  }
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  let hasChangedSomething = false;
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  if ("avatar" in attributes) {
    hasChangedSomething = true;
    actions.modifyAvatar = new import_protobuf.SignalService.GroupChange.Actions.ModifyAvatarAction();
    const { avatar } = attributes;
    if (avatar) {
      const uploadedAvatar = await uploadAvatar({
        data: avatar,
        logId,
        publicParams,
        secretParams
      });
      actions.modifyAvatar.avatar = uploadedAvatar.key;
    }
  }
  const { title } = attributes;
  if (title) {
    hasChangedSomething = true;
    actions.modifyTitle = new import_protobuf.SignalService.GroupChange.Actions.ModifyTitleAction();
    actions.modifyTitle.title = buildGroupTitleBuffer(clientZkGroupCipher, title);
  }
  const { description } = attributes;
  if (typeof description === "string") {
    hasChangedSomething = true;
    actions.modifyDescription = new import_protobuf.SignalService.GroupChange.Actions.ModifyDescriptionAction();
    actions.modifyDescription.descriptionBytes = buildGroupDescriptionBuffer(clientZkGroupCipher, description);
  }
  if (!hasChangedSomething) {
    return void 0;
  }
  actions.version = (revision || 0) + 1;
  return actions;
}
function buildDisappearingMessagesTimerChange({
  expireTimer,
  group
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  const blob = new import_protobuf.SignalService.GroupAttributeBlob();
  blob.disappearingMessagesDuration = expireTimer;
  if (!group.secretParams) {
    throw new Error("buildDisappearingMessagesTimerChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const blobPlaintext = import_protobuf.SignalService.GroupAttributeBlob.encode(blob).finish();
  const blobCipherText = (0, import_zkgroup.encryptGroupBlob)(clientZkGroupCipher, blobPlaintext);
  const timerAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyDisappearingMessagesTimerAction();
  timerAction.timer = blobCipherText;
  actions.version = (group.revision || 0) + 1;
  actions.modifyDisappearingMessagesTimer = timerAction;
  return actions;
}
function buildInviteLinkPasswordChange(group, inviteLinkPassword) {
  const inviteLinkPasswordAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyInviteLinkPasswordAction();
  inviteLinkPasswordAction.inviteLinkPassword = Bytes.fromBase64(inviteLinkPassword);
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyInviteLinkPassword = inviteLinkPasswordAction;
  return actions;
}
function buildNewGroupLinkChange(group, inviteLinkPassword, addFromInviteLinkAccess) {
  const accessControlAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyAddFromInviteLinkAccessControlAction();
  accessControlAction.addFromInviteLinkAccess = addFromInviteLinkAccess;
  const inviteLinkPasswordAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyInviteLinkPasswordAction();
  inviteLinkPasswordAction.inviteLinkPassword = Bytes.fromBase64(inviteLinkPassword);
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyAddFromInviteLinkAccess = accessControlAction;
  actions.modifyInviteLinkPassword = inviteLinkPasswordAction;
  return actions;
}
function buildAccessControlAddFromInviteLinkChange(group, value) {
  const accessControlAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyAddFromInviteLinkAccessControlAction();
  accessControlAction.addFromInviteLinkAccess = value;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyAddFromInviteLinkAccess = accessControlAction;
  return actions;
}
function buildAnnouncementsOnlyChange(group, value) {
  const action = new import_protobuf.SignalService.GroupChange.Actions.ModifyAnnouncementsOnlyAction();
  action.announcementsOnly = value;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyAnnouncementsOnly = action;
  return actions;
}
function buildAccessControlAttributesChange(group, value) {
  const accessControlAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyAttributesAccessControlAction();
  accessControlAction.attributesAccess = value;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyAttributesAccess = accessControlAction;
  return actions;
}
function buildAccessControlMembersChange(group, value) {
  const accessControlAction = new import_protobuf.SignalService.GroupChange.Actions.ModifyMembersAccessControlAction();
  accessControlAction.membersAccess = value;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  actions.version = (group.revision || 0) + 1;
  actions.modifyMemberAccess = accessControlAction;
  return actions;
}
function _maybeBuildAddBannedMemberActions({
  clientZkGroupCipher,
  group,
  ourUuid,
  uuid
}) {
  const doesMemberNeedBan = !group.bannedMembersV2?.find((member) => member.uuid === uuid.toString()) && !uuid.isEqual(ourUuid);
  if (!doesMemberNeedBan) {
    return {};
  }
  const sortedBannedMembers = [...group.bannedMembersV2 ?? []].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
  const deletedBannedMembers = sortedBannedMembers.slice(Math.max(0, (0, import_limits.getGroupSizeHardLimit)() - 1));
  let deleteMembersBanned = null;
  if (deletedBannedMembers.length > 0) {
    deleteMembersBanned = deletedBannedMembers.map((bannedMember) => {
      const deleteMemberBannedAction = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberBannedAction();
      deleteMemberBannedAction.deletedUserId = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, new import_UUID.UUID(bannedMember.uuid));
      return deleteMemberBannedAction;
    });
  }
  const addMemberBannedAction = new import_protobuf.SignalService.GroupChange.Actions.AddMemberBannedAction();
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  addMemberBannedAction.added = new import_protobuf.SignalService.MemberBanned();
  addMemberBannedAction.added.userId = uuidCipherTextBuffer;
  return {
    addMembersBanned: [addMemberBannedAction],
    deleteMembersBanned
  };
}
function buildDeletePendingAdminApprovalMemberChange({
  group,
  ourUuid,
  uuid
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildDeletePendingAdminApprovalMemberChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  const deleteMemberPendingAdminApproval = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberPendingAdminApprovalAction();
  deleteMemberPendingAdminApproval.deletedUserId = uuidCipherTextBuffer;
  actions.version = (group.revision || 0) + 1;
  actions.deleteMemberPendingAdminApprovals = [
    deleteMemberPendingAdminApproval
  ];
  const { addMembersBanned, deleteMembersBanned } = _maybeBuildAddBannedMemberActions({
    clientZkGroupCipher,
    group,
    ourUuid,
    uuid
  });
  if (addMembersBanned) {
    actions.addMembersBanned = addMembersBanned;
  }
  if (deleteMembersBanned) {
    actions.deleteMembersBanned = deleteMembersBanned;
  }
  return actions;
}
function buildAddPendingAdminApprovalMemberChange({
  group,
  profileKeyCredentialBase64,
  serverPublicParamsBase64
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildAddPendingAdminApprovalMemberChange: group was missing secretParams!");
  }
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(serverPublicParamsBase64);
  const addMemberPendingAdminApproval = new import_protobuf.SignalService.GroupChange.Actions.AddMemberPendingAdminApprovalAction();
  const presentation = (0, import_zkgroup.createProfileKeyCredentialPresentation)(clientZkProfileCipher, profileKeyCredentialBase64, group.secretParams);
  const added = new import_protobuf.SignalService.MemberPendingAdminApproval();
  added.presentation = presentation;
  addMemberPendingAdminApproval.added = added;
  actions.version = (group.revision || 0) + 1;
  actions.addMemberPendingAdminApprovals = [addMemberPendingAdminApproval];
  return actions;
}
function buildAddMember({
  group,
  profileKeyCredentialBase64,
  serverPublicParamsBase64,
  uuid
}) {
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildAddMember: group was missing secretParams!");
  }
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(serverPublicParamsBase64);
  const addMember = new import_protobuf.SignalService.GroupChange.Actions.AddMemberAction();
  const presentation = (0, import_zkgroup.createProfileKeyCredentialPresentation)(clientZkProfileCipher, profileKeyCredentialBase64, group.secretParams);
  const added = new import_protobuf.SignalService.Member();
  added.presentation = presentation;
  added.role = MEMBER_ROLE_ENUM.DEFAULT;
  addMember.added = added;
  actions.version = (group.revision || 0) + 1;
  actions.addMembers = [addMember];
  const doesMemberNeedUnban = group.bannedMembersV2?.find((member) => member.uuid === uuid.toString());
  if (doesMemberNeedUnban) {
    const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
    const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
    const deleteMemberBannedAction = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberBannedAction();
    deleteMemberBannedAction.deletedUserId = uuidCipherTextBuffer;
    actions.deleteMembersBanned = [deleteMemberBannedAction];
  }
  return actions;
}
function buildDeletePendingMemberChange({
  uuids,
  group
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildDeletePendingMemberChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const deletePendingMembers = uuids.map((uuid) => {
    const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
    const deletePendingMember = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberPendingProfileKeyAction();
    deletePendingMember.deletedUserId = uuidCipherTextBuffer;
    return deletePendingMember;
  });
  actions.version = (group.revision || 0) + 1;
  actions.deletePendingMembers = deletePendingMembers;
  return actions;
}
function buildDeleteMemberChange({
  group,
  ourUuid,
  uuid
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildDeleteMemberChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  const deleteMember = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberAction();
  deleteMember.deletedUserId = uuidCipherTextBuffer;
  actions.version = (group.revision || 0) + 1;
  actions.deleteMembers = [deleteMember];
  const { addMembersBanned, deleteMembersBanned } = _maybeBuildAddBannedMemberActions({
    clientZkGroupCipher,
    group,
    ourUuid,
    uuid
  });
  if (addMembersBanned) {
    actions.addMembersBanned = addMembersBanned;
  }
  if (deleteMembersBanned) {
    actions.deleteMembersBanned = deleteMembersBanned;
  }
  return actions;
}
function buildAddBannedMemberChange({
  uuid,
  group
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildAddBannedMemberChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  const addMemberBannedAction = new import_protobuf.SignalService.GroupChange.Actions.AddMemberBannedAction();
  addMemberBannedAction.added = new import_protobuf.SignalService.MemberBanned();
  addMemberBannedAction.added.userId = uuidCipherTextBuffer;
  actions.addMembersBanned = [addMemberBannedAction];
  if (group.pendingAdminApprovalV2?.some((item) => item.uuid === uuid.toString())) {
    const deleteMemberPendingAdminApprovalAction = new import_protobuf.SignalService.GroupChange.Actions.DeleteMemberPendingAdminApprovalAction();
    deleteMemberPendingAdminApprovalAction.deletedUserId = uuidCipherTextBuffer;
    actions.deleteMemberPendingAdminApprovals = [
      deleteMemberPendingAdminApprovalAction
    ];
  }
  actions.version = (group.revision || 0) + 1;
  return actions;
}
function buildModifyMemberRoleChange({
  uuid,
  group,
  role
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildMakeAdminChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  const toggleAdmin = new import_protobuf.SignalService.GroupChange.Actions.ModifyMemberRoleAction();
  toggleAdmin.userId = uuidCipherTextBuffer;
  toggleAdmin.role = role;
  actions.version = (group.revision || 0) + 1;
  actions.modifyMemberRoles = [toggleAdmin];
  return actions;
}
function buildPromotePendingAdminApprovalMemberChange({
  group,
  uuid
}) {
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildAddPendingAdminApprovalMemberChange: group was missing secretParams!");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(group.secretParams);
  const uuidCipherTextBuffer = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
  const promotePendingMember = new import_protobuf.SignalService.GroupChange.Actions.PromoteMemberPendingAdminApprovalAction();
  promotePendingMember.userId = uuidCipherTextBuffer;
  promotePendingMember.role = MEMBER_ROLE_ENUM.DEFAULT;
  actions.version = (group.revision || 0) + 1;
  actions.promoteMemberPendingAdminApprovals = [promotePendingMember];
  return actions;
}
function buildPromoteMemberChange({
  group,
  profileKeyCredentialBase64,
  pniCredentialBase64,
  serverPublicParamsBase64
}) {
  const actions = new import_protobuf.SignalService.GroupChange.Actions();
  if (!group.secretParams) {
    throw new Error("buildDisappearingMessagesTimerChange: group was missing secretParams!");
  }
  actions.version = (group.revision || 0) + 1;
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(serverPublicParamsBase64);
  let presentation;
  if (profileKeyCredentialBase64 !== void 0) {
    presentation = (0, import_zkgroup.createProfileKeyCredentialPresentation)(clientZkProfileCipher, profileKeyCredentialBase64, group.secretParams);
    actions.promotePendingMembers = [
      {
        presentation
      }
    ];
  } else {
    (0, import_assert.strictAssert)(pniCredentialBase64, "Either pniCredential or profileKeyCredential must be present");
    presentation = (0, import_zkgroup.createPNICredentialPresentation)(clientZkProfileCipher, pniCredentialBase64, group.secretParams);
    actions.promoteMembersPendingPniAciProfileKey = [
      {
        presentation
      }
    ];
  }
  return actions;
}
async function uploadGroupChange({
  actions,
  group,
  inviteLinkPassword
}) {
  const logId = idForLogging(group.groupId);
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  if (!group.secretParams) {
    throw new Error("uploadGroupChange: group was missing secretParams!");
  }
  if (!group.publicParams) {
    throw new Error("uploadGroupChange: group was missing publicParams!");
  }
  return makeRequestWithTemporalRetry({
    logId: `uploadGroupChange/${logId}`,
    publicParams: group.publicParams,
    secretParams: group.secretParams,
    request: (sender, options) => sender.modifyGroup(actions, options, inviteLinkPassword)
  });
}
async function modifyGroupV2({
  conversation,
  usingCredentialsFrom,
  createGroupChange,
  extraConversationsForSend,
  inviteLinkPassword,
  name
}) {
  const logId = `${name}/${conversation.idForLogging()}`;
  if (!(0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes)) {
    throw new Error(`modifyGroupV2/${logId}: Called for non-GroupV2 conversation`);
  }
  const startTime = Date.now();
  const timeoutTime = startTime + durations.MINUTE;
  const MAX_ATTEMPTS = 5;
  let refreshedCredentials = false;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    log.info(`modifyGroupV2/${logId}: Starting attempt ${attempt}`);
    try {
      await window.waitForEmptyEventQueue();
      {
        const membersMissingCredentials = usingCredentialsFrom.filter((member) => member.hasProfileKeyCredentialExpired());
        const logIds = membersMissingCredentials.map((member) => member.idForLogging());
        if (logIds.length !== 0) {
          log.info(`modifyGroupV2/${logId}: Fetching profiles for ${logIds}`);
        }
        await Promise.all(membersMissingCredentials.map((member) => member.getProfiles()));
      }
      log.info(`modifyGroupV2/${logId}: Queuing attempt ${attempt}`);
      await conversation.queueJob("modifyGroupV2", async () => {
        log.info(`modifyGroupV2/${logId}: Running attempt ${attempt}`);
        const actions = await createGroupChange();
        if (!actions) {
          log.warn(`modifyGroupV2/${logId}: No change actions. Returning early.`);
          return;
        }
        const currentRevision = conversation.get("revision");
        const newRevision = actions.version;
        if ((currentRevision || 0) + 1 !== newRevision) {
          throw new Error(`modifyGroupV2/${logId}: Revision mismatch - ${currentRevision} to ${newRevision}.`);
        }
        const groupChange = await uploadGroupChange({
          actions,
          inviteLinkPassword,
          group: conversation.attributes
        });
        const groupChangeBuffer = import_protobuf.SignalService.GroupChange.encode(groupChange).finish();
        const groupChangeBase64 = Bytes.toBase64(groupChangeBuffer);
        await window.Signal.Groups.maybeUpdateGroup({
          conversation,
          groupChange: {
            base64: groupChangeBase64,
            isTrusted: true
          },
          newRevision
        });
        const groupV2Info = conversation.getGroupV2Info({
          includePendingMembers: true,
          extraConversationsForSend
        });
        (0, import_assert.strictAssert)(groupV2Info, "missing groupV2Info");
        await import_conversationJobQueue.conversationJobQueue.add({
          type: import_conversationJobQueue.conversationQueueJobEnum.enum.GroupUpdate,
          conversationId: conversation.id,
          groupChangeBase64,
          recipients: groupV2Info.members,
          revision: groupV2Info.revision
        });
      });
      log.info(`modifyGroupV2/${logId}: Update complete, with attempt ${attempt}!`);
      break;
    } catch (error) {
      if (error.code === 409 && Date.now() <= timeoutTime) {
        log.info(`modifyGroupV2/${logId}: Conflict while updating. Trying again...`);
        await conversation.fetchLatestGroupV2Data({ force: true });
      } else if (error.code === 400 && !refreshedCredentials) {
        const logIds = usingCredentialsFrom.map((member) => member.idForLogging());
        if (logIds.length !== 0) {
          log.warn(`modifyGroupV2/${logId}: Profile key credentials were not up-to-date. Updating profiles for ${logIds} and retrying`);
        }
        for (const member of usingCredentialsFrom) {
          member.set({
            profileKeyCredential: null,
            profileKeyCredentialExpiration: null
          });
        }
        await Promise.all(usingCredentialsFrom.map((member) => member.getProfiles()));
        refreshedCredentials = true;
      } else if (error.code === 409) {
        log.error(`modifyGroupV2/${logId}: Conflict while updating. Timed out; not retrying.`);
        conversation.fetchLatestGroupV2Data({ force: true });
        throw error;
      } else {
        const errorString = Errors.toLogFormat(error);
        log.error(`modifyGroupV2/${logId}: Error updating: ${errorString}`);
        throw error;
      }
    }
  }
}
function idForLogging(groupId) {
  return `groupv2(${groupId})`;
}
function deriveGroupFields(masterKey) {
  if (masterKey.length !== MASTER_KEY_LENGTH) {
    throw new Error(`deriveGroupFields: masterKey had length ${masterKey.length}, expected ${MASTER_KEY_LENGTH}`);
  }
  const cacheKey = Bytes.toBase64(masterKey);
  const cached = groupFieldsCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  log.info("deriveGroupFields: cache miss");
  const secretParams = (0, import_zkgroup.deriveGroupSecretParams)(masterKey);
  const publicParams = (0, import_zkgroup.deriveGroupPublicParams)(secretParams);
  const id = (0, import_zkgroup.deriveGroupID)(secretParams);
  const fresh = {
    id,
    secretParams,
    publicParams
  };
  groupFieldsCache.set(cacheKey, fresh);
  return fresh;
}
async function makeRequestWithTemporalRetry({
  logId,
  publicParams,
  secretParams,
  request
}) {
  const groupCredentials = (0, import_groupCredentialFetcher.getCheckedCredentialsForToday)(`makeRequestWithTemporalRetry/${logId}`);
  const sender = window.textsecure.messaging;
  if (!sender) {
    throw new Error(`makeRequestWithTemporalRetry/${logId}: textsecure.messaging is not available!`);
  }
  log.info(`makeRequestWithTemporalRetry/${logId}: starting`);
  const todayOptions = getGroupCredentials({
    authCredentialBase64: groupCredentials.today.credential,
    groupPublicParamsBase64: publicParams,
    groupSecretParamsBase64: secretParams,
    serverPublicParamsBase64: window.getServerPublicParams()
  });
  try {
    return await request(sender, todayOptions);
  } catch (todayError) {
    if (todayError.code === TEMPORAL_AUTH_REJECTED_CODE) {
      log.warn(`makeRequestWithTemporalRetry/${logId}: Trying again with tomorrow's credentials`);
      const tomorrowOptions = getGroupCredentials({
        authCredentialBase64: groupCredentials.tomorrow.credential,
        groupPublicParamsBase64: publicParams,
        groupSecretParamsBase64: secretParams,
        serverPublicParamsBase64: window.getServerPublicParams()
      });
      return request(sender, tomorrowOptions);
    }
    throw todayError;
  }
}
async function fetchMembershipProof({
  publicParams,
  secretParams
}) {
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  if (!publicParams) {
    throw new Error("fetchMembershipProof: group was missing publicParams!");
  }
  if (!secretParams) {
    throw new Error("fetchMembershipProof: group was missing secretParams!");
  }
  const response = await makeRequestWithTemporalRetry({
    logId: "fetchMembershipProof",
    publicParams,
    secretParams,
    request: (sender, options) => sender.getGroupMembershipToken(options)
  });
  return response.token;
}
async function createGroupV2(options) {
  const {
    name,
    avatar,
    expireTimer,
    conversationIds,
    avatars,
    refreshedCredentials = false
  } = options;
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const masterKeyBuffer = (0, import_Crypto.getRandomBytes)(32);
  const fields = deriveGroupFields(masterKeyBuffer);
  const groupId = Bytes.toBase64(fields.id);
  const logId = `groupv2(${groupId})`;
  const masterKey = Bytes.toBase64(masterKeyBuffer);
  const secretParams = Bytes.toBase64(fields.secretParams);
  const publicParams = Bytes.toBase64(fields.publicParams);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  const ourConversation = window.ConversationController.getOurConversationOrThrow();
  if (ourConversation.hasProfileKeyCredentialExpired()) {
    log.info(`createGroupV2/${logId}: fetching our own credentials`);
    await ourConversation.getProfiles();
  }
  const membersV2 = [
    {
      uuid: ourACI,
      role: MEMBER_ROLE_ENUM.ADMINISTRATOR,
      joinedAtVersion: 0
    }
  ];
  const pendingMembersV2 = [];
  let uploadedAvatar;
  await Promise.all([
    ...conversationIds.map(async (conversationId) => {
      const contact = window.ConversationController.get(conversationId);
      if (!contact) {
        (0, import_assert.assert)(false, `createGroupV2/${logId}: missing local contact, skipping`);
        return;
      }
      const contactUuid = contact.get("uuid");
      if (!contactUuid) {
        (0, import_assert.assert)(false, `createGroupV2/${logId}: missing UUID; skipping`);
        return;
      }
      if (contact.hasProfileKeyCredentialExpired()) {
        await contact.getProfiles();
      }
      if (contact.get("profileKey") && contact.get("profileKeyCredential")) {
        membersV2.push({
          uuid: contactUuid,
          role: MEMBER_ROLE_ENUM.DEFAULT,
          joinedAtVersion: 0
        });
      } else {
        pendingMembersV2.push({
          addedByUserId: ourACI,
          uuid: contactUuid,
          timestamp: Date.now(),
          role: MEMBER_ROLE_ENUM.DEFAULT
        });
      }
    }),
    (async () => {
      if (!avatar) {
        return;
      }
      uploadedAvatar = await uploadAvatar({
        data: avatar,
        logId,
        publicParams,
        secretParams
      });
    })()
  ]);
  if (membersV2.length + pendingMembersV2.length > (0, import_limits.getGroupSizeHardLimit)()) {
    throw new Error(`createGroupV2/${logId}: Too many members! Member count: ${membersV2.length}, Pending member count: ${pendingMembersV2.length}`);
  }
  const protoAndConversationAttributes = {
    name,
    revision: 0,
    publicParams,
    secretParams,
    accessControl: {
      attributes: ACCESS_ENUM.MEMBER,
      members: ACCESS_ENUM.MEMBER,
      addFromInviteLink: ACCESS_ENUM.UNSATISFIABLE
    },
    membersV2,
    pendingMembersV2
  };
  const groupProto = await buildGroupProto({
    id: groupId,
    avatarUrl: uploadedAvatar?.key,
    ...protoAndConversationAttributes
  });
  try {
    await makeRequestWithTemporalRetry({
      logId: `createGroupV2/${logId}`,
      publicParams,
      secretParams,
      request: (sender, requestOptions) => sender.createGroup(groupProto, requestOptions)
    });
  } catch (error) {
    if (!(error instanceof import_Errors.HTTPError)) {
      throw error;
    }
    if (error.code !== 400 || refreshedCredentials) {
      throw error;
    }
    const logIds = conversationIds.map((conversationId) => {
      const contact = window.ConversationController.get(conversationId);
      if (!contact) {
        return;
      }
      contact.set({
        profileKeyCredential: null,
        profileKeyCredentialExpiration: null
      });
      return contact.idForLogging();
    });
    log.warn(`createGroupV2/${logId}: Profile key credentials were not up-to-date. Updating profiles for ${logIds} and retrying`);
    return createGroupV2({
      ...options,
      refreshedCredentials: true
    });
  }
  let avatarAttribute;
  if (uploadedAvatar) {
    try {
      avatarAttribute = {
        url: uploadedAvatar.key,
        path: await window.Signal.Migrations.writeNewAttachmentData(uploadedAvatar.data),
        hash: uploadedAvatar.hash
      };
    } catch (err) {
      log.warn(`createGroupV2/${logId}: avatar failed to save to disk. Continuing on`);
    }
  }
  const now = Date.now();
  const conversation = await window.ConversationController.getOrCreateAndWait(groupId, "group", {
    ...protoAndConversationAttributes,
    active_at: now,
    addedBy: ourACI,
    avatar: avatarAttribute,
    avatars,
    groupVersion: 2,
    masterKey,
    profileSharing: true,
    timestamp: now,
    needsStorageServiceSync: true
  });
  await conversation.queueJob("storageServiceUploadJob", async () => {
    await window.Signal.Services.storageServiceUploadJob();
  });
  const timestamp = Date.now();
  const groupV2Info = conversation.getGroupV2Info({
    includePendingMembers: true
  });
  (0, import_assert.strictAssert)(groupV2Info, "missing groupV2Info");
  await import_conversationJobQueue.conversationJobQueue.add({
    type: import_conversationJobQueue.conversationQueueJobEnum.enum.GroupUpdate,
    conversationId: conversation.id,
    recipients: groupV2Info.members,
    revision: groupV2Info.revision
  });
  const createdTheGroupMessage = {
    ...generateBasicMessage(),
    type: "group-v2-change",
    sourceUuid: ourACI,
    conversationId: conversation.id,
    readStatus: import_MessageReadStatus.ReadStatus.Read,
    received_at: window.Signal.Util.incrementMessageCounter(),
    received_at_ms: timestamp,
    timestamp,
    seenStatus: import_MessageSeenStatus.SeenStatus.Seen,
    sent_at: timestamp,
    groupV2Change: {
      from: ourACI,
      details: [{ type: "create" }]
    }
  };
  await import_Client.default.saveMessages([createdTheGroupMessage], {
    forceSave: true,
    ourUuid: ourACI
  });
  const model = new window.Whisper.Message(createdTheGroupMessage);
  window.MessageController.register(model.id, model);
  conversation.trigger("newmessage", model);
  if (expireTimer) {
    await conversation.updateExpirationTimer(expireTimer, {
      reason: "createGroupV2"
    });
  }
  return conversation;
}
async function hasV1GroupBeenMigrated(conversation) {
  const logId = conversation.idForLogging();
  const isGroupV1 = (0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes);
  if (!isGroupV1) {
    log.warn(`checkForGV2Existence/${logId}: Called for non-GroupV1 conversation!`);
    return false;
  }
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  const groupId = conversation.get("groupId");
  if (!groupId) {
    throw new Error(`checkForGV2Existence/${logId}: No groupId!`);
  }
  const idBuffer = Bytes.fromBinary(groupId);
  const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(idBuffer);
  const fields = deriveGroupFields(masterKeyBuffer);
  try {
    await makeRequestWithTemporalRetry({
      logId: `getGroup/${logId}`,
      publicParams: Bytes.toBase64(fields.publicParams),
      secretParams: Bytes.toBase64(fields.secretParams),
      request: (sender, options) => sender.getGroup(options)
    });
    return true;
  } catch (error) {
    const { code } = error;
    return code !== GROUP_NONEXISTENT_CODE;
  }
}
function maybeDeriveGroupV2Id(conversation) {
  const isGroupV1 = (0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes);
  const groupV1Id = conversation.get("groupId");
  const derived = conversation.get("derivedGroupV2Id");
  if (!isGroupV1 || !groupV1Id || derived) {
    return false;
  }
  const v1IdBuffer = Bytes.fromBinary(groupV1Id);
  const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(v1IdBuffer);
  const fields = deriveGroupFields(masterKeyBuffer);
  const derivedGroupV2Id = Bytes.toBase64(fields.id);
  conversation.set({
    derivedGroupV2Id
  });
  return true;
}
async function isGroupEligibleToMigrate(conversation) {
  if (!(0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
    return false;
  }
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const areWeMember = !conversation.get("left") && conversation.hasMember(ourACI);
  if (!areWeMember) {
    return false;
  }
  const members = conversation.get("members") || [];
  for (let i = 0, max = members.length; i < max; i += 1) {
    const identifier = members[i];
    const contact = window.ConversationController.get(identifier);
    if (!contact) {
      return false;
    }
    if (!contact.get("uuid")) {
      return false;
    }
  }
  return true;
}
async function getGroupMigrationMembers(conversation) {
  const logId = conversation.idForLogging();
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const ourConversationId = window.ConversationController.getOurConversationId();
  if (!ourConversationId) {
    throw new Error(`getGroupMigrationMembers/${logId}: Couldn't fetch our own conversationId!`);
  }
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  let areWeMember = false;
  let areWeInvited = false;
  const previousGroupV1Members = conversation.get("members") || [];
  const now = Date.now();
  const memberLookup = {};
  const membersV2 = (0, import_lodash.compact)(await Promise.all(previousGroupV1Members.map(async (e164) => {
    const contact = window.ConversationController.get(e164);
    if (!contact) {
      throw new Error(`getGroupMigrationMembers/${logId}: membersV2 - missing local contact for ${e164}, skipping.`);
    }
    if (!(0, import_whatTypeOfConversation.isMe)(contact.attributes) && window.GV2_MIGRATION_DISABLE_ADD) {
      log.warn(`getGroupMigrationMembers/${logId}: membersV2 - skipping ${e164} due to GV2_MIGRATION_DISABLE_ADD flag`);
      return null;
    }
    const contactUuid = contact.get("uuid");
    if (!contactUuid) {
      log.warn(`getGroupMigrationMembers/${logId}: membersV2 - missing uuid for ${e164}, skipping.`);
      return null;
    }
    if (!contact.get("profileKey")) {
      log.warn(`getGroupMigrationMembers/${logId}: membersV2 - missing profileKey for member ${e164}, skipping.`);
      return null;
    }
    let capabilities = contact.get("capabilities");
    if (!capabilities?.["gv1-migration"] || !contact.get("profileKeyCredential")) {
      await contact.getProfiles();
    }
    capabilities = contact.get("capabilities");
    if (!capabilities?.["gv1-migration"]) {
      log.warn(`getGroupMigrationMembers/${logId}: membersV2 - member ${e164} is missing gv1-migration capability, skipping.`);
      return null;
    }
    if (!contact.get("profileKeyCredential")) {
      log.warn(`getGroupMigrationMembers/${logId}: membersV2 - no profileKeyCredential for ${e164}, skipping.`);
      return null;
    }
    const conversationId = contact.id;
    if (conversationId === ourConversationId) {
      areWeMember = true;
    }
    memberLookup[conversationId] = true;
    return {
      uuid: contactUuid,
      role: MEMBER_ROLE_ENUM.ADMINISTRATOR,
      joinedAtVersion: 0
    };
  })));
  const droppedGV2MemberIds = [];
  const pendingMembersV2 = (0, import_lodash.compact)((previousGroupV1Members || []).map((e164) => {
    const contact = window.ConversationController.get(e164);
    if (!contact) {
      throw new Error(`getGroupMigrationMembers/${logId}: pendingMembersV2 - missing local contact for ${e164}, skipping.`);
    }
    const conversationId = contact.id;
    if (memberLookup[conversationId]) {
      return null;
    }
    if (!(0, import_whatTypeOfConversation.isMe)(contact.attributes) && window.GV2_MIGRATION_DISABLE_INVITE) {
      log.warn(`getGroupMigrationMembers/${logId}: pendingMembersV2 - skipping ${e164} due to GV2_MIGRATION_DISABLE_INVITE flag`);
      droppedGV2MemberIds.push(conversationId);
      return null;
    }
    const contactUuid = contact.get("uuid");
    if (!contactUuid) {
      log.warn(`getGroupMigrationMembers/${logId}: pendingMembersV2 - missing uuid for ${e164}, skipping.`);
      droppedGV2MemberIds.push(conversationId);
      return null;
    }
    const capabilities = contact.get("capabilities");
    if (!capabilities?.["gv1-migration"]) {
      log.warn(`getGroupMigrationMembers/${logId}: pendingMembersV2 - member ${e164} is missing gv1-migration capability, skipping.`);
      droppedGV2MemberIds.push(conversationId);
      return null;
    }
    if (conversationId === ourConversationId) {
      areWeInvited = true;
    }
    return {
      uuid: contactUuid,
      timestamp: now,
      addedByUserId: ourACI,
      role: MEMBER_ROLE_ENUM.ADMINISTRATOR
    };
  }));
  if (!areWeMember) {
    throw new Error(`getGroupMigrationMembers/${logId}: We are not a member!`);
  }
  if (areWeInvited) {
    throw new Error(`getGroupMigrationMembers/${logId}: We are invited!`);
  }
  return {
    droppedGV2MemberIds,
    membersV2,
    pendingMembersV2,
    previousGroupV1Members
  };
}
async function initiateMigrationToGroupV2(conversation) {
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  try {
    await conversation.queueJob("initiateMigrationToGroupV2", async () => {
      const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
      const isEligible = isGroupEligibleToMigrate(conversation);
      const previousGroupV1Id = conversation.get("groupId");
      if (!isEligible || !previousGroupV1Id) {
        throw new Error(`initiateMigrationToGroupV2: conversation is not eligible to migrate! ${conversation.idForLogging()}`);
      }
      const groupV1IdBuffer = Bytes.fromBinary(previousGroupV1Id);
      const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(groupV1IdBuffer);
      const fields = deriveGroupFields(masterKeyBuffer);
      const groupId = Bytes.toBase64(fields.id);
      const logId = `groupv2(${groupId})`;
      log.info(`initiateMigrationToGroupV2/${logId}: Migrating from ${conversation.idForLogging()}`);
      const masterKey = Bytes.toBase64(masterKeyBuffer);
      const secretParams = Bytes.toBase64(fields.secretParams);
      const publicParams = Bytes.toBase64(fields.publicParams);
      const ourConversationId = window.ConversationController.getOurConversationId();
      if (!ourConversationId) {
        throw new Error(`initiateMigrationToGroupV2/${logId}: Couldn't fetch our own conversationId!`);
      }
      const ourConversation = window.ConversationController.get(ourConversationId);
      if (!ourConversation) {
        throw new Error(`initiateMigrationToGroupV2/${logId}: cannot get our own conversation. Cannot migrate`);
      }
      const {
        membersV2,
        pendingMembersV2,
        droppedGV2MemberIds,
        previousGroupV1Members
      } = await getGroupMigrationMembers(conversation);
      if (membersV2.length + pendingMembersV2.length > (0, import_limits.getGroupSizeHardLimit)()) {
        throw new Error(`initiateMigrationToGroupV2/${logId}: Too many members! Member count: ${membersV2.length}, Pending member count: ${pendingMembersV2.length}`);
      }
      let avatarAttribute;
      const avatarPath = conversation.attributes.avatar?.path;
      if (avatarPath) {
        const { hash, key } = await uploadAvatar({
          logId,
          publicParams,
          secretParams,
          path: avatarPath
        });
        avatarAttribute = {
          url: key,
          path: avatarPath,
          hash
        };
      }
      const newAttributes = {
        ...conversation.attributes,
        avatar: avatarAttribute,
        revision: 0,
        groupId,
        groupVersion: 2,
        masterKey,
        publicParams,
        secretParams,
        accessControl: {
          attributes: ACCESS_ENUM.MEMBER,
          members: ACCESS_ENUM.MEMBER,
          addFromInviteLink: ACCESS_ENUM.UNSATISFIABLE
        },
        membersV2,
        pendingMembersV2,
        previousGroupV1Id,
        previousGroupV1Members,
        storageID: void 0,
        derivedGroupV2Id: void 0,
        members: void 0
      };
      const groupProto = buildGroupProto({
        ...newAttributes,
        avatarUrl: avatarAttribute?.url
      });
      try {
        await makeRequestWithTemporalRetry({
          logId: `createGroup/${logId}`,
          publicParams,
          secretParams,
          request: (sender, options) => sender.createGroup(groupProto, options)
        });
      } catch (error) {
        log.error(`initiateMigrationToGroupV2/${logId}: Error creating group:`, error.stack);
        throw error;
      }
      const groupChangeMessages = [];
      groupChangeMessages.push({
        ...generateBasicMessage(),
        type: "group-v1-migration",
        invitedGV2Members: pendingMembersV2,
        droppedGV2MemberIds,
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Seen
      });
      await updateGroup({
        conversation,
        updates: {
          newAttributes,
          groupChangeMessages,
          members: []
        }
      });
      if (window.storage.blocked.isGroupBlocked(previousGroupV1Id)) {
        window.storage.blocked.addBlockedGroup(groupId);
      }
      updateConversation(conversation.attributes);
    });
  } catch (error) {
    const logId = conversation.idForLogging();
    if (!(0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
      throw error;
    }
    const alreadyMigrated = await hasV1GroupBeenMigrated(conversation);
    if (!alreadyMigrated) {
      log.error(`initiateMigrationToGroupV2/${logId}: Group has not already been migrated, re-throwing error`);
      throw error;
    }
    await respondToGroupV2Migration({
      conversation
    });
    return;
  }
  const groupV2Info = conversation.getGroupV2Info({
    includePendingMembers: true
  });
  (0, import_assert.strictAssert)(groupV2Info, "missing groupV2Info");
  await import_conversationJobQueue.conversationJobQueue.add({
    type: import_conversationJobQueue.conversationQueueJobEnum.enum.GroupUpdate,
    conversationId: conversation.id,
    recipients: groupV2Info.members,
    revision: groupV2Info.revision
  });
}
async function waitThenRespondToGroupV2Migration(options) {
  await window.waitForEmptyEventQueue();
  const { conversation } = options;
  await conversation.queueJob("waitThenRespondToGroupV2Migration", async () => {
    try {
      await respondToGroupV2Migration(options);
    } catch (error) {
      log.error(`waitThenRespondToGroupV2Migration/${conversation.idForLogging()}: respondToGroupV2Migration failure:`, error && error.stack ? error.stack : error);
    }
  });
}
function buildMigrationBubble(previousGroupV1MembersIds, newAttributes) {
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourPNI = window.storage.user.getUuid(import_UUID.UUIDKind.PNI);
  const ourConversationId = window.ConversationController.getOurConversationId();
  const combinedConversationIds = [
    ...(newAttributes.membersV2 || []).map((item) => item.uuid),
    ...(newAttributes.pendingMembersV2 || []).map((item) => item.uuid)
  ].map((uuid) => {
    const conversation = window.ConversationController.lookupOrCreate({
      uuid
    });
    (0, import_assert.strictAssert)(conversation, `Conversation not found for ${uuid}`);
    return conversation.id;
  });
  const droppedMemberIds = (0, import_lodash.difference)(previousGroupV1MembersIds, combinedConversationIds).filter((id) => id && id !== ourConversationId);
  const invitedMembers = (newAttributes.pendingMembersV2 || []).filter((item) => item.uuid !== ourACI.toString() && !(ourPNI && item.uuid === ourPNI.toString()));
  const areWeInvited = (newAttributes.pendingMembersV2 || []).some((item) => item.uuid === ourACI.toString() || ourPNI && item.uuid === ourPNI.toString());
  return {
    ...generateBasicMessage(),
    type: "group-v1-migration",
    groupMigration: {
      areWeInvited,
      invitedMembers,
      droppedMemberIds
    }
  };
}
function getBasicMigrationBubble() {
  return {
    ...generateBasicMessage(),
    type: "group-v1-migration",
    groupMigration: {
      areWeInvited: false,
      invitedMembers: [],
      droppedMemberIds: []
    }
  };
}
async function joinGroupV2ViaLinkAndMigrate({
  approvalRequired,
  conversation,
  inviteLinkPassword,
  revision
}) {
  const isGroupV1 = (0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes);
  const previousGroupV1Id = conversation.get("groupId");
  if (!isGroupV1 || !previousGroupV1Id) {
    throw new Error(`joinGroupV2ViaLinkAndMigrate: Conversation is not GroupV1! ${conversation.idForLogging()}`);
  }
  const groupV1IdBuffer = Bytes.fromBinary(previousGroupV1Id);
  const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(groupV1IdBuffer);
  const fields = deriveGroupFields(masterKeyBuffer);
  const groupId = Bytes.toBase64(fields.id);
  const logId = idForLogging(groupId);
  log.info(`joinGroupV2ViaLinkAndMigrate/${logId}: Migrating from ${conversation.idForLogging()}`);
  const masterKey = Bytes.toBase64(masterKeyBuffer);
  const secretParams = Bytes.toBase64(fields.secretParams);
  const publicParams = Bytes.toBase64(fields.publicParams);
  const newAttributes = {
    ...conversation.attributes,
    revision,
    groupId,
    groupVersion: 2,
    masterKey,
    publicParams,
    secretParams,
    groupInviteLinkPassword: inviteLinkPassword,
    addedBy: void 0,
    left: true,
    previousGroupV1Id: conversation.get("groupId"),
    previousGroupV1Members: conversation.get("members"),
    storageID: void 0,
    derivedGroupV2Id: void 0,
    members: void 0
  };
  const groupChangeMessages = [
    {
      ...generateBasicMessage(),
      type: "group-v1-migration",
      groupMigration: {
        areWeInvited: false,
        invitedMembers: [],
        droppedMemberIds: []
      }
    }
  ];
  await updateGroup({
    conversation,
    updates: {
      newAttributes,
      groupChangeMessages,
      members: []
    }
  });
  await conversation.joinGroupV2ViaLink({
    inviteLinkPassword,
    approvalRequired
  });
}
async function respondToGroupV2Migration({
  conversation,
  groupChange,
  newRevision,
  receivedAt,
  sentAt
}) {
  await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
  const isGroupV1 = (0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes);
  const previousGroupV1Id = conversation.get("groupId");
  if (!isGroupV1 || !previousGroupV1Id) {
    throw new Error(`respondToGroupV2Migration: Conversation is not GroupV1! ${conversation.idForLogging()}`);
  }
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const wereWePreviouslyAMember = conversation.hasMember(ourACI);
  const groupV1IdBuffer = Bytes.fromBinary(previousGroupV1Id);
  const masterKeyBuffer = (0, import_Crypto.deriveMasterKeyFromGroupV1)(groupV1IdBuffer);
  const fields = deriveGroupFields(masterKeyBuffer);
  const groupId = Bytes.toBase64(fields.id);
  const logId = idForLogging(groupId);
  log.info(`respondToGroupV2Migration/${logId}: Migrating from ${conversation.idForLogging()}`);
  const masterKey = Bytes.toBase64(masterKeyBuffer);
  const secretParams = Bytes.toBase64(fields.secretParams);
  const publicParams = Bytes.toBase64(fields.publicParams);
  const previousGroupV1Members = conversation.get("members");
  const previousGroupV1MembersIds = conversation.getMemberIds();
  const attributes = {
    ...conversation.attributes,
    revision: 0,
    groupId,
    groupVersion: 2,
    masterKey,
    publicParams,
    secretParams,
    previousGroupV1Id,
    previousGroupV1Members,
    storageID: void 0,
    derivedGroupV2Id: void 0,
    members: void 0
  };
  let firstGroupState;
  try {
    const response = await makeRequestWithTemporalRetry({
      logId: `getGroupLog/${logId}`,
      publicParams,
      secretParams,
      request: (sender, options) => sender.getGroupLog({
        startVersion: 0,
        includeFirstState: true,
        includeLastState: false,
        maxSupportedChangeEpoch: SUPPORTED_CHANGE_EPOCH
      }, options)
    });
    firstGroupState = response?.changes?.groupChanges?.[0]?.groupState;
  } catch (error) {
    if (error.code === GROUP_ACCESS_DENIED_CODE) {
      log.info(`respondToGroupV2Migration/${logId}: Failed to access log endpoint; fetching full group state`);
      try {
        firstGroupState = await makeRequestWithTemporalRetry({
          logId: `getGroup/${logId}`,
          publicParams,
          secretParams,
          request: (sender, options) => sender.getGroup(options)
        });
      } catch (secondError) {
        if (secondError.code === GROUP_ACCESS_DENIED_CODE) {
          log.info(`respondToGroupV2Migration/${logId}: Failed to access state endpoint; user is no longer part of group`);
          if (window.storage.blocked.isGroupBlocked(previousGroupV1Id)) {
            window.storage.blocked.addBlockedGroup(groupId);
          }
          if (wereWePreviouslyAMember) {
            log.info(`respondToGroupV2Migration/${logId}: Upgrading group with migration/removed events`);
            const ourNumber = window.textsecure.storage.user.getNumber();
            await updateGroup({
              conversation,
              receivedAt,
              sentAt,
              updates: {
                newAttributes: {
                  ...attributes,
                  addedBy: void 0,
                  left: true,
                  members: (conversation.get("members") || []).filter((item) => item !== ourACI.toString() && item !== ourNumber)
                },
                groupChangeMessages: [
                  {
                    ...getBasicMigrationBubble(),
                    readStatus: import_MessageReadStatus.ReadStatus.Read,
                    seenStatus: import_MessageSeenStatus.SeenStatus.Seen
                  },
                  {
                    ...generateBasicMessage(),
                    type: "group-v2-change",
                    groupV2Change: {
                      details: [
                        {
                          type: "member-remove",
                          uuid: ourACI.toString()
                        }
                      ]
                    },
                    readStatus: import_MessageReadStatus.ReadStatus.Read,
                    seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
                  }
                ],
                members: []
              }
            });
            return;
          }
          log.info(`respondToGroupV2Migration/${logId}: Upgrading group with migration event; no removed event`);
          await updateGroup({
            conversation,
            receivedAt,
            sentAt,
            updates: {
              newAttributes: attributes,
              groupChangeMessages: [
                {
                  ...getBasicMigrationBubble(),
                  readStatus: import_MessageReadStatus.ReadStatus.Read,
                  seenStatus: import_MessageSeenStatus.SeenStatus.Seen
                }
              ],
              members: []
            }
          });
          return;
        }
        throw secondError;
      }
    } else {
      throw error;
    }
  }
  if (!firstGroupState) {
    throw new Error(`respondToGroupV2Migration/${logId}: Couldn't get a first group state!`);
  }
  const groupState = decryptGroupState(firstGroupState, attributes.secretParams, logId);
  const { newAttributes, newProfileKeys } = await applyGroupState({
    group: attributes,
    groupState
  });
  const groupChangeMessages = [];
  groupChangeMessages.push({
    ...buildMigrationBubble(previousGroupV1MembersIds, newAttributes),
    readStatus: import_MessageReadStatus.ReadStatus.Read,
    seenStatus: import_MessageSeenStatus.SeenStatus.Seen
  });
  const areWeInvited = (newAttributes.pendingMembersV2 || []).some((item) => item.uuid === ourACI.toString());
  const areWeMember = (newAttributes.membersV2 || []).some((item) => item.uuid === ourACI.toString());
  if (!areWeInvited && !areWeMember) {
    groupChangeMessages.push({
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        details: [
          {
            type: "member-remove",
            uuid: ourACI.toString()
          }
        ]
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
    });
  }
  const SORT_BUFFER = 1e3;
  await updateGroup({
    conversation,
    receivedAt,
    sentAt: sentAt ? sentAt - SORT_BUFFER : void 0,
    updates: {
      newAttributes,
      groupChangeMessages,
      members: profileKeysToMembers(newProfileKeys)
    }
  });
  if (window.storage.blocked.isGroupBlocked(previousGroupV1Id)) {
    window.storage.blocked.addBlockedGroup(groupId);
  }
  updateConversation(conversation.attributes);
  await maybeUpdateGroup({
    conversation,
    groupChange,
    newRevision,
    receivedAt,
    sentAt
  });
}
const FIVE_MINUTES = 5 * durations.MINUTE;
async function waitThenMaybeUpdateGroup(options, { viaFirstStorageSync = false } = {}) {
  const { conversation } = options;
  if (conversation.isBlocked()) {
    log.info(`waitThenMaybeUpdateGroup: Group ${conversation.idForLogging()} is blocked, returning early`);
    return;
  }
  await window.waitForEmptyEventQueue();
  const { lastSuccessfulGroupFetch = 0 } = conversation;
  if (!options.force && (0, import_timestamp.isMoreRecentThan)(lastSuccessfulGroupFetch, FIVE_MINUTES)) {
    const waitTime = lastSuccessfulGroupFetch + FIVE_MINUTES - Date.now();
    log.info(`waitThenMaybeUpdateGroup/${conversation.idForLogging()}: group update was fetched recently, skipping for ${waitTime}ms`);
    return;
  }
  await conversation.queueJob("waitThenMaybeUpdateGroup", async () => {
    try {
      await maybeUpdateGroup(options, { viaFirstStorageSync });
      conversation.lastSuccessfulGroupFetch = Date.now();
    } catch (error) {
      log.error(`waitThenMaybeUpdateGroup/${conversation.idForLogging()}: maybeUpdateGroup failure:`, error && error.stack ? error.stack : error);
    }
  });
}
async function maybeUpdateGroup({
  conversation,
  dropInitialJoinMessage,
  groupChange,
  newRevision,
  receivedAt,
  sentAt
}, { viaFirstStorageSync = false } = {}) {
  const logId = conversation.idForLogging();
  try {
    await (0, import_groupCredentialFetcher.maybeFetchNewCredentials)();
    const updates = await getGroupUpdates({
      group: conversation.attributes,
      serverPublicParamsBase64: window.getServerPublicParams(),
      newRevision,
      groupChange,
      dropInitialJoinMessage
    });
    await updateGroup({ conversation, receivedAt, sentAt, updates }, { viaFirstStorageSync });
  } catch (error) {
    log.error(`maybeUpdateGroup/${logId}: Failed to update group:`, error && error.stack ? error.stack : error);
    throw error;
  }
}
async function updateGroup({
  conversation,
  receivedAt,
  sentAt,
  updates
}, { viaFirstStorageSync = false } = {}) {
  const logId = conversation.idForLogging();
  const { newAttributes, groupChangeMessages, members } = updates;
  const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
  const startingRevision = conversation.get("revision");
  const endingRevision = newAttributes.revision;
  const wasMemberOrPending = conversation.hasMember(ourACI) || conversation.isMemberPending(ourACI) || ourPNI && conversation.isMemberPending(ourPNI);
  const isMemberOrPending = !newAttributes.left || newAttributes.pendingMembersV2?.some((item) => item.uuid === ourACI.toString() || item.uuid === ourPNI?.toString());
  const isMemberOrPendingOrAwaitingApproval = isMemberOrPending || newAttributes.pendingAdminApprovalV2?.some((item) => item.uuid === ourACI.toString());
  const isInitialDataFetch = !(0, import_lodash.isNumber)(startingRevision) && (0, import_lodash.isNumber)(endingRevision);
  const finalReceivedAt = receivedAt || window.Signal.Util.incrementMessageCounter();
  const initialSentAt = sentAt || Date.now();
  const previousId = conversation.get("groupId");
  const idChanged = previousId && previousId !== newAttributes.groupId;
  let activeAt = conversation.get("active_at") || null;
  if (!viaFirstStorageSync && isMemberOrPendingOrAwaitingApproval && isInitialDataFetch && newAttributes.name) {
    activeAt = initialSentAt;
  }
  let syntheticSentAt = initialSentAt - (groupChangeMessages.length + 1);
  const timestamp = Date.now();
  const changeMessagesToSave = groupChangeMessages.map((changeMessage) => {
    syntheticSentAt += 1;
    return {
      ...changeMessage,
      conversationId: conversation.id,
      received_at: finalReceivedAt,
      received_at_ms: syntheticSentAt,
      sent_at: syntheticSentAt,
      timestamp
    };
  });
  const contactsWithoutProfileKey = new Array();
  members.forEach((member) => {
    const contact = window.ConversationController.getOrCreate(member.uuid, "private");
    if (!(0, import_whatTypeOfConversation.isMe)(contact.attributes) && member.profileKey && member.profileKey.length > 0 && contact.get("profileKey") !== member.profileKey) {
      contactsWithoutProfileKey.push(contact);
      contact.setProfileKey(member.profileKey);
    }
  });
  let profileFetches;
  if (contactsWithoutProfileKey.length !== 0) {
    log.info(`updateGroup/${logId}: fetching ${contactsWithoutProfileKey.length} missing profiles`);
    profileFetches = Promise.all(contactsWithoutProfileKey.map((contact) => contact.getProfiles()));
  }
  if (changeMessagesToSave.length > 0) {
    try {
      await profileFetches;
    } catch (error) {
      log.error(`updateGroup/${logId}: failed to fetch missing profiles`, Errors.toLogFormat(error));
    }
    await appendChangeMessages(conversation, changeMessagesToSave);
  }
  conversation.set({
    ...newAttributes,
    active_at: activeAt,
    temporaryMemberCount: !newAttributes.left ? void 0 : newAttributes.temporaryMemberCount
  });
  if (idChanged) {
    conversation.trigger("idUpdated", conversation, "groupId", previousId);
  }
  await updateConversation(conversation.attributes);
  const justAdded = !wasMemberOrPending && isMemberOrPending;
  const addedBy = newAttributes.pendingMembersV2?.find((item) => item.uuid === ourACI.toString() || item.uuid === ourPNI?.toString())?.addedByUserId || newAttributes.addedBy;
  if (justAdded && addedBy) {
    const adder = window.ConversationController.get(addedBy);
    if (adder && adder.isBlocked()) {
      log.warn(`updateGroup/${logId}: Added to group by blocked user ${adder.idForLogging()}. Scheduling group leave.`);
      const waitThenLeave = /* @__PURE__ */ __name(async () => {
        log.warn(`waitThenLeave/${logId}: Waiting for empty event queue.`);
        await window.waitForEmptyEventQueue();
        log.warn(`waitThenLeave/${logId}: Empty event queue, starting group leave.`);
        await conversation.leaveGroupV2();
        log.warn(`waitThenLeave/${logId}: Leave complete.`);
      }, "waitThenLeave");
      waitThenLeave();
    }
  }
}
function _mergeGroupChangeMessages(first, second) {
  if (!first) {
    return void 0;
  }
  if (first.type !== "group-v2-change" || second.type !== first.type) {
    return void 0;
  }
  const { groupV2Change: firstChange } = first;
  const { groupV2Change: secondChange } = second;
  if (!firstChange || !secondChange) {
    return void 0;
  }
  if (firstChange.details.length !== 1 && secondChange.details.length !== 1) {
    return void 0;
  }
  const [firstDetail] = firstChange.details;
  const [secondDetail] = secondChange.details;
  let isApprovalPending;
  if (secondDetail.type === "admin-approval-add-one") {
    isApprovalPending = true;
  } else if (secondDetail.type === "admin-approval-remove-one") {
    isApprovalPending = false;
  } else {
    return void 0;
  }
  const { uuid } = secondDetail;
  (0, import_assert.strictAssert)(uuid, "admin approval message should have uuid");
  let updatedDetail;
  if (!isApprovalPending && firstDetail.type === "admin-approval-add-one" && firstDetail.uuid === uuid) {
    updatedDetail = {
      type: "admin-approval-bounce",
      uuid,
      times: 1,
      isApprovalPending
    };
  } else if (firstDetail.type === "admin-approval-bounce" && firstDetail.uuid === uuid && firstDetail.isApprovalPending === !isApprovalPending) {
    updatedDetail = {
      type: "admin-approval-bounce",
      uuid,
      times: firstDetail.times + (isApprovalPending ? 0 : 1),
      isApprovalPending
    };
  } else {
    return void 0;
  }
  return {
    ...first,
    groupV2Change: {
      ...first.groupV2Change,
      details: [updatedDetail]
    }
  };
}
function _isGroupChangeMessageBounceable(message) {
  if (message.type !== "group-v2-change") {
    return false;
  }
  const { groupV2Change } = message;
  if (!groupV2Change) {
    return false;
  }
  if (groupV2Change.details.length !== 1) {
    return false;
  }
  const [first] = groupV2Change.details;
  if (first.type === "admin-approval-add-one" || first.type === "admin-approval-bounce") {
    return true;
  }
  return false;
}
async function appendChangeMessages(conversation, messages) {
  const logId = conversation.idForLogging();
  log.info(`appendChangeMessages/${logId}: processing ${messages.length} messages`);
  const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  let lastMessage = await import_Client.default.getLastConversationMessage({
    conversationId: conversation.id
  });
  if (lastMessage && !_isGroupChangeMessageBounceable(lastMessage)) {
    lastMessage = void 0;
  }
  const mergedMessages = [];
  let previousMessage = lastMessage;
  for (const message of messages) {
    const merged = _mergeGroupChangeMessages(previousMessage, message);
    if (!merged) {
      if (previousMessage && previousMessage !== lastMessage) {
        mergedMessages.push(previousMessage);
      }
      previousMessage = message;
      continue;
    }
    previousMessage = merged;
    log.info(`appendChangeMessages/${logId}: merged ${message.id} into ${merged.id}`);
  }
  if (previousMessage && previousMessage !== lastMessage) {
    mergedMessages.push(previousMessage);
  }
  if (lastMessage && mergedMessages[0]?.id === lastMessage?.id) {
    const [first, ...rest] = mergedMessages;
    (0, import_assert.strictAssert)(first !== void 0, "First message must be there");
    log.info(`appendChangeMessages/${logId}: updating ${first.id}`);
    await import_Client.default.saveMessage(first, {
      ourUuid: ourACI.toString()
    });
    log.info(`appendChangeMessages/${logId}: saving ${rest.length} new messages`);
    await import_Client.default.saveMessages(rest, {
      ourUuid: ourACI.toString(),
      forceSave: true
    });
  } else {
    log.info(`appendChangeMessages/${logId}: saving ${mergedMessages.length} new messages`);
    await import_Client.default.saveMessages(mergedMessages, {
      ourUuid: ourACI.toString(),
      forceSave: true
    });
  }
  let newMessages = 0;
  for (const changeMessage of mergedMessages) {
    const existing = window.MessageController.getById(changeMessage.id);
    if (existing) {
      (0, import_assert.strictAssert)(changeMessage.id === lastMessage?.id, "Should only update group change that was already in the database");
      existing.set(changeMessage);
      continue;
    }
    const model = new window.Whisper.Message(changeMessage);
    window.MessageController.register(model.id, model);
    conversation.trigger("newmessage", model);
    newMessages += 1;
  }
  if (!newMessages && mergedMessages.length > 0) {
    await conversation.updateLastMessage();
    conversation.updateUnread();
  }
}
async function getGroupUpdates({
  dropInitialJoinMessage,
  group,
  serverPublicParamsBase64,
  newRevision,
  groupChange: wrappedGroupChange
}) {
  const logId = idForLogging(group.groupId);
  log.info(`getGroupUpdates/${logId}: Starting...`);
  const currentRevision = group.revision;
  const isFirstFetch = !(0, import_lodash.isNumber)(group.revision);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const isInitialCreationMessage = isFirstFetch && newRevision === 0;
  const weAreAwaitingApproval = (group.pendingAdminApprovalV2 || []).find((item) => item.uuid === ourACI.toString());
  const isOneVersionUp = (0, import_lodash.isNumber)(currentRevision) && (0, import_lodash.isNumber)(newRevision) && newRevision === currentRevision + 1;
  if (window.GV2_ENABLE_SINGLE_CHANGE_PROCESSING && wrappedGroupChange && (0, import_lodash.isNumber)(newRevision) && (isInitialCreationMessage || weAreAwaitingApproval || isOneVersionUp)) {
    log.info(`getGroupUpdates/${logId}: Processing just one change`);
    const groupChangeBuffer = Bytes.fromBase64(wrappedGroupChange.base64);
    const groupChange = import_protobuf.SignalService.GroupChange.decode(groupChangeBuffer);
    const isChangeSupported = !(0, import_lodash.isNumber)(groupChange.changeEpoch) || groupChange.changeEpoch <= SUPPORTED_CHANGE_EPOCH;
    if (isChangeSupported) {
      if (!wrappedGroupChange.isTrusted) {
        (0, import_assert.strictAssert)(groupChange.serverSignature && groupChange.actions, "Server signature must be present in untrusted group change");
        try {
          (0, import_zkgroup.verifyNotarySignature)(serverPublicParamsBase64, groupChange.actions, groupChange.serverSignature);
        } catch (error) {
          log.warn(`getGroupUpdates/${logId}: verifyNotarySignature failed, dropping the message`, Errors.toLogFormat(error));
          return {
            newAttributes: group,
            groupChangeMessages: [],
            members: []
          };
        }
      }
      return updateGroupViaSingleChange({
        group,
        newRevision,
        groupChange
      });
    }
    log.info(`getGroupUpdates/${logId}: Failing over; group change unsupported`);
  }
  if ((!isFirstFetch || (0, import_lodash.isNumber)(newRevision)) && window.GV2_ENABLE_CHANGE_PROCESSING) {
    try {
      return await updateGroupViaLogs({
        group,
        newRevision
      });
    } catch (error) {
      const nextStep = isFirstFetch ? `fetching logs since ${newRevision}` : "fetching full state";
      if (error.code === TEMPORAL_AUTH_REJECTED_CODE) {
        log.info(`getGroupUpdates/${logId}: Temporal credential failure, now ${nextStep}`);
      } else if (error.code === GROUP_ACCESS_DENIED_CODE) {
        log.info(`getGroupUpdates/${logId}: Log access denied, now ${nextStep}`);
      } else {
        throw error;
      }
    }
  }
  if (window.GV2_ENABLE_STATE_PROCESSING) {
    try {
      return await updateGroupViaState({
        dropInitialJoinMessage,
        group
      });
    } catch (error) {
      if (error.code === TEMPORAL_AUTH_REJECTED_CODE) {
        log.info(`getGroupUpdates/${logId}: Temporal credential failure. Failing; we don't know if we have access or not.`);
        throw error;
      } else if (error.code === GROUP_ACCESS_DENIED_CODE) {
        log.info(`getGroupUpdates/${logId}: Failed to get group state. Attempting to fetch pre-join information.`);
      } else {
        throw error;
      }
    }
  }
  if (window.GV2_ENABLE_PRE_JOIN_FETCH) {
    try {
      return await updateGroupViaPreJoinInfo({
        group
      });
    } catch (error) {
      if (error.code === GROUP_ACCESS_DENIED_CODE) {
        return generateLeftGroupChanges(group);
      }
      if (error.code === GROUP_NONEXISTENT_CODE) {
        return generateLeftGroupChanges(group);
      }
      throw error;
    }
  }
  log.warn(`getGroupUpdates/${logId}: No processing was legal! Returning empty changeset.`);
  return {
    newAttributes: group,
    groupChangeMessages: [],
    members: []
  };
}
async function updateGroupViaPreJoinInfo({
  group
}) {
  const logId = idForLogging(group.groupId);
  const ourACI = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  const { publicParams, secretParams } = group;
  if (!secretParams) {
    throw new Error("updateGroupViaPreJoinInfo: group was missing secretParams!");
  }
  if (!publicParams) {
    throw new Error("updateGroupViaPreJoinInfo: group was missing publicParams!");
  }
  const inviteLinkPassword = void 0;
  const preJoinInfo = await makeRequestWithTemporalRetry({
    logId: `getPreJoinInfo/${logId}`,
    publicParams,
    secretParams,
    request: (sender, options) => sender.getGroupFromLink(inviteLinkPassword, options)
  });
  const approvalRequired = preJoinInfo.addFromInviteLink === import_protobuf.SignalService.AccessControl.AccessRequired.ADMINISTRATOR;
  if (!approvalRequired) {
    return generateLeftGroupChanges(group);
  }
  const newAttributes = {
    ...group,
    description: decryptGroupDescription(preJoinInfo.descriptionBytes, secretParams),
    name: decryptGroupTitle(preJoinInfo.title, secretParams),
    members: [],
    pendingMembersV2: [],
    pendingAdminApprovalV2: [
      {
        uuid: ourACI,
        timestamp: Date.now()
      }
    ],
    revision: preJoinInfo.version,
    temporaryMemberCount: preJoinInfo.memberCount || 1
  };
  await applyNewAvatar((0, import_dropNull.dropNull)(preJoinInfo.avatar), newAttributes, logId);
  return {
    newAttributes,
    groupChangeMessages: extractDiffs({
      old: group,
      current: newAttributes,
      dropInitialJoinMessage: false
    }),
    members: []
  };
}
async function updateGroupViaState({
  dropInitialJoinMessage,
  group
}) {
  const logId = idForLogging(group.groupId);
  const { publicParams, secretParams } = group;
  if (!secretParams) {
    throw new Error("updateGroupViaState: group was missing secretParams!");
  }
  if (!publicParams) {
    throw new Error("updateGroupViaState: group was missing publicParams!");
  }
  const groupState = await makeRequestWithTemporalRetry({
    logId: `getGroup/${logId}`,
    publicParams,
    secretParams,
    request: (sender, requestOptions) => sender.getGroup(requestOptions)
  });
  const decryptedGroupState = decryptGroupState(groupState, secretParams, logId);
  const oldVersion = group.revision;
  const newVersion = decryptedGroupState.version;
  log.info(`getCurrentGroupState/${logId}: Applying full group state, from version ${oldVersion} to ${newVersion}.`);
  const { newAttributes, newProfileKeys } = await applyGroupState({
    group,
    groupState: decryptedGroupState
  });
  return {
    newAttributes,
    groupChangeMessages: extractDiffs({
      old: group,
      current: newAttributes,
      dropInitialJoinMessage
    }),
    members: profileKeysToMembers(newProfileKeys)
  };
}
async function updateGroupViaSingleChange({
  group,
  groupChange,
  newRevision
}) {
  const wasInGroup = !group.left;
  const result = await integrateGroupChange({
    group,
    groupChange,
    newRevision
  });
  const nowInGroup = !result.newAttributes.left;
  if (!wasInGroup && nowInGroup) {
    const { newAttributes, members } = await updateGroupViaState({
      group: result.newAttributes
    });
    return {
      ...result,
      members: [...result.members, ...members],
      newAttributes
    };
  }
  return result;
}
async function updateGroupViaLogs({
  group,
  newRevision
}) {
  const logId = idForLogging(group.groupId);
  const { publicParams, secretParams } = group;
  if (!publicParams) {
    throw new Error("updateGroupViaLogs: group was missing publicParams!");
  }
  if (!secretParams) {
    throw new Error("updateGroupViaLogs: group was missing secretParams!");
  }
  log.info(`updateGroupViaLogs/${logId}: Getting group delta from ${group.revision ?? "?"} to ${newRevision ?? "?"} for group groupv2(${group.groupId})...`);
  const currentRevision = group.revision;
  let includeFirstState = true;
  let revisionToFetch = (0, import_lodash.isNumber)(currentRevision) ? currentRevision : void 0;
  let response;
  const changes = [];
  do {
    response = await makeRequestWithTemporalRetry({
      logId: `getGroupLog/${logId}`,
      publicParams,
      secretParams,
      request: (sender, requestOptions) => sender.getGroupLog({
        startVersion: revisionToFetch,
        includeFirstState,
        includeLastState: true,
        maxSupportedChangeEpoch: SUPPORTED_CHANGE_EPOCH
      }, requestOptions)
    });
    changes.push(response.changes);
    if (response.end) {
      revisionToFetch = response.end + 1;
    }
    includeFirstState = false;
  } while (response.end && (newRevision === void 0 || response.end < newRevision));
  return integrateGroupChanges({
    changes,
    group,
    newRevision
  });
}
async function generateLeftGroupChanges(group) {
  const logId = idForLogging(group.groupId);
  log.info(`generateLeftGroupChanges/${logId}: Starting...`);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  const ourPNI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI)?.toString();
  const { masterKey, groupInviteLinkPassword } = group;
  let { revision } = group;
  try {
    if (masterKey && groupInviteLinkPassword) {
      log.info(`generateLeftGroupChanges/${logId}: Have invite link. Attempting to fetch latest revision with it.`);
      const preJoinInfo = await getPreJoinGroupInfo(groupInviteLinkPassword, masterKey);
      revision = preJoinInfo.version;
    }
  } catch (error) {
    log.warn("generateLeftGroupChanges: Failed to fetch latest revision via group link. Code:", error.code);
  }
  const newAttributes = {
    ...group,
    addedBy: void 0,
    membersV2: (group.membersV2 || []).filter((member) => member.uuid !== ourACI),
    pendingMembersV2: (group.pendingMembersV2 || []).filter((member) => member.uuid !== ourACI && member.uuid !== ourPNI),
    pendingAdminApprovalV2: (group.pendingAdminApprovalV2 || []).filter((member) => member.uuid !== ourACI),
    left: true,
    revision
  };
  return {
    newAttributes,
    groupChangeMessages: extractDiffs({
      current: newAttributes,
      old: group
    }),
    members: []
  };
}
function getGroupCredentials({
  authCredentialBase64,
  groupPublicParamsBase64,
  groupSecretParamsBase64,
  serverPublicParamsBase64
}) {
  const authOperations = (0, import_zkgroup.getClientZkAuthOperations)(serverPublicParamsBase64);
  const presentation = (0, import_zkgroup.getAuthCredentialPresentation)(authOperations, authCredentialBase64, groupSecretParamsBase64);
  return {
    groupPublicParamsHex: Bytes.toHex(Bytes.fromBase64(groupPublicParamsBase64)),
    authCredentialPresentationHex: Bytes.toHex(presentation)
  };
}
async function integrateGroupChanges({
  group,
  newRevision,
  changes
}) {
  const logId = idForLogging(group.groupId);
  let attributes = group;
  const finalMessages = [];
  const finalMembers = [];
  const imax = changes.length;
  for (let i = 0; i < imax; i += 1) {
    const { groupChanges } = changes[i];
    if (!groupChanges) {
      continue;
    }
    const jmax = groupChanges.length;
    for (let j = 0; j < jmax; j += 1) {
      const changeState = groupChanges[j];
      const { groupChange, groupState } = changeState;
      if (!groupChange && !groupState) {
        log.warn("integrateGroupChanges: item had neither groupState nor groupChange. Skipping.");
        continue;
      }
      try {
        const {
          newAttributes,
          groupChangeMessages,
          members
        } = await integrateGroupChange({
          group: attributes,
          newRevision,
          groupChange: (0, import_dropNull.dropNull)(groupChange),
          groupState: (0, import_dropNull.dropNull)(groupState)
        });
        attributes = newAttributes;
        finalMessages.push(groupChangeMessages);
        finalMembers.push(members);
      } catch (error) {
        log.error(`integrateGroupChanges/${logId}: Failed to apply change log, continuing to apply remaining change logs.`, error && error.stack ? error.stack : error);
      }
    }
  }
  const isFirstFetch = !(0, import_lodash.isNumber)(group.revision);
  if (isFirstFetch) {
    const joinMessages = finalMessages[0];
    const alreadyHaveJoinMessage = joinMessages && joinMessages.length > 0;
    const otherMessages = extractDiffs({
      old: group,
      current: attributes,
      dropInitialJoinMessage: alreadyHaveJoinMessage
    });
    const groupChangeMessages = alreadyHaveJoinMessage ? [joinMessages[0], ...otherMessages] : otherMessages;
    return {
      newAttributes: attributes,
      groupChangeMessages,
      members: (0, import_lodash.flatten)(finalMembers)
    };
  }
  return {
    newAttributes: attributes,
    groupChangeMessages: (0, import_lodash.flatten)(finalMessages),
    members: (0, import_lodash.flatten)(finalMembers)
  };
}
async function integrateGroupChange({
  group,
  groupChange,
  groupState,
  newRevision
}) {
  const logId = idForLogging(group.groupId);
  if (!group.secretParams) {
    throw new Error(`integrateGroupChange/${logId}: Group was missing secretParams!`);
  }
  if (!groupChange && !groupState) {
    throw new Error(`integrateGroupChange/${logId}: Neither groupChange nor groupState received!`);
  }
  const isFirstFetch = !(0, import_lodash.isNumber)(group.revision);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourPNI = window.storage.user.getUuid(import_UUID.UUIDKind.PNI);
  const weAreAwaitingApproval = (group.pendingAdminApprovalV2 || []).find((item) => item.uuid === ourACI.toString() || ourPNI && item.uuid === ourPNI.toString());
  let isChangeSupported = false;
  let isSameVersion = false;
  let isMoreThanOneVersionUp = false;
  let groupChangeActions;
  let decryptedChangeActions;
  let sourceUuid;
  if (groupChange) {
    groupChangeActions = import_protobuf.SignalService.GroupChange.Actions.decode(groupChange.actions || new Uint8Array(0));
    if (groupChangeActions.version && newRevision !== void 0 && groupChangeActions.version > newRevision) {
      log.info(`integrateGroupChange/${logId}: Skipping ${groupChangeActions.version}, newRevision is ${newRevision}`);
      return {
        newAttributes: group,
        groupChangeMessages: [],
        members: []
      };
    }
    decryptedChangeActions = decryptGroupChange(groupChangeActions, group.secretParams, logId);
    (0, import_assert.strictAssert)(decryptedChangeActions !== void 0, "Should have decrypted group actions");
    ({ sourceUuid } = decryptedChangeActions);
    (0, import_assert.strictAssert)(sourceUuid, "Should have source UUID");
    isChangeSupported = !(0, import_lodash.isNumber)(groupChange.changeEpoch) || groupChange.changeEpoch <= SUPPORTED_CHANGE_EPOCH;
    if (group.revision !== void 0 && groupChangeActions.version) {
      if (groupChangeActions.version < group.revision) {
        log.info(`integrateGroupChange/${logId}: Skipping stale version${groupChangeActions.version}, current revision is ${group.revision}`);
        return {
          newAttributes: group,
          groupChangeMessages: [],
          members: []
        };
      }
      if (groupChangeActions.version === group.revision) {
        isSameVersion = true;
      } else if (groupChangeActions.version !== group.revision + 1 || !(0, import_lodash.isNumber)(group.revision) && groupChangeActions.version > 0) {
        isMoreThanOneVersionUp = true;
      }
    }
  }
  let attributes = group;
  const aggregatedChangeMessages = [];
  const aggregatedMembers = [];
  const canApplyChange = groupChange && isChangeSupported && !isSameVersion && !isFirstFetch && (!isMoreThanOneVersionUp || weAreAwaitingApproval);
  if (canApplyChange) {
    if (!sourceUuid || !groupChangeActions || !decryptedChangeActions) {
      throw new Error(`integrateGroupChange/${logId}: Missing necessary information that should have come from group actions`);
    }
    log.info(`integrateGroupChange/${logId}: Applying group change actions, from version ${group.revision} to ${groupChangeActions.version}`);
    const { newAttributes, newProfileKeys } = await applyGroupChange({
      group,
      actions: decryptedChangeActions,
      sourceUuid
    });
    const groupChangeMessages = extractDiffs({
      old: attributes,
      current: newAttributes,
      sourceUuid
    });
    attributes = newAttributes;
    aggregatedChangeMessages.push(groupChangeMessages);
    aggregatedMembers.push(profileKeysToMembers(newProfileKeys));
  }
  if (groupState) {
    log.info(`integrateGroupChange/${logId}: Applying full group state, from version ${group.revision} to ${groupState.version}`, {
      isChangePresent: Boolean(groupChange),
      isChangeSupported,
      isFirstFetch,
      isSameVersion,
      isMoreThanOneVersionUp,
      weAreAwaitingApproval
    });
    const decryptedGroupState = decryptGroupState(groupState, group.secretParams, logId);
    const { newAttributes, newProfileKeys } = await applyGroupState({
      group: attributes,
      groupState: decryptedGroupState,
      sourceUuid: isFirstFetch ? sourceUuid : void 0
    });
    const groupChangeMessages = extractDiffs({
      old: attributes,
      current: newAttributes,
      sourceUuid: isFirstFetch ? sourceUuid : void 0
    });
    const newMembers = profileKeysToMembers(newProfileKeys);
    if (canApplyChange && (groupChangeMessages.length !== 0 || newMembers.length !== 0)) {
      (0, import_assert.assert)(groupChangeMessages.length === 0, "Fallback group state processing should not kick in");
      log.warn(`integrateGroupChange/${logId}: local state was different from the remote final state. Got ${groupChangeMessages.length} change messages, and ${newMembers.length} updated members`);
    }
    attributes = newAttributes;
    aggregatedChangeMessages.push(groupChangeMessages);
    aggregatedMembers.push(newMembers);
  } else {
    (0, import_assert.strictAssert)(canApplyChange, `integrateGroupChange/${logId}: No group state, but we can't apply changes!`);
  }
  return {
    newAttributes: attributes,
    groupChangeMessages: aggregatedChangeMessages.flat(),
    members: aggregatedMembers.flat()
  };
}
function extractDiffs({
  current,
  dropInitialJoinMessage,
  old,
  sourceUuid
}) {
  const logId = idForLogging(old.groupId);
  const details = [];
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourPNI = window.storage.user.getUuid(import_UUID.UUIDKind.PNI);
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  let areWeInGroup = false;
  let uuidKindInvitedToGroup;
  let areWePendingApproval = false;
  let whoInvitedUsUserId = null;
  if (current.accessControl && old.accessControl && old.accessControl.attributes !== void 0 && old.accessControl.attributes !== current.accessControl.attributes) {
    details.push({
      type: "access-attributes",
      newPrivilege: current.accessControl.attributes
    });
  }
  if (current.accessControl && old.accessControl && old.accessControl.members !== void 0 && old.accessControl.members !== current.accessControl.members) {
    details.push({
      type: "access-members",
      newPrivilege: current.accessControl.members
    });
  }
  const linkPreviouslyEnabled = (0, import_util.isAccessControlEnabled)(old.accessControl?.addFromInviteLink);
  const linkCurrentlyEnabled = (0, import_util.isAccessControlEnabled)(current.accessControl?.addFromInviteLink);
  if (!linkPreviouslyEnabled && linkCurrentlyEnabled) {
    details.push({
      type: "group-link-add",
      privilege: current.accessControl?.addFromInviteLink || ACCESS_ENUM.ANY
    });
  } else if (linkPreviouslyEnabled && !linkCurrentlyEnabled) {
    details.push({
      type: "group-link-remove"
    });
  } else if (linkPreviouslyEnabled && linkCurrentlyEnabled && old.accessControl?.addFromInviteLink !== current.accessControl?.addFromInviteLink) {
    details.push({
      type: "access-invite-link",
      newPrivilege: current.accessControl?.addFromInviteLink || ACCESS_ENUM.ANY
    });
  }
  if (Boolean(old.avatar) !== Boolean(current.avatar) || old.avatar?.hash !== current.avatar?.hash) {
    details.push({
      type: "avatar",
      removed: !current.avatar
    });
  }
  if (old.name !== current.name) {
    details.push({
      type: "title",
      newTitle: current.name
    });
  }
  if (old.groupInviteLinkPassword && current.groupInviteLinkPassword && old.groupInviteLinkPassword !== current.groupInviteLinkPassword) {
    details.push({
      type: "group-link-reset"
    });
  }
  if (old.description !== current.description) {
    details.push({
      type: "description",
      removed: !current.description,
      description: current.description
    });
  }
  const oldMemberLookup = new Map((old.membersV2 || []).map((member) => [member.uuid, member]));
  const oldPendingMemberLookup = new Map((old.pendingMembersV2 || []).map((member) => [member.uuid, member]));
  const oldPendingAdminApprovalLookup = new Map((old.pendingAdminApprovalV2 || []).map((member) => [member.uuid, member]));
  const currentPendingMemberSet = new Set((current.pendingMembersV2 || []).map((member) => member.uuid));
  (current.membersV2 || []).forEach((currentMember) => {
    const { uuid } = currentMember;
    const isUs = uuid === ourACI.toString();
    if (isUs) {
      areWeInGroup = true;
    }
    const oldMember = oldMemberLookup.get(uuid);
    if (!oldMember) {
      let pendingMember = oldPendingMemberLookup.get(uuid);
      if (isUs && ourPNI && !pendingMember) {
        pendingMember = oldPendingMemberLookup.get(ourPNI.toString());
      }
      if (pendingMember) {
        details.push({
          type: "member-add-from-invite",
          uuid,
          inviter: pendingMember.addedByUserId
        });
      } else if (currentMember.joinedFromLink) {
        details.push({
          type: "member-add-from-link",
          uuid
        });
      } else if (currentMember.approvedByAdmin) {
        details.push({
          type: "member-add-from-admin-approval",
          uuid
        });
      } else {
        details.push({
          type: "member-add",
          uuid
        });
      }
    } else if (oldMember.role !== currentMember.role) {
      details.push({
        type: "member-privilege",
        uuid,
        newPrivilege: currentMember.role
      });
    }
    oldPendingAdminApprovalLookup.delete(uuid);
    oldPendingMemberLookup.delete(uuid);
    oldMemberLookup.delete(uuid);
    if (isUs && ourPNI && !oldMember && oldPendingMemberLookup.has(ourPNI.toString()) && !currentPendingMemberSet.has(ourPNI.toString())) {
      oldPendingMemberLookup.delete(ourPNI.toString());
    }
  });
  const removedMemberIds = Array.from(oldMemberLookup.keys());
  removedMemberIds.forEach((uuid) => {
    details.push({
      type: "member-remove",
      uuid
    });
  });
  let lastPendingUuid;
  let pendingCount = 0;
  (current.pendingMembersV2 || []).forEach((currentPendingMember) => {
    const { uuid } = currentPendingMember;
    const oldPendingMember = oldPendingMemberLookup.get(uuid);
    if (uuid === ourACI.toString() || uuid === ourPNI?.toString()) {
      if (uuid === ourACI.toString()) {
        uuidKindInvitedToGroup = import_UUID.UUIDKind.ACI;
      } else if (uuidKindInvitedToGroup === void 0) {
        uuidKindInvitedToGroup = import_UUID.UUIDKind.PNI;
      }
      whoInvitedUsUserId = currentPendingMember.addedByUserId;
    }
    if (!oldPendingMember) {
      lastPendingUuid = uuid;
      pendingCount += 1;
    }
    oldPendingMemberLookup.delete(uuid);
  });
  if (pendingCount > 1) {
    details.push({
      type: "pending-add-many",
      count: pendingCount
    });
  } else if (pendingCount === 1) {
    if (lastPendingUuid) {
      details.push({
        type: "pending-add-one",
        uuid: lastPendingUuid
      });
    } else {
      log.warn(`extractDiffs/${logId}: pendingCount was 1, no last conversationId available`);
    }
  }
  const removedPendingMemberIds = Array.from(oldPendingMemberLookup.keys());
  if (removedPendingMemberIds.length > 1) {
    const firstUuid = removedPendingMemberIds[0];
    const firstRemovedMember = oldPendingMemberLookup.get(firstUuid);
    (0, import_assert.strictAssert)(firstRemovedMember !== void 0, "First removed member not found");
    const inviter = firstRemovedMember.addedByUserId;
    const allSameInviter = removedPendingMemberIds.every((id) => oldPendingMemberLookup.get(id)?.addedByUserId === inviter);
    details.push({
      type: "pending-remove-many",
      count: removedPendingMemberIds.length,
      inviter: allSameInviter ? inviter : void 0
    });
  } else if (removedPendingMemberIds.length === 1) {
    const uuid = removedPendingMemberIds[0];
    const removedMember = oldPendingMemberLookup.get(uuid);
    (0, import_assert.strictAssert)(removedMember !== void 0, "Removed member not found");
    details.push({
      type: "pending-remove-one",
      uuid,
      inviter: removedMember.addedByUserId
    });
  }
  (current.pendingAdminApprovalV2 || []).forEach((currentPendingAdminAprovalMember) => {
    const { uuid } = currentPendingAdminAprovalMember;
    const oldPendingMember = oldPendingAdminApprovalLookup.get(uuid);
    if (uuid === ourACI.toString()) {
      areWePendingApproval = true;
    }
    if (!oldPendingMember) {
      details.push({
        type: "admin-approval-add-one",
        uuid
      });
    }
    oldPendingAdminApprovalLookup.delete(uuid);
  });
  const removedPendingAdminApprovalIds = Array.from(oldPendingAdminApprovalLookup.keys());
  removedPendingAdminApprovalIds.forEach((uuid) => {
    details.push({
      type: "admin-approval-remove-one",
      uuid
    });
  });
  if (Boolean(old.announcementsOnly) !== Boolean(current.announcementsOnly)) {
    details.push({
      type: "announcements-only",
      announcementsOnly: Boolean(current.announcementsOnly)
    });
  }
  let message;
  let timerNotification;
  const firstUpdate = !(0, import_lodash.isNumber)(old.revision);
  const isFromUs = ourACI.toString() === sourceUuid;
  if (firstUpdate && uuidKindInvitedToGroup !== void 0) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        from: whoInvitedUsUserId || sourceUuid,
        details: [
          {
            type: "pending-add-one",
            uuid: window.storage.user.getCheckedUuid(uuidKindInvitedToGroup).toString()
          }
        ]
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: isFromUs ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen
    };
  } else if (firstUpdate && areWePendingApproval) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        from: ourACI.toString(),
        details: [
          {
            type: "admin-approval-add-one",
            uuid: ourACI.toString()
          }
        ]
      }
    };
  } else if (firstUpdate && dropInitialJoinMessage) {
    message = void 0;
  } else if (firstUpdate && current.revision === 0 && sourceUuid === ourACI.toString()) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        from: sourceUuid,
        details: [
          {
            type: "create"
          }
        ]
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: isFromUs ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen
    };
  } else if (firstUpdate && areWeInGroup) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        from: sourceUuid,
        details: [
          {
            type: "member-add",
            uuid: ourACI.toString()
          }
        ]
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: isFromUs ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen
    };
  } else if (firstUpdate && current.revision === 0) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      groupV2Change: {
        from: sourceUuid,
        details: [
          {
            type: "create"
          }
        ]
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: isFromUs ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen
    };
  } else if (details.length > 0) {
    message = {
      ...generateBasicMessage(),
      type: "group-v2-change",
      sourceUuid,
      groupV2Change: {
        from: sourceUuid,
        details
      },
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      seenStatus: isFromUs ? import_MessageSeenStatus.SeenStatus.Seen : import_MessageSeenStatus.SeenStatus.Unseen
    };
  }
  if (Boolean(old.expireTimer) !== Boolean(current.expireTimer) || Boolean(old.expireTimer) && Boolean(current.expireTimer) && old.expireTimer !== current.expireTimer) {
    timerNotification = {
      ...generateBasicMessage(),
      type: "timer-notification",
      sourceUuid,
      flags: import_protobuf.SignalService.DataMessage.Flags.EXPIRATION_TIMER_UPDATE,
      expirationTimerUpdate: {
        expireTimer: current.expireTimer || 0,
        sourceUuid
      }
    };
  }
  const result = (0, import_lodash.compact)([message, timerNotification]);
  log.info(`extractDiffs/${logId} complete, generated ${result.length} change messages`);
  return result;
}
function profileKeysToMembers(items) {
  return items.map((item) => ({
    profileKey: Bytes.toBase64(item.profileKey),
    uuid: item.uuid
  }));
}
async function applyGroupChange({
  actions,
  group,
  sourceUuid
}) {
  const logId = idForLogging(group.groupId);
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const version = actions.version || 0;
  const result = { ...group };
  const newProfileKeys = [];
  const members = (0, import_lodash.fromPairs)((result.membersV2 || []).map((member) => [member.uuid, member]));
  const pendingMembers = (0, import_lodash.fromPairs)((result.pendingMembersV2 || []).map((member) => [member.uuid, member]));
  const pendingAdminApprovalMembers = (0, import_lodash.fromPairs)((result.pendingAdminApprovalV2 || []).map((member) => [member.uuid, member]));
  const bannedMembers = new Map((result.bannedMembersV2 || []).map((member) => [member.uuid, member]));
  result.revision = version;
  (actions.addMembers || []).forEach((addMember) => {
    const { added } = addMember;
    if (!added || !added.userId) {
      throw new Error("applyGroupChange: addMember.added is missing");
    }
    const addedUuid = import_UUID.UUID.cast(added.userId);
    if (members[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add member failed; already in members.`);
      return;
    }
    members[addedUuid] = {
      uuid: addedUuid,
      role: added.role || MEMBER_ROLE_ENUM.DEFAULT,
      joinedAtVersion: version,
      joinedFromLink: addMember.joinFromInviteLink || false
    };
    if (pendingMembers[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Removing newly-added member from pendingMembers.`);
      delete pendingMembers[addedUuid];
    }
    if (ourACI && sourceUuid && addedUuid === ourACI) {
      result.addedBy = sourceUuid;
    }
    if (added.profileKey) {
      newProfileKeys.push({
        profileKey: added.profileKey,
        uuid: import_UUID.UUID.cast(added.userId)
      });
    }
  });
  (actions.deleteMembers || []).forEach((deleteMember) => {
    const { deletedUserId } = deleteMember;
    if (!deletedUserId) {
      throw new Error("applyGroupChange: deleteMember.deletedUserId is missing");
    }
    const deletedUuid = import_UUID.UUID.cast(deletedUserId);
    if (members[deletedUuid]) {
      delete members[deletedUuid];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to remove member failed; was not in members.`);
    }
  });
  (actions.modifyMemberRoles || []).forEach((modifyMemberRole) => {
    const { role, userId } = modifyMemberRole;
    if (!role || !userId) {
      throw new Error("applyGroupChange: modifyMemberRole had a missing value");
    }
    const userUuid = import_UUID.UUID.cast(userId);
    if (members[userUuid]) {
      members[userUuid] = {
        ...members[userUuid],
        role
      };
    } else {
      throw new Error("applyGroupChange: modifyMemberRole tried to modify nonexistent member");
    }
  });
  (actions.modifyMemberProfileKeys || []).forEach((modifyMemberProfileKey) => {
    const { profileKey, uuid } = modifyMemberProfileKey;
    if (!profileKey || !uuid) {
      throw new Error("applyGroupChange: modifyMemberProfileKey had a missing value");
    }
    newProfileKeys.push({
      profileKey,
      uuid: import_UUID.UUID.cast(uuid)
    });
  });
  (actions.addPendingMembers || []).forEach((addPendingMember) => {
    const { added } = addPendingMember;
    if (!added || !added.member || !added.member.userId) {
      throw new Error("applyGroupChange: addPendingMembers had a missing value");
    }
    const addedUuid = import_UUID.UUID.cast(added.member.userId);
    if (members[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add pendingMember failed; was already in members.`);
      return;
    }
    if (pendingMembers[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add pendingMember failed; was already in pendingMembers.`);
      return;
    }
    pendingMembers[addedUuid] = {
      uuid: addedUuid,
      addedByUserId: import_UUID.UUID.cast(added.addedByUserId),
      timestamp: added.timestamp,
      role: added.member.role || MEMBER_ROLE_ENUM.DEFAULT
    };
    if (added.member && added.member.profileKey) {
      newProfileKeys.push({
        profileKey: added.member.profileKey,
        uuid: addedUuid
      });
    }
  });
  (actions.deletePendingMembers || []).forEach((deletePendingMember) => {
    const { deletedUserId } = deletePendingMember;
    if (!deletedUserId) {
      throw new Error("applyGroupChange: deletePendingMember.deletedUserId is null!");
    }
    const deletedUuid = import_UUID.UUID.cast(deletedUserId);
    if (pendingMembers[deletedUuid]) {
      delete pendingMembers[deletedUuid];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to remove pendingMember failed; was not in pendingMembers.`);
    }
  });
  (actions.promotePendingMembers || []).forEach((promotePendingMember) => {
    const { profileKey, uuid: rawUuid } = promotePendingMember;
    if (!profileKey || !rawUuid) {
      throw new Error("applyGroupChange: promotePendingMember had a missing value");
    }
    const uuid = import_UUID.UUID.cast(rawUuid);
    const previousRecord = pendingMembers[uuid];
    if (pendingMembers[uuid]) {
      delete pendingMembers[uuid];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingMember failed; was not in pendingMembers.`);
    }
    if (members[uuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingMember failed; was already in members.`);
      return;
    }
    members[uuid] = {
      uuid,
      joinedAtVersion: version,
      role: previousRecord.role || MEMBER_ROLE_ENUM.DEFAULT
    };
    newProfileKeys.push({
      profileKey,
      uuid
    });
  });
  (actions.promoteMembersPendingPniAciProfileKey || []).forEach((promotePendingMember) => {
    const { profileKey, aci, pni } = promotePendingMember;
    if (!profileKey || !aci || !pni) {
      throw new Error("applyGroupChange: promotePendingMember had a missing value");
    }
    const previousRecord = pendingMembers[pni];
    if (pendingMembers[pni]) {
      delete pendingMembers[pni];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingMember failed; was not in pendingMembers.`);
    }
    if (members[aci]) {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingMember failed; was already in members.`);
      return;
    }
    members[aci] = {
      uuid: aci,
      joinedAtVersion: version,
      role: previousRecord.role || MEMBER_ROLE_ENUM.DEFAULT
    };
    newProfileKeys.push({
      profileKey,
      uuid: aci
    });
  });
  if (actions.modifyTitle) {
    const { title } = actions.modifyTitle;
    if (title && title.content === "title") {
      result.name = (0, import_dropNull.dropNull)(title.title);
    } else {
      log.warn(`applyGroupChange/${logId}: Clearing group title due to missing data.`);
      result.name = void 0;
    }
  }
  if (actions.modifyAvatar) {
    const { avatar } = actions.modifyAvatar;
    await applyNewAvatar((0, import_dropNull.dropNull)(avatar), result, logId);
  }
  if (actions.modifyDisappearingMessagesTimer) {
    const disappearingMessagesTimer = actions.modifyDisappearingMessagesTimer.timer;
    if (disappearingMessagesTimer && disappearingMessagesTimer.content === "disappearingMessagesDuration") {
      result.expireTimer = (0, import_dropNull.dropNull)(disappearingMessagesTimer.disappearingMessagesDuration);
    } else {
      log.warn(`applyGroupChange/${logId}: Clearing group expireTimer due to missing data.`);
      result.expireTimer = void 0;
    }
  }
  result.accessControl = result.accessControl || {
    members: ACCESS_ENUM.MEMBER,
    attributes: ACCESS_ENUM.MEMBER,
    addFromInviteLink: ACCESS_ENUM.UNSATISFIABLE
  };
  if (actions.modifyAttributesAccess) {
    result.accessControl = {
      ...result.accessControl,
      attributes: actions.modifyAttributesAccess.attributesAccess || ACCESS_ENUM.MEMBER
    };
  }
  if (actions.modifyMemberAccess) {
    result.accessControl = {
      ...result.accessControl,
      members: actions.modifyMemberAccess.membersAccess || ACCESS_ENUM.MEMBER
    };
  }
  if (actions.modifyAddFromInviteLinkAccess) {
    result.accessControl = {
      ...result.accessControl,
      addFromInviteLink: actions.modifyAddFromInviteLinkAccess.addFromInviteLinkAccess || ACCESS_ENUM.UNSATISFIABLE
    };
  }
  (actions.addMemberPendingAdminApprovals || []).forEach((pendingAdminApproval) => {
    const { added } = pendingAdminApproval;
    if (!added) {
      throw new Error("applyGroupChange: modifyMemberProfileKey had a missing value");
    }
    const addedUuid = import_UUID.UUID.cast(added.userId);
    if (members[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add pending admin approval failed; was already in members.`);
      return;
    }
    if (pendingMembers[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add pending admin approval failed; was already in pendingMembers.`);
      return;
    }
    if (pendingAdminApprovalMembers[addedUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to add pending admin approval failed; was already in pendingAdminApprovalMembers.`);
      return;
    }
    pendingAdminApprovalMembers[addedUuid] = {
      uuid: addedUuid,
      timestamp: added.timestamp
    };
    if (added.profileKey) {
      newProfileKeys.push({
        profileKey: added.profileKey,
        uuid: addedUuid
      });
    }
  });
  (actions.deleteMemberPendingAdminApprovals || []).forEach((deleteAdminApproval) => {
    const { deletedUserId } = deleteAdminApproval;
    if (!deletedUserId) {
      throw new Error("applyGroupChange: deleteAdminApproval.deletedUserId is null!");
    }
    const deletedUuid = import_UUID.UUID.cast(deletedUserId);
    if (pendingAdminApprovalMembers[deletedUuid]) {
      delete pendingAdminApprovalMembers[deletedUuid];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to remove pendingAdminApproval failed; was not in pendingAdminApprovalMembers.`);
    }
  });
  (actions.promoteMemberPendingAdminApprovals || []).forEach((promoteAdminApproval) => {
    const { userId, role } = promoteAdminApproval;
    if (!userId) {
      throw new Error("applyGroupChange: promoteAdminApproval had a missing value");
    }
    const userUuid = import_UUID.UUID.cast(userId);
    if (pendingAdminApprovalMembers[userUuid]) {
      delete pendingAdminApprovalMembers[userUuid];
    } else {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingAdminApproval failed; was not in pendingAdminApprovalMembers.`);
    }
    if (pendingMembers[userUuid]) {
      delete pendingAdminApprovalMembers[userUuid];
      log.warn(`applyGroupChange/${logId}: Deleted pendingAdminApproval from pendingMembers.`);
    }
    if (members[userUuid]) {
      log.warn(`applyGroupChange/${logId}: Attempt to promote pendingMember failed; was already in members.`);
      return;
    }
    members[userUuid] = {
      uuid: userUuid,
      joinedAtVersion: version,
      role: role || MEMBER_ROLE_ENUM.DEFAULT,
      approvedByAdmin: true
    };
  });
  if (actions.modifyInviteLinkPassword) {
    const { inviteLinkPassword } = actions.modifyInviteLinkPassword;
    if (inviteLinkPassword) {
      result.groupInviteLinkPassword = inviteLinkPassword;
    } else {
      result.groupInviteLinkPassword = void 0;
    }
  }
  if (actions.modifyDescription) {
    const { descriptionBytes } = actions.modifyDescription;
    if (descriptionBytes && descriptionBytes.content === "descriptionText") {
      result.description = (0, import_dropNull.dropNull)(descriptionBytes.descriptionText);
    } else {
      log.warn(`applyGroupChange/${logId}: Clearing group description due to missing data.`);
      result.description = void 0;
    }
  }
  if (actions.modifyAnnouncementsOnly) {
    const { announcementsOnly } = actions.modifyAnnouncementsOnly;
    result.announcementsOnly = announcementsOnly;
  }
  if (actions.addMembersBanned && actions.addMembersBanned.length > 0) {
    actions.addMembersBanned.forEach((member) => {
      if (bannedMembers.has(member.uuid)) {
        log.warn(`applyGroupChange/${logId}: Attempt to add banned member failed; was already in banned list.`);
        return;
      }
      bannedMembers.set(member.uuid, member);
    });
  }
  if (actions.deleteMembersBanned && actions.deleteMembersBanned.length > 0) {
    actions.deleteMembersBanned.forEach((uuid) => {
      if (!bannedMembers.has(uuid)) {
        log.warn(`applyGroupChange/${logId}: Attempt to remove banned member failed; was not in banned list.`);
        return;
      }
      bannedMembers.delete(uuid);
    });
  }
  if (ourACI) {
    result.left = !members[ourACI];
  }
  if (result.left) {
    result.addedBy = void 0;
  }
  result.membersV2 = (0, import_lodash.values)(members);
  result.pendingMembersV2 = (0, import_lodash.values)(pendingMembers);
  result.pendingAdminApprovalV2 = (0, import_lodash.values)(pendingAdminApprovalMembers);
  result.bannedMembersV2 = Array.from(bannedMembers.values());
  return {
    newAttributes: result,
    newProfileKeys
  };
}
async function decryptGroupAvatar(avatarKey, secretParamsBase64) {
  const sender = window.textsecure.messaging;
  if (!sender) {
    throw new Error("decryptGroupAvatar: textsecure.messaging is not available!");
  }
  const ciphertext = await sender.getGroupAvatar(avatarKey);
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParamsBase64);
  const plaintext = (0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, ciphertext);
  const blob = import_protobuf.SignalService.GroupAttributeBlob.decode(plaintext);
  if (blob.content !== "avatar") {
    throw new Error(`decryptGroupAvatar: Returned blob had incorrect content: ${blob.content}`);
  }
  const avatar = (0, import_dropNull.dropNull)(blob.avatar);
  if (!avatar) {
    throw new Error("decryptGroupAvatar: Returned blob had no avatar set!");
  }
  return avatar;
}
async function applyNewAvatar(newAvatar, result, logId) {
  try {
    if (!newAvatar && result.avatar) {
      await window.Signal.Migrations.deleteAttachmentData(result.avatar.path);
      result.avatar = void 0;
    }
    if (newAvatar && (!result.avatar || result.avatar.url !== newAvatar)) {
      if (!result.secretParams) {
        throw new Error("applyNewAvatar: group was missing secretParams!");
      }
      const data = await decryptGroupAvatar(newAvatar, result.secretParams);
      const hash = (0, import_Crypto.computeHash)(data);
      if (result.avatar?.hash === hash) {
        log.info(`applyNewAvatar/${logId}: Hash is the same, but url was different. Saving new url.`);
        result.avatar = {
          ...result.avatar,
          url: newAvatar
        };
        return;
      }
      if (result.avatar) {
        await window.Signal.Migrations.deleteAttachmentData(result.avatar.path);
      }
      const path = await window.Signal.Migrations.writeNewAttachmentData(data);
      result.avatar = {
        url: newAvatar,
        path,
        hash
      };
    }
  } catch (error) {
    log.warn(`applyNewAvatar/${logId} Failed to handle avatar, clearing it`, error.stack);
    if (result.avatar && result.avatar.path) {
      await window.Signal.Migrations.deleteAttachmentData(result.avatar.path);
    }
    result.avatar = void 0;
  }
}
async function applyGroupState({
  group,
  groupState,
  sourceUuid
}) {
  const logId = idForLogging(group.groupId);
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  const version = groupState.version || 0;
  const result = { ...group };
  const newProfileKeys = [];
  result.revision = version;
  const { title } = groupState;
  if (title && title.content === "title") {
    result.name = (0, import_dropNull.dropNull)(title.title);
  } else {
    result.name = void 0;
  }
  await applyNewAvatar((0, import_dropNull.dropNull)(groupState.avatar), result, logId);
  const { disappearingMessagesTimer } = groupState;
  if (disappearingMessagesTimer && disappearingMessagesTimer.content === "disappearingMessagesDuration") {
    result.expireTimer = (0, import_dropNull.dropNull)(disappearingMessagesTimer.disappearingMessagesDuration);
  } else {
    result.expireTimer = void 0;
  }
  const { accessControl } = groupState;
  result.accessControl = {
    attributes: accessControl && accessControl.attributes || ACCESS_ENUM.MEMBER,
    members: accessControl && accessControl.members || ACCESS_ENUM.MEMBER,
    addFromInviteLink: accessControl && accessControl.addFromInviteLink || ACCESS_ENUM.UNSATISFIABLE
  };
  result.left = true;
  const ourACI = window.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI).toString();
  const wasPreviouslyAMember = (result.membersV2 || []).some((item) => item.uuid !== ourACI);
  if (groupState.members) {
    result.membersV2 = groupState.members.map((member) => {
      if (member.userId === ourACI) {
        result.left = false;
        if (sourceUuid && !wasPreviouslyAMember && (0, import_lodash.isNumber)(member.joinedAtVersion) && member.joinedAtVersion === version) {
          result.addedBy = sourceUuid;
        }
      }
      if (!isValidRole(member.role)) {
        throw new Error(`applyGroupState: Member had invalid role ${member.role}`);
      }
      if (member.profileKey) {
        newProfileKeys.push({
          profileKey: member.profileKey,
          uuid: import_UUID.UUID.cast(member.userId)
        });
      }
      return {
        role: member.role || MEMBER_ROLE_ENUM.DEFAULT,
        joinedAtVersion: member.joinedAtVersion || version,
        uuid: import_UUID.UUID.cast(member.userId)
      };
    });
  }
  if (groupState.membersPendingProfileKey) {
    result.pendingMembersV2 = groupState.membersPendingProfileKey.map((member) => {
      if (!member.member || !member.member.userId) {
        throw new Error("applyGroupState: Member pending profile key did not have an associated userId");
      }
      if (!member.addedByUserId) {
        throw new Error("applyGroupState: Member pending profile key did not have an addedByUserID");
      }
      if (!isValidRole(member.member.role)) {
        throw new Error(`applyGroupState: Member pending profile key had invalid role ${member.member.role}`);
      }
      if (member.member.profileKey) {
        newProfileKeys.push({
          profileKey: member.member.profileKey,
          uuid: import_UUID.UUID.cast(member.member.userId)
        });
      }
      return {
        addedByUserId: import_UUID.UUID.cast(member.addedByUserId),
        uuid: import_UUID.UUID.cast(member.member.userId),
        timestamp: member.timestamp,
        role: member.member.role || MEMBER_ROLE_ENUM.DEFAULT
      };
    });
  }
  if (groupState.membersPendingAdminApproval) {
    result.pendingAdminApprovalV2 = groupState.membersPendingAdminApproval.map((member) => {
      if (member.profileKey) {
        newProfileKeys.push({
          profileKey: member.profileKey,
          uuid: import_UUID.UUID.cast(member.userId)
        });
      }
      return {
        uuid: import_UUID.UUID.cast(member.userId),
        timestamp: member.timestamp
      };
    });
  }
  const { inviteLinkPassword } = groupState;
  if (inviteLinkPassword) {
    result.groupInviteLinkPassword = inviteLinkPassword;
  } else {
    result.groupInviteLinkPassword = void 0;
  }
  const { descriptionBytes } = groupState;
  if (descriptionBytes && descriptionBytes.content === "descriptionText") {
    result.description = (0, import_dropNull.dropNull)(descriptionBytes.descriptionText);
  } else {
    result.description = void 0;
  }
  result.announcementsOnly = groupState.announcementsOnly;
  result.bannedMembersV2 = groupState.membersBanned;
  if (result.left) {
    result.addedBy = void 0;
  }
  return {
    newAttributes: result,
    newProfileKeys
  };
}
function isValidRole(role) {
  const MEMBER_ROLE_ENUM = import_protobuf.SignalService.Member.Role;
  return role === MEMBER_ROLE_ENUM.ADMINISTRATOR || role === MEMBER_ROLE_ENUM.DEFAULT;
}
function isValidAccess(access) {
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  return access === ACCESS_ENUM.ADMINISTRATOR || access === ACCESS_ENUM.MEMBER;
}
function isValidLinkAccess(access) {
  const ACCESS_ENUM = import_protobuf.SignalService.AccessControl.AccessRequired;
  return access === ACCESS_ENUM.UNKNOWN || access === ACCESS_ENUM.ANY || access === ACCESS_ENUM.ADMINISTRATOR || access === ACCESS_ENUM.UNSATISFIABLE;
}
function isValidProfileKey(buffer) {
  return Boolean(buffer && buffer.length === 32);
}
function normalizeTimestamp(timestamp) {
  if (!timestamp) {
    return 0;
  }
  const asNumber = timestamp.toNumber();
  const now = Date.now();
  if (!asNumber || asNumber > now) {
    return now;
  }
  return asNumber;
}
function decryptGroupChange(actions, groupSecretParams, logId) {
  const result = {
    version: (0, import_dropNull.dropNull)(actions.version)
  };
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(groupSecretParams);
  if (actions.sourceUuid && actions.sourceUuid.length !== 0) {
    try {
      result.sourceUuid = import_UUID.UUID.cast((0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, actions.sourceUuid), "actions.sourceUuid"));
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt sourceUuid.`, error && error.stack ? error.stack : error);
    }
    if (!(0, import_UUID.isValidUuid)(result.sourceUuid)) {
      log.warn(`decryptGroupChange/${logId}: Invalid sourceUuid. Clearing sourceUuid.`);
      result.sourceUuid = void 0;
    }
  } else {
    throw new Error("decryptGroupChange: Missing sourceUuid");
  }
  result.addMembers = (0, import_lodash.compact)((actions.addMembers || []).map((addMember) => {
    (0, import_assert.strictAssert)(addMember.added, "decryptGroupChange: AddMember was missing added field!");
    const decrypted = decryptMember(clientZkGroupCipher, addMember.added, logId);
    if (!decrypted) {
      return null;
    }
    return {
      added: decrypted,
      joinFromInviteLink: Boolean(addMember.joinFromInviteLink)
    };
  }));
  result.deleteMembers = (0, import_lodash.compact)((actions.deleteMembers || []).map((deleteMember) => {
    const { deletedUserId } = deleteMember;
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(deletedUserId), "decryptGroupChange: deleteMember.deletedUserId was missing");
    let userId;
    try {
      userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, deletedUserId), "actions.deleteMembers.deletedUserId");
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt deleteMembers.deletedUserId. Dropping member.`, error && error.stack ? error.stack : error);
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(userId)) {
      log.warn(`decryptGroupChange/${logId}: Dropping deleteMember due to invalid userId`);
      return null;
    }
    return { deletedUserId: userId };
  }));
  result.modifyMemberRoles = (0, import_lodash.compact)((actions.modifyMemberRoles || []).map((modifyMember) => {
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(modifyMember.userId), "decryptGroupChange: modifyMemberRole.userId was missing");
    let userId;
    try {
      userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, modifyMember.userId), "actions.modifyMemberRoles.userId");
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt modifyMemberRole.userId. Dropping member.`, error && error.stack ? error.stack : error);
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(userId)) {
      log.warn(`decryptGroupChange/${logId}: Dropping modifyMemberRole due to invalid userId`);
      return null;
    }
    const role = (0, import_dropNull.dropNull)(modifyMember.role);
    if (!isValidRole(role)) {
      throw new Error(`decryptGroupChange: modifyMemberRole had invalid role ${modifyMember.role}`);
    }
    return {
      role,
      userId
    };
  }));
  result.modifyMemberProfileKeys = (0, import_lodash.compact)((actions.modifyMemberProfileKeys || []).map((modifyMemberProfileKey) => {
    let { userId, profileKey: encryptedProfileKey } = modifyMemberProfileKey;
    if (Bytes.isEmpty(userId) || Bytes.isEmpty(encryptedProfileKey)) {
      const { presentation } = modifyMemberProfileKey;
      (0, import_assert.strictAssert)(Bytes.isNotEmpty(presentation), "decryptGroupChange: modifyMemberProfileKeys.presentation was missing");
      const decodedPresentation = (0, import_zkgroup.decodeProfileKeyCredentialPresentation)(presentation);
      ({ userId, profileKey: encryptedProfileKey } = decodedPresentation);
    }
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(userId), "decryptGroupChange: modifyMemberProfileKeys.userId was missing");
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(encryptedProfileKey), "decryptGroupChange: modifyMemberProfileKeys.profileKey was missing");
    let uuid;
    let profileKey;
    try {
      uuid = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, userId), "actions.modifyMemberProfileKeys.userId");
      profileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, encryptedProfileKey, uuid);
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt modifyMemberProfileKeys.userId/profileKey. Dropping member.`, Errors.toLogFormat(error));
      return null;
    }
    if (!isValidProfileKey(profileKey)) {
      throw new Error("decryptGroupChange: modifyMemberProfileKey had invalid profileKey");
    }
    return { uuid, profileKey };
  }));
  result.addPendingMembers = (0, import_lodash.compact)((actions.addPendingMembers || []).map((addPendingMember) => {
    (0, import_assert.strictAssert)(addPendingMember.added, "decryptGroupChange: addPendingMember was missing added field!");
    const decrypted = decryptMemberPendingProfileKey(clientZkGroupCipher, addPendingMember.added, logId);
    if (!decrypted) {
      return null;
    }
    return {
      added: decrypted
    };
  }));
  result.deletePendingMembers = (0, import_lodash.compact)((actions.deletePendingMembers || []).map((deletePendingMember) => {
    const { deletedUserId } = deletePendingMember;
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(deletedUserId), "decryptGroupChange: deletePendingMembers.deletedUserId was missing");
    let userId;
    try {
      userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, deletedUserId), "actions.deletePendingMembers.deletedUserId");
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt deletePendingMembers.deletedUserId. Dropping member.`, error && error.stack ? error.stack : error);
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(userId)) {
      log.warn(`decryptGroupChange/${logId}: Dropping deletePendingMember due to invalid deletedUserId`);
      return null;
    }
    return {
      deletedUserId: userId
    };
  }));
  result.promotePendingMembers = (0, import_lodash.compact)((actions.promotePendingMembers || []).map((promotePendingMember) => {
    let { userId, profileKey: encryptedProfileKey } = promotePendingMember;
    if (Bytes.isEmpty(userId) || Bytes.isEmpty(encryptedProfileKey)) {
      const { presentation } = promotePendingMember;
      (0, import_assert.strictAssert)(Bytes.isNotEmpty(presentation), "decryptGroupChange: promotePendingMember.presentation was missing");
      const decodedPresentation = (0, import_zkgroup.decodeProfileKeyCredentialPresentation)(presentation);
      ({ userId, profileKey: encryptedProfileKey } = decodedPresentation);
    }
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(userId), "decryptGroupChange: promotePendingMembers.userId was missing");
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(encryptedProfileKey), "decryptGroupChange: promotePendingMembers.profileKey was missing");
    let uuid;
    let profileKey;
    try {
      uuid = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, userId), "actions.promotePendingMembers.userId");
      profileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, encryptedProfileKey, uuid);
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt promotePendingMembers.userId/profileKey. Dropping member.`, Errors.toLogFormat(error));
      return null;
    }
    if (!isValidProfileKey(profileKey)) {
      throw new Error("decryptGroupChange: promotePendingMembers had invalid profileKey");
    }
    return { uuid, profileKey };
  }));
  result.promoteMembersPendingPniAciProfileKey = (0, import_lodash.compact)((actions.promoteMembersPendingPniAciProfileKey || []).map((promotePendingMember) => {
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(promotePendingMember.userId), "decryptGroupChange: promoteMembersPendingPniAciProfileKey.userId was missing");
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(promotePendingMember.pni), "decryptGroupChange: promoteMembersPendingPniAciProfileKey.pni was missing");
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(promotePendingMember.profileKey), "decryptGroupChange: promoteMembersPendingPniAciProfileKey.profileKey was missing");
    let userId;
    let pni;
    let profileKey;
    try {
      userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, promotePendingMember.userId), "actions.promoteMembersPendingPniAciProfileKey.userId");
      pni = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, promotePendingMember.pni), "actions.promoteMembersPendingPniAciProfileKey.pni");
      profileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, promotePendingMember.profileKey, import_UUID.UUID.cast(userId));
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt promoteMembersPendingPniAciProfileKey. Dropping member.`, Errors.toLogFormat(error));
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(userId)) {
      log.warn(`decryptGroupChange/${logId}: Dropping promoteMembersPendingPniAciProfileKey due to invalid ACI`);
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(pni)) {
      log.warn(`decryptGroupChange/${logId}: Dropping promoteMembersPendingPniAciProfileKey due to invalid PNI`);
      return null;
    }
    if (!isValidProfileKey(profileKey)) {
      throw new Error("decryptGroupChange: promoteMembersPendingPniAciProfileKey had invalid profileKey");
    }
    return {
      aci: userId,
      pni,
      profileKey
    };
  }));
  if (actions.modifyTitle) {
    const { title } = actions.modifyTitle;
    if (Bytes.isNotEmpty(title)) {
      try {
        result.modifyTitle = {
          title: import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, title))
        };
      } catch (error) {
        log.warn(`decryptGroupChange/${logId}: Unable to decrypt modifyTitle.title`, error && error.stack ? error.stack : error);
      }
    } else {
      result.modifyTitle = {};
    }
  }
  result.modifyAvatar = actions.modifyAvatar;
  if (actions.modifyDisappearingMessagesTimer) {
    const { timer } = actions.modifyDisappearingMessagesTimer;
    if (Bytes.isNotEmpty(timer)) {
      try {
        result.modifyDisappearingMessagesTimer = {
          timer: import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, timer))
        };
      } catch (error) {
        log.warn(`decryptGroupChange/${logId}: Unable to decrypt modifyDisappearingMessagesTimer.timer`, error && error.stack ? error.stack : error);
      }
    } else {
      result.modifyDisappearingMessagesTimer = {};
    }
  }
  if (actions.modifyAttributesAccess) {
    const attributesAccess = (0, import_dropNull.dropNull)(actions.modifyAttributesAccess.attributesAccess);
    (0, import_assert.strictAssert)(isValidAccess(attributesAccess), `decryptGroupChange: modifyAttributesAccess.attributesAccess was not valid: ${actions.modifyAttributesAccess.attributesAccess}`);
    result.modifyAttributesAccess = {
      attributesAccess
    };
  }
  if (actions.modifyMemberAccess) {
    const membersAccess = (0, import_dropNull.dropNull)(actions.modifyMemberAccess.membersAccess);
    (0, import_assert.strictAssert)(isValidAccess(membersAccess), `decryptGroupChange: modifyMemberAccess.membersAccess was not valid: ${actions.modifyMemberAccess.membersAccess}`);
    result.modifyMemberAccess = {
      membersAccess
    };
  }
  if (actions.modifyAddFromInviteLinkAccess) {
    const addFromInviteLinkAccess = (0, import_dropNull.dropNull)(actions.modifyAddFromInviteLinkAccess.addFromInviteLinkAccess);
    (0, import_assert.strictAssert)(isValidLinkAccess(addFromInviteLinkAccess), `decryptGroupChange: modifyAddFromInviteLinkAccess.addFromInviteLinkAccess was not valid: ${actions.modifyAddFromInviteLinkAccess.addFromInviteLinkAccess}`);
    result.modifyAddFromInviteLinkAccess = {
      addFromInviteLinkAccess
    };
  }
  result.addMemberPendingAdminApprovals = (0, import_lodash.compact)((actions.addMemberPendingAdminApprovals || []).map((addPendingAdminApproval) => {
    const { added } = addPendingAdminApproval;
    (0, import_assert.strictAssert)(added, "decryptGroupChange: addPendingAdminApproval was missing added field!");
    const decrypted = decryptMemberPendingAdminApproval(clientZkGroupCipher, added, logId);
    if (!decrypted) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt addPendingAdminApproval.added. Dropping member.`);
      return null;
    }
    return { added: decrypted };
  }));
  result.deleteMemberPendingAdminApprovals = (0, import_lodash.compact)((actions.deleteMemberPendingAdminApprovals || []).map((deletePendingApproval) => {
    const { deletedUserId } = deletePendingApproval;
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(deletedUserId), "decryptGroupChange: deletePendingApproval.deletedUserId was missing");
    let userId;
    try {
      userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, deletedUserId), "actions.deleteMemberPendingAdminApprovals");
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt deletePendingApproval.deletedUserId. Dropping member.`, error && error.stack ? error.stack : error);
      return null;
    }
    if (!(0, import_UUID.isValidUuid)(userId)) {
      log.warn(`decryptGroupChange/${logId}: Dropping deletePendingApproval due to invalid deletedUserId`);
      return null;
    }
    return { deletedUserId: userId };
  }));
  result.promoteMemberPendingAdminApprovals = (0, import_lodash.compact)((actions.promoteMemberPendingAdminApprovals || []).map((promoteAdminApproval) => {
    const { userId } = promoteAdminApproval;
    (0, import_assert.strictAssert)(Bytes.isNotEmpty(userId), "decryptGroupChange: promoteAdminApproval.userId was missing");
    let decryptedUserId;
    try {
      decryptedUserId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, userId), "actions.promoteMemberPendingAdminApprovals.userId");
    } catch (error) {
      log.warn(`decryptGroupChange/${logId}: Unable to decrypt promoteAdminApproval.userId. Dropping member.`, error && error.stack ? error.stack : error);
      return null;
    }
    const role = (0, import_dropNull.dropNull)(promoteAdminApproval.role);
    if (!isValidRole(role)) {
      throw new Error(`decryptGroupChange: promoteAdminApproval had invalid role ${promoteAdminApproval.role}`);
    }
    return { role, userId: decryptedUserId };
  }));
  if (actions.modifyInviteLinkPassword) {
    const { inviteLinkPassword: password } = actions.modifyInviteLinkPassword;
    if (Bytes.isNotEmpty(password)) {
      result.modifyInviteLinkPassword = {
        inviteLinkPassword: Bytes.toBase64(password)
      };
    } else {
      result.modifyInviteLinkPassword = {};
    }
  }
  if (actions.modifyDescription) {
    const { descriptionBytes } = actions.modifyDescription;
    if (Bytes.isNotEmpty(descriptionBytes)) {
      try {
        result.modifyDescription = {
          descriptionBytes: import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, descriptionBytes))
        };
      } catch (error) {
        log.warn(`decryptGroupChange/${logId}: Unable to decrypt modifyDescription.descriptionBytes`, error && error.stack ? error.stack : error);
      }
    } else {
      result.modifyDescription = {};
    }
  }
  if (actions.modifyAnnouncementsOnly) {
    const { announcementsOnly } = actions.modifyAnnouncementsOnly;
    result.modifyAnnouncementsOnly = {
      announcementsOnly: Boolean(announcementsOnly)
    };
  }
  if (actions.addMembersBanned && actions.addMembersBanned.length > 0) {
    result.addMembersBanned = actions.addMembersBanned.map((item) => {
      if (!item.added || !item.added.userId) {
        log.warn(`decryptGroupChange/${logId}: addMembersBanned had a blank entry`);
        return null;
      }
      const uuid = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, item.added.userId), "addMembersBanned.added.userId");
      const timestamp = normalizeTimestamp(item.added.timestamp);
      return { uuid, timestamp };
    }).filter(import_isNotNil.isNotNil);
  }
  if (actions.deleteMembersBanned && actions.deleteMembersBanned.length > 0) {
    result.deleteMembersBanned = actions.deleteMembersBanned.map((item) => {
      if (!item.deletedUserId) {
        log.warn(`decryptGroupChange/${logId}: deleteMembersBanned had a blank entry`);
        return null;
      }
      return (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, item.deletedUserId), "deleteMembersBanned.deletedUserId");
    }).filter(import_isNotNil.isNotNil);
  }
  return result;
}
function decryptGroupTitle(title, secretParams) {
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  if (!title || !title.length) {
    return void 0;
  }
  const blob = import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, title));
  if (blob && blob.content === "title") {
    return (0, import_dropNull.dropNull)(blob.title);
  }
  return void 0;
}
function decryptGroupDescription(description, secretParams) {
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  if (!description || !description.length) {
    return void 0;
  }
  const blob = import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, description));
  if (blob && blob.content === "descriptionText") {
    return (0, import_dropNull.dropNull)(blob.descriptionText);
  }
  return void 0;
}
function decryptGroupState(groupState, groupSecretParams, logId) {
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(groupSecretParams);
  const result = {};
  if (Bytes.isNotEmpty(groupState.title)) {
    try {
      result.title = import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, groupState.title));
    } catch (error) {
      log.warn(`decryptGroupState/${logId}: Unable to decrypt title. Clearing it.`, error && error.stack ? error.stack : error);
    }
  }
  if (groupState.disappearingMessagesTimer && groupState.disappearingMessagesTimer.length) {
    try {
      result.disappearingMessagesTimer = import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, groupState.disappearingMessagesTimer));
    } catch (error) {
      log.warn(`decryptGroupState/${logId}: Unable to decrypt disappearing message timer. Clearing it.`, error && error.stack ? error.stack : error);
    }
  }
  {
    const { accessControl } = groupState;
    (0, import_assert.strictAssert)(accessControl, "No accessControl field found");
    const attributes = (0, import_dropNull.dropNull)(accessControl.attributes);
    const members = (0, import_dropNull.dropNull)(accessControl.members);
    const addFromInviteLink = (0, import_dropNull.dropNull)(accessControl.addFromInviteLink);
    (0, import_assert.strictAssert)(isValidAccess(attributes), `decryptGroupState: Access control for attributes is invalid: ${attributes}`);
    (0, import_assert.strictAssert)(isValidAccess(members), `decryptGroupState: Access control for members is invalid: ${members}`);
    (0, import_assert.strictAssert)(isValidLinkAccess(addFromInviteLink), `decryptGroupState: Access control for invite link is invalid: ${addFromInviteLink}`);
    result.accessControl = {
      attributes,
      members,
      addFromInviteLink
    };
  }
  (0, import_assert.strictAssert)((0, import_lodash.isNumber)(groupState.version), `decryptGroupState: Expected version to be a number; it was ${groupState.version}`);
  result.version = groupState.version;
  if (groupState.members) {
    result.members = (0, import_lodash.compact)(groupState.members.map((member) => decryptMember(clientZkGroupCipher, member, logId)));
  }
  if (groupState.membersPendingProfileKey) {
    result.membersPendingProfileKey = (0, import_lodash.compact)(groupState.membersPendingProfileKey.map((member) => decryptMemberPendingProfileKey(clientZkGroupCipher, member, logId)));
  }
  if (groupState.membersPendingAdminApproval) {
    result.membersPendingAdminApproval = (0, import_lodash.compact)(groupState.membersPendingAdminApproval.map((member) => decryptMemberPendingAdminApproval(clientZkGroupCipher, member, logId)));
  }
  if (Bytes.isNotEmpty(groupState.inviteLinkPassword)) {
    result.inviteLinkPassword = Bytes.toBase64(groupState.inviteLinkPassword);
  }
  if (Bytes.isNotEmpty(groupState.descriptionBytes)) {
    try {
      result.descriptionBytes = import_protobuf.SignalService.GroupAttributeBlob.decode((0, import_zkgroup.decryptGroupBlob)(clientZkGroupCipher, groupState.descriptionBytes));
    } catch (error) {
      log.warn(`decryptGroupState/${logId}: Unable to decrypt descriptionBytes. Clearing it.`, error && error.stack ? error.stack : error);
    }
  }
  const { announcementsOnly } = groupState;
  result.announcementsOnly = Boolean(announcementsOnly);
  const { membersBanned } = groupState;
  if (membersBanned && membersBanned.length > 0) {
    result.membersBanned = membersBanned.map((item) => {
      if (!item.userId) {
        log.warn(`decryptGroupState/${logId}: membersBanned had a blank entry`);
        return null;
      }
      const uuid = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, item.userId), "membersBanned.added.userId");
      const timestamp = item.timestamp?.toNumber() ?? 0;
      return { uuid, timestamp };
    }).filter(import_isNotNil.isNotNil);
  } else {
    result.membersBanned = [];
  }
  result.avatar = (0, import_dropNull.dropNull)(groupState.avatar);
  return result;
}
function decryptMember(clientZkGroupCipher, member, logId) {
  (0, import_assert.strictAssert)(Bytes.isNotEmpty(member.userId), "decryptMember: Member had missing userId");
  let userId;
  try {
    userId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, member.userId), "decryptMember.userId");
  } catch (error) {
    log.warn(`decryptMember/${logId}: Unable to decrypt member userid. Dropping member.`, error && error.stack ? error.stack : error);
    return void 0;
  }
  if (!(0, import_UUID.isValidUuid)(userId)) {
    log.warn(`decryptMember/${logId}: Dropping member due to invalid userId`);
    return void 0;
  }
  (0, import_assert.strictAssert)(Bytes.isNotEmpty(member.profileKey), "decryptMember: Member had missing profileKey");
  const profileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, member.profileKey, import_UUID.UUID.cast(userId));
  if (!isValidProfileKey(profileKey)) {
    throw new Error("decryptMember: Member had invalid profileKey");
  }
  const role = (0, import_dropNull.dropNull)(member.role);
  if (!isValidRole(role)) {
    throw new Error(`decryptMember: Member had invalid role ${member.role}`);
  }
  return {
    userId,
    profileKey,
    role,
    joinedAtVersion: (0, import_dropNull.dropNull)(member.joinedAtVersion)
  };
}
function decryptMemberPendingProfileKey(clientZkGroupCipher, member, logId) {
  (0, import_assert.strictAssert)(Bytes.isNotEmpty(member.addedByUserId), "decryptMemberPendingProfileKey: Member had missing addedByUserId");
  let addedByUserId;
  try {
    addedByUserId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, member.addedByUserId), "decryptMemberPendingProfileKey.addedByUserId");
  } catch (error) {
    log.warn(`decryptMemberPendingProfileKey/${logId}: Unable to decrypt pending member addedByUserId. Dropping member.`, error && error.stack ? error.stack : error);
    return void 0;
  }
  if (!(0, import_UUID.isValidUuid)(addedByUserId)) {
    log.warn(`decryptMemberPendingProfileKey/${logId}: Dropping pending member due to invalid addedByUserId`);
    return void 0;
  }
  const timestamp = normalizeTimestamp(member.timestamp);
  if (!member.member) {
    log.warn(`decryptMemberPendingProfileKey/${logId}: Dropping pending member due to missing member details`);
    return void 0;
  }
  const { userId, profileKey } = member.member;
  (0, import_assert.strictAssert)(Bytes.isNotEmpty(userId), "decryptMemberPendingProfileKey: Member had missing member.userId");
  let decryptedUserId;
  try {
    decryptedUserId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, userId), "decryptMemberPendingProfileKey.member.userId");
  } catch (error) {
    log.warn(`decryptMemberPendingProfileKey/${logId}: Unable to decrypt pending member userId. Dropping member.`, error && error.stack ? error.stack : error);
    return void 0;
  }
  if (!(0, import_UUID.isValidUuid)(decryptedUserId)) {
    log.warn(`decryptMemberPendingProfileKey/${logId}: Dropping pending member due to invalid member.userId`);
    return void 0;
  }
  let decryptedProfileKey;
  if (Bytes.isNotEmpty(profileKey)) {
    try {
      decryptedProfileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, profileKey, import_UUID.UUID.cast(decryptedUserId));
    } catch (error) {
      log.warn(`decryptMemberPendingProfileKey/${logId}: Unable to decrypt pending member profileKey. Dropping profileKey.`, error && error.stack ? error.stack : error);
    }
    if (!isValidProfileKey(decryptedProfileKey)) {
      log.warn(`decryptMemberPendingProfileKey/${logId}: Dropping profileKey, since it was invalid`);
      decryptedProfileKey = void 0;
    }
  }
  const role = (0, import_dropNull.dropNull)(member.member.role);
  (0, import_assert.strictAssert)(isValidRole(role), `decryptMemberPendingProfileKey: Member had invalid role ${role}`);
  return {
    addedByUserId,
    timestamp,
    member: {
      userId: decryptedUserId,
      profileKey: decryptedProfileKey,
      role
    }
  };
}
function decryptMemberPendingAdminApproval(clientZkGroupCipher, member, logId) {
  const timestamp = normalizeTimestamp(member.timestamp);
  const { userId, profileKey } = member;
  (0, import_assert.strictAssert)(Bytes.isNotEmpty(userId), "decryptMemberPendingAdminApproval: Missing userId");
  let decryptedUserId;
  try {
    decryptedUserId = (0, import_normalizeUuid.normalizeUuid)((0, import_zkgroup.decryptUuid)(clientZkGroupCipher, userId), "decryptMemberPendingAdminApproval.userId");
  } catch (error) {
    log.warn(`decryptMemberPendingAdminApproval/${logId}: Unable to decrypt pending member userId. Dropping member.`, error && error.stack ? error.stack : error);
    return void 0;
  }
  if (!(0, import_UUID.isValidUuid)(decryptedUserId)) {
    log.warn(`decryptMemberPendingAdminApproval/${logId}: Invalid userId. Dropping member.`);
    return void 0;
  }
  let decryptedProfileKey;
  if (Bytes.isNotEmpty(profileKey)) {
    try {
      decryptedProfileKey = (0, import_zkgroup.decryptProfileKey)(clientZkGroupCipher, profileKey, import_UUID.UUID.cast(decryptedUserId));
    } catch (error) {
      log.warn(`decryptMemberPendingAdminApproval/${logId}: Unable to decrypt profileKey. Dropping profileKey.`, error && error.stack ? error.stack : error);
    }
    if (!isValidProfileKey(decryptedProfileKey)) {
      log.warn(`decryptMemberPendingAdminApproval/${logId}: Dropping profileKey, since it was invalid`);
      decryptedProfileKey = void 0;
    }
  }
  return {
    timestamp,
    userId: decryptedUserId,
    profileKey: decryptedProfileKey
  };
}
function getMembershipList(conversationId) {
  const conversation = window.ConversationController.get(conversationId);
  if (!conversation) {
    throw new Error("getMembershipList: cannot find conversation");
  }
  const secretParams = conversation.get("secretParams");
  if (!secretParams) {
    throw new Error("getMembershipList: no secretParams");
  }
  const clientZkGroupCipher = (0, import_zkgroup.getClientZkGroupCipher)(secretParams);
  return conversation.getMembers().map((member) => {
    const uuid = member.getCheckedUuid("getMembershipList: member has no UUID");
    const uuidCiphertext = (0, import_zkgroup.encryptUuid)(clientZkGroupCipher, uuid);
    return { uuid: uuid.toString(), uuidCiphertext };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ID_LENGTH,
  ID_V1_LENGTH,
  LINK_VERSION_ERROR,
  MASTER_KEY_LENGTH,
  _isGroupChangeMessageBounceable,
  _maybeBuildAddBannedMemberActions,
  _mergeGroupChangeMessages,
  applyNewAvatar,
  buildAccessControlAddFromInviteLinkChange,
  buildAccessControlAttributesChange,
  buildAccessControlMembersChange,
  buildAddBannedMemberChange,
  buildAddMember,
  buildAddMembersChange,
  buildAddPendingAdminApprovalMemberChange,
  buildAnnouncementsOnlyChange,
  buildDeleteMemberChange,
  buildDeletePendingAdminApprovalMemberChange,
  buildDeletePendingMemberChange,
  buildDisappearingMessagesTimerChange,
  buildGroupLink,
  buildInviteLinkPasswordChange,
  buildMigrationBubble,
  buildModifyMemberRoleChange,
  buildNewGroupLinkChange,
  buildPromoteMemberChange,
  buildPromotePendingAdminApprovalMemberChange,
  buildUpdateAttributesChange,
  createGroupV2,
  decryptGroupAvatar,
  decryptGroupDescription,
  decryptGroupTitle,
  deriveGroupFields,
  fetchMembershipProof,
  generateGroupInviteLinkPassword,
  getBasicMigrationBubble,
  getGroupMigrationMembers,
  getMembershipList,
  getPreJoinGroupInfo,
  hasV1GroupBeenMigrated,
  idForLogging,
  initiateMigrationToGroupV2,
  isGroupEligibleToMigrate,
  joinGroupV2ViaLinkAndMigrate,
  joinViaLink,
  maybeDeriveGroupV2Id,
  maybeUpdateGroup,
  modifyGroupV2,
  parseGroupLink,
  respondToGroupV2Migration,
  waitThenMaybeUpdateGroup,
  waitThenRespondToGroupV2Migration
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ3JvdXBzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHtcbiAgY29tcGFjdCxcbiAgZGlmZmVyZW5jZSxcbiAgZmxhdHRlbixcbiAgZnJvbVBhaXJzLFxuICBpc051bWJlcixcbiAgdmFsdWVzLFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IExvbmcgZnJvbSAnbG9uZyc7XG5pbXBvcnQgdHlwZSB7IENsaWVudFprR3JvdXBDaXBoZXIgfSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQvemtncm91cCc7XG5pbXBvcnQgeyB2NCBhcyBnZXRHdWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgTFJVIGZyb20gJ2xydS1jYWNoZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQge1xuICBnZXRDaGVja2VkQ3JlZGVudGlhbHNGb3JUb2RheSxcbiAgbWF5YmVGZXRjaE5ld0NyZWRlbnRpYWxzLFxufSBmcm9tICcuL3NlcnZpY2VzL2dyb3VwQ3JlZGVudGlhbEZldGNoZXInO1xuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi9zcWwvQ2xpZW50JztcbmltcG9ydCB7IHRvV2ViU2FmZUJhc2U2NCwgZnJvbVdlYlNhZmVCYXNlNjQgfSBmcm9tICcuL3V0aWwvd2ViU2FmZUJhc2U2NCc7XG5pbXBvcnQgeyBhc3NlcnQsIHN0cmljdEFzc2VydCB9IGZyb20gJy4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgaXNNb3JlUmVjZW50VGhhbiB9IGZyb20gJy4vdXRpbC90aW1lc3RhbXAnO1xuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVXVpZCB9IGZyb20gJy4vdXRpbC9ub3JtYWxpemVVdWlkJztcbmltcG9ydCB7IGRyb3BOdWxsIH0gZnJvbSAnLi91dGlsL2Ryb3BOdWxsJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIEdyb3VwVjJNZW1iZXJUeXBlLFxuICBHcm91cFYyUGVuZGluZ0FkbWluQXBwcm92YWxUeXBlLFxuICBHcm91cFYyUGVuZGluZ01lbWJlclR5cGUsXG4gIEdyb3VwVjJCYW5uZWRNZW1iZXJUeXBlLFxuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG59IGZyb20gJy4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQge1xuICBjcmVhdGVQcm9maWxlS2V5Q3JlZGVudGlhbFByZXNlbnRhdGlvbixcbiAgY3JlYXRlUE5JQ3JlZGVudGlhbFByZXNlbnRhdGlvbixcbiAgZGVjb2RlUHJvZmlsZUtleUNyZWRlbnRpYWxQcmVzZW50YXRpb24sXG4gIGRlY3J5cHRHcm91cEJsb2IsXG4gIGRlY3J5cHRQcm9maWxlS2V5LFxuICBkZWNyeXB0VXVpZCxcbiAgZGVyaXZlR3JvdXBJRCxcbiAgZGVyaXZlR3JvdXBQdWJsaWNQYXJhbXMsXG4gIGRlcml2ZUdyb3VwU2VjcmV0UGFyYW1zLFxuICBlbmNyeXB0R3JvdXBCbG9iLFxuICBlbmNyeXB0VXVpZCxcbiAgZ2V0QXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb24sXG4gIGdldENsaWVudFprQXV0aE9wZXJhdGlvbnMsXG4gIGdldENsaWVudFprR3JvdXBDaXBoZXIsXG4gIGdldENsaWVudFprUHJvZmlsZU9wZXJhdGlvbnMsXG4gIHZlcmlmeU5vdGFyeVNpZ25hdHVyZSxcbn0gZnJvbSAnLi91dGlsL3prZ3JvdXAnO1xuaW1wb3J0IHtcbiAgY29tcHV0ZUhhc2gsXG4gIGRlcml2ZU1hc3RlcktleUZyb21Hcm91cFYxLFxuICBnZXRSYW5kb21CeXRlcyxcbn0gZnJvbSAnLi9DcnlwdG8nO1xuaW1wb3J0IHR5cGUge1xuICBHcm91cENyZWRlbnRpYWxzVHlwZSxcbiAgR3JvdXBMb2dSZXNwb25zZVR5cGUsXG59IGZyb20gJy4vdGV4dHNlY3VyZS9XZWJBUEknO1xuaW1wb3J0IHsgSFRUUEVycm9yIH0gZnJvbSAnLi90ZXh0c2VjdXJlL0Vycm9ycyc7XG5pbXBvcnQgdHlwZSBNZXNzYWdlU2VuZGVyIGZyb20gJy4vdGV4dHNlY3VyZS9TZW5kTWVzc2FnZSc7XG5pbXBvcnQgeyBDVVJSRU5UX1NDSEVNQV9WRVJTSU9OIGFzIE1BWF9NRVNTQUdFX1NDSEVNQSB9IGZyb20gJy4vdHlwZXMvTWVzc2FnZTInO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgZ2V0R3JvdXBTaXplSGFyZExpbWl0IH0gZnJvbSAnLi9ncm91cHMvbGltaXRzJztcbmltcG9ydCB7XG4gIGlzR3JvdXBWMSBhcyBnZXRJc0dyb3VwVjEsXG4gIGlzR3JvdXBWMiBhcyBnZXRJc0dyb3VwVjIsXG4gIGlzTWUsXG59IGZyb20gJy4vdXRpbC93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4vQnl0ZXMnO1xuaW1wb3J0IHR5cGUgeyBBdmF0YXJEYXRhVHlwZSB9IGZyb20gJy4vdHlwZXMvQXZhdGFyJztcbmltcG9ydCB7IFVVSUQsIFVVSURLaW5kLCBpc1ZhbGlkVXVpZCB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi90eXBlcy9VVUlEJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi9wcm90b2J1Zic7XG5pbXBvcnQgeyBpc05vdE5pbCB9IGZyb20gJy4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBpc0FjY2Vzc0NvbnRyb2xFbmFibGVkIH0gZnJvbSAnLi9ncm91cHMvdXRpbCc7XG5cbmltcG9ydCB7XG4gIGNvbnZlcnNhdGlvbkpvYlF1ZXVlLFxuICBjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0sXG59IGZyb20gJy4vam9icy9jb252ZXJzYXRpb25Kb2JRdWV1ZSc7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBTZWVuU3RhdHVzIH0gZnJvbSAnLi9NZXNzYWdlU2VlblN0YXR1cyc7XG5cbnR5cGUgQWNjZXNzUmVxdWlyZWRFbnVtID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcblxuZXhwb3J0IHsgam9pblZpYUxpbmsgfSBmcm9tICcuL2dyb3Vwcy9qb2luVmlhTGluayc7XG5cbnR5cGUgR3JvdXBWMkFjY2Vzc0NyZWF0ZUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdjcmVhdGUnO1xufTtcbnR5cGUgR3JvdXBWMkFjY2Vzc0F0dHJpYnV0ZXNDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAnYWNjZXNzLWF0dHJpYnV0ZXMnO1xuICBuZXdQcml2aWxlZ2U6IG51bWJlcjtcbn07XG50eXBlIEdyb3VwVjJBY2Nlc3NNZW1iZXJzQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ2FjY2Vzcy1tZW1iZXJzJztcbiAgbmV3UHJpdmlsZWdlOiBudW1iZXI7XG59O1xudHlwZSBHcm91cFYyQWNjZXNzSW52aXRlTGlua0NoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdhY2Nlc3MtaW52aXRlLWxpbmsnO1xuICBuZXdQcml2aWxlZ2U6IG51bWJlcjtcbn07XG50eXBlIEdyb3VwVjJBbm5vdW5jZW1lbnRzT25seUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdhbm5vdW5jZW1lbnRzLW9ubHknO1xuICBhbm5vdW5jZW1lbnRzT25seTogYm9vbGVhbjtcbn07XG50eXBlIEdyb3VwVjJBdmF0YXJDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAnYXZhdGFyJztcbiAgcmVtb3ZlZDogYm9vbGVhbjtcbn07XG50eXBlIEdyb3VwVjJUaXRsZUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICd0aXRsZSc7XG4gIC8vIEFsbG93IGZvciBudWxsLCBiZWNhdXNlIHRoZSB0aXRsZSBjb3VsZCBiZSByZW1vdmVkIGVudGlyZWx5XG4gIG5ld1RpdGxlPzogc3RyaW5nO1xufTtcbnR5cGUgR3JvdXBWMkdyb3VwTGlua0FkZENoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdncm91cC1saW5rLWFkZCc7XG4gIHByaXZpbGVnZTogbnVtYmVyO1xufTtcbnR5cGUgR3JvdXBWMkdyb3VwTGlua1Jlc2V0Q2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ2dyb3VwLWxpbmstcmVzZXQnO1xufTtcbnR5cGUgR3JvdXBWMkdyb3VwTGlua1JlbW92ZUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdncm91cC1saW5rLXJlbW92ZSc7XG59O1xuXG4vLyBObyBkaXNhcHBlYXJpbmcgbWVzc2FnZXMgdGltZXIgY2hhbmdlIHR5cGUgLSBtZXNzYWdlLmV4cGlyYXRpb25UaW1lclVwZGF0ZSB1c2VkIGluc3RlYWRcblxudHlwZSBHcm91cFYyTWVtYmVyQWRkQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ21lbWJlci1hZGQnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbn07XG50eXBlIEdyb3VwVjJNZW1iZXJBZGRGcm9tSW52aXRlQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ21lbWJlci1hZGQtZnJvbS1pbnZpdGUnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgaW52aXRlcj86IFVVSURTdHJpbmdUeXBlO1xufTtcbnR5cGUgR3JvdXBWMk1lbWJlckFkZEZyb21MaW5rQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ21lbWJlci1hZGQtZnJvbS1saW5rJztcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG59O1xudHlwZSBHcm91cFYyTWVtYmVyQWRkRnJvbUFkbWluQXBwcm92YWxDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAnbWVtYmVyLWFkZC1mcm9tLWFkbWluLWFwcHJvdmFsJztcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG59O1xudHlwZSBHcm91cFYyTWVtYmVyUHJpdmlsZWdlQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ21lbWJlci1wcml2aWxlZ2UnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgbmV3UHJpdmlsZWdlOiBudW1iZXI7XG59O1xudHlwZSBHcm91cFYyTWVtYmVyUmVtb3ZlQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ21lbWJlci1yZW1vdmUnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbn07XG5cbnR5cGUgR3JvdXBWMlBlbmRpbmdBZGRPbmVDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAncGVuZGluZy1hZGQtb25lJztcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG59O1xudHlwZSBHcm91cFYyUGVuZGluZ0FkZE1hbnlDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAncGVuZGluZy1hZGQtbWFueSc7XG4gIGNvdW50OiBudW1iZXI7XG59O1xuLy8gTm90ZTogcGVuZGluZy1yZW1vdmUgaXMgb25seSB1c2VkIGlmIHVzZXIgZGlkbid0IGFsc28gam9pbiB0aGUgZ3JvdXAgYXQgdGhlIHNhbWUgdGltZVxudHlwZSBHcm91cFYyUGVuZGluZ1JlbW92ZU9uZUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdwZW5kaW5nLXJlbW92ZS1vbmUnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgaW52aXRlcj86IFVVSURTdHJpbmdUeXBlO1xufTtcbi8vIE5vdGU6IHBlbmRpbmctcmVtb3ZlIGlzIG9ubHkgdXNlZCBpZiB1c2VyIGRpZG4ndCBhbHNvIGpvaW4gdGhlIGdyb3VwIGF0IHRoZSBzYW1lIHRpbWVcbnR5cGUgR3JvdXBWMlBlbmRpbmdSZW1vdmVNYW55Q2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ3BlbmRpbmctcmVtb3ZlLW1hbnknO1xuICBjb3VudDogbnVtYmVyO1xuICBpbnZpdGVyPzogVVVJRFN0cmluZ1R5cGU7XG59O1xuXG50eXBlIEdyb3VwVjJBZG1pbkFwcHJvdmFsQWRkT25lQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbn07XG4vLyBOb3RlOiBhZG1pbi1hcHByb3ZhbC1yZW1vdmUtb25lIGlzIG9ubHkgdXNlZCBpZiB1c2VyIGRpZG4ndCBhbHNvIGpvaW4gdGhlIGdyb3VwIGF0XG4vLyAgIHRoZSBzYW1lIHRpbWVcbnR5cGUgR3JvdXBWMkFkbWluQXBwcm92YWxSZW1vdmVPbmVDaGFuZ2VUeXBlID0ge1xuICB0eXBlOiAnYWRtaW4tYXBwcm92YWwtcmVtb3ZlLW9uZSc7XG4gIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICBpbnZpdGVyPzogVVVJRFN0cmluZ1R5cGU7XG59O1xudHlwZSBHcm91cFYyQWRtaW5BcHByb3ZhbEJvdW5jZUNoYW5nZVR5cGUgPSB7XG4gIHR5cGU6ICdhZG1pbi1hcHByb3ZhbC1ib3VuY2UnO1xuICB0aW1lczogbnVtYmVyO1xuICBpc0FwcHJvdmFsUGVuZGluZzogYm9vbGVhbjtcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBWMkRlc2NyaXB0aW9uQ2hhbmdlVHlwZSA9IHtcbiAgdHlwZTogJ2Rlc2NyaXB0aW9uJztcbiAgcmVtb3ZlZD86IGJvb2xlYW47XG4gIC8vIEFkZGluZyB0aGlzIGZpZWxkOyBjYW5ub3QgcmVtb3ZlIHByZXZpb3VzIGZpZWxkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlID1cbiAgfCBHcm91cFYyQWNjZXNzQXR0cmlidXRlc0NoYW5nZVR5cGVcbiAgfCBHcm91cFYyQWNjZXNzQ3JlYXRlQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBY2Nlc3NJbnZpdGVMaW5rQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBY2Nlc3NNZW1iZXJzQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBZG1pbkFwcHJvdmFsQWRkT25lQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBZG1pbkFwcHJvdmFsUmVtb3ZlT25lQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBZG1pbkFwcHJvdmFsQm91bmNlQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJBbm5vdW5jZW1lbnRzT25seUNoYW5nZVR5cGVcbiAgfCBHcm91cFYyQXZhdGFyQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJEZXNjcmlwdGlvbkNoYW5nZVR5cGVcbiAgfCBHcm91cFYyR3JvdXBMaW5rQWRkQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJHcm91cExpbmtSZW1vdmVDaGFuZ2VUeXBlXG4gIHwgR3JvdXBWMkdyb3VwTGlua1Jlc2V0Q2hhbmdlVHlwZVxuICB8IEdyb3VwVjJNZW1iZXJBZGRDaGFuZ2VUeXBlXG4gIHwgR3JvdXBWMk1lbWJlckFkZEZyb21BZG1pbkFwcHJvdmFsQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJNZW1iZXJBZGRGcm9tSW52aXRlQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJNZW1iZXJBZGRGcm9tTGlua0NoYW5nZVR5cGVcbiAgfCBHcm91cFYyTWVtYmVyUHJpdmlsZWdlQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJNZW1iZXJSZW1vdmVDaGFuZ2VUeXBlXG4gIHwgR3JvdXBWMlBlbmRpbmdBZGRNYW55Q2hhbmdlVHlwZVxuICB8IEdyb3VwVjJQZW5kaW5nQWRkT25lQ2hhbmdlVHlwZVxuICB8IEdyb3VwVjJQZW5kaW5nUmVtb3ZlTWFueUNoYW5nZVR5cGVcbiAgfCBHcm91cFYyUGVuZGluZ1JlbW92ZU9uZUNoYW5nZVR5cGVcbiAgfCBHcm91cFYyVGl0bGVDaGFuZ2VUeXBlO1xuXG5leHBvcnQgdHlwZSBHcm91cFYyQ2hhbmdlVHlwZSA9IHtcbiAgZnJvbT86IFVVSURTdHJpbmdUeXBlO1xuICBkZXRhaWxzOiBBcnJheTxHcm91cFYyQ2hhbmdlRGV0YWlsVHlwZT47XG59O1xuXG5leHBvcnQgdHlwZSBHcm91cEZpZWxkcyA9IHtcbiAgcmVhZG9ubHkgaWQ6IFVpbnQ4QXJyYXk7XG4gIHJlYWRvbmx5IHNlY3JldFBhcmFtczogVWludDhBcnJheTtcbiAgcmVhZG9ubHkgcHVibGljUGFyYW1zOiBVaW50OEFycmF5O1xufTtcblxuY29uc3QgTUFYX0NBQ0hFRF9HUk9VUF9GSUVMRFMgPSAxMDA7XG5cbmNvbnN0IGdyb3VwRmllbGRzQ2FjaGUgPSBuZXcgTFJVPHN0cmluZywgR3JvdXBGaWVsZHM+KHtcbiAgbWF4OiBNQVhfQ0FDSEVEX0dST1VQX0ZJRUxEUyxcbn0pO1xuXG5jb25zdCB7IHVwZGF0ZUNvbnZlcnNhdGlvbiB9ID0gZGF0YUludGVyZmFjZTtcblxuaWYgKCFpc051bWJlcihNQVhfTUVTU0FHRV9TQ0hFTUEpKSB7XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAnZ3JvdXBzLnRzOiBVbmFibGUgdG8gY2FwdHVyZSBtYXggbWVzc2FnZSBzY2hlbWEgZnJvbSBqcy9tb2R1bGVzL3R5cGVzL21lc3NhZ2UnXG4gICk7XG59XG5cbnR5cGUgTWVtYmVyVHlwZSA9IHtcbiAgcHJvZmlsZUtleTogc3RyaW5nO1xuICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbn07XG50eXBlIFVwZGF0ZXNSZXN1bHRUeXBlID0ge1xuICAvLyBUaGUgYXJyYXkgb2YgbmV3IG1lc3NhZ2VzIHRvIGJlIGFkZGVkIGludG8gdGhlIG1lc3NhZ2UgdGltZWxpbmVcbiAgZ3JvdXBDaGFuZ2VNZXNzYWdlczogQXJyYXk8R3JvdXBDaGFuZ2VNZXNzYWdlVHlwZT47XG4gIC8vIFRoZSBzZXQgb2YgbWVtYmVycyBpbiB0aGUgZ3JvdXAsIGFuZCB3ZSBsYXJnZWx5IGp1c3QgcHVsbCBwcm9maWxlIGtleXMgZm9yIGVhY2gsXG4gIC8vICAgYmVjYXVzZSB0aGUgZ3JvdXAgbWVtYmVyc2hpcCBpcyB1cGRhdGVkIGluIG5ld0F0dHJpYnV0ZXNcbiAgbWVtYmVyczogQXJyYXk8TWVtYmVyVHlwZT47XG4gIC8vIFRvIGJlIG1lcmdlZCBpbnRvIHRoZSBjb252ZXJzYXRpb24gbW9kZWxcbiAgbmV3QXR0cmlidXRlczogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG59O1xuXG50eXBlIFVwbG9hZGVkQXZhdGFyVHlwZSA9IHtcbiAgZGF0YTogVWludDhBcnJheTtcbiAgaGFzaDogc3RyaW5nO1xuICBrZXk6IHN0cmluZztcbn07XG5cbnR5cGUgQmFzaWNNZXNzYWdlVHlwZSA9IFBpY2s8XG4gIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgJ2lkJyB8ICdzY2hlbWFWZXJzaW9uJyB8ICdyZWFkU3RhdHVzJyB8ICdzZWVuU3RhdHVzJ1xuPjtcblxudHlwZSBHcm91cFYyQ2hhbmdlTWVzc2FnZVR5cGUgPSB7XG4gIHR5cGU6ICdncm91cC12Mi1jaGFuZ2UnO1xufSAmIFBpY2s8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlLCAnZ3JvdXBWMkNoYW5nZScgfCAnc291cmNlVXVpZCc+O1xuXG50eXBlIEdyb3VwVjFNaWdyYXRpb25NZXNzYWdlVHlwZSA9IHtcbiAgdHlwZTogJ2dyb3VwLXYxLW1pZ3JhdGlvbic7XG59ICYgUGljazxcbiAgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICAnaW52aXRlZEdWMk1lbWJlcnMnIHwgJ2Ryb3BwZWRHVjJNZW1iZXJJZHMnIHwgJ2dyb3VwTWlncmF0aW9uJ1xuPjtcblxudHlwZSBUaW1lck5vdGlmaWNhdGlvbk1lc3NhZ2VUeXBlID0ge1xuICB0eXBlOiAndGltZXItbm90aWZpY2F0aW9uJztcbn0gJiBQaWNrPFxuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gICdzb3VyY2VVdWlkJyB8ICdmbGFncycgfCAnZXhwaXJhdGlvblRpbWVyVXBkYXRlJ1xuPjtcblxudHlwZSBHcm91cENoYW5nZU1lc3NhZ2VUeXBlID0gQmFzaWNNZXNzYWdlVHlwZSAmXG4gIChcbiAgICB8IEdyb3VwVjJDaGFuZ2VNZXNzYWdlVHlwZVxuICAgIHwgR3JvdXBWMU1pZ3JhdGlvbk1lc3NhZ2VUeXBlXG4gICAgfCBUaW1lck5vdGlmaWNhdGlvbk1lc3NhZ2VUeXBlXG4gICk7XG5cbi8vIENvbnN0YW50c1xuXG5leHBvcnQgY29uc3QgTUFTVEVSX0tFWV9MRU5HVEggPSAzMjtcbmNvbnN0IEdST1VQX1RJVExFX01BWF9FTkNSWVBURURfQllURVMgPSAxMDI0O1xuY29uc3QgR1JPVVBfREVTQ19NQVhfRU5DUllQVEVEX0JZVEVTID0gODE5MjtcbmV4cG9ydCBjb25zdCBJRF9WMV9MRU5HVEggPSAxNjtcbmV4cG9ydCBjb25zdCBJRF9MRU5HVEggPSAzMjtcbmNvbnN0IFRFTVBPUkFMX0FVVEhfUkVKRUNURURfQ09ERSA9IDQwMTtcbmNvbnN0IEdST1VQX0FDQ0VTU19ERU5JRURfQ09ERSA9IDQwMztcbmNvbnN0IEdST1VQX05PTkVYSVNURU5UX0NPREUgPSA0MDQ7XG5jb25zdCBTVVBQT1JURURfQ0hBTkdFX0VQT0NIID0gNTtcbmV4cG9ydCBjb25zdCBMSU5LX1ZFUlNJT05fRVJST1IgPSAnTElOS19WRVJTSU9OX0VSUk9SJztcbmNvbnN0IEdST1VQX0lOVklURV9MSU5LX1BBU1NXT1JEX0xFTkdUSCA9IDE2O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJhc2ljTWVzc2FnZSgpOiBCYXNpY01lc3NhZ2VUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogZ2V0R3VpZCgpLFxuICAgIHNjaGVtYVZlcnNpb246IE1BWF9NRVNTQUdFX1NDSEVNQSxcbiAgICAvLyB0aGlzIGlzIG1pc3NpbmcgbW9zdCBwcm9wZXJ0aWVzIHRvIGZ1bGZpbGwgdGhpcyB0eXBlXG4gIH07XG59XG5cbi8vIEdyb3VwIExpbmtzXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUdyb3VwSW52aXRlTGlua1Bhc3N3b3JkKCk6IFVpbnQ4QXJyYXkge1xuICByZXR1cm4gZ2V0UmFuZG9tQnl0ZXMoR1JPVVBfSU5WSVRFX0xJTktfUEFTU1dPUkRfTEVOR1RIKTtcbn1cblxuLy8gR3JvdXAgTGlua3NcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFByZUpvaW5Hcm91cEluZm8oXG4gIGludml0ZUxpbmtQYXNzd29yZEJhc2U2NDogc3RyaW5nLFxuICBtYXN0ZXJLZXlCYXNlNjQ6IHN0cmluZ1xuKTogUHJvbWlzZTxQcm90by5Hcm91cEpvaW5JbmZvPiB7XG4gIGNvbnN0IGRhdGEgPSB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5kZXJpdmVHcm91cEZpZWxkcyhcbiAgICBCeXRlcy5mcm9tQmFzZTY0KG1hc3RlcktleUJhc2U2NClcbiAgKTtcblxuICByZXR1cm4gbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeSh7XG4gICAgbG9nSWQ6IGBnZXRQcmVKb2luSW5mby9ncm91cHYyKCR7ZGF0YS5pZH0pYCxcbiAgICBwdWJsaWNQYXJhbXM6IEJ5dGVzLnRvQmFzZTY0KGRhdGEucHVibGljUGFyYW1zKSxcbiAgICBzZWNyZXRQYXJhbXM6IEJ5dGVzLnRvQmFzZTY0KGRhdGEuc2VjcmV0UGFyYW1zKSxcbiAgICByZXF1ZXN0OiAoc2VuZGVyLCBvcHRpb25zKSA9PlxuICAgICAgc2VuZGVyLmdldEdyb3VwRnJvbUxpbmsoaW52aXRlTGlua1Bhc3N3b3JkQmFzZTY0LCBvcHRpb25zKSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEdyb3VwTGluayhjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsKTogc3RyaW5nIHtcbiAgY29uc3QgeyBtYXN0ZXJLZXksIGdyb3VwSW52aXRlTGlua1Bhc3N3b3JkIH0gPSBjb252ZXJzYXRpb24uYXR0cmlidXRlcztcblxuICBjb25zdCBieXRlcyA9IFByb3RvLkdyb3VwSW52aXRlTGluay5lbmNvZGUoe1xuICAgIHYxQ29udGVudHM6IHtcbiAgICAgIGdyb3VwTWFzdGVyS2V5OiBCeXRlcy5mcm9tQmFzZTY0KG1hc3RlcktleSksXG4gICAgICBpbnZpdGVMaW5rUGFzc3dvcmQ6IEJ5dGVzLmZyb21CYXNlNjQoZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQpLFxuICAgIH0sXG4gIH0pLmZpbmlzaCgpO1xuXG4gIGNvbnN0IGhhc2ggPSB0b1dlYlNhZmVCYXNlNjQoQnl0ZXMudG9CYXNlNjQoYnl0ZXMpKTtcblxuICByZXR1cm4gYGh0dHBzOi8vc2lnbmFsLmdyb3VwLyMke2hhc2h9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3JvdXBMaW5rKGhhc2g6IHN0cmluZyk6IHtcbiAgbWFzdGVyS2V5OiBzdHJpbmc7XG4gIGludml0ZUxpbmtQYXNzd29yZDogc3RyaW5nO1xufSB7XG4gIGNvbnN0IGJhc2U2NCA9IGZyb21XZWJTYWZlQmFzZTY0KGhhc2gpO1xuICBjb25zdCBidWZmZXIgPSBCeXRlcy5mcm9tQmFzZTY0KGJhc2U2NCk7XG5cbiAgY29uc3QgaW52aXRlTGlua1Byb3RvID0gUHJvdG8uR3JvdXBJbnZpdGVMaW5rLmRlY29kZShidWZmZXIpO1xuICBpZiAoXG4gICAgaW52aXRlTGlua1Byb3RvLmNvbnRlbnRzICE9PSAndjFDb250ZW50cycgfHxcbiAgICAhaW52aXRlTGlua1Byb3RvLnYxQ29udGVudHNcbiAgKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAncGFyc2VHcm91cExpbms6IFBhcnNlZCBwcm90byBpcyBtaXNzaW5nIHYxQ29udGVudHMnXG4gICAgKTtcbiAgICBlcnJvci5uYW1lID0gTElOS19WRVJTSU9OX0VSUk9SO1xuICAgIHRocm93IGVycm9yO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGdyb3VwTWFzdGVyS2V5OiBncm91cE1hc3RlcktleVJhdyxcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQ6IGludml0ZUxpbmtQYXNzd29yZFJhdyxcbiAgfSA9IGludml0ZUxpbmtQcm90by52MUNvbnRlbnRzO1xuXG4gIGlmICghZ3JvdXBNYXN0ZXJLZXlSYXcgfHwgIWdyb3VwTWFzdGVyS2V5UmF3Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndjFDb250ZW50cy5ncm91cE1hc3RlcktleSBoYWQgbm8gZGF0YSEnKTtcbiAgfVxuICBpZiAoIWludml0ZUxpbmtQYXNzd29yZFJhdyB8fCAhaW52aXRlTGlua1Bhc3N3b3JkUmF3Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndjFDb250ZW50cy5pbnZpdGVMaW5rUGFzc3dvcmQgaGFkIG5vIGRhdGEhJyk7XG4gIH1cblxuICBjb25zdCBtYXN0ZXJLZXkgPSBCeXRlcy50b0Jhc2U2NChncm91cE1hc3RlcktleVJhdyk7XG4gIGlmIChtYXN0ZXJLZXkubGVuZ3RoICE9PSA0NCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbWFzdGVyS2V5IGhhZCB1bmV4cGVjdGVkIGxlbmd0aCAke21hc3RlcktleS5sZW5ndGh9YCk7XG4gIH1cbiAgY29uc3QgaW52aXRlTGlua1Bhc3N3b3JkID0gQnl0ZXMudG9CYXNlNjQoaW52aXRlTGlua1Bhc3N3b3JkUmF3KTtcbiAgaWYgKGludml0ZUxpbmtQYXNzd29yZC5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgaW52aXRlTGlua1Bhc3N3b3JkIGhhZCB1bmV4cGVjdGVkIGxlbmd0aCAke2ludml0ZUxpbmtQYXNzd29yZC5sZW5ndGh9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4geyBtYXN0ZXJLZXksIGludml0ZUxpbmtQYXNzd29yZCB9O1xufVxuXG4vLyBHcm91cCBNb2RpZmljYXRpb25zXG5cbmFzeW5jIGZ1bmN0aW9uIHVwbG9hZEF2YXRhcihcbiAgb3B0aW9uczoge1xuICAgIGxvZ0lkOiBzdHJpbmc7XG4gICAgcHVibGljUGFyYW1zOiBzdHJpbmc7XG4gICAgc2VjcmV0UGFyYW1zOiBzdHJpbmc7XG4gIH0gJiAoeyBwYXRoOiBzdHJpbmcgfSB8IHsgZGF0YTogVWludDhBcnJheSB9KVxuKTogUHJvbWlzZTxVcGxvYWRlZEF2YXRhclR5cGU+IHtcbiAgY29uc3QgeyBsb2dJZCwgcHVibGljUGFyYW1zLCBzZWNyZXRQYXJhbXMgfSA9IG9wdGlvbnM7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihzZWNyZXRQYXJhbXMpO1xuXG4gICAgbGV0IGRhdGE6IFVpbnQ4QXJyYXk7XG4gICAgaWYgKCdkYXRhJyBpbiBvcHRpb25zKSB7XG4gICAgICAoeyBkYXRhIH0gPSBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5yZWFkQXR0YWNobWVudERhdGEob3B0aW9ucy5wYXRoKTtcbiAgICB9XG5cbiAgICBjb25zdCBoYXNoID0gY29tcHV0ZUhhc2goZGF0YSk7XG5cbiAgICBjb25zdCBibG9iUGxhaW50ZXh0ID0gUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmVuY29kZSh7XG4gICAgICBhdmF0YXI6IGRhdGEsXG4gICAgfSkuZmluaXNoKCk7XG4gICAgY29uc3QgY2lwaGVydGV4dCA9IGVuY3J5cHRHcm91cEJsb2IoY2xpZW50WmtHcm91cENpcGhlciwgYmxvYlBsYWludGV4dCk7XG5cbiAgICBjb25zdCBrZXkgPSBhd2FpdCBtYWtlUmVxdWVzdFdpdGhUZW1wb3JhbFJldHJ5KHtcbiAgICAgIGxvZ0lkOiBgdXBsb2FkR3JvdXBBdmF0YXIvJHtsb2dJZH1gLFxuICAgICAgcHVibGljUGFyYW1zLFxuICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgcmVxdWVzdDogKHNlbmRlciwgcmVxdWVzdE9wdGlvbnMpID0+XG4gICAgICAgIHNlbmRlci51cGxvYWRHcm91cEF2YXRhcihjaXBoZXJ0ZXh0LCByZXF1ZXN0T3B0aW9ucyksXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGhhc2gsXG4gICAgICBrZXksXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cud2FybihgdXBsb2FkQXZhdGFyLyR7bG9nSWR9IEZhaWxlZCB0byB1cGxvYWQgYXZhdGFyYCwgZXJyb3Iuc3RhY2spO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JvdXBUaXRsZUJ1ZmZlcihcbiAgY2xpZW50WmtHcm91cENpcGhlcjogQ2xpZW50WmtHcm91cENpcGhlcixcbiAgdGl0bGU6IHN0cmluZ1xuKTogVWludDhBcnJheSB7XG4gIGNvbnN0IHRpdGxlQmxvYlBsYWludGV4dCA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5lbmNvZGUoe1xuICAgIHRpdGxlLFxuICB9KS5maW5pc2goKTtcblxuICBjb25zdCByZXN1bHQgPSBlbmNyeXB0R3JvdXBCbG9iKGNsaWVudFprR3JvdXBDaXBoZXIsIHRpdGxlQmxvYlBsYWludGV4dCk7XG5cbiAgaWYgKHJlc3VsdC5ieXRlTGVuZ3RoID4gR1JPVVBfVElUTEVfTUFYX0VOQ1JZUFRFRF9CWVRFUykge1xuICAgIHRocm93IG5ldyBFcnJvcignYnVpbGRHcm91cFRpdGxlQnVmZmVyOiBlbmNyeXB0ZWQgZ3JvdXAgdGl0bGUgaXMgdG9vIGxvbmcnKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JvdXBEZXNjcmlwdGlvbkJ1ZmZlcihcbiAgY2xpZW50WmtHcm91cENpcGhlcjogQ2xpZW50WmtHcm91cENpcGhlcixcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xuKTogVWludDhBcnJheSB7XG4gIGNvbnN0IGF0dHJzQmxvYlBsYWludGV4dCA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5lbmNvZGUoe1xuICAgIGRlc2NyaXB0aW9uVGV4dDogZGVzY3JpcHRpb24sXG4gIH0pLmZpbmlzaCgpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGVuY3J5cHRHcm91cEJsb2IoY2xpZW50WmtHcm91cENpcGhlciwgYXR0cnNCbG9iUGxhaW50ZXh0KTtcblxuICBpZiAocmVzdWx0LmJ5dGVMZW5ndGggPiBHUk9VUF9ERVNDX01BWF9FTkNSWVBURURfQllURVMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnYnVpbGRHcm91cERlc2NyaXB0aW9uQnVmZmVyOiBlbmNyeXB0ZWQgZ3JvdXAgdGl0bGUgaXMgdG9vIGxvbmcnXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JvdXBQcm90byhcbiAgYXR0cmlidXRlczogUGljazxcbiAgICBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgICB8ICdhY2Nlc3NDb250cm9sJ1xuICAgIHwgJ2V4cGlyZVRpbWVyJ1xuICAgIHwgJ2lkJ1xuICAgIHwgJ21lbWJlcnNWMidcbiAgICB8ICduYW1lJ1xuICAgIHwgJ3BlbmRpbmdNZW1iZXJzVjInXG4gICAgfCAncHVibGljUGFyYW1zJ1xuICAgIHwgJ3JldmlzaW9uJ1xuICAgIHwgJ3NlY3JldFBhcmFtcydcbiAgPiAmIHtcbiAgICBhdmF0YXJVcmw/OiBzdHJpbmc7XG4gIH1cbik6IFByb3RvLkdyb3VwIHtcbiAgY29uc3QgTUVNQkVSX1JPTEVfRU5VTSA9IFByb3RvLk1lbWJlci5Sb2xlO1xuICBjb25zdCBBQ0NFU1NfRU5VTSA9IFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQ7XG4gIGNvbnN0IGxvZ0lkID0gYGdyb3VwdjIoJHthdHRyaWJ1dGVzLmlkfSlgO1xuXG4gIGNvbnN0IHsgcHVibGljUGFyYW1zLCBzZWNyZXRQYXJhbXMgfSA9IGF0dHJpYnV0ZXM7XG5cbiAgaWYgKCFwdWJsaWNQYXJhbXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgYnVpbGRHcm91cFByb3RvLyR7bG9nSWR9OiBhdHRyaWJ1dGVzIHdlcmUgbWlzc2luZyBwdWJsaWNQYXJhbXMhYFxuICAgICk7XG4gIH1cbiAgaWYgKCFzZWNyZXRQYXJhbXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgYnVpbGRHcm91cFByb3RvLyR7bG9nSWR9OiBhdHRyaWJ1dGVzIHdlcmUgbWlzc2luZyBzZWNyZXRQYXJhbXMhYFxuICAgICk7XG4gIH1cblxuICBjb25zdCBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQgPSB3aW5kb3cuZ2V0U2VydmVyUHVibGljUGFyYW1zKCk7XG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKHNlY3JldFBhcmFtcyk7XG4gIGNvbnN0IGNsaWVudFprUHJvZmlsZUNpcGhlciA9IGdldENsaWVudFprUHJvZmlsZU9wZXJhdGlvbnMoXG4gICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0XG4gICk7XG4gIGNvbnN0IHByb3RvID0gbmV3IFByb3RvLkdyb3VwKCk7XG5cbiAgcHJvdG8ucHVibGljS2V5ID0gQnl0ZXMuZnJvbUJhc2U2NChwdWJsaWNQYXJhbXMpO1xuICBwcm90by52ZXJzaW9uID0gYXR0cmlidXRlcy5yZXZpc2lvbiB8fCAwO1xuXG4gIGlmIChhdHRyaWJ1dGVzLm5hbWUpIHtcbiAgICBwcm90by50aXRsZSA9IGJ1aWxkR3JvdXBUaXRsZUJ1ZmZlcihjbGllbnRaa0dyb3VwQ2lwaGVyLCBhdHRyaWJ1dGVzLm5hbWUpO1xuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMuYXZhdGFyVXJsKSB7XG4gICAgcHJvdG8uYXZhdGFyID0gYXR0cmlidXRlcy5hdmF0YXJVcmw7XG4gIH1cblxuICBpZiAoYXR0cmlidXRlcy5leHBpcmVUaW1lcikge1xuICAgIGNvbnN0IHRpbWVyQmxvYlBsYWludGV4dCA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5lbmNvZGUoe1xuICAgICAgZGlzYXBwZWFyaW5nTWVzc2FnZXNEdXJhdGlvbjogYXR0cmlidXRlcy5leHBpcmVUaW1lcixcbiAgICB9KS5maW5pc2goKTtcbiAgICBwcm90by5kaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyID0gZW5jcnlwdEdyb3VwQmxvYihcbiAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICB0aW1lckJsb2JQbGFpbnRleHRcbiAgICApO1xuICB9XG5cbiAgY29uc3QgYWNjZXNzQ29udHJvbCA9IG5ldyBQcm90by5BY2Nlc3NDb250cm9sKCk7XG4gIGlmIChhdHRyaWJ1dGVzLmFjY2Vzc0NvbnRyb2wpIHtcbiAgICBhY2Nlc3NDb250cm9sLmF0dHJpYnV0ZXMgPVxuICAgICAgYXR0cmlidXRlcy5hY2Nlc3NDb250cm9sLmF0dHJpYnV0ZXMgfHwgQUNDRVNTX0VOVU0uTUVNQkVSO1xuICAgIGFjY2Vzc0NvbnRyb2wubWVtYmVycyA9XG4gICAgICBhdHRyaWJ1dGVzLmFjY2Vzc0NvbnRyb2wubWVtYmVycyB8fCBBQ0NFU1NfRU5VTS5NRU1CRVI7XG4gIH0gZWxzZSB7XG4gICAgYWNjZXNzQ29udHJvbC5hdHRyaWJ1dGVzID0gQUNDRVNTX0VOVU0uTUVNQkVSO1xuICAgIGFjY2Vzc0NvbnRyb2wubWVtYmVycyA9IEFDQ0VTU19FTlVNLk1FTUJFUjtcbiAgfVxuICBwcm90by5hY2Nlc3NDb250cm9sID0gYWNjZXNzQ29udHJvbDtcblxuICBwcm90by5tZW1iZXJzID0gKGF0dHJpYnV0ZXMubWVtYmVyc1YyIHx8IFtdKS5tYXAoaXRlbSA9PiB7XG4gICAgY29uc3QgbWVtYmVyID0gbmV3IFByb3RvLk1lbWJlcigpO1xuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGl0ZW0udXVpZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYnVpbGRHcm91cFByb3RvLyR7bG9nSWR9OiBubyBjb252ZXJzYXRpb24gZm9yIG1lbWJlciFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVLZXlDcmVkZW50aWFsJyk7XG4gICAgaWYgKCFwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgYnVpbGRHcm91cFByb3RvLyR7bG9nSWR9OiBtZW1iZXIgd2FzIG1pc3NpbmcgcHJvZmlsZUtleUNyZWRlbnRpYWwhYFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgcHJlc2VudGF0aW9uID0gY3JlYXRlUHJvZmlsZUtleUNyZWRlbnRpYWxQcmVzZW50YXRpb24oXG4gICAgICBjbGllbnRaa1Byb2ZpbGVDaXBoZXIsXG4gICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCxcbiAgICAgIHNlY3JldFBhcmFtc1xuICAgICk7XG5cbiAgICBtZW1iZXIucm9sZSA9IGl0ZW0ucm9sZSB8fCBNRU1CRVJfUk9MRV9FTlVNLkRFRkFVTFQ7XG4gICAgbWVtYmVyLnByZXNlbnRhdGlvbiA9IHByZXNlbnRhdGlvbjtcblxuICAgIHJldHVybiBtZW1iZXI7XG4gIH0pO1xuXG4gIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcblxuICBjb25zdCBvdXJBQ0lDaXBoZXJUZXh0QnVmZmVyID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgb3VyQUNJKTtcblxuICBwcm90by5tZW1iZXJzUGVuZGluZ1Byb2ZpbGVLZXkgPSAoYXR0cmlidXRlcy5wZW5kaW5nTWVtYmVyc1YyIHx8IFtdKS5tYXAoXG4gICAgaXRlbSA9PiB7XG4gICAgICBjb25zdCBwZW5kaW5nTWVtYmVyID0gbmV3IFByb3RvLk1lbWJlclBlbmRpbmdQcm9maWxlS2V5KCk7XG4gICAgICBjb25zdCBtZW1iZXIgPSBuZXcgUHJvdG8uTWVtYmVyKCk7XG5cbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpdGVtLnV1aWQpO1xuICAgICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdidWlsZEdyb3VwUHJvdG86IG5vIGNvbnZlcnNhdGlvbiBmb3IgcGVuZGluZyBtZW1iZXIhJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHV1aWQgPSBjb252ZXJzYXRpb24uZ2V0Q2hlY2tlZFV1aWQoXG4gICAgICAgICdidWlsZEdyb3VwUHJvdG86IHBlbmRpbmcgbWVtYmVyIHdhcyBtaXNzaW5nIHV1aWQhJ1xuICAgICAgKTtcblxuICAgICAgY29uc3QgdXVpZENpcGhlclRleHRCdWZmZXIgPSBlbmNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCB1dWlkKTtcbiAgICAgIG1lbWJlci51c2VySWQgPSB1dWlkQ2lwaGVyVGV4dEJ1ZmZlcjtcbiAgICAgIG1lbWJlci5yb2xlID0gaXRlbS5yb2xlIHx8IE1FTUJFUl9ST0xFX0VOVU0uREVGQVVMVDtcblxuICAgICAgcGVuZGluZ01lbWJlci5tZW1iZXIgPSBtZW1iZXI7XG4gICAgICBwZW5kaW5nTWVtYmVyLnRpbWVzdGFtcCA9IExvbmcuZnJvbU51bWJlcihpdGVtLnRpbWVzdGFtcCk7XG4gICAgICBwZW5kaW5nTWVtYmVyLmFkZGVkQnlVc2VySWQgPSBvdXJBQ0lDaXBoZXJUZXh0QnVmZmVyO1xuXG4gICAgICByZXR1cm4gcGVuZGluZ01lbWJlcjtcbiAgICB9XG4gICk7XG5cbiAgcmV0dXJuIHByb3RvO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRBZGRNZW1iZXJzQ2hhbmdlKFxuICBjb252ZXJzYXRpb246IFBpY2s8XG4gICAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gICAgJ2Jhbm5lZE1lbWJlcnNWMicgfCAnaWQnIHwgJ3B1YmxpY1BhcmFtcycgfCAncmV2aXNpb24nIHwgJ3NlY3JldFBhcmFtcydcbiAgPixcbiAgY29udmVyc2F0aW9uSWRzOiBSZWFkb25seUFycmF5PHN0cmluZz5cbik6IFByb21pc2U8dW5kZWZpbmVkIHwgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucz4ge1xuICBjb25zdCBNRU1CRVJfUk9MRV9FTlVNID0gUHJvdG8uTWVtYmVyLlJvbGU7XG5cbiAgY29uc3QgeyBpZCwgcHVibGljUGFyYW1zLCByZXZpc2lvbiwgc2VjcmV0UGFyYW1zIH0gPSBjb252ZXJzYXRpb247XG5cbiAgY29uc3QgbG9nSWQgPSBgZ3JvdXB2Migke2lkfSlgO1xuXG4gIGlmICghcHVibGljUGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGJ1aWxkQWRkTWVtYmVyc0NoYW5nZS8ke2xvZ0lkfTogYXR0cmlidXRlcyB3ZXJlIG1pc3NpbmcgcHVibGljUGFyYW1zIWBcbiAgICApO1xuICB9XG4gIGlmICghc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGJ1aWxkQWRkTWVtYmVyc0NoYW5nZS8ke2xvZ0lkfTogYXR0cmlidXRlcyB3ZXJlIG1pc3Npbmcgc2VjcmV0UGFyYW1zIWBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgbmV3R3JvdXBWZXJzaW9uID0gKHJldmlzaW9uIHx8IDApICsgMTtcbiAgY29uc3Qgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0ID0gd2luZG93LmdldFNlcnZlclB1YmxpY1BhcmFtcygpO1xuICBjb25zdCBjbGllbnRaa1Byb2ZpbGVDaXBoZXIgPSBnZXRDbGllbnRaa1Byb2ZpbGVPcGVyYXRpb25zKFxuICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NFxuICApO1xuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihzZWNyZXRQYXJhbXMpO1xuXG4gIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgY29uc3Qgb3VyQUNJQ2lwaGVyVGV4dEJ1ZmZlciA9IGVuY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIG91ckFDSSk7XG5cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICBjb25zdCBhZGRNZW1iZXJzOiBBcnJheTxQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlckFjdGlvbj4gPSBbXTtcbiAgY29uc3QgYWRkUGVuZGluZ01lbWJlcnM6IEFycmF5PFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuQWRkTWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXlBY3Rpb24+ID1cbiAgICBbXTtcbiAgY29uc3QgYWN0aW9ucyA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zKCk7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgY29udmVyc2F0aW9uSWRzLm1hcChhc3luYyBjb252ZXJzYXRpb25JZCA9PiB7XG4gICAgICBjb25zdCBjb250YWN0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGlmICghY29udGFjdCkge1xuICAgICAgICBhc3NlcnQoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgYGJ1aWxkQWRkTWVtYmVyc0NoYW5nZS8ke2xvZ0lkfTogbWlzc2luZyBsb2NhbCBjb250YWN0LCBza2lwcGluZ2BcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1dWlkID0gY29udGFjdC5nZXRVdWlkKCk7XG4gICAgICBpZiAoIXV1aWQpIHtcbiAgICAgICAgYXNzZXJ0KGZhbHNlLCBgYnVpbGRBZGRNZW1iZXJzQ2hhbmdlLyR7bG9nSWR9OiBtaXNzaW5nIFVVSUQ7IHNraXBwaW5nYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUmVmcmVzaCBvdXIgbG9jYWwgZGF0YSB0byBiZSBzdXJlXG4gICAgICBpZiAoIWNvbnRhY3QuZ2V0KCdwcm9maWxlS2V5JykgfHwgIWNvbnRhY3QuZ2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpKSB7XG4gICAgICAgIGF3YWl0IGNvbnRhY3QuZ2V0UHJvZmlsZXMoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJvZmlsZUtleSA9IGNvbnRhY3QuZ2V0KCdwcm9maWxlS2V5Jyk7XG4gICAgICBjb25zdCBwcm9maWxlS2V5Q3JlZGVudGlhbCA9IGNvbnRhY3QuZ2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpO1xuXG4gICAgICBjb25zdCBtZW1iZXIgPSBuZXcgUHJvdG8uTWVtYmVyKCk7XG4gICAgICBtZW1iZXIudXNlcklkID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXVpZCk7XG4gICAgICBtZW1iZXIucm9sZSA9IE1FTUJFUl9ST0xFX0VOVU0uREVGQVVMVDtcbiAgICAgIG1lbWJlci5qb2luZWRBdFZlcnNpb24gPSBuZXdHcm91cFZlcnNpb247XG5cbiAgICAgIC8vIFRoaXMgaXMgaW5zcGlyZWQgYnkgW0FuZHJvaWQncyBlcXVpdmFsZW50IGNvZGVdWzBdLlxuICAgICAgLy9cbiAgICAgIC8vIFswXTogaHR0cHM6Ly9naXRodWIuY29tL3NpZ25hbGFwcC9TaWduYWwtQW5kcm9pZC9ibG9iLzJiZTMwNjg2NzUzOWFiMTUyNmYwZTQ5ZDFhYTdiZDYxZTc4M2QyM2YvbGlic2lnbmFsL3NlcnZpY2Uvc3JjL21haW4vamF2YS9vcmcvd2hpc3BlcnN5c3RlbXMvc2lnbmFsc2VydmljZS9hcGkvZ3JvdXBzdjIvR3JvdXBzVjJPcGVyYXRpb25zLmphdmEjTDE1Mi1MMTc0XG4gICAgICBpZiAocHJvZmlsZUtleSAmJiBwcm9maWxlS2V5Q3JlZGVudGlhbCkge1xuICAgICAgICBtZW1iZXIucHJlc2VudGF0aW9uID0gY3JlYXRlUHJvZmlsZUtleUNyZWRlbnRpYWxQcmVzZW50YXRpb24oXG4gICAgICAgICAgY2xpZW50WmtQcm9maWxlQ2lwaGVyLFxuICAgICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsLFxuICAgICAgICAgIHNlY3JldFBhcmFtc1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGFkZE1lbWJlckFjdGlvbiA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlckFjdGlvbigpO1xuICAgICAgICBhZGRNZW1iZXJBY3Rpb24uYWRkZWQgPSBtZW1iZXI7XG4gICAgICAgIGFkZE1lbWJlckFjdGlvbi5qb2luRnJvbUludml0ZUxpbmsgPSBmYWxzZTtcblxuICAgICAgICBhZGRNZW1iZXJzLnB1c2goYWRkTWVtYmVyQWN0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1lbWJlclBlbmRpbmdQcm9maWxlS2V5ID0gbmV3IFByb3RvLk1lbWJlclBlbmRpbmdQcm9maWxlS2V5KCk7XG4gICAgICAgIG1lbWJlclBlbmRpbmdQcm9maWxlS2V5Lm1lbWJlciA9IG1lbWJlcjtcbiAgICAgICAgbWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXkuYWRkZWRCeVVzZXJJZCA9IG91ckFDSUNpcGhlclRleHRCdWZmZXI7XG4gICAgICAgIG1lbWJlclBlbmRpbmdQcm9maWxlS2V5LnRpbWVzdGFtcCA9IExvbmcuZnJvbU51bWJlcihub3cpO1xuXG4gICAgICAgIGNvbnN0IGFkZFBlbmRpbmdNZW1iZXJBY3Rpb24gPVxuICAgICAgICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlclBlbmRpbmdQcm9maWxlS2V5QWN0aW9uKCk7XG4gICAgICAgIGFkZFBlbmRpbmdNZW1iZXJBY3Rpb24uYWRkZWQgPSBtZW1iZXJQZW5kaW5nUHJvZmlsZUtleTtcblxuICAgICAgICBhZGRQZW5kaW5nTWVtYmVycy5wdXNoKGFkZFBlbmRpbmdNZW1iZXJBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkb2VzTWVtYmVyTmVlZFVuYmFuID0gY29udmVyc2F0aW9uLmJhbm5lZE1lbWJlcnNWMj8uZmluZChcbiAgICAgICAgYmFubmVkTWVtYmVyID0+IGJhbm5lZE1lbWJlci51dWlkID09PSB1dWlkLnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgICBpZiAoZG9lc01lbWJlck5lZWRVbmJhbikge1xuICAgICAgICBjb25zdCB1dWlkQ2lwaGVyVGV4dEJ1ZmZlciA9IGVuY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHV1aWQpO1xuXG4gICAgICAgIGNvbnN0IGRlbGV0ZU1lbWJlckJhbm5lZEFjdGlvbiA9XG4gICAgICAgICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyQmFubmVkQWN0aW9uKCk7XG5cbiAgICAgICAgZGVsZXRlTWVtYmVyQmFubmVkQWN0aW9uLmRlbGV0ZWRVc2VySWQgPSB1dWlkQ2lwaGVyVGV4dEJ1ZmZlcjtcblxuICAgICAgICBhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQgPSBhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQgfHwgW107XG4gICAgICAgIGFjdGlvbnMuZGVsZXRlTWVtYmVyc0Jhbm5lZC5wdXNoKGRlbGV0ZU1lbWJlckJhbm5lZEFjdGlvbik7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcblxuICBpZiAoIWFkZE1lbWJlcnMubGVuZ3RoICYmICFhZGRQZW5kaW5nTWVtYmVycy5sZW5ndGgpIHtcbiAgICAvLyBUaGlzIHNob3VsZG4ndCBoYXBwZW4uIFdoZW4gdGhlc2UgYWN0aW9ucyBhcmUgcGFzc2VkIHRvIGBtb2RpZnlHcm91cFYyYCwgYSB3YXJuaW5nXG4gICAgLy8gICB3aWxsIGJlIGxvZ2dlZC5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChhZGRNZW1iZXJzLmxlbmd0aCkge1xuICAgIGFjdGlvbnMuYWRkTWVtYmVycyA9IGFkZE1lbWJlcnM7XG4gIH1cbiAgaWYgKGFkZFBlbmRpbmdNZW1iZXJzLmxlbmd0aCkge1xuICAgIGFjdGlvbnMuYWRkUGVuZGluZ01lbWJlcnMgPSBhZGRQZW5kaW5nTWVtYmVycztcbiAgfVxuICBhY3Rpb25zLnZlcnNpb24gPSBuZXdHcm91cFZlcnNpb247XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZFVwZGF0ZUF0dHJpYnV0ZXNDaGFuZ2UoXG4gIGNvbnZlcnNhdGlvbjogUGljazxcbiAgICBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgICAnaWQnIHwgJ3JldmlzaW9uJyB8ICdwdWJsaWNQYXJhbXMnIHwgJ3NlY3JldFBhcmFtcydcbiAgPixcbiAgYXR0cmlidXRlczogUmVhZG9ubHk8e1xuICAgIGF2YXRhcj86IHVuZGVmaW5lZCB8IFVpbnQ4QXJyYXk7XG4gICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gIH0+XG4pOiBQcm9taXNlPHVuZGVmaW5lZCB8IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnM+IHtcbiAgY29uc3QgeyBwdWJsaWNQYXJhbXMsIHNlY3JldFBhcmFtcywgcmV2aXNpb24sIGlkIH0gPSBjb252ZXJzYXRpb247XG5cbiAgY29uc3QgbG9nSWQgPSBgZ3JvdXB2Migke2lkfSlgO1xuXG4gIGlmICghcHVibGljUGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGJ1aWxkVXBkYXRlQXR0cmlidXRlc0NoYW5nZS8ke2xvZ0lkfTogYXR0cmlidXRlcyB3ZXJlIG1pc3NpbmcgcHVibGljUGFyYW1zIWBcbiAgICApO1xuICB9XG4gIGlmICghc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGJ1aWxkVXBkYXRlQXR0cmlidXRlc0NoYW5nZS8ke2xvZ0lkfTogYXR0cmlidXRlcyB3ZXJlIG1pc3Npbmcgc2VjcmV0UGFyYW1zIWBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgYWN0aW9ucyA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zKCk7XG5cbiAgbGV0IGhhc0NoYW5nZWRTb21ldGhpbmcgPSBmYWxzZTtcblxuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihzZWNyZXRQYXJhbXMpO1xuXG4gIC8vIFRoZXJlIGFyZSB0aHJlZSBwb3NzaWJsZSBzdGF0ZXMgaGVyZTpcbiAgLy9cbiAgLy8gMS4gJ2F2YXRhcicgbm90IGluIGF0dHJpYnV0ZXM6IHdlIGRvbid0IHdhbnQgdG8gY2hhbmdlIHRoZSBhdmF0YXIuXG4gIC8vIDIuIGF0dHJpYnV0ZXMuYXZhdGFyID09PSB1bmRlZmluZWQ6IHdlIHdhbnQgdG8gY2xlYXIgdGhlIGF2YXRhci5cbiAgLy8gMy4gYXR0cmlidXRlcy5hdmF0YXIgIT09IHVuZGVmaW5lZDogd2Ugd2FudCB0byB1cGRhdGUgdGhlIGF2YXRhci5cbiAgaWYgKCdhdmF0YXInIGluIGF0dHJpYnV0ZXMpIHtcbiAgICBoYXNDaGFuZ2VkU29tZXRoaW5nID0gdHJ1ZTtcblxuICAgIGFjdGlvbnMubW9kaWZ5QXZhdGFyID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5QXZhdGFyQWN0aW9uKCk7XG4gICAgY29uc3QgeyBhdmF0YXIgfSA9IGF0dHJpYnV0ZXM7XG4gICAgaWYgKGF2YXRhcikge1xuICAgICAgY29uc3QgdXBsb2FkZWRBdmF0YXIgPSBhd2FpdCB1cGxvYWRBdmF0YXIoe1xuICAgICAgICBkYXRhOiBhdmF0YXIsXG4gICAgICAgIGxvZ0lkLFxuICAgICAgICBwdWJsaWNQYXJhbXMsXG4gICAgICAgIHNlY3JldFBhcmFtcyxcbiAgICAgIH0pO1xuICAgICAgYWN0aW9ucy5tb2RpZnlBdmF0YXIuYXZhdGFyID0gdXBsb2FkZWRBdmF0YXIua2V5O1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRvbid0IHNldCBgYWN0aW9ucy5tb2RpZnlBdmF0YXIuYXZhdGFyYCwgaXQgd2lsbCBiZSBjbGVhcmVkLlxuICB9XG5cbiAgY29uc3QgeyB0aXRsZSB9ID0gYXR0cmlidXRlcztcbiAgaWYgKHRpdGxlKSB7XG4gICAgaGFzQ2hhbmdlZFNvbWV0aGluZyA9IHRydWU7XG5cbiAgICBhY3Rpb25zLm1vZGlmeVRpdGxlID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5VGl0bGVBY3Rpb24oKTtcbiAgICBhY3Rpb25zLm1vZGlmeVRpdGxlLnRpdGxlID0gYnVpbGRHcm91cFRpdGxlQnVmZmVyKFxuICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgIHRpdGxlXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHsgZGVzY3JpcHRpb24gfSA9IGF0dHJpYnV0ZXM7XG4gIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgaGFzQ2hhbmdlZFNvbWV0aGluZyA9IHRydWU7XG5cbiAgICBhY3Rpb25zLm1vZGlmeURlc2NyaXB0aW9uID1cbiAgICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeURlc2NyaXB0aW9uQWN0aW9uKCk7XG4gICAgYWN0aW9ucy5tb2RpZnlEZXNjcmlwdGlvbi5kZXNjcmlwdGlvbkJ5dGVzID0gYnVpbGRHcm91cERlc2NyaXB0aW9uQnVmZmVyKFxuICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgIGRlc2NyaXB0aW9uXG4gICAgKTtcbiAgfVxuXG4gIGlmICghaGFzQ2hhbmdlZFNvbWV0aGluZykge1xuICAgIC8vIFRoaXMgc2hvdWxkbid0IGhhcHBlbi4gV2hlbiB0aGVzZSBhY3Rpb25zIGFyZSBwYXNzZWQgdG8gYG1vZGlmeUdyb3VwVjJgLCBhIHdhcm5pbmdcbiAgICAvLyAgIHdpbGwgYmUgbG9nZ2VkLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBhY3Rpb25zLnZlcnNpb24gPSAocmV2aXNpb24gfHwgMCkgKyAxO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGREaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyQ2hhbmdlKHtcbiAgZXhwaXJlVGltZXIsXG4gIGdyb3VwLFxufToge1xuICBleHBpcmVUaW1lcjogbnVtYmVyO1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG59KTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGNvbnN0IGJsb2IgPSBuZXcgUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iKCk7XG4gIGJsb2IuZGlzYXBwZWFyaW5nTWVzc2FnZXNEdXJhdGlvbiA9IGV4cGlyZVRpbWVyO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2J1aWxkRGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lckNoYW5nZTogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zISdcbiAgICApO1xuICB9XG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKGdyb3VwLnNlY3JldFBhcmFtcyk7XG5cbiAgY29uc3QgYmxvYlBsYWludGV4dCA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5lbmNvZGUoYmxvYikuZmluaXNoKCk7XG4gIGNvbnN0IGJsb2JDaXBoZXJUZXh0ID0gZW5jcnlwdEdyb3VwQmxvYihjbGllbnRaa0dyb3VwQ2lwaGVyLCBibG9iUGxhaW50ZXh0KTtcblxuICBjb25zdCB0aW1lckFjdGlvbiA9XG4gICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5RGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lckFjdGlvbigpO1xuICB0aW1lckFjdGlvbi50aW1lciA9IGJsb2JDaXBoZXJUZXh0O1xuXG4gIGFjdGlvbnMudmVyc2lvbiA9IChncm91cC5yZXZpc2lvbiB8fCAwKSArIDE7XG4gIGFjdGlvbnMubW9kaWZ5RGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lciA9IHRpbWVyQWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRJbnZpdGVMaW5rUGFzc3dvcmRDaGFuZ2UoXG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgaW52aXRlTGlua1Bhc3N3b3JkOiBzdHJpbmdcbik6IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMge1xuICBjb25zdCBpbnZpdGVMaW5rUGFzc3dvcmRBY3Rpb24gPVxuICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUludml0ZUxpbmtQYXNzd29yZEFjdGlvbigpO1xuICBpbnZpdGVMaW5rUGFzc3dvcmRBY3Rpb24uaW52aXRlTGlua1Bhc3N3b3JkID1cbiAgICBCeXRlcy5mcm9tQmFzZTY0KGludml0ZUxpbmtQYXNzd29yZCk7XG5cbiAgY29uc3QgYWN0aW9ucyA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zKCk7XG4gIGFjdGlvbnMudmVyc2lvbiA9IChncm91cC5yZXZpc2lvbiB8fCAwKSArIDE7XG4gIGFjdGlvbnMubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkID0gaW52aXRlTGlua1Bhc3N3b3JkQWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGROZXdHcm91cExpbmtDaGFuZ2UoXG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgaW52aXRlTGlua1Bhc3N3b3JkOiBzdHJpbmcsXG4gIGFkZEZyb21JbnZpdGVMaW5rQWNjZXNzOiBBY2Nlc3NSZXF1aXJlZEVudW1cbik6IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMge1xuICBjb25zdCBhY2Nlc3NDb250cm9sQWN0aW9uID1cbiAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2Vzc0NvbnRyb2xBY3Rpb24oKTtcbiAgYWNjZXNzQ29udHJvbEFjdGlvbi5hZGRGcm9tSW52aXRlTGlua0FjY2VzcyA9IGFkZEZyb21JbnZpdGVMaW5rQWNjZXNzO1xuXG4gIGNvbnN0IGludml0ZUxpbmtQYXNzd29yZEFjdGlvbiA9XG4gICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkQWN0aW9uKCk7XG4gIGludml0ZUxpbmtQYXNzd29yZEFjdGlvbi5pbnZpdGVMaW5rUGFzc3dvcmQgPVxuICAgIEJ5dGVzLmZyb21CYXNlNjQoaW52aXRlTGlua1Bhc3N3b3JkKTtcblxuICBjb25zdCBhY3Rpb25zID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMoKTtcbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5tb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2VzcyA9IGFjY2Vzc0NvbnRyb2xBY3Rpb247XG4gIGFjdGlvbnMubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkID0gaW52aXRlTGlua1Bhc3N3b3JkQWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBY2Nlc3NDb250cm9sQWRkRnJvbUludml0ZUxpbmtDaGFuZ2UoXG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgdmFsdWU6IEFjY2Vzc1JlcXVpcmVkRW51bVxuKTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjY2Vzc0NvbnRyb2xBY3Rpb24gPVxuICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUFkZEZyb21JbnZpdGVMaW5rQWNjZXNzQ29udHJvbEFjdGlvbigpO1xuICBhY2Nlc3NDb250cm9sQWN0aW9uLmFkZEZyb21JbnZpdGVMaW5rQWNjZXNzID0gdmFsdWU7XG5cbiAgY29uc3QgYWN0aW9ucyA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zKCk7XG4gIGFjdGlvbnMudmVyc2lvbiA9IChncm91cC5yZXZpc2lvbiB8fCAwKSArIDE7XG4gIGFjdGlvbnMubW9kaWZ5QWRkRnJvbUludml0ZUxpbmtBY2Nlc3MgPSBhY2Nlc3NDb250cm9sQWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBbm5vdW5jZW1lbnRzT25seUNoYW5nZShcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLFxuICB2YWx1ZTogYm9vbGVhblxuKTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbiA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUFubm91bmNlbWVudHNPbmx5QWN0aW9uKCk7XG4gIGFjdGlvbi5hbm5vdW5jZW1lbnRzT25seSA9IHZhbHVlO1xuXG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuICBhY3Rpb25zLnZlcnNpb24gPSAoZ3JvdXAucmV2aXNpb24gfHwgMCkgKyAxO1xuICBhY3Rpb25zLm1vZGlmeUFubm91bmNlbWVudHNPbmx5ID0gYWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBY2Nlc3NDb250cm9sQXR0cmlidXRlc0NoYW5nZShcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLFxuICB2YWx1ZTogQWNjZXNzUmVxdWlyZWRFbnVtXG4pOiBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHtcbiAgY29uc3QgYWNjZXNzQ29udHJvbEFjdGlvbiA9XG4gICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5QXR0cmlidXRlc0FjY2Vzc0NvbnRyb2xBY3Rpb24oKTtcbiAgYWNjZXNzQ29udHJvbEFjdGlvbi5hdHRyaWJ1dGVzQWNjZXNzID0gdmFsdWU7XG5cbiAgY29uc3QgYWN0aW9ucyA9IG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zKCk7XG4gIGFjdGlvbnMudmVyc2lvbiA9IChncm91cC5yZXZpc2lvbiB8fCAwKSArIDE7XG4gIGFjdGlvbnMubW9kaWZ5QXR0cmlidXRlc0FjY2VzcyA9IGFjY2Vzc0NvbnRyb2xBY3Rpb247XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFjY2Vzc0NvbnRyb2xNZW1iZXJzQ2hhbmdlKFxuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIHZhbHVlOiBBY2Nlc3NSZXF1aXJlZEVudW1cbik6IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMge1xuICBjb25zdCBhY2Nlc3NDb250cm9sQWN0aW9uID1cbiAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJzQWNjZXNzQ29udHJvbEFjdGlvbigpO1xuICBhY2Nlc3NDb250cm9sQWN0aW9uLm1lbWJlcnNBY2Nlc3MgPSB2YWx1ZTtcblxuICBjb25zdCBhY3Rpb25zID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMoKTtcbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5tb2RpZnlNZW1iZXJBY2Nlc3MgPSBhY2Nlc3NDb250cm9sQWN0aW9uO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX21heWJlQnVpbGRBZGRCYW5uZWRNZW1iZXJBY3Rpb25zKHtcbiAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgZ3JvdXAsXG4gIG91clV1aWQsXG4gIHV1aWQsXG59OiB7XG4gIGNsaWVudFprR3JvdXBDaXBoZXI6IENsaWVudFprR3JvdXBDaXBoZXI7XG4gIGdyb3VwOiBQaWNrPENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLCAnYmFubmVkTWVtYmVyc1YyJz47XG4gIG91clV1aWQ6IFVVSUQ7XG4gIHV1aWQ6IFVVSUQ7XG59KTogUGljazxcbiAgUHJvdG8uR3JvdXBDaGFuZ2UuSUFjdGlvbnMsXG4gICdhZGRNZW1iZXJzQmFubmVkJyB8ICdkZWxldGVNZW1iZXJzQmFubmVkJ1xuPiB7XG4gIGNvbnN0IGRvZXNNZW1iZXJOZWVkQmFuID1cbiAgICAhZ3JvdXAuYmFubmVkTWVtYmVyc1YyPy5maW5kKG1lbWJlciA9PiBtZW1iZXIudXVpZCA9PT0gdXVpZC50b1N0cmluZygpKSAmJlxuICAgICF1dWlkLmlzRXF1YWwob3VyVXVpZCk7XG4gIGlmICghZG9lc01lbWJlck5lZWRCYW4pIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgLy8gU29ydCBjdXJyZW50IGJhbm5lZCBtZW1iZXJzIGJ5IGRlY3JlYXNpbmcgdGltZXN0YW1wXG4gIGNvbnN0IHNvcnRlZEJhbm5lZE1lbWJlcnMgPSBbLi4uKGdyb3VwLmJhbm5lZE1lbWJlcnNWMiA/PyBbXSldLnNvcnQoXG4gICAgKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBiLnRpbWVzdGFtcCAtIGEudGltZXN0YW1wO1xuICAgIH1cbiAgKTtcblxuICAvLyBBbGwgbWVtYmVycyBhZnRlciB0aGUgbGltaXQgaGF2ZSB0byBiZSBkZWxldGVkIGFuZCBhcmUgb2xkZXIgdGhhbiB0aGVcbiAgLy8gcmVzdCBvZiB0aGUgbGlzdC5cbiAgY29uc3QgZGVsZXRlZEJhbm5lZE1lbWJlcnMgPSBzb3J0ZWRCYW5uZWRNZW1iZXJzLnNsaWNlKFxuICAgIE1hdGgubWF4KDAsIGdldEdyb3VwU2l6ZUhhcmRMaW1pdCgpIC0gMSlcbiAgKTtcblxuICBsZXQgZGVsZXRlTWVtYmVyc0Jhbm5lZCA9IG51bGw7XG4gIGlmIChkZWxldGVkQmFubmVkTWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgZGVsZXRlTWVtYmVyc0Jhbm5lZCA9IGRlbGV0ZWRCYW5uZWRNZW1iZXJzLm1hcChiYW5uZWRNZW1iZXIgPT4ge1xuICAgICAgY29uc3QgZGVsZXRlTWVtYmVyQmFubmVkQWN0aW9uID1cbiAgICAgICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyQmFubmVkQWN0aW9uKCk7XG5cbiAgICAgIGRlbGV0ZU1lbWJlckJhbm5lZEFjdGlvbi5kZWxldGVkVXNlcklkID0gZW5jcnlwdFV1aWQoXG4gICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgIG5ldyBVVUlEKGJhbm5lZE1lbWJlci51dWlkKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGRlbGV0ZU1lbWJlckJhbm5lZEFjdGlvbjtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGFkZE1lbWJlckJhbm5lZEFjdGlvbiA9XG4gICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuQWRkTWVtYmVyQmFubmVkQWN0aW9uKCk7XG5cbiAgY29uc3QgdXVpZENpcGhlclRleHRCdWZmZXIgPSBlbmNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCB1dWlkKTtcbiAgYWRkTWVtYmVyQmFubmVkQWN0aW9uLmFkZGVkID0gbmV3IFByb3RvLk1lbWJlckJhbm5lZCgpO1xuICBhZGRNZW1iZXJCYW5uZWRBY3Rpb24uYWRkZWQudXNlcklkID0gdXVpZENpcGhlclRleHRCdWZmZXI7XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRNZW1iZXJzQmFubmVkOiBbYWRkTWVtYmVyQmFubmVkQWN0aW9uXSxcbiAgICBkZWxldGVNZW1iZXJzQmFubmVkLFxuICB9O1xufVxuXG4vLyBUT0RPIEFORC0xMTAxXG5leHBvcnQgZnVuY3Rpb24gYnVpbGREZWxldGVQZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlckNoYW5nZSh7XG4gIGdyb3VwLFxuICBvdXJVdWlkLFxuICB1dWlkLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIG91clV1aWQ6IFVVSUQ7XG4gIHV1aWQ6IFVVSUQ7XG59KTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2J1aWxkRGVsZXRlUGVuZGluZ0FkbWluQXBwcm92YWxNZW1iZXJDaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnXG4gICAgKTtcbiAgfVxuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihncm91cC5zZWNyZXRQYXJhbXMpO1xuICBjb25zdCB1dWlkQ2lwaGVyVGV4dEJ1ZmZlciA9IGVuY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHV1aWQpO1xuXG4gIGNvbnN0IGRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsID1cbiAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5EZWxldGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbEFjdGlvbigpO1xuICBkZWxldGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbC5kZWxldGVkVXNlcklkID0gdXVpZENpcGhlclRleHRCdWZmZXI7XG5cbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5kZWxldGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHMgPSBbXG4gICAgZGVsZXRlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwsXG4gIF07XG5cbiAgY29uc3QgeyBhZGRNZW1iZXJzQmFubmVkLCBkZWxldGVNZW1iZXJzQmFubmVkIH0gPVxuICAgIF9tYXliZUJ1aWxkQWRkQmFubmVkTWVtYmVyQWN0aW9ucyh7XG4gICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgZ3JvdXAsXG4gICAgICBvdXJVdWlkLFxuICAgICAgdXVpZCxcbiAgICB9KTtcblxuICBpZiAoYWRkTWVtYmVyc0Jhbm5lZCkge1xuICAgIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZCA9IGFkZE1lbWJlcnNCYW5uZWQ7XG4gIH1cbiAgaWYgKGRlbGV0ZU1lbWJlcnNCYW5uZWQpIHtcbiAgICBhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQgPSBkZWxldGVNZW1iZXJzQmFubmVkO1xuICB9XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFkZFBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlKHtcbiAgZ3JvdXAsXG4gIHByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0LFxuICBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQsXG59OiB7XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQ6IHN0cmluZztcbiAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0OiBzdHJpbmc7XG59KTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2J1aWxkQWRkUGVuZGluZ0FkbWluQXBwcm92YWxNZW1iZXJDaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnXG4gICAgKTtcbiAgfVxuICBjb25zdCBjbGllbnRaa1Byb2ZpbGVDaXBoZXIgPSBnZXRDbGllbnRaa1Byb2ZpbGVPcGVyYXRpb25zKFxuICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NFxuICApO1xuXG4gIGNvbnN0IGFkZE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsID1cbiAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5BZGRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbEFjdGlvbigpO1xuICBjb25zdCBwcmVzZW50YXRpb24gPSBjcmVhdGVQcm9maWxlS2V5Q3JlZGVudGlhbFByZXNlbnRhdGlvbihcbiAgICBjbGllbnRaa1Byb2ZpbGVDaXBoZXIsXG4gICAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgZ3JvdXAuc2VjcmV0UGFyYW1zXG4gICk7XG5cbiAgY29uc3QgYWRkZWQgPSBuZXcgUHJvdG8uTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwoKTtcbiAgYWRkZWQucHJlc2VudGF0aW9uID0gcHJlc2VudGF0aW9uO1xuXG4gIGFkZE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsLmFkZGVkID0gYWRkZWQ7XG5cbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5hZGRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHMgPSBbYWRkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxdO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBZGRNZW1iZXIoe1xuICBncm91cCxcbiAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NCxcbiAgdXVpZCxcbn06IHtcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xuICBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NDogc3RyaW5nO1xuICBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQ6IHN0cmluZztcbiAgam9pbkZyb21JbnZpdGVMaW5rPzogYm9vbGVhbjtcbiAgdXVpZDogVVVJRDtcbn0pOiBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHtcbiAgY29uc3QgTUVNQkVSX1JPTEVfRU5VTSA9IFByb3RvLk1lbWJlci5Sb2xlO1xuXG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdidWlsZEFkZE1lbWJlcjogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zIScpO1xuICB9XG4gIGNvbnN0IGNsaWVudFprUHJvZmlsZUNpcGhlciA9IGdldENsaWVudFprUHJvZmlsZU9wZXJhdGlvbnMoXG4gICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0XG4gICk7XG5cbiAgY29uc3QgYWRkTWVtYmVyID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuQWRkTWVtYmVyQWN0aW9uKCk7XG4gIGNvbnN0IHByZXNlbnRhdGlvbiA9IGNyZWF0ZVByb2ZpbGVLZXlDcmVkZW50aWFsUHJlc2VudGF0aW9uKFxuICAgIGNsaWVudFprUHJvZmlsZUNpcGhlcixcbiAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCxcbiAgICBncm91cC5zZWNyZXRQYXJhbXNcbiAgKTtcblxuICBjb25zdCBhZGRlZCA9IG5ldyBQcm90by5NZW1iZXIoKTtcbiAgYWRkZWQucHJlc2VudGF0aW9uID0gcHJlc2VudGF0aW9uO1xuICBhZGRlZC5yb2xlID0gTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxUO1xuXG4gIGFkZE1lbWJlci5hZGRlZCA9IGFkZGVkO1xuXG4gIGFjdGlvbnMudmVyc2lvbiA9IChncm91cC5yZXZpc2lvbiB8fCAwKSArIDE7XG4gIGFjdGlvbnMuYWRkTWVtYmVycyA9IFthZGRNZW1iZXJdO1xuXG4gIGNvbnN0IGRvZXNNZW1iZXJOZWVkVW5iYW4gPSBncm91cC5iYW5uZWRNZW1iZXJzVjI/LmZpbmQoXG4gICAgbWVtYmVyID0+IG1lbWJlci51dWlkID09PSB1dWlkLnRvU3RyaW5nKClcbiAgKTtcbiAgaWYgKGRvZXNNZW1iZXJOZWVkVW5iYW4pIHtcbiAgICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihncm91cC5zZWNyZXRQYXJhbXMpO1xuICAgIGNvbnN0IHV1aWRDaXBoZXJUZXh0QnVmZmVyID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXVpZCk7XG5cbiAgICBjb25zdCBkZWxldGVNZW1iZXJCYW5uZWRBY3Rpb24gPVxuICAgICAgbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyQmFubmVkQWN0aW9uKCk7XG5cbiAgICBkZWxldGVNZW1iZXJCYW5uZWRBY3Rpb24uZGVsZXRlZFVzZXJJZCA9IHV1aWRDaXBoZXJUZXh0QnVmZmVyO1xuICAgIGFjdGlvbnMuZGVsZXRlTWVtYmVyc0Jhbm5lZCA9IFtkZWxldGVNZW1iZXJCYW5uZWRBY3Rpb25dO1xuICB9XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZERlbGV0ZVBlbmRpbmdNZW1iZXJDaGFuZ2Uoe1xuICB1dWlkcyxcbiAgZ3JvdXAsXG59OiB7XG4gIHV1aWRzOiBBcnJheTxVVUlEPjtcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xufSk6IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMge1xuICBjb25zdCBhY3Rpb25zID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMoKTtcblxuICBpZiAoIWdyb3VwLnNlY3JldFBhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdidWlsZERlbGV0ZVBlbmRpbmdNZW1iZXJDaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnXG4gICAgKTtcbiAgfVxuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihncm91cC5zZWNyZXRQYXJhbXMpO1xuXG4gIGNvbnN0IGRlbGV0ZVBlbmRpbmdNZW1iZXJzID0gdXVpZHMubWFwKHV1aWQgPT4ge1xuICAgIGNvbnN0IHV1aWRDaXBoZXJUZXh0QnVmZmVyID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXVpZCk7XG4gICAgY29uc3QgZGVsZXRlUGVuZGluZ01lbWJlciA9XG4gICAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5EZWxldGVNZW1iZXJQZW5kaW5nUHJvZmlsZUtleUFjdGlvbigpO1xuICAgIGRlbGV0ZVBlbmRpbmdNZW1iZXIuZGVsZXRlZFVzZXJJZCA9IHV1aWRDaXBoZXJUZXh0QnVmZmVyO1xuICAgIHJldHVybiBkZWxldGVQZW5kaW5nTWVtYmVyO1xuICB9KTtcblxuICBhY3Rpb25zLnZlcnNpb24gPSAoZ3JvdXAucmV2aXNpb24gfHwgMCkgKyAxO1xuICBhY3Rpb25zLmRlbGV0ZVBlbmRpbmdNZW1iZXJzID0gZGVsZXRlUGVuZGluZ01lbWJlcnM7XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZERlbGV0ZU1lbWJlckNoYW5nZSh7XG4gIGdyb3VwLFxuICBvdXJVdWlkLFxuICB1dWlkLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIG91clV1aWQ6IFVVSUQ7XG4gIHV1aWQ6IFVVSUQ7XG59KTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdidWlsZERlbGV0ZU1lbWJlckNoYW5nZTogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zIScpO1xuICB9XG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKGdyb3VwLnNlY3JldFBhcmFtcyk7XG4gIGNvbnN0IHV1aWRDaXBoZXJUZXh0QnVmZmVyID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXVpZCk7XG5cbiAgY29uc3QgZGVsZXRlTWVtYmVyID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyQWN0aW9uKCk7XG4gIGRlbGV0ZU1lbWJlci5kZWxldGVkVXNlcklkID0gdXVpZENpcGhlclRleHRCdWZmZXI7XG5cbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5kZWxldGVNZW1iZXJzID0gW2RlbGV0ZU1lbWJlcl07XG5cbiAgY29uc3QgeyBhZGRNZW1iZXJzQmFubmVkLCBkZWxldGVNZW1iZXJzQmFubmVkIH0gPVxuICAgIF9tYXliZUJ1aWxkQWRkQmFubmVkTWVtYmVyQWN0aW9ucyh7XG4gICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgZ3JvdXAsXG4gICAgICBvdXJVdWlkLFxuICAgICAgdXVpZCxcbiAgICB9KTtcblxuICBpZiAoYWRkTWVtYmVyc0Jhbm5lZCkge1xuICAgIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZCA9IGFkZE1lbWJlcnNCYW5uZWQ7XG4gIH1cbiAgaWYgKGRlbGV0ZU1lbWJlcnNCYW5uZWQpIHtcbiAgICBhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQgPSBkZWxldGVNZW1iZXJzQmFubmVkO1xuICB9XG5cbiAgcmV0dXJuIGFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFkZEJhbm5lZE1lbWJlckNoYW5nZSh7XG4gIHV1aWQsXG4gIGdyb3VwLFxufToge1xuICB1dWlkOiBVVUlEO1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG59KTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2J1aWxkQWRkQmFubmVkTWVtYmVyQ2hhbmdlOiBncm91cCB3YXMgbWlzc2luZyBzZWNyZXRQYXJhbXMhJ1xuICAgICk7XG4gIH1cbiAgY29uc3QgY2xpZW50WmtHcm91cENpcGhlciA9IGdldENsaWVudFprR3JvdXBDaXBoZXIoZ3JvdXAuc2VjcmV0UGFyYW1zKTtcbiAgY29uc3QgdXVpZENpcGhlclRleHRCdWZmZXIgPSBlbmNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCB1dWlkKTtcblxuICBjb25zdCBhZGRNZW1iZXJCYW5uZWRBY3Rpb24gPVxuICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlckJhbm5lZEFjdGlvbigpO1xuXG4gIGFkZE1lbWJlckJhbm5lZEFjdGlvbi5hZGRlZCA9IG5ldyBQcm90by5NZW1iZXJCYW5uZWQoKTtcbiAgYWRkTWVtYmVyQmFubmVkQWN0aW9uLmFkZGVkLnVzZXJJZCA9IHV1aWRDaXBoZXJUZXh0QnVmZmVyO1xuXG4gIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZCA9IFthZGRNZW1iZXJCYW5uZWRBY3Rpb25dO1xuXG4gIGlmIChcbiAgICBncm91cC5wZW5kaW5nQWRtaW5BcHByb3ZhbFYyPy5zb21lKGl0ZW0gPT4gaXRlbS51dWlkID09PSB1dWlkLnRvU3RyaW5nKCkpXG4gICkge1xuICAgIGNvbnN0IGRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsQWN0aW9uID1cbiAgICAgIG5ldyBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zLkRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsQWN0aW9uKCk7XG5cbiAgICBkZWxldGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbEFjdGlvbi5kZWxldGVkVXNlcklkID0gdXVpZENpcGhlclRleHRCdWZmZXI7XG5cbiAgICBhY3Rpb25zLmRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscyA9IFtcbiAgICAgIGRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsQWN0aW9uLFxuICAgIF07XG4gIH1cblxuICBhY3Rpb25zLnZlcnNpb24gPSAoZ3JvdXAucmV2aXNpb24gfHwgMCkgKyAxO1xuXG4gIHJldHVybiBhY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb2RpZnlNZW1iZXJSb2xlQ2hhbmdlKHtcbiAgdXVpZCxcbiAgZ3JvdXAsXG4gIHJvbGUsXG59OiB7XG4gIHV1aWQ6IFVVSUQ7XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgcm9sZTogbnVtYmVyO1xufSk6IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMge1xuICBjb25zdCBhY3Rpb25zID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMoKTtcblxuICBpZiAoIWdyb3VwLnNlY3JldFBhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcignYnVpbGRNYWtlQWRtaW5DaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnKTtcbiAgfVxuXG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKGdyb3VwLnNlY3JldFBhcmFtcyk7XG4gIGNvbnN0IHV1aWRDaXBoZXJUZXh0QnVmZmVyID0gZW5jcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXVpZCk7XG5cbiAgY29uc3QgdG9nZ2xlQWRtaW4gPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJSb2xlQWN0aW9uKCk7XG4gIHRvZ2dsZUFkbWluLnVzZXJJZCA9IHV1aWRDaXBoZXJUZXh0QnVmZmVyO1xuICB0b2dnbGVBZG1pbi5yb2xlID0gcm9sZTtcblxuICBhY3Rpb25zLnZlcnNpb24gPSAoZ3JvdXAucmV2aXNpb24gfHwgMCkgKyAxO1xuICBhY3Rpb25zLm1vZGlmeU1lbWJlclJvbGVzID0gW3RvZ2dsZUFkbWluXTtcblxuICByZXR1cm4gYWN0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJvbW90ZVBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlKHtcbiAgZ3JvdXAsXG4gIHV1aWQsXG59OiB7XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgdXVpZDogVVVJRDtcbn0pOiBQcm90by5Hcm91cENoYW5nZS5BY3Rpb25zIHtcbiAgY29uc3QgTUVNQkVSX1JPTEVfRU5VTSA9IFByb3RvLk1lbWJlci5Sb2xlO1xuICBjb25zdCBhY3Rpb25zID0gbmV3IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMoKTtcblxuICBpZiAoIWdyb3VwLnNlY3JldFBhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdidWlsZEFkZFBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyQ2hhbmdlOiBncm91cCB3YXMgbWlzc2luZyBzZWNyZXRQYXJhbXMhJ1xuICAgICk7XG4gIH1cblxuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihncm91cC5zZWNyZXRQYXJhbXMpO1xuICBjb25zdCB1dWlkQ2lwaGVyVGV4dEJ1ZmZlciA9IGVuY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHV1aWQpO1xuXG4gIGNvbnN0IHByb21vdGVQZW5kaW5nTWVtYmVyID1cbiAgICBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5Qcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxBY3Rpb24oKTtcbiAgcHJvbW90ZVBlbmRpbmdNZW1iZXIudXNlcklkID0gdXVpZENpcGhlclRleHRCdWZmZXI7XG4gIHByb21vdGVQZW5kaW5nTWVtYmVyLnJvbGUgPSBNRU1CRVJfUk9MRV9FTlVNLkRFRkFVTFQ7XG5cbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcbiAgYWN0aW9ucy5wcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzID0gW3Byb21vdGVQZW5kaW5nTWVtYmVyXTtcblxuICByZXR1cm4gYWN0aW9ucztcbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRQcm9tb3RlTWVtYmVyQ2hhbmdlT3B0aW9uc1R5cGUgPSBSZWFkb25seTx7XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0OiBzdHJpbmc7XG4gIHByb2ZpbGVLZXlDcmVkZW50aWFsQmFzZTY0Pzogc3RyaW5nO1xuICBwbmlDcmVkZW50aWFsQmFzZTY0Pzogc3RyaW5nO1xufT47XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFByb21vdGVNZW1iZXJDaGFuZ2Uoe1xuICBncm91cCxcbiAgcHJvZmlsZUtleUNyZWRlbnRpYWxCYXNlNjQsXG4gIHBuaUNyZWRlbnRpYWxCYXNlNjQsXG4gIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NCxcbn06IEJ1aWxkUHJvbW90ZU1lbWJlckNoYW5nZU9wdGlvbnNUeXBlKTogUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB7XG4gIGNvbnN0IGFjdGlvbnMgPSBuZXcgUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucygpO1xuXG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2J1aWxkRGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lckNoYW5nZTogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zISdcbiAgICApO1xuICB9XG5cbiAgYWN0aW9ucy52ZXJzaW9uID0gKGdyb3VwLnJldmlzaW9uIHx8IDApICsgMTtcblxuICBjb25zdCBjbGllbnRaa1Byb2ZpbGVDaXBoZXIgPSBnZXRDbGllbnRaa1Byb2ZpbGVPcGVyYXRpb25zKFxuICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NFxuICApO1xuXG4gIGxldCBwcmVzZW50YXRpb246IFVpbnQ4QXJyYXk7XG4gIGlmIChwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHJlc2VudGF0aW9uID0gY3JlYXRlUHJvZmlsZUtleUNyZWRlbnRpYWxQcmVzZW50YXRpb24oXG4gICAgICBjbGllbnRaa1Byb2ZpbGVDaXBoZXIsXG4gICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEJhc2U2NCxcbiAgICAgIGdyb3VwLnNlY3JldFBhcmFtc1xuICAgICk7XG5cbiAgICBhY3Rpb25zLnByb21vdGVQZW5kaW5nTWVtYmVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgcHJlc2VudGF0aW9uLFxuICAgICAgfSxcbiAgICBdO1xuICB9IGVsc2Uge1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIHBuaUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgICAnRWl0aGVyIHBuaUNyZWRlbnRpYWwgb3IgcHJvZmlsZUtleUNyZWRlbnRpYWwgbXVzdCBiZSBwcmVzZW50J1xuICAgICk7XG4gICAgcHJlc2VudGF0aW9uID0gY3JlYXRlUE5JQ3JlZGVudGlhbFByZXNlbnRhdGlvbihcbiAgICAgIGNsaWVudFprUHJvZmlsZUNpcGhlcixcbiAgICAgIHBuaUNyZWRlbnRpYWxCYXNlNjQsXG4gICAgICBncm91cC5zZWNyZXRQYXJhbXNcbiAgICApO1xuXG4gICAgYWN0aW9ucy5wcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5ID0gW1xuICAgICAge1xuICAgICAgICBwcmVzZW50YXRpb24sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gYWN0aW9ucztcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBsb2FkR3JvdXBDaGFuZ2Uoe1xuICBhY3Rpb25zLFxuICBncm91cCxcbiAgaW52aXRlTGlua1Bhc3N3b3JkLFxufToge1xuICBhY3Rpb25zOiBQcm90by5Hcm91cENoYW5nZS5JQWN0aW9ucztcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xuICBpbnZpdGVMaW5rUGFzc3dvcmQ/OiBzdHJpbmc7XG59KTogUHJvbWlzZTxQcm90by5JR3JvdXBDaGFuZ2U+IHtcbiAgY29uc3QgbG9nSWQgPSBpZEZvckxvZ2dpbmcoZ3JvdXAuZ3JvdXBJZCk7XG5cbiAgLy8gRW5zdXJlIHdlIGhhdmUgdGhlIGNyZWRlbnRpYWxzIHdlIG5lZWQgYmVmb3JlIGF0dGVtcHRpbmcgR3JvdXBzVjIgb3BlcmF0aW9uc1xuICBhd2FpdCBtYXliZUZldGNoTmV3Q3JlZGVudGlhbHMoKTtcblxuICBpZiAoIWdyb3VwLnNlY3JldFBhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcigndXBsb2FkR3JvdXBDaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnKTtcbiAgfVxuICBpZiAoIWdyb3VwLnB1YmxpY1BhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcigndXBsb2FkR3JvdXBDaGFuZ2U6IGdyb3VwIHdhcyBtaXNzaW5nIHB1YmxpY1BhcmFtcyEnKTtcbiAgfVxuXG4gIHJldHVybiBtYWtlUmVxdWVzdFdpdGhUZW1wb3JhbFJldHJ5KHtcbiAgICBsb2dJZDogYHVwbG9hZEdyb3VwQ2hhbmdlLyR7bG9nSWR9YCxcbiAgICBwdWJsaWNQYXJhbXM6IGdyb3VwLnB1YmxpY1BhcmFtcyxcbiAgICBzZWNyZXRQYXJhbXM6IGdyb3VwLnNlY3JldFBhcmFtcyxcbiAgICByZXF1ZXN0OiAoc2VuZGVyLCBvcHRpb25zKSA9PlxuICAgICAgc2VuZGVyLm1vZGlmeUdyb3VwKGFjdGlvbnMsIG9wdGlvbnMsIGludml0ZUxpbmtQYXNzd29yZCksXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbW9kaWZ5R3JvdXBWMih7XG4gIGNvbnZlcnNhdGlvbixcbiAgdXNpbmdDcmVkZW50aWFsc0Zyb20sXG4gIGNyZWF0ZUdyb3VwQ2hhbmdlLFxuICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kLFxuICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gIG5hbWUsXG59OiB7XG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWw7XG4gIHVzaW5nQ3JlZGVudGlhbHNGcm9tOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvbk1vZGVsPjtcbiAgY3JlYXRlR3JvdXBDaGFuZ2U6ICgpID0+IFByb21pc2U8UHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucyB8IHVuZGVmaW5lZD47XG4gIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQ/OiBBcnJheTxzdHJpbmc+O1xuICBpbnZpdGVMaW5rUGFzc3dvcmQ/OiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbn0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBgJHtuYW1lfS8ke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gO1xuXG4gIGlmICghZ2V0SXNHcm91cFYyKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBtb2RpZnlHcm91cFYyLyR7bG9nSWR9OiBDYWxsZWQgZm9yIG5vbi1Hcm91cFYyIGNvbnZlcnNhdGlvbmBcbiAgICApO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgdGltZW91dFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbnMuTUlOVVRFO1xuXG4gIGNvbnN0IE1BWF9BVFRFTVBUUyA9IDU7XG5cbiAgbGV0IHJlZnJlc2hlZENyZWRlbnRpYWxzID0gZmFsc2U7XG5cbiAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCBNQVhfQVRURU1QVFM7IGF0dGVtcHQgKz0gMSkge1xuICAgIGxvZy5pbmZvKGBtb2RpZnlHcm91cFYyLyR7bG9nSWR9OiBTdGFydGluZyBhdHRlbXB0ICR7YXR0ZW1wdH1gKTtcbiAgICB0cnkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IHdpbmRvdy53YWl0Rm9yRW1wdHlFdmVudFF1ZXVlKCk7XG5cbiAgICAgIC8vIEZldGNoIHByb2ZpbGVzIGZvciBjb250YWN0cyB0aGF0IGRvIG5vdCBoYXZlIGNyZWRlbnRpYWxzIChvciBoYXZlXG4gICAgICAvLyBleHBpcmVkIGNyZWRlbnRpYWxzKVxuICAgICAge1xuICAgICAgICBjb25zdCBtZW1iZXJzTWlzc2luZ0NyZWRlbnRpYWxzID0gdXNpbmdDcmVkZW50aWFsc0Zyb20uZmlsdGVyKG1lbWJlciA9PlxuICAgICAgICAgIG1lbWJlci5oYXNQcm9maWxlS2V5Q3JlZGVudGlhbEV4cGlyZWQoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBsb2dJZHMgPSBtZW1iZXJzTWlzc2luZ0NyZWRlbnRpYWxzLm1hcChtZW1iZXIgPT5cbiAgICAgICAgICBtZW1iZXIuaWRGb3JMb2dnaW5nKClcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAobG9nSWRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGxvZy5pbmZvKGBtb2RpZnlHcm91cFYyLyR7bG9nSWR9OiBGZXRjaGluZyBwcm9maWxlcyBmb3IgJHtsb2dJZHN9YCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICBtZW1iZXJzTWlzc2luZ0NyZWRlbnRpYWxzLm1hcChtZW1iZXIgPT4gbWVtYmVyLmdldFByb2ZpbGVzKCkpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGxvZy5pbmZvKGBtb2RpZnlHcm91cFYyLyR7bG9nSWR9OiBRdWV1aW5nIGF0dGVtcHQgJHthdHRlbXB0fWApO1xuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgY29udmVyc2F0aW9uLnF1ZXVlSm9iKCdtb2RpZnlHcm91cFYyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBsb2cuaW5mbyhgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogUnVubmluZyBhdHRlbXB0ICR7YXR0ZW1wdH1gKTtcblxuICAgICAgICBjb25zdCBhY3Rpb25zID0gYXdhaXQgY3JlYXRlR3JvdXBDaGFuZ2UoKTtcbiAgICAgICAgaWYgKCFhY3Rpb25zKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogTm8gY2hhbmdlIGFjdGlvbnMuIFJldHVybmluZyBlYXJseS5gXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgbmV3IHJldmlzaW9uIGhhcyB0byBiZSBleGFjdGx5IG9uZSBtb3JlIHRoYW4gdGhlIGN1cnJlbnQgcmV2aXNpb25cbiAgICAgICAgLy8gICBvciBpdCB3b24ndCB1cGxvYWQgcHJvcGVybHksIGFuZCBpdCB3b24ndCBhcHBseSBpbiBtYXliZVVwZGF0ZUdyb3VwXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZXZpc2lvbiA9IGNvbnZlcnNhdGlvbi5nZXQoJ3JldmlzaW9uJyk7XG4gICAgICAgIGNvbnN0IG5ld1JldmlzaW9uID0gYWN0aW9ucy52ZXJzaW9uO1xuXG4gICAgICAgIGlmICgoY3VycmVudFJldmlzaW9uIHx8IDApICsgMSAhPT0gbmV3UmV2aXNpb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogUmV2aXNpb24gbWlzbWF0Y2ggLSAke2N1cnJlbnRSZXZpc2lvbn0gdG8gJHtuZXdSZXZpc2lvbn0uYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGxvYWQuIElmIHdlIGRvbid0IGhhdmUgcGVybWlzc2lvbiwgdGhlIHNlcnZlciB3aWxsIHJldHVybiBhbiBlcnJvciBoZXJlLlxuICAgICAgICBjb25zdCBncm91cENoYW5nZSA9IGF3YWl0IHVwbG9hZEdyb3VwQ2hhbmdlKHtcbiAgICAgICAgICBhY3Rpb25zLFxuICAgICAgICAgIGludml0ZUxpbmtQYXNzd29yZCxcbiAgICAgICAgICBncm91cDogY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGdyb3VwQ2hhbmdlQnVmZmVyID1cbiAgICAgICAgICBQcm90by5Hcm91cENoYW5nZS5lbmNvZGUoZ3JvdXBDaGFuZ2UpLmZpbmlzaCgpO1xuICAgICAgICBjb25zdCBncm91cENoYW5nZUJhc2U2NCA9IEJ5dGVzLnRvQmFzZTY0KGdyb3VwQ2hhbmdlQnVmZmVyKTtcblxuICAgICAgICAvLyBBcHBseSBjaGFuZ2UgbG9jYWxseSwganVzdCBsaWtlIHdlIHdvdWxkIHdpdGggYW4gaW5jb21pbmcgY2hhbmdlLiBUaGlzIHdpbGxcbiAgICAgICAgLy8gICBjaGFuZ2UgY29udmVyc2F0aW9uIHN0YXRlIGFuZCBhZGQgY2hhbmdlIG5vdGlmaWNhdGlvbnMgdG8gdGhlIHRpbWVsaW5lLlxuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5tYXliZVVwZGF0ZUdyb3VwKHtcbiAgICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgICAgZ3JvdXBDaGFuZ2U6IHtcbiAgICAgICAgICAgIGJhc2U2NDogZ3JvdXBDaGFuZ2VCYXNlNjQsXG4gICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBuZXdSZXZpc2lvbixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZ3JvdXBWMkluZm8gPSBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgICAgICAgIGluY2x1ZGVQZW5kaW5nTWVtYmVyczogdHJ1ZSxcbiAgICAgICAgICBleHRyYUNvbnZlcnNhdGlvbnNGb3JTZW5kLFxuICAgICAgICB9KTtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KGdyb3VwVjJJbmZvLCAnbWlzc2luZyBncm91cFYySW5mbycpO1xuXG4gICAgICAgIGF3YWl0IGNvbnZlcnNhdGlvbkpvYlF1ZXVlLmFkZCh7XG4gICAgICAgICAgdHlwZTogY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLmVudW0uR3JvdXBVcGRhdGUsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICBncm91cENoYW5nZUJhc2U2NCxcbiAgICAgICAgICByZWNpcGllbnRzOiBncm91cFYySW5mby5tZW1iZXJzLFxuICAgICAgICAgIHJldmlzaW9uOiBncm91cFYySW5mby5yZXZpc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgd2UndmUgZ290dGVuIGhlcmUgd2l0aCBubyBlcnJvciwgd2UgZXhpdCFcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogVXBkYXRlIGNvbXBsZXRlLCB3aXRoIGF0dGVtcHQgJHthdHRlbXB0fSFgXG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSA0MDkgJiYgRGF0ZS5ub3coKSA8PSB0aW1lb3V0VGltZSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogQ29uZmxpY3Qgd2hpbGUgdXBkYXRpbmcuIFRyeWluZyBhZ2Fpbi4uLmBcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBjb252ZXJzYXRpb24uZmV0Y2hMYXRlc3RHcm91cFYyRGF0YSh7IGZvcmNlOiB0cnVlIH0pO1xuICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSA0MDAgJiYgIXJlZnJlc2hlZENyZWRlbnRpYWxzKSB7XG4gICAgICAgIGNvbnN0IGxvZ0lkcyA9IHVzaW5nQ3JlZGVudGlhbHNGcm9tLm1hcChtZW1iZXIgPT5cbiAgICAgICAgICBtZW1iZXIuaWRGb3JMb2dnaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGxvZ0lkcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBtb2RpZnlHcm91cFYyLyR7bG9nSWR9OiBQcm9maWxlIGtleSBjcmVkZW50aWFscyB3ZXJlIG5vdCBgICtcbiAgICAgICAgICAgICAgYHVwLXRvLWRhdGUuIFVwZGF0aW5nIHByb2ZpbGVzIGZvciAke2xvZ0lkc30gYW5kIHJldHJ5aW5nYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiB1c2luZ0NyZWRlbnRpYWxzRnJvbSkge1xuICAgICAgICAgIG1lbWJlci5zZXQoe1xuICAgICAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWw6IG51bGwsXG4gICAgICAgICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEV4cGlyYXRpb246IG51bGwsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICB1c2luZ0NyZWRlbnRpYWxzRnJvbS5tYXAobWVtYmVyID0+IG1lbWJlci5nZXRQcm9maWxlcygpKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEZldGNoIGNyZWRlbnRpYWxzIG9ubHkgb25jZVxuICAgICAgICByZWZyZXNoZWRDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGVycm9yLmNvZGUgPT09IDQwOSkge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgYG1vZGlmeUdyb3VwVjIvJHtsb2dJZH06IENvbmZsaWN0IHdoaWxlIHVwZGF0aW5nLiBUaW1lZCBvdXQ7IG5vdCByZXRyeWluZy5gXG4gICAgICAgICk7XG4gICAgICAgIC8vIFdlIGRvbid0IHdhaXQgaGVyZSBiZWNhdXNlIHdlJ3JlIGJyZWFraW5nIG91dCBvZiB0aGUgbG9vcCBpbW1lZGlhdGVseS5cbiAgICAgICAgY29udmVyc2F0aW9uLmZldGNoTGF0ZXN0R3JvdXBWMkRhdGEoeyBmb3JjZTogdHJ1ZSB9KTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlcnJvclN0cmluZyA9IEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcik7XG4gICAgICAgIGxvZy5lcnJvcihgbW9kaWZ5R3JvdXBWMi8ke2xvZ0lkfTogRXJyb3IgdXBkYXRpbmc6ICR7ZXJyb3JTdHJpbmd9YCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBVdGlsaXR5XG5cbmV4cG9ydCBmdW5jdGlvbiBpZEZvckxvZ2dpbmcoZ3JvdXBJZDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBncm91cHYyKCR7Z3JvdXBJZH0pYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleTogVWludDhBcnJheSk6IEdyb3VwRmllbGRzIHtcbiAgaWYgKG1hc3RlcktleS5sZW5ndGggIT09IE1BU1RFUl9LRVlfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGRlcml2ZUdyb3VwRmllbGRzOiBtYXN0ZXJLZXkgaGFkIGxlbmd0aCAke21hc3RlcktleS5sZW5ndGh9LCBgICtcbiAgICAgICAgYGV4cGVjdGVkICR7TUFTVEVSX0tFWV9MRU5HVEh9YFxuICAgICk7XG4gIH1cblxuICBjb25zdCBjYWNoZUtleSA9IEJ5dGVzLnRvQmFzZTY0KG1hc3RlcktleSk7XG4gIGNvbnN0IGNhY2hlZCA9IGdyb3VwRmllbGRzQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH1cblxuICBsb2cuaW5mbygnZGVyaXZlR3JvdXBGaWVsZHM6IGNhY2hlIG1pc3MnKTtcblxuICBjb25zdCBzZWNyZXRQYXJhbXMgPSBkZXJpdmVHcm91cFNlY3JldFBhcmFtcyhtYXN0ZXJLZXkpO1xuICBjb25zdCBwdWJsaWNQYXJhbXMgPSBkZXJpdmVHcm91cFB1YmxpY1BhcmFtcyhzZWNyZXRQYXJhbXMpO1xuICBjb25zdCBpZCA9IGRlcml2ZUdyb3VwSUQoc2VjcmV0UGFyYW1zKTtcblxuICBjb25zdCBmcmVzaCA9IHtcbiAgICBpZCxcbiAgICBzZWNyZXRQYXJhbXMsXG4gICAgcHVibGljUGFyYW1zLFxuICB9O1xuICBncm91cEZpZWxkc0NhY2hlLnNldChjYWNoZUtleSwgZnJlc2gpO1xuICByZXR1cm4gZnJlc2g7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0V2l0aFRlbXBvcmFsUmV0cnk8VD4oe1xuICBsb2dJZCxcbiAgcHVibGljUGFyYW1zLFxuICBzZWNyZXRQYXJhbXMsXG4gIHJlcXVlc3QsXG59OiB7XG4gIGxvZ0lkOiBzdHJpbmc7XG4gIHB1YmxpY1BhcmFtczogc3RyaW5nO1xuICBzZWNyZXRQYXJhbXM6IHN0cmluZztcbiAgcmVxdWVzdDogKHNlbmRlcjogTWVzc2FnZVNlbmRlciwgb3B0aW9uczogR3JvdXBDcmVkZW50aWFsc1R5cGUpID0+IFByb21pc2U8VD47XG59KTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IGdyb3VwQ3JlZGVudGlhbHMgPSBnZXRDaGVja2VkQ3JlZGVudGlhbHNGb3JUb2RheShcbiAgICBgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeS8ke2xvZ0lkfWBcbiAgKTtcblxuICBjb25zdCBzZW5kZXIgPSB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmc7XG4gIGlmICghc2VuZGVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYG1ha2VSZXF1ZXN0V2l0aFRlbXBvcmFsUmV0cnkvJHtsb2dJZH06IHRleHRzZWN1cmUubWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUhYFxuICAgICk7XG4gIH1cblxuICBsb2cuaW5mbyhgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeS8ke2xvZ0lkfTogc3RhcnRpbmdgKTtcblxuICBjb25zdCB0b2RheU9wdGlvbnMgPSBnZXRHcm91cENyZWRlbnRpYWxzKHtcbiAgICBhdXRoQ3JlZGVudGlhbEJhc2U2NDogZ3JvdXBDcmVkZW50aWFscy50b2RheS5jcmVkZW50aWFsLFxuICAgIGdyb3VwUHVibGljUGFyYW1zQmFzZTY0OiBwdWJsaWNQYXJhbXMsXG4gICAgZ3JvdXBTZWNyZXRQYXJhbXNCYXNlNjQ6IHNlY3JldFBhcmFtcyxcbiAgICBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQ6IHdpbmRvdy5nZXRTZXJ2ZXJQdWJsaWNQYXJhbXMoKSxcbiAgfSk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmVxdWVzdChzZW5kZXIsIHRvZGF5T3B0aW9ucyk7XG4gIH0gY2F0Y2ggKHRvZGF5RXJyb3IpIHtcbiAgICBpZiAodG9kYXlFcnJvci5jb2RlID09PSBURU1QT1JBTF9BVVRIX1JFSkVDVEVEX0NPREUpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeS8ke2xvZ0lkfTogVHJ5aW5nIGFnYWluIHdpdGggdG9tb3Jyb3cncyBjcmVkZW50aWFsc2BcbiAgICAgICk7XG4gICAgICBjb25zdCB0b21vcnJvd09wdGlvbnMgPSBnZXRHcm91cENyZWRlbnRpYWxzKHtcbiAgICAgICAgYXV0aENyZWRlbnRpYWxCYXNlNjQ6IGdyb3VwQ3JlZGVudGlhbHMudG9tb3Jyb3cuY3JlZGVudGlhbCxcbiAgICAgICAgZ3JvdXBQdWJsaWNQYXJhbXNCYXNlNjQ6IHB1YmxpY1BhcmFtcyxcbiAgICAgICAgZ3JvdXBTZWNyZXRQYXJhbXNCYXNlNjQ6IHNlY3JldFBhcmFtcyxcbiAgICAgICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0OiB3aW5kb3cuZ2V0U2VydmVyUHVibGljUGFyYW1zKCksXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3Qoc2VuZGVyLCB0b21vcnJvd09wdGlvbnMpO1xuICAgIH1cblxuICAgIHRocm93IHRvZGF5RXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTWVtYmVyc2hpcFByb29mKHtcbiAgcHVibGljUGFyYW1zLFxuICBzZWNyZXRQYXJhbXMsXG59OiB7XG4gIHB1YmxpY1BhcmFtczogc3RyaW5nO1xuICBzZWNyZXRQYXJhbXM6IHN0cmluZztcbn0pOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAvLyBFbnN1cmUgd2UgaGF2ZSB0aGUgY3JlZGVudGlhbHMgd2UgbmVlZCBiZWZvcmUgYXR0ZW1wdGluZyBHcm91cHNWMiBvcGVyYXRpb25zXG4gIGF3YWl0IG1heWJlRmV0Y2hOZXdDcmVkZW50aWFscygpO1xuXG4gIGlmICghcHVibGljUGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmZXRjaE1lbWJlcnNoaXBQcm9vZjogZ3JvdXAgd2FzIG1pc3NpbmcgcHVibGljUGFyYW1zIScpO1xuICB9XG4gIGlmICghc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmZXRjaE1lbWJlcnNoaXBQcm9vZjogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zIScpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBtYWtlUmVxdWVzdFdpdGhUZW1wb3JhbFJldHJ5KHtcbiAgICBsb2dJZDogJ2ZldGNoTWVtYmVyc2hpcFByb29mJyxcbiAgICBwdWJsaWNQYXJhbXMsXG4gICAgc2VjcmV0UGFyYW1zLFxuICAgIHJlcXVlc3Q6IChzZW5kZXIsIG9wdGlvbnMpID0+IHNlbmRlci5nZXRHcm91cE1lbWJlcnNoaXBUb2tlbihvcHRpb25zKSxcbiAgfSk7XG4gIHJldHVybiByZXNwb25zZS50b2tlbjtcbn1cblxuLy8gQ3JlYXRpbmcgYSBncm91cFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlR3JvdXBWMihcbiAgb3B0aW9uczogUmVhZG9ubHk8e1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBhdmF0YXI6IHVuZGVmaW5lZCB8IFVpbnQ4QXJyYXk7XG4gICAgZXhwaXJlVGltZXI6IHVuZGVmaW5lZCB8IG51bWJlcjtcbiAgICBjb252ZXJzYXRpb25JZHM6IEFycmF5PHN0cmluZz47XG4gICAgYXZhdGFycz86IEFycmF5PEF2YXRhckRhdGFUeXBlPjtcbiAgICByZWZyZXNoZWRDcmVkZW50aWFscz86IGJvb2xlYW47XG4gIH0+XG4pOiBQcm9taXNlPENvbnZlcnNhdGlvbk1vZGVsPiB7XG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIGF2YXRhcixcbiAgICBleHBpcmVUaW1lcixcbiAgICBjb252ZXJzYXRpb25JZHMsXG4gICAgYXZhdGFycyxcbiAgICByZWZyZXNoZWRDcmVkZW50aWFscyA9IGZhbHNlLFxuICB9ID0gb3B0aW9ucztcblxuICAvLyBFbnN1cmUgd2UgaGF2ZSB0aGUgY3JlZGVudGlhbHMgd2UgbmVlZCBiZWZvcmUgYXR0ZW1wdGluZyBHcm91cHNWMiBvcGVyYXRpb25zXG4gIGF3YWl0IG1heWJlRmV0Y2hOZXdDcmVkZW50aWFscygpO1xuXG4gIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcbiAgY29uc3QgTUVNQkVSX1JPTEVfRU5VTSA9IFByb3RvLk1lbWJlci5Sb2xlO1xuXG4gIGNvbnN0IG1hc3RlcktleUJ1ZmZlciA9IGdldFJhbmRvbUJ5dGVzKDMyKTtcbiAgY29uc3QgZmllbGRzID0gZGVyaXZlR3JvdXBGaWVsZHMobWFzdGVyS2V5QnVmZmVyKTtcblxuICBjb25zdCBncm91cElkID0gQnl0ZXMudG9CYXNlNjQoZmllbGRzLmlkKTtcbiAgY29uc3QgbG9nSWQgPSBgZ3JvdXB2Migke2dyb3VwSWR9KWA7XG5cbiAgY29uc3QgbWFzdGVyS2V5ID0gQnl0ZXMudG9CYXNlNjQobWFzdGVyS2V5QnVmZmVyKTtcbiAgY29uc3Qgc2VjcmV0UGFyYW1zID0gQnl0ZXMudG9CYXNlNjQoZmllbGRzLnNlY3JldFBhcmFtcyk7XG4gIGNvbnN0IHB1YmxpY1BhcmFtcyA9IEJ5dGVzLnRvQmFzZTY0KGZpZWxkcy5wdWJsaWNQYXJhbXMpO1xuXG4gIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKS50b1N0cmluZygpO1xuXG4gIGNvbnN0IG91ckNvbnZlcnNhdGlvbiA9XG4gICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uT3JUaHJvdygpO1xuICBpZiAob3VyQ29udmVyc2F0aW9uLmhhc1Byb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJlZCgpKSB7XG4gICAgbG9nLmluZm8oYGNyZWF0ZUdyb3VwVjIvJHtsb2dJZH06IGZldGNoaW5nIG91ciBvd24gY3JlZGVudGlhbHNgKTtcbiAgICBhd2FpdCBvdXJDb252ZXJzYXRpb24uZ2V0UHJvZmlsZXMoKTtcbiAgfVxuXG4gIGNvbnN0IG1lbWJlcnNWMjogQXJyYXk8R3JvdXBWMk1lbWJlclR5cGU+ID0gW1xuICAgIHtcbiAgICAgIHV1aWQ6IG91ckFDSSxcbiAgICAgIHJvbGU6IE1FTUJFUl9ST0xFX0VOVU0uQURNSU5JU1RSQVRPUixcbiAgICAgIGpvaW5lZEF0VmVyc2lvbjogMCxcbiAgICB9LFxuICBdO1xuICBjb25zdCBwZW5kaW5nTWVtYmVyc1YyOiBBcnJheTxHcm91cFYyUGVuZGluZ01lbWJlclR5cGU+ID0gW107XG5cbiAgbGV0IHVwbG9hZGVkQXZhdGFyOiB1bmRlZmluZWQgfCBVcGxvYWRlZEF2YXRhclR5cGU7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIC4uLmNvbnZlcnNhdGlvbklkcy5tYXAoYXN5bmMgY29udmVyc2F0aW9uSWQgPT4ge1xuICAgICAgY29uc3QgY29udGFjdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICBpZiAoIWNvbnRhY3QpIHtcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIGBjcmVhdGVHcm91cFYyLyR7bG9nSWR9OiBtaXNzaW5nIGxvY2FsIGNvbnRhY3QsIHNraXBwaW5nYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRhY3RVdWlkID0gY29udGFjdC5nZXQoJ3V1aWQnKTtcbiAgICAgIGlmICghY29udGFjdFV1aWQpIHtcbiAgICAgICAgYXNzZXJ0KGZhbHNlLCBgY3JlYXRlR3JvdXBWMi8ke2xvZ0lkfTogbWlzc2luZyBVVUlEOyBza2lwcGluZ2ApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZnJlc2ggb3VyIGxvY2FsIGRhdGEgdG8gYmUgc3VyZVxuICAgICAgaWYgKGNvbnRhY3QuaGFzUHJvZmlsZUtleUNyZWRlbnRpYWxFeHBpcmVkKCkpIHtcbiAgICAgICAgYXdhaXQgY29udGFjdC5nZXRQcm9maWxlcygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGFjdC5nZXQoJ3Byb2ZpbGVLZXknKSAmJiBjb250YWN0LmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKSkge1xuICAgICAgICBtZW1iZXJzVjIucHVzaCh7XG4gICAgICAgICAgdXVpZDogY29udGFjdFV1aWQsXG4gICAgICAgICAgcm9sZTogTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxULFxuICAgICAgICAgIGpvaW5lZEF0VmVyc2lvbjogMCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZW5kaW5nTWVtYmVyc1YyLnB1c2goe1xuICAgICAgICAgIGFkZGVkQnlVc2VySWQ6IG91ckFDSSxcbiAgICAgICAgICB1dWlkOiBjb250YWN0VXVpZCxcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgcm9sZTogTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxULFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSxcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFhdmF0YXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGxvYWRlZEF2YXRhciA9IGF3YWl0IHVwbG9hZEF2YXRhcih7XG4gICAgICAgIGRhdGE6IGF2YXRhcixcbiAgICAgICAgbG9nSWQsXG4gICAgICAgIHB1YmxpY1BhcmFtcyxcbiAgICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgfSk7XG4gICAgfSkoKSxcbiAgXSk7XG5cbiAgaWYgKG1lbWJlcnNWMi5sZW5ndGggKyBwZW5kaW5nTWVtYmVyc1YyLmxlbmd0aCA+IGdldEdyb3VwU2l6ZUhhcmRMaW1pdCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGNyZWF0ZUdyb3VwVjIvJHtsb2dJZH06IFRvbyBtYW55IG1lbWJlcnMhIE1lbWJlciBjb3VudDogJHttZW1iZXJzVjIubGVuZ3RofSwgUGVuZGluZyBtZW1iZXIgY291bnQ6ICR7cGVuZGluZ01lbWJlcnNWMi5sZW5ndGh9YFxuICAgICk7XG4gIH1cblxuICBjb25zdCBwcm90b0FuZENvbnZlcnNhdGlvbkF0dHJpYnV0ZXMgPSB7XG4gICAgbmFtZSxcblxuICAgIC8vIENvcmUgR3JvdXBWMiBpbmZvXG4gICAgcmV2aXNpb246IDAsXG4gICAgcHVibGljUGFyYW1zLFxuICAgIHNlY3JldFBhcmFtcyxcblxuICAgIC8vIEdyb3VwVjIgc3RhdGVcbiAgICBhY2Nlc3NDb250cm9sOiB7XG4gICAgICBhdHRyaWJ1dGVzOiBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgICBtZW1iZXJzOiBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgICBhZGRGcm9tSW52aXRlTGluazogQUNDRVNTX0VOVU0uVU5TQVRJU0ZJQUJMRSxcbiAgICB9LFxuICAgIG1lbWJlcnNWMixcbiAgICBwZW5kaW5nTWVtYmVyc1YyLFxuICB9O1xuXG4gIGNvbnN0IGdyb3VwUHJvdG8gPSBhd2FpdCBidWlsZEdyb3VwUHJvdG8oe1xuICAgIGlkOiBncm91cElkLFxuICAgIGF2YXRhclVybDogdXBsb2FkZWRBdmF0YXI/LmtleSxcbiAgICAuLi5wcm90b0FuZENvbnZlcnNhdGlvbkF0dHJpYnV0ZXMsXG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeSh7XG4gICAgICBsb2dJZDogYGNyZWF0ZUdyb3VwVjIvJHtsb2dJZH1gLFxuICAgICAgcHVibGljUGFyYW1zLFxuICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgcmVxdWVzdDogKHNlbmRlciwgcmVxdWVzdE9wdGlvbnMpID0+XG4gICAgICAgIHNlbmRlci5jcmVhdGVHcm91cChncm91cFByb3RvLCByZXF1ZXN0T3B0aW9ucyksXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgaWYgKGVycm9yLmNvZGUgIT09IDQwMCB8fCByZWZyZXNoZWRDcmVkZW50aWFscykge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nSWRzID0gY29udmVyc2F0aW9uSWRzLm1hcChjb252ZXJzYXRpb25JZCA9PiB7XG4gICAgICBjb25zdCBjb250YWN0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGlmICghY29udGFjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb250YWN0LnNldCh7XG4gICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsOiBudWxsLFxuICAgICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbEV4cGlyYXRpb246IG51bGwsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGNvbnRhY3QuaWRGb3JMb2dnaW5nKCk7XG4gICAgfSk7XG5cbiAgICBsb2cud2FybihcbiAgICAgIGBjcmVhdGVHcm91cFYyLyR7bG9nSWR9OiBQcm9maWxlIGtleSBjcmVkZW50aWFscyB3ZXJlIG5vdCBgICtcbiAgICAgICAgYHVwLXRvLWRhdGUuIFVwZGF0aW5nIHByb2ZpbGVzIGZvciAke2xvZ0lkc30gYW5kIHJldHJ5aW5nYFxuICAgICk7XG5cbiAgICByZXR1cm4gY3JlYXRlR3JvdXBWMih7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgcmVmcmVzaGVkQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBsZXQgYXZhdGFyQXR0cmlidXRlOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVsnYXZhdGFyJ107XG4gIGlmICh1cGxvYWRlZEF2YXRhcikge1xuICAgIHRyeSB7XG4gICAgICBhdmF0YXJBdHRyaWJ1dGUgPSB7XG4gICAgICAgIHVybDogdXBsb2FkZWRBdmF0YXIua2V5LFxuICAgICAgICBwYXRoOiBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMud3JpdGVOZXdBdHRhY2htZW50RGF0YShcbiAgICAgICAgICB1cGxvYWRlZEF2YXRhci5kYXRhXG4gICAgICAgICksXG4gICAgICAgIGhhc2g6IHVwbG9hZGVkQXZhdGFyLmhhc2gsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBjcmVhdGVHcm91cFYyLyR7bG9nSWR9OiBhdmF0YXIgZmFpbGVkIHRvIHNhdmUgdG8gZGlzay4gQ29udGludWluZyBvbmBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZUFuZFdhaXQoXG4gICAgZ3JvdXBJZCxcbiAgICAnZ3JvdXAnLFxuICAgIHtcbiAgICAgIC4uLnByb3RvQW5kQ29udmVyc2F0aW9uQXR0cmlidXRlcyxcbiAgICAgIGFjdGl2ZV9hdDogbm93LFxuICAgICAgYWRkZWRCeTogb3VyQUNJLFxuICAgICAgYXZhdGFyOiBhdmF0YXJBdHRyaWJ1dGUsXG4gICAgICBhdmF0YXJzLFxuICAgICAgZ3JvdXBWZXJzaW9uOiAyLFxuICAgICAgbWFzdGVyS2V5LFxuICAgICAgcHJvZmlsZVNoYXJpbmc6IHRydWUsXG4gICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgIG5lZWRzU3RvcmFnZVNlcnZpY2VTeW5jOiB0cnVlLFxuICAgIH1cbiAgKTtcblxuICBhd2FpdCBjb252ZXJzYXRpb24ucXVldWVKb2IoJ3N0b3JhZ2VTZXJ2aWNlVXBsb2FkSm9iJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuU2VydmljZXMuc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IoKTtcbiAgfSk7XG5cbiAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZ3JvdXBWMkluZm8gPSBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgIGluY2x1ZGVQZW5kaW5nTWVtYmVyczogdHJ1ZSxcbiAgfSk7XG4gIHN0cmljdEFzc2VydChncm91cFYySW5mbywgJ21pc3NpbmcgZ3JvdXBWMkluZm8nKTtcblxuICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoe1xuICAgIHR5cGU6IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLkdyb3VwVXBkYXRlLFxuICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb24uaWQsXG4gICAgcmVjaXBpZW50czogZ3JvdXBWMkluZm8ubWVtYmVycyxcbiAgICByZXZpc2lvbjogZ3JvdXBWMkluZm8ucmV2aXNpb24sXG4gIH0pO1xuXG4gIGNvbnN0IGNyZWF0ZWRUaGVHcm91cE1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgIHR5cGU6ICdncm91cC12Mi1jaGFuZ2UnLFxuICAgIHNvdXJjZVV1aWQ6IG91ckFDSSxcbiAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICByZWNlaXZlZF9hdDogd2luZG93LlNpZ25hbC5VdGlsLmluY3JlbWVudE1lc3NhZ2VDb3VudGVyKCksXG4gICAgcmVjZWl2ZWRfYXRfbXM6IHRpbWVzdGFtcCxcbiAgICB0aW1lc3RhbXAsXG4gICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5TZWVuLFxuICAgIHNlbnRfYXQ6IHRpbWVzdGFtcCxcbiAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICBmcm9tOiBvdXJBQ0ksXG4gICAgICBkZXRhaWxzOiBbeyB0eXBlOiAnY3JlYXRlJyB9XSxcbiAgICB9LFxuICB9O1xuICBhd2FpdCBkYXRhSW50ZXJmYWNlLnNhdmVNZXNzYWdlcyhbY3JlYXRlZFRoZUdyb3VwTWVzc2FnZV0sIHtcbiAgICBmb3JjZVNhdmU6IHRydWUsXG4gICAgb3VyVXVpZDogb3VyQUNJLFxuICB9KTtcbiAgY29uc3QgbW9kZWwgPSBuZXcgd2luZG93LldoaXNwZXIuTWVzc2FnZShjcmVhdGVkVGhlR3JvdXBNZXNzYWdlKTtcbiAgd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKG1vZGVsLmlkLCBtb2RlbCk7XG4gIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCduZXdtZXNzYWdlJywgbW9kZWwpO1xuXG4gIGlmIChleHBpcmVUaW1lcikge1xuICAgIGF3YWl0IGNvbnZlcnNhdGlvbi51cGRhdGVFeHBpcmF0aW9uVGltZXIoZXhwaXJlVGltZXIsIHtcbiAgICAgIHJlYXNvbjogJ2NyZWF0ZUdyb3VwVjInLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNvbnZlcnNhdGlvbjtcbn1cblxuLy8gTWlncmF0aW5nIGEgZ3JvdXBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc1YxR3JvdXBCZWVuTWlncmF0ZWQoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWxcbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBsb2dJZCA9IGNvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKTtcbiAgY29uc3QgaXNHcm91cFYxID0gZ2V0SXNHcm91cFYxKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgaWYgKCFpc0dyb3VwVjEpIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBjaGVja0ZvckdWMkV4aXN0ZW5jZS8ke2xvZ0lkfTogQ2FsbGVkIGZvciBub24tR3JvdXBWMSBjb252ZXJzYXRpb24hYFxuICAgICk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRW5zdXJlIHdlIGhhdmUgdGhlIGNyZWRlbnRpYWxzIHdlIG5lZWQgYmVmb3JlIGF0dGVtcHRpbmcgR3JvdXBzVjIgb3BlcmF0aW9uc1xuICBhd2FpdCBtYXliZUZldGNoTmV3Q3JlZGVudGlhbHMoKTtcblxuICBjb25zdCBncm91cElkID0gY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpO1xuICBpZiAoIWdyb3VwSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGNoZWNrRm9yR1YyRXhpc3RlbmNlLyR7bG9nSWR9OiBObyBncm91cElkIWApO1xuICB9XG5cbiAgY29uc3QgaWRCdWZmZXIgPSBCeXRlcy5mcm9tQmluYXJ5KGdyb3VwSWQpO1xuICBjb25zdCBtYXN0ZXJLZXlCdWZmZXIgPSBkZXJpdmVNYXN0ZXJLZXlGcm9tR3JvdXBWMShpZEJ1ZmZlcik7XG4gIGNvbnN0IGZpZWxkcyA9IGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleUJ1ZmZlcik7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBtYWtlUmVxdWVzdFdpdGhUZW1wb3JhbFJldHJ5KHtcbiAgICAgIGxvZ0lkOiBgZ2V0R3JvdXAvJHtsb2dJZH1gLFxuICAgICAgcHVibGljUGFyYW1zOiBCeXRlcy50b0Jhc2U2NChmaWVsZHMucHVibGljUGFyYW1zKSxcbiAgICAgIHNlY3JldFBhcmFtczogQnl0ZXMudG9CYXNlNjQoZmllbGRzLnNlY3JldFBhcmFtcyksXG4gICAgICByZXF1ZXN0OiAoc2VuZGVyLCBvcHRpb25zKSA9PiBzZW5kZXIuZ2V0R3JvdXAob3B0aW9ucyksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgeyBjb2RlIH0gPSBlcnJvcjtcbiAgICByZXR1cm4gY29kZSAhPT0gR1JPVVBfTk9ORVhJU1RFTlRfQ09ERTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF5YmVEZXJpdmVHcm91cFYySWQoY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbCk6IGJvb2xlYW4ge1xuICBjb25zdCBpc0dyb3VwVjEgPSBnZXRJc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICBjb25zdCBncm91cFYxSWQgPSBjb252ZXJzYXRpb24uZ2V0KCdncm91cElkJyk7XG4gIGNvbnN0IGRlcml2ZWQgPSBjb252ZXJzYXRpb24uZ2V0KCdkZXJpdmVkR3JvdXBWMklkJyk7XG5cbiAgaWYgKCFpc0dyb3VwVjEgfHwgIWdyb3VwVjFJZCB8fCBkZXJpdmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdjFJZEJ1ZmZlciA9IEJ5dGVzLmZyb21CaW5hcnkoZ3JvdXBWMUlkKTtcbiAgY29uc3QgbWFzdGVyS2V5QnVmZmVyID0gZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEodjFJZEJ1ZmZlcik7XG4gIGNvbnN0IGZpZWxkcyA9IGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleUJ1ZmZlcik7XG4gIGNvbnN0IGRlcml2ZWRHcm91cFYySWQgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMuaWQpO1xuXG4gIGNvbnZlcnNhdGlvbi5zZXQoe1xuICAgIGRlcml2ZWRHcm91cFYySWQsXG4gIH0pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG50eXBlIFdyYXBwZWRHcm91cENoYW5nZVR5cGUgPSBSZWFkb25seTx7XG4gIGJhc2U2NDogc3RyaW5nO1xuICBpc1RydXN0ZWQ6IGJvb2xlYW47XG59PjtcblxudHlwZSBNaWdyYXRlUHJvcHNUeXBlID0gUmVhZG9ubHk8e1xuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsO1xuICBuZXdSZXZpc2lvbj86IG51bWJlcjtcbiAgcmVjZWl2ZWRBdD86IG51bWJlcjtcbiAgc2VudEF0PzogbnVtYmVyO1xuICBncm91cENoYW5nZT86IFdyYXBwZWRHcm91cENoYW5nZVR5cGU7XG59PjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzR3JvdXBFbGlnaWJsZVRvTWlncmF0ZShcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGlmICghZ2V0SXNHcm91cFYxKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgY29uc3QgYXJlV2VNZW1iZXIgPVxuICAgICFjb252ZXJzYXRpb24uZ2V0KCdsZWZ0JykgJiYgY29udmVyc2F0aW9uLmhhc01lbWJlcihvdXJBQ0kpO1xuICBpZiAoIWFyZVdlTWVtYmVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgbWVtYmVycyA9IGNvbnZlcnNhdGlvbi5nZXQoJ21lbWJlcnMnKSB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIG1heCA9IG1lbWJlcnMubGVuZ3RoOyBpIDwgbWF4OyBpICs9IDEpIHtcbiAgICBjb25zdCBpZGVudGlmaWVyID0gbWVtYmVyc1tpXTtcbiAgICBjb25zdCBjb250YWN0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuXG4gICAgaWYgKCFjb250YWN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghY29udGFjdC5nZXQoJ3V1aWQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsXG4pOiBQcm9taXNlPHtcbiAgZHJvcHBlZEdWMk1lbWJlcklkczogQXJyYXk8c3RyaW5nPjtcbiAgbWVtYmVyc1YyOiBBcnJheTxHcm91cFYyTWVtYmVyVHlwZT47XG4gIHBlbmRpbmdNZW1iZXJzVjI6IEFycmF5PEdyb3VwVjJQZW5kaW5nTWVtYmVyVHlwZT47XG4gIHByZXZpb3VzR3JvdXBWMU1lbWJlcnM6IEFycmF5PHN0cmluZz47XG59PiB7XG4gIGNvbnN0IGxvZ0lkID0gY29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpO1xuICBjb25zdCBNRU1CRVJfUk9MRV9FTlVNID0gUHJvdG8uTWVtYmVyLlJvbGU7XG5cbiAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkKCk7XG4gIGlmICghb3VyQ29udmVyc2F0aW9uSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBDb3VsZG4ndCBmZXRjaCBvdXIgb3duIGNvbnZlcnNhdGlvbklkIWBcbiAgICApO1xuICB9XG5cbiAgY29uc3Qgb3VyQUNJID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpLnRvU3RyaW5nKCk7XG5cbiAgbGV0IGFyZVdlTWVtYmVyID0gZmFsc2U7XG4gIGxldCBhcmVXZUludml0ZWQgPSBmYWxzZTtcblxuICBjb25zdCBwcmV2aW91c0dyb3VwVjFNZW1iZXJzID0gY29udmVyc2F0aW9uLmdldCgnbWVtYmVycycpIHx8IFtdO1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBjb25zdCBtZW1iZXJMb29rdXA6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XG4gIGNvbnN0IG1lbWJlcnNWMjogQXJyYXk8R3JvdXBWMk1lbWJlclR5cGU+ID0gY29tcGFjdChcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHByZXZpb3VzR3JvdXBWMU1lbWJlcnMubWFwKGFzeW5jIGUxNjQgPT4ge1xuICAgICAgICBjb25zdCBjb250YWN0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGUxNjQpO1xuXG4gICAgICAgIGlmICghY29udGFjdCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBnZXRHcm91cE1pZ3JhdGlvbk1lbWJlcnMvJHtsb2dJZH06IG1lbWJlcnNWMiAtIG1pc3NpbmcgbG9jYWwgY29udGFjdCBmb3IgJHtlMTY0fSwgc2tpcHBpbmcuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc01lKGNvbnRhY3QuYXR0cmlidXRlcykgJiYgd2luZG93LkdWMl9NSUdSQVRJT05fRElTQUJMRV9BREQpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBnZXRHcm91cE1pZ3JhdGlvbk1lbWJlcnMvJHtsb2dJZH06IG1lbWJlcnNWMiAtIHNraXBwaW5nICR7ZTE2NH0gZHVlIHRvIEdWMl9NSUdSQVRJT05fRElTQUJMRV9BREQgZmxhZ2BcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGFjdFV1aWQgPSBjb250YWN0LmdldCgndXVpZCcpO1xuICAgICAgICBpZiAoIWNvbnRhY3RVdWlkKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBtZW1iZXJzVjIgLSBtaXNzaW5nIHV1aWQgZm9yICR7ZTE2NH0sIHNraXBwaW5nLmBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb250YWN0LmdldCgncHJvZmlsZUtleScpKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBtZW1iZXJzVjIgLSBtaXNzaW5nIHByb2ZpbGVLZXkgZm9yIG1lbWJlciAke2UxNjR9LCBza2lwcGluZy5gXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYXBhYmlsaXRpZXMgPSBjb250YWN0LmdldCgnY2FwYWJpbGl0aWVzJyk7XG5cbiAgICAgICAgLy8gUmVmcmVzaCBvdXIgbG9jYWwgZGF0YSB0byBiZSBzdXJlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAhY2FwYWJpbGl0aWVzPy5bJ2d2MS1taWdyYXRpb24nXSB8fFxuICAgICAgICAgICFjb250YWN0LmdldCgncHJvZmlsZUtleUNyZWRlbnRpYWwnKVxuICAgICAgICApIHtcbiAgICAgICAgICBhd2FpdCBjb250YWN0LmdldFByb2ZpbGVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXBhYmlsaXRpZXMgPSBjb250YWN0LmdldCgnY2FwYWJpbGl0aWVzJyk7XG4gICAgICAgIGlmICghY2FwYWJpbGl0aWVzPy5bJ2d2MS1taWdyYXRpb24nXSkge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGdldEdyb3VwTWlncmF0aW9uTWVtYmVycy8ke2xvZ0lkfTogbWVtYmVyc1YyIC0gbWVtYmVyICR7ZTE2NH0gaXMgbWlzc2luZyBndjEtbWlncmF0aW9uIGNhcGFiaWxpdHksIHNraXBwaW5nLmBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29udGFjdC5nZXQoJ3Byb2ZpbGVLZXlDcmVkZW50aWFsJykpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBnZXRHcm91cE1pZ3JhdGlvbk1lbWJlcnMvJHtsb2dJZH06IG1lbWJlcnNWMiAtIG5vIHByb2ZpbGVLZXlDcmVkZW50aWFsIGZvciAke2UxNjR9LCBza2lwcGluZy5gXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gY29udGFjdC5pZDtcblxuICAgICAgICBpZiAoY29udmVyc2F0aW9uSWQgPT09IG91ckNvbnZlcnNhdGlvbklkKSB7XG4gICAgICAgICAgYXJlV2VNZW1iZXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVtYmVyTG9va3VwW2NvbnZlcnNhdGlvbklkXSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1dWlkOiBjb250YWN0VXVpZCxcbiAgICAgICAgICByb2xlOiBNRU1CRVJfUk9MRV9FTlVNLkFETUlOSVNUUkFUT1IsXG4gICAgICAgICAgam9pbmVkQXRWZXJzaW9uOiAwLFxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICApXG4gICk7XG5cbiAgY29uc3QgZHJvcHBlZEdWMk1lbWJlcklkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCBwZW5kaW5nTWVtYmVyc1YyOiBBcnJheTxHcm91cFYyUGVuZGluZ01lbWJlclR5cGU+ID0gY29tcGFjdChcbiAgICAocHJldmlvdXNHcm91cFYxTWVtYmVycyB8fCBbXSkubWFwKGUxNjQgPT4ge1xuICAgICAgY29uc3QgY29udGFjdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChlMTY0KTtcblxuICAgICAgaWYgKCFjb250YWN0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBwZW5kaW5nTWVtYmVyc1YyIC0gbWlzc2luZyBsb2NhbCBjb250YWN0IGZvciAke2UxNjR9LCBza2lwcGluZy5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gY29udGFjdC5pZDtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgYWRkZWQgdGhpcyBjb250YWN0IGFib3ZlLCB3ZSdsbCBza2lwIGhlcmVcbiAgICAgIGlmIChtZW1iZXJMb29rdXBbY29udmVyc2F0aW9uSWRdKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTWUoY29udGFjdC5hdHRyaWJ1dGVzKSAmJiB3aW5kb3cuR1YyX01JR1JBVElPTl9ESVNBQkxFX0lOVklURSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBwZW5kaW5nTWVtYmVyc1YyIC0gc2tpcHBpbmcgJHtlMTY0fSBkdWUgdG8gR1YyX01JR1JBVElPTl9ESVNBQkxFX0lOVklURSBmbGFnYFxuICAgICAgICApO1xuICAgICAgICBkcm9wcGVkR1YyTWVtYmVySWRzLnB1c2goY29udmVyc2F0aW9uSWQpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFjdFV1aWQgPSBjb250YWN0LmdldCgndXVpZCcpO1xuICAgICAgaWYgKCFjb250YWN0VXVpZCkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBwZW5kaW5nTWVtYmVyc1YyIC0gbWlzc2luZyB1dWlkIGZvciAke2UxNjR9LCBza2lwcGluZy5gXG4gICAgICAgICk7XG4gICAgICAgIGRyb3BwZWRHVjJNZW1iZXJJZHMucHVzaChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYXBhYmlsaXRpZXMgPSBjb250YWN0LmdldCgnY2FwYWJpbGl0aWVzJyk7XG4gICAgICBpZiAoIWNhcGFiaWxpdGllcz8uWydndjEtbWlncmF0aW9uJ10pIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGdldEdyb3VwTWlncmF0aW9uTWVtYmVycy8ke2xvZ0lkfTogcGVuZGluZ01lbWJlcnNWMiAtIG1lbWJlciAke2UxNjR9IGlzIG1pc3NpbmcgZ3YxLW1pZ3JhdGlvbiBjYXBhYmlsaXR5LCBza2lwcGluZy5gXG4gICAgICAgICk7XG4gICAgICAgIGRyb3BwZWRHVjJNZW1iZXJJZHMucHVzaChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udmVyc2F0aW9uSWQgPT09IG91ckNvbnZlcnNhdGlvbklkKSB7XG4gICAgICAgIGFyZVdlSW52aXRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHV1aWQ6IGNvbnRhY3RVdWlkLFxuICAgICAgICB0aW1lc3RhbXA6IG5vdyxcbiAgICAgICAgYWRkZWRCeVVzZXJJZDogb3VyQUNJLFxuICAgICAgICByb2xlOiBNRU1CRVJfUk9MRV9FTlVNLkFETUlOSVNUUkFUT1IsXG4gICAgICB9O1xuICAgIH0pXG4gICk7XG5cbiAgaWYgKCFhcmVXZU1lbWJlcikge1xuICAgIHRocm93IG5ldyBFcnJvcihgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzLyR7bG9nSWR9OiBXZSBhcmUgbm90IGEgbWVtYmVyIWApO1xuICB9XG4gIGlmIChhcmVXZUludml0ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGdldEdyb3VwTWlncmF0aW9uTWVtYmVycy8ke2xvZ0lkfTogV2UgYXJlIGludml0ZWQhYCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRyb3BwZWRHVjJNZW1iZXJJZHMsXG4gICAgbWVtYmVyc1YyLFxuICAgIHBlbmRpbmdNZW1iZXJzVjIsXG4gICAgcHJldmlvdXNHcm91cFYxTWVtYmVycyxcbiAgfTtcbn1cblxuLy8gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaG9vc2VzIHRvIG1pZ3JhdGUgYSBHcm91cFYxLiBJdCB3aWxsIHVwZGF0ZSB0aGUgc2VydmVyLFxuLy8gICB0aGVuIGxldCBhbGwgbWVtYmVycyBrbm93IGFib3V0IHRoZSBuZXcgZ3JvdXAuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhdGVNaWdyYXRpb25Ub0dyb3VwVjIoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWxcbik6IFByb21pc2U8dm9pZD4ge1xuICAvLyBFbnN1cmUgd2UgaGF2ZSB0aGUgY3JlZGVudGlhbHMgd2UgbmVlZCBiZWZvcmUgYXR0ZW1wdGluZyBHcm91cHNWMiBvcGVyYXRpb25zXG4gIGF3YWl0IG1heWJlRmV0Y2hOZXdDcmVkZW50aWFscygpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uLnF1ZXVlSm9iKCdpbml0aWF0ZU1pZ3JhdGlvblRvR3JvdXBWMicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcblxuICAgICAgY29uc3QgaXNFbGlnaWJsZSA9IGlzR3JvdXBFbGlnaWJsZVRvTWlncmF0ZShjb252ZXJzYXRpb24pO1xuICAgICAgY29uc3QgcHJldmlvdXNHcm91cFYxSWQgPSBjb252ZXJzYXRpb24uZ2V0KCdncm91cElkJyk7XG5cbiAgICAgIGlmICghaXNFbGlnaWJsZSB8fCAhcHJldmlvdXNHcm91cFYxSWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBpbml0aWF0ZU1pZ3JhdGlvblRvR3JvdXBWMjogY29udmVyc2F0aW9uIGlzIG5vdCBlbGlnaWJsZSB0byBtaWdyYXRlISAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdyb3VwVjFJZEJ1ZmZlciA9IEJ5dGVzLmZyb21CaW5hcnkocHJldmlvdXNHcm91cFYxSWQpO1xuICAgICAgY29uc3QgbWFzdGVyS2V5QnVmZmVyID0gZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEoZ3JvdXBWMUlkQnVmZmVyKTtcbiAgICAgIGNvbnN0IGZpZWxkcyA9IGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleUJ1ZmZlcik7XG5cbiAgICAgIGNvbnN0IGdyb3VwSWQgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMuaWQpO1xuICAgICAgY29uc3QgbG9nSWQgPSBgZ3JvdXB2Migke2dyb3VwSWR9KWA7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGluaXRpYXRlTWlncmF0aW9uVG9Hcm91cFYyLyR7bG9nSWR9OiBNaWdyYXRpbmcgZnJvbSAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICApO1xuXG4gICAgICBjb25zdCBtYXN0ZXJLZXkgPSBCeXRlcy50b0Jhc2U2NChtYXN0ZXJLZXlCdWZmZXIpO1xuICAgICAgY29uc3Qgc2VjcmV0UGFyYW1zID0gQnl0ZXMudG9CYXNlNjQoZmllbGRzLnNlY3JldFBhcmFtcyk7XG4gICAgICBjb25zdCBwdWJsaWNQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMucHVibGljUGFyYW1zKTtcblxuICAgICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZCgpO1xuICAgICAgaWYgKCFvdXJDb252ZXJzYXRpb25JZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGluaXRpYXRlTWlncmF0aW9uVG9Hcm91cFYyLyR7bG9nSWR9OiBDb3VsZG4ndCBmZXRjaCBvdXIgb3duIGNvbnZlcnNhdGlvbklkIWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91ckNvbnZlcnNhdGlvbiA9XG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChvdXJDb252ZXJzYXRpb25JZCk7XG4gICAgICBpZiAoIW91ckNvbnZlcnNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGluaXRpYXRlTWlncmF0aW9uVG9Hcm91cFYyLyR7bG9nSWR9OiBjYW5ub3QgZ2V0IG91ciBvd24gY29udmVyc2F0aW9uLiBDYW5ub3QgbWlncmF0ZWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge1xuICAgICAgICBtZW1iZXJzVjIsXG4gICAgICAgIHBlbmRpbmdNZW1iZXJzVjIsXG4gICAgICAgIGRyb3BwZWRHVjJNZW1iZXJJZHMsXG4gICAgICAgIHByZXZpb3VzR3JvdXBWMU1lbWJlcnMsXG4gICAgICB9ID0gYXdhaXQgZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzKGNvbnZlcnNhdGlvbik7XG5cbiAgICAgIGlmIChcbiAgICAgICAgbWVtYmVyc1YyLmxlbmd0aCArIHBlbmRpbmdNZW1iZXJzVjIubGVuZ3RoID5cbiAgICAgICAgZ2V0R3JvdXBTaXplSGFyZExpbWl0KClcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGluaXRpYXRlTWlncmF0aW9uVG9Hcm91cFYyLyR7bG9nSWR9OiBUb28gbWFueSBtZW1iZXJzISBNZW1iZXIgY291bnQ6ICR7bWVtYmVyc1YyLmxlbmd0aH0sIFBlbmRpbmcgbWVtYmVyIGNvdW50OiAke3BlbmRpbmdNZW1iZXJzVjIubGVuZ3RofWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90ZTogQSBmZXcgZ3JvdXAgZWxlbWVudHMgZG9uJ3QgbmVlZCB0byBjaGFuZ2UgaGVyZTpcbiAgICAgIC8vICAgLSBuYW1lXG4gICAgICAvLyAgIC0gZXhwaXJlVGltZXJcbiAgICAgIGxldCBhdmF0YXJBdHRyaWJ1dGU6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlWydhdmF0YXInXTtcbiAgICAgIGNvbnN0IGF2YXRhclBhdGggPSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5hdmF0YXI/LnBhdGg7XG4gICAgICBpZiAoYXZhdGFyUGF0aCkge1xuICAgICAgICBjb25zdCB7IGhhc2gsIGtleSB9ID0gYXdhaXQgdXBsb2FkQXZhdGFyKHtcbiAgICAgICAgICBsb2dJZCxcbiAgICAgICAgICBwdWJsaWNQYXJhbXMsXG4gICAgICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgICAgIHBhdGg6IGF2YXRhclBhdGgsXG4gICAgICAgIH0pO1xuICAgICAgICBhdmF0YXJBdHRyaWJ1dGUgPSB7XG4gICAgICAgICAgdXJsOiBrZXksXG4gICAgICAgICAgcGF0aDogYXZhdGFyUGF0aCxcbiAgICAgICAgICBoYXNoLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0ge1xuICAgICAgICAuLi5jb252ZXJzYXRpb24uYXR0cmlidXRlcyxcbiAgICAgICAgYXZhdGFyOiBhdmF0YXJBdHRyaWJ1dGUsXG5cbiAgICAgICAgLy8gQ29yZSBHcm91cFYyIGluZm9cbiAgICAgICAgcmV2aXNpb246IDAsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGdyb3VwVmVyc2lvbjogMixcbiAgICAgICAgbWFzdGVyS2V5LFxuICAgICAgICBwdWJsaWNQYXJhbXMsXG4gICAgICAgIHNlY3JldFBhcmFtcyxcblxuICAgICAgICAvLyBHcm91cFYyIHN0YXRlXG4gICAgICAgIGFjY2Vzc0NvbnRyb2w6IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgICAgICAgbWVtYmVyczogQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgICAgICAgIGFkZEZyb21JbnZpdGVMaW5rOiBBQ0NFU1NfRU5VTS5VTlNBVElTRklBQkxFLFxuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzVjIsXG4gICAgICAgIHBlbmRpbmdNZW1iZXJzVjIsXG5cbiAgICAgICAgLy8gQ2FwdHVyZSBwcmV2aW91cyBHcm91cFYxIGRhdGEgZm9yIGZ1dHVyZSB1c2VcbiAgICAgICAgcHJldmlvdXNHcm91cFYxSWQsXG4gICAgICAgIHByZXZpb3VzR3JvdXBWMU1lbWJlcnMsXG5cbiAgICAgICAgLy8gQ2xlYXIgc3RvcmFnZSBJRCwgc2luY2Ugd2UgbmVlZCB0byBzdGFydCBvdmVyIG9uIHRoZSBzdG9yYWdlIHNlcnZpY2VcbiAgICAgICAgc3RvcmFnZUlEOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gQ2xlYXIgb2Jzb2xldGUgZGF0YVxuICAgICAgICBkZXJpdmVkR3JvdXBWMklkOiB1bmRlZmluZWQsXG4gICAgICAgIG1lbWJlcnM6IHVuZGVmaW5lZCxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdyb3VwUHJvdG8gPSBidWlsZEdyb3VwUHJvdG8oe1xuICAgICAgICAuLi5uZXdBdHRyaWJ1dGVzLFxuICAgICAgICBhdmF0YXJVcmw6IGF2YXRhckF0dHJpYnV0ZT8udXJsLFxuICAgICAgfSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG1ha2VSZXF1ZXN0V2l0aFRlbXBvcmFsUmV0cnkoe1xuICAgICAgICAgIGxvZ0lkOiBgY3JlYXRlR3JvdXAvJHtsb2dJZH1gLFxuICAgICAgICAgIHB1YmxpY1BhcmFtcyxcbiAgICAgICAgICBzZWNyZXRQYXJhbXMsXG4gICAgICAgICAgcmVxdWVzdDogKHNlbmRlciwgb3B0aW9ucykgPT4gc2VuZGVyLmNyZWF0ZUdyb3VwKGdyb3VwUHJvdG8sIG9wdGlvbnMpLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICBgaW5pdGlhdGVNaWdyYXRpb25Ub0dyb3VwVjIvJHtsb2dJZH06IEVycm9yIGNyZWF0aW5nIGdyb3VwOmAsXG4gICAgICAgICAgZXJyb3Iuc3RhY2tcbiAgICAgICAgKTtcblxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ3JvdXBDaGFuZ2VNZXNzYWdlczogQXJyYXk8R3JvdXBDaGFuZ2VNZXNzYWdlVHlwZT4gPSBbXTtcbiAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXMucHVzaCh7XG4gICAgICAgIC4uLmdlbmVyYXRlQmFzaWNNZXNzYWdlKCksXG4gICAgICAgIHR5cGU6ICdncm91cC12MS1taWdyYXRpb24nLFxuICAgICAgICBpbnZpdGVkR1YyTWVtYmVyczogcGVuZGluZ01lbWJlcnNWMixcbiAgICAgICAgZHJvcHBlZEdWMk1lbWJlcklkcyxcbiAgICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLlNlZW4sXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgdXBkYXRlR3JvdXAoe1xuICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgIHVwZGF0ZXM6IHtcbiAgICAgICAgICBuZXdBdHRyaWJ1dGVzLFxuICAgICAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXMsXG4gICAgICAgICAgbWVtYmVyczogW10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgaWYgKHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQuaXNHcm91cEJsb2NrZWQocHJldmlvdXNHcm91cFYxSWQpKSB7XG4gICAgICAgIHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQuYWRkQmxvY2tlZEdyb3VwKGdyb3VwSWQpO1xuICAgICAgfVxuXG4gICAgICAvLyBTYXZlIHRoZXNlIG1vc3QgcmVjZW50IHVwZGF0ZXMgdG8gY29udmVyc2F0aW9uXG4gICAgICB1cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGxvZ0lkID0gY29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpO1xuICAgIGlmICghZ2V0SXNHcm91cFYxKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgY29uc3QgYWxyZWFkeU1pZ3JhdGVkID0gYXdhaXQgaGFzVjFHcm91cEJlZW5NaWdyYXRlZChjb252ZXJzYXRpb24pO1xuICAgIGlmICghYWxyZWFkeU1pZ3JhdGVkKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGBpbml0aWF0ZU1pZ3JhdGlvblRvR3JvdXBWMi8ke2xvZ0lkfTogR3JvdXAgaGFzIG5vdCBhbHJlYWR5IGJlZW4gbWlncmF0ZWQsIHJlLXRocm93aW5nIGVycm9yYFxuICAgICAgKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24oe1xuICAgICAgY29udmVyc2F0aW9uLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZ3JvdXBWMkluZm8gPSBjb252ZXJzYXRpb24uZ2V0R3JvdXBWMkluZm8oe1xuICAgIGluY2x1ZGVQZW5kaW5nTWVtYmVyczogdHJ1ZSxcbiAgfSk7XG4gIHN0cmljdEFzc2VydChncm91cFYySW5mbywgJ21pc3NpbmcgZ3JvdXBWMkluZm8nKTtcblxuICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoe1xuICAgIHR5cGU6IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLkdyb3VwVXBkYXRlLFxuICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb24uaWQsXG4gICAgcmVjaXBpZW50czogZ3JvdXBWMkluZm8ubWVtYmVycyxcbiAgICByZXZpc2lvbjogZ3JvdXBWMkluZm8ucmV2aXNpb24sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdFRoZW5SZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uKFxuICBvcHRpb25zOiBNaWdyYXRlUHJvcHNUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gRmlyc3Qgd2FpdCB0byBwcm9jZXNzIGFsbCBpbmNvbWluZyBtZXNzYWdlcyBvbiB0aGUgd2Vic29ja2V0XG4gIGF3YWl0IHdpbmRvdy53YWl0Rm9yRW1wdHlFdmVudFF1ZXVlKCk7XG5cbiAgLy8gVGhlbiB3YWl0IHRvIHByb2Nlc3MgYWxsIG91dHN0YW5kaW5nIG1lc3NhZ2VzIGZvciB0aGlzIGNvbnZlcnNhdGlvblxuICBjb25zdCB7IGNvbnZlcnNhdGlvbiB9ID0gb3B0aW9ucztcblxuICBhd2FpdCBjb252ZXJzYXRpb24ucXVldWVKb2IoJ3dhaXRUaGVuUmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQW5kIGZpbmFsbHkgdHJ5IHRvIG1pZ3JhdGUgdGhlIGdyb3VwXG4gICAgICBhd2FpdCByZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uKG9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGB3YWl0VGhlblJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24vJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9OiByZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uIGZhaWx1cmU6YCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE1pZ3JhdGlvbkJ1YmJsZShcbiAgcHJldmlvdXNHcm91cFYxTWVtYmVyc0lkczogQXJyYXk8c3RyaW5nPixcbiAgbmV3QXR0cmlidXRlczogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGVcbik6IEdyb3VwQ2hhbmdlTWVzc2FnZVR5cGUge1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKFVVSURLaW5kLkFDSSk7XG4gIGNvbnN0IG91clBOSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuICBjb25zdCBvdXJDb252ZXJzYXRpb25JZCA9XG4gICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcblxuICAvLyBBc3NlbWJsZSBpdGVtcyB0byBjb21tZW1vcmF0ZSB0aGlzIGV2ZW50IGZvciB0aGUgdGltZWxpbmUuLlxuICBjb25zdCBjb21iaW5lZENvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPiA9IFtcbiAgICAuLi4obmV3QXR0cmlidXRlcy5tZW1iZXJzVjIgfHwgW10pLm1hcChpdGVtID0+IGl0ZW0udXVpZCksXG4gICAgLi4uKG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMiB8fCBbXSkubWFwKGl0ZW0gPT4gaXRlbS51dWlkKSxcbiAgXS5tYXAodXVpZCA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgICBzdHJpY3RBc3NlcnQoY29udmVyc2F0aW9uLCBgQ29udmVyc2F0aW9uIG5vdCBmb3VuZCBmb3IgJHt1dWlkfWApO1xuICAgIHJldHVybiBjb252ZXJzYXRpb24uaWQ7XG4gIH0pO1xuICBjb25zdCBkcm9wcGVkTWVtYmVySWRzOiBBcnJheTxzdHJpbmc+ID0gZGlmZmVyZW5jZShcbiAgICBwcmV2aW91c0dyb3VwVjFNZW1iZXJzSWRzLFxuICAgIGNvbWJpbmVkQ29udmVyc2F0aW9uSWRzXG4gICkuZmlsdGVyKGlkID0+IGlkICYmIGlkICE9PSBvdXJDb252ZXJzYXRpb25JZCk7XG4gIGNvbnN0IGludml0ZWRNZW1iZXJzID0gKG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMiB8fCBbXSkuZmlsdGVyKFxuICAgIGl0ZW0gPT5cbiAgICAgIGl0ZW0udXVpZCAhPT0gb3VyQUNJLnRvU3RyaW5nKCkgJiZcbiAgICAgICEob3VyUE5JICYmIGl0ZW0udXVpZCA9PT0gb3VyUE5JLnRvU3RyaW5nKCkpXG4gICk7XG5cbiAgY29uc3QgYXJlV2VJbnZpdGVkID0gKG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMiB8fCBbXSkuc29tZShcbiAgICBpdGVtID0+XG4gICAgICBpdGVtLnV1aWQgPT09IG91ckFDSS50b1N0cmluZygpIHx8XG4gICAgICAob3VyUE5JICYmIGl0ZW0udXVpZCA9PT0gb3VyUE5JLnRvU3RyaW5nKCkpXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgIHR5cGU6ICdncm91cC12MS1taWdyYXRpb24nLFxuICAgIGdyb3VwTWlncmF0aW9uOiB7XG4gICAgICBhcmVXZUludml0ZWQsXG4gICAgICBpbnZpdGVkTWVtYmVycyxcbiAgICAgIGRyb3BwZWRNZW1iZXJJZHMsXG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhc2ljTWlncmF0aW9uQnViYmxlKCk6IEdyb3VwQ2hhbmdlTWVzc2FnZVR5cGUge1xuICByZXR1cm4ge1xuICAgIC4uLmdlbmVyYXRlQmFzaWNNZXNzYWdlKCksXG4gICAgdHlwZTogJ2dyb3VwLXYxLW1pZ3JhdGlvbicsXG4gICAgZ3JvdXBNaWdyYXRpb246IHtcbiAgICAgIGFyZVdlSW52aXRlZDogZmFsc2UsXG4gICAgICBpbnZpdGVkTWVtYmVyczogW10sXG4gICAgICBkcm9wcGVkTWVtYmVySWRzOiBbXSxcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gam9pbkdyb3VwVjJWaWFMaW5rQW5kTWlncmF0ZSh7XG4gIGFwcHJvdmFsUmVxdWlyZWQsXG4gIGNvbnZlcnNhdGlvbixcbiAgaW52aXRlTGlua1Bhc3N3b3JkLFxuICByZXZpc2lvbixcbn06IHtcbiAgYXBwcm92YWxSZXF1aXJlZDogYm9vbGVhbjtcbiAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbDtcbiAgaW52aXRlTGlua1Bhc3N3b3JkOiBzdHJpbmc7XG4gIHJldmlzaW9uOiBudW1iZXI7XG59KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGlzR3JvdXBWMSA9IGdldElzR3JvdXBWMShjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gIGNvbnN0IHByZXZpb3VzR3JvdXBWMUlkID0gY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpO1xuXG4gIGlmICghaXNHcm91cFYxIHx8ICFwcmV2aW91c0dyb3VwVjFJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBqb2luR3JvdXBWMlZpYUxpbmtBbmRNaWdyYXRlOiBDb252ZXJzYXRpb24gaXMgbm90IEdyb3VwVjEhICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICApO1xuICB9XG5cbiAgLy8gRGVyaXZlIEdyb3VwVjIgZmllbGRzXG4gIGNvbnN0IGdyb3VwVjFJZEJ1ZmZlciA9IEJ5dGVzLmZyb21CaW5hcnkocHJldmlvdXNHcm91cFYxSWQpO1xuICBjb25zdCBtYXN0ZXJLZXlCdWZmZXIgPSBkZXJpdmVNYXN0ZXJLZXlGcm9tR3JvdXBWMShncm91cFYxSWRCdWZmZXIpO1xuICBjb25zdCBmaWVsZHMgPSBkZXJpdmVHcm91cEZpZWxkcyhtYXN0ZXJLZXlCdWZmZXIpO1xuXG4gIGNvbnN0IGdyb3VwSWQgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMuaWQpO1xuICBjb25zdCBsb2dJZCA9IGlkRm9yTG9nZ2luZyhncm91cElkKTtcbiAgbG9nLmluZm8oXG4gICAgYGpvaW5Hcm91cFYyVmlhTGlua0FuZE1pZ3JhdGUvJHtsb2dJZH06IE1pZ3JhdGluZyBmcm9tICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgKTtcblxuICBjb25zdCBtYXN0ZXJLZXkgPSBCeXRlcy50b0Jhc2U2NChtYXN0ZXJLZXlCdWZmZXIpO1xuICBjb25zdCBzZWNyZXRQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMuc2VjcmV0UGFyYW1zKTtcbiAgY29uc3QgcHVibGljUGFyYW1zID0gQnl0ZXMudG9CYXNlNjQoZmllbGRzLnB1YmxpY1BhcmFtcyk7XG5cbiAgLy8gQSBtaW5pLW1pZ3JhdGlvbiwgd2hpY2ggd2lsbCBub3Qgc2hvdyBkcm9wcGVkL2ludml0ZWQgbWVtYmVyc1xuICBjb25zdCBuZXdBdHRyaWJ1dGVzID0ge1xuICAgIC4uLmNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLFxuXG4gICAgLy8gQ29yZSBHcm91cFYyIGluZm9cbiAgICByZXZpc2lvbixcbiAgICBncm91cElkLFxuICAgIGdyb3VwVmVyc2lvbjogMixcbiAgICBtYXN0ZXJLZXksXG4gICAgcHVibGljUGFyYW1zLFxuICAgIHNlY3JldFBhcmFtcyxcbiAgICBncm91cEludml0ZUxpbmtQYXNzd29yZDogaW52aXRlTGlua1Bhc3N3b3JkLFxuXG4gICAgYWRkZWRCeTogdW5kZWZpbmVkLFxuICAgIGxlZnQ6IHRydWUsXG5cbiAgICAvLyBDYXB0dXJlIHByZXZpb3VzIEdyb3VwVjEgZGF0YSBmb3IgZnV0dXJlIHVzZVxuICAgIHByZXZpb3VzR3JvdXBWMUlkOiBjb252ZXJzYXRpb24uZ2V0KCdncm91cElkJyksXG4gICAgcHJldmlvdXNHcm91cFYxTWVtYmVyczogY29udmVyc2F0aW9uLmdldCgnbWVtYmVycycpLFxuXG4gICAgLy8gQ2xlYXIgc3RvcmFnZSBJRCwgc2luY2Ugd2UgbmVlZCB0byBzdGFydCBvdmVyIG9uIHRoZSBzdG9yYWdlIHNlcnZpY2VcbiAgICBzdG9yYWdlSUQ6IHVuZGVmaW5lZCxcblxuICAgIC8vIENsZWFyIG9ic29sZXRlIGRhdGFcbiAgICBkZXJpdmVkR3JvdXBWMklkOiB1bmRlZmluZWQsXG4gICAgbWVtYmVyczogdW5kZWZpbmVkLFxuICB9O1xuICBjb25zdCBncm91cENoYW5nZU1lc3NhZ2VzOiBBcnJheTxHcm91cENoYW5nZU1lc3NhZ2VUeXBlPiA9IFtcbiAgICB7XG4gICAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgICAgdHlwZTogJ2dyb3VwLXYxLW1pZ3JhdGlvbicsXG4gICAgICBncm91cE1pZ3JhdGlvbjoge1xuICAgICAgICBhcmVXZUludml0ZWQ6IGZhbHNlLFxuICAgICAgICBpbnZpdGVkTWVtYmVyczogW10sXG4gICAgICAgIGRyb3BwZWRNZW1iZXJJZHM6IFtdLFxuICAgICAgfSxcbiAgICB9LFxuICBdO1xuICBhd2FpdCB1cGRhdGVHcm91cCh7XG4gICAgY29udmVyc2F0aW9uLFxuICAgIHVwZGF0ZXM6IHtcbiAgICAgIG5ld0F0dHJpYnV0ZXMsXG4gICAgICBncm91cENoYW5nZU1lc3NhZ2VzLFxuICAgICAgbWVtYmVyczogW10sXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gTm93IHRoaW5ncyBhcmUgc2V0IHVwLCBzbyB3ZSBjYW4gZ28gdGhyb3VnaCBub3JtYWwgY2hhbm5lbHNcbiAgYXdhaXQgY29udmVyc2F0aW9uLmpvaW5Hcm91cFYyVmlhTGluayh7XG4gICAgaW52aXRlTGlua1Bhc3N3b3JkLFxuICAgIGFwcHJvdmFsUmVxdWlyZWQsXG4gIH0pO1xufVxuXG4vLyBUaGlzIG1heSBiZSBjYWxsZWQgZnJvbSBzdG9yYWdlIHNlcnZpY2UsIGFuIG91dC1vZi1iYW5kIGNoZWNrLCBvciBhbiBpbmNvbWluZyBtZXNzYWdlLlxuLy8gICBJZiB0aGlzIGlzIGtpY2tlZCBvZmYgdmlhIGFuIGluY29taW5nIG1lc3NhZ2UsIHdlIHdhbnQgdG8gZG8gdGhlIHJpZ2h0IHRoaW5nIGFuZCBoaXRcbi8vICAgdGhlIGxvZyBlbmRwb2ludCAtIHRoZSBwYXJhbWV0ZXJzIGJleW9uZCBjb252ZXJzYXRpb24gYXJlIG5lZWRlZCBpbiB0aGF0IHNjZW5hcmlvLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24oe1xuICBjb252ZXJzYXRpb24sXG4gIGdyb3VwQ2hhbmdlLFxuICBuZXdSZXZpc2lvbixcbiAgcmVjZWl2ZWRBdCxcbiAgc2VudEF0LFxufTogTWlncmF0ZVByb3BzVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBFbnN1cmUgd2UgaGF2ZSB0aGUgY3JlZGVudGlhbHMgd2UgbmVlZCBiZWZvcmUgYXR0ZW1wdGluZyBHcm91cHNWMiBvcGVyYXRpb25zXG4gIGF3YWl0IG1heWJlRmV0Y2hOZXdDcmVkZW50aWFscygpO1xuXG4gIGNvbnN0IGlzR3JvdXBWMSA9IGdldElzR3JvdXBWMShjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gIGNvbnN0IHByZXZpb3VzR3JvdXBWMUlkID0gY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpO1xuXG4gIGlmICghaXNHcm91cFYxIHx8ICFwcmV2aW91c0dyb3VwVjFJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGByZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uOiBDb252ZXJzYXRpb24gaXMgbm90IEdyb3VwVjEhICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICApO1xuICB9XG5cbiAgY29uc3Qgb3VyQUNJID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpO1xuICBjb25zdCB3ZXJlV2VQcmV2aW91c2x5QU1lbWJlciA9IGNvbnZlcnNhdGlvbi5oYXNNZW1iZXIob3VyQUNJKTtcblxuICAvLyBEZXJpdmUgR3JvdXBWMiBmaWVsZHNcbiAgY29uc3QgZ3JvdXBWMUlkQnVmZmVyID0gQnl0ZXMuZnJvbUJpbmFyeShwcmV2aW91c0dyb3VwVjFJZCk7XG4gIGNvbnN0IG1hc3RlcktleUJ1ZmZlciA9IGRlcml2ZU1hc3RlcktleUZyb21Hcm91cFYxKGdyb3VwVjFJZEJ1ZmZlcik7XG4gIGNvbnN0IGZpZWxkcyA9IGRlcml2ZUdyb3VwRmllbGRzKG1hc3RlcktleUJ1ZmZlcik7XG5cbiAgY29uc3QgZ3JvdXBJZCA9IEJ5dGVzLnRvQmFzZTY0KGZpZWxkcy5pZCk7XG4gIGNvbnN0IGxvZ0lkID0gaWRGb3JMb2dnaW5nKGdyb3VwSWQpO1xuICBsb2cuaW5mbyhcbiAgICBgcmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbi8ke2xvZ0lkfTogTWlncmF0aW5nIGZyb20gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICApO1xuXG4gIGNvbnN0IG1hc3RlcktleSA9IEJ5dGVzLnRvQmFzZTY0KG1hc3RlcktleUJ1ZmZlcik7XG4gIGNvbnN0IHNlY3JldFBhcmFtcyA9IEJ5dGVzLnRvQmFzZTY0KGZpZWxkcy5zZWNyZXRQYXJhbXMpO1xuICBjb25zdCBwdWJsaWNQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChmaWVsZHMucHVibGljUGFyYW1zKTtcblxuICBjb25zdCBwcmV2aW91c0dyb3VwVjFNZW1iZXJzID0gY29udmVyc2F0aW9uLmdldCgnbWVtYmVycycpO1xuICBjb25zdCBwcmV2aW91c0dyb3VwVjFNZW1iZXJzSWRzID0gY29udmVyc2F0aW9uLmdldE1lbWJlcklkcygpO1xuXG4gIC8vIFNrZWxldG9uIG9mIHRoZSBuZXcgZ3JvdXAgc3RhdGUgLSBub3QgdXNlZnVsIHVudGlsIHdlIGFkZCB0aGUgZ3JvdXAncyBzZXJ2ZXIgc3RhdGVcbiAgY29uc3QgYXR0cmlidXRlcyA9IHtcbiAgICAuLi5jb252ZXJzYXRpb24uYXR0cmlidXRlcyxcblxuICAgIC8vIENvcmUgR3JvdXBWMiBpbmZvXG4gICAgcmV2aXNpb246IDAsXG4gICAgZ3JvdXBJZCxcbiAgICBncm91cFZlcnNpb246IDIsXG4gICAgbWFzdGVyS2V5LFxuICAgIHB1YmxpY1BhcmFtcyxcbiAgICBzZWNyZXRQYXJhbXMsXG5cbiAgICAvLyBDYXB0dXJlIHByZXZpb3VzIEdyb3VwVjEgZGF0YSBmb3IgZnV0dXJlIHVzZVxuICAgIHByZXZpb3VzR3JvdXBWMUlkLFxuICAgIHByZXZpb3VzR3JvdXBWMU1lbWJlcnMsXG5cbiAgICAvLyBDbGVhciBzdG9yYWdlIElELCBzaW5jZSB3ZSBuZWVkIHRvIHN0YXJ0IG92ZXIgb24gdGhlIHN0b3JhZ2Ugc2VydmljZVxuICAgIHN0b3JhZ2VJRDogdW5kZWZpbmVkLFxuXG4gICAgLy8gQ2xlYXIgb2Jzb2xldGUgZGF0YVxuICAgIGRlcml2ZWRHcm91cFYySWQ6IHVuZGVmaW5lZCxcbiAgICBtZW1iZXJzOiB1bmRlZmluZWQsXG4gIH07XG5cbiAgbGV0IGZpcnN0R3JvdXBTdGF0ZTogUHJvdG8uSUdyb3VwIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBHcm91cExvZ1Jlc3BvbnNlVHlwZSA9IGF3YWl0IG1ha2VSZXF1ZXN0V2l0aFRlbXBvcmFsUmV0cnkoe1xuICAgICAgbG9nSWQ6IGBnZXRHcm91cExvZy8ke2xvZ0lkfWAsXG4gICAgICBwdWJsaWNQYXJhbXMsXG4gICAgICBzZWNyZXRQYXJhbXMsXG4gICAgICByZXF1ZXN0OiAoc2VuZGVyLCBvcHRpb25zKSA9PlxuICAgICAgICBzZW5kZXIuZ2V0R3JvdXBMb2coXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhcnRWZXJzaW9uOiAwLFxuICAgICAgICAgICAgaW5jbHVkZUZpcnN0U3RhdGU6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlTGFzdFN0YXRlOiBmYWxzZSxcbiAgICAgICAgICAgIG1heFN1cHBvcnRlZENoYW5nZUVwb2NoOiBTVVBQT1JURURfQ0hBTkdFX0VQT0NILFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApLFxuICAgIH0pO1xuXG4gICAgLy8gQXR0ZW1wdCB0byBzdGFydCB3aXRoIHRoZSBmaXJzdCBncm91cCBzdGF0ZSwgb25seSBsYXRlciBwcm9jZXNzaW5nIGZ1dHVyZSB1cGRhdGVzXG4gICAgZmlyc3RHcm91cFN0YXRlID0gcmVzcG9uc2U/LmNoYW5nZXM/Lmdyb3VwQ2hhbmdlcz8uWzBdPy5ncm91cFN0YXRlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvci5jb2RlID09PSBHUk9VUF9BQ0NFU1NfREVOSUVEX0NPREUpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgcmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbi8ke2xvZ0lkfTogRmFpbGVkIHRvIGFjY2VzcyBsb2cgZW5kcG9pbnQ7IGZldGNoaW5nIGZ1bGwgZ3JvdXAgc3RhdGVgXG4gICAgICApO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmlyc3RHcm91cFN0YXRlID0gYXdhaXQgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeSh7XG4gICAgICAgICAgbG9nSWQ6IGBnZXRHcm91cC8ke2xvZ0lkfWAsXG4gICAgICAgICAgcHVibGljUGFyYW1zLFxuICAgICAgICAgIHNlY3JldFBhcmFtcyxcbiAgICAgICAgICByZXF1ZXN0OiAoc2VuZGVyLCBvcHRpb25zKSA9PiBzZW5kZXIuZ2V0R3JvdXAob3B0aW9ucyksXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoc2Vjb25kRXJyb3IpIHtcbiAgICAgICAgaWYgKHNlY29uZEVycm9yLmNvZGUgPT09IEdST1VQX0FDQ0VTU19ERU5JRURfQ09ERSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYHJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24vJHtsb2dJZH06IEZhaWxlZCB0byBhY2Nlc3Mgc3RhdGUgZW5kcG9pbnQ7IHVzZXIgaXMgbm8gbG9uZ2VyIHBhcnQgb2YgZ3JvdXBgXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICh3aW5kb3cuc3RvcmFnZS5ibG9ja2VkLmlzR3JvdXBCbG9ja2VkKHByZXZpb3VzR3JvdXBWMUlkKSkge1xuICAgICAgICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5hZGRCbG9ja2VkR3JvdXAoZ3JvdXBJZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHdlcmVXZVByZXZpb3VzbHlBTWVtYmVyKSB7XG4gICAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgICAgYHJlc3BvbmRUb0dyb3VwVjJNaWdyYXRpb24vJHtsb2dJZH06IFVwZ3JhZGluZyBncm91cCB3aXRoIG1pZ3JhdGlvbi9yZW1vdmVkIGV2ZW50c2BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBvdXJOdW1iZXIgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0TnVtYmVyKCk7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVHcm91cCh7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICAgICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgICAgICAgICAgc2VudEF0LFxuICAgICAgICAgICAgICB1cGRhdGVzOiB7XG4gICAgICAgICAgICAgICAgbmV3QXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSdyZSB1c2luZyBhdHRyaWJ1dGVzIGhlcmUsIHdlIHVwZ3JhZGUgdGhpcyB0byBhIHYyIGdyb3VwXG4gICAgICAgICAgICAgICAgICAuLi5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgYWRkZWRCeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgbGVmdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG1lbWJlcnM6IChjb252ZXJzYXRpb24uZ2V0KCdtZW1iZXJzJykgfHwgW10pLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9PiBpdGVtICE9PSBvdXJBQ0kudG9TdHJpbmcoKSAmJiBpdGVtICE9PSBvdXJOdW1iZXJcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmdldEJhc2ljTWlncmF0aW9uQnViYmxlKCksXG4gICAgICAgICAgICAgICAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgICAgICAgICAgICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5TZWVuLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZ2VuZXJhdGVCYXNpY01lc3NhZ2UoKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dyb3VwLXYyLWNoYW5nZScsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXItcmVtb3ZlJyBhcyBjb25zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogb3VyQUNJLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgICAgICAgICAgICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgbWVtYmVyczogW10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgIGByZXNwb25kVG9Hcm91cFYyTWlncmF0aW9uLyR7bG9nSWR9OiBVcGdyYWRpbmcgZ3JvdXAgd2l0aCBtaWdyYXRpb24gZXZlbnQ7IG5vIHJlbW92ZWQgZXZlbnRgXG4gICAgICAgICAgKTtcbiAgICAgICAgICBhd2FpdCB1cGRhdGVHcm91cCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgICAgICByZWNlaXZlZEF0LFxuICAgICAgICAgICAgc2VudEF0LFxuICAgICAgICAgICAgdXBkYXRlczoge1xuICAgICAgICAgICAgICBuZXdBdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgLi4uZ2V0QmFzaWNNaWdyYXRpb25CdWJibGUoKSxcbiAgICAgICAgICAgICAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgICAgICAgICAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuU2VlbixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBtZW1iZXJzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IHNlY29uZEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgaWYgKCFmaXJzdEdyb3VwU3RhdGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgcmVzcG9uZFRvR3JvdXBWMk1pZ3JhdGlvbi8ke2xvZ0lkfTogQ291bGRuJ3QgZ2V0IGEgZmlyc3QgZ3JvdXAgc3RhdGUhYFxuICAgICk7XG4gIH1cblxuICBjb25zdCBncm91cFN0YXRlID0gZGVjcnlwdEdyb3VwU3RhdGUoXG4gICAgZmlyc3RHcm91cFN0YXRlLFxuICAgIGF0dHJpYnV0ZXMuc2VjcmV0UGFyYW1zLFxuICAgIGxvZ0lkXG4gICk7XG4gIGNvbnN0IHsgbmV3QXR0cmlidXRlcywgbmV3UHJvZmlsZUtleXMgfSA9IGF3YWl0IGFwcGx5R3JvdXBTdGF0ZSh7XG4gICAgZ3JvdXA6IGF0dHJpYnV0ZXMsXG4gICAgZ3JvdXBTdGF0ZSxcbiAgfSk7XG5cbiAgLy8gR2VuZXJhdGUgbm90aWZpY2F0aW9ucyBpbnRvIHRoZSB0aW1lbGluZVxuICBjb25zdCBncm91cENoYW5nZU1lc3NhZ2VzOiBBcnJheTxHcm91cENoYW5nZU1lc3NhZ2VUeXBlPiA9IFtdO1xuXG4gIGdyb3VwQ2hhbmdlTWVzc2FnZXMucHVzaCh7XG4gICAgLi4uYnVpbGRNaWdyYXRpb25CdWJibGUocHJldmlvdXNHcm91cFYxTWVtYmVyc0lkcywgbmV3QXR0cmlidXRlcyksXG4gICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuU2VlbixcbiAgfSk7XG5cbiAgY29uc3QgYXJlV2VJbnZpdGVkID0gKG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMiB8fCBbXSkuc29tZShcbiAgICBpdGVtID0+IGl0ZW0udXVpZCA9PT0gb3VyQUNJLnRvU3RyaW5nKClcbiAgKTtcbiAgY29uc3QgYXJlV2VNZW1iZXIgPSAobmV3QXR0cmlidXRlcy5tZW1iZXJzVjIgfHwgW10pLnNvbWUoXG4gICAgaXRlbSA9PiBpdGVtLnV1aWQgPT09IG91ckFDSS50b1N0cmluZygpXG4gICk7XG4gIGlmICghYXJlV2VJbnZpdGVkICYmICFhcmVXZU1lbWJlcikge1xuICAgIC8vIEFkZCBhIG1lc3NhZ2UgdG8gdGhlIHRpbWVsaW5lIHNheWluZyB0aGUgdXNlciB3YXMgcmVtb3ZlZC4gVGhpcyBzaG91bGRuJ3QgaGFwcGVuLlxuICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXMucHVzaCh7XG4gICAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgICAgdHlwZTogJ2dyb3VwLXYyLWNoYW5nZScsXG4gICAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnbWVtYmVyLXJlbW92ZScgYXMgY29uc3QsXG4gICAgICAgICAgICB1dWlkOiBvdXJBQ0kudG9TdHJpbmcoKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuVW5zZWVuLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gVGhpcyBidWZmZXIgZW5zdXJlcyB0aGF0IGFsbCBtaWdyYXRpb24tcmVsYXRlZCBtZXNzYWdlcyBhcmUgc29ydGVkIGFib3ZlXG4gIC8vICAgYW55IGluaXRpYXRpbmcgbWVzc2FnZS4gV2UgbmVlZCB0byBkbyB0aGlzIGJlY2F1c2UgZ3JvdXBDaGFuZ2VNZXNzYWdlcyBhcmVcbiAgLy8gICBhbHJlYWR5IHNvcnRlZCB2aWEgdXBkYXRlcyB0byBzZW50QXQgaW5zaWRlIG9mIHVwZGF0ZUdyb3VwKCkuXG4gIGNvbnN0IFNPUlRfQlVGRkVSID0gMTAwMDtcbiAgYXdhaXQgdXBkYXRlR3JvdXAoe1xuICAgIGNvbnZlcnNhdGlvbixcbiAgICByZWNlaXZlZEF0LFxuICAgIHNlbnRBdDogc2VudEF0ID8gc2VudEF0IC0gU09SVF9CVUZGRVIgOiB1bmRlZmluZWQsXG4gICAgdXBkYXRlczoge1xuICAgICAgbmV3QXR0cmlidXRlcyxcbiAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXMsXG4gICAgICBtZW1iZXJzOiBwcm9maWxlS2V5c1RvTWVtYmVycyhuZXdQcm9maWxlS2V5cyksXG4gICAgfSxcbiAgfSk7XG5cbiAgaWYgKHdpbmRvdy5zdG9yYWdlLmJsb2NrZWQuaXNHcm91cEJsb2NrZWQocHJldmlvdXNHcm91cFYxSWQpKSB7XG4gICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5hZGRCbG9ja2VkR3JvdXAoZ3JvdXBJZCk7XG4gIH1cblxuICAvLyBTYXZlIHRoZXNlIG1vc3QgcmVjZW50IHVwZGF0ZXMgdG8gY29udmVyc2F0aW9uXG4gIHVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG5cbiAgLy8gRmluYWxseSwgY2hlY2sgZm9yIGFueSBjaGFuZ2VzIHRvIHRoZSBncm91cCBzaW5jZSBpdHMgaW5pdGlhbCBjcmVhdGlvbiB1c2luZyBub3JtYWxcbiAgLy8gICBncm91cCB1cGRhdGUgY29kZXBhdGhzLlxuICBhd2FpdCBtYXliZVVwZGF0ZUdyb3VwKHtcbiAgICBjb252ZXJzYXRpb24sXG4gICAgZ3JvdXBDaGFuZ2UsXG4gICAgbmV3UmV2aXNpb24sXG4gICAgcmVjZWl2ZWRBdCxcbiAgICBzZW50QXQsXG4gIH0pO1xufVxuXG4vLyBGZXRjaGluZyBhbmQgYXBwbHlpbmcgZ3JvdXAgY2hhbmdlc1xuXG50eXBlIE1heWJlVXBkYXRlUHJvcHNUeXBlID0gUmVhZG9ubHk8e1xuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsO1xuICBuZXdSZXZpc2lvbj86IG51bWJlcjtcbiAgcmVjZWl2ZWRBdD86IG51bWJlcjtcbiAgc2VudEF0PzogbnVtYmVyO1xuICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlPzogYm9vbGVhbjtcbiAgZm9yY2U/OiBib29sZWFuO1xuICBncm91cENoYW5nZT86IFdyYXBwZWRHcm91cENoYW5nZVR5cGU7XG59PjtcblxuY29uc3QgRklWRV9NSU5VVEVTID0gNSAqIGR1cmF0aW9ucy5NSU5VVEU7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0VGhlbk1heWJlVXBkYXRlR3JvdXAoXG4gIG9wdGlvbnM6IE1heWJlVXBkYXRlUHJvcHNUeXBlLFxuICB7IHZpYUZpcnN0U3RvcmFnZVN5bmMgPSBmYWxzZSB9ID0ge31cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGNvbnZlcnNhdGlvbiB9ID0gb3B0aW9ucztcblxuICBpZiAoY29udmVyc2F0aW9uLmlzQmxvY2tlZCgpKSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgd2FpdFRoZW5NYXliZVVwZGF0ZUdyb3VwOiBHcm91cCAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgYmxvY2tlZCwgcmV0dXJuaW5nIGVhcmx5YFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRmlyc3Qgd2FpdCB0byBwcm9jZXNzIGFsbCBpbmNvbWluZyBtZXNzYWdlcyBvbiB0aGUgd2Vic29ja2V0XG4gIGF3YWl0IHdpbmRvdy53YWl0Rm9yRW1wdHlFdmVudFF1ZXVlKCk7XG5cbiAgLy8gVGhlbiBtYWtlIHN1cmUgd2UgaGF2ZW4ndCBmZXRjaGVkIHRoaXMgZ3JvdXAgdG9vIHJlY2VudGx5XG4gIGNvbnN0IHsgbGFzdFN1Y2Nlc3NmdWxHcm91cEZldGNoID0gMCB9ID0gY29udmVyc2F0aW9uO1xuICBpZiAoXG4gICAgIW9wdGlvbnMuZm9yY2UgJiZcbiAgICBpc01vcmVSZWNlbnRUaGFuKGxhc3RTdWNjZXNzZnVsR3JvdXBGZXRjaCwgRklWRV9NSU5VVEVTKVxuICApIHtcbiAgICBjb25zdCB3YWl0VGltZSA9IGxhc3RTdWNjZXNzZnVsR3JvdXBGZXRjaCArIEZJVkVfTUlOVVRFUyAtIERhdGUubm93KCk7XG4gICAgbG9nLmluZm8oXG4gICAgICBgd2FpdFRoZW5NYXliZVVwZGF0ZUdyb3VwLyR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfTogZ3JvdXAgdXBkYXRlIGAgK1xuICAgICAgICBgd2FzIGZldGNoZWQgcmVjZW50bHksIHNraXBwaW5nIGZvciAke3dhaXRUaW1lfW1zYFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhlbiB3YWl0IHRvIHByb2Nlc3MgYWxsIG91dHN0YW5kaW5nIG1lc3NhZ2VzIGZvciB0aGlzIGNvbnZlcnNhdGlvblxuICBhd2FpdCBjb252ZXJzYXRpb24ucXVldWVKb2IoJ3dhaXRUaGVuTWF5YmVVcGRhdGVHcm91cCcsIGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQW5kIGZpbmFsbHkgdHJ5IHRvIHVwZGF0ZSB0aGUgZ3JvdXBcbiAgICAgIGF3YWl0IG1heWJlVXBkYXRlR3JvdXAob3B0aW9ucywgeyB2aWFGaXJzdFN0b3JhZ2VTeW5jIH0pO1xuXG4gICAgICBjb252ZXJzYXRpb24ubGFzdFN1Y2Nlc3NmdWxHcm91cEZldGNoID0gRGF0ZS5ub3coKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgd2FpdFRoZW5NYXliZVVwZGF0ZUdyb3VwLyR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfTogbWF5YmVVcGRhdGVHcm91cCBmYWlsdXJlOmAsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWF5YmVVcGRhdGVHcm91cChcbiAge1xuICAgIGNvbnZlcnNhdGlvbixcbiAgICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlLFxuICAgIGdyb3VwQ2hhbmdlLFxuICAgIG5ld1JldmlzaW9uLFxuICAgIHJlY2VpdmVkQXQsXG4gICAgc2VudEF0LFxuICB9OiBNYXliZVVwZGF0ZVByb3BzVHlwZSxcbiAgeyB2aWFGaXJzdFN0b3JhZ2VTeW5jID0gZmFsc2UgfSA9IHt9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCk7XG5cbiAgdHJ5IHtcbiAgICAvLyBFbnN1cmUgd2UgaGF2ZSB0aGUgY3JlZGVudGlhbHMgd2UgbmVlZCBiZWZvcmUgYXR0ZW1wdGluZyBHcm91cHNWMiBvcGVyYXRpb25zXG4gICAgYXdhaXQgbWF5YmVGZXRjaE5ld0NyZWRlbnRpYWxzKCk7XG5cbiAgICBjb25zdCB1cGRhdGVzID0gYXdhaXQgZ2V0R3JvdXBVcGRhdGVzKHtcbiAgICAgIGdyb3VwOiBjb252ZXJzYXRpb24uYXR0cmlidXRlcyxcbiAgICAgIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NDogd2luZG93LmdldFNlcnZlclB1YmxpY1BhcmFtcygpLFxuICAgICAgbmV3UmV2aXNpb24sXG4gICAgICBncm91cENoYW5nZSxcbiAgICAgIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UsXG4gICAgfSk7XG5cbiAgICBhd2FpdCB1cGRhdGVHcm91cChcbiAgICAgIHsgY29udmVyc2F0aW9uLCByZWNlaXZlZEF0LCBzZW50QXQsIHVwZGF0ZXMgfSxcbiAgICAgIHsgdmlhRmlyc3RTdG9yYWdlU3luYyB9XG4gICAgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgbWF5YmVVcGRhdGVHcm91cC8ke2xvZ0lkfTogRmFpbGVkIHRvIHVwZGF0ZSBncm91cDpgLFxuICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVHcm91cChcbiAge1xuICAgIGNvbnZlcnNhdGlvbixcbiAgICByZWNlaXZlZEF0LFxuICAgIHNlbnRBdCxcbiAgICB1cGRhdGVzLFxuICB9OiB7XG4gICAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbDtcbiAgICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICAgIHNlbnRBdD86IG51bWJlcjtcbiAgICB1cGRhdGVzOiBVcGRhdGVzUmVzdWx0VHlwZTtcbiAgfSxcbiAgeyB2aWFGaXJzdFN0b3JhZ2VTeW5jID0gZmFsc2UgfSA9IHt9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCk7XG5cbiAgY29uc3QgeyBuZXdBdHRyaWJ1dGVzLCBncm91cENoYW5nZU1lc3NhZ2VzLCBtZW1iZXJzIH0gPSB1cGRhdGVzO1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgY29uc3Qgb3VyUE5JID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoVVVJREtpbmQuUE5JKTtcblxuICBjb25zdCBzdGFydGluZ1JldmlzaW9uID0gY29udmVyc2F0aW9uLmdldCgncmV2aXNpb24nKTtcbiAgY29uc3QgZW5kaW5nUmV2aXNpb24gPSBuZXdBdHRyaWJ1dGVzLnJldmlzaW9uO1xuXG4gIGNvbnN0IHdhc01lbWJlck9yUGVuZGluZyA9XG4gICAgY29udmVyc2F0aW9uLmhhc01lbWJlcihvdXJBQ0kpIHx8XG4gICAgY29udmVyc2F0aW9uLmlzTWVtYmVyUGVuZGluZyhvdXJBQ0kpIHx8XG4gICAgKG91clBOSSAmJiBjb252ZXJzYXRpb24uaXNNZW1iZXJQZW5kaW5nKG91clBOSSkpO1xuICBjb25zdCBpc01lbWJlck9yUGVuZGluZyA9XG4gICAgIW5ld0F0dHJpYnV0ZXMubGVmdCB8fFxuICAgIG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMj8uc29tZShcbiAgICAgIGl0ZW0gPT5cbiAgICAgICAgaXRlbS51dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKSB8fCBpdGVtLnV1aWQgPT09IG91clBOST8udG9TdHJpbmcoKVxuICAgICk7XG4gIGNvbnN0IGlzTWVtYmVyT3JQZW5kaW5nT3JBd2FpdGluZ0FwcHJvdmFsID1cbiAgICBpc01lbWJlck9yUGVuZGluZyB8fFxuICAgIG5ld0F0dHJpYnV0ZXMucGVuZGluZ0FkbWluQXBwcm92YWxWMj8uc29tZShcbiAgICAgIGl0ZW0gPT4gaXRlbS51dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKVxuICAgICk7XG5cbiAgY29uc3QgaXNJbml0aWFsRGF0YUZldGNoID1cbiAgICAhaXNOdW1iZXIoc3RhcnRpbmdSZXZpc2lvbikgJiYgaXNOdW1iZXIoZW5kaW5nUmV2aXNpb24pO1xuXG4gIC8vIEVuc3VyZSB0aGF0IGFsbCBnZW5lcmF0ZWQgbWVzc2FnZXMgYXJlIG9yZGVyZWQgcHJvcGVybHkuXG4gIC8vIEJlZm9yZSB0aGUgcHJvdmlkZWQgdGltZXN0YW1wIHNvIHVwZGF0ZSBtZXNzYWdlcyBhcHBlYXIgYmVmb3JlIHRoZVxuICAvLyAgIGluaXRpYXRpbmcgbWVzc2FnZSwgb3IgYWZ0ZXIgbm93KCkuXG4gIGNvbnN0IGZpbmFsUmVjZWl2ZWRBdCA9XG4gICAgcmVjZWl2ZWRBdCB8fCB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKTtcbiAgY29uc3QgaW5pdGlhbFNlbnRBdCA9IHNlbnRBdCB8fCBEYXRlLm5vdygpO1xuXG4gIC8vIEdyb3VwVjEgLT4gR3JvdXBWMiBtaWdyYXRpb24gY2hhbmdlcyB0aGUgZ3JvdXBJZCwgYW5kIHdlIG5lZWQgdG8gdXBkYXRlIG91ciBpZC1iYXNlZFxuICAvLyAgIGxvb2t1cHMgaWYgdGhlcmUncyBhIGNoYW5nZSBvbiB0aGF0IGZpZWxkLlxuICBjb25zdCBwcmV2aW91c0lkID0gY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpO1xuICBjb25zdCBpZENoYW5nZWQgPSBwcmV2aW91c0lkICYmIHByZXZpb3VzSWQgIT09IG5ld0F0dHJpYnV0ZXMuZ3JvdXBJZDtcblxuICAvLyBCeSB1cGRhdGluZyBhY3RpdmVBdCB3ZSBmb3JjZSB0aGlzIGNvbnZlcnNhdGlvbiBpbnRvIHRoZSBsZWZ0IHBhbmUgaWYgdGhpcyBpcyB0aGVcbiAgLy8gICBmaXJzdCB0aW1lIHdlJ3ZlIGZldGNoZWQgZGF0YSBhYm91dCBpdCwgYW5kIHdlIHdlcmUgYWJsZSB0byBmZXRjaCBpdHMgbmFtZS4gTm9ib2R5XG4gIC8vICAgbGlrZXMgdG8gc2VlIFVua25vd24gR3JvdXAgaW4gdGhlIGxlZnQgcGFuZS4gQWZ0ZXIgZmlyc3QgZmV0Y2gsIHdlIHJlbHkgb24gbm9ybWFsXG4gIC8vICAgbWVzc2FnZSBhY3Rpdml0eSAoaW5jbHVkaW5nIGdyb3VwIGNoYW5nZSBtZXNzc2FnZXMpIHRvIHNldCB0aGUgdGltZXN0YW1wIHByb3Blcmx5LlxuICBsZXQgYWN0aXZlQXQgPSBjb252ZXJzYXRpb24uZ2V0KCdhY3RpdmVfYXQnKSB8fCBudWxsO1xuICBpZiAoXG4gICAgIXZpYUZpcnN0U3RvcmFnZVN5bmMgJiZcbiAgICBpc01lbWJlck9yUGVuZGluZ09yQXdhaXRpbmdBcHByb3ZhbCAmJlxuICAgIGlzSW5pdGlhbERhdGFGZXRjaCAmJlxuICAgIG5ld0F0dHJpYnV0ZXMubmFtZVxuICApIHtcbiAgICBhY3RpdmVBdCA9IGluaXRpYWxTZW50QXQ7XG4gIH1cblxuICAvLyBTYXZlIGFsbCBzeW50aGV0aWMgbWVzc2FnZXMgZGVzY3JpYmluZyBncm91cCBjaGFuZ2VzXG4gIGxldCBzeW50aGV0aWNTZW50QXQgPSBpbml0aWFsU2VudEF0IC0gKGdyb3VwQ2hhbmdlTWVzc2FnZXMubGVuZ3RoICsgMSk7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gIGNvbnN0IGNoYW5nZU1lc3NhZ2VzVG9TYXZlID0gZ3JvdXBDaGFuZ2VNZXNzYWdlcy5tYXAoY2hhbmdlTWVzc2FnZSA9PiB7XG4gICAgLy8gV2UgZG8gdGhpcyB0byBwcmVzZXJ2ZSB0aGUgb3JkZXIgb2YgdGhlIHRpbWVsaW5lLiBXZSBvbmx5IHVwZGF0ZSBzZW50QXQgdG8gZW5zdXJlXG4gICAgLy8gICB0aGF0IHdlIGRvbid0IHN0b21wIG9uIG1lc3NhZ2VzIHJlY2VpdmVkIGFyb3VuZCB0aGUgc2FtZSB0aW1lIGFzIHRoZSBtZXNzYWdlXG4gICAgLy8gICB3aGljaCBpbml0aWF0ZWQgdGhpcyBncm91cCBmZXRjaCBhbmQgaW4tY29udmVyc2F0aW9uIG1lc3NhZ2VzLlxuICAgIHN5bnRoZXRpY1NlbnRBdCArPSAxO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNoYW5nZU1lc3NhZ2UsXG4gICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgcmVjZWl2ZWRfYXQ6IGZpbmFsUmVjZWl2ZWRBdCxcbiAgICAgIHJlY2VpdmVkX2F0X21zOiBzeW50aGV0aWNTZW50QXQsXG4gICAgICBzZW50X2F0OiBzeW50aGV0aWNTZW50QXQsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTtcbiAgfSk7XG5cbiAgY29uc3QgY29udGFjdHNXaXRob3V0UHJvZmlsZUtleSA9IG5ldyBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4oKTtcblxuICAvLyBDYXB0dXJlIHByb2ZpbGUga2V5IGZvciBlYWNoIG1lbWJlciBpbiB0aGUgZ3JvdXAsIGlmIHdlIGRvbid0IGhhdmUgaXQgeWV0XG4gIG1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgIGNvbnN0IGNvbnRhY3QgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShcbiAgICAgIG1lbWJlci51dWlkLFxuICAgICAgJ3ByaXZhdGUnXG4gICAgKTtcblxuICAgIGlmIChcbiAgICAgICFpc01lKGNvbnRhY3QuYXR0cmlidXRlcykgJiZcbiAgICAgIG1lbWJlci5wcm9maWxlS2V5ICYmXG4gICAgICBtZW1iZXIucHJvZmlsZUtleS5sZW5ndGggPiAwICYmXG4gICAgICBjb250YWN0LmdldCgncHJvZmlsZUtleScpICE9PSBtZW1iZXIucHJvZmlsZUtleVxuICAgICkge1xuICAgICAgY29udGFjdHNXaXRob3V0UHJvZmlsZUtleS5wdXNoKGNvbnRhY3QpO1xuICAgICAgY29udGFjdC5zZXRQcm9maWxlS2V5KG1lbWJlci5wcm9maWxlS2V5KTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCBwcm9maWxlRmV0Y2hlczogUHJvbWlzZTxBcnJheTx2b2lkPj4gfCB1bmRlZmluZWQ7XG4gIGlmIChjb250YWN0c1dpdGhvdXRQcm9maWxlS2V5Lmxlbmd0aCAhPT0gMCkge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYHVwZGF0ZUdyb3VwLyR7bG9nSWR9OiBmZXRjaGluZyBgICtcbiAgICAgICAgYCR7Y29udGFjdHNXaXRob3V0UHJvZmlsZUtleS5sZW5ndGh9IG1pc3NpbmcgcHJvZmlsZXNgXG4gICAgKTtcblxuICAgIHByb2ZpbGVGZXRjaGVzID0gUHJvbWlzZS5hbGwoXG4gICAgICBjb250YWN0c1dpdGhvdXRQcm9maWxlS2V5Lm1hcChjb250YWN0ID0+IGNvbnRhY3QuZ2V0UHJvZmlsZXMoKSlcbiAgICApO1xuICB9XG5cbiAgaWYgKGNoYW5nZU1lc3NhZ2VzVG9TYXZlLmxlbmd0aCA+IDApIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcHJvZmlsZUZldGNoZXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHVwZGF0ZUdyb3VwLyR7bG9nSWR9OiBmYWlsZWQgdG8gZmV0Y2ggbWlzc2luZyBwcm9maWxlc2AsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZENoYW5nZU1lc3NhZ2VzKGNvbnZlcnNhdGlvbiwgY2hhbmdlTWVzc2FnZXNUb1NhdmUpO1xuICB9XG5cbiAgLy8gV2UgdXBkYXRlIGdyb3VwIG1lbWJlcnNoaXAgbGFzdCB0byBlbnN1cmUgdGhhdCBhbGwgbm90aWZpY2F0aW9ucyBhcmUgaW4gcGxhY2UgYmVmb3JlXG4gIC8vICAgdGhlIGdyb3VwIHVwZGF0ZXMgaGFwcGVuIG9uIHRoZSBtb2RlbC5cblxuICBjb252ZXJzYXRpb24uc2V0KHtcbiAgICAuLi5uZXdBdHRyaWJ1dGVzLFxuICAgIGFjdGl2ZV9hdDogYWN0aXZlQXQsXG4gICAgdGVtcG9yYXJ5TWVtYmVyQ291bnQ6ICFuZXdBdHRyaWJ1dGVzLmxlZnRcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IG5ld0F0dHJpYnV0ZXMudGVtcG9yYXJ5TWVtYmVyQ291bnQsXG4gIH0pO1xuXG4gIGlmIChpZENoYW5nZWQpIHtcbiAgICBjb252ZXJzYXRpb24udHJpZ2dlcignaWRVcGRhdGVkJywgY29udmVyc2F0aW9uLCAnZ3JvdXBJZCcsIHByZXZpb3VzSWQpO1xuICB9XG5cbiAgLy8gU2F2ZSB0aGVzZSBtb3N0IHJlY2VudCB1cGRhdGVzIHRvIGNvbnZlcnNhdGlvblxuICBhd2FpdCB1cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuXG4gIC8vIElmIHdlJ3ZlIGJlZW4gYWRkZWQgYnkgYSBibG9ja2VkIGNvbnRhY3QsIHRoZW4gc2NoZWR1bGUgYSB0YXNrIHRvIGxlYXZlIGdyb3VwXG4gIGNvbnN0IGp1c3RBZGRlZCA9ICF3YXNNZW1iZXJPclBlbmRpbmcgJiYgaXNNZW1iZXJPclBlbmRpbmc7XG4gIGNvbnN0IGFkZGVkQnkgPVxuICAgIG5ld0F0dHJpYnV0ZXMucGVuZGluZ01lbWJlcnNWMj8uZmluZChcbiAgICAgIGl0ZW0gPT5cbiAgICAgICAgaXRlbS51dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKSB8fCBpdGVtLnV1aWQgPT09IG91clBOST8udG9TdHJpbmcoKVxuICAgICk/LmFkZGVkQnlVc2VySWQgfHwgbmV3QXR0cmlidXRlcy5hZGRlZEJ5O1xuXG4gIGlmIChqdXN0QWRkZWQgJiYgYWRkZWRCeSkge1xuICAgIGNvbnN0IGFkZGVyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGFkZGVkQnkpO1xuXG4gICAgaWYgKGFkZGVyICYmIGFkZGVyLmlzQmxvY2tlZCgpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHVwZGF0ZUdyb3VwLyR7bG9nSWR9OiBBZGRlZCB0byBncm91cCBieSBibG9ja2VkIHVzZXIgJHthZGRlci5pZEZvckxvZ2dpbmcoKX0uIFNjaGVkdWxpbmcgZ3JvdXAgbGVhdmUuYFxuICAgICAgKTtcblxuICAgICAgLy8gV2FpdCBmb3IgZW1wdHkgcXVldWUgdG8gbWFrZSBpdCBtb3JlIGxpa2VseSB0aGUgZ3JvdXAgdXBkYXRlIHN1Y2NlZWRzXG4gICAgICBjb25zdCB3YWl0VGhlbkxlYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBsb2cud2Fybihgd2FpdFRoZW5MZWF2ZS8ke2xvZ0lkfTogV2FpdGluZyBmb3IgZW1wdHkgZXZlbnQgcXVldWUuYCk7XG4gICAgICAgIGF3YWl0IHdpbmRvdy53YWl0Rm9yRW1wdHlFdmVudFF1ZXVlKCk7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGB3YWl0VGhlbkxlYXZlLyR7bG9nSWR9OiBFbXB0eSBldmVudCBxdWV1ZSwgc3RhcnRpbmcgZ3JvdXAgbGVhdmUuYFxuICAgICAgICApO1xuXG4gICAgICAgIGF3YWl0IGNvbnZlcnNhdGlvbi5sZWF2ZUdyb3VwVjIoKTtcbiAgICAgICAgbG9nLndhcm4oYHdhaXRUaGVuTGVhdmUvJHtsb2dJZH06IExlYXZlIGNvbXBsZXRlLmApO1xuICAgICAgfTtcblxuICAgICAgLy8gQ2Fubm90IGF3YWl0IGhlcmUsIHdvdWxkIGluZmluaXRlbHkgYmxvY2sgcXVldWVcbiAgICAgIHdhaXRUaGVuTGVhdmUoKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gRXhwb3J0ZWQgZm9yIHRlc3RpbmdcbmV4cG9ydCBmdW5jdGlvbiBfbWVyZ2VHcm91cENoYW5nZU1lc3NhZ2VzKFxuICBmaXJzdDogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIHwgdW5kZWZpbmVkLFxuICBzZWNvbmQ6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVxuKTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoZmlyc3QudHlwZSAhPT0gJ2dyb3VwLXYyLWNoYW5nZScgfHwgc2Vjb25kLnR5cGUgIT09IGZpcnN0LnR5cGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgeyBncm91cFYyQ2hhbmdlOiBmaXJzdENoYW5nZSB9ID0gZmlyc3Q7XG4gIGNvbnN0IHsgZ3JvdXBWMkNoYW5nZTogc2Vjb25kQ2hhbmdlIH0gPSBzZWNvbmQ7XG4gIGlmICghZmlyc3RDaGFuZ2UgfHwgIXNlY29uZENoYW5nZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoZmlyc3RDaGFuZ2UuZGV0YWlscy5sZW5ndGggIT09IDEgJiYgc2Vjb25kQ2hhbmdlLmRldGFpbHMubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IFtmaXJzdERldGFpbF0gPSBmaXJzdENoYW5nZS5kZXRhaWxzO1xuICBjb25zdCBbc2Vjb25kRGV0YWlsXSA9IHNlY29uZENoYW5nZS5kZXRhaWxzO1xuICBsZXQgaXNBcHByb3ZhbFBlbmRpbmc6IGJvb2xlYW47XG4gIGlmIChzZWNvbmREZXRhaWwudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnKSB7XG4gICAgaXNBcHByb3ZhbFBlbmRpbmcgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHNlY29uZERldGFpbC50eXBlID09PSAnYWRtaW4tYXBwcm92YWwtcmVtb3ZlLW9uZScpIHtcbiAgICBpc0FwcHJvdmFsUGVuZGluZyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB7IHV1aWQgfSA9IHNlY29uZERldGFpbDtcbiAgc3RyaWN0QXNzZXJ0KHV1aWQsICdhZG1pbiBhcHByb3ZhbCBtZXNzYWdlIHNob3VsZCBoYXZlIHV1aWQnKTtcblxuICBsZXQgdXBkYXRlZERldGFpbDtcbiAgLy8gTWVtYmVyIHdhcyBwcmV2aW91c2x5IGFkZGVkIGFuZCBpcyBub3cgcmVtb3ZlZFxuICBpZiAoXG4gICAgIWlzQXBwcm92YWxQZW5kaW5nICYmXG4gICAgZmlyc3REZXRhaWwudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnICYmXG4gICAgZmlyc3REZXRhaWwudXVpZCA9PT0gdXVpZFxuICApIHtcbiAgICB1cGRhdGVkRGV0YWlsID0ge1xuICAgICAgdHlwZTogJ2FkbWluLWFwcHJvdmFsLWJvdW5jZScgYXMgY29uc3QsXG4gICAgICB1dWlkLFxuICAgICAgdGltZXM6IDEsXG4gICAgICBpc0FwcHJvdmFsUGVuZGluZyxcbiAgICB9O1xuXG4gICAgLy8gVGhlcmUgaXMgYW4gZXhpc3RpbmcgYm91bmNlIGV2ZW50IC0gbWVyZ2UgdGhpcyBvbmUgaW50byBpdC5cbiAgfSBlbHNlIGlmIChcbiAgICBmaXJzdERldGFpbC50eXBlID09PSAnYWRtaW4tYXBwcm92YWwtYm91bmNlJyAmJlxuICAgIGZpcnN0RGV0YWlsLnV1aWQgPT09IHV1aWQgJiZcbiAgICBmaXJzdERldGFpbC5pc0FwcHJvdmFsUGVuZGluZyA9PT0gIWlzQXBwcm92YWxQZW5kaW5nXG4gICkge1xuICAgIHVwZGF0ZWREZXRhaWwgPSB7XG4gICAgICB0eXBlOiAnYWRtaW4tYXBwcm92YWwtYm91bmNlJyBhcyBjb25zdCxcbiAgICAgIHV1aWQsXG4gICAgICB0aW1lczogZmlyc3REZXRhaWwudGltZXMgKyAoaXNBcHByb3ZhbFBlbmRpbmcgPyAwIDogMSksXG4gICAgICBpc0FwcHJvdmFsUGVuZGluZyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLmZpcnN0LFxuICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgIC4uLmZpcnN0Lmdyb3VwVjJDaGFuZ2UsXG4gICAgICBkZXRhaWxzOiBbdXBkYXRlZERldGFpbF0sXG4gICAgfSxcbiAgfTtcbn1cblxuLy8gRXhwb3J0ZWQgZm9yIHRlc3RpbmdcbmV4cG9ydCBmdW5jdGlvbiBfaXNHcm91cENoYW5nZU1lc3NhZ2VCb3VuY2VhYmxlKFxuICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGVcbik6IGJvb2xlYW4ge1xuICBpZiAobWVzc2FnZS50eXBlICE9PSAnZ3JvdXAtdjItY2hhbmdlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHsgZ3JvdXBWMkNoYW5nZSB9ID0gbWVzc2FnZTtcbiAgaWYgKCFncm91cFYyQ2hhbmdlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGdyb3VwVjJDaGFuZ2UuZGV0YWlscy5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBbZmlyc3RdID0gZ3JvdXBWMkNoYW5nZS5kZXRhaWxzO1xuICBpZiAoXG4gICAgZmlyc3QudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnIHx8XG4gICAgZmlyc3QudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWJvdW5jZSdcbiAgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwcGVuZENoYW5nZU1lc3NhZ2VzKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsLFxuICBtZXNzYWdlczogUmVhZG9ubHlBcnJheTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCk7XG5cbiAgbG9nLmluZm8oXG4gICAgYGFwcGVuZENoYW5nZU1lc3NhZ2VzLyR7bG9nSWR9OiBwcm9jZXNzaW5nICR7bWVzc2FnZXMubGVuZ3RofSBtZXNzYWdlc2BcbiAgKTtcblxuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcblxuICBsZXQgbGFzdE1lc3NhZ2UgPSBhd2FpdCBkYXRhSW50ZXJmYWNlLmdldExhc3RDb252ZXJzYXRpb25NZXNzYWdlKHtcbiAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICB9KTtcblxuICBpZiAobGFzdE1lc3NhZ2UgJiYgIV9pc0dyb3VwQ2hhbmdlTWVzc2FnZUJvdW5jZWFibGUobGFzdE1lc3NhZ2UpKSB7XG4gICAgbGFzdE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBtZXJnZWRNZXNzYWdlcyA9IFtdO1xuICBsZXQgcHJldmlvdXNNZXNzYWdlID0gbGFzdE1lc3NhZ2U7XG4gIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgIGNvbnN0IG1lcmdlZCA9IF9tZXJnZUdyb3VwQ2hhbmdlTWVzc2FnZXMocHJldmlvdXNNZXNzYWdlLCBtZXNzYWdlKTtcbiAgICBpZiAoIW1lcmdlZCkge1xuICAgICAgaWYgKHByZXZpb3VzTWVzc2FnZSAmJiBwcmV2aW91c01lc3NhZ2UgIT09IGxhc3RNZXNzYWdlKSB7XG4gICAgICAgIG1lcmdlZE1lc3NhZ2VzLnB1c2gocHJldmlvdXNNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwcmV2aW91c01lc3NhZ2UgPSBtZXJnZWQ7XG4gICAgbG9nLmluZm8oXG4gICAgICBgYXBwZW5kQ2hhbmdlTWVzc2FnZXMvJHtsb2dJZH06IG1lcmdlZCAke21lc3NhZ2UuaWR9IGludG8gJHttZXJnZWQuaWR9YFxuICAgICk7XG4gIH1cblxuICBpZiAocHJldmlvdXNNZXNzYWdlICYmIHByZXZpb3VzTWVzc2FnZSAhPT0gbGFzdE1lc3NhZ2UpIHtcbiAgICBtZXJnZWRNZXNzYWdlcy5wdXNoKHByZXZpb3VzTWVzc2FnZSk7XG4gIH1cblxuICAvLyBVcGRhdGUgZXhpc3RpbmcgbWVzc2FnZVxuICBpZiAobGFzdE1lc3NhZ2UgJiYgbWVyZ2VkTWVzc2FnZXNbMF0/LmlkID09PSBsYXN0TWVzc2FnZT8uaWQpIHtcbiAgICBjb25zdCBbZmlyc3QsIC4uLnJlc3RdID0gbWVyZ2VkTWVzc2FnZXM7XG4gICAgc3RyaWN0QXNzZXJ0KGZpcnN0ICE9PSB1bmRlZmluZWQsICdGaXJzdCBtZXNzYWdlIG11c3QgYmUgdGhlcmUnKTtcblxuICAgIGxvZy5pbmZvKGBhcHBlbmRDaGFuZ2VNZXNzYWdlcy8ke2xvZ0lkfTogdXBkYXRpbmcgJHtmaXJzdC5pZH1gKTtcbiAgICBhd2FpdCBkYXRhSW50ZXJmYWNlLnNhdmVNZXNzYWdlKGZpcnN0LCB7XG4gICAgICBvdXJVdWlkOiBvdXJBQ0kudG9TdHJpbmcoKSxcblxuICAgICAgLy8gV2UgZG9uJ3QgdXNlIGZvcmNlU2F2ZSBoZXJlIGJlY2F1c2UgdGhpcyBpcyBhbiB1cGRhdGUgb2YgZXhpc3RpbmdcbiAgICAgIC8vIG1lc3NhZ2UuXG4gICAgfSk7XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBhcHBlbmRDaGFuZ2VNZXNzYWdlcy8ke2xvZ0lkfTogc2F2aW5nICR7cmVzdC5sZW5ndGh9IG5ldyBtZXNzYWdlc2BcbiAgICApO1xuICAgIGF3YWl0IGRhdGFJbnRlcmZhY2Uuc2F2ZU1lc3NhZ2VzKHJlc3QsIHtcbiAgICAgIG91clV1aWQ6IG91ckFDSS50b1N0cmluZygpLFxuICAgICAgZm9yY2VTYXZlOiB0cnVlLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGFwcGVuZENoYW5nZU1lc3NhZ2VzLyR7bG9nSWR9OiBzYXZpbmcgJHttZXJnZWRNZXNzYWdlcy5sZW5ndGh9IG5ldyBtZXNzYWdlc2BcbiAgICApO1xuICAgIGF3YWl0IGRhdGFJbnRlcmZhY2Uuc2F2ZU1lc3NhZ2VzKG1lcmdlZE1lc3NhZ2VzLCB7XG4gICAgICBvdXJVdWlkOiBvdXJBQ0kudG9TdHJpbmcoKSxcbiAgICAgIGZvcmNlU2F2ZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGxldCBuZXdNZXNzYWdlcyA9IDA7XG4gIGZvciAoY29uc3QgY2hhbmdlTWVzc2FnZSBvZiBtZXJnZWRNZXNzYWdlcykge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQoY2hhbmdlTWVzc2FnZS5pZCk7XG5cbiAgICAvLyBVcGRhdGUgZXhpc3RpbmcgbWVzc2FnZVxuICAgIGlmIChleGlzdGluZykge1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBjaGFuZ2VNZXNzYWdlLmlkID09PSBsYXN0TWVzc2FnZT8uaWQsXG4gICAgICAgICdTaG91bGQgb25seSB1cGRhdGUgZ3JvdXAgY2hhbmdlIHRoYXQgd2FzIGFscmVhZHkgaW4gdGhlIGRhdGFiYXNlJ1xuICAgICAgKTtcbiAgICAgIGV4aXN0aW5nLnNldChjaGFuZ2VNZXNzYWdlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsID0gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2UoY2hhbmdlTWVzc2FnZSk7XG4gICAgd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgY29udmVyc2F0aW9uLnRyaWdnZXIoJ25ld21lc3NhZ2UnLCBtb2RlbCk7XG4gICAgbmV3TWVzc2FnZXMgKz0gMTtcbiAgfVxuXG4gIC8vIFdlIHVwZGF0ZWQgdGhlIG1lc3NhZ2UsIGJ1dCBkaWRuJ3QgYWRkIG5ldyBvbmVzIC0gcmVmcmVzaCBsZWZ0IHBhbmVcbiAgaWYgKCFuZXdNZXNzYWdlcyAmJiBtZXJnZWRNZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uLnVwZGF0ZUxhc3RNZXNzYWdlKCk7XG4gICAgY29udmVyc2F0aW9uLnVwZGF0ZVVucmVhZCgpO1xuICB9XG59XG5cbnR5cGUgR2V0R3JvdXBVcGRhdGVzVHlwZSA9IFJlYWRvbmx5PHtcbiAgZHJvcEluaXRpYWxKb2luTWVzc2FnZT86IGJvb2xlYW47XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0OiBzdHJpbmc7XG4gIG5ld1JldmlzaW9uPzogbnVtYmVyO1xuICBncm91cENoYW5nZT86IFdyYXBwZWRHcm91cENoYW5nZVR5cGU7XG59PjtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0R3JvdXBVcGRhdGVzKHtcbiAgZHJvcEluaXRpYWxKb2luTWVzc2FnZSxcbiAgZ3JvdXAsXG4gIHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NCxcbiAgbmV3UmV2aXNpb24sXG4gIGdyb3VwQ2hhbmdlOiB3cmFwcGVkR3JvdXBDaGFuZ2UsXG59OiBHZXRHcm91cFVwZGF0ZXNUeXBlKTogUHJvbWlzZTxVcGRhdGVzUmVzdWx0VHlwZT4ge1xuICBjb25zdCBsb2dJZCA9IGlkRm9yTG9nZ2luZyhncm91cC5ncm91cElkKTtcblxuICBsb2cuaW5mbyhgZ2V0R3JvdXBVcGRhdGVzLyR7bG9nSWR9OiBTdGFydGluZy4uLmApO1xuXG4gIGNvbnN0IGN1cnJlbnRSZXZpc2lvbiA9IGdyb3VwLnJldmlzaW9uO1xuICBjb25zdCBpc0ZpcnN0RmV0Y2ggPSAhaXNOdW1iZXIoZ3JvdXAucmV2aXNpb24pO1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKFVVSURLaW5kLkFDSSk7XG5cbiAgY29uc3QgaXNJbml0aWFsQ3JlYXRpb25NZXNzYWdlID0gaXNGaXJzdEZldGNoICYmIG5ld1JldmlzaW9uID09PSAwO1xuICBjb25zdCB3ZUFyZUF3YWl0aW5nQXBwcm92YWwgPSAoZ3JvdXAucGVuZGluZ0FkbWluQXBwcm92YWxWMiB8fCBbXSkuZmluZChcbiAgICBpdGVtID0+IGl0ZW0udXVpZCA9PT0gb3VyQUNJLnRvU3RyaW5nKClcbiAgKTtcbiAgY29uc3QgaXNPbmVWZXJzaW9uVXAgPVxuICAgIGlzTnVtYmVyKGN1cnJlbnRSZXZpc2lvbikgJiZcbiAgICBpc051bWJlcihuZXdSZXZpc2lvbikgJiZcbiAgICBuZXdSZXZpc2lvbiA9PT0gY3VycmVudFJldmlzaW9uICsgMTtcblxuICBpZiAoXG4gICAgd2luZG93LkdWMl9FTkFCTEVfU0lOR0xFX0NIQU5HRV9QUk9DRVNTSU5HICYmXG4gICAgd3JhcHBlZEdyb3VwQ2hhbmdlICYmXG4gICAgaXNOdW1iZXIobmV3UmV2aXNpb24pICYmXG4gICAgKGlzSW5pdGlhbENyZWF0aW9uTWVzc2FnZSB8fCB3ZUFyZUF3YWl0aW5nQXBwcm92YWwgfHwgaXNPbmVWZXJzaW9uVXApXG4gICkge1xuICAgIGxvZy5pbmZvKGBnZXRHcm91cFVwZGF0ZXMvJHtsb2dJZH06IFByb2Nlc3NpbmcganVzdCBvbmUgY2hhbmdlYCk7XG5cbiAgICBjb25zdCBncm91cENoYW5nZUJ1ZmZlciA9IEJ5dGVzLmZyb21CYXNlNjQod3JhcHBlZEdyb3VwQ2hhbmdlLmJhc2U2NCk7XG4gICAgY29uc3QgZ3JvdXBDaGFuZ2UgPSBQcm90by5Hcm91cENoYW5nZS5kZWNvZGUoZ3JvdXBDaGFuZ2VCdWZmZXIpO1xuICAgIGNvbnN0IGlzQ2hhbmdlU3VwcG9ydGVkID1cbiAgICAgICFpc051bWJlcihncm91cENoYW5nZS5jaGFuZ2VFcG9jaCkgfHxcbiAgICAgIGdyb3VwQ2hhbmdlLmNoYW5nZUVwb2NoIDw9IFNVUFBPUlRFRF9DSEFOR0VfRVBPQ0g7XG5cbiAgICBpZiAoaXNDaGFuZ2VTdXBwb3J0ZWQpIHtcbiAgICAgIGlmICghd3JhcHBlZEdyb3VwQ2hhbmdlLmlzVHJ1c3RlZCkge1xuICAgICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgICAgZ3JvdXBDaGFuZ2Uuc2VydmVyU2lnbmF0dXJlICYmIGdyb3VwQ2hhbmdlLmFjdGlvbnMsXG4gICAgICAgICAgJ1NlcnZlciBzaWduYXR1cmUgbXVzdCBiZSBwcmVzZW50IGluIHVudHJ1c3RlZCBncm91cCBjaGFuZ2UnXG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmVyaWZ5Tm90YXJ5U2lnbmF0dXJlKFxuICAgICAgICAgICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0LFxuICAgICAgICAgICAgZ3JvdXBDaGFuZ2UuYWN0aW9ucyxcbiAgICAgICAgICAgIGdyb3VwQ2hhbmdlLnNlcnZlclNpZ25hdHVyZVxuICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgZ2V0R3JvdXBVcGRhdGVzLyR7bG9nSWR9OiB2ZXJpZnlOb3RhcnlTaWduYXR1cmUgZmFpbGVkLCBgICtcbiAgICAgICAgICAgICAgJ2Ryb3BwaW5nIHRoZSBtZXNzYWdlJyxcbiAgICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZXdBdHRyaWJ1dGVzOiBncm91cCxcbiAgICAgICAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXM6IFtdLFxuICAgICAgICAgICAgbWVtYmVyczogW10sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdXBkYXRlR3JvdXBWaWFTaW5nbGVDaGFuZ2Uoe1xuICAgICAgICBncm91cCxcbiAgICAgICAgbmV3UmV2aXNpb24sXG4gICAgICAgIGdyb3VwQ2hhbmdlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9nLmluZm8oXG4gICAgICBgZ2V0R3JvdXBVcGRhdGVzLyR7bG9nSWR9OiBGYWlsaW5nIG92ZXI7IGdyb3VwIGNoYW5nZSB1bnN1cHBvcnRlZGBcbiAgICApO1xuICB9XG5cbiAgaWYgKFxuICAgICghaXNGaXJzdEZldGNoIHx8IGlzTnVtYmVyKG5ld1JldmlzaW9uKSkgJiZcbiAgICB3aW5kb3cuR1YyX0VOQUJMRV9DSEFOR0VfUFJPQ0VTU0lOR1xuICApIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHVwZGF0ZUdyb3VwVmlhTG9ncyh7XG4gICAgICAgIGdyb3VwLFxuICAgICAgICBuZXdSZXZpc2lvbixcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBuZXh0U3RlcCA9IGlzRmlyc3RGZXRjaFxuICAgICAgICA/IGBmZXRjaGluZyBsb2dzIHNpbmNlICR7bmV3UmV2aXNpb259YFxuICAgICAgICA6ICdmZXRjaGluZyBmdWxsIHN0YXRlJztcblxuICAgICAgaWYgKGVycm9yLmNvZGUgPT09IFRFTVBPUkFMX0FVVEhfUkVKRUNURURfQ09ERSkge1xuICAgICAgICAvLyBXZSB3aWxsIGZhaWwgb3ZlciB0byB0aGUgdXBkYXRlR3JvdXBWaWFTdGF0ZSBjYWxsIGJlbG93XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBnZXRHcm91cFVwZGF0ZXMvJHtsb2dJZH06IFRlbXBvcmFsIGNyZWRlbnRpYWwgZmFpbHVyZSwgbm93ICR7bmV4dFN0ZXB9YFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSBHUk9VUF9BQ0NFU1NfREVOSUVEX0NPREUpIHtcbiAgICAgICAgLy8gV2Ugd2lsbCBmYWlsIG92ZXIgdG8gdGhlIHVwZGF0ZUdyb3VwVmlhU3RhdGUgY2FsbCBiZWxvd1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgZ2V0R3JvdXBVcGRhdGVzLyR7bG9nSWR9OiBMb2cgYWNjZXNzIGRlbmllZCwgbm93ICR7bmV4dFN0ZXB9YFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHdpbmRvdy5HVjJfRU5BQkxFX1NUQVRFX1BST0NFU1NJTkcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHVwZGF0ZUdyb3VwVmlhU3RhdGUoe1xuICAgICAgICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlLFxuICAgICAgICBncm91cCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gVEVNUE9SQUxfQVVUSF9SRUpFQ1RFRF9DT0RFKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBnZXRHcm91cFVwZGF0ZXMvJHtsb2dJZH06IFRlbXBvcmFsIGNyZWRlbnRpYWwgZmFpbHVyZS4gRmFpbGluZzsgd2UgZG9uJ3Qga25vdyBpZiB3ZSBoYXZlIGFjY2VzcyBvciBub3QuYFxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0gZWxzZSBpZiAoZXJyb3IuY29kZSA9PT0gR1JPVVBfQUNDRVNTX0RFTklFRF9DT0RFKSB7XG4gICAgICAgIC8vIFdlIHdpbGwgZmFpbCBvdmVyIHRvIHRoZSB1cGRhdGVHcm91cFZpYVByZUpvaW5JbmZvIGNhbGwgYmVsb3dcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYGdldEdyb3VwVXBkYXRlcy8ke2xvZ0lkfTogRmFpbGVkIHRvIGdldCBncm91cCBzdGF0ZS4gQXR0ZW1wdGluZyB0byBmZXRjaCBwcmUtam9pbiBpbmZvcm1hdGlvbi5gXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAod2luZG93LkdWMl9FTkFCTEVfUFJFX0pPSU5fRkVUQ0gpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHVwZGF0ZUdyb3VwVmlhUHJlSm9pbkluZm8oe1xuICAgICAgICBncm91cCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gR1JPVVBfQUNDRVNTX0RFTklFRF9DT0RFKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUxlZnRHcm91cENoYW5nZXMoZ3JvdXApO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yLmNvZGUgPT09IEdST1VQX05PTkVYSVNURU5UX0NPREUpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlTGVmdEdyb3VwQ2hhbmdlcyhncm91cCk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGdldCBhbm90aGVyIHRlbXBvcmFsIGZhaWx1cmUsIHdlJ2xsIGZhaWwgYW5kIHRyeSBhZ2FpbiBsYXRlci5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGxvZy53YXJuKFxuICAgIGBnZXRHcm91cFVwZGF0ZXMvJHtsb2dJZH06IE5vIHByb2Nlc3Npbmcgd2FzIGxlZ2FsISBSZXR1cm5pbmcgZW1wdHkgY2hhbmdlc2V0LmBcbiAgKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdBdHRyaWJ1dGVzOiBncm91cCxcbiAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBbXSxcbiAgICBtZW1iZXJzOiBbXSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlR3JvdXBWaWFQcmVKb2luSW5mbyh7XG4gIGdyb3VwLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG59KTogUHJvbWlzZTxVcGRhdGVzUmVzdWx0VHlwZT4ge1xuICBjb25zdCBsb2dJZCA9IGlkRm9yTG9nZ2luZyhncm91cC5ncm91cElkKTtcbiAgY29uc3Qgb3VyQUNJID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyXG4gICAgLmdldENoZWNrZWRVdWlkKFVVSURLaW5kLkFDSSlcbiAgICAudG9TdHJpbmcoKTtcblxuICBjb25zdCB7IHB1YmxpY1BhcmFtcywgc2VjcmV0UGFyYW1zIH0gPSBncm91cDtcbiAgaWYgKCFzZWNyZXRQYXJhbXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAndXBkYXRlR3JvdXBWaWFQcmVKb2luSW5mbzogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zISdcbiAgICApO1xuICB9XG4gIGlmICghcHVibGljUGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ3VwZGF0ZUdyb3VwVmlhUHJlSm9pbkluZm86IGdyb3VwIHdhcyBtaXNzaW5nIHB1YmxpY1BhcmFtcyEnXG4gICAgKTtcbiAgfVxuXG4gIC8vIE5vIHBhc3N3b3JkLCBidXQgaWYgd2UncmUgYWxyZWFkeSBwZW5kaW5nIGFwcHJvdmFsLCB3ZSBjYW4gYWNjZXNzIHRoaXMgd2l0aG91dCBpdC5cbiAgY29uc3QgaW52aXRlTGlua1Bhc3N3b3JkID0gdW5kZWZpbmVkO1xuICBjb25zdCBwcmVKb2luSW5mbyA9IGF3YWl0IG1ha2VSZXF1ZXN0V2l0aFRlbXBvcmFsUmV0cnkoe1xuICAgIGxvZ0lkOiBgZ2V0UHJlSm9pbkluZm8vJHtsb2dJZH1gLFxuICAgIHB1YmxpY1BhcmFtcyxcbiAgICBzZWNyZXRQYXJhbXMsXG4gICAgcmVxdWVzdDogKHNlbmRlciwgb3B0aW9ucykgPT5cbiAgICAgIHNlbmRlci5nZXRHcm91cEZyb21MaW5rKGludml0ZUxpbmtQYXNzd29yZCwgb3B0aW9ucyksXG4gIH0pO1xuXG4gIGNvbnN0IGFwcHJvdmFsUmVxdWlyZWQgPVxuICAgIHByZUpvaW5JbmZvLmFkZEZyb21JbnZpdGVMaW5rID09PVxuICAgIFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQuQURNSU5JU1RSQVRPUjtcblxuICAvLyBJZiB0aGUgZ3JvdXAgZG9lc24ndCByZXF1aXJlIGFwcHJvdmFsIHRvIGpvaW4gdmlhIGxpbmssIHRoZW4gd2Ugc2hvdWxkIG5ldmVyIGhhdmVcbiAgLy8gICBnb3R0ZW4gaGVyZS5cbiAgaWYgKCFhcHByb3ZhbFJlcXVpcmVkKSB7XG4gICAgcmV0dXJuIGdlbmVyYXRlTGVmdEdyb3VwQ2hhbmdlcyhncm91cCk7XG4gIH1cblxuICBjb25zdCBuZXdBdHRyaWJ1dGVzOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAuLi5ncm91cCxcbiAgICBkZXNjcmlwdGlvbjogZGVjcnlwdEdyb3VwRGVzY3JpcHRpb24oXG4gICAgICBwcmVKb2luSW5mby5kZXNjcmlwdGlvbkJ5dGVzLFxuICAgICAgc2VjcmV0UGFyYW1zXG4gICAgKSxcbiAgICBuYW1lOiBkZWNyeXB0R3JvdXBUaXRsZShwcmVKb2luSW5mby50aXRsZSwgc2VjcmV0UGFyYW1zKSxcbiAgICBtZW1iZXJzOiBbXSxcbiAgICBwZW5kaW5nTWVtYmVyc1YyOiBbXSxcbiAgICBwZW5kaW5nQWRtaW5BcHByb3ZhbFYyOiBbXG4gICAgICB7XG4gICAgICAgIHV1aWQ6IG91ckFDSSxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICBdLFxuICAgIHJldmlzaW9uOiBwcmVKb2luSW5mby52ZXJzaW9uLFxuXG4gICAgdGVtcG9yYXJ5TWVtYmVyQ291bnQ6IHByZUpvaW5JbmZvLm1lbWJlckNvdW50IHx8IDEsXG4gIH07XG5cbiAgYXdhaXQgYXBwbHlOZXdBdmF0YXIoZHJvcE51bGwocHJlSm9pbkluZm8uYXZhdGFyKSwgbmV3QXR0cmlidXRlcywgbG9nSWQpO1xuXG4gIHJldHVybiB7XG4gICAgbmV3QXR0cmlidXRlcyxcbiAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBleHRyYWN0RGlmZnMoe1xuICAgICAgb2xkOiBncm91cCxcbiAgICAgIGN1cnJlbnQ6IG5ld0F0dHJpYnV0ZXMsXG4gICAgICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlOiBmYWxzZSxcbiAgICB9KSxcbiAgICBtZW1iZXJzOiBbXSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlR3JvdXBWaWFTdGF0ZSh7XG4gIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UsXG4gIGdyb3VwLFxufToge1xuICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlPzogYm9vbGVhbjtcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xufSk6IFByb21pc2U8VXBkYXRlc1Jlc3VsdFR5cGU+IHtcbiAgY29uc3QgbG9nSWQgPSBpZEZvckxvZ2dpbmcoZ3JvdXAuZ3JvdXBJZCk7XG4gIGNvbnN0IHsgcHVibGljUGFyYW1zLCBzZWNyZXRQYXJhbXMgfSA9IGdyb3VwO1xuICBpZiAoIXNlY3JldFBhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcigndXBkYXRlR3JvdXBWaWFTdGF0ZTogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zIScpO1xuICB9XG4gIGlmICghcHVibGljUGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1cGRhdGVHcm91cFZpYVN0YXRlOiBncm91cCB3YXMgbWlzc2luZyBwdWJsaWNQYXJhbXMhJyk7XG4gIH1cblxuICBjb25zdCBncm91cFN0YXRlID0gYXdhaXQgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeSh7XG4gICAgbG9nSWQ6IGBnZXRHcm91cC8ke2xvZ0lkfWAsXG4gICAgcHVibGljUGFyYW1zLFxuICAgIHNlY3JldFBhcmFtcyxcbiAgICByZXF1ZXN0OiAoc2VuZGVyLCByZXF1ZXN0T3B0aW9ucykgPT4gc2VuZGVyLmdldEdyb3VwKHJlcXVlc3RPcHRpb25zKSxcbiAgfSk7XG5cbiAgY29uc3QgZGVjcnlwdGVkR3JvdXBTdGF0ZSA9IGRlY3J5cHRHcm91cFN0YXRlKFxuICAgIGdyb3VwU3RhdGUsXG4gICAgc2VjcmV0UGFyYW1zLFxuICAgIGxvZ0lkXG4gICk7XG5cbiAgY29uc3Qgb2xkVmVyc2lvbiA9IGdyb3VwLnJldmlzaW9uO1xuICBjb25zdCBuZXdWZXJzaW9uID0gZGVjcnlwdGVkR3JvdXBTdGF0ZS52ZXJzaW9uO1xuICBsb2cuaW5mbyhcbiAgICBgZ2V0Q3VycmVudEdyb3VwU3RhdGUvJHtsb2dJZH06IEFwcGx5aW5nIGZ1bGwgZ3JvdXAgc3RhdGUsIGZyb20gdmVyc2lvbiAke29sZFZlcnNpb259IHRvICR7bmV3VmVyc2lvbn0uYFxuICApO1xuICBjb25zdCB7IG5ld0F0dHJpYnV0ZXMsIG5ld1Byb2ZpbGVLZXlzIH0gPSBhd2FpdCBhcHBseUdyb3VwU3RhdGUoe1xuICAgIGdyb3VwLFxuICAgIGdyb3VwU3RhdGU6IGRlY3J5cHRlZEdyb3VwU3RhdGUsXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbmV3QXR0cmlidXRlcyxcbiAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBleHRyYWN0RGlmZnMoe1xuICAgICAgb2xkOiBncm91cCxcbiAgICAgIGN1cnJlbnQ6IG5ld0F0dHJpYnV0ZXMsXG4gICAgICBkcm9wSW5pdGlhbEpvaW5NZXNzYWdlLFxuICAgIH0pLFxuICAgIG1lbWJlcnM6IHByb2ZpbGVLZXlzVG9NZW1iZXJzKG5ld1Byb2ZpbGVLZXlzKSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlR3JvdXBWaWFTaW5nbGVDaGFuZ2Uoe1xuICBncm91cCxcbiAgZ3JvdXBDaGFuZ2UsXG4gIG5ld1JldmlzaW9uLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIGdyb3VwQ2hhbmdlOiBQcm90by5JR3JvdXBDaGFuZ2U7XG4gIG5ld1JldmlzaW9uOiBudW1iZXI7XG59KTogUHJvbWlzZTxVcGRhdGVzUmVzdWx0VHlwZT4ge1xuICBjb25zdCB3YXNJbkdyb3VwID0gIWdyb3VwLmxlZnQ7XG4gIGNvbnN0IHJlc3VsdDogVXBkYXRlc1Jlc3VsdFR5cGUgPSBhd2FpdCBpbnRlZ3JhdGVHcm91cENoYW5nZSh7XG4gICAgZ3JvdXAsXG4gICAgZ3JvdXBDaGFuZ2UsXG4gICAgbmV3UmV2aXNpb24sXG4gIH0pO1xuXG4gIGNvbnN0IG5vd0luR3JvdXAgPSAhcmVzdWx0Lm5ld0F0dHJpYnV0ZXMubGVmdDtcblxuICAvLyBJZiB3ZSB3ZXJlIGp1c3QgYWRkZWQgdG8gdGhlIGdyb3VwIChmb3IgZXhhbXBsZSwgdmlhIGEgam9pbiBsaW5rKSwgd2UgZ28gZmV0Y2ggdGhlXG4gIC8vICAgZW50aXJlIGdyb3VwIHN0YXRlIHRvIG1ha2Ugc3VyZSB3ZSdyZSB1cCB0byBkYXRlLlxuICBpZiAoIXdhc0luR3JvdXAgJiYgbm93SW5Hcm91cCkge1xuICAgIGNvbnN0IHsgbmV3QXR0cmlidXRlcywgbWVtYmVycyB9ID0gYXdhaXQgdXBkYXRlR3JvdXBWaWFTdGF0ZSh7XG4gICAgICBncm91cDogcmVzdWx0Lm5ld0F0dHJpYnV0ZXMsXG4gICAgfSk7XG5cbiAgICAvLyBXZSBkaXNjYXJkIGFueSBjaGFuZ2UgZXZlbnRzIHRoYXQgY29tZSBvdXQgb2YgdGhpcyBmdWxsIGdyb3VwIGZldGNoLCBidXQgd2UgZG9cbiAgICAvLyAgIGtlZXAgdGhlIGZpbmFsIGdyb3VwIGF0dHJpYnV0ZXMgZ2VuZXJhdGVkLCBhcyB3ZWxsIGFzIGFueSBuZXcgbWVtYmVycy5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzdWx0LFxuICAgICAgbWVtYmVyczogWy4uLnJlc3VsdC5tZW1iZXJzLCAuLi5tZW1iZXJzXSxcbiAgICAgIG5ld0F0dHJpYnV0ZXMsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUdyb3VwVmlhTG9ncyh7XG4gIGdyb3VwLFxuICBuZXdSZXZpc2lvbixcbn06IHtcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xuICBuZXdSZXZpc2lvbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xufSk6IFByb21pc2U8VXBkYXRlc1Jlc3VsdFR5cGU+IHtcbiAgY29uc3QgbG9nSWQgPSBpZEZvckxvZ2dpbmcoZ3JvdXAuZ3JvdXBJZCk7XG4gIGNvbnN0IHsgcHVibGljUGFyYW1zLCBzZWNyZXRQYXJhbXMgfSA9IGdyb3VwO1xuICBpZiAoIXB1YmxpY1BhcmFtcykge1xuICAgIHRocm93IG5ldyBFcnJvcigndXBkYXRlR3JvdXBWaWFMb2dzOiBncm91cCB3YXMgbWlzc2luZyBwdWJsaWNQYXJhbXMhJyk7XG4gIH1cbiAgaWYgKCFzZWNyZXRQYXJhbXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VwZGF0ZUdyb3VwVmlhTG9nczogZ3JvdXAgd2FzIG1pc3Npbmcgc2VjcmV0UGFyYW1zIScpO1xuICB9XG5cbiAgbG9nLmluZm8oXG4gICAgYHVwZGF0ZUdyb3VwVmlhTG9ncy8ke2xvZ0lkfTogR2V0dGluZyBncm91cCBkZWx0YSBmcm9tIGAgK1xuICAgICAgYCR7Z3JvdXAucmV2aXNpb24gPz8gJz8nfSB0byAke25ld1JldmlzaW9uID8/ICc/J30gZm9yIGdyb3VwIGAgK1xuICAgICAgYGdyb3VwdjIoJHtncm91cC5ncm91cElkfSkuLi5gXG4gICk7XG5cbiAgY29uc3QgY3VycmVudFJldmlzaW9uID0gZ3JvdXAucmV2aXNpb247XG4gIGxldCBpbmNsdWRlRmlyc3RTdGF0ZSA9IHRydWU7XG5cbiAgLy8gVGhlIHJhbmdlIGlzIGluY2x1c2l2ZSBzbyBtYWtlIHN1cmUgdGhhdCB3ZSBhbHdheXMgcmVxdWVzdCB0aGUgcmV2aXNpb25cbiAgLy8gdGhhdCB3ZSBhcmUgY3VycmVudGx5IGF0IHNpbmNlIHdlIG1pZ2h0IHdhbnQgdGhlIGxhdGVzdCBmdWxsIHN0YXRlIGluXG4gIC8vIGBpbnRlZ3JhdGVHcm91cENoYW5nZXNgLlxuICBsZXQgcmV2aXNpb25Ub0ZldGNoID0gaXNOdW1iZXIoY3VycmVudFJldmlzaW9uKSA/IGN1cnJlbnRSZXZpc2lvbiA6IHVuZGVmaW5lZDtcblxuICBsZXQgcmVzcG9uc2U7XG4gIGNvbnN0IGNoYW5nZXM6IEFycmF5PFByb3RvLklHcm91cENoYW5nZXM+ID0gW107XG4gIGRvIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgIHJlc3BvbnNlID0gYXdhaXQgbWFrZVJlcXVlc3RXaXRoVGVtcG9yYWxSZXRyeSh7XG4gICAgICBsb2dJZDogYGdldEdyb3VwTG9nLyR7bG9nSWR9YCxcbiAgICAgIHB1YmxpY1BhcmFtcyxcbiAgICAgIHNlY3JldFBhcmFtcyxcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgcmVxdWVzdDogKHNlbmRlciwgcmVxdWVzdE9wdGlvbnMpID0+XG4gICAgICAgIHNlbmRlci5nZXRHcm91cExvZyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFydFZlcnNpb246IHJldmlzaW9uVG9GZXRjaCxcbiAgICAgICAgICAgIGluY2x1ZGVGaXJzdFN0YXRlLFxuICAgICAgICAgICAgaW5jbHVkZUxhc3RTdGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1heFN1cHBvcnRlZENoYW5nZUVwb2NoOiBTVVBQT1JURURfQ0hBTkdFX0VQT0NILFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWVzdE9wdGlvbnNcbiAgICAgICAgKSxcbiAgICB9KTtcblxuICAgIGNoYW5nZXMucHVzaChyZXNwb25zZS5jaGFuZ2VzKTtcbiAgICBpZiAocmVzcG9uc2UuZW5kKSB7XG4gICAgICByZXZpc2lvblRvRmV0Y2ggPSByZXNwb25zZS5lbmQgKyAxO1xuICAgIH1cblxuICAgIGluY2x1ZGVGaXJzdFN0YXRlID0gZmFsc2U7XG4gIH0gd2hpbGUgKFxuICAgIHJlc3BvbnNlLmVuZCAmJlxuICAgIChuZXdSZXZpc2lvbiA9PT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlLmVuZCA8IG5ld1JldmlzaW9uKVxuICApO1xuXG4gIC8vIFdvdWxkIGJlIG5pY2UgdG8gY2FjaGUgdGhlIHVudXNlZCBncm91cENoYW5nZXMgaGVyZSwgdG8gcmVkdWNlIHNlcnZlciByb3VuZHRyaXBzXG5cbiAgcmV0dXJuIGludGVncmF0ZUdyb3VwQ2hhbmdlcyh7XG4gICAgY2hhbmdlcyxcbiAgICBncm91cCxcbiAgICBuZXdSZXZpc2lvbixcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlTGVmdEdyb3VwQ2hhbmdlcyhcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlXG4pOiBQcm9taXNlPFVwZGF0ZXNSZXN1bHRUeXBlPiB7XG4gIGNvbnN0IGxvZ0lkID0gaWRGb3JMb2dnaW5nKGdyb3VwLmdyb3VwSWQpO1xuICBsb2cuaW5mbyhgZ2VuZXJhdGVMZWZ0R3JvdXBDaGFuZ2VzLyR7bG9nSWR9OiBTdGFydGluZy4uLmApO1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKFVVSURLaW5kLkFDSSkudG9TdHJpbmcoKTtcbiAgY29uc3Qgb3VyUE5JID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5QTkkpPy50b1N0cmluZygpO1xuXG4gIGNvbnN0IHsgbWFzdGVyS2V5LCBncm91cEludml0ZUxpbmtQYXNzd29yZCB9ID0gZ3JvdXA7XG4gIGxldCB7IHJldmlzaW9uIH0gPSBncm91cDtcblxuICB0cnkge1xuICAgIGlmIChtYXN0ZXJLZXkgJiYgZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgZ2VuZXJhdGVMZWZ0R3JvdXBDaGFuZ2VzLyR7bG9nSWR9OiBIYXZlIGludml0ZSBsaW5rLiBBdHRlbXB0aW5nIHRvIGZldGNoIGxhdGVzdCByZXZpc2lvbiB3aXRoIGl0LmBcbiAgICAgICk7XG4gICAgICBjb25zdCBwcmVKb2luSW5mbyA9IGF3YWl0IGdldFByZUpvaW5Hcm91cEluZm8oXG4gICAgICAgIGdyb3VwSW52aXRlTGlua1Bhc3N3b3JkLFxuICAgICAgICBtYXN0ZXJLZXlcbiAgICAgICk7XG5cbiAgICAgIHJldmlzaW9uID0gcHJlSm9pbkluZm8udmVyc2lvbjtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICAnZ2VuZXJhdGVMZWZ0R3JvdXBDaGFuZ2VzOiBGYWlsZWQgdG8gZmV0Y2ggbGF0ZXN0IHJldmlzaW9uIHZpYSBncm91cCBsaW5rLiBDb2RlOicsXG4gICAgICBlcnJvci5jb2RlXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IG5ld0F0dHJpYnV0ZXM6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlID0ge1xuICAgIC4uLmdyb3VwLFxuICAgIGFkZGVkQnk6IHVuZGVmaW5lZCxcbiAgICBtZW1iZXJzVjI6IChncm91cC5tZW1iZXJzVjIgfHwgW10pLmZpbHRlcihtZW1iZXIgPT4gbWVtYmVyLnV1aWQgIT09IG91ckFDSSksXG4gICAgcGVuZGluZ01lbWJlcnNWMjogKGdyb3VwLnBlbmRpbmdNZW1iZXJzVjIgfHwgW10pLmZpbHRlcihcbiAgICAgIG1lbWJlciA9PiBtZW1iZXIudXVpZCAhPT0gb3VyQUNJICYmIG1lbWJlci51dWlkICE9PSBvdXJQTklcbiAgICApLFxuICAgIHBlbmRpbmdBZG1pbkFwcHJvdmFsVjI6IChncm91cC5wZW5kaW5nQWRtaW5BcHByb3ZhbFYyIHx8IFtdKS5maWx0ZXIoXG4gICAgICBtZW1iZXIgPT4gbWVtYmVyLnV1aWQgIT09IG91ckFDSVxuICAgICksXG4gICAgbGVmdDogdHJ1ZSxcbiAgICByZXZpc2lvbixcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5ld0F0dHJpYnV0ZXMsXG4gICAgZ3JvdXBDaGFuZ2VNZXNzYWdlczogZXh0cmFjdERpZmZzKHtcbiAgICAgIGN1cnJlbnQ6IG5ld0F0dHJpYnV0ZXMsXG4gICAgICBvbGQ6IGdyb3VwLFxuICAgIH0pLFxuICAgIG1lbWJlcnM6IFtdLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRHcm91cENyZWRlbnRpYWxzKHtcbiAgYXV0aENyZWRlbnRpYWxCYXNlNjQsXG4gIGdyb3VwUHVibGljUGFyYW1zQmFzZTY0LFxuICBncm91cFNlY3JldFBhcmFtc0Jhc2U2NCxcbiAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0LFxufToge1xuICBhdXRoQ3JlZGVudGlhbEJhc2U2NDogc3RyaW5nO1xuICBncm91cFB1YmxpY1BhcmFtc0Jhc2U2NDogc3RyaW5nO1xuICBncm91cFNlY3JldFBhcmFtc0Jhc2U2NDogc3RyaW5nO1xuICBzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQ6IHN0cmluZztcbn0pOiBHcm91cENyZWRlbnRpYWxzVHlwZSB7XG4gIGNvbnN0IGF1dGhPcGVyYXRpb25zID0gZ2V0Q2xpZW50WmtBdXRoT3BlcmF0aW9ucyhzZXJ2ZXJQdWJsaWNQYXJhbXNCYXNlNjQpO1xuXG4gIGNvbnN0IHByZXNlbnRhdGlvbiA9IGdldEF1dGhDcmVkZW50aWFsUHJlc2VudGF0aW9uKFxuICAgIGF1dGhPcGVyYXRpb25zLFxuICAgIGF1dGhDcmVkZW50aWFsQmFzZTY0LFxuICAgIGdyb3VwU2VjcmV0UGFyYW1zQmFzZTY0XG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBncm91cFB1YmxpY1BhcmFtc0hleDogQnl0ZXMudG9IZXgoXG4gICAgICBCeXRlcy5mcm9tQmFzZTY0KGdyb3VwUHVibGljUGFyYW1zQmFzZTY0KVxuICAgICksXG4gICAgYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXg6IEJ5dGVzLnRvSGV4KHByZXNlbnRhdGlvbiksXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGludGVncmF0ZUdyb3VwQ2hhbmdlcyh7XG4gIGdyb3VwLFxuICBuZXdSZXZpc2lvbixcbiAgY2hhbmdlcyxcbn06IHtcbiAgZ3JvdXA6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xuICBuZXdSZXZpc2lvbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBjaGFuZ2VzOiBBcnJheTxQcm90by5JR3JvdXBDaGFuZ2VzPjtcbn0pOiBQcm9taXNlPFVwZGF0ZXNSZXN1bHRUeXBlPiB7XG4gIGNvbnN0IGxvZ0lkID0gaWRGb3JMb2dnaW5nKGdyb3VwLmdyb3VwSWQpO1xuICBsZXQgYXR0cmlidXRlcyA9IGdyb3VwO1xuICBjb25zdCBmaW5hbE1lc3NhZ2VzOiBBcnJheTxBcnJheTxHcm91cENoYW5nZU1lc3NhZ2VUeXBlPj4gPSBbXTtcbiAgY29uc3QgZmluYWxNZW1iZXJzOiBBcnJheTxBcnJheTxNZW1iZXJUeXBlPj4gPSBbXTtcblxuICBjb25zdCBpbWF4ID0gY2hhbmdlcy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW1heDsgaSArPSAxKSB7XG4gICAgY29uc3QgeyBncm91cENoYW5nZXMgfSA9IGNoYW5nZXNbaV07XG5cbiAgICBpZiAoIWdyb3VwQ2hhbmdlcykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgam1heCA9IGdyb3VwQ2hhbmdlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBqbWF4OyBqICs9IDEpIHtcbiAgICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gZ3JvdXBDaGFuZ2VzW2pdO1xuXG4gICAgICBjb25zdCB7IGdyb3VwQ2hhbmdlLCBncm91cFN0YXRlIH0gPSBjaGFuZ2VTdGF0ZTtcblxuICAgICAgaWYgKCFncm91cENoYW5nZSAmJiAhZ3JvdXBTdGF0ZSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnaW50ZWdyYXRlR3JvdXBDaGFuZ2VzOiBpdGVtIGhhZCBuZWl0aGVyIGdyb3VwU3RhdGUgbm9yIGdyb3VwQ2hhbmdlLiBTa2lwcGluZy4nXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgbmV3QXR0cmlidXRlcyxcbiAgICAgICAgICBncm91cENoYW5nZU1lc3NhZ2VzLFxuICAgICAgICAgIG1lbWJlcnMsXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgfSA9IGF3YWl0IGludGVncmF0ZUdyb3VwQ2hhbmdlKHtcbiAgICAgICAgICBncm91cDogYXR0cmlidXRlcyxcbiAgICAgICAgICBuZXdSZXZpc2lvbixcbiAgICAgICAgICBncm91cENoYW5nZTogZHJvcE51bGwoZ3JvdXBDaGFuZ2UpLFxuICAgICAgICAgIGdyb3VwU3RhdGU6IGRyb3BOdWxsKGdyb3VwU3RhdGUpLFxuICAgICAgICB9KTtcblxuICAgICAgICBhdHRyaWJ1dGVzID0gbmV3QXR0cmlidXRlcztcbiAgICAgICAgZmluYWxNZXNzYWdlcy5wdXNoKGdyb3VwQ2hhbmdlTWVzc2FnZXMpO1xuICAgICAgICBmaW5hbE1lbWJlcnMucHVzaChtZW1iZXJzKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICBgaW50ZWdyYXRlR3JvdXBDaGFuZ2VzLyR7bG9nSWR9OiBGYWlsZWQgdG8gYXBwbHkgY2hhbmdlIGxvZywgY29udGludWluZyB0byBhcHBseSByZW1haW5pbmcgY2hhbmdlIGxvZ3MuYCxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBmZXRjaCwgd2Ugd2lsbCBjb2xsYXBzZSB0aGlzIGRvd24gdG8gb25lIHNldCBvZiBtZXNzYWdlc1xuICBjb25zdCBpc0ZpcnN0RmV0Y2ggPSAhaXNOdW1iZXIoZ3JvdXAucmV2aXNpb24pO1xuICBpZiAoaXNGaXJzdEZldGNoKSB7XG4gICAgLy8gVGhlIGZpcnN0IGFycmF5IGluIGZpbmFsTWVzc2FnZXMgaXMgZnJvbSB0aGUgZmlyc3QgcmV2aXNpb24gd2UgY291bGQgcHJvY2Vzcy4gSXRcbiAgICAvLyAgIHNob3VsZCBjb250YWluIGEgbWVzc2FnZSBhYm91dCBob3cgd2Ugam9pbmVkIHRoZSBncm91cC5cbiAgICBjb25zdCBqb2luTWVzc2FnZXMgPSBmaW5hbE1lc3NhZ2VzWzBdO1xuICAgIGNvbnN0IGFscmVhZHlIYXZlSm9pbk1lc3NhZ2UgPSBqb2luTWVzc2FnZXMgJiYgam9pbk1lc3NhZ2VzLmxlbmd0aCA+IDA7XG5cbiAgICAvLyBUaGVyZSBoYXZlIGJlZW4gb3RoZXIgY2hhbmdlcyBzaW5jZSB0aGF0IGZpcnN0IHJldmlzaW9uLCBzbyB3ZSBnZW5lcmF0ZSBkaWZmcyBmb3JcbiAgICAvLyAgIHRoZSB3aG9sZSBvZiB0aGUgY2hhbmdlIHNpbmNlIHRoZW4sIGxpa2VseSB3aXRob3V0IHRoZSBpbml0aWFsIGpvaW4gbWVzc2FnZS5cbiAgICBjb25zdCBvdGhlck1lc3NhZ2VzID0gZXh0cmFjdERpZmZzKHtcbiAgICAgIG9sZDogZ3JvdXAsXG4gICAgICBjdXJyZW50OiBhdHRyaWJ1dGVzLFxuICAgICAgZHJvcEluaXRpYWxKb2luTWVzc2FnZTogYWxyZWFkeUhhdmVKb2luTWVzc2FnZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwQ2hhbmdlTWVzc2FnZXMgPSBhbHJlYWR5SGF2ZUpvaW5NZXNzYWdlXG4gICAgICA/IFtqb2luTWVzc2FnZXNbMF0sIC4uLm90aGVyTWVzc2FnZXNdXG4gICAgICA6IG90aGVyTWVzc2FnZXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV3QXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXMsXG4gICAgICBtZW1iZXJzOiBmbGF0dGVuKGZpbmFsTWVtYmVycyksXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmV3QXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBmbGF0dGVuKGZpbmFsTWVzc2FnZXMpLFxuICAgIG1lbWJlcnM6IGZsYXR0ZW4oZmluYWxNZW1iZXJzKSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW50ZWdyYXRlR3JvdXBDaGFuZ2Uoe1xuICBncm91cCxcbiAgZ3JvdXBDaGFuZ2UsXG4gIGdyb3VwU3RhdGUsXG4gIG5ld1JldmlzaW9uLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIGdyb3VwQ2hhbmdlPzogUHJvdG8uSUdyb3VwQ2hhbmdlO1xuICBncm91cFN0YXRlPzogUHJvdG8uSUdyb3VwO1xuICBuZXdSZXZpc2lvbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xufSk6IFByb21pc2U8VXBkYXRlc1Jlc3VsdFR5cGU+IHtcbiAgY29uc3QgbG9nSWQgPSBpZEZvckxvZ2dpbmcoZ3JvdXAuZ3JvdXBJZCk7XG4gIGlmICghZ3JvdXAuc2VjcmV0UGFyYW1zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBHcm91cCB3YXMgbWlzc2luZyBzZWNyZXRQYXJhbXMhYFxuICAgICk7XG4gIH1cblxuICBpZiAoIWdyb3VwQ2hhbmdlICYmICFncm91cFN0YXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBOZWl0aGVyIGdyb3VwQ2hhbmdlIG5vciBncm91cFN0YXRlIHJlY2VpdmVkIWBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgaXNGaXJzdEZldGNoID0gIWlzTnVtYmVyKGdyb3VwLnJldmlzaW9uKTtcbiAgY29uc3Qgb3VyQUNJID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpO1xuICBjb25zdCBvdXJQTkkgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldFV1aWQoVVVJREtpbmQuUE5JKTtcbiAgY29uc3Qgd2VBcmVBd2FpdGluZ0FwcHJvdmFsID0gKGdyb3VwLnBlbmRpbmdBZG1pbkFwcHJvdmFsVjIgfHwgW10pLmZpbmQoXG4gICAgaXRlbSA9PlxuICAgICAgaXRlbS51dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKSB8fFxuICAgICAgKG91clBOSSAmJiBpdGVtLnV1aWQgPT09IG91clBOSS50b1N0cmluZygpKVxuICApO1xuXG4gIC8vIFRoZXNlIG5lZWQgdG8gYmUgcG9wdWxhdGVkIGZyb20gdGhlIGdyb3VwQ2hhbmdlLiBCdXQgd2UgbWlnaHQgbm90IGdldCBvbmUhXG4gIGxldCBpc0NoYW5nZVN1cHBvcnRlZCA9IGZhbHNlO1xuICBsZXQgaXNTYW1lVmVyc2lvbiA9IGZhbHNlO1xuICBsZXQgaXNNb3JlVGhhbk9uZVZlcnNpb25VcCA9IGZhbHNlO1xuICBsZXQgZ3JvdXBDaGFuZ2VBY3Rpb25zOiB1bmRlZmluZWQgfCBQcm90by5Hcm91cENoYW5nZS5JQWN0aW9ucztcbiAgbGV0IGRlY3J5cHRlZENoYW5nZUFjdGlvbnM6IHVuZGVmaW5lZCB8IERlY3J5cHRlZEdyb3VwQ2hhbmdlQWN0aW9ucztcbiAgbGV0IHNvdXJjZVV1aWQ6IHVuZGVmaW5lZCB8IFVVSURTdHJpbmdUeXBlO1xuXG4gIGlmIChncm91cENoYW5nZSkge1xuICAgIGdyb3VwQ2hhbmdlQWN0aW9ucyA9IFByb3RvLkdyb3VwQ2hhbmdlLkFjdGlvbnMuZGVjb2RlKFxuICAgICAgZ3JvdXBDaGFuZ2UuYWN0aW9ucyB8fCBuZXcgVWludDhBcnJheSgwKVxuICAgICk7XG5cbiAgICAvLyBWZXJzaW9uIGlzIGhpZ2hlciB0aGF0IHdoYXQgd2UgaGF2ZSBpbiB0aGUgaW5jb21pbmcgbWVzc2FnZVxuICAgIGlmIChcbiAgICAgIGdyb3VwQ2hhbmdlQWN0aW9ucy52ZXJzaW9uICYmXG4gICAgICBuZXdSZXZpc2lvbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBncm91cENoYW5nZUFjdGlvbnMudmVyc2lvbiA+IG5ld1JldmlzaW9uXG4gICAgKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBTa2lwcGluZyBgICtcbiAgICAgICAgICBgJHtncm91cENoYW5nZUFjdGlvbnMudmVyc2lvbn0sIG5ld1JldmlzaW9uIGlzICR7bmV3UmV2aXNpb259YFxuICAgICAgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld0F0dHJpYnV0ZXM6IGdyb3VwLFxuICAgICAgICBncm91cENoYW5nZU1lc3NhZ2VzOiBbXSxcbiAgICAgICAgbWVtYmVyczogW10sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGRlY3J5cHRlZENoYW5nZUFjdGlvbnMgPSBkZWNyeXB0R3JvdXBDaGFuZ2UoXG4gICAgICBncm91cENoYW5nZUFjdGlvbnMsXG4gICAgICBncm91cC5zZWNyZXRQYXJhbXMsXG4gICAgICBsb2dJZFxuICAgICk7XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBkZWNyeXB0ZWRDaGFuZ2VBY3Rpb25zICE9PSB1bmRlZmluZWQsXG4gICAgICAnU2hvdWxkIGhhdmUgZGVjcnlwdGVkIGdyb3VwIGFjdGlvbnMnXG4gICAgKTtcbiAgICAoeyBzb3VyY2VVdWlkIH0gPSBkZWNyeXB0ZWRDaGFuZ2VBY3Rpb25zKTtcbiAgICBzdHJpY3RBc3NlcnQoc291cmNlVXVpZCwgJ1Nob3VsZCBoYXZlIHNvdXJjZSBVVUlEJyk7XG5cbiAgICBpc0NoYW5nZVN1cHBvcnRlZCA9XG4gICAgICAhaXNOdW1iZXIoZ3JvdXBDaGFuZ2UuY2hhbmdlRXBvY2gpIHx8XG4gICAgICBncm91cENoYW5nZS5jaGFuZ2VFcG9jaCA8PSBTVVBQT1JURURfQ0hBTkdFX0VQT0NIO1xuXG4gICAgLy8gVmVyc2lvbiBpcyBsb3dlciBvciB0aGUgc2FtZSBhcyB3aGF0IHdlIGN1cnJlbnRseSBoYXZlXG4gICAgaWYgKGdyb3VwLnJldmlzaW9uICE9PSB1bmRlZmluZWQgJiYgZ3JvdXBDaGFuZ2VBY3Rpb25zLnZlcnNpb24pIHtcbiAgICAgIGlmIChncm91cENoYW5nZUFjdGlvbnMudmVyc2lvbiA8IGdyb3VwLnJldmlzaW9uKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBpbnRlZ3JhdGVHcm91cENoYW5nZS8ke2xvZ0lkfTogU2tpcHBpbmcgc3RhbGUgdmVyc2lvbmAgK1xuICAgICAgICAgICAgYCR7Z3JvdXBDaGFuZ2VBY3Rpb25zLnZlcnNpb259LCBjdXJyZW50IGAgK1xuICAgICAgICAgICAgYHJldmlzaW9uIGlzICR7Z3JvdXAucmV2aXNpb259YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5ld0F0dHJpYnV0ZXM6IGdyb3VwLFxuICAgICAgICAgIGdyb3VwQ2hhbmdlTWVzc2FnZXM6IFtdLFxuICAgICAgICAgIG1lbWJlcnM6IFtdLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGdyb3VwQ2hhbmdlQWN0aW9ucy52ZXJzaW9uID09PSBncm91cC5yZXZpc2lvbikge1xuICAgICAgICBpc1NhbWVWZXJzaW9uID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGdyb3VwQ2hhbmdlQWN0aW9ucy52ZXJzaW9uICE9PSBncm91cC5yZXZpc2lvbiArIDEgfHxcbiAgICAgICAgKCFpc051bWJlcihncm91cC5yZXZpc2lvbikgJiYgZ3JvdXBDaGFuZ2VBY3Rpb25zLnZlcnNpb24gPiAwKVxuICAgICAgKSB7XG4gICAgICAgIGlzTW9yZVRoYW5PbmVWZXJzaW9uVXAgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBhdHRyaWJ1dGVzID0gZ3JvdXA7XG4gIGNvbnN0IGFnZ3JlZ2F0ZWRDaGFuZ2VNZXNzYWdlcyA9IFtdO1xuICBjb25zdCBhZ2dyZWdhdGVkTWVtYmVycyA9IFtdO1xuXG4gIGNvbnN0IGNhbkFwcGx5Q2hhbmdlID1cbiAgICBncm91cENoYW5nZSAmJlxuICAgIGlzQ2hhbmdlU3VwcG9ydGVkICYmXG4gICAgIWlzU2FtZVZlcnNpb24gJiZcbiAgICAhaXNGaXJzdEZldGNoICYmXG4gICAgKCFpc01vcmVUaGFuT25lVmVyc2lvblVwIHx8IHdlQXJlQXdhaXRpbmdBcHByb3ZhbCk7XG5cbiAgLy8gQXBwbHkgdGhlIGNoYW5nZSBmaXJzdFxuICBpZiAoY2FuQXBwbHlDaGFuZ2UpIHtcbiAgICBpZiAoIXNvdXJjZVV1aWQgfHwgIWdyb3VwQ2hhbmdlQWN0aW9ucyB8fCAhZGVjcnlwdGVkQ2hhbmdlQWN0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgaW50ZWdyYXRlR3JvdXBDaGFuZ2UvJHtsb2dJZH06IE1pc3NpbmcgbmVjZXNzYXJ5IGluZm9ybWF0aW9uIHRoYXQgc2hvdWxkIGhhdmUgY29tZSBmcm9tIGdyb3VwIGFjdGlvbnNgXG4gICAgICApO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBcHBseWluZyBncm91cCBjaGFuZ2UgYWN0aW9ucywgYCArXG4gICAgICAgIGBmcm9tIHZlcnNpb24gJHtncm91cC5yZXZpc2lvbn0gdG8gJHtncm91cENoYW5nZUFjdGlvbnMudmVyc2lvbn1gXG4gICAgKTtcblxuICAgIGNvbnN0IHsgbmV3QXR0cmlidXRlcywgbmV3UHJvZmlsZUtleXMgfSA9IGF3YWl0IGFwcGx5R3JvdXBDaGFuZ2Uoe1xuICAgICAgZ3JvdXAsXG4gICAgICBhY3Rpb25zOiBkZWNyeXB0ZWRDaGFuZ2VBY3Rpb25zLFxuICAgICAgc291cmNlVXVpZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwQ2hhbmdlTWVzc2FnZXMgPSBleHRyYWN0RGlmZnMoe1xuICAgICAgb2xkOiBhdHRyaWJ1dGVzLFxuICAgICAgY3VycmVudDogbmV3QXR0cmlidXRlcyxcbiAgICAgIHNvdXJjZVV1aWQsXG4gICAgfSk7XG5cbiAgICBhdHRyaWJ1dGVzID0gbmV3QXR0cmlidXRlcztcbiAgICBhZ2dyZWdhdGVkQ2hhbmdlTWVzc2FnZXMucHVzaChncm91cENoYW5nZU1lc3NhZ2VzKTtcbiAgICBhZ2dyZWdhdGVkTWVtYmVycy5wdXNoKHByb2ZpbGVLZXlzVG9NZW1iZXJzKG5ld1Byb2ZpbGVLZXlzKSk7XG4gIH1cblxuICAvLyBBcHBseSB0aGUgZ3JvdXAgc3RhdGUgYWZ0ZXJ3YXJkcyB0byB2ZXJpZnkgdGhhdCB3ZSBkaWRuJ3QgbWlzcyBhbnl0aGluZ1xuICBpZiAoZ3JvdXBTdGF0ZSkge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBcHBseWluZyBmdWxsIGdyb3VwIHN0YXRlLCBgICtcbiAgICAgICAgYGZyb20gdmVyc2lvbiAke2dyb3VwLnJldmlzaW9ufSB0byAke2dyb3VwU3RhdGUudmVyc2lvbn1gLFxuICAgICAge1xuICAgICAgICBpc0NoYW5nZVByZXNlbnQ6IEJvb2xlYW4oZ3JvdXBDaGFuZ2UpLFxuICAgICAgICBpc0NoYW5nZVN1cHBvcnRlZCxcbiAgICAgICAgaXNGaXJzdEZldGNoLFxuICAgICAgICBpc1NhbWVWZXJzaW9uLFxuICAgICAgICBpc01vcmVUaGFuT25lVmVyc2lvblVwLFxuICAgICAgICB3ZUFyZUF3YWl0aW5nQXBwcm92YWwsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGRlY3J5cHRlZEdyb3VwU3RhdGUgPSBkZWNyeXB0R3JvdXBTdGF0ZShcbiAgICAgIGdyb3VwU3RhdGUsXG4gICAgICBncm91cC5zZWNyZXRQYXJhbXMsXG4gICAgICBsb2dJZFxuICAgICk7XG5cbiAgICBjb25zdCB7IG5ld0F0dHJpYnV0ZXMsIG5ld1Byb2ZpbGVLZXlzIH0gPSBhd2FpdCBhcHBseUdyb3VwU3RhdGUoe1xuICAgICAgZ3JvdXA6IGF0dHJpYnV0ZXMsXG4gICAgICBncm91cFN0YXRlOiBkZWNyeXB0ZWRHcm91cFN0YXRlLFxuICAgICAgc291cmNlVXVpZDogaXNGaXJzdEZldGNoID8gc291cmNlVXVpZCA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwQ2hhbmdlTWVzc2FnZXMgPSBleHRyYWN0RGlmZnMoe1xuICAgICAgb2xkOiBhdHRyaWJ1dGVzLFxuICAgICAgY3VycmVudDogbmV3QXR0cmlidXRlcyxcbiAgICAgIHNvdXJjZVV1aWQ6IGlzRmlyc3RGZXRjaCA/IHNvdXJjZVV1aWQgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBuZXdNZW1iZXJzID0gcHJvZmlsZUtleXNUb01lbWJlcnMobmV3UHJvZmlsZUtleXMpO1xuXG4gICAgaWYgKFxuICAgICAgY2FuQXBwbHlDaGFuZ2UgJiZcbiAgICAgIChncm91cENoYW5nZU1lc3NhZ2VzLmxlbmd0aCAhPT0gMCB8fCBuZXdNZW1iZXJzLmxlbmd0aCAhPT0gMClcbiAgICApIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgZ3JvdXBDaGFuZ2VNZXNzYWdlcy5sZW5ndGggPT09IDAsXG4gICAgICAgICdGYWxsYmFjayBncm91cCBzdGF0ZSBwcm9jZXNzaW5nIHNob3VsZCBub3Qga2ljayBpbidcbiAgICAgICk7XG5cbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgaW50ZWdyYXRlR3JvdXBDaGFuZ2UvJHtsb2dJZH06IGxvY2FsIHN0YXRlIHdhcyBkaWZmZXJlbnQgZnJvbSBgICtcbiAgICAgICAgICAndGhlIHJlbW90ZSBmaW5hbCBzdGF0ZS4gJyArXG4gICAgICAgICAgYEdvdCAke2dyb3VwQ2hhbmdlTWVzc2FnZXMubGVuZ3RofSBjaGFuZ2UgbWVzc2FnZXMsIGFuZCBgICtcbiAgICAgICAgICBgJHtuZXdNZW1iZXJzLmxlbmd0aH0gdXBkYXRlZCBtZW1iZXJzYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gbmV3QXR0cmlidXRlcztcbiAgICBhZ2dyZWdhdGVkQ2hhbmdlTWVzc2FnZXMucHVzaChncm91cENoYW5nZU1lc3NhZ2VzKTtcbiAgICBhZ2dyZWdhdGVkTWVtYmVycy5wdXNoKG5ld01lbWJlcnMpO1xuICB9IGVsc2Uge1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGNhbkFwcGx5Q2hhbmdlLFxuICAgICAgYGludGVncmF0ZUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBObyBncm91cCBzdGF0ZSwgYnV0IHdlIGNhbid0IGFwcGx5IGNoYW5nZXMhYFxuICAgICk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5ld0F0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgZ3JvdXBDaGFuZ2VNZXNzYWdlczogYWdncmVnYXRlZENoYW5nZU1lc3NhZ2VzLmZsYXQoKSxcbiAgICBtZW1iZXJzOiBhZ2dyZWdhdGVkTWVtYmVycy5mbGF0KCksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3REaWZmcyh7XG4gIGN1cnJlbnQsXG4gIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UsXG4gIG9sZCxcbiAgc291cmNlVXVpZCxcbn06IHtcbiAgY3VycmVudDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2U/OiBib29sZWFuO1xuICBvbGQ6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlO1xuICBzb3VyY2VVdWlkPzogVVVJRFN0cmluZ1R5cGU7XG59KTogQXJyYXk8R3JvdXBDaGFuZ2VNZXNzYWdlVHlwZT4ge1xuICBjb25zdCBsb2dJZCA9IGlkRm9yTG9nZ2luZyhvbGQuZ3JvdXBJZCk7XG4gIGNvbnN0IGRldGFpbHM6IEFycmF5PEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlPiA9IFtdO1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKFVVSURLaW5kLkFDSSk7XG4gIGNvbnN0IG91clBOSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuICBjb25zdCBBQ0NFU1NfRU5VTSA9IFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQ7XG5cbiAgbGV0IGFyZVdlSW5Hcm91cCA9IGZhbHNlO1xuICBsZXQgdXVpZEtpbmRJbnZpdGVkVG9Hcm91cDogVVVJREtpbmQgfCB1bmRlZmluZWQ7XG4gIGxldCBhcmVXZVBlbmRpbmdBcHByb3ZhbCA9IGZhbHNlO1xuICBsZXQgd2hvSW52aXRlZFVzVXNlcklkID0gbnVsbDtcblxuICAvLyBhY2Nlc3MgY29udHJvbFxuXG4gIGlmIChcbiAgICBjdXJyZW50LmFjY2Vzc0NvbnRyb2wgJiZcbiAgICBvbGQuYWNjZXNzQ29udHJvbCAmJlxuICAgIG9sZC5hY2Nlc3NDb250cm9sLmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCAmJlxuICAgIG9sZC5hY2Nlc3NDb250cm9sLmF0dHJpYnV0ZXMgIT09IGN1cnJlbnQuYWNjZXNzQ29udHJvbC5hdHRyaWJ1dGVzXG4gICkge1xuICAgIGRldGFpbHMucHVzaCh7XG4gICAgICB0eXBlOiAnYWNjZXNzLWF0dHJpYnV0ZXMnLFxuICAgICAgbmV3UHJpdmlsZWdlOiBjdXJyZW50LmFjY2Vzc0NvbnRyb2wuYXR0cmlidXRlcyxcbiAgICB9KTtcbiAgfVxuICBpZiAoXG4gICAgY3VycmVudC5hY2Nlc3NDb250cm9sICYmXG4gICAgb2xkLmFjY2Vzc0NvbnRyb2wgJiZcbiAgICBvbGQuYWNjZXNzQ29udHJvbC5tZW1iZXJzICE9PSB1bmRlZmluZWQgJiZcbiAgICBvbGQuYWNjZXNzQ29udHJvbC5tZW1iZXJzICE9PSBjdXJyZW50LmFjY2Vzc0NvbnRyb2wubWVtYmVyc1xuICApIHtcbiAgICBkZXRhaWxzLnB1c2goe1xuICAgICAgdHlwZTogJ2FjY2Vzcy1tZW1iZXJzJyxcbiAgICAgIG5ld1ByaXZpbGVnZTogY3VycmVudC5hY2Nlc3NDb250cm9sLm1lbWJlcnMsXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBsaW5rUHJldmlvdXNseUVuYWJsZWQgPSBpc0FjY2Vzc0NvbnRyb2xFbmFibGVkKFxuICAgIG9sZC5hY2Nlc3NDb250cm9sPy5hZGRGcm9tSW52aXRlTGlua1xuICApO1xuICBjb25zdCBsaW5rQ3VycmVudGx5RW5hYmxlZCA9IGlzQWNjZXNzQ29udHJvbEVuYWJsZWQoXG4gICAgY3VycmVudC5hY2Nlc3NDb250cm9sPy5hZGRGcm9tSW52aXRlTGlua1xuICApO1xuXG4gIGlmICghbGlua1ByZXZpb3VzbHlFbmFibGVkICYmIGxpbmtDdXJyZW50bHlFbmFibGVkKSB7XG4gICAgZGV0YWlscy5wdXNoKHtcbiAgICAgIHR5cGU6ICdncm91cC1saW5rLWFkZCcsXG4gICAgICBwcml2aWxlZ2U6IGN1cnJlbnQuYWNjZXNzQ29udHJvbD8uYWRkRnJvbUludml0ZUxpbmsgfHwgQUNDRVNTX0VOVU0uQU5ZLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKGxpbmtQcmV2aW91c2x5RW5hYmxlZCAmJiAhbGlua0N1cnJlbnRseUVuYWJsZWQpIHtcbiAgICBkZXRhaWxzLnB1c2goe1xuICAgICAgdHlwZTogJ2dyb3VwLWxpbmstcmVtb3ZlJyxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChcbiAgICBsaW5rUHJldmlvdXNseUVuYWJsZWQgJiZcbiAgICBsaW5rQ3VycmVudGx5RW5hYmxlZCAmJlxuICAgIG9sZC5hY2Nlc3NDb250cm9sPy5hZGRGcm9tSW52aXRlTGluayAhPT1cbiAgICAgIGN1cnJlbnQuYWNjZXNzQ29udHJvbD8uYWRkRnJvbUludml0ZUxpbmtcbiAgKSB7XG4gICAgZGV0YWlscy5wdXNoKHtcbiAgICAgIHR5cGU6ICdhY2Nlc3MtaW52aXRlLWxpbmsnLFxuICAgICAgbmV3UHJpdmlsZWdlOiBjdXJyZW50LmFjY2Vzc0NvbnRyb2w/LmFkZEZyb21JbnZpdGVMaW5rIHx8IEFDQ0VTU19FTlVNLkFOWSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGF2YXRhclxuXG4gIGlmIChcbiAgICBCb29sZWFuKG9sZC5hdmF0YXIpICE9PSBCb29sZWFuKGN1cnJlbnQuYXZhdGFyKSB8fFxuICAgIG9sZC5hdmF0YXI/Lmhhc2ggIT09IGN1cnJlbnQuYXZhdGFyPy5oYXNoXG4gICkge1xuICAgIGRldGFpbHMucHVzaCh7XG4gICAgICB0eXBlOiAnYXZhdGFyJyxcbiAgICAgIHJlbW92ZWQ6ICFjdXJyZW50LmF2YXRhcixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIG5hbWVcblxuICBpZiAob2xkLm5hbWUgIT09IGN1cnJlbnQubmFtZSkge1xuICAgIGRldGFpbHMucHVzaCh7XG4gICAgICB0eXBlOiAndGl0bGUnLFxuICAgICAgbmV3VGl0bGU6IGN1cnJlbnQubmFtZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGdyb3VwSW52aXRlTGlua1Bhc3N3b3JkXG5cbiAgLy8gTm90ZTogd2Ugb25seSBjYXB0dXJlIGxpbmsgcmVzZXRzIGhlcmUuIEVuYWJsZS9kaXNhYmxlIGFyZSBjb250cm9sbGVkIGJ5IHRoZVxuICAvLyAgIGFjY2Vzc0NvbnRyb2wuYWRkRnJvbUludml0ZUxpbmtcbiAgaWYgKFxuICAgIG9sZC5ncm91cEludml0ZUxpbmtQYXNzd29yZCAmJlxuICAgIGN1cnJlbnQuZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQgJiZcbiAgICBvbGQuZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQgIT09IGN1cnJlbnQuZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmRcbiAgKSB7XG4gICAgZGV0YWlscy5wdXNoKHtcbiAgICAgIHR5cGU6ICdncm91cC1saW5rLXJlc2V0JyxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRlc2NyaXB0aW9uXG4gIGlmIChvbGQuZGVzY3JpcHRpb24gIT09IGN1cnJlbnQuZGVzY3JpcHRpb24pIHtcbiAgICBkZXRhaWxzLnB1c2goe1xuICAgICAgdHlwZTogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgIHJlbW92ZWQ6ICFjdXJyZW50LmRlc2NyaXB0aW9uLFxuICAgICAgZGVzY3JpcHRpb246IGN1cnJlbnQuZGVzY3JpcHRpb24sXG4gICAgfSk7XG4gIH1cblxuICAvLyBObyBkaXNhcHBlYXJpbmcgbWVzc2FnZSB0aW1lciBjaGVjayBoZXJlIC0gc2VlIGJlbG93XG5cbiAgLy8gbWVtYmVyc1YyXG5cbiAgY29uc3Qgb2xkTWVtYmVyTG9va3VwID0gbmV3IE1hcDxVVUlEU3RyaW5nVHlwZSwgR3JvdXBWMk1lbWJlclR5cGU+KFxuICAgIChvbGQubWVtYmVyc1YyIHx8IFtdKS5tYXAobWVtYmVyID0+IFttZW1iZXIudXVpZCwgbWVtYmVyXSlcbiAgKTtcbiAgY29uc3Qgb2xkUGVuZGluZ01lbWJlckxvb2t1cCA9IG5ldyBNYXA8XG4gICAgVVVJRFN0cmluZ1R5cGUsXG4gICAgR3JvdXBWMlBlbmRpbmdNZW1iZXJUeXBlXG4gID4oKG9sZC5wZW5kaW5nTWVtYmVyc1YyIHx8IFtdKS5tYXAobWVtYmVyID0+IFttZW1iZXIudXVpZCwgbWVtYmVyXSkpO1xuICBjb25zdCBvbGRQZW5kaW5nQWRtaW5BcHByb3ZhbExvb2t1cCA9IG5ldyBNYXA8XG4gICAgVVVJRFN0cmluZ1R5cGUsXG4gICAgR3JvdXBWMlBlbmRpbmdBZG1pbkFwcHJvdmFsVHlwZVxuICA+KChvbGQucGVuZGluZ0FkbWluQXBwcm92YWxWMiB8fCBbXSkubWFwKG1lbWJlciA9PiBbbWVtYmVyLnV1aWQsIG1lbWJlcl0pKTtcbiAgY29uc3QgY3VycmVudFBlbmRpbmdNZW1iZXJTZXQgPSBuZXcgU2V0PFVVSURTdHJpbmdUeXBlPihcbiAgICAoY3VycmVudC5wZW5kaW5nTWVtYmVyc1YyIHx8IFtdKS5tYXAobWVtYmVyID0+IG1lbWJlci51dWlkKVxuICApO1xuXG4gIChjdXJyZW50Lm1lbWJlcnNWMiB8fCBbXSkuZm9yRWFjaChjdXJyZW50TWVtYmVyID0+IHtcbiAgICBjb25zdCB7IHV1aWQgfSA9IGN1cnJlbnRNZW1iZXI7XG4gICAgY29uc3QgaXNVcyA9IHV1aWQgPT09IG91ckFDSS50b1N0cmluZygpO1xuXG4gICAgaWYgKGlzVXMpIHtcbiAgICAgIGFyZVdlSW5Hcm91cCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkTWVtYmVyID0gb2xkTWVtYmVyTG9va3VwLmdldCh1dWlkKTtcbiAgICBpZiAoIW9sZE1lbWJlcikge1xuICAgICAgbGV0IHBlbmRpbmdNZW1iZXIgPSBvbGRQZW5kaW5nTWVtYmVyTG9va3VwLmdldCh1dWlkKTtcbiAgICAgIGlmIChpc1VzICYmIG91clBOSSAmJiAhcGVuZGluZ01lbWJlcikge1xuICAgICAgICBwZW5kaW5nTWVtYmVyID0gb2xkUGVuZGluZ01lbWJlckxvb2t1cC5nZXQob3VyUE5JLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgaWYgKHBlbmRpbmdNZW1iZXIpIHtcbiAgICAgICAgZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbWVtYmVyLWFkZC1mcm9tLWludml0ZScsXG4gICAgICAgICAgdXVpZCxcbiAgICAgICAgICBpbnZpdGVyOiBwZW5kaW5nTWVtYmVyLmFkZGVkQnlVc2VySWQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50TWVtYmVyLmpvaW5lZEZyb21MaW5rKSB7XG4gICAgICAgIGRldGFpbHMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ21lbWJlci1hZGQtZnJvbS1saW5rJyxcbiAgICAgICAgICB1dWlkLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudE1lbWJlci5hcHByb3ZlZEJ5QWRtaW4pIHtcbiAgICAgICAgZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbWVtYmVyLWFkZC1mcm9tLWFkbWluLWFwcHJvdmFsJyxcbiAgICAgICAgICB1dWlkLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRldGFpbHMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ21lbWJlci1hZGQnLFxuICAgICAgICAgIHV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2xkTWVtYmVyLnJvbGUgIT09IGN1cnJlbnRNZW1iZXIucm9sZSkge1xuICAgICAgZGV0YWlscy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ21lbWJlci1wcml2aWxlZ2UnLFxuICAgICAgICB1dWlkLFxuICAgICAgICBuZXdQcml2aWxlZ2U6IGN1cnJlbnRNZW1iZXIucm9sZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gZ2VuZXJhdGUgYW4gYWRtaW4tYXBwcm92YWwtcmVtb3ZlIGV2ZW50IGZvciB0aGlzIG5ld2x5LWFkZGVkXG4gICAgLy8gICBtZW1iZXIuIEJ1dCB3ZSBkb24ndCBrbm93IGZvciBzdXJlIGlmIHRoaXMgaXMgYW4gYWRtaW4gYXBwcm92YWw7IGZvciB0aGF0IHdlXG4gICAgLy8gICBjb25zdWx0ZWQgdGhlIGFwcHJvdmVkQnlBZG1pbiBmbGFnIHNhdmVkIG9uIHRoZSBtZW1iZXIuXG4gICAgb2xkUGVuZGluZ0FkbWluQXBwcm92YWxMb29rdXAuZGVsZXRlKHV1aWQpO1xuXG4gICAgLy8gSWYgd2UgY2FwdHVyZSBhIHBlbmRpbmcgcmVtb3ZlIGhlcmUsIGl0J3MgYW4gJ2FjY2VwdCBpbnZpdGF0aW9uJywgYW5kIHdlIGRvbid0XG4gICAgLy8gICB3YW50IHRvIGdlbmVyYXRlIGEgcGVuZGluZy1yZW1vdmUgZXZlbnQgZm9yIGl0XG4gICAgb2xkUGVuZGluZ01lbWJlckxvb2t1cC5kZWxldGUodXVpZCk7XG5cbiAgICAvLyBUaGlzIGRlbGV0aW9uIG1ha2VzIGl0IGVhc2llciB0byBjYXB0dXJlIHJlbW92YWxzXG4gICAgb2xkTWVtYmVyTG9va3VwLmRlbGV0ZSh1dWlkKTtcblxuICAgIC8vIE91ciBBQ0kganVzdCBqb2luZWQgKHdhc24ndCBhIG1lbWJlciBiZWZvcmUpIGFuZCBvdXIgUE5JIGRpc2FwcGVhcmVkXG4gICAgLy8gZnJvbSB0aGUgaW52aXRlIGxpc3QuIFRyZWF0IHRoaXMgYXMgYSBwcm9tb3Rpb24gZnJvbSBQTkkgdG8gQUNJIGFuZFxuICAgIC8vIHByZXRlbmQgdGhhdCB0aGUgUE5JIHdhc24ndCBwZW5kaW5nIHNvIHRoYXQgd2Ugd29uJ3QgZ2VuZXJhdGUgYVxuICAgIC8vIHBlbmRpbmctYWRkLW9uZSBub3RpZmljYXRpb24gYmVsb3cuXG4gICAgaWYgKFxuICAgICAgaXNVcyAmJlxuICAgICAgb3VyUE5JICYmXG4gICAgICAhb2xkTWVtYmVyICYmXG4gICAgICBvbGRQZW5kaW5nTWVtYmVyTG9va3VwLmhhcyhvdXJQTkkudG9TdHJpbmcoKSkgJiZcbiAgICAgICFjdXJyZW50UGVuZGluZ01lbWJlclNldC5oYXMob3VyUE5JLnRvU3RyaW5nKCkpXG4gICAgKSB7XG4gICAgICBvbGRQZW5kaW5nTWVtYmVyTG9va3VwLmRlbGV0ZShvdXJQTkkudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCByZW1vdmVkTWVtYmVySWRzID0gQXJyYXkuZnJvbShvbGRNZW1iZXJMb29rdXAua2V5cygpKTtcbiAgcmVtb3ZlZE1lbWJlcklkcy5mb3JFYWNoKHV1aWQgPT4ge1xuICAgIGRldGFpbHMucHVzaCh7XG4gICAgICB0eXBlOiAnbWVtYmVyLXJlbW92ZScsXG4gICAgICB1dWlkLFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBwZW5kaW5nTWVtYmVyc1YyXG5cbiAgbGV0IGxhc3RQZW5kaW5nVXVpZDogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQ7XG4gIGxldCBwZW5kaW5nQ291bnQgPSAwO1xuICAoY3VycmVudC5wZW5kaW5nTWVtYmVyc1YyIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnRQZW5kaW5nTWVtYmVyID0+IHtcbiAgICBjb25zdCB7IHV1aWQgfSA9IGN1cnJlbnRQZW5kaW5nTWVtYmVyO1xuICAgIGNvbnN0IG9sZFBlbmRpbmdNZW1iZXIgPSBvbGRQZW5kaW5nTWVtYmVyTG9va3VwLmdldCh1dWlkKTtcblxuICAgIGlmICh1dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKSB8fCB1dWlkID09PSBvdXJQTkk/LnRvU3RyaW5nKCkpIHtcbiAgICAgIGlmICh1dWlkID09PSBvdXJBQ0kudG9TdHJpbmcoKSkge1xuICAgICAgICB1dWlkS2luZEludml0ZWRUb0dyb3VwID0gVVVJREtpbmQuQUNJO1xuICAgICAgfSBlbHNlIGlmICh1dWlkS2luZEludml0ZWRUb0dyb3VwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdXVpZEtpbmRJbnZpdGVkVG9Hcm91cCA9IFVVSURLaW5kLlBOSTtcbiAgICAgIH1cblxuICAgICAgd2hvSW52aXRlZFVzVXNlcklkID0gY3VycmVudFBlbmRpbmdNZW1iZXIuYWRkZWRCeVVzZXJJZDtcbiAgICB9XG5cbiAgICBpZiAoIW9sZFBlbmRpbmdNZW1iZXIpIHtcbiAgICAgIGxhc3RQZW5kaW5nVXVpZCA9IHV1aWQ7XG4gICAgICBwZW5kaW5nQ291bnQgKz0gMTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGRlbGV0aW9uIG1ha2VzIGl0IGVhc2llciB0byBjYXB0dXJlIHJlbW92YWxzXG4gICAgb2xkUGVuZGluZ01lbWJlckxvb2t1cC5kZWxldGUodXVpZCk7XG4gIH0pO1xuXG4gIGlmIChwZW5kaW5nQ291bnQgPiAxKSB7XG4gICAgZGV0YWlscy5wdXNoKHtcbiAgICAgIHR5cGU6ICdwZW5kaW5nLWFkZC1tYW55JyxcbiAgICAgIGNvdW50OiBwZW5kaW5nQ291bnQsXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAocGVuZGluZ0NvdW50ID09PSAxKSB7XG4gICAgaWYgKGxhc3RQZW5kaW5nVXVpZCkge1xuICAgICAgZGV0YWlscy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3BlbmRpbmctYWRkLW9uZScsXG4gICAgICAgIHV1aWQ6IGxhc3RQZW5kaW5nVXVpZCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGV4dHJhY3REaWZmcy8ke2xvZ0lkfTogcGVuZGluZ0NvdW50IHdhcyAxLCBubyBsYXN0IGNvbnZlcnNhdGlvbklkIGF2YWlsYWJsZWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gTm90ZTogVGhlIG9ubHkgbWVtYmVycyBsZWZ0IG92ZXIgaGVyZSBzaG91bGQgYmUgcGVvcGxlIHdobyB3ZXJlIG1vdmVkIGZyb20gdGhlXG4gIC8vICAgcGVuZGluZyBsaXN0IGJ1dCBhbHNvIG5vdCBhZGRlZCB0byB0aGUgZ3JvdXAgYXQgdGhlIHNhbWUgdGltZS5cbiAgY29uc3QgcmVtb3ZlZFBlbmRpbmdNZW1iZXJJZHMgPSBBcnJheS5mcm9tKG9sZFBlbmRpbmdNZW1iZXJMb29rdXAua2V5cygpKTtcbiAgaWYgKHJlbW92ZWRQZW5kaW5nTWVtYmVySWRzLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCBmaXJzdFV1aWQgPSByZW1vdmVkUGVuZGluZ01lbWJlcklkc1swXTtcbiAgICBjb25zdCBmaXJzdFJlbW92ZWRNZW1iZXIgPSBvbGRQZW5kaW5nTWVtYmVyTG9va3VwLmdldChmaXJzdFV1aWQpO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGZpcnN0UmVtb3ZlZE1lbWJlciAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ0ZpcnN0IHJlbW92ZWQgbWVtYmVyIG5vdCBmb3VuZCdcbiAgICApO1xuICAgIGNvbnN0IGludml0ZXIgPSBmaXJzdFJlbW92ZWRNZW1iZXIuYWRkZWRCeVVzZXJJZDtcbiAgICBjb25zdCBhbGxTYW1lSW52aXRlciA9IHJlbW92ZWRQZW5kaW5nTWVtYmVySWRzLmV2ZXJ5KFxuICAgICAgaWQgPT4gb2xkUGVuZGluZ01lbWJlckxvb2t1cC5nZXQoaWQpPy5hZGRlZEJ5VXNlcklkID09PSBpbnZpdGVyXG4gICAgKTtcbiAgICBkZXRhaWxzLnB1c2goe1xuICAgICAgdHlwZTogJ3BlbmRpbmctcmVtb3ZlLW1hbnknLFxuICAgICAgY291bnQ6IHJlbW92ZWRQZW5kaW5nTWVtYmVySWRzLmxlbmd0aCxcbiAgICAgIGludml0ZXI6IGFsbFNhbWVJbnZpdGVyID8gaW52aXRlciA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChyZW1vdmVkUGVuZGluZ01lbWJlcklkcy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCB1dWlkID0gcmVtb3ZlZFBlbmRpbmdNZW1iZXJJZHNbMF07XG4gICAgY29uc3QgcmVtb3ZlZE1lbWJlciA9IG9sZFBlbmRpbmdNZW1iZXJMb29rdXAuZ2V0KHV1aWQpO1xuICAgIHN0cmljdEFzc2VydChyZW1vdmVkTWVtYmVyICE9PSB1bmRlZmluZWQsICdSZW1vdmVkIG1lbWJlciBub3QgZm91bmQnKTtcblxuICAgIGRldGFpbHMucHVzaCh7XG4gICAgICB0eXBlOiAncGVuZGluZy1yZW1vdmUtb25lJyxcbiAgICAgIHV1aWQsXG4gICAgICBpbnZpdGVyOiByZW1vdmVkTWVtYmVyLmFkZGVkQnlVc2VySWQsXG4gICAgfSk7XG4gIH1cblxuICAvLyBwZW5kaW5nQWRtaW5BcHByb3ZhbFYyXG5cbiAgKGN1cnJlbnQucGVuZGluZ0FkbWluQXBwcm92YWxWMiB8fCBbXSkuZm9yRWFjaChcbiAgICBjdXJyZW50UGVuZGluZ0FkbWluQXByb3ZhbE1lbWJlciA9PiB7XG4gICAgICBjb25zdCB7IHV1aWQgfSA9IGN1cnJlbnRQZW5kaW5nQWRtaW5BcHJvdmFsTWVtYmVyO1xuICAgICAgY29uc3Qgb2xkUGVuZGluZ01lbWJlciA9IG9sZFBlbmRpbmdBZG1pbkFwcHJvdmFsTG9va3VwLmdldCh1dWlkKTtcblxuICAgICAgaWYgKHV1aWQgPT09IG91ckFDSS50b1N0cmluZygpKSB7XG4gICAgICAgIGFyZVdlUGVuZGluZ0FwcHJvdmFsID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvbGRQZW5kaW5nTWVtYmVyKSB7XG4gICAgICAgIGRldGFpbHMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnLFxuICAgICAgICAgIHV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGRlbGV0aW9uIG1ha2VzIGl0IGVhc2llciB0byBjYXB0dXJlIHJlbW92YWxzXG4gICAgICBvbGRQZW5kaW5nQWRtaW5BcHByb3ZhbExvb2t1cC5kZWxldGUodXVpZCk7XG4gICAgfVxuICApO1xuXG4gIC8vIE5vdGU6IFRoZSBvbmx5IG1lbWJlcnMgbGVmdCBvdmVyIGhlcmUgc2hvdWxkIGJlIHBlb3BsZSB3aG8gd2VyZSBtb3ZlZCBmcm9tIHRoZVxuICAvLyAgIHBlbmRpbmdBZG1pbkFwcHJvdmFsIGxpc3QgYnV0IGFsc28gbm90IGFkZGVkIHRvIHRoZSBncm91cCBhdCB0aGUgc2FtZSB0aW1lLlxuICBjb25zdCByZW1vdmVkUGVuZGluZ0FkbWluQXBwcm92YWxJZHMgPSBBcnJheS5mcm9tKFxuICAgIG9sZFBlbmRpbmdBZG1pbkFwcHJvdmFsTG9va3VwLmtleXMoKVxuICApO1xuICByZW1vdmVkUGVuZGluZ0FkbWluQXBwcm92YWxJZHMuZm9yRWFjaCh1dWlkID0+IHtcbiAgICBkZXRhaWxzLnB1c2goe1xuICAgICAgdHlwZTogJ2FkbWluLWFwcHJvdmFsLXJlbW92ZS1vbmUnLFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gYW5ub3VuY2VtZW50c09ubHlcblxuICBpZiAoQm9vbGVhbihvbGQuYW5ub3VuY2VtZW50c09ubHkpICE9PSBCb29sZWFuKGN1cnJlbnQuYW5ub3VuY2VtZW50c09ubHkpKSB7XG4gICAgZGV0YWlscy5wdXNoKHtcbiAgICAgIHR5cGU6ICdhbm5vdW5jZW1lbnRzLW9ubHknLFxuICAgICAgYW5ub3VuY2VtZW50c09ubHk6IEJvb2xlYW4oY3VycmVudC5hbm5vdW5jZW1lbnRzT25seSksXG4gICAgfSk7XG4gIH1cblxuICAvLyBOb3RlOiBjdXJyZW50bHkgbm8gZGlmZiBnZW5lcmF0ZWQgZm9yIGJhbm5lZE1lbWJlcnNWMiBjaGFuZ2VzXG5cbiAgLy8gZmluYWwgcHJvY2Vzc2luZ1xuXG4gIGxldCBtZXNzYWdlOiBHcm91cENoYW5nZU1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkO1xuICBsZXQgdGltZXJOb3RpZmljYXRpb246IEdyb3VwQ2hhbmdlTWVzc2FnZVR5cGUgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZmlyc3RVcGRhdGUgPSAhaXNOdW1iZXIob2xkLnJldmlzaW9uKTtcbiAgY29uc3QgaXNGcm9tVXMgPSBvdXJBQ0kudG9TdHJpbmcoKSA9PT0gc291cmNlVXVpZDtcblxuICAvLyBIZXJlIHdlIGhhcmRjb2RlIGluaXRpYWwgbWVzc2FnZXMgaWYgdGhpcyBpcyBvdXIgZmlyc3QgdGltZSBwcm9jZXNzaW5nIGRhdGEgdGhpc1xuICAvLyAgIGdyb3VwLiBJZGVhbGx5IHdlIGNhbiBjb2xsYXBzZSBpdCBkb3duIHRvIGp1c3Qgb25lIG9mOiAneW91IHdlcmUgYWRkZWQnLFxuICAvLyAgICd5b3Ugd2VyZSBpbnZpdGVkJywgb3IgJ3lvdSBjcmVhdGVkLidcbiAgaWYgKGZpcnN0VXBkYXRlICYmIHV1aWRLaW5kSW52aXRlZFRvR3JvdXAgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE5vdGUsIHdlIHdpbGwgYWRkICd5b3Ugd2VyZSBpbnZpdGVkJyB0byBncm91cCBldmVuIGlmIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UgPSB0cnVlXG4gICAgbWVzc2FnZSA9IHtcbiAgICAgIC4uLmdlbmVyYXRlQmFzaWNNZXNzYWdlKCksXG4gICAgICB0eXBlOiAnZ3JvdXAtdjItY2hhbmdlJyxcbiAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgZnJvbTogd2hvSW52aXRlZFVzVXNlcklkIHx8IHNvdXJjZVV1aWQsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAncGVuZGluZy1hZGQtb25lJyxcbiAgICAgICAgICAgIHV1aWQ6IHdpbmRvdy5zdG9yYWdlLnVzZXJcbiAgICAgICAgICAgICAgLmdldENoZWNrZWRVdWlkKHV1aWRLaW5kSW52aXRlZFRvR3JvdXApXG4gICAgICAgICAgICAgIC50b1N0cmluZygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgc2VlblN0YXR1czogaXNGcm9tVXMgPyBTZWVuU3RhdHVzLlNlZW4gOiBTZWVuU3RhdHVzLlVuc2VlbixcbiAgICB9O1xuICB9IGVsc2UgaWYgKGZpcnN0VXBkYXRlICYmIGFyZVdlUGVuZGluZ0FwcHJvdmFsKSB7XG4gICAgbWVzc2FnZSA9IHtcbiAgICAgIC4uLmdlbmVyYXRlQmFzaWNNZXNzYWdlKCksXG4gICAgICB0eXBlOiAnZ3JvdXAtdjItY2hhbmdlJyxcbiAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgZnJvbTogb3VyQUNJLnRvU3RyaW5nKCksXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnYWRtaW4tYXBwcm92YWwtYWRkLW9uZScsXG4gICAgICAgICAgICB1dWlkOiBvdXJBQ0kudG9TdHJpbmcoKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKGZpcnN0VXBkYXRlICYmIGRyb3BJbml0aWFsSm9pbk1lc3NhZ2UpIHtcbiAgICAvLyBOb25lIG9mIHRoZSByZXN0IG9mIHRoZSBtZXNzYWdlcyBzaG91bGQgYmUgYWRkZWQgaWYgZHJvcEluaXRpYWxKb2luTWVzc2FnZSA9IHRydWVcbiAgICBtZXNzYWdlID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKFxuICAgIGZpcnN0VXBkYXRlICYmXG4gICAgY3VycmVudC5yZXZpc2lvbiA9PT0gMCAmJlxuICAgIHNvdXJjZVV1aWQgPT09IG91ckFDSS50b1N0cmluZygpXG4gICkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgICAgdHlwZTogJ2dyb3VwLXYyLWNoYW5nZScsXG4gICAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICAgIGZyb206IHNvdXJjZVV1aWQsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnY3JlYXRlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlZW5TdGF0dXM6IGlzRnJvbVVzID8gU2VlblN0YXR1cy5TZWVuIDogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaXJzdFVwZGF0ZSAmJiBhcmVXZUluR3JvdXApIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgLi4uZ2VuZXJhdGVCYXNpY01lc3NhZ2UoKSxcbiAgICAgIHR5cGU6ICdncm91cC12Mi1jaGFuZ2UnLFxuICAgICAgZ3JvdXBWMkNoYW5nZToge1xuICAgICAgICBmcm9tOiBzb3VyY2VVdWlkLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ21lbWJlci1hZGQnLFxuICAgICAgICAgICAgdXVpZDogb3VyQUNJLnRvU3RyaW5nKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICBzZWVuU3RhdHVzOiBpc0Zyb21VcyA/IFNlZW5TdGF0dXMuU2VlbiA6IFNlZW5TdGF0dXMuVW5zZWVuLFxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmlyc3RVcGRhdGUgJiYgY3VycmVudC5yZXZpc2lvbiA9PT0gMCkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgICAgdHlwZTogJ2dyb3VwLXYyLWNoYW5nZScsXG4gICAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICAgIGZyb206IHNvdXJjZVV1aWQsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnY3JlYXRlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgIHNlZW5TdGF0dXM6IGlzRnJvbVVzID8gU2VlblN0YXR1cy5TZWVuIDogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgLi4uZ2VuZXJhdGVCYXNpY01lc3NhZ2UoKSxcbiAgICAgIHR5cGU6ICdncm91cC12Mi1jaGFuZ2UnLFxuICAgICAgc291cmNlVXVpZCxcbiAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgZnJvbTogc291cmNlVXVpZCxcbiAgICAgICAgZGV0YWlscyxcbiAgICAgIH0sXG4gICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICBzZWVuU3RhdHVzOiBpc0Zyb21VcyA/IFNlZW5TdGF0dXMuU2VlbiA6IFNlZW5TdGF0dXMuVW5zZWVuLFxuICAgIH07XG4gIH1cblxuICAvLyBUaGlzIGlzIGNoZWNrZWQgZGlmZmVyZW50bHksIGJlY2F1c2UgaXQgbmVlZHMgdG8gYmUgaXRzIG93biBlbnRyeSBpbiB0aGUgdGltZWxpbmUsXG4gIC8vICAgd2l0aCBpdHMgb3duIGljb24sIGV0Yy5cbiAgaWYgKFxuICAgIC8vIFR1cm4gb24gb3IgdHVybmVkIG9mZlxuICAgIEJvb2xlYW4ob2xkLmV4cGlyZVRpbWVyKSAhPT0gQm9vbGVhbihjdXJyZW50LmV4cGlyZVRpbWVyKSB8fFxuICAgIC8vIFN0aWxsIG9uLCBidXQgY2hhbmdlZCB2YWx1ZVxuICAgIChCb29sZWFuKG9sZC5leHBpcmVUaW1lcikgJiZcbiAgICAgIEJvb2xlYW4oY3VycmVudC5leHBpcmVUaW1lcikgJiZcbiAgICAgIG9sZC5leHBpcmVUaW1lciAhPT0gY3VycmVudC5leHBpcmVUaW1lcilcbiAgKSB7XG4gICAgdGltZXJOb3RpZmljYXRpb24gPSB7XG4gICAgICAuLi5nZW5lcmF0ZUJhc2ljTWVzc2FnZSgpLFxuICAgICAgdHlwZTogJ3RpbWVyLW5vdGlmaWNhdGlvbicsXG4gICAgICBzb3VyY2VVdWlkLFxuICAgICAgZmxhZ3M6IFByb3RvLkRhdGFNZXNzYWdlLkZsYWdzLkVYUElSQVRJT05fVElNRVJfVVBEQVRFLFxuICAgICAgZXhwaXJhdGlvblRpbWVyVXBkYXRlOiB7XG4gICAgICAgIGV4cGlyZVRpbWVyOiBjdXJyZW50LmV4cGlyZVRpbWVyIHx8IDAsXG4gICAgICAgIHNvdXJjZVV1aWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBjb21wYWN0KFttZXNzYWdlLCB0aW1lck5vdGlmaWNhdGlvbl0pO1xuXG4gIGxvZy5pbmZvKFxuICAgIGBleHRyYWN0RGlmZnMvJHtsb2dJZH0gY29tcGxldGUsIGdlbmVyYXRlZCAke3Jlc3VsdC5sZW5ndGh9IGNoYW5nZSBtZXNzYWdlc2BcbiAgKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwcm9maWxlS2V5c1RvTWVtYmVycyhpdGVtczogQXJyYXk8R3JvdXBDaGFuZ2VNZW1iZXJUeXBlPikge1xuICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4gKHtcbiAgICBwcm9maWxlS2V5OiBCeXRlcy50b0Jhc2U2NChpdGVtLnByb2ZpbGVLZXkpLFxuICAgIHV1aWQ6IGl0ZW0udXVpZCxcbiAgfSkpO1xufVxuXG50eXBlIEdyb3VwQ2hhbmdlTWVtYmVyVHlwZSA9IHtcbiAgcHJvZmlsZUtleTogVWludDhBcnJheTtcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG59O1xudHlwZSBHcm91cEFwcGx5UmVzdWx0VHlwZSA9IHtcbiAgbmV3QXR0cmlidXRlczogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIG5ld1Byb2ZpbGVLZXlzOiBBcnJheTxHcm91cENoYW5nZU1lbWJlclR5cGU+O1xufTtcblxuYXN5bmMgZnVuY3Rpb24gYXBwbHlHcm91cENoYW5nZSh7XG4gIGFjdGlvbnMsXG4gIGdyb3VwLFxuICBzb3VyY2VVdWlkLFxufToge1xuICBhY3Rpb25zOiBEZWNyeXB0ZWRHcm91cENoYW5nZUFjdGlvbnM7XG4gIGdyb3VwOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZTtcbiAgc291cmNlVXVpZDogVVVJRFN0cmluZ1R5cGU7XG59KTogUHJvbWlzZTxHcm91cEFwcGx5UmVzdWx0VHlwZT4ge1xuICBjb25zdCBsb2dJZCA9IGlkRm9yTG9nZ2luZyhncm91cC5ncm91cElkKTtcbiAgY29uc3Qgb3VyQUNJID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpLnRvU3RyaW5nKCk7XG5cbiAgY29uc3QgQUNDRVNTX0VOVU0gPSBQcm90by5BY2Nlc3NDb250cm9sLkFjY2Vzc1JlcXVpcmVkO1xuICBjb25zdCBNRU1CRVJfUk9MRV9FTlVNID0gUHJvdG8uTWVtYmVyLlJvbGU7XG5cbiAgY29uc3QgdmVyc2lvbiA9IGFjdGlvbnMudmVyc2lvbiB8fCAwO1xuICBjb25zdCByZXN1bHQgPSB7IC4uLmdyb3VwIH07XG4gIGNvbnN0IG5ld1Byb2ZpbGVLZXlzOiBBcnJheTxHcm91cENoYW5nZU1lbWJlclR5cGU+ID0gW107XG5cbiAgY29uc3QgbWVtYmVyczogUmVjb3JkPFVVSURTdHJpbmdUeXBlLCBHcm91cFYyTWVtYmVyVHlwZT4gPSBmcm9tUGFpcnMoXG4gICAgKHJlc3VsdC5tZW1iZXJzVjIgfHwgW10pLm1hcChtZW1iZXIgPT4gW21lbWJlci51dWlkLCBtZW1iZXJdKVxuICApO1xuICBjb25zdCBwZW5kaW5nTWVtYmVyczogUmVjb3JkPFVVSURTdHJpbmdUeXBlLCBHcm91cFYyUGVuZGluZ01lbWJlclR5cGU+ID1cbiAgICBmcm9tUGFpcnMoXG4gICAgICAocmVzdWx0LnBlbmRpbmdNZW1iZXJzVjIgfHwgW10pLm1hcChtZW1iZXIgPT4gW21lbWJlci51dWlkLCBtZW1iZXJdKVxuICAgICk7XG4gIGNvbnN0IHBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyczogUmVjb3JkPFxuICAgIFVVSURTdHJpbmdUeXBlLFxuICAgIEdyb3VwVjJQZW5kaW5nQWRtaW5BcHByb3ZhbFR5cGVcbiAgPiA9IGZyb21QYWlycyhcbiAgICAocmVzdWx0LnBlbmRpbmdBZG1pbkFwcHJvdmFsVjIgfHwgW10pLm1hcChtZW1iZXIgPT4gW21lbWJlci51dWlkLCBtZW1iZXJdKVxuICApO1xuICBjb25zdCBiYW5uZWRNZW1iZXJzID0gbmV3IE1hcDxVVUlEU3RyaW5nVHlwZSwgR3JvdXBWMkJhbm5lZE1lbWJlclR5cGU+KFxuICAgIChyZXN1bHQuYmFubmVkTWVtYmVyc1YyIHx8IFtdKS5tYXAobWVtYmVyID0+IFttZW1iZXIudXVpZCwgbWVtYmVyXSlcbiAgKTtcblxuICAvLyB2ZXJzaW9uPzogbnVtYmVyO1xuICByZXN1bHQucmV2aXNpb24gPSB2ZXJzaW9uO1xuXG4gIC8vIGFkZE1lbWJlcnM/OiBBcnJheTxHcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlckFjdGlvbj47XG4gIChhY3Rpb25zLmFkZE1lbWJlcnMgfHwgW10pLmZvckVhY2goYWRkTWVtYmVyID0+IHtcbiAgICBjb25zdCB7IGFkZGVkIH0gPSBhZGRNZW1iZXI7XG4gICAgaWYgKCFhZGRlZCB8fCAhYWRkZWQudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5R3JvdXBDaGFuZ2U6IGFkZE1lbWJlci5hZGRlZCBpcyBtaXNzaW5nJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkZWRVdWlkID0gVVVJRC5jYXN0KGFkZGVkLnVzZXJJZCk7XG5cbiAgICBpZiAobWVtYmVyc1thZGRlZFV1aWRdKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gYWRkIG1lbWJlciBmYWlsZWQ7IGFscmVhZHkgaW4gbWVtYmVycy5gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lbWJlcnNbYWRkZWRVdWlkXSA9IHtcbiAgICAgIHV1aWQ6IGFkZGVkVXVpZCxcbiAgICAgIHJvbGU6IGFkZGVkLnJvbGUgfHwgTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxULFxuICAgICAgam9pbmVkQXRWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgam9pbmVkRnJvbUxpbms6IGFkZE1lbWJlci5qb2luRnJvbUludml0ZUxpbmsgfHwgZmFsc2UsXG4gICAgfTtcblxuICAgIGlmIChwZW5kaW5nTWVtYmVyc1thZGRlZFV1aWRdKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IFJlbW92aW5nIG5ld2x5LWFkZGVkIG1lbWJlciBmcm9tIHBlbmRpbmdNZW1iZXJzLmBcbiAgICAgICk7XG4gICAgICBkZWxldGUgcGVuZGluZ01lbWJlcnNbYWRkZWRVdWlkXTtcbiAgICB9XG5cbiAgICAvLyBDYXB0dXJlIHdobyBhZGRlZCB1c1xuICAgIGlmIChvdXJBQ0kgJiYgc291cmNlVXVpZCAmJiBhZGRlZFV1aWQgPT09IG91ckFDSSkge1xuICAgICAgcmVzdWx0LmFkZGVkQnkgPSBzb3VyY2VVdWlkO1xuICAgIH1cblxuICAgIGlmIChhZGRlZC5wcm9maWxlS2V5KSB7XG4gICAgICBuZXdQcm9maWxlS2V5cy5wdXNoKHtcbiAgICAgICAgcHJvZmlsZUtleTogYWRkZWQucHJvZmlsZUtleSxcbiAgICAgICAgdXVpZDogVVVJRC5jYXN0KGFkZGVkLnVzZXJJZCksXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGRlbGV0ZU1lbWJlcnM/OiBBcnJheTxHcm91cENoYW5nZS5BY3Rpb25zLkRlbGV0ZU1lbWJlckFjdGlvbj47XG4gIChhY3Rpb25zLmRlbGV0ZU1lbWJlcnMgfHwgW10pLmZvckVhY2goZGVsZXRlTWVtYmVyID0+IHtcbiAgICBjb25zdCB7IGRlbGV0ZWRVc2VySWQgfSA9IGRlbGV0ZU1lbWJlcjtcbiAgICBpZiAoIWRlbGV0ZWRVc2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IGRlbGV0ZU1lbWJlci5kZWxldGVkVXNlcklkIGlzIG1pc3NpbmcnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbGV0ZWRVdWlkID0gVVVJRC5jYXN0KGRlbGV0ZWRVc2VySWQpO1xuICAgIGlmIChtZW1iZXJzW2RlbGV0ZWRVdWlkXSkge1xuICAgICAgZGVsZXRlIG1lbWJlcnNbZGVsZXRlZFV1aWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcmVtb3ZlIG1lbWJlciBmYWlsZWQ7IHdhcyBub3QgaW4gbWVtYmVycy5gXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gbW9kaWZ5TWVtYmVyUm9sZXM/OiBBcnJheTxHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeU1lbWJlclJvbGVBY3Rpb24+O1xuICAoYWN0aW9ucy5tb2RpZnlNZW1iZXJSb2xlcyB8fCBbXSkuZm9yRWFjaChtb2RpZnlNZW1iZXJSb2xlID0+IHtcbiAgICBjb25zdCB7IHJvbGUsIHVzZXJJZCB9ID0gbW9kaWZ5TWVtYmVyUm9sZTtcbiAgICBpZiAoIXJvbGUgfHwgIXVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseUdyb3VwQ2hhbmdlOiBtb2RpZnlNZW1iZXJSb2xlIGhhZCBhIG1pc3NpbmcgdmFsdWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyVXVpZCA9IFVVSUQuY2FzdCh1c2VySWQpO1xuICAgIGlmIChtZW1iZXJzW3VzZXJVdWlkXSkge1xuICAgICAgbWVtYmVyc1t1c2VyVXVpZF0gPSB7XG4gICAgICAgIC4uLm1lbWJlcnNbdXNlclV1aWRdLFxuICAgICAgICByb2xlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYXBwbHlHcm91cENoYW5nZTogbW9kaWZ5TWVtYmVyUm9sZSB0cmllZCB0byBtb2RpZnkgbm9uZXhpc3RlbnQgbWVtYmVyJ1xuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIG1vZGlmeU1lbWJlclByb2ZpbGVLZXlzPzpcbiAgLy8gQXJyYXk8R3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJQcm9maWxlS2V5QWN0aW9uPjtcbiAgKGFjdGlvbnMubW9kaWZ5TWVtYmVyUHJvZmlsZUtleXMgfHwgW10pLmZvckVhY2gobW9kaWZ5TWVtYmVyUHJvZmlsZUtleSA9PiB7XG4gICAgY29uc3QgeyBwcm9maWxlS2V5LCB1dWlkIH0gPSBtb2RpZnlNZW1iZXJQcm9maWxlS2V5O1xuICAgIGlmICghcHJvZmlsZUtleSB8fCAhdXVpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYXBwbHlHcm91cENoYW5nZTogbW9kaWZ5TWVtYmVyUHJvZmlsZUtleSBoYWQgYSBtaXNzaW5nIHZhbHVlJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBuZXdQcm9maWxlS2V5cy5wdXNoKHtcbiAgICAgIHByb2ZpbGVLZXksXG4gICAgICB1dWlkOiBVVUlELmNhc3QodXVpZCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGFkZFBlbmRpbmdNZW1iZXJzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5BZGRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleUFjdGlvblxuICAvLyA+O1xuICAoYWN0aW9ucy5hZGRQZW5kaW5nTWVtYmVycyB8fCBbXSkuZm9yRWFjaChhZGRQZW5kaW5nTWVtYmVyID0+IHtcbiAgICBjb25zdCB7IGFkZGVkIH0gPSBhZGRQZW5kaW5nTWVtYmVyO1xuICAgIGlmICghYWRkZWQgfHwgIWFkZGVkLm1lbWJlciB8fCAhYWRkZWQubWVtYmVyLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYXBwbHlHcm91cENoYW5nZTogYWRkUGVuZGluZ01lbWJlcnMgaGFkIGEgbWlzc2luZyB2YWx1ZSdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkZWRVdWlkID0gVVVJRC5jYXN0KGFkZGVkLm1lbWJlci51c2VySWQpO1xuXG4gICAgaWYgKG1lbWJlcnNbYWRkZWRVdWlkXSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBdHRlbXB0IHRvIGFkZCBwZW5kaW5nTWVtYmVyIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gbWVtYmVycy5gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGVuZGluZ01lbWJlcnNbYWRkZWRVdWlkXSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBdHRlbXB0IHRvIGFkZCBwZW5kaW5nTWVtYmVyIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gcGVuZGluZ01lbWJlcnMuYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwZW5kaW5nTWVtYmVyc1thZGRlZFV1aWRdID0ge1xuICAgICAgdXVpZDogYWRkZWRVdWlkLFxuICAgICAgYWRkZWRCeVVzZXJJZDogVVVJRC5jYXN0KGFkZGVkLmFkZGVkQnlVc2VySWQpLFxuICAgICAgdGltZXN0YW1wOiBhZGRlZC50aW1lc3RhbXAsXG4gICAgICByb2xlOiBhZGRlZC5tZW1iZXIucm9sZSB8fCBNRU1CRVJfUk9MRV9FTlVNLkRFRkFVTFQsXG4gICAgfTtcblxuICAgIGlmIChhZGRlZC5tZW1iZXIgJiYgYWRkZWQubWVtYmVyLnByb2ZpbGVLZXkpIHtcbiAgICAgIG5ld1Byb2ZpbGVLZXlzLnB1c2goe1xuICAgICAgICBwcm9maWxlS2V5OiBhZGRlZC5tZW1iZXIucHJvZmlsZUtleSxcbiAgICAgICAgdXVpZDogYWRkZWRVdWlkLFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBkZWxldGVQZW5kaW5nTWVtYmVycz86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXlBY3Rpb25cbiAgLy8gPjtcbiAgKGFjdGlvbnMuZGVsZXRlUGVuZGluZ01lbWJlcnMgfHwgW10pLmZvckVhY2goZGVsZXRlUGVuZGluZ01lbWJlciA9PiB7XG4gICAgY29uc3QgeyBkZWxldGVkVXNlcklkIH0gPSBkZWxldGVQZW5kaW5nTWVtYmVyO1xuICAgIGlmICghZGVsZXRlZFVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYXBwbHlHcm91cENoYW5nZTogZGVsZXRlUGVuZGluZ01lbWJlci5kZWxldGVkVXNlcklkIGlzIG51bGwhJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVkVXVpZCA9IFVVSUQuY2FzdChkZWxldGVkVXNlcklkKTtcblxuICAgIGlmIChwZW5kaW5nTWVtYmVyc1tkZWxldGVkVXVpZF0pIHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nTWVtYmVyc1tkZWxldGVkVXVpZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgYXBwbHlHcm91cENoYW5nZS8ke2xvZ0lkfTogQXR0ZW1wdCB0byByZW1vdmUgcGVuZGluZ01lbWJlciBmYWlsZWQ7IHdhcyBub3QgaW4gcGVuZGluZ01lbWJlcnMuYFxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb21vdGVQZW5kaW5nTWVtYmVycz86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuUHJvbW90ZU1lbWJlclBlbmRpbmdQcm9maWxlS2V5QWN0aW9uXG4gIC8vID47XG4gIChhY3Rpb25zLnByb21vdGVQZW5kaW5nTWVtYmVycyB8fCBbXSkuZm9yRWFjaChwcm9tb3RlUGVuZGluZ01lbWJlciA9PiB7XG4gICAgY29uc3QgeyBwcm9maWxlS2V5LCB1dWlkOiByYXdVdWlkIH0gPSBwcm9tb3RlUGVuZGluZ01lbWJlcjtcbiAgICBpZiAoIXByb2ZpbGVLZXkgfHwgIXJhd1V1aWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IHByb21vdGVQZW5kaW5nTWVtYmVyIGhhZCBhIG1pc3NpbmcgdmFsdWUnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHV1aWQgPSBVVUlELmNhc3QocmF3VXVpZCk7XG4gICAgY29uc3QgcHJldmlvdXNSZWNvcmQgPSBwZW5kaW5nTWVtYmVyc1t1dWlkXTtcblxuICAgIGlmIChwZW5kaW5nTWVtYmVyc1t1dWlkXSkge1xuICAgICAgZGVsZXRlIHBlbmRpbmdNZW1iZXJzW3V1aWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcHJvbW90ZSBwZW5kaW5nTWVtYmVyIGZhaWxlZDsgd2FzIG5vdCBpbiBwZW5kaW5nTWVtYmVycy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChtZW1iZXJzW3V1aWRdKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcHJvbW90ZSBwZW5kaW5nTWVtYmVyIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gbWVtYmVycy5gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lbWJlcnNbdXVpZF0gPSB7XG4gICAgICB1dWlkLFxuICAgICAgam9pbmVkQXRWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgcm9sZTogcHJldmlvdXNSZWNvcmQucm9sZSB8fCBNRU1CRVJfUk9MRV9FTlVNLkRFRkFVTFQsXG4gICAgfTtcblxuICAgIG5ld1Byb2ZpbGVLZXlzLnB1c2goe1xuICAgICAgcHJvZmlsZUtleSxcbiAgICAgIHV1aWQsXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIHByb21vdGVNZW1iZXJzUGVuZGluZ1BuaUFjaVByb2ZpbGVLZXk/OiBBcnJheTxcbiAgLy8gICBHcm91cENoYW5nZS5BY3Rpb25zLlByb21vdGVNZW1iZXJQZW5kaW5nUG5pQWNpUHJvZmlsZUtleUFjdGlvblxuICAvLyA+O1xuICAoYWN0aW9ucy5wcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5IHx8IFtdKS5mb3JFYWNoKFxuICAgIHByb21vdGVQZW5kaW5nTWVtYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgcHJvZmlsZUtleSwgYWNpLCBwbmkgfSA9IHByb21vdGVQZW5kaW5nTWVtYmVyO1xuICAgICAgaWYgKCFwcm9maWxlS2V5IHx8ICFhY2kgfHwgIXBuaSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IHByb21vdGVQZW5kaW5nTWVtYmVyIGhhZCBhIG1pc3NpbmcgdmFsdWUnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXZpb3VzUmVjb3JkID0gcGVuZGluZ01lbWJlcnNbcG5pXTtcblxuICAgICAgaWYgKHBlbmRpbmdNZW1iZXJzW3BuaV0pIHtcbiAgICAgICAgZGVsZXRlIHBlbmRpbmdNZW1iZXJzW3BuaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgYXBwbHlHcm91cENoYW5nZS8ke2xvZ0lkfTogQXR0ZW1wdCB0byBwcm9tb3RlIHBlbmRpbmdNZW1iZXIgZmFpbGVkOyB3YXMgbm90IGluIHBlbmRpbmdNZW1iZXJzLmBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lbWJlcnNbYWNpXSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgYXBwbHlHcm91cENoYW5nZS8ke2xvZ0lkfTogQXR0ZW1wdCB0byBwcm9tb3RlIHBlbmRpbmdNZW1iZXIgZmFpbGVkOyB3YXMgYWxyZWFkeSBpbiBtZW1iZXJzLmBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtZW1iZXJzW2FjaV0gPSB7XG4gICAgICAgIHV1aWQ6IGFjaSxcbiAgICAgICAgam9pbmVkQXRWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgICByb2xlOiBwcmV2aW91c1JlY29yZC5yb2xlIHx8IE1FTUJFUl9ST0xFX0VOVU0uREVGQVVMVCxcbiAgICAgIH07XG5cbiAgICAgIG5ld1Byb2ZpbGVLZXlzLnB1c2goe1xuICAgICAgICBwcm9maWxlS2V5LFxuICAgICAgICB1dWlkOiBhY2ksXG4gICAgICB9KTtcbiAgICB9XG4gICk7XG5cbiAgLy8gbW9kaWZ5VGl0bGU/OiBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeVRpdGxlQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlUaXRsZSkge1xuICAgIGNvbnN0IHsgdGl0bGUgfSA9IGFjdGlvbnMubW9kaWZ5VGl0bGU7XG4gICAgaWYgKHRpdGxlICYmIHRpdGxlLmNvbnRlbnQgPT09ICd0aXRsZScpIHtcbiAgICAgIHJlc3VsdC5uYW1lID0gZHJvcE51bGwodGl0bGUudGl0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IENsZWFyaW5nIGdyb3VwIHRpdGxlIGR1ZSB0byBtaXNzaW5nIGRhdGEuYFxuICAgICAgKTtcbiAgICAgIHJlc3VsdC5uYW1lID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1vZGlmeUF2YXRhcj86IEdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5QXZhdGFyQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlBdmF0YXIpIHtcbiAgICBjb25zdCB7IGF2YXRhciB9ID0gYWN0aW9ucy5tb2RpZnlBdmF0YXI7XG4gICAgYXdhaXQgYXBwbHlOZXdBdmF0YXIoZHJvcE51bGwoYXZhdGFyKSwgcmVzdWx0LCBsb2dJZCk7XG4gIH1cblxuICAvLyBtb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyPzpcbiAgLy8gICBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeURpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXJBY3Rpb247XG4gIGlmIChhY3Rpb25zLm1vZGlmeURpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXIpIHtcbiAgICBjb25zdCBkaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyOiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2IgfCB1bmRlZmluZWQgPVxuICAgICAgYWN0aW9ucy5tb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyLnRpbWVyO1xuICAgIGlmIChcbiAgICAgIGRpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXIgJiZcbiAgICAgIGRpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXIuY29udGVudCA9PT0gJ2Rpc2FwcGVhcmluZ01lc3NhZ2VzRHVyYXRpb24nXG4gICAgKSB7XG4gICAgICByZXN1bHQuZXhwaXJlVGltZXIgPSBkcm9wTnVsbChcbiAgICAgICAgZGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lci5kaXNhcHBlYXJpbmdNZXNzYWdlc0R1cmF0aW9uXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IENsZWFyaW5nIGdyb3VwIGV4cGlyZVRpbWVyIGR1ZSB0byBtaXNzaW5nIGRhdGEuYFxuICAgICAgKTtcbiAgICAgIHJlc3VsdC5leHBpcmVUaW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICByZXN1bHQuYWNjZXNzQ29udHJvbCA9IHJlc3VsdC5hY2Nlc3NDb250cm9sIHx8IHtcbiAgICBtZW1iZXJzOiBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgYXR0cmlidXRlczogQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgIGFkZEZyb21JbnZpdGVMaW5rOiBBQ0NFU1NfRU5VTS5VTlNBVElTRklBQkxFLFxuICB9O1xuXG4gIC8vIG1vZGlmeUF0dHJpYnV0ZXNBY2Nlc3M/OlxuICAvLyBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUF0dHJpYnV0ZXNBY2Nlc3NDb250cm9sQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlBdHRyaWJ1dGVzQWNjZXNzKSB7XG4gICAgcmVzdWx0LmFjY2Vzc0NvbnRyb2wgPSB7XG4gICAgICAuLi5yZXN1bHQuYWNjZXNzQ29udHJvbCxcbiAgICAgIGF0dHJpYnV0ZXM6XG4gICAgICAgIGFjdGlvbnMubW9kaWZ5QXR0cmlidXRlc0FjY2Vzcy5hdHRyaWJ1dGVzQWNjZXNzIHx8IEFDQ0VTU19FTlVNLk1FTUJFUixcbiAgICB9O1xuICB9XG5cbiAgLy8gbW9kaWZ5TWVtYmVyQWNjZXNzPzogR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJzQWNjZXNzQ29udHJvbEFjdGlvbjtcbiAgaWYgKGFjdGlvbnMubW9kaWZ5TWVtYmVyQWNjZXNzKSB7XG4gICAgcmVzdWx0LmFjY2Vzc0NvbnRyb2wgPSB7XG4gICAgICAuLi5yZXN1bHQuYWNjZXNzQ29udHJvbCxcbiAgICAgIG1lbWJlcnM6IGFjdGlvbnMubW9kaWZ5TWVtYmVyQWNjZXNzLm1lbWJlcnNBY2Nlc3MgfHwgQUNDRVNTX0VOVU0uTUVNQkVSLFxuICAgIH07XG4gIH1cblxuICAvLyBtb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2Vzcz86XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2Vzc0NvbnRyb2xBY3Rpb247XG4gIGlmIChhY3Rpb25zLm1vZGlmeUFkZEZyb21JbnZpdGVMaW5rQWNjZXNzKSB7XG4gICAgcmVzdWx0LmFjY2Vzc0NvbnRyb2wgPSB7XG4gICAgICAuLi5yZXN1bHQuYWNjZXNzQ29udHJvbCxcbiAgICAgIGFkZEZyb21JbnZpdGVMaW5rOlxuICAgICAgICBhY3Rpb25zLm1vZGlmeUFkZEZyb21JbnZpdGVMaW5rQWNjZXNzLmFkZEZyb21JbnZpdGVMaW5rQWNjZXNzIHx8XG4gICAgICAgIEFDQ0VTU19FTlVNLlVOU0FUSVNGSUFCTEUsXG4gICAgfTtcbiAgfVxuXG4gIC8vIGFkZE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscz86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuQWRkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxBY3Rpb25cbiAgLy8gPjtcbiAgKGFjdGlvbnMuYWRkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzIHx8IFtdKS5mb3JFYWNoKFxuICAgIHBlbmRpbmdBZG1pbkFwcHJvdmFsID0+IHtcbiAgICAgIGNvbnN0IHsgYWRkZWQgfSA9IHBlbmRpbmdBZG1pbkFwcHJvdmFsO1xuICAgICAgaWYgKCFhZGRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IG1vZGlmeU1lbWJlclByb2ZpbGVLZXkgaGFkIGEgbWlzc2luZyB2YWx1ZSdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFkZGVkVXVpZCA9IFVVSUQuY2FzdChhZGRlZC51c2VySWQpO1xuXG4gICAgICBpZiAobWVtYmVyc1thZGRlZFV1aWRdKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBdHRlbXB0IHRvIGFkZCBwZW5kaW5nIGFkbWluIGFwcHJvdmFsIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gbWVtYmVycy5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwZW5kaW5nTWVtYmVyc1thZGRlZFV1aWRdKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBdHRlbXB0IHRvIGFkZCBwZW5kaW5nIGFkbWluIGFwcHJvdmFsIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gcGVuZGluZ01lbWJlcnMuYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocGVuZGluZ0FkbWluQXBwcm92YWxNZW1iZXJzW2FkZGVkVXVpZF0pIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gYWRkIHBlbmRpbmcgYWRtaW4gYXBwcm92YWwgZmFpbGVkOyB3YXMgYWxyZWFkeSBpbiBwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnMuYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyc1thZGRlZFV1aWRdID0ge1xuICAgICAgICB1dWlkOiBhZGRlZFV1aWQsXG4gICAgICAgIHRpbWVzdGFtcDogYWRkZWQudGltZXN0YW1wLFxuICAgICAgfTtcblxuICAgICAgaWYgKGFkZGVkLnByb2ZpbGVLZXkpIHtcbiAgICAgICAgbmV3UHJvZmlsZUtleXMucHVzaCh7XG4gICAgICAgICAgcHJvZmlsZUtleTogYWRkZWQucHJvZmlsZUtleSxcbiAgICAgICAgICB1dWlkOiBhZGRlZFV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICAvLyBkZWxldGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHM/OiBBcnJheTxcbiAgLy8gICBHcm91cENoYW5nZS5BY3Rpb25zLkRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsQWN0aW9uXG4gIC8vID47XG4gIChhY3Rpb25zLmRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscyB8fCBbXSkuZm9yRWFjaChcbiAgICBkZWxldGVBZG1pbkFwcHJvdmFsID0+IHtcbiAgICAgIGNvbnN0IHsgZGVsZXRlZFVzZXJJZCB9ID0gZGVsZXRlQWRtaW5BcHByb3ZhbDtcbiAgICAgIGlmICghZGVsZXRlZFVzZXJJZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IGRlbGV0ZUFkbWluQXBwcm92YWwuZGVsZXRlZFVzZXJJZCBpcyBudWxsISdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVsZXRlZFV1aWQgPSBVVUlELmNhc3QoZGVsZXRlZFVzZXJJZCk7XG5cbiAgICAgIGlmIChwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnNbZGVsZXRlZFV1aWRdKSB7XG4gICAgICAgIGRlbGV0ZSBwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnNbZGVsZXRlZFV1aWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcmVtb3ZlIHBlbmRpbmdBZG1pbkFwcHJvdmFsIGZhaWxlZDsgd2FzIG5vdCBpbiBwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnMuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICAvLyBwcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5Qcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxBY3Rpb25cbiAgLy8gPjtcbiAgKGFjdGlvbnMucHJvbW90ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscyB8fCBbXSkuZm9yRWFjaChcbiAgICBwcm9tb3RlQWRtaW5BcHByb3ZhbCA9PiB7XG4gICAgICBjb25zdCB7IHVzZXJJZCwgcm9sZSB9ID0gcHJvbW90ZUFkbWluQXBwcm92YWw7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2FwcGx5R3JvdXBDaGFuZ2U6IHByb21vdGVBZG1pbkFwcHJvdmFsIGhhZCBhIG1pc3NpbmcgdmFsdWUnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZXJVdWlkID0gVVVJRC5jYXN0KHVzZXJJZCk7XG5cbiAgICAgIGlmIChwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnNbdXNlclV1aWRdKSB7XG4gICAgICAgIGRlbGV0ZSBwZW5kaW5nQWRtaW5BcHByb3ZhbE1lbWJlcnNbdXNlclV1aWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcHJvbW90ZSBwZW5kaW5nQWRtaW5BcHByb3ZhbCBmYWlsZWQ7IHdhcyBub3QgaW4gcGVuZGluZ0FkbWluQXBwcm92YWxNZW1iZXJzLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChwZW5kaW5nTWVtYmVyc1t1c2VyVXVpZF0pIHtcbiAgICAgICAgZGVsZXRlIHBlbmRpbmdBZG1pbkFwcHJvdmFsTWVtYmVyc1t1c2VyVXVpZF07XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBEZWxldGVkIHBlbmRpbmdBZG1pbkFwcHJvdmFsIGZyb20gcGVuZGluZ01lbWJlcnMuYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobWVtYmVyc1t1c2VyVXVpZF0pIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gcHJvbW90ZSBwZW5kaW5nTWVtYmVyIGZhaWxlZDsgd2FzIGFscmVhZHkgaW4gbWVtYmVycy5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbWVtYmVyc1t1c2VyVXVpZF0gPSB7XG4gICAgICAgIHV1aWQ6IHVzZXJVdWlkLFxuICAgICAgICBqb2luZWRBdFZlcnNpb246IHZlcnNpb24sXG4gICAgICAgIHJvbGU6IHJvbGUgfHwgTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxULFxuICAgICAgICBhcHByb3ZlZEJ5QWRtaW46IHRydWUsXG4gICAgICB9O1xuICAgIH1cbiAgKTtcblxuICAvLyBtb2RpZnlJbnZpdGVMaW5rUGFzc3dvcmQ/OiBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUludml0ZUxpbmtQYXNzd29yZEFjdGlvbjtcbiAgaWYgKGFjdGlvbnMubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkKSB7XG4gICAgY29uc3QgeyBpbnZpdGVMaW5rUGFzc3dvcmQgfSA9IGFjdGlvbnMubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkO1xuICAgIGlmIChpbnZpdGVMaW5rUGFzc3dvcmQpIHtcbiAgICAgIHJlc3VsdC5ncm91cEludml0ZUxpbmtQYXNzd29yZCA9IGludml0ZUxpbmtQYXNzd29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0Lmdyb3VwSW52aXRlTGlua1Bhc3N3b3JkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1vZGlmeURlc2NyaXB0aW9uPzogR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlEZXNjcmlwdGlvbkFjdGlvbjtcbiAgaWYgKGFjdGlvbnMubW9kaWZ5RGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCB7IGRlc2NyaXB0aW9uQnl0ZXMgfSA9IGFjdGlvbnMubW9kaWZ5RGVzY3JpcHRpb247XG4gICAgaWYgKGRlc2NyaXB0aW9uQnl0ZXMgJiYgZGVzY3JpcHRpb25CeXRlcy5jb250ZW50ID09PSAnZGVzY3JpcHRpb25UZXh0Jykge1xuICAgICAgcmVzdWx0LmRlc2NyaXB0aW9uID0gZHJvcE51bGwoZGVzY3JpcHRpb25CeXRlcy5kZXNjcmlwdGlvblRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IENsZWFyaW5nIGdyb3VwIGRlc2NyaXB0aW9uIGR1ZSB0byBtaXNzaW5nIGRhdGEuYFxuICAgICAgKTtcbiAgICAgIHJlc3VsdC5kZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9ucy5tb2RpZnlBbm5vdW5jZW1lbnRzT25seSkge1xuICAgIGNvbnN0IHsgYW5ub3VuY2VtZW50c09ubHkgfSA9IGFjdGlvbnMubW9kaWZ5QW5ub3VuY2VtZW50c09ubHk7XG4gICAgcmVzdWx0LmFubm91bmNlbWVudHNPbmx5ID0gYW5ub3VuY2VtZW50c09ubHk7XG4gIH1cblxuICBpZiAoYWN0aW9ucy5hZGRNZW1iZXJzQmFubmVkICYmIGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZC5sZW5ndGggPiAwKSB7XG4gICAgYWN0aW9ucy5hZGRNZW1iZXJzQmFubmVkLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgIGlmIChiYW5uZWRNZW1iZXJzLmhhcyhtZW1iZXIudXVpZCkpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGFwcGx5R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEF0dGVtcHQgdG8gYWRkIGJhbm5lZCBtZW1iZXIgZmFpbGVkOyB3YXMgYWxyZWFkeSBpbiBiYW5uZWQgbGlzdC5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYmFubmVkTWVtYmVycy5zZXQobWVtYmVyLnV1aWQsIG1lbWJlcik7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoYWN0aW9ucy5kZWxldGVNZW1iZXJzQmFubmVkICYmIGFjdGlvbnMuZGVsZXRlTWVtYmVyc0Jhbm5lZC5sZW5ndGggPiAwKSB7XG4gICAgYWN0aW9ucy5kZWxldGVNZW1iZXJzQmFubmVkLmZvckVhY2godXVpZCA9PiB7XG4gICAgICBpZiAoIWJhbm5lZE1lbWJlcnMuaGFzKHV1aWQpKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBhcHBseUdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBBdHRlbXB0IHRvIHJlbW92ZSBiYW5uZWQgbWVtYmVyIGZhaWxlZDsgd2FzIG5vdCBpbiBiYW5uZWQgbGlzdC5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYmFubmVkTWVtYmVycy5kZWxldGUodXVpZCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAob3VyQUNJKSB7XG4gICAgcmVzdWx0LmxlZnQgPSAhbWVtYmVyc1tvdXJBQ0ldO1xuICB9XG4gIGlmIChyZXN1bHQubGVmdCkge1xuICAgIHJlc3VsdC5hZGRlZEJ5ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gR28gZnJvbSBsb29rdXBzIGJhY2sgdG8gYXJyYXlzXG4gIHJlc3VsdC5tZW1iZXJzVjIgPSB2YWx1ZXMobWVtYmVycyk7XG4gIHJlc3VsdC5wZW5kaW5nTWVtYmVyc1YyID0gdmFsdWVzKHBlbmRpbmdNZW1iZXJzKTtcbiAgcmVzdWx0LnBlbmRpbmdBZG1pbkFwcHJvdmFsVjIgPSB2YWx1ZXMocGVuZGluZ0FkbWluQXBwcm92YWxNZW1iZXJzKTtcbiAgcmVzdWx0LmJhbm5lZE1lbWJlcnNWMiA9IEFycmF5LmZyb20oYmFubmVkTWVtYmVycy52YWx1ZXMoKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuZXdBdHRyaWJ1dGVzOiByZXN1bHQsXG4gICAgbmV3UHJvZmlsZUtleXMsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWNyeXB0R3JvdXBBdmF0YXIoXG4gIGF2YXRhcktleTogc3RyaW5nLFxuICBzZWNyZXRQYXJhbXNCYXNlNjQ6IHN0cmluZ1xuKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gIGNvbnN0IHNlbmRlciA9IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZztcbiAgaWYgKCFzZW5kZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZGVjcnlwdEdyb3VwQXZhdGFyOiB0ZXh0c2VjdXJlLm1lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlISdcbiAgICApO1xuICB9XG5cbiAgY29uc3QgY2lwaGVydGV4dCA9IGF3YWl0IHNlbmRlci5nZXRHcm91cEF2YXRhcihhdmF0YXJLZXkpO1xuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihzZWNyZXRQYXJhbXNCYXNlNjQpO1xuICBjb25zdCBwbGFpbnRleHQgPSBkZWNyeXB0R3JvdXBCbG9iKGNsaWVudFprR3JvdXBDaXBoZXIsIGNpcGhlcnRleHQpO1xuICBjb25zdCBibG9iID0gUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmRlY29kZShwbGFpbnRleHQpO1xuICBpZiAoYmxvYi5jb250ZW50ICE9PSAnYXZhdGFyJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBkZWNyeXB0R3JvdXBBdmF0YXI6IFJldHVybmVkIGJsb2IgaGFkIGluY29ycmVjdCBjb250ZW50OiAke2Jsb2IuY29udGVudH1gXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGF2YXRhciA9IGRyb3BOdWxsKGJsb2IuYXZhdGFyKTtcbiAgaWYgKCFhdmF0YXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY3J5cHRHcm91cEF2YXRhcjogUmV0dXJuZWQgYmxvYiBoYWQgbm8gYXZhdGFyIHNldCEnKTtcbiAgfVxuXG4gIHJldHVybiBhdmF0YXI7XG59XG5cbi8vIE92ZXdyaXRpbmcgcmVzdWx0LmF2YXRhciBhcyBwYXJ0IG9mIGZ1bmN0aW9uYWxpdHlcbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXBwbHlOZXdBdmF0YXIoXG4gIG5ld0F2YXRhcjogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICByZXN1bHQ6IFBpY2s8Q29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsICdhdmF0YXInIHwgJ3NlY3JldFBhcmFtcyc+LFxuICBsb2dJZDogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICAvLyBBdmF0YXIgaGFzIGJlZW4gZHJvcHBlZFxuICAgIGlmICghbmV3QXZhdGFyICYmIHJlc3VsdC5hdmF0YXIpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5kZWxldGVBdHRhY2htZW50RGF0YShyZXN1bHQuYXZhdGFyLnBhdGgpO1xuICAgICAgcmVzdWx0LmF2YXRhciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBHcm91cCBoYXMgYXZhdGFyOyBoYXMgaXQgY2hhbmdlZD9cbiAgICBpZiAobmV3QXZhdGFyICYmICghcmVzdWx0LmF2YXRhciB8fCByZXN1bHQuYXZhdGFyLnVybCAhPT0gbmV3QXZhdGFyKSkge1xuICAgICAgaWYgKCFyZXN1bHQuc2VjcmV0UGFyYW1zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYXBwbHlOZXdBdmF0YXI6IGdyb3VwIHdhcyBtaXNzaW5nIHNlY3JldFBhcmFtcyEnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRlY3J5cHRHcm91cEF2YXRhcihuZXdBdmF0YXIsIHJlc3VsdC5zZWNyZXRQYXJhbXMpO1xuICAgICAgY29uc3QgaGFzaCA9IGNvbXB1dGVIYXNoKGRhdGEpO1xuXG4gICAgICBpZiAocmVzdWx0LmF2YXRhcj8uaGFzaCA9PT0gaGFzaCkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgYXBwbHlOZXdBdmF0YXIvJHtsb2dJZH06IEhhc2ggaXMgdGhlIHNhbWUsIGJ1dCB1cmwgd2FzIGRpZmZlcmVudC4gU2F2aW5nIG5ldyB1cmwuYFxuICAgICAgICApO1xuICAgICAgICByZXN1bHQuYXZhdGFyID0ge1xuICAgICAgICAgIC4uLnJlc3VsdC5hdmF0YXIsXG4gICAgICAgICAgdXJsOiBuZXdBdmF0YXIsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdC5hdmF0YXIpIHtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZUF0dGFjaG1lbnREYXRhKHJlc3VsdC5hdmF0YXIucGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhdGggPSBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMud3JpdGVOZXdBdHRhY2htZW50RGF0YShkYXRhKTtcbiAgICAgIHJlc3VsdC5hdmF0YXIgPSB7XG4gICAgICAgIHVybDogbmV3QXZhdGFyLFxuICAgICAgICBwYXRoLFxuICAgICAgICBoYXNoLFxuICAgICAgfTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgYXBwbHlOZXdBdmF0YXIvJHtsb2dJZH0gRmFpbGVkIHRvIGhhbmRsZSBhdmF0YXIsIGNsZWFyaW5nIGl0YCxcbiAgICAgIGVycm9yLnN0YWNrXG4gICAgKTtcbiAgICBpZiAocmVzdWx0LmF2YXRhciAmJiByZXN1bHQuYXZhdGFyLnBhdGgpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5kZWxldGVBdHRhY2htZW50RGF0YShyZXN1bHQuYXZhdGFyLnBhdGgpO1xuICAgIH1cbiAgICByZXN1bHQuYXZhdGFyID0gdW5kZWZpbmVkO1xuICB9XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5cbmFzeW5jIGZ1bmN0aW9uIGFwcGx5R3JvdXBTdGF0ZSh7XG4gIGdyb3VwLFxuICBncm91cFN0YXRlLFxuICBzb3VyY2VVdWlkLFxufToge1xuICBncm91cDogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU7XG4gIGdyb3VwU3RhdGU6IERlY3J5cHRlZEdyb3VwU3RhdGU7XG4gIHNvdXJjZVV1aWQ/OiBVVUlEU3RyaW5nVHlwZTtcbn0pOiBQcm9taXNlPEdyb3VwQXBwbHlSZXN1bHRUeXBlPiB7XG4gIGNvbnN0IGxvZ0lkID0gaWRGb3JMb2dnaW5nKGdyb3VwLmdyb3VwSWQpO1xuICBjb25zdCBBQ0NFU1NfRU5VTSA9IFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQ7XG4gIGNvbnN0IE1FTUJFUl9ST0xFX0VOVU0gPSBQcm90by5NZW1iZXIuUm9sZTtcbiAgY29uc3QgdmVyc2lvbiA9IGdyb3VwU3RhdGUudmVyc2lvbiB8fCAwO1xuICBjb25zdCByZXN1bHQgPSB7IC4uLmdyb3VwIH07XG4gIGNvbnN0IG5ld1Byb2ZpbGVLZXlzOiBBcnJheTxHcm91cENoYW5nZU1lbWJlclR5cGU+ID0gW107XG5cbiAgLy8gdmVyc2lvblxuICByZXN1bHQucmV2aXNpb24gPSB2ZXJzaW9uO1xuXG4gIC8vIHRpdGxlXG4gIC8vIE5vdGU6IER1cmluZyBkZWNyeXB0aW9uLCB0aXRsZSBiZWNvbWVzIGEgR3JvdXBBdHRyaWJ1dGVCbG9iXG4gIGNvbnN0IHsgdGl0bGUgfSA9IGdyb3VwU3RhdGU7XG4gIGlmICh0aXRsZSAmJiB0aXRsZS5jb250ZW50ID09PSAndGl0bGUnKSB7XG4gICAgcmVzdWx0Lm5hbWUgPSBkcm9wTnVsbCh0aXRsZS50aXRsZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0Lm5hbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBhdmF0YXJcbiAgYXdhaXQgYXBwbHlOZXdBdmF0YXIoZHJvcE51bGwoZ3JvdXBTdGF0ZS5hdmF0YXIpLCByZXN1bHQsIGxvZ0lkKTtcblxuICAvLyBkaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyXG4gIC8vIE5vdGU6IGR1cmluZyBkZWNyeXB0aW9uLCBkaXNhcHBlYXJpbmdNZXNzYWdlVGltZXIgYmVjb21lcyBhIEdyb3VwQXR0cmlidXRlQmxvYlxuICBjb25zdCB7IGRpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXIgfSA9IGdyb3VwU3RhdGU7XG4gIGlmIChcbiAgICBkaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyICYmXG4gICAgZGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lci5jb250ZW50ID09PSAnZGlzYXBwZWFyaW5nTWVzc2FnZXNEdXJhdGlvbidcbiAgKSB7XG4gICAgcmVzdWx0LmV4cGlyZVRpbWVyID0gZHJvcE51bGwoXG4gICAgICBkaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyLmRpc2FwcGVhcmluZ01lc3NhZ2VzRHVyYXRpb25cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5leHBpcmVUaW1lciA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIGFjY2Vzc0NvbnRyb2xcbiAgY29uc3QgeyBhY2Nlc3NDb250cm9sIH0gPSBncm91cFN0YXRlO1xuICByZXN1bHQuYWNjZXNzQ29udHJvbCA9IHtcbiAgICBhdHRyaWJ1dGVzOlxuICAgICAgKGFjY2Vzc0NvbnRyb2wgJiYgYWNjZXNzQ29udHJvbC5hdHRyaWJ1dGVzKSB8fCBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgbWVtYmVyczogKGFjY2Vzc0NvbnRyb2wgJiYgYWNjZXNzQ29udHJvbC5tZW1iZXJzKSB8fCBBQ0NFU1NfRU5VTS5NRU1CRVIsXG4gICAgYWRkRnJvbUludml0ZUxpbms6XG4gICAgICAoYWNjZXNzQ29udHJvbCAmJiBhY2Nlc3NDb250cm9sLmFkZEZyb21JbnZpdGVMaW5rKSB8fFxuICAgICAgQUNDRVNTX0VOVU0uVU5TQVRJU0ZJQUJMRSxcbiAgfTtcblxuICAvLyBPcHRpbWl6YXRpb246IHdlIGFzc3VtZSB3ZSBoYXZlIGxlZnQgdGhlIGdyb3VwIHVubGVzcyB3ZSBhcmUgZm91bmQgaW4gbWVtYmVyc1xuICByZXN1bHQubGVmdCA9IHRydWU7XG4gIGNvbnN0IG91ckFDSSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKS50b1N0cmluZygpO1xuXG4gIC8vIG1lbWJlcnNcbiAgY29uc3Qgd2FzUHJldmlvdXNseUFNZW1iZXIgPSAocmVzdWx0Lm1lbWJlcnNWMiB8fCBbXSkuc29tZShcbiAgICBpdGVtID0+IGl0ZW0udXVpZCAhPT0gb3VyQUNJXG4gICk7XG4gIGlmIChncm91cFN0YXRlLm1lbWJlcnMpIHtcbiAgICByZXN1bHQubWVtYmVyc1YyID0gZ3JvdXBTdGF0ZS5tZW1iZXJzLm1hcChtZW1iZXIgPT4ge1xuICAgICAgaWYgKG1lbWJlci51c2VySWQgPT09IG91ckFDSSkge1xuICAgICAgICByZXN1bHQubGVmdCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIENhcHR1cmUgd2hvIGFkZGVkIHVzIGlmIHdlIHdlcmUgcHJldmlvdXNseSBub3QgaW4gZ3JvdXBcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNvdXJjZVV1aWQgJiZcbiAgICAgICAgICAhd2FzUHJldmlvdXNseUFNZW1iZXIgJiZcbiAgICAgICAgICBpc051bWJlcihtZW1iZXIuam9pbmVkQXRWZXJzaW9uKSAmJlxuICAgICAgICAgIG1lbWJlci5qb2luZWRBdFZlcnNpb24gPT09IHZlcnNpb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgcmVzdWx0LmFkZGVkQnkgPSBzb3VyY2VVdWlkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWYWxpZFJvbGUobWVtYmVyLnJvbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgYXBwbHlHcm91cFN0YXRlOiBNZW1iZXIgaGFkIGludmFsaWQgcm9sZSAke21lbWJlci5yb2xlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lbWJlci5wcm9maWxlS2V5KSB7XG4gICAgICAgIG5ld1Byb2ZpbGVLZXlzLnB1c2goe1xuICAgICAgICAgIHByb2ZpbGVLZXk6IG1lbWJlci5wcm9maWxlS2V5LFxuICAgICAgICAgIHV1aWQ6IFVVSUQuY2FzdChtZW1iZXIudXNlcklkKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvbGU6IG1lbWJlci5yb2xlIHx8IE1FTUJFUl9ST0xFX0VOVU0uREVGQVVMVCxcbiAgICAgICAgam9pbmVkQXRWZXJzaW9uOiBtZW1iZXIuam9pbmVkQXRWZXJzaW9uIHx8IHZlcnNpb24sXG4gICAgICAgIHV1aWQ6IFVVSUQuY2FzdChtZW1iZXIudXNlcklkKSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBtZW1iZXJzUGVuZGluZ1Byb2ZpbGVLZXlcbiAgaWYgKGdyb3VwU3RhdGUubWVtYmVyc1BlbmRpbmdQcm9maWxlS2V5KSB7XG4gICAgcmVzdWx0LnBlbmRpbmdNZW1iZXJzVjIgPSBncm91cFN0YXRlLm1lbWJlcnNQZW5kaW5nUHJvZmlsZUtleS5tYXAoXG4gICAgICBtZW1iZXIgPT4ge1xuICAgICAgICBpZiAoIW1lbWJlci5tZW1iZXIgfHwgIW1lbWJlci5tZW1iZXIudXNlcklkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ2FwcGx5R3JvdXBTdGF0ZTogTWVtYmVyIHBlbmRpbmcgcHJvZmlsZSBrZXkgZGlkIG5vdCBoYXZlIGFuIGFzc29jaWF0ZWQgdXNlcklkJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1lbWJlci5hZGRlZEJ5VXNlcklkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ2FwcGx5R3JvdXBTdGF0ZTogTWVtYmVyIHBlbmRpbmcgcHJvZmlsZSBrZXkgZGlkIG5vdCBoYXZlIGFuIGFkZGVkQnlVc2VySUQnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNWYWxpZFJvbGUobWVtYmVyLm1lbWJlci5yb2xlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBhcHBseUdyb3VwU3RhdGU6IE1lbWJlciBwZW5kaW5nIHByb2ZpbGUga2V5IGhhZCBpbnZhbGlkIHJvbGUgJHttZW1iZXIubWVtYmVyLnJvbGV9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLm1lbWJlci5wcm9maWxlS2V5KSB7XG4gICAgICAgICAgbmV3UHJvZmlsZUtleXMucHVzaCh7XG4gICAgICAgICAgICBwcm9maWxlS2V5OiBtZW1iZXIubWVtYmVyLnByb2ZpbGVLZXksXG4gICAgICAgICAgICB1dWlkOiBVVUlELmNhc3QobWVtYmVyLm1lbWJlci51c2VySWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhZGRlZEJ5VXNlcklkOiBVVUlELmNhc3QobWVtYmVyLmFkZGVkQnlVc2VySWQpLFxuICAgICAgICAgIHV1aWQ6IFVVSUQuY2FzdChtZW1iZXIubWVtYmVyLnVzZXJJZCksXG4gICAgICAgICAgdGltZXN0YW1wOiBtZW1iZXIudGltZXN0YW1wLFxuICAgICAgICAgIHJvbGU6IG1lbWJlci5tZW1iZXIucm9sZSB8fCBNRU1CRVJfUk9MRV9FTlVNLkRFRkFVTFQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIC8vIG1lbWJlcnNQZW5kaW5nQWRtaW5BcHByb3ZhbFxuICBpZiAoZ3JvdXBTdGF0ZS5tZW1iZXJzUGVuZGluZ0FkbWluQXBwcm92YWwpIHtcbiAgICByZXN1bHQucGVuZGluZ0FkbWluQXBwcm92YWxWMiA9IGdyb3VwU3RhdGUubWVtYmVyc1BlbmRpbmdBZG1pbkFwcHJvdmFsLm1hcChcbiAgICAgIG1lbWJlciA9PiB7XG4gICAgICAgIGlmIChtZW1iZXIucHJvZmlsZUtleSkge1xuICAgICAgICAgIG5ld1Byb2ZpbGVLZXlzLnB1c2goe1xuICAgICAgICAgICAgcHJvZmlsZUtleTogbWVtYmVyLnByb2ZpbGVLZXksXG4gICAgICAgICAgICB1dWlkOiBVVUlELmNhc3QobWVtYmVyLnVzZXJJZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHV1aWQ6IFVVSUQuY2FzdChtZW1iZXIudXNlcklkKSxcbiAgICAgICAgICB0aW1lc3RhbXA6IG1lbWJlci50aW1lc3RhbXAsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIC8vIGludml0ZUxpbmtQYXNzd29yZFxuICBjb25zdCB7IGludml0ZUxpbmtQYXNzd29yZCB9ID0gZ3JvdXBTdGF0ZTtcbiAgaWYgKGludml0ZUxpbmtQYXNzd29yZCkge1xuICAgIHJlc3VsdC5ncm91cEludml0ZUxpbmtQYXNzd29yZCA9IGludml0ZUxpbmtQYXNzd29yZDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQuZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBkZXNjcmlwdGlvbkJ5dGVzXG4gIGNvbnN0IHsgZGVzY3JpcHRpb25CeXRlcyB9ID0gZ3JvdXBTdGF0ZTtcbiAgaWYgKGRlc2NyaXB0aW9uQnl0ZXMgJiYgZGVzY3JpcHRpb25CeXRlcy5jb250ZW50ID09PSAnZGVzY3JpcHRpb25UZXh0Jykge1xuICAgIHJlc3VsdC5kZXNjcmlwdGlvbiA9IGRyb3BOdWxsKGRlc2NyaXB0aW9uQnl0ZXMuZGVzY3JpcHRpb25UZXh0KTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQuZGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBhbm5vdW5jZW1lbnRzT25seVxuICByZXN1bHQuYW5ub3VuY2VtZW50c09ubHkgPSBncm91cFN0YXRlLmFubm91bmNlbWVudHNPbmx5O1xuXG4gIC8vIG1lbWJlcnNCYW5uZWRcbiAgcmVzdWx0LmJhbm5lZE1lbWJlcnNWMiA9IGdyb3VwU3RhdGUubWVtYmVyc0Jhbm5lZDtcblxuICBpZiAocmVzdWx0LmxlZnQpIHtcbiAgICByZXN1bHQuYWRkZWRCeSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmV3QXR0cmlidXRlczogcmVzdWx0LFxuICAgIG5ld1Byb2ZpbGVLZXlzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkUm9sZShyb2xlPzogbnVtYmVyKTogcm9sZSBpcyBudW1iZXIge1xuICBjb25zdCBNRU1CRVJfUk9MRV9FTlVNID0gUHJvdG8uTWVtYmVyLlJvbGU7XG5cbiAgcmV0dXJuIChcbiAgICByb2xlID09PSBNRU1CRVJfUk9MRV9FTlVNLkFETUlOSVNUUkFUT1IgfHwgcm9sZSA9PT0gTUVNQkVSX1JPTEVfRU5VTS5ERUZBVUxUXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRBY2Nlc3MoYWNjZXNzPzogbnVtYmVyKTogYWNjZXNzIGlzIG51bWJlciB7XG4gIGNvbnN0IEFDQ0VTU19FTlVNID0gUHJvdG8uQWNjZXNzQ29udHJvbC5BY2Nlc3NSZXF1aXJlZDtcblxuICByZXR1cm4gYWNjZXNzID09PSBBQ0NFU1NfRU5VTS5BRE1JTklTVFJBVE9SIHx8IGFjY2VzcyA9PT0gQUNDRVNTX0VOVU0uTUVNQkVSO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkTGlua0FjY2VzcyhhY2Nlc3M/OiBudW1iZXIpOiBhY2Nlc3MgaXMgbnVtYmVyIHtcbiAgY29uc3QgQUNDRVNTX0VOVU0gPSBQcm90by5BY2Nlc3NDb250cm9sLkFjY2Vzc1JlcXVpcmVkO1xuXG4gIHJldHVybiAoXG4gICAgYWNjZXNzID09PSBBQ0NFU1NfRU5VTS5VTktOT1dOIHx8XG4gICAgYWNjZXNzID09PSBBQ0NFU1NfRU5VTS5BTlkgfHxcbiAgICBhY2Nlc3MgPT09IEFDQ0VTU19FTlVNLkFETUlOSVNUUkFUT1IgfHxcbiAgICBhY2Nlc3MgPT09IEFDQ0VTU19FTlVNLlVOU0FUSVNGSUFCTEVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFByb2ZpbGVLZXkoYnVmZmVyPzogVWludDhBcnJheSk6IGJvb2xlYW4ge1xuICByZXR1cm4gQm9vbGVhbihidWZmZXIgJiYgYnVmZmVyLmxlbmd0aCA9PT0gMzIpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUaW1lc3RhbXAodGltZXN0YW1wOiBMb25nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghdGltZXN0YW1wKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBhc051bWJlciA9IHRpbWVzdGFtcC50b051bWJlcigpO1xuXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGlmICghYXNOdW1iZXIgfHwgYXNOdW1iZXIgPiBub3cpIHtcbiAgICByZXR1cm4gbm93O1xuICB9XG5cbiAgcmV0dXJuIGFzTnVtYmVyO1xufVxuXG50eXBlIERlY3J5cHRlZEdyb3VwQ2hhbmdlQWN0aW9ucyA9IHtcbiAgdmVyc2lvbj86IG51bWJlcjtcbiAgc291cmNlVXVpZD86IFVVSURTdHJpbmdUeXBlO1xuICBhZGRNZW1iZXJzPzogUmVhZG9ubHlBcnJheTx7XG4gICAgYWRkZWQ6IERlY3J5cHRlZE1lbWJlcjtcbiAgICBqb2luRnJvbUludml0ZUxpbms6IGJvb2xlYW47XG4gIH0+O1xuICBkZWxldGVNZW1iZXJzPzogUmVhZG9ubHlBcnJheTx7XG4gICAgZGVsZXRlZFVzZXJJZDogc3RyaW5nO1xuICB9PjtcbiAgbW9kaWZ5TWVtYmVyUm9sZXM/OiBSZWFkb25seUFycmF5PHtcbiAgICB1c2VySWQ6IHN0cmluZztcbiAgICByb2xlOiBQcm90by5NZW1iZXIuUm9sZTtcbiAgfT47XG4gIG1vZGlmeU1lbWJlclByb2ZpbGVLZXlzPzogUmVhZG9ubHlBcnJheTx7XG4gICAgcHJvZmlsZUtleTogVWludDhBcnJheTtcbiAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgfT47XG4gIGFkZFBlbmRpbmdNZW1iZXJzPzogUmVhZG9ubHlBcnJheTx7XG4gICAgYWRkZWQ6IERlY3J5cHRlZE1lbWJlclBlbmRpbmdQcm9maWxlS2V5O1xuICB9PjtcbiAgZGVsZXRlUGVuZGluZ01lbWJlcnM/OiBSZWFkb25seUFycmF5PHtcbiAgICBkZWxldGVkVXNlcklkOiBzdHJpbmc7XG4gIH0+O1xuICBwcm9tb3RlUGVuZGluZ01lbWJlcnM/OiBSZWFkb25seUFycmF5PHtcbiAgICBwcm9maWxlS2V5OiBVaW50OEFycmF5O1xuICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICB9PjtcbiAgcHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleT86IFJlYWRvbmx5QXJyYXk8e1xuICAgIHByb2ZpbGVLZXk6IFVpbnQ4QXJyYXk7XG4gICAgYWNpOiBVVUlEU3RyaW5nVHlwZTtcbiAgICBwbmk6IFVVSURTdHJpbmdUeXBlO1xuICB9PjtcbiAgbW9kaWZ5VGl0bGU/OiB7XG4gICAgdGl0bGU/OiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2I7XG4gIH07XG4gIG1vZGlmeURpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXI/OiB7XG4gICAgdGltZXI/OiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2I7XG4gIH07XG4gIGFkZE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscz86IFJlYWRvbmx5QXJyYXk8e1xuICAgIGFkZGVkOiBEZWNyeXB0ZWRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbDtcbiAgfT47XG4gIGRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscz86IFJlYWRvbmx5QXJyYXk8e1xuICAgIGRlbGV0ZWRVc2VySWQ6IHN0cmluZztcbiAgfT47XG4gIHByb21vdGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHM/OiBSZWFkb25seUFycmF5PHtcbiAgICB1c2VySWQ6IHN0cmluZztcbiAgICByb2xlOiBQcm90by5NZW1iZXIuUm9sZTtcbiAgfT47XG4gIG1vZGlmeUludml0ZUxpbmtQYXNzd29yZD86IHtcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQ/OiBzdHJpbmc7XG4gIH07XG4gIG1vZGlmeURlc2NyaXB0aW9uPzoge1xuICAgIGRlc2NyaXB0aW9uQnl0ZXM/OiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2I7XG4gIH07XG4gIG1vZGlmeUFubm91bmNlbWVudHNPbmx5Pzoge1xuICAgIGFubm91bmNlbWVudHNPbmx5OiBib29sZWFuO1xuICB9O1xuICBhZGRNZW1iZXJzQmFubmVkPzogUmVhZG9ubHlBcnJheTxHcm91cFYyQmFubmVkTWVtYmVyVHlwZT47XG4gIGRlbGV0ZU1lbWJlcnNCYW5uZWQ/OiBSZWFkb25seUFycmF5PFVVSURTdHJpbmdUeXBlPjtcbn0gJiBQaWNrPFxuICBQcm90by5Hcm91cENoYW5nZS5JQWN0aW9ucyxcbiAgfCAnbW9kaWZ5QXR0cmlidXRlc0FjY2VzcydcbiAgfCAnbW9kaWZ5TWVtYmVyQWNjZXNzJ1xuICB8ICdtb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2VzcydcbiAgfCAnbW9kaWZ5QXZhdGFyJ1xuPjtcblxuZnVuY3Rpb24gZGVjcnlwdEdyb3VwQ2hhbmdlKFxuICBhY3Rpb25zOiBSZWFkb25seTxQcm90by5Hcm91cENoYW5nZS5JQWN0aW9ucz4sXG4gIGdyb3VwU2VjcmV0UGFyYW1zOiBzdHJpbmcsXG4gIGxvZ0lkOiBzdHJpbmdcbik6IERlY3J5cHRlZEdyb3VwQ2hhbmdlQWN0aW9ucyB7XG4gIGNvbnN0IHJlc3VsdDogRGVjcnlwdGVkR3JvdXBDaGFuZ2VBY3Rpb25zID0ge1xuICAgIHZlcnNpb246IGRyb3BOdWxsKGFjdGlvbnMudmVyc2lvbiksXG4gIH07XG5cbiAgY29uc3QgY2xpZW50WmtHcm91cENpcGhlciA9IGdldENsaWVudFprR3JvdXBDaXBoZXIoZ3JvdXBTZWNyZXRQYXJhbXMpO1xuXG4gIGlmIChhY3Rpb25zLnNvdXJjZVV1aWQgJiYgYWN0aW9ucy5zb3VyY2VVdWlkLmxlbmd0aCAhPT0gMCkge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQuc291cmNlVXVpZCA9IFVVSUQuY2FzdChcbiAgICAgICAgbm9ybWFsaXplVXVpZChcbiAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBhY3Rpb25zLnNvdXJjZVV1aWQpLFxuICAgICAgICAgICdhY3Rpb25zLnNvdXJjZVV1aWQnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBVbmFibGUgdG8gZGVjcnlwdCBzb3VyY2VVdWlkLmAsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVmFsaWRVdWlkKHJlc3VsdC5zb3VyY2VVdWlkKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IEludmFsaWQgc291cmNlVXVpZC4gQ2xlYXJpbmcgc291cmNlVXVpZC5gXG4gICAgICApO1xuICAgICAgcmVzdWx0LnNvdXJjZVV1aWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdEdyb3VwQ2hhbmdlOiBNaXNzaW5nIHNvdXJjZVV1aWQnKTtcbiAgfVxuXG4gIC8vIGFkZE1lbWJlcnM/OiBBcnJheTxHcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlckFjdGlvbj47XG4gIHJlc3VsdC5hZGRNZW1iZXJzID0gY29tcGFjdChcbiAgICAoYWN0aW9ucy5hZGRNZW1iZXJzIHx8IFtdKS5tYXAoYWRkTWVtYmVyID0+IHtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgYWRkTWVtYmVyLmFkZGVkLFxuICAgICAgICAnZGVjcnlwdEdyb3VwQ2hhbmdlOiBBZGRNZW1iZXIgd2FzIG1pc3NpbmcgYWRkZWQgZmllbGQhJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IGRlY3J5cHRlZCA9IGRlY3J5cHRNZW1iZXIoXG4gICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgIGFkZE1lbWJlci5hZGRlZCxcbiAgICAgICAgbG9nSWRcbiAgICAgICk7XG4gICAgICBpZiAoIWRlY3J5cHRlZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWRkZWQ6IGRlY3J5cHRlZCxcbiAgICAgICAgam9pbkZyb21JbnZpdGVMaW5rOiBCb29sZWFuKGFkZE1lbWJlci5qb2luRnJvbUludml0ZUxpbmspLFxuICAgICAgfTtcbiAgICB9KVxuICApO1xuXG4gIC8vIGRlbGV0ZU1lbWJlcnM/OiBBcnJheTxHcm91cENoYW5nZS5BY3Rpb25zLkRlbGV0ZU1lbWJlckFjdGlvbj47XG4gIHJlc3VsdC5kZWxldGVNZW1iZXJzID0gY29tcGFjdChcbiAgICAoYWN0aW9ucy5kZWxldGVNZW1iZXJzIHx8IFtdKS5tYXAoZGVsZXRlTWVtYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgZGVsZXRlZFVzZXJJZCB9ID0gZGVsZXRlTWVtYmVyO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBCeXRlcy5pc05vdEVtcHR5KGRlbGV0ZWRVc2VySWQpLFxuICAgICAgICAnZGVjcnlwdEdyb3VwQ2hhbmdlOiBkZWxldGVNZW1iZXIuZGVsZXRlZFVzZXJJZCB3YXMgbWlzc2luZydcbiAgICAgICk7XG5cbiAgICAgIGxldCB1c2VySWQ6IHN0cmluZztcbiAgICAgIHRyeSB7XG4gICAgICAgIHVzZXJJZCA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgICAgZGVjcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgZGVsZXRlZFVzZXJJZCksXG4gICAgICAgICAgJ2FjdGlvbnMuZGVsZXRlTWVtYmVycy5kZWxldGVkVXNlcklkJ1xuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgZGVsZXRlTWVtYmVycy5kZWxldGVkVXNlcklkLiBEcm9wcGluZyBtZW1iZXIuYCxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWYWxpZFV1aWQodXNlcklkKSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBEcm9wcGluZyBkZWxldGVNZW1iZXIgZHVlIHRvIGludmFsaWQgdXNlcklkYFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBkZWxldGVkVXNlcklkOiB1c2VySWQgfTtcbiAgICB9KVxuICApO1xuXG4gIC8vIG1vZGlmeU1lbWJlclJvbGVzPzogQXJyYXk8R3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJSb2xlQWN0aW9uPjtcbiAgcmVzdWx0Lm1vZGlmeU1lbWJlclJvbGVzID0gY29tcGFjdChcbiAgICAoYWN0aW9ucy5tb2RpZnlNZW1iZXJSb2xlcyB8fCBbXSkubWFwKG1vZGlmeU1lbWJlciA9PiB7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIEJ5dGVzLmlzTm90RW1wdHkobW9kaWZ5TWVtYmVyLnVzZXJJZCksXG4gICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IG1vZGlmeU1lbWJlclJvbGUudXNlcklkIHdhcyBtaXNzaW5nJ1xuICAgICAgKTtcblxuICAgICAgbGV0IHVzZXJJZDogc3RyaW5nO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBtb2RpZnlNZW1iZXIudXNlcklkKSxcbiAgICAgICAgICAnYWN0aW9ucy5tb2RpZnlNZW1iZXJSb2xlcy51c2VySWQnXG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlLyR7bG9nSWR9OiBVbmFibGUgdG8gZGVjcnlwdCBtb2RpZnlNZW1iZXJSb2xlLnVzZXJJZC4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVmFsaWRVdWlkKHVzZXJJZCkpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogRHJvcHBpbmcgbW9kaWZ5TWVtYmVyUm9sZSBkdWUgdG8gaW52YWxpZCB1c2VySWRgXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvbGUgPSBkcm9wTnVsbChtb2RpZnlNZW1iZXIucm9sZSk7XG4gICAgICBpZiAoIWlzVmFsaWRSb2xlKHJvbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlOiBtb2RpZnlNZW1iZXJSb2xlIGhhZCBpbnZhbGlkIHJvbGUgJHttb2RpZnlNZW1iZXIucm9sZX1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvbGUsXG4gICAgICAgIHVzZXJJZCxcbiAgICAgIH07XG4gICAgfSlcbiAgKTtcblxuICAvLyBtb2RpZnlNZW1iZXJQcm9maWxlS2V5cz86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5TWVtYmVyUHJvZmlsZUtleUFjdGlvblxuICAvLyA+O1xuICByZXN1bHQubW9kaWZ5TWVtYmVyUHJvZmlsZUtleXMgPSBjb21wYWN0KFxuICAgIChhY3Rpb25zLm1vZGlmeU1lbWJlclByb2ZpbGVLZXlzIHx8IFtdKS5tYXAobW9kaWZ5TWVtYmVyUHJvZmlsZUtleSA9PiB7XG4gICAgICBsZXQgeyB1c2VySWQsIHByb2ZpbGVLZXk6IGVuY3J5cHRlZFByb2ZpbGVLZXkgfSA9IG1vZGlmeU1lbWJlclByb2ZpbGVLZXk7XG5cbiAgICAgIC8vIFRPRE86IERFU0tUT1AtMzgxNlxuICAgICAgaWYgKEJ5dGVzLmlzRW1wdHkodXNlcklkKSB8fCBCeXRlcy5pc0VtcHR5KGVuY3J5cHRlZFByb2ZpbGVLZXkpKSB7XG4gICAgICAgIGNvbnN0IHsgcHJlc2VudGF0aW9uIH0gPSBtb2RpZnlNZW1iZXJQcm9maWxlS2V5O1xuXG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHByZXNlbnRhdGlvbiksXG4gICAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogbW9kaWZ5TWVtYmVyUHJvZmlsZUtleXMucHJlc2VudGF0aW9uIHdhcyBtaXNzaW5nJ1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGRlY29kZWRQcmVzZW50YXRpb24gPVxuICAgICAgICAgIGRlY29kZVByb2ZpbGVLZXlDcmVkZW50aWFsUHJlc2VudGF0aW9uKHByZXNlbnRhdGlvbik7XG5cbiAgICAgICAgKHsgdXNlcklkLCBwcm9maWxlS2V5OiBlbmNyeXB0ZWRQcm9maWxlS2V5IH0gPSBkZWNvZGVkUHJlc2VudGF0aW9uKTtcbiAgICAgIH1cblxuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHVzZXJJZCksXG4gICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IG1vZGlmeU1lbWJlclByb2ZpbGVLZXlzLnVzZXJJZCB3YXMgbWlzc2luZydcbiAgICAgICk7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIEJ5dGVzLmlzTm90RW1wdHkoZW5jcnlwdGVkUHJvZmlsZUtleSksXG4gICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IG1vZGlmeU1lbWJlclByb2ZpbGVLZXlzLnByb2ZpbGVLZXkgd2FzIG1pc3NpbmcnXG4gICAgICApO1xuXG4gICAgICBsZXQgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gICAgICBsZXQgcHJvZmlsZUtleTogVWludDhBcnJheTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHV1aWQgPSBub3JtYWxpemVVdWlkKFxuICAgICAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHVzZXJJZCksXG4gICAgICAgICAgJ2FjdGlvbnMubW9kaWZ5TWVtYmVyUHJvZmlsZUtleXMudXNlcklkJ1xuICAgICAgICApO1xuXG4gICAgICAgIHByb2ZpbGVLZXkgPSBkZWNyeXB0UHJvZmlsZUtleShcbiAgICAgICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgICAgIGVuY3J5cHRlZFByb2ZpbGVLZXksXG4gICAgICAgICAgdXVpZFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgYCArXG4gICAgICAgICAgICAnbW9kaWZ5TWVtYmVyUHJvZmlsZUtleXMudXNlcklkL3Byb2ZpbGVLZXkuIERyb3BwaW5nIG1lbWJlci4nLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWYWxpZFByb2ZpbGVLZXkocHJvZmlsZUtleSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IG1vZGlmeU1lbWJlclByb2ZpbGVLZXkgaGFkIGludmFsaWQgcHJvZmlsZUtleSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdXVpZCwgcHJvZmlsZUtleSB9O1xuICAgIH0pXG4gICk7XG5cbiAgLy8gYWRkUGVuZGluZ01lbWJlcnM/OiBBcnJheTxcbiAgLy8gICBHcm91cENoYW5nZS5BY3Rpb25zLkFkZE1lbWJlclBlbmRpbmdQcm9maWxlS2V5QWN0aW9uXG4gIC8vID47XG4gIHJlc3VsdC5hZGRQZW5kaW5nTWVtYmVycyA9IGNvbXBhY3QoXG4gICAgKGFjdGlvbnMuYWRkUGVuZGluZ01lbWJlcnMgfHwgW10pLm1hcChhZGRQZW5kaW5nTWVtYmVyID0+IHtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgYWRkUGVuZGluZ01lbWJlci5hZGRlZCxcbiAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogYWRkUGVuZGluZ01lbWJlciB3YXMgbWlzc2luZyBhZGRlZCBmaWVsZCEnXG4gICAgICApO1xuICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5KFxuICAgICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgICBhZGRQZW5kaW5nTWVtYmVyLmFkZGVkLFxuICAgICAgICBsb2dJZFxuICAgICAgKTtcbiAgICAgIGlmICghZGVjcnlwdGVkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhZGRlZDogZGVjcnlwdGVkLFxuICAgICAgfTtcbiAgICB9KVxuICApO1xuXG4gIC8vIGRlbGV0ZVBlbmRpbmdNZW1iZXJzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5EZWxldGVNZW1iZXJQZW5kaW5nUHJvZmlsZUtleUFjdGlvblxuICAvLyA+O1xuICByZXN1bHQuZGVsZXRlUGVuZGluZ01lbWJlcnMgPSBjb21wYWN0KFxuICAgIChhY3Rpb25zLmRlbGV0ZVBlbmRpbmdNZW1iZXJzIHx8IFtdKS5tYXAoZGVsZXRlUGVuZGluZ01lbWJlciA9PiB7XG4gICAgICBjb25zdCB7IGRlbGV0ZWRVc2VySWQgfSA9IGRlbGV0ZVBlbmRpbmdNZW1iZXI7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIEJ5dGVzLmlzTm90RW1wdHkoZGVsZXRlZFVzZXJJZCksXG4gICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IGRlbGV0ZVBlbmRpbmdNZW1iZXJzLmRlbGV0ZWRVc2VySWQgd2FzIG1pc3NpbmcnXG4gICAgICApO1xuICAgICAgbGV0IHVzZXJJZDogc3RyaW5nO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBkZWxldGVkVXNlcklkKSxcbiAgICAgICAgICAnYWN0aW9ucy5kZWxldGVQZW5kaW5nTWVtYmVycy5kZWxldGVkVXNlcklkJ1xuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgZGVsZXRlUGVuZGluZ01lbWJlcnMuZGVsZXRlZFVzZXJJZC4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVmFsaWRVdWlkKHVzZXJJZCkpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogRHJvcHBpbmcgZGVsZXRlUGVuZGluZ01lbWJlciBkdWUgdG8gaW52YWxpZCBkZWxldGVkVXNlcklkYFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkZWxldGVkVXNlcklkOiB1c2VySWQsXG4gICAgICB9O1xuICAgIH0pXG4gICk7XG5cbiAgLy8gcHJvbW90ZVBlbmRpbmdNZW1iZXJzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5Qcm9tb3RlTWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXlBY3Rpb25cbiAgLy8gPjtcbiAgcmVzdWx0LnByb21vdGVQZW5kaW5nTWVtYmVycyA9IGNvbXBhY3QoXG4gICAgKGFjdGlvbnMucHJvbW90ZVBlbmRpbmdNZW1iZXJzIHx8IFtdKS5tYXAocHJvbW90ZVBlbmRpbmdNZW1iZXIgPT4ge1xuICAgICAgbGV0IHsgdXNlcklkLCBwcm9maWxlS2V5OiBlbmNyeXB0ZWRQcm9maWxlS2V5IH0gPSBwcm9tb3RlUGVuZGluZ01lbWJlcjtcblxuICAgICAgLy8gVE9ETzogREVTS1RPUC0zODE2XG4gICAgICBpZiAoQnl0ZXMuaXNFbXB0eSh1c2VySWQpIHx8IEJ5dGVzLmlzRW1wdHkoZW5jcnlwdGVkUHJvZmlsZUtleSkpIHtcbiAgICAgICAgY29uc3QgeyBwcmVzZW50YXRpb24gfSA9IHByb21vdGVQZW5kaW5nTWVtYmVyO1xuXG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHByZXNlbnRhdGlvbiksXG4gICAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogcHJvbW90ZVBlbmRpbmdNZW1iZXIucHJlc2VudGF0aW9uIHdhcyBtaXNzaW5nJ1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGRlY29kZWRQcmVzZW50YXRpb24gPVxuICAgICAgICAgIGRlY29kZVByb2ZpbGVLZXlDcmVkZW50aWFsUHJlc2VudGF0aW9uKHByZXNlbnRhdGlvbik7XG5cbiAgICAgICAgKHsgdXNlcklkLCBwcm9maWxlS2V5OiBlbmNyeXB0ZWRQcm9maWxlS2V5IH0gPSBkZWNvZGVkUHJlc2VudGF0aW9uKTtcbiAgICAgIH1cblxuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHVzZXJJZCksXG4gICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IHByb21vdGVQZW5kaW5nTWVtYmVycy51c2VySWQgd2FzIG1pc3NpbmcnXG4gICAgICApO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBCeXRlcy5pc05vdEVtcHR5KGVuY3J5cHRlZFByb2ZpbGVLZXkpLFxuICAgICAgICAnZGVjcnlwdEdyb3VwQ2hhbmdlOiBwcm9tb3RlUGVuZGluZ01lbWJlcnMucHJvZmlsZUtleSB3YXMgbWlzc2luZydcbiAgICAgICk7XG5cbiAgICAgIGxldCB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgICAgIGxldCBwcm9maWxlS2V5OiBVaW50OEFycmF5O1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXVpZCA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgICAgZGVjcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXNlcklkKSxcbiAgICAgICAgICAnYWN0aW9ucy5wcm9tb3RlUGVuZGluZ01lbWJlcnMudXNlcklkJ1xuICAgICAgICApO1xuXG4gICAgICAgIHByb2ZpbGVLZXkgPSBkZWNyeXB0UHJvZmlsZUtleShcbiAgICAgICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgICAgIGVuY3J5cHRlZFByb2ZpbGVLZXksXG4gICAgICAgICAgdXVpZFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgYCArXG4gICAgICAgICAgICAncHJvbW90ZVBlbmRpbmdNZW1iZXJzLnVzZXJJZC9wcm9maWxlS2V5LiBEcm9wcGluZyBtZW1iZXIuJyxcbiAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVmFsaWRQcm9maWxlS2V5KHByb2ZpbGVLZXkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnZGVjcnlwdEdyb3VwQ2hhbmdlOiBwcm9tb3RlUGVuZGluZ01lbWJlcnMgaGFkIGludmFsaWQgcHJvZmlsZUtleSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdXVpZCwgcHJvZmlsZUtleSB9O1xuICAgIH0pXG4gICk7XG5cbiAgLy8gcHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleT86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuUHJvbW90ZU1lbWJlclBlbmRpbmdQbmlBY2lQcm9maWxlS2V5QWN0aW9uXG4gIC8vID47XG4gIHJlc3VsdC5wcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5ID0gY29tcGFjdChcbiAgICAoYWN0aW9ucy5wcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5IHx8IFtdKS5tYXAoXG4gICAgICBwcm9tb3RlUGVuZGluZ01lbWJlciA9PiB7XG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHByb21vdGVQZW5kaW5nTWVtYmVyLnVzZXJJZCksXG4gICAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogJyArXG4gICAgICAgICAgICAncHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleS51c2VySWQgd2FzIG1pc3NpbmcnXG4gICAgICAgICk7XG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHByb21vdGVQZW5kaW5nTWVtYmVyLnBuaSksXG4gICAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogJyArXG4gICAgICAgICAgICAncHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleS5wbmkgd2FzIG1pc3NpbmcnXG4gICAgICAgICk7XG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBCeXRlcy5pc05vdEVtcHR5KHByb21vdGVQZW5kaW5nTWVtYmVyLnByb2ZpbGVLZXkpLFxuICAgICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6ICcgK1xuICAgICAgICAgICAgJ3Byb21vdGVNZW1iZXJzUGVuZGluZ1BuaUFjaVByb2ZpbGVLZXkucHJvZmlsZUtleSB3YXMgbWlzc2luZydcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgdXNlcklkOiBzdHJpbmc7XG4gICAgICAgIGxldCBwbmk6IHN0cmluZztcbiAgICAgICAgbGV0IHByb2ZpbGVLZXk6IFVpbnQ4QXJyYXk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHByb21vdGVQZW5kaW5nTWVtYmVyLnVzZXJJZCksXG4gICAgICAgICAgICAnYWN0aW9ucy5wcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5LnVzZXJJZCdcbiAgICAgICAgICApO1xuICAgICAgICAgIHBuaSA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBwcm9tb3RlUGVuZGluZ01lbWJlci5wbmkpLFxuICAgICAgICAgICAgJ2FjdGlvbnMucHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleS5wbmknXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHByb2ZpbGVLZXkgPSBkZWNyeXB0UHJvZmlsZUtleShcbiAgICAgICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgICAgICBwcm9tb3RlUGVuZGluZ01lbWJlci5wcm9maWxlS2V5LFxuICAgICAgICAgICAgVVVJRC5jYXN0KHVzZXJJZClcbiAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgcHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleS4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNWYWxpZFV1aWQodXNlcklkKSkge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogRHJvcHBpbmcgYCArXG4gICAgICAgICAgICAgICdwcm9tb3RlTWVtYmVyc1BlbmRpbmdQbmlBY2lQcm9maWxlS2V5IGR1ZSB0byBpbnZhbGlkIEFDSSdcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWRVdWlkKHBuaSkpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IERyb3BwaW5nIGAgK1xuICAgICAgICAgICAgICAncHJvbW90ZU1lbWJlcnNQZW5kaW5nUG5pQWNpUHJvZmlsZUtleSBkdWUgdG8gaW52YWxpZCBQTkknXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkUHJvZmlsZUtleShwcm9maWxlS2V5KSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IHByb21vdGVNZW1iZXJzUGVuZGluZ1BuaUFjaVByb2ZpbGVLZXkgJyArXG4gICAgICAgICAgICAgICdoYWQgaW52YWxpZCBwcm9maWxlS2V5J1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGFjaTogdXNlcklkLFxuICAgICAgICAgIHBuaSxcbiAgICAgICAgICBwcm9maWxlS2V5LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIClcbiAgKTtcblxuICAvLyBtb2RpZnlUaXRsZT86IEdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5VGl0bGVBY3Rpb247XG4gIGlmIChhY3Rpb25zLm1vZGlmeVRpdGxlKSB7XG4gICAgY29uc3QgeyB0aXRsZSB9ID0gYWN0aW9ucy5tb2RpZnlUaXRsZTtcblxuICAgIGlmIChCeXRlcy5pc05vdEVtcHR5KHRpdGxlKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0Lm1vZGlmeVRpdGxlID0ge1xuICAgICAgICAgIHRpdGxlOiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2IuZGVjb2RlKFxuICAgICAgICAgICAgZGVjcnlwdEdyb3VwQmxvYihjbGllbnRaa0dyb3VwQ2lwaGVyLCB0aXRsZSlcbiAgICAgICAgICApLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgbW9kaWZ5VGl0bGUudGl0bGVgLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQubW9kaWZ5VGl0bGUgPSB7fTtcbiAgICB9XG4gIH1cblxuICAvLyBtb2RpZnlBdmF0YXI/OiBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUF2YXRhckFjdGlvbjtcbiAgLy8gTm90ZTogZGVjcnlwdGlvbiBoYXBwZW5zIGR1cmluZyBhcHBsaWNhdGlvbiBvZiB0aGUgY2hhbmdlLCBvbiBkb3dubG9hZCBvZiB0aGUgYXZhdGFyXG4gIHJlc3VsdC5tb2RpZnlBdmF0YXIgPSBhY3Rpb25zLm1vZGlmeUF2YXRhcjtcblxuICAvLyBtb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyPzpcbiAgLy8gR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyKSB7XG4gICAgY29uc3QgeyB0aW1lciB9ID0gYWN0aW9ucy5tb2RpZnlEaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyO1xuXG4gICAgaWYgKEJ5dGVzLmlzTm90RW1wdHkodGltZXIpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQubW9kaWZ5RGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lciA9IHtcbiAgICAgICAgICB0aW1lcjogUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmRlY29kZShcbiAgICAgICAgICAgIGRlY3J5cHRHcm91cEJsb2IoY2xpZW50WmtHcm91cENpcGhlciwgdGltZXIpXG4gICAgICAgICAgKSxcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IFVuYWJsZSB0byBkZWNyeXB0IG1vZGlmeURpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXIudGltZXJgLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQubW9kaWZ5RGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lciA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIC8vIG1vZGlmeUF0dHJpYnV0ZXNBY2Nlc3M/OlxuICAvLyBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeUF0dHJpYnV0ZXNBY2Nlc3NDb250cm9sQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlBdHRyaWJ1dGVzQWNjZXNzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlc0FjY2VzcyA9IGRyb3BOdWxsKFxuICAgICAgYWN0aW9ucy5tb2RpZnlBdHRyaWJ1dGVzQWNjZXNzLmF0dHJpYnV0ZXNBY2Nlc3NcbiAgICApO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGlzVmFsaWRBY2Nlc3MoYXR0cmlidXRlc0FjY2VzcyksXG4gICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlOiBtb2RpZnlBdHRyaWJ1dGVzQWNjZXNzLmF0dHJpYnV0ZXNBY2Nlc3Mgd2FzIG5vdCB2YWxpZDogJHthY3Rpb25zLm1vZGlmeUF0dHJpYnV0ZXNBY2Nlc3MuYXR0cmlidXRlc0FjY2Vzc31gXG4gICAgKTtcblxuICAgIHJlc3VsdC5tb2RpZnlBdHRyaWJ1dGVzQWNjZXNzID0ge1xuICAgICAgYXR0cmlidXRlc0FjY2VzcyxcbiAgICB9O1xuICB9XG5cbiAgLy8gbW9kaWZ5TWVtYmVyQWNjZXNzPzogR3JvdXBDaGFuZ2UuQWN0aW9ucy5Nb2RpZnlNZW1iZXJzQWNjZXNzQ29udHJvbEFjdGlvbjtcbiAgaWYgKGFjdGlvbnMubW9kaWZ5TWVtYmVyQWNjZXNzKSB7XG4gICAgY29uc3QgbWVtYmVyc0FjY2VzcyA9IGRyb3BOdWxsKGFjdGlvbnMubW9kaWZ5TWVtYmVyQWNjZXNzLm1lbWJlcnNBY2Nlc3MpO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGlzVmFsaWRBY2Nlc3MobWVtYmVyc0FjY2VzcyksXG4gICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlOiBtb2RpZnlNZW1iZXJBY2Nlc3MubWVtYmVyc0FjY2VzcyB3YXMgbm90IHZhbGlkOiAke2FjdGlvbnMubW9kaWZ5TWVtYmVyQWNjZXNzLm1lbWJlcnNBY2Nlc3N9YFxuICAgICk7XG5cbiAgICByZXN1bHQubW9kaWZ5TWVtYmVyQWNjZXNzID0ge1xuICAgICAgbWVtYmVyc0FjY2VzcyxcbiAgICB9O1xuICB9XG5cbiAgLy8gbW9kaWZ5QWRkRnJvbUludml0ZUxpbmtBY2Nlc3M/OlxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5QWRkRnJvbUludml0ZUxpbmtBY2Nlc3NDb250cm9sQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2Vzcykge1xuICAgIGNvbnN0IGFkZEZyb21JbnZpdGVMaW5rQWNjZXNzID0gZHJvcE51bGwoXG4gICAgICBhY3Rpb25zLm1vZGlmeUFkZEZyb21JbnZpdGVMaW5rQWNjZXNzLmFkZEZyb21JbnZpdGVMaW5rQWNjZXNzXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBpc1ZhbGlkTGlua0FjY2VzcyhhZGRGcm9tSW52aXRlTGlua0FjY2VzcyksXG4gICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlOiBtb2RpZnlBZGRGcm9tSW52aXRlTGlua0FjY2Vzcy5hZGRGcm9tSW52aXRlTGlua0FjY2VzcyB3YXMgbm90IHZhbGlkOiAke2FjdGlvbnMubW9kaWZ5QWRkRnJvbUludml0ZUxpbmtBY2Nlc3MuYWRkRnJvbUludml0ZUxpbmtBY2Nlc3N9YFxuICAgICk7XG5cbiAgICByZXN1bHQubW9kaWZ5QWRkRnJvbUludml0ZUxpbmtBY2Nlc3MgPSB7XG4gICAgICBhZGRGcm9tSW52aXRlTGlua0FjY2VzcyxcbiAgICB9O1xuICB9XG5cbiAgLy8gYWRkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5BZGRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbEFjdGlvblxuICAvLyA+O1xuICByZXN1bHQuYWRkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzID0gY29tcGFjdChcbiAgICAoYWN0aW9ucy5hZGRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHMgfHwgW10pLm1hcChcbiAgICAgIGFkZFBlbmRpbmdBZG1pbkFwcHJvdmFsID0+IHtcbiAgICAgICAgY29uc3QgeyBhZGRlZCB9ID0gYWRkUGVuZGluZ0FkbWluQXBwcm92YWw7XG4gICAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgICBhZGRlZCxcbiAgICAgICAgICAnZGVjcnlwdEdyb3VwQ2hhbmdlOiBhZGRQZW5kaW5nQWRtaW5BcHByb3ZhbCB3YXMgbWlzc2luZyBhZGRlZCBmaWVsZCEnXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjcnlwdE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsKFxuICAgICAgICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgICAgICAgYWRkZWQsXG4gICAgICAgICAgbG9nSWRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFkZWNyeXB0ZWQpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IFVuYWJsZSB0byBkZWNyeXB0IGFkZFBlbmRpbmdBZG1pbkFwcHJvdmFsLmFkZGVkLiBEcm9wcGluZyBtZW1iZXIuYFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBhZGRlZDogZGVjcnlwdGVkIH07XG4gICAgICB9XG4gICAgKVxuICApO1xuXG4gIC8vIGRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscz86IEFycmF5PFxuICAvLyAgIEdyb3VwQ2hhbmdlLkFjdGlvbnMuRGVsZXRlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxBY3Rpb25cbiAgLy8gPjtcbiAgcmVzdWx0LmRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscyA9IGNvbXBhY3QoXG4gICAgKGFjdGlvbnMuZGVsZXRlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzIHx8IFtdKS5tYXAoXG4gICAgICBkZWxldGVQZW5kaW5nQXBwcm92YWwgPT4ge1xuICAgICAgICBjb25zdCB7IGRlbGV0ZWRVc2VySWQgfSA9IGRlbGV0ZVBlbmRpbmdBcHByb3ZhbDtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgIEJ5dGVzLmlzTm90RW1wdHkoZGVsZXRlZFVzZXJJZCksXG4gICAgICAgICAgJ2RlY3J5cHRHcm91cENoYW5nZTogZGVsZXRlUGVuZGluZ0FwcHJvdmFsLmRlbGV0ZWRVc2VySWQgd2FzIG1pc3NpbmcnXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IHVzZXJJZDogc3RyaW5nO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHVzZXJJZCA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBkZWxldGVkVXNlcklkKSxcbiAgICAgICAgICAgICdhY3Rpb25zLmRlbGV0ZU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFscydcbiAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgZGVsZXRlUGVuZGluZ0FwcHJvdmFsLmRlbGV0ZWRVc2VySWQuIERyb3BwaW5nIG1lbWJlci5gLFxuICAgICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVmFsaWRVdWlkKHVzZXJJZCkpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IERyb3BwaW5nIGRlbGV0ZVBlbmRpbmdBcHByb3ZhbCBkdWUgdG8gaW52YWxpZCBkZWxldGVkVXNlcklkYFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGRlbGV0ZWRVc2VySWQ6IHVzZXJJZCB9O1xuICAgICAgfVxuICAgIClcbiAgKTtcblxuICAvLyBwcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzPzogQXJyYXk8XG4gIC8vICAgR3JvdXBDaGFuZ2UuQWN0aW9ucy5Qcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxBY3Rpb25cbiAgLy8gPjtcbiAgcmVzdWx0LnByb21vdGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHMgPSBjb21wYWN0KFxuICAgIChhY3Rpb25zLnByb21vdGVNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbHMgfHwgW10pLm1hcChcbiAgICAgIHByb21vdGVBZG1pbkFwcHJvdmFsID0+IHtcbiAgICAgICAgY29uc3QgeyB1c2VySWQgfSA9IHByb21vdGVBZG1pbkFwcHJvdmFsO1xuICAgICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgICAgQnl0ZXMuaXNOb3RFbXB0eSh1c2VySWQpLFxuICAgICAgICAgICdkZWNyeXB0R3JvdXBDaGFuZ2U6IHByb21vdGVBZG1pbkFwcHJvdmFsLnVzZXJJZCB3YXMgbWlzc2luZydcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgZGVjcnlwdGVkVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGVjcnlwdGVkVXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIHVzZXJJZCksXG4gICAgICAgICAgICAnYWN0aW9ucy5wcm9tb3RlTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWxzLnVzZXJJZCdcbiAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgcHJvbW90ZUFkbWluQXBwcm92YWwudXNlcklkLiBEcm9wcGluZyBtZW1iZXIuYCxcbiAgICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByb2xlID0gZHJvcE51bGwocHJvbW90ZUFkbWluQXBwcm92YWwucm9sZSk7XG4gICAgICAgIGlmICghaXNWYWxpZFJvbGUocm9sZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgZGVjcnlwdEdyb3VwQ2hhbmdlOiBwcm9tb3RlQWRtaW5BcHByb3ZhbCBoYWQgaW52YWxpZCByb2xlICR7cHJvbW90ZUFkbWluQXBwcm92YWwucm9sZX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHJvbGUsIHVzZXJJZDogZGVjcnlwdGVkVXNlcklkIH07XG4gICAgICB9XG4gICAgKVxuICApO1xuXG4gIC8vIG1vZGlmeUludml0ZUxpbmtQYXNzd29yZD86IEdyb3VwQ2hhbmdlLkFjdGlvbnMuTW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlJbnZpdGVMaW5rUGFzc3dvcmQpIHtcbiAgICBjb25zdCB7IGludml0ZUxpbmtQYXNzd29yZDogcGFzc3dvcmQgfSA9IGFjdGlvbnMubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkO1xuICAgIGlmIChCeXRlcy5pc05vdEVtcHR5KHBhc3N3b3JkKSkge1xuICAgICAgcmVzdWx0Lm1vZGlmeUludml0ZUxpbmtQYXNzd29yZCA9IHtcbiAgICAgICAgaW52aXRlTGlua1Bhc3N3b3JkOiBCeXRlcy50b0Jhc2U2NChwYXNzd29yZCksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQubW9kaWZ5SW52aXRlTGlua1Bhc3N3b3JkID0ge307XG4gICAgfVxuICB9XG5cbiAgLy8gbW9kaWZ5RGVzY3JpcHRpb24/OiBHcm91cENoYW5nZS5BY3Rpb25zLk1vZGlmeURlc2NyaXB0aW9uQWN0aW9uO1xuICBpZiAoYWN0aW9ucy5tb2RpZnlEZXNjcmlwdGlvbikge1xuICAgIGNvbnN0IHsgZGVzY3JpcHRpb25CeXRlcyB9ID0gYWN0aW9ucy5tb2RpZnlEZXNjcmlwdGlvbjtcbiAgICBpZiAoQnl0ZXMuaXNOb3RFbXB0eShkZXNjcmlwdGlvbkJ5dGVzKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0Lm1vZGlmeURlc2NyaXB0aW9uID0ge1xuICAgICAgICAgIGRlc2NyaXB0aW9uQnl0ZXM6IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5kZWNvZGUoXG4gICAgICAgICAgICBkZWNyeXB0R3JvdXBCbG9iKGNsaWVudFprR3JvdXBDaXBoZXIsIGRlc2NyaXB0aW9uQnl0ZXMpXG4gICAgICAgICAgKSxcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IFVuYWJsZSB0byBkZWNyeXB0IG1vZGlmeURlc2NyaXB0aW9uLmRlc2NyaXB0aW9uQnl0ZXNgLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQubW9kaWZ5RGVzY3JpcHRpb24gPSB7fTtcbiAgICB9XG4gIH1cblxuICAvLyBtb2RpZnlBbm5vdW5jZW1lbnRzT25seVxuICBpZiAoYWN0aW9ucy5tb2RpZnlBbm5vdW5jZW1lbnRzT25seSkge1xuICAgIGNvbnN0IHsgYW5ub3VuY2VtZW50c09ubHkgfSA9IGFjdGlvbnMubW9kaWZ5QW5ub3VuY2VtZW50c09ubHk7XG4gICAgcmVzdWx0Lm1vZGlmeUFubm91bmNlbWVudHNPbmx5ID0ge1xuICAgICAgYW5ub3VuY2VtZW50c09ubHk6IEJvb2xlYW4oYW5ub3VuY2VtZW50c09ubHkpLFxuICAgIH07XG4gIH1cblxuICAvLyBhZGRNZW1iZXJzQmFubmVkXG4gIGlmIChhY3Rpb25zLmFkZE1lbWJlcnNCYW5uZWQgJiYgYWN0aW9ucy5hZGRNZW1iZXJzQmFubmVkLmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQuYWRkTWVtYmVyc0Jhbm5lZCA9IGFjdGlvbnMuYWRkTWVtYmVyc0Jhbm5lZFxuICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgaWYgKCFpdGVtLmFkZGVkIHx8ICFpdGVtLmFkZGVkLnVzZXJJZCkge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYGRlY3J5cHRHcm91cENoYW5nZS8ke2xvZ0lkfTogYWRkTWVtYmVyc0Jhbm5lZCBoYWQgYSBibGFuayBlbnRyeWBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHV1aWQgPSBub3JtYWxpemVVdWlkKFxuICAgICAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIGl0ZW0uYWRkZWQudXNlcklkKSxcbiAgICAgICAgICAnYWRkTWVtYmVyc0Jhbm5lZC5hZGRlZC51c2VySWQnXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5vcm1hbGl6ZVRpbWVzdGFtcChpdGVtLmFkZGVkLnRpbWVzdGFtcCk7XG5cbiAgICAgICAgcmV0dXJuIHsgdXVpZCwgdGltZXN0YW1wIH07XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihpc05vdE5pbCk7XG4gIH1cblxuICAvLyBkZWxldGVNZW1iZXJzQmFubmVkXG4gIGlmIChhY3Rpb25zLmRlbGV0ZU1lbWJlcnNCYW5uZWQgJiYgYWN0aW9ucy5kZWxldGVNZW1iZXJzQmFubmVkLmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQuZGVsZXRlTWVtYmVyc0Jhbm5lZCA9IGFjdGlvbnMuZGVsZXRlTWVtYmVyc0Jhbm5lZFxuICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgaWYgKCFpdGVtLmRlbGV0ZWRVc2VySWQpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBkZWNyeXB0R3JvdXBDaGFuZ2UvJHtsb2dJZH06IGRlbGV0ZU1lbWJlcnNCYW5uZWQgaGFkIGEgYmxhbmsgZW50cnlgXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCBpdGVtLmRlbGV0ZWRVc2VySWQpLFxuICAgICAgICAgICdkZWxldGVNZW1iZXJzQmFubmVkLmRlbGV0ZWRVc2VySWQnXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihpc05vdE5pbCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdEdyb3VwVGl0bGUoXG4gIHRpdGxlOiBVaW50OEFycmF5IHwgdW5kZWZpbmVkLFxuICBzZWNyZXRQYXJhbXM6IHN0cmluZ1xuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgY2xpZW50WmtHcm91cENpcGhlciA9IGdldENsaWVudFprR3JvdXBDaXBoZXIoc2VjcmV0UGFyYW1zKTtcbiAgaWYgKCF0aXRsZSB8fCAhdGl0bGUubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBibG9iID0gUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmRlY29kZShcbiAgICBkZWNyeXB0R3JvdXBCbG9iKGNsaWVudFprR3JvdXBDaXBoZXIsIHRpdGxlKVxuICApO1xuXG4gIGlmIChibG9iICYmIGJsb2IuY29udGVudCA9PT0gJ3RpdGxlJykge1xuICAgIHJldHVybiBkcm9wTnVsbChibG9iLnRpdGxlKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0R3JvdXBEZXNjcmlwdGlvbihcbiAgZGVzY3JpcHRpb246IFVpbnQ4QXJyYXkgfCB1bmRlZmluZWQsXG4gIHNlY3JldFBhcmFtczogc3RyaW5nXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBjbGllbnRaa0dyb3VwQ2lwaGVyID0gZ2V0Q2xpZW50WmtHcm91cENpcGhlcihzZWNyZXRQYXJhbXMpO1xuICBpZiAoIWRlc2NyaXB0aW9uIHx8ICFkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgYmxvYiA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5kZWNvZGUoXG4gICAgZGVjcnlwdEdyb3VwQmxvYihjbGllbnRaa0dyb3VwQ2lwaGVyLCBkZXNjcmlwdGlvbilcbiAgKTtcblxuICBpZiAoYmxvYiAmJiBibG9iLmNvbnRlbnQgPT09ICdkZXNjcmlwdGlvblRleHQnKSB7XG4gICAgcmV0dXJuIGRyb3BOdWxsKGJsb2IuZGVzY3JpcHRpb25UZXh0KTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbnR5cGUgRGVjcnlwdGVkR3JvdXBTdGF0ZSA9IHtcbiAgdGl0bGU/OiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2I7XG4gIGRpc2FwcGVhcmluZ01lc3NhZ2VzVGltZXI/OiBQcm90by5Hcm91cEF0dHJpYnV0ZUJsb2I7XG4gIGFjY2Vzc0NvbnRyb2w/OiB7XG4gICAgYXR0cmlidXRlczogbnVtYmVyO1xuICAgIG1lbWJlcnM6IG51bWJlcjtcbiAgICBhZGRGcm9tSW52aXRlTGluazogbnVtYmVyO1xuICB9O1xuICB2ZXJzaW9uPzogbnVtYmVyO1xuICBtZW1iZXJzPzogUmVhZG9ubHlBcnJheTxEZWNyeXB0ZWRNZW1iZXI+O1xuICBtZW1iZXJzUGVuZGluZ1Byb2ZpbGVLZXk/OiBSZWFkb25seUFycmF5PERlY3J5cHRlZE1lbWJlclBlbmRpbmdQcm9maWxlS2V5PjtcbiAgbWVtYmVyc1BlbmRpbmdBZG1pbkFwcHJvdmFsPzogUmVhZG9ubHlBcnJheTxEZWNyeXB0ZWRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbD47XG4gIGludml0ZUxpbmtQYXNzd29yZD86IHN0cmluZztcbiAgZGVzY3JpcHRpb25CeXRlcz86IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYjtcbiAgYXZhdGFyPzogc3RyaW5nO1xuICBhbm5vdW5jZW1lbnRzT25seT86IGJvb2xlYW47XG4gIG1lbWJlcnNCYW5uZWQ/OiBBcnJheTxHcm91cFYyQmFubmVkTWVtYmVyVHlwZT47XG59O1xuXG5mdW5jdGlvbiBkZWNyeXB0R3JvdXBTdGF0ZShcbiAgZ3JvdXBTdGF0ZTogUmVhZG9ubHk8UHJvdG8uSUdyb3VwPixcbiAgZ3JvdXBTZWNyZXRQYXJhbXM6IHN0cmluZyxcbiAgbG9nSWQ6IHN0cmluZ1xuKTogRGVjcnlwdGVkR3JvdXBTdGF0ZSB7XG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKGdyb3VwU2VjcmV0UGFyYW1zKTtcbiAgY29uc3QgcmVzdWx0OiBEZWNyeXB0ZWRHcm91cFN0YXRlID0ge307XG5cbiAgLy8gdGl0bGVcbiAgaWYgKEJ5dGVzLmlzTm90RW1wdHkoZ3JvdXBTdGF0ZS50aXRsZSkpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0LnRpdGxlID0gUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmRlY29kZShcbiAgICAgICAgZGVjcnlwdEdyb3VwQmxvYihjbGllbnRaa0dyb3VwQ2lwaGVyLCBncm91cFN0YXRlLnRpdGxlKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBkZWNyeXB0R3JvdXBTdGF0ZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgdGl0bGUuIENsZWFyaW5nIGl0LmAsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBhdmF0YXJcbiAgLy8gTm90ZTogZGVjcnlwdGlvbiBoYXBwZW5zIGR1cmluZyBhcHBsaWNhdGlvbiBvZiB0aGUgY2hhbmdlLCBvbiBkb3dubG9hZCBvZiB0aGUgYXZhdGFyXG5cbiAgLy8gZGlzYXBwZWFyaW5nIG1lc3NhZ2UgdGltZXJcbiAgaWYgKFxuICAgIGdyb3VwU3RhdGUuZGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lciAmJlxuICAgIGdyb3VwU3RhdGUuZGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lci5sZW5ndGhcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdC5kaXNhcHBlYXJpbmdNZXNzYWdlc1RpbWVyID0gUHJvdG8uR3JvdXBBdHRyaWJ1dGVCbG9iLmRlY29kZShcbiAgICAgICAgZGVjcnlwdEdyb3VwQmxvYihcbiAgICAgICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgICAgIGdyb3VwU3RhdGUuZGlzYXBwZWFyaW5nTWVzc2FnZXNUaW1lclxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGRlY3J5cHRHcm91cFN0YXRlLyR7bG9nSWR9OiBVbmFibGUgdG8gZGVjcnlwdCBkaXNhcHBlYXJpbmcgbWVzc2FnZSB0aW1lci4gQ2xlYXJpbmcgaXQuYCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFjY2Vzc0NvbnRyb2xcbiAge1xuICAgIGNvbnN0IHsgYWNjZXNzQ29udHJvbCB9ID0gZ3JvdXBTdGF0ZTtcbiAgICBzdHJpY3RBc3NlcnQoYWNjZXNzQ29udHJvbCwgJ05vIGFjY2Vzc0NvbnRyb2wgZmllbGQgZm91bmQnKTtcblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBkcm9wTnVsbChhY2Nlc3NDb250cm9sLmF0dHJpYnV0ZXMpO1xuICAgIGNvbnN0IG1lbWJlcnMgPSBkcm9wTnVsbChhY2Nlc3NDb250cm9sLm1lbWJlcnMpO1xuICAgIGNvbnN0IGFkZEZyb21JbnZpdGVMaW5rID0gZHJvcE51bGwoYWNjZXNzQ29udHJvbC5hZGRGcm9tSW52aXRlTGluayk7XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBpc1ZhbGlkQWNjZXNzKGF0dHJpYnV0ZXMpLFxuICAgICAgYGRlY3J5cHRHcm91cFN0YXRlOiBBY2Nlc3MgY29udHJvbCBmb3IgYXR0cmlidXRlcyBpcyBpbnZhbGlkOiAke2F0dHJpYnV0ZXN9YFxuICAgICk7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgaXNWYWxpZEFjY2VzcyhtZW1iZXJzKSxcbiAgICAgIGBkZWNyeXB0R3JvdXBTdGF0ZTogQWNjZXNzIGNvbnRyb2wgZm9yIG1lbWJlcnMgaXMgaW52YWxpZDogJHttZW1iZXJzfWBcbiAgICApO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGlzVmFsaWRMaW5rQWNjZXNzKGFkZEZyb21JbnZpdGVMaW5rKSxcbiAgICAgIGBkZWNyeXB0R3JvdXBTdGF0ZTogQWNjZXNzIGNvbnRyb2wgZm9yIGludml0ZSBsaW5rIGlzIGludmFsaWQ6ICR7YWRkRnJvbUludml0ZUxpbmt9YFxuICAgICk7XG5cbiAgICByZXN1bHQuYWNjZXNzQ29udHJvbCA9IHtcbiAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICBtZW1iZXJzLFxuICAgICAgYWRkRnJvbUludml0ZUxpbmssXG4gICAgfTtcbiAgfVxuXG4gIC8vIHZlcnNpb25cbiAgc3RyaWN0QXNzZXJ0KFxuICAgIGlzTnVtYmVyKGdyb3VwU3RhdGUudmVyc2lvbiksXG4gICAgYGRlY3J5cHRHcm91cFN0YXRlOiBFeHBlY3RlZCB2ZXJzaW9uIHRvIGJlIGEgbnVtYmVyOyBpdCB3YXMgJHtncm91cFN0YXRlLnZlcnNpb259YFxuICApO1xuICByZXN1bHQudmVyc2lvbiA9IGdyb3VwU3RhdGUudmVyc2lvbjtcblxuICAvLyBtZW1iZXJzXG4gIGlmIChncm91cFN0YXRlLm1lbWJlcnMpIHtcbiAgICByZXN1bHQubWVtYmVycyA9IGNvbXBhY3QoXG4gICAgICBncm91cFN0YXRlLm1lbWJlcnMubWFwKChtZW1iZXI6IFByb3RvLklNZW1iZXIpID0+XG4gICAgICAgIGRlY3J5cHRNZW1iZXIoY2xpZW50WmtHcm91cENpcGhlciwgbWVtYmVyLCBsb2dJZClcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgLy8gbWVtYmVyc1BlbmRpbmdQcm9maWxlS2V5XG4gIGlmIChncm91cFN0YXRlLm1lbWJlcnNQZW5kaW5nUHJvZmlsZUtleSkge1xuICAgIHJlc3VsdC5tZW1iZXJzUGVuZGluZ1Byb2ZpbGVLZXkgPSBjb21wYWN0KFxuICAgICAgZ3JvdXBTdGF0ZS5tZW1iZXJzUGVuZGluZ1Byb2ZpbGVLZXkubWFwKFxuICAgICAgICAobWVtYmVyOiBQcm90by5JTWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXkpID0+XG4gICAgICAgICAgZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5KGNsaWVudFprR3JvdXBDaXBoZXIsIG1lbWJlciwgbG9nSWQpXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIC8vIG1lbWJlcnNQZW5kaW5nQWRtaW5BcHByb3ZhbFxuICBpZiAoZ3JvdXBTdGF0ZS5tZW1iZXJzUGVuZGluZ0FkbWluQXBwcm92YWwpIHtcbiAgICByZXN1bHQubWVtYmVyc1BlbmRpbmdBZG1pbkFwcHJvdmFsID0gY29tcGFjdChcbiAgICAgIGdyb3VwU3RhdGUubWVtYmVyc1BlbmRpbmdBZG1pbkFwcHJvdmFsLm1hcChcbiAgICAgICAgKG1lbWJlcjogUHJvdG8uSU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsKSA9PlxuICAgICAgICAgIGRlY3J5cHRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbChjbGllbnRaa0dyb3VwQ2lwaGVyLCBtZW1iZXIsIGxvZ0lkKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvLyBpbnZpdGVMaW5rUGFzc3dvcmRcbiAgaWYgKEJ5dGVzLmlzTm90RW1wdHkoZ3JvdXBTdGF0ZS5pbnZpdGVMaW5rUGFzc3dvcmQpKSB7XG4gICAgcmVzdWx0Lmludml0ZUxpbmtQYXNzd29yZCA9IEJ5dGVzLnRvQmFzZTY0KGdyb3VwU3RhdGUuaW52aXRlTGlua1Bhc3N3b3JkKTtcbiAgfVxuXG4gIC8vIGRlc2NyaXB0aW9uQnl0ZXNcbiAgaWYgKEJ5dGVzLmlzTm90RW1wdHkoZ3JvdXBTdGF0ZS5kZXNjcmlwdGlvbkJ5dGVzKSkge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQuZGVzY3JpcHRpb25CeXRlcyA9IFByb3RvLkdyb3VwQXR0cmlidXRlQmxvYi5kZWNvZGUoXG4gICAgICAgIGRlY3J5cHRHcm91cEJsb2IoY2xpZW50WmtHcm91cENpcGhlciwgZ3JvdXBTdGF0ZS5kZXNjcmlwdGlvbkJ5dGVzKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBkZWNyeXB0R3JvdXBTdGF0ZS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgZGVzY3JpcHRpb25CeXRlcy4gQ2xlYXJpbmcgaXQuYCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFubm91bmNlbWVudHNPbmx5XG4gIGNvbnN0IHsgYW5ub3VuY2VtZW50c09ubHkgfSA9IGdyb3VwU3RhdGU7XG4gIHJlc3VsdC5hbm5vdW5jZW1lbnRzT25seSA9IEJvb2xlYW4oYW5ub3VuY2VtZW50c09ubHkpO1xuXG4gIC8vIG1lbWJlcnNCYW5uZWRcbiAgY29uc3QgeyBtZW1iZXJzQmFubmVkIH0gPSBncm91cFN0YXRlO1xuICBpZiAobWVtYmVyc0Jhbm5lZCAmJiBtZW1iZXJzQmFubmVkLmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQubWVtYmVyc0Jhbm5lZCA9IG1lbWJlcnNCYW5uZWRcbiAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGlmICghaXRlbS51c2VySWQpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBkZWNyeXB0R3JvdXBTdGF0ZS8ke2xvZ0lkfTogbWVtYmVyc0Jhbm5lZCBoYWQgYSBibGFuayBlbnRyeWBcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHV1aWQgPSBub3JtYWxpemVVdWlkKFxuICAgICAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIGl0ZW0udXNlcklkKSxcbiAgICAgICAgICAnbWVtYmVyc0Jhbm5lZC5hZGRlZC51c2VySWQnXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IGl0ZW0udGltZXN0YW1wPy50b051bWJlcigpID8/IDA7XG5cbiAgICAgICAgcmV0dXJuIHsgdXVpZCwgdGltZXN0YW1wIH07XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihpc05vdE5pbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0Lm1lbWJlcnNCYW5uZWQgPSBbXTtcbiAgfVxuXG4gIHJlc3VsdC5hdmF0YXIgPSBkcm9wTnVsbChncm91cFN0YXRlLmF2YXRhcik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxudHlwZSBEZWNyeXB0ZWRNZW1iZXIgPSBSZWFkb25seTx7XG4gIHVzZXJJZDogc3RyaW5nO1xuICBwcm9maWxlS2V5OiBVaW50OEFycmF5O1xuICByb2xlOiBQcm90by5NZW1iZXIuUm9sZTtcbiAgam9pbmVkQXRWZXJzaW9uPzogbnVtYmVyO1xufT47XG5cbmZ1bmN0aW9uIGRlY3J5cHRNZW1iZXIoXG4gIGNsaWVudFprR3JvdXBDaXBoZXI6IENsaWVudFprR3JvdXBDaXBoZXIsXG4gIG1lbWJlcjogUmVhZG9ubHk8UHJvdG8uSU1lbWJlcj4sXG4gIGxvZ0lkOiBzdHJpbmdcbik6IERlY3J5cHRlZE1lbWJlciB8IHVuZGVmaW5lZCB7XG4gIC8vIHVzZXJJZFxuICBzdHJpY3RBc3NlcnQoXG4gICAgQnl0ZXMuaXNOb3RFbXB0eShtZW1iZXIudXNlcklkKSxcbiAgICAnZGVjcnlwdE1lbWJlcjogTWVtYmVyIGhhZCBtaXNzaW5nIHVzZXJJZCdcbiAgKTtcblxuICBsZXQgdXNlcklkOiBzdHJpbmc7XG4gIHRyeSB7XG4gICAgdXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIG1lbWJlci51c2VySWQpLFxuICAgICAgJ2RlY3J5cHRNZW1iZXIudXNlcklkJ1xuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgZGVjcnlwdE1lbWJlci8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgbWVtYmVyIHVzZXJpZC4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoIWlzVmFsaWRVdWlkKHVzZXJJZCkpIHtcbiAgICBsb2cud2FybihgZGVjcnlwdE1lbWJlci8ke2xvZ0lkfTogRHJvcHBpbmcgbWVtYmVyIGR1ZSB0byBpbnZhbGlkIHVzZXJJZGApO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIHByb2ZpbGVLZXlcbiAgc3RyaWN0QXNzZXJ0KFxuICAgIEJ5dGVzLmlzTm90RW1wdHkobWVtYmVyLnByb2ZpbGVLZXkpLFxuICAgICdkZWNyeXB0TWVtYmVyOiBNZW1iZXIgaGFkIG1pc3NpbmcgcHJvZmlsZUtleSdcbiAgKTtcbiAgY29uc3QgcHJvZmlsZUtleSA9IGRlY3J5cHRQcm9maWxlS2V5KFxuICAgIGNsaWVudFprR3JvdXBDaXBoZXIsXG4gICAgbWVtYmVyLnByb2ZpbGVLZXksXG4gICAgVVVJRC5jYXN0KHVzZXJJZClcbiAgKTtcblxuICBpZiAoIWlzVmFsaWRQcm9maWxlS2V5KHByb2ZpbGVLZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWNyeXB0TWVtYmVyOiBNZW1iZXIgaGFkIGludmFsaWQgcHJvZmlsZUtleScpO1xuICB9XG5cbiAgLy8gcm9sZVxuICBjb25zdCByb2xlID0gZHJvcE51bGwobWVtYmVyLnJvbGUpO1xuXG4gIGlmICghaXNWYWxpZFJvbGUocm9sZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRlY3J5cHRNZW1iZXI6IE1lbWJlciBoYWQgaW52YWxpZCByb2xlICR7bWVtYmVyLnJvbGV9YCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVzZXJJZCxcbiAgICBwcm9maWxlS2V5LFxuICAgIHJvbGUsXG4gICAgam9pbmVkQXRWZXJzaW9uOiBkcm9wTnVsbChtZW1iZXIuam9pbmVkQXRWZXJzaW9uKSxcbiAgfTtcbn1cblxudHlwZSBEZWNyeXB0ZWRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleSA9IHtcbiAgYWRkZWRCeVVzZXJJZDogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgbWVtYmVyOiB7XG4gICAgdXNlcklkOiBzdHJpbmc7XG4gICAgcHJvZmlsZUtleT86IFVpbnQ4QXJyYXk7XG4gICAgcm9sZT86IFByb3RvLk1lbWJlci5Sb2xlO1xuICB9O1xufTtcblxuZnVuY3Rpb24gZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5KFxuICBjbGllbnRaa0dyb3VwQ2lwaGVyOiBDbGllbnRaa0dyb3VwQ2lwaGVyLFxuICBtZW1iZXI6IFJlYWRvbmx5PFByb3RvLklNZW1iZXJQZW5kaW5nUHJvZmlsZUtleT4sXG4gIGxvZ0lkOiBzdHJpbmdcbik6IERlY3J5cHRlZE1lbWJlclBlbmRpbmdQcm9maWxlS2V5IHwgdW5kZWZpbmVkIHtcbiAgLy8gYWRkZWRCeVVzZXJJZFxuICBzdHJpY3RBc3NlcnQoXG4gICAgQnl0ZXMuaXNOb3RFbXB0eShtZW1iZXIuYWRkZWRCeVVzZXJJZCksXG4gICAgJ2RlY3J5cHRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleTogTWVtYmVyIGhhZCBtaXNzaW5nIGFkZGVkQnlVc2VySWQnXG4gICk7XG5cbiAgbGV0IGFkZGVkQnlVc2VySWQ6IHN0cmluZztcbiAgdHJ5IHtcbiAgICBhZGRlZEJ5VXNlcklkID0gbm9ybWFsaXplVXVpZChcbiAgICAgIGRlY3J5cHRVdWlkKGNsaWVudFprR3JvdXBDaXBoZXIsIG1lbWJlci5hZGRlZEJ5VXNlcklkKSxcbiAgICAgICdkZWNyeXB0TWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXkuYWRkZWRCeVVzZXJJZCdcbiAgICApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGRlY3J5cHRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgcGVuZGluZyBtZW1iZXIgYWRkZWRCeVVzZXJJZC4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoIWlzVmFsaWRVdWlkKGFkZGVkQnlVc2VySWQpKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5LyR7bG9nSWR9OiBEcm9wcGluZyBwZW5kaW5nIG1lbWJlciBkdWUgdG8gaW52YWxpZCBhZGRlZEJ5VXNlcklkYFxuICAgICk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIHRpbWVzdGFtcFxuICBjb25zdCB0aW1lc3RhbXAgPSBub3JtYWxpemVUaW1lc3RhbXAobWVtYmVyLnRpbWVzdGFtcCk7XG5cbiAgaWYgKCFtZW1iZXIubWVtYmVyKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5LyR7bG9nSWR9OiBEcm9wcGluZyBwZW5kaW5nIG1lbWJlciBkdWUgdG8gbWlzc2luZyBtZW1iZXIgZGV0YWlsc2BcbiAgICApO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHsgdXNlcklkLCBwcm9maWxlS2V5IH0gPSBtZW1iZXIubWVtYmVyO1xuXG4gIC8vIHVzZXJJZFxuICBzdHJpY3RBc3NlcnQoXG4gICAgQnl0ZXMuaXNOb3RFbXB0eSh1c2VySWQpLFxuICAgICdkZWNyeXB0TWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXk6IE1lbWJlciBoYWQgbWlzc2luZyBtZW1iZXIudXNlcklkJ1xuICApO1xuXG4gIGxldCBkZWNyeXB0ZWRVc2VySWQ6IHN0cmluZztcbiAgdHJ5IHtcbiAgICBkZWNyeXB0ZWRVc2VySWQgPSBub3JtYWxpemVVdWlkKFxuICAgICAgZGVjcnlwdFV1aWQoY2xpZW50WmtHcm91cENpcGhlciwgdXNlcklkKSxcbiAgICAgICdkZWNyeXB0TWVtYmVyUGVuZGluZ1Byb2ZpbGVLZXkubWVtYmVyLnVzZXJJZCdcbiAgICApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGRlY3J5cHRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleS8ke2xvZ0lkfTogVW5hYmxlIHRvIGRlY3J5cHQgcGVuZGluZyBtZW1iZXIgdXNlcklkLiBEcm9wcGluZyBtZW1iZXIuYCxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICghaXNWYWxpZFV1aWQoZGVjcnlwdGVkVXNlcklkKSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgYGRlY3J5cHRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleS8ke2xvZ0lkfTogRHJvcHBpbmcgcGVuZGluZyBtZW1iZXIgZHVlIHRvIGludmFsaWQgbWVtYmVyLnVzZXJJZGBcbiAgICApO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIHByb2ZpbGVLZXlcbiAgbGV0IGRlY3J5cHRlZFByb2ZpbGVLZXk6IFVpbnQ4QXJyYXkgfCB1bmRlZmluZWQ7XG4gIGlmIChCeXRlcy5pc05vdEVtcHR5KHByb2ZpbGVLZXkpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRlY3J5cHRlZFByb2ZpbGVLZXkgPSBkZWNyeXB0UHJvZmlsZUtleShcbiAgICAgICAgY2xpZW50WmtHcm91cENpcGhlcixcbiAgICAgICAgcHJvZmlsZUtleSxcbiAgICAgICAgVVVJRC5jYXN0KGRlY3J5cHRlZFVzZXJJZClcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5LyR7bG9nSWR9OiBVbmFibGUgdG8gZGVjcnlwdCBwZW5kaW5nIG1lbWJlciBwcm9maWxlS2V5LiBEcm9wcGluZyBwcm9maWxlS2V5LmAsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVmFsaWRQcm9maWxlS2V5KGRlY3J5cHRlZFByb2ZpbGVLZXkpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGRlY3J5cHRNZW1iZXJQZW5kaW5nUHJvZmlsZUtleS8ke2xvZ0lkfTogRHJvcHBpbmcgcHJvZmlsZUtleSwgc2luY2UgaXQgd2FzIGludmFsaWRgXG4gICAgICApO1xuICAgICAgZGVjcnlwdGVkUHJvZmlsZUtleSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvLyByb2xlXG4gIGNvbnN0IHJvbGUgPSBkcm9wTnVsbChtZW1iZXIubWVtYmVyLnJvbGUpO1xuXG4gIHN0cmljdEFzc2VydChcbiAgICBpc1ZhbGlkUm9sZShyb2xlKSxcbiAgICBgZGVjcnlwdE1lbWJlclBlbmRpbmdQcm9maWxlS2V5OiBNZW1iZXIgaGFkIGludmFsaWQgcm9sZSAke3JvbGV9YFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgYWRkZWRCeVVzZXJJZCxcbiAgICB0aW1lc3RhbXAsXG4gICAgbWVtYmVyOiB7XG4gICAgICB1c2VySWQ6IGRlY3J5cHRlZFVzZXJJZCxcbiAgICAgIHByb2ZpbGVLZXk6IGRlY3J5cHRlZFByb2ZpbGVLZXksXG4gICAgICByb2xlLFxuICAgIH0sXG4gIH07XG59XG5cbnR5cGUgRGVjcnlwdGVkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwgPSB7XG4gIHVzZXJJZDogc3RyaW5nO1xuICBwcm9maWxlS2V5PzogVWludDhBcnJheTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59O1xuXG5mdW5jdGlvbiBkZWNyeXB0TWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwoXG4gIGNsaWVudFprR3JvdXBDaXBoZXI6IENsaWVudFprR3JvdXBDaXBoZXIsXG4gIG1lbWJlcjogUmVhZG9ubHk8UHJvdG8uSU1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsPixcbiAgbG9nSWQ6IHN0cmluZ1xuKTogRGVjcnlwdGVkTWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwgfCB1bmRlZmluZWQge1xuICAvLyB0aW1lc3RhbXBcbiAgY29uc3QgdGltZXN0YW1wID0gbm9ybWFsaXplVGltZXN0YW1wKG1lbWJlci50aW1lc3RhbXApO1xuXG4gIGNvbnN0IHsgdXNlcklkLCBwcm9maWxlS2V5IH0gPSBtZW1iZXI7XG5cbiAgLy8gdXNlcklkXG4gIHN0cmljdEFzc2VydChcbiAgICBCeXRlcy5pc05vdEVtcHR5KHVzZXJJZCksXG4gICAgJ2RlY3J5cHRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbDogTWlzc2luZyB1c2VySWQnXG4gICk7XG5cbiAgbGV0IGRlY3J5cHRlZFVzZXJJZDogc3RyaW5nO1xuICB0cnkge1xuICAgIGRlY3J5cHRlZFVzZXJJZCA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICBkZWNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCB1c2VySWQpLFxuICAgICAgJ2RlY3J5cHRNZW1iZXJQZW5kaW5nQWRtaW5BcHByb3ZhbC51c2VySWQnXG4gICAgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBkZWNyeXB0TWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwvJHtsb2dJZH06IFVuYWJsZSB0byBkZWNyeXB0IHBlbmRpbmcgbWVtYmVyIHVzZXJJZC4gRHJvcHBpbmcgbWVtYmVyLmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoIWlzVmFsaWRVdWlkKGRlY3J5cHRlZFVzZXJJZCkpIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBkZWNyeXB0TWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwvJHtsb2dJZH06IEludmFsaWQgdXNlcklkLiBEcm9wcGluZyBtZW1iZXIuYFxuICAgICk7XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gcHJvZmlsZUtleVxuICBsZXQgZGVjcnlwdGVkUHJvZmlsZUtleTogVWludDhBcnJheSB8IHVuZGVmaW5lZDtcbiAgaWYgKEJ5dGVzLmlzTm90RW1wdHkocHJvZmlsZUtleSkpIHtcbiAgICB0cnkge1xuICAgICAgZGVjcnlwdGVkUHJvZmlsZUtleSA9IGRlY3J5cHRQcm9maWxlS2V5KFxuICAgICAgICBjbGllbnRaa0dyb3VwQ2lwaGVyLFxuICAgICAgICBwcm9maWxlS2V5LFxuICAgICAgICBVVUlELmNhc3QoZGVjcnlwdGVkVXNlcklkKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBkZWNyeXB0TWVtYmVyUGVuZGluZ0FkbWluQXBwcm92YWwvJHtsb2dJZH06IFVuYWJsZSB0byBkZWNyeXB0IHByb2ZpbGVLZXkuIERyb3BwaW5nIHByb2ZpbGVLZXkuYCxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghaXNWYWxpZFByb2ZpbGVLZXkoZGVjcnlwdGVkUHJvZmlsZUtleSkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgZGVjcnlwdE1lbWJlclBlbmRpbmdBZG1pbkFwcHJvdmFsLyR7bG9nSWR9OiBEcm9wcGluZyBwcm9maWxlS2V5LCBzaW5jZSBpdCB3YXMgaW52YWxpZGBcbiAgICAgICk7XG5cbiAgICAgIGRlY3J5cHRlZFByb2ZpbGVLZXkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0aW1lc3RhbXAsXG4gICAgdXNlcklkOiBkZWNyeXB0ZWRVc2VySWQsXG4gICAgcHJvZmlsZUtleTogZGVjcnlwdGVkUHJvZmlsZUtleSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lbWJlcnNoaXBMaXN0KFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBBcnJheTx7IHV1aWQ6IFVVSURTdHJpbmdUeXBlOyB1dWlkQ2lwaGVydGV4dDogVWludDhBcnJheSB9PiB7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRNZW1iZXJzaGlwTGlzdDogY2Fubm90IGZpbmQgY29udmVyc2F0aW9uJyk7XG4gIH1cblxuICBjb25zdCBzZWNyZXRQYXJhbXMgPSBjb252ZXJzYXRpb24uZ2V0KCdzZWNyZXRQYXJhbXMnKTtcbiAgaWYgKCFzZWNyZXRQYXJhbXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE1lbWJlcnNoaXBMaXN0OiBubyBzZWNyZXRQYXJhbXMnKTtcbiAgfVxuXG4gIGNvbnN0IGNsaWVudFprR3JvdXBDaXBoZXIgPSBnZXRDbGllbnRaa0dyb3VwQ2lwaGVyKHNlY3JldFBhcmFtcyk7XG5cbiAgcmV0dXJuIGNvbnZlcnNhdGlvbi5nZXRNZW1iZXJzKCkubWFwKG1lbWJlciA9PiB7XG4gICAgY29uc3QgdXVpZCA9IG1lbWJlci5nZXRDaGVja2VkVXVpZCgnZ2V0TWVtYmVyc2hpcExpc3Q6IG1lbWJlciBoYXMgbm8gVVVJRCcpO1xuXG4gICAgY29uc3QgdXVpZENpcGhlcnRleHQgPSBlbmNyeXB0VXVpZChjbGllbnRaa0dyb3VwQ2lwaGVyLCB1dWlkKTtcbiAgICByZXR1cm4geyB1dWlkOiB1dWlkLnRvU3RyaW5nKCksIHV1aWRDaXBoZXJ0ZXh0IH07XG4gIH0pO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQU9PO0FBQ1Asa0JBQWlCO0FBRWpCLGtCQUE4QjtBQUM5Qix1QkFBZ0I7QUFDaEIsVUFBcUI7QUFDckIsb0NBR087QUFDUCxvQkFBMEI7QUFDMUIsMkJBQW1EO0FBQ25ELG9CQUFxQztBQUNyQyx1QkFBaUM7QUFDakMsZ0JBQTJCO0FBQzNCLDJCQUE4QjtBQUM5QixzQkFBeUI7QUFTekIscUJBaUJPO0FB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
