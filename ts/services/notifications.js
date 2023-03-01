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
var notifications_exports = {};
__export(notifications_exports, {
  FALLBACK_NOTIFICATION_TITLE: () => FALLBACK_NOTIFICATION_TITLE,
  NotificationSetting: () => NotificationSetting,
  notificationService: () => notificationService
});
module.exports = __toCommonJS(notifications_exports);
var import_lodash = require("lodash");
var import_events = __toESM(require("events"));
var import_Sound = require("../util/Sound");
var import_Settings = require("../types/Settings");
var OS = __toESM(require("../OS"));
var log = __toESM(require("../logging/log"));
var import_enum = require("../util/enum");
var import_missingCaseError = require("../util/missingCaseError");
var NotificationSetting = /* @__PURE__ */ ((NotificationSetting2) => {
  NotificationSetting2["Off"] = "off";
  NotificationSetting2["NoNameOrMessage"] = "count";
  NotificationSetting2["NameOnly"] = "name";
  NotificationSetting2["NameAndMessage"] = "message";
  return NotificationSetting2;
})(NotificationSetting || {});
const parseNotificationSetting = (0, import_enum.makeEnumParser)(NotificationSetting, "message" /* NameAndMessage */);
const FALLBACK_NOTIFICATION_TITLE = "Signal";
class NotificationService extends import_events.default {
  constructor() {
    super();
    this.isEnabled = false;
    this.lastNotification = null;
    this.notificationData = null;
    this.update = (0, import_lodash.debounce)(this.fastUpdate.bind(this), 1e3);
  }
  initialize({
    i18n,
    storage
  }) {
    log.info("NotificationService initialized");
    this.i18n = i18n;
    this.storage = storage;
  }
  getStorage() {
    if (this.storage) {
      return this.storage;
    }
    log.error("NotificationService not initialized. Falling back to window.storage, but you should fix this");
    return window.storage;
  }
  getI18n() {
    if (this.i18n) {
      return this.i18n;
    }
    log.error("NotificationService not initialized. Falling back to window.i18n, but you should fix this");
    return window.i18n;
  }
  add(notificationData) {
    log.info("NotificationService: adding a notification and requesting an update");
    this.notificationData = notificationData;
    this.update();
  }
  notify({
    icon,
    message,
    onNotificationClick,
    silent,
    title
  }) {
    log.info("NotificationService: showing a notification");
    this.lastNotification?.close();
    const audioNotificationSupport = (0, import_Settings.getAudioNotificationSupport)();
    const notification = new window.Notification(title, {
      body: OS.isLinux() ? filterNotificationText(message) : message,
      icon,
      silent: silent || audioNotificationSupport !== import_Settings.AudioNotificationSupport.Native
    });
    notification.onclick = onNotificationClick;
    if (!silent && audioNotificationSupport === import_Settings.AudioNotificationSupport.Custom) {
      new import_Sound.Sound({ src: "sounds/notification.ogg" }).play();
    }
    this.lastNotification = notification;
  }
  removeBy({
    conversationId,
    messageId,
    emoji,
    targetAuthorUuid,
    targetTimestamp
  }) {
    if (!this.notificationData) {
      log.info("NotificationService#removeBy: no notification data");
      return;
    }
    let shouldClear = false;
    if (conversationId && this.notificationData.conversationId === conversationId) {
      log.info("NotificationService#removeBy: conversation ID matches");
      shouldClear = true;
    }
    if (messageId && this.notificationData.messageId === messageId) {
      log.info("NotificationService#removeBy: message ID matches");
      shouldClear = true;
    }
    if (!shouldClear) {
      return;
    }
    const { reaction } = this.notificationData;
    if (reaction && emoji && targetAuthorUuid && targetTimestamp && (reaction.emoji !== emoji || reaction.targetAuthorUuid !== targetAuthorUuid || reaction.targetTimestamp !== targetTimestamp)) {
      return;
    }
    this.clear();
    this.update();
  }
  fastUpdate() {
    const storage = this.getStorage();
    const i18n = this.getI18n();
    if (this.lastNotification) {
      this.lastNotification.close();
      this.lastNotification = null;
    }
    const { notificationData } = this;
    const isAppFocused = window.SignalContext.activeWindowService.isActive();
    const userSetting = this.getNotificationSetting();
    const shouldShowNotification = this.isEnabled && !isAppFocused && notificationData;
    if (!shouldShowNotification) {
      log.info(`NotificationService not updating notifications. Notifications are ${this.isEnabled ? "enabled" : "disabled"}; app is ${isAppFocused ? "" : "not "}focused; there is ${notificationData ? "" : "no "}notification data`);
      if (isAppFocused) {
        this.notificationData = null;
      }
      return;
    }
    const shouldPlayNotificationSound = Boolean(storage.get("audio-notification"));
    const shouldDrawAttention = storage.get("notification-draw-attention", true);
    if (shouldDrawAttention) {
      log.info("NotificationService: drawing attention");
      window.drawAttention();
    }
    let notificationTitle;
    let notificationMessage;
    let notificationIconUrl;
    const {
      conversationId,
      messageId,
      senderTitle,
      message,
      isExpiringMessage,
      reaction,
      wasShown
    } = notificationData;
    if (wasShown) {
      log.info("NotificationService: not showing a notification because it was already shown");
      return;
    }
    switch (userSetting) {
      case "off" /* Off */:
        log.info("NotificationService: not showing a notification because user has disabled it");
        return;
      case "name" /* NameOnly */:
      case "message" /* NameAndMessage */: {
        notificationTitle = senderTitle;
        ({ notificationIconUrl } = notificationData);
        if (isExpiringMessage && (0, import_Settings.shouldHideExpiringMessageBody)()) {
          notificationMessage = i18n("newMessage");
        } else if (userSetting === "name" /* NameOnly */) {
          if (reaction) {
            notificationMessage = i18n("notificationReaction", {
              sender: senderTitle,
              emoji: reaction.emoji
            });
          } else {
            notificationMessage = i18n("newMessage");
          }
        } else if (reaction) {
          notificationMessage = i18n("notificationReactionMessage", {
            sender: senderTitle,
            emoji: reaction.emoji,
            message
          });
        } else {
          notificationMessage = message;
        }
        break;
      }
      case "count" /* NoNameOrMessage */:
        notificationTitle = FALLBACK_NOTIFICATION_TITLE;
        notificationMessage = i18n("newMessage");
        break;
      default:
        log.error((0, import_missingCaseError.missingCaseError)(userSetting));
        notificationTitle = FALLBACK_NOTIFICATION_TITLE;
        notificationMessage = i18n("newMessage");
        break;
    }
    log.info("NotificationService: requesting a notification to be shown");
    this.notificationData = {
      ...notificationData,
      wasShown: true
    };
    this.notify({
      title: notificationTitle,
      icon: notificationIconUrl,
      message: notificationMessage,
      silent: !shouldPlayNotificationSound,
      onNotificationClick: () => {
        this.emit("click", conversationId, messageId);
      }
    });
  }
  getNotificationSetting() {
    return parseNotificationSetting(this.getStorage().get("notification-setting"));
  }
  clear() {
    log.info("NotificationService: clearing notification and requesting an update");
    this.notificationData = null;
    this.update();
  }
  fastClear() {
    log.info("NotificationService: clearing notification and updating");
    this.notificationData = null;
    this.fastUpdate();
  }
  enable() {
    log.info("NotificationService: enabling");
    const needUpdate = !this.isEnabled;
    this.isEnabled = true;
    if (needUpdate) {
      this.update();
    }
  }
  disable() {
    log.info("NotificationService: disabling");
    this.isEnabled = false;
  }
}
const notificationService = new NotificationService();
function filterNotificationText(text) {
  return (text || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FALLBACK_NOTIFICATION_TITLE,
  NotificationSetting,
  notificationService
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm90aWZpY2F0aW9ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTUtMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IFNvdW5kIH0gZnJvbSAnLi4vdXRpbC9Tb3VuZCc7XG5pbXBvcnQge1xuICBBdWRpb05vdGlmaWNhdGlvblN1cHBvcnQsXG4gIGdldEF1ZGlvTm90aWZpY2F0aW9uU3VwcG9ydCxcbiAgc2hvdWxkSGlkZUV4cGlyaW5nTWVzc2FnZUJvZHksXG59IGZyb20gJy4uL3R5cGVzL1NldHRpbmdzJztcbmltcG9ydCAqIGFzIE9TIGZyb20gJy4uL09TJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBtYWtlRW51bVBhcnNlciB9IGZyb20gJy4uL3V0aWwvZW51bSc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZUludGVyZmFjZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JhZ2UuZCc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcblxudHlwZSBOb3RpZmljYXRpb25EYXRhVHlwZSA9IFJlYWRvbmx5PHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gIHNlbmRlclRpdGxlOiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgbm90aWZpY2F0aW9uSWNvblVybD86IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgaXNFeHBpcmluZ01lc3NhZ2U6IGJvb2xlYW47XG4gIHJlYWN0aW9uOiB7XG4gICAgZW1vamk6IHN0cmluZztcbiAgICB0YXJnZXRBdXRob3JVdWlkOiBzdHJpbmc7XG4gICAgdGFyZ2V0VGltZXN0YW1wOiBudW1iZXI7XG4gIH07XG4gIHdhc1Nob3duPzogYm9vbGVhbjtcbn0+O1xuXG4vLyBUaGUga2V5cyBhbmQgdmFsdWVzIGRvbid0IG1hdGNoIGhlcmUuIFRoaXMgaXMgYmVjYXVzZSB0aGUgdmFsdWVzIGNvcnJlc3BvbmQgdG8gb2xkXG4vLyAgIHNldHRpbmcgbmFtZXMuIEluIHRoZSBmdXR1cmUsIHdlIG1heSB3aXNoIHRvIG1pZ3JhdGUgdGhlc2UgdG8gbWF0Y2guXG5leHBvcnQgZW51bSBOb3RpZmljYXRpb25TZXR0aW5nIHtcbiAgT2ZmID0gJ29mZicsXG4gIE5vTmFtZU9yTWVzc2FnZSA9ICdjb3VudCcsXG4gIE5hbWVPbmx5ID0gJ25hbWUnLFxuICBOYW1lQW5kTWVzc2FnZSA9ICdtZXNzYWdlJyxcbn1cblxuY29uc3QgcGFyc2VOb3RpZmljYXRpb25TZXR0aW5nID0gbWFrZUVudW1QYXJzZXIoXG4gIE5vdGlmaWNhdGlvblNldHRpbmcsXG4gIE5vdGlmaWNhdGlvblNldHRpbmcuTmFtZUFuZE1lc3NhZ2Vcbik7XG5cbmV4cG9ydCBjb25zdCBGQUxMQkFDS19OT1RJRklDQVRJT05fVElUTEUgPSAnU2lnbmFsJztcblxuLy8gRWxlY3Ryb24sIGF0IGxlYXN0IG9uIFdpbmRvd3MgYW5kIG1hY09TLCBvbmx5IHNob3dzIG9uZSBub3RpZmljYXRpb24gYXQgYSB0aW1lIChzZWVcbi8vICAgaXNzdWVzIFsjMTUzNjRdWzBdIGFuZCBbIzIxNjQ2XVsxXSwgYW1vbmcgb3RoZXJzKS4gQmVjYXVzZSBvZiB0aGF0LCB3ZSBoYXZlIGFcbi8vICAgc2luZ2xlIHNsb3QgZm9yIG5vdGlmaWNhdGlvbnMsIGFuZCBvbmNlIGEgbm90aWZpY2F0aW9uIGlzIGRpc21pc3NlZCwgYWxsIG9mXG4vLyAgIFNpZ25hbCdzIG5vdGlmaWNhdGlvbnMgYXJlIGRpc21pc3NlZC5cbi8vIFswXTogaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNTM2NFxuLy8gWzFdOiBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzIxNjQ2XG5jbGFzcyBOb3RpZmljYXRpb25TZXJ2aWNlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcHJpdmF0ZSBpMThuPzogTG9jYWxpemVyVHlwZTtcblxuICBwcml2YXRlIHN0b3JhZ2U/OiBTdG9yYWdlSW50ZXJmYWNlO1xuXG4gIHB1YmxpYyBpc0VuYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIGxhc3ROb3RpZmljYXRpb246IG51bGwgfCBOb3RpZmljYXRpb24gPSBudWxsO1xuXG4gIHByaXZhdGUgbm90aWZpY2F0aW9uRGF0YTogbnVsbCB8IE5vdGlmaWNhdGlvbkRhdGFUeXBlID0gbnVsbDtcblxuICAvLyBUZXN0aW5nIGluZGljYXRlZCB0aGF0IHRyeWluZyB0byBjcmVhdGUvZGVzdHJveSBub3RpZmljYXRpb25zIHRvbyBxdWlja2x5XG4gIC8vICAgcmVzdWx0ZWQgaW4gbm90aWZpY2F0aW9ucyB0aGF0IHN0dWNrIGFyb3VuZCBmb3JldmVyLCByZXF1aXJpbmcgdGhlIHVzZXJcbiAgLy8gICB0byBtYW51YWxseSBjbG9zZSB0aGVtLiBUaGlzIGludHJvZHVjZXMgYSBtaW5pbXVtIGFtb3VudCBvZiB0aW1lIGJldHdlZW4gY2FsbHMsXG4gIC8vICAgYW5kIGJhdGNoZXMgdXAgdGhlIHF1aWNrIHN1Y2Nlc3NpdmUgdXBkYXRlKCkgY2FsbHMgd2UgZ2V0IGZyb20gYW4gaW5jb21pbmdcbiAgLy8gICByZWFkIHN5bmMsIHdoaWNoIG1pZ2h0IGhhdmUgYSBudW1iZXIgb2YgbWVzc2FnZXMgcmVmZXJlbmNlZCBpbnNpZGUgb2YgaXQuXG4gIHByaXZhdGUgdXBkYXRlOiAoKSA9PiB1bmtub3duO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnVwZGF0ZSA9IGRlYm91bmNlKHRoaXMuZmFzdFVwZGF0ZS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKHtcbiAgICBpMThuLFxuICAgIHN0b3JhZ2UsXG4gIH06IFJlYWRvbmx5PHsgaTE4bjogTG9jYWxpemVyVHlwZTsgc3RvcmFnZTogU3RvcmFnZUludGVyZmFjZSB9Pik6IHZvaWQge1xuICAgIGxvZy5pbmZvKCdOb3RpZmljYXRpb25TZXJ2aWNlIGluaXRpYWxpemVkJyk7XG4gICAgdGhpcy5pMThuID0gaTE4bjtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdG9yYWdlKCk6IFN0b3JhZ2VJbnRlcmZhY2Uge1xuICAgIGlmICh0aGlzLnN0b3JhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2U7XG4gICAgfVxuXG4gICAgbG9nLmVycm9yKFxuICAgICAgJ05vdGlmaWNhdGlvblNlcnZpY2Ugbm90IGluaXRpYWxpemVkLiBGYWxsaW5nIGJhY2sgdG8gd2luZG93LnN0b3JhZ2UsIGJ1dCB5b3Ugc2hvdWxkIGZpeCB0aGlzJ1xuICAgICk7XG4gICAgcmV0dXJuIHdpbmRvdy5zdG9yYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRJMThuKCk6IExvY2FsaXplclR5cGUge1xuICAgIGlmICh0aGlzLmkxOG4pIHtcbiAgICAgIHJldHVybiB0aGlzLmkxOG47XG4gICAgfVxuXG4gICAgbG9nLmVycm9yKFxuICAgICAgJ05vdGlmaWNhdGlvblNlcnZpY2Ugbm90IGluaXRpYWxpemVkLiBGYWxsaW5nIGJhY2sgdG8gd2luZG93LmkxOG4sIGJ1dCB5b3Ugc2hvdWxkIGZpeCB0aGlzJ1xuICAgICk7XG4gICAgcmV0dXJuIHdpbmRvdy5pMThuO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgaGlnaGVyLWxldmVsIHdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuTm90aWZpY2F0aW9uYC4gWW91IG1heSBwcmVmZXIgdG8gdXNlIGBub3RpZnlgLFxuICAgKiB3aGljaCBkb2Vzbid0IGNoZWNrIHBlcm1pc3Npb25zLCBkbyBhbnkgZmlsdGVyaW5nLCBldGMuXG4gICAqL1xuICBwdWJsaWMgYWRkKG5vdGlmaWNhdGlvbkRhdGE6IE9taXQ8Tm90aWZpY2F0aW9uRGF0YVR5cGUsICd3YXNTaG93bic+KTogdm9pZCB7XG4gICAgbG9nLmluZm8oXG4gICAgICAnTm90aWZpY2F0aW9uU2VydmljZTogYWRkaW5nIGEgbm90aWZpY2F0aW9uIGFuZCByZXF1ZXN0aW5nIGFuIHVwZGF0ZSdcbiAgICApO1xuICAgIHRoaXMubm90aWZpY2F0aW9uRGF0YSA9IG5vdGlmaWNhdGlvbkRhdGE7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxvd2VyLWxldmVsIHdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuTm90aWZpY2F0aW9uYC4gWW91IG1heSBwcmVmZXIgdG8gdXNlIGBhZGRgLFxuICAgKiB3aGljaCBpbmNsdWRlcyBkZWJvdW5jaW5nIGFuZCB1c2VyIHBlcm1pc3Npb24gbG9naWMuXG4gICAqL1xuICBwdWJsaWMgbm90aWZ5KHtcbiAgICBpY29uLFxuICAgIG1lc3NhZ2UsXG4gICAgb25Ob3RpZmljYXRpb25DbGljayxcbiAgICBzaWxlbnQsXG4gICAgdGl0bGUsXG4gIH06IFJlYWRvbmx5PHtcbiAgICBpY29uPzogc3RyaW5nO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICBvbk5vdGlmaWNhdGlvbkNsaWNrOiAoKSA9PiB2b2lkO1xuICAgIHNpbGVudDogYm9vbGVhbjtcbiAgICB0aXRsZTogc3RyaW5nO1xuICB9Pik6IHZvaWQge1xuICAgIGxvZy5pbmZvKCdOb3RpZmljYXRpb25TZXJ2aWNlOiBzaG93aW5nIGEgbm90aWZpY2F0aW9uJyk7XG5cbiAgICB0aGlzLmxhc3ROb3RpZmljYXRpb24/LmNsb3NlKCk7XG5cbiAgICBjb25zdCBhdWRpb05vdGlmaWNhdGlvblN1cHBvcnQgPSBnZXRBdWRpb05vdGlmaWNhdGlvblN1cHBvcnQoKTtcblxuICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IG5ldyB3aW5kb3cuTm90aWZpY2F0aW9uKHRpdGxlLCB7XG4gICAgICBib2R5OiBPUy5pc0xpbnV4KCkgPyBmaWx0ZXJOb3RpZmljYXRpb25UZXh0KG1lc3NhZ2UpIDogbWVzc2FnZSxcbiAgICAgIGljb24sXG4gICAgICBzaWxlbnQ6XG4gICAgICAgIHNpbGVudCB8fCBhdWRpb05vdGlmaWNhdGlvblN1cHBvcnQgIT09IEF1ZGlvTm90aWZpY2F0aW9uU3VwcG9ydC5OYXRpdmUsXG4gICAgfSk7XG4gICAgbm90aWZpY2F0aW9uLm9uY2xpY2sgPSBvbk5vdGlmaWNhdGlvbkNsaWNrO1xuXG4gICAgaWYgKFxuICAgICAgIXNpbGVudCAmJlxuICAgICAgYXVkaW9Ob3RpZmljYXRpb25TdXBwb3J0ID09PSBBdWRpb05vdGlmaWNhdGlvblN1cHBvcnQuQ3VzdG9tXG4gICAgKSB7XG4gICAgICAvLyBXZSBraWNrIG9mZiB0aGUgc291bmQgdG8gYmUgcGxheWVkLiBObyBuZWVkIHRvIGF3YWl0IGl0LlxuICAgICAgbmV3IFNvdW5kKHsgc3JjOiAnc291bmRzL25vdGlmaWNhdGlvbi5vZ2cnIH0pLnBsYXkoKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3ROb3RpZmljYXRpb24gPSBub3RpZmljYXRpb247XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIGxhc3Qgbm90aWZpY2F0aW9uIGlmIGJvdGggY29uZGl0aW9ucyBob2xkOlxuICAvL1xuICAvLyAxLiBFaXRoZXIgYGNvbnZlcnNhdGlvbklkYCBvciBgbWVzc2FnZUlkYCBtYXRjaGVzIChpZiBwcmVzZW50KVxuICAvLyAyLiBgZW1vamlgLCBgdGFyZ2V0QXV0aG9yVXVpZGAsIGB0YXJnZXRUaW1lc3RhbXBgIG1hdGNoZXMgKGlmIHByZXNlbnQpXG4gIHB1YmxpYyByZW1vdmVCeSh7XG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAgbWVzc2FnZUlkLFxuICAgIGVtb2ppLFxuICAgIHRhcmdldEF1dGhvclV1aWQsXG4gICAgdGFyZ2V0VGltZXN0YW1wLFxuICB9OiBSZWFkb25seTx7XG4gICAgY29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gICAgbWVzc2FnZUlkPzogc3RyaW5nO1xuICAgIGVtb2ppPzogc3RyaW5nO1xuICAgIHRhcmdldEF1dGhvclV1aWQ/OiBzdHJpbmc7XG4gICAgdGFyZ2V0VGltZXN0YW1wPzogbnVtYmVyO1xuICB9Pik6IHZvaWQge1xuICAgIGlmICghdGhpcy5ub3RpZmljYXRpb25EYXRhKSB7XG4gICAgICBsb2cuaW5mbygnTm90aWZpY2F0aW9uU2VydmljZSNyZW1vdmVCeTogbm8gbm90aWZpY2F0aW9uIGRhdGEnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2hvdWxkQ2xlYXIgPSBmYWxzZTtcbiAgICBpZiAoXG4gICAgICBjb252ZXJzYXRpb25JZCAmJlxuICAgICAgdGhpcy5ub3RpZmljYXRpb25EYXRhLmNvbnZlcnNhdGlvbklkID09PSBjb252ZXJzYXRpb25JZFxuICAgICkge1xuICAgICAgbG9nLmluZm8oJ05vdGlmaWNhdGlvblNlcnZpY2UjcmVtb3ZlQnk6IGNvbnZlcnNhdGlvbiBJRCBtYXRjaGVzJyk7XG4gICAgICBzaG91bGRDbGVhciA9IHRydWU7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlSWQgJiYgdGhpcy5ub3RpZmljYXRpb25EYXRhLm1lc3NhZ2VJZCA9PT0gbWVzc2FnZUlkKSB7XG4gICAgICBsb2cuaW5mbygnTm90aWZpY2F0aW9uU2VydmljZSNyZW1vdmVCeTogbWVzc2FnZSBJRCBtYXRjaGVzJyk7XG4gICAgICBzaG91bGRDbGVhciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFzaG91bGRDbGVhcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcmVhY3Rpb24gfSA9IHRoaXMubm90aWZpY2F0aW9uRGF0YTtcbiAgICBpZiAoXG4gICAgICByZWFjdGlvbiAmJlxuICAgICAgZW1vamkgJiZcbiAgICAgIHRhcmdldEF1dGhvclV1aWQgJiZcbiAgICAgIHRhcmdldFRpbWVzdGFtcCAmJlxuICAgICAgKHJlYWN0aW9uLmVtb2ppICE9PSBlbW9qaSB8fFxuICAgICAgICByZWFjdGlvbi50YXJnZXRBdXRob3JVdWlkICE9PSB0YXJnZXRBdXRob3JVdWlkIHx8XG4gICAgICAgIHJlYWN0aW9uLnRhcmdldFRpbWVzdGFtcCAhPT0gdGFyZ2V0VGltZXN0YW1wKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBmYXN0VXBkYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0b3JhZ2UgPSB0aGlzLmdldFN0b3JhZ2UoKTtcbiAgICBjb25zdCBpMThuID0gdGhpcy5nZXRJMThuKCk7XG5cbiAgICBpZiAodGhpcy5sYXN0Tm90aWZpY2F0aW9uKSB7XG4gICAgICB0aGlzLmxhc3ROb3RpZmljYXRpb24uY2xvc2UoKTtcbiAgICAgIHRoaXMubGFzdE5vdGlmaWNhdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBub3RpZmljYXRpb25EYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGlzQXBwRm9jdXNlZCA9IHdpbmRvdy5TaWduYWxDb250ZXh0LmFjdGl2ZVdpbmRvd1NlcnZpY2UuaXNBY3RpdmUoKTtcbiAgICBjb25zdCB1c2VyU2V0dGluZyA9IHRoaXMuZ2V0Tm90aWZpY2F0aW9uU2V0dGluZygpO1xuXG4gICAgLy8gVGhpcyBpc24ndCBhIGJvb2xlYW4gYmVjYXVzZSBUeXBlU2NyaXB0IGlzbid0IHNtYXJ0IGVub3VnaCB0byBrbm93IHRoYXQsIGlmXG4gICAgLy8gICBgQm9vbGVhbihub3RpZmljYXRpb25EYXRhKWAgaXMgdHJ1ZSwgYG5vdGlmaWNhdGlvbkRhdGFgIGlzIHRydXRoeS5cbiAgICBjb25zdCBzaG91bGRTaG93Tm90aWZpY2F0aW9uID1cbiAgICAgIHRoaXMuaXNFbmFibGVkICYmICFpc0FwcEZvY3VzZWQgJiYgbm90aWZpY2F0aW9uRGF0YTtcbiAgICBpZiAoIXNob3VsZFNob3dOb3RpZmljYXRpb24pIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgTm90aWZpY2F0aW9uU2VydmljZSBub3QgdXBkYXRpbmcgbm90aWZpY2F0aW9ucy4gTm90aWZpY2F0aW9ucyBhcmUgJHtcbiAgICAgICAgICB0aGlzLmlzRW5hYmxlZCA/ICdlbmFibGVkJyA6ICdkaXNhYmxlZCdcbiAgICAgICAgfTsgYXBwIGlzICR7aXNBcHBGb2N1c2VkID8gJycgOiAnbm90ICd9Zm9jdXNlZDsgdGhlcmUgaXMgJHtcbiAgICAgICAgICBub3RpZmljYXRpb25EYXRhID8gJycgOiAnbm8gJ1xuICAgICAgICB9bm90aWZpY2F0aW9uIGRhdGFgXG4gICAgICApO1xuICAgICAgaWYgKGlzQXBwRm9jdXNlZCkge1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbkRhdGEgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNob3VsZFBsYXlOb3RpZmljYXRpb25Tb3VuZCA9IEJvb2xlYW4oXG4gICAgICBzdG9yYWdlLmdldCgnYXVkaW8tbm90aWZpY2F0aW9uJylcbiAgICApO1xuXG4gICAgY29uc3Qgc2hvdWxkRHJhd0F0dGVudGlvbiA9IHN0b3JhZ2UuZ2V0KFxuICAgICAgJ25vdGlmaWNhdGlvbi1kcmF3LWF0dGVudGlvbicsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBpZiAoc2hvdWxkRHJhd0F0dGVudGlvbikge1xuICAgICAgbG9nLmluZm8oJ05vdGlmaWNhdGlvblNlcnZpY2U6IGRyYXdpbmcgYXR0ZW50aW9uJyk7XG4gICAgICB3aW5kb3cuZHJhd0F0dGVudGlvbigpO1xuICAgIH1cblxuICAgIGxldCBub3RpZmljYXRpb25UaXRsZTogc3RyaW5nO1xuICAgIGxldCBub3RpZmljYXRpb25NZXNzYWdlOiBzdHJpbmc7XG4gICAgbGV0IG5vdGlmaWNhdGlvbkljb25Vcmw6IHVuZGVmaW5lZCB8IHN0cmluZztcblxuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgbWVzc2FnZUlkLFxuICAgICAgc2VuZGVyVGl0bGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgaXNFeHBpcmluZ01lc3NhZ2UsXG4gICAgICByZWFjdGlvbixcbiAgICAgIHdhc1Nob3duLFxuICAgIH0gPSBub3RpZmljYXRpb25EYXRhO1xuXG4gICAgaWYgKHdhc1Nob3duKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ05vdGlmaWNhdGlvblNlcnZpY2U6IG5vdCBzaG93aW5nIGEgbm90aWZpY2F0aW9uIGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgc2hvd24nXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAodXNlclNldHRpbmcpIHtcbiAgICAgIGNhc2UgTm90aWZpY2F0aW9uU2V0dGluZy5PZmY6XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdOb3RpZmljYXRpb25TZXJ2aWNlOiBub3Qgc2hvd2luZyBhIG5vdGlmaWNhdGlvbiBiZWNhdXNlIHVzZXIgaGFzIGRpc2FibGVkIGl0J1xuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIE5vdGlmaWNhdGlvblNldHRpbmcuTmFtZU9ubHk6XG4gICAgICBjYXNlIE5vdGlmaWNhdGlvblNldHRpbmcuTmFtZUFuZE1lc3NhZ2U6IHtcbiAgICAgICAgbm90aWZpY2F0aW9uVGl0bGUgPSBzZW5kZXJUaXRsZTtcbiAgICAgICAgKHsgbm90aWZpY2F0aW9uSWNvblVybCB9ID0gbm90aWZpY2F0aW9uRGF0YSk7XG5cbiAgICAgICAgaWYgKGlzRXhwaXJpbmdNZXNzYWdlICYmIHNob3VsZEhpZGVFeHBpcmluZ01lc3NhZ2VCb2R5KCkpIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gaTE4bignbmV3TWVzc2FnZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJTZXR0aW5nID09PSBOb3RpZmljYXRpb25TZXR0aW5nLk5hbWVPbmx5KSB7XG4gICAgICAgICAgaWYgKHJlYWN0aW9uKSB7XG4gICAgICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gaTE4bignbm90aWZpY2F0aW9uUmVhY3Rpb24nLCB7XG4gICAgICAgICAgICAgIHNlbmRlcjogc2VuZGVyVGl0bGUsXG4gICAgICAgICAgICAgIGVtb2ppOiByZWFjdGlvbi5lbW9qaSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gaTE4bignbmV3TWVzc2FnZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWFjdGlvbikge1xuICAgICAgICAgIG5vdGlmaWNhdGlvbk1lc3NhZ2UgPSBpMThuKCdub3RpZmljYXRpb25SZWFjdGlvbk1lc3NhZ2UnLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHNlbmRlclRpdGxlLFxuICAgICAgICAgICAgZW1vamk6IHJlYWN0aW9uLmVtb2ppLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgTm90aWZpY2F0aW9uU2V0dGluZy5Ob05hbWVPck1lc3NhZ2U6XG4gICAgICAgIG5vdGlmaWNhdGlvblRpdGxlID0gRkFMTEJBQ0tfTk9USUZJQ0FUSU9OX1RJVExFO1xuICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gaTE4bignbmV3TWVzc2FnZScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZy5lcnJvcihtaXNzaW5nQ2FzZUVycm9yKHVzZXJTZXR0aW5nKSk7XG4gICAgICAgIG5vdGlmaWNhdGlvblRpdGxlID0gRkFMTEJBQ0tfTk9USUZJQ0FUSU9OX1RJVExFO1xuICAgICAgICBub3RpZmljYXRpb25NZXNzYWdlID0gaTE4bignbmV3TWVzc2FnZScpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsb2cuaW5mbygnTm90aWZpY2F0aW9uU2VydmljZTogcmVxdWVzdGluZyBhIG5vdGlmaWNhdGlvbiB0byBiZSBzaG93bicpO1xuXG4gICAgdGhpcy5ub3RpZmljYXRpb25EYXRhID0ge1xuICAgICAgLi4ubm90aWZpY2F0aW9uRGF0YSxcbiAgICAgIHdhc1Nob3duOiB0cnVlLFxuICAgIH07XG5cbiAgICB0aGlzLm5vdGlmeSh7XG4gICAgICB0aXRsZTogbm90aWZpY2F0aW9uVGl0bGUsXG4gICAgICBpY29uOiBub3RpZmljYXRpb25JY29uVXJsLFxuICAgICAgbWVzc2FnZTogbm90aWZpY2F0aW9uTWVzc2FnZSxcbiAgICAgIHNpbGVudDogIXNob3VsZFBsYXlOb3RpZmljYXRpb25Tb3VuZCxcbiAgICAgIG9uTm90aWZpY2F0aW9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdjbGljaycsIGNvbnZlcnNhdGlvbklkLCBtZXNzYWdlSWQpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb25TZXR0aW5nKCk6IE5vdGlmaWNhdGlvblNldHRpbmcge1xuICAgIHJldHVybiBwYXJzZU5vdGlmaWNhdGlvblNldHRpbmcoXG4gICAgICB0aGlzLmdldFN0b3JhZ2UoKS5nZXQoJ25vdGlmaWNhdGlvbi1zZXR0aW5nJylcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIGxvZy5pbmZvKFxuICAgICAgJ05vdGlmaWNhdGlvblNlcnZpY2U6IGNsZWFyaW5nIG5vdGlmaWNhdGlvbiBhbmQgcmVxdWVzdGluZyBhbiB1cGRhdGUnXG4gICAgKTtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbkRhdGEgPSBudWxsO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICAvLyBXZSBkb24ndCB1c3VhbGx5IGNhbGwgdGhpcywgYnV0IHdoZW4gdGhlIHByb2Nlc3MgaXMgc2h1dHRpbmcgZG93biwgd2Ugc2hvdWxkIGF0XG4gIC8vICAgbGVhc3QgdHJ5IHRvIHJlbW92ZSB0aGUgbm90aWZpY2F0aW9uIGltbWVkaWF0ZWx5IGluc3RlYWQgb2Ygd2FpdGluZyBmb3IgdGhlXG4gIC8vICAgbm9ybWFsIGRlYm91bmNlLlxuICBwdWJsaWMgZmFzdENsZWFyKCk6IHZvaWQge1xuICAgIGxvZy5pbmZvKCdOb3RpZmljYXRpb25TZXJ2aWNlOiBjbGVhcmluZyBub3RpZmljYXRpb24gYW5kIHVwZGF0aW5nJyk7XG4gICAgdGhpcy5ub3RpZmljYXRpb25EYXRhID0gbnVsbDtcbiAgICB0aGlzLmZhc3RVcGRhdGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGUoKTogdm9pZCB7XG4gICAgbG9nLmluZm8oJ05vdGlmaWNhdGlvblNlcnZpY2U6IGVuYWJsaW5nJyk7XG4gICAgY29uc3QgbmVlZFVwZGF0ZSA9ICF0aGlzLmlzRW5hYmxlZDtcbiAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XG4gICAgaWYgKG5lZWRVcGRhdGUpIHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRpc2FibGUoKTogdm9pZCB7XG4gICAgbG9nLmluZm8oJ05vdGlmaWNhdGlvblNlcnZpY2U6IGRpc2FibGluZycpO1xuICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvblNlcnZpY2UgPSBuZXcgTm90aWZpY2F0aW9uU2VydmljZSgpO1xuXG5mdW5jdGlvbiBmaWx0ZXJOb3RpZmljYXRpb25UZXh0KHRleHQ6IHN0cmluZykge1xuICByZXR1cm4gKHRleHQgfHwgJycpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyZhcG9zOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUF5QjtBQUN6QixvQkFBeUI7QUFDekIsbUJBQXNCO0FBQ3RCLHNCQUlPO0FBQ1AsU0FBb0I7QUFDcEIsVUFBcUI7QUFDckIsa0JBQStCO0FBQy9CLDhCQUFpQztBQXFCMUIsSUFBSyxzQkFBTCxrQkFBSyx5QkFBTDtBQUNMLGdDQUFNO0FBQ04sNENBQWtCO0FBQ2xCLHFDQUFXO0FBQ1gsMkNBQWlCO0FBSlA7QUFBQTtBQU9aLE1BQU0sMkJBQTJCLGdDQUMvQixxQkFDQSw4QkFDRjtBQUVPLE1BQU0sOEJBQThCO0FBUTNDLE1BQU0sNEJBQTRCLHNCQUFhO0FBQUEsRUFrQjdDLGNBQWM7QUFDWixVQUFNO0FBZEQscUJBQVk7QUFFWCw0QkFBd0M7QUFFeEMsNEJBQWdEO0FBWXRELFNBQUssU0FBUyw0QkFBUyxLQUFLLFdBQVcsS0FBSyxJQUFJLEdBQUcsR0FBSTtBQUFBLEVBQ3pEO0FBQUEsRUFFTyxXQUFXO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsS0FDcUU7QUFDckUsUUFBSSxLQUFLLGlDQUFpQztBQUMxQyxTQUFLLE9BQU87QUFDWixTQUFLLFVBQVU7QUFBQSxFQUNqQjtBQUFBLEVBRVEsYUFBK0I7QUFDckMsUUFBSSxLQUFLLFNBQVM7QUFDaEIsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUVBLFFBQUksTUFDRiw4RkFDRjtBQUNBLFdBQU8sT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFUSxVQUF5QjtBQUMvQixRQUFJLEtBQUssTUFBTTtBQUNiLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFFQSxRQUFJLE1BQ0YsMkZBQ0Y7QUFDQSxXQUFPLE9BQU87QUFBQSxFQUNoQjtB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
