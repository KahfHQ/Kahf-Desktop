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
var StoryViewsNRepliesModal_stories_exports = {};
__export(StoryViewsNRepliesModal_stories_exports, {
  CanReply: () => CanReply,
  CantReply: () => CantReply,
  InAGroup: () => InAGroup,
  InAGroupCantReply: () => InAGroupCantReply,
  InAGroupNoReplies: () => InAGroupNoReplies,
  ViewsOnly: () => ViewsOnly,
  default: () => StoryViewsNRepliesModal_stories_default
});
module.exports = __toCommonJS(StoryViewsNRepliesModal_stories_exports);
var import_react = __toESM(require("react"));
var durations = __toESM(require("../util/durations"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_MIME = require("../types/MIME");
var import_MessageSendState = require("../messages/MessageSendState");
var import_StoryViewsNRepliesModal = require("./StoryViewsNRepliesModal");
var import_UUID = require("../types/UUID");
var import_fakeAttachment = require("../test-both/helpers/fakeAttachment");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoryViewsNRepliesModal_stories_default = {
  title: "Components/StoryViewsNRepliesModal",
  component: import_StoryViewsNRepliesModal.StoryViewsNRepliesModal,
  argTypes: {
    authorTitle: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)().title
    },
    canReply: {
      defaultValue: true
    },
    getPreferredBadge: { action: true },
    i18n: {
      defaultValue: i18n
    },
    isMyStory: {
      defaultValue: false
    },
    onClose: { action: true },
    onSetSkinTone: { action: true },
    onReact: { action: true },
    onReply: { action: true },
    onTextTooLong: { action: true },
    onUseEmoji: { action: true },
    preferredReactionEmoji: {
      defaultValue: ["\u2764\uFE0F", "\u{1F44D}", "\u{1F44E}", "\u{1F602}", "\u{1F62E}", "\u{1F622}"]
    },
    renderEmojiPicker: { action: true },
    replies: {
      defaultValue: []
    },
    storyPreviewAttachment: {
      defaultValue: (0, import_fakeAttachment.fakeAttachment)({
        thumbnail: {
          contentType: import_MIME.IMAGE_JPEG,
          height: 64,
          objectUrl: "/fixtures/nathan-anderson-316188-unsplash.jpg",
          path: "",
          width: 40
        }
      })
    },
    views: {
      defaultValue: []
    }
  }
};
function getViewsAndReplies() {
  const p1 = (0, import_getDefaultConversation.getDefaultConversation)();
  const p2 = (0, import_getDefaultConversation.getDefaultConversation)();
  const p3 = (0, import_getDefaultConversation.getDefaultConversation)();
  const p4 = (0, import_getDefaultConversation.getDefaultConversation)();
  const p5 = (0, import_getDefaultConversation.getDefaultConversation)();
  const p6 = (0, import_getDefaultConversation.getDefaultConversation)({
    isMe: true
  });
  const views = [
    {
      recipient: p1,
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: Date.now() - 20 * durations.MINUTE
    },
    {
      recipient: p2,
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: Date.now() - 25 * durations.MINUTE
    },
    {
      recipient: p3,
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: Date.now() - 15 * durations.MINUTE
    },
    {
      recipient: p4,
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: Date.now() - 5 * durations.MINUTE
    },
    {
      recipient: p5,
      status: import_MessageSendState.SendStatus.Viewed,
      updatedAt: Date.now() - 30 * durations.MINUTE
    }
  ];
  const replies = [
    {
      author: p2,
      body: "So cute \u2764\uFE0F",
      conversationId: p2.id,
      id: import_UUID.UUID.generate().toString(),
      timestamp: Date.now() - 24 * durations.MINUTE
    },
    {
      author: p3,
      body: "That's awesome",
      conversationId: p3.id,
      id: import_UUID.UUID.generate().toString(),
      timestamp: Date.now() - 13 * durations.MINUTE
    },
    {
      author: p3,
      body: "Very awesome",
      conversationId: p3.id,
      id: import_UUID.UUID.generate().toString(),
      timestamp: Date.now() - 13 * durations.MINUTE
    },
    {
      author: p3,
      body: "Did I mention how awesome this is?",
      conversationId: p3.id,
      id: import_UUID.UUID.generate().toString(),
      timestamp: Date.now() - 12 * durations.MINUTE
    },
    {
      author: p4,
      conversationId: p4.id,
      id: import_UUID.UUID.generate().toString(),
      reactionEmoji: "\u2764\uFE0F",
      timestamp: Date.now() - 5 * durations.MINUTE
    },
    {
      author: p6,
      body: "Thanks everyone!",
      conversationId: p6.id,
      id: import_UUID.UUID.generate().toString(),
      sendStateByConversationId: {
        [p1.id]: {
          status: import_MessageSendState.SendStatus.Pending
        }
      },
      timestamp: Date.now()
    }
  ];
  return {
    views,
    replies
  };
}
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoryViewsNRepliesModal.StoryViewsNRepliesModal, {
  ...args
}), "Template");
const CanReply = Template.bind({});
CanReply.args = {};
CanReply.storyName = "Can reply";
const ViewsOnly = Template.bind({});
ViewsOnly.args = {
  isMyStory: true,
  views: getViewsAndReplies().views
};
ViewsOnly.storyName = "Views only";
const InAGroupNoReplies = Template.bind({});
InAGroupNoReplies.args = {
  isGroupStory: true
};
InAGroupNoReplies.storyName = "In a group (no replies)";
const InAGroup = Template.bind({});
{
  const { views, replies } = getViewsAndReplies();
  InAGroup.args = {
    isGroupStory: true,
    replies,
    views
  };
}
InAGroup.storyName = "In a group";
const CantReply = Template.bind({});
CantReply.args = {
  canReply: false
};
const InAGroupCantReply = Template.bind({});
{
  const { views, replies } = getViewsAndReplies();
  InAGroupCantReply.args = {
    canReply: false,
    isGroupStory: true,
    replies,
    views
  };
}
InAGroupCantReply.storyName = "In a group (can't reply)";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CanReply,
  CantReply,
  InAGroup,
  InAGroupCantReply,
  InAGroupNoReplies,
  ViewsOnly
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL1N0b3J5Vmlld3NOUmVwbGllc01vZGFsJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcbmltcG9ydCB7IElNQUdFX0pQRUcgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IFNlbmRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCB7IFN0b3J5Vmlld3NOUmVwbGllc01vZGFsIH0gZnJvbSAnLi9TdG9yeVZpZXdzTlJlcGxpZXNNb2RhbCc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBmYWtlQXR0YWNobWVudCB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2Zha2VBdHRhY2htZW50JztcbmltcG9ydCB7IGdldERlZmF1bHRDb252ZXJzYXRpb24gfSBmcm9tICcuLi90ZXN0LWJvdGgvaGVscGVycy9nZXREZWZhdWx0Q29udmVyc2F0aW9uJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvU3RvcnlWaWV3c05SZXBsaWVzTW9kYWwnLFxuICBjb21wb25lbnQ6IFN0b3J5Vmlld3NOUmVwbGllc01vZGFsLFxuICBhcmdUeXBlczoge1xuICAgIGF1dGhvclRpdGxlOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKS50aXRsZSxcbiAgICB9LFxuICAgIGNhblJlcGx5OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgfSxcbiAgICBnZXRQcmVmZXJyZWRCYWRnZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBpc015U3Rvcnk6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgfSxcbiAgICBvbkNsb3NlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uU2V0U2tpblRvbmU6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25SZWFjdDogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblJlcGx5OiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uVGV4dFRvb0xvbmc6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25Vc2VFbW9qaTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFsnXHUyNzY0XHVGRTBGJywgJ1x1RDgzRFx1REM0RCcsICdcdUQ4M0RcdURDNEUnLCAnXHVEODNEXHVERTAyJywgJ1x1RDgzRFx1REUyRScsICdcdUQ4M0RcdURFMjInXSxcbiAgICB9LFxuICAgIHJlbmRlckVtb2ppUGlja2VyOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHJlcGxpZXM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW10sXG4gICAgfSxcbiAgICBzdG9yeVByZXZpZXdBdHRhY2htZW50OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGZha2VBdHRhY2htZW50KHtcbiAgICAgICAgdGh1bWJuYWlsOiB7XG4gICAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgICAgaGVpZ2h0OiA2NCxcbiAgICAgICAgICBvYmplY3RVcmw6ICcvZml4dHVyZXMvbmF0aGFuLWFuZGVyc29uLTMxNjE4OC11bnNwbGFzaC5qcGcnLFxuICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gICAgdmlld3M6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogW10sXG4gICAgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuZnVuY3Rpb24gZ2V0Vmlld3NBbmRSZXBsaWVzKCkge1xuICBjb25zdCBwMSA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oKTtcbiAgY29uc3QgcDIgPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG4gIGNvbnN0IHAzID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpO1xuICBjb25zdCBwNCA9IGdldERlZmF1bHRDb252ZXJzYXRpb24oKTtcbiAgY29uc3QgcDUgPSBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCk7XG4gIGNvbnN0IHA2ID0gZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgaXNNZTogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3Qgdmlld3MgPSBbXG4gICAge1xuICAgICAgcmVjaXBpZW50OiBwMSxcbiAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCkgLSAyMCAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSxcbiAgICB7XG4gICAgICByZWNpcGllbnQ6IHAyLFxuICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlZpZXdlZCxcbiAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSAtIDI1ICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogcDMsXG4gICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuVmlld2VkLFxuICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpIC0gMTUgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0sXG4gICAge1xuICAgICAgcmVjaXBpZW50OiBwNCxcbiAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCkgLSA1ICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJlY2lwaWVudDogcDUsXG4gICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuVmlld2VkLFxuICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpIC0gMzAgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0sXG4gIF07XG5cbiAgY29uc3QgcmVwbGllcyA9IFtcbiAgICB7XG4gICAgICBhdXRob3I6IHAyLFxuICAgICAgYm9keTogJ1NvIGN1dGUgXHUyNzY0XHVGRTBGJyxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBwMi5pZCxcbiAgICAgIGlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDI0ICogZHVyYXRpb25zLk1JTlVURSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGF1dGhvcjogcDMsXG4gICAgICBib2R5OiBcIlRoYXQncyBhd2Vzb21lXCIsXG4gICAgICBjb252ZXJzYXRpb25JZDogcDMuaWQsXG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxMyAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSxcbiAgICB7XG4gICAgICBhdXRob3I6IHAzLFxuICAgICAgYm9keTogJ1ZlcnkgYXdlc29tZScsXG4gICAgICBjb252ZXJzYXRpb25JZDogcDMuaWQsXG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxMyAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSxcbiAgICB7XG4gICAgICBhdXRob3I6IHAzLFxuICAgICAgYm9keTogJ0RpZCBJIG1lbnRpb24gaG93IGF3ZXNvbWUgdGhpcyBpcz8nLFxuICAgICAgY29udmVyc2F0aW9uSWQ6IHAzLmlkLFxuICAgICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMTIgKiBkdXJhdGlvbnMuTUlOVVRFLFxuICAgIH0sXG4gICAge1xuICAgICAgYXV0aG9yOiBwNCxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBwNC5pZCxcbiAgICAgIGlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHJlYWN0aW9uRW1vamk6ICdcdTI3NjRcdUZFMEYnLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNSAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gICAgfSxcbiAgICB7XG4gICAgICBhdXRob3I6IHA2LFxuICAgICAgYm9keTogJ1RoYW5rcyBldmVyeW9uZSEnLFxuICAgICAgY29udmVyc2F0aW9uSWQ6IHA2LmlkLFxuICAgICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICBbcDEuaWRdOiB7XG4gICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICB2aWV3cyxcbiAgICByZXBsaWVzLFxuICB9O1xufVxuXG5jb25zdCBUZW1wbGF0ZTogU3Rvcnk8UHJvcHNUeXBlPiA9IGFyZ3MgPT4gKFxuICA8U3RvcnlWaWV3c05SZXBsaWVzTW9kYWwgey4uLmFyZ3N9IC8+XG4pO1xuXG5leHBvcnQgY29uc3QgQ2FuUmVwbHkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkNhblJlcGx5LmFyZ3MgPSB7fTtcbkNhblJlcGx5LnN0b3J5TmFtZSA9ICdDYW4gcmVwbHknO1xuXG5leHBvcnQgY29uc3QgVmlld3NPbmx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5WaWV3c09ubHkuYXJncyA9IHtcbiAgaXNNeVN0b3J5OiB0cnVlLFxuICB2aWV3czogZ2V0Vmlld3NBbmRSZXBsaWVzKCkudmlld3MsXG59O1xuVmlld3NPbmx5LnN0b3J5TmFtZSA9ICdWaWV3cyBvbmx5JztcblxuZXhwb3J0IGNvbnN0IEluQUdyb3VwTm9SZXBsaWVzID0gVGVtcGxhdGUuYmluZCh7fSk7XG5JbkFHcm91cE5vUmVwbGllcy5hcmdzID0ge1xuICBpc0dyb3VwU3Rvcnk6IHRydWUsXG59O1xuSW5BR3JvdXBOb1JlcGxpZXMuc3RvcnlOYW1lID0gJ0luIGEgZ3JvdXAgKG5vIHJlcGxpZXMpJztcblxuZXhwb3J0IGNvbnN0IEluQUdyb3VwID0gVGVtcGxhdGUuYmluZCh7fSk7XG57XG4gIGNvbnN0IHsgdmlld3MsIHJlcGxpZXMgfSA9IGdldFZpZXdzQW5kUmVwbGllcygpO1xuICBJbkFHcm91cC5hcmdzID0ge1xuICAgIGlzR3JvdXBTdG9yeTogdHJ1ZSxcbiAgICByZXBsaWVzLFxuICAgIHZpZXdzLFxuICB9O1xufVxuSW5BR3JvdXAuc3RvcnlOYW1lID0gJ0luIGEgZ3JvdXAnO1xuXG5leHBvcnQgY29uc3QgQ2FudFJlcGx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5DYW50UmVwbHkuYXJncyA9IHtcbiAgY2FuUmVwbHk6IGZhbHNlLFxufTtcblxuZXhwb3J0IGNvbnN0IEluQUdyb3VwQ2FudFJlcGx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG57XG4gIGNvbnN0IHsgdmlld3MsIHJlcGxpZXMgfSA9IGdldFZpZXdzQW5kUmVwbGllcygpO1xuICBJbkFHcm91cENhbnRSZXBseS5hcmdzID0ge1xuICAgIGNhblJlcGx5OiBmYWxzZSxcbiAgICBpc0dyb3VwU3Rvcnk6IHRydWUsXG4gICAgcmVwbGllcyxcbiAgICB2aWV3cyxcbiAgfTtcbn1cbkluQUdyb3VwQ2FudFJlcGx5LnN0b3J5TmFtZSA9IFwiSW4gYSBncm91cCAoY2FuJ3QgcmVwbHkpXCI7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBR2xCLGdCQUEyQjtBQUMzQixzQkFBdUI7QUFDdkIsa0JBQTJCO0FBQzNCLDhCQUEyQjtBQUMzQixxQ0FBd0M7QUFDeEMsa0JBQXFCO0FBQ3JCLDRCQUErQjtBQUMvQixvQ0FBdUM7QUFDdkMsdUJBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sMENBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxNQUNYLGNBQWMsMERBQXVCLEVBQUU7QUFBQSxJQUN6QztBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxtQkFBbUIsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNsQyxNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFdBQVc7QUFBQSxNQUNULGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsU0FBUyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3hCLGVBQWUsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUM5QixTQUFTLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDeEIsU0FBUyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3hCLGVBQWUsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUM5QixZQUFZLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDM0Isd0JBQXdCO0FBQUEsTUFDdEIsY0FBYyxDQUFDLGdCQUFNLGFBQU0sYUFBTSxhQUFNLGFBQU0sV0FBSTtB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
