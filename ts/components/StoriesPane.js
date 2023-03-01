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
var StoriesPane_exports = {};
__export(StoriesPane_exports, {
  StoriesPane: () => StoriesPane
});
module.exports = __toCommonJS(StoriesPane_exports);
var import_fuse = __toESM(require("fuse.js"));
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_ContextMenu = require("./ContextMenu");
var import_MyStoriesButton = require("./MyStoriesButton");
var import_SearchInput = require("./SearchInput");
var import_StoryListItem = require("./StoryListItem");
var import_theme = require("../util/theme");
var import_isNotNil = require("../util/isNotNil");
const FUSE_OPTIONS = {
  getFn: (story, path) => {
    if (path === "searchNames") {
      return [story.storyView.sender.title, story.storyView.sender.name].filter(import_isNotNil.isNotNil);
    }
    return story.group?.title ?? "";
  },
  keys: [
    {
      name: "searchNames",
      weight: 1
    },
    {
      name: "group",
      weight: 1
    }
  ],
  threshold: 0.1
};
function search(stories, searchTerm) {
  return new import_fuse.default(stories, FUSE_OPTIONS).search(searchTerm).map((result) => result.item);
}
function getNewestMyStory(story) {
  return story.stories[story.stories.length - 1];
}
const StoriesPane = /* @__PURE__ */ __name(({
  getPreferredBadge,
  hiddenStories,
  i18n,
  me,
  myStories,
  onAddStory,
  onMyStoriesClicked,
  onStoriesSettings,
  queueStoryDownload,
  showConversation,
  stories,
  toggleHideStories,
  toggleStoriesView,
  viewUserStories
}) => {
  const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
  const [isShowingHiddenStories, setIsShowingHiddenStories] = (0, import_react.useState)(false);
  const [renderedStories, setRenderedStories] = (0, import_react.useState)(stories);
  (0, import_react.useEffect)(() => {
    if (searchTerm) {
      setRenderedStories(search(stories, searchTerm));
    } else {
      setRenderedStories(stories);
    }
  }, [searchTerm, stories]);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__header"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("back"),
    className: "Stories__pane__header--back",
    onClick: toggleStoriesView,
    tabIndex: 0,
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__header--title"
  }, i18n("Stories__title")), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    i18n,
    menuOptions: [
      {
        label: i18n("Stories__add-story--media"),
        onClick: () => {
          const input = document.createElement("input");
          input.accept = "image/*,video/*";
          input.type = "file";
          input.onchange = () => {
            const file = input.files ? input.files[0] : void 0;
            if (!file) {
              return;
            }
            onAddStory(file);
          };
          input.click();
        }
      },
      {
        label: i18n("Stories__add-story--text"),
        onClick: () => onAddStory()
      }
    ],
    moduleClassName: "Stories__pane__add-story",
    popperOptions: {
      placement: "bottom",
      strategy: "absolute"
    },
    theme: import_theme.Theme.Dark
  }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    i18n,
    menuOptions: [
      {
        label: i18n("StoriesSettings__context-menu"),
        onClick: () => onStoriesSettings()
      }
    ],
    moduleClassName: "Stories__pane__settings",
    popperOptions: {
      placement: "bottom",
      strategy: "absolute"
    },
    theme: import_theme.Theme.Dark
  })), /* @__PURE__ */ import_react.default.createElement(import_SearchInput.SearchInput, {
    i18n,
    moduleClassName: "Stories__search",
    onChange: (event) => {
      setSearchTerm(event.target.value);
    },
    placeholder: i18n("search"),
    value: searchTerm
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__list"
  }, /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_MyStoriesButton.MyStoriesButton, {
    hasMultiple: myStories.length ? myStories[0].stories.length > 1 : false,
    i18n,
    me,
    newestStory: myStories.length ? getNewestMyStory(myStories[0]) : void 0,
    onAddStory,
    onClick: onMyStoriesClicked,
    queueStoryDownload
  }), renderedStories.map((story) => /* @__PURE__ */ import_react.default.createElement(import_StoryListItem.StoryListItem, {
    conversationId: story.conversationId,
    group: story.group,
    getPreferredBadge,
    i18n,
    key: story.storyView.timestamp,
    onHideStory: toggleHideStories,
    onGoToConversation: (conversationId) => {
      showConversation({ conversationId });
      toggleStoriesView();
    },
    queueStoryDownload,
    story: story.storyView,
    viewUserStories
  })), Boolean(hiddenStories.length) && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", {
    className: (0, import_classnames.default)("Stories__hidden-stories", {
      "Stories__hidden-stories--expanded": isShowingHiddenStories
    }),
    onClick: () => setIsShowingHiddenStories(!isShowingHiddenStories),
    type: "button"
  }, i18n("Stories__hidden-stories")), isShowingHiddenStories && hiddenStories.map((story) => /* @__PURE__ */ import_react.default.createElement(import_StoryListItem.StoryListItem, {
    conversationId: story.conversationId,
    key: story.storyView.timestamp,
    getPreferredBadge,
    i18n,
    isHidden: true,
    onHideStory: toggleHideStories,
    onGoToConversation: (conversationId) => {
      showConversation({ conversationId });
      toggleStoriesView();
    },
    queueStoryDownload,
    story: story.storyView,
    viewUserStories
  }))), !stories.length && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__list--empty"
  }, i18n("Stories__list-empty")))));
}, "StoriesPane");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoriesPane
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllc1BhbmUudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBGdXNlIGZyb20gJ2Z1c2UuanMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25UeXBlLFxuICBTaG93Q29udmVyc2F0aW9uVHlwZSxcbn0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvblN0b3J5VHlwZSxcbiAgTXlTdG9yeVR5cGUsXG4gIFN0b3J5Vmlld1R5cGUsXG59IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlIH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gJy4vQ29udGV4dE1lbnUnO1xuaW1wb3J0IHsgTXlTdG9yaWVzQnV0dG9uIH0gZnJvbSAnLi9NeVN0b3JpZXNCdXR0b24nO1xuaW1wb3J0IHsgU2VhcmNoSW5wdXQgfSBmcm9tICcuL1NlYXJjaElucHV0JztcbmltcG9ydCB7IFN0b3J5TGlzdEl0ZW0gfSBmcm9tICcuL1N0b3J5TGlzdEl0ZW0nO1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICcuLi91dGlsL3RoZW1lJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vdXRpbC9pc05vdE5pbCc7XG5cbmNvbnN0IEZVU0VfT1BUSU9OUzogRnVzZS5JRnVzZU9wdGlvbnM8Q29udmVyc2F0aW9uU3RvcnlUeXBlPiA9IHtcbiAgZ2V0Rm46IChzdG9yeSwgcGF0aCkgPT4ge1xuICAgIGlmIChwYXRoID09PSAnc2VhcmNoTmFtZXMnKSB7XG4gICAgICByZXR1cm4gW3N0b3J5LnN0b3J5Vmlldy5zZW5kZXIudGl0bGUsIHN0b3J5LnN0b3J5Vmlldy5zZW5kZXIubmFtZV0uZmlsdGVyKFxuICAgICAgICBpc05vdE5pbFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RvcnkuZ3JvdXA/LnRpdGxlID8/ICcnO1xuICB9LFxuICBrZXlzOiBbXG4gICAge1xuICAgICAgbmFtZTogJ3NlYXJjaE5hbWVzJyxcbiAgICAgIHdlaWdodDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdncm91cCcsXG4gICAgICB3ZWlnaHQ6IDEsXG4gICAgfSxcbiAgXSxcbiAgdGhyZXNob2xkOiAwLjEsXG59O1xuXG5mdW5jdGlvbiBzZWFyY2goXG4gIHN0b3JpZXM6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uU3RvcnlUeXBlPixcbiAgc2VhcmNoVGVybTogc3RyaW5nXG4pOiBBcnJheTxDb252ZXJzYXRpb25TdG9yeVR5cGU+IHtcbiAgcmV0dXJuIG5ldyBGdXNlPENvbnZlcnNhdGlvblN0b3J5VHlwZT4oc3RvcmllcywgRlVTRV9PUFRJT05TKVxuICAgIC5zZWFyY2goc2VhcmNoVGVybSlcbiAgICAubWFwKHJlc3VsdCA9PiByZXN1bHQuaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGdldE5ld2VzdE15U3Rvcnkoc3Rvcnk6IE15U3RvcnlUeXBlKTogU3RvcnlWaWV3VHlwZSB7XG4gIHJldHVybiBzdG9yeS5zdG9yaWVzW3N0b3J5LnN0b3JpZXMubGVuZ3RoIC0gMV07XG59XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlO1xuICBoaWRkZW5TdG9yaWVzOiBBcnJheTxDb252ZXJzYXRpb25TdG9yeVR5cGU+O1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBtZTogQ29udmVyc2F0aW9uVHlwZTtcbiAgbXlTdG9yaWVzOiBBcnJheTxNeVN0b3J5VHlwZT47XG4gIG9uQWRkU3Rvcnk6IChmaWxlPzogRmlsZSkgPT4gdW5rbm93bjtcbiAgb25NeVN0b3JpZXNDbGlja2VkOiAoKSA9PiB1bmtub3duO1xuICBvblN0b3JpZXNTZXR0aW5nczogKCkgPT4gdW5rbm93bjtcbiAgcXVldWVTdG9yeURvd25sb2FkOiAoc3RvcnlJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBzaG93Q29udmVyc2F0aW9uOiBTaG93Q29udmVyc2F0aW9uVHlwZTtcbiAgc3RvcmllczogQXJyYXk8Q29udmVyc2F0aW9uU3RvcnlUeXBlPjtcbiAgdG9nZ2xlSGlkZVN0b3JpZXM6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICB0b2dnbGVTdG9yaWVzVmlldzogKCkgPT4gdW5rbm93bjtcbiAgdmlld1VzZXJTdG9yaWVzOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjb25zdCBTdG9yaWVzUGFuZSA9ICh7XG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBoaWRkZW5TdG9yaWVzLFxuICBpMThuLFxuICBtZSxcbiAgbXlTdG9yaWVzLFxuICBvbkFkZFN0b3J5LFxuICBvbk15U3Rvcmllc0NsaWNrZWQsXG4gIG9uU3Rvcmllc1NldHRpbmdzLFxuICBxdWV1ZVN0b3J5RG93bmxvYWQsXG4gIHNob3dDb252ZXJzYXRpb24sXG4gIHN0b3JpZXMsXG4gIHRvZ2dsZUhpZGVTdG9yaWVzLFxuICB0b2dnbGVTdG9yaWVzVmlldyxcbiAgdmlld1VzZXJTdG9yaWVzLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbc2VhcmNoVGVybSwgc2V0U2VhcmNoVGVybV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtpc1Nob3dpbmdIaWRkZW5TdG9yaWVzLCBzZXRJc1Nob3dpbmdIaWRkZW5TdG9yaWVzXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3JlbmRlcmVkU3Rvcmllcywgc2V0UmVuZGVyZWRTdG9yaWVzXSA9XG4gICAgdXNlU3RhdGU8QXJyYXk8Q29udmVyc2F0aW9uU3RvcnlUeXBlPj4oc3Rvcmllcyk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2VhcmNoVGVybSkge1xuICAgICAgc2V0UmVuZGVyZWRTdG9yaWVzKHNlYXJjaChzdG9yaWVzLCBzZWFyY2hUZXJtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFJlbmRlcmVkU3RvcmllcyhzdG9yaWVzKTtcbiAgICB9XG4gIH0sIFtzZWFyY2hUZXJtLCBzdG9yaWVzXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19oZWFkZXJcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ2JhY2snKX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19oZWFkZXItLWJhY2tcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZVN0b3JpZXNWaWV3fVxuICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVfX2hlYWRlci0tdGl0bGVcIj5cbiAgICAgICAgICB7aTE4bignU3Rvcmllc19fdGl0bGUnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxDb250ZXh0TWVudVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgbWVudU9wdGlvbnM9e1tcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3JpZXNfX2FkZC1zdG9yeS0tbWVkaWEnKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBpbnB1dC5hY2NlcHQgPSAnaW1hZ2UvKix2aWRlby8qJztcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gJ2ZpbGUnO1xuICAgICAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGlucHV0LmZpbGVzID8gaW5wdXQuZmlsZXNbMF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIG9uQWRkU3RvcnkoZmlsZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGljaygpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3JpZXNfX2FkZC1zdG9yeS0tdGV4dCcpLFxuICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBvbkFkZFN0b3J5KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF19XG4gICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3Rvcmllc19fcGFuZV9fYWRkLXN0b3J5XCJcbiAgICAgICAgICBwb3BwZXJPcHRpb25zPXt7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgfX1cbiAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgLz5cbiAgICAgICAgPENvbnRleHRNZW51XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogaTE4bignU3Rvcmllc1NldHRpbmdzX19jb250ZXh0LW1lbnUnKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gb25TdG9yaWVzU2V0dGluZ3MoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19zZXR0aW5nc1wiXG4gICAgICAgICAgcG9wcGVyT3B0aW9ucz17e1xuICAgICAgICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgICAgICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgICAgICAgIH19XG4gICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxTZWFyY2hJbnB1dFxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yaWVzX19zZWFyY2hcIlxuICAgICAgICBvbkNoYW5nZT17ZXZlbnQgPT4ge1xuICAgICAgICAgIHNldFNlYXJjaFRlcm0oZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfX1cbiAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4oJ3NlYXJjaCcpfVxuICAgICAgICB2YWx1ZT17c2VhcmNoVGVybX1cbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVfX2xpc3RcIj5cbiAgICAgICAgPD5cbiAgICAgICAgICA8TXlTdG9yaWVzQnV0dG9uXG4gICAgICAgICAgICBoYXNNdWx0aXBsZT17XG4gICAgICAgICAgICAgIG15U3Rvcmllcy5sZW5ndGggPyBteVN0b3JpZXNbMF0uc3Rvcmllcy5sZW5ndGggPiAxIDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBtZT17bWV9XG4gICAgICAgICAgICBuZXdlc3RTdG9yeT17XG4gICAgICAgICAgICAgIG15U3Rvcmllcy5sZW5ndGggPyBnZXROZXdlc3RNeVN0b3J5KG15U3Rvcmllc1swXSkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQWRkU3Rvcnk9e29uQWRkU3Rvcnl9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbk15U3Rvcmllc0NsaWNrZWR9XG4gICAgICAgICAgICBxdWV1ZVN0b3J5RG93bmxvYWQ9e3F1ZXVlU3RvcnlEb3dubG9hZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtyZW5kZXJlZFN0b3JpZXMubWFwKHN0b3J5ID0+IChcbiAgICAgICAgICAgIDxTdG9yeUxpc3RJdGVtXG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkPXtzdG9yeS5jb252ZXJzYXRpb25JZH1cbiAgICAgICAgICAgICAgZ3JvdXA9e3N0b3J5Lmdyb3VwfVxuICAgICAgICAgICAgICBnZXRQcmVmZXJyZWRCYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2V9XG4gICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgIGtleT17c3Rvcnkuc3RvcnlWaWV3LnRpbWVzdGFtcH1cbiAgICAgICAgICAgICAgb25IaWRlU3Rvcnk9e3RvZ2dsZUhpZGVTdG9yaWVzfVxuICAgICAgICAgICAgICBvbkdvVG9Db252ZXJzYXRpb249e2NvbnZlcnNhdGlvbklkID0+IHtcbiAgICAgICAgICAgICAgICBzaG93Q29udmVyc2F0aW9uKHsgY29udmVyc2F0aW9uSWQgfSk7XG4gICAgICAgICAgICAgICAgdG9nZ2xlU3Rvcmllc1ZpZXcoKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcXVldWVTdG9yeURvd25sb2FkPXtxdWV1ZVN0b3J5RG93bmxvYWR9XG4gICAgICAgICAgICAgIHN0b3J5PXtzdG9yeS5zdG9yeVZpZXd9XG4gICAgICAgICAgICAgIHZpZXdVc2VyU3Rvcmllcz17dmlld1VzZXJTdG9yaWVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgICB7Qm9vbGVhbihoaWRkZW5TdG9yaWVzLmxlbmd0aCkgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnU3Rvcmllc19faGlkZGVuLXN0b3JpZXMnLCB7XG4gICAgICAgICAgICAgICAgICAnU3Rvcmllc19faGlkZGVuLXN0b3JpZXMtLWV4cGFuZGVkJzogaXNTaG93aW5nSGlkZGVuU3RvcmllcyxcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgc2V0SXNTaG93aW5nSGlkZGVuU3RvcmllcyghaXNTaG93aW5nSGlkZGVuU3RvcmllcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aTE4bignU3Rvcmllc19faGlkZGVuLXN0b3JpZXMnKX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIHtpc1Nob3dpbmdIaWRkZW5TdG9yaWVzICYmXG4gICAgICAgICAgICAgICAgaGlkZGVuU3Rvcmllcy5tYXAoc3RvcnkgPT4gKFxuICAgICAgICAgICAgICAgICAgPFN0b3J5TGlzdEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ9e3N0b3J5LmNvbnZlcnNhdGlvbklkfVxuICAgICAgICAgICAgICAgICAgICBrZXk9e3N0b3J5LnN0b3J5Vmlldy50aW1lc3RhbXB9XG4gICAgICAgICAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgaXNIaWRkZW5cbiAgICAgICAgICAgICAgICAgICAgb25IaWRlU3Rvcnk9e3RvZ2dsZUhpZGVTdG9yaWVzfVxuICAgICAgICAgICAgICAgICAgICBvbkdvVG9Db252ZXJzYXRpb249e2NvbnZlcnNhdGlvbklkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzaG93Q29udmVyc2F0aW9uKHsgY29udmVyc2F0aW9uSWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU3Rvcmllc1ZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgcXVldWVTdG9yeURvd25sb2FkPXtxdWV1ZVN0b3J5RG93bmxvYWR9XG4gICAgICAgICAgICAgICAgICAgIHN0b3J5PXtzdG9yeS5zdG9yeVZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHZpZXdVc2VyU3Rvcmllcz17dmlld1VzZXJTdG9yaWVzfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyFzdG9yaWVzLmxlbmd0aCAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVfX2xpc3QtLWVtcHR5XCI+XG4gICAgICAgICAgICAgIHtpMThuKCdTdG9yaWVzX19saXN0LWVtcHR5Jyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8Lz5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxrQkFBaUI7QUFDakIsbUJBQTJDO0FBQzNDLHdCQUF1QjtBQWF2Qix5QkFBNEI7QUFDNUIsNkJBQWdDO0FBQ2hDLHlCQUE0QjtBQUM1QiwyQkFBOEI7QUFDOUIsbUJBQXNCO0FBQ3RCLHNC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
