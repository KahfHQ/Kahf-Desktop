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
var app_exports = {};
__export(app_exports, {
  App: () => App
});
module.exports = __toCommonJS(app_exports);
var React = __toESM(require("react"));
var import_react_router_dom = require("react-router-dom");
var import_DropStage = require("./stages/DropStage");
var import_EmojiStage = require("./stages/EmojiStage");
var import_UploadStage = require("./stages/UploadStage");
var import_MetaStage = require("./stages/MetaStage");
var import_ShareStage = require("./stages/ShareStage");
var styles = __toESM(require("./index.scss"));
var import_PageHeader = require("../elements/PageHeader");
var import_i18n = require("../util/i18n");
var import_TitleBarContainer = require("../../ts/components/TitleBarContainer");
var import_useTheme = require("../../ts/hooks/useTheme");
const App = /* @__PURE__ */ __name(({
  executeMenuRole,
  hasCustomTitleBar
}) => {
  const i18n = (0, import_i18n.useI18n)();
  const theme = (0, import_useTheme.useTheme)();
  return /* @__PURE__ */ React.createElement(import_TitleBarContainer.TitleBarContainer, {
    iconSrc: "../../images/icon_32.png",
    hasCustomTitleBar,
    theme,
    executeMenuRole
  }, /* @__PURE__ */ React.createElement("div", {
    className: styles.container
  }, /* @__PURE__ */ React.createElement(import_PageHeader.PageHeader, null, i18n("StickerCreator--title")), /* @__PURE__ */ React.createElement(import_react_router_dom.Switch, null, /* @__PURE__ */ React.createElement(import_react_router_dom.Route, {
    path: "/drop"
  }, /* @__PURE__ */ React.createElement(import_DropStage.DropStage, null)), /* @__PURE__ */ React.createElement(import_react_router_dom.Route, {
    path: "/add-emojis"
  }, /* @__PURE__ */ React.createElement(import_EmojiStage.EmojiStage, null)), /* @__PURE__ */ React.createElement(import_react_router_dom.Route, {
    path: "/add-meta"
  }, /* @__PURE__ */ React.createElement(import_MetaStage.MetaStage, null)), /* @__PURE__ */ React.createElement(import_react_router_dom.Route, {
    path: "/upload"
  }, /* @__PURE__ */ React.createElement(import_UploadStage.UploadStage, null)), /* @__PURE__ */ React.createElement(import_react_router_dom.Route, {
    path: "/share"
  }, /* @__PURE__ */ React.createElement(import_ShareStage.ShareStage, null)), /* @__PURE__ */ React.createElement(import_react_router_dom.Redirect, {
    to: "/drop"
  }))));
}, "App");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5kZXgudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIwIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUmVkaXJlY3QsIFJvdXRlLCBTd2l0Y2ggfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IERyb3BTdGFnZSB9IGZyb20gJy4vc3RhZ2VzL0Ryb3BTdGFnZSc7XG5pbXBvcnQgeyBFbW9qaVN0YWdlIH0gZnJvbSAnLi9zdGFnZXMvRW1vamlTdGFnZSc7XG5pbXBvcnQgeyBVcGxvYWRTdGFnZSB9IGZyb20gJy4vc3RhZ2VzL1VwbG9hZFN0YWdlJztcbmltcG9ydCB7IE1ldGFTdGFnZSB9IGZyb20gJy4vc3RhZ2VzL01ldGFTdGFnZSc7XG5pbXBvcnQgeyBTaGFyZVN0YWdlIH0gZnJvbSAnLi9zdGFnZXMvU2hhcmVTdGFnZSc7XG5pbXBvcnQgKiBhcyBzdHlsZXMgZnJvbSAnLi9pbmRleC5zY3NzJztcbmltcG9ydCB7IFBhZ2VIZWFkZXIgfSBmcm9tICcuLi9lbGVtZW50cy9QYWdlSGVhZGVyJztcbmltcG9ydCB7IHVzZUkxOG4gfSBmcm9tICcuLi91dGlsL2kxOG4nO1xuaW1wb3J0IHsgVGl0bGVCYXJDb250YWluZXIgfSBmcm9tICcuLi8uLi90cy9jb21wb25lbnRzL1RpdGxlQmFyQ29udGFpbmVyJztcbmltcG9ydCB0eXBlIHsgRXhlY3V0ZU1lbnVSb2xlVHlwZSB9IGZyb20gJy4uLy4uL3RzL2NvbXBvbmVudHMvVGl0bGVCYXJDb250YWluZXInO1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICcuLi8uLi90cy9ob29rcy91c2VUaGVtZSc7XG5cbmV4cG9ydCB0eXBlIEFwcFByb3BzVHlwZSA9IFJlYWRvbmx5PHtcbiAgZXhlY3V0ZU1lbnVSb2xlOiBFeGVjdXRlTWVudVJvbGVUeXBlO1xuICBoYXNDdXN0b21UaXRsZUJhcjogYm9vbGVhbjtcbn0+O1xuXG5leHBvcnQgY29uc3QgQXBwID0gKHtcbiAgZXhlY3V0ZU1lbnVSb2xlLFxuICBoYXNDdXN0b21UaXRsZUJhcixcbn06IEFwcFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgaTE4biA9IHVzZUkxOG4oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFRpdGxlQmFyQ29udGFpbmVyXG4gICAgICBpY29uU3JjPVwiLi4vLi4vaW1hZ2VzL2ljb25fMzIucG5nXCJcbiAgICAgIGhhc0N1c3RvbVRpdGxlQmFyPXtoYXNDdXN0b21UaXRsZUJhcn1cbiAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cbiAgICAgICAgPFBhZ2VIZWFkZXI+e2kxOG4oJ1N0aWNrZXJDcmVhdG9yLS10aXRsZScpfTwvUGFnZUhlYWRlcj5cbiAgICAgICAgPFN3aXRjaD5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9kcm9wXCI+XG4gICAgICAgICAgICA8RHJvcFN0YWdlIC8+XG4gICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9hZGQtZW1vamlzXCI+XG4gICAgICAgICAgICA8RW1vamlTdGFnZSAvPlxuICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvYWRkLW1ldGFcIj5cbiAgICAgICAgICAgIDxNZXRhU3RhZ2UgLz5cbiAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VwbG9hZFwiPlxuICAgICAgICAgICAgPFVwbG9hZFN0YWdlIC8+XG4gICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9zaGFyZVwiPlxuICAgICAgICAgICAgPFNoYXJlU3RhZ2UgLz5cbiAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgIDxSZWRpcmVjdCB0bz1cIi9kcm9wXCIgLz5cbiAgICAgICAgPC9Td2l0Y2g+XG4gICAgICA8L2Rpdj5cbiAgICA8L1RpdGxlQmFyQ29udGFpbmVyPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxZQUF1QjtBQUN2Qiw4QkFBd0M7QUFDeEMsdUJBQTBCO0FBQzFCLHdCQUEyQjtBQUMzQix5QkFBNEI7QUFDNUIsdUJBQTBCO0FBQzFCLHdCQUEyQjtBQUMzQixhQUF3QjtBQUN4Qix3QkFBMkI7QUFDM0Isa0JBQXdCO0FBQ3hCLCtCQUFrQztBQUVsQyxzQkFBeUI7QUFPbEIsTUFBTSxNQUFNLHdCQUFDO0FBQUEsRUFDbEI7QUFBQSxFQUNBO0FBQUEsTUFDK0I7QUFDL0IsUUFBTSxPQUFPLHlCQUFRO0FBQ3JCLFFBQU0sUUFBUSw4QkFBUztBQUV2QixTQUNFLG9DQUFDO0FBQUEsSUFDQyxTQUFRO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsS0FFQSxvQ0FBQztBQUFBLElBQUksV0FBVyxPQUFPO0FBQUEsS0FDckIsb0NBQUMsb0NBQVksS0FBSyx1QkFBdUIsQ0FBRSxHQUMzQyxvQ0FBQyxzQ0FDQyxvQ0FBQztBQUFBLElBQU0sTUFBSztBQUFBLEtBQ1Ysb0NBQUMsZ0NBQVUsQ0FDYixHQUNBLG9DQUFDO0FBQUEsSUFBTSxNQUFLO0FBQUEsS0FDVixvQ0FBQyxrQ0FBVyxDQUNkLEdBQ0Esb0NBQUM7QUFBQSxJQUFNLE1BQUs7QUFBQSxLQUNWLG9DQUFDLGdDQUFVLENBQ2IsR0FDQSxvQ0FBQztBQUFBLElBQU0sTUFBSztBQUFBLEtBQ1Ysb0NBQUMsb0NBQVksQ0FDZixHQUNBLG9DQUFDO0FBQUEsSUFBTSxNQUFLO0FBQUEsS0FDVixvQ0FBQyxrQ0FBVyxDQUNkLEdBQ0Esb0NBQUM7QUFBQSxJQUFTLElBQUc7QUFBQSxHQUFRLENBQ3ZCLENBQ0YsQ0FDRjtBQUVKLEdBckNtQjsiLAogICJuYW1lcyI6IFtdCn0K
