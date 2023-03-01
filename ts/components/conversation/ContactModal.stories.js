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
var ContactModal_stories_exports = {};
__export(ContactModal_stories_exports, {
  AsAdmin: () => AsAdmin,
  AsAdminViewingNonMemberOfGroup: () => AsAdminViewingNonMemberOfGroup,
  AsAdminWithNoGroupLink: () => AsAdminWithNoGroupLink,
  AsNonAdmin: () => AsNonAdmin,
  ViewingSelf: () => ViewingSelf,
  WithBadges: () => WithBadges,
  WithUnreadStories: () => WithUnreadStories,
  WithoutPhoneNumber: () => WithoutPhoneNumber,
  default: () => ContactModal_stories_default
});
module.exports = __toCommonJS(ContactModal_stories_exports);
var React = __toESM(require("react"));
var import_casual = __toESM(require("casual"));
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_ContactModal = require("./ContactModal");
var import_Stories = require("../../types/Stories");
var import_Util = require("../../types/Util");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_getFakeBadge = require("../../test-both/helpers/getFakeBadge");
var import_setupI18n = require("../../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const defaultContact = (0, import_getDefaultConversation.getDefaultConversation)({
  about: "\u{1F44D} Free to chat"
});
const defaultGroup = (0, import_getDefaultConversation.getDefaultConversation)({
  areWeAdmin: true,
  groupLink: import_casual.default.url,
  title: import_casual.default.title,
  type: "group"
});
var ContactModal_stories_default = {
  title: "Components/Conversation/ContactModal",
  component: import_ContactModal.ContactModal,
  argTypes: {
    i18n: {
      defaultValue: i18n
    },
    areWeASubscriber: {
      defaultValue: false
    },
    areWeAdmin: {
      defaultValue: false
    },
    badges: {
      defaultValue: []
    },
    contact: {
      defaultValue: defaultContact
    },
    conversation: {
      defaultValue: defaultGroup
    },
    hasStories: {
      defaultValue: void 0
    },
    hideContactModal: { action: true },
    isAdmin: {
      defaultValue: false
    },
    isMember: {
      defaultValue: true
    },
    removeMemberFromGroup: { action: true },
    showConversation: { action: true },
    theme: {
      defaultValue: import_Util.ThemeType.light
    },
    toggleAdmin: { action: true },
    toggleSafetyNumberModal: { action: true },
    updateConversationModelSharedGroups: { action: true },
    viewUserStories: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ React.createElement(import_ContactModal.ContactModal, {
  ...args
}), "Template");
const AsNonAdmin = Template.bind({});
AsNonAdmin.args = {
  areWeAdmin: false
};
AsNonAdmin.story = {
  name: "As non-admin"
};
const AsAdmin = Template.bind({});
AsAdmin.args = {
  areWeAdmin: true
};
AsAdmin.story = {
  name: "As admin"
};
const AsAdminWithNoGroupLink = Template.bind({});
AsAdminWithNoGroupLink.args = {
  areWeAdmin: true,
  conversation: {
    ...defaultGroup,
    groupLink: void 0
  }
};
AsAdminWithNoGroupLink.story = {
  name: "As admin with no group link"
};
const AsAdminViewingNonMemberOfGroup = Template.bind({});
AsAdminViewingNonMemberOfGroup.args = {
  isMember: false
};
AsAdminViewingNonMemberOfGroup.story = {
  name: "As admin, viewing non-member of group"
};
const WithoutPhoneNumber = Template.bind({});
WithoutPhoneNumber.args = {
  contact: {
    ...defaultContact,
    phoneNumber: void 0
  }
};
WithoutPhoneNumber.story = {
  name: "Without phone number"
};
const ViewingSelf = Template.bind({});
ViewingSelf.args = {
  contact: {
    ...defaultContact,
    isMe: true
  }
};
ViewingSelf.story = {
  name: "Viewing self"
};
const WithBadges = Template.bind({});
WithBadges.args = {
  badges: (0, import_getFakeBadge.getFakeBadges)(2)
};
WithBadges.story = {
  name: "With badges"
};
const WithUnreadStories = Template.bind({});
WithUnreadStories.args = {
  hasStories: import_Stories.HasStories.Unread
};
WithUnreadStories.storyName = "Unread Stories";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsAdmin,
  AsAdminViewingNonMemberOfGroup,
  AsAdminWithNoGroupLink,
  AsNonAdmin,
  ViewingSelf,
  WithBadges,
  WithUnreadStories,
  WithoutPhoneNumber
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udGFjdE1vZGFsLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNhc3VhbCBmcm9tICdjYXN1YWwnO1xuXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9Db250YWN0TW9kYWwnO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBDb250YWN0TW9kYWwgfSBmcm9tICcuL0NvbnRhY3RNb2RhbCc7XG5pbXBvcnQgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IGdldERlZmF1bHRDb252ZXJzYXRpb24gfSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9nZXREZWZhdWx0Q29udmVyc2F0aW9uJztcbmltcG9ydCB7IGdldEZha2VCYWRnZXMgfSBmcm9tICcuLi8uLi90ZXN0LWJvdGgvaGVscGVycy9nZXRGYWtlQmFkZ2UnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXR1cEkxOG4nO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5jb25zdCBkZWZhdWx0Q29udGFjdDogQ29udmVyc2F0aW9uVHlwZSA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICBhYm91dDogJ1x1RDgzRFx1REM0RCBGcmVlIHRvIGNoYXQnLFxufSk7XG5cbmNvbnN0IGRlZmF1bHRHcm91cDogQ29udmVyc2F0aW9uVHlwZSA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICBhcmVXZUFkbWluOiB0cnVlLFxuICBncm91cExpbms6IGNhc3VhbC51cmwsXG4gIHRpdGxlOiBjYXN1YWwudGl0bGUsXG4gIHR5cGU6ICdncm91cCcsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvQ29udmVyc2F0aW9uL0NvbnRhY3RNb2RhbCcsXG4gIGNvbXBvbmVudDogQ29udGFjdE1vZGFsLFxuICBhcmdUeXBlczoge1xuICAgIGkxOG46IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogaTE4bixcbiAgICB9LFxuICAgIGFyZVdlQVN1YnNjcmliZXI6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgfSxcbiAgICBhcmVXZUFkbWluOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gICAgYmFkZ2VzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFtdLFxuICAgIH0sXG4gICAgY29udGFjdDoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0Q29udGFjdCxcbiAgICB9LFxuICAgIGNvbnZlcnNhdGlvbjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0R3JvdXAsXG4gICAgfSxcbiAgICBoYXNTdG9yaWVzOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGhpZGVDb250YWN0TW9kYWw6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgaXNBZG1pbjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICAgIGlzTWVtYmVyOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgfSxcbiAgICByZW1vdmVNZW1iZXJGcm9tR3JvdXA6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgc2hvd0NvbnZlcnNhdGlvbjogeyBhY3Rpb246IHRydWUgfSxcbiAgICB0aGVtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBUaGVtZVR5cGUubGlnaHQsXG4gICAgfSxcbiAgICB0b2dnbGVBZG1pbjogeyBhY3Rpb246IHRydWUgfSxcbiAgICB0b2dnbGVTYWZldHlOdW1iZXJNb2RhbDogeyBhY3Rpb246IHRydWUgfSxcbiAgICB1cGRhdGVDb252ZXJzYXRpb25Nb2RlbFNoYXJlZEdyb3VwczogeyBhY3Rpb246IHRydWUgfSxcbiAgICB2aWV3VXNlclN0b3JpZXM6IHsgYWN0aW9uOiB0cnVlIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8Q29udGFjdE1vZGFsIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IEFzTm9uQWRtaW4gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkFzTm9uQWRtaW4uYXJncyA9IHtcbiAgYXJlV2VBZG1pbjogZmFsc2UsXG59O1xuQXNOb25BZG1pbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0FzIG5vbi1hZG1pbicsXG59O1xuXG5leHBvcnQgY29uc3QgQXNBZG1pbiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuQXNBZG1pbi5hcmdzID0ge1xuICBhcmVXZUFkbWluOiB0cnVlLFxufTtcbkFzQWRtaW4uc3RvcnkgPSB7XG4gIG5hbWU6ICdBcyBhZG1pbicsXG59O1xuXG5leHBvcnQgY29uc3QgQXNBZG1pbldpdGhOb0dyb3VwTGluayA9IFRlbXBsYXRlLmJpbmQoe30pO1xuQXNBZG1pbldpdGhOb0dyb3VwTGluay5hcmdzID0ge1xuICBhcmVXZUFkbWluOiB0cnVlLFxuICBjb252ZXJzYXRpb246IHtcbiAgICAuLi5kZWZhdWx0R3JvdXAsXG4gICAgZ3JvdXBMaW5rOiB1bmRlZmluZWQsXG4gIH0sXG59O1xuQXNBZG1pbldpdGhOb0dyb3VwTGluay5zdG9yeSA9IHtcbiAgbmFtZTogJ0FzIGFkbWluIHdpdGggbm8gZ3JvdXAgbGluaycsXG59O1xuXG5leHBvcnQgY29uc3QgQXNBZG1pblZpZXdpbmdOb25NZW1iZXJPZkdyb3VwID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Bc0FkbWluVmlld2luZ05vbk1lbWJlck9mR3JvdXAuYXJncyA9IHtcbiAgaXNNZW1iZXI6IGZhbHNlLFxufTtcbkFzQWRtaW5WaWV3aW5nTm9uTWVtYmVyT2ZHcm91cC5zdG9yeSA9IHtcbiAgbmFtZTogJ0FzIGFkbWluLCB2aWV3aW5nIG5vbi1tZW1iZXIgb2YgZ3JvdXAnLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpdGhvdXRQaG9uZU51bWJlciA9IFRlbXBsYXRlLmJpbmQoe30pO1xuV2l0aG91dFBob25lTnVtYmVyLmFyZ3MgPSB7XG4gIGNvbnRhY3Q6IHtcbiAgICAuLi5kZWZhdWx0Q29udGFjdCxcbiAgICBwaG9uZU51bWJlcjogdW5kZWZpbmVkLFxuICB9LFxufTtcbldpdGhvdXRQaG9uZU51bWJlci5zdG9yeSA9IHtcbiAgbmFtZTogJ1dpdGhvdXQgcGhvbmUgbnVtYmVyJyxcbn07XG5cbmV4cG9ydCBjb25zdCBWaWV3aW5nU2VsZiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVmlld2luZ1NlbGYuYXJncyA9IHtcbiAgY29udGFjdDoge1xuICAgIC4uLmRlZmF1bHRDb250YWN0LFxuICAgIGlzTWU6IHRydWUsXG4gIH0sXG59O1xuVmlld2luZ1NlbGYuc3RvcnkgPSB7XG4gIG5hbWU6ICdWaWV3aW5nIHNlbGYnLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpdGhCYWRnZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbldpdGhCYWRnZXMuYXJncyA9IHtcbiAgYmFkZ2VzOiBnZXRGYWtlQmFkZ2VzKDIpLFxufTtcbldpdGhCYWRnZXMuc3RvcnkgPSB7XG4gIG5hbWU6ICdXaXRoIGJhZGdlcycsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aFVucmVhZFN0b3JpZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbldpdGhVbnJlYWRTdG9yaWVzLmFyZ3MgPSB7XG4gIGhhc1N0b3JpZXM6IEhhc1N0b3JpZXMuVW5yZWFkLFxufTtcbldpdGhVbnJlYWRTdG9yaWVzLnN0b3J5TmFtZSA9ICdVbnJlYWQgU3Rvcmllcyc7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLFlBQXVCO0FBQ3ZCLG9CQUFtQjtBQUluQixzQkFBdUI7QUFDdkIsMEJBQTZCO0FBQzdCLHFCQUEyQjtBQUMzQixrQkFBMEI7QUFDMUIsb0NBQXVDO0FBQ3ZDLDBCQUE4QjtBQUM5Qix1QkFBMEI7QUFFMUIsTUFBTSxPQUFPLGdDQUFVLE1BQU0sdUJBQVU7QUFFdkMsTUFBTSxpQkFBbUMsMERBQXVCO0FBQUEsRUFDOUQsT0FBTztBQUNULENBQUM7QUFFRCxNQUFNLGVBQWlDLDBEQUF1QjtBQUFBLEVBQzVELFlBQVk7QUFBQSxFQUNaLFdBQVcsc0JBQU87QUFBQSxFQUNsQixPQUFPLHNCQUFPO0FBQUEsRUFDZCxNQUFNO0FBQ1IsQ0FBQztBQUVELElBQU8sK0JBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0Esa0JBQWtCO0FBQUEsTUFDaEIsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxZQUFZO0FBQUEsTUFDVixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGNBQWMsQ0FBQztBQUFBLElBQ2pCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1YsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxrQkFBa0IsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNqQyxTQUFTO0FBQUEsTUFDUCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsdUJBQXVCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDdEMsa0JBQWtCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDakMsT0FBTztBQUFBLE1BQ0wsY0FBYyxzQkFBVTtBQUFBLElBQzFCO0FBQUEsSUFDQSxhQUFhLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDNUIseUJBQXlCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDeEMscUNBQXFDLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDcEQsaUJBQWlCLEVBQUUsUUFBUSxLQUFLO0FBQUEsRUFDbEM7QUFDRjtBQUVBLE1BQU0sV0FBNkIsaUNBQVEsb0NBQUM7QUFBQSxLQUFpQjtBQUFBLENBQU0sR0FBaEM7QUFFNUIsTUFBTSxhQUFhLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDMUMsV0FBVyxPQUFPO0FBQUEsRUFDaEIsWUFBWTtBQUNkO0FBQ0EsV0FBVyxRQUFRO0FBQUEsRUFDakIsTUFBTTtBQUNSO0FBRU8sTUFBTSxVQUFVLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDdkMsUUFBUSxPQUFPO0FBQUEsRUFDYixZQUFZO0FBQ2Q7QUFDQSxRQUFRLFFBQVE7QUFBQSxFQUNkLE1BQU07QUFDUjtBQUVPLE1BQU0seUJBQXlCLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDdEQsdUJBQXVCLE9BQU87QUFBQSxFQUM1QixZQUFZO0FBQUEsRUFDWixjQUFjO0FBQUEsT0FDVDtBQUFBLElBQ0gsV0FBVztBQUFBLEVBQ2I7QUFDRjtBQUNBLHVCQUF1QixRQUFRO0FBQUEsRUFDN0IsTUFBTTtBQUNSO0FBRU8sTUFBTSxpQ0FBaUMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUM5RCwrQkFBK0IsT0FBTztBQUFBLEVBQ3BDLFVBQVU7QUFDWjtBQUNBLCtCQUErQixRQUFRO0FBQUEsRUFDckMsTUFBTTtBQUNSO0FBRU8sTUFBTSxxQkFBcUIsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNsRCxtQkFBbUIsT0FBTztBQUFBLEVBQ3hCLFNBQVM7QUFBQSxPQUNKO0FBQUEsSUFDSCxhQUFhO0FBQUEsRUFDZjtBQUNGO0FBQ0EsbUJBQW1CLFFBQVE7QUFBQSxFQUN6QixNQUFNO0FBQ1I7QUFFTyxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMzQyxZQUFZLE9BQU87QUFBQSxFQUNqQixTQUFTO0FBQUEsT0FDSjtBQUFBLElBQ0gsTUFBTTtBQUFBLEVBQ1I7QUFDRjtBQUNBLFlBQVksUUFBUTtBQUFBLEVBQ2xCLE1BQU07QUFDUjtBQUVPLE1BQU0sYUFBYSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFdBQVcsT0FBTztBQUFBLEVBQ2hCLFFBQVEsdUNBQWMsQ0FBQztBQUN6QjtBQUNBLFdBQVcsUUFBUTtBQUFBLEVBQ2pCLE1BQU07QUFDUjtBQUVPLE1BQU0sb0JBQW9CLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDakQsa0JBQWtCLE9BQU87QUFBQSxFQUN2QixZQUFZLDBCQUFXO0FBQ3pCO0FBQ0Esa0JBQWtCLFlBQVk7IiwKICAibmFtZXMiOiBbXQp9Cg==
