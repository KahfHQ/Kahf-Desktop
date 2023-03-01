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
var Stickers_exports = {};
__export(Stickers_exports, {
  copyStickerToAttachments: () => copyStickerToAttachments,
  deletePackReference: () => deletePackReference,
  downloadEphemeralPack: () => downloadEphemeralPack,
  downloadQueuedPacks: () => downloadQueuedPacks,
  downloadStickerPack: () => downloadStickerPack,
  getDataFromLink: () => getDataFromLink,
  getInitialState: () => getInitialState,
  getInstalledStickerPacks: () => getInstalledStickerPacks,
  getSticker: () => getSticker,
  getStickerPack: () => getStickerPack,
  getStickerPackStatus: () => getStickerPackStatus,
  isPackIdValid: () => isPackIdValid,
  load: () => load,
  maybeDeletePack: () => maybeDeletePack,
  redactPackId: () => redactPackId,
  removeEphemeralPack: () => removeEphemeralPack,
  savePackMetadata: () => savePackMetadata
});
module.exports = __toCommonJS(Stickers_exports);
var import_lodash = require("lodash");
var import_p_map = __toESM(require("p-map"));
var import_p_queue = __toESM(require("p-queue"));
var import_assert = require("../util/assert");
var import_dropNull = require("../util/dropNull");
var import_makeLookup = require("../util/makeLookup");
var import_url = require("../util/url");
var Bytes = __toESM(require("../Bytes"));
var Errors = __toESM(require("./errors"));
var import_Crypto = require("../Crypto");
var import_MIME = require("./MIME");
var import_sniffImageMimeType = require("../util/sniffImageMimeType");
var import_Client = __toESM(require("../sql/Client"));
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var import_durations = require("../util/durations");
const BLESSED_PACKS = {
  "9acc9e8aba563d26a4994e69263e3b25": {
    key: "Wm3/OUjCjvubeq+T7MN1xp/DFueAd+0mhnoU0QoPahI=",
    status: "downloaded"
  },
  fb535407d2f6497ec074df8b9c51dd1d: {
    key: "F+lxwTQDViJ4HS7iSeZHO3dFg3ULaMEbuCt1CcaLbf0=",
    status: "downloaded"
  },
  e61fa0867031597467ccc036cc65d403: {
    key: "E657GnQHMYKA6bOMEmHe044OcTi5+WSmzLtz5A9zeps=",
    status: "downloaded"
  },
  cca32f5b905208b7d0f1e17f23fdc185: {
    key: "i/jpX3pFver+DI9bAC7wGrlbjxtbqsQBnM1ra+Cxg3o=",
    status: "downloaded"
  },
  ccc89a05dc077856b57351e90697976c: {
    key: "RXMOYPCdVWYRUiN0RTemt9nqmc7qy3eh+9aAG5YH+88=",
    status: "downloaded"
  },
  cfc50156556893ef9838069d3890fe49: {
    key: "X1vqt9OCRDywCh5I65Upe2uMrf0GMeXQ2dyUnmmZ/0s=",
    status: "downloaded"
  }
};
const STICKER_PACK_DEFAULTS = {
  id: "",
  key: "",
  author: "",
  coverStickerId: 0,
  createdAt: 0,
  downloadAttempts: 0,
  status: "ephemeral",
  stickerCount: 0,
  stickers: {},
  title: "",
  storageNeedsSync: false
};
const VALID_PACK_ID_REGEXP = /^[0-9a-f]{32}$/i;
let initialState;
let packsToDownload;
const downloadQueue = new import_p_queue.default({ concurrency: 1, timeout: import_durations.MINUTE * 30 });
async function load() {
  const [packs, recentStickers] = await Promise.all([
    getPacksForRedux(),
    getRecentStickersForRedux()
  ]);
  const blessedPacks = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(BLESSED_PACKS)) {
    blessedPacks[key] = true;
  }
  initialState = {
    packs,
    recentStickers,
    blessedPacks,
    installedPack: null
  };
  packsToDownload = capturePacksToDownload(packs);
}
function getDataFromLink(link) {
  const url = (0, import_url.maybeParseUrl)(link);
  if (!url) {
    return void 0;
  }
  const { hash } = url;
  if (!hash) {
    return void 0;
  }
  let params;
  try {
    params = new URLSearchParams(hash.slice(1));
  } catch (err) {
    return void 0;
  }
  const id = params.get("pack_id");
  if (!isPackIdValid(id)) {
    return void 0;
  }
  const key = params.get("pack_key");
  if (!key) {
    return void 0;
  }
  return { id, key };
}
function getInstalledStickerPacks() {
  const state = window.reduxStore.getState();
  const { stickers } = state;
  const { packs } = stickers;
  if (!packs) {
    return [];
  }
  const items = Object.values(packs);
  return items.filter((pack) => pack.status === "installed");
}
function downloadQueuedPacks() {
  (0, import_assert.strictAssert)(packsToDownload, "Stickers not initialized");
  const ids = Object.keys(packsToDownload);
  for (const id of ids) {
    const { key, status } = packsToDownload[id];
    downloadStickerPack(id, key, { finalStatus: status, suppressError: true });
  }
  packsToDownload = {};
}
function capturePacksToDownload(existingPackLookup) {
  const toDownload = /* @__PURE__ */ Object.create(null);
  const blessedIds = Object.keys(BLESSED_PACKS);
  blessedIds.forEach((id) => {
    const existing = existingPackLookup[id];
    if (!existing || existing.status !== "downloaded" && existing.status !== "installed") {
      toDownload[id] = {
        id,
        ...BLESSED_PACKS[id]
      };
    }
  });
  const existingIds = Object.keys(existingPackLookup);
  existingIds.forEach((id) => {
    if (toDownload[id]) {
      return;
    }
    const existing = existingPackLookup[id];
    if (existing.status === "ephemeral") {
      deletePack(id);
      return;
    }
    if (existing.status === "known") {
      return;
    }
    if (doesPackNeedDownload(existing)) {
      const status = existing.attemptedStatus === "installed" ? "installed" : void 0;
      toDownload[id] = {
        id,
        key: existing.key,
        status
      };
    }
  });
  return toDownload;
}
function doesPackNeedDownload(pack) {
  if (!pack) {
    return true;
  }
  const { status, stickerCount } = pack;
  if ((status === "installed" || status === "downloaded") && stickerCount > 0) {
    return false;
  }
  return true;
}
async function getPacksForRedux() {
  const [packs, stickers] = await Promise.all([
    import_Client.default.getAllStickerPacks(),
    import_Client.default.getAllStickers()
  ]);
  const stickersByPack = (0, import_lodash.groupBy)(stickers, (sticker) => sticker.packId);
  const fullSet = packs.map((pack) => ({
    ...pack,
    stickers: (0, import_makeLookup.makeLookup)(stickersByPack[pack.id] || [], "id")
  }));
  return (0, import_makeLookup.makeLookup)(fullSet, "id");
}
async function getRecentStickersForRedux() {
  const recent = await import_Client.default.getRecentStickers();
  return recent.map((sticker) => ({
    packId: sticker.packId,
    stickerId: sticker.id
  }));
}
function getInitialState() {
  (0, import_assert.strictAssert)(initialState !== void 0, "Stickers not initialized");
  return initialState;
}
function isPackIdValid(packId) {
  return typeof packId === "string" && VALID_PACK_ID_REGEXP.test(packId);
}
function redactPackId(packId) {
  return `[REDACTED]${packId.slice(-3)}`;
}
function getReduxStickerActions() {
  const actions = window.reduxActions;
  (0, import_assert.strictAssert)(actions && actions.stickers, "Redux not ready");
  return actions.stickers;
}
function decryptSticker(packKey, ciphertext) {
  const binaryKey = Bytes.fromBase64(packKey);
  const derivedKey = (0, import_Crypto.deriveStickerPackKey)(binaryKey);
  const plaintext = (0, import_Crypto.decryptAttachment)(ciphertext, derivedKey);
  return plaintext;
}
async function downloadSticker(packId, packKey, proto, { ephemeral } = {}) {
  const { id, emoji } = proto;
  (0, import_assert.strictAssert)(id !== void 0 && id !== null, "Sticker id can't be null");
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error("messaging is not available!");
  }
  const ciphertext = await messaging.getSticker(packId, id);
  const plaintext = decryptSticker(packKey, ciphertext);
  const sticker = ephemeral ? await window.Signal.Migrations.processNewEphemeralSticker(plaintext) : await window.Signal.Migrations.processNewSticker(plaintext);
  return {
    id,
    emoji: (0, import_dropNull.dropNull)(emoji),
    ...sticker,
    packId
  };
}
async function savePackMetadata(packId, packKey, { messageId } = {}) {
  const existing = getStickerPack(packId);
  if (existing) {
    return;
  }
  const { stickerPackAdded } = getReduxStickerActions();
  const pack = {
    ...STICKER_PACK_DEFAULTS,
    id: packId,
    key: packKey,
    status: "known"
  };
  stickerPackAdded(pack);
  await import_Client.default.createOrUpdateStickerPack(pack);
  if (messageId) {
    await import_Client.default.addStickerPackReference(messageId, packId);
  }
}
async function removeEphemeralPack(packId) {
  const existing = getStickerPack(packId);
  (0, import_assert.strictAssert)(existing, `No existing sticker pack with id: ${packId}`);
  if (existing.status !== "ephemeral" && !(existing.status === "error" && existing.attemptedStatus === "ephemeral")) {
    return;
  }
  const { removeStickerPack } = getReduxStickerActions();
  removeStickerPack(packId);
  const stickers = (0, import_lodash.values)(existing.stickers);
  const paths = stickers.map((sticker) => sticker.path);
  await (0, import_p_map.default)(paths, window.Signal.Migrations.deleteTempFile, {
    concurrency: 3
  });
  await import_Client.default.deleteStickerPack(packId);
}
async function downloadEphemeralPack(packId, packKey) {
  const { stickerAdded, stickerPackAdded, stickerPackUpdated } = getReduxStickerActions();
  const existingPack = getStickerPack(packId);
  if (existingPack && (existingPack.status === "downloaded" || existingPack.status === "installed" || existingPack.status === "pending")) {
    log.warn(`Ephemeral download for pack ${redactPackId(packId)} requested, we already know about it. Skipping.`);
    return;
  }
  try {
    const placeholder = {
      ...STICKER_PACK_DEFAULTS,
      id: packId,
      key: packKey,
      status: "ephemeral"
    };
    stickerPackAdded(placeholder);
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("messaging is not available!");
    }
    const ciphertext = await messaging.getStickerPackManifest(packId);
    const plaintext = decryptSticker(packKey, ciphertext);
    const proto = import_protobuf.SignalService.StickerPack.decode(plaintext);
    const firstStickerProto = proto.stickers ? proto.stickers[0] : null;
    const stickerCount = proto.stickers.length;
    const coverProto = proto.cover || firstStickerProto;
    const coverStickerId = coverProto ? coverProto.id : null;
    if (!coverProto || !(0, import_lodash.isNumber)(coverStickerId)) {
      throw new Error(`Sticker pack ${redactPackId(packId)} is malformed - it has no cover, and no stickers`);
    }
    const nonCoverStickers = (0, import_lodash.reject)(proto.stickers, (sticker) => !(0, import_lodash.isNumber)(sticker.id) || sticker.id === coverStickerId);
    const coverSticker = proto.stickers.filter((sticker) => (0, import_lodash.isNumber)(sticker.id) && sticker.id === coverStickerId);
    if (coverSticker[0] && !coverProto.emoji) {
      coverProto.emoji = coverSticker[0].emoji;
    }
    const coverIncludedInList = nonCoverStickers.length < stickerCount;
    const pack = {
      ...STICKER_PACK_DEFAULTS,
      id: packId,
      key: packKey,
      coverStickerId,
      stickerCount,
      status: "ephemeral",
      ...(0, import_lodash.pick)(proto, ["title", "author"])
    };
    stickerPackAdded(pack);
    const downloadStickerJob = /* @__PURE__ */ __name(async (stickerProto) => {
      let stickerInfo;
      try {
        stickerInfo = await downloadSticker(packId, packKey, stickerProto, {
          ephemeral: true
        });
      } catch (error) {
        log.error(`downloadEphemeralPack/downloadStickerJob error: ${Errors.toLogFormat(error)}`);
        return false;
      }
      const sticker = {
        ...stickerInfo,
        isCoverOnly: !coverIncludedInList && stickerInfo.id === coverStickerId
      };
      const statusCheck = getStickerPackStatus(packId);
      if (statusCheck !== "ephemeral") {
        throw new Error(`Ephemeral download for pack ${redactPackId(packId)} interrupted by status change. Status is now ${statusCheck}.`);
      }
      stickerAdded(sticker);
      return true;
    }, "downloadStickerJob");
    await downloadStickerJob(coverProto);
    const jobResults = await (0, import_p_map.default)(nonCoverStickers, downloadStickerJob, {
      concurrency: 3
    });
    const successfulStickerCount = jobResults.filter((item) => item).length;
    if (successfulStickerCount === 0 && nonCoverStickers.length !== 0) {
      throw new Error("downloadEphemeralPack: All stickers failed to download");
    }
  } catch (error) {
    const statusCheck = getStickerPackStatus(packId);
    if (statusCheck === "ephemeral") {
      stickerPackUpdated(packId, {
        attemptedStatus: "ephemeral",
        status: "error"
      });
    }
    log.error(`Ephemeral download error for sticker pack ${redactPackId(packId)}:`, error && error.stack ? error.stack : error);
  }
}
async function downloadStickerPack(packId, packKey, options = {}) {
  return downloadQueue.add(async () => {
    try {
      await doDownloadStickerPack(packId, packKey, options);
    } catch (error) {
      log.error("doDownloadStickerPack threw an error:", error && error.stack ? error.stack : error);
    }
  });
}
async function doDownloadStickerPack(packId, packKey, {
  finalStatus = "downloaded",
  messageId,
  fromSync = false,
  fromStorageService = false,
  suppressError = false
}) {
  const {
    stickerAdded,
    stickerPackAdded,
    stickerPackUpdated,
    installStickerPack
  } = getReduxStickerActions();
  if (finalStatus !== "downloaded" && finalStatus !== "installed") {
    throw new Error(`doDownloadStickerPack: invalid finalStatus of ${finalStatus} requested.`);
  }
  const existing = getStickerPack(packId);
  if (!doesPackNeedDownload(existing)) {
    return;
  }
  const attemptIncrement = navigator.onLine ? 1 : 0;
  const downloadAttempts = (existing ? existing.downloadAttempts || 0 : 0) + attemptIncrement;
  if (downloadAttempts > 3) {
    log.warn(`Refusing to attempt another download for pack ${redactPackId(packId)}, attempt number ${downloadAttempts}`);
    if (existing && existing.status !== "error") {
      await import_Client.default.updateStickerPackStatus(packId, "error");
      stickerPackUpdated(packId, {
        status: "error"
      }, { suppressError });
    }
    return;
  }
  let coverProto;
  let coverStickerId;
  let coverIncludedInList = false;
  let nonCoverStickers = [];
  try {
    const placeholder = {
      ...STICKER_PACK_DEFAULTS,
      id: packId,
      key: packKey,
      attemptedStatus: finalStatus,
      downloadAttempts,
      status: "pending"
    };
    stickerPackAdded(placeholder);
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("messaging is not available!");
    }
    const ciphertext = await messaging.getStickerPackManifest(packId);
    const plaintext = decryptSticker(packKey, ciphertext);
    const proto = import_protobuf.SignalService.StickerPack.decode(plaintext);
    const firstStickerProto = proto.stickers ? proto.stickers[0] : void 0;
    const stickerCount = proto.stickers.length;
    coverProto = proto.cover || firstStickerProto;
    coverStickerId = (0, import_dropNull.dropNull)(coverProto ? coverProto.id : void 0);
    if (!coverProto || !(0, import_lodash.isNumber)(coverStickerId)) {
      throw new Error(`Sticker pack ${redactPackId(packId)} is malformed - it has no cover, and no stickers`);
    }
    nonCoverStickers = (0, import_lodash.reject)(proto.stickers, (sticker) => !(0, import_lodash.isNumber)(sticker.id) || sticker.id === coverStickerId);
    const coverSticker = proto.stickers.filter((sticker) => (0, import_lodash.isNumber)(sticker.id) && sticker.id === coverStickerId);
    if (coverSticker[0] && !coverProto.emoji) {
      coverProto.emoji = coverSticker[0].emoji;
    }
    coverIncludedInList = nonCoverStickers.length < stickerCount;
    const pack = {
      id: packId,
      key: packKey,
      attemptedStatus: finalStatus,
      coverStickerId,
      downloadAttempts,
      stickerCount,
      status: "pending",
      createdAt: Date.now(),
      stickers: {},
      storageNeedsSync: !fromStorageService,
      ...(0, import_lodash.pick)(proto, ["title", "author"])
    };
    await import_Client.default.createOrUpdateStickerPack(pack);
    stickerPackAdded(pack);
    if (messageId) {
      await import_Client.default.addStickerPackReference(messageId, packId);
    }
  } catch (error) {
    log.error(`Error downloading manifest for sticker pack ${redactPackId(packId)}:`, error && error.stack ? error.stack : error);
    const pack = {
      ...STICKER_PACK_DEFAULTS,
      id: packId,
      key: packKey,
      attemptedStatus: finalStatus,
      downloadAttempts,
      status: "error"
    };
    await import_Client.default.createOrUpdateStickerPack(pack);
    stickerPackAdded(pack, { suppressError });
    return;
  }
  try {
    const downloadStickerJob = /* @__PURE__ */ __name(async (stickerProto) => {
      try {
        const stickerInfo = await downloadSticker(packId, packKey, stickerProto);
        const sticker = {
          ...stickerInfo,
          isCoverOnly: !coverIncludedInList && stickerInfo.id === coverStickerId
        };
        await import_Client.default.createOrUpdateSticker(sticker);
        stickerAdded(sticker);
        return true;
      } catch (error) {
        log.error(`doDownloadStickerPack/downloadStickerJob error: ${Errors.toLogFormat(error)}`);
        return false;
      }
    }, "downloadStickerJob");
    await downloadStickerJob(coverProto);
    const jobResults = await (0, import_p_map.default)(nonCoverStickers, downloadStickerJob, {
      concurrency: 3
    });
    const successfulStickerCount = jobResults.filter((item) => item).length;
    if (successfulStickerCount === 0 && nonCoverStickers.length !== 0) {
      throw new Error("doDownloadStickerPack: All stickers failed to download");
    }
    const existingStatus = getStickerPackStatus(packId);
    if (existingStatus === "installed") {
      return;
    }
    if (finalStatus === "installed") {
      await installStickerPack(packId, packKey, {
        fromSync,
        fromStorageService
      });
    } else {
      await import_Client.default.updateStickerPackStatus(packId, finalStatus);
      stickerPackUpdated(packId, {
        status: finalStatus
      });
    }
  } catch (error) {
    log.error(`Error downloading stickers for sticker pack ${redactPackId(packId)}:`, error && error.stack ? error.stack : error);
    const errorStatus = "error";
    await import_Client.default.updateStickerPackStatus(packId, errorStatus);
    if (stickerPackUpdated) {
      stickerPackUpdated(packId, {
        attemptedStatus: finalStatus,
        status: errorStatus
      }, { suppressError });
    }
  }
}
function getStickerPack(packId) {
  const state = window.reduxStore.getState();
  const { stickers } = state;
  const { packs } = stickers;
  if (!packs) {
    return void 0;
  }
  return packs[packId];
}
function getStickerPackStatus(packId) {
  const pack = getStickerPack(packId);
  if (!pack) {
    return void 0;
  }
  return pack.status;
}
function getSticker(packId, stickerId) {
  const pack = getStickerPack(packId);
  if (!pack || !pack.stickers) {
    return void 0;
  }
  return pack.stickers[stickerId];
}
async function copyStickerToAttachments(packId, stickerId) {
  const sticker = getSticker(packId, stickerId);
  if (!sticker) {
    throw new Error(`copyStickerToAttachments: Failed to find sticker ${packId}/${stickerId}`);
  }
  const { path: stickerPath } = sticker;
  const absolutePath = window.Signal.Migrations.getAbsoluteStickerPath(stickerPath);
  const { path, size } = await window.Signal.Migrations.copyIntoAttachmentsDirectory(absolutePath);
  const data = await window.Signal.Migrations.readAttachmentData(path);
  let contentType;
  const sniffedMimeType = (0, import_sniffImageMimeType.sniffImageMimeType)(data);
  if (sniffedMimeType) {
    contentType = sniffedMimeType;
  } else {
    log.warn("copyStickerToAttachments: Unable to sniff sticker MIME type; falling back to WebP");
    contentType = import_MIME.IMAGE_WEBP;
  }
  return {
    ...sticker,
    contentType,
    path,
    size
  };
}
async function maybeDeletePack(packId) {
  await deletePackReference("NOT-USED", packId);
}
async function deletePackReference(messageId, packId) {
  const isBlessed = Boolean(BLESSED_PACKS[packId]);
  if (isBlessed) {
    return;
  }
  const paths = await import_Client.default.deleteStickerPackReference(messageId, packId);
  if (!paths) {
    return;
  }
  const { removeStickerPack } = getReduxStickerActions();
  removeStickerPack(packId);
  await (0, import_p_map.default)(paths, window.Signal.Migrations.deleteSticker, {
    concurrency: 3
  });
}
async function deletePack(packId) {
  const isBlessed = Boolean(BLESSED_PACKS[packId]);
  if (isBlessed) {
    return;
  }
  const paths = await import_Client.default.deleteStickerPack(packId);
  const { removeStickerPack } = getReduxStickerActions();
  removeStickerPack(packId);
  await (0, import_p_map.default)(paths, window.Signal.Migrations.deleteSticker, {
    concurrency: 3
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  copyStickerToAttachments,
  deletePackReference,
  downloadEphemeralPack,
  downloadQueuedPacks,
  downloadStickerPack,
  getDataFromLink,
  getInitialState,
  getInstalledStickerPacks,
  getSticker,
  getStickerPack,
  getStickerPackStatus,
  isPackIdValid,
  load,
  maybeDeletePack,
  redactPackId,
  removeEphemeralPack,
  savePackMetadata
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RpY2tlcnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBpc051bWJlciwgcGljaywgcmVqZWN0LCBncm91cEJ5LCB2YWx1ZXMgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHBNYXAgZnJvbSAncC1tYXAnO1xuaW1wb3J0IFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuXG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBkcm9wTnVsbCB9IGZyb20gJy4uL3V0aWwvZHJvcE51bGwnO1xuaW1wb3J0IHsgbWFrZUxvb2t1cCB9IGZyb20gJy4uL3V0aWwvbWFrZUxvb2t1cCc7XG5pbXBvcnQgeyBtYXliZVBhcnNlVXJsIH0gZnJvbSAnLi4vdXRpbC91cmwnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IGRlcml2ZVN0aWNrZXJQYWNrS2V5LCBkZWNyeXB0QXR0YWNobWVudCB9IGZyb20gJy4uL0NyeXB0byc7XG5pbXBvcnQgeyBJTUFHRV9XRUJQIH0gZnJvbSAnLi9NSU1FJztcbmltcG9ydCB0eXBlIHsgTUlNRVR5cGUgfSBmcm9tICcuL01JTUUnO1xuaW1wb3J0IHsgc25pZmZJbWFnZU1pbWVUeXBlIH0gZnJvbSAnLi4vdXRpbC9zbmlmZkltYWdlTWltZVR5cGUnO1xuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSwgQXR0YWNobWVudFdpdGhIeWRyYXRlZERhdGEgfSBmcm9tICcuL0F0dGFjaG1lbnQnO1xuaW1wb3J0IHR5cGUge1xuICBTdGlja2VyVHlwZSBhcyBTdGlja2VyRnJvbURCVHlwZSxcbiAgU3RpY2tlclBhY2tUeXBlLFxuICBTdGlja2VyUGFja1N0YXR1c1R5cGUsXG59IGZyb20gJy4uL3NxbC9JbnRlcmZhY2UnO1xuaW1wb3J0IERhdGEgZnJvbSAnLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB0eXBlIHsgU3RpY2tlcnNTdGF0ZVR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdGlja2Vycyc7XG5pbXBvcnQgeyBNSU5VVEUgfSBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIFN0aWNrZXJUeXBlID0ge1xuICBwYWNrSWQ6IHN0cmluZztcbiAgc3RpY2tlcklkOiBudW1iZXI7XG4gIHBhY2tLZXk6IHN0cmluZztcbiAgZW1vamk/OiBzdHJpbmc7XG4gIGRhdGE/OiBBdHRhY2htZW50VHlwZTtcbiAgcGF0aD86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSA9IFN0aWNrZXJUeXBlICYge1xuICBkYXRhOiBBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YTtcbn07XG5cbmV4cG9ydCB0eXBlIFJlY2VudFN0aWNrZXJUeXBlID0gUmVhZG9ubHk8e1xuICBzdGlja2VySWQ6IG51bWJlcjtcbiAgcGFja0lkOiBzdHJpbmc7XG59PjtcblxuZXhwb3J0IHR5cGUgQmxlc3NlZFR5cGUgPSBQaWNrPFN0aWNrZXJQYWNrVHlwZSwgJ2tleScgfCAnc3RhdHVzJz47XG5cbmV4cG9ydCB0eXBlIERvd25sb2FkTWFwID0gUmVjb3JkPFxuICBzdHJpbmcsXG4gIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGtleTogc3RyaW5nO1xuICAgIHN0YXR1cz86IFN0aWNrZXJQYWNrU3RhdHVzVHlwZTtcbiAgfVxuPjtcblxuY29uc3QgQkxFU1NFRF9QQUNLUzogUmVjb3JkPHN0cmluZywgQmxlc3NlZFR5cGU+ID0ge1xuICAnOWFjYzllOGFiYTU2M2QyNmE0OTk0ZTY5MjYzZTNiMjUnOiB7XG4gICAga2V5OiAnV20zL09VakNqdnViZXErVDdNTjF4cC9ERnVlQWQrMG1obm9VMFFvUGFoST0nLFxuICAgIHN0YXR1czogJ2Rvd25sb2FkZWQnLFxuICB9LFxuICBmYjUzNTQwN2QyZjY0OTdlYzA3NGRmOGI5YzUxZGQxZDoge1xuICAgIGtleTogJ0YrbHh3VFFEVmlKNEhTN2lTZVpITzNkRmczVUxhTUVidUN0MUNjYUxiZjA9JyxcbiAgICBzdGF0dXM6ICdkb3dubG9hZGVkJyxcbiAgfSxcbiAgZTYxZmEwODY3MDMxNTk3NDY3Y2NjMDM2Y2M2NWQ0MDM6IHtcbiAgICBrZXk6ICdFNjU3R25RSE1ZS0E2Yk9NRW1IZTA0NE9jVGk1K1dTbXpMdHo1QTl6ZXBzPScsXG4gICAgc3RhdHVzOiAnZG93bmxvYWRlZCcsXG4gIH0sXG4gIGNjYTMyZjViOTA1MjA4YjdkMGYxZTE3ZjIzZmRjMTg1OiB7XG4gICAga2V5OiAnaS9qcFgzcEZ2ZXIrREk5YkFDN3dHcmxianh0YnFzUUJuTTFyYStDeGczbz0nLFxuICAgIHN0YXR1czogJ2Rvd25sb2FkZWQnLFxuICB9LFxuICBjY2M4OWEwNWRjMDc3ODU2YjU3MzUxZTkwNjk3OTc2Yzoge1xuICAgIGtleTogJ1JYTU9ZUENkVldZUlVpTjBSVGVtdDlucW1jN3F5M2VoKzlhQUc1WUgrODg9JyxcbiAgICBzdGF0dXM6ICdkb3dubG9hZGVkJyxcbiAgfSxcbiAgY2ZjNTAxNTY1NTY4OTNlZjk4MzgwNjlkMzg5MGZlNDk6IHtcbiAgICBrZXk6ICdYMXZxdDlPQ1JEeXdDaDVJNjVVcGUydU1yZjBHTWVYUTJkeVVubW1aLzBzPScsXG4gICAgc3RhdHVzOiAnZG93bmxvYWRlZCcsXG4gIH0sXG59O1xuXG5jb25zdCBTVElDS0VSX1BBQ0tfREVGQVVMVFM6IFN0aWNrZXJQYWNrVHlwZSA9IHtcbiAgaWQ6ICcnLFxuICBrZXk6ICcnLFxuXG4gIGF1dGhvcjogJycsXG4gIGNvdmVyU3RpY2tlcklkOiAwLFxuICBjcmVhdGVkQXQ6IDAsXG4gIGRvd25sb2FkQXR0ZW1wdHM6IDAsXG4gIHN0YXR1czogJ2VwaGVtZXJhbCcsXG4gIHN0aWNrZXJDb3VudDogMCxcbiAgc3RpY2tlcnM6IHt9LFxuICB0aXRsZTogJycsXG5cbiAgc3RvcmFnZU5lZWRzU3luYzogZmFsc2UsXG59O1xuXG5jb25zdCBWQUxJRF9QQUNLX0lEX1JFR0VYUCA9IC9eWzAtOWEtZl17MzJ9JC9pO1xuXG5sZXQgaW5pdGlhbFN0YXRlOiBTdGlja2Vyc1N0YXRlVHlwZSB8IHVuZGVmaW5lZDtcbmxldCBwYWNrc1RvRG93bmxvYWQ6IERvd25sb2FkTWFwIHwgdW5kZWZpbmVkO1xuY29uc3QgZG93bmxvYWRRdWV1ZSA9IG5ldyBRdWV1ZSh7IGNvbmN1cnJlbmN5OiAxLCB0aW1lb3V0OiBNSU5VVEUgKiAzMCB9KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IFtwYWNrcywgcmVjZW50U3RpY2tlcnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIGdldFBhY2tzRm9yUmVkdXgoKSxcbiAgICBnZXRSZWNlbnRTdGlja2Vyc0ZvclJlZHV4KCksXG4gIF0pO1xuXG4gIGNvbnN0IGJsZXNzZWRQYWNrczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhCTEVTU0VEX1BBQ0tTKSkge1xuICAgIGJsZXNzZWRQYWNrc1trZXldID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXRpYWxTdGF0ZSA9IHtcbiAgICBwYWNrcyxcbiAgICByZWNlbnRTdGlja2VycyxcbiAgICBibGVzc2VkUGFja3MsXG4gICAgaW5zdGFsbGVkUGFjazogbnVsbCxcbiAgfTtcblxuICBwYWNrc1RvRG93bmxvYWQgPSBjYXB0dXJlUGFja3NUb0Rvd25sb2FkKHBhY2tzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFGcm9tTGluayhcbiAgbGluazogc3RyaW5nXG4pOiB1bmRlZmluZWQgfCB7IGlkOiBzdHJpbmc7IGtleTogc3RyaW5nIH0ge1xuICBjb25zdCB1cmwgPSBtYXliZVBhcnNlVXJsKGxpbmspO1xuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB7IGhhc2ggfSA9IHVybDtcbiAgaWYgKCFoYXNoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBwYXJhbXM7XG4gIHRyeSB7XG4gICAgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhoYXNoLnNsaWNlKDEpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGlkID0gcGFyYW1zLmdldCgncGFja19pZCcpO1xuICBpZiAoIWlzUGFja0lkVmFsaWQoaWQpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGtleSA9IHBhcmFtcy5nZXQoJ3BhY2tfa2V5Jyk7XG4gIGlmICgha2V5KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7IGlkLCBrZXkgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RhbGxlZFN0aWNrZXJQYWNrcygpOiBBcnJheTxTdGlja2VyUGFja1R5cGU+IHtcbiAgY29uc3Qgc3RhdGUgPSB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpO1xuICBjb25zdCB7IHN0aWNrZXJzIH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBwYWNrcyB9ID0gc3RpY2tlcnM7XG4gIGlmICghcGFja3MpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBpdGVtcyA9IE9iamVjdC52YWx1ZXMocGFja3MpO1xuICByZXR1cm4gaXRlbXMuZmlsdGVyKHBhY2sgPT4gcGFjay5zdGF0dXMgPT09ICdpbnN0YWxsZWQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkUXVldWVkUGFja3MoKTogdm9pZCB7XG4gIHN0cmljdEFzc2VydChwYWNrc1RvRG93bmxvYWQsICdTdGlja2VycyBub3QgaW5pdGlhbGl6ZWQnKTtcblxuICBjb25zdCBpZHMgPSBPYmplY3Qua2V5cyhwYWNrc1RvRG93bmxvYWQpO1xuICBmb3IgKGNvbnN0IGlkIG9mIGlkcykge1xuICAgIGNvbnN0IHsga2V5LCBzdGF0dXMgfSA9IHBhY2tzVG9Eb3dubG9hZFtpZF07XG5cbiAgICAvLyBUaGUgcXVldWluZyBpcyBkb25lIGluc2lkZSB0aGlzIGZ1bmN0aW9uLCBubyBuZWVkIHRvIGF3YWl0IGhlcmVcbiAgICBkb3dubG9hZFN0aWNrZXJQYWNrKGlkLCBrZXksIHsgZmluYWxTdGF0dXM6IHN0YXR1cywgc3VwcHJlc3NFcnJvcjogdHJ1ZSB9KTtcbiAgfVxuXG4gIHBhY2tzVG9Eb3dubG9hZCA9IHt9O1xufVxuXG5mdW5jdGlvbiBjYXB0dXJlUGFja3NUb0Rvd25sb2FkKFxuICBleGlzdGluZ1BhY2tMb29rdXA6IFJlY29yZDxzdHJpbmcsIFN0aWNrZXJQYWNrVHlwZT5cbik6IERvd25sb2FkTWFwIHtcbiAgY29uc3QgdG9Eb3dubG9hZDogRG93bmxvYWRNYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vIEZpcnN0LCBlbnN1cmUgdGhhdCBibGVzc2VkIHBhY2tzIGFyZSBpbiBnb29kIHNoYXBlXG4gIGNvbnN0IGJsZXNzZWRJZHMgPSBPYmplY3Qua2V5cyhCTEVTU0VEX1BBQ0tTKTtcbiAgYmxlc3NlZElkcy5mb3JFYWNoKGlkID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGV4aXN0aW5nUGFja0xvb2t1cFtpZF07XG4gICAgaWYgKFxuICAgICAgIWV4aXN0aW5nIHx8XG4gICAgICAoZXhpc3Rpbmcuc3RhdHVzICE9PSAnZG93bmxvYWRlZCcgJiYgZXhpc3Rpbmcuc3RhdHVzICE9PSAnaW5zdGFsbGVkJylcbiAgICApIHtcbiAgICAgIHRvRG93bmxvYWRbaWRdID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgLi4uQkxFU1NFRF9QQUNLU1tpZF0sXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gVGhlbiwgZmluZCBlcnJvciBjYXNlcyBpbiBwYWNrcyB3ZSBhbHJlYWR5IGtub3cgYWJvdXRcbiAgY29uc3QgZXhpc3RpbmdJZHMgPSBPYmplY3Qua2V5cyhleGlzdGluZ1BhY2tMb29rdXApO1xuICBleGlzdGluZ0lkcy5mb3JFYWNoKGlkID0+IHtcbiAgICBpZiAodG9Eb3dubG9hZFtpZF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBleGlzdGluZyA9IGV4aXN0aW5nUGFja0xvb2t1cFtpZF07XG5cbiAgICAvLyBUaGVzZSBwYWNrcyBzaG91bGQgbmV2ZXIgZW5kIHVwIGluIHRoZSBkYXRhYmFzZSwgYnV0IGlmIHRoZXkgZG8gd2UnbGwgZGVsZXRlIHRoZW1cbiAgICBpZiAoZXhpc3Rpbmcuc3RhdHVzID09PSAnZXBoZW1lcmFsJykge1xuICAgICAgZGVsZXRlUGFjayhpZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgZG9uJ3QgYXV0b21hdGljYWxseSBkb3dubG9hZCB0aGVzZTsgbm90IHVudGlsIGEgdXNlciBhY3Rpb24ga2lja3MgaXQgb2ZmXG4gICAgaWYgKGV4aXN0aW5nLnN0YXR1cyA9PT0gJ2tub3duJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkb2VzUGFja05lZWREb3dubG9hZChleGlzdGluZykpIHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9XG4gICAgICAgIGV4aXN0aW5nLmF0dGVtcHRlZFN0YXR1cyA9PT0gJ2luc3RhbGxlZCcgPyAnaW5zdGFsbGVkJyA6IHVuZGVmaW5lZDtcbiAgICAgIHRvRG93bmxvYWRbaWRdID0ge1xuICAgICAgICBpZCxcbiAgICAgICAga2V5OiBleGlzdGluZy5rZXksXG4gICAgICAgIHN0YXR1cyxcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdG9Eb3dubG9hZDtcbn1cblxuZnVuY3Rpb24gZG9lc1BhY2tOZWVkRG93bmxvYWQocGFjaz86IFN0aWNrZXJQYWNrVHlwZSk6IGJvb2xlYW4ge1xuICBpZiAoIXBhY2spIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IHsgc3RhdHVzLCBzdGlja2VyQ291bnQgfSA9IHBhY2s7XG5cbiAgaWYgKChzdGF0dXMgPT09ICdpbnN0YWxsZWQnIHx8IHN0YXR1cyA9PT0gJ2Rvd25sb2FkZWQnKSAmJiBzdGlja2VyQ291bnQgPiAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSWYgd2UgZG9uJ3QgdW5kZXJzdGFuZCBhIHBhY2sncyBzdGF0dXMsIHdlJ2xsIGRvd25sb2FkIGl0XG4gIC8vIElmIGEgcGFjayBoYXMgYW55IG90aGVyIHN0YXR1cywgd2UnbGwgZG93bmxvYWQgaXRcbiAgLy8gSWYgYSBwYWNrIGhhcyB6ZXJvIHN0aWNrZXJzIGluIGl0LCB3ZSdsbCBkb3dubG9hZCBpdFxuXG4gIC8vIE5vdGU6IElmIGEgcGFjayBkb3dubG9hZGVkIHdpdGggbGVzcyB0aGFuIHRoZSBleHBlY3RlZCBudW1iZXIgb2Ygc3RpY2tlcnMsIHdlJ3JlXG4gIC8vICAgb2theSB3aXRoIHRoYXQuXG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBhY2tzRm9yUmVkdXgoKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCBTdGlja2VyUGFja1R5cGU+PiB7XG4gIGNvbnN0IFtwYWNrcywgc3RpY2tlcnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIERhdGEuZ2V0QWxsU3RpY2tlclBhY2tzKCksXG4gICAgRGF0YS5nZXRBbGxTdGlja2VycygpLFxuICBdKTtcblxuICBjb25zdCBzdGlja2Vyc0J5UGFjayA9IGdyb3VwQnkoc3RpY2tlcnMsIHN0aWNrZXIgPT4gc3RpY2tlci5wYWNrSWQpO1xuICBjb25zdCBmdWxsU2V0OiBBcnJheTxTdGlja2VyUGFja1R5cGU+ID0gcGFja3MubWFwKHBhY2sgPT4gKHtcbiAgICAuLi5wYWNrLFxuICAgIHN0aWNrZXJzOiBtYWtlTG9va3VwKHN0aWNrZXJzQnlQYWNrW3BhY2suaWRdIHx8IFtdLCAnaWQnKSxcbiAgfSkpO1xuXG4gIHJldHVybiBtYWtlTG9va3VwKGZ1bGxTZXQsICdpZCcpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSZWNlbnRTdGlja2Vyc0ZvclJlZHV4KCk6IFByb21pc2U8QXJyYXk8UmVjZW50U3RpY2tlclR5cGU+PiB7XG4gIGNvbnN0IHJlY2VudCA9IGF3YWl0IERhdGEuZ2V0UmVjZW50U3RpY2tlcnMoKTtcbiAgcmV0dXJuIHJlY2VudC5tYXAoc3RpY2tlciA9PiAoe1xuICAgIHBhY2tJZDogc3RpY2tlci5wYWNrSWQsXG4gICAgc3RpY2tlcklkOiBzdGlja2VyLmlkLFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKTogU3RpY2tlcnNTdGF0ZVR5cGUge1xuICBzdHJpY3RBc3NlcnQoaW5pdGlhbFN0YXRlICE9PSB1bmRlZmluZWQsICdTdGlja2VycyBub3QgaW5pdGlhbGl6ZWQnKTtcbiAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFja0lkVmFsaWQocGFja0lkOiB1bmtub3duKTogcGFja0lkIGlzIHN0cmluZyB7XG4gIHJldHVybiB0eXBlb2YgcGFja0lkID09PSAnc3RyaW5nJyAmJiBWQUxJRF9QQUNLX0lEX1JFR0VYUC50ZXN0KHBhY2tJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWRhY3RQYWNrSWQocGFja0lkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYFtSRURBQ1RFRF0ke3BhY2tJZC5zbGljZSgtMyl9YDtcbn1cblxuZnVuY3Rpb24gZ2V0UmVkdXhTdGlja2VyQWN0aW9ucygpIHtcbiAgY29uc3QgYWN0aW9ucyA9IHdpbmRvdy5yZWR1eEFjdGlvbnM7XG4gIHN0cmljdEFzc2VydChhY3Rpb25zICYmIGFjdGlvbnMuc3RpY2tlcnMsICdSZWR1eCBub3QgcmVhZHknKTtcblxuICByZXR1cm4gYWN0aW9ucy5zdGlja2Vycztcbn1cblxuZnVuY3Rpb24gZGVjcnlwdFN0aWNrZXIocGFja0tleTogc3RyaW5nLCBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5KTogVWludDhBcnJheSB7XG4gIGNvbnN0IGJpbmFyeUtleSA9IEJ5dGVzLmZyb21CYXNlNjQocGFja0tleSk7XG4gIGNvbnN0IGRlcml2ZWRLZXkgPSBkZXJpdmVTdGlja2VyUGFja0tleShiaW5hcnlLZXkpO1xuICBjb25zdCBwbGFpbnRleHQgPSBkZWNyeXB0QXR0YWNobWVudChjaXBoZXJ0ZXh0LCBkZXJpdmVkS2V5KTtcblxuICByZXR1cm4gcGxhaW50ZXh0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZFN0aWNrZXIoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBwYWNrS2V5OiBzdHJpbmcsXG4gIHByb3RvOiBQcm90by5TdGlja2VyUGFjay5JU3RpY2tlcixcbiAgeyBlcGhlbWVyYWwgfTogeyBlcGhlbWVyYWw/OiBib29sZWFuIH0gPSB7fVxuKTogUHJvbWlzZTxPbWl0PFN0aWNrZXJGcm9tREJUeXBlLCAnaXNDb3Zlck9ubHknPj4ge1xuICBjb25zdCB7IGlkLCBlbW9qaSB9ID0gcHJvdG87XG4gIHN0cmljdEFzc2VydChpZCAhPT0gdW5kZWZpbmVkICYmIGlkICE9PSBudWxsLCBcIlN0aWNrZXIgaWQgY2FuJ3QgYmUgbnVsbFwiKTtcblxuICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gIGlmICghbWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZSEnKTtcbiAgfVxuXG4gIGNvbnN0IGNpcGhlcnRleHQgPSBhd2FpdCBtZXNzYWdpbmcuZ2V0U3RpY2tlcihwYWNrSWQsIGlkKTtcbiAgY29uc3QgcGxhaW50ZXh0ID0gZGVjcnlwdFN0aWNrZXIocGFja0tleSwgY2lwaGVydGV4dCk7XG5cbiAgY29uc3Qgc3RpY2tlciA9IGVwaGVtZXJhbFxuICAgID8gYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLnByb2Nlc3NOZXdFcGhlbWVyYWxTdGlja2VyKHBsYWludGV4dClcbiAgICA6IGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5wcm9jZXNzTmV3U3RpY2tlcihwbGFpbnRleHQpO1xuXG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgZW1vamk6IGRyb3BOdWxsKGVtb2ppKSxcbiAgICAuLi5zdGlja2VyLFxuICAgIHBhY2tJZCxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVQYWNrTWV0YWRhdGEoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBwYWNrS2V5OiBzdHJpbmcsXG4gIHsgbWVzc2FnZUlkIH06IHsgbWVzc2FnZUlkPzogc3RyaW5nIH0gPSB7fVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGV4aXN0aW5nID0gZ2V0U3RpY2tlclBhY2socGFja0lkKTtcbiAgaWYgKGV4aXN0aW5nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBzdGlja2VyUGFja0FkZGVkIH0gPSBnZXRSZWR1eFN0aWNrZXJBY3Rpb25zKCk7XG4gIGNvbnN0IHBhY2sgPSB7XG4gICAgLi4uU1RJQ0tFUl9QQUNLX0RFRkFVTFRTLFxuXG4gICAgaWQ6IHBhY2tJZCxcbiAgICBrZXk6IHBhY2tLZXksXG4gICAgc3RhdHVzOiAna25vd24nIGFzIGNvbnN0LFxuICB9O1xuICBzdGlja2VyUGFja0FkZGVkKHBhY2spO1xuXG4gIGF3YWl0IERhdGEuY3JlYXRlT3JVcGRhdGVTdGlja2VyUGFjayhwYWNrKTtcbiAgaWYgKG1lc3NhZ2VJZCkge1xuICAgIGF3YWl0IERhdGEuYWRkU3RpY2tlclBhY2tSZWZlcmVuY2UobWVzc2FnZUlkLCBwYWNrSWQpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVFcGhlbWVyYWxQYWNrKHBhY2tJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGV4aXN0aW5nID0gZ2V0U3RpY2tlclBhY2socGFja0lkKTtcbiAgc3RyaWN0QXNzZXJ0KGV4aXN0aW5nLCBgTm8gZXhpc3Rpbmcgc3RpY2tlciBwYWNrIHdpdGggaWQ6ICR7cGFja0lkfWApO1xuICBpZiAoXG4gICAgZXhpc3Rpbmcuc3RhdHVzICE9PSAnZXBoZW1lcmFsJyAmJlxuICAgICEoZXhpc3Rpbmcuc3RhdHVzID09PSAnZXJyb3InICYmIGV4aXN0aW5nLmF0dGVtcHRlZFN0YXR1cyA9PT0gJ2VwaGVtZXJhbCcpXG4gICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHsgcmVtb3ZlU3RpY2tlclBhY2sgfSA9IGdldFJlZHV4U3RpY2tlckFjdGlvbnMoKTtcbiAgcmVtb3ZlU3RpY2tlclBhY2socGFja0lkKTtcblxuICBjb25zdCBzdGlja2VycyA9IHZhbHVlcyhleGlzdGluZy5zdGlja2Vycyk7XG4gIGNvbnN0IHBhdGhzID0gc3RpY2tlcnMubWFwKHN0aWNrZXIgPT4gc3RpY2tlci5wYXRoKTtcbiAgYXdhaXQgcE1hcChwYXRocywgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZVRlbXBGaWxlLCB7XG4gICAgY29uY3VycmVuY3k6IDMsXG4gIH0pO1xuXG4gIC8vIFJlbW92ZSBpdCBmcm9tIGRhdGFiYXNlIGluIGNhc2UgaXQgbWFkZSBpdCB0aGVyZVxuICBhd2FpdCBEYXRhLmRlbGV0ZVN0aWNrZXJQYWNrKHBhY2tJZCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb3dubG9hZEVwaGVtZXJhbFBhY2soXG4gIHBhY2tJZDogc3RyaW5nLFxuICBwYWNrS2V5OiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IHN0aWNrZXJBZGRlZCwgc3RpY2tlclBhY2tBZGRlZCwgc3RpY2tlclBhY2tVcGRhdGVkIH0gPVxuICAgIGdldFJlZHV4U3RpY2tlckFjdGlvbnMoKTtcblxuICBjb25zdCBleGlzdGluZ1BhY2sgPSBnZXRTdGlja2VyUGFjayhwYWNrSWQpO1xuICBpZiAoXG4gICAgZXhpc3RpbmdQYWNrICYmXG4gICAgKGV4aXN0aW5nUGFjay5zdGF0dXMgPT09ICdkb3dubG9hZGVkJyB8fFxuICAgICAgZXhpc3RpbmdQYWNrLnN0YXR1cyA9PT0gJ2luc3RhbGxlZCcgfHxcbiAgICAgIGV4aXN0aW5nUGFjay5zdGF0dXMgPT09ICdwZW5kaW5nJylcbiAgKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgRXBoZW1lcmFsIGRvd25sb2FkIGZvciBwYWNrICR7cmVkYWN0UGFja0lkKFxuICAgICAgICBwYWNrSWRcbiAgICAgICl9IHJlcXVlc3RlZCwgd2UgYWxyZWFkeSBrbm93IGFib3V0IGl0LiBTa2lwcGluZy5gXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIC8vIFN5bmNocm9ub3VzIHBsYWNlaG9sZGVyIHRvIGhlbHAgd2l0aCByYWNlIGNvbmRpdGlvbnNcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHtcbiAgICAgIC4uLlNUSUNLRVJfUEFDS19ERUZBVUxUUyxcblxuICAgICAgaWQ6IHBhY2tJZCxcbiAgICAgIGtleTogcGFja0tleSxcbiAgICAgIHN0YXR1czogJ2VwaGVtZXJhbCcgYXMgY29uc3QsXG4gICAgfTtcbiAgICBzdGlja2VyUGFja0FkZGVkKHBsYWNlaG9sZGVyKTtcblxuICAgIGNvbnN0IHsgbWVzc2FnaW5nIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgICBpZiAoIW1lc3NhZ2luZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZSEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaXBoZXJ0ZXh0ID0gYXdhaXQgbWVzc2FnaW5nLmdldFN0aWNrZXJQYWNrTWFuaWZlc3QocGFja0lkKTtcbiAgICBjb25zdCBwbGFpbnRleHQgPSBkZWNyeXB0U3RpY2tlcihwYWNrS2V5LCBjaXBoZXJ0ZXh0KTtcbiAgICBjb25zdCBwcm90byA9IFByb3RvLlN0aWNrZXJQYWNrLmRlY29kZShwbGFpbnRleHQpO1xuICAgIGNvbnN0IGZpcnN0U3RpY2tlclByb3RvID0gcHJvdG8uc3RpY2tlcnMgPyBwcm90by5zdGlja2Vyc1swXSA6IG51bGw7XG4gICAgY29uc3Qgc3RpY2tlckNvdW50ID0gcHJvdG8uc3RpY2tlcnMubGVuZ3RoO1xuXG4gICAgY29uc3QgY292ZXJQcm90byA9IHByb3RvLmNvdmVyIHx8IGZpcnN0U3RpY2tlclByb3RvO1xuICAgIGNvbnN0IGNvdmVyU3RpY2tlcklkID0gY292ZXJQcm90byA/IGNvdmVyUHJvdG8uaWQgOiBudWxsO1xuXG4gICAgaWYgKCFjb3ZlclByb3RvIHx8ICFpc051bWJlcihjb3ZlclN0aWNrZXJJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFN0aWNrZXIgcGFjayAke3JlZGFjdFBhY2tJZChcbiAgICAgICAgICBwYWNrSWRcbiAgICAgICAgKX0gaXMgbWFsZm9ybWVkIC0gaXQgaGFzIG5vIGNvdmVyLCBhbmQgbm8gc3RpY2tlcnNgXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IG5vbkNvdmVyU3RpY2tlcnMgPSByZWplY3QoXG4gICAgICBwcm90by5zdGlja2VycyxcbiAgICAgIHN0aWNrZXIgPT4gIWlzTnVtYmVyKHN0aWNrZXIuaWQpIHx8IHN0aWNrZXIuaWQgPT09IGNvdmVyU3RpY2tlcklkXG4gICAgKTtcbiAgICBjb25zdCBjb3ZlclN0aWNrZXIgPSBwcm90by5zdGlja2Vycy5maWx0ZXIoXG4gICAgICBzdGlja2VyID0+IGlzTnVtYmVyKHN0aWNrZXIuaWQpICYmIHN0aWNrZXIuaWQgPT09IGNvdmVyU3RpY2tlcklkXG4gICAgKTtcbiAgICBpZiAoY292ZXJTdGlja2VyWzBdICYmICFjb3ZlclByb3RvLmVtb2ppKSB7XG4gICAgICBjb3ZlclByb3RvLmVtb2ppID0gY292ZXJTdGlja2VyWzBdLmVtb2ppO1xuICAgIH1cblxuICAgIGNvbnN0IGNvdmVySW5jbHVkZWRJbkxpc3QgPSBub25Db3ZlclN0aWNrZXJzLmxlbmd0aCA8IHN0aWNrZXJDb3VudDtcblxuICAgIGNvbnN0IHBhY2sgPSB7XG4gICAgICAuLi5TVElDS0VSX1BBQ0tfREVGQVVMVFMsXG5cbiAgICAgIGlkOiBwYWNrSWQsXG4gICAgICBrZXk6IHBhY2tLZXksXG4gICAgICBjb3ZlclN0aWNrZXJJZCxcbiAgICAgIHN0aWNrZXJDb3VudCxcbiAgICAgIHN0YXR1czogJ2VwaGVtZXJhbCcgYXMgY29uc3QsXG4gICAgICAuLi5waWNrKHByb3RvLCBbJ3RpdGxlJywgJ2F1dGhvciddKSxcbiAgICB9O1xuICAgIHN0aWNrZXJQYWNrQWRkZWQocGFjayk7XG5cbiAgICBjb25zdCBkb3dubG9hZFN0aWNrZXJKb2IgPSBhc3luYyAoXG4gICAgICBzdGlja2VyUHJvdG86IFByb3RvLlN0aWNrZXJQYWNrLklTdGlja2VyXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgICBsZXQgc3RpY2tlckluZm87XG4gICAgICB0cnkge1xuICAgICAgICBzdGlja2VySW5mbyA9IGF3YWl0IGRvd25sb2FkU3RpY2tlcihwYWNrSWQsIHBhY2tLZXksIHN0aWNrZXJQcm90bywge1xuICAgICAgICAgIGVwaGVtZXJhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgYGRvd25sb2FkRXBoZW1lcmFsUGFjay9kb3dubG9hZFN0aWNrZXJKb2IgZXJyb3I6ICR7RXJyb3JzLnRvTG9nRm9ybWF0KFxuICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICApfWBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3RpY2tlciA9IHtcbiAgICAgICAgLi4uc3RpY2tlckluZm8sXG4gICAgICAgIGlzQ292ZXJPbmx5OiAhY292ZXJJbmNsdWRlZEluTGlzdCAmJiBzdGlja2VySW5mby5pZCA9PT0gY292ZXJTdGlja2VySWQsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBzdGF0dXNDaGVjayA9IGdldFN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCk7XG4gICAgICBpZiAoc3RhdHVzQ2hlY2sgIT09ICdlcGhlbWVyYWwnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRXBoZW1lcmFsIGRvd25sb2FkIGZvciBwYWNrICR7cmVkYWN0UGFja0lkKFxuICAgICAgICAgICAgcGFja0lkXG4gICAgICAgICAgKX0gaW50ZXJydXB0ZWQgYnkgc3RhdHVzIGNoYW5nZS4gU3RhdHVzIGlzIG5vdyAke3N0YXR1c0NoZWNrfS5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHN0aWNrZXJBZGRlZChzdGlja2VyKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvLyBEb3dubG9hZCB0aGUgY292ZXIgZmlyc3RcbiAgICBhd2FpdCBkb3dubG9hZFN0aWNrZXJKb2IoY292ZXJQcm90byk7XG5cbiAgICAvLyBUaGVuIHRoZSByZXN0XG4gICAgY29uc3Qgam9iUmVzdWx0cyA9IGF3YWl0IHBNYXAobm9uQ292ZXJTdGlja2VycywgZG93bmxvYWRTdGlja2VySm9iLCB7XG4gICAgICBjb25jdXJyZW5jeTogMyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN1Y2Nlc3NmdWxTdGlja2VyQ291bnQgPSBqb2JSZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0pLmxlbmd0aDtcbiAgICBpZiAoc3VjY2Vzc2Z1bFN0aWNrZXJDb3VudCA9PT0gMCAmJiBub25Db3ZlclN0aWNrZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkb3dubG9hZEVwaGVtZXJhbFBhY2s6IEFsbCBzdGlja2VycyBmYWlsZWQgdG8gZG93bmxvYWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gQmVjYXVzZSB0aGUgdXNlciBjb3VsZCBpbnN0YWxsIHRoaXMgcGFjayB3aGlsZSB3ZSBhcmUgc3RpbGwgZG93bmxvYWRpbmcgdGhpc1xuICAgIC8vICAgZXBoZW1lcmFsIHBhY2ssIHdlIGRvbid0IHdhbnQgdG8gZ28gY2hhbmdlIGl0cyBzdGF0dXMgdW5sZXNzIHdlJ3JlIHN0aWxsIGluXG4gICAgLy8gICBlcGhlbWVyYWwgbW9kZS5cbiAgICBjb25zdCBzdGF0dXNDaGVjayA9IGdldFN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCk7XG4gICAgaWYgKHN0YXR1c0NoZWNrID09PSAnZXBoZW1lcmFsJykge1xuICAgICAgc3RpY2tlclBhY2tVcGRhdGVkKHBhY2tJZCwge1xuICAgICAgICBhdHRlbXB0ZWRTdGF0dXM6ICdlcGhlbWVyYWwnLFxuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICB9KTtcbiAgICB9XG4gICAgbG9nLmVycm9yKFxuICAgICAgYEVwaGVtZXJhbCBkb3dubG9hZCBlcnJvciBmb3Igc3RpY2tlciBwYWNrICR7cmVkYWN0UGFja0lkKHBhY2tJZCl9OmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIERvd25sb2FkU3RpY2tlclBhY2tPcHRpb25zID0gUmVhZG9ubHk8e1xuICBtZXNzYWdlSWQ/OiBzdHJpbmc7XG4gIGZyb21TeW5jPzogYm9vbGVhbjtcbiAgZnJvbVN0b3JhZ2VTZXJ2aWNlPzogYm9vbGVhbjtcbiAgZmluYWxTdGF0dXM/OiBTdGlja2VyUGFja1N0YXR1c1R5cGU7XG4gIHN1cHByZXNzRXJyb3I/OiBib29sZWFuO1xufT47XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb3dubG9hZFN0aWNrZXJQYWNrKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgcGFja0tleTogc3RyaW5nLFxuICBvcHRpb25zOiBEb3dubG9hZFN0aWNrZXJQYWNrT3B0aW9ucyA9IHt9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gVGhpcyB3aWxsIGVuc3VyZSB0aGF0IG9ubHkgb25lIGRvd25sb2FkIHByb2Nlc3MgaXMgaW4gcHJvZ3Jlc3MgYXQgYW55IGdpdmVuIHRpbWVcbiAgcmV0dXJuIGRvd25sb2FkUXVldWUuYWRkKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZG9Eb3dubG9hZFN0aWNrZXJQYWNrKHBhY2tJZCwgcGFja0tleSwgb3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ2RvRG93bmxvYWRTdGlja2VyUGFjayB0aHJldyBhbiBlcnJvcjonLFxuICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZG9Eb3dubG9hZFN0aWNrZXJQYWNrKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgcGFja0tleTogc3RyaW5nLFxuICB7XG4gICAgZmluYWxTdGF0dXMgPSAnZG93bmxvYWRlZCcsXG4gICAgbWVzc2FnZUlkLFxuICAgIGZyb21TeW5jID0gZmFsc2UsXG4gICAgZnJvbVN0b3JhZ2VTZXJ2aWNlID0gZmFsc2UsXG4gICAgc3VwcHJlc3NFcnJvciA9IGZhbHNlLFxuICB9OiBEb3dubG9hZFN0aWNrZXJQYWNrT3B0aW9uc1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHtcbiAgICBzdGlja2VyQWRkZWQsXG4gICAgc3RpY2tlclBhY2tBZGRlZCxcbiAgICBzdGlja2VyUGFja1VwZGF0ZWQsXG4gICAgaW5zdGFsbFN0aWNrZXJQYWNrLFxuICB9ID0gZ2V0UmVkdXhTdGlja2VyQWN0aW9ucygpO1xuXG4gIGlmIChmaW5hbFN0YXR1cyAhPT0gJ2Rvd25sb2FkZWQnICYmIGZpbmFsU3RhdHVzICE9PSAnaW5zdGFsbGVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBkb0Rvd25sb2FkU3RpY2tlclBhY2s6IGludmFsaWQgZmluYWxTdGF0dXMgb2YgJHtmaW5hbFN0YXR1c30gcmVxdWVzdGVkLmBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgZXhpc3RpbmcgPSBnZXRTdGlja2VyUGFjayhwYWNrSWQpO1xuICBpZiAoIWRvZXNQYWNrTmVlZERvd25sb2FkKGV4aXN0aW5nKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFdlIGRvbid0IGNvdW50IHRoaXMgYXMgYW4gYXR0ZW1wdCBpZiB3ZSdyZSBvZmZsaW5lXG4gIGNvbnN0IGF0dGVtcHRJbmNyZW1lbnQgPSBuYXZpZ2F0b3Iub25MaW5lID8gMSA6IDA7XG4gIGNvbnN0IGRvd25sb2FkQXR0ZW1wdHMgPVxuICAgIChleGlzdGluZyA/IGV4aXN0aW5nLmRvd25sb2FkQXR0ZW1wdHMgfHwgMCA6IDApICsgYXR0ZW1wdEluY3JlbWVudDtcbiAgaWYgKGRvd25sb2FkQXR0ZW1wdHMgPiAzKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgUmVmdXNpbmcgdG8gYXR0ZW1wdCBhbm90aGVyIGRvd25sb2FkIGZvciBwYWNrICR7cmVkYWN0UGFja0lkKFxuICAgICAgICBwYWNrSWRcbiAgICAgICl9LCBhdHRlbXB0IG51bWJlciAke2Rvd25sb2FkQXR0ZW1wdHN9YFxuICAgICk7XG5cbiAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3Rpbmcuc3RhdHVzICE9PSAnZXJyb3InKSB7XG4gICAgICBhd2FpdCBEYXRhLnVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCwgJ2Vycm9yJyk7XG4gICAgICBzdGlja2VyUGFja1VwZGF0ZWQoXG4gICAgICAgIHBhY2tJZCxcbiAgICAgICAge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgfSxcbiAgICAgICAgeyBzdXBwcmVzc0Vycm9yIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGNvdmVyUHJvdG86IFByb3RvLlN0aWNrZXJQYWNrLklTdGlja2VyIHwgdW5kZWZpbmVkO1xuICBsZXQgY292ZXJTdGlja2VySWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgbGV0IGNvdmVySW5jbHVkZWRJbkxpc3QgPSBmYWxzZTtcbiAgbGV0IG5vbkNvdmVyU3RpY2tlcnM6IEFycmF5PFByb3RvLlN0aWNrZXJQYWNrLklTdGlja2VyPiA9IFtdO1xuXG4gIHRyeSB7XG4gICAgLy8gU3luY2hyb25vdXMgcGxhY2Vob2xkZXIgdG8gaGVscCB3aXRoIHJhY2UgY29uZGl0aW9uc1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0ge1xuICAgICAgLi4uU1RJQ0tFUl9QQUNLX0RFRkFVTFRTLFxuXG4gICAgICBpZDogcGFja0lkLFxuICAgICAga2V5OiBwYWNrS2V5LFxuICAgICAgYXR0ZW1wdGVkU3RhdHVzOiBmaW5hbFN0YXR1cyxcbiAgICAgIGRvd25sb2FkQXR0ZW1wdHMsXG4gICAgICBzdGF0dXM6ICdwZW5kaW5nJyBhcyBjb25zdCxcbiAgICB9O1xuICAgIHN0aWNrZXJQYWNrQWRkZWQocGxhY2Vob2xkZXIpO1xuXG4gICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgIGlmICghbWVzc2FnaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGNpcGhlcnRleHQgPSBhd2FpdCBtZXNzYWdpbmcuZ2V0U3RpY2tlclBhY2tNYW5pZmVzdChwYWNrSWQpO1xuICAgIGNvbnN0IHBsYWludGV4dCA9IGRlY3J5cHRTdGlja2VyKHBhY2tLZXksIGNpcGhlcnRleHQpO1xuICAgIGNvbnN0IHByb3RvID0gUHJvdG8uU3RpY2tlclBhY2suZGVjb2RlKHBsYWludGV4dCk7XG4gICAgY29uc3QgZmlyc3RTdGlja2VyUHJvdG8gPSBwcm90by5zdGlja2VycyA/IHByb3RvLnN0aWNrZXJzWzBdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHN0aWNrZXJDb3VudCA9IHByb3RvLnN0aWNrZXJzLmxlbmd0aDtcblxuICAgIGNvdmVyUHJvdG8gPSBwcm90by5jb3ZlciB8fCBmaXJzdFN0aWNrZXJQcm90bztcbiAgICBjb3ZlclN0aWNrZXJJZCA9IGRyb3BOdWxsKGNvdmVyUHJvdG8gPyBjb3ZlclByb3RvLmlkIDogdW5kZWZpbmVkKTtcblxuICAgIGlmICghY292ZXJQcm90byB8fCAhaXNOdW1iZXIoY292ZXJTdGlja2VySWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBTdGlja2VyIHBhY2sgJHtyZWRhY3RQYWNrSWQoXG4gICAgICAgICAgcGFja0lkXG4gICAgICAgICl9IGlzIG1hbGZvcm1lZCAtIGl0IGhhcyBubyBjb3ZlciwgYW5kIG5vIHN0aWNrZXJzYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBub25Db3ZlclN0aWNrZXJzID0gcmVqZWN0KFxuICAgICAgcHJvdG8uc3RpY2tlcnMsXG4gICAgICBzdGlja2VyID0+ICFpc051bWJlcihzdGlja2VyLmlkKSB8fCBzdGlja2VyLmlkID09PSBjb3ZlclN0aWNrZXJJZFxuICAgICk7XG4gICAgY29uc3QgY292ZXJTdGlja2VyID0gcHJvdG8uc3RpY2tlcnMuZmlsdGVyKFxuICAgICAgc3RpY2tlciA9PiBpc051bWJlcihzdGlja2VyLmlkKSAmJiBzdGlja2VyLmlkID09PSBjb3ZlclN0aWNrZXJJZFxuICAgICk7XG4gICAgaWYgKGNvdmVyU3RpY2tlclswXSAmJiAhY292ZXJQcm90by5lbW9qaSkge1xuICAgICAgY292ZXJQcm90by5lbW9qaSA9IGNvdmVyU3RpY2tlclswXS5lbW9qaTtcbiAgICB9XG5cbiAgICBjb3ZlckluY2x1ZGVkSW5MaXN0ID0gbm9uQ292ZXJTdGlja2Vycy5sZW5ndGggPCBzdGlja2VyQ291bnQ7XG5cbiAgICAvLyBzdGF0dXMgY2FuIGJlOlxuICAgIC8vICAgLSAna25vd24nXG4gICAgLy8gICAtICdlcGhlbWVyYWwnIChzaG91bGQgbm90IGhpdCBkYXRhYmFzZSlcbiAgICAvLyAgIC0gJ3BlbmRpbmcnXG4gICAgLy8gICAtICdkb3dubG9hZGVkJ1xuICAgIC8vICAgLSAnZXJyb3InXG4gICAgLy8gICAtICdpbnN0YWxsZWQnXG4gICAgY29uc3QgcGFjazogU3RpY2tlclBhY2tUeXBlID0ge1xuICAgICAgaWQ6IHBhY2tJZCxcbiAgICAgIGtleTogcGFja0tleSxcbiAgICAgIGF0dGVtcHRlZFN0YXR1czogZmluYWxTdGF0dXMsXG4gICAgICBjb3ZlclN0aWNrZXJJZCxcbiAgICAgIGRvd25sb2FkQXR0ZW1wdHMsXG4gICAgICBzdGlja2VyQ291bnQsXG4gICAgICBzdGF0dXM6ICdwZW5kaW5nJyxcbiAgICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHN0aWNrZXJzOiB7fSxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6ICFmcm9tU3RvcmFnZVNlcnZpY2UsXG4gICAgICAuLi5waWNrKHByb3RvLCBbJ3RpdGxlJywgJ2F1dGhvciddKSxcbiAgICB9O1xuICAgIGF3YWl0IERhdGEuY3JlYXRlT3JVcGRhdGVTdGlja2VyUGFjayhwYWNrKTtcbiAgICBzdGlja2VyUGFja0FkZGVkKHBhY2spO1xuXG4gICAgaWYgKG1lc3NhZ2VJZCkge1xuICAgICAgYXdhaXQgRGF0YS5hZGRTdGlja2VyUGFja1JlZmVyZW5jZShtZXNzYWdlSWQsIHBhY2tJZCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBFcnJvciBkb3dubG9hZGluZyBtYW5pZmVzdCBmb3Igc3RpY2tlciBwYWNrICR7cmVkYWN0UGFja0lkKHBhY2tJZCl9OmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuXG4gICAgY29uc3QgcGFjayA9IHtcbiAgICAgIC4uLlNUSUNLRVJfUEFDS19ERUZBVUxUUyxcblxuICAgICAgaWQ6IHBhY2tJZCxcbiAgICAgIGtleTogcGFja0tleSxcbiAgICAgIGF0dGVtcHRlZFN0YXR1czogZmluYWxTdGF0dXMsXG4gICAgICBkb3dubG9hZEF0dGVtcHRzLFxuICAgICAgc3RhdHVzOiAnZXJyb3InIGFzIGNvbnN0LFxuICAgIH07XG4gICAgYXdhaXQgRGF0YS5jcmVhdGVPclVwZGF0ZVN0aWNrZXJQYWNrKHBhY2spO1xuICAgIHN0aWNrZXJQYWNrQWRkZWQocGFjaywgeyBzdXBwcmVzc0Vycm9yIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSBhIHNlcGFyYXRlIHRyeS9jYXRjaCBoZXJlIGJlY2F1c2Ugd2UncmUgc3RhcnRpbmcgdG8gZG93bmxvYWQgc3RpY2tlcnMgaGVyZVxuICAvLyAgIGFuZCB3ZSB3YW50IHRvIHByZXNlcnZlIG1vcmUgb2YgdGhlIHBhY2sgb24gYW4gZXJyb3IuXG4gIHRyeSB7XG4gICAgY29uc3QgZG93bmxvYWRTdGlja2VySm9iID0gYXN5bmMgKFxuICAgICAgc3RpY2tlclByb3RvOiBQcm90by5TdGlja2VyUGFjay5JU3RpY2tlclxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc3RpY2tlckluZm8gPSBhd2FpdCBkb3dubG9hZFN0aWNrZXIoXG4gICAgICAgICAgcGFja0lkLFxuICAgICAgICAgIHBhY2tLZXksXG4gICAgICAgICAgc3RpY2tlclByb3RvXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHN0aWNrZXIgPSB7XG4gICAgICAgICAgLi4uc3RpY2tlckluZm8sXG4gICAgICAgICAgaXNDb3Zlck9ubHk6XG4gICAgICAgICAgICAhY292ZXJJbmNsdWRlZEluTGlzdCAmJiBzdGlja2VySW5mby5pZCA9PT0gY292ZXJTdGlja2VySWQsXG4gICAgICAgIH07XG4gICAgICAgIGF3YWl0IERhdGEuY3JlYXRlT3JVcGRhdGVTdGlja2VyKHN0aWNrZXIpO1xuICAgICAgICBzdGlja2VyQWRkZWQoc3RpY2tlcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBkb0Rvd25sb2FkU3RpY2tlclBhY2svZG93bmxvYWRTdGlja2VySm9iIGVycm9yOiAke0Vycm9ycy50b0xvZ0Zvcm1hdChcbiAgICAgICAgICAgIGVycm9yXG4gICAgICAgICAgKX1gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRG93bmxvYWQgdGhlIGNvdmVyIGZpcnN0XG4gICAgYXdhaXQgZG93bmxvYWRTdGlja2VySm9iKGNvdmVyUHJvdG8pO1xuXG4gICAgLy8gVGhlbiB0aGUgcmVzdFxuICAgIGNvbnN0IGpvYlJlc3VsdHMgPSBhd2FpdCBwTWFwKG5vbkNvdmVyU3RpY2tlcnMsIGRvd25sb2FkU3RpY2tlckpvYiwge1xuICAgICAgY29uY3VycmVuY3k6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWNjZXNzZnVsU3RpY2tlckNvdW50ID0gam9iUmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtKS5sZW5ndGg7XG4gICAgaWYgKHN1Y2Nlc3NmdWxTdGlja2VyQ291bnQgPT09IDAgJiYgbm9uQ292ZXJTdGlja2Vycy5sZW5ndGggIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZG9Eb3dubG9hZFN0aWNrZXJQYWNrOiBBbGwgc3RpY2tlcnMgZmFpbGVkIHRvIGRvd25sb2FkJyk7XG4gICAgfVxuXG4gICAgLy8gQWxsb3cgZm9yIHRoZSB1c2VyIG1hcmtpbmcgdGhpcyBwYWNrIGFzIGluc3RhbGxlZCBpbiB0aGUgbWlkZGxlIG9mIG91ciBkb3dubG9hZDtcbiAgICAvLyAgIGRvbid0IG92ZXJ3cml0ZSB0aGF0IHN0YXR1cy5cbiAgICBjb25zdCBleGlzdGluZ1N0YXR1cyA9IGdldFN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCk7XG4gICAgaWYgKGV4aXN0aW5nU3RhdHVzID09PSAnaW5zdGFsbGVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChmaW5hbFN0YXR1cyA9PT0gJ2luc3RhbGxlZCcpIHtcbiAgICAgIGF3YWl0IGluc3RhbGxTdGlja2VyUGFjayhwYWNrSWQsIHBhY2tLZXksIHtcbiAgICAgICAgZnJvbVN5bmMsXG4gICAgICAgIGZyb21TdG9yYWdlU2VydmljZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNYXJrIHRoZSBwYWNrIGFzIGNvbXBsZXRlXG4gICAgICBhd2FpdCBEYXRhLnVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCwgZmluYWxTdGF0dXMpO1xuICAgICAgc3RpY2tlclBhY2tVcGRhdGVkKHBhY2tJZCwge1xuICAgICAgICBzdGF0dXM6IGZpbmFsU3RhdHVzLFxuICAgICAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBFcnJvciBkb3dubG9hZGluZyBzdGlja2VycyBmb3Igc3RpY2tlciBwYWNrICR7cmVkYWN0UGFja0lkKHBhY2tJZCl9OmAsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuXG4gICAgY29uc3QgZXJyb3JTdGF0dXMgPSAnZXJyb3InO1xuICAgIGF3YWl0IERhdGEudXBkYXRlU3RpY2tlclBhY2tTdGF0dXMocGFja0lkLCBlcnJvclN0YXR1cyk7XG4gICAgaWYgKHN0aWNrZXJQYWNrVXBkYXRlZCkge1xuICAgICAgc3RpY2tlclBhY2tVcGRhdGVkKFxuICAgICAgICBwYWNrSWQsXG4gICAgICAgIHtcbiAgICAgICAgICBhdHRlbXB0ZWRTdGF0dXM6IGZpbmFsU3RhdHVzLFxuICAgICAgICAgIHN0YXR1czogZXJyb3JTdGF0dXMsXG4gICAgICAgIH0sXG4gICAgICAgIHsgc3VwcHJlc3NFcnJvciB9XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RpY2tlclBhY2socGFja0lkOiBzdHJpbmcpOiBTdGlja2VyUGFja1R5cGUgfCB1bmRlZmluZWQge1xuICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKCk7XG4gIGNvbnN0IHsgc3RpY2tlcnMgfSA9IHN0YXRlO1xuICBjb25zdCB7IHBhY2tzIH0gPSBzdGlja2VycztcbiAgaWYgKCFwYWNrcykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gcGFja3NbcGFja0lkXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0aWNrZXJQYWNrU3RhdHVzKFxuICBwYWNrSWQ6IHN0cmluZ1xuKTogU3RpY2tlclBhY2tTdGF0dXNUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFjayA9IGdldFN0aWNrZXJQYWNrKHBhY2tJZCk7XG4gIGlmICghcGFjaykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gcGFjay5zdGF0dXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGlja2VyKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgc3RpY2tlcklkOiBudW1iZXJcbik6IFN0aWNrZXJGcm9tREJUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFjayA9IGdldFN0aWNrZXJQYWNrKHBhY2tJZCk7XG5cbiAgaWYgKCFwYWNrIHx8ICFwYWNrLnN0aWNrZXJzKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBwYWNrLnN0aWNrZXJzW3N0aWNrZXJJZF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb3B5U3RpY2tlclRvQXR0YWNobWVudHMoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBzdGlja2VySWQ6IG51bWJlclxuKTogUHJvbWlzZTxBdHRhY2htZW50VHlwZT4ge1xuICBjb25zdCBzdGlja2VyID0gZ2V0U3RpY2tlcihwYWNrSWQsIHN0aWNrZXJJZCk7XG4gIGlmICghc3RpY2tlcikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBjb3B5U3RpY2tlclRvQXR0YWNobWVudHM6IEZhaWxlZCB0byBmaW5kIHN0aWNrZXIgJHtwYWNrSWR9LyR7c3RpY2tlcklkfWBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgeyBwYXRoOiBzdGlja2VyUGF0aCB9ID0gc3RpY2tlcjtcbiAgY29uc3QgYWJzb2x1dGVQYXRoID1cbiAgICB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuZ2V0QWJzb2x1dGVTdGlja2VyUGF0aChzdGlja2VyUGF0aCk7XG4gIGNvbnN0IHsgcGF0aCwgc2l6ZSB9ID1cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMuY29weUludG9BdHRhY2htZW50c0RpcmVjdG9yeShhYnNvbHV0ZVBhdGgpO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnMucmVhZEF0dGFjaG1lbnREYXRhKHBhdGgpO1xuXG4gIGxldCBjb250ZW50VHlwZTogTUlNRVR5cGU7XG4gIGNvbnN0IHNuaWZmZWRNaW1lVHlwZSA9IHNuaWZmSW1hZ2VNaW1lVHlwZShkYXRhKTtcbiAgaWYgKHNuaWZmZWRNaW1lVHlwZSkge1xuICAgIGNvbnRlbnRUeXBlID0gc25pZmZlZE1pbWVUeXBlO1xuICB9IGVsc2Uge1xuICAgIGxvZy53YXJuKFxuICAgICAgJ2NvcHlTdGlja2VyVG9BdHRhY2htZW50czogVW5hYmxlIHRvIHNuaWZmIHN0aWNrZXIgTUlNRSB0eXBlOyBmYWxsaW5nIGJhY2sgdG8gV2ViUCdcbiAgICApO1xuICAgIGNvbnRlbnRUeXBlID0gSU1BR0VfV0VCUDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RpY2tlcixcbiAgICBjb250ZW50VHlwZSxcbiAgICBwYXRoLFxuICAgIHNpemUsXG4gIH07XG59XG5cbi8vIEluIHRoZSBjYXNlIHdoZXJlIGEgc3RpY2tlciBwYWNrIGlzIHVuaW5zdGFsbGVkLCB3ZSB3YW50IHRvIGRlbGV0ZSBpdCBpZiB0aGVyZSBhcmUgbm9cbi8vICAgbW9yZSByZWZlcmVuY2VzIGxlZnQuIFdlJ2xsIGRlbGV0ZSBhIG5vbmV4aXN0ZW50IHJlZmVyZW5jZSwgdGhlbiBjaGVjayBpZiB0aGVyZSBhcmVcbi8vICAgYW55IHJlZmVyZW5jZXMgbGVmdCwganVzdCBsaWtlIHVzdWFsLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1heWJlRGVsZXRlUGFjayhwYWNrSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBUaGlzIGhhcmRjb2RlZCBzdHJpbmcgaXMgZmluZSBiZWNhdXNlIG1lc3NhZ2UgaWRzIGFyZSBHVUlEc1xuICBhd2FpdCBkZWxldGVQYWNrUmVmZXJlbmNlKCdOT1QtVVNFRCcsIHBhY2tJZCk7XG59XG5cbi8vIFdlIGRvbid0IGdlbmVyYWxseSBkZWxldGUgcGFja3Mgb3V0cmlnaHQ7IHdlIGp1c3QgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlbSwgYW5kIGlmXG4vLyAgIHRoZSBsYXN0IHJlZmVyZW5jZSBpcyBkZWxldGVkLCB3ZSBmaW5hbGx5IHRoZW4gcmVtb3ZlIHRoZSBwYWNrIGl0c2VsZiBmcm9tIGRhdGFiYXNlXG4vLyAgIGFuZCBmcm9tIGRpc2suXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGFja1JlZmVyZW5jZShcbiAgbWVzc2FnZUlkOiBzdHJpbmcsXG4gIHBhY2tJZDogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgaXNCbGVzc2VkID0gQm9vbGVhbihCTEVTU0VEX1BBQ0tTW3BhY2tJZF0pO1xuICBpZiAoaXNCbGVzc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhpcyBjYWxsIHVzZXMgbG9ja2luZyB0byBwcmV2ZW50IHJhY2UgY29uZGl0aW9ucyB3aXRoIG90aGVyIHJlZmVyZW5jZSByZW1vdmFscyxcbiAgLy8gICBvciBhbiBpbmNvbWluZyBtZXNzYWdlIGNyZWF0aW5nIGEgbmV3IG1lc3NhZ2UtPnBhY2sgcmVmZXJlbmNlXG4gIGNvbnN0IHBhdGhzID0gYXdhaXQgRGF0YS5kZWxldGVTdGlja2VyUGFja1JlZmVyZW5jZShtZXNzYWdlSWQsIHBhY2tJZCk7XG5cbiAgLy8gSWYgd2UgZG9uJ3QgZ2V0IGEgbGlzdCBvZiBwYXRocyBiYWNrLCB0aGVuIHRoZSBzdGlja2VyIHBhY2sgd2FzIG5vdCBkZWxldGVkXG4gIGlmICghcGF0aHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IHJlbW92ZVN0aWNrZXJQYWNrIH0gPSBnZXRSZWR1eFN0aWNrZXJBY3Rpb25zKCk7XG4gIHJlbW92ZVN0aWNrZXJQYWNrKHBhY2tJZCk7XG5cbiAgYXdhaXQgcE1hcChwYXRocywgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZVN0aWNrZXIsIHtcbiAgICBjb25jdXJyZW5jeTogMyxcbiAgfSk7XG59XG5cbi8vIFRoZSBvdmVycmlkZTsgZG9lc24ndCBob25vciBvdXIgcmVmLWNvdW50aW5nIHNjaGVtZSAtIGp1c3QgZGVsZXRlcyBpdCBhbGwuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVQYWNrKHBhY2tJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGlzQmxlc3NlZCA9IEJvb2xlYW4oQkxFU1NFRF9QQUNLU1twYWNrSWRdKTtcbiAgaWYgKGlzQmxlc3NlZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFRoaXMgY2FsbCB1c2VzIGxvY2tpbmcgdG8gcHJldmVudCByYWNlIGNvbmRpdGlvbnMgd2l0aCBvdGhlciByZWZlcmVuY2UgcmVtb3ZhbHMsXG4gIC8vICAgb3IgYW4gaW5jb21pbmcgbWVzc2FnZSBjcmVhdGluZyBhIG5ldyBtZXNzYWdlLT5wYWNrIHJlZmVyZW5jZVxuICBjb25zdCBwYXRocyA9IGF3YWl0IERhdGEuZGVsZXRlU3RpY2tlclBhY2socGFja0lkKTtcblxuICBjb25zdCB7IHJlbW92ZVN0aWNrZXJQYWNrIH0gPSBnZXRSZWR1eFN0aWNrZXJBY3Rpb25zKCk7XG4gIHJlbW92ZVN0aWNrZXJQYWNrKHBhY2tJZCk7XG5cbiAgYXdhaXQgcE1hcChwYXRocywgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZVN0aWNrZXIsIHtcbiAgICBjb25jdXJyZW5jeTogMyxcbiAgfSk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBd0Q7QUFDeEQsbUJBQWlCO0FBQ2pCLHFCQUFrQjtBQUVsQixvQkFBNkI7QUFDN0Isc0JBQXlCO0FBQ3pCLHdCQUEyQjtBQUMzQixpQkFBOEI7QUFDOUIsWUFBdUI7QUFDdkIsYUFBd0I7QUFDeEIsb0JBQXdEO0FBQ3hELGtCQUEyQjtBQUUzQixnQ0FBbUM7QUFPbkMsb0JBQWlCO0FBQ2pCLHNCQUF1QztBQUN2QyxVQUFxQjtBQUVyQix1QkFBdUI7QUFnQ3ZCLE1BQU0sZ0JBQTZDO0FBQUEsRUFDakQsb0NBQW9DO0FBQUEsSUFDbEMsS0FBSztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGtDQUFrQztBQUFBLElBQ2hDLEtBQUs7QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxrQ0FBa0M7QUFBQSxJQUNoQyxLQUFLO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0Esa0NBQWtDO0FBQUEsSUFDaEMsS0FBSztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGtDQUFrQztBQUFBLElBQ2hDLEtBQUs7QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxrQ0FBa0M7QUFBQSxJQUNoQyxLQUFLO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUNGO0FBRUEs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
