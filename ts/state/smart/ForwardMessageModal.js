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
var ForwardMessageModal_exports = {};
__export(ForwardMessageModal_exports, {
  SmartForwardMessageModal: () => SmartForwardMessageModal
});
module.exports = __toCommonJS(ForwardMessageModal_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var log = __toESM(require("../../logging/log"));
var import_ForwardMessageModal = require("../../components/ForwardMessageModal");
var import_LinkPreview = require("../../types/LinkPreview");
var import_ToastMessageBodyTooLong = require("../../components/ToastMessageBodyTooLong");
var import_conversations = require("../selectors/conversations");
var import_items = require("../selectors/items");
var import_user = require("../selectors/user");
var import_linkPreviews = require("../selectors/linkPreviews");
var import_getMessageById = require("../../messages/getMessageById");
var import_badges = require("../selectors/badges");
var import_maybeForwardMessage = require("../../util/maybeForwardMessage");
var import_LinkPreview2 = require("../../services/LinkPreview");
var import_emojis = require("../selectors/emojis");
var import_showToast = require("../../util/showToast");
var import_emojis2 = require("../ducks/emojis");
var import_items2 = require("../ducks/items");
var import_globalModals = require("../ducks/globalModals");
var import_linkPreviews2 = require("../ducks/linkPreviews");
var import_message = require("../selectors/message");
var import_getTextWithMentions = require("../../util/getTextWithMentions");
function renderMentions(message, conversationSelector) {
  const { text } = message;
  if (!text) {
    return text;
  }
  const bodyRanges = (0, import_message.processBodyRanges)(message, {
    conversationSelector
  });
  if (bodyRanges && bodyRanges.length) {
    return (0, import_getTextWithMentions.getTextWithMentions)(bodyRanges, text);
  }
  return text;
}
function SmartForwardMessageModal() {
  const forwardMessageProps = (0, import_react_redux.useSelector)((state) => state.globalModals.forwardMessageProps);
  const candidateConversations = (0, import_react_redux.useSelector)(import_conversations.getAllComposableConversations);
  const getPreferredBadge = (0, import_react_redux.useSelector)(import_badges.getPreferredBadgeSelector);
  const getConversation = (0, import_react_redux.useSelector)(import_conversations.getConversationSelector);
  const i18n = (0, import_react_redux.useSelector)(import_user.getIntl);
  const linkPreviewForSource = (0, import_react_redux.useSelector)(import_linkPreviews.getLinkPreview);
  const recentEmojis = (0, import_react_redux.useSelector)(import_emojis.selectRecentEmojis);
  const regionCode = (0, import_react_redux.useSelector)(import_user.getRegionCode);
  const skinTone = (0, import_react_redux.useSelector)(import_items.getEmojiSkinTone);
  const theme = (0, import_react_redux.useSelector)(import_user.getTheme);
  const { removeLinkPreview } = (0, import_linkPreviews2.useLinkPreviewActions)();
  const { onUseEmoji: onPickEmoji } = (0, import_emojis2.useActions)();
  const { onSetSkinTone } = (0, import_items2.useActions)();
  const { toggleForwardMessageModal } = (0, import_globalModals.useGlobalModalActions)();
  if (!forwardMessageProps) {
    return null;
  }
  const { attachments = [] } = forwardMessageProps;
  function closeModal() {
    (0, import_LinkPreview2.resetLinkPreview)();
    toggleForwardMessageModal();
  }
  const cleanedBody = renderMentions(forwardMessageProps, getConversation);
  return /* @__PURE__ */ import_react.default.createElement(import_ForwardMessageModal.ForwardMessageModal, {
    attachments,
    candidateConversations,
    doForwardMessage: async (conversationIds, messageBody, includedAttachments, linkPreview) => {
      try {
        const message = await (0, import_getMessageById.getMessageById)(forwardMessageProps.id);
        if (!message) {
          throw new Error("No message found");
        }
        const didForwardSuccessfully = await (0, import_maybeForwardMessage.maybeForwardMessage)(message.attributes, conversationIds, messageBody, includedAttachments, linkPreview);
        if (didForwardSuccessfully) {
          closeModal();
        }
      } catch (err) {
        log.warn("doForwardMessage", err && err.stack ? err.stack : err);
      }
    },
    getPreferredBadge,
    hasContact: Boolean(forwardMessageProps.contact),
    i18n,
    isSticker: Boolean(forwardMessageProps.isSticker),
    linkPreview: linkPreviewForSource(import_LinkPreview.LinkPreviewSourceType.ForwardMessageModal),
    messageBody: cleanedBody,
    onClose: closeModal,
    onEditorStateChange: (messageText, _, caretLocation) => {
      if (!attachments.length) {
        (0, import_LinkPreview2.maybeGrabLinkPreview)(messageText, import_LinkPreview.LinkPreviewSourceType.ForwardMessageModal, caretLocation);
      }
    },
    onPickEmoji,
    onSetSkinTone,
    onTextTooLong: () => (0, import_showToast.showToast)(import_ToastMessageBodyTooLong.ToastMessageBodyTooLong),
    recentEmojis,
    regionCode,
    removeLinkPreview,
    skinTone,
    theme
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartForwardMessageModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRm9yd2FyZE1lc3NhZ2VNb2RhbC50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgdHlwZSB7IEJvZHlSYW5nZVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgRm9yd2FyZE1lc3NhZ2VQcm9wc1R5cGUgfSBmcm9tICcuLi9kdWNrcy9nbG9iYWxNb2RhbHMnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBGb3J3YXJkTWVzc2FnZU1vZGFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9Gb3J3YXJkTWVzc2FnZU1vZGFsJztcbmltcG9ydCB7IExpbmtQcmV2aWV3U291cmNlVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB7IFRvYXN0TWVzc2FnZUJvZHlUb29Mb25nIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9Ub2FzdE1lc3NhZ2VCb2R5VG9vTG9uZyc7XG5pbXBvcnQgdHlwZSB7IEdldENvbnZlcnNhdGlvbkJ5SWRUeXBlIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0QWxsQ29tcG9zYWJsZUNvbnZlcnNhdGlvbnMsXG4gIGdldENvbnZlcnNhdGlvblNlbGVjdG9yLFxufSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRFbW9qaVNraW5Ub25lIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2l0ZW1zJztcbmltcG9ydCB7IGdldEludGwsIGdldFRoZW1lLCBnZXRSZWdpb25Db2RlIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgZ2V0TGlua1ByZXZpZXcgfSBmcm9tICcuLi9zZWxlY3RvcnMvbGlua1ByZXZpZXdzJztcbmltcG9ydCB7IGdldE1lc3NhZ2VCeUlkIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvZ2V0TWVzc2FnZUJ5SWQnO1xuaW1wb3J0IHsgZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHsgbWF5YmVGb3J3YXJkTWVzc2FnZSB9IGZyb20gJy4uLy4uL3V0aWwvbWF5YmVGb3J3YXJkTWVzc2FnZSc7XG5pbXBvcnQge1xuICBtYXliZUdyYWJMaW5rUHJldmlldyxcbiAgcmVzZXRMaW5rUHJldmlldyxcbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvTGlua1ByZXZpZXcnO1xuaW1wb3J0IHsgc2VsZWN0UmVjZW50RW1vamlzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2Vtb2ppcyc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi8uLi91dGlsL3Nob3dUb2FzdCc7XG5pbXBvcnQgeyB1c2VBY3Rpb25zIGFzIHVzZUVtb2ppQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2Vtb2ppcyc7XG5pbXBvcnQgeyB1c2VBY3Rpb25zIGFzIHVzZUl0ZW1zQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2l0ZW1zJztcbmltcG9ydCB7IHVzZUdsb2JhbE1vZGFsQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyB1c2VMaW5rUHJldmlld0FjdGlvbnMgfSBmcm9tICcuLi9kdWNrcy9saW5rUHJldmlld3MnO1xuaW1wb3J0IHsgcHJvY2Vzc0JvZHlSYW5nZXMgfSBmcm9tICcuLi9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgeyBnZXRUZXh0V2l0aE1lbnRpb25zIH0gZnJvbSAnLi4vLi4vdXRpbC9nZXRUZXh0V2l0aE1lbnRpb25zJztcblxuZnVuY3Rpb24gcmVuZGVyTWVudGlvbnMoXG4gIG1lc3NhZ2U6IEZvcndhcmRNZXNzYWdlUHJvcHNUeXBlLFxuICBjb252ZXJzYXRpb25TZWxlY3RvcjogR2V0Q29udmVyc2F0aW9uQnlJZFR5cGVcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgdGV4dCB9ID0gbWVzc2FnZTtcblxuICBpZiAoIXRleHQpIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIGNvbnN0IGJvZHlSYW5nZXMgPSBwcm9jZXNzQm9keVJhbmdlcyhtZXNzYWdlLCB7XG4gICAgY29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIH0pO1xuXG4gIGlmIChib2R5UmFuZ2VzICYmIGJvZHlSYW5nZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGdldFRleHRXaXRoTWVudGlvbnMoYm9keVJhbmdlcywgdGV4dCk7XG4gIH1cblxuICByZXR1cm4gdGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNtYXJ0Rm9yd2FyZE1lc3NhZ2VNb2RhbCgpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBmb3J3YXJkTWVzc2FnZVByb3BzID0gdXNlU2VsZWN0b3I8XG4gICAgU3RhdGVUeXBlLFxuICAgIEZvcndhcmRNZXNzYWdlUHJvcHNUeXBlIHwgdW5kZWZpbmVkXG4gID4oc3RhdGUgPT4gc3RhdGUuZ2xvYmFsTW9kYWxzLmZvcndhcmRNZXNzYWdlUHJvcHMpO1xuICBjb25zdCBjYW5kaWRhdGVDb252ZXJzYXRpb25zID0gdXNlU2VsZWN0b3IoZ2V0QWxsQ29tcG9zYWJsZUNvbnZlcnNhdGlvbnMpO1xuICBjb25zdCBnZXRQcmVmZXJyZWRCYWRnZSA9IHVzZVNlbGVjdG9yKGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3IpO1xuICBjb25zdCBnZXRDb252ZXJzYXRpb24gPSB1c2VTZWxlY3RvcihnZXRDb252ZXJzYXRpb25TZWxlY3Rvcik7XG4gIGNvbnN0IGkxOG4gPSB1c2VTZWxlY3RvcihnZXRJbnRsKTtcbiAgY29uc3QgbGlua1ByZXZpZXdGb3JTb3VyY2UgPSB1c2VTZWxlY3RvcihnZXRMaW5rUHJldmlldyk7XG4gIGNvbnN0IHJlY2VudEVtb2ppcyA9IHVzZVNlbGVjdG9yKHNlbGVjdFJlY2VudEVtb2ppcyk7XG4gIGNvbnN0IHJlZ2lvbkNvZGUgPSB1c2VTZWxlY3RvcihnZXRSZWdpb25Db2RlKTtcbiAgY29uc3Qgc2tpblRvbmUgPSB1c2VTZWxlY3RvcihnZXRFbW9qaVNraW5Ub25lKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VTZWxlY3RvcihnZXRUaGVtZSk7XG5cbiAgY29uc3QgeyByZW1vdmVMaW5rUHJldmlldyB9ID0gdXNlTGlua1ByZXZpZXdBY3Rpb25zKCk7XG4gIGNvbnN0IHsgb25Vc2VFbW9qaTogb25QaWNrRW1vamkgfSA9IHVzZUVtb2ppQWN0aW9ucygpO1xuICBjb25zdCB7IG9uU2V0U2tpblRvbmUgfSA9IHVzZUl0ZW1zQWN0aW9ucygpO1xuICBjb25zdCB7IHRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWwgfSA9IHVzZUdsb2JhbE1vZGFsQWN0aW9ucygpO1xuXG4gIGlmICghZm9yd2FyZE1lc3NhZ2VQcm9wcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgeyBhdHRhY2htZW50cyA9IFtdIH0gPSBmb3J3YXJkTWVzc2FnZVByb3BzO1xuXG4gIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgcmVzZXRMaW5rUHJldmlldygpO1xuICAgIHRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWwoKTtcbiAgfVxuXG4gIGNvbnN0IGNsZWFuZWRCb2R5ID0gcmVuZGVyTWVudGlvbnMoZm9yd2FyZE1lc3NhZ2VQcm9wcywgZ2V0Q29udmVyc2F0aW9uKTtcblxuICByZXR1cm4gKFxuICAgIDxGb3J3YXJkTWVzc2FnZU1vZGFsXG4gICAgICBhdHRhY2htZW50cz17YXR0YWNobWVudHN9XG4gICAgICBjYW5kaWRhdGVDb252ZXJzYXRpb25zPXtjYW5kaWRhdGVDb252ZXJzYXRpb25zfVxuICAgICAgZG9Gb3J3YXJkTWVzc2FnZT17YXN5bmMgKFxuICAgICAgICBjb252ZXJzYXRpb25JZHMsXG4gICAgICAgIG1lc3NhZ2VCb2R5LFxuICAgICAgICBpbmNsdWRlZEF0dGFjaG1lbnRzLFxuICAgICAgICBsaW5rUHJldmlld1xuICAgICAgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKGZvcndhcmRNZXNzYWdlUHJvcHMuaWQpO1xuICAgICAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtZXNzYWdlIGZvdW5kJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZGlkRm9yd2FyZFN1Y2Nlc3NmdWxseSA9IGF3YWl0IG1heWJlRm9yd2FyZE1lc3NhZ2UoXG4gICAgICAgICAgICBtZXNzYWdlLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZHMsXG4gICAgICAgICAgICBtZXNzYWdlQm9keSxcbiAgICAgICAgICAgIGluY2x1ZGVkQXR0YWNobWVudHMsXG4gICAgICAgICAgICBsaW5rUHJldmlld1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoZGlkRm9yd2FyZFN1Y2Nlc3NmdWxseSkge1xuICAgICAgICAgICAgY2xvc2VNb2RhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ2RvRm9yd2FyZE1lc3NhZ2UnLCBlcnIgJiYgZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyKTtcbiAgICAgICAgfVxuICAgICAgfX1cbiAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgIGhhc0NvbnRhY3Q9e0Jvb2xlYW4oZm9yd2FyZE1lc3NhZ2VQcm9wcy5jb250YWN0KX1cbiAgICAgIGkxOG49e2kxOG59XG4gICAgICBpc1N0aWNrZXI9e0Jvb2xlYW4oZm9yd2FyZE1lc3NhZ2VQcm9wcy5pc1N0aWNrZXIpfVxuICAgICAgbGlua1ByZXZpZXc9e2xpbmtQcmV2aWV3Rm9yU291cmNlKFxuICAgICAgICBMaW5rUHJldmlld1NvdXJjZVR5cGUuRm9yd2FyZE1lc3NhZ2VNb2RhbFxuICAgICAgKX1cbiAgICAgIG1lc3NhZ2VCb2R5PXtjbGVhbmVkQm9keX1cbiAgICAgIG9uQ2xvc2U9e2Nsb3NlTW9kYWx9XG4gICAgICBvbkVkaXRvclN0YXRlQ2hhbmdlPXsoXG4gICAgICAgIG1lc3NhZ2VUZXh0OiBzdHJpbmcsXG4gICAgICAgIF86IEFycmF5PEJvZHlSYW5nZVR5cGU+LFxuICAgICAgICBjYXJldExvY2F0aW9uPzogbnVtYmVyXG4gICAgICApID0+IHtcbiAgICAgICAgaWYgKCFhdHRhY2htZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXliZUdyYWJMaW5rUHJldmlldyhcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0LFxuICAgICAgICAgICAgTGlua1ByZXZpZXdTb3VyY2VUeXBlLkZvcndhcmRNZXNzYWdlTW9kYWwsXG4gICAgICAgICAgICBjYXJldExvY2F0aW9uXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfX1cbiAgICAgIG9uUGlja0Vtb2ppPXtvblBpY2tFbW9qaX1cbiAgICAgIG9uU2V0U2tpblRvbmU9e29uU2V0U2tpblRvbmV9XG4gICAgICBvblRleHRUb29Mb25nPXsoKSA9PiBzaG93VG9hc3QoVG9hc3RNZXNzYWdlQm9keVRvb0xvbmcpfVxuICAgICAgcmVjZW50RW1vamlzPXtyZWNlbnRFbW9qaXN9XG4gICAgICByZWdpb25Db2RlPXtyZWdpb25Db2RlfVxuICAgICAgcmVtb3ZlTGlua1ByZXZpZXc9e3JlbW92ZUxpbmtQcmV2aWV3fVxuICAgICAgc2tpblRvbmU9e3NraW5Ub25lfVxuICAgICAgdGhlbWU9e3RoZW1lfVxuICAgIC8+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUE0QjtBQUk1QixVQUFxQjtBQUNyQixpQ0FBb0M7QUFDcEMseUJBQXNDO0FBQ3RDLHFDQUF3QztBQUV4QywyQkFHTztBQUNQLG1CQUFpQztBQUNqQyxrQkFBaUQ7QUFDakQsMEJBQStCO0FBQy9CLDRCQUErQjtBQUMvQixvQkFBMEM7QUFDMUMsaUNBQW9DO0FBQ3BDLDBCQUdPO0FBQ1Asb0JBQW1DO0FBQ25DLHVCQUEwQjtBQUMxQixxQkFBOEM7QUFDOUMsb0JBQThDO0FBQzlDLDBCQUFzQztBQUN0QywyQkFBc0M7QUFDdEMscUJBQWtDO0FBQ2xDLGlDQUFvQztBQUVwQyx3QkFDRSxTQUNBLHNCQUNvQjtBQUNwQixRQUFNLEVBQUUsU0FBUztBQUVqQixNQUFJLENBQUMsTUFBTTtBQUNULFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxhQUFhLHNDQUFrQixTQUFTO0FBQUEsSUFDNUM7QUFBQSxFQUNGLENBQUM7QUFFRCxNQUFJLGNBQWMsV0FBVyxRQUFRO0FBQ25DLFdBQU8sb0RBQW9CLFlBQVksSUFBSTtBQUFBLEVBQzdDO0FBRUEsU0FBTztBQUNUO0FBbkJTLEFBcUJGLG9DQUF3RDtBQUM3RCxRQUFNLHNCQUFzQixvQ0FHMUIsV0FBUyxNQUFNLGFBQWEsbUJBQW1CO0FBQ2pELFFBQU0seUJBQXlCLG9DQUFZLGtEQUE2QjtBQUN4RSxRQUFNLG9CQUFvQixvQ0FBWSx1Q0FBeUI7QUFDL0QsUUFBTSxrQkFBa0Isb0NBQVksNENBQXVCO0FBQzNELFFBQU0sT0FBTyxvQ0FBWSxtQkFBTztBQUNoQyxRQUFNLHVCQUF1QixvQ0FBWSxrQ0FBYztBQUN2RCxRQUFNLGVBQWUsb0NBQVksZ0NBQWtCO0FBQ25ELFFBQU0sYUFBYSxvQ0FBWSx5QkFBYTtBQUM1QyxRQUFNLFdBQVcsb0NBQVksNkJBQWdCO0FBQzdDLFFBQU0sUUFBUSxvQ0FBWSxvQkFBUTtBQUVsQyxRQUFNLEVBQUUsc0JBQXNCLGdEQUFzQjtBQUNwRCxRQUFNLEVBQUUsWUFBWSxnQkFBZ0IsK0JBQWdCO0FBQ3BELFFBQU0sRUFBRSxrQkFBa0IsOEJBQWdCO0FBQzFDLFFBQU0sRUFBRSw4QkFBOEIsK0NBQXNCO0FBRTVELE1BQUksQ0FBQyxxQkFBcUI7QUFDeEIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLEVBQUUsY0FBYyxDQUFDLE1BQU07QUFFN0Isd0JBQXNCO0FBQ3BCLDhDQUFpQjtBQUNqQiw4QkFBMEI7QUFBQSxFQUM1QjtBQUhTLEFBS1QsUUFBTSxjQUFjLGVBQWUscUJBQXFCLGVBQWU7QUFFdkUsU0FDRSxtREFBQztBQUFBLElBQ0M7QUFBQSxJQUNBO0FBQUEsSUFDQSxrQkFBa0IsT0FDaEIsaUJBQ0EsYUFDQSxxQkFDQSxnQkFDRztBQUNILFVBQUk7QUFDRixjQUFNLFVBQVUsTUFBTSwwQ0FBZSxvQkFBb0IsRUFBRTtBQUMzRCxZQUFJLENBQUMsU0FBUztBQUNaLGdCQUFNLElBQUksTUFBTSxrQkFBa0I7QUFBQSxRQUNwQztBQUVBLGNBQU0seUJBQXlCLE1BQU0sb0RBQ25DLFFBQVEsWUFDUixpQkFDQSxhQUNBLHFCQUNBLFdBQ0Y7QUFFQSxZQUFJLHdCQUF3QjtBQUMxQixxQkFBVztBQUFBLFFBQ2I7QUFBQSxNQUNGLFNBQVMsS0FBUDtBQUNBLFlBQUksS0FBSyxvQkFBb0IsT0FBTyxJQUFJLFFBQVEsSUFBSSxRQUFRLEdBQUc7QUFBQSxNQUNqRTtBQUFBLElBQ0Y7QUFBQSxJQUNBO0FBQUEsSUFDQSxZQUFZLFFBQVEsb0JBQW9CLE9BQU87QUFBQSxJQUMvQztBQUFBLElBQ0EsV0FBVyxRQUFRLG9CQUFvQixTQUFTO0FBQUEsSUFDaEQsYUFBYSxxQkFDWCx5Q0FBc0IsbUJBQ3hCO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxxQkFBcUIsQ0FDbkIsYUFDQSxHQUNBLGtCQUNHO0FBQ0gsVUFBSSxDQUFDLFlBQVksUUFBUTtBQUN2QixzREFDRSxhQUNBLHlDQUFzQixxQkFDdEIsYUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLGVBQWUsTUFBTSxnQ0FBVSxzREFBdUI7QUFBQSxJQUN0RDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxHQUNGO0FBRUo7QUFoR2dCIiwKICAibmFtZXMiOiBbXQp9Cg==
