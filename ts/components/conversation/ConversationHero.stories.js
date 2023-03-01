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
var ConversationHero_stories_exports = {};
__export(ConversationHero_stories_exports, {
  DirectFiveOtherGroups: () => DirectFiveOtherGroups,
  DirectFourOtherGroups: () => DirectFourOtherGroups,
  DirectNoGroupsJustPhoneNumber: () => DirectNoGroupsJustPhoneNumber,
  DirectNoGroupsJustProfile: () => DirectNoGroupsJustProfile,
  DirectNoGroupsName: () => DirectNoGroupsName,
  DirectNoGroupsNoData: () => DirectNoGroupsNoData,
  DirectNoGroupsNoDataNotAccepted: () => DirectNoGroupsNoDataNotAccepted,
  DirectOneOtherGroup: () => DirectOneOtherGroup,
  DirectThreeOtherGroups: () => DirectThreeOtherGroups,
  DirectTwoOtherGroups: () => DirectTwoOtherGroups,
  GroupLongGroupDescription: () => GroupLongGroupDescription,
  GroupManyMembers: () => GroupManyMembers,
  GroupNoName: () => GroupNoName,
  GroupOneMember: () => GroupOneMember,
  GroupZeroMembers: () => GroupZeroMembers,
  NoteToSelf: () => NoteToSelf,
  ReadStories: () => ReadStories,
  UnreadStories: () => UnreadStories,
  default: () => ConversationHero_stories_default
});
module.exports = __toCommonJS(ConversationHero_stories_exports);
var import_react = __toESM(require("react"));
var import_casual = __toESM(require("casual"));
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_ConversationHero = require("./ConversationHero");
var import_Stories = require("../../types/Stories");
var import_StorybookThemeContext = require("../../../.storybook/StorybookThemeContext");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../../util/setupI18n");
var import_Util = require("../../types/Util");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var ConversationHero_stories_default = {
  title: "Components/Conversation/ConversationHero",
  component: import_ConversationHero.ConversationHero,
  argTypes: {
    conversationType: {
      defaultValue: "direct"
    },
    i18n: {
      defaultValue: i18n
    },
    theme: {
      defaultValue: import_Util.ThemeType.light
    },
    unblurAvatar: { action: true },
    updateSharedGroups: { action: true },
    viewUserStories: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => {
  const theme = (0, import_react.useContext)(import_StorybookThemeContext.StorybookThemeContext);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    style: { width: "480px" }
  }, /* @__PURE__ */ import_react.default.createElement(import_ConversationHero.ConversationHero, {
    ...(0, import_getDefaultConversation.getDefaultConversation)(),
    ...args,
    theme
  }));
}, "Template");
const DirectFiveOtherGroups = Template.bind({});
DirectFiveOtherGroups.args = {
  sharedGroupNames: Array.from(Array(5), () => import_casual.default.title)
};
DirectFiveOtherGroups.story = {
  name: "Direct (Five Other Groups)"
};
const DirectFourOtherGroups = Template.bind({});
DirectFourOtherGroups.args = {
  sharedGroupNames: Array.from(Array(4), () => import_casual.default.title)
};
DirectFourOtherGroups.story = {
  name: "Direct (Four Other Groups)"
};
const DirectThreeOtherGroups = Template.bind({});
DirectThreeOtherGroups.args = {
  sharedGroupNames: Array.from(Array(3), () => import_casual.default.title)
};
DirectThreeOtherGroups.story = {
  name: "Direct (Three Other Groups)"
};
const DirectTwoOtherGroups = Template.bind({});
DirectTwoOtherGroups.args = {
  sharedGroupNames: Array.from(Array(2), () => import_casual.default.title)
};
DirectTwoOtherGroups.story = {
  name: "Direct (Two Other Groups)"
};
const DirectOneOtherGroup = Template.bind({});
DirectOneOtherGroup.args = {
  sharedGroupNames: [import_casual.default.title]
};
DirectOneOtherGroup.story = {
  name: "Direct (One Other Group)"
};
const DirectNoGroupsName = Template.bind({});
DirectNoGroupsName.args = {
  about: "\u{1F44D} Free to chat"
};
DirectNoGroupsName.story = {
  name: "Direct (No Groups, Name)"
};
const DirectNoGroupsJustProfile = Template.bind({});
DirectNoGroupsJustProfile.args = {
  phoneNumber: import_casual.default.phone
};
DirectNoGroupsJustProfile.story = {
  name: "Direct (No Groups, Just Profile)"
};
const DirectNoGroupsJustPhoneNumber = Template.bind({});
DirectNoGroupsJustPhoneNumber.args = {
  name: "",
  phoneNumber: import_casual.default.phone,
  profileName: "",
  title: ""
};
DirectNoGroupsJustPhoneNumber.story = {
  name: "Direct (No Groups, Just Phone Number)"
};
const DirectNoGroupsNoData = Template.bind({});
DirectNoGroupsNoData.args = {
  avatarPath: void 0,
  name: "",
  phoneNumber: "",
  profileName: "",
  title: ""
};
DirectNoGroupsNoData.story = {
  name: "Direct (No Groups, No Data)"
};
const DirectNoGroupsNoDataNotAccepted = Template.bind({});
DirectNoGroupsNoDataNotAccepted.args = {
  acceptedMessageRequest: false,
  avatarPath: void 0,
  name: "",
  phoneNumber: "",
  profileName: "",
  title: ""
};
DirectNoGroupsNoDataNotAccepted.story = {
  name: "Direct (No Groups, No Data, Not Accepted)"
};
const GroupManyMembers = Template.bind({});
GroupManyMembers.args = {
  conversationType: "group",
  groupDescription: import_casual.default.sentence,
  membersCount: import_casual.default.integer(20, 100),
  title: import_casual.default.title
};
GroupManyMembers.story = {
  name: "Group (many members)"
};
const GroupOneMember = Template.bind({});
GroupOneMember.args = {
  avatarPath: void 0,
  conversationType: "group",
  groupDescription: import_casual.default.sentence,
  membersCount: 1,
  title: import_casual.default.title
};
GroupOneMember.story = {
  name: "Group (one member)"
};
const GroupZeroMembers = Template.bind({});
GroupZeroMembers.args = {
  avatarPath: void 0,
  conversationType: "group",
  groupDescription: import_casual.default.sentence,
  membersCount: 0,
  title: import_casual.default.title
};
GroupZeroMembers.story = {
  name: "Group (zero members)"
};
const GroupLongGroupDescription = Template.bind({});
GroupLongGroupDescription.args = {
  conversationType: "group",
  groupDescription: "This is a group for all the rock climbers of NYC. We really like to climb rocks and these NYC people climb any rock. No rock is too small or too big to be climbed. We will ascend upon all rocks, and not just in NYC, in the whole world. We are just getting started, NYC is just the beginning, watch out rocks in the galaxy. Kuiper belt I'm looking at you. We will put on a space suit and climb all your rocks. No rock is near nor far for the rock climbers of NYC.",
  membersCount: import_casual.default.integer(1, 10),
  title: import_casual.default.title
};
GroupLongGroupDescription.story = {
  name: "Group (long group description)"
};
const GroupNoName = Template.bind({});
GroupNoName.args = {
  conversationType: "group",
  membersCount: 0,
  name: "",
  title: ""
};
GroupNoName.story = {
  name: "Group (No name)"
};
const NoteToSelf = Template.bind({});
NoteToSelf.args = {
  isMe: true
};
NoteToSelf.story = {
  name: "Note to Self"
};
const UnreadStories = Template.bind({});
UnreadStories.args = {
  hasStories: import_Stories.HasStories.Unread
};
const ReadStories = Template.bind({});
ReadStories.args = {
  hasStories: import_Stories.HasStories.Read
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DirectFiveOtherGroups,
  DirectFourOtherGroups,
  DirectNoGroupsJustPhoneNumber,
  DirectNoGroupsJustProfile,
  DirectNoGroupsName,
  DirectNoGroupsNoData,
  DirectNoGroupsNoDataNotAccepted,
  DirectOneOtherGroup,
  DirectThreeOtherGroups,
  DirectTwoOtherGroups,
  GroupLongGroupDescription,
  GroupManyMembers,
  GroupNoName,
  GroupOneMember,
  GroupZeroMembers,
  NoteToSelf,
  ReadStories,
  UnreadStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uSGVyby5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnkgfSBmcm9tICdAc3Rvcnlib29rL3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNhc3VhbCBmcm9tICdjYXN1YWwnO1xuXG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL0NvbnZlcnNhdGlvbkhlcm8nO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uSGVybyB9IGZyb20gJy4vQ29udmVyc2F0aW9uSGVybyc7XG5pbXBvcnQgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBTdG9yeWJvb2tUaGVtZUNvbnRleHQgfSBmcm9tICcuLi8uLi8uLi8uc3Rvcnlib29rL1N0b3J5Ym9va1RoZW1lQ29udGV4dCc7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi8uLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvQ29udmVyc2F0aW9uL0NvbnZlcnNhdGlvbkhlcm8nLFxuICBjb21wb25lbnQ6IENvbnZlcnNhdGlvbkhlcm8sXG4gIGFyZ1R5cGVzOiB7XG4gICAgY29udmVyc2F0aW9uVHlwZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0JyxcbiAgICB9LFxuICAgIGkxOG46IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogaTE4bixcbiAgICB9LFxuICAgIHRoZW1lOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFRoZW1lVHlwZS5saWdodCxcbiAgICB9LFxuICAgIHVuYmx1ckF2YXRhcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICB1cGRhdGVTaGFyZWRHcm91cHM6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgdmlld1VzZXJTdG9yaWVzOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICB9LFxufSBhcyBNZXRhO1xuXG5jb25zdCBUZW1wbGF0ZTogU3Rvcnk8UHJvcHM+ID0gYXJncyA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlQ29udGV4dChTdG9yeWJvb2tUaGVtZUNvbnRleHQpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0ODBweCcgfX0+XG4gICAgICA8Q29udmVyc2F0aW9uSGVybyB7Li4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpfSB7Li4uYXJnc30gdGhlbWU9e3RoZW1lfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdEZpdmVPdGhlckdyb3VwcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGlyZWN0Rml2ZU90aGVyR3JvdXBzLmFyZ3MgPSB7XG4gIHNoYXJlZEdyb3VwTmFtZXM6IEFycmF5LmZyb20oQXJyYXkoNSksICgpID0+IGNhc3VhbC50aXRsZSksXG59O1xuRGlyZWN0Rml2ZU90aGVyR3JvdXBzLnN0b3J5ID0ge1xuICBuYW1lOiAnRGlyZWN0IChGaXZlIE90aGVyIEdyb3VwcyknLFxufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdEZvdXJPdGhlckdyb3VwcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGlyZWN0Rm91ck90aGVyR3JvdXBzLmFyZ3MgPSB7XG4gIHNoYXJlZEdyb3VwTmFtZXM6IEFycmF5LmZyb20oQXJyYXkoNCksICgpID0+IGNhc3VhbC50aXRsZSksXG59O1xuRGlyZWN0Rm91ck90aGVyR3JvdXBzLnN0b3J5ID0ge1xuICBuYW1lOiAnRGlyZWN0IChGb3VyIE90aGVyIEdyb3VwcyknLFxufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdFRocmVlT3RoZXJHcm91cHMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRpcmVjdFRocmVlT3RoZXJHcm91cHMuYXJncyA9IHtcbiAgc2hhcmVkR3JvdXBOYW1lczogQXJyYXkuZnJvbShBcnJheSgzKSwgKCkgPT4gY2FzdWFsLnRpdGxlKSxcbn07XG5EaXJlY3RUaHJlZU90aGVyR3JvdXBzLnN0b3J5ID0ge1xuICBuYW1lOiAnRGlyZWN0IChUaHJlZSBPdGhlciBHcm91cHMpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBEaXJlY3RUd29PdGhlckdyb3VwcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGlyZWN0VHdvT3RoZXJHcm91cHMuYXJncyA9IHtcbiAgc2hhcmVkR3JvdXBOYW1lczogQXJyYXkuZnJvbShBcnJheSgyKSwgKCkgPT4gY2FzdWFsLnRpdGxlKSxcbn07XG5EaXJlY3RUd29PdGhlckdyb3Vwcy5zdG9yeSA9IHtcbiAgbmFtZTogJ0RpcmVjdCAoVHdvIE90aGVyIEdyb3VwcyknLFxufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdE9uZU90aGVyR3JvdXAgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRpcmVjdE9uZU90aGVyR3JvdXAuYXJncyA9IHtcbiAgc2hhcmVkR3JvdXBOYW1lczogW2Nhc3VhbC50aXRsZV0sXG59O1xuRGlyZWN0T25lT3RoZXJHcm91cC5zdG9yeSA9IHtcbiAgbmFtZTogJ0RpcmVjdCAoT25lIE90aGVyIEdyb3VwKScsXG59O1xuXG5leHBvcnQgY29uc3QgRGlyZWN0Tm9Hcm91cHNOYW1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5EaXJlY3ROb0dyb3Vwc05hbWUuYXJncyA9IHtcbiAgYWJvdXQ6ICdcdUQ4M0RcdURDNEQgRnJlZSB0byBjaGF0Jyxcbn07XG5EaXJlY3ROb0dyb3Vwc05hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdEaXJlY3QgKE5vIEdyb3VwcywgTmFtZSknLFxufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdE5vR3JvdXBzSnVzdFByb2ZpbGUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRpcmVjdE5vR3JvdXBzSnVzdFByb2ZpbGUuYXJncyA9IHtcbiAgcGhvbmVOdW1iZXI6IGNhc3VhbC5waG9uZSxcbn07XG5EaXJlY3ROb0dyb3Vwc0p1c3RQcm9maWxlLnN0b3J5ID0ge1xuICBuYW1lOiAnRGlyZWN0IChObyBHcm91cHMsIEp1c3QgUHJvZmlsZSknLFxufTtcblxuZXhwb3J0IGNvbnN0IERpcmVjdE5vR3JvdXBzSnVzdFBob25lTnVtYmVyID0gVGVtcGxhdGUuYmluZCh7fSk7XG5EaXJlY3ROb0dyb3Vwc0p1c3RQaG9uZU51bWJlci5hcmdzID0ge1xuICBuYW1lOiAnJyxcbiAgcGhvbmVOdW1iZXI6IGNhc3VhbC5waG9uZSxcbiAgcHJvZmlsZU5hbWU6ICcnLFxuICB0aXRsZTogJycsXG59O1xuRGlyZWN0Tm9Hcm91cHNKdXN0UGhvbmVOdW1iZXIuc3RvcnkgPSB7XG4gIG5hbWU6ICdEaXJlY3QgKE5vIEdyb3VwcywgSnVzdCBQaG9uZSBOdW1iZXIpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBEaXJlY3ROb0dyb3Vwc05vRGF0YSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGlyZWN0Tm9Hcm91cHNOb0RhdGEuYXJncyA9IHtcbiAgYXZhdGFyUGF0aDogdW5kZWZpbmVkLFxuICBuYW1lOiAnJyxcbiAgcGhvbmVOdW1iZXI6ICcnLFxuICBwcm9maWxlTmFtZTogJycsXG4gIHRpdGxlOiAnJyxcbn07XG5EaXJlY3ROb0dyb3Vwc05vRGF0YS5zdG9yeSA9IHtcbiAgbmFtZTogJ0RpcmVjdCAoTm8gR3JvdXBzLCBObyBEYXRhKScsXG59O1xuXG5leHBvcnQgY29uc3QgRGlyZWN0Tm9Hcm91cHNOb0RhdGFOb3RBY2NlcHRlZCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuRGlyZWN0Tm9Hcm91cHNOb0RhdGFOb3RBY2NlcHRlZC5hcmdzID0ge1xuICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiBmYWxzZSxcbiAgYXZhdGFyUGF0aDogdW5kZWZpbmVkLFxuICBuYW1lOiAnJyxcbiAgcGhvbmVOdW1iZXI6ICcnLFxuICBwcm9maWxlTmFtZTogJycsXG4gIHRpdGxlOiAnJyxcbn07XG5EaXJlY3ROb0dyb3Vwc05vRGF0YU5vdEFjY2VwdGVkLnN0b3J5ID0ge1xuICBuYW1lOiAnRGlyZWN0IChObyBHcm91cHMsIE5vIERhdGEsIE5vdCBBY2NlcHRlZCknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwTWFueU1lbWJlcnMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdyb3VwTWFueU1lbWJlcnMuYXJncyA9IHtcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgZ3JvdXBEZXNjcmlwdGlvbjogY2FzdWFsLnNlbnRlbmNlLFxuICBtZW1iZXJzQ291bnQ6IGNhc3VhbC5pbnRlZ2VyKDIwLCAxMDApLFxuICB0aXRsZTogY2FzdWFsLnRpdGxlLFxufTtcbkdyb3VwTWFueU1lbWJlcnMuc3RvcnkgPSB7XG4gIG5hbWU6ICdHcm91cCAobWFueSBtZW1iZXJzKScsXG59O1xuXG5leHBvcnQgY29uc3QgR3JvdXBPbmVNZW1iZXIgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdyb3VwT25lTWVtYmVyLmFyZ3MgPSB7XG4gIGF2YXRhclBhdGg6IHVuZGVmaW5lZCxcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgZ3JvdXBEZXNjcmlwdGlvbjogY2FzdWFsLnNlbnRlbmNlLFxuICBtZW1iZXJzQ291bnQ6IDEsXG4gIHRpdGxlOiBjYXN1YWwudGl0bGUsXG59O1xuR3JvdXBPbmVNZW1iZXIuc3RvcnkgPSB7XG4gIG5hbWU6ICdHcm91cCAob25lIG1lbWJlciknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwWmVyb01lbWJlcnMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdyb3VwWmVyb01lbWJlcnMuYXJncyA9IHtcbiAgYXZhdGFyUGF0aDogdW5kZWZpbmVkLFxuICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxuICBncm91cERlc2NyaXB0aW9uOiBjYXN1YWwuc2VudGVuY2UsXG4gIG1lbWJlcnNDb3VudDogMCxcbiAgdGl0bGU6IGNhc3VhbC50aXRsZSxcbn07XG5Hcm91cFplcm9NZW1iZXJzLnN0b3J5ID0ge1xuICBuYW1lOiAnR3JvdXAgKHplcm8gbWVtYmVycyknLFxufTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwTG9uZ0dyb3VwRGVzY3JpcHRpb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkdyb3VwTG9uZ0dyb3VwRGVzY3JpcHRpb24uYXJncyA9IHtcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgZ3JvdXBEZXNjcmlwdGlvbjpcbiAgICBcIlRoaXMgaXMgYSBncm91cCBmb3IgYWxsIHRoZSByb2NrIGNsaW1iZXJzIG9mIE5ZQy4gV2UgcmVhbGx5IGxpa2UgdG8gY2xpbWIgcm9ja3MgYW5kIHRoZXNlIE5ZQyBwZW9wbGUgY2xpbWIgYW55IHJvY2suIE5vIHJvY2sgaXMgdG9vIHNtYWxsIG9yIHRvbyBiaWcgdG8gYmUgY2xpbWJlZC4gV2Ugd2lsbCBhc2NlbmQgdXBvbiBhbGwgcm9ja3MsIGFuZCBub3QganVzdCBpbiBOWUMsIGluIHRoZSB3aG9sZSB3b3JsZC4gV2UgYXJlIGp1c3QgZ2V0dGluZyBzdGFydGVkLCBOWUMgaXMganVzdCB0aGUgYmVnaW5uaW5nLCB3YXRjaCBvdXQgcm9ja3MgaW4gdGhlIGdhbGF4eS4gS3VpcGVyIGJlbHQgSSdtIGxvb2tpbmcgYXQgeW91LiBXZSB3aWxsIHB1dCBvbiBhIHNwYWNlIHN1aXQgYW5kIGNsaW1iIGFsbCB5b3VyIHJvY2tzLiBObyByb2NrIGlzIG5lYXIgbm9yIGZhciBmb3IgdGhlIHJvY2sgY2xpbWJlcnMgb2YgTllDLlwiLFxuICBtZW1iZXJzQ291bnQ6IGNhc3VhbC5pbnRlZ2VyKDEsIDEwKSxcbiAgdGl0bGU6IGNhc3VhbC50aXRsZSxcbn07XG5Hcm91cExvbmdHcm91cERlc2NyaXB0aW9uLnN0b3J5ID0ge1xuICBuYW1lOiAnR3JvdXAgKGxvbmcgZ3JvdXAgZGVzY3JpcHRpb24pJyxcbn07XG5cbmV4cG9ydCBjb25zdCBHcm91cE5vTmFtZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuR3JvdXBOb05hbWUuYXJncyA9IHtcbiAgY29udmVyc2F0aW9uVHlwZTogJ2dyb3VwJyxcbiAgbWVtYmVyc0NvdW50OiAwLFxuICBuYW1lOiAnJyxcbiAgdGl0bGU6ICcnLFxufTtcbkdyb3VwTm9OYW1lLnN0b3J5ID0ge1xuICBuYW1lOiAnR3JvdXAgKE5vIG5hbWUpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBOb3RlVG9TZWxmID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Ob3RlVG9TZWxmLmFyZ3MgPSB7XG4gIGlzTWU6IHRydWUsXG59O1xuTm90ZVRvU2VsZi5zdG9yeSA9IHtcbiAgbmFtZTogJ05vdGUgdG8gU2VsZicsXG59O1xuXG5leHBvcnQgY29uc3QgVW5yZWFkU3RvcmllcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVW5yZWFkU3Rvcmllcy5hcmdzID0ge1xuICBoYXNTdG9yaWVzOiBIYXNTdG9yaWVzLlVucmVhZCxcbn07XG5cbmV4cG9ydCBjb25zdCBSZWFkU3RvcmllcyA9IFRlbXBsYXRlLmJpbmQoe30pO1xuUmVhZFN0b3JpZXMuYXJncyA9IHtcbiAgaGFzU3RvcmllczogSGFzU3Rvcmllcy5SZWFkLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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
