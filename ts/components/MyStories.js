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
var MyStories_exports = {};
__export(MyStories_exports, {
  MyStories: () => MyStories
});
module.exports = __toCommonJS(MyStories_exports);
var import_react = __toESM(require("react"));
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_ContextMenu = require("./ContextMenu");
var import_Stories = require("../types/Stories");
var import_MessageTimestamp = require("./conversation/MessageTimestamp");
var import_StoryDistributionListName = require("./StoryDistributionListName");
var import_StoryImage = require("./StoryImage");
var import_theme = require("../util/theme");
const MyStories = /* @__PURE__ */ __name(({
  i18n,
  myStories,
  onBack,
  onDelete,
  onForward,
  onSave,
  queueStoryDownload,
  viewStory
}) => {
  const [confirmDeleteStory, setConfirmDeleteStory] = (0, import_react.useState)();
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, confirmDeleteStory && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        text: i18n("delete"),
        action: () => onDelete(confirmDeleteStory),
        style: "negative"
      }
    ],
    i18n,
    onClose: () => setConfirmDeleteStory(void 0)
  }, i18n("MyStories__delete")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__header Stories__pane__header--centered"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("back"),
    className: "Stories__pane__header--back",
    onClick: onBack,
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__header--title"
  }, i18n("MyStories__title"))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__list"
  }, myStories.map((list) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MyStories__distribution",
    key: list.id
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MyStories__distribution__title"
  }, /* @__PURE__ */ import_react.default.createElement(import_StoryDistributionListName.StoryDistributionListName, {
    i18n,
    id: list.id,
    name: list.name
  })), list.stories.map((story) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MyStories__story",
    key: story.timestamp
  }, story.attachment && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MyStories__story"),
    className: "MyStories__story__preview",
    onClick: () => viewStory({
      storyId: story.messageId,
      storyViewMode: import_Stories.StoryViewModeType.Single
    }),
    type: "button"
  }, /* @__PURE__ */ import_react.default.createElement(import_StoryImage.StoryImage, {
    attachment: story.attachment,
    firstName: i18n("you"),
    i18n,
    isMe: true,
    isThumbnail: true,
    label: i18n("MyStories__story"),
    moduleClassName: "MyStories__story__preview",
    queueStoryDownload,
    storyId: story.messageId
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MyStories__story__details"
  }, story.views === 1 ? i18n("MyStories__views--singular", [String(story.views)]) : i18n("MyStories__views--plural", [
    String(story.views || 0)
  ]), /* @__PURE__ */ import_react.default.createElement(import_MessageTimestamp.MessageTimestamp, {
    i18n,
    isRelativeTime: true,
    module: "MyStories__story__timestamp",
    timestamp: story.timestamp
  })), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MyStories__download"),
    className: "MyStories__story__download",
    onClick: () => {
      onSave(story);
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    i18n,
    menuOptions: [
      {
        icon: "MyStories__icon--forward",
        label: i18n("forward"),
        onClick: () => {
          onForward(story.messageId);
        }
      },
      {
        icon: "MyStories__icon--save",
        label: i18n("save"),
        onClick: () => {
          onSave(story);
        }
      },
      {
        icon: "StoryListItem__icon--info",
        label: i18n("StoryListItem__info"),
        onClick: () => {
          viewStory({
            storyId: story.messageId,
            storyViewMode: import_Stories.StoryViewModeType.Single,
            shouldShowDetailsModal: true
          });
        }
      },
      {
        icon: "MyStories__icon--delete",
        label: i18n("delete"),
        onClick: () => {
          setConfirmDeleteStory(story);
        }
      }
    ],
    moduleClassName: "MyStories__story__more",
    theme: import_theme.Theme.Dark
  })))))), !myStories.length && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Stories__pane__list--empty"
  }, i18n("Stories__list-empty")));
}, "MyStories");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MyStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTXlTdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IE15U3RvcnlUeXBlLCBTdG9yeVZpZXdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgVmlld1N0b3J5QWN0aW9uQ3JlYXRvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi9Db250ZXh0TWVudSc7XG5pbXBvcnQgeyBTdG9yeVZpZXdNb2RlVHlwZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgTWVzc2FnZVRpbWVzdGFtcCB9IGZyb20gJy4vY29udmVyc2F0aW9uL01lc3NhZ2VUaW1lc3RhbXAnO1xuaW1wb3J0IHsgU3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZSB9IGZyb20gJy4vU3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZSc7XG5pbXBvcnQgeyBTdG9yeUltYWdlIH0gZnJvbSAnLi9TdG9yeUltYWdlJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbXlTdG9yaWVzOiBBcnJheTxNeVN0b3J5VHlwZT47XG4gIG9uQmFjazogKCkgPT4gdW5rbm93bjtcbiAgb25EZWxldGU6IChzdG9yeTogU3RvcnlWaWV3VHlwZSkgPT4gdW5rbm93bjtcbiAgb25Gb3J3YXJkOiAoc3RvcnlJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBvblNhdmU6IChzdG9yeTogU3RvcnlWaWV3VHlwZSkgPT4gdW5rbm93bjtcbiAgcXVldWVTdG9yeURvd25sb2FkOiAoc3RvcnlJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICB2aWV3U3Rvcnk6IFZpZXdTdG9yeUFjdGlvbkNyZWF0b3JUeXBlO1xufTtcblxuZXhwb3J0IGNvbnN0IE15U3RvcmllcyA9ICh7XG4gIGkxOG4sXG4gIG15U3RvcmllcyxcbiAgb25CYWNrLFxuICBvbkRlbGV0ZSxcbiAgb25Gb3J3YXJkLFxuICBvblNhdmUsXG4gIHF1ZXVlU3RvcnlEb3dubG9hZCxcbiAgdmlld1N0b3J5LFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbY29uZmlybURlbGV0ZVN0b3J5LCBzZXRDb25maXJtRGVsZXRlU3RvcnldID0gdXNlU3RhdGU8XG4gICAgU3RvcnlWaWV3VHlwZSB8IHVuZGVmaW5lZFxuICA+KCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2NvbmZpcm1EZWxldGVTdG9yeSAmJiAoXG4gICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ2RlbGV0ZScpLFxuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IG9uRGVsZXRlKGNvbmZpcm1EZWxldGVTdG9yeSksXG4gICAgICAgICAgICAgIHN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdfVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0Q29uZmlybURlbGV0ZVN0b3J5KHVuZGVmaW5lZCl9XG4gICAgICAgID5cbiAgICAgICAgICB7aTE4bignTXlTdG9yaWVzX19kZWxldGUnKX1cbiAgICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgICApfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19oZWFkZXIgU3Rvcmllc19fcGFuZV9faGVhZGVyLS1jZW50ZXJlZFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignYmFjaycpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVfX2hlYWRlci0tYmFja1wiXG4gICAgICAgICAgb25DbGljaz17b25CYWNrfVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNfX3BhbmVfX2hlYWRlci0tdGl0bGVcIj5cbiAgICAgICAgICB7aTE4bignTXlTdG9yaWVzX190aXRsZScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19saXN0XCI+XG4gICAgICAgIHtteVN0b3JpZXMubWFwKGxpc3QgPT4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTXlTdG9yaWVzX19kaXN0cmlidXRpb25cIiBrZXk9e2xpc3QuaWR9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNeVN0b3JpZXNfX2Rpc3RyaWJ1dGlvbl9fdGl0bGVcIj5cbiAgICAgICAgICAgICAgPFN0b3J5RGlzdHJpYnV0aW9uTGlzdE5hbWVcbiAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgIGlkPXtsaXN0LmlkfVxuICAgICAgICAgICAgICAgIG5hbWU9e2xpc3QubmFtZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2xpc3Quc3Rvcmllcy5tYXAoc3RvcnkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk15U3Rvcmllc19fc3RvcnlcIiBrZXk9e3N0b3J5LnRpbWVzdGFtcH0+XG4gICAgICAgICAgICAgICAge3N0b3J5LmF0dGFjaG1lbnQgJiYgKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNeVN0b3JpZXNfX3N0b3J5Jyl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIk15U3Rvcmllc19fc3RvcnlfX3ByZXZpZXdcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdTdG9yeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yeUlkOiBzdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yeVZpZXdNb2RlOiBTdG9yeVZpZXdNb2RlVHlwZS5TaW5nbGUsXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFN0b3J5SW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50PXtzdG9yeS5hdHRhY2htZW50fVxuICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZT17aTE4bigneW91Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgICAgICAgaXNUaHVtYm5haWxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbD17aTE4bignTXlTdG9yaWVzX19zdG9yeScpfVxuICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIk15U3Rvcmllc19fc3RvcnlfX3ByZXZpZXdcIlxuICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlU3RvcnlEb3dubG9hZD17cXVldWVTdG9yeURvd25sb2FkfVxuICAgICAgICAgICAgICAgICAgICAgIHN0b3J5SWQ9e3N0b3J5Lm1lc3NhZ2VJZH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNeVN0b3JpZXNfX3N0b3J5X19kZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgICB7c3Rvcnkudmlld3MgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgPyBpMThuKCdNeVN0b3JpZXNfX3ZpZXdzLS1zaW5ndWxhcicsIFtTdHJpbmcoc3Rvcnkudmlld3MpXSlcbiAgICAgICAgICAgICAgICAgICAgOiBpMThuKCdNeVN0b3JpZXNfX3ZpZXdzLS1wbHVyYWwnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcoc3Rvcnkudmlld3MgfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICAgICAgICA8TWVzc2FnZVRpbWVzdGFtcFxuICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICBpc1JlbGF0aXZlVGltZVxuICAgICAgICAgICAgICAgICAgICBtb2R1bGU9XCJNeVN0b3JpZXNfX3N0b3J5X190aW1lc3RhbXBcIlxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA9e3N0b3J5LnRpbWVzdGFtcH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNeVN0b3JpZXNfX2Rvd25sb2FkJyl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJNeVN0b3JpZXNfX3N0b3J5X19kb3dubG9hZFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9uU2F2ZShzdG9yeSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8Q29udGV4dE1lbnVcbiAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ015U3Rvcmllc19faWNvbi0tZm9yd2FyZCcsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ2ZvcndhcmQnKSxcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZvcndhcmQoc3RvcnkubWVzc2FnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ015U3Rvcmllc19faWNvbi0tc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ3NhdmUnKSxcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblNhdmUoc3RvcnkpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnU3RvcnlMaXN0SXRlbV9faWNvbi0taW5mbycsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5TGlzdEl0ZW1fX2luZm8nKSxcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3U3Rvcnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yeUlkOiBzdG9yeS5tZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3J5Vmlld01vZGU6IFN0b3J5Vmlld01vZGVUeXBlLlNpbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkU2hvd0RldGFpbHNNb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnTXlTdG9yaWVzX19pY29uLS1kZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdkZWxldGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDb25maXJtRGVsZXRlU3Rvcnkoc3RvcnkpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiTXlTdG9yaWVzX19zdG9yeV9fbW9yZVwiXG4gICAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICAgeyFteVN0b3JpZXMubGVuZ3RoICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzX19wYW5lX19saXN0LS1lbXB0eVwiPlxuICAgICAgICAgIHtpMThuKCdTdG9yaWVzX19saXN0LWVtcHR5Jyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWdDO0FBSWhDLGdDQUFtQztBQUNuQyx5QkFBNEI7QUFDNUIscUJBQWtDO0FBQ2xDLDhCQUFpQztBQUNqQyx1Q0FBMEM7QUFDMUMsd0JBQTJCO0FBQzNCLG1CQUFzQjtBQWFmLE1BQU0sWUFBWSx3QkFBQztBQUFBLEVBQ3hCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE1BQzRCO0FBQzVCLFFBQU0sQ0FBQyxvQkFBb0IseUJBQXlCLDJCQUVsRDtBQUVGLFNBQ0Usd0ZBQ0csc0JBQ0MsbURBQUM7QUFBQSxJQUNDLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNLEtBQUssUUFBUTtBQUFBLFFBQ25CLFFBQVEsTUFBTSxTQUFTLGtCQUFrQjtBQUFBLFFBQ3pDLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxJQUNBLFNBQVMsTUFBTSxzQkFBc0IsTUFBUztBQUFBLEtBRTdDLEtBQUssbUJBQW1CLENBQzNCLEdBRUYsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsSUFDQyxjQUFZLEtBQUssTUFBTTtBQUFBLElBQ3ZCLFdBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxJQUNULE1BQUs7QUFBQSxHQUNQLEdBQ0EsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNaLEtBQUssa0JBQWtCLENBQzFCLENBQ0YsR0FDQSxtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ1osVUFBVSxJQUFJLFVBQ2IsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFB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
