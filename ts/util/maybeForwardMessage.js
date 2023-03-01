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
var maybeForwardMessage_exports = {};
__export(maybeForwardMessage_exports, {
  maybeForwardMessage: () => maybeForwardMessage
});
module.exports = __toCommonJS(maybeForwardMessage_exports);
var log = __toESM(require("../logging/log"));
var import_idForLogging = require("./idForLogging");
var import_markAllAsApproved = require("./markAllAsApproved");
var import_markAllAsVerifiedDefault = require("./markAllAsVerifiedDefault");
var import_LinkPreview = require("../services/LinkPreview");
var import_showSafetyNumberChangeDialog = require("../shims/showSafetyNumberChangeDialog");
async function maybeForwardMessage(messageAttributes, conversationIds, messageBody, attachments, linkPreview) {
  const idForLogging = (0, import_idForLogging.getMessageIdForLogging)(messageAttributes);
  log.info(`maybeForwardMessage/${idForLogging}: Starting...`);
  const attachmentLookup = /* @__PURE__ */ new Set();
  if (attachments) {
    attachments.forEach((attachment) => {
      attachmentLookup.add(`${attachment.fileName}/${attachment.contentType}`);
    });
  }
  const conversations = conversationIds.map((id) => window.ConversationController.get(id));
  const cannotSend = conversations.some((conversation) => conversation?.get("announcementsOnly") && !conversation.areWeAdmin());
  if (cannotSend) {
    throw new Error("Cannot send to group");
  }
  const unverifiedContacts = [];
  const untrustedContacts = [];
  await Promise.all(conversations.map(async (conversation) => {
    if (conversation) {
      await conversation.updateVerified();
      const unverifieds = conversation.getUnverified();
      if (unverifieds.length) {
        unverifieds.forEach((unverifiedConversation) => unverifiedContacts.push(unverifiedConversation));
      }
      const untrusted = conversation.getUntrusted();
      if (untrusted.length) {
        untrusted.forEach((untrustedConversation) => untrustedContacts.push(untrustedConversation));
      }
    }
  }));
  const iffyConversations = [...unverifiedContacts, ...untrustedContacts];
  if (iffyConversations.length) {
    const forwardMessageModal = document.querySelector(".module-ForwardMessageModal");
    if (forwardMessageModal) {
      forwardMessageModal.style.display = "none";
    }
    const sendAnyway = await new Promise((resolve) => {
      (0, import_showSafetyNumberChangeDialog.showSafetyNumberChangeDialog)({
        contacts: iffyConversations,
        reject: () => {
          resolve(false);
        },
        resolve: () => {
          resolve(true);
        }
      });
    });
    if (!sendAnyway) {
      if (forwardMessageModal) {
        forwardMessageModal.style.display = "block";
      }
      return false;
    }
    let verifyPromise;
    let approvePromise;
    if (unverifiedContacts.length) {
      verifyPromise = (0, import_markAllAsVerifiedDefault.markAllAsVerifiedDefault)(unverifiedContacts);
    }
    if (untrustedContacts.length) {
      approvePromise = (0, import_markAllAsApproved.markAllAsApproved)(untrustedContacts);
    }
    await Promise.all([verifyPromise, approvePromise]);
  }
  const sendMessageOptions = { dontClearDraft: true };
  const baseTimestamp = Date.now();
  const {
    loadAttachmentData,
    loadContactData,
    loadPreviewData,
    loadStickerData
  } = window.Signal.Migrations;
  await Promise.all(conversations.map(async (conversation, offset) => {
    const timestamp = baseTimestamp + offset;
    if (conversation) {
      const { sticker, contact } = messageAttributes;
      if (sticker) {
        const stickerWithData = await loadStickerData(sticker);
        const stickerNoPath = stickerWithData ? {
          ...stickerWithData,
          data: {
            ...stickerWithData.data,
            path: void 0
          }
        } : void 0;
        conversation.enqueueMessageForSend({
          body: void 0,
          attachments: [],
          sticker: stickerNoPath
        }, { ...sendMessageOptions, timestamp });
      } else if (contact?.length) {
        const contactWithHydratedAvatar = await loadContactData(contact);
        conversation.enqueueMessageForSend({
          body: void 0,
          attachments: [],
          contact: contactWithHydratedAvatar
        }, { ...sendMessageOptions, timestamp });
      } else {
        const preview = linkPreview ? await loadPreviewData([linkPreview]) : [];
        const attachmentsWithData = await Promise.all((attachments || []).map(async (item) => ({
          ...await loadAttachmentData(item),
          path: void 0
        })));
        const attachmentsToSend = attachmentsWithData.filter((attachment) => attachmentLookup.has(`${attachment.fileName}/${attachment.contentType}`));
        conversation.enqueueMessageForSend({
          body: messageBody || void 0,
          attachments: attachmentsToSend,
          preview
        }, { ...sendMessageOptions, timestamp });
      }
    }
  }));
  (0, import_LinkPreview.resetLinkPreview)();
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  maybeForwardMessage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWF5YmVGb3J3YXJkTWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rUHJldmlld1R5cGUgfSBmcm9tICcuLi90eXBlcy9tZXNzYWdlL0xpbmtQcmV2aWV3cyc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IGdldE1lc3NhZ2VJZEZvckxvZ2dpbmcgfSBmcm9tICcuL2lkRm9yTG9nZ2luZyc7XG5pbXBvcnQgeyBtYXJrQWxsQXNBcHByb3ZlZCB9IGZyb20gJy4vbWFya0FsbEFzQXBwcm92ZWQnO1xuaW1wb3J0IHsgbWFya0FsbEFzVmVyaWZpZWREZWZhdWx0IH0gZnJvbSAnLi9tYXJrQWxsQXNWZXJpZmllZERlZmF1bHQnO1xuaW1wb3J0IHsgcmVzZXRMaW5rUHJldmlldyB9IGZyb20gJy4uL3NlcnZpY2VzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB7IHNob3dTYWZldHlOdW1iZXJDaGFuZ2VEaWFsb2cgfSBmcm9tICcuLi9zaGltcy9zaG93U2FmZXR5TnVtYmVyQ2hhbmdlRGlhbG9nJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1heWJlRm9yd2FyZE1lc3NhZ2UoXG4gIG1lc3NhZ2VBdHRyaWJ1dGVzOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gIGNvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPixcbiAgbWVzc2FnZUJvZHk/OiBzdHJpbmcsXG4gIGF0dGFjaG1lbnRzPzogQXJyYXk8QXR0YWNobWVudFR5cGU+LFxuICBsaW5rUHJldmlldz86IExpbmtQcmV2aWV3VHlwZVxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IGlkRm9yTG9nZ2luZyA9IGdldE1lc3NhZ2VJZEZvckxvZ2dpbmcobWVzc2FnZUF0dHJpYnV0ZXMpO1xuICBsb2cuaW5mbyhgbWF5YmVGb3J3YXJkTWVzc2FnZS8ke2lkRm9yTG9nZ2luZ306IFN0YXJ0aW5nLi4uYCk7XG5cbiAgY29uc3QgYXR0YWNobWVudExvb2t1cCA9IG5ldyBTZXQoKTtcbiAgaWYgKGF0dGFjaG1lbnRzKSB7XG4gICAgYXR0YWNobWVudHMuZm9yRWFjaChhdHRhY2htZW50ID0+IHtcbiAgICAgIGF0dGFjaG1lbnRMb29rdXAuYWRkKGAke2F0dGFjaG1lbnQuZmlsZU5hbWV9LyR7YXR0YWNobWVudC5jb250ZW50VHlwZX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSBjb252ZXJzYXRpb25JZHMubWFwKGlkID0+XG4gICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKVxuICApO1xuXG4gIGNvbnN0IGNhbm5vdFNlbmQgPSBjb252ZXJzYXRpb25zLnNvbWUoXG4gICAgY29udmVyc2F0aW9uID0+XG4gICAgICBjb252ZXJzYXRpb24/LmdldCgnYW5ub3VuY2VtZW50c09ubHknKSAmJiAhY29udmVyc2F0aW9uLmFyZVdlQWRtaW4oKVxuICApO1xuICBpZiAoY2Fubm90U2VuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNlbmQgdG8gZ3JvdXAnKTtcbiAgfVxuXG4gIC8vIFZlcmlmeSB0aGF0IGFsbCBjb250YWN0cyB0aGF0IHdlJ3JlIGZvcndhcmRpbmdcbiAgLy8gdG8gYXJlIHZlcmlmaWVkIGFuZCB0cnVzdGVkXG4gIGNvbnN0IHVudmVyaWZpZWRDb250YWN0czogQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+ID0gW107XG4gIGNvbnN0IHVudHJ1c3RlZENvbnRhY3RzOiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4gPSBbXTtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgY29udmVyc2F0aW9ucy5tYXAoYXN5bmMgY29udmVyc2F0aW9uID0+IHtcbiAgICAgIGlmIChjb252ZXJzYXRpb24pIHtcbiAgICAgICAgYXdhaXQgY29udmVyc2F0aW9uLnVwZGF0ZVZlcmlmaWVkKCk7XG4gICAgICAgIGNvbnN0IHVudmVyaWZpZWRzID0gY29udmVyc2F0aW9uLmdldFVudmVyaWZpZWQoKTtcbiAgICAgICAgaWYgKHVudmVyaWZpZWRzLmxlbmd0aCkge1xuICAgICAgICAgIHVudmVyaWZpZWRzLmZvckVhY2godW52ZXJpZmllZENvbnZlcnNhdGlvbiA9PlxuICAgICAgICAgICAgdW52ZXJpZmllZENvbnRhY3RzLnB1c2godW52ZXJpZmllZENvbnZlcnNhdGlvbilcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdW50cnVzdGVkID0gY29udmVyc2F0aW9uLmdldFVudHJ1c3RlZCgpO1xuICAgICAgICBpZiAodW50cnVzdGVkLmxlbmd0aCkge1xuICAgICAgICAgIHVudHJ1c3RlZC5mb3JFYWNoKHVudHJ1c3RlZENvbnZlcnNhdGlvbiA9PlxuICAgICAgICAgICAgdW50cnVzdGVkQ29udGFjdHMucHVzaCh1bnRydXN0ZWRDb252ZXJzYXRpb24pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgLy8gSWYgdGhlcmUgYXJlIGFueSB1bnZlcmlmaWVkIG9yIHVudHJ1c3RlZCBjb250YWN0cywgc2hvdyB0aGVcbiAgLy8gU2VuZEFueXdheURpYWxvZyBhbmQgaWYgd2UncmUgZmluZSB3aXRoIHNlbmRpbmcgdGhlbiBtYXJrIGFsbCBhc1xuICAvLyB2ZXJpZmllZCBhbmQgdHJ1c3RlZCBhbmQgY29udGludWUgdGhlIHNlbmQuXG4gIGNvbnN0IGlmZnlDb252ZXJzYXRpb25zID0gWy4uLnVudmVyaWZpZWRDb250YWN0cywgLi4udW50cnVzdGVkQ29udGFjdHNdO1xuICBpZiAoaWZmeUNvbnZlcnNhdGlvbnMubGVuZ3RoKSB7XG4gICAgY29uc3QgZm9yd2FyZE1lc3NhZ2VNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuICAgICAgJy5tb2R1bGUtRm9yd2FyZE1lc3NhZ2VNb2RhbCdcbiAgICApO1xuICAgIGlmIChmb3J3YXJkTWVzc2FnZU1vZGFsKSB7XG4gICAgICBmb3J3YXJkTWVzc2FnZU1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgIGNvbnN0IHNlbmRBbnl3YXkgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHNob3dTYWZldHlOdW1iZXJDaGFuZ2VEaWFsb2coe1xuICAgICAgICBjb250YWN0czogaWZmeUNvbnZlcnNhdGlvbnMsXG4gICAgICAgIHJlamVjdDogKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKCFzZW5kQW55d2F5KSB7XG4gICAgICBpZiAoZm9yd2FyZE1lc3NhZ2VNb2RhbCkge1xuICAgICAgICBmb3J3YXJkTWVzc2FnZU1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCB2ZXJpZnlQcm9taXNlOiBQcm9taXNlPHZvaWQ+IHwgdW5kZWZpbmVkO1xuICAgIGxldCBhcHByb3ZlUHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAodW52ZXJpZmllZENvbnRhY3RzLmxlbmd0aCkge1xuICAgICAgdmVyaWZ5UHJvbWlzZSA9IG1hcmtBbGxBc1ZlcmlmaWVkRGVmYXVsdCh1bnZlcmlmaWVkQ29udGFjdHMpO1xuICAgIH1cbiAgICBpZiAodW50cnVzdGVkQ29udGFjdHMubGVuZ3RoKSB7XG4gICAgICBhcHByb3ZlUHJvbWlzZSA9IG1hcmtBbGxBc0FwcHJvdmVkKHVudHJ1c3RlZENvbnRhY3RzKTtcbiAgICB9XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW3ZlcmlmeVByb21pc2UsIGFwcHJvdmVQcm9taXNlXSk7XG4gIH1cblxuICBjb25zdCBzZW5kTWVzc2FnZU9wdGlvbnMgPSB7IGRvbnRDbGVhckRyYWZ0OiB0cnVlIH07XG4gIGNvbnN0IGJhc2VUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gIGNvbnN0IHtcbiAgICBsb2FkQXR0YWNobWVudERhdGEsXG4gICAgbG9hZENvbnRhY3REYXRhLFxuICAgIGxvYWRQcmV2aWV3RGF0YSxcbiAgICBsb2FkU3RpY2tlckRhdGEsXG4gIH0gPSB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnM7XG5cbiAgLy8gQWN0dWFsbHkgc2VuZCB0aGUgbWVzc2FnZVxuICAvLyBsb2FkIGFueSBzdGlja2VyIGRhdGEsIGF0dGFjaG1lbnRzLCBvciBsaW5rIHByZXZpZXdzIHRoYXQgd2UgbmVlZCB0b1xuICAvLyBzZW5kIGFsb25nIHdpdGggdGhlIG1lc3NhZ2UgYW5kIGRvIHRoZSBzZW5kIHRvIGVhY2ggY29udmVyc2F0aW9uLlxuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBjb252ZXJzYXRpb25zLm1hcChhc3luYyAoY29udmVyc2F0aW9uLCBvZmZzZXQpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IGJhc2VUaW1lc3RhbXAgKyBvZmZzZXQ7XG4gICAgICBpZiAoY29udmVyc2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IHsgc3RpY2tlciwgY29udGFjdCB9ID0gbWVzc2FnZUF0dHJpYnV0ZXM7XG5cbiAgICAgICAgaWYgKHN0aWNrZXIpIHtcbiAgICAgICAgICBjb25zdCBzdGlja2VyV2l0aERhdGEgPSBhd2FpdCBsb2FkU3RpY2tlckRhdGEoc3RpY2tlcik7XG4gICAgICAgICAgY29uc3Qgc3RpY2tlck5vUGF0aCA9IHN0aWNrZXJXaXRoRGF0YVxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgLi4uc3RpY2tlcldpdGhEYXRhLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIC4uLnN0aWNrZXJXaXRoRGF0YS5kYXRhLFxuICAgICAgICAgICAgICAgICAgcGF0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgY29udmVyc2F0aW9uLmVucXVldWVNZXNzYWdlRm9yU2VuZChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYm9keTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBhdHRhY2htZW50czogW10sXG4gICAgICAgICAgICAgIHN0aWNrZXI6IHN0aWNrZXJOb1BhdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAuLi5zZW5kTWVzc2FnZU9wdGlvbnMsIHRpbWVzdGFtcCB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWN0Py5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBjb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyID0gYXdhaXQgbG9hZENvbnRhY3REYXRhKGNvbnRhY3QpO1xuICAgICAgICAgIGNvbnZlcnNhdGlvbi5lbnF1ZXVlTWVzc2FnZUZvclNlbmQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJvZHk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgYXR0YWNobWVudHM6IFtdLFxuICAgICAgICAgICAgICBjb250YWN0OiBjb250YWN0V2l0aEh5ZHJhdGVkQXZhdGFyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgLi4uc2VuZE1lc3NhZ2VPcHRpb25zLCB0aW1lc3RhbXAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IGxpbmtQcmV2aWV3XG4gICAgICAgICAgICA/IGF3YWl0IGxvYWRQcmV2aWV3RGF0YShbbGlua1ByZXZpZXddKVxuICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgICBjb25zdCBhdHRhY2htZW50c1dpdGhEYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAoYXR0YWNobWVudHMgfHwgW10pLm1hcChhc3luYyBpdGVtID0+ICh7XG4gICAgICAgICAgICAgIC4uLihhd2FpdCBsb2FkQXR0YWNobWVudERhdGEoaXRlbSkpLFxuICAgICAgICAgICAgICBwYXRoOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzVG9TZW5kID0gYXR0YWNobWVudHNXaXRoRGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAoYXR0YWNobWVudDogUGFydGlhbDxBdHRhY2htZW50VHlwZT4pID0+XG4gICAgICAgICAgICAgIGF0dGFjaG1lbnRMb29rdXAuaGFzKFxuICAgICAgICAgICAgICAgIGAke2F0dGFjaG1lbnQuZmlsZU5hbWV9LyR7YXR0YWNobWVudC5jb250ZW50VHlwZX1gXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29udmVyc2F0aW9uLmVucXVldWVNZXNzYWdlRm9yU2VuZChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYm9keTogbWVzc2FnZUJvZHkgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHNUb1NlbmQsXG4gICAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAuLi5zZW5kTWVzc2FnZU9wdGlvbnMsIHRpbWVzdGFtcCB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgLy8gQ2FuY2VsIGFueSBsaW5rIHN0aWxsIHBlbmRpbmcsIGV2ZW4gaWYgaXQgZGlkbid0IG1ha2UgaXQgaW50byB0aGUgbWVzc2FnZVxuICByZXNldExpbmtQcmV2aWV3KCk7XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0EsVUFBcUI7QUFDckIsMEJBQXVDO0FBQ3ZDLCtCQUFrQztBQUNsQyxzQ0FBeUM7QUFDekMseUJBQWlDO0FBQ2pDLDBDQUE2QztBQUU3QyxtQ0FDRSxtQkFDQSxpQkFDQSxhQUNBLGFBQ0EsYUFDa0I7QUFDbEIsUUFBTSxlQUFlLGdEQUF1QixpQkFBaUI7QUFDN0QsTUFBSSxLQUFLLHVCQUF1QiwyQkFBMkI7QUFFM0QsUUFBTSxtQkFBbUIsb0JBQUksSUFBSTtBQUNqQyxNQUFJLGFBQWE7QUFDZixnQkFBWSxRQUFRLGdCQUFjO0FBQ2hDLHVCQUFpQixJQUFJLEdBQUcsV0FBVyxZQUFZLFdBQVcsYUFBYTtBQUFBLElBQ3pFLENBQUM7QUFBQSxFQUNIO0FBRUEsUUFBTSxnQkFBZ0IsZ0JBQWdCLElBQUksUUFDeEMsT0FBTyx1QkFBdUIsSUFBSSxFQUFFLENBQ3RDO0FBRUEsUUFBTSxhQUFhLGNBQWMsS0FDL0Isa0JBQ0UsY0FBYyxJQUFJLG1CQUFtQixLQUFLLENBQUMsYUFBYSxXQUFXLENBQ3ZFO0FBQ0EsTUFBSSxZQUFZO0FBQ2QsVUFBTSxJQUFJLE1BQU0sc0JBQXNCO0FBQUEsRUFDeEM7QUFJQSxRQUFNLHFCQUErQyxDQUFDO0FBQ3RELFFBQU0sb0JBQThDLENBQUM7QUFDckQsUUFBTSxRQUFRLElBQ1osY0FBYyxJQUFJLE9BQU0saUJBQWdCO0FBQ3RDLFFBQUksY0FBYztBQUNoQixZQUFNLGFBQWEsZUFBZTtBQUNsQyxZQUFNLGNBQWMsYUFBYSxjQUFjO0FBQy9DLFVBQUksWUFBWSxRQUFRO0FBQ3RCLG9CQUFZLFFBQVEsNEJBQ2xCLG1CQUFtQixLQUFLLHNCQUFzQixDQUNoRDtBQUFBLE1BQ0Y7QUFFQSxZQUFNLFlBQVksYUFBYSxhQUFhO0FBQzVDLFVBQUksVUFBVSxRQUFRO0FBQ3BCLGtCQUFVLFFBQVEsMkJBQ2hCLGtCQUFrQixLQUFLLHFCQUFxQixDQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDLENBQ0g7QUFLQSxRQUFNLG9CQUFvQixDQUFDLEdBQUcsb0JBQW9CLEdBQUcsaUJBQWlCO0FBQ3RFLE1BQUksa0JBQWtCLFFBQVE7QUFDNUIsVUFBTSxzQkFBc0IsU0FBUyxjQUNuQyw2QkFDRjtBQUNBLFFBQUkscUJBQXFCO0FBQ3ZCLDBCQUFvQixNQUFNLFVBQVU7QUFBQSxJQUN0QztBQUNBLFVBQU0sYUFBYSxNQUFNLElBQUksUUFBUSxhQUFXO0FBQzlDLDRFQUE2QjtBQUFBLFFBQzNCLFVBQVU7QUFBQSxRQUNWLFFBQVEsTUFBTTtBQUNaLGtCQUFRLEtBQUs7QUFBQSxRQUNmO0FBQUEsUUFDQSxTQUFTLE1BQU07QUFDYixrQkFBUSxJQUFJO0FBQUEsUUFDZDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELFFBQUksQ0FBQyxZQUFZO0FBQ2YsVUFBSSxxQkFBcUI7QUFDdkIsNEJBQW9CLE1BQU0sVUFBVTtBQUFBLE1BQ3RDO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFFQSxRQUFJO0FBQ0osUUFBSTtBQUNKLFFBQUksbUJBQW1CLFFBQVE7QUFDN0Isc0JBQWdCLDhEQUF5QixrQkFBa0I7QUFBQSxJQUM3RDtBQUNBLFFBQUksa0JBQWtCLFFBQVE7QUFDNUIsdUJBQWlCLGdEQUFrQixpQkFBaUI7QUFBQSxJQUN0RDtBQUNBLFVBQU0sUUFBUSxJQUFJLENBQUMsZUFBZSxjQUFjLENBQUM7QUFBQSxFQUNuRDtBQUVBLFFBQU0scUJBQXFCLEVBQUUsZ0JBQWdCLEtBQUs7QUFDbEQsUUFBTSxnQkFBZ0IsS0FBSyxJQUFJO0FBRS9CLFFBQU07QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsTUFDRSxPQUFPLE9BQU87QUFLbEIsUUFBTSxRQUFRLElBQ1osY0FBYyxJQUFJLE9BQU8sY0FBYyxXQUFXO0FBQ2hELFVBQU0sWUFBWSxnQkFBZ0I7QUFDbEMsUUFBSSxjQUFjO0FBQ2hCLFlBQU0sRUFBRSxTQUFTLFlBQVk7QUFFN0IsVUFBSSxTQUFTO0FBQ1gsY0FBTSxrQkFBa0IsTUFBTSxnQkFBZ0IsT0FBTztBQUNyRCxjQUFNLGdCQUFnQixrQkFDbEI7QUFBQSxhQUNLO0FBQUEsVUFDSCxNQUFNO0FBQUEsZUFDRCxnQkFBZ0I7QUFBQSxZQUNuQixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0YsSUFDQTtBQUVKLHFCQUFhLHNCQUNYO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLENBQUM7QUFBQSxVQUNkLFNBQVM7QUFBQSxRQUNYLEdBQ0EsS0FBSyxvQkFBb0IsVUFBVSxDQUNyQztBQUFBLE1BQ0YsV0FBVyxTQUFTLFFBQVE7QUFDMUIsY0FBTSw0QkFBNEIsTUFBTSxnQkFBZ0IsT0FBTztBQUMvRCxxQkFBYSxzQkFDWDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxDQUFDO0FBQUEsVUFDZCxTQUFTO0FBQUEsUUFDWCxHQUNBLEtBQUssb0JBQW9CLFVBQVUsQ0FDckM7QUFBQSxNQUNGLE9BQU87QUFDTCxjQUFNLFVBQVUsY0FDWixNQUFNLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUNuQyxDQUFDO0FBQ0wsY0FBTSxzQkFBc0IsTUFBTSxRQUFRLElBQ3ZDLGdCQUFlLENBQUMsR0FBRyxJQUFJLE9BQU0sU0FBUztBQUFBLGFBQ2pDLE1BQU0sbUJBQW1CLElBQUk7QUFBQSxVQUNqQyxNQUFNO0FBQUEsUUFDUixFQUFFLENBQ0o7QUFDQSxjQUFNLG9CQUFvQixvQkFBb0IsT0FDNUMsQ0FBQyxlQUNDLGlCQUFpQixJQUNmLEdBQUcsV0FBVyxZQUFZLFdBQVcsYUFDdkMsQ0FDSjtBQUVBLHFCQUFhLHNCQUNYO0FBQUEsVUFDRSxNQUFNLGVBQWU7QUFBQSxVQUNyQixhQUFhO0FBQUEsVUFDYjtBQUFBLFFBQ0YsR0FDQSxLQUFLLG9CQUFvQixVQUFVLENBQ3JDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUMsQ0FDSDtBQUdBLDJDQUFpQjtBQUVqQixTQUFPO0FBQ1Q7QUFsTHNCIiwKICAibmFtZXMiOiBbXQp9Cg==
