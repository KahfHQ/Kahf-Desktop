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
  COLORS_CHANGED: () => COLORS_CHANGED,
  COLOR_SELECTED: () => COLOR_SELECTED,
  ConversationTypes: () => ConversationTypes,
  InteractionModes: () => InteractionModes,
  SELECTED_CONVERSATION_CHANGED: () => SELECTED_CONVERSATION_CHANGED,
  actions: () => actions,
  cancelConversationVerification: () => cancelConversationVerification,
  clearCancelledConversationVerification: () => clearCancelledConversationVerification,
  getConversationCallMode: () => getConversationCallMode,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer,
  updateConversationLookups: () => updateConversationLookups,
  useConversationsActions: () => useConversationsActions
});
module.exports = __toCommonJS(conversations_exports);
var import_lodash = require("lodash");
var groups = __toESM(require("../../groups"));
var log = __toESM(require("../../logging/log"));
var import_calling = require("../../services/calling");
var import_getOwn = require("../../util/getOwn");
var import_assert = require("../../util/assert");
var universalExpireTimer = __toESM(require("../../util/universalExpireTimer"));
var import_globalModals = require("./globalModals");
var import_isRecord = require("../../util/isRecord");
var import_Calling = require("../../types/Calling");
var import_limits = require("../../groups/limits");
var import_isMessageUnread = require("../../util/isMessageUnread");
var import_toggleSelectedContactForGroupAddition = require("../../groups/toggleSelectedContactForGroupAddition");
var import_contactSpoofing = require("../../util/contactSpoofing");
var import_writeProfile = require("../../services/writeProfile");
var import_writeUsername = require("../../services/writeUsername");
var import_conversations = require("../selectors/conversations");
var import_Avatar = require("../../types/Avatar");
var import_getAvatarData = require("../../util/getAvatarData");
var import_isSameAvatarData = require("../../util/isSameAvatarData");
var import_longRunningTaskWrapper = require("../../util/longRunningTaskWrapper");
var import_conversationsEnums = require("./conversationsEnums");
var import_showToast = require("../../util/showToast");
var import_ToastFailedToDeleteUsername = require("../../components/ToastFailedToDeleteUsername");
var import_useBoundActions = require("../../hooks/useBoundActions");
var import_conversationJobQueue = require("../../jobs/conversationJobQueue");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_missingCaseError = require("../../util/missingCaseError");
const InteractionModes = ["mouse", "keyboard"];
const ConversationTypes = ["direct", "group"];
const getConversationCallMode = /* @__PURE__ */ __name((conversation) => {
  if (conversation.left || conversation.isBlocked || conversation.isMe || !conversation.acceptedMessageRequest) {
    return import_Calling.CallMode.None;
  }
  if (conversation.type === "direct") {
    return import_Calling.CallMode.Direct;
  }
  if (conversation.type === "group" && conversation.groupVersion === 2) {
    return import_Calling.CallMode.Group;
  }
  return import_Calling.CallMode.None;
}, "getConversationCallMode");
const CANCEL_CONVERSATION_PENDING_VERIFICATION = "conversations/CANCEL_CONVERSATION_PENDING_VERIFICATION";
const CLEAR_CANCELLED_VERIFICATION = "conversations/CLEAR_CANCELLED_VERIFICATION";
const CLEAR_CONVERSATIONS_PENDING_VERIFICATION = "conversations/CLEAR_CONVERSATIONS_PENDING_VERIFICATION";
const COLORS_CHANGED = "conversations/COLORS_CHANGED";
const COLOR_SELECTED = "conversations/COLOR_SELECTED";
const COMPOSE_TOGGLE_EDITING_AVATAR = "conversations/compose/COMPOSE_TOGGLE_EDITING_AVATAR";
const COMPOSE_ADD_AVATAR = "conversations/compose/ADD_AVATAR";
const COMPOSE_REMOVE_AVATAR = "conversations/compose/REMOVE_AVATAR";
const COMPOSE_REPLACE_AVATAR = "conversations/compose/REPLACE_AVATAR";
const CUSTOM_COLOR_REMOVED = "conversations/CUSTOM_COLOR_REMOVED";
const CONVERSATION_STOPPED_BY_MISSING_VERIFICATION = "conversations/CONVERSATION_STOPPED_BY_MISSING_VERIFICATION";
const DISCARD_MESSAGES = "conversations/DISCARD_MESSAGES";
const REPLACE_AVATARS = "conversations/REPLACE_AVATARS";
const UPDATE_USERNAME_SAVE_STATE = "conversations/UPDATE_USERNAME_SAVE_STATE";
const SELECTED_CONVERSATION_CHANGED = "conversations/SELECTED_CONVERSATION_CHANGED";
const actions = {
  cancelConversationVerification,
  changeHasGroupLink,
  clearCancelledConversationVerification,
  clearGroupCreationError,
  clearInvitedUuidsForNewlyCreatedGroup,
  clearSelectedMessage,
  clearUnreadMetrics,
  clearUsernameSave,
  closeContactSpoofingReview,
  closeMaximumGroupSizeModal,
  closeRecommendedGroupSizeModal,
  colorSelected,
  composeDeleteAvatarFromDisk,
  composeReplaceAvatar,
  composeSaveAvatarToDisk,
  conversationAdded,
  conversationChanged,
  conversationRemoved,
  conversationStoppedByMissingVerification,
  conversationUnloaded,
  createGroup,
  deleteAvatarFromDisk,
  discardMessages,
  doubleCheckMissingQuoteReference,
  generateNewGroupLink,
  messageChanged,
  messageDeleted,
  messageExpanded,
  messagesAdded,
  messagesReset,
  myProfileChanged,
  removeAllConversations,
  removeCustomColorOnConversations,
  removeMemberFromGroup,
  repairNewestMessage,
  repairOldestMessage,
  replaceAvatar,
  resetAllChatColors,
  reviewGroupMemberNameCollision,
  reviewMessageRequestNameCollision,
  saveAvatarToDisk,
  saveUsername,
  scrollToMessage,
  selectMessage,
  setAccessControlAddFromInviteLinkSetting,
  setComposeGroupAvatar,
  setComposeGroupExpireTimer,
  setComposeGroupName,
  setComposeSearchTerm,
  setIsFetchingUUID,
  setIsNearBottom,
  setMessageLoadingState,
  setPreJoinConversation,
  setRecentMediaItems,
  setSelectedConversationHeaderTitle,
  setSelectedConversationPanelDepth,
  showArchivedConversations,
  showChooseGroupMembers,
  showInbox,
  showConversation,
  startComposing,
  startSettingGroupMetadata,
  tagGroupsAsNewGroupStory,
  toggleAdmin,
  toggleConversationInChooseMembers,
  toggleComposeEditingAvatar,
  toggleHideStories,
  updateConversationModelSharedGroups,
  verifyConversationsStoppingSend
};
const useConversationsActions = /* @__PURE__ */ __name(() => (0, import_useBoundActions.useBoundActions)(actions), "useConversationsActions");
function filterAvatarData(avatars, data) {
  return avatars.filter((avatarData) => !(0, import_isSameAvatarData.isSameAvatarData)(data, avatarData));
}
function getNextAvatarId(avatars) {
  return Math.max(...avatars.map((x) => Number(x.id))) + 1;
}
async function getAvatarsAndUpdateConversation(conversations, conversationId, getNextAvatarsData) {
  const conversation = window.ConversationController.get(conversationId);
  if (!conversation) {
    throw new Error("No conversation found");
  }
  const { conversationLookup } = conversations;
  const conversationAttrs = conversationLookup[conversationId];
  const avatars = conversationAttrs.avatars || (0, import_getAvatarData.getAvatarData)(conversation.attributes);
  const nextAvatarId = getNextAvatarId(avatars);
  const nextAvatars = getNextAvatarsData(avatars, nextAvatarId);
  conversation.attributes.avatars = nextAvatars.map((avatarData) => (0, import_lodash.omit)(avatarData, ["buffer"]));
  await window.Signal.Data.updateConversation(conversation.attributes);
  return nextAvatars;
}
function deleteAvatarFromDisk(avatarData, conversationId) {
  return async (dispatch, getState) => {
    if (avatarData.imagePath) {
      await window.Signal.Migrations.deleteAvatar(avatarData.imagePath);
    } else {
      log.info("No imagePath for avatarData. Removing from userAvatarData, but not disk");
    }
    (0, import_assert.strictAssert)(conversationId, "conversationId not provided");
    const avatars = await getAvatarsAndUpdateConversation(getState().conversations, conversationId, (prevAvatarsData) => filterAvatarData(prevAvatarsData, avatarData));
    dispatch({
      type: REPLACE_AVATARS,
      payload: {
        conversationId,
        avatars
      }
    });
  };
}
function changeHasGroupLink(conversationId, value) {
  return async (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (!conversation) {
      throw new Error("No conversation found");
    }
    await (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
      name: "toggleGroupLink",
      idForLogging: conversation.idForLogging(),
      task: async () => conversation.toggleGroupLink(value)
    });
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function generateNewGroupLink(conversationId) {
  return async (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (!conversation) {
      throw new Error("No conversation found");
    }
    await (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
      name: "refreshGroupLink",
      idForLogging: conversation.idForLogging(),
      task: async () => conversation.refreshGroupLink()
    });
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function setAccessControlAddFromInviteLinkSetting(conversationId, value) {
  return async (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (!conversation) {
      throw new Error("No conversation found");
    }
    await (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
      idForLogging: conversation.idForLogging(),
      name: "updateAccessControlAddFromInviteLink",
      task: async () => conversation.updateAccessControlAddFromInviteLink(value)
    });
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function discardMessages(payload) {
  return { type: DISCARD_MESSAGES, payload };
}
function replaceAvatar(curr, prev, conversationId) {
  return async (dispatch, getState) => {
    (0, import_assert.strictAssert)(conversationId, "conversationId not provided");
    const avatars = await getAvatarsAndUpdateConversation(getState().conversations, conversationId, (prevAvatarsData, nextId) => {
      const newAvatarData = {
        ...curr,
        id: prev?.id ?? nextId
      };
      const existingAvatarsData = prev ? filterAvatarData(prevAvatarsData, prev) : prevAvatarsData;
      return [newAvatarData, ...existingAvatarsData];
    });
    dispatch({
      type: REPLACE_AVATARS,
      payload: {
        conversationId,
        avatars
      }
    });
  };
}
function saveAvatarToDisk(avatarData, conversationId) {
  return async (dispatch, getState) => {
    if (!avatarData.buffer) {
      throw new Error("No avatar Uint8Array provided");
    }
    (0, import_assert.strictAssert)(conversationId, "conversationId not provided");
    const imagePath = await window.Signal.Migrations.writeNewAvatarData(avatarData.buffer);
    const avatars = await getAvatarsAndUpdateConversation(getState().conversations, conversationId, (prevAvatarsData, id) => {
      const newAvatarData = {
        ...avatarData,
        imagePath,
        id
      };
      return [newAvatarData, ...prevAvatarsData];
    });
    dispatch({
      type: REPLACE_AVATARS,
      payload: {
        conversationId,
        avatars
      }
    });
  };
}
function makeUsernameSaveType(newSaveState) {
  return {
    type: UPDATE_USERNAME_SAVE_STATE,
    payload: {
      newSaveState
    }
  };
}
function clearUsernameSave() {
  return makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.None);
}
function saveUsername({
  username,
  previousUsername
}) {
  return async (dispatch, getState) => {
    const state = getState();
    const previousState = (0, import_conversations.getUsernameSaveState)(state);
    if (previousState !== import_conversationsEnums.UsernameSaveState.None) {
      log.error(`saveUsername: Save requested, but previous state was ${previousState}`);
      dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.GeneralError));
      return;
    }
    try {
      dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.Saving));
      await (0, import_writeUsername.writeUsername)({ username, previousUsername });
      dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.Success));
    } catch (error) {
      if (!username) {
        dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.DeleteFailed));
        (0, import_showToast.showToast)(import_ToastFailedToDeleteUsername.ToastFailedToDeleteUsername);
        return;
      }
      if (!(0, import_isRecord.isRecord)(error)) {
        dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.GeneralError));
        return;
      }
      if (error.code === 409) {
        dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.UsernameTakenError));
        return;
      }
      if (error.code === 400) {
        dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.UsernameMalformedError));
        return;
      }
      dispatch(makeUsernameSaveType(import_conversationsEnums.UsernameSaveState.GeneralError));
    }
  };
}
function myProfileChanged(profileData, avatar) {
  return async (dispatch, getState) => {
    const conversation = (0, import_conversations.getMe)(getState());
    try {
      await (0, import_writeProfile.writeProfile)({
        ...conversation,
        ...profileData
      }, avatar);
      dispatch({
        type: "NOOP",
        payload: null
      });
    } catch (err) {
      log.error("myProfileChanged", err && err.stack ? err.stack : err);
      dispatch({ type: import_globalModals.TOGGLE_PROFILE_EDITOR_ERROR });
    }
  };
}
function removeCustomColorOnConversations(colorId) {
  return async (dispatch) => {
    const conversationsToUpdate = [];
    window.getConversations().forEach((conversation) => {
      if (conversation.get("customColorId") === colorId) {
        delete conversation.attributes.conversationColor;
        delete conversation.attributes.customColor;
        delete conversation.attributes.customColorId;
        conversationsToUpdate.push(conversation.attributes);
      }
    });
    if (conversationsToUpdate.length) {
      await window.Signal.Data.updateConversations(conversationsToUpdate);
    }
    dispatch({
      type: CUSTOM_COLOR_REMOVED,
      payload: {
        colorId
      }
    });
  };
}
function resetAllChatColors() {
  return async (dispatch) => {
    await window.Signal.Data.updateAllConversationColors();
    window.getConversations().forEach((conversation) => {
      delete conversation.attributes.conversationColor;
      delete conversation.attributes.customColor;
      delete conversation.attributes.customColorId;
    });
    dispatch({
      type: COLORS_CHANGED,
      payload: {
        conversationColor: void 0,
        customColorData: void 0
      }
    });
  };
}
function colorSelected({
  conversationId,
  conversationColor,
  customColorData
}) {
  return async (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (conversation) {
      if (conversationColor) {
        conversation.attributes.conversationColor = conversationColor;
        if (customColorData) {
          conversation.attributes.customColor = customColorData.value;
          conversation.attributes.customColorId = customColorData.id;
        } else {
          delete conversation.attributes.customColor;
          delete conversation.attributes.customColorId;
        }
      } else {
        delete conversation.attributes.conversationColor;
        delete conversation.attributes.customColor;
        delete conversation.attributes.customColorId;
      }
      await window.Signal.Data.updateConversation(conversation.attributes);
    }
    dispatch({
      type: COLOR_SELECTED,
      payload: {
        conversationId,
        conversationColor,
        customColorData
      }
    });
  };
}
function toggleComposeEditingAvatar() {
  return {
    type: COMPOSE_TOGGLE_EDITING_AVATAR
  };
}
function cancelConversationVerification(canceledAt) {
  return (dispatch, getState) => {
    const state = getState();
    const conversationIdsBlocked = (0, import_conversations.getConversationIdsStoppedForVerification)(state);
    dispatch({
      type: CANCEL_CONVERSATION_PENDING_VERIFICATION,
      payload: {
        canceledAt: canceledAt ?? Date.now()
      }
    });
    conversationIdsBlocked.forEach((conversationId) => {
      import_conversationJobQueue.conversationJobQueue.resolveVerificationWaiter(conversationId);
    });
  };
}
function verifyConversationsStoppingSend() {
  return async (dispatch, getState) => {
    const state = getState();
    const uuidsStoppingSend = (0, import_conversations.getConversationUuidsStoppingSend)(state);
    const conversationIdsBlocked = (0, import_conversations.getConversationIdsStoppedForVerification)(state);
    log.info(`verifyConversationsStoppingSend: Starting with ${conversationIdsBlocked.length} blocked conversations and ${uuidsStoppingSend.length} conversations to verify.`);
    const promises = [];
    uuidsStoppingSend.forEach(async (uuid) => {
      const conversation = window.ConversationController.get(uuid);
      if (!conversation) {
        log.warn(`verifyConversationsStoppingSend: Cannot verify missing converastion for uuid ${uuid}`);
        return;
      }
      log.info(`verifyConversationsStoppingSend: Verifying conversation ${conversation.idForLogging()}`);
      if (conversation.isUnverified()) {
        promises.push(conversation.setVerifiedDefault());
      }
      promises.push(conversation.setApproved());
    });
    dispatch({
      type: CLEAR_CONVERSATIONS_PENDING_VERIFICATION
    });
    await Promise.all(promises);
    conversationIdsBlocked.forEach((conversationId) => {
      import_conversationJobQueue.conversationJobQueue.resolveVerificationWaiter(conversationId);
    });
  };
}
function clearCancelledConversationVerification(conversationId) {
  return {
    type: CLEAR_CANCELLED_VERIFICATION,
    payload: {
      conversationId
    }
  };
}
function composeSaveAvatarToDisk(avatarData) {
  return async (dispatch) => {
    if (!avatarData.buffer) {
      throw new Error("No avatar Uint8Array provided");
    }
    const imagePath = await window.Signal.Migrations.writeNewAvatarData(avatarData.buffer);
    dispatch({
      type: COMPOSE_ADD_AVATAR,
      payload: {
        ...avatarData,
        imagePath
      }
    });
  };
}
function composeDeleteAvatarFromDisk(avatarData) {
  return async (dispatch) => {
    if (avatarData.imagePath) {
      await window.Signal.Migrations.deleteAvatar(avatarData.imagePath);
    } else {
      log.info("No imagePath for avatarData. Removing from userAvatarData, but not disk");
    }
    dispatch({
      type: COMPOSE_REMOVE_AVATAR,
      payload: avatarData
    });
  };
}
function composeReplaceAvatar(curr, prev) {
  return {
    type: COMPOSE_REPLACE_AVATAR,
    payload: {
      curr,
      prev
    }
  };
}
function setPreJoinConversation(data) {
  return {
    type: "SET_PRE_JOIN_CONVERSATION",
    payload: {
      data
    }
  };
}
function conversationAdded(id, data) {
  return {
    type: "CONVERSATION_ADDED",
    payload: {
      id,
      data
    }
  };
}
function conversationChanged(id, data) {
  return (dispatch) => {
    import_calling.calling.groupMembersChanged(id);
    dispatch({
      type: "CONVERSATION_CHANGED",
      payload: {
        id,
        data
      }
    });
  };
}
function conversationRemoved(id) {
  return {
    type: "CONVERSATION_REMOVED",
    payload: {
      id
    }
  };
}
function conversationUnloaded(id) {
  return {
    type: "CONVERSATION_UNLOADED",
    payload: {
      id
    }
  };
}
function createGroup(createGroupV2 = groups.createGroupV2) {
  return async (dispatch, getState) => {
    const { composer } = getState().conversations;
    if (composer?.step !== import_conversationsEnums.ComposerStep.SetGroupMetadata || composer.isCreating) {
      (0, import_assert.assert)(false, "Cannot create group in this stage; doing nothing");
      return;
    }
    dispatch({ type: "CREATE_GROUP_PENDING" });
    try {
      const conversation = await createGroupV2({
        name: composer.groupName.trim(),
        avatar: composer.groupAvatar,
        avatars: composer.userAvatarData.map((avatarData) => (0, import_lodash.omit)(avatarData, ["buffer"])),
        expireTimer: composer.groupExpireTimer,
        conversationIds: composer.selectedConversationIds
      });
      dispatch({
        type: "CREATE_GROUP_FULFILLED",
        payload: {
          invitedUuids: (conversation.get("pendingMembersV2") || []).map((member) => member.uuid)
        }
      });
      dispatch(showConversation({
        conversationId: conversation.id,
        switchToAssociatedView: true
      }));
    } catch (err) {
      log.error("Failed to create group", err && err.stack ? err.stack : err);
      dispatch({ type: "CREATE_GROUP_REJECTED" });
    }
  };
}
function removeAllConversations() {
  return {
    type: "CONVERSATIONS_REMOVE_ALL",
    payload: null
  };
}
function selectMessage(messageId, conversationId) {
  return {
    type: "MESSAGE_SELECTED",
    payload: {
      messageId,
      conversationId
    }
  };
}
function conversationStoppedByMissingVerification(payload) {
  payload.untrustedUuids.forEach((uuid) => {
    const conversation = window.ConversationController.get(uuid);
    if (!conversation) {
      log.error(`conversationStoppedByMissingVerification: uuid ${uuid} not found!`);
      return;
    }
    conversation.getProfiles();
  });
  return {
    type: CONVERSATION_STOPPED_BY_MISSING_VERIFICATION,
    payload
  };
}
function messageChanged(id, conversationId, data) {
  return {
    type: "MESSAGE_CHANGED",
    payload: {
      id,
      conversationId,
      data
    }
  };
}
function messageDeleted(id, conversationId) {
  return {
    type: "MESSAGE_DELETED",
    payload: {
      id,
      conversationId
    }
  };
}
function messageExpanded(id, displayLimit) {
  return {
    type: "MESSAGE_EXPANDED",
    payload: {
      id,
      displayLimit
    }
  };
}
function messagesAdded({
  conversationId,
  isActive,
  isJustSent,
  isNewMessage,
  messages
}) {
  return {
    type: "MESSAGES_ADDED",
    payload: {
      conversationId,
      isActive,
      isJustSent,
      isNewMessage,
      messages
    }
  };
}
function repairNewestMessage(conversationId) {
  return {
    type: "REPAIR_NEWEST_MESSAGE",
    payload: {
      conversationId
    }
  };
}
function repairOldestMessage(conversationId) {
  return {
    type: "REPAIR_OLDEST_MESSAGE",
    payload: {
      conversationId
    }
  };
}
function reviewGroupMemberNameCollision(groupConversationId) {
  return {
    type: "REVIEW_GROUP_MEMBER_NAME_COLLISION",
    payload: { groupConversationId }
  };
}
function reviewMessageRequestNameCollision(payload) {
  return { type: "REVIEW_MESSAGE_REQUEST_NAME_COLLISION", payload };
}
function messagesReset({
  conversationId,
  messages,
  metrics,
  scrollToMessageId,
  unboundedFetch
}) {
  for (const message of messages) {
    (0, import_assert.strictAssert)(message.conversationId === conversationId, `messagesReset(${conversationId}): invalid message conversationId ${message.conversationId}`);
  }
  return {
    type: "MESSAGES_RESET",
    payload: {
      unboundedFetch: Boolean(unboundedFetch),
      conversationId,
      messages,
      metrics,
      scrollToMessageId
    }
  };
}
function setMessageLoadingState(conversationId, messageLoadingState) {
  return {
    type: "SET_MESSAGE_LOADING_STATE",
    payload: {
      conversationId,
      messageLoadingState
    }
  };
}
function setIsNearBottom(conversationId, isNearBottom) {
  return {
    type: "SET_NEAR_BOTTOM",
    payload: {
      conversationId,
      isNearBottom
    }
  };
}
function setIsFetchingUUID(identifier, isFetching) {
  return {
    type: "SET_IS_FETCHING_UUID",
    payload: {
      identifier,
      isFetching
    }
  };
}
function setSelectedConversationHeaderTitle(title) {
  return {
    type: "SET_CONVERSATION_HEADER_TITLE",
    payload: { title }
  };
}
function setSelectedConversationPanelDepth(panelDepth) {
  return {
    type: "SET_SELECTED_CONVERSATION_PANEL_DEPTH",
    payload: { panelDepth }
  };
}
function setRecentMediaItems(id, recentMediaItems) {
  return {
    type: "SET_RECENT_MEDIA_ITEMS",
    payload: { id, recentMediaItems }
  };
}
function clearInvitedUuidsForNewlyCreatedGroup() {
  return { type: "CLEAR_INVITED_UUIDS_FOR_NEWLY_CREATED_GROUP" };
}
function clearGroupCreationError() {
  return { type: "CLEAR_GROUP_CREATION_ERROR" };
}
function clearSelectedMessage() {
  return {
    type: "CLEAR_SELECTED_MESSAGE",
    payload: null
  };
}
function clearUnreadMetrics(conversationId) {
  return {
    type: "CLEAR_UNREAD_METRICS",
    payload: {
      conversationId
    }
  };
}
function closeContactSpoofingReview() {
  return { type: "CLOSE_CONTACT_SPOOFING_REVIEW" };
}
function closeMaximumGroupSizeModal() {
  return { type: "CLOSE_MAXIMUM_GROUP_SIZE_MODAL" };
}
function closeRecommendedGroupSizeModal() {
  return { type: "CLOSE_RECOMMENDED_GROUP_SIZE_MODAL" };
}
function scrollToMessage(conversationId, messageId) {
  return {
    type: "SCROLL_TO_MESSAGE",
    payload: {
      conversationId,
      messageId
    }
  };
}
function setComposeGroupAvatar(groupAvatar) {
  return {
    type: "SET_COMPOSE_GROUP_AVATAR",
    payload: { groupAvatar }
  };
}
function setComposeGroupName(groupName) {
  return {
    type: "SET_COMPOSE_GROUP_NAME",
    payload: { groupName }
  };
}
function setComposeGroupExpireTimer(groupExpireTimer) {
  return {
    type: "SET_COMPOSE_GROUP_EXPIRE_TIMER",
    payload: { groupExpireTimer }
  };
}
function setComposeSearchTerm(searchTerm) {
  return {
    type: "SET_COMPOSE_SEARCH_TERM",
    payload: { searchTerm }
  };
}
function startComposing() {
  return { type: "START_COMPOSING" };
}
function showChooseGroupMembers() {
  return { type: "SHOW_CHOOSE_GROUP_MEMBERS" };
}
function startSettingGroupMetadata() {
  return { type: "START_SETTING_GROUP_METADATA" };
}
function toggleConversationInChooseMembers(conversationId) {
  return (dispatch) => {
    const maxRecommendedGroupSize = (0, import_limits.getGroupSizeRecommendedLimit)(151);
    const maxGroupSize = Math.max((0, import_limits.getGroupSizeHardLimit)(1001), maxRecommendedGroupSize + 1);
    (0, import_assert.assert)(maxGroupSize > maxRecommendedGroupSize, "Expected the hard max group size to be larger than the recommended maximum");
    dispatch({
      type: "TOGGLE_CONVERSATION_IN_CHOOSE_MEMBERS",
      payload: { conversationId, maxGroupSize, maxRecommendedGroupSize }
    });
  };
}
function toggleHideStories(conversationId) {
  return (dispatch) => {
    const conversationModel = window.ConversationController.get(conversationId);
    if (conversationModel) {
      conversationModel.toggleHideStories();
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function removeMemberFromGroup(conversationId, contactId) {
  return (dispatch) => {
    const conversationModel = window.ConversationController.get(conversationId);
    if (conversationModel) {
      const idForLogging = conversationModel.idForLogging();
      (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
        name: "removeMemberFromGroup",
        idForLogging,
        task: () => conversationModel.removeFromGroupV2(contactId)
      });
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function tagGroupsAsNewGroupStory(conversationIds) {
  return async (dispatch) => {
    await Promise.all(conversationIds.map(async (conversationId) => {
      const conversation = window.ConversationController.get(conversationId);
      if (!conversation) {
        return;
      }
      conversation.set({ isGroupStorySendReady: true });
      await window.Signal.Data.updateConversation(conversation.attributes);
    }));
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function toggleAdmin(conversationId, contactId) {
  return (dispatch) => {
    const conversationModel = window.ConversationController.get(conversationId);
    if (conversationModel) {
      conversationModel.toggleAdmin(contactId);
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function updateConversationModelSharedGroups(conversationId) {
  return (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (conversation && conversation.throttledUpdateSharedGroups) {
      conversation.throttledUpdateSharedGroups();
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function showInbox() {
  return {
    type: "SHOW_INBOX",
    payload: null
  };
}
function showConversation({
  conversationId,
  messageId,
  switchToAssociatedView
}) {
  return {
    type: SELECTED_CONVERSATION_CHANGED,
    payload: {
      id: conversationId,
      messageId,
      switchToAssociatedView
    }
  };
}
function showArchivedConversations() {
  return {
    type: "SHOW_ARCHIVED_CONVERSATIONS",
    payload: null
  };
}
function doubleCheckMissingQuoteReference(messageId) {
  const message = window.MessageController.getById(messageId);
  if (message) {
    message.doubleCheckMissingQuoteReference();
  }
  return {
    type: "NOOP",
    payload: null
  };
}
function getEmptyState() {
  return {
    conversationLookup: {},
    conversationsByE164: {},
    conversationsByUuid: {},
    conversationsByGroupId: {},
    conversationsByUsername: {},
    verificationDataByConversation: {},
    messagesByConversation: {},
    messagesLookup: {},
    selectedMessageCounter: 0,
    showArchived: false,
    selectedConversationTitle: "",
    selectedConversationPanelDepth: 0,
    usernameSaveState: import_conversationsEnums.UsernameSaveState.None
  };
}
function updateConversationLookups(added, removed, state) {
  const result = {
    conversationsByE164: state.conversationsByE164,
    conversationsByUuid: state.conversationsByUuid,
    conversationsByGroupId: state.conversationsByGroupId,
    conversationsByUsername: state.conversationsByUsername
  };
  if (removed && removed.e164) {
    result.conversationsByE164 = (0, import_lodash.omit)(result.conversationsByE164, removed.e164);
  }
  if (removed && removed.uuid) {
    result.conversationsByUuid = (0, import_lodash.omit)(result.conversationsByUuid, removed.uuid);
  }
  if (removed && removed.groupId) {
    result.conversationsByGroupId = (0, import_lodash.omit)(result.conversationsByGroupId, removed.groupId);
  }
  if (removed && removed.username) {
    result.conversationsByUsername = (0, import_lodash.omit)(result.conversationsByUsername, removed.username);
  }
  if (added && added.e164) {
    result.conversationsByE164 = {
      ...result.conversationsByE164,
      [added.e164]: added
    };
  }
  if (added && added.uuid) {
    result.conversationsByUuid = {
      ...result.conversationsByUuid,
      [added.uuid]: added
    };
  }
  if (added && added.groupId) {
    result.conversationsByGroupId = {
      ...result.conversationsByGroupId,
      [added.groupId]: added
    };
  }
  if (added && added.username) {
    result.conversationsByUsername = {
      ...result.conversationsByUsername,
      [added.username]: added
    };
  }
  return result;
}
function closeComposerModal(state, modalToClose) {
  const { composer } = state;
  if (composer?.step !== import_conversationsEnums.ComposerStep.ChooseGroupMembers) {
    (0, import_assert.assert)(false, "Can't close the modal in this composer step. Doing nothing");
    return state;
  }
  if (composer[modalToClose] !== import_conversationsEnums.OneTimeModalState.Showing) {
    return state;
  }
  return {
    ...state,
    composer: {
      ...composer,
      [modalToClose]: import_conversationsEnums.OneTimeModalState.Shown
    }
  };
}
function reducer(state = getEmptyState(), action) {
  if (action.type === CLEAR_CONVERSATIONS_PENDING_VERIFICATION) {
    return {
      ...state,
      verificationDataByConversation: {}
    };
  }
  if (action.type === CLEAR_CANCELLED_VERIFICATION) {
    const { conversationId } = action.payload;
    const { verificationDataByConversation } = state;
    const existingPendingState = (0, import_getOwn.getOwn)(verificationDataByConversation, conversationId);
    if (existingPendingState && existingPendingState.type === import_conversationsEnums.ConversationVerificationState.PendingVerification) {
      return state;
    }
    return {
      ...state,
      verificationDataByConversation: (0, import_lodash.omit)(verificationDataByConversation, conversationId)
    };
  }
  if (action.type === CANCEL_CONVERSATION_PENDING_VERIFICATION) {
    const { canceledAt } = action.payload;
    const { verificationDataByConversation } = state;
    const newverificationDataByConversation = {};
    const entries = Object.entries(verificationDataByConversation);
    if (!entries.length) {
      log.warn("CANCEL_CONVERSATION_PENDING_VERIFICATION: No conversations pending verification");
      return state;
    }
    for (const [conversationId, data] of entries) {
      if (data.type === import_conversationsEnums.ConversationVerificationState.VerificationCancelled && data.canceledAt > canceledAt) {
        newverificationDataByConversation[conversationId] = data;
      } else {
        newverificationDataByConversation[conversationId] = {
          type: import_conversationsEnums.ConversationVerificationState.VerificationCancelled,
          canceledAt
        };
      }
    }
    return {
      ...state,
      verificationDataByConversation: newverificationDataByConversation
    };
  }
  if (action.type === "CLEAR_INVITED_UUIDS_FOR_NEWLY_CREATED_GROUP") {
    return (0, import_lodash.omit)(state, "invitedUuidsForNewlyCreatedGroup");
  }
  if (action.type === "CLEAR_GROUP_CREATION_ERROR") {
    const { composer } = state;
    if (composer?.step !== import_conversationsEnums.ComposerStep.SetGroupMetadata) {
      (0, import_assert.assert)(false, "Can't clear group creation error in this composer state. Doing nothing");
      return state;
    }
    return {
      ...state,
      composer: {
        ...composer,
        hasError: false
      }
    };
  }
  if (action.type === "CLOSE_CONTACT_SPOOFING_REVIEW") {
    return (0, import_lodash.omit)(state, "contactSpoofingReview");
  }
  if (action.type === "CLOSE_MAXIMUM_GROUP_SIZE_MODAL") {
    return closeComposerModal(state, "maximumGroupSizeModalState");
  }
  if (action.type === "CLOSE_RECOMMENDED_GROUP_SIZE_MODAL") {
    return closeComposerModal(state, "recommendedGroupSizeModalState");
  }
  if (action.type === DISCARD_MESSAGES) {
    const { conversationId } = action.payload;
    if ("numberToKeepAtBottom" in action.payload) {
      const { numberToKeepAtBottom } = action.payload;
      const conversationMessages = (0, import_getOwn.getOwn)(state.messagesByConversation, conversationId);
      if (!conversationMessages) {
        return state;
      }
      const { messageIds: oldMessageIds } = conversationMessages;
      if (oldMessageIds.length <= numberToKeepAtBottom) {
        return state;
      }
      const messageIdsToRemove = oldMessageIds.slice(0, -numberToKeepAtBottom);
      const messageIdsToKeep = oldMessageIds.slice(-numberToKeepAtBottom);
      return {
        ...state,
        messagesLookup: (0, import_lodash.omit)(state.messagesLookup, messageIdsToRemove),
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: {
            ...conversationMessages,
            messageIds: messageIdsToKeep
          }
        }
      };
    }
    if ("numberToKeepAtTop" in action.payload) {
      const { numberToKeepAtTop } = action.payload;
      const conversationMessages = (0, import_getOwn.getOwn)(state.messagesByConversation, conversationId);
      if (!conversationMessages) {
        return state;
      }
      const { messageIds: oldMessageIds } = conversationMessages;
      if (oldMessageIds.length <= numberToKeepAtTop) {
        return state;
      }
      const messageIdsToRemove = oldMessageIds.slice(numberToKeepAtTop);
      const messageIdsToKeep = oldMessageIds.slice(0, numberToKeepAtTop);
      return {
        ...state,
        messagesLookup: (0, import_lodash.omit)(state.messagesLookup, messageIdsToRemove),
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: {
            ...conversationMessages,
            messageIds: messageIdsToKeep
          }
        }
      };
    }
    throw (0, import_missingCaseError.missingCaseError)(action.payload);
  }
  if (action.type === "SET_PRE_JOIN_CONVERSATION") {
    const { payload } = action;
    const { data } = payload;
    return {
      ...state,
      preJoinConversation: data
    };
  }
  if (action.type === "CONVERSATION_ADDED") {
    const { payload } = action;
    const { id, data } = payload;
    const { conversationLookup } = state;
    return {
      ...state,
      conversationLookup: {
        ...conversationLookup,
        [id]: data
      },
      ...updateConversationLookups(data, void 0, state)
    };
  }
  if (action.type === "CONVERSATION_CHANGED") {
    const { payload } = action;
    const { id, data } = payload;
    const { conversationLookup } = state;
    const { selectedConversationId } = state;
    let { showArchived } = state;
    const existing = conversationLookup[id];
    if (!existing || data === existing) {
      return state;
    }
    const keysToOmit = [];
    if (selectedConversationId === id) {
      if (existing.isArchived && !data.isArchived) {
        showArchived = false;
      }
      if (!existing.isArchived && data.isArchived) {
        keysToOmit.push("selectedConversationId");
      }
      if (!existing.isBlocked && data.isBlocked) {
        keysToOmit.push("contactSpoofingReview");
      }
    }
    return {
      ...(0, import_lodash.omit)(state, keysToOmit),
      selectedConversationId,
      showArchived,
      conversationLookup: {
        ...conversationLookup,
        [id]: data
      },
      ...updateConversationLookups(data, existing, state)
    };
  }
  if (action.type === "CONVERSATION_REMOVED") {
    const { payload } = action;
    const { id } = payload;
    const { conversationLookup } = state;
    const existing = (0, import_getOwn.getOwn)(conversationLookup, id);
    if (!existing) {
      return state;
    }
    return {
      ...state,
      conversationLookup: (0, import_lodash.omit)(conversationLookup, [id]),
      ...updateConversationLookups(void 0, existing, state)
    };
  }
  if (action.type === "CONVERSATION_UNLOADED") {
    const { payload } = action;
    const { id } = payload;
    const existingConversation = state.messagesByConversation[id];
    if (!existingConversation) {
      return state;
    }
    const { messageIds } = existingConversation;
    const selectedConversationId = state.selectedConversationId !== id ? state.selectedConversationId : void 0;
    return {
      ...(0, import_lodash.omit)(state, "contactSpoofingReview"),
      selectedConversationId,
      selectedConversationPanelDepth: 0,
      messagesLookup: (0, import_lodash.omit)(state.messagesLookup, messageIds),
      messagesByConversation: (0, import_lodash.omit)(state.messagesByConversation, [id])
    };
  }
  if (action.type === "CONVERSATIONS_REMOVE_ALL") {
    return getEmptyState();
  }
  if (action.type === "CREATE_GROUP_PENDING") {
    const { composer } = state;
    if (composer?.step !== import_conversationsEnums.ComposerStep.SetGroupMetadata) {
      return state;
    }
    return {
      ...state,
      composer: {
        ...composer,
        hasError: false,
        isCreating: true
      }
    };
  }
  if (action.type === "CREATE_GROUP_FULFILLED") {
    return {
      ...state,
      invitedUuidsForNewlyCreatedGroup: action.payload.invitedUuids
    };
  }
  if (action.type === "CREATE_GROUP_REJECTED") {
    const { composer } = state;
    if (composer?.step !== import_conversationsEnums.ComposerStep.SetGroupMetadata) {
      return state;
    }
    return {
      ...state,
      composer: {
        ...composer,
        hasError: true,
        isCreating: false
      }
    };
  }
  if (action.type === "SET_SELECTED_CONVERSATION_PANEL_DEPTH") {
    return {
      ...state,
      selectedConversationPanelDepth: action.payload.panelDepth
    };
  }
  if (action.type === "MESSAGE_SELECTED") {
    const { messageId, conversationId } = action.payload;
    if (state.selectedConversationId !== conversationId) {
      return state;
    }
    return {
      ...state,
      selectedMessage: messageId,
      selectedMessageCounter: state.selectedMessageCounter + 1
    };
  }
  if (action.type === CONVERSATION_STOPPED_BY_MISSING_VERIFICATION) {
    const { conversationId, untrustedUuids } = action.payload;
    const { verificationDataByConversation } = state;
    const existingPendingState = (0, import_getOwn.getOwn)(verificationDataByConversation, conversationId);
    if (!existingPendingState || existingPendingState.type === import_conversationsEnums.ConversationVerificationState.VerificationCancelled) {
      return {
        ...state,
        verificationDataByConversation: {
          ...verificationDataByConversation,
          [conversationId]: {
            type: import_conversationsEnums.ConversationVerificationState.PendingVerification,
            uuidsNeedingVerification: untrustedUuids
          }
        }
      };
    }
    const uuidsNeedingVerification = Array.from(/* @__PURE__ */ new Set([
      ...existingPendingState.uuidsNeedingVerification,
      ...untrustedUuids
    ]));
    return {
      ...state,
      verificationDataByConversation: {
        ...verificationDataByConversation,
        [conversationId]: {
          type: import_conversationsEnums.ConversationVerificationState.PendingVerification,
          uuidsNeedingVerification
        }
      }
    };
  }
  if (action.type === "MESSAGE_CHANGED") {
    const { id, conversationId, data } = action.payload;
    const existingConversation = state.messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    const existingMessage = (0, import_getOwn.getOwn)(state.messagesLookup, id);
    if (!existingMessage) {
      return state;
    }
    const conversationAttrs = state.conversationLookup[conversationId];
    const isGroupStoryReply = (0, import_whatTypeOfConversation.isGroup)(conversationAttrs) && data.storyId;
    if (isGroupStoryReply) {
      return state;
    }
    const toIncrement = data.reactions?.length ? 1 : 0;
    return {
      ...state,
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          messageChangeCounter: (existingConversation.messageChangeCounter || 0) + toIncrement
        }
      },
      messagesLookup: {
        ...state.messagesLookup,
        [id]: {
          ...data,
          displayLimit: existingMessage.displayLimit
        }
      }
    };
  }
  if (action.type === "MESSAGE_EXPANDED") {
    const { id, displayLimit } = action.payload;
    const existingMessage = state.messagesLookup[id];
    if (!existingMessage) {
      return state;
    }
    return {
      ...state,
      messagesLookup: {
        ...state.messagesLookup,
        [id]: {
          ...existingMessage,
          displayLimit
        }
      }
    };
  }
  if (action.type === "MESSAGES_RESET") {
    const {
      conversationId,
      messages,
      metrics,
      scrollToMessageId,
      unboundedFetch
    } = action.payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = messagesByConversation[conversationId];
    const lookup = (0, import_lodash.fromPairs)(messages.map((message) => [message.id, message]));
    const sorted = (0, import_lodash.orderBy)((0, import_lodash.values)(lookup), ["received_at", "sent_at"], ["ASC", "ASC"]);
    let { newest, oldest } = metrics;
    if (sorted.length > 0) {
      const first = sorted[0];
      if (first && (!oldest || first.received_at <= oldest.received_at)) {
        oldest = (0, import_lodash.pick)(first, ["id", "received_at", "sent_at"]);
      }
      const last = sorted[sorted.length - 1];
      if (last && (!newest || unboundedFetch || last.received_at >= newest.received_at)) {
        newest = (0, import_lodash.pick)(last, ["id", "received_at", "sent_at"]);
      }
    }
    const messageIds = sorted.map((message) => message.id);
    return {
      ...state,
      ...state.selectedConversationId === conversationId ? {
        selectedMessage: scrollToMessageId,
        selectedMessageCounter: state.selectedMessageCounter + 1
      } : {},
      messagesLookup: {
        ...messagesLookup,
        ...lookup
      },
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          messageChangeCounter: 0,
          scrollToMessageId,
          scrollToMessageCounter: existingConversation ? existingConversation.scrollToMessageCounter + 1 : 0,
          messageIds,
          metrics: {
            ...metrics,
            newest,
            oldest
          }
        }
      }
    };
  }
  if (action.type === "SET_MESSAGE_LOADING_STATE") {
    const { payload } = action;
    const { conversationId, messageLoadingState } = payload;
    const { messagesByConversation } = state;
    const existingConversation = messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    return {
      ...state,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          messageLoadingState
        }
      }
    };
  }
  if (action.type === "SET_NEAR_BOTTOM") {
    const { payload } = action;
    const { conversationId, isNearBottom } = payload;
    const { messagesByConversation } = state;
    const existingConversation = messagesByConversation[conversationId];
    if (!existingConversation || existingConversation.isNearBottom === isNearBottom) {
      return state;
    }
    return {
      ...state,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          isNearBottom
        }
      }
    };
  }
  if (action.type === "SCROLL_TO_MESSAGE") {
    const { payload } = action;
    const { conversationId, messageId } = payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    if (!messagesLookup[messageId]) {
      return state;
    }
    if (!existingConversation.messageIds.includes(messageId)) {
      return state;
    }
    return {
      ...state,
      selectedMessage: messageId,
      selectedMessageCounter: state.selectedMessageCounter + 1,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          messageLoadingState: void 0,
          scrollToMessageId: messageId,
          scrollToMessageCounter: existingConversation.scrollToMessageCounter + 1
        }
      }
    };
  }
  if (action.type === "MESSAGE_DELETED") {
    const { id, conversationId } = action.payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    const oldIds = existingConversation.messageIds;
    let { newest, oldest } = existingConversation.metrics;
    if (oldIds.length > 1) {
      const firstId = oldIds[0];
      const lastId = oldIds[oldIds.length - 1];
      if (oldest && oldest.id === firstId && firstId === id) {
        const second = messagesLookup[oldIds[1]];
        oldest = second ? (0, import_lodash.pick)(second, ["id", "received_at", "sent_at"]) : void 0;
      }
      if (newest && newest.id === lastId && lastId === id) {
        const penultimate = messagesLookup[oldIds[oldIds.length - 2]];
        newest = penultimate ? (0, import_lodash.pick)(penultimate, ["id", "received_at", "sent_at"]) : void 0;
      }
    }
    const messageIds = (0, import_lodash.without)(existingConversation.messageIds, id);
    let metrics;
    if (messageIds.length === 0) {
      metrics = {
        totalUnseen: 0
      };
    } else {
      metrics = {
        ...existingConversation.metrics,
        oldest,
        newest
      };
    }
    return {
      ...state,
      messagesLookup: (0, import_lodash.omit)(messagesLookup, id),
      messagesByConversation: {
        [conversationId]: {
          ...existingConversation,
          messageIds,
          metrics
        }
      }
    };
  }
  if (action.type === "REPAIR_NEWEST_MESSAGE") {
    const { conversationId } = action.payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = (0, import_getOwn.getOwn)(messagesByConversation, conversationId);
    if (!existingConversation) {
      return state;
    }
    const { messageIds } = existingConversation;
    const lastId = messageIds && messageIds.length ? messageIds[messageIds.length - 1] : void 0;
    const last = lastId ? (0, import_getOwn.getOwn)(messagesLookup, lastId) : void 0;
    const newest = last ? (0, import_lodash.pick)(last, ["id", "received_at", "sent_at"]) : void 0;
    return {
      ...state,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          metrics: {
            ...existingConversation.metrics,
            newest
          }
        }
      }
    };
  }
  if (action.type === "REPAIR_OLDEST_MESSAGE") {
    const { conversationId } = action.payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = (0, import_getOwn.getOwn)(messagesByConversation, conversationId);
    if (!existingConversation) {
      return state;
    }
    const { messageIds } = existingConversation;
    const firstId = messageIds && messageIds.length ? messageIds[0] : void 0;
    const first = firstId ? (0, import_getOwn.getOwn)(messagesLookup, firstId) : void 0;
    const oldest = first ? (0, import_lodash.pick)(first, ["id", "received_at", "sent_at"]) : void 0;
    return {
      ...state,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          metrics: {
            ...existingConversation.metrics,
            oldest
          }
        }
      }
    };
  }
  if (action.type === "REVIEW_GROUP_MEMBER_NAME_COLLISION") {
    return {
      ...state,
      contactSpoofingReview: {
        type: import_contactSpoofing.ContactSpoofingType.MultipleGroupMembersWithSameTitle,
        ...action.payload
      }
    };
  }
  if (action.type === "REVIEW_MESSAGE_REQUEST_NAME_COLLISION") {
    return {
      ...state,
      contactSpoofingReview: {
        type: import_contactSpoofing.ContactSpoofingType.DirectConversationWithSameTitle,
        ...action.payload
      }
    };
  }
  if (action.type === "MESSAGES_ADDED") {
    const { conversationId, isActive, isJustSent, isNewMessage, messages } = action.payload;
    const { messagesByConversation, messagesLookup } = state;
    const existingConversation = messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    let { newest, oldest, oldestUnseen, totalUnseen } = existingConversation.metrics;
    if (messages.length < 1) {
      return state;
    }
    const lookup = (0, import_lodash.fromPairs)(existingConversation.messageIds.map((id) => [id, messagesLookup[id]]));
    messages.forEach((message) => {
      lookup[message.id] = message;
    });
    const sorted = (0, import_lodash.orderBy)((0, import_lodash.values)(lookup), ["received_at", "sent_at"], ["ASC", "ASC"]);
    const messageIds = sorted.map((message) => message.id);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (!newest) {
      newest = (0, import_lodash.pick)(first, ["id", "received_at", "sent_at"]);
    }
    if (!oldest) {
      oldest = (0, import_lodash.pick)(last, ["id", "received_at", "sent_at"]);
    }
    const existingTotal = existingConversation.messageIds.length;
    if (isNewMessage && existingTotal > 0) {
      const lastMessageId = existingConversation.messageIds[existingTotal - 1];
      const haveLatest = newest && newest.id === lastMessageId;
      if (!haveLatest) {
        if (isJustSent) {
          log.warn("reducer/MESSAGES_ADDED: isJustSent is true, but haveLatest is false");
        }
        return state;
      }
    }
    if (first && oldest && first.received_at <= oldest.received_at) {
      oldest = (0, import_lodash.pick)(first, ["id", "received_at", "sent_at"]);
    }
    if (last && newest && last.received_at >= newest.received_at) {
      newest = (0, import_lodash.pick)(last, ["id", "received_at", "sent_at"]);
    }
    const newIds = messages.map((message) => message.id);
    const newMessageIds = (0, import_lodash.difference)(newIds, existingConversation.messageIds);
    const { isNearBottom } = existingConversation;
    if ((!isNearBottom || !isActive) && !oldestUnseen) {
      const oldestId = newMessageIds.find((messageId) => {
        const message = lookup[messageId];
        return message && (0, import_isMessageUnread.isMessageUnread)(message);
      });
      if (oldestId) {
        oldestUnseen = (0, import_lodash.pick)(lookup[oldestId], [
          "id",
          "received_at",
          "sent_at"
        ]);
      }
    }
    if (isNewMessage && !isJustSent && oldestUnseen) {
      const newUnread = newMessageIds.reduce((sum, messageId) => {
        const message = lookup[messageId];
        return sum + (message && (0, import_isMessageUnread.isMessageUnread)(message) ? 1 : 0);
      }, 0);
      totalUnseen = (totalUnseen || 0) + newUnread;
    }
    return {
      ...state,
      messagesLookup: {
        ...messagesLookup,
        ...lookup
      },
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          messageIds,
          messageLoadingState: void 0,
          scrollToMessageId: isJustSent ? last.id : void 0,
          metrics: {
            ...existingConversation.metrics,
            newest,
            oldest,
            totalUnseen,
            oldestUnseen
          }
        }
      }
    };
  }
  if (action.type === "CLEAR_SELECTED_MESSAGE") {
    return {
      ...state,
      selectedMessage: void 0
    };
  }
  if (action.type === "CLEAR_UNREAD_METRICS") {
    const { payload } = action;
    const { conversationId } = payload;
    const existingConversation = state.messagesByConversation[conversationId];
    if (!existingConversation) {
      return state;
    }
    return {
      ...state,
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: {
          ...existingConversation,
          metrics: {
            ...existingConversation.metrics,
            oldestUnseen: void 0,
            totalUnseen: 0
          }
        }
      }
    };
  }
  if (action.type === SELECTED_CONVERSATION_CHANGED) {
    const { payload } = action;
    const { id, messageId, switchToAssociatedView } = payload;
    const nextState = {
      ...(0, import_lodash.omit)(state, "contactSpoofingReview"),
      selectedConversationId: id,
      selectedMessage: messageId
    };
    if (switchToAssociatedView && id) {
      const conversation = (0, import_getOwn.getOwn)(state.conversationLookup, id);
      if (!conversation) {
        return nextState;
      }
      return {
        ...(0, import_lodash.omit)(nextState, "composer"),
        showArchived: Boolean(conversation.isArchived)
      };
    }
    return nextState;
  }
  if (action.type === "SHOW_INBOX") {
    return {
      ...(0, import_lodash.omit)(state, "composer"),
      showArchived: false
    };
  }
  if (action.type === "SHOW_ARCHIVED_CONVERSATIONS") {
    return {
      ...(0, import_lodash.omit)(state, "composer"),
      showArchived: true
    };
  }
  if (action.type === "SET_CONVERSATION_HEADER_TITLE") {
    return {
      ...state,
      selectedConversationTitle: action.payload.title
    };
  }
  if (action.type === "SET_RECENT_MEDIA_ITEMS") {
    const { id, recentMediaItems } = action.payload;
    const { conversationLookup } = state;
    const conversationData = conversationLookup[id];
    if (!conversationData) {
      return state;
    }
    const data = {
      ...conversationData,
      recentMediaItems
    };
    return {
      ...state,
      conversationLookup: {
        ...conversationLookup,
        [id]: data
      },
      ...updateConversationLookups(data, void 0, state)
    };
  }
  if (action.type === "START_COMPOSING") {
    if (state.composer?.step === import_conversationsEnums.ComposerStep.StartDirectConversation) {
      return state;
    }
    return {
      ...state,
      showArchived: false,
      composer: {
        step: import_conversationsEnums.ComposerStep.StartDirectConversation,
        searchTerm: "",
        uuidFetchState: {}
      }
    };
  }
  if (action.type === "SHOW_CHOOSE_GROUP_MEMBERS") {
    let selectedConversationIds;
    let recommendedGroupSizeModalState;
    let maximumGroupSizeModalState;
    let groupName;
    let groupAvatar;
    let groupExpireTimer;
    let userAvatarData = (0, import_Avatar.getDefaultAvatars)(true);
    switch (state.composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
        return state;
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        ({
          selectedConversationIds,
          recommendedGroupSizeModalState,
          maximumGroupSizeModalState,
          groupName,
          groupAvatar,
          groupExpireTimer,
          userAvatarData
        } = state.composer);
        break;
      default:
        selectedConversationIds = [];
        recommendedGroupSizeModalState = import_conversationsEnums.OneTimeModalState.NeverShown;
        maximumGroupSizeModalState = import_conversationsEnums.OneTimeModalState.NeverShown;
        groupName = "";
        groupExpireTimer = universalExpireTimer.get();
        break;
    }
    return {
      ...state,
      showArchived: false,
      composer: {
        step: import_conversationsEnums.ComposerStep.ChooseGroupMembers,
        searchTerm: "",
        uuidFetchState: {},
        selectedConversationIds,
        recommendedGroupSizeModalState,
        maximumGroupSizeModalState,
        groupName,
        groupAvatar,
        groupExpireTimer,
        userAvatarData
      }
    };
  }
  if (action.type === "START_SETTING_GROUP_METADATA") {
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
        return {
          ...state,
          showArchived: false,
          composer: {
            step: import_conversationsEnums.ComposerStep.SetGroupMetadata,
            isEditingAvatar: false,
            isCreating: false,
            hasError: false,
            ...(0, import_lodash.pick)(composer, [
              "groupAvatar",
              "groupName",
              "groupExpireTimer",
              "maximumGroupSizeModalState",
              "recommendedGroupSizeModalState",
              "selectedConversationIds",
              "userAvatarData"
            ])
          }
        };
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return state;
      default:
        (0, import_assert.assert)(false, "Cannot transition to setting group metadata from this state");
        return state;
    }
  }
  if (action.type === "SET_COMPOSE_GROUP_AVATAR") {
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            groupAvatar: action.payload.groupAvatar
          }
        };
      default:
        (0, import_assert.assert)(false, "Setting compose group avatar at this step is a no-op");
        return state;
    }
  }
  if (action.type === "SET_COMPOSE_GROUP_NAME") {
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            groupName: action.payload.groupName
          }
        };
      default:
        (0, import_assert.assert)(false, "Setting compose group name at this step is a no-op");
        return state;
    }
  }
  if (action.type === "SET_COMPOSE_GROUP_EXPIRE_TIMER") {
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            groupExpireTimer: action.payload.groupExpireTimer
          }
        };
      default:
        (0, import_assert.assert)(false, "Setting compose group name at this step is a no-op");
        return state;
    }
  }
  if (action.type === "SET_COMPOSE_SEARCH_TERM") {
    const { composer } = state;
    if (!composer) {
      (0, import_assert.assert)(false, "Setting compose search term with the composer closed is a no-op");
      return state;
    }
    if (composer.step !== import_conversationsEnums.ComposerStep.StartDirectConversation && composer.step !== import_conversationsEnums.ComposerStep.ChooseGroupMembers) {
      (0, import_assert.assert)(false, `Setting compose search term at step ${composer.step} is a no-op`);
      return state;
    }
    return {
      ...state,
      composer: {
        ...composer,
        searchTerm: action.payload.searchTerm
      }
    };
  }
  if (action.type === "SET_IS_FETCHING_UUID") {
    const { composer } = state;
    if (!composer) {
      (0, import_assert.assert)(false, "Setting compose uuid fetch state with the composer closed is a no-op");
      return state;
    }
    if (composer.step !== import_conversationsEnums.ComposerStep.StartDirectConversation && composer.step !== import_conversationsEnums.ComposerStep.ChooseGroupMembers) {
      (0, import_assert.assert)(false, "Setting compose uuid fetch state at this step is a no-op");
      return state;
    }
    const { identifier, isFetching } = action.payload;
    const { uuidFetchState } = composer;
    return {
      ...state,
      composer: {
        ...composer,
        uuidFetchState: isFetching ? {
          ...composer.uuidFetchState,
          [identifier]: isFetching
        } : (0, import_lodash.omit)(uuidFetchState, identifier)
      }
    };
  }
  if (action.type === COMPOSE_TOGGLE_EDITING_AVATAR) {
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            isEditingAvatar: !composer.isEditingAvatar
          }
        };
      default:
        (0, import_assert.assert)(false, "Setting editing avatar at this step is a no-op");
        return state;
    }
  }
  if (action.type === COMPOSE_ADD_AVATAR) {
    const { payload } = action;
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            userAvatarData: [
              {
                ...payload,
                id: getNextAvatarId(composer.userAvatarData)
              },
              ...composer.userAvatarData
            ]
          }
        };
      default:
        (0, import_assert.assert)(false, "Adding an avatar at this step is a no-op");
        return state;
    }
  }
  if (action.type === COMPOSE_REMOVE_AVATAR) {
    const { payload } = action;
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            userAvatarData: filterAvatarData(composer.userAvatarData, payload)
          }
        };
      default:
        (0, import_assert.assert)(false, "Removing an avatar at this step is a no-op");
        return state;
    }
  }
  if (action.type === COMPOSE_REPLACE_AVATAR) {
    const { curr, prev } = action.payload;
    const { composer } = state;
    switch (composer?.step) {
      case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
      case import_conversationsEnums.ComposerStep.SetGroupMetadata:
        return {
          ...state,
          composer: {
            ...composer,
            userAvatarData: [
              {
                ...curr,
                id: prev?.id ?? getNextAvatarId(composer.userAvatarData)
              },
              ...prev ? filterAvatarData(composer.userAvatarData, prev) : composer.userAvatarData
            ]
          }
        };
      default:
        (0, import_assert.assert)(false, "Replacing an avatar at this step is a no-op");
        return state;
    }
  }
  if (action.type === "TOGGLE_CONVERSATION_IN_CHOOSE_MEMBERS") {
    const { composer } = state;
    if (composer?.step !== import_conversationsEnums.ComposerStep.ChooseGroupMembers) {
      (0, import_assert.assert)(false, "Toggling conversation members is a no-op in this composer step");
      return state;
    }
    return {
      ...state,
      composer: {
        ...composer,
        ...(0, import_toggleSelectedContactForGroupAddition.toggleSelectedContactForGroupAddition)(action.payload.conversationId, {
          maxGroupSize: action.payload.maxGroupSize,
          maxRecommendedGroupSize: action.payload.maxRecommendedGroupSize,
          maximumGroupSizeModalState: composer.maximumGroupSizeModalState,
          numberOfContactsAlreadyInGroup: 1,
          recommendedGroupSizeModalState: composer.recommendedGroupSizeModalState,
          selectedConversationIds: composer.selectedConversationIds
        })
      }
    };
  }
  if (action.type === COLORS_CHANGED) {
    const { conversationLookup } = state;
    const { conversationColor, customColorData } = action.payload;
    const nextState = {
      ...state
    };
    Object.keys(conversationLookup).forEach((id) => {
      const existing = conversationLookup[id];
      const added = {
        ...existing,
        conversationColor,
        customColor: customColorData?.value,
        customColorId: customColorData?.id
      };
      Object.assign(nextState, updateConversationLookups(added, existing, nextState), {
        conversationLookup: {
          ...nextState.conversationLookup,
          [id]: added
        }
      });
    });
    return nextState;
  }
  if (action.type === COLOR_SELECTED) {
    const { conversationLookup } = state;
    const { conversationId, conversationColor, customColorData } = action.payload;
    const existing = conversationLookup[conversationId];
    if (!existing) {
      return state;
    }
    const changed = {
      ...existing,
      conversationColor,
      customColor: customColorData?.value,
      customColorId: customColorData?.id
    };
    return {
      ...state,
      conversationLookup: {
        ...conversationLookup,
        [conversationId]: changed
      },
      ...updateConversationLookups(changed, existing, state)
    };
  }
  if (action.type === CUSTOM_COLOR_REMOVED) {
    const { conversationLookup } = state;
    const { colorId } = action.payload;
    const nextState = {
      ...state
    };
    Object.keys(conversationLookup).forEach((id) => {
      const existing = conversationLookup[id];
      if (existing.customColorId !== colorId) {
        return;
      }
      const changed = {
        ...existing,
        conversationColor: void 0,
        customColor: void 0,
        customColorId: void 0
      };
      Object.assign(nextState, updateConversationLookups(changed, existing, nextState), {
        conversationLookup: {
          ...nextState.conversationLookup,
          [id]: changed
        }
      });
    });
    return nextState;
  }
  if (action.type === REPLACE_AVATARS) {
    const { conversationLookup } = state;
    const { conversationId, avatars } = action.payload;
    const conversation = conversationLookup[conversationId];
    if (!conversation) {
      return state;
    }
    const changed = {
      ...conversation,
      avatars
    };
    return {
      ...state,
      conversationLookup: {
        ...conversationLookup,
        [conversationId]: changed
      },
      ...updateConversationLookups(changed, conversation, state)
    };
  }
  if (action.type === UPDATE_USERNAME_SAVE_STATE) {
    const { newSaveState } = action.payload;
    return {
      ...state,
      usernameSaveState: newSaveState
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COLORS_CHANGED,
  COLOR_SELECTED,
  ConversationTypes,
  InteractionModes,
  SELECTED_CONVERSATION_CHANGED,
  actions,
  cancelConversationVerification,
  clearCancelledConversationVerification,
  getConversationCallMode,
  getEmptyState,
  reducer,
  updateConversationLookups,
  useConversationsActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuXG5pbXBvcnQgdHlwZSB7IFRodW5rQWN0aW9uIH0gZnJvbSAncmVkdXgtdGh1bmsnO1xuaW1wb3J0IHtcbiAgZGlmZmVyZW5jZSxcbiAgZnJvbVBhaXJzLFxuICBvbWl0LFxuICBvcmRlckJ5LFxuICBwaWNrLFxuICB2YWx1ZXMsXG4gIHdpdGhvdXQsXG59IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB0eXBlIHsgU3RhdGVUeXBlIGFzIFJvb3RTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCAqIGFzIGdyb3VwcyBmcm9tICcuLi8uLi9ncm91cHMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IGNhbGxpbmcgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYWxsaW5nJztcbmltcG9ydCB7IGdldE93biB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0T3duJztcbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0ICogYXMgdW5pdmVyc2FsRXhwaXJlVGltZXIgZnJvbSAnLi4vLi4vdXRpbC91bml2ZXJzYWxFeHBpcmVUaW1lcic7XG5pbXBvcnQgdHlwZSB7IFRvZ2dsZVByb2ZpbGVFZGl0b3JFcnJvckFjdGlvblR5cGUgfSBmcm9tICcuL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyBUT0dHTEVfUFJPRklMRV9FRElUT1JfRVJST1IgfSBmcm9tICcuL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4uLy4uL3V0aWwvaXNSZWNvcmQnO1xuaW1wb3J0IHR5cGUge1xuICBVVUlERmV0Y2hTdGF0ZUtleVR5cGUsXG4gIFVVSURGZXRjaFN0YXRlVHlwZSxcbn0gZnJvbSAnLi4vLi4vdXRpbC91dWlkRmV0Y2hTdGF0ZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQXZhdGFyQ29sb3JUeXBlLFxuICBDb252ZXJzYXRpb25Db2xvclR5cGUsXG4gIEN1c3RvbUNvbG9yVHlwZSxcbn0gZnJvbSAnLi4vLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHtcbiAgTGFzdE1lc3NhZ2VTdGF0dXMsXG4gIENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLFxuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG59IGZyb20gJy4uLy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBCb2R5UmFuZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBDYWxsTW9kZSB9IGZyb20gJy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHR5cGUgeyBNZWRpYUl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTWVkaWFJdGVtJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7XG4gIGdldEdyb3VwU2l6ZVJlY29tbWVuZGVkTGltaXQsXG4gIGdldEdyb3VwU2l6ZUhhcmRMaW1pdCxcbn0gZnJvbSAnLi4vLi4vZ3JvdXBzL2xpbWl0cyc7XG5pbXBvcnQgeyBpc01lc3NhZ2VVbnJlYWQgfSBmcm9tICcuLi8uLi91dGlsL2lzTWVzc2FnZVVucmVhZCc7XG5pbXBvcnQgeyB0b2dnbGVTZWxlY3RlZENvbnRhY3RGb3JHcm91cEFkZGl0aW9uIH0gZnJvbSAnLi4vLi4vZ3JvdXBzL3RvZ2dsZVNlbGVjdGVkQ29udGFjdEZvckdyb3VwQWRkaXRpb24nO1xuaW1wb3J0IHR5cGUgeyBHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGUgfSBmcm9tICcuLi8uLi91dGlsL2dyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbnMnO1xuaW1wb3J0IHsgQ29udGFjdFNwb29maW5nVHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvY29udGFjdFNwb29maW5nJztcbmltcG9ydCB7IHdyaXRlUHJvZmlsZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3dyaXRlUHJvZmlsZSc7XG5pbXBvcnQgeyB3cml0ZVVzZXJuYW1lIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvd3JpdGVVc2VybmFtZSc7XG5pbXBvcnQge1xuICBnZXRDb252ZXJzYXRpb25VdWlkc1N0b3BwaW5nU2VuZCxcbiAgZ2V0Q29udmVyc2F0aW9uSWRzU3RvcHBlZEZvclZlcmlmaWNhdGlvbixcbiAgZ2V0TWUsXG4gIGdldFVzZXJuYW1lU2F2ZVN0YXRlLFxufSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IEF2YXRhckRhdGFUeXBlLCBBdmF0YXJVcGRhdGVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvQXZhdGFyJztcbmltcG9ydCB7IGdldERlZmF1bHRBdmF0YXJzIH0gZnJvbSAnLi4vLi4vdHlwZXMvQXZhdGFyJztcbmltcG9ydCB7IGdldEF2YXRhckRhdGEgfSBmcm9tICcuLi8uLi91dGlsL2dldEF2YXRhckRhdGEnO1xuaW1wb3J0IHsgaXNTYW1lQXZhdGFyRGF0YSB9IGZyb20gJy4uLy4uL3V0aWwvaXNTYW1lQXZhdGFyRGF0YSc7XG5pbXBvcnQgeyBsb25nUnVubmluZ1Rhc2tXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbC9sb25nUnVubmluZ1Rhc2tXcmFwcGVyJztcbmltcG9ydCB7XG4gIENvbXBvc2VyU3RlcCxcbiAgQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUsXG4gIE9uZVRpbWVNb2RhbFN0YXRlLFxuICBVc2VybmFtZVNhdmVTdGF0ZSxcbn0gZnJvbSAnLi9jb252ZXJzYXRpb25zRW51bXMnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vLi4vdXRpbC9zaG93VG9hc3QnO1xuaW1wb3J0IHsgVG9hc3RGYWlsZWRUb0RlbGV0ZVVzZXJuYW1lIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9Ub2FzdEZhaWxlZFRvRGVsZXRlVXNlcm5hbWUnO1xuaW1wb3J0IHsgdXNlQm91bmRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlQm91bmRBY3Rpb25zJztcblxuaW1wb3J0IHR5cGUgeyBOb29wQWN0aW9uVHlwZSB9IGZyb20gJy4vbm9vcCc7XG5pbXBvcnQgeyBjb252ZXJzYXRpb25Kb2JRdWV1ZSB9IGZyb20gJy4uLy4uL2pvYnMvY29udmVyc2F0aW9uSm9iUXVldWUnO1xuaW1wb3J0IHR5cGUgeyBUaW1lbGluZU1lc3NhZ2VMb2FkaW5nU3RhdGUgfSBmcm9tICcuLi8uLi91dGlsL3RpbWVsaW5lVXRpbCc7XG5pbXBvcnQgeyBpc0dyb3VwIH0gZnJvbSAnLi4vLi4vdXRpbC93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuXG4vLyBTdGF0ZVxuXG5leHBvcnQgdHlwZSBEQkNvbnZlcnNhdGlvblR5cGUgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIGFjdGl2ZUF0PzogbnVtYmVyO1xuICBsYXN0TWVzc2FnZT86IHN0cmluZyB8IG51bGw7XG4gIHR5cGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBJbnRlcmFjdGlvbk1vZGVzID0gWydtb3VzZScsICdrZXlib2FyZCddIGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgSW50ZXJhY3Rpb25Nb2RlVHlwZSA9IHR5cGVvZiBJbnRlcmFjdGlvbk1vZGVzW251bWJlcl07XG5cbmV4cG9ydCB0eXBlIE1lc3NhZ2VUeXBlID0gTWVzc2FnZUF0dHJpYnV0ZXNUeXBlICYge1xuICBpbnRlcmFjdGlvblR5cGU/OiBJbnRlcmFjdGlvbk1vZGVUeXBlO1xufTtcbmV4cG9ydCB0eXBlIE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlID0gTWVzc2FnZUF0dHJpYnV0ZXNUeXBlICYge1xuICBkaXNwbGF5TGltaXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY29uc3QgQ29udmVyc2F0aW9uVHlwZXMgPSBbJ2RpcmVjdCcsICdncm91cCddIGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uVHlwZVR5cGUgPSB0eXBlb2YgQ29udmVyc2F0aW9uVHlwZXNbbnVtYmVyXTtcblxuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uVHlwZSA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXVpZD86IFVVSURTdHJpbmdUeXBlO1xuICBlMTY0Pzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xuICBmYW1pbHlOYW1lPzogc3RyaW5nO1xuICBmaXJzdE5hbWU/OiBzdHJpbmc7XG4gIHByb2ZpbGVOYW1lPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgYWJvdXQ/OiBzdHJpbmc7XG4gIGFib3V0VGV4dD86IHN0cmluZztcbiAgYWJvdXRFbW9qaT86IHN0cmluZztcbiAgYXZhdGFycz86IEFycmF5PEF2YXRhckRhdGFUeXBlPjtcbiAgYXZhdGFyUGF0aD86IHN0cmluZztcbiAgYXZhdGFySGFzaD86IHN0cmluZztcbiAgcHJvZmlsZUF2YXRhclBhdGg/OiBzdHJpbmc7XG4gIHVuYmx1cnJlZEF2YXRhclBhdGg/OiBzdHJpbmc7XG4gIGFyZVdlQWRtaW4/OiBib29sZWFuO1xuICBhcmVXZVBlbmRpbmc/OiBib29sZWFuO1xuICBhcmVXZVBlbmRpbmdBcHByb3ZhbD86IGJvb2xlYW47XG4gIGNhbkNoYW5nZVRpbWVyPzogYm9vbGVhbjtcbiAgY2FuRWRpdEdyb3VwSW5mbz86IGJvb2xlYW47XG4gIGNvbG9yPzogQXZhdGFyQ29sb3JUeXBlO1xuICBjb252ZXJzYXRpb25Db2xvcj86IENvbnZlcnNhdGlvbkNvbG9yVHlwZTtcbiAgY3VzdG9tQ29sb3I/OiBDdXN0b21Db2xvclR5cGU7XG4gIGN1c3RvbUNvbG9ySWQ/OiBzdHJpbmc7XG4gIGRpc2NvdmVyZWRVbnJlZ2lzdGVyZWRBdD86IG51bWJlcjtcbiAgaGlkZVN0b3J5PzogYm9vbGVhbjtcbiAgaXNBcmNoaXZlZD86IGJvb2xlYW47XG4gIGlzQmxvY2tlZD86IGJvb2xlYW47XG4gIGlzR3JvdXBWMUFuZERpc2FibGVkPzogYm9vbGVhbjtcbiAgaXNQaW5uZWQ/OiBib29sZWFuO1xuICBpc1VudHJ1c3RlZD86IGJvb2xlYW47XG4gIGlzVmVyaWZpZWQ/OiBib29sZWFuO1xuICBhY3RpdmVBdD86IG51bWJlcjtcbiAgdGltZXN0YW1wPzogbnVtYmVyO1xuICBpbmJveFBvc2l0aW9uPzogbnVtYmVyO1xuICBsZWZ0PzogYm9vbGVhbjtcbiAgbGFzdE1lc3NhZ2U/OlxuICAgIHwge1xuICAgICAgICBzdGF0dXM/OiBMYXN0TWVzc2FnZVN0YXR1cztcbiAgICAgICAgdGV4dDogc3RyaW5nO1xuICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU6IGZhbHNlO1xuICAgICAgfVxuICAgIHwgeyBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUgfTtcbiAgbWFya2VkVW5yZWFkPzogYm9vbGVhbjtcbiAgcGhvbmVOdW1iZXI/OiBzdHJpbmc7XG4gIG1lbWJlcnNDb3VudD86IG51bWJlcjtcbiAgbWVzc2FnZUNvdW50PzogbnVtYmVyO1xuICBhY2Nlc3NDb250cm9sQWRkRnJvbUludml0ZUxpbms/OiBudW1iZXI7XG4gIGFjY2Vzc0NvbnRyb2xBdHRyaWJ1dGVzPzogbnVtYmVyO1xuICBhY2Nlc3NDb250cm9sTWVtYmVycz86IG51bWJlcjtcbiAgYW5ub3VuY2VtZW50c09ubHk/OiBib29sZWFuO1xuICBhbm5vdW5jZW1lbnRzT25seVJlYWR5PzogYm9vbGVhbjtcbiAgZXhwaXJlVGltZXI/OiBudW1iZXI7XG4gIG1lbWJlcnNoaXBzPzogQXJyYXk8e1xuICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICAgIGlzQWRtaW46IGJvb2xlYW47XG4gIH0+O1xuICBwZW5kaW5nTWVtYmVyc2hpcHM/OiBBcnJheTx7XG4gICAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gICAgYWRkZWRCeVVzZXJJZD86IFVVSURTdHJpbmdUeXBlO1xuICB9PjtcbiAgcGVuZGluZ0FwcHJvdmFsTWVtYmVyc2hpcHM/OiBBcnJheTx7XG4gICAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gIH0+O1xuICBiYW5uZWRNZW1iZXJzaGlwcz86IEFycmF5PFVVSURTdHJpbmdUeXBlPjtcbiAgbXV0ZUV4cGlyZXNBdD86IG51bWJlcjtcbiAgZG9udE5vdGlmeUZvck1lbnRpb25zSWZNdXRlZD86IGJvb2xlYW47XG4gIHR5cGU6IENvbnZlcnNhdGlvblR5cGVUeXBlO1xuICBpc01lOiBib29sZWFuO1xuICBsYXN0VXBkYXRlZD86IG51bWJlcjtcbiAgLy8gVGhpcyBpcyB1c2VkIGJ5IHRoZSBDb21wb3NpdGlvbklucHV0IGZvciBAbWVudGlvbnNcbiAgc29ydGVkR3JvdXBNZW1iZXJzPzogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHNlYXJjaGFibGVUaXRsZT86IHN0cmluZztcbiAgdW5yZWFkQ291bnQ/OiBudW1iZXI7XG4gIGlzU2VsZWN0ZWQ/OiBib29sZWFuO1xuICBpc0ZldGNoaW5nVVVJRD86IGJvb2xlYW47XG4gIHR5cGluZ0NvbnRhY3RJZD86IHN0cmluZztcbiAgcmVjZW50TWVkaWFJdGVtcz86IEFycmF5PE1lZGlhSXRlbVR5cGU+O1xuICBwcm9maWxlU2hhcmluZz86IGJvb2xlYW47XG5cbiAgc2hvdWxkU2hvd0RyYWZ0PzogYm9vbGVhbjtcbiAgZHJhZnRUZXh0Pzogc3RyaW5nIHwgbnVsbDtcbiAgZHJhZnRCb2R5UmFuZ2VzPzogQXJyYXk8Qm9keVJhbmdlVHlwZT47XG4gIGRyYWZ0UHJldmlldz86IHN0cmluZztcblxuICBzaGFyZWRHcm91cE5hbWVzOiBBcnJheTxzdHJpbmc+O1xuICBncm91cERlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBncm91cFZlcnNpb24/OiAxIHwgMjtcbiAgZ3JvdXBJZD86IHN0cmluZztcbiAgZ3JvdXBMaW5rPzogc3RyaW5nO1xuICBpc0dyb3VwU3RvcnlTZW5kUmVhZHk/OiBib29sZWFuO1xuICBtZXNzYWdlUmVxdWVzdHNFbmFibGVkPzogYm9vbGVhbjtcbiAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogYm9vbGVhbjtcbiAgc2VjcmV0UGFyYW1zPzogc3RyaW5nO1xuICBwdWJsaWNQYXJhbXM/OiBzdHJpbmc7XG4gIGFja25vd2xlZGdlZEdyb3VwTmFtZUNvbGxpc2lvbnM/OiBHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGU7XG4gIHByb2ZpbGVLZXk/OiBzdHJpbmc7XG5cbiAgYmFkZ2VzOiBBcnJheTxcbiAgICB8IHtcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgIH1cbiAgICB8IHtcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgZXhwaXJlc0F0OiBudW1iZXI7XG4gICAgICAgIGlzVmlzaWJsZTogYm9vbGVhbjtcbiAgICAgIH1cbiAgPjtcbn07XG5leHBvcnQgdHlwZSBQcm9maWxlRGF0YVR5cGUgPSB7XG4gIGZpcnN0TmFtZTogc3RyaW5nO1xufSAmIFBpY2s8Q29udmVyc2F0aW9uVHlwZSwgJ2Fib3V0RW1vamknIHwgJ2Fib3V0VGV4dCcgfCAnZmFtaWx5TmFtZSc+O1xuXG5leHBvcnQgdHlwZSBDb252ZXJzYXRpb25Mb29rdXBUeXBlID0ge1xuICBba2V5OiBzdHJpbmddOiBDb252ZXJzYXRpb25UeXBlO1xufTtcbmV4cG9ydCB0eXBlIEN1c3RvbUVycm9yID0gRXJyb3IgJiB7XG4gIGlkZW50aWZpZXI/OiBzdHJpbmc7XG4gIG51bWJlcj86IHN0cmluZztcbn07XG5cbnR5cGUgTWVzc2FnZVBvaW50ZXJUeXBlID0ge1xuICBpZDogc3RyaW5nO1xuICByZWNlaXZlZF9hdDogbnVtYmVyO1xuICBzZW50X2F0PzogbnVtYmVyO1xufTtcbnR5cGUgTWVzc2FnZU1ldHJpY3NUeXBlID0ge1xuICBuZXdlc3Q/OiBNZXNzYWdlUG9pbnRlclR5cGU7XG4gIG9sZGVzdD86IE1lc3NhZ2VQb2ludGVyVHlwZTtcbiAgb2xkZXN0VW5zZWVuPzogTWVzc2FnZVBvaW50ZXJUeXBlO1xuICB0b3RhbFVuc2VlbjogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTWVzc2FnZUxvb2t1cFR5cGUgPSB7XG4gIFtrZXk6IHN0cmluZ106IE1lc3NhZ2VXaXRoVUlGaWVsZHNUeXBlO1xufTtcbmV4cG9ydCB0eXBlIENvbnZlcnNhdGlvbk1lc3NhZ2VUeXBlID0ge1xuICBpc05lYXJCb3R0b20/OiBib29sZWFuO1xuICBtZXNzYWdlQ2hhbmdlQ291bnRlcjogbnVtYmVyO1xuICBtZXNzYWdlSWRzOiBBcnJheTxzdHJpbmc+O1xuICBtZXNzYWdlTG9hZGluZ1N0YXRlPzogdW5kZWZpbmVkIHwgVGltZWxpbmVNZXNzYWdlTG9hZGluZ1N0YXRlO1xuICBtZXRyaWNzOiBNZXNzYWdlTWV0cmljc1R5cGU7XG4gIHNjcm9sbFRvTWVzc2FnZUlkPzogc3RyaW5nO1xuICBzY3JvbGxUb01lc3NhZ2VDb3VudGVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBNZXNzYWdlc0J5Q29udmVyc2F0aW9uVHlwZSA9IHtcbiAgW2tleTogc3RyaW5nXTogQ29udmVyc2F0aW9uTWVzc2FnZVR5cGUgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBQcmVKb2luQ29udmVyc2F0aW9uVHlwZSA9IHtcbiAgYXZhdGFyPzoge1xuICAgIGxvYWRpbmc/OiBib29sZWFuO1xuICAgIHVybD86IHN0cmluZztcbiAgfTtcbiAgZ3JvdXBEZXNjcmlwdGlvbj86IHN0cmluZztcbiAgbWVtYmVyQ291bnQ6IG51bWJlcjtcbiAgdGl0bGU6IHN0cmluZztcbiAgYXBwcm92YWxSZXF1aXJlZDogYm9vbGVhbjtcbn07XG5cbnR5cGUgQ29tcG9zZXJHcm91cENyZWF0aW9uU3RhdGUgPSB7XG4gIGdyb3VwQXZhdGFyOiB1bmRlZmluZWQgfCBVaW50OEFycmF5O1xuICBncm91cE5hbWU6IHN0cmluZztcbiAgZ3JvdXBFeHBpcmVUaW1lcjogbnVtYmVyO1xuICBtYXhpbXVtR3JvdXBTaXplTW9kYWxTdGF0ZTogT25lVGltZU1vZGFsU3RhdGU7XG4gIHJlY29tbWVuZGVkR3JvdXBTaXplTW9kYWxTdGF0ZTogT25lVGltZU1vZGFsU3RhdGU7XG4gIHNlbGVjdGVkQ29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+O1xuICB1c2VyQXZhdGFyRGF0YTogQXJyYXk8QXZhdGFyRGF0YVR5cGU+O1xufTtcblxuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uRGF0YSA9XG4gIHwge1xuICAgICAgdHlwZTogQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuUGVuZGluZ1ZlcmlmaWNhdGlvbjtcbiAgICAgIHV1aWRzTmVlZGluZ1ZlcmlmaWNhdGlvbjogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOiBDb252ZXJzYXRpb25WZXJpZmljYXRpb25TdGF0ZS5WZXJpZmljYXRpb25DYW5jZWxsZWQ7XG4gICAgICBjYW5jZWxlZEF0OiBudW1iZXI7XG4gICAgfTtcblxudHlwZSBDb21wb3NlclN0YXRlVHlwZSA9XG4gIHwge1xuICAgICAgc3RlcDogQ29tcG9zZXJTdGVwLlN0YXJ0RGlyZWN0Q29udmVyc2F0aW9uO1xuICAgICAgc2VhcmNoVGVybTogc3RyaW5nO1xuICAgICAgdXVpZEZldGNoU3RhdGU6IFVVSURGZXRjaFN0YXRlVHlwZTtcbiAgICB9XG4gIHwgKHtcbiAgICAgIHN0ZXA6IENvbXBvc2VyU3RlcC5DaG9vc2VHcm91cE1lbWJlcnM7XG4gICAgICBzZWFyY2hUZXJtOiBzdHJpbmc7XG4gICAgICB1dWlkRmV0Y2hTdGF0ZTogVVVJREZldGNoU3RhdGVUeXBlO1xuICAgIH0gJiBDb21wb3Nlckdyb3VwQ3JlYXRpb25TdGF0ZSlcbiAgfCAoe1xuICAgICAgc3RlcDogQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGE7XG4gICAgICBpc0VkaXRpbmdBdmF0YXI6IGJvb2xlYW47XG4gICAgfSAmIENvbXBvc2VyR3JvdXBDcmVhdGlvblN0YXRlICZcbiAgICAgIChcbiAgICAgICAgfCB7IGlzQ3JlYXRpbmc6IGZhbHNlOyBoYXNFcnJvcjogYm9vbGVhbiB9XG4gICAgICAgIHwgeyBpc0NyZWF0aW5nOiB0cnVlOyBoYXNFcnJvcjogZmFsc2UgfVxuICAgICAgKSk7XG5cbnR5cGUgQ29udGFjdFNwb29maW5nUmV2aWV3U3RhdGVUeXBlID1cbiAgfCB7XG4gICAgICB0eXBlOiBDb250YWN0U3Bvb2ZpbmdUeXBlLkRpcmVjdENvbnZlcnNhdGlvbldpdGhTYW1lVGl0bGU7XG4gICAgICBzYWZlQ29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTogQ29udGFjdFNwb29maW5nVHlwZS5NdWx0aXBsZUdyb3VwTWVtYmVyc1dpdGhTYW1lVGl0bGU7XG4gICAgICBncm91cENvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uc1N0YXRlVHlwZSA9IHtcbiAgcHJlSm9pbkNvbnZlcnNhdGlvbj86IFByZUpvaW5Db252ZXJzYXRpb25UeXBlO1xuICBpbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cD86IEFycmF5PHN0cmluZz47XG4gIGNvbnZlcnNhdGlvbkxvb2t1cDogQ29udmVyc2F0aW9uTG9va3VwVHlwZTtcbiAgY29udmVyc2F0aW9uc0J5RTE2NDogQ29udmVyc2F0aW9uTG9va3VwVHlwZTtcbiAgY29udmVyc2F0aW9uc0J5VXVpZDogQ29udmVyc2F0aW9uTG9va3VwVHlwZTtcbiAgY29udmVyc2F0aW9uc0J5R3JvdXBJZDogQ29udmVyc2F0aW9uTG9va3VwVHlwZTtcbiAgY29udmVyc2F0aW9uc0J5VXNlcm5hbWU6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGU7XG4gIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gIHNlbGVjdGVkTWVzc2FnZT86IHN0cmluZztcbiAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcjogbnVtYmVyO1xuICBzZWxlY3RlZENvbnZlcnNhdGlvblRpdGxlPzogc3RyaW5nO1xuICBzZWxlY3RlZENvbnZlcnNhdGlvblBhbmVsRGVwdGg6IG51bWJlcjtcbiAgc2hvd0FyY2hpdmVkOiBib29sZWFuO1xuICBjb21wb3Nlcj86IENvbXBvc2VyU3RhdGVUeXBlO1xuICBjb250YWN0U3Bvb2ZpbmdSZXZpZXc/OiBDb250YWN0U3Bvb2ZpbmdSZXZpZXdTdGF0ZVR5cGU7XG4gIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZTtcblxuICAvKipcbiAgICogRWFjaCBrZXkgaXMgYSBjb252ZXJzYXRpb24gSUQuIEVhY2ggdmFsdWUgaXMgYSB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mXG4gICAqIHZlcmlmaWNhdGlvbjogZWl0aGVyIGEgc2V0IG9mIHBlbmRpbmcgY29udmVyc2F0aW9uSWRzIHRvIGJlIGFwcHJvdmVkLCBvciBhIHRvbWJzdG9uZVxuICAgKiB0ZWxsaW5nIGpvYnMgdG8gY2FuY2VsIHRoZW1zZWx2ZXMgdXAgdG8gdGhhdCB0aW1lc3RhbXAuXG4gICAqL1xuICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb246IFJlY29yZDxzdHJpbmcsIENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbkRhdGE+O1xuXG4gIC8vIE5vdGU6IGl0J3MgdmVyeSBpbXBvcnRhbnQgdGhhdCBib3RoIG9mIHRoZXNlIGxvY2F0aW9ucyBhcmUgYWx3YXlzIGtlcHQgdXAgdG8gZGF0ZVxuICBtZXNzYWdlc0xvb2t1cDogTWVzc2FnZUxvb2t1cFR5cGU7XG4gIG1lc3NhZ2VzQnlDb252ZXJzYXRpb246IE1lc3NhZ2VzQnlDb252ZXJzYXRpb25UeXBlO1xufTtcblxuLy8gSGVscGVyc1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9uQ2FsbE1vZGUgPSAoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZVxuKTogQ2FsbE1vZGUgPT4ge1xuICBpZiAoXG4gICAgY29udmVyc2F0aW9uLmxlZnQgfHxcbiAgICBjb252ZXJzYXRpb24uaXNCbG9ja2VkIHx8XG4gICAgY29udmVyc2F0aW9uLmlzTWUgfHxcbiAgICAhY29udmVyc2F0aW9uLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3RcbiAgKSB7XG4gICAgcmV0dXJuIENhbGxNb2RlLk5vbmU7XG4gIH1cblxuICBpZiAoY29udmVyc2F0aW9uLnR5cGUgPT09ICdkaXJlY3QnKSB7XG4gICAgcmV0dXJuIENhbGxNb2RlLkRpcmVjdDtcbiAgfVxuXG4gIGlmIChjb252ZXJzYXRpb24udHlwZSA9PT0gJ2dyb3VwJyAmJiBjb252ZXJzYXRpb24uZ3JvdXBWZXJzaW9uID09PSAyKSB7XG4gICAgcmV0dXJuIENhbGxNb2RlLkdyb3VwO1xuICB9XG5cbiAgcmV0dXJuIENhbGxNb2RlLk5vbmU7XG59O1xuXG4vLyBBY3Rpb25zXG5cbmNvbnN0IENBTkNFTF9DT05WRVJTQVRJT05fUEVORElOR19WRVJJRklDQVRJT04gPVxuICAnY29udmVyc2F0aW9ucy9DQU5DRUxfQ09OVkVSU0FUSU9OX1BFTkRJTkdfVkVSSUZJQ0FUSU9OJztcbmNvbnN0IENMRUFSX0NBTkNFTExFRF9WRVJJRklDQVRJT04gPVxuICAnY29udmVyc2F0aW9ucy9DTEVBUl9DQU5DRUxMRURfVkVSSUZJQ0FUSU9OJztcbmNvbnN0IENMRUFSX0NPTlZFUlNBVElPTlNfUEVORElOR19WRVJJRklDQVRJT04gPVxuICAnY29udmVyc2F0aW9ucy9DTEVBUl9DT05WRVJTQVRJT05TX1BFTkRJTkdfVkVSSUZJQ0FUSU9OJztcbmV4cG9ydCBjb25zdCBDT0xPUlNfQ0hBTkdFRCA9ICdjb252ZXJzYXRpb25zL0NPTE9SU19DSEFOR0VEJztcbmV4cG9ydCBjb25zdCBDT0xPUl9TRUxFQ1RFRCA9ICdjb252ZXJzYXRpb25zL0NPTE9SX1NFTEVDVEVEJztcbmNvbnN0IENPTVBPU0VfVE9HR0xFX0VESVRJTkdfQVZBVEFSID1cbiAgJ2NvbnZlcnNhdGlvbnMvY29tcG9zZS9DT01QT1NFX1RPR0dMRV9FRElUSU5HX0FWQVRBUic7XG5jb25zdCBDT01QT1NFX0FERF9BVkFUQVIgPSAnY29udmVyc2F0aW9ucy9jb21wb3NlL0FERF9BVkFUQVInO1xuY29uc3QgQ09NUE9TRV9SRU1PVkVfQVZBVEFSID0gJ2NvbnZlcnNhdGlvbnMvY29tcG9zZS9SRU1PVkVfQVZBVEFSJztcbmNvbnN0IENPTVBPU0VfUkVQTEFDRV9BVkFUQVIgPSAnY29udmVyc2F0aW9ucy9jb21wb3NlL1JFUExBQ0VfQVZBVEFSJztcbmNvbnN0IENVU1RPTV9DT0xPUl9SRU1PVkVEID0gJ2NvbnZlcnNhdGlvbnMvQ1VTVE9NX0NPTE9SX1JFTU9WRUQnO1xuY29uc3QgQ09OVkVSU0FUSU9OX1NUT1BQRURfQllfTUlTU0lOR19WRVJJRklDQVRJT04gPVxuICAnY29udmVyc2F0aW9ucy9DT05WRVJTQVRJT05fU1RPUFBFRF9CWV9NSVNTSU5HX1ZFUklGSUNBVElPTic7XG5jb25zdCBESVNDQVJEX01FU1NBR0VTID0gJ2NvbnZlcnNhdGlvbnMvRElTQ0FSRF9NRVNTQUdFUyc7XG5jb25zdCBSRVBMQUNFX0FWQVRBUlMgPSAnY29udmVyc2F0aW9ucy9SRVBMQUNFX0FWQVRBUlMnO1xuY29uc3QgVVBEQVRFX1VTRVJOQU1FX1NBVkVfU1RBVEUgPSAnY29udmVyc2F0aW9ucy9VUERBVEVfVVNFUk5BTUVfU0FWRV9TVEFURSc7XG5leHBvcnQgY29uc3QgU0VMRUNURURfQ09OVkVSU0FUSU9OX0NIQU5HRUQgPVxuICAnY29udmVyc2F0aW9ucy9TRUxFQ1RFRF9DT05WRVJTQVRJT05fQ0hBTkdFRCc7XG5cbmV4cG9ydCB0eXBlIENhbmNlbFZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbkFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDQU5DRUxfQ09OVkVSU0FUSU9OX1BFTkRJTkdfVkVSSUZJQ0FUSU9OO1xuICBwYXlsb2FkOiB7XG4gICAgY2FuY2VsZWRBdDogbnVtYmVyO1xuICB9O1xufTtcbnR5cGUgQ2xlYXJHcm91cENyZWF0aW9uRXJyb3JBY3Rpb25UeXBlID0geyB0eXBlOiAnQ0xFQVJfR1JPVVBfQ1JFQVRJT05fRVJST1InIH07XG50eXBlIENsZWFySW52aXRlZFV1aWRzRm9yTmV3bHlDcmVhdGVkR3JvdXBBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnQ0xFQVJfSU5WSVRFRF9VVUlEU19GT1JfTkVXTFlfQ1JFQVRFRF9HUk9VUCc7XG59O1xudHlwZSBDbGVhclZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbkFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDTEVBUl9DT05WRVJTQVRJT05TX1BFTkRJTkdfVkVSSUZJQ0FUSU9OO1xufTtcbnR5cGUgQ2xlYXJDYW5jZWxsZWRWZXJpZmljYXRpb25BY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgQ0xFQVJfQ0FOQ0VMTEVEX1ZFUklGSUNBVElPTjtcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIH07XG59O1xudHlwZSBDbG9zZUNvbnRhY3RTcG9vZmluZ1Jldmlld0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDTE9TRV9DT05UQUNUX1NQT09GSU5HX1JFVklFVyc7XG59O1xudHlwZSBDbG9zZU1heGltdW1Hcm91cFNpemVNb2RhbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDTE9TRV9NQVhJTVVNX0dST1VQX1NJWkVfTU9EQUwnO1xufTtcbnR5cGUgQ2xvc2VSZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NMT1NFX1JFQ09NTUVOREVEX0dST1VQX1NJWkVfTU9EQUwnO1xufTtcbnR5cGUgQ29sb3JzQ2hhbmdlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDT0xPUlNfQ0hBTkdFRDtcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbkNvbG9yPzogQ29udmVyc2F0aW9uQ29sb3JUeXBlO1xuICAgIGN1c3RvbUNvbG9yRGF0YT86IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICB2YWx1ZTogQ3VzdG9tQ29sb3JUeXBlO1xuICAgIH07XG4gIH07XG59O1xudHlwZSBDb2xvclNlbGVjdGVkUGF5bG9hZFR5cGUgPSB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGNvbnZlcnNhdGlvbkNvbG9yPzogQ29udmVyc2F0aW9uQ29sb3JUeXBlO1xuICBjdXN0b21Db2xvckRhdGE/OiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB2YWx1ZTogQ3VzdG9tQ29sb3JUeXBlO1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIENvbG9yU2VsZWN0ZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgQ09MT1JfU0VMRUNURUQ7XG4gIHBheWxvYWQ6IENvbG9yU2VsZWN0ZWRQYXlsb2FkVHlwZTtcbn07XG50eXBlIENvbXBvc2VEZWxldGVBdmF0YXJBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgQ09NUE9TRV9SRU1PVkVfQVZBVEFSO1xuICBwYXlsb2FkOiBBdmF0YXJEYXRhVHlwZTtcbn07XG50eXBlIENvbXBvc2VSZXBsYWNlQXZhdGFyc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDT01QT1NFX1JFUExBQ0VfQVZBVEFSO1xuICBwYXlsb2FkOiB7XG4gICAgY3VycjogQXZhdGFyRGF0YVR5cGU7XG4gICAgcHJldj86IEF2YXRhckRhdGFUeXBlO1xuICB9O1xufTtcbnR5cGUgQ29tcG9zZVNhdmVBdmF0YXJBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgQ09NUE9TRV9BRERfQVZBVEFSO1xuICBwYXlsb2FkOiBBdmF0YXJEYXRhVHlwZTtcbn07XG50eXBlIEN1c3RvbUNvbG9yUmVtb3ZlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDVVNUT01fQ09MT1JfUkVNT1ZFRDtcbiAgcGF5bG9hZDoge1xuICAgIGNvbG9ySWQ6IHN0cmluZztcbiAgfTtcbn07XG50eXBlIERpc2NhcmRNZXNzYWdlc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBESVNDQVJEX01FU1NBR0VTO1xuICBwYXlsb2FkOiBSZWFkb25seTxcbiAgICB8IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICAgICAgbnVtYmVyVG9LZWVwQXRCb3R0b206IG51bWJlcjtcbiAgICAgIH1cbiAgICB8IHsgY29udmVyc2F0aW9uSWQ6IHN0cmluZzsgbnVtYmVyVG9LZWVwQXRUb3A6IG51bWJlciB9XG4gID47XG59O1xudHlwZSBTZXRQcmVKb2luQ29udmVyc2F0aW9uQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFVF9QUkVfSk9JTl9DT05WRVJTQVRJT04nO1xuICBwYXlsb2FkOiB7XG4gICAgZGF0YTogUHJlSm9pbkNvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQ7XG4gIH07XG59O1xuXG50eXBlIENvbnZlcnNhdGlvbkFkZGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NPTlZFUlNBVElPTl9BRERFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRhdGE6IENvbnZlcnNhdGlvblR5cGU7XG4gIH07XG59O1xuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uQ2hhbmdlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDT05WRVJTQVRJT05fQ0hBTkdFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRhdGE6IENvbnZlcnNhdGlvblR5cGU7XG4gIH07XG59O1xuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uUmVtb3ZlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDT05WRVJTQVRJT05fUkVNT1ZFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIENvbnZlcnNhdGlvblVubG9hZGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NPTlZFUlNBVElPTl9VTkxPQURFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICB9O1xufTtcbnR5cGUgQ3JlYXRlR3JvdXBQZW5kaW5nQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NSRUFURV9HUk9VUF9QRU5ESU5HJztcbn07XG50eXBlIENyZWF0ZUdyb3VwRnVsZmlsbGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NSRUFURV9HUk9VUF9GVUxGSUxMRUQnO1xuICBwYXlsb2FkOiB7XG4gICAgaW52aXRlZFV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT47XG4gIH07XG59O1xudHlwZSBDcmVhdGVHcm91cFJlamVjdGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ0NSRUFURV9HUk9VUF9SRUpFQ1RFRCc7XG59O1xuZXhwb3J0IHR5cGUgUmVtb3ZlQWxsQ29udmVyc2F0aW9uc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDT05WRVJTQVRJT05TX1JFTU9WRV9BTEwnO1xuICBwYXlsb2FkOiBudWxsO1xufTtcbmV4cG9ydCB0eXBlIE1lc3NhZ2VTZWxlY3RlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdNRVNTQUdFX1NFTEVDVEVEJztcbiAgcGF5bG9hZDoge1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIH07XG59O1xudHlwZSBDb252ZXJzYXRpb25TdG9wcGVkQnlNaXNzaW5nVmVyaWZpY2F0aW9uQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIENPTlZFUlNBVElPTl9TVE9QUEVEX0JZX01JU1NJTkdfVkVSSUZJQ0FUSU9OO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICB1bnRydXN0ZWRVdWlkczogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIE1lc3NhZ2VDaGFuZ2VkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ01FU1NBR0VfQ0hBTkdFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgZGF0YTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlO1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIE1lc3NhZ2VEZWxldGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ01FU1NBR0VfREVMRVRFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIH07XG59O1xuZXhwb3J0IHR5cGUgTWVzc2FnZUV4cGFuZGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ01FU1NBR0VfRVhQQU5ERUQnO1xuICBwYXlsb2FkOiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBkaXNwbGF5TGltaXQ6IG51bWJlcjtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIE1lc3NhZ2VzQWRkZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnTUVTU0FHRVNfQURERUQnO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICBpc0FjdGl2ZTogYm9vbGVhbjtcbiAgICBpc0p1c3RTZW50OiBib29sZWFuO1xuICAgIGlzTmV3TWVzc2FnZTogYm9vbGVhbjtcbiAgICBtZXNzYWdlczogQXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPjtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFJlcGFpck5ld2VzdE1lc3NhZ2VBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnUkVQQUlSX05FV0VTVF9NRVNTQUdFJztcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIH07XG59O1xuZXhwb3J0IHR5cGUgUmVwYWlyT2xkZXN0TWVzc2FnZUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdSRVBBSVJfT0xERVNUX01FU1NBR0UnO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgfTtcbn07XG5leHBvcnQgdHlwZSBNZXNzYWdlc1Jlc2V0QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ01FU1NBR0VTX1JFU0VUJztcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT47XG4gICAgbWV0cmljczogTWVzc2FnZU1ldHJpY3NUeXBlO1xuICAgIHNjcm9sbFRvTWVzc2FnZUlkPzogc3RyaW5nO1xuICAgIC8vIFRoZSBzZXQgb2YgcHJvdmlkZWQgbWVzc2FnZXMgc2hvdWxkIGJlIHRydXN0ZWQsIGV2ZW4gaWYgaXQgY29uZmxpY3RzIHdpdGggbWV0cmljcyxcbiAgICAvLyAgIGJlY2F1c2Ugd2Ugd2VyZW4ndCBsb29raW5nIGZvciBhIHNwZWNpZmljIHRpbWUgd2luZG93IG9mIG1lc3NhZ2VzIHdpdGggb3VyIHF1ZXJ5LlxuICAgIHVuYm91bmRlZEZldGNoOiBib29sZWFuO1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIFNldE1lc3NhZ2VMb2FkaW5nU3RhdGVBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VUX01FU1NBR0VfTE9BRElOR19TVEFURSc7XG4gIHBheWxvYWQ6IHtcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICAgIG1lc3NhZ2VMb2FkaW5nU3RhdGU6IHVuZGVmaW5lZCB8IFRpbWVsaW5lTWVzc2FnZUxvYWRpbmdTdGF0ZTtcbiAgfTtcbn07XG5leHBvcnQgdHlwZSBTZXRJc05lYXJCb3R0b21BY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VUX05FQVJfQk9UVE9NJztcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgaXNOZWFyQm90dG9tOiBib29sZWFuO1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIFNldENvbnZlcnNhdGlvbkhlYWRlclRpdGxlQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFVF9DT05WRVJTQVRJT05fSEVBREVSX1RJVExFJztcbiAgcGF5bG9hZDogeyB0aXRsZT86IHN0cmluZyB9O1xufTtcbmV4cG9ydCB0eXBlIFNldFNlbGVjdGVkQ29udmVyc2F0aW9uUGFuZWxEZXB0aEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTRVRfU0VMRUNURURfQ09OVkVSU0FUSU9OX1BBTkVMX0RFUFRIJztcbiAgcGF5bG9hZDogeyBwYW5lbERlcHRoOiBudW1iZXIgfTtcbn07XG5leHBvcnQgdHlwZSBTY3JvbGxUb01lc3NhZ2VBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0NST0xMX1RPX01FU1NBR0UnO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgfTtcbn07XG5leHBvcnQgdHlwZSBDbGVhclNlbGVjdGVkTWVzc2FnZUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDTEVBUl9TRUxFQ1RFRF9NRVNTQUdFJztcbiAgcGF5bG9hZDogbnVsbDtcbn07XG5leHBvcnQgdHlwZSBDbGVhclVucmVhZE1ldHJpY3NBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnQ0xFQVJfVU5SRUFEX01FVFJJQ1MnO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgfTtcbn07XG5leHBvcnQgdHlwZSBTZWxlY3RlZENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgU0VMRUNURURfQ09OVkVSU0FUSU9OX0NIQU5HRUQ7XG4gIHBheWxvYWQ6IHtcbiAgICBpZD86IHN0cmluZztcbiAgICBtZXNzYWdlSWQ/OiBzdHJpbmc7XG4gICAgc3dpdGNoVG9Bc3NvY2lhdGVkVmlldz86IGJvb2xlYW47XG4gIH07XG59O1xudHlwZSBSZXZpZXdHcm91cE1lbWJlck5hbWVDb2xsaXNpb25BY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnUkVWSUVXX0dST1VQX01FTUJFUl9OQU1FX0NPTExJU0lPTic7XG4gIHBheWxvYWQ6IHtcbiAgICBncm91cENvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIH07XG59O1xudHlwZSBSZXZpZXdNZXNzYWdlUmVxdWVzdE5hbWVDb2xsaXNpb25BY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnUkVWSUVXX01FU1NBR0VfUkVRVUVTVF9OQU1FX0NPTExJU0lPTic7XG4gIHBheWxvYWQ6IHtcbiAgICBzYWZlQ29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgfTtcbn07XG50eXBlIFNob3dJbmJveEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTSE9XX0lOQk9YJztcbiAgcGF5bG9hZDogbnVsbDtcbn07XG5leHBvcnQgdHlwZSBTaG93QXJjaGl2ZWRDb252ZXJzYXRpb25zQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NIT1dfQVJDSElWRURfQ09OVkVSU0FUSU9OUyc7XG4gIHBheWxvYWQ6IG51bGw7XG59O1xudHlwZSBTZXRDb21wb3NlR3JvdXBBdmF0YXJBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VUX0NPTVBPU0VfR1JPVVBfQVZBVEFSJztcbiAgcGF5bG9hZDogeyBncm91cEF2YXRhcjogdW5kZWZpbmVkIHwgVWludDhBcnJheSB9O1xufTtcbnR5cGUgU2V0Q29tcG9zZUdyb3VwTmFtZUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTRVRfQ09NUE9TRV9HUk9VUF9OQU1FJztcbiAgcGF5bG9hZDogeyBncm91cE5hbWU6IHN0cmluZyB9O1xufTtcbnR5cGUgU2V0Q29tcG9zZUdyb3VwRXhwaXJlVGltZXJBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VUX0NPTVBPU0VfR1JPVVBfRVhQSVJFX1RJTUVSJztcbiAgcGF5bG9hZDogeyBncm91cEV4cGlyZVRpbWVyOiBudW1iZXIgfTtcbn07XG50eXBlIFNldENvbXBvc2VTZWFyY2hUZXJtQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFVF9DT01QT1NFX1NFQVJDSF9URVJNJztcbiAgcGF5bG9hZDogeyBzZWFyY2hUZXJtOiBzdHJpbmcgfTtcbn07XG50eXBlIFNldElzRmV0Y2hpbmdVVUlEQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFVF9JU19GRVRDSElOR19VVUlEJztcbiAgcGF5bG9hZDoge1xuICAgIGlkZW50aWZpZXI6IFVVSURGZXRjaFN0YXRlS2V5VHlwZTtcbiAgICBpc0ZldGNoaW5nOiBib29sZWFuO1xuICB9O1xufTtcbnR5cGUgU2V0UmVjZW50TWVkaWFJdGVtc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTRVRfUkVDRU5UX01FRElBX0lURU1TJztcbiAgcGF5bG9hZDoge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcmVjZW50TWVkaWFJdGVtczogQXJyYXk8TWVkaWFJdGVtVHlwZT47XG4gIH07XG59O1xudHlwZSBUb2dnbGVDb21wb3NlRWRpdGluZ0F2YXRhckFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBDT01QT1NFX1RPR0dMRV9FRElUSU5HX0FWQVRBUjtcbn07XG50eXBlIFN0YXJ0Q29tcG9zaW5nQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NUQVJUX0NPTVBPU0lORyc7XG59O1xudHlwZSBTaG93Q2hvb3NlR3JvdXBNZW1iZXJzQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NIT1dfQ0hPT1NFX0dST1VQX01FTUJFUlMnO1xufTtcbnR5cGUgU3RhcnRTZXR0aW5nR3JvdXBNZXRhZGF0YUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTVEFSVF9TRVRUSU5HX0dST1VQX01FVEFEQVRBJztcbn07XG5leHBvcnQgdHlwZSBUb2dnbGVDb252ZXJzYXRpb25JbkNob29zZU1lbWJlcnNBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnVE9HR0xFX0NPTlZFUlNBVElPTl9JTl9DSE9PU0VfTUVNQkVSUyc7XG4gIHBheWxvYWQ6IHtcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICAgIG1heFJlY29tbWVuZGVkR3JvdXBTaXplOiBudW1iZXI7XG4gICAgbWF4R3JvdXBTaXplOiBudW1iZXI7XG4gIH07XG59O1xudHlwZSBVcGRhdGVVc2VybmFtZVNhdmVTdGF0ZUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBVUERBVEVfVVNFUk5BTUVfU0FWRV9TVEFURTtcbiAgcGF5bG9hZDoge1xuICAgIG5ld1NhdmVTdGF0ZTogVXNlcm5hbWVTYXZlU3RhdGU7XG4gIH07XG59O1xuXG50eXBlIFJlcGxhY2VBdmF0YXJzQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFJFUExBQ0VfQVZBVEFSUztcbiAgcGF5bG9hZDoge1xuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgYXZhdGFyczogQXJyYXk8QXZhdGFyRGF0YVR5cGU+O1xuICB9O1xufTtcbmV4cG9ydCB0eXBlIENvbnZlcnNhdGlvbkFjdGlvblR5cGUgPVxuICB8IENhbmNlbFZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbkFjdGlvblR5cGVcbiAgfCBDbGVhckNhbmNlbGxlZFZlcmlmaWNhdGlvbkFjdGlvblR5cGVcbiAgfCBDbGVhclZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbkFjdGlvblR5cGVcbiAgfCBDbGVhckdyb3VwQ3JlYXRpb25FcnJvckFjdGlvblR5cGVcbiAgfCBDbGVhckludml0ZWRVdWlkc0Zvck5ld2x5Q3JlYXRlZEdyb3VwQWN0aW9uVHlwZVxuICB8IENsZWFyU2VsZWN0ZWRNZXNzYWdlQWN0aW9uVHlwZVxuICB8IENsZWFyVW5yZWFkTWV0cmljc0FjdGlvblR5cGVcbiAgfCBDbG9zZUNvbnRhY3RTcG9vZmluZ1Jldmlld0FjdGlvblR5cGVcbiAgfCBDbG9zZU1heGltdW1Hcm91cFNpemVNb2RhbEFjdGlvblR5cGVcbiAgfCBDbG9zZVJlY29tbWVuZGVkR3JvdXBTaXplTW9kYWxBY3Rpb25UeXBlXG4gIHwgQ29sb3JTZWxlY3RlZEFjdGlvblR5cGVcbiAgfCBDb2xvcnNDaGFuZ2VkQWN0aW9uVHlwZVxuICB8IENvbXBvc2VEZWxldGVBdmF0YXJBY3Rpb25UeXBlXG4gIHwgQ29tcG9zZVJlcGxhY2VBdmF0YXJzQWN0aW9uVHlwZVxuICB8IENvbXBvc2VTYXZlQXZhdGFyQWN0aW9uVHlwZVxuICB8IENvbnZlcnNhdGlvbkFkZGVkQWN0aW9uVHlwZVxuICB8IENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlXG4gIHwgQ29udmVyc2F0aW9uUmVtb3ZlZEFjdGlvblR5cGVcbiAgfCBDb252ZXJzYXRpb25TdG9wcGVkQnlNaXNzaW5nVmVyaWZpY2F0aW9uQWN0aW9uVHlwZVxuICB8IENvbnZlcnNhdGlvblVubG9hZGVkQWN0aW9uVHlwZVxuICB8IENyZWF0ZUdyb3VwRnVsZmlsbGVkQWN0aW9uVHlwZVxuICB8IENyZWF0ZUdyb3VwUGVuZGluZ0FjdGlvblR5cGVcbiAgfCBDcmVhdGVHcm91cFJlamVjdGVkQWN0aW9uVHlwZVxuICB8IEN1c3RvbUNvbG9yUmVtb3ZlZEFjdGlvblR5cGVcbiAgfCBEaXNjYXJkTWVzc2FnZXNBY3Rpb25UeXBlXG4gIHwgTWVzc2FnZUNoYW5nZWRBY3Rpb25UeXBlXG4gIHwgTWVzc2FnZURlbGV0ZWRBY3Rpb25UeXBlXG4gIHwgTWVzc2FnZUV4cGFuZGVkQWN0aW9uVHlwZVxuICB8IE1lc3NhZ2VTZWxlY3RlZEFjdGlvblR5cGVcbiAgfCBNZXNzYWdlc0FkZGVkQWN0aW9uVHlwZVxuICB8IE1lc3NhZ2VzUmVzZXRBY3Rpb25UeXBlXG4gIHwgUmVtb3ZlQWxsQ29udmVyc2F0aW9uc0FjdGlvblR5cGVcbiAgfCBSZXBhaXJOZXdlc3RNZXNzYWdlQWN0aW9uVHlwZVxuICB8IFJlcGFpck9sZGVzdE1lc3NhZ2VBY3Rpb25UeXBlXG4gIHwgUmVwbGFjZUF2YXRhcnNBY3Rpb25UeXBlXG4gIHwgUmV2aWV3R3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uQWN0aW9uVHlwZVxuICB8IFJldmlld01lc3NhZ2VSZXF1ZXN0TmFtZUNvbGxpc2lvbkFjdGlvblR5cGVcbiAgfCBTY3JvbGxUb01lc3NhZ2VBY3Rpb25UeXBlXG4gIHwgU2VsZWN0ZWRDb252ZXJzYXRpb25DaGFuZ2VkQWN0aW9uVHlwZVxuICB8IFNldENvbXBvc2VHcm91cEF2YXRhckFjdGlvblR5cGVcbiAgfCBTZXRDb21wb3NlR3JvdXBFeHBpcmVUaW1lckFjdGlvblR5cGVcbiAgfCBTZXRDb21wb3NlR3JvdXBOYW1lQWN0aW9uVHlwZVxuICB8IFNldENvbXBvc2VTZWFyY2hUZXJtQWN0aW9uVHlwZVxuICB8IFNldENvbnZlcnNhdGlvbkhlYWRlclRpdGxlQWN0aW9uVHlwZVxuICB8IFNldElzRmV0Y2hpbmdVVUlEQWN0aW9uVHlwZVxuICB8IFNldElzTmVhckJvdHRvbUFjdGlvblR5cGVcbiAgfCBTZXRNZXNzYWdlTG9hZGluZ1N0YXRlQWN0aW9uVHlwZVxuICB8IFNldFByZUpvaW5Db252ZXJzYXRpb25BY3Rpb25UeXBlXG4gIHwgU2V0UmVjZW50TWVkaWFJdGVtc0FjdGlvblR5cGVcbiAgfCBTZXRTZWxlY3RlZENvbnZlcnNhdGlvblBhbmVsRGVwdGhBY3Rpb25UeXBlXG4gIHwgU2hvd0FyY2hpdmVkQ29udmVyc2F0aW9uc0FjdGlvblR5cGVcbiAgfCBTaG93Q2hvb3NlR3JvdXBNZW1iZXJzQWN0aW9uVHlwZVxuICB8IFNob3dJbmJveEFjdGlvblR5cGVcbiAgfCBTdGFydENvbXBvc2luZ0FjdGlvblR5cGVcbiAgfCBTdGFydFNldHRpbmdHcm91cE1ldGFkYXRhQWN0aW9uVHlwZVxuICB8IFRvZ2dsZUNvbnZlcnNhdGlvbkluQ2hvb3NlTWVtYmVyc0FjdGlvblR5cGVcbiAgfCBUb2dnbGVDb21wb3NlRWRpdGluZ0F2YXRhckFjdGlvblR5cGVcbiAgfCBVcGRhdGVVc2VybmFtZVNhdmVTdGF0ZUFjdGlvblR5cGU7XG5cbi8vIEFjdGlvbiBDcmVhdG9yc1xuXG5leHBvcnQgY29uc3QgYWN0aW9ucyA9IHtcbiAgY2FuY2VsQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uLFxuICBjaGFuZ2VIYXNHcm91cExpbmssXG4gIGNsZWFyQ2FuY2VsbGVkQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uLFxuICBjbGVhckdyb3VwQ3JlYXRpb25FcnJvcixcbiAgY2xlYXJJbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cCxcbiAgY2xlYXJTZWxlY3RlZE1lc3NhZ2UsXG4gIGNsZWFyVW5yZWFkTWV0cmljcyxcbiAgY2xlYXJVc2VybmFtZVNhdmUsXG4gIGNsb3NlQ29udGFjdFNwb29maW5nUmV2aWV3LFxuICBjbG9zZU1heGltdW1Hcm91cFNpemVNb2RhbCxcbiAgY2xvc2VSZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsLFxuICBjb2xvclNlbGVjdGVkLFxuICBjb21wb3NlRGVsZXRlQXZhdGFyRnJvbURpc2ssXG4gIGNvbXBvc2VSZXBsYWNlQXZhdGFyLFxuICBjb21wb3NlU2F2ZUF2YXRhclRvRGlzayxcbiAgY29udmVyc2F0aW9uQWRkZWQsXG4gIGNvbnZlcnNhdGlvbkNoYW5nZWQsXG4gIGNvbnZlcnNhdGlvblJlbW92ZWQsXG4gIGNvbnZlcnNhdGlvblN0b3BwZWRCeU1pc3NpbmdWZXJpZmljYXRpb24sXG4gIGNvbnZlcnNhdGlvblVubG9hZGVkLFxuICBjcmVhdGVHcm91cCxcbiAgZGVsZXRlQXZhdGFyRnJvbURpc2ssXG4gIGRpc2NhcmRNZXNzYWdlcyxcbiAgZG91YmxlQ2hlY2tNaXNzaW5nUXVvdGVSZWZlcmVuY2UsXG4gIGdlbmVyYXRlTmV3R3JvdXBMaW5rLFxuICBtZXNzYWdlQ2hhbmdlZCxcbiAgbWVzc2FnZURlbGV0ZWQsXG4gIG1lc3NhZ2VFeHBhbmRlZCxcbiAgbWVzc2FnZXNBZGRlZCxcbiAgbWVzc2FnZXNSZXNldCxcbiAgbXlQcm9maWxlQ2hhbmdlZCxcbiAgcmVtb3ZlQWxsQ29udmVyc2F0aW9ucyxcbiAgcmVtb3ZlQ3VzdG9tQ29sb3JPbkNvbnZlcnNhdGlvbnMsXG4gIHJlbW92ZU1lbWJlckZyb21Hcm91cCxcbiAgcmVwYWlyTmV3ZXN0TWVzc2FnZSxcbiAgcmVwYWlyT2xkZXN0TWVzc2FnZSxcbiAgcmVwbGFjZUF2YXRhcixcbiAgcmVzZXRBbGxDaGF0Q29sb3JzLFxuICByZXZpZXdHcm91cE1lbWJlck5hbWVDb2xsaXNpb24sXG4gIHJldmlld01lc3NhZ2VSZXF1ZXN0TmFtZUNvbGxpc2lvbixcbiAgc2F2ZUF2YXRhclRvRGlzayxcbiAgc2F2ZVVzZXJuYW1lLFxuICBzY3JvbGxUb01lc3NhZ2UsXG4gIHNlbGVjdE1lc3NhZ2UsXG4gIHNldEFjY2Vzc0NvbnRyb2xBZGRGcm9tSW52aXRlTGlua1NldHRpbmcsXG4gIHNldENvbXBvc2VHcm91cEF2YXRhcixcbiAgc2V0Q29tcG9zZUdyb3VwRXhwaXJlVGltZXIsXG4gIHNldENvbXBvc2VHcm91cE5hbWUsXG4gIHNldENvbXBvc2VTZWFyY2hUZXJtLFxuICBzZXRJc0ZldGNoaW5nVVVJRCxcbiAgc2V0SXNOZWFyQm90dG9tLFxuICBzZXRNZXNzYWdlTG9hZGluZ1N0YXRlLFxuICBzZXRQcmVKb2luQ29udmVyc2F0aW9uLFxuICBzZXRSZWNlbnRNZWRpYUl0ZW1zLFxuICBzZXRTZWxlY3RlZENvbnZlcnNhdGlvbkhlYWRlclRpdGxlLFxuICBzZXRTZWxlY3RlZENvbnZlcnNhdGlvblBhbmVsRGVwdGgsXG4gIHNob3dBcmNoaXZlZENvbnZlcnNhdGlvbnMsXG4gIHNob3dDaG9vc2VHcm91cE1lbWJlcnMsXG4gIHNob3dJbmJveCxcbiAgc2hvd0NvbnZlcnNhdGlvbixcbiAgc3RhcnRDb21wb3NpbmcsXG4gIHN0YXJ0U2V0dGluZ0dyb3VwTWV0YWRhdGEsXG4gIHRhZ0dyb3Vwc0FzTmV3R3JvdXBTdG9yeSxcbiAgdG9nZ2xlQWRtaW4sXG4gIHRvZ2dsZUNvbnZlcnNhdGlvbkluQ2hvb3NlTWVtYmVycyxcbiAgdG9nZ2xlQ29tcG9zZUVkaXRpbmdBdmF0YXIsXG4gIHRvZ2dsZUhpZGVTdG9yaWVzLFxuICB1cGRhdGVDb252ZXJzYXRpb25Nb2RlbFNoYXJlZEdyb3VwcyxcbiAgdmVyaWZ5Q29udmVyc2F0aW9uc1N0b3BwaW5nU2VuZCxcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VDb252ZXJzYXRpb25zQWN0aW9ucyA9ICgpOiB0eXBlb2YgYWN0aW9ucyA9PlxuICB1c2VCb3VuZEFjdGlvbnMoYWN0aW9ucyk7XG5cbmZ1bmN0aW9uIGZpbHRlckF2YXRhckRhdGEoXG4gIGF2YXRhcnM6IFJlYWRvbmx5QXJyYXk8QXZhdGFyRGF0YVR5cGU+LFxuICBkYXRhOiBBdmF0YXJEYXRhVHlwZVxuKTogQXJyYXk8QXZhdGFyRGF0YVR5cGU+IHtcbiAgcmV0dXJuIGF2YXRhcnMuZmlsdGVyKGF2YXRhckRhdGEgPT4gIWlzU2FtZUF2YXRhckRhdGEoZGF0YSwgYXZhdGFyRGF0YSkpO1xufVxuXG5mdW5jdGlvbiBnZXROZXh0QXZhdGFySWQoYXZhdGFyczogQXJyYXk8QXZhdGFyRGF0YVR5cGU+KTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KC4uLmF2YXRhcnMubWFwKHggPT4gTnVtYmVyKHguaWQpKSkgKyAxO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBdmF0YXJzQW5kVXBkYXRlQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25zOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBnZXROZXh0QXZhdGFyc0RhdGE6IChcbiAgICBhdmF0YXJzOiBBcnJheTxBdmF0YXJEYXRhVHlwZT4sXG4gICAgbmV4dElkOiBudW1iZXJcbiAgKSA9PiBBcnJheTxBdmF0YXJEYXRhVHlwZT5cbik6IFByb21pc2U8QXJyYXk8QXZhdGFyRGF0YVR5cGU+PiB7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb252ZXJzYXRpb24gZm91bmQnKTtcbiAgfVxuXG4gIGNvbnN0IHsgY29udmVyc2F0aW9uTG9va3VwIH0gPSBjb252ZXJzYXRpb25zO1xuICBjb25zdCBjb252ZXJzYXRpb25BdHRycyA9IGNvbnZlcnNhdGlvbkxvb2t1cFtjb252ZXJzYXRpb25JZF07XG4gIGNvbnN0IGF2YXRhcnMgPVxuICAgIGNvbnZlcnNhdGlvbkF0dHJzLmF2YXRhcnMgfHwgZ2V0QXZhdGFyRGF0YShjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG5cbiAgY29uc3QgbmV4dEF2YXRhcklkID0gZ2V0TmV4dEF2YXRhcklkKGF2YXRhcnMpO1xuICBjb25zdCBuZXh0QXZhdGFycyA9IGdldE5leHRBdmF0YXJzRGF0YShhdmF0YXJzLCBuZXh0QXZhdGFySWQpO1xuICAvLyBXZSBkb24ndCBzYXZlIGJ1ZmZlcnMgdG8gdGhlIGRiLCBidXQgd2UgZGVmaW5pdGVseSB3YW50IGl0IGluLW1lbW9yeSBzb1xuICAvLyB3ZSBkb24ndCBoYXZlIHRvIHJlLWdlbmVyYXRlIHRoZW0uXG4gIC8vXG4gIC8vIE11dGF0aW5nIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHRyaWdnZXIgYSBtb2RlbCBjaGFuZ2VcbiAgLy8gYmVjYXVzZSB3ZSdyZSB1cGRhdGluZyByZWR1eCBoZXJlIG1hbnVhbGx5IG91cnNlbHZlcy4gQXUgcmV2b2lyIEJhY2tib25lIVxuICBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5hdmF0YXJzID0gbmV4dEF2YXRhcnMubWFwKGF2YXRhckRhdGEgPT5cbiAgICBvbWl0KGF2YXRhckRhdGEsIFsnYnVmZmVyJ10pXG4gICk7XG4gIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuXG4gIHJldHVybiBuZXh0QXZhdGFycztcbn1cblxuZnVuY3Rpb24gZGVsZXRlQXZhdGFyRnJvbURpc2soXG4gIGF2YXRhckRhdGE6IEF2YXRhckRhdGFUeXBlLFxuICBjb252ZXJzYXRpb25JZD86IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUmVwbGFjZUF2YXRhcnNBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgaWYgKGF2YXRhckRhdGEuaW1hZ2VQYXRoKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZGVsZXRlQXZhdGFyKGF2YXRhckRhdGEuaW1hZ2VQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdObyBpbWFnZVBhdGggZm9yIGF2YXRhckRhdGEuIFJlbW92aW5nIGZyb20gdXNlckF2YXRhckRhdGEsIGJ1dCBub3QgZGlzaydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgc3RyaWN0QXNzZXJ0KGNvbnZlcnNhdGlvbklkLCAnY29udmVyc2F0aW9uSWQgbm90IHByb3ZpZGVkJyk7XG5cbiAgICBjb25zdCBhdmF0YXJzID0gYXdhaXQgZ2V0QXZhdGFyc0FuZFVwZGF0ZUNvbnZlcnNhdGlvbihcbiAgICAgIGdldFN0YXRlKCkuY29udmVyc2F0aW9ucyxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgcHJldkF2YXRhcnNEYXRhID0+IGZpbHRlckF2YXRhckRhdGEocHJldkF2YXRhcnNEYXRhLCBhdmF0YXJEYXRhKVxuICAgICk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBSRVBMQUNFX0FWQVRBUlMsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBhdmF0YXJzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlSGFzR3JvdXBMaW5rKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB2YWx1ZTogYm9vbGVhblxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgTm9vcEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbnZlcnNhdGlvbiBmb3VuZCcpO1xuICAgIH1cblxuICAgIGF3YWl0IGxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgbmFtZTogJ3RvZ2dsZUdyb3VwTGluaycsXG4gICAgICBpZEZvckxvZ2dpbmc6IGNvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKSxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+IGNvbnZlcnNhdGlvbi50b2dnbGVHcm91cExpbmsodmFsdWUpLFxuICAgIH0pO1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3R3JvdXBMaW5rKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBOb29wQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY29udmVyc2F0aW9uIGZvdW5kJyk7XG4gICAgfVxuXG4gICAgYXdhaXQgbG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICBuYW1lOiAncmVmcmVzaEdyb3VwTGluaycsXG4gICAgICBpZEZvckxvZ2dpbmc6IGNvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKSxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+IGNvbnZlcnNhdGlvbi5yZWZyZXNoR3JvdXBMaW5rKCksXG4gICAgfSk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnTk9PUCcsXG4gICAgICBwYXlsb2FkOiBudWxsLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRBY2Nlc3NDb250cm9sQWRkRnJvbUludml0ZUxpbmtTZXR0aW5nKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB2YWx1ZTogYm9vbGVhblxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgTm9vcEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbnZlcnNhdGlvbiBmb3VuZCcpO1xuICAgIH1cblxuICAgIGF3YWl0IGxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgaWRGb3JMb2dnaW5nOiBjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCksXG4gICAgICBuYW1lOiAndXBkYXRlQWNjZXNzQ29udHJvbEFkZEZyb21JbnZpdGVMaW5rJyxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+XG4gICAgICAgIGNvbnZlcnNhdGlvbi51cGRhdGVBY2Nlc3NDb250cm9sQWRkRnJvbUludml0ZUxpbmsodmFsdWUpLFxuICAgIH0pO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ05PT1AnLFxuICAgICAgcGF5bG9hZDogbnVsbCxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzY2FyZE1lc3NhZ2VzKFxuICBwYXlsb2FkOiBSZWFkb25seTxEaXNjYXJkTWVzc2FnZXNBY3Rpb25UeXBlWydwYXlsb2FkJ10+XG4pOiBEaXNjYXJkTWVzc2FnZXNBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHsgdHlwZTogRElTQ0FSRF9NRVNTQUdFUywgcGF5bG9hZCB9O1xufVxuXG5mdW5jdGlvbiByZXBsYWNlQXZhdGFyKFxuICBjdXJyOiBBdmF0YXJEYXRhVHlwZSxcbiAgcHJldj86IEF2YXRhckRhdGFUeXBlLFxuICBjb252ZXJzYXRpb25JZD86IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUmVwbGFjZUF2YXRhcnNBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgc3RyaWN0QXNzZXJ0KGNvbnZlcnNhdGlvbklkLCAnY29udmVyc2F0aW9uSWQgbm90IHByb3ZpZGVkJyk7XG5cbiAgICBjb25zdCBhdmF0YXJzID0gYXdhaXQgZ2V0QXZhdGFyc0FuZFVwZGF0ZUNvbnZlcnNhdGlvbihcbiAgICAgIGdldFN0YXRlKCkuY29udmVyc2F0aW9ucyxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgKHByZXZBdmF0YXJzRGF0YSwgbmV4dElkKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0F2YXRhckRhdGEgPSB7XG4gICAgICAgICAgLi4uY3VycixcbiAgICAgICAgICBpZDogcHJldj8uaWQgPz8gbmV4dElkLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBleGlzdGluZ0F2YXRhcnNEYXRhID0gcHJldlxuICAgICAgICAgID8gZmlsdGVyQXZhdGFyRGF0YShwcmV2QXZhdGFyc0RhdGEsIHByZXYpXG4gICAgICAgICAgOiBwcmV2QXZhdGFyc0RhdGE7XG5cbiAgICAgICAgcmV0dXJuIFtuZXdBdmF0YXJEYXRhLCAuLi5leGlzdGluZ0F2YXRhcnNEYXRhXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogUkVQTEFDRV9BVkFUQVJTLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgYXZhdGFycyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNhdmVBdmF0YXJUb0Rpc2soXG4gIGF2YXRhckRhdGE6IEF2YXRhckRhdGFUeXBlLFxuICBjb252ZXJzYXRpb25JZD86IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUmVwbGFjZUF2YXRhcnNBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgaWYgKCFhdmF0YXJEYXRhLmJ1ZmZlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdmF0YXIgVWludDhBcnJheSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHN0cmljdEFzc2VydChjb252ZXJzYXRpb25JZCwgJ2NvbnZlcnNhdGlvbklkIG5vdCBwcm92aWRlZCcpO1xuXG4gICAgY29uc3QgaW1hZ2VQYXRoID0gYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLndyaXRlTmV3QXZhdGFyRGF0YShcbiAgICAgIGF2YXRhckRhdGEuYnVmZmVyXG4gICAgKTtcblxuICAgIGNvbnN0IGF2YXRhcnMgPSBhd2FpdCBnZXRBdmF0YXJzQW5kVXBkYXRlQ29udmVyc2F0aW9uKFxuICAgICAgZ2V0U3RhdGUoKS5jb252ZXJzYXRpb25zLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAocHJldkF2YXRhcnNEYXRhLCBpZCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdBdmF0YXJEYXRhID0ge1xuICAgICAgICAgIC4uLmF2YXRhckRhdGEsXG4gICAgICAgICAgaW1hZ2VQYXRoLFxuICAgICAgICAgIGlkLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBbbmV3QXZhdGFyRGF0YSwgLi4ucHJldkF2YXRhcnNEYXRhXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogUkVQTEFDRV9BVkFUQVJTLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgYXZhdGFycyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVc2VybmFtZVNhdmVUeXBlKFxuICBuZXdTYXZlU3RhdGU6IFVzZXJuYW1lU2F2ZVN0YXRlXG4pOiBVcGRhdGVVc2VybmFtZVNhdmVTdGF0ZUFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFVQREFURV9VU0VSTkFNRV9TQVZFX1NUQVRFLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIG5ld1NhdmVTdGF0ZSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjbGVhclVzZXJuYW1lU2F2ZSgpOiBVcGRhdGVVc2VybmFtZVNhdmVTdGF0ZUFjdGlvblR5cGUge1xuICByZXR1cm4gbWFrZVVzZXJuYW1lU2F2ZVR5cGUoVXNlcm5hbWVTYXZlU3RhdGUuTm9uZSk7XG59XG5cbmZ1bmN0aW9uIHNhdmVVc2VybmFtZSh7XG4gIHVzZXJuYW1lLFxuICBwcmV2aW91c1VzZXJuYW1lLFxufToge1xuICB1c2VybmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwcmV2aW91c1VzZXJuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59KTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIFVwZGF0ZVVzZXJuYW1lU2F2ZVN0YXRlQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuXG4gICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IGdldFVzZXJuYW1lU2F2ZVN0YXRlKHN0YXRlKTtcbiAgICBpZiAocHJldmlvdXNTdGF0ZSAhPT0gVXNlcm5hbWVTYXZlU3RhdGUuTm9uZSkge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgc2F2ZVVzZXJuYW1lOiBTYXZlIHJlcXVlc3RlZCwgYnV0IHByZXZpb3VzIHN0YXRlIHdhcyAke3ByZXZpb3VzU3RhdGV9YFxuICAgICAgKTtcbiAgICAgIGRpc3BhdGNoKG1ha2VVc2VybmFtZVNhdmVUeXBlKFVzZXJuYW1lU2F2ZVN0YXRlLkdlbmVyYWxFcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBkaXNwYXRjaChtYWtlVXNlcm5hbWVTYXZlVHlwZShVc2VybmFtZVNhdmVTdGF0ZS5TYXZpbmcpKTtcbiAgICAgIGF3YWl0IHdyaXRlVXNlcm5hbWUoeyB1c2VybmFtZSwgcHJldmlvdXNVc2VybmFtZSB9KTtcblxuICAgICAgLy8gd3JpdGVVc2VybmFtZSBhYm92ZSB1cGRhdGVzIHRoZSBiYWNrYm9uZSBtb2RlbCB3aGljaCBpbiB0dXJuIHVwZGF0ZXNcbiAgICAgIC8vIHJlZHV4IHRocm91Z2ggaXQncyBvbjpjaGFuZ2UgZXZlbnQgbGlzdGVuZXIuIE9uY2Ugd2UgbG9zZSBCYWNrYm9uZVxuICAgICAgLy8gd2UnbGwgbmVlZCB0byBtYW51YWxseSBzeW5jIHRoZXNlIG5ldyBjaGFuZ2VzLlxuICAgICAgZGlzcGF0Y2gobWFrZVVzZXJuYW1lU2F2ZVR5cGUoVXNlcm5hbWVTYXZlU3RhdGUuU3VjY2VzcykpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgd2Ugd2VyZSBkZWxldGluZ1xuICAgICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgICBkaXNwYXRjaChtYWtlVXNlcm5hbWVTYXZlVHlwZShVc2VybmFtZVNhdmVTdGF0ZS5EZWxldGVGYWlsZWQpKTtcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0RmFpbGVkVG9EZWxldGVVc2VybmFtZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1JlY29yZChlcnJvcikpIHtcbiAgICAgICAgZGlzcGF0Y2gobWFrZVVzZXJuYW1lU2F2ZVR5cGUoVXNlcm5hbWVTYXZlU3RhdGUuR2VuZXJhbEVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yLmNvZGUgPT09IDQwOSkge1xuICAgICAgICBkaXNwYXRjaChtYWtlVXNlcm5hbWVTYXZlVHlwZShVc2VybmFtZVNhdmVTdGF0ZS5Vc2VybmFtZVRha2VuRXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yLmNvZGUgPT09IDQwMCkge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBtYWtlVXNlcm5hbWVTYXZlVHlwZShVc2VybmFtZVNhdmVTdGF0ZS5Vc2VybmFtZU1hbGZvcm1lZEVycm9yKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoKG1ha2VVc2VybmFtZVNhdmVUeXBlKFVzZXJuYW1lU2F2ZVN0YXRlLkdlbmVyYWxFcnJvcikpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbXlQcm9maWxlQ2hhbmdlZChcbiAgcHJvZmlsZURhdGE6IFByb2ZpbGVEYXRhVHlwZSxcbiAgYXZhdGFyOiBBdmF0YXJVcGRhdGVUeXBlXG4pOiBUaHVua0FjdGlvbjxcbiAgdm9pZCxcbiAgUm9vdFN0YXRlVHlwZSxcbiAgdW5rbm93bixcbiAgTm9vcEFjdGlvblR5cGUgfCBUb2dnbGVQcm9maWxlRWRpdG9yRXJyb3JBY3Rpb25UeXBlXG4+IHtcbiAgcmV0dXJuIGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRNZShnZXRTdGF0ZSgpKTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB3cml0ZVByb2ZpbGUoXG4gICAgICAgIHtcbiAgICAgICAgICAuLi5jb252ZXJzYXRpb24sXG4gICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIGF2YXRhclxuICAgICAgKTtcblxuICAgICAgLy8gd3JpdGVQcm9maWxlIGFib3ZlIHVwZGF0ZXMgdGhlIGJhY2tib25lIG1vZGVsIHdoaWNoIGluIHR1cm4gdXBkYXRlc1xuICAgICAgLy8gcmVkdXggdGhyb3VnaCBpdCdzIG9uOmNoYW5nZSBldmVudCBsaXN0ZW5lci4gT25jZSB3ZSBsb3NlIEJhY2tib25lXG4gICAgICAvLyB3ZSdsbCBuZWVkIHRvIG1hbnVhbGx5IHN5bmMgdGhlc2UgbmV3IGNoYW5nZXMuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgICAgcGF5bG9hZDogbnVsbCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLmVycm9yKCdteVByb2ZpbGVDaGFuZ2VkJywgZXJyICYmIGVyci5zdGFjayA/IGVyci5zdGFjayA6IGVycik7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IFRPR0dMRV9QUk9GSUxFX0VESVRPUl9FUlJPUiB9KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUN1c3RvbUNvbG9yT25Db252ZXJzYXRpb25zKFxuICBjb2xvcklkOiBzdHJpbmdcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIEN1c3RvbUNvbG9yUmVtb3ZlZEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb25zVG9VcGRhdGU6IEFycmF5PENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlPiA9IFtdO1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gdHJpZ2dlciBhIG1vZGVsIGNoYW5nZSBiZWNhdXNlIHdlJ3JlIHVwZGF0aW5nIHJlZHV4XG4gICAgLy8gaGVyZSBtYW51YWxseSBvdXJzZWx2ZXMuIEF1IHJldm9pciBCYWNrYm9uZSFcbiAgICB3aW5kb3cuZ2V0Q29udmVyc2F0aW9ucygpLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgIGlmIChjb252ZXJzYXRpb24uZ2V0KCdjdXN0b21Db2xvcklkJykgPT09IGNvbG9ySWQpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jb252ZXJzYXRpb25Db2xvcjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jdXN0b21Db2xvcjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jdXN0b21Db2xvcklkO1xuXG4gICAgICAgIGNvbnZlcnNhdGlvbnNUb1VwZGF0ZS5wdXNoKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb252ZXJzYXRpb25zVG9VcGRhdGUubGVuZ3RoKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9ucyhjb252ZXJzYXRpb25zVG9VcGRhdGUpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IENVU1RPTV9DT0xPUl9SRU1PVkVELFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBjb2xvcklkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzZXRBbGxDaGF0Q29sb3JzKCk6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICBDb2xvcnNDaGFuZ2VkQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgLy8gQ2FsbGluZyB0aGlzIHdpdGggbm8gYXJncyB1bnNldHMgYWxsIHRoZSBjb2xvcnMgaW4gdGhlIGRiXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUFsbENvbnZlcnNhdGlvbkNvbG9ycygpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byB0cmlnZ2VyIGEgbW9kZWwgY2hhbmdlIGJlY2F1c2Ugd2UncmUgdXBkYXRpbmcgcmVkdXhcbiAgICAvLyBoZXJlIG1hbnVhbGx5IG91cnNlbHZlcy4gQXUgcmV2b2lyIEJhY2tib25lIVxuICAgIHdpbmRvdy5nZXRDb252ZXJzYXRpb25zKCkuZm9yRWFjaChjb252ZXJzYXRpb24gPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBkZWxldGUgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMuY29udmVyc2F0aW9uQ29sb3I7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jdXN0b21Db2xvcjtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgZGVsZXRlIGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLmN1c3RvbUNvbG9ySWQ7XG4gICAgfSk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBDT0xPUlNfQ0hBTkdFRCxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgY29udmVyc2F0aW9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgY3VzdG9tQ29sb3JEYXRhOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjb2xvclNlbGVjdGVkKHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGNvbnZlcnNhdGlvbkNvbG9yLFxuICBjdXN0b21Db2xvckRhdGEsXG59OiBDb2xvclNlbGVjdGVkUGF5bG9hZFR5cGUpOiBUaHVua0FjdGlvbjxcbiAgdm9pZCxcbiAgUm9vdFN0YXRlVHlwZSxcbiAgdW5rbm93bixcbiAgQ29sb3JTZWxlY3RlZEFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gYXN5bmMgZGlzcGF0Y2ggPT4ge1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gdHJpZ2dlciBhIG1vZGVsIGNoYW5nZSBiZWNhdXNlIHdlJ3JlIHVwZGF0aW5nIHJlZHV4XG4gICAgLy8gaGVyZSBtYW51YWxseSBvdXJzZWx2ZXMuIEF1IHJldm9pciBCYWNrYm9uZSFcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmIChjb252ZXJzYXRpb24pIHtcbiAgICAgIGlmIChjb252ZXJzYXRpb25Db2xvcikge1xuICAgICAgICBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jb252ZXJzYXRpb25Db2xvciA9IGNvbnZlcnNhdGlvbkNvbG9yO1xuICAgICAgICBpZiAoY3VzdG9tQ29sb3JEYXRhKSB7XG4gICAgICAgICAgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMuY3VzdG9tQ29sb3IgPSBjdXN0b21Db2xvckRhdGEudmFsdWU7XG4gICAgICAgICAgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMuY3VzdG9tQ29sb3JJZCA9IGN1c3RvbUNvbG9yRGF0YS5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMuY3VzdG9tQ29sb3I7XG4gICAgICAgICAgZGVsZXRlIGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLmN1c3RvbUNvbG9ySWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5jb252ZXJzYXRpb25Db2xvcjtcbiAgICAgICAgZGVsZXRlIGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLmN1c3RvbUNvbG9yO1xuICAgICAgICBkZWxldGUgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMuY3VzdG9tQ29sb3JJZDtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQ09MT1JfU0VMRUNURUQsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBjb252ZXJzYXRpb25Db2xvcixcbiAgICAgICAgY3VzdG9tQ29sb3JEYXRhLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlQ29tcG9zZUVkaXRpbmdBdmF0YXIoKTogVG9nZ2xlQ29tcG9zZUVkaXRpbmdBdmF0YXJBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBDT01QT1NFX1RPR0dMRV9FRElUSU5HX0FWQVRBUixcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbmNlbENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbihcbiAgY2FuY2VsZWRBdD86IG51bWJlclxuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIENhbmNlbFZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbkFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb25JZHNCbG9ja2VkID1cbiAgICAgIGdldENvbnZlcnNhdGlvbklkc1N0b3BwZWRGb3JWZXJpZmljYXRpb24oc3RhdGUpO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQ0FOQ0VMX0NPTlZFUlNBVElPTl9QRU5ESU5HX1ZFUklGSUNBVElPTixcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgY2FuY2VsZWRBdDogY2FuY2VsZWRBdCA/PyBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFN0YXJ0IHRoZSBibG9ja2VkIGNvbnZlcnNhdGlvbiBxdWV1ZXMgdXAgYWdhaW5cbiAgICBjb252ZXJzYXRpb25JZHNCbG9ja2VkLmZvckVhY2goY29udmVyc2F0aW9uSWQgPT4ge1xuICAgICAgY29udmVyc2F0aW9uSm9iUXVldWUucmVzb2x2ZVZlcmlmaWNhdGlvbldhaXRlcihjb252ZXJzYXRpb25JZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQoKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIENsZWFyVmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuICAgIGNvbnN0IHV1aWRzU3RvcHBpbmdTZW5kID0gZ2V0Q29udmVyc2F0aW9uVXVpZHNTdG9wcGluZ1NlbmQoc3RhdGUpO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkc0Jsb2NrZWQgPVxuICAgICAgZ2V0Q29udmVyc2F0aW9uSWRzU3RvcHBlZEZvclZlcmlmaWNhdGlvbihzdGF0ZSk7XG4gICAgbG9nLmluZm8oXG4gICAgICBgdmVyaWZ5Q29udmVyc2F0aW9uc1N0b3BwaW5nU2VuZDogU3RhcnRpbmcgd2l0aCAke2NvbnZlcnNhdGlvbklkc0Jsb2NrZWQubGVuZ3RofSBibG9ja2VkIGAgK1xuICAgICAgICBgY29udmVyc2F0aW9ucyBhbmQgJHt1dWlkc1N0b3BwaW5nU2VuZC5sZW5ndGh9IGNvbnZlcnNhdGlvbnMgdG8gdmVyaWZ5LmBcbiAgICApO1xuXG4gICAgLy8gTWFyayBjb252ZXJzYXRpb25zIGFzIGFwcHJvdmVkL3ZlcmlmaWVkIGFzIGFwcHJvcHJpYXRlXG4gICAgY29uc3QgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8dW5rbm93bj4+ID0gW107XG4gICAgdXVpZHNTdG9wcGluZ1NlbmQuZm9yRWFjaChhc3luYyB1dWlkID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldCh1dWlkKTtcbiAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGB2ZXJpZnlDb252ZXJzYXRpb25zU3RvcHBpbmdTZW5kOiBDYW5ub3QgdmVyaWZ5IG1pc3NpbmcgY29udmVyYXN0aW9uIGZvciB1dWlkICR7dXVpZH1gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGB2ZXJpZnlDb252ZXJzYXRpb25zU3RvcHBpbmdTZW5kOiBWZXJpZnlpbmcgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICk7XG4gICAgICBpZiAoY29udmVyc2F0aW9uLmlzVW52ZXJpZmllZCgpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2goY29udmVyc2F0aW9uLnNldFZlcmlmaWVkRGVmYXVsdCgpKTtcbiAgICAgIH1cbiAgICAgIHByb21pc2VzLnB1c2goY29udmVyc2F0aW9uLnNldEFwcHJvdmVkKCkpO1xuICAgIH0pO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQ0xFQVJfQ09OVkVSU0FUSU9OU19QRU5ESU5HX1ZFUklGSUNBVElPTixcbiAgICB9KTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgIC8vIFN0YXJ0IHRoZSBibG9ja2VkIGNvbnZlcnNhdGlvbiBxdWV1ZXMgdXAgYWdhaW5cbiAgICBjb252ZXJzYXRpb25JZHNCbG9ja2VkLmZvckVhY2goY29udmVyc2F0aW9uSWQgPT4ge1xuICAgICAgY29udmVyc2F0aW9uSm9iUXVldWUucmVzb2x2ZVZlcmlmaWNhdGlvbldhaXRlcihjb252ZXJzYXRpb25JZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNhbmNlbGxlZENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogQ2xlYXJDYW5jZWxsZWRWZXJpZmljYXRpb25BY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBDTEVBUl9DQU5DRUxMRURfVkVSSUZJQ0FUSU9OLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VTYXZlQXZhdGFyVG9EaXNrKFxuICBhdmF0YXJEYXRhOiBBdmF0YXJEYXRhVHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgQ29tcG9zZVNhdmVBdmF0YXJBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgaWYgKCFhdmF0YXJEYXRhLmJ1ZmZlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdmF0YXIgVWludDhBcnJheSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGltYWdlUGF0aCA9IGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy53cml0ZU5ld0F2YXRhckRhdGEoXG4gICAgICBhdmF0YXJEYXRhLmJ1ZmZlclxuICAgICk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBDT01QT1NFX0FERF9BVkFUQVIsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIC4uLmF2YXRhckRhdGEsXG4gICAgICAgIGltYWdlUGF0aCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VEZWxldGVBdmF0YXJGcm9tRGlzayhcbiAgYXZhdGFyRGF0YTogQXZhdGFyRGF0YVR5cGVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIENvbXBvc2VEZWxldGVBdmF0YXJBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgaWYgKGF2YXRhckRhdGEuaW1hZ2VQYXRoKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZGVsZXRlQXZhdGFyKGF2YXRhckRhdGEuaW1hZ2VQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdObyBpbWFnZVBhdGggZm9yIGF2YXRhckRhdGEuIFJlbW92aW5nIGZyb20gdXNlckF2YXRhckRhdGEsIGJ1dCBub3QgZGlzaydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQ09NUE9TRV9SRU1PVkVfQVZBVEFSLFxuICAgICAgcGF5bG9hZDogYXZhdGFyRGF0YSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29tcG9zZVJlcGxhY2VBdmF0YXIoXG4gIGN1cnI6IEF2YXRhckRhdGFUeXBlLFxuICBwcmV2PzogQXZhdGFyRGF0YVR5cGVcbik6IENvbXBvc2VSZXBsYWNlQXZhdGFyc0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IENPTVBPU0VfUkVQTEFDRV9BVkFUQVIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgY3VycixcbiAgICAgIHByZXYsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0UHJlSm9pbkNvbnZlcnNhdGlvbihcbiAgZGF0YTogUHJlSm9pbkNvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWRcbik6IFNldFByZUpvaW5Db252ZXJzYXRpb25BY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0VUX1BSRV9KT0lOX0NPTlZFUlNBVElPTicsXG4gICAgcGF5bG9hZDoge1xuICAgICAgZGF0YSxcbiAgICB9LFxuICB9O1xufVxuZnVuY3Rpb24gY29udmVyc2F0aW9uQWRkZWQoXG4gIGlkOiBzdHJpbmcsXG4gIGRhdGE6IENvbnZlcnNhdGlvblR5cGVcbik6IENvbnZlcnNhdGlvbkFkZGVkQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0NPTlZFUlNBVElPTl9BRERFRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgaWQsXG4gICAgICBkYXRhLFxuICAgIH0sXG4gIH07XG59XG5mdW5jdGlvbiBjb252ZXJzYXRpb25DaGFuZ2VkKFxuICBpZDogc3RyaW5nLFxuICBkYXRhOiBDb252ZXJzYXRpb25UeXBlXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBDb252ZXJzYXRpb25DaGFuZ2VkQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xuICAgIGNhbGxpbmcuZ3JvdXBNZW1iZXJzQ2hhbmdlZChpZCk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnQ09OVkVSU0FUSU9OX0NIQU5HRUQnLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBpZCxcbiAgICAgICAgZGF0YSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5mdW5jdGlvbiBjb252ZXJzYXRpb25SZW1vdmVkKGlkOiBzdHJpbmcpOiBDb252ZXJzYXRpb25SZW1vdmVkQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0NPTlZFUlNBVElPTl9SRU1PVkVEJyxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBpZCxcbiAgICB9LFxuICB9O1xufVxuZnVuY3Rpb24gY29udmVyc2F0aW9uVW5sb2FkZWQoaWQ6IHN0cmluZyk6IENvbnZlcnNhdGlvblVubG9hZGVkQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0NPTlZFUlNBVElPTl9VTkxPQURFRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgaWQsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR3JvdXAoXG4gIGNyZWF0ZUdyb3VwVjIgPSBncm91cHMuY3JlYXRlR3JvdXBWMlxuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIHwgQ3JlYXRlR3JvdXBQZW5kaW5nQWN0aW9uVHlwZVxuICB8IENyZWF0ZUdyb3VwRnVsZmlsbGVkQWN0aW9uVHlwZVxuICB8IENyZWF0ZUdyb3VwUmVqZWN0ZWRBY3Rpb25UeXBlXG4gIHwgU2VsZWN0ZWRDb252ZXJzYXRpb25DaGFuZ2VkQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gZ2V0U3RhdGUoKS5jb252ZXJzYXRpb25zO1xuICAgIGlmIChcbiAgICAgIGNvbXBvc2VyPy5zdGVwICE9PSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YSB8fFxuICAgICAgY29tcG9zZXIuaXNDcmVhdGluZ1xuICAgICkge1xuICAgICAgYXNzZXJ0KGZhbHNlLCAnQ2Fubm90IGNyZWF0ZSBncm91cCBpbiB0aGlzIHN0YWdlOyBkb2luZyBub3RoaW5nJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiAnQ1JFQVRFX0dST1VQX1BFTkRJTkcnIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IGNyZWF0ZUdyb3VwVjIoe1xuICAgICAgICBuYW1lOiBjb21wb3Nlci5ncm91cE5hbWUudHJpbSgpLFxuICAgICAgICBhdmF0YXI6IGNvbXBvc2VyLmdyb3VwQXZhdGFyLFxuICAgICAgICBhdmF0YXJzOiBjb21wb3Nlci51c2VyQXZhdGFyRGF0YS5tYXAoYXZhdGFyRGF0YSA9PlxuICAgICAgICAgIG9taXQoYXZhdGFyRGF0YSwgWydidWZmZXInXSlcbiAgICAgICAgKSxcbiAgICAgICAgZXhwaXJlVGltZXI6IGNvbXBvc2VyLmdyb3VwRXhwaXJlVGltZXIsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkczogY29tcG9zZXIuc2VsZWN0ZWRDb252ZXJzYXRpb25JZHMsXG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogJ0NSRUFURV9HUk9VUF9GVUxGSUxMRUQnLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgaW52aXRlZFV1aWRzOiAoY29udmVyc2F0aW9uLmdldCgncGVuZGluZ01lbWJlcnNWMicpIHx8IFtdKS5tYXAoXG4gICAgICAgICAgICBtZW1iZXIgPT4gbWVtYmVyLnV1aWRcbiAgICAgICAgICApLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBkaXNwYXRjaChcbiAgICAgICAgc2hvd0NvbnZlcnNhdGlvbih7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICBzd2l0Y2hUb0Fzc29jaWF0ZWRWaWV3OiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBncm91cCcsIGVyciAmJiBlcnIuc3RhY2sgPyBlcnIuc3RhY2sgOiBlcnIpO1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnQ1JFQVRFX0dST1VQX1JFSkVDVEVEJyB9KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUFsbENvbnZlcnNhdGlvbnMoKTogUmVtb3ZlQWxsQ29udmVyc2F0aW9uc0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdDT05WRVJTQVRJT05TX1JFTU9WRV9BTEwnLFxuICAgIHBheWxvYWQ6IG51bGwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdE1lc3NhZ2UoXG4gIG1lc3NhZ2VJZDogc3RyaW5nLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBNZXNzYWdlU2VsZWN0ZWRBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnTUVTU0FHRV9TRUxFQ1RFRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgbWVzc2FnZUlkLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVyc2F0aW9uU3RvcHBlZEJ5TWlzc2luZ1ZlcmlmaWNhdGlvbihwYXlsb2FkOiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIHVudHJ1c3RlZFV1aWRzOiBSZWFkb25seUFycmF5PHN0cmluZz47XG59KTogQ29udmVyc2F0aW9uU3RvcHBlZEJ5TWlzc2luZ1ZlcmlmaWNhdGlvbkFjdGlvblR5cGUge1xuICAvLyBGZXRjaGluZyBwcm9maWxlcyB0byBlbnN1cmUgdGhhdCB3ZSBoYXZlIHRoZWlyIGxhdGVzdCBpZGVudGl0eSBrZXkgaW4gc3RvcmFnZVxuICBwYXlsb2FkLnVudHJ1c3RlZFV1aWRzLmZvckVhY2godXVpZCA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHV1aWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGBjb252ZXJzYXRpb25TdG9wcGVkQnlNaXNzaW5nVmVyaWZpY2F0aW9uOiB1dWlkICR7dXVpZH0gbm90IGZvdW5kIWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW50ZW50aW9uYWxseSBub3QgYXdhaXRpbmcgaGVyZVxuICAgIGNvbnZlcnNhdGlvbi5nZXRQcm9maWxlcygpO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6IENPTlZFUlNBVElPTl9TVE9QUEVEX0JZX01JU1NJTkdfVkVSSUZJQ0FUSU9OLFxuICAgIHBheWxvYWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lc3NhZ2VDaGFuZ2VkKFxuICBpZDogc3RyaW5nLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBkYXRhOiBNZXNzYWdlQXR0cmlidXRlc1R5cGVcbik6IE1lc3NhZ2VDaGFuZ2VkQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ01FU1NBR0VfQ0hBTkdFRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgaWQsXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGRhdGEsXG4gICAgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIG1lc3NhZ2VEZWxldGVkKFxuICBpZDogc3RyaW5nLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBNZXNzYWdlRGVsZXRlZEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdNRVNTQUdFX0RFTEVURUQnLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIGlkLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIG1lc3NhZ2VFeHBhbmRlZChcbiAgaWQ6IHN0cmluZyxcbiAgZGlzcGxheUxpbWl0OiBudW1iZXJcbik6IE1lc3NhZ2VFeHBhbmRlZEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdNRVNTQUdFX0VYUEFOREVEJyxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBpZCxcbiAgICAgIGRpc3BsYXlMaW1pdCxcbiAgICB9LFxuICB9O1xufVxuZnVuY3Rpb24gbWVzc2FnZXNBZGRlZCh7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBpc0FjdGl2ZSxcbiAgaXNKdXN0U2VudCxcbiAgaXNOZXdNZXNzYWdlLFxuICBtZXNzYWdlcyxcbn06IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG4gIGlzSnVzdFNlbnQ6IGJvb2xlYW47XG4gIGlzTmV3TWVzc2FnZTogYm9vbGVhbjtcbiAgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT47XG59KTogTWVzc2FnZXNBZGRlZEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdNRVNTQUdFU19BRERFRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBpc0FjdGl2ZSxcbiAgICAgIGlzSnVzdFNlbnQsXG4gICAgICBpc05ld01lc3NhZ2UsXG4gICAgICBtZXNzYWdlcyxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXBhaXJOZXdlc3RNZXNzYWdlKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBSZXBhaXJOZXdlc3RNZXNzYWdlQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1JFUEFJUl9ORVdFU1RfTUVTU0FHRScsXG4gICAgcGF5bG9hZDoge1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlcGFpck9sZGVzdE1lc3NhZ2UoXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbik6IFJlcGFpck9sZGVzdE1lc3NhZ2VBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnUkVQQUlSX09MREVTVF9NRVNTQUdFJyxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZpZXdHcm91cE1lbWJlck5hbWVDb2xsaXNpb24oXG4gIGdyb3VwQ29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogUmV2aWV3R3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1JFVklFV19HUk9VUF9NRU1CRVJfTkFNRV9DT0xMSVNJT04nLFxuICAgIHBheWxvYWQ6IHsgZ3JvdXBDb252ZXJzYXRpb25JZCB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZpZXdNZXNzYWdlUmVxdWVzdE5hbWVDb2xsaXNpb24oXG4gIHBheWxvYWQ6IFJlYWRvbmx5PHtcbiAgICBzYWZlQ29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgfT5cbik6IFJldmlld01lc3NhZ2VSZXF1ZXN0TmFtZUNvbGxpc2lvbkFjdGlvblR5cGUge1xuICByZXR1cm4geyB0eXBlOiAnUkVWSUVXX01FU1NBR0VfUkVRVUVTVF9OQU1FX0NPTExJU0lPTicsIHBheWxvYWQgfTtcbn1cblxuZXhwb3J0IHR5cGUgTWVzc2FnZVJlc2V0T3B0aW9uc1R5cGUgPSBSZWFkb25seTx7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+O1xuICBtZXRyaWNzOiBNZXNzYWdlTWV0cmljc1R5cGU7XG4gIHNjcm9sbFRvTWVzc2FnZUlkPzogc3RyaW5nO1xuICB1bmJvdW5kZWRGZXRjaD86IGJvb2xlYW47XG59PjtcblxuZnVuY3Rpb24gbWVzc2FnZXNSZXNldCh7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBtZXNzYWdlcyxcbiAgbWV0cmljcyxcbiAgc2Nyb2xsVG9NZXNzYWdlSWQsXG4gIHVuYm91bmRlZEZldGNoLFxufTogTWVzc2FnZVJlc2V0T3B0aW9uc1R5cGUpOiBNZXNzYWdlc1Jlc2V0QWN0aW9uVHlwZSB7XG4gIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIG1lc3NhZ2UuY29udmVyc2F0aW9uSWQgPT09IGNvbnZlcnNhdGlvbklkLFxuICAgICAgYG1lc3NhZ2VzUmVzZXQoJHtjb252ZXJzYXRpb25JZH0pOiBpbnZhbGlkIG1lc3NhZ2UgY29udmVyc2F0aW9uSWQgYCArXG4gICAgICAgIGAke21lc3NhZ2UuY29udmVyc2F0aW9uSWR9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdNRVNTQUdFU19SRVNFVCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdW5ib3VuZGVkRmV0Y2g6IEJvb2xlYW4odW5ib3VuZGVkRmV0Y2gpLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBtZXNzYWdlcyxcbiAgICAgIG1ldHJpY3MsXG4gICAgICBzY3JvbGxUb01lc3NhZ2VJZCxcbiAgICB9LFxuICB9O1xufVxuZnVuY3Rpb24gc2V0TWVzc2FnZUxvYWRpbmdTdGF0ZShcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgbWVzc2FnZUxvYWRpbmdTdGF0ZTogdW5kZWZpbmVkIHwgVGltZWxpbmVNZXNzYWdlTG9hZGluZ1N0YXRlXG4pOiBTZXRNZXNzYWdlTG9hZGluZ1N0YXRlQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFVF9NRVNTQUdFX0xPQURJTkdfU1RBVEUnLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgbWVzc2FnZUxvYWRpbmdTdGF0ZSxcbiAgICB9LFxuICB9O1xufVxuZnVuY3Rpb24gc2V0SXNOZWFyQm90dG9tKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBpc05lYXJCb3R0b206IGJvb2xlYW5cbik6IFNldElzTmVhckJvdHRvbUFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdTRVRfTkVBUl9CT1RUT00nLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgaXNOZWFyQm90dG9tLFxuICAgIH0sXG4gIH07XG59XG5mdW5jdGlvbiBzZXRJc0ZldGNoaW5nVVVJRChcbiAgaWRlbnRpZmllcjogVVVJREZldGNoU3RhdGVLZXlUeXBlLFxuICBpc0ZldGNoaW5nOiBib29sZWFuXG4pOiBTZXRJc0ZldGNoaW5nVVVJREFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdTRVRfSVNfRkVUQ0hJTkdfVVVJRCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgaWRlbnRpZmllcixcbiAgICAgIGlzRmV0Y2hpbmcsXG4gICAgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIHNldFNlbGVjdGVkQ29udmVyc2F0aW9uSGVhZGVyVGl0bGUoXG4gIHRpdGxlPzogc3RyaW5nXG4pOiBTZXRDb252ZXJzYXRpb25IZWFkZXJUaXRsZUFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdTRVRfQ09OVkVSU0FUSU9OX0hFQURFUl9USVRMRScsXG4gICAgcGF5bG9hZDogeyB0aXRsZSB9LFxuICB9O1xufVxuZnVuY3Rpb24gc2V0U2VsZWN0ZWRDb252ZXJzYXRpb25QYW5lbERlcHRoKFxuICBwYW5lbERlcHRoOiBudW1iZXJcbik6IFNldFNlbGVjdGVkQ29udmVyc2F0aW9uUGFuZWxEZXB0aEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdTRVRfU0VMRUNURURfQ09OVkVSU0FUSU9OX1BBTkVMX0RFUFRIJyxcbiAgICBwYXlsb2FkOiB7IHBhbmVsRGVwdGggfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIHNldFJlY2VudE1lZGlhSXRlbXMoXG4gIGlkOiBzdHJpbmcsXG4gIHJlY2VudE1lZGlhSXRlbXM6IEFycmF5PE1lZGlhSXRlbVR5cGU+XG4pOiBTZXRSZWNlbnRNZWRpYUl0ZW1zQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFVF9SRUNFTlRfTUVESUFfSVRFTVMnLFxuICAgIHBheWxvYWQ6IHsgaWQsIHJlY2VudE1lZGlhSXRlbXMgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsZWFySW52aXRlZFV1aWRzRm9yTmV3bHlDcmVhdGVkR3JvdXAoKTogQ2xlYXJJbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cEFjdGlvblR5cGUge1xuICByZXR1cm4geyB0eXBlOiAnQ0xFQVJfSU5WSVRFRF9VVUlEU19GT1JfTkVXTFlfQ1JFQVRFRF9HUk9VUCcgfTtcbn1cbmZ1bmN0aW9uIGNsZWFyR3JvdXBDcmVhdGlvbkVycm9yKCk6IENsZWFyR3JvdXBDcmVhdGlvbkVycm9yQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6ICdDTEVBUl9HUk9VUF9DUkVBVElPTl9FUlJPUicgfTtcbn1cbmZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRNZXNzYWdlKCk6IENsZWFyU2VsZWN0ZWRNZXNzYWdlQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0NMRUFSX1NFTEVDVEVEX01FU1NBR0UnLFxuICAgIHBheWxvYWQ6IG51bGwsXG4gIH07XG59XG5mdW5jdGlvbiBjbGVhclVucmVhZE1ldHJpY3MoXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbik6IENsZWFyVW5yZWFkTWV0cmljc0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdDTEVBUl9VTlJFQURfTUVUUklDUycsXG4gICAgcGF5bG9hZDoge1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgfSxcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsb3NlQ29udGFjdFNwb29maW5nUmV2aWV3KCk6IENsb3NlQ29udGFjdFNwb29maW5nUmV2aWV3QWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6ICdDTE9TRV9DT05UQUNUX1NQT09GSU5HX1JFVklFVycgfTtcbn1cbmZ1bmN0aW9uIGNsb3NlTWF4aW11bUdyb3VwU2l6ZU1vZGFsKCk6IENsb3NlTWF4aW11bUdyb3VwU2l6ZU1vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6ICdDTE9TRV9NQVhJTVVNX0dST1VQX1NJWkVfTU9EQUwnIH07XG59XG5mdW5jdGlvbiBjbG9zZVJlY29tbWVuZGVkR3JvdXBTaXplTW9kYWwoKTogQ2xvc2VSZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6ICdDTE9TRV9SRUNPTU1FTkRFRF9HUk9VUF9TSVpFX01PREFMJyB9O1xufVxuZnVuY3Rpb24gc2Nyb2xsVG9NZXNzYWdlKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBtZXNzYWdlSWQ6IHN0cmluZ1xuKTogU2Nyb2xsVG9NZXNzYWdlQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NDUk9MTF9UT19NRVNTQUdFJyxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIG1lc3NhZ2VJZCxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRDb21wb3NlR3JvdXBBdmF0YXIoXG4gIGdyb3VwQXZhdGFyOiB1bmRlZmluZWQgfCBVaW50OEFycmF5XG4pOiBTZXRDb21wb3NlR3JvdXBBdmF0YXJBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0VUX0NPTVBPU0VfR1JPVVBfQVZBVEFSJyxcbiAgICBwYXlsb2FkOiB7IGdyb3VwQXZhdGFyIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldENvbXBvc2VHcm91cE5hbWUoZ3JvdXBOYW1lOiBzdHJpbmcpOiBTZXRDb21wb3NlR3JvdXBOYW1lQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFVF9DT01QT1NFX0dST1VQX05BTUUnLFxuICAgIHBheWxvYWQ6IHsgZ3JvdXBOYW1lIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldENvbXBvc2VHcm91cEV4cGlyZVRpbWVyKFxuICBncm91cEV4cGlyZVRpbWVyOiBudW1iZXJcbik6IFNldENvbXBvc2VHcm91cEV4cGlyZVRpbWVyQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFVF9DT01QT1NFX0dST1VQX0VYUElSRV9USU1FUicsXG4gICAgcGF5bG9hZDogeyBncm91cEV4cGlyZVRpbWVyIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldENvbXBvc2VTZWFyY2hUZXJtKFxuICBzZWFyY2hUZXJtOiBzdHJpbmdcbik6IFNldENvbXBvc2VTZWFyY2hUZXJtQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFVF9DT01QT1NFX1NFQVJDSF9URVJNJyxcbiAgICBwYXlsb2FkOiB7IHNlYXJjaFRlcm0gfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RhcnRDb21wb3NpbmcoKTogU3RhcnRDb21wb3NpbmdBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHsgdHlwZTogJ1NUQVJUX0NPTVBPU0lORycgfTtcbn1cblxuZnVuY3Rpb24gc2hvd0Nob29zZUdyb3VwTWVtYmVycygpOiBTaG93Q2hvb3NlR3JvdXBNZW1iZXJzQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6ICdTSE9XX0NIT09TRV9HUk9VUF9NRU1CRVJTJyB9O1xufVxuXG5mdW5jdGlvbiBzdGFydFNldHRpbmdHcm91cE1ldGFkYXRhKCk6IFN0YXJ0U2V0dGluZ0dyb3VwTWV0YWRhdGFBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHsgdHlwZTogJ1NUQVJUX1NFVFRJTkdfR1JPVVBfTUVUQURBVEEnIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNvbnZlcnNhdGlvbkluQ2hvb3NlTWVtYmVycyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIFRvZ2dsZUNvbnZlcnNhdGlvbkluQ2hvb3NlTWVtYmVyc0FjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IG1heFJlY29tbWVuZGVkR3JvdXBTaXplID0gZ2V0R3JvdXBTaXplUmVjb21tZW5kZWRMaW1pdCgxNTEpO1xuICAgIGNvbnN0IG1heEdyb3VwU2l6ZSA9IE1hdGgubWF4KFxuICAgICAgZ2V0R3JvdXBTaXplSGFyZExpbWl0KDEwMDEpLFxuICAgICAgbWF4UmVjb21tZW5kZWRHcm91cFNpemUgKyAxXG4gICAgKTtcblxuICAgIGFzc2VydChcbiAgICAgIG1heEdyb3VwU2l6ZSA+IG1heFJlY29tbWVuZGVkR3JvdXBTaXplLFxuICAgICAgJ0V4cGVjdGVkIHRoZSBoYXJkIG1heCBncm91cCBzaXplIHRvIGJlIGxhcmdlciB0aGFuIHRoZSByZWNvbW1lbmRlZCBtYXhpbXVtJ1xuICAgICk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnVE9HR0xFX0NPTlZFUlNBVElPTl9JTl9DSE9PU0VfTUVNQkVSUycsXG4gICAgICBwYXlsb2FkOiB7IGNvbnZlcnNhdGlvbklkLCBtYXhHcm91cFNpemUsIG1heFJlY29tbWVuZGVkR3JvdXBTaXplIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUhpZGVTdG9yaWVzKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBOb29wQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbk1vZGVsID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoY29udmVyc2F0aW9uTW9kZWwpIHtcbiAgICAgIGNvbnZlcnNhdGlvbk1vZGVsLnRvZ2dsZUhpZGVTdG9yaWVzKCk7XG4gICAgfVxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1lbWJlckZyb21Hcm91cChcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgY29udGFjdElkOiBzdHJpbmdcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIE5vb3BBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uTW9kZWwgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmIChjb252ZXJzYXRpb25Nb2RlbCkge1xuICAgICAgY29uc3QgaWRGb3JMb2dnaW5nID0gY29udmVyc2F0aW9uTW9kZWwuaWRGb3JMb2dnaW5nKCk7XG4gICAgICBsb25nUnVubmluZ1Rhc2tXcmFwcGVyKHtcbiAgICAgICAgbmFtZTogJ3JlbW92ZU1lbWJlckZyb21Hcm91cCcsXG4gICAgICAgIGlkRm9yTG9nZ2luZyxcbiAgICAgICAgdGFzazogKCkgPT4gY29udmVyc2F0aW9uTW9kZWwucmVtb3ZlRnJvbUdyb3VwVjIoY29udGFjdElkKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnTk9PUCcsXG4gICAgICBwYXlsb2FkOiBudWxsLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0YWdHcm91cHNBc05ld0dyb3VwU3RvcnkoXG4gIGNvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPlxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgTm9vcEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGNvbnZlcnNhdGlvbklkcy5tYXAoYXN5bmMgY29udmVyc2F0aW9uSWQgPT4ge1xuICAgICAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgICAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnZlcnNhdGlvbi5zZXQoeyBpc0dyb3VwU3RvcnlTZW5kUmVhZHk6IHRydWUgfSk7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ05PT1AnLFxuICAgICAgcGF5bG9hZDogbnVsbCxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlQWRtaW4oXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIGNvbnRhY3RJZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBOb29wQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbk1vZGVsID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoY29udmVyc2F0aW9uTW9kZWwpIHtcbiAgICAgIGNvbnZlcnNhdGlvbk1vZGVsLnRvZ2dsZUFkbWluKGNvbnRhY3RJZCk7XG4gICAgfVxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbnZlcnNhdGlvbk1vZGVsU2hhcmVkR3JvdXBzKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBOb29wQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKGNvbnZlcnNhdGlvbiAmJiBjb252ZXJzYXRpb24udGhyb3R0bGVkVXBkYXRlU2hhcmVkR3JvdXBzKSB7XG4gICAgICBjb252ZXJzYXRpb24udGhyb3R0bGVkVXBkYXRlU2hhcmVkR3JvdXBzKCk7XG4gICAgfVxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNob3dJbmJveCgpOiBTaG93SW5ib3hBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0hPV19JTkJPWCcsXG4gICAgcGF5bG9hZDogbnVsbCxcbiAgfTtcbn1cblxudHlwZSBTaG93Q29udmVyc2F0aW9uQXJnc1R5cGUgPSB7XG4gIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nO1xuICBtZXNzYWdlSWQ/OiBzdHJpbmc7XG4gIHN3aXRjaFRvQXNzb2NpYXRlZFZpZXc/OiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIFNob3dDb252ZXJzYXRpb25UeXBlID0gKF86IFNob3dDb252ZXJzYXRpb25BcmdzVHlwZSkgPT4gdW5rbm93bjtcblxuZnVuY3Rpb24gc2hvd0NvbnZlcnNhdGlvbih7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBtZXNzYWdlSWQsXG4gIHN3aXRjaFRvQXNzb2NpYXRlZFZpZXcsXG59OiBTaG93Q29udmVyc2F0aW9uQXJnc1R5cGUpOiBTZWxlY3RlZENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTRUxFQ1RFRF9DT05WRVJTQVRJT05fQ0hBTkdFRCxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBpZDogY29udmVyc2F0aW9uSWQsXG4gICAgICBtZXNzYWdlSWQsXG4gICAgICBzd2l0Y2hUb0Fzc29jaWF0ZWRWaWV3LFxuICAgIH0sXG4gIH07XG59XG5mdW5jdGlvbiBzaG93QXJjaGl2ZWRDb252ZXJzYXRpb25zKCk6IFNob3dBcmNoaXZlZENvbnZlcnNhdGlvbnNBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0hPV19BUkNISVZFRF9DT05WRVJTQVRJT05TJyxcbiAgICBwYXlsb2FkOiBudWxsLFxuICB9O1xufVxuXG5mdW5jdGlvbiBkb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZShtZXNzYWdlSWQ6IHN0cmluZyk6IE5vb3BBY3Rpb25UeXBlIHtcbiAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5nZXRCeUlkKG1lc3NhZ2VJZCk7XG4gIGlmIChtZXNzYWdlKSB7XG4gICAgbWVzc2FnZS5kb3VibGVDaGVja01pc3NpbmdRdW90ZVJlZmVyZW5jZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnTk9PUCcsXG4gICAgcGF5bG9hZDogbnVsbCxcbiAgfTtcbn1cblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICBjb252ZXJzYXRpb25Mb29rdXA6IHt9LFxuICAgIGNvbnZlcnNhdGlvbnNCeUUxNjQ6IHt9LFxuICAgIGNvbnZlcnNhdGlvbnNCeVV1aWQ6IHt9LFxuICAgIGNvbnZlcnNhdGlvbnNCeUdyb3VwSWQ6IHt9LFxuICAgIGNvbnZlcnNhdGlvbnNCeVVzZXJuYW1lOiB7fSxcbiAgICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb246IHt9LFxuICAgIG1lc3NhZ2VzQnlDb252ZXJzYXRpb246IHt9LFxuICAgIG1lc3NhZ2VzTG9va3VwOiB7fSxcbiAgICBzZWxlY3RlZE1lc3NhZ2VDb3VudGVyOiAwLFxuICAgIHNob3dBcmNoaXZlZDogZmFsc2UsXG4gICAgc2VsZWN0ZWRDb252ZXJzYXRpb25UaXRsZTogJycsXG4gICAgc2VsZWN0ZWRDb252ZXJzYXRpb25QYW5lbERlcHRoOiAwLFxuICAgIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZS5Ob25lLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ29udmVyc2F0aW9uTG9va3VwcyhcbiAgYWRkZWQ6IENvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQsXG4gIHJlbW92ZWQ6IENvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQsXG4gIHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlXG4pOiBQaWNrPFxuICBDb252ZXJzYXRpb25zU3RhdGVUeXBlLFxuICB8ICdjb252ZXJzYXRpb25zQnlFMTY0J1xuICB8ICdjb252ZXJzYXRpb25zQnlVdWlkJ1xuICB8ICdjb252ZXJzYXRpb25zQnlHcm91cElkJ1xuICB8ICdjb252ZXJzYXRpb25zQnlVc2VybmFtZSdcbj4ge1xuICBjb25zdCByZXN1bHQgPSB7XG4gICAgY29udmVyc2F0aW9uc0J5RTE2NDogc3RhdGUuY29udmVyc2F0aW9uc0J5RTE2NCxcbiAgICBjb252ZXJzYXRpb25zQnlVdWlkOiBzdGF0ZS5jb252ZXJzYXRpb25zQnlVdWlkLFxuICAgIGNvbnZlcnNhdGlvbnNCeUdyb3VwSWQ6IHN0YXRlLmNvbnZlcnNhdGlvbnNCeUdyb3VwSWQsXG4gICAgY29udmVyc2F0aW9uc0J5VXNlcm5hbWU6IHN0YXRlLmNvbnZlcnNhdGlvbnNCeVVzZXJuYW1lLFxuICB9O1xuXG4gIGlmIChyZW1vdmVkICYmIHJlbW92ZWQuZTE2NCkge1xuICAgIHJlc3VsdC5jb252ZXJzYXRpb25zQnlFMTY0ID0gb21pdChyZXN1bHQuY29udmVyc2F0aW9uc0J5RTE2NCwgcmVtb3ZlZC5lMTY0KTtcbiAgfVxuICBpZiAocmVtb3ZlZCAmJiByZW1vdmVkLnV1aWQpIHtcbiAgICByZXN1bHQuY29udmVyc2F0aW9uc0J5VXVpZCA9IG9taXQocmVzdWx0LmNvbnZlcnNhdGlvbnNCeVV1aWQsIHJlbW92ZWQudXVpZCk7XG4gIH1cbiAgaWYgKHJlbW92ZWQgJiYgcmVtb3ZlZC5ncm91cElkKSB7XG4gICAgcmVzdWx0LmNvbnZlcnNhdGlvbnNCeUdyb3VwSWQgPSBvbWl0KFxuICAgICAgcmVzdWx0LmNvbnZlcnNhdGlvbnNCeUdyb3VwSWQsXG4gICAgICByZW1vdmVkLmdyb3VwSWRcbiAgICApO1xuICB9XG4gIGlmIChyZW1vdmVkICYmIHJlbW92ZWQudXNlcm5hbWUpIHtcbiAgICByZXN1bHQuY29udmVyc2F0aW9uc0J5VXNlcm5hbWUgPSBvbWl0KFxuICAgICAgcmVzdWx0LmNvbnZlcnNhdGlvbnNCeVVzZXJuYW1lLFxuICAgICAgcmVtb3ZlZC51c2VybmFtZVxuICAgICk7XG4gIH1cblxuICBpZiAoYWRkZWQgJiYgYWRkZWQuZTE2NCkge1xuICAgIHJlc3VsdC5jb252ZXJzYXRpb25zQnlFMTY0ID0ge1xuICAgICAgLi4ucmVzdWx0LmNvbnZlcnNhdGlvbnNCeUUxNjQsXG4gICAgICBbYWRkZWQuZTE2NF06IGFkZGVkLFxuICAgIH07XG4gIH1cbiAgaWYgKGFkZGVkICYmIGFkZGVkLnV1aWQpIHtcbiAgICByZXN1bHQuY29udmVyc2F0aW9uc0J5VXVpZCA9IHtcbiAgICAgIC4uLnJlc3VsdC5jb252ZXJzYXRpb25zQnlVdWlkLFxuICAgICAgW2FkZGVkLnV1aWRdOiBhZGRlZCxcbiAgICB9O1xuICB9XG4gIGlmIChhZGRlZCAmJiBhZGRlZC5ncm91cElkKSB7XG4gICAgcmVzdWx0LmNvbnZlcnNhdGlvbnNCeUdyb3VwSWQgPSB7XG4gICAgICAuLi5yZXN1bHQuY29udmVyc2F0aW9uc0J5R3JvdXBJZCxcbiAgICAgIFthZGRlZC5ncm91cElkXTogYWRkZWQsXG4gICAgfTtcbiAgfVxuICBpZiAoYWRkZWQgJiYgYWRkZWQudXNlcm5hbWUpIHtcbiAgICByZXN1bHQuY29udmVyc2F0aW9uc0J5VXNlcm5hbWUgPSB7XG4gICAgICAuLi5yZXN1bHQuY29udmVyc2F0aW9uc0J5VXNlcm5hbWUsXG4gICAgICBbYWRkZWQudXNlcm5hbWVdOiBhZGRlZCxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY2xvc2VDb21wb3Nlck1vZGFsKFxuICBzdGF0ZTogUmVhZG9ubHk8Q29udmVyc2F0aW9uc1N0YXRlVHlwZT4sXG4gIG1vZGFsVG9DbG9zZTogJ21heGltdW1Hcm91cFNpemVNb2RhbFN0YXRlJyB8ICdyZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsU3RhdGUnXG4pOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlIHtcbiAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG4gIGlmIChjb21wb3Nlcj8uc3RlcCAhPT0gQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVycykge1xuICAgIGFzc2VydChmYWxzZSwgXCJDYW4ndCBjbG9zZSB0aGUgbW9kYWwgaW4gdGhpcyBjb21wb3NlciBzdGVwLiBEb2luZyBub3RoaW5nXCIpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICBpZiAoY29tcG9zZXJbbW9kYWxUb0Nsb3NlXSAhPT0gT25lVGltZU1vZGFsU3RhdGUuU2hvd2luZykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGNvbXBvc2VyOiB7XG4gICAgICAuLi5jb21wb3NlcixcbiAgICAgIFttb2RhbFRvQ2xvc2VdOiBPbmVUaW1lTW9kYWxTdGF0ZS5TaG93bixcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihcbiAgc3RhdGU6IFJlYWRvbmx5PENvbnZlcnNhdGlvbnNTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PENvbnZlcnNhdGlvbkFjdGlvblR5cGU+XG4pOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlIHtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBDTEVBUl9DT05WRVJTQVRJT05TX1BFTkRJTkdfVkVSSUZJQ0FUSU9OKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uOiB7fSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBDTEVBUl9DQU5DRUxMRURfVkVSSUZJQ0FUSU9OKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgeyB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24gfSA9IHN0YXRlO1xuXG4gICAgY29uc3QgZXhpc3RpbmdQZW5kaW5nU3RhdGUgPSBnZXRPd24oXG4gICAgICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24sXG4gICAgICBjb252ZXJzYXRpb25JZFxuICAgICk7XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYWN0aXZlIHZlcmlmaWNhdGlvbnMgcmVxdWlyZWQsIHRoaXMgd2lsbCBkbyBub3RoaW5nLlxuICAgIGlmIChcbiAgICAgIGV4aXN0aW5nUGVuZGluZ1N0YXRlICYmXG4gICAgICBleGlzdGluZ1BlbmRpbmdTdGF0ZS50eXBlID09PVxuICAgICAgICBDb252ZXJzYXRpb25WZXJpZmljYXRpb25TdGF0ZS5QZW5kaW5nVmVyaWZpY2F0aW9uXG4gICAgKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uOiBvbWl0KFxuICAgICAgICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24sXG4gICAgICAgIGNvbnZlcnNhdGlvbklkXG4gICAgICApLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IENBTkNFTF9DT05WRVJTQVRJT05fUEVORElOR19WRVJJRklDQVRJT04pIHtcbiAgICBjb25zdCB7IGNhbmNlbGVkQXQgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHsgdmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uIH0gPSBzdGF0ZTtcbiAgICBjb25zdCBuZXd2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb246IFJlY29yZDxcbiAgICAgIHN0cmluZyxcbiAgICAgIENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbkRhdGFcbiAgICA+ID0ge307XG5cbiAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uKTtcbiAgICBpZiAoIWVudHJpZXMubGVuZ3RoKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgJ0NBTkNFTF9DT05WRVJTQVRJT05fUEVORElOR19WRVJJRklDQVRJT046IE5vIGNvbnZlcnNhdGlvbnMgcGVuZGluZyB2ZXJpZmljYXRpb24nXG4gICAgICApO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2NvbnZlcnNhdGlvbklkLCBkYXRhXSBvZiBlbnRyaWVzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGRhdGEudHlwZSA9PT0gQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuVmVyaWZpY2F0aW9uQ2FuY2VsbGVkICYmXG4gICAgICAgIGRhdGEuY2FuY2VsZWRBdCA+IGNhbmNlbGVkQXRcbiAgICAgICkge1xuICAgICAgICBuZXd2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdID0gZGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld3ZlcmlmaWNhdGlvbkRhdGFCeUNvbnZlcnNhdGlvbltjb252ZXJzYXRpb25JZF0gPSB7XG4gICAgICAgICAgdHlwZTogQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuVmVyaWZpY2F0aW9uQ2FuY2VsbGVkLFxuICAgICAgICAgIGNhbmNlbGVkQXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uOiBuZXd2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0NMRUFSX0lOVklURURfVVVJRFNfRk9SX05FV0xZX0NSRUFURURfR1JPVVAnKSB7XG4gICAgcmV0dXJuIG9taXQoc3RhdGUsICdpbnZpdGVkVXVpZHNGb3JOZXdseUNyZWF0ZWRHcm91cCcpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ0xFQVJfR1JPVVBfQ1JFQVRJT05fRVJST1InKSB7XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG4gICAgaWYgKGNvbXBvc2VyPy5zdGVwICE9PSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YSkge1xuICAgICAgYXNzZXJ0KFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgXCJDYW4ndCBjbGVhciBncm91cCBjcmVhdGlvbiBlcnJvciBpbiB0aGlzIGNvbXBvc2VyIHN0YXRlLiBEb2luZyBub3RoaW5nXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgIC4uLmNvbXBvc2VyLFxuICAgICAgICBoYXNFcnJvcjogZmFsc2UsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDTE9TRV9DT05UQUNUX1NQT09GSU5HX1JFVklFVycpIHtcbiAgICByZXR1cm4gb21pdChzdGF0ZSwgJ2NvbnRhY3RTcG9vZmluZ1JldmlldycpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ0xPU0VfTUFYSU1VTV9HUk9VUF9TSVpFX01PREFMJykge1xuICAgIHJldHVybiBjbG9zZUNvbXBvc2VyTW9kYWwoc3RhdGUsICdtYXhpbXVtR3JvdXBTaXplTW9kYWxTdGF0ZScgYXMgY29uc3QpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ0xPU0VfUkVDT01NRU5ERURfR1JPVVBfU0laRV9NT0RBTCcpIHtcbiAgICByZXR1cm4gY2xvc2VDb21wb3Nlck1vZGFsKHN0YXRlLCAncmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlJyBhcyBjb25zdCk7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IERJU0NBUkRfTUVTU0FHRVMpIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBpZiAoJ251bWJlclRvS2VlcEF0Qm90dG9tJyBpbiBhY3Rpb24ucGF5bG9hZCkge1xuICAgICAgY29uc3QgeyBudW1iZXJUb0tlZXBBdEJvdHRvbSB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25NZXNzYWdlcyA9IGdldE93bihcbiAgICAgICAgc3RhdGUubWVzc2FnZXNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgY29udmVyc2F0aW9uSWRcbiAgICAgICk7XG4gICAgICBpZiAoIWNvbnZlcnNhdGlvbk1lc3NhZ2VzKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBtZXNzYWdlSWRzOiBvbGRNZXNzYWdlSWRzIH0gPSBjb252ZXJzYXRpb25NZXNzYWdlcztcbiAgICAgIGlmIChvbGRNZXNzYWdlSWRzLmxlbmd0aCA8PSBudW1iZXJUb0tlZXBBdEJvdHRvbSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VJZHNUb1JlbW92ZSA9IG9sZE1lc3NhZ2VJZHMuc2xpY2UoMCwgLW51bWJlclRvS2VlcEF0Qm90dG9tKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VJZHNUb0tlZXAgPSBvbGRNZXNzYWdlSWRzLnNsaWNlKC1udW1iZXJUb0tlZXBBdEJvdHRvbSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBtZXNzYWdlc0xvb2t1cDogb21pdChzdGF0ZS5tZXNzYWdlc0xvb2t1cCwgbWVzc2FnZUlkc1RvUmVtb3ZlKSxcbiAgICAgICAgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgLi4uY29udmVyc2F0aW9uTWVzc2FnZXMsXG4gICAgICAgICAgICBtZXNzYWdlSWRzOiBtZXNzYWdlSWRzVG9LZWVwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICgnbnVtYmVyVG9LZWVwQXRUb3AnIGluIGFjdGlvbi5wYXlsb2FkKSB7XG4gICAgICBjb25zdCB7IG51bWJlclRvS2VlcEF0VG9wIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbk1lc3NhZ2VzID0gZ2V0T3duKFxuICAgICAgICBzdGF0ZS5tZXNzYWdlc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBjb252ZXJzYXRpb25JZFxuICAgICAgKTtcbiAgICAgIGlmICghY29udmVyc2F0aW9uTWVzc2FnZXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IG1lc3NhZ2VJZHM6IG9sZE1lc3NhZ2VJZHMgfSA9IGNvbnZlcnNhdGlvbk1lc3NhZ2VzO1xuICAgICAgaWYgKG9sZE1lc3NhZ2VJZHMubGVuZ3RoIDw9IG51bWJlclRvS2VlcEF0VG9wKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVzc2FnZUlkc1RvUmVtb3ZlID0gb2xkTWVzc2FnZUlkcy5zbGljZShudW1iZXJUb0tlZXBBdFRvcCk7XG4gICAgICBjb25zdCBtZXNzYWdlSWRzVG9LZWVwID0gb2xkTWVzc2FnZUlkcy5zbGljZSgwLCBudW1iZXJUb0tlZXBBdFRvcCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBtZXNzYWdlc0xvb2t1cDogb21pdChzdGF0ZS5tZXNzYWdlc0xvb2t1cCwgbWVzc2FnZUlkc1RvUmVtb3ZlKSxcbiAgICAgICAgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgLi4uY29udmVyc2F0aW9uTWVzc2FnZXMsXG4gICAgICAgICAgICBtZXNzYWdlSWRzOiBtZXNzYWdlSWRzVG9LZWVwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoYWN0aW9uLnBheWxvYWQpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX1BSRV9KT0lOX0NPTlZFUlNBVElPTicpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHBheWxvYWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBwcmVKb2luQ29udmVyc2F0aW9uOiBkYXRhLFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ09OVkVSU0FUSU9OX0FEREVEJykge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgaWQsIGRhdGEgfSA9IHBheWxvYWQ7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25Mb29rdXAgfSA9IHN0YXRlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY29udmVyc2F0aW9uTG9va3VwOiB7XG4gICAgICAgIC4uLmNvbnZlcnNhdGlvbkxvb2t1cCxcbiAgICAgICAgW2lkXTogZGF0YSxcbiAgICAgIH0sXG4gICAgICAuLi51cGRhdGVDb252ZXJzYXRpb25Mb29rdXBzKGRhdGEsIHVuZGVmaW5lZCwgc3RhdGUpLFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ09OVkVSU0FUSU9OX0NIQU5HRUQnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBpZCwgZGF0YSB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkxvb2t1cCB9ID0gc3RhdGU7XG5cbiAgICBjb25zdCB7IHNlbGVjdGVkQ29udmVyc2F0aW9uSWQgfSA9IHN0YXRlO1xuICAgIGxldCB7IHNob3dBcmNoaXZlZCB9ID0gc3RhdGU7XG5cbiAgICBjb25zdCBleGlzdGluZyA9IGNvbnZlcnNhdGlvbkxvb2t1cFtpZF07XG4gICAgLy8gV2Ugb25seSBtb2RpZnkgdGhlIGxvb2t1cCBpZiB3ZSBhbHJlYWR5IGhhZCB0aGF0IGNvbnZlcnNhdGlvbiBhbmQgdGhlIGNvbnZlcnNhdGlvblxuICAgIC8vICAgY2hhbmdlZC5cbiAgICBpZiAoIWV4aXN0aW5nIHx8IGRhdGEgPT09IGV4aXN0aW5nKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5c1RvT21pdDogQXJyYXk8a2V5b2YgQ29udmVyc2F0aW9uc1N0YXRlVHlwZT4gPSBbXTtcblxuICAgIGlmIChzZWxlY3RlZENvbnZlcnNhdGlvbklkID09PSBpZCkge1xuICAgICAgLy8gQXJjaGl2ZWQgLT4gSW5ib3g6IHdlIGdvIGJhY2sgdG8gdGhlIG5vcm1hbCBpbmJveCB2aWV3XG4gICAgICBpZiAoZXhpc3RpbmcuaXNBcmNoaXZlZCAmJiAhZGF0YS5pc0FyY2hpdmVkKSB7XG4gICAgICAgIHNob3dBcmNoaXZlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gSW5ib3ggLT4gQXJjaGl2ZWQ6IG5vIGNvbnZlcnNhdGlvbiBpcyBzZWxlY3RlZFxuICAgICAgLy8gTm90ZTogV2l0aCB0b2RheSdzIHN0YWNrZWQgY29udmVyc2F0aW9ucyBhcmNoaXRlY3R1cmUsIHRoaXMgY2FuIHJlc3VsdCBpbiB3ZWlyZFxuICAgICAgLy8gICBiZWhhdmlvciAtIG5vIHNlbGVjdGVkIGNvbnZlcnNhdGlvbiBpbiB0aGUgbGVmdCBwYW5lLCBidXQgYSBjb252ZXJzYXRpb24gc2hvd1xuICAgICAgLy8gICBpbiB0aGUgcmlnaHQgcGFuZS5cbiAgICAgIGlmICghZXhpc3RpbmcuaXNBcmNoaXZlZCAmJiBkYXRhLmlzQXJjaGl2ZWQpIHtcbiAgICAgICAga2V5c1RvT21pdC5wdXNoKCdzZWxlY3RlZENvbnZlcnNhdGlvbklkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZXhpc3RpbmcuaXNCbG9ja2VkICYmIGRhdGEuaXNCbG9ja2VkKSB7XG4gICAgICAgIGtleXNUb09taXQucHVzaCgnY29udGFjdFNwb29maW5nUmV2aWV3Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9taXQoc3RhdGUsIGtleXNUb09taXQpLFxuICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZCxcbiAgICAgIHNob3dBcmNoaXZlZCxcbiAgICAgIGNvbnZlcnNhdGlvbkxvb2t1cDoge1xuICAgICAgICAuLi5jb252ZXJzYXRpb25Mb29rdXAsXG4gICAgICAgIFtpZF06IGRhdGEsXG4gICAgICB9LFxuICAgICAgLi4udXBkYXRlQ29udmVyc2F0aW9uTG9va3VwcyhkYXRhLCBleGlzdGluZywgc3RhdGUpLFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ09OVkVSU0FUSU9OX1JFTU9WRUQnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBpZCB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkxvb2t1cCB9ID0gc3RhdGU7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBnZXRPd24oY29udmVyc2F0aW9uTG9va3VwLCBpZCk7XG5cbiAgICAvLyBObyBuZWVkIHRvIG1ha2UgYSBjaGFuZ2UgaWYgd2UgZGlkbid0IGhhdmUgYSByZWNvcmQgb2YgdGhpcyBjb252ZXJzYXRpb24hXG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbnZlcnNhdGlvbkxvb2t1cDogb21pdChjb252ZXJzYXRpb25Mb29rdXAsIFtpZF0pLFxuICAgICAgLi4udXBkYXRlQ29udmVyc2F0aW9uTG9va3Vwcyh1bmRlZmluZWQsIGV4aXN0aW5nLCBzdGF0ZSksXG4gICAgfTtcbiAgfVxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDT05WRVJTQVRJT05fVU5MT0FERUQnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBpZCB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9IHN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb25baWRdO1xuICAgIGlmICghZXhpc3RpbmdDb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1lc3NhZ2VJZHMgfSA9IGV4aXN0aW5nQ29udmVyc2F0aW9uO1xuICAgIGNvbnN0IHNlbGVjdGVkQ29udmVyc2F0aW9uSWQgPVxuICAgICAgc3RhdGUuc2VsZWN0ZWRDb252ZXJzYXRpb25JZCAhPT0gaWRcbiAgICAgICAgPyBzdGF0ZS5zZWxlY3RlZENvbnZlcnNhdGlvbklkXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9taXQoc3RhdGUsICdjb250YWN0U3Bvb2ZpbmdSZXZpZXcnKSxcbiAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQsXG4gICAgICBzZWxlY3RlZENvbnZlcnNhdGlvblBhbmVsRGVwdGg6IDAsXG4gICAgICBtZXNzYWdlc0xvb2t1cDogb21pdChzdGF0ZS5tZXNzYWdlc0xvb2t1cCwgbWVzc2FnZUlkcyksXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiBvbWl0KHN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sIFtpZF0pLFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ09OVkVSU0FUSU9OU19SRU1PVkVfQUxMJykge1xuICAgIHJldHVybiBnZXRFbXB0eVN0YXRlKCk7XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ1JFQVRFX0dST1VQX1BFTkRJTkcnKSB7XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG4gICAgaWYgKGNvbXBvc2VyPy5zdGVwICE9PSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YSkge1xuICAgICAgLy8gVGhpcyBzaG91bGQgYmUgdW5saWtlbHksIGJ1dCBpdCBjYW4gaGFwcGVuIGlmIHNvbWVvbmUgY2xvc2VzIHRoZSBjb21wb3NlciB3aGlsZVxuICAgICAgLy8gICBhIGdyb3VwIGlzIGJlaW5nIGNyZWF0ZWQuXG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgIC4uLmNvbXBvc2VyLFxuICAgICAgICBoYXNFcnJvcjogZmFsc2UsXG4gICAgICAgIGlzQ3JlYXRpbmc6IHRydWUsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ1JFQVRFX0dST1VQX0ZVTEZJTExFRCcpIHtcbiAgICAvLyBXZSBkb24ndCBkbyBtdWNoIGhlcmUgYW5kIGluc3RlYWQgcmVseSBvbiBgc2hvd0NvbnZlcnNhdGlvbmAgdG8gZG8gbW9zdCBvZlxuICAgIC8vICAgdGhlIHdvcmsuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgaW52aXRlZFV1aWRzRm9yTmV3bHlDcmVhdGVkR3JvdXA6IGFjdGlvbi5wYXlsb2FkLmludml0ZWRVdWlkcyxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0NSRUFURV9HUk9VUF9SRUpFQ1RFRCcpIHtcbiAgICBjb25zdCB7IGNvbXBvc2VyIH0gPSBzdGF0ZTtcbiAgICBpZiAoY29tcG9zZXI/LnN0ZXAgIT09IENvbXBvc2VyU3RlcC5TZXRHcm91cE1ldGFkYXRhKSB7XG4gICAgICAvLyBUaGlzIHNob3VsZCBiZSB1bmxpa2VseSwgYnV0IGl0IGNhbiBoYXBwZW4gaWYgc29tZW9uZSBjbG9zZXMgdGhlIGNvbXBvc2VyIHdoaWxlXG4gICAgICAvLyAgIGEgZ3JvdXAgaXMgYmVpbmcgY3JlYXRlZC5cbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY29tcG9zZXI6IHtcbiAgICAgICAgLi4uY29tcG9zZXIsXG4gICAgICAgIGhhc0Vycm9yOiB0cnVlLFxuICAgICAgICBpc0NyZWF0aW5nOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfU0VMRUNURURfQ09OVkVSU0FUSU9OX1BBTkVMX0RFUFRIJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uUGFuZWxEZXB0aDogYWN0aW9uLnBheWxvYWQucGFuZWxEZXB0aCxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ01FU1NBR0VfU0VMRUNURUQnKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlSWQsIGNvbnZlcnNhdGlvbklkIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGlmIChzdGF0ZS5zZWxlY3RlZENvbnZlcnNhdGlvbklkICE9PSBjb252ZXJzYXRpb25JZCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkTWVzc2FnZTogbWVzc2FnZUlkLFxuICAgICAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcjogc3RhdGUuc2VsZWN0ZWRNZXNzYWdlQ291bnRlciArIDEsXG4gICAgfTtcbiAgfVxuICBpZiAoYWN0aW9uLnR5cGUgPT09IENPTlZFUlNBVElPTl9TVE9QUEVEX0JZX01JU1NJTkdfVkVSSUZJQ0FUSU9OKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgdW50cnVzdGVkVXVpZHMgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgeyB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24gfSA9IHN0YXRlO1xuICAgIGNvbnN0IGV4aXN0aW5nUGVuZGluZ1N0YXRlID0gZ2V0T3duKFxuICAgICAgdmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uLFxuICAgICAgY29udmVyc2F0aW9uSWRcbiAgICApO1xuXG4gICAgaWYgKFxuICAgICAgIWV4aXN0aW5nUGVuZGluZ1N0YXRlIHx8XG4gICAgICBleGlzdGluZ1BlbmRpbmdTdGF0ZS50eXBlID09PVxuICAgICAgICBDb252ZXJzYXRpb25WZXJpZmljYXRpb25TdGF0ZS5WZXJpZmljYXRpb25DYW5jZWxsZWRcbiAgICApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgICAuLi52ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgdHlwZTogQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuUGVuZGluZ1ZlcmlmaWNhdGlvbiBhcyBjb25zdCxcbiAgICAgICAgICAgIHV1aWRzTmVlZGluZ1ZlcmlmaWNhdGlvbjogdW50cnVzdGVkVXVpZHMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdXVpZHNOZWVkaW5nVmVyaWZpY2F0aW9uOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBBcnJheS5mcm9tKFxuICAgICAgbmV3IFNldChbXG4gICAgICAgIC4uLmV4aXN0aW5nUGVuZGluZ1N0YXRlLnV1aWRzTmVlZGluZ1ZlcmlmaWNhdGlvbixcbiAgICAgICAgLi4udW50cnVzdGVkVXVpZHMsXG4gICAgICBdKVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICB2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4udmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uLFxuICAgICAgICBbY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgdHlwZTogQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuUGVuZGluZ1ZlcmlmaWNhdGlvbiBhcyBjb25zdCxcbiAgICAgICAgICB1dWlkc05lZWRpbmdWZXJpZmljYXRpb24sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnTUVTU0FHRV9DSEFOR0VEJykge1xuICAgIGNvbnN0IHsgaWQsIGNvbnZlcnNhdGlvbklkLCBkYXRhIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9IHN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdO1xuXG4gICAgLy8gV2UgZG9uJ3Qga2VlcCB0cmFjayBvZiBtZXNzYWdlcyB1bmxlc3MgdGhlaXIgY29udmVyc2F0aW9uIGlzIGxvYWRlZC4uLlxuICAgIGlmICghZXhpc3RpbmdDb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHdlJ3ZlIGFscmVhZHkgbG9hZGVkIHRoYXQgbWVzc2FnZSBvbmNlXG4gICAgY29uc3QgZXhpc3RpbmdNZXNzYWdlID0gZ2V0T3duKHN0YXRlLm1lc3NhZ2VzTG9va3VwLCBpZCk7XG4gICAgaWYgKCFleGlzdGluZ01lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25BdHRycyA9IHN0YXRlLmNvbnZlcnNhdGlvbkxvb2t1cFtjb252ZXJzYXRpb25JZF07XG4gICAgY29uc3QgaXNHcm91cFN0b3J5UmVwbHkgPSBpc0dyb3VwKGNvbnZlcnNhdGlvbkF0dHJzKSAmJiBkYXRhLnN0b3J5SWQ7XG4gICAgaWYgKGlzR3JvdXBTdG9yeVJlcGx5KSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgdG9JbmNyZW1lbnQgPSBkYXRhLnJlYWN0aW9ucz8ubGVuZ3RoID8gMSA6IDA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLnN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbixcbiAgICAgICAgICBtZXNzYWdlQ2hhbmdlQ291bnRlcjpcbiAgICAgICAgICAgIChleGlzdGluZ0NvbnZlcnNhdGlvbi5tZXNzYWdlQ2hhbmdlQ291bnRlciB8fCAwKSArIHRvSW5jcmVtZW50LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VzTG9va3VwOiB7XG4gICAgICAgIC4uLnN0YXRlLm1lc3NhZ2VzTG9va3VwLFxuICAgICAgICBbaWRdOiB7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBkaXNwbGF5TGltaXQ6IGV4aXN0aW5nTWVzc2FnZS5kaXNwbGF5TGltaXQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnTUVTU0FHRV9FWFBBTkRFRCcpIHtcbiAgICBjb25zdCB7IGlkLCBkaXNwbGF5TGltaXQgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgZXhpc3RpbmdNZXNzYWdlID0gc3RhdGUubWVzc2FnZXNMb29rdXBbaWRdO1xuICAgIGlmICghZXhpc3RpbmdNZXNzYWdlKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbWVzc2FnZXNMb29rdXA6IHtcbiAgICAgICAgLi4uc3RhdGUubWVzc2FnZXNMb29rdXAsXG4gICAgICAgIFtpZF06IHtcbiAgICAgICAgICAuLi5leGlzdGluZ01lc3NhZ2UsXG4gICAgICAgICAgZGlzcGxheUxpbWl0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ01FU1NBR0VTX1JFU0VUJykge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgbWVzc2FnZXMsXG4gICAgICBtZXRyaWNzLFxuICAgICAgc2Nyb2xsVG9NZXNzYWdlSWQsXG4gICAgICB1bmJvdW5kZWRGZXRjaCxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgeyBtZXNzYWdlc0J5Q29udmVyc2F0aW9uLCBtZXNzYWdlc0xvb2t1cCB9ID0gc3RhdGU7XG5cbiAgICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9IG1lc3NhZ2VzQnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdO1xuXG4gICAgY29uc3QgbG9va3VwID0gZnJvbVBhaXJzKG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+IFttZXNzYWdlLmlkLCBtZXNzYWdlXSkpO1xuICAgIGNvbnN0IHNvcnRlZCA9IG9yZGVyQnkoXG4gICAgICB2YWx1ZXMobG9va3VwKSxcbiAgICAgIFsncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCddLFxuICAgICAgWydBU0MnLCAnQVNDJ11cbiAgICApO1xuXG4gICAgbGV0IHsgbmV3ZXN0LCBvbGRlc3QgfSA9IG1ldHJpY3M7XG5cbiAgICAvLyBJZiBvdXIgbWV0cmljcyBhcmUgYSBsaXR0bGUgb3V0IG9mIGRhdGUsIHdlJ2xsIGZpeCB0aGVtIHVwXG4gICAgaWYgKHNvcnRlZC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IHNvcnRlZFswXTtcbiAgICAgIGlmIChmaXJzdCAmJiAoIW9sZGVzdCB8fCBmaXJzdC5yZWNlaXZlZF9hdCA8PSBvbGRlc3QucmVjZWl2ZWRfYXQpKSB7XG4gICAgICAgIG9sZGVzdCA9IHBpY2soZmlyc3QsIFsnaWQnLCAncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCddKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGFzdCA9IHNvcnRlZFtzb3J0ZWQubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoXG4gICAgICAgIGxhc3QgJiZcbiAgICAgICAgKCFuZXdlc3QgfHwgdW5ib3VuZGVkRmV0Y2ggfHwgbGFzdC5yZWNlaXZlZF9hdCA+PSBuZXdlc3QucmVjZWl2ZWRfYXQpXG4gICAgICApIHtcbiAgICAgICAgbmV3ZXN0ID0gcGljayhsYXN0LCBbJ2lkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZUlkcyA9IHNvcnRlZC5tYXAobWVzc2FnZSA9PiBtZXNzYWdlLmlkKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIC4uLihzdGF0ZS5zZWxlY3RlZENvbnZlcnNhdGlvbklkID09PSBjb252ZXJzYXRpb25JZFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHNlbGVjdGVkTWVzc2FnZTogc2Nyb2xsVG9NZXNzYWdlSWQsXG4gICAgICAgICAgICBzZWxlY3RlZE1lc3NhZ2VDb3VudGVyOiBzdGF0ZS5zZWxlY3RlZE1lc3NhZ2VDb3VudGVyICsgMSxcbiAgICAgICAgICB9XG4gICAgICAgIDoge30pLFxuICAgICAgbWVzc2FnZXNMb29rdXA6IHtcbiAgICAgICAgLi4ubWVzc2FnZXNMb29rdXAsXG4gICAgICAgIC4uLmxvb2t1cCxcbiAgICAgIH0sXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICBtZXNzYWdlQ2hhbmdlQ291bnRlcjogMCxcbiAgICAgICAgICBzY3JvbGxUb01lc3NhZ2VJZCxcbiAgICAgICAgICBzY3JvbGxUb01lc3NhZ2VDb3VudGVyOiBleGlzdGluZ0NvbnZlcnNhdGlvblxuICAgICAgICAgICAgPyBleGlzdGluZ0NvbnZlcnNhdGlvbi5zY3JvbGxUb01lc3NhZ2VDb3VudGVyICsgMVxuICAgICAgICAgICAgOiAwLFxuICAgICAgICAgIG1lc3NhZ2VJZHMsXG4gICAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgICAgLi4ubWV0cmljcyxcbiAgICAgICAgICAgIG5ld2VzdCxcbiAgICAgICAgICAgIG9sZGVzdCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9NRVNTQUdFX0xPQURJTkdfU1RBVEUnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgbWVzc2FnZUxvYWRpbmdTdGF0ZSB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IHsgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbiB9ID0gc3RhdGU7XG4gICAgY29uc3QgZXhpc3RpbmdDb252ZXJzYXRpb24gPSBtZXNzYWdlc0J5Q29udmVyc2F0aW9uW2NvbnZlcnNhdGlvbklkXTtcblxuICAgIGlmICghZXhpc3RpbmdDb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbixcbiAgICAgICAgICBtZXNzYWdlTG9hZGluZ1N0YXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9ORUFSX0JPVFRPTScpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkLCBpc05lYXJCb3R0b20gfSA9IHBheWxvYWQ7XG5cbiAgICBjb25zdCB7IG1lc3NhZ2VzQnlDb252ZXJzYXRpb24gfSA9IHN0YXRlO1xuICAgIGNvbnN0IGV4aXN0aW5nQ29udmVyc2F0aW9uID0gbWVzc2FnZXNCeUNvbnZlcnNhdGlvbltjb252ZXJzYXRpb25JZF07XG5cbiAgICBpZiAoXG4gICAgICAhZXhpc3RpbmdDb252ZXJzYXRpb24gfHxcbiAgICAgIGV4aXN0aW5nQ29udmVyc2F0aW9uLmlzTmVhckJvdHRvbSA9PT0gaXNOZWFyQm90dG9tXG4gICAgKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5tZXNzYWdlc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgLi4uZXhpc3RpbmdDb252ZXJzYXRpb24sXG4gICAgICAgICAgaXNOZWFyQm90dG9tLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NDUk9MTF9UT19NRVNTQUdFJykge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQsIG1lc3NhZ2VJZCB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IHsgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbiwgbWVzc2FnZXNMb29rdXAgfSA9IHN0YXRlO1xuICAgIGNvbnN0IGV4aXN0aW5nQ29udmVyc2F0aW9uID0gbWVzc2FnZXNCeUNvbnZlcnNhdGlvbltjb252ZXJzYXRpb25JZF07XG5cbiAgICBpZiAoIWV4aXN0aW5nQ29udmVyc2F0aW9uKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIGlmICghbWVzc2FnZXNMb29rdXBbbWVzc2FnZUlkXSkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICBpZiAoIWV4aXN0aW5nQ29udmVyc2F0aW9uLm1lc3NhZ2VJZHMuaW5jbHVkZXMobWVzc2FnZUlkKSkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkTWVzc2FnZTogbWVzc2FnZUlkLFxuICAgICAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcjogc3RhdGUuc2VsZWN0ZWRNZXNzYWdlQ291bnRlciArIDEsXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbixcbiAgICAgICAgICBtZXNzYWdlTG9hZGluZ1N0YXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgc2Nyb2xsVG9NZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICBzY3JvbGxUb01lc3NhZ2VDb3VudGVyOlxuICAgICAgICAgICAgZXhpc3RpbmdDb252ZXJzYXRpb24uc2Nyb2xsVG9NZXNzYWdlQ291bnRlciArIDEsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnTUVTU0FHRV9ERUxFVEVEJykge1xuICAgIGNvbnN0IHsgaWQsIGNvbnZlcnNhdGlvbklkIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCB7IG1lc3NhZ2VzQnlDb252ZXJzYXRpb24sIG1lc3NhZ2VzTG9va3VwIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGV4aXN0aW5nQ29udmVyc2F0aW9uID0gbWVzc2FnZXNCeUNvbnZlcnNhdGlvbltjb252ZXJzYXRpb25JZF07XG4gICAgaWYgKCFleGlzdGluZ0NvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIC8vIEFzc3VtaW5nIHRoYXQgd2UgYWx3YXlzIGhhdmUgY29udGlndW91cyBncm91cHMgb2YgbWVzc2FnZXMgaW4gbWVtb3J5LCB0aGUgcmVtb3ZhbFxuICAgIC8vICAgb2Ygb25lIG1lc3NhZ2UgYXQgb25lIGVuZCBvZiBvdXIgbWVzc2FnZSBzZXQgYmUgcmVwbGFjZWQgd2l0aCB0aGUgbWVzc2FnZSByaWdodFxuICAgIC8vICAgbmV4dCB0byBpdC5cbiAgICBjb25zdCBvbGRJZHMgPSBleGlzdGluZ0NvbnZlcnNhdGlvbi5tZXNzYWdlSWRzO1xuICAgIGxldCB7IG5ld2VzdCwgb2xkZXN0IH0gPSBleGlzdGluZ0NvbnZlcnNhdGlvbi5tZXRyaWNzO1xuXG4gICAgaWYgKG9sZElkcy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBmaXJzdElkID0gb2xkSWRzWzBdO1xuICAgICAgY29uc3QgbGFzdElkID0gb2xkSWRzW29sZElkcy5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKG9sZGVzdCAmJiBvbGRlc3QuaWQgPT09IGZpcnN0SWQgJiYgZmlyc3RJZCA9PT0gaWQpIHtcbiAgICAgICAgY29uc3Qgc2Vjb25kID0gbWVzc2FnZXNMb29rdXBbb2xkSWRzWzFdXTtcbiAgICAgICAgb2xkZXN0ID0gc2Vjb25kXG4gICAgICAgICAgPyBwaWNrKHNlY29uZCwgWydpZCcsICdyZWNlaXZlZF9hdCcsICdzZW50X2F0J10pXG4gICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAobmV3ZXN0ICYmIG5ld2VzdC5pZCA9PT0gbGFzdElkICYmIGxhc3RJZCA9PT0gaWQpIHtcbiAgICAgICAgY29uc3QgcGVudWx0aW1hdGUgPSBtZXNzYWdlc0xvb2t1cFtvbGRJZHNbb2xkSWRzLmxlbmd0aCAtIDJdXTtcbiAgICAgICAgbmV3ZXN0ID0gcGVudWx0aW1hdGVcbiAgICAgICAgICA/IHBpY2socGVudWx0aW1hdGUsIFsnaWQnLCAncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCddKVxuICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92aW5nIGl0IGZyb20gb3VyIGNhY2hlc1xuICAgIGNvbnN0IG1lc3NhZ2VJZHMgPSB3aXRob3V0KGV4aXN0aW5nQ29udmVyc2F0aW9uLm1lc3NhZ2VJZHMsIGlkKTtcblxuICAgIGxldCBtZXRyaWNzO1xuICAgIGlmIChtZXNzYWdlSWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbWV0cmljcyA9IHtcbiAgICAgICAgdG90YWxVbnNlZW46IDAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXRyaWNzID0ge1xuICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbi5tZXRyaWNzLFxuICAgICAgICBvbGRlc3QsXG4gICAgICAgIG5ld2VzdCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbWVzc2FnZXNMb29rdXA6IG9taXQobWVzc2FnZXNMb29rdXAsIGlkKSxcbiAgICAgIG1lc3NhZ2VzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIC4uLmV4aXN0aW5nQ29udmVyc2F0aW9uLFxuICAgICAgICAgIG1lc3NhZ2VJZHMsXG4gICAgICAgICAgbWV0cmljcyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1JFUEFJUl9ORVdFU1RfTUVTU0FHRScpIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCB7IG1lc3NhZ2VzQnlDb252ZXJzYXRpb24sIG1lc3NhZ2VzTG9va3VwIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGV4aXN0aW5nQ29udmVyc2F0aW9uID0gZ2V0T3duKG1lc3NhZ2VzQnlDb252ZXJzYXRpb24sIGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoIWV4aXN0aW5nQ29udmVyc2F0aW9uKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgeyBtZXNzYWdlSWRzIH0gPSBleGlzdGluZ0NvbnZlcnNhdGlvbjtcbiAgICBjb25zdCBsYXN0SWQgPVxuICAgICAgbWVzc2FnZUlkcyAmJiBtZXNzYWdlSWRzLmxlbmd0aFxuICAgICAgICA/IG1lc3NhZ2VJZHNbbWVzc2FnZUlkcy5sZW5ndGggLSAxXVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBsYXN0ID0gbGFzdElkID8gZ2V0T3duKG1lc3NhZ2VzTG9va3VwLCBsYXN0SWQpIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IG5ld2VzdCA9IGxhc3RcbiAgICAgID8gcGljayhsYXN0LCBbJ2lkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5tZXNzYWdlc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgLi4uZXhpc3RpbmdDb252ZXJzYXRpb24sXG4gICAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgICAgLi4uZXhpc3RpbmdDb252ZXJzYXRpb24ubWV0cmljcyxcbiAgICAgICAgICAgIG5ld2VzdCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnUkVQQUlSX09MREVTVF9NRVNTQUdFJykge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHsgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbiwgbWVzc2FnZXNMb29rdXAgfSA9IHN0YXRlO1xuXG4gICAgY29uc3QgZXhpc3RpbmdDb252ZXJzYXRpb24gPSBnZXRPd24obWVzc2FnZXNCeUNvbnZlcnNhdGlvbiwgY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghZXhpc3RpbmdDb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1lc3NhZ2VJZHMgfSA9IGV4aXN0aW5nQ29udmVyc2F0aW9uO1xuICAgIGNvbnN0IGZpcnN0SWQgPSBtZXNzYWdlSWRzICYmIG1lc3NhZ2VJZHMubGVuZ3RoID8gbWVzc2FnZUlkc1swXSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmaXJzdCA9IGZpcnN0SWQgPyBnZXRPd24obWVzc2FnZXNMb29rdXAsIGZpcnN0SWQpIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IG9sZGVzdCA9IGZpcnN0XG4gICAgICA/IHBpY2soZmlyc3QsIFsnaWQnLCAncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCddKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLm1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbixcbiAgICAgICAgICBtZXRyaWNzOiB7XG4gICAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbi5tZXRyaWNzLFxuICAgICAgICAgICAgb2xkZXN0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdSRVZJRVdfR1JPVVBfTUVNQkVSX05BTUVfQ09MTElTSU9OJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbnRhY3RTcG9vZmluZ1Jldmlldzoge1xuICAgICAgICB0eXBlOiBDb250YWN0U3Bvb2ZpbmdUeXBlLk11bHRpcGxlR3JvdXBNZW1iZXJzV2l0aFNhbWVUaXRsZSxcbiAgICAgICAgLi4uYWN0aW9uLnBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdSRVZJRVdfTUVTU0FHRV9SRVFVRVNUX05BTUVfQ09MTElTSU9OJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbnRhY3RTcG9vZmluZ1Jldmlldzoge1xuICAgICAgICB0eXBlOiBDb250YWN0U3Bvb2ZpbmdUeXBlLkRpcmVjdENvbnZlcnNhdGlvbldpdGhTYW1lVGl0bGUsXG4gICAgICAgIC4uLmFjdGlvbi5wYXlsb2FkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnTUVTU0FHRVNfQURERUQnKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgaXNBY3RpdmUsIGlzSnVzdFNlbnQsIGlzTmV3TWVzc2FnZSwgbWVzc2FnZXMgfSA9XG4gICAgICBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCB7IG1lc3NhZ2VzQnlDb252ZXJzYXRpb24sIG1lc3NhZ2VzTG9va3VwIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGV4aXN0aW5nQ29udmVyc2F0aW9uID0gbWVzc2FnZXNCeUNvbnZlcnNhdGlvbltjb252ZXJzYXRpb25JZF07XG4gICAgaWYgKCFleGlzdGluZ0NvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGxldCB7IG5ld2VzdCwgb2xkZXN0LCBvbGRlc3RVbnNlZW4sIHRvdGFsVW5zZWVuIH0gPVxuICAgICAgZXhpc3RpbmdDb252ZXJzYXRpb24ubWV0cmljcztcblxuICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgbG9va3VwID0gZnJvbVBhaXJzKFxuICAgICAgZXhpc3RpbmdDb252ZXJzYXRpb24ubWVzc2FnZUlkcy5tYXAoaWQgPT4gW2lkLCBtZXNzYWdlc0xvb2t1cFtpZF1dKVxuICAgICk7XG4gICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGxvb2t1cFttZXNzYWdlLmlkXSA9IG1lc3NhZ2U7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3J0ZWQgPSBvcmRlckJ5KFxuICAgICAgdmFsdWVzKGxvb2t1cCksXG4gICAgICBbJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSxcbiAgICAgIFsnQVNDJywgJ0FTQyddXG4gICAgKTtcbiAgICBjb25zdCBtZXNzYWdlSWRzID0gc29ydGVkLm1hcChtZXNzYWdlID0+IG1lc3NhZ2UuaWQpO1xuXG4gICAgY29uc3QgZmlyc3QgPSBzb3J0ZWRbMF07XG4gICAgY29uc3QgbGFzdCA9IHNvcnRlZFtzb3J0ZWQubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAoIW5ld2VzdCkge1xuICAgICAgbmV3ZXN0ID0gcGljayhmaXJzdCwgWydpZCcsICdyZWNlaXZlZF9hdCcsICdzZW50X2F0J10pO1xuICAgIH1cbiAgICBpZiAoIW9sZGVzdCkge1xuICAgICAgb2xkZXN0ID0gcGljayhsYXN0LCBbJ2lkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RpbmdUb3RhbCA9IGV4aXN0aW5nQ29udmVyc2F0aW9uLm1lc3NhZ2VJZHMubGVuZ3RoO1xuICAgIGlmIChpc05ld01lc3NhZ2UgJiYgZXhpc3RpbmdUb3RhbCA+IDApIHtcbiAgICAgIGNvbnN0IGxhc3RNZXNzYWdlSWQgPSBleGlzdGluZ0NvbnZlcnNhdGlvbi5tZXNzYWdlSWRzW2V4aXN0aW5nVG90YWwgLSAxXTtcblxuICAgICAgLy8gSWYgb3VyIG1lc3NhZ2VzIGluIG1lbW9yeSBkb24ndCBpbmNsdWRlIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlcywgdGhlbiB3ZVxuICAgICAgLy8gICB3b24ndCBhZGQgbmV3IG1lc3NhZ2VzIHRvIG91ciBtZXNzYWdlIGxpc3QuXG4gICAgICBjb25zdCBoYXZlTGF0ZXN0ID0gbmV3ZXN0ICYmIG5ld2VzdC5pZCA9PT0gbGFzdE1lc3NhZ2VJZDtcbiAgICAgIGlmICghaGF2ZUxhdGVzdCkge1xuICAgICAgICBpZiAoaXNKdXN0U2VudCkge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgJ3JlZHVjZXIvTUVTU0FHRVNfQURERUQ6IGlzSnVzdFNlbnQgaXMgdHJ1ZSwgYnV0IGhhdmVMYXRlc3QgaXMgZmFsc2UnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgb2xkZXN0IGFuZCBuZXdlc3QgaWYgd2UgcmVjZWl2ZSBvbGRlci9uZXdlclxuICAgIC8vIG1lc3NhZ2VzIChvciBkdXBsaWNhdGVkIHRpbWVzdGFtcHMhKVxuICAgIGlmIChmaXJzdCAmJiBvbGRlc3QgJiYgZmlyc3QucmVjZWl2ZWRfYXQgPD0gb2xkZXN0LnJlY2VpdmVkX2F0KSB7XG4gICAgICBvbGRlc3QgPSBwaWNrKGZpcnN0LCBbJ2lkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSk7XG4gICAgfVxuICAgIGlmIChsYXN0ICYmIG5ld2VzdCAmJiBsYXN0LnJlY2VpdmVkX2F0ID49IG5ld2VzdC5yZWNlaXZlZF9hdCkge1xuICAgICAgbmV3ZXN0ID0gcGljayhsYXN0LCBbJ2lkJywgJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnXSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3SWRzID0gbWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4gbWVzc2FnZS5pZCk7XG4gICAgY29uc3QgbmV3TWVzc2FnZUlkcyA9IGRpZmZlcmVuY2UobmV3SWRzLCBleGlzdGluZ0NvbnZlcnNhdGlvbi5tZXNzYWdlSWRzKTtcbiAgICBjb25zdCB7IGlzTmVhckJvdHRvbSB9ID0gZXhpc3RpbmdDb252ZXJzYXRpb247XG5cbiAgICBpZiAoKCFpc05lYXJCb3R0b20gfHwgIWlzQWN0aXZlKSAmJiAhb2xkZXN0VW5zZWVuKSB7XG4gICAgICBjb25zdCBvbGRlc3RJZCA9IG5ld01lc3NhZ2VJZHMuZmluZChtZXNzYWdlSWQgPT4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gbG9va3VwW21lc3NhZ2VJZF07XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2UgJiYgaXNNZXNzYWdlVW5yZWFkKG1lc3NhZ2UpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChvbGRlc3RJZCkge1xuICAgICAgICBvbGRlc3RVbnNlZW4gPSBwaWNrKGxvb2t1cFtvbGRlc3RJZF0sIFtcbiAgICAgICAgICAnaWQnLFxuICAgICAgICAgICdyZWNlaXZlZF9hdCcsXG4gICAgICAgICAgJ3NlbnRfYXQnLFxuICAgICAgICBdKSBhcyBNZXNzYWdlUG9pbnRlclR5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIG5ldyBpbmNvbWluZyBtZXNzYWdlLCB3ZSdsbCBpbmNyZW1lbnQgb3VyIHRvdGFsVW5zZWVuIGNvdW50XG4gICAgaWYgKGlzTmV3TWVzc2FnZSAmJiAhaXNKdXN0U2VudCAmJiBvbGRlc3RVbnNlZW4pIHtcbiAgICAgIGNvbnN0IG5ld1VucmVhZDogbnVtYmVyID0gbmV3TWVzc2FnZUlkcy5yZWR1Y2UoKHN1bSwgbWVzc2FnZUlkKSA9PiB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBsb29rdXBbbWVzc2FnZUlkXTtcblxuICAgICAgICByZXR1cm4gc3VtICsgKG1lc3NhZ2UgJiYgaXNNZXNzYWdlVW5yZWFkKG1lc3NhZ2UpID8gMSA6IDApO1xuICAgICAgfSwgMCk7XG4gICAgICB0b3RhbFVuc2VlbiA9ICh0b3RhbFVuc2VlbiB8fCAwKSArIG5ld1VucmVhZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtZXNzYWdlc0xvb2t1cDoge1xuICAgICAgICAuLi5tZXNzYWdlc0xvb2t1cCxcbiAgICAgICAgLi4ubG9va3VwLFxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4ubWVzc2FnZXNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIC4uLmV4aXN0aW5nQ29udmVyc2F0aW9uLFxuICAgICAgICAgIG1lc3NhZ2VJZHMsXG4gICAgICAgICAgbWVzc2FnZUxvYWRpbmdTdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHNjcm9sbFRvTWVzc2FnZUlkOiBpc0p1c3RTZW50ID8gbGFzdC5pZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtZXRyaWNzOiB7XG4gICAgICAgICAgICAuLi5leGlzdGluZ0NvbnZlcnNhdGlvbi5tZXRyaWNzLFxuICAgICAgICAgICAgbmV3ZXN0LFxuICAgICAgICAgICAgb2xkZXN0LFxuICAgICAgICAgICAgdG90YWxVbnNlZW4sXG4gICAgICAgICAgICBvbGRlc3RVbnNlZW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDTEVBUl9TRUxFQ1RFRF9NRVNTQUdFJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkTWVzc2FnZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnQ0xFQVJfVU5SRUFEX01FVFJJQ1MnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9IHN0YXRlLm1lc3NhZ2VzQnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdO1xuXG4gICAgaWYgKCFleGlzdGluZ0NvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIG1lc3NhZ2VzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uc3RhdGUubWVzc2FnZXNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIC4uLmV4aXN0aW5nQ29udmVyc2F0aW9uLFxuICAgICAgICAgIG1ldHJpY3M6IHtcbiAgICAgICAgICAgIC4uLmV4aXN0aW5nQ29udmVyc2F0aW9uLm1ldHJpY3MsXG4gICAgICAgICAgICBvbGRlc3RVbnNlZW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRvdGFsVW5zZWVuOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRUxFQ1RFRF9DT05WRVJTQVRJT05fQ0hBTkdFRCkge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgaWQsIG1lc3NhZ2VJZCwgc3dpdGNoVG9Bc3NvY2lhdGVkVmlldyB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcbiAgICAgIC4uLm9taXQoc3RhdGUsICdjb250YWN0U3Bvb2ZpbmdSZXZpZXcnKSxcbiAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQ6IGlkLFxuICAgICAgc2VsZWN0ZWRNZXNzYWdlOiBtZXNzYWdlSWQsXG4gICAgfTtcblxuICAgIGlmIChzd2l0Y2hUb0Fzc29jaWF0ZWRWaWV3ICYmIGlkKSB7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRPd24oc3RhdGUuY29udmVyc2F0aW9uTG9va3VwLCBpZCk7XG4gICAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ub21pdChuZXh0U3RhdGUsICdjb21wb3NlcicpLFxuICAgICAgICBzaG93QXJjaGl2ZWQ6IEJvb2xlYW4oY29udmVyc2F0aW9uLmlzQXJjaGl2ZWQpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NIT1dfSU5CT1gnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9taXQoc3RhdGUsICdjb21wb3NlcicpLFxuICAgICAgc2hvd0FyY2hpdmVkOiBmYWxzZSxcbiAgICB9O1xuICB9XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NIT1dfQVJDSElWRURfQ09OVkVSU0FUSU9OUycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub21pdChzdGF0ZSwgJ2NvbXBvc2VyJyksXG4gICAgICBzaG93QXJjaGl2ZWQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9DT05WRVJTQVRJT05fSEVBREVSX1RJVExFJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uVGl0bGU6IGFjdGlvbi5wYXlsb2FkLnRpdGxlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfUkVDRU5UX01FRElBX0lURU1TJykge1xuICAgIGNvbnN0IHsgaWQsIHJlY2VudE1lZGlhSXRlbXMgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uTG9va3VwIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbkRhdGEgPSBjb252ZXJzYXRpb25Mb29rdXBbaWRdO1xuXG4gICAgaWYgKCFjb252ZXJzYXRpb25EYXRhKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIC4uLmNvbnZlcnNhdGlvbkRhdGEsXG4gICAgICByZWNlbnRNZWRpYUl0ZW1zLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjb252ZXJzYXRpb25Mb29rdXA6IHtcbiAgICAgICAgLi4uY29udmVyc2F0aW9uTG9va3VwLFxuICAgICAgICBbaWRdOiBkYXRhLFxuICAgICAgfSxcbiAgICAgIC4uLnVwZGF0ZUNvbnZlcnNhdGlvbkxvb2t1cHMoZGF0YSwgdW5kZWZpbmVkLCBzdGF0ZSksXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NUQVJUX0NPTVBPU0lORycpIHtcbiAgICBpZiAoc3RhdGUuY29tcG9zZXI/LnN0ZXAgPT09IENvbXBvc2VyU3RlcC5TdGFydERpcmVjdENvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNob3dBcmNoaXZlZDogZmFsc2UsXG4gICAgICBjb21wb3Nlcjoge1xuICAgICAgICBzdGVwOiBDb21wb3NlclN0ZXAuU3RhcnREaXJlY3RDb252ZXJzYXRpb24sXG4gICAgICAgIHNlYXJjaFRlcm06ICcnLFxuICAgICAgICB1dWlkRmV0Y2hTdGF0ZToge30sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTSE9XX0NIT09TRV9HUk9VUF9NRU1CRVJTJykge1xuICAgIGxldCBzZWxlY3RlZENvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPjtcbiAgICBsZXQgcmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlOiBPbmVUaW1lTW9kYWxTdGF0ZTtcbiAgICBsZXQgbWF4aW11bUdyb3VwU2l6ZU1vZGFsU3RhdGU6IE9uZVRpbWVNb2RhbFN0YXRlO1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZztcbiAgICBsZXQgZ3JvdXBBdmF0YXI6IHVuZGVmaW5lZCB8IFVpbnQ4QXJyYXk7XG4gICAgbGV0IGdyb3VwRXhwaXJlVGltZXI6IG51bWJlcjtcbiAgICBsZXQgdXNlckF2YXRhckRhdGEgPSBnZXREZWZhdWx0QXZhdGFycyh0cnVlKTtcblxuICAgIHN3aXRjaCAoc3RhdGUuY29tcG9zZXI/LnN0ZXApIHtcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVyczpcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgKHtcbiAgICAgICAgICBzZWxlY3RlZENvbnZlcnNhdGlvbklkcyxcbiAgICAgICAgICByZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsU3RhdGUsXG4gICAgICAgICAgbWF4aW11bUdyb3VwU2l6ZU1vZGFsU3RhdGUsXG4gICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgIGdyb3VwQXZhdGFyLFxuICAgICAgICAgIGdyb3VwRXhwaXJlVGltZXIsXG4gICAgICAgICAgdXNlckF2YXRhckRhdGEsXG4gICAgICAgIH0gPSBzdGF0ZS5jb21wb3Nlcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZHMgPSBbXTtcbiAgICAgICAgcmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlID0gT25lVGltZU1vZGFsU3RhdGUuTmV2ZXJTaG93bjtcbiAgICAgICAgbWF4aW11bUdyb3VwU2l6ZU1vZGFsU3RhdGUgPSBPbmVUaW1lTW9kYWxTdGF0ZS5OZXZlclNob3duO1xuICAgICAgICBncm91cE5hbWUgPSAnJztcbiAgICAgICAgZ3JvdXBFeHBpcmVUaW1lciA9IHVuaXZlcnNhbEV4cGlyZVRpbWVyLmdldCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzaG93QXJjaGl2ZWQ6IGZhbHNlLFxuICAgICAgY29tcG9zZXI6IHtcbiAgICAgICAgc3RlcDogQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVycyxcbiAgICAgICAgc2VhcmNoVGVybTogJycsXG4gICAgICAgIHV1aWRGZXRjaFN0YXRlOiB7fSxcbiAgICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZHMsXG4gICAgICAgIHJlY29tbWVuZGVkR3JvdXBTaXplTW9kYWxTdGF0ZSxcbiAgICAgICAgbWF4aW11bUdyb3VwU2l6ZU1vZGFsU3RhdGUsXG4gICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgZ3JvdXBBdmF0YXIsXG4gICAgICAgIGdyb3VwRXhwaXJlVGltZXIsXG4gICAgICAgIHVzZXJBdmF0YXJEYXRhLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU1RBUlRfU0VUVElOR19HUk9VUF9NRVRBREFUQScpIHtcbiAgICBjb25zdCB7IGNvbXBvc2VyIH0gPSBzdGF0ZTtcblxuICAgIHN3aXRjaCAoY29tcG9zZXI/LnN0ZXApIHtcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVyczpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBzaG93QXJjaGl2ZWQ6IGZhbHNlLFxuICAgICAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgICAgICBzdGVwOiBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YSxcbiAgICAgICAgICAgIGlzRWRpdGluZ0F2YXRhcjogZmFsc2UsXG4gICAgICAgICAgICBpc0NyZWF0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGhhc0Vycm9yOiBmYWxzZSxcbiAgICAgICAgICAgIC4uLnBpY2soY29tcG9zZXIsIFtcbiAgICAgICAgICAgICAgJ2dyb3VwQXZhdGFyJyxcbiAgICAgICAgICAgICAgJ2dyb3VwTmFtZScsXG4gICAgICAgICAgICAgICdncm91cEV4cGlyZVRpbWVyJyxcbiAgICAgICAgICAgICAgJ21heGltdW1Hcm91cFNpemVNb2RhbFN0YXRlJyxcbiAgICAgICAgICAgICAgJ3JlY29tbWVuZGVkR3JvdXBTaXplTW9kYWxTdGF0ZScsXG4gICAgICAgICAgICAgICdzZWxlY3RlZENvbnZlcnNhdGlvbklkcycsXG4gICAgICAgICAgICAgICd1c2VyQXZhdGFyRGF0YScsXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdDYW5ub3QgdHJhbnNpdGlvbiB0byBzZXR0aW5nIGdyb3VwIG1ldGFkYXRhIGZyb20gdGhpcyBzdGF0ZSdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9DT01QT1NFX0dST1VQX0FWQVRBUicpIHtcbiAgICBjb25zdCB7IGNvbXBvc2VyIH0gPSBzdGF0ZTtcblxuICAgIHN3aXRjaCAoY29tcG9zZXI/LnN0ZXApIHtcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVyczpcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGE6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgY29tcG9zZXI6IHtcbiAgICAgICAgICAgIC4uLmNvbXBvc2VyLFxuICAgICAgICAgICAgZ3JvdXBBdmF0YXI6IGFjdGlvbi5wYXlsb2FkLmdyb3VwQXZhdGFyLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhc3NlcnQoZmFsc2UsICdTZXR0aW5nIGNvbXBvc2UgZ3JvdXAgYXZhdGFyIGF0IHRoaXMgc3RlcCBpcyBhIG5vLW9wJyk7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRVRfQ09NUE9TRV9HUk9VUF9OQU1FJykge1xuICAgIGNvbnN0IHsgY29tcG9zZXIgfSA9IHN0YXRlO1xuXG4gICAgc3dpdGNoIChjb21wb3Nlcj8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzOlxuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBjb21wb3Nlcjoge1xuICAgICAgICAgICAgLi4uY29tcG9zZXIsXG4gICAgICAgICAgICBncm91cE5hbWU6IGFjdGlvbi5wYXlsb2FkLmdyb3VwTmFtZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXNzZXJ0KGZhbHNlLCAnU2V0dGluZyBjb21wb3NlIGdyb3VwIG5hbWUgYXQgdGhpcyBzdGVwIGlzIGEgbm8tb3AnKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9DT01QT1NFX0dST1VQX0VYUElSRV9USU1FUicpIHtcbiAgICBjb25zdCB7IGNvbXBvc2VyIH0gPSBzdGF0ZTtcblxuICAgIHN3aXRjaCAoY29tcG9zZXI/LnN0ZXApIHtcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVyczpcbiAgICAgIGNhc2UgQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGE6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgY29tcG9zZXI6IHtcbiAgICAgICAgICAgIC4uLmNvbXBvc2VyLFxuICAgICAgICAgICAgZ3JvdXBFeHBpcmVUaW1lcjogYWN0aW9uLnBheWxvYWQuZ3JvdXBFeHBpcmVUaW1lcixcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXNzZXJ0KGZhbHNlLCAnU2V0dGluZyBjb21wb3NlIGdyb3VwIG5hbWUgYXQgdGhpcyBzdGVwIGlzIGEgbm8tb3AnKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFVF9DT01QT1NFX1NFQVJDSF9URVJNJykge1xuICAgIGNvbnN0IHsgY29tcG9zZXIgfSA9IHN0YXRlO1xuICAgIGlmICghY29tcG9zZXIpIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgICdTZXR0aW5nIGNvbXBvc2Ugc2VhcmNoIHRlcm0gd2l0aCB0aGUgY29tcG9zZXIgY2xvc2VkIGlzIGEgbm8tb3AnXG4gICAgICApO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBjb21wb3Nlci5zdGVwICE9PSBDb21wb3NlclN0ZXAuU3RhcnREaXJlY3RDb252ZXJzYXRpb24gJiZcbiAgICAgIGNvbXBvc2VyLnN0ZXAgIT09IENvbXBvc2VyU3RlcC5DaG9vc2VHcm91cE1lbWJlcnNcbiAgICApIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGBTZXR0aW5nIGNvbXBvc2Ugc2VhcmNoIHRlcm0gYXQgc3RlcCAke2NvbXBvc2VyLnN0ZXB9IGlzIGEgbm8tb3BgXG4gICAgICApO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgIC4uLmNvbXBvc2VyLFxuICAgICAgICBzZWFyY2hUZXJtOiBhY3Rpb24ucGF5bG9hZC5zZWFyY2hUZXJtLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VUX0lTX0ZFVENISU5HX1VVSUQnKSB7XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG4gICAgaWYgKCFjb21wb3Nlcikge1xuICAgICAgYXNzZXJ0KFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgJ1NldHRpbmcgY29tcG9zZSB1dWlkIGZldGNoIHN0YXRlIHdpdGggdGhlIGNvbXBvc2VyIGNsb3NlZCBpcyBhIG5vLW9wJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY29tcG9zZXIuc3RlcCAhPT0gQ29tcG9zZXJTdGVwLlN0YXJ0RGlyZWN0Q29udmVyc2F0aW9uICYmXG4gICAgICBjb21wb3Nlci5zdGVwICE9PSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzXG4gICAgKSB7XG4gICAgICBhc3NlcnQoZmFsc2UsICdTZXR0aW5nIGNvbXBvc2UgdXVpZCBmZXRjaCBzdGF0ZSBhdCB0aGlzIHN0ZXAgaXMgYSBuby1vcCcpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICBjb25zdCB7IGlkZW50aWZpZXIsIGlzRmV0Y2hpbmcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgeyB1dWlkRmV0Y2hTdGF0ZSB9ID0gY29tcG9zZXI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjb21wb3Nlcjoge1xuICAgICAgICAuLi5jb21wb3NlcixcbiAgICAgICAgdXVpZEZldGNoU3RhdGU6IGlzRmV0Y2hpbmdcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLi4uY29tcG9zZXIudXVpZEZldGNoU3RhdGUsXG4gICAgICAgICAgICAgIFtpZGVudGlmaWVyXTogaXNGZXRjaGluZyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IG9taXQodXVpZEZldGNoU3RhdGUsIGlkZW50aWZpZXIpLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBDT01QT1NFX1RPR0dMRV9FRElUSU5HX0FWQVRBUikge1xuICAgIGNvbnN0IHsgY29tcG9zZXIgfSA9IHN0YXRlO1xuXG4gICAgc3dpdGNoIChjb21wb3Nlcj8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBjb21wb3Nlcjoge1xuICAgICAgICAgICAgLi4uY29tcG9zZXIsXG4gICAgICAgICAgICBpc0VkaXRpbmdBdmF0YXI6ICFjb21wb3Nlci5pc0VkaXRpbmdBdmF0YXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFzc2VydChmYWxzZSwgJ1NldHRpbmcgZWRpdGluZyBhdmF0YXIgYXQgdGhpcyBzdGVwIGlzIGEgbm8tb3AnKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gQ09NUE9TRV9BRERfQVZBVEFSKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG5cbiAgICBzd2l0Y2ggKGNvbXBvc2VyPy5zdGVwKSB7XG4gICAgICBjYXNlIENvbXBvc2VyU3RlcC5DaG9vc2VHcm91cE1lbWJlcnM6XG4gICAgICBjYXNlIENvbXBvc2VyU3RlcC5TZXRHcm91cE1ldGFkYXRhOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgICAgICAuLi5jb21wb3NlcixcbiAgICAgICAgICAgIHVzZXJBdmF0YXJEYXRhOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgICAgIGlkOiBnZXROZXh0QXZhdGFySWQoY29tcG9zZXIudXNlckF2YXRhckRhdGEpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAuLi5jb21wb3Nlci51c2VyQXZhdGFyRGF0YSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFzc2VydChmYWxzZSwgJ0FkZGluZyBhbiBhdmF0YXIgYXQgdGhpcyBzdGVwIGlzIGEgbm8tb3AnKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gQ09NUE9TRV9SRU1PVkVfQVZBVEFSKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBjb21wb3NlciB9ID0gc3RhdGU7XG5cbiAgICBzd2l0Y2ggKGNvbXBvc2VyPy5zdGVwKSB7XG4gICAgICBjYXNlIENvbXBvc2VyU3RlcC5DaG9vc2VHcm91cE1lbWJlcnM6XG4gICAgICBjYXNlIENvbXBvc2VyU3RlcC5TZXRHcm91cE1ldGFkYXRhOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIGNvbXBvc2VyOiB7XG4gICAgICAgICAgICAuLi5jb21wb3NlcixcbiAgICAgICAgICAgIHVzZXJBdmF0YXJEYXRhOiBmaWx0ZXJBdmF0YXJEYXRhKGNvbXBvc2VyLnVzZXJBdmF0YXJEYXRhLCBwYXlsb2FkKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXNzZXJ0KGZhbHNlLCAnUmVtb3ZpbmcgYW4gYXZhdGFyIGF0IHRoaXMgc3RlcCBpcyBhIG5vLW9wJyk7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IENPTVBPU0VfUkVQTEFDRV9BVkFUQVIpIHtcbiAgICBjb25zdCB7IGN1cnIsIHByZXYgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHsgY29tcG9zZXIgfSA9IHN0YXRlO1xuXG4gICAgc3dpdGNoIChjb21wb3Nlcj8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzOlxuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBjb21wb3Nlcjoge1xuICAgICAgICAgICAgLi4uY29tcG9zZXIsXG4gICAgICAgICAgICB1c2VyQXZhdGFyRGF0YTogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLi4uY3VycixcbiAgICAgICAgICAgICAgICBpZDogcHJldj8uaWQgPz8gZ2V0TmV4dEF2YXRhcklkKGNvbXBvc2VyLnVzZXJBdmF0YXJEYXRhKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLi4uKHByZXZcbiAgICAgICAgICAgICAgICA/IGZpbHRlckF2YXRhckRhdGEoY29tcG9zZXIudXNlckF2YXRhckRhdGEsIHByZXYpXG4gICAgICAgICAgICAgICAgOiBjb21wb3Nlci51c2VyQXZhdGFyRGF0YSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhc3NlcnQoZmFsc2UsICdSZXBsYWNpbmcgYW4gYXZhdGFyIGF0IHRoaXMgc3RlcCBpcyBhIG5vLW9wJyk7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdUT0dHTEVfQ09OVkVSU0FUSU9OX0lOX0NIT09TRV9NRU1CRVJTJykge1xuICAgIGNvbnN0IHsgY29tcG9zZXIgfSA9IHN0YXRlO1xuICAgIGlmIChjb21wb3Nlcj8uc3RlcCAhPT0gQ29tcG9zZXJTdGVwLkNob29zZUdyb3VwTWVtYmVycykge1xuICAgICAgYXNzZXJ0KFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgJ1RvZ2dsaW5nIGNvbnZlcnNhdGlvbiBtZW1iZXJzIGlzIGEgbm8tb3AgaW4gdGhpcyBjb21wb3NlciBzdGVwJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjb21wb3Nlcjoge1xuICAgICAgICAuLi5jb21wb3NlcixcbiAgICAgICAgLi4udG9nZ2xlU2VsZWN0ZWRDb250YWN0Rm9yR3JvdXBBZGRpdGlvbihcbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXhHcm91cFNpemU6IGFjdGlvbi5wYXlsb2FkLm1heEdyb3VwU2l6ZSxcbiAgICAgICAgICAgIG1heFJlY29tbWVuZGVkR3JvdXBTaXplOiBhY3Rpb24ucGF5bG9hZC5tYXhSZWNvbW1lbmRlZEdyb3VwU2l6ZSxcbiAgICAgICAgICAgIG1heGltdW1Hcm91cFNpemVNb2RhbFN0YXRlOiBjb21wb3Nlci5tYXhpbXVtR3JvdXBTaXplTW9kYWxTdGF0ZSxcbiAgICAgICAgICAgIC8vIFdlIHNheSB5b3UncmUgYWxyZWFkeSBpbiB0aGUgZ3JvdXAsIGV2ZW4gdGhvdWdoIGl0IGhhc24ndCBiZWVuIGNyZWF0ZWQgeWV0LlxuICAgICAgICAgICAgbnVtYmVyT2ZDb250YWN0c0FscmVhZHlJbkdyb3VwOiAxLFxuICAgICAgICAgICAgcmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlOlxuICAgICAgICAgICAgICBjb21wb3Nlci5yZWNvbW1lbmRlZEdyb3VwU2l6ZU1vZGFsU3RhdGUsXG4gICAgICAgICAgICBzZWxlY3RlZENvbnZlcnNhdGlvbklkczogY29tcG9zZXIuc2VsZWN0ZWRDb252ZXJzYXRpb25JZHMsXG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBDT0xPUlNfQ0hBTkdFRCkge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uTG9va3VwIH0gPSBzdGF0ZTtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkNvbG9yLCBjdXN0b21Db2xvckRhdGEgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgbmV4dFN0YXRlID0ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGNvbnZlcnNhdGlvbkxvb2t1cCkuZm9yRWFjaChpZCA9PiB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IGNvbnZlcnNhdGlvbkxvb2t1cFtpZF07XG4gICAgICBjb25zdCBhZGRlZCA9IHtcbiAgICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgICAgICBjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JEYXRhPy52YWx1ZSxcbiAgICAgICAgY3VzdG9tQ29sb3JJZDogY3VzdG9tQ29sb3JEYXRhPy5pZCxcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIG5leHRTdGF0ZSxcbiAgICAgICAgdXBkYXRlQ29udmVyc2F0aW9uTG9va3VwcyhhZGRlZCwgZXhpc3RpbmcsIG5leHRTdGF0ZSksXG4gICAgICAgIHtcbiAgICAgICAgICBjb252ZXJzYXRpb25Mb29rdXA6IHtcbiAgICAgICAgICAgIC4uLm5leHRTdGF0ZS5jb252ZXJzYXRpb25Mb29rdXAsXG4gICAgICAgICAgICBbaWRdOiBhZGRlZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gQ09MT1JfU0VMRUNURUQpIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkxvb2t1cCB9ID0gc3RhdGU7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgY29udmVyc2F0aW9uQ29sb3IsIGN1c3RvbUNvbG9yRGF0YSB9ID1cbiAgICAgIGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBjb252ZXJzYXRpb25Mb29rdXBbY29udmVyc2F0aW9uSWRdO1xuICAgIGlmICghZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VkID0ge1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICBjb252ZXJzYXRpb25Db2xvcixcbiAgICAgIGN1c3RvbUNvbG9yOiBjdXN0b21Db2xvckRhdGE/LnZhbHVlLFxuICAgICAgY3VzdG9tQ29sb3JJZDogY3VzdG9tQ29sb3JEYXRhPy5pZCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY29udmVyc2F0aW9uTG9va3VwOiB7XG4gICAgICAgIC4uLmNvbnZlcnNhdGlvbkxvb2t1cCxcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXTogY2hhbmdlZCxcbiAgICAgIH0sXG4gICAgICAuLi51cGRhdGVDb252ZXJzYXRpb25Mb29rdXBzKGNoYW5nZWQsIGV4aXN0aW5nLCBzdGF0ZSksXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gQ1VTVE9NX0NPTE9SX1JFTU9WRUQpIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkxvb2t1cCB9ID0gc3RhdGU7XG4gICAgY29uc3QgeyBjb2xvcklkIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcbiAgICAgIC4uLnN0YXRlLFxuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhjb252ZXJzYXRpb25Mb29rdXApLmZvckVhY2goaWQgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBjb252ZXJzYXRpb25Mb29rdXBbaWRdO1xuXG4gICAgICBpZiAoZXhpc3RpbmcuY3VzdG9tQ29sb3JJZCAhPT0gY29sb3JJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoYW5nZWQgPSB7XG4gICAgICAgIC4uLmV4aXN0aW5nLFxuICAgICAgICBjb252ZXJzYXRpb25Db2xvcjogdW5kZWZpbmVkLFxuICAgICAgICBjdXN0b21Db2xvcjogdW5kZWZpbmVkLFxuICAgICAgICBjdXN0b21Db2xvcklkOiB1bmRlZmluZWQsXG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICBuZXh0U3RhdGUsXG4gICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbkxvb2t1cHMoY2hhbmdlZCwgZXhpc3RpbmcsIG5leHRTdGF0ZSksXG4gICAgICAgIHtcbiAgICAgICAgICBjb252ZXJzYXRpb25Mb29rdXA6IHtcbiAgICAgICAgICAgIC4uLm5leHRTdGF0ZS5jb252ZXJzYXRpb25Mb29rdXAsXG4gICAgICAgICAgICBbaWRdOiBjaGFuZ2VkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBSRVBMQUNFX0FWQVRBUlMpIHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbkxvb2t1cCB9ID0gc3RhdGU7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgYXZhdGFycyB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBjb252ZXJzYXRpb25Mb29rdXBbY29udmVyc2F0aW9uSWRdO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbmdlZCA9IHtcbiAgICAgIC4uLmNvbnZlcnNhdGlvbixcbiAgICAgIGF2YXRhcnMsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbnZlcnNhdGlvbkxvb2t1cDoge1xuICAgICAgICAuLi5jb252ZXJzYXRpb25Mb29rdXAsXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IGNoYW5nZWQsXG4gICAgICB9LFxuICAgICAgLi4udXBkYXRlQ29udmVyc2F0aW9uTG9va3VwcyhjaGFuZ2VkLCBjb252ZXJzYXRpb24sIHN0YXRlKSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBVUERBVEVfVVNFUk5BTUVfU0FWRV9TVEFURSkge1xuICAgIGNvbnN0IHsgbmV3U2F2ZVN0YXRlIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHVzZXJuYW1lU2F2ZVN0YXRlOiBuZXdTYXZlU3RhdGUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQSxvQkFRTztBQUdQLGFBQXdCO0FBQ3hCLFVBQXFCO0FBQ3JCLHFCQUF3QjtBQUN4QixvQkFBdUI7QUFDdkIsb0JBQXFDO0FBQ3JDLDJCQUFzQztBQUV0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bEM7QUFFQSxXQUFPO0FBQUEsU0FDRjtBQUFBLE1BQ0gsb0JBQW9CO0FBQUEsV0FDZjtBQUFBLFNBQ0YsaUJBQWlCO0FBQUEsTUFDcEI7QUFBQSxTQUNHLDBCQUEwQixTQUFTLFVBQVUsS0FBSztBQUFBLElBQ3ZEO0FBQUEsRUFDRjtBQUVBLE1BQUksT0FBTyxTQUFTLHNCQUFzQjtBQUN4QyxVQUFNLEVBQUUsdUJBQXVCO0FBQy9CLFVBQU0sRUFBRSxZQUFZLE9BQU87QUFFM0IsVUFBTSxZQUFZO0FBQUEsU0FDYjtBQUFBLElBQ0w7QUFFQSxXQUFPLEtBQUssa0JBQWtCLEVBQUUsUUFBUSxRQUFNO0FBQzVDLFlBQU0sV0FBVyxtQkFBbUI7QUFFcEMsVUFBSSxTQUFTLGtCQUFrQixTQUFTO0FBQ3RDO0FBQUEsTUFDRjtBQUVBLFlBQU0sVUFBVTtBQUFBLFdBQ1g7QUFBQSxRQUNILG1CQUFtQjtBQUFBLFFBQ25CLGFBQWE7QUFBQSxRQUNiLGVBQWU7QUFBQSxNQUNqQjtBQUVBLGFBQU8sT0FDTCxXQUNBLDBCQUEwQixTQUFTLFVBQVUsU0FBUyxHQUN0RDtBQUFBLFFBQ0Usb0JBQW9CO0FBQUEsYUFDZixVQUFVO0FBQUEsV0FDWixLQUFLO0FBQUEsUUFDUjtBQUFBLE1BQ0YsQ0FDRjtBQUFBLElBQ0YsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSxPQUFPLFNBQVMsaUJBQWlCO0FBQ25DLFVBQU0sRUFBRSx1QkFBdUI7QUFDL0IsVUFBTSxFQUFFLGdCQUFnQixZQUFZLE9BQU87QUFFM0MsVUFBTSxlQUFlLG1CQUFtQjtBQUN4QyxRQUFJLENBQUMsY0FBYztBQUNqQixhQUFPO0FBQUEsSUFDVDtBQUVBLFVBQU0sVUFBVTtBQUFBLFNBQ1g7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUVBLFdBQU87QUFBQSxTQUNGO0FBQUEsTUFDSCxvQkFBb0I7QUFBQSxXQUNmO0FBQUEsU0FDRixpQkFBaUI7QUFBQSxNQUNwQjtBQUFBLFNBQ0csMEJBQTBCLFNBQVMsY0FBYyxLQUFLO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBRUEsTUFBSSxPQUFPLFNBQVMsNEJBQTRCO0FBQzlDLFVBQU0sRUFBRSxpQkFBaUIsT0FBTztBQUVoQyxXQUFPO0FBQUEsU0FDRjtBQUFBLE1BQ0gsbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBRUEsU0FBTztBQUNUO0FBLzVDZ0IiLAogICJuYW1lcyI6IFtdCn0K
