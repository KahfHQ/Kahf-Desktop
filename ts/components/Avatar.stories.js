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
var Avatar_stories_exports = {};
__export(Avatar_stories_exports, {
  BlurredBasedOnProps: () => BlurredBasedOnProps,
  BlurredWithClickToView: () => BlurredWithClickToView,
  BrokenAvatar: () => BrokenAvatar,
  BrokenAvatarForGroup: () => BrokenAvatarForGroup,
  BrokenColor: () => BrokenColor,
  Colors: () => Colors,
  ContactIcon: () => ContactIcon,
  Default: () => Default,
  ForceBlurred: () => ForceBlurred,
  GroupIcon: () => GroupIcon,
  Loading: () => Loading,
  NoteToSelf: () => NoteToSelf,
  OneWordName: () => OneWordName,
  SearchIcon: () => SearchIcon,
  StoryRead: () => StoryRead,
  StoryUnread: () => StoryUnread,
  ThreeWordName: () => ThreeWordName,
  TwoWordName: () => TwoWordName,
  WideImage: () => WideImage,
  WideInitials: () => WideInitials,
  WithBadge: () => WithBadge,
  default: () => Avatar_stories_default
});
module.exports = __toCommonJS(Avatar_stories_exports);
var React = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_jest = require("@storybook/jest");
var import_lodash = require("lodash");
var import_testing_library = require("@storybook/testing-library");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_Avatar = require("./Avatar");
var import_Colors = require("../types/Colors");
var import_Stories = require("../types/Stories");
var import_Util = require("../types/Util");
var import_getFakeBadge = require("../test-both/helpers/getFakeBadge");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const colorMap = import_Colors.AvatarColors.reduce((m, color) => ({
  ...m,
  [color]: color
}), {});
const conversationTypeMap = {
  direct: "direct",
  group: "group"
};
var Avatar_stories_default = {
  title: "Components/Avatar",
  component: import_Avatar.Avatar,
  argTypes: {
    badge: {
      control: false
    },
    blur: {
      control: { type: "radio" },
      defaultValue: import_Avatar.AvatarBlur.NoBlur,
      options: {
        NoBlur: import_Avatar.AvatarBlur.NoBlur,
        BlurPicture: import_Avatar.AvatarBlur.BlurPicture,
        BlurPictureWithClickToView: import_Avatar.AvatarBlur.BlurPictureWithClickToView
      }
    },
    color: {
      defaultValue: import_Colors.AvatarColors[0],
      options: colorMap
    },
    conversationType: {
      control: { type: "radio" },
      options: conversationTypeMap
    },
    onClick: { action: true },
    size: {
      control: false
    },
    storyRing: {
      control: { type: "radio" },
      options: [void 0, ...Object.values(import_Stories.HasStories)]
    },
    theme: {
      control: { type: "radio" },
      defaultValue: import_Util.ThemeType.light,
      options: import_Util.ThemeType
    }
  }
};
const createProps = /* @__PURE__ */ __name((overrideProps = {}) => ({
  acceptedMessageRequest: (0, import_lodash.isBoolean)(overrideProps.acceptedMessageRequest) ? overrideProps.acceptedMessageRequest : true,
  avatarPath: overrideProps.avatarPath || "",
  badge: overrideProps.badge,
  blur: overrideProps.blur || import_Avatar.AvatarBlur.NoBlur,
  color: overrideProps.color || import_Colors.AvatarColors[0],
  conversationType: overrideProps.conversationType || "direct",
  i18n,
  isMe: false,
  loading: Boolean(overrideProps.loading),
  name: overrideProps.name || "",
  noteToSelf: Boolean(overrideProps.noteToSelf),
  onClick: (0, import_addon_actions.action)("onClick"),
  onClickBadge: (0, import_addon_actions.action)("onClickBadge"),
  phoneNumber: overrideProps.phoneNumber || "",
  searchResult: Boolean(overrideProps.searchResult),
  sharedGroupNames: [],
  size: 80,
  title: overrideProps.title || "",
  theme: overrideProps.theme || import_Util.ThemeType.light
}), "createProps");
const sizes = Object.values(import_Avatar.AvatarSize).filter((x) => typeof x === "number");
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ React.createElement(React.Fragment, null, sizes.map((size) => /* @__PURE__ */ React.createElement(import_Avatar.Avatar, {
  key: size,
  ...args,
  size
}))), "Template");
const TemplateSingle = /* @__PURE__ */ __name((args) => /* @__PURE__ */ React.createElement(import_Avatar.Avatar, {
  ...args,
  size: import_Avatar.AvatarSize.ONE_HUNDRED_TWELVE
}), "TemplateSingle");
const Default = Template.bind({});
Default.args = createProps({
  avatarPath: "/fixtures/giphy-GVNvOUpeYmI7e.gif"
});
Default.play = async ({ args, canvasElement }) => {
  const canvas = (0, import_testing_library.within)(canvasElement);
  const [avatar] = canvas.getAllByRole("button");
  await import_testing_library.userEvent.click(avatar);
  await (0, import_jest.expect)(args.onClick).toHaveBeenCalled();
};
Default.story = {
  name: "Avatar"
};
const WithBadge = Template.bind({});
WithBadge.args = createProps({
  avatarPath: "/fixtures/kitten-3-64-64.jpg",
  badge: (0, import_getFakeBadge.getFakeBadge)()
});
WithBadge.story = {
  name: "With badge"
};
const WideImage = Template.bind({});
WideImage.args = createProps({
  avatarPath: "/fixtures/wide.jpg"
});
WideImage.story = {
  name: "Wide image"
};
const OneWordName = Template.bind({});
OneWordName.args = createProps({
  title: "John"
});
OneWordName.story = {
  name: "One-word Name"
};
const TwoWordName = Template.bind({});
TwoWordName.args = createProps({
  title: "John Smith"
});
TwoWordName.story = {
  name: "Two-word Name"
};
const WideInitials = Template.bind({});
WideInitials.args = createProps({
  title: "Walter White"
});
WideInitials.story = {
  name: "Wide initials"
};
const ThreeWordName = Template.bind({});
ThreeWordName.args = createProps({
  title: "Walter H. White"
});
ThreeWordName.story = {
  name: "Three-word name"
};
const NoteToSelf = Template.bind({});
NoteToSelf.args = createProps({
  noteToSelf: true
});
NoteToSelf.story = {
  name: "Note to Self"
};
const ContactIcon = Template.bind({});
ContactIcon.args = createProps();
const GroupIcon = Template.bind({});
GroupIcon.args = createProps({
  conversationType: "group"
});
const SearchIcon = Template.bind({});
SearchIcon.args = createProps({
  searchResult: true
});
const Colors = /* @__PURE__ */ __name(() => {
  const props = createProps();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, import_Colors.AvatarColors.map((color) => /* @__PURE__ */ React.createElement(import_Avatar.Avatar, {
    key: color,
    ...props,
    color
  })));
}, "Colors");
const BrokenColor = Template.bind({});
BrokenColor.args = createProps({
  color: "nope"
});
const BrokenAvatar = Template.bind({});
BrokenAvatar.args = createProps({
  avatarPath: "badimage.png"
});
const BrokenAvatarForGroup = Template.bind({});
BrokenAvatarForGroup.args = createProps({
  avatarPath: "badimage.png",
  conversationType: "group"
});
BrokenAvatarForGroup.story = {
  name: "Broken Avatar for Group"
};
const Loading = Template.bind({});
Loading.args = createProps({
  loading: true
});
const BlurredBasedOnProps = TemplateSingle.bind({});
BlurredBasedOnProps.args = createProps({
  acceptedMessageRequest: false,
  avatarPath: "/fixtures/kitten-3-64-64.jpg"
});
BlurredBasedOnProps.story = {
  name: "Blurred based on props"
};
const ForceBlurred = TemplateSingle.bind({});
ForceBlurred.args = createProps({
  avatarPath: "/fixtures/kitten-3-64-64.jpg",
  blur: import_Avatar.AvatarBlur.BlurPicture
});
ForceBlurred.story = {
  name: "Force-blurred"
};
const BlurredWithClickToView = TemplateSingle.bind({});
BlurredWithClickToView.args = createProps({
  avatarPath: "/fixtures/kitten-3-64-64.jpg",
  blur: import_Avatar.AvatarBlur.BlurPictureWithClickToView
});
BlurredWithClickToView.story = {
  name: 'Blurred with "click to view"'
};
const StoryUnread = TemplateSingle.bind({});
StoryUnread.args = createProps({
  avatarPath: "/fixtures/kitten-3-64-64.jpg",
  storyRing: import_Stories.HasStories.Unread
});
StoryUnread.story = {
  name: "Story: unread"
};
const StoryRead = TemplateSingle.bind({});
StoryRead.args = createProps({
  avatarPath: "/fixtures/kitten-3-64-64.jpg",
  storyRing: import_Stories.HasStories.Read
});
StoryRead.story = {
  name: "Story: read"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlurredBasedOnProps,
  BlurredWithClickToView,
  BrokenAvatar,
  BrokenAvatarForGroup,
  BrokenColor,
  Colors,
  ContactIcon,
  Default,
  ForceBlurred,
  GroupIcon,
  Loading,
  NoteToSelf,
  OneWordName,
  SearchIcon,
  StoryRead,
  StoryUnread,
  ThreeWordName,
  TwoWordName,
  WideImage,
  WideInitials,
  WithBadge
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXZhdGFyLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYWN0aW9uIH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1hY3Rpb25zJztcbmltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ0BzdG9yeWJvb2svamVzdCc7XG5pbXBvcnQgeyBpc0Jvb2xlYW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgd2l0aGluLCB1c2VyRXZlbnQgfSBmcm9tICdAc3Rvcnlib29rL3Rlc3RpbmctbGlicmFyeSc7XG5cbmltcG9ydCB0eXBlIHsgQXZhdGFyQ29sb3JUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL0F2YXRhcic7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyQmx1ciwgQXZhdGFyU2l6ZSB9IGZyb20gJy4vQXZhdGFyJztcbmltcG9ydCB7IEF2YXRhckNvbG9ycyB9IGZyb20gJy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IGdldEZha2VCYWRnZSB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldEZha2VCYWRnZSc7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmNvbnN0IGNvbG9yTWFwOiBSZWNvcmQ8c3RyaW5nLCBBdmF0YXJDb2xvclR5cGU+ID0gQXZhdGFyQ29sb3JzLnJlZHVjZShcbiAgKG0sIGNvbG9yKSA9PiAoe1xuICAgIC4uLm0sXG4gICAgW2NvbG9yXTogY29sb3IsXG4gIH0pLFxuICB7fVxuKTtcblxuY29uc3QgY29udmVyc2F0aW9uVHlwZU1hcDogUmVjb3JkPHN0cmluZywgUHJvcHNbJ2NvbnZlcnNhdGlvblR5cGUnXT4gPSB7XG4gIGRpcmVjdDogJ2RpcmVjdCcsXG4gIGdyb3VwOiAnZ3JvdXAnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvQXZhdGFyJyxcbiAgY29tcG9uZW50OiBBdmF0YXIsXG4gIGFyZ1R5cGVzOiB7XG4gICAgYmFkZ2U6IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgIH0sXG4gICAgYmx1cjoge1xuICAgICAgY29udHJvbDogeyB0eXBlOiAncmFkaW8nIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IEF2YXRhckJsdXIuTm9CbHVyLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBOb0JsdXI6IEF2YXRhckJsdXIuTm9CbHVyLFxuICAgICAgICBCbHVyUGljdHVyZTogQXZhdGFyQmx1ci5CbHVyUGljdHVyZSxcbiAgICAgICAgQmx1clBpY3R1cmVXaXRoQ2xpY2tUb1ZpZXc6IEF2YXRhckJsdXIuQmx1clBpY3R1cmVXaXRoQ2xpY2tUb1ZpZXcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogQXZhdGFyQ29sb3JzWzBdLFxuICAgICAgb3B0aW9uczogY29sb3JNYXAsXG4gICAgfSxcbiAgICBjb252ZXJzYXRpb25UeXBlOiB7XG4gICAgICBjb250cm9sOiB7IHR5cGU6ICdyYWRpbycgfSxcbiAgICAgIG9wdGlvbnM6IGNvbnZlcnNhdGlvblR5cGVNYXAsXG4gICAgfSxcbiAgICBvbkNsaWNrOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNpemU6IHtcbiAgICAgIGNvbnRyb2w6IGZhbHNlLFxuICAgIH0sXG4gICAgc3RvcnlSaW5nOiB7XG4gICAgICBjb250cm9sOiB7IHR5cGU6ICdyYWRpbycgfSxcbiAgICAgIG9wdGlvbnM6IFt1bmRlZmluZWQsIC4uLk9iamVjdC52YWx1ZXMoSGFzU3RvcmllcyldLFxuICAgIH0sXG4gICAgdGhlbWU6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ3JhZGlvJyB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiBUaGVtZVR5cGUubGlnaHQsXG4gICAgICBvcHRpb25zOiBUaGVtZVR5cGUsXG4gICAgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgY3JlYXRlUHJvcHMgPSAob3ZlcnJpZGVQcm9wczogUGFydGlhbDxQcm9wcz4gPSB7fSk6IFByb3BzID0+ICh7XG4gIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IGlzQm9vbGVhbihvdmVycmlkZVByb3BzLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3QpXG4gICAgPyBvdmVycmlkZVByb3BzLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3RcbiAgICA6IHRydWUsXG4gIGF2YXRhclBhdGg6IG92ZXJyaWRlUHJvcHMuYXZhdGFyUGF0aCB8fCAnJyxcbiAgYmFkZ2U6IG92ZXJyaWRlUHJvcHMuYmFkZ2UsXG4gIGJsdXI6IG92ZXJyaWRlUHJvcHMuYmx1ciB8fCBBdmF0YXJCbHVyLk5vQmx1cixcbiAgY29sb3I6IG92ZXJyaWRlUHJvcHMuY29sb3IgfHwgQXZhdGFyQ29sb3JzWzBdLFxuICBjb252ZXJzYXRpb25UeXBlOiBvdmVycmlkZVByb3BzLmNvbnZlcnNhdGlvblR5cGUgfHwgJ2RpcmVjdCcsXG4gIGkxOG4sXG4gIGlzTWU6IGZhbHNlLFxuICBsb2FkaW5nOiBCb29sZWFuKG92ZXJyaWRlUHJvcHMubG9hZGluZyksXG4gIG5hbWU6IG92ZXJyaWRlUHJvcHMubmFtZSB8fCAnJyxcbiAgbm90ZVRvU2VsZjogQm9vbGVhbihvdmVycmlkZVByb3BzLm5vdGVUb1NlbGYpLFxuICBvbkNsaWNrOiBhY3Rpb24oJ29uQ2xpY2snKSxcbiAgb25DbGlja0JhZGdlOiBhY3Rpb24oJ29uQ2xpY2tCYWRnZScpLFxuICBwaG9uZU51bWJlcjogb3ZlcnJpZGVQcm9wcy5waG9uZU51bWJlciB8fCAnJyxcbiAgc2VhcmNoUmVzdWx0OiBCb29sZWFuKG92ZXJyaWRlUHJvcHMuc2VhcmNoUmVzdWx0KSxcbiAgc2hhcmVkR3JvdXBOYW1lczogW10sXG4gIHNpemU6IDgwLFxuICB0aXRsZTogb3ZlcnJpZGVQcm9wcy50aXRsZSB8fCAnJyxcbiAgdGhlbWU6IG92ZXJyaWRlUHJvcHMudGhlbWUgfHwgVGhlbWVUeXBlLmxpZ2h0LFxufSk7XG5cbmNvbnN0IHNpemVzID0gT2JqZWN0LnZhbHVlcyhBdmF0YXJTaXplKS5maWx0ZXIoXG4gIHggPT4gdHlwZW9mIHggPT09ICdudW1iZXInXG4pIGFzIEFycmF5PEF2YXRhclNpemU+O1xuXG5jb25zdCBUZW1wbGF0ZTogU3Rvcnk8UHJvcHM+ID0gYXJncyA9PiAoXG4gIDw+XG4gICAge3NpemVzLm1hcChzaXplID0+IChcbiAgICAgIDxBdmF0YXIga2V5PXtzaXplfSB7Li4uYXJnc30gc2l6ZT17c2l6ZX0gLz5cbiAgICApKX1cbiAgPC8+XG4pO1xuXG5jb25zdCBUZW1wbGF0ZVNpbmdsZTogU3Rvcnk8UHJvcHM+ID0gYXJncyA9PiAoXG4gIDxBdmF0YXIgey4uLmFyZ3N9IHNpemU9e0F2YXRhclNpemUuT05FX0hVTkRSRURfVFdFTFZFfSAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHQgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkRlZmF1bHQuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgYXZhdGFyUGF0aDogJy9maXh0dXJlcy9naXBoeS1HVk52T1VwZVltSTdlLmdpZicsXG59KTtcbkRlZmF1bHQucGxheSA9IGFzeW5jICh7IGFyZ3MsIGNhbnZhc0VsZW1lbnQgfSkgPT4ge1xuICBjb25zdCBjYW52YXMgPSB3aXRoaW4oY2FudmFzRWxlbWVudCk7XG4gIGNvbnN0IFthdmF0YXJdID0gY2FudmFzLmdldEFsbEJ5Um9sZSgnYnV0dG9uJyk7XG4gIGF3YWl0IHVzZXJFdmVudC5jbGljayhhdmF0YXIpO1xuICBhd2FpdCBleHBlY3QoYXJncy5vbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG59O1xuRGVmYXVsdC5zdG9yeSA9IHtcbiAgbmFtZTogJ0F2YXRhcicsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aEJhZGdlID0gVGVtcGxhdGUuYmluZCh7fSk7XG5XaXRoQmFkZ2UuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgYXZhdGFyUGF0aDogJy9maXh0dXJlcy9raXR0ZW4tMy02NC02NC5qcGcnLFxuICBiYWRnZTogZ2V0RmFrZUJhZGdlKCksXG59KTtcbldpdGhCYWRnZS5zdG9yeSA9IHtcbiAgbmFtZTogJ1dpdGggYmFkZ2UnLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpZGVJbWFnZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuV2lkZUltYWdlLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGF2YXRhclBhdGg6ICcvZml4dHVyZXMvd2lkZS5qcGcnLFxufSk7XG5XaWRlSW1hZ2Uuc3RvcnkgPSB7XG4gIG5hbWU6ICdXaWRlIGltYWdlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBPbmVXb3JkTmFtZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuT25lV29yZE5hbWUuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgdGl0bGU6ICdKb2huJyxcbn0pO1xuT25lV29yZE5hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdPbmUtd29yZCBOYW1lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBUd29Xb3JkTmFtZSA9IFRlbXBsYXRlLmJpbmQoe30pO1xuVHdvV29yZE5hbWUuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgdGl0bGU6ICdKb2huIFNtaXRoJyxcbn0pO1xuVHdvV29yZE5hbWUuc3RvcnkgPSB7XG4gIG5hbWU6ICdUd28td29yZCBOYW1lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBXaWRlSW5pdGlhbHMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbldpZGVJbml0aWFscy5hcmdzID0gY3JlYXRlUHJvcHMoe1xuICB0aXRsZTogJ1dhbHRlciBXaGl0ZScsXG59KTtcbldpZGVJbml0aWFscy5zdG9yeSA9IHtcbiAgbmFtZTogJ1dpZGUgaW5pdGlhbHMnLFxufTtcblxuZXhwb3J0IGNvbnN0IFRocmVlV29yZE5hbWUgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblRocmVlV29yZE5hbWUuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgdGl0bGU6ICdXYWx0ZXIgSC4gV2hpdGUnLFxufSk7XG5UaHJlZVdvcmROYW1lLnN0b3J5ID0ge1xuICBuYW1lOiAnVGhyZWUtd29yZCBuYW1lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBOb3RlVG9TZWxmID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Ob3RlVG9TZWxmLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIG5vdGVUb1NlbGY6IHRydWUsXG59KTtcbk5vdGVUb1NlbGYuc3RvcnkgPSB7XG4gIG5hbWU6ICdOb3RlIHRvIFNlbGYnLFxufTtcblxuZXhwb3J0IGNvbnN0IENvbnRhY3RJY29uID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Db250YWN0SWNvbi5hcmdzID0gY3JlYXRlUHJvcHMoKTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwSWNvbiA9IFRlbXBsYXRlLmJpbmQoe30pO1xuR3JvdXBJY29uLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcsXG59KTtcblxuZXhwb3J0IGNvbnN0IFNlYXJjaEljb24gPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblNlYXJjaEljb24uYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgc2VhcmNoUmVzdWx0OiB0cnVlLFxufSk7XG5cbmV4cG9ydCBjb25zdCBDb2xvcnMgPSAoKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBwcm9wcyA9IGNyZWF0ZVByb3BzKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge0F2YXRhckNvbG9ycy5tYXAoY29sb3IgPT4gKFxuICAgICAgICA8QXZhdGFyIGtleT17Y29sb3J9IHsuLi5wcm9wc30gY29sb3I9e2NvbG9yfSAvPlxuICAgICAgKSl9XG4gICAgPC8+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgQnJva2VuQ29sb3IgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkJyb2tlbkNvbG9yLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGNvbG9yOiAnbm9wZScgYXMgQXZhdGFyQ29sb3JUeXBlLFxufSk7XG5cbmV4cG9ydCBjb25zdCBCcm9rZW5BdmF0YXIgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkJyb2tlbkF2YXRhci5hcmdzID0gY3JlYXRlUHJvcHMoe1xuICBhdmF0YXJQYXRoOiAnYmFkaW1hZ2UucG5nJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgQnJva2VuQXZhdGFyRm9yR3JvdXAgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkJyb2tlbkF2YXRhckZvckdyb3VwLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGF2YXRhclBhdGg6ICdiYWRpbWFnZS5wbmcnLFxuICBjb252ZXJzYXRpb25UeXBlOiAnZ3JvdXAnLFxufSk7XG5Ccm9rZW5BdmF0YXJGb3JHcm91cC5zdG9yeSA9IHtcbiAgbmFtZTogJ0Jyb2tlbiBBdmF0YXIgZm9yIEdyb3VwJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMb2FkaW5nID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Mb2FkaW5nLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGxvYWRpbmc6IHRydWUsXG59KTtcblxuZXhwb3J0IGNvbnN0IEJsdXJyZWRCYXNlZE9uUHJvcHMgPSBUZW1wbGF0ZVNpbmdsZS5iaW5kKHt9KTtcbkJsdXJyZWRCYXNlZE9uUHJvcHMuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogZmFsc2UsXG4gIGF2YXRhclBhdGg6ICcvZml4dHVyZXMva2l0dGVuLTMtNjQtNjQuanBnJyxcbn0pO1xuQmx1cnJlZEJhc2VkT25Qcm9wcy5zdG9yeSA9IHtcbiAgbmFtZTogJ0JsdXJyZWQgYmFzZWQgb24gcHJvcHMnLFxufTtcblxuZXhwb3J0IGNvbnN0IEZvcmNlQmx1cnJlZCA9IFRlbXBsYXRlU2luZ2xlLmJpbmQoe30pO1xuRm9yY2VCbHVycmVkLmFyZ3MgPSBjcmVhdGVQcm9wcyh7XG4gIGF2YXRhclBhdGg6ICcvZml4dHVyZXMva2l0dGVuLTMtNjQtNjQuanBnJyxcbiAgYmx1cjogQXZhdGFyQmx1ci5CbHVyUGljdHVyZSxcbn0pO1xuRm9yY2VCbHVycmVkLnN0b3J5ID0ge1xuICBuYW1lOiAnRm9yY2UtYmx1cnJlZCcsXG59O1xuXG5leHBvcnQgY29uc3QgQmx1cnJlZFdpdGhDbGlja1RvVmlldyA9IFRlbXBsYXRlU2luZ2xlLmJpbmQoe30pO1xuQmx1cnJlZFdpdGhDbGlja1RvVmlldy5hcmdzID0gY3JlYXRlUHJvcHMoe1xuICBhdmF0YXJQYXRoOiAnL2ZpeHR1cmVzL2tpdHRlbi0zLTY0LTY0LmpwZycsXG4gIGJsdXI6IEF2YXRhckJsdXIuQmx1clBpY3R1cmVXaXRoQ2xpY2tUb1ZpZXcsXG59KTtcbkJsdXJyZWRXaXRoQ2xpY2tUb1ZpZXcuc3RvcnkgPSB7XG4gIG5hbWU6ICdCbHVycmVkIHdpdGggXCJjbGljayB0byB2aWV3XCInLFxufTtcblxuZXhwb3J0IGNvbnN0IFN0b3J5VW5yZWFkID0gVGVtcGxhdGVTaW5nbGUuYmluZCh7fSk7XG5TdG9yeVVucmVhZC5hcmdzID0gY3JlYXRlUHJvcHMoe1xuICBhdmF0YXJQYXRoOiAnL2ZpeHR1cmVzL2tpdHRlbi0zLTY0LTY0LmpwZycsXG4gIHN0b3J5UmluZzogSGFzU3Rvcmllcy5VbnJlYWQsXG59KTtcblN0b3J5VW5yZWFkLnN0b3J5ID0ge1xuICBuYW1lOiAnU3Rvcnk6IHVucmVhZCcsXG59O1xuXG5leHBvcnQgY29uc3QgU3RvcnlSZWFkID0gVGVtcGxhdGVTaW5nbGUuYmluZCh7fSk7XG5TdG9yeVJlYWQuYXJncyA9IGNyZWF0ZVByb3BzKHtcbiAgYXZhdGFyUGF0aDogJy9maXh0dXJlcy9raXR0ZW4tMy02NC02NC5qcGcnLFxuICBzdG9yeVJpbmc6IEhhc1N0b3JpZXMuUmVhZCxcbn0pO1xuU3RvcnlSZWFkLnN0b3J5ID0ge1xuICBuYW1lOiAnU3Rvcnk6IHJlYWQnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxZQUF1QjtBQUN2QiwyQkFBdUI7QUFDdkIsa0JBQXVCO0FBQ3ZCLG9CQUEwQjtBQUMxQiw2QkFBa0M7QUFJbEMsc0JBQXVCO0FBQ3ZCLG9CQUErQztBQUMvQyxvQkFBNkI7QUFDN0IscUJBQTJCO0FBQzNCLGtCQUEwQjtBQUMxQiwwQkFBNkI7QUFDN0IsdUJBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLE1BQU0sV0FBNEMsMkJBQWEsT0FDN0QsQ0FBQyxHQUFHLFVBQVc7QUFBQSxLQUNWO0FBQUEsR0FDRixRQUFRO0FBQ1gsSUFDQSxDQUFDLENBQ0g7QUFFQSxNQUFNLHNCQUFpRTtBQUFBLEVBQ3JFLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFDVDtBQUVBLElBQU8seUJBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixTQUFTLEVBQUUsTUFBTSxRQUFRO0FBQUEsTUFDekIsY0FBYyx5QkFBVztBQUFBLE1BQ3pCLFNBQVM7QUFBQSxRQUNQLFFBQVEs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
