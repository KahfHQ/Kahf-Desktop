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
  GlobalModalContainer: () => GlobalModalContainer
});
module.exports = __toCommonJS(GlobalModalContainer_exports);
var import_react = __toESM(require("react"));
var import_missingCaseError = require("../util/missingCaseError");
var import_Button = require("./Button");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_SignalConnectionsModal = require("./SignalConnectionsModal");
var import_WhatsNewModal = require("./WhatsNewModal");
const GlobalModalContainer = /* @__PURE__ */ __name(({
  i18n,
  contactModalState,
  renderContactModal,
  forwardMessageProps,
  renderForwardMessageModal,
  isProfileEditorVisible,
  renderProfileEditor,
  safetyNumberModalContactId,
  renderSafetyNumber,
  isSignalConnectionsVisible,
  toggleSignalConnectionsModal,
  isStoriesSettingsVisible,
  renderStoriesSettings,
  hideUserNotFoundModal,
  userNotFoundModalState,
  hideWhatsNewModal,
  isWhatsNewVisible
}) => {
  if (safetyNumberModalContactId) {
    return renderSafetyNumber();
  }
  if (userNotFoundModalState) {
    let content;
    if (userNotFoundModalState.type === "phoneNumber") {
      content = i18n("startConversation--phone-number-not-found", {
        phoneNumber: userNotFoundModalState.phoneNumber
      });
    } else if (userNotFoundModalState.type === "username") {
      content = i18n("startConversation--username-not-found", {
        atUsername: i18n("at-username", {
          username: userNotFoundModalState.username
        })
      });
    } else {
      throw (0, import_missingCaseError.missingCaseError)(userNotFoundModalState);
    }
    return /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
      cancelText: i18n("ok"),
      cancelButtonVariant: import_Button.ButtonVariant.Secondary,
      i18n,
      onClose: hideUserNotFoundModal
    }, content);
  }
  if (contactModalState) {
    return renderContactModal();
  }
  if (isProfileEditorVisible) {
    return renderProfileEditor();
  }
  if (isWhatsNewVisible) {
    return /* @__PURE__ */ import_react.default.createElement(import_WhatsNewModal.WhatsNewModal, {
      hideWhatsNewModal,
      i18n
    });
  }
  if (forwardMessageProps) {
    return renderForwardMessageModal();
  }
  if (isSignalConnectionsVisible) {
    return /* @__PURE__ */ import_react.default.createElement(import_SignalConnectionsModal.SignalConnectionsModal, {
      i18n,
      onClose: toggleSignalConnectionsModal
    });
  }
  if (isStoriesSettingsVisible) {
    return renderStoriesSettings();
  }
  return null;
}, "GlobalModalContainer");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalModalContainer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiR2xvYmFsTW9kYWxDb250YWluZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnRhY3RNb2RhbFN0YXRlVHlwZSxcbiAgRm9yd2FyZE1lc3NhZ2VQcm9wc1R5cGUsXG4gIFVzZXJOb3RGb3VuZE1vZGFsU3RhdGVUeXBlLFxufSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9nbG9iYWxNb2RhbHMnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcblxuaW1wb3J0IHsgQnV0dG9uVmFyaWFudCB9IGZyb20gJy4vQnV0dG9uJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IFNpZ25hbENvbm5lY3Rpb25zTW9kYWwgfSBmcm9tICcuL1NpZ25hbENvbm5lY3Rpb25zTW9kYWwnO1xuaW1wb3J0IHsgV2hhdHNOZXdNb2RhbCB9IGZyb20gJy4vV2hhdHNOZXdNb2RhbCc7XG5cbnR5cGUgUHJvcHNUeXBlID0ge1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICAvLyBDb250YWN0TW9kYWxcbiAgY29udGFjdE1vZGFsU3RhdGU/OiBDb250YWN0TW9kYWxTdGF0ZVR5cGU7XG4gIHJlbmRlckNvbnRhY3RNb2RhbDogKCkgPT4gSlNYLkVsZW1lbnQ7XG4gIC8vIEZvcndhcmRNZXNzYWdlTW9kYWxcbiAgZm9yd2FyZE1lc3NhZ2VQcm9wcz86IEZvcndhcmRNZXNzYWdlUHJvcHNUeXBlO1xuICByZW5kZXJGb3J3YXJkTWVzc2FnZU1vZGFsOiAoKSA9PiBKU1guRWxlbWVudDtcbiAgLy8gUHJvZmlsZUVkaXRvclxuICBpc1Byb2ZpbGVFZGl0b3JWaXNpYmxlOiBib29sZWFuO1xuICByZW5kZXJQcm9maWxlRWRpdG9yOiAoKSA9PiBKU1guRWxlbWVudDtcbiAgLy8gU2FmZXR5TnVtYmVyTW9kYWxcbiAgc2FmZXR5TnVtYmVyTW9kYWxDb250YWN0SWQ/OiBzdHJpbmc7XG4gIHJlbmRlclNhZmV0eU51bWJlcjogKCkgPT4gSlNYLkVsZW1lbnQ7XG4gIC8vIFNpZ25hbENvbm5lY3Rpb25zTW9kYWxcbiAgaXNTaWduYWxDb25uZWN0aW9uc1Zpc2libGU6IGJvb2xlYW47XG4gIHRvZ2dsZVNpZ25hbENvbm5lY3Rpb25zTW9kYWw6ICgpID0+IHVua25vd247XG4gIC8vIFN0b3JpZXNTZXR0aW5nc1xuICBpc1N0b3JpZXNTZXR0aW5nc1Zpc2libGU6IGJvb2xlYW47XG4gIHJlbmRlclN0b3JpZXNTZXR0aW5nczogKCkgPT4gSlNYLkVsZW1lbnQ7XG4gIC8vIFVzZXJOb3RGb3VuZE1vZGFsXG4gIGhpZGVVc2VyTm90Rm91bmRNb2RhbDogKCkgPT4gdW5rbm93bjtcbiAgdXNlck5vdEZvdW5kTW9kYWxTdGF0ZT86IFVzZXJOb3RGb3VuZE1vZGFsU3RhdGVUeXBlO1xuICAvLyBXaGF0c05ld01vZGFsXG4gIGlzV2hhdHNOZXdWaXNpYmxlOiBib29sZWFuO1xuICBoaWRlV2hhdHNOZXdNb2RhbDogKCkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCBjb25zdCBHbG9iYWxNb2RhbENvbnRhaW5lciA9ICh7XG4gIGkxOG4sXG4gIC8vIENvbnRhY3RNb2RhbFxuICBjb250YWN0TW9kYWxTdGF0ZSxcbiAgcmVuZGVyQ29udGFjdE1vZGFsLFxuICAvLyBGb3J3YXJkTWVzc2FnZU1vZGFsXG4gIGZvcndhcmRNZXNzYWdlUHJvcHMsXG4gIHJlbmRlckZvcndhcmRNZXNzYWdlTW9kYWwsXG4gIC8vIFByb2ZpbGVFZGl0b3JcbiAgaXNQcm9maWxlRWRpdG9yVmlzaWJsZSxcbiAgcmVuZGVyUHJvZmlsZUVkaXRvcixcbiAgLy8gU2FmZXR5TnVtYmVyTW9kYWxcbiAgc2FmZXR5TnVtYmVyTW9kYWxDb250YWN0SWQsXG4gIHJlbmRlclNhZmV0eU51bWJlcixcbiAgLy8gU2lnbmFsQ29ubmVjdGlvbnNNb2RhbFxuICBpc1NpZ25hbENvbm5lY3Rpb25zVmlzaWJsZSxcbiAgdG9nZ2xlU2lnbmFsQ29ubmVjdGlvbnNNb2RhbCxcbiAgLy8gU3Rvcmllc1NldHRpbmdzXG4gIGlzU3Rvcmllc1NldHRpbmdzVmlzaWJsZSxcbiAgcmVuZGVyU3Rvcmllc1NldHRpbmdzLFxuICAvLyBVc2VyTm90Rm91bmRNb2RhbFxuICBoaWRlVXNlck5vdEZvdW5kTW9kYWwsXG4gIHVzZXJOb3RGb3VuZE1vZGFsU3RhdGUsXG4gIC8vIFdoYXRzTmV3TW9kYWxcbiAgaGlkZVdoYXRzTmV3TW9kYWwsXG4gIGlzV2hhdHNOZXdWaXNpYmxlLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgfCBudWxsID0+IHtcbiAgaWYgKHNhZmV0eU51bWJlck1vZGFsQ29udGFjdElkKSB7XG4gICAgcmV0dXJuIHJlbmRlclNhZmV0eU51bWJlcigpO1xuICB9XG5cbiAgaWYgKHVzZXJOb3RGb3VuZE1vZGFsU3RhdGUpIHtcbiAgICBsZXQgY29udGVudDogc3RyaW5nO1xuICAgIGlmICh1c2VyTm90Rm91bmRNb2RhbFN0YXRlLnR5cGUgPT09ICdwaG9uZU51bWJlcicpIHtcbiAgICAgIGNvbnRlbnQgPSBpMThuKCdzdGFydENvbnZlcnNhdGlvbi0tcGhvbmUtbnVtYmVyLW5vdC1mb3VuZCcsIHtcbiAgICAgICAgcGhvbmVOdW1iZXI6IHVzZXJOb3RGb3VuZE1vZGFsU3RhdGUucGhvbmVOdW1iZXIsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHVzZXJOb3RGb3VuZE1vZGFsU3RhdGUudHlwZSA9PT0gJ3VzZXJuYW1lJykge1xuICAgICAgY29udGVudCA9IGkxOG4oJ3N0YXJ0Q29udmVyc2F0aW9uLS11c2VybmFtZS1ub3QtZm91bmQnLCB7XG4gICAgICAgIGF0VXNlcm5hbWU6IGkxOG4oJ2F0LXVzZXJuYW1lJywge1xuICAgICAgICAgIHVzZXJuYW1lOiB1c2VyTm90Rm91bmRNb2RhbFN0YXRlLnVzZXJuYW1lLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKHVzZXJOb3RGb3VuZE1vZGFsU3RhdGUpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgIGNhbmNlbFRleHQ9e2kxOG4oJ29rJyl9XG4gICAgICAgIGNhbmNlbEJ1dHRvblZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU2Vjb25kYXJ5fVxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBvbkNsb3NlPXtoaWRlVXNlck5vdEZvdW5kTW9kYWx9XG4gICAgICA+XG4gICAgICAgIHtjb250ZW50fVxuICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChjb250YWN0TW9kYWxTdGF0ZSkge1xuICAgIHJldHVybiByZW5kZXJDb250YWN0TW9kYWwoKTtcbiAgfVxuXG4gIGlmIChpc1Byb2ZpbGVFZGl0b3JWaXNpYmxlKSB7XG4gICAgcmV0dXJuIHJlbmRlclByb2ZpbGVFZGl0b3IoKTtcbiAgfVxuXG4gIGlmIChpc1doYXRzTmV3VmlzaWJsZSkge1xuICAgIHJldHVybiA8V2hhdHNOZXdNb2RhbCBoaWRlV2hhdHNOZXdNb2RhbD17aGlkZVdoYXRzTmV3TW9kYWx9IGkxOG49e2kxOG59IC8+O1xuICB9XG5cbiAgaWYgKGZvcndhcmRNZXNzYWdlUHJvcHMpIHtcbiAgICByZXR1cm4gcmVuZGVyRm9yd2FyZE1lc3NhZ2VNb2RhbCgpO1xuICB9XG5cbiAgaWYgKGlzU2lnbmFsQ29ubmVjdGlvbnNWaXNpYmxlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWduYWxDb25uZWN0aW9uc01vZGFsXG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIG9uQ2xvc2U9e3RvZ2dsZVNpZ25hbENvbm5lY3Rpb25zTW9kYWx9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBpZiAoaXNTdG9yaWVzU2V0dGluZ3NWaXNpYmxlKSB7XG4gICAgcmV0dXJuIHJlbmRlclN0b3JpZXNTZXR0aW5ncygpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQjtBQU9sQiw4QkFBaUM7QUFFakMsb0JBQThCO0FBQzlCLGdDQUFtQztBQUNuQyxvQ0FBdUM7QUFDdkMsMkJBQThCO0FBOEJ2QixNQUFNLHVCQUF1Qix3QkFBQztBQUFBLEVBQ25DO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLE1BQ21DO0FBQ25DLE1BQUksNEJBQTRCO0FBQzlCLFdBQU8sbUJBQW1CO0FBQUEsRUFDNUI7QUFFQSxNQUFJLHdCQUF3QjtBQUMxQixRQUFJO0FBQ0osUUFBSSx1QkFBdUIsU0FBUyxlQUFlO0FBQ2pELGdCQUFVLEtBQUssNkNBQTZDO0FBQUEsUUFDMUQsYUFBYSx1QkFBdUI7QUFBQSxNQUN0QyxDQUFDO0FBQUEsSUFDSCxXQUFXLHVCQUF1QixTQUFTLFlBQVk7QUFDckQsZ0JBQVUsS0FBSyx5Q0FBeUM7QUFBQSxRQUN0RCxZQUFZLEtBQUssZUFBZTtBQUFBLFVBQzlCLFVBQVUsdUJBQXVCO0FBQUEsUUFDbkMsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUFBLElBQ0gsT0FBTztBQUNMLFlBQU0sOENBQWlCLHNCQUFzQjtBQUFBLElBQy9DO0FBRUEsV0FDRSxtREFBQztBQUFBLE1BQ0MsWUFBWSxLQUFLLElBQUk7QUFBQSxNQUNyQixxQkFBcUIsNEJBQWM7QUFBQSxNQUNuQztBQUFBLE1BQ0EsU0FBUztBQUFBLE9BRVIsT0FDSDtBQUFBLEVBRUo7QUFFQSxNQUFJLG1CQUFtQjtBQUNyQixXQUFPLG1CQUFtQjtBQUFBLEVBQzVCO0FBRUEsTUFBSSx3QkFBd0I7QUFDMUIsV0FBTyxvQkFBb0I7QUFBQSxFQUM3QjtBQUVBLE1BQUksbUJBQW1CO0FBQ3JCLFdBQU8sbURBQUM7QUFBQSxNQUFjO0FBQUEsTUFBc0M7QUFBQSxLQUFZO0FBQUEsRUFDMUU7QUFFQSxNQUFJLHFCQUFxQjtBQUN2QixXQUFPLDBCQUEwQjtBQUFBLEVBQ25DO0FBRUEsTUFBSSw0QkFBNEI7QUFDOUIsV0FDRSxtREFBQztBQUFBLE1BQ0M7QUFBQSxNQUNBLFNBQVM7QUFBQSxLQUNYO0FBQUEsRUFFSjtBQUVBLE1BQUksMEJBQTBCO0FBQzVCLFdBQU8sc0JBQXNCO0FBQUEsRUFDL0I7QUFFQSxTQUFPO0FBQ1QsR0F6Rm9DOyIsCiAgIm5hbWVzIjogW10KfQo=
