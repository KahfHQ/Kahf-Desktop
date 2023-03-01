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
var App_exports = {};
__export(App_exports, {
  SmartApp: () => SmartApp
});
module.exports = __toCommonJS(App_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_App = require("../../components/App");
var import_CallManager = require("./CallManager");
var import_CustomizingPreferredReactionsModal = require("./CustomizingPreferredReactionsModal");
var import_GlobalModalContainer = require("./GlobalModalContainer");
var import_LeftPane = require("./LeftPane");
var import_SafetyNumberViewer = require("./SafetyNumberViewer");
var import_Stories = require("./Stories");
var import_StoryViewer = require("./StoryViewer");
var import_badges = require("../selectors/badges");
var import_user = require("../selectors/user");
var import_stories = require("../selectors/stories");
var import_items = require("../selectors/items");
var import_conversations = require("../selectors/conversations");
var import_preferredReactions = require("../selectors/preferredReactions");
var import_actions = require("../actions");
var import_ErrorBoundary = require("../../components/ErrorBoundary");
const mapStateToProps = /* @__PURE__ */ __name((state) => {
  const i18n = (0, import_user.getIntl)(state);
  return {
    ...state.app,
    conversationsStoppingSend: (0, import_conversations.getConversationsStoppingSend)(state),
    getPreferredBadge: (0, import_badges.getPreferredBadgeSelector)(state),
    i18n,
    localeMessages: (0, import_user.getLocaleMessages)(state),
    isCustomizingPreferredReactions: (0, import_preferredReactions.getIsCustomizingPreferredReactions)(state),
    isMaximized: (0, import_user.getIsMainWindowMaximized)(state),
    isFullScreen: (0, import_user.getIsMainWindowFullScreen)(state),
    menuOptions: (0, import_user.getMenuOptions)(state),
    hasCustomTitleBar: window.SignalContext.OS.hasCustomTitleBar(),
    hideMenuBar: (0, import_items.getHideMenuBar)(state),
    renderCallManager: () => /* @__PURE__ */ import_react.default.createElement(import_CallManager.SmartCallManager, null),
    renderCustomizingPreferredReactionsModal: () => /* @__PURE__ */ import_react.default.createElement(import_CustomizingPreferredReactionsModal.SmartCustomizingPreferredReactionsModal, null),
    renderGlobalModalContainer: () => /* @__PURE__ */ import_react.default.createElement(import_GlobalModalContainer.SmartGlobalModalContainer, null),
    renderLeftPane: () => /* @__PURE__ */ import_react.default.createElement(import_LeftPane.SmartLeftPane, null),
    renderSafetyNumber: (props) => /* @__PURE__ */ import_react.default.createElement(import_SafetyNumberViewer.SmartSafetyNumberViewer, {
      ...props
    }),
    isShowingStoriesView: (0, import_stories.shouldShowStoriesView)(state),
    renderStories: () => /* @__PURE__ */ import_react.default.createElement(import_ErrorBoundary.ErrorBoundary, null, /* @__PURE__ */ import_react.default.createElement(import_Stories.SmartStories, null)),
    hasSelectedStoryData: (0, import_stories.hasSelectedStoryData)(state),
    renderStoryViewer: () => /* @__PURE__ */ import_react.default.createElement(import_ErrorBoundary.ErrorBoundary, null, /* @__PURE__ */ import_react.default.createElement(import_StoryViewer.SmartStoryViewer, null)),
    requestVerification: (type, number, token) => {
      const accountManager = window.getAccountManager();
      if (type === "sms") {
        return accountManager.requestSMSVerification(number, token);
      }
      return accountManager.requestVoiceVerification(number, token);
    },
    registerSingleDevice: (number, code) => {
      return window.getAccountManager().registerSingleDevice(number, code);
    },
    selectedConversationId: state.conversations.selectedConversationId,
    selectedMessage: state.conversations.selectedMessage,
    theme: (0, import_user.getTheme)(state),
    executeMenuRole: (role) => {
      window.SignalContext.executeMenuRole(role);
    },
    executeMenuAction: (action) => {
      window.SignalContext.executeMenuAction(action);
    },
    titleBarDoubleClick: () => {
      window.titleBarDoubleClick();
    },
    toastType: state.toast.toastType
  };
}, "mapStateToProps");
const smart = (0, import_react_redux.connect)(mapStateToProps, import_actions.mapDispatchToProps);
const SmartApp = smart(import_App.App);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartApp
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXBwLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHR5cGUgeyBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHR5cGUgeyBNZW51QWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL21lbnUnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9BcHAnO1xuaW1wb3J0IHsgU21hcnRDYWxsTWFuYWdlciB9IGZyb20gJy4vQ2FsbE1hbmFnZXInO1xuaW1wb3J0IHsgU21hcnRDdXN0b21pemluZ1ByZWZlcnJlZFJlYWN0aW9uc01vZGFsIH0gZnJvbSAnLi9DdXN0b21pemluZ1ByZWZlcnJlZFJlYWN0aW9uc01vZGFsJztcbmltcG9ydCB7IFNtYXJ0R2xvYmFsTW9kYWxDb250YWluZXIgfSBmcm9tICcuL0dsb2JhbE1vZGFsQ29udGFpbmVyJztcbmltcG9ydCB7IFNtYXJ0TGVmdFBhbmUgfSBmcm9tICcuL0xlZnRQYW5lJztcbmltcG9ydCB7IFNtYXJ0U2FmZXR5TnVtYmVyVmlld2VyIH0gZnJvbSAnLi9TYWZldHlOdW1iZXJWaWV3ZXInO1xuaW1wb3J0IHsgU21hcnRTdG9yaWVzIH0gZnJvbSAnLi9TdG9yaWVzJztcbmltcG9ydCB7IFNtYXJ0U3RvcnlWaWV3ZXIgfSBmcm9tICcuL1N0b3J5Vmlld2VyJztcbmltcG9ydCB0eXBlIHsgU3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQge1xuICBnZXRJbnRsLFxuICBnZXRMb2NhbGVNZXNzYWdlcyxcbiAgZ2V0VGhlbWUsXG4gIGdldElzTWFpbldpbmRvd01heGltaXplZCxcbiAgZ2V0SXNNYWluV2luZG93RnVsbFNjcmVlbixcbiAgZ2V0TWVudU9wdGlvbnMsXG59IGZyb20gJy4uL3NlbGVjdG9ycy91c2VyJztcbmltcG9ydCB7XG4gIGhhc1NlbGVjdGVkU3RvcnlEYXRhLFxuICBzaG91bGRTaG93U3Rvcmllc1ZpZXcsXG59IGZyb20gJy4uL3NlbGVjdG9ycy9zdG9yaWVzJztcbmltcG9ydCB7IGdldEhpZGVNZW51QmFyIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2l0ZW1zJztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQgfSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRJc0N1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3ByZWZlcnJlZFJlYWN0aW9ucyc7XG5pbXBvcnQgeyBtYXBEaXNwYXRjaFRvUHJvcHMgfSBmcm9tICcuLi9hY3Rpb25zJztcbmltcG9ydCB0eXBlIHsgU2FmZXR5TnVtYmVyUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1NhZmV0eU51bWJlckNoYW5nZURpYWxvZyc7XG5pbXBvcnQgeyBFcnJvckJvdW5kYXJ5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5JztcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlOiBTdGF0ZVR5cGUpID0+IHtcbiAgY29uc3QgaTE4biA9IGdldEludGwoc3RhdGUpO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUuYXBwLFxuICAgIGNvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQ6IGdldENvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQoc3RhdGUpLFxuICAgIGdldFByZWZlcnJlZEJhZGdlOiBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yKHN0YXRlKSxcbiAgICBpMThuLFxuICAgIGxvY2FsZU1lc3NhZ2VzOiBnZXRMb2NhbGVNZXNzYWdlcyhzdGF0ZSksXG4gICAgaXNDdXN0b21pemluZ1ByZWZlcnJlZFJlYWN0aW9uczogZ2V0SXNDdXN0b21pemluZ1ByZWZlcnJlZFJlYWN0aW9ucyhzdGF0ZSksXG4gICAgaXNNYXhpbWl6ZWQ6IGdldElzTWFpbldpbmRvd01heGltaXplZChzdGF0ZSksXG4gICAgaXNGdWxsU2NyZWVuOiBnZXRJc01haW5XaW5kb3dGdWxsU2NyZWVuKHN0YXRlKSxcbiAgICBtZW51T3B0aW9uczogZ2V0TWVudU9wdGlvbnMoc3RhdGUpLFxuICAgIGhhc0N1c3RvbVRpdGxlQmFyOiB3aW5kb3cuU2lnbmFsQ29udGV4dC5PUy5oYXNDdXN0b21UaXRsZUJhcigpLFxuICAgIGhpZGVNZW51QmFyOiBnZXRIaWRlTWVudUJhcihzdGF0ZSksXG4gICAgcmVuZGVyQ2FsbE1hbmFnZXI6ICgpID0+IDxTbWFydENhbGxNYW5hZ2VyIC8+LFxuICAgIHJlbmRlckN1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zTW9kYWw6ICgpID0+IChcbiAgICAgIDxTbWFydEN1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zTW9kYWwgLz5cbiAgICApLFxuICAgIHJlbmRlckdsb2JhbE1vZGFsQ29udGFpbmVyOiAoKSA9PiA8U21hcnRHbG9iYWxNb2RhbENvbnRhaW5lciAvPixcbiAgICByZW5kZXJMZWZ0UGFuZTogKCkgPT4gPFNtYXJ0TGVmdFBhbmUgLz4sXG4gICAgcmVuZGVyU2FmZXR5TnVtYmVyOiAocHJvcHM6IFNhZmV0eU51bWJlclByb3BzKSA9PiAoXG4gICAgICA8U21hcnRTYWZldHlOdW1iZXJWaWV3ZXIgey4uLnByb3BzfSAvPlxuICAgICksXG4gICAgaXNTaG93aW5nU3Rvcmllc1ZpZXc6IHNob3VsZFNob3dTdG9yaWVzVmlldyhzdGF0ZSksXG4gICAgcmVuZGVyU3RvcmllczogKCkgPT4gKFxuICAgICAgPEVycm9yQm91bmRhcnk+XG4gICAgICAgIDxTbWFydFN0b3JpZXMgLz5cbiAgICAgIDwvRXJyb3JCb3VuZGFyeT5cbiAgICApLFxuICAgIGhhc1NlbGVjdGVkU3RvcnlEYXRhOiBoYXNTZWxlY3RlZFN0b3J5RGF0YShzdGF0ZSksXG4gICAgcmVuZGVyU3RvcnlWaWV3ZXI6ICgpID0+IChcbiAgICAgIDxFcnJvckJvdW5kYXJ5PlxuICAgICAgICA8U21hcnRTdG9yeVZpZXdlciAvPlxuICAgICAgPC9FcnJvckJvdW5kYXJ5PlxuICAgICksXG4gICAgcmVxdWVzdFZlcmlmaWNhdGlvbjogKFxuICAgICAgdHlwZTogJ3NtcycgfCAndm9pY2UnLFxuICAgICAgbnVtYmVyOiBzdHJpbmcsXG4gICAgICB0b2tlbjogc3RyaW5nXG4gICAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhY2NvdW50TWFuYWdlciA9IHdpbmRvdy5nZXRBY2NvdW50TWFuYWdlcigpO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ3NtcycpIHtcbiAgICAgICAgcmV0dXJuIGFjY291bnRNYW5hZ2VyLnJlcXVlc3RTTVNWZXJpZmljYXRpb24obnVtYmVyLCB0b2tlbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhY2NvdW50TWFuYWdlci5yZXF1ZXN0Vm9pY2VWZXJpZmljYXRpb24obnVtYmVyLCB0b2tlbik7XG4gICAgfSxcbiAgICByZWdpc3RlclNpbmdsZURldmljZTogKG51bWJlcjogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHJldHVybiB3aW5kb3cuZ2V0QWNjb3VudE1hbmFnZXIoKS5yZWdpc3RlclNpbmdsZURldmljZShudW1iZXIsIGNvZGUpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZDogc3RhdGUuY29udmVyc2F0aW9ucy5zZWxlY3RlZENvbnZlcnNhdGlvbklkLFxuICAgIHNlbGVjdGVkTWVzc2FnZTogc3RhdGUuY29udmVyc2F0aW9ucy5zZWxlY3RlZE1lc3NhZ2UsXG4gICAgdGhlbWU6IGdldFRoZW1lKHN0YXRlKSxcblxuICAgIGV4ZWN1dGVNZW51Um9sZTogKHJvbGU6IE1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zWydyb2xlJ10pOiB2b2lkID0+IHtcbiAgICAgIHdpbmRvdy5TaWduYWxDb250ZXh0LmV4ZWN1dGVNZW51Um9sZShyb2xlKTtcbiAgICB9LFxuICAgIGV4ZWN1dGVNZW51QWN0aW9uOiAoYWN0aW9uOiBNZW51QWN0aW9uVHlwZSk6IHZvaWQgPT4ge1xuICAgICAgd2luZG93LlNpZ25hbENvbnRleHQuZXhlY3V0ZU1lbnVBY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuICAgIHRpdGxlQmFyRG91YmxlQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgIHdpbmRvdy50aXRsZUJhckRvdWJsZUNsaWNrKCk7XG4gICAgfSxcbiAgICB0b2FzdFR5cGU6IHN0YXRlLnRvYXN0LnRvYXN0VHlwZSxcbiAgfTtcbn07XG5cbmNvbnN0IHNtYXJ0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcyk7XG5cbmV4cG9ydCBjb25zdCBTbWFydEFwcCA9IHNtYXJ0KEFwcCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUF3QjtBQUl4QixpQkFBb0I7QUFDcEIseUJBQWlDO0FBQ2pDLGdEQUF3RDtBQUN4RCxrQ0FBMEM7QUFDMUMsc0JBQThCO0FBQzlCLGdDQUF3QztBQUN4QyxxQkFBNkI7QUFDN0IseUJBQWlDO0FBRWpDLG9CQUEwQztBQUMxQyxrQkFPTztBQUNQLHFCQUdPO0FBQ1AsbUJBQStCO0FBQy9CLDJCQUE2QztBQUM3QyxnQ0FBbUQ7QUFDbkQscUJBQW1DO0FBRW5DLDJCQUE4QjtBQUU5QixNQUFNLGtCQUFrQix3QkFBQyxVQUFxQjtBQUM1QyxRQUFNLE9BQU8seUJBQVEsS0FBSztBQUUxQixTQUFPO0FBQUEsT0FDRixNQUFNO0FBQUEsSUFDVCwyQkFBMkIsdURBQTZCLEtBQUs7QUFBQSxJQUM3RCxtQkFBbUIsNkNBQTBCLEtBQUs7QUFBQSxJQUNsRDtBQUFBLElBQ0EsZ0JBQWdCLG1DQUFrQixLQUFLO0FBQUEsSUFDdkMsaUNBQWlDLGtFQUFtQyxLQUFLO0FBQUEsSUFDekUsYUFBYSwwQ0FBeUIsS0FBSztBQUFBLElBQzNDLGNBQWMsMkNBQTBCLEtBQUs7QUFBQSxJQUM3QyxhQUFhLGdDQUFlLEtBQUs7QUFBQSxJQUNqQyxtQkFBbUIsT0FBTyxjQUFjLEdBQUcsa0JBQWtCO0FBQUEsSUFDN0QsYUFBYSxpQ0FBZSxLQUFLO0FBQUEsSUFDakMsbUJBQW1CLE1BQU0sbURBQUMseUNBQWlCO0FBQUEsSUFDM0MsMENBQTBDLE1BQ3hDLG1EQUFDLHVGQUF3QztBQUFBLElBRTNDLDRCQUE0QixNQUFNLG1EQUFDLDJEQUEwQjtBQUFBLElBQzdELGdCQUFnQixNQUFNLG1EQUFDLG1DQUFjO0FBQUEsSUFDckMsb0JBQW9CLENBQUMsVUFDbkIsbURBQUM7QUFBQSxTQUE0QjtBQUFBLEtBQU87QUFBQSxJQUV0QyxzQkFBc0IsMENBQXNCLEtBQUs7QUFBQSxJQUNqRCxlQUFlLE1BQ2IsbURBQUMsMENBQ0MsbURBQUMsaUNBQWEsQ0FDaEI7QUFBQSxJQUVGLHNCQUFzQix5Q0FBcUIsS0FBSztBQUFBLElBQ2hELG1CQUFtQixNQUNqQixtREFBQywwQ0FDQyxtREFBQyx5Q0FBaUIsQ0FDcEI7QUFBQSxJQUVGLHFCQUFxQixDQUNuQixNQUNBLFFBQ0EsVUFDa0I7QUFDbEIsWUFBTSxpQkFBaUIsT0FBTyxrQkFBa0I7QUFFaEQsVUFBSSxTQUFTLE9BQU87QUFDbEIsZUFBTyxlQUFlLHVCQUF1QixRQUFRLEtBQUs7QUFBQSxNQUM1RDtBQUVBLGFBQU8sZUFBZSx5QkFBeUIsUUFBUSxLQUFLO0FBQUEsSUFDOUQ7QUFBQSxJQUNBLHNCQUFzQixDQUFDLFFBQWdCLFNBQWdDO0FBQ3JFLGFBQU8sT0FBTyxrQkFBa0IsRUFBRSxxQkFBcUIsUUFBUSxJQUFJO0FBQUEsSUFDckU7QUFBQSxJQUNBLHdCQUF3QixNQUFNLGNBQWM7QUFBQSxJQUM1QyxpQkFBaUIsTUFBTSxjQUFjO0FBQUEsSUFDckMsT0FBTywwQkFBUyxLQUFLO0FBQUEsSUFFckIsaUJBQWlCLENBQUMsU0FBbUQ7QUFDbkUsYUFBTyxjQUFjLGdCQUFnQixJQUFJO0FBQUEsSUFDM0M7QUFBQSxJQUNBLG1CQUFtQixDQUFDLFdBQWlDO0FBQ25ELGFBQU8sY0FBYyxrQkFBa0IsTUFBTTtBQUFBLElBQy9DO0FBQUEsSUFDQSxxQkFBcUIsTUFBWTtBQUMvQixhQUFPLG9CQUFvQjtBQUFBLElBQzdCO0FBQUEsSUFDQSxXQUFXLE1BQU0sTUFBTTtBQUFBLEVBQ3pCO0FBQ0YsR0FuRXdCO0FBcUV4QixNQUFNLFFBQVEsZ0NBQVEsaUJBQWlCLGlDQUFrQjtBQUVsRCxNQUFNLFdBQVcsTUFBTSxjQUFHOyIsCiAgIm5hbWVzIjogW10KfQo=
