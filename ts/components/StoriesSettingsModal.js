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
var StoriesSettingsModal_exports = {};
__export(StoriesSettingsModal_exports, {
  EditDistributionList: () => EditDistributionList,
  Page: () => Page,
  StoriesSettingsModal: () => StoriesSettingsModal
});
module.exports = __toCommonJS(StoriesSettingsModal_exports);
var import_react = __toESM(require("react"));
var import_react_measure = __toESM(require("react-measure"));
var import_lodash = require("lodash");
var import_Avatar = require("./Avatar");
var import_Button = require("./Button");
var import_Checkbox = require("./Checkbox");
var import_ConfirmationDialog = require("./ConfirmationDialog");
var import_ConversationList = require("./ConversationList");
var import_Input = require("./Input");
var import_Intl = require("./Intl");
var import_Stories = require("../types/Stories");
var import_Modal = require("./Modal");
var import_SearchInput = require("./SearchInput");
var import_StoryDistributionListName = require("./StoryDistributionListName");
var import_theme = require("../util/theme");
var import_Util = require("../types/Util");
var import_UUID = require("../types/UUID");
var import_filterAndSortConversations = require("../util/filterAndSortConversations");
var import_isNotNil = require("../util/isNotNil");
var import_shouldNeverBeCalled = require("../util/shouldNeverBeCalled");
var Page = /* @__PURE__ */ ((Page2) => {
  Page2["DistributionLists"] = "DistributionLists";
  Page2["AddViewer"] = "AddViewer";
  Page2["ChooseViewers"] = "ChooseViewers";
  Page2["NameStory"] = "NameStory";
  Page2["HideStoryFrom"] = "HideStoryFrom";
  return Page2;
})(Page || {});
function filterConversations(conversations, searchTerm) {
  return (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(conversations, searchTerm, void 0).filter((conversation) => conversation.uuid);
}
const StoriesSettingsModal = /* @__PURE__ */ __name(({
  candidateConversations,
  distributionLists,
  getPreferredBadge,
  hideStoriesSettings,
  i18n,
  me,
  onDeleteList,
  onDistributionListCreated,
  onHideMyStoriesFrom,
  onRemoveMember,
  onRepliesNReactionsChanged,
  onViewersUpdated,
  setMyStoriesToAllSignalConnections,
  toggleSignalConnectionsModal
}) => {
  const [listToEditId, setListToEditId] = (0, import_react.useState)(void 0);
  const listToEdit = (0, import_react.useMemo)(() => distributionLists.find((x) => x.id === listToEditId), [distributionLists, listToEditId]);
  const [page, setPage] = (0, import_react.useState)("DistributionLists" /* DistributionLists */);
  const [selectedContacts, setSelectedContacts] = (0, import_react.useState)([]);
  const resetChooseViewersScreen = (0, import_react.useCallback)(() => {
    setSelectedContacts([]);
    setPage("DistributionLists" /* DistributionLists */);
  }, []);
  const [confirmDeleteListId, setConfirmDeleteListId] = (0, import_react.useState)();
  const [confirmRemoveMember, setConfirmRemoveMember] = (0, import_react.useState)();
  let content;
  if (page !== "DistributionLists" /* DistributionLists */) {
    content = /* @__PURE__ */ import_react.default.createElement(EditDistributionList, {
      candidateConversations,
      getPreferredBadge,
      i18n,
      onDone: (name, uuids) => {
        onDistributionListCreated(name, uuids);
        resetChooseViewersScreen();
      },
      onViewersUpdated: (uuids) => {
        if (listToEditId && page === "AddViewer" /* AddViewer */) {
          onViewersUpdated(listToEditId, uuids);
          resetChooseViewersScreen();
        }
        if (page === "ChooseViewers" /* ChooseViewers */) {
          setPage("NameStory" /* NameStory */);
        }
        if (page === "HideStoryFrom" /* HideStoryFrom */) {
          onHideMyStoriesFrom(uuids);
          resetChooseViewersScreen();
        }
      },
      page,
      selectedContacts,
      setSelectedContacts
    });
  } else if (listToEdit) {
    const isMyStories = listToEdit.id === import_Stories.MY_STORIES_ID;
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, !isMyStories && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__list StoriesSettingsModal__list--no-pointer"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__avatar--private"
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, /* @__PURE__ */ import_react.default.createElement(import_StoryDistributionListName.StoryDistributionListName, {
      i18n,
      id: listToEdit.id,
      name: listToEdit.name
    })))), /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "StoriesSettingsModal__divider"
    })), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__title"
    }, i18n("StoriesSettings__who-can-see")), isMyStories && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: !listToEdit.members.length,
      description: i18n("StoriesSettings__mine__all--description"),
      isRadio: true,
      label: i18n("StoriesSettings__mine__all--label"),
      moduleClassName: "StoriesSettingsModal__checkbox",
      name: "share",
      onChange: () => {
        setMyStoriesToAllSignalConnections();
      }
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: listToEdit.isBlockList && listToEdit.members.length > 0,
      description: i18n("StoriesSettings__mine__exclude--description", [
        listToEdit.isBlockList ? String(listToEdit.members.length) : "0"
      ]),
      isRadio: true,
      label: i18n("StoriesSettings__mine__exclude--label"),
      moduleClassName: "StoriesSettingsModal__checkbox",
      name: "share",
      onChange: import_lodash.noop,
      onClick: () => {
        if (listToEdit.isBlockList) {
          setSelectedContacts(listToEdit.members);
        }
        setPage("HideStoryFrom" /* HideStoryFrom */);
      }
    }), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: !listToEdit.isBlockList && listToEdit.members.length > 0,
      description: !listToEdit.isBlockList && listToEdit.members.length ? i18n("StoriesSettings__mine__only--description--people", [
        String(listToEdit.members.length)
      ]) : i18n("StoriesSettings__mine__only--description"),
      isRadio: true,
      label: i18n("StoriesSettings__mine__only--label"),
      moduleClassName: "StoriesSettingsModal__checkbox",
      name: "share",
      onChange: import_lodash.noop,
      onClick: () => {
        if (!listToEdit.isBlockList) {
          setSelectedContacts(listToEdit.members);
        }
        setPage("AddViewer" /* AddViewer */);
      }
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__disclaimer"
    }, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
      components: {
        learnMore: /* @__PURE__ */ import_react.default.createElement("button", {
          className: "StoriesSettingsModal__disclaimer__learn-more",
          onClick: toggleSignalConnectionsModal,
          type: "button"
        }, i18n("StoriesSettings__mine__disclaimer--learn-more"))
      },
      i18n,
      id: "StoriesSettings__mine__disclaimer"
    }))), !isMyStories && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", {
      className: "StoriesSettingsModal__list",
      onClick: () => {
        setSelectedContacts(listToEdit.members);
        setPage("AddViewer" /* AddViewer */);
      },
      type: "button"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__avatar--new"
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, i18n("StoriesSettings__add-viewer")))), listToEdit.members.map((member) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__list StoriesSettingsModal__list--no-pointer",
      key: member.id
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: member.acceptedMessageRequest,
      avatarPath: member.avatarPath,
      badge: getPreferredBadge(member.badges),
      color: member.color,
      conversationType: member.type,
      i18n,
      isMe: true,
      sharedGroupNames: member.sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      theme: import_Util.ThemeType.dark,
      title: member.title
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, member.title)), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("StoriesSettings__remove--title", [
        member.title
      ]),
      className: "StoriesSettingsModal__list__delete",
      onClick: () => setConfirmRemoveMember({
        listId: listToEdit.id,
        title: member.title,
        uuid: member.uuid
      }),
      type: "button"
    })))), /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "StoriesSettingsModal__divider"
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__title"
    }, i18n("StoriesSettings__replies-reactions--title")), /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: listToEdit.allowsReplies,
      description: i18n("StoriesSettings__replies-reactions--description"),
      label: i18n("StoriesSettings__replies-reactions--label"),
      moduleClassName: "StoriesSettingsModal__checkbox",
      name: "replies-reactions",
      onChange: (value) => onRepliesNReactionsChanged(listToEdit.id, value)
    }), !isMyStories && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "StoriesSettingsModal__divider"
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      className: "StoriesSettingsModal__delete-list",
      onClick: () => setConfirmDeleteListId(listToEdit.id),
      type: "button"
    }, i18n("StoriesSettings__delete-list"))));
  } else {
    const privateStories = distributionLists.filter((list) => list.id !== import_Stories.MY_STORIES_ID);
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", {
      className: "StoriesSettingsModal__list",
      onClick: () => {
        setListToEditId(import_Stories.MY_STORIES_ID);
      },
      type: "button"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: me.acceptedMessageRequest,
      avatarPath: me.avatarPath,
      badge: getPreferredBadge(me.badges),
      color: me.color,
      conversationType: me.type,
      i18n,
      isMe: true,
      sharedGroupNames: me.sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      theme: import_Util.ThemeType.dark,
      title: me.title
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, i18n("Stories__mine"))), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__viewers"
    })), /* @__PURE__ */ import_react.default.createElement("hr", {
      className: "StoriesSettingsModal__divider"
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      className: "StoriesSettingsModal__list",
      onClick: () => {
        setPage("ChooseViewers" /* ChooseViewers */);
      },
      type: "button"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__avatar--new"
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, i18n("StoriesSettings__new-list")))), privateStories.map((list) => /* @__PURE__ */ import_react.default.createElement("button", {
      className: "StoriesSettingsModal__list",
      key: list.id,
      onClick: () => {
        setListToEditId(list.id);
      },
      type: "button"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__avatar--private"
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, list.name)), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__viewers"
    }, list.members.length === 1 ? i18n("StoriesSettings__viewers--singular", ["1"]) : i18n("StoriesSettings__viewers--plural", [
      String(list.members.length)
    ])))));
  }
  const isChoosingViewers = page === "ChooseViewers" /* ChooseViewers */ || page === "AddViewer" /* AddViewer */;
  let modalTitle = i18n("StoriesSettings__title");
  if (page === "HideStoryFrom" /* HideStoryFrom */) {
    modalTitle = i18n("StoriesSettings__hide-story");
  } else if (page === "NameStory" /* NameStory */) {
    modalTitle = i18n("StoriesSettings__name-story");
  } else if (isChoosingViewers) {
    modalTitle = i18n("StoriesSettings__choose-viewers");
  } else if (listToEdit) {
    modalTitle = (0, import_Stories.getStoryDistributionListName)(i18n, listToEdit.id, listToEdit.name);
  }
  const hasBackButton = page !== "DistributionLists" /* DistributionLists */ || listToEdit;
  const hasStickyButtons = isChoosingViewers || page === "NameStory" /* NameStory */ || page === "HideStoryFrom" /* HideStoryFrom */;
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
    hasStickyButtons,
    hasXButton: true,
    i18n,
    moduleClassName: "StoriesSettingsModal__modal",
    onBackButtonClick: hasBackButton ? () => {
      if (page === "HideStoryFrom" /* HideStoryFrom */) {
        resetChooseViewersScreen();
      } else if (page === "NameStory" /* NameStory */) {
        setPage("ChooseViewers" /* ChooseViewers */);
      } else if (isChoosingViewers) {
        resetChooseViewersScreen();
      } else if (listToEdit) {
        setListToEditId(void 0);
      }
    } : void 0,
    onClose: hideStoriesSettings,
    theme: import_theme.Theme.Dark,
    title: modalTitle
  }, content), confirmDeleteListId && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        action: () => {
          onDeleteList(confirmDeleteListId);
          setListToEditId(void 0);
        },
        style: "negative",
        text: i18n("delete")
      }
    ],
    i18n,
    onClose: () => {
      setConfirmDeleteListId(void 0);
    }
  }, i18n("StoriesSettings__delete-list--confirm")), confirmRemoveMember && /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
    actions: [
      {
        action: () => onRemoveMember(confirmRemoveMember.listId, confirmRemoveMember.uuid),
        style: "negative",
        text: i18n("StoriesSettings__remove--action")
      }
    ],
    i18n,
    onClose: () => {
      setConfirmRemoveMember(void 0);
    },
    title: i18n("StoriesSettings__remove--title", [
      confirmRemoveMember.title
    ])
  }, i18n("StoriesSettings__remove--body")));
}, "StoriesSettingsModal");
const EditDistributionList = /* @__PURE__ */ __name(({
  candidateConversations,
  getPreferredBadge,
  i18n,
  onDone,
  onViewersUpdated,
  page,
  selectedContacts,
  setSelectedContacts
}) => {
  const [storyName, setStoryName] = (0, import_react.useState)("");
  const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
  const normalizedSearchTerm = searchTerm.trim();
  const [filteredConversations, setFilteredConversations] = (0, import_react.useState)(filterConversations(candidateConversations, normalizedSearchTerm));
  (0, import_react.useEffect)(() => {
    const timeout = setTimeout(() => {
      setFilteredConversations(filterConversations(candidateConversations, normalizedSearchTerm));
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [candidateConversations, normalizedSearchTerm, setFilteredConversations]);
  const isEditingDistributionList = page === "AddViewer" /* AddViewer */ || page === "ChooseViewers" /* ChooseViewers */ || page === "NameStory" /* NameStory */ || page === "HideStoryFrom" /* HideStoryFrom */;
  (0, import_react.useEffect)(() => {
    if (!isEditingDistributionList) {
      setSearchTerm("");
    }
  }, [isEditingDistributionList]);
  const contactLookup = (0, import_react.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    candidateConversations.forEach((contact) => {
      map.set(contact.id, contact);
    });
    return map;
  }, [candidateConversations]);
  const selectedConversationUuids = (0, import_react.useMemo)(() => new Set(selectedContacts.map((contact) => contact.uuid).filter(import_isNotNil.isNotNil)), [selectedContacts]);
  const toggleSelectedConversation = (0, import_react.useCallback)((conversationId) => {
    let removeContact = false;
    const nextSelectedContacts = selectedContacts.filter((contact) => {
      if (contact.id === conversationId) {
        removeContact = true;
        return false;
      }
      return true;
    });
    if (removeContact) {
      setSelectedContacts(nextSelectedContacts);
      return;
    }
    const selectedContact = contactLookup.get(conversationId);
    if (selectedContact) {
      setSelectedContacts([...nextSelectedContacts, selectedContact]);
    }
  }, [contactLookup, selectedContacts, setSelectedContacts]);
  const isChoosingViewers = page === "ChooseViewers" /* ChooseViewers */ || page === "AddViewer" /* AddViewer */;
  if (page === "NameStory" /* NameStory */) {
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__name-story-avatar-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__list__avatar--private StoriesSettingsModal__list__avatar--private--large"
    })), /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
      i18n,
      onChange: setStoryName,
      placeholder: i18n("StoriesSettings__name-placeholder"),
      value: storyName
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__title"
    }, i18n("StoriesSettings__who-can-see")), selectedContacts.map((contact) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__list StoriesSettingsModal__list--no-pointer",
      key: contact.id
    }, /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__left"
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: contact.acceptedMessageRequest,
      avatarPath: contact.avatarPath,
      badge: getPreferredBadge(contact.badges),
      color: contact.color,
      conversationType: contact.type,
      i18n,
      isMe: true,
      sharedGroupNames: contact.sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      theme: import_Util.ThemeType.dark,
      title: contact.title
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__title"
    }, contact.title)))), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: !storyName,
      onClick: () => {
        onDone(storyName, Array.from(selectedConversationUuids));
        setStoryName("");
      },
      variant: import_Button.ButtonVariant.Primary
    }, i18n("done"))));
  }
  if (page === "AddViewer" /* AddViewer */ || page === "ChooseViewers" /* ChooseViewers */ || page === "HideStoryFrom" /* HideStoryFrom */) {
    const rowCount = filteredConversations.length;
    const getRow = /* @__PURE__ */ __name((index) => {
      const contact = filteredConversations[index];
      if (!contact || !contact.uuid) {
        return void 0;
      }
      const isSelected = selectedConversationUuids.has(import_UUID.UUID.cast(contact.uuid));
      return {
        type: import_ConversationList.RowType.ContactCheckbox,
        contact,
        isChecked: isSelected
      };
    }, "getRow");
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_SearchInput.SearchInput, {
      disabled: candidateConversations.length === 0,
      i18n,
      placeholder: i18n("contactSearchPlaceholder"),
      moduleClassName: "StoriesSettingsModal__search",
      onChange: (event) => {
        setSearchTerm(event.target.value);
      },
      value: searchTerm
    }), selectedContacts.length ? /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__tags"
    }, selectedContacts.map((contact) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__tag",
      key: contact.id
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: contact.acceptedMessageRequest,
      avatarPath: contact.avatarPath,
      badge: getPreferredBadge(contact.badges),
      color: contact.color,
      conversationType: contact.type,
      i18n,
      isMe: contact.isMe,
      sharedGroupNames: contact.sharedGroupNames,
      size: import_Avatar.AvatarSize.TWENTY_EIGHT,
      theme: import_Util.ThemeType.dark,
      title: contact.title
    }), /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__tag__name"
    }, contact.firstName || contact.profileName || contact.phoneNumber), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("StoriesSettings__remove--title", [
        contact.title
      ]),
      className: "StoriesSettingsModal__tag__remove",
      onClick: () => toggleSelectedConversation(contact.id),
      type: "button"
    })))) : void 0, candidateConversations.length ? /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
      bounds: true
    }, ({ contentRect, measureRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoriesSettingsModal__conversation-list",
      ref: measureRef
    }, /* @__PURE__ */ import_react.default.createElement(import_ConversationList.ConversationList, {
      dimensions: contentRect.bounds,
      getPreferredBadge,
      getRow,
      i18n,
      onClickArchiveButton: import_shouldNeverBeCalled.shouldNeverBeCalled,
      onClickContactCheckbox: (conversationId) => {
        toggleSelectedConversation(conversationId);
      },
      lookupConversationWithoutUuid: import_shouldNeverBeCalled.asyncShouldNeverBeCalled,
      showConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
      showUserNotFoundModal: import_shouldNeverBeCalled.shouldNeverBeCalled,
      setIsFetchingUUID: import_shouldNeverBeCalled.shouldNeverBeCalled,
      onSelectConversation: import_shouldNeverBeCalled.shouldNeverBeCalled,
      renderMessageSearchResult: () => {
        (0, import_shouldNeverBeCalled.shouldNeverBeCalled)();
        return /* @__PURE__ */ import_react.default.createElement("div", null);
      },
      rowCount,
      shouldRecomputeRowHeights: false,
      showChooseGroupMembers: import_shouldNeverBeCalled.shouldNeverBeCalled,
      theme: import_Util.ThemeType.dark
    }))) : /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-ForwardMessageModal__no-candidate-contacts"
    }, i18n("noContactsFound")), isChoosingViewers && /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: selectedContacts.length === 0,
      onClick: () => {
        onViewersUpdated(Array.from(selectedConversationUuids));
      },
      variant: import_Button.ButtonVariant.Primary
    }, page === "AddViewer" /* AddViewer */ ? i18n("done") : i18n("next2"))), page === "HideStoryFrom" /* HideStoryFrom */ && /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      disabled: selectedContacts.length === 0,
      onClick: () => {
        onViewersUpdated(Array.from(selectedConversationUuids));
      },
      variant: import_Button.ButtonVariant.Primary
    }, i18n("update"))));
  }
  return null;
}, "EditDistributionList");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditDistributionList,
  Page,
  StoriesSettingsModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllc1NldHRpbmdzTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgTWVhc3VyZWRDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0LW1lYXN1cmUnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE1lYXN1cmUgZnJvbSAncmVhY3QtbWVhc3VyZSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGUgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB0eXBlIHsgUm93IH0gZnJvbSAnLi9Db252ZXJzYXRpb25MaXN0JztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0V2l0aE1lbWJlcnNEYXRhVHlwZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgQXZhdGFyLCBBdmF0YXJTaXplIH0gZnJvbSAnLi9BdmF0YXInO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25WYXJpYW50IH0gZnJvbSAnLi9CdXR0b24nO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tICcuL0NoZWNrYm94JztcbmltcG9ydCB7IENvbmZpcm1hdGlvbkRpYWxvZyB9IGZyb20gJy4vQ29uZmlybWF0aW9uRGlhbG9nJztcbmltcG9ydCB7IENvbnZlcnNhdGlvbkxpc3QsIFJvd1R5cGUgfSBmcm9tICcuL0NvbnZlcnNhdGlvbkxpc3QnO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuL0lucHV0JztcbmltcG9ydCB7IEludGwgfSBmcm9tICcuL0ludGwnO1xuaW1wb3J0IHsgTVlfU1RPUklFU19JRCwgZ2V0U3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICcuL01vZGFsJztcbmltcG9ydCB7IFNlYXJjaElucHV0IH0gZnJvbSAnLi9TZWFyY2hJbnB1dCc7XG5pbXBvcnQgeyBTdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lIH0gZnJvbSAnLi9TdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IGZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zQnlSZWNlbnQgfSBmcm9tICcuLi91dGlsL2ZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQge1xuICBzaG91bGROZXZlckJlQ2FsbGVkLFxuICBhc3luY1Nob3VsZE5ldmVyQmVDYWxsZWQsXG59IGZyb20gJy4uL3V0aWwvc2hvdWxkTmV2ZXJCZUNhbGxlZCc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgY2FuZGlkYXRlQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGRpc3RyaWJ1dGlvbkxpc3RzOiBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbkxpc3RXaXRoTWVtYmVyc0RhdGFUeXBlPjtcbiAgZ2V0UHJlZmVycmVkQmFkZ2U6IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlO1xuICBoaWRlU3Rvcmllc1NldHRpbmdzOiAoKSA9PiB1bmtub3duO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBtZTogQ29udmVyc2F0aW9uVHlwZTtcbiAgb25EZWxldGVMaXN0OiAobGlzdElkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG9uRGlzdHJpYnV0aW9uTGlzdENyZWF0ZWQ6IChcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdmlld2VyVXVpZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPlxuICApID0+IHVua25vd247XG4gIG9uSGlkZU15U3Rvcmllc0Zyb206ICh2aWV3ZXJVdWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+KSA9PiB1bmtub3duO1xuICBvblJlbW92ZU1lbWJlcjogKGxpc3RJZDogc3RyaW5nLCB1dWlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZCkgPT4gdW5rbm93bjtcbiAgb25SZXBsaWVzTlJlYWN0aW9uc0NoYW5nZWQ6IChcbiAgICBsaXN0SWQ6IHN0cmluZyxcbiAgICBhbGxvd3NSZXBsaWVzOiBib29sZWFuXG4gICkgPT4gdW5rbm93bjtcbiAgb25WaWV3ZXJzVXBkYXRlZDogKFxuICAgIGxpc3RJZDogc3RyaW5nLFxuICAgIHZpZXdlclV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT5cbiAgKSA9PiB1bmtub3duO1xuICBzZXRNeVN0b3JpZXNUb0FsbFNpZ25hbENvbm5lY3Rpb25zOiAoKSA9PiB1bmtub3duO1xuICB0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsOiAoKSA9PiB1bmtub3duO1xufTtcblxuZXhwb3J0IGVudW0gUGFnZSB7XG4gIERpc3RyaWJ1dGlvbkxpc3RzID0gJ0Rpc3RyaWJ1dGlvbkxpc3RzJyxcbiAgQWRkVmlld2VyID0gJ0FkZFZpZXdlcicsXG4gIENob29zZVZpZXdlcnMgPSAnQ2hvb3NlVmlld2VycycsXG4gIE5hbWVTdG9yeSA9ICdOYW1lU3RvcnknLFxuICBIaWRlU3RvcnlGcm9tID0gJ0hpZGVTdG9yeUZyb20nLFxufVxuXG5mdW5jdGlvbiBmaWx0ZXJDb252ZXJzYXRpb25zKFxuICBjb252ZXJzYXRpb25zOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvblR5cGU+LFxuICBzZWFyY2hUZXJtOiBzdHJpbmdcbikge1xuICByZXR1cm4gZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudChcbiAgICBjb252ZXJzYXRpb25zLFxuICAgIHNlYXJjaFRlcm0sXG4gICAgdW5kZWZpbmVkXG4gICkuZmlsdGVyKGNvbnZlcnNhdGlvbiA9PiBjb252ZXJzYXRpb24udXVpZCk7XG59XG5cbmV4cG9ydCBjb25zdCBTdG9yaWVzU2V0dGluZ3NNb2RhbCA9ICh7XG4gIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnMsXG4gIGRpc3RyaWJ1dGlvbkxpc3RzLFxuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgaGlkZVN0b3JpZXNTZXR0aW5ncyxcbiAgaTE4bixcbiAgbWUsXG4gIG9uRGVsZXRlTGlzdCxcbiAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZCxcbiAgb25IaWRlTXlTdG9yaWVzRnJvbSxcbiAgb25SZW1vdmVNZW1iZXIsXG4gIG9uUmVwbGllc05SZWFjdGlvbnNDaGFuZ2VkLFxuICBvblZpZXdlcnNVcGRhdGVkLFxuICBzZXRNeVN0b3JpZXNUb0FsbFNpZ25hbENvbm5lY3Rpb25zLFxuICB0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbbGlzdFRvRWRpdElkLCBzZXRMaXN0VG9FZGl0SWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgdW5kZWZpbmVkPihcbiAgICB1bmRlZmluZWRcbiAgKTtcblxuICBjb25zdCBsaXN0VG9FZGl0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiBkaXN0cmlidXRpb25MaXN0cy5maW5kKHggPT4geC5pZCA9PT0gbGlzdFRvRWRpdElkKSxcbiAgICBbZGlzdHJpYnV0aW9uTGlzdHMsIGxpc3RUb0VkaXRJZF1cbiAgKTtcblxuICBjb25zdCBbcGFnZSwgc2V0UGFnZV0gPSB1c2VTdGF0ZTxQYWdlPihQYWdlLkRpc3RyaWJ1dGlvbkxpc3RzKTtcblxuICBjb25zdCBbc2VsZWN0ZWRDb250YWN0cywgc2V0U2VsZWN0ZWRDb250YWN0c10gPSB1c2VTdGF0ZTxcbiAgICBBcnJheTxDb252ZXJzYXRpb25UeXBlPlxuICA+KFtdKTtcblxuICBjb25zdCByZXNldENob29zZVZpZXdlcnNTY3JlZW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWRDb250YWN0cyhbXSk7XG4gICAgc2V0UGFnZShQYWdlLkRpc3RyaWJ1dGlvbkxpc3RzKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IFtjb25maXJtRGVsZXRlTGlzdElkLCBzZXRDb25maXJtRGVsZXRlTGlzdElkXSA9IHVzZVN0YXRlPFxuICAgIHN0cmluZyB8IHVuZGVmaW5lZFxuICA+KCk7XG4gIGNvbnN0IFtjb25maXJtUmVtb3ZlTWVtYmVyLCBzZXRDb25maXJtUmVtb3ZlTWVtYmVyXSA9IHVzZVN0YXRlPFxuICAgIHwgdW5kZWZpbmVkXG4gICAgfCB7XG4gICAgICAgIGxpc3RJZDogc3RyaW5nO1xuICAgICAgICB0aXRsZTogc3RyaW5nO1xuICAgICAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgPigpO1xuXG4gIGxldCBjb250ZW50OiBKU1guRWxlbWVudCB8IG51bGw7XG5cbiAgaWYgKHBhZ2UgIT09IFBhZ2UuRGlzdHJpYnV0aW9uTGlzdHMpIHtcbiAgICBjb250ZW50ID0gKFxuICAgICAgPEVkaXREaXN0cmlidXRpb25MaXN0XG4gICAgICAgIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnM9e2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnN9XG4gICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgb25Eb25lPXsobmFtZSwgdXVpZHMpID0+IHtcbiAgICAgICAgICBvbkRpc3RyaWJ1dGlvbkxpc3RDcmVhdGVkKG5hbWUsIHV1aWRzKTtcbiAgICAgICAgICByZXNldENob29zZVZpZXdlcnNTY3JlZW4oKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25WaWV3ZXJzVXBkYXRlZD17dXVpZHMgPT4ge1xuICAgICAgICAgIGlmIChsaXN0VG9FZGl0SWQgJiYgcGFnZSA9PT0gUGFnZS5BZGRWaWV3ZXIpIHtcbiAgICAgICAgICAgIG9uVmlld2Vyc1VwZGF0ZWQobGlzdFRvRWRpdElkLCB1dWlkcyk7XG4gICAgICAgICAgICByZXNldENob29zZVZpZXdlcnNTY3JlZW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFnZSA9PT0gUGFnZS5DaG9vc2VWaWV3ZXJzKSB7XG4gICAgICAgICAgICBzZXRQYWdlKFBhZ2UuTmFtZVN0b3J5KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFnZSA9PT0gUGFnZS5IaWRlU3RvcnlGcm9tKSB7XG4gICAgICAgICAgICBvbkhpZGVNeVN0b3JpZXNGcm9tKHV1aWRzKTtcbiAgICAgICAgICAgIHJlc2V0Q2hvb3NlVmlld2Vyc1NjcmVlbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgcGFnZT17cGFnZX1cbiAgICAgICAgc2VsZWN0ZWRDb250YWN0cz17c2VsZWN0ZWRDb250YWN0c31cbiAgICAgICAgc2V0U2VsZWN0ZWRDb250YWN0cz17c2V0U2VsZWN0ZWRDb250YWN0c31cbiAgICAgIC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChsaXN0VG9FZGl0KSB7XG4gICAgY29uc3QgaXNNeVN0b3JpZXMgPSBsaXN0VG9FZGl0LmlkID09PSBNWV9TVE9SSUVTX0lEO1xuXG4gICAgY29udGVudCA9IChcbiAgICAgIDw+XG4gICAgICAgIHshaXNNeVN0b3JpZXMgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0IFN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0LS1uby1wb2ludGVyXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X19sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX2F2YXRhci0tcHJpdmF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX3RpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8U3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZVxuICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICBpZD17bGlzdFRvRWRpdC5pZH1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17bGlzdFRvRWRpdC5uYW1lfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2RpdmlkZXJcIiAvPlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX3RpdGxlXCI+XG4gICAgICAgICAge2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fd2hvLWNhbi1zZWUnKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge2lzTXlTdG9yaWVzICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgIGNoZWNrZWQ9eyFsaXN0VG9FZGl0Lm1lbWJlcnMubGVuZ3RofVxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17aTE4bignU3Rvcmllc1NldHRpbmdzX19taW5lX19hbGwtLWRlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICAgIGlzUmFkaW9cbiAgICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fbWluZV9fYWxsLS1sYWJlbCcpfVxuICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fY2hlY2tib3hcIlxuICAgICAgICAgICAgICBuYW1lPVwic2hhcmVcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldE15U3Rvcmllc1RvQWxsU2lnbmFsQ29ubmVjdGlvbnMoKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICBjaGVja2VkPXtsaXN0VG9FZGl0LmlzQmxvY2tMaXN0ICYmIGxpc3RUb0VkaXQubWVtYmVycy5sZW5ndGggPiAwfVxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17aTE4bignU3Rvcmllc1NldHRpbmdzX19taW5lX19leGNsdWRlLS1kZXNjcmlwdGlvbicsIFtcbiAgICAgICAgICAgICAgICBsaXN0VG9FZGl0LmlzQmxvY2tMaXN0XG4gICAgICAgICAgICAgICAgICA/IFN0cmluZyhsaXN0VG9FZGl0Lm1lbWJlcnMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgOiAnMCcsXG4gICAgICAgICAgICAgIF0pfVxuICAgICAgICAgICAgICBpc1JhZGlvXG4gICAgICAgICAgICAgIGxhYmVsPXtpMThuKCdTdG9yaWVzU2V0dGluZ3NfX21pbmVfX2V4Y2x1ZGUtLWxhYmVsJyl9XG4gICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19jaGVja2JveFwiXG4gICAgICAgICAgICAgIG5hbWU9XCJzaGFyZVwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtub29wfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RUb0VkaXQuaXNCbG9ja0xpc3QpIHtcbiAgICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkQ29udGFjdHMobGlzdFRvRWRpdC5tZW1iZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0UGFnZShQYWdlLkhpZGVTdG9yeUZyb20pO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgIGNoZWNrZWQ9eyFsaXN0VG9FZGl0LmlzQmxvY2tMaXN0ICYmIGxpc3RUb0VkaXQubWVtYmVycy5sZW5ndGggPiAwfVxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17XG4gICAgICAgICAgICAgICAgIWxpc3RUb0VkaXQuaXNCbG9ja0xpc3QgJiYgbGlzdFRvRWRpdC5tZW1iZXJzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgPyBpMThuKCdTdG9yaWVzU2V0dGluZ3NfX21pbmVfX29ubHktLWRlc2NyaXB0aW9uLS1wZW9wbGUnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgU3RyaW5nKGxpc3RUb0VkaXQubWVtYmVycy5sZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgOiBpMThuKCdTdG9yaWVzU2V0dGluZ3NfX21pbmVfX29ubHktLWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpc1JhZGlvXG4gICAgICAgICAgICAgIGxhYmVsPXtpMThuKCdTdG9yaWVzU2V0dGluZ3NfX21pbmVfX29ubHktLWxhYmVsJyl9XG4gICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19jaGVja2JveFwiXG4gICAgICAgICAgICAgIG5hbWU9XCJzaGFyZVwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtub29wfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0VG9FZGl0LmlzQmxvY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZENvbnRhY3RzKGxpc3RUb0VkaXQubWVtYmVycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5BZGRWaWV3ZXIpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fZGlzY2xhaW1lclwiPlxuICAgICAgICAgICAgICA8SW50bFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICAgIGxlYXJuTW9yZTogKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2Rpc2NsYWltZXJfX2xlYXJuLW1vcmVcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZVNpZ25hbENvbm5lY3Rpb25zTW9kYWx9XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7aTE4bignU3Rvcmllc1NldHRpbmdzX19taW5lX19kaXNjbGFpbWVyLS1sZWFybi1tb3JlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgaWQ9XCJTdG9yaWVzU2V0dGluZ3NfX21pbmVfX2Rpc2NsYWltZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgeyFpc015U3RvcmllcyAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRDb250YWN0cyhsaXN0VG9FZGl0Lm1lbWJlcnMpO1xuICAgICAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5BZGRWaWV3ZXIpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX2xlZnRcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fYXZhdGFyLS1uZXdcIiAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X190aXRsZVwiPlxuICAgICAgICAgICAgICAgICAge2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fYWRkLXZpZXdlcicpfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIHtsaXN0VG9FZGl0Lm1lbWJlcnMubWFwKG1lbWJlciA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdCBTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdC0tbm8tcG9pbnRlclwiXG4gICAgICAgICAgICAgICAga2V5PXttZW1iZXIuaWR9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXttZW1iZXIuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgYXZhdGFyUGF0aD17bWVtYmVyLmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgICAgIGJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZShtZW1iZXIuYmFkZ2VzKX1cbiAgICAgICAgICAgICAgICAgICAgY29sb3I9e21lbWJlci5jb2xvcn1cbiAgICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uVHlwZT17bWVtYmVyLnR5cGV9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgIGlzTWVcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17bWVtYmVyLnNoYXJlZEdyb3VwTmFtZXN9XG4gICAgICAgICAgICAgICAgICAgIHNpemU9e0F2YXRhclNpemUuVEhJUlRZX1NJWH1cbiAgICAgICAgICAgICAgICAgICAgdGhlbWU9e1RoZW1lVHlwZS5kYXJrfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17bWVtYmVyLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X190aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICB7bWVtYmVyLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fcmVtb3ZlLS10aXRsZScsIFtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fZGVsZXRlXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgIHNldENvbmZpcm1SZW1vdmVNZW1iZXIoe1xuICAgICAgICAgICAgICAgICAgICAgIGxpc3RJZDogbGlzdFRvRWRpdC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbWVtYmVyLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG1lbWJlci51dWlkLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cblxuICAgICAgICA8aHIgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2RpdmlkZXJcIiAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX3RpdGxlXCI+XG4gICAgICAgICAge2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fcmVwbGllcy1yZWFjdGlvbnMtLXRpdGxlJyl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxDaGVja2JveFxuICAgICAgICAgIGNoZWNrZWQ9e2xpc3RUb0VkaXQuYWxsb3dzUmVwbGllc31cbiAgICAgICAgICBkZXNjcmlwdGlvbj17aTE4bignU3Rvcmllc1NldHRpbmdzX19yZXBsaWVzLXJlYWN0aW9ucy0tZGVzY3JpcHRpb24nKX1cbiAgICAgICAgICBsYWJlbD17aTE4bignU3Rvcmllc1NldHRpbmdzX19yZXBsaWVzLXJlYWN0aW9ucy0tbGFiZWwnKX1cbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fY2hlY2tib3hcIlxuICAgICAgICAgIG5hbWU9XCJyZXBsaWVzLXJlYWN0aW9uc1wiXG4gICAgICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IG9uUmVwbGllc05SZWFjdGlvbnNDaGFuZ2VkKGxpc3RUb0VkaXQuaWQsIHZhbHVlKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7IWlzTXlTdG9yaWVzICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGhyIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19kaXZpZGVyXCIgLz5cblxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fZGVsZXRlLWxpc3RcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlTGlzdElkKGxpc3RUb0VkaXQuaWQpfVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fZGVsZXRlLWxpc3QnKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBwcml2YXRlU3RvcmllcyA9IGRpc3RyaWJ1dGlvbkxpc3RzLmZpbHRlcihcbiAgICAgIGxpc3QgPT4gbGlzdC5pZCAhPT0gTVlfU1RPUklFU19JRFxuICAgICk7XG5cbiAgICBjb250ZW50ID0gKFxuICAgICAgPD5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0XCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRMaXN0VG9FZGl0SWQoTVlfU1RPUklFU19JRCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X19sZWZ0XCI+XG4gICAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e21lLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICAgIGF2YXRhclBhdGg9e21lLmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgIGJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZShtZS5iYWRnZXMpfVxuICAgICAgICAgICAgICBjb2xvcj17bWUuY29sb3J9XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9e21lLnR5cGV9XG4gICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgIGlzTWVcbiAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17bWUuc2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICAgIHRpdGxlPXttZS50aXRsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fdGl0bGVcIj5cbiAgICAgICAgICAgICAge2kxOG4oJ1N0b3JpZXNfX21pbmUnKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fdmlld2Vyc1wiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxociBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fZGl2aWRlclwiIC8+XG5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0XCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYWdlKFBhZ2UuQ2hvb3NlVmlld2Vycyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X19sZWZ0XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fYXZhdGFyLS1uZXdcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX3RpdGxlXCI+XG4gICAgICAgICAgICAgIHtpMThuKCdTdG9yaWVzU2V0dGluZ3NfX25ldy1saXN0Jyl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAge3ByaXZhdGVTdG9yaWVzLm1hcChsaXN0ID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdFwiXG4gICAgICAgICAgICBrZXk9e2xpc3QuaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldExpc3RUb0VkaXRJZChsaXN0LmlkKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fbGVmdFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fYXZhdGFyLS1wcml2YXRlXCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX3RpdGxlXCI+XG4gICAgICAgICAgICAgICAge2xpc3QubmFtZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fdmlld2Vyc1wiPlxuICAgICAgICAgICAgICB7bGlzdC5tZW1iZXJzLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICAgICAgID8gaTE4bignU3Rvcmllc1NldHRpbmdzX192aWV3ZXJzLS1zaW5ndWxhcicsIFsnMSddKVxuICAgICAgICAgICAgICAgIDogaTE4bignU3Rvcmllc1NldHRpbmdzX192aWV3ZXJzLS1wbHVyYWwnLCBbXG4gICAgICAgICAgICAgICAgICAgIFN0cmluZyhsaXN0Lm1lbWJlcnMubGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgIF0pfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvPlxuICAgICk7XG4gIH1cblxuICBjb25zdCBpc0Nob29zaW5nVmlld2VycyA9XG4gICAgcGFnZSA9PT0gUGFnZS5DaG9vc2VWaWV3ZXJzIHx8IHBhZ2UgPT09IFBhZ2UuQWRkVmlld2VyO1xuXG4gIGxldCBtb2RhbFRpdGxlOiBzdHJpbmcgPSBpMThuKCdTdG9yaWVzU2V0dGluZ3NfX3RpdGxlJyk7XG4gIGlmIChwYWdlID09PSBQYWdlLkhpZGVTdG9yeUZyb20pIHtcbiAgICBtb2RhbFRpdGxlID0gaTE4bignU3Rvcmllc1NldHRpbmdzX19oaWRlLXN0b3J5Jyk7XG4gIH0gZWxzZSBpZiAocGFnZSA9PT0gUGFnZS5OYW1lU3RvcnkpIHtcbiAgICBtb2RhbFRpdGxlID0gaTE4bignU3Rvcmllc1NldHRpbmdzX19uYW1lLXN0b3J5Jyk7XG4gIH0gZWxzZSBpZiAoaXNDaG9vc2luZ1ZpZXdlcnMpIHtcbiAgICBtb2RhbFRpdGxlID0gaTE4bignU3Rvcmllc1NldHRpbmdzX19jaG9vc2Utdmlld2VycycpO1xuICB9IGVsc2UgaWYgKGxpc3RUb0VkaXQpIHtcbiAgICBtb2RhbFRpdGxlID0gZ2V0U3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZShcbiAgICAgIGkxOG4sXG4gICAgICBsaXN0VG9FZGl0LmlkLFxuICAgICAgbGlzdFRvRWRpdC5uYW1lXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGhhc0JhY2tCdXR0b24gPSBwYWdlICE9PSBQYWdlLkRpc3RyaWJ1dGlvbkxpc3RzIHx8IGxpc3RUb0VkaXQ7XG4gIGNvbnN0IGhhc1N0aWNreUJ1dHRvbnMgPVxuICAgIGlzQ2hvb3NpbmdWaWV3ZXJzIHx8IHBhZ2UgPT09IFBhZ2UuTmFtZVN0b3J5IHx8IHBhZ2UgPT09IFBhZ2UuSGlkZVN0b3J5RnJvbTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8TW9kYWxcbiAgICAgICAgaGFzU3RpY2t5QnV0dG9ucz17aGFzU3RpY2t5QnV0dG9uc31cbiAgICAgICAgaGFzWEJ1dHRvblxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbW9kYWxcIlxuICAgICAgICBvbkJhY2tCdXR0b25DbGljaz17XG4gICAgICAgICAgaGFzQmFja0J1dHRvblxuICAgICAgICAgICAgPyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPT09IFBhZ2UuSGlkZVN0b3J5RnJvbSkge1xuICAgICAgICAgICAgICAgICAgcmVzZXRDaG9vc2VWaWV3ZXJzU2NyZWVuKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLk5hbWVTdG9yeSkge1xuICAgICAgICAgICAgICAgICAgc2V0UGFnZShQYWdlLkNob29zZVZpZXdlcnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNDaG9vc2luZ1ZpZXdlcnMpIHtcbiAgICAgICAgICAgICAgICAgIHJlc2V0Q2hvb3NlVmlld2Vyc1NjcmVlbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGlzdFRvRWRpdCkge1xuICAgICAgICAgICAgICAgICAgc2V0TGlzdFRvRWRpdElkKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIG9uQ2xvc2U9e2hpZGVTdG9yaWVzU2V0dGluZ3N9XG4gICAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgICAgICB0aXRsZT17bW9kYWxUaXRsZX1cbiAgICAgID5cbiAgICAgICAge2NvbnRlbnR9XG4gICAgICA8L01vZGFsPlxuICAgICAge2NvbmZpcm1EZWxldGVMaXN0SWQgJiYgKFxuICAgICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgICAgYWN0aW9ucz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgICBvbkRlbGV0ZUxpc3QoY29uZmlybURlbGV0ZUxpc3RJZCk7XG4gICAgICAgICAgICAgICAgc2V0TGlzdFRvRWRpdElkKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgICAgICAgICB0ZXh0OiBpMThuKCdkZWxldGUnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgIHNldENvbmZpcm1EZWxldGVMaXN0SWQodW5kZWZpbmVkKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fZGVsZXRlLWxpc3QtLWNvbmZpcm0nKX1cbiAgICAgICAgPC9Db25maXJtYXRpb25EaWFsb2c+XG4gICAgICApfVxuICAgICAge2NvbmZpcm1SZW1vdmVNZW1iZXIgJiYgKFxuICAgICAgICA8Q29uZmlybWF0aW9uRGlhbG9nXG4gICAgICAgICAgYWN0aW9ucz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhY3Rpb246ICgpID0+XG4gICAgICAgICAgICAgICAgb25SZW1vdmVNZW1iZXIoXG4gICAgICAgICAgICAgICAgICBjb25maXJtUmVtb3ZlTWVtYmVyLmxpc3RJZCxcbiAgICAgICAgICAgICAgICAgIGNvbmZpcm1SZW1vdmVNZW1iZXIudXVpZFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIHN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgICAgICAgICB0ZXh0OiBpMThuKCdTdG9yaWVzU2V0dGluZ3NfX3JlbW92ZS0tYWN0aW9uJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF19XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRDb25maXJtUmVtb3ZlTWVtYmVyKHVuZGVmaW5lZCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0aXRsZT17aTE4bignU3Rvcmllc1NldHRpbmdzX19yZW1vdmUtLXRpdGxlJywgW1xuICAgICAgICAgICAgY29uZmlybVJlbW92ZU1lbWJlci50aXRsZSxcbiAgICAgICAgICBdKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdTdG9yaWVzU2V0dGluZ3NfX3JlbW92ZS0tYm9keScpfVxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59O1xuXG50eXBlIEVkaXREaXN0cmlidXRpb25MaXN0UHJvcHNUeXBlID0ge1xuICBvbkRvbmU6IChuYW1lOiBzdHJpbmcsIHZpZXdlclV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT4pID0+IHVua25vd247XG4gIG9uVmlld2Vyc1VwZGF0ZWQ6ICh2aWV3ZXJVdWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+KSA9PiB1bmtub3duO1xuICBwYWdlOiBQYWdlO1xuICBzZWxlY3RlZENvbnRhY3RzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgc2V0U2VsZWN0ZWRDb250YWN0czogKGNvbnRhY3RzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPikgPT4gdW5rbm93bjtcbn0gJiBQaWNrPFByb3BzVHlwZSwgJ2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnMnIHwgJ2dldFByZWZlcnJlZEJhZGdlJyB8ICdpMThuJz47XG5cbmV4cG9ydCBjb25zdCBFZGl0RGlzdHJpYnV0aW9uTGlzdCA9ICh7XG4gIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnMsXG4gIGdldFByZWZlcnJlZEJhZGdlLFxuICBpMThuLFxuICBvbkRvbmUsXG4gIG9uVmlld2Vyc1VwZGF0ZWQsXG4gIHBhZ2UsXG4gIHNlbGVjdGVkQ29udGFjdHMsXG4gIHNldFNlbGVjdGVkQ29udGFjdHMsXG59OiBFZGl0RGlzdHJpYnV0aW9uTGlzdFByb3BzVHlwZSk6IEpTWC5FbGVtZW50IHwgbnVsbCA9PiB7XG4gIGNvbnN0IFtzdG9yeU5hbWUsIHNldFN0b3J5TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtzZWFyY2hUZXJtLCBzZXRTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBub3JtYWxpemVkU2VhcmNoVGVybSA9IHNlYXJjaFRlcm0udHJpbSgpO1xuXG4gIGNvbnN0IFtmaWx0ZXJlZENvbnZlcnNhdGlvbnMsIHNldEZpbHRlcmVkQ29udmVyc2F0aW9uc10gPSB1c2VTdGF0ZShcbiAgICBmaWx0ZXJDb252ZXJzYXRpb25zKGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnMsIG5vcm1hbGl6ZWRTZWFyY2hUZXJtKVxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0RmlsdGVyZWRDb252ZXJzYXRpb25zKFxuICAgICAgICBmaWx0ZXJDb252ZXJzYXRpb25zKGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnMsIG5vcm1hbGl6ZWRTZWFyY2hUZXJtKVxuICAgICAgKTtcbiAgICB9LCAyMDApO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfTtcbiAgfSwgW2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnMsIG5vcm1hbGl6ZWRTZWFyY2hUZXJtLCBzZXRGaWx0ZXJlZENvbnZlcnNhdGlvbnNdKTtcblxuICBjb25zdCBpc0VkaXRpbmdEaXN0cmlidXRpb25MaXN0ID1cbiAgICBwYWdlID09PSBQYWdlLkFkZFZpZXdlciB8fFxuICAgIHBhZ2UgPT09IFBhZ2UuQ2hvb3NlVmlld2VycyB8fFxuICAgIHBhZ2UgPT09IFBhZ2UuTmFtZVN0b3J5IHx8XG4gICAgcGFnZSA9PT0gUGFnZS5IaWRlU3RvcnlGcm9tO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpc0VkaXRpbmdEaXN0cmlidXRpb25MaXN0KSB7XG4gICAgICBzZXRTZWFyY2hUZXJtKCcnKTtcbiAgICB9XG4gIH0sIFtpc0VkaXRpbmdEaXN0cmlidXRpb25MaXN0XSk7XG5cbiAgY29uc3QgY29udGFjdExvb2t1cCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBjYW5kaWRhdGVDb252ZXJzYXRpb25zLmZvckVhY2goY29udGFjdCA9PiB7XG4gICAgICBtYXAuc2V0KGNvbnRhY3QuaWQsIGNvbnRhY3QpO1xuICAgIH0pO1xuICAgIHJldHVybiBtYXA7XG4gIH0sIFtjYW5kaWRhdGVDb252ZXJzYXRpb25zXSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRDb252ZXJzYXRpb25VdWlkczogU2V0PFVVSURTdHJpbmdUeXBlPiA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIG5ldyBTZXQoc2VsZWN0ZWRDb250YWN0cy5tYXAoY29udGFjdCA9PiBjb250YWN0LnV1aWQpLmZpbHRlcihpc05vdE5pbCkpLFxuICAgIFtzZWxlY3RlZENvbnRhY3RzXVxuICApO1xuXG4gIGNvbnN0IHRvZ2dsZVNlbGVjdGVkQ29udmVyc2F0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCByZW1vdmVDb250YWN0ID0gZmFsc2U7XG4gICAgICBjb25zdCBuZXh0U2VsZWN0ZWRDb250YWN0cyA9IHNlbGVjdGVkQ29udGFjdHMuZmlsdGVyKGNvbnRhY3QgPT4ge1xuICAgICAgICBpZiAoY29udGFjdC5pZCA9PT0gY29udmVyc2F0aW9uSWQpIHtcbiAgICAgICAgICByZW1vdmVDb250YWN0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChyZW1vdmVDb250YWN0KSB7XG4gICAgICAgIHNldFNlbGVjdGVkQ29udGFjdHMobmV4dFNlbGVjdGVkQ29udGFjdHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzZWxlY3RlZENvbnRhY3QgPSBjb250YWN0TG9va3VwLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICBpZiAoc2VsZWN0ZWRDb250YWN0KSB7XG4gICAgICAgIHNldFNlbGVjdGVkQ29udGFjdHMoWy4uLm5leHRTZWxlY3RlZENvbnRhY3RzLCBzZWxlY3RlZENvbnRhY3RdKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjb250YWN0TG9va3VwLCBzZWxlY3RlZENvbnRhY3RzLCBzZXRTZWxlY3RlZENvbnRhY3RzXVxuICApO1xuXG4gIGNvbnN0IGlzQ2hvb3NpbmdWaWV3ZXJzID1cbiAgICBwYWdlID09PSBQYWdlLkNob29zZVZpZXdlcnMgfHwgcGFnZSA9PT0gUGFnZS5BZGRWaWV3ZXI7XG5cbiAgaWYgKHBhZ2UgPT09IFBhZ2UuTmFtZVN0b3J5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX25hbWUtc3RvcnktYXZhdGFyLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX2F2YXRhci0tcHJpdmF0ZSBTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdF9fYXZhdGFyLS1wcml2YXRlLS1sYXJnZVwiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgb25DaGFuZ2U9e3NldFN0b3J5TmFtZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bignU3Rvcmllc1NldHRpbmdzX19uYW1lLXBsYWNlaG9sZGVyJyl9XG4gICAgICAgICAgdmFsdWU9e3N0b3J5TmFtZX1cbiAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX190aXRsZVwiPlxuICAgICAgICAgIHtpMThuKCdTdG9yaWVzU2V0dGluZ3NfX3doby1jYW4tc2VlJyl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtzZWxlY3RlZENvbnRhY3RzLm1hcChjb250YWN0ID0+IChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdCBTdG9yaWVzU2V0dGluZ3NNb2RhbF9fbGlzdC0tbm8tcG9pbnRlclwiXG4gICAgICAgICAgICBrZXk9e2NvbnRhY3QuaWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX2xlZnRcIj5cbiAgICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e2NvbnRhY3QuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICBhdmF0YXJQYXRoPXtjb250YWN0LmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgYmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlKGNvbnRhY3QuYmFkZ2VzKX1cbiAgICAgICAgICAgICAgICBjb2xvcj17Y29udGFjdC5jb2xvcn1cbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPXtjb250YWN0LnR5cGV9XG4gICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17Y29udGFjdC5zaGFyZWRHcm91cE5hbWVzfVxuICAgICAgICAgICAgICAgIHNpemU9e0F2YXRhclNpemUuVEhJUlRZX1NJWH1cbiAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2NvbnRhY3QudGl0bGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19saXN0X190aXRsZVwiPlxuICAgICAgICAgICAgICAgIHtjb250YWN0LnRpdGxlfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXshc3RvcnlOYW1lfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBvbkRvbmUoc3RvcnlOYW1lLCBBcnJheS5mcm9tKHNlbGVjdGVkQ29udmVyc2F0aW9uVXVpZHMpKTtcbiAgICAgICAgICAgICAgc2V0U3RvcnlOYW1lKCcnKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlByaW1hcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2RvbmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG5cbiAgaWYgKFxuICAgIHBhZ2UgPT09IFBhZ2UuQWRkVmlld2VyIHx8XG4gICAgcGFnZSA9PT0gUGFnZS5DaG9vc2VWaWV3ZXJzIHx8XG4gICAgcGFnZSA9PT0gUGFnZS5IaWRlU3RvcnlGcm9tXG4gICkge1xuICAgIGNvbnN0IHJvd0NvdW50ID0gZmlsdGVyZWRDb252ZXJzYXRpb25zLmxlbmd0aDtcbiAgICBjb25zdCBnZXRSb3cgPSAoaW5kZXg6IG51bWJlcik6IHVuZGVmaW5lZCB8IFJvdyA9PiB7XG4gICAgICBjb25zdCBjb250YWN0ID0gZmlsdGVyZWRDb252ZXJzYXRpb25zW2luZGV4XTtcbiAgICAgIGlmICghY29udGFjdCB8fCAhY29udGFjdC51dWlkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBzZWxlY3RlZENvbnZlcnNhdGlvblV1aWRzLmhhcyhVVUlELmNhc3QoY29udGFjdC51dWlkKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFJvd1R5cGUuQ29udGFjdENoZWNrYm94LFxuICAgICAgICBjb250YWN0LFxuICAgICAgICBpc0NoZWNrZWQ6IGlzU2VsZWN0ZWQsXG4gICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPD5cbiAgICAgICAgPFNlYXJjaElucHV0XG4gICAgICAgICAgZGlzYWJsZWQ9e2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnMubGVuZ3RoID09PSAwfVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2kxOG4oJ2NvbnRhY3RTZWFyY2hQbGFjZWhvbGRlcicpfVxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX19zZWFyY2hcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtldmVudCA9PiB7XG4gICAgICAgICAgICBzZXRTZWFyY2hUZXJtKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB2YWx1ZT17c2VhcmNoVGVybX1cbiAgICAgICAgLz5cbiAgICAgICAge3NlbGVjdGVkQ29udGFjdHMubGVuZ3RoID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX3RhZ3NcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZENvbnRhY3RzLm1hcChjb250YWN0ID0+IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fdGFnXCIga2V5PXtjb250YWN0LmlkfT5cbiAgICAgICAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXtjb250YWN0LmFjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICAgICAgICBhdmF0YXJQYXRoPXtjb250YWN0LmF2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgICBiYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2UoY29udGFjdC5iYWRnZXMpfVxuICAgICAgICAgICAgICAgICAgY29sb3I9e2NvbnRhY3QuY29sb3J9XG4gICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPXtjb250YWN0LnR5cGV9XG4gICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgaXNNZT17Y29udGFjdC5pc01lfVxuICAgICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17Y29udGFjdC5zaGFyZWRHcm91cE5hbWVzfVxuICAgICAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5UV0VOVFlfRUlHSFR9XG4gICAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17Y29udGFjdC50aXRsZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIlN0b3JpZXNTZXR0aW5nc01vZGFsX190YWdfX25hbWVcIj5cbiAgICAgICAgICAgICAgICAgIHtjb250YWN0LmZpcnN0TmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICBjb250YWN0LnByb2ZpbGVOYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3QucGhvbmVOdW1iZXJ9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3JpZXNTZXR0aW5nc19fcmVtb3ZlLS10aXRsZScsIFtcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdC50aXRsZSxcbiAgICAgICAgICAgICAgICAgIF0pfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX3RhZ19fcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVNlbGVjdGVkQ29udmVyc2F0aW9uKGNvbnRhY3QuaWQpfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IHVuZGVmaW5lZH1cbiAgICAgICAge2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgIDxNZWFzdXJlIGJvdW5kcz5cbiAgICAgICAgICAgIHsoeyBjb250ZW50UmVjdCwgbWVhc3VyZVJlZiB9OiBNZWFzdXJlZENvbXBvbmVudFByb3BzKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yaWVzU2V0dGluZ3NNb2RhbF9fY29udmVyc2F0aW9uLWxpc3RcIlxuICAgICAgICAgICAgICAgIHJlZj17bWVhc3VyZVJlZn1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxDb252ZXJzYXRpb25MaXN0XG4gICAgICAgICAgICAgICAgICBkaW1lbnNpb25zPXtjb250ZW50UmVjdC5ib3VuZHN9XG4gICAgICAgICAgICAgICAgICBnZXRQcmVmZXJyZWRCYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2V9XG4gICAgICAgICAgICAgICAgICBnZXRSb3c9e2dldFJvd31cbiAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrQXJjaGl2ZUJ1dHRvbj17c2hvdWxkTmV2ZXJCZUNhbGxlZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2tDb250YWN0Q2hlY2tib3g9eyhjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNlbGVjdGVkQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBsb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZD17YXN5bmNTaG91bGROZXZlckJlQ2FsbGVkfVxuICAgICAgICAgICAgICAgICAgc2hvd0NvbnZlcnNhdGlvbj17c2hvdWxkTmV2ZXJCZUNhbGxlZH1cbiAgICAgICAgICAgICAgICAgIHNob3dVc2VyTm90Rm91bmRNb2RhbD17c2hvdWxkTmV2ZXJCZUNhbGxlZH1cbiAgICAgICAgICAgICAgICAgIHNldElzRmV0Y2hpbmdVVUlEPXtzaG91bGROZXZlckJlQ2FsbGVkfVxuICAgICAgICAgICAgICAgICAgb25TZWxlY3RDb252ZXJzYXRpb249e3Nob3VsZE5ldmVyQmVDYWxsZWR9XG4gICAgICAgICAgICAgICAgICByZW5kZXJNZXNzYWdlU2VhcmNoUmVzdWx0PXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3VsZE5ldmVyQmVDYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgcm93Q291bnQ9e3Jvd0NvdW50fVxuICAgICAgICAgICAgICAgICAgc2hvdWxkUmVjb21wdXRlUm93SGVpZ2h0cz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICBzaG93Q2hvb3NlR3JvdXBNZW1iZXJzPXtzaG91bGROZXZlckJlQ2FsbGVkfVxuICAgICAgICAgICAgICAgICAgdGhlbWU9e1RoZW1lVHlwZS5kYXJrfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L01lYXN1cmU+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtRm9yd2FyZE1lc3NhZ2VNb2RhbF9fbm8tY2FuZGlkYXRlLWNvbnRhY3RzXCI+XG4gICAgICAgICAgICB7aTE4bignbm9Db250YWN0c0ZvdW5kJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtpc0Nob29zaW5nVmlld2VycyAmJiAoXG4gICAgICAgICAgPE1vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3NlbGVjdGVkQ29udGFjdHMubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25WaWV3ZXJzVXBkYXRlZChBcnJheS5mcm9tKHNlbGVjdGVkQ29udmVyc2F0aW9uVXVpZHMpKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5QcmltYXJ5fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7cGFnZSA9PT0gUGFnZS5BZGRWaWV3ZXIgPyBpMThuKCdkb25lJykgOiBpMThuKCduZXh0MicpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gICAgICAgICl9XG4gICAgICAgIHtwYWdlID09PSBQYWdlLkhpZGVTdG9yeUZyb20gJiYgKFxuICAgICAgICAgIDxNb2RhbC5CdXR0b25Gb290ZXI+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzZWxlY3RlZENvbnRhY3RzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uVmlld2Vyc1VwZGF0ZWQoQXJyYXkuZnJvbShzZWxlY3RlZENvbnZlcnNhdGlvblV1aWRzKSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuUHJpbWFyeX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2kxOG4oJ3VwZGF0ZScpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gICAgICAgICl9XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7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
