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
var useIsWindowActive_exports = {};
__export(useIsWindowActive_exports, {
  useIsWindowActive: () => useIsWindowActive
});
module.exports = __toCommonJS(useIsWindowActive_exports);
var import_react = require("react");
function useIsWindowActive() {
  const { activeWindowService } = window.SignalContext;
  const [isActive, setIsActive] = (0, import_react.useState)(activeWindowService.isActive());
  (0, import_react.useEffect)(() => {
    const update = /* @__PURE__ */ __name((newIsActive) => {
      setIsActive(newIsActive);
    }, "update");
    activeWindowService.registerForChange(update);
    return () => {
      activeWindowService.unregisterForChange(update);
    };
  }, [activeWindowService]);
  return isActive;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsWindowActive
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXNlSXNXaW5kb3dBY3RpdmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUlzV2luZG93QWN0aXZlKCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IGFjdGl2ZVdpbmRvd1NlcnZpY2UgfSA9IHdpbmRvdy5TaWduYWxDb250ZXh0O1xuICBjb25zdCBbaXNBY3RpdmUsIHNldElzQWN0aXZlXSA9IHVzZVN0YXRlKGFjdGl2ZVdpbmRvd1NlcnZpY2UuaXNBY3RpdmUoKSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB1cGRhdGUgPSAobmV3SXNBY3RpdmU6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgIHNldElzQWN0aXZlKG5ld0lzQWN0aXZlKTtcbiAgICB9O1xuXG4gICAgYWN0aXZlV2luZG93U2VydmljZS5yZWdpc3RlckZvckNoYW5nZSh1cGRhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGFjdGl2ZVdpbmRvd1NlcnZpY2UudW5yZWdpc3RlckZvckNoYW5nZSh1cGRhdGUpO1xuICAgIH07XG4gIH0sIFthY3RpdmVXaW5kb3dTZXJ2aWNlXSk7XG5cbiAgcmV0dXJuIGlzQWN0aXZlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFvQztBQUU3Qiw2QkFBc0M7QUFDM0MsUUFBTSxFQUFFLHdCQUF3QixPQUFPO0FBQ3ZDLFFBQU0sQ0FBQyxVQUFVLGVBQWUsMkJBQVMsb0JBQW9CLFNBQVMsQ0FBQztBQUV2RSw4QkFBVSxNQUFNO0FBQ2QsVUFBTSxTQUFTLHdCQUFDLGdCQUErQjtBQUM3QyxrQkFBWSxXQUFXO0FBQUEsSUFDekIsR0FGZTtBQUlmLHdCQUFvQixrQkFBa0IsTUFBTTtBQUU1QyxXQUFPLE1BQU07QUFDWCwwQkFBb0Isb0JBQW9CLE1BQU07QUFBQSxJQUNoRDtBQUFBLEVBQ0YsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0FBRXhCLFNBQU87QUFDVDtBQWpCZ0IiLAogICJuYW1lcyI6IFtdCn0K
