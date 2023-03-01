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
var SendStoryModal_exports = {};
__export(SendStoryModal_exports, {
  SendStoryModal: () => SendStoryModal
});
module.exports = __toCommonJS(SendStoryModal_exports);
var import_react = __toESM(require("react"));
var import_SearchInput = require("./SearchInput");
var import_filterAndSortConversations = require("../util/filterAndSortConversations");
var import_Avatar = require("./Avatar");
var import_Checkbox = require("./Checkbox");
var import_ContextMenu = require("./ContextMenu");
var import_StoriesSettingsModal = require("./StoriesSettingsModal");
var import_Stories = require("../types/Stories");
var import_Modal = require("./Modal");
var import_StoryDistributionListName = require("./StoryDistributionListName");
var import_theme = require("../util/theme");
var SendStoryPage = /* @__PURE__ */ ((SendStoryPage2) => {
  SendStoryPage2["SendStory"] = "SendStory";
  SendStoryPage2["ChooseGroups"] = "ChooseGroups";
  return SendStoryPage2;
})(SendStoryPage || {});
const Page = {
  ...SendStoryPage,
  ...import_StoriesSettingsModal.Page
};
function getListViewers(list, i18n, signalConnections) {
  let memberCount = list.memberUuids.length;
  if (list.id === import_Stories.MY_STORIES_ID && list.isBlockList) {
    memberCount = list.isBlockList ? signalConnections.length - list.memberUuids.length : signalConnections.length;
  }
  return memberCount === 1 ? i18n("StoriesSettings__viewers--singular", ["1"]) : i18n("StoriesSettings__viewers--plural", [String(memberCount)]);
}
const SendStoryModal = /* @__PURE__ */ __name(({
  candidateConversations,
  distributionLists,
  getPreferredBadge,
  groupConversations,
  groupStories,
  i18n,
  me,
  onClose,
  onDistributionListCreated,
  onSend,
  signalConnections,
  tagGroupsAsNewGroupStory
}) => {
  const [page, setPage] = (0, import_react.useState)(Page.SendStory);
  const [selectedListIds, setSelectedListIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
  const [selectedGroupIds, setSelectedGroupIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
  const selectedStoryNames = (0, import_react.useMemo)(() => distributionLists.filter((list) => selectedListIds.has(list.id)).map((list) => list.name).concat(groupStories.filter((group) => selectedGroupIds.has(group.id)).map((group) => group.title)), [distributionLists, groupStories, selectedGroupIds, selectedListIds]);
  const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
  const [filteredConversations, setFilteredConversations] = (0, import_react.useState)((0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(groupConversations, searchTerm, void 0));
  const normalizedSearchTerm = searchTerm.trim();
  (0, import_react.useEffect)(() => {
    const timeout = setTimeout(() => {
      setFilteredConversations((0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(groupConversations, normalizedSearchTerm, void 0));
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [groupConversations, normalizedSearchTerm, setFilteredConversations]);
  const [chosenGroupIds, setChosenGroupIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
  const chosenGroupNames = (0, import_react.useMemo)(() => filteredConversations.filter((group) => chosenGroupIds.has(group.id)).map((group) => group.title), [filteredConversations, chosenGroupIds]);
  const [selectedContacts, setSelectedContacts] = (0, import_react.useState)([]);
  let content;
  if (page === Page.ChooseViewers || page === Page.NameStory) {
    content = /* @__PURE__ */ import_react.default.createElement(import_StoriesSettingsModal.EditDistributionList, {
      candidateConversations,
      getPreferredBadge,
      i18n,
      onDone: (name, uuids) => {
        onDistributionListCreated(name, uuids);
        setPage(Page.SendStory);
      },
      onViewersUpdated: () => {
        if (page === Page.ChooseViewers) {
          setPage(Page.NameStory);
        } else {
          setPage(Page.SendStory);
        }
      },
      page,
      selectedContacts,
      setSelectedContacts
    });
  } else if (page === Page.ChooseGroups) {
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_SearchInput.SearchInput, {
      disabled: groupConversations.length === 0,
      i18n,
      placeholder: i18n("contactSearchPlaceholder"),
      moduleClassName: "StoriesSettingsModal__search",
      onChange: (event) => {
        setSearchTerm(event.target.value);
      },
      value: searchTerm
    }), filteredConversations.length ? filteredConversations.map((group) => /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: chosenGroupIds.has(group.id),
      key: group.id,
      label: group.title,
      moduleClassName: "SendStoryModal__distribution-list",
      name: "SendStoryModal__distribution-list",
      onChange: (value) => {
        setChosenGroupIds((groupIds) => {
          if (value) {
            groupIds.add(group.id);
          } else {
            groupIds.delete(group.id);
          }
          return /* @__PURE__ */ new Set([...groupIds]);
        });
      }
    }, ({ id, checkboxNode }) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
      className: "SendStoryModal__distribution-list__label",
      htmlFor: id
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: group.acceptedMessageRequest,
      avatarPath: group.avatarPath,
      badge: void 0,
      color: group.color,
      conversationType: group.type,
      i18n,
      isMe: false,
      sharedGroupNames: [],
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      title: group.title
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__info"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__name"
    }, group.title), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__description"
    }, group.membersCount === 1 ? i18n("ConversationHero--members-1") : i18n("ConversationHero--members", [
      String(group.membersCount)
    ])))), checkboxNode))) : /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-ForwardMessageModal__no-candidate-contacts"
    }, i18n("noContactsFound")));
  } else {
    content = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__top-bar"
    }, i18n("stories"), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      "aria-label": i18n("SendStoryModal__new"),
      i18n,
      menuOptions: [
        {
          label: i18n("SendStoryModal__new-private--title"),
          description: i18n("SendStoryModal__new-private--description"),
          icon: "SendStoryModal__icon--lock",
          onClick: () => setPage(Page.ChooseViewers)
        },
        {
          label: i18n("SendStoryModal__new-group--title"),
          description: i18n("SendStoryModal__new-group--description"),
          icon: "SendStoryModal__icon--group",
          onClick: () => setPage(Page.ChooseGroups)
        }
      ],
      moduleClassName: "SendStoryModal__new-story",
      popperOptions: {
        placement: "bottom",
        strategy: "absolute"
      },
      theme: import_theme.Theme.Dark
    }, i18n("SendStoryModal__new"))), distributionLists.map((list) => /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: selectedListIds.has(list.id),
      key: list.id,
      label: (0, import_Stories.getStoryDistributionListName)(i18n, list.id, list.name),
      moduleClassName: "SendStoryModal__distribution-list",
      name: "SendStoryModal__distribution-list",
      onChange: (value) => {
        setSelectedListIds((listIds) => {
          if (value) {
            listIds.add(list.id);
          } else {
            listIds.delete(list.id);
          }
          return /* @__PURE__ */ new Set([...listIds]);
        });
      }
    }, ({ id, checkboxNode }) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
      className: "SendStoryModal__distribution-list__label",
      htmlFor: id
    }, list.id === import_Stories.MY_STORIES_ID ? /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: me.acceptedMessageRequest,
      avatarPath: me.avatarPath,
      badge: void 0,
      color: me.color,
      conversationType: me.type,
      i18n,
      isMe: true,
      sharedGroupNames: me.sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      title: me.title
    }) : /* @__PURE__ */ import_react.default.createElement("span", {
      className: "StoriesSettingsModal__list__avatar--private"
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__info"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__name"
    }, /* @__PURE__ */ import_react.default.createElement(import_StoryDistributionListName.StoryDistributionListName, {
      i18n,
      id: list.id,
      name: list.name
    })), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__description"
    }, getListViewers(list, i18n, signalConnections)))), checkboxNode))), groupStories.map((group) => /* @__PURE__ */ import_react.default.createElement(import_Checkbox.Checkbox, {
      checked: selectedGroupIds.has(group.id),
      key: group.id,
      label: group.title,
      moduleClassName: "SendStoryModal__distribution-list",
      name: "SendStoryModal__distribution-list",
      onChange: (value) => {
        setSelectedGroupIds((groupIds) => {
          if (value) {
            groupIds.add(group.id);
          } else {
            groupIds.delete(group.id);
          }
          return /* @__PURE__ */ new Set([...groupIds]);
        });
      }
    }, ({ id, checkboxNode }) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", {
      className: "SendStoryModal__distribution-list__label",
      htmlFor: id
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: group.acceptedMessageRequest,
      avatarPath: group.avatarPath,
      badge: void 0,
      color: group.color,
      conversationType: group.type,
      i18n,
      isMe: false,
      sharedGroupNames: [],
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      title: group.title
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__info"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__name"
    }, group.title), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__distribution-list__description"
    }, group.membersCount === 1 ? i18n("ConversationHero--members-1") : i18n("ConversationHero--members", [
      String(group.membersCount)
    ])))), checkboxNode))));
  }
  let modalTitle;
  if (page === Page.ChooseGroups) {
    modalTitle = i18n("SendStoryModal__choose-groups");
  } else if (page === Page.NameStory) {
    modalTitle = i18n("StoriesSettings__name-story");
  } else if (page === Page.ChooseViewers) {
    modalTitle = i18n("StoriesSettings__choose-viewers");
  } else {
    modalTitle = i18n("SendStoryModal__title");
  }
  let selectedNames;
  if (page === Page.ChooseGroups) {
    selectedNames = chosenGroupNames.join(", ");
  } else {
    selectedNames = selectedStoryNames.map((listName) => (0, import_Stories.getStoryDistributionListName)(i18n, listName, listName)).join(", ");
  }
  const hasBackButton = page !== Page.SendStory;
  let modalFooter;
  if (page === Page.SendStory || page === Page.ChooseGroups) {
    modalFooter = /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, {
      moduleClassName: "SendStoryModal"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "SendStoryModal__selected-lists"
    }, selectedNames), page === Page.ChooseGroups && /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": "SendStoryModal__ok",
      className: "SendStoryModal__ok",
      disabled: !chosenGroupIds.size,
      onClick: () => {
        tagGroupsAsNewGroupStory(Array.from(chosenGroupIds));
        setChosenGroupIds(/* @__PURE__ */ new Set());
        setPage(Page.SendStory);
      },
      type: "button"
    }), page === Page.SendStory && /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": "SendStoryModal__send",
      className: "SendStoryModal__send",
      disabled: !selectedListIds.size && !selectedGroupIds.size,
      onClick: () => {
        onSend(Array.from(selectedListIds), Array.from(selectedGroupIds));
      },
      type: "button"
    }));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
    hasStickyButtons: true,
    hasXButton: true,
    i18n,
    modalFooter,
    onBackButtonClick: hasBackButton ? () => {
      if (page === Page.ChooseGroups) {
        setChosenGroupIds(/* @__PURE__ */ new Set());
        setPage(Page.SendStory);
      } else if (page === Page.ChooseViewers) {
        setSelectedContacts([]);
        setPage(Page.SendStory);
      } else if (page === Page.NameStory) {
        setPage(Page.ChooseViewers);
      }
    } : void 0,
    onClose,
    title: modalTitle
  }, content);
}, "SendStoryModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SendStoryModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2VuZFN0b3J5TW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBTZWFyY2hJbnB1dCB9IGZyb20gJy4vU2VhcmNoSW5wdXQnO1xuaW1wb3J0IHsgZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudCB9IGZyb20gJy4uL3V0aWwvZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnMnO1xuXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgQXZhdGFyLCBBdmF0YXJTaXplIH0gZnJvbSAnLi9BdmF0YXInO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tICcuL0NoZWNrYm94JztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi9Db250ZXh0TWVudSc7XG5pbXBvcnQge1xuICBFZGl0RGlzdHJpYnV0aW9uTGlzdCxcbiAgUGFnZSBhcyBTdG9yaWVzU2V0dGluZ3NQYWdlLFxufSBmcm9tICcuL1N0b3JpZXNTZXR0aW5nc01vZGFsJztcbmltcG9ydCB7IE1ZX1NUT1JJRVNfSUQsIGdldFN0b3J5RGlzdHJpYnV0aW9uTGlzdE5hbWUgfSBmcm9tICcuLi90eXBlcy9TdG9yaWVzJztcbmltcG9ydCB7IE1vZGFsIH0gZnJvbSAnLi9Nb2RhbCc7XG5pbXBvcnQgeyBTdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lIH0gZnJvbSAnLi9TdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgY2FuZGlkYXRlQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIGRpc3RyaWJ1dGlvbkxpc3RzOiBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZT47XG4gIGdldFByZWZlcnJlZEJhZGdlOiBQcmVmZXJyZWRCYWRnZVNlbGVjdG9yVHlwZTtcbiAgZ3JvdXBDb252ZXJzYXRpb25zOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgZ3JvdXBTdG9yaWVzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbWU6IENvbnZlcnNhdGlvblR5cGU7XG4gIG9uQ2xvc2U6ICgpID0+IHVua25vd247XG4gIG9uRGlzdHJpYnV0aW9uTGlzdENyZWF0ZWQ6IChcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdmlld2VyVXVpZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPlxuICApID0+IHVua25vd247XG4gIG9uU2VuZDogKFxuICAgIGxpc3RJZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPixcbiAgICBjb252ZXJzYXRpb25JZHM6IEFycmF5PHN0cmluZz5cbiAgKSA9PiB1bmtub3duO1xuICBzaWduYWxDb25uZWN0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIHRhZ0dyb3Vwc0FzTmV3R3JvdXBTdG9yeTogKGNpZHM6IEFycmF5PHN0cmluZz4pID0+IHVua25vd247XG59O1xuXG5lbnVtIFNlbmRTdG9yeVBhZ2Uge1xuICBTZW5kU3RvcnkgPSAnU2VuZFN0b3J5JyxcbiAgQ2hvb3NlR3JvdXBzID0gJ0Nob29zZUdyb3VwcycsXG59XG5cbmNvbnN0IFBhZ2UgPSB7XG4gIC4uLlNlbmRTdG9yeVBhZ2UsXG4gIC4uLlN0b3JpZXNTZXR0aW5nc1BhZ2UsXG59O1xuXG50eXBlIFBhZ2VUeXBlID0gU2VuZFN0b3J5UGFnZSB8IFN0b3JpZXNTZXR0aW5nc1BhZ2U7XG5cbmZ1bmN0aW9uIGdldExpc3RWaWV3ZXJzKFxuICBsaXN0OiBTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZSxcbiAgaTE4bjogTG9jYWxpemVyVHlwZSxcbiAgc2lnbmFsQ29ubmVjdGlvbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+XG4pOiBzdHJpbmcge1xuICBsZXQgbWVtYmVyQ291bnQgPSBsaXN0Lm1lbWJlclV1aWRzLmxlbmd0aDtcblxuICBpZiAobGlzdC5pZCA9PT0gTVlfU1RPUklFU19JRCAmJiBsaXN0LmlzQmxvY2tMaXN0KSB7XG4gICAgbWVtYmVyQ291bnQgPSBsaXN0LmlzQmxvY2tMaXN0XG4gICAgICA/IHNpZ25hbENvbm5lY3Rpb25zLmxlbmd0aCAtIGxpc3QubWVtYmVyVXVpZHMubGVuZ3RoXG4gICAgICA6IHNpZ25hbENvbm5lY3Rpb25zLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBtZW1iZXJDb3VudCA9PT0gMVxuICAgID8gaTE4bignU3Rvcmllc1NldHRpbmdzX192aWV3ZXJzLS1zaW5ndWxhcicsIFsnMSddKVxuICAgIDogaTE4bignU3Rvcmllc1NldHRpbmdzX192aWV3ZXJzLS1wbHVyYWwnLCBbU3RyaW5nKG1lbWJlckNvdW50KV0pO1xufVxuXG5leHBvcnQgY29uc3QgU2VuZFN0b3J5TW9kYWwgPSAoe1xuICBjYW5kaWRhdGVDb252ZXJzYXRpb25zLFxuICBkaXN0cmlidXRpb25MaXN0cyxcbiAgZ2V0UHJlZmVycmVkQmFkZ2UsXG4gIGdyb3VwQ29udmVyc2F0aW9ucyxcbiAgZ3JvdXBTdG9yaWVzLFxuICBpMThuLFxuICBtZSxcbiAgb25DbG9zZSxcbiAgb25EaXN0cmlidXRpb25MaXN0Q3JlYXRlZCxcbiAgb25TZW5kLFxuICBzaWduYWxDb25uZWN0aW9ucyxcbiAgdGFnR3JvdXBzQXNOZXdHcm91cFN0b3J5LFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbcGFnZSwgc2V0UGFnZV0gPSB1c2VTdGF0ZTxQYWdlVHlwZT4oUGFnZS5TZW5kU3RvcnkpO1xuXG4gIGNvbnN0IFtzZWxlY3RlZExpc3RJZHMsIHNldFNlbGVjdGVkTGlzdElkc10gPSB1c2VTdGF0ZTxTZXQ8VVVJRFN0cmluZ1R5cGU+PihcbiAgICBuZXcgU2V0KClcbiAgKTtcbiAgY29uc3QgW3NlbGVjdGVkR3JvdXBJZHMsIHNldFNlbGVjdGVkR3JvdXBJZHNdID0gdXNlU3RhdGU8U2V0PHN0cmluZz4+KFxuICAgIG5ldyBTZXQoKVxuICApO1xuICBjb25zdCBzZWxlY3RlZFN0b3J5TmFtZXMgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBkaXN0cmlidXRpb25MaXN0c1xuICAgICAgICAuZmlsdGVyKGxpc3QgPT4gc2VsZWN0ZWRMaXN0SWRzLmhhcyhsaXN0LmlkKSlcbiAgICAgICAgLm1hcChsaXN0ID0+IGxpc3QubmFtZSlcbiAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICBncm91cFN0b3JpZXNcbiAgICAgICAgICAgIC5maWx0ZXIoZ3JvdXAgPT4gc2VsZWN0ZWRHcm91cElkcy5oYXMoZ3JvdXAuaWQpKVxuICAgICAgICAgICAgLm1hcChncm91cCA9PiBncm91cC50aXRsZSlcbiAgICAgICAgKSxcbiAgICBbZGlzdHJpYnV0aW9uTGlzdHMsIGdyb3VwU3Rvcmllcywgc2VsZWN0ZWRHcm91cElkcywgc2VsZWN0ZWRMaXN0SWRzXVxuICApO1xuXG4gIGNvbnN0IFtzZWFyY2hUZXJtLCBzZXRTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBbZmlsdGVyZWRDb252ZXJzYXRpb25zLCBzZXRGaWx0ZXJlZENvbnZlcnNhdGlvbnNdID0gdXNlU3RhdGUoXG4gICAgZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudChcbiAgICAgIGdyb3VwQ29udmVyc2F0aW9ucyxcbiAgICAgIHNlYXJjaFRlcm0sXG4gICAgICB1bmRlZmluZWRcbiAgICApXG4gICk7XG5cbiAgY29uc3Qgbm9ybWFsaXplZFNlYXJjaFRlcm0gPSBzZWFyY2hUZXJtLnRyaW0oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldEZpbHRlcmVkQ29udmVyc2F0aW9ucyhcbiAgICAgICAgZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudChcbiAgICAgICAgICBncm91cENvbnZlcnNhdGlvbnMsXG4gICAgICAgICAgbm9ybWFsaXplZFNlYXJjaFRlcm0sXG4gICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgMjAwKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH07XG4gIH0sIFtncm91cENvbnZlcnNhdGlvbnMsIG5vcm1hbGl6ZWRTZWFyY2hUZXJtLCBzZXRGaWx0ZXJlZENvbnZlcnNhdGlvbnNdKTtcblxuICBjb25zdCBbY2hvc2VuR3JvdXBJZHMsIHNldENob3Nlbkdyb3VwSWRzXSA9IHVzZVN0YXRlPFNldDxzdHJpbmc+PihcbiAgICBuZXcgU2V0PHN0cmluZz4oKVxuICApO1xuXG4gIGNvbnN0IGNob3Nlbkdyb3VwTmFtZXMgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBmaWx0ZXJlZENvbnZlcnNhdGlvbnNcbiAgICAgICAgLmZpbHRlcihncm91cCA9PiBjaG9zZW5Hcm91cElkcy5oYXMoZ3JvdXAuaWQpKVxuICAgICAgICAubWFwKGdyb3VwID0+IGdyb3VwLnRpdGxlKSxcbiAgICBbZmlsdGVyZWRDb252ZXJzYXRpb25zLCBjaG9zZW5Hcm91cElkc11cbiAgKTtcblxuICBjb25zdCBbc2VsZWN0ZWRDb250YWN0cywgc2V0U2VsZWN0ZWRDb250YWN0c10gPSB1c2VTdGF0ZTxcbiAgICBBcnJheTxDb252ZXJzYXRpb25UeXBlPlxuICA+KFtdKTtcblxuICBsZXQgY29udGVudDogSlNYLkVsZW1lbnQ7XG4gIGlmIChwYWdlID09PSBQYWdlLkNob29zZVZpZXdlcnMgfHwgcGFnZSA9PT0gUGFnZS5OYW1lU3RvcnkpIHtcbiAgICBjb250ZW50ID0gKFxuICAgICAgPEVkaXREaXN0cmlidXRpb25MaXN0XG4gICAgICAgIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnM9e2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnN9XG4gICAgICAgIGdldFByZWZlcnJlZEJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZX1cbiAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgb25Eb25lPXsobmFtZSwgdXVpZHMpID0+IHtcbiAgICAgICAgICBvbkRpc3RyaWJ1dGlvbkxpc3RDcmVhdGVkKG5hbWUsIHV1aWRzKTtcbiAgICAgICAgICBzZXRQYWdlKFBhZ2UuU2VuZFN0b3J5KTtcbiAgICAgICAgfX1cbiAgICAgICAgb25WaWV3ZXJzVXBkYXRlZD17KCkgPT4ge1xuICAgICAgICAgIGlmIChwYWdlID09PSBQYWdlLkNob29zZVZpZXdlcnMpIHtcbiAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5OYW1lU3RvcnkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRQYWdlKFBhZ2UuU2VuZFN0b3J5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHBhZ2U9e3BhZ2V9XG4gICAgICAgIHNlbGVjdGVkQ29udGFjdHM9e3NlbGVjdGVkQ29udGFjdHN9XG4gICAgICAgIHNldFNlbGVjdGVkQ29udGFjdHM9e3NldFNlbGVjdGVkQ29udGFjdHN9XG4gICAgICAvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAocGFnZSA9PT0gUGFnZS5DaG9vc2VHcm91cHMpIHtcbiAgICBjb250ZW50ID0gKFxuICAgICAgPD5cbiAgICAgICAgPFNlYXJjaElucHV0XG4gICAgICAgICAgZGlzYWJsZWQ9e2dyb3VwQ29udmVyc2F0aW9ucy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bignY29udGFjdFNlYXJjaFBsYWNlaG9sZGVyJyl9XG4gICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX3NlYXJjaFwiXG4gICAgICAgICAgb25DaGFuZ2U9e2V2ZW50ID0+IHtcbiAgICAgICAgICAgIHNldFNlYXJjaFRlcm0oZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHZhbHVlPXtzZWFyY2hUZXJtfVxuICAgICAgICAvPlxuICAgICAgICB7ZmlsdGVyZWRDb252ZXJzYXRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICBmaWx0ZXJlZENvbnZlcnNhdGlvbnMubWFwKGdyb3VwID0+IChcbiAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICBjaGVja2VkPXtjaG9zZW5Hcm91cElkcy5oYXMoZ3JvdXAuaWQpfVxuICAgICAgICAgICAgICBrZXk9e2dyb3VwLmlkfVxuICAgICAgICAgICAgICBsYWJlbD17Z3JvdXAudGl0bGV9XG4gICAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdFwiXG4gICAgICAgICAgICAgIG5hbWU9XCJTZW5kU3RvcnlNb2RhbF9fZGlzdHJpYnV0aW9uLWxpc3RcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0Q2hvc2VuR3JvdXBJZHMoZ3JvdXBJZHMgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSWRzLmFkZChncm91cC5pZCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBncm91cElkcy5kZWxldGUoZ3JvdXAuaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTZXQoWy4uLmdyb3VwSWRzXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsoeyBpZCwgY2hlY2tib3hOb2RlIH0pID0+IChcbiAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9fbGFiZWxcIlxuICAgICAgICAgICAgICAgICAgICBodG1sRm9yPXtpZH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q9e2dyb3VwLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICAgICAgICAgICAgYXZhdGFyUGF0aD17Z3JvdXAuYXZhdGFyUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgICBiYWRnZT17dW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXtncm91cC5jb2xvcn1cbiAgICAgICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPXtncm91cC50eXBlfVxuICAgICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgICAgaXNNZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17W119XG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtncm91cC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9faW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU2VuZFN0b3J5TW9kYWxfX2Rpc3RyaWJ1dGlvbi1saXN0X19uYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z3JvdXAudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9fZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtncm91cC5tZW1iZXJzQ291bnQgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpMThuKCdDb252ZXJzYXRpb25IZXJvLS1tZW1iZXJzLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IGkxOG4oJ0NvbnZlcnNhdGlvbkhlcm8tLW1lbWJlcnMnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcoZ3JvdXAubWVtYmVyc0NvdW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAge2NoZWNrYm94Tm9kZX1cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQ2hlY2tib3g+XG4gICAgICAgICAgKSlcbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1Gb3J3YXJkTWVzc2FnZU1vZGFsX19uby1jYW5kaWRhdGUtY29udGFjdHNcIj5cbiAgICAgICAgICAgIHtpMThuKCdub0NvbnRhY3RzRm91bmQnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvPlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29udGVudCA9IChcbiAgICAgIDw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU2VuZFN0b3J5TW9kYWxfX3RvcC1iYXJcIj5cbiAgICAgICAgICB7aTE4bignc3RvcmllcycpfVxuICAgICAgICAgIDxDb250ZXh0TWVudVxuICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignU2VuZFN0b3J5TW9kYWxfX25ldycpfVxuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIG1lbnVPcHRpb25zPXtbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogaTE4bignU2VuZFN0b3J5TW9kYWxfX25ldy1wcml2YXRlLS10aXRsZScpLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpMThuKCdTZW5kU3RvcnlNb2RhbF9fbmV3LXByaXZhdGUtLWRlc2NyaXB0aW9uJyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ1NlbmRTdG9yeU1vZGFsX19pY29uLS1sb2NrJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRQYWdlKFBhZ2UuQ2hvb3NlVmlld2VycyksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogaTE4bignU2VuZFN0b3J5TW9kYWxfX25ldy1ncm91cC0tdGl0bGUnKSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogaTE4bignU2VuZFN0b3J5TW9kYWxfX25ldy1ncm91cC0tZGVzY3JpcHRpb24nKSxcbiAgICAgICAgICAgICAgICBpY29uOiAnU2VuZFN0b3J5TW9kYWxfX2ljb24tLWdyb3VwJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRQYWdlKFBhZ2UuQ2hvb3NlR3JvdXBzKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTZW5kU3RvcnlNb2RhbF9fbmV3LXN0b3J5XCJcbiAgICAgICAgICAgIHBvcHBlck9wdGlvbnM9e3tcbiAgICAgICAgICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ1NlbmRTdG9yeU1vZGFsX19uZXcnKX1cbiAgICAgICAgICA8L0NvbnRleHRNZW51PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2Rpc3RyaWJ1dGlvbkxpc3RzLm1hcChsaXN0ID0+IChcbiAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgIGNoZWNrZWQ9e3NlbGVjdGVkTGlzdElkcy5oYXMobGlzdC5pZCl9XG4gICAgICAgICAgICBrZXk9e2xpc3QuaWR9XG4gICAgICAgICAgICBsYWJlbD17Z2V0U3RvcnlEaXN0cmlidXRpb25MaXN0TmFtZShpMThuLCBsaXN0LmlkLCBsaXN0Lm5hbWUpfVxuICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU2VuZFN0b3J5TW9kYWxfX2Rpc3RyaWJ1dGlvbi1saXN0XCJcbiAgICAgICAgICAgIG5hbWU9XCJTZW5kU3RvcnlNb2RhbF9fZGlzdHJpYnV0aW9uLWxpc3RcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICBzZXRTZWxlY3RlZExpc3RJZHMobGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0SWRzLmFkZChsaXN0LmlkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbGlzdElkcy5kZWxldGUobGlzdC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2V0KFsuLi5saXN0SWRzXSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7KHsgaWQsIGNoZWNrYm94Tm9kZSB9KSA9PiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTZW5kU3RvcnlNb2RhbF9fZGlzdHJpYnV0aW9uLWxpc3RfX2xhYmVsXCJcbiAgICAgICAgICAgICAgICAgIGh0bWxGb3I9e2lkfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtsaXN0LmlkID09PSBNWV9TVE9SSUVTX0lEID8gKFxuICAgICAgICAgICAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17bWUuYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJQYXRoPXttZS5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICAgICAgICAgIGJhZGdlPXt1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I9e21lLmNvbG9yfVxuICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9e21lLnR5cGV9XG4gICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgICAgICAgc2hhcmVkR3JvdXBOYW1lcz17bWUuc2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgICAgICAgICAgICAgICBzaXplPXtBdmF0YXJTaXplLlRISVJUWV9TSVh9XG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e21lLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiU3Rvcmllc1NldHRpbmdzTW9kYWxfX2xpc3RfX2F2YXRhci0tcHJpdmF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9faW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9fbmFtZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxTdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2xpc3QuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtsaXN0Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTZW5kU3RvcnlNb2RhbF9fZGlzdHJpYnV0aW9uLWxpc3RfX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2dldExpc3RWaWV3ZXJzKGxpc3QsIGkxOG4sIHNpZ25hbENvbm5lY3Rpb25zKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIHtjaGVja2JveE5vZGV9XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0NoZWNrYm94PlxuICAgICAgICApKX1cbiAgICAgICAge2dyb3VwU3Rvcmllcy5tYXAoZ3JvdXAgPT4gKFxuICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRHcm91cElkcy5oYXMoZ3JvdXAuaWQpfVxuICAgICAgICAgICAga2V5PXtncm91cC5pZH1cbiAgICAgICAgICAgIGxhYmVsPXtncm91cC50aXRsZX1cbiAgICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdFwiXG4gICAgICAgICAgICBuYW1lPVwiU2VuZFN0b3J5TW9kYWxfX2Rpc3RyaWJ1dGlvbi1saXN0XCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRHcm91cElkcyhncm91cElkcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBncm91cElkcy5hZGQoZ3JvdXAuaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBncm91cElkcy5kZWxldGUoZ3JvdXAuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNldChbLi4uZ3JvdXBJZHNdKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsoeyBpZCwgY2hlY2tib3hOb2RlIH0pID0+IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8bGFiZWxcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9fbGFiZWxcIlxuICAgICAgICAgICAgICAgICAgaHRtbEZvcj17aWR9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEF2YXRhclxuICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXtncm91cC5hY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0fVxuICAgICAgICAgICAgICAgICAgICBhdmF0YXJQYXRoPXtncm91cC5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICAgICAgICBiYWRnZT17dW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17Z3JvdXAuY29sb3J9XG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9e2dyb3VwLnR5cGV9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgIGlzTWU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtbXX1cbiAgICAgICAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17Z3JvdXAudGl0bGV9XG4gICAgICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9faW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19kaXN0cmlidXRpb24tbGlzdF9fbmFtZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtncm91cC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTZW5kU3RvcnlNb2RhbF9fZGlzdHJpYnV0aW9uLWxpc3RfX2Rlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2dyb3VwLm1lbWJlcnNDb3VudCA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpMThuKCdDb252ZXJzYXRpb25IZXJvLS1tZW1iZXJzLTEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpMThuKCdDb252ZXJzYXRpb25IZXJvLS1tZW1iZXJzJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZyhncm91cC5tZW1iZXJzQ291bnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIHtjaGVja2JveE5vZGV9XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0NoZWNrYm94PlxuICAgICAgICApKX1cbiAgICAgIDwvPlxuICAgICk7XG4gIH1cblxuICBsZXQgbW9kYWxUaXRsZTogc3RyaW5nO1xuICBpZiAocGFnZSA9PT0gUGFnZS5DaG9vc2VHcm91cHMpIHtcbiAgICBtb2RhbFRpdGxlID0gaTE4bignU2VuZFN0b3J5TW9kYWxfX2Nob29zZS1ncm91cHMnKTtcbiAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLk5hbWVTdG9yeSkge1xuICAgIG1vZGFsVGl0bGUgPSBpMThuKCdTdG9yaWVzU2V0dGluZ3NfX25hbWUtc3RvcnknKTtcbiAgfSBlbHNlIGlmIChwYWdlID09PSBQYWdlLkNob29zZVZpZXdlcnMpIHtcbiAgICBtb2RhbFRpdGxlID0gaTE4bignU3Rvcmllc1NldHRpbmdzX19jaG9vc2Utdmlld2VycycpO1xuICB9IGVsc2Uge1xuICAgIG1vZGFsVGl0bGUgPSBpMThuKCdTZW5kU3RvcnlNb2RhbF9fdGl0bGUnKTtcbiAgfVxuXG4gIGxldCBzZWxlY3RlZE5hbWVzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGlmIChwYWdlID09PSBQYWdlLkNob29zZUdyb3Vwcykge1xuICAgIHNlbGVjdGVkTmFtZXMgPSBjaG9zZW5Hcm91cE5hbWVzLmpvaW4oJywgJyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0ZWROYW1lcyA9IHNlbGVjdGVkU3RvcnlOYW1lc1xuICAgICAgLm1hcChsaXN0TmFtZSA9PiBnZXRTdG9yeURpc3RyaWJ1dGlvbkxpc3ROYW1lKGkxOG4sIGxpc3ROYW1lLCBsaXN0TmFtZSkpXG4gICAgICAuam9pbignLCAnKTtcbiAgfVxuXG4gIGNvbnN0IGhhc0JhY2tCdXR0b24gPSBwYWdlICE9PSBQYWdlLlNlbmRTdG9yeTtcblxuICBsZXQgbW9kYWxGb290ZXI6IEpTWC5FbGVtZW50IHwgdW5kZWZpbmVkO1xuICBpZiAocGFnZSA9PT0gUGFnZS5TZW5kU3RvcnkgfHwgcGFnZSA9PT0gUGFnZS5DaG9vc2VHcm91cHMpIHtcbiAgICBtb2RhbEZvb3RlciA9IChcbiAgICAgIDxNb2RhbC5CdXR0b25Gb290ZXIgbW9kdWxlQ2xhc3NOYW1lPVwiU2VuZFN0b3J5TW9kYWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTZW5kU3RvcnlNb2RhbF9fc2VsZWN0ZWQtbGlzdHNcIj57c2VsZWN0ZWROYW1lc308L2Rpdj5cbiAgICAgICAge3BhZ2UgPT09IFBhZ2UuQ2hvb3NlR3JvdXBzICYmIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiU2VuZFN0b3J5TW9kYWxfX29rXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19va1wiXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNob3Nlbkdyb3VwSWRzLnNpemV9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHRhZ0dyb3Vwc0FzTmV3R3JvdXBTdG9yeShBcnJheS5mcm9tKGNob3Nlbkdyb3VwSWRzKSk7XG4gICAgICAgICAgICAgIHNldENob3Nlbkdyb3VwSWRzKG5ldyBTZXQoKSk7XG4gICAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5TZW5kU3RvcnkpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtwYWdlID09PSBQYWdlLlNlbmRTdG9yeSAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlNlbmRTdG9yeU1vZGFsX19zZW5kXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlNlbmRTdG9yeU1vZGFsX19zZW5kXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshc2VsZWN0ZWRMaXN0SWRzLnNpemUgJiYgIXNlbGVjdGVkR3JvdXBJZHMuc2l6ZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgb25TZW5kKEFycmF5LmZyb20oc2VsZWN0ZWRMaXN0SWRzKSwgQXJyYXkuZnJvbShzZWxlY3RlZEdyb3VwSWRzKSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvTW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxNb2RhbFxuICAgICAgaGFzU3RpY2t5QnV0dG9uc1xuICAgICAgaGFzWEJ1dHRvblxuICAgICAgaTE4bj17aTE4bn1cbiAgICAgIG1vZGFsRm9vdGVyPXttb2RhbEZvb3Rlcn1cbiAgICAgIG9uQmFja0J1dHRvbkNsaWNrPXtcbiAgICAgICAgaGFzQmFja0J1dHRvblxuICAgICAgICAgID8gKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAocGFnZSA9PT0gUGFnZS5DaG9vc2VHcm91cHMpIHtcbiAgICAgICAgICAgICAgICBzZXRDaG9zZW5Hcm91cElkcyhuZXcgU2V0KCkpO1xuICAgICAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5TZW5kU3RvcnkpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhZ2UgPT09IFBhZ2UuQ2hvb3NlVmlld2Vycykge1xuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkQ29udGFjdHMoW10pO1xuICAgICAgICAgICAgICAgIHNldFBhZ2UoUGFnZS5TZW5kU3RvcnkpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhZ2UgPT09IFBhZ2UuTmFtZVN0b3J5KSB7XG4gICAgICAgICAgICAgICAgc2V0UGFnZShQYWdlLkNob29zZVZpZXdlcnMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICB0aXRsZT17bW9kYWxUaXRsZX1cbiAgICA+XG4gICAgICB7Y29udGVudH1cbiAgICA8L01vZGFsPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBb0Q7QUFFcEQseUJBQTRCO0FBQzVCLHdDQUFtRDtBQU9uRCxvQkFBbUM7QUFDbkMsc0JBQXlCO0FBQ3pCLHlCQUE0QjtBQUM1QixrQ0FHTztBQUNQLHFCQUE0RDtBQUM1RCxtQkFBc0I7QUFDdEIsdUNBQTBDO0FBQzFDLG1CQUFzQjtBQXVCdEIsSUFBSyxnQkFBTCxrQkFBSyxtQkFBTDtBQUNFLGdDQUFZO0FBQ1osbUNBQWU7QUFGWjtBQUFBO0FBS0wsTUFBTSxPQUFPO0FBQUEsS0FDUjtBQUFBLEtBQ0E7QUFDTDtBQUlBLHdCQUNFLE1BQ0EsTUFDQSxtQkFDUTtBQUNSLE1BQUksY0FBYyxLQUFLLFlBQVk7QUFFbkMsTUFBSSxLQUFLLE9BQU8sZ0NBQWlCLEtBQUssYUFBYTtBQUNqRCxrQkFBYyxLQUFLLGNBQ2Ysa0JBQWtCLFNBQVMsS0FBSyxZQUFZLFNBQzVDLGtCQUFrQjtBQUFBLEVBQ3hC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QU0sVUFBVSxRQUFRLENBQUMsRUFDdEUsS0FBSyxJQUFJO0FBQUEsRUFDZDtBQUVBLFFBQU0sZ0JBQWdCLFNBQVMsS0FBSztBQUVwQyxNQUFJO0FBQ0osTUFBSSxTQUFTLEtBQUssYUFBYSxTQUFTLEtBQUssY0FBYztBQUN6RCxrQkFDRSxtREFBQyxtQkFBTSxjQUFOO0FBQUEsTUFBbUIsaUJBQWdCO0FBQUEsT0FDbEMsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUFrQyxhQUFjLEdBQzlELFNBQVMsS0FBSyxnQkFDYixtREFBQztBQUFBLE1BQ0MsY0FBVztBQUFBLE1BQ1gsV0FBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLGVBQWU7QUFBQSxNQUMxQixTQUFTLE1BQU07QUFDYixpQ0FBeUIsTUFBTSxLQUFLLGNBQWMsQ0FBQztBQUNuRCwwQkFBa0Isb0JBQUksSUFBSSxDQUFDO0FBQzNCLGdCQUFRLEtBQUssU0FBUztBQUFBLE1BQ3hCO0FBQUEsTUFDQSxNQUFLO0FBQUEsS0FDUCxHQUVELFNBQVMsS0FBSyxhQUNiLG1EQUFDO0FBQUEsTUFDQyxjQUFXO0FBQUEsTUFDWCxXQUFVO0FBQUEsTUFDVixVQUFVLENBQUMsZ0JBQWdCLFFBQVEsQ0FBQyxpQkFBaUI7QUFBQSxNQUNyRCxTQUFTLE1BQU07QUFDYixlQUFPLE1BQU0sS0FBSyxlQUFlLEdBQUcsTUFBTSxLQUFLLGdCQUFnQixDQUFDO0FBQUEsTUFDbEU7QUFBQSxNQUNBLE1BQUs7QUFBQSxLQUNQLENBRUo7QUFBQSxFQUVKO0FBRUEsU0FDRSxtREFBQztBQUFBLElBQ0Msa0JBQWdCO0FBQUEsSUFDaEIsWUFBVTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsSUFDQSxtQkFDRSxnQkFDSSxNQUFNO0FBQ0osVUFBSSxTQUFTLEtBQUssY0FBYztBQUM5QiwwQkFBa0Isb0JBQUksSUFBSSxDQUFDO0FBQzNCLGdCQUFRLEtBQUssU0FBUztBQUFBLE1BQ3hCLFdBQVcsU0FBUyxLQUFLLGVBQWU7QUFDdEMsNEJBQW9CLENBQUMsQ0FBQztBQUN0QixnQkFBUSxLQUFLLFNBQVM7QUFBQSxNQUN4QixXQUFXLFNBQVMsS0FBSyxXQUFXO0FBQ2xDLGdCQUFRLEtBQUssYUFBYTtBQUFBLE1BQzVCO0FBQUEsSUFDRixJQUNBO0FBQUEsSUFFTjtBQUFBLElBQ0EsT0FBTztBQUFBLEtBRU4sT0FDSDtBQUVKLEdBNVo4QjsiLAogICJuYW1lcyI6IFtdCn0K
