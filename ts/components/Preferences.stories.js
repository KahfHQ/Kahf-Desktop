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
var Preferences_stories_exports = {};
__export(Preferences_stories_exports, {
  Blocked1: () => Blocked1,
  BlockedMany: () => BlockedMany,
  CustomUniversalExpireTimer: () => CustomUniversalExpireTimer,
  _Preferences: () => _Preferences,
  default: () => Preferences_stories_default
});
module.exports = __toCommonJS(Preferences_stories_exports);
var import_react = __toESM(require("react"));
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_Preferences = require("./Preferences");
var import_setupI18n = require("../util/setupI18n");
var import_Colors = require("../types/Colors");
var import_phoneNumberSharingMode = require("../util/phoneNumberSharingMode");
var import_phoneNumberDiscoverability = require("../util/phoneNumberDiscoverability");
var import_objectMap = require("../util/objectMap");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const availableMicrophones = [
  {
    name: "DefAuLt (Headphones)",
    index: 0,
    uniqueId: "Default",
    i18nKey: "default_communication_device"
  }
];
const availableSpeakers = [
  {
    name: "Default",
    index: 0,
    uniqueId: "Default",
    i18nKey: "default_communication_device"
  },
  {
    name: "Natalie's Airpods (Bluetooth)",
    index: 1,
    uniqueId: "aa"
  },
  {
    name: "UE Boom (Bluetooth)",
    index: 2,
    uniqueId: "bb"
  }
];
const getDefaultArgs = /* @__PURE__ */ __name(() => ({
  availableCameras: [
    {
      deviceId: "dfbe6effe70b0611ba0fdc2a9ea3f39f6cb110e6687948f7e5f016c111b7329c",
      groupId: "63ee218d2446869e40adfc958ff98263e51f74382b0143328ee4826f20a76f47",
      kind: "videoinput",
      label: "FaceTime HD Camera (Built-in) (9fba:bced)"
    },
    {
      deviceId: "e2db196a31d50ff9b135299dc0beea67f65b1a25a06d8a4ce76976751bb7a08d",
      groupId: "218ba7f00d7b1239cca15b9116769e5e7d30cc01104ebf84d667643661e0ecf9",
      kind: "videoinput",
      label: "Logitech Webcam (4e72:9058)"
    }
  ],
  availableMicrophones,
  availableSpeakers,
  blockedCount: 0,
  customColors: {},
  defaultConversationColor: import_Colors.DEFAULT_CONVERSATION_COLOR,
  deviceName: "Work Windows ME",
  hasAudioNotifications: true,
  hasAutoDownloadUpdate: true,
  hasAutoLaunch: true,
  hasCallNotifications: true,
  hasCallRingtoneNotification: false,
  hasCountMutedConversations: false,
  hasCustomTitleBar: true,
  hasHideMenuBar: false,
  hasIncomingCallNotifications: true,
  hasLinkPreviews: true,
  hasMediaCameraPermissions: true,
  hasMediaPermissions: true,
  hasMinimizeToAndStartInSystemTray: true,
  hasMinimizeToSystemTray: true,
  hasNotificationAttention: false,
  hasNotifications: true,
  hasReadReceipts: true,
  hasRelayCalls: false,
  hasSpellCheck: true,
  hasStoriesEnabled: true,
  hasTypingIndicators: true,
  initialSpellCheckSetting: true,
  isAudioNotificationsSupported: true,
  isAutoDownloadUpdatesSupported: true,
  isAutoLaunchSupported: true,
  isHideMenuBarSupported: true,
  isNotificationAttentionSupported: true,
  isPhoneNumberSharingSupported: false,
  isSyncSupported: true,
  isSystemTraySupported: true,
  lastSyncTime: Date.now(),
  notificationContent: "name",
  selectedCamera: "dfbe6effe70b0611ba0fdc2a9ea3f39f6cb110e6687948f7e5f016c111b7329c",
  selectedMicrophone: availableMicrophones[0],
  selectedSpeaker: availableSpeakers[1],
  shouldShowStoriesSettings: true,
  themeSetting: "system",
  universalExpireTimer: 3600,
  whoCanFindMe: import_phoneNumberDiscoverability.PhoneNumberDiscoverability.Discoverable,
  whoCanSeeMe: import_phoneNumberSharingMode.PhoneNumberSharingMode.Everybody,
  zoomFactor: 1
}), "getDefaultArgs");
const defaultArgTypes = {};
(0, import_objectMap.objectMap)(getDefaultArgs(), (key, defaultValue) => {
  defaultArgTypes[key] = { defaultValue };
});
var Preferences_stories_default = {
  title: "Components/Preferences",
  component: import_Preferences.Preferences,
  argTypes: {
    i18n: {
      defaultValue: i18n
    },
    addCustomColor: { action: true },
    closeSettings: { action: true },
    doDeleteAllData: { action: true },
    doneRendering: { action: true },
    editCustomColor: { action: true },
    executeMenuRole: { action: true },
    getConversationsWithCustomColor: { action: true },
    makeSyncRequest: { action: true },
    onAudioNotificationsChange: { action: true },
    onAutoDownloadUpdateChange: { action: true },
    onAutoLaunchChange: { action: true },
    onCallNotificationsChange: { action: true },
    onCallRingtoneNotificationChange: { action: true },
    onCountMutedConversationsChange: { action: true },
    onHasStoriesEnabledChanged: { action: true },
    onHideMenuBarChange: { action: true },
    onIncomingCallNotificationsChange: { action: true },
    onLastSyncTimeChange: { action: true },
    onMediaCameraPermissionsChange: { action: true },
    onMediaPermissionsChange: { action: true },
    onMinimizeToAndStartInSystemTrayChange: { action: true },
    onMinimizeToSystemTrayChange: { action: true },
    onNotificationAttentionChange: { action: true },
    onNotificationContentChange: { action: true },
    onNotificationsChange: { action: true },
    onRelayCallsChange: { action: true },
    onSelectedCameraChange: { action: true },
    onSelectedMicrophoneChange: { action: true },
    onSelectedSpeakerChange: { action: true },
    onSpellCheckChange: { action: true },
    onThemeChange: { action: true },
    onUniversalExpireTimerChange: { action: true },
    onZoomFactorChange: { action: true },
    removeCustomColor: { action: true },
    removeCustomColorOnConversations: { action: true },
    resetAllChatColors: { action: true },
    resetDefaultChatColor: { action: true },
    setGlobalDefaultConversationColor: { action: true }
  }
};
const Template = /* @__PURE__ */ __name((args) => /* @__PURE__ */ import_react.default.createElement(import_Preferences.Preferences, {
  ...args
}), "Template");
const _Preferences = Template.bind({});
_Preferences.args = getDefaultArgs();
const Blocked1 = Template.bind({});
Blocked1.args = {
  blockedCount: 1
};
const BlockedMany = Template.bind({});
BlockedMany.args = {
  blockedCount: 55
};
const CustomUniversalExpireTimer = Template.bind({});
CustomUniversalExpireTimer.args = {
  universalExpireTimer: 9e3
};
CustomUniversalExpireTimer.story = {
  name: "Custom universalExpireTimer"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Blocked1,
  BlockedMany,
  CustomUniversalExpireTimer,
  _Preferences
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUHJlZmVyZW5jZXMuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeSB9IGZyb20gJ0BzdG9yeWJvb2svcmVhY3QnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IGVuTWVzc2FnZXMgZnJvbSAnLi4vLi4vX2xvY2FsZXMvZW4vbWVzc2FnZXMuanNvbic7XG5pbXBvcnQgdHlwZSB7IFByb3BzRGF0YVR5cGUsIFByb3BzVHlwZSB9IGZyb20gJy4vUHJlZmVyZW5jZXMnO1xuaW1wb3J0IHsgUHJlZmVyZW5jZXMgfSBmcm9tICcuL1ByZWZlcmVuY2VzJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCB7IERFRkFVTFRfQ09OVkVSU0FUSU9OX0NPTE9SIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IFBob25lTnVtYmVyU2hhcmluZ01vZGUgfSBmcm9tICcuLi91dGlsL3Bob25lTnVtYmVyU2hhcmluZ01vZGUnO1xuaW1wb3J0IHsgUGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHkgfSBmcm9tICcuLi91dGlsL3Bob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5JztcbmltcG9ydCB7IG9iamVjdE1hcCB9IGZyb20gJy4uL3V0aWwvb2JqZWN0TWFwJztcblxuY29uc3QgaTE4biA9IHNldHVwSTE4bignZW4nLCBlbk1lc3NhZ2VzKTtcblxuY29uc3QgYXZhaWxhYmxlTWljcm9waG9uZXMgPSBbXG4gIHtcbiAgICBuYW1lOiAnRGVmQXVMdCAoSGVhZHBob25lcyknLFxuICAgIGluZGV4OiAwLFxuICAgIHVuaXF1ZUlkOiAnRGVmYXVsdCcsXG4gICAgaTE4bktleTogJ2RlZmF1bHRfY29tbXVuaWNhdGlvbl9kZXZpY2UnLFxuICB9LFxuXTtcblxuY29uc3QgYXZhaWxhYmxlU3BlYWtlcnMgPSBbXG4gIHtcbiAgICBuYW1lOiAnRGVmYXVsdCcsXG4gICAgaW5kZXg6IDAsXG4gICAgdW5pcXVlSWQ6ICdEZWZhdWx0JyxcbiAgICBpMThuS2V5OiAnZGVmYXVsdF9jb21tdW5pY2F0aW9uX2RldmljZScsXG4gIH0sXG4gIHtcbiAgICBuYW1lOiBcIk5hdGFsaWUncyBBaXJwb2RzIChCbHVldG9vdGgpXCIsXG4gICAgaW5kZXg6IDEsXG4gICAgdW5pcXVlSWQ6ICdhYScsXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnVUUgQm9vbSAoQmx1ZXRvb3RoKScsXG4gICAgaW5kZXg6IDIsXG4gICAgdW5pcXVlSWQ6ICdiYicsXG4gIH0sXG5dO1xuXG5jb25zdCBnZXREZWZhdWx0QXJncyA9ICgpOiBQcm9wc0RhdGFUeXBlID0+ICh7XG4gIGF2YWlsYWJsZUNhbWVyYXM6IFtcbiAgICB7XG4gICAgICBkZXZpY2VJZDpcbiAgICAgICAgJ2RmYmU2ZWZmZTcwYjA2MTFiYTBmZGMyYTllYTNmMzlmNmNiMTEwZTY2ODc5NDhmN2U1ZjAxNmMxMTFiNzMyOWMnLFxuICAgICAgZ3JvdXBJZDpcbiAgICAgICAgJzYzZWUyMThkMjQ0Njg2OWU0MGFkZmM5NThmZjk4MjYzZTUxZjc0MzgyYjAxNDMzMjhlZTQ4MjZmMjBhNzZmNDcnLFxuICAgICAga2luZDogJ3ZpZGVvaW5wdXQnIGFzIE1lZGlhRGV2aWNlS2luZCxcbiAgICAgIGxhYmVsOiAnRmFjZVRpbWUgSEQgQ2FtZXJhIChCdWlsdC1pbikgKDlmYmE6YmNlZCknLFxuICAgIH0sXG4gICAge1xuICAgICAgZGV2aWNlSWQ6XG4gICAgICAgICdlMmRiMTk2YTMxZDUwZmY5YjEzNTI5OWRjMGJlZWE2N2Y2NWIxYTI1YTA2ZDhhNGNlNzY5NzY3NTFiYjdhMDhkJyxcbiAgICAgIGdyb3VwSWQ6XG4gICAgICAgICcyMThiYTdmMDBkN2IxMjM5Y2NhMTViOTExNjc2OWU1ZTdkMzBjYzAxMTA0ZWJmODRkNjY3NjQzNjYxZTBlY2Y5JyxcbiAgICAgIGtpbmQ6ICd2aWRlb2lucHV0JyBhcyBNZWRpYURldmljZUtpbmQsXG4gICAgICBsYWJlbDogJ0xvZ2l0ZWNoIFdlYmNhbSAoNGU3Mjo5MDU4KScsXG4gICAgfSxcbiAgXSxcbiAgYXZhaWxhYmxlTWljcm9waG9uZXMsXG4gIGF2YWlsYWJsZVNwZWFrZXJzLFxuICBibG9ja2VkQ291bnQ6IDAsXG4gIGN1c3RvbUNvbG9yczoge30sXG4gIGRlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogREVGQVVMVF9DT05WRVJTQVRJT05fQ09MT1IsXG4gIGRldmljZU5hbWU6ICdXb3JrIFdpbmRvd3MgTUUnLFxuICBoYXNBdWRpb05vdGlmaWNhdGlvbnM6IHRydWUsXG4gIGhhc0F1dG9Eb3dubG9hZFVwZGF0ZTogdHJ1ZSxcbiAgaGFzQXV0b0xhdW5jaDogdHJ1ZSxcbiAgaGFzQ2FsbE5vdGlmaWNhdGlvbnM6IHRydWUsXG4gIGhhc0NhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbjogZmFsc2UsXG4gIGhhc0NvdW50TXV0ZWRDb252ZXJzYXRpb25zOiBmYWxzZSxcbiAgaGFzQ3VzdG9tVGl0bGVCYXI6IHRydWUsXG4gIGhhc0hpZGVNZW51QmFyOiBmYWxzZSxcbiAgaGFzSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uczogdHJ1ZSxcbiAgaGFzTGlua1ByZXZpZXdzOiB0cnVlLFxuICBoYXNNZWRpYUNhbWVyYVBlcm1pc3Npb25zOiB0cnVlLFxuICBoYXNNZWRpYVBlcm1pc3Npb25zOiB0cnVlLFxuICBoYXNNaW5pbWl6ZVRvQW5kU3RhcnRJblN5c3RlbVRyYXk6IHRydWUsXG4gIGhhc01pbmltaXplVG9TeXN0ZW1UcmF5OiB0cnVlLFxuICBoYXNOb3RpZmljYXRpb25BdHRlbnRpb246IGZhbHNlLFxuICBoYXNOb3RpZmljYXRpb25zOiB0cnVlLFxuICBoYXNSZWFkUmVjZWlwdHM6IHRydWUsXG4gIGhhc1JlbGF5Q2FsbHM6IGZhbHNlLFxuICBoYXNTcGVsbENoZWNrOiB0cnVlLFxuICBoYXNTdG9yaWVzRW5hYmxlZDogdHJ1ZSxcbiAgaGFzVHlwaW5nSW5kaWNhdG9yczogdHJ1ZSxcbiAgaW5pdGlhbFNwZWxsQ2hlY2tTZXR0aW5nOiB0cnVlLFxuICBpc0F1ZGlvTm90aWZpY2F0aW9uc1N1cHBvcnRlZDogdHJ1ZSxcbiAgaXNBdXRvRG93bmxvYWRVcGRhdGVzU3VwcG9ydGVkOiB0cnVlLFxuICBpc0F1dG9MYXVuY2hTdXBwb3J0ZWQ6IHRydWUsXG4gIGlzSGlkZU1lbnVCYXJTdXBwb3J0ZWQ6IHRydWUsXG4gIGlzTm90aWZpY2F0aW9uQXR0ZW50aW9uU3VwcG9ydGVkOiB0cnVlLFxuICBpc1Bob25lTnVtYmVyU2hhcmluZ1N1cHBvcnRlZDogZmFsc2UsXG4gIGlzU3luY1N1cHBvcnRlZDogdHJ1ZSxcbiAgaXNTeXN0ZW1UcmF5U3VwcG9ydGVkOiB0cnVlLFxuICBsYXN0U3luY1RpbWU6IERhdGUubm93KCksXG4gIG5vdGlmaWNhdGlvbkNvbnRlbnQ6ICduYW1lJyxcbiAgc2VsZWN0ZWRDYW1lcmE6XG4gICAgJ2RmYmU2ZWZmZTcwYjA2MTFiYTBmZGMyYTllYTNmMzlmNmNiMTEwZTY2ODc5NDhmN2U1ZjAxNmMxMTFiNzMyOWMnLFxuICBzZWxlY3RlZE1pY3JvcGhvbmU6IGF2YWlsYWJsZU1pY3JvcGhvbmVzWzBdLFxuICBzZWxlY3RlZFNwZWFrZXI6IGF2YWlsYWJsZVNwZWFrZXJzWzFdLFxuICBzaG91bGRTaG93U3Rvcmllc1NldHRpbmdzOiB0cnVlLFxuICB0aGVtZVNldHRpbmc6ICdzeXN0ZW0nLFxuICB1bml2ZXJzYWxFeHBpcmVUaW1lcjogMzYwMCxcbiAgd2hvQ2FuRmluZE1lOiBQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eS5EaXNjb3ZlcmFibGUsXG4gIHdob0NhblNlZU1lOiBQaG9uZU51bWJlclNoYXJpbmdNb2RlLkV2ZXJ5Ym9keSxcbiAgem9vbUZhY3RvcjogMSxcbn0pO1xuXG5jb25zdCBkZWZhdWx0QXJnVHlwZXM6IFJlY29yZDxzdHJpbmcsIHsgZGVmYXVsdFZhbHVlOiB1bmtub3duIH0+ID0ge307XG5vYmplY3RNYXAoZ2V0RGVmYXVsdEFyZ3MoKSwgKGtleSwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gIGRlZmF1bHRBcmdUeXBlc1trZXldID0geyBkZWZhdWx0VmFsdWUgfTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRpdGxlOiAnQ29tcG9uZW50cy9QcmVmZXJlbmNlcycsXG4gIGNvbXBvbmVudDogUHJlZmVyZW5jZXMsXG4gIGFyZ1R5cGVzOiB7XG4gICAgLy8gLi4uZGVmYXVsdEFyZ1R5cGVzLFxuXG4gICAgaTE4bjoge1xuICAgICAgZGVmYXVsdFZhbHVlOiBpMThuLFxuICAgIH0sXG5cbiAgICBhZGRDdXN0b21Db2xvcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICBjbG9zZVNldHRpbmdzOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIGRvRGVsZXRlQWxsRGF0YTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBkb25lUmVuZGVyaW5nOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIGVkaXRDdXN0b21Db2xvcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICBleGVjdXRlTWVudVJvbGU6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgZ2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICBtYWtlU3luY1JlcXVlc3Q6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25BdWRpb05vdGlmaWNhdGlvbnNDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25BdXRvRG93bmxvYWRVcGRhdGVDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25BdXRvTGF1bmNoQ2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uQ2FsbE5vdGlmaWNhdGlvbnNDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25DYWxsUmluZ3RvbmVOb3RpZmljYXRpb25DaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25Db3VudE11dGVkQ29udmVyc2F0aW9uc0NoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkhhc1N0b3JpZXNFbmFibGVkQ2hhbmdlZDogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkhpZGVNZW51QmFyQ2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uc0NoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbkxhc3RTeW5jVGltZUNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvbk1lZGlhQ2FtZXJhUGVybWlzc2lvbnNDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25NZWRpYVBlcm1pc3Npb25zQ2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uTWluaW1pemVUb0FuZFN0YXJ0SW5TeXN0ZW1UcmF5Q2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uTWluaW1pemVUb1N5c3RlbVRyYXlDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25Ob3RpZmljYXRpb25BdHRlbnRpb25DaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25Ob3RpZmljYXRpb25Db250ZW50Q2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uTm90aWZpY2F0aW9uc0NoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblJlbGF5Q2FsbHNDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25TZWxlY3RlZENhbWVyYUNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblNlbGVjdGVkTWljcm9waG9uZUNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblNlbGVjdGVkU3BlYWtlckNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblNwZWxsQ2hlY2tDaGFuZ2U6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgb25UaGVtZUNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICBvblVuaXZlcnNhbEV4cGlyZVRpbWVyQ2hhbmdlOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIG9uWm9vbUZhY3RvckNoYW5nZTogeyBhY3Rpb246IHRydWUgfSxcbiAgICByZW1vdmVDdXN0b21Db2xvcjogeyBhY3Rpb246IHRydWUgfSxcbiAgICByZW1vdmVDdXN0b21Db2xvck9uQ29udmVyc2F0aW9uczogeyBhY3Rpb246IHRydWUgfSxcbiAgICByZXNldEFsbENoYXRDb2xvcnM6IHsgYWN0aW9uOiB0cnVlIH0sXG4gICAgcmVzZXREZWZhdWx0Q2hhdENvbG9yOiB7IGFjdGlvbjogdHJ1ZSB9LFxuICAgIHNldEdsb2JhbERlZmF1bHRDb252ZXJzYXRpb25Db2xvcjogeyBhY3Rpb246IHRydWUgfSxcbiAgfSxcbn0gYXMgTWV0YTtcblxuY29uc3QgVGVtcGxhdGU6IFN0b3J5PFByb3BzVHlwZT4gPSBhcmdzID0+IDxQcmVmZXJlbmNlcyB7Li4uYXJnc30gLz47XG5cbmV4cG9ydCBjb25zdCBfUHJlZmVyZW5jZXMgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbl9QcmVmZXJlbmNlcy5hcmdzID0gZ2V0RGVmYXVsdEFyZ3MoKTtcblxuZXhwb3J0IGNvbnN0IEJsb2NrZWQxID0gVGVtcGxhdGUuYmluZCh7fSk7XG5CbG9ja2VkMS5hcmdzID0ge1xuICBibG9ja2VkQ291bnQ6IDEsXG59O1xuXG5leHBvcnQgY29uc3QgQmxvY2tlZE1hbnkgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkJsb2NrZWRNYW55LmFyZ3MgPSB7XG4gIGJsb2NrZWRDb3VudDogNTUsXG59O1xuXG5leHBvcnQgY29uc3QgQ3VzdG9tVW5pdmVyc2FsRXhwaXJlVGltZXIgPSBUZW1wbGF0ZS5iaW5kKHt9KTtcbkN1c3RvbVVuaXZlcnNhbEV4cGlyZVRpbWVyLmFyZ3MgPSB7XG4gIHVuaXZlcnNhbEV4cGlyZVRpbWVyOiA5MDAwLFxufTtcbkN1c3RvbVVuaXZlcnNhbEV4cGlyZVRpbWVyLnN0b3J5ID0ge1xu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
