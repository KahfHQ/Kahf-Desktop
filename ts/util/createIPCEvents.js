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
var createIPCEvents_exports = {};
__export(createIPCEvents_exports, {
  createIPCEvents: () => createIPCEvents
});
module.exports = __toCommonJS(createIPCEvents_exports);
var import_electron = require("electron");
var React = __toESM(require("react"));
var RemoteConfig = __toESM(require("../RemoteConfig"));
var import_Colors = require("../types/Colors");
var Stickers = __toESM(require("../types/Stickers"));
var import_SystemTraySetting = require("../types/SystemTraySetting");
var import_ReactWrapperView = require("../views/ReactWrapperView");
var import_ErrorModal = require("../components/ErrorModal");
var import_calling = require("../services/calling");
var import_conversations = require("../state/selectors/conversations");
var import_items = require("../state/selectors/items");
var import_events = require("../shims/events");
var import_themeChanged = require("../shims/themeChanged");
var import_renderClearingDataView = require("../shims/renderClearingDataView");
var universalExpireTimer = __toESM(require("./universalExpireTimer"));
var import_phoneNumberDiscoverability = require("./phoneNumberDiscoverability");
var import_phoneNumberSharingMode = require("./phoneNumberSharingMode");
var import_assert = require("./assert");
var durations = __toESM(require("./durations"));
var import_isPhoneNumberSharingEnabled = require("./isPhoneNumberSharingEnabled");
var import_sgnlHref = require("./sgnlHref");
var log = __toESM(require("../logging/log"));
function createIPCEvents(overrideEvents = {}) {
  return {
    getDeviceName: () => window.textsecure.storage.user.getDeviceName(),
    getZoomFactor: () => window.storage.get("zoomFactor", 1),
    setZoomFactor: async (zoomFactor) => {
      import_electron.webFrame.setZoomFactor(zoomFactor);
    },
    getHasStoriesEnabled: () => window.storage.get("hasStoriesEnabled", true),
    setHasStoriesEnabled: (value) => window.storage.put("hasStoriesEnabled", value),
    getPreferredAudioInputDevice: () => window.storage.get("preferred-audio-input-device"),
    setPreferredAudioInputDevice: (device) => window.storage.put("preferred-audio-input-device", device),
    getPreferredAudioOutputDevice: () => window.storage.get("preferred-audio-output-device"),
    setPreferredAudioOutputDevice: (device) => window.storage.put("preferred-audio-output-device", device),
    getPreferredVideoInputDevice: () => window.storage.get("preferred-video-input-device"),
    setPreferredVideoInputDevice: (device) => window.storage.put("preferred-video-input-device", device),
    getCustomColors: () => {
      return (0, import_items.getCustomColors)(window.reduxStore.getState()) || {};
    },
    getConversationsWithCustomColor: (colorId) => {
      return (0, import_conversations.getConversationsWithCustomColorSelector)(window.reduxStore.getState())(colorId);
    },
    addCustomColor: (...args) => window.reduxActions.items.addCustomColor(...args),
    editCustomColor: (...args) => window.reduxActions.items.editCustomColor(...args),
    removeCustomColor: (colorId) => window.reduxActions.items.removeCustomColor(colorId),
    removeCustomColorOnConversations: (colorId) => window.reduxActions.conversations.removeCustomColorOnConversations(colorId),
    resetAllChatColors: () => window.reduxActions.conversations.resetAllChatColors(),
    resetDefaultChatColor: () => window.reduxActions.items.resetDefaultChatColor(),
    setGlobalDefaultConversationColor: (...args) => window.reduxActions.items.setGlobalDefaultConversationColor(...args),
    getAvailableIODevices: async () => {
      const { availableCameras, availableMicrophones, availableSpeakers } = await import_calling.calling.getAvailableIODevices();
      return {
        availableCameras: availableCameras.map((inputDeviceInfo) => ({
          deviceId: inputDeviceInfo.deviceId,
          groupId: inputDeviceInfo.groupId,
          kind: inputDeviceInfo.kind,
          label: inputDeviceInfo.label
        })),
        availableMicrophones,
        availableSpeakers
      };
    },
    getBlockedCount: () => window.storage.blocked.getBlockedUuids().length + window.storage.blocked.getBlockedGroups().length,
    getDefaultConversationColor: () => window.storage.get("defaultConversationColor", import_Colors.DEFAULT_CONVERSATION_COLOR),
    getLinkPreviewSetting: () => window.storage.get("linkPreviews", false),
    getPhoneNumberDiscoverabilitySetting: () => window.storage.get("phoneNumberDiscoverability", import_phoneNumberDiscoverability.PhoneNumberDiscoverability.NotDiscoverable),
    getPhoneNumberSharingSetting: () => window.storage.get("phoneNumberSharingMode", import_phoneNumberSharingMode.PhoneNumberSharingMode.Nobody),
    getReadReceiptSetting: () => window.storage.get("read-receipt-setting", false),
    getTypingIndicatorSetting: () => window.storage.get("typingIndicators", false),
    getAutoDownloadUpdate: () => window.storage.get("auto-download-update", true),
    setAutoDownloadUpdate: (value) => window.storage.put("auto-download-update", value),
    getThemeSetting: () => window.storage.get("theme-setting", "system"),
    setThemeSetting: (value) => {
      const promise = window.storage.put("theme-setting", value);
      (0, import_themeChanged.themeChanged)();
      return promise;
    },
    getHideMenuBar: () => window.storage.get("hide-menu-bar"),
    setHideMenuBar: (value) => {
      const promise = window.storage.put("hide-menu-bar", value);
      window.setAutoHideMenuBar(value);
      window.setMenuBarVisibility(!value);
      return promise;
    },
    getSystemTraySetting: () => (0, import_SystemTraySetting.parseSystemTraySetting)(window.storage.get("system-tray-setting")),
    setSystemTraySetting: (value) => {
      const promise = window.storage.put("system-tray-setting", value);
      window.updateSystemTraySetting(value);
      return promise;
    },
    getNotificationSetting: () => window.storage.get("notification-setting", "message"),
    setNotificationSetting: (value) => window.storage.put("notification-setting", value),
    getNotificationDrawAttention: () => window.storage.get("notification-draw-attention", true),
    setNotificationDrawAttention: (value) => window.storage.put("notification-draw-attention", value),
    getAudioNotification: () => window.storage.get("audio-notification"),
    setAudioNotification: (value) => window.storage.put("audio-notification", value),
    getCountMutedConversations: () => window.storage.get("badge-count-muted-conversations", false),
    setCountMutedConversations: (value) => {
      const promise = window.storage.put("badge-count-muted-conversations", value);
      window.Whisper.events.trigger("updateUnreadCount");
      return promise;
    },
    getCallRingtoneNotification: () => window.storage.get("call-ringtone-notification", true),
    setCallRingtoneNotification: (value) => window.storage.put("call-ringtone-notification", value),
    getCallSystemNotification: () => window.storage.get("call-system-notification", true),
    setCallSystemNotification: (value) => window.storage.put("call-system-notification", value),
    getIncomingCallNotification: () => window.storage.get("incoming-call-notification", true),
    setIncomingCallNotification: (value) => window.storage.put("incoming-call-notification", value),
    getSpellCheck: () => window.storage.get("spell-check", true),
    setSpellCheck: (value) => window.storage.put("spell-check", value),
    getAlwaysRelayCalls: () => window.storage.get("always-relay-calls"),
    setAlwaysRelayCalls: (value) => window.storage.put("always-relay-calls", value),
    getAutoLaunch: () => window.getAutoLaunch(),
    setAutoLaunch: async (value) => {
      return window.setAutoLaunch(value);
    },
    isPhoneNumberSharingEnabled: () => (0, import_isPhoneNumberSharingEnabled.isPhoneNumberSharingEnabled)(),
    isPrimary: () => window.textsecure.storage.user.getDeviceId() === 1,
    shouldShowStoriesSettings: () => RemoteConfig.isEnabled("desktop.internalUser") || RemoteConfig.isEnabled("desktop.stories"),
    syncRequest: () => new Promise((resolve, reject) => {
      const FIVE_MINUTES = 5 * durations.MINUTE;
      const syncRequest = window.getSyncRequest(FIVE_MINUTES);
      syncRequest.addEventListener("success", () => resolve());
      syncRequest.addEventListener("timeout", () => reject(new Error("timeout")));
    }),
    getLastSyncTime: () => window.storage.get("synced_at"),
    setLastSyncTime: (value) => window.storage.put("synced_at", value),
    getUniversalExpireTimer: () => universalExpireTimer.get(),
    setUniversalExpireTimer: async (newValue) => {
      await universalExpireTimer.set(newValue);
      const conversationId = window.ConversationController.getOurConversationIdOrThrow();
      const account = window.ConversationController.get(conversationId);
      (0, import_assert.assert)(account, "Account wasn't found");
      account.captureChange("universalExpireTimer");
      const state = window.reduxStore.getState();
      const selectedId = state.conversations.selectedConversationId;
      if (selectedId) {
        const conversation = window.ConversationController.get(selectedId);
        (0, import_assert.assert)(conversation, "Conversation wasn't found");
        await conversation.updateLastMessage();
      }
    },
    addDarkOverlay: () => {
      if ($(".dark-overlay").length) {
        return;
      }
      $(document.body).prepend('<div class="dark-overlay"></div>');
      $(".dark-overlay").on("click", () => $(".dark-overlay").remove());
    },
    removeDarkOverlay: () => $(".dark-overlay").remove(),
    showKeyboardShortcuts: () => window.showKeyboardShortcuts(),
    deleteAllData: async () => {
      await window.Signal.Data.goBackToMainProcess();
      (0, import_renderClearingDataView.renderClearingDataView)();
    },
    closeDB: async () => {
      await window.Signal.Data.goBackToMainProcess();
    },
    showStickerPack: (packId, key) => {
      if (!window.Signal.Util.Registration.everDone()) {
        log.warn("showStickerPack: Not registered, returning early");
        return;
      }
      if (window.isShowingModal) {
        log.warn("showStickerPack: Already showing modal, returning early");
        return;
      }
      try {
        window.isShowingModal = true;
        Stickers.downloadEphemeralPack(packId, key);
        const props = {
          packId,
          onClose: async () => {
            window.isShowingModal = false;
            stickerPreviewModalView.remove();
            await Stickers.removeEphemeralPack(packId);
          }
        };
        const stickerPreviewModalView = new import_ReactWrapperView.ReactWrapperView({
          className: "sticker-preview-modal-wrapper",
          JSX: window.Signal.State.Roots.createStickerPreviewModal(window.reduxStore, props)
        });
      } catch (error) {
        window.isShowingModal = false;
        log.error("showStickerPack: Ran into an error!", error && error.stack ? error.stack : error);
        const errorView = new import_ReactWrapperView.ReactWrapperView({
          className: "error-modal-wrapper",
          JSX: /* @__PURE__ */ React.createElement(import_ErrorModal.ErrorModal, {
            i18n: window.i18n,
            onClose: () => {
              errorView.remove();
            }
          })
        });
      }
    },
    showGroupViaLink: async (hash) => {
      if (!window.Signal.Util.Registration.everDone()) {
        log.warn("showGroupViaLink: Not registered, returning early");
        return;
      }
      if (window.isShowingModal) {
        log.warn("showGroupViaLink: Already showing modal, returning early");
        return;
      }
      try {
        await window.Signal.Groups.joinViaLink(hash);
      } catch (error) {
        log.error("showGroupViaLink: Ran into an error!", error && error.stack ? error.stack : error);
        const errorView = new import_ReactWrapperView.ReactWrapperView({
          className: "error-modal-wrapper",
          JSX: /* @__PURE__ */ React.createElement(import_ErrorModal.ErrorModal, {
            i18n: window.i18n,
            title: window.i18n("GroupV2--join--general-join-failure--title"),
            description: window.i18n("GroupV2--join--general-join-failure"),
            onClose: () => {
              errorView.remove();
            }
          })
        });
      }
      window.isShowingModal = false;
    },
    showConversationViaSignalDotMe(hash) {
      if (!window.Signal.Util.Registration.everDone()) {
        log.info("showConversationViaSignalDotMe: Not registered, returning early");
        return;
      }
      const maybeE164 = (0, import_sgnlHref.parseE164FromSignalDotMeHash)(hash);
      if (maybeE164) {
        (0, import_events.trigger)("showConversation", maybeE164);
        return;
      }
      log.info("showConversationViaSignalDotMe: invalid E164");
      if (window.isShowingModal) {
        log.info("showConversationViaSignalDotMe: a modal is already showing. Doing nothing");
      } else {
        showUnknownSgnlLinkModal();
      }
    },
    unknownSignalLink: () => {
      log.warn("unknownSignalLink: Showing error dialog");
      showUnknownSgnlLinkModal();
    },
    installStickerPack: async (packId, key) => {
      Stickers.downloadStickerPack(packId, key, {
        finalStatus: "installed"
      });
    },
    shutdown: () => Promise.resolve(),
    showReleaseNotes: () => {
      const { showWhatsNewModal } = window.reduxActions.globalModals;
      showWhatsNewModal();
    },
    getMediaPermissions: window.getMediaPermissions,
    getMediaCameraPermissions: window.getMediaCameraPermissions,
    persistZoomFactor: (zoomFactor) => window.storage.put("zoomFactor", zoomFactor),
    ...overrideEvents
  };
}
function showUnknownSgnlLinkModal() {
  const errorView = new import_ReactWrapperView.ReactWrapperView({
    className: "error-modal-wrapper",
    JSX: /* @__PURE__ */ React.createElement(import_ErrorModal.ErrorModal, {
      i18n: window.i18n,
      description: window.i18n("unknown-sgnl-link"),
      onClose: () => {
        errorView.remove();
      }
    })
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createIPCEvents
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY3JlYXRlSVBDRXZlbnRzLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IHdlYkZyYW1lIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHR5cGUgeyBBdWRpb0RldmljZSB9IGZyb20gJ3JpbmdydGMnO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0ICogYXMgUmVtb3RlQ29uZmlnIGZyb20gJy4uL1JlbW90ZUNvbmZpZyc7XG5cbmltcG9ydCB0eXBlIHsgWm9vbUZhY3RvclR5cGUgfSBmcm9tICcuLi90eXBlcy9TdG9yYWdlLmQnO1xuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25Db2xvclR5cGUsXG4gIEN1c3RvbUNvbG9yVHlwZSxcbiAgRGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IERFRkFVTFRfQ09OVkVSU0FUSU9OX0NPTE9SIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCAqIGFzIFN0aWNrZXJzIGZyb20gJy4uL3R5cGVzL1N0aWNrZXJzJztcbmltcG9ydCB0eXBlIHsgU3lzdGVtVHJheVNldHRpbmcgfSBmcm9tICcuLi90eXBlcy9TeXN0ZW1UcmF5U2V0dGluZyc7XG5pbXBvcnQgeyBwYXJzZVN5c3RlbVRyYXlTZXR0aW5nIH0gZnJvbSAnLi4vdHlwZXMvU3lzdGVtVHJheVNldHRpbmcnO1xuXG5pbXBvcnQgeyBSZWFjdFdyYXBwZXJWaWV3IH0gZnJvbSAnLi4vdmlld3MvUmVhY3RXcmFwcGVyVmlldyc7XG5pbXBvcnQgeyBFcnJvck1vZGFsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9FcnJvck1vZGFsJztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBjYWxsaW5nIH0gZnJvbSAnLi4vc2VydmljZXMvY2FsbGluZyc7XG5pbXBvcnQgeyBnZXRDb252ZXJzYXRpb25zV2l0aEN1c3RvbUNvbG9yU2VsZWN0b3IgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRDdXN0b21Db2xvcnMgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvaXRlbXMnO1xuaW1wb3J0IHsgdHJpZ2dlciB9IGZyb20gJy4uL3NoaW1zL2V2ZW50cyc7XG5pbXBvcnQgeyB0aGVtZUNoYW5nZWQgfSBmcm9tICcuLi9zaGltcy90aGVtZUNoYW5nZWQnO1xuaW1wb3J0IHsgcmVuZGVyQ2xlYXJpbmdEYXRhVmlldyB9IGZyb20gJy4uL3NoaW1zL3JlbmRlckNsZWFyaW5nRGF0YVZpZXcnO1xuXG5pbXBvcnQgKiBhcyB1bml2ZXJzYWxFeHBpcmVUaW1lciBmcm9tICcuL3VuaXZlcnNhbEV4cGlyZVRpbWVyJztcbmltcG9ydCB7IFBob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5IH0gZnJvbSAnLi9waG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eSc7XG5pbXBvcnQgeyBQaG9uZU51bWJlclNoYXJpbmdNb2RlIH0gZnJvbSAnLi9waG9uZU51bWJlclNoYXJpbmdNb2RlJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJy4vYXNzZXJ0JztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBpc1Bob25lTnVtYmVyU2hhcmluZ0VuYWJsZWQgfSBmcm9tICcuL2lzUGhvbmVOdW1iZXJTaGFyaW5nRW5hYmxlZCc7XG5pbXBvcnQgeyBwYXJzZUUxNjRGcm9tU2lnbmFsRG90TWVIYXNoIH0gZnJvbSAnLi9zZ25sSHJlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuXG50eXBlIFRoZW1lVHlwZSA9ICdsaWdodCcgfCAnZGFyaycgfCAnc3lzdGVtJztcbnR5cGUgTm90aWZpY2F0aW9uU2V0dGluZ1R5cGUgPSAnbWVzc2FnZScgfCAnbmFtZScgfCAnY291bnQnIHwgJ29mZic7XG5cbmV4cG9ydCB0eXBlIElQQ0V2ZW50c1ZhbHVlc1R5cGUgPSB7XG4gIGFsd2F5c1JlbGF5Q2FsbHM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIGF1ZGlvTm90aWZpY2F0aW9uOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBhdXRvRG93bmxvYWRVcGRhdGU6IGJvb2xlYW47XG4gIGF1dG9MYXVuY2g6IGJvb2xlYW47XG4gIGNhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgY2FsbFN5c3RlbU5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgY291bnRNdXRlZENvbnZlcnNhdGlvbnM6IGJvb2xlYW47XG4gIGhhc1N0b3JpZXNFbmFibGVkOiBib29sZWFuO1xuICBoaWRlTWVudUJhcjogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgaW5jb21pbmdDYWxsTm90aWZpY2F0aW9uOiBib29sZWFuO1xuICBsYXN0U3luY1RpbWU6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgbm90aWZpY2F0aW9uRHJhd0F0dGVudGlvbjogYm9vbGVhbjtcbiAgbm90aWZpY2F0aW9uU2V0dGluZzogTm90aWZpY2F0aW9uU2V0dGluZ1R5cGU7XG4gIHByZWZlcnJlZEF1ZGlvSW5wdXREZXZpY2U6IEF1ZGlvRGV2aWNlIHwgdW5kZWZpbmVkO1xuICBwcmVmZXJyZWRBdWRpb091dHB1dERldmljZTogQXVkaW9EZXZpY2UgfCB1bmRlZmluZWQ7XG4gIHByZWZlcnJlZFZpZGVvSW5wdXREZXZpY2U6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgc3BlbGxDaGVjazogYm9vbGVhbjtcbiAgc3lzdGVtVHJheVNldHRpbmc6IFN5c3RlbVRyYXlTZXR0aW5nO1xuICB0aGVtZVNldHRpbmc6IFRoZW1lVHlwZTtcbiAgdW5pdmVyc2FsRXhwaXJlVGltZXI6IG51bWJlcjtcbiAgem9vbUZhY3RvcjogWm9vbUZhY3RvclR5cGU7XG5cbiAgLy8gT3B0aW9uYWxcbiAgbWVkaWFQZXJtaXNzaW9uczogYm9vbGVhbjtcbiAgbWVkaWFDYW1lcmFQZXJtaXNzaW9uczogYm9vbGVhbjtcblxuICAvLyBPbmx5IGdldHRlcnNcblxuICBibG9ja2VkQ291bnQ6IG51bWJlcjtcbiAgbGlua1ByZXZpZXdTZXR0aW5nOiBib29sZWFuO1xuICBwaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eVNldHRpbmc6IFBob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5O1xuICBwaG9uZU51bWJlclNoYXJpbmdTZXR0aW5nOiBQaG9uZU51bWJlclNoYXJpbmdNb2RlO1xuICByZWFkUmVjZWlwdFNldHRpbmc6IGJvb2xlYW47XG4gIHR5cGluZ0luZGljYXRvclNldHRpbmc6IGJvb2xlYW47XG4gIGRldmljZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCB0eXBlIElQQ0V2ZW50c0NhbGxiYWNrc1R5cGUgPSB7XG4gIGdldEF2YWlsYWJsZUlPRGV2aWNlcygpOiBQcm9taXNlPHtcbiAgICBhdmFpbGFibGVDYW1lcmFzOiBBcnJheTxcbiAgICAgIFBpY2s8TWVkaWFEZXZpY2VJbmZvLCAnZGV2aWNlSWQnIHwgJ2dyb3VwSWQnIHwgJ2tpbmQnIHwgJ2xhYmVsJz5cbiAgICA+O1xuICAgIGF2YWlsYWJsZU1pY3JvcGhvbmVzOiBBcnJheTxBdWRpb0RldmljZT47XG4gICAgYXZhaWxhYmxlU3BlYWtlcnM6IEFycmF5PEF1ZGlvRGV2aWNlPjtcbiAgfT47XG4gIGFkZEN1c3RvbUNvbG9yOiAoY3VzdG9tQ29sb3I6IEN1c3RvbUNvbG9yVHlwZSkgPT4gdm9pZDtcbiAgYWRkRGFya092ZXJsYXk6ICgpID0+IHZvaWQ7XG4gIGRlbGV0ZUFsbERhdGE6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGNsb3NlREI6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGVkaXRDdXN0b21Db2xvcjogKGNvbG9ySWQ6IHN0cmluZywgY3VzdG9tQ29sb3I6IEN1c3RvbUNvbG9yVHlwZSkgPT4gdm9pZDtcbiAgZ2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvcjogKHg6IHN0cmluZykgPT4gQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGluc3RhbGxTdGlja2VyUGFjazogKHBhY2tJZDogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgaXNQaG9uZU51bWJlclNoYXJpbmdFbmFibGVkOiAoKSA9PiBib29sZWFuO1xuICBpc1ByaW1hcnk6ICgpID0+IGJvb2xlYW47XG4gIHJlbW92ZUN1c3RvbUNvbG9yOiAoeDogc3RyaW5nKSA9PiB2b2lkO1xuICByZW1vdmVDdXN0b21Db2xvck9uQ29udmVyc2F0aW9uczogKHg6IHN0cmluZykgPT4gdm9pZDtcbiAgcmVtb3ZlRGFya092ZXJsYXk6ICgpID0+IHZvaWQ7XG4gIHJlc2V0QWxsQ2hhdENvbG9yczogKCkgPT4gdm9pZDtcbiAgcmVzZXREZWZhdWx0Q2hhdENvbG9yOiAoKSA9PiB2b2lkO1xuICBzaG93Q29udmVyc2F0aW9uVmlhU2lnbmFsRG90TWU6IChoYXNoOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNob3dLZXlib2FyZFNob3J0Y3V0czogKCkgPT4gdm9pZDtcbiAgc2hvd0dyb3VwVmlhTGluazogKHg6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgc2hvd1JlbGVhc2VOb3RlczogKCkgPT4gdm9pZDtcbiAgc2hvd1N0aWNrZXJQYWNrOiAocGFja0lkOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB2b2lkO1xuICBzaHV0ZG93bjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgdW5rbm93blNpZ25hbExpbms6ICgpID0+IHZvaWQ7XG4gIGdldEN1c3RvbUNvbG9yczogKCkgPT4gUmVjb3JkPHN0cmluZywgQ3VzdG9tQ29sb3JUeXBlPjtcbiAgc3luY1JlcXVlc3Q6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIHNldEdsb2JhbERlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogKFxuICAgIGNvbG9yOiBDb252ZXJzYXRpb25Db2xvclR5cGUsXG4gICAgY3VzdG9tQ29sb3I/OiB7IGlkOiBzdHJpbmc7IHZhbHVlOiBDdXN0b21Db2xvclR5cGUgfVxuICApID0+IHZvaWQ7XG4gIHNob3VsZFNob3dTdG9yaWVzU2V0dGluZ3M6ICgpID0+IGJvb2xlYW47XG4gIGdldERlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogKCkgPT4gRGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yVHlwZTtcbiAgcGVyc2lzdFpvb21GYWN0b3I6IChmYWN0b3I6IG51bWJlcikgPT4gUHJvbWlzZTx2b2lkPjtcbn07XG5cbnR5cGUgVmFsdWVzV2l0aEdldHRlcnMgPSBPbWl0PFxuICBJUENFdmVudHNWYWx1ZXNUeXBlLFxuICAvLyBPcHRpb25hbFxuICAnbWVkaWFQZXJtaXNzaW9ucycgfCAnbWVkaWFDYW1lcmFQZXJtaXNzaW9ucycgfCAnYXV0b0xhdW5jaCdcbj47XG5cbnR5cGUgVmFsdWVzV2l0aFNldHRlcnMgPSBPbWl0PFxuICBJUENFdmVudHNWYWx1ZXNUeXBlLFxuICB8ICdibG9ja2VkQ291bnQnXG4gIHwgJ2RlZmF1bHRDb252ZXJzYXRpb25Db2xvcidcbiAgfCAnbGlua1ByZXZpZXdTZXR0aW5nJ1xuICB8ICdwaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eVNldHRpbmcnXG4gIHwgJ3Bob25lTnVtYmVyU2hhcmluZ1NldHRpbmcnXG4gIHwgJ3JlYWRSZWNlaXB0U2V0dGluZydcbiAgfCAndHlwaW5nSW5kaWNhdG9yU2V0dGluZydcbiAgfCAnZGV2aWNlTmFtZSdcblxuICAvLyBPcHRpb25hbFxuICB8ICdtZWRpYVBlcm1pc3Npb25zJ1xuICB8ICdtZWRpYUNhbWVyYVBlcm1pc3Npb25zJ1xuPjtcblxuZXhwb3J0IHR5cGUgSVBDRXZlbnRHZXR0ZXJUeXBlPEtleSBleHRlbmRzIGtleW9mIElQQ0V2ZW50c1ZhbHVlc1R5cGU+ID1cbiAgYGdldCR7Q2FwaXRhbGl6ZTxLZXk+fWA7XG5cbmV4cG9ydCB0eXBlIElQQ0V2ZW50U2V0dGVyVHlwZTxLZXkgZXh0ZW5kcyBrZXlvZiBJUENFdmVudHNWYWx1ZXNUeXBlPiA9XG4gIGBzZXQke0NhcGl0YWxpemU8S2V5Pn1gO1xuXG5leHBvcnQgdHlwZSBJUENFdmVudHNHZXR0ZXJzVHlwZSA9IHtcbiAgW0tleSBpbiBrZXlvZiBWYWx1ZXNXaXRoR2V0dGVycyBhcyBJUENFdmVudEdldHRlclR5cGU8S2V5Pl06ICgpID0+IFZhbHVlc1dpdGhHZXR0ZXJzW0tleV07XG59ICYge1xuICBnZXRNZWRpYVBlcm1pc3Npb25zPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgZ2V0TWVkaWFDYW1lcmFQZXJtaXNzaW9ucz86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGdldEF1dG9MYXVuY2g/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IHR5cGUgSVBDRXZlbnRzU2V0dGVyc1R5cGUgPSB7XG4gIFtLZXkgaW4ga2V5b2YgVmFsdWVzV2l0aFNldHRlcnMgYXMgSVBDRXZlbnRTZXR0ZXJUeXBlPEtleT5dOiAoXG4gICAgdmFsdWU6IE5vbk51bGxhYmxlPFZhbHVlc1dpdGhTZXR0ZXJzW0tleV0+XG4gICkgPT4gUHJvbWlzZTx2b2lkPjtcbn0gJiB7XG4gIHNldE1lZGlhUGVybWlzc2lvbnM/OiAodmFsdWU6IGJvb2xlYW4pID0+IFByb21pc2U8dm9pZD47XG4gIHNldE1lZGlhQ2FtZXJhUGVybWlzc2lvbnM/OiAodmFsdWU6IGJvb2xlYW4pID0+IFByb21pc2U8dm9pZD47XG59O1xuXG5leHBvcnQgdHlwZSBJUENFdmVudHNUeXBlID0gSVBDRXZlbnRzR2V0dGVyc1R5cGUgJlxuICBJUENFdmVudHNTZXR0ZXJzVHlwZSAmXG4gIElQQ0V2ZW50c0NhbGxiYWNrc1R5cGU7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJUENFdmVudHMoXG4gIG92ZXJyaWRlRXZlbnRzOiBQYXJ0aWFsPElQQ0V2ZW50c1R5cGU+ID0ge31cbik6IElQQ0V2ZW50c1R5cGUge1xuICByZXR1cm4ge1xuICAgIGdldERldmljZU5hbWU6ICgpID0+IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXREZXZpY2VOYW1lKCksXG5cbiAgICBnZXRab29tRmFjdG9yOiAoKSA9PiB3aW5kb3cuc3RvcmFnZS5nZXQoJ3pvb21GYWN0b3InLCAxKSxcbiAgICBzZXRab29tRmFjdG9yOiBhc3luYyAoem9vbUZhY3RvcjogWm9vbUZhY3RvclR5cGUpID0+IHtcbiAgICAgIHdlYkZyYW1lLnNldFpvb21GYWN0b3Ioem9vbUZhY3Rvcik7XG4gICAgfSxcblxuICAgIGdldEhhc1N0b3JpZXNFbmFibGVkOiAoKSA9PiB3aW5kb3cuc3RvcmFnZS5nZXQoJ2hhc1N0b3JpZXNFbmFibGVkJywgdHJ1ZSksXG4gICAgc2V0SGFzU3Rvcmllc0VuYWJsZWQ6ICh2YWx1ZTogYm9vbGVhbikgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnaGFzU3Rvcmllc0VuYWJsZWQnLCB2YWx1ZSksXG5cbiAgICBnZXRQcmVmZXJyZWRBdWRpb0lucHV0RGV2aWNlOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdwcmVmZXJyZWQtYXVkaW8taW5wdXQtZGV2aWNlJyksXG4gICAgc2V0UHJlZmVycmVkQXVkaW9JbnB1dERldmljZTogZGV2aWNlID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3ByZWZlcnJlZC1hdWRpby1pbnB1dC1kZXZpY2UnLCBkZXZpY2UpLFxuICAgIGdldFByZWZlcnJlZEF1ZGlvT3V0cHV0RGV2aWNlOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdwcmVmZXJyZWQtYXVkaW8tb3V0cHV0LWRldmljZScpLFxuICAgIHNldFByZWZlcnJlZEF1ZGlvT3V0cHV0RGV2aWNlOiBkZXZpY2UgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgncHJlZmVycmVkLWF1ZGlvLW91dHB1dC1kZXZpY2UnLCBkZXZpY2UpLFxuICAgIGdldFByZWZlcnJlZFZpZGVvSW5wdXREZXZpY2U6ICgpID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3ByZWZlcnJlZC12aWRlby1pbnB1dC1kZXZpY2UnKSxcbiAgICBzZXRQcmVmZXJyZWRWaWRlb0lucHV0RGV2aWNlOiBkZXZpY2UgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgncHJlZmVycmVkLXZpZGVvLWlucHV0LWRldmljZScsIGRldmljZSksXG5cbiAgICAvLyBDaGF0IENvbG9yIHJlZHV4IGhvb2t1cHNcbiAgICBnZXRDdXN0b21Db2xvcnM6ICgpID0+IHtcbiAgICAgIHJldHVybiBnZXRDdXN0b21Db2xvcnMod2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKSkgfHwge307XG4gICAgfSxcbiAgICBnZXRDb252ZXJzYXRpb25zV2l0aEN1c3RvbUNvbG9yOiBjb2xvcklkID0+IHtcbiAgICAgIHJldHVybiBnZXRDb252ZXJzYXRpb25zV2l0aEN1c3RvbUNvbG9yU2VsZWN0b3IoXG4gICAgICAgIHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKClcbiAgICAgICkoY29sb3JJZCk7XG4gICAgfSxcbiAgICBhZGRDdXN0b21Db2xvcjogKC4uLmFyZ3MpID0+XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLml0ZW1zLmFkZEN1c3RvbUNvbG9yKC4uLmFyZ3MpLFxuICAgIGVkaXRDdXN0b21Db2xvcjogKC4uLmFyZ3MpID0+XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLml0ZW1zLmVkaXRDdXN0b21Db2xvciguLi5hcmdzKSxcbiAgICByZW1vdmVDdXN0b21Db2xvcjogY29sb3JJZCA9PlxuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5pdGVtcy5yZW1vdmVDdXN0b21Db2xvcihjb2xvcklkKSxcbiAgICByZW1vdmVDdXN0b21Db2xvck9uQ29udmVyc2F0aW9uczogY29sb3JJZCA9PlxuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnJlbW92ZUN1c3RvbUNvbG9yT25Db252ZXJzYXRpb25zKFxuICAgICAgICBjb2xvcklkXG4gICAgICApLFxuICAgIHJlc2V0QWxsQ2hhdENvbG9yczogKCkgPT5cbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5yZXNldEFsbENoYXRDb2xvcnMoKSxcbiAgICByZXNldERlZmF1bHRDaGF0Q29sb3I6ICgpID0+XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLml0ZW1zLnJlc2V0RGVmYXVsdENoYXRDb2xvcigpLFxuICAgIHNldEdsb2JhbERlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogKC4uLmFyZ3MpID0+XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLml0ZW1zLnNldEdsb2JhbERlZmF1bHRDb252ZXJzYXRpb25Db2xvciguLi5hcmdzKSxcblxuICAgIC8vIEdldHRlcnMgb25seVxuICAgIGdldEF2YWlsYWJsZUlPRGV2aWNlczogYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyBhdmFpbGFibGVDYW1lcmFzLCBhdmFpbGFibGVNaWNyb3Bob25lcywgYXZhaWxhYmxlU3BlYWtlcnMgfSA9XG4gICAgICAgIGF3YWl0IGNhbGxpbmcuZ2V0QXZhaWxhYmxlSU9EZXZpY2VzKCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIG1hcHBpbmcgaXQgdG8gYSBwb2pvIHNvIHRoYXQgaXQgaXMgSVBDIGZyaWVuZGx5XG4gICAgICAgIGF2YWlsYWJsZUNhbWVyYXM6IGF2YWlsYWJsZUNhbWVyYXMubWFwKFxuICAgICAgICAgIChpbnB1dERldmljZUluZm86IE1lZGlhRGV2aWNlSW5mbykgPT4gKHtcbiAgICAgICAgICAgIGRldmljZUlkOiBpbnB1dERldmljZUluZm8uZGV2aWNlSWQsXG4gICAgICAgICAgICBncm91cElkOiBpbnB1dERldmljZUluZm8uZ3JvdXBJZCxcbiAgICAgICAgICAgIGtpbmQ6IGlucHV0RGV2aWNlSW5mby5raW5kLFxuICAgICAgICAgICAgbGFiZWw6IGlucHV0RGV2aWNlSW5mby5sYWJlbCxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgICBhdmFpbGFibGVNaWNyb3Bob25lcyxcbiAgICAgICAgYXZhaWxhYmxlU3BlYWtlcnMsXG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QmxvY2tlZENvdW50OiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5nZXRCbG9ja2VkVXVpZHMoKS5sZW5ndGggK1xuICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5nZXRCbG9ja2VkR3JvdXBzKCkubGVuZ3RoLFxuICAgIGdldERlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogKCkgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLmdldChcbiAgICAgICAgJ2RlZmF1bHRDb252ZXJzYXRpb25Db2xvcicsXG4gICAgICAgIERFRkFVTFRfQ09OVkVSU0FUSU9OX0NPTE9SXG4gICAgICApLFxuICAgIGdldExpbmtQcmV2aWV3U2V0dGluZzogKCkgPT4gd2luZG93LnN0b3JhZ2UuZ2V0KCdsaW5rUHJldmlld3MnLCBmYWxzZSksXG4gICAgZ2V0UGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHlTZXR0aW5nOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KFxuICAgICAgICAncGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHknLFxuICAgICAgICBQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eS5Ob3REaXNjb3ZlcmFibGVcbiAgICAgICksXG4gICAgZ2V0UGhvbmVOdW1iZXJTaGFyaW5nU2V0dGluZzogKCkgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLmdldChcbiAgICAgICAgJ3Bob25lTnVtYmVyU2hhcmluZ01vZGUnLFxuICAgICAgICBQaG9uZU51bWJlclNoYXJpbmdNb2RlLk5vYm9keVxuICAgICAgKSxcbiAgICBnZXRSZWFkUmVjZWlwdFNldHRpbmc6ICgpID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3JlYWQtcmVjZWlwdC1zZXR0aW5nJywgZmFsc2UpLFxuICAgIGdldFR5cGluZ0luZGljYXRvclNldHRpbmc6ICgpID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ3R5cGluZ0luZGljYXRvcnMnLCBmYWxzZSksXG5cbiAgICAvLyBDb25maWd1cmFibGUgc2V0dGluZ3NcbiAgICBnZXRBdXRvRG93bmxvYWRVcGRhdGU6ICgpID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ2F1dG8tZG93bmxvYWQtdXBkYXRlJywgdHJ1ZSksXG4gICAgc2V0QXV0b0Rvd25sb2FkVXBkYXRlOiB2YWx1ZSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdhdXRvLWRvd25sb2FkLXVwZGF0ZScsIHZhbHVlKSxcbiAgICBnZXRUaGVtZVNldHRpbmc6ICgpID0+IHdpbmRvdy5zdG9yYWdlLmdldCgndGhlbWUtc2V0dGluZycsICdzeXN0ZW0nKSxcbiAgICBzZXRUaGVtZVNldHRpbmc6IHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSB3aW5kb3cuc3RvcmFnZS5wdXQoJ3RoZW1lLXNldHRpbmcnLCB2YWx1ZSk7XG4gICAgICB0aGVtZUNoYW5nZWQoKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgZ2V0SGlkZU1lbnVCYXI6ICgpID0+IHdpbmRvdy5zdG9yYWdlLmdldCgnaGlkZS1tZW51LWJhcicpLFxuICAgIHNldEhpZGVNZW51QmFyOiB2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gd2luZG93LnN0b3JhZ2UucHV0KCdoaWRlLW1lbnUtYmFyJywgdmFsdWUpO1xuICAgICAgd2luZG93LnNldEF1dG9IaWRlTWVudUJhcih2YWx1ZSk7XG4gICAgICB3aW5kb3cuc2V0TWVudUJhclZpc2liaWxpdHkoIXZhbHVlKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgZ2V0U3lzdGVtVHJheVNldHRpbmc6ICgpID0+XG4gICAgICBwYXJzZVN5c3RlbVRyYXlTZXR0aW5nKHdpbmRvdy5zdG9yYWdlLmdldCgnc3lzdGVtLXRyYXktc2V0dGluZycpKSxcbiAgICBzZXRTeXN0ZW1UcmF5U2V0dGluZzogdmFsdWUgPT4ge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHdpbmRvdy5zdG9yYWdlLnB1dCgnc3lzdGVtLXRyYXktc2V0dGluZycsIHZhbHVlKTtcbiAgICAgIHdpbmRvdy51cGRhdGVTeXN0ZW1UcmF5U2V0dGluZyh2YWx1ZSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgZ2V0Tm90aWZpY2F0aW9uU2V0dGluZzogKCkgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLmdldCgnbm90aWZpY2F0aW9uLXNldHRpbmcnLCAnbWVzc2FnZScpLFxuICAgIHNldE5vdGlmaWNhdGlvblNldHRpbmc6ICh2YWx1ZTogJ21lc3NhZ2UnIHwgJ25hbWUnIHwgJ2NvdW50JyB8ICdvZmYnKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdub3RpZmljYXRpb24tc2V0dGluZycsIHZhbHVlKSxcbiAgICBnZXROb3RpZmljYXRpb25EcmF3QXR0ZW50aW9uOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdub3RpZmljYXRpb24tZHJhdy1hdHRlbnRpb24nLCB0cnVlKSxcbiAgICBzZXROb3RpZmljYXRpb25EcmF3QXR0ZW50aW9uOiB2YWx1ZSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdub3RpZmljYXRpb24tZHJhdy1hdHRlbnRpb24nLCB2YWx1ZSksXG4gICAgZ2V0QXVkaW9Ob3RpZmljYXRpb246ICgpID0+IHdpbmRvdy5zdG9yYWdlLmdldCgnYXVkaW8tbm90aWZpY2F0aW9uJyksXG4gICAgc2V0QXVkaW9Ob3RpZmljYXRpb246IHZhbHVlID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ2F1ZGlvLW5vdGlmaWNhdGlvbicsIHZhbHVlKSxcbiAgICBnZXRDb3VudE11dGVkQ29udmVyc2F0aW9uczogKCkgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLmdldCgnYmFkZ2UtY291bnQtbXV0ZWQtY29udmVyc2F0aW9ucycsIGZhbHNlKSxcbiAgICBzZXRDb3VudE11dGVkQ29udmVyc2F0aW9uczogdmFsdWUgPT4ge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHdpbmRvdy5zdG9yYWdlLnB1dChcbiAgICAgICAgJ2JhZGdlLWNvdW50LW11dGVkLWNvbnZlcnNhdGlvbnMnLFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCd1cGRhdGVVbnJlYWRDb3VudCcpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICBnZXRDYWxsUmluZ3RvbmVOb3RpZmljYXRpb246ICgpID0+XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ2NhbGwtcmluZ3RvbmUtbm90aWZpY2F0aW9uJywgdHJ1ZSksXG4gICAgc2V0Q2FsbFJpbmd0b25lTm90aWZpY2F0aW9uOiB2YWx1ZSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdjYWxsLXJpbmd0b25lLW5vdGlmaWNhdGlvbicsIHZhbHVlKSxcbiAgICBnZXRDYWxsU3lzdGVtTm90aWZpY2F0aW9uOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdjYWxsLXN5c3RlbS1ub3RpZmljYXRpb24nLCB0cnVlKSxcbiAgICBzZXRDYWxsU3lzdGVtTm90aWZpY2F0aW9uOiB2YWx1ZSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdjYWxsLXN5c3RlbS1ub3RpZmljYXRpb24nLCB2YWx1ZSksXG4gICAgZ2V0SW5jb21pbmdDYWxsTm90aWZpY2F0aW9uOiAoKSA9PlxuICAgICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdpbmNvbWluZy1jYWxsLW5vdGlmaWNhdGlvbicsIHRydWUpLFxuICAgIHNldEluY29taW5nQ2FsbE5vdGlmaWNhdGlvbjogdmFsdWUgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnaW5jb21pbmctY2FsbC1ub3RpZmljYXRpb24nLCB2YWx1ZSksXG5cbiAgICBnZXRTcGVsbENoZWNrOiAoKSA9PiB3aW5kb3cuc3RvcmFnZS5nZXQoJ3NwZWxsLWNoZWNrJywgdHJ1ZSksXG4gICAgc2V0U3BlbGxDaGVjazogdmFsdWUgPT4gd2luZG93LnN0b3JhZ2UucHV0KCdzcGVsbC1jaGVjaycsIHZhbHVlKSxcblxuICAgIGdldEFsd2F5c1JlbGF5Q2FsbHM6ICgpID0+IHdpbmRvdy5zdG9yYWdlLmdldCgnYWx3YXlzLXJlbGF5LWNhbGxzJyksXG4gICAgc2V0QWx3YXlzUmVsYXlDYWxsczogdmFsdWUgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnYWx3YXlzLXJlbGF5LWNhbGxzJywgdmFsdWUpLFxuXG4gICAgZ2V0QXV0b0xhdW5jaDogKCkgPT4gd2luZG93LmdldEF1dG9MYXVuY2goKSxcbiAgICBzZXRBdXRvTGF1bmNoOiBhc3luYyAodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICAgIHJldHVybiB3aW5kb3cuc2V0QXV0b0xhdW5jaCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzUGhvbmVOdW1iZXJTaGFyaW5nRW5hYmxlZDogKCkgPT4gaXNQaG9uZU51bWJlclNoYXJpbmdFbmFibGVkKCksXG4gICAgaXNQcmltYXJ5OiAoKSA9PiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKSA9PT0gMSxcbiAgICBzaG91bGRTaG93U3Rvcmllc1NldHRpbmdzOiAoKSA9PlxuICAgICAgUmVtb3RlQ29uZmlnLmlzRW5hYmxlZCgnZGVza3RvcC5pbnRlcm5hbFVzZXInKSB8fFxuICAgICAgUmVtb3RlQ29uZmlnLmlzRW5hYmxlZCgnZGVza3RvcC5zdG9yaWVzJyksXG4gICAgc3luY1JlcXVlc3Q6ICgpID0+XG4gICAgICBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IEZJVkVfTUlOVVRFUyA9IDUgKiBkdXJhdGlvbnMuTUlOVVRFO1xuICAgICAgICBjb25zdCBzeW5jUmVxdWVzdCA9IHdpbmRvdy5nZXRTeW5jUmVxdWVzdChGSVZFX01JTlVURVMpO1xuICAgICAgICBzeW5jUmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgc3luY1JlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigndGltZW91dCcsICgpID0+XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcigndGltZW91dCcpKVxuICAgICAgICApO1xuICAgICAgfSksXG4gICAgZ2V0TGFzdFN5bmNUaW1lOiAoKSA9PiB3aW5kb3cuc3RvcmFnZS5nZXQoJ3N5bmNlZF9hdCcpLFxuICAgIHNldExhc3RTeW5jVGltZTogdmFsdWUgPT4gd2luZG93LnN0b3JhZ2UucHV0KCdzeW5jZWRfYXQnLCB2YWx1ZSksXG4gICAgZ2V0VW5pdmVyc2FsRXhwaXJlVGltZXI6ICgpID0+IHVuaXZlcnNhbEV4cGlyZVRpbWVyLmdldCgpLFxuICAgIHNldFVuaXZlcnNhbEV4cGlyZVRpbWVyOiBhc3luYyBuZXdWYWx1ZSA9PiB7XG4gICAgICBhd2FpdCB1bml2ZXJzYWxFeHBpcmVUaW1lci5zZXQobmV3VmFsdWUpO1xuXG4gICAgICAvLyBVcGRhdGUgYWNjb3VudCBpbiBTdG9yYWdlIFNlcnZpY2VcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID1cbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KCk7XG4gICAgICBjb25zdCBhY2NvdW50ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGFzc2VydChhY2NvdW50LCBcIkFjY291bnQgd2Fzbid0IGZvdW5kXCIpO1xuXG4gICAgICBhY2NvdW50LmNhcHR1cmVDaGFuZ2UoJ3VuaXZlcnNhbEV4cGlyZVRpbWVyJyk7XG5cbiAgICAgIC8vIEFkZCBhIG5vdGlmaWNhdGlvbiB0byB0aGUgY3VycmVudGx5IG9wZW4gY29udmVyc2F0aW9uXG4gICAgICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKCk7XG4gICAgICBjb25zdCBzZWxlY3RlZElkID0gc3RhdGUuY29udmVyc2F0aW9ucy5zZWxlY3RlZENvbnZlcnNhdGlvbklkO1xuICAgICAgaWYgKHNlbGVjdGVkSWQpIHtcbiAgICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHNlbGVjdGVkSWQpO1xuICAgICAgICBhc3NlcnQoY29udmVyc2F0aW9uLCBcIkNvbnZlcnNhdGlvbiB3YXNuJ3QgZm91bmRcIik7XG5cbiAgICAgICAgYXdhaXQgY29udmVyc2F0aW9uLnVwZGF0ZUxhc3RNZXNzYWdlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFkZERhcmtPdmVybGF5OiAoKSA9PiB7XG4gICAgICBpZiAoJCgnLmRhcmstb3ZlcmxheScpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAkKGRvY3VtZW50LmJvZHkpLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJkYXJrLW92ZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICQoJy5kYXJrLW92ZXJsYXknKS5vbignY2xpY2snLCAoKSA9PiAkKCcuZGFyay1vdmVybGF5JykucmVtb3ZlKCkpO1xuICAgIH0sXG4gICAgcmVtb3ZlRGFya092ZXJsYXk6ICgpID0+ICQoJy5kYXJrLW92ZXJsYXknKS5yZW1vdmUoKSxcbiAgICBzaG93S2V5Ym9hcmRTaG9ydGN1dHM6ICgpID0+IHdpbmRvdy5zaG93S2V5Ym9hcmRTaG9ydGN1dHMoKSxcblxuICAgIGRlbGV0ZUFsbERhdGE6IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nb0JhY2tUb01haW5Qcm9jZXNzKCk7XG5cbiAgICAgIHJlbmRlckNsZWFyaW5nRGF0YVZpZXcoKTtcbiAgICB9LFxuXG4gICAgY2xvc2VEQjogYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdvQmFja1RvTWFpblByb2Nlc3MoKTtcbiAgICB9LFxuXG4gICAgc2hvd1N0aWNrZXJQYWNrOiAocGFja0lkLCBrZXkpID0+IHtcbiAgICAgIC8vIFdlIGNhbiBnZXQgdGhlc2UgZXZlbnRzIGV2ZW4gaWYgdGhlIHVzZXIgaGFzIG5ldmVyIGxpbmtlZCB0aGlzIGluc3RhbmNlLlxuICAgICAgaWYgKCF3aW5kb3cuU2lnbmFsLlV0aWwuUmVnaXN0cmF0aW9uLmV2ZXJEb25lKCkpIHtcbiAgICAgICAgbG9nLndhcm4oJ3Nob3dTdGlja2VyUGFjazogTm90IHJlZ2lzdGVyZWQsIHJldHVybmluZyBlYXJseScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAod2luZG93LmlzU2hvd2luZ01vZGFsKSB7XG4gICAgICAgIGxvZy53YXJuKCdzaG93U3RpY2tlclBhY2s6IEFscmVhZHkgc2hvd2luZyBtb2RhbCwgcmV0dXJuaW5nIGVhcmx5Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5pc1Nob3dpbmdNb2RhbCA9IHRydWU7XG5cbiAgICAgICAgLy8gS2ljayBvZmYgdGhlIGRvd25sb2FkXG4gICAgICAgIFN0aWNrZXJzLmRvd25sb2FkRXBoZW1lcmFsUGFjayhwYWNrSWQsIGtleSk7XG5cbiAgICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgICAgcGFja0lkLFxuICAgICAgICAgIG9uQ2xvc2U6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5pc1Nob3dpbmdNb2RhbCA9IGZhbHNlO1xuICAgICAgICAgICAgc3RpY2tlclByZXZpZXdNb2RhbFZpZXcucmVtb3ZlKCk7XG4gICAgICAgICAgICBhd2FpdCBTdGlja2Vycy5yZW1vdmVFcGhlbWVyYWxQYWNrKHBhY2tJZCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzdGlja2VyUHJldmlld01vZGFsVmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdzdGlja2VyLXByZXZpZXctbW9kYWwtd3JhcHBlcicsXG4gICAgICAgICAgSlNYOiB3aW5kb3cuU2lnbmFsLlN0YXRlLlJvb3RzLmNyZWF0ZVN0aWNrZXJQcmV2aWV3TW9kYWwoXG4gICAgICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAgICAgIHByb3BzXG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB3aW5kb3cuaXNTaG93aW5nTW9kYWwgPSBmYWxzZTtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdzaG93U3RpY2tlclBhY2s6IFJhbiBpbnRvIGFuIGVycm9yIScsXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVycm9yVmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdlcnJvci1tb2RhbC13cmFwcGVyJyxcbiAgICAgICAgICBKU1g6IChcbiAgICAgICAgICAgIDxFcnJvck1vZGFsXG4gICAgICAgICAgICAgIGkxOG49e3dpbmRvdy5pMThufVxuICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXJyb3JWaWV3LnJlbW92ZSgpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNob3dHcm91cFZpYUxpbms6IGFzeW5jIGhhc2ggPT4ge1xuICAgICAgLy8gV2UgY2FuIGdldCB0aGVzZSBldmVudHMgZXZlbiBpZiB0aGUgdXNlciBoYXMgbmV2ZXIgbGlua2VkIHRoaXMgaW5zdGFuY2UuXG4gICAgICBpZiAoIXdpbmRvdy5TaWduYWwuVXRpbC5SZWdpc3RyYXRpb24uZXZlckRvbmUoKSkge1xuICAgICAgICBsb2cud2Fybignc2hvd0dyb3VwVmlhTGluazogTm90IHJlZ2lzdGVyZWQsIHJldHVybmluZyBlYXJseScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAod2luZG93LmlzU2hvd2luZ01vZGFsKSB7XG4gICAgICAgIGxvZy53YXJuKCdzaG93R3JvdXBWaWFMaW5rOiBBbHJlYWR5IHNob3dpbmcgbW9kYWwsIHJldHVybmluZyBlYXJseScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5qb2luVmlhTGluayhoYXNoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAnc2hvd0dyb3VwVmlhTGluazogUmFuIGludG8gYW4gZXJyb3IhJyxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZXJyb3JWaWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2Vycm9yLW1vZGFsLXdyYXBwZXInLFxuICAgICAgICAgIEpTWDogKFxuICAgICAgICAgICAgPEVycm9yTW9kYWxcbiAgICAgICAgICAgICAgaTE4bj17d2luZG93LmkxOG59XG4gICAgICAgICAgICAgIHRpdGxlPXt3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0tZ2VuZXJhbC1qb2luLWZhaWx1cmUtLXRpdGxlJyl9XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXt3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0tZ2VuZXJhbC1qb2luLWZhaWx1cmUnKX1cbiAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGVycm9yVmlldy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB3aW5kb3cuaXNTaG93aW5nTW9kYWwgPSBmYWxzZTtcbiAgICB9LFxuICAgIHNob3dDb252ZXJzYXRpb25WaWFTaWduYWxEb3RNZShoYXNoOiBzdHJpbmcpIHtcbiAgICAgIGlmICghd2luZG93LlNpZ25hbC5VdGlsLlJlZ2lzdHJhdGlvbi5ldmVyRG9uZSgpKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdzaG93Q29udmVyc2F0aW9uVmlhU2lnbmFsRG90TWU6IE5vdCByZWdpc3RlcmVkLCByZXR1cm5pbmcgZWFybHknXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF5YmVFMTY0ID0gcGFyc2VFMTY0RnJvbVNpZ25hbERvdE1lSGFzaChoYXNoKTtcbiAgICAgIGlmIChtYXliZUUxNjQpIHtcbiAgICAgICAgdHJpZ2dlcignc2hvd0NvbnZlcnNhdGlvbicsIG1heWJlRTE2NCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oJ3Nob3dDb252ZXJzYXRpb25WaWFTaWduYWxEb3RNZTogaW52YWxpZCBFMTY0Jyk7XG4gICAgICBpZiAod2luZG93LmlzU2hvd2luZ01vZGFsKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdzaG93Q29udmVyc2F0aW9uVmlhU2lnbmFsRG90TWU6IGEgbW9kYWwgaXMgYWxyZWFkeSBzaG93aW5nLiBEb2luZyBub3RoaW5nJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd1Vua25vd25TZ25sTGlua01vZGFsKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHVua25vd25TaWduYWxMaW5rOiAoKSA9PiB7XG4gICAgICBsb2cud2FybigndW5rbm93blNpZ25hbExpbms6IFNob3dpbmcgZXJyb3IgZGlhbG9nJyk7XG4gICAgICBzaG93VW5rbm93blNnbmxMaW5rTW9kYWwoKTtcbiAgICB9LFxuXG4gICAgaW5zdGFsbFN0aWNrZXJQYWNrOiBhc3luYyAocGFja0lkLCBrZXkpID0+IHtcbiAgICAgIFN0aWNrZXJzLmRvd25sb2FkU3RpY2tlclBhY2socGFja0lkLCBrZXksIHtcbiAgICAgICAgZmluYWxTdGF0dXM6ICdpbnN0YWxsZWQnLFxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNodXRkb3duOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICBzaG93UmVsZWFzZU5vdGVzOiAoKSA9PiB7XG4gICAgICBjb25zdCB7IHNob3dXaGF0c05ld01vZGFsIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLmdsb2JhbE1vZGFscztcbiAgICAgIHNob3dXaGF0c05ld01vZGFsKCk7XG4gICAgfSxcblxuICAgIGdldE1lZGlhUGVybWlzc2lvbnM6IHdpbmRvdy5nZXRNZWRpYVBlcm1pc3Npb25zLFxuICAgIGdldE1lZGlhQ2FtZXJhUGVybWlzc2lvbnM6IHdpbmRvdy5nZXRNZWRpYUNhbWVyYVBlcm1pc3Npb25zLFxuXG4gICAgcGVyc2lzdFpvb21GYWN0b3I6IHpvb21GYWN0b3IgPT5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnem9vbUZhY3RvcicsIHpvb21GYWN0b3IpLFxuXG4gICAgLi4ub3ZlcnJpZGVFdmVudHMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNob3dVbmtub3duU2dubExpbmtNb2RhbCgpOiB2b2lkIHtcbiAgY29uc3QgZXJyb3JWaWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgIGNsYXNzTmFtZTogJ2Vycm9yLW1vZGFsLXdyYXBwZXInLFxuICAgIEpTWDogKFxuICAgICAgPEVycm9yTW9kYWxcbiAgICAgICAgaTE4bj17d2luZG93LmkxOG59XG4gICAgICAgIGRlc2NyaXB0aW9uPXt3aW5kb3cuaTE4bigndW5rbm93bi1zZ25sLWxpbmsnKX1cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIGVycm9yVmlldy5yZW1vdmUoKTtcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKSxcbiAgfSk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esc0JBQXlCO0FBRXpCLFlBQXVCO0FBQ3ZCLG1CQUE4QjtBQVE5QixvQkFBMkM7QUFDM0MsZUFBMEI7QUFFMUIsK0JBQXVDO0FBRXZDLDhCQUFpQztBQUNqQyx3QkFBMkI7QUFHM0IscUJBQXdCO0FBQ3hCLDJCQUF3RDtBQUN4RCxtQkFBZ0M7QUFDaEMsb0JBQXdCO0FBQ3hCLDBCQUE2QjtBQUM3QixvQ0FBdUM7QUFFdkMsMkJBQXNDO0FBQ3RDLHdDQUEyQztBQUMzQyxvQ0FBdUM7QUFDdkMsb0JBQXVCO0FBQ3ZCLGdCQUEyQjtBQUMzQix5Q0FBNEM7QUFDNUMsc0JBQTZDO0FBQzdDLFVBQXFCO0FBb0lkLHlCQUNMLGlCQUF5QyxDQUFDLEdBQzNCO0FBQ2YsU0FBTztBQUFBLElBQ0wsZUFBZSxNQUFNLE9BQU8sV0FBVyxRQUFRLEtBQUssY0FBYztBQUFBLElBRWxFLGVBQWUsTUFBTSxPQUFPLFFBQVEsSUFBSSxjQUFjLENBQUM7QUFBQSxJQUN2RCxlQUFlLE9BQU8sZUFBK0I7QUFDbkQsK0JBQVMsY0FBYyxVQUFVO0FBQUEsSUFDbkM7QUFBQSxJQUVBLHNCQUFzQixNQUFNLE9BQU8sUUFBUSxJQUFJLHFCQUFxQixJQUFJO0FBQUEsSUFDeEUsc0JBQXNCLENBQUMsVUFDckIsT0FBTyxRQUFRLElBQUkscUJBQXFCLEtBQUs7QUFBQSxJQUUvQyw4QkFBOEIsTUFDNUIsT0FBTyxRQUFRLElBQUksOEJBQThCO0FBQUEsSUFDbkQsOEJBQThCLFlBQzVCLE9BQU8sUUFBUSxJQUFJLGdDQUFnQyxNQUFNO0FB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LG9DQUFDO0FBQUEsWUFDQyxNQUFNLE9BQU87QUFBQSxZQUNiLE9BQU8sT0FBTyxLQUFLLDRDQUE0QztBQUFBLFlBQy9ELGFBQWEsT0FBTyxLQUFLLHFDQUFxQztBQUFBLFlBQzlELFNBQVMsTUFBTTtBQUNiLHdCQUFVLE9BQU87QUFBQSxZQUNuQjtBQUFBLFdBQ0Y7QUFBQSxRQUVKLENBQUM7QUFBQSxNQUNIO0FBQ0EsYUFBTyxpQkFBaUI7QUFBQSxJQUMxQjtBQUFBLElBQ0EsK0JBQStCLE1BQWM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sT0FBTyxLQUFLLGFBQWEsU0FBUyxHQUFHO0FBQy9DLFlBQUksS0FDRixpRUFDRjtBQUNBO0FBQUEsTUFDRjtBQUVBLFlBQU0sWUFBWSxrREFBNkIsSUFBSTtBQUNuRCxVQUFJLFdBQVc7QUFDYixtQ0FBUSxvQkFBb0IsU0FBUztBQUNyQztBQUFBLE1BQ0Y7QUFFQSxVQUFJLEtBQUssOENBQThDO0FBQ3ZELFVBQUksT0FBTyxnQkFBZ0I7QUFDekIsWUFBSSxLQUNGLDJFQUNGO0FBQUEsTUFDRixPQUFPO0FBQ0wsaUNBQXlCO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQUEsSUFFQSxtQkFBbUIsTUFBTTtBQUN2QixVQUFJLEtBQUsseUNBQXlDO0FBQ2xELCtCQUF5QjtBQUFBLElBQzNCO0FBQUEsSUFFQSxvQkFBb0IsT0FBTyxRQUFRLFFBQVE7QUFDekMsZUFBUyxvQkFBb0IsUUFBUSxLQUFLO0FBQUEsUUFDeEMsYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFVBQVUsTUFBTSxRQUFRLFFBQVE7QUFBQSxJQUNoQyxrQkFBa0IsTUFBTTtBQUN0QixZQUFNLEVBQUUsc0JBQXNCLE9BQU8sYUFBYTtBQUNsRCx3QkFBa0I7QUFBQSxJQUNwQjtBQUFBLElBRUEscUJBQXFCLE9BQU87QUFBQSxJQUM1QiwyQkFBMkIsT0FBTztBQUFBLElBRWxDLG1CQUFtQixnQkFDakIsT0FBTyxRQUFRLElBQUksY0FBYyxVQUFVO0FBQUEsT0FFMUM7QUFBQSxFQUNMO0FBQ0Y7QUF6V2dCLEFBMldoQixvQ0FBMEM7QUFDeEMsUUFBTSxZQUFZLElBQUkseUNBQWlCO0FBQUEsSUFDckMsV0FBVztBQUFBLElBQ1gsS0FDRSxvQ0FBQztBQUFBLE1BQ0MsTUFBTSxPQUFPO0FBQUEsTUFDYixhQUFhLE9BQU8sS0FBSyxtQkFBbUI7QUFBQSxNQUM1QyxTQUFTLE1BQU07QUFDYixrQkFBVSxPQUFPO0FBQUEsTUFDbkI7QUFBQSxLQUNGO0FBQUEsRUFFSixDQUFDO0FBQ0g7QUFiUyIsCiAgIm5hbWVzIjogW10KfQo=
