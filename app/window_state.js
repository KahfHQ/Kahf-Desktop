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
var window_state_exports = {};
__export(window_state_exports, {
  markReadyForShutdown: () => markReadyForShutdown,
  markRequestedShutdown: () => markRequestedShutdown,
  markShouldQuit: () => markShouldQuit,
  readyForShutdown: () => readyForShutdown,
  requestedShutdown: () => requestedShutdown,
  shouldQuit: () => shouldQuit
});
module.exports = __toCommonJS(window_state_exports);
let shouldQuitFlag = false;
function markShouldQuit() {
  shouldQuitFlag = true;
}
function shouldQuit() {
  return shouldQuitFlag;
}
let isReadyForShutdown = false;
function markReadyForShutdown() {
  isReadyForShutdown = true;
}
function readyForShutdown() {
  return isReadyForShutdown;
}
let hasRequestedShutdown = false;
function markRequestedShutdown() {
  hasRequestedShutdown = true;
}
function requestedShutdown() {
  return hasRequestedShutdown;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  markReadyForShutdown,
  markRequestedShutdown,
  markShouldQuit,
  readyForShutdown,
  requestedShutdown,
  shouldQuit
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2luZG93X3N0YXRlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNy0yMDIwIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxubGV0IHNob3VsZFF1aXRGbGFnID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrU2hvdWxkUXVpdCgpOiB2b2lkIHtcbiAgc2hvdWxkUXVpdEZsYWcgPSB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkUXVpdCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIHNob3VsZFF1aXRGbGFnO1xufVxuXG5sZXQgaXNSZWFkeUZvclNodXRkb3duID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrUmVhZHlGb3JTaHV0ZG93bigpOiB2b2lkIHtcbiAgaXNSZWFkeUZvclNodXRkb3duID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWR5Rm9yU2h1dGRvd24oKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc1JlYWR5Rm9yU2h1dGRvd247XG59XG5cbmxldCBoYXNSZXF1ZXN0ZWRTaHV0ZG93biA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFya1JlcXVlc3RlZFNodXRkb3duKCk6IHZvaWQge1xuICBoYXNSZXF1ZXN0ZWRTaHV0ZG93biA9IHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0ZWRTaHV0ZG93bigpOiBib29sZWFuIHtcbiAgcmV0dXJuIGhhc1JlcXVlc3RlZFNodXRkb3duO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxJQUFJLGlCQUFpQjtBQUVkLDBCQUFnQztBQUNyQyxtQkFBaUI7QUFDbkI7QUFGZ0IsQUFJVCxzQkFBK0I7QUFDcEMsU0FBTztBQUNUO0FBRmdCLEFBSWhCLElBQUkscUJBQXFCO0FBRWxCLGdDQUFzQztBQUMzQyx1QkFBcUI7QUFDdkI7QUFGZ0IsQUFJVCw0QkFBcUM7QUFDMUMsU0FBTztBQUNUO0FBRmdCLEFBSWhCLElBQUksdUJBQXVCO0FBRXBCLGlDQUF1QztBQUM1Qyx5QkFBdUI7QUFDekI7QUFGZ0IsQUFJVCw2QkFBc0M7QUFDM0MsU0FBTztBQUNUO0FBRmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
