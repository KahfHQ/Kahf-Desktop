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
var OS_exports = {};
__export(OS_exports, {
  hasCustomTitleBar: () => hasCustomTitleBar,
  isLinux: () => isLinux,
  isMacOS: () => isMacOS,
  isWindows: () => isWindows
});
module.exports = __toCommonJS(OS_exports);
var import_is = __toESM(require("@sindresorhus/is"));
var import_os = __toESM(require("os"));
var import_semver = __toESM(require("semver"));
const isMacOS = /* @__PURE__ */ __name(() => process.platform === "darwin", "isMacOS");
const isLinux = /* @__PURE__ */ __name(() => process.platform === "linux", "isLinux");
const isWindows = /* @__PURE__ */ __name((minVersion) => {
  const osRelease = import_os.default.release();
  if (process.platform !== "win32") {
    return false;
  }
  return import_is.default.undefined(minVersion) ? true : import_semver.default.gte(osRelease, minVersion);
}, "isWindows");
const hasCustomTitleBar = /* @__PURE__ */ __name(() => isWindows("10.0.0") || Boolean(process.env.CUSTOM_TITLEBAR), "hasCustomTitleBar");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasCustomTitleBar,
  isLinux,
  isMacOS,
  isWindows
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiT1MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE4LTIwMjAgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgaXMgZnJvbSAnQHNpbmRyZXNvcmh1cy9pcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG5leHBvcnQgY29uc3QgaXNNYWNPUyA9ICgpOiBib29sZWFuID0+IHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nO1xuZXhwb3J0IGNvbnN0IGlzTGludXggPSAoKTogYm9vbGVhbiA9PiBwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnO1xuZXhwb3J0IGNvbnN0IGlzV2luZG93cyA9IChtaW5WZXJzaW9uPzogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IG9zUmVsZWFzZSA9IG9zLnJlbGVhc2UoKTtcblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBpcy51bmRlZmluZWQobWluVmVyc2lvbikgPyB0cnVlIDogc2VtdmVyLmd0ZShvc1JlbGVhc2UsIG1pblZlcnNpb24pO1xufTtcblxuLy8gV2luZG93cyAxMCBhbmQgYWJvdmVcbmV4cG9ydCBjb25zdCBoYXNDdXN0b21UaXRsZUJhciA9ICgpOiBib29sZWFuID0+XG4gIGlzV2luZG93cygnMTAuMC4wJykgfHwgQm9vbGVhbihwcm9jZXNzLmVudi5DVVNUT01fVElUTEVCQVIpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLGdCQUFlO0FBQ2YsZ0JBQWU7QUFDZixvQkFBbUI7QUFFWixNQUFNLFVBQVUsNkJBQWUsUUFBUSxhQUFhLFVBQXBDO0FBQ2hCLE1BQU0sVUFBVSw2QkFBZSxRQUFRLGFBQWEsU0FBcEM7QUFDaEIsTUFBTSxZQUFZLHdCQUFDLGVBQWlDO0FBQ3pELFFBQU0sWUFBWSxrQkFBRyxRQUFRO0FBRTdCLE1BQUksUUFBUSxhQUFhLFNBQVM7QUFDaEMsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPLGtCQUFHLFVBQVUsVUFBVSxJQUFJLE9BQU8sc0JBQU8sSUFBSSxXQUFXLFVBQVU7QUFDM0UsR0FSeUI7QUFXbEIsTUFBTSxvQkFBb0IsNkJBQy9CLFVBQVUsUUFBUSxLQUFLLFFBQVEsUUFBUSxJQUFJLGVBQWUsR0FEM0I7IiwKICAibmFtZXMiOiBbXQp9Cg==
