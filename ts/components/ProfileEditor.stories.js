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
var ProfileEditor_stories_exports = {};
__export(ProfileEditor_stories_exports, {
  FullSet: () => FullSet,
  UsernameEditingGeneralError: () => UsernameEditingGeneralError,
  UsernameEditingSaving: () => UsernameEditingSaving,
  UsernameEditingUsernameMalformed: () => UsernameEditingUsernameMalformed,
  UsernameEditingUsernameTaken: () => UsernameEditingUsernameTaken,
  WithCustomAbout: () => WithCustomAbout,
  WithFullName: () => WithFullName,
  WithUsernameFlagEnabled: () => WithUsernameFlagEnabled,
  WithUsernameFlagEnabledAndUsername: () => WithUsernameFlagEnabledAndUsername,
  default: () => ProfileEditor_stories_default
});
module.exports = __toCommonJS(ProfileEditor_stories_exports);
var import_react = __toESM(require("react"));
var import_casual = __toESM(require("casual"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_ProfileEditor = require("./ProfileEditor");
var import_UUID = require("../types/UUID");
var import_conversationsEnums = require("../state/ducks/conversationsEnums");
var import_getRandomColor = require("../test-both/helpers/getRandomColor");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var ProfileEditor_stories_default = {
  component: import_ProfileEditor.ProfileEditor,
  title: "Components/ProfileEditor",
  argTypes: {
    aboutEmoji: {
      defaultValue: ""
    },
    aboutText: {
      defaultValue: import_casual.default.sentence
    },
    profileAvatarPath: {
      defaultValue: void 0
    },
    clearUsernameSave: { action: true },
    conversationId: {
      defaultValue: import_UUID.UUID.generate().toString()
    },
    color: {
      defaultValue: (0, import_getRandomColor.getRandomColor)()
    },
    deleteAvatarFromDisk: { action: true },
    familyName: {
      defaultValue: import_casual.default.last_name
    },
    firstName: {
      defaultValue: import_casual.default.first_name
    },
    i18n: {
      defaultValue: i18n
    },
    isUsernameFlagEnabled: {
      control: { type: "checkbox" },
      defaultValue: false
    },
    onEditStateChanged: { action: true },
    onProfileChanged: { action: true },
    onSetSkinTone: { action: true },
    recentEmojis: {
      defaultValue: []
    },
    replaceAvatar: { action: true },
    saveAvatarToDisk: { action: true },
    saveUsername: { action: true },
    skinTone: {
      defaultValue: 0
    },
    userAvatarData: {
      defaultValue: []
    },
    username: {
      defaultValue: import_casual.default.username
    },
    usernameSaveState: {
      control: { type: "radio" },
      defaultValue: import_conversationsEnums.UsernameSaveState.None,
      options: {
        None: import_conversationsEnums.UsernameSaveState.None,
        Saving: import_conversationsEnums.UsernameSaveState.Saving,
        UsernameTakenError: import_conversationsEnums.UsernameSaveState.UsernameTakenError,
        UsernameMalformedError: import_conversationsEnums.UsernameSaveState.UsernameMalformedError,
        GeneralError: import_conversationsEnums.UsernameSaveState.GeneralError,
        DeleteFailed: import_conversationsEnums.UsernameSaveState.DeleteFailed,
        Success: import_conversationsEnums.UsernameSaveState.Success
      }
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => {
  const [skinTone, setSkinTone] = (0, import_react.useState)(0);
  return /* @__PURE__ */ import_react.default.createElement(import_ProfileEditor.ProfileEditor, {
    ...args,
    skinTone,
    onSetSkinTone: setSkinTone
  });
}, "Template");
const FullSet = Template.bind({});
FullSet.args = {
  aboutEmoji: "\u{1F64F}",
  aboutText: "Live. Laugh. Love",
  familyName: import_casual.default.last_name,
  firstName: import_casual.default.first_name,
  profileAvatarPath: "/fixtures/kitten-3-64-64.jpg"
};
const WithFullName = Template.bind({});
WithFullName.args = {
  familyName: import_casual.default.last_name
};
WithFullName.story = {
  name: "with Full Name"
};
const WithCustomAbout = Template.bind({});
WithCustomAbout.args = {
  aboutEmoji: "\u{1F64F}",
  aboutText: "Live. Laugh. Love"
};
WithCustomAbout.story = {
  name: "with Custom About"
};
const WithUsernameFlagEnabled = Template.bind({});
WithUsernameFlagEnabled.args = {
  isUsernameFlagEnabled: true
};
WithUsernameFlagEnabled.story = {
  name: "with Username flag enabled"
};
const WithUsernameFlagEnabledAndUsername = Template.bind({});
WithUsernameFlagEnabledAndUsername.args = {
  isUsernameFlagEnabled: true,
  username: import_casual.default.username
};
WithUsernameFlagEnabledAndUsername.story = {
  name: "with Username flag enabled and username"
};
const UsernameEditingSaving = Template.bind({});
UsernameEditingSaving.args = {
  isUsernameFlagEnabled: true,
  usernameSaveState: import_conversationsEnums.UsernameSaveState.Saving,
  username: import_casual.default.username
};
UsernameEditingSaving.story = {
  name: "Username editing, saving"
};
const UsernameEditingUsernameTaken = Template.bind({});
UsernameEditingUsernameTaken.args = {
  isUsernameFlagEnabled: true,
  usernameSaveState: import_conversationsEnums.UsernameSaveState.UsernameTakenError,
  username: import_casual.default.username
};
UsernameEditingUsernameTaken.story = {
  name: "Username editing, username taken"
};
const UsernameEditingUsernameMalformed = Template.bind({});
UsernameEditingUsernameMalformed.args = {
  isUsernameFlagEnabled: true,
  usernameSaveState: import_conversationsEnums.UsernameSaveState.UsernameMalformedError,
  username: import_casual.default.username
};
UsernameEditingUsernameMalformed.story = {
  name: "Username editing, username malformed"
};
const UsernameEditingGeneralError = Template.bind({});
UsernameEditingGeneralError.args = {
  isUsernameFlagEnabled: true,
  usernameSaveState: import_conversationsEnums.UsernameSaveState.GeneralError,
  username: import_casual.default.username
};
UsernameEditingGeneralError.story = {
  name: "Username editing, general error"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FullSet,
  UsernameEditingGeneralError,
  UsernameEditingSaving,
  UsernameEditingUsernameMalformed,
  UsernameEditingUsernameTaken,
  WithCustomAbout,
  WithFullName,
  WithUsernameFlagEnabled,
  WithUsernameFlagEnabledAndUsername
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUHJvZmlsZUVkaXRvci5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2FzdWFsIGZyb20gJ2Nhc3VhbCc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9Qcm9maWxlRWRpdG9yJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgUHJvZmlsZUVkaXRvciB9IGZyb20gJy4vUHJvZmlsZUVkaXRvcic7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBVc2VybmFtZVNhdmVTdGF0ZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnNFbnVtcyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldFJhbmRvbUNvbG9yJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnQ6IFByb2ZpbGVFZGl0b3IsXG4gIHRpdGxlOiAnQ29tcG9uZW50cy9Qcm9maWxlRWRpdG9yJyxcbiAgYXJnVHlwZXM6IHtcbiAgICBhYm91dEVtb2ppOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgIH0sXG4gICAgYWJvdXRUZXh0OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGNhc3VhbC5zZW50ZW5jZSxcbiAgICB9LFxuICAgIHByb2ZpbGVBdmF0YXJQYXRoOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGNsZWFyVXNlcm5hbWVTYXZlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIGNvbnZlcnNhdGlvbklkOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICB9LFxuICAgIGRlbGV0ZUF2YXRhckZyb21EaXNrOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIGZhbWlseU5hbWU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogY2FzdWFsLmxhc3RfbmFtZSxcbiAgICB9LFxuICAgIGZpcnN0TmFtZToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBjYXN1YWwuZmlyc3RfbmFtZSxcbiAgICB9LFxuICAgIGkxOG46IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogaTE4bixcbiAgICB9LFxuICAgIGlzVXNlcm5hbWVGbGFnRW5hYmxlZDoge1xuICAgICAgY29udHJvbDogeyB0eXBlOiAnY2hlY2tib3gnIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gICAgb25FZGl0U3RhdGVDaGFuZ2VkOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uUHJvZmlsZUNoYW5nZWQ6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25TZXRTa2luVG9uZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICByZWNlbnRFbW9qaXM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW10sXG4gICAgfSxcbiAgICByZXBsYWNlQXZhdGFyOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNhdmVBdmF0YXJUb0Rpc2s6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgc2F2ZVVzZXJuYW1lOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNraW5Ub25lOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgfSxcbiAgICB1c2VyQXZhdGFyRGF0YToge1xuICAgICAgZGVmYXVsdFZhbHVlOiBbXSxcbiAgICB9LFxuICAgIHVzZXJuYW1lOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGNhc3VhbC51c2VybmFtZSxcbiAgICB9LFxuICAgIHVzZXJuYW1lU2F2ZVN0YXRlOiB7XG4gICAgICBjb250cm9sOiB7IHR5cGU6ICdyYWRpbycgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogVXNlcm5hbWVTYXZlU3RhdGUuTm9uZSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgTm9uZTogVXNlcm5hbWVTYXZlU3RhdGUuTm9uZSxcbiAgICAgICAgU2F2aW5nOiBVc2VybmFtZVNhdmVTdGF0ZS5TYXZpbmcsXG4gICAgICAgIFVzZXJuYW1lVGFrZW5FcnJvcjogVXNlcm5hbWVTYXZlU3RhdGUuVXNlcm5hbWVUYWtlbkVycm9yLFxuICAgICAgICBVc2VybmFtZU1hbGZvcm1lZEVycm9yOiBVc2VybmFtZVNhdmVTdGF0ZS5Vc2VybmFtZU1hbGZvcm1lZEVycm9yLFxuICAgICAgICBHZW5lcmFsRXJyb3I6IFVzZXJuYW1lU2F2ZVN0YXRlLkdlbmVyYWxFcnJvcixcbiAgICAgICAgRGVsZXRlRmFpbGVkOiBVc2VybmFtZVNhdmVTdGF0ZS5EZWxldGVGYWlsZWQsXG4gICAgICAgIFN1Y2Nlc3M6IFVzZXJuYW1lU2F2ZVN0YXRlLlN1Y2Nlc3MsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiB7XG4gIGNvbnN0IFtza2luVG9uZSwgc2V0U2tpblRvbmVdID0gdXNlU3RhdGUoMCk7XG5cbiAgcmV0dXJuIChcbiAgICA8UHJvZmlsZUVkaXRvciB7Li4uYXJnc30gc2tpblRvbmU9e3NraW5Ub25lfSBvblNldFNraW5Ub25lPXtzZXRTa2luVG9uZX0gLz5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBGdWxsU2V0ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5GdWxsU2V0LmFyZ3MgPSB7XG4gIGFib3V0RW1vamk6ICdcdUQ4M0RcdURFNEYnLFxuICBhYm91dFRleHQ6ICdMaXZlLiBMYXVnaC4gTG92ZScsXG4gIGZhbWlseU5hbWU6IGNhc3VhbC5sYXN0X25hbWUsXG4gIGZpcnN0TmFtZTogY2FzdWFsLmZpcnN0X25hbWUsXG4gIHByb2ZpbGVBdmF0YXJQYXRoOiAnL2ZpeHR1cmVzL2tpdHRlbi0zLTY0LTY0LmpwZycsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aEZ1bGxOYW1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5XaXRoRnVsbE5hbWUuYXJncyA9IHtcbiAgZmFtaWx5TmFtZTogY2FzdWFsLmxhc3RfbmFtZSxcbn07XG5XaXRoRnVsbE5hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICd3aXRoIEZ1bGwgTmFtZScsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aEN1c3RvbUFib3V0ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5XaXRoQ3VzdG9tQWJvdXQuYXJncyA9IHtcbiAgYWJvdXRFbW9qaTogJ1x1RDgzRFx1REU0RicsXG4gIGFib3V0VGV4dDogJ0xpdmUuIExhdWdoLiBMb3ZlJyxcbn07XG5XaXRoQ3VzdG9tQWJvdXQuc3RvcnkgPSB7XG4gIG5hbWU6ICd3aXRoIEN1c3RvbSBBYm91dCcsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aFVzZXJuYW1lRmxhZ0VuYWJsZWQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbldpdGhVc2VybmFtZUZsYWdFbmFibGVkLmFyZ3MgPSB7XG4gIGlzVXNlcm5hbWVGbGFnRW5hYmxlZDogdHJ1ZSxcbn07XG5XaXRoVXNlcm5hbWVGbGFnRW5hYmxlZC5zdG9yeSA9IHtcbiAgbmFtZTogJ3dpdGggVXNlcm5hbWUgZmxhZyBlbmFibGVkJyxcbn07XG5cbmV4cG9ydCBjb25zdCBXaXRoVXNlcm5hbWVGbGFnRW5hYmxlZEFuZFVzZXJuYW1lID0gVGVtcGxhdGUuYmluZCh7fSk7XG5XaXRoVXNlcm5hbWVGbGFnRW5hYmxlZEFuZFVzZXJuYW1lLmFyZ3MgPSB7XG4gIGlzVXNlcm5hbWVGbGFnRW5hYmxlZDogdHJ1ZSxcbiAgdXNlcm5hbWU6IGNhc3VhbC51c2VybmFtZSxcbn07XG5XaXRoVXNlcm5hbWVGbGFnRW5hYmxlZEFuZFVzZXJuYW1lLnN0b3J5ID0ge1xuICBuYW1lOiAnd2l0aCBVc2VybmFtZSBmbGFnIGVuYWJsZWQgYW5kIHVzZXJuYW1lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBVc2VybmFtZUVkaXRpbmdTYXZpbmcgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblVzZXJuYW1lRWRpdGluZ1NhdmluZy5hcmdzID0ge1xuICBpc1VzZXJuYW1lRmxhZ0VuYWJsZWQ6IHRydWUsXG4gIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZS5TYXZpbmcsXG4gIHVzZXJuYW1lOiBjYXN1YWwudXNlcm5hbWUsXG59O1xuVXNlcm5hbWVFZGl0aW5nU2F2aW5nLnN0b3J5ID0ge1xuICBuYW1lOiAnVXNlcm5hbWUgZWRpdGluZywgc2F2aW5nJyxcbn07XG5cbmV4cG9ydCBjb25zdCBVc2VybmFtZUVkaXRpbmdVc2VybmFtZVRha2VuID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Vc2VybmFtZUVkaXRpbmdVc2VybmFtZVRha2VuLmFyZ3MgPSB7XG4gIGlzVXNlcm5hbWVGbGFnRW5hYmxlZDogdHJ1ZSxcbiAgdXNlcm5hbWVTYXZlU3RhdGU6IFVzZXJuYW1lU2F2ZVN0YXRlLlVzZXJuYW1lVGFrZW5FcnJvcixcbiAgdXNlcm5hbWU6IGNhc3VhbC51c2VybmFtZSxcbn07XG5Vc2VybmFtZUVkaXRpbmdVc2VybmFtZVRha2VuLnN0b3J5ID0ge1xuICBuYW1lOiAnVXNlcm5hbWUgZWRpdGluZywgdXNlcm5hbWUgdGFrZW4nLFxufTtcblxuZXhwb3J0IGNvbnN0IFVzZXJuYW1lRWRpdGluZ1VzZXJuYW1lTWFsZm9ybWVkID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Vc2VybmFtZUVkaXRpbmdVc2VybmFtZU1hbGZvcm1lZC5hcmdzID0ge1xuICBpc1VzZXJuYW1lRmxhZ0VuYWJsZWQ6IHRydWUsXG4gIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZS5Vc2VybmFtZU1hbGZvcm1lZEVycm9yLFxuICB1c2VybmFtZTogY2FzdWFsLnVzZXJuYW1lLFxufTtcblVzZXJuYW1lRWRpdGluZ1VzZXJuYW1lTWFsZm9ybWVkLnN0b3J5ID0ge1xuICBuYW1lOiAnVXNlcm5hbWUgZWRpdGluZywgdXNlcm5hbWUgbWFsZm9ybWVkJyxcbn07XG5cbmV4cG9ydCBjb25zdCBVc2VybmFtZUVkaXRpbmdHZW5lcmFsRXJyb3IgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblVzZXJuYW1lRWRpdGluZ0dlbmVyYWxFcnJvci5hcmdzID0ge1xuICBpc1VzZXJuYW1lRmxhZ0VuYWJsZWQ6IHRydWUsXG4gIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZS5HZW5lcmFsRXJyb3IsXG4gIHVzZXJuYW1lOiBjYXN1YWwudXNlcm5hbWUsXG59O1xuVXNlcm5hbWVFZGl0aW5nR2VuZXJhbEVycm9yLnN0b3J5ID0ge1xuICBuYW1lOiAnVXNlcm5hbWUgZWRpdGluZywgZ2VuZXJhbCBlcnJvcicsXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFnQztBQUNoQyxvQkFBbUI7QUFHbkIsc0JBQXVCO0FBQ3ZCLDJCQUE4QjtBQUM5QixrQkFBcUI7QUFDckIsZ0NBQWtDO0FBQ2xDLDRCQUErQjtBQUMvQix1QkFBMEI7QUFFMUIsTUFBTSxPQUFPLGdDQUFVLE1BQU0sdUJBQVU7QUFFdkMsSUFBTyxnQ0FBUTtBQUFBLEVBQ2IsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsVUFBVTtBQUFBLElBQ1IsWUFBWTtBQUFBLE1BQ1YsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxjQUFjLHNCQUFPO0FBQUEsSUFDdkI7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLE1BQ2pCLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsbUJBQW1CLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDbEMsZ0JBQWdCO0FBQUEsTUFDZCxjQUFjLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsSUFDekM7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGNBQWMsMENBQWU7QUFBQSxJQUMvQjtBQUFBLElBQ0Esc0JBQXNCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDckMsWUFBWTtBQUFBLE1BQ1YsY0FBYyxzQkFBTztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxjQUFjLHNCQUFPO0FBQUEsSUFDdkI7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsdUJBQXVCO0FBQUEsTUFDckIsU0FBUyxFQUFFLE1BQU0sV0FBVztBQUFBLE1BQzVCLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0Esb0JBQW9CLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDbkMsa0JBQWtCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDakMsZUFBZSxFQUFFLFFBQVEsS0FBSztBQUFBLElBQzlCLGNBQWM7QUFBQSxNQUNaLGNBQWMsQ0FBQztBQUFBLElBQ2pCO0FBQUEsSUFDQSxlQUFlLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDOUIsa0JBQWtCLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDakMsY0FBYyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQzdCLFVBQVU7QUFBQSxNQUNSLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZ0JBQWdCO0FBQUEsTUFDZCxjQUFjLENBQUM7QUFBQSxJQUNqQjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsY0FBYyxzQkFBTztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxtQkFBbUI7QUFBQSxNQUNqQixTQUFTLEVBQUUsTUFBTSxRQUFRO0FBQUEsTUFDekIsY0FBYyw0Q0FBa0I7QUFBQSxNQUNoQyxTQUFTO0FBQUEsUUFDUCxNQUFNLDRDQUFrQjtBQUFBLFFBQ3hCLFFBQVEsNENBQWtCO0FBQUEsUUFDMUIsb0JBQW9CLDRDQUFrQjtBQUFBLFFBQ3RDLHdCQUF3Qiw0Q0FBa0I7QUFBQSxRQUMxQyxjQUFjLDRDQUFrQjtBQUFBLFFBQ2hDLGNBQWMsNENBQWtCO0FBQUEsUUFDaEMsU0FBUyw0Q0FBa0I7QUFBQSxNQUM3QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRO0FBQ3pDLFFBQU0sQ0FBQyxVQUFVLGVBQWUsMkJBQVMsQ0FBQztBQUUxQyxTQUNFLG1EQUFDO0FBQUEsT0FBa0I7QUFBQSxJQUFNO0FBQUEsSUFBb0IsZUFBZTtBQUFBLEdBQWE7QUFFN0UsR0FObUM7QUFRNUIsTUFBTSxVQUFVLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDdkMsUUFBUSxPQUFPO0FBQUEsRUFDYixZQUFZO0FBQUEsRUFDWixXQUFXO0FBQUEsRUFDWCxZQUFZLHNCQUFPO0FBQUEsRUFDbkIsV0FBVyxzQkFBTztBQUFBLEVBQ2xCLG1CQUFtQjtBQUNyQjtBQUVPLE1BQU0sZUFBZSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGFBQWEsT0FBTztBQUFBLEVBQ2xCLFlBQVksc0JBQU87QUFDckI7QUFDQSxhQUFhLFFBQVE7QUFBQSxFQUNuQixNQUFNO0FBQ1I7QUFFTyxNQUFNLGtCQUFrQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQy9DLGdCQUFnQixPQUFPO0FBQUEsRUFDckIsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUNiO0FBQ0EsZ0JBQWdCLFFBQVE7QUFBQSxFQUN0QixNQUFNO0FBQ1I7QUFFTyxNQUFNLDBCQUEwQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELHdCQUF3QixPQUFPO0FBQUEsRUFDN0IsdUJBQXVCO0FBQ3pCO0FBQ0Esd0JBQXdCLFFBQVE7QUFBQSxFQUM5QixNQUFNO0FBQ1I7QUFFTyxNQUFNLHFDQUFxQyxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLG1DQUFtQyxPQUFPO0FBQUEsRUFDeEMsdUJBQXVCO0FBQUEsRUFDdkIsVUFBVSxzQkFBTztBQUNuQjtBQUNBLG1DQUFtQyxRQUFRO0FBQUEsRUFDekMsTUFBTTtBQUNSO0FBRU8sTUFBTSx3QkFBd0IsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNyRCxzQkFBc0IsT0FBTztBQUFBLEVBQzNCLHVCQUF1QjtBQUFBLEVBQ3ZCLG1CQUFtQiw0Q0FBa0I7QUFBQSxFQUNyQyxVQUFVLHNCQUFPO0FBQ25CO0FBQ0Esc0JBQXNCLFFBQVE7QUFBQSxFQUM1QixNQUFNO0FBQ1I7QUFFTyxNQUFNLCtCQUErQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzVELDZCQUE2QixPQUFPO0FBQUEsRUFDbEMsdUJBQXVCO0FBQUEsRUFDdkIsbUJBQW1CLDRDQUFrQjtBQUFBLEVBQ3JDLFVBQVUsc0JBQU87QUFDbkI7QUFDQSw2QkFBNkIsUUFBUTtBQUFBLEVBQ25DLE1BQU07QUFDUjtBQUVPLE1BQU0sbUNBQW1DLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDaEUsaUNBQWlDLE9BQU87QUFBQSxFQUN0Qyx1QkFBdUI7QUFBQSxFQUN2QixtQkFBbUIsNENBQWtCO0FBQUEsRUFDckMsVUFBVSxzQkFBTztBQUNuQjtBQUNBLGlDQUFpQyxRQUFRO0FBQUEsRUFDdkMsTUFBTTtBQUNSO0FBRU8sTUFBTSw4QkFBOEIsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMzRCw0QkFBNEIsT0FBTztBQUFBLEVBQ2pDLHVCQUF1QjtBQUFBLEVBQ3ZCLG1CQUFtQiw0Q0FBa0I7QUFBQSxFQUNyQyxVQUFVLHNCQUFPO0FBQ25CO0FBQ0EsNEJBQTRCLFFBQVE7QUFBQSxFQUNsQyxNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
