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
var StoryViewer_stories_exports = {};
__export(StoryViewer_stories_exports, {
  Caption: () => Caption,
  InAGroup: () => InAGroup,
  LongCaption: () => LongCaption,
  MultiStory: () => MultiStory,
  SomeonesStory: () => SomeonesStory,
  WideStory: () => WideStory,
  YourStory: () => YourStory,
  default: () => StoryViewer_stories_default
});
module.exports = __toCommonJS(StoryViewer_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_MessageSendState = require("../messages/MessageSendState");
var import_StoryViewer = require("./StoryViewer");
var import_MIME = require("../types/MIME");
var import_fakeAttachment = require("../test-both/helpers/fakeAttachment");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_getFakeStory = require("../test-both/helpers/getFakeStory");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoryViewer_stories_default = {
  title: "Components/StoryViewer",
  component: import_StoryViewer.StoryViewer,
  argTypes: {
    currentIndex: {
      defaultvalue: 0
    },
    getPreferredBadge: { action: true },
    group: {
      defaultValue: void 0
    },
    hasAllStoriesMuted: {
      defaultValue: false
    },
    i18n: {
      defaultValue: i18n
    },
    loadStoryReplies: { action: true },
    markStoryRead: { action: true },
    numStories: {
      defaultValue: 1
    },
    onGoToConversation: { action: true },
    onHideStory: { action: true },
    onReactToStory: { action: true },
    onReplyToStory: { action: true },
    onSetSkinTone: { action: true },
    onTextTooLong: { action: true },
    onUseEmoji: { action: true },
    preferredReactionEmoji: {
      defaultValue: ["\u2764\uFE0F", "\u{1F44D}", "\u{1F44E}", "\u{1F602}", "\u{1F62E}", "\u{1F622}"]
    },
    queueStoryDownload: { action: true },
    renderEmojiPicker: { action: true },
    showToast: { action: true },
    skinTone: {
      defaultValue: 0
    },
    story: {
      defaultValue: (0, import_getFakeStory.getFakeStoryView)()
    },
    toggleHasAllStoriesMuted: { action: true },
    viewStory: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoryViewer.StoryViewer, {
  ...args
}), "Template");
const SomeonesStory = Template.bind({});
SomeonesStory.args = {};
SomeonesStory.story = {
  name: "Someone's story"
};
const WideStory = Template.bind({});
WideStory.args = {
  story: (0, import_getFakeStory.getFakeStoryView)("/fixtures/nathan-anderson-316188-unsplash.jpg")
};
WideStory.story = {
  name: "Wide story"
};
const InAGroup = Template.bind({});
InAGroup.args = {
  group: (0, import_getDefaultConversation.getDefaultConversation)({
    avatarPath: "/fixtures/kitten-4-112-112.jpg",
    title: "Family Group",
    type: "group"
  })
};
InAGroup.story = {
  name: "In a group"
};
const MultiStory = Template.bind({});
MultiStory.args = {
  currentIndex: 2,
  numStories: 7,
  story: {
    ...(0, import_getFakeStory.getFakeStoryView)(),
    attachment: (0, import_fakeAttachment.fakeAttachment)({
      contentType: import_MIME.VIDEO_MP4,
      fileName: "pixabay-Soap-Bubble-7141.mp4",
      url: "/fixtures/kitten-4-112-112.jpg",
      screenshotPath: "/fixtures/kitten-4-112-112.jpg"
    })
  }
};
MultiStory.story = {
  name: "Multi story"
};
const Caption = Template.bind({});
Caption.args = {
  story: {
    ...(0, import_getFakeStory.getFakeStoryView)(),
    attachment: (0, import_fakeAttachment.fakeAttachment)({
      caption: "This place looks lovely",
      path: "file.jpg",
      url: "/fixtures/nathan-anderson-316188-unsplash.jpg"
    })
  }
};
const LongCaption = Template.bind({});
LongCaption.args = {
  story: {
    ...(0, import_getFakeStory.getFakeStoryView)(),
    attachment: (0, import_fakeAttachment.fakeAttachment)({
      caption: "Snowycle, snowycle, snowycle\nI want to ride my snowycle, snowycle, snowycle\nI want to ride my snowycle\nI want to ride my snow\nI want to ride my snowycle\nI want to ride it where I like\nSnowycle, snowycle, snowycle\nI want to ride my snowycle, snowycle, snowycle\nI want to ride my snowycle\nI want to ride my snow\nI want to ride my snowycle\nI want to ride it where I like\nSnowycle, snowycle, snowycle\nI want to ride my snowycle, snowycle, snowycle\nI want to ride my snowycle\nI want to ride my snow\nI want to ride my snowycle\nI want to ride it where I like",
      path: "file.jpg",
      url: "/fixtures/snow.jpg"
    })
  }
};
const YourStory = Template.bind({});
{
  const storyView = (0, import_getFakeStory.getFakeStoryView)("/fixtures/nathan-anderson-316188-unsplash.jpg");
  YourStory.args = {
    story: {
      ...storyView,
      sender: {
        ...storyView.sender,
        isMe: true
      },
      sendState: [
        {
          recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
          status: import_MessageSendState.SendStatus.Viewed
        },
        {
          recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
          status: import_MessageSendState.SendStatus.Delivered
        },
        {
          recipient: (0, import_getDefaultConversation.getDefaultConversation)(),
          status: import_MessageSendState.SendStatus.Pending
        }
      ]
    }
  };
  YourStory.storyName = "Your story";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Caption,
  InAGroup,
  LongCaption,
  MultiStory,
  SomeonesStory,
  WideStory,
  YourStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlWaWV3ZXIuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL1N0b3J5Vmlld2VyJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgU3RvcnlWaWV3ZXIgfSBmcm9tICcuL1N0b3J5Vmlld2VyJztcbmltcG9ydCB7IFZJREVPX01QNCB9IGZyb20gJy4uL3R5cGVzL01JTUUnO1xuaW1wb3J0IHsgZmFrZUF0dGFjaG1lbnQgfSBmcm9tICcuLi90ZXN0LWJvdGgvaGVscGVycy9mYWtlQXR0YWNobWVudCc7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRGYWtlU3RvcnlWaWV3IH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RmFrZVN0b3J5JztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvU3RvcnlWaWV3ZXInLFxuICBjb21wb25lbnQ6IFN0b3J5Vmlld2VyLFxuICBhcmdUeXBlczoge1xuICAgIGN1cnJlbnRJbmRleDoge1xuICAgICAgZGVmYXVsdHZhbHVlOiAwLFxuICAgIH0sXG4gICAgZ2V0UHJlZmVycmVkQmFkZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgZ3JvdXA6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgaGFzQWxsU3Rvcmllc011dGVkOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gICAgaTE4bjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBpMThuLFxuICAgIH0sXG4gICAgbG9hZFN0b3J5UmVwbGllczogeyBhY3Rpb246IHRydWUgfSxcbiAgICBtYXJrU3RvcnlSZWFkOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG51bVN0b3JpZXM6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogMSxcbiAgICB9LFxuICAgIG9uR29Ub0NvbnZlcnNhdGlvbjogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkhpZGVTdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblJlYWN0VG9TdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblJlcGx5VG9TdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblNldFNraW5Ub25lOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uVGV4dFRvb0xvbmc6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25Vc2VFbW9qaTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBwcmVmZXJyZWRSZWFjdGlvbkVtb2ppOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IFsnXHUyNzY0XHVGRTBGJywgJ1x1RDgzRFx1REM0RCcsICdcdUQ4M0RcdURDNEUnLCAnXHVEODNEXHVERTAyJywgJ1x1RDgzRFx1REUyRScsICdcdUQ4M0RcdURFMjInXSxcbiAgICB9LFxuICAgIHF1ZXVlU3RvcnlEb3dubG9hZDogeyBhY3Rpb246IHRydWUgfSxcbiAgICByZW5kZXJFbW9qaVBpY2tlcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICBzaG93VG9hc3Q6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgc2tpblRvbmU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICB9LFxuICAgIHN0b3J5OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGdldEZha2VTdG9yeVZpZXcoKSxcbiAgICB9LFxuICAgIHRvZ2dsZUhhc0FsbFN0b3JpZXNNdXRlZDogeyBhY3Rpb246IHRydWUgfSxcbiAgICB2aWV3U3Rvcnk6IHsgYWN0aW9uOiB0cnVlIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8U3RvcnlWaWV3ZXIgey4uLmFyZ3N9IC8+O1xuXG5leHBvcnQgY29uc3QgU29tZW9uZXNTdG9yeSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuU29tZW9uZXNTdG9yeS5hcmdzID0ge307XG5Tb21lb25lc1N0b3J5LnN0b3J5ID0ge1xuICBuYW1lOiBcIlNvbWVvbmUncyBzdG9yeVwiLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpZGVTdG9yeSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuV2lkZVN0b3J5LmFyZ3MgPSB7XG4gIHN0b3J5OiBnZXRGYWtlU3RvcnlWaWV3KCcvZml4dHVyZXMvbmF0aGFuLWFuZGVyc29uLTMxNjE4OC11bnNwbGFzaC5qcGcnKSxcbn07XG5XaWRlU3Rvcnkuc3RvcnkgPSB7XG4gIG5hbWU6ICdXaWRlIHN0b3J5Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBJbkFHcm91cCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuSW5BR3JvdXAuYXJncyA9IHtcbiAgZ3JvdXA6IGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgIGF2YXRhclBhdGg6ICcvZml4dHVyZXMva2l0dGVuLTQtMTEyLTExMi5qcGcnLFxuICAgIHRpdGxlOiAnRmFtaWx5IEdyb3VwJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICB9KSxcbn07XG5JbkFHcm91cC5zdG9yeSA9IHtcbiAgbmFtZTogJ0luIGEgZ3JvdXAnLFxufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpU3RvcnkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk11bHRpU3RvcnkuYXJncyA9IHtcbiAgY3VycmVudEluZGV4OiAyLFxuICBudW1TdG9yaWVzOiA3LFxuICBzdG9yeToge1xuICAgIC4uLmdldEZha2VTdG9yeVZpZXcoKSxcbiAgICBhdHRhY2htZW50OiBmYWtlQXR0YWNobWVudCh7XG4gICAgICBjb250ZW50VHlwZTogVklERU9fTVA0LFxuICAgICAgZmlsZU5hbWU6ICdwaXhhYmF5LVNvYXAtQnViYmxlLTcxNDEubXA0JyxcbiAgICAgIHVybDogJy9maXh0dXJlcy9raXR0ZW4tNC0xMTItMTEyLmpwZycsXG4gICAgICBzY3JlZW5zaG90UGF0aDogJy9maXh0dXJlcy9raXR0ZW4tNC0xMTItMTEyLmpwZycsXG4gICAgfSksXG4gIH0sXG59O1xuTXVsdGlTdG9yeS5zdG9yeSA9IHtcbiAgbmFtZTogJ011bHRpIHN0b3J5Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBDYXB0aW9uID0gVGVtcGxhdGUuYmluZCh7fSk7XG5DYXB0aW9uLmFyZ3MgPSB7XG4gIHN0b3J5OiB7XG4gICAgLi4uZ2V0RmFrZVN0b3J5VmlldygpLFxuICAgIGF0dGFjaG1lbnQ6IGZha2VBdHRhY2htZW50KHtcbiAgICAgIGNhcHRpb246ICdUaGlzIHBsYWNlIGxvb2tzIGxvdmVseScsXG4gICAgICBwYXRoOiAnZmlsZS5qcGcnLFxuICAgICAgdXJsOiAnL2ZpeHR1cmVzL25hdGhhbi1hbmRlcnNvbi0zMTYxODgtdW5zcGxhc2guanBnJyxcbiAgICB9KSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBMb25nQ2FwdGlvbiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTG9uZ0NhcHRpb24uYXJncyA9IHtcbiAgc3Rvcnk6IHtcbiAgICAuLi5nZXRGYWtlU3RvcnlWaWV3KCksXG4gICAgYXR0YWNobWVudDogZmFrZUF0dGFjaG1lbnQoe1xuICAgICAgY2FwdGlvbjpcbiAgICAgICAgJ1Nub3d5Y2xlLCBzbm93eWNsZSwgc25vd3ljbGVcXG5JIHdhbnQgdG8gcmlkZSBteSBzbm93eWNsZSwgc25vd3ljbGUsIHNub3d5Y2xlXFxuSSB3YW50IHRvIHJpZGUgbXkgc25vd3ljbGVcXG5JIHdhbnQgdG8gcmlkZSBteSBzbm93XFxuSSB3YW50IHRvIHJpZGUgbXkgc25vd3ljbGVcXG5JIHdhbnQgdG8gcmlkZSBpdCB3aGVyZSBJIGxpa2VcXG5Tbm93eWNsZSwgc25vd3ljbGUsIHNub3d5Y2xlXFxuSSB3YW50IHRvIHJpZGUgbXkgc25vd3ljbGUsIHNub3d5Y2xlLCBzbm93eWNsZVxcbkkgd2FudCB0byByaWRlIG15IHNub3d5Y2xlXFxuSSB3YW50IHRvIHJpZGUgbXkgc25vd1xcbkkgd2FudCB0byByaWRlIG15IHNub3d5Y2xlXFxuSSB3YW50IHRvIHJpZGUgaXQgd2hlcmUgSSBsaWtlXFxuU25vd3ljbGUsIHNub3d5Y2xlLCBzbm93eWNsZVxcbkkgd2FudCB0byByaWRlIG15IHNub3d5Y2xlLCBzbm93eWNsZSwgc25vd3ljbGVcXG5JIHdhbnQgdG8gcmlkZSBteSBzbm93eWNsZVxcbkkgd2FudCB0byByaWRlIG15IHNub3dcXG5JIHdhbnQgdG8gcmlkZSBteSBzbm93eWNsZVxcbkkgd2FudCB0byByaWRlIGl0IHdoZXJlIEkgbGlrZScsXG4gICAgICBwYXRoOiAnZmlsZS5qcGcnLFxuICAgICAgdXJsOiAnL2ZpeHR1cmVzL3Nub3cuanBnJyxcbiAgICB9KSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBZb3VyU3RvcnkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbntcbiAgY29uc3Qgc3RvcnlWaWV3ID0gZ2V0RmFrZVN0b3J5VmlldyhcbiAgICAnL2ZpeHR1cmVzL25hdGhhbi1hbmRlcnNvbi0zMTYxODgtdW5zcGxhc2guanBnJ1xuICApO1xuXG4gIFlvdXJTdG9yeS5hcmdzID0ge1xuICAgIHN0b3J5OiB7XG4gICAgICAuLi5zdG9yeVZpZXcsXG4gICAgICBzZW5kZXI6IHtcbiAgICAgICAgLi4uc3RvcnlWaWV3LnNlbmRlcixcbiAgICAgICAgaXNNZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzZW5kU3RhdGU6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlY2lwaWVudDogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZWNpcGllbnQ6IGdldERlZmF1bHRDb252ZXJzYXRpb24oKSxcbiAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuRGVsaXZlcmVkLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVjaXBpZW50OiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG4gIFlvdXJTdG9yeS5zdG9yeU5hbWUgPSAnWW91ciBzdG9yeSc7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBa0I7QUFHbEIsc0JBQXVCO0FBQ3ZCLDhCQUEyQjtBQUMzQix5QkFBNEI7QUFDNUIsa0JBQTBCO0FBQzFCLDRCQUErQjtBQUMvQixvQ0FBdUM7QUFDdkMsMEJBQWlDO0FBQ2pDLHVCQUEwQjtBQUUxQixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLDhCQUFRO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixjQUFjO0FBQUEsTUFDWixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLG1CQUFtQixFQUFFLFFBQVEsS0FBSztBQUFBLElBQ2xDLE9BQU87QUFB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
