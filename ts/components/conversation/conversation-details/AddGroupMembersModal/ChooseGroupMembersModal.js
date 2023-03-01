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
var ChooseGroupMembersModal_exports = {};
__export(ChooseGroupMembersModal_exports, {
  ChooseGroupMembersModal: () => ChooseGroupMembersModal
});
module.exports = __toCommonJS(ChooseGroupMembersModal_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_react_measure = __toESM(require("react-measure"));
var import_Username = require("../../../../types/Username");
var import_refMerger = require("../../../../util/refMerger");
var import_useRestoreFocus = require("../../../../hooks/useRestoreFocus");
var import_missingCaseError = require("../../../../util/missingCaseError");
var import_libphonenumberInstance = require("../../../../util/libphonenumberInstance");
var import_filterAndSortConversations = require("../../../../util/filterAndSortConversations");
var import_uuidFetchState = require("../../../../util/uuidFetchState");
var import_ModalHost = require("../../../ModalHost");
var import_ContactPills = require("../../../ContactPills");
var import_ContactPill = require("../../../ContactPill");
var import_ConversationList = require("../../../ConversationList");
var import_ContactCheckbox = require("../../../conversationList/ContactCheckbox");
var import_Button = require("../../../Button");
var import_SearchInput = require("../../../SearchInput");
var import_shouldNeverBeCalled = require("../../../../util/shouldNeverBeCalled");
const ChooseGroupMembersModal = /* @__PURE__ */ __name(({
  regionCode,
  candidateContacts,
  confirmAdds,
  conversationIdsAlreadyInGroup,
  getPreferredBadge,
  i18n,
  maxGroupSize,
  onClose,
  removeSelectedContact,
  searchTerm,
  selectedContacts,
  setSearchTerm,
  theme,
  toggleSelectedContact,
  lookupConversationWithoutUuid,
  showUserNotFoundModal,
  isUsernamesEnabled
}) => {
  const [focusRef] = (0, import_useRestoreFocus.useRestoreFocus)();
  const phoneNumber = (0, import_libphonenumberInstance.parseAndFormatPhoneNumber)(searchTerm, regionCode);
  let isPhoneNumberChecked = false;
  if (phoneNumber) {
    isPhoneNumberChecked = phoneNumber.isValid && selectedContacts.some((contact) => contact.e164 === phoneNumber.e164);
  }
  const isPhoneNumberVisible = phoneNumber && candidateContacts.every((contact) => contact.e164 !== phoneNumber.e164);
  let username;
  let isUsernameChecked = false;
  let isUsernameVisible = false;
  if (!phoneNumber && isUsernamesEnabled) {
    username = (0, import_Username.getUsernameFromSearch)(searchTerm);
    isUsernameChecked = selectedContacts.some((contact) => contact.username === username);
    isUsernameVisible = Boolean(username) && candidateContacts.every((contact) => contact.username !== username);
  }
  const inputRef = (0, import_react.useRef)(null);
  const numberOfContactsAlreadyInGroup = conversationIdsAlreadyInGroup.size;
  const hasSelectedMaximumNumberOfContacts = selectedContacts.length + numberOfContactsAlreadyInGroup >= maxGroupSize;
  const selectedConversationIdsSet = (0, import_react.useMemo)(() => new Set(selectedContacts.map((contact) => contact.id)), [selectedContacts]);
  const canContinue = Boolean(selectedContacts.length);
  const [filteredContacts, setFilteredContacts] = (0, import_react.useState)((0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(candidateContacts, "", regionCode));
  const normalizedSearchTerm = searchTerm.trim();
  (0, import_react.useEffect)(() => {
    const timeout = setTimeout(() => {
      setFilteredContacts((0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(candidateContacts, normalizedSearchTerm, regionCode));
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    candidateContacts,
    normalizedSearchTerm,
    setFilteredContacts,
    regionCode
  ]);
  const [uuidFetchState, setUuidFetchState] = (0, import_react.useState)({});
  const setIsFetchingUUID = (0, import_react.useCallback)((identifier, isFetching) => {
    setUuidFetchState((prevState) => {
      return isFetching ? {
        ...prevState,
        [identifier]: isFetching
      } : (0, import_lodash.omit)(prevState, identifier);
    });
  }, [setUuidFetchState]);
  let rowCount = 0;
  if (filteredContacts.length) {
    rowCount += filteredContacts.length;
  }
  if (isPhoneNumberVisible || isUsernameVisible) {
    if (filteredContacts.length) {
      rowCount += 1;
    }
    rowCount += 2;
  }
  const getRow = /* @__PURE__ */ __name((index) => {
    let virtualIndex = index;
    if ((isPhoneNumberVisible || isUsernameVisible) && filteredContacts.length) {
      if (virtualIndex === 0) {
        return {
          type: import_ConversationList.RowType.Header,
          i18nKey: "contactsHeader"
        };
      }
      virtualIndex -= 1;
    }
    if (virtualIndex < filteredContacts.length) {
      const contact = filteredContacts[virtualIndex];
      const isSelected = selectedConversationIdsSet.has(contact.id);
      const isAlreadyInGroup = conversationIdsAlreadyInGroup.has(contact.id);
      let disabledReason;
      if (isAlreadyInGroup) {
        disabledReason = import_ContactCheckbox.ContactCheckboxDisabledReason.AlreadyAdded;
      } else if (hasSelectedMaximumNumberOfContacts && !isSelected) {
        disabledReason = import_ContactCheckbox.ContactCheckboxDisabledReason.MaximumContactsSelected;
      }
      return {
        type: import_ConversationList.RowType.ContactCheckbox,
        contact,
        isChecked: isSelected || isAlreadyInGroup,
        disabledReason
      };
    }
    virtualIndex -= filteredContacts.length;
    if (isPhoneNumberVisible) {
      if (virtualIndex === 0) {
        return {
          type: import_ConversationList.RowType.Header,
          i18nKey: "findByPhoneNumberHeader"
        };
      }
      if (virtualIndex === 1) {
        return {
          type: import_ConversationList.RowType.PhoneNumberCheckbox,
          isChecked: isPhoneNumberChecked,
          isFetching: (0, import_uuidFetchState.isFetchingByE164)(uuidFetchState, phoneNumber.e164),
          phoneNumber
        };
      }
      virtualIndex -= 2;
    }
    if (username) {
      if (virtualIndex === 0) {
        return {
          type: import_ConversationList.RowType.Header,
          i18nKey: "findByUsernameHeader"
        };
      }
      if (virtualIndex === 1) {
        return {
          type: import_ConversationList.RowType.UsernameCheckbox,
          isChecked: isUsernameChecked,
          isFetching: (0, import_uuidFetchState.isFetchingByUsername)(uuidFetchState, username),
          username
        };
      }
      virtualIndex -= 2;
    }
    return void 0;
  }, "getRow");
  return /* @__PURE__ */ import_react.default.createElement(import_ModalHost.ModalHost, {
    onClose
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-AddGroupMembersModal module-AddGroupMembersModal--choose-members"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("close"),
    className: "module-AddGroupMembersModal__close-button",
    type: "button",
    onClick: () => {
      onClose();
    }
  }), /* @__PURE__ */ import_react.default.createElement("h1", {
    className: "module-AddGroupMembersModal__header"
  }, i18n("AddGroupMembersModal--title")), /* @__PURE__ */ import_react.default.createElement(import_SearchInput.SearchInput, {
    i18n,
    placeholder: i18n("contactSearchPlaceholder"),
    onChange: (event) => {
      setSearchTerm(event.target.value);
    },
    onKeyDown: (event) => {
      if (canContinue && event.key === "Enter") {
        confirmAdds();
      }
    },
    ref: (0, import_refMerger.refMerger)(inputRef, focusRef),
    value: searchTerm
  }), Boolean(selectedContacts.length) && /* @__PURE__ */ import_react.default.createElement(import_ContactPills.ContactPills, null, selectedContacts.map((contact) => /* @__PURE__ */ import_react.default.createElement(import_ContactPill.ContactPill, {
    key: contact.id,
    acceptedMessageRequest: contact.acceptedMessageRequest,
    avatarPath: contact.avatarPath,
    color: contact.color,
    firstName: contact.firstName,
    i18n,
    isMe: contact.isMe,
    id: contact.id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    profileName: contact.profileName,
    sharedGroupNames: contact.sharedGroupNames,
    title: contact.title,
    onClickRemove: () => {
      removeSelectedContact(contact.id);
    }
  }))), rowCount ? /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
    bounds: true
  }, ({ contentRect, measureRef }) => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-AddGroupMembersModal__list-wrapper",
      ref: measureRef,
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          inputRef.current?.focus();
        }
      }
    }, /* @__PURE__ */ import_react.default.createElement(import_ConversationList.ConversationList, {
      dimensions: contentRect.bounds,
      getPreferredBadge,
      getRow,
      i18n,
      onClickArchiveButton: import_shouldNeverBeCalled.shouldNeverBeCalled,
      onClickContactCheckbox: (conversationId, disabledReason) => {
        switch (disabledReason) {
          case void 0:
            toggleSelectedContact(conversationId);
            break;
          case import_ContactCheckbox.ContactCheckboxDisabledReason.AlreadyAdded:
          case import_ContactCheckbox.ContactCheckboxDisabledReason.MaximumContactsSelected:
            break;
          default:
            throw (0, import_missingCaseError.missingCaseError)(disabledReason);
        }
      },
      lookupConversationWithoutUuid,
      showUserNotFoundModal,
      setIsFetchingUUID,
      showConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
      onSelectConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
      renderMessageSearchResult: () => {
        (0, import_shouldNeverBeCalled.shouldNeverBeCalled)();
        return /* @__PURE__ */ import_react.default.createElement("div", null);
      },
      rowCount,
      shouldRecomputeRowHeights: false,
      showChooseGroupMembers: import_shouldNeverBeCalled.shouldNeverBeCalled,
      theme
    }));
  }) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-AddGroupMembersModal__no-candidate-contacts"
  }, i18n("noContactsFound")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-AddGroupMembersModal__button-container"
  }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    onClick: onClose,
    variant: import_Button.ButtonVariant.Secondary
  }, i18n("cancel")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    disabled: !canContinue,
    onClick: confirmAdds
  }, i18n("AddGroupMembersModal--continue-to-confirm")))));
}, "ChooseGroupMembersModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChooseGroupMembersModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ2hvb3NlR3JvdXBNZW1iZXJzTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBGdW5jdGlvbkNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwge1xuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG4gIHVzZVN0YXRlLFxuICB1c2VSZWYsXG4gIHVzZUNhbGxiYWNrLFxufSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBvbWl0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB0eXBlIHsgTWVhc3VyZWRDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0LW1lYXN1cmUnO1xuaW1wb3J0IE1lYXN1cmUgZnJvbSAncmVhY3QtbWVhc3VyZSc7XG5cbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSwgVGhlbWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBnZXRVc2VybmFtZUZyb21TZWFyY2ggfSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9Vc2VybmFtZSc7XG5pbXBvcnQgeyByZWZNZXJnZXIgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL3JlZk1lcmdlcic7XG5pbXBvcnQgeyB1c2VSZXN0b3JlRm9jdXMgfSBmcm9tICcuLi8uLi8uLi8uLi9ob29rcy91c2VSZXN0b3JlRm9jdXMnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgdHlwZSB7IExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGUgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL2xvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkJztcbmltcG9ydCB7IHBhcnNlQW5kRm9ybWF0UGhvbmVOdW1iZXIgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL2xpYnBob25lbnVtYmVySW5zdGFuY2UnO1xuaW1wb3J0IHsgZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RhdGUvc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIFVVSURGZXRjaFN0YXRlS2V5VHlwZSxcbiAgVVVJREZldGNoU3RhdGVUeXBlLFxufSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL3V1aWRGZXRjaFN0YXRlJztcbmltcG9ydCB7XG4gIGlzRmV0Y2hpbmdCeUUxNjQsXG4gIGlzRmV0Y2hpbmdCeVVzZXJuYW1lLFxufSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL3V1aWRGZXRjaFN0YXRlJztcbmltcG9ydCB7IE1vZGFsSG9zdCB9IGZyb20gJy4uLy4uLy4uL01vZGFsSG9zdCc7XG5pbXBvcnQgeyBDb250YWN0UGlsbHMgfSBmcm9tICcuLi8uLi8uLi9Db250YWN0UGlsbHMnO1xuaW1wb3J0IHsgQ29udGFjdFBpbGwgfSBmcm9tICcuLi8uLi8uLi9Db250YWN0UGlsbCc7XG5pbXBvcnQgdHlwZSB7IFJvdyB9IGZyb20gJy4uLy4uLy4uL0NvbnZlcnNhdGlvbkxpc3QnO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uTGlzdCwgUm93VHlwZSB9IGZyb20gJy4uLy4uLy4uL0NvbnZlcnNhdGlvbkxpc3QnO1xuaW1wb3J0IHsgQ29udGFjdENoZWNrYm94RGlzYWJsZWRSZWFzb24gfSBmcm9tICcuLi8uLi8uLi9jb252ZXJzYXRpb25MaXN0L0NvbnRhY3RDaGVja2JveCc7XG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuLi8uLi8uLi9CdXR0b24nO1xuaW1wb3J0IHsgU2VhcmNoSW5wdXQgfSBmcm9tICcuLi8uLi8uLi9TZWFyY2hJbnB1dCc7XG5pbXBvcnQgeyBzaG91bGROZXZlckJlQ2FsbGVkIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbC9zaG91bGROZXZlckJlQ2FsbGVkJztcblxuZXhwb3J0IHR5cGUgU3RhdGVQcm9wc1R5cGUgPSB7XG4gIHJlZ2lvbkNvZGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgY2FuZGlkYXRlQ29udGFjdHM6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGNvbnZlcnNhdGlvbklkc0FscmVhZHlJbkdyb3VwOiBTZXQ8c3RyaW5nPjtcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICB0aGVtZTogVGhlbWVUeXBlO1xuICBtYXhHcm91cFNpemU6IG51bWJlcjtcbiAgc2VhcmNoVGVybTogc3RyaW5nO1xuICBzZWxlY3RlZENvbnRhY3RzOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvblR5cGU+O1xuXG4gIGNvbmZpcm1BZGRzOiAoKSA9PiB2b2lkO1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuICByZW1vdmVTZWxlY3RlZENvbnRhY3Q6IChfOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHNldFNlYXJjaFRlcm06IChfOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHRvZ2dsZVNlbGVjdGVkQ29udGFjdDogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHZvaWQ7XG4gIGlzVXNlcm5hbWVzRW5hYmxlZDogYm9vbGVhbjtcbn0gJiBQaWNrPFxuICBMb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZEFjdGlvbnNUeXBlLFxuICAnbG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWQnXG4+O1xuXG50eXBlIEFjdGlvblByb3BzVHlwZSA9IE9taXQ8XG4gIExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGUsXG4gICdzZXRJc0ZldGNoaW5nVVVJRCcgfCAnbG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWQnXG4+O1xuXG50eXBlIFByb3BzVHlwZSA9IFN0YXRlUHJvcHNUeXBlICYgQWN0aW9uUHJvcHNUeXBlO1xuXG4vLyBUT0RPOiBUaGlzIHNob3VsZCB1c2UgPE1vZGFsPi4gU2VlIERFU0tUT1AtMTAzOC5cbmV4cG9ydCBjb25zdCBDaG9vc2VHcm91cE1lbWJlcnNNb2RhbDogRnVuY3Rpb25Db21wb25lbnQ8UHJvcHNUeXBlPiA9ICh7XG4gIHJlZ2lvbkNvZGUsXG4gIGNhbmRpZGF0ZUNvbnRhY3RzLFxuICBjb25maXJtQWRkcyxcbiAgY29udmVyc2F0aW9uSWRzQWxyZWFkeUluR3JvdXAsXG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBpMThuLFxuICBtYXhHcm91cFNpemUsXG4gIG9uQ2xvc2UsXG4gIHJlbW92ZVNlbGVjdGVkQ29udGFjdCxcbiAgc2VhcmNoVGVybSxcbiAgc2VsZWN0ZWRDb250YWN0cyxcbiAgc2V0U2VhcmNoVGVybSxcbiAgdGhlbWUsXG4gIHRvZ2dsZVNlbGVjdGVkQ29udGFjdCxcbiAgbG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWQsXG4gIHNob3dVc2VyTm90Rm91bmRNb2RhbCxcbiAgaXNVc2VybmFtZXNFbmFibGVkLFxufSkgPT4ge1xuICBjb25zdCBbZm9jdXNSZWZdID0gdXNlUmVzdG9yZUZvY3VzKCk7XG5cbiAgY29uc3QgcGhvbmVOdW1iZXIgPSBwYXJzZUFuZEZvcm1hdFBob25lTnVtYmVyKHNlYXJjaFRlcm0sIHJlZ2lvbkNvZGUpO1xuXG4gIGxldCBpc1Bob25lTnVtYmVyQ2hlY2tlZCA9IGZhbHNlO1xuICBpZiAocGhvbmVOdW1iZXIpIHtcbiAgICBpc1Bob25lTnVtYmVyQ2hlY2tlZCA9XG4gICAgICBwaG9uZU51bWJlci5pc1ZhbGlkICYmXG4gICAgICBzZWxlY3RlZENvbnRhY3RzLnNvbWUoY29udGFjdCA9PiBjb250YWN0LmUxNjQgPT09IHBob25lTnVtYmVyLmUxNjQpO1xuICB9XG5cbiAgY29uc3QgaXNQaG9uZU51bWJlclZpc2libGUgPVxuICAgIHBob25lTnVtYmVyICYmXG4gICAgY2FuZGlkYXRlQ29udGFjdHMuZXZlcnkoY29udGFjdCA9PiBjb250YWN0LmUxNjQgIT09IHBob25lTnVtYmVyLmUxNjQpO1xuXG4gIGxldCB1c2VybmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBsZXQgaXNVc2VybmFtZUNoZWNrZWQgPSBmYWxzZTtcbiAgbGV0IGlzVXNlcm5hbWVWaXNpYmxlID0gZmFsc2U7XG4gIGlmICghcGhvbmVOdW1iZXIgJiYgaXNVc2VybmFtZXNFbmFibGVkKSB7XG4gICAgdXNlcm5hbWUgPSBnZXRVc2VybmFtZUZyb21TZWFyY2goc2VhcmNoVGVybSk7XG5cbiAgICBpc1VzZXJuYW1lQ2hlY2tlZCA9IHNlbGVjdGVkQ29udGFjdHMuc29tZShcbiAgICAgIGNvbnRhY3QgPT4gY29udGFjdC51c2VybmFtZSA9PT0gdXNlcm5hbWVcbiAgICApO1xuXG4gICAgaXNVc2VybmFtZVZpc2libGUgPVxuICAgICAgQm9vbGVhbih1c2VybmFtZSkgJiZcbiAgICAgIGNhbmRpZGF0ZUNvbnRhY3RzLmV2ZXJ5KGNvbnRhY3QgPT4gY29udGFjdC51c2VybmFtZSAhPT0gdXNlcm5hbWUpO1xuICB9XG5cbiAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWY8bnVsbCB8IEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuXG4gIGNvbnN0IG51bWJlck9mQ29udGFjdHNBbHJlYWR5SW5Hcm91cCA9IGNvbnZlcnNhdGlvbklkc0FscmVhZHlJbkdyb3VwLnNpemU7XG5cbiAgY29uc3QgaGFzU2VsZWN0ZWRNYXhpbXVtTnVtYmVyT2ZDb250YWN0cyA9XG4gICAgc2VsZWN0ZWRDb250YWN0cy5sZW5ndGggKyBudW1iZXJPZkNvbnRhY3RzQWxyZWFkeUluR3JvdXAgPj0gbWF4R3JvdXBTaXplO1xuXG4gIGNvbnN0IHNlbGVjdGVkQ29udmVyc2F0aW9uSWRzU2V0OiBTZXQ8c3RyaW5nPiA9IHVzZU1lbW8oXG4gICAgKCkgPT4gbmV3IFNldChzZWxlY3RlZENvbnRhY3RzLm1hcChjb250YWN0ID0+IGNvbnRhY3QuaWQpKSxcbiAgICBbc2VsZWN0ZWRDb250YWN0c11cbiAgKTtcblxuICBjb25zdCBjYW5Db250aW51ZSA9IEJvb2xlYW4oc2VsZWN0ZWRDb250YWN0cy5sZW5ndGgpO1xuXG4gIGNvbnN0IFtmaWx0ZXJlZENvbnRhY3RzLCBzZXRGaWx0ZXJlZENvbnRhY3RzXSA9IHVzZVN0YXRlKFxuICAgIGZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zQnlSZWNlbnQoY2FuZGlkYXRlQ29udGFjdHMsICcnLCByZWdpb25Db2RlKVxuICApO1xuICBjb25zdCBub3JtYWxpemVkU2VhcmNoVGVybSA9IHNlYXJjaFRlcm0udHJpbSgpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldEZpbHRlcmVkQ29udGFjdHMoXG4gICAgICAgIGZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zQnlSZWNlbnQoXG4gICAgICAgICAgY2FuZGlkYXRlQ29udGFjdHMsXG4gICAgICAgICAgbm9ybWFsaXplZFNlYXJjaFRlcm0sXG4gICAgICAgICAgcmVnaW9uQ29kZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sIDIwMCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9O1xuICB9LCBbXG4gICAgY2FuZGlkYXRlQ29udGFjdHMsXG4gICAgbm9ybWFsaXplZFNlYXJjaFRlcm0sXG4gICAgc2V0RmlsdGVyZWRDb250YWN0cyxcbiAgICByZWdpb25Db2RlLFxuICBdKTtcblxuICBjb25zdCBbdXVpZEZldGNoU3RhdGUsIHNldFV1aWRGZXRjaFN0YXRlXSA9IHVzZVN0YXRlPFVVSURGZXRjaFN0YXRlVHlwZT4oe30pO1xuXG4gIGNvbnN0IHNldElzRmV0Y2hpbmdVVUlEID0gdXNlQ2FsbGJhY2soXG4gICAgKGlkZW50aWZpZXI6IFVVSURGZXRjaFN0YXRlS2V5VHlwZSwgaXNGZXRjaGluZzogYm9vbGVhbikgPT4ge1xuICAgICAgc2V0VXVpZEZldGNoU3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgcmV0dXJuIGlzRmV0Y2hpbmdcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLi4ucHJldlN0YXRlLFxuICAgICAgICAgICAgICBbaWRlbnRpZmllcl06IGlzRmV0Y2hpbmcsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiBvbWl0KHByZXZTdGF0ZSwgaWRlbnRpZmllcik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtzZXRVdWlkRmV0Y2hTdGF0ZV1cbiAgKTtcblxuICBsZXQgcm93Q291bnQgPSAwO1xuICBpZiAoZmlsdGVyZWRDb250YWN0cy5sZW5ndGgpIHtcbiAgICByb3dDb3VudCArPSBmaWx0ZXJlZENvbnRhY3RzLmxlbmd0aDtcbiAgfVxuICBpZiAoaXNQaG9uZU51bWJlclZpc2libGUgfHwgaXNVc2VybmFtZVZpc2libGUpIHtcbiAgICAvLyBcIkNvbnRhY3RzXCIgaGVhZGVyXG4gICAgaWYgKGZpbHRlcmVkQ29udGFjdHMubGVuZ3RoKSB7XG4gICAgICByb3dDb3VudCArPSAxO1xuICAgIH1cblxuICAgIC8vIFwiRmluZCBieSBwaG9uZSBudW1iZXJcIiArIHBob25lIG51bWJlclxuICAgIC8vIG9yXG4gICAgLy8gXCJGaW5kIGJ5IHVzZXJuYW1lXCIgKyB1c2VybmFtZVxuICAgIHJvd0NvdW50ICs9IDI7XG4gIH1cbiAgY29uc3QgZ2V0Um93ID0gKGluZGV4OiBudW1iZXIpOiB1bmRlZmluZWQgfCBSb3cgPT4ge1xuICAgIGxldCB2aXJ0dWFsSW5kZXggPSBpbmRleDtcblxuICAgIGlmIChcbiAgICAgIChpc1Bob25lTnVtYmVyVmlzaWJsZSB8fCBpc1VzZXJuYW1lVmlzaWJsZSkgJiZcbiAgICAgIGZpbHRlcmVkQ29udGFjdHMubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZiAodmlydHVhbEluZGV4ID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogUm93VHlwZS5IZWFkZXIsXG4gICAgICAgICAgaTE4bktleTogJ2NvbnRhY3RzSGVhZGVyJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdmlydHVhbEluZGV4IC09IDE7XG4gICAgfVxuXG4gICAgaWYgKHZpcnR1YWxJbmRleCA8IGZpbHRlcmVkQ29udGFjdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjb250YWN0ID0gZmlsdGVyZWRDb250YWN0c1t2aXJ0dWFsSW5kZXhdO1xuXG4gICAgICBjb25zdCBpc1NlbGVjdGVkID0gc2VsZWN0ZWRDb252ZXJzYXRpb25JZHNTZXQuaGFzKGNvbnRhY3QuaWQpO1xuICAgICAgY29uc3QgaXNBbHJlYWR5SW5Hcm91cCA9IGNvbnZlcnNhdGlvbklkc0FscmVhZHlJbkdyb3VwLmhhcyhjb250YWN0LmlkKTtcblxuICAgICAgbGV0IGRpc2FibGVkUmVhc29uOiB1bmRlZmluZWQgfCBDb250YWN0Q2hlY2tib3hEaXNhYmxlZFJlYXNvbjtcbiAgICAgIGlmIChpc0FscmVhZHlJbkdyb3VwKSB7XG4gICAgICAgIGRpc2FibGVkUmVhc29uID0gQ29udGFjdENoZWNrYm94RGlzYWJsZWRSZWFzb24uQWxyZWFkeUFkZGVkO1xuICAgICAgfSBlbHNlIGlmIChoYXNTZWxlY3RlZE1heGltdW1OdW1iZXJPZkNvbnRhY3RzICYmICFpc1NlbGVjdGVkKSB7XG4gICAgICAgIGRpc2FibGVkUmVhc29uID0gQ29udGFjdENoZWNrYm94RGlzYWJsZWRSZWFzb24uTWF4aW11bUNvbnRhY3RzU2VsZWN0ZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFJvd1R5cGUuQ29udGFjdENoZWNrYm94LFxuICAgICAgICBjb250YWN0LFxuICAgICAgICBpc0NoZWNrZWQ6IGlzU2VsZWN0ZWQgfHwgaXNBbHJlYWR5SW5Hcm91cCxcbiAgICAgICAgZGlzYWJsZWRSZWFzb24sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZpcnR1YWxJbmRleCAtPSBmaWx0ZXJlZENvbnRhY3RzLmxlbmd0aDtcblxuICAgIGlmIChpc1Bob25lTnVtYmVyVmlzaWJsZSkge1xuICAgICAgaWYgKHZpcnR1YWxJbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IFJvd1R5cGUuSGVhZGVyLFxuICAgICAgICAgIGkxOG5LZXk6ICdmaW5kQnlQaG9uZU51bWJlckhlYWRlcicsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAodmlydHVhbEluZGV4ID09PSAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogUm93VHlwZS5QaG9uZU51bWJlckNoZWNrYm94LFxuICAgICAgICAgIGlzQ2hlY2tlZDogaXNQaG9uZU51bWJlckNoZWNrZWQsXG4gICAgICAgICAgaXNGZXRjaGluZzogaXNGZXRjaGluZ0J5RTE2NCh1dWlkRmV0Y2hTdGF0ZSwgcGhvbmVOdW1iZXIuZTE2NCksXG4gICAgICAgICAgcGhvbmVOdW1iZXIsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2aXJ0dWFsSW5kZXggLT0gMjtcbiAgICB9XG5cbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIGlmICh2aXJ0dWFsSW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiBSb3dUeXBlLkhlYWRlcixcbiAgICAgICAgICBpMThuS2V5OiAnZmluZEJ5VXNlcm5hbWVIZWFkZXInLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKHZpcnR1YWxJbmRleCA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IFJvd1R5cGUuVXNlcm5hbWVDaGVja2JveCxcbiAgICAgICAgICBpc0NoZWNrZWQ6IGlzVXNlcm5hbWVDaGVja2VkLFxuICAgICAgICAgIGlzRmV0Y2hpbmc6IGlzRmV0Y2hpbmdCeVVzZXJuYW1lKHV1aWRGZXRjaFN0YXRlLCB1c2VybmFtZSksXG4gICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2aXJ0dWFsSW5kZXggLT0gMjtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsSG9zdCBvbkNsb3NlPXtvbkNsb3NlfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLUFkZEdyb3VwTWVtYmVyc01vZGFsIG1vZHVsZS1BZGRHcm91cE1lbWJlcnNNb2RhbC0tY2hvb3NlLW1lbWJlcnNcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ2Nsb3NlJyl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLUFkZEdyb3VwTWVtYmVyc01vZGFsX19jbG9zZS1idXR0b25cIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwibW9kdWxlLUFkZEdyb3VwTWVtYmVyc01vZGFsX19oZWFkZXJcIj5cbiAgICAgICAgICB7aTE4bignQWRkR3JvdXBNZW1iZXJzTW9kYWwtLXRpdGxlJyl9XG4gICAgICAgIDwvaDE+XG4gICAgICAgIDxTZWFyY2hJbnB1dFxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4oJ2NvbnRhY3RTZWFyY2hQbGFjZWhvbGRlcicpfVxuICAgICAgICAgIG9uQ2hhbmdlPXtldmVudCA9PiB7XG4gICAgICAgICAgICBzZXRTZWFyY2hUZXJtKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbktleURvd249e2V2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChjYW5Db250aW51ZSAmJiBldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgY29uZmlybUFkZHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlZj17cmVmTWVyZ2VyPEhUTUxJbnB1dEVsZW1lbnQ+KGlucHV0UmVmLCBmb2N1c1JlZil9XG4gICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XG4gICAgICAgIC8+XG4gICAgICAgIHtCb29sZWFuKHNlbGVjdGVkQ29udGFjdHMubGVuZ3RoKSAmJiAoXG4gICAgICAgICAgPENvbnRhY3RQaWxscz5cbiAgICAgICAgICAgIHtzZWxlY3RlZENvbnRhY3RzLm1hcChjb250YWN0ID0+IChcbiAgICAgICAgICAgICAgPENvbnRhY3RQaWxsXG4gICAgICAgICAgICAgICAga2V5PXtjb250YWN0LmlkfVxuICAgICAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e2NvbnRhY3QuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICBhdmF0YXJQYXRoPXtjb250YWN0LmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgY29sb3I9e2NvbnRhY3QuY29sb3J9XG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lPXtjb250YWN0LmZpcnN0TmFtZX1cbiAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgIGlzTWU9e2NvbnRhY3QuaXNNZX1cbiAgICAgICAgICAgICAgICBpZD17Y29udGFjdC5pZH1cbiAgICAgICAgICAgICAgICBuYW1lPXtjb250YWN0Lm5hbWV9XG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI9e2NvbnRhY3QucGhvbmVOdW1iZXJ9XG4gICAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e2NvbnRhY3QucHJvZmlsZU5hbWV9XG4gICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17Y29udGFjdC5zaGFyZWRHcm91cE5hbWVzfVxuICAgICAgICAgICAgICAgIHRpdGxlPXtjb250YWN0LnRpdGxlfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2tSZW1vdmU9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkQ29udGFjdChjb250YWN0LmlkKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9Db250YWN0UGlsbHM+XG4gICAgICAgICl9XG4gICAgICAgIHtyb3dDb3VudCA/IChcbiAgICAgICAgICA8TWVhc3VyZSBib3VuZHM+XG4gICAgICAgICAgICB7KHsgY29udGVudFJlY3QsIG1lYXN1cmVSZWYgfTogTWVhc3VyZWRDb21wb25lbnRQcm9wcykgPT4ge1xuICAgICAgICAgICAgICAvLyBXZSBkaXNhYmxlIHRoaXMgRVNMaW50IHJ1bGUgYmVjYXVzZSB3ZSdyZSBjYXB0dXJpbmcgYSBidWJibGVkIGtleWRvd25cbiAgICAgICAgICAgICAgLy8gICBldmVudC4gU2VlIFt0aGlzIG5vdGUgaW4gdGhlIGpzeC1hMTF5IGRvY3NdWzBdLlxuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAvLyBbMF06IGh0dHBzOi8vZ2l0aHViLmNvbS9qc3gtZXNsaW50L2VzbGludC1wbHVnaW4tanN4LWExMXkvYmxvYi9jMjc1OTY0ZjUyYzM1Nzc1MjA4YmQwMGNiNjEyYzZmODJlNDJlMzRmL2RvY3MvcnVsZXMvbm8tc3RhdGljLWVsZW1lbnQtaW50ZXJhY3Rpb25zLm1kI2Nhc2UtdGhlLWV2ZW50LWhhbmRsZXItaXMtb25seS1iZWluZy11c2VkLXRvLWNhcHR1cmUtYnViYmxlZC1ldmVudHNcbiAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUganN4LWExMXkvbm8tc3RhdGljLWVsZW1lbnQtaW50ZXJhY3Rpb25zICovXG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLUFkZEdyb3VwTWVtYmVyc01vZGFsX19saXN0LXdyYXBwZXJcIlxuICAgICAgICAgICAgICAgICAgcmVmPXttZWFzdXJlUmVmfVxuICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXtldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxDb252ZXJzYXRpb25MaXN0XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM9e2NvbnRlbnRSZWN0LmJvdW5kc31cbiAgICAgICAgICAgICAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgICAgICAgICAgICAgICBnZXRSb3c9e2dldFJvd31cbiAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgb25DbGlja0FyY2hpdmVCdXR0b249e3Nob3VsZE5ldmVyQmVDYWxsZWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2tDb250YWN0Q2hlY2tib3g9eyhcbiAgICAgICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkUmVhc29uOiB1bmRlZmluZWQgfCBDb250YWN0Q2hlY2tib3hEaXNhYmxlZFJlYXNvblxuICAgICAgICAgICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpc2FibGVkUmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2VsZWN0ZWRDb250YWN0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIENvbnRhY3RDaGVja2JveERpc2FibGVkUmVhc29uLkFscmVhZHlBZGRlZDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQ29udGFjdENoZWNrYm94RGlzYWJsZWRSZWFzb24uTWF4aW11bUNvbnRhY3RzU2VsZWN0ZWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSBuby1vcHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihkaXNhYmxlZFJlYXNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICBsb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZD17XG4gICAgICAgICAgICAgICAgICAgICAgbG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaG93VXNlck5vdEZvdW5kTW9kYWw9e3Nob3dVc2VyTm90Rm91bmRNb2RhbH1cbiAgICAgICAgICAgICAgICAgICAgc2V0SXNGZXRjaGluZ1VVSUQ9e3NldElzRmV0Y2hpbmdVVUlEfVxuICAgICAgICAgICAgICAgICAgICBzaG93Q29udmVyc2F0aW9uPXtzaG91bGROZXZlckJlQ2FsbGVkfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdENvbnZlcnNhdGlvbj17c2hvdWxkTmV2ZXJCZUNhbGxlZH1cbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyTWVzc2FnZVNlYXJjaFJlc3VsdD17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNob3VsZE5ldmVyQmVDYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgcm93Q291bnQ9e3Jvd0NvdW50fVxuICAgICAgICAgICAgICAgICAgICBzaG91bGRSZWNvbXB1dGVSb3dIZWlnaHRzPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgc2hvd0Nob29zZUdyb3VwTWVtYmVycz17c2hvdWxkTmV2ZXJCZUNhbGxlZH1cbiAgICAgICAgICAgICAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBqc3gtYTExeS9uby1zdGF0aWMtZWxlbWVudC1pbnRlcmFjdGlvbnMgKi9cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPC9NZWFzdXJlPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLUFkZEdyb3VwTWVtYmVyc01vZGFsX19uby1jYW5kaWRhdGUtY29udGFjdHNcIj5cbiAgICAgICAgICAgIHtpMThuKCdub0NvbnRhY3RzRm91bmQnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtQWRkR3JvdXBNZW1iZXJzTW9kYWxfX2J1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU2Vjb25kYXJ5fT5cbiAgICAgICAgICAgIHtpMThuKCdjYW5jZWwnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cblxuICAgICAgICAgIDxCdXR0b24gZGlzYWJsZWQ9eyFjYW5Db250aW51ZX0gb25DbGljaz17Y29uZmlybUFkZHN9PlxuICAgICAgICAgICAge2kxOG4oJ0FkZEdyb3VwTWVtYmVyc01vZGFsLS1jb250aW51ZS10by1jb25maXJtJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Nb2RhbEhvc3Q+XG4gICk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQU1PO0FBQ1Asb0JBQXFCO0FBRXJCLDJCQUFvQjtBQUdwQixzQkFBc0M7QUFDdEMsdUJBQTBCO0FBQzFCLDZCQUFnQztBQUNoQyw4QkFBaUM7QUFFakMsb0NBQTBDO0FBQzFDLHdDQUFtRDtBQU9uRCw0QkFHTztBQUNQLHVCQUEwQjtBQUMxQiwwQkFBNkI7QUFDN0IseUJBQTRCO0FBRTVCLDhCQUEwQztBQUMxQyw2QkFBOEM7QUFDOUMsb0JBQXNDO0FBQ3RDLHlCQUE0QjtBQUM1QixpQ0FBb0M7QUFnQzdCLE1BQU0sMEJBQXdELHdCQUFDO0FBQUEsRUFDcEU7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDSTtBQUNKLFFBQU0sQ0FBQyxZQUFZLDRDQUFnQjtBQUVuQyxRQUFNLGNBQWMsNkRBQTBCLFlBQVksVUFBVTtBQUVwRSxNQUFJLHVCQUF1QjtBQUMzQixNQUFJLGFBQWE7QUFDZiwyQkFDRSxZQUFZLFdBQ1osaUJBQWlCLEtB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
