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
var StoryDetailsModal_stories_exports = {};
__export(StoryDetailsModal_stories_exports, {
  MyStory: () => MyStory,
  OtherStory: () => OtherStory,
  default: () => StoryDetailsModal_stories_default
});
module.exports = __toCommonJS(StoryDetailsModal_stories_exports);
var import_react = __toESM(require("react"));
var import_casual = __toESM(require("casual"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_MessageSendState = require("../messages/MessageSendState");
var import_StoryDetailsModal = require("./StoryDetailsModal");
var import_fakeAttachment = require("../test-both/helpers/fakeAttachment");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoryDetailsModal_stories_default = {
  title: "Components/StoryDetailsModal",
  component: import_StoryDetailsModal.StoryDetailsModal,
  argTypes: {
    getPreferredBadge: { action: true },
    i18n: {
      defaultValue: i18n
    },
    onClose: { action: true },
    sender: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    sendState: {
      defaultValue: void 0
    },
    size: {
      defaultValue: (0, import_fakeAttachment.fakeAttachment)().size
    },
    timestamp: {
      defaultValue: Date.now()
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoryDetailsModal.StoryDetailsModal, {
  ...args
}), "Template");
const MyStory = Template.bind({});
MyStory.args = {
  sendState: [
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Delivered,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Delivered,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Delivered,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Delivered,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Sent,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: import_casual.default.unix_time
    },
    {
      recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: import_casual.default.unix_time
    }
  ]
};
const OtherStory = Template.bind({});
OtherStory.args = {};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MyStory,
  OtherStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlEZXRhaWxzTW9kYWwuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjYXN1YWwgZnJvbSAnY2FzdWFsJztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL1N0b3J5RGV0YWlsc01vZGFsJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgU3RvcnlEZXRhaWxzTW9kYWwgfSBmcm9tICcuL1N0b3J5RGV0YWlsc01vZGFsJztcbmltcG9ydCB7IGZha2VBdHRhY2htZW50IH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZmFrZUF0dGFjaG1lbnQnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdXRpbC9zZXR1cEkxOG4nO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9TdG9yeURldGFpbHNNb2RhbCcsXG4gIGNvbXBvbmVudDogU3RvcnlEZXRhaWxzTW9kYWwsXG4gIGFyZ1R5cGVzOiB7XG4gICAgZ2V0UHJlZmVycmVkQmFkZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgaTE4bjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBpMThuLFxuICAgIH0sXG4gICAgb25DbG9zZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBzZW5kZXI6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgIH0sXG4gICAgc2VuZFN0YXRlOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIHNpemU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFrZUF0dGFjaG1lbnQoKS5zaXplLFxuICAgIH0sXG4gICAgdGltZXN0YW1wOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxTdG9yeURldGFpbHNNb2RhbCB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBNeVN0b3J5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NeVN0b3J5LmFyZ3MgPSB7XG4gIHNlbmRTdGF0ZTogW1xuICAgIHtcbiAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICAgIHVwZGF0ZWRBdDogY2FzdWFsLnVuaXhfdGltZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICAgIHVwZGF0ZWRBdDogY2FzdWFsLnVuaXhfdGltZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICAgIHVwZGF0ZWRBdDogY2FzdWFsLnVuaXhfdGltZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICAgIHVwZGF0ZWRBdDogY2FzdWFsLnVuaXhfdGltZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICB1cGRhdGVkQXQ6IGNhc3VhbC51bml4X3RpbWUsXG4gICAgfSxcbiAgICB7XG4gICAgICByZWNpcGllbnQ6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICB1cGRhdGVkQXQ6IGNhc3VhbC51bml4X3RpbWUsXG4gICAgfSxcbiAgICB7XG4gICAgICByZWNpcGllbnQ6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICB1cGRhdGVkQXQ6IGNhc3VhbC51bml4X3RpbWUsXG4gICAgfSxcbiAgICB7XG4gICAgICByZWNpcGllbnQ6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICB1cGRhdGVkQXQ6IGNhc3VhbC51bml4X3RpbWUsXG4gICAgfSxcbiAgXSxcbn07XG5cbmV4cG9ydCBjb25zdCBPdGhlclN0b3J5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5PdGhlclN0b3J5LmFyZ3MgPSB7fTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBQ2xCLG9CQUFtQjtBQUduQixzQkFBdUI7QUFDdkIsOEJBQTJCO0FBQzNCLCtCQUFrQztBQUNsQyw0QkFBK0I7QUFDL0Isb0NBQXVDO0FBQ3ZDLHVCQUEwQjtBQUUxQixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLG9DQUFRO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixtQkFBbUIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNsQyxNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFNBQVMsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUN4QixRQUFRO0FBQUEsTUFDTixjQUFjLDBEQUF1QjtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLGNBQWMsMENBQWUsRUFBRTtBQUFBLElBQ2pDO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxjQUFjLEtBQUssSUFBSTtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUNGO0FBRUEsTUFBTSxXQUE2QixpQ0FBUSxtREFBQztBQUFBLEtBQXNCO0FBQUEsQ0FBTSxHQUFyQztBQUU1QixNQUFNLFVBQVUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUN2QyxRQUFRLE9BQU87QUFBQSxFQUNiLFdBQVc7QUFBQSxJQUNUO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsTUFDRSxXQUFXLDBEQUF1QjtBQUFBLE1BQ2xDLFFBQVEsbUNBQVc7QUFBQSxNQUNuQixXQUFXLHNCQUFPO0FBQUEsSUFDcEI7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxNQUFNLGFBQWEsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMxQyxXQUFXLE9BQU8sQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
