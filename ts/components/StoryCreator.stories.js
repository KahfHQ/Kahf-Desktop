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
var StoryCreator_stories_exports = {};
__export(StoryCreator_stories_exports, {
  Default: () => Default,
  LinkPreview: () => LinkPreview,
  default: () => StoryCreator_stories_default
});
module.exports = __toCommonJS(StoryCreator_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_StoryCreator = require("./StoryCreator");
var import_fakeAttachment = require("../test-both/helpers/fakeAttachment");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_getFakeDistributionLists = require("../test-both/helpers/getFakeDistributionLists");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoryCreator_stories_default = {
  title: "Components/StoryCreator",
  component: import_StoryCreator.StoryCreator,
  argTypes: {
    candidateConversations: {
      defaultValue: Array.from(Array(100), import_getDefaultConversation.getDefaultConversation)
    },
    debouncedMaybeGrabLinkPreview: { action: true },
    distributionLists: { defaultValue: (0, import_getFakeDistributionLists.getFakeDistributionLists)() },
    getPreferredBadge: { action: true },
    groupConversations: {
      defaultValue: Array.from(Array(7), import_getDefaultConversation.getDefaultGroup)
    },
    groupStories: {
      defaultValue: Array.from(Array(4), import_getDefaultConversation.getDefaultGroup)
    },
    i18n: { defaultValue: i18n },
    installedPacks: {
      defaultValue: []
    },
    linkPreview: {
      defaultValue: void 0
    },
    me: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    onClose: { action: true },
    onDistributionListCreated: { action: true },
    onSend: { action: true },
    processAttachment: { action: true },
    recentStickers: {
      defaultValue: []
    },
    signalConnections: {
      defaultValue: Array.from(Array(42), import_getDefaultConversation.getDefaultConversation)
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoryCreator.StoryCreator, {
  ...args
}), "Template");
const Default = Template.bind({});
Default.args = {};
Default.story = {
  name: "w/o Link Preview available"
};
const LinkPreview = Template.bind({});
LinkPreview.args = {
  linkPreview: {
    domain: "www.catsandkittens.lolcats",
    image: (0, import_fakeAttachment.fakeAttachment)({
      url: "/fixtures/kitten-4-112-112.jpg"
    }),
    title: "Cats & Kittens LOL",
    url: "https://www.catsandkittens.lolcats/kittens/page/1"
  }
};
LinkPreview.story = {
  name: "with Link Preview ready to be applied"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Default,
  LinkPreview
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlDcmVhdG9yLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnkgfSBmcm9tICdAc3Rvcnlib29rL3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9TdG9yeUNyZWF0b3InO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBTdG9yeUNyZWF0b3IgfSBmcm9tICcuL1N0b3J5Q3JlYXRvcic7XG5pbXBvcnQgeyBmYWtlQXR0YWNobWVudCB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2Zha2VBdHRhY2htZW50JztcbmltcG9ydCB7XG4gIGdldERlZmF1bHRDb252ZXJzYXRpb24sXG4gIGdldERlZmF1bHRHcm91cCxcbn0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRGYWtlRGlzdHJpYnV0aW9uTGlzdHMgfSBmcm9tICcuLi90ZXN0LWJvdGgvaGVscGVycy9nZXRGYWtlRGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdXRpbC9zZXR1cEkxOG4nO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9TdG9yeUNyZWF0b3InLFxuICBjb21wb25lbnQ6IFN0b3J5Q3JlYXRvcixcbiAgYXJnVHlwZXM6IHtcbiAgICBjYW5kaWRhdGVDb252ZXJzYXRpb25zOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IEFycmF5LmZyb20oQXJyYXkoMTAwKSwgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiksXG4gICAgfSxcbiAgICBkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldzogeyBhY3Rpb246IHRydWUgfSxcbiAgICBkaXN0cmlidXRpb25MaXN0czogeyBkZWZhdWx0VmFsdWU6IGdldEZha2VEaXN0cmlidXRpb25MaXN0cygpIH0sXG4gICAgZ2V0UHJlZmVycmVkQmFkZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgZ3JvdXBDb252ZXJzYXRpb25zOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IEFycmF5LmZyb20oQXJyYXkoNyksIGdldERlZmF1bHRHcm91cCksXG4gICAgfSxcbiAgICBncm91cFN0b3JpZXM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogQXJyYXkuZnJvbShBcnJheSg0KSwgZ2V0RGVmYXVsdEdyb3VwKSxcbiAgICB9LFxuICAgIGkxOG46IHsgZGVmYXVsdFZhbHVlOiBpMThuIH0sXG4gICAgaW5zdGFsbGVkUGFja3M6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW10sXG4gICAgfSxcbiAgICBsaW5rUHJldmlldzoge1xuICAgICAgZGVmYXVsdFZhbHVlOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgfSxcbiAgICBvbkNsb3NlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uRGlzdHJpYnV0aW9uTGlzdENyZWF0ZWQ6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25TZW5kOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHByb2Nlc3NBdHRhY2htZW50OiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHJlY2VudFN0aWNrZXJzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgc2lnbmFsQ29ubmVjdGlvbnM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogQXJyYXkuZnJvbShBcnJheSg0MiksIGdldERlZmF1bHRDb252ZXJzYXRpb24pLFxuICAgIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8U3RvcnlDcmVhdG9yIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRlZmF1bHQuYXJncyA9IHt9O1xuRGVmYXVsdC5zdG9yeSA9IHtcbiAgbmFtZTogJ3cvbyBMaW5rIFByZXZpZXcgYXZhaWxhYmxlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rUHJldmlldyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTGlua1ByZXZpZXcuYXJncyA9IHtcbiAgbGlua1ByZXZpZXc6IHtcbiAgICBkb21haW46ICd3d3cuY2F0c2FuZGtpdHRlbnMubG9sY2F0cycsXG4gICAgaW1hZ2U6IGZha2VBdHRhY2htZW50KHtcbiAgICAgIHVybDogJy9maXh0dXJlcy9raXR0ZW4tNC0xMTItMTEyLmpwZycsXG4gICAgfSksXG4gICAgdGl0bGU6ICdDYXRzICYgS2l0dGVucyBMT0wnLFxuICAgIHVybDogJ2h0dHBzOi8vd3d3LmNhdHNhbmRraXR0ZW5zLmxvbGNhdHMva2l0dGVucy9wYWdlLzEnLFxuICB9LFxufTtcbkxpbmtQcmV2aWV3LnN0b3J5ID0ge1xuICBuYW1lOiAnd2l0aCBMaW5rIFByZXZpZXcgcmVhZHkgdG8gYmUgYXBwbGllZCcsXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBa0I7QUFHbEIsc0JBQXVCO0FBQ3ZCLDBCQUE2QjtBQUM3Qiw0QkFBK0I7QUFDL0Isb0NBR087QUFDUCxzQ0FBeUM7QUFDekMsdUJBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sK0JBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLHdCQUF3QjtBQUFBLE1BQ3RCLGNBQWMsTUFBTSxLQUFLLE1BQU0sR0FBRyxHQUFHLG9EQUFzQjtBQUFBLElBQzdEO0FBQUEsSUFDQSwrQkFBK0IsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUM5QyxtQkFBbUIsRUFBRSxjQUFjLDhEQUF5QixFQUFFO0FBQUEsSUFDOUQsbUJBQW1CLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDbEMsb0JBQW9CO0FBQUEsTUFDbEIsY0FBYyxNQUFNLEtBQUssTUFBTSxDQUFDLEdBQUcsNkNBQWU7QUFBQSxJQUNwRDtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osY0FBYyxNQUFNLEtBQUssTUFBTSxDQUFDLEdBQUcsNkNBQWU7QUFBQSxJQUNwRDtBQUFBLElBQ0EsTUFBTSxFQUFFLGNBQWMsS0FBSztBQUFBLElBQzNCLGdCQUFnQjtBQUFBLE1BQ2QsY0FBYyxDQUFDO0FBQUEsSUFDakI7QUFBQSxJQUNBLGFBQWE7QUFBQSxNQUNYLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsY0FBYywwREFBdUI7QUFBQSxJQUN2QztBQUFBLElBQ0EsU0FBUyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3hCLDJCQUEyQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQzFDLFFBQVEsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUN2QixtQkFBbUIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNsQyxnQkFBZ0I7QUFBQSxNQUNkLGNBQWMsQ0FBQztBQUFBLElBQ2pCO0FBQUEsSUFDQSxtQkFBbUI7QUFBQSxNQUNqQixjQUFjLE1BQU0sS0FBSyxNQUFNLEVBQUUsR0FBRyxvREFBc0I7QUFBQSxJQUM1RDtBQUFBLEVBQ0Y7QUFDRjtBQUVBLE1BQU0sV0FBNkIsaUNBQVEsbURBQUM7QUFBQSxLQUFpQjtBQUFBLENBQU0sR0FBaEM7QUFFNUIsTUFBTSxVQUFVLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDdkMsUUFBUSxPQUFPLENBQUM7QUFDaEIsUUFBUSxRQUFRO0FBQUEsRUFDZCxNQUFNO0FBQ1I7QUFFTyxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMzQyxZQUFZLE9BQU87QUFBQSxFQUNqQixhQUFhO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixPQUFPLDBDQUFlO0FBQUEsTUFDcEIsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsS0FBSztBQUFBLEVBQ1A7QUFDRjtBQUNBLFlBQVksUUFBUTtBQUFBLEVBQ2xCLE1BQU07QUFDUjsiLAogICJuYW1lcyI6IFtdCn0K
