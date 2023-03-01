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
var About_exports = {};
__export(About_exports, {
  About: () => About
});
module.exports = __toCommonJS(About_exports);
var import_react = __toESM(require("react"));
var import_useEscapeHandling = require("../hooks/useEscapeHandling");
var import_useTheme = require("../hooks/useTheme");
var import_TitleBarContainer = require("./TitleBarContainer");
const About = /* @__PURE__ */ __name(({
  closeAbout,
  i18n,
  environment,
  version,
  hasCustomTitleBar,
  executeMenuRole
}) => {
  (0, import_useEscapeHandling.useEscapeHandling)(closeAbout);
  const theme = (0, import_useTheme.useTheme)();
  return /* @__PURE__ */ import_react.default.createElement(import_TitleBarContainer.TitleBarContainer, {
    hasCustomTitleBar,
    theme,
    executeMenuRole
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "About"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-splash-screen"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-splash-screen__logo module-img--150"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "version"
  }, version), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "environment"
  }, environment), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("a", {
    href: "https://signal.org"
  }, "signal.org")), /* @__PURE__ */ import_react.default.createElement("br", null), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("a", {
    className: "acknowledgments",
    href: "https://github.com/signalapp/Signal-Desktop/blob/main/ACKNOWLEDGMENTS.md"
  }, i18n("softwareAcknowledgments"))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("a", {
    className: "privacy",
    href: "https://signal.org/legal"
  }, i18n("privacyPolicy"))))));
}, "About");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  About
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQWJvdXQudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyB1c2VFc2NhcGVIYW5kbGluZyB9IGZyb20gJy4uL2hvb2tzL3VzZUVzY2FwZUhhbmRsaW5nJztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnLi4vaG9va3MvdXNlVGhlbWUnO1xuaW1wb3J0IHsgVGl0bGVCYXJDb250YWluZXIgfSBmcm9tICcuL1RpdGxlQmFyQ29udGFpbmVyJztcbmltcG9ydCB0eXBlIHsgRXhlY3V0ZU1lbnVSb2xlVHlwZSB9IGZyb20gJy4vVGl0bGVCYXJDb250YWluZXInO1xuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSB7XG4gIGNsb3NlQWJvdXQ6ICgpID0+IHVua25vd247XG4gIGVudmlyb25tZW50OiBzdHJpbmc7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIHZlcnNpb246IHN0cmluZztcbiAgaGFzQ3VzdG9tVGl0bGVCYXI6IGJvb2xlYW47XG4gIGV4ZWN1dGVNZW51Um9sZTogRXhlY3V0ZU1lbnVSb2xlVHlwZTtcbn07XG5cbmV4cG9ydCBjb25zdCBBYm91dCA9ICh7XG4gIGNsb3NlQWJvdXQsXG4gIGkxOG4sXG4gIGVudmlyb25tZW50LFxuICB2ZXJzaW9uLFxuICBoYXNDdXN0b21UaXRsZUJhcixcbiAgZXhlY3V0ZU1lbnVSb2xlLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICB1c2VFc2NhcGVIYW5kbGluZyhjbG9zZUFib3V0KTtcblxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8VGl0bGVCYXJDb250YWluZXJcbiAgICAgIGhhc0N1c3RvbVRpdGxlQmFyPXtoYXNDdXN0b21UaXRsZUJhcn1cbiAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQWJvdXRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtc3BsYXNoLXNjcmVlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLXNwbGFzaC1zY3JlZW5fX2xvZ28gbW9kdWxlLWltZy0tMTUwXCIgLz5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmVyc2lvblwiPnt2ZXJzaW9ufTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZW52aXJvbm1lbnRcIj57ZW52aXJvbm1lbnR9PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3NpZ25hbC5vcmdcIj5zaWduYWwub3JnPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxiciAvPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhY2tub3dsZWRnbWVudHNcIlxuICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3NpZ25hbGFwcC9TaWduYWwtRGVza3RvcC9ibG9iL21haW4vQUNLTk9XTEVER01FTlRTLm1kXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2kxOG4oJ3NvZnR3YXJlQWNrbm93bGVkZ21lbnRzJyl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cInByaXZhY3lcIiBocmVmPVwiaHR0cHM6Ly9zaWduYWwub3JnL2xlZ2FsXCI+XG4gICAgICAgICAgICAgIHtpMThuKCdwcml2YWN5UG9saWN5Jyl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9UaXRsZUJhckNvbnRhaW5lcj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBR2xCLCtCQUFrQztBQUNsQyxzQkFBeUI7QUFDekIsK0JBQWtDO0FBWTNCLE1BQU0sUUFBUSx3QkFBQztBQUFBLEVBQ3BCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxNQUM0QjtBQUM1QixrREFBa0IsVUFBVTtBQUU1QixRQUFNLFFBQVEsOEJBQVM7QUFFdkIsU0FDRSxtREFBQztBQUFBLElBQ0M7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEtBRUEsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEdBQTZDLEdBRTVELG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FBVyxPQUFRLEdBQ2xDLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FBZSxXQUFZLEdBQzFDLG1EQUFDLGFBQ0MsbURBQUM7QUFBQSxJQUFFLE1BQUs7QUFBQSxLQUFxQixZQUFVLENBQ3pDLEdBQ0EsbURBQUMsVUFBRyxHQUNKLG1EQUFDLGFBQ0MsbURBQUM7QUFBQSxJQUNDLFdBQVU7QUFBQSxJQUNWLE1BQUs7QUFBQSxLQUVKLEtBQUsseUJBQXlCLENBQ2pDLENBQ0YsR0FDQSxtREFBQyxhQUNDLG1EQUFDO0FBQUEsSUFBRSxXQUFVO0FBQUEsSUFBVSxNQUFLO0FBQUEsS0FDekIsS0FBSyxlQUFlLENBQ3ZCLENBQ0YsQ0FDRixDQUNGLENBQ0Y7QUFFSixHQTdDcUI7IiwKICAibmFtZXMiOiBbXQp9Cg==
