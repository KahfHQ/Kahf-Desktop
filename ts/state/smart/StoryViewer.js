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
var StoryViewer_exports = {};
__export(StoryViewer_exports, {
  SmartStoryViewer: () => SmartStoryViewer
});
module.exports = __toCommonJS(StoryViewer_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_StoryViewer = require("../../components/StoryViewer");
var import_toast = require("../ducks/toast");
var import_conversations = require("../selectors/conversations");
var import_items = require("../selectors/items");
var import_user = require("../selectors/user");
var import_badges = require("../selectors/badges");
var import_stories = require("../selectors/stories");
var import_calling = require("../selectors/calling");
var import_renderEmojiPicker = require("./renderEmojiPicker");
var import_assert = require("../../util/assert");
var import_emojis = require("../ducks/emojis");
var import_items2 = require("../ducks/items");
var import_conversations2 = require("../ducks/conversations");
var import_emojis2 = require("../selectors/emojis");
var import_stories2 = require("../ducks/stories");
function SmartStoryViewer() {
  const storiesActions = (0, import_stories2.useStoriesActions)();
  const { onSetSkinTone, toggleHasAllStoriesMuted } = (0, import_items2.useActions)();
  const { onUseEmoji } = (0, import_emojis.useActions)();
  const { showConversation, toggleHideStories } = (0, import_conversations2.useConversationsActions)();
  const { showToast } = (0, import_toast.useToastActions)();
  const i18n = (0, import_react_redux.useSelector)(import_user.getIntl);
  const getPreferredBadge = (0, import_react_redux.useSelector)(import_badges.getPreferredBadgeSelector);
  const preferredReactionEmoji = (0, import_react_redux.useSelector)(import_items.getPreferredReactionEmoji);
  const selectedStoryData = (0, import_react_redux.useSelector)(import_stories.getSelectedStoryData);
  (0, import_assert.strictAssert)(selectedStoryData, "StoryViewer: !selectedStoryData");
  const conversationSelector = (0, import_react_redux.useSelector)(import_conversations.getConversationSelector);
  const getStoryById = (0, import_react_redux.useSelector)(import_stories.getStoryByIdSelector);
  const storyInfo = getStoryById(conversationSelector, selectedStoryData.messageId);
  (0, import_assert.strictAssert)(storyInfo, "StoryViewer: selected story does not exist in stories");
  const { conversationStory, storyView } = storyInfo;
  const storyViewMode = (0, import_react_redux.useSelector)((state) => state.stories.storyViewMode);
  const recentEmojis = (0, import_emojis2.useRecentEmojis)();
  const skinTone = (0, import_react_redux.useSelector)(import_items.getEmojiSkinTone);
  const replyState = (0, import_react_redux.useSelector)(import_stories.getStoryReplies);
  const hasAllStoriesMuted = (0, import_react_redux.useSelector)(import_items.getHasAllStoriesMuted);
  const hasActiveCall = (0, import_react_redux.useSelector)(import_calling.isInFullScreenCall);
  return /* @__PURE__ */ import_react.default.createElement(import_StoryViewer.StoryViewer, {
    currentIndex: selectedStoryData.currentIndex,
    getPreferredBadge,
    group: conversationStory.group,
    hasActiveCall,
    hasAllStoriesMuted,
    i18n,
    numStories: selectedStoryData.numStories,
    onHideStory: toggleHideStories,
    onGoToConversation: (senderId) => {
      showConversation({ conversationId: senderId });
      storiesActions.toggleStoriesView();
    },
    onReactToStory: async (emoji, story) => {
      const { messageId } = story;
      storiesActions.reactToStory(emoji, messageId);
    },
    onReplyToStory: (message, mentions, timestamp, story) => {
      storiesActions.replyToStory(conversationStory.conversationId, message, mentions, timestamp, story);
    },
    onSetSkinTone,
    onTextTooLong: () => showToast(import_toast.ToastType.MessageBodyTooLong),
    onUseEmoji,
    preferredReactionEmoji,
    recentEmojis,
    renderEmojiPicker: import_renderEmojiPicker.renderEmojiPicker,
    replyState,
    shouldShowDetailsModal: selectedStoryData.shouldShowDetailsModal,
    showToast,
    skinTone,
    story: storyView,
    storyViewMode,
    toggleHasAllStoriesMuted,
    ...storiesActions
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartStoryViewer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlWaWV3ZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTZWxlY3RvciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuaW1wb3J0IHR5cGUgeyBHZXRDb252ZXJzYXRpb25CeUlkVHlwZSB9IGZyb20gJy4uL3NlbGVjdG9ycy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeVZpZXdNb2RlVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB0eXBlIHsgU2VsZWN0ZWRTdG9yeURhdGFUeXBlIH0gZnJvbSAnLi4vZHVja3Mvc3Rvcmllcyc7XG5pbXBvcnQgeyBTdG9yeVZpZXdlciB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvU3RvcnlWaWV3ZXInO1xuaW1wb3J0IHsgVG9hc3RUeXBlLCB1c2VUb2FzdEFjdGlvbnMgfSBmcm9tICcuLi9kdWNrcy90b2FzdCc7XG5pbXBvcnQgeyBnZXRDb252ZXJzYXRpb25TZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7XG4gIGdldEVtb2ppU2tpblRvbmUsXG4gIGdldEhhc0FsbFN0b3JpZXNNdXRlZCxcbiAgZ2V0UHJlZmVycmVkUmVhY3Rpb25FbW9qaSxcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2l0ZW1zJztcbmltcG9ydCB7IGdldEludGwgfSBmcm9tICcuLi9zZWxlY3RvcnMvdXNlcic7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQge1xuICBnZXRTZWxlY3RlZFN0b3J5RGF0YSxcbiAgZ2V0U3RvcnlSZXBsaWVzLFxuICBnZXRTdG9yeUJ5SWRTZWxlY3Rvcixcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL3N0b3JpZXMnO1xuaW1wb3J0IHsgaXNJbkZ1bGxTY3JlZW5DYWxsIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2NhbGxpbmcnO1xuaW1wb3J0IHsgcmVuZGVyRW1vamlQaWNrZXIgfSBmcm9tICcuL3JlbmRlckVtb2ppUGlja2VyJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IHVzZUFjdGlvbnMgYXMgdXNlRW1vamlzQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2Vtb2ppcyc7XG5pbXBvcnQgeyB1c2VBY3Rpb25zIGFzIHVzZUl0ZW1zQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2l0ZW1zJztcbmltcG9ydCB7IHVzZUNvbnZlcnNhdGlvbnNBY3Rpb25zIH0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyB1c2VSZWNlbnRFbW9qaXMgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW1vamlzJztcbmltcG9ydCB7IHVzZVN0b3JpZXNBY3Rpb25zIH0gZnJvbSAnLi4vZHVja3Mvc3Rvcmllcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTbWFydFN0b3J5Vmlld2VyKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHN0b3JpZXNBY3Rpb25zID0gdXNlU3Rvcmllc0FjdGlvbnMoKTtcbiAgY29uc3QgeyBvblNldFNraW5Ub25lLCB0b2dnbGVIYXNBbGxTdG9yaWVzTXV0ZWQgfSA9IHVzZUl0ZW1zQWN0aW9ucygpO1xuICBjb25zdCB7IG9uVXNlRW1vamkgfSA9IHVzZUVtb2ppc0FjdGlvbnMoKTtcbiAgY29uc3QgeyBzaG93Q29udmVyc2F0aW9uLCB0b2dnbGVIaWRlU3RvcmllcyB9ID0gdXNlQ29udmVyc2F0aW9uc0FjdGlvbnMoKTtcbiAgY29uc3QgeyBzaG93VG9hc3QgfSA9IHVzZVRvYXN0QWN0aW9ucygpO1xuXG4gIGNvbnN0IGkxOG4gPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIExvY2FsaXplclR5cGU+KGdldEludGwpO1xuICBjb25zdCBnZXRQcmVmZXJyZWRCYWRnZSA9IHVzZVNlbGVjdG9yKGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3IpO1xuICBjb25zdCBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppID0gdXNlU2VsZWN0b3I8U3RhdGVUeXBlLCBBcnJheTxzdHJpbmc+PihcbiAgICBnZXRQcmVmZXJyZWRSZWFjdGlvbkVtb2ppXG4gICk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRTdG9yeURhdGEgPSB1c2VTZWxlY3RvcjxcbiAgICBTdGF0ZVR5cGUsXG4gICAgU2VsZWN0ZWRTdG9yeURhdGFUeXBlIHwgdW5kZWZpbmVkXG4gID4oZ2V0U2VsZWN0ZWRTdG9yeURhdGEpO1xuXG4gIHN0cmljdEFzc2VydChzZWxlY3RlZFN0b3J5RGF0YSwgJ1N0b3J5Vmlld2VyOiAhc2VsZWN0ZWRTdG9yeURhdGEnKTtcblxuICBjb25zdCBjb252ZXJzYXRpb25TZWxlY3RvciA9IHVzZVNlbGVjdG9yPFN0YXRlVHlwZSwgR2V0Q29udmVyc2F0aW9uQnlJZFR5cGU+KFxuICAgIGdldENvbnZlcnNhdGlvblNlbGVjdG9yXG4gICk7XG5cbiAgY29uc3QgZ2V0U3RvcnlCeUlkID0gdXNlU2VsZWN0b3IoZ2V0U3RvcnlCeUlkU2VsZWN0b3IpO1xuXG4gIGNvbnN0IHN0b3J5SW5mbyA9IGdldFN0b3J5QnlJZChcbiAgICBjb252ZXJzYXRpb25TZWxlY3RvcixcbiAgICBzZWxlY3RlZFN0b3J5RGF0YS5tZXNzYWdlSWRcbiAgKTtcbiAgc3RyaWN0QXNzZXJ0KFxuICAgIHN0b3J5SW5mbyxcbiAgICAnU3RvcnlWaWV3ZXI6IHNlbGVjdGVkIHN0b3J5IGRvZXMgbm90IGV4aXN0IGluIHN0b3JpZXMnXG4gICk7XG4gIGNvbnN0IHsgY29udmVyc2F0aW9uU3RvcnksIHN0b3J5VmlldyB9ID0gc3RvcnlJbmZvO1xuXG4gIGNvbnN0IHN0b3J5Vmlld01vZGUgPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIFN0b3J5Vmlld01vZGVUeXBlIHwgdW5kZWZpbmVkPihcbiAgICBzdGF0ZSA9PiBzdGF0ZS5zdG9yaWVzLnN0b3J5Vmlld01vZGVcbiAgKTtcblxuICBjb25zdCByZWNlbnRFbW9qaXMgPSB1c2VSZWNlbnRFbW9qaXMoKTtcbiAgY29uc3Qgc2tpblRvbmUgPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIG51bWJlcj4oZ2V0RW1vamlTa2luVG9uZSk7XG4gIGNvbnN0IHJlcGx5U3RhdGUgPSB1c2VTZWxlY3RvcihnZXRTdG9yeVJlcGxpZXMpO1xuICBjb25zdCBoYXNBbGxTdG9yaWVzTXV0ZWQgPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIGJvb2xlYW4+KFxuICAgIGdldEhhc0FsbFN0b3JpZXNNdXRlZFxuICApO1xuXG4gIGNvbnN0IGhhc0FjdGl2ZUNhbGwgPSB1c2VTZWxlY3Rvcihpc0luRnVsbFNjcmVlbkNhbGwpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0b3J5Vmlld2VyXG4gICAgICBjdXJyZW50SW5kZXg9e3NlbGVjdGVkU3RvcnlEYXRhLmN1cnJlbnRJbmRleH1cbiAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgIGdyb3VwPXtjb252ZXJzYXRpb25TdG9yeS5ncm91cH1cbiAgICAgIGhhc0FjdGl2ZUNhbGw9e2hhc0FjdGl2ZUNhbGx9XG4gICAgICBoYXNBbGxTdG9yaWVzTXV0ZWQ9e2hhc0FsbFN0b3JpZXNNdXRlZH1cbiAgICAgIGkxOG49e2kxOG59XG4gICAgICBudW1TdG9yaWVzPXtzZWxlY3RlZFN0b3J5RGF0YS5udW1TdG9yaWVzfVxuICAgICAgb25IaWRlU3Rvcnk9e3RvZ2dsZUhpZGVTdG9yaWVzfVxuICAgICAgb25Hb1RvQ29udmVyc2F0aW9uPXtzZW5kZXJJZCA9PiB7XG4gICAgICAgIHNob3dDb252ZXJzYXRpb24oeyBjb252ZXJzYXRpb25JZDogc2VuZGVySWQgfSk7XG4gICAgICAgIHN0b3JpZXNBY3Rpb25zLnRvZ2dsZVN0b3JpZXNWaWV3KCk7XG4gICAgICB9fVxuICAgICAgb25SZWFjdFRvU3Rvcnk9e2FzeW5jIChlbW9qaSwgc3RvcnkpID0+IHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlSWQgfSA9IHN0b3J5O1xuICAgICAgICBzdG9yaWVzQWN0aW9ucy5yZWFjdFRvU3RvcnkoZW1vamksIG1lc3NhZ2VJZCk7XG4gICAgICB9fVxuICAgICAgb25SZXBseVRvU3Rvcnk9eyhtZXNzYWdlLCBtZW50aW9ucywgdGltZXN0YW1wLCBzdG9yeSkgPT4ge1xuICAgICAgICBzdG9yaWVzQWN0aW9ucy5yZXBseVRvU3RvcnkoXG4gICAgICAgICAgY29udmVyc2F0aW9uU3RvcnkuY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBtZW50aW9ucyxcbiAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgc3RvcnlcbiAgICAgICAgKTtcbiAgICAgIH19XG4gICAgICBvblNldFNraW5Ub25lPXtvblNldFNraW5Ub25lfVxuICAgICAgb25UZXh0VG9vTG9uZz17KCkgPT4gc2hvd1RvYXN0KFRvYXN0VHlwZS5NZXNzYWdlQm9keVRvb0xvbmcpfVxuICAgICAgb25Vc2VFbW9qaT17b25Vc2VFbW9qaX1cbiAgICAgIHByZWZlcnJlZFJlYWN0aW9uRW1vamk9e3ByZWZlcnJlZFJlYWN0aW9uRW1vaml9XG4gICAgICByZWNlbnRFbW9qaXM9e3JlY2VudEVtb2ppc31cbiAgICAgIHJlbmRlckVtb2ppUGlja2VyPXtyZW5kZXJFbW9qaVBpY2tlcn1cbiAgICAgIHJlcGx5U3RhdGU9e3JlcGx5U3RhdGV9XG4gICAgICBzaG91bGRTaG93RGV0YWlsc01vZGFsPXtzZWxlY3RlZFN0b3J5RGF0YS5zaG91bGRTaG93RGV0YWlsc01vZGFsfVxuICAgICAgc2hvd1RvYXN0PXtzaG93VG9hc3R9XG4gICAgICBza2luVG9uZT17c2tpblRvbmV9XG4gICAgICBzdG9yeT17c3RvcnlWaWV3fVxuICAgICAgc3RvcnlWaWV3TW9kZT17c3RvcnlWaWV3TW9kZX1cbiAgICAgIHRvZ2dsZUhhc0FsbFN0b3JpZXNNdXRlZD17dG9nZ2xlSGFzQWxsU3Rvcmllc011dGVkfVxuICAgICAgey4uLnN0b3JpZXNBY3Rpb25zfVxuICAgIC8+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUE0QjtBQU81Qix5QkFBNEI7QUFDNUIsbUJBQTJDO0FBQzNDLDJCQUF3QztBQUN4QyxtQkFJTztBQUNQLGtCQUF3QjtBQUN4QixvQkFBMEM7QUFDMUMscUJBSU87QUFDUCxxQkFBbUM7QUFDbkMsK0JBQWtDO0FBQ2xDLG9CQUE2QjtBQUM3QixvQkFBK0M7QUFDL0Msb0JBQThDO0FBQzlDLDRCQUF3QztBQUN4QyxxQkFBZ0M7QUFDaEMsc0JBQWtDO0FBRTNCLDRCQUFnRDtBQUNyRCxRQUFNLGlCQUFpQix1Q0FBa0I7QUFDekMsUUFBTSxFQUFFLGVBQWUsNkJBQTZCLDhCQUFnQjtBQUNwRSxRQUFNLEVBQUUsZUFBZSw4QkFBaUI7QUFDeEMsUUFBTSxFQUFFLGtCQUFrQixzQkFBc0IsbURBQXdCO0FBQ3hFLFFBQU0sRUFBRSxjQUFjLGtDQUFnQjtBQUV0QyxRQUFNLE9BQU8sb0NBQXNDLG1CQUFPO0FBQzFELFFBQU0sb0JBQW9CLG9DQUFZLHVDQUF5QjtBQUMvRCxRQUFNLHlCQUF5QixvQ0FDN0Isc0NBQ0Y7QUFFQSxRQUFNLG9CQUFvQixvQ0FHeEIsbUNBQW9CO0FBRXRCLGtDQUFhLG1CQUFtQixpQ0FBaUM7QUFFakUsUUFBTSx1QkFBdUIsb0NBQzNCLDRDQUNGO0FBRUEsUUFBTSxlQUFlLG9DQUFZLG1DQUFvQjtBQUVyRCxRQUFNLFlBQVksYUFDaEIsc0JBQ0Esa0JBQWtCLFNBQ3BCO0FBQ0Esa0NBQ0UsV0FDQSx1REFDRjtBQUNBLFFBQU0sRUFBRSxtQkFBbUIsY0FBYztBQUV6QyxRQUFNLGdCQUFnQixvQ0FDcEIsV0FBUyxNQUFNLFFBQVEsYUFDekI7QUFFQSxRQUFNLGVBQWUsb0NBQWdCO0FBQ3JDLFFBQU0sV0FBVyxvQ0FBK0IsNkJBQWdCO0FBQ2hFLFFBQU0sYUFBYSxvQ0FBWSw4QkFBZTtBQUM5QyxRQUFNLHFCQUFxQixvQ0FDekIsa0NBQ0Y7QUFFQSxRQUFNLGdCQUFnQixvQ0FBWSxpQ0FBa0I7QUFFcEQsU0FDRSxtREFBQztBQUFBLElBQ0MsY0FBYyxrQkFBa0I7QUFBQSxJQUNoQztBQUFBLElBQ0EsT0FBTyxrQkFBa0I7QUFBQSxJQUN6QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxZQUFZLGtCQUFrQjtBQUFBLElBQzlCLGFBQWE7QUFBQSxJQUNiLG9CQUFvQixjQUFZO0FBQzlCLHVCQUFpQixFQUFFLGdCQUFnQixTQUFTLENBQUM7QUFDN0MscUJBQWUsa0JBQWtCO0FBQUEsSUFDbkM7QUFBQSxJQUNBLGdCQUFnQixPQUFPLE9BQU8sVUFBVTtBQUN0QyxZQUFNLEVBQUUsY0FBYztBQUN0QixxQkFBZSxhQUFhLE9BQU8sU0FBUztBQUFBLElBQzlDO0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxTQUFTLFVBQVUsV0FBVyxVQUFVO0FBQ3ZELHFCQUFlLGFBQ2Isa0JBQWtCLGdCQUNsQixTQUNBLFVBQ0EsV0FDQSxLQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxJQUNBLGVBQWUsTUFBTSxVQUFVLHVCQUFVLGtCQUFrQjtBQUFBLElBQzNEO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLElBQ25CO0FBQUEsSUFDQSx3QkFBd0Isa0JBQWtCO0FBQUEsSUFDMUM7QUFBQSxJQUNBO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxPQUNJO0FBQUEsR0FDTjtBQUVKO0FBNUZnQiIsCiAgIm5hbWVzIjogW10KfQo=
