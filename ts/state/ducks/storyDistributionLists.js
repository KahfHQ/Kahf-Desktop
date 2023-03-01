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
var storyDistributionLists_exports = {};
__export(storyDistributionLists_exports, {
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer,
  useStoryDistributionListsActions: () => useStoryDistributionListsActions
});
module.exports = __toCommonJS(storyDistributionLists_exports);
var log = __toESM(require("../../logging/log"));
var import_Client = __toESM(require("../../sql/Client"));
var import_Stories = require("../../types/Stories");
var import_UUID = require("../../types/UUID");
var import_replaceIndex = require("../../util/replaceIndex");
var import_storage = require("../../services/storage");
var import_useBoundActions = require("../../hooks/useBoundActions");
const ALLOW_REPLIES_CHANGED = "storyDistributionLists/ALLOW_REPLIES_CHANGED";
const CREATE_LIST = "storyDistributionLists/CREATE_LIST";
const DELETE_LIST = "storyDistributionLists/DELETE_LIST";
const HIDE_MY_STORIES_FROM = "storyDistributionLists/HIDE_MY_STORIES_FROM";
const MODIFY_LIST = "storyDistributionLists/MODIFY_LIST";
const REMOVE_MEMBER = "storyDistributionLists/REMOVE_MEMBER";
const RESET_MY_STORIES = "storyDistributionLists/RESET_MY_STORIES";
const VIEWERS_CHANGED = "storyDistributionLists/VIEWERS_CHANGED";
function allowsRepliesChanged(listId, allowsReplies) {
  return async (dispatch) => {
    const storyDistribution = await import_Client.default.getStoryDistributionWithMembers(listId);
    if (!storyDistribution) {
      log.warn("storyDistributionLists.allowsRepliesChanged: No story found for id", listId);
      return;
    }
    if (storyDistribution.allowsReplies === allowsReplies) {
      log.warn("storyDistributionLists.allowsRepliesChanged: story already has the same value", { listId, allowsReplies });
      return;
    }
    await import_Client.default.modifyStoryDistribution({
      ...storyDistribution,
      allowsReplies,
      storageNeedsSync: true
    });
    (0, import_storage.storageServiceUploadJob)();
    log.info("storyDistributionLists.allowsRepliesChanged: allowsReplies has changed", listId);
    dispatch({
      type: ALLOW_REPLIES_CHANGED,
      payload: {
        listId,
        allowsReplies
      }
    });
  };
}
function createDistributionList(name, memberUuids, storageServiceDistributionListRecord, shouldSave = true) {
  return async (dispatch) => {
    const storyDistribution = {
      allowsReplies: true,
      id: import_UUID.UUID.generate().toString(),
      isBlockList: false,
      members: memberUuids,
      name,
      senderKeyInfo: void 0,
      storageNeedsSync: true,
      ...storageServiceDistributionListRecord || {}
    };
    if (shouldSave) {
      await import_Client.default.createNewStoryDistribution(storyDistribution);
    }
    if (storyDistribution.storageNeedsSync) {
      (0, import_storage.storageServiceUploadJob)();
    }
    dispatch({
      type: CREATE_LIST,
      payload: {
        allowsReplies: Boolean(storyDistribution.allowsReplies),
        deletedAtTimestamp: storyDistribution.deletedAtTimestamp,
        id: storyDistribution.id,
        isBlockList: Boolean(storyDistribution.isBlockList),
        memberUuids,
        name: storyDistribution.name
      }
    });
  };
}
function deleteDistributionList(listId) {
  return async (dispatch) => {
    const deletedAtTimestamp = Date.now();
    const storyDistribution = await import_Client.default.getStoryDistributionWithMembers(listId);
    if (!storyDistribution) {
      log.warn("No story distribution found for id", listId);
      return;
    }
    await import_Client.default.modifyStoryDistributionWithMembers({
      ...storyDistribution,
      deletedAtTimestamp,
      name: "",
      storageNeedsSync: true
    }, {
      toAdd: [],
      toRemove: storyDistribution.members
    });
    log.info("storyDistributionLists.deleteDistributionList: list deleted", listId);
    (0, import_storage.storageServiceUploadJob)();
    dispatch({
      type: DELETE_LIST,
      payload: {
        listId,
        deletedAtTimestamp
      }
    });
  };
}
function modifyDistributionList(distributionList) {
  return {
    type: MODIFY_LIST,
    payload: distributionList
  };
}
function hideMyStoriesFrom(memberUuids) {
  return async (dispatch) => {
    const myStories = await import_Client.default.getStoryDistributionWithMembers(import_Stories.MY_STORIES_ID);
    if (!myStories) {
      log.error("storyDistributionLists.hideMyStoriesFrom: Could not find My Stories!");
      return;
    }
    const toAdd = new Set(memberUuids);
    await import_Client.default.modifyStoryDistributionWithMembers({
      ...myStories,
      isBlockList: true,
      storageNeedsSync: true
    }, {
      toAdd: Array.from(toAdd),
      toRemove: myStories.members.filter((uuid) => !toAdd.has(uuid))
    });
    (0, import_storage.storageServiceUploadJob)();
    dispatch({
      type: HIDE_MY_STORIES_FROM,
      payload: memberUuids
    });
  };
}
function removeMemberFromDistributionList(listId, memberUuid) {
  return async (dispatch) => {
    if (!memberUuid) {
      log.warn("storyDistributionLists.removeMemberFromDistributionList cannot remove a member without uuid", listId);
      return;
    }
    const storyDistribution = await import_Client.default.getStoryDistributionWithMembers(listId);
    if (!storyDistribution) {
      log.warn("storyDistributionLists.removeMemberFromDistributionList: No story found for id", listId);
      return;
    }
    await import_Client.default.modifyStoryDistributionWithMembers({
      ...storyDistribution,
      storageNeedsSync: true
    }, {
      toAdd: [],
      toRemove: [memberUuid]
    });
    log.info("storyDistributionLists.removeMemberFromDistributionList: removed", {
      listId,
      memberUuid
    });
    (0, import_storage.storageServiceUploadJob)();
    dispatch({
      type: REMOVE_MEMBER,
      payload: {
        listId,
        memberUuid
      }
    });
  };
}
function setMyStoriesToAllSignalConnections() {
  return async (dispatch) => {
    const myStories = await import_Client.default.getStoryDistributionWithMembers(import_Stories.MY_STORIES_ID);
    if (!myStories) {
      log.error("storyDistributionLists.setMyStoriesToAllSignalConnections: Could not find My Stories!");
      return;
    }
    if (myStories.isBlockList || myStories.members.length > 0) {
      await import_Client.default.modifyStoryDistributionWithMembers({
        ...myStories,
        isBlockList: true,
        storageNeedsSync: true
      }, {
        toAdd: [],
        toRemove: myStories.members
      });
      (0, import_storage.storageServiceUploadJob)();
    }
    dispatch({
      type: RESET_MY_STORIES
    });
  };
}
function updateStoryViewers(listId, memberUuids) {
  return async (dispatch) => {
    const storyDistribution = await import_Client.default.getStoryDistributionWithMembers(listId);
    if (!storyDistribution) {
      log.warn("storyDistributionLists.updateStoryViewers: No story found for id", listId);
      return;
    }
    const existingUuids = new Set(storyDistribution.members);
    const toAdd = [];
    memberUuids.forEach((uuid) => {
      if (!existingUuids.has(uuid)) {
        toAdd.push(uuid);
      }
    });
    const updatedUuids = new Set(memberUuids);
    const toRemove = [];
    storyDistribution.members.forEach((uuid) => {
      if (!updatedUuids.has(uuid)) {
        toRemove.push(uuid);
      }
    });
    await import_Client.default.modifyStoryDistributionWithMembers({
      ...storyDistribution,
      isBlockList: false,
      storageNeedsSync: true
    }, {
      toAdd,
      toRemove
    });
    (0, import_storage.storageServiceUploadJob)();
    dispatch({
      type: VIEWERS_CHANGED,
      payload: {
        listId,
        memberUuids
      }
    });
  };
}
const actions = {
  allowsRepliesChanged,
  createDistributionList,
  deleteDistributionList,
  hideMyStoriesFrom,
  modifyDistributionList,
  removeMemberFromDistributionList,
  setMyStoriesToAllSignalConnections,
  updateStoryViewers
};
const useStoryDistributionListsActions = /* @__PURE__ */ __name(() => (0, import_useBoundActions.useBoundActions)(actions), "useStoryDistributionListsActions");
function getEmptyState() {
  return {
    distributionLists: []
  };
}
function replaceDistributionListData(distributionLists, listId, getNextDistributionListData) {
  const listIndex = distributionLists.findIndex((list) => list.id === listId);
  if (listIndex < 0) {
    return;
  }
  return (0, import_replaceIndex.replaceIndex)(distributionLists, listIndex, {
    ...distributionLists[listIndex],
    ...getNextDistributionListData(distributionLists[listIndex])
  });
}
function reducer(state = getEmptyState(), action) {
  if (action.type === MODIFY_LIST) {
    const { payload } = action;
    const { membersToAdd, membersToRemove, ...distributionListDetails } = payload;
    const listIndex = state.distributionLists.findIndex((list) => list.id === distributionListDetails.id);
    if (listIndex >= 0) {
      const existingDistributionList = state.distributionLists[listIndex];
      const memberUuids = new Set(existingDistributionList.memberUuids);
      membersToAdd.forEach((uuid) => memberUuids.add(uuid));
      membersToRemove.forEach((uuid) => memberUuids.delete(uuid));
      return {
        distributionLists: (0, import_replaceIndex.replaceIndex)(state.distributionLists, listIndex, {
          ...existingDistributionList,
          ...distributionListDetails,
          memberUuids: Array.from(memberUuids)
        })
      };
    }
    return {
      distributionLists: [
        ...state.distributionLists,
        {
          ...distributionListDetails,
          memberUuids: membersToAdd
        }
      ]
    };
  }
  if (action.type === CREATE_LIST) {
    return {
      distributionLists: [...state.distributionLists, action.payload]
    };
  }
  if (action.type === DELETE_LIST) {
    const distributionLists = replaceDistributionListData(state.distributionLists, action.payload.listId, () => ({
      deletedAtTimestamp: action.payload.deletedAtTimestamp,
      memberUuids: [],
      name: ""
    }));
    return distributionLists ? { distributionLists } : state;
  }
  if (action.type === HIDE_MY_STORIES_FROM) {
    const distributionLists = replaceDistributionListData(state.distributionLists, import_Stories.MY_STORIES_ID, () => ({
      isBlockList: true,
      memberUuids: action.payload
    }));
    return distributionLists ? { distributionLists } : state;
  }
  if (action.type === REMOVE_MEMBER) {
    const distributionLists = replaceDistributionListData(state.distributionLists, action.payload.listId, (list) => ({
      memberUuids: list.memberUuids.filter((uuid) => uuid !== action.payload.memberUuid)
    }));
    return distributionLists ? { distributionLists } : state;
  }
  if (action.type === ALLOW_REPLIES_CHANGED) {
    const distributionLists = replaceDistributionListData(state.distributionLists, action.payload.listId, () => ({
      allowsReplies: action.payload.allowsReplies
    }));
    return distributionLists ? { distributionLists } : state;
  }
  if (action.type === VIEWERS_CHANGED) {
    const distributionLists = replaceDistributionListData(state.distributionLists, action.payload.listId, () => ({
      isBlockList: false,
      memberUuids: Array.from(new Set(action.payload.memberUuids))
    }));
    return distributionLists ? { distributionLists } : state;
  }
  if (action.type === RESET_MY_STORIES) {
    const distributionLists = replaceDistributionListData(state.distributionLists, import_Stories.MY_STORIES_ID, () => ({
      isBlockList: false,
      memberUuids: []
    }));
    return distributionLists ? { distributionLists } : state;
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actions,
  getEmptyState,
  reducer,
  useStoryDistributionListsActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcnlEaXN0cmlidXRpb25MaXN0cy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFRodW5rQWN0aW9uIH0gZnJvbSAncmVkdXgtdGh1bmsnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSBhcyBSb290U3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgdHlwZSB7IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlIH0gZnJvbSAnLi4vLi4vc3FsL0ludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgeyBNWV9TVE9SSUVTX0lEIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyByZXBsYWNlSW5kZXggfSBmcm9tICcuLi8uLi91dGlsL3JlcGxhY2VJbmRleCc7XG5pbXBvcnQgeyBzdG9yYWdlU2VydmljZVVwbG9hZEpvYiB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3N0b3JhZ2UnO1xuaW1wb3J0IHsgdXNlQm91bmRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlQm91bmRBY3Rpb25zJztcblxuLy8gU3RhdGVcblxuZXhwb3J0IHR5cGUgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUgPSB7XG4gIGlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgZGVsZXRlZEF0VGltZXN0YW1wPzogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG4gIGFsbG93c1JlcGxpZXM6IGJvb2xlYW47XG4gIGlzQmxvY2tMaXN0OiBib29sZWFuO1xuICBtZW1iZXJVdWlkczogQXJyYXk8c3RyaW5nPjtcbn07XG5cbmV4cG9ydCB0eXBlIFN0b3J5RGlzdHJpYnV0aW9uTGlzdFN0YXRlVHlwZSA9IHtcbiAgZGlzdHJpYnV0aW9uTGlzdHM6IEFycmF5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlPjtcbn07XG5cbi8vIEFjdGlvbnNcblxuY29uc3QgQUxMT1dfUkVQTElFU19DSEFOR0VEID0gJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMvQUxMT1dfUkVQTElFU19DSEFOR0VEJztcbmNvbnN0IENSRUFURV9MSVNUID0gJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMvQ1JFQVRFX0xJU1QnO1xuY29uc3QgREVMRVRFX0xJU1QgPSAnc3RvcnlEaXN0cmlidXRpb25MaXN0cy9ERUxFVEVfTElTVCc7XG5jb25zdCBISURFX01ZX1NUT1JJRVNfRlJPTSA9ICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzL0hJREVfTVlfU1RPUklFU19GUk9NJztcbmNvbnN0IE1PRElGWV9MSVNUID0gJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMvTU9ESUZZX0xJU1QnO1xuY29uc3QgUkVNT1ZFX01FTUJFUiA9ICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzL1JFTU9WRV9NRU1CRVInO1xuY29uc3QgUkVTRVRfTVlfU1RPUklFUyA9ICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzL1JFU0VUX01ZX1NUT1JJRVMnO1xuY29uc3QgVklFV0VSU19DSEFOR0VEID0gJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMvVklFV0VSU19DSEFOR0VEJztcblxudHlwZSBBbGxvd1JlcGxpZXNDaGFuZ2VkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIEFMTE9XX1JFUExJRVNfQ0hBTkdFRDtcbiAgcGF5bG9hZDoge1xuICAgIGxpc3RJZDogc3RyaW5nO1xuICAgIGFsbG93c1JlcGxpZXM6IGJvb2xlYW47XG4gIH07XG59O1xuXG50eXBlIENyZWF0ZUxpc3RBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgQ1JFQVRFX0xJU1Q7XG4gIHBheWxvYWQ6IFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlO1xufTtcblxudHlwZSBEZWxldGVMaXN0QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIERFTEVURV9MSVNUO1xuICBwYXlsb2FkOiB7XG4gICAgbGlzdElkOiBzdHJpbmc7XG4gICAgZGVsZXRlZEF0VGltZXN0YW1wOiBudW1iZXI7XG4gIH07XG59O1xuXG50eXBlIEhpZGVNeVN0b3JpZXNGcm9tQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogdHlwZW9mIEhJREVfTVlfU1RPUklFU19GUk9NO1xuICBwYXlsb2FkOiBBcnJheTxzdHJpbmc+O1xufTtcblxudHlwZSBNb2RpZnlEaXN0cmlidXRpb25MaXN0VHlwZSA9IE9taXQ8XG4gIFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlLFxuICAnbWVtYmVyVXVpZHMnXG4+ICYge1xuICBtZW1iZXJzVG9BZGQ6IEFycmF5PHN0cmluZz47XG4gIG1lbWJlcnNUb1JlbW92ZTogQXJyYXk8c3RyaW5nPjtcbn07XG5cbmV4cG9ydCB0eXBlIE1vZGlmeUxpc3RBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgTU9ESUZZX0xJU1Q7XG4gIHBheWxvYWQ6IE1vZGlmeURpc3RyaWJ1dGlvbkxpc3RUeXBlO1xufTtcblxudHlwZSBSZW1vdmVNZW1iZXJBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgUkVNT1ZFX01FTUJFUjtcbiAgcGF5bG9hZDoge1xuICAgIGxpc3RJZDogc3RyaW5nO1xuICAgIG1lbWJlclV1aWQ6IHN0cmluZztcbiAgfTtcbn07XG5cbnR5cGUgUmVzZXRNeVN0b3JpZXNBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgUkVTRVRfTVlfU1RPUklFUztcbn07XG5cbnR5cGUgVmlld2Vyc0NoYW5nZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiB0eXBlb2YgVklFV0VSU19DSEFOR0VEO1xuICBwYXlsb2FkOiB7XG4gICAgbGlzdElkOiBzdHJpbmc7XG4gICAgbWVtYmVyVXVpZHM6IEFycmF5PHN0cmluZz47XG4gIH07XG59O1xuXG50eXBlIFN0b3J5RGlzdHJpYnV0aW9uTGlzdHNBY3Rpb25UeXBlID1cbiAgfCBBbGxvd1JlcGxpZXNDaGFuZ2VkQWN0aW9uVHlwZVxuICB8IENyZWF0ZUxpc3RBY3Rpb25UeXBlXG4gIHwgRGVsZXRlTGlzdEFjdGlvblR5cGVcbiAgfCBIaWRlTXlTdG9yaWVzRnJvbUFjdGlvblR5cGVcbiAgfCBNb2RpZnlMaXN0QWN0aW9uVHlwZVxuICB8IFJlbW92ZU1lbWJlckFjdGlvblR5cGVcbiAgfCBSZXNldE15U3Rvcmllc0FjdGlvblR5cGVcbiAgfCBWaWV3ZXJzQ2hhbmdlZEFjdGlvblR5cGU7XG5cbi8vIEFjdGlvbiBDcmVhdG9yc1xuXG5mdW5jdGlvbiBhbGxvd3NSZXBsaWVzQ2hhbmdlZChcbiAgbGlzdElkOiBzdHJpbmcsXG4gIGFsbG93c1JlcGxpZXM6IGJvb2xlYW5cbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIG51bGwsIEFsbG93UmVwbGllc0NoYW5nZWRBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3Qgc3RvcnlEaXN0cmlidXRpb24gPVxuICAgICAgYXdhaXQgZGF0YUludGVyZmFjZS5nZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKGxpc3RJZCk7XG5cbiAgICBpZiAoIXN0b3J5RGlzdHJpYnV0aW9uKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMuYWxsb3dzUmVwbGllc0NoYW5nZWQ6IE5vIHN0b3J5IGZvdW5kIGZvciBpZCcsXG4gICAgICAgIGxpc3RJZFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoc3RvcnlEaXN0cmlidXRpb24uYWxsb3dzUmVwbGllcyA9PT0gYWxsb3dzUmVwbGllcykge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLmFsbG93c1JlcGxpZXNDaGFuZ2VkOiBzdG9yeSBhbHJlYWR5IGhhcyB0aGUgc2FtZSB2YWx1ZScsXG4gICAgICAgIHsgbGlzdElkLCBhbGxvd3NSZXBsaWVzIH1cbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgZGF0YUludGVyZmFjZS5tb2RpZnlTdG9yeURpc3RyaWJ1dGlvbih7XG4gICAgICAuLi5zdG9yeURpc3RyaWJ1dGlvbixcbiAgICAgIGFsbG93c1JlcGxpZXMsXG4gICAgICBzdG9yYWdlTmVlZHNTeW5jOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IoKTtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMuYWxsb3dzUmVwbGllc0NoYW5nZWQ6IGFsbG93c1JlcGxpZXMgaGFzIGNoYW5nZWQnLFxuICAgICAgbGlzdElkXG4gICAgKTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEFMTE9XX1JFUExJRVNfQ0hBTkdFRCxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgbGlzdElkLFxuICAgICAgICBhbGxvd3NSZXBsaWVzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGlzdHJpYnV0aW9uTGlzdChcbiAgbmFtZTogc3RyaW5nLFxuICBtZW1iZXJVdWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+LFxuICBzdG9yYWdlU2VydmljZURpc3RyaWJ1dGlvbkxpc3RSZWNvcmQ/OiBTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZSxcbiAgc2hvdWxkU2F2ZSA9IHRydWVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIG51bGwsIENyZWF0ZUxpc3RBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3Qgc3RvcnlEaXN0cmlidXRpb246IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlID0ge1xuICAgICAgYWxsb3dzUmVwbGllczogdHJ1ZSxcbiAgICAgIGlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIGlzQmxvY2tMaXN0OiBmYWxzZSxcbiAgICAgIG1lbWJlcnM6IG1lbWJlclV1aWRzLFxuICAgICAgbmFtZSxcbiAgICAgIHNlbmRlcktleUluZm86IHVuZGVmaW5lZCxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IHRydWUsXG4gICAgICAuLi4oc3RvcmFnZVNlcnZpY2VEaXN0cmlidXRpb25MaXN0UmVjb3JkIHx8IHt9KSxcbiAgICB9O1xuXG4gICAgaWYgKHNob3VsZFNhdmUpIHtcbiAgICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UuY3JlYXRlTmV3U3RvcnlEaXN0cmlidXRpb24oc3RvcnlEaXN0cmlidXRpb24pO1xuICAgIH1cblxuICAgIGlmIChzdG9yeURpc3RyaWJ1dGlvbi5zdG9yYWdlTmVlZHNTeW5jKSB7XG4gICAgICBzdG9yYWdlU2VydmljZVVwbG9hZEpvYigpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IENSRUFURV9MSVNULFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBhbGxvd3NSZXBsaWVzOiBCb29sZWFuKHN0b3J5RGlzdHJpYnV0aW9uLmFsbG93c1JlcGxpZXMpLFxuICAgICAgICBkZWxldGVkQXRUaW1lc3RhbXA6IHN0b3J5RGlzdHJpYnV0aW9uLmRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgICAgaWQ6IHN0b3J5RGlzdHJpYnV0aW9uLmlkLFxuICAgICAgICBpc0Jsb2NrTGlzdDogQm9vbGVhbihzdG9yeURpc3RyaWJ1dGlvbi5pc0Jsb2NrTGlzdCksXG4gICAgICAgIG1lbWJlclV1aWRzLFxuICAgICAgICBuYW1lOiBzdG9yeURpc3RyaWJ1dGlvbi5uYW1lLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlRGlzdHJpYnV0aW9uTGlzdChcbiAgbGlzdElkOiBzdHJpbmdcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIERlbGV0ZUxpc3RBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3QgZGVsZXRlZEF0VGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgIGNvbnN0IHN0b3J5RGlzdHJpYnV0aW9uID1cbiAgICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UuZ2V0U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhsaXN0SWQpO1xuXG4gICAgaWYgKCFzdG9yeURpc3RyaWJ1dGlvbikge1xuICAgICAgbG9nLndhcm4oJ05vIHN0b3J5IGRpc3RyaWJ1dGlvbiBmb3VuZCBmb3IgaWQnLCBsaXN0SWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UubW9kaWZ5U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhcbiAgICAgIHtcbiAgICAgICAgLi4uc3RvcnlEaXN0cmlidXRpb24sXG4gICAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b0FkZDogW10sXG4gICAgICAgIHRvUmVtb3ZlOiBzdG9yeURpc3RyaWJ1dGlvbi5tZW1iZXJzLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLmRlbGV0ZURpc3RyaWJ1dGlvbkxpc3Q6IGxpc3QgZGVsZXRlZCcsXG4gICAgICBsaXN0SWRcbiAgICApO1xuXG4gICAgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IoKTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IERFTEVURV9MSVNULFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBsaXN0SWQsXG4gICAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1vZGlmeURpc3RyaWJ1dGlvbkxpc3QoXG4gIGRpc3RyaWJ1dGlvbkxpc3Q6IE1vZGlmeURpc3RyaWJ1dGlvbkxpc3RUeXBlXG4pOiBNb2RpZnlMaXN0QWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogTU9ESUZZX0xJU1QsXG4gICAgcGF5bG9hZDogZGlzdHJpYnV0aW9uTGlzdCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGlkZU15U3Rvcmllc0Zyb20oXG4gIG1lbWJlclV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT5cbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIG51bGwsIEhpZGVNeVN0b3JpZXNGcm9tQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgZGlzcGF0Y2ggPT4ge1xuICAgIGNvbnN0IG15U3RvcmllcyA9IGF3YWl0IGRhdGFJbnRlcmZhY2UuZ2V0U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhcbiAgICAgIE1ZX1NUT1JJRVNfSURcbiAgICApO1xuXG4gICAgaWYgKCFteVN0b3JpZXMpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMuaGlkZU15U3Rvcmllc0Zyb206IENvdWxkIG5vdCBmaW5kIE15IFN0b3JpZXMhJ1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b0FkZCA9IG5ldyBTZXQ8VVVJRFN0cmluZ1R5cGU+KG1lbWJlclV1aWRzKTtcblxuICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UubW9kaWZ5U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhcbiAgICAgIHtcbiAgICAgICAgLi4ubXlTdG9yaWVzLFxuICAgICAgICBpc0Jsb2NrTGlzdDogdHJ1ZSxcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luYzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRvQWRkOiBBcnJheS5mcm9tKHRvQWRkKSxcbiAgICAgICAgdG9SZW1vdmU6IG15U3Rvcmllcy5tZW1iZXJzLmZpbHRlcih1dWlkID0+ICF0b0FkZC5oYXModXVpZCkpLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBzdG9yYWdlU2VydmljZVVwbG9hZEpvYigpO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogSElERV9NWV9TVE9SSUVTX0ZST00sXG4gICAgICBwYXlsb2FkOiBtZW1iZXJVdWlkcyxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTWVtYmVyRnJvbURpc3RyaWJ1dGlvbkxpc3QoXG4gIGxpc3RJZDogc3RyaW5nLFxuICBtZW1iZXJVdWlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZFxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgbnVsbCwgUmVtb3ZlTWVtYmVyQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgZGlzcGF0Y2ggPT4ge1xuICAgIGlmICghbWVtYmVyVXVpZCkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLnJlbW92ZU1lbWJlckZyb21EaXN0cmlidXRpb25MaXN0IGNhbm5vdCByZW1vdmUgYSBtZW1iZXIgd2l0aG91dCB1dWlkJyxcbiAgICAgICAgbGlzdElkXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0b3J5RGlzdHJpYnV0aW9uID1cbiAgICAgIGF3YWl0IGRhdGFJbnRlcmZhY2UuZ2V0U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVycyhsaXN0SWQpO1xuXG4gICAgaWYgKCFzdG9yeURpc3RyaWJ1dGlvbikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLnJlbW92ZU1lbWJlckZyb21EaXN0cmlidXRpb25MaXN0OiBObyBzdG9yeSBmb3VuZCBmb3IgaWQnLFxuICAgICAgICBsaXN0SWRcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgZGF0YUludGVyZmFjZS5tb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKFxuICAgICAge1xuICAgICAgICAuLi5zdG9yeURpc3RyaWJ1dGlvbixcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luYzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRvQWRkOiBbXSxcbiAgICAgICAgdG9SZW1vdmU6IFttZW1iZXJVdWlkXSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICAnc3RvcnlEaXN0cmlidXRpb25MaXN0cy5yZW1vdmVNZW1iZXJGcm9tRGlzdHJpYnV0aW9uTGlzdDogcmVtb3ZlZCcsXG4gICAgICB7XG4gICAgICAgIGxpc3RJZCxcbiAgICAgICAgbWVtYmVyVXVpZCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IoKTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFJFTU9WRV9NRU1CRVIsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGxpc3RJZCxcbiAgICAgICAgbWVtYmVyVXVpZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldE15U3Rvcmllc1RvQWxsU2lnbmFsQ29ubmVjdGlvbnMoKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIG51bGwsXG4gIFJlc2V0TXlTdG9yaWVzQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3QgbXlTdG9yaWVzID0gYXdhaXQgZGF0YUludGVyZmFjZS5nZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKFxuICAgICAgTVlfU1RPUklFU19JRFxuICAgICk7XG5cbiAgICBpZiAoIW15U3Rvcmllcykge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnc3RvcnlEaXN0cmlidXRpb25MaXN0cy5zZXRNeVN0b3JpZXNUb0FsbFNpZ25hbENvbm5lY3Rpb25zOiBDb3VsZCBub3QgZmluZCBNeSBTdG9yaWVzISdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG15U3Rvcmllcy5pc0Jsb2NrTGlzdCB8fCBteVN0b3JpZXMubWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBkYXRhSW50ZXJmYWNlLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoXG4gICAgICAgIHtcbiAgICAgICAgICAuLi5teVN0b3JpZXMsXG4gICAgICAgICAgaXNCbG9ja0xpc3Q6IHRydWUsXG4gICAgICAgICAgc3RvcmFnZU5lZWRzU3luYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRvQWRkOiBbXSxcbiAgICAgICAgICB0b1JlbW92ZTogbXlTdG9yaWVzLm1lbWJlcnMsXG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHN0b3JhZ2VTZXJ2aWNlVXBsb2FkSm9iKCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogUkVTRVRfTVlfU1RPUklFUyxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlU3RvcnlWaWV3ZXJzKFxuICBsaXN0SWQ6IHN0cmluZyxcbiAgbWVtYmVyVXVpZHM6IEFycmF5PFVVSURTdHJpbmdUeXBlPlxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgbnVsbCwgVmlld2Vyc0NoYW5nZWRBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgY29uc3Qgc3RvcnlEaXN0cmlidXRpb24gPVxuICAgICAgYXdhaXQgZGF0YUludGVyZmFjZS5nZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKGxpc3RJZCk7XG5cbiAgICBpZiAoIXN0b3J5RGlzdHJpYnV0aW9uKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgJ3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMudXBkYXRlU3RvcnlWaWV3ZXJzOiBObyBzdG9yeSBmb3VuZCBmb3IgaWQnLFxuICAgICAgICBsaXN0SWRcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RpbmdVdWlkcyA9IG5ldyBTZXQ8VVVJRFN0cmluZ1R5cGU+KHN0b3J5RGlzdHJpYnV0aW9uLm1lbWJlcnMpO1xuICAgIGNvbnN0IHRvQWRkOiBBcnJheTxVVUlEU3RyaW5nVHlwZT4gPSBbXTtcblxuICAgIG1lbWJlclV1aWRzLmZvckVhY2godXVpZCA9PiB7XG4gICAgICBpZiAoIWV4aXN0aW5nVXVpZHMuaGFzKHV1aWQpKSB7XG4gICAgICAgIHRvQWRkLnB1c2godXVpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGVkVXVpZHMgPSBuZXcgU2V0PFVVSURTdHJpbmdUeXBlPihtZW1iZXJVdWlkcyk7XG4gICAgY29uc3QgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPiA9IFtdO1xuXG4gICAgc3RvcnlEaXN0cmlidXRpb24ubWVtYmVycy5mb3JFYWNoKHV1aWQgPT4ge1xuICAgICAgaWYgKCF1cGRhdGVkVXVpZHMuaGFzKHV1aWQpKSB7XG4gICAgICAgIHRvUmVtb3ZlLnB1c2godXVpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhd2FpdCBkYXRhSW50ZXJmYWNlLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoXG4gICAgICB7XG4gICAgICAgIC4uLnN0b3J5RGlzdHJpYnV0aW9uLFxuICAgICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b0FkZCxcbiAgICAgICAgdG9SZW1vdmUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIHN0b3JhZ2VTZXJ2aWNlVXBsb2FkSm9iKCk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBWSUVXRVJTX0NIQU5HRUQsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGxpc3RJZCxcbiAgICAgICAgbWVtYmVyVXVpZHMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgYWN0aW9ucyA9IHtcbiAgYWxsb3dzUmVwbGllc0NoYW5nZWQsXG4gIGNyZWF0ZURpc3RyaWJ1dGlvbkxpc3QsXG4gIGRlbGV0ZURpc3RyaWJ1dGlvbkxpc3QsXG4gIGhpZGVNeVN0b3JpZXNGcm9tLFxuICBtb2RpZnlEaXN0cmlidXRpb25MaXN0LFxuICByZW1vdmVNZW1iZXJGcm9tRGlzdHJpYnV0aW9uTGlzdCxcbiAgc2V0TXlTdG9yaWVzVG9BbGxTaWduYWxDb25uZWN0aW9ucyxcbiAgdXBkYXRlU3RvcnlWaWV3ZXJzLFxufTtcblxuZXhwb3J0IGNvbnN0IHVzZVN0b3J5RGlzdHJpYnV0aW9uTGlzdHNBY3Rpb25zID0gKCk6IHR5cGVvZiBhY3Rpb25zID0+XG4gIHVzZUJvdW5kQWN0aW9ucyhhY3Rpb25zKTtcblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBTdG9yeURpc3RyaWJ1dGlvbkxpc3RTdGF0ZVR5cGUge1xuICByZXR1cm4ge1xuICAgIGRpc3RyaWJ1dGlvbkxpc3RzOiBbXSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZURpc3RyaWJ1dGlvbkxpc3REYXRhKFxuICBkaXN0cmlidXRpb25MaXN0czogQXJyYXk8U3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGU+LFxuICBsaXN0SWQ6IHN0cmluZyxcbiAgZ2V0TmV4dERpc3RyaWJ1dGlvbkxpc3REYXRhOiAoXG4gICAgbGlzdDogU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGVcbiAgKSA9PiBQYXJ0aWFsPFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlPlxuKTogQXJyYXk8U3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGU+IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgbGlzdEluZGV4ID0gZGlzdHJpYnV0aW9uTGlzdHMuZmluZEluZGV4KGxpc3QgPT4gbGlzdC5pZCA9PT0gbGlzdElkKTtcblxuICBpZiAobGlzdEluZGV4IDwgMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiByZXBsYWNlSW5kZXgoZGlzdHJpYnV0aW9uTGlzdHMsIGxpc3RJbmRleCwge1xuICAgIC4uLmRpc3RyaWJ1dGlvbkxpc3RzW2xpc3RJbmRleF0sXG4gICAgLi4uZ2V0TmV4dERpc3RyaWJ1dGlvbkxpc3REYXRhKGRpc3RyaWJ1dGlvbkxpc3RzW2xpc3RJbmRleF0pLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoXG4gIHN0YXRlOiBSZWFkb25seTxTdG9yeURpc3RyaWJ1dGlvbkxpc3RTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdHNBY3Rpb25UeXBlPlxuKTogU3RvcnlEaXN0cmlidXRpb25MaXN0U3RhdGVUeXBlIHtcbiAgaWYgKGFjdGlvbi50eXBlID09PSBNT0RJRllfTElTVCkge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuXG4gICAgY29uc3QgeyBtZW1iZXJzVG9BZGQsIG1lbWJlcnNUb1JlbW92ZSwgLi4uZGlzdHJpYnV0aW9uTGlzdERldGFpbHMgfSA9XG4gICAgICBwYXlsb2FkO1xuXG4gICAgY29uc3QgbGlzdEluZGV4ID0gc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMuZmluZEluZGV4KFxuICAgICAgbGlzdCA9PiBsaXN0LmlkID09PSBkaXN0cmlidXRpb25MaXN0RGV0YWlscy5pZFxuICAgICk7XG4gICAgaWYgKGxpc3RJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0Rpc3RyaWJ1dGlvbkxpc3QgPSBzdGF0ZS5kaXN0cmlidXRpb25MaXN0c1tsaXN0SW5kZXhdO1xuICAgICAgY29uc3QgbWVtYmVyVXVpZHMgPSBuZXcgU2V0PHN0cmluZz4oZXhpc3RpbmdEaXN0cmlidXRpb25MaXN0Lm1lbWJlclV1aWRzKTtcbiAgICAgIG1lbWJlcnNUb0FkZC5mb3JFYWNoKHV1aWQgPT4gbWVtYmVyVXVpZHMuYWRkKHV1aWQpKTtcbiAgICAgIG1lbWJlcnNUb1JlbW92ZS5mb3JFYWNoKHV1aWQgPT4gbWVtYmVyVXVpZHMuZGVsZXRlKHV1aWQpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGlzdHJpYnV0aW9uTGlzdHM6IHJlcGxhY2VJbmRleChzdGF0ZS5kaXN0cmlidXRpb25MaXN0cywgbGlzdEluZGV4LCB7XG4gICAgICAgICAgLi4uZXhpc3RpbmdEaXN0cmlidXRpb25MaXN0LFxuICAgICAgICAgIC4uLmRpc3RyaWJ1dGlvbkxpc3REZXRhaWxzLFxuICAgICAgICAgIG1lbWJlclV1aWRzOiBBcnJheS5mcm9tKG1lbWJlclV1aWRzKSxcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkaXN0cmlidXRpb25MaXN0czogW1xuICAgICAgICAuLi5zdGF0ZS5kaXN0cmlidXRpb25MaXN0cyxcbiAgICAgICAge1xuICAgICAgICAgIC4uLmRpc3RyaWJ1dGlvbkxpc3REZXRhaWxzLFxuICAgICAgICAgIG1lbWJlclV1aWRzOiBtZW1iZXJzVG9BZGQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IENSRUFURV9MSVNUKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3RyaWJ1dGlvbkxpc3RzOiBbLi4uc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMsIGFjdGlvbi5wYXlsb2FkXSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBERUxFVEVfTElTVCkge1xuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gcmVwbGFjZURpc3RyaWJ1dGlvbkxpc3REYXRhKFxuICAgICAgc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5saXN0SWQsXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBkZWxldGVkQXRUaW1lc3RhbXA6IGFjdGlvbi5wYXlsb2FkLmRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgICAgbWVtYmVyVXVpZHM6IFtdLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBkaXN0cmlidXRpb25MaXN0cyA/IHsgZGlzdHJpYnV0aW9uTGlzdHMgfSA6IHN0YXRlO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBISURFX01ZX1NUT1JJRVNfRlJPTSkge1xuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gcmVwbGFjZURpc3RyaWJ1dGlvbkxpc3REYXRhKFxuICAgICAgc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICBNWV9TVE9SSUVTX0lELFxuICAgICAgKCkgPT4gKHtcbiAgICAgICAgaXNCbG9ja0xpc3Q6IHRydWUsXG4gICAgICAgIG1lbWJlclV1aWRzOiBhY3Rpb24ucGF5bG9hZCxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBkaXN0cmlidXRpb25MaXN0cyA/IHsgZGlzdHJpYnV0aW9uTGlzdHMgfSA6IHN0YXRlO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBSRU1PVkVfTUVNQkVSKSB7XG4gICAgY29uc3QgZGlzdHJpYnV0aW9uTGlzdHMgPSByZXBsYWNlRGlzdHJpYnV0aW9uTGlzdERhdGEoXG4gICAgICBzdGF0ZS5kaXN0cmlidXRpb25MaXN0cyxcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmxpc3RJZCxcbiAgICAgIGxpc3QgPT4gKHtcbiAgICAgICAgbWVtYmVyVXVpZHM6IGxpc3QubWVtYmVyVXVpZHMuZmlsdGVyKFxuICAgICAgICAgIHV1aWQgPT4gdXVpZCAhPT0gYWN0aW9uLnBheWxvYWQubWVtYmVyVXVpZFxuICAgICAgICApLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGRpc3RyaWJ1dGlvbkxpc3RzID8geyBkaXN0cmlidXRpb25MaXN0cyB9IDogc3RhdGU7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IEFMTE9XX1JFUExJRVNfQ0hBTkdFRCkge1xuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gcmVwbGFjZURpc3RyaWJ1dGlvbkxpc3REYXRhKFxuICAgICAgc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5saXN0SWQsXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBhbGxvd3NSZXBsaWVzOiBhY3Rpb24ucGF5bG9hZC5hbGxvd3NSZXBsaWVzLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGRpc3RyaWJ1dGlvbkxpc3RzID8geyBkaXN0cmlidXRpb25MaXN0cyB9IDogc3RhdGU7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFZJRVdFUlNfQ0hBTkdFRCkge1xuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gcmVwbGFjZURpc3RyaWJ1dGlvbkxpc3REYXRhKFxuICAgICAgc3RhdGUuZGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICBhY3Rpb24ucGF5bG9hZC5saXN0SWQsXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICAgIG1lbWJlclV1aWRzOiBBcnJheS5mcm9tKG5ldyBTZXQoYWN0aW9uLnBheWxvYWQubWVtYmVyVXVpZHMpKSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBkaXN0cmlidXRpb25MaXN0cyA/IHsgZGlzdHJpYnV0aW9uTGlzdHMgfSA6IHN0YXRlO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBSRVNFVF9NWV9TVE9SSUVTKSB7XG4gICAgY29uc3QgZGlzdHJpYnV0aW9uTGlzdHMgPSByZXBsYWNlRGlzdHJpYnV0aW9uTGlzdERhdGEoXG4gICAgICBzdGF0ZS5kaXN0cmlidXRpb25MaXN0cyxcbiAgICAgIE1ZX1NUT1JJRVNfSUQsXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgICAgIG1lbWJlclV1aWRzOiBbXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBkaXN0cmlidXRpb25MaXN0cyA/IHsgZGlzdHJpYnV0aW9uTGlzdHMgfSA6IHN0YXRlO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFBLFVBQXFCO0FBQ3JCLG9CQUEwQjtBQUMxQixxQkFBOEI7QUFDOUIsa0JBQXFCO0FBQ3JCLDBCQUE2QjtBQUM3QixxQkFBd0M7QUFDeEMsNkJBQWdDO0FBbUJoQyxNQUFNLHdCQUF3QjtBQUM5QixNQUFNLGNBQWM7QUFDcEIsTUFBTSxjQUFjO0FBQ3BCLE1BQU0sdUJBQXVCO0FBQzdCLE1BQU0sY0FBYztBQUNwQixNQUFNLGdCQUFnQjtBQUN0QixNQUFNLG1CQUFtQjtBQUN6QixNQUFNLGtCQUFrQjtBQXlFeEIsOEJBQ0UsUUFDQSxlQUN1RTtBQUN2RSxTQUFPLE9BQU0sYUFBWTtBQUN2QixVQUFNLG9CQUNKLE1BQU0sc0JBQWMsZ0NBQWdDLE1BQU07QUFFNUQsUUFBSSxDQUFDLG1CQUFtQjtBQUN0QixVQUFJLEtBQ0Ysc0VBQ0EsTUFDRjtBQUNBO0FBQUEsSUFDRjtBQUVBLFFBQUksa0JBQWtCLGtCQUFrQixlQUFlO0FBQ3JELFVBQUksS0FDRixpRkFDQSxFQUFFLFFBQVEsY0FBYyxDQUMxQjtBQUNBO0FBQUEsSUFDRjtBQUVBLFVBQU0s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
