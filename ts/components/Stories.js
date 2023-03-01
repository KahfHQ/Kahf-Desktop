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
  Stories: () => Stories
});
module.exports = __toCommonJS(Stories_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_MyStories = require("./MyStories");
var import_StoriesPane = require("./StoriesPane");
var import_theme = require("../util/theme");
var import_leftPaneWidth = require("../util/leftPaneWidth");
const Stories = /* @__PURE__ */ __name(({
  deleteStoryForEveryone,
  getPreferredBadge,
  hiddenStories,
  i18n,
  me,
  myStories,
  onForwardStory,
  onSaveStory,
  preferredWidthFromStorage,
  queueStoryDownload,
  renderStoryCreator,
  showConversation,
  showStoriesSettings,
  stories,
  toggleHideStories,
  toggleStoriesView,
  viewUserStories,
  viewStory
}) => {
  const width = (0, import_leftPaneWidth.getWidthFromPreferredWidth)(preferredWidthFromStorage, {
    requiresFullWidth: true
  });
  const [addStoryData, setAddStoryData] = (0, import_react.useState)();
  const [isMyStories, setIsMyStories] = (0, import_react.useState)(false);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("Stories", (0, import_theme.themeClassName)(import_theme.Theme.Dark))
  }, addStoryData && renderStoryCreator({
    file: addStoryData.type === "Media" ? addStoryData.file : void 0,
    onClose: () => setAddStoryData(void 0)
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane",
    style: { width }
  }, isMyStories && myStories.length ? /* @__PURE__ */ import_react.default.createElement(import_MyStories.MyStories, {
    i18n,
    myStories,
    onBack: () => setIsMyStories(false),
    onDelete: deleteStoryForEveryone,
    onForward: onForwardStory,
    onSave: onSaveStory,
    queueStoryDownload,
    viewStory
  }) : /* @__PURE__ */ import_react.default.createElement(import_StoriesPane.StoriesPane, {
    getPreferredBadge,
    hiddenStories,
    i18n,
    me,
    myStories,
    onAddStory: (file) => file ? setAddStoryData({ type: "Media", file }) : setAddStoryData({ type: "Text" }),
    onMyStoriesClicked: () => {
      if (myStories.length) {
        setIsMyStories(true);
      } else {
        setAddStoryData({ type: "Text" });
      }
    },
    onStoriesSettings: showStoriesSettings,
    queueStoryDownload,
    showConversation,
    stories,
    toggleHideStories,
    toggleStoriesView,
    viewUserStories
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__placeholder"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__placeholder__stories"
  }), i18n("Stories__placeholder--text")));
}, "Stories");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Stories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvblR5cGUsXG4gIFNob3dDb252ZXJzYXRpb25UeXBlLFxufSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uU3RvcnlUeXBlLFxuICBNeVN0b3J5VHlwZSxcbiAgU3RvcnlWaWV3VHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIGFzIFNtYXJ0U3RvcnlDcmVhdG9yUHJvcHNUeXBlIH0gZnJvbSAnLi4vc3RhdGUvc21hcnQvU3RvcnlDcmVhdG9yJztcbmltcG9ydCB0eXBlIHsgVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCB7IE15U3RvcmllcyB9IGZyb20gJy4vTXlTdG9yaWVzJztcbmltcG9ydCB7IFN0b3JpZXNQYW5lIH0gZnJvbSAnLi9TdG9yaWVzUGFuZSc7XG5pbXBvcnQgeyBUaGVtZSwgdGhlbWVDbGFzc05hbWUgfSBmcm9tICcuLi91dGlsL3RoZW1lJztcbmltcG9ydCB7IGdldFdpZHRoRnJvbVByZWZlcnJlZFdpZHRoIH0gZnJvbSAnLi4vdXRpbC9sZWZ0UGFuZVdpZHRoJztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBkZWxldGVTdG9yeUZvckV2ZXJ5b25lOiAoc3Rvcnk6IFN0b3J5Vmlld1R5cGUpID0+IHVua25vd247XG4gIGdldFByZWZlcnJlZEJhZGdlOiBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZTtcbiAgaGlkZGVuU3RvcmllczogQXJyYXk8Q29udmVyc2F0aW9uU3RvcnlUeXBlPjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbWU6IENvbnZlcnNhdGlvblR5cGU7XG4gIG15U3RvcmllczogQXJyYXk8TXlTdG9yeVR5cGU+O1xuICBvbkZvcndhcmRTdG9yeTogKHN0b3J5SWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb25TYXZlU3Rvcnk6IChzdG9yeTogU3RvcnlWaWV3VHlwZSkgPT4gdW5rbm93bjtcbiAgcHJlZmVycmVkV2lkdGhGcm9tU3RvcmFnZTogbnVtYmVyO1xuICBxdWV1ZVN0b3J5RG93bmxvYWQ6IChzdG9yeUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHJlbmRlclN0b3J5Q3JlYXRvcjogKHByb3BzOiBTbWFydFN0b3J5Q3JlYXRvclByb3BzVHlwZSkgPT4gSlNYLkVsZW1lbnQ7XG4gIHNob3dDb252ZXJzYXRpb246IFNob3dDb252ZXJzYXRpb25UeXBlO1xuICBzaG93U3Rvcmllc1NldHRpbmdzOiAoKSA9PiB1bmtub3duO1xuICBzdG9yaWVzOiBBcnJheTxDb252ZXJzYXRpb25TdG9yeVR5cGU+O1xuICB0b2dnbGVIaWRlU3RvcmllczogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHRvZ2dsZVN0b3JpZXNWaWV3OiAoKSA9PiB1bmtub3duO1xuICB2aWV3VXNlclN0b3JpZXM6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICB2aWV3U3Rvcnk6IFZpZXdTdG9yeUFjdGlvbkNyZWF0b3JUeXBlO1xufTtcblxudHlwZSBBZGRTdG9yeVR5cGUgPVxuICB8IHtcbiAgICAgIHR5cGU6ICdNZWRpYSc7XG4gICAgICBmaWxlOiBGaWxlO1xuICAgIH1cbiAgfCB7IHR5cGU6ICdUZXh0JyB9XG4gIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgY29uc3QgU3RvcmllcyA9ICh7XG4gIGRlbGV0ZVN0b3J5Rm9yRXZlcnlvbmUsXG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBoaWRkZW5TdG9yaWVzLFxuICBpMThuLFxuICBtZSxcbiAgbXlTdG9yaWVzLFxuICBvbkZvcndhcmRTdG9yeSxcbiAgb25TYXZlU3RvcnksXG4gIHByZWZlcnJlZFdpZHRoRnJvbVN0b3JhZ2UsXG4gIHF1ZXVlU3RvcnlEb3dubG9hZCxcbiAgcmVuZGVyU3RvcnlDcmVhdG9yLFxuICBzaG93Q29udmVyc2F0aW9uLFxuICBzaG93U3Rvcmllc1NldHRpbmdzLFxuICBzdG9yaWVzLFxuICB0b2dnbGVIaWRlU3RvcmllcyxcbiAgdG9nZ2xlU3Rvcmllc1ZpZXcsXG4gIHZpZXdVc2VyU3RvcmllcyxcbiAgdmlld1N0b3J5LFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCB3aWR0aCA9IGdldFdpZHRoRnJvbVByZWZlcnJlZFdpZHRoKHByZWZlcnJlZFdpZHRoRnJvbVN0b3JhZ2UsIHtcbiAgICByZXF1aXJlc0Z1bGxXaWR0aDogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3QgW2FkZFN0b3J5RGF0YSwgc2V0QWRkU3RvcnlEYXRhXSA9IHVzZVN0YXRlPEFkZFN0b3J5VHlwZT4oKTtcbiAgY29uc3QgW2lzTXlTdG9yaWVzLCBzZXRJc015U3Rvcmllc10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnU3RvcmllcycsIHRoZW1lQ2xhc3NOYW1lKFRoZW1lLkRhcmspKX0+XG4gICAgICB7YWRkU3RvcnlEYXRhICYmXG4gICAgICAgIHJlbmRlclN0b3J5Q3JlYXRvcih7XG4gICAgICAgICAgZmlsZTogYWRkU3RvcnlEYXRhLnR5cGUgPT09ICdNZWRpYScgPyBhZGRTdG9yeURhdGEuZmlsZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBvbkNsb3NlOiAoKSA9PiBzZXRBZGRTdG9yeURhdGEodW5kZWZpbmVkKSxcbiAgICAgICAgfSl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVcIiBzdHlsZT17eyB3aWR0aCB9fT5cbiAgICAgICAge2lzTXlTdG9yaWVzICYmIG15U3Rvcmllcy5sZW5ndGggPyAoXG4gICAgICAgICAgPE15U3Rvcmllc1xuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIG15U3Rvcmllcz17bXlTdG9yaWVzfVxuICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRJc015U3RvcmllcyhmYWxzZSl9XG4gICAgICAgICAgICBvbkRlbGV0ZT17ZGVsZXRlU3RvcnlGb3JFdmVyeW9uZX1cbiAgICAgICAgICAgIG9uRm9yd2FyZD17b25Gb3J3YXJkU3Rvcnl9XG4gICAgICAgICAgICBvblNhdmU9e29uU2F2ZVN0b3J5fVxuICAgICAgICAgICAgcXVldWVTdG9yeURvd25sb2FkPXtxdWV1ZVN0b3J5RG93bmxvYWR9XG4gICAgICAgICAgICB2aWV3U3Rvcnk9e3ZpZXdTdG9yeX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxTdG9yaWVzUGFuZVxuICAgICAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgICAgICAgaGlkZGVuU3Rvcmllcz17aGlkZGVuU3Rvcmllc31cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBtZT17bWV9XG4gICAgICAgICAgICBteVN0b3JpZXM9e215U3Rvcmllc31cbiAgICAgICAgICAgIG9uQWRkU3Rvcnk9e2ZpbGUgPT5cbiAgICAgICAgICAgICAgZmlsZVxuICAgICAgICAgICAgICAgID8gc2V0QWRkU3RvcnlEYXRhKHsgdHlwZTogJ01lZGlhJywgZmlsZSB9KVxuICAgICAgICAgICAgICAgIDogc2V0QWRkU3RvcnlEYXRhKHsgdHlwZTogJ1RleHQnIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbk15U3Rvcmllc0NsaWNrZWQ9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG15U3Rvcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzZXRJc015U3Rvcmllcyh0cnVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRBZGRTdG9yeURhdGEoeyB0eXBlOiAnVGV4dCcgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvblN0b3JpZXNTZXR0aW5ncz17c2hvd1N0b3JpZXNTZXR0aW5nc31cbiAgICAgICAgICAgIHF1ZXVlU3RvcnlEb3dubG9hZD17cXVldWVTdG9yeURvd25sb2FkfVxuICAgICAgICAgICAgc2hvd0NvbnZlcnNhdGlvbj17c2hvd0NvbnZlcnNhdGlvbn1cbiAgICAgICAgICAgIHN0b3JpZXM9e3N0b3JpZXN9XG4gICAgICAgICAgICB0b2dnbGVIaWRlU3Rvcmllcz17dG9nZ2xlSGlkZVN0b3JpZXN9XG4gICAgICAgICAgICB0b2dnbGVTdG9yaWVzVmlldz17dG9nZ2xlU3Rvcmllc1ZpZXd9XG4gICAgICAgICAgICB2aWV3VXNlclN0b3JpZXM9e3ZpZXdVc2VyU3Rvcmllc31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BsYWNlaG9sZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc19fcGxhY2Vob2xkZXJfX3N0b3JpZXNcIiAvPlxuICAgICAgICB7aTE4bignU3Rvcmllc19fcGxhY2Vob2xkZXItLXRleHQnKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBZ0M7QUFDaEMsd0JBQXVCO0FBY3ZCLHVCQUEwQjtBQUMxQix5QkFBNEI7QUFDNUIsbUJBQXNDO0FBQ3RDLDJCQUEyQztBQStCcEMsTUFBTSxVQUFVLHdCQUFDO0FBQUEsRUFDdEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE1BQzRCO0FBQzVCLFFBQU0sUUFBUSxxREFBMkIsMkJBQTJCO0FBQUEsSUFDbEUsbUJBQW1CO0FBQUEsRUFDckIsQ0FBQztBQUVELFFBQU0sQ0FBQyxjQUFjLG1CQUFtQiwyQkFBdUI7QUFDL0QsUUFBTSxDQUFDLGFBQWEsa0JBQWtCLDJCQUFTLEtBQUs7QUFFcEQsU0FDRSxtREFBQztBQUFBLElBQUksV0FBVywrQkFBVyxXQUFXLGlDQUFlLG1CQUFNLElBQUksQ0FBQztBQUFBLEtBQzdELGdCQUNDLG1CQUFtQjtBQUFBLElBQ2pCLE1BQU0sYUFBYSxTQUFTLFVBQVUsYUFBYSxPQUFPO0FBQUEsSUFDMUQsU0FBUyxNQUFNLGdCQUFnQixNQUFTO0FBQUEsRUFDMUMsQ0FBQyxHQUNILG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsSUFBZ0IsT0FBTyxFQUFFLE1BQU07QUFBQSxLQUMzQyxlQUFlLFVBQVUsU0FDeEIsbURBQUM7QUFBQSxJQUNDO0FBQUEsSUFDQTtBQUFBLElBQ0EsUUFBUSxNQUFNLGVBQWUsS0FBSztBQUFBLElBQ2xDLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLEdBQ0YsSUFFQSxtREFBQztBQUFBLElBQ0M7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxZQUFZLFVBQ1YsT0FDSSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsS0FBSyxDQUFDLElBQ3ZDLGdCQUFnQixFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQUEsSUFFdEMsb0JBQW9CLE1BQU07QUFDeEIsVUFBSSxVQUFVLFFBQVE7QUFDcEIsdUJBQWUsSUFBSTtBQUFBLE1BQ3JCLE9BQU87QUFDTCx3QkFBZ0IsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUFBLE1BQ2xDO0FBQUEsSUFDRjtBQUFBLElBQ0EsbUJBQW1CO0FBQUEsSUFDbkI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEdBQ0YsQ0FFSixHQUNBLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEdBQWdDLEdBQzlDLEtBQUssNEJBQTRCLENBQ3BDLENBQ0Y7QUFFSixHQWpGdUI7IiwKICAibmFtZXMiOiBbXQp9Cg==
