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
var StoryCreator_exports = {};
__export(StoryCreator_exports, {
  StoryCreator: () => StoryCreator
});
module.exports = __toCommonJS(StoryCreator_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_MIME = require("../types/MIME");
var import_Attachment = require("../types/Attachment");
var import_SendStoryModal = require("./SendStoryModal");
var import_MediaEditor = require("./MediaEditor");
var import_TextStoryCreator = require("./TextStoryCreator");
const StoryCreator = /* @__PURE__ */ __name(({
  candidateConversations,
  debouncedMaybeGrabLinkPreview,
  distributionLists,
  file,
  getPreferredBadge,
  groupConversations,
  groupStories,
  i18n,
  installedPacks,
  linkPreview,
  me,
  onClose,
  onDistributionListCreated,
  onSend,
  processAttachment,
  recentStickers,
  signalConnections,
  tagGroupsAsNewGroupStory
}) => {
  const [draftAttachment, setDraftAttachment] = (0, import_react.useState)();
  const [attachmentUrl, setAttachmentUrl] = (0, import_react.useState)();
  (0, import_react.useEffect)(() => {
    let url;
    let unmounted = false;
    async function loadAttachment() {
      if (!file || unmounted) {
        return;
      }
      const attachment = await processAttachment(file);
      if (!attachment || unmounted) {
        return;
      }
      if ((0, import_Attachment.isVideoAttachment)(attachment)) {
        setDraftAttachment(attachment);
      } else if (attachment && (0, import_lodash.has)(attachment, "data")) {
        url = URL.createObjectURL(new Blob([(0, import_lodash.get)(attachment, "data")]));
        setAttachmentUrl(url);
      }
    }
    loadAttachment();
    return () => {
      unmounted = true;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file, processAttachment]);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, draftAttachment && /* @__PURE__ */ import_react.default.createElement(import_SendStoryModal.SendStoryModal, {
    candidateConversations,
    distributionLists,
    getPreferredBadge,
    groupConversations,
    groupStories,
    i18n,
    me,
    onClose: () => setDraftAttachment(void 0),
    onDistributionListCreated,
    onSend: (listIds, groupIds) => {
      onSend(listIds, groupIds, draftAttachment);
      setDraftAttachment(void 0);
      onClose();
    },
    signalConnections,
    tagGroupsAsNewGroupStory
  }), attachmentUrl && /* @__PURE__ */ import_react.default.createElement(import_MediaEditor.MediaEditor, {
    doneButtonLabel: i18n("next2"),
    i18n,
    imageSrc: attachmentUrl,
    installedPacks,
    onClose,
    onDone: (data) => {
      setDraftAttachment({
        contentType: import_MIME.IMAGE_JPEG,
        data,
        size: data.byteLength
      });
    },
    recentStickers
  }), !file && /* @__PURE__ */ import_react.default.createElement(import_TextStoryCreator.TextStoryCreator, {
    debouncedMaybeGrabLinkPreview,
    i18n,
    linkPreview,
    onClose,
    onDone: (textAttachment) => {
      setDraftAttachment({
        contentType: import_MIME.TEXT_ATTACHMENT,
        textAttachment,
        size: textAttachment.text?.length || 0
      });
    }
  }));
}, "StoryCreator");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryCreator
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlDcmVhdG9yLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldCwgaGFzIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUge1xuICBBdHRhY2htZW50VHlwZSxcbiAgSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlLFxufSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rUHJldmlld1NvdXJjZVR5cGUgfSBmcm9tICcuLi90eXBlcy9MaW5rUHJldmlldyc7XG5pbXBvcnQgdHlwZSB7IExpbmtQcmV2aWV3VHlwZSB9IGZyb20gJy4uL3R5cGVzL21lc3NhZ2UvTGlua1ByZXZpZXdzJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBTdGlja2VyQnV0dG9uUHJvcHMgfSBmcm9tICcuL3N0aWNrZXJzL1N0aWNrZXJCdXR0b24nO1xuaW1wb3J0IHR5cGUgeyBTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuXG5pbXBvcnQgeyBJTUFHRV9KUEVHLCBURVhUX0FUVEFDSE1FTlQgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IGlzVmlkZW9BdHRhY2htZW50IH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBTZW5kU3RvcnlNb2RhbCB9IGZyb20gJy4vU2VuZFN0b3J5TW9kYWwnO1xuXG5pbXBvcnQgeyBNZWRpYUVkaXRvciB9IGZyb20gJy4vTWVkaWFFZGl0b3InO1xuaW1wb3J0IHsgVGV4dFN0b3J5Q3JlYXRvciB9IGZyb20gJy4vVGV4dFN0b3J5Q3JlYXRvcic7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgY2FuZGlkYXRlQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGRlYm91bmNlZE1heWJlR3JhYkxpbmtQcmV2aWV3OiAoXG4gICAgbWVzc2FnZTogc3RyaW5nLFxuICAgIHNvdXJjZTogTGlua1ByZXZpZXdTb3VyY2VUeXBlXG4gICkgPT4gdW5rbm93bjtcbiAgZGlzdHJpYnV0aW9uTGlzdHM6IEFycmF5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlPjtcbiAgZmlsZT86IEZpbGU7XG4gIGdldFByZWZlcnJlZEJhZGdlOiBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZTtcbiAgZ3JvdXBDb252ZXJzYXRpb25zOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgZ3JvdXBTdG9yaWVzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbGlua1ByZXZpZXc/OiBMaW5rUHJldmlld1R5cGU7XG4gIG1lOiBDb252ZXJzYXRpb25UeXBlO1xuICBvbkNsb3NlOiAoKSA9PiB1bmtub3duO1xuICBvbkRpc3RyaWJ1dGlvbkxpc3RDcmVhdGVkOiAoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHZpZXdlclV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT5cbiAgKSA9PiB1bmtub3duO1xuICBvblNlbmQ6IChcbiAgICBsaXN0SWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT4sXG4gICAgY29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+LFxuICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlXG4gICkgPT4gdW5rbm93bjtcbiAgcHJvY2Vzc0F0dGFjaG1lbnQ6IChcbiAgICBmaWxlOiBGaWxlXG4gICkgPT4gUHJvbWlzZTx2b2lkIHwgSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlPjtcbiAgc2lnbmFsQ29ubmVjdGlvbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+O1xuICB0YWdHcm91cHNBc05ld0dyb3VwU3Rvcnk6IChjaWRzOiBBcnJheTxzdHJpbmc+KSA9PiB1bmtub3duO1xufSAmIFBpY2s8U3RpY2tlckJ1dHRvblByb3BzLCAnaW5zdGFsbGVkUGFja3MnIHwgJ3JlY2VudFN0aWNrZXJzJz47XG5cbmV4cG9ydCBjb25zdCBTdG9yeUNyZWF0b3IgPSAoe1xuICBjYW5kaWRhdGVDb252ZXJzYXRpb25zLFxuICBkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldyxcbiAgZGlzdHJpYnV0aW9uTGlzdHMsXG4gIGZpbGUsXG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBncm91cENvbnZlcnNhdGlvbnMsXG4gIGdyb3VwU3RvcmllcyxcbiAgaTE4bixcbiAgaW5zdGFsbGVkUGFja3MsXG4gIGxpbmtQcmV2aWV3LFxuICBtZSxcbiAgb25DbG9zZSxcbiAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZCxcbiAgb25TZW5kLFxuICBwcm9jZXNzQXR0YWNobWVudCxcbiAgcmVjZW50U3RpY2tlcnMsXG4gIHNpZ25hbENvbm5lY3Rpb25zLFxuICB0YWdHcm91cHNBc05ld0dyb3VwU3RvcnksXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IFtkcmFmdEF0dGFjaG1lbnQsIHNldERyYWZ0QXR0YWNobWVudF0gPSB1c2VTdGF0ZTxcbiAgICBBdHRhY2htZW50VHlwZSB8IHVuZGVmaW5lZFxuICA+KCk7XG4gIGNvbnN0IFthdHRhY2htZW50VXJsLCBzZXRBdHRhY2htZW50VXJsXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgdW5tb3VudGVkID0gZmFsc2U7XG5cbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkQXR0YWNobWVudCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGlmICghZmlsZSB8fCB1bm1vdW50ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhdHRhY2htZW50ID0gYXdhaXQgcHJvY2Vzc0F0dGFjaG1lbnQoZmlsZSk7XG4gICAgICBpZiAoIWF0dGFjaG1lbnQgfHwgdW5tb3VudGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVmlkZW9BdHRhY2htZW50KGF0dGFjaG1lbnQpKSB7XG4gICAgICAgIHNldERyYWZ0QXR0YWNobWVudChhdHRhY2htZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0YWNobWVudCAmJiBoYXMoYXR0YWNobWVudCwgJ2RhdGEnKSkge1xuICAgICAgICB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtnZXQoYXR0YWNobWVudCwgJ2RhdGEnKV0pKTtcbiAgICAgICAgc2V0QXR0YWNobWVudFVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRBdHRhY2htZW50KCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5tb3VudGVkID0gdHJ1ZTtcbiAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtmaWxlLCBwcm9jZXNzQXR0YWNobWVudF0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtkcmFmdEF0dGFjaG1lbnQgJiYgKFxuICAgICAgICA8U2VuZFN0b3J5TW9kYWxcbiAgICAgICAgICBjYW5kaWRhdGVDb252ZXJzYXRpb25zPXtjYW5kaWRhdGVDb252ZXJzYXRpb25zfVxuICAgICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RzPXtkaXN0cmlidXRpb25MaXN0c31cbiAgICAgICAgICBnZXRQcmVmZXJyZWRCYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2V9XG4gICAgICAgICAgZ3JvdXBDb252ZXJzYXRpb25zPXtncm91cENvbnZlcnNhdGlvbnN9XG4gICAgICAgICAgZ3JvdXBTdG9yaWVzPXtncm91cFN0b3JpZXN9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtZT17bWV9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0RHJhZnRBdHRhY2htZW50KHVuZGVmaW5lZCl9XG4gICAgICAgICAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZD17b25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZH1cbiAgICAgICAgICBvblNlbmQ9eyhsaXN0SWRzLCBncm91cElkcykgPT4ge1xuICAgICAgICAgICAgb25TZW5kKGxpc3RJZHMsIGdyb3VwSWRzLCBkcmFmdEF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgc2V0RHJhZnRBdHRhY2htZW50KHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBvbkNsb3NlKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzaWduYWxDb25uZWN0aW9ucz17c2lnbmFsQ29ubmVjdGlvbnN9XG4gICAgICAgICAgdGFnR3JvdXBzQXNOZXdHcm91cFN0b3J5PXt0YWdHcm91cHNBc05ld0dyb3VwU3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge2F0dGFjaG1lbnRVcmwgJiYgKFxuICAgICAgICA8TWVkaWFFZGl0b3JcbiAgICAgICAgICBkb25lQnV0dG9uTGFiZWw9e2kxOG4oJ25leHQyJyl9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBpbWFnZVNyYz17YXR0YWNobWVudFVybH1cbiAgICAgICAgICBpbnN0YWxsZWRQYWNrcz17aW5zdGFsbGVkUGFja3N9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvbkRvbmU9e2RhdGEgPT4ge1xuICAgICAgICAgICAgc2V0RHJhZnRBdHRhY2htZW50KHtcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgIHNpemU6IGRhdGEuYnl0ZUxlbmd0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH19XG4gICAgICAgICAgcmVjZW50U3RpY2tlcnM9e3JlY2VudFN0aWNrZXJzfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHshZmlsZSAmJiAoXG4gICAgICAgIDxUZXh0U3RvcnlDcmVhdG9yXG4gICAgICAgICAgZGVib3VuY2VkTWF5YmVHcmFiTGlua1ByZXZpZXc9e2RlYm91bmNlZE1heWJlR3JhYkxpbmtQcmV2aWV3fVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgbGlua1ByZXZpZXc9e2xpbmtQcmV2aWV3fVxuICAgICAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICAgICAgb25Eb25lPXt0ZXh0QXR0YWNobWVudCA9PiB7XG4gICAgICAgICAgICBzZXREcmFmdEF0dGFjaG1lbnQoe1xuICAgICAgICAgICAgICBjb250ZW50VHlwZTogVEVYVF9BVFRBQ0hNRU5ULFxuICAgICAgICAgICAgICB0ZXh0QXR0YWNobWVudCxcbiAgICAgICAgICAgICAgc2l6ZTogdGV4dEF0dGFjaG1lbnQudGV4dD8ubGVuZ3RoIHx8IDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtB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
