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
var SendStoryModal_stories_exports = {};
__export(SendStoryModal_stories_exports, {
  Modal: () => Modal,
  default: () => SendStoryModal_stories_default
});
module.exports = __toCommonJS(SendStoryModal_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_SendStoryModal = require("./SendStoryModal");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../util/setupI18n");
var import_getFakeDistributionLists = require("../test-both/helpers/getFakeDistributionLists");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var SendStoryModal_stories_default = {
  title: "Components/SendStoryModal",
  component: import_SendStoryModal.SendStoryModal,
  argTypes: {
    candidateConversations: {
      defaultValue: Array.from(Array(100), () => (0, import_getDefaultConversation.getDefaultConversation)())
    },
    distributionLists: {
      defaultValue: [(0, import_getFakeDistributionLists.getMyStories)()]
    },
    getPreferredBadge: { action: true },
    groupConversations: {
      defaultValue: Array.from(Array(7), import_getDefaultConversation.getDefaultGroup)
    },
    groupStories: {
      defaultValue: Array.from(Array(2), import_getDefaultConversation.getDefaultGroup)
    },
    i18n: {
      defaultValue: i18n
    },
    me: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    onClose: { action: true },
    onDistributionListCreated: { action: true },
    onSend: { action: true },
    signalConnections: {
      defaultValue: Array.from(Array(42), import_getDefaultConversation.getDefaultConversation)
    },
    tagGroupsAsNewGroupStory: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_SendStoryModal.SendStoryModal, {
  ...args
}), "Template");
const Modal = Template.bind({});
Modal.args = {
  distributionLists: (0, import_getFakeDistributionLists.getFakeDistributionLists)()
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Modal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2VuZFN0b3J5TW9kYWwuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL1NlbmRTdG9yeU1vZGFsJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgU2VuZFN0b3J5TW9kYWwgfSBmcm9tICcuL1NlbmRTdG9yeU1vZGFsJztcbmltcG9ydCB7XG4gIGdldERlZmF1bHRDb252ZXJzYXRpb24sXG4gIGdldERlZmF1bHRHcm91cCxcbn0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQge1xuICBnZXRNeVN0b3JpZXMsXG4gIGdldEZha2VEaXN0cmlidXRpb25MaXN0cyxcbn0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RmFrZURpc3RyaWJ1dGlvbkxpc3RzJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvU2VuZFN0b3J5TW9kYWwnLFxuICBjb21wb25lbnQ6IFNlbmRTdG9yeU1vZGFsLFxuICBhcmdUeXBlczoge1xuICAgIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogQXJyYXkuZnJvbShBcnJheSgxMDApLCAoKSA9PiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkpLFxuICAgIH0sXG4gICAgZGlzdHJpYnV0aW9uTGlzdHM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW2dldE15U3RvcmllcygpXSxcbiAgICB9LFxuICAgIGdldFByZWZlcnJlZEJhZGdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIGdyb3VwQ29udmVyc2F0aW9uczoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBBcnJheS5mcm9tKEFycmF5KDcpLCBnZXREZWZhdWx0R3JvdXApLFxuICAgIH0sXG4gICAgZ3JvdXBTdG9yaWVzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IEFycmF5LmZyb20oQXJyYXkoMiksIGdldERlZmF1bHRHcm91cCksXG4gICAgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgfSxcbiAgICBvbkNsb3NlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uRGlzdHJpYnV0aW9uTGlzdENyZWF0ZWQ6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25TZW5kOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNpZ25hbENvbm5lY3Rpb25zOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IEFycmF5LmZyb20oQXJyYXkoNDIpLCBnZXREZWZhdWx0Q29udmVyc2F0aW9uKSxcbiAgICB9LFxuICAgIHRhZ0dyb3Vwc0FzTmV3R3JvdXBTdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxTZW5kU3RvcnlNb2RhbCB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBNb2RhbCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTW9kYWwuYXJncyA9IHtcbiAgZGlzdHJpYnV0aW9uTGlzdHM6IGdldEZha2VEaXN0cmlidXRpb25MaXN0cygpLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFrQjtBQUdsQixzQkFBdUI7QUFDdkIsNEJBQStCO0FBQy9CLG9DQUdPO0FBQ1AsdUJBQTBCO0FBQzFCLHNDQUdPO0FBRVAsTUFBTSxPQUFPLGdDQUFVLE1BQU0sdUJBQVU7QUFFdkMsSUFBTyxpQ0FBUTtBQUFBLEVBQ2IsT0FBTztBQUFBLEVBQ1AsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLElBQ1Isd0JBQXdCO0FBQUEsTUFDdEIsY0FBYyxNQUFNLEtBQUssTUFBTSxHQUFHLEdBQUcsTUFBTSwwREFBdUIsQ0FBQztBQUFBLElBQ3JFO0FBQUEsSUFDQSxtQkFBbUI7QUFBQSxNQUNqQixjQUFjLENBQUMsa0RBQWEsQ0FBQztBQUFBLElBQy9CO0FBQUEsSUFDQSxtQkFBbUIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNsQyxvQkFBb0I7QUFBQSxNQUNsQixjQUFjLE1BQU0sS0FBSyxNQUFNLENBQUMsR0FBRyw2Q0FBZTtBQUFBLElBQ3BEO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixjQUFjLE1BQU0sS0FBSyxNQUFNLENBQUMsR0FBRyw2Q0FBZTtBQUFBLElBQ3BEO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLElBQUk7QUFBQSxNQUNGLGNBQWMsMERBQXVCO0FBQUEsSUFDdkM7QUFBQSxJQUNBLFNBQVMsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUN4QiwyQkFBMkIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUMxQyxRQUFRLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDdkIsbUJBQW1CO0FBQUEsTUFDakIsY0FBYyxNQUFNLEtBQUssTUFBTSxFQUFFLEdBQUcsb0RBQXNCO0FBQUEsSUFDNUQ7QUFBQSxJQUNBLDBCQUEwQixFQUFFLFFBQVEsS0FBSztBQUFBLEVBQzNDO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRLG1EQUFDO0FBQUEsS0FBbUI7QUFBQSxDQUFNLEdBQWxDO0FBRTVCLE1BQU0sUUFBUSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sT0FBTztBQUFBLEVBQ1gsbUJBQW1CLDhEQUF5QjtBQUM5QzsiLAogICJuYW1lcyI6IFtdCn0K
