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
var DebugLogWindow_stories_exports = {};
__export(DebugLogWindow_stories_exports, {
  _DebugLogWindow: () => _DebugLogWindow,
  default: () => DebugLogWindow_stories_default
});
module.exports = __toCommonJS(DebugLogWindow_stories_exports);
var import_react = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_DebugLogWindow = require("./DebugLogWindow");
var import_setupI18n = require("../util/setupI18n");
var import_sleep = require("../util/sleep");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const createProps = /* @__PURE__ */ __name(() => ({
  closeWindow: (0, import_addon_actions.action)("closeWindow"),
  downloadLog: (0, import_addon_actions.action)("downloadLog"),
  i18n,
  fetchLogs: () => {
    (0, import_addon_actions.action)("fetchLogs")();
    return Promise.resolve("Sample logs");
  },
  uploadLogs: async (logs) => {
    (0, import_addon_actions.action)("uploadLogs")(logs);
    await (0, import_sleep.sleep)(5e3);
    return "https://picsum.photos/1800/900";
  },
  executeMenuRole: (0, import_addon_actions.action)("executeMenuRole"),
  hasCustomTitleBar: true
}), "createProps");
var DebugLogWindow_stories_default = {
  title: "Components/DebugLogWindow"
};
const _DebugLogWindow = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_DebugLogWindow.DebugLogWindow, {
  ...createProps()
}), "_DebugLogWindow");
_DebugLogWindow.story = {
  name: "DebugLogWindow"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _DebugLogWindow
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRGVidWdMb2dXaW5kb3cuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24tYWN0aW9ucyc7XG5cbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHR5cGUgeyBQcm9wc1R5cGUgfSBmcm9tICcuL0RlYnVnTG9nV2luZG93JztcbmltcG9ydCB7IERlYnVnTG9nV2luZG93IH0gZnJvbSAnLi9EZWJ1Z0xvZ1dpbmRvdyc7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4uL3V0aWwvc2xlZXAnO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5jb25zdCBjcmVhdGVQcm9wcyA9ICgpOiBQcm9wc1R5cGUgPT4gKHtcbiAgY2xvc2VXaW5kb3c6IGFjdGlvbignY2xvc2VXaW5kb3cnKSxcbiAgZG93bmxvYWRMb2c6IGFjdGlvbignZG93bmxvYWRMb2cnKSxcbiAgaTE4bixcbiAgZmV0Y2hMb2dzOiAoKSA9PiB7XG4gICAgYWN0aW9uKCdmZXRjaExvZ3MnKSgpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoJ1NhbXBsZSBsb2dzJyk7XG4gIH0sXG4gIHVwbG9hZExvZ3M6IGFzeW5jIChsb2dzOiBzdHJpbmcpID0+IHtcbiAgICBhY3Rpb24oJ3VwbG9hZExvZ3MnKShsb2dzKTtcbiAgICBhd2FpdCBzbGVlcCg1MDAwKTtcbiAgICByZXR1cm4gJ2h0dHBzOi8vcGljc3VtLnBob3Rvcy8xODAwLzkwMCc7XG4gIH0sXG4gIGV4ZWN1dGVNZW51Um9sZTogYWN0aW9uKCdleGVjdXRlTWVudVJvbGUnKSxcbiAgaGFzQ3VzdG9tVGl0bGVCYXI6IHRydWUsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvRGVidWdMb2dXaW5kb3cnLFxufTtcblxuZXhwb3J0IGNvbnN0IF9EZWJ1Z0xvZ1dpbmRvdyA9ICgpOiBKU1guRWxlbWVudCA9PiAoXG4gIDxEZWJ1Z0xvZ1dpbmRvdyB7Li4uY3JlYXRlUHJvcHMoKX0gLz5cbik7XG5cbl9EZWJ1Z0xvZ1dpbmRvdy5zdG9yeSA9IHtcbiAgbmFtZTogJ0RlYnVnTG9nV2luZG93Jyxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBa0I7QUFDbEIsMkJBQXVCO0FBRXZCLHNCQUF1QjtBQUV2Qiw0QkFBK0I7QUFDL0IsdUJBQTBCO0FBQzFCLG1CQUFzQjtBQUV0QixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxNQUFNLGNBQWMsNkJBQWtCO0FBQUEsRUFDcEMsYUFBYSxpQ0FBTyxhQUFhO0FBQUEsRUFDakMsYUFBYSxpQ0FBTyxhQUFhO0FBQUEsRUFDakM7QUFBQSxFQUNBLFdBQVcsTUFBTTtBQUNmLHFDQUFPLFdBQVcsRUFBRTtBQUNwQixXQUFPLFFBQVEsUUFBUSxhQUFhO0FBQUEsRUFDdEM7QUFBQSxFQUNBLFlBQVksT0FBTyxTQUFpQjtBQUNsQyxxQ0FBTyxZQUFZLEVBQUUsSUFBSTtBQUN6QixVQUFNLHdCQUFNLEdBQUk7QUFDaEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLGlCQUFpQixpQ0FBTyxpQkFBaUI7QUFBQSxFQUN6QyxtQkFBbUI7QUFDckIsSUFmb0I7QUFpQnBCLElBQU8saUNBQVE7QUFBQSxFQUNiLE9BQU87QUFDVDtBQUVPLE1BQU0sa0JBQWtCLDZCQUM3QixtREFBQztBQUFBLEtBQW1CLFlBQVk7QUFBQSxDQUFHLEdBRE47QUFJL0IsZ0JBQWdCLFFBQVE7QUFBQSxFQUN0QixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
