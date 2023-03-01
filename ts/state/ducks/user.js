var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var user_exports = {};
__export(user_exports, {
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer
});
module.exports = __toCommonJS(user_exports);
var import_events = require("../../shims/events");
var import_Util = require("../../types/Util");
const actions = {
  userChanged,
  manualReconnect
};
function userChanged(attributes) {
  return {
    type: "USER_CHANGED",
    payload: attributes
  };
}
function manualReconnect() {
  (0, import_events.trigger)("manualConnect");
  return {
    type: "NOOP",
    payload: null
  };
}
function getEmptyState() {
  return {
    attachmentsPath: "missing",
    stickersPath: "missing",
    tempPath: "missing",
    ourConversationId: "missing",
    ourDeviceId: 0,
    ourACI: void 0,
    ourPNI: void 0,
    ourNumber: "missing",
    regionCode: "missing",
    platform: "missing",
    interactionMode: "mouse",
    isMainWindowMaximized: false,
    isMainWindowFullScreen: false,
    menuOptions: {
      development: false,
      devTools: false,
      includeSetup: false,
      isProduction: true,
      platform: "unknown"
    },
    theme: import_Util.ThemeType.light,
    i18n: Object.assign(() => {
      throw new Error("i18n not yet set up");
    }, {
      getLocale() {
        throw new Error("i18n not yet set up");
      }
    }),
    localeMessages: {},
    version: "0.0.0"
  };
}
function reducer(state = getEmptyState(), action) {
  if (!state) {
    return getEmptyState();
  }
  if (action.type === "USER_CHANGED") {
    const { payload } = action;
    return {
      ...state,
      ...payload
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actions,
  getEmptyState,
  reducer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXNlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IHRyaWdnZXIgfSBmcm9tICcuLi8uLi9zaGltcy9ldmVudHMnO1xuXG5pbXBvcnQgdHlwZSB7IE5vb3BBY3Rpb25UeXBlIH0gZnJvbSAnLi9ub29wJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGVNZXNzYWdlc1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9JMThOJztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBNZW51T3B0aW9uc1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9tZW51JztcblxuLy8gU3RhdGVcblxuZXhwb3J0IHR5cGUgVXNlclN0YXRlVHlwZSA9IHtcbiAgYXR0YWNobWVudHNQYXRoOiBzdHJpbmc7XG4gIHN0aWNrZXJzUGF0aDogc3RyaW5nO1xuICB0ZW1wUGF0aDogc3RyaW5nO1xuICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBvdXJEZXZpY2VJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBvdXJBQ0k6IFVVSURTdHJpbmdUeXBlIHwgdW5kZWZpbmVkO1xuICBvdXJQTkk6IFVVSURTdHJpbmdUeXBlIHwgdW5kZWZpbmVkO1xuICBvdXJOdW1iZXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgcGxhdGZvcm06IHN0cmluZztcbiAgcmVnaW9uQ29kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBsb2NhbGVNZXNzYWdlczogTG9jYWxlTWVzc2FnZXNUeXBlO1xuICBpbnRlcmFjdGlvbk1vZGU6ICdtb3VzZScgfCAna2V5Ym9hcmQnO1xuICBpc01haW5XaW5kb3dNYXhpbWl6ZWQ6IGJvb2xlYW47XG4gIGlzTWFpbldpbmRvd0Z1bGxTY3JlZW46IGJvb2xlYW47XG4gIG1lbnVPcHRpb25zOiBNZW51T3B0aW9uc1R5cGU7XG4gIHRoZW1lOiBUaGVtZVR5cGU7XG4gIHZlcnNpb246IHN0cmluZztcbn07XG5cbi8vIEFjdGlvbnNcblxudHlwZSBVc2VyQ2hhbmdlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdVU0VSX0NIQU5HRUQnO1xuICBwYXlsb2FkOiB7XG4gICAgb3VyQ29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gICAgb3VyRGV2aWNlSWQ/OiBudW1iZXI7XG4gICAgb3VyQUNJPzogVVVJRFN0cmluZ1R5cGU7XG4gICAgb3VyUE5JPzogVVVJRFN0cmluZ1R5cGU7XG4gICAgb3VyTnVtYmVyPzogc3RyaW5nO1xuICAgIHJlZ2lvbkNvZGU/OiBzdHJpbmc7XG4gICAgaW50ZXJhY3Rpb25Nb2RlPzogJ21vdXNlJyB8ICdrZXlib2FyZCc7XG4gICAgdGhlbWU/OiBUaGVtZVR5cGU7XG4gICAgaXNNYWluV2luZG93TWF4aW1pemVkPzogYm9vbGVhbjtcbiAgICBpc01haW5XaW5kb3dGdWxsU2NyZWVuPzogYm9vbGVhbjtcbiAgICBtZW51T3B0aW9ucz86IE1lbnVPcHRpb25zVHlwZTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFVzZXJBY3Rpb25UeXBlID0gVXNlckNoYW5nZWRBY3Rpb25UeXBlO1xuXG4vLyBBY3Rpb24gQ3JlYXRvcnNcblxuZXhwb3J0IGNvbnN0IGFjdGlvbnMgPSB7XG4gIHVzZXJDaGFuZ2VkLFxuICBtYW51YWxSZWNvbm5lY3QsXG59O1xuXG5mdW5jdGlvbiB1c2VyQ2hhbmdlZChhdHRyaWJ1dGVzOiB7XG4gIGludGVyYWN0aW9uTW9kZT86ICdtb3VzZScgfCAna2V5Ym9hcmQnO1xuICBvdXJDb252ZXJzYXRpb25JZD86IHN0cmluZztcbiAgb3VyRGV2aWNlSWQ/OiBudW1iZXI7XG4gIG91ck51bWJlcj86IHN0cmluZztcbiAgb3VyQUNJPzogVVVJRFN0cmluZ1R5cGU7XG4gIG91clBOST86IFVVSURTdHJpbmdUeXBlO1xuICByZWdpb25Db2RlPzogc3RyaW5nO1xuICB0aGVtZT86IFRoZW1lVHlwZTtcbiAgaXNNYWluV2luZG93TWF4aW1pemVkPzogYm9vbGVhbjtcbiAgaXNNYWluV2luZG93RnVsbFNjcmVlbj86IGJvb2xlYW47XG4gIG1lbnVPcHRpb25zPzogTWVudU9wdGlvbnNUeXBlO1xufSk6IFVzZXJDaGFuZ2VkQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1VTRVJfQ0hBTkdFRCcsXG4gICAgcGF5bG9hZDogYXR0cmlidXRlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFudWFsUmVjb25uZWN0KCk6IE5vb3BBY3Rpb25UeXBlIHtcbiAgdHJpZ2dlcignbWFudWFsQ29ubmVjdCcpO1xuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ05PT1AnLFxuICAgIHBheWxvYWQ6IG51bGwsXG4gIH07XG59XG5cbi8vIFJlZHVjZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVtcHR5U3RhdGUoKTogVXNlclN0YXRlVHlwZSB7XG4gIHJldHVybiB7XG4gICAgYXR0YWNobWVudHNQYXRoOiAnbWlzc2luZycsXG4gICAgc3RpY2tlcnNQYXRoOiAnbWlzc2luZycsXG4gICAgdGVtcFBhdGg6ICdtaXNzaW5nJyxcbiAgICBvdXJDb252ZXJzYXRpb25JZDogJ21pc3NpbmcnLFxuICAgIG91ckRldmljZUlkOiAwLFxuICAgIG91ckFDSTogdW5kZWZpbmVkLFxuICAgIG91clBOSTogdW5kZWZpbmVkLFxuICAgIG91ck51bWJlcjogJ21pc3NpbmcnLFxuICAgIHJlZ2lvbkNvZGU6ICdtaXNzaW5nJyxcbiAgICBwbGF0Zm9ybTogJ21pc3NpbmcnLFxuICAgIGludGVyYWN0aW9uTW9kZTogJ21vdXNlJyxcbiAgICBpc01haW5XaW5kb3dNYXhpbWl6ZWQ6IGZhbHNlLFxuICAgIGlzTWFpbldpbmRvd0Z1bGxTY3JlZW46IGZhbHNlLFxuICAgIG1lbnVPcHRpb25zOiB7XG4gICAgICBkZXZlbG9wbWVudDogZmFsc2UsXG4gICAgICBkZXZUb29sczogZmFsc2UsXG4gICAgICBpbmNsdWRlU2V0dXA6IGZhbHNlLFxuICAgICAgaXNQcm9kdWN0aW9uOiB0cnVlLFxuICAgICAgcGxhdGZvcm06ICd1bmtub3duJyxcbiAgICB9LFxuICAgIHRoZW1lOiBUaGVtZVR5cGUubGlnaHQsXG4gICAgaTE4bjogT2JqZWN0LmFzc2lnbihcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpMThuIG5vdCB5ZXQgc2V0IHVwJyk7XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBnZXRMb2NhbGUoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpMThuIG5vdCB5ZXQgc2V0IHVwJyk7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKSxcbiAgICBsb2NhbGVNZXNzYWdlczoge30sXG4gICAgdmVyc2lvbjogJzAuMC4wJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoXG4gIHN0YXRlOiBSZWFkb25seTxVc2VyU3RhdGVUeXBlPiA9IGdldEVtcHR5U3RhdGUoKSxcbiAgYWN0aW9uOiBSZWFkb25seTxVc2VyQWN0aW9uVHlwZT5cbik6IFVzZXJTdGF0ZVR5cGUge1xuICBpZiAoIXN0YXRlKSB7XG4gICAgcmV0dXJuIGdldEVtcHR5U3RhdGUoKTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1VTRVJfQ0hBTkdFRCcpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIC4uLnBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXdCO0FBS3hCLGtCQUEwQjtBQWtEbkIsTUFBTSxVQUFVO0FBQUEsRUFDckI7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxxQkFBcUIsWUFZSztBQUN4QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsRUFDWDtBQUNGO0FBakJTLEFBbUJULDJCQUEyQztBQUN6Qyw2QkFBUSxlQUFlO0FBRXZCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxFQUNYO0FBQ0Y7QUFQUyxBQVdGLHlCQUF3QztBQUM3QyxTQUFPO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxJQUNqQixjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixtQkFBbUI7QUFBQSxJQUNuQixhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxZQUFZO0FBQUEsSUFDWixVQUFVO0FBQUEsSUFDVixpQkFBaUI7QUFBQSxJQUNqQix1QkFBdUI7QUFBQSxJQUN2Qix3QkFBd0I7QUFBQSxJQUN4QixhQUFhO0FBQUEsTUFDWCxhQUFhO0FBQUEsTUFDYixVQUFVO0FBQUEsTUFDVixjQUFjO0FBQUEsTUFDZCxjQUFjO0FBQUEsTUFDZCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsT0FBTyxzQkFBVTtBQUFBLElBQ2pCLE1BQU0sT0FBTyxPQUNYLE1BQU07QUFDSixZQUFNLElBQUksTUFBTSxxQkFBcUI7QUFBQSxJQUN2QyxHQUNBO0FBQUEsTUFDRSxZQUFZO0FBQ1YsY0FBTSxJQUFJLE1BQU0scUJBQXFCO0FBQUEsTUFDdkM7QUFBQSxJQUNGLENBQ0Y7QUFBQSxJQUNBLGdCQUFnQixDQUFDO0FBQUEsSUFDakIsU0FBUztBQUFBLEVBQ1g7QUFDRjtBQXBDZ0IsQUFzQ1QsaUJBQ0wsUUFBaUMsY0FBYyxHQUMvQyxRQUNlO0FBQ2YsTUFBSSxDQUFDLE9BQU87QUFDVixXQUFPLGNBQWM7QUFBQSxFQUN2QjtBQUVBLE1BQUksT0FBTyxTQUFTLGdCQUFnQjtBQUNsQyxVQUFNLEVBQUUsWUFBWTtBQUVwQixXQUFPO0FBQUEsU0FDRjtBQUFBLFNBQ0E7QUFBQSxJQUNMO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFDVDtBQWxCZ0IiLAogICJuYW1lcyI6IFtdCn0K
