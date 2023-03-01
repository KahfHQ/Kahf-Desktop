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
var MyStories_stories_exports = {};
__export(MyStories_stories_exports, {
  MultiListStories: () => MultiListStories,
  NoStories: () => NoStories,
  SingleListStories: () => SingleListStories,
  default: () => MyStories_stories_default
});
module.exports = __toCommonJS(MyStories_stories_exports);
var import_react = __toESM(require("react"));
var import_jest = require("@storybook/jest");
var import_uuid = require("uuid");
var import_testing_library = require("@storybook/testing-library");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_Stories = require("../types/Stories");
var import_MyStories = require("./MyStories");
var import_getDefaultConversation = require("../test-both/helpers/getDefaultConversation");
var import_getFakeStory = require("../test-both/helpers/getFakeStory");
var import_setupI18n = require("../util/setupI18n");
var import_sleep = require("../util/sleep");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var MyStories_stories_default = {
  title: "Components/MyStories",
  component: import_MyStories.MyStories,
  argTypes: {
    i18n: {
      defaultValue: i18n
    },
    onBack: {
      action: true
    },
    onDelete: {
      action: true
    },
    onForward: {
      action: true
    },
    onSave: {
      action: true
    },
    ourConversationId: {
      defaultValue: (0, import_getDefaultConversation.getDefaultConversation)().id
    },
    queueStoryDownload: {
      action: true
    },
    renderStoryViewer: {
      action: true
    },
    viewStory: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_MyStories.MyStories, {
  ...args
}), "Template");
const NoStories = Template.bind({});
NoStories.args = {
  myStories: []
};
NoStories.story = {
  name: "No Stories"
};
const interactionTest = /* @__PURE__ */ __name(async ({
  args,
  canvasElement
}) => {
  const canvas = (0, import_testing_library.within)(canvasElement);
  const [btnDownload] = canvas.getAllByLabelText("Download story");
  await import_testing_library.userEvent.click(btnDownload);
  await (0, import_jest.expect)(args.onSave).toHaveBeenCalled();
  const [btnBack] = canvas.getAllByLabelText("Back");
  await import_testing_library.userEvent.click(btnBack);
  await (0, import_jest.expect)(args.onBack).toHaveBeenCalled();
  const [btnCtxMenu] = canvas.getAllByLabelText("Context menu");
  await import_testing_library.userEvent.click(btnCtxMenu);
  await (0, import_sleep.sleep)(300);
  const [btnFwd] = canvas.getAllByLabelText("Forward");
  await import_testing_library.userEvent.click(btnFwd);
  await (0, import_jest.expect)(args.onForward).toHaveBeenCalled();
}, "interactionTest");
const SingleListStories = Template.bind({});
SingleListStories.args = {
  myStories: [(0, import_getFakeStory.getFakeMyStory)(import_Stories.MY_STORIES_ID)]
};
SingleListStories.play = interactionTest;
SingleListStories.story = {
  name: "One distribution list"
};
const MultiListStories = Template.bind({});
MultiListStories.args = {
  myStories: [
    (0, import_getFakeStory.getFakeMyStory)(import_Stories.MY_STORIES_ID),
    (0, import_getFakeStory.getFakeMyStory)((0, import_uuid.v4)(), "Cool Peeps"),
    (0, import_getFakeStory.getFakeMyStory)((0, import_uuid.v4)(), "Family")
  ]
};
MultiListStories.play = interactionTest;
MultiListStories.story = {
  name: "Multiple distribution lists"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultiListStories,
  NoStories,
  SingleListStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTXlTdG9yaWVzLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgUmVhY3RGcmFtZXdvcmssIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgdHlwZSB7IFBsYXlGdW5jdGlvbiB9IGZyb20gJ0BzdG9yeWJvb2svY3NmJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdAc3Rvcnlib29rL2plc3QnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgd2l0aGluLCB1c2VyRXZlbnQgfSBmcm9tICdAc3Rvcnlib29rL3Rlc3RpbmctbGlicmFyeSc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9NeVN0b3JpZXMnO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBNWV9TVE9SSUVTX0lEIH0gZnJvbSAnLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBNeVN0b3JpZXMgfSBmcm9tICcuL015U3Rvcmllcyc7XG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRGYWtlTXlTdG9yeSB9IGZyb20gJy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldEZha2VTdG9yeSc7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4uL3V0aWwvc2xlZXAnO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9NeVN0b3JpZXMnLFxuICBjb21wb25lbnQ6IE15U3RvcmllcyxcbiAgYXJnVHlwZXM6IHtcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICBvbkJhY2s6IHtcbiAgICAgIGFjdGlvbjogdHJ1ZSxcbiAgICB9LFxuICAgIG9uRGVsZXRlOiB7XG4gICAgICBhY3Rpb246IHRydWUsXG4gICAgfSxcbiAgICBvbkZvcndhcmQ6IHtcbiAgICAgIGFjdGlvbjogdHJ1ZSxcbiAgICB9LFxuICAgIG9uU2F2ZToge1xuICAgICAgYWN0aW9uOiB0cnVlLFxuICAgIH0sXG4gICAgb3VyQ29udmVyc2F0aW9uSWQ6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogZ2V0RGVmYXVsdENvbnZlcnNhdGlvbigpLmlkLFxuICAgIH0sXG4gICAgcXVldWVTdG9yeURvd25sb2FkOiB7XG4gICAgICBhY3Rpb246IHRydWUsXG4gICAgfSxcbiAgICByZW5kZXJTdG9yeVZpZXdlcjoge1xuICAgICAgYWN0aW9uOiB0cnVlLFxuICAgIH0sXG4gICAgdmlld1N0b3J5OiB7IGFjdGlvbjogdHJ1ZSB9LFxuICB9LFxufSBhcyBNZXRhO1xuXG5jb25zdCBUZW1wbGF0ZTogU3Rvcnk8UHJvcHNUeXBlPiA9IGFyZ3MgPT4gPE15U3RvcmllcyB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBOb1N0b3JpZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk5vU3Rvcmllcy5hcmdzID0ge1xuICBteVN0b3JpZXM6IFtdLFxufTtcbk5vU3Rvcmllcy5zdG9yeSA9IHtcbiAgbmFtZTogJ05vIFN0b3JpZXMnLFxufTtcblxuY29uc3QgaW50ZXJhY3Rpb25UZXN0OiBQbGF5RnVuY3Rpb248UmVhY3RGcmFtZXdvcmssIFByb3BzVHlwZT4gPSBhc3luYyAoe1xuICBhcmdzLFxuICBjYW52YXNFbGVtZW50LFxufSkgPT4ge1xuICBjb25zdCBjYW52YXMgPSB3aXRoaW4oY2FudmFzRWxlbWVudCk7XG4gIGNvbnN0IFtidG5Eb3dubG9hZF0gPSBjYW52YXMuZ2V0QWxsQnlMYWJlbFRleHQoJ0Rvd25sb2FkIHN0b3J5Jyk7XG4gIGF3YWl0IHVzZXJFdmVudC5jbGljayhidG5Eb3dubG9hZCk7XG4gIGF3YWl0IGV4cGVjdChhcmdzLm9uU2F2ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIGNvbnN0IFtidG5CYWNrXSA9IGNhbnZhcy5nZXRBbGxCeUxhYmVsVGV4dCgnQmFjaycpO1xuICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soYnRuQmFjayk7XG4gIGF3YWl0IGV4cGVjdChhcmdzLm9uQmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIGNvbnN0IFtidG5DdHhNZW51XSA9IGNhbnZhcy5nZXRBbGxCeUxhYmVsVGV4dCgnQ29udGV4dCBtZW51Jyk7XG5cbiAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGJ0bkN0eE1lbnUpO1xuICBhd2FpdCBzbGVlcCgzMDApO1xuICBjb25zdCBbYnRuRndkXSA9IGNhbnZhcy5nZXRBbGxCeUxhYmVsVGV4dCgnRm9yd2FyZCcpO1xuICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soYnRuRndkKTtcbiAgYXdhaXQgZXhwZWN0KGFyZ3Mub25Gb3J3YXJkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG59O1xuXG5leHBvcnQgY29uc3QgU2luZ2xlTGlzdFN0b3JpZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblNpbmdsZUxpc3RTdG9yaWVzLmFyZ3MgPSB7XG4gIG15U3RvcmllczogW2dldEZha2VNeVN0b3J5KE1ZX1NUT1JJRVNfSUQpXSxcbn07XG5TaW5nbGVMaXN0U3Rvcmllcy5wbGF5ID0gaW50ZXJhY3Rpb25UZXN0O1xuU2luZ2xlTGlzdFN0b3JpZXMuc3RvcnkgPSB7XG4gIG5hbWU6ICdPbmUgZGlzdHJpYnV0aW9uIGxpc3QnLFxufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpTGlzdFN0b3JpZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbk11bHRpTGlzdFN0b3JpZXMuYXJncyA9IHtcbiAgbXlTdG9yaWVzOiBbXG4gICAgZ2V0RmFrZU15U3RvcnkoTVlfU1RPUklFU19JRCksXG4gICAgZ2V0RmFrZU15U3RvcnkodXVpZCgpLCAnQ29vbCBQZWVwcycpLFxuICAgIGdldEZha2VNeVN0b3J5KHV1aWQoKSwgJ0ZhbWlseScpLFxuICBdLFxufTtcbk11bHRpTGlzdFN0b3JpZXMucGxheSA9IGludGVyYWN0aW9uVGVzdDtcbk11bHRpTGlzdFN0b3JpZXMuc3RvcnkgPSB7XG4gIG5hbWU6ICdNdWx0aXBsZSBkaXN0cmlidXRpb24gbGlzdHMnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxtQkFBa0I7QUFDbEIsa0JBQXVCO0FBQ3ZCLGtCQUEyQjtBQUMzQiw2QkFBa0M7QUFHbEMsc0JBQXVCO0FBQ3ZCLHFCQUE4QjtBQUM5Qix1QkFBMEI7QUFDMUIsb0NBQXVDO0FBQ3ZDLDBCQUErQjtBQUMvQix1QkFBMEI7QUFDMUIsbUJBQXNCO0FBRXRCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8sNEJBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLE1BQ2pCLGNBQWMsMERBQXVCLEVBQUU7QUFBQSxJQUN6QztBQUFBLElBQ0Esb0JBQW9CO0FBQUEsTUFDbEIsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLE1BQ2pCLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxXQUFXLEVBQUUsUUFBUSxLQUFLO0FBQUEsRUFDNUI7QUFDRjtBQUVBLE1BQU0sV0FBNkIsaUNBQVEsbURBQUM7QUFBQSxLQUFjO0FBQUEsQ0FBTSxHQUE3QjtBQUU1QixNQUFNLFlBQVksU0FBUyxLQUFLLENBQUMsQ0FBQztBQUN6QyxVQUFVLE9BQU87QUFBQSxFQUNmLFdBQVcsQ0FBQztBQUNkO0FBQ0EsVUFBVSxRQUFRO0FBQUEsRUFDaEIsTUFBTTtBQUNSO0FBRUEsTUFBTSxrQkFBMkQsOEJBQU87QUFBQSxFQUN0RTtBQUFBLEVBQ0E7QUFBQSxNQUNJO0FBQ0osUUFBTSxTQUFTLG1DQUFPLGFBQWE7QUFDbkMsUUFBTSxDQUFDLGVBQWUsT0FBTyxrQkFBa0IsZ0JBQWdCO0FBQy9ELFFBQU0saUNBQVUsTUFBTSxXQUFXO0FBQ2pDLFFBQU0sd0JBQU8sS0FBSyxNQUFNLEVBQUUsaUJBQWlCO0FBRTNDLFFBQU0sQ0FBQyxXQUFXLE9BQU8sa0JBQWtCLE1BQU07QUFDakQsUUFBTSxpQ0FBVSxNQUFNLE9BQU87QUFDN0IsUUFBTSx3QkFBTyxLQUFLLE1BQU0sRUFBRSxpQkFBaUI7QUFFM0MsUUFBTSxDQUFDLGNBQWMsT0FBTyxrQkFBa0IsY0FBYztBQUU1RCxRQUFNLGlDQUFVLE1BQU0sVUFBVTtBQUNoQyxRQUFNLHdCQUFNLEdBQUc7QUFDZixRQUFNLENBQUMsVUFBVSxPQUFPLGtCQUFrQixTQUFTO0FBQ25ELFFBQU0saUNBQVUsTUFBTSxNQUFNO0FBQzVCLFFBQU0sd0JBQU8sS0FBSyxTQUFTLEVBQUUsaUJBQWlCO0FBQ2hELEdBcEJpRTtBQXNCMUQsTUFBTSxvQkFBb0IsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNqRCxrQkFBa0IsT0FBTztBQUFBLEVBQ3ZCLFdBQVcsQ0FBQyx3Q0FBZSw0QkFBYSxDQUFDO0FBQzNDO0FBQ0Esa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLFFBQVE7QUFBQSxFQUN4QixNQUFNO0FBQ1I7QUFFTyxNQUFNLG1CQUFtQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFpQixPQUFPO0FBQUEsRUFDdEIsV0FBVztBQUFBLElBQ1Qsd0NBQWUsNEJBQWE7QUFBQSxJQUM1Qix3Q0FBZSxvQkFBSyxHQUFHLFlBQVk7QUFBQSxJQUNuQyx3Q0FBZSxvQkFBSyxHQUFHLFFBQVE7QUFBQSxFQUNqQztBQUNGO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLFFBQVE7QUFBQSxFQUN2QixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
