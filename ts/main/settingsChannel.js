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
var settingsChannel_exports = {};
__export(settingsChannel_exports, {
  SettingsChannel: () => SettingsChannel
});
module.exports = __toCommonJS(settingsChannel_exports);
var import_electron = require("electron");
var import_events = require("events");
var import_user_config = require("../../app/user_config");
var import_ephemeral_config = require("../../app/ephemeral_config");
var import_permissions = require("../../app/permissions");
var import_assert = require("../util/assert");
var import_explodePromise = require("../util/explodePromise");
const EPHEMERAL_NAME_MAP = /* @__PURE__ */ new Map([
  ["spellCheck", "spell-check"],
  ["systemTraySetting", "system-tray-setting"],
  ["themeSetting", "theme-setting"]
]);
class SettingsChannel extends import_events.EventEmitter {
  constructor() {
    super(...arguments);
    this.responseQueue = /* @__PURE__ */ new Map();
    this.responseSeq = 0;
  }
  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }
  getMainWindow() {
    return this.mainWindow;
  }
  install() {
    this.installSetting("deviceName", { setter: false });
    this.installCallback("getCustomColors");
    this.installCallback("getConversationsWithCustomColor");
    this.installCallback("resetAllChatColors");
    this.installCallback("resetDefaultChatColor");
    this.installCallback("addCustomColor");
    this.installCallback("editCustomColor");
    this.installCallback("removeCustomColor");
    this.installCallback("removeCustomColorOnConversations");
    this.installCallback("setGlobalDefaultConversationColor");
    this.installCallback("getDefaultConversationColor");
    this.installCallback("getAvailableIODevices");
    this.installCallback("isPrimary");
    this.installCallback("syncRequest");
    this.installCallback("isPhoneNumberSharingEnabled");
    this.installCallback("shouldShowStoriesSettings");
    this.installSetting("blockedCount", { setter: false });
    this.installSetting("linkPreviewSetting", { setter: false });
    this.installSetting("phoneNumberDiscoverabilitySetting", { setter: false });
    this.installSetting("phoneNumberSharingSetting", { setter: false });
    this.installSetting("readReceiptSetting", { setter: false });
    this.installSetting("typingIndicatorSetting", { setter: false });
    this.installSetting("themeSetting", {
      isEphemeral: true
    });
    this.installSetting("hideMenuBar");
    this.installSetting("systemTraySetting", {
      isEphemeral: true
    });
    this.installSetting("notificationSetting");
    this.installSetting("notificationDrawAttention");
    this.installSetting("audioNotification");
    this.installSetting("countMutedConversations");
    this.installSetting("spellCheck", {
      isEphemeral: true
    });
    this.installSetting("autoDownloadUpdate");
    this.installSetting("autoLaunch");
    this.installSetting("alwaysRelayCalls");
    this.installSetting("callRingtoneNotification");
    this.installSetting("callSystemNotification");
    this.installSetting("incomingCallNotification");
    this.installSetting("preferredAudioInputDevice");
    this.installSetting("preferredAudioOutputDevice");
    this.installSetting("preferredVideoInputDevice");
    this.installSetting("lastSyncTime");
    this.installSetting("universalExpireTimer");
    this.installSetting("hasStoriesEnabled");
    this.installSetting("zoomFactor");
    (0, import_permissions.installPermissionsHandler)({ session: import_electron.session, userConfig: import_user_config.userConfig });
    import_electron.ipcMain.handle("settings:get:mediaPermissions", () => {
      return import_user_config.userConfig.get("mediaPermissions") || false;
    });
    import_electron.ipcMain.handle("settings:get:mediaCameraPermissions", () => {
      return import_user_config.userConfig.get("mediaCameraPermissions") || false;
    });
    import_electron.ipcMain.handle("settings:set:mediaPermissions", (_event, value) => {
      import_user_config.userConfig.set("mediaPermissions", value);
      (0, import_permissions.installPermissionsHandler)({ session: import_electron.session, userConfig: import_user_config.userConfig });
    });
    import_electron.ipcMain.handle("settings:set:mediaCameraPermissions", (_event, value) => {
      import_user_config.userConfig.set("mediaCameraPermissions", value);
      (0, import_permissions.installPermissionsHandler)({ session: import_electron.session, userConfig: import_user_config.userConfig });
    });
    import_electron.ipcMain.on("settings:response", (_event, seq, error, value) => {
      const entry = this.responseQueue.get(seq);
      this.responseQueue.delete(seq);
      if (!entry) {
        return;
      }
      const { resolve, reject } = entry;
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  }
  waitForResponse() {
    const seq = this.responseSeq;
    this.responseSeq = this.responseSeq + 1 & 2147483647;
    const { promise, resolve, reject } = (0, import_explodePromise.explodePromise)();
    this.responseQueue.set(seq, { resolve, reject });
    return { seq, promise };
  }
  getSettingFromMainWindow(name) {
    const { mainWindow } = this;
    if (!mainWindow || !mainWindow.webContents) {
      throw new Error("No main window");
    }
    const { seq, promise } = this.waitForResponse();
    mainWindow.webContents.send(`settings:get:${name}`, { seq });
    return promise;
  }
  setSettingInMainWindow(name, value) {
    const { mainWindow } = this;
    if (!mainWindow || !mainWindow.webContents) {
      throw new Error("No main window");
    }
    const { seq, promise } = this.waitForResponse();
    mainWindow.webContents.send(`settings:set:${name}`, { seq, value });
    return promise;
  }
  invokeCallbackInMainWindow(name, args) {
    const { mainWindow } = this;
    if (!mainWindow || !mainWindow.webContents) {
      throw new Error("Main window not found");
    }
    const { seq, promise } = this.waitForResponse();
    mainWindow.webContents.send(`settings:call:${name}`, { seq, args });
    return promise;
  }
  installCallback(name) {
    import_electron.ipcMain.handle(`settings:call:${name}`, async (_event, args) => {
      return this.invokeCallbackInMainWindow(name, args);
    });
  }
  installSetting(name, {
    getter = true,
    setter = true,
    isEphemeral = false
  } = {}) {
    if (getter) {
      import_electron.ipcMain.handle(`settings:get:${name}`, async () => {
        return this.getSettingFromMainWindow(name);
      });
    }
    if (!setter) {
      return;
    }
    import_electron.ipcMain.handle(`settings:set:${name}`, async (_event, value) => {
      if (isEphemeral) {
        const ephemeralName = EPHEMERAL_NAME_MAP.get(name);
        (0, import_assert.strictAssert)(ephemeralName !== void 0, `${name} is not an ephemeral setting`);
        import_ephemeral_config.ephemeralConfig.set(ephemeralName, value);
      }
      await this.setSettingInMainWindow(name, value);
      this.emit(`change:${name}`, value);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SettingsChannel
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2V0dGluZ3NDaGFubmVsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNy0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgaXBjTWFpbiBhcyBpcGMsIHNlc3Npb24gfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgeyB1c2VyQ29uZmlnIH0gZnJvbSAnLi4vLi4vYXBwL3VzZXJfY29uZmlnJztcbmltcG9ydCB7IGVwaGVtZXJhbENvbmZpZyB9IGZyb20gJy4uLy4uL2FwcC9lcGhlbWVyYWxfY29uZmlnJztcbmltcG9ydCB7IGluc3RhbGxQZXJtaXNzaW9uc0hhbmRsZXIgfSBmcm9tICcuLi8uLi9hcHAvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgZXhwbG9kZVByb21pc2UgfSBmcm9tICcuLi91dGlsL2V4cGxvZGVQcm9taXNlJztcbmltcG9ydCB0eXBlIHtcbiAgSVBDRXZlbnRzVmFsdWVzVHlwZSxcbiAgSVBDRXZlbnRzQ2FsbGJhY2tzVHlwZSxcbn0gZnJvbSAnLi4vdXRpbC9jcmVhdGVJUENFdmVudHMnO1xuXG5jb25zdCBFUEhFTUVSQUxfTkFNRV9NQVAgPSBuZXcgTWFwKFtcbiAgWydzcGVsbENoZWNrJywgJ3NwZWxsLWNoZWNrJ10sXG4gIFsnc3lzdGVtVHJheVNldHRpbmcnLCAnc3lzdGVtLXRyYXktc2V0dGluZyddLFxuICBbJ3RoZW1lU2V0dGluZycsICd0aGVtZS1zZXR0aW5nJ10sXG5dKTtcblxudHlwZSBSZXNwb25zZVF1ZXVlRW50cnkgPSBSZWFkb25seTx7XG4gIHJlc29sdmUodmFsdWU6IHVua25vd24pOiB2b2lkO1xuICByZWplY3QoZXJyb3I6IEVycm9yKTogdm9pZDtcbn0+O1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDaGFubmVsIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcHJpdmF0ZSBtYWluV2luZG93PzogQnJvd3NlcldpbmRvdztcblxuICBwcml2YXRlIHJlYWRvbmx5IHJlc3BvbnNlUXVldWUgPSBuZXcgTWFwPG51bWJlciwgUmVzcG9uc2VRdWV1ZUVudHJ5PigpO1xuXG4gIHByaXZhdGUgcmVzcG9uc2VTZXEgPSAwO1xuXG4gIHB1YmxpYyBzZXRNYWluV2luZG93KG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLm1haW5XaW5kb3cgPSBtYWluV2luZG93O1xuICB9XG5cbiAgcHVibGljIGdldE1haW5XaW5kb3coKTogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMubWFpbldpbmRvdztcbiAgfVxuXG4gIHB1YmxpYyBpbnN0YWxsKCk6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2RldmljZU5hbWUnLCB7IHNldHRlcjogZmFsc2UgfSk7XG5cbiAgICAvLyBDaGF0Q29sb3JQaWNrZXIgcmVkdXggaG9va3Vwc1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdnZXRDdXN0b21Db2xvcnMnKTtcbiAgICB0aGlzLmluc3RhbGxDYWxsYmFjaygnZ2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvcicpO1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdyZXNldEFsbENoYXRDb2xvcnMnKTtcbiAgICB0aGlzLmluc3RhbGxDYWxsYmFjaygncmVzZXREZWZhdWx0Q2hhdENvbG9yJyk7XG4gICAgdGhpcy5pbnN0YWxsQ2FsbGJhY2soJ2FkZEN1c3RvbUNvbG9yJyk7XG4gICAgdGhpcy5pbnN0YWxsQ2FsbGJhY2soJ2VkaXRDdXN0b21Db2xvcicpO1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdyZW1vdmVDdXN0b21Db2xvcicpO1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdyZW1vdmVDdXN0b21Db2xvck9uQ29udmVyc2F0aW9ucycpO1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdzZXRHbG9iYWxEZWZhdWx0Q29udmVyc2F0aW9uQ29sb3InKTtcbiAgICB0aGlzLmluc3RhbGxDYWxsYmFjaygnZ2V0RGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yJyk7XG5cbiAgICAvLyBWYXJpb3VzIGNhbGxiYWNrc1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdnZXRBdmFpbGFibGVJT0RldmljZXMnKTtcbiAgICB0aGlzLmluc3RhbGxDYWxsYmFjaygnaXNQcmltYXJ5Jyk7XG4gICAgdGhpcy5pbnN0YWxsQ2FsbGJhY2soJ3N5bmNSZXF1ZXN0Jyk7XG4gICAgdGhpcy5pbnN0YWxsQ2FsbGJhY2soJ2lzUGhvbmVOdW1iZXJTaGFyaW5nRW5hYmxlZCcpO1xuICAgIHRoaXMuaW5zdGFsbENhbGxiYWNrKCdzaG91bGRTaG93U3Rvcmllc1NldHRpbmdzJyk7XG5cbiAgICAvLyBHZXR0ZXJzIG9ubHkuIFRoZXNlIGFyZSBzZXQgYnkgdGhlIHByaW1hcnkgZGV2aWNlXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnYmxvY2tlZENvdW50JywgeyBzZXR0ZXI6IGZhbHNlIH0pO1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2xpbmtQcmV2aWV3U2V0dGluZycsIHsgc2V0dGVyOiBmYWxzZSB9KTtcbiAgICB0aGlzLmluc3RhbGxTZXR0aW5nKCdwaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eVNldHRpbmcnLCB7IHNldHRlcjogZmFsc2UgfSk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygncGhvbmVOdW1iZXJTaGFyaW5nU2V0dGluZycsIHsgc2V0dGVyOiBmYWxzZSB9KTtcbiAgICB0aGlzLmluc3RhbGxTZXR0aW5nKCdyZWFkUmVjZWlwdFNldHRpbmcnLCB7IHNldHRlcjogZmFsc2UgfSk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygndHlwaW5nSW5kaWNhdG9yU2V0dGluZycsIHsgc2V0dGVyOiBmYWxzZSB9KTtcblxuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ3RoZW1lU2V0dGluZycsIHtcbiAgICAgIGlzRXBoZW1lcmFsOiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2hpZGVNZW51QmFyJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnc3lzdGVtVHJheVNldHRpbmcnLCB7XG4gICAgICBpc0VwaGVtZXJhbDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ25vdGlmaWNhdGlvblNldHRpbmcnKTtcbiAgICB0aGlzLmluc3RhbGxTZXR0aW5nKCdub3RpZmljYXRpb25EcmF3QXR0ZW50aW9uJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnYXVkaW9Ob3RpZmljYXRpb24nKTtcbiAgICB0aGlzLmluc3RhbGxTZXR0aW5nKCdjb3VudE11dGVkQ29udmVyc2F0aW9ucycpO1xuXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnc3BlbGxDaGVjaycsIHtcbiAgICAgIGlzRXBoZW1lcmFsOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnYXV0b0Rvd25sb2FkVXBkYXRlJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnYXV0b0xhdW5jaCcpO1xuXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnYWx3YXlzUmVsYXlDYWxscycpO1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2NhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbicpO1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2NhbGxTeXN0ZW1Ob3RpZmljYXRpb24nKTtcbiAgICB0aGlzLmluc3RhbGxTZXR0aW5nKCdpbmNvbWluZ0NhbGxOb3RpZmljYXRpb24nKTtcblxuICAgIC8vIE1lZGlhIHNldHRpbmdzXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygncHJlZmVycmVkQXVkaW9JbnB1dERldmljZScpO1xuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ3ByZWZlcnJlZEF1ZGlvT3V0cHV0RGV2aWNlJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygncHJlZmVycmVkVmlkZW9JbnB1dERldmljZScpO1xuXG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnbGFzdFN5bmNUaW1lJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygndW5pdmVyc2FsRXhwaXJlVGltZXInKTtcblxuICAgIHRoaXMuaW5zdGFsbFNldHRpbmcoJ2hhc1N0b3JpZXNFbmFibGVkJyk7XG4gICAgdGhpcy5pbnN0YWxsU2V0dGluZygnem9vbUZhY3RvcicpO1xuXG4gICAgaW5zdGFsbFBlcm1pc3Npb25zSGFuZGxlcih7IHNlc3Npb24sIHVzZXJDb25maWcgfSk7XG5cbiAgICAvLyBUaGVzZSBvbmVzIGFyZSBkaWZmZXJlbnQgYmVjYXVzZSBpdHMgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBpcyB1c2VyQ29uZmlnLFxuICAgIC8vIG5vdCBJbmRleGVkREJcbiAgICBpcGMuaGFuZGxlKCdzZXR0aW5nczpnZXQ6bWVkaWFQZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAgIHJldHVybiB1c2VyQ29uZmlnLmdldCgnbWVkaWFQZXJtaXNzaW9ucycpIHx8IGZhbHNlO1xuICAgIH0pO1xuICAgIGlwYy5oYW5kbGUoJ3NldHRpbmdzOmdldDptZWRpYUNhbWVyYVBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgICAgcmV0dXJuIHVzZXJDb25maWcuZ2V0KCdtZWRpYUNhbWVyYVBlcm1pc3Npb25zJykgfHwgZmFsc2U7XG4gICAgfSk7XG4gICAgaXBjLmhhbmRsZSgnc2V0dGluZ3M6c2V0Om1lZGlhUGVybWlzc2lvbnMnLCAoX2V2ZW50LCB2YWx1ZSkgPT4ge1xuICAgICAgdXNlckNvbmZpZy5zZXQoJ21lZGlhUGVybWlzc2lvbnMnLCB2YWx1ZSk7XG5cbiAgICAgIC8vIFdlIHJlaW5zdGFsbCBwZXJtaXNzaW9ucyBoYW5kbGVyIHRvIGVuc3VyZSB0aGF0IGEgcmV2b2tlZCBwZXJtaXNzaW9uIHRha2VzIGVmZmVjdFxuICAgICAgaW5zdGFsbFBlcm1pc3Npb25zSGFuZGxlcih7IHNlc3Npb24sIHVzZXJDb25maWcgfSk7XG4gICAgfSk7XG4gICAgaXBjLmhhbmRsZSgnc2V0dGluZ3M6c2V0Om1lZGlhQ2FtZXJhUGVybWlzc2lvbnMnLCAoX2V2ZW50LCB2YWx1ZSkgPT4ge1xuICAgICAgdXNlckNvbmZpZy5zZXQoJ21lZGlhQ2FtZXJhUGVybWlzc2lvbnMnLCB2YWx1ZSk7XG5cbiAgICAgIC8vIFdlIHJlaW5zdGFsbCBwZXJtaXNzaW9ucyBoYW5kbGVyIHRvIGVuc3VyZSB0aGF0IGEgcmV2b2tlZCBwZXJtaXNzaW9uIHRha2VzIGVmZmVjdFxuICAgICAgaW5zdGFsbFBlcm1pc3Npb25zSGFuZGxlcih7IHNlc3Npb24sIHVzZXJDb25maWcgfSk7XG4gICAgfSk7XG5cbiAgICBpcGMub24oJ3NldHRpbmdzOnJlc3BvbnNlJywgKF9ldmVudCwgc2VxLCBlcnJvciwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5yZXNwb25zZVF1ZXVlLmdldChzZXEpO1xuICAgICAgdGhpcy5yZXNwb25zZVF1ZXVlLmRlbGV0ZShzZXEpO1xuICAgICAgaWYgKCFlbnRyeSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgcmVzb2x2ZSwgcmVqZWN0IH0gPSBlbnRyeTtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHdhaXRGb3JSZXNwb25zZTxWYWx1ZT4oKTogeyBwcm9taXNlOiBQcm9taXNlPFZhbHVlPjsgc2VxOiBudW1iZXIgfSB7XG4gICAgY29uc3Qgc2VxID0gdGhpcy5yZXNwb25zZVNlcTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgdGhpcy5yZXNwb25zZVNlcSA9ICh0aGlzLnJlc3BvbnNlU2VxICsgMSkgJiAweDdmZmZmZmZmO1xuXG4gICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlLCByZWplY3QgfSA9IGV4cGxvZGVQcm9taXNlPFZhbHVlPigpO1xuXG4gICAgdGhpcy5yZXNwb25zZVF1ZXVlLnNldChzZXEsIHsgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuXG4gICAgcmV0dXJuIHsgc2VxLCBwcm9taXNlIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0U2V0dGluZ0Zyb21NYWluV2luZG93PE5hbWUgZXh0ZW5kcyBrZXlvZiBJUENFdmVudHNWYWx1ZXNUeXBlPihcbiAgICBuYW1lOiBOYW1lXG4gICk6IFByb21pc2U8SVBDRXZlbnRzVmFsdWVzVHlwZVtOYW1lXT4ge1xuICAgIGNvbnN0IHsgbWFpbldpbmRvdyB9ID0gdGhpcztcbiAgICBpZiAoIW1haW5XaW5kb3cgfHwgIW1haW5XaW5kb3cud2ViQ29udGVudHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbWFpbiB3aW5kb3cnKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcSwgcHJvbWlzZSB9ID0gdGhpcy53YWl0Rm9yUmVzcG9uc2U8SVBDRXZlbnRzVmFsdWVzVHlwZVtOYW1lXT4oKTtcblxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChgc2V0dGluZ3M6Z2V0OiR7bmFtZX1gLCB7IHNlcSB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHVibGljIHNldFNldHRpbmdJbk1haW5XaW5kb3c8TmFtZSBleHRlbmRzIGtleW9mIElQQ0V2ZW50c1ZhbHVlc1R5cGU+KFxuICAgIG5hbWU6IE5hbWUsXG4gICAgdmFsdWU6IElQQ0V2ZW50c1ZhbHVlc1R5cGVbTmFtZV1cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtYWluV2luZG93IH0gPSB0aGlzO1xuICAgIGlmICghbWFpbldpbmRvdyB8fCAhbWFpbldpbmRvdy53ZWJDb250ZW50cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtYWluIHdpbmRvdycpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VxLCBwcm9taXNlIH0gPSB0aGlzLndhaXRGb3JSZXNwb25zZTx2b2lkPigpO1xuXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKGBzZXR0aW5nczpzZXQ6JHtuYW1lfWAsIHsgc2VxLCB2YWx1ZSB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHVibGljIGludm9rZUNhbGxiYWNrSW5NYWluV2luZG93PE5hbWUgZXh0ZW5kcyBrZXlvZiBJUENFdmVudHNDYWxsYmFja3NUeXBlPihcbiAgICBuYW1lOiBOYW1lLFxuICAgIGFyZ3M6IFJlYWRvbmx5QXJyYXk8dW5rbm93bj5cbiAgKTogUHJvbWlzZTx1bmtub3duPiB7XG4gICAgY29uc3QgeyBtYWluV2luZG93IH0gPSB0aGlzO1xuICAgIGlmICghbWFpbldpbmRvdyB8fCAhbWFpbldpbmRvdy53ZWJDb250ZW50cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWluIHdpbmRvdyBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlcSwgcHJvbWlzZSB9ID0gdGhpcy53YWl0Rm9yUmVzcG9uc2U8dW5rbm93bj4oKTtcblxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChgc2V0dGluZ3M6Y2FsbDoke25hbWV9YCwgeyBzZXEsIGFyZ3MgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zdGFsbENhbGxiYWNrPE5hbWUgZXh0ZW5kcyBrZXlvZiBJUENFdmVudHNDYWxsYmFja3NUeXBlPihcbiAgICBuYW1lOiBOYW1lXG4gICk6IHZvaWQge1xuICAgIGlwYy5oYW5kbGUoYHNldHRpbmdzOmNhbGw6JHtuYW1lfWAsIGFzeW5jIChfZXZlbnQsIGFyZ3MpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmludm9rZUNhbGxiYWNrSW5NYWluV2luZG93KG5hbWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnN0YWxsU2V0dGluZzxOYW1lIGV4dGVuZHMga2V5b2YgSVBDRXZlbnRzVmFsdWVzVHlwZT4oXG4gICAgbmFtZTogTmFtZSxcbiAgICB7XG4gICAgICBnZXR0ZXIgPSB0cnVlLFxuICAgICAgc2V0dGVyID0gdHJ1ZSxcbiAgICAgIGlzRXBoZW1lcmFsID0gZmFsc2UsXG4gICAgfTogeyBnZXR0ZXI/OiBib29sZWFuOyBzZXR0ZXI/OiBib29sZWFuOyBpc0VwaGVtZXJhbD86IGJvb2xlYW4gfSA9IHt9XG4gICk6IHZvaWQge1xuICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgIGlwYy5oYW5kbGUoYHNldHRpbmdzOmdldDoke25hbWV9YCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZXR0aW5nRnJvbU1haW5XaW5kb3cobmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXNldHRlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlwYy5oYW5kbGUoYHNldHRpbmdzOnNldDoke25hbWV9YCwgYXN5bmMgKF9ldmVudCwgdmFsdWUpID0+IHtcbiAgICAgIGlmIChpc0VwaGVtZXJhbCkge1xuICAgICAgICBjb25zdCBlcGhlbWVyYWxOYW1lID0gRVBIRU1FUkFMX05BTUVfTUFQLmdldChuYW1lKTtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgIGVwaGVtZXJhbE5hbWUgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgICBgJHtuYW1lfSBpcyBub3QgYW4gZXBoZW1lcmFsIHNldHRpbmdgXG4gICAgICAgICk7XG4gICAgICAgIGVwaGVtZXJhbENvbmZpZy5zZXQoZXBoZW1lcmFsTmFtZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnNldFNldHRpbmdJbk1haW5XaW5kb3cobmFtZSwgdmFsdWUpO1xuXG4gICAgICB0aGlzLmVtaXQoYGNoYW5nZToke25hbWV9YCwgdmFsdWUpO1xuICAgIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsc0JBQXdDO0FBQ3hDLG9CQUE2QjtBQUU3Qix5QkFBMkI7QUFDM0IsOEJBQWdDO0FBQ2hDLHlCQUEwQztBQUMxQyxvQkFBNkI7QUFDN0IsNEJBQStCO0FBTS9CLE1BQU0scUJBQXFCLG9CQUFJLElBQUk7QUFBQSxFQUNqQyxDQUFDLGNBQWMsYUFBYTtBQUFBLEVBQzVCLENBQUMscUJBQXFCLHFCQUFxQjtBQUFBLEVBQzNDLENBQUMsZ0JBQWdCLGVBQWU7QUFDbEMsQ0FBQztBQU9NLE1BQU0sd0JBQXdCLDJCQUFhO0FBQUEsRUFBM0M7QUFBQTtBQUdZLHlCQUFnQixvQkFBSSxJQUFnQztBQUU3RCx1QkFBYztBQUFBO0FBQUEsRUFFZixjQUFjLFlBQTZDO0FBQ2hFLFNBQUssYUFBYTtBQUFBLEVBQ3BCO0FBQUEsRUFFTyxnQkFBMkM7QUFDaEQsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUFBLEVBRU8sVUFBZ0I7QUFDckIsU0FBSyxlQUFlLGNBQWMsRUFBRSxRQUFRLE1BQU0sQ0FBQztBQUduRCxTQUFLLGdCQUFnQixpQkFBaUI7QUFDdEMsU0FBSyxnQkFBZ0IsaUNBQWlDO0FBQ3RELFNBQUssZ0JBQWdCLG9CQUFvQjtBQUN6QyxTQUFLLGdCQUFnQix1QkFBdUI7QUFDNUMsU0FBSyxnQkFBZ0IsZ0JBQWdCO0FBQ3JDLFNBQUssZ0JBQWdCLGlCQUFpQjtBQUN0QyxTQUFLLGdCQUFnQixtQkFBbUI7QUFDeEMsU0FBSyxnQkFBZ0Isa0NBQWtDO0FBQ3ZELFNBQUssZ0JBQWdCLG1DQUFtQztBQUN4RCxTQUFLLGdCQUFnQiw2QkFBNkI7QUFHbEQsU0FBSyxnQkFBZ0Is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
