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
var ToastDangerousFileType_stories_exports = {};
__export(ToastDangerousFileType_stories_exports, {
  _ToastDangerousFileType: () => _ToastDangerousFileType,
  default: () => ToastDangerousFileType_stories_default
});
module.exports = __toCommonJS(ToastDangerousFileType_stories_exports);
var import_react = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_ToastDangerousFileType = require("./ToastDangerousFileType");
var import_setupI18n = require("../util/setupI18n");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const defaultProps = {
  i18n,
  onClose: (0, import_addon_actions.action)("onClose")
};
var ToastDangerousFileType_stories_default = {
  title: "Components/ToastDangerousFileType"
};
const _ToastDangerousFileType = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_ToastDangerousFileType.ToastDangerousFileType, {
  ...defaultProps
}), "_ToastDangerousFileType");
_ToastDangerousFileType.story = {
  name: "ToastDangerousFileType"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _ToastDangerousFileType
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVG9hc3REYW5nZXJvdXNGaWxlVHlwZS5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYWN0aW9uIH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi1hY3Rpb25zJztcbmltcG9ydCB7IFRvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUgfSBmcm9tICcuL1RvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUnO1xuXG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBpMThuLFxuICBvbkNsb3NlOiBhY3Rpb24oJ29uQ2xvc2UnKSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL1RvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUnLFxufTtcblxuZXhwb3J0IGNvbnN0IF9Ub2FzdERhbmdlcm91c0ZpbGVUeXBlID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPFRvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUgey4uLmRlZmF1bHRQcm9wc30gLz5cbik7XG5cbl9Ub2FzdERhbmdlcm91c0ZpbGVUeXBlLnN0b3J5ID0ge1xuICBuYW1lOiAnVG9hc3REYW5nZXJvdXNGaWxlVHlwZScsXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLDJCQUF1QjtBQUN2QixvQ0FBdUM7QUFFdkMsdUJBQTBCO0FBQzFCLHNCQUF1QjtBQUV2QixNQUFNLE9BQU8sZ0NBQVUsTUFBTSx1QkFBVTtBQUV2QyxNQUFNLGVBQWU7QUFBQSxFQUNuQjtBQUFBLEVBQ0EsU0FBUyxpQ0FBTyxTQUFTO0FBQzNCO0FBRUEsSUFBTyx5Q0FBUTtBQUFBLEVBQ2IsT0FBTztBQUNUO0FBRU8sTUFBTSwwQkFBMEIsNkJBQ3JDLG1EQUFDO0FBQUEsS0FBMkI7QUFBQSxDQUFjLEdBREw7QUFJdkMsd0JBQXdCLFFBQVE7QUFBQSxFQUM5QixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
