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
var StoryListItem_stories_exports = {};
__export(StoryListItem_stories_exports, {
  SomeonesStory: () => SomeonesStory,
  default: () => StoryListItem_stories_default
});
module.exports = __toCommonJS(StoryListItem_stories_exports);
var import_react = __toESM(require("react"));
var import_StoryListItem = require("./StoryListItem");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_setupI18n = require("../util/setupI18n");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_fakeAttachment = require("../test-both/helpers/fakeAttachment");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var StoryListItem_stories_default = {
  title: "Components/StoryListItem",
  component: import_StoryListItem.StoryListItem,
  argTypes: {
    conversationId: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)().id
    },
    getPreferredBadge: { action: true },
    i18n: {
      defaultValue: i18n
    },
    onGoToConversation: { action: true },
    onHideStory: { action: true },
    queueStoryDownload: { action: true },
    story: {
      defaultValue: {
        messageId: "123",
        sender: (0, import_getDefaultConversation.getDefaultConversation)(),
        timestamp: Date.now()
      }
    },
    viewUserStories: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_StoryListItem.StoryListItem, {
  ...args
}), "Template");
const SomeonesStory = Template.bind({});
SomeonesStory.args = {
  group: (0, import_getDefaultConversation.getDefaultConversation)({ title: "Sports Group" }),
  story: {
    attachment: (0, import_fakeAttachment.fakeAttachment)({
      thumbnail: (0, import_fakeAttachment.fakeThumbnail)("/fixtures/tina-rolf-269345-unsplash.jpg")
    }),
    hasReplies: true,
    isUnread: true,
    messageId: "123",
    sender: (0, import_getDefaultConversation.getDefaultConversation)(),
    timestamp: Date.now()
  }
};
SomeonesStory.story = {
  name: "Someone's story"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SomeonesStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlMaXN0SXRlbS5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSB9IGZyb20gJy4vU3RvcnlMaXN0SXRlbSc7XG5pbXBvcnQgeyBTdG9yeUxpc3RJdGVtIH0gZnJvbSAnLi9TdG9yeUxpc3RJdGVtJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdXRpbC9zZXR1cEkxOG4nO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHtcbiAgZmFrZUF0dGFjaG1lbnQsXG4gIGZha2VUaHVtYm5haWwsXG59IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2Zha2VBdHRhY2htZW50JztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvU3RvcnlMaXN0SXRlbScsXG4gIGNvbXBvbmVudDogU3RvcnlMaXN0SXRlbSxcbiAgYXJnVHlwZXM6IHtcbiAgICBjb252ZXJzYXRpb25JZDoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCkuaWQsXG4gICAgfSxcbiAgICBnZXRQcmVmZXJyZWRCYWRnZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBvbkdvVG9Db252ZXJzYXRpb246IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25IaWRlU3Rvcnk6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgcXVldWVTdG9yeURvd25sb2FkOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHN0b3J5OiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgbWVzc2FnZUlkOiAnMTIzJyxcbiAgICAgICAgc2VuZGVyOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB2aWV3VXNlclN0b3JpZXM6IHsgYWN0aW9uOiB0cnVlIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8U3RvcnlMaXN0SXRlbSB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBTb21lb25lc1N0b3J5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Tb21lb25lc1N0b3J5LmFyZ3MgPSB7XG4gIGdyb3VwOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHsgdGl0bGU6ICdTcG9ydHMgR3JvdXAnIH0pLFxuICBzdG9yeToge1xuICAgIGF0dGFjaG1lbnQ6IGZha2VBdHRhY2htZW50KHtcbiAgICAgIHRodW1ibmFpbDogZmFrZVRodW1ibmFpbCgnL2ZpeHR1cmVzL3RpbmEtcm9sZi0yNjkzNDUtdW5zcGxhc2guanBnJyksXG4gICAgfSksXG4gICAgaGFzUmVwbGllczogdHJ1ZSxcbiAgICBpc1VucmVhZDogdHJ1ZSxcbiAgICBtZXNzYWdlSWQ6ICcxMjMnLFxuICAgIHNlbmRlcjogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgfSxcbn07XG5Tb21lb25lc1N0b3J5LnN0b3J5ID0ge1xuICBuYW1lOiBcIlNvbWVvbmUncyBzdG9yeVwiLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFrQjtBQUdsQiwyQkFBOEI7QUFDOUIsc0JBQXVCO0FBQ3ZCLHVCQUEwQjtBQUMxQixvQ0FBdUM7QUFDdkMsNEJBR087QUFFUCxNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLGdDQUFRO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixnQkFBZ0I7QUFBQSxNQUNkLGNBQWMsMERBQXVCLEVBQUU7QUFBQSxJQUN6QztBQUFBLElBQ0EsbUJBQW1CLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDbEMsTUFBTTtBQUFBLE1BQ0osY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxvQkFBb0IsRUFBRSxRQUFRLEtBQUs7QUFBQSxJQUNuQyxhQUFhLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDNUIsb0JBQW9CLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDbkMsT0FBTztBQUFBLE1BQ0wsY0FBYztBQUFBLFFBQ1osV0FBVztBQUFBLFFBQ1gsUUFBUSwwREFBdUI7QUFBQSxRQUMvQixXQUFXLEtBQUssSUFBSTtBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUFBLElBQ0EsaUJBQWlCLEVBQUUsUUFBUSxLQUFLO0FBQUEsRUFDbEM7QUFDRjtBQUVBLE1BQU0sV0FBNkIsaUNBQVEsbURBQUM7QUFBQSxLQUFrQjtBQUFBLENBQU0sR0FBakM7QUFFNUIsTUFBTSxnQkFBZ0IsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUM3QyxjQUFjLE9BQU87QUFBQSxFQUNuQixPQUFPLDBEQUF1QixFQUFFLE9BQU8sZUFBZSxDQUFDO0FBQUEsRUFDdkQsT0FBTztBQUFBLElBQ0wsWUFBWSwwQ0FBZTtBQUFBLE1BQ3pCLFdBQVcseUNBQWMseUNBQXlDO0FBQUEsSUFDcEUsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsUUFBUSwwREFBdUI7QUFBQSxJQUMvQixXQUFXLEtBQUssSUFBSTtBQUFBLEVBQ3RCO0FBQ0Y7QUFDQSxjQUFjLFFBQVE7QUFBQSxFQUNwQixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
