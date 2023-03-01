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
var stickers_exports = {};
__export(stickers_exports, {
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer
});
module.exports = __toCommonJS(stickers_exports);
var import_lodash = require("lodash");
var import_Client = __toESM(require("../../sql/Client"));
var import_Stickers = require("../../types/Stickers");
var import_storage = require("../../services/storage");
var import_textsecure = require("../../shims/textsecure");
var import_events = require("../../shims/events");
const { getRecentStickers, updateStickerLastUsed } = import_Client.default;
const actions = {
  downloadStickerPack,
  clearInstalledStickerPack,
  removeStickerPack,
  stickerAdded,
  stickerPackAdded,
  installStickerPack,
  uninstallStickerPack,
  stickerPackUpdated,
  useSticker
};
function removeStickerPack(id) {
  return {
    type: "stickers/REMOVE_STICKER_PACK",
    payload: id
  };
}
function stickerAdded(payload) {
  return {
    type: "stickers/STICKER_ADDED",
    payload
  };
}
function stickerPackAdded(payload, options) {
  const { status, attemptedStatus } = payload;
  if (status === "error" && attemptedStatus === "installed" && !options?.suppressError) {
    (0, import_events.trigger)("pack-install-failed");
  }
  return {
    type: "stickers/STICKER_PACK_ADDED",
    payload
  };
}
function downloadStickerPack(packId, packKey, options) {
  const { finalStatus } = options || { finalStatus: void 0 };
  (0, import_Stickers.downloadStickerPack)(packId, packKey, { finalStatus });
  return {
    type: "NOOP",
    payload: null
  };
}
function installStickerPack(packId, packKey, options = {}) {
  return {
    type: "stickers/INSTALL_STICKER_PACK",
    payload: doInstallStickerPack(packId, packKey, options)
  };
}
async function doInstallStickerPack(packId, packKey, options = {}) {
  const { fromSync = false, fromStorageService = false } = options;
  const timestamp = Date.now();
  await import_Client.default.installStickerPack(packId, timestamp);
  if (!fromSync && !fromStorageService) {
    (0, import_textsecure.sendStickerPackSync)(packId, packKey, true);
  }
  if (!fromStorageService) {
    (0, import_storage.storageServiceUploadJob)();
  }
  const recentStickers = await getRecentStickers();
  return {
    packId,
    fromSync,
    status: "installed",
    installedAt: timestamp,
    recentStickers: recentStickers.map((item) => ({
      packId: item.packId,
      stickerId: item.id
    }))
  };
}
function uninstallStickerPack(packId, packKey, options = {}) {
  return {
    type: "stickers/UNINSTALL_STICKER_PACK",
    payload: doUninstallStickerPack(packId, packKey, options)
  };
}
async function doUninstallStickerPack(packId, packKey, options = {}) {
  const { fromSync = false, fromStorageService = false } = options;
  const timestamp = Date.now();
  await import_Client.default.uninstallStickerPack(packId, timestamp);
  await (0, import_Stickers.maybeDeletePack)(packId);
  if (!fromSync && !fromStorageService) {
    (0, import_textsecure.sendStickerPackSync)(packId, packKey, false);
  }
  if (!fromStorageService) {
    (0, import_storage.storageServiceUploadJob)();
  }
  const recentStickers = await getRecentStickers();
  return {
    packId,
    fromSync,
    status: "downloaded",
    installedAt: void 0,
    recentStickers: recentStickers.map((item) => ({
      packId: item.packId,
      stickerId: item.id
    }))
  };
}
function clearInstalledStickerPack() {
  return { type: "stickers/CLEAR_INSTALLED_STICKER_PACK" };
}
function stickerPackUpdated(packId, patch, options) {
  const { status, attemptedStatus } = patch;
  if (status === "error" && attemptedStatus === "installed" && !options?.suppressError) {
    (0, import_events.trigger)("pack-install-failed");
  }
  return {
    type: "stickers/STICKER_PACK_UPDATED",
    payload: {
      packId,
      patch
    }
  };
}
function useSticker(packId, stickerId, time) {
  return {
    type: "stickers/USE_STICKER",
    payload: doUseSticker(packId, stickerId, time)
  };
}
async function doUseSticker(packId, stickerId, time = Date.now()) {
  await updateStickerLastUsed(packId, stickerId, time);
  return {
    packId,
    stickerId,
    time
  };
}
function getEmptyState() {
  return {
    installedPack: null,
    packs: {},
    recentStickers: [],
    blessedPacks: {}
  };
}
function reducer(state = getEmptyState(), action) {
  if (action.type === "stickers/STICKER_PACK_ADDED") {
    const { payload } = action;
    const newPack = {
      stickers: {},
      ...payload
    };
    return {
      ...state,
      packs: {
        ...state.packs,
        [payload.id]: newPack
      }
    };
  }
  if (action.type === "stickers/STICKER_ADDED") {
    const { payload } = action;
    const packToUpdate = state.packs[payload.packId];
    return {
      ...state,
      packs: {
        ...state.packs,
        [packToUpdate.id]: {
          ...packToUpdate,
          stickers: {
            ...packToUpdate.stickers,
            [payload.id]: payload
          }
        }
      }
    };
  }
  if (action.type === "stickers/STICKER_PACK_UPDATED") {
    const { payload } = action;
    const packToUpdate = state.packs[payload.packId];
    return {
      ...state,
      packs: {
        ...state.packs,
        [packToUpdate.id]: {
          ...packToUpdate,
          ...payload.patch
        }
      }
    };
  }
  if (action.type === "stickers/INSTALL_STICKER_PACK_FULFILLED" || action.type === "stickers/UNINSTALL_STICKER_PACK_FULFILLED") {
    const { payload } = action;
    const { fromSync, installedAt, packId, status, recentStickers } = payload;
    const { packs } = state;
    const existingPack = packs[packId];
    if (!existingPack) {
      return {
        ...state,
        installedPack: state.installedPack === packId ? null : state.installedPack,
        recentStickers
      };
    }
    const isBlessed = state.blessedPacks[packId];
    const installedPack = !fromSync && !isBlessed ? packId : null;
    return {
      ...state,
      installedPack,
      packs: {
        ...packs,
        [packId]: {
          ...packs[packId],
          status,
          installedAt
        }
      },
      recentStickers
    };
  }
  if (action.type === "stickers/CLEAR_INSTALLED_STICKER_PACK") {
    return {
      ...state,
      installedPack: null
    };
  }
  if (action.type === "stickers/REMOVE_STICKER_PACK") {
    const { payload } = action;
    return {
      ...state,
      packs: (0, import_lodash.omit)(state.packs, payload)
    };
  }
  if (action.type === "stickers/USE_STICKER_FULFILLED") {
    const { payload } = action;
    const { packId, stickerId, time } = payload;
    const { recentStickers, packs } = state;
    const filteredRecents = (0, import_lodash.reject)(recentStickers, (item) => item.packId === packId && item.stickerId === stickerId);
    const pack = packs[packId];
    const sticker = pack.stickers[stickerId];
    return {
      ...state,
      recentStickers: [payload, ...filteredRecents],
      packs: {
        ...state.packs,
        [packId]: {
          ...pack,
          lastUsed: time,
          stickers: {
            ...pack.stickers,
            [stickerId]: {
              ...sticker,
              lastUsed: time
            }
          }
        }
      }
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actions,
  getEmptyState,
  reducer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RpY2tlcnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjAgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IERpY3Rpb25hcnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgb21pdCwgcmVqZWN0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB0eXBlIHtcbiAgU3RpY2tlclBhY2tTdGF0dXNUeXBlLFxuICBTdGlja2VyVHlwZSBhcyBTdGlja2VyREJUeXBlLFxuICBTdGlja2VyUGFja1R5cGUgYXMgU3RpY2tlclBhY2tEQlR5cGUsXG59IGZyb20gJy4uLy4uL3NxbC9JbnRlcmZhY2UnO1xuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgdHlwZSB7IFJlY2VudFN0aWNrZXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHtcbiAgZG93bmxvYWRTdGlja2VyUGFjayBhcyBleHRlcm5hbERvd25sb2FkU3RpY2tlclBhY2ssXG4gIG1heWJlRGVsZXRlUGFjayxcbn0gZnJvbSAnLi4vLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHsgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zdG9yYWdlJztcbmltcG9ydCB7IHNlbmRTdGlja2VyUGFja1N5bmMgfSBmcm9tICcuLi8uLi9zaGltcy90ZXh0c2VjdXJlJztcbmltcG9ydCB7IHRyaWdnZXIgfSBmcm9tICcuLi8uLi9zaGltcy9ldmVudHMnO1xuXG5pbXBvcnQgdHlwZSB7IE5vb3BBY3Rpb25UeXBlIH0gZnJvbSAnLi9ub29wJztcblxuY29uc3QgeyBnZXRSZWNlbnRTdGlja2VycywgdXBkYXRlU3RpY2tlckxhc3RVc2VkIH0gPSBkYXRhSW50ZXJmYWNlO1xuXG4vLyBTdGF0ZVxuXG5leHBvcnQgdHlwZSBTdGlja2Vyc1N0YXRlVHlwZSA9IHtcbiAgcmVhZG9ubHkgaW5zdGFsbGVkUGFjazogc3RyaW5nIHwgbnVsbDtcbiAgcmVhZG9ubHkgcGFja3M6IERpY3Rpb25hcnk8U3RpY2tlclBhY2tEQlR5cGU+O1xuICByZWFkb25seSByZWNlbnRTdGlja2VyczogQXJyYXk8UmVjZW50U3RpY2tlclR5cGU+O1xuICByZWFkb25seSBibGVzc2VkUGFja3M6IERpY3Rpb25hcnk8Ym9vbGVhbj47XG59O1xuXG4vLyBUaGVzZSBhcmUgZm9yIHRoZSBSZWFjdCBjb21wb25lbnRzXG5cbmV4cG9ydCB0eXBlIFN0aWNrZXJUeXBlID0ge1xuICByZWFkb25seSBpZDogbnVtYmVyO1xuICByZWFkb25seSBwYWNrSWQ6IHN0cmluZztcbiAgcmVhZG9ubHkgZW1vamk/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHVybDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU3RpY2tlclBhY2tUeXBlID0gUmVhZG9ubHk8e1xuICBpZDogc3RyaW5nO1xuICBrZXk6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgYXV0aG9yOiBzdHJpbmc7XG4gIGlzQmxlc3NlZDogYm9vbGVhbjtcbiAgY292ZXI/OiBTdGlja2VyVHlwZTtcbiAgbGFzdFVzZWQ/OiBudW1iZXI7XG4gIGF0dGVtcHRlZFN0YXR1cz86ICdkb3dubG9hZGVkJyB8ICdpbnN0YWxsZWQnIHwgJ2VwaGVtZXJhbCc7XG4gIHN0YXR1czogU3RpY2tlclBhY2tTdGF0dXNUeXBlO1xuICBzdGlja2VyczogQXJyYXk8U3RpY2tlclR5cGU+O1xuICBzdGlja2VyQ291bnQ6IG51bWJlcjtcbn0+O1xuXG4vLyBBY3Rpb25zXG5cbnR5cGUgU3RpY2tlclBhY2tBZGRlZEFjdGlvbiA9IHtcbiAgdHlwZTogJ3N0aWNrZXJzL1NUSUNLRVJfUEFDS19BRERFRCc7XG4gIHBheWxvYWQ6IFN0aWNrZXJQYWNrREJUeXBlO1xufTtcblxudHlwZSBTdGlja2VyQWRkZWRBY3Rpb24gPSB7XG4gIHR5cGU6ICdzdGlja2Vycy9TVElDS0VSX0FEREVEJztcbiAgcGF5bG9hZDogU3RpY2tlckRCVHlwZTtcbn07XG5cbnR5cGUgSW5zdGFsbFN0aWNrZXJQYWNrUGF5bG9hZFR5cGUgPSB7XG4gIHBhY2tJZDogc3RyaW5nO1xuICBmcm9tU3luYzogYm9vbGVhbjtcbiAgc3RhdHVzOiAnaW5zdGFsbGVkJztcbiAgaW5zdGFsbGVkQXQ6IG51bWJlcjtcbiAgcmVjZW50U3RpY2tlcnM6IEFycmF5PFJlY2VudFN0aWNrZXJUeXBlPjtcbn07XG50eXBlIEluc3RhbGxTdGlja2VyUGFja0FjdGlvbiA9IHtcbiAgdHlwZTogJ3N0aWNrZXJzL0lOU1RBTExfU1RJQ0tFUl9QQUNLJztcbiAgcGF5bG9hZDogUHJvbWlzZTxJbnN0YWxsU3RpY2tlclBhY2tQYXlsb2FkVHlwZT47XG59O1xudHlwZSBJbnN0YWxsU3RpY2tlclBhY2tGdWxmaWxsZWRBY3Rpb24gPSB7XG4gIHR5cGU6ICdzdGlja2Vycy9JTlNUQUxMX1NUSUNLRVJfUEFDS19GVUxGSUxMRUQnO1xuICBwYXlsb2FkOiBJbnN0YWxsU3RpY2tlclBhY2tQYXlsb2FkVHlwZTtcbn07XG50eXBlIENsZWFySW5zdGFsbGVkU3RpY2tlclBhY2tBY3Rpb24gPSB7XG4gIHR5cGU6ICdzdGlja2Vycy9DTEVBUl9JTlNUQUxMRURfU1RJQ0tFUl9QQUNLJztcbn07XG5cbnR5cGUgVW5pbnN0YWxsU3RpY2tlclBhY2tQYXlsb2FkVHlwZSA9IHtcbiAgcGFja0lkOiBzdHJpbmc7XG4gIGZyb21TeW5jOiBib29sZWFuO1xuICBzdGF0dXM6ICdkb3dubG9hZGVkJztcbiAgaW5zdGFsbGVkQXQ/OiB1bmRlZmluZWQ7XG4gIHJlY2VudFN0aWNrZXJzOiBBcnJheTxSZWNlbnRTdGlja2VyVHlwZT47XG59O1xudHlwZSBVbmluc3RhbGxTdGlja2VyUGFja0FjdGlvbiA9IHtcbiAgdHlwZTogJ3N0aWNrZXJzL1VOSU5TVEFMTF9TVElDS0VSX1BBQ0snO1xuICBwYXlsb2FkOiBQcm9taXNlPFVuaW5zdGFsbFN0aWNrZXJQYWNrUGF5bG9hZFR5cGU+O1xufTtcbnR5cGUgVW5pbnN0YWxsU3RpY2tlclBhY2tGdWxmaWxsZWRBY3Rpb24gPSB7XG4gIHR5cGU6ICdzdGlja2Vycy9VTklOU1RBTExfU1RJQ0tFUl9QQUNLX0ZVTEZJTExFRCc7XG4gIHBheWxvYWQ6IFVuaW5zdGFsbFN0aWNrZXJQYWNrUGF5bG9hZFR5cGU7XG59O1xuXG50eXBlIFN0aWNrZXJQYWNrVXBkYXRlZEFjdGlvbiA9IHtcbiAgdHlwZTogJ3N0aWNrZXJzL1NUSUNLRVJfUEFDS19VUERBVEVEJztcbiAgcGF5bG9hZDogeyBwYWNrSWQ6IHN0cmluZzsgcGF0Y2g6IFBhcnRpYWw8U3RpY2tlclBhY2tEQlR5cGU+IH07XG59O1xuXG50eXBlIFN0aWNrZXJQYWNrUmVtb3ZlZEFjdGlvbiA9IHtcbiAgdHlwZTogJ3N0aWNrZXJzL1JFTU9WRV9TVElDS0VSX1BBQ0snO1xuICBwYXlsb2FkOiBzdHJpbmc7XG59O1xuXG50eXBlIFVzZVN0aWNrZXJQYXlsb2FkVHlwZSA9IHtcbiAgcGFja0lkOiBzdHJpbmc7XG4gIHN0aWNrZXJJZDogbnVtYmVyO1xuICB0aW1lOiBudW1iZXI7XG59O1xudHlwZSBVc2VTdGlja2VyQWN0aW9uID0ge1xuICB0eXBlOiAnc3RpY2tlcnMvVVNFX1NUSUNLRVInO1xuICBwYXlsb2FkOiBQcm9taXNlPFVzZVN0aWNrZXJQYXlsb2FkVHlwZT47XG59O1xudHlwZSBVc2VTdGlja2VyRnVsZmlsbGVkQWN0aW9uID0ge1xuICB0eXBlOiAnc3RpY2tlcnMvVVNFX1NUSUNLRVJfRlVMRklMTEVEJztcbiAgcGF5bG9hZDogVXNlU3RpY2tlclBheWxvYWRUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgU3RpY2tlcnNBY3Rpb25UeXBlID1cbiAgfCBDbGVhckluc3RhbGxlZFN0aWNrZXJQYWNrQWN0aW9uXG4gIHwgU3RpY2tlckFkZGVkQWN0aW9uXG4gIHwgU3RpY2tlclBhY2tBZGRlZEFjdGlvblxuICB8IEluc3RhbGxTdGlja2VyUGFja0Z1bGZpbGxlZEFjdGlvblxuICB8IFVuaW5zdGFsbFN0aWNrZXJQYWNrRnVsZmlsbGVkQWN0aW9uXG4gIHwgU3RpY2tlclBhY2tVcGRhdGVkQWN0aW9uXG4gIHwgU3RpY2tlclBhY2tSZW1vdmVkQWN0aW9uXG4gIHwgVXNlU3RpY2tlckZ1bGZpbGxlZEFjdGlvblxuICB8IE5vb3BBY3Rpb25UeXBlO1xuXG4vLyBBY3Rpb24gQ3JlYXRvcnNcblxuZXhwb3J0IGNvbnN0IGFjdGlvbnMgPSB7XG4gIGRvd25sb2FkU3RpY2tlclBhY2ssXG4gIGNsZWFySW5zdGFsbGVkU3RpY2tlclBhY2ssXG4gIHJlbW92ZVN0aWNrZXJQYWNrLFxuICBzdGlja2VyQWRkZWQsXG4gIHN0aWNrZXJQYWNrQWRkZWQsXG4gIGluc3RhbGxTdGlja2VyUGFjayxcbiAgdW5pbnN0YWxsU3RpY2tlclBhY2ssXG4gIHN0aWNrZXJQYWNrVXBkYXRlZCxcbiAgdXNlU3RpY2tlcixcbn07XG5cbmZ1bmN0aW9uIHJlbW92ZVN0aWNrZXJQYWNrKGlkOiBzdHJpbmcpOiBTdGlja2VyUGFja1JlbW92ZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdzdGlja2Vycy9SRU1PVkVfU1RJQ0tFUl9QQUNLJyxcbiAgICBwYXlsb2FkOiBpZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RpY2tlckFkZGVkKHBheWxvYWQ6IFN0aWNrZXJEQlR5cGUpOiBTdGlja2VyQWRkZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdzdGlja2Vycy9TVElDS0VSX0FEREVEJyxcbiAgICBwYXlsb2FkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGlja2VyUGFja0FkZGVkKFxuICBwYXlsb2FkOiBTdGlja2VyUGFja0RCVHlwZSxcbiAgb3B0aW9ucz86IHsgc3VwcHJlc3NFcnJvcj86IGJvb2xlYW4gfVxuKTogU3RpY2tlclBhY2tBZGRlZEFjdGlvbiB7XG4gIGNvbnN0IHsgc3RhdHVzLCBhdHRlbXB0ZWRTdGF0dXMgfSA9IHBheWxvYWQ7XG5cbiAgLy8gV2UgZG8gdGhpcyB0byB0cmlnZ2VyIGEgdG9hc3QsIHdoaWNoIGlzIHN0aWxsIGRvbmUgdmlhIEJhY2tib25lXG4gIGlmIChcbiAgICBzdGF0dXMgPT09ICdlcnJvcicgJiZcbiAgICBhdHRlbXB0ZWRTdGF0dXMgPT09ICdpbnN0YWxsZWQnICYmXG4gICAgIW9wdGlvbnM/LnN1cHByZXNzRXJyb3JcbiAgKSB7XG4gICAgdHJpZ2dlcigncGFjay1pbnN0YWxsLWZhaWxlZCcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc3RpY2tlcnMvU1RJQ0tFUl9QQUNLX0FEREVEJyxcbiAgICBwYXlsb2FkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBkb3dubG9hZFN0aWNrZXJQYWNrKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgcGFja0tleTogc3RyaW5nLFxuICBvcHRpb25zPzogeyBmaW5hbFN0YXR1cz86ICdpbnN0YWxsZWQnIHwgJ2Rvd25sb2FkZWQnIH1cbik6IE5vb3BBY3Rpb25UeXBlIHtcbiAgY29uc3QgeyBmaW5hbFN0YXR1cyB9ID0gb3B0aW9ucyB8fCB7IGZpbmFsU3RhdHVzOiB1bmRlZmluZWQgfTtcblxuICAvLyBXZSdyZSBqdXN0IGtpY2tpbmcgdGhpcyBvZmYsIHNpbmNlIGl0IHdpbGwgZ2VuZXJhdGUgbW9yZSByZWR1eCBldmVudHNcbiAgZXh0ZXJuYWxEb3dubG9hZFN0aWNrZXJQYWNrKHBhY2tJZCwgcGFja0tleSwgeyBmaW5hbFN0YXR1cyB9KTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdOT09QJyxcbiAgICBwYXlsb2FkOiBudWxsLFxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnN0YWxsU3RpY2tlclBhY2soXG4gIHBhY2tJZDogc3RyaW5nLFxuICBwYWNrS2V5OiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgZnJvbVN5bmM/OiBib29sZWFuOyBmcm9tU3RvcmFnZVNlcnZpY2U/OiBib29sZWFuIH0gPSB7fVxuKTogSW5zdGFsbFN0aWNrZXJQYWNrQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc3RpY2tlcnMvSU5TVEFMTF9TVElDS0VSX1BBQ0snLFxuICAgIHBheWxvYWQ6IGRvSW5zdGFsbFN0aWNrZXJQYWNrKHBhY2tJZCwgcGFja0tleSwgb3B0aW9ucyksXG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkb0luc3RhbGxTdGlja2VyUGFjayhcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHBhY2tLZXk6IHN0cmluZyxcbiAgb3B0aW9uczogeyBmcm9tU3luYz86IGJvb2xlYW47IGZyb21TdG9yYWdlU2VydmljZT86IGJvb2xlYW4gfSA9IHt9XG4pOiBQcm9taXNlPEluc3RhbGxTdGlja2VyUGFja1BheWxvYWRUeXBlPiB7XG4gIGNvbnN0IHsgZnJvbVN5bmMgPSBmYWxzZSwgZnJvbVN0b3JhZ2VTZXJ2aWNlID0gZmFsc2UgfSA9IG9wdGlvbnM7XG5cbiAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgYXdhaXQgZGF0YUludGVyZmFjZS5pbnN0YWxsU3RpY2tlclBhY2socGFja0lkLCB0aW1lc3RhbXApO1xuXG4gIGlmICghZnJvbVN5bmMgJiYgIWZyb21TdG9yYWdlU2VydmljZSkge1xuICAgIC8vIEtpY2sgdGhpcyBvZmYsIGJ1dCBkb24ndCB3YWl0IGZvciBpdFxuICAgIHNlbmRTdGlja2VyUGFja1N5bmMocGFja0lkLCBwYWNrS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGlmICghZnJvbVN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IoKTtcbiAgfVxuXG4gIGNvbnN0IHJlY2VudFN0aWNrZXJzID0gYXdhaXQgZ2V0UmVjZW50U3RpY2tlcnMoKTtcblxuICByZXR1cm4ge1xuICAgIHBhY2tJZCxcbiAgICBmcm9tU3luYyxcbiAgICBzdGF0dXM6ICdpbnN0YWxsZWQnLFxuICAgIGluc3RhbGxlZEF0OiB0aW1lc3RhbXAsXG4gICAgcmVjZW50U3RpY2tlcnM6IHJlY2VudFN0aWNrZXJzLm1hcChpdGVtID0+ICh7XG4gICAgICBwYWNrSWQ6IGl0ZW0ucGFja0lkLFxuICAgICAgc3RpY2tlcklkOiBpdGVtLmlkLFxuICAgIH0pKSxcbiAgfTtcbn1cbmZ1bmN0aW9uIHVuaW5zdGFsbFN0aWNrZXJQYWNrKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgcGFja0tleTogc3RyaW5nLFxuICBvcHRpb25zOiB7IGZyb21TeW5jPzogYm9vbGVhbjsgZnJvbVN0b3JhZ2VTZXJ2aWNlPzogYm9vbGVhbiB9ID0ge31cbik6IFVuaW5zdGFsbFN0aWNrZXJQYWNrQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc3RpY2tlcnMvVU5JTlNUQUxMX1NUSUNLRVJfUEFDSycsXG4gICAgcGF5bG9hZDogZG9Vbmluc3RhbGxTdGlja2VyUGFjayhwYWNrSWQsIHBhY2tLZXksIG9wdGlvbnMpLFxuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gZG9Vbmluc3RhbGxTdGlja2VyUGFjayhcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHBhY2tLZXk6IHN0cmluZyxcbiAgb3B0aW9uczogeyBmcm9tU3luYz86IGJvb2xlYW47IGZyb21TdG9yYWdlU2VydmljZT86IGJvb2xlYW4gfSA9IHt9XG4pOiBQcm9taXNlPFVuaW5zdGFsbFN0aWNrZXJQYWNrUGF5bG9hZFR5cGU+IHtcbiAgY29uc3QgeyBmcm9tU3luYyA9IGZhbHNlLCBmcm9tU3RvcmFnZVNlcnZpY2UgPSBmYWxzZSB9ID0gb3B0aW9ucztcblxuICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICBhd2FpdCBkYXRhSW50ZXJmYWNlLnVuaW5zdGFsbFN0aWNrZXJQYWNrKHBhY2tJZCwgdGltZXN0YW1wKTtcblxuICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSByZWZlcmVuY2VzLCBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICBhd2FpdCBtYXliZURlbGV0ZVBhY2socGFja0lkKTtcblxuICBpZiAoIWZyb21TeW5jICYmICFmcm9tU3RvcmFnZVNlcnZpY2UpIHtcbiAgICAvLyBLaWNrIHRoaXMgb2ZmLCBidXQgZG9uJ3Qgd2FpdCBmb3IgaXRcbiAgICBzZW5kU3RpY2tlclBhY2tTeW5jKHBhY2tJZCwgcGFja0tleSwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKCFmcm9tU3RvcmFnZVNlcnZpY2UpIHtcbiAgICBzdG9yYWdlU2VydmljZVVwbG9hZEpvYigpO1xuICB9XG5cbiAgY29uc3QgcmVjZW50U3RpY2tlcnMgPSBhd2FpdCBnZXRSZWNlbnRTdGlja2VycygpO1xuXG4gIHJldHVybiB7XG4gICAgcGFja0lkLFxuICAgIGZyb21TeW5jLFxuICAgIHN0YXR1czogJ2Rvd25sb2FkZWQnLFxuICAgIGluc3RhbGxlZEF0OiB1bmRlZmluZWQsXG4gICAgcmVjZW50U3RpY2tlcnM6IHJlY2VudFN0aWNrZXJzLm1hcChpdGVtID0+ICh7XG4gICAgICBwYWNrSWQ6IGl0ZW0ucGFja0lkLFxuICAgICAgc3RpY2tlcklkOiBpdGVtLmlkLFxuICAgIH0pKSxcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsZWFySW5zdGFsbGVkU3RpY2tlclBhY2soKTogQ2xlYXJJbnN0YWxsZWRTdGlja2VyUGFja0FjdGlvbiB7XG4gIHJldHVybiB7IHR5cGU6ICdzdGlja2Vycy9DTEVBUl9JTlNUQUxMRURfU1RJQ0tFUl9QQUNLJyB9O1xufVxuXG5mdW5jdGlvbiBzdGlja2VyUGFja1VwZGF0ZWQoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBwYXRjaDogUGFydGlhbDxTdGlja2VyUGFja0RCVHlwZT4sXG4gIG9wdGlvbnM/OiB7IHN1cHByZXNzRXJyb3I/OiBib29sZWFuIH1cbik6IFN0aWNrZXJQYWNrVXBkYXRlZEFjdGlvbiB7XG4gIGNvbnN0IHsgc3RhdHVzLCBhdHRlbXB0ZWRTdGF0dXMgfSA9IHBhdGNoO1xuXG4gIC8vIFdlIGRvIHRoaXMgdG8gdHJpZ2dlciBhIHRvYXN0LCB3aGljaCBpcyBzdGlsbCBkb25lIHZpYSBCYWNrYm9uZVxuICBpZiAoXG4gICAgc3RhdHVzID09PSAnZXJyb3InICYmXG4gICAgYXR0ZW1wdGVkU3RhdHVzID09PSAnaW5zdGFsbGVkJyAmJlxuICAgICFvcHRpb25zPy5zdXBwcmVzc0Vycm9yXG4gICkge1xuICAgIHRyaWdnZXIoJ3BhY2staW5zdGFsbC1mYWlsZWQnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3N0aWNrZXJzL1NUSUNLRVJfUEFDS19VUERBVEVEJyxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBwYWNrSWQsXG4gICAgICBwYXRjaCxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTdGlja2VyKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgc3RpY2tlcklkOiBudW1iZXIsXG4gIHRpbWU/OiBudW1iZXJcbik6IFVzZVN0aWNrZXJBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdzdGlja2Vycy9VU0VfU1RJQ0tFUicsXG4gICAgcGF5bG9hZDogZG9Vc2VTdGlja2VyKHBhY2tJZCwgc3RpY2tlcklkLCB0aW1lKSxcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRvVXNlU3RpY2tlcihcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHN0aWNrZXJJZDogbnVtYmVyLFxuICB0aW1lID0gRGF0ZS5ub3coKVxuKTogUHJvbWlzZTxVc2VTdGlja2VyUGF5bG9hZFR5cGU+IHtcbiAgYXdhaXQgdXBkYXRlU3RpY2tlckxhc3RVc2VkKHBhY2tJZCwgc3RpY2tlcklkLCB0aW1lKTtcblxuICByZXR1cm4ge1xuICAgIHBhY2tJZCxcbiAgICBzdGlja2VySWQsXG4gICAgdGltZSxcbiAgfTtcbn1cblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBTdGlja2Vyc1N0YXRlVHlwZSB7XG4gIHJldHVybiB7XG4gICAgaW5zdGFsbGVkUGFjazogbnVsbCxcbiAgICBwYWNrczoge30sXG4gICAgcmVjZW50U3RpY2tlcnM6IFtdLFxuICAgIGJsZXNzZWRQYWNrczoge30sXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKFxuICBzdGF0ZTogUmVhZG9ubHk8U3RpY2tlcnNTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PFN0aWNrZXJzQWN0aW9uVHlwZT5cbik6IFN0aWNrZXJzU3RhdGVUeXBlIHtcbiAgaWYgKGFjdGlvbi50eXBlID09PSAnc3RpY2tlcnMvU1RJQ0tFUl9QQUNLX0FEREVEJykge1xuICAgIC8vIHRzIGNvbXBsYWlucyBkdWUgdG8gYHN0aWNrZXJzOiB7fWAgYmVpbmcgb3ZlcnJpZGRlbiBieSB0aGUgcGF5bG9hZFxuICAgIC8vIGJ1dCB3aXRob3V0IGZ1bGwgY29uZmlkZW5jZSB0aGF0IHRoYXQncyB0aGUgY2FzZSwgYGFueWAgYW5kIGlnbm9yZVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb24gYXMgYW55O1xuICAgIGNvbnN0IG5ld1BhY2sgPSB7XG4gICAgICBzdGlja2Vyczoge30sXG4gICAgICAuLi5wYXlsb2FkLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBwYWNrczoge1xuICAgICAgICAuLi5zdGF0ZS5wYWNrcyxcbiAgICAgICAgW3BheWxvYWQuaWRdOiBuZXdQYWNrLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnc3RpY2tlcnMvU1RJQ0tFUl9BRERFRCcpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcbiAgICBjb25zdCBwYWNrVG9VcGRhdGUgPSBzdGF0ZS5wYWNrc1twYXlsb2FkLnBhY2tJZF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBwYWNrczoge1xuICAgICAgICAuLi5zdGF0ZS5wYWNrcyxcbiAgICAgICAgW3BhY2tUb1VwZGF0ZS5pZF06IHtcbiAgICAgICAgICAuLi5wYWNrVG9VcGRhdGUsXG4gICAgICAgICAgc3RpY2tlcnM6IHtcbiAgICAgICAgICAgIC4uLnBhY2tUb1VwZGF0ZS5zdGlja2VycyxcbiAgICAgICAgICAgIFtwYXlsb2FkLmlkXTogcGF5bG9hZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnc3RpY2tlcnMvU1RJQ0tFUl9QQUNLX1VQREFURUQnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgcGFja1RvVXBkYXRlID0gc3RhdGUucGFja3NbcGF5bG9hZC5wYWNrSWRdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgcGFja3M6IHtcbiAgICAgICAgLi4uc3RhdGUucGFja3MsXG4gICAgICAgIFtwYWNrVG9VcGRhdGUuaWRdOiB7XG4gICAgICAgICAgLi4ucGFja1RvVXBkYXRlLFxuICAgICAgICAgIC4uLnBheWxvYWQucGF0Y2gsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoXG4gICAgYWN0aW9uLnR5cGUgPT09ICdzdGlja2Vycy9JTlNUQUxMX1NUSUNLRVJfUEFDS19GVUxGSUxMRUQnIHx8XG4gICAgYWN0aW9uLnR5cGUgPT09ICdzdGlja2Vycy9VTklOU1RBTExfU1RJQ0tFUl9QQUNLX0ZVTEZJTExFRCdcbiAgKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBmcm9tU3luYywgaW5zdGFsbGVkQXQsIHBhY2tJZCwgc3RhdHVzLCByZWNlbnRTdGlja2VycyB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCB7IHBhY2tzIH0gPSBzdGF0ZTtcbiAgICBjb25zdCBleGlzdGluZ1BhY2sgPSBwYWNrc1twYWNrSWRdO1xuXG4gICAgLy8gQSBwYWNrIG1pZ2h0IGJlIGRlbGV0ZWQgYXMgcGFydCBvZiB0aGUgdW5pbnN0YWxsIHByb2Nlc3NcbiAgICBpZiAoIWV4aXN0aW5nUGFjaykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGluc3RhbGxlZFBhY2s6XG4gICAgICAgICAgc3RhdGUuaW5zdGFsbGVkUGFjayA9PT0gcGFja0lkID8gbnVsbCA6IHN0YXRlLmluc3RhbGxlZFBhY2ssXG4gICAgICAgIHJlY2VudFN0aWNrZXJzLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBpc0JsZXNzZWQgPSBzdGF0ZS5ibGVzc2VkUGFja3NbcGFja0lkXTtcbiAgICBjb25zdCBpbnN0YWxsZWRQYWNrID0gIWZyb21TeW5jICYmICFpc0JsZXNzZWQgPyBwYWNrSWQgOiBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgaW5zdGFsbGVkUGFjayxcbiAgICAgIHBhY2tzOiB7XG4gICAgICAgIC4uLnBhY2tzLFxuICAgICAgICBbcGFja0lkXToge1xuICAgICAgICAgIC4uLnBhY2tzW3BhY2tJZF0sXG4gICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgIGluc3RhbGxlZEF0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY2VudFN0aWNrZXJzLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdzdGlja2Vycy9DTEVBUl9JTlNUQUxMRURfU1RJQ0tFUl9QQUNLJykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGluc3RhbGxlZFBhY2s6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ3N0aWNrZXJzL1JFTU9WRV9TVElDS0VSX1BBQ0snKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBwYWNrczogb21pdChzdGF0ZS5wYWNrcywgcGF5bG9hZCksXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ3N0aWNrZXJzL1VTRV9TVElDS0VSX0ZVTEZJTExFRCcpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcbiAgICBjb25zdCB7IHBhY2tJZCwgc3RpY2tlcklkLCB0aW1lIH0gPSBwYXlsb2FkO1xuICAgIGNvbnN0IHsgcmVjZW50U3RpY2tlcnMsIHBhY2tzIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IGZpbHRlcmVkUmVjZW50cyA9IHJlamVjdChcbiAgICAgIHJlY2VudFN0aWNrZXJzLFxuICAgICAgaXRlbSA9PiBpdGVtLnBhY2tJZCA9PT0gcGFja0lkICYmIGl0ZW0uc3RpY2tlcklkID09PSBzdGlja2VySWRcbiAgICApO1xuICAgIGNvbnN0IHBhY2sgPSBwYWNrc1twYWNrSWRdO1xuICAgIGNvbnN0IHN0aWNrZXIgPSBwYWNrLnN0aWNrZXJzW3N0aWNrZXJJZF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICByZWNlbnRTdGlja2VyczogW3BheWxvYWQsIC4uLmZpbHRlcmVkUmVjZW50c10sXG4gICAgICBwYWNrczoge1xuICAgICAgICAuLi5zdGF0ZS5wYWNrcyxcbiAgICAgICAgW3BhY2tJZF06IHtcbiAgICAgICAgICAuLi5wYWNrLFxuICAgICAgICAgIGxhc3RVc2VkOiB0aW1lLFxuICAgICAgICAgIHN0aWNrZXJzOiB7XG4gICAgICAgICAgICAuLi5wYWNrLnN0aWNrZXJzLFxuICAgICAgICAgICAgW3N0aWNrZXJJZF06IHtcbiAgICAgICAgICAgICAgLi4uc3RpY2tlcixcbiAgICAgICAgICAgICAgbGFzdFVzZWQ6IHRpbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtB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
