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
var StartNewConversation_exports = {};
__export(StartNewConversation_exports, {
  StartNewConversation: () => StartNewConversation
});
module.exports = __toCommonJS(StartNewConversation_exports);
var import_react = __toESM(require("react"));
var import_Button = require("../Button");
var import_ConfirmationDialog = require("../ConfirmationDialog");
var import_BaseConversationListItem = require("./BaseConversationListItem");
var import_Colors = require("../../types/Colors");
const StartNewConversation = import_react.default.memo(/* @__PURE__ */ __name(function StartNewConversation2({
  i18n,
  phoneNumber,
  isFetching,
  lookupConversationWithoutUuid,
  showUserNotFoundModal,
  setIsFetchingUUID,
  showConversation
}) {
  const [isModalVisible, setIsModalVisible] = (0, import_react.useState)(false);
  const boundOnClick = (0, import_react.useCallback)(async () => {
    if (!phoneNumber.isValid) {
      setIsModalVisible(true);
      return;
    }
    if (isFetching) {
      return;
    }
    const conversationId = await lookupConversationWithoutUuid({
      showUserNotFoundModal,
      setIsFetchingUUID,
      type: "e164",
      e164: phoneNumber.e164,
      phoneNumber: phoneNumber.userInput
    });
    if (conversationId !== void 0) {
      showConversation({ conversationId });
    }
  }, [
    showConversation,
    lookupConversationWithoutUuid,
    showUserNotFoundModal,
    setIsFetchingUUID,
    setIsModalVisible,
    phoneNumber,
    isFetching
  ]);
  let modal;
  if (isModalVisible) {
    modal = /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
      cancelText: i18n("ok"),
      cancelButtonVariant: import_Button.ButtonVariant.Secondary,
      i18n,
      onClose: () => setIsModalVisible(false)
    }, i18n("startConversation--phone-number-not-valid", {
      phoneNumber: phoneNumber.userInput
    }));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_BaseConversationListItem.BaseConversationListItem, {
    acceptedMessageRequest: false,
    color: import_Colors.AvatarColors[0],
    conversationType: "direct",
    headerName: phoneNumber.userInput,
    i18n,
    isMe: false,
    isSelected: false,
    onClick: boundOnClick,
    phoneNumber: phoneNumber.userInput,
    shouldShowSpinner: isFetching,
    sharedGroupNames: [],
    title: phoneNumber.userInput
  }), modal);
}, "StartNewConversation"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StartNewConversation
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RhcnROZXdDb252ZXJzYXRpb24udHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBGdW5jdGlvbkNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuLi9CdXR0b24nO1xuaW1wb3J0IHsgQ29uZmlybWF0aW9uRGlhbG9nIH0gZnJvbSAnLi4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IEJhc2VDb252ZXJzYXRpb25MaXN0SXRlbSB9IGZyb20gJy4vQmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtJztcblxuaW1wb3J0IHR5cGUgeyBQYXJzZWRFMTY0VHlwZSB9IGZyb20gJy4uLy4uL3V0aWwvbGlicGhvbmVudW1iZXJJbnN0YW5jZSc7XG5pbXBvcnQgdHlwZSB7IExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGUgfSBmcm9tICcuLi8uLi91dGlsL2xvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBTaG93Q29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgQXZhdGFyQ29sb3JzIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ29sb3JzJztcblxudHlwZSBQcm9wc0RhdGEgPSB7XG4gIHBob25lTnVtYmVyOiBQYXJzZWRFMTY0VHlwZTtcbiAgaXNGZXRjaGluZzogYm9vbGVhbjtcbn07XG5cbnR5cGUgUHJvcHNIb3VzZWtlZXBpbmcgPSB7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIHNob3dDb252ZXJzYXRpb246IFNob3dDb252ZXJzYXRpb25UeXBlO1xufSAmIExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGU7XG5cbmV4cG9ydCB0eXBlIFByb3BzID0gUHJvcHNEYXRhICYgUHJvcHNIb3VzZWtlZXBpbmc7XG5cbmV4cG9ydCBjb25zdCBTdGFydE5ld0NvbnZlcnNhdGlvbjogRnVuY3Rpb25Db21wb25lbnQ8UHJvcHM+ID0gUmVhY3QubWVtbyhcbiAgZnVuY3Rpb24gU3RhcnROZXdDb252ZXJzYXRpb24oe1xuICAgIGkxOG4sXG4gICAgcGhvbmVOdW1iZXIsXG4gICAgaXNGZXRjaGluZyxcbiAgICBsb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZCxcbiAgICBzaG93VXNlck5vdEZvdW5kTW9kYWwsXG4gICAgc2V0SXNGZXRjaGluZ1VVSUQsXG4gICAgc2hvd0NvbnZlcnNhdGlvbixcbiAgfSkge1xuICAgIGNvbnN0IFtpc01vZGFsVmlzaWJsZSwgc2V0SXNNb2RhbFZpc2libGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgY29uc3QgYm91bmRPbkNsaWNrID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFwaG9uZU51bWJlci5pc1ZhbGlkKSB7XG4gICAgICAgIHNldElzTW9kYWxWaXNpYmxlKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNGZXRjaGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IGF3YWl0IGxvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkKHtcbiAgICAgICAgc2hvd1VzZXJOb3RGb3VuZE1vZGFsLFxuICAgICAgICBzZXRJc0ZldGNoaW5nVVVJRCxcblxuICAgICAgICB0eXBlOiAnZTE2NCcsXG4gICAgICAgIGUxNjQ6IHBob25lTnVtYmVyLmUxNjQsXG4gICAgICAgIHBob25lTnVtYmVyOiBwaG9uZU51bWJlci51c2VySW5wdXQsXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbnZlcnNhdGlvbklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2hvd0NvbnZlcnNhdGlvbih7IGNvbnZlcnNhdGlvbklkIH0pO1xuICAgICAgfVxuICAgIH0sIFtcbiAgICAgIHNob3dDb252ZXJzYXRpb24sXG4gICAgICBsb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZCxcbiAgICAgIHNob3dVc2VyTm90Rm91bmRNb2RhbCxcbiAgICAgIHNldElzRmV0Y2hpbmdVVUlELFxuICAgICAgc2V0SXNNb2RhbFZpc2libGUsXG4gICAgICBwaG9uZU51bWJlcixcbiAgICAgIGlzRmV0Y2hpbmcsXG4gICAgXSk7XG5cbiAgICBsZXQgbW9kYWw6IEpTWC5FbGVtZW50IHwgdW5kZWZpbmVkO1xuICAgIGlmIChpc01vZGFsVmlzaWJsZSkge1xuICAgICAgbW9kYWwgPSAoXG4gICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICBjYW5jZWxUZXh0PXtpMThuKCdvaycpfVxuICAgICAgICAgIGNhbmNlbEJ1dHRvblZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU2Vjb25kYXJ5fVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNNb2RhbFZpc2libGUoZmFsc2UpfVxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ3N0YXJ0Q29udmVyc2F0aW9uLS1waG9uZS1udW1iZXItbm90LXZhbGlkJywge1xuICAgICAgICAgICAgcGhvbmVOdW1iZXI6IHBob25lTnVtYmVyLnVzZXJJbnB1dCxcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8PlxuICAgICAgICA8QmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtXG4gICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17ZmFsc2V9XG4gICAgICAgICAgY29sb3I9e0F2YXRhckNvbG9yc1swXX1cbiAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPVwiZGlyZWN0XCJcbiAgICAgICAgICBoZWFkZXJOYW1lPXtwaG9uZU51bWJlci51c2VySW5wdXR9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBpc01lPXtmYWxzZX1cbiAgICAgICAgICBpc1NlbGVjdGVkPXtmYWxzZX1cbiAgICAgICAgICBvbkNsaWNrPXtib3VuZE9uQ2xpY2t9XG4gICAgICAgICAgcGhvbmVOdW1iZXI9e3Bob25lTnVtYmVyLnVzZXJJbnB1dH1cbiAgICAgICAgICBzaG91bGRTaG93U3Bpbm5lcj17aXNGZXRjaGluZ31cbiAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtbXX1cbiAgICAgICAgICB0aXRsZT17cGhvbmVOdW1iZXIudXNlcklucHV0fVxuICAgICAgICAvPlxuICAgICAgICB7bW9kYWx9XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUE2QztBQUU3QyxvQkFBOEI7QUFDOUIsZ0NBQW1DO0FBQ25DLHNDQUF5QztBQU16QyxvQkFBNkI7QUFjdEIsTUFBTSx1QkFBaUQscUJBQU0sS0FDbEUsc0RBQThCO0FBQUEsRUFDNUI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxHQUNDO0FBQ0QsUUFBTSxDQUFDLGdCQUFnQixxQkFBcUIsMkJBQVMsS0FBSztBQUUxRCxRQUFNLGVBQWUsOEJBQVksWUFBWTtBQUMzQyxRQUFJLENBQUMsWUFBWSxTQUFTO0FBQ3hCLHdCQUFrQixJQUFJO0FBQ3RCO0FBQUEsSUFDRjtBQUNBLFFBQUksWUFBWTtBQUNkO0FBQUEsSUFDRjtBQUNBLFVBQU0saUJBQWlCLE1BQU0sOEJBQThCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsTUFFQSxNQUFNO0FBQUEsTUFDTixNQUFNLFlBQVk7QUFBQSxNQUNsQixhQUFhLFlBQVk7QUFBQSxJQUMzQixDQUFDO0FBRUQsUUFBSSxtQkFBbUIsUUFBVztBQUNoQyx1QkFBaUIsRUFBRSxlQUFlLENBQUM7QUFBQSxJQUNyQztBQUFBLEVBQ0YsR0FBRztBQUFBLElBQ0Q7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLENBQUM7QUFFRCxNQUFJO0FBQ0osTUFBSSxnQkFBZ0I7QUFDbEIsWUFDRSxtREFBQztBQUFBLE1BQ0MsWUFBWSxLQUFLLElBQUk7QUFBQSxNQUNyQixxQkFBcUIsNEJBQWM7QUFBQSxNQUNuQztBQUFBLE1BQ0EsU0FBUyxNQUFNLGtCQUFrQixLQUFLO0FBQUEsT0FFckMsS0FBSyw2Q0FBNkM7QUFBQSxNQUNqRCxhQUFhLFlBQVk7QUFBQSxJQUMzQixDQUFDLENBQ0g7QUFBQSxFQUVKO0FBRUEsU0FDRSx3RkFDRSxtREFBQztBQUFBLElBQ0Msd0JBQXdCO0FBQUEsSUFDeEIsT0FBTywyQkFBYTtBQUFBLElBQ3BCLGtCQUFpQjtBQUFBLElBQ2pCLFlBQVksWUFBWTtBQUFBLElBQ3hCO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUEsSUFDVCxhQUFhLFlBQVk7QUFBQSxJQUN6QixtQkFBbUI7QUFBQSxJQUNuQixrQkFBa0IsQ0FBQztBQUFBLElBQ25CLE9BQU8sWUFBWTtBQUFBLEdBQ3JCLEdBQ0MsS0FDSDtBQUVKLEdBNUVBLHVCQTZFRjsiLAogICJuYW1lcyI6IFtdCn0K
