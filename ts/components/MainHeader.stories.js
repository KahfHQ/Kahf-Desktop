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
var MainHeader_stories_exports = {};
__export(MainHeader_stories_exports, {
  Basic: () => Basic,
  Name: () => Name,
  PhoneNumber: () => PhoneNumber,
  Stories: () => Stories,
  StoriesOverflow: () => StoriesOverflow,
  UpdateAvailable: () => UpdateAvailable,
  default: () => MainHeader_stories_default
});
module.exports = __toCommonJS(MainHeader_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_MainHeader = require("./MainHeader");
var import_Util = require("../types/Util");
var import_setupI18n = require("../util/setupI18n");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var MainHeader_stories_default = {
  title: "Components/MainHeader",
  component: import_MainHeader.MainHeader,
  argTypes: {
    areStoriesEnabled: {
      defaultValue: false
    },
    avatarPath: {
      defaultValue: void 0
    },
    hasPendingUpdate: {
      defaultValue: false
    },
    i18n: {
      defaultValue: i18n
    },
    name: {
      defaultValue: void 0
    },
    phoneNumber: {
      defaultValue: void 0
    },
    showArchivedConversations: { action: true },
    startComposing: { action: true },
    startUpdate: { action: true },
    theme: {
      defaultValue: import_Util.ThemeType.light
    },
    title: {
      defaultValue: ""
    },
    toggleProfileEditor: { action: true },
    toggleStoriesView: { action: true },
    unreadStoriesCount: {
      defaultValue: 0
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_MainHeader.MainHeader, {
  ...args
}), "Template");
const Basic = Template.bind({});
Basic.args = {};
const Name = Template.bind({});
{
  const { name, title } = (0, import_getDefaultConversation.getDefaultConversation)();
  Name.args = {
    name,
    title
  };
}
const PhoneNumber = Template.bind({});
{
  const { name, e164: phoneNumber } = (0, import_getDefaultConversation.getDefaultConversation)();
  PhoneNumber.args = {
    name,
    phoneNumber
  };
}
const UpdateAvailable = Template.bind({});
UpdateAvailable.args = {
  hasPendingUpdate: true
};
const Stories = Template.bind({});
Stories.args = {
  areStoriesEnabled: true,
  unreadStoriesCount: 6
};
const StoriesOverflow = Template.bind({});
StoriesOverflow.args = {
  areStoriesEnabled: true,
  unreadStoriesCount: 69
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Basic,
  Name,
  PhoneNumber,
  Stories,
  StoriesOverflow,
  UpdateAvailable
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWFpbkhlYWRlci5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnkgfSBmcm9tICdAc3Rvcnlib29rL3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9NYWluSGVhZGVyJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgTWFpbkhlYWRlciB9IGZyb20gJy4vTWFpbkhlYWRlcic7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCB7IGdldERlZmF1bHRDb252ZXJzYXRpb24gfSBmcm9tICcuLi90ZXN0LWJvdGgvaGVscGVycy9nZXREZWZhdWx0Q29udmVyc2F0aW9uJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvTWFpbkhlYWRlcicsXG4gIGNvbXBvbmVudDogTWFpbkhlYWRlcixcbiAgYXJnVHlwZXM6IHtcbiAgICBhcmVTdG9yaWVzRW5hYmxlZDoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIGF2YXRhclBhdGg6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgaGFzUGVuZGluZ1VwZGF0ZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIGkxOG46IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogaTE4bixcbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgcGhvbmVOdW1iZXI6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgc2hvd0FyY2hpdmVkQ29udmVyc2F0aW9uczogeyBhY3Rpb246IHRydWUgfSxcbiAgICBzdGFydENvbXBvc2luZzogeyBhY3Rpb246IHRydWUgfSxcbiAgICBzdGFydFVwZGF0ZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICB0aGVtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBUaGVtZVR5cGUubGlnaHQsXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICB9LFxuICAgIHRvZ2dsZVByb2ZpbGVFZGl0b3I6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgdG9nZ2xlU3Rvcmllc1ZpZXc6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgdW5yZWFkU3Rvcmllc0NvdW50OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxNYWluSGVhZGVyIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IEJhc2ljID0gVGVtcGxhdGUuYmluZCh7fSk7XG5CYXNpYy5hcmdzID0ge307XG5cbmV4cG9ydCBjb25zdCBOYW1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG57XG4gIGNvbnN0IHsgbmFtZSwgdGl0bGUgfSA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oKTtcbiAgTmFtZS5hcmdzID0ge1xuICAgIG5hbWUsXG4gICAgdGl0bGUsXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBQaG9uZU51bWJlciA9IFRlbXBsYXRlLmJpbmQoe30pO1xue1xuICBjb25zdCB7IG5hbWUsIGUxNjQ6IHBob25lTnVtYmVyIH0gPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG4gIFBob25lTnVtYmVyLmFyZ3MgPSB7XG4gICAgbmFtZSxcbiAgICBwaG9uZU51bWJlcixcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFVwZGF0ZUF2YWlsYWJsZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVXBkYXRlQXZhaWxhYmxlLmFyZ3MgPSB7XG4gIGhhc1BlbmRpbmdVcGRhdGU6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgU3RvcmllcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuU3Rvcmllcy5hcmdzID0ge1xuICBhcmVTdG9yaWVzRW5hYmxlZDogdHJ1ZSxcbiAgdW5yZWFkU3Rvcmllc0NvdW50OiA2LFxufTtcblxuZXhwb3J0IGNvbnN0IFN0b3JpZXNPdmVyZmxvdyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuU3Rvcmllc092ZXJmbG93LmFyZ3MgPSB7XG4gIGFyZVN0b3JpZXNFbmFibGVkOiB0cnVlLFxuICB1bnJlYWRTdG9yaWVzQ291bnQ6IDY5LFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBa0I7QUFHbEIsc0JBQXVCO0FBQ3ZCLHdCQUEyQjtBQUMzQixrQkFBMEI7QUFDMUIsdUJBQTBCO0FBQzFCLG9DQUF1QztBQUV2QyxNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLDZCQUFRO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixtQkFBbUI7QUFBQSxNQUNqQixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0Esa0JBQWtCO0FBQUEsTUFDaEIsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsYUFBYTtBQUFBLE1BQ1gsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSwyQkFBMkIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUMxQyxnQkFBZ0IsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUMvQixhQUFhLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDNUIsT0FBTztBQUFBLE1BQ0wsY0FBYyxzQkFBVTtBQUFBLElBQzFCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLHFCQUFxQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3BDLG1CQUFtQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ2xDLG9CQUFvQjtBQUFBLE1BQ2xCLGNBQWM7QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLE1BQU0sV0FBNkIsaUNBQVEsbURBQUM7QUFBQSxLQUFlO0FBQUEsQ0FBTSxHQUE5QjtBQUU1QixNQUFNLFFBQVEsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNyQyxNQUFNLE9BQU8sQ0FBQztBQUVQLE1BQU0sT0FBTyxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3BDO0FBQ0UsUUFBTSxFQUFFLE1BQU0sVUFBVSwwREFBdUI7QUFDL0MsT0FBSyxPQUFPO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMzQztBQUNFLFFBQU0sRUFBRSxNQUFNLE1BQU0sZ0JBQWdCLDBEQUF1QjtBQUMzRCxjQUFZLE9BQU87QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxNQUFNLGtCQUFrQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQy9DLGdCQUFnQixPQUFPO0FBQUEsRUFDckIsa0JBQWtCO0FBQ3BCO0FBRU8sTUFBTSxVQUFVLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDdkMsUUFBUSxPQUFPO0FBQUEsRUFDYixtQkFBbUI7QUFBQSxFQUNuQixvQkFBb0I7QUFDdEI7QUFFTyxNQUFNLGtCQUFrQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQy9DLGdCQUFnQixPQUFPO0FBQUEsRUFDckIsbUJBQW1CO0FBQUEsRUFDbkIsb0JBQW9CO0FBQ3RCOyIsCiAgIm5hbWVzIjogW10KfQo=
