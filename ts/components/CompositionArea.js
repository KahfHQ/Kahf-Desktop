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
var CompositionArea_exports = {};
__export(CompositionArea_exports, {
  CompositionArea: () => CompositionArea
});
module.exports = __toCommonJS(CompositionArea_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_classnames = __toESM(require("classnames"));
var import_audioRecorder = require("../state/ducks/audioRecorder");
var import_Spinner = require("./Spinner");
var import_EmojiButton = require("./emoji/EmojiButton");
var import_StickerButton = require("./stickers/StickerButton");
var import_CompositionInput = require("./CompositionInput");
var import_MessageRequestActions = require("./conversation/MessageRequestActions");
var import_GroupV1DisabledActions = require("./conversation/GroupV1DisabledActions");
var import_GroupV2PendingApprovalActions = require("./conversation/GroupV2PendingApprovalActions");
var import_AnnouncementsOnlyGroupBanner = require("./AnnouncementsOnlyGroupBanner");
var import_AttachmentList = require("./conversation/AttachmentList");
var import_Attachment = require("../types/Attachment");
var import_AudioCapture = require("./conversation/AudioCapture");
var import_CompositionUpload = require("./CompositionUpload");
var import_MandatoryProfileSharingActions = require("./conversation/MandatoryProfileSharingActions");
var import_MediaQualitySelector = require("./MediaQualitySelector");
var import_Quote = require("./conversation/Quote");
var import_StagedLinkPreview = require("./conversation/StagedLinkPreview");
var import_lib = require("./stickers/lib");
var import_useKeyboardShortcuts = require("../hooks/useKeyboardShortcuts");
var import_MediaEditor = require("./MediaEditor");
var import_MIME = require("../types/MIME");
var import_GoogleChrome = require("../util/GoogleChrome");
var KeyboardLayout = __toESM(require("../services/keyboardLayout"));
const CompositionArea = /* @__PURE__ */ __name(({
  addAttachment,
  addPendingAttachment,
  conversationId,
  i18n,
  onSendMessage,
  processAttachments,
  removeAttachment,
  theme,
  draftAttachments,
  onClearAttachments,
  cancelRecording,
  completeRecording,
  errorDialogAudioRecorderType,
  errorRecording,
  recordingState,
  startRecording,
  linkPreviewLoading,
  linkPreviewResult,
  onCloseLinkPreview,
  quotedMessageProps,
  onClickQuotedMessage,
  setQuotedMessage,
  onSelectMediaQuality,
  shouldSendHighQualityAttachments,
  compositionApi,
  onEditorStateChange,
  onTextTooLong,
  draftText,
  draftBodyRanges,
  clearQuotedMessage,
  getPreferredBadge,
  getQuotedMessage,
  sortedGroupMembers,
  onPickEmoji,
  onSetSkinTone,
  recentEmojis,
  skinTone,
  knownPacks,
  receivedPacks,
  installedPack,
  installedPacks,
  blessedPacks,
  recentStickers,
  clearInstalledStickerPack,
  onClickAddPack,
  onPickSticker,
  clearShowIntroduction,
  showPickerHint,
  clearShowPickerHint,
  acceptedMessageRequest,
  areWePending,
  areWePendingApproval,
  conversationType,
  groupVersion,
  isBlocked,
  isMissingMandatoryProfileSharing,
  left,
  messageRequestsEnabled,
  onAccept,
  onBlock,
  onBlockAndReportSpam,
  onDelete,
  onUnblock,
  title,
  isGroupV1AndDisabled,
  onStartGroupMigration,
  announcementsOnly,
  areWeAdmin,
  groupAdmins,
  onCancelJoinRequest,
  openConversation,
  isSMSOnly,
  isFetchingUUID
}) => {
  const [disabled, setDisabled] = (0, import_react.useState)(false);
  const [dirty, setDirty] = (0, import_react.useState)(false);
  const [large, setLarge] = (0, import_react.useState)(false);
  const [attachmentToEdit, setAttachmentToEdit] = (0, import_react.useState)();
  const inputApiRef = (0, import_react.useRef)();
  const emojiButtonRef = (0, import_react.useRef)();
  const fileInputRef = (0, import_react.useRef)(null);
  const handleForceSend = (0, import_react.useCallback)(() => {
    setLarge(false);
    if (inputApiRef.current) {
      inputApiRef.current.submit();
    }
  }, [inputApiRef, setLarge]);
  const handleSubmit = (0, import_react.useCallback)((message, mentions, timestamp) => {
    emojiButtonRef.current?.close();
    onSendMessage({
      draftAttachments,
      mentions,
      message,
      timestamp
    });
    setLarge(false);
  }, [draftAttachments, onSendMessage, setLarge]);
  const launchAttachmentPicker = (0, import_react.useCallback)(() => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.value = "";
      fileInput.click();
    }
  }, []);
  function maybeEditAttachment(attachment) {
    if (!(0, import_GoogleChrome.isImageTypeSupported)(attachment.contentType)) {
      return;
    }
    setAttachmentToEdit(attachment);
  }
  const attachFileShortcut = (0, import_useKeyboardShortcuts.useAttachFileShortcut)(launchAttachmentPicker);
  (0, import_useKeyboardShortcuts.useKeyboardShortcuts)(attachFileShortcut);
  const focusInput = (0, import_react.useCallback)(() => {
    if (inputApiRef.current) {
      inputApiRef.current.focus();
    }
  }, [inputApiRef]);
  const withStickers = (0, import_lib.countStickers)({
    knownPacks,
    blessedPacks,
    installedPacks,
    receivedPacks
  }) > 0;
  if (compositionApi) {
    compositionApi.current = {
      isDirty: () => dirty,
      focusInput,
      setDisabled,
      reset: () => {
        if (inputApiRef.current) {
          inputApiRef.current.reset();
        }
      },
      resetEmojiResults: () => {
        if (inputApiRef.current) {
          inputApiRef.current.resetEmojiResults();
        }
      }
    };
  }
  const insertEmoji = (0, import_react.useCallback)((e) => {
    if (inputApiRef.current) {
      inputApiRef.current.insertEmoji(e);
      onPickEmoji(e);
    }
  }, [inputApiRef, onPickEmoji]);
  const handleToggleLarge = (0, import_react.useCallback)(() => {
    setLarge((l) => !l);
  }, [setLarge]);
  const shouldShowMicrophone = !large && !draftAttachments.length && !draftText;
  const showMediaQualitySelector = draftAttachments.some(import_Attachment.isImageAttachment);
  const leftHandSideButtonsFragment = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement(import_EmojiButton.EmojiButton, {
    emojiButtonApi: emojiButtonRef,
    i18n,
    doSend: handleForceSend,
    onPickEmoji: insertEmoji,
    onClose: focusInput,
    recentEmojis,
    skinTone,
    onSetSkinTone
  })), showMediaQualitySelector ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement(import_MediaQualitySelector.MediaQualitySelector, {
    i18n,
    isHighQuality: shouldSendHighQualityAttachments,
    onSelectQuality: onSelectMediaQuality
  })) : null);
  const micButtonFragment = shouldShowMicrophone ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement(import_AudioCapture.AudioCapture, {
    cancelRecording,
    completeRecording,
    conversationId,
    draftAttachments,
    errorDialogAudioRecorderType,
    errorRecording,
    i18n,
    recordingState,
    onSendAudioRecording: (voiceNoteAttachment) => {
      emojiButtonRef.current?.close();
      onSendMessage({ voiceNoteAttachment });
    },
    startRecording
  })) : null;
  const isRecording = recordingState === import_audioRecorder.RecordingState.Recording;
  const attButton = linkPreviewResult || isRecording ? void 0 : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: "CompositionArea__attach-file",
    onClick: launchAttachmentPicker,
    "aria-label": i18n("CompositionArea--attach-file")
  }));
  const sendButtonFragment = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__placeholder"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: "CompositionArea__send-button",
    onClick: handleForceSend,
    "aria-label": i18n("sendMessageToContact")
  })));
  const stickerButtonPlacement = large ? "top-start" : "top-end";
  const stickerButtonFragment = withStickers ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__button-cell"
  }, /* @__PURE__ */ import_react.default.createElement(import_StickerButton.StickerButton, {
    i18n,
    knownPacks,
    receivedPacks,
    installedPack,
    installedPacks,
    blessedPacks,
    recentStickers,
    clearInstalledStickerPack,
    onClickAddPack,
    onPickSticker,
    clearShowIntroduction,
    showPickerHint,
    clearShowPickerHint,
    position: stickerButtonPlacement
  })) : null;
  (0, import_react.useEffect)(() => {
    const handler = /* @__PURE__ */ __name((e) => {
      const { shiftKey, ctrlKey, metaKey } = e;
      const key = KeyboardLayout.lookup(e);
      const xKey = key === "x" || key === "X";
      const commandKey = (0, import_lodash.get)(window, "platform") === "darwin" && metaKey;
      const controlKey = (0, import_lodash.get)(window, "platform") !== "darwin" && ctrlKey;
      const commandOrCtrl = commandKey || controlKey;
      if (xKey && shiftKey && commandOrCtrl) {
        e.preventDefault();
        setLarge((x) => !x);
      }
    }, "handler");
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [setLarge]);
  if (isBlocked || areWePending || messageRequestsEnabled && !acceptedMessageRequest) {
    return /* @__PURE__ */ import_react.default.createElement(import_MessageRequestActions.MessageRequestActions, {
      i18n,
      conversationType,
      isBlocked,
      onBlock,
      onBlockAndReportSpam,
      onUnblock,
      onDelete,
      onAccept,
      title
    });
  }
  if (conversationType === "direct" && isSMSOnly) {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)([
        "CompositionArea",
        "CompositionArea--sms-only",
        isFetchingUUID ? "CompositionArea--pending" : null
      ])
    }, isFetchingUUID ? /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      ariaLabel: i18n("CompositionArea--sms-only__spinner-label"),
      role: "presentation",
      moduleClassName: "module-image-spinner",
      svgSize: "small"
    }) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("h2", {
      className: "CompositionArea--sms-only__title"
    }, i18n("CompositionArea--sms-only__title")), /* @__PURE__ */ import_react.default.createElement("p", {
      className: "CompositionArea--sms-only__body"
    }, i18n("CompositionArea--sms-only__body"))));
  }
  if (!left && (conversationType === "direct" || conversationType === "group" && groupVersion === 1) && isMissingMandatoryProfileSharing) {
    return /* @__PURE__ */ import_react.default.createElement(import_MandatoryProfileSharingActions.MandatoryProfileSharingActions, {
      i18n,
      conversationType,
      onBlock,
      onBlockAndReportSpam,
      onDelete,
      onAccept,
      title
    });
  }
  if (!left && isGroupV1AndDisabled) {
    return /* @__PURE__ */ import_react.default.createElement(import_GroupV1DisabledActions.GroupV1DisabledActions, {
      i18n,
      onStartGroupMigration
    });
  }
  if (areWePendingApproval) {
    return /* @__PURE__ */ import_react.default.createElement(import_GroupV2PendingApprovalActions.GroupV2PendingApprovalActions, {
      i18n,
      onCancelJoinRequest
    });
  }
  if (announcementsOnly && !areWeAdmin) {
    return /* @__PURE__ */ import_react.default.createElement(import_AnnouncementsOnlyGroupBanner.AnnouncementsOnlyGroupBanner, {
      groupAdmins,
      i18n,
      openConversation,
      theme
    });
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea"
  }, attachmentToEdit && "url" in attachmentToEdit && attachmentToEdit.url && /* @__PURE__ */ import_react.default.createElement(import_MediaEditor.MediaEditor, {
    i18n,
    imageSrc: attachmentToEdit.url,
    onClose: () => setAttachmentToEdit(void 0),
    onDone: (data) => {
      const newAttachment = {
        ...attachmentToEdit,
        contentType: import_MIME.IMAGE_PNG,
        data,
        size: data.byteLength
      };
      addAttachment(conversationId, newAttachment);
      setAttachmentToEdit(void 0);
    },
    installedPacks,
    recentStickers
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__toggle-large"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: (0, import_classnames.default)("CompositionArea__toggle-large__button", large ? "CompositionArea__toggle-large__button--large-active" : null),
    tabIndex: -1,
    onClick: handleToggleLarge,
    "aria-label": i18n("CompositionArea--expand")
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("CompositionArea__row", "CompositionArea__row--column")
  }, quotedMessageProps && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "quote-wrapper"
  }, /* @__PURE__ */ import_react.default.createElement(import_Quote.Quote, {
    isCompose: true,
    ...quotedMessageProps,
    i18n,
    onClick: onClickQuotedMessage,
    onClose: () => {
      setQuotedMessage(void 0);
      clearQuotedMessage?.();
    }
  })), linkPreviewLoading && linkPreviewResult && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "preview-wrapper"
  }, /* @__PURE__ */ import_react.default.createElement(import_StagedLinkPreview.StagedLinkPreview, {
    ...linkPreviewResult,
    i18n,
    onClose: onCloseLinkPreview
  })), draftAttachments.length ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "CompositionArea__attachment-list"
  }, /* @__PURE__ */ import_react.default.createElement(import_AttachmentList.AttachmentList, {
    attachments: draftAttachments,
    canEditImages: true,
    i18n,
    onAddAttachment: launchAttachmentPicker,
    onClickAttachment: maybeEditAttachment,
    onClose: onClearAttachments,
    onCloseAttachment: (attachment) => {
      if (attachment.path) {
        removeAttachment(conversationId, attachment.path);
      }
    }
  })) : null), /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("CompositionArea__row", large ? "CompositionArea__row--padded" : null)
  }, !large ? leftHandSideButtonsFragment : null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("CompositionArea__input", large ? "CompositionArea__input--padded" : null)
  }, /* @__PURE__ */ import_react.default.createElement(import_CompositionInput.CompositionInput, {
    clearQuotedMessage,
    disabled,
    draftBodyRanges,
    draftText,
    getPreferredBadge,
    getQuotedMessage,
    i18n,
    inputApi: inputApiRef,
    large,
    onDirtyChange: setDirty,
    onEditorStateChange,
    onPickEmoji,
    onSubmit: handleSubmit,
    onTextTooLong,
    skinTone,
    sortedGroupMembers,
    theme
  })), !large ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, stickerButtonFragment, !dirty ? micButtonFragment : null, attButton) : null), large ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("CompositionArea__row", "CompositionArea__row--control-row")
  }, leftHandSideButtonsFragment, stickerButtonFragment, attButton, !dirty ? micButtonFragment : null, dirty || !shouldShowMicrophone ? sendButtonFragment : null) : null, /* @__PURE__ */ import_react.default.createElement(import_CompositionUpload.CompositionUpload, {
    addAttachment,
    addPendingAttachment,
    conversationId,
    draftAttachments,
    i18n,
    processAttachments,
    removeAttachment,
    ref: fileInputRef
  }));
}, "CompositionArea");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompositionArea
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29tcG9zaXRpb25BcmVhLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTXV0YWJsZVJlZk9iamVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHR5cGUge1xuICBCb2R5UmFuZ2VUeXBlLFxuICBCb2R5UmFuZ2VzVHlwZSxcbiAgTG9jYWxpemVyVHlwZSxcbiAgVGhlbWVUeXBlLFxufSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgRXJyb3JEaWFsb2dBdWRpb1JlY29yZGVyVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2F1ZGlvUmVjb3JkZXInO1xuaW1wb3J0IHsgUmVjb3JkaW5nU3RhdGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9hdWRpb1JlY29yZGVyJztcbmltcG9ydCB0eXBlIHsgSGFuZGxlQXR0YWNobWVudHNQcm9jZXNzaW5nQXJnc1R5cGUgfSBmcm9tICcuLi91dGlsL2hhbmRsZUF0dGFjaG1lbnRzUHJvY2Vzc2luZyc7XG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSAnLi9TcGlubmVyJztcbmltcG9ydCB0eXBlIHtcbiAgUHJvcHMgYXMgRW1vamlCdXR0b25Qcm9wcyxcbiAgRW1vamlCdXR0b25BUEksXG59IGZyb20gJy4vZW1vamkvRW1vamlCdXR0b24nO1xuaW1wb3J0IHsgRW1vamlCdXR0b24gfSBmcm9tICcuL2Vtb2ppL0Vtb2ppQnV0dG9uJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgU3RpY2tlckJ1dHRvblByb3BzIH0gZnJvbSAnLi9zdGlja2Vycy9TdGlja2VyQnV0dG9uJztcbmltcG9ydCB7IFN0aWNrZXJCdXR0b24gfSBmcm9tICcuL3N0aWNrZXJzL1N0aWNrZXJCdXR0b24nO1xuaW1wb3J0IHR5cGUge1xuICBJbnB1dEFwaSxcbiAgUHJvcHMgYXMgQ29tcG9zaXRpb25JbnB1dFByb3BzLFxufSBmcm9tICcuL0NvbXBvc2l0aW9uSW5wdXQnO1xuaW1wb3J0IHsgQ29tcG9zaXRpb25JbnB1dCB9IGZyb20gJy4vQ29tcG9zaXRpb25JbnB1dCc7XG5pbXBvcnQgdHlwZSB7IFByb3BzIGFzIE1lc3NhZ2VSZXF1ZXN0QWN0aW9uc1Byb3BzIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vTWVzc2FnZVJlcXVlc3RBY3Rpb25zJztcbmltcG9ydCB7IE1lc3NhZ2VSZXF1ZXN0QWN0aW9ucyB9IGZyb20gJy4vY29udmVyc2F0aW9uL01lc3NhZ2VSZXF1ZXN0QWN0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSBhcyBHcm91cFYxRGlzYWJsZWRBY3Rpb25zUHJvcHNUeXBlIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vR3JvdXBWMURpc2FibGVkQWN0aW9ucyc7XG5pbXBvcnQgeyBHcm91cFYxRGlzYWJsZWRBY3Rpb25zIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vR3JvdXBWMURpc2FibGVkQWN0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFByb3BzVHlwZSBhcyBHcm91cFYyUGVuZGluZ0FwcHJvdmFsQWN0aW9uc1Byb3BzVHlwZSB9IGZyb20gJy4vY29udmVyc2F0aW9uL0dyb3VwVjJQZW5kaW5nQXBwcm92YWxBY3Rpb25zJztcbmltcG9ydCB7IEdyb3VwVjJQZW5kaW5nQXBwcm92YWxBY3Rpb25zIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vR3JvdXBWMlBlbmRpbmdBcHByb3ZhbEFjdGlvbnMnO1xuaW1wb3J0IHsgQW5ub3VuY2VtZW50c09ubHlHcm91cEJhbm5lciB9IGZyb20gJy4vQW5ub3VuY2VtZW50c09ubHlHcm91cEJhbm5lcic7XG5pbXBvcnQgeyBBdHRhY2htZW50TGlzdCB9IGZyb20gJy4vY29udmVyc2F0aW9uL0F0dGFjaG1lbnRMaXN0JztcbmltcG9ydCB0eXBlIHtcbiAgQXR0YWNobWVudERyYWZ0VHlwZSxcbiAgSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlLFxufSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGlzSW1hZ2VBdHRhY2htZW50IH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBBdWRpb0NhcHR1cmUgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9BdWRpb0NhcHR1cmUnO1xuaW1wb3J0IHsgQ29tcG9zaXRpb25VcGxvYWQgfSBmcm9tICcuL0NvbXBvc2l0aW9uVXBsb2FkJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBFbW9qaVBpY2tEYXRhVHlwZSB9IGZyb20gJy4vZW1vamkvRW1vamlQaWNrZXInO1xuaW1wb3J0IHR5cGUgeyBMaW5rUHJldmlld1R5cGUgfSBmcm9tICcuLi90eXBlcy9tZXNzYWdlL0xpbmtQcmV2aWV3cyc7XG5cbmltcG9ydCB7IE1hbmRhdG9yeVByb2ZpbGVTaGFyaW5nQWN0aW9ucyB9IGZyb20gJy4vY29udmVyc2F0aW9uL01hbmRhdG9yeVByb2ZpbGVTaGFyaW5nQWN0aW9ucyc7XG5pbXBvcnQgeyBNZWRpYVF1YWxpdHlTZWxlY3RvciB9IGZyb20gJy4vTWVkaWFRdWFsaXR5U2VsZWN0b3InO1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBRdW90ZVByb3BzIH0gZnJvbSAnLi9jb252ZXJzYXRpb24vUXVvdGUnO1xuaW1wb3J0IHsgUXVvdGUgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9RdW90ZSc7XG5pbXBvcnQgeyBTdGFnZWRMaW5rUHJldmlldyB9IGZyb20gJy4vY29udmVyc2F0aW9uL1N0YWdlZExpbmtQcmV2aWV3JztcbmltcG9ydCB7IGNvdW50U3RpY2tlcnMgfSBmcm9tICcuL3N0aWNrZXJzL2xpYic7XG5pbXBvcnQge1xuICB1c2VBdHRhY2hGaWxlU2hvcnRjdXQsXG4gIHVzZUtleWJvYXJkU2hvcnRjdXRzLFxufSBmcm9tICcuLi9ob29rcy91c2VLZXlib2FyZFNob3J0Y3V0cyc7XG5pbXBvcnQgeyBNZWRpYUVkaXRvciB9IGZyb20gJy4vTWVkaWFFZGl0b3InO1xuaW1wb3J0IHsgSU1BR0VfUE5HIH0gZnJvbSAnLi4vdHlwZXMvTUlNRSc7XG5pbXBvcnQgeyBpc0ltYWdlVHlwZVN1cHBvcnRlZCB9IGZyb20gJy4uL3V0aWwvR29vZ2xlQ2hyb21lJztcbmltcG9ydCAqIGFzIEtleWJvYXJkTGF5b3V0IGZyb20gJy4uL3NlcnZpY2VzL2tleWJvYXJkTGF5b3V0JztcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRpb25BUElUeXBlID1cbiAgfCB7XG4gICAgICBmb2N1c0lucHV0OiAoKSA9PiB2b2lkO1xuICAgICAgaXNEaXJ0eTogKCkgPT4gYm9vbGVhbjtcbiAgICAgIHNldERpc2FibGVkOiAoZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQ7XG4gICAgICByZXNldDogSW5wdXRBcGlbJ3Jlc2V0J107XG4gICAgICByZXNldEVtb2ppUmVzdWx0czogSW5wdXRBcGlbJ3Jlc2V0RW1vamlSZXN1bHRzJ107XG4gICAgfVxuICB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgT3duUHJvcHMgPSBSZWFkb25seTx7XG4gIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q/OiBib29sZWFuO1xuICBhZGRBdHRhY2htZW50OiAoXG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgICBhdHRhY2htZW50OiBJbk1lbW9yeUF0dGFjaG1lbnREcmFmdFR5cGVcbiAgKSA9PiB1bmtub3duO1xuICBhZGRQZW5kaW5nQXR0YWNobWVudDogKFxuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gICAgcGVuZGluZ0F0dGFjaG1lbnQ6IEF0dGFjaG1lbnREcmFmdFR5cGVcbiAgKSA9PiB1bmtub3duO1xuICBhbm5vdW5jZW1lbnRzT25seT86IGJvb2xlYW47XG4gIGFyZVdlQWRtaW4/OiBib29sZWFuO1xuICBhcmVXZVBlbmRpbmc/OiBib29sZWFuO1xuICBhcmVXZVBlbmRpbmdBcHByb3ZhbD86IGJvb2xlYW47XG4gIGNhbmNlbFJlY29yZGluZzogKCkgPT4gdW5rbm93bjtcbiAgY29tcGxldGVSZWNvcmRpbmc6IChcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICAgIG9uU2VuZEF1ZGlvUmVjb3JkaW5nPzogKHJlYzogSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlKSA9PiB1bmtub3duXG4gICkgPT4gdW5rbm93bjtcbiAgY29tcG9zaXRpb25BcGk/OiBNdXRhYmxlUmVmT2JqZWN0PENvbXBvc2l0aW9uQVBJVHlwZT47XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGRyYWZ0QXR0YWNobWVudHM6IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudERyYWZ0VHlwZT47XG4gIGVycm9yRGlhbG9nQXVkaW9SZWNvcmRlclR5cGU/OiBFcnJvckRpYWxvZ0F1ZGlvUmVjb3JkZXJUeXBlO1xuICBlcnJvclJlY29yZGluZzogKGU6IEVycm9yRGlhbG9nQXVkaW9SZWNvcmRlclR5cGUpID0+IHVua25vd247XG4gIGdyb3VwQWRtaW5zOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgZ3JvdXBWZXJzaW9uPzogMSB8IDI7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIGlzRmV0Y2hpbmdVVUlEPzogYm9vbGVhbjtcbiAgaXNHcm91cFYxQW5kRGlzYWJsZWQ/OiBib29sZWFuO1xuICBpc01pc3NpbmdNYW5kYXRvcnlQcm9maWxlU2hhcmluZz86IGJvb2xlYW47XG4gIHJlY29yZGluZ1N0YXRlOiBSZWNvcmRpbmdTdGF0ZTtcbiAgaXNTTVNPbmx5PzogYm9vbGVhbjtcbiAgbGVmdD86IGJvb2xlYW47XG4gIGxpbmtQcmV2aWV3TG9hZGluZzogYm9vbGVhbjtcbiAgbGlua1ByZXZpZXdSZXN1bHQ/OiBMaW5rUHJldmlld1R5cGU7XG4gIG1lc3NhZ2VSZXF1ZXN0c0VuYWJsZWQ/OiBib29sZWFuO1xuICBvbkNsZWFyQXR0YWNobWVudHMoKTogdW5rbm93bjtcbiAgb25DbGlja1F1b3RlZE1lc3NhZ2UoKTogdW5rbm93bjtcbiAgb25DbG9zZUxpbmtQcmV2aWV3KCk6IHVua25vd247XG4gIHByb2Nlc3NBdHRhY2htZW50czogKG9wdGlvbnM6IEhhbmRsZUF0dGFjaG1lbnRzUHJvY2Vzc2luZ0FyZ3NUeXBlKSA9PiB1bmtub3duO1xuICBvblNlbGVjdE1lZGlhUXVhbGl0eShpc0hROiBib29sZWFuKTogdW5rbm93bjtcbiAgb25TZW5kTWVzc2FnZShvcHRpb25zOiB7XG4gICAgZHJhZnRBdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudERyYWZ0VHlwZT47XG4gICAgbWVudGlvbnM/OiBCb2R5UmFuZ2VzVHlwZTtcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgIHRpbWVzdGFtcD86IG51bWJlcjtcbiAgICB2b2ljZU5vdGVBdHRhY2htZW50PzogSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlO1xuICB9KTogdW5rbm93bjtcbiAgb3BlbkNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZDogc3RyaW5nKTogdW5rbm93bjtcbiAgcXVvdGVkTWVzc2FnZVByb3BzPzogT21pdDxcbiAgICBRdW90ZVByb3BzLFxuICAgICdpMThuJyB8ICdvbkNsaWNrJyB8ICdvbkNsb3NlJyB8ICd3aXRoQ29udGVudEFib3ZlJ1xuICA+O1xuICByZW1vdmVBdHRhY2htZW50OiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZywgZmlsZVBhdGg6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgc2V0UXVvdGVkTWVzc2FnZShtZXNzYWdlOiB1bmRlZmluZWQpOiB1bmtub3duO1xuICBzaG91bGRTZW5kSGlnaFF1YWxpdHlBdHRhY2htZW50czogYm9vbGVhbjtcbiAgc3RhcnRSZWNvcmRpbmc6ICgpID0+IHVua25vd247XG4gIHRoZW1lOiBUaGVtZVR5cGU7XG59PjtcblxuZXhwb3J0IHR5cGUgUHJvcHMgPSBQaWNrPFxuICBDb21wb3NpdGlvbklucHV0UHJvcHMsXG4gIHwgJ3NvcnRlZEdyb3VwTWVtYmVycydcbiAgfCAnb25FZGl0b3JTdGF0ZUNoYW5nZSdcbiAgfCAnb25UZXh0VG9vTG9uZydcbiAgfCAnZHJhZnRUZXh0J1xuICB8ICdkcmFmdEJvZHlSYW5nZXMnXG4gIHwgJ2NsZWFyUXVvdGVkTWVzc2FnZSdcbiAgfCAnZ2V0UHJlZmVycmVkQmFkZ2UnXG4gIHwgJ2dldFF1b3RlZE1lc3NhZ2UnXG4+ICZcbiAgUGljazxcbiAgICBFbW9qaUJ1dHRvblByb3BzLFxuICAgICdvblBpY2tFbW9qaScgfCAnb25TZXRTa2luVG9uZScgfCAncmVjZW50RW1vamlzJyB8ICdza2luVG9uZSdcbiAgPiAmXG4gIFBpY2s8XG4gICAgU3RpY2tlckJ1dHRvblByb3BzLFxuICAgIHwgJ2tub3duUGFja3MnXG4gICAgfCAncmVjZWl2ZWRQYWNrcydcbiAgICB8ICdpbnN0YWxsZWRQYWNrJ1xuICAgIHwgJ2luc3RhbGxlZFBhY2tzJ1xuICAgIHwgJ2JsZXNzZWRQYWNrcydcbiAgICB8ICdyZWNlbnRTdGlja2VycydcbiAgICB8ICdjbGVhckluc3RhbGxlZFN0aWNrZXJQYWNrJ1xuICAgIHwgJ29uQ2xpY2tBZGRQYWNrJ1xuICAgIHwgJ29uUGlja1N0aWNrZXInXG4gICAgfCAnY2xlYXJTaG93SW50cm9kdWN0aW9uJ1xuICAgIHwgJ3Nob3dQaWNrZXJIaW50J1xuICAgIHwgJ2NsZWFyU2hvd1BpY2tlckhpbnQnXG4gID4gJlxuICBNZXNzYWdlUmVxdWVzdEFjdGlvbnNQcm9wcyAmXG4gIFBpY2s8R3JvdXBWMURpc2FibGVkQWN0aW9uc1Byb3BzVHlwZSwgJ29uU3RhcnRHcm91cE1pZ3JhdGlvbic+ICZcbiAgUGljazxHcm91cFYyUGVuZGluZ0FwcHJvdmFsQWN0aW9uc1Byb3BzVHlwZSwgJ29uQ2FuY2VsSm9pblJlcXVlc3QnPiAmXG4gIE93blByb3BzO1xuXG5leHBvcnQgY29uc3QgQ29tcG9zaXRpb25BcmVhID0gKHtcbiAgLy8gQmFzZSBwcm9wc1xuICBhZGRBdHRhY2htZW50LFxuICBhZGRQZW5kaW5nQXR0YWNobWVudCxcbiAgY29udmVyc2F0aW9uSWQsXG4gIGkxOG4sXG4gIG9uU2VuZE1lc3NhZ2UsXG4gIHByb2Nlc3NBdHRhY2htZW50cyxcbiAgcmVtb3ZlQXR0YWNobWVudCxcbiAgdGhlbWUsXG5cbiAgLy8gQXR0YWNobWVudExpc3RcbiAgZHJhZnRBdHRhY2htZW50cyxcbiAgb25DbGVhckF0dGFjaG1lbnRzLFxuICAvLyBBdWRpb0NhcHR1cmVcbiAgY2FuY2VsUmVjb3JkaW5nLFxuICBjb21wbGV0ZVJlY29yZGluZyxcbiAgZXJyb3JEaWFsb2dBdWRpb1JlY29yZGVyVHlwZSxcbiAgZXJyb3JSZWNvcmRpbmcsXG4gIHJlY29yZGluZ1N0YXRlLFxuICBzdGFydFJlY29yZGluZyxcbiAgLy8gU3RhZ2VkTGlua1ByZXZpZXdcbiAgbGlua1ByZXZpZXdMb2FkaW5nLFxuICBsaW5rUHJldmlld1Jlc3VsdCxcbiAgb25DbG9zZUxpbmtQcmV2aWV3LFxuICAvLyBRdW90ZVxuICBxdW90ZWRNZXNzYWdlUHJvcHMsXG4gIG9uQ2xpY2tRdW90ZWRNZXNzYWdlLFxuICBzZXRRdW90ZWRNZXNzYWdlLFxuICAvLyBNZWRpYVF1YWxpdHlTZWxlY3RvclxuICBvblNlbGVjdE1lZGlhUXVhbGl0eSxcbiAgc2hvdWxkU2VuZEhpZ2hRdWFsaXR5QXR0YWNobWVudHMsXG4gIC8vIENvbXBvc2l0aW9uSW5wdXRcbiAgY29tcG9zaXRpb25BcGksXG4gIG9uRWRpdG9yU3RhdGVDaGFuZ2UsXG4gIG9uVGV4dFRvb0xvbmcsXG4gIGRyYWZ0VGV4dCxcbiAgZHJhZnRCb2R5UmFuZ2VzLFxuICBjbGVhclF1b3RlZE1lc3NhZ2UsXG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBnZXRRdW90ZWRNZXNzYWdlLFxuICBzb3J0ZWRHcm91cE1lbWJlcnMsXG4gIC8vIEVtb2ppQnV0dG9uXG4gIG9uUGlja0Vtb2ppLFxuICBvblNldFNraW5Ub25lLFxuICByZWNlbnRFbW9qaXMsXG4gIHNraW5Ub25lLFxuICAvLyBTdGlja2VyQnV0dG9uXG4gIGtub3duUGFja3MsXG4gIHJlY2VpdmVkUGFja3MsXG4gIGluc3RhbGxlZFBhY2ssXG4gIGluc3RhbGxlZFBhY2tzLFxuICBibGVzc2VkUGFja3MsXG4gIHJlY2VudFN0aWNrZXJzLFxuICBjbGVhckluc3RhbGxlZFN0aWNrZXJQYWNrLFxuICBvbkNsaWNrQWRkUGFjayxcbiAgb25QaWNrU3RpY2tlcixcbiAgY2xlYXJTaG93SW50cm9kdWN0aW9uLFxuICBzaG93UGlja2VySGludCxcbiAgY2xlYXJTaG93UGlja2VySGludCxcbiAgLy8gTWVzc2FnZSBSZXF1ZXN0c1xuICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0LFxuICBhcmVXZVBlbmRpbmcsXG4gIGFyZVdlUGVuZGluZ0FwcHJvdmFsLFxuICBjb252ZXJzYXRpb25UeXBlLFxuICBncm91cFZlcnNpb24sXG4gIGlzQmxvY2tlZCxcbiAgaXNNaXNzaW5nTWFuZGF0b3J5UHJvZmlsZVNoYXJpbmcsXG4gIGxlZnQsXG4gIG1lc3NhZ2VSZXF1ZXN0c0VuYWJsZWQsXG4gIG9uQWNjZXB0LFxuICBvbkJsb2NrLFxuICBvbkJsb2NrQW5kUmVwb3J0U3BhbSxcbiAgb25EZWxldGUsXG4gIG9uVW5ibG9jayxcbiAgdGl0bGUsXG4gIC8vIEdyb3VwVjEgRGlzYWJsZWQgQWN0aW9uc1xuICBpc0dyb3VwVjFBbmREaXNhYmxlZCxcbiAgb25TdGFydEdyb3VwTWlncmF0aW9uLFxuICAvLyBHcm91cFYyXG4gIGFubm91bmNlbWVudHNPbmx5LFxuICBhcmVXZUFkbWluLFxuICBncm91cEFkbWlucyxcbiAgb25DYW5jZWxKb2luUmVxdWVzdCxcbiAgb3BlbkNvbnZlcnNhdGlvbixcbiAgLy8gU01TLW9ubHkgY29udGFjdHNcbiAgaXNTTVNPbmx5LFxuICBpc0ZldGNoaW5nVVVJRCxcbn06IFByb3BzKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbZGlzYWJsZWQsIHNldERpc2FibGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2RpcnR5LCBzZXREaXJ0eV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtsYXJnZSwgc2V0TGFyZ2VdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYXR0YWNobWVudFRvRWRpdCwgc2V0QXR0YWNobWVudFRvRWRpdF0gPSB1c2VTdGF0ZTxcbiAgICBBdHRhY2htZW50RHJhZnRUeXBlIHwgdW5kZWZpbmVkXG4gID4oKTtcbiAgY29uc3QgaW5wdXRBcGlSZWYgPSB1c2VSZWY8SW5wdXRBcGkgfCB1bmRlZmluZWQ+KCk7XG4gIGNvbnN0IGVtb2ppQnV0dG9uUmVmID0gdXNlUmVmPEVtb2ppQnV0dG9uQVBJIHwgdW5kZWZpbmVkPigpO1xuICBjb25zdCBmaWxlSW5wdXRSZWYgPSB1c2VSZWY8bnVsbCB8IEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuXG4gIGNvbnN0IGhhbmRsZUZvcmNlU2VuZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRMYXJnZShmYWxzZSk7XG4gICAgaWYgKGlucHV0QXBpUmVmLmN1cnJlbnQpIHtcbiAgICAgIGlucHV0QXBpUmVmLmN1cnJlbnQuc3VibWl0KCk7XG4gICAgfVxuICB9LCBbaW5wdXRBcGlSZWYsIHNldExhcmdlXSk7XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gdXNlQ2FsbGJhY2soXG4gICAgKG1lc3NhZ2U6IHN0cmluZywgbWVudGlvbnM6IEFycmF5PEJvZHlSYW5nZVR5cGU+LCB0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgZW1vamlCdXR0b25SZWYuY3VycmVudD8uY2xvc2UoKTtcbiAgICAgIG9uU2VuZE1lc3NhZ2Uoe1xuICAgICAgICBkcmFmdEF0dGFjaG1lbnRzLFxuICAgICAgICBtZW50aW9ucyxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgfSk7XG4gICAgICBzZXRMYXJnZShmYWxzZSk7XG4gICAgfSxcbiAgICBbZHJhZnRBdHRhY2htZW50cywgb25TZW5kTWVzc2FnZSwgc2V0TGFyZ2VdXG4gICk7XG5cbiAgY29uc3QgbGF1bmNoQXR0YWNobWVudFBpY2tlciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBmaWxlSW5wdXQgPSBmaWxlSW5wdXRSZWYuY3VycmVudDtcbiAgICBpZiAoZmlsZUlucHV0KSB7XG4gICAgICAvLyBTZXR0aW5nIHRoZSB2YWx1ZSB0byBlbXB0eSBzbyB0aGF0IG9uQ2hhbmdlIGFsd2F5cyBmaXJlcyBpbiBjYXNlXG4gICAgICAvLyB5b3UgYWRkIG11bHRpcGxlIHBob3Rvcy5cbiAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgZnVuY3Rpb24gbWF5YmVFZGl0QXR0YWNobWVudChhdHRhY2htZW50OiBBdHRhY2htZW50RHJhZnRUeXBlKSB7XG4gICAgaWYgKCFpc0ltYWdlVHlwZVN1cHBvcnRlZChhdHRhY2htZW50LmNvbnRlbnRUeXBlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldEF0dGFjaG1lbnRUb0VkaXQoYXR0YWNobWVudCk7XG4gIH1cblxuICBjb25zdCBhdHRhY2hGaWxlU2hvcnRjdXQgPSB1c2VBdHRhY2hGaWxlU2hvcnRjdXQobGF1bmNoQXR0YWNobWVudFBpY2tlcik7XG4gIHVzZUtleWJvYXJkU2hvcnRjdXRzKGF0dGFjaEZpbGVTaG9ydGN1dCk7XG5cbiAgY29uc3QgZm9jdXNJbnB1dCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoaW5wdXRBcGlSZWYuY3VycmVudCkge1xuICAgICAgaW5wdXRBcGlSZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH1cbiAgfSwgW2lucHV0QXBpUmVmXSk7XG5cbiAgY29uc3Qgd2l0aFN0aWNrZXJzID1cbiAgICBjb3VudFN0aWNrZXJzKHtcbiAgICAgIGtub3duUGFja3MsXG4gICAgICBibGVzc2VkUGFja3MsXG4gICAgICBpbnN0YWxsZWRQYWNrcyxcbiAgICAgIHJlY2VpdmVkUGFja3MsXG4gICAgfSkgPiAwO1xuXG4gIGlmIChjb21wb3NpdGlvbkFwaSkge1xuICAgIC8vIFVzaW5nIGEgUmVhY3QuTXV0YWJsZVJlZk9iamVjdCwgc28gd2UgbmVlZCB0byByZWFzc2lnbiB0aGlzIHByb3AuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgY29tcG9zaXRpb25BcGkuY3VycmVudCA9IHtcbiAgICAgIGlzRGlydHk6ICgpID0+IGRpcnR5LFxuICAgICAgZm9jdXNJbnB1dCxcbiAgICAgIHNldERpc2FibGVkLFxuICAgICAgcmVzZXQ6ICgpID0+IHtcbiAgICAgICAgaWYgKGlucHV0QXBpUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICBpbnB1dEFwaVJlZi5jdXJyZW50LnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZXNldEVtb2ppUmVzdWx0czogKCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXRBcGlSZWYuY3VycmVudCkge1xuICAgICAgICAgIGlucHV0QXBpUmVmLmN1cnJlbnQucmVzZXRFbW9qaVJlc3VsdHMoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0RW1vamkgPSB1c2VDYWxsYmFjayhcbiAgICAoZTogRW1vamlQaWNrRGF0YVR5cGUpID0+IHtcbiAgICAgIGlmIChpbnB1dEFwaVJlZi5jdXJyZW50KSB7XG4gICAgICAgIGlucHV0QXBpUmVmLmN1cnJlbnQuaW5zZXJ0RW1vamkoZSk7XG4gICAgICAgIG9uUGlja0Vtb2ppKGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2lucHV0QXBpUmVmLCBvblBpY2tFbW9qaV1cbiAgKTtcblxuICBjb25zdCBoYW5kbGVUb2dnbGVMYXJnZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRMYXJnZShsID0+ICFsKTtcbiAgfSwgW3NldExhcmdlXSk7XG5cbiAgY29uc3Qgc2hvdWxkU2hvd01pY3JvcGhvbmUgPSAhbGFyZ2UgJiYgIWRyYWZ0QXR0YWNobWVudHMubGVuZ3RoICYmICFkcmFmdFRleHQ7XG5cbiAgY29uc3Qgc2hvd01lZGlhUXVhbGl0eVNlbGVjdG9yID0gZHJhZnRBdHRhY2htZW50cy5zb21lKGlzSW1hZ2VBdHRhY2htZW50KTtcblxuICBjb25zdCBsZWZ0SGFuZFNpZGVCdXR0b25zRnJhZ21lbnQgPSAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29tcG9zaXRpb25BcmVhX19idXR0b24tY2VsbFwiPlxuICAgICAgICA8RW1vamlCdXR0b25cbiAgICAgICAgICBlbW9qaUJ1dHRvbkFwaT17ZW1vamlCdXR0b25SZWZ9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBkb1NlbmQ9e2hhbmRsZUZvcmNlU2VuZH1cbiAgICAgICAgICBvblBpY2tFbW9qaT17aW5zZXJ0RW1vaml9XG4gICAgICAgICAgb25DbG9zZT17Zm9jdXNJbnB1dH1cbiAgICAgICAgICByZWNlbnRFbW9qaXM9e3JlY2VudEVtb2ppc31cbiAgICAgICAgICBza2luVG9uZT17c2tpblRvbmV9XG4gICAgICAgICAgb25TZXRTa2luVG9uZT17b25TZXRTa2luVG9uZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAge3Nob3dNZWRpYVF1YWxpdHlTZWxlY3RvciA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX2J1dHRvbi1jZWxsXCI+XG4gICAgICAgICAgPE1lZGlhUXVhbGl0eVNlbGVjdG9yXG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgaXNIaWdoUXVhbGl0eT17c2hvdWxkU2VuZEhpZ2hRdWFsaXR5QXR0YWNobWVudHN9XG4gICAgICAgICAgICBvblNlbGVjdFF1YWxpdHk9e29uU2VsZWN0TWVkaWFRdWFsaXR5fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC8+XG4gICk7XG5cbiAgY29uc3QgbWljQnV0dG9uRnJhZ21lbnQgPSBzaG91bGRTaG93TWljcm9waG9uZSA/IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbXBvc2l0aW9uQXJlYV9fYnV0dG9uLWNlbGxcIj5cbiAgICAgIDxBdWRpb0NhcHR1cmVcbiAgICAgICAgY2FuY2VsUmVjb3JkaW5nPXtjYW5jZWxSZWNvcmRpbmd9XG4gICAgICAgIGNvbXBsZXRlUmVjb3JkaW5nPXtjb21wbGV0ZVJlY29yZGluZ31cbiAgICAgICAgY29udmVyc2F0aW9uSWQ9e2NvbnZlcnNhdGlvbklkfVxuICAgICAgICBkcmFmdEF0dGFjaG1lbnRzPXtkcmFmdEF0dGFjaG1lbnRzfVxuICAgICAgICBlcnJvckRpYWxvZ0F1ZGlvUmVjb3JkZXJUeXBlPXtlcnJvckRpYWxvZ0F1ZGlvUmVjb3JkZXJUeXBlfVxuICAgICAgICBlcnJvclJlY29yZGluZz17ZXJyb3JSZWNvcmRpbmd9XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIHJlY29yZGluZ1N0YXRlPXtyZWNvcmRpbmdTdGF0ZX1cbiAgICAgICAgb25TZW5kQXVkaW9SZWNvcmRpbmc9eyhcbiAgICAgICAgICB2b2ljZU5vdGVBdHRhY2htZW50OiBJbk1lbW9yeUF0dGFjaG1lbnREcmFmdFR5cGVcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgZW1vamlCdXR0b25SZWYuY3VycmVudD8uY2xvc2UoKTtcbiAgICAgICAgICBvblNlbmRNZXNzYWdlKHsgdm9pY2VOb3RlQXR0YWNobWVudCB9KTtcbiAgICAgICAgfX1cbiAgICAgICAgc3RhcnRSZWNvcmRpbmc9e3N0YXJ0UmVjb3JkaW5nfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKSA6IG51bGw7XG5cbiAgY29uc3QgaXNSZWNvcmRpbmcgPSByZWNvcmRpbmdTdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdGUuUmVjb3JkaW5nO1xuICBjb25zdCBhdHRCdXR0b24gPVxuICAgIGxpbmtQcmV2aWV3UmVzdWx0IHx8IGlzUmVjb3JkaW5nID8gdW5kZWZpbmVkIDogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX2J1dHRvbi1jZWxsXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX2F0dGFjaC1maWxlXCJcbiAgICAgICAgICBvbkNsaWNrPXtsYXVuY2hBdHRhY2htZW50UGlja2VyfVxuICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ0NvbXBvc2l0aW9uQXJlYS0tYXR0YWNoLWZpbGUnKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgY29uc3Qgc2VuZEJ1dHRvbkZyYWdtZW50ID0gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbXBvc2l0aW9uQXJlYV9fcGxhY2Vob2xkZXJcIiAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX2J1dHRvbi1jZWxsXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX3NlbmQtYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVGb3JjZVNlbmR9XG4gICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignc2VuZE1lc3NhZ2VUb0NvbnRhY3QnKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApO1xuXG4gIGNvbnN0IHN0aWNrZXJCdXR0b25QbGFjZW1lbnQgPSBsYXJnZSA/ICd0b3Atc3RhcnQnIDogJ3RvcC1lbmQnO1xuICBjb25zdCBzdGlja2VyQnV0dG9uRnJhZ21lbnQgPSB3aXRoU3RpY2tlcnMgPyAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFfX2J1dHRvbi1jZWxsXCI+XG4gICAgICA8U3RpY2tlckJ1dHRvblxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBrbm93blBhY2tzPXtrbm93blBhY2tzfVxuICAgICAgICByZWNlaXZlZFBhY2tzPXtyZWNlaXZlZFBhY2tzfVxuICAgICAgICBpbnN0YWxsZWRQYWNrPXtpbnN0YWxsZWRQYWNrfVxuICAgICAgICBpbnN0YWxsZWRQYWNrcz17aW5zdGFsbGVkUGFja3N9XG4gICAgICAgIGJsZXNzZWRQYWNrcz17Ymxlc3NlZFBhY2tzfVxuICAgICAgICByZWNlbnRTdGlja2Vycz17cmVjZW50U3RpY2tlcnN9XG4gICAgICAgIGNsZWFySW5zdGFsbGVkU3RpY2tlclBhY2s9e2NsZWFySW5zdGFsbGVkU3RpY2tlclBhY2t9XG4gICAgICAgIG9uQ2xpY2tBZGRQYWNrPXtvbkNsaWNrQWRkUGFja31cbiAgICAgICAgb25QaWNrU3RpY2tlcj17b25QaWNrU3RpY2tlcn1cbiAgICAgICAgY2xlYXJTaG93SW50cm9kdWN0aW9uPXtjbGVhclNob3dJbnRyb2R1Y3Rpb259XG4gICAgICAgIHNob3dQaWNrZXJIaW50PXtzaG93UGlja2VySGludH1cbiAgICAgICAgY2xlYXJTaG93UGlja2VySGludD17Y2xlYXJTaG93UGlja2VySGludH1cbiAgICAgICAgcG9zaXRpb249e3N0aWNrZXJCdXR0b25QbGFjZW1lbnR9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApIDogbnVsbDtcblxuICAvLyBMaXN0ZW4gZm9yIGNtZC9jdHJsLXNoaWZ0LXggdG8gdG9nZ2xlIGxhcmdlIGNvbXBvc2l0aW9uIG1vZGVcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgc2hpZnRLZXksIGN0cmxLZXksIG1ldGFLZXkgfSA9IGU7XG4gICAgICBjb25zdCBrZXkgPSBLZXlib2FyZExheW91dC5sb29rdXAoZSk7XG4gICAgICAvLyBXaGVuIHVzaW5nIHRoZSBjdHJsIGtleSwgYGtleWAgaXMgYCdYJ2AuIFdoZW4gdXNpbmcgdGhlIGNtZCBrZXksIGBrZXlgIGlzIGAneCdgXG4gICAgICBjb25zdCB4S2V5ID0ga2V5ID09PSAneCcgfHwga2V5ID09PSAnWCc7XG4gICAgICBjb25zdCBjb21tYW5kS2V5ID0gZ2V0KHdpbmRvdywgJ3BsYXRmb3JtJykgPT09ICdkYXJ3aW4nICYmIG1ldGFLZXk7XG4gICAgICBjb25zdCBjb250cm9sS2V5ID0gZ2V0KHdpbmRvdywgJ3BsYXRmb3JtJykgIT09ICdkYXJ3aW4nICYmIGN0cmxLZXk7XG4gICAgICBjb25zdCBjb21tYW5kT3JDdHJsID0gY29tbWFuZEtleSB8fCBjb250cm9sS2V5O1xuXG4gICAgICAvLyBjbWQvY3RybC1zaGlmdC14XG4gICAgICBpZiAoeEtleSAmJiBzaGlmdEtleSAmJiBjb21tYW5kT3JDdHJsKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2V0TGFyZ2UoeCA9PiAheCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVyKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlcik7XG4gICAgfTtcbiAgfSwgW3NldExhcmdlXSk7XG5cbiAgaWYgKFxuICAgIGlzQmxvY2tlZCB8fFxuICAgIGFyZVdlUGVuZGluZyB8fFxuICAgIChtZXNzYWdlUmVxdWVzdHNFbmFibGVkICYmICFhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0KVxuICApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1lc3NhZ2VSZXF1ZXN0QWN0aW9uc1xuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBjb252ZXJzYXRpb25UeXBlPXtjb252ZXJzYXRpb25UeXBlfVxuICAgICAgICBpc0Jsb2NrZWQ9e2lzQmxvY2tlZH1cbiAgICAgICAgb25CbG9jaz17b25CbG9ja31cbiAgICAgICAgb25CbG9ja0FuZFJlcG9ydFNwYW09e29uQmxvY2tBbmRSZXBvcnRTcGFtfVxuICAgICAgICBvblVuYmxvY2s9e29uVW5ibG9ja31cbiAgICAgICAgb25EZWxldGU9e29uRGVsZXRlfVxuICAgICAgICBvbkFjY2VwdD17b25BY2NlcHR9XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChjb252ZXJzYXRpb25UeXBlID09PSAnZGlyZWN0JyAmJiBpc1NNU09ubHkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoW1xuICAgICAgICAgICdDb21wb3NpdGlvbkFyZWEnLFxuICAgICAgICAgICdDb21wb3NpdGlvbkFyZWEtLXNtcy1vbmx5JyxcbiAgICAgICAgICBpc0ZldGNoaW5nVVVJRCA/ICdDb21wb3NpdGlvbkFyZWEtLXBlbmRpbmcnIDogbnVsbCxcbiAgICAgICAgXSl9XG4gICAgICA+XG4gICAgICAgIHtpc0ZldGNoaW5nVVVJRCA/IChcbiAgICAgICAgICA8U3Bpbm5lclxuICAgICAgICAgICAgYXJpYUxhYmVsPXtpMThuKCdDb21wb3NpdGlvbkFyZWEtLXNtcy1vbmx5X19zcGlubmVyLWxhYmVsJyl9XG4gICAgICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIm1vZHVsZS1pbWFnZS1zcGlubmVyXCJcbiAgICAgICAgICAgIHN2Z1NpemU9XCJzbWFsbFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cIkNvbXBvc2l0aW9uQXJlYS0tc21zLW9ubHlfX3RpdGxlXCI+XG4gICAgICAgICAgICAgIHtpMThuKCdDb21wb3NpdGlvbkFyZWEtLXNtcy1vbmx5X190aXRsZScpfVxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIkNvbXBvc2l0aW9uQXJlYS0tc21zLW9ubHlfX2JvZHlcIj5cbiAgICAgICAgICAgICAge2kxOG4oJ0NvbXBvc2l0aW9uQXJlYS0tc21zLW9ubHlfX2JvZHknKX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyBJZiBubyBtZXNzYWdlIHJlcXVlc3QsIGJ1dCB3ZSBoYXZlbid0IHNoYXJlZCBwcm9maWxlIHlldCwgd2Ugc2hvdyBwcm9maWxlLXNoYXJpbmcgVUlcbiAgaWYgKFxuICAgICFsZWZ0ICYmXG4gICAgKGNvbnZlcnNhdGlvblR5cGUgPT09ICdkaXJlY3QnIHx8XG4gICAgICAoY29udmVyc2F0aW9uVHlwZSA9PT0gJ2dyb3VwJyAmJiBncm91cFZlcnNpb24gPT09IDEpKSAmJlxuICAgIGlzTWlzc2luZ01hbmRhdG9yeVByb2ZpbGVTaGFyaW5nXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICA8TWFuZGF0b3J5UHJvZmlsZVNoYXJpbmdBY3Rpb25zXG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIGNvbnZlcnNhdGlvblR5cGU9e2NvbnZlcnNhdGlvblR5cGV9XG4gICAgICAgIG9uQmxvY2s9e29uQmxvY2t9XG4gICAgICAgIG9uQmxvY2tBbmRSZXBvcnRTcGFtPXtvbkJsb2NrQW5kUmVwb3J0U3BhbX1cbiAgICAgICAgb25EZWxldGU9e29uRGVsZXRlfVxuICAgICAgICBvbkFjY2VwdD17b25BY2NlcHR9XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIC8vIElmIHRoaXMgaXMgYSBWMSBncm91cCwgbm93IGRpc2FibGVkIGVudGlyZWx5LCB3ZSBzaG93IFVJIHRvIGhlbHAgdGhlbSB1cGdyYWRlXG4gIGlmICghbGVmdCAmJiBpc0dyb3VwVjFBbmREaXNhYmxlZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R3JvdXBWMURpc2FibGVkQWN0aW9uc1xuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBvblN0YXJ0R3JvdXBNaWdyYXRpb249e29uU3RhcnRHcm91cE1pZ3JhdGlvbn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChhcmVXZVBlbmRpbmdBcHByb3ZhbCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R3JvdXBWMlBlbmRpbmdBcHByb3ZhbEFjdGlvbnNcbiAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgb25DYW5jZWxKb2luUmVxdWVzdD17b25DYW5jZWxKb2luUmVxdWVzdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChhbm5vdW5jZW1lbnRzT25seSAmJiAhYXJlV2VBZG1pbikge1xuICAgIHJldHVybiAoXG4gICAgICA8QW5ub3VuY2VtZW50c09ubHlHcm91cEJhbm5lclxuICAgICAgICBncm91cEFkbWlucz17Z3JvdXBBZG1pbnN9XG4gICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgIG9wZW5Db252ZXJzYXRpb249e29wZW5Db252ZXJzYXRpb259XG4gICAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJDb21wb3NpdGlvbkFyZWFcIj5cbiAgICAgIHthdHRhY2htZW50VG9FZGl0ICYmICd1cmwnIGluIGF0dGFjaG1lbnRUb0VkaXQgJiYgYXR0YWNobWVudFRvRWRpdC51cmwgJiYgKFxuICAgICAgICA8TWVkaWFFZGl0b3JcbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIGltYWdlU3JjPXthdHRhY2htZW50VG9FZGl0LnVybH1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRBdHRhY2htZW50VG9FZGl0KHVuZGVmaW5lZCl9XG4gICAgICAgICAgb25Eb25lPXtkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0F0dGFjaG1lbnQgPSB7XG4gICAgICAgICAgICAgIC4uLmF0dGFjaG1lbnRUb0VkaXQsXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9QTkcsXG4gICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgIHNpemU6IGRhdGEuYnl0ZUxlbmd0aCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGFkZEF0dGFjaG1lbnQoY29udmVyc2F0aW9uSWQsIG5ld0F0dGFjaG1lbnQpO1xuICAgICAgICAgICAgc2V0QXR0YWNobWVudFRvRWRpdCh1bmRlZmluZWQpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgaW5zdGFsbGVkUGFja3M9e2luc3RhbGxlZFBhY2tzfVxuICAgICAgICAgIHJlY2VudFN0aWNrZXJzPXtyZWNlbnRTdGlja2Vyc31cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbXBvc2l0aW9uQXJlYV9fdG9nZ2xlLWxhcmdlXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAnQ29tcG9zaXRpb25BcmVhX190b2dnbGUtbGFyZ2VfX2J1dHRvbicsXG4gICAgICAgICAgICBsYXJnZSA/ICdDb21wb3NpdGlvbkFyZWFfX3RvZ2dsZS1sYXJnZV9fYnV0dG9uLS1sYXJnZS1hY3RpdmUnIDogbnVsbFxuICAgICAgICAgICl9XG4gICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyB0aGUgdXNlciBmcm9tIHRhYmJpbmcgaGVyZVxuICAgICAgICAgIHRhYkluZGV4PXstMX1cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVUb2dnbGVMYXJnZX1cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdDb21wb3NpdGlvbkFyZWEtLWV4cGFuZCcpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAnQ29tcG9zaXRpb25BcmVhX19yb3cnLFxuICAgICAgICAgICdDb21wb3NpdGlvbkFyZWFfX3Jvdy0tY29sdW1uJ1xuICAgICAgICApfVxuICAgICAgPlxuICAgICAgICB7cXVvdGVkTWVzc2FnZVByb3BzICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInF1b3RlLXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxRdW90ZVxuICAgICAgICAgICAgICBpc0NvbXBvc2VcbiAgICAgICAgICAgICAgey4uLnF1b3RlZE1lc3NhZ2VQcm9wc31cbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja1F1b3RlZE1lc3NhZ2V9XG4gICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIG9uZSBpcyBmb3IgcmVkdXguLi5cbiAgICAgICAgICAgICAgICBzZXRRdW90ZWRNZXNzYWdlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgLy8gYW5kIHRoaXMgaXMgZm9yIGNvbnZlcnNhdGlvbl92aWV3LlxuICAgICAgICAgICAgICAgIGNsZWFyUXVvdGVkTWVzc2FnZT8uKCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICB7bGlua1ByZXZpZXdMb2FkaW5nICYmIGxpbmtQcmV2aWV3UmVzdWx0ICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByZXZpZXctd3JhcHBlclwiPlxuICAgICAgICAgICAgPFN0YWdlZExpbmtQcmV2aWV3XG4gICAgICAgICAgICAgIHsuLi5saW5rUHJldmlld1Jlc3VsdH1cbiAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgb25DbG9zZT17b25DbG9zZUxpbmtQcmV2aWV3fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge2RyYWZ0QXR0YWNobWVudHMubGVuZ3RoID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29tcG9zaXRpb25BcmVhX19hdHRhY2htZW50LWxpc3RcIj5cbiAgICAgICAgICAgIDxBdHRhY2htZW50TGlzdFxuICAgICAgICAgICAgICBhdHRhY2htZW50cz17ZHJhZnRBdHRhY2htZW50c31cbiAgICAgICAgICAgICAgY2FuRWRpdEltYWdlc1xuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICBvbkFkZEF0dGFjaG1lbnQ9e2xhdW5jaEF0dGFjaG1lbnRQaWNrZXJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2tBdHRhY2htZW50PXttYXliZUVkaXRBdHRhY2htZW50fVxuICAgICAgICAgICAgICBvbkNsb3NlPXtvbkNsZWFyQXR0YWNobWVudHN9XG4gICAgICAgICAgICAgIG9uQ2xvc2VBdHRhY2htZW50PXthdHRhY2htZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0YWNobWVudC5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICByZW1vdmVBdHRhY2htZW50KGNvbnZlcnNhdGlvbklkLCBhdHRhY2htZW50LnBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAnQ29tcG9zaXRpb25BcmVhX19yb3cnLFxuICAgICAgICAgIGxhcmdlID8gJ0NvbXBvc2l0aW9uQXJlYV9fcm93LS1wYWRkZWQnIDogbnVsbFxuICAgICAgICApfVxuICAgICAgPlxuICAgICAgICB7IWxhcmdlID8gbGVmdEhhbmRTaWRlQnV0dG9uc0ZyYWdtZW50IDogbnVsbH1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdDb21wb3NpdGlvbkFyZWFfX2lucHV0JyxcbiAgICAgICAgICAgIGxhcmdlID8gJ0NvbXBvc2l0aW9uQXJlYV9faW5wdXQtLXBhZGRlZCcgOiBudWxsXG4gICAgICAgICAgKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDb21wb3NpdGlvbklucHV0XG4gICAgICAgICAgICBjbGVhclF1b3RlZE1lc3NhZ2U9e2NsZWFyUXVvdGVkTWVzc2FnZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIGRyYWZ0Qm9keVJhbmdlcz17ZHJhZnRCb2R5UmFuZ2VzfVxuICAgICAgICAgICAgZHJhZnRUZXh0PXtkcmFmdFRleHR9XG4gICAgICAgICAgICBnZXRQcmVmZXJyZWRCYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2V9XG4gICAgICAgICAgICBnZXRRdW90ZWRNZXNzYWdlPXtnZXRRdW90ZWRNZXNzYWdlfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIGlucHV0QXBpPXtpbnB1dEFwaVJlZn1cbiAgICAgICAgICAgIGxhcmdlPXtsYXJnZX1cbiAgICAgICAgICAgIG9uRGlydHlDaGFuZ2U9e3NldERpcnR5fVxuICAgICAgICAgICAgb25FZGl0b3JTdGF0ZUNoYW5nZT17b25FZGl0b3JTdGF0ZUNoYW5nZX1cbiAgICAgICAgICAgIG9uUGlja0Vtb2ppPXtvblBpY2tFbW9qaX1cbiAgICAgICAgICAgIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9XG4gICAgICAgICAgICBvblRleHRUb29Mb25nPXtvblRleHRUb29Mb25nfVxuICAgICAgICAgICAgc2tpblRvbmU9e3NraW5Ub25lfVxuICAgICAgICAgICAgc29ydGVkR3JvdXBNZW1iZXJzPXtzb3J0ZWRHcm91cE1lbWJlcnN9XG4gICAgICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHshbGFyZ2UgPyAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIHtzdGlja2VyQnV0dG9uRnJhZ21lbnR9XG4gICAgICAgICAgICB7IWRpcnR5ID8gbWljQnV0dG9uRnJhZ21lbnQgOiBudWxsfVxuICAgICAgICAgICAge2F0dEJ1dHRvbn1cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYXJnZSA/IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdDb21wb3NpdGlvbkFyZWFfX3JvdycsXG4gICAgICAgICAgICAnQ29tcG9zaXRpb25BcmVhX19yb3ctLWNvbnRyb2wtcm93J1xuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICB7bGVmdEhhbmRTaWRlQnV0dG9uc0ZyYWdtZW50fVxuICAgICAgICAgIHtzdGlja2VyQnV0dG9uRnJhZ21lbnR9XG4gICAgICAgICAge2F0dEJ1dHRvbn1cbiAgICAgICAgICB7IWRpcnR5ID8gbWljQnV0dG9uRnJhZ21lbnQgOiBudWxsfVxuICAgICAgICAgIHtkaXJ0eSB8fCAhc2hvdWxkU2hvd01pY3JvcGhvbmUgPyBzZW5kQnV0dG9uRnJhZ21lbnQgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgICAgPENvbXBvc2l0aW9uVXBsb2FkXG4gICAgICAgIGFkZEF0dGFjaG1lbnQ9e2FkZEF0dGFjaG1lbnR9XG4gICAgICAgIGFkZFBlbmRpbmdBdHRhY2htZW50PXthZGRQZW5kaW5nQXR0YWNobWVudH1cbiAgICAgICAgY29udmVyc2F0aW9uSWQ9e2NvbnZlcnNhdGlvbklkfVxuICAgICAgICBkcmFmdEF0dGFjaG1lbnRzPXtkcmFmdEF0dGFjaG1lbnRzfVxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBwcm9jZXNzQXR0YWNobWVudHM9e3Byb2Nlc3NBdHRhY2htZW50c31cbiAgICAgICAgcmVtb3ZlQXR0YWNobWVudD17cmVtb3ZlQXR0YWNobWVudH1cbiAgICAgICAgcmVmPXtmaWxlSW5wdXRSZWZ9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBZ0U7QUFDaEUsb0JBQW9CO0FBQ3BCLHdCQUF1QjtBQVF2QiwyQkFBK0I7QUFFL0IscUJBQXdCO0FBS3hCLHlCQUE0QjtBQUU1QiwyQkFBOEI7QUFLOUIsOEJBQWlDO0FBRWpDLG1DQUFzQztBQUV0QyxvQ0FBdUM7QUFFdkMsMkNBQThDO0FBQzlDLDBDQUE2QztBQUM3Qyw0QkFBK0I7QUFLL0Isd0JBQWtDO0FBQ2xDLDBCQUE2QjtBQUM3QiwrQkFBa0M7QUFLbEMsNENBQStDO0FBQy9DLGtDQUFxQztBQUVyQyxtQkFBc0I7QUFDdEIsK0JBQWtDO0FBQ2xDLGlCQUE4QjtBQUM5QixrQ0FHTztBQUNQLHlCQUE0QjtBQUM1QixrQkFBMEI7QUFDMUIsMEJBQXFDO0FBQ3JDLHFCQUFnQztBQTJHekIsTUFBTSxrQkFBa0Isd0JBQUM7QUFBQSxFQUU5QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUdBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVB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cUI7QUFBQSxJQUN2QjtBQUFBLEdBQ0YsQ0FDRixHQUVELHNCQUFzQixxQkFDckIsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsT0FDSztBQUFBLElBQ0o7QUFBQSxJQUNBLFNBQVM7QUFBQSxHQUNYLENBQ0YsR0FFRCxpQkFBaUIsU0FDaEIsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUNiLG1EQUFDO0FBQUEsSUFDQyxhQUFhO0FBQUEsSUFDYixlQUFhO0FBQUEsSUFDYjtBQUFBLElBQ0EsaUJBQWlCO0FBQUEsSUFDakIsbUJBQW1CO0FBQUEsSUFDbkIsU0FBUztBQUFBLElBQ1QsbUJBQW1CLGdCQUFjO0FBQy9CLFVBQUksV0FBVyxNQUFNO0FBQ25CLHlCQUFpQixnQkFBZ0IsV0FBVyxJQUFJO0FBQUEsTUFDbEQ7QUFBQSxJQUNGO0FBQUEsR0FDRixDQUNGLElBQ0UsSUFDTixHQUNBLG1EQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULHdCQUNBLFFBQVEsaUNBQWlDLElBQzNDO0FBQUEsS0FFQyxDQUFDLFFBQVEsOEJBQThCLE1BQ3hDLG1EQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULDBCQUNBLFFBQVEsbUNBQW1DLElBQzdDO0FBQUEsS0FFQSxtREFBQztBQUFBLElBQ0M7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLFVBQVU7QUFBQSxJQUNWO0FBQUEsSUFDQSxlQUFlO0FBQUEsSUFDZjtBQUFBLElBQ0E7QUFBQSxJQUNBLFVBQVU7QUFBQSxJQUNWO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsR0FDRixDQUNGLEdBQ0MsQ0FBQyxRQUNBLHdGQUNHLHVCQUNBLENBQUMsUUFBUSxvQkFBb0IsTUFDN0IsU0FDSCxJQUNFLElBQ04sR0FDQyxRQUNDLG1EQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULHdCQUNBLG1DQUNGO0FBQUEsS0FFQyw2QkFDQSx1QkFDQSxXQUNBLENBQUMsUUFBUSxvQkFBb0IsTUFDN0IsU0FBUyxDQUFDLHVCQUF1QixxQkFBcUIsSUFDekQsSUFDRSxNQUNKLG1EQUFDO0FBQUEsSUFDQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsS0FBSztBQUFBLEdBQ1AsQ0FDRjtBQUVKLEdBdGpCK0I7IiwKICAibmFtZXMiOiBbXQp9Cg==
