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
var Stories_exports = {};
__export(Stories_exports, {
  SmartStories: () => SmartStories
});
module.exports = __toCommonJS(Stories_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_StoryCreator = require("./StoryCreator");
var import_Stories = require("../../components/Stories");
var import_conversations = require("../selectors/conversations");
var import_user = require("../selectors/user");
var import_badges = require("../selectors/badges");
var import_items = require("../selectors/items");
var import_stories = require("../selectors/stories");
var import_saveAttachment = require("../../util/saveAttachment");
var import_conversations2 = require("../ducks/conversations");
var import_globalModals = require("../ducks/globalModals");
var import_stories2 = require("../ducks/stories");
function renderStoryCreator({
  file,
  onClose
}) {
  return /* @__PURE__ */ import_react.default.createElement(import_StoryCreator.SmartStoryCreator, {
    file,
    onClose
  });
}
function SmartStories() {
  const storiesActions = (0, import_stories2.useStoriesActions)();
  const { showConversation, toggleHideStories } = (0, import_conversations2.useConversationsActions)();
  const { showStoriesSettings, toggleForwardMessageModal } = (0, import_globalModals.useGlobalModalActions)();
  const i18n = (0, import_react_redux.useSelector)(import_user.getIntl);
  const isShowingStoriesView = (0, import_react_redux.useSelector)((state) => state.stories.isShowingStoriesView);
  const preferredWidthFromStorage = (0, import_react_redux.useSelector)(import_items.getPreferredLeftPaneWidth);
  const getPreferredBadge = (0, import_react_redux.useSelector)(import_badges.getPreferredBadgeSelector);
  const { hiddenStories, myStories, stories } = (0, import_react_redux.useSelector)(import_stories.getStories);
  const me = (0, import_react_redux.useSelector)(import_conversations.getMe);
  if (!isShowingStoriesView) {
    return null;
  }
  return /* @__PURE__ */ import_react.default.createElement(import_Stories.Stories, {
    getPreferredBadge,
    hiddenStories,
    i18n,
    me,
    myStories,
    onForwardStory: (storyId) => {
      toggleForwardMessageModal(storyId);
    },
    onSaveStory: (story) => {
      if (story.attachment) {
        (0, import_saveAttachment.saveAttachment)(story.attachment, story.timestamp);
      }
    },
    preferredWidthFromStorage,
    renderStoryCreator,
    showConversation,
    showStoriesSettings,
    stories,
    toggleHideStories,
    ...storiesActions
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVNlbGVjdG9yIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgU3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSBhcyBTbWFydFN0b3J5Q3JlYXRvclByb3BzVHlwZSB9IGZyb20gJy4vU3RvcnlDcmVhdG9yJztcbmltcG9ydCB7IFNtYXJ0U3RvcnlDcmVhdG9yIH0gZnJvbSAnLi9TdG9yeUNyZWF0b3InO1xuaW1wb3J0IHsgU3RvcmllcyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvU3Rvcmllcyc7XG5pbXBvcnQgeyBnZXRNZSB9IGZyb20gJy4uL3NlbGVjdG9ycy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldEludGwgfSBmcm9tICcuLi9zZWxlY3RvcnMvdXNlcic7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRMZWZ0UGFuZVdpZHRoIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2l0ZW1zJztcbmltcG9ydCB7IGdldFN0b3JpZXMgfSBmcm9tICcuLi9zZWxlY3RvcnMvc3Rvcmllcyc7XG5pbXBvcnQgeyBzYXZlQXR0YWNobWVudCB9IGZyb20gJy4uLy4uL3V0aWwvc2F2ZUF0dGFjaG1lbnQnO1xuaW1wb3J0IHsgdXNlQ29udmVyc2F0aW9uc0FjdGlvbnMgfSBmcm9tICcuLi9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IHVzZUdsb2JhbE1vZGFsQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyB1c2VTdG9yaWVzQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL3N0b3JpZXMnO1xuXG5mdW5jdGlvbiByZW5kZXJTdG9yeUNyZWF0b3Ioe1xuICBmaWxlLFxuICBvbkNsb3NlLFxufTogU21hcnRTdG9yeUNyZWF0b3JQcm9wc1R5cGUpOiBKU1guRWxlbWVudCB7XG4gIHJldHVybiA8U21hcnRTdG9yeUNyZWF0b3IgZmlsZT17ZmlsZX0gb25DbG9zZT17b25DbG9zZX0gLz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTbWFydFN0b3JpZXMoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3Qgc3Rvcmllc0FjdGlvbnMgPSB1c2VTdG9yaWVzQWN0aW9ucygpO1xuICBjb25zdCB7IHNob3dDb252ZXJzYXRpb24sIHRvZ2dsZUhpZGVTdG9yaWVzIH0gPSB1c2VDb252ZXJzYXRpb25zQWN0aW9ucygpO1xuICBjb25zdCB7IHNob3dTdG9yaWVzU2V0dGluZ3MsIHRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWwgfSA9XG4gICAgdXNlR2xvYmFsTW9kYWxBY3Rpb25zKCk7XG5cbiAgY29uc3QgaTE4biA9IHVzZVNlbGVjdG9yPFN0YXRlVHlwZSwgTG9jYWxpemVyVHlwZT4oZ2V0SW50bCk7XG5cbiAgY29uc3QgaXNTaG93aW5nU3Rvcmllc1ZpZXcgPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIGJvb2xlYW4+KFxuICAgIChzdGF0ZTogU3RhdGVUeXBlKSA9PiBzdGF0ZS5zdG9yaWVzLmlzU2hvd2luZ1N0b3JpZXNWaWV3XG4gICk7XG5cbiAgY29uc3QgcHJlZmVycmVkV2lkdGhGcm9tU3RvcmFnZSA9IHVzZVNlbGVjdG9yPFN0YXRlVHlwZSwgbnVtYmVyPihcbiAgICBnZXRQcmVmZXJyZWRMZWZ0UGFuZVdpZHRoXG4gICk7XG4gIGNvbnN0IGdldFByZWZlcnJlZEJhZGdlID0gdXNlU2VsZWN0b3IoZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3Rvcik7XG5cbiAgY29uc3QgeyBoaWRkZW5TdG9yaWVzLCBteVN0b3JpZXMsIHN0b3JpZXMgfSA9IHVzZVNlbGVjdG9yKGdldFN0b3JpZXMpO1xuXG4gIGNvbnN0IG1lID0gdXNlU2VsZWN0b3IoZ2V0TWUpO1xuXG4gIGlmICghaXNTaG93aW5nU3Rvcmllc1ZpZXcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0b3JpZXNcbiAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgIGhpZGRlblN0b3JpZXM9e2hpZGRlblN0b3JpZXN9XG4gICAgICBpMThuPXtpMThufVxuICAgICAgbWU9e21lfVxuICAgICAgbXlTdG9yaWVzPXtteVN0b3JpZXN9XG4gICAgICBvbkZvcndhcmRTdG9yeT17c3RvcnlJZCA9PiB7XG4gICAgICAgIHRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWwoc3RvcnlJZCk7XG4gICAgICB9fVxuICAgICAgb25TYXZlU3Rvcnk9e3N0b3J5ID0+IHtcbiAgICAgICAgaWYgKHN0b3J5LmF0dGFjaG1lbnQpIHtcbiAgICAgICAgICBzYXZlQXR0YWNobWVudChzdG9yeS5hdHRhY2htZW50LCBzdG9yeS50aW1lc3RhbXApO1xuICAgICAgICB9XG4gICAgICB9fVxuICAgICAgcHJlZmVycmVkV2lkdGhGcm9tU3RvcmFnZT17cHJlZmVycmVkV2lkdGhGcm9tU3RvcmFnZX1cbiAgICAgIHJlbmRlclN0b3J5Q3JlYXRvcj17cmVuZGVyU3RvcnlDcmVhdG9yfVxuICAgICAgc2hvd0NvbnZlcnNhdGlvbj17c2hvd0NvbnZlcnNhdGlvbn1cbiAgICAgIHNob3dTdG9yaWVzU2V0dGluZ3M9e3Nob3dTdG9yaWVzU2V0dGluZ3N9XG4gICAgICBzdG9yaWVzPXtzdG9yaWVzfVxuICAgICAgdG9nZ2xlSGlkZVN0b3JpZXM9e3RvZ2dsZUhpZGVTdG9yaWVzfVxuICAgICAgey4uLnN0b3JpZXNBY3Rpb25zfVxuICAgIC8+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUE0QjtBQUs1QiwwQkFBa0M7QUFDbEMscUJBQXdCO0FBQ3hCLDJCQUFzQjtBQUN0QixrQkFBd0I7QUFDeEIsb0JBQTBDO0FBQzFDLG1CQUEwQztBQUMxQyxxQkFBMkI7QUFDM0IsNEJBQStCO0FBQy9CLDRCQUF3QztBQUN4QywwQkFBc0M7QUFDdEMsc0JBQWtDO0FBRWxDLDRCQUE0QjtBQUFBLEVBQzFCO0FBQUEsRUFDQTtBQUFBLEdBQzBDO0FBQzFDLFNBQU8sbURBQUM7QUFBQSxJQUFrQjtBQUFBLElBQVk7QUFBQSxHQUFrQjtBQUMxRDtBQUxTLEFBT0Ysd0JBQTRDO0FBQ2pELFFBQU0saUJBQWlCLHVDQUFrQjtBQUN6QyxRQUFNLEVBQUUsa0JBQWtCLHNCQUFzQixtREFBd0I7QUFDeEUsUUFBTSxFQUFFLHFCQUFxQiw4QkFDM0IsK0NBQXNCO0FBRXhCLFFBQU0sT0FBTyxvQ0FBc0MsbUJBQU87QUFFMUQsUUFBTSx1QkFBdUIsb0NBQzNCLENBQUMsVUFBcUIsTUFBTSxRQUFRLG9CQUN0QztBQUVBLFFBQU0sNEJBQTRCLG9DQUNoQyxzQ0FDRjtBQUNBLFFBQU0sb0JBQW9CLG9DQUFZLHVDQUF5QjtBQUUvRCxRQUFNLEVBQUUsZUFBZSxXQUFXLFlBQVksb0NBQVkseUJBQVU7QUFFcEUsUUFBTSxLQUFLLG9DQUFZLDBCQUFLO0FBRTVCLE1BQUksQ0FBQyxzQkFBc0I7QUFDekIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUNFLG1EQUFDO0FBQUEsSUFDQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLGdCQUFnQixhQUFXO0FBQ3pCLGdDQUEwQixPQUFPO0FBQUEsSUFDbkM7QUFBQSxJQUNBLGFBQWEsV0FBUztBQUNwQixVQUFJLE1BQU0sWUFBWTtBQUNwQixrREFBZSxNQUFNLFlBQVksTUFBTSxTQUFTO0FBQUEsTUFDbEQ7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsT0FDSTtBQUFBLEdBQ047QUFFSjtBQWpEZ0IiLAogICJuYW1lcyI6IFtdCn0K
