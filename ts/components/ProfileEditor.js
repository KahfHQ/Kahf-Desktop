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
var ProfileEditor_exports = {};
__export(ProfileEditor_exports, {
  EditState: () => EditState,
  ProfileEditor: () => ProfileEditor
});
module.exports = __toCommonJS(ProfileEditor_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var log = __toESM(require("../logging/log"));
var import_Colors = require("../types/Colors");
var import_AvatarEditor = require("./AvatarEditor");
var import_AvatarPreview = require("./AvatarPreview");
var import_Button = require("./Button");
var import_ConfirmDiscardDialog = require("./ConfirmDiscardDialog");
var import_Emoji = require("./emoji/Emoji");
var import_EmojiButton = require("./emoji/EmojiButton");
var import_Input = require("./Input");
var import_Intl = require("./Intl");
var import_Modal = require("./Modal");
var import_PanelRow = require("./conversation/conversation-details/PanelRow");
var import_lib = require("./emoji/lib");
var import_missingCaseError = require("../util/missingCaseError");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_ConversationDetailsIcon = require("./conversation/conversation-details/ConversationDetailsIcon");
var import_Spinner = require("./Spinner");
var import_conversationsEnums = require("../state/ducks/conversationsEnums");
var import_Username = require("../types/Username");
var import_whitespaceStringUtil = require("../util/whitespaceStringUtil");
var import_Emojify = require("./conversation/Emojify");
var EditState = /* @__PURE__ */ ((EditState2) => {
  EditState2["None"] = "None";
  EditState2["BetterAvatar"] = "BetterAvatar";
  EditState2["ProfileName"] = "ProfileName";
  EditState2["Bio"] = "Bio";
  EditState2["Username"] = "Username";
  return EditState2;
})(EditState || {});
var UsernameEditState = /* @__PURE__ */ ((UsernameEditState2) => {
  UsernameEditState2["Editing"] = "Editing";
  UsernameEditState2["ConfirmingDelete"] = "ConfirmingDelete";
  UsernameEditState2["ShowingErrorPopup"] = "ShowingErrorPopup";
  UsernameEditState2["Saving"] = "Saving";
  return UsernameEditState2;
})(UsernameEditState || {});
const DEFAULT_BIOS = [
  {
    i18nLabel: "Bio--speak-freely",
    shortName: "wave"
  },
  {
    i18nLabel: "Bio--encrypted",
    shortName: "zipper_mouth_face"
  },
  {
    i18nLabel: "Bio--free-to-chat",
    shortName: "+1"
  },
  {
    i18nLabel: "Bio--coffee-lover",
    shortName: "coffee"
  },
  {
    i18nLabel: "Bio--taking-break",
    shortName: "mobile_phone_off"
  }
];
function getUsernameInvalidKey(username) {
  if (!username) {
    return void 0;
  }
  if (username.length < import_Username.MIN_USERNAME) {
    return {
      key: "ProfileEditor--username--check-character-min",
      replacements: { min: import_Username.MIN_USERNAME }
    };
  }
  if (!/^[0-9a-z_]+$/.test(username)) {
    return { key: "ProfileEditor--username--check-characters" };
  }
  if (!/^[a-z_]/.test(username)) {
    return { key: "ProfileEditor--username--check-starting-character" };
  }
  if (username.length > import_Username.MAX_USERNAME) {
    return {
      key: "ProfileEditor--username--check-character-max",
      replacements: { max: import_Username.MAX_USERNAME }
    };
  }
  return void 0;
}
function mapSaveStateToEditState({
  clearUsernameSave,
  i18n,
  setEditState,
  setUsernameEditState,
  setUsernameError,
  usernameSaveState
}) {
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.None) {
    return;
  }
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.Saving) {
    setUsernameEditState("Saving" /* Saving */);
    return;
  }
  clearUsernameSave();
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.Success) {
    setEditState("None" /* None */);
    setUsernameEditState("Editing" /* Editing */);
    return;
  }
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.UsernameMalformedError) {
    setUsernameEditState("Editing" /* Editing */);
    setUsernameError(i18n("ProfileEditor--username--check-characters"));
    return;
  }
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.UsernameTakenError) {
    setUsernameEditState("Editing" /* Editing */);
    setUsernameError(i18n("ProfileEditor--username--check-username-taken"));
    return;
  }
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.GeneralError) {
    setUsernameEditState("ShowingErrorPopup" /* ShowingErrorPopup */);
    return;
  }
  if (usernameSaveState === import_conversationsEnums.UsernameSaveState.DeleteFailed) {
    setUsernameEditState("Editing" /* Editing */);
    return;
  }
  const state = usernameSaveState;
  log.error(`ProfileEditor: useEffect username didn't handle usernameSaveState '${state})'`);
  setEditState("None" /* None */);
}
const ProfileEditor = /* @__PURE__ */ __name(({
  aboutEmoji,
  aboutText,
  profileAvatarPath,
  clearUsernameSave,
  color,
  conversationId,
  deleteAvatarFromDisk,
  familyName,
  firstName,
  i18n,
  isUsernameFlagEnabled,
  onEditStateChanged,
  onProfileChanged,
  onSetSkinTone,
  recentEmojis,
  replaceAvatar,
  saveAvatarToDisk,
  saveUsername,
  skinTone,
  userAvatarData,
  username,
  usernameSaveState
}) => {
  const focusInputRef = (0, import_react.useRef)(null);
  const [editState, setEditState] = (0, import_react.useState)("None" /* None */);
  const [confirmDiscardAction, setConfirmDiscardAction] = (0, import_react.useState)(void 0);
  const [fullName, setFullName] = (0, import_react.useState)({
    familyName,
    firstName
  });
  const [fullBio, setFullBio] = (0, import_react.useState)({
    aboutEmoji,
    aboutText
  });
  const [newUsername, setNewUsername] = (0, import_react.useState)(username);
  const [usernameError, setUsernameError] = (0, import_react.useState)();
  const [usernameEditState, setUsernameEditState] = (0, import_react.useState)("Editing" /* Editing */);
  const [startingAvatarPath, setStartingAvatarPath] = (0, import_react.useState)(profileAvatarPath);
  const [oldAvatarBuffer, setOldAvatarBuffer] = (0, import_react.useState)(void 0);
  const [avatarBuffer, setAvatarBuffer] = (0, import_react.useState)(void 0);
  const [isLoadingAvatar, setIsLoadingAvatar] = (0, import_react.useState)(Boolean(profileAvatarPath));
  const [stagedProfile, setStagedProfile] = (0, import_react.useState)({
    aboutEmoji,
    aboutText,
    familyName,
    firstName
  });
  const handleBack = (0, import_react.useCallback)(() => {
    setEditState("None" /* None */);
    onEditStateChanged("None" /* None */);
  }, [setEditState, onEditStateChanged]);
  const setAboutEmoji = (0, import_react.useCallback)((ev) => {
    const emojiData = (0, import_lib.getEmojiData)(ev.shortName, skinTone);
    setStagedProfile((profileData) => ({
      ...profileData,
      aboutEmoji: (0, import_lib.unifiedToEmoji)(emojiData.unified)
    }));
  }, [setStagedProfile, skinTone]);
  const handleAvatarChanged = (0, import_react.useCallback)((avatar) => {
    setStartingAvatarPath(void 0);
    setAvatarBuffer(avatar);
    setEditState("None" /* None */);
    onProfileChanged({
      ...stagedProfile,
      firstName: (0, import_whitespaceStringUtil.trim)(stagedProfile.firstName),
      familyName: stagedProfile.familyName ? (0, import_whitespaceStringUtil.trim)(stagedProfile.familyName) : void 0
    }, { oldAvatar: oldAvatarBuffer, newAvatar: avatar });
    setOldAvatarBuffer(avatar);
  }, [onProfileChanged, stagedProfile, oldAvatarBuffer]);
  const getFullNameText = /* @__PURE__ */ __name(() => {
    return [fullName.firstName, fullName.familyName].filter(Boolean).join(" ");
  }, "getFullNameText");
  (0, import_react.useEffect)(() => {
    const focusNode = focusInputRef.current;
    if (!focusNode) {
      return;
    }
    focusNode.focus();
    focusNode.setSelectionRange(focusNode.value.length, focusNode.value.length);
  }, [editState]);
  (0, import_react.useEffect)(() => {
    onEditStateChanged(editState);
  }, [editState, onEditStateChanged]);
  (0, import_react.useEffect)(() => {
    clearUsernameSave();
    return () => {
      clearUsernameSave();
    };
  });
  (0, import_react.useEffect)(() => {
    mapSaveStateToEditState({
      clearUsernameSave,
      i18n,
      setEditState,
      setUsernameEditState,
      setUsernameError,
      usernameSaveState
    });
  }, [
    clearUsernameSave,
    i18n,
    setEditState,
    setUsernameEditState,
    setUsernameError,
    usernameSaveState
  ]);
  (0, import_react.useEffect)(() => {
    setUsernameError(void 0);
    const timeout = setTimeout(() => {
      const key = getUsernameInvalidKey(newUsername);
      if (key) {
        setUsernameError(i18n(key.key, key.replacements));
      }
    }, 1e3);
    return () => {
      clearTimeout(timeout);
    };
  }, [newUsername, i18n, setUsernameError]);
  const isCurrentlySaving = usernameEditState === "Saving" /* Saving */;
  const shouldDisableUsernameSave = Boolean(newUsername === username || !newUsername || usernameError || isCurrentlySaving);
  const checkThenSaveUsername = /* @__PURE__ */ __name(() => {
    if (isCurrentlySaving) {
      log.error("checkThenSaveUsername: Already saving! Returning early");
      return;
    }
    if (shouldDisableUsernameSave) {
      return;
    }
    const invalidKey = getUsernameInvalidKey(newUsername);
    if (invalidKey) {
      setUsernameError(i18n(invalidKey.key, invalidKey.replacements));
      return;
    }
    setUsernameError(void 0);
    setUsernameEditState("Saving" /* Saving */);
    saveUsername({ username: newUsername, previousUsername: username });
  }, "checkThenSaveUsername");
  const deleteUsername = /* @__PURE__ */ __name(() => {
    if (isCurrentlySaving) {
      log.error("deleteUsername: Already saving! Returning early");
      return;
    }
    setNewUsername(void 0);
    setUsernameError(void 0);
    setUsernameEditState("Saving" /* Saving */);
    saveUsername({ username: void 0, previousUsername: username });
  }, "deleteUsername");
  const handleAvatarLoaded = (0, import_react.useCallback)((avatar) => {
    setAvatarBuffer(avatar);
    setOldAvatarBuffer(avatar);
    setIsLoadingAvatar(false);
  }, [setAvatarBuffer, setOldAvatarBuffer, setIsLoadingAvatar]);
  let content;
  if (editState === "BetterAvatar" /* BetterAvatar */) {
    content = /* @__PURE__ */ import_react.default.createElement(import_AvatarEditor.AvatarEditor, {
      avatarColor: color || import_Colors.AvatarColors[0],
      avatarPath: startingAvatarPath,
      avatarValue: avatarBuffer,
      conversationId,
      conversationTitle: getFullNameText(),
      deleteAvatarFromDisk,
      i18n,
      onCancel: handleBack,
      onSave: handleAvatarChanged,
      userAvatarData,
      replaceAvatar,
      saveAvatarToDisk
    });
  } else if (editState === "ProfileName" /* ProfileName */) {
    const shouldDisableSave = isLoadingAvatar || !stagedProfile.firstName || stagedProfile.firstName === fullName.firstName && stagedProfile.familyName === fullName.familyName || (0, import_whitespaceStringUtil.isWhitespace)(stagedProfile.firstName);
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
      i18n,
      maxLengthCount: 26,
      maxByteCount: 128,
      whenToShowRemainingCount: 0,
      onChange: (newFirstName) => {
        setStagedProfile((profileData) => ({
          ...profileData,
          firstName: String(newFirstName)
        }));
      },
      placeholder: i18n("ProfileEditor--first-name"),
      ref: focusInputRef,
      value: stagedProfile.firstName
    }), /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
      i18n,
      maxLengthCount: 26,
      maxByteCount: 128,
      whenToShowRemainingCount: 0,
      onChange: (newFamilyName) => {
        setStagedProfile((profileData) => ({
          ...profileData,
          familyName: newFamilyName
        }));
      },
      placeholder: i18n("ProfileEditor--last-name"),
      value: stagedProfile.familyName
    }), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: () => {
        const handleCancel = /* @__PURE__ */ __name(() => {
          handleBack();
          setStagedProfile((profileData) => ({
            ...profileData,
            familyName,
            firstName
          }));
        }, "handleCancel");
        const hasChanges = stagedProfile.familyName !== fullName.familyName || stagedProfile.firstName !== fullName.firstName;
        if (hasChanges) {
          setConfirmDiscardAction(() => handleCancel);
        } else {
          handleCancel();
        }
      },
      variant: import_Button.ButtonVariant.Secondary
    }, i18n("cancel")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: shouldDisableSave,
      onClick: () => {
        if (!stagedProfile.firstName) {
          return;
        }
        setFullName({
          firstName: stagedProfile.firstName,
          familyName: stagedProfile.familyName
        });
        onProfileChanged(stagedProfile, {
          oldAvatar: oldAvatarBuffer,
          newAvatar: avatarBuffer
        });
        handleBack();
      }
    }, i18n("save"))));
  } else if (editState === "Bio" /* Bio */) {
    const shouldDisableSave = isLoadingAvatar || stagedProfile.aboutText === fullBio.aboutText && stagedProfile.aboutEmoji === fullBio.aboutEmoji;
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
      expandable: true,
      hasClearButton: true,
      i18n,
      icon: /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-composition-area__button-cell"
      }, /* @__PURE__ */ import_react.default.createElement(import_EmojiButton.EmojiButton, {
        closeOnPick: true,
        emoji: stagedProfile.aboutEmoji,
        i18n,
        onPickEmoji: setAboutEmoji,
        onSetSkinTone,
        recentEmojis,
        skinTone
      })),
      maxLengthCount: 140,
      maxByteCount: 512,
      moduleClassName: "ProfileEditor__about-input",
      onChange: (value) => {
        if (value) {
          setStagedProfile((profileData) => ({
            ...profileData,
            aboutEmoji: stagedProfile.aboutEmoji,
            aboutText: value.replace(/(\r\n|\n|\r)/gm, "")
          }));
        } else {
          setStagedProfile((profileData) => ({
            ...profileData,
            aboutEmoji: void 0,
            aboutText: ""
          }));
        }
      },
      ref: focusInputRef,
      placeholder: i18n("ProfileEditor--about-placeholder"),
      value: stagedProfile.aboutText,
      whenToShowRemainingCount: 40
    }), DEFAULT_BIOS.map((defaultBio) => /* @__PURE__ */ import_react.default.createElement(import_PanelRow.PanelRow, {
      className: "ProfileEditor__row",
      key: defaultBio.shortName,
      icon: /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ProfileEditor__icon--container"
      }, /* @__PURE__ */ import_react.default.createElement(import_Emoji.Emoji, {
        shortName: defaultBio.shortName,
        size: 24
      })),
      label: i18n(defaultBio.i18nLabel),
      onClick: () => {
        const emojiData = (0, import_lib.getEmojiData)(defaultBio.shortName, skinTone);
        setStagedProfile((profileData) => ({
          ...profileData,
          aboutEmoji: (0, import_lib.unifiedToEmoji)(emojiData.unified),
          aboutText: i18n(defaultBio.i18nLabel)
        }));
      }
    })), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: () => {
        const handleCancel = /* @__PURE__ */ __name(() => {
          handleBack();
          setStagedProfile((profileData) => ({
            ...profileData,
            ...fullBio
          }));
        }, "handleCancel");
        const hasChanges = stagedProfile.aboutText !== fullBio.aboutText || stagedProfile.aboutEmoji !== fullBio.aboutEmoji;
        if (hasChanges) {
          setConfirmDiscardAction(() => handleCancel);
        } else {
          handleCancel();
        }
      },
      variant: import_Button.ButtonVariant.Secondary
    }, i18n("cancel")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: shouldDisableSave,
      onClick: () => {
        setFullBio({
          aboutEmoji: stagedProfile.aboutEmoji,
          aboutText: stagedProfile.aboutText
        });
        onProfileChanged(stagedProfile, {
          oldAvatar: oldAvatarBuffer,
          newAvatar: avatarBuffer
        });
        handleBack();
      }
    }, i18n("save"))));
  } else if (editState === "Username" /* Username */) {
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
      i18n,
      disabled: isCurrentlySaving,
      disableSpellcheck: true,
      onChange: (changedUsername) => {
        setUsernameError(void 0);
        setNewUsername(changedUsername);
      },
      onEnter: checkThenSaveUsername,
      placeholder: i18n("ProfileEditor--username--placeholder"),
      ref: focusInputRef,
      value: newUsername
    }), usernameError && /* @__PURE__ */ import_react.default.createElement("div", {
      className: "ProfileEditor__error"
    }, usernameError), /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("ProfileEditor__info", !usernameError ? "ProfileEditor__info--no-error" : void 0)
    }, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
      i18n,
      id: "ProfileEditor--username--helper"
    })), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: isCurrentlySaving,
      onClick: () => {
        const handleCancel = /* @__PURE__ */ __name(() => {
          handleBack();
          setNewUsername(username);
        }, "handleCancel");
        const hasChanges = newUsername !== username;
        if (hasChanges) {
          setConfirmDiscardAction(() => handleCancel);
        } else {
          handleCancel();
        }
      },
      variant: import_Button.ButtonVariant.Secondary
    }, i18n("cancel")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: shouldDisableUsernameSave,
      onClick: checkThenSaveUsername
    }, isCurrentlySaving ? /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      size: "20px",
      svgSize: "small",
      direction: "on-avatar"
    }) : i18n("save"))));
  } else if (editState === "None" /* None */) {
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_AvatarPreview.AvatarPreview, {
      avatarColor: color,
      avatarPath: startingAvatarPath,
      avatarValue: avatarBuffer,
      conversationTitle: getFullNameText(),
      i18n,
      isEditable: true,
      onAvatarLoaded: handleAvatarLoaded,
      onClick: () => {
        setEditState("BetterAvatar" /* BetterAvatar */);
      },
      style: {
        height: 80,
        width: 80
      }
    }), /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "ProfileEditor__divider"
    }), /* @__PURE__ */ import_react.default.createElement(import_PanelRow.PanelRow, {
      className: "ProfileEditor__row",
      icon: /* @__PURE__ */ import_react.default.createElement("i", {
        className: "ProfileEditor__icon--container ProfileEditor__icon ProfileEditor__icon--name"
      }),
      label: /* @__PURE__ */ import_react.default.createElement(import_Emojify.Emojify, {
        text: getFullNameText()
      }),
      onClick: () => {
        setEditState("ProfileName" /* ProfileName */);
      }
    }), isUsernameFlagEnabled ? /* @__PURE__ */ import_react.default.createElement(import_PanelRow.PanelRow, {
      className: "ProfileEditor__row",
      icon: /* @__PURE__ */ import_react.default.createElement("i", {
        className: "ProfileEditor__icon--container ProfileEditor__icon ProfileEditor__icon--username"
      }),
      label: username || i18n("ProfileEditor--username"),
      onClick: usernameEditState !== "Saving" /* Saving */ ? () => {
        setNewUsername(username);
        setEditState("Username" /* Username */);
      } : void 0,
      actions: username ? /* @__PURE__ */ import_react.default.createElement(import_ConversationDetailsIcon.ConversationDetailsIcon, {
        ariaLabel: i18n("ProfileEditor--username--delete-username"),
        icon: usernameEditState === "Saving" /* Saving */ ? import_ConversationDetailsIcon.IconType.spinner : import_ConversationDetailsIcon.IconType.trash,
        disabled: usernameEditState === "Saving" /* Saving */,
        fakeButton: true,
        onClick: () => {
          setUsernameEditState("ConfirmingDelete" /* ConfirmingDelete */);
        }
      }) : null
    }) : null, /* @__PURE__ */ import_react.default.createElement(import_PanelRow.PanelRow, {
      className: "ProfileEditor__row",
      icon: fullBio.aboutEmoji ? /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ProfileEditor__icon--container"
      }, /* @__PURE__ */ import_react.default.createElement(import_Emoji.Emoji, {
        emoji: fullBio.aboutEmoji,
        size: 24
      })) : /* @__PURE__ */ import_react.default.createElement("i", {
        className: "ProfileEditor__icon--container ProfileEditor__icon ProfileEditor__icon--bio"
      }),
      label: /* @__PURE__ */ import_react.default.createElement(import_Emojify.Emojify, {
        text: fullBio.aboutText || i18n("ProfileEditor--about")
      }),
      onClick: () => {
        setEditState("Bio" /* Bio */);
      }
    }), /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "ProfileEditor__divider"
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "ProfileEditor__info"
    }, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
      i18n,
      id: "ProfileEditor--info",
      components: {
        learnMore: /* @__PURE__ */ import_react.default.createElement("a", {
          href: "https://support.signal.org/hc/en-us/articles/360007459591",
          target: "_blank",
          rel: "noreferrer"
        }, i18n("ProfileEditor--learnMore"))
      }
    })));
  } else {
    throw (0, import_missingCaseError.missingCaseError)(editState);
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, usernameEditState === "ConfirmingDelete" /* ConfirmingDelete */ && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    i18n,
    onClose: () => setUsernameEditState("Editing" /* Editing */),
    actions: [
      {
        text: i18n("ProfileEditor--username--confirm-delete-button"),
        style: "negative",
        action: () => deleteUsername()
      }
    ]
  }, i18n("ProfileEditor--username--confirm-delete-body")), usernameEditState === "ShowingErrorPopup" /* ShowingErrorPopup */ && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    cancelText: i18n("ok"),
    cancelButtonVariant: import_Button.ButtonVariant.Secondary,
    i18n,
    onClose: () => setUsernameEditState("Editing" /* Editing */)
  }, i18n("ProfileEditor--username--general-error")), confirmDiscardAction && /* @__PURE__ */ import_react.default.createElement(import_ConfirmDiscardDialog.ConfirmDiscardDialog, {
    i18n,
    onDiscard: confirmDiscardAction,
    onClose: () => setConfirmDiscardAction(void 0)
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "ProfileEditor"
  }, content));
}, "ProfileEditor");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditState,
  ProfileEditor
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUHJvZmlsZUVkaXRvci50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QsIHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHR5cGUgeyBBdmF0YXJDb2xvclR5cGUgfSBmcm9tICcuLi90eXBlcy9Db2xvcnMnO1xuaW1wb3J0IHsgQXZhdGFyQ29sb3JzIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHtcbiAgQXZhdGFyRGF0YVR5cGUsXG4gIEF2YXRhclVwZGF0ZVR5cGUsXG4gIERlbGV0ZUF2YXRhckZyb21EaXNrQWN0aW9uVHlwZSxcbiAgUmVwbGFjZUF2YXRhckFjdGlvblR5cGUsXG4gIFNhdmVBdmF0YXJUb0Rpc2tBY3Rpb25UeXBlLFxufSBmcm9tICcuLi90eXBlcy9BdmF0YXInO1xuaW1wb3J0IHsgQXZhdGFyRWRpdG9yIH0gZnJvbSAnLi9BdmF0YXJFZGl0b3InO1xuaW1wb3J0IHsgQXZhdGFyUHJldmlldyB9IGZyb20gJy4vQXZhdGFyUHJldmlldyc7XG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuL0J1dHRvbic7XG5pbXBvcnQgeyBDb25maXJtRGlzY2FyZERpYWxvZyB9IGZyb20gJy4vQ29uZmlybURpc2NhcmREaWFsb2cnO1xuaW1wb3J0IHsgRW1vamkgfSBmcm9tICcuL2Vtb2ppL0Vtb2ppJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgRW1vamlCdXR0b25Qcm9wcyB9IGZyb20gJy4vZW1vamkvRW1vamlCdXR0b24nO1xuaW1wb3J0IHsgRW1vamlCdXR0b24gfSBmcm9tICcuL2Vtb2ppL0Vtb2ppQnV0dG9uJztcbmltcG9ydCB0eXBlIHsgRW1vamlQaWNrRGF0YVR5cGUgfSBmcm9tICcuL2Vtb2ppL0Vtb2ppUGlja2VyJztcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi9JbnB1dCc7XG5pbXBvcnQgeyBJbnRsIH0gZnJvbSAnLi9JbnRsJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSwgUmVwbGFjZW1lbnRWYWx1ZXNUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJy4vTW9kYWwnO1xuaW1wb3J0IHsgUGFuZWxSb3cgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9jb252ZXJzYXRpb24tZGV0YWlscy9QYW5lbFJvdyc7XG5pbXBvcnQgdHlwZSB7IFByb2ZpbGVEYXRhVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgZ2V0RW1vamlEYXRhLCB1bmlmaWVkVG9FbW9qaSB9IGZyb20gJy4vZW1vamkvbGliJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgQ29uZmlybWF0aW9uRGlhbG9nIH0gZnJvbSAnLi9Db25maXJtYXRpb25EaWFsb2cnO1xuaW1wb3J0IHtcbiAgQ29udmVyc2F0aW9uRGV0YWlsc0ljb24sXG4gIEljb25UeXBlLFxufSBmcm9tICcuL2NvbnZlcnNhdGlvbi9jb252ZXJzYXRpb24tZGV0YWlscy9Db252ZXJzYXRpb25EZXRhaWxzSWNvbic7XG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSAnLi9TcGlubmVyJztcbmltcG9ydCB7IFVzZXJuYW1lU2F2ZVN0YXRlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9uc0VudW1zJztcbmltcG9ydCB7IE1BWF9VU0VSTkFNRSwgTUlOX1VTRVJOQU1FIH0gZnJvbSAnLi4vdHlwZXMvVXNlcm5hbWUnO1xuaW1wb3J0IHsgaXNXaGl0ZXNwYWNlLCB0cmltIH0gZnJvbSAnLi4vdXRpbC93aGl0ZXNwYWNlU3RyaW5nVXRpbCc7XG5pbXBvcnQgeyBFbW9qaWZ5IH0gZnJvbSAnLi9jb252ZXJzYXRpb24vRW1vamlmeSc7XG5cbmV4cG9ydCBlbnVtIEVkaXRTdGF0ZSB7XG4gIE5vbmUgPSAnTm9uZScsXG4gIEJldHRlckF2YXRhciA9ICdCZXR0ZXJBdmF0YXInLFxuICBQcm9maWxlTmFtZSA9ICdQcm9maWxlTmFtZScsXG4gIEJpbyA9ICdCaW8nLFxuICBVc2VybmFtZSA9ICdVc2VybmFtZScsXG59XG5cbmVudW0gVXNlcm5hbWVFZGl0U3RhdGUge1xuICBFZGl0aW5nID0gJ0VkaXRpbmcnLFxuICBDb25maXJtaW5nRGVsZXRlID0gJ0NvbmZpcm1pbmdEZWxldGUnLFxuICBTaG93aW5nRXJyb3JQb3B1cCA9ICdTaG93aW5nRXJyb3JQb3B1cCcsXG4gIFNhdmluZyA9ICdTYXZpbmcnLFxufVxuXG50eXBlIFByb3BzRXh0ZXJuYWxUeXBlID0ge1xuICBvbkVkaXRTdGF0ZUNoYW5nZWQ6IChlZGl0U3RhdGU6IEVkaXRTdGF0ZSkgPT4gdW5rbm93bjtcbiAgb25Qcm9maWxlQ2hhbmdlZDogKFxuICAgIHByb2ZpbGVEYXRhOiBQcm9maWxlRGF0YVR5cGUsXG4gICAgYXZhdGFyOiBBdmF0YXJVcGRhdGVUeXBlXG4gICkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzRGF0YVR5cGUgPSB7XG4gIGFib3V0RW1vamk/OiBzdHJpbmc7XG4gIGFib3V0VGV4dD86IHN0cmluZztcbiAgcHJvZmlsZUF2YXRhclBhdGg/OiBzdHJpbmc7XG4gIGNvbG9yPzogQXZhdGFyQ29sb3JUeXBlO1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBmYW1pbHlOYW1lPzogc3RyaW5nO1xuICBmaXJzdE5hbWU6IHN0cmluZztcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgaXNVc2VybmFtZUZsYWdFbmFibGVkOiBib29sZWFuO1xuICB1c2VybmFtZVNhdmVTdGF0ZTogVXNlcm5hbWVTYXZlU3RhdGU7XG4gIHVzZXJBdmF0YXJEYXRhOiBBcnJheTxBdmF0YXJEYXRhVHlwZT47XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xufSAmIFBpY2s8RW1vamlCdXR0b25Qcm9wcywgJ3JlY2VudEVtb2ppcycgfCAnc2tpblRvbmUnPjtcblxudHlwZSBQcm9wc0FjdGlvblR5cGUgPSB7XG4gIGNsZWFyVXNlcm5hbWVTYXZlOiAoKSA9PiB1bmtub3duO1xuICBkZWxldGVBdmF0YXJGcm9tRGlzazogRGVsZXRlQXZhdGFyRnJvbURpc2tBY3Rpb25UeXBlO1xuICBvblNldFNraW5Ub25lOiAodG9uZTogbnVtYmVyKSA9PiB1bmtub3duO1xuICByZXBsYWNlQXZhdGFyOiBSZXBsYWNlQXZhdGFyQWN0aW9uVHlwZTtcbiAgc2F2ZUF2YXRhclRvRGlzazogU2F2ZUF2YXRhclRvRGlza0FjdGlvblR5cGU7XG4gIHNhdmVVc2VybmFtZTogKG9wdGlvbnM6IHtcbiAgICB1c2VybmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHByZXZpb3VzVXNlcm5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgfSkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IFByb3BzRGF0YVR5cGUgJiBQcm9wc0FjdGlvblR5cGUgJiBQcm9wc0V4dGVybmFsVHlwZTtcblxudHlwZSBEZWZhdWx0QmlvID0ge1xuICBpMThuTGFiZWw6IHN0cmluZztcbiAgc2hvcnROYW1lOiBzdHJpbmc7XG59O1xuXG5jb25zdCBERUZBVUxUX0JJT1M6IEFycmF5PERlZmF1bHRCaW8+ID0gW1xuICB7XG4gICAgaTE4bkxhYmVsOiAnQmlvLS1zcGVhay1mcmVlbHknLFxuICAgIHNob3J0TmFtZTogJ3dhdmUnLFxuICB9LFxuICB7XG4gICAgaTE4bkxhYmVsOiAnQmlvLS1lbmNyeXB0ZWQnLFxuICAgIHNob3J0TmFtZTogJ3ppcHBlcl9tb3V0aF9mYWNlJyxcbiAgfSxcbiAge1xuICAgIGkxOG5MYWJlbDogJ0Jpby0tZnJlZS10by1jaGF0JyxcbiAgICBzaG9ydE5hbWU6ICcrMScsXG4gIH0sXG4gIHtcbiAgICBpMThuTGFiZWw6ICdCaW8tLWNvZmZlZS1sb3ZlcicsXG4gICAgc2hvcnROYW1lOiAnY29mZmVlJyxcbiAgfSxcbiAge1xuICAgIGkxOG5MYWJlbDogJ0Jpby0tdGFraW5nLWJyZWFrJyxcbiAgICBzaG9ydE5hbWU6ICdtb2JpbGVfcGhvbmVfb2ZmJyxcbiAgfSxcbl07XG5cbmZ1bmN0aW9uIGdldFVzZXJuYW1lSW52YWxpZEtleShcbiAgdXNlcm5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogeyBrZXk6IHN0cmluZzsgcmVwbGFjZW1lbnRzPzogUmVwbGFjZW1lbnRWYWx1ZXNUeXBlIH0gfCB1bmRlZmluZWQge1xuICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1c2VybmFtZS5sZW5ndGggPCBNSU5fVVNFUk5BTUUpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5OiAnUHJvZmlsZUVkaXRvci0tdXNlcm5hbWUtLWNoZWNrLWNoYXJhY3Rlci1taW4nLFxuICAgICAgcmVwbGFjZW1lbnRzOiB7IG1pbjogTUlOX1VTRVJOQU1FIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmICghL15bMC05YS16X10rJC8udGVzdCh1c2VybmFtZSkpIHtcbiAgICByZXR1cm4geyBrZXk6ICdQcm9maWxlRWRpdG9yLS11c2VybmFtZS0tY2hlY2stY2hhcmFjdGVycycgfTtcbiAgfVxuICBpZiAoIS9eW2Etel9dLy50ZXN0KHVzZXJuYW1lKSkge1xuICAgIHJldHVybiB7IGtleTogJ1Byb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1jaGVjay1zdGFydGluZy1jaGFyYWN0ZXInIH07XG4gIH1cblxuICBpZiAodXNlcm5hbWUubGVuZ3RoID4gTUFYX1VTRVJOQU1FKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogJ1Byb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1jaGVjay1jaGFyYWN0ZXItbWF4JyxcbiAgICAgIHJlcGxhY2VtZW50czogeyBtYXg6IE1BWF9VU0VSTkFNRSB9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBtYXBTYXZlU3RhdGVUb0VkaXRTdGF0ZSh7XG4gIGNsZWFyVXNlcm5hbWVTYXZlLFxuICBpMThuLFxuICBzZXRFZGl0U3RhdGUsXG4gIHNldFVzZXJuYW1lRWRpdFN0YXRlLFxuICBzZXRVc2VybmFtZUVycm9yLFxuICB1c2VybmFtZVNhdmVTdGF0ZSxcbn06IHtcbiAgY2xlYXJVc2VybmFtZVNhdmU6ICgpID0+IHVua25vd247XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIHNldEVkaXRTdGF0ZTogKHN0YXRlOiBFZGl0U3RhdGUpID0+IHVua25vd247XG4gIHNldFVzZXJuYW1lRWRpdFN0YXRlOiAoc3RhdGU6IFVzZXJuYW1lRWRpdFN0YXRlKSA9PiB1bmtub3duO1xuICBzZXRVc2VybmFtZUVycm9yOiAoZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd247XG4gIHVzZXJuYW1lU2F2ZVN0YXRlOiBVc2VybmFtZVNhdmVTdGF0ZTtcbn0pOiB2b2lkIHtcbiAgaWYgKHVzZXJuYW1lU2F2ZVN0YXRlID09PSBVc2VybmFtZVNhdmVTdGF0ZS5Ob25lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh1c2VybmFtZVNhdmVTdGF0ZSA9PT0gVXNlcm5hbWVTYXZlU3RhdGUuU2F2aW5nKSB7XG4gICAgc2V0VXNlcm5hbWVFZGl0U3RhdGUoVXNlcm5hbWVFZGl0U3RhdGUuU2F2aW5nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjbGVhclVzZXJuYW1lU2F2ZSgpO1xuXG4gIGlmICh1c2VybmFtZVNhdmVTdGF0ZSA9PT0gVXNlcm5hbWVTYXZlU3RhdGUuU3VjY2Vzcykge1xuICAgIHNldEVkaXRTdGF0ZShFZGl0U3RhdGUuTm9uZSk7XG4gICAgc2V0VXNlcm5hbWVFZGl0U3RhdGUoVXNlcm5hbWVFZGl0U3RhdGUuRWRpdGluZyk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodXNlcm5hbWVTYXZlU3RhdGUgPT09IFVzZXJuYW1lU2F2ZVN0YXRlLlVzZXJuYW1lTWFsZm9ybWVkRXJyb3IpIHtcbiAgICBzZXRVc2VybmFtZUVkaXRTdGF0ZShVc2VybmFtZUVkaXRTdGF0ZS5FZGl0aW5nKTtcbiAgICBzZXRVc2VybmFtZUVycm9yKGkxOG4oJ1Byb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1jaGVjay1jaGFyYWN0ZXJzJykpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodXNlcm5hbWVTYXZlU3RhdGUgPT09IFVzZXJuYW1lU2F2ZVN0YXRlLlVzZXJuYW1lVGFrZW5FcnJvcikge1xuICAgIHNldFVzZXJuYW1lRWRpdFN0YXRlKFVzZXJuYW1lRWRpdFN0YXRlLkVkaXRpbmcpO1xuICAgIHNldFVzZXJuYW1lRXJyb3IoaTE4bignUHJvZmlsZUVkaXRvci0tdXNlcm5hbWUtLWNoZWNrLXVzZXJuYW1lLXRha2VuJykpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodXNlcm5hbWVTYXZlU3RhdGUgPT09IFVzZXJuYW1lU2F2ZVN0YXRlLkdlbmVyYWxFcnJvcikge1xuICAgIHNldFVzZXJuYW1lRWRpdFN0YXRlKFVzZXJuYW1lRWRpdFN0YXRlLlNob3dpbmdFcnJvclBvcHVwKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHVzZXJuYW1lU2F2ZVN0YXRlID09PSBVc2VybmFtZVNhdmVTdGF0ZS5EZWxldGVGYWlsZWQpIHtcbiAgICBzZXRVc2VybmFtZUVkaXRTdGF0ZShVc2VybmFtZUVkaXRTdGF0ZS5FZGl0aW5nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGF0ZTogbmV2ZXIgPSB1c2VybmFtZVNhdmVTdGF0ZTtcbiAgbG9nLmVycm9yKFxuICAgIGBQcm9maWxlRWRpdG9yOiB1c2VFZmZlY3QgdXNlcm5hbWUgZGlkbid0IGhhbmRsZSB1c2VybmFtZVNhdmVTdGF0ZSAnJHtzdGF0ZX0pJ2BcbiAgKTtcbiAgc2V0RWRpdFN0YXRlKEVkaXRTdGF0ZS5Ob25lKTtcbn1cblxuZXhwb3J0IGNvbnN0IFByb2ZpbGVFZGl0b3IgPSAoe1xuICBhYm91dEVtb2ppLFxuICBhYm91dFRleHQsXG4gIHByb2ZpbGVBdmF0YXJQYXRoLFxuICBjbGVhclVzZXJuYW1lU2F2ZSxcbiAgY29sb3IsXG4gIGNvbnZlcnNhdGlvbklkLFxuICBkZWxldGVBdmF0YXJGcm9tRGlzayxcbiAgZmFtaWx5TmFtZSxcbiAgZmlyc3ROYW1lLFxuICBpMThuLFxuICBpc1VzZXJuYW1lRmxhZ0VuYWJsZWQsXG4gIG9uRWRpdFN0YXRlQ2hhbmdlZCxcbiAgb25Qcm9maWxlQ2hhbmdlZCxcbiAgb25TZXRTa2luVG9uZSxcbiAgcmVjZW50RW1vamlzLFxuICByZXBsYWNlQXZhdGFyLFxuICBzYXZlQXZhdGFyVG9EaXNrLFxuICBzYXZlVXNlcm5hbWUsXG4gIHNraW5Ub25lLFxuICB1c2VyQXZhdGFyRGF0YSxcbiAgdXNlcm5hbWUsXG4gIHVzZXJuYW1lU2F2ZVN0YXRlLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBmb2N1c0lucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2VkaXRTdGF0ZSwgc2V0RWRpdFN0YXRlXSA9IHVzZVN0YXRlPEVkaXRTdGF0ZT4oRWRpdFN0YXRlLk5vbmUpO1xuICBjb25zdCBbY29uZmlybURpc2NhcmRBY3Rpb24sIHNldENvbmZpcm1EaXNjYXJkQWN0aW9uXSA9IHVzZVN0YXRlPFxuICAgICgoKSA9PiB1bmtub3duKSB8IHVuZGVmaW5lZFxuICA+KHVuZGVmaW5lZCk7XG5cbiAgLy8gVGhpcyBpcyBoZXJlIHRvIGF2b2lkIGNvbXBvbmVudCByZS1yZW5kZXIgaml0dGVycyBpbiB0aGUgdGltZSBpdCB0YWtlc1xuICAvLyByZWR1eCB0byBjb21lIGJhY2sgd2l0aCB0aGUgY29ycmVjdCBzdGF0ZVxuICBjb25zdCBbZnVsbE5hbWUsIHNldEZ1bGxOYW1lXSA9IHVzZVN0YXRlKHtcbiAgICBmYW1pbHlOYW1lLFxuICAgIGZpcnN0TmFtZSxcbiAgfSk7XG4gIGNvbnN0IFtmdWxsQmlvLCBzZXRGdWxsQmlvXSA9IHVzZVN0YXRlKHtcbiAgICBhYm91dEVtb2ppLFxuICAgIGFib3V0VGV4dCxcbiAgfSk7XG4gIGNvbnN0IFtuZXdVc2VybmFtZSwgc2V0TmV3VXNlcm5hbWVdID0gdXNlU3RhdGU8c3RyaW5nIHwgdW5kZWZpbmVkPih1c2VybmFtZSk7XG4gIGNvbnN0IFt1c2VybmFtZUVycm9yLCBzZXRVc2VybmFtZUVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgW3VzZXJuYW1lRWRpdFN0YXRlLCBzZXRVc2VybmFtZUVkaXRTdGF0ZV0gPSB1c2VTdGF0ZTxVc2VybmFtZUVkaXRTdGF0ZT4oXG4gICAgVXNlcm5hbWVFZGl0U3RhdGUuRWRpdGluZ1xuICApO1xuXG4gIGNvbnN0IFtzdGFydGluZ0F2YXRhclBhdGgsIHNldFN0YXJ0aW5nQXZhdGFyUGF0aF0gPVxuICAgIHVzZVN0YXRlKHByb2ZpbGVBdmF0YXJQYXRoKTtcblxuICBjb25zdCBbb2xkQXZhdGFyQnVmZmVyLCBzZXRPbGRBdmF0YXJCdWZmZXJdID0gdXNlU3RhdGU8XG4gICAgVWludDhBcnJheSB8IHVuZGVmaW5lZFxuICA+KHVuZGVmaW5lZCk7XG4gIGNvbnN0IFthdmF0YXJCdWZmZXIsIHNldEF2YXRhckJ1ZmZlcl0gPSB1c2VTdGF0ZTxVaW50OEFycmF5IHwgdW5kZWZpbmVkPihcbiAgICB1bmRlZmluZWRcbiAgKTtcbiAgY29uc3QgW2lzTG9hZGluZ0F2YXRhciwgc2V0SXNMb2FkaW5nQXZhdGFyXSA9IHVzZVN0YXRlKFxuICAgIEJvb2xlYW4ocHJvZmlsZUF2YXRhclBhdGgpXG4gICk7XG4gIGNvbnN0IFtzdGFnZWRQcm9maWxlLCBzZXRTdGFnZWRQcm9maWxlXSA9IHVzZVN0YXRlPFByb2ZpbGVEYXRhVHlwZT4oe1xuICAgIGFib3V0RW1vamksXG4gICAgYWJvdXRUZXh0LFxuICAgIGZhbWlseU5hbWUsXG4gICAgZmlyc3ROYW1lLFxuICB9KTtcblxuICAvLyBUbyBtYWtlIEF2YXRhckVkaXRvciByZS1yZW5kZXIgbGVzcyBvZnRlblxuICBjb25zdCBoYW5kbGVCYWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEVkaXRTdGF0ZShFZGl0U3RhdGUuTm9uZSk7XG4gICAgb25FZGl0U3RhdGVDaGFuZ2VkKEVkaXRTdGF0ZS5Ob25lKTtcbiAgfSwgW3NldEVkaXRTdGF0ZSwgb25FZGl0U3RhdGVDaGFuZ2VkXSk7XG5cbiAgLy8gVG8gbWFrZSBFbW9qaUJ1dHRvbiByZS1yZW5kZXIgbGVzcyBvZnRlblxuICBjb25zdCBzZXRBYm91dEVtb2ppID0gdXNlQ2FsbGJhY2soXG4gICAgKGV2OiBFbW9qaVBpY2tEYXRhVHlwZSkgPT4ge1xuICAgICAgY29uc3QgZW1vamlEYXRhID0gZ2V0RW1vamlEYXRhKGV2LnNob3J0TmFtZSwgc2tpblRvbmUpO1xuICAgICAgc2V0U3RhZ2VkUHJvZmlsZShwcm9maWxlRGF0YSA9PiAoe1xuICAgICAgICAuLi5wcm9maWxlRGF0YSxcbiAgICAgICAgYWJvdXRFbW9qaTogdW5pZmllZFRvRW1vamkoZW1vamlEYXRhLnVuaWZpZWQpLFxuICAgICAgfSkpO1xuICAgIH0sXG4gICAgW3NldFN0YWdlZFByb2ZpbGUsIHNraW5Ub25lXVxuICApO1xuXG4gIC8vIFRvIG1ha2UgQXZhdGFyRWRpdG9yIHJlLXJlbmRlciBsZXNzIG9mdGVuXG4gIGNvbnN0IGhhbmRsZUF2YXRhckNoYW5nZWQgPSB1c2VDYWxsYmFjayhcbiAgICAoYXZhdGFyOiBVaW50OEFycmF5IHwgdW5kZWZpbmVkKSA9PiB7XG4gICAgICAvLyBEbyBub3QgZGlzcGxheSBzdGFsZSBhdmF0YXIgZnJvbSBkaXNrIGFueW1vcmUuXG4gICAgICBzZXRTdGFydGluZ0F2YXRhclBhdGgodW5kZWZpbmVkKTtcblxuICAgICAgc2V0QXZhdGFyQnVmZmVyKGF2YXRhcik7XG4gICAgICBzZXRFZGl0U3RhdGUoRWRpdFN0YXRlLk5vbmUpO1xuICAgICAgb25Qcm9maWxlQ2hhbmdlZChcbiAgICAgICAge1xuICAgICAgICAgIC4uLnN0YWdlZFByb2ZpbGUsXG4gICAgICAgICAgZmlyc3ROYW1lOiB0cmltKHN0YWdlZFByb2ZpbGUuZmlyc3ROYW1lKSxcbiAgICAgICAgICBmYW1pbHlOYW1lOiBzdGFnZWRQcm9maWxlLmZhbWlseU5hbWVcbiAgICAgICAgICAgID8gdHJpbShzdGFnZWRQcm9maWxlLmZhbWlseU5hbWUpXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbGRBdmF0YXI6IG9sZEF2YXRhckJ1ZmZlciwgbmV3QXZhdGFyOiBhdmF0YXIgfVxuICAgICAgKTtcbiAgICAgIHNldE9sZEF2YXRhckJ1ZmZlcihhdmF0YXIpO1xuICAgIH0sXG4gICAgW29uUHJvZmlsZUNoYW5nZWQsIHN0YWdlZFByb2ZpbGUsIG9sZEF2YXRhckJ1ZmZlcl1cbiAgKTtcblxuICBjb25zdCBnZXRGdWxsTmFtZVRleHQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFtmdWxsTmFtZS5maXJzdE5hbWUsIGZ1bGxOYW1lLmZhbWlseU5hbWVdLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBmb2N1c05vZGUgPSBmb2N1c0lucHV0UmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFmb2N1c05vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb2N1c05vZGUuZm9jdXMoKTtcbiAgICBmb2N1c05vZGUuc2V0U2VsZWN0aW9uUmFuZ2UoZm9jdXNOb2RlLnZhbHVlLmxlbmd0aCwgZm9jdXNOb2RlLnZhbHVlLmxlbmd0aCk7XG4gIH0sIFtlZGl0U3RhdGVdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIG9uRWRpdFN0YXRlQ2hhbmdlZChlZGl0U3RhdGUpO1xuICB9LCBbZWRpdFN0YXRlLCBvbkVkaXRTdGF0ZUNoYW5nZWRdKTtcblxuICAvLyBJZiB0aGVyZSdzIHNvbWUgaW4tcHJvY2VzcyB1c2VybmFtZSBzYXZlLCBvciBqdXN0IGFuIHVuYWNrbm93bGVkZ2VkIHNhdmVcbiAgLy8gICBjb21wbGV0aW9uL2Vycm9yLCB3ZSBjbGVhciBpdCBvdXQgb24gbW91bnQsIGFuZCB0aGVuIGFnYWluIG9uIHVubW91bnQuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY2xlYXJVc2VybmFtZVNhdmUoKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhclVzZXJuYW1lU2F2ZSgpO1xuICAgIH07XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbWFwU2F2ZVN0YXRlVG9FZGl0U3RhdGUoe1xuICAgICAgY2xlYXJVc2VybmFtZVNhdmUsXG4gICAgICBpMThuLFxuICAgICAgc2V0RWRpdFN0YXRlLFxuICAgICAgc2V0VXNlcm5hbWVFZGl0U3RhdGUsXG4gICAgICBzZXRVc2VybmFtZUVycm9yLFxuICAgICAgdXNlcm5hbWVTYXZlU3RhdGUsXG4gICAgfSk7XG4gIH0sIFtcbiAgICBjbGVhclVzZXJuYW1lU2F2ZSxcbiAgICBpMThuLFxuICAgIHNldEVkaXRTdGF0ZSxcbiAgICBzZXRVc2VybmFtZUVkaXRTdGF0ZSxcbiAgICBzZXRVc2VybmFtZUVycm9yLFxuICAgIHVzZXJuYW1lU2F2ZVN0YXRlLFxuICBdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdoZW5ldmVyIHRoZSB1c2VyIG1ha2VzIGEgY2hhbmdlLCB3ZSdsbCBnZXQgcmlkIG9mIHRoZSByZWQgZXJyb3IgdGV4dFxuICAgIHNldFVzZXJuYW1lRXJyb3IodW5kZWZpbmVkKTtcblxuICAgIC8vIEFuZCB0aGVuIHdlJ2xsIGNoZWNrIHRoZSB2YWxpZGl0eSBvZiB0aGF0IG5ldyB1c2VybmFtZVxuICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGdldFVzZXJuYW1lSW52YWxpZEtleShuZXdVc2VybmFtZSk7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNldFVzZXJuYW1lRXJyb3IoaTE4bihrZXkua2V5LCBrZXkucmVwbGFjZW1lbnRzKSk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9O1xuICB9LCBbbmV3VXNlcm5hbWUsIGkxOG4sIHNldFVzZXJuYW1lRXJyb3JdKTtcblxuICBjb25zdCBpc0N1cnJlbnRseVNhdmluZyA9IHVzZXJuYW1lRWRpdFN0YXRlID09PSBVc2VybmFtZUVkaXRTdGF0ZS5TYXZpbmc7XG4gIGNvbnN0IHNob3VsZERpc2FibGVVc2VybmFtZVNhdmUgPSBCb29sZWFuKFxuICAgIG5ld1VzZXJuYW1lID09PSB1c2VybmFtZSB8fFxuICAgICAgIW5ld1VzZXJuYW1lIHx8XG4gICAgICB1c2VybmFtZUVycm9yIHx8XG4gICAgICBpc0N1cnJlbnRseVNhdmluZ1xuICApO1xuXG4gIGNvbnN0IGNoZWNrVGhlblNhdmVVc2VybmFtZSA9ICgpID0+IHtcbiAgICBpZiAoaXNDdXJyZW50bHlTYXZpbmcpIHtcbiAgICAgIGxvZy5lcnJvcignY2hlY2tUaGVuU2F2ZVVzZXJuYW1lOiBBbHJlYWR5IHNhdmluZyEgUmV0dXJuaW5nIGVhcmx5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZERpc2FibGVVc2VybmFtZVNhdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbnZhbGlkS2V5ID0gZ2V0VXNlcm5hbWVJbnZhbGlkS2V5KG5ld1VzZXJuYW1lKTtcbiAgICBpZiAoaW52YWxpZEtleSkge1xuICAgICAgc2V0VXNlcm5hbWVFcnJvcihpMThuKGludmFsaWRLZXkua2V5LCBpbnZhbGlkS2V5LnJlcGxhY2VtZW50cykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldFVzZXJuYW1lRXJyb3IodW5kZWZpbmVkKTtcbiAgICBzZXRVc2VybmFtZUVkaXRTdGF0ZShVc2VybmFtZUVkaXRTdGF0ZS5TYXZpbmcpO1xuICAgIHNhdmVVc2VybmFtZSh7IHVzZXJuYW1lOiBuZXdVc2VybmFtZSwgcHJldmlvdXNVc2VybmFtZTogdXNlcm5hbWUgfSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVXNlcm5hbWUgPSAoKSA9PiB7XG4gICAgaWYgKGlzQ3VycmVudGx5U2F2aW5nKSB7XG4gICAgICBsb2cuZXJyb3IoJ2RlbGV0ZVVzZXJuYW1lOiBBbHJlYWR5IHNhdmluZyEgUmV0dXJuaW5nIGVhcmx5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0TmV3VXNlcm5hbWUodW5kZWZpbmVkKTtcbiAgICBzZXRVc2VybmFtZUVycm9yKHVuZGVmaW5lZCk7XG4gICAgc2V0VXNlcm5hbWVFZGl0U3RhdGUoVXNlcm5hbWVFZGl0U3RhdGUuU2F2aW5nKTtcbiAgICBzYXZlVXNlcm5hbWUoeyB1c2VybmFtZTogdW5kZWZpbmVkLCBwcmV2aW91c1VzZXJuYW1lOiB1c2VybmFtZSB9KTtcbiAgfTtcblxuICAvLyBUbyBtYWtlIEF2YXRhckVkaXRvciByZS1yZW5kZXIgbGVzcyBvZnRlblxuICBjb25zdCBoYW5kbGVBdmF0YXJMb2FkZWQgPSB1c2VDYWxsYmFjayhcbiAgICBhdmF0YXIgPT4ge1xuICAgICAgc2V0QXZhdGFyQnVmZmVyKGF2YXRhcik7XG4gICAgICBzZXRPbGRBdmF0YXJCdWZmZXIoYXZhdGFyKTtcbiAgICAgIHNldElzTG9hZGluZ0F2YXRhcihmYWxzZSk7XG4gICAgfSxcbiAgICBbc2V0QXZhdGFyQnVmZmVyLCBzZXRPbGRBdmF0YXJCdWZmZXIsIHNldElzTG9hZGluZ0F2YXRhcl1cbiAgKTtcblxuICBsZXQgY29udGVudDogSlNYLkVsZW1lbnQ7XG5cbiAgaWYgKGVkaXRTdGF0ZSA9PT0gRWRpdFN0YXRlLkJldHRlckF2YXRhcikge1xuICAgIGNvbnRlbnQgPSAoXG4gICAgICA8QXZhdGFyRWRpdG9yXG4gICAgICAgIGF2YXRhckNvbG9yPXtjb2xvciB8fCBBdmF0YXJDb2xvcnNbMF19XG4gICAgICAgIGF2YXRhclBhdGg9e3N0YXJ0aW5nQXZhdGFyUGF0aH1cbiAgICAgICAgYXZhdGFyVmFsdWU9e2F2YXRhckJ1ZmZlcn1cbiAgICAgICAgY29udmVyc2F0aW9uSWQ9e2NvbnZlcnNhdGlvbklkfVxuICAgICAgICBjb252ZXJzYXRpb25UaXRsZT17Z2V0RnVsbE5hbWVUZXh0KCl9XG4gICAgICAgIGRlbGV0ZUF2YXRhckZyb21EaXNrPXtkZWxldGVBdmF0YXJGcm9tRGlza31cbiAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgb25DYW5jZWw9e2hhbmRsZUJhY2t9XG4gICAgICAgIG9uU2F2ZT17aGFuZGxlQXZhdGFyQ2hhbmdlZH1cbiAgICAgICAgdXNlckF2YXRhckRhdGE9e3VzZXJBdmF0YXJEYXRhfVxuICAgICAgICByZXBsYWNlQXZhdGFyPXtyZXBsYWNlQXZhdGFyfVxuICAgICAgICBzYXZlQXZhdGFyVG9EaXNrPXtzYXZlQXZhdGFyVG9EaXNrfVxuICAgICAgLz5cbiAgICApO1xuICB9IGVsc2UgaWYgKGVkaXRTdGF0ZSA9PT0gRWRpdFN0YXRlLlByb2ZpbGVOYW1lKSB7XG4gICAgY29uc3Qgc2hvdWxkRGlzYWJsZVNhdmUgPVxuICAgICAgaXNMb2FkaW5nQXZhdGFyIHx8XG4gICAgICAhc3RhZ2VkUHJvZmlsZS5maXJzdE5hbWUgfHxcbiAgICAgIChzdGFnZWRQcm9maWxlLmZpcnN0TmFtZSA9PT0gZnVsbE5hbWUuZmlyc3ROYW1lICYmXG4gICAgICAgIHN0YWdlZFByb2ZpbGUuZmFtaWx5TmFtZSA9PT0gZnVsbE5hbWUuZmFtaWx5TmFtZSkgfHxcbiAgICAgIGlzV2hpdGVzcGFjZShzdGFnZWRQcm9maWxlLmZpcnN0TmFtZSk7XG5cbiAgICBjb250ZW50ID0gKFxuICAgICAgPD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtYXhMZW5ndGhDb3VudD17MjZ9XG4gICAgICAgICAgbWF4Qnl0ZUNvdW50PXsxMjh9XG4gICAgICAgICAgd2hlblRvU2hvd1JlbWFpbmluZ0NvdW50PXswfVxuICAgICAgICAgIG9uQ2hhbmdlPXtuZXdGaXJzdE5hbWUgPT4ge1xuICAgICAgICAgICAgc2V0U3RhZ2VkUHJvZmlsZShwcm9maWxlRGF0YSA9PiAoe1xuICAgICAgICAgICAgICAuLi5wcm9maWxlRGF0YSxcbiAgICAgICAgICAgICAgZmlyc3ROYW1lOiBTdHJpbmcobmV3Rmlyc3ROYW1lKSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuKCdQcm9maWxlRWRpdG9yLS1maXJzdC1uYW1lJyl9XG4gICAgICAgICAgcmVmPXtmb2N1c0lucHV0UmVmfVxuICAgICAgICAgIHZhbHVlPXtzdGFnZWRQcm9maWxlLmZpcnN0TmFtZX1cbiAgICAgICAgLz5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtYXhMZW5ndGhDb3VudD17MjZ9XG4gICAgICAgICAgbWF4Qnl0ZUNvdW50PXsxMjh9XG4gICAgICAgICAgd2hlblRvU2hvd1JlbWFpbmluZ0NvdW50PXswfVxuICAgICAgICAgIG9uQ2hhbmdlPXtuZXdGYW1pbHlOYW1lID0+IHtcbiAgICAgICAgICAgIHNldFN0YWdlZFByb2ZpbGUocHJvZmlsZURhdGEgPT4gKHtcbiAgICAgICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgICAgICAgIGZhbWlseU5hbWU6IG5ld0ZhbWlseU5hbWUsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bignUHJvZmlsZUVkaXRvci0tbGFzdC1uYW1lJyl9XG4gICAgICAgICAgdmFsdWU9e3N0YWdlZFByb2ZpbGUuZmFtaWx5TmFtZX1cbiAgICAgICAgLz5cbiAgICAgICAgPE1vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGhhbmRsZUNhbmNlbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVCYWNrKCk7XG4gICAgICAgICAgICAgICAgc2V0U3RhZ2VkUHJvZmlsZShwcm9maWxlRGF0YSA9PiAoe1xuICAgICAgICAgICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgICAgICAgICAgICBmYW1pbHlOYW1lLFxuICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBjb25zdCBoYXNDaGFuZ2VzID1cbiAgICAgICAgICAgICAgICBzdGFnZWRQcm9maWxlLmZhbWlseU5hbWUgIT09IGZ1bGxOYW1lLmZhbWlseU5hbWUgfHxcbiAgICAgICAgICAgICAgICBzdGFnZWRQcm9maWxlLmZpcnN0TmFtZSAhPT0gZnVsbE5hbWUuZmlyc3ROYW1lO1xuICAgICAgICAgICAgICBpZiAoaGFzQ2hhbmdlcykge1xuICAgICAgICAgICAgICAgIHNldENvbmZpcm1EaXNjYXJkQWN0aW9uKCgpID0+IGhhbmRsZUNhbmNlbCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlQ2FuY2VsKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlNlY29uZGFyeX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignY2FuY2VsJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGlzYWJsZWQ9e3Nob3VsZERpc2FibGVTYXZlfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXN0YWdlZFByb2ZpbGUuZmlyc3ROYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNldEZ1bGxOYW1lKHtcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IHN0YWdlZFByb2ZpbGUuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgIGZhbWlseU5hbWU6IHN0YWdlZFByb2ZpbGUuZmFtaWx5TmFtZSxcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgb25Qcm9maWxlQ2hhbmdlZChzdGFnZWRQcm9maWxlLCB7XG4gICAgICAgICAgICAgICAgb2xkQXZhdGFyOiBvbGRBdmF0YXJCdWZmZXIsXG4gICAgICAgICAgICAgICAgbmV3QXZhdGFyOiBhdmF0YXJCdWZmZXIsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBoYW5kbGVCYWNrKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpMThuKCdzYXZlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvTW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChlZGl0U3RhdGUgPT09IEVkaXRTdGF0ZS5CaW8pIHtcbiAgICBjb25zdCBzaG91bGREaXNhYmxlU2F2ZSA9XG4gICAgICBpc0xvYWRpbmdBdmF0YXIgfHxcbiAgICAgIChzdGFnZWRQcm9maWxlLmFib3V0VGV4dCA9PT0gZnVsbEJpby5hYm91dFRleHQgJiZcbiAgICAgICAgc3RhZ2VkUHJvZmlsZS5hYm91dEVtb2ppID09PSBmdWxsQmlvLmFib3V0RW1vamkpO1xuXG4gICAgY29udGVudCA9IChcbiAgICAgIDw+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIGV4cGFuZGFibGVcbiAgICAgICAgICBoYXNDbGVhckJ1dHRvblxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgaWNvbj17XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1jb21wb3NpdGlvbi1hcmVhX19idXR0b24tY2VsbFwiPlxuICAgICAgICAgICAgICA8RW1vamlCdXR0b25cbiAgICAgICAgICAgICAgICBjbG9zZU9uUGlja1xuICAgICAgICAgICAgICAgIGVtb2ppPXtzdGFnZWRQcm9maWxlLmFib3V0RW1vaml9XG4gICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICBvblBpY2tFbW9qaT17c2V0QWJvdXRFbW9qaX1cbiAgICAgICAgICAgICAgICBvblNldFNraW5Ub25lPXtvblNldFNraW5Ub25lfVxuICAgICAgICAgICAgICAgIHJlY2VudEVtb2ppcz17cmVjZW50RW1vamlzfVxuICAgICAgICAgICAgICAgIHNraW5Ub25lPXtza2luVG9uZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgICBtYXhMZW5ndGhDb3VudD17MTQwfVxuICAgICAgICAgIG1heEJ5dGVDb3VudD17NTEyfVxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlByb2ZpbGVFZGl0b3JfX2Fib3V0LWlucHV0XCJcbiAgICAgICAgICBvbkNoYW5nZT17dmFsdWUgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHNldFN0YWdlZFByb2ZpbGUocHJvZmlsZURhdGEgPT4gKHtcbiAgICAgICAgICAgICAgICAuLi5wcm9maWxlRGF0YSxcbiAgICAgICAgICAgICAgICBhYm91dEVtb2ppOiBzdGFnZWRQcm9maWxlLmFib3V0RW1vamksXG4gICAgICAgICAgICAgICAgYWJvdXRUZXh0OiB2YWx1ZS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCAnJyksXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNldFN0YWdlZFByb2ZpbGUocHJvZmlsZURhdGEgPT4gKHtcbiAgICAgICAgICAgICAgICAuLi5wcm9maWxlRGF0YSxcbiAgICAgICAgICAgICAgICBhYm91dEVtb2ppOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYWJvdXRUZXh0OiAnJyxcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVmPXtmb2N1c0lucHV0UmVmfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuKCdQcm9maWxlRWRpdG9yLS1hYm91dC1wbGFjZWhvbGRlcicpfVxuICAgICAgICAgIHZhbHVlPXtzdGFnZWRQcm9maWxlLmFib3V0VGV4dH1cbiAgICAgICAgICB3aGVuVG9TaG93UmVtYWluaW5nQ291bnQ9ezQwfVxuICAgICAgICAvPlxuXG4gICAgICAgIHtERUZBVUxUX0JJT1MubWFwKGRlZmF1bHRCaW8gPT4gKFxuICAgICAgICAgIDxQYW5lbFJvd1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9fcm93XCJcbiAgICAgICAgICAgIGtleT17ZGVmYXVsdEJpby5zaG9ydE5hbWV9XG4gICAgICAgICAgICBpY29uPXtcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJQcm9maWxlRWRpdG9yX19pY29uLS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8RW1vamkgc2hvcnROYW1lPXtkZWZhdWx0QmlvLnNob3J0TmFtZX0gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFiZWw9e2kxOG4oZGVmYXVsdEJpby5pMThuTGFiZWwpfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlbW9qaURhdGEgPSBnZXRFbW9qaURhdGEoZGVmYXVsdEJpby5zaG9ydE5hbWUsIHNraW5Ub25lKTtcblxuICAgICAgICAgICAgICBzZXRTdGFnZWRQcm9maWxlKHByb2ZpbGVEYXRhID0+ICh7XG4gICAgICAgICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgICAgICAgICAgYWJvdXRFbW9qaTogdW5pZmllZFRvRW1vamkoZW1vamlEYXRhLnVuaWZpZWQpLFxuICAgICAgICAgICAgICAgIGFib3V0VGV4dDogaTE4bihkZWZhdWx0QmlvLmkxOG5MYWJlbCksXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG5cbiAgICAgICAgPE1vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGhhbmRsZUNhbmNlbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVCYWNrKCk7XG4gICAgICAgICAgICAgICAgc2V0U3RhZ2VkUHJvZmlsZShwcm9maWxlRGF0YSA9PiAoe1xuICAgICAgICAgICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgICAgICAgICAgICAuLi5mdWxsQmlvLFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBjb25zdCBoYXNDaGFuZ2VzID1cbiAgICAgICAgICAgICAgICBzdGFnZWRQcm9maWxlLmFib3V0VGV4dCAhPT0gZnVsbEJpby5hYm91dFRleHQgfHxcbiAgICAgICAgICAgICAgICBzdGFnZWRQcm9maWxlLmFib3V0RW1vamkgIT09IGZ1bGxCaW8uYWJvdXRFbW9qaTtcbiAgICAgICAgICAgICAgaWYgKGhhc0NoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBzZXRDb25maXJtRGlzY2FyZEFjdGlvbigoKSA9PiBoYW5kbGVDYW5jZWwpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZUNhbmNlbCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5TZWNvbmRhcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2NhbmNlbCcpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXtzaG91bGREaXNhYmxlU2F2ZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0RnVsbEJpbyh7XG4gICAgICAgICAgICAgICAgYWJvdXRFbW9qaTogc3RhZ2VkUHJvZmlsZS5hYm91dEVtb2ppLFxuICAgICAgICAgICAgICAgIGFib3V0VGV4dDogc3RhZ2VkUHJvZmlsZS5hYm91dFRleHQsXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIG9uUHJvZmlsZUNoYW5nZWQoc3RhZ2VkUHJvZmlsZSwge1xuICAgICAgICAgICAgICAgIG9sZEF2YXRhcjogb2xkQXZhdGFyQnVmZmVyLFxuICAgICAgICAgICAgICAgIG5ld0F2YXRhcjogYXZhdGFyQnVmZmVyLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaGFuZGxlQmFjaygpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignc2F2ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L01vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgIDwvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAoZWRpdFN0YXRlID09PSBFZGl0U3RhdGUuVXNlcm5hbWUpIHtcbiAgICBjb250ZW50ID0gKFxuICAgICAgPD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBkaXNhYmxlZD17aXNDdXJyZW50bHlTYXZpbmd9XG4gICAgICAgICAgZGlzYWJsZVNwZWxsY2hlY2tcbiAgICAgICAgICBvbkNoYW5nZT17Y2hhbmdlZFVzZXJuYW1lID0+IHtcbiAgICAgICAgICAgIHNldFVzZXJuYW1lRXJyb3IodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHNldE5ld1VzZXJuYW1lKGNoYW5nZWRVc2VybmFtZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkVudGVyPXtjaGVja1RoZW5TYXZlVXNlcm5hbWV9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4oJ1Byb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1wbGFjZWhvbGRlcicpfVxuICAgICAgICAgIHJlZj17Zm9jdXNJbnB1dFJlZn1cbiAgICAgICAgICB2YWx1ZT17bmV3VXNlcm5hbWV9XG4gICAgICAgIC8+XG5cbiAgICAgICAge3VzZXJuYW1lRXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9fZXJyb3JcIj57dXNlcm5hbWVFcnJvcn08L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdQcm9maWxlRWRpdG9yX19pbmZvJyxcbiAgICAgICAgICAgICF1c2VybmFtZUVycm9yID8gJ1Byb2ZpbGVFZGl0b3JfX2luZm8tLW5vLWVycm9yJyA6IHVuZGVmaW5lZFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICA8SW50bCBpMThuPXtpMThufSBpZD1cIlByb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1oZWxwZXJcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXtpc0N1cnJlbnRseVNhdmluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaGFuZGxlQ2FuY2VsID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGhhbmRsZUJhY2soKTtcbiAgICAgICAgICAgICAgICBzZXROZXdVc2VybmFtZSh1c2VybmFtZSk7XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgY29uc3QgaGFzQ2hhbmdlcyA9IG5ld1VzZXJuYW1lICE9PSB1c2VybmFtZTtcbiAgICAgICAgICAgICAgaWYgKGhhc0NoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBzZXRDb25maXJtRGlzY2FyZEFjdGlvbigoKSA9PiBoYW5kbGVDYW5jZWwpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZUNhbmNlbCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5TZWNvbmRhcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2NhbmNlbCcpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXtzaG91bGREaXNhYmxlVXNlcm5hbWVTYXZlfVxuICAgICAgICAgICAgb25DbGljaz17Y2hlY2tUaGVuU2F2ZVVzZXJuYW1lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0N1cnJlbnRseVNhdmluZyA/IChcbiAgICAgICAgICAgICAgPFNwaW5uZXIgc2l6ZT1cIjIwcHhcIiBzdmdTaXplPVwic21hbGxcIiBkaXJlY3Rpb249XCJvbi1hdmF0YXJcIiAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgaTE4bignc2F2ZScpXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L01vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgIDwvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAoZWRpdFN0YXRlID09PSBFZGl0U3RhdGUuTm9uZSkge1xuICAgIGNvbnRlbnQgPSAoXG4gICAgICA8PlxuICAgICAgICA8QXZhdGFyUHJldmlld1xuICAgICAgICAgIGF2YXRhckNvbG9yPXtjb2xvcn1cbiAgICAgICAgICBhdmF0YXJQYXRoPXtzdGFydGluZ0F2YXRhclBhdGh9XG4gICAgICAgICAgYXZhdGFyVmFsdWU9e2F2YXRhckJ1ZmZlcn1cbiAgICAgICAgICBjb252ZXJzYXRpb25UaXRsZT17Z2V0RnVsbE5hbWVUZXh0KCl9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBpc0VkaXRhYmxlXG4gICAgICAgICAgb25BdmF0YXJMb2FkZWQ9e2hhbmRsZUF2YXRhckxvYWRlZH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRFZGl0U3RhdGUoRWRpdFN0YXRlLkJldHRlckF2YXRhcik7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgaGVpZ2h0OiA4MCxcbiAgICAgICAgICAgIHdpZHRoOiA4MCxcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8aHIgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9fZGl2aWRlclwiIC8+XG4gICAgICAgIDxQYW5lbFJvd1xuICAgICAgICAgIGNsYXNzTmFtZT1cIlByb2ZpbGVFZGl0b3JfX3Jvd1wiXG4gICAgICAgICAgaWNvbj17XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJQcm9maWxlRWRpdG9yX19pY29uLS1jb250YWluZXIgUHJvZmlsZUVkaXRvcl9faWNvbiBQcm9maWxlRWRpdG9yX19pY29uLS1uYW1lXCIgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgbGFiZWw9ezxFbW9qaWZ5IHRleHQ9e2dldEZ1bGxOYW1lVGV4dCgpfSAvPn1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRFZGl0U3RhdGUoRWRpdFN0YXRlLlByb2ZpbGVOYW1lKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICB7aXNVc2VybmFtZUZsYWdFbmFibGVkID8gKFxuICAgICAgICAgIDxQYW5lbFJvd1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9fcm93XCJcbiAgICAgICAgICAgIGljb249e1xuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJQcm9maWxlRWRpdG9yX19pY29uLS1jb250YWluZXIgUHJvZmlsZUVkaXRvcl9faWNvbiBQcm9maWxlRWRpdG9yX19pY29uLS11c2VybmFtZVwiIC8+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYWJlbD17dXNlcm5hbWUgfHwgaTE4bignUHJvZmlsZUVkaXRvci0tdXNlcm5hbWUnKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e1xuICAgICAgICAgICAgICB1c2VybmFtZUVkaXRTdGF0ZSAhPT0gVXNlcm5hbWVFZGl0U3RhdGUuU2F2aW5nXG4gICAgICAgICAgICAgICAgPyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldE5ld1VzZXJuYW1lKHVzZXJuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0RWRpdFN0YXRlKEVkaXRTdGF0ZS5Vc2VybmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgICB1c2VybmFtZSA/IChcbiAgICAgICAgICAgICAgICA8Q29udmVyc2F0aW9uRGV0YWlsc0ljb25cbiAgICAgICAgICAgICAgICAgIGFyaWFMYWJlbD17aTE4bignUHJvZmlsZUVkaXRvci0tdXNlcm5hbWUtLWRlbGV0ZS11c2VybmFtZScpfVxuICAgICAgICAgICAgICAgICAgaWNvbj17XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lRWRpdFN0YXRlID09PSBVc2VybmFtZUVkaXRTdGF0ZS5TYXZpbmdcbiAgICAgICAgICAgICAgICAgICAgICA/IEljb25UeXBlLnNwaW5uZXJcbiAgICAgICAgICAgICAgICAgICAgICA6IEljb25UeXBlLnRyYXNoXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dXNlcm5hbWVFZGl0U3RhdGUgPT09IFVzZXJuYW1lRWRpdFN0YXRlLlNhdmluZ31cbiAgICAgICAgICAgICAgICAgIGZha2VCdXR0b25cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VXNlcm5hbWVFZGl0U3RhdGUoVXNlcm5hbWVFZGl0U3RhdGUuQ29uZmlybWluZ0RlbGV0ZSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkgOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxQYW5lbFJvd1xuICAgICAgICAgIGNsYXNzTmFtZT1cIlByb2ZpbGVFZGl0b3JfX3Jvd1wiXG4gICAgICAgICAgaWNvbj17XG4gICAgICAgICAgICBmdWxsQmlvLmFib3V0RW1vamkgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9faWNvbi0tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPEVtb2ppIGVtb2ppPXtmdWxsQmlvLmFib3V0RW1vaml9IHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIlByb2ZpbGVFZGl0b3JfX2ljb24tLWNvbnRhaW5lciBQcm9maWxlRWRpdG9yX19pY29uIFByb2ZpbGVFZGl0b3JfX2ljb24tLWJpb1wiIC8+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgIDxFbW9qaWZ5IHRleHQ9e2Z1bGxCaW8uYWJvdXRUZXh0IHx8IGkxOG4oJ1Byb2ZpbGVFZGl0b3ItLWFib3V0Jyl9IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHNldEVkaXRTdGF0ZShFZGl0U3RhdGUuQmlvKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8aHIgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9fZGl2aWRlclwiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUHJvZmlsZUVkaXRvcl9faW5mb1wiPlxuICAgICAgICAgIDxJbnRsXG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgaWQ9XCJQcm9maWxlRWRpdG9yLS1pbmZvXCJcbiAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgbGVhcm5Nb3JlOiAoXG4gICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3N1cHBvcnQuc2lnbmFsLm9yZy9oYy9lbi11cy9hcnRpY2xlcy8zNjAwMDc0NTk1OTFcIlxuICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtpMThuKCdQcm9maWxlRWRpdG9yLS1sZWFybk1vcmUnKX1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKGVkaXRTdGF0ZSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7dXNlcm5hbWVFZGl0U3RhdGUgPT09IFVzZXJuYW1lRWRpdFN0YXRlLkNvbmZpcm1pbmdEZWxldGUgJiYgKFxuICAgICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRVc2VybmFtZUVkaXRTdGF0ZShVc2VybmFtZUVkaXRTdGF0ZS5FZGl0aW5nKX1cbiAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IGkxOG4oJ1Byb2ZpbGVFZGl0b3ItLXVzZXJuYW1lLS1jb25maXJtLWRlbGV0ZS1idXR0b24nKSxcbiAgICAgICAgICAgICAgc3R5bGU6ICduZWdhdGl2ZScsXG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gZGVsZXRlVXNlcm5hbWUoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdQcm9maWxlRWRpdG9yLS11c2VybmFtZS0tY29uZmlybS1kZWxldGUtYm9keScpfVxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICl9XG4gICAgICB7dXNlcm5hbWVFZGl0U3RhdGUgPT09IFVzZXJuYW1lRWRpdFN0YXRlLlNob3dpbmdFcnJvclBvcHVwICYmIChcbiAgICAgICAgPENvbmZpcm1hdGlvbkRpYWxvZ1xuICAgICAgICAgIGNhbmNlbFRleHQ9e2kxOG4oJ29rJyl9XG4gICAgICAgICAgY2FuY2VsQnV0dG9uVmFyaWFudD17QnV0dG9uVmFyaWFudC5TZWNvbmRhcnl9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRVc2VybmFtZUVkaXRTdGF0ZShVc2VybmFtZUVkaXRTdGF0ZS5FZGl0aW5nKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdQcm9maWxlRWRpdG9yLS11c2VybmFtZS0tZ2VuZXJhbC1lcnJvcicpfVxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICl9XG4gICAgICB7Y29uZmlybURpc2NhcmRBY3Rpb24gJiYgKFxuICAgICAgICA8Q29uZmlybURpc2NhcmREaWFsb2dcbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uRGlzY2FyZD17Y29uZmlybURpc2NhcmRBY3Rpb259XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0Q29uZmlybURpc2NhcmRBY3Rpb24odW5kZWZpbmVkKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlByb2ZpbGVFZGl0b3JcIj57Y29udGVudH08L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBZ0U7QUFDaEUsd0JBQXVCO0FBRXZCLFVBQXFCO0FBRXJCLG9CQUE2QjtBQVE3QiwwQkFBNkI7QUFDN0IsMkJBQThCO0FBQzlCLG9CQUFzQztBQUN0QyxrQ0FBcUM7QUFDckMsbUJBQXNCO0FBRXRCLHlCQUE0QjtBQUU1QixtQkFBc0I7QUFDdEIsa0JBQXFCO0FBRXJCLG1CQUFzQjtBQUN0QixzQkFBeUI7QUFFekIsaUJBQTZDO0FBQzdDLDhCQUFpQztBQUNqQyxnQ0FBbUM7QUFDbkMscUNBR087QUFDUCxxQkFBd0I7QUFDeEIsZ0NBQWtDO0FBQ2xDLHNCQUEyQztBQUMzQyxrQ0FBbUM7QUFDbkMscUJBQXdCO0FBRWpCLElBQUssWUFBTCxrQkFBSyxlQUFMO0FBQ0wsdUJBQU87QUFDUCwrQkFBZTtBQUNmLDhCQUFjO0FBQ2Qsc0JBQU07QUFDTiwyQkFBVztBQUxEO0FBQUE7QUFRWixJQUFLLG9CQUFMLGtCQUFLLHVCQUFMO0FBQ0Usa0NBQVU7QUFDViwyQ0FBbUI7QUFDbkIsNENBQW9CO0FBQ3BCLGlDQUFTO0FBSk47QUFBQTtBQWlETCxNQUFNLGVBQWtDO0FBQUEsRUFDdEM7QUFBQSxJQUNFLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQTtBQUFBLElBQ0UsV0FBVztBQUFB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
