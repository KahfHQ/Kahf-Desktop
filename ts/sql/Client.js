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
var Client_exports = {};
__export(Client_exports, {
  _cleanMessageData: () => _cleanMessageData,
  default: () => Client_default
});
module.exports = __toCommonJS(Client_exports);
var import_electron = require("electron");
var import_fs_extra = __toESM(require("fs-extra"));
var import_pify = __toESM(require("pify"));
var import_lodash = require("lodash");
var import_Conversation = require("../types/Conversation");
var import_expiringMessagesDeletion = require("../services/expiringMessagesDeletion");
var import_tapToViewMessagesDeletionService = require("../services/tapToViewMessagesDeletionService");
var Bytes = __toESM(require("../Bytes"));
var import_Message2 = require("../types/Message2");
var import_batcher = require("../util/batcher");
var import_assert = require("../util/assert");
var import_mapObjectWithSpec = require("../util/mapObjectWithSpec");
var import_cleanDataForIpc = require("./cleanDataForIpc");
var import_TaskWithTimeout = __toESM(require("../textsecure/TaskWithTimeout"));
var log = __toESM(require("../logging/log"));
var import_formatJobForInsert = require("../jobs/formatJobForInsert");
var import_cleanup = require("../util/cleanup");
var import_Server = __toESM(require("./Server"));
var import_errors = require("./errors");
var import_durations = require("../util/durations");
var import_idForLogging = require("../util/idForLogging");
if (import_electron.ipcRenderer && import_electron.ipcRenderer.setMaxListeners) {
  import_electron.ipcRenderer.setMaxListeners(0);
} else {
  log.warn("sql/Client: ipc is not available!");
}
const getRealPath = (0, import_pify.default)(import_fs_extra.default.realpath);
const MIN_TRACE_DURATION = 10;
const SQL_CHANNEL_KEY = "sql-channel";
const ERASE_SQL_KEY = "erase-sql-key";
const ERASE_ATTACHMENTS_KEY = "erase-attachments";
const ERASE_STICKERS_KEY = "erase-stickers";
const ERASE_TEMP_KEY = "erase-temp";
const ERASE_DRAFTS_KEY = "erase-drafts";
const CLEANUP_ORPHANED_ATTACHMENTS_KEY = "cleanup-orphaned-attachments";
const ENSURE_FILE_PERMISSIONS = "ensure-file-permissions";
var RendererState = /* @__PURE__ */ ((RendererState2) => {
  RendererState2["InMain"] = "InMain";
  RendererState2["Opening"] = "Opening";
  RendererState2["InRenderer"] = "InRenderer";
  RendererState2["Closing"] = "Closing";
  return RendererState2;
})(RendererState || {});
const _jobs = /* @__PURE__ */ Object.create(null);
const _DEBUG = false;
let _jobCounter = 0;
let _shuttingDown = false;
let _shutdownCallback = null;
let _shutdownPromise = null;
let state = "InMain" /* InMain */;
const startupQueries = /* @__PURE__ */ new Map();
const dataInterface = {
  close,
  removeDB,
  removeIndexedDBFiles,
  createOrUpdateIdentityKey,
  getIdentityKeyById,
  bulkAddIdentityKeys,
  removeIdentityKeyById,
  removeAllIdentityKeys,
  getAllIdentityKeys,
  createOrUpdatePreKey,
  getPreKeyById,
  bulkAddPreKeys,
  removePreKeyById,
  removePreKeysByUuid,
  removeAllPreKeys,
  getAllPreKeys,
  createOrUpdateSignedPreKey,
  getSignedPreKeyById,
  bulkAddSignedPreKeys,
  removeSignedPreKeyById,
  removeSignedPreKeysByUuid,
  removeAllSignedPreKeys,
  getAllSignedPreKeys,
  createOrUpdateItem,
  getItemById,
  removeItemById,
  removeAllItems,
  getAllItems,
  createOrUpdateSenderKey,
  getSenderKeyById,
  removeAllSenderKeys,
  getAllSenderKeys,
  removeSenderKeyById,
  insertSentProto,
  deleteSentProtosOlderThan,
  deleteSentProtoByMessageId,
  insertProtoRecipients,
  deleteSentProtoRecipient,
  getSentProtoByRecipient,
  removeAllSentProtos,
  getAllSentProtos,
  _getAllSentProtoRecipients,
  _getAllSentProtoMessageIds,
  createOrUpdateSession,
  createOrUpdateSessions,
  commitDecryptResult,
  bulkAddSessions,
  removeSessionById,
  removeSessionsByConversation,
  removeAllSessions,
  getAllSessions,
  eraseStorageServiceStateFromConversations,
  getConversationCount,
  saveConversation,
  saveConversations,
  getConversationById,
  updateConversation,
  updateConversations,
  removeConversation,
  _removeAllConversations,
  updateAllConversationColors,
  removeAllProfileKeyCredentials,
  getAllConversations,
  getAllConversationIds,
  getAllGroupsInvolvingUuid,
  searchMessages,
  searchMessagesInConversation,
  getMessageCount,
  getStoryCount,
  saveMessage,
  saveMessages,
  removeMessage,
  removeMessages,
  getTotalUnreadForConversation,
  getUnreadByConversationAndMarkRead,
  getUnreadReactionsAndMarkRead,
  markReactionAsRead,
  removeReactionFromConversation,
  addReaction,
  _getAllReactions,
  _removeAllReactions,
  getMessageBySender,
  getMessageById,
  getMessagesById,
  _getAllMessages,
  _removeAllMessages,
  getAllMessageIds,
  getMessagesBySentAt,
  getExpiredMessages,
  getMessagesUnexpectedlyMissingExpirationStartTimestamp,
  getSoonestMessageExpiry,
  getNextTapToViewMessageTimestampToAgeOut,
  getTapToViewMessagesNeedingErase,
  getOlderMessagesByConversation,
  getOlderStories,
  getNewerMessagesByConversation,
  getMessageMetricsForConversation,
  getConversationRangeCenteredOnMessage,
  getConversationMessageStats,
  getLastConversationMessage,
  hasGroupCallHistoryMessage,
  migrateConversationMessages,
  getUnprocessedCount,
  getAllUnprocessedAndIncrementAttempts,
  getUnprocessedById,
  updateUnprocessedWithData,
  updateUnprocessedsWithData,
  removeUnprocessed,
  removeAllUnprocessed,
  getAttachmentDownloadJobById,
  getNextAttachmentDownloadJobs,
  saveAttachmentDownloadJob,
  resetAttachmentDownloadPending,
  setAttachmentDownloadJobPending,
  removeAttachmentDownloadJob,
  removeAllAttachmentDownloadJobs,
  createOrUpdateStickerPack,
  updateStickerPackStatus,
  updateStickerPackInfo,
  createOrUpdateSticker,
  updateStickerLastUsed,
  addStickerPackReference,
  deleteStickerPackReference,
  getStickerCount,
  deleteStickerPack,
  getAllStickerPacks,
  addUninstalledStickerPack,
  removeUninstalledStickerPack,
  getInstalledStickerPacks,
  getUninstalledStickerPacks,
  installStickerPack,
  uninstallStickerPack,
  getStickerPackInfo,
  getAllStickers,
  getRecentStickers,
  clearAllErrorStickerPackAttempts,
  updateEmojiUsage,
  getRecentEmojis,
  getAllBadges,
  updateOrCreateBadges,
  badgeImageFileDownloaded,
  _getAllStoryDistributions,
  _getAllStoryDistributionMembers,
  _deleteAllStoryDistributions,
  createNewStoryDistribution,
  getAllStoryDistributionsWithMembers,
  getStoryDistributionWithMembers,
  modifyStoryDistribution,
  modifyStoryDistributionMembers,
  modifyStoryDistributionWithMembers,
  deleteStoryDistribution,
  _getAllStoryReads,
  _deleteAllStoryReads,
  addNewStoryRead,
  getLastStoryReadsForAuthor,
  countStoryReadsByConversation,
  removeAll,
  removeAllConfiguration,
  getMessagesNeedingUpgrade,
  getMessagesWithVisualMediaAttachments,
  getMessagesWithFileAttachments,
  getMessageServerGuidsForSpam,
  getJobsInQueue,
  insertJob,
  deleteJob,
  processGroupCallRingRequest,
  processGroupCallRingCancelation,
  cleanExpiredGroupCallRings,
  getMaxMessageCounter,
  getStatisticsForLogging,
  shutdown,
  removeAllMessagesInConversation,
  removeOtherData,
  cleanupOrphanedAttachments,
  ensureFilePermissions,
  startInRendererProcess,
  goBackToMainProcess,
  _jobs
};
var Client_default = dataInterface;
async function startInRendererProcess(isTesting = false) {
  (0, import_assert.strictAssert)(state === "InMain" /* InMain */, `startInRendererProcess: expected ${state} to be ${"InMain" /* InMain */}`);
  log.info("data.startInRendererProcess: switching to renderer process");
  state = "Opening" /* Opening */;
  if (!isTesting) {
    import_electron.ipcRenderer.send("database-ready");
    await new Promise((resolve) => {
      import_electron.ipcRenderer.once("database-ready", () => {
        resolve();
      });
    });
  }
  const configDir = await getRealPath(import_electron.ipcRenderer.sendSync("get-user-data-path"));
  const key = import_electron.ipcRenderer.sendSync("user-config-key");
  await import_Server.default.initializeRenderer({ configDir, key });
  log.info("data.startInRendererProcess: switched to renderer process");
  state = "InRenderer" /* InRenderer */;
}
async function goBackToMainProcess() {
  if (state === "InMain" /* InMain */) {
    log.info("goBackToMainProcess: Already in the main process");
    return;
  }
  (0, import_assert.strictAssert)(state === "InRenderer" /* InRenderer */, `goBackToMainProcess: expected ${state} to be ${"InRenderer" /* InRenderer */}`);
  log.info("data.goBackToMainProcess: switching to main process");
  const closePromise = close();
  state = "Closing" /* Closing */;
  await closePromise;
  state = "InMain" /* InMain */;
  const entries = Array.from(startupQueries.entries());
  startupQueries.clear();
  entries.sort((a, b) => b[1] - a[1]).filter(([_, duration]) => duration > MIN_TRACE_DURATION).forEach(([query, duration]) => {
    log.info(`startup query: ${query} ${duration}ms`);
  });
  log.info("data.goBackToMainProcess: switched to main process");
}
const channelsAsUnknown = (0, import_lodash.fromPairs)((0, import_lodash.compact)((0, import_lodash.map)((0, import_lodash.toPairs)(dataInterface), ([name, value]) => {
  if ((0, import_lodash.isFunction)(value)) {
    return [name, makeChannel(name)];
  }
  return null;
})));
const channels = channelsAsUnknown;
function _cleanData(data) {
  const { cleaned, pathsChanged } = (0, import_cleanDataForIpc.cleanDataForIpc)(data);
  if (pathsChanged.length) {
    log.info(`_cleanData cleaned the following paths: ${pathsChanged.join(", ")}`);
  }
  return cleaned;
}
function _cleanMessageData(data) {
  const result = { ...data };
  if (!data.received_at) {
    (0, import_assert.assert)(false, "received_at was not set on the message");
    result.received_at = window.Signal.Util.incrementMessageCounter();
  }
  if (data.attachments) {
    const logId = (0, import_idForLogging.getMessageIdForLogging)(data);
    result.attachments = data.attachments.map((attachment, index) => {
      if (attachment.data && !(0, import_lodash.isTypedArray)(attachment.data)) {
        log.warn(`_cleanMessageData/${logId}: Attachment ${index} had non-array \`data\` field; deleting.`);
        return (0, import_lodash.omit)(attachment, ["data"]);
      }
      return attachment;
    });
  }
  return _cleanData((0, import_lodash.omit)(result, ["dataMessage"]));
}
async function _shutdown() {
  const jobKeys = Object.keys(_jobs);
  log.info(`data.shutdown: shutdown requested. ${jobKeys.length} jobs outstanding`);
  if (_shutdownPromise) {
    await _shutdownPromise;
    return;
  }
  _shuttingDown = true;
  if (jobKeys.length === 0 || _DEBUG) {
    return;
  }
  _shutdownPromise = new Promise((resolve, reject) => {
    _shutdownCallback = /* @__PURE__ */ __name((error) => {
      log.info("data.shutdown: process complete");
      if (error) {
        reject(error);
        return;
      }
      resolve();
    }, "_shutdownCallback");
  });
  await _shutdownPromise;
}
function _makeJob(fnName) {
  if (_shuttingDown && fnName !== "close") {
    throw new Error(`Rejecting SQL channel job (${fnName}); application is shutting down`);
  }
  _jobCounter += 1;
  const id = _jobCounter;
  if (_DEBUG) {
    log.info(`SQL channel job ${id} (${fnName}) started`);
  }
  _jobs[id] = {
    fnName,
    start: Date.now()
  };
  return id;
}
function _updateJob(id, data) {
  const { resolve, reject } = data;
  const { fnName, start } = _jobs[id];
  _jobs[id] = {
    ..._jobs[id],
    ...data,
    resolve: (value) => {
      _removeJob(id);
      const end = Date.now();
      if (_DEBUG) {
        log.info(`SQL channel job ${id} (${fnName}) succeeded in ${end - start}ms`);
      }
      return resolve(value);
    },
    reject: (error) => {
      _removeJob(id);
      const end = Date.now();
      log.info(`SQL channel job ${id} (${fnName}) failed in ${end - start}ms`);
      return reject(error);
    }
  };
}
function _removeJob(id) {
  if (_DEBUG) {
    _jobs[id].complete = true;
    return;
  }
  delete _jobs[id];
  if (_shutdownCallback) {
    const keys = Object.keys(_jobs);
    if (keys.length === 0) {
      _shutdownCallback();
    }
  }
}
function _getJob(id) {
  return _jobs[id];
}
if (import_electron.ipcRenderer && import_electron.ipcRenderer.on) {
  import_electron.ipcRenderer.on(`${SQL_CHANNEL_KEY}-done`, (_, jobId, errorForDisplay, result) => {
    const job = _getJob(jobId);
    if (!job) {
      throw new Error(`Received SQL channel reply to job ${jobId}, but did not have it in our registry!`);
    }
    const { resolve, reject, fnName } = job;
    if (!resolve || !reject) {
      throw new Error(`SQL channel job ${jobId} (${fnName}): didn't have a resolve or reject`);
    }
    if (errorForDisplay) {
      return reject(new Error(`Error received from SQL channel job ${jobId} (${fnName}): ${errorForDisplay}`));
    }
    return resolve(result);
  });
} else {
  log.warn("sql/Client: ipc.on is not available!");
}
function makeChannel(fnName) {
  return async (...args) => {
    if (state === "InRenderer" /* InRenderer */) {
      const serverFnName = fnName;
      const serverFn = import_Server.default[serverFnName];
      const start = Date.now();
      try {
        return await serverFn(...args);
      } catch (error) {
        if ((0, import_errors.isCorruptionError)(error)) {
          log.error(`Detected sql corruption in renderer process. Restarting the application immediately. Error: ${error.message}`);
          import_electron.ipcRenderer?.send("database-error", error.stack);
        }
        log.error(`Renderer SQL channel job (${fnName}) error ${error.message}`);
        throw error;
      } finally {
        const duration = Date.now() - start;
        startupQueries.set(serverFnName, (startupQueries.get(serverFnName) || 0) + duration);
        if (duration > MIN_TRACE_DURATION || _DEBUG) {
          log.info(`Renderer SQL channel job (${fnName}) completed in ${duration}ms`);
        }
      }
    }
    const jobId = _makeJob(fnName);
    return (0, import_TaskWithTimeout.default)(() => new Promise((resolve, reject) => {
      try {
        import_electron.ipcRenderer.send(SQL_CHANNEL_KEY, jobId, fnName, ...args);
        _updateJob(jobId, {
          resolve,
          reject,
          args: _DEBUG ? args : void 0
        });
      } catch (error) {
        _removeJob(jobId);
        reject(error);
      }
    }), `SQL channel job ${jobId} (${fnName})`)();
  };
}
function specToBytes(spec, data) {
  return (0, import_mapObjectWithSpec.mapObjectWithSpec)(spec, data, (x) => Bytes.fromBase64(x));
}
function specFromBytes(spec, data) {
  return (0, import_mapObjectWithSpec.mapObjectWithSpec)(spec, data, (x) => Bytes.toBase64(x));
}
async function shutdown() {
  log.info("Client.shutdown");
  await _shutdown();
  await close();
}
async function close() {
  await channels.close();
}
async function removeDB() {
  await channels.removeDB();
}
async function removeIndexedDBFiles() {
  await channels.removeIndexedDBFiles();
}
const IDENTITY_KEY_SPEC = ["publicKey"];
async function createOrUpdateIdentityKey(data) {
  const updated = specFromBytes(IDENTITY_KEY_SPEC, data);
  await channels.createOrUpdateIdentityKey(updated);
}
async function getIdentityKeyById(id) {
  const data = await channels.getIdentityKeyById(id);
  return specToBytes(IDENTITY_KEY_SPEC, data);
}
async function bulkAddIdentityKeys(array) {
  const updated = (0, import_lodash.map)(array, (data) => specFromBytes(IDENTITY_KEY_SPEC, data));
  await channels.bulkAddIdentityKeys(updated);
}
async function removeIdentityKeyById(id) {
  await channels.removeIdentityKeyById(id);
}
async function removeAllIdentityKeys() {
  await channels.removeAllIdentityKeys();
}
async function getAllIdentityKeys() {
  const keys = await channels.getAllIdentityKeys();
  return keys.map((key) => specToBytes(IDENTITY_KEY_SPEC, key));
}
async function createOrUpdatePreKey(data) {
  const updated = specFromBytes(PRE_KEY_SPEC, data);
  await channels.createOrUpdatePreKey(updated);
}
async function getPreKeyById(id) {
  const data = await channels.getPreKeyById(id);
  return specToBytes(PRE_KEY_SPEC, data);
}
async function bulkAddPreKeys(array) {
  const updated = (0, import_lodash.map)(array, (data) => specFromBytes(PRE_KEY_SPEC, data));
  await channels.bulkAddPreKeys(updated);
}
async function removePreKeyById(id) {
  await channels.removePreKeyById(id);
}
async function removePreKeysByUuid(uuid) {
  await channels.removePreKeysByUuid(uuid);
}
async function removeAllPreKeys() {
  await channels.removeAllPreKeys();
}
async function getAllPreKeys() {
  const keys = await channels.getAllPreKeys();
  return keys.map((key) => specToBytes(PRE_KEY_SPEC, key));
}
const PRE_KEY_SPEC = ["privateKey", "publicKey"];
async function createOrUpdateSignedPreKey(data) {
  const updated = specFromBytes(PRE_KEY_SPEC, data);
  await channels.createOrUpdateSignedPreKey(updated);
}
async function getSignedPreKeyById(id) {
  const data = await channels.getSignedPreKeyById(id);
  return specToBytes(PRE_KEY_SPEC, data);
}
async function getAllSignedPreKeys() {
  const keys = await channels.getAllSignedPreKeys();
  return keys.map((key) => specToBytes(PRE_KEY_SPEC, key));
}
async function bulkAddSignedPreKeys(array) {
  const updated = (0, import_lodash.map)(array, (data) => specFromBytes(PRE_KEY_SPEC, data));
  await channels.bulkAddSignedPreKeys(updated);
}
async function removeSignedPreKeyById(id) {
  await channels.removeSignedPreKeyById(id);
}
async function removeSignedPreKeysByUuid(uuid) {
  await channels.removeSignedPreKeysByUuid(uuid);
}
async function removeAllSignedPreKeys() {
  await channels.removeAllSignedPreKeys();
}
const ITEM_SPECS = {
  senderCertificate: ["value.serialized"],
  senderCertificateNoE164: ["value.serialized"],
  subscriberId: ["value"],
  profileKey: ["value"],
  identityKeyMap: {
    key: "value",
    valueSpec: {
      isMap: true,
      valueSpec: ["privKey", "pubKey"]
    }
  }
};
async function createOrUpdateItem(data) {
  const { id } = data;
  if (!id) {
    throw new Error("createOrUpdateItem: Provided data did not have a truthy id");
  }
  const spec = ITEM_SPECS[id];
  const updated = spec ? specFromBytes(spec, data) : data;
  await channels.createOrUpdateItem(updated);
}
async function getItemById(id) {
  const spec = ITEM_SPECS[id];
  const data = await channels.getItemById(id);
  return spec ? specToBytes(spec, data) : data;
}
async function getAllItems() {
  const items = await channels.getAllItems();
  const result = /* @__PURE__ */ Object.create(null);
  for (const id of Object.keys(items)) {
    const key = id;
    const value = items[key];
    const keys = ITEM_SPECS[key];
    const deserializedValue = keys ? specToBytes(keys, { value }).value : value;
    result[key] = deserializedValue;
  }
  return result;
}
async function removeItemById(id) {
  await channels.removeItemById(id);
}
async function removeAllItems() {
  await channels.removeAllItems();
}
async function createOrUpdateSenderKey(key) {
  await channels.createOrUpdateSenderKey(key);
}
async function getSenderKeyById(id) {
  return channels.getSenderKeyById(id);
}
async function removeAllSenderKeys() {
  await channels.removeAllSenderKeys();
}
async function getAllSenderKeys() {
  return channels.getAllSenderKeys();
}
async function removeSenderKeyById(id) {
  return channels.removeSenderKeyById(id);
}
async function insertSentProto(proto, options) {
  return channels.insertSentProto(proto, {
    ...options,
    messageIds: (0, import_lodash.uniq)(options.messageIds)
  });
}
async function deleteSentProtosOlderThan(timestamp) {
  await channels.deleteSentProtosOlderThan(timestamp);
}
async function deleteSentProtoByMessageId(messageId) {
  await channels.deleteSentProtoByMessageId(messageId);
}
async function insertProtoRecipients(options) {
  await channels.insertProtoRecipients(options);
}
async function deleteSentProtoRecipient(options) {
  await channels.deleteSentProtoRecipient(options);
}
async function getSentProtoByRecipient(options) {
  return channels.getSentProtoByRecipient(options);
}
async function removeAllSentProtos() {
  await channels.removeAllSentProtos();
}
async function getAllSentProtos() {
  return channels.getAllSentProtos();
}
async function _getAllSentProtoRecipients() {
  return channels._getAllSentProtoRecipients();
}
async function _getAllSentProtoMessageIds() {
  return channels._getAllSentProtoMessageIds();
}
async function createOrUpdateSession(data) {
  await channels.createOrUpdateSession(data);
}
async function createOrUpdateSessions(array) {
  await channels.createOrUpdateSessions(array);
}
async function commitDecryptResult(options) {
  await channels.commitDecryptResult(options);
}
async function bulkAddSessions(array) {
  await channels.bulkAddSessions(array);
}
async function removeSessionById(id) {
  await channels.removeSessionById(id);
}
async function removeSessionsByConversation(conversationId) {
  await channels.removeSessionsByConversation(conversationId);
}
async function removeAllSessions() {
  await channels.removeAllSessions();
}
async function getAllSessions() {
  const sessions = await channels.getAllSessions();
  return sessions;
}
async function getConversationCount() {
  return channels.getConversationCount();
}
async function saveConversation(data) {
  await channels.saveConversation(data);
}
async function saveConversations(array) {
  await channels.saveConversations(array);
}
async function getConversationById(id) {
  return channels.getConversationById(id);
}
const updateConversationBatcher = (0, import_batcher.createBatcher)({
  name: "sql.Client.updateConversationBatcher",
  wait: 500,
  maxSize: 20,
  processBatch: async (items) => {
    const byId = (0, import_lodash.groupBy)(items, (item) => item.id);
    const ids = Object.keys(byId);
    const mostRecent = ids.map((id) => {
      const maybeLast = (0, import_lodash.last)(byId[id]);
      (0, import_assert.assert)(maybeLast !== void 0, "Empty array in `groupBy` result");
      return maybeLast;
    });
    await updateConversations(mostRecent);
  }
});
function updateConversation(data) {
  updateConversationBatcher.add(data);
}
async function updateConversations(array) {
  const { cleaned, pathsChanged } = (0, import_cleanDataForIpc.cleanDataForIpc)(array);
  (0, import_assert.assert)(!pathsChanged.length, `Paths were cleaned: ${JSON.stringify(pathsChanged)}`);
  await channels.updateConversations(cleaned);
}
async function removeConversation(id) {
  const existing = await getConversationById(id);
  if (existing) {
    await channels.removeConversation(id);
    await (0, import_Conversation.deleteExternalFiles)(existing, {
      deleteAttachmentData: window.Signal.Migrations.deleteAttachmentData
    });
  }
}
async function _removeAllConversations() {
  await channels._removeAllConversations();
}
async function eraseStorageServiceStateFromConversations() {
  await channels.eraseStorageServiceStateFromConversations();
}
async function getAllConversations() {
  return channels.getAllConversations();
}
async function getAllConversationIds() {
  const ids = await channels.getAllConversationIds();
  return ids;
}
async function getAllGroupsInvolvingUuid(uuid) {
  return channels.getAllGroupsInvolvingUuid(uuid);
}
function handleSearchMessageJSON(messages) {
  return messages.map((message) => ({
    json: message.json,
    bodyRanges: [],
    ...JSON.parse(message.json),
    snippet: message.snippet
  }));
}
async function searchMessages(query, { limit } = {}) {
  const messages = await channels.searchMessages(query, { limit });
  return handleSearchMessageJSON(messages);
}
async function searchMessagesInConversation(query, conversationId, { limit } = {}) {
  const messages = await channels.searchMessagesInConversation(query, conversationId, { limit });
  return handleSearchMessageJSON(messages);
}
async function getMessageCount(conversationId) {
  return channels.getMessageCount(conversationId);
}
async function getStoryCount(conversationId) {
  return channels.getStoryCount(conversationId);
}
async function saveMessage(data, options) {
  const id = await channels.saveMessage(_cleanMessageData(data), {
    ...options,
    jobToInsert: options.jobToInsert && (0, import_formatJobForInsert.formatJobForInsert)(options.jobToInsert)
  });
  import_expiringMessagesDeletion.expiringMessagesDeletionService.update();
  import_tapToViewMessagesDeletionService.tapToViewMessagesDeletionService.update();
  return id;
}
async function saveMessages(arrayOfMessages, options) {
  await channels.saveMessages(arrayOfMessages.map((message) => _cleanMessageData(message)), options);
  import_expiringMessagesDeletion.expiringMessagesDeletionService.update();
  import_tapToViewMessagesDeletionService.tapToViewMessagesDeletionService.update();
}
async function removeMessage(id) {
  const message = await getMessageById(id);
  if (message) {
    await channels.removeMessage(id);
    await (0, import_cleanup.cleanupMessage)(message);
  }
}
async function removeMessages(ids) {
  await channels.removeMessages(ids);
}
async function getMessageById(id) {
  return channels.getMessageById(id);
}
async function getMessagesById(messageIds) {
  if (!messageIds.length) {
    return [];
  }
  return channels.getMessagesById(messageIds);
}
async function _getAllMessages() {
  return channels._getAllMessages();
}
async function _removeAllMessages() {
  await channels._removeAllMessages();
}
async function getAllMessageIds() {
  const ids = await channels.getAllMessageIds();
  return ids;
}
async function getMessageBySender({
  source,
  sourceUuid,
  sourceDevice,
  sent_at
}) {
  return channels.getMessageBySender({
    source,
    sourceUuid,
    sourceDevice,
    sent_at
  });
}
async function getTotalUnreadForConversation(conversationId, options) {
  return channels.getTotalUnreadForConversation(conversationId, options);
}
async function getUnreadByConversationAndMarkRead(options) {
  return channels.getUnreadByConversationAndMarkRead(options);
}
async function getUnreadReactionsAndMarkRead(options) {
  return channels.getUnreadReactionsAndMarkRead(options);
}
async function markReactionAsRead(targetAuthorUuid, targetTimestamp) {
  return channels.markReactionAsRead(targetAuthorUuid, targetTimestamp);
}
async function removeReactionFromConversation(reaction) {
  return channels.removeReactionFromConversation(reaction);
}
async function addReaction(reactionObj) {
  return channels.addReaction(reactionObj);
}
async function _getAllReactions() {
  return channels._getAllReactions();
}
async function _removeAllReactions() {
  await channels._removeAllReactions();
}
function handleMessageJSON(messages) {
  return messages.map((message) => JSON.parse(message.json));
}
async function getOlderMessagesByConversation(conversationId, {
  isGroup,
  limit = 100,
  messageId,
  receivedAt = Number.MAX_VALUE,
  sentAt = Number.MAX_VALUE,
  storyId
}) {
  const messages = await channels.getOlderMessagesByConversation(conversationId, {
    isGroup,
    limit,
    receivedAt,
    sentAt,
    messageId,
    storyId
  });
  return handleMessageJSON(messages);
}
async function getOlderStories(options) {
  return channels.getOlderStories(options);
}
async function getNewerMessagesByConversation(conversationId, {
  isGroup,
  limit = 100,
  receivedAt = 0,
  sentAt = 0,
  storyId
}) {
  const messages = await channels.getNewerMessagesByConversation(conversationId, {
    isGroup,
    limit,
    receivedAt,
    sentAt,
    storyId
  });
  return handleMessageJSON(messages);
}
async function getConversationMessageStats({
  conversationId,
  isGroup,
  ourUuid
}) {
  const { preview, activity, hasUserInitiatedMessages } = await channels.getConversationMessageStats({
    conversationId,
    isGroup,
    ourUuid
  });
  return {
    preview,
    activity,
    hasUserInitiatedMessages
  };
}
async function getLastConversationMessage({
  conversationId
}) {
  return channels.getLastConversationMessage({ conversationId });
}
async function getMessageMetricsForConversation(conversationId, storyId, isGroup) {
  const result = await channels.getMessageMetricsForConversation(conversationId, storyId, isGroup);
  return result;
}
async function getConversationRangeCenteredOnMessage(options) {
  const result = await channels.getConversationRangeCenteredOnMessage(options);
  return {
    ...result,
    older: handleMessageJSON(result.older),
    newer: handleMessageJSON(result.newer)
  };
}
function hasGroupCallHistoryMessage(conversationId, eraId) {
  return channels.hasGroupCallHistoryMessage(conversationId, eraId);
}
async function migrateConversationMessages(obsoleteId, currentId) {
  await channels.migrateConversationMessages(obsoleteId, currentId);
}
async function removeAllMessagesInConversation(conversationId, {
  logId
}) {
  let messages;
  do {
    const chunkSize = 20;
    log.info(`removeAllMessagesInConversation/${logId}: Fetching chunk of ${chunkSize} messages`);
    messages = await getOlderMessagesByConversation(conversationId, {
      limit: chunkSize,
      isGroup: true,
      storyId: void 0
    });
    if (!messages.length) {
      return;
    }
    const ids = messages.map((message) => message.id);
    log.info(`removeAllMessagesInConversation/${logId}: Cleanup...`);
    const queue = new window.PQueue({ concurrency: 3, timeout: import_durations.MINUTE * 30 });
    queue.addAll(messages.map((message) => async () => (0, import_cleanup.cleanupMessage)(message)));
    await queue.onIdle();
    log.info(`removeAllMessagesInConversation/${logId}: Deleting...`);
    await channels.removeMessages(ids);
  } while (messages.length > 0);
}
async function getMessagesBySentAt(sentAt) {
  return channels.getMessagesBySentAt(sentAt);
}
async function getExpiredMessages() {
  return channels.getExpiredMessages();
}
function getMessagesUnexpectedlyMissingExpirationStartTimestamp() {
  return channels.getMessagesUnexpectedlyMissingExpirationStartTimestamp();
}
function getSoonestMessageExpiry() {
  return channels.getSoonestMessageExpiry();
}
async function getNextTapToViewMessageTimestampToAgeOut() {
  return channels.getNextTapToViewMessageTimestampToAgeOut();
}
async function getTapToViewMessagesNeedingErase() {
  return channels.getTapToViewMessagesNeedingErase();
}
async function getUnprocessedCount() {
  return channels.getUnprocessedCount();
}
async function getAllUnprocessedAndIncrementAttempts() {
  return channels.getAllUnprocessedAndIncrementAttempts();
}
async function getUnprocessedById(id) {
  return channels.getUnprocessedById(id);
}
async function updateUnprocessedWithData(id, data) {
  await channels.updateUnprocessedWithData(id, data);
}
async function updateUnprocessedsWithData(array) {
  await channels.updateUnprocessedsWithData(array);
}
async function removeUnprocessed(id) {
  await channels.removeUnprocessed(id);
}
async function removeAllUnprocessed() {
  await channels.removeAllUnprocessed();
}
async function getAttachmentDownloadJobById(id) {
  return channels.getAttachmentDownloadJobById(id);
}
async function getNextAttachmentDownloadJobs(limit, options) {
  return channels.getNextAttachmentDownloadJobs(limit, options);
}
async function saveAttachmentDownloadJob(job) {
  await channels.saveAttachmentDownloadJob(_cleanData(job));
}
async function setAttachmentDownloadJobPending(id, pending) {
  await channels.setAttachmentDownloadJobPending(id, pending);
}
async function resetAttachmentDownloadPending() {
  await channels.resetAttachmentDownloadPending();
}
async function removeAttachmentDownloadJob(id) {
  await channels.removeAttachmentDownloadJob(id);
}
async function removeAllAttachmentDownloadJobs() {
  await channels.removeAllAttachmentDownloadJobs();
}
async function getStickerCount() {
  return channels.getStickerCount();
}
async function createOrUpdateStickerPack(pack) {
  await channels.createOrUpdateStickerPack(pack);
}
async function updateStickerPackStatus(packId, status, options) {
  await channels.updateStickerPackStatus(packId, status, options);
}
async function updateStickerPackInfo(info) {
  await channels.updateStickerPackInfo(info);
}
async function createOrUpdateSticker(sticker) {
  await channels.createOrUpdateSticker(sticker);
}
async function updateStickerLastUsed(packId, stickerId, timestamp) {
  return channels.updateStickerLastUsed(packId, stickerId, timestamp);
}
async function addStickerPackReference(messageId, packId) {
  await channels.addStickerPackReference(messageId, packId);
}
async function deleteStickerPackReference(messageId, packId) {
  return channels.deleteStickerPackReference(messageId, packId);
}
async function deleteStickerPack(packId) {
  return channels.deleteStickerPack(packId);
}
async function getAllStickerPacks() {
  const packs = await channels.getAllStickerPacks();
  return packs;
}
async function addUninstalledStickerPack(pack) {
  return channels.addUninstalledStickerPack(pack);
}
async function removeUninstalledStickerPack(packId) {
  return channels.removeUninstalledStickerPack(packId);
}
async function getInstalledStickerPacks() {
  return channels.getInstalledStickerPacks();
}
async function getUninstalledStickerPacks() {
  return channels.getUninstalledStickerPacks();
}
async function installStickerPack(packId, timestamp) {
  return channels.installStickerPack(packId, timestamp);
}
async function uninstallStickerPack(packId, timestamp) {
  return channels.uninstallStickerPack(packId, timestamp);
}
async function getStickerPackInfo(packId) {
  return channels.getStickerPackInfo(packId);
}
async function getAllStickers() {
  const stickers = await channels.getAllStickers();
  return stickers;
}
async function getRecentStickers() {
  const recentStickers = await channels.getRecentStickers();
  return recentStickers;
}
async function clearAllErrorStickerPackAttempts() {
  await channels.clearAllErrorStickerPackAttempts();
}
async function updateEmojiUsage(shortName) {
  await channels.updateEmojiUsage(shortName);
}
async function getRecentEmojis(limit = 32) {
  return channels.getRecentEmojis(limit);
}
function getAllBadges() {
  return channels.getAllBadges();
}
async function updateOrCreateBadges(badges) {
  if (badges.length) {
    await channels.updateOrCreateBadges(badges);
  }
}
function badgeImageFileDownloaded(url, localPath) {
  return channels.badgeImageFileDownloaded(url, localPath);
}
async function _getAllStoryDistributions() {
  return channels._getAllStoryDistributions();
}
async function _getAllStoryDistributionMembers() {
  return channels._getAllStoryDistributionMembers();
}
async function _deleteAllStoryDistributions() {
  await channels._deleteAllStoryDistributions();
}
async function createNewStoryDistribution(distribution) {
  await channels.createNewStoryDistribution(distribution);
}
async function getAllStoryDistributionsWithMembers() {
  return channels.getAllStoryDistributionsWithMembers();
}
async function getStoryDistributionWithMembers(id) {
  return channels.getStoryDistributionWithMembers(id);
}
async function modifyStoryDistribution(distribution) {
  await channels.modifyStoryDistribution(distribution);
}
async function modifyStoryDistributionMembers(id, options) {
  await channels.modifyStoryDistributionMembers(id, options);
}
async function modifyStoryDistributionWithMembers(distribution, options) {
  await channels.modifyStoryDistributionWithMembers(distribution, options);
}
async function deleteStoryDistribution(id) {
  await channels.deleteStoryDistribution(id);
}
async function _getAllStoryReads() {
  return channels._getAllStoryReads();
}
async function _deleteAllStoryReads() {
  await channels._deleteAllStoryReads();
}
async function addNewStoryRead(read) {
  return channels.addNewStoryRead(read);
}
async function getLastStoryReadsForAuthor(options) {
  return channels.getLastStoryReadsForAuthor(options);
}
async function countStoryReadsByConversation(conversationId) {
  return channels.countStoryReadsByConversation(conversationId);
}
async function removeAll() {
  await channels.removeAll();
}
async function removeAllConfiguration(type) {
  await channels.removeAllConfiguration(type);
}
async function cleanupOrphanedAttachments() {
  await callChannel(CLEANUP_ORPHANED_ATTACHMENTS_KEY);
}
async function ensureFilePermissions() {
  await callChannel(ENSURE_FILE_PERMISSIONS);
}
async function removeOtherData() {
  await Promise.all([
    callChannel(ERASE_SQL_KEY),
    callChannel(ERASE_ATTACHMENTS_KEY),
    callChannel(ERASE_STICKERS_KEY),
    callChannel(ERASE_TEMP_KEY),
    callChannel(ERASE_DRAFTS_KEY)
  ]);
}
async function callChannel(name) {
  return (0, import_TaskWithTimeout.default)(() => new Promise((resolve, reject) => {
    import_electron.ipcRenderer.send(name);
    import_electron.ipcRenderer.once(`${name}-done`, (_, error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  }), `callChannel call to ${name}`)();
}
async function getMessagesNeedingUpgrade(limit, { maxVersion = import_Message2.CURRENT_SCHEMA_VERSION }) {
  const messages = await channels.getMessagesNeedingUpgrade(limit, {
    maxVersion
  });
  return messages;
}
async function getMessagesWithVisualMediaAttachments(conversationId, { limit }) {
  return channels.getMessagesWithVisualMediaAttachments(conversationId, {
    limit
  });
}
async function getMessagesWithFileAttachments(conversationId, { limit }) {
  return channels.getMessagesWithFileAttachments(conversationId, {
    limit
  });
}
function getMessageServerGuidsForSpam(conversationId) {
  return channels.getMessageServerGuidsForSpam(conversationId);
}
function getJobsInQueue(queueType) {
  return channels.getJobsInQueue(queueType);
}
function insertJob(job) {
  return channels.insertJob(job);
}
function deleteJob(id) {
  return channels.deleteJob(id);
}
function processGroupCallRingRequest(ringId) {
  return channels.processGroupCallRingRequest(ringId);
}
function processGroupCallRingCancelation(ringId) {
  return channels.processGroupCallRingCancelation(ringId);
}
async function cleanExpiredGroupCallRings() {
  await channels.cleanExpiredGroupCallRings();
}
async function updateAllConversationColors(conversationColor, customColorData) {
  return channels.updateAllConversationColors(conversationColor, customColorData);
}
async function removeAllProfileKeyCredentials() {
  return channels.removeAllProfileKeyCredentials();
}
function getMaxMessageCounter() {
  return channels.getMaxMessageCounter();
}
function getStatisticsForLogging() {
  return channels.getStatisticsForLogging();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _cleanMessageData
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ2xpZW50LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbm8tYXdhaXQtaW4tbG9vcCAqL1xuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5pbXBvcnQgeyBpcGNSZW5kZXJlciBhcyBpcGMgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBpZnkgZnJvbSAncGlmeSc7XG5cbmltcG9ydCB7XG4gIGNvbXBhY3QsXG4gIGZyb21QYWlycyxcbiAgZ3JvdXBCeSxcbiAgaXNGdW5jdGlvbixcbiAgaXNUeXBlZEFycmF5LFxuICBsYXN0LFxuICBtYXAsXG4gIG9taXQsXG4gIHRvUGFpcnMsXG4gIHVuaXEsXG59IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IGRlbGV0ZUV4dGVybmFsRmlsZXMgfSBmcm9tICcuLi90eXBlcy9Db252ZXJzYXRpb24nO1xuaW1wb3J0IHsgZXhwaXJpbmdNZXNzYWdlc0RlbGV0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2V4cGlyaW5nTWVzc2FnZXNEZWxldGlvbic7XG5pbXBvcnQgeyB0YXBUb1ZpZXdNZXNzYWdlc0RlbGV0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RhcFRvVmlld01lc3NhZ2VzRGVsZXRpb25TZXJ2aWNlJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB7IENVUlJFTlRfU0NIRU1BX1ZFUlNJT04gfSBmcm9tICcuLi90eXBlcy9NZXNzYWdlMic7XG5pbXBvcnQgeyBjcmVhdGVCYXRjaGVyIH0gZnJvbSAnLi4vdXRpbC9iYXRjaGVyJztcbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgbWFwT2JqZWN0V2l0aFNwZWMgfSBmcm9tICcuLi91dGlsL21hcE9iamVjdFdpdGhTcGVjJztcbmltcG9ydCB0eXBlIHsgT2JqZWN0TWFwcGluZ1NwZWNUeXBlIH0gZnJvbSAnLi4vdXRpbC9tYXBPYmplY3RXaXRoU3BlYyc7XG5pbXBvcnQgeyBjbGVhbkRhdGFGb3JJcGMgfSBmcm9tICcuL2NsZWFuRGF0YUZvcklwYyc7XG5pbXBvcnQgdHlwZSB7IFJlYWN0aW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL1JlYWN0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbkNvbG9yVHlwZSwgQ3VzdG9tQ29sb3JUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB0eXBlIHsgQmFkZ2VUeXBlIH0gZnJvbSAnLi4vYmFkZ2VzL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgUHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0UmVzdWx0IH0gZnJvbSAnLi4vdHlwZXMvQ2FsbGluZyc7XG5pbXBvcnQgdHlwZSB7IFJlbW92ZUFsbENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi90eXBlcy9SZW1vdmVBbGxDb25maWd1cmF0aW9uJztcbmltcG9ydCBjcmVhdGVUYXNrV2l0aFRpbWVvdXQgZnJvbSAnLi4vdGV4dHNlY3VyZS9UYXNrV2l0aFRpbWVvdXQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcblxuaW1wb3J0IHR5cGUgeyBTdG9yZWRKb2IgfSBmcm9tICcuLi9qb2JzL3R5cGVzJztcbmltcG9ydCB7IGZvcm1hdEpvYkZvckluc2VydCB9IGZyb20gJy4uL2pvYnMvZm9ybWF0Sm9iRm9ySW5zZXJ0JztcbmltcG9ydCB7IGNsZWFudXBNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbC9jbGVhbnVwJztcblxuaW1wb3J0IHR5cGUge1xuICBBbGxJdGVtc1R5cGUsXG4gIEF0dGFjaG1lbnREb3dubG9hZEpvYlR5cGUsXG4gIENsaWVudEludGVyZmFjZSxcbiAgQ2xpZW50Sm9iVHlwZSxcbiAgQ2xpZW50U2VhcmNoUmVzdWx0TWVzc2FnZVR5cGUsXG4gIENvbnZlcnNhdGlvblR5cGUsXG4gIENvbnZlcnNhdGlvbk1ldHJpY3NUeXBlLFxuICBEZWxldGVTZW50UHJvdG9SZWNpcGllbnRPcHRpb25zVHlwZSxcbiAgRW1vamlUeXBlLFxuICBHZXRVbnJlYWRCeUNvbnZlcnNhdGlvbkFuZE1hcmtSZWFkUmVzdWx0VHlwZSxcbiAgR2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZVJlc3VsdFR5cGUsXG4gIElkZW50aXR5S2V5SWRUeXBlLFxuICBJZGVudGl0eUtleVR5cGUsXG4gIFN0b3JlZElkZW50aXR5S2V5VHlwZSxcbiAgSXRlbUtleVR5cGUsXG4gIEl0ZW1UeXBlLFxuICBTdG9yZWRJdGVtVHlwZSxcbiAgQ29udmVyc2F0aW9uTWVzc2FnZVN0YXRzVHlwZSxcbiAgTWVzc2FnZVR5cGUsXG4gIE1lc3NhZ2VUeXBlVW5oeWRyYXRlZCxcbiAgUHJlS2V5SWRUeXBlLFxuICBQcmVLZXlUeXBlLFxuICBSZWFjdGlvblJlc3VsdFR5cGUsXG4gIFN0b3JlZFByZUtleVR5cGUsXG4gIFNlbmRlcktleUlkVHlwZSxcbiAgU2VuZGVyS2V5VHlwZSxcbiAgU2VudE1lc3NhZ2VEQlR5cGUsXG4gIFNlbnRNZXNzYWdlc1R5cGUsXG4gIFNlbnRQcm90b1R5cGUsXG4gIFNlbnRQcm90b1dpdGhNZXNzYWdlSWRzVHlwZSxcbiAgU2VudFJlY2lwaWVudHNEQlR5cGUsXG4gIFNlbnRSZWNpcGllbnRzVHlwZSxcbiAgU2VydmVySW50ZXJmYWNlLFxuICBTZXJ2ZXJTZWFyY2hSZXN1bHRNZXNzYWdlVHlwZSxcbiAgU2Vzc2lvbklkVHlwZSxcbiAgU2Vzc2lvblR5cGUsXG4gIFNpZ25lZFByZUtleUlkVHlwZSxcbiAgU2lnbmVkUHJlS2V5VHlwZSxcbiAgU3RvcmVkU2lnbmVkUHJlS2V5VHlwZSxcbiAgU3RpY2tlclBhY2tTdGF0dXNUeXBlLFxuICBTdGlja2VyUGFja0luZm9UeXBlLFxuICBTdGlja2VyUGFja1R5cGUsXG4gIFN0aWNrZXJUeXBlLFxuICBTdG9yeURpc3RyaWJ1dGlvbk1lbWJlclR5cGUsXG4gIFN0b3J5RGlzdHJpYnV0aW9uVHlwZSxcbiAgU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUsXG4gIFN0b3J5UmVhZFR5cGUsXG4gIFVucHJvY2Vzc2VkVHlwZSxcbiAgVW5wcm9jZXNzZWRVcGRhdGVUeXBlLFxuICBVbmluc3RhbGxlZFN0aWNrZXJQYWNrVHlwZSxcbn0gZnJvbSAnLi9JbnRlcmZhY2UnO1xuaW1wb3J0IFNlcnZlciBmcm9tICcuL1NlcnZlcic7XG5pbXBvcnQgeyBpc0NvcnJ1cHRpb25FcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IGdldE1lc3NhZ2VJZEZvckxvZ2dpbmcgfSBmcm9tICcuLi91dGlsL2lkRm9yTG9nZ2luZyc7XG5cbi8vIFdlIGxpc3RlbiB0byBhIGxvdCBvZiBldmVudHMgb24gaXBjLCBvZnRlbiBvbiB0aGUgc2FtZSBjaGFubmVsLiBUaGlzIHByZXZlbnRzXG4vLyAgIGFueSB3YXJuaW5ncyB0aGF0IG1pZ2h0IGJlIHNlbnQgdG8gdGhlIGNvbnNvbGUgaW4gdGhhdCBjYXNlLlxuaWYgKGlwYyAmJiBpcGMuc2V0TWF4TGlzdGVuZXJzKSB7XG4gIGlwYy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG59IGVsc2Uge1xuICBsb2cud2Fybignc3FsL0NsaWVudDogaXBjIGlzIG5vdCBhdmFpbGFibGUhJyk7XG59XG5cbmNvbnN0IGdldFJlYWxQYXRoID0gcGlmeShmcy5yZWFscGF0aCk7XG5cbmNvbnN0IE1JTl9UUkFDRV9EVVJBVElPTiA9IDEwO1xuXG5jb25zdCBTUUxfQ0hBTk5FTF9LRVkgPSAnc3FsLWNoYW5uZWwnO1xuY29uc3QgRVJBU0VfU1FMX0tFWSA9ICdlcmFzZS1zcWwta2V5JztcbmNvbnN0IEVSQVNFX0FUVEFDSE1FTlRTX0tFWSA9ICdlcmFzZS1hdHRhY2htZW50cyc7XG5jb25zdCBFUkFTRV9TVElDS0VSU19LRVkgPSAnZXJhc2Utc3RpY2tlcnMnO1xuY29uc3QgRVJBU0VfVEVNUF9LRVkgPSAnZXJhc2UtdGVtcCc7XG5jb25zdCBFUkFTRV9EUkFGVFNfS0VZID0gJ2VyYXNlLWRyYWZ0cyc7XG5jb25zdCBDTEVBTlVQX09SUEhBTkVEX0FUVEFDSE1FTlRTX0tFWSA9ICdjbGVhbnVwLW9ycGhhbmVkLWF0dGFjaG1lbnRzJztcbmNvbnN0IEVOU1VSRV9GSUxFX1BFUk1JU1NJT05TID0gJ2Vuc3VyZS1maWxlLXBlcm1pc3Npb25zJztcblxudHlwZSBDbGllbnRKb2JVcGRhdGVUeXBlID0ge1xuICByZXNvbHZlOiAodmFsdWU6IHVua25vd24pID0+IHZvaWQ7XG4gIHJlamVjdDogKGVycm9yOiBFcnJvcikgPT4gdm9pZDtcbiAgYXJncz86IFJlYWRvbmx5QXJyYXk8dW5rbm93bj47XG59O1xuXG5lbnVtIFJlbmRlcmVyU3RhdGUge1xuICBJbk1haW4gPSAnSW5NYWluJyxcbiAgT3BlbmluZyA9ICdPcGVuaW5nJyxcbiAgSW5SZW5kZXJlciA9ICdJblJlbmRlcmVyJyxcbiAgQ2xvc2luZyA9ICdDbG9zaW5nJyxcbn1cblxuY29uc3QgX2pvYnM6IHsgW2lkOiBzdHJpbmddOiBDbGllbnRKb2JUeXBlIH0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuY29uc3QgX0RFQlVHID0gZmFsc2U7XG5sZXQgX2pvYkNvdW50ZXIgPSAwO1xubGV0IF9zaHV0dGluZ0Rvd24gPSBmYWxzZTtcbmxldCBfc2h1dGRvd25DYWxsYmFjazogKChlcnJvcj86IEVycm9yKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xubGV0IF9zaHV0ZG93blByb21pc2U6IFByb21pc2U8dm9pZD4gfCBudWxsID0gbnVsbDtcbmxldCBzdGF0ZSA9IFJlbmRlcmVyU3RhdGUuSW5NYWluO1xuY29uc3Qgc3RhcnR1cFF1ZXJpZXMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuXG4vLyBCZWNhdXNlIHdlIGNhbid0IGZvcmNlIHRoaXMgbW9kdWxlIHRvIGNvbmZvcm0gdG8gYW4gaW50ZXJmYWNlLCB3ZSBuYXJyb3cgb3VyIGV4cG9ydHNcbi8vICAgdG8gdGhpcyBvbmUgZGVmYXVsdCBleHBvcnQsIHdoaWNoIGRvZXMgY29uZm9ybSB0byB0aGUgaW50ZXJmYWNlLlxuLy8gTm90ZTogSW4gSmF2YXNjcmlwdCwgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSAuZGVmYXVsdCBwcm9wZXJ0eSB3aGVuIHJlcXVpcmluZyBpdFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80MjBcbmNvbnN0IGRhdGFJbnRlcmZhY2U6IENsaWVudEludGVyZmFjZSA9IHtcbiAgY2xvc2UsXG4gIHJlbW92ZURCLFxuICByZW1vdmVJbmRleGVkREJGaWxlcyxcblxuICBjcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5LFxuICBnZXRJZGVudGl0eUtleUJ5SWQsXG4gIGJ1bGtBZGRJZGVudGl0eUtleXMsXG4gIHJlbW92ZUlkZW50aXR5S2V5QnlJZCxcbiAgcmVtb3ZlQWxsSWRlbnRpdHlLZXlzLFxuICBnZXRBbGxJZGVudGl0eUtleXMsXG5cbiAgY3JlYXRlT3JVcGRhdGVQcmVLZXksXG4gIGdldFByZUtleUJ5SWQsXG4gIGJ1bGtBZGRQcmVLZXlzLFxuICByZW1vdmVQcmVLZXlCeUlkLFxuICByZW1vdmVQcmVLZXlzQnlVdWlkLFxuICByZW1vdmVBbGxQcmVLZXlzLFxuICBnZXRBbGxQcmVLZXlzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2lnbmVkUHJlS2V5LFxuICBnZXRTaWduZWRQcmVLZXlCeUlkLFxuICBidWxrQWRkU2lnbmVkUHJlS2V5cyxcbiAgcmVtb3ZlU2lnbmVkUHJlS2V5QnlJZCxcbiAgcmVtb3ZlU2lnbmVkUHJlS2V5c0J5VXVpZCxcbiAgcmVtb3ZlQWxsU2lnbmVkUHJlS2V5cyxcbiAgZ2V0QWxsU2lnbmVkUHJlS2V5cyxcblxuICBjcmVhdGVPclVwZGF0ZUl0ZW0sXG4gIGdldEl0ZW1CeUlkLFxuICByZW1vdmVJdGVtQnlJZCxcbiAgcmVtb3ZlQWxsSXRlbXMsXG4gIGdldEFsbEl0ZW1zLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2VuZGVyS2V5LFxuICBnZXRTZW5kZXJLZXlCeUlkLFxuICByZW1vdmVBbGxTZW5kZXJLZXlzLFxuICBnZXRBbGxTZW5kZXJLZXlzLFxuICByZW1vdmVTZW5kZXJLZXlCeUlkLFxuXG4gIGluc2VydFNlbnRQcm90byxcbiAgZGVsZXRlU2VudFByb3Rvc09sZGVyVGhhbixcbiAgZGVsZXRlU2VudFByb3RvQnlNZXNzYWdlSWQsXG4gIGluc2VydFByb3RvUmVjaXBpZW50cyxcbiAgZGVsZXRlU2VudFByb3RvUmVjaXBpZW50LFxuICBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCxcbiAgcmVtb3ZlQWxsU2VudFByb3RvcyxcbiAgZ2V0QWxsU2VudFByb3RvcyxcbiAgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMsXG4gIF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvbixcbiAgY3JlYXRlT3JVcGRhdGVTZXNzaW9ucyxcbiAgY29tbWl0RGVjcnlwdFJlc3VsdCxcbiAgYnVsa0FkZFNlc3Npb25zLFxuICByZW1vdmVTZXNzaW9uQnlJZCxcbiAgcmVtb3ZlU2Vzc2lvbnNCeUNvbnZlcnNhdGlvbixcbiAgcmVtb3ZlQWxsU2Vzc2lvbnMsXG4gIGdldEFsbFNlc3Npb25zLFxuXG4gIGVyYXNlU3RvcmFnZVNlcnZpY2VTdGF0ZUZyb21Db252ZXJzYXRpb25zLFxuICBnZXRDb252ZXJzYXRpb25Db3VudCxcbiAgc2F2ZUNvbnZlcnNhdGlvbixcbiAgc2F2ZUNvbnZlcnNhdGlvbnMsXG4gIGdldENvbnZlcnNhdGlvbkJ5SWQsXG4gIHVwZGF0ZUNvbnZlcnNhdGlvbixcbiAgdXBkYXRlQ29udmVyc2F0aW9ucyxcbiAgcmVtb3ZlQ29udmVyc2F0aW9uLFxuICBfcmVtb3ZlQWxsQ29udmVyc2F0aW9ucyxcbiAgdXBkYXRlQWxsQ29udmVyc2F0aW9uQ29sb3JzLFxuICByZW1vdmVBbGxQcm9maWxlS2V5Q3JlZGVudGlhbHMsXG5cbiAgZ2V0QWxsQ29udmVyc2F0aW9ucyxcbiAgZ2V0QWxsQ29udmVyc2F0aW9uSWRzLFxuICBnZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkLFxuXG4gIHNlYXJjaE1lc3NhZ2VzLFxuICBzZWFyY2hNZXNzYWdlc0luQ29udmVyc2F0aW9uLFxuXG4gIGdldE1lc3NhZ2VDb3VudCxcbiAgZ2V0U3RvcnlDb3VudCxcbiAgc2F2ZU1lc3NhZ2UsXG4gIHNhdmVNZXNzYWdlcyxcbiAgcmVtb3ZlTWVzc2FnZSxcbiAgcmVtb3ZlTWVzc2FnZXMsXG4gIGdldFRvdGFsVW5yZWFkRm9yQ29udmVyc2F0aW9uLFxuICBnZXRVbnJlYWRCeUNvbnZlcnNhdGlvbkFuZE1hcmtSZWFkLFxuICBnZXRVbnJlYWRSZWFjdGlvbnNBbmRNYXJrUmVhZCxcbiAgbWFya1JlYWN0aW9uQXNSZWFkLFxuICByZW1vdmVSZWFjdGlvbkZyb21Db252ZXJzYXRpb24sXG4gIGFkZFJlYWN0aW9uLFxuICBfZ2V0QWxsUmVhY3Rpb25zLFxuICBfcmVtb3ZlQWxsUmVhY3Rpb25zLFxuICBnZXRNZXNzYWdlQnlTZW5kZXIsXG4gIGdldE1lc3NhZ2VCeUlkLFxuICBnZXRNZXNzYWdlc0J5SWQsXG4gIF9nZXRBbGxNZXNzYWdlcyxcbiAgX3JlbW92ZUFsbE1lc3NhZ2VzLFxuICBnZXRBbGxNZXNzYWdlSWRzLFxuICBnZXRNZXNzYWdlc0J5U2VudEF0LFxuICBnZXRFeHBpcmVkTWVzc2FnZXMsXG4gIGdldE1lc3NhZ2VzVW5leHBlY3RlZGx5TWlzc2luZ0V4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgZ2V0U29vbmVzdE1lc3NhZ2VFeHBpcnksXG4gIGdldE5leHRUYXBUb1ZpZXdNZXNzYWdlVGltZXN0YW1wVG9BZ2VPdXQsXG4gIGdldFRhcFRvVmlld01lc3NhZ2VzTmVlZGluZ0VyYXNlLFxuICBnZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gIGdldE9sZGVyU3RvcmllcyxcbiAgZ2V0TmV3ZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uLFxuICBnZXRNZXNzYWdlTWV0cmljc0ZvckNvbnZlcnNhdGlvbixcbiAgZ2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZSxcbiAgZ2V0Q29udmVyc2F0aW9uTWVzc2FnZVN0YXRzLFxuICBnZXRMYXN0Q29udmVyc2F0aW9uTWVzc2FnZSxcbiAgaGFzR3JvdXBDYWxsSGlzdG9yeU1lc3NhZ2UsXG4gIG1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyxcblxuICBnZXRVbnByb2Nlc3NlZENvdW50LFxuICBnZXRBbGxVbnByb2Nlc3NlZEFuZEluY3JlbWVudEF0dGVtcHRzLFxuICBnZXRVbnByb2Nlc3NlZEJ5SWQsXG4gIHVwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGEsXG4gIHVwZGF0ZVVucHJvY2Vzc2Vkc1dpdGhEYXRhLFxuICByZW1vdmVVbnByb2Nlc3NlZCxcbiAgcmVtb3ZlQWxsVW5wcm9jZXNzZWQsXG5cbiAgZ2V0QXR0YWNobWVudERvd25sb2FkSm9iQnlJZCxcbiAgZ2V0TmV4dEF0dGFjaG1lbnREb3dubG9hZEpvYnMsXG4gIHNhdmVBdHRhY2htZW50RG93bmxvYWRKb2IsXG4gIHJlc2V0QXR0YWNobWVudERvd25sb2FkUGVuZGluZyxcbiAgc2V0QXR0YWNobWVudERvd25sb2FkSm9iUGVuZGluZyxcbiAgcmVtb3ZlQXR0YWNobWVudERvd25sb2FkSm9iLFxuICByZW1vdmVBbGxBdHRhY2htZW50RG93bmxvYWRKb2JzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU3RpY2tlclBhY2ssXG4gIHVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzLFxuICB1cGRhdGVTdGlja2VyUGFja0luZm8sXG4gIGNyZWF0ZU9yVXBkYXRlU3RpY2tlcixcbiAgdXBkYXRlU3RpY2tlckxhc3RVc2VkLFxuICBhZGRTdGlja2VyUGFja1JlZmVyZW5jZSxcbiAgZGVsZXRlU3RpY2tlclBhY2tSZWZlcmVuY2UsXG4gIGdldFN0aWNrZXJDb3VudCxcbiAgZGVsZXRlU3RpY2tlclBhY2ssXG4gIGdldEFsbFN0aWNrZXJQYWNrcyxcbiAgYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFjayxcbiAgcmVtb3ZlVW5pbnN0YWxsZWRTdGlja2VyUGFjayxcbiAgZ2V0SW5zdGFsbGVkU3RpY2tlclBhY2tzLFxuICBnZXRVbmluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgaW5zdGFsbFN0aWNrZXJQYWNrLFxuICB1bmluc3RhbGxTdGlja2VyUGFjayxcbiAgZ2V0U3RpY2tlclBhY2tJbmZvLFxuICBnZXRBbGxTdGlja2VycyxcbiAgZ2V0UmVjZW50U3RpY2tlcnMsXG4gIGNsZWFyQWxsRXJyb3JTdGlja2VyUGFja0F0dGVtcHRzLFxuXG4gIHVwZGF0ZUVtb2ppVXNhZ2UsXG4gIGdldFJlY2VudEVtb2ppcyxcblxuICBnZXRBbGxCYWRnZXMsXG4gIHVwZGF0ZU9yQ3JlYXRlQmFkZ2VzLFxuICBiYWRnZUltYWdlRmlsZURvd25sb2FkZWQsXG5cbiAgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucyxcbiAgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycyxcbiAgX2RlbGV0ZUFsbFN0b3J5RGlzdHJpYnV0aW9ucyxcbiAgY3JlYXRlTmV3U3RvcnlEaXN0cmlidXRpb24sXG4gIGdldEFsbFN0b3J5RGlzdHJpYnV0aW9uc1dpdGhNZW1iZXJzLFxuICBnZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbixcbiAgbW9kaWZ5U3RvcnlEaXN0cmlidXRpb25NZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzLFxuICBkZWxldGVTdG9yeURpc3RyaWJ1dGlvbixcblxuICBfZ2V0QWxsU3RvcnlSZWFkcyxcbiAgX2RlbGV0ZUFsbFN0b3J5UmVhZHMsXG4gIGFkZE5ld1N0b3J5UmVhZCxcbiAgZ2V0TGFzdFN0b3J5UmVhZHNGb3JBdXRob3IsXG4gIGNvdW50U3RvcnlSZWFkc0J5Q29udmVyc2F0aW9uLFxuXG4gIHJlbW92ZUFsbCxcbiAgcmVtb3ZlQWxsQ29uZmlndXJhdGlvbixcblxuICBnZXRNZXNzYWdlc05lZWRpbmdVcGdyYWRlLFxuICBnZXRNZXNzYWdlc1dpdGhWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICBnZXRNZXNzYWdlc1dpdGhGaWxlQXR0YWNobWVudHMsXG4gIGdldE1lc3NhZ2VTZXJ2ZXJHdWlkc0ZvclNwYW0sXG5cbiAgZ2V0Sm9ic0luUXVldWUsXG4gIGluc2VydEpvYixcbiAgZGVsZXRlSm9iLFxuXG4gIHByb2Nlc3NHcm91cENhbGxSaW5nUmVxdWVzdCxcbiAgcHJvY2Vzc0dyb3VwQ2FsbFJpbmdDYW5jZWxhdGlvbixcbiAgY2xlYW5FeHBpcmVkR3JvdXBDYWxsUmluZ3MsXG5cbiAgZ2V0TWF4TWVzc2FnZUNvdW50ZXIsXG5cbiAgZ2V0U3RhdGlzdGljc0ZvckxvZ2dpbmcsXG5cbiAgLy8gQ2xpZW50LXNpZGUgb25seVxuXG4gIHNodXRkb3duLFxuICByZW1vdmVBbGxNZXNzYWdlc0luQ29udmVyc2F0aW9uLFxuXG4gIHJlbW92ZU90aGVyRGF0YSxcbiAgY2xlYW51cE9ycGhhbmVkQXR0YWNobWVudHMsXG4gIGVuc3VyZUZpbGVQZXJtaXNzaW9ucyxcblxuICAvLyBDbGllbnQtc2lkZSBvbmx5LCBhbmQgdGVzdC1vbmx5XG5cbiAgc3RhcnRJblJlbmRlcmVyUHJvY2VzcyxcbiAgZ29CYWNrVG9NYWluUHJvY2VzcyxcbiAgX2pvYnMsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkYXRhSW50ZXJmYWNlO1xuXG5hc3luYyBmdW5jdGlvbiBzdGFydEluUmVuZGVyZXJQcm9jZXNzKGlzVGVzdGluZyA9IGZhbHNlKTogUHJvbWlzZTx2b2lkPiB7XG4gIHN0cmljdEFzc2VydChcbiAgICBzdGF0ZSA9PT0gUmVuZGVyZXJTdGF0ZS5Jbk1haW4sXG4gICAgYHN0YXJ0SW5SZW5kZXJlclByb2Nlc3M6IGV4cGVjdGVkICR7c3RhdGV9IHRvIGJlICR7UmVuZGVyZXJTdGF0ZS5Jbk1haW59YFxuICApO1xuXG4gIGxvZy5pbmZvKCdkYXRhLnN0YXJ0SW5SZW5kZXJlclByb2Nlc3M6IHN3aXRjaGluZyB0byByZW5kZXJlciBwcm9jZXNzJyk7XG4gIHN0YXRlID0gUmVuZGVyZXJTdGF0ZS5PcGVuaW5nO1xuXG4gIGlmICghaXNUZXN0aW5nKSB7XG4gICAgaXBjLnNlbmQoJ2RhdGFiYXNlLXJlYWR5Jyk7XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgIGlwYy5vbmNlKCdkYXRhYmFzZS1yZWFkeScsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBjb25maWdEaXIgPSBhd2FpdCBnZXRSZWFsUGF0aChpcGMuc2VuZFN5bmMoJ2dldC11c2VyLWRhdGEtcGF0aCcpKTtcbiAgY29uc3Qga2V5ID0gaXBjLnNlbmRTeW5jKCd1c2VyLWNvbmZpZy1rZXknKTtcblxuICBhd2FpdCBTZXJ2ZXIuaW5pdGlhbGl6ZVJlbmRlcmVyKHsgY29uZmlnRGlyLCBrZXkgfSk7XG5cbiAgbG9nLmluZm8oJ2RhdGEuc3RhcnRJblJlbmRlcmVyUHJvY2Vzczogc3dpdGNoZWQgdG8gcmVuZGVyZXIgcHJvY2VzcycpO1xuXG4gIHN0YXRlID0gUmVuZGVyZXJTdGF0ZS5JblJlbmRlcmVyO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnb0JhY2tUb01haW5Qcm9jZXNzKCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoc3RhdGUgPT09IFJlbmRlcmVyU3RhdGUuSW5NYWluKSB7XG4gICAgbG9nLmluZm8oJ2dvQmFja1RvTWFpblByb2Nlc3M6IEFscmVhZHkgaW4gdGhlIG1haW4gcHJvY2VzcycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0cmljdEFzc2VydChcbiAgICBzdGF0ZSA9PT0gUmVuZGVyZXJTdGF0ZS5JblJlbmRlcmVyLFxuICAgIGBnb0JhY2tUb01haW5Qcm9jZXNzOiBleHBlY3RlZCAke3N0YXRlfSB0byBiZSAke1JlbmRlcmVyU3RhdGUuSW5SZW5kZXJlcn1gXG4gICk7XG5cbiAgLy8gV2UgZG9uJ3QgbmVlZCB0byB3YWl0IGZvciBwZW5kaW5nIHF1ZXJpZXMgc2luY2UgdGhleSBhcmUgc3luY2hyb25vdXMuXG4gIGxvZy5pbmZvKCdkYXRhLmdvQmFja1RvTWFpblByb2Nlc3M6IHN3aXRjaGluZyB0byBtYWluIHByb2Nlc3MnKTtcbiAgY29uc3QgY2xvc2VQcm9taXNlID0gY2xvc2UoKTtcblxuICAvLyBJdCBzaG91bGQgYmUgdGhlIGxhc3QgcXVlcnkgd2UgcnVuIGluIHJlbmRlcmVyIHByb2Nlc3NcbiAgc3RhdGUgPSBSZW5kZXJlclN0YXRlLkNsb3Npbmc7XG4gIGF3YWl0IGNsb3NlUHJvbWlzZTtcbiAgc3RhdGUgPSBSZW5kZXJlclN0YXRlLkluTWFpbjtcblxuICAvLyBQcmludCBxdWVyeSBzdGF0aXN0aWNzIGZvciB3aG9sZSBzdGFydHVwXG4gIGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKHN0YXJ0dXBRdWVyaWVzLmVudHJpZXMoKSk7XG4gIHN0YXJ0dXBRdWVyaWVzLmNsZWFyKCk7XG5cbiAgLy8gU29ydCBieSBkZWNyZWFzaW5nIGR1cmF0aW9uXG4gIGVudHJpZXNcbiAgICAuc29ydCgoYSwgYikgPT4gYlsxXSAtIGFbMV0pXG4gICAgLmZpbHRlcigoW18sIGR1cmF0aW9uXSkgPT4gZHVyYXRpb24gPiBNSU5fVFJBQ0VfRFVSQVRJT04pXG4gICAgLmZvckVhY2goKFtxdWVyeSwgZHVyYXRpb25dKSA9PiB7XG4gICAgICBsb2cuaW5mbyhgc3RhcnR1cCBxdWVyeTogJHtxdWVyeX0gJHtkdXJhdGlvbn1tc2ApO1xuICAgIH0pO1xuXG4gIGxvZy5pbmZvKCdkYXRhLmdvQmFja1RvTWFpblByb2Nlc3M6IHN3aXRjaGVkIHRvIG1haW4gcHJvY2VzcycpO1xufVxuXG5jb25zdCBjaGFubmVsc0FzVW5rbm93biA9IGZyb21QYWlycyhcbiAgY29tcGFjdChcbiAgICBtYXAodG9QYWlycyhkYXRhSW50ZXJmYWNlKSwgKFtuYW1lLCB2YWx1ZV06IFtzdHJpbmcsIHVua25vd25dKSA9PiB7XG4gICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIFtuYW1lLCBtYWtlQ2hhbm5lbChuYW1lKV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pXG4gIClcbikgYXMgdW5rbm93bjtcblxuY29uc3QgY2hhbm5lbHM6IFNlcnZlckludGVyZmFjZSA9IGNoYW5uZWxzQXNVbmtub3duIGFzIFNlcnZlckludGVyZmFjZTtcblxuZnVuY3Rpb24gX2NsZWFuRGF0YShcbiAgZGF0YTogdW5rbm93blxuKTogUmV0dXJuVHlwZTx0eXBlb2YgY2xlYW5EYXRhRm9ySXBjPlsnY2xlYW5lZCddIHtcbiAgY29uc3QgeyBjbGVhbmVkLCBwYXRoc0NoYW5nZWQgfSA9IGNsZWFuRGF0YUZvcklwYyhkYXRhKTtcblxuICBpZiAocGF0aHNDaGFuZ2VkLmxlbmd0aCkge1xuICAgIGxvZy5pbmZvKFxuICAgICAgYF9jbGVhbkRhdGEgY2xlYW5lZCB0aGUgZm9sbG93aW5nIHBhdGhzOiAke3BhdGhzQ2hhbmdlZC5qb2luKCcsICcpfWBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGNsZWFuZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfY2xlYW5NZXNzYWdlRGF0YShkYXRhOiBNZXNzYWdlVHlwZSk6IE1lc3NhZ2VUeXBlIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5kYXRhIH07XG4gIC8vIEVuc3VyZSB0aGF0IGFsbCBtZXNzYWdlcyBoYXZlIHRoZSByZWNlaXZlZF9hdCBzZXQgcHJvcGVybHlcbiAgaWYgKCFkYXRhLnJlY2VpdmVkX2F0KSB7XG4gICAgYXNzZXJ0KGZhbHNlLCAncmVjZWl2ZWRfYXQgd2FzIG5vdCBzZXQgb24gdGhlIG1lc3NhZ2UnKTtcbiAgICByZXN1bHQucmVjZWl2ZWRfYXQgPSB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKTtcbiAgfVxuICBpZiAoZGF0YS5hdHRhY2htZW50cykge1xuICAgIGNvbnN0IGxvZ0lkID0gZ2V0TWVzc2FnZUlkRm9yTG9nZ2luZyhkYXRhKTtcbiAgICByZXN1bHQuYXR0YWNobWVudHMgPSBkYXRhLmF0dGFjaG1lbnRzLm1hcCgoYXR0YWNobWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChhdHRhY2htZW50LmRhdGEgJiYgIWlzVHlwZWRBcnJheShhdHRhY2htZW50LmRhdGEpKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBfY2xlYW5NZXNzYWdlRGF0YS8ke2xvZ0lkfTogQXR0YWNobWVudCAke2luZGV4fSBoYWQgbm9uLWFycmF5IFxcYGRhdGFcXGAgZmllbGQ7IGRlbGV0aW5nLmBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG9taXQoYXR0YWNobWVudCwgWydkYXRhJ10pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gX2NsZWFuRGF0YShvbWl0KHJlc3VsdCwgWydkYXRhTWVzc2FnZSddKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9zaHV0ZG93bigpIHtcbiAgY29uc3Qgam9iS2V5cyA9IE9iamVjdC5rZXlzKF9qb2JzKTtcbiAgbG9nLmluZm8oXG4gICAgYGRhdGEuc2h1dGRvd246IHNodXRkb3duIHJlcXVlc3RlZC4gJHtqb2JLZXlzLmxlbmd0aH0gam9icyBvdXRzdGFuZGluZ2BcbiAgKTtcblxuICBpZiAoX3NodXRkb3duUHJvbWlzZSkge1xuICAgIGF3YWl0IF9zaHV0ZG93blByb21pc2U7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBfc2h1dHRpbmdEb3duID0gdHJ1ZTtcblxuICAvLyBObyBvdXRzdGFuZGluZyBqb2JzLCByZXR1cm4gaW1tZWRpYXRlbHlcbiAgaWYgKGpvYktleXMubGVuZ3RoID09PSAwIHx8IF9ERUJVRykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIE91dHN0YW5kaW5nIGpvYnM7IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCB0aGUgbGFzdCBvbmUgaXMgZG9uZVxuICBfc2h1dGRvd25Qcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIF9zaHV0ZG93bkNhbGxiYWNrID0gKGVycm9yPzogRXJyb3IpID0+IHtcbiAgICAgIGxvZy5pbmZvKCdkYXRhLnNodXRkb3duOiBwcm9jZXNzIGNvbXBsZXRlJyk7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmUoKTtcbiAgICB9O1xuICB9KTtcblxuICBhd2FpdCBfc2h1dGRvd25Qcm9taXNlO1xufVxuXG5mdW5jdGlvbiBfbWFrZUpvYihmbk5hbWU6IHN0cmluZykge1xuICBpZiAoX3NodXR0aW5nRG93biAmJiBmbk5hbWUgIT09ICdjbG9zZScpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgUmVqZWN0aW5nIFNRTCBjaGFubmVsIGpvYiAoJHtmbk5hbWV9KTsgYXBwbGljYXRpb24gaXMgc2h1dHRpbmcgZG93bmBcbiAgICApO1xuICB9XG5cbiAgX2pvYkNvdW50ZXIgKz0gMTtcbiAgY29uc3QgaWQgPSBfam9iQ291bnRlcjtcblxuICBpZiAoX0RFQlVHKSB7XG4gICAgbG9nLmluZm8oYFNRTCBjaGFubmVsIGpvYiAke2lkfSAoJHtmbk5hbWV9KSBzdGFydGVkYCk7XG4gIH1cbiAgX2pvYnNbaWRdID0ge1xuICAgIGZuTmFtZSxcbiAgICBzdGFydDogRGF0ZS5ub3coKSxcbiAgfTtcblxuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF91cGRhdGVKb2IoaWQ6IG51bWJlciwgZGF0YTogQ2xpZW50Sm9iVXBkYXRlVHlwZSkge1xuICBjb25zdCB7IHJlc29sdmUsIHJlamVjdCB9ID0gZGF0YTtcbiAgY29uc3QgeyBmbk5hbWUsIHN0YXJ0IH0gPSBfam9ic1tpZF07XG5cbiAgX2pvYnNbaWRdID0ge1xuICAgIC4uLl9qb2JzW2lkXSxcbiAgICAuLi5kYXRhLFxuICAgIHJlc29sdmU6ICh2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgX3JlbW92ZUpvYihpZCk7XG4gICAgICBjb25zdCBlbmQgPSBEYXRlLm5vdygpO1xuICAgICAgaWYgKF9ERUJVRykge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgU1FMIGNoYW5uZWwgam9iICR7aWR9ICgke2ZuTmFtZX0pIHN1Y2NlZWRlZCBpbiAke2VuZCAtIHN0YXJ0fW1zYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSxcbiAgICByZWplY3Q6IChlcnJvcjogRXJyb3IpID0+IHtcbiAgICAgIF9yZW1vdmVKb2IoaWQpO1xuICAgICAgY29uc3QgZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIGxvZy5pbmZvKGBTUUwgY2hhbm5lbCBqb2IgJHtpZH0gKCR7Zm5OYW1lfSkgZmFpbGVkIGluICR7ZW5kIC0gc3RhcnR9bXNgKTtcblxuICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gX3JlbW92ZUpvYihpZDogbnVtYmVyKSB7XG4gIGlmIChfREVCVUcpIHtcbiAgICBfam9ic1tpZF0uY29tcGxldGUgPSB0cnVlO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGVsZXRlIF9qb2JzW2lkXTtcblxuICBpZiAoX3NodXRkb3duQ2FsbGJhY2spIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoX2pvYnMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgX3NodXRkb3duQ2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldEpvYihpZDogbnVtYmVyKSB7XG4gIHJldHVybiBfam9ic1tpZF07XG59XG5cbmlmIChpcGMgJiYgaXBjLm9uKSB7XG4gIGlwYy5vbihgJHtTUUxfQ0hBTk5FTF9LRVl9LWRvbmVgLCAoXywgam9iSWQsIGVycm9yRm9yRGlzcGxheSwgcmVzdWx0KSA9PiB7XG4gICAgY29uc3Qgam9iID0gX2dldEpvYihqb2JJZCk7XG4gICAgaWYgKCFqb2IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFJlY2VpdmVkIFNRTCBjaGFubmVsIHJlcGx5IHRvIGpvYiAke2pvYklkfSwgYnV0IGRpZCBub3QgaGF2ZSBpdCBpbiBvdXIgcmVnaXN0cnkhYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHJlc29sdmUsIHJlamVjdCwgZm5OYW1lIH0gPSBqb2I7XG5cbiAgICBpZiAoIXJlc29sdmUgfHwgIXJlamVjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU1FMIGNoYW5uZWwgam9iICR7am9iSWR9ICgke2ZuTmFtZX0pOiBkaWRuJ3QgaGF2ZSBhIHJlc29sdmUgb3IgcmVqZWN0YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JGb3JEaXNwbGF5KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgYEVycm9yIHJlY2VpdmVkIGZyb20gU1FMIGNoYW5uZWwgam9iICR7am9iSWR9ICgke2ZuTmFtZX0pOiAke2Vycm9yRm9yRGlzcGxheX1gXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmUocmVzdWx0KTtcbiAgfSk7XG59IGVsc2Uge1xuICBsb2cud2Fybignc3FsL0NsaWVudDogaXBjLm9uIGlzIG5vdCBhdmFpbGFibGUhJyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VDaGFubmVsKGZuTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBhc3luYyAoLi4uYXJnczogUmVhZG9ubHlBcnJheTx1bmtub3duPikgPT4ge1xuICAgIC8vIER1cmluZyBzdGFydHVwIHdlIHdhbnQgdG8gYXZvaWQgdGhlIGhpZ2ggb3ZlcmhlYWQgb2YgSVBDIHNvIHdlIHV0aWxpemVcbiAgICAvLyB0aGUgZGIgdGhhdCBleGlzdHMgaW4gdGhlIHJlbmRlcmVyIHByb2Nlc3MgdG8gYmUgYWJsZSB0byBib290IHVwIHF1aWNrbHlcbiAgICAvLyBvbmNlIHRoZSBhcHAgaXMgcnVubmluZyB3ZSBzd2l0Y2ggYmFjayB0byB0aGUgbWFpbiBwcm9jZXNzIHRvIGF2b2lkIHRoZVxuICAgIC8vIFVJIGZyb20gbG9ja2luZyB1cCB3aGVuZXZlciB3ZSBkbyBjb3N0bHkgZGIgb3BlcmF0aW9ucy5cbiAgICBpZiAoc3RhdGUgPT09IFJlbmRlcmVyU3RhdGUuSW5SZW5kZXJlcikge1xuICAgICAgY29uc3Qgc2VydmVyRm5OYW1lID0gZm5OYW1lIGFzIGtleW9mIFNlcnZlckludGVyZmFjZTtcbiAgICAgIGNvbnN0IHNlcnZlckZuID0gU2VydmVyW3NlcnZlckZuTmFtZV0gYXMgKFxuICAgICAgICAuLi5mbkFyZ3M6IFJlYWRvbmx5QXJyYXk8dW5rbm93bj5cbiAgICAgICkgPT4gdW5rbm93bjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gSWdub3JpbmcgdGhpcyBlcnJvciBUUzI1NTY6IEV4cGVjdGVkIDMgYXJndW1lbnRzLCBidXQgZ290IDAgb3IgbW9yZS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHNlcnZlckZuKC4uLmFyZ3MpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGlzQ29ycnVwdGlvbkVycm9yKGVycm9yKSkge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgICdEZXRlY3RlZCBzcWwgY29ycnVwdGlvbiBpbiByZW5kZXJlciBwcm9jZXNzLiAnICtcbiAgICAgICAgICAgICAgYFJlc3RhcnRpbmcgdGhlIGFwcGxpY2F0aW9uIGltbWVkaWF0ZWx5LiBFcnJvcjogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlwYz8uc2VuZCgnZGF0YWJhc2UtZXJyb3InLCBlcnJvci5zdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBSZW5kZXJlciBTUUwgY2hhbm5lbCBqb2IgKCR7Zm5OYW1lfSkgZXJyb3IgJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IERhdGUubm93KCkgLSBzdGFydDtcblxuICAgICAgICBzdGFydHVwUXVlcmllcy5zZXQoXG4gICAgICAgICAgc2VydmVyRm5OYW1lLFxuICAgICAgICAgIChzdGFydHVwUXVlcmllcy5nZXQoc2VydmVyRm5OYW1lKSB8fCAwKSArIGR1cmF0aW9uXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uID4gTUlOX1RSQUNFX0RVUkFUSU9OIHx8IF9ERUJVRykge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYFJlbmRlcmVyIFNRTCBjaGFubmVsIGpvYiAoJHtmbk5hbWV9KSBjb21wbGV0ZWQgaW4gJHtkdXJhdGlvbn1tc2BcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgam9iSWQgPSBfbWFrZUpvYihmbk5hbWUpO1xuXG4gICAgcmV0dXJuIGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAgICgpID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaXBjLnNlbmQoU1FMX0NIQU5ORUxfS0VZLCBqb2JJZCwgZm5OYW1lLCAuLi5hcmdzKTtcblxuICAgICAgICAgICAgX3VwZGF0ZUpvYihqb2JJZCwge1xuICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgIGFyZ3M6IF9ERUJVRyA/IGFyZ3MgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgX3JlbW92ZUpvYihqb2JJZCk7XG5cbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgIGBTUUwgY2hhbm5lbCBqb2IgJHtqb2JJZH0gKCR7Zm5OYW1lfSlgXG4gICAgKSgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzcGVjVG9CeXRlczxJbnB1dCwgT3V0cHV0PihcbiAgc3BlYzogT2JqZWN0TWFwcGluZ1NwZWNUeXBlLFxuICBkYXRhOiBJbnB1dFxuKTogT3V0cHV0IHtcbiAgcmV0dXJuIG1hcE9iamVjdFdpdGhTcGVjPHN0cmluZywgVWludDhBcnJheT4oc3BlYywgZGF0YSwgeCA9PlxuICAgIEJ5dGVzLmZyb21CYXNlNjQoeClcbiAgKTtcbn1cblxuZnVuY3Rpb24gc3BlY0Zyb21CeXRlczxJbnB1dCwgT3V0cHV0PihcbiAgc3BlYzogT2JqZWN0TWFwcGluZ1NwZWNUeXBlLFxuICBkYXRhOiBJbnB1dFxuKTogT3V0cHV0IHtcbiAgcmV0dXJuIG1hcE9iamVjdFdpdGhTcGVjPFVpbnQ4QXJyYXksIHN0cmluZz4oc3BlYywgZGF0YSwgeCA9PlxuICAgIEJ5dGVzLnRvQmFzZTY0KHgpXG4gICk7XG59XG5cbi8vIFRvcC1sZXZlbCBjYWxsc1xuXG5hc3luYyBmdW5jdGlvbiBzaHV0ZG93bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgbG9nLmluZm8oJ0NsaWVudC5zaHV0ZG93bicpO1xuXG4gIC8vIFN0b3AgYWNjZXB0aW5nIG5ldyBTUUwgam9icywgZmx1c2ggb3V0c3RhbmRpbmcgcXVldWVcbiAgYXdhaXQgX3NodXRkb3duKCk7XG5cbiAgLy8gQ2xvc2UgZGF0YWJhc2VcbiAgYXdhaXQgY2xvc2UoKTtcbn1cblxuLy8gTm90ZTogd2lsbCBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcCBhZnRlciBjYWxsaW5nIHRoaXMsIHRvIHNldCB1cCBhZnJlc2hcbmFzeW5jIGZ1bmN0aW9uIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5jbG9zZSgpO1xufVxuXG4vLyBOb3RlOiB3aWxsIG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwIGFmdGVyIGNhbGxpbmcgdGhpcywgdG8gc2V0IHVwIGFmcmVzaFxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlREIoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnJlbW92ZURCKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluZGV4ZWREQkZpbGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVJbmRleGVkREJGaWxlcygpO1xufVxuXG4vLyBJZGVudGl0eSBLZXlzXG5cbmNvbnN0IElERU5USVRZX0tFWV9TUEVDID0gWydwdWJsaWNLZXknXTtcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlSWRlbnRpdHlLZXkoZGF0YTogSWRlbnRpdHlLZXlUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHVwZGF0ZWQ6IFN0b3JlZElkZW50aXR5S2V5VHlwZSA9IHNwZWNGcm9tQnl0ZXMoSURFTlRJVFlfS0VZX1NQRUMsIGRhdGEpO1xuICBhd2FpdCBjaGFubmVscy5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHVwZGF0ZWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICBpZDogSWRlbnRpdHlLZXlJZFR5cGVcbik6IFByb21pc2U8SWRlbnRpdHlLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBjaGFubmVscy5nZXRJZGVudGl0eUtleUJ5SWQoaWQpO1xuXG4gIHJldHVybiBzcGVjVG9CeXRlcyhJREVOVElUWV9LRVlfU1BFQywgZGF0YSk7XG59XG5hc3luYyBmdW5jdGlvbiBidWxrQWRkSWRlbnRpdHlLZXlzKFxuICBhcnJheTogQXJyYXk8SWRlbnRpdHlLZXlUeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHVwZGF0ZWQ6IEFycmF5PFN0b3JlZElkZW50aXR5S2V5VHlwZT4gPSBtYXAoYXJyYXksIGRhdGEgPT5cbiAgICBzcGVjRnJvbUJ5dGVzKElERU5USVRZX0tFWV9TUEVDLCBkYXRhKVxuICApO1xuICBhd2FpdCBjaGFubmVscy5idWxrQWRkSWRlbnRpdHlLZXlzKHVwZGF0ZWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlSWRlbnRpdHlLZXlCeUlkKGlkOiBJZGVudGl0eUtleUlkVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVJZGVudGl0eUtleUJ5SWQoaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsSWRlbnRpdHlLZXlzKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGxJZGVudGl0eUtleXMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbElkZW50aXR5S2V5cygpOiBQcm9taXNlPEFycmF5PElkZW50aXR5S2V5VHlwZT4+IHtcbiAgY29uc3Qga2V5cyA9IGF3YWl0IGNoYW5uZWxzLmdldEFsbElkZW50aXR5S2V5cygpO1xuXG4gIHJldHVybiBrZXlzLm1hcChrZXkgPT4gc3BlY1RvQnl0ZXMoSURFTlRJVFlfS0VZX1NQRUMsIGtleSkpO1xufVxuXG4vLyBQcmUgS2V5c1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVByZUtleShkYXRhOiBQcmVLZXlUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHVwZGF0ZWQ6IFN0b3JlZFByZUtleVR5cGUgPSBzcGVjRnJvbUJ5dGVzKFBSRV9LRVlfU1BFQywgZGF0YSk7XG4gIGF3YWl0IGNoYW5uZWxzLmNyZWF0ZU9yVXBkYXRlUHJlS2V5KHVwZGF0ZWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJlS2V5QnlJZChcbiAgaWQ6IFByZUtleUlkVHlwZVxuKTogUHJvbWlzZTxQcmVLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBjaGFubmVscy5nZXRQcmVLZXlCeUlkKGlkKTtcblxuICByZXR1cm4gc3BlY1RvQnl0ZXMoUFJFX0tFWV9TUEVDLCBkYXRhKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGJ1bGtBZGRQcmVLZXlzKGFycmF5OiBBcnJheTxQcmVLZXlUeXBlPik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB1cGRhdGVkOiBBcnJheTxTdG9yZWRQcmVLZXlUeXBlPiA9IG1hcChhcnJheSwgZGF0YSA9PlxuICAgIHNwZWNGcm9tQnl0ZXMoUFJFX0tFWV9TUEVDLCBkYXRhKVxuICApO1xuICBhd2FpdCBjaGFubmVscy5idWxrQWRkUHJlS2V5cyh1cGRhdGVkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVByZUtleUJ5SWQoaWQ6IFByZUtleUlkVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVQcmVLZXlCeUlkKGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVByZUtleXNCeVV1aWQodXVpZDogVVVJRFN0cmluZ1R5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlUHJlS2V5c0J5VXVpZCh1dWlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbFByZUtleXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnJlbW92ZUFsbFByZUtleXMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFByZUtleXMoKTogUHJvbWlzZTxBcnJheTxQcmVLZXlUeXBlPj4ge1xuICBjb25zdCBrZXlzID0gYXdhaXQgY2hhbm5lbHMuZ2V0QWxsUHJlS2V5cygpO1xuXG4gIHJldHVybiBrZXlzLm1hcChrZXkgPT4gc3BlY1RvQnl0ZXMoUFJFX0tFWV9TUEVDLCBrZXkpKTtcbn1cblxuLy8gU2lnbmVkIFByZSBLZXlzXG5cbmNvbnN0IFBSRV9LRVlfU1BFQyA9IFsncHJpdmF0ZUtleScsICdwdWJsaWNLZXknXTtcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU2lnbmVkUHJlS2V5KFxuICBkYXRhOiBTaWduZWRQcmVLZXlUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgdXBkYXRlZDogU3RvcmVkU2lnbmVkUHJlS2V5VHlwZSA9IHNwZWNGcm9tQnl0ZXMoUFJFX0tFWV9TUEVDLCBkYXRhKTtcbiAgYXdhaXQgY2hhbm5lbHMuY3JlYXRlT3JVcGRhdGVTaWduZWRQcmVLZXkodXBkYXRlZCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRTaWduZWRQcmVLZXlCeUlkKFxuICBpZDogU2lnbmVkUHJlS2V5SWRUeXBlXG4pOiBQcm9taXNlPFNpZ25lZFByZUtleVR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGNoYW5uZWxzLmdldFNpZ25lZFByZUtleUJ5SWQoaWQpO1xuXG4gIHJldHVybiBzcGVjVG9CeXRlcyhQUkVfS0VZX1NQRUMsIGRhdGEpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsU2lnbmVkUHJlS2V5cygpOiBQcm9taXNlPEFycmF5PFNpZ25lZFByZUtleVR5cGU+PiB7XG4gIGNvbnN0IGtleXMgPSBhd2FpdCBjaGFubmVscy5nZXRBbGxTaWduZWRQcmVLZXlzKCk7XG5cbiAgcmV0dXJuIGtleXMubWFwKGtleSA9PiBzcGVjVG9CeXRlcyhQUkVfS0VZX1NQRUMsIGtleSkpO1xufVxuYXN5bmMgZnVuY3Rpb24gYnVsa0FkZFNpZ25lZFByZUtleXMoXG4gIGFycmF5OiBBcnJheTxTaWduZWRQcmVLZXlUeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHVwZGF0ZWQ6IEFycmF5PFN0b3JlZFNpZ25lZFByZUtleVR5cGU+ID0gbWFwKGFycmF5LCBkYXRhID0+XG4gICAgc3BlY0Zyb21CeXRlcyhQUkVfS0VZX1NQRUMsIGRhdGEpXG4gICk7XG4gIGF3YWl0IGNoYW5uZWxzLmJ1bGtBZGRTaWduZWRQcmVLZXlzKHVwZGF0ZWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2lnbmVkUHJlS2V5QnlJZChpZDogU2lnbmVkUHJlS2V5SWRUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnJlbW92ZVNpZ25lZFByZUtleUJ5SWQoaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2lnbmVkUHJlS2V5c0J5VXVpZCh1dWlkOiBVVUlEU3RyaW5nVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVTaWduZWRQcmVLZXlzQnlVdWlkKHV1aWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsU2lnbmVkUHJlS2V5cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlQWxsU2lnbmVkUHJlS2V5cygpO1xufVxuXG4vLyBJdGVtc1xuXG5jb25zdCBJVEVNX1NQRUNTOiBQYXJ0aWFsPFJlY29yZDxJdGVtS2V5VHlwZSwgT2JqZWN0TWFwcGluZ1NwZWNUeXBlPj4gPSB7XG4gIHNlbmRlckNlcnRpZmljYXRlOiBbJ3ZhbHVlLnNlcmlhbGl6ZWQnXSxcbiAgc2VuZGVyQ2VydGlmaWNhdGVOb0UxNjQ6IFsndmFsdWUuc2VyaWFsaXplZCddLFxuICBzdWJzY3JpYmVySWQ6IFsndmFsdWUnXSxcbiAgcHJvZmlsZUtleTogWyd2YWx1ZSddLFxuICBpZGVudGl0eUtleU1hcDoge1xuICAgIGtleTogJ3ZhbHVlJyxcbiAgICB2YWx1ZVNwZWM6IHtcbiAgICAgIGlzTWFwOiB0cnVlLFxuICAgICAgdmFsdWVTcGVjOiBbJ3ByaXZLZXknLCAncHViS2V5J10sXG4gICAgfSxcbiAgfSxcbn07XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZUl0ZW08SyBleHRlbmRzIEl0ZW1LZXlUeXBlPihcbiAgZGF0YTogSXRlbVR5cGU8Sz5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGlkIH0gPSBkYXRhO1xuICBpZiAoIWlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2NyZWF0ZU9yVXBkYXRlSXRlbTogUHJvdmlkZWQgZGF0YSBkaWQgbm90IGhhdmUgYSB0cnV0aHkgaWQnXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHNwZWMgPSBJVEVNX1NQRUNTW2lkXTtcbiAgY29uc3QgdXBkYXRlZDogU3RvcmVkSXRlbVR5cGU8Sz4gPSBzcGVjXG4gICAgPyBzcGVjRnJvbUJ5dGVzKHNwZWMsIGRhdGEpXG4gICAgOiAoZGF0YSBhcyB1bmtub3duIGFzIFN0b3JlZEl0ZW1UeXBlPEs+KTtcblxuICBhd2FpdCBjaGFubmVscy5jcmVhdGVPclVwZGF0ZUl0ZW0odXBkYXRlZCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRJdGVtQnlJZDxLIGV4dGVuZHMgSXRlbUtleVR5cGU+KFxuICBpZDogS1xuKTogUHJvbWlzZTxJdGVtVHlwZTxLPiB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCBzcGVjID0gSVRFTV9TUEVDU1tpZF07XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBjaGFubmVscy5nZXRJdGVtQnlJZChpZCk7XG5cbiAgcmV0dXJuIHNwZWMgPyBzcGVjVG9CeXRlcyhzcGVjLCBkYXRhKSA6IChkYXRhIGFzIHVua25vd24gYXMgSXRlbVR5cGU8Sz4pO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsSXRlbXMoKTogUHJvbWlzZTxBbGxJdGVtc1R5cGU+IHtcbiAgY29uc3QgaXRlbXMgPSBhd2FpdCBjaGFubmVscy5nZXRBbGxJdGVtcygpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgZm9yIChjb25zdCBpZCBvZiBPYmplY3Qua2V5cyhpdGVtcykpIHtcbiAgICBjb25zdCBrZXkgPSBpZCBhcyBJdGVtS2V5VHlwZTtcbiAgICBjb25zdCB2YWx1ZSA9IGl0ZW1zW2tleV07XG5cbiAgICBjb25zdCBrZXlzID0gSVRFTV9TUEVDU1trZXldO1xuXG4gICAgY29uc3QgZGVzZXJpYWxpemVkVmFsdWUgPSBrZXlzXG4gICAgICA/IChzcGVjVG9CeXRlcyhrZXlzLCB7IHZhbHVlIH0pIGFzIEl0ZW1UeXBlPHR5cGVvZiBrZXk+KS52YWx1ZVxuICAgICAgOiB2YWx1ZTtcblxuICAgIHJlc3VsdFtrZXldID0gZGVzZXJpYWxpemVkVmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlSXRlbUJ5SWQoaWQ6IEl0ZW1LZXlUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnJlbW92ZUl0ZW1CeUlkKGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbEl0ZW1zKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGxJdGVtcygpO1xufVxuXG4vLyBTZW5kZXIgS2V5c1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVNlbmRlcktleShrZXk6IFNlbmRlcktleVR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMuY3JlYXRlT3JVcGRhdGVTZW5kZXJLZXkoa2V5KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFNlbmRlcktleUJ5SWQoXG4gIGlkOiBTZW5kZXJLZXlJZFR5cGVcbik6IFByb21pc2U8U2VuZGVyS2V5VHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0U2VuZGVyS2V5QnlJZChpZCk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxTZW5kZXJLZXlzKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGxTZW5kZXJLZXlzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTZW5kZXJLZXlzKCk6IFByb21pc2U8QXJyYXk8U2VuZGVyS2V5VHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldEFsbFNlbmRlcktleXMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVNlbmRlcktleUJ5SWQoaWQ6IFNlbmRlcktleUlkVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY2hhbm5lbHMucmVtb3ZlU2VuZGVyS2V5QnlJZChpZCk7XG59XG5cbi8vIFNlbnQgUHJvdG9zXG5cbmFzeW5jIGZ1bmN0aW9uIGluc2VydFNlbnRQcm90byhcbiAgcHJvdG86IFNlbnRQcm90b1R5cGUsXG4gIG9wdGlvbnM6IHtcbiAgICBtZXNzYWdlSWRzOiBTZW50TWVzc2FnZXNUeXBlO1xuICAgIHJlY2lwaWVudHM6IFNlbnRSZWNpcGllbnRzVHlwZTtcbiAgfVxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmluc2VydFNlbnRQcm90byhwcm90bywge1xuICAgIC4uLm9wdGlvbnMsXG4gICAgbWVzc2FnZUlkczogdW5pcShvcHRpb25zLm1lc3NhZ2VJZHMpLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNlbnRQcm90b3NPbGRlclRoYW4odGltZXN0YW1wOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMuZGVsZXRlU2VudFByb3Rvc09sZGVyVGhhbih0aW1lc3RhbXApO1xufVxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU2VudFByb3RvQnlNZXNzYWdlSWQobWVzc2FnZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMuZGVsZXRlU2VudFByb3RvQnlNZXNzYWdlSWQobWVzc2FnZUlkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0UHJvdG9SZWNpcGllbnRzKG9wdGlvbnM6IHtcbiAgaWQ6IG51bWJlcjtcbiAgcmVjaXBpZW50VXVpZDogc3RyaW5nO1xuICBkZXZpY2VJZHM6IEFycmF5PG51bWJlcj47XG59KTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmluc2VydFByb3RvUmVjaXBpZW50cyhvcHRpb25zKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNlbnRQcm90b1JlY2lwaWVudChcbiAgb3B0aW9uczpcbiAgICB8IERlbGV0ZVNlbnRQcm90b1JlY2lwaWVudE9wdGlvbnNUeXBlXG4gICAgfCBSZWFkb25seUFycmF5PERlbGV0ZVNlbnRQcm90b1JlY2lwaWVudE9wdGlvbnNUeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmRlbGV0ZVNlbnRQcm90b1JlY2lwaWVudChvcHRpb25zKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VudFByb3RvQnlSZWNpcGllbnQob3B0aW9uczoge1xuICBub3c6IG51bWJlcjtcbiAgcmVjaXBpZW50VXVpZDogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn0pOiBQcm9taXNlPFNlbnRQcm90b1dpdGhNZXNzYWdlSWRzVHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0U2VudFByb3RvQnlSZWNpcGllbnQob3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxTZW50UHJvdG9zKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGxTZW50UHJvdG9zKCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTZW50UHJvdG9zKCk6IFByb21pc2U8QXJyYXk8U2VudFByb3RvVHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldEFsbFNlbnRQcm90b3MoKTtcbn1cblxuLy8gVGVzdC1vbmx5OlxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKTogUHJvbWlzZTxcbiAgQXJyYXk8U2VudFJlY2lwaWVudHNEQlR5cGU+XG4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLl9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpOiBQcm9taXNlPEFycmF5PFNlbnRNZXNzYWdlREJUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMoKTtcbn1cblxuLy8gU2Vzc2lvbnNcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JVcGRhdGVTZXNzaW9uKGRhdGE6IFNlc3Npb25UeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmNyZWF0ZU9yVXBkYXRlU2Vzc2lvbihkYXRhKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvbnMoXG4gIGFycmF5OiBBcnJheTxTZXNzaW9uVHlwZT5cbik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5jcmVhdGVPclVwZGF0ZVNlc3Npb25zKGFycmF5KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNvbW1pdERlY3J5cHRSZXN1bHQob3B0aW9uczoge1xuICBzZW5kZXJLZXlzOiBBcnJheTxTZW5kZXJLZXlUeXBlPjtcbiAgc2Vzc2lvbnM6IEFycmF5PFNlc3Npb25UeXBlPjtcbiAgdW5wcm9jZXNzZWQ6IEFycmF5PFVucHJvY2Vzc2VkVHlwZT47XG59KTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmNvbW1pdERlY3J5cHRSZXN1bHQob3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiBidWxrQWRkU2Vzc2lvbnMoYXJyYXk6IEFycmF5PFNlc3Npb25UeXBlPik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5idWxrQWRkU2Vzc2lvbnMoYXJyYXkpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2Vzc2lvbkJ5SWQoaWQ6IFNlc3Npb25JZFR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlU2Vzc2lvbkJ5SWQoaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVTZXNzaW9uc0J5Q29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlU2Vzc2lvbnNCeUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxTZXNzaW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlQWxsU2Vzc2lvbnMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFNlc3Npb25zKCk6IFByb21pc2U8QXJyYXk8U2Vzc2lvblR5cGU+PiB7XG4gIGNvbnN0IHNlc3Npb25zID0gYXdhaXQgY2hhbm5lbHMuZ2V0QWxsU2Vzc2lvbnMoKTtcblxuICByZXR1cm4gc2Vzc2lvbnM7XG59XG5cbi8vIENvbnZlcnNhdGlvblxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb252ZXJzYXRpb25Db3VudCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0Q29udmVyc2F0aW9uQ291bnQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZUNvbnZlcnNhdGlvbihkYXRhOiBDb252ZXJzYXRpb25UeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnNhdmVDb252ZXJzYXRpb24oZGF0YSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVDb252ZXJzYXRpb25zKFxuICBhcnJheTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT5cbik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5zYXZlQ29udmVyc2F0aW9ucyhhcnJheSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENvbnZlcnNhdGlvbkJ5SWQoXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8Q29udmVyc2F0aW9uVHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0Q29udmVyc2F0aW9uQnlJZChpZCk7XG59XG5cbmNvbnN0IHVwZGF0ZUNvbnZlcnNhdGlvbkJhdGNoZXIgPSBjcmVhdGVCYXRjaGVyPENvbnZlcnNhdGlvblR5cGU+KHtcbiAgbmFtZTogJ3NxbC5DbGllbnQudXBkYXRlQ29udmVyc2F0aW9uQmF0Y2hlcicsXG4gIHdhaXQ6IDUwMCxcbiAgbWF4U2l6ZTogMjAsXG4gIHByb2Nlc3NCYXRjaDogYXN5bmMgKGl0ZW1zOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPikgPT4ge1xuICAgIC8vIFdlIG9ubHkgY2FyZSBhYm91dCB0aGUgbW9zdCByZWNlbnQgdXBkYXRlIGZvciBlYWNoIGNvbnZlcnNhdGlvblxuICAgIGNvbnN0IGJ5SWQgPSBncm91cEJ5KGl0ZW1zLCBpdGVtID0+IGl0ZW0uaWQpO1xuICAgIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKGJ5SWQpO1xuICAgIGNvbnN0IG1vc3RSZWNlbnQgPSBpZHMubWFwKChpZDogc3RyaW5nKTogQ29udmVyc2F0aW9uVHlwZSA9PiB7XG4gICAgICBjb25zdCBtYXliZUxhc3QgPSBsYXN0KGJ5SWRbaWRdKTtcbiAgICAgIGFzc2VydChtYXliZUxhc3QgIT09IHVuZGVmaW5lZCwgJ0VtcHR5IGFycmF5IGluIGBncm91cEJ5YCByZXN1bHQnKTtcbiAgICAgIHJldHVybiBtYXliZUxhc3Q7XG4gICAgfSk7XG5cbiAgICBhd2FpdCB1cGRhdGVDb252ZXJzYXRpb25zKG1vc3RSZWNlbnQpO1xuICB9LFxufSk7XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbnZlcnNhdGlvbihkYXRhOiBDb252ZXJzYXRpb25UeXBlKTogdm9pZCB7XG4gIHVwZGF0ZUNvbnZlcnNhdGlvbkJhdGNoZXIuYWRkKGRhdGEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVDb252ZXJzYXRpb25zKFxuICBhcnJheTogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGNsZWFuZWQsIHBhdGhzQ2hhbmdlZCB9ID0gY2xlYW5EYXRhRm9ySXBjKGFycmF5KTtcbiAgYXNzZXJ0KFxuICAgICFwYXRoc0NoYW5nZWQubGVuZ3RoLFxuICAgIGBQYXRocyB3ZXJlIGNsZWFuZWQ6ICR7SlNPTi5zdHJpbmdpZnkocGF0aHNDaGFuZ2VkKX1gXG4gICk7XG4gIGF3YWl0IGNoYW5uZWxzLnVwZGF0ZUNvbnZlcnNhdGlvbnMoY2xlYW5lZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNvbnZlcnNhdGlvbihpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgZ2V0Q29udmVyc2F0aW9uQnlJZChpZCk7XG5cbiAgLy8gTm90ZTogSXQncyBpbXBvcnRhbnQgdG8gaGF2ZSBhIGZ1bGx5IGRhdGFiYXNlLWh5ZHJhdGVkIG1vZGVsIHRvIGRlbGV0ZSBoZXJlIGJlY2F1c2VcbiAgLy8gICBpdCBuZWVkcyB0byBkZWxldGUgYWxsIGFzc29jaWF0ZWQgb24tZGlzayBmaWxlcyBhbG9uZyB3aXRoIHRoZSBkYXRhYmFzZSBkZWxldGUuXG4gIGlmIChleGlzdGluZykge1xuICAgIGF3YWl0IGNoYW5uZWxzLnJlbW92ZUNvbnZlcnNhdGlvbihpZCk7XG4gICAgYXdhaXQgZGVsZXRlRXh0ZXJuYWxGaWxlcyhleGlzdGluZywge1xuICAgICAgZGVsZXRlQXR0YWNobWVudERhdGE6IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5kZWxldGVBdHRhY2htZW50RGF0YSxcbiAgICB9KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlQWxsQ29udmVyc2F0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMuX3JlbW92ZUFsbENvbnZlcnNhdGlvbnMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXJhc2VTdG9yYWdlU2VydmljZVN0YXRlRnJvbUNvbnZlcnNhdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmVyYXNlU3RvcmFnZVNlcnZpY2VTdGF0ZUZyb21Db252ZXJzYXRpb25zKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbENvbnZlcnNhdGlvbnMoKTogUHJvbWlzZTxBcnJheTxDb252ZXJzYXRpb25UeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0QWxsQ29udmVyc2F0aW9ucygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxDb252ZXJzYXRpb25JZHMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGlkcyA9IGF3YWl0IGNoYW5uZWxzLmdldEFsbENvbnZlcnNhdGlvbklkcygpO1xuXG4gIHJldHVybiBpZHM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbEdyb3Vwc0ludm9sdmluZ1V1aWQoXG4gIHV1aWQ6IFVVSURTdHJpbmdUeXBlXG4pOiBQcm9taXNlPEFycmF5PENvbnZlcnNhdGlvblR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKHV1aWQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZWFyY2hNZXNzYWdlSlNPTihcbiAgbWVzc2FnZXM6IEFycmF5PFNlcnZlclNlYXJjaFJlc3VsdE1lc3NhZ2VUeXBlPlxuKTogQXJyYXk8Q2xpZW50U2VhcmNoUmVzdWx0TWVzc2FnZVR5cGU+IHtcbiAgcmV0dXJuIG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+ICh7XG4gICAganNvbjogbWVzc2FnZS5qc29uLFxuXG4gICAgLy8gRW1wdHkgYXJyYXkgaXMgYSBkZWZhdWx0IHZhbHVlLiBgbWVzc2FnZS5qc29uYCBoYXMgdGhlIHJlYWwgZmllbGRcbiAgICBib2R5UmFuZ2VzOiBbXSxcblxuICAgIC4uLkpTT04ucGFyc2UobWVzc2FnZS5qc29uKSxcbiAgICBzbmlwcGV0OiBtZXNzYWdlLnNuaXBwZXQsXG4gIH0pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoTWVzc2FnZXMoXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHsgbGltaXQgfTogeyBsaW1pdD86IG51bWJlciB9ID0ge31cbik6IFByb21pc2U8QXJyYXk8Q2xpZW50U2VhcmNoUmVzdWx0TWVzc2FnZVR5cGU+PiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2hhbm5lbHMuc2VhcmNoTWVzc2FnZXMocXVlcnksIHsgbGltaXQgfSk7XG5cbiAgcmV0dXJuIGhhbmRsZVNlYXJjaE1lc3NhZ2VKU09OKG1lc3NhZ2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoTWVzc2FnZXNJbkNvbnZlcnNhdGlvbihcbiAgcXVlcnk6IHN0cmluZyxcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgeyBsaW1pdCB9OiB7IGxpbWl0PzogbnVtYmVyIH0gPSB7fVxuKTogUHJvbWlzZTxBcnJheTxDbGllbnRTZWFyY2hSZXN1bHRNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjaGFubmVscy5zZWFyY2hNZXNzYWdlc0luQ29udmVyc2F0aW9uKFxuICAgIHF1ZXJ5LFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIHsgbGltaXQgfVxuICApO1xuXG4gIHJldHVybiBoYW5kbGVTZWFyY2hNZXNzYWdlSlNPTihtZXNzYWdlcyk7XG59XG5cbi8vIE1lc3NhZ2VcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUNvdW50KGNvbnZlcnNhdGlvbklkPzogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE1lc3NhZ2VDb3VudChjb252ZXJzYXRpb25JZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFN0b3J5Q291bnQoY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRTdG9yeUNvdW50KGNvbnZlcnNhdGlvbklkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZU1lc3NhZ2UoXG4gIGRhdGE6IE1lc3NhZ2VUeXBlLFxuICBvcHRpb25zOiB7XG4gICAgam9iVG9JbnNlcnQ/OiBSZWFkb25seTxTdG9yZWRKb2I+O1xuICAgIGZvcmNlU2F2ZT86IGJvb2xlYW47XG4gICAgb3VyVXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gIH1cbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IGlkID0gYXdhaXQgY2hhbm5lbHMuc2F2ZU1lc3NhZ2UoX2NsZWFuTWVzc2FnZURhdGEoZGF0YSksIHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGpvYlRvSW5zZXJ0OiBvcHRpb25zLmpvYlRvSW5zZXJ0ICYmIGZvcm1hdEpvYkZvckluc2VydChvcHRpb25zLmpvYlRvSW5zZXJ0KSxcbiAgfSk7XG5cbiAgZXhwaXJpbmdNZXNzYWdlc0RlbGV0aW9uU2VydmljZS51cGRhdGUoKTtcbiAgdGFwVG9WaWV3TWVzc2FnZXNEZWxldGlvblNlcnZpY2UudXBkYXRlKCk7XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlTWVzc2FnZXMoXG4gIGFycmF5T2ZNZXNzYWdlczogUmVhZG9ubHlBcnJheTxNZXNzYWdlVHlwZT4sXG4gIG9wdGlvbnM6IHsgZm9yY2VTYXZlPzogYm9vbGVhbjsgb3VyVXVpZDogVVVJRFN0cmluZ1R5cGUgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnNhdmVNZXNzYWdlcyhcbiAgICBhcnJheU9mTWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4gX2NsZWFuTWVzc2FnZURhdGEobWVzc2FnZSkpLFxuICAgIG9wdGlvbnNcbiAgKTtcblxuICBleHBpcmluZ01lc3NhZ2VzRGVsZXRpb25TZXJ2aWNlLnVwZGF0ZSgpO1xuICB0YXBUb1ZpZXdNZXNzYWdlc0RlbGV0aW9uU2VydmljZS51cGRhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlTWVzc2FnZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBnZXRNZXNzYWdlQnlJZChpZCk7XG5cbiAgLy8gTm90ZTogSXQncyBpbXBvcnRhbnQgdG8gaGF2ZSBhIGZ1bGx5IGRhdGFiYXNlLWh5ZHJhdGVkIG1vZGVsIHRvIGRlbGV0ZSBoZXJlIGJlY2F1c2VcbiAgLy8gICBpdCBuZWVkcyB0byBkZWxldGUgYWxsIGFzc29jaWF0ZWQgb24tZGlzayBmaWxlcyBhbG9uZyB3aXRoIHRoZSBkYXRhYmFzZSBkZWxldGUuXG4gIGlmIChtZXNzYWdlKSB7XG4gICAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlTWVzc2FnZShpZCk7XG4gICAgYXdhaXQgY2xlYW51cE1lc3NhZ2UobWVzc2FnZSk7XG4gIH1cbn1cblxuLy8gTm90ZTogdGhpcyBtZXRob2Qgd2lsbCBub3QgY2xlYW4gdXAgZXh0ZXJuYWwgZmlsZXMsIGp1c3QgZGVsZXRlIGZyb20gU1FMXG5hc3luYyBmdW5jdGlvbiByZW1vdmVNZXNzYWdlcyhpZHM6IEFycmF5PHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlTWVzc2FnZXMoaWRzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUJ5SWQoaWQ6IHN0cmluZyk6IFByb21pc2U8TWVzc2FnZVR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE1lc3NhZ2VCeUlkKGlkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNCeUlkKFxuICBtZXNzYWdlSWRzOiBBcnJheTxzdHJpbmc+XG4pOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICBpZiAoIW1lc3NhZ2VJZHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiBjaGFubmVscy5nZXRNZXNzYWdlc0J5SWQobWVzc2FnZUlkcyk7XG59XG5cbi8vIEZvciB0ZXN0aW5nIG9ubHlcbmFzeW5jIGZ1bmN0aW9uIF9nZXRBbGxNZXNzYWdlcygpOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuX2dldEFsbE1lc3NhZ2VzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlQWxsTWVzc2FnZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLl9yZW1vdmVBbGxNZXNzYWdlcygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxNZXNzYWdlSWRzKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICBjb25zdCBpZHMgPSBhd2FpdCBjaGFubmVscy5nZXRBbGxNZXNzYWdlSWRzKCk7XG5cbiAgcmV0dXJuIGlkcztcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUJ5U2VuZGVyKHtcbiAgc291cmNlLFxuICBzb3VyY2VVdWlkLFxuICBzb3VyY2VEZXZpY2UsXG4gIHNlbnRfYXQsXG59OiB7XG4gIHNvdXJjZTogc3RyaW5nO1xuICBzb3VyY2VVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgc291cmNlRGV2aWNlOiBudW1iZXI7XG4gIHNlbnRfYXQ6IG51bWJlcjtcbn0pOiBQcm9taXNlPE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRNZXNzYWdlQnlTZW5kZXIoe1xuICAgIHNvdXJjZSxcbiAgICBzb3VyY2VVdWlkLFxuICAgIHNvdXJjZURldmljZSxcbiAgICBzZW50X2F0LFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VG90YWxVbnJlYWRGb3JDb252ZXJzYXRpb24oXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHtcbiAgICBzdG9yeUlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgICBpc0dyb3VwOiBib29sZWFuO1xuICB9XG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0VG90YWxVbnJlYWRGb3JDb252ZXJzYXRpb24oY29udmVyc2F0aW9uSWQsIG9wdGlvbnMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRVbnJlYWRCeUNvbnZlcnNhdGlvbkFuZE1hcmtSZWFkKG9wdGlvbnM6IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNHcm91cD86IGJvb2xlYW47XG4gIG5ld2VzdFVucmVhZEF0OiBudW1iZXI7XG4gIHJlYWRBdD86IG51bWJlcjtcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlO1xufSk6IFByb21pc2U8R2V0VW5yZWFkQnlDb252ZXJzYXRpb25BbmRNYXJrUmVhZFJlc3VsdFR5cGU+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFVucmVhZEJ5Q29udmVyc2F0aW9uQW5kTWFya1JlYWQob3B0aW9ucyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFVucmVhZFJlYWN0aW9uc0FuZE1hcmtSZWFkKG9wdGlvbnM6IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgbmV3ZXN0VW5yZWFkQXQ6IG51bWJlcjtcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlO1xufSk6IFByb21pc2U8QXJyYXk8UmVhY3Rpb25SZXN1bHRUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0VW5yZWFkUmVhY3Rpb25zQW5kTWFya1JlYWQob3B0aW9ucyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1hcmtSZWFjdGlvbkFzUmVhZChcbiAgdGFyZ2V0QXV0aG9yVXVpZDogc3RyaW5nLFxuICB0YXJnZXRUaW1lc3RhbXA6IG51bWJlclxuKTogUHJvbWlzZTxSZWFjdGlvblR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLm1hcmtSZWFjdGlvbkFzUmVhZCh0YXJnZXRBdXRob3JVdWlkLCB0YXJnZXRUaW1lc3RhbXApO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVSZWFjdGlvbkZyb21Db252ZXJzYXRpb24ocmVhY3Rpb246IHtcbiAgZW1vamk6IHN0cmluZztcbiAgZnJvbUlkOiBzdHJpbmc7XG4gIHRhcmdldEF1dGhvclV1aWQ6IHN0cmluZztcbiAgdGFyZ2V0VGltZXN0YW1wOiBudW1iZXI7XG59KTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5yZW1vdmVSZWFjdGlvbkZyb21Db252ZXJzYXRpb24ocmVhY3Rpb24pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBhZGRSZWFjdGlvbihyZWFjdGlvbk9iajogUmVhY3Rpb25UeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5hZGRSZWFjdGlvbihyZWFjdGlvbk9iaik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9nZXRBbGxSZWFjdGlvbnMoKTogUHJvbWlzZTxBcnJheTxSZWFjdGlvblR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5fZ2V0QWxsUmVhY3Rpb25zKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlQWxsUmVhY3Rpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5fcmVtb3ZlQWxsUmVhY3Rpb25zKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2VKU09OKFxuICBtZXNzYWdlczogQXJyYXk8TWVzc2FnZVR5cGVVbmh5ZHJhdGVkPlxuKTogQXJyYXk8TWVzc2FnZVR5cGU+IHtcbiAgcmV0dXJuIG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+IEpTT04ucGFyc2UobWVzc2FnZS5qc29uKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE9sZGVyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAge1xuICAgIGlzR3JvdXAsXG4gICAgbGltaXQgPSAxMDAsXG4gICAgbWVzc2FnZUlkLFxuICAgIHJlY2VpdmVkQXQgPSBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgIHNlbnRBdCA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgc3RvcnlJZCxcbiAgfToge1xuICAgIGlzR3JvdXA6IGJvb2xlYW47XG4gICAgbGltaXQ/OiBudW1iZXI7XG4gICAgbWVzc2FnZUlkPzogc3RyaW5nO1xuICAgIHJlY2VpdmVkQXQ/OiBudW1iZXI7XG4gICAgc2VudEF0PzogbnVtYmVyO1xuICAgIHN0b3J5SWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgfVxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjaGFubmVscy5nZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oXG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAge1xuICAgICAgaXNHcm91cCxcbiAgICAgIGxpbWl0LFxuICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgIHNlbnRBdCxcbiAgICAgIG1lc3NhZ2VJZCxcbiAgICAgIHN0b3J5SWQsXG4gICAgfVxuICApO1xuXG4gIHJldHVybiBoYW5kbGVNZXNzYWdlSlNPTihtZXNzYWdlcyk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRPbGRlclN0b3JpZXMob3B0aW9uczoge1xuICBjb252ZXJzYXRpb25JZD86IHN0cmluZztcbiAgbGltaXQ/OiBudW1iZXI7XG4gIHJlY2VpdmVkQXQ/OiBudW1iZXI7XG4gIHNlbnRBdD86IG51bWJlcjtcbiAgc291cmNlVXVpZD86IFVVSURTdHJpbmdUeXBlO1xufSk6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRPbGRlclN0b3JpZXMob3B0aW9ucyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE5ld2VyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAge1xuICAgIGlzR3JvdXAsXG4gICAgbGltaXQgPSAxMDAsXG4gICAgcmVjZWl2ZWRBdCA9IDAsXG4gICAgc2VudEF0ID0gMCxcbiAgICBzdG9yeUlkLFxuICB9OiB7XG4gICAgaXNHcm91cDogYm9vbGVhbjtcbiAgICBsaW1pdD86IG51bWJlcjtcbiAgICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICAgIHNlbnRBdD86IG51bWJlcjtcbiAgICBzdG9yeUlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgfVxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjaGFubmVscy5nZXROZXdlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oXG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAge1xuICAgICAgaXNHcm91cCxcbiAgICAgIGxpbWl0LFxuICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgIHNlbnRBdCxcbiAgICAgIHN0b3J5SWQsXG4gICAgfVxuICApO1xuXG4gIHJldHVybiBoYW5kbGVNZXNzYWdlSlNPTihtZXNzYWdlcyk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRDb252ZXJzYXRpb25NZXNzYWdlU3RhdHMoe1xuICBjb252ZXJzYXRpb25JZCxcbiAgaXNHcm91cCxcbiAgb3VyVXVpZCxcbn06IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNHcm91cD86IGJvb2xlYW47XG4gIG91clV1aWQ6IFVVSURTdHJpbmdUeXBlO1xufSk6IFByb21pc2U8Q29udmVyc2F0aW9uTWVzc2FnZVN0YXRzVHlwZT4ge1xuICBjb25zdCB7IHByZXZpZXcsIGFjdGl2aXR5LCBoYXNVc2VySW5pdGlhdGVkTWVzc2FnZXMgfSA9XG4gICAgYXdhaXQgY2hhbm5lbHMuZ2V0Q29udmVyc2F0aW9uTWVzc2FnZVN0YXRzKHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgaXNHcm91cCxcbiAgICAgIG91clV1aWQsXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwcmV2aWV3LFxuICAgIGFjdGl2aXR5LFxuICAgIGhhc1VzZXJJbml0aWF0ZWRNZXNzYWdlcyxcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldExhc3RDb252ZXJzYXRpb25NZXNzYWdlKHtcbiAgY29udmVyc2F0aW9uSWQsXG59OiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG59KTogUHJvbWlzZTxNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0TGFzdENvbnZlcnNhdGlvbk1lc3NhZ2UoeyBjb252ZXJzYXRpb25JZCB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldE1lc3NhZ2VNZXRyaWNzRm9yQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBzdG9yeUlkPzogVVVJRFN0cmluZ1R5cGUsXG4gIGlzR3JvdXA/OiBib29sZWFuXG4pOiBQcm9taXNlPENvbnZlcnNhdGlvbk1ldHJpY3NUeXBlPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNoYW5uZWxzLmdldE1lc3NhZ2VNZXRyaWNzRm9yQ29udmVyc2F0aW9uKFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIHN0b3J5SWQsXG4gICAgaXNHcm91cFxuICApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRDb252ZXJzYXRpb25SYW5nZUNlbnRlcmVkT25NZXNzYWdlKG9wdGlvbnM6IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNHcm91cDogYm9vbGVhbjtcbiAgbGltaXQ/OiBudW1iZXI7XG4gIG1lc3NhZ2VJZDogc3RyaW5nO1xuICByZWNlaXZlZEF0OiBudW1iZXI7XG4gIHNlbnRBdD86IG51bWJlcjtcbiAgc3RvcnlJZDogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQ7XG59KTogUHJvbWlzZTxHZXRDb252ZXJzYXRpb25SYW5nZUNlbnRlcmVkT25NZXNzYWdlUmVzdWx0VHlwZTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2hhbm5lbHMuZ2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZShvcHRpb25zKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnJlc3VsdCxcbiAgICBvbGRlcjogaGFuZGxlTWVzc2FnZUpTT04ocmVzdWx0Lm9sZGVyKSxcbiAgICBuZXdlcjogaGFuZGxlTWVzc2FnZUpTT04ocmVzdWx0Lm5ld2VyKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFzR3JvdXBDYWxsSGlzdG9yeU1lc3NhZ2UoXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIGVyYUlkOiBzdHJpbmdcbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gY2hhbm5lbHMuaGFzR3JvdXBDYWxsSGlzdG9yeU1lc3NhZ2UoY29udmVyc2F0aW9uSWQsIGVyYUlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyhcbiAgb2Jzb2xldGVJZDogc3RyaW5nLFxuICBjdXJyZW50SWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLm1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyhvYnNvbGV0ZUlkLCBjdXJyZW50SWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxNZXNzYWdlc0luQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB7XG4gICAgbG9nSWQsXG4gIH06IHtcbiAgICBsb2dJZDogc3RyaW5nO1xuICB9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgbGV0IG1lc3NhZ2VzO1xuICBkbyB7XG4gICAgY29uc3QgY2h1bmtTaXplID0gMjA7XG4gICAgbG9nLmluZm8oXG4gICAgICBgcmVtb3ZlQWxsTWVzc2FnZXNJbkNvbnZlcnNhdGlvbi8ke2xvZ0lkfTogRmV0Y2hpbmcgY2h1bmsgb2YgJHtjaHVua1NpemV9IG1lc3NhZ2VzYFxuICAgICk7XG4gICAgLy8gWWVzLCB3ZSByZWFsbHkgd2FudCB0aGUgYXdhaXQgaW4gdGhlIGxvb3AuIFdlJ3JlIGRlbGV0aW5nIGEgY2h1bmsgYXQgYVxuICAgIC8vICAgdGltZSBzbyB3ZSBkb24ndCB1c2UgdG9vIG11Y2ggbWVtb3J5LlxuICAgIG1lc3NhZ2VzID0gYXdhaXQgZ2V0T2xkZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkLCB7XG4gICAgICBsaW1pdDogY2h1bmtTaXplLFxuICAgICAgaXNHcm91cDogdHJ1ZSxcbiAgICAgIHN0b3J5SWQ6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0gbWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4gbWVzc2FnZS5pZCk7XG5cbiAgICBsb2cuaW5mbyhgcmVtb3ZlQWxsTWVzc2FnZXNJbkNvbnZlcnNhdGlvbi8ke2xvZ0lkfTogQ2xlYW51cC4uLmApO1xuICAgIC8vIE5vdGU6IEl0J3MgdmVyeSBpbXBvcnRhbnQgdGhhdCB0aGVzZSBtb2RlbHMgYXJlIGZ1bGx5IGh5ZHJhdGVkIGJlY2F1c2VcbiAgICAvLyAgIHdlIG5lZWQgdG8gZGVsZXRlIGFsbCBhc3NvY2lhdGVkIG9uLWRpc2sgZmlsZXMgYWxvbmcgd2l0aCB0aGUgZGF0YWJhc2UgZGVsZXRlLlxuICAgIGNvbnN0IHF1ZXVlID0gbmV3IHdpbmRvdy5QUXVldWUoeyBjb25jdXJyZW5jeTogMywgdGltZW91dDogTUlOVVRFICogMzAgfSk7XG4gICAgcXVldWUuYWRkQWxsKFxuICAgICAgbWVzc2FnZXMubWFwKFxuICAgICAgICAobWVzc2FnZTogTWVzc2FnZVR5cGUpID0+IGFzeW5jICgpID0+IGNsZWFudXBNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICApXG4gICAgKTtcbiAgICBhd2FpdCBxdWV1ZS5vbklkbGUoKTtcblxuICAgIGxvZy5pbmZvKGByZW1vdmVBbGxNZXNzYWdlc0luQ29udmVyc2F0aW9uLyR7bG9nSWR9OiBEZWxldGluZy4uLmApO1xuICAgIGF3YWl0IGNoYW5uZWxzLnJlbW92ZU1lc3NhZ2VzKGlkcyk7XG4gIH0gd2hpbGUgKG1lc3NhZ2VzLmxlbmd0aCA+IDApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRNZXNzYWdlc0J5U2VudEF0KFxuICBzZW50QXQ6IG51bWJlclxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE1lc3NhZ2VzQnlTZW50QXQoc2VudEF0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0RXhwaXJlZE1lc3NhZ2VzKCk6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRFeHBpcmVkTWVzc2FnZXMoKTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZXNVbmV4cGVjdGVkbHlNaXNzaW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wKCk6IFByb21pc2U8XG4gIEFycmF5PE1lc3NhZ2VUeXBlPlxuPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRNZXNzYWdlc1VuZXhwZWN0ZWRseU1pc3NpbmdFeHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAoKTtcbn1cblxuZnVuY3Rpb24gZ2V0U29vbmVzdE1lc3NhZ2VFeHBpcnkoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFNvb25lc3RNZXNzYWdlRXhwaXJ5KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE5leHRUYXBUb1ZpZXdNZXNzYWdlVGltZXN0YW1wVG9BZ2VPdXQoKTogUHJvbWlzZTxcbiAgbnVtYmVyIHwgdW5kZWZpbmVkXG4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE5leHRUYXBUb1ZpZXdNZXNzYWdlVGltZXN0YW1wVG9BZ2VPdXQoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFRhcFRvVmlld01lc3NhZ2VzTmVlZGluZ0VyYXNlKCk6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRUYXBUb1ZpZXdNZXNzYWdlc05lZWRpbmdFcmFzZSgpO1xufVxuXG4vLyBVbnByb2Nlc3NlZFxuXG5hc3luYyBmdW5jdGlvbiBnZXRVbnByb2Nlc3NlZENvdW50KCk6IFByb21pc2U8bnVtYmVyPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRVbnByb2Nlc3NlZENvdW50KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTogUHJvbWlzZTxcbiAgQXJyYXk8VW5wcm9jZXNzZWRUeXBlPlxuPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRBbGxVbnByb2Nlc3NlZEFuZEluY3JlbWVudEF0dGVtcHRzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFVucHJvY2Vzc2VkQnlJZChcbiAgaWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxVbnByb2Nlc3NlZFR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFVucHJvY2Vzc2VkQnlJZChpZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGEoXG4gIGlkOiBzdHJpbmcsXG4gIGRhdGE6IFVucHJvY2Vzc2VkVXBkYXRlVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnVwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGEoaWQsIGRhdGEpO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVW5wcm9jZXNzZWRzV2l0aERhdGEoXG4gIGFycmF5OiBBcnJheTx7IGlkOiBzdHJpbmc7IGRhdGE6IFVucHJvY2Vzc2VkVXBkYXRlVHlwZSB9PlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnVwZGF0ZVVucHJvY2Vzc2Vkc1dpdGhEYXRhKGFycmF5KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVW5wcm9jZXNzZWQoaWQ6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlVW5wcm9jZXNzZWQoaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxVbnByb2Nlc3NlZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlQWxsVW5wcm9jZXNzZWQoKTtcbn1cblxuLy8gQXR0YWNobWVudCBkb3dubG9hZHNcblxuYXN5bmMgZnVuY3Rpb24gZ2V0QXR0YWNobWVudERvd25sb2FkSm9iQnlJZChcbiAgaWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxBdHRhY2htZW50RG93bmxvYWRKb2JUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRBdHRhY2htZW50RG93bmxvYWRKb2JCeUlkKGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldE5leHRBdHRhY2htZW50RG93bmxvYWRKb2JzKFxuICBsaW1pdD86IG51bWJlcixcbiAgb3B0aW9ucz86IHsgdGltZXN0YW1wPzogbnVtYmVyIH1cbik6IFByb21pc2U8QXJyYXk8QXR0YWNobWVudERvd25sb2FkSm9iVHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE5leHRBdHRhY2htZW50RG93bmxvYWRKb2JzKGxpbWl0LCBvcHRpb25zKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNhdmVBdHRhY2htZW50RG93bmxvYWRKb2IoXG4gIGpvYjogQXR0YWNobWVudERvd25sb2FkSm9iVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnNhdmVBdHRhY2htZW50RG93bmxvYWRKb2IoX2NsZWFuRGF0YShqb2IpKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNldEF0dGFjaG1lbnREb3dubG9hZEpvYlBlbmRpbmcoXG4gIGlkOiBzdHJpbmcsXG4gIHBlbmRpbmc6IGJvb2xlYW5cbik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5zZXRBdHRhY2htZW50RG93bmxvYWRKb2JQZW5kaW5nKGlkLCBwZW5kaW5nKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0QXR0YWNobWVudERvd25sb2FkUGVuZGluZygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVzZXRBdHRhY2htZW50RG93bmxvYWRQZW5kaW5nKCk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBdHRhY2htZW50RG93bmxvYWRKb2IoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBdHRhY2htZW50RG93bmxvYWRKb2IoaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsQXR0YWNobWVudERvd25sb2FkSm9icygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMucmVtb3ZlQWxsQXR0YWNobWVudERvd25sb2FkSm9icygpO1xufVxuXG4vLyBTdGlja2Vyc1xuXG5hc3luYyBmdW5jdGlvbiBnZXRTdGlja2VyQ291bnQoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFN0aWNrZXJDb3VudCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVN0aWNrZXJQYWNrKHBhY2s6IFN0aWNrZXJQYWNrVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5jcmVhdGVPclVwZGF0ZVN0aWNrZXJQYWNrKHBhY2spO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RpY2tlclBhY2tTdGF0dXMoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBzdGF0dXM6IFN0aWNrZXJQYWNrU3RhdHVzVHlwZSxcbiAgb3B0aW9ucz86IHsgdGltZXN0YW1wOiBudW1iZXIgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzKHBhY2tJZCwgc3RhdHVzLCBvcHRpb25zKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN0aWNrZXJQYWNrSW5mbyhpbmZvOiBTdGlja2VyUGFja0luZm9UeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLnVwZGF0ZVN0aWNrZXJQYWNrSW5mbyhpbmZvKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU3RpY2tlcihzdGlja2VyOiBTdGlja2VyVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5jcmVhdGVPclVwZGF0ZVN0aWNrZXIoc3RpY2tlcik7XG59XG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTdGlja2VyTGFzdFVzZWQoXG4gIHBhY2tJZDogc3RyaW5nLFxuICBzdGlja2VySWQ6IG51bWJlcixcbiAgdGltZXN0YW1wOiBudW1iZXJcbik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY2hhbm5lbHMudXBkYXRlU3RpY2tlckxhc3RVc2VkKHBhY2tJZCwgc3RpY2tlcklkLCB0aW1lc3RhbXApO1xufVxuYXN5bmMgZnVuY3Rpb24gYWRkU3RpY2tlclBhY2tSZWZlcmVuY2UoXG4gIG1lc3NhZ2VJZDogc3RyaW5nLFxuICBwYWNrSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmFkZFN0aWNrZXJQYWNrUmVmZXJlbmNlKG1lc3NhZ2VJZCwgcGFja0lkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVN0aWNrZXJQYWNrUmVmZXJlbmNlKFxuICBtZXNzYWdlSWQ6IHN0cmluZyxcbiAgcGFja0lkOiBzdHJpbmdcbik6IFByb21pc2U8UmVhZG9ubHlBcnJheTxzdHJpbmc+IHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBjaGFubmVscy5kZWxldGVTdGlja2VyUGFja1JlZmVyZW5jZShtZXNzYWdlSWQsIHBhY2tJZCk7XG59XG5hc3luYyBmdW5jdGlvbiBkZWxldGVTdGlja2VyUGFjayhwYWNrSWQ6IHN0cmluZyk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZGVsZXRlU3RpY2tlclBhY2socGFja0lkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFN0aWNrZXJQYWNrcygpOiBQcm9taXNlPEFycmF5PFN0aWNrZXJQYWNrVHlwZT4+IHtcbiAgY29uc3QgcGFja3MgPSBhd2FpdCBjaGFubmVscy5nZXRBbGxTdGlja2VyUGFja3MoKTtcblxuICByZXR1cm4gcGFja3M7XG59XG5hc3luYyBmdW5jdGlvbiBhZGRVbmluc3RhbGxlZFN0aWNrZXJQYWNrKFxuICBwYWNrOiBVbmluc3RhbGxlZFN0aWNrZXJQYWNrVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5hZGRVbmluc3RhbGxlZFN0aWNrZXJQYWNrKHBhY2spO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVW5pbnN0YWxsZWRTdGlja2VyUGFjayhwYWNrSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY2hhbm5lbHMucmVtb3ZlVW5pbnN0YWxsZWRTdGlja2VyUGFjayhwYWNrSWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SW5zdGFsbGVkU3RpY2tlclBhY2tzKCk6IFByb21pc2U8QXJyYXk8U3RpY2tlclBhY2tUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0SW5zdGFsbGVkU3RpY2tlclBhY2tzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRVbmluc3RhbGxlZFN0aWNrZXJQYWNrcygpOiBQcm9taXNlPFxuICBBcnJheTxVbmluc3RhbGxlZFN0aWNrZXJQYWNrVHlwZT5cbj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0VW5pbnN0YWxsZWRTdGlja2VyUGFja3MoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxTdGlja2VyUGFjayhcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHRpbWVzdGFtcDogbnVtYmVyXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmluc3RhbGxTdGlja2VyUGFjayhwYWNrSWQsIHRpbWVzdGFtcCk7XG59XG5hc3luYyBmdW5jdGlvbiB1bmluc3RhbGxTdGlja2VyUGFjayhcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHRpbWVzdGFtcDogbnVtYmVyXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLnVuaW5zdGFsbFN0aWNrZXJQYWNrKHBhY2tJZCwgdGltZXN0YW1wKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFN0aWNrZXJQYWNrSW5mbyhcbiAgcGFja0lkOiBzdHJpbmdcbik6IFByb21pc2U8U3RpY2tlclBhY2tJbmZvVHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0U3RpY2tlclBhY2tJbmZvKHBhY2tJZCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTdGlja2VycygpOiBQcm9taXNlPEFycmF5PFN0aWNrZXJUeXBlPj4ge1xuICBjb25zdCBzdGlja2VycyA9IGF3YWl0IGNoYW5uZWxzLmdldEFsbFN0aWNrZXJzKCk7XG5cbiAgcmV0dXJuIHN0aWNrZXJzO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjZW50U3RpY2tlcnMoKTogUHJvbWlzZTxBcnJheTxTdGlja2VyVHlwZT4+IHtcbiAgY29uc3QgcmVjZW50U3RpY2tlcnMgPSBhd2FpdCBjaGFubmVscy5nZXRSZWNlbnRTdGlja2VycygpO1xuXG4gIHJldHVybiByZWNlbnRTdGlja2Vycztcbn1cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyQWxsRXJyb3JTdGlja2VyUGFja0F0dGVtcHRzKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5jbGVhckFsbEVycm9yU3RpY2tlclBhY2tBdHRlbXB0cygpO1xufVxuXG4vLyBFbW9qaXNcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUVtb2ppVXNhZ2Uoc2hvcnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMudXBkYXRlRW1vamlVc2FnZShzaG9ydE5hbWUpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjZW50RW1vamlzKGxpbWl0ID0gMzIpOiBQcm9taXNlPEFycmF5PEVtb2ppVHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFJlY2VudEVtb2ppcyhsaW1pdCk7XG59XG5cbi8vIEJhZGdlc1xuXG5mdW5jdGlvbiBnZXRBbGxCYWRnZXMoKTogUHJvbWlzZTxBcnJheTxCYWRnZVR5cGU+PiB7XG4gIHJldHVybiBjaGFubmVscy5nZXRBbGxCYWRnZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlT3JDcmVhdGVCYWRnZXMoXG4gIGJhZGdlczogUmVhZG9ubHlBcnJheTxCYWRnZVR5cGU+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGJhZGdlcy5sZW5ndGgpIHtcbiAgICBhd2FpdCBjaGFubmVscy51cGRhdGVPckNyZWF0ZUJhZGdlcyhiYWRnZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhZGdlSW1hZ2VGaWxlRG93bmxvYWRlZChcbiAgdXJsOiBzdHJpbmcsXG4gIGxvY2FsUGF0aDogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmJhZGdlSW1hZ2VGaWxlRG93bmxvYWRlZCh1cmwsIGxvY2FsUGF0aCk7XG59XG5cbi8vIFN0b3J5IERpc3RyaWJ1dGlvbnNcblxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucygpOiBQcm9taXNlPFxuICBBcnJheTxTdG9yeURpc3RyaWJ1dGlvblR5cGU+XG4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLl9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoKTogUHJvbWlzZTxcbiAgQXJyYXk8U3RvcnlEaXN0cmlidXRpb25NZW1iZXJUeXBlPlxuPiB7XG4gIHJldHVybiBjaGFubmVscy5fZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25NZW1iZXJzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfZGVsZXRlQWxsU3RvcnlEaXN0cmlidXRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5fZGVsZXRlQWxsU3RvcnlEaXN0cmlidXRpb25zKCk7XG59XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVOZXdTdG9yeURpc3RyaWJ1dGlvbihcbiAgZGlzdHJpYnV0aW9uOiBTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uKGRpc3RyaWJ1dGlvbik7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpOiBQcm9taXNlPFxuICBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZT5cbj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zV2l0aE1lbWJlcnMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gbW9kaWZ5U3RvcnlEaXN0cmlidXRpb24oXG4gIGRpc3RyaWJ1dGlvbjogU3RvcnlEaXN0cmlidXRpb25UeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMubW9kaWZ5U3RvcnlEaXN0cmlidXRpb24oZGlzdHJpYnV0aW9uKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycyhcbiAgaWQ6IHN0cmluZyxcbiAgb3B0aW9uczoge1xuICAgIHRvQWRkOiBBcnJheTxVVUlEU3RyaW5nVHlwZT47XG4gICAgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPjtcbiAgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycyhpZCwgb3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKFxuICBkaXN0cmlidXRpb246IFN0b3J5RGlzdHJpYnV0aW9uVHlwZSxcbiAgb3B0aW9uczoge1xuICAgIHRvQWRkOiBBcnJheTxVVUlEU3RyaW5nVHlwZT47XG4gICAgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPjtcbiAgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLm1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoZGlzdHJpYnV0aW9uLCBvcHRpb25zKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVN0b3J5RGlzdHJpYnV0aW9uKGlkOiBVVUlEU3RyaW5nVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5kZWxldGVTdG9yeURpc3RyaWJ1dGlvbihpZCk7XG59XG5cbi8vIFN0b3J5IFJlYWRzXG5cbmFzeW5jIGZ1bmN0aW9uIF9nZXRBbGxTdG9yeVJlYWRzKCk6IFByb21pc2U8QXJyYXk8U3RvcnlSZWFkVHlwZT4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLl9nZXRBbGxTdG9yeVJlYWRzKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfZGVsZXRlQWxsU3RvcnlSZWFkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2hhbm5lbHMuX2RlbGV0ZUFsbFN0b3J5UmVhZHMoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGFkZE5ld1N0b3J5UmVhZChyZWFkOiBTdG9yeVJlYWRUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5hZGROZXdTdG9yeVJlYWQocmVhZCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRMYXN0U3RvcnlSZWFkc0ZvckF1dGhvcihvcHRpb25zOiB7XG4gIGF1dGhvcklkOiBVVUlEU3RyaW5nVHlwZTtcbiAgY29udmVyc2F0aW9uSWQ/OiBVVUlEU3RyaW5nVHlwZTtcbiAgbGltaXQ/OiBudW1iZXI7XG59KTogUHJvbWlzZTxBcnJheTxTdG9yeVJlYWRUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0TGFzdFN0b3J5UmVhZHNGb3JBdXRob3Iob3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiBjb3VudFN0b3J5UmVhZHNCeUNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmNvdW50U3RvcnlSZWFkc0J5Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkKTtcbn1cblxuLy8gT3RoZXJcblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGwoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsQ29uZmlndXJhdGlvbihcbiAgdHlwZT86IFJlbW92ZUFsbENvbmZpZ3VyYXRpb25cbik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBjaGFubmVscy5yZW1vdmVBbGxDb25maWd1cmF0aW9uKHR5cGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhbnVwT3JwaGFuZWRBdHRhY2htZW50cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgY2FsbENoYW5uZWwoQ0xFQU5VUF9PUlBIQU5FRF9BVFRBQ0hNRU5UU19LRVkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVGaWxlUGVybWlzc2lvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNhbGxDaGFubmVsKEVOU1VSRV9GSUxFX1BFUk1JU1NJT05TKTtcbn1cblxuLy8gTm90ZTogd2lsbCBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcCBhZnRlciBjYWxsaW5nIHRoaXMsIHRvIHNldCB1cCBhZnJlc2hcbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZU90aGVyRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIGNhbGxDaGFubmVsKEVSQVNFX1NRTF9LRVkpLFxuICAgIGNhbGxDaGFubmVsKEVSQVNFX0FUVEFDSE1FTlRTX0tFWSksXG4gICAgY2FsbENoYW5uZWwoRVJBU0VfU1RJQ0tFUlNfS0VZKSxcbiAgICBjYWxsQ2hhbm5lbChFUkFTRV9URU1QX0tFWSksXG4gICAgY2FsbENoYW5uZWwoRVJBU0VfRFJBRlRTX0tFWSksXG4gIF0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjYWxsQ2hhbm5lbChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAoKSA9PlxuICAgICAgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpcGMuc2VuZChuYW1lKTtcbiAgICAgICAgaXBjLm9uY2UoYCR7bmFtZX0tZG9uZWAsIChfLCBlcnJvcikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICBgY2FsbENoYW5uZWwgY2FsbCB0byAke25hbWV9YFxuICApKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1lc3NhZ2VzTmVlZGluZ1VwZ3JhZGUoXG4gIGxpbWl0OiBudW1iZXIsXG4gIHsgbWF4VmVyc2lvbiA9IENVUlJFTlRfU0NIRU1BX1ZFUlNJT04gfTogeyBtYXhWZXJzaW9uOiBudW1iZXIgfVxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjaGFubmVscy5nZXRNZXNzYWdlc05lZWRpbmdVcGdyYWRlKGxpbWl0LCB7XG4gICAgbWF4VmVyc2lvbixcbiAgfSk7XG5cbiAgcmV0dXJuIG1lc3NhZ2VzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRNZXNzYWdlc1dpdGhWaXN1YWxNZWRpYUF0dGFjaG1lbnRzKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB7IGxpbWl0IH06IHsgbGltaXQ6IG51bWJlciB9XG4pOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0TWVzc2FnZXNXaXRoVmlzdWFsTWVkaWFBdHRhY2htZW50cyhjb252ZXJzYXRpb25JZCwge1xuICAgIGxpbWl0LFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNXaXRoRmlsZUF0dGFjaG1lbnRzKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB7IGxpbWl0IH06IHsgbGltaXQ6IG51bWJlciB9XG4pOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0TWVzc2FnZXNXaXRoRmlsZUF0dGFjaG1lbnRzKGNvbnZlcnNhdGlvbklkLCB7XG4gICAgbGltaXQsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlU2VydmVyR3VpZHNGb3JTcGFtKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBQcm9taXNlPEFycmF5PHN0cmluZz4+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE1lc3NhZ2VTZXJ2ZXJHdWlkc0ZvclNwYW0oY29udmVyc2F0aW9uSWQpO1xufVxuXG5mdW5jdGlvbiBnZXRKb2JzSW5RdWV1ZShxdWV1ZVR5cGU6IHN0cmluZyk6IFByb21pc2U8QXJyYXk8U3RvcmVkSm9iPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0Sm9ic0luUXVldWUocXVldWVUeXBlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Sm9iKGpvYjogUmVhZG9ubHk8U3RvcmVkSm9iPik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY2hhbm5lbHMuaW5zZXJ0Sm9iKGpvYik7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUpvYihpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5kZWxldGVKb2IoaWQpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzR3JvdXBDYWxsUmluZ1JlcXVlc3QoXG4gIHJpbmdJZDogYmlnaW50XG4pOiBQcm9taXNlPFByb2Nlc3NHcm91cENhbGxSaW5nUmVxdWVzdFJlc3VsdD4ge1xuICByZXR1cm4gY2hhbm5lbHMucHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0KHJpbmdJZCk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NHcm91cENhbGxSaW5nQ2FuY2VsYXRpb24ocmluZ0lkOiBiaWdpbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLnByb2Nlc3NHcm91cENhbGxSaW5nQ2FuY2VsYXRpb24ocmluZ0lkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYW5FeHBpcmVkR3JvdXBDYWxsUmluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNoYW5uZWxzLmNsZWFuRXhwaXJlZEdyb3VwQ2FsbFJpbmdzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUFsbENvbnZlcnNhdGlvbkNvbG9ycyhcbiAgY29udmVyc2F0aW9uQ29sb3I/OiBDb252ZXJzYXRpb25Db2xvclR5cGUsXG4gIGN1c3RvbUNvbG9yRGF0YT86IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHZhbHVlOiBDdXN0b21Db2xvclR5cGU7XG4gIH1cbik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY2hhbm5lbHMudXBkYXRlQWxsQ29udmVyc2F0aW9uQ29sb3JzKFxuICAgIGNvbnZlcnNhdGlvbkNvbG9yLFxuICAgIGN1c3RvbUNvbG9yRGF0YVxuICApO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxQcm9maWxlS2V5Q3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjaGFubmVscy5yZW1vdmVBbGxQcm9maWxlS2V5Q3JlZGVudGlhbHMoKTtcbn1cblxuZnVuY3Rpb24gZ2V0TWF4TWVzc2FnZUNvdW50ZXIoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgcmV0dXJuIGNoYW5uZWxzLmdldE1heE1lc3NhZ2VDb3VudGVyKCk7XG59XG5cbmZ1bmN0aW9uIGdldFN0YXRpc3RpY3NGb3JMb2dnaW5nKCk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4ge1xuICByZXR1cm4gY2hhbm5lbHMuZ2V0U3RhdGlzdGljc0ZvckxvZ2dpbmcoKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBLHNCQUFtQztBQUNuQyxzQkFBZTtBQUNmLGtCQUFpQjtBQUVqQixvQkFXTztBQUVQLDBCQUFvQztBQUNwQyxzQ0FBZ0Q7QUFDaEQsOENBQWlEO0FBQ2pELFlBQXVCO0FBQ3ZCLHNCQUF1QztBQUN2QyxxQkFBOEI7QUFDOUIsb0JBQXFDO0FBQ3JDLCtCQUFrQztBQUVsQyw2QkFBZ0M7QUFPaEMsNkJBQWtDO0FBQ2xDLFVBQXFCO0FBR3JCLGdDQUFtQztBQUNuQyxxQkFBK0I7QUFzRC9CLG9CQUFtQjtBQUNuQixvQkFBa0M7QUFDbEMsdUJBQXVCO0FBQ3ZCLDBCQUF1QztBQUl2QyxJQUFJLCtCQUFPLDRCQUFJLGlCQUFpQjtBQUM5Qiw4QkFBSSxnQkFBZ0IsQ0FBQztBQUN2QixPQUFPO0FBQ0wsTUFBSSxLQUFLLG1DQUFtQztBQUM5QztBQUVBLE1BQU0sY0FBYyx5QkFBSyx3QkFBRyxRQUFRO0FBRXBDLE1BQU0scUJBQXFCO0FBRTNCLE1BQU0sa0JBQWtCO0FBQ3hCLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sd0JBQXdCO0FBQzlCLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0saUJBQWlCO0FBQ3ZCLE1BQU0sbUJBQW1CO0FBQ3pCLE1BQU0sbUNBQW1DO0FBQ3pDLE1BQU0sMEJBQTBCO0FBUWhDLElBQUssZ0JBQUwsa0JBQUssbUJBQUw7QUFDRSw2QkFBUztBQUNULDhCQUFVO0FBQ1YsaUNBQWE7QUFDYiw4QkFBVTtBQUpQO0FBQUE7QUFPTCxNQUFNLFFBQXlDLHVCQUFPLE9BQU8sSUFBSTtBQUNqRSxNQUFNLFNBQVM7QUFDZixJQUFJLGNBQWM7QUFDbEIsSUFBSSxnQkFBZ0I7QUFDcEIsSUFBSSxvQkFBc0Q7QUFDMUQsSUFBSSxtQkFBeUM7QUFDN0MsSUFBSSxRQUFRO0FBQ1osTUFBTSxpQkFBaUIsb0JBQUksSUFBb0I7QUFNL0MsTUFBTSxnQkFBaUM7QUFBQSxFQUNyQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBRUE7QUFBQSxFQUlBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBSUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTyxpQkFBUTtBQUVm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
