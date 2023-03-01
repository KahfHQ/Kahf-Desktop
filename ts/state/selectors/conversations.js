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
  _conversationMessagesSelector: () => _conversationMessagesSelector,
  _conversationSelector: () => _conversationSelector,
  _getConversationComparator: () => _getConversationComparator,
  _getLeftPaneLists: () => _getLeftPaneLists,
  getAllComposableConversations: () => getAllComposableConversations,
  getAllConversations: () => getAllConversations,
  getAllSignalConnections: () => getAllSignalConnections,
  getCachedSelectorForConversation: () => getCachedSelectorForConversation,
  getCachedSelectorForConversationMessages: () => getCachedSelectorForConversationMessages,
  getCachedSelectorForMessage: () => getCachedSelectorForMessage,
  getCandidateContactsForNewGroup: () => getCandidateContactsForNewGroup,
  getComposableContacts: () => getComposableContacts,
  getComposableGroups: () => getComposableGroups,
  getComposeAvatarData: () => getComposeAvatarData,
  getComposeGroupAvatar: () => getComposeGroupAvatar,
  getComposeGroupExpireTimer: () => getComposeGroupExpireTimer,
  getComposeGroupName: () => getComposeGroupName,
  getComposeSelectedContacts: () => getComposeSelectedContacts,
  getComposerConversationSearchTerm: () => getComposerConversationSearchTerm,
  getComposerStep: () => getComposerStep,
  getComposerUUIDFetchState: () => getComposerUUIDFetchState,
  getContactNameColorSelector: () => getContactNameColorSelector,
  getConversationByIdSelector: () => getConversationByIdSelector,
  getConversationByUuidSelector: () => getConversationByUuidSelector,
  getConversationComparator: () => getConversationComparator,
  getConversationIdsStoppedForVerification: () => getConversationIdsStoppedForVerification,
  getConversationLookup: () => getConversationLookup,
  getConversationMessagesSelector: () => getConversationMessagesSelector,
  getConversationSelector: () => getConversationSelector,
  getConversationUuidsStoppingSend: () => getConversationUuidsStoppingSend,
  getConversations: () => getConversations,
  getConversationsByE164: () => getConversationsByE164,
  getConversationsByGroupId: () => getConversationsByGroupId,
  getConversationsByTitleSelector: () => getConversationsByTitleSelector,
  getConversationsByUsername: () => getConversationsByUsername,
  getConversationsByUuid: () => getConversationsByUuid,
  getConversationsStoppedForVerification: () => getConversationsStoppedForVerification,
  getConversationsStoppingSend: () => getConversationsStoppingSend,
  getConversationsWithCustomColorSelector: () => getConversationsWithCustomColorSelector,
  getFilteredCandidateContactsForNewGroup: () => getFilteredCandidateContactsForNewGroup,
  getFilteredComposeContacts: () => getFilteredComposeContacts,
  getFilteredComposeGroups: () => getFilteredComposeGroups,
  getGroupAdminsSelector: () => getGroupAdminsSelector,
  getGroupStories: () => getGroupStories,
  getInvitedContactsForNewlyCreatedGroup: () => getInvitedContactsForNewlyCreatedGroup,
  getLeftPaneLists: () => getLeftPaneLists,
  getMaximumGroupSizeModalState: () => getMaximumGroupSizeModalState,
  getMe: () => getMe,
  getMessageSelector: () => getMessageSelector,
  getMessages: () => getMessages,
  getMessagesByConversation: () => getMessagesByConversation,
  getNonGroupStories: () => getNonGroupStories,
  getPlaceholderContact: () => getPlaceholderContact,
  getPreJoinConversation: () => getPreJoinConversation,
  getRecommendedGroupSizeModalState: () => getRecommendedGroupSizeModalState,
  getSelectedConversationId: () => getSelectedConversationId,
  getSelectedMessage: () => getSelectedMessage,
  getShowArchived: () => getShowArchived,
  getUsernameSaveState: () => getUsernameSaveState,
  hasGroupCreationError: () => hasGroupCreationError,
  isCreatingGroup: () => isCreatingGroup,
  isEditingAvatar: () => isEditingAvatar,
  isMissingRequiredProfileSharing: () => isMissingRequiredProfileSharing
});
module.exports = __toCommonJS(conversations_exports);
var import_memoizee = __toESM(require("memoizee"));
var import_lodash = require("lodash");
var import_reselect = require("reselect");
var import_conversationsEnums = require("../ducks/conversationsEnums");
var import_getOwn = require("../../util/getOwn");
var import_isNotNil = require("../../util/isNotNil");
var import_deconstructLookup = require("../../util/deconstructLookup");
var import_assert = require("../../util/assert");
var import_isConversationUnregistered = require("../../util/isConversationUnregistered");
var import_filterAndSortConversations = require("../../util/filterAndSortConversations");
var import_Colors = require("../../types/Colors");
var import_isInSystemContacts = require("../../util/isInSystemContacts");
var import_getSignalConnections = require("../../util/getSignalConnections");
var import_sortByTitle = require("../../util/sortByTitle");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_user = require("./user");
var import_items = require("./items");
var import_message = require("./message");
var import_calling = require("./calling");
var import_accounts = require("./accounts");
var log = __toESM(require("../../logging/log"));
var import_timelineUtil = require("../../util/timelineUtil");
let placeholderContact;
const getPlaceholderContact = /* @__PURE__ */ __name(() => {
  if (placeholderContact) {
    return placeholderContact;
  }
  placeholderContact = {
    acceptedMessageRequest: false,
    badges: [],
    id: "placeholder-contact",
    type: "direct",
    title: window.i18n("unknownContact"),
    isMe: false,
    sharedGroupNames: []
  };
  return placeholderContact;
}, "getPlaceholderContact");
const getConversations = /* @__PURE__ */ __name((state) => state.conversations, "getConversations");
const getPreJoinConversation = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.preJoinConversation;
});
const getConversationLookup = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.conversationLookup;
});
const getConversationsByUuid = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.conversationsByUuid;
});
const getConversationsByE164 = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.conversationsByE164;
});
const getConversationsByGroupId = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.conversationsByGroupId;
});
const getConversationsByUsername = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.conversationsByUsername;
});
const getAllConversations = (0, import_reselect.createSelector)(getConversationLookup, (lookup) => Object.values(lookup));
const getAllSignalConnections = (0, import_reselect.createSelector)(getAllConversations, (conversations) => conversations.filter(import_getSignalConnections.isSignalConnection));
const getConversationsByTitleSelector = (0, import_reselect.createSelector)(getAllConversations, (conversations) => (title) => conversations.filter((conversation) => conversation.title === title));
const getSelectedConversationId = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.selectedConversationId;
});
const getSelectedMessage = (0, import_reselect.createSelector)(getConversations, (state) => {
  if (!state.selectedMessage) {
    return void 0;
  }
  return {
    id: state.selectedMessage,
    counter: state.selectedMessageCounter
  };
});
const getUsernameSaveState = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.usernameSaveState;
});
const getShowArchived = (0, import_reselect.createSelector)(getConversations, (state) => {
  return Boolean(state.showArchived);
});
const getComposerState = (0, import_reselect.createSelector)(getConversations, (state) => state.composer);
const getComposerStep = (0, import_reselect.createSelector)(getComposerState, (composerState) => composerState?.step);
const hasGroupCreationError = (0, import_reselect.createSelector)(getComposerState, (composerState) => {
  if (composerState?.step === import_conversationsEnums.ComposerStep.SetGroupMetadata) {
    return composerState.hasError;
  }
  return false;
});
const isCreatingGroup = (0, import_reselect.createSelector)(getComposerState, (composerState) => composerState?.step === import_conversationsEnums.ComposerStep.SetGroupMetadata && composerState.isCreating);
const isEditingAvatar = (0, import_reselect.createSelector)(getComposerState, (composerState) => composerState?.step === import_conversationsEnums.ComposerStep.SetGroupMetadata && composerState.isEditingAvatar);
const getComposeAvatarData = (0, import_reselect.createSelector)(getComposerState, (composerState) => composerState?.step === import_conversationsEnums.ComposerStep.SetGroupMetadata ? composerState.userAvatarData : []);
const getMessages = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.messagesLookup;
});
const getMessagesByConversation = (0, import_reselect.createSelector)(getConversations, (state) => {
  return state.messagesByConversation;
});
const collator = new Intl.Collator();
const _getConversationComparator = /* @__PURE__ */ __name(() => {
  return (left, right) => {
    const leftTimestamp = left.timestamp;
    const rightTimestamp = right.timestamp;
    if (leftTimestamp && !rightTimestamp) {
      return -1;
    }
    if (rightTimestamp && !leftTimestamp) {
      return 1;
    }
    if (leftTimestamp && rightTimestamp && leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }
    if (typeof left.inboxPosition === "number" && typeof right.inboxPosition === "number") {
      return right.inboxPosition > left.inboxPosition ? -1 : 1;
    }
    if (typeof left.inboxPosition === "number" && right.inboxPosition == null) {
      return -1;
    }
    if (typeof right.inboxPosition === "number" && left.inboxPosition == null) {
      return 1;
    }
    return collator.compare(left.title, right.title);
  };
}, "_getConversationComparator");
const getConversationComparator = (0, import_reselect.createSelector)(import_user.getIntl, import_user.getRegionCode, _getConversationComparator);
const _getLeftPaneLists = /* @__PURE__ */ __name((lookup, comparator, selectedConversation, pinnedConversationIds) => {
  const conversations = [];
  const archivedConversations = [];
  const pinnedConversations = [];
  const values = Object.values(lookup);
  const max = values.length;
  for (let i = 0; i < max; i += 1) {
    let conversation = values[i];
    if (selectedConversation === conversation.id) {
      conversation = {
        ...conversation,
        isSelected: true
      };
    }
    if (conversation.isPinned) {
      pinnedConversations.push(conversation);
      continue;
    }
    if (conversation.activeAt) {
      if (conversation.isArchived) {
        archivedConversations.push(conversation);
      } else {
        conversations.push(conversation);
      }
    }
  }
  conversations.sort(comparator);
  archivedConversations.sort(comparator);
  pinnedConversations.sort((a, b) => (pinnedConversationIds || []).indexOf(a.id) - (pinnedConversationIds || []).indexOf(b.id));
  return { conversations, archivedConversations, pinnedConversations };
}, "_getLeftPaneLists");
const getLeftPaneLists = (0, import_reselect.createSelector)(getConversationLookup, getConversationComparator, getSelectedConversationId, import_items.getPinnedConversationIds, _getLeftPaneLists);
const getMaximumGroupSizeModalState = (0, import_reselect.createSelector)(getComposerState, (composerState) => {
  switch (composerState?.step) {
    case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
    case import_conversationsEnums.ComposerStep.SetGroupMetadata:
      return composerState.maximumGroupSizeModalState;
    default:
      (0, import_assert.assert)(false, `Can't get the maximum group size modal state in this composer state; returning "never shown"`);
      return import_conversationsEnums.OneTimeModalState.NeverShown;
  }
});
const getRecommendedGroupSizeModalState = (0, import_reselect.createSelector)(getComposerState, (composerState) => {
  switch (composerState?.step) {
    case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
    case import_conversationsEnums.ComposerStep.SetGroupMetadata:
      return composerState.recommendedGroupSizeModalState;
    default:
      (0, import_assert.assert)(false, `Can't get the recommended group size modal state in this composer state; returning "never shown"`);
      return import_conversationsEnums.OneTimeModalState.NeverShown;
  }
});
const getMe = (0, import_reselect.createSelector)([getConversationLookup, import_user.getUserConversationId], (lookup, ourConversationId) => {
  if (!ourConversationId) {
    return getPlaceholderContact();
  }
  return lookup[ourConversationId] || getPlaceholderContact();
});
const getComposerConversationSearchTerm = (0, import_reselect.createSelector)(getComposerState, (composer) => {
  if (!composer) {
    (0, import_assert.assert)(false, "getComposerConversationSearchTerm: composer is not open");
    return "";
  }
  if (composer.step === import_conversationsEnums.ComposerStep.SetGroupMetadata) {
    (0, import_assert.assert)(false, "getComposerConversationSearchTerm: composer does not have a search term");
    return "";
  }
  return composer.searchTerm;
});
const getComposerUUIDFetchState = (0, import_reselect.createSelector)(getComposerState, (composer) => {
  if (!composer) {
    (0, import_assert.assert)(false, "getIsFetchingUsername: composer is not open");
    return {};
  }
  if (composer.step !== import_conversationsEnums.ComposerStep.StartDirectConversation && composer.step !== import_conversationsEnums.ComposerStep.ChooseGroupMembers) {
    (0, import_assert.assert)(false, `getComposerUUIDFetchState: step ${composer.step} has no uuidFetchState key`);
    return {};
  }
  return composer.uuidFetchState;
});
function isTrusted(conversation) {
  if (conversation.type === "group") {
    return true;
  }
  return Boolean((0, import_isInSystemContacts.isInSystemContacts)(conversation) || conversation.sharedGroupNames.length > 0 || conversation.profileSharing || conversation.isMe);
}
function hasDisplayInfo(conversation) {
  if (conversation.type === "group") {
    return Boolean(conversation.name);
  }
  return Boolean(conversation.name || conversation.profileName || conversation.phoneNumber || conversation.isMe);
}
function canComposeConversation(conversation) {
  return Boolean(!conversation.isBlocked && !(0, import_isConversationUnregistered.isConversationUnregistered)(conversation) && hasDisplayInfo(conversation) && isTrusted(conversation));
}
const getAllComposableConversations = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => Object.values(conversationLookup).filter((conversation) => !conversation.isBlocked && !conversation.isGroupV1AndDisabled && !(0, import_isConversationUnregistered.isConversationUnregistered)(conversation) && conversation.title && hasDisplayInfo(conversation)));
const getComposableContacts = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => Object.values(conversationLookup).filter((conversation) => conversation.type === "direct" && canComposeConversation(conversation)));
const getCandidateContactsForNewGroup = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => Object.values(conversationLookup).filter((conversation) => conversation.type === "direct" && !conversation.isMe && canComposeConversation(conversation)));
const getComposableGroups = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => Object.values(conversationLookup).filter((conversation) => conversation.type === "group" && canComposeConversation(conversation)));
const getNonGroupStories = (0, import_reselect.createSelector)(getComposableGroups, (groups) => groups.filter((group) => !group.isGroupStorySendReady));
const getGroupStories = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => Object.values(conversationLookup).filter((conversation) => conversation.isGroupStorySendReady));
const getNormalizedComposerConversationSearchTerm = (0, import_reselect.createSelector)(getComposerConversationSearchTerm, (searchTerm) => searchTerm.trim());
const getFilteredComposeContacts = (0, import_reselect.createSelector)(getNormalizedComposerConversationSearchTerm, getComposableContacts, import_user.getRegionCode, (searchTerm, contacts, regionCode) => {
  return (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(contacts, searchTerm, regionCode);
});
const getFilteredComposeGroups = (0, import_reselect.createSelector)(getNormalizedComposerConversationSearchTerm, getComposableGroups, import_user.getRegionCode, (searchTerm, groups, regionCode) => {
  return (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(groups, searchTerm, regionCode);
});
const getFilteredCandidateContactsForNewGroup = (0, import_reselect.createSelector)(getCandidateContactsForNewGroup, getNormalizedComposerConversationSearchTerm, import_user.getRegionCode, import_filterAndSortConversations.filterAndSortConversationsByRecent);
const getGroupCreationComposerState = (0, import_reselect.createSelector)(getComposerState, (composerState) => {
  switch (composerState?.step) {
    case import_conversationsEnums.ComposerStep.ChooseGroupMembers:
    case import_conversationsEnums.ComposerStep.SetGroupMetadata:
      return composerState;
    default:
      (0, import_assert.assert)(false, "getSetGroupMetadataComposerState: expected step to be SetGroupMetadata");
      return {
        groupName: "",
        groupAvatar: void 0,
        groupExpireTimer: 0,
        selectedConversationIds: []
      };
  }
});
const getComposeGroupAvatar = (0, import_reselect.createSelector)(getGroupCreationComposerState, (composerState) => composerState.groupAvatar);
const getComposeGroupName = (0, import_reselect.createSelector)(getGroupCreationComposerState, (composerState) => composerState.groupName);
const getComposeGroupExpireTimer = (0, import_reselect.createSelector)(getGroupCreationComposerState, (composerState) => composerState.groupExpireTimer);
const getComposeSelectedContacts = (0, import_reselect.createSelector)(getConversationLookup, getGroupCreationComposerState, (conversationLookup, composerState) => (0, import_deconstructLookup.deconstructLookup)(conversationLookup, composerState.selectedConversationIds));
function _conversationSelector(conversation) {
  if (conversation) {
    return conversation;
  }
  return getPlaceholderContact();
}
const getCachedSelectorForConversation = (0, import_reselect.createSelector)(import_user.getRegionCode, import_user.getUserNumber, () => {
  return (0, import_memoizee.default)(_conversationSelector, { max: 2e3 });
});
const getConversationSelector = (0, import_reselect.createSelector)(getCachedSelectorForConversation, getConversationLookup, getConversationsByUuid, getConversationsByE164, getConversationsByGroupId, (selector, byId, byUuid, byE164, byGroupId) => {
  return (id) => {
    if (!id) {
      return selector(void 0);
    }
    const onUuid = (0, import_getOwn.getOwn)(byUuid, id.toLowerCase ? id.toLowerCase() : id);
    if (onUuid) {
      return selector(onUuid);
    }
    const onE164 = (0, import_getOwn.getOwn)(byE164, id);
    if (onE164) {
      return selector(onE164);
    }
    const onGroupId = (0, import_getOwn.getOwn)(byGroupId, id);
    if (onGroupId) {
      return selector(onGroupId);
    }
    const onId = (0, import_getOwn.getOwn)(byId, id);
    if (onId) {
      return selector(onId);
    }
    log.warn(`getConversationSelector: No conversation found for id ${id}`);
    return selector(void 0);
  };
});
const getConversationByIdSelector = (0, import_reselect.createSelector)(getConversationLookup, (conversationLookup) => (id) => (0, import_getOwn.getOwn)(conversationLookup, id));
const getConversationByUuidSelector = (0, import_reselect.createSelector)(getConversationsByUuid, (conversationsByUuid) => (uuid) => (0, import_getOwn.getOwn)(conversationsByUuid, uuid));
const getCachedSelectorForMessage = (0, import_reselect.createSelector)(import_user.getRegionCode, import_user.getUserNumber, () => {
  return (0, import_memoizee.default)(import_message.getPropsForBubble, { max: 2e3 });
});
const getCachedConversationMemberColorsSelector = (0, import_reselect.createSelector)(getConversationSelector, import_user.getUserConversationId, (conversationSelector, ourConversationId) => {
  return (0, import_memoizee.default)((conversationId) => {
    const contactNameColors = /* @__PURE__ */ new Map();
    const {
      sortedGroupMembers = [],
      type,
      id: theirId
    } = conversationSelector(conversationId);
    if (type === "direct") {
      if (ourConversationId) {
        contactNameColors.set(ourConversationId, import_Colors.ContactNameColors[0]);
      }
      contactNameColors.set(theirId, import_Colors.ContactNameColors[0]);
      return contactNameColors;
    }
    [...sortedGroupMembers].sort((left, right) => String(left.uuid) > String(right.uuid) ? 1 : -1).forEach((member, i) => {
      contactNameColors.set(member.id, import_Colors.ContactNameColors[i % import_Colors.ContactNameColors.length]);
    });
    return contactNameColors;
  }, { max: 100 });
});
const getContactNameColorSelector = (0, import_reselect.createSelector)(getCachedConversationMemberColorsSelector, (conversationMemberColorsSelector) => {
  return (conversationId, contactId) => {
    if (!contactId) {
      log.warn("No color generated for missing contactId");
      return import_Colors.ContactNameColors[0];
    }
    const contactNameColors = conversationMemberColorsSelector(conversationId);
    const color = contactNameColors.get(contactId);
    if (!color) {
      log.warn(`No color generated for contact ${contactId}`);
      return import_Colors.ContactNameColors[0];
    }
    return color;
  };
});
const getMessageSelector = (0, import_reselect.createSelector)(getCachedSelectorForMessage, getMessages, getSelectedMessage, getConversationSelector, import_user.getRegionCode, import_user.getUserNumber, import_user.getUserACI, import_user.getUserPNI, import_user.getUserConversationId, import_calling.getCallSelector, import_calling.getActiveCall, import_accounts.getAccountSelector, getContactNameColorSelector, (messageSelector, messageLookup, selectedMessage, conversationSelector, regionCode, ourNumber, ourACI, ourPNI, ourConversationId, callSelector, activeCall, accountSelector, contactNameColorSelector) => {
  return (id) => {
    const message = messageLookup[id];
    if (!message) {
      return void 0;
    }
    return messageSelector(message, {
      conversationSelector,
      ourConversationId,
      ourNumber,
      ourACI,
      ourPNI,
      regionCode,
      selectedMessageId: selectedMessage?.id,
      selectedMessageCounter: selectedMessage?.counter,
      contactNameColorSelector,
      callSelector,
      activeCall,
      accountSelector
    });
  };
});
function _conversationMessagesSelector(conversation) {
  const {
    isNearBottom,
    messageChangeCounter,
    messageIds,
    messageLoadingState,
    metrics,
    scrollToMessageCounter,
    scrollToMessageId
  } = conversation;
  const firstId = messageIds[0];
  const lastId = messageIds.length === 0 ? void 0 : messageIds[messageIds.length - 1];
  const { oldestUnseen } = metrics;
  const haveNewest = !metrics.newest || !lastId || lastId === metrics.newest.id;
  const haveOldest = !metrics.oldest || !firstId || firstId === metrics.oldest.id;
  const items = messageIds;
  const oldestUnseenIndex = oldestUnseen ? messageIds.findIndex((id) => id === oldestUnseen.id) : void 0;
  const scrollToIndex = scrollToMessageId ? messageIds.findIndex((id) => id === scrollToMessageId) : void 0;
  const { totalUnseen } = metrics;
  return {
    haveNewest,
    haveOldest,
    isNearBottom,
    items,
    messageChangeCounter,
    messageLoadingState,
    oldestUnseenIndex: (0, import_lodash.isNumber)(oldestUnseenIndex) && oldestUnseenIndex >= 0 ? oldestUnseenIndex : void 0,
    scrollToIndex: (0, import_lodash.isNumber)(scrollToIndex) && scrollToIndex >= 0 ? scrollToIndex : void 0,
    scrollToIndexCounter: scrollToMessageCounter,
    totalUnseen
  };
}
const getCachedSelectorForConversationMessages = (0, import_reselect.createSelector)(import_user.getRegionCode, import_user.getUserNumber, () => {
  return (0, import_memoizee.default)(_conversationMessagesSelector, { max: 50 });
});
const getConversationMessagesSelector = (0, import_reselect.createSelector)(getCachedSelectorForConversationMessages, getMessagesByConversation, (conversationMessagesSelector, messagesByConversation) => {
  return (id) => {
    const conversation = messagesByConversation[id];
    if (!conversation) {
      return {
        haveNewest: false,
        haveOldest: false,
        messageChangeCounter: 0,
        messageLoadingState: import_timelineUtil.TimelineMessageLoadingState.DoingInitialLoad,
        scrollToIndexCounter: 0,
        totalUnseen: 0,
        items: []
      };
    }
    return conversationMessagesSelector(conversation);
  };
});
const getInvitedContactsForNewlyCreatedGroup = (0, import_reselect.createSelector)(getConversationsByUuid, getConversations, (conversationLookup, { invitedUuidsForNewlyCreatedGroup = [] }) => (0, import_deconstructLookup.deconstructLookup)(conversationLookup, invitedUuidsForNewlyCreatedGroup));
const getConversationsWithCustomColorSelector = (0, import_reselect.createSelector)(getAllConversations, (conversations) => {
  return (colorId) => {
    return conversations.filter((conversation) => conversation.customColorId === colorId);
  };
});
function isMissingRequiredProfileSharing(conversation) {
  const doesConversationRequireIt = !conversation.isMe && !conversation.left && ((0, import_whatTypeOfConversation.isGroupV1)(conversation) || (0, import_whatTypeOfConversation.isDirectConversation)(conversation));
  return Boolean(doesConversationRequireIt && !conversation.profileSharing && window.Signal.RemoteConfig.isEnabled("desktop.mandatoryProfileSharing") && conversation.messageCount && conversation.messageCount > 0);
}
const getGroupAdminsSelector = (0, import_reselect.createSelector)(getConversationSelector, (conversationSelector) => {
  return (conversationId) => {
    const {
      groupId,
      groupVersion,
      memberships = []
    } = conversationSelector(conversationId);
    if (!(0, import_whatTypeOfConversation.isGroupV2)({
      groupId,
      groupVersion
    })) {
      return [];
    }
    const admins = [];
    memberships.forEach((membership) => {
      if (membership.isAdmin) {
        const admin = conversationSelector(membership.uuid);
        admins.push(admin);
      }
    });
    return admins;
  };
});
const getConversationVerificationData = (0, import_reselect.createSelector)(getConversations, (conversations) => conversations.verificationDataByConversation);
const getConversationIdsStoppedForVerification = (0, import_reselect.createSelector)(getConversationVerificationData, (verificationDataByConversation) => Object.keys(verificationDataByConversation));
const getConversationsStoppedForVerification = (0, import_reselect.createSelector)(getConversationByIdSelector, getConversationIdsStoppedForVerification, (conversationSelector, conversationIds) => {
  const conversations = conversationIds.map((conversationId) => conversationSelector(conversationId)).filter(import_isNotNil.isNotNil);
  return (0, import_sortByTitle.sortByTitle)(conversations);
});
const getConversationUuidsStoppingSend = (0, import_reselect.createSelector)(getConversationVerificationData, (pendingData) => {
  const result = /* @__PURE__ */ new Set();
  Object.values(pendingData).forEach((item) => {
    if (item.type === import_conversationsEnums.ConversationVerificationState.PendingVerification) {
      item.uuidsNeedingVerification.forEach((conversationId) => {
        result.add(conversationId);
      });
    }
  });
  return Array.from(result);
});
const getConversationsStoppingSend = (0, import_reselect.createSelector)(getConversationSelector, getConversationUuidsStoppingSend, (conversationSelector, uuids) => {
  const conversations = uuids.map((uuid) => conversationSelector(uuid));
  return (0, import_sortByTitle.sortByTitle)(conversations);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _conversationMessagesSelector,
  _conversationSelector,
  _getConversationComparator,
  _getLeftPaneLists,
  getAllComposableConversations,
  getAllConversations,
  getAllSignalConnections,
  getCachedSelectorForConversation,
  getCachedSelectorForConversationMessages,
  getCachedSelectorForMessage,
  getCandidateContactsForNewGroup,
  getComposableContacts,
  getComposableGroups,
  getComposeAvatarData,
  getComposeGroupAvatar,
  getComposeGroupExpireTimer,
  getComposeGroupName,
  getComposeSelectedContacts,
  getComposerConversationSearchTerm,
  getComposerStep,
  getComposerUUIDFetchState,
  getContactNameColorSelector,
  getConversationByIdSelector,
  getConversationByUuidSelector,
  getConversationComparator,
  getConversationIdsStoppedForVerification,
  getConversationLookup,
  getConversationMessagesSelector,
  getConversationSelector,
  getConversationUuidsStoppingSend,
  getConversations,
  getConversationsByE164,
  getConversationsByGroupId,
  getConversationsByTitleSelector,
  getConversationsByUsername,
  getConversationsByUuid,
  getConversationsStoppedForVerification,
  getConversationsStoppingSend,
  getConversationsWithCustomColorSelector,
  getFilteredCandidateContactsForNewGroup,
  getFilteredComposeContacts,
  getFilteredComposeGroups,
  getGroupAdminsSelector,
  getGroupStories,
  getInvitedContactsForNewlyCreatedGroup,
  getLeftPaneLists,
  getMaximumGroupSizeModalState,
  getMe,
  getMessageSelector,
  getMessages,
  getMessagesByConversation,
  getNonGroupStories,
  getPlaceholderContact,
  getPreJoinConversation,
  getRecommendedGroupSizeModalState,
  getSelectedConversationId,
  getSelectedMessage,
  getShowArchived,
  getUsernameSaveState,
  hasGroupCreationError,
  isCreatingGroup,
  isEditingAvatar,
  isMissingRequiredProfileSharing
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBtZW1vaXplZSBmcm9tICdtZW1vaXplZSc7XG5pbXBvcnQgeyBpc051bWJlciB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcblxuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25Mb29rdXBUeXBlLFxuICBDb252ZXJzYXRpb25NZXNzYWdlVHlwZSxcbiAgQ29udmVyc2F0aW9uc1N0YXRlVHlwZSxcbiAgQ29udmVyc2F0aW9uVHlwZSxcbiAgQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uRGF0YSxcbiAgTWVzc2FnZUxvb2t1cFR5cGUsXG4gIE1lc3NhZ2VzQnlDb252ZXJzYXRpb25UeXBlLFxuICBQcmVKb2luQ29udmVyc2F0aW9uVHlwZSxcbn0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFVzZXJuYW1lU2F2ZVN0YXRlIH0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9uc0VudW1zJztcbmltcG9ydCB7XG4gIENvbXBvc2VyU3RlcCxcbiAgT25lVGltZU1vZGFsU3RhdGUsXG4gIENvbnZlcnNhdGlvblZlcmlmaWNhdGlvblN0YXRlLFxufSBmcm9tICcuLi9kdWNrcy9jb252ZXJzYXRpb25zRW51bXMnO1xuaW1wb3J0IHsgZ2V0T3duIH0gZnJvbSAnLi4vLi4vdXRpbC9nZXRPd24nO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuLi8uLi91dGlsL2lzTm90TmlsJztcbmltcG9ydCB0eXBlIHsgVVVJREZldGNoU3RhdGVUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbC91dWlkRmV0Y2hTdGF0ZSc7XG5pbXBvcnQgeyBkZWNvbnN0cnVjdExvb2t1cCB9IGZyb20gJy4uLy4uL3V0aWwvZGVjb25zdHJ1Y3RMb29rdXAnO1xuaW1wb3J0IHR5cGUgeyBQcm9wc0RhdGFUeXBlIGFzIFRpbWVsaW5lUHJvcHNUeXBlIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vVGltZWxpbmUnO1xuaW1wb3J0IHR5cGUgeyBUaW1lbGluZUl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vVGltZWxpbmVJdGVtJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCc7XG5pbXBvcnQgeyBmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50IH0gZnJvbSAnLi4vLi4vdXRpbC9maWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IENvbnRhY3ROYW1lQ29sb3JUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IENvbnRhY3ROYW1lQ29sb3JzIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHsgQXZhdGFyRGF0YVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9BdmF0YXInO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgaXNJblN5c3RlbUNvbnRhY3RzIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0luU3lzdGVtQ29udGFjdHMnO1xuaW1wb3J0IHsgaXNTaWduYWxDb25uZWN0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbC9nZXRTaWduYWxDb25uZWN0aW9ucyc7XG5pbXBvcnQgeyBzb3J0QnlUaXRsZSB9IGZyb20gJy4uLy4uL3V0aWwvc29ydEJ5VGl0bGUnO1xuaW1wb3J0IHtcbiAgaXNEaXJlY3RDb252ZXJzYXRpb24sXG4gIGlzR3JvdXBWMSxcbiAgaXNHcm91cFYyLFxufSBmcm9tICcuLi8uLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuXG5pbXBvcnQge1xuICBnZXRJbnRsLFxuICBnZXRSZWdpb25Db2RlLFxuICBnZXRVc2VyQ29udmVyc2F0aW9uSWQsXG4gIGdldFVzZXJOdW1iZXIsXG4gIGdldFVzZXJBQ0ksXG4gIGdldFVzZXJQTkksXG59IGZyb20gJy4vdXNlcic7XG5pbXBvcnQgeyBnZXRQaW5uZWRDb252ZXJzYXRpb25JZHMgfSBmcm9tICcuL2l0ZW1zJztcbmltcG9ydCB7IGdldFByb3BzRm9yQnViYmxlIH0gZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB0eXBlIHsgQ2FsbFNlbGVjdG9yVHlwZSwgQ2FsbFN0YXRlVHlwZSB9IGZyb20gJy4vY2FsbGluZyc7XG5pbXBvcnQgeyBnZXRBY3RpdmVDYWxsLCBnZXRDYWxsU2VsZWN0b3IgfSBmcm9tICcuL2NhbGxpbmcnO1xuaW1wb3J0IHR5cGUgeyBBY2NvdW50U2VsZWN0b3JUeXBlIH0gZnJvbSAnLi9hY2NvdW50cyc7XG5pbXBvcnQgeyBnZXRBY2NvdW50U2VsZWN0b3IgfSBmcm9tICcuL2FjY291bnRzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBUaW1lbGluZU1lc3NhZ2VMb2FkaW5nU3RhdGUgfSBmcm9tICcuLi8uLi91dGlsL3RpbWVsaW5lVXRpbCc7XG5cbmxldCBwbGFjZWhvbGRlckNvbnRhY3Q6IENvbnZlcnNhdGlvblR5cGU7XG5leHBvcnQgY29uc3QgZ2V0UGxhY2Vob2xkZXJDb250YWN0ID0gKCk6IENvbnZlcnNhdGlvblR5cGUgPT4ge1xuICBpZiAocGxhY2Vob2xkZXJDb250YWN0KSB7XG4gICAgcmV0dXJuIHBsYWNlaG9sZGVyQ29udGFjdDtcbiAgfVxuXG4gIHBsYWNlaG9sZGVyQ29udGFjdCA9IHtcbiAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiBmYWxzZSxcbiAgICBiYWRnZXM6IFtdLFxuICAgIGlkOiAncGxhY2Vob2xkZXItY29udGFjdCcsXG4gICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgdGl0bGU6IHdpbmRvdy5pMThuKCd1bmtub3duQ29udGFjdCcpLFxuICAgIGlzTWU6IGZhbHNlLFxuICAgIHNoYXJlZEdyb3VwTmFtZXM6IFtdLFxuICB9O1xuICByZXR1cm4gcGxhY2Vob2xkZXJDb250YWN0O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbnMgPSAoc3RhdGU6IFN0YXRlVHlwZSk6IENvbnZlcnNhdGlvbnNTdGF0ZVR5cGUgPT5cbiAgc3RhdGUuY29udmVyc2F0aW9ucztcblxuZXhwb3J0IGNvbnN0IGdldFByZUpvaW5Db252ZXJzYXRpb24gPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlKTogUHJlSm9pbkNvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5wcmVKb2luQ29udmVyc2F0aW9uO1xuICB9XG4pO1xuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbkxvb2t1cCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25zLFxuICAoc3RhdGU6IENvbnZlcnNhdGlvbnNTdGF0ZVR5cGUpOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlID0+IHtcbiAgICByZXR1cm4gc3RhdGUuY29udmVyc2F0aW9uTG9va3VwO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9uc0J5VXVpZCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25zLFxuICAoc3RhdGU6IENvbnZlcnNhdGlvbnNTdGF0ZVR5cGUpOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlID0+IHtcbiAgICByZXR1cm4gc3RhdGUuY29udmVyc2F0aW9uc0J5VXVpZDtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbnNCeUUxNjQgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlKTogQ29udmVyc2F0aW9uTG9va3VwVHlwZSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLmNvbnZlcnNhdGlvbnNCeUUxNjQ7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25zQnlHcm91cElkID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbnMsXG4gIChzdGF0ZTogQ29udmVyc2F0aW9uc1N0YXRlVHlwZSk6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jb252ZXJzYXRpb25zQnlHcm91cElkO1xuICB9XG4pO1xuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbnNCeVVzZXJuYW1lID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbnMsXG4gIChzdGF0ZTogQ29udmVyc2F0aW9uc1N0YXRlVHlwZSk6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jb252ZXJzYXRpb25zQnlVc2VybmFtZTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEFsbENvbnZlcnNhdGlvbnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uTG9va3VwLFxuICAobG9va3VwKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT4gT2JqZWN0LnZhbHVlcyhsb29rdXApXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsU2lnbmFsQ29ubmVjdGlvbnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0QWxsQ29udmVyc2F0aW9ucyxcbiAgKGNvbnZlcnNhdGlvbnMpOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PlxuICAgIGNvbnZlcnNhdGlvbnMuZmlsdGVyKGlzU2lnbmFsQ29ubmVjdGlvbilcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25zQnlUaXRsZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEFsbENvbnZlcnNhdGlvbnMsXG4gIChjb252ZXJzYXRpb25zKTogKCh0aXRsZTogc3RyaW5nKSA9PiBBcnJheTxDb252ZXJzYXRpb25UeXBlPikgPT5cbiAgICAodGl0bGU6IHN0cmluZykgPT5cbiAgICAgIGNvbnZlcnNhdGlvbnMuZmlsdGVyKGNvbnZlcnNhdGlvbiA9PiBjb252ZXJzYXRpb24udGl0bGUgPT09IHRpdGxlKVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFNlbGVjdGVkQ29udmVyc2F0aW9uSWQgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICByZXR1cm4gc3RhdGUuc2VsZWN0ZWRDb252ZXJzYXRpb25JZDtcbiAgfVxuKTtcblxudHlwZSBTZWxlY3RlZE1lc3NhZ2VUeXBlID0ge1xuICBpZDogc3RyaW5nO1xuICBjb3VudGVyOiBudW1iZXI7XG59O1xuZXhwb3J0IGNvbnN0IGdldFNlbGVjdGVkTWVzc2FnZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25zLFxuICAoc3RhdGU6IENvbnZlcnNhdGlvbnNTdGF0ZVR5cGUpOiBTZWxlY3RlZE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBpZiAoIXN0YXRlLnNlbGVjdGVkTWVzc2FnZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHN0YXRlLnNlbGVjdGVkTWVzc2FnZSxcbiAgICAgIGNvdW50ZXI6IHN0YXRlLnNlbGVjdGVkTWVzc2FnZUNvdW50ZXIsXG4gICAgfTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFVzZXJuYW1lU2F2ZVN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbnMsXG4gIChzdGF0ZTogQ29udmVyc2F0aW9uc1N0YXRlVHlwZSk6IFVzZXJuYW1lU2F2ZVN0YXRlID0+IHtcbiAgICByZXR1cm4gc3RhdGUudXNlcm5hbWVTYXZlU3RhdGU7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRTaG93QXJjaGl2ZWQgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIEJvb2xlYW4oc3RhdGUuc2hvd0FyY2hpdmVkKTtcbiAgfVxuKTtcblxuY29uc3QgZ2V0Q29tcG9zZXJTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25zLFxuICAoc3RhdGU6IENvbnZlcnNhdGlvbnNTdGF0ZVR5cGUpID0+IHN0YXRlLmNvbXBvc2VyXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9zZXJTdGVwID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChjb21wb3NlclN0YXRlKTogdW5kZWZpbmVkIHwgQ29tcG9zZXJTdGVwID0+IGNvbXBvc2VyU3RhdGU/LnN0ZXBcbik7XG5cbmV4cG9ydCBjb25zdCBoYXNHcm91cENyZWF0aW9uRXJyb3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29tcG9zZXJTdGF0ZSxcbiAgKGNvbXBvc2VyU3RhdGUpOiBib29sZWFuID0+IHtcbiAgICBpZiAoY29tcG9zZXJTdGF0ZT8uc3RlcCA9PT0gQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGEpIHtcbiAgICAgIHJldHVybiBjb21wb3NlclN0YXRlLmhhc0Vycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBpc0NyZWF0aW5nR3JvdXAgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29tcG9zZXJTdGF0ZSxcbiAgKGNvbXBvc2VyU3RhdGUpOiBib29sZWFuID0+XG4gICAgY29tcG9zZXJTdGF0ZT8uc3RlcCA9PT0gQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGEgJiZcbiAgICBjb21wb3NlclN0YXRlLmlzQ3JlYXRpbmdcbik7XG5cbmV4cG9ydCBjb25zdCBpc0VkaXRpbmdBdmF0YXIgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29tcG9zZXJTdGF0ZSxcbiAgKGNvbXBvc2VyU3RhdGUpOiBib29sZWFuID0+XG4gICAgY29tcG9zZXJTdGF0ZT8uc3RlcCA9PT0gQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGEgJiZcbiAgICBjb21wb3NlclN0YXRlLmlzRWRpdGluZ0F2YXRhclxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvc2VBdmF0YXJEYXRhID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChjb21wb3NlclN0YXRlKTogUmVhZG9ubHlBcnJheTxBdmF0YXJEYXRhVHlwZT4gPT5cbiAgICBjb21wb3NlclN0YXRlPy5zdGVwID09PSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YVxuICAgICAgPyBjb21wb3NlclN0YXRlLnVzZXJBdmF0YXJEYXRhXG4gICAgICA6IFtdXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0TWVzc2FnZXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKHN0YXRlOiBDb252ZXJzYXRpb25zU3RhdGVUeXBlKTogTWVzc2FnZUxvb2t1cFR5cGUgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5tZXNzYWdlc0xvb2t1cDtcbiAgfVxuKTtcbmV4cG9ydCBjb25zdCBnZXRNZXNzYWdlc0J5Q29udmVyc2F0aW9uID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbnMsXG4gIChzdGF0ZTogQ29udmVyc2F0aW9uc1N0YXRlVHlwZSk6IE1lc3NhZ2VzQnlDb252ZXJzYXRpb25UeXBlID0+IHtcbiAgICByZXR1cm4gc3RhdGUubWVzc2FnZXNCeUNvbnZlcnNhdGlvbjtcbiAgfVxuKTtcblxuY29uc3QgY29sbGF0b3IgPSBuZXcgSW50bC5Db2xsYXRvcigpO1xuXG4vLyBOb3RlOiB3ZSB3aWxsIHByb2JhYmx5IHdhbnQgdG8gcHV0IGkxOG4gYW5kIHJlZ2lvbkNvZGUgYmFjayB3aGVuIHdlIGFyZSBmb3JtYXR0aW5nXG4vLyAgIHBob25lIG51bWJlcnMgYW5kIGNvbnRhY3RzIGZyb20gc2NyYXRjaCBoZXJlIGFnYWluLlxuZXhwb3J0IGNvbnN0IF9nZXRDb252ZXJzYXRpb25Db21wYXJhdG9yID0gKCkgPT4ge1xuICByZXR1cm4gKGxlZnQ6IENvbnZlcnNhdGlvblR5cGUsIHJpZ2h0OiBDb252ZXJzYXRpb25UeXBlKTogbnVtYmVyID0+IHtcbiAgICBjb25zdCBsZWZ0VGltZXN0YW1wID0gbGVmdC50aW1lc3RhbXA7XG4gICAgY29uc3QgcmlnaHRUaW1lc3RhbXAgPSByaWdodC50aW1lc3RhbXA7XG4gICAgaWYgKGxlZnRUaW1lc3RhbXAgJiYgIXJpZ2h0VGltZXN0YW1wKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGlmIChyaWdodFRpbWVzdGFtcCAmJiAhbGVmdFRpbWVzdGFtcCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGlmIChsZWZ0VGltZXN0YW1wICYmIHJpZ2h0VGltZXN0YW1wICYmIGxlZnRUaW1lc3RhbXAgIT09IHJpZ2h0VGltZXN0YW1wKSB7XG4gICAgICByZXR1cm4gcmlnaHRUaW1lc3RhbXAgLSBsZWZ0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBsZWZ0LmluYm94UG9zaXRpb24gPT09ICdudW1iZXInICYmXG4gICAgICB0eXBlb2YgcmlnaHQuaW5ib3hQb3NpdGlvbiA9PT0gJ251bWJlcidcbiAgICApIHtcbiAgICAgIHJldHVybiByaWdodC5pbmJveFBvc2l0aW9uID4gbGVmdC5pbmJveFBvc2l0aW9uID8gLTEgOiAxO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbGVmdC5pbmJveFBvc2l0aW9uID09PSAnbnVtYmVyJyAmJiByaWdodC5pbmJveFBvc2l0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHJpZ2h0LmluYm94UG9zaXRpb24gPT09ICdudW1iZXInICYmIGxlZnQuaW5ib3hQb3NpdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sbGF0b3IuY29tcGFyZShsZWZ0LnRpdGxlLCByaWdodC50aXRsZSk7XG4gIH07XG59O1xuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbkNvbXBhcmF0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0SW50bCxcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgX2dldENvbnZlcnNhdGlvbkNvbXBhcmF0b3Jcbik7XG5cbmV4cG9ydCBjb25zdCBfZ2V0TGVmdFBhbmVMaXN0cyA9IChcbiAgbG9va3VwOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlLFxuICBjb21wYXJhdG9yOiAobGVmdDogQ29udmVyc2F0aW9uVHlwZSwgcmlnaHQ6IENvbnZlcnNhdGlvblR5cGUpID0+IG51bWJlcixcbiAgc2VsZWN0ZWRDb252ZXJzYXRpb24/OiBzdHJpbmcsXG4gIHBpbm5lZENvbnZlcnNhdGlvbklkcz86IEFycmF5PHN0cmluZz5cbik6IHtcbiAgY29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGFyY2hpdmVkQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIHBpbm5lZENvbnZlcnNhdGlvbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+O1xufSA9PiB7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+ID0gW107XG4gIGNvbnN0IGFyY2hpdmVkQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPSBbXTtcbiAgY29uc3QgcGlubmVkQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPSBbXTtcblxuICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGxvb2t1cCk7XG4gIGNvbnN0IG1heCA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4OyBpICs9IDEpIHtcbiAgICBsZXQgY29udmVyc2F0aW9uID0gdmFsdWVzW2ldO1xuICAgIGlmIChzZWxlY3RlZENvbnZlcnNhdGlvbiA9PT0gY29udmVyc2F0aW9uLmlkKSB7XG4gICAgICBjb252ZXJzYXRpb24gPSB7XG4gICAgICAgIC4uLmNvbnZlcnNhdGlvbixcbiAgICAgICAgaXNTZWxlY3RlZDogdHJ1ZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gV2UgYWx3YXlzIHNob3cgcGlubmVkIGNvbnZlcnNhdGlvbnNcbiAgICBpZiAoY29udmVyc2F0aW9uLmlzUGlubmVkKSB7XG4gICAgICBwaW5uZWRDb252ZXJzYXRpb25zLnB1c2goY29udmVyc2F0aW9uKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjb252ZXJzYXRpb24uYWN0aXZlQXQpIHtcbiAgICAgIGlmIChjb252ZXJzYXRpb24uaXNBcmNoaXZlZCkge1xuICAgICAgICBhcmNoaXZlZENvbnZlcnNhdGlvbnMucHVzaChjb252ZXJzYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udmVyc2F0aW9ucy5wdXNoKGNvbnZlcnNhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29udmVyc2F0aW9ucy5zb3J0KGNvbXBhcmF0b3IpO1xuICBhcmNoaXZlZENvbnZlcnNhdGlvbnMuc29ydChjb21wYXJhdG9yKTtcblxuICBwaW5uZWRDb252ZXJzYXRpb25zLnNvcnQoXG4gICAgKGEsIGIpID0+XG4gICAgICAocGlubmVkQ29udmVyc2F0aW9uSWRzIHx8IFtdKS5pbmRleE9mKGEuaWQpIC1cbiAgICAgIChwaW5uZWRDb252ZXJzYXRpb25JZHMgfHwgW10pLmluZGV4T2YoYi5pZClcbiAgKTtcblxuICByZXR1cm4geyBjb252ZXJzYXRpb25zLCBhcmNoaXZlZENvbnZlcnNhdGlvbnMsIHBpbm5lZENvbnZlcnNhdGlvbnMgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMZWZ0UGFuZUxpc3RzID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbkxvb2t1cCxcbiAgZ2V0Q29udmVyc2F0aW9uQ29tcGFyYXRvcixcbiAgZ2V0U2VsZWN0ZWRDb252ZXJzYXRpb25JZCxcbiAgZ2V0UGlubmVkQ29udmVyc2F0aW9uSWRzLFxuICBfZ2V0TGVmdFBhbmVMaXN0c1xuKTtcblxuZXhwb3J0IGNvbnN0IGdldE1heGltdW1Hcm91cFNpemVNb2RhbFN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChjb21wb3NlclN0YXRlKTogT25lVGltZU1vZGFsU3RhdGUgPT4ge1xuICAgIHN3aXRjaCAoY29tcG9zZXJTdGF0ZT8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzOlxuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyU3RhdGUubWF4aW11bUdyb3VwU2l6ZU1vZGFsU3RhdGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhc3NlcnQoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ0NhblxcJ3QgZ2V0IHRoZSBtYXhpbXVtIGdyb3VwIHNpemUgbW9kYWwgc3RhdGUgaW4gdGhpcyBjb21wb3NlciBzdGF0ZTsgcmV0dXJuaW5nIFwibmV2ZXIgc2hvd25cIidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIE9uZVRpbWVNb2RhbFN0YXRlLk5ldmVyU2hvd247XG4gICAgfVxuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0UmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChjb21wb3NlclN0YXRlKTogT25lVGltZU1vZGFsU3RhdGUgPT4ge1xuICAgIHN3aXRjaCAoY29tcG9zZXJTdGF0ZT8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzOlxuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyU3RhdGUucmVjb21tZW5kZWRHcm91cFNpemVNb2RhbFN0YXRlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdDYW5cXCd0IGdldCB0aGUgcmVjb21tZW5kZWQgZ3JvdXAgc2l6ZSBtb2RhbCBzdGF0ZSBpbiB0aGlzIGNvbXBvc2VyIHN0YXRlOyByZXR1cm5pbmcgXCJuZXZlciBzaG93blwiJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gT25lVGltZU1vZGFsU3RhdGUuTmV2ZXJTaG93bjtcbiAgICB9XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRNZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBbZ2V0Q29udmVyc2F0aW9uTG9va3VwLCBnZXRVc2VyQ29udmVyc2F0aW9uSWRdLFxuICAoXG4gICAgbG9va3VwOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlLFxuICAgIG91ckNvbnZlcnNhdGlvbklkOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgKTogQ29udmVyc2F0aW9uVHlwZSA9PiB7XG4gICAgaWYgKCFvdXJDb252ZXJzYXRpb25JZCkge1xuICAgICAgcmV0dXJuIGdldFBsYWNlaG9sZGVyQ29udGFjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBsb29rdXBbb3VyQ29udmVyc2F0aW9uSWRdIHx8IGdldFBsYWNlaG9sZGVyQ29udGFjdCgpO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9zZXJDb252ZXJzYXRpb25TZWFyY2hUZXJtID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChjb21wb3Nlcik6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFjb21wb3Nlcikge1xuICAgICAgYXNzZXJ0KGZhbHNlLCAnZ2V0Q29tcG9zZXJDb252ZXJzYXRpb25TZWFyY2hUZXJtOiBjb21wb3NlciBpcyBub3Qgb3BlbicpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAoY29tcG9zZXIuc3RlcCA9PT0gQ29tcG9zZXJTdGVwLlNldEdyb3VwTWV0YWRhdGEpIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgICdnZXRDb21wb3NlckNvbnZlcnNhdGlvblNlYXJjaFRlcm06IGNvbXBvc2VyIGRvZXMgbm90IGhhdmUgYSBzZWFyY2ggdGVybSdcbiAgICAgICk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBjb21wb3Nlci5zZWFyY2hUZXJtO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9zZXJVVUlERmV0Y2hTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb21wb3NlclN0YXRlLFxuICAoY29tcG9zZXIpOiBVVUlERmV0Y2hTdGF0ZVR5cGUgPT4ge1xuICAgIGlmICghY29tcG9zZXIpIHtcbiAgICAgIGFzc2VydChmYWxzZSwgJ2dldElzRmV0Y2hpbmdVc2VybmFtZTogY29tcG9zZXIgaXMgbm90IG9wZW4nKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY29tcG9zZXIuc3RlcCAhPT0gQ29tcG9zZXJTdGVwLlN0YXJ0RGlyZWN0Q29udmVyc2F0aW9uICYmXG4gICAgICBjb21wb3Nlci5zdGVwICE9PSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzXG4gICAgKSB7XG4gICAgICBhc3NlcnQoXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBgZ2V0Q29tcG9zZXJVVUlERmV0Y2hTdGF0ZTogc3RlcCAke2NvbXBvc2VyLnN0ZXB9IGAgK1xuICAgICAgICAgICdoYXMgbm8gdXVpZEZldGNoU3RhdGUga2V5J1xuICAgICAgKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvc2VyLnV1aWRGZXRjaFN0YXRlO1xuICB9XG4pO1xuXG5mdW5jdGlvbiBpc1RydXN0ZWQoY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25UeXBlKTogYm9vbGVhbiB7XG4gIGlmIChjb252ZXJzYXRpb24udHlwZSA9PT0gJ2dyb3VwJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgaXNJblN5c3RlbUNvbnRhY3RzKGNvbnZlcnNhdGlvbikgfHxcbiAgICAgIGNvbnZlcnNhdGlvbi5zaGFyZWRHcm91cE5hbWVzLmxlbmd0aCA+IDAgfHxcbiAgICAgIGNvbnZlcnNhdGlvbi5wcm9maWxlU2hhcmluZyB8fFxuICAgICAgY29udmVyc2F0aW9uLmlzTWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFzRGlzcGxheUluZm8oY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25UeXBlKTogYm9vbGVhbiB7XG4gIGlmIChjb252ZXJzYXRpb24udHlwZSA9PT0gJ2dyb3VwJykge1xuICAgIHJldHVybiBCb29sZWFuKGNvbnZlcnNhdGlvbi5uYW1lKTtcbiAgfVxuXG4gIHJldHVybiBCb29sZWFuKFxuICAgIGNvbnZlcnNhdGlvbi5uYW1lIHx8XG4gICAgICBjb252ZXJzYXRpb24ucHJvZmlsZU5hbWUgfHxcbiAgICAgIGNvbnZlcnNhdGlvbi5waG9uZU51bWJlciB8fFxuICAgICAgY29udmVyc2F0aW9uLmlzTWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gY2FuQ29tcG9zZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb246IENvbnZlcnNhdGlvblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgIWNvbnZlcnNhdGlvbi5pc0Jsb2NrZWQgJiZcbiAgICAgICFpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZChjb252ZXJzYXRpb24pICYmXG4gICAgICBoYXNEaXNwbGF5SW5mbyhjb252ZXJzYXRpb24pICYmXG4gICAgICBpc1RydXN0ZWQoY29udmVyc2F0aW9uKVxuICApO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0QWxsQ29tcG9zYWJsZUNvbnZlcnNhdGlvbnMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uTG9va3VwLFxuICAoY29udmVyc2F0aW9uTG9va3VwOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT5cbiAgICBPYmplY3QudmFsdWVzKGNvbnZlcnNhdGlvbkxvb2t1cCkuZmlsdGVyKFxuICAgICAgY29udmVyc2F0aW9uID0+XG4gICAgICAgICFjb252ZXJzYXRpb24uaXNCbG9ja2VkICYmXG4gICAgICAgICFjb252ZXJzYXRpb24uaXNHcm91cFYxQW5kRGlzYWJsZWQgJiZcbiAgICAgICAgIWlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkKGNvbnZlcnNhdGlvbikgJiZcbiAgICAgICAgLy8gQWxsIGNvbnZlcnNhdGlvbiBzaG91bGQgaGF2ZSBhIHRpdGxlIGV4Y2VwdCBpbiB3ZWlyZCBjYXNlcyB3aGVyZVxuICAgICAgICAvLyB0aGV5IGRvbid0LCBpbiB0aGF0IGNhc2Ugd2UgZG9uJ3Qgd2FudCB0byBzaG93IHRoZXNlIGZvciBGb3J3YXJkaW5nLlxuICAgICAgICBjb252ZXJzYXRpb24udGl0bGUgJiZcbiAgICAgICAgaGFzRGlzcGxheUluZm8oY29udmVyc2F0aW9uKVxuICAgIClcbik7XG5cbi8qKlxuICogZ2V0Q29tcG9zYWJsZUNvbnRhY3RzL2dldENhbmRpZGF0ZUNvbnRhY3RzRm9yTmV3R3JvdXAgYm90aCByZXR1cm4gY29udGFjdHMgZm9yIHRoZVxuICogY29tcG9zZXIgYW5kIGdyb3VwIG1lbWJlcnMsIGEgZGlmZmVyZW50IGxpc3QgZnJvbSB5b3VyIHByaW1hcnkgc3lzdGVtIGNvbnRhY3RzLlxuICogVGhpcyBsaXN0IG1heSBpbmNsdWRlIGZhbHNlIHBvc2l0aXZlcywgd2hpY2ggaXMgYmV0dGVyIHRoYW4gbWlzc2luZyBjb250YWN0cy5cbiAqXG4gKiBOb3RlOiB0aGUga2V5IGRpZmZlcmVuY2UgYmV0d2VlbiB0aGVtOlxuICogICBnZXRDb21wb3NhYmxlQ29udGFjdHMgaW5jbHVkZXMgTm90ZSB0byBTZWxmXG4gKiAgIGdldENhbmRpZGF0ZUNvbnRhY3RzRm9yTmV3R3JvdXAgZG9lcyBub3QgaW5jbHVkZSBOb3RlIHRvIFNlbGZcbiAqXG4gKiBCZWNhdXNlIHRoZXkgZmlsdGVyIHVucmVnaXN0ZXJlZCBjb250YWN0cyBhbmQgdGhhdCdzIChwYXJ0aWFsbHkpIGRldGVybWluZWQgYnkgdGhlXG4gKiBjdXJyZW50IHRpbWUsIGl0J3MgcG9zc2libGUgZm9yIHRoZW0gdG8gcmV0dXJuIHN0YWxlIGNvbnRhY3RzIHRoYXQgaGF2ZSB1bnJlZ2lzdGVyZWRcbiAqIGlmIG5vIG90aGVyIGNvbnZlcnNhdGlvbnMgY2hhbmdlLiBUaGlzIHNob3VsZCBiZSBhIHJhcmUgZmFsc2UgcG9zaXRpdmUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb21wb3NhYmxlQ29udGFjdHMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uTG9va3VwLFxuICAoY29udmVyc2F0aW9uTG9va3VwOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT5cbiAgICBPYmplY3QudmFsdWVzKGNvbnZlcnNhdGlvbkxvb2t1cCkuZmlsdGVyKFxuICAgICAgY29udmVyc2F0aW9uID0+XG4gICAgICAgIGNvbnZlcnNhdGlvbi50eXBlID09PSAnZGlyZWN0JyAmJiBjYW5Db21wb3NlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbilcbiAgICApXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q2FuZGlkYXRlQ29udGFjdHNGb3JOZXdHcm91cCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25Mb29rdXAsXG4gIChjb252ZXJzYXRpb25Mb29rdXA6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUpOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PlxuICAgIE9iamVjdC52YWx1ZXMoY29udmVyc2F0aW9uTG9va3VwKS5maWx0ZXIoXG4gICAgICBjb252ZXJzYXRpb24gPT5cbiAgICAgICAgY29udmVyc2F0aW9uLnR5cGUgPT09ICdkaXJlY3QnICYmXG4gICAgICAgICFjb252ZXJzYXRpb24uaXNNZSAmJlxuICAgICAgICBjYW5Db21wb3NlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbilcbiAgICApXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9zYWJsZUdyb3VwcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25Mb29rdXAsXG4gIChjb252ZXJzYXRpb25Mb29rdXA6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUpOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PlxuICAgIE9iamVjdC52YWx1ZXMoY29udmVyc2F0aW9uTG9va3VwKS5maWx0ZXIoXG4gICAgICBjb252ZXJzYXRpb24gPT5cbiAgICAgICAgY29udmVyc2F0aW9uLnR5cGUgPT09ICdncm91cCcgJiYgY2FuQ29tcG9zZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24pXG4gICAgKVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldE5vbkdyb3VwU3RvcmllcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb21wb3NhYmxlR3JvdXBzLFxuICAoZ3JvdXBzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPik6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+ID0+XG4gICAgZ3JvdXBzLmZpbHRlcihncm91cCA9PiAhZ3JvdXAuaXNHcm91cFN0b3J5U2VuZFJlYWR5KVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEdyb3VwU3RvcmllcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25Mb29rdXAsXG4gIChjb252ZXJzYXRpb25Mb29rdXA6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUpOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PlxuICAgIE9iamVjdC52YWx1ZXMoY29udmVyc2F0aW9uTG9va3VwKS5maWx0ZXIoXG4gICAgICBjb252ZXJzYXRpb24gPT4gY29udmVyc2F0aW9uLmlzR3JvdXBTdG9yeVNlbmRSZWFkeVxuICAgIClcbik7XG5cbmNvbnN0IGdldE5vcm1hbGl6ZWRDb21wb3NlckNvbnZlcnNhdGlvblNlYXJjaFRlcm0gPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29tcG9zZXJDb252ZXJzYXRpb25TZWFyY2hUZXJtLFxuICAoc2VhcmNoVGVybTogc3RyaW5nKTogc3RyaW5nID0+IHNlYXJjaFRlcm0udHJpbSgpXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyZWRDb21wb3NlQ29udGFjdHMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Tm9ybWFsaXplZENvbXBvc2VyQ29udmVyc2F0aW9uU2VhcmNoVGVybSxcbiAgZ2V0Q29tcG9zYWJsZUNvbnRhY3RzLFxuICBnZXRSZWdpb25Db2RlLFxuICAoXG4gICAgc2VhcmNoVGVybTogc3RyaW5nLFxuICAgIGNvbnRhY3RzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPixcbiAgICByZWdpb25Db2RlOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT4ge1xuICAgIHJldHVybiBmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50KGNvbnRhY3RzLCBzZWFyY2hUZXJtLCByZWdpb25Db2RlKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEZpbHRlcmVkQ29tcG9zZUdyb3VwcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXROb3JtYWxpemVkQ29tcG9zZXJDb252ZXJzYXRpb25TZWFyY2hUZXJtLFxuICBnZXRDb21wb3NhYmxlR3JvdXBzLFxuICBnZXRSZWdpb25Db2RlLFxuICAoXG4gICAgc2VhcmNoVGVybTogc3RyaW5nLFxuICAgIGdyb3VwczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4sXG4gICAgcmVnaW9uQ29kZTogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICk6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+ID0+IHtcbiAgICByZXR1cm4gZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudChncm91cHMsIHNlYXJjaFRlcm0sIHJlZ2lvbkNvZGUpO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsdGVyZWRDYW5kaWRhdGVDb250YWN0c0Zvck5ld0dyb3VwID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENhbmRpZGF0ZUNvbnRhY3RzRm9yTmV3R3JvdXAsXG4gIGdldE5vcm1hbGl6ZWRDb21wb3NlckNvbnZlcnNhdGlvblNlYXJjaFRlcm0sXG4gIGdldFJlZ2lvbkNvZGUsXG4gIGZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zQnlSZWNlbnRcbik7XG5cbmNvbnN0IGdldEdyb3VwQ3JlYXRpb25Db21wb3NlclN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbXBvc2VyU3RhdGUsXG4gIChcbiAgICBjb21wb3NlclN0YXRlXG4gICk6IHtcbiAgICBncm91cE5hbWU6IHN0cmluZztcbiAgICBncm91cEF2YXRhcjogdW5kZWZpbmVkIHwgVWludDhBcnJheTtcbiAgICBncm91cEV4cGlyZVRpbWVyOiBudW1iZXI7XG4gICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZHM6IEFycmF5PHN0cmluZz47XG4gIH0gPT4ge1xuICAgIHN3aXRjaCAoY29tcG9zZXJTdGF0ZT8uc3RlcCkge1xuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuQ2hvb3NlR3JvdXBNZW1iZXJzOlxuICAgICAgY2FzZSBDb21wb3NlclN0ZXAuU2V0R3JvdXBNZXRhZGF0YTpcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyU3RhdGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhc3NlcnQoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ2dldFNldEdyb3VwTWV0YWRhdGFDb21wb3NlclN0YXRlOiBleHBlY3RlZCBzdGVwIHRvIGJlIFNldEdyb3VwTWV0YWRhdGEnXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ3JvdXBOYW1lOiAnJyxcbiAgICAgICAgICBncm91cEF2YXRhcjogdW5kZWZpbmVkLFxuICAgICAgICAgIGdyb3VwRXhwaXJlVGltZXI6IDAsXG4gICAgICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZHM6IFtdLFxuICAgICAgICB9O1xuICAgIH1cbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvc2VHcm91cEF2YXRhciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRHcm91cENyZWF0aW9uQ29tcG9zZXJTdGF0ZSxcbiAgKGNvbXBvc2VyU3RhdGUpOiB1bmRlZmluZWQgfCBVaW50OEFycmF5ID0+IGNvbXBvc2VyU3RhdGUuZ3JvdXBBdmF0YXJcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb3NlR3JvdXBOYW1lID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEdyb3VwQ3JlYXRpb25Db21wb3NlclN0YXRlLFxuICAoY29tcG9zZXJTdGF0ZSk6IHN0cmluZyA9PiBjb21wb3NlclN0YXRlLmdyb3VwTmFtZVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvc2VHcm91cEV4cGlyZVRpbWVyID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEdyb3VwQ3JlYXRpb25Db21wb3NlclN0YXRlLFxuICAoY29tcG9zZXJTdGF0ZSk6IG51bWJlciA9PiBjb21wb3NlclN0YXRlLmdyb3VwRXhwaXJlVGltZXJcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb3NlU2VsZWN0ZWRDb250YWN0cyA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25Mb29rdXAsXG4gIGdldEdyb3VwQ3JlYXRpb25Db21wb3NlclN0YXRlLFxuICAoY29udmVyc2F0aW9uTG9va3VwLCBjb21wb3NlclN0YXRlKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT5cbiAgICBkZWNvbnN0cnVjdExvb2t1cChjb252ZXJzYXRpb25Mb29rdXAsIGNvbXBvc2VyU3RhdGUuc2VsZWN0ZWRDb252ZXJzYXRpb25JZHMpXG4pO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHdlIHdpbGwgcHV0IENvbnZlcnNhdGlvbiBzZWxlY3RvciBsb2dpYywgcmVwbGljYXRpbmcgd2hhdFxuLy8gaXMgY3VycmVudGx5IGluIG1vZGVscy9jb252ZXJzYXRpb24uZ2V0UHJvcHMoKVxuLy8gV2hhdCBuZWVkcyB0byBoYXBwZW4gdG8gcHVsbCB0aGF0IHNlbGVjdG9yIGxvZ2ljIGhlcmU/XG4vLyAgIDEpIGNvbnRhY3RUeXBpbmdUaW1lcnMgLSB0aGF0IFVJLW9ubHkgc3RhdGUgbmVlZHMgdG8gYmUgbW92ZWQgdG8gcmVkdXhcbi8vICAgMikgYWxsIG9mIHRoZSBtZXNzYWdlIHNlbGVjdG9ycyBuZWVkIHRvIGJlIHJlc2VsZWN0LWJhc2VkOyB0b2RheSB0aG9zZVxuLy8gICAgICBCYWNrYm9uZS1iYXNlZCBwcm9wLWdlbmVyYXRpb24gZnVuY3Rpb25zIGV4cGVjdCB0byBnZXQgQ29udmVyc2F0aW9uIGluZm9ybWF0aW9uXG4vLyAgICAgIGRpcmVjdGx5IHZpYSBDb252ZXJzYXRpb25Db250cm9sbGVyXG5leHBvcnQgZnVuY3Rpb24gX2NvbnZlcnNhdGlvblNlbGVjdG9yKFxuICBjb252ZXJzYXRpb24/OiBDb252ZXJzYXRpb25UeXBlXG4gIC8vIHJlZ2lvbkNvZGU6IHN0cmluZyxcbiAgLy8gdXNlck51bWJlcjogc3RyaW5nXG4pOiBDb252ZXJzYXRpb25UeXBlIHtcbiAgaWYgKGNvbnZlcnNhdGlvbikge1xuICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gIH1cblxuICByZXR1cm4gZ2V0UGxhY2Vob2xkZXJDb250YWN0KCk7XG59XG5cbi8vIEEgbGl0dGxlIG9wdGltaXphdGlvbiB0byByZXNldCBvdXIgc2VsZWN0b3IgY2FjaGUgd2hlbiBoaWdoLWxldmVsIGFwcGxpY2F0aW9uIGRhdGFcbi8vICAgY2hhbmdlczogcmVnaW9uQ29kZSBhbmQgdXNlck51bWJlci5cbnR5cGUgQ2FjaGVkQ29udmVyc2F0aW9uU2VsZWN0b3JUeXBlID0gKFxuICBjb252ZXJzYXRpb24/OiBDb252ZXJzYXRpb25UeXBlXG4pID0+IENvbnZlcnNhdGlvblR5cGU7XG5leHBvcnQgY29uc3QgZ2V0Q2FjaGVkU2VsZWN0b3JGb3JDb252ZXJzYXRpb24gPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgZ2V0VXNlck51bWJlcixcbiAgKCk6IENhY2hlZENvbnZlcnNhdGlvblNlbGVjdG9yVHlwZSA9PiB7XG4gICAgLy8gTm90ZTogbWVtb2l6ZWUgd2lsbCBjaGVjayBhbGwgcGFyYW1ldGVycyBwcm92aWRlZCwgYW5kIG9ubHkgcnVuIG91ciBzZWxlY3RvclxuICAgIC8vICAgaWYgYW55IG9mIHRoZW0gaGF2ZSBjaGFuZ2VkLlxuICAgIHJldHVybiBtZW1vaXplZShfY29udmVyc2F0aW9uU2VsZWN0b3IsIHsgbWF4OiAyMDAwIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgdHlwZSBHZXRDb252ZXJzYXRpb25CeUlkVHlwZSA9IChpZD86IHN0cmluZykgPT4gQ29udmVyc2F0aW9uVHlwZTtcbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25TZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDYWNoZWRTZWxlY3RvckZvckNvbnZlcnNhdGlvbixcbiAgZ2V0Q29udmVyc2F0aW9uTG9va3VwLFxuICBnZXRDb252ZXJzYXRpb25zQnlVdWlkLFxuICBnZXRDb252ZXJzYXRpb25zQnlFMTY0LFxuICBnZXRDb252ZXJzYXRpb25zQnlHcm91cElkLFxuICAoXG4gICAgc2VsZWN0b3I6IENhY2hlZENvbnZlcnNhdGlvblNlbGVjdG9yVHlwZSxcbiAgICBieUlkOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlLFxuICAgIGJ5VXVpZDogQ29udmVyc2F0aW9uTG9va3VwVHlwZSxcbiAgICBieUUxNjQ6IENvbnZlcnNhdGlvbkxvb2t1cFR5cGUsXG4gICAgYnlHcm91cElkOiBDb252ZXJzYXRpb25Mb29rdXBUeXBlXG4gICk6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlID0+IHtcbiAgICByZXR1cm4gKGlkPzogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvcih1bmRlZmluZWQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvblV1aWQgPSBnZXRPd24oYnlVdWlkLCBpZC50b0xvd2VyQ2FzZSA/IGlkLnRvTG93ZXJDYXNlKCkgOiBpZCk7XG4gICAgICBpZiAob25VdWlkKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RvcihvblV1aWQpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb25FMTY0ID0gZ2V0T3duKGJ5RTE2NCwgaWQpO1xuICAgICAgaWYgKG9uRTE2NCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3Iob25FMTY0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9uR3JvdXBJZCA9IGdldE93bihieUdyb3VwSWQsIGlkKTtcbiAgICAgIGlmIChvbkdyb3VwSWQpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yKG9uR3JvdXBJZCk7XG4gICAgICB9XG4gICAgICBjb25zdCBvbklkID0gZ2V0T3duKGJ5SWQsIGlkKTtcbiAgICAgIGlmIChvbklkKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RvcihvbklkKTtcbiAgICAgIH1cblxuICAgICAgbG9nLndhcm4oYGdldENvbnZlcnNhdGlvblNlbGVjdG9yOiBObyBjb252ZXJzYXRpb24gZm91bmQgZm9yIGlkICR7aWR9YCk7XG4gICAgICAvLyBUaGlzIHdpbGwgcmV0dXJuIGEgcGxhY2Vob2xkZXIgY29udGFjdFxuICAgICAgcmV0dXJuIHNlbGVjdG9yKHVuZGVmaW5lZCk7XG4gICAgfTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbkJ5SWRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25Mb29rdXAsXG4gIGNvbnZlcnNhdGlvbkxvb2t1cCA9PlxuICAgIChpZDogc3RyaW5nKTogdW5kZWZpbmVkIHwgQ29udmVyc2F0aW9uVHlwZSA9PlxuICAgICAgZ2V0T3duKGNvbnZlcnNhdGlvbkxvb2t1cCwgaWQpXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlVdWlkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uc0J5VXVpZCxcbiAgY29udmVyc2F0aW9uc0J5VXVpZCA9PlxuICAgICh1dWlkOiBVVUlEU3RyaW5nVHlwZSk6IHVuZGVmaW5lZCB8IENvbnZlcnNhdGlvblR5cGUgPT5cbiAgICAgIGdldE93bihjb252ZXJzYXRpb25zQnlVdWlkLCB1dWlkKVxuKTtcblxuLy8gQSBsaXR0bGUgb3B0aW1pemF0aW9uIHRvIHJlc2V0IG91ciBzZWxlY3RvciBjYWNoZSB3aGVuZXZlciBoaWdoLWxldmVsIGFwcGxpY2F0aW9uIGRhdGFcbi8vICAgY2hhbmdlczogcmVnaW9uQ29kZSBhbmQgdXNlck51bWJlci5cbmV4cG9ydCBjb25zdCBnZXRDYWNoZWRTZWxlY3RvckZvck1lc3NhZ2UgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgZ2V0VXNlck51bWJlcixcbiAgKCk6IHR5cGVvZiBnZXRQcm9wc0ZvckJ1YmJsZSA9PiB7XG4gICAgLy8gTm90ZTogbWVtb2l6ZWUgd2lsbCBjaGVjayBhbGwgcGFyYW1ldGVycyBwcm92aWRlZCwgYW5kIG9ubHkgcnVuIG91ciBzZWxlY3RvclxuICAgIC8vICAgaWYgYW55IG9mIHRoZW0gaGF2ZSBjaGFuZ2VkLlxuICAgIHJldHVybiBtZW1vaXplZShnZXRQcm9wc0ZvckJ1YmJsZSwgeyBtYXg6IDIwMDAgfSk7XG4gIH1cbik7XG5cbmNvbnN0IGdldENhY2hlZENvbnZlcnNhdGlvbk1lbWJlckNvbG9yc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvblNlbGVjdG9yLFxuICBnZXRVc2VyQ29udmVyc2F0aW9uSWQsXG4gIChcbiAgICBjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGUsXG4gICAgb3VyQ29udmVyc2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuICApID0+IHtcbiAgICByZXR1cm4gbWVtb2l6ZWUoXG4gICAgICAoY29udmVyc2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgICBjb25zdCBjb250YWN0TmFtZUNvbG9yczogTWFwPHN0cmluZywgQ29udGFjdE5hbWVDb2xvclR5cGU+ID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgc29ydGVkR3JvdXBNZW1iZXJzID0gW10sXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBpZDogdGhlaXJJZCxcbiAgICAgICAgfSA9IGNvbnZlcnNhdGlvblNlbGVjdG9yKGNvbnZlcnNhdGlvbklkKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ2RpcmVjdCcpIHtcbiAgICAgICAgICBpZiAob3VyQ29udmVyc2F0aW9uSWQpIHtcbiAgICAgICAgICAgIGNvbnRhY3ROYW1lQ29sb3JzLnNldChvdXJDb252ZXJzYXRpb25JZCwgQ29udGFjdE5hbWVDb2xvcnNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250YWN0TmFtZUNvbG9ycy5zZXQodGhlaXJJZCwgQ29udGFjdE5hbWVDb2xvcnNbMF0pO1xuICAgICAgICAgIHJldHVybiBjb250YWN0TmFtZUNvbG9ycztcbiAgICAgICAgfVxuXG4gICAgICAgIFsuLi5zb3J0ZWRHcm91cE1lbWJlcnNdXG4gICAgICAgICAgLnNvcnQoKGxlZnQsIHJpZ2h0KSA9PlxuICAgICAgICAgICAgU3RyaW5nKGxlZnQudXVpZCkgPiBTdHJpbmcocmlnaHQudXVpZCkgPyAxIDogLTFcbiAgICAgICAgICApXG4gICAgICAgICAgLmZvckVhY2goKG1lbWJlciwgaSkgPT4ge1xuICAgICAgICAgICAgY29udGFjdE5hbWVDb2xvcnMuc2V0KFxuICAgICAgICAgICAgICBtZW1iZXIuaWQsXG4gICAgICAgICAgICAgIENvbnRhY3ROYW1lQ29sb3JzW2kgJSBDb250YWN0TmFtZUNvbG9ycy5sZW5ndGhdXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb250YWN0TmFtZUNvbG9ycztcbiAgICAgIH0sXG4gICAgICB7IG1heDogMTAwIH1cbiAgICApO1xuICB9XG4pO1xuXG5leHBvcnQgdHlwZSBDb250YWN0TmFtZUNvbG9yU2VsZWN0b3JUeXBlID0gKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBjb250YWN0SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSA9PiBDb250YWN0TmFtZUNvbG9yVHlwZTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDYWNoZWRDb252ZXJzYXRpb25NZW1iZXJDb2xvcnNTZWxlY3RvcixcbiAgY29udmVyc2F0aW9uTWVtYmVyQ29sb3JzU2VsZWN0b3IgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICAgICAgY29udGFjdElkOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICApOiBDb250YWN0TmFtZUNvbG9yVHlwZSA9PiB7XG4gICAgICBpZiAoIWNvbnRhY3RJZCkge1xuICAgICAgICBsb2cud2FybignTm8gY29sb3IgZ2VuZXJhdGVkIGZvciBtaXNzaW5nIGNvbnRhY3RJZCcpO1xuICAgICAgICByZXR1cm4gQ29udGFjdE5hbWVDb2xvcnNbMF07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRhY3ROYW1lQ29sb3JzID1cbiAgICAgICAgY29udmVyc2F0aW9uTWVtYmVyQ29sb3JzU2VsZWN0b3IoY29udmVyc2F0aW9uSWQpO1xuICAgICAgY29uc3QgY29sb3IgPSBjb250YWN0TmFtZUNvbG9ycy5nZXQoY29udGFjdElkKTtcbiAgICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgbG9nLndhcm4oYE5vIGNvbG9yIGdlbmVyYXRlZCBmb3IgY29udGFjdCAke2NvbnRhY3RJZH1gKTtcbiAgICAgICAgcmV0dXJuIENvbnRhY3ROYW1lQ29sb3JzWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH07XG4gIH1cbik7XG5cbnR5cGUgR2V0TWVzc2FnZUJ5SWRUeXBlID0gKGlkOiBzdHJpbmcpID0+IFRpbWVsaW5lSXRlbVR5cGUgfCB1bmRlZmluZWQ7XG5leHBvcnQgY29uc3QgZ2V0TWVzc2FnZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENhY2hlZFNlbGVjdG9yRm9yTWVzc2FnZSxcbiAgZ2V0TWVzc2FnZXMsXG4gIGdldFNlbGVjdGVkTWVzc2FnZSxcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIGdldFJlZ2lvbkNvZGUsXG4gIGdldFVzZXJOdW1iZXIsXG4gIGdldFVzZXJBQ0ksXG4gIGdldFVzZXJQTkksXG4gIGdldFVzZXJDb252ZXJzYXRpb25JZCxcbiAgZ2V0Q2FsbFNlbGVjdG9yLFxuICBnZXRBY3RpdmVDYWxsLFxuICBnZXRBY2NvdW50U2VsZWN0b3IsXG4gIGdldENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvcixcbiAgKFxuICAgIG1lc3NhZ2VTZWxlY3RvcjogdHlwZW9mIGdldFByb3BzRm9yQnViYmxlLFxuICAgIG1lc3NhZ2VMb29rdXA6IE1lc3NhZ2VMb29rdXBUeXBlLFxuICAgIHNlbGVjdGVkTWVzc2FnZTogU2VsZWN0ZWRNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZCxcbiAgICBjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGUsXG4gICAgcmVnaW9uQ29kZTogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIG91ck51bWJlcjogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIG91ckFDSTogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQsXG4gICAgb3VyUE5JOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZCxcbiAgICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIGNhbGxTZWxlY3RvcjogQ2FsbFNlbGVjdG9yVHlwZSxcbiAgICBhY3RpdmVDYWxsOiB1bmRlZmluZWQgfCBDYWxsU3RhdGVUeXBlLFxuICAgIGFjY291bnRTZWxlY3RvcjogQWNjb3VudFNlbGVjdG9yVHlwZSxcbiAgICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3I6IENvbnRhY3ROYW1lQ29sb3JTZWxlY3RvclR5cGVcbiAgKTogR2V0TWVzc2FnZUJ5SWRUeXBlID0+IHtcbiAgICByZXR1cm4gKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlTG9va3VwW2lkXTtcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVzc2FnZVNlbGVjdG9yKG1lc3NhZ2UsIHtcbiAgICAgICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gICAgICAgIG91ckNvbnZlcnNhdGlvbklkLFxuICAgICAgICBvdXJOdW1iZXIsXG4gICAgICAgIG91ckFDSSxcbiAgICAgICAgb3VyUE5JLFxuICAgICAgICByZWdpb25Db2RlLFxuICAgICAgICBzZWxlY3RlZE1lc3NhZ2VJZDogc2VsZWN0ZWRNZXNzYWdlPy5pZCxcbiAgICAgICAgc2VsZWN0ZWRNZXNzYWdlQ291bnRlcjogc2VsZWN0ZWRNZXNzYWdlPy5jb3VudGVyLFxuICAgICAgICBjb250YWN0TmFtZUNvbG9yU2VsZWN0b3IsXG4gICAgICAgIGNhbGxTZWxlY3RvcixcbiAgICAgICAgYWN0aXZlQ2FsbCxcbiAgICAgICAgYWNjb3VudFNlbGVjdG9yLFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9jb252ZXJzYXRpb25NZXNzYWdlc1NlbGVjdG9yKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1lc3NhZ2VUeXBlXG4pOiBUaW1lbGluZVByb3BzVHlwZSB7XG4gIGNvbnN0IHtcbiAgICBpc05lYXJCb3R0b20sXG4gICAgbWVzc2FnZUNoYW5nZUNvdW50ZXIsXG4gICAgbWVzc2FnZUlkcyxcbiAgICBtZXNzYWdlTG9hZGluZ1N0YXRlLFxuICAgIG1ldHJpY3MsXG4gICAgc2Nyb2xsVG9NZXNzYWdlQ291bnRlcixcbiAgICBzY3JvbGxUb01lc3NhZ2VJZCxcbiAgfSA9IGNvbnZlcnNhdGlvbjtcblxuICBjb25zdCBmaXJzdElkID0gbWVzc2FnZUlkc1swXTtcbiAgY29uc3QgbGFzdElkID1cbiAgICBtZXNzYWdlSWRzLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IG1lc3NhZ2VJZHNbbWVzc2FnZUlkcy5sZW5ndGggLSAxXTtcblxuICBjb25zdCB7IG9sZGVzdFVuc2VlbiB9ID0gbWV0cmljcztcblxuICBjb25zdCBoYXZlTmV3ZXN0ID0gIW1ldHJpY3MubmV3ZXN0IHx8ICFsYXN0SWQgfHwgbGFzdElkID09PSBtZXRyaWNzLm5ld2VzdC5pZDtcbiAgY29uc3QgaGF2ZU9sZGVzdCA9XG4gICAgIW1ldHJpY3Mub2xkZXN0IHx8ICFmaXJzdElkIHx8IGZpcnN0SWQgPT09IG1ldHJpY3Mub2xkZXN0LmlkO1xuXG4gIGNvbnN0IGl0ZW1zID0gbWVzc2FnZUlkcztcblxuICBjb25zdCBvbGRlc3RVbnNlZW5JbmRleCA9IG9sZGVzdFVuc2VlblxuICAgID8gbWVzc2FnZUlkcy5maW5kSW5kZXgoaWQgPT4gaWQgPT09IG9sZGVzdFVuc2Vlbi5pZClcbiAgICA6IHVuZGVmaW5lZDtcbiAgY29uc3Qgc2Nyb2xsVG9JbmRleCA9IHNjcm9sbFRvTWVzc2FnZUlkXG4gICAgPyBtZXNzYWdlSWRzLmZpbmRJbmRleChpZCA9PiBpZCA9PT0gc2Nyb2xsVG9NZXNzYWdlSWQpXG4gICAgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHsgdG90YWxVbnNlZW4gfSA9IG1ldHJpY3M7XG5cbiAgcmV0dXJuIHtcbiAgICBoYXZlTmV3ZXN0LFxuICAgIGhhdmVPbGRlc3QsXG4gICAgaXNOZWFyQm90dG9tLFxuICAgIGl0ZW1zLFxuICAgIG1lc3NhZ2VDaGFuZ2VDb3VudGVyLFxuICAgIG1lc3NhZ2VMb2FkaW5nU3RhdGUsXG4gICAgb2xkZXN0VW5zZWVuSW5kZXg6XG4gICAgICBpc051bWJlcihvbGRlc3RVbnNlZW5JbmRleCkgJiYgb2xkZXN0VW5zZWVuSW5kZXggPj0gMFxuICAgICAgICA/IG9sZGVzdFVuc2VlbkluZGV4XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIHNjcm9sbFRvSW5kZXg6XG4gICAgICBpc051bWJlcihzY3JvbGxUb0luZGV4KSAmJiBzY3JvbGxUb0luZGV4ID49IDAgPyBzY3JvbGxUb0luZGV4IDogdW5kZWZpbmVkLFxuICAgIHNjcm9sbFRvSW5kZXhDb3VudGVyOiBzY3JvbGxUb01lc3NhZ2VDb3VudGVyLFxuICAgIHRvdGFsVW5zZWVuLFxuICB9O1xufVxuXG50eXBlIENhY2hlZENvbnZlcnNhdGlvbk1lc3NhZ2VzU2VsZWN0b3JUeXBlID0gKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1lc3NhZ2VUeXBlXG4pID0+IFRpbWVsaW5lUHJvcHNUeXBlO1xuZXhwb3J0IGNvbnN0IGdldENhY2hlZFNlbGVjdG9yRm9yQ29udmVyc2F0aW9uTWVzc2FnZXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgZ2V0VXNlck51bWJlcixcbiAgKCk6IENhY2hlZENvbnZlcnNhdGlvbk1lc3NhZ2VzU2VsZWN0b3JUeXBlID0+IHtcbiAgICAvLyBOb3RlOiBtZW1vaXplZSB3aWxsIGNoZWNrIGFsbCBwYXJhbWV0ZXJzIHByb3ZpZGVkLCBhbmQgb25seSBydW4gb3VyIHNlbGVjdG9yXG4gICAgLy8gICBpZiBhbnkgb2YgdGhlbSBoYXZlIGNoYW5nZWQuXG4gICAgcmV0dXJuIG1lbW9pemVlKF9jb252ZXJzYXRpb25NZXNzYWdlc1NlbGVjdG9yLCB7IG1heDogNTAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25NZXNzYWdlc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENhY2hlZFNlbGVjdG9yRm9yQ29udmVyc2F0aW9uTWVzc2FnZXMsXG4gIGdldE1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gIChcbiAgICBjb252ZXJzYXRpb25NZXNzYWdlc1NlbGVjdG9yOiBDYWNoZWRDb252ZXJzYXRpb25NZXNzYWdlc1NlbGVjdG9yVHlwZSxcbiAgICBtZXNzYWdlc0J5Q29udmVyc2F0aW9uOiBNZXNzYWdlc0J5Q29udmVyc2F0aW9uVHlwZVxuICApID0+IHtcbiAgICByZXR1cm4gKGlkOiBzdHJpbmcpOiBUaW1lbGluZVByb3BzVHlwZSA9PiB7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb24gPSBtZXNzYWdlc0J5Q29udmVyc2F0aW9uW2lkXTtcbiAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgIC8vIFRPRE86IERFU0tUT1AtMjM0MFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhhdmVOZXdlc3Q6IGZhbHNlLFxuICAgICAgICAgIGhhdmVPbGRlc3Q6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2VDaGFuZ2VDb3VudGVyOiAwLFxuICAgICAgICAgIG1lc3NhZ2VMb2FkaW5nU3RhdGU6IFRpbWVsaW5lTWVzc2FnZUxvYWRpbmdTdGF0ZS5Eb2luZ0luaXRpYWxMb2FkLFxuICAgICAgICAgIHNjcm9sbFRvSW5kZXhDb3VudGVyOiAwLFxuICAgICAgICAgIHRvdGFsVW5zZWVuOiAwLFxuICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnZlcnNhdGlvbk1lc3NhZ2VzU2VsZWN0b3IoY29udmVyc2F0aW9uKTtcbiAgICB9O1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0SW52aXRlZENvbnRhY3RzRm9yTmV3bHlDcmVhdGVkR3JvdXAgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uc0J5VXVpZCxcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKFxuICAgIGNvbnZlcnNhdGlvbkxvb2t1cCxcbiAgICB7IGludml0ZWRVdWlkc0Zvck5ld2x5Q3JlYXRlZEdyb3VwID0gW10gfVxuICApOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PlxuICAgIGRlY29uc3RydWN0TG9va3VwKGNvbnZlcnNhdGlvbkxvb2t1cCwgaW52aXRlZFV1aWRzRm9yTmV3bHlDcmVhdGVkR3JvdXApXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvclNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEFsbENvbnZlcnNhdGlvbnMsXG4gIGNvbnZlcnNhdGlvbnMgPT4ge1xuICAgIHJldHVybiAoY29sb3JJZDogc3RyaW5nKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT4ge1xuICAgICAgcmV0dXJuIGNvbnZlcnNhdGlvbnMuZmlsdGVyKFxuICAgICAgICBjb252ZXJzYXRpb24gPT4gY29udmVyc2F0aW9uLmN1c3RvbUNvbG9ySWQgPT09IGNvbG9ySWRcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWlzc2luZ1JlcXVpcmVkUHJvZmlsZVNoYXJpbmcoXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGRvZXNDb252ZXJzYXRpb25SZXF1aXJlSXQgPVxuICAgICFjb252ZXJzYXRpb24uaXNNZSAmJlxuICAgICFjb252ZXJzYXRpb24ubGVmdCAmJlxuICAgIChpc0dyb3VwVjEoY29udmVyc2F0aW9uKSB8fCBpc0RpcmVjdENvbnZlcnNhdGlvbihjb252ZXJzYXRpb24pKTtcblxuICByZXR1cm4gQm9vbGVhbihcbiAgICBkb2VzQ29udmVyc2F0aW9uUmVxdWlyZUl0ICYmXG4gICAgICAhY29udmVyc2F0aW9uLnByb2ZpbGVTaGFyaW5nICYmXG4gICAgICB3aW5kb3cuU2lnbmFsLlJlbW90ZUNvbmZpZy5pc0VuYWJsZWQoJ2Rlc2t0b3AubWFuZGF0b3J5UHJvZmlsZVNoYXJpbmcnKSAmJlxuICAgICAgY29udmVyc2F0aW9uLm1lc3NhZ2VDb3VudCAmJlxuICAgICAgY29udmVyc2F0aW9uLm1lc3NhZ2VDb3VudCA+IDBcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldEdyb3VwQWRtaW5zU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIChjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGUpID0+IHtcbiAgICByZXR1cm4gKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGdyb3VwVmVyc2lvbixcbiAgICAgICAgbWVtYmVyc2hpcHMgPSBbXSxcbiAgICAgIH0gPSBjb252ZXJzYXRpb25TZWxlY3Rvcihjb252ZXJzYXRpb25JZCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWlzR3JvdXBWMih7XG4gICAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgICBncm91cFZlcnNpb24sXG4gICAgICAgIH0pXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhZG1pbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+ID0gW107XG4gICAgICBtZW1iZXJzaGlwcy5mb3JFYWNoKG1lbWJlcnNoaXAgPT4ge1xuICAgICAgICBpZiAobWVtYmVyc2hpcC5pc0FkbWluKSB7XG4gICAgICAgICAgY29uc3QgYWRtaW4gPSBjb252ZXJzYXRpb25TZWxlY3RvcihtZW1iZXJzaGlwLnV1aWQpO1xuICAgICAgICAgIGFkbWlucy5wdXNoKGFkbWluKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWRtaW5zO1xuICAgIH07XG4gIH1cbik7XG5cbmNvbnN0IGdldENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbkRhdGEgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9ucyxcbiAgKFxuICAgIGNvbnZlcnNhdGlvbnM6IFJlYWRvbmx5PENvbnZlcnNhdGlvbnNTdGF0ZVR5cGU+XG4gICk6IFJlY29yZDxzdHJpbmcsIENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbkRhdGE+ID0+XG4gICAgY29udmVyc2F0aW9ucy52ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb25cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25JZHNTdG9wcGVkRm9yVmVyaWZpY2F0aW9uID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbkRhdGEsXG4gICh2ZXJpZmljYXRpb25EYXRhQnlDb252ZXJzYXRpb24pOiBBcnJheTxzdHJpbmc+ID0+XG4gICAgT2JqZWN0LmtleXModmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uKVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbnNTdG9wcGVkRm9yVmVyaWZpY2F0aW9uID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvbkJ5SWRTZWxlY3RvcixcbiAgZ2V0Q29udmVyc2F0aW9uSWRzU3RvcHBlZEZvclZlcmlmaWNhdGlvbixcbiAgKFxuICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yOiAoaWQ6IHN0cmluZykgPT4gdW5kZWZpbmVkIHwgQ29udmVyc2F0aW9uVHlwZSxcbiAgICBjb252ZXJzYXRpb25JZHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICApOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9ucyA9IGNvbnZlcnNhdGlvbklkc1xuICAgICAgLm1hcChjb252ZXJzYXRpb25JZCA9PiBjb252ZXJzYXRpb25TZWxlY3Rvcihjb252ZXJzYXRpb25JZCkpXG4gICAgICAuZmlsdGVyKGlzTm90TmlsKTtcbiAgICByZXR1cm4gc29ydEJ5VGl0bGUoY29udmVyc2F0aW9ucyk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25VdWlkc1N0b3BwaW5nU2VuZCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDb252ZXJzYXRpb25WZXJpZmljYXRpb25EYXRhLFxuICAocGVuZGluZ0RhdGEpOiBBcnJheTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBPYmplY3QudmFsdWVzKHBlbmRpbmdEYXRhKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuUGVuZGluZ1ZlcmlmaWNhdGlvbikge1xuICAgICAgICBpdGVtLnV1aWRzTmVlZGluZ1ZlcmlmaWNhdGlvbi5mb3JFYWNoKGNvbnZlcnNhdGlvbklkID0+IHtcbiAgICAgICAgICByZXN1bHQuYWRkKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocmVzdWx0KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIGdldENvbnZlcnNhdGlvblV1aWRzU3RvcHBpbmdTZW5kLFxuICAoXG4gICAgY29udmVyc2F0aW9uU2VsZWN0b3I6IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlLFxuICAgIHV1aWRzOiBSZWFkb25seUFycmF5PHN0cmluZz5cbiAgKTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSB1dWlkcy5tYXAodXVpZCA9PiBjb252ZXJzYXRpb25TZWxlY3Rvcih1dWlkKSk7XG4gICAgcmV0dXJuIHNvcnRCeVRpdGxlKGNvbnZlcnNhdGlvbnMpO1xuICB9XG4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxzQkFBcUI7QUFDckIsb0JBQXlCO0FBQ3pCLHNCQUErQjtBQWUvQixnQ0FJTztBQUNQLG9CQUF1QjtBQUN2QixzQkFBeUI7QUFFekIsK0JBQWtDO0FBR2xDLG9CQUF1QjtBQUN2Qix3Q0FBMkM7QUFDM0Msd0NBQW1EO0FBRW5ELG9CQUFrQztBQUdsQyxnQ0FBbUM7QUFDbkMsa0NBQW1DO0FBQ25DLHlCQUE0QjtBQUM1QixvQ0FJTztBQUVQLGtCQU9PO0FBQ1AsbUJBQXlDO0FBQ3pDLHFCQUFrQztBQUVsQyxxQkFBK0M7QUFFL0Msc0JBQW1DO0FBQ25DLFVBQXFCO0FBQ3JCLDBCQUE0QztBQUU1QyxJQUFJO0FBQ0csTUFBTSx3QkFBd0Is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
