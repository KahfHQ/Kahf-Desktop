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
var MyStoriesButton_stories_exports = {};
__export(MyStoriesButton_stories_exports, {
  ManyStories: () => ManyStories,
  NoStory: () => NoStory,
  OneStory: () => OneStory,
  default: () => MyStoriesButton_stories_default
});
module.exports = __toCommonJS(MyStoriesButton_stories_exports);
var import_react = __toESM(require("react"));
var import_jest = require("@storybook/jest");
var import_testing_library = require("@storybook/testing-library");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_MyStoriesButton = require("./MyStoriesButton");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_getFakeStory = require("../test-both/helpers/getFakeStory");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var MyStoriesButton_stories_default = {
  title: "Components/MyStoriesButton",
  component: import_MyStoriesButton.MyStoriesButton,
  argTypes: {
    hasMultiple: {
      control: "checkbox",
      defaultValue: false
    },
    i18n: {
      defaultValue: i18n
    },
    me: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)()
    },
    newestStory: {
      defaultValue: (0, import_getFakeStory.getFakeStoryView)()
    },
    onAddStory: { action: true },
    onClick: { action: true },
    queueStoryDownload: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_MyStoriesButton.MyStoriesButton, {
  ...args
}), "Template");
const interactionTest = /* @__PURE__ */ __name(async ({
  args,
  canvasElement
}) => {
  const canvas = (0, import_testing_library.within)(canvasElement);
  const [btnAddStory] = canvas.getAllByLabelText("Add a story");
  await import_testing_library.userEvent.click(btnAddStory);
  await (0, import_jest.expect)(args.onAddStory).toHaveBeenCalled();
  const [btnStory] = canvas.getAllByLabelText("Story");
  await import_testing_library.userEvent.click(btnStory);
  await (0, import_jest.expect)(args.onClick).toHaveBeenCalled();
}, "interactionTest");
const NoStory = Template.bind({});
NoStory.args = {
  hasMultiple: false,
  newestStory: void 0
};
NoStory.story = {
  name: "No Story"
};
NoStory.play = interactionTest;
const OneStory = Template.bind({});
OneStory.args = {};
OneStory.story = {
  name: "One Story"
};
OneStory.play = interactionTest;
const ManyStories = Template.bind({});
ManyStories.args = {
  hasMultiple: true
};
ManyStories.story = {
  name: "Many Stories"
};
ManyStories.play = interactionTest;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ManyStories,
  NoStory,
  OneStory
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTXlTdG9yaWVzQnV0dG9uLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgUmVhY3RGcmFtZXdvcmssIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgdHlwZSB7IFBsYXlGdW5jdGlvbiB9IGZyb20gJ0BzdG9yeWJvb2svY3NmJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdAc3Rvcnlib29rL2plc3QnO1xuaW1wb3J0IHsgd2l0aGluLCB1c2VyRXZlbnQgfSBmcm9tICdAc3Rvcnlib29rL3Rlc3RpbmctbGlicmFyeSc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9NeVN0b3JpZXNCdXR0b24nO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBNeVN0b3JpZXNCdXR0b24gfSBmcm9tICcuL015U3Rvcmllc0J1dHRvbic7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRGYWtlU3RvcnlWaWV3IH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RmFrZVN0b3J5JztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvTXlTdG9yaWVzQnV0dG9uJyxcbiAgY29tcG9uZW50OiBNeVN0b3JpZXNCdXR0b24sXG4gIGFyZ1R5cGVzOiB7XG4gICAgaGFzTXVsdGlwbGU6IHtcbiAgICAgIGNvbnRyb2w6ICdjaGVja2JveCcsXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gICAgaTE4bjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBpMThuLFxuICAgIH0sXG4gICAgbWU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLFxuICAgIH0sXG4gICAgbmV3ZXN0U3Rvcnk6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RmFrZVN0b3J5VmlldygpLFxuICAgIH0sXG4gICAgb25BZGRTdG9yeTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkNsaWNrOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHF1ZXVlU3RvcnlEb3dubG9hZDogeyBhY3Rpb246IHRydWUgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxNeVN0b3JpZXNCdXR0b24gey4uLmFyZ3N9IC8+O1xuXG5jb25zdCBpbnRlcmFjdGlvblRlc3Q6IFBsYXlGdW5jdGlvbjxSZWFjdEZyYW1ld29yaywgUHJvcHNUeXBlPiA9IGFzeW5jICh7XG4gIGFyZ3MsXG4gIGNhbnZhc0VsZW1lbnQsXG59KSA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IHdpdGhpbihjYW52YXNFbGVtZW50KTtcbiAgY29uc3QgW2J0bkFkZFN0b3J5XSA9IGNhbnZhcy5nZXRBbGxCeUxhYmVsVGV4dCgnQWRkIGEgc3RvcnknKTtcbiAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGJ0bkFkZFN0b3J5KTtcbiAgYXdhaXQgZXhwZWN0KGFyZ3Mub25BZGRTdG9yeSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIGNvbnN0IFtidG5TdG9yeV0gPSBjYW52YXMuZ2V0QWxsQnlMYWJlbFRleHQoJ1N0b3J5Jyk7XG4gIGF3YWl0IHVzZXJFdmVudC5jbGljayhidG5TdG9yeSk7XG4gIGF3YWl0IGV4cGVjdChhcmdzLm9uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBOb1N0b3J5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5Ob1N0b3J5LmFyZ3MgPSB7XG4gIGhhc011bHRpcGxlOiBmYWxzZSxcbiAgbmV3ZXN0U3Rvcnk6IHVuZGVmaW5lZCxcbn07XG5Ob1N0b3J5LnN0b3J5ID0ge1xuICBuYW1lOiAnTm8gU3RvcnknLFxufTtcbk5vU3RvcnkucGxheSA9IGludGVyYWN0aW9uVGVzdDtcblxuZXhwb3J0IGNvbnN0IE9uZVN0b3J5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5PbmVTdG9yeS5hcmdzID0ge307XG5PbmVTdG9yeS5zdG9yeSA9IHtcbiAgbmFtZTogJ09uZSBTdG9yeScsXG59O1xuT25lU3RvcnkucGxheSA9IGludGVyYWN0aW9uVGVzdDtcblxuZXhwb3J0IGNvbnN0IE1hbnlTdG9yaWVzID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NYW55U3Rvcmllcy5hcmdzID0ge1xuICBoYXNNdWx0aXBsZTogdHJ1ZSxcbn07XG5NYW55U3Rvcmllcy5zdG9yeSA9IHtcbiAgbmFtZTogJ01hbnkgU3RvcmllcycsXG59O1xuTWFueVN0b3JpZXMucGxheSA9IGludGVyYWN0aW9uVGVzdDtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxtQkFBa0I7QUFDbEIsa0JBQXVCO0FBQ3ZCLDZCQUFrQztBQUdsQyxzQkFBdUI7QUFDdkIsNkJBQWdDO0FBQ2hDLG9DQUF1QztBQUN2QywwQkFBaUM7QUFDakMsdUJBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sa0NBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLGFBQWE7QUFBQSxNQUNYLFNBQVM7QUFBQSxNQUNULGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxJQUFJO0FBQUEsTUFDRixjQUFjLDBEQUF1QjtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxhQUFhO0FBQUEsTUFDWCxjQUFjLDBDQUFpQjtBQUFBLElBQ2pDO0FBQUEsSUFDQSxZQUFZLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDM0IsU0FBUyxFQUFFLFFBQVEsS0FBSztBQUFBLElBQ3hCLG9CQUFvQixFQUFFLFFBQVEsS0FBSztBQUFBLEVBQ3JDO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRLG1EQUFDO0FBQUEsS0FBb0I7QUFBQSxDQUFNLEdBQW5DO0FBRW5DLE1BQU0sa0JBQTJELDhCQUFPO0FBQUEsRUFDdEU7QUFBQSxFQUNBO0FBQUEsTUFDSTtBQUNKLFFBQU0sU0FBUyxtQ0FBTyxhQUFhO0FBQ25DLFFBQU0sQ0FBQyxlQUFlLE9BQU8sa0JBQWtCLGFBQWE7QUFDNUQsUUFBTSxpQ0FBVSxNQUFNLFdBQVc7QUFDakMsUUFBTSx3QkFBTyxLQUFLLFVBQVUsRUFBRSxpQkFBaUI7QUFFL0MsUUFBTSxDQUFDLFlBQVksT0FBTyxrQkFBa0IsT0FBTztBQUNuRCxRQUFNLGlDQUFVLE1BQU0sUUFBUTtBQUM5QixRQUFNLHdCQUFPLEtBQUssT0FBTyxFQUFFLGlCQUFpQjtBQUM5QyxHQVppRTtBQWMxRCxNQUFNLFVBQVUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUN2QyxRQUFRLE9BQU87QUFBQSxFQUNiLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFDZjtBQUNBLFFBQVEsUUFBUTtBQUFBLEVBQ2QsTUFBTTtBQUNSO0FBQ0EsUUFBUSxPQUFPO0FBRVIsTUFBTSxXQUFXLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDeEMsU0FBUyxPQUFPLENBQUM7QUFDakIsU0FBUyxRQUFRO0FBQUEsRUFDZixNQUFNO0FBQ1I7QUFDQSxTQUFTLE9BQU87QUFFVCxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUMzQyxZQUFZLE9BQU87QUFBQSxFQUNqQixhQUFhO0FBQ2Y7QUFDQSxZQUFZLFFBQVE7QUFBQSxFQUNsQixNQUFNO0FBQ1I7QUFDQSxZQUFZLE9BQU87IiwKICAibmFtZXMiOiBbXQp9Cg==
