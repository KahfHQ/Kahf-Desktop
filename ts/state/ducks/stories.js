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
var stories_exports = {};
__export(stories_exports, {
  RESOLVE_ATTACHMENT_URL: () => RESOLVE_ATTACHMENT_URL,
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer,
  useStoriesActions: () => useStoriesActions
});
module.exports = __toCommonJS(stories_exports);
var import_lodash = require("lodash");
var log = __toESM(require("../../logging/log"));
var import_Client = __toESM(require("../../sql/Client"));
var import_durations = require("../../util/durations");
var import_MessageReadStatus = require("../../messages/MessageReadStatus");
var import_Stories = require("../../types/Stories");
var import_messageReceiverEvents = require("../../textsecure/messageReceiverEvents");
var import_ToastReactionFailed = require("../../components/ToastReactionFailed");
var import_enqueueReactionForSend = require("../../reactions/enqueueReactionForSend");
var import_getMessageById = require("../../messages/getMessageById");
var import_MessageUpdater = require("../../services/MessageUpdater");
var import_queueAttachmentDownloads = require("../../util/queueAttachmentDownloads");
var import_replaceIndex = require("../../util/replaceIndex");
var import_sendDeleteForEveryoneMessage = require("../../util/sendDeleteForEveryoneMessage");
var import_showToast = require("../../util/showToast");
var import_Attachment = require("../../types/Attachment");
var import_conversations = require("../selectors/conversations");
var import_getSendOptions = require("../../util/getSendOptions");
var import_stories = require("../selectors/stories");
var import_storyLoader = require("../../services/storyLoader");
var import_whatTypeOfConversation = require("../../util/whatTypeOfConversation");
var import_isNotNil = require("../../util/isNotNil");
var import_helpers = require("../../messages/helpers");
var import_onStoryRecipientUpdate = require("../../util/onStoryRecipientUpdate");
var import_sendStoryMessage = require("../../util/sendStoryMessage");
var import_useBoundActions = require("../../hooks/useBoundActions");
var import_viewSyncJobQueue = require("../../jobs/viewSyncJobQueue");
var import_viewedReceiptsJobQueue = require("../../jobs/viewedReceiptsJobQueue");
const DOE_STORY = "stories/DOE";
const LOAD_STORY_REPLIES = "stories/LOAD_STORY_REPLIES";
const MARK_STORY_READ = "stories/MARK_STORY_READ";
const REPLY_TO_STORY = "stories/REPLY_TO_STORY";
const RESOLVE_ATTACHMENT_URL = "stories/RESOLVE_ATTACHMENT_URL";
const STORY_CHANGED = "stories/STORY_CHANGED";
const TOGGLE_VIEW = "stories/TOGGLE_VIEW";
const VIEW_STORY = "stories/VIEW_STORY";
function deleteStoryForEveryone(story) {
  return async (dispatch, getState) => {
    if (!story.sendState) {
      return;
    }
    const conversationIds = new Set(story.sendState.map(({ recipient }) => recipient.id));
    const updatedStoryRecipients = /* @__PURE__ */ new Map();
    const ourConversation = window.ConversationController.getOurConversationOrThrow();
    conversationIds.delete(ourConversation.id);
    const { stories } = getState().stories;
    stories.forEach((item) => {
      const { sendStateByConversationId } = item;
      if (item.timestamp !== story.timestamp || item.messageId === story.messageId || item.deletedForEveryone || !sendStateByConversationId) {
        return;
      }
      Object.keys(sendStateByConversationId).forEach((conversationId) => {
        if (conversationId === ourConversation.id) {
          return;
        }
        const destinationUuid = window.ConversationController.get(conversationId)?.get("uuid");
        if (!destinationUuid) {
          return;
        }
        const distributionListIds = updatedStoryRecipients.get(destinationUuid)?.distributionListIds || /* @__PURE__ */ new Set();
        updatedStoryRecipients.set(destinationUuid, {
          distributionListIds: item.storyDistributionListId ? /* @__PURE__ */ new Set([...distributionListIds, item.storyDistributionListId]) : distributionListIds,
          isAllowedToReply: sendStateByConversationId[conversationId].isAllowedToReplyToStory !== false
        });
        conversationIds.delete(conversationId);
      });
    });
    conversationIds.forEach((cid) => {
      if (cid === ourConversation.id) {
        return;
      }
      const conversation = window.ConversationController.get(cid);
      if (!conversation) {
        return;
      }
      (0, import_sendDeleteForEveryoneMessage.sendDeleteForEveryoneMessage)(conversation.attributes, {
        deleteForEveryoneDuration: import_durations.DAY,
        id: story.messageId,
        timestamp: story.timestamp
      });
    });
    if (!updatedStoryRecipients.size) {
      story.sendState.forEach((item) => {
        if (item.recipient.id === ourConversation.id) {
          return;
        }
        const destinationUuid = window.ConversationController.get(item.recipient.id)?.get("uuid");
        if (!destinationUuid) {
          return;
        }
        updatedStoryRecipients.set(destinationUuid, {
          distributionListIds: /* @__PURE__ */ new Set(),
          isAllowedToReply: item.isAllowedToReplyToStory !== false
        });
      });
    }
    const sender = window.textsecure.messaging;
    if (sender) {
      const options = await (0, import_getSendOptions.getSendOptions)(ourConversation.attributes, {
        syncMessage: true
      });
      const storyMessageRecipients = [];
      updatedStoryRecipients.forEach((recipientData, destinationUuid2) => {
        storyMessageRecipients.push({
          destinationUuid: destinationUuid2,
          distributionListIds: Array.from(recipientData.distributionListIds),
          isAllowedToReply: recipientData.isAllowedToReply
        });
      });
      const destinationUuid = ourConversation.get("uuid");
      if (!destinationUuid) {
        return;
      }
      sender.sendSyncMessage({
        destination: void 0,
        destinationUuid,
        storyMessageRecipients,
        expirationStartTimestamp: null,
        isUpdate: true,
        options,
        timestamp: story.timestamp,
        urgent: false
      });
      const ev = new import_messageReceiverEvents.StoryRecipientUpdateEvent({
        destinationUuid,
        timestamp: story.timestamp,
        storyMessageRecipients
      }, import_lodash.noop);
      (0, import_onStoryRecipientUpdate.onStoryRecipientUpdate)(ev);
    }
    dispatch({
      type: DOE_STORY,
      payload: story.messageId
    });
  };
}
function loadStoryReplies(conversationId, messageId) {
  return async (dispatch, getState) => {
    const conversation = (0, import_conversations.getConversationSelector)(getState())(conversationId);
    const replies = await import_Client.default.getOlderMessagesByConversation(conversationId, { limit: 9e3, storyId: messageId, isGroup: (0, import_whatTypeOfConversation.isGroup)(conversation) });
    dispatch({
      type: LOAD_STORY_REPLIES,
      payload: {
        messageId,
        replies
      }
    });
  };
}
function markStoryRead(messageId) {
  return async (dispatch, getState) => {
    const { stories } = getState().stories;
    const matchingStory = stories.find((story) => story.messageId === messageId);
    if (!matchingStory) {
      log.warn(`markStoryRead: no matching story found: ${messageId}`);
      return;
    }
    if (!(0, import_Attachment.isDownloaded)(matchingStory.attachment) && !(0, import_Attachment.hasFailed)(matchingStory.attachment)) {
      return;
    }
    if (matchingStory.readStatus !== import_MessageReadStatus.ReadStatus.Unread) {
      return;
    }
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      return;
    }
    const storyReadDate = Date.now();
    (0, import_MessageUpdater.markViewed)(message.attributes, storyReadDate);
    const viewedReceipt = {
      messageId,
      senderE164: message.attributes.source,
      senderUuid: message.attributes.sourceUuid,
      timestamp: message.attributes.sent_at
    };
    const viewSyncs = [viewedReceipt];
    if (!window.ConversationController.areWePrimaryDevice()) {
      import_viewSyncJobQueue.viewSyncJobQueue.add({ viewSyncs });
    }
    import_viewedReceiptsJobQueue.viewedReceiptsJobQueue.add({ viewedReceipt });
    await import_Client.default.addNewStoryRead({
      authorId: message.attributes.sourceUuid,
      conversationId: message.attributes.conversationId,
      storyId: messageId,
      storyReadDate
    });
    dispatch({
      type: MARK_STORY_READ,
      payload: messageId
    });
  };
}
function queueStoryDownload(storyId) {
  return async (dispatch, getState) => {
    const { stories } = getState().stories;
    const story = stories.find((item) => item.messageId === storyId);
    if (!story) {
      return;
    }
    const { attachment } = story;
    if (!attachment) {
      log.warn("queueStoryDownload: No attachment found for story", {
        storyId
      });
      return;
    }
    if ((0, import_Attachment.hasFailed)(attachment)) {
      return;
    }
    if ((0, import_Attachment.isDownloaded)(attachment)) {
      if (!attachment.path) {
        return;
      }
      if ((0, import_Attachment.hasNotResolved)(attachment)) {
        dispatch({
          type: RESOLVE_ATTACHMENT_URL,
          payload: {
            messageId: storyId,
            attachmentUrl: window.Signal.Migrations.getAbsoluteAttachmentPath(attachment.path)
          }
        });
      }
      return;
    }
    if ((0, import_Attachment.isDownloading)(attachment)) {
      return;
    }
    const message = await (0, import_getMessageById.getMessageById)(storyId);
    if (message) {
      message.set({ storyReplyContext: void 0 });
      await (0, import_queueAttachmentDownloads.queueAttachmentDownloads)(message.attributes);
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function reactToStory(nextReaction, messageId) {
  return async (dispatch) => {
    try {
      await (0, import_enqueueReactionForSend.enqueueReactionForSend)({
        messageId,
        emoji: nextReaction,
        remove: false
      });
    } catch (error) {
      log.error("Error enqueuing reaction", error, messageId, nextReaction);
      (0, import_showToast.showToast)(import_ToastReactionFailed.ToastReactionFailed);
    }
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function replyToStory(conversationId, messageBody, mentions, timestamp, story) {
  return async (dispatch) => {
    const conversation = window.ConversationController.get(conversationId);
    if (!conversation) {
      log.error("replyToStory: conversation does not exist", conversationId);
      return;
    }
    const messageAttributes = await conversation.enqueueMessageForSend({
      body: messageBody,
      attachments: [],
      mentions
    }, {
      storyId: story.messageId,
      timestamp
    });
    if (messageAttributes) {
      dispatch({
        type: REPLY_TO_STORY,
        payload: messageAttributes
      });
    }
  };
}
function sendStoryMessage(listIds, conversationIds, attachment) {
  return async (dispatch) => {
    await (0, import_sendStoryMessage.sendStoryMessage)(listIds, conversationIds, attachment);
    dispatch({
      type: "NOOP",
      payload: null
    });
  };
}
function storyChanged(story) {
  return {
    type: STORY_CHANGED,
    payload: story
  };
}
function toggleStoriesView() {
  return {
    type: TOGGLE_VIEW
  };
}
const getSelectedStoryDataForConversationId = /* @__PURE__ */ __name((dispatch, getState, conversationId, selectedStoryId) => {
  const state = getState();
  const { stories } = state.stories;
  const storiesByConversationId = stories.filter((item) => item.conversationId === conversationId && !item.deletedForEveryone);
  let currentIndex = 0;
  let hasUnread = false;
  storiesByConversationId.forEach((item, index) => {
    if (selectedStoryId && item.messageId === selectedStoryId) {
      currentIndex = index;
    }
    if (!selectedStoryId && !currentIndex && item.readStatus === import_MessageReadStatus.ReadStatus.Unread) {
      hasUnread = true;
      currentIndex = index;
    }
  });
  const numStories = storiesByConversationId.length;
  storiesByConversationId.forEach((item) => {
    if ((0, import_Attachment.isDownloaded)(item.attachment) || (0, import_Attachment.isDownloading)(item.attachment)) {
      return;
    }
    queueStoryDownload(item.messageId)(dispatch, getState, null);
  });
  return {
    currentIndex,
    hasUnread,
    numStories,
    storiesByConversationId
  };
}, "getSelectedStoryDataForConversationId");
function viewUserStories(conversationId, shouldShowDetailsModal = false) {
  return (dispatch, getState) => {
    const { currentIndex, hasUnread, numStories, storiesByConversationId } = getSelectedStoryDataForConversationId(dispatch, getState, conversationId);
    const story = storiesByConversationId[currentIndex];
    dispatch({
      type: VIEW_STORY,
      payload: {
        selectedStoryData: {
          currentIndex,
          messageId: story.messageId,
          numStories,
          shouldShowDetailsModal
        },
        storyViewMode: hasUnread ? import_Stories.StoryViewModeType.Unread : import_Stories.StoryViewModeType.All
      }
    });
  };
}
const viewStory = /* @__PURE__ */ __name(({
  closeViewer,
  shouldShowDetailsModal = false,
  storyId,
  storyViewMode,
  viewDirection
}) => {
  return (dispatch, getState) => {
    if (closeViewer || !storyId || !storyViewMode) {
      dispatch({
        type: VIEW_STORY,
        payload: void 0
      });
      return;
    }
    const state = getState();
    const { stories } = state.stories;
    const story = stories.find((item) => item.messageId === storyId && !item.deletedForEveryone);
    if (!story) {
      return;
    }
    const { currentIndex, numStories, storiesByConversationId } = getSelectedStoryDataForConversationId(dispatch, getState, story.conversationId, storyId);
    if (!viewDirection) {
      dispatch({
        type: VIEW_STORY,
        payload: {
          selectedStoryData: {
            currentIndex,
            messageId: storyId,
            numStories,
            shouldShowDetailsModal
          },
          storyViewMode
        }
      });
      return;
    }
    if (viewDirection === import_Stories.StoryViewDirectionType.Next && currentIndex < numStories - 1) {
      const nextIndex = currentIndex + 1;
      const nextStory = storiesByConversationId[nextIndex];
      dispatch({
        type: VIEW_STORY,
        payload: {
          selectedStoryData: {
            currentIndex: nextIndex,
            messageId: nextStory.messageId,
            numStories,
            shouldShowDetailsModal: false
          },
          storyViewMode
        }
      });
      return;
    }
    if (viewDirection === import_Stories.StoryViewDirectionType.Previous && currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      const nextStory = storiesByConversationId[nextIndex];
      dispatch({
        type: VIEW_STORY,
        payload: {
          selectedStoryData: {
            currentIndex: nextIndex,
            messageId: nextStory.messageId,
            numStories,
            shouldShowDetailsModal: false
          },
          storyViewMode
        }
      });
      return;
    }
    if (viewDirection === import_Stories.StoryViewDirectionType.Next) {
      const unreadStory = stories.find((item) => item.readStatus === import_MessageReadStatus.ReadStatus.Unread && !item.deletedForEveryone);
      if (unreadStory) {
        const nextSelectedStoryData = getSelectedStoryDataForConversationId(dispatch, getState, unreadStory.conversationId, unreadStory.messageId);
        dispatch({
          type: VIEW_STORY,
          payload: {
            selectedStoryData: {
              currentIndex: nextSelectedStoryData.currentIndex,
              messageId: unreadStory.messageId,
              numStories: nextSelectedStoryData.numStories,
              shouldShowDetailsModal: false
            },
            storyViewMode
          }
        });
        return;
      }
    }
    const conversationStories = (0, import_stories.getStories)(state).stories;
    const conversationStoryIndex = conversationStories.findIndex((item) => item.conversationId === story.conversationId);
    if (conversationStoryIndex < 0) {
      return;
    }
    if (viewDirection === import_Stories.StoryViewDirectionType.Next && conversationStoryIndex < conversationStories.length - 1) {
      const nextConversationStoryIndex = conversationStoryIndex + 1;
      const conversationStory = conversationStories[nextConversationStoryIndex];
      const nextSelectedStoryData = getSelectedStoryDataForConversationId(dispatch, getState, conversationStory.conversationId);
      if (!nextSelectedStoryData.hasUnread && storyViewMode === import_Stories.StoryViewModeType.Unread) {
        dispatch({
          type: VIEW_STORY,
          payload: void 0
        });
        return;
      }
      dispatch({
        type: VIEW_STORY,
        payload: {
          selectedStoryData: {
            currentIndex: 0,
            messageId: nextSelectedStoryData.storiesByConversationId[0].messageId,
            numStories: nextSelectedStoryData.numStories,
            shouldShowDetailsModal: false
          },
          storyViewMode
        }
      });
      return;
    }
    if (viewDirection === import_Stories.StoryViewDirectionType.Previous && conversationStoryIndex > 0) {
      const nextConversationStoryIndex = conversationStoryIndex - 1;
      const conversationStory = conversationStories[nextConversationStoryIndex];
      const nextSelectedStoryData = getSelectedStoryDataForConversationId(dispatch, getState, conversationStory.conversationId);
      dispatch({
        type: VIEW_STORY,
        payload: {
          selectedStoryData: {
            currentIndex: 0,
            messageId: nextSelectedStoryData.storiesByConversationId[0].messageId,
            numStories: nextSelectedStoryData.numStories,
            shouldShowDetailsModal: false
          },
          storyViewMode
        }
      });
      return;
    }
    dispatch({
      type: VIEW_STORY,
      payload: void 0
    });
  };
}, "viewStory");
const actions = {
  deleteStoryForEveryone,
  loadStoryReplies,
  markStoryRead,
  queueStoryDownload,
  reactToStory,
  replyToStory,
  sendStoryMessage,
  storyChanged,
  toggleStoriesView,
  viewUserStories,
  viewStory
};
const useStoriesActions = /* @__PURE__ */ __name(() => (0, import_useBoundActions.useBoundActions)(actions), "useStoriesActions");
function getEmptyState(overrideState = {}) {
  return {
    isShowingStoriesView: false,
    stories: [],
    ...overrideState
  };
}
function reducer(state = getEmptyState(), action) {
  if (action.type === TOGGLE_VIEW) {
    return {
      ...state,
      isShowingStoriesView: !state.isShowingStoriesView,
      selectedStoryData: state.isShowingStoriesView ? void 0 : state.selectedStoryData,
      storyViewMode: state.isShowingStoriesView ? void 0 : state.storyViewMode
    };
  }
  if (action.type === "MESSAGE_DELETED") {
    const nextStories = state.stories.filter((story) => story.messageId !== action.payload.id);
    if (nextStories.length === state.stories.length) {
      return state;
    }
    return {
      ...state,
      stories: nextStories
    };
  }
  if (action.type === STORY_CHANGED) {
    const newStory = (0, import_lodash.pick)(action.payload, [
      "attachment",
      "canReplyToStory",
      "conversationId",
      "deletedForEveryone",
      "messageId",
      "reactions",
      "readStatus",
      "sendStateByConversationId",
      "source",
      "sourceUuid",
      "storyDistributionListId",
      "timestamp",
      "type"
    ]);
    const prevStoryIndex = state.stories.findIndex((existingStory) => existingStory.messageId === newStory.messageId);
    if (prevStoryIndex >= 0) {
      const prevStory = state.stories[prevStoryIndex];
      const isDownloadingAttachment = (0, import_Attachment.isDownloading)(newStory.attachment);
      const hasAttachmentDownloaded = !(0, import_Attachment.isDownloaded)(prevStory.attachment) && (0, import_Attachment.isDownloaded)(newStory.attachment);
      const hasAttachmentFailed = (0, import_Attachment.hasFailed)(newStory.attachment) && !(0, import_Attachment.hasFailed)(prevStory.attachment);
      const readStatusChanged = prevStory.readStatus !== newStory.readStatus;
      const reactionsChanged = prevStory.reactions?.length !== newStory.reactions?.length;
      const hasBeenDeleted = !prevStory.deletedForEveryone && newStory.deletedForEveryone;
      const hasSendStateChanged = !(0, import_lodash.isEqual)(prevStory.sendStateByConversationId, newStory.sendStateByConversationId);
      const shouldReplace = isDownloadingAttachment || hasAttachmentDownloaded || hasAttachmentFailed || hasBeenDeleted || hasSendStateChanged || readStatusChanged || reactionsChanged;
      if (!shouldReplace) {
        return state;
      }
      if (hasBeenDeleted) {
        return {
          ...state,
          stories: state.stories.filter((existingStory) => existingStory.messageId !== newStory.messageId)
        };
      }
      return {
        ...state,
        stories: (0, import_replaceIndex.replaceIndex)(state.stories, prevStoryIndex, newStory)
      };
    }
    const stories = [...state.stories, newStory].sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
    return {
      ...state,
      stories
    };
  }
  if (action.type === MARK_STORY_READ) {
    return {
      ...state,
      stories: state.stories.map((story) => {
        if (story.messageId === action.payload) {
          return {
            ...story,
            readStatus: import_MessageReadStatus.ReadStatus.Viewed
          };
        }
        return story;
      })
    };
  }
  if (action.type === LOAD_STORY_REPLIES) {
    return {
      ...state,
      replyState: action.payload
    };
  }
  if (action.type === "MESSAGES_ADDED" && action.payload.isJustSent) {
    const stories = action.payload.messages.filter(import_helpers.isStory);
    if (!stories.length) {
      return state;
    }
    const newStories = stories.map((messageAttrs) => (0, import_storyLoader.getStoryDataFromMessageAttributes)(messageAttrs)).filter(import_isNotNil.isNotNil);
    if (!newStories.length) {
      return state;
    }
    return {
      ...state,
      stories: [...state.stories, ...newStories]
    };
  }
  if (action.type === "MESSAGE_CHANGED" && state.replyState && state.replyState.messageId === action.payload.data.storyId) {
    const { replyState } = state;
    const messageIndex = replyState.replies.findIndex((reply) => reply.id === action.payload.id);
    if (messageIndex < 0) {
      return {
        ...state,
        replyState: {
          messageId: replyState.messageId,
          replies: [...replyState.replies, action.payload.data]
        }
      };
    }
    return {
      ...state,
      replyState: {
        messageId: replyState.messageId,
        replies: (0, import_replaceIndex.replaceIndex)(replyState.replies, messageIndex, action.payload.data)
      }
    };
  }
  if (action.type === REPLY_TO_STORY) {
    const { replyState } = state;
    if (!replyState) {
      return state;
    }
    return {
      ...state,
      replyState: {
        messageId: replyState.messageId,
        replies: [...replyState.replies, action.payload]
      }
    };
  }
  if (action.type === RESOLVE_ATTACHMENT_URL) {
    const { messageId, attachmentUrl } = action.payload;
    const storyIndex = state.stories.findIndex((existingStory) => existingStory.messageId === messageId);
    if (storyIndex < 0) {
      return state;
    }
    const story = state.stories[storyIndex];
    if (!story.attachment) {
      return state;
    }
    const storyWithResolvedAttachment = {
      ...story,
      attachment: {
        ...story.attachment,
        url: attachmentUrl
      }
    };
    return {
      ...state,
      stories: (0, import_replaceIndex.replaceIndex)(state.stories, storyIndex, storyWithResolvedAttachment)
    };
  }
  if (action.type === DOE_STORY) {
    return {
      ...state,
      stories: state.stories.filter((existingStory) => existingStory.messageId !== action.payload)
    };
  }
  if (action.type === VIEW_STORY) {
    const { selectedStoryData, storyViewMode } = action.payload || {};
    return {
      ...state,
      selectedStoryData,
      storyViewMode
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RESOLVE_ATTACHMENT_URL,
  actions,
  getEmptyState,
  reducer,
  useStoriesActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3Rvcmllcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFRodW5rQWN0aW9uLCBUaHVua0Rpc3BhdGNoIH0gZnJvbSAncmVkdXgtdGh1bmsnO1xuaW1wb3J0IHsgaXNFcXVhbCwgbm9vcCwgcGljayB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdHlwZSB7IEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgdHlwZSB7IEJvZHlSYW5nZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi4vLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7XG4gIE1lc3NhZ2VDaGFuZ2VkQWN0aW9uVHlwZSxcbiAgTWVzc2FnZURlbGV0ZWRBY3Rpb25UeXBlLFxuICBNZXNzYWdlc0FkZGVkQWN0aW9uVHlwZSxcbn0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTm9vcEFjdGlvblR5cGUgfSBmcm9tICcuL25vb3AnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgYXMgUm9vdFN0YXRlVHlwZSB9IGZyb20gJy4uL3JlZHVjZXInO1xuaW1wb3J0IHR5cGUgeyBTdG9yeVZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgdHlwZSB7IFN5bmNUeXBlIH0gZnJvbSAnLi4vLi4vam9icy9oZWxwZXJzL3N5bmNIZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgZGF0YUludGVyZmFjZSBmcm9tICcuLi8uLi9zcWwvQ2xpZW50JztcbmltcG9ydCB7IERBWSB9IGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi8uLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBTdG9yeVZpZXdEaXJlY3Rpb25UeXBlLCBTdG9yeVZpZXdNb2RlVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgU3RvcnlSZWNpcGllbnRVcGRhdGVFdmVudCB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvbWVzc2FnZVJlY2VpdmVyRXZlbnRzJztcbmltcG9ydCB7IFRvYXN0UmVhY3Rpb25GYWlsZWQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1RvYXN0UmVhY3Rpb25GYWlsZWQnO1xuaW1wb3J0IHsgZW5xdWV1ZVJlYWN0aW9uRm9yU2VuZCB9IGZyb20gJy4uLy4uL3JlYWN0aW9ucy9lbnF1ZXVlUmVhY3Rpb25Gb3JTZW5kJztcbmltcG9ydCB7IGdldE1lc3NhZ2VCeUlkIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvZ2V0TWVzc2FnZUJ5SWQnO1xuaW1wb3J0IHsgbWFya1ZpZXdlZCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL01lc3NhZ2VVcGRhdGVyJztcbmltcG9ydCB7IHF1ZXVlQXR0YWNobWVudERvd25sb2FkcyB9IGZyb20gJy4uLy4uL3V0aWwvcXVldWVBdHRhY2htZW50RG93bmxvYWRzJztcbmltcG9ydCB7IHJlcGxhY2VJbmRleCB9IGZyb20gJy4uLy4uL3V0aWwvcmVwbGFjZUluZGV4JztcbmltcG9ydCB7IHNlbmREZWxldGVGb3JFdmVyeW9uZU1lc3NhZ2UgfSBmcm9tICcuLi8uLi91dGlsL3NlbmREZWxldGVGb3JFdmVyeW9uZU1lc3NhZ2UnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vLi4vdXRpbC9zaG93VG9hc3QnO1xuaW1wb3J0IHtcbiAgaGFzRmFpbGVkLFxuICBoYXNOb3RSZXNvbHZlZCxcbiAgaXNEb3dubG9hZGVkLFxuICBpc0Rvd25sb2FkaW5nLFxufSBmcm9tICcuLi8uLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvblNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgZ2V0U2VuZE9wdGlvbnMgfSBmcm9tICcuLi8uLi91dGlsL2dldFNlbmRPcHRpb25zJztcbmltcG9ydCB7IGdldFN0b3JpZXMgfSBmcm9tICcuLi9zZWxlY3RvcnMvc3Rvcmllcyc7XG5pbXBvcnQgeyBnZXRTdG9yeURhdGFGcm9tTWVzc2FnZUF0dHJpYnV0ZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zdG9yeUxvYWRlcic7XG5pbXBvcnQgeyBpc0dyb3VwIH0gZnJvbSAnLi4vLi4vdXRpbC93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vLi4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBpc1N0b3J5IH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvaGVscGVycyc7XG5pbXBvcnQgeyBvblN0b3J5UmVjaXBpZW50VXBkYXRlIH0gZnJvbSAnLi4vLi4vdXRpbC9vblN0b3J5UmVjaXBpZW50VXBkYXRlJztcbmltcG9ydCB7IHNlbmRTdG9yeU1lc3NhZ2UgYXMgZG9TZW5kU3RvcnlNZXNzYWdlIH0gZnJvbSAnLi4vLi4vdXRpbC9zZW5kU3RvcnlNZXNzYWdlJztcbmltcG9ydCB7IHVzZUJvdW5kQWN0aW9ucyB9IGZyb20gJy4uLy4uL2hvb2tzL3VzZUJvdW5kQWN0aW9ucyc7XG5pbXBvcnQgeyB2aWV3U3luY0pvYlF1ZXVlIH0gZnJvbSAnLi4vLi4vam9icy92aWV3U3luY0pvYlF1ZXVlJztcbmltcG9ydCB7IHZpZXdlZFJlY2VpcHRzSm9iUXVldWUgfSBmcm9tICcuLi8uLi9qb2JzL3ZpZXdlZFJlY2VpcHRzSm9iUXVldWUnO1xuXG5leHBvcnQgdHlwZSBTdG9yeURhdGFUeXBlID0ge1xuICBhdHRhY2htZW50PzogQXR0YWNobWVudFR5cGU7XG4gIG1lc3NhZ2VJZDogc3RyaW5nO1xufSAmIFBpY2s8XG4gIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgfCAnY2FuUmVwbHlUb1N0b3J5J1xuICB8ICdjb252ZXJzYXRpb25JZCdcbiAgfCAnZGVsZXRlZEZvckV2ZXJ5b25lJ1xuICB8ICdyZWFjdGlvbnMnXG4gIHwgJ3JlYWRTdGF0dXMnXG4gIHwgJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnXG4gIHwgJ3NvdXJjZSdcbiAgfCAnc291cmNlVXVpZCdcbiAgfCAnc3RvcnlEaXN0cmlidXRpb25MaXN0SWQnXG4gIHwgJ3RpbWVzdGFtcCdcbiAgfCAndHlwZSdcbj47XG5cbmV4cG9ydCB0eXBlIFNlbGVjdGVkU3RvcnlEYXRhVHlwZSA9IHtcbiAgY3VycmVudEluZGV4OiBudW1iZXI7XG4gIG1lc3NhZ2VJZDogc3RyaW5nO1xuICBudW1TdG9yaWVzOiBudW1iZXI7XG4gIHNob3VsZFNob3dEZXRhaWxzTW9kYWw6IGJvb2xlYW47XG59O1xuXG4vLyBTdGF0ZVxuXG5leHBvcnQgdHlwZSBTdG9yaWVzU3RhdGVUeXBlID0ge1xuICByZWFkb25seSBpc1Nob3dpbmdTdG9yaWVzVmlldzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgcmVwbHlTdGF0ZT86IHtcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgICByZXBsaWVzOiBBcnJheTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+O1xuICB9O1xuICByZWFkb25seSBzZWxlY3RlZFN0b3J5RGF0YT86IFNlbGVjdGVkU3RvcnlEYXRhVHlwZTtcbiAgcmVhZG9ubHkgc3RvcmllczogQXJyYXk8U3RvcnlEYXRhVHlwZT47XG4gIHJlYWRvbmx5IHN0b3J5Vmlld01vZGU/OiBTdG9yeVZpZXdNb2RlVHlwZTtcbn07XG5cbi8vIEFjdGlvbnNcblxuY29uc3QgRE9FX1NUT1JZID0gJ3N0b3JpZXMvRE9FJztcbmNvbnN0IExPQURfU1RPUllfUkVQTElFUyA9ICdzdG9yaWVzL0xPQURfU1RPUllfUkVQTElFUyc7XG5jb25zdCBNQVJLX1NUT1JZX1JFQUQgPSAnc3Rvcmllcy9NQVJLX1NUT1JZX1JFQUQnO1xuY29uc3QgUkVQTFlfVE9fU1RPUlkgPSAnc3Rvcmllcy9SRVBMWV9UT19TVE9SWSc7XG5leHBvcnQgY29uc3QgUkVTT0xWRV9BVFRBQ0hNRU5UX1VSTCA9ICdzdG9yaWVzL1JFU09MVkVfQVRUQUNITUVOVF9VUkwnO1xuY29uc3QgU1RPUllfQ0hBTkdFRCA9ICdzdG9yaWVzL1NUT1JZX0NIQU5HRUQnO1xuY29uc3QgVE9HR0xFX1ZJRVcgPSAnc3Rvcmllcy9UT0dHTEVfVklFVyc7XG5jb25zdCBWSUVXX1NUT1JZID0gJ3N0b3JpZXMvVklFV19TVE9SWSc7XG5cbnR5cGUgRE9FU3RvcnlBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgRE9FX1NUT1JZO1xuICBwYXlsb2FkOiBzdHJpbmc7XG59O1xuXG50eXBlIExvYWRTdG9yeVJlcGxpZXNBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgTE9BRF9TVE9SWV9SRVBMSUVTO1xuICBwYXlsb2FkOiB7XG4gICAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gICAgcmVwbGllczogQXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPjtcbiAgfTtcbn07XG5cbnR5cGUgTWFya1N0b3J5UmVhZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBNQVJLX1NUT1JZX1JFQUQ7XG4gIHBheWxvYWQ6IHN0cmluZztcbn07XG5cbnR5cGUgUmVwbHlUb1N0b3J5QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFJFUExZX1RPX1NUT1JZO1xuICBwYXlsb2FkOiBNZXNzYWdlQXR0cmlidXRlc1R5cGU7XG59O1xuXG50eXBlIFJlc29sdmVBdHRhY2htZW50VXJsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFJFU09MVkVfQVRUQUNITUVOVF9VUkw7XG4gIHBheWxvYWQ6IHtcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgICBhdHRhY2htZW50VXJsOiBzdHJpbmc7XG4gIH07XG59O1xuXG50eXBlIFN0b3J5Q2hhbmdlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBTVE9SWV9DSEFOR0VEO1xuICBwYXlsb2FkOiBTdG9yeURhdGFUeXBlO1xufTtcblxudHlwZSBUb2dnbGVWaWV3QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFRPR0dMRV9WSUVXO1xufTtcblxudHlwZSBWaWV3U3RvcnlBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgVklFV19TVE9SWTtcbiAgcGF5bG9hZDpcbiAgICB8IHtcbiAgICAgICAgc2VsZWN0ZWRTdG9yeURhdGE6IFNlbGVjdGVkU3RvcnlEYXRhVHlwZTtcbiAgICAgICAgc3RvcnlWaWV3TW9kZTogU3RvcnlWaWV3TW9kZVR5cGU7XG4gICAgICB9XG4gICAgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBTdG9yaWVzQWN0aW9uVHlwZSA9XG4gIHwgRE9FU3RvcnlBY3Rpb25UeXBlXG4gIHwgTG9hZFN0b3J5UmVwbGllc0FjdGlvblR5cGVcbiAgfCBNYXJrU3RvcnlSZWFkQWN0aW9uVHlwZVxuICB8IE1lc3NhZ2VDaGFuZ2VkQWN0aW9uVHlwZVxuICB8IE1lc3NhZ2VEZWxldGVkQWN0aW9uVHlwZVxuICB8IE1lc3NhZ2VzQWRkZWRBY3Rpb25UeXBlXG4gIHwgUmVwbHlUb1N0b3J5QWN0aW9uVHlwZVxuICB8IFJlc29sdmVBdHRhY2htZW50VXJsQWN0aW9uVHlwZVxuICB8IFN0b3J5Q2hhbmdlZEFjdGlvblR5cGVcbiAgfCBUb2dnbGVWaWV3QWN0aW9uVHlwZVxuICB8IFZpZXdTdG9yeUFjdGlvblR5cGU7XG5cbi8vIEFjdGlvbiBDcmVhdG9yc1xuXG5mdW5jdGlvbiBkZWxldGVTdG9yeUZvckV2ZXJ5b25lKFxuICBzdG9yeTogU3RvcnlWaWV3VHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgRE9FU3RvcnlBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgaWYgKCFzdG9yeS5zZW5kU3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25JZHMgPSBuZXcgU2V0KFxuICAgICAgc3Rvcnkuc2VuZFN0YXRlLm1hcCgoeyByZWNpcGllbnQgfSkgPT4gcmVjaXBpZW50LmlkKVxuICAgICk7XG4gICAgY29uc3QgdXBkYXRlZFN0b3J5UmVjaXBpZW50cyA9IG5ldyBNYXA8XG4gICAgICBzdHJpbmcsXG4gICAgICB7XG4gICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RJZHM6IFNldDxzdHJpbmc+O1xuICAgICAgICBpc0FsbG93ZWRUb1JlcGx5OiBib29sZWFuO1xuICAgICAgfVxuICAgID4oKTtcblxuICAgIGNvbnN0IG91ckNvbnZlcnNhdGlvbiA9XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25PclRocm93KCk7XG5cbiAgICAvLyBSZW1vdmUgb3Vyc2VsdmVzIGZyb20gdGhlIERPRS5cbiAgICBjb252ZXJzYXRpb25JZHMuZGVsZXRlKG91ckNvbnZlcnNhdGlvbi5pZCk7XG5cbiAgICAvLyBGaW5kIHN0b3JpZXMgdGhhdCB3ZXJlIHNlbnQgdG8gb3RoZXIgZGlzdHJpYnV0aW9uIGxpc3RzIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAvLyBzZW5kIGEgRE9FIHJlcXVlc3QgdG8gdGhlIG1lbWJlcnMgb2YgdGhvc2UgbGlzdHMuXG4gICAgY29uc3QgeyBzdG9yaWVzIH0gPSBnZXRTdGF0ZSgpLnN0b3JpZXM7XG4gICAgc3Rvcmllcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgeyBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkIH0gPSBpdGVtO1xuICAgICAgLy8gV2Ugb25seSB3YW50IG1hdGNoaW5nIHRpbWVzdGFtcCBzdG9yaWVzIHdoaWNoIGFyZSBzdG9yaWVzIHRoYXQgd2VyZVxuICAgICAgLy8gc2VudCB0byBtdWx0aSBkaXN0cmlidXRpb24gbGlzdHMuXG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRoZSBzdG9yeSB3ZSBqdXN0IHBhc3NlZCBpbi5cbiAgICAgIC8vIERvbid0IG5lZWQgdG8gY2hlY2sgZm9yIHN0b3JpZXMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiBkZWxldGVkLlxuICAgICAgLy8gQW5kIG9ubHkgZm9yIHNlbnQgc3Rvcmllcywgbm90IGluY29taW5nLlxuICAgICAgaWYgKFxuICAgICAgICBpdGVtLnRpbWVzdGFtcCAhPT0gc3RvcnkudGltZXN0YW1wIHx8XG4gICAgICAgIGl0ZW0ubWVzc2FnZUlkID09PSBzdG9yeS5tZXNzYWdlSWQgfHxcbiAgICAgICAgaXRlbS5kZWxldGVkRm9yRXZlcnlvbmUgfHxcbiAgICAgICAgIXNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5rZXlzKHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQpLmZvckVhY2goY29udmVyc2F0aW9uSWQgPT4ge1xuICAgICAgICBpZiAoY29udmVyc2F0aW9uSWQgPT09IG91ckNvbnZlcnNhdGlvbi5pZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uVXVpZCA9XG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKT8uZ2V0KCd1dWlkJyk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblV1aWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaXN0cmlidXRpb25MaXN0SWRzID1cbiAgICAgICAgICB1cGRhdGVkU3RvcnlSZWNpcGllbnRzLmdldChkZXN0aW5hdGlvblV1aWQpPy5kaXN0cmlidXRpb25MaXN0SWRzIHx8XG4gICAgICAgICAgbmV3IFNldCgpO1xuXG4gICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgcmVtYWluaW5nIGRpc3RyaWJ1dGlvbiBsaXN0IGlkcyB0aGF0IHRoZSB1c2VyIGhhc1xuICAgICAgICAvLyBhY2Nlc3MgdG8uXG4gICAgICAgIHVwZGF0ZWRTdG9yeVJlY2lwaWVudHMuc2V0KGRlc3RpbmF0aW9uVXVpZCwge1xuICAgICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RJZHM6IGl0ZW0uc3RvcnlEaXN0cmlidXRpb25MaXN0SWRcbiAgICAgICAgICAgID8gbmV3IFNldChbLi4uZGlzdHJpYnV0aW9uTGlzdElkcywgaXRlbS5zdG9yeURpc3RyaWJ1dGlvbkxpc3RJZF0pXG4gICAgICAgICAgICA6IGRpc3RyaWJ1dGlvbkxpc3RJZHMsXG4gICAgICAgICAgaXNBbGxvd2VkVG9SZXBseTpcbiAgICAgICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRbY29udmVyc2F0aW9uSWRdXG4gICAgICAgICAgICAgIC5pc0FsbG93ZWRUb1JlcGx5VG9TdG9yeSAhPT0gZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIGNvbnZlcnNhdGlvbklkIHNvIHdlIGRvbid0IHNlbmQgdGhlIERPRSB0byB0aG9zZSB0aGF0XG4gICAgICAgIC8vIHN0aWxsIGhhdmUgYWNjZXNzLlxuICAgICAgICBjb252ZXJzYXRpb25JZHMuZGVsZXRlKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU2VuZCB0aGUgRE9FXG4gICAgY29udmVyc2F0aW9uSWRzLmZvckVhY2goY2lkID0+IHtcbiAgICAgIC8vIERvbid0IERPRSB5b3Vyc2VsZiFcbiAgICAgIGlmIChjaWQgPT09IG91ckNvbnZlcnNhdGlvbi5pZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjaWQpO1xuXG4gICAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbmREZWxldGVGb3JFdmVyeW9uZU1lc3NhZ2UoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgZGVsZXRlRm9yRXZlcnlvbmVEdXJhdGlvbjogREFZLFxuICAgICAgICBpZDogc3RvcnkubWVzc2FnZUlkLFxuICAgICAgICB0aW1lc3RhbXA6IHN0b3J5LnRpbWVzdGFtcCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgaXQncyB0aGUgbGFzdCBzdG9yeSBzZW50IHRvIGEgZGlzdHJpYnV0aW9uIGxpc3Qgd2UgZG9uJ3QgaGF2ZSB0byBzZW5kXG4gICAgLy8gdGhlIHN5bmMgbWVzc2FnZSwgYnV0IHRvIGJlIGNvbnNpc3RlbnQgbGV0J3MgYnVpbGQgdXAgdGhlIHVwZGF0ZWRcbiAgICAvLyBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzIGFuZCBzZW5kIHRoZSBzeW5jIG1lc3NhZ2UuXG4gICAgaWYgKCF1cGRhdGVkU3RvcnlSZWNpcGllbnRzLnNpemUpIHtcbiAgICAgIHN0b3J5LnNlbmRTdGF0ZS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoaXRlbS5yZWNpcGllbnQuaWQgPT09IG91ckNvbnZlcnNhdGlvbi5pZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uVXVpZCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChcbiAgICAgICAgICBpdGVtLnJlY2lwaWVudC5pZFxuICAgICAgICApPy5nZXQoJ3V1aWQnKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uVXVpZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZWRTdG9yeVJlY2lwaWVudHMuc2V0KGRlc3RpbmF0aW9uVXVpZCwge1xuICAgICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RJZHM6IG5ldyBTZXQoKSxcbiAgICAgICAgICBpc0FsbG93ZWRUb1JlcGx5OiBpdGVtLmlzQWxsb3dlZFRvUmVwbHlUb1N0b3J5ICE9PSBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSBzeW5jIG1lc3NhZ2Ugd2l0aCB0aGUgdXBkYXRlZCBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzIGxpc3RcbiAgICBjb25zdCBzZW5kZXIgPSB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmc7XG4gICAgaWYgKHNlbmRlcikge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IGdldFNlbmRPcHRpb25zKG91ckNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIHN5bmNNZXNzYWdlOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0b3J5TWVzc2FnZVJlY2lwaWVudHM6IEFycmF5PHtcbiAgICAgICAgZGVzdGluYXRpb25VdWlkOiBzdHJpbmc7XG4gICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RJZHM6IEFycmF5PHN0cmluZz47XG4gICAgICAgIGlzQWxsb3dlZFRvUmVwbHk6IGJvb2xlYW47XG4gICAgICB9PiA9IFtdO1xuXG4gICAgICB1cGRhdGVkU3RvcnlSZWNpcGllbnRzLmZvckVhY2goKHJlY2lwaWVudERhdGEsIGRlc3RpbmF0aW9uVXVpZCkgPT4ge1xuICAgICAgICBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzLnB1c2goe1xuICAgICAgICAgIGRlc3RpbmF0aW9uVXVpZCxcbiAgICAgICAgICBkaXN0cmlidXRpb25MaXN0SWRzOiBBcnJheS5mcm9tKHJlY2lwaWVudERhdGEuZGlzdHJpYnV0aW9uTGlzdElkcyksXG4gICAgICAgICAgaXNBbGxvd2VkVG9SZXBseTogcmVjaXBpZW50RGF0YS5pc0FsbG93ZWRUb1JlcGx5LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkZXN0aW5hdGlvblV1aWQgPSBvdXJDb252ZXJzYXRpb24uZ2V0KCd1dWlkJyk7XG5cbiAgICAgIGlmICghZGVzdGluYXRpb25VdWlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU3luYyBtZXNzYWdlIGZvciBvdGhlciBkZXZpY2VzXG4gICAgICBzZW5kZXIuc2VuZFN5bmNNZXNzYWdlKHtcbiAgICAgICAgZGVzdGluYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzdGluYXRpb25VdWlkLFxuICAgICAgICBzdG9yeU1lc3NhZ2VSZWNpcGllbnRzLFxuICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXA6IG51bGwsXG4gICAgICAgIGlzVXBkYXRlOiB0cnVlLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICB0aW1lc3RhbXA6IHN0b3J5LnRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTeW5jIG1lc3NhZ2UgZm9yIERlc2t0b3BcbiAgICAgIGNvbnN0IGV2ID0gbmV3IFN0b3J5UmVjaXBpZW50VXBkYXRlRXZlbnQoXG4gICAgICAgIHtcbiAgICAgICAgICBkZXN0aW5hdGlvblV1aWQsXG4gICAgICAgICAgdGltZXN0YW1wOiBzdG9yeS50aW1lc3RhbXAsXG4gICAgICAgICAgc3RvcnlNZXNzYWdlUmVjaXBpZW50cyxcbiAgICAgICAgfSxcbiAgICAgICAgbm9vcFxuICAgICAgKTtcbiAgICAgIG9uU3RvcnlSZWNpcGllbnRVcGRhdGUoZXYpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IERPRV9TVE9SWSxcbiAgICAgIHBheWxvYWQ6IHN0b3J5Lm1lc3NhZ2VJZCxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbG9hZFN0b3J5UmVwbGllcyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgbWVzc2FnZUlkOiBzdHJpbmdcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIExvYWRTdG9yeVJlcGxpZXNBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IoZ2V0U3RhdGUoKSkoY29udmVyc2F0aW9uSWQpO1xuICAgIGNvbnN0IHJlcGxpZXMgPSBhd2FpdCBkYXRhSW50ZXJmYWNlLmdldE9sZGVyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbihcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgeyBsaW1pdDogOTAwMCwgc3RvcnlJZDogbWVzc2FnZUlkLCBpc0dyb3VwOiBpc0dyb3VwKGNvbnZlcnNhdGlvbikgfVxuICAgICk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBMT0FEX1NUT1JZX1JFUExJRVMsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIG1lc3NhZ2VJZCxcbiAgICAgICAgcmVwbGllcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hcmtTdG9yeVJlYWQoXG4gIG1lc3NhZ2VJZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBNYXJrU3RvcnlSZWFkQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgc3RvcmllcyB9ID0gZ2V0U3RhdGUoKS5zdG9yaWVzO1xuXG4gICAgY29uc3QgbWF0Y2hpbmdTdG9yeSA9IHN0b3JpZXMuZmluZChzdG9yeSA9PiBzdG9yeS5tZXNzYWdlSWQgPT09IG1lc3NhZ2VJZCk7XG5cbiAgICBpZiAoIW1hdGNoaW5nU3RvcnkpIHtcbiAgICAgIGxvZy53YXJuKGBtYXJrU3RvcnlSZWFkOiBubyBtYXRjaGluZyBzdG9yeSBmb3VuZDogJHttZXNzYWdlSWR9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWlzRG93bmxvYWRlZChtYXRjaGluZ1N0b3J5LmF0dGFjaG1lbnQpICYmXG4gICAgICAhaGFzRmFpbGVkKG1hdGNoaW5nU3RvcnkuYXR0YWNobWVudClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobWF0Y2hpbmdTdG9yeS5yZWFkU3RhdHVzICE9PSBSZWFkU3RhdHVzLlVucmVhZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBnZXRNZXNzYWdlQnlJZChtZXNzYWdlSWQpO1xuXG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcnlSZWFkRGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICBtYXJrVmlld2VkKG1lc3NhZ2UuYXR0cmlidXRlcywgc3RvcnlSZWFkRGF0ZSk7XG5cbiAgICBjb25zdCB2aWV3ZWRSZWNlaXB0ID0ge1xuICAgICAgbWVzc2FnZUlkLFxuICAgICAgc2VuZGVyRTE2NDogbWVzc2FnZS5hdHRyaWJ1dGVzLnNvdXJjZSxcbiAgICAgIHNlbmRlclV1aWQ6IG1lc3NhZ2UuYXR0cmlidXRlcy5zb3VyY2VVdWlkLFxuICAgICAgdGltZXN0YW1wOiBtZXNzYWdlLmF0dHJpYnV0ZXMuc2VudF9hdCxcbiAgICB9O1xuICAgIGNvbnN0IHZpZXdTeW5jczogQXJyYXk8U3luY1R5cGU+ID0gW3ZpZXdlZFJlY2VpcHRdO1xuXG4gICAgaWYgKCF3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5hcmVXZVByaW1hcnlEZXZpY2UoKSkge1xuICAgICAgdmlld1N5bmNKb2JRdWV1ZS5hZGQoeyB2aWV3U3luY3MgfSk7XG4gICAgfVxuXG4gICAgdmlld2VkUmVjZWlwdHNKb2JRdWV1ZS5hZGQoeyB2aWV3ZWRSZWNlaXB0IH0pO1xuXG4gICAgYXdhaXQgZGF0YUludGVyZmFjZS5hZGROZXdTdG9yeVJlYWQoe1xuICAgICAgYXV0aG9ySWQ6IG1lc3NhZ2UuYXR0cmlidXRlcy5zb3VyY2VVdWlkLFxuICAgICAgY29udmVyc2F0aW9uSWQ6IG1lc3NhZ2UuYXR0cmlidXRlcy5jb252ZXJzYXRpb25JZCxcbiAgICAgIHN0b3J5SWQ6IG1lc3NhZ2VJZCxcbiAgICAgIHN0b3J5UmVhZERhdGUsXG4gICAgfSk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBNQVJLX1NUT1JZX1JFQUQsXG4gICAgICBwYXlsb2FkOiBtZXNzYWdlSWQsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHF1ZXVlU3RvcnlEb3dubG9hZChcbiAgc3RvcnlJZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjxcbiAgdm9pZCxcbiAgUm9vdFN0YXRlVHlwZSxcbiAgdW5rbm93bixcbiAgTm9vcEFjdGlvblR5cGUgfCBSZXNvbHZlQXR0YWNobWVudFVybEFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgc3RvcmllcyB9ID0gZ2V0U3RhdGUoKS5zdG9yaWVzO1xuICAgIGNvbnN0IHN0b3J5ID0gc3Rvcmllcy5maW5kKGl0ZW0gPT4gaXRlbS5tZXNzYWdlSWQgPT09IHN0b3J5SWQpO1xuXG4gICAgaWYgKCFzdG9yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYXR0YWNobWVudCB9ID0gc3Rvcnk7XG5cbiAgICBpZiAoIWF0dGFjaG1lbnQpIHtcbiAgICAgIGxvZy53YXJuKCdxdWV1ZVN0b3J5RG93bmxvYWQ6IE5vIGF0dGFjaG1lbnQgZm91bmQgZm9yIHN0b3J5Jywge1xuICAgICAgICBzdG9yeUlkLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGhhc0ZhaWxlZChhdHRhY2htZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0Rvd25sb2FkZWQoYXR0YWNobWVudCkpIHtcbiAgICAgIGlmICghYXR0YWNobWVudC5wYXRoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbHNvIHJlc29sdmVzIHRoZSBhdHRhY2htZW50J3MgVVJMIGluIGNhc2Ugd2UndmUgYWxyZWFkeVxuICAgICAgLy8gZG93bmxvYWRlZCB0aGUgYXR0YWNobWVudCBidXQgaGF2ZW4ndCBwb2ludGVkIGl0cyBwYXRoIHRvIGFuIGFic29sdXRlXG4gICAgICAvLyBsb2NhdGlvbiBvbiBkaXNrLlxuICAgICAgaWYgKGhhc05vdFJlc29sdmVkKGF0dGFjaG1lbnQpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBSRVNPTFZFX0FUVEFDSE1FTlRfVVJMLFxuICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogc3RvcnlJZCxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRVcmw6IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5nZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKFxuICAgICAgICAgICAgICBhdHRhY2htZW50LnBhdGhcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNEb3dubG9hZGluZyhhdHRhY2htZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBnZXRNZXNzYWdlQnlJZChzdG9yeUlkKTtcblxuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAvLyBXZSB3YW50IHRvIGVuc3VyZSB0aGF0IHdlIHJlLWh5ZHJhdGUgdGhlIHN0b3J5IHJlcGx5IGNvbnRleHQgd2l0aCB0aGVcbiAgICAgIC8vIGNvbXBsZXRlZCBhdHRhY2htZW50IGRvd25sb2FkLlxuICAgICAgbWVzc2FnZS5zZXQoeyBzdG9yeVJlcGx5Q29udGV4dDogdW5kZWZpbmVkIH0pO1xuXG4gICAgICBhd2FpdCBxdWV1ZUF0dGFjaG1lbnREb3dubG9hZHMobWVzc2FnZS5hdHRyaWJ1dGVzKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnTk9PUCcsXG4gICAgICBwYXlsb2FkOiBudWxsLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWFjdFRvU3RvcnkoXG4gIG5leHRSZWFjdGlvbjogc3RyaW5nLFxuICBtZXNzYWdlSWQ6IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgTm9vcEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZW5xdWV1ZVJlYWN0aW9uRm9yU2VuZCh7XG4gICAgICAgIG1lc3NhZ2VJZCxcbiAgICAgICAgZW1vamk6IG5leHRSZWFjdGlvbixcbiAgICAgICAgcmVtb3ZlOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoJ0Vycm9yIGVucXVldWluZyByZWFjdGlvbicsIGVycm9yLCBtZXNzYWdlSWQsIG5leHRSZWFjdGlvbik7XG4gICAgICBzaG93VG9hc3QoVG9hc3RSZWFjdGlvbkZhaWxlZCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ05PT1AnLFxuICAgICAgcGF5bG9hZDogbnVsbCxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVwbHlUb1N0b3J5KFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBtZXNzYWdlQm9keTogc3RyaW5nLFxuICBtZW50aW9uczogQXJyYXk8Qm9keVJhbmdlVHlwZT4sXG4gIHRpbWVzdGFtcDogbnVtYmVyLFxuICBzdG9yeTogU3RvcnlWaWV3VHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUmVwbHlUb1N0b3J5QWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG5cbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgbG9nLmVycm9yKCdyZXBseVRvU3Rvcnk6IGNvbnZlcnNhdGlvbiBkb2VzIG5vdCBleGlzdCcsIGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IGF3YWl0IGNvbnZlcnNhdGlvbi5lbnF1ZXVlTWVzc2FnZUZvclNlbmQoXG4gICAgICB7XG4gICAgICAgIGJvZHk6IG1lc3NhZ2VCb2R5LFxuICAgICAgICBhdHRhY2htZW50czogW10sXG4gICAgICAgIG1lbnRpb25zLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RvcnlJZDogc3RvcnkubWVzc2FnZUlkLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGlmIChtZXNzYWdlQXR0cmlidXRlcykge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBSRVBMWV9UT19TVE9SWSxcbiAgICAgICAgcGF5bG9hZDogbWVzc2FnZUF0dHJpYnV0ZXMsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbmRTdG9yeU1lc3NhZ2UoXG4gIGxpc3RJZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPixcbiAgY29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+LFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgTm9vcEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBhd2FpdCBkb1NlbmRTdG9yeU1lc3NhZ2UobGlzdElkcywgY29udmVyc2F0aW9uSWRzLCBhdHRhY2htZW50KTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0b3J5Q2hhbmdlZChzdG9yeTogU3RvcnlEYXRhVHlwZSk6IFN0b3J5Q2hhbmdlZEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNUT1JZX0NIQU5HRUQsXG4gICAgcGF5bG9hZDogc3RvcnksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVN0b3JpZXNWaWV3KCk6IFRvZ2dsZVZpZXdBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBUT0dHTEVfVklFVyxcbiAgfTtcbn1cblxuY29uc3QgZ2V0U2VsZWN0ZWRTdG9yeURhdGFGb3JDb252ZXJzYXRpb25JZCA9IChcbiAgZGlzcGF0Y2g6IFRodW5rRGlzcGF0Y2g8XG4gICAgUm9vdFN0YXRlVHlwZSxcbiAgICB1bmtub3duLFxuICAgIE5vb3BBY3Rpb25UeXBlIHwgUmVzb2x2ZUF0dGFjaG1lbnRVcmxBY3Rpb25UeXBlXG4gID4sXG4gIGdldFN0YXRlOiAoKSA9PiBSb290U3RhdGVUeXBlLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBzZWxlY3RlZFN0b3J5SWQ/OiBzdHJpbmdcbik6IHtcbiAgY3VycmVudEluZGV4OiBudW1iZXI7XG4gIGhhc1VucmVhZDogYm9vbGVhbjtcbiAgbnVtU3RvcmllczogbnVtYmVyO1xuICBzdG9yaWVzQnlDb252ZXJzYXRpb25JZDogQXJyYXk8U3RvcnlEYXRhVHlwZT47XG59ID0+IHtcbiAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuICBjb25zdCB7IHN0b3JpZXMgfSA9IHN0YXRlLnN0b3JpZXM7XG5cbiAgY29uc3Qgc3Rvcmllc0J5Q29udmVyc2F0aW9uSWQgPSBzdG9yaWVzLmZpbHRlcihcbiAgICBpdGVtID0+IGl0ZW0uY29udmVyc2F0aW9uSWQgPT09IGNvbnZlcnNhdGlvbklkICYmICFpdGVtLmRlbGV0ZWRGb3JFdmVyeW9uZVxuICApO1xuXG4gIC8vIEZpbmQgdGhlIGluZGV4IG9mIHRoZSBzdG9yeUlkIHByb3ZpZGVkLCBvciBpZiBub25lIHByb3ZpZGVkIHRoZW4gZmluZCB0aGVcbiAgLy8gb2xkZXN0IHVucmVhZCBzdG9yeSBmcm9tIHRoZSB1c2VyLiBJZiBhbGwgc3RvcmllcyBhcmUgcmVhZCB0aGVuIHdlIGNhblxuICAvLyBzdGFydCBhdCB0aGUgZmlyc3Qgc3RvcnkuXG4gIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICBsZXQgaGFzVW5yZWFkID0gZmFsc2U7XG4gIHN0b3JpZXNCeUNvbnZlcnNhdGlvbklkLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkU3RvcnlJZCAmJiBpdGVtLm1lc3NhZ2VJZCA9PT0gc2VsZWN0ZWRTdG9yeUlkKSB7XG4gICAgICBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhc2VsZWN0ZWRTdG9yeUlkICYmXG4gICAgICAhY3VycmVudEluZGV4ICYmXG4gICAgICBpdGVtLnJlYWRTdGF0dXMgPT09IFJlYWRTdGF0dXMuVW5yZWFkXG4gICAgKSB7XG4gICAgICBoYXNVbnJlYWQgPSB0cnVlO1xuICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBudW1TdG9yaWVzID0gc3Rvcmllc0J5Q29udmVyc2F0aW9uSWQubGVuZ3RoO1xuXG4gIC8vIFF1ZXVlIGFsbCB1bmRvd25sb2FkZWQgc3RvcmllcyBvbmNlIHdlJ3JlIHZpZXdpbmcgc29tZW9uZSdzIHN0b3JpZXNcbiAgc3Rvcmllc0J5Q29udmVyc2F0aW9uSWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoaXNEb3dubG9hZGVkKGl0ZW0uYXR0YWNobWVudCkgfHwgaXNEb3dubG9hZGluZyhpdGVtLmF0dGFjaG1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcXVldWVTdG9yeURvd25sb2FkKGl0ZW0ubWVzc2FnZUlkKShkaXNwYXRjaCwgZ2V0U3RhdGUsIG51bGwpO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGN1cnJlbnRJbmRleCxcbiAgICBoYXNVbnJlYWQsXG4gICAgbnVtU3RvcmllcyxcbiAgICBzdG9yaWVzQnlDb252ZXJzYXRpb25JZCxcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHZpZXdVc2VyU3RvcmllcyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbCA9IGZhbHNlXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBWaWV3U3RvcnlBY3Rpb25UeXBlPiB7XG4gIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3QgeyBjdXJyZW50SW5kZXgsIGhhc1VucmVhZCwgbnVtU3Rvcmllcywgc3Rvcmllc0J5Q29udmVyc2F0aW9uSWQgfSA9XG4gICAgICBnZXRTZWxlY3RlZFN0b3J5RGF0YUZvckNvbnZlcnNhdGlvbklkKGRpc3BhdGNoLCBnZXRTdGF0ZSwgY29udmVyc2F0aW9uSWQpO1xuXG4gICAgY29uc3Qgc3RvcnkgPSBzdG9yaWVzQnlDb252ZXJzYXRpb25JZFtjdXJyZW50SW5kZXhdO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVklFV19TVE9SWSxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgc2VsZWN0ZWRTdG9yeURhdGE6IHtcbiAgICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgICAgbWVzc2FnZUlkOiBzdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgbnVtU3RvcmllcyxcbiAgICAgICAgICBzaG91bGRTaG93RGV0YWlsc01vZGFsLFxuICAgICAgICB9LFxuICAgICAgICBzdG9yeVZpZXdNb2RlOiBoYXNVbnJlYWRcbiAgICAgICAgICA/IFN0b3J5Vmlld01vZGVUeXBlLlVucmVhZFxuICAgICAgICAgIDogU3RvcnlWaWV3TW9kZVR5cGUuQWxsLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZXhwb3J0IHR5cGUgVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGUgPSAob3B0czoge1xuICBjbG9zZVZpZXdlcj86IGJvb2xlYW47XG4gIHN0b3J5SWQ/OiBzdHJpbmc7XG4gIHN0b3J5Vmlld01vZGU/OiBTdG9yeVZpZXdNb2RlVHlwZTtcbiAgdmlld0RpcmVjdGlvbj86IFN0b3J5Vmlld0RpcmVjdGlvblR5cGU7XG4gIHNob3VsZFNob3dEZXRhaWxzTW9kYWw/OiBib29sZWFuO1xufSkgPT4gdW5rbm93bjtcblxuY29uc3Qgdmlld1N0b3J5OiBWaWV3U3RvcnlBY3Rpb25DcmVhdG9yVHlwZSA9ICh7XG4gIGNsb3NlVmlld2VyLFxuICBzaG91bGRTaG93RGV0YWlsc01vZGFsID0gZmFsc2UsXG4gIHN0b3J5SWQsXG4gIHN0b3J5Vmlld01vZGUsXG4gIHZpZXdEaXJlY3Rpb24sXG59KTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgVmlld1N0b3J5QWN0aW9uVHlwZT4gPT4ge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGlmIChjbG9zZVZpZXdlciB8fCAhc3RvcnlJZCB8fCAhc3RvcnlWaWV3TW9kZSkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBWSUVXX1NUT1JZLFxuICAgICAgICBwYXlsb2FkOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgY29uc3QgeyBzdG9yaWVzIH0gPSBzdGF0ZS5zdG9yaWVzO1xuXG4gICAgLy8gU3BlYzpcbiAgICAvLyBXaGVuIG9wZW5pbmcgdGhlIHN0b3J5IHZpZXdlciB5b3Ugc2hvdWxkIGFsd2F5cyBiZSB0YWtlbiB0byB0aGUgb2xkZXN0XG4gICAgLy8gICAgdW4gdmlld2VkIHN0b3J5IG9mIHRoZSB1c2VyIHlvdSB0YXBwZWQgb25cbiAgICAvLyBJZiBhbGwgc3RvcmllcyBmcm9tIGEgdXNlciBhcmUgdmlld2VkLCBvcGVuaW5nIHRoZSB2aWV3ZXIgc2hvdWxkIHRha2VcbiAgICAvLyAgICB5b3UgdG8gdGhlaXIgb2xkZXN0IHN0b3J5XG5cbiAgICBjb25zdCBzdG9yeSA9IHN0b3JpZXMuZmluZChcbiAgICAgIGl0ZW0gPT4gaXRlbS5tZXNzYWdlSWQgPT09IHN0b3J5SWQgJiYgIWl0ZW0uZGVsZXRlZEZvckV2ZXJ5b25lXG4gICAgKTtcblxuICAgIGlmICghc3RvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGN1cnJlbnRJbmRleCwgbnVtU3Rvcmllcywgc3Rvcmllc0J5Q29udmVyc2F0aW9uSWQgfSA9XG4gICAgICBnZXRTZWxlY3RlZFN0b3J5RGF0YUZvckNvbnZlcnNhdGlvbklkKFxuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgZ2V0U3RhdGUsXG4gICAgICAgIHN0b3J5LmNvbnZlcnNhdGlvbklkLFxuICAgICAgICBzdG9yeUlkXG4gICAgICApO1xuXG4gICAgLy8gR28gZGlyZWN0bHkgdG8gdGhlIHN0b3J5SWQgc2VsZWN0ZWRcbiAgICBpZiAoIXZpZXdEaXJlY3Rpb24pIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogVklFV19TVE9SWSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIHNlbGVjdGVkU3RvcnlEYXRhOiB7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IHN0b3J5SWQsXG4gICAgICAgICAgICBudW1TdG9yaWVzLFxuICAgICAgICAgICAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN0b3J5Vmlld01vZGUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOZXh0IHN0b3J5IHdpdGhpbiB0aGUgc2FtZSB1c2VyJ3Mgc3Rvcmllc1xuICAgIGlmIChcbiAgICAgIHZpZXdEaXJlY3Rpb24gPT09IFN0b3J5Vmlld0RpcmVjdGlvblR5cGUuTmV4dCAmJlxuICAgICAgY3VycmVudEluZGV4IDwgbnVtU3RvcmllcyAtIDFcbiAgICApIHtcbiAgICAgIGNvbnN0IG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgICBjb25zdCBuZXh0U3RvcnkgPSBzdG9yaWVzQnlDb252ZXJzYXRpb25JZFtuZXh0SW5kZXhdO1xuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFZJRVdfU1RPUlksXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBzZWxlY3RlZFN0b3J5RGF0YToge1xuICAgICAgICAgICAgY3VycmVudEluZGV4OiBuZXh0SW5kZXgsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IG5leHRTdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgICBudW1TdG9yaWVzLFxuICAgICAgICAgICAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdG9yeVZpZXdNb2RlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJldiBzdG9yeSB3aXRoaW4gdGhlIHNhbWUgdXNlcidzIHN0b3JpZXNcbiAgICBpZiAodmlld0RpcmVjdGlvbiA9PT0gU3RvcnlWaWV3RGlyZWN0aW9uVHlwZS5QcmV2aW91cyAmJiBjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgICAgY29uc3QgbmV4dFN0b3J5ID0gc3Rvcmllc0J5Q29udmVyc2F0aW9uSWRbbmV4dEluZGV4XTtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBWSUVXX1NUT1JZLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgc2VsZWN0ZWRTdG9yeURhdGE6IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleDogbmV4dEluZGV4LFxuICAgICAgICAgICAgbWVzc2FnZUlkOiBuZXh0U3RvcnkubWVzc2FnZUlkLFxuICAgICAgICAgICAgbnVtU3RvcmllcyxcbiAgICAgICAgICAgIHNob3VsZFNob3dEZXRhaWxzTW9kYWw6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3RvcnlWaWV3TW9kZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFyZSB0aGVyZSBhbnkgdW52aWV3ZWQgc3RvcmllcyBsZWZ0PyBJZiBzbyB3ZSBzaG91bGQgcGxheSB0aGUgdW52aWV3ZWRcbiAgICAvLyBzdG9yaWVzIGZpcnN0LiBCdXQgb25seSBpZiB3ZSdyZSBnb2luZyBcIm5leHRcIlxuICAgIGlmICh2aWV3RGlyZWN0aW9uID09PSBTdG9yeVZpZXdEaXJlY3Rpb25UeXBlLk5leHQpIHtcbiAgICAgIGNvbnN0IHVucmVhZFN0b3J5ID0gc3Rvcmllcy5maW5kKFxuICAgICAgICBpdGVtID0+XG4gICAgICAgICAgaXRlbS5yZWFkU3RhdHVzID09PSBSZWFkU3RhdHVzLlVucmVhZCAmJiAhaXRlbS5kZWxldGVkRm9yRXZlcnlvbmVcbiAgICAgICk7XG4gICAgICBpZiAodW5yZWFkU3RvcnkpIHtcbiAgICAgICAgY29uc3QgbmV4dFNlbGVjdGVkU3RvcnlEYXRhID0gZ2V0U2VsZWN0ZWRTdG9yeURhdGFGb3JDb252ZXJzYXRpb25JZChcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBnZXRTdGF0ZSxcbiAgICAgICAgICB1bnJlYWRTdG9yeS5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgICB1bnJlYWRTdG9yeS5tZXNzYWdlSWRcbiAgICAgICAgKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFZJRVdfU1RPUlksXG4gICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgc2VsZWN0ZWRTdG9yeURhdGE6IHtcbiAgICAgICAgICAgICAgY3VycmVudEluZGV4OiBuZXh0U2VsZWN0ZWRTdG9yeURhdGEuY3VycmVudEluZGV4LFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IHVucmVhZFN0b3J5Lm1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgbnVtU3RvcmllczogbmV4dFNlbGVjdGVkU3RvcnlEYXRhLm51bVN0b3JpZXMsXG4gICAgICAgICAgICAgIHNob3VsZFNob3dEZXRhaWxzTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3J5Vmlld01vZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25TdG9yaWVzID0gZ2V0U3RvcmllcyhzdGF0ZSkuc3RvcmllcztcbiAgICBjb25zdCBjb252ZXJzYXRpb25TdG9yeUluZGV4ID0gY29udmVyc2F0aW9uU3Rvcmllcy5maW5kSW5kZXgoXG4gICAgICBpdGVtID0+IGl0ZW0uY29udmVyc2F0aW9uSWQgPT09IHN0b3J5LmNvbnZlcnNhdGlvbklkXG4gICAgKTtcblxuICAgIGlmIChjb252ZXJzYXRpb25TdG9yeUluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIG5leHQgdXNlcidzIHN0b3JpZXNcbiAgICBpZiAoXG4gICAgICB2aWV3RGlyZWN0aW9uID09PSBTdG9yeVZpZXdEaXJlY3Rpb25UeXBlLk5leHQgJiZcbiAgICAgIGNvbnZlcnNhdGlvblN0b3J5SW5kZXggPCBjb252ZXJzYXRpb25TdG9yaWVzLmxlbmd0aCAtIDFcbiAgICApIHtcbiAgICAgIC8vIFNwZWM6XG4gICAgICAvLyBUYXBwaW5nIHJpZ2h0IGFkdmFuY2VzIHlvdSB0byB0aGUgbmV4dCB1biB2aWV3ZWQgc3RvcnlcbiAgICAgIC8vIElmIGFsbCBzdG9yaWVzIGFyZSB2aWV3ZWQsIGFkdmFuY2UgdG8gdGhlIG5leHQgdmlld2VkIHN0b3J5XG4gICAgICAvLyBXaGVuIHlvdSByZWFjaCB0aGUgbmV3ZXN0IHN0b3J5IGZyb20gYSB1c2VyLCB0YXBwaW5nIHJpZ2h0IGFnYWluXG4gICAgICAvLyAgICBzaG91bGQgdGFrZSB5b3UgdG8gdGhlIG5leHQgdXNlcidzIG9sZGVzdCB1biB2aWV3ZWQgc3Rvcnkgb3Igb2xkZXN0XG4gICAgICAvLyAgICBzdG9yeSBpZiBhbGwgc3RvcmllcyBmb3IgdGhlIG5leHQgdXNlciBhcmUgdmlld2VkLlxuICAgICAgLy8gV2hlbiB5b3UgcmVhY2ggdGhlIG5ld2VzdCBzdG9yeSBmcm9tIHRoZSBsYXN0IHVzZXIgaW4gdGhlIHN0b3J5IGxpc3QsXG4gICAgICAvLyAgICB0YXBwaW5nIHJpZ2h0IHNob3VsZCBjbG9zZSB0aGUgdmlld2VyXG4gICAgICAvLyBUb3VjaCBhcmVhIGZvciB0YXBwaW5nIHJpZ2h0IHNob3VsZCBiZSA4MCUgb2Ygd2lkdGggb2YgdGhlIHNjcmVlblxuICAgICAgY29uc3QgbmV4dENvbnZlcnNhdGlvblN0b3J5SW5kZXggPSBjb252ZXJzYXRpb25TdG9yeUluZGV4ICsgMTtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvblN0b3J5ID0gY29udmVyc2F0aW9uU3Rvcmllc1tuZXh0Q29udmVyc2F0aW9uU3RvcnlJbmRleF07XG5cbiAgICAgIGNvbnN0IG5leHRTZWxlY3RlZFN0b3J5RGF0YSA9IGdldFNlbGVjdGVkU3RvcnlEYXRhRm9yQ29udmVyc2F0aW9uSWQoXG4gICAgICAgIGRpc3BhdGNoLFxuICAgICAgICBnZXRTdGF0ZSxcbiAgICAgICAgY29udmVyc2F0aW9uU3RvcnkuY29udmVyc2F0aW9uSWRcbiAgICAgICk7XG5cbiAgICAgIC8vIENsb3NlIHRoZSB2aWV3ZXIgaWYgd2Ugd2VyZSB2aWV3aW5nIHVucmVhZCBzdG9yaWVzIG9ubHkgYW5kIHdlJ3ZlXG4gICAgICAvLyByZWFjaGVkIHRoZSBsYXN0IHVucmVhZCBzdG9yeS5cbiAgICAgIGlmIChcbiAgICAgICAgIW5leHRTZWxlY3RlZFN0b3J5RGF0YS5oYXNVbnJlYWQgJiZcbiAgICAgICAgc3RvcnlWaWV3TW9kZSA9PT0gU3RvcnlWaWV3TW9kZVR5cGUuVW5yZWFkXG4gICAgICApIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFZJRVdfU1RPUlksXG4gICAgICAgICAgcGF5bG9hZDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFZJRVdfU1RPUlksXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBzZWxlY3RlZFN0b3J5RGF0YToge1xuICAgICAgICAgICAgY3VycmVudEluZGV4OiAwLFxuICAgICAgICAgICAgbWVzc2FnZUlkOlxuICAgICAgICAgICAgICBuZXh0U2VsZWN0ZWRTdG9yeURhdGEuc3Rvcmllc0J5Q29udmVyc2F0aW9uSWRbMF0ubWVzc2FnZUlkLFxuICAgICAgICAgICAgbnVtU3RvcmllczogbmV4dFNlbGVjdGVkU3RvcnlEYXRhLm51bVN0b3JpZXMsXG4gICAgICAgICAgICBzaG91bGRTaG93RGV0YWlsc01vZGFsOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN0b3J5Vmlld01vZGUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBwcmV2aW91cyB1c2VyJ3Mgc3Rvcmllc1xuICAgIGlmIChcbiAgICAgIHZpZXdEaXJlY3Rpb24gPT09IFN0b3J5Vmlld0RpcmVjdGlvblR5cGUuUHJldmlvdXMgJiZcbiAgICAgIGNvbnZlcnNhdGlvblN0b3J5SW5kZXggPiAwXG4gICAgKSB7XG4gICAgICAvLyBTcGVjOlxuICAgICAgLy8gVGFwcGluZyBsZWZ0IHRha2VzIHlvdSBiYWNrIHRvIHRoZSBwcmV2aW91cyBzdG9yeVxuICAgICAgLy8gV2hlbiB5b3UgcmVhY2ggdGhlIG9sZGVzdCBzdG9yeSBmcm9tIGEgdXNlciwgdGFwcGluZyBsZWZ0IGFnYWluIHRha2VzXG4gICAgICAvLyAgICB5b3UgdG8gdGhlIHByZXZpb3VzIHVzZXJzIG9sZGVzdCB1biB2aWV3ZWQgc3Rvcnkgb3IgbmV3ZXN0IHZpZXdlZFxuICAgICAgLy8gICAgc3RvcnkgaWYgYWxsIHN0b3JpZXMgYXJlIHZpZXdlZFxuICAgICAgLy8gSWYgeW91IHRhcCBsZWZ0IG9uIHRoZSBvbGRlc3Qgc3RvcnkgZnJvbSB0aGUgZmlyc3QgdXNlciBpbiB0aGUgc3RvcnlcbiAgICAgIC8vICAgIGxpc3QsIGl0IHNob3VsZCByZS1zdGFydCBwbGF5YmFjayBvbiB0aGF0IHN0b3J5XG4gICAgICAvLyBUb3VjaCBhcmVhIGZvciB0YXBwaW5nIGxlZnQgc2hvdWxkIGJlIDIwJSBvZiB3aWR0aCBvZiB0aGUgc2NyZWVuXG4gICAgICBjb25zdCBuZXh0Q29udmVyc2F0aW9uU3RvcnlJbmRleCA9IGNvbnZlcnNhdGlvblN0b3J5SW5kZXggLSAxO1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uU3RvcnkgPSBjb252ZXJzYXRpb25TdG9yaWVzW25leHRDb252ZXJzYXRpb25TdG9yeUluZGV4XTtcblxuICAgICAgY29uc3QgbmV4dFNlbGVjdGVkU3RvcnlEYXRhID0gZ2V0U2VsZWN0ZWRTdG9yeURhdGFGb3JDb252ZXJzYXRpb25JZChcbiAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgIGdldFN0YXRlLFxuICAgICAgICBjb252ZXJzYXRpb25TdG9yeS5jb252ZXJzYXRpb25JZFxuICAgICAgKTtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBWSUVXX1NUT1JZLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgc2VsZWN0ZWRTdG9yeURhdGE6IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleDogMCxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDpcbiAgICAgICAgICAgICAgbmV4dFNlbGVjdGVkU3RvcnlEYXRhLnN0b3JpZXNCeUNvbnZlcnNhdGlvbklkWzBdLm1lc3NhZ2VJZCxcbiAgICAgICAgICAgIG51bVN0b3JpZXM6IG5leHRTZWxlY3RlZFN0b3J5RGF0YS5udW1TdG9yaWVzLFxuICAgICAgICAgICAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdG9yeVZpZXdNb2RlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ291bGQgbm90IG1lZXQgYW55IGNyaXRlcmlhLCBjbG9zZSB0aGUgdmlld2VyXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVklFV19TVE9SWSxcbiAgICAgIHBheWxvYWQ6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhY3Rpb25zID0ge1xuICBkZWxldGVTdG9yeUZvckV2ZXJ5b25lLFxuICBsb2FkU3RvcnlSZXBsaWVzLFxuICBtYXJrU3RvcnlSZWFkLFxuICBxdWV1ZVN0b3J5RG93bmxvYWQsXG4gIHJlYWN0VG9TdG9yeSxcbiAgcmVwbHlUb1N0b3J5LFxuICBzZW5kU3RvcnlNZXNzYWdlLFxuICBzdG9yeUNoYW5nZWQsXG4gIHRvZ2dsZVN0b3JpZXNWaWV3LFxuICB2aWV3VXNlclN0b3JpZXMsXG4gIHZpZXdTdG9yeSxcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VTdG9yaWVzQWN0aW9ucyA9ICgpOiB0eXBlb2YgYWN0aW9ucyA9PiB1c2VCb3VuZEFjdGlvbnMoYWN0aW9ucyk7XG5cbi8vIFJlZHVjZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVtcHR5U3RhdGUoXG4gIG92ZXJyaWRlU3RhdGU6IFBhcnRpYWw8U3Rvcmllc1N0YXRlVHlwZT4gPSB7fVxuKTogU3Rvcmllc1N0YXRlVHlwZSB7XG4gIHJldHVybiB7XG4gICAgaXNTaG93aW5nU3Rvcmllc1ZpZXc6IGZhbHNlLFxuICAgIHN0b3JpZXM6IFtdLFxuICAgIC4uLm92ZXJyaWRlU3RhdGUsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKFxuICBzdGF0ZTogUmVhZG9ubHk8U3Rvcmllc1N0YXRlVHlwZT4gPSBnZXRFbXB0eVN0YXRlKCksXG4gIGFjdGlvbjogUmVhZG9ubHk8U3Rvcmllc0FjdGlvblR5cGU+XG4pOiBTdG9yaWVzU3RhdGVUeXBlIHtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBUT0dHTEVfVklFVykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGlzU2hvd2luZ1N0b3JpZXNWaWV3OiAhc3RhdGUuaXNTaG93aW5nU3Rvcmllc1ZpZXcsXG4gICAgICBzZWxlY3RlZFN0b3J5RGF0YTogc3RhdGUuaXNTaG93aW5nU3Rvcmllc1ZpZXdcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBzdGF0ZS5zZWxlY3RlZFN0b3J5RGF0YSxcbiAgICAgIHN0b3J5Vmlld01vZGU6IHN0YXRlLmlzU2hvd2luZ1N0b3JpZXNWaWV3XG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogc3RhdGUuc3RvcnlWaWV3TW9kZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnTUVTU0FHRV9ERUxFVEVEJykge1xuICAgIGNvbnN0IG5leHRTdG9yaWVzID0gc3RhdGUuc3Rvcmllcy5maWx0ZXIoXG4gICAgICBzdG9yeSA9PiBzdG9yeS5tZXNzYWdlSWQgIT09IGFjdGlvbi5wYXlsb2FkLmlkXG4gICAgKTtcblxuICAgIGlmIChuZXh0U3Rvcmllcy5sZW5ndGggPT09IHN0YXRlLnN0b3JpZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3RvcmllczogbmV4dFN0b3JpZXMsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gU1RPUllfQ0hBTkdFRCkge1xuICAgIGNvbnN0IG5ld1N0b3J5ID0gcGljayhhY3Rpb24ucGF5bG9hZCwgW1xuICAgICAgJ2F0dGFjaG1lbnQnLFxuICAgICAgJ2NhblJlcGx5VG9TdG9yeScsXG4gICAgICAnY29udmVyc2F0aW9uSWQnLFxuICAgICAgJ2RlbGV0ZWRGb3JFdmVyeW9uZScsXG4gICAgICAnbWVzc2FnZUlkJyxcbiAgICAgICdyZWFjdGlvbnMnLFxuICAgICAgJ3JlYWRTdGF0dXMnLFxuICAgICAgJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnLFxuICAgICAgJ3NvdXJjZScsXG4gICAgICAnc291cmNlVXVpZCcsXG4gICAgICAnc3RvcnlEaXN0cmlidXRpb25MaXN0SWQnLFxuICAgICAgJ3RpbWVzdGFtcCcsXG4gICAgICAndHlwZScsXG4gICAgXSk7XG5cbiAgICBjb25zdCBwcmV2U3RvcnlJbmRleCA9IHN0YXRlLnN0b3JpZXMuZmluZEluZGV4KFxuICAgICAgZXhpc3RpbmdTdG9yeSA9PiBleGlzdGluZ1N0b3J5Lm1lc3NhZ2VJZCA9PT0gbmV3U3RvcnkubWVzc2FnZUlkXG4gICAgKTtcbiAgICBpZiAocHJldlN0b3J5SW5kZXggPj0gMCkge1xuICAgICAgY29uc3QgcHJldlN0b3J5ID0gc3RhdGUuc3Rvcmllc1twcmV2U3RvcnlJbmRleF07XG5cbiAgICAgIC8vIFN0b3JpZXMgcmFyZWx5IG5lZWQgdG8gY2hhbmdlLCBoZXJlIGFyZSB0aGUgZm9sbG93aW5nIGV4Y2VwdGlvbnM6XG4gICAgICBjb25zdCBpc0Rvd25sb2FkaW5nQXR0YWNobWVudCA9IGlzRG93bmxvYWRpbmcobmV3U3RvcnkuYXR0YWNobWVudCk7XG4gICAgICBjb25zdCBoYXNBdHRhY2htZW50RG93bmxvYWRlZCA9XG4gICAgICAgICFpc0Rvd25sb2FkZWQocHJldlN0b3J5LmF0dGFjaG1lbnQpICYmXG4gICAgICAgIGlzRG93bmxvYWRlZChuZXdTdG9yeS5hdHRhY2htZW50KTtcbiAgICAgIGNvbnN0IGhhc0F0dGFjaG1lbnRGYWlsZWQgPVxuICAgICAgICBoYXNGYWlsZWQobmV3U3RvcnkuYXR0YWNobWVudCkgJiYgIWhhc0ZhaWxlZChwcmV2U3RvcnkuYXR0YWNobWVudCk7XG4gICAgICBjb25zdCByZWFkU3RhdHVzQ2hhbmdlZCA9IHByZXZTdG9yeS5yZWFkU3RhdHVzICE9PSBuZXdTdG9yeS5yZWFkU3RhdHVzO1xuICAgICAgY29uc3QgcmVhY3Rpb25zQ2hhbmdlZCA9XG4gICAgICAgIHByZXZTdG9yeS5yZWFjdGlvbnM/Lmxlbmd0aCAhPT0gbmV3U3RvcnkucmVhY3Rpb25zPy5sZW5ndGg7XG4gICAgICBjb25zdCBoYXNCZWVuRGVsZXRlZCA9XG4gICAgICAgICFwcmV2U3RvcnkuZGVsZXRlZEZvckV2ZXJ5b25lICYmIG5ld1N0b3J5LmRlbGV0ZWRGb3JFdmVyeW9uZTtcbiAgICAgIGNvbnN0IGhhc1NlbmRTdGF0ZUNoYW5nZWQgPSAhaXNFcXVhbChcbiAgICAgICAgcHJldlN0b3J5LnNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQsXG4gICAgICAgIG5ld1N0b3J5LnNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHNob3VsZFJlcGxhY2UgPVxuICAgICAgICBpc0Rvd25sb2FkaW5nQXR0YWNobWVudCB8fFxuICAgICAgICBoYXNBdHRhY2htZW50RG93bmxvYWRlZCB8fFxuICAgICAgICBoYXNBdHRhY2htZW50RmFpbGVkIHx8XG4gICAgICAgIGhhc0JlZW5EZWxldGVkIHx8XG4gICAgICAgIGhhc1NlbmRTdGF0ZUNoYW5nZWQgfHxcbiAgICAgICAgcmVhZFN0YXR1c0NoYW5nZWQgfHxcbiAgICAgICAgcmVhY3Rpb25zQ2hhbmdlZDtcbiAgICAgIGlmICghc2hvdWxkUmVwbGFjZSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNCZWVuRGVsZXRlZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIHN0b3JpZXM6IHN0YXRlLnN0b3JpZXMuZmlsdGVyKFxuICAgICAgICAgICAgZXhpc3RpbmdTdG9yeSA9PiBleGlzdGluZ1N0b3J5Lm1lc3NhZ2VJZCAhPT0gbmV3U3RvcnkubWVzc2FnZUlkXG4gICAgICAgICAgKSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHN0b3JpZXM6IHJlcGxhY2VJbmRleChzdGF0ZS5zdG9yaWVzLCBwcmV2U3RvcnlJbmRleCwgbmV3U3RvcnkpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBBZGRpbmcgYSBuZXcgc3RvcnlcbiAgICBjb25zdCBzdG9yaWVzID0gWy4uLnN0YXRlLnN0b3JpZXMsIG5ld1N0b3J5XS5zb3J0KChhLCBiKSA9PlxuICAgICAgYS50aW1lc3RhbXAgPiBiLnRpbWVzdGFtcCA/IDEgOiAtMVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzdG9yaWVzLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IE1BUktfU1RPUllfUkVBRCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHN0b3JpZXM6IHN0YXRlLnN0b3JpZXMubWFwKHN0b3J5ID0+IHtcbiAgICAgICAgaWYgKHN0b3J5Lm1lc3NhZ2VJZCA9PT0gYWN0aW9uLnBheWxvYWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uc3RvcnksXG4gICAgICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlZpZXdlZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0b3J5O1xuICAgICAgfSksXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gTE9BRF9TVE9SWV9SRVBMSUVTKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgcmVwbHlTdGF0ZTogYWN0aW9uLnBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ01FU1NBR0VTX0FEREVEJyAmJiBhY3Rpb24ucGF5bG9hZC5pc0p1c3RTZW50KSB7XG4gICAgY29uc3Qgc3RvcmllcyA9IGFjdGlvbi5wYXlsb2FkLm1lc3NhZ2VzLmZpbHRlcihpc1N0b3J5KTtcbiAgICBpZiAoIXN0b3JpZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3U3RvcmllcyA9IHN0b3JpZXNcbiAgICAgIC5tYXAobWVzc2FnZUF0dHJzID0+IGdldFN0b3J5RGF0YUZyb21NZXNzYWdlQXR0cmlidXRlcyhtZXNzYWdlQXR0cnMpKVxuICAgICAgLmZpbHRlcihpc05vdE5pbCk7XG5cbiAgICBpZiAoIW5ld1N0b3JpZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3RvcmllczogWy4uLnN0YXRlLnN0b3JpZXMsIC4uLm5ld1N0b3JpZXNdLFxuICAgIH07XG4gIH1cblxuICAvLyBGb3IgbGl2ZSB1cGRhdGluZyBvZiB0aGUgc3RvcnkgcmVwbGllc1xuICBpZiAoXG4gICAgYWN0aW9uLnR5cGUgPT09ICdNRVNTQUdFX0NIQU5HRUQnICYmXG4gICAgc3RhdGUucmVwbHlTdGF0ZSAmJlxuICAgIHN0YXRlLnJlcGx5U3RhdGUubWVzc2FnZUlkID09PSBhY3Rpb24ucGF5bG9hZC5kYXRhLnN0b3J5SWRcbiAgKSB7XG4gICAgY29uc3QgeyByZXBseVN0YXRlIH0gPSBzdGF0ZTtcbiAgICBjb25zdCBtZXNzYWdlSW5kZXggPSByZXBseVN0YXRlLnJlcGxpZXMuZmluZEluZGV4KFxuICAgICAgcmVwbHkgPT4gcmVwbHkuaWQgPT09IGFjdGlvbi5wYXlsb2FkLmlkXG4gICAgKTtcblxuICAgIC8vIE5ldyBtZXNzYWdlXG4gICAgaWYgKG1lc3NhZ2VJbmRleCA8IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICByZXBseVN0YXRlOiB7XG4gICAgICAgICAgbWVzc2FnZUlkOiByZXBseVN0YXRlLm1lc3NhZ2VJZCxcbiAgICAgICAgICByZXBsaWVzOiBbLi4ucmVwbHlTdGF0ZS5yZXBsaWVzLCBhY3Rpb24ucGF5bG9hZC5kYXRhXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlZCBtZXNzYWdlLCBhbHNvIGhhbmRsZXMgRE9FXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgcmVwbHlTdGF0ZToge1xuICAgICAgICBtZXNzYWdlSWQ6IHJlcGx5U3RhdGUubWVzc2FnZUlkLFxuICAgICAgICByZXBsaWVzOiByZXBsYWNlSW5kZXgoXG4gICAgICAgICAgcmVwbHlTdGF0ZS5yZXBsaWVzLFxuICAgICAgICAgIG1lc3NhZ2VJbmRleCxcbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5kYXRhXG4gICAgICAgICksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFJFUExZX1RPX1NUT1JZKSB7XG4gICAgY29uc3QgeyByZXBseVN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIXJlcGx5U3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICByZXBseVN0YXRlOiB7XG4gICAgICAgIG1lc3NhZ2VJZDogcmVwbHlTdGF0ZS5tZXNzYWdlSWQsXG4gICAgICAgIHJlcGxpZXM6IFsuLi5yZXBseVN0YXRlLnJlcGxpZXMsIGFjdGlvbi5wYXlsb2FkXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gUkVTT0xWRV9BVFRBQ0hNRU5UX1VSTCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZUlkLCBhdHRhY2htZW50VXJsIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNvbnN0IHN0b3J5SW5kZXggPSBzdGF0ZS5zdG9yaWVzLmZpbmRJbmRleChcbiAgICAgIGV4aXN0aW5nU3RvcnkgPT4gZXhpc3RpbmdTdG9yeS5tZXNzYWdlSWQgPT09IG1lc3NhZ2VJZFxuICAgICk7XG5cbiAgICBpZiAoc3RvcnlJbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yeSA9IHN0YXRlLnN0b3JpZXNbc3RvcnlJbmRleF07XG5cbiAgICBpZiAoIXN0b3J5LmF0dGFjaG1lbnQpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yeVdpdGhSZXNvbHZlZEF0dGFjaG1lbnQgPSB7XG4gICAgICAuLi5zdG9yeSxcbiAgICAgIGF0dGFjaG1lbnQ6IHtcbiAgICAgICAgLi4uc3RvcnkuYXR0YWNobWVudCxcbiAgICAgICAgdXJsOiBhdHRhY2htZW50VXJsLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3RvcmllczogcmVwbGFjZUluZGV4KFxuICAgICAgICBzdGF0ZS5zdG9yaWVzLFxuICAgICAgICBzdG9yeUluZGV4LFxuICAgICAgICBzdG9yeVdpdGhSZXNvbHZlZEF0dGFjaG1lbnRcbiAgICAgICksXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gRE9FX1NUT1JZKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3Rvcmllczogc3RhdGUuc3Rvcmllcy5maWx0ZXIoXG4gICAgICAgIGV4aXN0aW5nU3RvcnkgPT4gZXhpc3RpbmdTdG9yeS5tZXNzYWdlSWQgIT09IGFjdGlvbi5wYXlsb2FkXG4gICAgICApLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFZJRVdfU1RPUlkpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkU3RvcnlEYXRhLCBzdG9yeVZpZXdNb2RlIH0gPSBhY3Rpb24ucGF5bG9hZCB8fCB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNlbGVjdGVkU3RvcnlEYXRhLFxuICAgICAgc3RvcnlWaWV3TW9kZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsb0JBQW9DO0FBY3BDLFVBQXFCO0FBQ3JCLG9CQUEwQjtBQUMxQix1QkFBb0I7QUFDcEIsK0JBQTJCO0FBQzNCLHFCQUEwRDtBQUMxRCxtQ0FBMEM7QUFDMUMsaUNBQW9DO0FBQ3BDLG9DQUF1QztBQUN2Qyw0QkFBK0I7QUFDL0IsNEJBQTJCO0FBQzNCLHNDQUF5QztBQUN6QywwQkFBNkI7QUFDN0IsMENBQTZDO0FBQzdDLHVCQUEwQjtBQUMxQix3QkFLTztBQUNQLDJCQUF3QztBQUN4Qyw0QkFBK0I7QUFDL0IscUJBQTJCO0FBQzNCLHlCQUFrRDtBQUNsRCxvQ0FBd0I7QUFDeEIsc0JBQXlCO0FBQ3pCLHFCQUF3QjtBQUN4QixvQ0FBdUM7QUFDdkMsOEJBQXVEO0FBQ3ZELDZCQUFnQztBQUNoQyw4QkFBaUM7QUFDakMsb0NBQXVDO0FBMEN2QyxNQUFNLFlBQVk7QUFDbEIsTUFBTSxxQkFBcUI7QUFDM0IsTUFBTSxrQkFBa0I7QUFDeEIsTUFBTSxpQkFBaUI7QUFDaEIsTUFBTSx5QkFBeUI7QUFDdEMsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxjQUFjO0FBQ3BCLE1BQU0sYUFBYTtBQW1FbkIsZ0NBQ0UsT0FDK0Q7QUFDL0QsU0FBTyxPQUFPLFVBQVUsYUFBYTtBQUNuQyxRQUFJLENBQUMsTUFBTSxXQUFXO0FBQ3BCO0FBQUEsSUFDRjtBQUVBLFVBQU0sa0JBQWtCLElB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
