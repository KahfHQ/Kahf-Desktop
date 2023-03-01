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
var accounts_exports = {};
__export(accounts_exports, {
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer
});
module.exports = __toCommonJS(accounts_exports);
var Errors = __toESM(require("../../types/errors"));
var log = __toESM(require("../../logging/log"));
const actions = {
  checkForAccount
};
function checkForAccount(phoneNumber) {
  return async (dispatch, getState) => {
    if (!window.textsecure.messaging) {
      dispatch({
        type: "NOOP",
        payload: null
      });
      return;
    }
    const conversation = window.ConversationController.get(phoneNumber);
    if (conversation && conversation.get("uuid")) {
      log.info(`checkForAccount: found ${phoneNumber} in existing contacts`);
      const uuid2 = conversation.get("uuid");
      dispatch({
        type: "accounts/UPDATE",
        payload: {
          phoneNumber,
          uuid: uuid2
        }
      });
      return;
    }
    const state = getState();
    const existing = Object.prototype.hasOwnProperty.call(state.accounts.accounts, phoneNumber);
    if (existing) {
      dispatch({
        type: "NOOP",
        payload: null
      });
    }
    let uuid;
    log.info(`checkForAccount: looking ${phoneNumber} up on server`);
    try {
      const uuidLookup = await window.textsecure.messaging.getUuidsForE164s([
        phoneNumber
      ]);
      uuid = uuidLookup[phoneNumber] || void 0;
    } catch (error) {
      log.error("checkForAccount:", Errors.toLogFormat(error));
    }
    dispatch({
      type: "accounts/UPDATE",
      payload: {
        phoneNumber,
        uuid
      }
    });
  };
}
function getEmptyState() {
  return {
    accounts: {}
  };
}
function reducer(state = getEmptyState(), action) {
  if (!state) {
    return getEmptyState();
  }
  if (action.type === "accounts/UPDATE") {
    const { payload } = action;
    const { phoneNumber, uuid } = payload;
    return {
      ...state,
      accounts: {
        ...state.accounts,
        [phoneNumber]: uuid
      }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWNjb3VudHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBUaHVua0FjdGlvbiB9IGZyb20gJ3JlZHV4LXRodW5rJztcblxuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uLy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSBhcyBSb290U3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5cbmltcG9ydCB0eXBlIHsgTm9vcEFjdGlvblR5cGUgfSBmcm9tICcuL25vb3AnO1xuXG4vLyBTdGF0ZVxuXG5leHBvcnQgdHlwZSBBY2NvdW50c1N0YXRlVHlwZSA9IHtcbiAgYWNjb3VudHM6IFJlY29yZDxzdHJpbmcsIFVVSURTdHJpbmdUeXBlIHwgdW5kZWZpbmVkPjtcbn07XG5cbi8vIEFjdGlvbnNcblxudHlwZSBBY2NvdW50VXBkYXRlQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2FjY291bnRzL1VQREFURSc7XG4gIHBheWxvYWQ6IHtcbiAgICBwaG9uZU51bWJlcjogc3RyaW5nO1xuICAgIHV1aWQ/OiBVVUlEU3RyaW5nVHlwZTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEFjY291bnRzQWN0aW9uVHlwZSA9IEFjY291bnRVcGRhdGVBY3Rpb25UeXBlO1xuXG4vLyBBY3Rpb24gQ3JlYXRvcnNcblxuZXhwb3J0IGNvbnN0IGFjdGlvbnMgPSB7XG4gIGNoZWNrRm9yQWNjb3VudCxcbn07XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQWNjb3VudChcbiAgcGhvbmVOdW1iZXI6IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIEFjY291bnRVcGRhdGVBY3Rpb25UeXBlIHwgTm9vcEFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGlmICghd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6ICdOT09QJyxcbiAgICAgICAgcGF5bG9hZDogbnVsbCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChwaG9uZU51bWJlcik7XG4gICAgaWYgKGNvbnZlcnNhdGlvbiAmJiBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJykpIHtcbiAgICAgIGxvZy5pbmZvKGBjaGVja0ZvckFjY291bnQ6IGZvdW5kICR7cGhvbmVOdW1iZXJ9IGluIGV4aXN0aW5nIGNvbnRhY3RzYCk7XG4gICAgICBjb25zdCB1dWlkID0gY29udmVyc2F0aW9uLmdldCgndXVpZCcpO1xuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6ICdhY2NvdW50cy9VUERBVEUnLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgcGhvbmVOdW1iZXIsXG4gICAgICAgICAgdXVpZCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICBjb25zdCBleGlzdGluZyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiAgICAgIHN0YXRlLmFjY291bnRzLmFjY291bnRzLFxuICAgICAgcGhvbmVOdW1iZXJcbiAgICApO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnTk9PUCcsXG4gICAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgdXVpZDogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQ7XG5cbiAgICBsb2cuaW5mbyhgY2hlY2tGb3JBY2NvdW50OiBsb29raW5nICR7cGhvbmVOdW1iZXJ9IHVwIG9uIHNlcnZlcmApO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1dWlkTG9va3VwID0gYXdhaXQgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLmdldFV1aWRzRm9yRTE2NHMoW1xuICAgICAgICBwaG9uZU51bWJlcixcbiAgICAgIF0pO1xuICAgICAgdXVpZCA9IHV1aWRMb29rdXBbcGhvbmVOdW1iZXJdIHx8IHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKCdjaGVja0ZvckFjY291bnQ6JywgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ2FjY291bnRzL1VQREFURScsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIHBob25lTnVtYmVyLFxuICAgICAgICB1dWlkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBBY2NvdW50c1N0YXRlVHlwZSB7XG4gIHJldHVybiB7XG4gICAgYWNjb3VudHM6IHt9LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihcbiAgc3RhdGU6IFJlYWRvbmx5PEFjY291bnRzU3RhdGVUeXBlPiA9IGdldEVtcHR5U3RhdGUoKSxcbiAgYWN0aW9uOiBSZWFkb25seTxBY2NvdW50c0FjdGlvblR5cGU+XG4pOiBBY2NvdW50c1N0YXRlVHlwZSB7XG4gIGlmICghc3RhdGUpIHtcbiAgICByZXR1cm4gZ2V0RW1wdHlTdGF0ZSgpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnYWNjb3VudHMvVVBEQVRFJykge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgcGhvbmVOdW1iZXIsIHV1aWQgfSA9IHBheWxvYWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY2NvdW50czoge1xuICAgICAgICAuLi5zdGF0ZS5hY2NvdW50cyxcbiAgICAgICAgW3Bob25lTnVtYmVyXTogdXVpZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0EsYUFBd0I7QUFDeEIsVUFBcUI7QUEyQmQsTUFBTSxVQUFVO0FBQUEsRUFDckI7QUFDRjtBQUVBLHlCQUNFLGFBTUE7QUFDQSxTQUFPLE9BQU8sVUFBVSxhQUFhO0FBQ25DLFFBQUksQ0FBQyxPQUFPLFdBQVcsV0FBVztBQUNoQyxlQUFTO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQ0Q7QUFBQSxJQUNGO0FBRUEsVUFBTSxlQUFlLE9BQU8sdUJBQXVCLElBQUksV0FBVztBQUNsRSxRQUFJLGdCQUFnQixhQUFhLElBQUksTUFBTSxHQUFHO0FBQzVDLFVBQUksS0FBSywwQkFBMEIsa0NBQWtDO0FBQ3JFLFlBQU0sUUFBTyxhQUFhLElBQUksTUFBTTtBQUVwQyxlQUFTO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQ0Q7QUFBQSxJQUNGO0FBRUEsVUFBTSxRQUFRLFNBQVM7QUFDdkIsVUFBTSxXQUFXLE9BQU8sVUFBVSxlQUFlLEtBQy9DLE1BQU0sU0FBUyxVQUNmLFdBQ0Y7QUFDQSxRQUFJLFVBQVU7QUFDWixlQUFTO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUVBLFFBQUk7QUFFSixRQUFJLEtBQUssNEJBQTRCLDBCQUEwQjtBQUMvRCxRQUFJO0FBQ0YsWUFBTSxhQUFhLE1BQU0sT0FBTyxXQUFXLFVBQVUsaUJBQWlCO0FBQUEsUUFDcEU7QUFBQSxNQUNGLENBQUM7QUFDRCxhQUFPLFdBQVcsZ0JBQWdCO0FBQUEsSUFDcEMsU0FBUyxPQUFQO0FBQ0EsVUFBSSxNQUFNLG9CQUFvQixPQUFPLFlBQVksS0FBSyxDQUFDO0FBQUEsSUFDekQ7QUFFQSxhQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBaEVTLEFBb0VGLHlCQUE0QztBQUNqRCxTQUFPO0FBQUEsSUFDTCxVQUFVLENBQUM7QUFBQSxFQUNiO0FBQ0Y7QUFKZ0IsQUFNVCxpQkFDTCxRQUFxQyxjQUFjLEdBQ25ELFFBQ21CO0FBQ25CLE1BQUksQ0FBQyxPQUFPO0FBQ1YsV0FBTyxjQUFjO0FBQUEsRUFDdkI7QUFFQSxNQUFJLE9BQU8sU0FBUyxtQkFBbUI7QUFDckMsVUFBTSxFQUFFLFlBQVk7QUFDcEIsVUFBTSxFQUFFLGFBQWEsU0FBUztBQUU5QixXQUFPO0FBQUEsU0FDRjtBQUFBLE1BQ0gsVUFBVTtBQUFBLFdBQ0wsTUFBTTtBQUFBLFNBQ1IsY0FBYztBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQ1Q7QUF0QmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
