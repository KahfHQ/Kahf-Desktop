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
var ContactModal_exports = {};
__export(ContactModal_exports, {
  ContactModal: () => ContactModal
});
module.exports = __toCommonJS(ContactModal_exports);
var import_react = __toESM(require("react"));
var log = __toESM(require("../../logging/log"));
var import_About = require("./About");
var import_Avatar = require("../Avatar");
var import_AvatarLightbox = require("../AvatarLightbox");
var import_BadgeDialog = require("../BadgeDialog");
var import_ConfirmationDialog = require("../ConfirmationDialog");
var import_Modal = require("../Modal");
var import_RemoveGroupMemberConfirmationDialog = require("./RemoveGroupMemberConfirmationDialog");
var import_SharedGroupNames = require("../SharedGroupNames");
var import_missingCaseError = require("../../util/missingCaseError");
var ContactModalView = /* @__PURE__ */ ((ContactModalView2) => {
  ContactModalView2[ContactModalView2["Default"] = 0] = "Default";
  ContactModalView2[ContactModalView2["ShowingAvatar"] = 1] = "ShowingAvatar";
  ContactModalView2[ContactModalView2["ShowingBadges"] = 2] = "ShowingBadges";
  return ContactModalView2;
})(ContactModalView || {});
var SubModalState = /* @__PURE__ */ ((SubModalState2) => {
  SubModalState2["None"] = "None";
  SubModalState2["ToggleAdmin"] = "ToggleAdmin";
  SubModalState2["MemberRemove"] = "MemberRemove";
  return SubModalState2;
})(SubModalState || {});
const ContactModal = /* @__PURE__ */ __name(({
  areWeASubscriber,
  areWeAdmin,
  badges,
  contact,
  conversation,
  hasStories,
  hideContactModal,
  i18n,
  isAdmin,
  isMember,
  removeMemberFromGroup,
  showConversation,
  theme,
  toggleAdmin,
  toggleSafetyNumberModal,
  updateConversationModelSharedGroups,
  viewUserStories
}) => {
  if (!contact) {
    throw new Error("Contact modal opened without a matching contact");
  }
  const [view, setView] = (0, import_react.useState)(0 /* Default */);
  const [subModalState, setSubModalState] = (0, import_react.useState)("None" /* None */);
  (0, import_react.useEffect)(() => {
    if (contact?.id) {
      updateConversationModelSharedGroups(contact.id);
    }
  }, [contact?.id, updateConversationModelSharedGroups]);
  let modalNode;
  switch (subModalState) {
    case "None" /* None */:
      modalNode = void 0;
      break;
    case "ToggleAdmin" /* ToggleAdmin */:
      if (!conversation?.id) {
        log.warn("ContactModal: ToggleAdmin state - missing conversationId");
        modalNode = void 0;
        break;
      }
      modalNode = /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
        actions: [
          {
            action: () => toggleAdmin(conversation.id, contact.id),
            text: isAdmin ? i18n("ContactModal--rm-admin") : i18n("ContactModal--make-admin")
          }
        ],
        i18n,
        onClose: () => setSubModalState("None" /* None */)
      }, isAdmin ? i18n("ContactModal--rm-admin-info", [contact.title]) : i18n("ContactModal--make-admin-info", [contact.title]));
      break;
    case "MemberRemove" /* MemberRemove */:
      if (!contact || !conversation?.id) {
        log.warn("ContactModal: MemberRemove state - missing contact or conversationId");
        modalNode = void 0;
        break;
      }
      modalNode = /* @__PURE__ */ import_react.default.createElement(import_RemoveGroupMemberConfirmationDialog.RemoveGroupMemberConfirmationDialog, {
        conversation: contact,
        group: conversation,
        i18n,
        onClose: () => {
          setSubModalState("None" /* None */);
        },
        onRemove: () => {
          removeMemberFromGroup(conversation?.id, contact.id);
        }
      });
      break;
    default: {
      const state = subModalState;
      log.warn(`ContactModal: unexpected ${state}!`);
      modalNode = void 0;
      break;
    }
  }
  switch (view) {
    case 0 /* Default */: {
      const preferredBadge = badges[0];
      return /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
        moduleClassName: "ContactModal__modal",
        hasXButton: true,
        i18n,
        onClose: hideContactModal
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal"
      }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
        acceptedMessageRequest: contact.acceptedMessageRequest,
        avatarPath: contact.avatarPath,
        badge: preferredBadge,
        color: contact.color,
        conversationType: "direct",
        i18n,
        isMe: contact.isMe,
        name: contact.name,
        onClick: () => {
          if (conversation && hasStories) {
            viewUserStories(conversation.id);
          } else {
            setView(1 /* ShowingAvatar */);
          }
        },
        onClickBadge: () => setView(2 /* ShowingBadges */),
        profileName: contact.profileName,
        sharedGroupNames: contact.sharedGroupNames,
        size: 96,
        storyRing: hasStories,
        theme,
        title: contact.title,
        unblurredAvatarPath: contact.unblurredAvatarPath
      }), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__name"
      }, contact.title), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "module-about__container"
      }, /* @__PURE__ */ import_react.default.createElement(import_About.About, {
        text: contact.about
      })), contact.phoneNumber && /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__info"
      }, contact.phoneNumber), !contact.isMe && /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__info"
      }, /* @__PURE__ */ import_react.default.createElement(import_SharedGroupNames.SharedGroupNames, {
        i18n,
        sharedGroupNames: contact.sharedGroupNames || []
      })), /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__button-container"
      }, /* @__PURE__ */ import_react.default.createElement("button", {
        type: "button",
        className: "ContactModal__button ContactModal__send-message",
        onClick: () => {
          hideContactModal();
          showConversation({ conversationId: contact.id });
        }
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__bubble-icon"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__send-message__bubble-icon"
      })), /* @__PURE__ */ import_react.default.createElement("span", null, i18n("ContactModal--message"))), !contact.isMe && /* @__PURE__ */ import_react.default.createElement("button", {
        type: "button",
        className: "ContactModal__button ContactModal__safety-number",
        onClick: () => {
          hideContactModal();
          toggleSafetyNumberModal(contact.id);
        }
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__bubble-icon"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__safety-number__bubble-icon"
      })), /* @__PURE__ */ import_react.default.createElement("span", null, i18n("showSafetyNumber"))), !contact.isMe && areWeAdmin && isMember && conversation?.id && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", {
        type: "button",
        className: "ContactModal__button ContactModal__make-admin",
        onClick: () => setSubModalState("ToggleAdmin" /* ToggleAdmin */)
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__bubble-icon"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__make-admin__bubble-icon"
      })), isAdmin ? /* @__PURE__ */ import_react.default.createElement("span", null, i18n("ContactModal--rm-admin")) : /* @__PURE__ */ import_react.default.createElement("span", null, i18n("ContactModal--make-admin"))), /* @__PURE__ */ import_react.default.createElement("button", {
        type: "button",
        className: "ContactModal__button ContactModal__remove-from-group",
        onClick: () => setSubModalState("MemberRemove" /* MemberRemove */)
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__bubble-icon"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "ContactModal__remove-from-group__bubble-icon"
      })), /* @__PURE__ */ import_react.default.createElement("span", null, i18n("ContactModal--remove-from-group"))))), modalNode));
    }
    case 1 /* ShowingAvatar */:
      return /* @__PURE__ */ import_react.default.createElement(import_AvatarLightbox.AvatarLightbox, {
        avatarColor: contact.color,
        avatarPath: contact.avatarPath,
        conversationTitle: contact.title,
        i18n,
        onClose: () => setView(0 /* Default */)
      });
    case 2 /* ShowingBadges */:
      return /* @__PURE__ */ import_react.default.createElement(import_BadgeDialog.BadgeDialog, {
        areWeASubscriber,
        badges,
        firstName: contact.firstName,
        i18n,
        onClose: () => setView(0 /* Default */),
        title: contact.title
      });
    default:
      throw (0, import_missingCaseError.missingCaseError)(view);
  }
}, "ContactModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ContactModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udGFjdE1vZGFsLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uVHlwZSxcbiAgU2hvd0NvbnZlcnNhdGlvblR5cGUsXG59IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBCYWRnZVR5cGUgfSBmcm9tICcuLi8uLi9iYWRnZXMvdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBIYXNTdG9yaWVzIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIFRoZW1lVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IEFib3V0IH0gZnJvbSAnLi9BYm91dCc7XG5pbXBvcnQgeyBBdmF0YXIgfSBmcm9tICcuLi9BdmF0YXInO1xuaW1wb3J0IHsgQXZhdGFyTGlnaHRib3ggfSBmcm9tICcuLi9BdmF0YXJMaWdodGJveCc7XG5pbXBvcnQgeyBCYWRnZURpYWxvZyB9IGZyb20gJy4uL0JhZGdlRGlhbG9nJztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4uL0NvbmZpcm1hdGlvbkRpYWxvZyc7XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJy4uL01vZGFsJztcbmltcG9ydCB7IFJlbW92ZUdyb3VwTWVtYmVyQ29uZmlybWF0aW9uRGlhbG9nIH0gZnJvbSAnLi9SZW1vdmVHcm91cE1lbWJlckNvbmZpcm1hdGlvbkRpYWxvZyc7XG5pbXBvcnQgeyBTaGFyZWRHcm91cE5hbWVzIH0gZnJvbSAnLi4vU2hhcmVkR3JvdXBOYW1lcyc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcblxuZXhwb3J0IHR5cGUgUHJvcHNEYXRhVHlwZSA9IHtcbiAgYXJlV2VBU3Vic2NyaWJlcjogYm9vbGVhbjtcbiAgYXJlV2VBZG1pbjogYm9vbGVhbjtcbiAgYmFkZ2VzOiBSZWFkb25seUFycmF5PEJhZGdlVHlwZT47XG4gIGNvbnRhY3Q/OiBDb252ZXJzYXRpb25UeXBlO1xuICBjb252ZXJzYXRpb24/OiBDb252ZXJzYXRpb25UeXBlO1xuICBoYXNTdG9yaWVzPzogSGFzU3RvcmllcztcbiAgcmVhZG9ubHkgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgaXNBZG1pbjogYm9vbGVhbjtcbiAgaXNNZW1iZXI6IGJvb2xlYW47XG4gIHRoZW1lOiBUaGVtZVR5cGU7XG59O1xuXG50eXBlIFByb3BzQWN0aW9uVHlwZSA9IHtcbiAgaGlkZUNvbnRhY3RNb2RhbDogKCkgPT4gdm9pZDtcbiAgcmVtb3ZlTWVtYmVyRnJvbUdyb3VwOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZywgY29udGFjdElkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNob3dDb252ZXJzYXRpb246IFNob3dDb252ZXJzYXRpb25UeXBlO1xuICB0b2dnbGVBZG1pbjogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsIGNvbnRhY3RJZDogc3RyaW5nKSA9PiB2b2lkO1xuICB0b2dnbGVTYWZldHlOdW1iZXJNb2RhbDogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHVwZGF0ZUNvbnZlcnNhdGlvbk1vZGVsU2hhcmVkR3JvdXBzOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgdmlld1VzZXJTdG9yaWVzOiAoY2lkOiBzdHJpbmcpID0+IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSBQcm9wc0RhdGFUeXBlICYgUHJvcHNBY3Rpb25UeXBlO1xuXG5lbnVtIENvbnRhY3RNb2RhbFZpZXcge1xuICBEZWZhdWx0LFxuICBTaG93aW5nQXZhdGFyLFxuICBTaG93aW5nQmFkZ2VzLFxufVxuXG5lbnVtIFN1Yk1vZGFsU3RhdGUge1xuICBOb25lID0gJ05vbmUnLFxuICBUb2dnbGVBZG1pbiA9ICdUb2dnbGVBZG1pbicsXG4gIE1lbWJlclJlbW92ZSA9ICdNZW1iZXJSZW1vdmUnLFxufVxuXG5leHBvcnQgY29uc3QgQ29udGFjdE1vZGFsID0gKHtcbiAgYXJlV2VBU3Vic2NyaWJlcixcbiAgYXJlV2VBZG1pbixcbiAgYmFkZ2VzLFxuICBjb250YWN0LFxuICBjb252ZXJzYXRpb24sXG4gIGhhc1N0b3JpZXMsXG4gIGhpZGVDb250YWN0TW9kYWwsXG4gIGkxOG4sXG4gIGlzQWRtaW4sXG4gIGlzTWVtYmVyLFxuICByZW1vdmVNZW1iZXJGcm9tR3JvdXAsXG4gIHNob3dDb252ZXJzYXRpb24sXG4gIHRoZW1lLFxuICB0b2dnbGVBZG1pbixcbiAgdG9nZ2xlU2FmZXR5TnVtYmVyTW9kYWwsXG4gIHVwZGF0ZUNvbnZlcnNhdGlvbk1vZGVsU2hhcmVkR3JvdXBzLFxuICB2aWV3VXNlclN0b3JpZXMsXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCA9PiB7XG4gIGlmICghY29udGFjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29udGFjdCBtb2RhbCBvcGVuZWQgd2l0aG91dCBhIG1hdGNoaW5nIGNvbnRhY3QnKTtcbiAgfVxuXG4gIGNvbnN0IFt2aWV3LCBzZXRWaWV3XSA9IHVzZVN0YXRlKENvbnRhY3RNb2RhbFZpZXcuRGVmYXVsdCk7XG4gIGNvbnN0IFtzdWJNb2RhbFN0YXRlLCBzZXRTdWJNb2RhbFN0YXRlXSA9IHVzZVN0YXRlPFN1Yk1vZGFsU3RhdGU+KFxuICAgIFN1Yk1vZGFsU3RhdGUuTm9uZVxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNvbnRhY3Q/LmlkKSB7XG4gICAgICAvLyBLaWNrIG9mZiB0aGUgZXhwZW5zaXZlIGh5ZHJhdGlvbiBvZiB0aGUgY3VycmVudCBzaGFyZWRHcm91cE5hbWVzXG4gICAgICB1cGRhdGVDb252ZXJzYXRpb25Nb2RlbFNoYXJlZEdyb3Vwcyhjb250YWN0LmlkKTtcbiAgICB9XG4gIH0sIFtjb250YWN0Py5pZCwgdXBkYXRlQ29udmVyc2F0aW9uTW9kZWxTaGFyZWRHcm91cHNdKTtcblxuICBsZXQgbW9kYWxOb2RlOiBSZWFjdE5vZGU7XG4gIHN3aXRjaCAoc3ViTW9kYWxTdGF0ZSkge1xuICAgIGNhc2UgU3ViTW9kYWxTdGF0ZS5Ob25lOlxuICAgICAgbW9kYWxOb2RlID0gdW5kZWZpbmVkO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTdWJNb2RhbFN0YXRlLlRvZ2dsZUFkbWluOlxuICAgICAgaWYgKCFjb252ZXJzYXRpb24/LmlkKSB7XG4gICAgICAgIGxvZy53YXJuKCdDb250YWN0TW9kYWw6IFRvZ2dsZUFkbWluIHN0YXRlIC0gbWlzc2luZyBjb252ZXJzYXRpb25JZCcpO1xuICAgICAgICBtb2RhbE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBtb2RhbE5vZGUgPSAoXG4gICAgICAgIDxDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICBhY3Rpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGFjdGlvbjogKCkgPT4gdG9nZ2xlQWRtaW4oY29udmVyc2F0aW9uLmlkLCBjb250YWN0LmlkKSxcbiAgICAgICAgICAgICAgdGV4dDogaXNBZG1pblxuICAgICAgICAgICAgICAgID8gaTE4bignQ29udGFjdE1vZGFsLS1ybS1hZG1pbicpXG4gICAgICAgICAgICAgICAgOiBpMThuKCdDb250YWN0TW9kYWwtLW1ha2UtYWRtaW4nKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFN1Yk1vZGFsU3RhdGUoU3ViTW9kYWxTdGF0ZS5Ob25lKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpc0FkbWluXG4gICAgICAgICAgICA/IGkxOG4oJ0NvbnRhY3RNb2RhbC0tcm0tYWRtaW4taW5mbycsIFtjb250YWN0LnRpdGxlXSlcbiAgICAgICAgICAgIDogaTE4bignQ29udGFjdE1vZGFsLS1tYWtlLWFkbWluLWluZm8nLCBbY29udGFjdC50aXRsZV0pfVxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFN1Yk1vZGFsU3RhdGUuTWVtYmVyUmVtb3ZlOlxuICAgICAgaWYgKCFjb250YWN0IHx8ICFjb252ZXJzYXRpb24/LmlkKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdDb250YWN0TW9kYWw6IE1lbWJlclJlbW92ZSBzdGF0ZSAtIG1pc3NpbmcgY29udGFjdCBvciBjb252ZXJzYXRpb25JZCdcbiAgICAgICAgKTtcbiAgICAgICAgbW9kYWxOb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbW9kYWxOb2RlID0gKFxuICAgICAgICA8UmVtb3ZlR3JvdXBNZW1iZXJDb25maXJtYXRpb25EaWFsb2dcbiAgICAgICAgICBjb252ZXJzYXRpb249e2NvbnRhY3R9XG4gICAgICAgICAgZ3JvdXA9e2NvbnZlcnNhdGlvbn1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgIHNldFN1Yk1vZGFsU3RhdGUoU3ViTW9kYWxTdGF0ZS5Ob25lKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVtb3ZlPXsoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVNZW1iZXJGcm9tR3JvdXAoY29udmVyc2F0aW9uPy5pZCwgY29udGFjdC5pZCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zdCBzdGF0ZTogbmV2ZXIgPSBzdWJNb2RhbFN0YXRlO1xuICAgICAgbG9nLndhcm4oYENvbnRhY3RNb2RhbDogdW5leHBlY3RlZCAke3N0YXRlfSFgKTtcbiAgICAgIG1vZGFsTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAodmlldykge1xuICAgIGNhc2UgQ29udGFjdE1vZGFsVmlldy5EZWZhdWx0OiB7XG4gICAgICBjb25zdCBwcmVmZXJyZWRCYWRnZTogdW5kZWZpbmVkIHwgQmFkZ2VUeXBlID0gYmFkZ2VzWzBdO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxcbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX21vZGFsXCJcbiAgICAgICAgICBoYXNYQnV0dG9uXG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBvbkNsb3NlPXtoaWRlQ29udGFjdE1vZGFsfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxcIj5cbiAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17Y29udGFjdC5hY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0fVxuICAgICAgICAgICAgICBhdmF0YXJQYXRoPXtjb250YWN0LmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgIGJhZGdlPXtwcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgICAgICAgY29sb3I9e2NvbnRhY3QuY29sb3J9XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICBpc01lPXtjb250YWN0LmlzTWV9XG4gICAgICAgICAgICAgIG5hbWU9e2NvbnRhY3QubmFtZX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb252ZXJzYXRpb24gJiYgaGFzU3Rvcmllcykge1xuICAgICAgICAgICAgICAgICAgdmlld1VzZXJTdG9yaWVzKGNvbnZlcnNhdGlvbi5pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNldFZpZXcoQ29udGFjdE1vZGFsVmlldy5TaG93aW5nQXZhdGFyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2tCYWRnZT17KCkgPT4gc2V0VmlldyhDb250YWN0TW9kYWxWaWV3LlNob3dpbmdCYWRnZXMpfVxuICAgICAgICAgICAgICBwcm9maWxlTmFtZT17Y29udGFjdC5wcm9maWxlTmFtZX1cbiAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17Y29udGFjdC5zaGFyZWRHcm91cE5hbWVzfVxuICAgICAgICAgICAgICBzaXplPXs5Nn1cbiAgICAgICAgICAgICAgc3RvcnlSaW5nPXtoYXNTdG9yaWVzfVxuICAgICAgICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgICAgICAgIHRpdGxlPXtjb250YWN0LnRpdGxlfVxuICAgICAgICAgICAgICB1bmJsdXJyZWRBdmF0YXJQYXRoPXtjb250YWN0LnVuYmx1cnJlZEF2YXRhclBhdGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX25hbWVcIj57Y29udGFjdC50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWFib3V0X19jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPEFib3V0IHRleHQ9e2NvbnRhY3QuYWJvdXR9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtjb250YWN0LnBob25lTnVtYmVyICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX2luZm9cIj57Y29udGFjdC5waG9uZU51bWJlcn08L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7IWNvbnRhY3QuaXNNZSAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19pbmZvXCI+XG4gICAgICAgICAgICAgICAgPFNoYXJlZEdyb3VwTmFtZXNcbiAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtjb250YWN0LnNoYXJlZEdyb3VwTmFtZXMgfHwgW119XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX2J1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIkNvbnRhY3RNb2RhbF9fYnV0dG9uIENvbnRhY3RNb2RhbF9fc2VuZC1tZXNzYWdlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBoaWRlQ29udGFjdE1vZGFsKCk7XG4gICAgICAgICAgICAgICAgICBzaG93Q29udmVyc2F0aW9uKHsgY29udmVyc2F0aW9uSWQ6IGNvbnRhY3QuaWQgfSk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19idWJibGUtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX3NlbmQtbWVzc2FnZV9fYnViYmxlLWljb25cIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuPntpMThuKCdDb250YWN0TW9kYWwtLW1lc3NhZ2UnKX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICB7IWNvbnRhY3QuaXNNZSAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX2J1dHRvbiBDb250YWN0TW9kYWxfX3NhZmV0eS1udW1iZXJcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBoaWRlQ29udGFjdE1vZGFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNhZmV0eU51bWJlck1vZGFsKGNvbnRhY3QuaWQpO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbnRhY3RNb2RhbF9fYnViYmxlLWljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX3NhZmV0eS1udW1iZXJfX2J1YmJsZS1pY29uXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2kxOG4oJ3Nob3dTYWZldHlOdW1iZXInKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHshY29udGFjdC5pc01lICYmIGFyZVdlQWRtaW4gJiYgaXNNZW1iZXIgJiYgY29udmVyc2F0aW9uPy5pZCAmJiAoXG4gICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIkNvbnRhY3RNb2RhbF9fYnV0dG9uIENvbnRhY3RNb2RhbF9fbWFrZS1hZG1pblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFN1Yk1vZGFsU3RhdGUoU3ViTW9kYWxTdGF0ZS5Ub2dnbGVBZG1pbil9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19idWJibGUtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19tYWtlLWFkbWluX19idWJibGUtaWNvblwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7aXNBZG1pbiA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aTE4bignQ29udGFjdE1vZGFsLS1ybS1hZG1pbicpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aTE4bignQ29udGFjdE1vZGFsLS1tYWtlLWFkbWluJyl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJDb250YWN0TW9kYWxfX2J1dHRvbiBDb250YWN0TW9kYWxfX3JlbW92ZS1mcm9tLWdyb3VwXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U3ViTW9kYWxTdGF0ZShTdWJNb2RhbFN0YXRlLk1lbWJlclJlbW92ZSl9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19idWJibGUtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFjdE1vZGFsX19yZW1vdmUtZnJvbS1ncm91cF9fYnViYmxlLWljb25cIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2kxOG4oJ0NvbnRhY3RNb2RhbC0tcmVtb3ZlLWZyb20tZ3JvdXAnKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge21vZGFsTm9kZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbD5cbiAgICAgICk7XG4gICAgfVxuICAgIGNhc2UgQ29udGFjdE1vZGFsVmlldy5TaG93aW5nQXZhdGFyOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEF2YXRhckxpZ2h0Ym94XG4gICAgICAgICAgYXZhdGFyQ29sb3I9e2NvbnRhY3QuY29sb3J9XG4gICAgICAgICAgYXZhdGFyUGF0aD17Y29udGFjdC5hdmF0YXJQYXRofVxuICAgICAgICAgIGNvbnZlcnNhdGlvblRpdGxlPXtjb250YWN0LnRpdGxlfVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0VmlldyhDb250YWN0TW9kYWxWaWV3LkRlZmF1bHQpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICBjYXNlIENvbnRhY3RNb2RhbFZpZXcuU2hvd2luZ0JhZGdlczpcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYWRnZURpYWxvZ1xuICAgICAgICAgIGFyZVdlQVN1YnNjcmliZXI9e2FyZVdlQVN1YnNjcmliZXJ9XG4gICAgICAgICAgYmFkZ2VzPXtiYWRnZXN9XG4gICAgICAgICAgZmlyc3ROYW1lPXtjb250YWN0LmZpcnN0TmFtZX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFZpZXcoQ29udGFjdE1vZGFsVmlldy5EZWZhdWx0KX1cbiAgICAgICAgICB0aXRsZT17Y29udGFjdC50aXRsZX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3Iodmlldyk7XG4gIH1cbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQTJDO0FBVTNDLFVBQXFCO0FBQ3JCLG1CQUFzQjtBQUN0QixvQkFBdUI7QUFDdkIsNEJBQStCO0FBQy9CLHlCQUE0QjtBQUM1QixnQ0FBbUM7QUFDbkMsbUJBQXNCO0FBQ3RCLGlEQUFvRDtBQUNwRCw4QkFBaUM7QUFDakMsOEJBQWlDO0FBMkJqQyxJQUFLLG1CQUFMLGtCQUFLLHNCQUFMO0FBQ0U7QUFDQTtBQUNBO0FBSEc7QUFBQTtBQU1MLElBQUssZ0JBQUwsa0JBQUssbUJBQUw7QUFDRSwyQkFBTztBQUNQLGtDQUFjO0FBQ2QsbUNBQWU7QUFIWjtBQUFBO0FBTUUsTUFBTSxlQUFlLHdCQUFDO0FBQUEsRUFDM0I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDNEI7QUFDNUIsTUFBSSxDQUFDLFNBQVM7QUFDWixVQUFNLElBQUksTUFBTSxpREFBaUQ7QUFBQSxFQUNuRTtBQUVBLFFBQU0sQ0FBQyxNQUFNLFdBQVcsMkJBQVMsZUFBd0I7QUFDekQsUUFBTSxDQUFDLGVB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
