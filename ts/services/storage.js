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
var storage_exports = {};
__export(storage_exports, {
  enableStorageService: () => enableStorageService,
  eraseAllStorageServiceState: () => eraseAllStorageServiceState,
  runStorageServiceSyncJob: () => runStorageServiceSyncJob,
  storageServiceUploadJob: () => storageServiceUploadJob
});
module.exports = __toCommonJS(storage_exports);
var import_lodash = require("lodash");
var import_p_map = __toESM(require("p-map"));
var import_long = __toESM(require("long"));
var import_Client = __toESM(require("../sql/Client"));
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var import_storageRecordOps = require("./storageRecordOps");
var import_storageConstants = require("./storageConstants");
var import_assert = require("../util/assert");
var import_dropNull = require("../util/dropNull");
var durations = __toESM(require("../util/durations"));
var import_BackOff = require("../util/BackOff");
var import_JobQueue = require("../util/JobQueue");
var import_sleep = require("../util/sleep");
var import_timestamp = require("../util/timestamp");
var import_ourProfileKey = require("./ourProfileKey");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var import_singleProtoJobQueue = require("../jobs/singleProtoJobQueue");
var Errors = __toESM(require("../types/errors"));
var import_SendMessage = __toESM(require("../textsecure/SendMessage"));
var import_Stories = require("../types/Stories");
const {
  eraseStorageServiceStateFromConversations,
  updateConversation,
  updateConversations
} = import_Client.default;
const uploadBucket = [];
const validRecordTypes = /* @__PURE__ */ new Set([
  0,
  1,
  2,
  3,
  4,
  5,
  6
]);
const backOff = new import_BackOff.BackOff([
  durations.SECOND,
  5 * durations.SECOND,
  30 * durations.SECOND,
  2 * durations.MINUTE,
  5 * durations.MINUTE
]);
const conflictBackOff = new import_BackOff.BackOff([
  durations.SECOND,
  5 * durations.SECOND,
  30 * durations.SECOND
]);
function redactStorageID(storageID, version, conversation) {
  const convoId = conversation ? ` ${conversation?.idForLogging()}` : "";
  return `${version ?? "?"}:${storageID.substring(0, 3)}${convoId}`;
}
function redactExtendedStorageID({
  storageID,
  storageVersion
}) {
  return redactStorageID(storageID, storageVersion);
}
function encryptRecord(storageID, storageRecord) {
  const storageItem = new import_protobuf.SignalService.StorageItem();
  const storageKeyBuffer = storageID ? Bytes.fromBase64(String(storageID)) : generateStorageID();
  const storageKeyBase64 = window.storage.get("storageKey");
  if (!storageKeyBase64) {
    throw new Error("No storage key");
  }
  const storageKey = Bytes.fromBase64(storageKeyBase64);
  const storageItemKey = (0, import_Crypto.deriveStorageItemKey)(storageKey, Bytes.toBase64(storageKeyBuffer));
  const encryptedRecord = (0, import_Crypto.encryptProfile)(import_protobuf.SignalService.StorageRecord.encode(storageRecord).finish(), storageItemKey);
  storageItem.key = storageKeyBuffer;
  storageItem.value = encryptedRecord;
  return storageItem;
}
function generateStorageID() {
  return (0, import_Crypto.getRandomBytes)(16);
}
async function generateManifest(version, previousManifest, isNewManifest = false) {
  log.info(`storageService.upload(${version}): generating manifest new=${isNewManifest}`);
  await window.ConversationController.checkForConflicts();
  const ITEM_TYPE = import_protobuf.SignalService.ManifestRecord.Identifier.Type;
  const postUploadUpdateFunctions = [];
  const insertKeys = [];
  const deleteKeys = [];
  const manifestRecordKeys = /* @__PURE__ */ new Set();
  const newItems = /* @__PURE__ */ new Set();
  function processStorageRecord({
    conversation,
    currentStorageID,
    currentStorageVersion,
    identifierType,
    storageNeedsSync,
    storageRecord
  }) {
    const identifier = new import_protobuf.SignalService.ManifestRecord.Identifier();
    identifier.type = identifierType;
    const currentRedactedID = currentStorageID ? redactStorageID(currentStorageID, currentStorageVersion) : void 0;
    const isNewItem = isNewManifest || storageNeedsSync || !currentStorageID;
    const storageID = isNewItem ? Bytes.toBase64(generateStorageID()) : currentStorageID;
    let storageItem;
    try {
      storageItem = encryptRecord(storageID, storageRecord);
    } catch (err) {
      log.error(`storageService.upload(${version}): encrypt record failed:`, Errors.toLogFormat(err));
      throw err;
    }
    identifier.raw = storageItem.key;
    if (isNewItem) {
      newItems.add(storageItem);
      insertKeys.push(storageID);
      const newRedactedID = redactStorageID(storageID, version, conversation);
      if (currentStorageID) {
        log.info(`storageService.upload(${version}): updating from=${currentRedactedID} to=${newRedactedID}`);
        deleteKeys.push(Bytes.fromBase64(currentStorageID));
      } else {
        log.info(`storageService.upload(${version}): adding key=${newRedactedID}`);
      }
    }
    manifestRecordKeys.add(identifier);
    return {
      isNewItem,
      storageID
    };
  }
  const conversations = window.getConversations();
  for (let i = 0; i < conversations.length; i += 1) {
    const conversation = conversations.models[i];
    let identifierType;
    let storageRecord;
    const conversationType = (0, import_whatTypeOfConversation.typeofConversation)(conversation.attributes);
    if (conversationType === import_whatTypeOfConversation.ConversationTypes.Me) {
      storageRecord = new import_protobuf.SignalService.StorageRecord();
      storageRecord.account = await (0, import_storageRecordOps.toAccountRecord)(conversation);
      identifierType = ITEM_TYPE.ACCOUNT;
    } else if (conversationType === import_whatTypeOfConversation.ConversationTypes.Direct) {
      if (!conversation.get("uuid")) {
        continue;
      }
      const validationError = conversation.validate();
      if (validationError) {
        const droppedID = conversation.get("storageID");
        const droppedVersion = conversation.get("storageVersion");
        if (!droppedID) {
          continue;
        }
        const recordID = redactStorageID(droppedID, droppedVersion, conversation);
        log.warn(`storageService.generateManifest(${version}): skipping contact=${recordID} due to local validation error=${validationError}`);
        conversation.unset("storageID");
        deleteKeys.push(Bytes.fromBase64(droppedID));
        continue;
      }
      storageRecord = new import_protobuf.SignalService.StorageRecord();
      storageRecord.contact = await (0, import_storageRecordOps.toContactRecord)(conversation);
      identifierType = ITEM_TYPE.CONTACT;
    } else if (conversationType === import_whatTypeOfConversation.ConversationTypes.GroupV2) {
      storageRecord = new import_protobuf.SignalService.StorageRecord();
      storageRecord.groupV2 = (0, import_storageRecordOps.toGroupV2Record)(conversation);
      identifierType = ITEM_TYPE.GROUPV2;
    } else if (conversationType === import_whatTypeOfConversation.ConversationTypes.GroupV1) {
      storageRecord = new import_protobuf.SignalService.StorageRecord();
      storageRecord.groupV1 = (0, import_storageRecordOps.toGroupV1Record)(conversation);
      identifierType = ITEM_TYPE.GROUPV1;
    } else {
      log.warn(`storageService.upload(${version}): unknown conversation=${conversation.idForLogging()}`);
    }
    if (!storageRecord || !identifierType) {
      continue;
    }
    const { isNewItem, storageID } = processStorageRecord({
      conversation,
      currentStorageID: conversation.get("storageID"),
      currentStorageVersion: conversation.get("storageVersion"),
      identifierType,
      storageNeedsSync: Boolean(conversation.get("needsStorageServiceSync")),
      storageRecord
    });
    if (isNewItem) {
      postUploadUpdateFunctions.push(() => {
        conversation.set({
          needsStorageServiceSync: false,
          storageVersion: version,
          storageID
        });
        updateConversation(conversation.attributes);
      });
    }
  }
  const {
    storyDistributionLists,
    installedStickerPacks,
    uninstalledStickerPacks
  } = await getNonConversationRecords();
  log.info(`storageService.upload(${version}): adding storyDistributionLists=${storyDistributionLists.length}`);
  storyDistributionLists.forEach((storyDistributionList) => {
    const storageRecord = new import_protobuf.SignalService.StorageRecord();
    storageRecord.storyDistributionList = (0, import_storageRecordOps.toStoryDistributionListRecord)(storyDistributionList);
    const { isNewItem, storageID } = processStorageRecord({
      currentStorageID: storyDistributionList.storageID,
      currentStorageVersion: storyDistributionList.storageVersion,
      identifierType: ITEM_TYPE.STORY_DISTRIBUTION_LIST,
      storageNeedsSync: storyDistributionList.storageNeedsSync,
      storageRecord
    });
    if (isNewItem) {
      postUploadUpdateFunctions.push(() => {
        import_Client.default.modifyStoryDistribution({
          ...storyDistributionList,
          storageID,
          storageVersion: version,
          storageNeedsSync: false
        });
      });
    }
  });
  log.info(`storageService.upload(${version}): adding uninstalled stickerPacks=${uninstalledStickerPacks.length}`);
  const uninstalledStickerPackIds = /* @__PURE__ */ new Set();
  uninstalledStickerPacks.forEach((stickerPack) => {
    const storageRecord = new import_protobuf.SignalService.StorageRecord();
    storageRecord.stickerPack = (0, import_storageRecordOps.toStickerPackRecord)(stickerPack);
    uninstalledStickerPackIds.add(stickerPack.id);
    const { isNewItem, storageID } = processStorageRecord({
      currentStorageID: stickerPack.storageID,
      currentStorageVersion: stickerPack.storageVersion,
      identifierType: ITEM_TYPE.STICKER_PACK,
      storageNeedsSync: stickerPack.storageNeedsSync,
      storageRecord
    });
    if (isNewItem) {
      postUploadUpdateFunctions.push(() => {
        import_Client.default.addUninstalledStickerPack({
          ...stickerPack,
          storageID,
          storageVersion: version,
          storageNeedsSync: false
        });
      });
    }
  });
  log.info(`storageService.upload(${version}): adding installed stickerPacks=${installedStickerPacks.length}`);
  installedStickerPacks.forEach((stickerPack) => {
    if (uninstalledStickerPackIds.has(stickerPack.id)) {
      log.error(`storageService.upload(${version}): sticker pack ${stickerPack.id} is both installed and uninstalled`);
      window.reduxActions.stickers.uninstallStickerPack(stickerPack.id, stickerPack.key, { fromSync: true });
      return;
    }
    const storageRecord = new import_protobuf.SignalService.StorageRecord();
    storageRecord.stickerPack = (0, import_storageRecordOps.toStickerPackRecord)(stickerPack);
    const { isNewItem, storageID } = processStorageRecord({
      currentStorageID: stickerPack.storageID,
      currentStorageVersion: stickerPack.storageVersion,
      identifierType: ITEM_TYPE.STICKER_PACK,
      storageNeedsSync: stickerPack.storageNeedsSync,
      storageRecord
    });
    if (isNewItem) {
      postUploadUpdateFunctions.push(() => {
        import_Client.default.createOrUpdateStickerPack({
          ...stickerPack,
          storageID,
          storageVersion: version,
          storageNeedsSync: false
        });
      });
    }
  });
  const unknownRecordsArray = (window.storage.get("storage-service-unknown-records") || []).filter((record) => !validRecordTypes.has(record.itemType));
  const redactedUnknowns = unknownRecordsArray.map(redactExtendedStorageID);
  log.info(`storageService.upload(${version}): adding unknown records=${JSON.stringify(redactedUnknowns)} count=${redactedUnknowns.length}`);
  unknownRecordsArray.forEach((record) => {
    const identifier = new import_protobuf.SignalService.ManifestRecord.Identifier();
    identifier.type = record.itemType;
    identifier.raw = Bytes.fromBase64(record.storageID);
    manifestRecordKeys.add(identifier);
  });
  const recordsWithErrors = window.storage.get("storage-service-error-records", new Array());
  const redactedErrors = recordsWithErrors.map(redactExtendedStorageID);
  log.info(`storageService.upload(${version}): adding error records=${JSON.stringify(redactedErrors)} count=${redactedErrors.length}`);
  recordsWithErrors.forEach((record) => {
    const identifier = new import_protobuf.SignalService.ManifestRecord.Identifier();
    identifier.type = record.itemType;
    identifier.raw = Bytes.fromBase64(record.storageID);
    manifestRecordKeys.add(identifier);
  });
  const storedPendingDeletes = window.storage.get("storage-service-pending-deletes", []);
  const redactedPendingDeletes = storedPendingDeletes.map(redactExtendedStorageID);
  log.info(`storageService.upload(${version}): deleting extra keys=${JSON.stringify(redactedPendingDeletes)} count=${redactedPendingDeletes.length}`);
  for (const { storageID } of storedPendingDeletes) {
    deleteKeys.push(Bytes.fromBase64(storageID));
  }
  const rawDuplicates = /* @__PURE__ */ new Set();
  const typeRawDuplicates = /* @__PURE__ */ new Set();
  let hasAccountType = false;
  manifestRecordKeys.forEach((identifier) => {
    (0, import_assert.strictAssert)(identifier.raw, "manifest record key without raw identifier");
    const storageID = Bytes.toBase64(identifier.raw);
    const typeAndRaw = `${identifier.type}+${storageID}`;
    if (rawDuplicates.has(identifier.raw) || typeRawDuplicates.has(typeAndRaw)) {
      log.warn(`storageService.upload(${version}): removing from duplicate item from the manifest`, redactStorageID(storageID), identifier.type);
      manifestRecordKeys.delete(identifier);
    }
    rawDuplicates.add(identifier.raw);
    typeRawDuplicates.add(typeAndRaw);
    const hasDeleteKey = deleteKeys.find((key) => Bytes.toBase64(key) === storageID);
    if (hasDeleteKey) {
      log.warn(`storageService.upload(${version}): removing key which has been deleted`, redactStorageID(storageID), identifier.type);
      manifestRecordKeys.delete(identifier);
    }
    if (identifier.type === ITEM_TYPE.ACCOUNT) {
      if (hasAccountType) {
        log.warn(`storageService.upload(${version}): removing duplicate account`, redactStorageID(storageID));
        manifestRecordKeys.delete(identifier);
      }
      hasAccountType = true;
    }
  });
  rawDuplicates.clear();
  typeRawDuplicates.clear();
  const storageKeyDuplicates = /* @__PURE__ */ new Set();
  newItems.forEach((storageItem) => {
    (0, import_assert.strictAssert)(storageItem.key, "New storage item without key");
    const storageID = Bytes.toBase64(storageItem.key);
    if (storageKeyDuplicates.has(storageID)) {
      log.warn(`storageService.upload(${version}): removing duplicate identifier from inserts`, redactStorageID(storageID));
      newItems.delete(storageItem);
    }
    storageKeyDuplicates.add(storageID);
  });
  storageKeyDuplicates.clear();
  if (previousManifest) {
    const pendingInserts = /* @__PURE__ */ new Set();
    const pendingDeletes = /* @__PURE__ */ new Set();
    const remoteKeys = /* @__PURE__ */ new Set();
    (previousManifest.keys ?? []).forEach((identifier) => {
      (0, import_assert.strictAssert)(identifier.raw, "Identifier without raw field");
      const storageID = Bytes.toBase64(identifier.raw);
      remoteKeys.add(storageID);
    });
    const localKeys = /* @__PURE__ */ new Set();
    manifestRecordKeys.forEach((identifier) => {
      (0, import_assert.strictAssert)(identifier.raw, "Identifier without raw field");
      const storageID = Bytes.toBase64(identifier.raw);
      localKeys.add(storageID);
      if (!remoteKeys.has(storageID)) {
        pendingInserts.add(storageID);
      }
    });
    remoteKeys.forEach((storageID) => {
      if (!localKeys.has(storageID)) {
        pendingDeletes.add(storageID);
      }
    });
    if (deleteKeys.length !== pendingDeletes.size) {
      const localDeletes = deleteKeys.map((key) => redactStorageID(Bytes.toBase64(key)));
      const remoteDeletes = [];
      pendingDeletes.forEach((id) => remoteDeletes.push(redactStorageID(id)));
      log.error(`storageService.upload(${version}): delete key sizes do not match`, "local", localDeletes.join(","), "remote", remoteDeletes.join(","));
      throw new Error("invalid write delete keys length do not match");
    }
    if (newItems.size !== pendingInserts.size) {
      throw new Error("invalid write insert items length do not match");
    }
    deleteKeys.forEach((key) => {
      const storageID = Bytes.toBase64(key);
      if (!pendingDeletes.has(storageID)) {
        throw new Error("invalid write delete key missing from pending deletes");
      }
    });
    insertKeys.forEach((storageID) => {
      if (!pendingInserts.has(storageID)) {
        throw new Error("invalid write insert key missing from pending inserts");
      }
    });
  }
  const manifestRecord = new import_protobuf.SignalService.ManifestRecord();
  manifestRecord.version = import_long.default.fromNumber(version);
  manifestRecord.sourceDevice = window.storage.user.getDeviceId() ?? 0;
  manifestRecord.keys = Array.from(manifestRecordKeys);
  const storageKeyBase64 = window.storage.get("storageKey");
  if (!storageKeyBase64) {
    throw new Error("No storage key");
  }
  const storageKey = Bytes.fromBase64(storageKeyBase64);
  const storageManifestKey = (0, import_Crypto.deriveStorageManifestKey)(storageKey, import_long.default.fromNumber(version));
  const encryptedManifest = (0, import_Crypto.encryptProfile)(import_protobuf.SignalService.ManifestRecord.encode(manifestRecord).finish(), storageManifestKey);
  const storageManifest = new import_protobuf.SignalService.StorageManifest();
  storageManifest.version = manifestRecord.version;
  storageManifest.value = encryptedManifest;
  return {
    postUploadUpdateFunctions,
    deleteKeys,
    newItems,
    storageManifest
  };
}
async function uploadManifest(version, {
  postUploadUpdateFunctions,
  deleteKeys,
  newItems,
  storageManifest
}) {
  if (!window.textsecure.messaging) {
    throw new Error("storageService.uploadManifest: We are offline!");
  }
  if (newItems.size === 0 && deleteKeys.length === 0) {
    log.info(`storageService.upload(${version}): nothing to upload`);
    return;
  }
  const credentials = window.storage.get("storageCredentials");
  try {
    log.info(`storageService.upload(${version}): inserting=${newItems.size} deleting=${deleteKeys.length}`);
    const writeOperation = new import_protobuf.SignalService.WriteOperation();
    writeOperation.manifest = storageManifest;
    writeOperation.insertItem = Array.from(newItems);
    writeOperation.deleteKey = deleteKeys;
    await window.textsecure.messaging.modifyStorageRecords(import_protobuf.SignalService.WriteOperation.encode(writeOperation).finish(), {
      credentials
    });
    log.info(`storageService.upload(${version}): upload complete, updating items=${postUploadUpdateFunctions.length}`);
    postUploadUpdateFunctions.forEach((fn) => fn());
  } catch (err) {
    log.error(`storageService.upload(${version}): failed!`, Errors.toLogFormat(err));
    if (err.code === 409) {
      if (conflictBackOff.isFull()) {
        log.error(`storageService.upload(${version}): exceeded maximum consecutive conflicts`);
        return;
      }
      log.info(`storageService.upload(${version}): conflict found with version=${version}, running sync job times=${conflictBackOff.getIndex()}`);
      throw err;
    }
    throw err;
  }
  log.info(`storageService.upload(${version}): setting new manifestVersion`);
  window.storage.put("manifestVersion", version);
  conflictBackOff.reset();
  backOff.reset();
  try {
    await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getFetchManifestSyncMessage());
  } catch (error) {
    log.error(`storageService.upload(${version}): Failed to queue sync message`, Errors.toLogFormat(error));
  }
}
async function stopStorageServiceSync(reason) {
  log.warn("storageService.stopStorageServiceSync", Errors.toLogFormat(reason));
  await window.storage.remove("storageKey");
  if (backOff.isFull()) {
    log.warn("storageService.stopStorageServiceSync: too many consecutive stops");
    return;
  }
  await (0, import_sleep.sleep)(backOff.getAndIncrement());
  log.info("storageService.stopStorageServiceSync: requesting new keys");
  setTimeout(async () => {
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("stopStorageServiceSync: We are primary device; not sending key sync request");
      return;
    }
    try {
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestKeySyncMessage());
    } catch (error) {
      log.error("storageService.stopStorageServiceSync: Failed to queue sync message", Errors.toLogFormat(error));
    }
  });
}
async function createNewManifest() {
  log.info("storageService.createNewManifest: creating new manifest");
  const version = window.storage.get("manifestVersion", 0);
  const { postUploadUpdateFunctions, newItems, storageManifest } = await generateManifest(version, void 0, true);
  await uploadManifest(version, {
    postUploadUpdateFunctions,
    deleteKeys: [],
    newItems,
    storageManifest
  });
}
async function decryptManifest(encryptedManifest) {
  const { version, value } = encryptedManifest;
  const storageKeyBase64 = window.storage.get("storageKey");
  if (!storageKeyBase64) {
    throw new Error("No storage key");
  }
  const storageKey = Bytes.fromBase64(storageKeyBase64);
  const storageManifestKey = (0, import_Crypto.deriveStorageManifestKey)(storageKey, (0, import_dropNull.dropNull)(version));
  (0, import_assert.strictAssert)(value, "StorageManifest has no value field");
  const decryptedManifest = (0, import_Crypto.decryptProfile)(value, storageManifestKey);
  return import_protobuf.SignalService.ManifestRecord.decode(decryptedManifest);
}
async function fetchManifest(manifestVersion) {
  log.info("storageService.sync: fetch start");
  if (!window.textsecure.messaging) {
    throw new Error("storageService.sync: we are offline!");
  }
  try {
    const credentials = await window.textsecure.messaging.getStorageCredentials();
    window.storage.put("storageCredentials", credentials);
    const manifestBinary = await window.textsecure.messaging.getStorageManifest({
      credentials,
      greaterThanVersion: manifestVersion
    });
    const encryptedManifest = import_protobuf.SignalService.StorageManifest.decode(manifestBinary);
    try {
      return decryptManifest(encryptedManifest);
    } catch (err) {
      await stopStorageServiceSync(err);
      return;
    }
  } catch (err) {
    if (err.code === 204) {
      log.info("storageService.sync: no newer manifest, ok");
      return;
    }
    log.error("storageService.sync: failed!", Errors.toLogFormat(err));
    if (err.code === 404) {
      await createNewManifest();
      return;
    }
    throw err;
  }
}
async function mergeRecord(storageVersion, itemToMerge) {
  const { itemType, storageID, storageRecord } = itemToMerge;
  const ITEM_TYPE = import_protobuf.SignalService.ManifestRecord.Identifier.Type;
  let mergeResult = { hasConflict: false, details: [] };
  let isUnsupported = false;
  let hasError = false;
  let updatedConversations = new Array();
  const needProfileFetch = new Array();
  try {
    if (itemType === ITEM_TYPE.UNKNOWN) {
      log.warn("storageService.mergeRecord: Unknown item type", storageID);
    } else if (itemType === ITEM_TYPE.CONTACT && storageRecord.contact) {
      mergeResult = await (0, import_storageRecordOps.mergeContactRecord)(storageID, storageVersion, storageRecord.contact);
    } else if (itemType === ITEM_TYPE.GROUPV1 && storageRecord.groupV1) {
      mergeResult = await (0, import_storageRecordOps.mergeGroupV1Record)(storageID, storageVersion, storageRecord.groupV1);
    } else if (itemType === ITEM_TYPE.GROUPV2 && storageRecord.groupV2) {
      mergeResult = await (0, import_storageRecordOps.mergeGroupV2Record)(storageID, storageVersion, storageRecord.groupV2);
    } else if (itemType === ITEM_TYPE.ACCOUNT && storageRecord.account) {
      mergeResult = await (0, import_storageRecordOps.mergeAccountRecord)(storageID, storageVersion, storageRecord.account);
    } else if (itemType === ITEM_TYPE.STORY_DISTRIBUTION_LIST && storageRecord.storyDistributionList) {
      mergeResult = await (0, import_storageRecordOps.mergeStoryDistributionListRecord)(storageID, storageVersion, storageRecord.storyDistributionList);
    } else if (itemType === ITEM_TYPE.STICKER_PACK && storageRecord.stickerPack) {
      mergeResult = await (0, import_storageRecordOps.mergeStickerPackRecord)(storageID, storageVersion, storageRecord.stickerPack);
    } else {
      isUnsupported = true;
      log.warn(`storageService.merge(${redactStorageID(storageID, storageVersion)}): unknown item type=${itemType}`);
    }
    const redactedID = redactStorageID(storageID, storageVersion, mergeResult.conversation);
    const oldID = mergeResult.oldStorageID ? redactStorageID(mergeResult.oldStorageID, mergeResult.oldStorageVersion) : "?";
    updatedConversations = [
      ...updatedConversations,
      ...mergeResult.updatedConversations ?? []
    ];
    if (mergeResult.needsProfileFetch) {
      (0, import_assert.strictAssert)(mergeResult.conversation, "needsProfileFetch, but no convo");
      needProfileFetch.push(mergeResult.conversation);
    }
    log.info(`storageService.merge(${redactedID}): merged item type=${itemType} oldID=${oldID} conflict=${mergeResult.hasConflict} shouldDrop=${Boolean(mergeResult.shouldDrop)} details=${JSON.stringify(mergeResult.details)}`);
  } catch (err) {
    hasError = true;
    const redactedID = redactStorageID(storageID, storageVersion);
    log.error(`storageService.merge(${redactedID}): error with item type=${itemType} details=${Errors.toLogFormat(err)}`);
  }
  return {
    hasConflict: mergeResult.hasConflict,
    shouldDrop: Boolean(mergeResult.shouldDrop),
    hasError,
    isUnsupported,
    itemType,
    storageID,
    updatedConversations,
    needProfileFetch
  };
}
async function getNonConversationRecords() {
  const [
    storyDistributionLists,
    uninstalledStickerPacks,
    installedStickerPacks
  ] = await Promise.all([
    import_Client.default.getAllStoryDistributionsWithMembers(),
    import_Client.default.getUninstalledStickerPacks(),
    import_Client.default.getInstalledStickerPacks()
  ]);
  return {
    storyDistributionLists,
    uninstalledStickerPacks,
    installedStickerPacks
  };
}
async function processManifest(manifest, version) {
  if (!window.textsecure.messaging) {
    throw new Error("storageService.processManifest: We are offline!");
  }
  const remoteKeysTypeMap = /* @__PURE__ */ new Map();
  (manifest.keys || []).forEach(({ raw, type }) => {
    (0, import_assert.strictAssert)(raw, "Identifier without raw field");
    remoteKeysTypeMap.set(Bytes.toBase64(raw), type);
  });
  const remoteKeys = new Set(remoteKeysTypeMap.keys());
  const localVersions = /* @__PURE__ */ new Map();
  let localRecordCount = 0;
  const conversations = window.getConversations();
  conversations.forEach((conversation) => {
    const storageID = conversation.get("storageID");
    if (storageID) {
      localVersions.set(storageID, conversation.get("storageVersion"));
    }
  });
  localRecordCount += conversations.length;
  {
    const {
      storyDistributionLists,
      installedStickerPacks,
      uninstalledStickerPacks
    } = await getNonConversationRecords();
    const collectLocalKeysFromFields = /* @__PURE__ */ __name(({
      storageID,
      storageVersion
    }) => {
      if (storageID) {
        localVersions.set(storageID, storageVersion);
      }
    }, "collectLocalKeysFromFields");
    storyDistributionLists.forEach(collectLocalKeysFromFields);
    localRecordCount += storyDistributionLists.length;
    uninstalledStickerPacks.forEach(collectLocalKeysFromFields);
    localRecordCount += uninstalledStickerPacks.length;
    installedStickerPacks.forEach(collectLocalKeysFromFields);
    localRecordCount += installedStickerPacks.length;
  }
  const unknownRecordsArray = window.storage.get("storage-service-unknown-records") || [];
  const stillUnknown = unknownRecordsArray.filter((record) => {
    if (!validRecordTypes.has(record.itemType)) {
      localVersions.set(record.storageID, record.storageVersion);
      return false;
    }
    return true;
  });
  const remoteOnlySet = /* @__PURE__ */ new Set();
  for (const key of remoteKeys) {
    if (!localVersions.has(key)) {
      remoteOnlySet.add(key);
    }
  }
  const localOnlySet = /* @__PURE__ */ new Set();
  for (const key of localVersions.keys()) {
    if (!remoteKeys.has(key)) {
      localOnlySet.add(key);
    }
  }
  const redactedRemoteOnly = Array.from(remoteOnlySet).map((id) => redactStorageID(id, version));
  const redactedLocalOnly = Array.from(localOnlySet).map((id) => redactStorageID(id, localVersions.get(id)));
  log.info(`storageService.process(${version}): localRecords=${localRecordCount} localKeys=${localVersions.size} unknownKeys=${stillUnknown.length} remoteKeys=${remoteKeys.size}`);
  log.info(`storageService.process(${version}): remoteOnlyCount=${remoteOnlySet.size} remoteOnlyKeys=${JSON.stringify(redactedRemoteOnly)}`);
  log.info(`storageService.process(${version}): localOnlyCount=${localOnlySet.size} localOnlyKeys=${JSON.stringify(redactedLocalOnly)}`);
  const remoteOnlyRecords = /* @__PURE__ */ new Map();
  remoteOnlySet.forEach((storageID) => {
    remoteOnlyRecords.set(storageID, {
      storageID,
      itemType: remoteKeysTypeMap.get(storageID)
    });
  });
  let conflictCount = 0;
  if (remoteOnlyRecords.size) {
    conflictCount = await processRemoteRecords(version, remoteOnlyRecords);
  }
  window.getConversations().forEach((conversation) => {
    const storageID = conversation.get("storageID");
    if (storageID && !remoteKeys.has(storageID)) {
      const storageVersion = conversation.get("storageVersion");
      const missingKey = redactStorageID(storageID, storageVersion, conversation);
      log.info(`storageService.process(${version}): localKey=${missingKey} was not in remote manifest`);
      conversation.unset("storageID");
      conversation.unset("storageVersion");
      updateConversation(conversation.attributes);
    }
  });
  {
    const {
      storyDistributionLists,
      installedStickerPacks,
      uninstalledStickerPacks
    } = await getNonConversationRecords();
    uninstalledStickerPacks.forEach((stickerPack) => {
      const { storageID, storageVersion } = stickerPack;
      if (!storageID || remoteKeys.has(storageID)) {
        return;
      }
      const missingKey = redactStorageID(storageID, storageVersion);
      log.info(`storageService.process(${version}): localKey=${missingKey} was not in remote manifest`);
      import_Client.default.addUninstalledStickerPack({
        ...stickerPack,
        storageID: void 0,
        storageVersion: void 0
      });
    });
    installedStickerPacks.forEach((stickerPack) => {
      const { storageID, storageVersion } = stickerPack;
      if (!storageID || remoteKeys.has(storageID)) {
        return;
      }
      const missingKey = redactStorageID(storageID, storageVersion);
      log.info(`storageService.process(${version}): localKey=${missingKey} was not in remote manifest`);
      import_Client.default.createOrUpdateStickerPack({
        ...stickerPack,
        storageID: void 0,
        storageVersion: void 0
      });
    });
    storyDistributionLists.forEach((storyDistributionList) => {
      const { storageID, storageVersion } = storyDistributionList;
      if (!storageID || remoteKeys.has(storageID)) {
        return;
      }
      const missingKey = redactStorageID(storageID, storageVersion);
      log.info(`storageService.process(${version}): localKey=${missingKey} was not in remote manifest`);
      import_Client.default.modifyStoryDistribution({
        ...storyDistributionList,
        storageID: void 0,
        storageVersion: void 0
      });
    });
    const myStories = storyDistributionLists.find(({ id }) => id === import_Stories.MY_STORIES_ID);
    if (!myStories) {
      const storyDistribution = {
        allowsReplies: true,
        id: import_Stories.MY_STORIES_ID,
        isBlockList: true,
        members: [],
        name: import_Stories.MY_STORIES_ID,
        senderKeyInfo: void 0,
        storageNeedsSync: true
      };
      await import_Client.default.createNewStoryDistribution(storyDistribution);
      const shouldSave = false;
      window.reduxActions.storyDistributionLists.createDistributionList(storyDistribution.name, storyDistribution.members, storyDistribution, shouldSave);
      conflictCount += 1;
    }
  }
  log.info(`storageService.process(${version}): conflictCount=${conflictCount}`);
  return conflictCount;
}
async function processRemoteRecords(storageVersion, remoteOnlyRecords) {
  const storageKeyBase64 = window.storage.get("storageKey");
  if (!storageKeyBase64) {
    throw new Error("No storage key");
  }
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error("messaging is not available");
  }
  const storageKey = Bytes.fromBase64(storageKeyBase64);
  log.info(`storageService.process(${storageVersion}): fetching remote keys count=${remoteOnlyRecords.size}`);
  const credentials = window.storage.get("storageCredentials");
  const batches = (0, import_lodash.chunk)(Array.from(remoteOnlyRecords.keys()), import_storageConstants.MAX_READ_KEYS);
  const storageItems = (await (0, import_p_map.default)(batches, async (batch) => {
    const readOperation = new import_protobuf.SignalService.ReadOperation();
    readOperation.readKey = batch.map(Bytes.fromBase64);
    const storageItemsBuffer = await messaging.getStorageRecords(import_protobuf.SignalService.ReadOperation.encode(readOperation).finish(), {
      credentials
    });
    return import_protobuf.SignalService.StorageItems.decode(storageItemsBuffer).items ?? [];
  }, { concurrency: 5 })).flat();
  const missingKeys = new Set(remoteOnlyRecords.keys());
  const decryptedStorageItems = await (0, import_p_map.default)(storageItems, async (storageRecordWrapper) => {
    const { key, value: storageItemCiphertext } = storageRecordWrapper;
    if (!key || !storageItemCiphertext) {
      const error = new Error(`storageService.process(${storageVersion}): missing key and/or Ciphertext`);
      await stopStorageServiceSync(error);
      throw error;
    }
    const base64ItemID = Bytes.toBase64(key);
    missingKeys.delete(base64ItemID);
    const storageItemKey = (0, import_Crypto.deriveStorageItemKey)(storageKey, base64ItemID);
    let storageItemPlaintext;
    try {
      storageItemPlaintext = (0, import_Crypto.decryptProfile)(storageItemCiphertext, storageItemKey);
    } catch (err) {
      log.error(`storageService.process(${storageVersion}): Error decrypting storage item`, Errors.toLogFormat(err));
      await stopStorageServiceSync(err);
      throw err;
    }
    const storageRecord = import_protobuf.SignalService.StorageRecord.decode(storageItemPlaintext);
    const remoteRecord = remoteOnlyRecords.get(base64ItemID);
    if (!remoteRecord) {
      throw new Error(`Got a remote record that wasn't requested with storageID: ${base64ItemID}`);
    }
    return {
      itemType: remoteRecord.itemType,
      storageID: base64ItemID,
      storageRecord
    };
  }, { concurrency: 5 });
  const redactedMissingKeys = Array.from(missingKeys).map((id) => redactStorageID(id, storageVersion));
  log.info(`storageService.process(${storageVersion}): missing remote keys=${JSON.stringify(redactedMissingKeys)} count=${missingKeys.size}`);
  const ITEM_TYPE = import_protobuf.SignalService.ManifestRecord.Identifier.Type;
  const droppedKeys = /* @__PURE__ */ new Set();
  const masterKeys = /* @__PURE__ */ new Map();
  for (const { itemType, storageID, storageRecord } of decryptedStorageItems) {
    if (itemType === ITEM_TYPE.GROUPV2 && storageRecord.groupV2?.masterKey) {
      masterKeys.set(Bytes.toBase64(storageRecord.groupV2.masterKey), storageID);
    }
  }
  let accountItem;
  const prunedStorageItems = decryptedStorageItems.filter((item) => {
    const { itemType, storageID, storageRecord } = item;
    if (itemType === ITEM_TYPE.ACCOUNT) {
      if (accountItem !== void 0) {
        log.warn(`storageService.process(${storageVersion}): duplicate account record=${redactStorageID(storageID, storageVersion)} previous=${redactStorageID(accountItem.storageID, storageVersion)}`);
        droppedKeys.add(accountItem.storageID);
      }
      accountItem = item;
      return false;
    }
    if (itemType !== ITEM_TYPE.GROUPV1 || !storageRecord.groupV1?.id) {
      return true;
    }
    const masterKey = (0, import_Crypto.deriveMasterKeyFromGroupV1)(storageRecord.groupV1.id);
    const gv2StorageID = masterKeys.get(Bytes.toBase64(masterKey));
    if (!gv2StorageID) {
      return true;
    }
    log.warn(`storageService.process(${storageVersion}): dropping GV1 record=${redactStorageID(storageID, storageVersion)} GV2 record=${redactStorageID(gv2StorageID, storageVersion)} is in the same manifest`);
    droppedKeys.add(storageID);
    return false;
  });
  try {
    log.info(`storageService.process(${storageVersion}): attempting to merge records=${prunedStorageItems.length}`);
    if (accountItem !== void 0) {
      log.info(`storageService.process(${storageVersion}): account record=${redactStorageID(accountItem.storageID, storageVersion)}`);
    }
    const mergedRecords = [
      ...await (0, import_p_map.default)(prunedStorageItems, (item) => mergeRecord(storageVersion, item), { concurrency: 32 }),
      ...accountItem ? [await mergeRecord(storageVersion, accountItem)] : []
    ];
    log.info(`storageService.process(${storageVersion}): processed records=${mergedRecords.length}`);
    const updatedConversations = mergedRecords.map((record) => record.updatedConversations).flat().map((convo) => convo.attributes);
    await updateConversations(updatedConversations);
    log.info(`storageService.process(${storageVersion}): updated conversations=${updatedConversations.length}`);
    const needProfileFetch = mergedRecords.map((record) => record.needProfileFetch).flat();
    log.info(`storageService.process(${storageVersion}): kicking off profile fetches=${needProfileFetch.length}`);
    needProfileFetch.map((convo) => convo.getProfiles());
    const unknownRecords = /* @__PURE__ */ new Map();
    const previousUnknownRecords = window.storage.get("storage-service-unknown-records", new Array());
    previousUnknownRecords.forEach((record) => {
      unknownRecords.set(record.storageID, record);
    });
    const newRecordsWithErrors = [];
    let conflictCount = 0;
    mergedRecords.forEach((mergedRecord) => {
      if (mergedRecord.isUnsupported) {
        unknownRecords.set(mergedRecord.storageID, {
          itemType: mergedRecord.itemType,
          storageID: mergedRecord.storageID,
          storageVersion
        });
      } else if (mergedRecord.hasError) {
        newRecordsWithErrors.push({
          itemType: mergedRecord.itemType,
          storageID: mergedRecord.storageID,
          storageVersion
        });
      }
      if (mergedRecord.hasConflict) {
        conflictCount += 1;
      }
      if (mergedRecord.shouldDrop) {
        droppedKeys.add(mergedRecord.storageID);
      }
    });
    const redactedDroppedKeys = Array.from(droppedKeys.values()).map((key) => redactStorageID(key, storageVersion));
    log.info(`storageService.process(${storageVersion}): dropped keys=${JSON.stringify(redactedDroppedKeys)} count=${redactedDroppedKeys.length}`);
    const newUnknownRecords = Array.from(unknownRecords.values()).filter((record) => !validRecordTypes.has(record.itemType));
    const redactedNewUnknowns = newUnknownRecords.map(redactExtendedStorageID);
    log.info(`storageService.process(${storageVersion}): unknown records=${JSON.stringify(redactedNewUnknowns)} count=${redactedNewUnknowns.length}`);
    await window.storage.put("storage-service-unknown-records", newUnknownRecords);
    const redactedErrorRecords = newRecordsWithErrors.map(redactExtendedStorageID);
    log.info(`storageService.process(${storageVersion}): error records=${JSON.stringify(redactedErrorRecords)} count=${redactedErrorRecords.length}`);
    await window.storage.put("storage-service-error-records", newRecordsWithErrors);
    const pendingDeletes = [...missingKeys, ...droppedKeys].map((storageID) => ({
      storageID,
      storageVersion
    }));
    const redactedPendingDeletes = pendingDeletes.map(redactExtendedStorageID);
    log.info(`storageService.process(${storageVersion}): pending deletes=${JSON.stringify(redactedPendingDeletes)} count=${redactedPendingDeletes.length}`);
    await window.storage.put("storage-service-pending-deletes", pendingDeletes);
    if (conflictCount === 0) {
      conflictBackOff.reset();
    }
    return conflictCount;
  } catch (err) {
    log.error(`storageService.process(${storageVersion}): failed to process remote records`, Errors.toLogFormat(err));
  }
  return 0;
}
async function sync(ignoreConflicts = false) {
  if (!window.storage.get("storageKey")) {
    throw new Error("storageService.sync: Cannot start; no storage key!");
  }
  log.info(`storageService.sync: starting... ignoreConflicts=${ignoreConflicts}`);
  let manifest;
  try {
    const previousFetchComplete = window.storage.get("storageFetchComplete");
    const manifestFromStorage = window.storage.get("manifestVersion");
    if (!previousFetchComplete && (0, import_lodash.isNumber)(manifestFromStorage)) {
      window.storage.put("storageFetchComplete", true);
    }
    const localManifestVersion = manifestFromStorage || 0;
    log.info(`storageService.sync: fetching latest after version=${localManifestVersion}`);
    manifest = await fetchManifest(localManifestVersion);
    if (!manifest) {
      log.info(`storageService.sync: no updates, version=${localManifestVersion}`);
      return void 0;
    }
    (0, import_assert.strictAssert)(manifest.version !== void 0 && manifest.version !== null, "Manifest without version");
    const version = manifest.version?.toNumber() ?? 0;
    log.info(`storageService.sync: updating to remoteVersion=${version} sourceDevice=${manifest.sourceDevice ?? "?"} from version=${localManifestVersion}`);
    const conflictCount = await processManifest(manifest, version);
    log.info(`storageService.sync: updated to version=${version} conflicts=${conflictCount}`);
    await window.storage.put("manifestVersion", version);
    const hasConflicts = conflictCount !== 0;
    if (hasConflicts && !ignoreConflicts) {
      await upload(true);
    }
    await window.storage.put("storageFetchComplete", true);
  } catch (err) {
    log.error("storageService.sync: error processing manifest", Errors.toLogFormat(err));
  }
  log.info("storageService.sync: complete");
  return manifest;
}
async function upload(fromSync = false) {
  if (!window.textsecure.messaging) {
    throw new Error("storageService.upload: We are offline!");
  }
  if (fromSync) {
    uploadBucket.push(Date.now());
    if (uploadBucket.length >= 3) {
      const [firstMostRecentWrite] = uploadBucket;
      if ((0, import_timestamp.isMoreRecentThan)(5 * durations.MINUTE, firstMostRecentWrite)) {
        throw new Error("storageService.uploadManifest: too many writes too soon.");
      }
      uploadBucket.shift();
    }
  }
  if (!window.storage.get("storageKey")) {
    log.info("storageService.upload: no storageKey, requesting new keys");
    backOff.reset();
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("storageService.upload: We are primary device; not sending key sync request");
      return;
    }
    try {
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestKeySyncMessage());
    } catch (error) {
      log.error("storageService.upload: Failed to queue sync message", Errors.toLogFormat(error));
    }
    return;
  }
  let previousManifest;
  if (!fromSync) {
    const ignoreConflicts = true;
    previousManifest = await sync(ignoreConflicts);
  }
  const localManifestVersion = window.storage.get("manifestVersion", 0);
  const version = Number(localManifestVersion) + 1;
  log.info(`storageService.upload(${version}): will update to manifest version`);
  try {
    const generatedManifest = await generateManifest(version, previousManifest, false);
    await uploadManifest(version, generatedManifest);
    await window.storage.put("storage-service-pending-deletes", []);
  } catch (err) {
    if (err.code === 409) {
      await (0, import_sleep.sleep)(conflictBackOff.getAndIncrement());
      log.info("storageService.upload: pushing sync on the queue");
      setTimeout(runStorageServiceSyncJob);
      return;
    }
    log.error(`storageService.upload(${version}): error`, Errors.toLogFormat(err));
  }
}
let storageServiceEnabled = false;
function enableStorageService() {
  storageServiceEnabled = true;
}
async function eraseAllStorageServiceState({
  keepUnknownFields = false
} = {}) {
  log.info("storageService.eraseAllStorageServiceState: starting...");
  await Promise.all([
    window.storage.remove("manifestVersion"),
    keepUnknownFields ? Promise.resolve() : window.storage.remove("storage-service-unknown-records"),
    window.storage.remove("storageCredentials")
  ]);
  await eraseStorageServiceStateFromConversations();
  log.info("storageService.eraseAllStorageServiceState: complete");
}
const storageServiceUploadJob = (0, import_lodash.debounce)(() => {
  if (!storageServiceEnabled) {
    log.info("storageService.storageServiceUploadJob: called before enabled");
    return;
  }
  (0, import_JobQueue.storageJobQueue)(async () => {
    await upload();
  }, `upload v${window.storage.get("manifestVersion")}`);
}, 500);
const runStorageServiceSyncJob = (0, import_lodash.debounce)(() => {
  if (!storageServiceEnabled) {
    log.info("storageService.runStorageServiceSyncJob: called before enabled");
    return;
  }
  import_ourProfileKey.ourProfileKeyService.blockGetWithPromise((0, import_JobQueue.storageJobQueue)(async () => {
    await sync();
    window.Whisper.events.trigger("storageService:syncComplete");
  }, `sync v${window.storage.get("manifestVersion")}`));
}, 500);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  enableStorageService,
  eraseAllStorageServiceState,
  runStorageServiceSyncJob,
  storageServiceUploadJob
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcmFnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGRlYm91bmNlLCBpc051bWJlciwgY2h1bmsgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHBNYXAgZnJvbSAncC1tYXAnO1xuaW1wb3J0IExvbmcgZnJvbSAnbG9uZyc7XG5cbmltcG9ydCBkYXRhSW50ZXJmYWNlIGZyb20gJy4uL3NxbC9DbGllbnQnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHtcbiAgZ2V0UmFuZG9tQnl0ZXMsXG4gIGRlcml2ZVN0b3JhZ2VJdGVtS2V5LFxuICBkZXJpdmVTdG9yYWdlTWFuaWZlc3RLZXksXG4gIGVuY3J5cHRQcm9maWxlLFxuICBkZWNyeXB0UHJvZmlsZSxcbiAgZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEsXG59IGZyb20gJy4uL0NyeXB0byc7XG5pbXBvcnQge1xuICBtZXJnZUFjY291bnRSZWNvcmQsXG4gIG1lcmdlQ29udGFjdFJlY29yZCxcbiAgbWVyZ2VHcm91cFYxUmVjb3JkLFxuICBtZXJnZUdyb3VwVjJSZWNvcmQsXG4gIG1lcmdlU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLFxuICBtZXJnZVN0aWNrZXJQYWNrUmVjb3JkLFxuICB0b0FjY291bnRSZWNvcmQsXG4gIHRvQ29udGFjdFJlY29yZCxcbiAgdG9Hcm91cFYxUmVjb3JkLFxuICB0b0dyb3VwVjJSZWNvcmQsXG4gIHRvU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkLFxuICB0b1N0aWNrZXJQYWNrUmVjb3JkLFxufSBmcm9tICcuL3N0b3JhZ2VSZWNvcmRPcHMnO1xuaW1wb3J0IHR5cGUgeyBNZXJnZVJlc3VsdFR5cGUgfSBmcm9tICcuL3N0b3JhZ2VSZWNvcmRPcHMnO1xuaW1wb3J0IHsgTUFYX1JFQURfS0VZUyB9IGZyb20gJy4vc3RvcmFnZUNvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgZHJvcE51bGwgfSBmcm9tICcuLi91dGlsL2Ryb3BOdWxsJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBCYWNrT2ZmIH0gZnJvbSAnLi4vdXRpbC9CYWNrT2ZmJztcbmltcG9ydCB7IHN0b3JhZ2VKb2JRdWV1ZSB9IGZyb20gJy4uL3V0aWwvSm9iUXVldWUnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuLi91dGlsL3NsZWVwJztcbmltcG9ydCB7IGlzTW9yZVJlY2VudFRoYW4gfSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBvdXJQcm9maWxlS2V5U2VydmljZSB9IGZyb20gJy4vb3VyUHJvZmlsZUtleSc7XG5pbXBvcnQge1xuICBDb252ZXJzYXRpb25UeXBlcyxcbiAgdHlwZW9mQ29udmVyc2F0aW9uLFxufSBmcm9tICcuLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uL3Byb3RvYnVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBzaW5nbGVQcm90b0pvYlF1ZXVlIH0gZnJvbSAnLi4vam9icy9zaW5nbGVQcm90b0pvYlF1ZXVlJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHR5cGUge1xuICBFeHRlbmRlZFN0b3JhZ2VJRCxcbiAgUmVtb3RlUmVjb3JkLFxuICBVbmtub3duUmVjb3JkLFxufSBmcm9tICcuLi90eXBlcy9TdG9yYWdlU2VydmljZS5kJztcbmltcG9ydCBNZXNzYWdlU2VuZGVyIGZyb20gJy4uL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuaW1wb3J0IHR5cGUge1xuICBTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZSxcbiAgU3RvcmFnZVNlcnZpY2VGaWVsZHNUeXBlLFxuICBTdGlja2VyUGFja1R5cGUsXG4gIFVuaW5zdGFsbGVkU3RpY2tlclBhY2tUeXBlLFxufSBmcm9tICcuLi9zcWwvSW50ZXJmYWNlJztcbmltcG9ydCB7IE1ZX1NUT1JJRVNfSUQgfSBmcm9tICcuLi90eXBlcy9TdG9yaWVzJztcblxudHlwZSBJTWFuaWZlc3RSZWNvcmRJZGVudGlmaWVyID0gUHJvdG8uTWFuaWZlc3RSZWNvcmQuSUlkZW50aWZpZXI7XG5cbmNvbnN0IHtcbiAgZXJhc2VTdG9yYWdlU2VydmljZVN0YXRlRnJvbUNvbnZlcnNhdGlvbnMsXG4gIHVwZGF0ZUNvbnZlcnNhdGlvbixcbiAgdXBkYXRlQ29udmVyc2F0aW9ucyxcbn0gPSBkYXRhSW50ZXJmYWNlO1xuXG5jb25zdCB1cGxvYWRCdWNrZXQ6IEFycmF5PG51bWJlcj4gPSBbXTtcblxuY29uc3QgdmFsaWRSZWNvcmRUeXBlcyA9IG5ldyBTZXQoW1xuICAwLCAvLyBVTktOT1dOXG4gIDEsIC8vIENPTlRBQ1RcbiAgMiwgLy8gR1JPVVBWMVxuICAzLCAvLyBHUk9VUFYyXG4gIDQsIC8vIEFDQ09VTlRcbiAgNSwgLy8gU1RPUllfRElTVFJJQlVUSU9OX0xJU1RcbiAgNiwgLy8gU1RJQ0tFUl9QQUNLXG5dKTtcblxuY29uc3QgYmFja09mZiA9IG5ldyBCYWNrT2ZmKFtcbiAgZHVyYXRpb25zLlNFQ09ORCxcbiAgNSAqIGR1cmF0aW9ucy5TRUNPTkQsXG4gIDMwICogZHVyYXRpb25zLlNFQ09ORCxcbiAgMiAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gIDUgKiBkdXJhdGlvbnMuTUlOVVRFLFxuXSk7XG5cbmNvbnN0IGNvbmZsaWN0QmFja09mZiA9IG5ldyBCYWNrT2ZmKFtcbiAgZHVyYXRpb25zLlNFQ09ORCxcbiAgNSAqIGR1cmF0aW9ucy5TRUNPTkQsXG4gIDMwICogZHVyYXRpb25zLlNFQ09ORCxcbl0pO1xuXG5mdW5jdGlvbiByZWRhY3RTdG9yYWdlSUQoXG4gIHN0b3JhZ2VJRDogc3RyaW5nLFxuICB2ZXJzaW9uPzogbnVtYmVyLFxuICBjb252ZXJzYXRpb24/OiBDb252ZXJzYXRpb25Nb2RlbFxuKTogc3RyaW5nIHtcbiAgY29uc3QgY29udm9JZCA9IGNvbnZlcnNhdGlvbiA/IGAgJHtjb252ZXJzYXRpb24/LmlkRm9yTG9nZ2luZygpfWAgOiAnJztcbiAgcmV0dXJuIGAke3ZlcnNpb24gPz8gJz8nfToke3N0b3JhZ2VJRC5zdWJzdHJpbmcoMCwgMyl9JHtjb252b0lkfWA7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdEV4dGVuZGVkU3RvcmFnZUlEKHtcbiAgc3RvcmFnZUlELFxuICBzdG9yYWdlVmVyc2lvbixcbn06IEV4dGVuZGVkU3RvcmFnZUlEKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlZGFjdFN0b3JhZ2VJRChzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uKTtcbn1cblxuZnVuY3Rpb24gZW5jcnlwdFJlY29yZChcbiAgc3RvcmFnZUlEOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIHN0b3JhZ2VSZWNvcmQ6IFByb3RvLklTdG9yYWdlUmVjb3JkXG4pOiBQcm90by5TdG9yYWdlSXRlbSB7XG4gIGNvbnN0IHN0b3JhZ2VJdGVtID0gbmV3IFByb3RvLlN0b3JhZ2VJdGVtKCk7XG5cbiAgY29uc3Qgc3RvcmFnZUtleUJ1ZmZlciA9IHN0b3JhZ2VJRFxuICAgID8gQnl0ZXMuZnJvbUJhc2U2NChTdHJpbmcoc3RvcmFnZUlEKSlcbiAgICA6IGdlbmVyYXRlU3RvcmFnZUlEKCk7XG5cbiAgY29uc3Qgc3RvcmFnZUtleUJhc2U2NCA9IHdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZUtleScpO1xuICBpZiAoIXN0b3JhZ2VLZXlCYXNlNjQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN0b3JhZ2Uga2V5Jyk7XG4gIH1cbiAgY29uc3Qgc3RvcmFnZUtleSA9IEJ5dGVzLmZyb21CYXNlNjQoc3RvcmFnZUtleUJhc2U2NCk7XG4gIGNvbnN0IHN0b3JhZ2VJdGVtS2V5ID0gZGVyaXZlU3RvcmFnZUl0ZW1LZXkoXG4gICAgc3RvcmFnZUtleSxcbiAgICBCeXRlcy50b0Jhc2U2NChzdG9yYWdlS2V5QnVmZmVyKVxuICApO1xuXG4gIGNvbnN0IGVuY3J5cHRlZFJlY29yZCA9IGVuY3J5cHRQcm9maWxlKFxuICAgIFByb3RvLlN0b3JhZ2VSZWNvcmQuZW5jb2RlKHN0b3JhZ2VSZWNvcmQpLmZpbmlzaCgpLFxuICAgIHN0b3JhZ2VJdGVtS2V5XG4gICk7XG5cbiAgc3RvcmFnZUl0ZW0ua2V5ID0gc3RvcmFnZUtleUJ1ZmZlcjtcbiAgc3RvcmFnZUl0ZW0udmFsdWUgPSBlbmNyeXB0ZWRSZWNvcmQ7XG5cbiAgcmV0dXJuIHN0b3JhZ2VJdGVtO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVN0b3JhZ2VJRCgpOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGdldFJhbmRvbUJ5dGVzKDE2KTtcbn1cblxudHlwZSBHZW5lcmF0ZWRNYW5pZmVzdFR5cGUgPSB7XG4gIHBvc3RVcGxvYWRVcGRhdGVGdW5jdGlvbnM6IEFycmF5PCgpID0+IHVua25vd24+O1xuICBkZWxldGVLZXlzOiBBcnJheTxVaW50OEFycmF5PjtcbiAgbmV3SXRlbXM6IFNldDxQcm90by5JU3RvcmFnZUl0ZW0+O1xuICBzdG9yYWdlTWFuaWZlc3Q6IFByb3RvLklTdG9yYWdlTWFuaWZlc3Q7XG59O1xuXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZU1hbmlmZXN0KFxuICB2ZXJzaW9uOiBudW1iZXIsXG4gIHByZXZpb3VzTWFuaWZlc3Q/OiBQcm90by5JTWFuaWZlc3RSZWNvcmQsXG4gIGlzTmV3TWFuaWZlc3QgPSBmYWxzZVxuKTogUHJvbWlzZTxHZW5lcmF0ZWRNYW5pZmVzdFR5cGU+IHtcbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogZ2VuZXJhdGluZyBtYW5pZmVzdCBgICtcbiAgICAgIGBuZXc9JHtpc05ld01hbmlmZXN0fWBcbiAgKTtcblxuICBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5jaGVja0ZvckNvbmZsaWN0cygpO1xuXG4gIGNvbnN0IElURU1fVFlQRSA9IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIuVHlwZTtcblxuICBjb25zdCBwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zOiBBcnJheTwoKSA9PiB1bmtub3duPiA9IFtdO1xuICBjb25zdCBpbnNlcnRLZXlzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGNvbnN0IGRlbGV0ZUtleXM6IEFycmF5PFVpbnQ4QXJyYXk+ID0gW107XG4gIGNvbnN0IG1hbmlmZXN0UmVjb3JkS2V5czogU2V0PElNYW5pZmVzdFJlY29yZElkZW50aWZpZXI+ID0gbmV3IFNldCgpO1xuICBjb25zdCBuZXdJdGVtczogU2V0PFByb3RvLklTdG9yYWdlSXRlbT4gPSBuZXcgU2V0KCk7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc1N0b3JhZ2VSZWNvcmQoe1xuICAgIGNvbnZlcnNhdGlvbixcbiAgICBjdXJyZW50U3RvcmFnZUlELFxuICAgIGN1cnJlbnRTdG9yYWdlVmVyc2lvbixcbiAgICBpZGVudGlmaWVyVHlwZSxcbiAgICBzdG9yYWdlTmVlZHNTeW5jLFxuICAgIHN0b3JhZ2VSZWNvcmQsXG4gIH06IHtcbiAgICBjb252ZXJzYXRpb24/OiBDb252ZXJzYXRpb25Nb2RlbDtcbiAgICBjdXJyZW50U3RvcmFnZUlEPzogc3RyaW5nO1xuICAgIGN1cnJlbnRTdG9yYWdlVmVyc2lvbj86IG51bWJlcjtcbiAgICBpZGVudGlmaWVyVHlwZTogUHJvdG8uTWFuaWZlc3RSZWNvcmQuSWRlbnRpZmllci5UeXBlO1xuICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGJvb2xlYW47XG4gICAgc3RvcmFnZVJlY29yZDogUHJvdG8uSVN0b3JhZ2VSZWNvcmQ7XG4gIH0pIHtcbiAgICBjb25zdCBpZGVudGlmaWVyID0gbmV3IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIoKTtcbiAgICBpZGVudGlmaWVyLnR5cGUgPSBpZGVudGlmaWVyVHlwZTtcblxuICAgIGNvbnN0IGN1cnJlbnRSZWRhY3RlZElEID0gY3VycmVudFN0b3JhZ2VJRFxuICAgICAgPyByZWRhY3RTdG9yYWdlSUQoY3VycmVudFN0b3JhZ2VJRCwgY3VycmVudFN0b3JhZ2VWZXJzaW9uKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBpc05ld0l0ZW0gPSBpc05ld01hbmlmZXN0IHx8IHN0b3JhZ2VOZWVkc1N5bmMgfHwgIWN1cnJlbnRTdG9yYWdlSUQ7XG5cbiAgICBjb25zdCBzdG9yYWdlSUQgPSBpc05ld0l0ZW1cbiAgICAgID8gQnl0ZXMudG9CYXNlNjQoZ2VuZXJhdGVTdG9yYWdlSUQoKSlcbiAgICAgIDogY3VycmVudFN0b3JhZ2VJRDtcblxuICAgIGxldCBzdG9yYWdlSXRlbTtcbiAgICB0cnkge1xuICAgICAgc3RvcmFnZUl0ZW0gPSBlbmNyeXB0UmVjb3JkKHN0b3JhZ2VJRCwgc3RvcmFnZVJlY29yZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IGVuY3J5cHQgcmVjb3JkIGZhaWxlZDpgLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKVxuICAgICAgKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgaWRlbnRpZmllci5yYXcgPSBzdG9yYWdlSXRlbS5rZXk7XG5cbiAgICAvLyBXaGVuIGEgY2xpZW50IG5lZWRzIHRvIHVwZGF0ZSBhIGdpdmVuIHJlY29yZCBpdCBzaG91bGQgY3JlYXRlIGl0XG4gICAgLy8gdW5kZXIgYSBuZXcga2V5IGFuZCBkZWxldGUgdGhlIGV4aXN0aW5nIGtleS5cbiAgICBpZiAoaXNOZXdJdGVtKSB7XG4gICAgICBuZXdJdGVtcy5hZGQoc3RvcmFnZUl0ZW0pO1xuXG4gICAgICBpbnNlcnRLZXlzLnB1c2goc3RvcmFnZUlEKTtcbiAgICAgIGNvbnN0IG5ld1JlZGFjdGVkSUQgPSByZWRhY3RTdG9yYWdlSUQoc3RvcmFnZUlELCB2ZXJzaW9uLCBjb252ZXJzYXRpb24pO1xuICAgICAgaWYgKGN1cnJlbnRTdG9yYWdlSUQpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYCArXG4gICAgICAgICAgICBgdXBkYXRpbmcgZnJvbT0ke2N1cnJlbnRSZWRhY3RlZElEfSBgICtcbiAgICAgICAgICAgIGB0bz0ke25ld1JlZGFjdGVkSUR9YFxuICAgICAgICApO1xuICAgICAgICBkZWxldGVLZXlzLnB1c2goQnl0ZXMuZnJvbUJhc2U2NChjdXJyZW50U3RvcmFnZUlEKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBhZGRpbmcga2V5PSR7bmV3UmVkYWN0ZWRJRH1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWFuaWZlc3RSZWNvcmRLZXlzLmFkZChpZGVudGlmaWVyKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpc05ld0l0ZW0sXG4gICAgICBzdG9yYWdlSUQsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSB3aW5kb3cuZ2V0Q29udmVyc2F0aW9ucygpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnZlcnNhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBjb252ZXJzYXRpb25zLm1vZGVsc1tpXTtcblxuICAgIGxldCBpZGVudGlmaWVyVHlwZTtcbiAgICBsZXQgc3RvcmFnZVJlY29yZDtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvblR5cGUgPSB0eXBlb2ZDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuICAgIGlmIChjb252ZXJzYXRpb25UeXBlID09PSBDb252ZXJzYXRpb25UeXBlcy5NZSkge1xuICAgICAgc3RvcmFnZVJlY29yZCA9IG5ldyBQcm90by5TdG9yYWdlUmVjb3JkKCk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgc3RvcmFnZVJlY29yZC5hY2NvdW50ID0gYXdhaXQgdG9BY2NvdW50UmVjb3JkKGNvbnZlcnNhdGlvbik7XG4gICAgICBpZGVudGlmaWVyVHlwZSA9IElURU1fVFlQRS5BQ0NPVU5UO1xuICAgIH0gZWxzZSBpZiAoY29udmVyc2F0aW9uVHlwZSA9PT0gQ29udmVyc2F0aW9uVHlwZXMuRGlyZWN0KSB7XG4gICAgICAvLyBDb250YWN0cyBtdXN0IGhhdmUgVVVJRFxuICAgICAgaWYgKCFjb252ZXJzYXRpb24uZ2V0KCd1dWlkJykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvciA9IGNvbnZlcnNhdGlvbi52YWxpZGF0ZSgpO1xuICAgICAgaWYgKHZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICBjb25zdCBkcm9wcGVkSUQgPSBjb252ZXJzYXRpb24uZ2V0KCdzdG9yYWdlSUQnKTtcbiAgICAgICAgY29uc3QgZHJvcHBlZFZlcnNpb24gPSBjb252ZXJzYXRpb24uZ2V0KCdzdG9yYWdlVmVyc2lvbicpO1xuICAgICAgICBpZiAoIWRyb3BwZWRJRCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkSUQgPSByZWRhY3RTdG9yYWdlSUQoXG4gICAgICAgICAgZHJvcHBlZElELFxuICAgICAgICAgIGRyb3BwZWRWZXJzaW9uLFxuICAgICAgICAgIGNvbnZlcnNhdGlvblxuICAgICAgICApO1xuXG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBzdG9yYWdlU2VydmljZS5nZW5lcmF0ZU1hbmlmZXN0KCR7dmVyc2lvbn0pOiBgICtcbiAgICAgICAgICAgIGBza2lwcGluZyBjb250YWN0PSR7cmVjb3JkSUR9IGAgK1xuICAgICAgICAgICAgYGR1ZSB0byBsb2NhbCB2YWxpZGF0aW9uIGVycm9yPSR7dmFsaWRhdGlvbkVycm9yfWBcbiAgICAgICAgKTtcbiAgICAgICAgY29udmVyc2F0aW9uLnVuc2V0KCdzdG9yYWdlSUQnKTtcbiAgICAgICAgZGVsZXRlS2V5cy5wdXNoKEJ5dGVzLmZyb21CYXNlNjQoZHJvcHBlZElEKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBzdG9yYWdlUmVjb3JkID0gbmV3IFByb3RvLlN0b3JhZ2VSZWNvcmQoKTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICBzdG9yYWdlUmVjb3JkLmNvbnRhY3QgPSBhd2FpdCB0b0NvbnRhY3RSZWNvcmQoY29udmVyc2F0aW9uKTtcbiAgICAgIGlkZW50aWZpZXJUeXBlID0gSVRFTV9UWVBFLkNPTlRBQ1Q7XG4gICAgfSBlbHNlIGlmIChjb252ZXJzYXRpb25UeXBlID09PSBDb252ZXJzYXRpb25UeXBlcy5Hcm91cFYyKSB7XG4gICAgICBzdG9yYWdlUmVjb3JkID0gbmV3IFByb3RvLlN0b3JhZ2VSZWNvcmQoKTtcbiAgICAgIHN0b3JhZ2VSZWNvcmQuZ3JvdXBWMiA9IHRvR3JvdXBWMlJlY29yZChjb252ZXJzYXRpb24pO1xuICAgICAgaWRlbnRpZmllclR5cGUgPSBJVEVNX1RZUEUuR1JPVVBWMjtcbiAgICB9IGVsc2UgaWYgKGNvbnZlcnNhdGlvblR5cGUgPT09IENvbnZlcnNhdGlvblR5cGVzLkdyb3VwVjEpIHtcbiAgICAgIHN0b3JhZ2VSZWNvcmQgPSBuZXcgUHJvdG8uU3RvcmFnZVJlY29yZCgpO1xuICAgICAgc3RvcmFnZVJlY29yZC5ncm91cFYxID0gdG9Hcm91cFYxUmVjb3JkKGNvbnZlcnNhdGlvbik7XG4gICAgICBpZGVudGlmaWVyVHlwZSA9IElURU1fVFlQRS5HUk9VUFYxO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYCArXG4gICAgICAgICAgYHVua25vd24gY29udmVyc2F0aW9uPSR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFzdG9yYWdlUmVjb3JkIHx8ICFpZGVudGlmaWVyVHlwZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgeyBpc05ld0l0ZW0sIHN0b3JhZ2VJRCB9ID0gcHJvY2Vzc1N0b3JhZ2VSZWNvcmQoe1xuICAgICAgY29udmVyc2F0aW9uLFxuICAgICAgY3VycmVudFN0b3JhZ2VJRDogY29udmVyc2F0aW9uLmdldCgnc3RvcmFnZUlEJyksXG4gICAgICBjdXJyZW50U3RvcmFnZVZlcnNpb246IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VWZXJzaW9uJyksXG4gICAgICBpZGVudGlmaWVyVHlwZSxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IEJvb2xlYW4oY29udmVyc2F0aW9uLmdldCgnbmVlZHNTdG9yYWdlU2VydmljZVN5bmMnKSksXG4gICAgICBzdG9yYWdlUmVjb3JkLFxuICAgIH0pO1xuXG4gICAgaWYgKGlzTmV3SXRlbSkge1xuICAgICAgcG9zdFVwbG9hZFVwZGF0ZUZ1bmN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgbmVlZHNTdG9yYWdlU2VydmljZVN5bmM6IGZhbHNlLFxuICAgICAgICAgIHN0b3JhZ2VWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgICAgIHN0b3JhZ2VJRCxcbiAgICAgICAgfSk7XG4gICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCB7XG4gICAgc3RvcnlEaXN0cmlidXRpb25MaXN0cyxcbiAgICBpbnN0YWxsZWRTdGlja2VyUGFja3MsXG4gICAgdW5pbnN0YWxsZWRTdGlja2VyUGFja3MsXG4gIH0gPSBhd2FpdCBnZXROb25Db252ZXJzYXRpb25SZWNvcmRzKCk7XG5cbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYCArXG4gICAgICBgYWRkaW5nIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHM9JHtzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLmxlbmd0aH1gXG4gICk7XG5cbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0cy5mb3JFYWNoKHN0b3J5RGlzdHJpYnV0aW9uTGlzdCA9PiB7XG4gICAgY29uc3Qgc3RvcmFnZVJlY29yZCA9IG5ldyBQcm90by5TdG9yYWdlUmVjb3JkKCk7XG4gICAgc3RvcmFnZVJlY29yZC5zdG9yeURpc3RyaWJ1dGlvbkxpc3QgPSB0b1N0b3J5RGlzdHJpYnV0aW9uTGlzdFJlY29yZChcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdFxuICAgICk7XG5cbiAgICBjb25zdCB7IGlzTmV3SXRlbSwgc3RvcmFnZUlEIH0gPSBwcm9jZXNzU3RvcmFnZVJlY29yZCh7XG4gICAgICBjdXJyZW50U3RvcmFnZUlEOiBzdG9yeURpc3RyaWJ1dGlvbkxpc3Quc3RvcmFnZUlELFxuICAgICAgY3VycmVudFN0b3JhZ2VWZXJzaW9uOiBzdG9yeURpc3RyaWJ1dGlvbkxpc3Quc3RvcmFnZVZlcnNpb24sXG4gICAgICBpZGVudGlmaWVyVHlwZTogSVRFTV9UWVBFLlNUT1JZX0RJU1RSSUJVVElPTl9MSVNULFxuICAgICAgc3RvcmFnZU5lZWRzU3luYzogc3RvcnlEaXN0cmlidXRpb25MaXN0LnN0b3JhZ2VOZWVkc1N5bmMsXG4gICAgICBzdG9yYWdlUmVjb3JkLFxuICAgIH0pO1xuXG4gICAgaWYgKGlzTmV3SXRlbSkge1xuICAgICAgcG9zdFVwbG9hZFVwZGF0ZUZ1bmN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgZGF0YUludGVyZmFjZS5tb2RpZnlTdG9yeURpc3RyaWJ1dGlvbih7XG4gICAgICAgICAgLi4uc3RvcnlEaXN0cmlidXRpb25MaXN0LFxuICAgICAgICAgIHN0b3JhZ2VJRCxcbiAgICAgICAgICBzdG9yYWdlVmVyc2lvbjogdmVyc2lvbixcbiAgICAgICAgICBzdG9yYWdlTmVlZHNTeW5jOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGxvZy5pbmZvKFxuICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IGAgK1xuICAgICAgYGFkZGluZyB1bmluc3RhbGxlZCBzdGlja2VyUGFja3M9JHt1bmluc3RhbGxlZFN0aWNrZXJQYWNrcy5sZW5ndGh9YFxuICApO1xuXG4gIGNvbnN0IHVuaW5zdGFsbGVkU3RpY2tlclBhY2tJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICB1bmluc3RhbGxlZFN0aWNrZXJQYWNrcy5mb3JFYWNoKHN0aWNrZXJQYWNrID0+IHtcbiAgICBjb25zdCBzdG9yYWdlUmVjb3JkID0gbmV3IFByb3RvLlN0b3JhZ2VSZWNvcmQoKTtcbiAgICBzdG9yYWdlUmVjb3JkLnN0aWNrZXJQYWNrID0gdG9TdGlja2VyUGFja1JlY29yZChzdGlja2VyUGFjayk7XG5cbiAgICB1bmluc3RhbGxlZFN0aWNrZXJQYWNrSWRzLmFkZChzdGlja2VyUGFjay5pZCk7XG5cbiAgICBjb25zdCB7IGlzTmV3SXRlbSwgc3RvcmFnZUlEIH0gPSBwcm9jZXNzU3RvcmFnZVJlY29yZCh7XG4gICAgICBjdXJyZW50U3RvcmFnZUlEOiBzdGlja2VyUGFjay5zdG9yYWdlSUQsXG4gICAgICBjdXJyZW50U3RvcmFnZVZlcnNpb246IHN0aWNrZXJQYWNrLnN0b3JhZ2VWZXJzaW9uLFxuICAgICAgaWRlbnRpZmllclR5cGU6IElURU1fVFlQRS5TVElDS0VSX1BBQ0ssXG4gICAgICBzdG9yYWdlTmVlZHNTeW5jOiBzdGlja2VyUGFjay5zdG9yYWdlTmVlZHNTeW5jLFxuICAgICAgc3RvcmFnZVJlY29yZCxcbiAgICB9KTtcblxuICAgIGlmIChpc05ld0l0ZW0pIHtcbiAgICAgIHBvc3RVcGxvYWRVcGRhdGVGdW5jdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgIGRhdGFJbnRlcmZhY2UuYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFjayh7XG4gICAgICAgICAgLi4uc3RpY2tlclBhY2ssXG4gICAgICAgICAgc3RvcmFnZUlELFxuICAgICAgICAgIHN0b3JhZ2VWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYCArXG4gICAgICBgYWRkaW5nIGluc3RhbGxlZCBzdGlja2VyUGFja3M9JHtpbnN0YWxsZWRTdGlja2VyUGFja3MubGVuZ3RofWBcbiAgKTtcblxuICBpbnN0YWxsZWRTdGlja2VyUGFja3MuZm9yRWFjaChzdGlja2VyUGFjayA9PiB7XG4gICAgaWYgKHVuaW5zdGFsbGVkU3RpY2tlclBhY2tJZHMuaGFzKHN0aWNrZXJQYWNrLmlkKSkge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBgICtcbiAgICAgICAgICBgc3RpY2tlciBwYWNrICR7c3RpY2tlclBhY2suaWR9IGlzIGJvdGggaW5zdGFsbGVkIGFuZCB1bmluc3RhbGxlZGBcbiAgICAgICk7XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLnN0aWNrZXJzLnVuaW5zdGFsbFN0aWNrZXJQYWNrKFxuICAgICAgICBzdGlja2VyUGFjay5pZCxcbiAgICAgICAgc3RpY2tlclBhY2sua2V5LFxuICAgICAgICB7IGZyb21TeW5jOiB0cnVlIH1cbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmFnZVJlY29yZCA9IG5ldyBQcm90by5TdG9yYWdlUmVjb3JkKCk7XG4gICAgc3RvcmFnZVJlY29yZC5zdGlja2VyUGFjayA9IHRvU3RpY2tlclBhY2tSZWNvcmQoc3RpY2tlclBhY2spO1xuXG4gICAgY29uc3QgeyBpc05ld0l0ZW0sIHN0b3JhZ2VJRCB9ID0gcHJvY2Vzc1N0b3JhZ2VSZWNvcmQoe1xuICAgICAgY3VycmVudFN0b3JhZ2VJRDogc3RpY2tlclBhY2suc3RvcmFnZUlELFxuICAgICAgY3VycmVudFN0b3JhZ2VWZXJzaW9uOiBzdGlja2VyUGFjay5zdG9yYWdlVmVyc2lvbixcbiAgICAgIGlkZW50aWZpZXJUeXBlOiBJVEVNX1RZUEUuU1RJQ0tFUl9QQUNLLFxuICAgICAgc3RvcmFnZU5lZWRzU3luYzogc3RpY2tlclBhY2suc3RvcmFnZU5lZWRzU3luYyxcbiAgICAgIHN0b3JhZ2VSZWNvcmQsXG4gICAgfSk7XG5cbiAgICBpZiAoaXNOZXdJdGVtKSB7XG4gICAgICBwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICBkYXRhSW50ZXJmYWNlLmNyZWF0ZU9yVXBkYXRlU3RpY2tlclBhY2soe1xuICAgICAgICAgIC4uLnN0aWNrZXJQYWNrLFxuICAgICAgICAgIHN0b3JhZ2VJRCxcbiAgICAgICAgICBzdG9yYWdlVmVyc2lvbjogdmVyc2lvbixcbiAgICAgICAgICBzdG9yYWdlTmVlZHNTeW5jOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHVua25vd25SZWNvcmRzQXJyYXk6IFJlYWRvbmx5QXJyYXk8VW5rbm93blJlY29yZD4gPSAoXG4gICAgd2luZG93LnN0b3JhZ2UuZ2V0KCdzdG9yYWdlLXNlcnZpY2UtdW5rbm93bi1yZWNvcmRzJykgfHwgW11cbiAgKS5maWx0ZXIoKHJlY29yZDogVW5rbm93blJlY29yZCkgPT4gIXZhbGlkUmVjb3JkVHlwZXMuaGFzKHJlY29yZC5pdGVtVHlwZSkpO1xuXG4gIGNvbnN0IHJlZGFjdGVkVW5rbm93bnMgPSB1bmtub3duUmVjb3Jkc0FycmF5Lm1hcChyZWRhY3RFeHRlbmRlZFN0b3JhZ2VJRCk7XG5cbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYWRkaW5nIHVua25vd24gYCArXG4gICAgICBgcmVjb3Jkcz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkVW5rbm93bnMpfSBgICtcbiAgICAgIGBjb3VudD0ke3JlZGFjdGVkVW5rbm93bnMubGVuZ3RofWBcbiAgKTtcblxuICAvLyBXaGVuIHVwZGF0aW5nIHRoZSBtYW5pZmVzdCwgZW5zdXJlIGFsbCBcInVua25vd25cIiBrZXlzIGFyZSBhZGRlZCB0byB0aGVcbiAgLy8gbmV3IG1hbmlmZXN0LCBzbyB3ZSBkb24ndCBpbmFkdmVydGVudGx5IGRlbGV0ZSBzb21ldGhpbmcgd2UgZG9uJ3QgdW5kZXJzdGFuZFxuICB1bmtub3duUmVjb3Jkc0FycmF5LmZvckVhY2goKHJlY29yZDogVW5rbm93blJlY29yZCkgPT4ge1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgUHJvdG8uTWFuaWZlc3RSZWNvcmQuSWRlbnRpZmllcigpO1xuICAgIGlkZW50aWZpZXIudHlwZSA9IHJlY29yZC5pdGVtVHlwZTtcbiAgICBpZGVudGlmaWVyLnJhdyA9IEJ5dGVzLmZyb21CYXNlNjQocmVjb3JkLnN0b3JhZ2VJRCk7XG5cbiAgICBtYW5pZmVzdFJlY29yZEtleXMuYWRkKGlkZW50aWZpZXIpO1xuICB9KTtcblxuICBjb25zdCByZWNvcmRzV2l0aEVycm9yczogUmVhZG9ubHlBcnJheTxVbmtub3duUmVjb3JkPiA9IHdpbmRvdy5zdG9yYWdlLmdldChcbiAgICAnc3RvcmFnZS1zZXJ2aWNlLWVycm9yLXJlY29yZHMnLFxuICAgIG5ldyBBcnJheTxVbmtub3duUmVjb3JkPigpXG4gICk7XG4gIGNvbnN0IHJlZGFjdGVkRXJyb3JzID0gcmVjb3Jkc1dpdGhFcnJvcnMubWFwKHJlZGFjdEV4dGVuZGVkU3RvcmFnZUlEKTtcblxuICBsb2cuaW5mbyhcbiAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBhZGRpbmcgZXJyb3IgYCArXG4gICAgICBgcmVjb3Jkcz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkRXJyb3JzKX0gY291bnQ9JHtyZWRhY3RlZEVycm9ycy5sZW5ndGh9YFxuICApO1xuXG4gIC8vIFRoZXNlIHJlY29yZHMgZmFpbGVkIHRvIG1lcmdlIGluIHRoZSBwcmV2aW91cyBmZXRjaE1hbmlmZXN0LCBidXQgd2Ugc3RpbGxcbiAgLy8gbmVlZCB0byBpbmNsdWRlIHRoZW0gc28gdGhhdCB0aGUgbWFuaWZlc3QgaXMgY29tcGxldGVcbiAgcmVjb3Jkc1dpdGhFcnJvcnMuZm9yRWFjaCgocmVjb3JkOiBVbmtub3duUmVjb3JkKSA9PiB7XG4gICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBQcm90by5NYW5pZmVzdFJlY29yZC5JZGVudGlmaWVyKCk7XG4gICAgaWRlbnRpZmllci50eXBlID0gcmVjb3JkLml0ZW1UeXBlO1xuICAgIGlkZW50aWZpZXIucmF3ID0gQnl0ZXMuZnJvbUJhc2U2NChyZWNvcmQuc3RvcmFnZUlEKTtcblxuICAgIG1hbmlmZXN0UmVjb3JkS2V5cy5hZGQoaWRlbnRpZmllcik7XG4gIH0pO1xuXG4gIC8vIERlbGV0ZSBrZXlzIHRoYXQgd2Ugd2FudGVkIHRvIGRyb3AgZHVyaW5nIHRoZSBwcm9jZXNzaW5nIG9mIHRoZSBtYW5pZmVzdC5cbiAgY29uc3Qgc3RvcmVkUGVuZGluZ0RlbGV0ZXMgPSB3aW5kb3cuc3RvcmFnZS5nZXQoXG4gICAgJ3N0b3JhZ2Utc2VydmljZS1wZW5kaW5nLWRlbGV0ZXMnLFxuICAgIFtdXG4gICk7XG4gIGNvbnN0IHJlZGFjdGVkUGVuZGluZ0RlbGV0ZXMgPSBzdG9yZWRQZW5kaW5nRGVsZXRlcy5tYXAoXG4gICAgcmVkYWN0RXh0ZW5kZWRTdG9yYWdlSURcbiAgKTtcbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogYCArXG4gICAgICBgZGVsZXRpbmcgZXh0cmEga2V5cz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkUGVuZGluZ0RlbGV0ZXMpfSBgICtcbiAgICAgIGBjb3VudD0ke3JlZGFjdGVkUGVuZGluZ0RlbGV0ZXMubGVuZ3RofWBcbiAgKTtcblxuICBmb3IgKGNvbnN0IHsgc3RvcmFnZUlEIH0gb2Ygc3RvcmVkUGVuZGluZ0RlbGV0ZXMpIHtcbiAgICBkZWxldGVLZXlzLnB1c2goQnl0ZXMuZnJvbUJhc2U2NChzdG9yYWdlSUQpKTtcbiAgfVxuXG4gIC8vIFZhbGlkYXRlIGJlZm9yZSB3cml0aW5nXG5cbiAgY29uc3QgcmF3RHVwbGljYXRlcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdHlwZVJhd0R1cGxpY2F0ZXMgPSBuZXcgU2V0KCk7XG4gIGxldCBoYXNBY2NvdW50VHlwZSA9IGZhbHNlO1xuICBtYW5pZmVzdFJlY29yZEtleXMuZm9yRWFjaChpZGVudGlmaWVyID0+IHtcbiAgICAvLyBFbnN1cmUgdGhlcmUgYXJlIG5vIGR1cGxpY2F0ZSBTdG9yYWdlSWRlbnRpZmllcnMgaW4geW91ciBtYW5pZmVzdFxuICAgIC8vICAgVGhpcyBjYW4gYmUgYnJva2VuIGRvd24gaW50byB0d28gcGFydHM6XG4gICAgLy8gICAgIFRoZXJlIGFyZSBubyBkdXBsaWNhdGUgdHlwZStyYXcgcGFpcnNcbiAgICAvLyAgICAgVGhlcmUgYXJlIG5vIGR1cGxpY2F0ZSByYXcgYnl0ZXNcbiAgICBzdHJpY3RBc3NlcnQoaWRlbnRpZmllci5yYXcsICdtYW5pZmVzdCByZWNvcmQga2V5IHdpdGhvdXQgcmF3IGlkZW50aWZpZXInKTtcbiAgICBjb25zdCBzdG9yYWdlSUQgPSBCeXRlcy50b0Jhc2U2NChpZGVudGlmaWVyLnJhdyk7XG4gICAgY29uc3QgdHlwZUFuZFJhdyA9IGAke2lkZW50aWZpZXIudHlwZX0rJHtzdG9yYWdlSUR9YDtcbiAgICBpZiAoXG4gICAgICByYXdEdXBsaWNhdGVzLmhhcyhpZGVudGlmaWVyLnJhdykgfHxcbiAgICAgIHR5cGVSYXdEdXBsaWNhdGVzLmhhcyh0eXBlQW5kUmF3KVxuICAgICkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IHJlbW92aW5nIGZyb20gZHVwbGljYXRlIGl0ZW0gYCArXG4gICAgICAgICAgJ2Zyb20gdGhlIG1hbmlmZXN0JyxcbiAgICAgICAgcmVkYWN0U3RvcmFnZUlEKHN0b3JhZ2VJRCksXG4gICAgICAgIGlkZW50aWZpZXIudHlwZVxuICAgICAgKTtcbiAgICAgIG1hbmlmZXN0UmVjb3JkS2V5cy5kZWxldGUoaWRlbnRpZmllcik7XG4gICAgfVxuICAgIHJhd0R1cGxpY2F0ZXMuYWRkKGlkZW50aWZpZXIucmF3KTtcbiAgICB0eXBlUmF3RHVwbGljYXRlcy5hZGQodHlwZUFuZFJhdyk7XG5cbiAgICAvLyBFbnN1cmUgYWxsIGRlbGV0ZXMgYXJlIG5vdCBwcmVzZW50IGluIHRoZSBtYW5pZmVzdFxuICAgIGNvbnN0IGhhc0RlbGV0ZUtleSA9IGRlbGV0ZUtleXMuZmluZChcbiAgICAgIGtleSA9PiBCeXRlcy50b0Jhc2U2NChrZXkpID09PSBzdG9yYWdlSURcbiAgICApO1xuICAgIGlmIChoYXNEZWxldGVLZXkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiByZW1vdmluZyBrZXkgd2hpY2ggaGFzIGJlZW4gZGVsZXRlZGAsXG4gICAgICAgIHJlZGFjdFN0b3JhZ2VJRChzdG9yYWdlSUQpLFxuICAgICAgICBpZGVudGlmaWVyLnR5cGVcbiAgICAgICk7XG4gICAgICBtYW5pZmVzdFJlY29yZEtleXMuZGVsZXRlKGlkZW50aWZpZXIpO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZXJlIGlzICpleGFjdGx5KiBvbmUgQWNjb3VudCB0eXBlIGluIHRoZSBtYW5pZmVzdFxuICAgIGlmIChpZGVudGlmaWVyLnR5cGUgPT09IElURU1fVFlQRS5BQ0NPVU5UKSB7XG4gICAgICBpZiAoaGFzQWNjb3VudFR5cGUpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogcmVtb3ZpbmcgZHVwbGljYXRlIGFjY291bnRgLFxuICAgICAgICAgIHJlZGFjdFN0b3JhZ2VJRChzdG9yYWdlSUQpXG4gICAgICAgICk7XG4gICAgICAgIG1hbmlmZXN0UmVjb3JkS2V5cy5kZWxldGUoaWRlbnRpZmllcik7XG4gICAgICB9XG4gICAgICBoYXNBY2NvdW50VHlwZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByYXdEdXBsaWNhdGVzLmNsZWFyKCk7XG4gIHR5cGVSYXdEdXBsaWNhdGVzLmNsZWFyKCk7XG5cbiAgY29uc3Qgc3RvcmFnZUtleUR1cGxpY2F0ZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBuZXdJdGVtcy5mb3JFYWNoKHN0b3JhZ2VJdGVtID0+IHtcbiAgICAvLyBFbnN1cmUgdGhlcmUgYXJlIG5vIGR1cGxpY2F0ZSBTdG9yYWdlSWRlbnRpZmllcnMgaW4geW91ciBsaXN0IG9mIGluc2VydHNcbiAgICBzdHJpY3RBc3NlcnQoc3RvcmFnZUl0ZW0ua2V5LCAnTmV3IHN0b3JhZ2UgaXRlbSB3aXRob3V0IGtleScpO1xuXG4gICAgY29uc3Qgc3RvcmFnZUlEID0gQnl0ZXMudG9CYXNlNjQoc3RvcmFnZUl0ZW0ua2V5KTtcbiAgICBpZiAoc3RvcmFnZUtleUR1cGxpY2F0ZXMuaGFzKHN0b3JhZ2VJRCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBgICtcbiAgICAgICAgICAncmVtb3ZpbmcgZHVwbGljYXRlIGlkZW50aWZpZXIgZnJvbSBpbnNlcnRzJyxcbiAgICAgICAgcmVkYWN0U3RvcmFnZUlEKHN0b3JhZ2VJRClcbiAgICAgICk7XG4gICAgICBuZXdJdGVtcy5kZWxldGUoc3RvcmFnZUl0ZW0pO1xuICAgIH1cbiAgICBzdG9yYWdlS2V5RHVwbGljYXRlcy5hZGQoc3RvcmFnZUlEKTtcbiAgfSk7XG5cbiAgc3RvcmFnZUtleUR1cGxpY2F0ZXMuY2xlYXIoKTtcblxuICAvLyBJZiB3ZSBoYXZlIGEgY29weSBvZiB3aGF0IHRoZSBjdXJyZW50IHJlbW90ZSBtYW5pZmVzdCBpcyB0aGVuIHdlIHJ1biB0aGVzZVxuICAvLyBhZGRpdGlvbmFsIHZhbGlkYXRpb25zIGNvbXBhcmluZyBvdXIgcGVuZGluZyBtYW5pZmVzdCB0byB0aGUgcmVtb3RlXG4gIC8vIG1hbmlmZXN0OlxuICBpZiAocHJldmlvdXNNYW5pZmVzdCkge1xuICAgIGNvbnN0IHBlbmRpbmdJbnNlcnRzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBwZW5kaW5nRGVsZXRlczogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCByZW1vdGVLZXlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgICAocHJldmlvdXNNYW5pZmVzdC5rZXlzID8/IFtdKS5mb3JFYWNoKFxuICAgICAgKGlkZW50aWZpZXI6IElNYW5pZmVzdFJlY29yZElkZW50aWZpZXIpID0+IHtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KGlkZW50aWZpZXIucmF3LCAnSWRlbnRpZmllciB3aXRob3V0IHJhdyBmaWVsZCcpO1xuICAgICAgICBjb25zdCBzdG9yYWdlSUQgPSBCeXRlcy50b0Jhc2U2NChpZGVudGlmaWVyLnJhdyk7XG4gICAgICAgIHJlbW90ZUtleXMuYWRkKHN0b3JhZ2VJRCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGxvY2FsS2V5czogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG4gICAgbWFuaWZlc3RSZWNvcmRLZXlzLmZvckVhY2goKGlkZW50aWZpZXI6IElNYW5pZmVzdFJlY29yZElkZW50aWZpZXIpID0+IHtcbiAgICAgIHN0cmljdEFzc2VydChpZGVudGlmaWVyLnJhdywgJ0lkZW50aWZpZXIgd2l0aG91dCByYXcgZmllbGQnKTtcbiAgICAgIGNvbnN0IHN0b3JhZ2VJRCA9IEJ5dGVzLnRvQmFzZTY0KGlkZW50aWZpZXIucmF3KTtcbiAgICAgIGxvY2FsS2V5cy5hZGQoc3RvcmFnZUlEKTtcblxuICAgICAgaWYgKCFyZW1vdGVLZXlzLmhhcyhzdG9yYWdlSUQpKSB7XG4gICAgICAgIHBlbmRpbmdJbnNlcnRzLmFkZChzdG9yYWdlSUQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVtb3RlS2V5cy5mb3JFYWNoKHN0b3JhZ2VJRCA9PiB7XG4gICAgICBpZiAoIWxvY2FsS2V5cy5oYXMoc3RvcmFnZUlEKSkge1xuICAgICAgICBwZW5kaW5nRGVsZXRlcy5hZGQoc3RvcmFnZUlEKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkZWxldGVLZXlzLmxlbmd0aCAhPT0gcGVuZGluZ0RlbGV0ZXMuc2l6ZSkge1xuICAgICAgY29uc3QgbG9jYWxEZWxldGVzID0gZGVsZXRlS2V5cy5tYXAoa2V5ID0+XG4gICAgICAgIHJlZGFjdFN0b3JhZ2VJRChCeXRlcy50b0Jhc2U2NChrZXkpKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlbW90ZURlbGV0ZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgIHBlbmRpbmdEZWxldGVzLmZvckVhY2goaWQgPT4gcmVtb3RlRGVsZXRlcy5wdXNoKHJlZGFjdFN0b3JhZ2VJRChpZCkpKTtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogZGVsZXRlIGtleSBzaXplcyBkbyBub3QgbWF0Y2hgLFxuICAgICAgICAnbG9jYWwnLFxuICAgICAgICBsb2NhbERlbGV0ZXMuam9pbignLCcpLFxuICAgICAgICAncmVtb3RlJyxcbiAgICAgICAgcmVtb3RlRGVsZXRlcy5qb2luKCcsJylcbiAgICAgICk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgd3JpdGUgZGVsZXRlIGtleXMgbGVuZ3RoIGRvIG5vdCBtYXRjaCcpO1xuICAgIH1cbiAgICBpZiAobmV3SXRlbXMuc2l6ZSAhPT0gcGVuZGluZ0luc2VydHMuc2l6ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHdyaXRlIGluc2VydCBpdGVtcyBsZW5ndGggZG8gbm90IG1hdGNoJyk7XG4gICAgfVxuICAgIGRlbGV0ZUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmFnZUlEID0gQnl0ZXMudG9CYXNlNjQoa2V5KTtcbiAgICAgIGlmICghcGVuZGluZ0RlbGV0ZXMuaGFzKHN0b3JhZ2VJRCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdpbnZhbGlkIHdyaXRlIGRlbGV0ZSBrZXkgbWlzc2luZyBmcm9tIHBlbmRpbmcgZGVsZXRlcydcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbnNlcnRLZXlzLmZvckVhY2goc3RvcmFnZUlEID0+IHtcbiAgICAgIGlmICghcGVuZGluZ0luc2VydHMuaGFzKHN0b3JhZ2VJRCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdpbnZhbGlkIHdyaXRlIGluc2VydCBrZXkgbWlzc2luZyBmcm9tIHBlbmRpbmcgaW5zZXJ0cydcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hbmlmZXN0UmVjb3JkID0gbmV3IFByb3RvLk1hbmlmZXN0UmVjb3JkKCk7XG4gIG1hbmlmZXN0UmVjb3JkLnZlcnNpb24gPSBMb25nLmZyb21OdW1iZXIodmVyc2lvbik7XG4gIG1hbmlmZXN0UmVjb3JkLnNvdXJjZURldmljZSA9IHdpbmRvdy5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKSA/PyAwO1xuICBtYW5pZmVzdFJlY29yZC5rZXlzID0gQXJyYXkuZnJvbShtYW5pZmVzdFJlY29yZEtleXMpO1xuXG4gIGNvbnN0IHN0b3JhZ2VLZXlCYXNlNjQgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ3N0b3JhZ2VLZXknKTtcbiAgaWYgKCFzdG9yYWdlS2V5QmFzZTY0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzdG9yYWdlIGtleScpO1xuICB9XG4gIGNvbnN0IHN0b3JhZ2VLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KHN0b3JhZ2VLZXlCYXNlNjQpO1xuICBjb25zdCBzdG9yYWdlTWFuaWZlc3RLZXkgPSBkZXJpdmVTdG9yYWdlTWFuaWZlc3RLZXkoXG4gICAgc3RvcmFnZUtleSxcbiAgICBMb25nLmZyb21OdW1iZXIodmVyc2lvbilcbiAgKTtcbiAgY29uc3QgZW5jcnlwdGVkTWFuaWZlc3QgPSBlbmNyeXB0UHJvZmlsZShcbiAgICBQcm90by5NYW5pZmVzdFJlY29yZC5lbmNvZGUobWFuaWZlc3RSZWNvcmQpLmZpbmlzaCgpLFxuICAgIHN0b3JhZ2VNYW5pZmVzdEtleVxuICApO1xuXG4gIGNvbnN0IHN0b3JhZ2VNYW5pZmVzdCA9IG5ldyBQcm90by5TdG9yYWdlTWFuaWZlc3QoKTtcbiAgc3RvcmFnZU1hbmlmZXN0LnZlcnNpb24gPSBtYW5pZmVzdFJlY29yZC52ZXJzaW9uO1xuICBzdG9yYWdlTWFuaWZlc3QudmFsdWUgPSBlbmNyeXB0ZWRNYW5pZmVzdDtcblxuICByZXR1cm4ge1xuICAgIHBvc3RVcGxvYWRVcGRhdGVGdW5jdGlvbnMsXG4gICAgZGVsZXRlS2V5cyxcbiAgICBuZXdJdGVtcyxcbiAgICBzdG9yYWdlTWFuaWZlc3QsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwbG9hZE1hbmlmZXN0KFxuICB2ZXJzaW9uOiBudW1iZXIsXG4gIHtcbiAgICBwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zLFxuICAgIGRlbGV0ZUtleXMsXG4gICAgbmV3SXRlbXMsXG4gICAgc3RvcmFnZU1hbmlmZXN0LFxuICB9OiBHZW5lcmF0ZWRNYW5pZmVzdFR5cGVcbik6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIXdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZykge1xuICAgIHRocm93IG5ldyBFcnJvcignc3RvcmFnZVNlcnZpY2UudXBsb2FkTWFuaWZlc3Q6IFdlIGFyZSBvZmZsaW5lIScpO1xuICB9XG5cbiAgaWYgKG5ld0l0ZW1zLnNpemUgPT09IDAgJiYgZGVsZXRlS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBsb2cuaW5mbyhgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBub3RoaW5nIHRvIHVwbG9hZGApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNyZWRlbnRpYWxzID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdzdG9yYWdlQ3JlZGVudGlhbHMnKTtcbiAgdHJ5IHtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IGluc2VydGluZz0ke25ld0l0ZW1zLnNpemV9IGAgK1xuICAgICAgICBgZGVsZXRpbmc9JHtkZWxldGVLZXlzLmxlbmd0aH1gXG4gICAgKTtcblxuICAgIGNvbnN0IHdyaXRlT3BlcmF0aW9uID0gbmV3IFByb3RvLldyaXRlT3BlcmF0aW9uKCk7XG4gICAgd3JpdGVPcGVyYXRpb24ubWFuaWZlc3QgPSBzdG9yYWdlTWFuaWZlc3Q7XG4gICAgd3JpdGVPcGVyYXRpb24uaW5zZXJ0SXRlbSA9IEFycmF5LmZyb20obmV3SXRlbXMpO1xuICAgIHdyaXRlT3BlcmF0aW9uLmRlbGV0ZUtleSA9IGRlbGV0ZUtleXM7XG5cbiAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcubW9kaWZ5U3RvcmFnZVJlY29yZHMoXG4gICAgICBQcm90by5Xcml0ZU9wZXJhdGlvbi5lbmNvZGUod3JpdGVPcGVyYXRpb24pLmZpbmlzaCgpLFxuICAgICAge1xuICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiB1cGxvYWQgY29tcGxldGUsIHVwZGF0aW5nIGAgK1xuICAgICAgICBgaXRlbXM9JHtwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zLmxlbmd0aH1gXG4gICAgKTtcblxuICAgIC8vIHVwZGF0ZSBjb252ZXJzYXRpb25zIHdpdGggdGhlIG5ldyBzdG9yYWdlSURcbiAgICBwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IGZhaWxlZCFgLFxuICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycilcbiAgICApO1xuXG4gICAgaWYgKGVyci5jb2RlID09PSA0MDkpIHtcbiAgICAgIGlmIChjb25mbGljdEJhY2tPZmYuaXNGdWxsKCkpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IGV4Y2VlZGVkIG1heGltdW0gY29uc2VjdXRpdmUgYCArXG4gICAgICAgICAgICAnY29uZmxpY3RzJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBjb25mbGljdCBmb3VuZCB3aXRoIGAgK1xuICAgICAgICAgIGB2ZXJzaW9uPSR7dmVyc2lvbn0sIHJ1bm5pbmcgc3luYyBqb2IgYCArXG4gICAgICAgICAgYHRpbWVzPSR7Y29uZmxpY3RCYWNrT2ZmLmdldEluZGV4KCl9YFxuICAgICAgKTtcblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHRocm93IGVycjtcbiAgfVxuXG4gIGxvZy5pbmZvKGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IHNldHRpbmcgbmV3IG1hbmlmZXN0VmVyc2lvbmApO1xuICB3aW5kb3cuc3RvcmFnZS5wdXQoJ21hbmlmZXN0VmVyc2lvbicsIHZlcnNpb24pO1xuICBjb25mbGljdEJhY2tPZmYucmVzZXQoKTtcbiAgYmFja09mZi5yZXNldCgpO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgc2luZ2xlUHJvdG9Kb2JRdWV1ZS5hZGQoTWVzc2FnZVNlbmRlci5nZXRGZXRjaE1hbmlmZXN0U3luY01lc3NhZ2UoKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLmVycm9yKFxuICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnVwbG9hZCgke3ZlcnNpb259KTogRmFpbGVkIHRvIHF1ZXVlIHN5bmMgbWVzc2FnZWAsXG4gICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdG9wU3RvcmFnZVNlcnZpY2VTeW5jKHJlYXNvbjogRXJyb3IpIHtcbiAgbG9nLndhcm4oJ3N0b3JhZ2VTZXJ2aWNlLnN0b3BTdG9yYWdlU2VydmljZVN5bmMnLCBFcnJvcnMudG9Mb2dGb3JtYXQocmVhc29uKSk7XG5cbiAgYXdhaXQgd2luZG93LnN0b3JhZ2UucmVtb3ZlKCdzdG9yYWdlS2V5Jyk7XG5cbiAgaWYgKGJhY2tPZmYuaXNGdWxsKCkpIHtcbiAgICBsb2cud2FybihcbiAgICAgICdzdG9yYWdlU2VydmljZS5zdG9wU3RvcmFnZVNlcnZpY2VTeW5jOiB0b28gbWFueSBjb25zZWN1dGl2ZSBzdG9wcydcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IHNsZWVwKGJhY2tPZmYuZ2V0QW5kSW5jcmVtZW50KCkpO1xuICBsb2cuaW5mbygnc3RvcmFnZVNlcnZpY2Uuc3RvcFN0b3JhZ2VTZXJ2aWNlU3luYzogcmVxdWVzdGluZyBuZXcga2V5cycpO1xuICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICBpZiAod2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuYXJlV2VQcmltYXJ5RGV2aWNlKCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICAnc3RvcFN0b3JhZ2VTZXJ2aWNlU3luYzogV2UgYXJlIHByaW1hcnkgZGV2aWNlOyBub3Qgc2VuZGluZyBrZXkgc3luYyByZXF1ZXN0J1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHNpbmdsZVByb3RvSm9iUXVldWUuYWRkKE1lc3NhZ2VTZW5kZXIuZ2V0UmVxdWVzdEtleVN5bmNNZXNzYWdlKCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzdG9yYWdlU2VydmljZS5zdG9wU3RvcmFnZVNlcnZpY2VTeW5jOiBGYWlsZWQgdG8gcXVldWUgc3luYyBtZXNzYWdlJyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVOZXdNYW5pZmVzdCgpIHtcbiAgbG9nLmluZm8oJ3N0b3JhZ2VTZXJ2aWNlLmNyZWF0ZU5ld01hbmlmZXN0OiBjcmVhdGluZyBuZXcgbWFuaWZlc3QnKTtcblxuICBjb25zdCB2ZXJzaW9uID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdtYW5pZmVzdFZlcnNpb24nLCAwKTtcblxuICBjb25zdCB7IHBvc3RVcGxvYWRVcGRhdGVGdW5jdGlvbnMsIG5ld0l0ZW1zLCBzdG9yYWdlTWFuaWZlc3QgfSA9XG4gICAgYXdhaXQgZ2VuZXJhdGVNYW5pZmVzdCh2ZXJzaW9uLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gIGF3YWl0IHVwbG9hZE1hbmlmZXN0KHZlcnNpb24sIHtcbiAgICBwb3N0VXBsb2FkVXBkYXRlRnVuY3Rpb25zLFxuICAgIC8vIHdlIGhhdmUgY3JlYXRlZCBhIG5ldyBtYW5pZmVzdCwgdGhlcmUgc2hvdWxkIGJlIG5vIGtleXMgdG8gZGVsZXRlXG4gICAgZGVsZXRlS2V5czogW10sXG4gICAgbmV3SXRlbXMsXG4gICAgc3RvcmFnZU1hbmlmZXN0LFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVjcnlwdE1hbmlmZXN0KFxuICBlbmNyeXB0ZWRNYW5pZmVzdDogUHJvdG8uSVN0b3JhZ2VNYW5pZmVzdFxuKTogUHJvbWlzZTxQcm90by5NYW5pZmVzdFJlY29yZD4ge1xuICBjb25zdCB7IHZlcnNpb24sIHZhbHVlIH0gPSBlbmNyeXB0ZWRNYW5pZmVzdDtcblxuICBjb25zdCBzdG9yYWdlS2V5QmFzZTY0ID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdzdG9yYWdlS2V5Jyk7XG4gIGlmICghc3RvcmFnZUtleUJhc2U2NCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gc3RvcmFnZSBrZXknKTtcbiAgfVxuICBjb25zdCBzdG9yYWdlS2V5ID0gQnl0ZXMuZnJvbUJhc2U2NChzdG9yYWdlS2V5QmFzZTY0KTtcbiAgY29uc3Qgc3RvcmFnZU1hbmlmZXN0S2V5ID0gZGVyaXZlU3RvcmFnZU1hbmlmZXN0S2V5KFxuICAgIHN0b3JhZ2VLZXksXG4gICAgZHJvcE51bGwodmVyc2lvbilcbiAgKTtcblxuICBzdHJpY3RBc3NlcnQodmFsdWUsICdTdG9yYWdlTWFuaWZlc3QgaGFzIG5vIHZhbHVlIGZpZWxkJyk7XG4gIGNvbnN0IGRlY3J5cHRlZE1hbmlmZXN0ID0gZGVjcnlwdFByb2ZpbGUodmFsdWUsIHN0b3JhZ2VNYW5pZmVzdEtleSk7XG5cbiAgcmV0dXJuIFByb3RvLk1hbmlmZXN0UmVjb3JkLmRlY29kZShkZWNyeXB0ZWRNYW5pZmVzdCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoTWFuaWZlc3QoXG4gIG1hbmlmZXN0VmVyc2lvbjogbnVtYmVyXG4pOiBQcm9taXNlPFByb3RvLk1hbmlmZXN0UmVjb3JkIHwgdW5kZWZpbmVkPiB7XG4gIGxvZy5pbmZvKCdzdG9yYWdlU2VydmljZS5zeW5jOiBmZXRjaCBzdGFydCcpO1xuXG4gIGlmICghd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdG9yYWdlU2VydmljZS5zeW5jOiB3ZSBhcmUgb2ZmbGluZSEnKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgY3JlZGVudGlhbHMgPVxuICAgICAgYXdhaXQgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLmdldFN0b3JhZ2VDcmVkZW50aWFscygpO1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnc3RvcmFnZUNyZWRlbnRpYWxzJywgY3JlZGVudGlhbHMpO1xuXG4gICAgY29uc3QgbWFuaWZlc3RCaW5hcnkgPSBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcuZ2V0U3RvcmFnZU1hbmlmZXN0KFxuICAgICAge1xuICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgICAgZ3JlYXRlclRoYW5WZXJzaW9uOiBtYW5pZmVzdFZlcnNpb24sXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCBlbmNyeXB0ZWRNYW5pZmVzdCA9IFByb3RvLlN0b3JhZ2VNYW5pZmVzdC5kZWNvZGUobWFuaWZlc3RCaW5hcnkpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBkZWNyeXB0TWFuaWZlc3QoZW5jcnlwdGVkTWFuaWZlc3QpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgYXdhaXQgc3RvcFN0b3JhZ2VTZXJ2aWNlU3luYyhlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAyMDQpIHtcbiAgICAgIGxvZy5pbmZvKCdzdG9yYWdlU2VydmljZS5zeW5jOiBubyBuZXdlciBtYW5pZmVzdCwgb2snKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuZXJyb3IoJ3N0b3JhZ2VTZXJ2aWNlLnN5bmM6IGZhaWxlZCEnLCBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKSk7XG5cbiAgICBpZiAoZXJyLmNvZGUgPT09IDQwNCkge1xuICAgICAgYXdhaXQgY3JlYXRlTmV3TWFuaWZlc3QoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn1cblxudHlwZSBNZXJnZWFibGVJdGVtVHlwZSA9IHtcbiAgaXRlbVR5cGU6IG51bWJlcjtcbiAgc3RvcmFnZUlEOiBzdHJpbmc7XG4gIHN0b3JhZ2VSZWNvcmQ6IFByb3RvLklTdG9yYWdlUmVjb3JkO1xufTtcblxudHlwZSBNZXJnZWRSZWNvcmRUeXBlID0gVW5rbm93blJlY29yZCAmIHtcbiAgaGFzQ29uZmxpY3Q6IGJvb2xlYW47XG4gIHNob3VsZERyb3A6IGJvb2xlYW47XG4gIGhhc0Vycm9yOiBib29sZWFuO1xuICBpc1Vuc3VwcG9ydGVkOiBib29sZWFuO1xuICB1cGRhdGVkQ29udmVyc2F0aW9uczogUmVhZG9ubHlBcnJheTxDb252ZXJzYXRpb25Nb2RlbD47XG4gIG5lZWRQcm9maWxlRmV0Y2g6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+O1xufTtcblxuYXN5bmMgZnVuY3Rpb24gbWVyZ2VSZWNvcmQoXG4gIHN0b3JhZ2VWZXJzaW9uOiBudW1iZXIsXG4gIGl0ZW1Ub01lcmdlOiBNZXJnZWFibGVJdGVtVHlwZVxuKTogUHJvbWlzZTxNZXJnZWRSZWNvcmRUeXBlPiB7XG4gIGNvbnN0IHsgaXRlbVR5cGUsIHN0b3JhZ2VJRCwgc3RvcmFnZVJlY29yZCB9ID0gaXRlbVRvTWVyZ2U7XG5cbiAgY29uc3QgSVRFTV9UWVBFID0gUHJvdG8uTWFuaWZlc3RSZWNvcmQuSWRlbnRpZmllci5UeXBlO1xuXG4gIGxldCBtZXJnZVJlc3VsdDogTWVyZ2VSZXN1bHRUeXBlID0geyBoYXNDb25mbGljdDogZmFsc2UsIGRldGFpbHM6IFtdIH07XG4gIGxldCBpc1Vuc3VwcG9ydGVkID0gZmFsc2U7XG4gIGxldCBoYXNFcnJvciA9IGZhbHNlO1xuICBsZXQgdXBkYXRlZENvbnZlcnNhdGlvbnMgPSBuZXcgQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+KCk7XG4gIGNvbnN0IG5lZWRQcm9maWxlRmV0Y2ggPSBuZXcgQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+KCk7XG5cbiAgdHJ5IHtcbiAgICBpZiAoaXRlbVR5cGUgPT09IElURU1fVFlQRS5VTktOT1dOKSB7XG4gICAgICBsb2cud2Fybignc3RvcmFnZVNlcnZpY2UubWVyZ2VSZWNvcmQ6IFVua25vd24gaXRlbSB0eXBlJywgc3RvcmFnZUlEKTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1UeXBlID09PSBJVEVNX1RZUEUuQ09OVEFDVCAmJiBzdG9yYWdlUmVjb3JkLmNvbnRhY3QpIHtcbiAgICAgIG1lcmdlUmVzdWx0ID0gYXdhaXQgbWVyZ2VDb250YWN0UmVjb3JkKFxuICAgICAgICBzdG9yYWdlSUQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgICBzdG9yYWdlUmVjb3JkLmNvbnRhY3RcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpdGVtVHlwZSA9PT0gSVRFTV9UWVBFLkdST1VQVjEgJiYgc3RvcmFnZVJlY29yZC5ncm91cFYxKSB7XG4gICAgICBtZXJnZVJlc3VsdCA9IGF3YWl0IG1lcmdlR3JvdXBWMVJlY29yZChcbiAgICAgICAgc3RvcmFnZUlELFxuICAgICAgICBzdG9yYWdlVmVyc2lvbixcbiAgICAgICAgc3RvcmFnZVJlY29yZC5ncm91cFYxXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXRlbVR5cGUgPT09IElURU1fVFlQRS5HUk9VUFYyICYmIHN0b3JhZ2VSZWNvcmQuZ3JvdXBWMikge1xuICAgICAgbWVyZ2VSZXN1bHQgPSBhd2FpdCBtZXJnZUdyb3VwVjJSZWNvcmQoXG4gICAgICAgIHN0b3JhZ2VJRCxcbiAgICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICAgIHN0b3JhZ2VSZWNvcmQuZ3JvdXBWMlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1UeXBlID09PSBJVEVNX1RZUEUuQUNDT1VOVCAmJiBzdG9yYWdlUmVjb3JkLmFjY291bnQpIHtcbiAgICAgIG1lcmdlUmVzdWx0ID0gYXdhaXQgbWVyZ2VBY2NvdW50UmVjb3JkKFxuICAgICAgICBzdG9yYWdlSUQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgICBzdG9yYWdlUmVjb3JkLmFjY291bnRcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGl0ZW1UeXBlID09PSBJVEVNX1RZUEUuU1RPUllfRElTVFJJQlVUSU9OX0xJU1QgJiZcbiAgICAgIHN0b3JhZ2VSZWNvcmQuc3RvcnlEaXN0cmlidXRpb25MaXN0XG4gICAgKSB7XG4gICAgICBtZXJnZVJlc3VsdCA9IGF3YWl0IG1lcmdlU3RvcnlEaXN0cmlidXRpb25MaXN0UmVjb3JkKFxuICAgICAgICBzdG9yYWdlSUQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgICBzdG9yYWdlUmVjb3JkLnN0b3J5RGlzdHJpYnV0aW9uTGlzdFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgaXRlbVR5cGUgPT09IElURU1fVFlQRS5TVElDS0VSX1BBQ0sgJiZcbiAgICAgIHN0b3JhZ2VSZWNvcmQuc3RpY2tlclBhY2tcbiAgICApIHtcbiAgICAgIG1lcmdlUmVzdWx0ID0gYXdhaXQgbWVyZ2VTdGlja2VyUGFja1JlY29yZChcbiAgICAgICAgc3RvcmFnZUlELFxuICAgICAgICBzdG9yYWdlVmVyc2lvbixcbiAgICAgICAgc3RvcmFnZVJlY29yZC5zdGlja2VyUGFja1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNVbnN1cHBvcnRlZCA9IHRydWU7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLm1lcmdlKCR7cmVkYWN0U3RvcmFnZUlEKFxuICAgICAgICAgIHN0b3JhZ2VJRCxcbiAgICAgICAgICBzdG9yYWdlVmVyc2lvblxuICAgICAgICApfSk6IHVua25vd24gaXRlbSB0eXBlPSR7aXRlbVR5cGV9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWRhY3RlZElEID0gcmVkYWN0U3RvcmFnZUlEKFxuICAgICAgc3RvcmFnZUlELFxuICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICBtZXJnZVJlc3VsdC5jb252ZXJzYXRpb25cbiAgICApO1xuICAgIGNvbnN0IG9sZElEID0gbWVyZ2VSZXN1bHQub2xkU3RvcmFnZUlEXG4gICAgICA/IHJlZGFjdFN0b3JhZ2VJRChtZXJnZVJlc3VsdC5vbGRTdG9yYWdlSUQsIG1lcmdlUmVzdWx0Lm9sZFN0b3JhZ2VWZXJzaW9uKVxuICAgICAgOiAnPyc7XG4gICAgdXBkYXRlZENvbnZlcnNhdGlvbnMgPSBbXG4gICAgICAuLi51cGRhdGVkQ29udmVyc2F0aW9ucyxcbiAgICAgIC4uLihtZXJnZVJlc3VsdC51cGRhdGVkQ29udmVyc2F0aW9ucyA/PyBbXSksXG4gICAgXTtcbiAgICBpZiAobWVyZ2VSZXN1bHQubmVlZHNQcm9maWxlRmV0Y2gpIHtcbiAgICAgIHN0cmljdEFzc2VydChtZXJnZVJlc3VsdC5jb252ZXJzYXRpb24sICduZWVkc1Byb2ZpbGVGZXRjaCwgYnV0IG5vIGNvbnZvJyk7XG4gICAgICBuZWVkUHJvZmlsZUZldGNoLnB1c2gobWVyZ2VSZXN1bHQuY29udmVyc2F0aW9uKTtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBzdG9yYWdlU2VydmljZS5tZXJnZSgke3JlZGFjdGVkSUR9KTogbWVyZ2VkIGl0ZW0gdHlwZT0ke2l0ZW1UeXBlfSBgICtcbiAgICAgICAgYG9sZElEPSR7b2xkSUR9IGAgK1xuICAgICAgICBgY29uZmxpY3Q9JHttZXJnZVJlc3VsdC5oYXNDb25mbGljdH0gYCArXG4gICAgICAgIGBzaG91bGREcm9wPSR7Qm9vbGVhbihtZXJnZVJlc3VsdC5zaG91bGREcm9wKX0gYCArXG4gICAgICAgIGBkZXRhaWxzPSR7SlNPTi5zdHJpbmdpZnkobWVyZ2VSZXN1bHQuZGV0YWlscyl9YFxuICAgICk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICBjb25zdCByZWRhY3RlZElEID0gcmVkYWN0U3RvcmFnZUlEKHN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24pO1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBzdG9yYWdlU2VydmljZS5tZXJnZSgke3JlZGFjdGVkSUR9KTogZXJyb3Igd2l0aCBgICtcbiAgICAgICAgYGl0ZW0gdHlwZT0ke2l0ZW1UeXBlfSBgICtcbiAgICAgICAgYGRldGFpbHM9JHtFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKX1gXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzQ29uZmxpY3Q6IG1lcmdlUmVzdWx0Lmhhc0NvbmZsaWN0LFxuICAgIHNob3VsZERyb3A6IEJvb2xlYW4obWVyZ2VSZXN1bHQuc2hvdWxkRHJvcCksXG4gICAgaGFzRXJyb3IsXG4gICAgaXNVbnN1cHBvcnRlZCxcbiAgICBpdGVtVHlwZSxcbiAgICBzdG9yYWdlSUQsXG4gICAgdXBkYXRlZENvbnZlcnNhdGlvbnMsXG4gICAgbmVlZFByb2ZpbGVGZXRjaCxcbiAgfTtcbn1cblxudHlwZSBOb25Db252ZXJzYXRpb25SZWNvcmRzUmVzdWx0VHlwZSA9IFJlYWRvbmx5PHtcbiAgaW5zdGFsbGVkU3RpY2tlclBhY2tzOiBSZWFkb25seUFycmF5PFN0aWNrZXJQYWNrVHlwZT47XG4gIHVuaW5zdGFsbGVkU3RpY2tlclBhY2tzOiBSZWFkb25seUFycmF5PFVuaW5zdGFsbGVkU3RpY2tlclBhY2tUeXBlPjtcbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0czogUmVhZG9ubHlBcnJheTxTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZT47XG59PjtcblxuLy8gVE9ETzogREVTS1RPUC0zOTI5XG5hc3luYyBmdW5jdGlvbiBnZXROb25Db252ZXJzYXRpb25SZWNvcmRzKCk6IFByb21pc2U8Tm9uQ29udmVyc2F0aW9uUmVjb3Jkc1Jlc3VsdFR5cGU+IHtcbiAgY29uc3QgW1xuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgdW5pbnN0YWxsZWRTdGlja2VyUGFja3MsXG4gICAgaW5zdGFsbGVkU3RpY2tlclBhY2tzLFxuICBdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIGRhdGFJbnRlcmZhY2UuZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zV2l0aE1lbWJlcnMoKSxcbiAgICBkYXRhSW50ZXJmYWNlLmdldFVuaW5zdGFsbGVkU3RpY2tlclBhY2tzKCksXG4gICAgZGF0YUludGVyZmFjZS5nZXRJbnN0YWxsZWRTdGlja2VyUGFja3MoKSxcbiAgXSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLFxuICAgIHVuaW5zdGFsbGVkU3RpY2tlclBhY2tzLFxuICAgIGluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc01hbmlmZXN0KFxuICBtYW5pZmVzdDogUHJvdG8uSU1hbmlmZXN0UmVjb3JkLFxuICB2ZXJzaW9uOiBudW1iZXJcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGlmICghd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdG9yYWdlU2VydmljZS5wcm9jZXNzTWFuaWZlc3Q6IFdlIGFyZSBvZmZsaW5lIScpO1xuICB9XG5cbiAgY29uc3QgcmVtb3RlS2V5c1R5cGVNYXAgPSBuZXcgTWFwKCk7XG4gIChtYW5pZmVzdC5rZXlzIHx8IFtdKS5mb3JFYWNoKCh7IHJhdywgdHlwZSB9OiBJTWFuaWZlc3RSZWNvcmRJZGVudGlmaWVyKSA9PiB7XG4gICAgc3RyaWN0QXNzZXJ0KHJhdywgJ0lkZW50aWZpZXIgd2l0aG91dCByYXcgZmllbGQnKTtcbiAgICByZW1vdGVLZXlzVHlwZU1hcC5zZXQoQnl0ZXMudG9CYXNlNjQocmF3KSwgdHlwZSk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlbW90ZUtleXMgPSBuZXcgU2V0KHJlbW90ZUtleXNUeXBlTWFwLmtleXMoKSk7XG4gIGNvbnN0IGxvY2FsVmVyc2lvbnMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyIHwgdW5kZWZpbmVkPigpO1xuICBsZXQgbG9jYWxSZWNvcmRDb3VudCA9IDA7XG5cbiAgY29uc3QgY29udmVyc2F0aW9ucyA9IHdpbmRvdy5nZXRDb252ZXJzYXRpb25zKCk7XG4gIGNvbnZlcnNhdGlvbnMuZm9yRWFjaCgoY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbCkgPT4ge1xuICAgIGNvbnN0IHN0b3JhZ2VJRCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3N0b3JhZ2VJRCcpO1xuICAgIGlmIChzdG9yYWdlSUQpIHtcbiAgICAgIGxvY2FsVmVyc2lvbnMuc2V0KHN0b3JhZ2VJRCwgY29udmVyc2F0aW9uLmdldCgnc3RvcmFnZVZlcnNpb24nKSk7XG4gICAgfVxuICB9KTtcbiAgbG9jYWxSZWNvcmRDb3VudCArPSBjb252ZXJzYXRpb25zLmxlbmd0aDtcblxuICB7XG4gICAgY29uc3Qge1xuICAgICAgc3RvcnlEaXN0cmlidXRpb25MaXN0cyxcbiAgICAgIGluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgICAgIHVuaW5zdGFsbGVkU3RpY2tlclBhY2tzLFxuICAgIH0gPSBhd2FpdCBnZXROb25Db252ZXJzYXRpb25SZWNvcmRzKCk7XG5cbiAgICBjb25zdCBjb2xsZWN0TG9jYWxLZXlzRnJvbUZpZWxkcyA9ICh7XG4gICAgICBzdG9yYWdlSUQsXG4gICAgICBzdG9yYWdlVmVyc2lvbixcbiAgICB9OiBTdG9yYWdlU2VydmljZUZpZWxkc1R5cGUpOiB2b2lkID0+IHtcbiAgICAgIGlmIChzdG9yYWdlSUQpIHtcbiAgICAgICAgbG9jYWxWZXJzaW9ucy5zZXQoc3RvcmFnZUlELCBzdG9yYWdlVmVyc2lvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHMuZm9yRWFjaChjb2xsZWN0TG9jYWxLZXlzRnJvbUZpZWxkcyk7XG4gICAgbG9jYWxSZWNvcmRDb3VudCArPSBzdG9yeURpc3RyaWJ1dGlvbkxpc3RzLmxlbmd0aDtcblxuICAgIHVuaW5zdGFsbGVkU3RpY2tlclBhY2tzLmZvckVhY2goY29sbGVjdExvY2FsS2V5c0Zyb21GaWVsZHMpO1xuICAgIGxvY2FsUmVjb3JkQ291bnQgKz0gdW5pbnN0YWxsZWRTdGlja2VyUGFja3MubGVuZ3RoO1xuXG4gICAgaW5zdGFsbGVkU3RpY2tlclBhY2tzLmZvckVhY2goY29sbGVjdExvY2FsS2V5c0Zyb21GaWVsZHMpO1xuICAgIGxvY2FsUmVjb3JkQ291bnQgKz0gaW5zdGFsbGVkU3RpY2tlclBhY2tzLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHVua25vd25SZWNvcmRzQXJyYXk6IFJlYWRvbmx5QXJyYXk8VW5rbm93blJlY29yZD4gPVxuICAgIHdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZS1zZXJ2aWNlLXVua25vd24tcmVjb3JkcycpIHx8IFtdO1xuXG4gIGNvbnN0IHN0aWxsVW5rbm93biA9IHVua25vd25SZWNvcmRzQXJyYXkuZmlsdGVyKChyZWNvcmQ6IFVua25vd25SZWNvcmQpID0+IHtcbiAgICAvLyBEbyBub3QgaW5jbHVkZSBhbnkgdW5rbm93biByZWNvcmRzIHRoYXQgd2UgYWxyZWFkeSBzdXBwb3J0XG4gICAgaWYgKCF2YWxpZFJlY29yZFR5cGVzLmhhcyhyZWNvcmQuaXRlbVR5cGUpKSB7XG4gICAgICBsb2NhbFZlcnNpb25zLnNldChyZWNvcmQuc3RvcmFnZUlELCByZWNvcmQuc3RvcmFnZVZlcnNpb24pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgY29uc3QgcmVtb3RlT25seVNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGtleSBvZiByZW1vdGVLZXlzKSB7XG4gICAgaWYgKCFsb2NhbFZlcnNpb25zLmhhcyhrZXkpKSB7XG4gICAgICByZW1vdGVPbmx5U2V0LmFkZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGxvY2FsT25seVNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBsb2NhbFZlcnNpb25zLmtleXMoKSkge1xuICAgIGlmICghcmVtb3RlS2V5cy5oYXMoa2V5KSkge1xuICAgICAgbG9jYWxPbmx5U2V0LmFkZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlZGFjdGVkUmVtb3RlT25seSA9IEFycmF5LmZyb20ocmVtb3RlT25seVNldCkubWFwKGlkID0+XG4gICAgcmVkYWN0U3RvcmFnZUlEKGlkLCB2ZXJzaW9uKVxuICApO1xuICBjb25zdCByZWRhY3RlZExvY2FsT25seSA9IEFycmF5LmZyb20obG9jYWxPbmx5U2V0KS5tYXAoaWQgPT5cbiAgICByZWRhY3RTdG9yYWdlSUQoaWQsIGxvY2FsVmVyc2lvbnMuZ2V0KGlkKSlcbiAgKTtcblxuICBsb2cuaW5mbyhcbiAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3ZlcnNpb259KTogbG9jYWxSZWNvcmRzPSR7bG9jYWxSZWNvcmRDb3VudH0gYCArXG4gICAgICBgbG9jYWxLZXlzPSR7bG9jYWxWZXJzaW9ucy5zaXplfSB1bmtub3duS2V5cz0ke3N0aWxsVW5rbm93bi5sZW5ndGh9IGAgK1xuICAgICAgYHJlbW90ZUtleXM9JHtyZW1vdGVLZXlzLnNpemV9YFxuICApO1xuICBsb2cuaW5mbyhcbiAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3ZlcnNpb259KTogYCArXG4gICAgICBgcmVtb3RlT25seUNvdW50PSR7cmVtb3RlT25seVNldC5zaXplfSBgICtcbiAgICAgIGByZW1vdGVPbmx5S2V5cz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkUmVtb3RlT25seSl9YFxuICApO1xuICBsb2cuaW5mbyhcbiAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3ZlcnNpb259KTogYCArXG4gICAgICBgbG9jYWxPbmx5Q291bnQ9JHtsb2NhbE9ubHlTZXQuc2l6ZX0gYCArXG4gICAgICBgbG9jYWxPbmx5S2V5cz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkTG9jYWxPbmx5KX1gXG4gICk7XG5cbiAgY29uc3QgcmVtb3RlT25seVJlY29yZHMgPSBuZXcgTWFwPHN0cmluZywgUmVtb3RlUmVjb3JkPigpO1xuICByZW1vdGVPbmx5U2V0LmZvckVhY2goc3RvcmFnZUlEID0+IHtcbiAgICByZW1vdGVPbmx5UmVjb3Jkcy5zZXQoc3RvcmFnZUlELCB7XG4gICAgICBzdG9yYWdlSUQsXG4gICAgICBpdGVtVHlwZTogcmVtb3RlS2V5c1R5cGVNYXAuZ2V0KHN0b3JhZ2VJRCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIGxldCBjb25mbGljdENvdW50ID0gMDtcbiAgaWYgKHJlbW90ZU9ubHlSZWNvcmRzLnNpemUpIHtcbiAgICBjb25mbGljdENvdW50ID0gYXdhaXQgcHJvY2Vzc1JlbW90ZVJlY29yZHModmVyc2lvbiwgcmVtb3RlT25seVJlY29yZHMpO1xuICB9XG5cbiAgLy8gUG9zdC1tZXJnZSwgaWYgb3VyIGxvY2FsIHJlY29yZHMgY29udGFpbiBhbnkgc3RvcmFnZSBJRHMgdGhhdCB3ZXJlIG5vdFxuICAvLyBwcmVzZW50IGluIHRoZSByZW1vdGUgbWFuaWZlc3QgdGhlbiB3ZSdsbCBuZWVkIHRvIGNsZWFyIGl0LCBnZW5lcmF0ZSBhXG4gIC8vIG5ldyBzdG9yYWdlSUQgZm9yIHRoYXQgcmVjb3JkLCBhbmQgdXBsb2FkLlxuICAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBpZiBhIGRldmljZSBwdXNoZXMgYSBtYW5pZmVzdCB3aGljaCBkb2Vzbid0IGNvbnRhaW5cbiAgLy8gdGhlIGtleXMgdGhhdCB3ZSBoYXZlIGluIG91ciBsb2NhbCBkYXRhYmFzZS5cbiAgd2luZG93LmdldENvbnZlcnNhdGlvbnMoKS5mb3JFYWNoKChjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsKSA9PiB7XG4gICAgY29uc3Qgc3RvcmFnZUlEID0gY29udmVyc2F0aW9uLmdldCgnc3RvcmFnZUlEJyk7XG4gICAgaWYgKHN0b3JhZ2VJRCAmJiAhcmVtb3RlS2V5cy5oYXMoc3RvcmFnZUlEKSkge1xuICAgICAgY29uc3Qgc3RvcmFnZVZlcnNpb24gPSBjb252ZXJzYXRpb24uZ2V0KCdzdG9yYWdlVmVyc2lvbicpO1xuICAgICAgY29uc3QgbWlzc2luZ0tleSA9IHJlZGFjdFN0b3JhZ2VJRChcbiAgICAgICAgc3RvcmFnZUlELFxuICAgICAgICBzdG9yYWdlVmVyc2lvbixcbiAgICAgICAgY29udmVyc2F0aW9uXG4gICAgICApO1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7dmVyc2lvbn0pOiBsb2NhbEtleT0ke21pc3NpbmdLZXl9IHdhcyBub3QgYCArXG4gICAgICAgICAgJ2luIHJlbW90ZSBtYW5pZmVzdCdcbiAgICAgICk7XG4gICAgICBjb252ZXJzYXRpb24udW5zZXQoJ3N0b3JhZ2VJRCcpO1xuICAgICAgY29udmVyc2F0aW9uLnVuc2V0KCdzdG9yYWdlVmVyc2lvbicpO1xuICAgICAgdXBkYXRlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJlZmV0Y2ggdmFyaW91cyByZWNvcmRzIHBvc3QtbWVyZ2VcbiAge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICBpbnN0YWxsZWRTdGlja2VyUGFja3MsXG4gICAgICB1bmluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgICB9ID0gYXdhaXQgZ2V0Tm9uQ29udmVyc2F0aW9uUmVjb3JkcygpO1xuXG4gICAgdW5pbnN0YWxsZWRTdGlja2VyUGFja3MuZm9yRWFjaChzdGlja2VyUGFjayA9PiB7XG4gICAgICBjb25zdCB7IHN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24gfSA9IHN0aWNrZXJQYWNrO1xuICAgICAgaWYgKCFzdG9yYWdlSUQgfHwgcmVtb3RlS2V5cy5oYXMoc3RvcmFnZUlEKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pc3NpbmdLZXkgPSByZWRhY3RTdG9yYWdlSUQoc3RvcmFnZUlELCBzdG9yYWdlVmVyc2lvbik7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnByb2Nlc3MoJHt2ZXJzaW9ufSk6IGxvY2FsS2V5PSR7bWlzc2luZ0tleX0gd2FzIG5vdCBgICtcbiAgICAgICAgICAnaW4gcmVtb3RlIG1hbmlmZXN0J1xuICAgICAgKTtcbiAgICAgIGRhdGFJbnRlcmZhY2UuYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFjayh7XG4gICAgICAgIC4uLnN0aWNrZXJQYWNrLFxuICAgICAgICBzdG9yYWdlSUQ6IHVuZGVmaW5lZCxcbiAgICAgICAgc3RvcmFnZVZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaW5zdGFsbGVkU3RpY2tlclBhY2tzLmZvckVhY2goc3RpY2tlclBhY2sgPT4ge1xuICAgICAgY29uc3QgeyBzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uIH0gPSBzdGlja2VyUGFjaztcbiAgICAgIGlmICghc3RvcmFnZUlEIHx8IHJlbW90ZUtleXMuaGFzKHN0b3JhZ2VJRCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtaXNzaW5nS2V5ID0gcmVkYWN0U3RvcmFnZUlEKHN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24pO1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7dmVyc2lvbn0pOiBsb2NhbEtleT0ke21pc3NpbmdLZXl9IHdhcyBub3QgYCArXG4gICAgICAgICAgJ2luIHJlbW90ZSBtYW5pZmVzdCdcbiAgICAgICk7XG4gICAgICBkYXRhSW50ZXJmYWNlLmNyZWF0ZU9yVXBkYXRlU3RpY2tlclBhY2soe1xuICAgICAgICAuLi5zdGlja2VyUGFjayxcbiAgICAgICAgc3RvcmFnZUlEOiB1bmRlZmluZWQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHMuZm9yRWFjaChzdG9yeURpc3RyaWJ1dGlvbkxpc3QgPT4ge1xuICAgICAgY29uc3QgeyBzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uIH0gPSBzdG9yeURpc3RyaWJ1dGlvbkxpc3Q7XG4gICAgICBpZiAoIXN0b3JhZ2VJRCB8fCByZW1vdGVLZXlzLmhhcyhzdG9yYWdlSUQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWlzc2luZ0tleSA9IHJlZGFjdFN0b3JhZ2VJRChzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uKTtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3ZlcnNpb259KTogbG9jYWxLZXk9JHttaXNzaW5nS2V5fSB3YXMgbm90IGAgK1xuICAgICAgICAgICdpbiByZW1vdGUgbWFuaWZlc3QnXG4gICAgICApO1xuICAgICAgZGF0YUludGVyZmFjZS5tb2RpZnlTdG9yeURpc3RyaWJ1dGlvbih7XG4gICAgICAgIC4uLnN0b3J5RGlzdHJpYnV0aW9uTGlzdCxcbiAgICAgICAgc3RvcmFnZUlEOiB1bmRlZmluZWQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgXCJNeSBTdG9yaWVzXCIgZGlzdHJpYnV0aW9uIGxpc3Qgc2V0IHVwXG4gICAgY29uc3QgbXlTdG9yaWVzID0gc3RvcnlEaXN0cmlidXRpb25MaXN0cy5maW5kKFxuICAgICAgKHsgaWQgfSkgPT4gaWQgPT09IE1ZX1NUT1JJRVNfSURcbiAgICApO1xuXG4gICAgaWYgKCFteVN0b3JpZXMpIHtcbiAgICAgIGNvbnN0IHN0b3J5RGlzdHJpYnV0aW9uOiBTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZSA9IHtcbiAgICAgICAgYWxsb3dzUmVwbGllczogdHJ1ZSxcbiAgICAgICAgaWQ6IE1ZX1NUT1JJRVNfSUQsXG4gICAgICAgIGlzQmxvY2tMaXN0OiB0cnVlLFxuICAgICAgICBtZW1iZXJzOiBbXSxcbiAgICAgICAgbmFtZTogTVlfU1RPUklFU19JRCxcbiAgICAgICAgc2VuZGVyS2V5SW5mbzogdW5kZWZpbmVkLFxuICAgICAgICBzdG9yYWdlTmVlZHNTeW5jOiB0cnVlLFxuICAgICAgfTtcblxuICAgICAgYXdhaXQgZGF0YUludGVyZmFjZS5jcmVhdGVOZXdTdG9yeURpc3RyaWJ1dGlvbihzdG9yeURpc3RyaWJ1dGlvbik7XG5cbiAgICAgIGNvbnN0IHNob3VsZFNhdmUgPSBmYWxzZTtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuc3RvcnlEaXN0cmlidXRpb25MaXN0cy5jcmVhdGVEaXN0cmlidXRpb25MaXN0KFxuICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbi5uYW1lLFxuICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbi5tZW1iZXJzLFxuICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbixcbiAgICAgICAgc2hvdWxkU2F2ZVxuICAgICAgKTtcblxuICAgICAgY29uZmxpY3RDb3VudCArPSAxO1xuICAgIH1cbiAgfVxuXG4gIGxvZy5pbmZvKFxuICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7dmVyc2lvbn0pOiBjb25mbGljdENvdW50PSR7Y29uZmxpY3RDb3VudH1gXG4gICk7XG5cbiAgcmV0dXJuIGNvbmZsaWN0Q291bnQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NSZW1vdGVSZWNvcmRzKFxuICBzdG9yYWdlVmVyc2lvbjogbnVtYmVyLFxuICByZW1vdGVPbmx5UmVjb3JkczogTWFwPHN0cmluZywgUmVtb3RlUmVjb3JkPlxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgY29uc3Qgc3RvcmFnZUtleUJhc2U2NCA9IHdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZUtleScpO1xuICBpZiAoIXN0b3JhZ2VLZXlCYXNlNjQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN0b3JhZ2Uga2V5Jyk7XG4gIH1cbiAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICBpZiAoIW1lc3NhZ2luZykge1xuICAgIHRocm93IG5ldyBFcnJvcignbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUnKTtcbiAgfVxuXG4gIGNvbnN0IHN0b3JhZ2VLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KHN0b3JhZ2VLZXlCYXNlNjQpO1xuXG4gIGxvZy5pbmZvKFxuICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogZmV0Y2hpbmcgcmVtb3RlIGtleXMgYCArXG4gICAgICBgY291bnQ9JHtyZW1vdGVPbmx5UmVjb3Jkcy5zaXplfWBcbiAgKTtcblxuICBjb25zdCBjcmVkZW50aWFscyA9IHdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZUNyZWRlbnRpYWxzJyk7XG4gIGNvbnN0IGJhdGNoZXMgPSBjaHVuayhBcnJheS5mcm9tKHJlbW90ZU9ubHlSZWNvcmRzLmtleXMoKSksIE1BWF9SRUFEX0tFWVMpO1xuXG4gIGNvbnN0IHN0b3JhZ2VJdGVtcyA9IChcbiAgICBhd2FpdCBwTWFwKFxuICAgICAgYmF0Y2hlcyxcbiAgICAgIGFzeW5jIChcbiAgICAgICAgYmF0Y2g6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICAgICAgKTogUHJvbWlzZTxBcnJheTxQcm90by5JU3RvcmFnZUl0ZW0+PiA9PiB7XG4gICAgICAgIGNvbnN0IHJlYWRPcGVyYXRpb24gPSBuZXcgUHJvdG8uUmVhZE9wZXJhdGlvbigpO1xuICAgICAgICByZWFkT3BlcmF0aW9uLnJlYWRLZXkgPSBiYXRjaC5tYXAoQnl0ZXMuZnJvbUJhc2U2NCk7XG5cbiAgICAgICAgY29uc3Qgc3RvcmFnZUl0ZW1zQnVmZmVyID0gYXdhaXQgbWVzc2FnaW5nLmdldFN0b3JhZ2VSZWNvcmRzKFxuICAgICAgICAgIFByb3RvLlJlYWRPcGVyYXRpb24uZW5jb2RlKHJlYWRPcGVyYXRpb24pLmZpbmlzaCgpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gUHJvdG8uU3RvcmFnZUl0ZW1zLmRlY29kZShzdG9yYWdlSXRlbXNCdWZmZXIpLml0ZW1zID8/IFtdO1xuICAgICAgfSxcbiAgICAgIHsgY29uY3VycmVuY3k6IDUgfVxuICAgIClcbiAgKS5mbGF0KCk7XG5cbiAgY29uc3QgbWlzc2luZ0tleXMgPSBuZXcgU2V0PHN0cmluZz4ocmVtb3RlT25seVJlY29yZHMua2V5cygpKTtcblxuICBjb25zdCBkZWNyeXB0ZWRTdG9yYWdlSXRlbXMgPSBhd2FpdCBwTWFwKFxuICAgIHN0b3JhZ2VJdGVtcyxcbiAgICBhc3luYyAoXG4gICAgICBzdG9yYWdlUmVjb3JkV3JhcHBlcjogUHJvdG8uSVN0b3JhZ2VJdGVtXG4gICAgKTogUHJvbWlzZTxNZXJnZWFibGVJdGVtVHlwZT4gPT4ge1xuICAgICAgY29uc3QgeyBrZXksIHZhbHVlOiBzdG9yYWdlSXRlbUNpcGhlcnRleHQgfSA9IHN0b3JhZ2VSZWNvcmRXcmFwcGVyO1xuXG4gICAgICBpZiAoIWtleSB8fCAhc3RvcmFnZUl0ZW1DaXBoZXJ0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYCArXG4gICAgICAgICAgICAnbWlzc2luZyBrZXkgYW5kL29yIENpcGhlcnRleHQnXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHN0b3BTdG9yYWdlU2VydmljZVN5bmMoZXJyb3IpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYmFzZTY0SXRlbUlEID0gQnl0ZXMudG9CYXNlNjQoa2V5KTtcbiAgICAgIG1pc3NpbmdLZXlzLmRlbGV0ZShiYXNlNjRJdGVtSUQpO1xuXG4gICAgICBjb25zdCBzdG9yYWdlSXRlbUtleSA9IGRlcml2ZVN0b3JhZ2VJdGVtS2V5KHN0b3JhZ2VLZXksIGJhc2U2NEl0ZW1JRCk7XG5cbiAgICAgIGxldCBzdG9yYWdlSXRlbVBsYWludGV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2VJdGVtUGxhaW50ZXh0ID0gZGVjcnlwdFByb2ZpbGUoXG4gICAgICAgICAgc3RvcmFnZUl0ZW1DaXBoZXJ0ZXh0LFxuICAgICAgICAgIHN0b3JhZ2VJdGVtS2V5XG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYCArXG4gICAgICAgICAgICAnRXJyb3IgZGVjcnlwdGluZyBzdG9yYWdlIGl0ZW0nLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnIpXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHN0b3BTdG9yYWdlU2VydmljZVN5bmMoZXJyKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdG9yYWdlUmVjb3JkID0gUHJvdG8uU3RvcmFnZVJlY29yZC5kZWNvZGUoc3RvcmFnZUl0ZW1QbGFpbnRleHQpO1xuXG4gICAgICBjb25zdCByZW1vdGVSZWNvcmQgPSByZW1vdGVPbmx5UmVjb3Jkcy5nZXQoYmFzZTY0SXRlbUlEKTtcbiAgICAgIGlmICghcmVtb3RlUmVjb3JkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkdvdCBhIHJlbW90ZSByZWNvcmQgdGhhdCB3YXNuJ3QgcmVxdWVzdGVkIHdpdGggXCIgK1xuICAgICAgICAgICAgYHN0b3JhZ2VJRDogJHtiYXNlNjRJdGVtSUR9YFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpdGVtVHlwZTogcmVtb3RlUmVjb3JkLml0ZW1UeXBlLFxuICAgICAgICBzdG9yYWdlSUQ6IGJhc2U2NEl0ZW1JRCxcbiAgICAgICAgc3RvcmFnZVJlY29yZCxcbiAgICAgIH07XG4gICAgfSxcbiAgICB7IGNvbmN1cnJlbmN5OiA1IH1cbiAgKTtcblxuICBjb25zdCByZWRhY3RlZE1pc3NpbmdLZXlzID0gQXJyYXkuZnJvbShtaXNzaW5nS2V5cykubWFwKGlkID0+XG4gICAgcmVkYWN0U3RvcmFnZUlEKGlkLCBzdG9yYWdlVmVyc2lvbilcbiAgKTtcblxuICBsb2cuaW5mbyhcbiAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IG1pc3NpbmcgcmVtb3RlIGAgK1xuICAgICAgYGtleXM9JHtKU09OLnN0cmluZ2lmeShyZWRhY3RlZE1pc3NpbmdLZXlzKX0gYCArXG4gICAgICBgY291bnQ9JHttaXNzaW5nS2V5cy5zaXplfWBcbiAgKTtcblxuICBjb25zdCBJVEVNX1RZUEUgPSBQcm90by5NYW5pZmVzdFJlY29yZC5JZGVudGlmaWVyLlR5cGU7XG4gIGNvbnN0IGRyb3BwZWRLZXlzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgLy8gRHJvcCBhbGwgR1YxIHJlY29yZHMgZm9yIHdoaWNoIHdlIGhhdmUgR1YyIHJlY29yZCBpbiB0aGUgc2FtZSBtYW5pZmVzdFxuICBjb25zdCBtYXN0ZXJLZXlzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCB7IGl0ZW1UeXBlLCBzdG9yYWdlSUQsIHN0b3JhZ2VSZWNvcmQgfSBvZiBkZWNyeXB0ZWRTdG9yYWdlSXRlbXMpIHtcbiAgICBpZiAoaXRlbVR5cGUgPT09IElURU1fVFlQRS5HUk9VUFYyICYmIHN0b3JhZ2VSZWNvcmQuZ3JvdXBWMj8ubWFzdGVyS2V5KSB7XG4gICAgICBtYXN0ZXJLZXlzLnNldChcbiAgICAgICAgQnl0ZXMudG9CYXNlNjQoc3RvcmFnZVJlY29yZC5ncm91cFYyLm1hc3RlcktleSksXG4gICAgICAgIHN0b3JhZ2VJRFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBsZXQgYWNjb3VudEl0ZW06IE1lcmdlYWJsZUl0ZW1UeXBlIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHBydW5lZFN0b3JhZ2VJdGVtcyA9IGRlY3J5cHRlZFN0b3JhZ2VJdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgY29uc3QgeyBpdGVtVHlwZSwgc3RvcmFnZUlELCBzdG9yYWdlUmVjb3JkIH0gPSBpdGVtO1xuICAgIGlmIChpdGVtVHlwZSA9PT0gSVRFTV9UWVBFLkFDQ09VTlQpIHtcbiAgICAgIGlmIChhY2NvdW50SXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogZHVwbGljYXRlIGFjY291bnQgYCArXG4gICAgICAgICAgICBgcmVjb3JkPSR7cmVkYWN0U3RvcmFnZUlEKHN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24pfSBgICtcbiAgICAgICAgICAgIGBwcmV2aW91cz0ke3JlZGFjdFN0b3JhZ2VJRChhY2NvdW50SXRlbS5zdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uKX1gXG4gICAgICAgICk7XG4gICAgICAgIGRyb3BwZWRLZXlzLmFkZChhY2NvdW50SXRlbS5zdG9yYWdlSUQpO1xuICAgICAgfVxuXG4gICAgICBhY2NvdW50SXRlbSA9IGl0ZW07XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1UeXBlICE9PSBJVEVNX1RZUEUuR1JPVVBWMSB8fCAhc3RvcmFnZVJlY29yZC5ncm91cFYxPy5pZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgbWFzdGVyS2V5ID0gZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEoc3RvcmFnZVJlY29yZC5ncm91cFYxLmlkKTtcbiAgICBjb25zdCBndjJTdG9yYWdlSUQgPSBtYXN0ZXJLZXlzLmdldChCeXRlcy50b0Jhc2U2NChtYXN0ZXJLZXkpKTtcbiAgICBpZiAoIWd2MlN0b3JhZ2VJRCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbG9nLndhcm4oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IGRyb3BwaW5nIGAgK1xuICAgICAgICBgR1YxIHJlY29yZD0ke3JlZGFjdFN0b3JhZ2VJRChzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uKX0gYCArXG4gICAgICAgIGBHVjIgcmVjb3JkPSR7cmVkYWN0U3RvcmFnZUlEKGd2MlN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24pfSBgICtcbiAgICAgICAgJ2lzIGluIHRoZSBzYW1lIG1hbmlmZXN0J1xuICAgICk7XG4gICAgZHJvcHBlZEtleXMuYWRkKHN0b3JhZ2VJRCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IGAgK1xuICAgICAgICBgYXR0ZW1wdGluZyB0byBtZXJnZSByZWNvcmRzPSR7cHJ1bmVkU3RvcmFnZUl0ZW1zLmxlbmd0aH1gXG4gICAgKTtcbiAgICBpZiAoYWNjb3VudEl0ZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYWNjb3VudCBgICtcbiAgICAgICAgICBgcmVjb3JkPSR7cmVkYWN0U3RvcmFnZUlEKGFjY291bnRJdGVtLnN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24pfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVyZ2VkUmVjb3JkcyA9IFtcbiAgICAgIC4uLihhd2FpdCBwTWFwKFxuICAgICAgICBwcnVuZWRTdG9yYWdlSXRlbXMsXG4gICAgICAgIChpdGVtOiBNZXJnZWFibGVJdGVtVHlwZSkgPT4gbWVyZ2VSZWNvcmQoc3RvcmFnZVZlcnNpb24sIGl0ZW0pLFxuICAgICAgICB7IGNvbmN1cnJlbmN5OiAzMiB9XG4gICAgICApKSxcblxuICAgICAgLy8gTWVyZ2UgQWNjb3VudCByZWNvcmRzIGxhc3Qgc2luY2UgaXQgY29udGFpbnMgdGhlIHBpbm5lZCBjb252ZXJzYXRpb25zXG4gICAgICAvLyBhbmQgd2UgbmVlZCBhbGwgb3RoZXIgcmVjb3JkcyBtZXJnZWQgZmlyc3QgYmVmb3JlIHdlIGNhbiBmaW5kIHRoZSBwaW5uZWRcbiAgICAgIC8vIHJlY29yZHMgaW4gb3VyIGRiXG4gICAgICAuLi4oYWNjb3VudEl0ZW0gPyBbYXdhaXQgbWVyZ2VSZWNvcmQoc3RvcmFnZVZlcnNpb24sIGFjY291bnRJdGVtKV0gOiBbXSksXG4gICAgXTtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnByb2Nlc3MoJHtzdG9yYWdlVmVyc2lvbn0pOiBgICtcbiAgICAgICAgYHByb2Nlc3NlZCByZWNvcmRzPSR7bWVyZ2VkUmVjb3Jkcy5sZW5ndGh9YFxuICAgICk7XG5cbiAgICBjb25zdCB1cGRhdGVkQ29udmVyc2F0aW9ucyA9IG1lcmdlZFJlY29yZHNcbiAgICAgIC5tYXAocmVjb3JkID0+IHJlY29yZC51cGRhdGVkQ29udmVyc2F0aW9ucylcbiAgICAgIC5mbGF0KClcbiAgICAgIC5tYXAoY29udm8gPT4gY29udm8uYXR0cmlidXRlcyk7XG4gICAgYXdhaXQgdXBkYXRlQ29udmVyc2F0aW9ucyh1cGRhdGVkQ29udmVyc2F0aW9ucyk7XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYCArXG4gICAgICAgIGB1cGRhdGVkIGNvbnZlcnNhdGlvbnM9JHt1cGRhdGVkQ29udmVyc2F0aW9ucy5sZW5ndGh9YFxuICAgICk7XG5cbiAgICBjb25zdCBuZWVkUHJvZmlsZUZldGNoID0gbWVyZ2VkUmVjb3Jkc1xuICAgICAgLm1hcChyZWNvcmQgPT4gcmVjb3JkLm5lZWRQcm9maWxlRmV0Y2gpXG4gICAgICAuZmxhdCgpO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IGAgK1xuICAgICAgICBga2lja2luZyBvZmYgcHJvZmlsZSBmZXRjaGVzPSR7bmVlZFByb2ZpbGVGZXRjaC5sZW5ndGh9YFxuICAgICk7XG5cbiAgICAvLyBJbnRlbnRpb25hbGx5IG5vdCBhd2FpdGluZ1xuICAgIG5lZWRQcm9maWxlRmV0Y2gubWFwKGNvbnZvID0+IGNvbnZvLmdldFByb2ZpbGVzKCkpO1xuXG4gICAgLy8gQ29sbGVjdCBmdWxsIG1hcCBvZiBwcmV2aW91c2x5IGFuZCBjdXJyZW50bHkgdW5rbm93biByZWNvcmRzXG4gICAgY29uc3QgdW5rbm93blJlY29yZHM6IE1hcDxzdHJpbmcsIFVua25vd25SZWNvcmQ+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3QgcHJldmlvdXNVbmtub3duUmVjb3JkczogUmVhZG9ubHlBcnJheTxVbmtub3duUmVjb3JkPiA9XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoXG4gICAgICAgICdzdG9yYWdlLXNlcnZpY2UtdW5rbm93bi1yZWNvcmRzJyxcbiAgICAgICAgbmV3IEFycmF5PFVua25vd25SZWNvcmQ+KClcbiAgICAgICk7XG4gICAgcHJldmlvdXNVbmtub3duUmVjb3Jkcy5mb3JFYWNoKChyZWNvcmQ6IFVua25vd25SZWNvcmQpID0+IHtcbiAgICAgIHVua25vd25SZWNvcmRzLnNldChyZWNvcmQuc3RvcmFnZUlELCByZWNvcmQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbmV3UmVjb3Jkc1dpdGhFcnJvcnM6IEFycmF5PFVua25vd25SZWNvcmQ+ID0gW107XG5cbiAgICBsZXQgY29uZmxpY3RDb3VudCA9IDA7XG5cbiAgICBtZXJnZWRSZWNvcmRzLmZvckVhY2goKG1lcmdlZFJlY29yZDogTWVyZ2VkUmVjb3JkVHlwZSkgPT4ge1xuICAgICAgaWYgKG1lcmdlZFJlY29yZC5pc1Vuc3VwcG9ydGVkKSB7XG4gICAgICAgIHVua25vd25SZWNvcmRzLnNldChtZXJnZWRSZWNvcmQuc3RvcmFnZUlELCB7XG4gICAgICAgICAgaXRlbVR5cGU6IG1lcmdlZFJlY29yZC5pdGVtVHlwZSxcbiAgICAgICAgICBzdG9yYWdlSUQ6IG1lcmdlZFJlY29yZC5zdG9yYWdlSUQsXG4gICAgICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWRSZWNvcmQuaGFzRXJyb3IpIHtcbiAgICAgICAgbmV3UmVjb3Jkc1dpdGhFcnJvcnMucHVzaCh7XG4gICAgICAgICAgaXRlbVR5cGU6IG1lcmdlZFJlY29yZC5pdGVtVHlwZSxcbiAgICAgICAgICBzdG9yYWdlSUQ6IG1lcmdlZFJlY29yZC5zdG9yYWdlSUQsXG4gICAgICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAobWVyZ2VkUmVjb3JkLmhhc0NvbmZsaWN0KSB7XG4gICAgICAgIGNvbmZsaWN0Q291bnQgKz0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lcmdlZFJlY29yZC5zaG91bGREcm9wKSB7XG4gICAgICAgIGRyb3BwZWRLZXlzLmFkZChtZXJnZWRSZWNvcmQuc3RvcmFnZUlEKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJlZGFjdGVkRHJvcHBlZEtleXMgPSBBcnJheS5mcm9tKGRyb3BwZWRLZXlzLnZhbHVlcygpKS5tYXAoa2V5ID0+XG4gICAgICByZWRhY3RTdG9yYWdlSUQoa2V5LCBzdG9yYWdlVmVyc2lvbilcbiAgICApO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnByb2Nlc3MoJHtzdG9yYWdlVmVyc2lvbn0pOiBgICtcbiAgICAgICAgYGRyb3BwZWQga2V5cz0ke0pTT04uc3RyaW5naWZ5KHJlZGFjdGVkRHJvcHBlZEtleXMpfSBgICtcbiAgICAgICAgYGNvdW50PSR7cmVkYWN0ZWREcm9wcGVkS2V5cy5sZW5ndGh9YFxuICAgICk7XG5cbiAgICAvLyBGaWx0ZXIgb3V0IGFsbCB0aGUgdW5rbm93biByZWNvcmRzIHdlJ3JlIGFscmVhZHkgc3VwcG9ydGluZ1xuICAgIGNvbnN0IG5ld1Vua25vd25SZWNvcmRzID0gQXJyYXkuZnJvbSh1bmtub3duUmVjb3Jkcy52YWx1ZXMoKSkuZmlsdGVyKFxuICAgICAgKHJlY29yZDogVW5rbm93blJlY29yZCkgPT4gIXZhbGlkUmVjb3JkVHlwZXMuaGFzKHJlY29yZC5pdGVtVHlwZSlcbiAgICApO1xuICAgIGNvbnN0IHJlZGFjdGVkTmV3VW5rbm93bnMgPSBuZXdVbmtub3duUmVjb3Jkcy5tYXAocmVkYWN0RXh0ZW5kZWRTdG9yYWdlSUQpO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IGAgK1xuICAgICAgICBgdW5rbm93biByZWNvcmRzPSR7SlNPTi5zdHJpbmdpZnkocmVkYWN0ZWROZXdVbmtub3ducyl9IGAgK1xuICAgICAgICBgY291bnQ9JHtyZWRhY3RlZE5ld1Vua25vd25zLmxlbmd0aH1gXG4gICAgKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wdXQoXG4gICAgICAnc3RvcmFnZS1zZXJ2aWNlLXVua25vd24tcmVjb3JkcycsXG4gICAgICBuZXdVbmtub3duUmVjb3Jkc1xuICAgICk7XG5cbiAgICBjb25zdCByZWRhY3RlZEVycm9yUmVjb3JkcyA9IG5ld1JlY29yZHNXaXRoRXJyb3JzLm1hcChcbiAgICAgIHJlZGFjdEV4dGVuZGVkU3RvcmFnZUlEXG4gICAgKTtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYCArXG4gICAgICAgIGBlcnJvciByZWNvcmRzPSR7SlNPTi5zdHJpbmdpZnkocmVkYWN0ZWRFcnJvclJlY29yZHMpfSBgICtcbiAgICAgICAgYGNvdW50PSR7cmVkYWN0ZWRFcnJvclJlY29yZHMubGVuZ3RofWBcbiAgICApO1xuICAgIC8vIFJlZnJlc2ggdGhlIGxpc3Qgb2YgcmVjb3JkcyB0aGF0IGhhZCBlcnJvcnMgd2l0aCBldmVyeSBwdXNoLCB0aGF0IHdheVxuICAgIC8vIHRoaXMgbGlzdCBkb2Vzbid0IGdyb3cgdW5ib3VuZGVkIGFuZCB3ZSBrZWVwIHRoZSBsaXN0IG9mIHN0b3JhZ2Uga2V5c1xuICAgIC8vIGZyZXNoLlxuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dChcbiAgICAgICdzdG9yYWdlLXNlcnZpY2UtZXJyb3ItcmVjb3JkcycsXG4gICAgICBuZXdSZWNvcmRzV2l0aEVycm9yc1xuICAgICk7XG5cbiAgICAvLyBTdG9yZS9vdmVyd3JpdGUga2V5cyBwZW5kaW5nIGRlbGV0aW9uLCBidXQgdXNlIHRoZW0gb25seSB3aGVuIHdlIGhhdmUgdG9cbiAgICAvLyB1cGxvYWQgYSBuZXcgbWFuaWZlc3QgdG8gYXZvaWQgb3NjaWxsYXRpb24uXG4gICAgY29uc3QgcGVuZGluZ0RlbGV0ZXMgPSBbLi4ubWlzc2luZ0tleXMsIC4uLmRyb3BwZWRLZXlzXS5tYXAoc3RvcmFnZUlEID0+ICh7XG4gICAgICBzdG9yYWdlSUQsXG4gICAgICBzdG9yYWdlVmVyc2lvbixcbiAgICB9KSk7XG4gICAgY29uc3QgcmVkYWN0ZWRQZW5kaW5nRGVsZXRlcyA9IHBlbmRpbmdEZWxldGVzLm1hcChyZWRhY3RFeHRlbmRlZFN0b3JhZ2VJRCk7XG4gICAgbG9nLmluZm8oXG4gICAgICBgc3RvcmFnZVNlcnZpY2UucHJvY2Vzcygke3N0b3JhZ2VWZXJzaW9ufSk6IGAgK1xuICAgICAgICBgcGVuZGluZyBkZWxldGVzPSR7SlNPTi5zdHJpbmdpZnkocmVkYWN0ZWRQZW5kaW5nRGVsZXRlcyl9IGAgK1xuICAgICAgICBgY291bnQ9JHtyZWRhY3RlZFBlbmRpbmdEZWxldGVzLmxlbmd0aH1gXG4gICAgKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wdXQoJ3N0b3JhZ2Utc2VydmljZS1wZW5kaW5nLWRlbGV0ZXMnLCBwZW5kaW5nRGVsZXRlcyk7XG5cbiAgICBpZiAoY29uZmxpY3RDb3VudCA9PT0gMCkge1xuICAgICAgY29uZmxpY3RCYWNrT2ZmLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZsaWN0Q291bnQ7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgIGBzdG9yYWdlU2VydmljZS5wcm9jZXNzKCR7c3RvcmFnZVZlcnNpb259KTogYCArXG4gICAgICAgICdmYWlsZWQgdG8gcHJvY2VzcyByZW1vdGUgcmVjb3JkcycsXG4gICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKVxuICAgICk7XG4gIH1cblxuICAvLyBjb25mbGljdENvdW50XG4gIHJldHVybiAwO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzeW5jKFxuICBpZ25vcmVDb25mbGljdHMgPSBmYWxzZVxuKTogUHJvbWlzZTxQcm90by5NYW5pZmVzdFJlY29yZCB8IHVuZGVmaW5lZD4ge1xuICBpZiAoIXdpbmRvdy5zdG9yYWdlLmdldCgnc3RvcmFnZUtleScpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdG9yYWdlU2VydmljZS5zeW5jOiBDYW5ub3Qgc3RhcnQ7IG5vIHN0b3JhZ2Uga2V5IScpO1xuICB9XG5cbiAgbG9nLmluZm8oXG4gICAgYHN0b3JhZ2VTZXJ2aWNlLnN5bmM6IHN0YXJ0aW5nLi4uIGlnbm9yZUNvbmZsaWN0cz0ke2lnbm9yZUNvbmZsaWN0c31gXG4gICk7XG5cbiAgbGV0IG1hbmlmZXN0OiBQcm90by5NYW5pZmVzdFJlY29yZCB8IHVuZGVmaW5lZDtcbiAgdHJ5IHtcbiAgICAvLyBJZiB3ZSd2ZSBwcmV2aW91c2x5IGludGVyYWN0ZWQgd2l0aCBzdHJhZ2Ugc2VydmljZSwgdXBkYXRlICdmZXRjaENvbXBsZXRlJyByZWNvcmRcbiAgICBjb25zdCBwcmV2aW91c0ZldGNoQ29tcGxldGUgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ3N0b3JhZ2VGZXRjaENvbXBsZXRlJyk7XG4gICAgY29uc3QgbWFuaWZlc3RGcm9tU3RvcmFnZSA9IHdpbmRvdy5zdG9yYWdlLmdldCgnbWFuaWZlc3RWZXJzaW9uJyk7XG4gICAgaWYgKCFwcmV2aW91c0ZldGNoQ29tcGxldGUgJiYgaXNOdW1iZXIobWFuaWZlc3RGcm9tU3RvcmFnZSkpIHtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnc3RvcmFnZUZldGNoQ29tcGxldGUnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbE1hbmlmZXN0VmVyc2lvbiA9IG1hbmlmZXN0RnJvbVN0b3JhZ2UgfHwgMDtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgJ3N0b3JhZ2VTZXJ2aWNlLnN5bmM6IGZldGNoaW5nIGxhdGVzdCAnICtcbiAgICAgICAgYGFmdGVyIHZlcnNpb249JHtsb2NhbE1hbmlmZXN0VmVyc2lvbn1gXG4gICAgKTtcbiAgICBtYW5pZmVzdCA9IGF3YWl0IGZldGNoTWFuaWZlc3QobG9jYWxNYW5pZmVzdFZlcnNpb24pO1xuXG4gICAgLy8gR3VhcmRpbmcgYWdhaW5zdCBubyBtYW5pZmVzdHMgYmVpbmcgcmV0dXJuZWQsIGV2ZXJ5dGhpbmcgc2hvdWxkIGJlIG9rXG4gICAgaWYgKCFtYW5pZmVzdCkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBzdG9yYWdlU2VydmljZS5zeW5jOiBubyB1cGRhdGVzLCB2ZXJzaW9uPSR7bG9jYWxNYW5pZmVzdFZlcnNpb259YFxuICAgICAgKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgbWFuaWZlc3QudmVyc2lvbiAhPT0gdW5kZWZpbmVkICYmIG1hbmlmZXN0LnZlcnNpb24gIT09IG51bGwsXG4gICAgICAnTWFuaWZlc3Qgd2l0aG91dCB2ZXJzaW9uJ1xuICAgICk7XG4gICAgY29uc3QgdmVyc2lvbiA9IG1hbmlmZXN0LnZlcnNpb24/LnRvTnVtYmVyKCkgPz8gMDtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnN5bmM6IHVwZGF0aW5nIHRvIHJlbW90ZVZlcnNpb249JHt2ZXJzaW9ufSBgICtcbiAgICAgICAgYHNvdXJjZURldmljZT0ke21hbmlmZXN0LnNvdXJjZURldmljZSA/PyAnPyd9IGZyb20gYCArXG4gICAgICAgIGB2ZXJzaW9uPSR7bG9jYWxNYW5pZmVzdFZlcnNpb259YFxuICAgICk7XG5cbiAgICBjb25zdCBjb25mbGljdENvdW50ID0gYXdhaXQgcHJvY2Vzc01hbmlmZXN0KG1hbmlmZXN0LCB2ZXJzaW9uKTtcblxuICAgIGxvZy5pbmZvKFxuICAgICAgYHN0b3JhZ2VTZXJ2aWNlLnN5bmM6IHVwZGF0ZWQgdG8gdmVyc2lvbj0ke3ZlcnNpb259IGAgK1xuICAgICAgICBgY29uZmxpY3RzPSR7Y29uZmxpY3RDb3VudH1gXG4gICAgKTtcblxuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dCgnbWFuaWZlc3RWZXJzaW9uJywgdmVyc2lvbik7XG5cbiAgICBjb25zdCBoYXNDb25mbGljdHMgPSBjb25mbGljdENvdW50ICE9PSAwO1xuICAgIGlmIChoYXNDb25mbGljdHMgJiYgIWlnbm9yZUNvbmZsaWN0cykge1xuICAgICAgYXdhaXQgdXBsb2FkKHRydWUpO1xuICAgIH1cblxuICAgIC8vIFdlIG5vdyBrbm93IHRoYXQgd2UndmUgc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZCBhIHN0b3JhZ2Ugc2VydmljZSBmZXRjaFxuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dCgnc3RvcmFnZUZldGNoQ29tcGxldGUnLCB0cnVlKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nLmVycm9yKFxuICAgICAgJ3N0b3JhZ2VTZXJ2aWNlLnN5bmM6IGVycm9yIHByb2Nlc3NpbmcgbWFuaWZlc3QnLFxuICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycilcbiAgICApO1xuICB9XG5cbiAgbG9nLmluZm8oJ3N0b3JhZ2VTZXJ2aWNlLnN5bmM6IGNvbXBsZXRlJyk7XG4gIHJldHVybiBtYW5pZmVzdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBsb2FkKGZyb21TeW5jID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCF3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0b3JhZ2VTZXJ2aWNlLnVwbG9hZDogV2UgYXJlIG9mZmxpbmUhJyk7XG4gIH1cblxuICAvLyBSYXRlIGxpbWl0IHVwbG9hZHMgY29taW5nIGZyb20gc3luY2luZ1xuICBpZiAoZnJvbVN5bmMpIHtcbiAgICB1cGxvYWRCdWNrZXQucHVzaChEYXRlLm5vdygpKTtcbiAgICBpZiAodXBsb2FkQnVja2V0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICBjb25zdCBbZmlyc3RNb3N0UmVjZW50V3JpdGVdID0gdXBsb2FkQnVja2V0O1xuXG4gICAgICBpZiAoaXNNb3JlUmVjZW50VGhhbig1ICogZHVyYXRpb25zLk1JTlVURSwgZmlyc3RNb3N0UmVjZW50V3JpdGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnc3RvcmFnZVNlcnZpY2UudXBsb2FkTWFuaWZlc3Q6IHRvbyBtYW55IHdyaXRlcyB0b28gc29vbi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHVwbG9hZEJ1Y2tldC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghd2luZG93LnN0b3JhZ2UuZ2V0KCdzdG9yYWdlS2V5JykpIHtcbiAgICAvLyByZXF1ZXN0aW5nIG5ldyBrZXlzIHJ1bnMgdGhlIHN5bmMgam9iIHdoaWNoIHdpbGwgZGV0ZWN0IHRoZSBjb25mbGljdFxuICAgIC8vIGFuZCByZS1ydW4gdGhlIHVwbG9hZCBqb2Igb25jZSB3ZSdyZSBtZXJnZWQgYW5kIHVwLXRvLWRhdGUuXG4gICAgbG9nLmluZm8oJ3N0b3JhZ2VTZXJ2aWNlLnVwbG9hZDogbm8gc3RvcmFnZUtleSwgcmVxdWVzdGluZyBuZXcga2V5cycpO1xuICAgIGJhY2tPZmYucmVzZXQoKTtcblxuICAgIGlmICh3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5hcmVXZVByaW1hcnlEZXZpY2UoKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdzdG9yYWdlU2VydmljZS51cGxvYWQ6IFdlIGFyZSBwcmltYXJ5IGRldmljZTsgbm90IHNlbmRpbmcga2V5IHN5bmMgcmVxdWVzdCdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHNpbmdsZVByb3RvSm9iUXVldWUuYWRkKE1lc3NhZ2VTZW5kZXIuZ2V0UmVxdWVzdEtleVN5bmNNZXNzYWdlKCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzdG9yYWdlU2VydmljZS51cGxvYWQ6IEZhaWxlZCB0byBxdWV1ZSBzeW5jIG1lc3NhZ2UnLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwcmV2aW91c01hbmlmZXN0OiBQcm90by5NYW5pZmVzdFJlY29yZCB8IHVuZGVmaW5lZDtcbiAgaWYgKCFmcm9tU3luYykge1xuICAgIC8vIFN5bmNpbmcgYmVmb3JlIHdlIHVwbG9hZCBzbyB0aGF0IHdlIHJlcGFpciBhbnkgdW5rbm93biByZWNvcmRzIGFuZFxuICAgIC8vIHJlY29yZHMgd2l0aCBlcnJvcnMgYXMgd2VsbCBhcyBlbnN1cmUgdGhhdCB3ZSBoYXZlIHRoZSBsYXRlc3QgdXAgdG8gZGF0ZVxuICAgIC8vIG1hbmlmZXN0LlxuICAgIC8vIFdlIGFyZSBnb2luZyB0byB1cGxvYWQgYWZ0ZXIgdGhpcyBzeW5jIHNvIHdlIGNhbiBpZ25vcmUgYW55IGNvbmZsaWN0c1xuICAgIC8vIHRoYXQgYXJpc2UgZHVyaW5nIHRoZSBzeW5jLlxuICAgIGNvbnN0IGlnbm9yZUNvbmZsaWN0cyA9IHRydWU7XG4gICAgcHJldmlvdXNNYW5pZmVzdCA9IGF3YWl0IHN5bmMoaWdub3JlQ29uZmxpY3RzKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2FsTWFuaWZlc3RWZXJzaW9uID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdtYW5pZmVzdFZlcnNpb24nLCAwKTtcbiAgY29uc3QgdmVyc2lvbiA9IE51bWJlcihsb2NhbE1hbmlmZXN0VmVyc2lvbikgKyAxO1xuXG4gIGxvZy5pbmZvKFxuICAgIGBzdG9yYWdlU2VydmljZS51cGxvYWQoJHt2ZXJzaW9ufSk6IHdpbGwgdXBkYXRlIHRvIG1hbmlmZXN0IHZlcnNpb25gXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBnZW5lcmF0ZWRNYW5pZmVzdCA9IGF3YWl0IGdlbmVyYXRlTWFuaWZlc3QoXG4gICAgICB2ZXJzaW9uLFxuICAgICAgcHJldmlvdXNNYW5pZmVzdCxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBhd2FpdCB1cGxvYWRNYW5pZmVzdCh2ZXJzaW9uLCBnZW5lcmF0ZWRNYW5pZmVzdCk7XG5cbiAgICAvLyBDbGVhciBwZW5kaW5nIGRlbGV0ZSBrZXlzIGFmdGVyIHN1Y2Nlc3NmdWwgdXBsb2FkXG4gICAgYXdhaXQgd2luZG93LnN0b3JhZ2UucHV0KCdzdG9yYWdlLXNlcnZpY2UtcGVuZGluZy1kZWxldGVzJywgW10pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT09IDQwOSkge1xuICAgICAgYXdhaXQgc2xlZXAoY29uZmxpY3RCYWNrT2ZmLmdldEFuZEluY3JlbWVudCgpKTtcbiAgICAgIGxvZy5pbmZvKCdzdG9yYWdlU2VydmljZS51cGxvYWQ6IHB1c2hpbmcgc3luYyBvbiB0aGUgcXVldWUnKTtcbiAgICAgIC8vIFRoZSBzeW5jIGpvYiB3aWxsIGNoZWNrIGZvciBjb25mbGljdHMgYW5kIGFzIHBhcnQgb2YgdGhhdCBjb25mbGljdFxuICAgICAgLy8gY2hlY2sgaWYgYW4gaXRlbSBuZWVkcyBzeW5jIGFuZCBkb2Vzbid0IG1hdGNoIHdpdGggdGhlIHJlbW90ZSByZWNvcmRcbiAgICAgIC8vIGl0J2xsIGtpY2sgb2ZmIGFub3RoZXIgdXBsb2FkLlxuICAgICAgc2V0VGltZW91dChydW5TdG9yYWdlU2VydmljZVN5bmNKb2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2cuZXJyb3IoXG4gICAgICBgc3RvcmFnZVNlcnZpY2UudXBsb2FkKCR7dmVyc2lvbn0pOiBlcnJvcmAsXG4gICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKVxuICAgICk7XG4gIH1cbn1cblxubGV0IHN0b3JhZ2VTZXJ2aWNlRW5hYmxlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlU3RvcmFnZVNlcnZpY2UoKTogdm9pZCB7XG4gIHN0b3JhZ2VTZXJ2aWNlRW5hYmxlZCA9IHRydWU7XG59XG5cbi8vIE5vdGU6IHRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgY2FsbGVkIGJlZm9yZSBDb252ZXJzYXRpb25Db250cm9sbGVyIGlzIGh5ZHJhdGVkLlxuLy8gICBJdCBnb2VzIGRpcmVjdGx5IHRvIHRoZSBkYXRhYmFzZSwgc28gaW4tbWVtb3J5IGNvbnZlcnNhdGlvbnMgd2lsbCBiZSBvdXQgb2YgZGF0ZS5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlcmFzZUFsbFN0b3JhZ2VTZXJ2aWNlU3RhdGUoe1xuICBrZWVwVW5rbm93bkZpZWxkcyA9IGZhbHNlLFxufTogeyBrZWVwVW5rbm93bkZpZWxkcz86IGJvb2xlYW4gfSA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gIGxvZy5pbmZvKCdzdG9yYWdlU2VydmljZS5lcmFzZUFsbFN0b3JhZ2VTZXJ2aWNlU3RhdGU6IHN0YXJ0aW5nLi4uJyk7XG4gIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICB3aW5kb3cuc3RvcmFnZS5yZW1vdmUoJ21hbmlmZXN0VmVyc2lvbicpLFxuICAgIGtlZXBVbmtub3duRmllbGRzXG4gICAgICA/IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICA6IHdpbmRvdy5zdG9yYWdlLnJlbW92ZSgnc3RvcmFnZS1zZXJ2aWNlLXVua25vd24tcmVjb3JkcycpLFxuICAgIHdpbmRvdy5zdG9yYWdlLnJlbW92ZSgnc3RvcmFnZUNyZWRlbnRpYWxzJyksXG4gIF0pO1xuICBhd2FpdCBlcmFzZVN0b3JhZ2VTZXJ2aWNlU3RhdGVGcm9tQ29udmVyc2F0aW9ucygpO1xuICBsb2cuaW5mbygnc3RvcmFnZVNlcnZpY2UuZXJhc2VBbGxTdG9yYWdlU2VydmljZVN0YXRlOiBjb21wbGV0ZScpO1xufVxuXG5leHBvcnQgY29uc3Qgc3RvcmFnZVNlcnZpY2VVcGxvYWRKb2IgPSBkZWJvdW5jZSgoKSA9PiB7XG4gIGlmICghc3RvcmFnZVNlcnZpY2VFbmFibGVkKSB7XG4gICAgbG9nLmluZm8oJ3N0b3JhZ2VTZXJ2aWNlLnN0b3JhZ2VTZXJ2aWNlVXBsb2FkSm9iOiBjYWxsZWQgYmVmb3JlIGVuYWJsZWQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdG9yYWdlSm9iUXVldWUoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHVwbG9hZCgpO1xuICB9LCBgdXBsb2FkIHYke3dpbmRvdy5zdG9yYWdlLmdldCgnbWFuaWZlc3RWZXJzaW9uJyl9YCk7XG59LCA1MDApO1xuXG5leHBvcnQgY29uc3QgcnVuU3RvcmFnZVNlcnZpY2VTeW5jSm9iID0gZGVib3VuY2UoKCkgPT4ge1xuICBpZiAoIXN0b3JhZ2VTZXJ2aWNlRW5hYmxlZCkge1xuICAgIGxvZy5pbmZvKCdzdG9yYWdlU2VydmljZS5ydW5TdG9yYWdlU2VydmljZVN5bmNKb2I6IGNhbGxlZCBiZWZvcmUgZW5hYmxlZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG91clByb2ZpbGVLZXlTZXJ2aWNlLmJsb2NrR2V0V2l0aFByb21pc2UoXG4gICAgc3RvcmFnZUpvYlF1ZXVlKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN5bmMoKTtcblxuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVycyBhYm91dCBzeW5jIGNvbXBsZXRpb25cbiAgICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCdzdG9yYWdlU2VydmljZTpzeW5jQ29tcGxldGUnKTtcbiAgICB9LCBgc3luYyB2JHt3aW5kb3cuc3RvcmFnZS5nZXQoJ21hbmlmZXN0VmVyc2lvbicpfWApXG4gICk7XG59LCA1MDApO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUEwQztBQUMxQyxtQkFBaUI7QUFDakIsa0JBQWlCO0FBRWpCLG9CQUEwQjtBQUMxQixZQUF1QjtBQUN2QixvQkFPTztBQUNQLDhCQWFPO0FBRVAsOEJBQThCO0FBRTlCLG9CQUE2QjtBQUM3QixzQkFBeUI7QUFDekIsZ0JBQTJCO0FBQzNCLHFCQUF3QjtBQUN4QixzQkFBZ0M7QUFDaEMsbUJBQXNCO0FBQ3RCLHVCQUFpQztBQUNqQywyQkFBcUM7QUFDckMsb0NBR087QUFDUCxzQkFBdUM7QUFDdkMsVUFBcUI7QUFDckIsaUNBQW9DO0FBQ3BDLGFBQXdCO0FBTXhCLHlCQUEwQjtBQU8xQixxQkFBOEI7QUFJOUIsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLElBQ0U7QUFFSixNQUFNLGVBQThCLENBQUM7QUFFckMsTUFBTSxtQkFBbUIsb0JBQUksSUFBSTtBQUFBLEVBQy9CO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsQ0FBQztBQUVELE1BQU0sVUFBVSxJQUFJLHVCQUFRO0FBQUEsRUFDMUIsVUFBVTtBQUFBLEVBQ1YsSUFBSSxVQUFVO0FBQUEsRUFDZCxLQUFLLFVBQVU7QUFBQSxFQUNmLElBQUksVUFBVTtBQUFBLEVBQ2QsSUFBSSxVQUFVO0FBQ2hCLENBQUM7QUFFRCxNQUFNLGtCQUFrQixJQUFJLHVCQUFRO0FBQUEsRUFDbEMsVUFBVTtBQUFB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
