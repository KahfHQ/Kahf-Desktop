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
var Stories_stories_exports = {};
__export(Stories_stories_exports, {
  Blank: () => Blank,
  HiddenStories: () => HiddenStories,
  Many: () => Many,
  MyStories: () => MyStories,
  default: () => Stories_stories_default
});
module.exports = __toCommonJS(Stories_stories_exports);
var import_react = __toESM(require("react"));
var import_Stories = require("./Stories");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_setupI18n = require("../util/setupI18n");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_getFakeStory = require("../test-both/helpers/getFakeStory");
var durations = __toESM(require("../util/durations"));
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var Stories_stories_default = {
  title: "Components/Stories",
  component: import_Stories.Stories,
  argTypes: {
    deleteStoryForEveryone: { action: true },
    getPreferredBadge: { action: true },
    hiddenStories: {
      defaultValue: []
    },
    i18n: {
      defaultValue: i18n
    },
    me: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    myStories: {
      defaultValue: []
    },
    onForwardStory: { action: true },
    onSaveStory: { action: true },
    ourConversationId: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)().id
    },
    preferredWidthFromStorage: {
      defaultValue: 380
    },
    queueStoryDownload: { action: true },
    renderStoryCreator: { action: true },
    renderStoryViewer: { action: true },
    showConversation: { action: true },
    showStoriesSettings: { action: true },
    stories: {
      defaultValue: []
    },
    toggleHideStories: { action: true },
    toggleStoriesView: { action: true },
    viewUserStories: { action: true },
    viewStory: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_Stories.Stories, {
  ...args
}), "Template");
const Blank = Template.bind({});
Blank.args = {};
const Many = Template.bind({});
Many.args = {
  stories: [
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/tina-rolf-269345-unsplash.jpg",
      timestamp: Date.now() - 2 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/koushik-chowdavarapu-105425-unsplash.jpg",
      timestamp: Date.now() - 5 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/nathan-anderson-316188-unsplash.jpg",
      group: (0, import_getDefaultConversation.getDefaultConversation)({ title: "BBQ in the park" }),
      timestamp: Date.now() - 65 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/snow.jpg",
      timestamp: Date.now() - 92 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-1-64-64.jpg",
      timestamp: Date.now() - 164 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-2-64-64.jpg",
      group: (0, import_getDefaultConversation.getDefaultConversation)({ title: "Breaking Signal for Science" }),
      timestamp: Date.now() - 380 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-3-64-64.jpg",
      timestamp: Date.now() - 421 * durations.MINUTE
    })
  ]
};
const HiddenStories = Template.bind({});
HiddenStories.args = {
  hiddenStories: [
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-1-64-64.jpg",
      timestamp: Date.now() - 164 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-2-64-64.jpg",
      group: (0, import_getDefaultConversation.getDefaultConversation)({ title: "Breaking Signal for Science" }),
      timestamp: Date.now() - 380 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-3-64-64.jpg",
      timestamp: Date.now() - 421 * durations.MINUTE
    })
  ],
  stories: [
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/tina-rolf-269345-unsplash.jpg",
      timestamp: Date.now() - 2 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/snow.jpg",
      timestamp: Date.now() - 92 * durations.MINUTE
    })
  ]
};
const MyStories = Template.bind({});
MyStories.args = {
  myStories: [
    (0, import_getFakeStory.getFakeMyStory)(void 0, "BFF"),
    (0, import_getFakeStory.getFakeMyStory)(void 0, "The Fun Group")
  ],
  hiddenStories: [
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-1-64-64.jpg",
      timestamp: Date.now() - 164 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-2-64-64.jpg",
      group: (0, import_getDefaultConversation.getDefaultConversation)({ title: "Breaking Signal for Science" }),
      timestamp: Date.now() - 380 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/kitten-3-64-64.jpg",
      timestamp: Date.now() - 421 * durations.MINUTE
    })
  ],
  stories: [
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/tina-rolf-269345-unsplash.jpg",
      timestamp: Date.now() - 2 * durations.MINUTE
    }),
    (0, import_getFakeStory.getFakeStory)({
      attachmentUrl: "/fixtures/snow.jpg",
      timestamp: Date.now() - 92 * durations.MINUTE
    })
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Blank,
  HiddenStories,
  Many,
  MyStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllcy5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSB9IGZyb20gJy4vU3Rvcmllcyc7XG5pbXBvcnQgeyBTdG9yaWVzIH0gZnJvbSAnLi9TdG9yaWVzJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHtcbiAgZ2V0RmFrZU15U3RvcnksXG4gIGdldEZha2VTdG9yeSxcbn0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RmFrZVN0b3J5JztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL1N0b3JpZXMnLFxuICBjb21wb25lbnQ6IFN0b3JpZXMsXG4gIGFyZ1R5cGVzOiB7XG4gICAgZGVsZXRlU3RvcnlGb3JFdmVyeW9uZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBnZXRQcmVmZXJyZWRCYWRnZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBoaWRkZW5TdG9yaWVzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgaTE4bjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBpMThuLFxuICAgIH0sXG4gICAgbWU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgIH0sXG4gICAgbXlTdG9yaWVzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgb25Gb3J3YXJkU3Rvcnk6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25TYXZlU3Rvcnk6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb3VyQ29udmVyc2F0aW9uSWQ6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLmlkLFxuICAgIH0sXG4gICAgcHJlZmVycmVkV2lkdGhGcm9tU3RvcmFnZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiAzODAsXG4gICAgfSxcbiAgICBxdWV1ZVN0b3J5RG93bmxvYWQ6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgcmVuZGVyU3RvcnlDcmVhdG9yOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHJlbmRlclN0b3J5Vmlld2VyOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNob3dDb252ZXJzYXRpb246IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgc2hvd1N0b3JpZXNTZXR0aW5nczogeyBhY3Rpb246IHRydWUgfSxcbiAgICBzdG9yaWVzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgdG9nZ2xlSGlkZVN0b3JpZXM6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgdG9nZ2xlU3Rvcmllc1ZpZXc6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgdmlld1VzZXJTdG9yaWVzOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHZpZXdTdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxTdG9yaWVzIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IEJsYW5rID0gVGVtcGxhdGUuYmluZCh7fSk7XG5CbGFuay5hcmdzID0ge307XG5cbmV4cG9ydCBjb25zdCBNYW55ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NYW55LmFyZ3MgPSB7XG4gIHN0b3JpZXM6IFtcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAyICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy9rb3VzaGlrLWNob3dkYXZhcmFwdS0xMDU0MjUtdW5zcGxhc2guanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDUgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL25hdGhhbi1hbmRlcnNvbi0zMTYxODgtdW5zcGxhc2guanBnJyxcbiAgICAgIGdyb3VwOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHsgdGl0bGU6ICdCQlEgaW4gdGhlIHBhcmsnIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNjUgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL3Nub3cuanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDkyICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy9raXR0ZW4tMS02NC02NC5qcGcnLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMTY0ICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy9raXR0ZW4tMi02NC02NC5qcGcnLFxuICAgICAgZ3JvdXA6IGdldERlZmF1bHRDb252ZXJzYXRpb24oeyB0aXRsZTogJ0JyZWFraW5nIFNpZ25hbCBmb3IgU2NpZW5jZScgfSksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAzODAgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL2tpdHRlbi0zLTY0LTY0LmpwZycsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSA0MjEgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICBdLFxufTtcblxuZXhwb3J0IGNvbnN0IEhpZGRlblN0b3JpZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkhpZGRlblN0b3JpZXMuYXJncyA9IHtcbiAgaGlkZGVuU3RvcmllczogW1xuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL2tpdHRlbi0xLTY0LTY0LmpwZycsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxNjQgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL2tpdHRlbi0yLTY0LTY0LmpwZycsXG4gICAgICBncm91cDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7IHRpdGxlOiAnQnJlYWtpbmcgU2lnbmFsIGZvciBTY2llbmNlJyB9KSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDM4MCAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSksXG4gICAgZ2V0RmFrZVN0b3J5KHtcbiAgICAgIGF0dGFjaG1lbnRVcmw6ICcvZml4dHVyZXMva2l0dGVuLTMtNjQtNjQuanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDQyMSAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSksXG4gIF0sXG4gIHN0b3JpZXM6IFtcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy90aW5hLXJvbGYtMjY5MzQ1LXVuc3BsYXNoLmpwZycsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAyICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy9zbm93LmpwZycsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSA5MiAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSksXG4gIF0sXG59O1xuXG5leHBvcnQgY29uc3QgTXlTdG9yaWVzID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NeVN0b3JpZXMuYXJncyA9IHtcbiAgbXlTdG9yaWVzOiBbXG4gICAgZ2V0RmFrZU15U3RvcnkodW5kZWZpbmVkLCAnQkZGJyksXG4gICAgZ2V0RmFrZU15U3RvcnkodW5kZWZpbmVkLCAnVGhlIEZ1biBHcm91cCcpLFxuICBdLFxuICBoaWRkZW5TdG9yaWVzOiBbXG4gICAgZ2V0RmFrZVN0b3J5KHtcbiAgICAgIGF0dGFjaG1lbnRVcmw6ICcvZml4dHVyZXMva2l0dGVuLTEtNjQtNjQuanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDE2NCAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSksXG4gICAgZ2V0RmFrZVN0b3J5KHtcbiAgICAgIGF0dGFjaG1lbnRVcmw6ICcvZml4dHVyZXMva2l0dGVuLTItNjQtNjQuanBnJyxcbiAgICAgIGdyb3VwOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHsgdGl0bGU6ICdCcmVha2luZyBTaWduYWwgZm9yIFNjaWVuY2UnIH0pLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMzgwICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgICBnZXRGYWtlU3Rvcnkoe1xuICAgICAgYXR0YWNobWVudFVybDogJy9maXh0dXJlcy9raXR0ZW4tMy02NC02NC5qcGcnLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNDIxICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgXSxcbiAgc3RvcmllczogW1xuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL3RpbmEtcm9sZi0yNjkzNDUtdW5zcGxhc2guanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDIgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0pLFxuICAgIGdldEZha2VTdG9yeSh7XG4gICAgICBhdHRhY2htZW50VXJsOiAnL2ZpeHR1cmVzL3Nub3cuanBnJyxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDkyICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9KSxcbiAgXSxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBa0I7QUFHbEIscUJBQXdCO0FBQ3hCLHNCQUF1QjtBQUN2Qix1QkFBMEI7QUFDMUIsb0NBQXVDO0FBQ3ZDLDBCQUdPO0FBQ1AsZ0JBQTJCO0FBRTNCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sMEJBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLHdCQUF3QixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3ZDLG1CQUFtQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ2xDLGVBQWU7QUFBQSxNQUNiLGNBQWMsQ0FBQztBQUFBLElBQ2pC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
