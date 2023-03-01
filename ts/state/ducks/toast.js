var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var toast_exports = {};
__export(toast_exports, {
  ToastType: () => ToastType,
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer,
  useToastActions: () => useToastActions
});
module.exports = __toCommonJS(toast_exports);
var import_useBoundActions = require("../../hooks/useBoundActions");
var ToastType = /* @__PURE__ */ ((ToastType2) => {
  ToastType2["Error"] = "Error";
  ToastType2["MessageBodyTooLong"] = "MessageBodyTooLong";
  ToastType2["StoryMuted"] = "StoryMuted";
  ToastType2["StoryReact"] = "StoryReact";
  ToastType2["StoryReply"] = "StoryReply";
  return ToastType2;
})(ToastType || {});
const HIDE_TOAST = "toast/HIDE_TOAST";
const SHOW_TOAST = "toast/SHOW_TOAST";
function hideToast() {
  return {
    type: HIDE_TOAST
  };
}
const showToast = /* @__PURE__ */ __name((toastType) => {
  return {
    type: SHOW_TOAST,
    payload: toastType
  };
}, "showToast");
const actions = {
  hideToast,
  showToast
};
const useToastActions = /* @__PURE__ */ __name(() => (0, import_useBoundActions.useBoundActions)(actions), "useToastActions");
function getEmptyState() {
  return {};
}
function reducer(state = getEmptyState(), action) {
  if (action.type === HIDE_TOAST) {
    return {
      ...state,
      toastType: void 0
    };
  }
  if (action.type === SHOW_TOAST) {
    return {
      ...state,
      toastType: action.payload
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastType,
  actions,
  getEmptyState,
  reducer,
  useToastActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidG9hc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgdXNlQm91bmRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlQm91bmRBY3Rpb25zJztcblxuZXhwb3J0IGVudW0gVG9hc3RUeXBlIHtcbiAgRXJyb3IgPSAnRXJyb3InLFxuICBNZXNzYWdlQm9keVRvb0xvbmcgPSAnTWVzc2FnZUJvZHlUb29Mb25nJyxcbiAgU3RvcnlNdXRlZCA9ICdTdG9yeU11dGVkJyxcbiAgU3RvcnlSZWFjdCA9ICdTdG9yeVJlYWN0JyxcbiAgU3RvcnlSZXBseSA9ICdTdG9yeVJlcGx5Jyxcbn1cblxuLy8gU3RhdGVcblxuZXhwb3J0IHR5cGUgVG9hc3RTdGF0ZVR5cGUgPSB7XG4gIHRvYXN0VHlwZT86IFRvYXN0VHlwZTtcbn07XG5cbi8vIEFjdGlvbnNcblxuY29uc3QgSElERV9UT0FTVCA9ICd0b2FzdC9ISURFX1RPQVNUJztcbmNvbnN0IFNIT1dfVE9BU1QgPSAndG9hc3QvU0hPV19UT0FTVCc7XG5cbnR5cGUgSGlkZVRvYXN0QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIEhJREVfVE9BU1Q7XG59O1xuXG50eXBlIFNob3dUb2FzdEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBTSE9XX1RPQVNUO1xuICBwYXlsb2FkOiBUb2FzdFR5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBUb2FzdEFjdGlvblR5cGUgPSBIaWRlVG9hc3RBY3Rpb25UeXBlIHwgU2hvd1RvYXN0QWN0aW9uVHlwZTtcblxuLy8gQWN0aW9uIENyZWF0b3JzXG5cbmZ1bmN0aW9uIGhpZGVUb2FzdCgpOiBIaWRlVG9hc3RBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBISURFX1RPQVNULFxuICB9O1xufVxuXG5leHBvcnQgdHlwZSBTaG93VG9hc3RBY3Rpb25DcmVhdG9yVHlwZSA9IChcbiAgdG9hc3RUeXBlOiBUb2FzdFR5cGVcbikgPT4gU2hvd1RvYXN0QWN0aW9uVHlwZTtcblxuY29uc3Qgc2hvd1RvYXN0OiBTaG93VG9hc3RBY3Rpb25DcmVhdG9yVHlwZSA9IHRvYXN0VHlwZSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU0hPV19UT0FTVCxcbiAgICBwYXlsb2FkOiB0b2FzdFR5cGUsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWN0aW9ucyA9IHtcbiAgaGlkZVRvYXN0LFxuICBzaG93VG9hc3QsXG59O1xuXG5leHBvcnQgY29uc3QgdXNlVG9hc3RBY3Rpb25zID0gKCk6IHR5cGVvZiBhY3Rpb25zID0+IHVzZUJvdW5kQWN0aW9ucyhhY3Rpb25zKTtcblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBUb2FzdFN0YXRlVHlwZSB7XG4gIHJldHVybiB7fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoXG4gIHN0YXRlOiBSZWFkb25seTxUb2FzdFN0YXRlVHlwZT4gPSBnZXRFbXB0eVN0YXRlKCksXG4gIGFjdGlvbjogUmVhZG9ubHk8VG9hc3RBY3Rpb25UeXBlPlxuKTogVG9hc3RTdGF0ZVR5cGUge1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IEhJREVfVE9BU1QpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICB0b2FzdFR5cGU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTSE9XX1RPQVNUKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdG9hc3RUeXBlOiBhY3Rpb24ucGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsNkJBQWdDO0FBRXpCLElBQUssWUFBTCxrQkFBSyxlQUFMO0FBQ0wsd0JBQVE7QUFDUixxQ0FBcUI7QUFDckIsNkJBQWE7QUFDYiw2QkFBYTtBQUNiLDZCQUFhO0FBTEg7QUFBQTtBQWdCWixNQUFNLGFBQWE7QUFDbkIsTUFBTSxhQUFhO0FBZW5CLHFCQUEwQztBQUN4QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsRUFDUjtBQUNGO0FBSlMsQUFVVCxNQUFNLFlBQXdDLHNDQUFhO0FBQ3pELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxFQUNYO0FBQ0YsR0FMOEM7QUFPdkMsTUFBTSxVQUFVO0FBQUEsRUFDckI7QUFBQSxFQUNBO0FBQ0Y7QUFFTyxNQUFNLGtCQUFrQiw2QkFBc0IsNENBQWdCLE9BQU8sR0FBN0M7QUFJeEIseUJBQXlDO0FBQzlDLFNBQU8sQ0FBQztBQUNWO0FBRmdCLEFBSVQsaUJBQ0wsUUFBa0MsY0FBYyxHQUNoRCxRQUNnQjtBQUNoQixNQUFJLE9BQU8sU0FBUyxZQUFZO0FBQzlCLFdBQU87QUFBQSxTQUNGO0FBQUEsTUFDSCxXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFFQSxNQUFJLE9BQU8sU0FBUyxZQUFZO0FBQzlCLFdBQU87QUFBQSxTQUNGO0FBQUEsTUFDSCxXQUFXLE9BQU87QUFBQSxJQUNwQjtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQ1Q7QUFuQmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
