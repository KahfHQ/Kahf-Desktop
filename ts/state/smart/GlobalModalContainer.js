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
var GlobalModalContainer_exports = {};
__export(GlobalModalContainer_exports, {
  SmartGlobalModalContainer: () => SmartGlobalModalContainer
});
module.exports = __toCommonJS(GlobalModalContainer_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_actions = require("../actions");
var import_GlobalModalContainer = require("../../components/GlobalModalContainer");
var import_ContactModal = require("./ContactModal");
var import_ForwardMessageModal = require("./ForwardMessageModal");
var import_ProfileEditorModal = require("./ProfileEditorModal");
var import_SafetyNumberModal = require("./SafetyNumberModal");
var import_StoriesSettingsModal = require("./StoriesSettingsModal");
var import_user = require("../selectors/user");
function renderProfileEditor() {
  return /* @__PURE__ */ import_react.default.createElement(import_ProfileEditorModal.SmartProfileEditorModal, null);
}
function renderContactModal() {
  return /* @__PURE__ */ import_react.default.createElement(import_ContactModal.SmartContactModal, null);
}
function renderForwardMessageModal() {
  return /* @__PURE__ */ import_react.default.createElement(import_ForwardMessageModal.SmartForwardMessageModal, null);
}
function renderStoriesSettings() {
  return /* @__PURE__ */ import_react.default.createElement(import_StoriesSettingsModal.SmartStoriesSettingsModal, null);
}
const mapStateToProps = /* @__PURE__ */ __name((state) => {
  const i18n = (0, import_user.getIntl)(state);
  return {
    ...state.globalModals,
    i18n,
    renderContactModal,
    renderForwardMessageModal,
    renderProfileEditor,
    renderStoriesSettings,
    renderSafetyNumber: () => /* @__PURE__ */ import_react.default.createElement(import_SafetyNumberModal.SmartSafetyNumberModal, {
      contactID: String(state.globalModals.safetyNumberModalContactId)
    })
  };
}, "mapStateToProps");
const smart = (0, import_react_redux.connect)(mapStateToProps, import_actions.mapDispatchToProps);
const SmartGlobalModalContainer = smart(import_GlobalModalContainer.GlobalModalContainer);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartGlobalModalContainer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiR2xvYmFsTW9kYWxDb250YWluZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgbWFwRGlzcGF0Y2hUb1Byb3BzIH0gZnJvbSAnLi4vYWN0aW9ucyc7XG5pbXBvcnQgeyBHbG9iYWxNb2RhbENvbnRhaW5lciB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvR2xvYmFsTW9kYWxDb250YWluZXInO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB7IFNtYXJ0Q29udGFjdE1vZGFsIH0gZnJvbSAnLi9Db250YWN0TW9kYWwnO1xuaW1wb3J0IHsgU21hcnRGb3J3YXJkTWVzc2FnZU1vZGFsIH0gZnJvbSAnLi9Gb3J3YXJkTWVzc2FnZU1vZGFsJztcbmltcG9ydCB7IFNtYXJ0UHJvZmlsZUVkaXRvck1vZGFsIH0gZnJvbSAnLi9Qcm9maWxlRWRpdG9yTW9kYWwnO1xuaW1wb3J0IHsgU21hcnRTYWZldHlOdW1iZXJNb2RhbCB9IGZyb20gJy4vU2FmZXR5TnVtYmVyTW9kYWwnO1xuaW1wb3J0IHsgU21hcnRTdG9yaWVzU2V0dGluZ3NNb2RhbCB9IGZyb20gJy4vU3Rvcmllc1NldHRpbmdzTW9kYWwnO1xuXG5pbXBvcnQgeyBnZXRJbnRsIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuXG5mdW5jdGlvbiByZW5kZXJQcm9maWxlRWRpdG9yKCk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIDxTbWFydFByb2ZpbGVFZGl0b3JNb2RhbCAvPjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29udGFjdE1vZGFsKCk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIDxTbWFydENvbnRhY3RNb2RhbCAvPjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRm9yd2FyZE1lc3NhZ2VNb2RhbCgpOiBKU1guRWxlbWVudCB7XG4gIHJldHVybiA8U21hcnRGb3J3YXJkTWVzc2FnZU1vZGFsIC8+O1xufVxuXG5mdW5jdGlvbiByZW5kZXJTdG9yaWVzU2V0dGluZ3MoKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gPFNtYXJ0U3Rvcmllc1NldHRpbmdzTW9kYWwgLz47XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZTogU3RhdGVUeXBlKSA9PiB7XG4gIGNvbnN0IGkxOG4gPSBnZXRJbnRsKHN0YXRlKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLmdsb2JhbE1vZGFscyxcbiAgICBpMThuLFxuICAgIHJlbmRlckNvbnRhY3RNb2RhbCxcbiAgICByZW5kZXJGb3J3YXJkTWVzc2FnZU1vZGFsLFxuICAgIHJlbmRlclByb2ZpbGVFZGl0b3IsXG4gICAgcmVuZGVyU3Rvcmllc1NldHRpbmdzLFxuICAgIHJlbmRlclNhZmV0eU51bWJlcjogKCkgPT4gKFxuICAgICAgPFNtYXJ0U2FmZXR5TnVtYmVyTW9kYWxcbiAgICAgICAgY29udGFjdElEPXtTdHJpbmcoc3RhdGUuZ2xvYmFsTW9kYWxzLnNhZmV0eU51bWJlck1vZGFsQ29udGFjdElkKX1cbiAgICAgIC8+XG4gICAgKSxcbiAgfTtcbn07XG5cbmNvbnN0IHNtYXJ0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcyk7XG5cbmV4cG9ydCBjb25zdCBTbWFydEdsb2JhbE1vZGFsQ29udGFpbmVyID0gc21hcnQoR2xvYmFsTW9kYWxDb250YWluZXIpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQjtBQUNsQix5QkFBd0I7QUFDeEIscUJBQW1DO0FBQ25DLGtDQUFxQztBQUVyQywwQkFBa0M7QUFDbEMsaUNBQXlDO0FBQ3pDLGdDQUF3QztBQUN4QywrQkFBdUM7QUFDdkMsa0NBQTBDO0FBRTFDLGtCQUF3QjtBQUV4QiwrQkFBNEM7QUFDMUMsU0FBTyxtREFBQyx1REFBd0I7QUFDbEM7QUFGUyxBQUlULDhCQUEyQztBQUN6QyxTQUFPLG1EQUFDLDJDQUFrQjtBQUM1QjtBQUZTLEFBSVQscUNBQWtEO0FBQ2hELFNBQU8sbURBQUMseURBQXlCO0FBQ25DO0FBRlMsQUFJVCxpQ0FBOEM7QUFDNUMsU0FBTyxtREFBQywyREFBMEI7QUFDcEM7QUFGUyxBQUlULE1BQU0sa0JBQWtCLHdCQUFDLFVBQXFCO0FBQzVDLFFBQU0sT0FBTyx5QkFBUSxLQUFLO0FBRTFCLFNBQU87QUFBQSxPQUNGLE1BQU07QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0Esb0JBQW9CLE1BQ2xCLG1EQUFDO0FBQUEsTUFDQyxXQUFXLE9BQU8sTUFBTSxhQUFhLDBCQUEwQjtBQUFBLEtBQ2pFO0FBQUEsRUFFSjtBQUNGLEdBaEJ3QjtBQWtCeEIsTUFBTSxRQUFRLGdDQUFRLGlCQUFpQixpQ0FBa0I7QUFFbEQsTUFBTSw0QkFBNEIsTUFBTSxnREFBb0I7IiwKICAibmFtZXMiOiBbXQp9Cg==
