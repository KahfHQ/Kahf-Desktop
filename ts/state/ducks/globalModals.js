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
var globalModals_exports = {};
__export(globalModals_exports, {
  TOGGLE_PROFILE_EDITOR_ERROR: () => TOGGLE_PROFILE_EDITOR_ERROR,
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer,
  useGlobalModalActions: () => useGlobalModalActions
});
module.exports = __toCommonJS(globalModals_exports);
var import_getMessageById = require("../../messages/getMessageById");
var import_message = require("../selectors/message");
var import_useBoundActions = require("../../hooks/useBoundActions");
const HIDE_CONTACT_MODAL = "globalModals/HIDE_CONTACT_MODAL";
const SHOW_CONTACT_MODAL = "globalModals/SHOW_CONTACT_MODAL";
const HIDE_WHATS_NEW_MODAL = "globalModals/HIDE_WHATS_NEW_MODAL_MODAL";
const SHOW_WHATS_NEW_MODAL = "globalModals/SHOW_WHATS_NEW_MODAL_MODAL";
const HIDE_UUID_NOT_FOUND_MODAL = "globalModals/HIDE_UUID_NOT_FOUND_MODAL";
const SHOW_UUID_NOT_FOUND_MODAL = "globalModals/SHOW_UUID_NOT_FOUND_MODAL";
const SHOW_STORIES_SETTINGS = "globalModals/SHOW_STORIES_SETTINGS";
const HIDE_STORIES_SETTINGS = "globalModals/HIDE_STORIES_SETTINGS";
const TOGGLE_FORWARD_MESSAGE_MODAL = "globalModals/TOGGLE_FORWARD_MESSAGE_MODAL";
const TOGGLE_PROFILE_EDITOR = "globalModals/TOGGLE_PROFILE_EDITOR";
const TOGGLE_PROFILE_EDITOR_ERROR = "globalModals/TOGGLE_PROFILE_EDITOR_ERROR";
const TOGGLE_SAFETY_NUMBER_MODAL = "globalModals/TOGGLE_SAFETY_NUMBER_MODAL";
const TOGGLE_SIGNAL_CONNECTIONS_MODAL = "globalModals/TOGGLE_SIGNAL_CONNECTIONS_MODAL";
const actions = {
  hideContactModal,
  showContactModal,
  hideWhatsNewModal,
  showWhatsNewModal,
  hideUserNotFoundModal,
  showUserNotFoundModal,
  hideStoriesSettings,
  showStoriesSettings,
  toggleForwardMessageModal,
  toggleProfileEditor,
  toggleProfileEditorHasError,
  toggleSafetyNumberModal,
  toggleSignalConnectionsModal
};
const useGlobalModalActions = /* @__PURE__ */ __name(() => (0, import_useBoundActions.useBoundActions)(actions), "useGlobalModalActions");
function hideContactModal() {
  return {
    type: HIDE_CONTACT_MODAL
  };
}
function showContactModal(contactId, conversationId) {
  return {
    type: SHOW_CONTACT_MODAL,
    payload: {
      contactId,
      conversationId
    }
  };
}
function hideWhatsNewModal() {
  return {
    type: HIDE_WHATS_NEW_MODAL
  };
}
function showWhatsNewModal() {
  return {
    type: SHOW_WHATS_NEW_MODAL
  };
}
function hideUserNotFoundModal() {
  return {
    type: HIDE_UUID_NOT_FOUND_MODAL
  };
}
function showUserNotFoundModal(payload) {
  return {
    type: SHOW_UUID_NOT_FOUND_MODAL,
    payload
  };
}
function hideStoriesSettings() {
  return { type: HIDE_STORIES_SETTINGS };
}
function showStoriesSettings() {
  return { type: SHOW_STORIES_SETTINGS };
}
function toggleForwardMessageModal(messageId) {
  return async (dispatch, getState) => {
    if (!messageId) {
      dispatch({
        type: TOGGLE_FORWARD_MESSAGE_MODAL,
        payload: void 0
      });
      return;
    }
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      throw new Error(`toggleForwardMessageModal: no message found for ${messageId}`);
    }
    const messagePropsSelector = (0, import_message.getMessagePropsSelector)(getState());
    const messageProps = messagePropsSelector(message.attributes);
    dispatch({
      type: TOGGLE_FORWARD_MESSAGE_MODAL,
      payload: messageProps
    });
  };
}
function toggleProfileEditor() {
  return { type: TOGGLE_PROFILE_EDITOR };
}
function toggleProfileEditorHasError() {
  return { type: TOGGLE_PROFILE_EDITOR_ERROR };
}
function toggleSafetyNumberModal(safetyNumberModalContactId) {
  return {
    type: TOGGLE_SAFETY_NUMBER_MODAL,
    payload: safetyNumberModalContactId
  };
}
function toggleSignalConnectionsModal() {
  return {
    type: TOGGLE_SIGNAL_CONNECTIONS_MODAL
  };
}
function getEmptyState() {
  return {
    isProfileEditorVisible: false,
    isSignalConnectionsVisible: false,
    isStoriesSettingsVisible: false,
    isWhatsNewVisible: false,
    profileEditorHasError: false
  };
}
function reducer(state = getEmptyState(), action) {
  if (action.type === TOGGLE_PROFILE_EDITOR) {
    return {
      ...state,
      isProfileEditorVisible: !state.isProfileEditorVisible
    };
  }
  if (action.type === TOGGLE_PROFILE_EDITOR_ERROR) {
    return {
      ...state,
      profileEditorHasError: !state.profileEditorHasError
    };
  }
  if (action.type === SHOW_WHATS_NEW_MODAL) {
    return {
      ...state,
      isWhatsNewVisible: true
    };
  }
  if (action.type === HIDE_WHATS_NEW_MODAL) {
    return {
      ...state,
      isWhatsNewVisible: false
    };
  }
  if (action.type === HIDE_UUID_NOT_FOUND_MODAL) {
    return {
      ...state,
      userNotFoundModalState: void 0
    };
  }
  if (action.type === SHOW_UUID_NOT_FOUND_MODAL) {
    return {
      ...state,
      userNotFoundModalState: {
        ...action.payload
      }
    };
  }
  if (action.type === SHOW_CONTACT_MODAL) {
    return {
      ...state,
      contactModalState: action.payload
    };
  }
  if (action.type === HIDE_CONTACT_MODAL) {
    return {
      ...state,
      contactModalState: void 0
    };
  }
  if (action.type === TOGGLE_SAFETY_NUMBER_MODAL) {
    return {
      ...state,
      safetyNumberModalContactId: action.payload
    };
  }
  if (action.type === TOGGLE_FORWARD_MESSAGE_MODAL) {
    return {
      ...state,
      forwardMessageProps: action.payload
    };
  }
  if (action.type === HIDE_STORIES_SETTINGS) {
    return {
      ...state,
      isStoriesSettingsVisible: false
    };
  }
  if (action.type === SHOW_STORIES_SETTINGS) {
    return {
      ...state,
      isStoriesSettingsVisible: true
    };
  }
  if (action.type === TOGGLE_SIGNAL_CONNECTIONS_MODAL) {
    return {
      ...state,
      isSignalConnectionsVisible: !state.isSignalConnectionsVisible
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TOGGLE_PROFILE_EDITOR_ERROR,
  actions,
  getEmptyState,
  reducer,
  useGlobalModalActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2xvYmFsTW9kYWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgVGh1bmtBY3Rpb24gfSBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSBhcyBSb290U3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgdHlwZSB7IFByb3BzRm9yTWVzc2FnZSB9IGZyb20gJy4uL3NlbGVjdG9ycy9tZXNzYWdlJztcbmltcG9ydCB7IGdldE1lc3NhZ2VCeUlkIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvZ2V0TWVzc2FnZUJ5SWQnO1xuaW1wb3J0IHsgZ2V0TWVzc2FnZVByb3BzU2VsZWN0b3IgfSBmcm9tICcuLi9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgeyB1c2VCb3VuZEFjdGlvbnMgfSBmcm9tICcuLi8uLi9ob29rcy91c2VCb3VuZEFjdGlvbnMnO1xuXG4vLyBTdGF0ZVxuXG5leHBvcnQgdHlwZSBGb3J3YXJkTWVzc2FnZVByb3BzVHlwZSA9IE9taXQ8UHJvcHNGb3JNZXNzYWdlLCAncmVuZGVyaW5nQ29udGV4dCc+O1xuXG5leHBvcnQgdHlwZSBHbG9iYWxNb2RhbHNTdGF0ZVR5cGUgPSB7XG4gIHJlYWRvbmx5IGNvbnRhY3RNb2RhbFN0YXRlPzogQ29udGFjdE1vZGFsU3RhdGVUeXBlO1xuICByZWFkb25seSBmb3J3YXJkTWVzc2FnZVByb3BzPzogRm9yd2FyZE1lc3NhZ2VQcm9wc1R5cGU7XG4gIHJlYWRvbmx5IGlzUHJvZmlsZUVkaXRvclZpc2libGU6IGJvb2xlYW47XG4gIHJlYWRvbmx5IGlzU3Rvcmllc1NldHRpbmdzVmlzaWJsZTogYm9vbGVhbjtcbiAgcmVhZG9ubHkgaXNTaWduYWxDb25uZWN0aW9uc1Zpc2libGU6IGJvb2xlYW47XG4gIHJlYWRvbmx5IGlzV2hhdHNOZXdWaXNpYmxlOiBib29sZWFuO1xuICByZWFkb25seSBwcm9maWxlRWRpdG9ySGFzRXJyb3I6IGJvb2xlYW47XG4gIHJlYWRvbmx5IHNhZmV0eU51bWJlck1vZGFsQ29udGFjdElkPzogc3RyaW5nO1xuICByZWFkb25seSB1c2VyTm90Rm91bmRNb2RhbFN0YXRlPzogVXNlck5vdEZvdW5kTW9kYWxTdGF0ZVR5cGU7XG59O1xuXG4vLyBBY3Rpb25zXG5cbmNvbnN0IEhJREVfQ09OVEFDVF9NT0RBTCA9ICdnbG9iYWxNb2RhbHMvSElERV9DT05UQUNUX01PREFMJztcbmNvbnN0IFNIT1dfQ09OVEFDVF9NT0RBTCA9ICdnbG9iYWxNb2RhbHMvU0hPV19DT05UQUNUX01PREFMJztcbmNvbnN0IEhJREVfV0hBVFNfTkVXX01PREFMID0gJ2dsb2JhbE1vZGFscy9ISURFX1dIQVRTX05FV19NT0RBTF9NT0RBTCc7XG5jb25zdCBTSE9XX1dIQVRTX05FV19NT0RBTCA9ICdnbG9iYWxNb2RhbHMvU0hPV19XSEFUU19ORVdfTU9EQUxfTU9EQUwnO1xuY29uc3QgSElERV9VVUlEX05PVF9GT1VORF9NT0RBTCA9ICdnbG9iYWxNb2RhbHMvSElERV9VVUlEX05PVF9GT1VORF9NT0RBTCc7XG5jb25zdCBTSE9XX1VVSURfTk9UX0ZPVU5EX01PREFMID0gJ2dsb2JhbE1vZGFscy9TSE9XX1VVSURfTk9UX0ZPVU5EX01PREFMJztcbmNvbnN0IFNIT1dfU1RPUklFU19TRVRUSU5HUyA9ICdnbG9iYWxNb2RhbHMvU0hPV19TVE9SSUVTX1NFVFRJTkdTJztcbmNvbnN0IEhJREVfU1RPUklFU19TRVRUSU5HUyA9ICdnbG9iYWxNb2RhbHMvSElERV9TVE9SSUVTX1NFVFRJTkdTJztcbmNvbnN0IFRPR0dMRV9GT1JXQVJEX01FU1NBR0VfTU9EQUwgPVxuICAnZ2xvYmFsTW9kYWxzL1RPR0dMRV9GT1JXQVJEX01FU1NBR0VfTU9EQUwnO1xuY29uc3QgVE9HR0xFX1BST0ZJTEVfRURJVE9SID0gJ2dsb2JhbE1vZGFscy9UT0dHTEVfUFJPRklMRV9FRElUT1InO1xuZXhwb3J0IGNvbnN0IFRPR0dMRV9QUk9GSUxFX0VESVRPUl9FUlJPUiA9XG4gICdnbG9iYWxNb2RhbHMvVE9HR0xFX1BST0ZJTEVfRURJVE9SX0VSUk9SJztcbmNvbnN0IFRPR0dMRV9TQUZFVFlfTlVNQkVSX01PREFMID0gJ2dsb2JhbE1vZGFscy9UT0dHTEVfU0FGRVRZX05VTUJFUl9NT0RBTCc7XG5jb25zdCBUT0dHTEVfU0lHTkFMX0NPTk5FQ1RJT05TX01PREFMID1cbiAgJ2dsb2JhbE1vZGFscy9UT0dHTEVfU0lHTkFMX0NPTk5FQ1RJT05TX01PREFMJztcblxuZXhwb3J0IHR5cGUgQ29udGFjdE1vZGFsU3RhdGVUeXBlID0ge1xuICBjb250YWN0SWQ6IHN0cmluZztcbiAgY29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBVc2VyTm90Rm91bmRNb2RhbFN0YXRlVHlwZSA9XG4gIHwge1xuICAgICAgdHlwZTogJ3Bob25lTnVtYmVyJztcbiAgICAgIHBob25lTnVtYmVyOiBzdHJpbmc7XG4gICAgfVxuICB8IHtcbiAgICAgIHR5cGU6ICd1c2VybmFtZSc7XG4gICAgICB1c2VybmFtZTogc3RyaW5nO1xuICAgIH07XG5cbnR5cGUgSGlkZUNvbnRhY3RNb2RhbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBISURFX0NPTlRBQ1RfTU9EQUw7XG59O1xuXG50eXBlIFNob3dDb250YWN0TW9kYWxBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgU0hPV19DT05UQUNUX01PREFMO1xuICBwYXlsb2FkOiBDb250YWN0TW9kYWxTdGF0ZVR5cGU7XG59O1xuXG50eXBlIEhpZGVXaGF0c05ld01vZGFsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIEhJREVfV0hBVFNfTkVXX01PREFMO1xufTtcblxudHlwZSBTaG93V2hhdHNOZXdNb2RhbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBTSE9XX1dIQVRTX05FV19NT0RBTDtcbn07XG5cbnR5cGUgSGlkZVVzZXJOb3RGb3VuZE1vZGFsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIEhJREVfVVVJRF9OT1RfRk9VTkRfTU9EQUw7XG59O1xuXG5leHBvcnQgdHlwZSBTaG93VXNlck5vdEZvdW5kTW9kYWxBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgU0hPV19VVUlEX05PVF9GT1VORF9NT0RBTDtcbiAgcGF5bG9hZDogVXNlck5vdEZvdW5kTW9kYWxTdGF0ZVR5cGU7XG59O1xuXG50eXBlIFRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWxBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgVE9HR0xFX0ZPUldBUkRfTUVTU0FHRV9NT0RBTDtcbiAgcGF5bG9hZDogRm9yd2FyZE1lc3NhZ2VQcm9wc1R5cGUgfCB1bmRlZmluZWQ7XG59O1xuXG50eXBlIFRvZ2dsZVByb2ZpbGVFZGl0b3JBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgVE9HR0xFX1BST0ZJTEVfRURJVE9SO1xufTtcblxuZXhwb3J0IHR5cGUgVG9nZ2xlUHJvZmlsZUVkaXRvckVycm9yQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFRPR0dMRV9QUk9GSUxFX0VESVRPUl9FUlJPUjtcbn07XG5cbnR5cGUgVG9nZ2xlU2FmZXR5TnVtYmVyTW9kYWxBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgVE9HR0xFX1NBRkVUWV9OVU1CRVJfTU9EQUw7XG4gIHBheWxvYWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn07XG5cbnR5cGUgVG9nZ2xlU2lnbmFsQ29ubmVjdGlvbnNNb2RhbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBUT0dHTEVfU0lHTkFMX0NPTk5FQ1RJT05TX01PREFMO1xufTtcblxudHlwZSBTaG93U3Rvcmllc1NldHRpbmdzQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIFNIT1dfU1RPUklFU19TRVRUSU5HUztcbn07XG5cbnR5cGUgSGlkZVN0b3JpZXNTZXR0aW5nc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6IHR5cGVvZiBISURFX1NUT1JJRVNfU0VUVElOR1M7XG59O1xuXG5leHBvcnQgdHlwZSBHbG9iYWxNb2RhbHNBY3Rpb25UeXBlID1cbiAgfCBIaWRlQ29udGFjdE1vZGFsQWN0aW9uVHlwZVxuICB8IFNob3dDb250YWN0TW9kYWxBY3Rpb25UeXBlXG4gIHwgSGlkZVdoYXRzTmV3TW9kYWxBY3Rpb25UeXBlXG4gIHwgU2hvd1doYXRzTmV3TW9kYWxBY3Rpb25UeXBlXG4gIHwgSGlkZVVzZXJOb3RGb3VuZE1vZGFsQWN0aW9uVHlwZVxuICB8IFNob3dVc2VyTm90Rm91bmRNb2RhbEFjdGlvblR5cGVcbiAgfCBIaWRlU3Rvcmllc1NldHRpbmdzQWN0aW9uVHlwZVxuICB8IFNob3dTdG9yaWVzU2V0dGluZ3NBY3Rpb25UeXBlXG4gIHwgVG9nZ2xlRm9yd2FyZE1lc3NhZ2VNb2RhbEFjdGlvblR5cGVcbiAgfCBUb2dnbGVQcm9maWxlRWRpdG9yQWN0aW9uVHlwZVxuICB8IFRvZ2dsZVByb2ZpbGVFZGl0b3JFcnJvckFjdGlvblR5cGVcbiAgfCBUb2dnbGVTYWZldHlOdW1iZXJNb2RhbEFjdGlvblR5cGVcbiAgfCBUb2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsQWN0aW9uVHlwZTtcblxuLy8gQWN0aW9uIENyZWF0b3JzXG5cbmV4cG9ydCBjb25zdCBhY3Rpb25zID0ge1xuICBoaWRlQ29udGFjdE1vZGFsLFxuICBzaG93Q29udGFjdE1vZGFsLFxuICBoaWRlV2hhdHNOZXdNb2RhbCxcbiAgc2hvd1doYXRzTmV3TW9kYWwsXG4gIGhpZGVVc2VyTm90Rm91bmRNb2RhbCxcbiAgc2hvd1VzZXJOb3RGb3VuZE1vZGFsLFxuICBoaWRlU3Rvcmllc1NldHRpbmdzLFxuICBzaG93U3Rvcmllc1NldHRpbmdzLFxuICB0b2dnbGVGb3J3YXJkTWVzc2FnZU1vZGFsLFxuICB0b2dnbGVQcm9maWxlRWRpdG9yLFxuICB0b2dnbGVQcm9maWxlRWRpdG9ySGFzRXJyb3IsXG4gIHRvZ2dsZVNhZmV0eU51bWJlck1vZGFsLFxuICB0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsLFxufTtcblxuZXhwb3J0IGNvbnN0IHVzZUdsb2JhbE1vZGFsQWN0aW9ucyA9ICgpOiB0eXBlb2YgYWN0aW9ucyA9PlxuICB1c2VCb3VuZEFjdGlvbnMoYWN0aW9ucyk7XG5cbmZ1bmN0aW9uIGhpZGVDb250YWN0TW9kYWwoKTogSGlkZUNvbnRhY3RNb2RhbEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEhJREVfQ09OVEFDVF9NT0RBTCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2hvd0NvbnRhY3RNb2RhbChcbiAgY29udGFjdElkOiBzdHJpbmcsXG4gIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nXG4pOiBTaG93Q29udGFjdE1vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU0hPV19DT05UQUNUX01PREFMLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIGNvbnRhY3RJZCxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGhpZGVXaGF0c05ld01vZGFsKCk6IEhpZGVXaGF0c05ld01vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogSElERV9XSEFUU19ORVdfTU9EQUwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNob3dXaGF0c05ld01vZGFsKCk6IFNob3dXaGF0c05ld01vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU0hPV19XSEFUU19ORVdfTU9EQUwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGhpZGVVc2VyTm90Rm91bmRNb2RhbCgpOiBIaWRlVXNlck5vdEZvdW5kTW9kYWxBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBISURFX1VVSURfTk9UX0ZPVU5EX01PREFMLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzaG93VXNlck5vdEZvdW5kTW9kYWwoXG4gIHBheWxvYWQ6IFVzZXJOb3RGb3VuZE1vZGFsU3RhdGVUeXBlXG4pOiBTaG93VXNlck5vdEZvdW5kTW9kYWxBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTSE9XX1VVSURfTk9UX0ZPVU5EX01PREFMLFxuICAgIHBheWxvYWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGhpZGVTdG9yaWVzU2V0dGluZ3MoKTogSGlkZVN0b3JpZXNTZXR0aW5nc0FjdGlvblR5cGUge1xuICByZXR1cm4geyB0eXBlOiBISURFX1NUT1JJRVNfU0VUVElOR1MgfTtcbn1cblxuZnVuY3Rpb24gc2hvd1N0b3JpZXNTZXR0aW5ncygpOiBTaG93U3Rvcmllc1NldHRpbmdzQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6IFNIT1dfU1RPUklFU19TRVRUSU5HUyB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVGb3J3YXJkTWVzc2FnZU1vZGFsKFxuICBtZXNzYWdlSWQ/OiBzdHJpbmdcbik6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICBUb2dnbGVGb3J3YXJkTWVzc2FnZU1vZGFsQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgaWYgKCFtZXNzYWdlSWQpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogVE9HR0xFX0ZPUldBUkRfTUVTU0FHRV9NT0RBTCxcbiAgICAgICAgcGF5bG9hZDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG5cbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYHRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWw6IG5vIG1lc3NhZ2UgZm91bmQgZm9yICR7bWVzc2FnZUlkfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZVByb3BzU2VsZWN0b3IgPSBnZXRNZXNzYWdlUHJvcHNTZWxlY3RvcihnZXRTdGF0ZSgpKTtcbiAgICBjb25zdCBtZXNzYWdlUHJvcHMgPSBtZXNzYWdlUHJvcHNTZWxlY3RvcihtZXNzYWdlLmF0dHJpYnV0ZXMpO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVE9HR0xFX0ZPUldBUkRfTUVTU0FHRV9NT0RBTCxcbiAgICAgIHBheWxvYWQ6IG1lc3NhZ2VQcm9wcyxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlUHJvZmlsZUVkaXRvcigpOiBUb2dnbGVQcm9maWxlRWRpdG9yQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6IFRPR0dMRV9QUk9GSUxFX0VESVRPUiB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVQcm9maWxlRWRpdG9ySGFzRXJyb3IoKTogVG9nZ2xlUHJvZmlsZUVkaXRvckVycm9yQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6IFRPR0dMRV9QUk9GSUxFX0VESVRPUl9FUlJPUiB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVTYWZldHlOdW1iZXJNb2RhbChcbiAgc2FmZXR5TnVtYmVyTW9kYWxDb250YWN0SWQ/OiBzdHJpbmdcbik6IFRvZ2dsZVNhZmV0eU51bWJlck1vZGFsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVE9HR0xFX1NBRkVUWV9OVU1CRVJfTU9EQUwsXG4gICAgcGF5bG9hZDogc2FmZXR5TnVtYmVyTW9kYWxDb250YWN0SWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVNpZ25hbENvbm5lY3Rpb25zTW9kYWwoKTogVG9nZ2xlU2lnbmFsQ29ubmVjdGlvbnNNb2RhbEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFRPR0dMRV9TSUdOQUxfQ09OTkVDVElPTlNfTU9EQUwsXG4gIH07XG59XG5cbi8vIFJlZHVjZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVtcHR5U3RhdGUoKTogR2xvYmFsTW9kYWxzU3RhdGVUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICBpc1Byb2ZpbGVFZGl0b3JWaXNpYmxlOiBmYWxzZSxcbiAgICBpc1NpZ25hbENvbm5lY3Rpb25zVmlzaWJsZTogZmFsc2UsXG4gICAgaXNTdG9yaWVzU2V0dGluZ3NWaXNpYmxlOiBmYWxzZSxcbiAgICBpc1doYXRzTmV3VmlzaWJsZTogZmFsc2UsXG4gICAgcHJvZmlsZUVkaXRvckhhc0Vycm9yOiBmYWxzZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoXG4gIHN0YXRlOiBSZWFkb25seTxHbG9iYWxNb2RhbHNTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PEdsb2JhbE1vZGFsc0FjdGlvblR5cGU+XG4pOiBHbG9iYWxNb2RhbHNTdGF0ZVR5cGUge1xuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9QUk9GSUxFX0VESVRPUikge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGlzUHJvZmlsZUVkaXRvclZpc2libGU6ICFzdGF0ZS5pc1Byb2ZpbGVFZGl0b3JWaXNpYmxlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9QUk9GSUxFX0VESVRPUl9FUlJPUikge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHByb2ZpbGVFZGl0b3JIYXNFcnJvcjogIXN0YXRlLnByb2ZpbGVFZGl0b3JIYXNFcnJvcixcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTSE9XX1dIQVRTX05FV19NT0RBTCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGlzV2hhdHNOZXdWaXNpYmxlOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IEhJREVfV0hBVFNfTkVXX01PREFMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgaXNXaGF0c05ld1Zpc2libGU6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IEhJREVfVVVJRF9OT1RfRk9VTkRfTU9EQUwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICB1c2VyTm90Rm91bmRNb2RhbFN0YXRlOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gU0hPV19VVUlEX05PVF9GT1VORF9NT0RBTCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHVzZXJOb3RGb3VuZE1vZGFsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aW9uLnBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFNIT1dfQ09OVEFDVF9NT0RBTCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNvbnRhY3RNb2RhbFN0YXRlOiBhY3Rpb24ucGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBISURFX0NPTlRBQ1RfTU9EQUwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjb250YWN0TW9kYWxTdGF0ZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9TQUZFVFlfTlVNQkVSX01PREFMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc2FmZXR5TnVtYmVyTW9kYWxDb250YWN0SWQ6IGFjdGlvbi5wYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9GT1JXQVJEX01FU1NBR0VfTU9EQUwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBmb3J3YXJkTWVzc2FnZVByb3BzOiBhY3Rpb24ucGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBISURFX1NUT1JJRVNfU0VUVElOR1MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBpc1N0b3JpZXNTZXR0aW5nc1Zpc2libGU6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFNIT1dfU1RPUklFU19TRVRUSU5HUykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGlzU3Rvcmllc1NldHRpbmdzVmlzaWJsZTogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBUT0dHTEVfU0lHTkFMX0NPTk5FQ1RJT05TX01PREFMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgaXNTaWduYWxDb25uZWN0aW9uc1Zpc2libGU6ICFzdGF0ZS5pc1NpZ25hbENvbm5lY3Rpb25zVmlzaWJsZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUEsNEJBQStCO0FBQy9CLHFCQUF3QztBQUN4Qyw2QkFBZ0M7QUFvQmhDLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0sdUJBQXVCO0FBQzdCLE1BQU0sdUJBQXVCO0FBQzdCLE1BQU0sNEJBQTRCO0FBQ2xDLE1BQU0sNEJBQTRCO0FBQ2xDLE1BQU0sd0JBQXdCO0FBQzlCLE1BQU0sd0JBQXdCO0FBQzlCLE1BQU0sK0JBQ0o7QUFDRixNQUFNLHdCQUF3QjtBQUN2QixNQUFNLDhCQUNYO0FBQ0YsTUFBTSw2QkFBNkI7QUFDbkMsTUFB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