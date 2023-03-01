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
var getDefaultConversation_exports = {};
__export(getDefaultConversation_exports, {
  getAvatarPath: () => getAvatarPath,
  getDefaultConversation: () => getDefaultConversation,
  getDefaultConversationWithUuid: () => getDefaultConversationWithUuid,
  getDefaultGroup: () => getDefaultGroup
});
module.exports = __toCommonJS(getDefaultConversation_exports);
var import_casual = __toESM(require("casual"));
var import_lodash = require("lodash");
var import_UUID = require("../../types/UUID");
var import_getRandomColor = require("./getRandomColor");
var import_Colors = require("../../types/Colors");
const getAvatarPath = /* @__PURE__ */ __name(() => (0, import_lodash.sample)([
  "/fixtures/kitten-1-64-64.jpg",
  "/fixtures/kitten-2-64-64.jpg",
  "/fixtures/kitten-3-64-64.jpg"
]) || "", "getAvatarPath");
function getDefaultConversation(overrideProps = {}) {
  const firstName = import_casual.default.first_name;
  const lastName = import_casual.default.last_name;
  return {
    acceptedMessageRequest: true,
    avatarPath: getAvatarPath(),
    badges: [],
    e164: `+${import_casual.default.phone.replace(/-/g, "")}`,
    conversationColor: import_Colors.ConversationColors[0],
    color: (0, import_getRandomColor.getRandomColor)(),
    firstName,
    id: import_UUID.UUID.generate().toString(),
    isMe: false,
    lastUpdated: import_casual.default.unix_time,
    markedUnread: Boolean(overrideProps.markedUnread),
    sharedGroupNames: [],
    title: `${firstName} ${lastName}`,
    type: "direct",
    uuid: import_UUID.UUID.generate().toString(),
    ...overrideProps
  };
}
function getDefaultGroup(overrideProps = {}) {
  const memberships = Array.from(Array(import_casual.default.integer(1, 20)), () => ({
    uuid: import_UUID.UUID.generate().toString(),
    isAdmin: Boolean(import_casual.default.coin_flip)
  }));
  return {
    acceptedMessageRequest: true,
    announcementsOnly: false,
    avatarPath: getAvatarPath(),
    badges: [],
    color: (0, import_getRandomColor.getRandomColor)(),
    conversationColor: import_Colors.ConversationColors[0],
    groupDescription: import_casual.default.sentence,
    groupId: import_UUID.UUID.generate().toString(),
    groupLink: import_casual.default.url,
    groupVersion: 2,
    id: import_UUID.UUID.generate().toString(),
    isMe: false,
    lastUpdated: import_casual.default.unix_time,
    markedUnread: Boolean(overrideProps.markedUnread),
    membersCount: memberships.length,
    memberships,
    sharedGroupNames: [],
    title: import_casual.default.title,
    type: "group",
    uuid: import_UUID.UUID.generate().toString(),
    ...overrideProps
  };
}
function getDefaultConversationWithUuid(overrideProps = {}, uuid = import_UUID.UUID.generate().toString()) {
  return {
    ...getDefaultConversation(overrideProps),
    uuid
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAvatarPath,
  getDefaultConversation,
  getDefaultConversationWithUuid,
  getDefaultGroup
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0RGVmYXVsdENvbnZlcnNhdGlvbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBjYXN1YWwgZnJvbSAnY2FzdWFsJztcbmltcG9ydCB7IHNhbXBsZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi9nZXRSYW5kb21Db2xvcic7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25Db2xvcnMgfSBmcm9tICcuLi8uLi90eXBlcy9Db2xvcnMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QXZhdGFyUGF0aCA9ICgpOiBzdHJpbmcgPT5cbiAgc2FtcGxlKFtcbiAgICAnL2ZpeHR1cmVzL2tpdHRlbi0xLTY0LTY0LmpwZycsXG4gICAgJy9maXh0dXJlcy9raXR0ZW4tMi02NC02NC5qcGcnLFxuICAgICcvZml4dHVyZXMva2l0dGVuLTMtNjQtNjQuanBnJyxcbiAgXSkgfHwgJyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKFxuICBvdmVycmlkZVByb3BzOiBQYXJ0aWFsPENvbnZlcnNhdGlvblR5cGU+ID0ge31cbik6IENvbnZlcnNhdGlvblR5cGUge1xuICBjb25zdCBmaXJzdE5hbWUgPSBjYXN1YWwuZmlyc3RfbmFtZTtcbiAgY29uc3QgbGFzdE5hbWUgPSBjYXN1YWwubGFzdF9uYW1lO1xuXG4gIHJldHVybiB7XG4gICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogdHJ1ZSxcbiAgICBhdmF0YXJQYXRoOiBnZXRBdmF0YXJQYXRoKCksXG4gICAgYmFkZ2VzOiBbXSxcbiAgICBlMTY0OiBgKyR7Y2FzdWFsLnBob25lLnJlcGxhY2UoLy0vZywgJycpfWAsXG4gICAgY29udmVyc2F0aW9uQ29sb3I6IENvbnZlcnNhdGlvbkNvbG9yc1swXSxcbiAgICBjb2xvcjogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICBmaXJzdE5hbWUsXG4gICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIGlzTWU6IGZhbHNlLFxuICAgIGxhc3RVcGRhdGVkOiBjYXN1YWwudW5peF90aW1lLFxuICAgIG1hcmtlZFVucmVhZDogQm9vbGVhbihvdmVycmlkZVByb3BzLm1hcmtlZFVucmVhZCksXG4gICAgc2hhcmVkR3JvdXBOYW1lczogW10sXG4gICAgdGl0bGU6IGAke2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gLFxuICAgIHR5cGU6ICdkaXJlY3QnIGFzIGNvbnN0LFxuICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIC4uLm92ZXJyaWRlUHJvcHMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0R3JvdXAoXG4gIG92ZXJyaWRlUHJvcHM6IFBhcnRpYWw8Q29udmVyc2F0aW9uVHlwZT4gPSB7fVxuKTogQ29udmVyc2F0aW9uVHlwZSB7XG4gIGNvbnN0IG1lbWJlcnNoaXBzID0gQXJyYXkuZnJvbShBcnJheShjYXN1YWwuaW50ZWdlcigxLCAyMCkpLCAoKSA9PiAoe1xuICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIGlzQWRtaW46IEJvb2xlYW4oY2FzdWFsLmNvaW5fZmxpcCksXG4gIH0pKTtcblxuICByZXR1cm4ge1xuICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgYW5ub3VuY2VtZW50c09ubHk6IGZhbHNlLFxuICAgIGF2YXRhclBhdGg6IGdldEF2YXRhclBhdGgoKSxcbiAgICBiYWRnZXM6IFtdLFxuICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgIGNvbnZlcnNhdGlvbkNvbG9yOiBDb252ZXJzYXRpb25Db2xvcnNbMF0sXG4gICAgZ3JvdXBEZXNjcmlwdGlvbjogY2FzdWFsLnNlbnRlbmNlLFxuICAgIGdyb3VwSWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIGdyb3VwTGluazogY2FzdWFsLnVybCxcbiAgICBncm91cFZlcnNpb246IDIsXG4gICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIGlzTWU6IGZhbHNlLFxuICAgIGxhc3RVcGRhdGVkOiBjYXN1YWwudW5peF90aW1lLFxuICAgIG1hcmtlZFVucmVhZDogQm9vbGVhbihvdmVycmlkZVByb3BzLm1hcmtlZFVucmVhZCksXG4gICAgbWVtYmVyc0NvdW50OiBtZW1iZXJzaGlwcy5sZW5ndGgsXG4gICAgbWVtYmVyc2hpcHMsXG4gICAgc2hhcmVkR3JvdXBOYW1lczogW10sXG4gICAgdGl0bGU6IGNhc3VhbC50aXRsZSxcbiAgICB0eXBlOiAnZ3JvdXAnIGFzIGNvbnN0LFxuICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgIC4uLm92ZXJyaWRlUHJvcHMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0Q29udmVyc2F0aW9uV2l0aFV1aWQoXG4gIG92ZXJyaWRlUHJvcHM6IFBhcnRpYWw8Q29udmVyc2F0aW9uVHlwZT4gPSB7fSxcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGUgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKVxuKTogQ29udmVyc2F0aW9uVHlwZSAmIHsgdXVpZDogVVVJRFN0cmluZ1R5cGUgfSB7XG4gIHJldHVybiB7XG4gICAgLi4uZ2V0RGVmYXVsdENvbnZlcnNhdGlvbihvdmVycmlkZVByb3BzKSxcbiAgICB1dWlkLFxuICB9O1xu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
