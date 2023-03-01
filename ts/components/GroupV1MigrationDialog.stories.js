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
var GroupV1MigrationDialog_stories_exports = {};
__export(GroupV1MigrationDialog_stories_exports, {
  MigratedBasic: () => MigratedBasic,
  MigratedYouAreInvited: () => MigratedYouAreInvited,
  NotYetMigratedBasic: () => NotYetMigratedBasic,
  NotYetMigratedJustDroppedMember: () => NotYetMigratedJustDroppedMember,
  NotYetMigratedMultipleDroppedAndInvitedMembers: () => NotYetMigratedMultipleDroppedAndInvitedMembers,
  NotYetMigratedNoMembers: () => NotYetMigratedNoMembers,
  default: () => GroupV1MigrationDialog_stories_default
});
module.exports = __toCommonJS(GroupV1MigrationDialog_stories_exports);
var React = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_GroupV1MigrationDialog = require("./GroupV1MigrationDialog");
var import_setupI18n = require("../util/setupI18n");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_Util = require("../types/Util");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const contact1 = (0, import_getDefaultConversation.getDefaultConversation)({
  title: "Alice",
  phoneNumber: "+1 (300) 555-0000",
  id: "guid-1"
});
const contact2 = (0, import_getDefaultConversation.getDefaultConversation)({
  title: "Bob",
  phoneNumber: "+1 (300) 555-0001",
  id: "guid-2"
});
const contact3 = (0, import_getDefaultConversation.getDefaultConversation)({
  title: "Chet",
  phoneNumber: "+1 (300) 555-0002",
  id: "guid-3"
});
const createProps = /* @__PURE__ */ __name((overrideProps = {}) => ({
  areWeInvited: Boolean(overrideProps.areWeInvited),
  droppedMembers: overrideProps.droppedMembers || [contact3, contact1],
  getPreferredBadge: () => void 0,
  hasMigrated: Boolean(overrideProps.hasMigrated),
  i18n,
  invitedMembers: overrideProps.invitedMembers || [contact2],
  migrate: (0, import_addon_actions.action)("migrate"),
  onClose: (0, import_addon_actions.action)("onClose"),
  theme: import_Util.ThemeType.light
}), "createProps");
var GroupV1MigrationDialog_stories_default = {
  title: "Components/GroupV1MigrationDialog"
};
const NotYetMigratedBasic = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps()
  });
}, "NotYetMigratedBasic");
NotYetMigratedBasic.story = {
  name: "Not yet migrated, basic"
};
const MigratedBasic = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps({
      hasMigrated: true
    })
  });
}, "MigratedBasic");
MigratedBasic.story = {
  name: "Migrated, basic"
};
const MigratedYouAreInvited = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps({
      hasMigrated: true,
      areWeInvited: true
    })
  });
}, "MigratedYouAreInvited");
MigratedYouAreInvited.story = {
  name: "Migrated, you are invited"
};
const NotYetMigratedMultipleDroppedAndInvitedMembers = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps({
      droppedMembers: [contact3, contact1, contact2],
      invitedMembers: [contact2, contact3, contact1]
    })
  });
}, "NotYetMigratedMultipleDroppedAndInvitedMembers");
NotYetMigratedMultipleDroppedAndInvitedMembers.story = {
  name: "Not yet migrated, multiple dropped and invited members"
};
const NotYetMigratedNoMembers = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps({
      droppedMembers: [],
      invitedMembers: []
    })
  });
}, "NotYetMigratedNoMembers");
NotYetMigratedNoMembers.story = {
  name: "Not yet migrated, no members"
};
const NotYetMigratedJustDroppedMember = /* @__PURE__ */ __name(() => {
  return /* @__PURE__ */ React.createElement(import_GroupV1MigrationDialog.GroupV1MigrationDialog, {
    ...createProps({
      invitedMembers: []
    })
  });
}, "NotYetMigratedJustDroppedMember");
NotYetMigratedJustDroppedMember.story = {
  name: "Not yet migrated, just dropped member"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MigratedBasic,
  MigratedYouAreInvited,
  NotYetMigratedBasic,
  NotYetMigratedJustDroppedMember,
  NotYetMigratedMultipleDroppedAndInvitedMembers,
  NotYetMigratedNoMembers
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiR3JvdXBWMU1pZ3JhdGlvbkRpYWxvZy5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgYWN0aW9uIH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1hY3Rpb25zJztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL0dyb3VwVjFNaWdyYXRpb25EaWFsb2cnO1xuaW1wb3J0IHsgR3JvdXBWMU1pZ3JhdGlvbkRpYWxvZyB9IGZyb20gJy4vR3JvdXBWMU1pZ3JhdGlvbkRpYWxvZyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgVGhlbWVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmNvbnN0IGNvbnRhY3QxOiBDb252ZXJzYXRpb25UeXBlID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gIHRpdGxlOiAnQWxpY2UnLFxuICBwaG9uZU51bWJlcjogJysxICgzMDApIDU1NS0wMDAwJyxcbiAgaWQ6ICdndWlkLTEnLFxufSk7XG5cbmNvbnN0IGNvbnRhY3QyOiBDb252ZXJzYXRpb25UeXBlID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gIHRpdGxlOiAnQm9iJyxcbiAgcGhvbmVOdW1iZXI6ICcrMSAoMzAwKSA1NTUtMDAwMScsXG4gIGlkOiAnZ3VpZC0yJyxcbn0pO1xuXG5jb25zdCBjb250YWN0MzogQ29udmVyc2F0aW9uVHlwZSA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICB0aXRsZTogJ0NoZXQnLFxuICBwaG9uZU51bWJlcjogJysxICgzMDApIDU1NS0wMDAyJyxcbiAgaWQ6ICdndWlkLTMnLFxufSk7XG5cbmNvbnN0IGNyZWF0ZVByb3BzID0gKG92ZXJyaWRlUHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHt9KTogUHJvcHNUeXBlID0+ICh7XG4gIGFyZVdlSW52aXRlZDogQm9vbGVhbihvdmVycmlkZVByb3BzLmFyZVdlSW52aXRlZCksXG4gIGRyb3BwZWRNZW1iZXJzOiBvdmVycmlkZVByb3BzLmRyb3BwZWRNZW1iZXJzIHx8IFtjb250YWN0MywgY29udGFjdDFdLFxuICBnZXRQcmVmZXJyZWRCYWRnZTogKCkgPT4gdW5kZWZpbmVkLFxuICBoYXNNaWdyYXRlZDogQm9vbGVhbihvdmVycmlkZVByb3BzLmhhc01pZ3JhdGVkKSxcbiAgaTE4bixcbiAgaW52aXRlZE1lbWJlcnM6IG92ZXJyaWRlUHJvcHMuaW52aXRlZE1lbWJlcnMgfHwgW2NvbnRhY3QyXSxcbiAgbWlncmF0ZTogYWN0aW9uKCdtaWdyYXRlJyksXG4gIG9uQ2xvc2U6IGFjdGlvbignb25DbG9zZScpLFxuICB0aGVtZTogVGhlbWVUeXBlLmxpZ2h0LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL0dyb3VwVjFNaWdyYXRpb25EaWFsb2cnLFxufTtcblxuZXhwb3J0IGNvbnN0IE5vdFlldE1pZ3JhdGVkQmFzaWMgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICByZXR1cm4gPEdyb3VwVjFNaWdyYXRpb25EaWFsb2cgey4uLmNyZWF0ZVByb3BzKCl9IC8+O1xufTtcblxuTm90WWV0TWlncmF0ZWRCYXNpYy5zdG9yeSA9IHtcbiAgbmFtZTogJ05vdCB5ZXQgbWlncmF0ZWQsIGJhc2ljJyxcbn07XG5cbmV4cG9ydCBjb25zdCBNaWdyYXRlZEJhc2ljID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgcmV0dXJuIChcbiAgICA8R3JvdXBWMU1pZ3JhdGlvbkRpYWxvZ1xuICAgICAgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgaGFzTWlncmF0ZWQ6IHRydWUsXG4gICAgICB9KX1cbiAgICAvPlxuICApO1xufTtcblxuTWlncmF0ZWRCYXNpYy5zdG9yeSA9IHtcbiAgbmFtZTogJ01pZ3JhdGVkLCBiYXNpYycsXG59O1xuXG5leHBvcnQgY29uc3QgTWlncmF0ZWRZb3VBcmVJbnZpdGVkID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgcmV0dXJuIChcbiAgICA8R3JvdXBWMU1pZ3JhdGlvbkRpYWxvZ1xuICAgICAgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgaGFzTWlncmF0ZWQ6IHRydWUsXG4gICAgICAgIGFyZVdlSW52aXRlZDogdHJ1ZSxcbiAgICAgIH0pfVxuICAgIC8+XG4gICk7XG59O1xuXG5NaWdyYXRlZFlvdUFyZUludml0ZWQuc3RvcnkgPSB7XG4gIG5hbWU6ICdNaWdyYXRlZCwgeW91IGFyZSBpbnZpdGVkJyxcbn07XG5cbmV4cG9ydCBjb25zdCBOb3RZZXRNaWdyYXRlZE11bHRpcGxlRHJvcHBlZEFuZEludml0ZWRNZW1iZXJzID1cbiAgKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdyb3VwVjFNaWdyYXRpb25EaWFsb2dcbiAgICAgICAgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgICBkcm9wcGVkTWVtYmVyczogW2NvbnRhY3QzLCBjb250YWN0MSwgY29udGFjdDJdLFxuICAgICAgICAgIGludml0ZWRNZW1iZXJzOiBbY29udGFjdDIsIGNvbnRhY3QzLCBjb250YWN0MV0sXG4gICAgICAgIH0pfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG5Ob3RZZXRNaWdyYXRlZE11bHRpcGxlRHJvcHBlZEFuZEludml0ZWRNZW1iZXJzLnN0b3J5ID0ge1xuICBuYW1lOiAnTm90IHlldCBtaWdyYXRlZCwgbXVsdGlwbGUgZHJvcHBlZCBhbmQgaW52aXRlZCBtZW1iZXJzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBOb3RZZXRNaWdyYXRlZE5vTWVtYmVycyA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIHJldHVybiAoXG4gICAgPEdyb3VwVjFNaWdyYXRpb25EaWFsb2dcbiAgICAgIHsuLi5jcmVhdGVQcm9wcyh7XG4gICAgICAgIGRyb3BwZWRNZW1iZXJzOiBbXSxcbiAgICAgICAgaW52aXRlZE1lbWJlcnM6IFtdLFxuICAgICAgfSl9XG4gICAgLz5cbiAgKTtcbn07XG5cbk5vdFlldE1pZ3JhdGVkTm9NZW1iZXJzLnN0b3J5ID0ge1xuICBuYW1lOiAnTm90IHlldCBtaWdyYXRlZCwgbm8gbWVtYmVycycsXG59O1xuXG5leHBvcnQgY29uc3QgTm90WWV0TWlncmF0ZWRKdXN0RHJvcHBlZE1lbWJlciA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIHJldHVybiAoXG4gICAgPEdyb3VwVjFNaWdyYXRpb25EaWFsb2dcbiAgICAgIHsuLi5jcmVhdGVQcm9wcyh7XG4gICAgICAgIGludml0ZWRNZW1iZXJzOiBbXSxcbiAgICAgIH0pfVxuICAgIC8+XG4gICk7XG59O1xuXG5Ob3RZZXRNaWdyYXRlZEp1c3REcm9wcGVkTWVtYmVyLnN0b3J5ID0ge1xuICBuYW1lOiAnTm90IHlldCBtaWdyYXRlZCwganVzdCBkcm9wcGVkIG1lbWJlcicsXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLFlBQXVCO0FBRXZCLDJCQUF1QjtBQUd2QixvQ0FBdUM7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
