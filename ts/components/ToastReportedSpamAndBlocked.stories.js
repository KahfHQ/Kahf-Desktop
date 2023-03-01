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
var ToastReportedSpamAndBlocked_stories_exports = {};
__export(ToastReportedSpamAndBlocked_stories_exports, {
  _ToastReportedSpamAndBlocked: () => _ToastReportedSpamAndBlocked,
  default: () => ToastReportedSpamAndBlocked_stories_default
});
module.exports = __toCommonJS(ToastReportedSpamAndBlocked_stories_exports);
var import_react = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_ToastReportedSpamAndBlocked = require("./ToastReportedSpamAndBlocked");
var import_setupI18n = require("../util/setupI18n");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const defaultProps = {
  i18n,
  onClose: (0, import_addon_actions.action)("onClose")
};
var ToastReportedSpamAndBlocked_stories_default = {
  title: "Components/ToastReportedSpamAndBlocked"
};
const _ToastReportedSpamAndBlocked = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_ToastReportedSpamAndBlocked.ToastReportedSpamAndBlocked, {
  ...defaultProps
}), "_ToastReportedSpamAndBlocked");
_ToastReportedSpamAndBlocked.story = {
  name: "ToastReportedSpamAndBlocked"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _ToastReportedSpamAndBlocked
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVG9hc3RSZXBvcnRlZFNwYW1BbmRCbG9ja2VkLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnMnO1xuaW1wb3J0IHsgVG9hc3RSZXBvcnRlZFNwYW1BbmRCbG9ja2VkIH0gZnJvbSAnLi9Ub2FzdFJlcG9ydGVkU3BhbUFuZEJsb2NrZWQnO1xuXG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBpMThuLFxuICBvbkNsb3NlOiBhY3Rpb24oJ29uQ2xvc2UnKSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL1RvYXN0UmVwb3J0ZWRTcGFtQW5kQmxvY2tlZCcsXG59O1xuXG5leHBvcnQgY29uc3QgX1RvYXN0UmVwb3J0ZWRTcGFtQW5kQmxvY2tlZCA9ICgpOiBKU1guRWxlbWVudCA9PiAoXG4gIDxUb2FzdFJlcG9ydGVkU3BhbUFuZEJsb2NrZWQgey4uLmRlZmF1bHRQcm9wc30gLz5cbik7XG5cbl9Ub2FzdFJlcG9ydGVkU3BhbUFuZEJsb2NrZWQuc3RvcnkgPSB7XG4gIG5hbWU6ICdUb2FzdFJlcG9ydGVkU3BhbUFuZEJsb2NrZWQnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQjtBQUNsQiwyQkFBdUI7QUFDdkIseUNBQTRDO0FBRTVDLHVCQUEwQjtBQUMxQixzQkFBdUI7QUFFdkIsTUFBTSxPQUFPLGdDQUFVLE1BQU0sdUJBQVU7QUFFdkMsTUFBTSxlQUFlO0FBQUEsRUFDbkI7QUFBQSxFQUNBLFNBQVMsaUNBQU8sU0FBUztBQUMzQjtBQUVBLElBQU8sOENBQVE7QUFBQSxFQUNiLE9BQU87QUFDVDtBQUVPLE1BQU0sK0JBQStCLDZCQUMxQyxtREFBQztBQUFBLEtBQWdDO0FBQUEsQ0FBYyxHQURMO0FBSTVDLDZCQUE2QixRQUFRO0FBQUEsRUFDbkMsTUFBTTtBQUNSOyIsCiAgIm5hbWVzIjogW10KfQo=