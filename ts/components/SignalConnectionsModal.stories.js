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
var SignalConnectionsModal_stories_exports = {};
__export(SignalConnectionsModal_stories_exports, {
  Modal: () => Modal,
  default: () => SignalConnectionsModal_stories_default
});
module.exports = __toCommonJS(SignalConnectionsModal_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_SignalConnectionsModal = require("./SignalConnectionsModal");
var import_setupI18n = require("../util/setupI18n");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var SignalConnectionsModal_stories_default = {
  title: "Components/SignalConnectionsModal",
  component: import_SignalConnectionsModal.SignalConnectionsModal,
  argTypes: {
    i18n: {
      defaultValue: i18n
    },
    onClose: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_SignalConnectionsModal.SignalConnectionsModal, {
  ...args
}), "Template");
const Modal = Template.bind({});
Modal.args = {};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Modal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2lnbmFsQ29ubmVjdGlvbnNNb2RhbC5zdG9yaWVzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5IH0gZnJvbSAnQHN0b3J5Ym9vay9yZWFjdCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSB9IGZyb20gJy4vU2lnbmFsQ29ubmVjdGlvbnNNb2RhbCc7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcbmltcG9ydCB7IFNpZ25hbENvbm5lY3Rpb25zTW9kYWwgfSBmcm9tICcuL1NpZ25hbENvbm5lY3Rpb25zTW9kYWwnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdXRpbC9zZXR1cEkxOG4nO1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9TaWduYWxDb25uZWN0aW9uc01vZGFsJyxcbiAgY29tcG9uZW50OiBTaWduYWxDb25uZWN0aW9uc01vZGFsLFxuICBhcmdUeXBlczoge1xuICAgIGkxOG46IHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogaTE4bixcbiAgICB9LFxuICAgIG9uQ2xvc2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gIH0sXG59IGFzIE1ldGE7XG5cbmNvbnN0IFRlbXBsYXRlOiBTdG9yeTxQcm9wc1R5cGU+ID0gYXJncyA9PiA8U2lnbmFsQ29ubmVjdGlvbnNNb2RhbCB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBNb2RhbCA9IFRlbXBsYXRlLmJpbmQoe30pO1xuTW9kYWwuYXJncyA9IHt9O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBR2xCLHNCQUF1QjtBQUN2QixvQ0FBdUM7QUFDdkMsdUJBQTBCO0FBRTFCLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBRXZDLElBQU8seUNBQVE7QUFBQSxFQUNiLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNKLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsU0FBUyxFQUFFLFFBQVEsS0FBSztBQUFBLEVBQzFCO0FBQ0Y7QUFFQSxNQUFNLFdBQTZCLGlDQUFRLG1EQUFDO0FBQUEsS0FBMkI7QUFBQSxDQUFNLEdBQTFDO0FBRTVCLE1BQU0sUUFBUSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sT0FBTyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
