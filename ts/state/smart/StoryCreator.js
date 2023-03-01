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
var StoryCreator_exports = {};
__export(StoryCreator_exports, {
  SmartStoryCreator: () => SmartStoryCreator
});
module.exports = __toCommonJS(StoryCreator_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_LinkPreview = require("../../types/LinkPreview");
var import_StoryCreator = require("../../components/StoryCreator");
var import_conversations = require("../selectors/conversations");
var import_storyDistributionLists = require("../selectors/storyDistributionLists");
var import_user = require("../selectors/user");
var import_stickers = require("../selectors/stickers");
var import_linkPreviews = require("../selectors/linkPreviews");
var import_badges = require("../selectors/badges");
var import_processAttachment = require("../../util/processAttachment");
var import_conversations2 = require("../ducks/conversations");
var import_linkPreviews2 = require("../ducks/linkPreviews");
var import_stories = require("../ducks/stories");
var import_storyDistributionLists2 = require("../ducks/storyDistributionLists");
function SmartStoryCreator({
  file,
  onClose
}) {
  const { debouncedMaybeGrabLinkPreview } = (0, import_linkPreviews2.useLinkPreviewActions)();
  const { sendStoryMessage } = (0, import_stories.useStoriesActions)();
  const { tagGroupsAsNewGroupStory } = (0, import_conversations2.useConversationsActions)();
  const { createDistributionList } = (0, import_storyDistributionLists2.useStoryDistributionListsActions)();
  const candidateConversations = (0, import_react_redux.useSelector)(import_conversations.getCandidateContactsForNewGroup);
  const distributionLists = (0, import_react_redux.useSelector)(import_storyDistributionLists.getDistributionLists);
  const getPreferredBadge = (0, import_react_redux.useSelector)(import_badges.getPreferredBadgeSelector);
  const groupConversations = (0, import_react_redux.useSelector)(import_conversations.getNonGroupStories);
  const groupStories = (0, import_react_redux.useSelector)(import_conversations.getGroupStories);
  const i18n = (0, import_react_redux.useSelector)(import_user.getIntl);
  const installedPacks = (0, import_react_redux.useSelector)(import_stickers.getInstalledStickerPacks);
  const linkPreviewForSource = (0, import_react_redux.useSelector)(import_linkPreviews.getLinkPreview);
  const me = (0, import_react_redux.useSelector)(import_conversations.getMe);
  const recentStickers = (0, import_react_redux.useSelector)(import_stickers.getRecentStickers);
  const signalConnections = (0, import_react_redux.useSelector)(import_conversations.getAllSignalConnections);
  return /* @__PURE__ */ import_react.default.createElement(import_StoryCreator.StoryCreator, {
    candidateConversations,
    debouncedMaybeGrabLinkPreview,
    distributionLists,
    file,
    getPreferredBadge,
    groupConversations,
    groupStories,
    i18n,
    installedPacks,
    linkPreview: linkPreviewForSource(import_LinkPreview.LinkPreviewSourceType.StoryCreator),
    me,
    onClose,
    onDistributionListCreated: createDistributionList,
    onSend: sendStoryMessage,
    processAttachment: import_processAttachment.processAttachment,
    recentStickers,
    signalConnections,
    tagGroupsAsNewGroupStory
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartStoryCreator
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlDcmVhdG9yLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB7IExpbmtQcmV2aWV3U291cmNlVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB7IFN0b3J5Q3JlYXRvciB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvU3RvcnlDcmVhdG9yJztcbmltcG9ydCB7XG4gIGdldEFsbFNpZ25hbENvbm5lY3Rpb25zLFxuICBnZXRDYW5kaWRhdGVDb250YWN0c0Zvck5ld0dyb3VwLFxuICBnZXRHcm91cFN0b3JpZXMsXG4gIGdldE1lLFxuICBnZXROb25Hcm91cFN0b3JpZXMsXG59IGZyb20gJy4uL3NlbGVjdG9ycy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldERpc3RyaWJ1dGlvbkxpc3RzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgZ2V0SW50bCB9IGZyb20gJy4uL3NlbGVjdG9ycy91c2VyJztcbmltcG9ydCB7XG4gIGdldEluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgZ2V0UmVjZW50U3RpY2tlcnMsXG59IGZyb20gJy4uL3NlbGVjdG9ycy9zdGlja2Vycyc7XG5pbXBvcnQgeyBnZXRMaW5rUHJldmlldyB9IGZyb20gJy4uL3NlbGVjdG9ycy9saW5rUHJldmlld3MnO1xuaW1wb3J0IHsgZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHsgcHJvY2Vzc0F0dGFjaG1lbnQgfSBmcm9tICcuLi8uLi91dGlsL3Byb2Nlc3NBdHRhY2htZW50JztcbmltcG9ydCB7IHVzZUNvbnZlcnNhdGlvbnNBY3Rpb25zIH0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyB1c2VMaW5rUHJldmlld0FjdGlvbnMgfSBmcm9tICcuLi9kdWNrcy9saW5rUHJldmlld3MnO1xuaW1wb3J0IHsgdXNlU3Rvcmllc0FjdGlvbnMgfSBmcm9tICcuLi9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCB7IHVzZVN0b3J5RGlzdHJpYnV0aW9uTGlzdHNBY3Rpb25zIH0gZnJvbSAnLi4vZHVja3Mvc3RvcnlEaXN0cmlidXRpb25MaXN0cyc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgZmlsZT86IEZpbGU7XG4gIG9uQ2xvc2U6ICgpID0+IHVua25vd247XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gU21hcnRTdG9yeUNyZWF0b3Ioe1xuICBmaWxlLFxuICBvbkNsb3NlLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgeyBkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldyB9ID0gdXNlTGlua1ByZXZpZXdBY3Rpb25zKCk7XG4gIGNvbnN0IHsgc2VuZFN0b3J5TWVzc2FnZSB9ID0gdXNlU3Rvcmllc0FjdGlvbnMoKTtcbiAgY29uc3QgeyB0YWdHcm91cHNBc05ld0dyb3VwU3RvcnkgfSA9IHVzZUNvbnZlcnNhdGlvbnNBY3Rpb25zKCk7XG4gIGNvbnN0IHsgY3JlYXRlRGlzdHJpYnV0aW9uTGlzdCB9ID0gdXNlU3RvcnlEaXN0cmlidXRpb25MaXN0c0FjdGlvbnMoKTtcblxuICBjb25zdCBjYW5kaWRhdGVDb252ZXJzYXRpb25zID0gdXNlU2VsZWN0b3IoZ2V0Q2FuZGlkYXRlQ29udGFjdHNGb3JOZXdHcm91cCk7XG4gIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gdXNlU2VsZWN0b3IoZ2V0RGlzdHJpYnV0aW9uTGlzdHMpO1xuICBjb25zdCBnZXRQcmVmZXJyZWRCYWRnZSA9IHVzZVNlbGVjdG9yKGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3IpO1xuICBjb25zdCBncm91cENvbnZlcnNhdGlvbnMgPSB1c2VTZWxlY3RvcihnZXROb25Hcm91cFN0b3JpZXMpO1xuICBjb25zdCBncm91cFN0b3JpZXMgPSB1c2VTZWxlY3RvcihnZXRHcm91cFN0b3JpZXMpO1xuICBjb25zdCBpMThuID0gdXNlU2VsZWN0b3I8U3RhdGVUeXBlLCBMb2NhbGl6ZXJUeXBlPihnZXRJbnRsKTtcbiAgY29uc3QgaW5zdGFsbGVkUGFja3MgPSB1c2VTZWxlY3RvcihnZXRJbnN0YWxsZWRTdGlja2VyUGFja3MpO1xuICBjb25zdCBsaW5rUHJldmlld0ZvclNvdXJjZSA9IHVzZVNlbGVjdG9yKGdldExpbmtQcmV2aWV3KTtcbiAgY29uc3QgbWUgPSB1c2VTZWxlY3RvcihnZXRNZSk7XG4gIGNvbnN0IHJlY2VudFN0aWNrZXJzID0gdXNlU2VsZWN0b3IoZ2V0UmVjZW50U3RpY2tlcnMpO1xuICBjb25zdCBzaWduYWxDb25uZWN0aW9ucyA9IHVzZVNlbGVjdG9yKGdldEFsbFNpZ25hbENvbm5lY3Rpb25zKTtcblxuICByZXR1cm4gKFxuICAgIDxTdG9yeUNyZWF0b3JcbiAgICAgIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnM9e2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnN9XG4gICAgICBkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldz17ZGVib3VuY2VkTWF5YmVHcmFiTGlua1ByZXZpZXd9XG4gICAgICBkaXN0cmlidXRpb25MaXN0cz17ZGlzdHJpYnV0aW9uTGlzdHN9XG4gICAgICBmaWxlPXtmaWxlfVxuICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgZ3JvdXBDb252ZXJzYXRpb25zPXtncm91cENvbnZlcnNhdGlvbnN9XG4gICAgICBncm91cFN0b3JpZXM9e2dyb3VwU3Rvcmllc31cbiAgICAgIGkxOG49e2kxOG59XG4gICAgICBpbnN0YWxsZWRQYWNrcz17aW5zdGFsbGVkUGFja3N9XG4gICAgICBsaW5rUHJldmlldz17bGlua1ByZXZpZXdGb3JTb3VyY2UoTGlua1ByZXZpZXdTb3VyY2VUeXBlLlN0b3J5Q3JlYXRvcil9XG4gICAgICBtZT17bWV9XG4gICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZD17Y3JlYXRlRGlzdHJpYnV0aW9uTGlzdH1cbiAgICAgIG9uU2VuZD17c2VuZFN0b3J5TWVzc2FnZX1cbiAgICAgIHByb2Nlc3NBdHRhY2htZW50PXtwcm9jZXNzQXR0YWNobWVudH1cbiAgICAgIHJlY2VudFN0aWNrZXJzPXtyZWNlbnRTdGlja2Vyc31cbiAgICAgIHNpZ25hbENvbm5lY3Rpb25zPXtzaWduYWxDb25uZWN0aW9uc31cbiAgICAgIHRhZ0dyb3Vwc0FzTmV3R3JvdXBTdG9yeT17dGFnR3JvdXBzQXNOZXdHcm91cFN0b3J5fVxuICAgIC8+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUE0QjtBQUk1Qix5QkFBc0M7QUFDdEMsMEJBQTZCO0FBQzdCLDJCQU1PO0FBQ1Asb0NBQXFDO0FBQ3JDLGtCQUF3QjtBQUN4QixzQkFHTztBQUNQLDBCQUErQjtBQUMvQixvQkFBMEM7QUFDMUMsK0JBQWtDO0FBQ2xDLDRCQUF3QztBQUN4QywyQkFBc0M7QUFDdEMscUJBQWtDO0FBQ2xDLHFDQUFpRDtBQU8xQywyQkFBMkI7QUFBQSxFQUNoQztBQUFBLEVBQ0E7QUFBQSxHQUNnQztBQUNoQyxRQUFNLEVBQUUsa0NBQWtDLGdEQUFzQjtBQUNoRSxRQUFNLEVBQUUscUJBQXFCLHNDQUFrQjtBQUMvQyxRQUFNLEVBQUUsNkJBQTZCLG1EQUF3QjtBQUM3RCxRQUFNLEVBQUUsMkJBQTJCLHFFQUFpQztBQUVwRSxRQUFNLHlCQUF5QixvQ0FBWSxvREFBK0I7QUFDMUUsUUFBTSxvQkFBb0Isb0NBQVksa0RBQW9CO0FBQzFELFFBQU0sb0JBQW9CLG9DQUFZLHVDQUF5QjtBQUMvRCxRQUFNLHFCQUFxQixvQ0FBWSx1Q0FBa0I7QUFDekQsUUFBTSxlQUFlLG9DQUFZLG9DQUFlO0FBQ2hELFFBQU0sT0FBTyxvQ0FBc0MsbUJBQU87QUFDMUQsUUFBTSxpQkFBaUIsb0NBQVksd0NBQXdCO0FBQzNELFFBQU0sdUJBQXVCLG9DQUFZLGtDQUFjO0FBQ3ZELFFBQU0sS0FBSyxvQ0FBWSwwQkFBSztBQUM1QixRQUFNLGlCQUFpQixvQ0FBWSxpQ0FBaUI7QUFDcEQsUUFBTSxvQkFBb0Isb0NBQVksNENBQXVCO0FBRTdELFNBQ0UsbURBQUM7QUFBQSxJQUNDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLGFBQWEscUJBQXFCLHlDQUFzQixZQUFZO0FBQUEsSUFDcEU7QUFBQSxJQUNBO0FBQUEsSUFDQSwyQkFBMkI7QUFBQSxJQUMzQixRQUFRO0FBQUEsSUFDUixtQkFBbUI7QUFBQSxJQUNuQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsR0FDRjtBQUVKO0FBM0NnQiIsCiAgIm5hbWVzIjogW10KfQo=
