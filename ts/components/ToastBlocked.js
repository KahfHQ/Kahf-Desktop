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
var ToastBlocked_exports = {};
__export(ToastBlocked_exports, {
  ToastBlocked: () => ToastBlocked
});
module.exports = __toCommonJS(ToastBlocked_exports);
var import_react = __toESM(require("react"));
var import_Toast = require("./Toast");
const ToastBlocked = /* @__PURE__ */ __name(({ i18n, onClose }) => {
  return /* @__PURE__ */ import_react.default.createElement(import_Toast.Toast, {
    onClose
  }, i18n("unblockToSend"));
}, "ToastBlocked");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastBlocked
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVG9hc3RCbG9ja2VkLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBUb2FzdCB9IGZyb20gJy4vVG9hc3QnO1xuXG50eXBlIFByb3BzVHlwZSA9IHtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjb25zdCBUb2FzdEJsb2NrZWQgPSAoeyBpMThuLCBvbkNsb3NlIH06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgcmV0dXJuIDxUb2FzdCBvbkNsb3NlPXtvbkNsb3NlfT57aTE4bigndW5ibG9ja1RvU2VuZCcpfTwvVG9hc3Q+O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBa0I7QUFFbEIsbUJBQXNCO0FBT2YsTUFBTSxlQUFlLHdCQUFDLEVBQUUsTUFBTSxjQUFzQztBQUN6RSxTQUFPLG1EQUFDO0FBQUEsSUFBTTtBQUFBLEtBQW1CLEtBQUssZUFBZSxDQUFFO0FBQ3pELEdBRjRCOyIsCiAgIm5hbWVzIjogW10KfQo=
