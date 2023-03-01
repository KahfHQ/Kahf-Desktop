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
var ToastManager_exports = {};
__export(ToastManager_exports, {
  ToastManager: () => ToastManager
});
module.exports = __toCommonJS(ToastManager_exports);
var import_react = __toESM(require("react"));
var import_durations = require("../util/durations");
var import_Toast = require("./Toast");
var import_ToastMessageBodyTooLong = require("./ToastMessageBodyTooLong");
var import_toast = require("../state/ducks/toast");
var import_assert = require("../util/assert");
const ToastManager = /* @__PURE__ */ __name(({
  hideToast,
  i18n,
  toastType
}) => {
  if (toastType === import_toast.ToastType.Error) {
    return /* @__PURE__ */ import_react.default.createElement(import_Toast.Toast, {
      autoDismissDisabled: true,
      onClose: hideToast,
      toastAction: {
        label: i18n("Toast--error--action"),
        onClick: () => window.showDebugLog()
      }
    }, i18n("Toast--error"));
  }
  if (toastType === import_toast.ToastType.MessageBodyTooLong) {
    return /* @__PURE__ */ import_react.default.createElement(import_ToastMessageBodyTooLong.ToastMessageBodyTooLong, {
      i18n,
      onClose: hideToast
    });
  }
  if (toastType === import_toast.ToastType.StoryReact) {
    return /* @__PURE__ */ import_react.default.createElement(import_Toast.Toast, {
      onClose: hideToast,
      timeout: 3 * import_durations.SECOND
    }, i18n("Stories__toast--sending-reaction"));
  }
  if (toastType === import_toast.ToastType.StoryReply) {
    return /* @__PURE__ */ import_react.default.createElement(import_Toast.Toast, {
      onClose: hideToast,
      timeout: 3 * import_durations.SECOND
    }, i18n("Stories__toast--sending-reply"));
  }
  if (toastType === import_toast.ToastType.StoryMuted) {
    return /* @__PURE__ */ import_react.default.createElement(import_Toast.Toast, {
      onClose: hideToast,
      timeout: 3 * import_durations.SECOND
    }, i18n("Stories__toast--hasNoSound"));
  }
  (0, import_assert.strictAssert)(toastType === void 0, `Unhandled toast of type: ${toastType}`);
  return null;
}, "ToastManager");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastManager
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVG9hc3RNYW5hZ2VyLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBTRUNPTkQgfSBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBUb2FzdCB9IGZyb20gJy4vVG9hc3QnO1xuaW1wb3J0IHsgVG9hc3RNZXNzYWdlQm9keVRvb0xvbmcgfSBmcm9tICcuL1RvYXN0TWVzc2FnZUJvZHlUb29Mb25nJztcbmltcG9ydCB7IFRvYXN0VHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL3RvYXN0JztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBoaWRlVG9hc3Q6ICgpID0+IHVua25vd247XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIHRvYXN0VHlwZT86IFRvYXN0VHlwZTtcbn07XG5cbmV4cG9ydCBjb25zdCBUb2FzdE1hbmFnZXIgPSAoe1xuICBoaWRlVG9hc3QsXG4gIGkxOG4sXG4gIHRvYXN0VHlwZSxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50IHwgbnVsbCA9PiB7XG4gIGlmICh0b2FzdFR5cGUgPT09IFRvYXN0VHlwZS5FcnJvcikge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgYXV0b0Rpc21pc3NEaXNhYmxlZFxuICAgICAgICBvbkNsb3NlPXtoaWRlVG9hc3R9XG4gICAgICAgIHRvYXN0QWN0aW9uPXt7XG4gICAgICAgICAgbGFiZWw6IGkxOG4oJ1RvYXN0LS1lcnJvci0tYWN0aW9uJyksXG4gICAgICAgICAgb25DbGljazogKCkgPT4gd2luZG93LnNob3dEZWJ1Z0xvZygpLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7aTE4bignVG9hc3QtLWVycm9yJyl9XG4gICAgICA8L1RvYXN0PlxuICAgICk7XG4gIH1cblxuICBpZiAodG9hc3RUeXBlID09PSBUb2FzdFR5cGUuTWVzc2FnZUJvZHlUb29Mb25nKSB7XG4gICAgcmV0dXJuIDxUb2FzdE1lc3NhZ2VCb2R5VG9vTG9uZyBpMThuPXtpMThufSBvbkNsb3NlPXtoaWRlVG9hc3R9IC8+O1xuICB9XG5cbiAgaWYgKHRvYXN0VHlwZSA9PT0gVG9hc3RUeXBlLlN0b3J5UmVhY3QpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0IG9uQ2xvc2U9e2hpZGVUb2FzdH0gdGltZW91dD17MyAqIFNFQ09ORH0+XG4gICAgICAgIHtpMThuKCdTdG9yaWVzX190b2FzdC0tc2VuZGluZy1yZWFjdGlvbicpfVxuICAgICAgPC9Ub2FzdD5cbiAgICApO1xuICB9XG5cbiAgaWYgKHRvYXN0VHlwZSA9PT0gVG9hc3RUeXBlLlN0b3J5UmVwbHkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0IG9uQ2xvc2U9e2hpZGVUb2FzdH0gdGltZW91dD17MyAqIFNFQ09ORH0+XG4gICAgICAgIHtpMThuKCdTdG9yaWVzX190b2FzdC0tc2VuZGluZy1yZXBseScpfVxuICAgICAgPC9Ub2FzdD5cbiAgICApO1xuICB9XG5cbiAgaWYgKHRvYXN0VHlwZSA9PT0gVG9hc3RUeXBlLlN0b3J5TXV0ZWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0IG9uQ2xvc2U9e2hpZGVUb2FzdH0gdGltZW91dD17MyAqIFNFQ09ORH0+XG4gICAgICAgIHtpMThuKCdTdG9yaWVzX190b2FzdC0taGFzTm9Tb3VuZCcpfVxuICAgICAgPC9Ub2FzdD5cbiAgICApO1xuICB9XG5cbiAgc3RyaWN0QXNzZXJ0KFxuICAgIHRvYXN0VHlwZSA9PT0gdW5kZWZpbmVkLFxuICAgIGBVbmhhbmRsZWQgdG9hc3Qgb2YgdHlwZTogJHt0b2FzdFR5cGV9YFxuICApO1xuXG4gIHJldHVybiBudWxsO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBa0I7QUFFbEIsdUJBQXVCO0FBQ3ZCLG1CQUFzQjtBQUN0QixxQ0FBd0M7QUFDeEMsbUJBQTBCO0FBQzFCLG9CQUE2QjtBQVF0QixNQUFNLGVBQWUsd0JBQUM7QUFBQSxFQUMzQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDbUM7QUFDbkMsTUFBSSxjQUFjLHVCQUFVLE9BQU87QUFDakMsV0FDRSxtREFBQztBQUFBLE1BQ0MscUJBQW1CO0FBQUEsTUFDbkIsU0FBUztBQUFBLE1BQ1QsYUFBYTtBQUFBLFFBQ1gsT0FBTyxLQUFLLHNCQUFzQjtBQUFBLFFBQ2xDLFNBQVMsTUFBTSxPQUFPLGFBQWE7QUFBQSxNQUNyQztBQUFBLE9BRUMsS0FBSyxjQUFjLENBQ3RCO0FBQUEsRUFFSjtBQUVBLE1BQUksY0FBYyx1QkFBVSxvQkFBb0I7QUFDOUMsV0FBTyxtREFBQztBQUFBLE1BQXdCO0FBQUEsTUFBWSxTQUFTO0FBQUEsS0FBVztBQUFBLEVBQ2xFO0FBRUEsTUFBSSxjQUFjLHVCQUFVLFlBQVk7QUFDdEMsV0FDRSxtREFBQztBQUFBLE1BQU0sU0FBUztBQUFBLE1BQVcsU0FBUyxJQUFJO0FBQUEsT0FDckMsS0FBSyxrQ0FBa0MsQ0FDMUM7QUFBQSxFQUVKO0FBRUEsTUFBSSxjQUFjLHVCQUFVLFlBQVk7QUFDdEMsV0FDRSxtREFBQztBQUFBLE1BQU0sU0FBUztBQUFBLE1BQVcsU0FBUyxJQUFJO0FBQUEsT0FDckMsS0FBSywrQkFBK0IsQ0FDdkM7QUFBQSxFQUVKO0FBRUEsTUFBSSxjQUFjLHVCQUFVLFlBQVk7QUFDdEMsV0FDRSxtREFBQztBQUFBLE1BQU0sU0FBUztBQUFBLE1BQVcsU0FBUyxJQUFJO0FBQUEsT0FDckMsS0FBSyw0QkFBNEIsQ0FDcEM7QUFBQSxFQUVKO0FBRUEsa0NBQ0UsY0FBYyxRQUNkLDRCQUE0QixXQUM5QjtBQUVBLFNBQU87QUFDVCxHQXRENEI7IiwKICAibmFtZXMiOiBbXQp9Cg==
