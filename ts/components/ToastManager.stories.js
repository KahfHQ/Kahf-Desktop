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
var ToastManager_stories_exports = {};
__export(ToastManager_stories_exports, {
  InvalidToast: () => InvalidToast,
  MessageBodyTooLong: () => MessageBodyTooLong,
  StoryReact: () => StoryReact,
  StoryReply: () => StoryReply,
  UndefinedToast: () => UndefinedToast,
  default: () => ToastManager_stories_default
});
module.exports = __toCommonJS(ToastManager_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_ToastManager = require("./ToastManager");
var import_toast = require("../state/ducks/toast");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var ToastManager_stories_default = {
  title: "Components/ToastManager",
  component: import_ToastManager.ToastManager,
  argTypes: {
    hideToast: { action: true },
    i18n: {
      defaultValue: i18n
    },
    toastType: {
      defaultValue: void 0
    }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_ToastManager.ToastManager, {
  ...args
}), "Template");
const UndefinedToast = Template.bind({});
UndefinedToast.args = {};
const InvalidToast = Template.bind({});
InvalidToast.args = {
  toastType: "this is a toast that does not exist"
};
const StoryReact = Template.bind({});
StoryReact.args = {
  toastType: import_toast.ToastType.StoryReact
};
const StoryReply = Template.bind({});
StoryReply.args = {
  toastType: import_toast.ToastType.StoryReply
};
const MessageBodyTooLong = Template.bind({});
MessageBodyTooLong.args = {
  toastType: import_toast.ToastType.MessageBodyTooLong
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InvalidToast,
  MessageBodyTooLong,
  StoryReact,
  StoryReply,
  UndefinedToast
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVG9hc3RNYW5hZ2VyLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnkgfSBmcm9tICdAc3Rvcnlib29rL3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi9Ub2FzdE1hbmFnZXInO1xuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tICcuL1RvYXN0TWFuYWdlcic7XG5pbXBvcnQgeyBUb2FzdFR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy90b2FzdCc7XG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL1RvYXN0TWFuYWdlcicsXG4gIGNvbXBvbmVudDogVG9hc3RNYW5hZ2VyLFxuICBhcmdUeXBlczoge1xuICAgIGhpZGVUb2FzdDogeyBhY3Rpb246IHRydWUgfSxcbiAgICBpMThuOiB7XG4gICAgICBkZWZhdWx0VmFsdWU6IGkxOG4sXG4gICAgfSxcbiAgICB0b2FzdFR5cGU6IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8VG9hc3RNYW5hZ2VyIHsuLi5hcmdzfSAvPjtcblxuZXhwb3J0IGNvbnN0IFVuZGVmaW5lZFRvYXN0ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5VbmRlZmluZWRUb2FzdC5hcmdzID0ge307XG5cbmV4cG9ydCBjb25zdCBJbnZhbGlkVG9hc3QgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkludmFsaWRUb2FzdC5hcmdzID0ge1xuICB0b2FzdFR5cGU6ICd0aGlzIGlzIGEgdG9hc3QgdGhhdCBkb2VzIG5vdCBleGlzdCcgYXMgVG9hc3RUeXBlLFxufTtcblxuZXhwb3J0IGNvbnN0IFN0b3J5UmVhY3QgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcblN0b3J5UmVhY3QuYXJncyA9IHtcbiAgdG9hc3RUeXBlOiBUb2FzdFR5cGUuU3RvcnlSZWFjdCxcbn07XG5cbmV4cG9ydCBjb25zdCBTdG9yeVJlcGx5ID0gVGVtcGxhdGUuYmluZCh7fSk7XG5TdG9yeVJlcGx5LmFyZ3MgPSB7XG4gIHRvYXN0VHlwZTogVG9hc3RUeXBlLlN0b3J5UmVwbHksXG59O1xuXG5leHBvcnQgY29uc3QgTWVzc2FnZUJvZHlUb29Mb25nID0gVGVtcGxhdGUuYmluZCh7fSk7XG5NZXNzYWdlQm9keVRvb0xvbmcuYXJncyA9IHtcbiAgdG9hc3RUeXBlOiBUb2FzdFR5cGUuTWVzc2FnZUJvZHlUb29Mb25nLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBR2xCLHNCQUF1QjtBQUN2QiwwQkFBNkI7QUFDN0IsbUJBQTBCO0FBQzFCLHVCQUEwQjtBQUUxQixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxJQUFPLCtCQUFRO0FBQUEsRUFDYixPQUFPO0FBQUEsRUFDUCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsSUFDUixXQUFXLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDMUIsTUFBTTtBQUFBLE1BQ0osY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRLG1EQUFDO0FBQUEsS0FBaUI7QUFBQSxDQUFNLEdBQWhDO0FBRTVCLE1BQU0saUJBQWlCLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDOUMsZUFBZSxPQUFPLENBQUM7QUFFaEIsTUFBTSxlQUFlLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDNUMsYUFBYSxPQUFPO0FBQUEsRUFDbEIsV0FBVztBQUNiO0FBRU8sTUFBTSxhQUFhLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFDMUMsV0FBVyxPQUFPO0FBQUEsRUFDaEIsV0FBVyx1QkFBVTtBQUN2QjtBQUVPLE1BQU0sYUFBYSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFdBQVcsT0FBTztBQUFBLEVBQ2hCLFdBQVcsdUJBQVU7QUFDdkI7QUFFTyxNQUFNLHFCQUFxQixTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ2xELG1CQUFtQixPQUFPO0FBQUEsRUFDeEIsV0FBVyx1QkFBVTtBQUN2QjsiLAogICJuYW1lcyI6IFtdCn0K
