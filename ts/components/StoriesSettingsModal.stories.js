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
var StoriesSettingsModal_stories_exports = {};
__export(StoriesSettingsModal_stories_exports, {
  MyStories: () => MyStories,
  MyStoriesBlockList: () => MyStoriesBlockList,
  MyStoriesExclusive: () => MyStoriesExclusive,
  SingleList: () => SingleList,
  default: () => StoriesSettingsModal_stories_default
});
module.exports = __toCommonJS(StoriesSettingsModal_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_StoriesSettingsModal = require("./StoriesSettingsModal");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../util/setupI18n");
var import_getFakeDistributionLists = require("../test-both/helpers/getFakeDistributionLists");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoriesSettingsModal_stories_default = {
  title: "Components/StoriesSettingsModal",
  component: import_StoriesSettingsModal.StoriesSettingsModal,
  argTypes: {
    candidateConversations: {
      defaultValue: Array.from(Array(100), () => (0, import_getDefaultConversation.getDefaultConversation)())
    },
    distributionLists: {
      defaultValue: []
    },
    getPreferredBadge: { action: true },
    hideStoriesSettings: { action: true },
    i18n: {
      defaultValue: i18n
    },
    me: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    onDeleteList: { action: true },
    onDistributionListCreated: { action: true },
    onHideMyStoriesFrom: { action: true },
    onRemoveMember: { action: true },
    onRepliesNReactionsChanged: { action: true },
    onViewersUpdated: { action: true },
    setMyStoriesToAllSignalConnections: { action: true },
    toggleSignalConnectionsModal: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoriesSettingsModal.StoriesSettingsModal, {
  ...args
}), "Template");
const MyStories = Template.bind({});
{
  const myStories = (0, import_getFakeDistributionLists.getMyStories)();
  MyStories.args = {
    distributionLists: [
      {
        ...myStories,
        members: []
      }
    ]
  };
}
const MyStoriesBlockList = Template.bind({});
{
  const myStories = (0, import_getFakeDistributionLists.getMyStories)();
  MyStoriesBlockList.args = {
    distributionLists: [
      {
        ...myStories,
        members: Array.from(Array(2), () => (0, import_getDefaultConversation.getDefaultConversation)())
      }
    ]
  };
}
const MyStoriesExclusive = Template.bind({});
{
  const myStories = (0, import_getFakeDistributionLists.getMyStories)();
  MyStoriesExclusive.args = {
    distributionLists: [
      {
        ...myStories,
        isBlockList: false,
        members: Array.from(Array(11), () => (0, import_getDefaultConversation.getDefaultConversation)())
      }
    ]
  };
}
const SingleList = Template.bind({});
{
  const myStories = (0, import_getFakeDistributionLists.getMyStories)();
  const fakeDistroList = (0, import_getFakeDistributionLists.getFakeDistributionList)();
  SingleList.args = {
    distributionLists: [
      {
        ...myStories,
        members: []
      },
      {
        ...fakeDistroList,
        members: fakeDistroList.memberUuids.map(() => (0, import_getDefaultConversation.getDefaultConversation)())
      }
    ]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MyStories,
  MyStoriesBlockList,
  MyStoriesExclusive,
  SingleList
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllc1NldHRpbmdzTW9kYWwuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL1N0b3JpZXNTZXR0aW5nc01vZGFsJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgU3Rvcmllc1NldHRpbmdzTW9kYWwgfSBmcm9tICcuL1N0b3JpZXNTZXR0aW5nc01vZGFsJztcbmltcG9ydCB7IGdldERlZmF1bHRDb252ZXJzYXRpb24gfSBmcm9tICcuLi90ZXN0LWJvdGgvaGVscGVycy9nZXREZWZhdWx0Q29udmVyc2F0aW9uJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCB7XG4gIGdldE15U3RvcmllcyxcbiAgZ2V0RmFrZURpc3RyaWJ1dGlvbkxpc3QsXG59IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldEZha2VEaXN0cmlidXRpb25MaXN0cyc7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL1N0b3JpZXNTZXR0aW5nc01vZGFsJyxcbiAgY29tcG9uZW50OiBTdG9yaWVzU2V0dGluZ3NNb2RhbCxcbiAgYXJnVHlwZXM6IHtcbiAgICBjYW5kaWRhdGVDb252ZXJzYXRpb25zOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IEFycmF5LmZyb20oQXJyYXkoMTAwKSwgKCkgPT4gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpKSxcbiAgICB9LFxuICAgIGRpc3RyaWJ1dGlvbkxpc3RzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgZ2V0UHJlZmVycmVkQmFkZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgaGlkZVN0b3JpZXNTZXR0aW5nczogeyBhY3Rpb246IHRydWUgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgfSxcbiAgICBvbkRlbGV0ZUxpc3Q6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZDogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkhpZGVNeVN0b3JpZXNGcm9tOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uUmVtb3ZlTWVtYmVyOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uUmVwbGllc05SZWFjdGlvbnNDaGFuZ2VkOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uVmlld2Vyc1VwZGF0ZWQ6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgc2V0TXlTdG9yaWVzVG9BbGxTaWduYWxDb25uZWN0aW9uczogeyBhY3Rpb246IHRydWUgfSxcbiAgICB0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICB9LFxufSBhcyBNZXRhO1xuXG5jb25zdCBUZW1wbGF0ZTogU3Rvcnk8UHJvcHNUeXBlPiA9IGFyZ3MgPT4gPFN0b3JpZXNTZXR0aW5nc01vZGFsIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IE15U3RvcmllcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xue1xuICBjb25zdCBteVN0b3JpZXMgPSBnZXRNeVN0b3JpZXMoKTtcbiAgTXlTdG9yaWVzLmFyZ3MgPSB7XG4gICAgZGlzdHJpYnV0aW9uTGlzdHM6IFtcbiAgICAgIHtcbiAgICAgICAgLi4ubXlTdG9yaWVzLFxuICAgICAgICBtZW1iZXJzOiBbXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IE15U3Rvcmllc0Jsb2NrTGlzdCA9IFRlbXBsYXRlLmJpbmQoe30pO1xue1xuICBjb25zdCBteVN0b3JpZXMgPSBnZXRNeVN0b3JpZXMoKTtcbiAgTXlTdG9yaWVzQmxvY2tMaXN0LmFyZ3MgPSB7XG4gICAgZGlzdHJpYnV0aW9uTGlzdHM6IFtcbiAgICAgIHtcbiAgICAgICAgLi4ubXlTdG9yaWVzLFxuICAgICAgICBtZW1iZXJzOiBBcnJheS5mcm9tKEFycmF5KDIpLCAoKSA9PiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkpLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgTXlTdG9yaWVzRXhjbHVzaXZlID0gVGVtcGxhdGUuYmluZCh7fSk7XG57XG4gIGNvbnN0IG15U3RvcmllcyA9IGdldE15U3RvcmllcygpO1xuICBNeVN0b3JpZXNFeGNsdXNpdmUuYXJncyA9IHtcbiAgICBkaXN0cmlidXRpb25MaXN0czogW1xuICAgICAge1xuICAgICAgICAuLi5teVN0b3JpZXMsXG4gICAgICAgIGlzQmxvY2tMaXN0OiBmYWxzZSxcbiAgICAgICAgbWVtYmVyczogQXJyYXkuZnJvbShBcnJheSgxMSksICgpID0+IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSksXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBTaW5nbGVMaXN0ID0gVGVtcGxhdGUuYmluZCh7fSk7XG57XG4gIGNvbnN0IG15U3RvcmllcyA9IGdldE15U3RvcmllcygpO1xuICBjb25zdCBmYWtlRGlzdHJvTGlzdCA9IGdldEZha2VEaXN0cmlidXRpb25MaXN0KCk7XG4gIFNpbmdsZUxpc3QuYXJncyA9IHtcbiAgICBkaXN0cmlidXRpb25MaXN0czogW1xuICAgICAge1xuICAgICAgICAuLi5teVN0b3JpZXMsXG4gICAgICAgIG1lbWJlcnM6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLi4uZmFrZURpc3Ryb0xpc3QsXG4gICAgICAgIG1lbWJlcnM6IGZha2VEaXN0cm9MaXN0Lm1lbWJlclV1aWRzLm1hcCgoKSA9PiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkpLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBR2xCLHNCQUF1QjtBQUN2QixrQ0FBcUM7QUFDckMsb0NBQXVDO0FBQ3ZDLHVCQUEwQjtBQUMxQixzQ0FHTztBQUVQLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sdUNBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLHdCQUF3QjtBQUFBLE1BQ3RCLGNBQWMsTUFBTSxLQUFLLE1BQU0sR0FBRyxHQUFHLE1BQU0sMERBQXVCLENBQUM7QUFBQSxJQUNyRTtBQUFBLElBQ0EsbUJBQW1CO0FBQUEsTUFDakIsY0FBYyxDQUFDO0FBQUEsSUFDakI7QUFBQSxJQUNBLG1CQUFtQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ2xDLHFCQUFxQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3BDLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsY0FBYywwREFBdUI7QUFBQSxJQUN2QztBQUFBLElBQ0EsY0FBYyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQzdCLDJCQUEyQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQzFDLHFCQUFxQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3BDLGdCQUFnQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQy9CLDRCQUE0QixFQUFFLFFBQVEsS0FBSztBQUFBLElBQzNDLGtCQUFrQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ2pDLG9DQUFvQyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQ25ELDhCQUE4QixFQUFFLFFBQVEsS0FBSztBQUFBLEVBQy9DO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRLG1EQUFDO0FBQUEsS0FBeUI7QUFBQSxDQUFNLEdBQXhDO0FBRTVCLE1BQU0sWUFBWSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3pDO0FBQ0UsUUFBTSxZQUFZLGtEQUFhO0FBQy9CLFlBQVUsT0FBTztBQUFBLElBQ2YsbUJBQW1CO0FBQUEsTUFDakI7QUFBQSxXQUNLO0FBQUEsUUFDSCxTQUFTLENBQUM7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVPLE1BQU0scUJBQXFCLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDbEQ7QUFDRSxRQUFNLFlBQVksa0RBQWE7QUFDL0IscUJBQW1CLE9BQU87QUFBQSxJQUN4QixtQkFBbUI7QUFBQSxNQUNqQjtBQUFBLFdBQ0s7QUFBQSxRQUNILFNBQVMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxHQUFHLE1BQU0sMERBQXVCLENBQUM7QUFBQSxNQUM5RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxNQUFNLHFCQUFxQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ2xEO0FBQ0UsUUFBTSxZQUFZLGtEQUFhO0FBQy9CLHFCQUFtQixPQUFPO0FBQUEsSUFDeEIsbUJBQW1CO0FBQUEsTUFDakI7QUFBQSxXQUNLO0FBQUEsUUFDSCxhQUFhO0FBQUEsUUFDYixTQUFTLE1BQU0sS0FBSyxNQUFNLEVBQUUsR0FBRyxNQUFNLDBEQUF1QixDQUFDO0FBQUEsTUFDL0Q7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRU8sTUFBTSxhQUFhLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDMUM7QUFDRSxRQUFNLFlBQVksa0RBQWE7QUFDL0IsUUFBTSxpQkFBaUIsNkRBQXdCO0FBQy9DLGFBQVcsT0FBTztBQUFBLElBQ2hCLG1CQUFtQjtBQUFBLE1BQ2pCO0FBQUEsV0FDSztBQUFBLFFBQ0gsU0FBUyxDQUFDO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxXQUNLO0FBQUEsUUFDSCxTQUFTLGVBQWUsWUFBWSxJQUFJLE1BQU0sMERBQXVCLENBQUM7QUFBQSxNQUN4RTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
