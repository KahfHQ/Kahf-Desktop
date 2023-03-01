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
var SignalConnectionsModal_exports = {};
__export(SignalConnectionsModal_exports, {
  SignalConnectionsModal: () => SignalConnectionsModal
});
module.exports = __toCommonJS(SignalConnectionsModal_exports);
var import_react = __toESM(require("react"));
var import_Button = require("./Button");
var import_Intl = require("./Intl");
var import_Modal = require("./Modal");
const SignalConnectionsModal = /* @__PURE__ */ __name(({
  i18n,
  onClose
}) => {
  return /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
    hasXButton: true,
    i18n,
    onClose
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "SignalConnectionsModal"
  }, /* @__PURE__ */ import_react.default.createElement("i", {
    className: "SignalConnectionsModal__icon"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "SignalConnectionsModal__description"
  }, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    components: {
      connections: /* @__PURE__ */ import_react.default.createElement("strong", null, i18n("SignalConnectionsModal__title"))
    },
    i18n,
    id: "SignalConnectionsModal__header"
  })), /* @__PURE__ */ import_react.default.createElement("ul", {
    className: "SignalConnectionsModal__list"
  }, /* @__PURE__ */ import_react.default.createElement("li", null, i18n("SignalConnectionsModal__bullet--1")), /* @__PURE__ */ import_react.default.createElement("li", null, i18n("SignalConnectionsModal__bullet--2")), /* @__PURE__ */ import_react.default.createElement("li", null, i18n("SignalConnectionsModal__bullet--3"))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "SignalConnectionsModal__description"
  }, i18n("SignalConnectionsModal__footer")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "SignalConnectionsModal__button"
  }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    onClick: onClose,
    variant: import_Button.ButtonVariant.Primary
  }, i18n("Confirmation--confirm")))));
}, "SignalConnectionsModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SignalConnectionsModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2lnbmFsQ29ubmVjdGlvbnNNb2RhbC50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuL0J1dHRvbic7XG5pbXBvcnQgeyBJbnRsIH0gZnJvbSAnLi9JbnRsJztcbmltcG9ydCB7IE1vZGFsIH0gZnJvbSAnLi9Nb2RhbCc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjb25zdCBTaWduYWxDb25uZWN0aW9uc01vZGFsID0gKHtcbiAgaTE4bixcbiAgb25DbG9zZSxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgcmV0dXJuIChcbiAgICA8TW9kYWwgaGFzWEJ1dHRvbiBpMThuPXtpMThufSBvbkNsb3NlPXtvbkNsb3NlfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU2lnbmFsQ29ubmVjdGlvbnNNb2RhbFwiPlxuICAgICAgICA8aSBjbGFzc05hbWU9XCJTaWduYWxDb25uZWN0aW9uc01vZGFsX19pY29uXCIgLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgPEludGxcbiAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgY29ubmVjdGlvbnM6IChcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntpMThuKCdTaWduYWxDb25uZWN0aW9uc01vZGFsX190aXRsZScpfTwvc3Ryb25nPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpZD1cIlNpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2hlYWRlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cIlNpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2xpc3RcIj5cbiAgICAgICAgICA8bGk+e2kxOG4oJ1NpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2J1bGxldC0tMScpfTwvbGk+XG4gICAgICAgICAgPGxpPntpMThuKCdTaWduYWxDb25uZWN0aW9uc01vZGFsX19idWxsZXQtLTInKX08L2xpPlxuICAgICAgICAgIDxsaT57aTE4bignU2lnbmFsQ29ubmVjdGlvbnNNb2RhbF9fYnVsbGV0LS0zJyl9PC9saT5cbiAgICAgICAgPC91bD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2kxOG4oJ1NpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2Zvb3RlcicpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNpZ25hbENvbm5lY3Rpb25zTW9kYWxfX2J1dHRvblwiPlxuICAgICAgICAgIDxCdXR0b24gb25DbGljaz17b25DbG9zZX0gdmFyaWFudD17QnV0dG9uVmFyaWFudC5QcmltYXJ5fT5cbiAgICAgICAgICAgIHtpMThuKCdDb25maXJtYXRpb24tLWNvbmZpcm0nKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L01vZGFsPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBa0I7QUFHbEIsb0JBQXNDO0FBQ3RDLGtCQUFxQjtBQUNyQixtQkFBc0I7QUFPZixNQUFNLHlCQUF5Qix3QkFBQztBQUFBLEVBQ3JDO0FBQUEsRUFDQTtBQUFBLE1BQzRCO0FBQzVCLFNBQ0UsbURBQUM7QUFBQSxJQUFNLFlBQVU7QUFBQSxJQUFDO0FBQUEsSUFBWTtBQUFBLEtBQzVCLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQUUsV0FBVTtBQUFBLEdBQStCLEdBRTVDLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQ0MsWUFBWTtBQUFBLE1BQ1YsYUFDRSxtREFBQyxnQkFBUSxLQUFLLCtCQUErQixDQUFFO0FBQUEsSUFFbkQ7QUFBQSxJQUNBO0FBQUEsSUFDQSxJQUFHO0FBQUEsR0FDTCxDQUNGLEdBRUEsbURBQUM7QUFBQSxJQUFHLFdBQVU7QUFBQSxLQUNaLG1EQUFDLFlBQUksS0FBSyxtQ0FBbUMsQ0FBRSxHQUMvQyxtREFBQyxZQUFJLEtBQUssbUNBQW1DLENBQUUsR0FDL0MsbURBQUMsWUFBSSxLQUFLLG1DQUFtQyxDQUFFLENBQ2pELEdBRUEsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNaLEtBQUssZ0NBQWdDLENBQ3hDLEdBRUEsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsSUFBTyxTQUFTO0FBQUEsSUFBUyxTQUFTLDRCQUFjO0FBQUEsS0FDOUMsS0FBSyx1QkFBdUIsQ0FDL0IsQ0FDRixDQUNGLENBQ0Y7QUFFSixHQXZDc0M7IiwKICAibmFtZXMiOiBbXQp9Cg==
