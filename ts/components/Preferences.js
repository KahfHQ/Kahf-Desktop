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
var Preferences_exports = {};
__export(Preferences_exports, {
  Preferences: () => Preferences
});
module.exports = __toCommonJS(Preferences_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_classnames = __toESM(require("classnames"));
var import_Button = require("./Button");
var import_ChatColorPicker = require("./ChatColorPicker");
var import_Checkbox = require("./Checkbox");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_DisappearingTimeDialog = require("./DisappearingTimeDialog");
var import_phoneNumberDiscoverability = require("../util/phoneNumberDiscoverability");
var import_phoneNumberSharingMode = require("../util/phoneNumberSharingMode");
var import_Select = require("./Select");
var import_Spinner = require("./Spinner");
var import_TitleBarContainer = require("./TitleBarContainer");
var import_getCustomColorStyle = require("../util/getCustomColorStyle");
var import_expirationTimer = require("../util/expirationTimer");
var import_useEscapeHandling = require("../hooks/useEscapeHandling");
var import_useUniqueId = require("../hooks/useUniqueId");
var import_useTheme = require("../hooks/useTheme");
var Page = /* @__PURE__ */ ((Page2) => {
  Page2["General"] = "General";
  Page2["Appearance"] = "Appearance";
  Page2["Chats"] = "Chats";
  Page2["Calls"] = "Calls";
  Page2["Notifications"] = "Notifications";
  Page2["Privacy"] = "Privacy";
  Page2["ChatColor"] = "ChatColor";
  return Page2;
})(Page || {});
const DEFAULT_ZOOM_FACTORS = [
  {
    text: "75%",
    value: 0.75
  },
  {
    text: "100%",
    value: 1
  },
  {
    text: "125%",
    value: 1.25
  },
  {
    text: "150%",
    value: 1.5
  },
  {
    text: "200%",
    value: 2
  }
];
const Preferences = /* @__PURE__ */ __name(({
  addCustomColor,
  availableCameras,
  availableMicrophones,
  availableSpeakers,
  blockedCount,
  closeSettings,
  customColors,
  defaultConversationColor,
  deviceName = "",
  doDeleteAllData,
  doneRendering,
  editCustomColor,
  executeMenuRole,
  getConversationsWithCustomColor,
  hasAudioNotifications,
  hasAutoDownloadUpdate,
  hasAutoLaunch,
  hasCallNotifications,
  hasCallRingtoneNotification,
  hasCountMutedConversations,
  hasHideMenuBar,
  hasIncomingCallNotifications,
  hasLinkPreviews,
  hasMediaCameraPermissions,
  hasMediaPermissions,
  hasMinimizeToAndStartInSystemTray,
  hasMinimizeToSystemTray,
  hasNotificationAttention,
  hasNotifications,
  hasReadReceipts,
  hasRelayCalls,
  hasSpellCheck,
  hasStoriesEnabled,
  hasTypingIndicators,
  i18n,
  initialSpellCheckSetting,
  isAudioNotificationsSupported,
  isAutoDownloadUpdatesSupported,
  isAutoLaunchSupported,
  isHideMenuBarSupported,
  isPhoneNumberSharingSupported,
  isNotificationAttentionSupported,
  isSyncSupported,
  isSystemTraySupported,
  hasCustomTitleBar,
  lastSyncTime,
  makeSyncRequest,
  notificationContent,
  onAudioNotificationsChange,
  onAutoDownloadUpdateChange,
  onAutoLaunchChange,
  onCallNotificationsChange,
  onCallRingtoneNotificationChange,
  onCountMutedConversationsChange,
  onHasStoriesEnabledChanged,
  onHideMenuBarChange,
  onIncomingCallNotificationsChange,
  onLastSyncTimeChange,
  onMediaCameraPermissionsChange,
  onMediaPermissionsChange,
  onMinimizeToAndStartInSystemTrayChange,
  onMinimizeToSystemTrayChange,
  onNotificationAttentionChange,
  onNotificationContentChange,
  onNotificationsChange,
  onRelayCallsChange,
  onSelectedCameraChange,
  onSelectedMicrophoneChange,
  onSelectedSpeakerChange,
  onSpellCheckChange,
  onThemeChange,
  onUniversalExpireTimerChange,
  onZoomFactorChange,
  removeCustomColor,
  removeCustomColorOnConversations,
  resetAllChatColors,
  resetDefaultChatColor,
  selectedCamera,
  selectedMicrophone,
  selectedSpeaker,
  setGlobalDefaultConversationColor,
  shouldShowStoriesSettings,
  themeSetting,
  universalExpireTimer = 0,
  whoCanFindMe,
  whoCanSeeMe,
  zoomFactor
}) => {
  const storiesId = (0, import_useUniqueId.useUniqueId)();
  const themeSelectId = (0, import_useUniqueId.useUniqueId)();
  const zoomSelectId = (0, import_useUniqueId.useUniqueId)();
  const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
  const [page, setPage] = (0, import_react.useState)("General" /* General */);
  const [showSyncFailed, setShowSyncFailed] = (0, import_react.useState)(false);
  const [nowSyncing, setNowSyncing] = (0, import_react.useState)(false);
  const [showDisappearingTimerDialog, setShowDisappearingTimerDialog] = (0, import_react.useState)(false);
  const theme = (0, import_useTheme.useTheme)();
  (0, import_react.useEffect)(() => {
    doneRendering();
  }, [doneRendering]);
  (0, import_useEscapeHandling.useEscapeHandling)(closeSettings);
  const onZoomSelectChange = (0, import_react.useCallback)((value) => {
    const number = parseFloat(value);
    onZoomFactorChange(number);
  }, [onZoomFactorChange]);
  const onAudioInputSelectChange = (0, import_react.useCallback)((value) => {
    if (value === "undefined") {
      onSelectedMicrophoneChange(void 0);
    } else {
      onSelectedMicrophoneChange(availableMicrophones[parseInt(value, 10)]);
    }
  }, [onSelectedMicrophoneChange, availableMicrophones]);
  const onAudioOutputSelectChange = (0, import_react.useCallback)((value) => {
    if (value === "undefined") {
      onSelectedSpeakerChange(void 0);
    } else {
      onSelectedSpeakerChange(availableSpeakers[parseInt(value, 10)]);
    }
  }, [onSelectedSpeakerChange, availableSpeakers]);
  let settings;
  if (page === "General" /* General */) {
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--general"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("Preferences--device-name"),
      right: deviceName
    })), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences--system")
    }, isAutoLaunchSupported && /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasAutoLaunch,
      label: i18n("autoLaunchDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "autoLaunch",
      onChange: onAutoLaunchChange
    }), isHideMenuBarSupported && /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasHideMenuBar,
      label: i18n("hideMenuBar"),
      moduleClassName: "Preferences__checkbox",
      name: "hideMenuBar",
      onChange: onHideMenuBarChange
    }), isSystemTraySupported && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasMinimizeToSystemTray,
      label: i18n("SystemTraySetting__minimize-to-system-tray"),
      moduleClassName: "Preferences__checkbox",
      name: "system-tray-setting-minimize-to-system-tray",
      onChange: onMinimizeToSystemTrayChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasMinimizeToAndStartInSystemTray,
      disabled: !hasMinimizeToSystemTray,
      label: i18n("SystemTraySetting__minimize-to-and-start-in-system-tray"),
      moduleClassName: "Preferences__checkbox",
      name: "system-tray-setting-minimize-to-and-start-in-system-tray",
      onChange: onMinimizeToAndStartInSystemTrayChange
    }))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("permissions")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasMediaPermissions,
      label: i18n("mediaPermissionsDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "mediaPermissions",
      onChange: onMediaPermissionsChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasMediaCameraPermissions,
      label: i18n("mediaCameraPermissionsDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "mediaCameraPermissions",
      onChange: onMediaCameraPermissionsChange
    })), isAutoDownloadUpdatesSupported && /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences--updates")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasAutoDownloadUpdate,
      label: i18n("Preferences__download-update"),
      moduleClassName: "Preferences__checkbox",
      name: "autoDownloadUpdate",
      onChange: onAutoDownloadUpdateChange
    })));
  } else if (page === "Appearance" /* Appearance */) {
    let zoomFactors = DEFAULT_ZOOM_FACTORS;
    if (!zoomFactors.some(({ value }) => value === zoomFactor)) {
      zoomFactors = [
        ...zoomFactors,
        {
          text: `${Math.round(zoomFactor * 100)}%`,
          value: zoomFactor
        }
      ].sort((a, b) => a.value - b.value);
    }
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--appearance"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement("label", {
        htmlFor: themeSelectId
      }, i18n("Preferences--theme")),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        id: themeSelectId,
        onChange: onThemeChange,
        options: [
          {
            text: i18n("themeSystem"),
            value: "system"
          },
          {
            text: i18n("themeLight"),
            value: "light"
          },
          {
            text: i18n("themeDark"),
            value: "dark"
          }
        ],
        value: themeSetting
      })
    }), /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("showChatColorEditor"),
      onClick: () => {
        setPage("ChatColor" /* ChatColor */);
      },
      right: /* @__PURE__ */ import_react.default.createElement("div", {
        className: `ConversationDetails__chat-color ConversationDetails__chat-color--${defaultConversationColor.color}`,
        style: {
          ...(0, import_getCustomColorStyle.getCustomColorStyle)(defaultConversationColor.customColorData?.value)
        }
      })
    }), /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement("label", {
        htmlFor: zoomSelectId
      }, i18n("Preferences--zoom")),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        id: zoomSelectId,
        onChange: onZoomSelectChange,
        options: zoomFactors,
        value: zoomFactor
      })
    })));
  } else if (page === "Chats" /* Chats */) {
    let spellCheckDirtyText;
    if (initialSpellCheckSetting !== hasSpellCheck) {
      spellCheckDirtyText = hasSpellCheck ? i18n("spellCheckWillBeEnabled") : i18n("spellCheckWillBeDisabled");
    }
    const lastSyncDate = new Date(lastSyncTime || 0);
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--chats"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences__button--chats")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasSpellCheck,
      description: spellCheckDirtyText,
      label: i18n("spellCheckDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "spellcheck",
      onChange: onSpellCheckChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasLinkPreviews,
      description: i18n("Preferences__link-previews--description"),
      disabled: true,
      label: i18n("Preferences__link-previews--title"),
      moduleClassName: "Preferences__checkbox",
      name: "linkPreviews",
      onChange: import_lodash.noop
    })), isSyncSupported && /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", null, i18n("sync")), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__description"
      }, i18n("syncExplanation"), " ", i18n("Preferences--lastSynced", {
        date: lastSyncDate.toLocaleDateString(),
        time: lastSyncDate.toLocaleTimeString()
      })), showSyncFailed && /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__description Preferences__description--error"
      }, i18n("syncFailed"))),
      right: /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__right-button"
      }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
        disabled: nowSyncing,
        onClick: async () => {
          setShowSyncFailed(false);
          setNowSyncing(true);
          try {
            await makeSyncRequest();
            onLastSyncTimeChange(Date.now());
          } catch (err) {
            setShowSyncFailed(true);
          } finally {
            setNowSyncing(false);
          }
        },
        variant: import_Button.ButtonVariant.SecondaryAffirmative
      }, nowSyncing ? /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
        svgSize: "small"
      }) : i18n("syncNow")))
    })));
  } else if (page === "Calls" /* Calls */) {
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--calls"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("calling")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasIncomingCallNotifications,
      label: i18n("incomingCallNotificationDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "incomingCallNotification",
      onChange: onIncomingCallNotificationsChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasCallRingtoneNotification,
      label: i18n("callRingtoneNotificationDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "callRingtoneNotification",
      onChange: onCallRingtoneNotificationChange
    })), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences__devices")
    }, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
        className: "Preferences__select-title",
        htmlFor: "video"
      }, i18n("callingDeviceSelection__label--video")), /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("callingDeviceSelection__label--video"),
        disabled: !availableCameras.length,
        moduleClassName: "Preferences__select",
        name: "video",
        onChange: onSelectedCameraChange,
        options: availableCameras.length ? availableCameras.map((device) => ({
          text: localizeDefault(i18n, device.label),
          value: device.deviceId
        })) : [
          {
            text: i18n("callingDeviceSelection__select--no-device"),
            value: "undefined"
          }
        ],
        value: selectedCamera
      })),
      right: /* @__PURE__ */ import_react.default.createElement("div", null)
    }), /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
        className: "Preferences__select-title",
        htmlFor: "audio-input"
      }, i18n("callingDeviceSelection__label--audio-input")), /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("callingDeviceSelection__label--audio-input"),
        disabled: !availableMicrophones.length,
        moduleClassName: "Preferences__select",
        name: "audio-input",
        onChange: onAudioInputSelectChange,
        options: availableMicrophones.length ? availableMicrophones.map((device) => ({
          text: localizeDefault(i18n, device.name),
          value: device.index
        })) : [
          {
            text: i18n("callingDeviceSelection__select--no-device"),
            value: "undefined"
          }
        ],
        value: selectedMicrophone?.index
      })),
      right: /* @__PURE__ */ import_react.default.createElement("div", null)
    }), /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
        className: "Preferences__select-title",
        htmlFor: "audio-output"
      }, i18n("callingDeviceSelection__label--audio-output")), /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("callingDeviceSelection__label--audio-output"),
        disabled: !availableSpeakers.length,
        moduleClassName: "Preferences__select",
        name: "audio-output",
        onChange: onAudioOutputSelectChange,
        options: availableSpeakers.length ? availableSpeakers.map((device) => ({
          text: localizeDefault(i18n, device.name),
          value: device.index
        })) : [
          {
            text: i18n("callingDeviceSelection__select--no-device"),
            value: "undefined"
          }
        ],
        value: selectedSpeaker?.index
      })),
      right: /* @__PURE__ */ import_react.default.createElement("div", null)
    })), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences--advanced")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasRelayCalls,
      description: i18n("alwaysRelayCallsDetail"),
      label: i18n("alwaysRelayCallsDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "relayCalls",
      onChange: onRelayCallsChange
    })));
  } else if (page === "Notifications" /* Notifications */) {
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--notifications"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasNotifications,
      label: i18n("Preferences__enable-notifications"),
      moduleClassName: "Preferences__checkbox",
      name: "notifications",
      onChange: onNotificationsChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasCallNotifications,
      label: i18n("callSystemNotificationDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "callSystemNotification",
      onChange: onCallNotificationsChange
    }), isNotificationAttentionSupported && /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasNotificationAttention,
      label: i18n("notificationDrawAttention"),
      moduleClassName: "Preferences__checkbox",
      name: "notificationDrawAttention",
      onChange: onNotificationAttentionChange
    }), isAudioNotificationsSupported && /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasAudioNotifications,
      label: i18n("audioNotificationDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "audioNotification",
      onChange: onAudioNotificationsChange
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasCountMutedConversations,
      label: i18n("countMutedConversationsDescription"),
      moduleClassName: "Preferences__checkbox",
      name: "countMutedConversations",
      onChange: onCountMutedConversationsChange
    })), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("Preferences--notification-content"),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("Preferences--notification-content"),
        disabled: !hasNotifications,
        onChange: onNotificationContentChange,
        options: [
          {
            text: i18n("nameAndMessage"),
            value: "message"
          },
          {
            text: i18n("nameOnly"),
            value: "name"
          },
          {
            text: i18n("noNameOrMessage"),
            value: "count"
          }
        ],
        value: notificationContent
      })
    })));
  } else if (page === "Privacy" /* Privacy */) {
    const isCustomDisappearingMessageValue = !import_expirationTimer.DEFAULT_DURATIONS_SET.has(universalExpireTimer);
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("Preferences__button--privacy"))), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("Preferences--blocked"),
      right: blockedCount === 1 ? i18n("Preferences--blocked-count-singular", [
        String(blockedCount)
      ]) : i18n("Preferences--blocked-count-plural", [
        String(blockedCount || 0)
      ])
    })), isPhoneNumberSharingSupported ? /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences__who-can--title")
    }, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("Preferences--see-me"),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("Preferences--see-me"),
        disabled: true,
        onChange: import_lodash.noop,
        options: [
          {
            text: i18n("Preferences__who-can--everybody"),
            value: import_phoneNumberSharingMode.PhoneNumberSharingMode.Everybody
          },
          {
            text: i18n("Preferences__who-can--contacts"),
            value: import_phoneNumberSharingMode.PhoneNumberSharingMode.ContactsOnly
          },
          {
            text: i18n("Preferences__who-can--nobody"),
            value: import_phoneNumberSharingMode.PhoneNumberSharingMode.Nobody
          }
        ],
        value: whoCanSeeMe
      })
    }), /* @__PURE__ */ import_react.default.createElement(Control, {
      left: i18n("Preferences--find-me"),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("Preferences--find-me"),
        disabled: true,
        onChange: import_lodash.noop,
        options: [
          {
            text: i18n("Preferences__who-can--everybody"),
            value: import_phoneNumberDiscoverability.PhoneNumberDiscoverability.Discoverable
          },
          {
            text: i18n("Preferences__who-can--nobody"),
            value: import_phoneNumberDiscoverability.PhoneNumberDiscoverability.NotDiscoverable
          }
        ],
        value: whoCanFindMe
      })
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__padding"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__description"
    }, i18n("Preferences__privacy--description")))) : null, /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Preferences--messaging")
    }, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasReadReceipts,
      disabled: true,
      label: i18n("Preferences--read-receipts"),
      moduleClassName: "Preferences__checkbox",
      name: "readReceipts",
      onChange: import_lodash.noop
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: hasTypingIndicators,
      disabled: true,
      label: i18n("Preferences--typing-indicators"),
      moduleClassName: "Preferences__checkbox",
      name: "typingIndicators",
      onChange: import_lodash.noop
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__padding"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__description"
    }, i18n("Preferences__privacy--description")))), showDisappearingTimerDialog && /* @__PURE__ */ import_react.default.createElement(import_DisappearingTimeDialog.DisappearingTimeDialog, {
      i18n,
      initialValue: universalExpireTimer,
      onClose: () => setShowDisappearingTimerDialog(false),
      onSubmit: onUniversalExpireTimerChange
    }), /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("disappearingMessages")
    }, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", null, i18n("settings__DisappearingMessages__timer__label")), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__description"
      }, i18n("settings__DisappearingMessages__footer"))),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        ariaLabel: i18n("settings__DisappearingMessages__timer__label"),
        onChange: (value) => {
          if (value === String(universalExpireTimer) || value === "-1") {
            setShowDisappearingTimerDialog(true);
            return;
          }
          onUniversalExpireTimerChange(parseInt(value, 10));
        },
        options: import_expirationTimer.DEFAULT_DURATIONS_IN_SECONDS.map((seconds) => {
          const text = (0, import_expirationTimer.format)(i18n, seconds, {
            capitalizeOff: true
          });
          return {
            value: seconds,
            text
          };
        }).concat([
          {
            value: isCustomDisappearingMessageValue ? universalExpireTimer : -1,
            text: isCustomDisappearingMessageValue ? (0, import_expirationTimer.format)(i18n, universalExpireTimer) : i18n("selectedCustomDisappearingTimeOption")
          }
        ]),
        value: universalExpireTimer
      })
    })), shouldShowStoriesSettings && /* @__PURE__ */ import_react.default.createElement(SettingsRow, {
      title: i18n("Stories__title")
    }, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement("label", {
        htmlFor: storiesId
      }, /* @__PURE__ */ import_react.default.createElement("div", null, i18n("Stories__settings-toggle--title")), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__description"
      }, i18n("Stories__settings-toggle--description"))),
      right: /* @__PURE__ */ import_react.default.createElement(import_Select.Select, {
        id: storiesId,
        onChange: (value) => {
          onHasStoriesEnabledChanged(value === "true");
        },
        options: [
          {
            text: i18n("on"),
            value: "true"
          },
          {
            text: i18n("off"),
            value: "false"
          }
        ],
        value: String(hasStoriesEnabled)
      })
    })), /* @__PURE__ */ import_react.default.createElement(SettingsRow, null, /* @__PURE__ */ import_react.default.createElement(Control, {
      left: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", null, i18n("clearDataHeader")), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__description"
      }, i18n("clearDataExplanation"))),
      right: /* @__PURE__ */ import_react.default.createElement("div", {
        className: "Preferences__right-button"
      }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
        onClick: () => setConfirmDelete(true),
        variant: import_Button.ButtonVariant.SecondaryDestructive
      }, i18n("clearDataButton")))
    })), confirmDelete ? /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
      actions: [
        {
          action: doDeleteAllData,
          style: "negative",
          text: i18n("clearDataButton")
        }
      ],
      i18n,
      onClose: () => {
        setConfirmDelete(false);
      },
      title: i18n("deleteAllDataHeader")
    }, i18n("deleteAllDataBody")) : null);
  } else if (page === "ChatColor" /* ChatColor */) {
    settings = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title"
    }, /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("goBack"),
      className: "Preferences__back-icon",
      onClick: () => setPage("Appearance" /* Appearance */),
      type: "button"
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "Preferences__title--header"
    }, i18n("ChatColorPicker__menu-title"))), /* @__PURE__ */ import_react.default.createElement(import_ChatColorPicker.ChatColorPicker, {
      customColors,
      getConversationsWithCustomColor,
      i18n,
      isGlobal: true,
      selectedColor: defaultConversationColor.color,
      selectedCustomColor: defaultConversationColor.customColorData || {},
      addCustomColor,
      colorSelected: import_lodash.noop,
      editCustomColor,
      removeCustomColor,
      removeCustomColorOnConversations,
      resetAllChatColors,
      resetDefaultChatColor,
      setGlobalDefaultConversationColor
    }));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_TitleBarContainer.TitleBarContainer, {
    hasCustomTitleBar,
    theme,
    executeMenuRole
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__page-selector"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--general": true,
      "Preferences__button--selected": page === "General" /* General */
    }),
    onClick: () => setPage("General" /* General */)
  }, i18n("Preferences__button--general")), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--appearance": true,
      "Preferences__button--selected": page === "Appearance" /* Appearance */ || page === "ChatColor" /* ChatColor */
    }),
    onClick: () => setPage("Appearance" /* Appearance */)
  }, i18n("Preferences__button--appearance")), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--chats": true,
      "Preferences__button--selected": page === "Chats" /* Chats */
    }),
    onClick: () => setPage("Chats" /* Chats */)
  }, i18n("Preferences__button--chats")), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--calls": true,
      "Preferences__button--selected": page === "Calls" /* Calls */
    }),
    onClick: () => setPage("Calls" /* Calls */)
  }, i18n("Preferences__button--calls")), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--notifications": true,
      "Preferences__button--selected": page === "Notifications" /* Notifications */
    }),
    onClick: () => setPage("Notifications" /* Notifications */)
  }, i18n("Preferences__button--notifications")), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)({
      Preferences__button: true,
      "Preferences__button--privacy": true,
      "Preferences__button--selected": page === "Privacy" /* Privacy */
    }),
    onClick: () => setPage("Privacy" /* Privacy */)
  }, i18n("Preferences__button--privacy"))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__settings-pane"
  }, settings)));
}, "Preferences");
const SettingsRow = /* @__PURE__ */ __name(({
  children,
  title
}) => {
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__settings-row"
  }, title && /* @__PURE__ */ import_react.default.createElement("h3", {
    className: "Preferences__padding"
  }, title), children);
}, "SettingsRow");
const Control = /* @__PURE__ */ __name(({
  left,
  onClick,
  right
}) => {
  const content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__control--key"
  }, left), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__control--value"
  }, right));
  if (onClick) {
    return /* @__PURE__ */ import_react.default.createElement("button", {
      className: "Preferences__control Preferences__control--clickable",
      type: "button",
      onClick
    }, content);
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "Preferences__control"
  }, content);
}, "Control");
function localizeDefault(i18n, deviceLabel) {
  return deviceLabel.toLowerCase().startsWith("default") ? deviceLabel.replace(/default/i, i18n("callingDeviceSelection__select--default")) : deviceLabel;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Preferences
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUHJlZmVyZW5jZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHR5cGUgeyBBdWRpb0RldmljZSB9IGZyb20gJ3JpbmdydGMnO1xuXG5pbXBvcnQgdHlwZSB7IE1lZGlhRGV2aWNlU2V0dGluZ3MgfSBmcm9tICcuLi90eXBlcy9DYWxsaW5nJztcbmltcG9ydCB0eXBlIHtcbiAgWm9vbUZhY3RvclR5cGUsXG4gIE5vdGlmaWNhdGlvblNldHRpbmdUeXBlLFxufSBmcm9tICcuLi90eXBlcy9TdG9yYWdlLmQnO1xuaW1wb3J0IHR5cGUgeyBUaGVtZVNldHRpbmdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvU3RvcmFnZVVJS2V5cyc7XG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuL0J1dHRvbic7XG5pbXBvcnQgeyBDaGF0Q29sb3JQaWNrZXIgfSBmcm9tICcuL0NoYXRDb2xvclBpY2tlcic7XG5pbXBvcnQgeyBDaGVja2JveCB9IGZyb20gJy4vQ2hlY2tib3gnO1xuaW1wb3J0IHsgQ29uZmlybWF0aW9uRGlhbG9nIH0gZnJvbSAnLi9Db25maXJtYXRpb25EaWFsb2cnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvbkNvbG9yVHlwZSxcbiAgQ3VzdG9tQ29sb3JUeXBlLFxuICBEZWZhdWx0Q29udmVyc2F0aW9uQ29sb3JUeXBlLFxufSBmcm9tICcuLi90eXBlcy9Db2xvcnMnO1xuaW1wb3J0IHsgRGlzYXBwZWFyaW5nVGltZURpYWxvZyB9IGZyb20gJy4vRGlzYXBwZWFyaW5nVGltZURpYWxvZyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHsgUGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHkgfSBmcm9tICcuLi91dGlsL3Bob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5JztcbmltcG9ydCB7IFBob25lTnVtYmVyU2hhcmluZ01vZGUgfSBmcm9tICcuLi91dGlsL3Bob25lTnVtYmVyU2hhcmluZ01vZGUnO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSAnLi9TZWxlY3QnO1xuaW1wb3J0IHsgU3Bpbm5lciB9IGZyb20gJy4vU3Bpbm5lcic7XG5pbXBvcnQgeyBUaXRsZUJhckNvbnRhaW5lciB9IGZyb20gJy4vVGl0bGVCYXJDb250YWluZXInO1xuaW1wb3J0IHR5cGUgeyBFeGVjdXRlTWVudVJvbGVUeXBlIH0gZnJvbSAnLi9UaXRsZUJhckNvbnRhaW5lcic7XG5pbXBvcnQgeyBnZXRDdXN0b21Db2xvclN0eWxlIH0gZnJvbSAnLi4vdXRpbC9nZXRDdXN0b21Db2xvclN0eWxlJztcbmltcG9ydCB7XG4gIERFRkFVTFRfRFVSQVRJT05TX0lOX1NFQ09ORFMsXG4gIERFRkFVTFRfRFVSQVRJT05TX1NFVCxcbiAgZm9ybWF0IGFzIGZvcm1hdEV4cGlyYXRpb25UaW1lcixcbn0gZnJvbSAnLi4vdXRpbC9leHBpcmF0aW9uVGltZXInO1xuaW1wb3J0IHsgdXNlRXNjYXBlSGFuZGxpbmcgfSBmcm9tICcuLi9ob29rcy91c2VFc2NhcGVIYW5kbGluZyc7XG5pbXBvcnQgeyB1c2VVbmlxdWVJZCB9IGZyb20gJy4uL2hvb2tzL3VzZVVuaXF1ZUlkJztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnLi4vaG9va3MvdXNlVGhlbWUnO1xuXG50eXBlIENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGUgPSAodmFsdWU6IGJvb2xlYW4pID0+IHVua25vd247XG50eXBlIFNlbGVjdENoYW5nZUhhbmRsZXJUeXBlPFQgPSBzdHJpbmcgfCBudW1iZXI+ID0gKHZhbHVlOiBUKSA9PiB1bmtub3duO1xuXG5leHBvcnQgdHlwZSBQcm9wc0RhdGFUeXBlID0ge1xuICAvLyBTZXR0aW5nc1xuICBibG9ja2VkQ291bnQ6IG51bWJlcjtcbiAgY3VzdG9tQ29sb3JzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Db2xvclR5cGU+O1xuICBkZWZhdWx0Q29udmVyc2F0aW9uQ29sb3I6IERlZmF1bHRDb252ZXJzYXRpb25Db2xvclR5cGU7XG4gIGRldmljZU5hbWU/OiBzdHJpbmc7XG4gIGhhc0F1ZGlvTm90aWZpY2F0aW9ucz86IGJvb2xlYW47XG4gIGhhc0F1dG9Eb3dubG9hZFVwZGF0ZTogYm9vbGVhbjtcbiAgaGFzQXV0b0xhdW5jaDogYm9vbGVhbjtcbiAgaGFzQ2FsbE5vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG4gIGhhc0NhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgaGFzQ291bnRNdXRlZENvbnZlcnNhdGlvbnM6IGJvb2xlYW47XG4gIGhhc0hpZGVNZW51QmFyPzogYm9vbGVhbjtcbiAgaGFzSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uczogYm9vbGVhbjtcbiAgaGFzTGlua1ByZXZpZXdzOiBib29sZWFuO1xuICBoYXNNZWRpYUNhbWVyYVBlcm1pc3Npb25zOiBib29sZWFuO1xuICBoYXNNZWRpYVBlcm1pc3Npb25zOiBib29sZWFuO1xuICBoYXNNaW5pbWl6ZVRvQW5kU3RhcnRJblN5c3RlbVRyYXk6IGJvb2xlYW47XG4gIGhhc01pbmltaXplVG9TeXN0ZW1UcmF5OiBib29sZWFuO1xuICBoYXNOb3RpZmljYXRpb25BdHRlbnRpb246IGJvb2xlYW47XG4gIGhhc05vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG4gIGhhc1JlYWRSZWNlaXB0czogYm9vbGVhbjtcbiAgaGFzUmVsYXlDYWxscz86IGJvb2xlYW47XG4gIGhhc1NwZWxsQ2hlY2s6IGJvb2xlYW47XG4gIGhhc1N0b3JpZXNFbmFibGVkOiBib29sZWFuO1xuICBoYXNUeXBpbmdJbmRpY2F0b3JzOiBib29sZWFuO1xuICBsYXN0U3luY1RpbWU/OiBudW1iZXI7XG4gIG5vdGlmaWNhdGlvbkNvbnRlbnQ6IE5vdGlmaWNhdGlvblNldHRpbmdUeXBlO1xuICBzZWxlY3RlZENhbWVyYT86IHN0cmluZztcbiAgc2VsZWN0ZWRNaWNyb3Bob25lPzogQXVkaW9EZXZpY2U7XG4gIHNlbGVjdGVkU3BlYWtlcj86IEF1ZGlvRGV2aWNlO1xuICB0aGVtZVNldHRpbmc6IFRoZW1lU2V0dGluZ1R5cGU7XG4gIHVuaXZlcnNhbEV4cGlyZVRpbWVyOiBudW1iZXI7XG4gIHdob0NhbkZpbmRNZTogUGhvbmVOdW1iZXJEaXNjb3ZlcmFiaWxpdHk7XG4gIHdob0NhblNlZU1lOiBQaG9uZU51bWJlclNoYXJpbmdNb2RlO1xuICB6b29tRmFjdG9yOiBab29tRmFjdG9yVHlwZTtcblxuICAvLyBPdGhlciBwcm9wc1xuICBoYXNDdXN0b21UaXRsZUJhcjogYm9vbGVhbjtcbiAgaW5pdGlhbFNwZWxsQ2hlY2tTZXR0aW5nOiBib29sZWFuO1xuICBzaG91bGRTaG93U3Rvcmllc1NldHRpbmdzOiBib29sZWFuO1xuXG4gIC8vIExpbWl0ZWQgc3VwcG9ydCBmZWF0dXJlc1xuICBpc0F1ZGlvTm90aWZpY2F0aW9uc1N1cHBvcnRlZDogYm9vbGVhbjtcbiAgaXNBdXRvRG93bmxvYWRVcGRhdGVzU3VwcG9ydGVkOiBib29sZWFuO1xuICBpc0F1dG9MYXVuY2hTdXBwb3J0ZWQ6IGJvb2xlYW47XG4gIGlzSGlkZU1lbnVCYXJTdXBwb3J0ZWQ6IGJvb2xlYW47XG4gIGlzTm90aWZpY2F0aW9uQXR0ZW50aW9uU3VwcG9ydGVkOiBib29sZWFuO1xuICBpc1Bob25lTnVtYmVyU2hhcmluZ1N1cHBvcnRlZDogYm9vbGVhbjtcbiAgaXNTeW5jU3VwcG9ydGVkOiBib29sZWFuO1xuICBpc1N5c3RlbVRyYXlTdXBwb3J0ZWQ6IGJvb2xlYW47XG5cbiAgYXZhaWxhYmxlQ2FtZXJhczogQXJyYXk8XG4gICAgUGljazxNZWRpYURldmljZUluZm8sICdkZXZpY2VJZCcgfCAnZ3JvdXBJZCcgfCAna2luZCcgfCAnbGFiZWwnPlxuICA+O1xufSAmIE9taXQ8TWVkaWFEZXZpY2VTZXR0aW5ncywgJ2F2YWlsYWJsZUNhbWVyYXMnPjtcblxudHlwZSBQcm9wc0Z1bmN0aW9uVHlwZSA9IHtcbiAgLy8gT3RoZXIgcHJvcHNcbiAgYWRkQ3VzdG9tQ29sb3I6IChjb2xvcjogQ3VzdG9tQ29sb3JUeXBlKSA9PiB1bmtub3duO1xuICBjbG9zZVNldHRpbmdzOiAoKSA9PiB1bmtub3duO1xuICBkb0RlbGV0ZUFsbERhdGE6ICgpID0+IHVua25vd247XG4gIGRvbmVSZW5kZXJpbmc6ICgpID0+IHVua25vd247XG4gIGVkaXRDdXN0b21Db2xvcjogKGNvbG9ySWQ6IHN0cmluZywgY29sb3I6IEN1c3RvbUNvbG9yVHlwZSkgPT4gdW5rbm93bjtcbiAgZXhlY3V0ZU1lbnVSb2xlOiBFeGVjdXRlTWVudVJvbGVUeXBlO1xuICBnZXRDb252ZXJzYXRpb25zV2l0aEN1c3RvbUNvbG9yOiAoXG4gICAgY29sb3JJZDogc3RyaW5nXG4gICkgPT4gUHJvbWlzZTxBcnJheTxDb252ZXJzYXRpb25UeXBlPj47XG4gIG1ha2VTeW5jUmVxdWVzdDogKCkgPT4gdW5rbm93bjtcbiAgcmVtb3ZlQ3VzdG9tQ29sb3I6IChjb2xvcklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHJlbW92ZUN1c3RvbUNvbG9yT25Db252ZXJzYXRpb25zOiAoY29sb3JJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICByZXNldEFsbENoYXRDb2xvcnM6ICgpID0+IHVua25vd247XG4gIHJlc2V0RGVmYXVsdENoYXRDb2xvcjogKCkgPT4gdW5rbm93bjtcbiAgc2V0R2xvYmFsRGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yOiAoXG4gICAgY29sb3I6IENvbnZlcnNhdGlvbkNvbG9yVHlwZSxcbiAgICBjdXN0b21Db2xvckRhdGE/OiB7XG4gICAgICBpZDogc3RyaW5nO1xuICAgICAgdmFsdWU6IEN1c3RvbUNvbG9yVHlwZTtcbiAgICB9XG4gICkgPT4gdW5rbm93bjtcblxuICAvLyBDaGFuZ2UgaGFuZGxlcnNcbiAgb25BdWRpb05vdGlmaWNhdGlvbnNDaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uQXV0b0Rvd25sb2FkVXBkYXRlQ2hhbmdlOiBDaGVja2JveENoYW5nZUhhbmRsZXJUeXBlO1xuICBvbkF1dG9MYXVuY2hDaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uQ2FsbE5vdGlmaWNhdGlvbnNDaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uQ2FsbFJpbmd0b25lTm90aWZpY2F0aW9uQ2hhbmdlOiBDaGVja2JveENoYW5nZUhhbmRsZXJUeXBlO1xuICBvbkNvdW50TXV0ZWRDb252ZXJzYXRpb25zQ2hhbmdlOiBDaGVja2JveENoYW5nZUhhbmRsZXJUeXBlO1xuICBvbkhhc1N0b3JpZXNFbmFibGVkQ2hhbmdlZDogU2VsZWN0Q2hhbmdlSGFuZGxlclR5cGU8Ym9vbGVhbj47XG4gIG9uSGlkZU1lbnVCYXJDaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uc0NoYW5nZTogQ2hlY2tib3hDaGFuZ2VIYW5kbGVyVHlwZTtcbiAgb25MYXN0U3luY1RpbWVDaGFuZ2U6ICh0aW1lOiBudW1iZXIpID0+IHVua25vd247XG4gIG9uTWVkaWFDYW1lcmFQZXJtaXNzaW9uc0NoYW5nZTogQ2hlY2tib3hDaGFuZ2VIYW5kbGVyVHlwZTtcbiAgb25NZWRpYVBlcm1pc3Npb25zQ2hhbmdlOiBDaGVja2JveENoYW5nZUhhbmRsZXJUeXBlO1xuICBvbk1pbmltaXplVG9BbmRTdGFydEluU3lzdGVtVHJheUNoYW5nZTogQ2hlY2tib3hDaGFuZ2VIYW5kbGVyVHlwZTtcbiAgb25NaW5pbWl6ZVRvU3lzdGVtVHJheUNoYW5nZTogQ2hlY2tib3hDaGFuZ2VIYW5kbGVyVHlwZTtcbiAgb25Ob3RpZmljYXRpb25BdHRlbnRpb25DaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uTm90aWZpY2F0aW9uQ29udGVudENoYW5nZTogU2VsZWN0Q2hhbmdlSGFuZGxlclR5cGU8Tm90aWZpY2F0aW9uU2V0dGluZ1R5cGU+O1xuICBvbk5vdGlmaWNhdGlvbnNDaGFuZ2U6IENoZWNrYm94Q2hhbmdlSGFuZGxlclR5cGU7XG4gIG9uUmVsYXlDYWxsc0NoYW5nZTogQ2hlY2tib3hDaGFuZ2VIYW5kbGVyVHlwZTtcbiAgb25TZWxlY3RlZENhbWVyYUNoYW5nZTogU2VsZWN0Q2hhbmdlSGFuZGxlclR5cGU8c3RyaW5nIHwgdW5kZWZpbmVkPjtcbiAgb25TZWxlY3RlZE1pY3JvcGhvbmVDaGFuZ2U6IFNlbGVjdENoYW5nZUhhbmRsZXJUeXBlPEF1ZGlvRGV2aWNlIHwgdW5kZWZpbmVkPjtcbiAgb25TZWxlY3RlZFNwZWFrZXJDaGFuZ2U6IFNlbGVjdENoYW5nZUhhbmRsZXJUeXBlPEF1ZGlvRGV2aWNlIHwgdW5kZWZpbmVkPjtcbiAgb25TcGVsbENoZWNrQ2hhbmdlOiBDaGVja2JveENoYW5nZUhhbmRsZXJUeXBlO1xuICBvblRoZW1lQ2hhbmdlOiBTZWxlY3RDaGFuZ2VIYW5kbGVyVHlwZTxUaGVtZVR5cGU+O1xuICBvblVuaXZlcnNhbEV4cGlyZVRpbWVyQ2hhbmdlOiBTZWxlY3RDaGFuZ2VIYW5kbGVyVHlwZTxudW1iZXI+O1xuICBvblpvb21GYWN0b3JDaGFuZ2U6IFNlbGVjdENoYW5nZUhhbmRsZXJUeXBlPFpvb21GYWN0b3JUeXBlPjtcblxuICAvLyBMb2NhbGl6YXRpb25cbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IFByb3BzRGF0YVR5cGUgJiBQcm9wc0Z1bmN0aW9uVHlwZTtcblxuZW51bSBQYWdlIHtcbiAgLy8gQWNjZXNzaWJsZSB0aHJvdWdoIGxlZnQgbmF2XG4gIEdlbmVyYWwgPSAnR2VuZXJhbCcsXG4gIEFwcGVhcmFuY2UgPSAnQXBwZWFyYW5jZScsXG4gIENoYXRzID0gJ0NoYXRzJyxcbiAgQ2FsbHMgPSAnQ2FsbHMnLFxuICBOb3RpZmljYXRpb25zID0gJ05vdGlmaWNhdGlvbnMnLFxuICBQcml2YWN5ID0gJ1ByaXZhY3knLFxuXG4gIC8vIFN1YiBwYWdlc1xuICBDaGF0Q29sb3IgPSAnQ2hhdENvbG9yJyxcbn1cblxuY29uc3QgREVGQVVMVF9aT09NX0ZBQ1RPUlMgPSBbXG4gIHtcbiAgICB0ZXh0OiAnNzUlJyxcbiAgICB2YWx1ZTogMC43NSxcbiAgfSxcbiAge1xuICAgIHRleHQ6ICcxMDAlJyxcbiAgICB2YWx1ZTogMSxcbiAgfSxcbiAge1xuICAgIHRleHQ6ICcxMjUlJyxcbiAgICB2YWx1ZTogMS4yNSxcbiAgfSxcbiAge1xuICAgIHRleHQ6ICcxNTAlJyxcbiAgICB2YWx1ZTogMS41LFxuICB9LFxuICB7XG4gICAgdGV4dDogJzIwMCUnLFxuICAgIHZhbHVlOiAyLFxuICB9LFxuXTtcblxuZXhwb3J0IGNvbnN0IFByZWZlcmVuY2VzID0gKHtcbiAgYWRkQ3VzdG9tQ29sb3IsXG4gIGF2YWlsYWJsZUNhbWVyYXMsXG4gIGF2YWlsYWJsZU1pY3JvcGhvbmVzLFxuICBhdmFpbGFibGVTcGVha2VycyxcbiAgYmxvY2tlZENvdW50LFxuICBjbG9zZVNldHRpbmdzLFxuICBjdXN0b21Db2xvcnMsXG4gIGRlZmF1bHRDb252ZXJzYXRpb25Db2xvcixcbiAgZGV2aWNlTmFtZSA9ICcnLFxuICBkb0RlbGV0ZUFsbERhdGEsXG4gIGRvbmVSZW5kZXJpbmcsXG4gIGVkaXRDdXN0b21Db2xvcixcbiAgZXhlY3V0ZU1lbnVSb2xlLFxuICBnZXRDb252ZXJzYXRpb25zV2l0aEN1c3RvbUNvbG9yLFxuICBoYXNBdWRpb05vdGlmaWNhdGlvbnMsXG4gIGhhc0F1dG9Eb3dubG9hZFVwZGF0ZSxcbiAgaGFzQXV0b0xhdW5jaCxcbiAgaGFzQ2FsbE5vdGlmaWNhdGlvbnMsXG4gIGhhc0NhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbixcbiAgaGFzQ291bnRNdXRlZENvbnZlcnNhdGlvbnMsXG4gIGhhc0hpZGVNZW51QmFyLFxuICBoYXNJbmNvbWluZ0NhbGxOb3RpZmljYXRpb25zLFxuICBoYXNMaW5rUHJldmlld3MsXG4gIGhhc01lZGlhQ2FtZXJhUGVybWlzc2lvbnMsXG4gIGhhc01lZGlhUGVybWlzc2lvbnMsXG4gIGhhc01pbmltaXplVG9BbmRTdGFydEluU3lzdGVtVHJheSxcbiAgaGFzTWluaW1pemVUb1N5c3RlbVRyYXksXG4gIGhhc05vdGlmaWNhdGlvbkF0dGVudGlvbixcbiAgaGFzTm90aWZpY2F0aW9ucyxcbiAgaGFzUmVhZFJlY2VpcHRzLFxuICBoYXNSZWxheUNhbGxzLFxuICBoYXNTcGVsbENoZWNrLFxuICBoYXNTdG9yaWVzRW5hYmxlZCxcbiAgaGFzVHlwaW5nSW5kaWNhdG9ycyxcbiAgaTE4bixcbiAgaW5pdGlhbFNwZWxsQ2hlY2tTZXR0aW5nLFxuICBpc0F1ZGlvTm90aWZpY2F0aW9uc1N1cHBvcnRlZCxcbiAgaXNBdXRvRG93bmxvYWRVcGRhdGVzU3VwcG9ydGVkLFxuICBpc0F1dG9MYXVuY2hTdXBwb3J0ZWQsXG4gIGlzSGlkZU1lbnVCYXJTdXBwb3J0ZWQsXG4gIGlzUGhvbmVOdW1iZXJTaGFyaW5nU3VwcG9ydGVkLFxuICBpc05vdGlmaWNhdGlvbkF0dGVudGlvblN1cHBvcnRlZCxcbiAgaXNTeW5jU3VwcG9ydGVkLFxuICBpc1N5c3RlbVRyYXlTdXBwb3J0ZWQsXG4gIGhhc0N1c3RvbVRpdGxlQmFyLFxuICBsYXN0U3luY1RpbWUsXG4gIG1ha2VTeW5jUmVxdWVzdCxcbiAgbm90aWZpY2F0aW9uQ29udGVudCxcbiAgb25BdWRpb05vdGlmaWNhdGlvbnNDaGFuZ2UsXG4gIG9uQXV0b0Rvd25sb2FkVXBkYXRlQ2hhbmdlLFxuICBvbkF1dG9MYXVuY2hDaGFuZ2UsXG4gIG9uQ2FsbE5vdGlmaWNhdGlvbnNDaGFuZ2UsXG4gIG9uQ2FsbFJpbmd0b25lTm90aWZpY2F0aW9uQ2hhbmdlLFxuICBvbkNvdW50TXV0ZWRDb252ZXJzYXRpb25zQ2hhbmdlLFxuICBvbkhhc1N0b3JpZXNFbmFibGVkQ2hhbmdlZCxcbiAgb25IaWRlTWVudUJhckNoYW5nZSxcbiAgb25JbmNvbWluZ0NhbGxOb3RpZmljYXRpb25zQ2hhbmdlLFxuICBvbkxhc3RTeW5jVGltZUNoYW5nZSxcbiAgb25NZWRpYUNhbWVyYVBlcm1pc3Npb25zQ2hhbmdlLFxuICBvbk1lZGlhUGVybWlzc2lvbnNDaGFuZ2UsXG4gIG9uTWluaW1pemVUb0FuZFN0YXJ0SW5TeXN0ZW1UcmF5Q2hhbmdlLFxuICBvbk1pbmltaXplVG9TeXN0ZW1UcmF5Q2hhbmdlLFxuICBvbk5vdGlmaWNhdGlvbkF0dGVudGlvbkNoYW5nZSxcbiAgb25Ob3RpZmljYXRpb25Db250ZW50Q2hhbmdlLFxuICBvbk5vdGlmaWNhdGlvbnNDaGFuZ2UsXG4gIG9uUmVsYXlDYWxsc0NoYW5nZSxcbiAgb25TZWxlY3RlZENhbWVyYUNoYW5nZSxcbiAgb25TZWxlY3RlZE1pY3JvcGhvbmVDaGFuZ2UsXG4gIG9uU2VsZWN0ZWRTcGVha2VyQ2hhbmdlLFxuICBvblNwZWxsQ2hlY2tDaGFuZ2UsXG4gIG9uVGhlbWVDaGFuZ2UsXG4gIG9uVW5pdmVyc2FsRXhwaXJlVGltZXJDaGFuZ2UsXG4gIG9uWm9vbUZhY3RvckNoYW5nZSxcbiAgcmVtb3ZlQ3VzdG9tQ29sb3IsXG4gIHJlbW92ZUN1c3RvbUNvbG9yT25Db252ZXJzYXRpb25zLFxuICByZXNldEFsbENoYXRDb2xvcnMsXG4gIHJlc2V0RGVmYXVsdENoYXRDb2xvcixcbiAgc2VsZWN0ZWRDYW1lcmEsXG4gIHNlbGVjdGVkTWljcm9waG9uZSxcbiAgc2VsZWN0ZWRTcGVha2VyLFxuICBzZXRHbG9iYWxEZWZhdWx0Q29udmVyc2F0aW9uQ29sb3IsXG4gIHNob3VsZFNob3dTdG9yaWVzU2V0dGluZ3MsXG4gIHRoZW1lU2V0dGluZyxcbiAgdW5pdmVyc2FsRXhwaXJlVGltZXIgPSAwLFxuICB3aG9DYW5GaW5kTWUsXG4gIHdob0NhblNlZU1lLFxuICB6b29tRmFjdG9yLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBzdG9yaWVzSWQgPSB1c2VVbmlxdWVJZCgpO1xuICBjb25zdCB0aGVtZVNlbGVjdElkID0gdXNlVW5pcXVlSWQoKTtcbiAgY29uc3Qgem9vbVNlbGVjdElkID0gdXNlVW5pcXVlSWQoKTtcblxuICBjb25zdCBbY29uZmlybURlbGV0ZSwgc2V0Q29uZmlybURlbGV0ZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtwYWdlLCBzZXRQYWdlXSA9IHVzZVN0YXRlPFBhZ2U+KFBhZ2UuR2VuZXJhbCk7XG4gIGNvbnN0IFtzaG93U3luY0ZhaWxlZCwgc2V0U2hvd1N5bmNGYWlsZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbm93U3luY2luZywgc2V0Tm93U3luY2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93RGlzYXBwZWFyaW5nVGltZXJEaWFsb2csIHNldFNob3dEaXNhcHBlYXJpbmdUaW1lckRpYWxvZ10gPVxuICAgIHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZG9uZVJlbmRlcmluZygpO1xuICB9LCBbZG9uZVJlbmRlcmluZ10pO1xuXG4gIHVzZUVzY2FwZUhhbmRsaW5nKGNsb3NlU2V0dGluZ3MpO1xuXG4gIGNvbnN0IG9uWm9vbVNlbGVjdENoYW5nZSA9IHVzZUNhbGxiYWNrKFxuICAgICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBudW1iZXIgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgIG9uWm9vbUZhY3RvckNoYW5nZShudW1iZXIgYXMgdW5rbm93biBhcyBab29tRmFjdG9yVHlwZSk7XG4gICAgfSxcbiAgICBbb25ab29tRmFjdG9yQ2hhbmdlXVxuICApO1xuXG4gIGNvbnN0IG9uQXVkaW9JbnB1dFNlbGVjdENoYW5nZSA9IHVzZUNhbGxiYWNrKFxuICAgICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9uU2VsZWN0ZWRNaWNyb3Bob25lQ2hhbmdlKHVuZGVmaW5lZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvblNlbGVjdGVkTWljcm9waG9uZUNoYW5nZShhdmFpbGFibGVNaWNyb3Bob25lc1twYXJzZUludCh2YWx1ZSwgMTApXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbb25TZWxlY3RlZE1pY3JvcGhvbmVDaGFuZ2UsIGF2YWlsYWJsZU1pY3JvcGhvbmVzXVxuICApO1xuXG4gIGNvbnN0IG9uQXVkaW9PdXRwdXRTZWxlY3RDaGFuZ2UgPSB1c2VDYWxsYmFjayhcbiAgICAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvblNlbGVjdGVkU3BlYWtlckNoYW5nZSh1bmRlZmluZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25TZWxlY3RlZFNwZWFrZXJDaGFuZ2UoYXZhaWxhYmxlU3BlYWtlcnNbcGFyc2VJbnQodmFsdWUsIDEwKV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgW29uU2VsZWN0ZWRTcGVha2VyQ2hhbmdlLCBhdmFpbGFibGVTcGVha2Vyc11cbiAgKTtcblxuICBsZXQgc2V0dGluZ3M6IEpTWC5FbGVtZW50IHwgdW5kZWZpbmVkO1xuICBpZiAocGFnZSA9PT0gUGFnZS5HZW5lcmFsKSB7XG4gICAgc2V0dGluZ3MgPSAoXG4gICAgICA8PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3RpdGxlLS1oZWFkZXJcIj5cbiAgICAgICAgICAgIHtpMThuKCdQcmVmZXJlbmNlc19fYnV0dG9uLS1nZW5lcmFsJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8U2V0dGluZ3NSb3c+XG4gICAgICAgICAgPENvbnRyb2wgbGVmdD17aTE4bignUHJlZmVyZW5jZXMtLWRldmljZS1uYW1lJyl9IHJpZ2h0PXtkZXZpY2VOYW1lfSAvPlxuICAgICAgICA8L1NldHRpbmdzUm93PlxuICAgICAgICA8U2V0dGluZ3NSb3cgdGl0bGU9e2kxOG4oJ1ByZWZlcmVuY2VzLS1zeXN0ZW0nKX0+XG4gICAgICAgICAge2lzQXV0b0xhdW5jaFN1cHBvcnRlZCAmJiAoXG4gICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgY2hlY2tlZD17aGFzQXV0b0xhdW5jaH1cbiAgICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ2F1dG9MYXVuY2hEZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgICBuYW1lPVwiYXV0b0xhdW5jaFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkF1dG9MYXVuY2hDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2lzSGlkZU1lbnVCYXJTdXBwb3J0ZWQgJiYgKFxuICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2hhc0hpZGVNZW51QmFyfVxuICAgICAgICAgICAgICBsYWJlbD17aTE4bignaGlkZU1lbnVCYXInKX1cbiAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NoZWNrYm94XCJcbiAgICAgICAgICAgICAgbmFtZT1cImhpZGVNZW51QmFyXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uSGlkZU1lbnVCYXJDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2lzU3lzdGVtVHJheVN1cHBvcnRlZCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtoYXNNaW5pbWl6ZVRvU3lzdGVtVHJheX1cbiAgICAgICAgICAgICAgICBsYWJlbD17aTE4bignU3lzdGVtVHJheVNldHRpbmdfX21pbmltaXplLXRvLXN5c3RlbS10cmF5Jyl9XG4gICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NoZWNrYm94XCJcbiAgICAgICAgICAgICAgICBuYW1lPVwic3lzdGVtLXRyYXktc2V0dGluZy1taW5pbWl6ZS10by1zeXN0ZW0tdHJheVwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uTWluaW1pemVUb1N5c3RlbVRyYXlDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2hhc01pbmltaXplVG9BbmRTdGFydEluU3lzdGVtVHJheX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWhhc01pbmltaXplVG9TeXN0ZW1UcmF5fVxuICAgICAgICAgICAgICAgIGxhYmVsPXtpMThuKFxuICAgICAgICAgICAgICAgICAgJ1N5c3RlbVRyYXlTZXR0aW5nX19taW5pbWl6ZS10by1hbmQtc3RhcnQtaW4tc3lzdGVtLXRyYXknXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJzeXN0ZW0tdHJheS1zZXR0aW5nLW1pbmltaXplLXRvLWFuZC1zdGFydC1pbi1zeXN0ZW0tdHJheVwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uTWluaW1pemVUb0FuZFN0YXJ0SW5TeXN0ZW1UcmF5Q2hhbmdlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TZXR0aW5nc1Jvdz5cbiAgICAgICAgPFNldHRpbmdzUm93IHRpdGxlPXtpMThuKCdwZXJtaXNzaW9ucycpfT5cbiAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2hhc01lZGlhUGVybWlzc2lvbnN9XG4gICAgICAgICAgICBsYWJlbD17aTE4bignbWVkaWFQZXJtaXNzaW9uc0Rlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT1cIm1lZGlhUGVybWlzc2lvbnNcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e29uTWVkaWFQZXJtaXNzaW9uc0NoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzTWVkaWFDYW1lcmFQZXJtaXNzaW9uc31cbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdtZWRpYUNhbWVyYVBlcm1pc3Npb25zRGVzY3JpcHRpb24nKX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPVwibWVkaWFDYW1lcmFQZXJtaXNzaW9uc1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25NZWRpYUNhbWVyYVBlcm1pc3Npb25zQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgIHtpc0F1dG9Eb3dubG9hZFVwZGF0ZXNTdXBwb3J0ZWQgJiYgKFxuICAgICAgICAgIDxTZXR0aW5nc1JvdyB0aXRsZT17aTE4bignUHJlZmVyZW5jZXMtLXVwZGF0ZXMnKX0+XG4gICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgY2hlY2tlZD17aGFzQXV0b0Rvd25sb2FkVXBkYXRlfVxuICAgICAgICAgICAgICBsYWJlbD17aTE4bignUHJlZmVyZW5jZXNfX2Rvd25sb2FkLXVwZGF0ZScpfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgICBuYW1lPVwiYXV0b0Rvd25sb2FkVXBkYXRlXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQXV0b0Rvd25sb2FkVXBkYXRlQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1NldHRpbmdzUm93PlxuICAgICAgICApfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLkFwcGVhcmFuY2UpIHtcbiAgICBsZXQgem9vbUZhY3RvcnMgPSBERUZBVUxUX1pPT01fRkFDVE9SUztcblxuICAgIGlmICghem9vbUZhY3RvcnMuc29tZSgoeyB2YWx1ZSB9KSA9PiB2YWx1ZSA9PT0gem9vbUZhY3RvcikpIHtcbiAgICAgIHpvb21GYWN0b3JzID0gW1xuICAgICAgICAuLi56b29tRmFjdG9ycyxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IGAke01hdGgucm91bmQoem9vbUZhY3RvciAqIDEwMCl9JWAsXG4gICAgICAgICAgdmFsdWU6IHpvb21GYWN0b3IsXG4gICAgICAgIH0sXG4gICAgICBdLnNvcnQoKGEsIGIpID0+IGEudmFsdWUgLSBiLnZhbHVlKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncyA9IChcbiAgICAgIDw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3RpdGxlXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fdGl0bGUtLWhlYWRlclwiPlxuICAgICAgICAgICAge2kxOG4oJ1ByZWZlcmVuY2VzX19idXR0b24tLWFwcGVhcmFuY2UnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxTZXR0aW5nc1Jvdz5cbiAgICAgICAgICA8Q29udHJvbFxuICAgICAgICAgICAgbGVmdD17XG4gICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPXt0aGVtZVNlbGVjdElkfT5cbiAgICAgICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXMtLXRoZW1lJyl9XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodD17XG4gICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICBpZD17dGhlbWVTZWxlY3RJZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25UaGVtZUNoYW5nZX1cbiAgICAgICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ3RoZW1lU3lzdGVtJyksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ3RoZW1lTGlnaHQnKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdsaWdodCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpMThuKCd0aGVtZURhcmsnKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdkYXJrJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICB2YWx1ZT17dGhlbWVTZXR0aW5nfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e2kxOG4oJ3Nob3dDaGF0Q29sb3JFZGl0b3InKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0UGFnZShQYWdlLkNoYXRDb2xvcik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgQ29udmVyc2F0aW9uRGV0YWlsc19fY2hhdC1jb2xvciBDb252ZXJzYXRpb25EZXRhaWxzX19jaGF0LWNvbG9yLS0ke2RlZmF1bHRDb252ZXJzYXRpb25Db2xvci5jb2xvcn1gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAuLi5nZXRDdXN0b21Db2xvclN0eWxlKFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29udmVyc2F0aW9uQ29sb3IuY3VzdG9tQ29sb3JEYXRhPy52YWx1ZVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e1xuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj17em9vbVNlbGVjdElkfT57aTE4bignUHJlZmVyZW5jZXMtLXpvb20nKX08L2xhYmVsPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgaWQ9e3pvb21TZWxlY3RJZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25ab29tU2VsZWN0Q2hhbmdlfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e3pvb21GYWN0b3JzfVxuICAgICAgICAgICAgICAgIHZhbHVlPXt6b29tRmFjdG9yfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICA8Lz5cbiAgICApO1xuICB9IGVsc2UgaWYgKHBhZ2UgPT09IFBhZ2UuQ2hhdHMpIHtcbiAgICBsZXQgc3BlbGxDaGVja0RpcnR5VGV4dDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmIChpbml0aWFsU3BlbGxDaGVja1NldHRpbmcgIT09IGhhc1NwZWxsQ2hlY2spIHtcbiAgICAgIHNwZWxsQ2hlY2tEaXJ0eVRleHQgPSBoYXNTcGVsbENoZWNrXG4gICAgICAgID8gaTE4bignc3BlbGxDaGVja1dpbGxCZUVuYWJsZWQnKVxuICAgICAgICA6IGkxOG4oJ3NwZWxsQ2hlY2tXaWxsQmVEaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RTeW5jRGF0ZSA9IG5ldyBEYXRlKGxhc3RTeW5jVGltZSB8fCAwKTtcblxuICAgIHNldHRpbmdzID0gKFxuICAgICAgPD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fdGl0bGVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZS0taGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tY2hhdHMnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxTZXR0aW5nc1JvdyB0aXRsZT17aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tY2hhdHMnKX0+XG4gICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICBjaGVja2VkPXtoYXNTcGVsbENoZWNrfVxuICAgICAgICAgICAgZGVzY3JpcHRpb249e3NwZWxsQ2hlY2tEaXJ0eVRleHR9XG4gICAgICAgICAgICBsYWJlbD17aTE4bignc3BlbGxDaGVja0Rlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT1cInNwZWxsY2hlY2tcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e29uU3BlbGxDaGVja0NoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzTGlua1ByZXZpZXdzfVxuICAgICAgICAgICAgZGVzY3JpcHRpb249e2kxOG4oJ1ByZWZlcmVuY2VzX19saW5rLXByZXZpZXdzLS1kZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdQcmVmZXJlbmNlc19fbGluay1wcmV2aWV3cy0tdGl0bGUnKX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPVwibGlua1ByZXZpZXdzXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtub29wfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgIHtpc1N5bmNTdXBwb3J0ZWQgJiYgKFxuICAgICAgICAgIDxTZXR0aW5nc1Jvdz5cbiAgICAgICAgICAgIDxDb250cm9sXG4gICAgICAgICAgICAgIGxlZnQ9e1xuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8ZGl2PntpMThuKCdzeW5jJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICB7aTE4bignc3luY0V4cGxhbmF0aW9uJyl9eycgJ31cbiAgICAgICAgICAgICAgICAgICAge2kxOG4oJ1ByZWZlcmVuY2VzLS1sYXN0U3luY2VkJywge1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGxhc3RTeW5jRGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBsYXN0U3luY0RhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICB7c2hvd1N5bmNGYWlsZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvbiBQcmVmZXJlbmNlc19fZGVzY3JpcHRpb24tLWVycm9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2kxOG4oJ3N5bmNGYWlsZWQnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJpZ2h0PXtcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19yaWdodC1idXR0b25cIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e25vd1N5bmNpbmd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRTaG93U3luY0ZhaWxlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0Tm93U3luY2luZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbWFrZVN5bmNSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkxhc3RTeW5jVGltZUNoYW5nZShEYXRlLm5vdygpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFNob3dTeW5jRmFpbGVkKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXROb3dTeW5jaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU2Vjb25kYXJ5QWZmaXJtYXRpdmV9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtub3dTeW5jaW5nID8gPFNwaW5uZXIgc3ZnU2l6ZT1cInNtYWxsXCIgLz4gOiBpMThuKCdzeW5jTm93Jyl9XG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1NldHRpbmdzUm93PlxuICAgICAgICApfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLkNhbGxzKSB7XG4gICAgc2V0dGluZ3MgPSAoXG4gICAgICA8PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3RpdGxlLS1oZWFkZXJcIj5cbiAgICAgICAgICAgIHtpMThuKCdQcmVmZXJlbmNlc19fYnV0dG9uLS1jYWxscycpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFNldHRpbmdzUm93IHRpdGxlPXtpMThuKCdjYWxsaW5nJyl9PlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdpbmNvbWluZ0NhbGxOb3RpZmljYXRpb25EZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NoZWNrYm94XCJcbiAgICAgICAgICAgIG5hbWU9XCJpbmNvbWluZ0NhbGxOb3RpZmljYXRpb25cIlxuICAgICAgICAgICAgb25DaGFuZ2U9e29uSW5jb21pbmdDYWxsTm90aWZpY2F0aW9uc0NoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzQ2FsbFJpbmd0b25lTm90aWZpY2F0aW9ufVxuICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ2NhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbkRlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT1cImNhbGxSaW5ndG9uZU5vdGlmaWNhdGlvblwiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25DYWxsUmluZ3RvbmVOb3RpZmljYXRpb25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TZXR0aW5nc1Jvdz5cbiAgICAgICAgPFNldHRpbmdzUm93IHRpdGxlPXtpMThuKCdQcmVmZXJlbmNlc19fZGV2aWNlcycpfT5cbiAgICAgICAgICA8Q29udHJvbFxuICAgICAgICAgICAgbGVmdD17XG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19zZWxlY3QtdGl0bGVcIiBodG1sRm9yPVwidmlkZW9cIj5cbiAgICAgICAgICAgICAgICAgIHtpMThuKCdjYWxsaW5nRGV2aWNlU2VsZWN0aW9uX19sYWJlbC0tdmlkZW8nKX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIGFyaWFMYWJlbD17aTE4bignY2FsbGluZ0RldmljZVNlbGVjdGlvbl9fbGFiZWwtLXZpZGVvJyl9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWF2YWlsYWJsZUNhbWVyYXMubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3NlbGVjdFwiXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidmlkZW9cIlxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uU2VsZWN0ZWRDYW1lcmFDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlQ2FtZXJhcy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICA/IGF2YWlsYWJsZUNhbWVyYXMubWFwKGRldmljZSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBsb2NhbGl6ZURlZmF1bHQoaTE4biwgZGV2aWNlLmxhYmVsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRldmljZS5kZXZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaTE4bihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYWxsaW5nRGV2aWNlU2VsZWN0aW9uX19zZWxlY3QtLW5vLWRldmljZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZENhbWVyYX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0PXs8ZGl2IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e1xuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxsYWJlbFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3NlbGVjdC10aXRsZVwiXG4gICAgICAgICAgICAgICAgICBodG1sRm9yPVwiYXVkaW8taW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtpMThuKCdjYWxsaW5nRGV2aWNlU2VsZWN0aW9uX19sYWJlbC0tYXVkaW8taW5wdXQnKX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIGFyaWFMYWJlbD17aTE4bignY2FsbGluZ0RldmljZVNlbGVjdGlvbl9fbGFiZWwtLWF1ZGlvLWlucHV0Jyl9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWF2YWlsYWJsZU1pY3JvcGhvbmVzLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19zZWxlY3RcIlxuICAgICAgICAgICAgICAgICAgbmFtZT1cImF1ZGlvLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkF1ZGlvSW5wdXRTZWxlY3RDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlTWljcm9waG9uZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgPyBhdmFpbGFibGVNaWNyb3Bob25lcy5tYXAoZGV2aWNlID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGxvY2FsaXplRGVmYXVsdChpMThuLCBkZXZpY2UubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkZXZpY2UuaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2FsbGluZ0RldmljZVNlbGVjdGlvbl9fc2VsZWN0LS1uby1kZXZpY2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRNaWNyb3Bob25lPy5pbmRleH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0PXs8ZGl2IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e1xuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxsYWJlbFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3NlbGVjdC10aXRsZVwiXG4gICAgICAgICAgICAgICAgICBodG1sRm9yPVwiYXVkaW8tb3V0cHV0XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7aTE4bignY2FsbGluZ0RldmljZVNlbGVjdGlvbl9fbGFiZWwtLWF1ZGlvLW91dHB1dCcpfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgYXJpYUxhYmVsPXtpMThuKFxuICAgICAgICAgICAgICAgICAgICAnY2FsbGluZ0RldmljZVNlbGVjdGlvbl9fbGFiZWwtLWF1ZGlvLW91dHB1dCdcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWF2YWlsYWJsZVNwZWFrZXJzLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19zZWxlY3RcIlxuICAgICAgICAgICAgICAgICAgbmFtZT1cImF1ZGlvLW91dHB1dFwiXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17b25BdWRpb091dHB1dFNlbGVjdENoYW5nZX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1xuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVTcGVha2Vycy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICA/IGF2YWlsYWJsZVNwZWFrZXJzLm1hcChkZXZpY2UgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogbG9jYWxpemVEZWZhdWx0KGkxOG4sIGRldmljZS5uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRldmljZS5pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaTE4bihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYWxsaW5nRGV2aWNlU2VsZWN0aW9uX19zZWxlY3QtLW5vLWRldmljZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZFNwZWFrZXI/LmluZGV4fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQ9ezxkaXYgLz59XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TZXR0aW5nc1Jvdz5cbiAgICAgICAgPFNldHRpbmdzUm93IHRpdGxlPXtpMThuKCdQcmVmZXJlbmNlcy0tYWR2YW5jZWQnKX0+XG4gICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICBjaGVja2VkPXtoYXNSZWxheUNhbGxzfVxuICAgICAgICAgICAgZGVzY3JpcHRpb249e2kxOG4oJ2Fsd2F5c1JlbGF5Q2FsbHNEZXRhaWwnKX1cbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdhbHdheXNSZWxheUNhbGxzRGVzY3JpcHRpb24nKX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPVwicmVsYXlDYWxsc1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25SZWxheUNhbGxzQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICA8Lz5cbiAgICApO1xuICB9IGVsc2UgaWYgKHBhZ2UgPT09IFBhZ2UuTm90aWZpY2F0aW9ucykge1xuICAgIHNldHRpbmdzID0gKFxuICAgICAgPD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fdGl0bGVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZS0taGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tbm90aWZpY2F0aW9ucycpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFNldHRpbmdzUm93PlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzTm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdQcmVmZXJlbmNlc19fZW5hYmxlLW5vdGlmaWNhdGlvbnMnKX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPVwibm90aWZpY2F0aW9uc1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25Ob3RpZmljYXRpb25zQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICBjaGVja2VkPXtoYXNDYWxsTm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgIGxhYmVsPXtpMThuKCdjYWxsU3lzdGVtTm90aWZpY2F0aW9uRGVzY3JpcHRpb24nKX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPVwiY2FsbFN5c3RlbU5vdGlmaWNhdGlvblwiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25DYWxsTm90aWZpY2F0aW9uc0NoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtpc05vdGlmaWNhdGlvbkF0dGVudGlvblN1cHBvcnRlZCAmJiAoXG4gICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgY2hlY2tlZD17aGFzTm90aWZpY2F0aW9uQXR0ZW50aW9ufVxuICAgICAgICAgICAgICBsYWJlbD17aTE4bignbm90aWZpY2F0aW9uRHJhd0F0dGVudGlvbicpfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgICBuYW1lPVwibm90aWZpY2F0aW9uRHJhd0F0dGVudGlvblwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbk5vdGlmaWNhdGlvbkF0dGVudGlvbkNoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7aXNBdWRpb05vdGlmaWNhdGlvbnNTdXBwb3J0ZWQgJiYgKFxuICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2hhc0F1ZGlvTm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ2F1ZGlvTm90aWZpY2F0aW9uRGVzY3JpcHRpb24nKX1cbiAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NoZWNrYm94XCJcbiAgICAgICAgICAgICAgbmFtZT1cImF1ZGlvTm90aWZpY2F0aW9uXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQXVkaW9Ob3RpZmljYXRpb25zQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzQ291bnRNdXRlZENvbnZlcnNhdGlvbnN9XG4gICAgICAgICAgICBsYWJlbD17aTE4bignY291bnRNdXRlZENvbnZlcnNhdGlvbnNEZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NoZWNrYm94XCJcbiAgICAgICAgICAgIG5hbWU9XCJjb3VudE11dGVkQ29udmVyc2F0aW9uc1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25Db3VudE11dGVkQ29udmVyc2F0aW9uc0NoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1NldHRpbmdzUm93PlxuICAgICAgICA8U2V0dGluZ3NSb3c+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e2kxOG4oJ1ByZWZlcmVuY2VzLS1ub3RpZmljYXRpb24tY29udGVudCcpfVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgYXJpYUxhYmVsPXtpMThuKCdQcmVmZXJlbmNlcy0tbm90aWZpY2F0aW9uLWNvbnRlbnQnKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWhhc05vdGlmaWNhdGlvbnN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9uQ29udGVudENoYW5nZX1cbiAgICAgICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ25hbWVBbmRNZXNzYWdlJyksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnbWVzc2FnZScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpMThuKCduYW1lT25seScpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaTE4bignbm9OYW1lT3JNZXNzYWdlJyksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnY291bnQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgIHZhbHVlPXtub3RpZmljYXRpb25Db250ZW50fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICA8Lz5cbiAgICApO1xuICB9IGVsc2UgaWYgKHBhZ2UgPT09IFBhZ2UuUHJpdmFjeSkge1xuICAgIGNvbnN0IGlzQ3VzdG9tRGlzYXBwZWFyaW5nTWVzc2FnZVZhbHVlID1cbiAgICAgICFERUZBVUxUX0RVUkFUSU9OU19TRVQuaGFzKHVuaXZlcnNhbEV4cGlyZVRpbWVyKTtcblxuICAgIHNldHRpbmdzID0gKFxuICAgICAgPD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fdGl0bGVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZS0taGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tcHJpdmFjeScpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFNldHRpbmdzUm93PlxuICAgICAgICAgIDxDb250cm9sXG4gICAgICAgICAgICBsZWZ0PXtpMThuKCdQcmVmZXJlbmNlcy0tYmxvY2tlZCcpfVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICBibG9ja2VkQ291bnQgPT09IDFcbiAgICAgICAgICAgICAgICA/IGkxOG4oJ1ByZWZlcmVuY2VzLS1ibG9ja2VkLWNvdW50LXNpbmd1bGFyJywgW1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmcoYmxvY2tlZENvdW50KSxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBpMThuKCdQcmVmZXJlbmNlcy0tYmxvY2tlZC1jb3VudC1wbHVyYWwnLCBbXG4gICAgICAgICAgICAgICAgICAgIFN0cmluZyhibG9ja2VkQ291bnQgfHwgMCksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgIHtpc1Bob25lTnVtYmVyU2hhcmluZ1N1cHBvcnRlZCA/IChcbiAgICAgICAgICA8U2V0dGluZ3NSb3cgdGl0bGU9e2kxOG4oJ1ByZWZlcmVuY2VzX193aG8tY2FuLS10aXRsZScpfT5cbiAgICAgICAgICAgIDxDb250cm9sXG4gICAgICAgICAgICAgIGxlZnQ9e2kxOG4oJ1ByZWZlcmVuY2VzLS1zZWUtbWUnKX1cbiAgICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIGFyaWFMYWJlbD17aTE4bignUHJlZmVyZW5jZXMtLXNlZS1tZScpfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtub29wfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogaTE4bignUHJlZmVyZW5jZXNfX3doby1jYW4tLWV2ZXJ5Ym9keScpLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBQaG9uZU51bWJlclNoYXJpbmdNb2RlLkV2ZXJ5Ym9keSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ1ByZWZlcmVuY2VzX193aG8tY2FuLS1jb250YWN0cycpLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBQaG9uZU51bWJlclNoYXJpbmdNb2RlLkNvbnRhY3RzT25seSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ1ByZWZlcmVuY2VzX193aG8tY2FuLS1ub2JvZHknKSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogUGhvbmVOdW1iZXJTaGFyaW5nTW9kZS5Ob2JvZHksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3dob0NhblNlZU1lfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q29udHJvbFxuICAgICAgICAgICAgICBsZWZ0PXtpMThuKCdQcmVmZXJlbmNlcy0tZmluZC1tZScpfVxuICAgICAgICAgICAgICByaWdodD17XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgYXJpYUxhYmVsPXtpMThuKCdQcmVmZXJlbmNlcy0tZmluZC1tZScpfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtub29wfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogaTE4bignUHJlZmVyZW5jZXNfX3doby1jYW4tLWV2ZXJ5Ym9keScpLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBQaG9uZU51bWJlckRpc2NvdmVyYWJpbGl0eS5EaXNjb3ZlcmFibGUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpMThuKCdQcmVmZXJlbmNlc19fd2hvLWNhbi0tbm9ib2R5JyksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFBob25lTnVtYmVyRGlzY292ZXJhYmlsaXR5Lk5vdERpc2NvdmVyYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17d2hvQ2FuRmluZE1lfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19wYWRkaW5nXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAge2kxOG4oJ1ByZWZlcmVuY2VzX19wcml2YWN5LS1kZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8U2V0dGluZ3NSb3cgdGl0bGU9e2kxOG4oJ1ByZWZlcmVuY2VzLS1tZXNzYWdpbmcnKX0+XG4gICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICBjaGVja2VkPXtoYXNSZWFkUmVjZWlwdHN9XG4gICAgICAgICAgICBkaXNhYmxlZFxuICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ1ByZWZlcmVuY2VzLS1yZWFkLXJlY2VpcHRzJyl9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT1cInJlYWRSZWNlaXB0c1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17bm9vcH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17aGFzVHlwaW5nSW5kaWNhdG9yc31cbiAgICAgICAgICAgIGRpc2FibGVkXG4gICAgICAgICAgICBsYWJlbD17aTE4bignUHJlZmVyZW5jZXMtLXR5cGluZy1pbmRpY2F0b3JzJyl9XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT1cInR5cGluZ0luZGljYXRvcnNcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e25vb3B9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19wYWRkaW5nXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX3ByaXZhY3ktLWRlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TZXR0aW5nc1Jvdz5cbiAgICAgICAge3Nob3dEaXNhcHBlYXJpbmdUaW1lckRpYWxvZyAmJiAoXG4gICAgICAgICAgPERpc2FwcGVhcmluZ1RpbWVEaWFsb2dcbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpbml0aWFsVmFsdWU9e3VuaXZlcnNhbEV4cGlyZVRpbWVyfVxuICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd0Rpc2FwcGVhcmluZ1RpbWVyRGlhbG9nKGZhbHNlKX1cbiAgICAgICAgICAgIG9uU3VibWl0PXtvblVuaXZlcnNhbEV4cGlyZVRpbWVyQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIDxTZXR0aW5nc1JvdyB0aXRsZT17aTE4bignZGlzYXBwZWFyaW5nTWVzc2FnZXMnKX0+XG4gICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgIGxlZnQ9e1xuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICB7aTE4bignc2V0dGluZ3NfX0Rpc2FwcGVhcmluZ01lc3NhZ2VzX190aW1lcl9fbGFiZWwnKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAge2kxOG4oJ3NldHRpbmdzX19EaXNhcHBlYXJpbmdNZXNzYWdlc19fZm9vdGVyJyl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgYXJpYUxhYmVsPXtpMThuKCdzZXR0aW5nc19fRGlzYXBwZWFyaW5nTWVzc2FnZXNfX3RpbWVyX19sYWJlbCcpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID09PSBTdHJpbmcodW5pdmVyc2FsRXhwaXJlVGltZXIpIHx8XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID09PSAnLTEnXG4gICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2hvd0Rpc2FwcGVhcmluZ1RpbWVyRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIG9uVW5pdmVyc2FsRXhwaXJlVGltZXJDaGFuZ2UocGFyc2VJbnQodmFsdWUsIDEwKSk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvcHRpb25zPXtERUZBVUxUX0RVUkFUSU9OU19JTl9TRUNPTkRTLm1hcChzZWNvbmRzID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBmb3JtYXRFeHBpcmF0aW9uVGltZXIoaTE4biwgc2Vjb25kcywge1xuICAgICAgICAgICAgICAgICAgICBjYXBpdGFsaXplT2ZmOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2Vjb25kcyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGlzQ3VzdG9tRGlzYXBwZWFyaW5nTWVzc2FnZVZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgPyB1bml2ZXJzYWxFeHBpcmVUaW1lclxuICAgICAgICAgICAgICAgICAgICAgIDogLTEsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGlzQ3VzdG9tRGlzYXBwZWFyaW5nTWVzc2FnZVZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgPyBmb3JtYXRFeHBpcmF0aW9uVGltZXIoaTE4biwgdW5pdmVyc2FsRXhwaXJlVGltZXIpXG4gICAgICAgICAgICAgICAgICAgICAgOiBpMThuKCdzZWxlY3RlZEN1c3RvbURpc2FwcGVhcmluZ1RpbWVPcHRpb24nKSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3VuaXZlcnNhbEV4cGlyZVRpbWVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgIHtzaG91bGRTaG93U3Rvcmllc1NldHRpbmdzICYmIChcbiAgICAgICAgICA8U2V0dGluZ3NSb3cgdGl0bGU9e2kxOG4oJ1N0b3JpZXNfX3RpdGxlJyl9PlxuICAgICAgICAgICAgPENvbnRyb2xcbiAgICAgICAgICAgICAgbGVmdD17XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9e3N0b3JpZXNJZH0+XG4gICAgICAgICAgICAgICAgICA8ZGl2PntpMThuKCdTdG9yaWVzX19zZXR0aW5ncy10b2dnbGUtLXRpdGxlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICB7aTE4bignU3Rvcmllc19fc2V0dGluZ3MtdG9nZ2xlLS1kZXNjcmlwdGlvbicpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByaWdodD17XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgaWQ9e3N0b3JpZXNJZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9uSGFzU3Rvcmllc0VuYWJsZWRDaGFuZ2VkKHZhbHVlID09PSAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1tcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ29uJyksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ29mZicpLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtTdHJpbmcoaGFzU3Rvcmllc0VuYWJsZWQpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TZXR0aW5nc1Jvdz5cbiAgICAgICAgKX1cbiAgICAgICAgPFNldHRpbmdzUm93PlxuICAgICAgICAgIDxDb250cm9sXG4gICAgICAgICAgICBsZWZ0PXtcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8ZGl2PntpMThuKCdjbGVhckRhdGFIZWFkZXInKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAge2kxOG4oJ2NsZWFyRGF0YUV4cGxhbmF0aW9uJyl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQ9e1xuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19yaWdodC1idXR0b25cIj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlKHRydWUpfVxuICAgICAgICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5TZWNvbmRhcnlEZXN0cnVjdGl2ZX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7aTE4bignY2xlYXJEYXRhQnV0dG9uJyl9XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2V0dGluZ3NSb3c+XG4gICAgICAgIHtjb25maXJtRGVsZXRlID8gKFxuICAgICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICAgIGFjdGlvbnM9e1tcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogZG9EZWxldGVBbGxEYXRhLFxuICAgICAgICAgICAgICAgIHN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ2NsZWFyRGF0YUJ1dHRvbicpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldENvbmZpcm1EZWxldGUoZmFsc2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHRpdGxlPXtpMThuKCdkZWxldGVBbGxEYXRhSGVhZGVyJyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2RlbGV0ZUFsbERhdGFCb2R5Jyl9XG4gICAgICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLkNoYXRDb2xvcikge1xuICAgIHNldHRpbmdzID0gKFxuICAgICAgPD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fdGl0bGVcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdnb0JhY2snKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19iYWNrLWljb25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShQYWdlLkFwcGVhcmFuY2UpfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX190aXRsZS0taGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignQ2hhdENvbG9yUGlja2VyX19tZW51LXRpdGxlJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8Q2hhdENvbG9yUGlja2VyXG4gICAgICAgICAgY3VzdG9tQ29sb3JzPXtjdXN0b21Db2xvcnN9XG4gICAgICAgICAgZ2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvcj17Z2V0Q29udmVyc2F0aW9uc1dpdGhDdXN0b21Db2xvcn1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIGlzR2xvYmFsXG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17ZGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yLmNvbG9yfVxuICAgICAgICAgIHNlbGVjdGVkQ3VzdG9tQ29sb3I9e2RlZmF1bHRDb252ZXJzYXRpb25Db2xvci5jdXN0b21Db2xvckRhdGEgfHwge319XG4gICAgICAgICAgLy8gYWN0aW9uc1xuICAgICAgICAgIGFkZEN1c3RvbUNvbG9yPXthZGRDdXN0b21Db2xvcn1cbiAgICAgICAgICBjb2xvclNlbGVjdGVkPXtub29wfVxuICAgICAgICAgIGVkaXRDdXN0b21Db2xvcj17ZWRpdEN1c3RvbUNvbG9yfVxuICAgICAgICAgIHJlbW92ZUN1c3RvbUNvbG9yPXtyZW1vdmVDdXN0b21Db2xvcn1cbiAgICAgICAgICByZW1vdmVDdXN0b21Db2xvck9uQ29udmVyc2F0aW9ucz17cmVtb3ZlQ3VzdG9tQ29sb3JPbkNvbnZlcnNhdGlvbnN9XG4gICAgICAgICAgcmVzZXRBbGxDaGF0Q29sb3JzPXtyZXNldEFsbENoYXRDb2xvcnN9XG4gICAgICAgICAgcmVzZXREZWZhdWx0Q2hhdENvbG9yPXtyZXNldERlZmF1bHRDaGF0Q29sb3J9XG4gICAgICAgICAgc2V0R2xvYmFsRGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yPXtzZXRHbG9iYWxEZWZhdWx0Q29udmVyc2F0aW9uQ29sb3J9XG4gICAgICAgIC8+XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8VGl0bGVCYXJDb250YWluZXJcbiAgICAgIGhhc0N1c3RvbVRpdGxlQmFyPXtoYXNDdXN0b21UaXRsZUJhcn1cbiAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fcGFnZS1zZWxlY3RvclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgICAgUHJlZmVyZW5jZXNfX2J1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLWdlbmVyYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAnUHJlZmVyZW5jZXNfX2J1dHRvbi0tc2VsZWN0ZWQnOiBwYWdlID09PSBQYWdlLkdlbmVyYWwsXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2UoUGFnZS5HZW5lcmFsKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tZ2VuZXJhbCcpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgICAgUHJlZmVyZW5jZXNfX2J1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLWFwcGVhcmFuY2UnOiB0cnVlLFxuICAgICAgICAgICAgICAnUHJlZmVyZW5jZXNfX2J1dHRvbi0tc2VsZWN0ZWQnOlxuICAgICAgICAgICAgICAgIHBhZ2UgPT09IFBhZ2UuQXBwZWFyYW5jZSB8fCBwYWdlID09PSBQYWdlLkNoYXRDb2xvcixcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShQYWdlLkFwcGVhcmFuY2UpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdQcmVmZXJlbmNlc19fYnV0dG9uLS1hcHBlYXJhbmNlJyl9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoe1xuICAgICAgICAgICAgICBQcmVmZXJlbmNlc19fYnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAnUHJlZmVyZW5jZXNfX2J1dHRvbi0tY2hhdHMnOiB0cnVlLFxuICAgICAgICAgICAgICAnUHJlZmVyZW5jZXNfX2J1dHRvbi0tc2VsZWN0ZWQnOiBwYWdlID09PSBQYWdlLkNoYXRzLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYWdlKFBhZ2UuQ2hhdHMpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdQcmVmZXJlbmNlc19fYnV0dG9uLS1jaGF0cycpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgICAgUHJlZmVyZW5jZXNfX2J1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLWNhbGxzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLXNlbGVjdGVkJzogcGFnZSA9PT0gUGFnZS5DYWxscyxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShQYWdlLkNhbGxzKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignUHJlZmVyZW5jZXNfX2J1dHRvbi0tY2FsbHMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgIFByZWZlcmVuY2VzX19idXR0b246IHRydWUsXG4gICAgICAgICAgICAgICdQcmVmZXJlbmNlc19fYnV0dG9uLS1ub3RpZmljYXRpb25zJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLXNlbGVjdGVkJzogcGFnZSA9PT0gUGFnZS5Ob3RpZmljYXRpb25zLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYWdlKFBhZ2UuTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ1ByZWZlcmVuY2VzX19idXR0b24tLW5vdGlmaWNhdGlvbnMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgIFByZWZlcmVuY2VzX19idXR0b246IHRydWUsXG4gICAgICAgICAgICAgICdQcmVmZXJlbmNlc19fYnV0dG9uLS1wcml2YWN5JzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1ByZWZlcmVuY2VzX19idXR0b24tLXNlbGVjdGVkJzogcGFnZSA9PT0gUGFnZS5Qcml2YWN5LFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYWdlKFBhZ2UuUHJpdmFjeSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ1ByZWZlcmVuY2VzX19idXR0b24tLXByaXZhY3knKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3NldHRpbmdzLXBhbmVcIj57c2V0dGluZ3N9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L1RpdGxlQmFyQ29udGFpbmVyPlxuICApO1xufTtcblxuY29uc3QgU2V0dGluZ3NSb3cgPSAoe1xuICBjaGlsZHJlbixcbiAgdGl0bGUsXG59OiB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG4gIHRpdGxlPzogc3RyaW5nO1xufSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19zZXR0aW5ncy1yb3dcIj5cbiAgICAgIHt0aXRsZSAmJiA8aDMgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX3BhZGRpbmdcIj57dGl0bGV9PC9oMz59XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBDb250cm9sID0gKHtcbiAgbGVmdCxcbiAgb25DbGljayxcbiAgcmlnaHQsXG59OiB7XG4gIGxlZnQ6IFJlYWN0Tm9kZTtcbiAgb25DbGljaz86ICgpID0+IHVua25vd247XG4gIHJpZ2h0OiBSZWFjdE5vZGU7XG59KTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBjb250ZW50ID0gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByZWZlcmVuY2VzX19jb250cm9sLS1rZXlcIj57bGVmdH08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NvbnRyb2wtLXZhbHVlXCI+e3JpZ2h0fTwvZGl2PlxuICAgIDwvPlxuICApO1xuXG4gIGlmIChvbkNsaWNrKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwiUHJlZmVyZW5jZXNfX2NvbnRyb2wgUHJlZmVyZW5jZXNfX2NvbnRyb2wtLWNsaWNrYWJsZVwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgPlxuICAgICAgICB7Y29udGVudH1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJQcmVmZXJlbmNlc19fY29udHJvbFwiPntjb250ZW50fTwvZGl2Pjtcbn07XG5cbmZ1bmN0aW9uIGxvY2FsaXplRGVmYXVsdChpMThuOiBMb2NhbGl6ZXJUeXBlLCBkZXZpY2VMYWJlbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGRldmljZUxhYmVsLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnZGVmYXVsdCcpXG4gICAgPyBkZXZpY2VMYWJlbC5yZXBsYWNlKFxuICAgICAgICAvZGVmYXVsdC9pLFxuICAgICAgICBpMThuKCdjYWxsaW5nRGV2aWNlU2VsZWN0aW9uX19zZWxlY3QtLWRlZmF1bHQnKVxuICAgICAgKVxuICAgIDogZGV2aWNlTGFiZWw7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQXdEO0FBQ3hELG9CQUFxQjtBQUNyQix3QkFBdUI7QUFTdkIsb0JBQXNDO0FBQ3RDLDZCQUFnQztBQUNoQyxzQkFBeUI7QUFDekIsZ0NBQW1DO0FBT25DLG9DQUF1QztBQUV2Qyx3Q0FBMkM7QUFDM0Msb0NBQXVDO0FBQ3ZDLG9CQUF1QjtBQUN2QixxQkFBd0I7QUFDeEIsK0JBQWtDO0FBRWxDLGlDQUFvQztBQUNwQyw2QkFJTztBQUNQLCtCQUFrQztBQUNsQyx5QkFBNEI7QUFDNUIsc0JBQXlCO0FBdUh6QixJQUFLLE9BQUwsa0JBQUssVUFBTDtBQUVFLHFCQUFVO0FBQ1Ysd0JBQWE7QUFDYixtQkFBUTtBQUNSLG1CQUFRO0FBQ1IsMkJBQWdCO0FBQ2hCLHFCQUFVO0FBR1YsdUJBQVk7QUFWVDtBQUFBO0FBYUwsTUFBTSx1QkFBdUI7QUFBQSxFQUMzQjtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUNGO0FBRU8sTUFBTSxjQUFjLHdCQUFDO0FBQUEsRUFDMUI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQSxhQUFhO0FBQUEsRUFDYjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBLHVCQUF1QjtBQUFBLEVBQ3ZCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxNQUM0QjtBQUM1QixRQUFNLFlBQVksb0NBQVk7QUFDOUIsUUFBTSxnQkFBZ0Isb0NBQVk7QUFDbEMsUUFBTSxlQUFlLG9DQUFZO0FBRWpDLFFBQU0sQ0FBQyxlQUFlLG9CQUFvQiwyQkFBUyxLQUFLO0FBQ3hELFFBQU0sQ0FBQyxNQUFNLFdBQVcsMkJBQWUsdUJBQVk7QUFDbkQsUUFBTSxDQUFDLGdCQUFnQixxQkFBcUIsMkJBQVMsS0FBSztBQUMxRCxRQUFNLENBQUMsWUFBWSxpQkFBaUIsMkJBQVMsS0FBSztBQUNsRCxRQUFNLENBQUMsNkJBQTZCLGtDQUNsQywyQkFBUyxLQUFLO0FBQ2hCLFFBQU0sUUFBUSw4QkFBUztBQUV2Qiw4QkFBVSxNQUFNO0FBQ2Qsa0JBQWM7QUFBQSxFQUNoQixHQUFHLENBQUMsYUFBYSxDQUFDO0FBRWxCLGtEQUFrQixhQUFhO0FBRS9CLFFBQU0scUJBQXFCLDhCQUN6QixDQUFDLFVBQWtCO0FBQ2pCLFVBQU0sU0FBUyxXQUFXLEtBQUs7QUFDL0IsdUJBQW1CLE1BQW1DO0FBQUEsRUFDeEQsR0FDQSxDQUFDLGtCQUFrQixDQUNyQjtBQUVBLFFBQU0sMkJBQTJCLDhCQUMvQixDQUFDLFVBQWtCO0FBQ2pCLFFBQUksVUFBVSxhQUFhO0FBQ3pCLGlDQUEyQixNQUFTO0FBQUEsSUFDdEMsT0FBTztBQUNMLGlDQUEyQixxQkFBcUIsU0FBUyxPQUFPLEVBQUUsRUFBRTtBQUFBLElBQ3RFO0FBQUEsRUFDRixHQUNBLENBQUMsNEJBQTRCLG9CQUFvQixDQUNuRDtBQUVBLFFBQU0sNEJBQTRCLDhCQUNoQyxDQUFDLFVBQWtCO0FBQ2pCLFFBQUksVUFBVSxhQUFhO0FBQ3pCLDhCQUF3QixNQUFTO0FBQUEsSUFDbkMsT0FBTztBQUNMLDhCQUF3QixrQkFBa0IsU0FBUyxPQUFPLEVBQUUsRUFBRTtBQUFBLElBQ2hFO0FBQUEsRUFDRixHQUNBLENBQUMseUJBQXlCLGlCQUFpQixDQUM3QztBQUVBLE1BQUk7QUFDSixNQUFJLFNBQVMseUJBQWM7QUFDekIsZUFDRSx3RkFDRSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ2IsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNaLEtBQUssOEJBQThCLENBQ3RDLENBQ0YsR0FDQSxtREFBQyxtQkFDQyxtREFBQztBQUFBLE1BQVEsTUFBTSxLQUFLLDBCQUEwQjtBQUFBLE1BQUcsT0FBTztBQUFBLEtBQVksQ0FDdEUsR0FDQSxtREFBQztBQUFBLE1BQVksT0FBTyxLQUFLLHFCQUFxQjtBQUFBLE9BQzNDLHlCQUNDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssdUJBQXVCO0FBQUEsTUFDbkMsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FFRCwwQkFDQyxtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsT0FBTyxLQUFLLGFBQWE7QUFBQSxNQUN6QixpQkFBZ0I7QUFBQSxNQUNoQixNQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsS0FDWixHQUVELHlCQUNDLHdGQUNFLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssNENBQTRDO0FBQUEsTUFDeEQsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FDQSxtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsVUFBVSxDQUFDO0FBQUEsTUFDWCxPQUFPLEtBQ0wseURBQ0Y7QUFBQSxNQUNBLGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsQ0FFSixHQUNBLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssYUFBYTtBQUFBLE9BQ3BDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssNkJBQTZCO0FBQUEsTUFDekMsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FDQSxtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsT0FBTyxLQUFLLG1DQUFtQztBQUFBLE1BQy9DLGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsR0FDQyxrQ0FDQyxtREFBQztBQUFBLE1BQVksT0FBTyxLQUFLLHNCQUFzQjtBQUFBLE9BQzdDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssOEJBQThCO0FBQUEsTUFDMUMsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osQ0FDRixDQUVKO0FBQUEsRUFFSixXQUFXLFNBQVMsK0JBQWlCO0FBQ25DLFFBQUksY0FBYztBQUVsQixRQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRSxZQUFZLFVBQVUsVUFBVSxHQUFHO0FBQzFELG9CQUFjO0FBQUEsUUFDWixHQUFHO0FBQUEsUUFDSDtBQUFBLFVBQ0UsTUFBTSxHQUFHLEtBQUssTUFBTSxhQUFhLEdBQUc7QUFBQSxVQUNwQyxPQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0YsRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUs7QUFBQSxJQUNwQztBQUVBLGVBQ0Usd0ZBQ0UsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNiLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDWixLQUFLLGlDQUFpQyxDQUN6QyxDQUNGLEdBQ0EsbURBQUMsbUJBQ0MsbURBQUM7QUFBQSxNQUNDLE1BQ0UsbURBQUM7QUFBQSxRQUFNLFNBQVM7QUFBQSxTQUNiLEtBQUssb0JBQW9CLENBQzVCO0FBQUEsTUFFRixPQUNFLG1EQUFDO0FBQUEsUUFDQyxJQUFJO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsTUFBTSxLQUFLLGFBQWE7QUFBQSxZQUN4QixPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU0sS0FBSyxZQUFZO0FBQUEsWUFDdkIsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNLEtBQUssV0FBVztBQUFBLFlBQ3RCLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsT0FBTztBQUFBLE9BQ1Q7QUFBQSxLQUVKLEdBQ0EsbURBQUM7QUFBQSxNQUNDLE1BQU0sS0FBSyxxQkFBcUI7QUFBQSxNQUNoQyxTQUFTLE1BQU07QUFDYixnQkFBUSwyQkFBYztBQUFBLE1BQ3hCO0FBQUEsTUFDQSxPQUNFLG1EQUFDO0FBQUEsUUFDQyxXQUFXLG9FQUFvRSx5QkFBeUI7QUFBQSxRQUN4RyxPQUFPO0FBQUEsYUFDRixvREFDRCx5QkFBeUIsaUJBQWlCLEtBQzVDO0FBQUEsUUFDRjtBQUFBLE9BQ0Y7QUFBQSxLQUVKLEdBQ0EsbURBQUM7QUFBQSxNQUNDLE1BQ0UsbURBQUM7QUFBQSxRQUFNLFNBQVM7QUFBQSxTQUFlLEtBQUssbUJBQW1CLENBQUU7QUFBQSxNQUUzRCxPQUNFLG1EQUFDO0FBQUEsUUFDQyxJQUFJO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsUUFDVCxPQUFPO0FBQUEsT0FDVDtBQUFBLEtBRUosQ0FDRixDQUNGO0FBQUEsRUFFSixXQUFXLFNBQVMscUJBQVk7QUFDOUIsUUFBSTtBQUNKLFFBQUksNkJBQTZCLGVBQWU7QUFDOUMsNEJBQXNCLGdCQUNsQixLQUFLLHlCQUF5QixJQUM5QixLQUFLLDBCQUEwQjtBQUFBLElBQ3JDO0FBRUEsVUFBTSxlQUFlLElBQUksS0FBSyxnQkFBZ0IsQ0FBQztBQUUvQyxlQUNFLHdGQUNFLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDYixtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ1osS0FBSyw0QkFBNEIsQ0FDcEMsQ0FDRixHQUNBLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssNEJBQTRCO0FBQUEsT0FDbkQsbURBQUM7QUFBQSxNQUNDLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLE9BQU8sS0FBSyx1QkFBdUI7QUFBQSxNQUNuQyxpQkFBZ0I7QUFBQSxNQUNoQixNQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsS0FDWixHQUNBLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxhQUFhLEtBQUsseUNBQXlDO0FBQUEsTUFDM0QsVUFBUTtBQUFBLE1BQ1IsT0FBTyxLQUFLLG1DQUFtQztBQUFBLE1BQy9DLGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsR0FDQyxtQkFDQyxtREFBQyxtQkFDQyxtREFBQztBQUFBLE1BQ0MsTUFDRSx3RkFDRSxtREFBQyxhQUFLLEtBQUssTUFBTSxDQUFFLEdBQ25CLG1EQUFDO0FBQUEsUUFBSSxXQUFVO0FBQUEsU0FDWixLQUFLLGlCQUFpQixHQUFHLEtBQ3pCLEtBQUssMkJBQTJCO0FBQUEsUUFDL0IsTUFBTSxhQUFhLG1CQUFtQjtBQUFBLFFBQ3RDLE1BQU0sYUFBYSxtQkFBbUI7QUFBQSxNQUN4QyxDQUFDLENBQ0gsR0FDQyxrQkFDQyxtREFBQztBQUFBLFFBQUksV0FBVTtBQUFBLFNBQ1osS0FBSyxZQUFZLENBQ3BCLENBRUo7QUFBQSxNQUVGLE9BQ0UsbURBQUM7QUFBQSxRQUFJLFdBQVU7QUFBQSxTQUNiLG1EQUFDO0FBQUEsUUFDQyxVQUFVO0FBQUEsUUFDVixTQUFTLFlBQVk7QUFDbkIsNEJBQWtCLEtBQUs7QUFDdkIsd0JBQWMsSUFBSTtBQUNsQixjQUFJO0FBQ0Ysa0JBQU0sZ0JBQWdCO0FBQ3RCLGlDQUFxQixLQUFLLElBQUksQ0FBQztBQUFBLFVBQ2pDLFNBQVMsS0FBUDtBQUNBLDhCQUFrQixJQUFJO0FBQUEsVUFDeEIsVUFBRTtBQUNBLDBCQUFjLEtBQUs7QUFBQSxVQUNyQjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFNBQVMsNEJBQWM7QUFBQSxTQUV0QixhQUFhLG1EQUFDO0FBQUEsUUFBUSxTQUFRO0FBQUEsT0FBUSxJQUFLLEtBQUssU0FBUyxDQUM1RCxDQUNGO0FBQUEsS0FFSixDQUNGLENBRUo7QUFBQSxFQUVKLFdBQVcsU0FBUyxxQkFBWTtBQUM5QixlQUNFLHdGQUNFLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDYixtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ1osS0FBSyw0QkFBNEIsQ0FDcEMsQ0FDRixHQUNBLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssU0FBUztBQUFBLE9BQ2hDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUsscUNBQXFDO0FBQUEsTUFDakQsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FDQSxtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsT0FBTyxLQUFLLHFDQUFxQztBQUFBLE1BQ2pELGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsR0FDQSxtREFBQztBQUFBLE1BQVksT0FBTyxLQUFLLHNCQUFzQjtBQUFBLE9BQzdDLG1EQUFDO0FBQUEsTUFDQyxNQUNFLHdGQUNFLG1EQUFDO0FBQUEsUUFBTSxXQUFVO0FBQUEsUUFBNEIsU0FBUTtBQUFBLFNBQ2xELEtBQUssc0NBQXNDLENBQzlDLEdBQ0EsbURBQUM7QUFBQSxRQUNDLFdBQVcsS0FBSyxzQ0FBc0M7QUFBQSxRQUN0RCxVQUFVLENBQUMsaUJBQWlCO0FBQUEsUUFDNUIsaUJBQWdCO0FBQUEsUUFDaEIsTUFBSztBQUFBLFFBQ0wsVUFBVTtBQUFBLFFBQ1YsU0FDRSxpQkFBaUIsU0FDYixpQkFBaUIsSUFBSSxZQUFXO0FBQUEsVUFDOUIsTUFBTSxnQkFBZ0IsTUFBTSxPQUFPLEtBQUs7QUFBQSxVQUN4QyxPQUFPLE9BQU87QUFBQSxRQUNoQixFQUFFLElBQ0Y7QUFBQSxVQUNFO0FBQUEsWUFDRSxNQUFNLEtBQ0osMkNBQ0Y7QUFBQSxZQUNBLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBRU4sT0FBTztBQUFBLE9BQ1QsQ0FDRjtBQUFBLE1BRUYsT0FBTyxtREFBQyxXQUFJO0FBQUEsS0FDZCxHQUNBLG1EQUFDO0FBQUEsTUFDQyxNQUNFLHdGQUNFLG1EQUFDO0FBQUEsUUFDQyxXQUFVO0FBQUEsUUFDVixTQUFRO0FBQUEsU0FFUCxLQUFLLDRDQUE0QyxDQUNwRCxHQUNBLG1EQUFDO0FBQUEsUUFDQyxXQUFXLEtBQUssNENBQTRDO0FBQUEsUUFDNUQsVUFBVSxDQUFDLHFCQUFxQjtBQUFBLFFBQ2hDLGlCQUFnQjtBQUFBLFFBQ2hCLE1BQUs7QUFBQSxRQUNMLFVBQVU7QUFBQSxRQUNWLFNBQ0UscUJBQXFCLFNBQ2pCLHFCQUFxQixJQUFJLFlBQVc7QUFBQSxVQUNsQyxNQUFNLGdCQUFnQixNQUFNLE9BQU8sSUFBSTtBQUFBLFVBQ3ZDLE9BQU8sT0FBTztBQUFBLFFBQ2hCLEVBQUUsSUFDRjtBQUFBLFVBQ0U7QUFBQSxZQUNFLE1BQU0sS0FDSiwyQ0FDRjtBQUFBLFlBQ0EsT0FBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsUUFFTixPQUFPLG9CQUFvQjtBQUFBLE9BQzdCLENBQ0Y7QUFBQSxNQUVGLE9BQU8sbURBQUMsV0FBSTtBQUFBLEtBQ2QsR0FDQSxtREFBQztBQUFBLE1BQ0MsTUFDRSx3RkFDRSxtREFBQztBQUFBLFFBQ0MsV0FBVTtBQUFBLFFBQ1YsU0FBUTtBQUFBLFNBRVAsS0FBSyw2Q0FBNkMsQ0FDckQsR0FDQSxtREFBQztBQUFBLFFBQ0MsV0FBVyxLQUNULDZDQUNGO0FBQUEsUUFDQSxVQUFVLENBQUMsa0JBQWtCO0FBQUEsUUFDN0IsaUJBQWdCO0FBQUEsUUFDaEIsTUFBSztBQUFBLFFBQ0wsVUFBVTtBQUFBLFFBQ1YsU0FDRSxrQkFBa0IsU0FDZCxrQkFBa0IsSUFBSSxZQUFXO0FBQUEsVUFDL0IsTUFBTSxnQkFBZ0IsTUFBTSxPQUFPLElBQUk7QUFBQSxVQUN2QyxPQUFPLE9BQU87QUFBQSxRQUNoQixFQUFFLElBQ0Y7QUFBQSxVQUNFO0FBQUEsWUFDRSxNQUFNLEtBQ0osMkNBQ0Y7QUFBQSxZQUNBLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBRU4sT0FBTyxpQkFBaUI7QUFBQSxPQUMxQixDQUNGO0FBQUEsTUFFRixPQUFPLG1EQUFDLFdBQUk7QUFBQSxLQUNkLENBQ0YsR0FDQSxtREFBQztBQUFBLE1BQVksT0FBTyxLQUFLLHVCQUF1QjtBQUFBLE9BQzlDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxhQUFhLEtBQUssd0JBQXdCO0FBQUEsTUFDMUMsT0FBTyxLQUFLLDZCQUE2QjtBQUFBLE1BQ3pDLGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsQ0FDRjtBQUFBLEVBRUosV0FBVyxTQUFTLHFDQUFvQjtBQUN0QyxlQUNFLHdGQUNFLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDYixtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ1osS0FBSyxvQ0FBb0MsQ0FDNUMsQ0FDRixHQUNBLG1EQUFDLG1CQUNDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssbUNBQW1DO0FBQUEsTUFDL0MsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FDQSxtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsT0FBTyxLQUFLLG1DQUFtQztBQUFBLE1BQy9DLGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLEdBQ0Msb0NBQ0MsbURBQUM7QUFBQSxNQUNDLFNBQVM7QUFBQSxNQUNULE9BQU8sS0FBSywyQkFBMkI7QUFBQSxNQUN2QyxpQkFBZ0I7QUFBQSxNQUNoQixNQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsS0FDWixHQUVELGlDQUNDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxPQUFPLEtBQUssOEJBQThCO0FBQUEsTUFDMUMsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FFRixtREFBQztBQUFBLE1BQ0MsU0FBUztBQUFBLE1BQ1QsT0FBTyxLQUFLLG9DQUFvQztBQUFBLE1BQ2hELGlCQUFnQjtBQUFBLE1BQ2hCLE1BQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxLQUNaLENBQ0YsR0FDQSxtREFBQyxtQkFDQyxtREFBQztBQUFBLE1BQ0MsTUFBTSxLQUFLLG1DQUFtQztBQUFBLE1BQzlDLE9BQ0UsbURBQUM7QUFBQSxRQUNDLFdBQVcsS0FBSyxtQ0FBbUM7QUFBQSxRQUNuRCxVQUFVLENBQUM7QUFBQSxRQUNYLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxNQUFNLEtBQUssZ0JBQWdCO0FBQUEsWUFDM0IsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNLEtBQUssVUFBVTtBQUFBLFlBQ3JCLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTSxLQUFLLGlCQUFpQjtBQUFBLFlBQzVCLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsT0FBTztBQUFBLE9BQ1Q7QUFBQSxLQUVKLENBQ0YsQ0FDRjtBQUFBLEVBRUosV0FBVyxTQUFTLHlCQUFjO0FBQ2hDLFVBQU0sbUNBQ0osQ0FBQyw2Q0FBc0IsSUFBSSxvQkFBb0I7QUFFakQsZUFDRSx3RkFDRSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ2IsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNaLEtBQUssOEJBQThCLENBQ3RDLENBQ0YsR0FDQSxtREFBQyxtQkFDQyxtREFBQztBQUFBLE1BQ0MsTUFBTSxLQUFLLHNCQUFzQjtBQUFBLE1BQ2pDLE9BQ0UsaUJBQWlCLElBQ2IsS0FBSyx1Q0FBdUM7QUFBQSxRQUMxQyxPQUFPLFlBQVk7QUFBQSxNQUNyQixDQUFDLElBQ0QsS0FBSyxxQ0FBcUM7QUFBQSxRQUN4QyxPQUFPLGdCQUFnQixDQUFDO0FBQUEsTUFDMUIsQ0FBQztBQUFBLEtBRVQsQ0FDRixHQUNDLGdDQUNDLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssNkJBQTZCO0FBQUEsT0FDcEQsbURBQUM7QUFBQSxNQUNDLE1BQU0sS0FBSyxxQkFBcUI7QUFBQSxNQUNoQyxPQUNFLG1EQUFDO0FBQUEsUUFDQyxXQUFXLEtBQUsscUJBQXFCO0FBQUEsUUFDckMsVUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsU0FBUztBQUFBLFVBQ1A7QUFBQSxZQUNFLE1BQU0sS0FBSyxpQ0FBaUM7QUFBQSxZQUM1QyxPQUFPLHFEQUF1QjtBQUFBLFVBQ2hDO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTSxLQUFLLGdDQUFnQztBQUFBLFlBQzNDLE9BQU8scURBQXVCO0FBQUEsVUFDaEM7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNLEtBQUssOEJBQThCO0FBQUEsWUFDekMsT0FBTyxxREFBdUI7QUFBQSxVQUNoQztBQUFBLFFBQ0Y7QUFBQSxRQUNBLE9BQU87QUFBQSxPQUNUO0FBQUEsS0FFSixHQUNBLG1EQUFDO0FBQUEsTUFDQyxNQUFNLEtBQUssc0JBQXNCO0FBQUEsTUFDakMsT0FDRSxtREFBQztBQUFBLFFBQ0MsV0FBVyxLQUFLLHNCQUFzQjtBQUFBLFFBQ3RDLFVBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxNQUFNLEtBQUssaUNBQWlDO0FBQUEsWUFDNUMsT0FBTyw2REFBMkI7QUFBQSxVQUNwQztBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU0sS0FBSyw4QkFBOEI7QUFBQSxZQUN6QyxPQUFPLDZEQUEyQjtBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQUFBLFFBQ0EsT0FBTztBQUFBLE9BQ1Q7QUFBQSxLQUVKLEdBQ0EsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNiLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDWixLQUFLLG1DQUFtQyxDQUMzQyxDQUNGLENBQ0YsSUFDRSxNQUNKLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssd0JBQXdCO0FBQUEsT0FDL0MsbURBQUM7QUFBQSxNQUNDLFNBQVM7QUFBQSxNQUNULFVBQVE7QUFBQSxNQUNSLE9BQU8sS0FBSyw0QkFBNEI7QUFBQSxNQUN4QyxpQkFBZ0I7QUFBQSxNQUNoQixNQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsS0FDWixHQUNBLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsTUFDVCxVQUFRO0FBQUEsTUFDUixPQUFPLEtBQUssZ0NBQWdDO0FBQUEsTUFDNUMsaUJBQWdCO0FBQUEsTUFDaEIsTUFBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLEtBQ1osR0FDQSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ2IsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNaLEtBQUssbUNBQW1DLENBQzNDLENBQ0YsQ0FDRixHQUNDLCtCQUNDLG1EQUFDO0FBQUEsTUFDQztBQUFBLE1BQ0EsY0FBYztBQUFBLE1BQ2QsU0FBUyxNQUFNLCtCQUErQixLQUFLO0FBQUEsTUFDbkQsVUFBVTtBQUFBLEtBQ1osR0FFRixtREFBQztBQUFBLE1BQVksT0FBTyxLQUFLLHNCQUFzQjtBQUFBLE9BQzdDLG1EQUFDO0FBQUEsTUFDQyxNQUNFLHdGQUNFLG1EQUFDLGFBQ0UsS0FBSyw4Q0FBOEMsQ0FDdEQsR0FDQSxtREFBQztBQUFBLFFBQUksV0FBVTtBQUFBLFNBQ1osS0FBSyx3Q0FBd0MsQ0FDaEQsQ0FDRjtBQUFBLE1BRUYsT0FDRSxtREFBQztBQUFBLFFBQ0MsV0FBVyxLQUFLLDhDQUE4QztBQUFBLFFBQzlELFVBQVUsV0FBUztBQUNqQixjQUNFLFVBQVUsT0FBTyxvQkFBb0IsS0FDckMsVUFBVSxNQUNWO0FBQ0EsMkNBQStCLElBQUk7QUFDbkM7QUFBQSxVQUNGO0FBRUEsdUNBQTZCLFNBQVMsT0FBTyxFQUFFLENBQUM7QUFBQSxRQUNsRDtBQUFBLFFBQ0EsU0FBUyxvREFBNkIsSUFBSSxhQUFXO0FBQ25ELGdCQUFNLE9BQU8sbUNBQXNCLE1BQU0sU0FBUztBQUFBLFlBQ2hELGVBQWU7QUFBQSxVQUNqQixDQUFDO0FBQ0QsaUJBQU87QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQyxFQUFFLE9BQU87QUFBQSxVQUNSO0FBQUEsWUFDRSxPQUFPLG1DQUNILHVCQUNBO0FBQUEsWUFDSixNQUFNLG1DQUNGLG1DQUFzQixNQUFNLG9CQUFvQixJQUNoRCxLQUFLLHNDQUFzQztBQUFBLFVBQ2pEO0FBQUEsUUFDRixDQUFDO0FBQUEsUUFDRCxPQUFPO0FBQUEsT0FDVDtBQUFBLEtBRUosQ0FDRixHQUNDLDZCQUNDLG1EQUFDO0FBQUEsTUFBWSxPQUFPLEtBQUssZ0JBQWdCO0FBQUEsT0FDdkMsbURBQUM7QUFBQSxNQUNDLE1BQ0UsbURBQUM7QUFBQSxRQUFNLFNBQVM7QUFBQSxTQUNkLG1EQUFDLGFBQUssS0FBSyxpQ0FBaUMsQ0FBRSxHQUM5QyxtREFBQztBQUFBLFFBQUksV0FBVTtBQUFBLFNBQ1osS0FBSyx1Q0FBdUMsQ0FDL0MsQ0FDRjtBQUFBLE1BRUYsT0FDRSxtREFBQztBQUFBLFFBQ0MsSUFBSTtBQUFBLFFBQ0osVUFBVSxXQUFTO0FBQ2pCLHFDQUEyQixVQUFVLE1BQU07QUFBQSxRQUM3QztBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1A7QUFBQSxZQUNFLE1BQU0sS0FBSyxJQUFJO0FBQUEsWUFDZixPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU0sS0FBSyxLQUFLO0FBQUEsWUFDaEIsT0FBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsUUFDQSxPQUFPLE9BQU8saUJBQWlCO0FBQUEsT0FDakM7QUFBQSxLQUVKLENBQ0YsR0FFRixtREFBQyxtQkFDQyxtREFBQztBQUFBLE1BQ0MsTUFDRSx3RkFDRSxtREFBQyxhQUFLLEtBQUssaUJBQWlCLENBQUUsR0FDOUIsbURBQUM7QUFBQSxRQUFJLFdBQVU7QUFBQSxTQUNaLEtBQUssc0JBQXNCLENBQzlCLENBQ0Y7QUFBQSxNQUVGLE9BQ0UsbURBQUM7QUFBQSxRQUFJLFdBQVU7QUFBQSxTQUNiLG1EQUFDO0FBQUEsUUFDQyxTQUFTLE1BQU0saUJBQWlCLElBQUk7QUFBQSxRQUNwQyxTQUFTLDRCQUFjO0FBQUEsU0FFdEIsS0FBSyxpQkFBaUIsQ0FDekIsQ0FDRjtBQUFBLEtBRUosQ0FDRixHQUNDLGdCQUNDLG1EQUFDO0FBQUEsTUFDQyxTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsT0FBTztBQUFBLFVBQ1AsTUFBTSxLQUFLLGlCQUFpQjtBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxNQUNBLFNBQVMsTUFBTTtBQUNiLHlCQUFpQixLQUFLO0FBQUEsTUFDeEI7QUFBQSxNQUNBLE9BQU8sS0FBSyxxQkFBcUI7QUFBQSxPQUVoQyxLQUFLLG1CQUFtQixDQUMzQixJQUNFLElBQ047QUFBQSxFQUVKLFdBQVcsU0FBUyw2QkFBZ0I7QUFDbEMsZUFDRSx3RkFDRSxtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQ2IsbURBQUM7QUFBQSxNQUNDLGNBQVksS0FBSyxRQUFRO0FBQUEsTUFDekIsV0FBVTtBQUFBLE1BQ1YsU0FBUyxNQUFNLFFBQVEsNkJBQWU7QUFBQSxNQUN0QyxNQUFLO0FBQUEsS0FDUCxHQUNBLG1EQUFDO0FBQUEsTUFBSSxXQUFVO0FBQUEsT0FDWixLQUFLLDZCQUE2QixDQUNyQyxDQUNGLEdBQ0EsbURBQUM7QUFBQSxNQUNDO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVE7QUFBQSxNQUNSLGVBQWUseUJBQXlCO0FBQUEsTUFDeEMscUJBQXFCLHlCQUF5QixtQkFBbUIsQ0FBQztBQUFBLE1BRWxFO0FBQUEsTUFDQSxlQUFlO0FBQUEsTUFDZjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsS0FDRixDQUNGO0FBQUEsRUFFSjtBQUVBLFNBQ0UsbURBQUM7QUFBQSxJQUNDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxLQUVBLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ2IsbURBQUM7QUFBQSxJQUNDLE1BQUs7QUFBQSxJQUNMLFdBQVcsK0JBQVc7QUFBQSxNQUNwQixxQkFBcUI7QUFBQSxNQUNyQixnQ0FBZ0M7QUFBQSxNQUNoQyxpQ0FBaUMsU0FBUztBQUFBLElBQzVDLENBQUM7QUFBQSxJQUNELFNBQVMsTUFBTSxRQUFRLHVCQUFZO0FBQUEsS0FFbEMsS0FBSyw4QkFBOEIsQ0FDdEMsR0FDQSxtREFBQztBQUFBLElBQ0MsTUFBSztBQUFBLElBQ0wsV0FBVywrQkFBVztBQUFBLE1BQ3BCLHFCQUFxQjtBQUFBLE1BQ3JCLG1DQUFtQztBQUFBLE1BQ25DLGlDQUNFLFNBQVMsaUNBQW1CLFNBQVM7QUFBQSxJQUN6QyxDQUFDO0FBQUEsSUFDRCxTQUFTLE1BQU0sUUFBUSw2QkFBZTtBQUFBLEtBRXJDLEtBQUssaUNBQWlDLENBQ3pDLEdBQ0EsbURBQUM7QUFBQSxJQUNDLE1BQUs7QUFBQSxJQUNMLFdBQVcsK0JBQVc7QUFBQSxNQUNwQixxQkFBcUI7QUFBQSxNQUNyQiw4QkFBOEI7QUFBQSxNQUM5QixpQ0FBaUMsU0FBUztBQUFBLElBQzVDLENBQUM7QUFBQSxJQUNELFNBQVMsTUFBTSxRQUFRLG1CQUFVO0FBQUEsS0FFaEMsS0FBSyw0QkFBNEIsQ0FDcEMsR0FDQSxtREFBQztBQUFBLElBQ0MsTUFBSztBQUFBLElBQ0wsV0FBVywrQkFBVztBQUFBLE1BQ3BCLHFCQUFxQjtBQUFBLE1BQ3JCLDhCQUE4QjtBQUFBLE1BQzlCLGlDQUFpQyxTQUFTO0FBQUEsSUFDNUMsQ0FBQztBQUFBLElBQ0QsU0FBUyxNQUFNLFFBQVEsbUJBQVU7QUFBQSxLQUVoQyxLQUFLLDRCQUE0QixDQUNwQyxHQUNBLG1EQUFDO0FBQUEsSUFDQyxNQUFLO0FBQUEsSUFDTCxXQUFXLCtCQUFXO0FBQUEsTUFDcEIscUJBQXFCO0FBQUEsTUFDckIsc0NBQXNDO0FBQUEsTUFDdEMsaUNBQWlDLFNBQVM7QUFBQSxJQUM1QyxDQUFDO0FBQUEsSUFDRCxTQUFTLE1BQU0sUUFBUSxtQ0FBa0I7QUFBQSxLQUV4QyxLQUFLLG9DQUFvQyxDQUM1QyxHQUNBLG1EQUFDO0FBQUEsSUFDQyxNQUFLO0FBQUEsSUFDTCxXQUFXLCtCQUFXO0FBQUEsTUFDcEIscUJBQXFCO0FBQUEsTUFDckIsZ0NBQWdDO0FBQUEsTUFDaEMsaUNBQWlDLFNBQVM7QUFBQSxJQUM1QyxDQUFDO0FBQUEsSUFDRCxTQUFTLE1BQU0sUUFBUSx1QkFBWTtBQUFBLEtBRWxDLEtBQUssOEJBQThCLENBQ3RDLENBQ0YsR0FDQSxtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQThCLFFBQVMsQ0FDeEQsQ0FDRjtBQUVKLEdBNTdCMkI7QUE4N0IzQixNQUFNLGNBQWMsd0JBQUM7QUFBQSxFQUNuQjtBQUFBLEVBQ0E7QUFBQSxNQUlpQjtBQUNqQixTQUNFLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDWixTQUFTLG1EQUFDO0FBQUEsSUFBRyxXQUFVO0FBQUEsS0FBd0IsS0FBTSxHQUNyRCxRQUNIO0FBRUosR0Fib0I7QUFlcEIsTUFBTSxVQUFVLHdCQUFDO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFLaUI7QUFDakIsUUFBTSxVQUNKLHdGQUNFLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FBNkIsSUFBSyxHQUNqRCxtREFBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQStCLEtBQU0sQ0FDdEQ7QUFHRixNQUFJLFNBQVM7QUFDWCxXQUNFLG1EQUFDO0FBQUEsTUFDQyxXQUFVO0FBQUEsTUFDVixNQUFLO0FBQUEsTUFDTDtBQUFBLE9BRUMsT0FDSDtBQUFBLEVBRUo7QUFFQSxTQUFPLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FBd0IsT0FBUTtBQUN4RCxHQTdCZ0I7QUErQmhCLHlCQUF5QixNQUFxQixhQUE2QjtBQUN6RSxTQUFPLFlBQVksWUFBWSxFQUFFLFdBQVcsU0FBUyxJQUNqRCxZQUFZLFFBQ1YsWUFDQSxLQUFLLHlDQUF5QyxDQUNoRCxJQUNBO0FBQ047QUFQUyIsCiAgIm5hbWVzIjogW10KfQo=
