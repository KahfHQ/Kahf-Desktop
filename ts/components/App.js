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
  App: () => App
});
module.exports = __toCommonJS(App_exports);
var import_react = __toESM(require("react"));
var import_web = require("@react-spring/web");
var import_classnames = __toESM(require("classnames"));
var import_app = require("../state/ducks/app");
var import_Inbox = require("./Inbox");
var import_InstallScreen = require("../state/smart/InstallScreen");
var import_StandaloneRegistration = require("./StandaloneRegistration");
var import_Util = require("../types/Util");
var import_TitleBarContainer = require("./TitleBarContainer");
var import_ToastManager = require("./ToastManager");
var import_usePageVisibility = require("../hooks/usePageVisibility");
var import_useReducedMotion = require("../hooks/useReducedMotion");
const App = /* @__PURE__ */ __name(({
  appView,
  cancelConversationVerification,
  conversationsStoppingSend,
  executeMenuAction,
  executeMenuRole,
  getPreferredBadge,
  hasInitialLoadCompleted,
  hasSelectedStoryData,
  hideMenuBar,
  hideToast,
  i18n,
  isCustomizingPreferredReactions,
  isFullScreen,
  isMaximized,
  isShowingStoriesView,
  hasCustomTitleBar,
  localeMessages,
  menuOptions,
  openInbox,
  registerSingleDevice,
  renderCallManager,
  renderCustomizingPreferredReactionsModal,
  renderGlobalModalContainer,
  renderLeftPane,
  renderSafetyNumber,
  renderStories,
  renderStoryViewer,
  requestVerification,
  selectedConversationId,
  selectedMessage,
  showConversation,
  showWhatsNewModal,
  theme,
  titleBarDoubleClick,
  toastType,
  verifyConversationsStoppingSend
}) => {
  let contents;
  if (appView === import_app.AppViewType.Installer) {
    contents = /* @__PURE__ */ import_react.default.createElement(import_InstallScreen.SmartInstallScreen, null);
  } else if (appView === import_app.AppViewType.Standalone) {
    const onComplete = /* @__PURE__ */ __name(() => {
      window.removeSetupMenuItems();
      openInbox();
    }, "onComplete");
    contents = /* @__PURE__ */ import_react.default.createElement(import_StandaloneRegistration.StandaloneRegistration, {
      onComplete,
      requestVerification,
      registerSingleDevice
    });
  } else if (appView === import_app.AppViewType.Inbox) {
    contents = /* @__PURE__ */ import_react.default.createElement(import_Inbox.Inbox, {
      cancelConversationVerification,
      conversationsStoppingSend,
      hasInitialLoadCompleted,
      getPreferredBadge,
      i18n,
      isCustomizingPreferredReactions,
      renderCustomizingPreferredReactionsModal,
      renderLeftPane,
      renderSafetyNumber,
      selectedConversationId,
      selectedMessage,
      showConversation,
      showWhatsNewModal,
      theme,
      verifyConversationsStoppingSend
    });
  }
  (0, import_react.useEffect)(() => {
    document.body.classList.remove("light-theme");
    document.body.classList.remove("dark-theme");
    if (theme === import_Util.ThemeType.dark) {
      document.body.classList.add("dark-theme");
    }
    if (theme === import_Util.ThemeType.light) {
      document.body.classList.add("light-theme");
    }
  }, [theme]);
  const isPageVisible = (0, import_usePageVisibility.usePageVisibility)();
  (0, import_react.useEffect)(() => {
    document.body.classList.toggle("page-is-visible", isPageVisible);
  }, [isPageVisible]);
  const prefersReducedMotion = (0, import_useReducedMotion.useReducedMotion)();
  (0, import_react.useEffect)(() => {
    import_web.Globals.assign({
      skipAnimation: prefersReducedMotion
    });
  }, [prefersReducedMotion]);
  return /* @__PURE__ */ import_react.default.createElement(import_TitleBarContainer.TitleBarContainer, {
    theme,
    isMaximized,
    isFullScreen,
    hasCustomTitleBar,
    executeMenuRole,
    titleBarDoubleClick,
    hasMenu: true,
    hideMenuBar,
    localeMessages,
    menuOptions,
    executeMenuAction
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)({
      App: true,
      "light-theme": theme === import_Util.ThemeType.light,
      "dark-theme": theme === import_Util.ThemeType.dark
    })
  }, /* @__PURE__ */ import_react.default.createElement(import_ToastManager.ToastManager, {
    hideToast,
    i18n,
    toastType
  }), renderGlobalModalContainer(), renderCallManager(), isShowingStoriesView && renderStories(), hasSelectedStoryData && renderStoryViewer(), contents));
}, "App");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXBwLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50UHJvcHMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgR2xvYmFscyB9IGZyb20gJ0ByZWFjdC1zcHJpbmcvd2ViJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgdHlwZSB7IEV4ZWN1dGVNZW51Um9sZVR5cGUgfSBmcm9tICcuL1RpdGxlQmFyQ29udGFpbmVyJztcbmltcG9ydCB0eXBlIHsgTG9jYWxlTWVzc2FnZXNUeXBlIH0gZnJvbSAnLi4vdHlwZXMvSTE4Tic7XG5pbXBvcnQgdHlwZSB7IE1lbnVPcHRpb25zVHlwZSwgTWVudUFjdGlvblR5cGUgfSBmcm9tICcuLi90eXBlcy9tZW51JztcbmltcG9ydCB0eXBlIHsgVG9hc3RUeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvdG9hc3QnO1xuaW1wb3J0IHsgQXBwVmlld1R5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9hcHAnO1xuaW1wb3J0IHsgSW5ib3ggfSBmcm9tICcuL0luYm94JztcbmltcG9ydCB7IFNtYXJ0SW5zdGFsbFNjcmVlbiB9IGZyb20gJy4uL3N0YXRlL3NtYXJ0L0luc3RhbGxTY3JlZW4nO1xuaW1wb3J0IHsgU3RhbmRhbG9uZVJlZ2lzdHJhdGlvbiB9IGZyb20gJy4vU3RhbmRhbG9uZVJlZ2lzdHJhdGlvbic7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IFRpdGxlQmFyQ29udGFpbmVyIH0gZnJvbSAnLi9UaXRsZUJhckNvbnRhaW5lcic7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tICcuL1RvYXN0TWFuYWdlcic7XG5pbXBvcnQgeyB1c2VQYWdlVmlzaWJpbGl0eSB9IGZyb20gJy4uL2hvb2tzL3VzZVBhZ2VWaXNpYmlsaXR5JztcbmltcG9ydCB7IHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICcuLi9ob29rcy91c2VSZWR1Y2VkTW90aW9uJztcblxudHlwZSBQcm9wc1R5cGUgPSB7XG4gIGFwcFZpZXc6IEFwcFZpZXdUeXBlO1xuICBsb2NhbGVNZXNzYWdlczogTG9jYWxlTWVzc2FnZXNUeXBlO1xuICBvcGVuSW5ib3g6ICgpID0+IHZvaWQ7XG4gIHJlZ2lzdGVyU2luZ2xlRGV2aWNlOiAobnVtYmVyOiBzdHJpbmcsIGNvZGU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVuZGVyQ2FsbE1hbmFnZXI6ICgpID0+IEpTWC5FbGVtZW50O1xuICByZW5kZXJHbG9iYWxNb2RhbENvbnRhaW5lcjogKCkgPT4gSlNYLkVsZW1lbnQ7XG4gIGlzU2hvd2luZ1N0b3JpZXNWaWV3OiBib29sZWFuO1xuICByZW5kZXJTdG9yaWVzOiAoKSA9PiBKU1guRWxlbWVudDtcbiAgaGFzU2VsZWN0ZWRTdG9yeURhdGE6IGJvb2xlYW47XG4gIHJlbmRlclN0b3J5Vmlld2VyOiAoKSA9PiBKU1guRWxlbWVudDtcbiAgcmVxdWVzdFZlcmlmaWNhdGlvbjogKFxuICAgIHR5cGU6ICdzbXMnIHwgJ3ZvaWNlJyxcbiAgICBudW1iZXI6IHN0cmluZyxcbiAgICB0b2tlbjogc3RyaW5nXG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgdGhlbWU6IFRoZW1lVHlwZTtcbiAgaXNNYXhpbWl6ZWQ6IGJvb2xlYW47XG4gIGlzRnVsbFNjcmVlbjogYm9vbGVhbjtcbiAgbWVudU9wdGlvbnM6IE1lbnVPcHRpb25zVHlwZTtcbiAgaGFzQ3VzdG9tVGl0bGVCYXI6IGJvb2xlYW47XG4gIGhpZGVNZW51QmFyOiBib29sZWFuO1xuXG4gIGV4ZWN1dGVNZW51Um9sZTogRXhlY3V0ZU1lbnVSb2xlVHlwZTtcbiAgZXhlY3V0ZU1lbnVBY3Rpb246IChhY3Rpb246IE1lbnVBY3Rpb25UeXBlKSA9PiB2b2lkO1xuICB0aXRsZUJhckRvdWJsZUNsaWNrOiAoKSA9PiB2b2lkO1xuICB0b2FzdFR5cGU/OiBUb2FzdFR5cGU7XG4gIGhpZGVUb2FzdDogKCkgPT4gdW5rbm93bjtcbn0gJiBDb21wb25lbnRQcm9wczx0eXBlb2YgSW5ib3g+O1xuXG5leHBvcnQgY29uc3QgQXBwID0gKHtcbiAgYXBwVmlldyxcbiAgY2FuY2VsQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uLFxuICBjb252ZXJzYXRpb25zU3RvcHBpbmdTZW5kLFxuICBleGVjdXRlTWVudUFjdGlvbixcbiAgZXhlY3V0ZU1lbnVSb2xlLFxuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgaGFzSW5pdGlhbExvYWRDb21wbGV0ZWQsXG4gIGhhc1NlbGVjdGVkU3RvcnlEYXRhLFxuICBoaWRlTWVudUJhcixcbiAgaGlkZVRvYXN0LFxuICBpMThuLFxuICBpc0N1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zLFxuICBpc0Z1bGxTY3JlZW4sXG4gIGlzTWF4aW1pemVkLFxuICBpc1Nob3dpbmdTdG9yaWVzVmlldyxcbiAgaGFzQ3VzdG9tVGl0bGVCYXIsXG4gIGxvY2FsZU1lc3NhZ2VzLFxuICBtZW51T3B0aW9ucyxcbiAgb3BlbkluYm94LFxuICByZWdpc3RlclNpbmdsZURldmljZSxcbiAgcmVuZGVyQ2FsbE1hbmFnZXIsXG4gIHJlbmRlckN1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zTW9kYWwsXG4gIHJlbmRlckdsb2JhbE1vZGFsQ29udGFpbmVyLFxuICByZW5kZXJMZWZ0UGFuZSxcbiAgcmVuZGVyU2FmZXR5TnVtYmVyLFxuICByZW5kZXJTdG9yaWVzLFxuICByZW5kZXJTdG9yeVZpZXdlcixcbiAgcmVxdWVzdFZlcmlmaWNhdGlvbixcbiAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZCxcbiAgc2VsZWN0ZWRNZXNzYWdlLFxuICBzaG93Q29udmVyc2F0aW9uLFxuICBzaG93V2hhdHNOZXdNb2RhbCxcbiAgdGhlbWUsXG4gIHRpdGxlQmFyRG91YmxlQ2xpY2ssXG4gIHRvYXN0VHlwZSxcbiAgdmVyaWZ5Q29udmVyc2F0aW9uc1N0b3BwaW5nU2VuZCxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgbGV0IGNvbnRlbnRzO1xuXG4gIGlmIChhcHBWaWV3ID09PSBBcHBWaWV3VHlwZS5JbnN0YWxsZXIpIHtcbiAgICBjb250ZW50cyA9IDxTbWFydEluc3RhbGxTY3JlZW4gLz47XG4gIH0gZWxzZSBpZiAoYXBwVmlldyA9PT0gQXBwVmlld1R5cGUuU3RhbmRhbG9uZSkge1xuICAgIGNvbnN0IG9uQ29tcGxldGUgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlU2V0dXBNZW51SXRlbXMoKTtcbiAgICAgIG9wZW5JbmJveCgpO1xuICAgIH07XG4gICAgY29udGVudHMgPSAoXG4gICAgICA8U3RhbmRhbG9uZVJlZ2lzdHJhdGlvblxuICAgICAgICBvbkNvbXBsZXRlPXtvbkNvbXBsZXRlfVxuICAgICAgICByZXF1ZXN0VmVyaWZpY2F0aW9uPXtyZXF1ZXN0VmVyaWZpY2F0aW9ufVxuICAgICAgICByZWdpc3RlclNpbmdsZURldmljZT17cmVnaXN0ZXJTaW5nbGVEZXZpY2V9XG4gICAgICAvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAoYXBwVmlldyA9PT0gQXBwVmlld1R5cGUuSW5ib3gpIHtcbiAgICBjb250ZW50cyA9IChcbiAgICAgIDxJbmJveFxuICAgICAgICBjYW5jZWxDb252ZXJzYXRpb25WZXJpZmljYXRpb249e2NhbmNlbENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbn1cbiAgICAgICAgY29udmVyc2F0aW9uc1N0b3BwaW5nU2VuZD17Y29udmVyc2F0aW9uc1N0b3BwaW5nU2VuZH1cbiAgICAgICAgaGFzSW5pdGlhbExvYWRDb21wbGV0ZWQ9e2hhc0luaXRpYWxMb2FkQ29tcGxldGVkfVxuICAgICAgICBnZXRQcmVmZXJyZWRCYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2V9XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGlzQ3VzdG9taXppbmdQcmVmZXJyZWRSZWFjdGlvbnM9e2lzQ3VzdG9taXppbmdQcmVmZXJyZWRSZWFjdGlvbnN9XG4gICAgICAgIHJlbmRlckN1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zTW9kYWw9e1xuICAgICAgICAgIHJlbmRlckN1c3RvbWl6aW5nUHJlZmVycmVkUmVhY3Rpb25zTW9kYWxcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJMZWZ0UGFuZT17cmVuZGVyTGVmdFBhbmV9XG4gICAgICAgIHJlbmRlclNhZmV0eU51bWJlcj17cmVuZGVyU2FmZXR5TnVtYmVyfVxuICAgICAgICBzZWxlY3RlZENvbnZlcnNhdGlvbklkPXtzZWxlY3RlZENvbnZlcnNhdGlvbklkfVxuICAgICAgICBzZWxlY3RlZE1lc3NhZ2U9e3NlbGVjdGVkTWVzc2FnZX1cbiAgICAgICAgc2hvd0NvbnZlcnNhdGlvbj17c2hvd0NvbnZlcnNhdGlvbn1cbiAgICAgICAgc2hvd1doYXRzTmV3TW9kYWw9e3Nob3dXaGF0c05ld01vZGFsfVxuICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgIHZlcmlmeUNvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmQ9e3ZlcmlmeUNvbnZlcnNhdGlvbnNTdG9wcGluZ1NlbmR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICAvLyBUaGlzIGFyZSBoZXJlIHNvIHRoYXQgdGhlbWVzIGFyZSBwcm9wZXJseSBhcHBsaWVkIHRvIGFueXRoaW5nIHRoYXQgaXNcbiAgLy8gY3JlYXRlZCBpbiBhIHBvcnRhbCBhbmQgZXhpc3RzIG91dHNpZGUgb2YgdGhlIDxBcHAgLz4gY29udGFpbmVyLlxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbGlnaHQtdGhlbWUnKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RhcmstdGhlbWUnKTtcblxuICAgIGlmICh0aGVtZSA9PT0gVGhlbWVUeXBlLmRhcmspIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGFyay10aGVtZScpO1xuICAgIH1cbiAgICBpZiAodGhlbWUgPT09IFRoZW1lVHlwZS5saWdodCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdsaWdodC10aGVtZScpO1xuICAgIH1cbiAgfSwgW3RoZW1lXSk7XG5cbiAgY29uc3QgaXNQYWdlVmlzaWJsZSA9IHVzZVBhZ2VWaXNpYmlsaXR5KCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdwYWdlLWlzLXZpc2libGUnLCBpc1BhZ2VWaXNpYmxlKTtcbiAgfSwgW2lzUGFnZVZpc2libGVdKTtcblxuICAvLyBBMTF5IHNldHRpbmdzIGZvciByZWFjdC1zcHJpbmdcbiAgY29uc3QgcHJlZmVyc1JlZHVjZWRNb3Rpb24gPSB1c2VSZWR1Y2VkTW90aW9uKCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgR2xvYmFscy5hc3NpZ24oe1xuICAgICAgc2tpcEFuaW1hdGlvbjogcHJlZmVyc1JlZHVjZWRNb3Rpb24sXG4gICAgfSk7XG4gIH0sIFtwcmVmZXJzUmVkdWNlZE1vdGlvbl0pO1xuXG4gIHJldHVybiAoXG4gICAgPFRpdGxlQmFyQ29udGFpbmVyXG4gICAgICB0aGVtZT17dGhlbWV9XG4gICAgICBpc01heGltaXplZD17aXNNYXhpbWl6ZWR9XG4gICAgICBpc0Z1bGxTY3JlZW49e2lzRnVsbFNjcmVlbn1cbiAgICAgIGhhc0N1c3RvbVRpdGxlQmFyPXtoYXNDdXN0b21UaXRsZUJhcn1cbiAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgICAgdGl0bGVCYXJEb3VibGVDbGljaz17dGl0bGVCYXJEb3VibGVDbGlja31cbiAgICAgIGhhc01lbnVcbiAgICAgIGhpZGVNZW51QmFyPXtoaWRlTWVudUJhcn1cbiAgICAgIGxvY2FsZU1lc3NhZ2VzPXtsb2NhbGVNZXNzYWdlc31cbiAgICAgIG1lbnVPcHRpb25zPXttZW51T3B0aW9uc31cbiAgICAgIGV4ZWN1dGVNZW51QWN0aW9uPXtleGVjdXRlTWVudUFjdGlvbn1cbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgQXBwOiB0cnVlLFxuICAgICAgICAgICdsaWdodC10aGVtZSc6IHRoZW1lID09PSBUaGVtZVR5cGUubGlnaHQsXG4gICAgICAgICAgJ2RhcmstdGhlbWUnOiB0aGVtZSA9PT0gVGhlbWVUeXBlLmRhcmssXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICA8VG9hc3RNYW5hZ2VyIGhpZGVUb2FzdD17aGlkZVRvYXN0fSBpMThuPXtpMThufSB0b2FzdFR5cGU9e3RvYXN0VHlwZX0gLz5cbiAgICAgICAge3JlbmRlckdsb2JhbE1vZGFsQ29udGFpbmVyKCl9XG4gICAgICAgIHtyZW5kZXJDYWxsTWFuYWdlcigpfVxuICAgICAgICB7aXNTaG93aW5nU3Rvcmllc1ZpZXcgJiYgcmVuZGVyU3RvcmllcygpfVxuICAgICAgICB7aGFzU2VsZWN0ZWRTdG9yeURhdGEgJiYgcmVuZGVyU3RvcnlWaWV3ZXIoKX1cbiAgICAgICAge2NvbnRlbnRzfVxuICAgICAgPC9kaXY+XG4gICAgPC9UaXRsZUJhckNvbnRhaW5lcj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWlDO0FBQ2pDLGlCQUF3QjtBQUN4Qix3QkFBdUI7QUFNdkIsaUJBQTRCO0FBQzVCLG1CQUFzQjtBQUN0QiwyQkFBbUM7QUFDbkMsb0NBQXVDO0FBQ3ZDLGtCQUEwQjtBQUMxQiwrQkFBa0M7QUFDbEMsMEJBQTZCO0FBQzdCLCtCQUFrQztBQUNsQyw4QkFBaUM7QUFn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
