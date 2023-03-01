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
var Server_exports = {};
__export(Server_exports, {
  _storyIdPredicate: () => _storyIdPredicate,
  default: () => Server_default,
  getJobsInQueueSync: () => getJobsInQueueSync,
  getMessageByIdSync: () => getMessageByIdSync,
  insertJobSync: () => insertJobSync
});
module.exports = __toCommonJS(Server_exports);
var import_path = require("path");
var import_mkdirp = __toESM(require("mkdirp"));
var import_rimraf = __toESM(require("rimraf"));
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_p_props = __toESM(require("p-props"));
var import_lodash = require("lodash");
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_StorageUIKeys = require("../types/StorageUIKeys");
var import_UUID = require("../types/UUID");
var import_assert = require("../util/assert");
var import_combineNames = require("../util/combineNames");
var import_consoleLogger = require("../util/consoleLogger");
var import_dropNull = require("../util/dropNull");
var import_isNormalNumber = require("../util/isNormalNumber");
var import_isNotNil = require("../util/isNotNil");
var import_missingCaseError = require("../util/missingCaseError");
var import_parseIntOrThrow = require("../util/parseIntOrThrow");
var durations = __toESM(require("../util/durations"));
var import_formatCountForLogging = require("../logging/formatCountForLogging");
var import_Calling = require("../types/Calling");
var import_RemoveAllConfiguration = require("../types/RemoveAllConfiguration");
var import_BadgeCategory = require("../badges/BadgeCategory");
var import_BadgeImageTheme = require("../badges/BadgeImageTheme");
var log = __toESM(require("../logging/log"));
var import_util = require("./util");
var import_migrations = require("./migrations");
var import_MessageSeenStatus = require("../MessageSeenStatus");
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
  getUnreadByConversationAndMarkRead,
  getUnreadReactionsAndMarkRead,
  markReactionAsRead,
  addReaction,
  removeReactionFromConversation,
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
  getTotalUnreadForConversation,
  getMessageMetricsForConversation,
  getConversationRangeCenteredOnMessage,
  getConversationMessageStats,
  getLastConversationMessage,
  hasGroupCallHistoryMessage,
  migrateConversationMessages,
  getUnprocessedCount,
  getAllUnprocessedAndIncrementAttempts,
  updateUnprocessedWithData,
  updateUnprocessedsWithData,
  getUnprocessedById,
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
  initialize,
  initializeRenderer,
  removeKnownAttachments,
  removeKnownStickers,
  removeKnownDraftAttachments,
  getAllBadgeImageFileLocalPaths
};
var Server_default = dataInterface;
const statementCache = /* @__PURE__ */ new WeakMap();
function prepare(db, query) {
  let dbCache = statementCache.get(db);
  if (!dbCache) {
    dbCache = /* @__PURE__ */ new Map();
    statementCache.set(db, dbCache);
  }
  let result = dbCache.get(query);
  if (!result) {
    result = db.prepare(query);
    dbCache.set(query, result);
  }
  return result;
}
function rowToConversation(row) {
  const parsedJson = JSON.parse(row.json);
  let profileLastFetchedAt;
  if ((0, import_isNormalNumber.isNormalNumber)(row.profileLastFetchedAt)) {
    profileLastFetchedAt = row.profileLastFetchedAt;
  } else {
    (0, import_assert.assert)((0, import_lodash.isNil)(row.profileLastFetchedAt), "profileLastFetchedAt contained invalid data; defaulting to undefined");
    profileLastFetchedAt = void 0;
  }
  return {
    ...parsedJson,
    profileLastFetchedAt
  };
}
function rowToSticker(row) {
  return {
    ...row,
    isCoverOnly: Boolean(row.isCoverOnly),
    emoji: (0, import_dropNull.dropNull)(row.emoji)
  };
}
function isRenderer() {
  if (typeof process === "undefined" || !process) {
    return true;
  }
  return process.type === "renderer";
}
function keyDatabase(db, key) {
  db.pragma(`key = "x'${key}'"`);
}
function switchToWAL(db) {
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = FULL");
  db.pragma("fullfsync = ON");
}
function migrateSchemaVersion(db) {
  const userVersion = (0, import_util.getUserVersion)(db);
  if (userVersion > 0) {
    return;
  }
  const schemaVersion = (0, import_util.getSchemaVersion)(db);
  const newUserVersion = schemaVersion > 18 ? 16 : schemaVersion;
  logger.info(`migrateSchemaVersion: Migrating from schema_version ${schemaVersion} to user_version ${newUserVersion}`);
  (0, import_util.setUserVersion)(db, newUserVersion);
}
function openAndMigrateDatabase(filePath, key) {
  let db;
  try {
    db = new import_better_sqlite3.default(filePath);
    keyDatabase(db, key);
    switchToWAL(db);
    migrateSchemaVersion(db);
    return db;
  } catch (error) {
    if (db) {
      db.close();
    }
    logger.info("migrateDatabase: Migration without cipher change failed");
  }
  db = new import_better_sqlite3.default(filePath);
  keyDatabase(db, key);
  db.pragma("cipher_compatibility = 3");
  migrateSchemaVersion(db);
  db.close();
  db = new import_better_sqlite3.default(filePath);
  keyDatabase(db, key);
  db.pragma("cipher_migrate");
  switchToWAL(db);
  return db;
}
const INVALID_KEY = /[^0-9A-Fa-f]/;
function openAndSetUpSQLCipher(filePath, { key }) {
  const match = INVALID_KEY.exec(key);
  if (match) {
    throw new Error(`setupSQLCipher: key '${key}' is not valid`);
  }
  const db = openAndMigrateDatabase(filePath, key);
  db.pragma("foreign_keys = ON");
  return db;
}
let globalInstance;
let logger = import_consoleLogger.consoleLogger;
let globalInstanceRenderer;
let databaseFilePath;
let indexedDBPath;
async function initialize({
  configDir,
  key,
  logger: suppliedLogger
}) {
  if (globalInstance) {
    throw new Error("Cannot initialize more than once!");
  }
  if (!(0, import_lodash.isString)(configDir)) {
    throw new Error("initialize: configDir is required!");
  }
  if (!(0, import_lodash.isString)(key)) {
    throw new Error("initialize: key is required!");
  }
  logger = suppliedLogger;
  indexedDBPath = (0, import_path.join)(configDir, "IndexedDB");
  const dbDir = (0, import_path.join)(configDir, "sql");
  import_mkdirp.default.sync(dbDir);
  databaseFilePath = (0, import_path.join)(dbDir, "db.sqlite");
  let db;
  try {
    db = openAndSetUpSQLCipher(databaseFilePath, { key });
    (0, import_migrations.updateSchema)(db, logger);
    globalInstance = db;
    getMessageCountSync();
  } catch (error) {
    logger.error("Database startup error:", error.stack);
    if (db) {
      db.close();
    }
    throw error;
  }
}
async function initializeRenderer({
  configDir,
  key
}) {
  if (!isRenderer()) {
    throw new Error("Cannot call from main process.");
  }
  if (globalInstanceRenderer) {
    throw new Error("Cannot initialize more than once!");
  }
  if (!(0, import_lodash.isString)(configDir)) {
    throw new Error("initialize: configDir is required!");
  }
  if (!(0, import_lodash.isString)(key)) {
    throw new Error("initialize: key is required!");
  }
  if (!indexedDBPath) {
    indexedDBPath = (0, import_path.join)(configDir, "IndexedDB");
  }
  const dbDir = (0, import_path.join)(configDir, "sql");
  if (!databaseFilePath) {
    databaseFilePath = (0, import_path.join)(dbDir, "db.sqlite");
  }
  let promisified;
  try {
    promisified = openAndSetUpSQLCipher(databaseFilePath, { key });
    globalInstanceRenderer = promisified;
    getMessageCountSync();
  } catch (error) {
    log.error("Database startup error:", error.stack);
    throw error;
  }
}
async function close() {
  for (const dbRef of [globalInstanceRenderer, globalInstance]) {
    dbRef?.pragma("optimize");
    dbRef?.close();
  }
  globalInstance = void 0;
  globalInstanceRenderer = void 0;
}
async function removeDB() {
  if (globalInstance) {
    try {
      globalInstance.close();
    } catch (error) {
      logger.error("removeDB: Failed to close database:", error.stack);
    }
    globalInstance = void 0;
  }
  if (!databaseFilePath) {
    throw new Error("removeDB: Cannot erase database without a databaseFilePath!");
  }
  logger.warn("removeDB: Removing all database files");
  import_rimraf.default.sync(databaseFilePath);
  import_rimraf.default.sync(`${databaseFilePath}-shm`);
  import_rimraf.default.sync(`${databaseFilePath}-wal`);
}
async function removeIndexedDBFiles() {
  if (!indexedDBPath) {
    throw new Error("removeIndexedDBFiles: Need to initialize and set indexedDBPath first!");
  }
  const pattern = (0, import_path.join)(indexedDBPath, "*.leveldb");
  import_rimraf.default.sync(pattern);
  indexedDBPath = void 0;
}
function getInstance() {
  if (isRenderer()) {
    if (!globalInstanceRenderer) {
      throw new Error("getInstance: globalInstanceRenderer not set!");
    }
    return globalInstanceRenderer;
  }
  if (!globalInstance) {
    throw new Error("getInstance: globalInstance not set!");
  }
  return globalInstance;
}
const IDENTITY_KEYS_TABLE = "identityKeys";
async function createOrUpdateIdentityKey(data) {
  return (0, import_util.createOrUpdate)(getInstance(), IDENTITY_KEYS_TABLE, data);
}
async function getIdentityKeyById(id) {
  return (0, import_util.getById)(getInstance(), IDENTITY_KEYS_TABLE, id);
}
async function bulkAddIdentityKeys(array) {
  return (0, import_util.bulkAdd)(getInstance(), IDENTITY_KEYS_TABLE, array);
}
async function removeIdentityKeyById(id) {
  return (0, import_util.removeById)(getInstance(), IDENTITY_KEYS_TABLE, id);
}
async function removeAllIdentityKeys() {
  return (0, import_util.removeAllFromTable)(getInstance(), IDENTITY_KEYS_TABLE);
}
async function getAllIdentityKeys() {
  return (0, import_util.getAllFromTable)(getInstance(), IDENTITY_KEYS_TABLE);
}
const PRE_KEYS_TABLE = "preKeys";
async function createOrUpdatePreKey(data) {
  return (0, import_util.createOrUpdate)(getInstance(), PRE_KEYS_TABLE, data);
}
async function getPreKeyById(id) {
  return (0, import_util.getById)(getInstance(), PRE_KEYS_TABLE, id);
}
async function bulkAddPreKeys(array) {
  return (0, import_util.bulkAdd)(getInstance(), PRE_KEYS_TABLE, array);
}
async function removePreKeyById(id) {
  return (0, import_util.removeById)(getInstance(), PRE_KEYS_TABLE, id);
}
async function removePreKeysByUuid(uuid) {
  const db = getInstance();
  db.prepare("DELETE FROM preKeys WHERE ourUuid IS $uuid;").run({
    uuid
  });
}
async function removeAllPreKeys() {
  return (0, import_util.removeAllFromTable)(getInstance(), PRE_KEYS_TABLE);
}
async function getAllPreKeys() {
  return (0, import_util.getAllFromTable)(getInstance(), PRE_KEYS_TABLE);
}
const SIGNED_PRE_KEYS_TABLE = "signedPreKeys";
async function createOrUpdateSignedPreKey(data) {
  return (0, import_util.createOrUpdate)(getInstance(), SIGNED_PRE_KEYS_TABLE, data);
}
async function getSignedPreKeyById(id) {
  return (0, import_util.getById)(getInstance(), SIGNED_PRE_KEYS_TABLE, id);
}
async function bulkAddSignedPreKeys(array) {
  return (0, import_util.bulkAdd)(getInstance(), SIGNED_PRE_KEYS_TABLE, array);
}
async function removeSignedPreKeyById(id) {
  return (0, import_util.removeById)(getInstance(), SIGNED_PRE_KEYS_TABLE, id);
}
async function removeSignedPreKeysByUuid(uuid) {
  const db = getInstance();
  db.prepare("DELETE FROM signedPreKeys WHERE ourUuid IS $uuid;").run({
    uuid
  });
}
async function removeAllSignedPreKeys() {
  return (0, import_util.removeAllFromTable)(getInstance(), SIGNED_PRE_KEYS_TABLE);
}
async function getAllSignedPreKeys() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM signedPreKeys
      ORDER BY id ASC;
      `).all();
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
const ITEMS_TABLE = "items";
async function createOrUpdateItem(data) {
  return (0, import_util.createOrUpdate)(getInstance(), ITEMS_TABLE, data);
}
async function getItemById(id) {
  return (0, import_util.getById)(getInstance(), ITEMS_TABLE, id);
}
async function getAllItems() {
  const db = getInstance();
  const rows = db.prepare("SELECT json FROM items ORDER BY id ASC;").all();
  const items = rows.map((row) => (0, import_util.jsonToObject)(row.json));
  const result = /* @__PURE__ */ Object.create(null);
  for (const { id, value } of items) {
    result[id] = value;
  }
  return result;
}
async function removeItemById(id) {
  return (0, import_util.removeById)(getInstance(), ITEMS_TABLE, id);
}
async function removeAllItems() {
  return (0, import_util.removeAllFromTable)(getInstance(), ITEMS_TABLE);
}
async function createOrUpdateSenderKey(key) {
  createOrUpdateSenderKeySync(key);
}
function createOrUpdateSenderKeySync(key) {
  const db = getInstance();
  prepare(db, `
    INSERT OR REPLACE INTO senderKeys (
      id,
      senderId,
      distributionId,
      data,
      lastUpdatedDate
    ) values (
      $id,
      $senderId,
      $distributionId,
      $data,
      $lastUpdatedDate
    )
    `).run(key);
}
async function getSenderKeyById(id) {
  const db = getInstance();
  const row = prepare(db, "SELECT * FROM senderKeys WHERE id = $id").get({
    id
  });
  return row;
}
async function removeAllSenderKeys() {
  const db = getInstance();
  prepare(db, "DELETE FROM senderKeys").run();
}
async function getAllSenderKeys() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM senderKeys").all();
  return rows;
}
async function removeSenderKeyById(id) {
  const db = getInstance();
  prepare(db, "DELETE FROM senderKeys WHERE id = $id").run({ id });
}
async function insertSentProto(proto, options) {
  const db = getInstance();
  const { recipients, messageIds } = options;
  return db.transaction(() => {
    const info = prepare(db, `
      INSERT INTO sendLogPayloads (
        contentHint,
        proto,
        timestamp,
        urgent
      ) VALUES (
        $contentHint,
        $proto,
        $timestamp,
        $urgent
      );
      `).run({
      ...proto,
      urgent: proto.urgent ? 1 : 0
    });
    const id = (0, import_parseIntOrThrow.parseIntOrThrow)(info.lastInsertRowid, "insertSentProto/lastInsertRowid");
    const recipientStatement = prepare(db, `
      INSERT INTO sendLogRecipients (
        payloadId,
        recipientUuid,
        deviceId
      ) VALUES (
        $id,
        $recipientUuid,
        $deviceId
      );
      `);
    const recipientUuids = Object.keys(recipients);
    for (const recipientUuid of recipientUuids) {
      const deviceIds = recipients[recipientUuid];
      for (const deviceId of deviceIds) {
        recipientStatement.run({
          id,
          recipientUuid,
          deviceId
        });
      }
    }
    const messageStatement = prepare(db, `
      INSERT INTO sendLogMessageIds (
        payloadId,
        messageId
      ) VALUES (
        $id,
        $messageId
      );
      `);
    for (const messageId of messageIds) {
      messageStatement.run({
        id,
        messageId
      });
    }
    return id;
  })();
}
async function deleteSentProtosOlderThan(timestamp) {
  const db = getInstance();
  prepare(db, `
    DELETE FROM sendLogPayloads
    WHERE
      timestamp IS NULL OR
      timestamp < $timestamp;
    `).run({
    timestamp
  });
}
async function deleteSentProtoByMessageId(messageId) {
  const db = getInstance();
  prepare(db, `
    DELETE FROM sendLogPayloads WHERE id IN (
      SELECT payloadId FROM sendLogMessageIds
      WHERE messageId = $messageId
    );
    `).run({
    messageId
  });
}
async function insertProtoRecipients({
  id,
  recipientUuid,
  deviceIds
}) {
  const db = getInstance();
  db.transaction(() => {
    const statement = prepare(db, `
      INSERT INTO sendLogRecipients (
        payloadId,
        recipientUuid,
        deviceId
      ) VALUES (
        $id,
        $recipientUuid,
        $deviceId
      );
      `);
    for (const deviceId of deviceIds) {
      statement.run({
        id,
        recipientUuid,
        deviceId
      });
    }
  })();
}
async function deleteSentProtoRecipient(options) {
  const db = getInstance();
  const items = Array.isArray(options) ? options : [options];
  db.transaction(() => {
    for (const item of items) {
      const { timestamp, recipientUuid, deviceId } = item;
      const rows = prepare(db, `
        SELECT sendLogPayloads.id FROM sendLogPayloads
        INNER JOIN sendLogRecipients
          ON sendLogRecipients.payloadId = sendLogPayloads.id
        WHERE
          sendLogPayloads.timestamp = $timestamp AND
          sendLogRecipients.recipientUuid = $recipientUuid AND
          sendLogRecipients.deviceId = $deviceId;
       `).all({ timestamp, recipientUuid, deviceId });
      if (!rows.length) {
        continue;
      }
      if (rows.length > 1) {
        logger.warn(`deleteSentProtoRecipient: More than one payload matches recipient and timestamp ${timestamp}. Using the first.`);
        continue;
      }
      const { id } = rows[0];
      prepare(db, `
        DELETE FROM sendLogRecipients
        WHERE
          payloadId = $id AND
          recipientUuid = $recipientUuid AND
          deviceId = $deviceId;
        `).run({ id, recipientUuid, deviceId });
      const remaining = prepare(db, "SELECT count(*) FROM sendLogRecipients WHERE payloadId = $id;").pluck(true).get({ id });
      if (!(0, import_lodash.isNumber)(remaining)) {
        throw new Error("deleteSentProtoRecipient: select count() returned non-number!");
      }
      if (remaining > 0) {
        continue;
      }
      logger.info(`deleteSentProtoRecipient: Deleting proto payload for timestamp ${timestamp}`);
      prepare(db, "DELETE FROM sendLogPayloads WHERE id = $id;").run({
        id
      });
    }
  })();
}
async function getSentProtoByRecipient({
  now,
  recipientUuid,
  timestamp
}) {
  const db = getInstance();
  const HOUR = 1e3 * 60 * 60;
  const oneDayAgo = now - HOUR * 24;
  await deleteSentProtosOlderThan(oneDayAgo);
  const row = prepare(db, `
    SELECT
      sendLogPayloads.*,
      GROUP_CONCAT(DISTINCT sendLogMessageIds.messageId) AS messageIds
    FROM sendLogPayloads
    INNER JOIN sendLogRecipients ON sendLogRecipients.payloadId = sendLogPayloads.id
    LEFT JOIN sendLogMessageIds ON sendLogMessageIds.payloadId = sendLogPayloads.id
    WHERE
      sendLogPayloads.timestamp = $timestamp AND
      sendLogRecipients.recipientUuid = $recipientUuid
    GROUP BY sendLogPayloads.id;
    `).get({
    timestamp,
    recipientUuid
  });
  if (!row) {
    return void 0;
  }
  const { messageIds } = row;
  return {
    ...row,
    urgent: (0, import_lodash.isNumber)(row.urgent) ? Boolean(row.urgent) : true,
    messageIds: messageIds ? messageIds.split(",") : []
  };
}
async function removeAllSentProtos() {
  const db = getInstance();
  prepare(db, "DELETE FROM sendLogPayloads;").run();
}
async function getAllSentProtos() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogPayloads;").all();
  return rows.map((row) => ({
    ...row,
    urgent: (0, import_lodash.isNumber)(row.urgent) ? Boolean(row.urgent) : true
  }));
}
async function _getAllSentProtoRecipients() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogRecipients;").all();
  return rows;
}
async function _getAllSentProtoMessageIds() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogMessageIds;").all();
  return rows;
}
const SESSIONS_TABLE = "sessions";
function createOrUpdateSessionSync(data) {
  const db = getInstance();
  const { id, conversationId, ourUuid, uuid } = data;
  if (!id) {
    throw new Error("createOrUpdateSession: Provided data did not have a truthy id");
  }
  if (!conversationId) {
    throw new Error("createOrUpdateSession: Provided data did not have a truthy conversationId");
  }
  prepare(db, `
    INSERT OR REPLACE INTO sessions (
      id,
      conversationId,
      ourUuid,
      uuid,
      json
    ) values (
      $id,
      $conversationId,
      $ourUuid,
      $uuid,
      $json
    )
    `).run({
    id,
    conversationId,
    ourUuid,
    uuid,
    json: (0, import_util.objectToJSON)(data)
  });
}
async function createOrUpdateSession(data) {
  return createOrUpdateSessionSync(data);
}
async function createOrUpdateSessions(array) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of array) {
      (0, import_assert.assertSync)(createOrUpdateSessionSync(item));
    }
  })();
}
async function commitDecryptResult({
  senderKeys,
  sessions,
  unprocessed
}) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of senderKeys) {
      (0, import_assert.assertSync)(createOrUpdateSenderKeySync(item));
    }
    for (const item of sessions) {
      (0, import_assert.assertSync)(createOrUpdateSessionSync(item));
    }
    for (const item of unprocessed) {
      (0, import_assert.assertSync)(saveUnprocessedSync(item));
    }
  })();
}
async function bulkAddSessions(array) {
  return (0, import_util.bulkAdd)(getInstance(), SESSIONS_TABLE, array);
}
async function removeSessionById(id) {
  return (0, import_util.removeById)(getInstance(), SESSIONS_TABLE, id);
}
async function removeSessionsByConversation(conversationId) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM sessions
    WHERE conversationId = $conversationId;
    `).run({
    conversationId
  });
}
async function removeAllSessions() {
  return (0, import_util.removeAllFromTable)(getInstance(), SESSIONS_TABLE);
}
async function getAllSessions() {
  return (0, import_util.getAllFromTable)(getInstance(), SESSIONS_TABLE);
}
async function getConversationCount() {
  return (0, import_util.getCountFromTable)(getInstance(), "conversations");
}
function getConversationMembersList({ members, membersV2 }) {
  if (membersV2) {
    return membersV2.map((item) => item.uuid).join(" ");
  }
  if (members) {
    return members.join(" ");
  }
  return null;
}
function saveConversationSync(data, db = getInstance()) {
  const {
    active_at,
    e164,
    groupId,
    id,
    name,
    profileFamilyName,
    profileName,
    profileLastFetchedAt,
    type,
    uuid
  } = data;
  const membersList = getConversationMembersList(data);
  db.prepare(`
    INSERT INTO conversations (
      id,
      json,

      e164,
      uuid,
      groupId,

      active_at,
      type,
      members,
      name,
      profileName,
      profileFamilyName,
      profileFullName,
      profileLastFetchedAt
    ) values (
      $id,
      $json,

      $e164,
      $uuid,
      $groupId,

      $active_at,
      $type,
      $members,
      $name,
      $profileName,
      $profileFamilyName,
      $profileFullName,
      $profileLastFetchedAt
    );
    `).run({
    id,
    json: (0, import_util.objectToJSON)((0, import_lodash.omit)(data, ["profileLastFetchedAt", "unblurredAvatarPath"])),
    e164: e164 || null,
    uuid: uuid || null,
    groupId: groupId || null,
    active_at: active_at || null,
    type,
    members: membersList,
    name: name || null,
    profileName: profileName || null,
    profileFamilyName: profileFamilyName || null,
    profileFullName: (0, import_combineNames.combineNames)(profileName, profileFamilyName) || null,
    profileLastFetchedAt: profileLastFetchedAt || null
  });
}
async function saveConversation(data, db = getInstance()) {
  return saveConversationSync(data, db);
}
async function saveConversations(arrayOfConversations) {
  const db = getInstance();
  db.transaction(() => {
    for (const conversation of arrayOfConversations) {
      (0, import_assert.assertSync)(saveConversationSync(conversation));
    }
  })();
}
function updateConversationSync(data, db = getInstance()) {
  const {
    id,
    active_at,
    type,
    name,
    profileName,
    profileFamilyName,
    profileLastFetchedAt,
    e164,
    uuid
  } = data;
  const membersList = getConversationMembersList(data);
  db.prepare(`
    UPDATE conversations SET
      json = $json,

      e164 = $e164,
      uuid = $uuid,

      active_at = $active_at,
      type = $type,
      members = $members,
      name = $name,
      profileName = $profileName,
      profileFamilyName = $profileFamilyName,
      profileFullName = $profileFullName,
      profileLastFetchedAt = $profileLastFetchedAt
    WHERE id = $id;
    `).run({
    id,
    json: (0, import_util.objectToJSON)((0, import_lodash.omit)(data, ["profileLastFetchedAt", "unblurredAvatarPath"])),
    e164: e164 || null,
    uuid: uuid || null,
    active_at: active_at || null,
    type,
    members: membersList,
    name: name || null,
    profileName: profileName || null,
    profileFamilyName: profileFamilyName || null,
    profileFullName: (0, import_combineNames.combineNames)(profileName, profileFamilyName) || null,
    profileLastFetchedAt: profileLastFetchedAt || null
  });
}
async function updateConversation(data) {
  return updateConversationSync(data);
}
async function updateConversations(array) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of array) {
      (0, import_assert.assertSync)(updateConversationSync(item));
    }
  })();
}
function removeConversationsSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM conversations
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
async function removeConversation(id) {
  const db = getInstance();
  if (!Array.isArray(id)) {
    db.prepare("DELETE FROM conversations WHERE id = $id;").run({
      id
    });
    return;
  }
  if (!id.length) {
    throw new Error("removeConversation: No ids to delete!");
  }
  (0, import_util.batchMultiVarQuery)(db, id, removeConversationsSync);
}
async function _removeAllConversations() {
  const db = getInstance();
  db.prepare("DELETE from conversations;").run();
}
async function getConversationById(id) {
  const db = getInstance();
  const row = db.prepare("SELECT json FROM conversations WHERE id = $id;").get({ id });
  if (!row) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(row.json);
}
async function eraseStorageServiceStateFromConversations() {
  const db = getInstance();
  db.prepare(`
    UPDATE conversations
    SET
      json = json_remove(json, '$.storageID', '$.needsStorageServiceSync', '$.unknownFields', '$.storageProfileKey');
    `).run();
}
function getAllConversationsSync(db = getInstance()) {
  const rows = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations
      ORDER BY id ASC;
      `).all();
  return rows.map((row) => rowToConversation(row));
}
async function getAllConversations() {
  return getAllConversationsSync();
}
async function getAllConversationIds() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT id FROM conversations ORDER BY id ASC;
      `).all();
  return rows.map((row) => row.id);
}
async function getAllGroupsInvolvingUuid(uuid) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations WHERE
        type = 'group' AND
        members LIKE $uuid
      ORDER BY id ASC;
      `).all({
    uuid: `%${uuid}%`
  });
  return rows.map((row) => rowToConversation(row));
}
async function searchMessages(query, params = {}) {
  const { limit = 500, conversationId } = params;
  const db = getInstance();
  return db.transaction(() => {
    db.exec(`
      CREATE TEMP TABLE tmp_results(rowid INTEGER PRIMARY KEY ASC);
      CREATE TEMP TABLE tmp_filtered_results(rowid INTEGER PRIMARY KEY ASC);
      `);
    db.prepare(`
        INSERT INTO tmp_results (rowid)
        SELECT
          rowid
        FROM
          messages_fts
        WHERE
          messages_fts.body MATCH $query;
      `).run({ query });
    if (conversationId === void 0) {
      db.prepare(`
          INSERT INTO tmp_filtered_results (rowid)
          SELECT
            tmp_results.rowid
          FROM
            tmp_results
          INNER JOIN
            messages ON messages.rowid = tmp_results.rowid
          ORDER BY messages.received_at DESC, messages.sent_at DESC
          LIMIT $limit;
        `).run({ limit });
    } else {
      db.prepare(`
          INSERT INTO tmp_filtered_results (rowid)
          SELECT
            tmp_results.rowid
          FROM
            tmp_results
          INNER JOIN
            messages ON messages.rowid = tmp_results.rowid
          WHERE
            messages.conversationId = $conversationId
          ORDER BY messages.received_at DESC, messages.sent_at DESC
          LIMIT $limit;
        `).run({ conversationId, limit });
    }
    const result = db.prepare(`
        SELECT
          messages.json,
          snippet(messages_fts, -1, '<<left>>', '<<right>>', '...', 10)
            AS snippet
        FROM tmp_filtered_results
        INNER JOIN messages_fts
          ON messages_fts.rowid = tmp_filtered_results.rowid
        INNER JOIN messages
          ON messages.rowid = tmp_filtered_results.rowid
        WHERE
          messages_fts.body MATCH $query
        ORDER BY messages.received_at DESC, messages.sent_at DESC;
        `).all({ query });
    db.exec(`
      DROP TABLE tmp_results;
      DROP TABLE tmp_filtered_results;
      `);
    return result;
  })();
}
async function searchMessagesInConversation(query, conversationId, { limit = 100 } = {}) {
  return searchMessages(query, { conversationId, limit });
}
function getMessageCountSync(conversationId, db = getInstance()) {
  if (conversationId === void 0) {
    return (0, import_util.getCountFromTable)(db, "messages");
  }
  const count = db.prepare(`
        SELECT count(*)
        FROM messages
        WHERE conversationId = $conversationId;
        `).pluck().get({ conversationId });
  return count;
}
async function getStoryCount(conversationId) {
  const db = getInstance();
  return db.prepare(`
        SELECT count(*)
        FROM messages
        WHERE conversationId = $conversationId AND isStory = 1;
        `).pluck().get({ conversationId });
}
async function getMessageCount(conversationId) {
  return getMessageCountSync(conversationId);
}
function hasUserInitiatedMessages(conversationId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT COUNT(*) as count FROM
        (
          SELECT 1 FROM messages
          WHERE
            conversationId = $conversationId AND
            isUserInitiatedMessage = 1
          LIMIT 1
        );
      `).get({ conversationId });
  return row.count !== 0;
}
function saveMessageSync(data, options) {
  const {
    alreadyInTransaction,
    db = getInstance(),
    forceSave,
    jobToInsert,
    ourUuid
  } = options;
  if (!alreadyInTransaction) {
    return db.transaction(() => {
      return (0, import_assert.assertSync)(saveMessageSync(data, {
        ...options,
        alreadyInTransaction: true
      }));
    })();
  }
  const {
    body,
    conversationId,
    groupV2Change,
    hasAttachments,
    hasFileAttachments,
    hasVisualMediaAttachments,
    id,
    isErased,
    isViewOnce,
    received_at,
    schemaVersion,
    sent_at,
    serverGuid,
    source,
    sourceUuid,
    sourceDevice,
    storyId,
    type,
    readStatus,
    expireTimer,
    expirationStartTimestamp,
    attachments
  } = data;
  let { seenStatus } = data;
  if (attachments) {
    (0, import_assert.strictAssert)(attachments.every((attachment) => !attachment.data), "Attempting to save a hydrated message");
  }
  if (readStatus === import_MessageReadStatus.ReadStatus.Unread && seenStatus !== import_MessageSeenStatus.SeenStatus.Unseen) {
    log.warn(`saveMessage: Message ${id}/${type} is unread but had seenStatus=${seenStatus}. Forcing to UnseenStatus.Unseen.`);
    data = {
      ...data,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
    };
    seenStatus = import_MessageSeenStatus.SeenStatus.Unseen;
  }
  const payload = {
    id,
    json: (0, import_util.objectToJSON)(data),
    body: body || null,
    conversationId,
    expirationStartTimestamp: expirationStartTimestamp || null,
    expireTimer: expireTimer || null,
    hasAttachments: hasAttachments ? 1 : 0,
    hasFileAttachments: hasFileAttachments ? 1 : 0,
    hasVisualMediaAttachments: hasVisualMediaAttachments ? 1 : 0,
    isChangeCreatedByUs: groupV2Change?.from === ourUuid ? 1 : 0,
    isErased: isErased ? 1 : 0,
    isViewOnce: isViewOnce ? 1 : 0,
    received_at: received_at || null,
    schemaVersion: schemaVersion || 0,
    serverGuid: serverGuid || null,
    sent_at: sent_at || null,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    storyId: storyId || null,
    type: type || null,
    readStatus: readStatus ?? null,
    seenStatus: seenStatus ?? import_MessageSeenStatus.SeenStatus.NotApplicable
  };
  if (id && !forceSave) {
    prepare(db, `
      UPDATE messages SET
        id = $id,
        json = $json,

        body = $body,
        conversationId = $conversationId,
        expirationStartTimestamp = $expirationStartTimestamp,
        expireTimer = $expireTimer,
        hasAttachments = $hasAttachments,
        hasFileAttachments = $hasFileAttachments,
        hasVisualMediaAttachments = $hasVisualMediaAttachments,
        isChangeCreatedByUs = $isChangeCreatedByUs,
        isErased = $isErased,
        isViewOnce = $isViewOnce,
        received_at = $received_at,
        schemaVersion = $schemaVersion,
        serverGuid = $serverGuid,
        sent_at = $sent_at,
        source = $source,
        sourceUuid = $sourceUuid,
        sourceDevice = $sourceDevice,
        storyId = $storyId,
        type = $type,
        readStatus = $readStatus,
        seenStatus = $seenStatus
      WHERE id = $id;
      `).run(payload);
    if (jobToInsert) {
      insertJobSync(db, jobToInsert);
    }
    return id;
  }
  const toCreate = {
    ...data,
    id: id || import_UUID.UUID.generate().toString()
  };
  prepare(db, `
    INSERT INTO messages (
      id,
      json,

      body,
      conversationId,
      expirationStartTimestamp,
      expireTimer,
      hasAttachments,
      hasFileAttachments,
      hasVisualMediaAttachments,
      isChangeCreatedByUs,
      isErased,
      isViewOnce,
      received_at,
      schemaVersion,
      serverGuid,
      sent_at,
      source,
      sourceUuid,
      sourceDevice,
      storyId,
      type,
      readStatus,
      seenStatus
    ) values (
      $id,
      $json,

      $body,
      $conversationId,
      $expirationStartTimestamp,
      $expireTimer,
      $hasAttachments,
      $hasFileAttachments,
      $hasVisualMediaAttachments,
      $isChangeCreatedByUs,
      $isErased,
      $isViewOnce,
      $received_at,
      $schemaVersion,
      $serverGuid,
      $sent_at,
      $source,
      $sourceUuid,
      $sourceDevice,
      $storyId,
      $type,
      $readStatus,
      $seenStatus
    );
    `).run({
    ...payload,
    id: toCreate.id,
    json: (0, import_util.objectToJSON)(toCreate)
  });
  if (jobToInsert) {
    insertJobSync(db, jobToInsert);
  }
  return toCreate.id;
}
async function saveMessage(data, options) {
  return saveMessageSync(data, options);
}
async function saveMessages(arrayOfMessages, options) {
  const db = getInstance();
  db.transaction(() => {
    for (const message of arrayOfMessages) {
      (0, import_assert.assertSync)(saveMessageSync(message, { ...options, alreadyInTransaction: true }));
    }
  })();
}
async function removeMessage(id) {
  const db = getInstance();
  db.prepare("DELETE FROM messages WHERE id = $id;").run({ id });
}
function removeMessagesSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM messages
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
async function removeMessages(ids) {
  (0, import_util.batchMultiVarQuery)(getInstance(), ids, removeMessagesSync);
}
async function getMessageById(id) {
  const db = getInstance();
  return getMessageByIdSync(db, id);
}
function getMessageByIdSync(db, id) {
  const row = db.prepare("SELECT json FROM messages WHERE id = $id;").get({
    id
  });
  if (!row) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(row.json);
}
async function getMessagesById(messageIds) {
  const db = getInstance();
  return (0, import_util.batchMultiVarQuery)(db, messageIds, (batch) => {
    const query = db.prepare(`SELECT json FROM messages WHERE id IN (${Array(batch.length).fill("?").join(",")});`);
    const rows = query.all(batch);
    return rows.map((row) => (0, import_util.jsonToObject)(row.json));
  });
}
async function _getAllMessages() {
  const db = getInstance();
  const rows = db.prepare("SELECT json FROM messages ORDER BY id ASC;").all();
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function _removeAllMessages() {
  const db = getInstance();
  db.prepare("DELETE from messages;").run();
}
async function getAllMessageIds() {
  const db = getInstance();
  const rows = db.prepare("SELECT id FROM messages ORDER BY id ASC;").all();
  return rows.map((row) => row.id);
}
async function getMessageBySender({
  source,
  sourceUuid,
  sourceDevice,
  sent_at
}) {
  const db = getInstance();
  const rows = prepare(db, `
    SELECT json FROM messages WHERE
      (source = $source OR sourceUuid = $sourceUuid) AND
      sourceDevice = $sourceDevice AND
      sent_at = $sent_at
    LIMIT 2;
    `).all({
    source,
    sourceUuid,
    sourceDevice,
    sent_at
  });
  if (rows.length > 1) {
    log.warn("getMessageBySender: More than one message found for", {
      sent_at,
      source,
      sourceUuid,
      sourceDevice
    });
  }
  if (rows.length < 1) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(rows[0].json);
}
function _storyIdPredicate(storyId, isGroup) {
  if (!isGroup && storyId === void 0) {
    return "$storyId IS NULL";
  }
  return "storyId IS $storyId";
}
async function getUnreadByConversationAndMarkRead({
  conversationId,
  isGroup,
  newestUnreadAt,
  storyId,
  readAt
}) {
  const db = getInstance();
  return db.transaction(() => {
    const expirationStartTimestamp = Math.min(Date.now(), readAt ?? Infinity);
    db.prepare(`
      UPDATE messages
      INDEXED BY expiring_message_by_conversation_and_received_at
      SET
        expirationStartTimestamp = $expirationStartTimestamp,
        json = json_patch(json, $jsonPatch)
      WHERE
        conversationId = $conversationId AND
        (${_storyIdPredicate(storyId, isGroup)}) AND
        isStory IS 0 AND
        type IS 'incoming' AND
        (
          expirationStartTimestamp IS NULL OR
          expirationStartTimestamp > $expirationStartTimestamp
        ) AND
        expireTimer > 0 AND
        received_at <= $newestUnreadAt;
      `).run({
      conversationId,
      expirationStartTimestamp,
      jsonPatch: JSON.stringify({ expirationStartTimestamp }),
      newestUnreadAt,
      storyId: storyId || null
    });
    const rows = db.prepare(`
        SELECT id, json FROM messages
        WHERE
          conversationId = $conversationId AND
          seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
          isStory = 0 AND
          (${_storyIdPredicate(storyId, isGroup)}) AND
          received_at <= $newestUnreadAt
        ORDER BY received_at DESC, sent_at DESC;
        `).all({
      conversationId,
      newestUnreadAt,
      storyId: storyId || null
    });
    db.prepare(`
        UPDATE messages
        SET
          readStatus = ${import_MessageReadStatus.ReadStatus.Read},
          seenStatus = ${import_MessageSeenStatus.SeenStatus.Seen},
          json = json_patch(json, $jsonPatch)
        WHERE
          conversationId = $conversationId AND
          seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
          isStory = 0 AND
          (${_storyIdPredicate(storyId, isGroup)}) AND
          received_at <= $newestUnreadAt;
        `).run({
      conversationId,
      jsonPatch: JSON.stringify({
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Seen
      }),
      newestUnreadAt,
      storyId: storyId || null
    });
    return rows.map((row) => {
      const json = (0, import_util.jsonToObject)(row.json);
      return {
        originalReadStatus: json.readStatus,
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Seen,
        ...(0, import_lodash.pick)(json, [
          "expirationStartTimestamp",
          "id",
          "sent_at",
          "source",
          "sourceUuid",
          "type"
        ])
      };
    });
  })();
}
async function getUnreadReactionsAndMarkRead({
  conversationId,
  newestUnreadAt,
  storyId
}) {
  const db = getInstance();
  return db.transaction(() => {
    const unreadMessages = db.prepare(`
        SELECT reactions.rowid, targetAuthorUuid, targetTimestamp, messageId
        FROM reactions
        JOIN messages on messages.id IS reactions.messageId
        WHERE
          unread > 0 AND
          messages.conversationId IS $conversationId AND
          messages.received_at <= $newestUnreadAt AND
          messages.storyId IS $storyId
        ORDER BY messageReceivedAt DESC;
      `).all({
      conversationId,
      newestUnreadAt,
      storyId: storyId || null
    });
    const idsToUpdate = unreadMessages.map((item) => item.rowid);
    (0, import_util.batchMultiVarQuery)(db, idsToUpdate, (ids) => {
      db.prepare(`
        UPDATE reactions SET
        unread = 0 WHERE rowid IN ( ${ids.map(() => "?").join(", ")} );
        `).run(ids);
    });
    return unreadMessages;
  })();
}
async function markReactionAsRead(targetAuthorUuid, targetTimestamp) {
  const db = getInstance();
  return db.transaction(() => {
    const readReaction = db.prepare(`
          SELECT *
          FROM reactions
          WHERE
            targetAuthorUuid = $targetAuthorUuid AND
            targetTimestamp = $targetTimestamp AND
            unread = 1
          ORDER BY rowId DESC
          LIMIT 1;
        `).get({
      targetAuthorUuid,
      targetTimestamp
    });
    db.prepare(`
        UPDATE reactions SET
        unread = 0 WHERE
        targetAuthorUuid = $targetAuthorUuid AND
        targetTimestamp = $targetTimestamp;
      `).run({
      targetAuthorUuid,
      targetTimestamp
    });
    return readReaction;
  })();
}
async function addReaction({
  conversationId,
  emoji,
  fromId,
  messageId,
  messageReceivedAt,
  targetAuthorUuid,
  targetTimestamp
}) {
  const db = getInstance();
  await db.prepare(`INSERT INTO reactions (
      conversationId,
      emoji,
      fromId,
      messageId,
      messageReceivedAt,
      targetAuthorUuid,
      targetTimestamp,
      unread
    ) VALUES (
      $conversationId,
      $emoji,
      $fromId,
      $messageId,
      $messageReceivedAt,
      $targetAuthorUuid,
      $targetTimestamp,
      $unread
    );`).run({
    conversationId,
    emoji,
    fromId,
    messageId,
    messageReceivedAt,
    targetAuthorUuid,
    targetTimestamp,
    unread: 1
  });
}
async function removeReactionFromConversation({
  emoji,
  fromId,
  targetAuthorUuid,
  targetTimestamp
}) {
  const db = getInstance();
  await db.prepare(`DELETE FROM reactions WHERE
      emoji = $emoji AND
      fromId = $fromId AND
      targetAuthorUuid = $targetAuthorUuid AND
      targetTimestamp = $targetTimestamp;`).run({
    emoji,
    fromId,
    targetAuthorUuid,
    targetTimestamp
  });
}
async function _getAllReactions() {
  const db = getInstance();
  return db.prepare("SELECT * from reactions;").all();
}
async function _removeAllReactions() {
  const db = getInstance();
  db.prepare("DELETE from reactions;").run();
}
async function getOlderMessagesByConversation(conversationId, options) {
  return getOlderMessagesByConversationSync(conversationId, options);
}
function getOlderMessagesByConversationSync(conversationId, {
  isGroup,
  limit = 100,
  messageId,
  receivedAt = Number.MAX_VALUE,
  sentAt = Number.MAX_VALUE,
  storyId
}) {
  const db = getInstance();
  return db.prepare(`
      SELECT json FROM messages WHERE
        conversationId = $conversationId AND
        ($messageId IS NULL OR id IS NOT $messageId) AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)}) AND
        (
          (received_at = $received_at AND sent_at < $sent_at) OR
          received_at < $received_at
        )
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit,
    messageId: messageId || null,
    received_at: receivedAt,
    sent_at: sentAt,
    storyId: storyId || null
  }).reverse();
}
async function getOlderStories({
  conversationId,
  limit = 9999,
  receivedAt = Number.MAX_VALUE,
  sentAt,
  sourceUuid
}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE
        type IS 'story' AND
        ($conversationId IS NULL OR conversationId IS $conversationId) AND
        ($sourceUuid IS NULL OR sourceUuid IS $sourceUuid) AND
        (received_at < $receivedAt
          OR (received_at IS $receivedAt AND sent_at < $sentAt)
        )
      ORDER BY received_at ASC, sent_at ASC
      LIMIT $limit;
      `).all({
    conversationId: conversationId || null,
    receivedAt,
    sentAt: sentAt || null,
    sourceUuid: sourceUuid || null,
    limit
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getNewerMessagesByConversation(conversationId, options) {
  return getNewerMessagesByConversationSync(conversationId, options);
}
function getNewerMessagesByConversationSync(conversationId, {
  isGroup,
  limit = 100,
  receivedAt = 0,
  sentAt = 0,
  storyId
}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)}) AND
        (
          (received_at = $received_at AND sent_at > $sent_at) OR
          received_at > $received_at
        )
      ORDER BY received_at ASC, sent_at ASC
      LIMIT $limit;
      `).all({
    conversationId,
    limit,
    received_at: receivedAt,
    sent_at: sentAt,
    storyId: storyId || null
  });
  return rows;
}
function getOldestMessageForConversation(conversationId, storyId, isGroup) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)})
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
function getNewestMessageForConversation(conversationId, storyId, isGroup) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)})
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
function getLastConversationActivity({
  conversationId,
  isGroup,
  ourUuid
}) {
  const db = getInstance();
  const row = prepare(db, `
      SELECT json FROM messages
      WHERE
        conversationId = $conversationId AND
        shouldAffectActivity IS 1 AND
        isTimerChangeFromSync IS 0 AND
        ${isGroup ? "storyId IS NULL AND" : ""}
        isGroupLeaveEventFromOther IS 0
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    ourUuid
  });
  if (!row) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(row.json);
}
function getLastConversationPreview({
  conversationId,
  isGroup
}) {
  const db = getInstance();
  const row = prepare(db, `
      SELECT json FROM messages
      WHERE
        conversationId = $conversationId AND
        shouldAffectPreview IS 1 AND
        isGroupLeaveEventFromOther IS 0 AND
        ${isGroup ? "storyId IS NULL AND" : ""}
        (
          expiresAt IS NULL
          OR
          expiresAt > $now
        )
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    now: Date.now()
  });
  if (!row) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(row.json);
}
async function getConversationMessageStats({
  conversationId,
  isGroup,
  ourUuid
}) {
  const db = getInstance();
  return db.transaction(() => {
    return {
      activity: getLastConversationActivity({
        conversationId,
        isGroup,
        ourUuid
      }),
      preview: getLastConversationPreview({ conversationId, isGroup }),
      hasUserInitiatedMessages: hasUserInitiatedMessages(conversationId)
    };
  })();
}
async function getLastConversationMessage({
  conversationId
}) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId
  });
  if (!row) {
    return void 0;
  }
  return (0, import_util.jsonToObject)(row.json);
}
function getOldestUnseenMessageForConversation(conversationId, storyId, isGroup) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)})
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
async function getTotalUnreadForConversation(conversationId, options) {
  return getTotalUnreadForConversationSync(conversationId, options);
}
function getTotalUnreadForConversationSync(conversationId, {
  storyId,
  isGroup
}) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT count(id)
      FROM messages
      WHERE
        conversationId = $conversationId AND
        readStatus = ${import_MessageReadStatus.ReadStatus.Unread} AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)})
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    throw new Error("getTotalUnreadForConversation: Unable to get count");
  }
  return row["count(id)"];
}
function getTotalUnseenForConversationSync(conversationId, storyId, isGroup) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT count(id)
      FROM messages
      WHERE
        conversationId = $conversationId AND
        seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
        isStory IS 0 AND
        (${_storyIdPredicate(storyId, isGroup)})
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    throw new Error("getTotalUnseenForConversationSync: Unable to get count");
  }
  return row["count(id)"];
}
async function getMessageMetricsForConversation(conversationId, storyId, isGroup) {
  return getMessageMetricsForConversationSync(conversationId, storyId, isGroup);
}
function getMessageMetricsForConversationSync(conversationId, storyId, isGroup) {
  const oldest = getOldestMessageForConversation(conversationId, storyId, isGroup);
  const newest = getNewestMessageForConversation(conversationId, storyId, isGroup);
  const oldestUnseen = getOldestUnseenMessageForConversation(conversationId, storyId, isGroup);
  const totalUnseen = getTotalUnseenForConversationSync(conversationId, storyId, isGroup);
  return {
    oldest: oldest ? (0, import_lodash.pick)(oldest, ["received_at", "sent_at", "id"]) : void 0,
    newest: newest ? (0, import_lodash.pick)(newest, ["received_at", "sent_at", "id"]) : void 0,
    oldestUnseen: oldestUnseen ? (0, import_lodash.pick)(oldestUnseen, ["received_at", "sent_at", "id"]) : void 0,
    totalUnseen
  };
}
async function getConversationRangeCenteredOnMessage({
  conversationId,
  isGroup,
  limit,
  messageId,
  receivedAt,
  sentAt,
  storyId
}) {
  const db = getInstance();
  return db.transaction(() => {
    return {
      older: getOlderMessagesByConversationSync(conversationId, {
        isGroup,
        limit,
        messageId,
        receivedAt,
        sentAt,
        storyId
      }),
      newer: getNewerMessagesByConversationSync(conversationId, {
        isGroup,
        limit,
        receivedAt,
        sentAt,
        storyId
      }),
      metrics: getMessageMetricsForConversationSync(conversationId, storyId, isGroup)
    };
  })();
}
async function hasGroupCallHistoryMessage(conversationId, eraId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT count(*) FROM messages
      WHERE conversationId = $conversationId
      AND type = 'call-history'
      AND json_extract(json, '$.callHistoryDetails.callMode') = 'Group'
      AND json_extract(json, '$.callHistoryDetails.eraId') = $eraId
      LIMIT 1;
      `).get({
    conversationId,
    eraId
  });
  if (row) {
    return Boolean(row["count(*)"]);
  }
  return false;
}
async function migrateConversationMessages(obsoleteId, currentId) {
  const db = getInstance();
  db.prepare(`
    UPDATE messages SET
      conversationId = $currentId,
      json = json_set(json, '$.conversationId', $currentId)
    WHERE conversationId = $obsoleteId;
    `).run({
    obsoleteId,
    currentId
  });
}
async function getMessagesBySentAt(sentAt) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages
      WHERE sent_at = $sent_at
      ORDER BY received_at DESC, sent_at DESC;
      `).all({
    sent_at: sentAt
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getExpiredMessages() {
  const db = getInstance();
  const now = Date.now();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        expiresAt IS NOT NULL AND
        expiresAt <= $now
      ORDER BY expiresAt ASC;
      `).all({ now });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getMessagesUnexpectedlyMissingExpirationStartTimestamp() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages
      INDEXED BY messages_unexpectedly_missing_expiration_start_timestamp
      WHERE
        expireTimer > 0 AND
        expirationStartTimestamp IS NULL AND
        (
          type IS 'outgoing' OR
          (type IS 'incoming' AND (
            readStatus = ${import_MessageReadStatus.ReadStatus.Read} OR
            readStatus = ${import_MessageReadStatus.ReadStatus.Viewed} OR
            readStatus IS NULL
          ))
        );
      `).all();
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getSoonestMessageExpiry() {
  const db = getInstance();
  const result = db.prepare(`
      SELECT MIN(expiresAt)
      FROM messages;
      `).pluck(true).get();
  return result || void 0;
}
async function getNextTapToViewMessageTimestampToAgeOut() {
  const db = getInstance();
  const row = db.prepare(`
      SELECT json FROM messages
      WHERE
        isViewOnce = 1
        AND (isErased IS NULL OR isErased != 1)
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get();
  if (!row) {
    return void 0;
  }
  const data = (0, import_util.jsonToObject)(row.json);
  const result = data.received_at_ms || data.received_at;
  return (0, import_isNormalNumber.isNormalNumber)(result) ? result : void 0;
}
async function getTapToViewMessagesNeedingErase() {
  const db = getInstance();
  const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1e3;
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE
        isViewOnce = 1
        AND (isErased IS NULL OR isErased != 1)
        AND received_at <= $THIRTY_DAYS_AGO
      ORDER BY received_at ASC, sent_at ASC;
      `).all({
    THIRTY_DAYS_AGO
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
const MAX_UNPROCESSED_ATTEMPTS = 3;
function saveUnprocessedSync(data) {
  const db = getInstance();
  const {
    id,
    timestamp,
    receivedAtCounter,
    version,
    attempts,
    envelope,
    source,
    sourceUuid,
    sourceDevice,
    serverGuid,
    serverTimestamp,
    decrypted,
    urgent
  } = data;
  if (!id) {
    throw new Error("saveUnprocessedSync: id was falsey");
  }
  if (attempts >= MAX_UNPROCESSED_ATTEMPTS) {
    removeUnprocessedSync(id);
    return id;
  }
  prepare(db, `
    INSERT OR REPLACE INTO unprocessed (
      id,
      timestamp,
      receivedAtCounter,
      version,
      attempts,
      envelope,
      source,
      sourceUuid,
      sourceDevice,
      serverGuid,
      serverTimestamp,
      decrypted,
      urgent
    ) values (
      $id,
      $timestamp,
      $receivedAtCounter,
      $version,
      $attempts,
      $envelope,
      $source,
      $sourceUuid,
      $sourceDevice,
      $serverGuid,
      $serverTimestamp,
      $decrypted,
      $urgent
    );
    `).run({
    id,
    timestamp,
    receivedAtCounter: receivedAtCounter ?? null,
    version,
    attempts,
    envelope: envelope || null,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    serverGuid: serverGuid || null,
    serverTimestamp: serverTimestamp || null,
    decrypted: decrypted || null,
    urgent: urgent || !(0, import_lodash.isBoolean)(urgent) ? 1 : 0
  });
  return id;
}
function updateUnprocessedWithDataSync(id, data) {
  const db = getInstance();
  const {
    source,
    sourceUuid,
    sourceDevice,
    serverGuid,
    serverTimestamp,
    decrypted
  } = data;
  prepare(db, `
    UPDATE unprocessed SET
      source = $source,
      sourceUuid = $sourceUuid,
      sourceDevice = $sourceDevice,
      serverGuid = $serverGuid,
      serverTimestamp = $serverTimestamp,
      decrypted = $decrypted
    WHERE id = $id;
    `).run({
    id,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    serverGuid: serverGuid || null,
    serverTimestamp: serverTimestamp || null,
    decrypted: decrypted || null
  });
}
async function updateUnprocessedWithData(id, data) {
  return updateUnprocessedWithDataSync(id, data);
}
async function updateUnprocessedsWithData(arrayOfUnprocessed) {
  const db = getInstance();
  db.transaction(() => {
    for (const { id, data } of arrayOfUnprocessed) {
      (0, import_assert.assertSync)(updateUnprocessedWithDataSync(id, data));
    }
  })();
}
async function getUnprocessedById(id) {
  const db = getInstance();
  const row = db.prepare("SELECT * FROM unprocessed WHERE id = $id;").get({
    id
  });
  return {
    ...row,
    urgent: (0, import_lodash.isNumber)(row.urgent) ? Boolean(row.urgent) : true
  };
}
async function getUnprocessedCount() {
  return (0, import_util.getCountFromTable)(getInstance(), "unprocessed");
}
async function getAllUnprocessedAndIncrementAttempts() {
  const db = getInstance();
  return db.transaction(() => {
    const { changes: deletedStaleCount } = db.prepare("DELETE FROM unprocessed WHERE timestamp < $monthAgo").run({
      monthAgo: Date.now() - durations.MONTH
    });
    if (deletedStaleCount !== 0) {
      logger.warn(`getAllUnprocessedAndIncrementAttempts: deleting ${deletedStaleCount} old unprocessed envelopes`);
    }
    db.prepare(`
        UPDATE unprocessed
        SET attempts = attempts + 1
      `).run();
    const { changes: deletedInvalidCount } = db.prepare(`
          DELETE FROM unprocessed
          WHERE attempts >= $MAX_UNPROCESSED_ATTEMPTS
        `).run({ MAX_UNPROCESSED_ATTEMPTS });
    if (deletedInvalidCount !== 0) {
      logger.warn(`getAllUnprocessedAndIncrementAttempts: deleting ${deletedInvalidCount} invalid unprocessed envelopes`);
    }
    return db.prepare(`
          SELECT *
          FROM unprocessed
          ORDER BY receivedAtCounter ASC;
        `).all().map((row) => ({
      ...row,
      urgent: (0, import_lodash.isNumber)(row.urgent) ? Boolean(row.urgent) : true
    }));
  })();
}
function removeUnprocessedsSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM unprocessed
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
function removeUnprocessedSync(id) {
  const db = getInstance();
  if (!Array.isArray(id)) {
    prepare(db, "DELETE FROM unprocessed WHERE id = $id;").run({ id });
    return;
  }
  if (!id.length) {
    return;
  }
  (0, import_assert.assertSync)((0, import_util.batchMultiVarQuery)(db, id, removeUnprocessedsSync));
}
async function removeUnprocessed(id) {
  removeUnprocessedSync(id);
}
async function removeAllUnprocessed() {
  const db = getInstance();
  db.prepare("DELETE FROM unprocessed;").run();
}
const ATTACHMENT_DOWNLOADS_TABLE = "attachment_downloads";
async function getAttachmentDownloadJobById(id) {
  return (0, import_util.getById)(getInstance(), ATTACHMENT_DOWNLOADS_TABLE, id);
}
async function getNextAttachmentDownloadJobs(limit, options = {}) {
  const db = getInstance();
  const timestamp = options && options.timestamp ? options.timestamp : Date.now();
  const rows = db.prepare(`
      SELECT json
      FROM attachment_downloads
      WHERE pending = 0 AND timestamp <= $timestamp
      ORDER BY timestamp DESC
      LIMIT $limit;
      `).all({
    limit: limit || 3,
    timestamp
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function saveAttachmentDownloadJob(job) {
  const db = getInstance();
  const { id, pending, timestamp } = job;
  if (!id) {
    throw new Error("saveAttachmentDownloadJob: Provided job did not have a truthy id");
  }
  db.prepare(`
    INSERT OR REPLACE INTO attachment_downloads (
      id,
      pending,
      timestamp,
      json
    ) values (
      $id,
      $pending,
      $timestamp,
      $json
    )
    `).run({
    id,
    pending,
    timestamp,
    json: (0, import_util.objectToJSON)(job)
  });
}
async function setAttachmentDownloadJobPending(id, pending) {
  const db = getInstance();
  db.prepare(`
    UPDATE attachment_downloads
    SET pending = $pending
    WHERE id = $id;
    `).run({
    id,
    pending: pending ? 1 : 0
  });
}
async function resetAttachmentDownloadPending() {
  const db = getInstance();
  db.prepare(`
    UPDATE attachment_downloads
    SET pending = 0
    WHERE pending != 0;
    `).run();
}
async function removeAttachmentDownloadJob(id) {
  return (0, import_util.removeById)(getInstance(), ATTACHMENT_DOWNLOADS_TABLE, id);
}
async function removeAllAttachmentDownloadJobs() {
  return (0, import_util.removeAllFromTable)(getInstance(), ATTACHMENT_DOWNLOADS_TABLE);
}
async function createOrUpdateStickerPack(pack) {
  const db = getInstance();
  const {
    attemptedStatus,
    author,
    coverStickerId,
    createdAt,
    downloadAttempts,
    id,
    installedAt,
    key,
    lastUsed,
    status,
    stickerCount,
    title,
    storageID,
    storageVersion,
    storageUnknownFields,
    storageNeedsSync
  } = pack;
  if (!id) {
    throw new Error("createOrUpdateStickerPack: Provided data did not have a truthy id");
  }
  let { position } = pack;
  if (!(0, import_lodash.isNumber)(position)) {
    position = db.prepare(`
        SELECT IFNULL(MAX(position) + 1, 0)
        FROM sticker_packs
        `).pluck().get();
  }
  const row = db.prepare(`
      SELECT id
      FROM sticker_packs
      WHERE id = $id;
      `).get({ id });
  const payload = {
    attemptedStatus: attemptedStatus ?? null,
    author,
    coverStickerId,
    createdAt: createdAt || Date.now(),
    downloadAttempts: downloadAttempts || 1,
    id,
    installedAt: installedAt ?? null,
    key,
    lastUsed: lastUsed || null,
    status,
    stickerCount,
    title,
    position: position ?? 0,
    storageID: storageID ?? null,
    storageVersion: storageVersion ?? null,
    storageUnknownFields: storageUnknownFields ?? null,
    storageNeedsSync: storageNeedsSync ? 1 : 0
  };
  if (row) {
    db.prepare(`
      UPDATE sticker_packs SET
        attemptedStatus = $attemptedStatus,
        author = $author,
        coverStickerId = $coverStickerId,
        createdAt = $createdAt,
        downloadAttempts = $downloadAttempts,
        installedAt = $installedAt,
        key = $key,
        lastUsed = $lastUsed,
        status = $status,
        stickerCount = $stickerCount,
        title = $title,
        position = $position,
        storageID = $storageID,
        storageVersion = $storageVersion,
        storageUnknownFields = $storageUnknownFields,
        storageNeedsSync = $storageNeedsSync
      WHERE id = $id;
      `).run(payload);
    return;
  }
  db.prepare(`
    INSERT INTO sticker_packs (
      attemptedStatus,
      author,
      coverStickerId,
      createdAt,
      downloadAttempts,
      id,
      installedAt,
      key,
      lastUsed,
      status,
      stickerCount,
      title,
      position,
      storageID,
      storageVersion,
      storageUnknownFields,
      storageNeedsSync
    ) values (
      $attemptedStatus,
      $author,
      $coverStickerId,
      $createdAt,
      $downloadAttempts,
      $id,
      $installedAt,
      $key,
      $lastUsed,
      $status,
      $stickerCount,
      $title,
      $position,
      $storageID,
      $storageVersion,
      $storageUnknownFields,
      $storageNeedsSync
    )
    `).run(payload);
}
function updateStickerPackStatusSync(id, status, options) {
  const db = getInstance();
  const timestamp = options ? options.timestamp || Date.now() : Date.now();
  const installedAt = status === "installed" ? timestamp : null;
  db.prepare(`
    UPDATE sticker_packs
    SET status = $status, installedAt = $installedAt
    WHERE id = $id;
    `).run({
    id,
    status,
    installedAt
  });
}
async function updateStickerPackStatus(id, status, options) {
  return updateStickerPackStatusSync(id, status, options);
}
async function updateStickerPackInfo({
  id,
  storageID,
  storageVersion,
  storageUnknownFields,
  storageNeedsSync,
  uninstalledAt
}) {
  const db = getInstance();
  if (uninstalledAt) {
    db.prepare(`
      UPDATE uninstalled_sticker_packs
      SET
        storageID = $storageID,
        storageVersion = $storageVersion,
        storageUnknownFields = $storageUnknownFields,
        storageNeedsSync = $storageNeedsSync
      WHERE id = $id;
      `).run({
      id,
      storageID: storageID ?? null,
      storageVersion: storageVersion ?? null,
      storageUnknownFields: storageUnknownFields ?? null,
      storageNeedsSync: storageNeedsSync ? 1 : 0
    });
  } else {
    db.prepare(`
      UPDATE sticker_packs
      SET
        storageID = $storageID,
        storageVersion = $storageVersion,
        storageUnknownFields = $storageUnknownFields,
        storageNeedsSync = $storageNeedsSync
      WHERE id = $id;
      `).run({
      id,
      storageID: storageID ?? null,
      storageVersion: storageVersion ?? null,
      storageUnknownFields: storageUnknownFields ?? null,
      storageNeedsSync: storageNeedsSync ? 1 : 0
    });
  }
}
async function clearAllErrorStickerPackAttempts() {
  const db = getInstance();
  db.prepare(`
    UPDATE sticker_packs
    SET downloadAttempts = 0
    WHERE status = 'error';
    `).run();
}
async function createOrUpdateSticker(sticker) {
  const db = getInstance();
  const { emoji, height, id, isCoverOnly, lastUsed, packId, path, width } = sticker;
  if (!(0, import_lodash.isNumber)(id)) {
    throw new Error("createOrUpdateSticker: Provided data did not have a numeric id");
  }
  if (!packId) {
    throw new Error("createOrUpdateSticker: Provided data did not have a truthy id");
  }
  db.prepare(`
    INSERT OR REPLACE INTO stickers (
      emoji,
      height,
      id,
      isCoverOnly,
      lastUsed,
      packId,
      path,
      width
    ) values (
      $emoji,
      $height,
      $id,
      $isCoverOnly,
      $lastUsed,
      $packId,
      $path,
      $width
    )
    `).run({
    emoji: emoji ?? null,
    height,
    id,
    isCoverOnly: isCoverOnly ? 1 : 0,
    lastUsed: lastUsed || null,
    packId,
    path,
    width
  });
}
async function updateStickerLastUsed(packId, stickerId, lastUsed) {
  const db = getInstance();
  db.prepare(`
    UPDATE stickers
    SET lastUsed = $lastUsed
    WHERE id = $id AND packId = $packId;
    `).run({
    id: stickerId,
    packId,
    lastUsed
  });
  db.prepare(`
    UPDATE sticker_packs
    SET lastUsed = $lastUsed
    WHERE id = $id;
    `).run({
    id: packId,
    lastUsed
  });
}
async function addStickerPackReference(messageId, packId) {
  const db = getInstance();
  if (!messageId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy messageId");
  }
  if (!packId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy packId");
  }
  db.prepare(`
    INSERT OR REPLACE INTO sticker_references (
      messageId,
      packId
    ) values (
      $messageId,
      $packId
    )
    `).run({
    messageId,
    packId
  });
}
async function deleteStickerPackReference(messageId, packId) {
  const db = getInstance();
  if (!messageId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy messageId");
  }
  if (!packId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy packId");
  }
  return db.transaction(() => {
    db.prepare(`
        DELETE FROM sticker_references
        WHERE messageId = $messageId AND packId = $packId;
        `).run({
      messageId,
      packId
    });
    const countRow = db.prepare(`
          SELECT count(*) FROM sticker_references
          WHERE packId = $packId;
          `).get({ packId });
    if (!countRow) {
      throw new Error("deleteStickerPackReference: Unable to get count of references");
    }
    const count = countRow["count(*)"];
    if (count > 0) {
      return void 0;
    }
    const packRow = db.prepare(`
          SELECT status FROM sticker_packs
          WHERE id = $packId;
          `).get({ packId });
    if (!packRow) {
      logger.warn("deleteStickerPackReference: did not find referenced pack");
      return void 0;
    }
    const { status } = packRow;
    if (status === "installed") {
      return void 0;
    }
    const stickerPathRows = db.prepare(`
          SELECT path FROM stickers
          WHERE packId = $packId;
          `).all({
      packId
    });
    db.prepare(`
        DELETE FROM sticker_packs
        WHERE id = $packId;
        `).run({
      packId
    });
    return (stickerPathRows || []).map((row) => row.path);
  }).immediate();
}
async function deleteStickerPack(packId) {
  const db = getInstance();
  if (!packId) {
    throw new Error("deleteStickerPack: Provided data did not have a truthy packId");
  }
  return db.transaction(() => {
    const stickerPathRows = db.prepare(`
          SELECT path FROM stickers
          WHERE packId = $packId;
          `).all({
      packId
    });
    db.prepare(`
        DELETE FROM sticker_packs
        WHERE id = $packId;
        `).run({ packId });
    return (stickerPathRows || []).map((row) => row.path);
  }).immediate();
}
async function getStickerCount() {
  return (0, import_util.getCountFromTable)(getInstance(), "stickers");
}
async function getAllStickerPacks() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT * FROM sticker_packs
      ORDER BY position ASC, id ASC
      `).all();
  return rows || [];
}
function addUninstalledStickerPackSync(pack) {
  const db = getInstance();
  db.prepare(`
        INSERT OR REPLACE INTO uninstalled_sticker_packs
        (
          id, uninstalledAt, storageID, storageVersion, storageUnknownFields,
          storageNeedsSync
        )
        VALUES
        (
          $id, $uninstalledAt, $storageID, $storageVersion, $unknownFields,
          $storageNeedsSync
        )
      `).run({
    id: pack.id,
    uninstalledAt: pack.uninstalledAt,
    storageID: pack.storageID ?? null,
    storageVersion: pack.storageVersion ?? null,
    unknownFields: pack.storageUnknownFields ?? null,
    storageNeedsSync: pack.storageNeedsSync ? 1 : 0
  });
}
async function addUninstalledStickerPack(pack) {
  return addUninstalledStickerPackSync(pack);
}
function removeUninstalledStickerPackSync(packId) {
  const db = getInstance();
  db.prepare("DELETE FROM uninstalled_sticker_packs WHERE id IS $id").run({ id: packId });
}
async function removeUninstalledStickerPack(packId) {
  return removeUninstalledStickerPackSync(packId);
}
async function getUninstalledStickerPacks() {
  const db = getInstance();
  const rows = db.prepare("SELECT * FROM uninstalled_sticker_packs ORDER BY id ASC").all();
  return rows || [];
}
async function getInstalledStickerPacks() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT *
      FROM sticker_packs
      WHERE
        status IS "installed" OR
        storageID IS NOT NULL
      ORDER BY id ASC
      `).all();
  return rows || [];
}
async function getStickerPackInfo(packId) {
  const db = getInstance();
  return db.transaction(() => {
    const uninstalled = db.prepare(`
        SELECT * FROM uninstalled_sticker_packs
        WHERE id IS $packId
        `).get({ packId });
    if (uninstalled) {
      return uninstalled;
    }
    const installed = db.prepare(`
        SELECT
          id, key, position, storageID, storageVersion, storageUnknownFields
        FROM sticker_packs
        WHERE id IS $packId
        `).get({ packId });
    if (installed) {
      return installed;
    }
    return void 0;
  })();
}
async function installStickerPack(packId, timestamp) {
  const db = getInstance();
  return db.transaction(() => {
    const status = "installed";
    updateStickerPackStatusSync(packId, status, { timestamp });
    removeUninstalledStickerPackSync(packId);
  })();
}
async function uninstallStickerPack(packId, timestamp) {
  const db = getInstance();
  return db.transaction(() => {
    const status = "downloaded";
    updateStickerPackStatusSync(packId, status);
    db.prepare(`
      UPDATE sticker_packs SET
        storageID = NULL,
        storageVersion = NULL,
        storageUnknownFields = NULL,
        storageNeedsSync = 0
      WHERE id = $packId;
      `).run({ packId });
    addUninstalledStickerPackSync({
      id: packId,
      uninstalledAt: timestamp,
      storageNeedsSync: true
    });
  })();
}
async function getAllStickers() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT * FROM stickers
      ORDER BY packId ASC, id ASC
      `).all();
  return (rows || []).map((row) => rowToSticker(row));
}
async function getRecentStickers({ limit } = {}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT stickers.* FROM stickers
      JOIN sticker_packs on stickers.packId = sticker_packs.id
      WHERE stickers.lastUsed > 0 AND sticker_packs.status = 'installed'
      ORDER BY stickers.lastUsed DESC
      LIMIT $limit
      `).all({
    limit: limit || 24
  });
  return (rows || []).map((row) => rowToSticker(row));
}
async function updateEmojiUsage(shortName, timeUsed = Date.now()) {
  const db = getInstance();
  db.transaction(() => {
    const rows = db.prepare(`
        SELECT * FROM emojis
        WHERE shortName = $shortName;
        `).get({
      shortName
    });
    if (rows) {
      db.prepare(`
        UPDATE emojis
        SET lastUsage = $timeUsed
        WHERE shortName = $shortName;
        `).run({ shortName, timeUsed });
    } else {
      db.prepare(`
        INSERT INTO emojis(shortName, lastUsage)
        VALUES ($shortName, $timeUsed);
        `).run({ shortName, timeUsed });
    }
  })();
}
async function getRecentEmojis(limit = 32) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT *
      FROM emojis
      ORDER BY lastUsage DESC
      LIMIT $limit;
      `).all({ limit });
  return rows || [];
}
async function getAllBadges() {
  const db = getInstance();
  const [badgeRows, badgeImageFileRows] = db.transaction(() => [
    db.prepare("SELECT * FROM badges").all(),
    db.prepare("SELECT * FROM badgeImageFiles").all()
  ])();
  const badgeImagesByBadge = /* @__PURE__ */ new Map();
  for (const badgeImageFileRow of badgeImageFileRows) {
    const { badgeId, order, localPath, url, theme } = badgeImageFileRow;
    const badgeImages = badgeImagesByBadge.get(badgeId) || [];
    badgeImages[order] = {
      ...badgeImages[order] || {},
      [(0, import_BadgeImageTheme.parseBadgeImageTheme)(theme)]: {
        localPath: (0, import_dropNull.dropNull)(localPath),
        url
      }
    };
    badgeImagesByBadge.set(badgeId, badgeImages);
  }
  return badgeRows.map((badgeRow) => ({
    id: badgeRow.id,
    category: (0, import_BadgeCategory.parseBadgeCategory)(badgeRow.category),
    name: badgeRow.name,
    descriptionTemplate: badgeRow.descriptionTemplate,
    images: (badgeImagesByBadge.get(badgeRow.id) || []).filter(import_isNotNil.isNotNil)
  }));
}
async function updateOrCreateBadges(badges) {
  const db = getInstance();
  const insertBadge = prepare(db, `
    INSERT OR REPLACE INTO badges (
      id,
      category,
      name,
      descriptionTemplate
    ) VALUES (
      $id,
      $category,
      $name,
      $descriptionTemplate
    );
    `);
  const getImageFilesForBadge = prepare(db, "SELECT url, localPath FROM badgeImageFiles WHERE badgeId = $badgeId");
  const insertBadgeImageFile = prepare(db, `
    INSERT INTO badgeImageFiles (
      badgeId,
      'order',
      url,
      localPath,
      theme
    ) VALUES (
      $badgeId,
      $order,
      $url,
      $localPath,
      $theme
    );
    `);
  db.transaction(() => {
    badges.forEach((badge) => {
      const { id: badgeId } = badge;
      const oldLocalPaths = /* @__PURE__ */ new Map();
      for (const { url, localPath } of getImageFilesForBadge.all({ badgeId })) {
        if (localPath) {
          oldLocalPaths.set(url, localPath);
        }
      }
      insertBadge.run({
        id: badgeId,
        category: badge.category,
        name: badge.name,
        descriptionTemplate: badge.descriptionTemplate
      });
      for (const [order, image] of badge.images.entries()) {
        for (const [theme, imageFile] of Object.entries(image)) {
          insertBadgeImageFile.run({
            badgeId,
            localPath: imageFile.localPath || oldLocalPaths.get(imageFile.url) || null,
            order,
            theme,
            url: imageFile.url
          });
        }
      }
    });
  })();
}
async function badgeImageFileDownloaded(url, localPath) {
  const db = getInstance();
  prepare(db, "UPDATE badgeImageFiles SET localPath = $localPath WHERE url = $url").run({ url, localPath });
}
async function getAllBadgeImageFileLocalPaths() {
  const db = getInstance();
  const localPaths = db.prepare("SELECT localPath FROM badgeImageFiles WHERE localPath IS NOT NULL").pluck().all();
  return new Set(localPaths);
}
function hydrateStoryDistribution(fromDatabase) {
  return {
    ...(0, import_lodash.omit)(fromDatabase, "senderKeyInfoJson"),
    allowsReplies: Boolean(fromDatabase.allowsReplies),
    deletedAtTimestamp: fromDatabase.deletedAtTimestamp || void 0,
    isBlockList: Boolean(fromDatabase.isBlockList),
    senderKeyInfo: fromDatabase.senderKeyInfoJson ? JSON.parse(fromDatabase.senderKeyInfoJson) : void 0,
    storageID: fromDatabase.storageID || void 0,
    storageVersion: fromDatabase.storageVersion || void 0,
    storageNeedsSync: Boolean(fromDatabase.storageNeedsSync),
    storageUnknownFields: fromDatabase.storageUnknownFields || void 0
  };
}
function freezeStoryDistribution(story) {
  return {
    ...(0, import_lodash.omit)(story, "senderKeyInfo"),
    allowsReplies: story.allowsReplies ? 1 : 0,
    deletedAtTimestamp: story.deletedAtTimestamp || null,
    isBlockList: story.isBlockList ? 1 : 0,
    senderKeyInfoJson: story.senderKeyInfo ? JSON.stringify(story.senderKeyInfo) : null,
    storageID: story.storageID || null,
    storageVersion: story.storageVersion || null,
    storageNeedsSync: story.storageNeedsSync ? 1 : 0,
    storageUnknownFields: story.storageUnknownFields || null
  };
}
async function _getAllStoryDistributions() {
  const db = getInstance();
  const storyDistributions = db.prepare("SELECT * FROM storyDistributions;").all();
  return storyDistributions.map(hydrateStoryDistribution);
}
async function _getAllStoryDistributionMembers() {
  const db = getInstance();
  return db.prepare("SELECT * FROM storyDistributionMembers;").all();
}
async function _deleteAllStoryDistributions() {
  const db = getInstance();
  db.prepare("DELETE FROM storyDistributions;").run();
}
async function createNewStoryDistribution(distribution) {
  const db = getInstance();
  db.transaction(() => {
    const payload = freezeStoryDistribution(distribution);
    prepare(db, `
      INSERT INTO storyDistributions(
        id,
        name,
        deletedAtTimestamp,
        allowsReplies,
        isBlockList,
        senderKeyInfoJson,
        storageID,
        storageVersion,
        storageUnknownFields,
        storageNeedsSync
      ) VALUES (
        $id,
        $name,
        $deletedAtTimestamp,
        $allowsReplies,
        $isBlockList,
        $senderKeyInfoJson,
        $storageID,
        $storageVersion,
        $storageUnknownFields,
        $storageNeedsSync
      );
      `).run(payload);
    const { id: listId, members } = distribution;
    const memberInsertStatement = prepare(db, `
      INSERT OR REPLACE INTO storyDistributionMembers (
        listId,
        uuid
      ) VALUES (
        $listId,
        $uuid
      );
      `);
    for (const uuid of members) {
      memberInsertStatement.run({
        listId,
        uuid
      });
    }
  })();
}
async function getAllStoryDistributionsWithMembers() {
  const allDistributions = await _getAllStoryDistributions();
  const allMembers = await _getAllStoryDistributionMembers();
  const byListId = (0, import_lodash.groupBy)(allMembers, (member) => member.listId);
  return allDistributions.map((list) => ({
    ...list,
    members: (byListId[list.id] || []).map((member) => member.uuid)
  }));
}
async function getStoryDistributionWithMembers(id) {
  const db = getInstance();
  const storyDistribution = prepare(db, "SELECT * FROM storyDistributions WHERE id = $id;").get({
    id
  });
  if (!storyDistribution) {
    return void 0;
  }
  const members = prepare(db, "SELECT * FROM storyDistributionMembers WHERE listId = $id;").all({
    id
  });
  return {
    ...storyDistribution,
    members: members.map(({ uuid }) => uuid)
  };
}
function modifyStoryDistributionSync(db, payload) {
  prepare(db, `
    UPDATE storyDistributions
    SET
      name = $name,
      deletedAtTimestamp = $deletedAtTimestamp,
      allowsReplies = $allowsReplies,
      isBlockList = $isBlockList,
      senderKeyInfoJson = $senderKeyInfoJson,
      storageID = $storageID,
      storageVersion = $storageVersion,
      storageUnknownFields = $storageUnknownFields,
      storageNeedsSync = $storageNeedsSync
    WHERE id = $id
    `).run(payload);
}
function modifyStoryDistributionMembersSync(db, listId, {
  toAdd,
  toRemove
}) {
  const memberInsertStatement = prepare(db, `
    INSERT OR REPLACE INTO storyDistributionMembers (
      listId,
      uuid
    ) VALUES (
      $listId,
      $uuid
    );
    `);
  for (const uuid of toAdd) {
    memberInsertStatement.run({
      listId,
      uuid
    });
  }
  (0, import_util.batchMultiVarQuery)(db, toRemove, (uuids) => {
    db.prepare(`
      DELETE FROM storyDistributionMembers
      WHERE listId = ? AND uuid IN ( ${uuids.map(() => "?").join(", ")} );
      `).run([listId, ...uuids]);
  });
}
async function modifyStoryDistributionWithMembers(distribution, {
  toAdd,
  toRemove
}) {
  const payload = freezeStoryDistribution(distribution);
  const db = getInstance();
  if (toAdd.length || toRemove.length) {
    db.transaction(() => {
      modifyStoryDistributionSync(db, payload);
      modifyStoryDistributionMembersSync(db, payload.id, { toAdd, toRemove });
    })();
  } else {
    modifyStoryDistributionSync(db, payload);
  }
}
async function modifyStoryDistribution(distribution) {
  const payload = freezeStoryDistribution(distribution);
  const db = getInstance();
  modifyStoryDistributionSync(db, payload);
}
async function modifyStoryDistributionMembers(listId, {
  toAdd,
  toRemove
}) {
  const db = getInstance();
  db.transaction(() => {
    modifyStoryDistributionMembersSync(db, listId, { toAdd, toRemove });
  })();
}
async function deleteStoryDistribution(id) {
  const db = getInstance();
  db.prepare("DELETE FROM storyDistributions WHERE id = $id;").run({
    id
  });
}
async function _getAllStoryReads() {
  const db = getInstance();
  return db.prepare("SELECT * FROM storyReads;").all();
}
async function _deleteAllStoryReads() {
  const db = getInstance();
  db.prepare("DELETE FROM storyReads;").run();
}
async function addNewStoryRead(read) {
  const db = getInstance();
  prepare(db, `
    INSERT OR REPLACE INTO storyReads(
      authorId,
      conversationId,
      storyId,
      storyReadDate
    ) VALUES (
      $authorId,
      $conversationId,
      $storyId,
      $storyReadDate
    );
    `).run(read);
}
async function getLastStoryReadsForAuthor({
  authorId,
  conversationId,
  limit: initialLimit
}) {
  const limit = initialLimit || 5;
  const db = getInstance();
  return db.prepare(`
      SELECT * FROM storyReads
      WHERE
        authorId = $authorId AND
        ($conversationId IS NULL OR conversationId = $conversationId)
      ORDER BY storyReadDate DESC
      LIMIT $limit;
      `).all({
    authorId,
    conversationId: conversationId || null,
    limit
  });
}
async function countStoryReadsByConversation(conversationId) {
  const db = getInstance();
  return db.prepare(`
      SELECT COUNT(storyId) FROM storyReads
      WHERE conversationId = $conversationId;
      `).pluck().get({ conversationId });
}
async function removeAll() {
  const db = getInstance();
  db.transaction(() => {
    db.exec(`
      DELETE FROM attachment_downloads;
      DELETE FROM badgeImageFiles;
      DELETE FROM badges;
      DELETE FROM conversations;
      DELETE FROM emojis;
      DELETE FROM groupCallRings;
      DELETE FROM identityKeys;
      DELETE FROM items;
      DELETE FROM jobs;
      DELETE FROM messages_fts;
      DELETE FROM messages;
      DELETE FROM preKeys;
      DELETE FROM reactions;
      DELETE FROM senderKeys;
      DELETE FROM sendLogMessageIds;
      DELETE FROM sendLogPayloads;
      DELETE FROM sendLogRecipients;
      DELETE FROM sessions;
      DELETE FROM signedPreKeys;
      DELETE FROM sticker_packs;
      DELETE FROM sticker_references;
      DELETE FROM stickers;
      DELETE FROM storyDistributionMembers;
      DELETE FROM storyDistributions;
      DELETE FROM storyReads;
      DELETE FROM unprocessed;
    `);
  })();
}
async function removeAllConfiguration(mode = import_RemoveAllConfiguration.RemoveAllConfiguration.Full) {
  const db = getInstance();
  db.transaction(() => {
    db.exec(`
      DELETE FROM identityKeys;
      DELETE FROM jobs;
      DELETE FROM preKeys;
      DELETE FROM senderKeys;
      DELETE FROM sendLogMessageIds;
      DELETE FROM sendLogPayloads;
      DELETE FROM sendLogRecipients;
      DELETE FROM sessions;
      DELETE FROM signedPreKeys;
      DELETE FROM unprocessed;
      `);
    if (mode === import_RemoveAllConfiguration.RemoveAllConfiguration.Full) {
      db.exec(`
        DELETE FROM items;
        `);
    } else if (mode === import_RemoveAllConfiguration.RemoveAllConfiguration.Soft) {
      const itemIds = db.prepare("SELECT id FROM items").pluck(true).all();
      const allowedSet = new Set(import_StorageUIKeys.STORAGE_UI_KEYS);
      for (const id of itemIds) {
        if (!allowedSet.has(id)) {
          (0, import_util.removeById)(db, "items", id);
        }
      }
    } else {
      throw (0, import_missingCaseError.missingCaseError)(mode);
    }
    db.exec("UPDATE conversations SET json = json_remove(json, '$.senderKeyInfo');");
  })();
}
const MAX_MESSAGE_MIGRATION_ATTEMPTS = 5;
async function getMessagesNeedingUpgrade(limit, { maxVersion }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE
        (schemaVersion IS NULL OR schemaVersion < $maxVersion) AND
        IFNULL(
          json_extract(json, '$.schemaMigrationAttempts'),
          0
        ) < $maxAttempts
      LIMIT $limit;
      `).all({
    maxVersion,
    maxAttempts: MAX_MESSAGE_MIGRATION_ATTEMPTS,
    limit
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getMessagesWithVisualMediaAttachments(conversationId, { limit }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        isStory IS 0 AND
        storyId IS NULL AND
        conversationId = $conversationId AND
        hasVisualMediaAttachments = 1
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit
  });
  return rows.map((row) => (0, import_util.jsonToObject)(row.json));
}
async function getMessagesWithFileAttachments(conversationId, { limit }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        isStory IS 0 AND
        storyId IS NULL AND
        conversationId = $conversationId AND
        hasFileAttachments = 1
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit
  });
  return (0, import_lodash.map)(rows, (row) => (0, import_util.jsonToObject)(row.json));
}
async function getMessageServerGuidsForSpam(conversationId) {
  const db = getInstance();
  return db.prepare(`
      SELECT serverGuid
      FROM messages
      WHERE conversationId = $conversationId
      AND type = 'incoming'
      AND serverGuid IS NOT NULL
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 3;
      `).pluck(true).all({ conversationId });
}
function getExternalFilesForMessage(message) {
  const { attachments, contact, quote, preview, sticker } = message;
  const files = [];
  (0, import_lodash.forEach)(attachments, (attachment) => {
    const { path: file, thumbnail, screenshot } = attachment;
    if (file) {
      files.push(file);
    }
    if (thumbnail && thumbnail.path) {
      files.push(thumbnail.path);
    }
    if (screenshot && screenshot.path) {
      files.push(screenshot.path);
    }
  });
  if (quote && quote.attachments && quote.attachments.length) {
    (0, import_lodash.forEach)(quote.attachments, (attachment) => {
      const { thumbnail } = attachment;
      if (thumbnail && thumbnail.path) {
        files.push(thumbnail.path);
      }
    });
  }
  if (contact && contact.length) {
    (0, import_lodash.forEach)(contact, (item) => {
      const { avatar } = item;
      if (avatar && avatar.avatar && avatar.avatar.path) {
        files.push(avatar.avatar.path);
      }
    });
  }
  if (preview && preview.length) {
    (0, import_lodash.forEach)(preview, (item) => {
      const { image } = item;
      if (image && image.path) {
        files.push(image.path);
      }
    });
  }
  if (sticker && sticker.data && sticker.data.path) {
    files.push(sticker.data.path);
    if (sticker.data.thumbnail && sticker.data.thumbnail.path) {
      files.push(sticker.data.thumbnail.path);
    }
  }
  return files;
}
function getExternalFilesForConversation(conversation) {
  const { avatar, profileAvatar } = conversation;
  const files = [];
  if (avatar && avatar.path) {
    files.push(avatar.path);
  }
  if (profileAvatar && profileAvatar.path) {
    files.push(profileAvatar.path);
  }
  return files;
}
function getExternalDraftFilesForConversation(conversation) {
  const draftAttachments = conversation.draftAttachments || [];
  const files = [];
  (0, import_lodash.forEach)(draftAttachments, (attachment) => {
    if (attachment.pending) {
      return;
    }
    const { path: file, screenshotPath } = attachment;
    if (file) {
      files.push(file);
    }
    if (screenshotPath) {
      files.push(screenshotPath);
    }
  });
  return files;
}
async function removeKnownAttachments(allAttachments) {
  const db = getInstance();
  const lookup = (0, import_lodash.fromPairs)((0, import_lodash.map)(allAttachments, (file) => [file, true]));
  const chunkSize = 500;
  const total = getMessageCountSync();
  logger.info(`removeKnownAttachments: About to iterate through ${total} messages`);
  let count = 0;
  for (const message of new import_util.TableIterator(db, "messages")) {
    const externalFiles = getExternalFilesForMessage(message);
    (0, import_lodash.forEach)(externalFiles, (file) => {
      delete lookup[file];
    });
    count += 1;
  }
  logger.info(`removeKnownAttachments: Done processing ${count} messages`);
  let complete = false;
  count = 0;
  let id = "";
  const conversationTotal = await getConversationCount();
  logger.info(`removeKnownAttachments: About to iterate through ${conversationTotal} conversations`);
  const fetchConversations = db.prepare(`
      SELECT json FROM conversations
      WHERE id > $id
      ORDER BY id ASC
      LIMIT $chunkSize;
    `);
  while (!complete) {
    const rows = fetchConversations.all({
      id,
      chunkSize
    });
    const conversations = (0, import_lodash.map)(rows, (row) => (0, import_util.jsonToObject)(row.json));
    conversations.forEach((conversation) => {
      const externalFiles = getExternalFilesForConversation(conversation);
      externalFiles.forEach((file) => {
        delete lookup[file];
      });
    });
    const lastMessage = (0, import_lodash.last)(conversations);
    if (lastMessage) {
      ({ id } = lastMessage);
    }
    complete = conversations.length < chunkSize;
    count += conversations.length;
  }
  logger.info(`removeKnownAttachments: Done processing ${count} conversations`);
  return Object.keys(lookup);
}
async function removeKnownStickers(allStickers) {
  const db = getInstance();
  const lookup = (0, import_lodash.fromPairs)((0, import_lodash.map)(allStickers, (file) => [file, true]));
  const chunkSize = 50;
  const total = await getStickerCount();
  logger.info(`removeKnownStickers: About to iterate through ${total} stickers`);
  let count = 0;
  let complete = false;
  let rowid = 0;
  while (!complete) {
    const rows = db.prepare(`
        SELECT rowid, path FROM stickers
        WHERE rowid > $rowid
        ORDER BY rowid ASC
        LIMIT $chunkSize;
        `).all({
      rowid,
      chunkSize
    });
    const files = rows.map((row) => row.path);
    files.forEach((file) => {
      delete lookup[file];
    });
    const lastSticker = (0, import_lodash.last)(rows);
    if (lastSticker) {
      ({ rowid } = lastSticker);
    }
    complete = rows.length < chunkSize;
    count += rows.length;
  }
  logger.info(`removeKnownStickers: Done processing ${count} stickers`);
  return Object.keys(lookup);
}
async function removeKnownDraftAttachments(allStickers) {
  const db = getInstance();
  const lookup = (0, import_lodash.fromPairs)((0, import_lodash.map)(allStickers, (file) => [file, true]));
  const chunkSize = 50;
  const total = await getConversationCount();
  logger.info(`removeKnownDraftAttachments: About to iterate through ${total} conversations`);
  let complete = false;
  let count = 0;
  let id = 0;
  while (!complete) {
    const rows = db.prepare(`
        SELECT json FROM conversations
        WHERE id > $id
        ORDER BY id ASC
        LIMIT $chunkSize;
        `).all({
      id,
      chunkSize
    });
    const conversations = rows.map((row) => (0, import_util.jsonToObject)(row.json));
    conversations.forEach((conversation) => {
      const externalFiles = getExternalDraftFilesForConversation(conversation);
      externalFiles.forEach((file) => {
        delete lookup[file];
      });
    });
    const lastMessage = (0, import_lodash.last)(conversations);
    if (lastMessage) {
      ({ id } = lastMessage);
    }
    complete = conversations.length < chunkSize;
    count += conversations.length;
  }
  logger.info(`removeKnownDraftAttachments: Done processing ${count} conversations`);
  return Object.keys(lookup);
}
async function getJobsInQueue(queueType) {
  const db = getInstance();
  return getJobsInQueueSync(db, queueType);
}
function getJobsInQueueSync(db, queueType) {
  return db.prepare(`
      SELECT id, timestamp, data
      FROM jobs
      WHERE queueType = $queueType
      ORDER BY timestamp;
      `).all({ queueType }).map((row) => ({
    id: row.id,
    queueType,
    timestamp: row.timestamp,
    data: (0, import_isNotNil.isNotNil)(row.data) ? JSON.parse(row.data) : void 0
  }));
}
function insertJobSync(db, job) {
  db.prepare(`
      INSERT INTO jobs
      (id, queueType, timestamp, data)
      VALUES
      ($id, $queueType, $timestamp, $data);
    `).run({
    id: job.id,
    queueType: job.queueType,
    timestamp: job.timestamp,
    data: (0, import_isNotNil.isNotNil)(job.data) ? JSON.stringify(job.data) : null
  });
}
async function insertJob(job) {
  const db = getInstance();
  return insertJobSync(db, job);
}
async function deleteJob(id) {
  const db = getInstance();
  db.prepare("DELETE FROM jobs WHERE id = $id").run({ id });
}
async function processGroupCallRingRequest(ringId) {
  const db = getInstance();
  return db.transaction(() => {
    let result;
    const wasRingPreviouslyCanceled = Boolean(db.prepare(`
          SELECT 1 FROM groupCallRings
          WHERE ringId = $ringId AND isActive = 0
          LIMIT 1;
          `).pluck(true).get({ ringId }));
    if (wasRingPreviouslyCanceled) {
      result = import_Calling.ProcessGroupCallRingRequestResult.RingWasPreviouslyCanceled;
    } else {
      const isThereAnotherActiveRing = Boolean(db.prepare(`
            SELECT 1 FROM groupCallRings
            WHERE isActive = 1
            LIMIT 1;
            `).pluck(true).get());
      if (isThereAnotherActiveRing) {
        result = import_Calling.ProcessGroupCallRingRequestResult.ThereIsAnotherActiveRing;
      } else {
        result = import_Calling.ProcessGroupCallRingRequestResult.ShouldRing;
      }
      db.prepare(`
        INSERT OR IGNORE INTO groupCallRings (ringId, isActive, createdAt)
        VALUES ($ringId, 1, $createdAt);
        `);
    }
    return result;
  })();
}
async function processGroupCallRingCancelation(ringId) {
  const db = getInstance();
  db.prepare(`
    INSERT INTO groupCallRings (ringId, isActive, createdAt)
    VALUES ($ringId, 0, $createdAt)
    ON CONFLICT (ringId) DO
    UPDATE SET isActive = 0;
    `).run({ ringId, createdAt: Date.now() });
}
const MAX_GROUP_CALL_RING_AGE = 30 * durations.MINUTE;
async function cleanExpiredGroupCallRings() {
  const db = getInstance();
  db.prepare(`
    DELETE FROM groupCallRings
    WHERE createdAt < $expiredRingTime;
    `).run({
    expiredRingTime: Date.now() - MAX_GROUP_CALL_RING_AGE
  });
}
async function getMaxMessageCounter() {
  const db = getInstance();
  return db.prepare(`
    SELECT MAX(counter)
    FROM
      (
        SELECT MAX(received_at) AS counter FROM messages
        UNION
        SELECT MAX(timestamp) AS counter FROM unprocessed
      )
    `).pluck().get();
}
async function getStatisticsForLogging() {
  const db = getInstance();
  const counts = await (0, import_p_props.default)({
    messageCount: getMessageCount(),
    conversationCount: getConversationCount(),
    sessionCount: (0, import_util.getCountFromTable)(db, "sessions"),
    senderKeyCount: (0, import_util.getCountFromTable)(db, "senderKeys")
  });
  return (0, import_lodash.mapValues)(counts, import_formatCountForLogging.formatCountForLogging);
}
async function updateAllConversationColors(conversationColor, customColorData) {
  const db = getInstance();
  db.prepare(`
    UPDATE conversations
    SET json = JSON_PATCH(json, $patch);
    `).run({
    patch: JSON.stringify({
      conversationColor: conversationColor || null,
      customColor: customColorData?.value || null,
      customColorId: customColorData?.id || null
    })
  });
}
async function removeAllProfileKeyCredentials() {
  const db = getInstance();
  db.exec(`
    UPDATE conversations
    SET
      json = json_remove(json, '$.profileKeyCredential')
    `);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _storyIdPredicate,
  getJobsInQueueSync,
  getMessageByIdSync,
  insertJobSync
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2VydmVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5cbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJztcbmltcG9ydCB0eXBlIHsgRGF0YWJhc2UsIFN0YXRlbWVudCB9IGZyb20gJ2JldHRlci1zcWxpdGUzJztcbmltcG9ydCBTUUwgZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuaW1wb3J0IHBQcm9wcyBmcm9tICdwLXByb3BzJztcblxuaW1wb3J0IHR5cGUgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIGZvckVhY2gsXG4gIGZyb21QYWlycyxcbiAgZ3JvdXBCeSxcbiAgaXNCb29sZWFuLFxuICBpc05pbCxcbiAgaXNOdW1iZXIsXG4gIGlzU3RyaW5nLFxuICBsYXN0LFxuICBtYXAsXG4gIG1hcFZhbHVlcyxcbiAgb21pdCxcbiAgcGljayxcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgUmVhZFN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VSZWFkU3RhdHVzJztcbmltcG9ydCB0eXBlIHsgR3JvdXBWMk1lbWJlclR5cGUgfSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB0eXBlIHsgUmVhY3Rpb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvUmVhY3Rpb25zJztcbmltcG9ydCB7IFNUT1JBR0VfVUlfS0VZUyB9IGZyb20gJy4uL3R5cGVzL1N0b3JhZ2VVSUtleXMnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBTdG9yZWRKb2IgfSBmcm9tICcuLi9qb2JzL3R5cGVzJztcbmltcG9ydCB7IGFzc2VydCwgYXNzZXJ0U3luYywgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgY29tYmluZU5hbWVzIH0gZnJvbSAnLi4vdXRpbC9jb21iaW5lTmFtZXMnO1xuaW1wb3J0IHsgY29uc29sZUxvZ2dlciB9IGZyb20gJy4uL3V0aWwvY29uc29sZUxvZ2dlcic7XG5pbXBvcnQgeyBkcm9wTnVsbCB9IGZyb20gJy4uL3V0aWwvZHJvcE51bGwnO1xuaW1wb3J0IHsgaXNOb3JtYWxOdW1iZXIgfSBmcm9tICcuLi91dGlsL2lzTm9ybWFsTnVtYmVyJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcbmltcG9ydCB7IHBhcnNlSW50T3JUaHJvdyB9IGZyb20gJy4uL3V0aWwvcGFyc2VJbnRPclRocm93JztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBmb3JtYXRDb3VudEZvckxvZ2dpbmcgfSBmcm9tICcuLi9sb2dnaW5nL2Zvcm1hdENvdW50Rm9yTG9nZ2luZyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbkNvbG9yVHlwZSwgQ3VzdG9tQ29sb3JUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IFByb2Nlc3NHcm91cENhbGxSaW5nUmVxdWVzdFJlc3VsdCB9IGZyb20gJy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHsgUmVtb3ZlQWxsQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3R5cGVzL1JlbW92ZUFsbENvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHR5cGUgeyBCYWRnZVR5cGUsIEJhZGdlSW1hZ2VUeXBlIH0gZnJvbSAnLi4vYmFkZ2VzL3R5cGVzJztcbmltcG9ydCB7IHBhcnNlQmFkZ2VDYXRlZ29yeSB9IGZyb20gJy4uL2JhZGdlcy9CYWRnZUNhdGVnb3J5JztcbmltcG9ydCB7IHBhcnNlQmFkZ2VJbWFnZVRoZW1lIH0gZnJvbSAnLi4vYmFkZ2VzL0JhZGdlSW1hZ2VUaGVtZSc7XG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi90eXBlcy9Mb2dnaW5nJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgdHlwZSB7IEVtcHR5UXVlcnksIEFycmF5UXVlcnksIFF1ZXJ5LCBKU09OUm93cyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1xuICBqc29uVG9PYmplY3QsXG4gIG9iamVjdFRvSlNPTixcbiAgYmF0Y2hNdWx0aVZhclF1ZXJ5LFxuICBnZXRDb3VudEZyb21UYWJsZSxcbiAgcmVtb3ZlQnlJZCxcbiAgcmVtb3ZlQWxsRnJvbVRhYmxlLFxuICBnZXRBbGxGcm9tVGFibGUsXG4gIGdldEJ5SWQsXG4gIGJ1bGtBZGQsXG4gIGNyZWF0ZU9yVXBkYXRlLFxuICBUYWJsZUl0ZXJhdG9yLFxuICBzZXRVc2VyVmVyc2lvbixcbiAgZ2V0VXNlclZlcnNpb24sXG4gIGdldFNjaGVtYVZlcnNpb24sXG59IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB1cGRhdGVTY2hlbWEgfSBmcm9tICcuL21pZ3JhdGlvbnMnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIFN0b3JlZEFsbEl0ZW1zVHlwZSxcbiAgQXR0YWNobWVudERvd25sb2FkSm9iVHlwZSxcbiAgQ29udmVyc2F0aW9uTWV0cmljc1R5cGUsXG4gIENvbnZlcnNhdGlvblR5cGUsXG4gIERlbGV0ZVNlbnRQcm90b1JlY2lwaWVudE9wdGlvbnNUeXBlLFxuICBFbW9qaVR5cGUsXG4gIEdldENvbnZlcnNhdGlvblJhbmdlQ2VudGVyZWRPbk1lc3NhZ2VSZXN1bHRUeXBlLFxuICBHZXRVbnJlYWRCeUNvbnZlcnNhdGlvbkFuZE1hcmtSZWFkUmVzdWx0VHlwZSxcbiAgSWRlbnRpdHlLZXlJZFR5cGUsXG4gIFN0b3JlZElkZW50aXR5S2V5VHlwZSxcbiAgSW5zdGFsbGVkU3RpY2tlclBhY2tUeXBlLFxuICBJdGVtS2V5VHlwZSxcbiAgU3RvcmVkSXRlbVR5cGUsXG4gIENvbnZlcnNhdGlvbk1lc3NhZ2VTdGF0c1R5cGUsXG4gIE1lc3NhZ2VNZXRyaWNzVHlwZSxcbiAgTWVzc2FnZVR5cGUsXG4gIE1lc3NhZ2VUeXBlVW5oeWRyYXRlZCxcbiAgUHJlS2V5SWRUeXBlLFxuICBSZWFjdGlvblJlc3VsdFR5cGUsXG4gIFN0b3JlZFByZUtleVR5cGUsXG4gIFNlcnZlclNlYXJjaFJlc3VsdE1lc3NhZ2VUeXBlLFxuICBTZW5kZXJLZXlJZFR5cGUsXG4gIFNlbmRlcktleVR5cGUsXG4gIFNlbnRNZXNzYWdlREJUeXBlLFxuICBTZW50TWVzc2FnZXNUeXBlLFxuICBTZW50UHJvdG9UeXBlLFxuICBTZW50UHJvdG9XaXRoTWVzc2FnZUlkc1R5cGUsXG4gIFNlbnRSZWNpcGllbnRzREJUeXBlLFxuICBTZW50UmVjaXBpZW50c1R5cGUsXG4gIFNlcnZlckludGVyZmFjZSxcbiAgU2Vzc2lvbklkVHlwZSxcbiAgU2Vzc2lvblR5cGUsXG4gIFNpZ25lZFByZUtleUlkVHlwZSxcbiAgU3RvcmVkU2lnbmVkUHJlS2V5VHlwZSxcbiAgU3RpY2tlclBhY2tJbmZvVHlwZSxcbiAgU3RpY2tlclBhY2tTdGF0dXNUeXBlLFxuICBTdGlja2VyUGFja1R5cGUsXG4gIFN0aWNrZXJUeXBlLFxuICBTdG9yeURpc3RyaWJ1dGlvbk1lbWJlclR5cGUsXG4gIFN0b3J5RGlzdHJpYnV0aW9uVHlwZSxcbiAgU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUsXG4gIFN0b3J5UmVhZFR5cGUsXG4gIFVuaW5zdGFsbGVkU3RpY2tlclBhY2tUeXBlLFxuICBVbnByb2Nlc3NlZFR5cGUsXG4gIFVucHJvY2Vzc2VkVXBkYXRlVHlwZSxcbn0gZnJvbSAnLi9JbnRlcmZhY2UnO1xuaW1wb3J0IHsgU2VlblN0YXR1cyB9IGZyb20gJy4uL01lc3NhZ2VTZWVuU3RhdHVzJztcblxudHlwZSBDb252ZXJzYXRpb25Sb3cgPSBSZWFkb25seTx7XG4gIGpzb246IHN0cmluZztcbiAgcHJvZmlsZUxhc3RGZXRjaGVkQXQ6IG51bGwgfCBudW1iZXI7XG59PjtcbnR5cGUgQ29udmVyc2F0aW9uUm93cyA9IEFycmF5PENvbnZlcnNhdGlvblJvdz47XG50eXBlIFN0aWNrZXJSb3cgPSBSZWFkb25seTx7XG4gIGlkOiBudW1iZXI7XG4gIHBhY2tJZDogc3RyaW5nO1xuICBlbW9qaTogc3RyaW5nIHwgbnVsbDtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGlzQ292ZXJPbmx5OiBudW1iZXI7XG4gIGxhc3RVc2VkOiBudW1iZXI7XG4gIHBhdGg6IHN0cmluZztcbiAgd2lkdGg6IG51bWJlcjtcbn0+O1xuXG4vLyBCZWNhdXNlIHdlIGNhbid0IGZvcmNlIHRoaXMgbW9kdWxlIHRvIGNvbmZvcm0gdG8gYW4gaW50ZXJmYWNlLCB3ZSBuYXJyb3cgb3VyIGV4cG9ydHNcbi8vICAgdG8gdGhpcyBvbmUgZGVmYXVsdCBleHBvcnQsIHdoaWNoIGRvZXMgY29uZm9ybSB0byB0aGUgaW50ZXJmYWNlLlxuLy8gTm90ZTogSW4gSmF2YXNjcmlwdCwgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSAuZGVmYXVsdCBwcm9wZXJ0eSB3aGVuIHJlcXVpcmluZyBpdFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy80MjBcbmNvbnN0IGRhdGFJbnRlcmZhY2U6IFNlcnZlckludGVyZmFjZSA9IHtcbiAgY2xvc2UsXG4gIHJlbW92ZURCLFxuICByZW1vdmVJbmRleGVkREJGaWxlcyxcblxuICBjcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5LFxuICBnZXRJZGVudGl0eUtleUJ5SWQsXG4gIGJ1bGtBZGRJZGVudGl0eUtleXMsXG4gIHJlbW92ZUlkZW50aXR5S2V5QnlJZCxcbiAgcmVtb3ZlQWxsSWRlbnRpdHlLZXlzLFxuICBnZXRBbGxJZGVudGl0eUtleXMsXG5cbiAgY3JlYXRlT3JVcGRhdGVQcmVLZXksXG4gIGdldFByZUtleUJ5SWQsXG4gIGJ1bGtBZGRQcmVLZXlzLFxuICByZW1vdmVQcmVLZXlCeUlkLFxuICByZW1vdmVQcmVLZXlzQnlVdWlkLFxuICByZW1vdmVBbGxQcmVLZXlzLFxuICBnZXRBbGxQcmVLZXlzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2lnbmVkUHJlS2V5LFxuICBnZXRTaWduZWRQcmVLZXlCeUlkLFxuICBidWxrQWRkU2lnbmVkUHJlS2V5cyxcbiAgcmVtb3ZlU2lnbmVkUHJlS2V5QnlJZCxcbiAgcmVtb3ZlU2lnbmVkUHJlS2V5c0J5VXVpZCxcbiAgcmVtb3ZlQWxsU2lnbmVkUHJlS2V5cyxcbiAgZ2V0QWxsU2lnbmVkUHJlS2V5cyxcblxuICBjcmVhdGVPclVwZGF0ZUl0ZW0sXG4gIGdldEl0ZW1CeUlkLFxuICByZW1vdmVJdGVtQnlJZCxcbiAgcmVtb3ZlQWxsSXRlbXMsXG4gIGdldEFsbEl0ZW1zLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2VuZGVyS2V5LFxuICBnZXRTZW5kZXJLZXlCeUlkLFxuICByZW1vdmVBbGxTZW5kZXJLZXlzLFxuICBnZXRBbGxTZW5kZXJLZXlzLFxuICByZW1vdmVTZW5kZXJLZXlCeUlkLFxuXG4gIGluc2VydFNlbnRQcm90byxcbiAgZGVsZXRlU2VudFByb3Rvc09sZGVyVGhhbixcbiAgZGVsZXRlU2VudFByb3RvQnlNZXNzYWdlSWQsXG4gIGluc2VydFByb3RvUmVjaXBpZW50cyxcbiAgZGVsZXRlU2VudFByb3RvUmVjaXBpZW50LFxuICBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCxcbiAgcmVtb3ZlQWxsU2VudFByb3RvcyxcbiAgZ2V0QWxsU2VudFByb3RvcyxcbiAgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMsXG4gIF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvbixcbiAgY3JlYXRlT3JVcGRhdGVTZXNzaW9ucyxcbiAgY29tbWl0RGVjcnlwdFJlc3VsdCxcbiAgYnVsa0FkZFNlc3Npb25zLFxuICByZW1vdmVTZXNzaW9uQnlJZCxcbiAgcmVtb3ZlU2Vzc2lvbnNCeUNvbnZlcnNhdGlvbixcbiAgcmVtb3ZlQWxsU2Vzc2lvbnMsXG4gIGdldEFsbFNlc3Npb25zLFxuXG4gIGVyYXNlU3RvcmFnZVNlcnZpY2VTdGF0ZUZyb21Db252ZXJzYXRpb25zLFxuICBnZXRDb252ZXJzYXRpb25Db3VudCxcbiAgc2F2ZUNvbnZlcnNhdGlvbixcbiAgc2F2ZUNvbnZlcnNhdGlvbnMsXG4gIGdldENvbnZlcnNhdGlvbkJ5SWQsXG4gIHVwZGF0ZUNvbnZlcnNhdGlvbixcbiAgdXBkYXRlQ29udmVyc2F0aW9ucyxcbiAgcmVtb3ZlQ29udmVyc2F0aW9uLFxuICBfcmVtb3ZlQWxsQ29udmVyc2F0aW9ucyxcbiAgdXBkYXRlQWxsQ29udmVyc2F0aW9uQ29sb3JzLFxuICByZW1vdmVBbGxQcm9maWxlS2V5Q3JlZGVudGlhbHMsXG5cbiAgZ2V0QWxsQ29udmVyc2F0aW9ucyxcbiAgZ2V0QWxsQ29udmVyc2F0aW9uSWRzLFxuICBnZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkLFxuXG4gIHNlYXJjaE1lc3NhZ2VzLFxuICBzZWFyY2hNZXNzYWdlc0luQ29udmVyc2F0aW9uLFxuXG4gIGdldE1lc3NhZ2VDb3VudCxcbiAgZ2V0U3RvcnlDb3VudCxcbiAgc2F2ZU1lc3NhZ2UsXG4gIHNhdmVNZXNzYWdlcyxcbiAgcmVtb3ZlTWVzc2FnZSxcbiAgcmVtb3ZlTWVzc2FnZXMsXG4gIGdldFVucmVhZEJ5Q29udmVyc2F0aW9uQW5kTWFya1JlYWQsXG4gIGdldFVucmVhZFJlYWN0aW9uc0FuZE1hcmtSZWFkLFxuICBtYXJrUmVhY3Rpb25Bc1JlYWQsXG4gIGFkZFJlYWN0aW9uLFxuICByZW1vdmVSZWFjdGlvbkZyb21Db252ZXJzYXRpb24sXG4gIF9nZXRBbGxSZWFjdGlvbnMsXG4gIF9yZW1vdmVBbGxSZWFjdGlvbnMsXG4gIGdldE1lc3NhZ2VCeVNlbmRlcixcbiAgZ2V0TWVzc2FnZUJ5SWQsXG4gIGdldE1lc3NhZ2VzQnlJZCxcbiAgX2dldEFsbE1lc3NhZ2VzLFxuICBfcmVtb3ZlQWxsTWVzc2FnZXMsXG4gIGdldEFsbE1lc3NhZ2VJZHMsXG4gIGdldE1lc3NhZ2VzQnlTZW50QXQsXG4gIGdldEV4cGlyZWRNZXNzYWdlcyxcbiAgZ2V0TWVzc2FnZXNVbmV4cGVjdGVkbHlNaXNzaW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wLFxuICBnZXRTb29uZXN0TWVzc2FnZUV4cGlyeSxcbiAgZ2V0TmV4dFRhcFRvVmlld01lc3NhZ2VUaW1lc3RhbXBUb0FnZU91dCxcbiAgZ2V0VGFwVG9WaWV3TWVzc2FnZXNOZWVkaW5nRXJhc2UsXG4gIGdldE9sZGVyTWVzc2FnZXNCeUNvbnZlcnNhdGlvbixcbiAgZ2V0T2xkZXJTdG9yaWVzLFxuICBnZXROZXdlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG4gIGdldFRvdGFsVW5yZWFkRm9yQ29udmVyc2F0aW9uLFxuICBnZXRNZXNzYWdlTWV0cmljc0ZvckNvbnZlcnNhdGlvbixcbiAgZ2V0Q29udmVyc2F0aW9uUmFuZ2VDZW50ZXJlZE9uTWVzc2FnZSxcbiAgZ2V0Q29udmVyc2F0aW9uTWVzc2FnZVN0YXRzLFxuICBnZXRMYXN0Q29udmVyc2F0aW9uTWVzc2FnZSxcbiAgaGFzR3JvdXBDYWxsSGlzdG9yeU1lc3NhZ2UsXG4gIG1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyxcblxuICBnZXRVbnByb2Nlc3NlZENvdW50LFxuICBnZXRBbGxVbnByb2Nlc3NlZEFuZEluY3JlbWVudEF0dGVtcHRzLFxuICB1cGRhdGVVbnByb2Nlc3NlZFdpdGhEYXRhLFxuICB1cGRhdGVVbnByb2Nlc3NlZHNXaXRoRGF0YSxcbiAgZ2V0VW5wcm9jZXNzZWRCeUlkLFxuICByZW1vdmVVbnByb2Nlc3NlZCxcbiAgcmVtb3ZlQWxsVW5wcm9jZXNzZWQsXG5cbiAgZ2V0QXR0YWNobWVudERvd25sb2FkSm9iQnlJZCxcbiAgZ2V0TmV4dEF0dGFjaG1lbnREb3dubG9hZEpvYnMsXG4gIHNhdmVBdHRhY2htZW50RG93bmxvYWRKb2IsXG4gIHJlc2V0QXR0YWNobWVudERvd25sb2FkUGVuZGluZyxcbiAgc2V0QXR0YWNobWVudERvd25sb2FkSm9iUGVuZGluZyxcbiAgcmVtb3ZlQXR0YWNobWVudERvd25sb2FkSm9iLFxuICByZW1vdmVBbGxBdHRhY2htZW50RG93bmxvYWRKb2JzLFxuXG4gIGNyZWF0ZU9yVXBkYXRlU3RpY2tlclBhY2ssXG4gIHVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzLFxuICB1cGRhdGVTdGlja2VyUGFja0luZm8sXG4gIGNyZWF0ZU9yVXBkYXRlU3RpY2tlcixcbiAgdXBkYXRlU3RpY2tlckxhc3RVc2VkLFxuICBhZGRTdGlja2VyUGFja1JlZmVyZW5jZSxcbiAgZGVsZXRlU3RpY2tlclBhY2tSZWZlcmVuY2UsXG4gIGdldFN0aWNrZXJDb3VudCxcbiAgZGVsZXRlU3RpY2tlclBhY2ssXG4gIGdldEFsbFN0aWNrZXJQYWNrcyxcbiAgYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFjayxcbiAgcmVtb3ZlVW5pbnN0YWxsZWRTdGlja2VyUGFjayxcbiAgZ2V0SW5zdGFsbGVkU3RpY2tlclBhY2tzLFxuICBnZXRVbmluc3RhbGxlZFN0aWNrZXJQYWNrcyxcbiAgaW5zdGFsbFN0aWNrZXJQYWNrLFxuICB1bmluc3RhbGxTdGlja2VyUGFjayxcbiAgZ2V0U3RpY2tlclBhY2tJbmZvLFxuICBnZXRBbGxTdGlja2VycyxcbiAgZ2V0UmVjZW50U3RpY2tlcnMsXG4gIGNsZWFyQWxsRXJyb3JTdGlja2VyUGFja0F0dGVtcHRzLFxuXG4gIHVwZGF0ZUVtb2ppVXNhZ2UsXG4gIGdldFJlY2VudEVtb2ppcyxcblxuICBnZXRBbGxCYWRnZXMsXG4gIHVwZGF0ZU9yQ3JlYXRlQmFkZ2VzLFxuICBiYWRnZUltYWdlRmlsZURvd25sb2FkZWQsXG5cbiAgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucyxcbiAgX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycyxcbiAgX2RlbGV0ZUFsbFN0b3J5RGlzdHJpYnV0aW9ucyxcbiAgY3JlYXRlTmV3U3RvcnlEaXN0cmlidXRpb24sXG4gIGdldEFsbFN0b3J5RGlzdHJpYnV0aW9uc1dpdGhNZW1iZXJzLFxuICBnZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbixcbiAgbW9kaWZ5U3RvcnlEaXN0cmlidXRpb25NZW1iZXJzLFxuICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzLFxuICBkZWxldGVTdG9yeURpc3RyaWJ1dGlvbixcblxuICBfZ2V0QWxsU3RvcnlSZWFkcyxcbiAgX2RlbGV0ZUFsbFN0b3J5UmVhZHMsXG4gIGFkZE5ld1N0b3J5UmVhZCxcbiAgZ2V0TGFzdFN0b3J5UmVhZHNGb3JBdXRob3IsXG4gIGNvdW50U3RvcnlSZWFkc0J5Q29udmVyc2F0aW9uLFxuXG4gIHJlbW92ZUFsbCxcbiAgcmVtb3ZlQWxsQ29uZmlndXJhdGlvbixcblxuICBnZXRNZXNzYWdlc05lZWRpbmdVcGdyYWRlLFxuICBnZXRNZXNzYWdlc1dpdGhWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICBnZXRNZXNzYWdlc1dpdGhGaWxlQXR0YWNobWVudHMsXG4gIGdldE1lc3NhZ2VTZXJ2ZXJHdWlkc0ZvclNwYW0sXG5cbiAgZ2V0Sm9ic0luUXVldWUsXG4gIGluc2VydEpvYixcbiAgZGVsZXRlSm9iLFxuXG4gIHByb2Nlc3NHcm91cENhbGxSaW5nUmVxdWVzdCxcbiAgcHJvY2Vzc0dyb3VwQ2FsbFJpbmdDYW5jZWxhdGlvbixcbiAgY2xlYW5FeHBpcmVkR3JvdXBDYWxsUmluZ3MsXG5cbiAgZ2V0TWF4TWVzc2FnZUNvdW50ZXIsXG5cbiAgZ2V0U3RhdGlzdGljc0ZvckxvZ2dpbmcsXG5cbiAgLy8gU2VydmVyLW9ubHlcblxuICBpbml0aWFsaXplLFxuICBpbml0aWFsaXplUmVuZGVyZXIsXG5cbiAgcmVtb3ZlS25vd25BdHRhY2htZW50cyxcbiAgcmVtb3ZlS25vd25TdGlja2VycyxcbiAgcmVtb3ZlS25vd25EcmFmdEF0dGFjaG1lbnRzLFxuICBnZXRBbGxCYWRnZUltYWdlRmlsZUxvY2FsUGF0aHMsXG59O1xuZXhwb3J0IGRlZmF1bHQgZGF0YUludGVyZmFjZTtcblxudHlwZSBEYXRhYmFzZVF1ZXJ5Q2FjaGUgPSBNYXA8c3RyaW5nLCBTdGF0ZW1lbnQ8QXJyYXk8dW5rbm93bj4+PjtcblxuY29uc3Qgc3RhdGVtZW50Q2FjaGUgPSBuZXcgV2Vha01hcDxEYXRhYmFzZSwgRGF0YWJhc2VRdWVyeUNhY2hlPigpO1xuXG5mdW5jdGlvbiBwcmVwYXJlPFQ+KGRiOiBEYXRhYmFzZSwgcXVlcnk6IHN0cmluZyk6IFN0YXRlbWVudDxUPiB7XG4gIGxldCBkYkNhY2hlID0gc3RhdGVtZW50Q2FjaGUuZ2V0KGRiKTtcbiAgaWYgKCFkYkNhY2hlKSB7XG4gICAgZGJDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICBzdGF0ZW1lbnRDYWNoZS5zZXQoZGIsIGRiQ2FjaGUpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGRiQ2FjaGUuZ2V0KHF1ZXJ5KSBhcyBTdGF0ZW1lbnQ8VD47XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGIucHJlcGFyZTxUPihxdWVyeSk7XG4gICAgZGJDYWNoZS5zZXQocXVlcnksIHJlc3VsdCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByb3dUb0NvbnZlcnNhdGlvbihyb3c6IENvbnZlcnNhdGlvblJvdyk6IENvbnZlcnNhdGlvblR5cGUge1xuICBjb25zdCBwYXJzZWRKc29uID0gSlNPTi5wYXJzZShyb3cuanNvbik7XG5cbiAgbGV0IHByb2ZpbGVMYXN0RmV0Y2hlZEF0OiB1bmRlZmluZWQgfCBudW1iZXI7XG4gIGlmIChpc05vcm1hbE51bWJlcihyb3cucHJvZmlsZUxhc3RGZXRjaGVkQXQpKSB7XG4gICAgcHJvZmlsZUxhc3RGZXRjaGVkQXQgPSByb3cucHJvZmlsZUxhc3RGZXRjaGVkQXQ7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KFxuICAgICAgaXNOaWwocm93LnByb2ZpbGVMYXN0RmV0Y2hlZEF0KSxcbiAgICAgICdwcm9maWxlTGFzdEZldGNoZWRBdCBjb250YWluZWQgaW52YWxpZCBkYXRhOyBkZWZhdWx0aW5nIHRvIHVuZGVmaW5lZCdcbiAgICApO1xuICAgIHByb2ZpbGVMYXN0RmV0Y2hlZEF0ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5wYXJzZWRKc29uLFxuICAgIHByb2ZpbGVMYXN0RmV0Y2hlZEF0LFxuICB9O1xufVxuZnVuY3Rpb24gcm93VG9TdGlja2VyKHJvdzogU3RpY2tlclJvdyk6IFN0aWNrZXJUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5yb3csXG4gICAgaXNDb3Zlck9ubHk6IEJvb2xlYW4ocm93LmlzQ292ZXJPbmx5KSxcbiAgICBlbW9qaTogZHJvcE51bGwocm93LmVtb2ppKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNSZW5kZXJlcigpIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCAhcHJvY2Vzcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJztcbn1cblxuZnVuY3Rpb24ga2V5RGF0YWJhc2UoZGI6IERhdGFiYXNlLCBrZXk6IHN0cmluZyk6IHZvaWQge1xuICAvLyBodHRwczovL3d3dy56ZXRldGljLm5ldC9zcWxjaXBoZXIvc3FsY2lwaGVyLWFwaS8ja2V5XG4gIGRiLnByYWdtYShga2V5ID0gXCJ4JyR7a2V5fSdcImApO1xufVxuXG5mdW5jdGlvbiBzd2l0Y2hUb1dBTChkYjogRGF0YWJhc2UpOiB2b2lkIHtcbiAgLy8gaHR0cHM6Ly9zcWxpdGUub3JnL3dhbC5odG1sXG4gIGRiLnByYWdtYSgnam91cm5hbF9tb2RlID0gV0FMJyk7XG4gIGRiLnByYWdtYSgnc3luY2hyb25vdXMgPSBGVUxMJyk7XG4gIGRiLnByYWdtYSgnZnVsbGZzeW5jID0gT04nKTtcbn1cblxuZnVuY3Rpb24gbWlncmF0ZVNjaGVtYVZlcnNpb24oZGI6IERhdGFiYXNlKTogdm9pZCB7XG4gIGNvbnN0IHVzZXJWZXJzaW9uID0gZ2V0VXNlclZlcnNpb24oZGIpO1xuICBpZiAodXNlclZlcnNpb24gPiAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc2NoZW1hVmVyc2lvbiA9IGdldFNjaGVtYVZlcnNpb24oZGIpO1xuICBjb25zdCBuZXdVc2VyVmVyc2lvbiA9IHNjaGVtYVZlcnNpb24gPiAxOCA/IDE2IDogc2NoZW1hVmVyc2lvbjtcbiAgbG9nZ2VyLmluZm8oXG4gICAgJ21pZ3JhdGVTY2hlbWFWZXJzaW9uOiBNaWdyYXRpbmcgZnJvbSBzY2hlbWFfdmVyc2lvbiAnICtcbiAgICAgIGAke3NjaGVtYVZlcnNpb259IHRvIHVzZXJfdmVyc2lvbiAke25ld1VzZXJWZXJzaW9ufWBcbiAgKTtcblxuICBzZXRVc2VyVmVyc2lvbihkYiwgbmV3VXNlclZlcnNpb24pO1xufVxuXG5mdW5jdGlvbiBvcGVuQW5kTWlncmF0ZURhdGFiYXNlKGZpbGVQYXRoOiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gIGxldCBkYjogRGF0YWJhc2UgfCB1bmRlZmluZWQ7XG5cbiAgLy8gRmlyc3QsIHdlIHRyeSB0byBvcGVuIHRoZSBkYXRhYmFzZSB3aXRob3V0IGFueSBjaXBoZXIgY2hhbmdlc1xuICB0cnkge1xuICAgIGRiID0gbmV3IFNRTChmaWxlUGF0aCk7XG4gICAga2V5RGF0YWJhc2UoZGIsIGtleSk7XG4gICAgc3dpdGNoVG9XQUwoZGIpO1xuICAgIG1pZ3JhdGVTY2hlbWFWZXJzaW9uKGRiKTtcblxuICAgIHJldHVybiBkYjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZGIpIHtcbiAgICAgIGRiLmNsb3NlKCk7XG4gICAgfVxuICAgIGxvZ2dlci5pbmZvKCdtaWdyYXRlRGF0YWJhc2U6IE1pZ3JhdGlvbiB3aXRob3V0IGNpcGhlciBjaGFuZ2UgZmFpbGVkJyk7XG4gIH1cblxuICAvLyBJZiB0aGF0IGZhaWxzLCB3ZSB0cnkgdG8gb3BlbiB0aGUgZGF0YWJhc2Ugd2l0aCAzLnggY29tcGF0aWJpbGl0eSB0byBleHRyYWN0IHRoZVxuICAvLyAgIHVzZXJfdmVyc2lvbiAocHJldmlvdXNseSBzdG9yZWQgaW4gc2NoZW1hX3ZlcnNpb24sIGJsb3duIGF3YXkgYnkgY2lwaGVyX21pZ3JhdGUpLlxuICBkYiA9IG5ldyBTUUwoZmlsZVBhdGgpO1xuICBrZXlEYXRhYmFzZShkYiwga2V5KTtcblxuICAvLyBodHRwczovL3d3dy56ZXRldGljLm5ldC9ibG9nLzIwMTgvMTEvMzAvc3FsY2lwaGVyLTQwMC1yZWxlYXNlLyNjb21wYXRhYmlsaXR5LXNxbGNpcGhlci00LTAtMFxuICBkYi5wcmFnbWEoJ2NpcGhlcl9jb21wYXRpYmlsaXR5ID0gMycpO1xuICBtaWdyYXRlU2NoZW1hVmVyc2lvbihkYik7XG4gIGRiLmNsb3NlKCk7XG5cbiAgLy8gQWZ0ZXIgbWlncmF0aW5nIHVzZXJfdmVyc2lvbiAtPiBzY2hlbWFfdmVyc2lvbiwgd2UgcmVvcGVuIGRhdGFiYXNlLCBiZWNhdXNlIHdlIGNhbid0XG4gIC8vICAgbWlncmF0ZSB0byB0aGUgbGF0ZXN0IGNpcGhlcnMgYWZ0ZXIgd2UndmUgbW9kaWZpZWQgdGhlIGRlZmF1bHRzLlxuICBkYiA9IG5ldyBTUUwoZmlsZVBhdGgpO1xuICBrZXlEYXRhYmFzZShkYiwga2V5KTtcblxuICBkYi5wcmFnbWEoJ2NpcGhlcl9taWdyYXRlJyk7XG4gIHN3aXRjaFRvV0FMKGRiKTtcblxuICByZXR1cm4gZGI7XG59XG5cbmNvbnN0IElOVkFMSURfS0VZID0gL1teMC05QS1GYS1mXS87XG5mdW5jdGlvbiBvcGVuQW5kU2V0VXBTUUxDaXBoZXIoZmlsZVBhdGg6IHN0cmluZywgeyBrZXkgfTogeyBrZXk6IHN0cmluZyB9KSB7XG4gIGNvbnN0IG1hdGNoID0gSU5WQUxJRF9LRVkuZXhlYyhrZXkpO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHNldHVwU1FMQ2lwaGVyOiBrZXkgJyR7a2V5fScgaXMgbm90IHZhbGlkYCk7XG4gIH1cblxuICBjb25zdCBkYiA9IG9wZW5BbmRNaWdyYXRlRGF0YWJhc2UoZmlsZVBhdGgsIGtleSk7XG5cbiAgLy8gQmVjYXVzZSBmb3JlaWduIGtleSBzdXBwb3J0IGlzIG5vdCBlbmFibGVkIGJ5IGRlZmF1bHQhXG4gIGRiLnByYWdtYSgnZm9yZWlnbl9rZXlzID0gT04nKTtcblxuICByZXR1cm4gZGI7XG59XG5cbmxldCBnbG9iYWxJbnN0YW5jZTogRGF0YWJhc2UgfCB1bmRlZmluZWQ7XG5sZXQgbG9nZ2VyID0gY29uc29sZUxvZ2dlcjtcbmxldCBnbG9iYWxJbnN0YW5jZVJlbmRlcmVyOiBEYXRhYmFzZSB8IHVuZGVmaW5lZDtcbmxldCBkYXRhYmFzZUZpbGVQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5sZXQgaW5kZXhlZERCUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplKHtcbiAgY29uZmlnRGlyLFxuICBrZXksXG4gIGxvZ2dlcjogc3VwcGxpZWRMb2dnZXIsXG59OiB7XG4gIGNvbmZpZ0Rpcjogc3RyaW5nO1xuICBrZXk6IHN0cmluZztcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xufSk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoZ2xvYmFsSW5zdGFuY2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBpbml0aWFsaXplIG1vcmUgdGhhbiBvbmNlIScpO1xuICB9XG5cbiAgaWYgKCFpc1N0cmluZyhjb25maWdEaXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0aWFsaXplOiBjb25maWdEaXIgaXMgcmVxdWlyZWQhJyk7XG4gIH1cbiAgaWYgKCFpc1N0cmluZyhrZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0aWFsaXplOiBrZXkgaXMgcmVxdWlyZWQhJyk7XG4gIH1cblxuICBsb2dnZXIgPSBzdXBwbGllZExvZ2dlcjtcblxuICBpbmRleGVkREJQYXRoID0gam9pbihjb25maWdEaXIsICdJbmRleGVkREInKTtcblxuICBjb25zdCBkYkRpciA9IGpvaW4oY29uZmlnRGlyLCAnc3FsJyk7XG4gIG1rZGlycC5zeW5jKGRiRGlyKTtcblxuICBkYXRhYmFzZUZpbGVQYXRoID0gam9pbihkYkRpciwgJ2RiLnNxbGl0ZScpO1xuXG4gIGxldCBkYjogRGF0YWJhc2UgfCB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBkYiA9IG9wZW5BbmRTZXRVcFNRTENpcGhlcihkYXRhYmFzZUZpbGVQYXRoLCB7IGtleSB9KTtcblxuICAgIC8vIEZvciBwcm9maWxpbmcgdXNlOlxuICAgIC8vIGRiLnByYWdtYSgnY2lwaGVyX3Byb2ZpbGU9XFwnc3FsY2lwaGVyLmxvZ1xcJycpO1xuXG4gICAgdXBkYXRlU2NoZW1hKGRiLCBsb2dnZXIpO1xuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBjYW4gYWxsb3cgZ2VuZXJhbCBhY2Nlc3MgdG8gdGhlIGRhdGFiYXNlXG4gICAgZ2xvYmFsSW5zdGFuY2UgPSBkYjtcblxuICAgIC8vIHRlc3QgZGF0YWJhc2VcbiAgICBnZXRNZXNzYWdlQ291bnRTeW5jKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdEYXRhYmFzZSBzdGFydHVwIGVycm9yOicsIGVycm9yLnN0YWNrKTtcbiAgICBpZiAoZGIpIHtcbiAgICAgIGRiLmNsb3NlKCk7XG4gICAgfVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVSZW5kZXJlcih7XG4gIGNvbmZpZ0RpcixcbiAga2V5LFxufToge1xuICBjb25maWdEaXI6IHN0cmluZztcbiAga2V5OiBzdHJpbmc7XG59KTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICghaXNSZW5kZXJlcigpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBmcm9tIG1haW4gcHJvY2Vzcy4nKTtcbiAgfVxuICBpZiAoZ2xvYmFsSW5zdGFuY2VSZW5kZXJlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGluaXRpYWxpemUgbW9yZSB0aGFuIG9uY2UhJyk7XG4gIH1cbiAgaWYgKCFpc1N0cmluZyhjb25maWdEaXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0aWFsaXplOiBjb25maWdEaXIgaXMgcmVxdWlyZWQhJyk7XG4gIH1cbiAgaWYgKCFpc1N0cmluZyhrZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0aWFsaXplOiBrZXkgaXMgcmVxdWlyZWQhJyk7XG4gIH1cblxuICBpZiAoIWluZGV4ZWREQlBhdGgpIHtcbiAgICBpbmRleGVkREJQYXRoID0gam9pbihjb25maWdEaXIsICdJbmRleGVkREInKTtcbiAgfVxuXG4gIGNvbnN0IGRiRGlyID0gam9pbihjb25maWdEaXIsICdzcWwnKTtcblxuICBpZiAoIWRhdGFiYXNlRmlsZVBhdGgpIHtcbiAgICBkYXRhYmFzZUZpbGVQYXRoID0gam9pbihkYkRpciwgJ2RiLnNxbGl0ZScpO1xuICB9XG5cbiAgbGV0IHByb21pc2lmaWVkOiBEYXRhYmFzZSB8IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIHByb21pc2lmaWVkID0gb3BlbkFuZFNldFVwU1FMQ2lwaGVyKGRhdGFiYXNlRmlsZVBhdGgsIHsga2V5IH0pO1xuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBjYW4gYWxsb3cgZ2VuZXJhbCBhY2Nlc3MgdG8gdGhlIGRhdGFiYXNlXG4gICAgZ2xvYmFsSW5zdGFuY2VSZW5kZXJlciA9IHByb21pc2lmaWVkO1xuXG4gICAgLy8gdGVzdCBkYXRhYmFzZVxuICAgIGdldE1lc3NhZ2VDb3VudFN5bmMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoJ0RhdGFiYXNlIHN0YXJ0dXAgZXJyb3I6JywgZXJyb3Iuc3RhY2spO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICBmb3IgKGNvbnN0IGRiUmVmIG9mIFtnbG9iYWxJbnN0YW5jZVJlbmRlcmVyLCBnbG9iYWxJbnN0YW5jZV0pIHtcbiAgICAvLyBTUUxMaXRlIGRvY3VtZW50YXRpb24gc3VnZ2VzdHMgdGhhdCB3ZSBydW4gYFBSQUdNQSBvcHRpbWl6ZWAgcmlnaHRcbiAgICAvLyBiZWZvcmUgY2xvc2luZyB0aGUgZGF0YWJhc2UgY29ubmVjdGlvbi5cbiAgICBkYlJlZj8ucHJhZ21hKCdvcHRpbWl6ZScpO1xuXG4gICAgZGJSZWY/LmNsb3NlKCk7XG4gIH1cblxuICBnbG9iYWxJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgZ2xvYmFsSW5zdGFuY2VSZW5kZXJlciA9IHVuZGVmaW5lZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlREIoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChnbG9iYWxJbnN0YW5jZSkge1xuICAgIHRyeSB7XG4gICAgICBnbG9iYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ3JlbW92ZURCOiBGYWlsZWQgdG8gY2xvc2UgZGF0YWJhc2U6JywgZXJyb3Iuc3RhY2spO1xuICAgIH1cbiAgICBnbG9iYWxJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoIWRhdGFiYXNlRmlsZVBhdGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAncmVtb3ZlREI6IENhbm5vdCBlcmFzZSBkYXRhYmFzZSB3aXRob3V0IGEgZGF0YWJhc2VGaWxlUGF0aCEnXG4gICAgKTtcbiAgfVxuXG4gIGxvZ2dlci53YXJuKCdyZW1vdmVEQjogUmVtb3ZpbmcgYWxsIGRhdGFiYXNlIGZpbGVzJyk7XG4gIHJpbXJhZi5zeW5jKGRhdGFiYXNlRmlsZVBhdGgpO1xuICByaW1yYWYuc3luYyhgJHtkYXRhYmFzZUZpbGVQYXRofS1zaG1gKTtcbiAgcmltcmFmLnN5bmMoYCR7ZGF0YWJhc2VGaWxlUGF0aH0td2FsYCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUluZGV4ZWREQkZpbGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIWluZGV4ZWREQlBhdGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAncmVtb3ZlSW5kZXhlZERCRmlsZXM6IE5lZWQgdG8gaW5pdGlhbGl6ZSBhbmQgc2V0IGluZGV4ZWREQlBhdGggZmlyc3QhJ1xuICAgICk7XG4gIH1cblxuICBjb25zdCBwYXR0ZXJuID0gam9pbihpbmRleGVkREJQYXRoLCAnKi5sZXZlbGRiJyk7XG4gIHJpbXJhZi5zeW5jKHBhdHRlcm4pO1xuICBpbmRleGVkREJQYXRoID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRJbnN0YW5jZSgpOiBEYXRhYmFzZSB7XG4gIGlmIChpc1JlbmRlcmVyKCkpIHtcbiAgICBpZiAoIWdsb2JhbEluc3RhbmNlUmVuZGVyZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0SW5zdGFuY2U6IGdsb2JhbEluc3RhbmNlUmVuZGVyZXIgbm90IHNldCEnKTtcbiAgICB9XG4gICAgcmV0dXJuIGdsb2JhbEluc3RhbmNlUmVuZGVyZXI7XG4gIH1cblxuICBpZiAoIWdsb2JhbEluc3RhbmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRJbnN0YW5jZTogZ2xvYmFsSW5zdGFuY2Ugbm90IHNldCEnKTtcbiAgfVxuXG4gIHJldHVybiBnbG9iYWxJbnN0YW5jZTtcbn1cblxuY29uc3QgSURFTlRJVFlfS0VZU19UQUJMRSA9ICdpZGVudGl0eUtleXMnO1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleShcbiAgZGF0YTogU3RvcmVkSWRlbnRpdHlLZXlUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNyZWF0ZU9yVXBkYXRlKGdldEluc3RhbmNlKCksIElERU5USVRZX0tFWVNfVEFCTEUsIGRhdGEpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICBpZDogSWRlbnRpdHlLZXlJZFR5cGVcbik6IFByb21pc2U8U3RvcmVkSWRlbnRpdHlLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBnZXRCeUlkKGdldEluc3RhbmNlKCksIElERU5USVRZX0tFWVNfVEFCTEUsIGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGJ1bGtBZGRJZGVudGl0eUtleXMoXG4gIGFycmF5OiBBcnJheTxTdG9yZWRJZGVudGl0eUtleVR5cGU+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGJ1bGtBZGQoZ2V0SW5zdGFuY2UoKSwgSURFTlRJVFlfS0VZU19UQUJMRSwgYXJyYXkpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlSWRlbnRpdHlLZXlCeUlkKGlkOiBJZGVudGl0eUtleUlkVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gcmVtb3ZlQnlJZChnZXRJbnN0YW5jZSgpLCBJREVOVElUWV9LRVlTX1RBQkxFLCBpZCk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxJZGVudGl0eUtleXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgSURFTlRJVFlfS0VZU19UQUJMRSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxJZGVudGl0eUtleXMoKTogUHJvbWlzZTxBcnJheTxTdG9yZWRJZGVudGl0eUtleVR5cGU+PiB7XG4gIHJldHVybiBnZXRBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgSURFTlRJVFlfS0VZU19UQUJMRSk7XG59XG5cbmNvbnN0IFBSRV9LRVlTX1RBQkxFID0gJ3ByZUtleXMnO1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JVcGRhdGVQcmVLZXkoZGF0YTogU3RvcmVkUHJlS2V5VHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gY3JlYXRlT3JVcGRhdGUoZ2V0SW5zdGFuY2UoKSwgUFJFX0tFWVNfVEFCTEUsIGRhdGEpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJlS2V5QnlJZChcbiAgaWQ6IFByZUtleUlkVHlwZVxuKTogUHJvbWlzZTxTdG9yZWRQcmVLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBnZXRCeUlkKGdldEluc3RhbmNlKCksIFBSRV9LRVlTX1RBQkxFLCBpZCk7XG59XG5hc3luYyBmdW5jdGlvbiBidWxrQWRkUHJlS2V5cyhhcnJheTogQXJyYXk8U3RvcmVkUHJlS2V5VHlwZT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGJ1bGtBZGQoZ2V0SW5zdGFuY2UoKSwgUFJFX0tFWVNfVEFCTEUsIGFycmF5KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVByZUtleUJ5SWQoaWQ6IFByZUtleUlkVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gcmVtb3ZlQnlJZChnZXRJbnN0YW5jZSgpLCBQUkVfS0VZU19UQUJMRSwgaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlUHJlS2V5c0J5VXVpZCh1dWlkOiBVVUlEU3RyaW5nVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KCdERUxFVEUgRlJPTSBwcmVLZXlzIFdIRVJFIG91clV1aWQgSVMgJHV1aWQ7JykucnVuKHtcbiAgICB1dWlkLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbFByZUtleXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgUFJFX0tFWVNfVEFCTEUpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsUHJlS2V5cygpOiBQcm9taXNlPEFycmF5PFN0b3JlZFByZUtleVR5cGU+PiB7XG4gIHJldHVybiBnZXRBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgUFJFX0tFWVNfVEFCTEUpO1xufVxuXG5jb25zdCBTSUdORURfUFJFX0tFWVNfVEFCTEUgPSAnc2lnbmVkUHJlS2V5cyc7XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVNpZ25lZFByZUtleShcbiAgZGF0YTogU3RvcmVkU2lnbmVkUHJlS2V5VHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjcmVhdGVPclVwZGF0ZShnZXRJbnN0YW5jZSgpLCBTSUdORURfUFJFX0tFWVNfVEFCTEUsIGRhdGEpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0U2lnbmVkUHJlS2V5QnlJZChcbiAgaWQ6IFNpZ25lZFByZUtleUlkVHlwZVxuKTogUHJvbWlzZTxTdG9yZWRTaWduZWRQcmVLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIHJldHVybiBnZXRCeUlkKGdldEluc3RhbmNlKCksIFNJR05FRF9QUkVfS0VZU19UQUJMRSwgaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gYnVsa0FkZFNpZ25lZFByZUtleXMoXG4gIGFycmF5OiBBcnJheTxTdG9yZWRTaWduZWRQcmVLZXlUeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBidWxrQWRkKGdldEluc3RhbmNlKCksIFNJR05FRF9QUkVfS0VZU19UQUJMRSwgYXJyYXkpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2lnbmVkUHJlS2V5QnlJZChpZDogU2lnbmVkUHJlS2V5SWRUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVCeUlkKGdldEluc3RhbmNlKCksIFNJR05FRF9QUkVfS0VZU19UQUJMRSwgaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2lnbmVkUHJlS2V5c0J5VXVpZCh1dWlkOiBVVUlEU3RyaW5nVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KCdERUxFVEUgRlJPTSBzaWduZWRQcmVLZXlzIFdIRVJFIG91clV1aWQgSVMgJHV1aWQ7JykucnVuKHtcbiAgICB1dWlkLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbFNpZ25lZFByZUtleXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgU0lHTkVEX1BSRV9LRVlTX1RBQkxFKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFNpZ25lZFByZUtleXMoKTogUHJvbWlzZTxBcnJheTxTdG9yZWRTaWduZWRQcmVLZXlUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvd3M6IEpTT05Sb3dzID0gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uXG4gICAgICBGUk9NIHNpZ25lZFByZUtleXNcbiAgICAgIE9SREVSIEJZIGlkIEFTQztcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG59XG5cbmNvbnN0IElURU1TX1RBQkxFID0gJ2l0ZW1zJztcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlSXRlbTxLIGV4dGVuZHMgSXRlbUtleVR5cGU+KFxuICBkYXRhOiBTdG9yZWRJdGVtVHlwZTxLPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBjcmVhdGVPclVwZGF0ZShnZXRJbnN0YW5jZSgpLCBJVEVNU19UQUJMRSwgZGF0YSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRJdGVtQnlJZDxLIGV4dGVuZHMgSXRlbUtleVR5cGU+KFxuICBpZDogS1xuKTogUHJvbWlzZTxTdG9yZWRJdGVtVHlwZTxLPiB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gZ2V0QnlJZChnZXRJbnN0YW5jZSgpLCBJVEVNU19UQUJMRSwgaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsSXRlbXMoKTogUHJvbWlzZTxTdG9yZWRBbGxJdGVtc1R5cGU+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzOiBKU09OUm93cyA9IGRiXG4gICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oJ1NFTEVDVCBqc29uIEZST00gaXRlbXMgT1JERVIgQlkgaWQgQVNDOycpXG4gICAgLmFsbCgpO1xuXG4gIHR5cGUgUmF3SXRlbVR5cGUgPSB7IGlkOiBJdGVtS2V5VHlwZTsgdmFsdWU6IHVua25vd24gfTtcblxuICBjb25zdCBpdGVtcyA9IHJvd3MubWFwKHJvdyA9PiBqc29uVG9PYmplY3Q8UmF3SXRlbVR5cGU+KHJvdy5qc29uKSk7XG5cbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8SXRlbUtleVR5cGUsIHVua25vd24+ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBmb3IgKGNvbnN0IHsgaWQsIHZhbHVlIH0gb2YgaXRlbXMpIHtcbiAgICByZXN1bHRbaWRdID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0IGFzIHVua25vd24gYXMgU3RvcmVkQWxsSXRlbXNUeXBlO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlSXRlbUJ5SWQoaWQ6IEl0ZW1LZXlUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVCeUlkKGdldEluc3RhbmNlKCksIElURU1TX1RBQkxFLCBpZCk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxJdGVtcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHJlbW92ZUFsbEZyb21UYWJsZShnZXRJbnN0YW5jZSgpLCBJVEVNU19UQUJMRSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU2VuZGVyS2V5KGtleTogU2VuZGVyS2V5VHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBjcmVhdGVPclVwZGF0ZVNlbmRlcktleVN5bmMoa2V5KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlT3JVcGRhdGVTZW5kZXJLZXlTeW5jKGtleTogU2VuZGVyS2V5VHlwZSk6IHZvaWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgcHJlcGFyZShcbiAgICBkYixcbiAgICBgXG4gICAgSU5TRVJUIE9SIFJFUExBQ0UgSU5UTyBzZW5kZXJLZXlzIChcbiAgICAgIGlkLFxuICAgICAgc2VuZGVySWQsXG4gICAgICBkaXN0cmlidXRpb25JZCxcbiAgICAgIGRhdGEsXG4gICAgICBsYXN0VXBkYXRlZERhdGVcbiAgICApIHZhbHVlcyAoXG4gICAgICAkaWQsXG4gICAgICAkc2VuZGVySWQsXG4gICAgICAkZGlzdHJpYnV0aW9uSWQsXG4gICAgICAkZGF0YSxcbiAgICAgICRsYXN0VXBkYXRlZERhdGVcbiAgICApXG4gICAgYFxuICApLnJ1bihrZXkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VuZGVyS2V5QnlJZChcbiAgaWQ6IFNlbmRlcktleUlkVHlwZVxuKTogUHJvbWlzZTxTZW5kZXJLZXlUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93ID0gcHJlcGFyZShkYiwgJ1NFTEVDVCAqIEZST00gc2VuZGVyS2V5cyBXSEVSRSBpZCA9ICRpZCcpLmdldCh7XG4gICAgaWQsXG4gIH0pO1xuXG4gIHJldHVybiByb3c7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVBbGxTZW5kZXJLZXlzKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHByZXBhcmU8RW1wdHlRdWVyeT4oZGIsICdERUxFVEUgRlJPTSBzZW5kZXJLZXlzJykucnVuKCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTZW5kZXJLZXlzKCk6IFByb21pc2U8QXJyYXk8U2VuZGVyS2V5VHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzID0gcHJlcGFyZTxFbXB0eVF1ZXJ5PihkYiwgJ1NFTEVDVCAqIEZST00gc2VuZGVyS2V5cycpLmFsbCgpO1xuXG4gIHJldHVybiByb3dzO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2VuZGVyS2V5QnlJZChpZDogU2VuZGVyS2V5SWRUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcHJlcGFyZShkYiwgJ0RFTEVURSBGUk9NIHNlbmRlcktleXMgV0hFUkUgaWQgPSAkaWQnKS5ydW4oeyBpZCB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0U2VudFByb3RvKFxuICBwcm90bzogU2VudFByb3RvVHlwZSxcbiAgb3B0aW9uczoge1xuICAgIHJlY2lwaWVudHM6IFNlbnRSZWNpcGllbnRzVHlwZTtcbiAgICBtZXNzYWdlSWRzOiBTZW50TWVzc2FnZXNUeXBlO1xuICB9XG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHsgcmVjaXBpZW50cywgbWVzc2FnZUlkcyB9ID0gb3B0aW9ucztcblxuICAvLyBOb3RlOiB3ZSB1c2UgYHBsdWNrYCBpbiB0aGlzIGZ1bmN0aW9uIHRvIGZldGNoIG9ubHkgdGhlIGZpcnN0IGNvbHVtbiBvZiByZXR1cm5lZCByb3cuXG5cbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICAvLyAxLiBJbnNlcnQgdGhlIHBheWxvYWQsIGZldGNoaW5nIGl0cyBwcmltYXJ5IGtleSBpZFxuICAgIGNvbnN0IGluZm8gPSBwcmVwYXJlKFxuICAgICAgZGIsXG4gICAgICBgXG4gICAgICBJTlNFUlQgSU5UTyBzZW5kTG9nUGF5bG9hZHMgKFxuICAgICAgICBjb250ZW50SGludCxcbiAgICAgICAgcHJvdG8sXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50XG4gICAgICApIFZBTFVFUyAoXG4gICAgICAgICRjb250ZW50SGludCxcbiAgICAgICAgJHByb3RvLFxuICAgICAgICAkdGltZXN0YW1wLFxuICAgICAgICAkdXJnZW50XG4gICAgICApO1xuICAgICAgYFxuICAgICkucnVuKHtcbiAgICAgIC4uLnByb3RvLFxuICAgICAgdXJnZW50OiBwcm90by51cmdlbnQgPyAxIDogMCxcbiAgICB9KTtcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50T3JUaHJvdyhcbiAgICAgIGluZm8ubGFzdEluc2VydFJvd2lkLFxuICAgICAgJ2luc2VydFNlbnRQcm90by9sYXN0SW5zZXJ0Um93aWQnXG4gICAgKTtcblxuICAgIC8vIDIuIEluc2VydCBhIHJlY29yZCBmb3IgZWFjaCByZWNpcGllbnQgZGV2aWNlLlxuICAgIGNvbnN0IHJlY2lwaWVudFN0YXRlbWVudCA9IHByZXBhcmUoXG4gICAgICBkYixcbiAgICAgIGBcbiAgICAgIElOU0VSVCBJTlRPIHNlbmRMb2dSZWNpcGllbnRzIChcbiAgICAgICAgcGF5bG9hZElkLFxuICAgICAgICByZWNpcGllbnRVdWlkLFxuICAgICAgICBkZXZpY2VJZFxuICAgICAgKSBWQUxVRVMgKFxuICAgICAgICAkaWQsXG4gICAgICAgICRyZWNpcGllbnRVdWlkLFxuICAgICAgICAkZGV2aWNlSWRcbiAgICAgICk7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudFV1aWRzID0gT2JqZWN0LmtleXMocmVjaXBpZW50cyk7XG4gICAgZm9yIChjb25zdCByZWNpcGllbnRVdWlkIG9mIHJlY2lwaWVudFV1aWRzKSB7XG4gICAgICBjb25zdCBkZXZpY2VJZHMgPSByZWNpcGllbnRzW3JlY2lwaWVudFV1aWRdO1xuXG4gICAgICBmb3IgKGNvbnN0IGRldmljZUlkIG9mIGRldmljZUlkcykge1xuICAgICAgICByZWNpcGllbnRTdGF0ZW1lbnQucnVuKHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICByZWNpcGllbnRVdWlkLFxuICAgICAgICAgIGRldmljZUlkLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAyLiBJbnNlcnQgYSByZWNvcmQgZm9yIGVhY2ggbWVzc2FnZSByZWZlcmVuY2VkIGJ5IHRoaXMgcGF5bG9hZC5cbiAgICBjb25zdCBtZXNzYWdlU3RhdGVtZW50ID0gcHJlcGFyZShcbiAgICAgIGRiLFxuICAgICAgYFxuICAgICAgSU5TRVJUIElOVE8gc2VuZExvZ01lc3NhZ2VJZHMgKFxuICAgICAgICBwYXlsb2FkSWQsXG4gICAgICAgIG1lc3NhZ2VJZFxuICAgICAgKSBWQUxVRVMgKFxuICAgICAgICAkaWQsXG4gICAgICAgICRtZXNzYWdlSWRcbiAgICAgICk7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgbWVzc2FnZUlkIG9mIG1lc3NhZ2VJZHMpIHtcbiAgICAgIG1lc3NhZ2VTdGF0ZW1lbnQucnVuKHtcbiAgICAgICAgaWQsXG4gICAgICAgIG1lc3NhZ2VJZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbiAgfSkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU2VudFByb3Rvc09sZGVyVGhhbih0aW1lc3RhbXA6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgcHJlcGFyZShcbiAgICBkYixcbiAgICBgXG4gICAgREVMRVRFIEZST00gc2VuZExvZ1BheWxvYWRzXG4gICAgV0hFUkVcbiAgICAgIHRpbWVzdGFtcCBJUyBOVUxMIE9SXG4gICAgICB0aW1lc3RhbXAgPCAkdGltZXN0YW1wO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIHRpbWVzdGFtcCxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNlbnRQcm90b0J5TWVzc2FnZUlkKG1lc3NhZ2VJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBERUxFVEUgRlJPTSBzZW5kTG9nUGF5bG9hZHMgV0hFUkUgaWQgSU4gKFxuICAgICAgU0VMRUNUIHBheWxvYWRJZCBGUk9NIHNlbmRMb2dNZXNzYWdlSWRzXG4gICAgICBXSEVSRSBtZXNzYWdlSWQgPSAkbWVzc2FnZUlkXG4gICAgKTtcbiAgICBgXG4gICkucnVuKHtcbiAgICBtZXNzYWdlSWQsXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbnNlcnRQcm90b1JlY2lwaWVudHMoe1xuICBpZCxcbiAgcmVjaXBpZW50VXVpZCxcbiAgZGV2aWNlSWRzLFxufToge1xuICBpZDogbnVtYmVyO1xuICByZWNpcGllbnRVdWlkOiBzdHJpbmc7XG4gIGRldmljZUlkczogQXJyYXk8bnVtYmVyPjtcbn0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBwcmVwYXJlKFxuICAgICAgZGIsXG4gICAgICBgXG4gICAgICBJTlNFUlQgSU5UTyBzZW5kTG9nUmVjaXBpZW50cyAoXG4gICAgICAgIHBheWxvYWRJZCxcbiAgICAgICAgcmVjaXBpZW50VXVpZCxcbiAgICAgICAgZGV2aWNlSWRcbiAgICAgICkgVkFMVUVTIChcbiAgICAgICAgJGlkLFxuICAgICAgICAkcmVjaXBpZW50VXVpZCxcbiAgICAgICAgJGRldmljZUlkXG4gICAgICApO1xuICAgICAgYFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IGRldmljZUlkIG9mIGRldmljZUlkcykge1xuICAgICAgc3RhdGVtZW50LnJ1bih7XG4gICAgICAgIGlkLFxuICAgICAgICByZWNpcGllbnRVdWlkLFxuICAgICAgICBkZXZpY2VJZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU2VudFByb3RvUmVjaXBpZW50KFxuICBvcHRpb25zOlxuICAgIHwgRGVsZXRlU2VudFByb3RvUmVjaXBpZW50T3B0aW9uc1R5cGVcbiAgICB8IFJlYWRvbmx5QXJyYXk8RGVsZXRlU2VudFByb3RvUmVjaXBpZW50T3B0aW9uc1R5cGU+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGNvbnN0IGl0ZW1zID0gQXJyYXkuaXNBcnJheShvcHRpb25zKSA/IG9wdGlvbnMgOiBbb3B0aW9uc107XG5cbiAgLy8gTm90ZTogd2UgdXNlIGBwbHVja2AgaW4gdGhpcyBmdW5jdGlvbiB0byBmZXRjaCBvbmx5IHRoZSBmaXJzdCBjb2x1bW4gb2ZcbiAgLy8gcmV0dXJuZWQgcm93LlxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IHsgdGltZXN0YW1wLCByZWNpcGllbnRVdWlkLCBkZXZpY2VJZCB9ID0gaXRlbTtcblxuICAgICAgLy8gMS4gRmlndXJlIG91dCB3aGF0IHBheWxvYWQgd2UncmUgdGFsa2luZyBhYm91dC5cbiAgICAgIGNvbnN0IHJvd3MgPSBwcmVwYXJlKFxuICAgICAgICBkYixcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1Qgc2VuZExvZ1BheWxvYWRzLmlkIEZST00gc2VuZExvZ1BheWxvYWRzXG4gICAgICAgIElOTkVSIEpPSU4gc2VuZExvZ1JlY2lwaWVudHNcbiAgICAgICAgICBPTiBzZW5kTG9nUmVjaXBpZW50cy5wYXlsb2FkSWQgPSBzZW5kTG9nUGF5bG9hZHMuaWRcbiAgICAgICAgV0hFUkVcbiAgICAgICAgICBzZW5kTG9nUGF5bG9hZHMudGltZXN0YW1wID0gJHRpbWVzdGFtcCBBTkRcbiAgICAgICAgICBzZW5kTG9nUmVjaXBpZW50cy5yZWNpcGllbnRVdWlkID0gJHJlY2lwaWVudFV1aWQgQU5EXG4gICAgICAgICAgc2VuZExvZ1JlY2lwaWVudHMuZGV2aWNlSWQgPSAkZGV2aWNlSWQ7XG4gICAgICAgYFxuICAgICAgKS5hbGwoeyB0aW1lc3RhbXAsIHJlY2lwaWVudFV1aWQsIGRldmljZUlkIH0pO1xuICAgICAgaWYgKCFyb3dzLmxlbmd0aCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3dzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgICAgJ2RlbGV0ZVNlbnRQcm90b1JlY2lwaWVudDogTW9yZSB0aGFuIG9uZSBwYXlsb2FkIG1hdGNoZXMgJyArXG4gICAgICAgICAgICBgcmVjaXBpZW50IGFuZCB0aW1lc3RhbXAgJHt0aW1lc3RhbXB9LiBVc2luZyB0aGUgZmlyc3QuYFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBpZCB9ID0gcm93c1swXTtcblxuICAgICAgLy8gMi4gRGVsZXRlIHRoZSByZWNpcGllbnQvZGV2aWNlIGNvbWJpbmF0aW9uIGluIHF1ZXN0aW9uLlxuICAgICAgcHJlcGFyZShcbiAgICAgICAgZGIsXG4gICAgICAgIGBcbiAgICAgICAgREVMRVRFIEZST00gc2VuZExvZ1JlY2lwaWVudHNcbiAgICAgICAgV0hFUkVcbiAgICAgICAgICBwYXlsb2FkSWQgPSAkaWQgQU5EXG4gICAgICAgICAgcmVjaXBpZW50VXVpZCA9ICRyZWNpcGllbnRVdWlkIEFORFxuICAgICAgICAgIGRldmljZUlkID0gJGRldmljZUlkO1xuICAgICAgICBgXG4gICAgICApLnJ1bih7IGlkLCByZWNpcGllbnRVdWlkLCBkZXZpY2VJZCB9KTtcblxuICAgICAgLy8gMy4gU2VlIGhvdyBtYW55IG1vcmUgcmVjaXBpZW50IGRldmljZXMgdGhlcmUgd2VyZSBmb3IgdGhpcyBwYXlsb2FkLlxuICAgICAgY29uc3QgcmVtYWluaW5nID0gcHJlcGFyZShcbiAgICAgICAgZGIsXG4gICAgICAgICdTRUxFQ1QgY291bnQoKikgRlJPTSBzZW5kTG9nUmVjaXBpZW50cyBXSEVSRSBwYXlsb2FkSWQgPSAkaWQ7J1xuICAgICAgKVxuICAgICAgICAucGx1Y2sodHJ1ZSlcbiAgICAgICAgLmdldCh7IGlkIH0pO1xuXG4gICAgICBpZiAoIWlzTnVtYmVyKHJlbWFpbmluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdkZWxldGVTZW50UHJvdG9SZWNpcGllbnQ6IHNlbGVjdCBjb3VudCgpIHJldHVybmVkIG5vbi1udW1iZXIhJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gRGVsZXRlIHRoZSBlbnRpcmUgcGF5bG9hZCBpZiB0aGVyZSBhcmUgbm8gbW9yZSByZWNpcGllbnRzIGxlZnQuXG4gICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgJ2RlbGV0ZVNlbnRQcm90b1JlY2lwaWVudDogJyArXG4gICAgICAgICAgYERlbGV0aW5nIHByb3RvIHBheWxvYWQgZm9yIHRpbWVzdGFtcCAke3RpbWVzdGFtcH1gXG4gICAgICApO1xuICAgICAgcHJlcGFyZShkYiwgJ0RFTEVURSBGUk9NIHNlbmRMb2dQYXlsb2FkcyBXSEVSRSBpZCA9ICRpZDsnKS5ydW4oe1xuICAgICAgICBpZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VudFByb3RvQnlSZWNpcGllbnQoe1xuICBub3csXG4gIHJlY2lwaWVudFV1aWQsXG4gIHRpbWVzdGFtcCxcbn06IHtcbiAgbm93OiBudW1iZXI7XG4gIHJlY2lwaWVudFV1aWQ6IHN0cmluZztcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59KTogUHJvbWlzZTxTZW50UHJvdG9XaXRoTWVzc2FnZUlkc1R5cGUgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGNvbnN0IEhPVVIgPSAxMDAwICogNjAgKiA2MDtcbiAgY29uc3Qgb25lRGF5QWdvID0gbm93IC0gSE9VUiAqIDI0O1xuXG4gIGF3YWl0IGRlbGV0ZVNlbnRQcm90b3NPbGRlclRoYW4ob25lRGF5QWdvKTtcblxuICBjb25zdCByb3cgPSBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBTRUxFQ1RcbiAgICAgIHNlbmRMb2dQYXlsb2Fkcy4qLFxuICAgICAgR1JPVVBfQ09OQ0FUKERJU1RJTkNUIHNlbmRMb2dNZXNzYWdlSWRzLm1lc3NhZ2VJZCkgQVMgbWVzc2FnZUlkc1xuICAgIEZST00gc2VuZExvZ1BheWxvYWRzXG4gICAgSU5ORVIgSk9JTiBzZW5kTG9nUmVjaXBpZW50cyBPTiBzZW5kTG9nUmVjaXBpZW50cy5wYXlsb2FkSWQgPSBzZW5kTG9nUGF5bG9hZHMuaWRcbiAgICBMRUZUIEpPSU4gc2VuZExvZ01lc3NhZ2VJZHMgT04gc2VuZExvZ01lc3NhZ2VJZHMucGF5bG9hZElkID0gc2VuZExvZ1BheWxvYWRzLmlkXG4gICAgV0hFUkVcbiAgICAgIHNlbmRMb2dQYXlsb2Fkcy50aW1lc3RhbXAgPSAkdGltZXN0YW1wIEFORFxuICAgICAgc2VuZExvZ1JlY2lwaWVudHMucmVjaXBpZW50VXVpZCA9ICRyZWNpcGllbnRVdWlkXG4gICAgR1JPVVAgQlkgc2VuZExvZ1BheWxvYWRzLmlkO1xuICAgIGBcbiAgKS5nZXQoe1xuICAgIHRpbWVzdGFtcCxcbiAgICByZWNpcGllbnRVdWlkLFxuICB9KTtcblxuICBpZiAoIXJvdykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB7IG1lc3NhZ2VJZHMgfSA9IHJvdztcbiAgcmV0dXJuIHtcbiAgICAuLi5yb3csXG4gICAgdXJnZW50OiBpc051bWJlcihyb3cudXJnZW50KSA/IEJvb2xlYW4ocm93LnVyZ2VudCkgOiB0cnVlLFxuICAgIG1lc3NhZ2VJZHM6IG1lc3NhZ2VJZHMgPyBtZXNzYWdlSWRzLnNwbGl0KCcsJykgOiBbXSxcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbFNlbnRQcm90b3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcHJlcGFyZTxFbXB0eVF1ZXJ5PihkYiwgJ0RFTEVURSBGUk9NIHNlbmRMb2dQYXlsb2FkczsnKS5ydW4oKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFNlbnRQcm90b3MoKTogUHJvbWlzZTxBcnJheTxTZW50UHJvdG9UeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvd3MgPSBwcmVwYXJlPEVtcHR5UXVlcnk+KGRiLCAnU0VMRUNUICogRlJPTSBzZW5kTG9nUGF5bG9hZHM7JykuYWxsKCk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiAoe1xuICAgIC4uLnJvdyxcbiAgICB1cmdlbnQ6IGlzTnVtYmVyKHJvdy51cmdlbnQpID8gQm9vbGVhbihyb3cudXJnZW50KSA6IHRydWUsXG4gIH0pKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCk6IFByb21pc2U8XG4gIEFycmF5PFNlbnRSZWNpcGllbnRzREJUeXBlPlxuPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93cyA9IHByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgZGIsXG4gICAgJ1NFTEVDVCAqIEZST00gc2VuZExvZ1JlY2lwaWVudHM7J1xuICApLmFsbCgpO1xuXG4gIHJldHVybiByb3dzO1xufVxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMoKTogUHJvbWlzZTxBcnJheTxTZW50TWVzc2FnZURCVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzID0gcHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICBkYixcbiAgICAnU0VMRUNUICogRlJPTSBzZW5kTG9nTWVzc2FnZUlkczsnXG4gICkuYWxsKCk7XG5cbiAgcmV0dXJuIHJvd3M7XG59XG5cbmNvbnN0IFNFU1NJT05TX1RBQkxFID0gJ3Nlc3Npb25zJztcbmZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvblN5bmMoZGF0YTogU2Vzc2lvblR5cGUpOiB2b2lkIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCB7IGlkLCBjb252ZXJzYXRpb25JZCwgb3VyVXVpZCwgdXVpZCB9ID0gZGF0YTtcbiAgaWYgKCFpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdjcmVhdGVPclVwZGF0ZVNlc3Npb246IFByb3ZpZGVkIGRhdGEgZGlkIG5vdCBoYXZlIGEgdHJ1dGh5IGlkJ1xuICAgICk7XG4gIH1cbiAgaWYgKCFjb252ZXJzYXRpb25JZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdjcmVhdGVPclVwZGF0ZVNlc3Npb246IFByb3ZpZGVkIGRhdGEgZGlkIG5vdCBoYXZlIGEgdHJ1dGh5IGNvbnZlcnNhdGlvbklkJ1xuICAgICk7XG4gIH1cblxuICBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBJTlNFUlQgT1IgUkVQTEFDRSBJTlRPIHNlc3Npb25zIChcbiAgICAgIGlkLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBvdXJVdWlkLFxuICAgICAgdXVpZCxcbiAgICAgIGpzb25cbiAgICApIHZhbHVlcyAoXG4gICAgICAkaWQsXG4gICAgICAkY29udmVyc2F0aW9uSWQsXG4gICAgICAkb3VyVXVpZCxcbiAgICAgICR1dWlkLFxuICAgICAgJGpzb25cbiAgICApXG4gICAgYFxuICApLnJ1bih7XG4gICAgaWQsXG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAgb3VyVXVpZCxcbiAgICB1dWlkLFxuICAgIGpzb246IG9iamVjdFRvSlNPTihkYXRhKSxcbiAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVNlc3Npb24oZGF0YTogU2Vzc2lvblR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvblN5bmMoZGF0YSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlU2Vzc2lvbnMoXG4gIGFycmF5OiBBcnJheTxTZXNzaW9uVHlwZT5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnJheSkge1xuICAgICAgYXNzZXJ0U3luYyhjcmVhdGVPclVwZGF0ZVNlc3Npb25TeW5jKGl0ZW0pKTtcbiAgICB9XG4gIH0pKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbW1pdERlY3J5cHRSZXN1bHQoe1xuICBzZW5kZXJLZXlzLFxuICBzZXNzaW9ucyxcbiAgdW5wcm9jZXNzZWQsXG59OiB7XG4gIHNlbmRlcktleXM6IEFycmF5PFNlbmRlcktleVR5cGU+O1xuICBzZXNzaW9uczogQXJyYXk8U2Vzc2lvblR5cGU+O1xuICB1bnByb2Nlc3NlZDogQXJyYXk8VW5wcm9jZXNzZWRUeXBlPjtcbn0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VuZGVyS2V5cykge1xuICAgICAgYXNzZXJ0U3luYyhjcmVhdGVPclVwZGF0ZVNlbmRlcktleVN5bmMoaXRlbSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZXNzaW9ucykge1xuICAgICAgYXNzZXJ0U3luYyhjcmVhdGVPclVwZGF0ZVNlc3Npb25TeW5jKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdW5wcm9jZXNzZWQpIHtcbiAgICAgIGFzc2VydFN5bmMoc2F2ZVVucHJvY2Vzc2VkU3luYyhpdGVtKSk7XG4gICAgfVxuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBidWxrQWRkU2Vzc2lvbnMoYXJyYXk6IEFycmF5PFNlc3Npb25UeXBlPik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gYnVsa0FkZChnZXRJbnN0YW5jZSgpLCBTRVNTSU9OU19UQUJMRSwgYXJyYXkpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlU2Vzc2lvbkJ5SWQoaWQ6IFNlc3Npb25JZFR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHJlbW92ZUJ5SWQoZ2V0SW5zdGFuY2UoKSwgU0VTU0lPTlNfVEFCTEUsIGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVNlc3Npb25zQnlDb252ZXJzYXRpb24oXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBERUxFVEUgRlJPTSBzZXNzaW9uc1xuICAgIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIGNvbnZlcnNhdGlvbklkLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbFNlc3Npb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gcmVtb3ZlQWxsRnJvbVRhYmxlKGdldEluc3RhbmNlKCksIFNFU1NJT05TX1RBQkxFKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFNlc3Npb25zKCk6IFByb21pc2U8QXJyYXk8U2Vzc2lvblR5cGU+PiB7XG4gIHJldHVybiBnZXRBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgU0VTU0lPTlNfVEFCTEUpO1xufVxuLy8gQ29udmVyc2F0aW9uc1xuXG5hc3luYyBmdW5jdGlvbiBnZXRDb252ZXJzYXRpb25Db3VudCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gZ2V0Q291bnRGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgJ2NvbnZlcnNhdGlvbnMnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udmVyc2F0aW9uTWVtYmVyc0xpc3QoeyBtZW1iZXJzLCBtZW1iZXJzVjIgfTogQ29udmVyc2F0aW9uVHlwZSkge1xuICBpZiAobWVtYmVyc1YyKSB7XG4gICAgcmV0dXJuIG1lbWJlcnNWMi5tYXAoKGl0ZW06IEdyb3VwVjJNZW1iZXJUeXBlKSA9PiBpdGVtLnV1aWQpLmpvaW4oJyAnKTtcbiAgfVxuICBpZiAobWVtYmVycykge1xuICAgIHJldHVybiBtZW1iZXJzLmpvaW4oJyAnKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gc2F2ZUNvbnZlcnNhdGlvblN5bmMoXG4gIGRhdGE6IENvbnZlcnNhdGlvblR5cGUsXG4gIGRiID0gZ2V0SW5zdGFuY2UoKVxuKTogdm9pZCB7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVfYXQsXG4gICAgZTE2NCxcbiAgICBncm91cElkLFxuICAgIGlkLFxuICAgIG5hbWUsXG4gICAgcHJvZmlsZUZhbWlseU5hbWUsXG4gICAgcHJvZmlsZU5hbWUsXG4gICAgcHJvZmlsZUxhc3RGZXRjaGVkQXQsXG4gICAgdHlwZSxcbiAgICB1dWlkLFxuICB9ID0gZGF0YTtcblxuICBjb25zdCBtZW1iZXJzTGlzdCA9IGdldENvbnZlcnNhdGlvbk1lbWJlcnNMaXN0KGRhdGEpO1xuXG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBJTlNFUlQgSU5UTyBjb252ZXJzYXRpb25zIChcbiAgICAgIGlkLFxuICAgICAganNvbixcblxuICAgICAgZTE2NCxcbiAgICAgIHV1aWQsXG4gICAgICBncm91cElkLFxuXG4gICAgICBhY3RpdmVfYXQsXG4gICAgICB0eXBlLFxuICAgICAgbWVtYmVycyxcbiAgICAgIG5hbWUsXG4gICAgICBwcm9maWxlTmFtZSxcbiAgICAgIHByb2ZpbGVGYW1pbHlOYW1lLFxuICAgICAgcHJvZmlsZUZ1bGxOYW1lLFxuICAgICAgcHJvZmlsZUxhc3RGZXRjaGVkQXRcbiAgICApIHZhbHVlcyAoXG4gICAgICAkaWQsXG4gICAgICAkanNvbixcblxuICAgICAgJGUxNjQsXG4gICAgICAkdXVpZCxcbiAgICAgICRncm91cElkLFxuXG4gICAgICAkYWN0aXZlX2F0LFxuICAgICAgJHR5cGUsXG4gICAgICAkbWVtYmVycyxcbiAgICAgICRuYW1lLFxuICAgICAgJHByb2ZpbGVOYW1lLFxuICAgICAgJHByb2ZpbGVGYW1pbHlOYW1lLFxuICAgICAgJHByb2ZpbGVGdWxsTmFtZSxcbiAgICAgICRwcm9maWxlTGFzdEZldGNoZWRBdFxuICAgICk7XG4gICAgYFxuICApLnJ1bih7XG4gICAgaWQsXG4gICAganNvbjogb2JqZWN0VG9KU09OKFxuICAgICAgb21pdChkYXRhLCBbJ3Byb2ZpbGVMYXN0RmV0Y2hlZEF0JywgJ3VuYmx1cnJlZEF2YXRhclBhdGgnXSlcbiAgICApLFxuXG4gICAgZTE2NDogZTE2NCB8fCBudWxsLFxuICAgIHV1aWQ6IHV1aWQgfHwgbnVsbCxcbiAgICBncm91cElkOiBncm91cElkIHx8IG51bGwsXG5cbiAgICBhY3RpdmVfYXQ6IGFjdGl2ZV9hdCB8fCBudWxsLFxuICAgIHR5cGUsXG4gICAgbWVtYmVyczogbWVtYmVyc0xpc3QsXG4gICAgbmFtZTogbmFtZSB8fCBudWxsLFxuICAgIHByb2ZpbGVOYW1lOiBwcm9maWxlTmFtZSB8fCBudWxsLFxuICAgIHByb2ZpbGVGYW1pbHlOYW1lOiBwcm9maWxlRmFtaWx5TmFtZSB8fCBudWxsLFxuICAgIHByb2ZpbGVGdWxsTmFtZTogY29tYmluZU5hbWVzKHByb2ZpbGVOYW1lLCBwcm9maWxlRmFtaWx5TmFtZSkgfHwgbnVsbCxcbiAgICBwcm9maWxlTGFzdEZldGNoZWRBdDogcHJvZmlsZUxhc3RGZXRjaGVkQXQgfHwgbnVsbCxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVDb252ZXJzYXRpb24oXG4gIGRhdGE6IENvbnZlcnNhdGlvblR5cGUsXG4gIGRiID0gZ2V0SW5zdGFuY2UoKVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBzYXZlQ29udmVyc2F0aW9uU3luYyhkYXRhLCBkYik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVDb252ZXJzYXRpb25zKFxuICBhcnJheU9mQ29udmVyc2F0aW9uczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGZvciAoY29uc3QgY29udmVyc2F0aW9uIG9mIGFycmF5T2ZDb252ZXJzYXRpb25zKSB7XG4gICAgICBhc3NlcnRTeW5jKHNhdmVDb252ZXJzYXRpb25TeW5jKGNvbnZlcnNhdGlvbikpO1xuICAgIH1cbiAgfSkoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29udmVyc2F0aW9uU3luYyhcbiAgZGF0YTogQ29udmVyc2F0aW9uVHlwZSxcbiAgZGIgPSBnZXRJbnN0YW5jZSgpXG4pOiB2b2lkIHtcbiAgY29uc3Qge1xuICAgIGlkLFxuICAgIGFjdGl2ZV9hdCxcbiAgICB0eXBlLFxuICAgIG5hbWUsXG4gICAgcHJvZmlsZU5hbWUsXG4gICAgcHJvZmlsZUZhbWlseU5hbWUsXG4gICAgcHJvZmlsZUxhc3RGZXRjaGVkQXQsXG4gICAgZTE2NCxcbiAgICB1dWlkLFxuICB9ID0gZGF0YTtcblxuICBjb25zdCBtZW1iZXJzTGlzdCA9IGdldENvbnZlcnNhdGlvbk1lbWJlcnNMaXN0KGRhdGEpO1xuXG4gIGRiLnByZXBhcmUoXG4gICAgYFxuICAgIFVQREFURSBjb252ZXJzYXRpb25zIFNFVFxuICAgICAganNvbiA9ICRqc29uLFxuXG4gICAgICBlMTY0ID0gJGUxNjQsXG4gICAgICB1dWlkID0gJHV1aWQsXG5cbiAgICAgIGFjdGl2ZV9hdCA9ICRhY3RpdmVfYXQsXG4gICAgICB0eXBlID0gJHR5cGUsXG4gICAgICBtZW1iZXJzID0gJG1lbWJlcnMsXG4gICAgICBuYW1lID0gJG5hbWUsXG4gICAgICBwcm9maWxlTmFtZSA9ICRwcm9maWxlTmFtZSxcbiAgICAgIHByb2ZpbGVGYW1pbHlOYW1lID0gJHByb2ZpbGVGYW1pbHlOYW1lLFxuICAgICAgcHJvZmlsZUZ1bGxOYW1lID0gJHByb2ZpbGVGdWxsTmFtZSxcbiAgICAgIHByb2ZpbGVMYXN0RmV0Y2hlZEF0ID0gJHByb2ZpbGVMYXN0RmV0Y2hlZEF0XG4gICAgV0hFUkUgaWQgPSAkaWQ7XG4gICAgYFxuICApLnJ1bih7XG4gICAgaWQsXG4gICAganNvbjogb2JqZWN0VG9KU09OKFxuICAgICAgb21pdChkYXRhLCBbJ3Byb2ZpbGVMYXN0RmV0Y2hlZEF0JywgJ3VuYmx1cnJlZEF2YXRhclBhdGgnXSlcbiAgICApLFxuXG4gICAgZTE2NDogZTE2NCB8fCBudWxsLFxuICAgIHV1aWQ6IHV1aWQgfHwgbnVsbCxcblxuICAgIGFjdGl2ZV9hdDogYWN0aXZlX2F0IHx8IG51bGwsXG4gICAgdHlwZSxcbiAgICBtZW1iZXJzOiBtZW1iZXJzTGlzdCxcbiAgICBuYW1lOiBuYW1lIHx8IG51bGwsXG4gICAgcHJvZmlsZU5hbWU6IHByb2ZpbGVOYW1lIHx8IG51bGwsXG4gICAgcHJvZmlsZUZhbWlseU5hbWU6IHByb2ZpbGVGYW1pbHlOYW1lIHx8IG51bGwsXG4gICAgcHJvZmlsZUZ1bGxOYW1lOiBjb21iaW5lTmFtZXMocHJvZmlsZU5hbWUsIHByb2ZpbGVGYW1pbHlOYW1lKSB8fCBudWxsLFxuICAgIHByb2ZpbGVMYXN0RmV0Y2hlZEF0OiBwcm9maWxlTGFzdEZldGNoZWRBdCB8fCBudWxsLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ29udmVyc2F0aW9uKGRhdGE6IENvbnZlcnNhdGlvblR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHVwZGF0ZUNvbnZlcnNhdGlvblN5bmMoZGF0YSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbnZlcnNhdGlvbnMoXG4gIGFycmF5OiBBcnJheTxDb252ZXJzYXRpb25UeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGFycmF5KSB7XG4gICAgICBhc3NlcnRTeW5jKHVwZGF0ZUNvbnZlcnNhdGlvblN5bmMoaXRlbSkpO1xuICAgIH1cbiAgfSkoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udmVyc2F0aW9uc1N5bmMoaWRzOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICAvLyBPdXIgbm9kZSBpbnRlcmZhY2UgZG9lc24ndCBzZWVtIHRvIGFsbG93IHlvdSB0byByZXBsYWNlIG9uZSBzaW5nbGUgPyB3aXRoIGFuIGFycmF5XG4gIGRiLnByZXBhcmU8QXJyYXlRdWVyeT4oXG4gICAgYFxuICAgIERFTEVURSBGUk9NIGNvbnZlcnNhdGlvbnNcbiAgICBXSEVSRSBpZCBJTiAoICR7aWRzLm1hcCgoKSA9PiAnPycpLmpvaW4oJywgJyl9ICk7XG4gICAgYFxuICApLnJ1bihpZHMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVDb252ZXJzYXRpb24oaWQ6IEFycmF5PHN0cmluZz4gfCBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShpZCkpIHtcbiAgICBkYi5wcmVwYXJlPFF1ZXJ5PignREVMRVRFIEZST00gY29udmVyc2F0aW9ucyBXSEVSRSBpZCA9ICRpZDsnKS5ydW4oe1xuICAgICAgaWQsXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWlkLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlQ29udmVyc2F0aW9uOiBObyBpZHMgdG8gZGVsZXRlIScpO1xuICB9XG5cbiAgYmF0Y2hNdWx0aVZhclF1ZXJ5KGRiLCBpZCwgcmVtb3ZlQ29udmVyc2F0aW9uc1N5bmMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlQWxsQ29udmVyc2F0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KCdERUxFVEUgZnJvbSBjb252ZXJzYXRpb25zOycpLnJ1bigpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb252ZXJzYXRpb25CeUlkKFxuICBpZDogc3RyaW5nXG4pOiBQcm9taXNlPENvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3c6IHsganNvbjogc3RyaW5nIH0gPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PignU0VMRUNUIGpzb24gRlJPTSBjb252ZXJzYXRpb25zIFdIRVJFIGlkID0gJGlkOycpXG4gICAgLmdldCh7IGlkIH0pO1xuXG4gIGlmICghcm93KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBqc29uVG9PYmplY3Qocm93Lmpzb24pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBlcmFzZVN0b3JhZ2VTZXJ2aWNlU3RhdGVGcm9tQ29udmVyc2F0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgYFxuICAgIFVQREFURSBjb252ZXJzYXRpb25zXG4gICAgU0VUXG4gICAgICBqc29uID0ganNvbl9yZW1vdmUoanNvbiwgJyQuc3RvcmFnZUlEJywgJyQubmVlZHNTdG9yYWdlU2VydmljZVN5bmMnLCAnJC51bmtub3duRmllbGRzJywgJyQuc3RvcmFnZVByb2ZpbGVLZXknKTtcbiAgICBgXG4gICkucnVuKCk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbENvbnZlcnNhdGlvbnNTeW5jKGRiID0gZ2V0SW5zdGFuY2UoKSk6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+IHtcbiAgY29uc3Qgcm93czogQ29udmVyc2F0aW9uUm93cyA9IGRiXG4gICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QganNvbiwgcHJvZmlsZUxhc3RGZXRjaGVkQXRcbiAgICAgIEZST00gY29udmVyc2F0aW9uc1xuICAgICAgT1JERVIgQlkgaWQgQVNDO1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKCk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiByb3dUb0NvbnZlcnNhdGlvbihyb3cpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQ29udmVyc2F0aW9ucygpOiBQcm9taXNlPEFycmF5PENvbnZlcnNhdGlvblR5cGU+PiB7XG4gIHJldHVybiBnZXRBbGxDb252ZXJzYXRpb25zU3luYygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxDb252ZXJzYXRpb25JZHMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogQXJyYXk8eyBpZDogc3RyaW5nIH0+ID0gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBpZCBGUk9NIGNvbnZlcnNhdGlvbnMgT1JERVIgQlkgaWQgQVNDO1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKCk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiByb3cuaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKFxuICB1dWlkOiBVVUlEU3RyaW5nVHlwZVxuKTogUHJvbWlzZTxBcnJheTxDb252ZXJzYXRpb25UeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvd3M6IENvbnZlcnNhdGlvblJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uLCBwcm9maWxlTGFzdEZldGNoZWRBdFxuICAgICAgRlJPTSBjb252ZXJzYXRpb25zIFdIRVJFXG4gICAgICAgIHR5cGUgPSAnZ3JvdXAnIEFORFxuICAgICAgICBtZW1iZXJzIExJS0UgJHV1aWRcbiAgICAgIE9SREVSIEJZIGlkIEFTQztcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7XG4gICAgICB1dWlkOiBgJSR7dXVpZH0lYCxcbiAgICB9KTtcblxuICByZXR1cm4gcm93cy5tYXAocm93ID0+IHJvd1RvQ29udmVyc2F0aW9uKHJvdykpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZWFyY2hNZXNzYWdlcyhcbiAgcXVlcnk6IHN0cmluZyxcbiAgcGFyYW1zOiB7IGxpbWl0PzogbnVtYmVyOyBjb252ZXJzYXRpb25JZD86IHN0cmluZyB9ID0ge31cbik6IFByb21pc2U8QXJyYXk8U2VydmVyU2VhcmNoUmVzdWx0TWVzc2FnZVR5cGU+PiB7XG4gIGNvbnN0IHsgbGltaXQgPSA1MDAsIGNvbnZlcnNhdGlvbklkIH0gPSBwYXJhbXM7XG5cbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIC8vIHNxbGl0ZSBxdWVyaWVzIHdpdGggYSBqb2luIG9uIGEgdmlydHVhbCB0YWJsZSAobGlrZSBGVFM1KSBhcmUgZGUtb3B0aW1pemVkXG4gIC8vIGFuZCBjYW4ndCB1c2UgaW5kaWNlcyBmb3Igb3JkZXJpbmcgcmVzdWx0cy4gSW5zdGVhZCBhbiBpbi1tZW1vcnkgaW5kZXggb2ZcbiAgLy8gdGhlIGpvaW4gcm93cyBpcyBzb3J0ZWQgb24gdGhlIGZseSwgYW5kIHRoaXMgYmVjb21lcyBzdWJzdGFudGlhbGx5XG4gIC8vIHNsb3dlciB3aGVuIHRoZXJlIGFyZSBsYXJnZSBjb2x1bW5zIGluIGl0IChsaWtlIGBtZXNzYWdlcy5qc29uYCkuXG4gIC8vXG4gIC8vIFRodXMgaGVyZSB3ZSB0YWtlIGFuIGluZGlyZWN0IGFwcHJvYWNoIGFuZCBzdG9yZSBgcm93aWRgcyBpbiBhIHRlbXBvcmFyeVxuICAvLyB0YWJsZSBmb3IgYWxsIG1lc3NhZ2VzIHRoYXQgbWF0Y2ggdGhlIEZUUyBxdWVyeS4gVGhlbiB3ZSBjcmVhdGUgYW5vdGhlclxuICAvLyB0YWJsZSB0byBzb3J0IGFuZCBsaW1pdCB0aGUgcmVzdWx0cywgYW5kIGZpbmFsbHkgam9pbiBvbiBpdCB3aGVuIGZldGNoXG4gIC8vIHRoZSBzbmlwcGV0cyBhbmQganNvbi4gVGhlIGJlbmVmaXQgb2YgdGhpcyBpcyB0aGF0IHRoZSBgT1JERVIgQllgIGFuZFxuICAvLyBgTElNSVRgIGhhcHBlbiB3aXRob3V0IHZpcnR1YWwgdGFibGUgYW5kIGFyZSB0aHVzIGNvdmVyZWQgYnlcbiAgLy8gYG1lc3NhZ2VzX3NlYXJjaE9yZGVyYCBpbmRleC5cbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKFxuICAgICAgYFxuICAgICAgQ1JFQVRFIFRFTVAgVEFCTEUgdG1wX3Jlc3VsdHMocm93aWQgSU5URUdFUiBQUklNQVJZIEtFWSBBU0MpO1xuICAgICAgQ1JFQVRFIFRFTVAgVEFCTEUgdG1wX2ZpbHRlcmVkX3Jlc3VsdHMocm93aWQgSU5URUdFUiBQUklNQVJZIEtFWSBBU0MpO1xuICAgICAgYFxuICAgICk7XG5cbiAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gdG1wX3Jlc3VsdHMgKHJvd2lkKVxuICAgICAgICBTRUxFQ1RcbiAgICAgICAgICByb3dpZFxuICAgICAgICBGUk9NXG4gICAgICAgICAgbWVzc2FnZXNfZnRzXG4gICAgICAgIFdIRVJFXG4gICAgICAgICAgbWVzc2FnZXNfZnRzLmJvZHkgTUFUQ0ggJHF1ZXJ5O1xuICAgICAgYFxuICAgICkucnVuKHsgcXVlcnkgfSk7XG5cbiAgICBpZiAoY29udmVyc2F0aW9uSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgICBJTlNFUlQgSU5UTyB0bXBfZmlsdGVyZWRfcmVzdWx0cyAocm93aWQpXG4gICAgICAgICAgU0VMRUNUXG4gICAgICAgICAgICB0bXBfcmVzdWx0cy5yb3dpZFxuICAgICAgICAgIEZST01cbiAgICAgICAgICAgIHRtcF9yZXN1bHRzXG4gICAgICAgICAgSU5ORVIgSk9JTlxuICAgICAgICAgICAgbWVzc2FnZXMgT04gbWVzc2FnZXMucm93aWQgPSB0bXBfcmVzdWx0cy5yb3dpZFxuICAgICAgICAgIE9SREVSIEJZIG1lc3NhZ2VzLnJlY2VpdmVkX2F0IERFU0MsIG1lc3NhZ2VzLnNlbnRfYXQgREVTQ1xuICAgICAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgICAgYFxuICAgICAgKS5ydW4oeyBsaW1pdCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgICBJTlNFUlQgSU5UTyB0bXBfZmlsdGVyZWRfcmVzdWx0cyAocm93aWQpXG4gICAgICAgICAgU0VMRUNUXG4gICAgICAgICAgICB0bXBfcmVzdWx0cy5yb3dpZFxuICAgICAgICAgIEZST01cbiAgICAgICAgICAgIHRtcF9yZXN1bHRzXG4gICAgICAgICAgSU5ORVIgSk9JTlxuICAgICAgICAgICAgbWVzc2FnZXMgT04gbWVzc2FnZXMucm93aWQgPSB0bXBfcmVzdWx0cy5yb3dpZFxuICAgICAgICAgIFdIRVJFXG4gICAgICAgICAgICBtZXNzYWdlcy5jb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZFxuICAgICAgICAgIE9SREVSIEJZIG1lc3NhZ2VzLnJlY2VpdmVkX2F0IERFU0MsIG1lc3NhZ2VzLnNlbnRfYXQgREVTQ1xuICAgICAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgICAgYFxuICAgICAgKS5ydW4oeyBjb252ZXJzYXRpb25JZCwgbGltaXQgfSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGBNQVRDSGAgaXMgbmVjZXNzYXJ5IGluIG9yZGVyIHRvIGZvciBgc25pcHBldCgpYCBoZWxwZXIgZnVuY3Rpb24gdG9cbiAgICAvLyBnaXZlIHVzIHRoZSByaWdodCByZXN1bHRzLiBXZSBjYW4ndCBjYWxsIGBzbmlwcGV0KClgIGluIHRoZSBxdWVyeSBhYm92ZVxuICAgIC8vIGJlY2F1c2UgaXQgd291bGQgYmxvYXQgdGhlIHRlbXBvcmFyeSB0YWJsZSB3aXRoIHRleHQgZGF0YSBhbmQgd2Ugd2FudFxuICAgIC8vIHRvIGtlZXAgaXRzIHNpemUgbWluaW1hbCBmb3IgYE9SREVSIEJZYCArIGBMSU1JVGAgdG8gYmUgZmFzdC5cbiAgICBjb25zdCByZXN1bHQgPSBkYlxuICAgICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIFNFTEVDVFxuICAgICAgICAgIG1lc3NhZ2VzLmpzb24sXG4gICAgICAgICAgc25pcHBldChtZXNzYWdlc19mdHMsIC0xLCAnPDxsZWZ0Pj4nLCAnPDxyaWdodD4+JywgJy4uLicsIDEwKVxuICAgICAgICAgICAgQVMgc25pcHBldFxuICAgICAgICBGUk9NIHRtcF9maWx0ZXJlZF9yZXN1bHRzXG4gICAgICAgIElOTkVSIEpPSU4gbWVzc2FnZXNfZnRzXG4gICAgICAgICAgT04gbWVzc2FnZXNfZnRzLnJvd2lkID0gdG1wX2ZpbHRlcmVkX3Jlc3VsdHMucm93aWRcbiAgICAgICAgSU5ORVIgSk9JTiBtZXNzYWdlc1xuICAgICAgICAgIE9OIG1lc3NhZ2VzLnJvd2lkID0gdG1wX2ZpbHRlcmVkX3Jlc3VsdHMucm93aWRcbiAgICAgICAgV0hFUkVcbiAgICAgICAgICBtZXNzYWdlc19mdHMuYm9keSBNQVRDSCAkcXVlcnlcbiAgICAgICAgT1JERVIgQlkgbWVzc2FnZXMucmVjZWl2ZWRfYXQgREVTQywgbWVzc2FnZXMuc2VudF9hdCBERVNDO1xuICAgICAgICBgXG4gICAgICApXG4gICAgICAuYWxsKHsgcXVlcnkgfSk7XG5cbiAgICBkYi5leGVjKFxuICAgICAgYFxuICAgICAgRFJPUCBUQUJMRSB0bXBfcmVzdWx0cztcbiAgICAgIERST1AgVEFCTEUgdG1wX2ZpbHRlcmVkX3Jlc3VsdHM7XG4gICAgICBgXG4gICAgKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaE1lc3NhZ2VzSW5Db252ZXJzYXRpb24oXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIHsgbGltaXQgPSAxMDAgfTogeyBsaW1pdD86IG51bWJlciB9ID0ge31cbik6IFByb21pc2U8QXJyYXk8U2VydmVyU2VhcmNoUmVzdWx0TWVzc2FnZVR5cGU+PiB7XG4gIHJldHVybiBzZWFyY2hNZXNzYWdlcyhxdWVyeSwgeyBjb252ZXJzYXRpb25JZCwgbGltaXQgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2VDb3VudFN5bmMoXG4gIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nLFxuICBkYiA9IGdldEluc3RhbmNlKClcbik6IG51bWJlciB7XG4gIGlmIChjb252ZXJzYXRpb25JZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldENvdW50RnJvbVRhYmxlKGRiLCAnbWVzc2FnZXMnKTtcbiAgfVxuXG4gIGNvbnN0IGNvdW50ID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICAgIFNFTEVDVCBjb3VudCgqKVxuICAgICAgICBGUk9NIG1lc3NhZ2VzXG4gICAgICAgIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkO1xuICAgICAgICBgXG4gICAgKVxuICAgIC5wbHVjaygpXG4gICAgLmdldCh7IGNvbnZlcnNhdGlvbklkIH0pO1xuXG4gIHJldHVybiBjb3VudDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcnlDb3VudChjb252ZXJzYXRpb25JZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICAgIFNFTEVDVCBjb3VudCgqKVxuICAgICAgICBGUk9NIG1lc3NhZ2VzXG4gICAgICAgIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkIEFORCBpc1N0b3J5ID0gMTtcbiAgICAgICAgYFxuICAgIClcbiAgICAucGx1Y2soKVxuICAgIC5nZXQoeyBjb252ZXJzYXRpb25JZCB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUNvdW50KGNvbnZlcnNhdGlvbklkPzogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGdldE1lc3NhZ2VDb3VudFN5bmMoY29udmVyc2F0aW9uSWQpO1xufVxuXG5mdW5jdGlvbiBoYXNVc2VySW5pdGlhdGVkTWVzc2FnZXMoY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgY29uc3Qgcm93OiB7IGNvdW50OiBudW1iZXIgfSA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIENPVU5UKCopIGFzIGNvdW50IEZST01cbiAgICAgICAgKFxuICAgICAgICAgIFNFTEVDVCAxIEZST00gbWVzc2FnZXNcbiAgICAgICAgICBXSEVSRVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgICAgICBpc1VzZXJJbml0aWF0ZWRNZXNzYWdlID0gMVxuICAgICAgICAgIExJTUlUIDFcbiAgICAgICAgKTtcbiAgICAgIGBcbiAgICApXG4gICAgLmdldCh7IGNvbnZlcnNhdGlvbklkIH0pO1xuXG4gIHJldHVybiByb3cuY291bnQgIT09IDA7XG59XG5cbmZ1bmN0aW9uIHNhdmVNZXNzYWdlU3luYyhcbiAgZGF0YTogTWVzc2FnZVR5cGUsXG4gIG9wdGlvbnM6IHtcbiAgICBhbHJlYWR5SW5UcmFuc2FjdGlvbj86IGJvb2xlYW47XG4gICAgZGI/OiBEYXRhYmFzZTtcbiAgICBmb3JjZVNhdmU/OiBib29sZWFuO1xuICAgIGpvYlRvSW5zZXJ0PzogU3RvcmVkSm9iO1xuICAgIG91clV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICB9XG4pOiBzdHJpbmcge1xuICBjb25zdCB7XG4gICAgYWxyZWFkeUluVHJhbnNhY3Rpb24sXG4gICAgZGIgPSBnZXRJbnN0YW5jZSgpLFxuICAgIGZvcmNlU2F2ZSxcbiAgICBqb2JUb0luc2VydCxcbiAgICBvdXJVdWlkLFxuICB9ID0gb3B0aW9ucztcblxuICBpZiAoIWFscmVhZHlJblRyYW5zYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICAgIHJldHVybiBhc3NlcnRTeW5jKFxuICAgICAgICBzYXZlTWVzc2FnZVN5bmMoZGF0YSwge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgYWxyZWFkeUluVHJhbnNhY3Rpb246IHRydWUsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pKCk7XG4gIH1cblxuICBjb25zdCB7XG4gICAgYm9keSxcbiAgICBjb252ZXJzYXRpb25JZCxcbiAgICBncm91cFYyQ2hhbmdlLFxuICAgIGhhc0F0dGFjaG1lbnRzLFxuICAgIGhhc0ZpbGVBdHRhY2htZW50cyxcbiAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICAgIGlkLFxuICAgIGlzRXJhc2VkLFxuICAgIGlzVmlld09uY2UsXG4gICAgcmVjZWl2ZWRfYXQsXG4gICAgc2NoZW1hVmVyc2lvbixcbiAgICBzZW50X2F0LFxuICAgIHNlcnZlckd1aWQsXG4gICAgc291cmNlLFxuICAgIHNvdXJjZVV1aWQsXG4gICAgc291cmNlRGV2aWNlLFxuICAgIHN0b3J5SWQsXG4gICAgdHlwZSxcbiAgICByZWFkU3RhdHVzLFxuICAgIGV4cGlyZVRpbWVyLFxuICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICBhdHRhY2htZW50cyxcbiAgfSA9IGRhdGE7XG4gIGxldCB7IHNlZW5TdGF0dXMgfSA9IGRhdGE7XG5cbiAgaWYgKGF0dGFjaG1lbnRzKSB7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgYXR0YWNobWVudHMuZXZlcnkoYXR0YWNobWVudCA9PiAhYXR0YWNobWVudC5kYXRhKSxcbiAgICAgICdBdHRlbXB0aW5nIHRvIHNhdmUgYSBoeWRyYXRlZCBtZXNzYWdlJ1xuICAgICk7XG4gIH1cblxuICBpZiAocmVhZFN0YXR1cyA9PT0gUmVhZFN0YXR1cy5VbnJlYWQgJiYgc2VlblN0YXR1cyAhPT0gU2VlblN0YXR1cy5VbnNlZW4pIHtcbiAgICBsb2cud2FybihcbiAgICAgIGBzYXZlTWVzc2FnZTogTWVzc2FnZSAke2lkfS8ke3R5cGV9IGlzIHVucmVhZCBidXQgaGFkIHNlZW5TdGF0dXM9JHtzZWVuU3RhdHVzfS4gRm9yY2luZyB0byBVbnNlZW5TdGF0dXMuVW5zZWVuLmBcbiAgICApO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgZGF0YSA9IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLlVuc2VlbixcbiAgICB9O1xuICAgIHNlZW5TdGF0dXMgPSBTZWVuU3RhdHVzLlVuc2VlbjtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgaWQsXG4gICAganNvbjogb2JqZWN0VG9KU09OKGRhdGEpLFxuXG4gICAgYm9keTogYm9keSB8fCBudWxsLFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcDogZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wIHx8IG51bGwsXG4gICAgZXhwaXJlVGltZXI6IGV4cGlyZVRpbWVyIHx8IG51bGwsXG4gICAgaGFzQXR0YWNobWVudHM6IGhhc0F0dGFjaG1lbnRzID8gMSA6IDAsXG4gICAgaGFzRmlsZUF0dGFjaG1lbnRzOiBoYXNGaWxlQXR0YWNobWVudHMgPyAxIDogMCxcbiAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzOiBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzID8gMSA6IDAsXG4gICAgaXNDaGFuZ2VDcmVhdGVkQnlVczogZ3JvdXBWMkNoYW5nZT8uZnJvbSA9PT0gb3VyVXVpZCA/IDEgOiAwLFxuICAgIGlzRXJhc2VkOiBpc0VyYXNlZCA/IDEgOiAwLFxuICAgIGlzVmlld09uY2U6IGlzVmlld09uY2UgPyAxIDogMCxcbiAgICByZWNlaXZlZF9hdDogcmVjZWl2ZWRfYXQgfHwgbnVsbCxcbiAgICBzY2hlbWFWZXJzaW9uOiBzY2hlbWFWZXJzaW9uIHx8IDAsXG4gICAgc2VydmVyR3VpZDogc2VydmVyR3VpZCB8fCBudWxsLFxuICAgIHNlbnRfYXQ6IHNlbnRfYXQgfHwgbnVsbCxcbiAgICBzb3VyY2U6IHNvdXJjZSB8fCBudWxsLFxuICAgIHNvdXJjZVV1aWQ6IHNvdXJjZVV1aWQgfHwgbnVsbCxcbiAgICBzb3VyY2VEZXZpY2U6IHNvdXJjZURldmljZSB8fCBudWxsLFxuICAgIHN0b3J5SWQ6IHN0b3J5SWQgfHwgbnVsbCxcbiAgICB0eXBlOiB0eXBlIHx8IG51bGwsXG4gICAgcmVhZFN0YXR1czogcmVhZFN0YXR1cyA/PyBudWxsLFxuICAgIHNlZW5TdGF0dXM6IHNlZW5TdGF0dXMgPz8gU2VlblN0YXR1cy5Ob3RBcHBsaWNhYmxlLFxuICB9O1xuXG4gIGlmIChpZCAmJiAhZm9yY2VTYXZlKSB7XG4gICAgcHJlcGFyZShcbiAgICAgIGRiLFxuICAgICAgYFxuICAgICAgVVBEQVRFIG1lc3NhZ2VzIFNFVFxuICAgICAgICBpZCA9ICRpZCxcbiAgICAgICAganNvbiA9ICRqc29uLFxuXG4gICAgICAgIGJvZHkgPSAkYm9keSxcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQsXG4gICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9ICRleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAsXG4gICAgICAgIGV4cGlyZVRpbWVyID0gJGV4cGlyZVRpbWVyLFxuICAgICAgICBoYXNBdHRhY2htZW50cyA9ICRoYXNBdHRhY2htZW50cyxcbiAgICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzID0gJGhhc0ZpbGVBdHRhY2htZW50cyxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cyA9ICRoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICAgICAgICBpc0NoYW5nZUNyZWF0ZWRCeVVzID0gJGlzQ2hhbmdlQ3JlYXRlZEJ5VXMsXG4gICAgICAgIGlzRXJhc2VkID0gJGlzRXJhc2VkLFxuICAgICAgICBpc1ZpZXdPbmNlID0gJGlzVmlld09uY2UsXG4gICAgICAgIHJlY2VpdmVkX2F0ID0gJHJlY2VpdmVkX2F0LFxuICAgICAgICBzY2hlbWFWZXJzaW9uID0gJHNjaGVtYVZlcnNpb24sXG4gICAgICAgIHNlcnZlckd1aWQgPSAkc2VydmVyR3VpZCxcbiAgICAgICAgc2VudF9hdCA9ICRzZW50X2F0LFxuICAgICAgICBzb3VyY2UgPSAkc291cmNlLFxuICAgICAgICBzb3VyY2VVdWlkID0gJHNvdXJjZVV1aWQsXG4gICAgICAgIHNvdXJjZURldmljZSA9ICRzb3VyY2VEZXZpY2UsXG4gICAgICAgIHN0b3J5SWQgPSAkc3RvcnlJZCxcbiAgICAgICAgdHlwZSA9ICR0eXBlLFxuICAgICAgICByZWFkU3RhdHVzID0gJHJlYWRTdGF0dXMsXG4gICAgICAgIHNlZW5TdGF0dXMgPSAkc2VlblN0YXR1c1xuICAgICAgV0hFUkUgaWQgPSAkaWQ7XG4gICAgICBgXG4gICAgKS5ydW4ocGF5bG9hZCk7XG5cbiAgICBpZiAoam9iVG9JbnNlcnQpIHtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIGpvYlRvSW5zZXJ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBjb25zdCB0b0NyZWF0ZSA9IHtcbiAgICAuLi5kYXRhLFxuICAgIGlkOiBpZCB8fCBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgfTtcblxuICBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBJTlNFUlQgSU5UTyBtZXNzYWdlcyAoXG4gICAgICBpZCxcbiAgICAgIGpzb24sXG5cbiAgICAgIGJvZHksXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgaGFzQXR0YWNobWVudHMsXG4gICAgICBoYXNGaWxlQXR0YWNobWVudHMsXG4gICAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICAgICAgaXNDaGFuZ2VDcmVhdGVkQnlVcyxcbiAgICAgIGlzRXJhc2VkLFxuICAgICAgaXNWaWV3T25jZSxcbiAgICAgIHJlY2VpdmVkX2F0LFxuICAgICAgc2NoZW1hVmVyc2lvbixcbiAgICAgIHNlcnZlckd1aWQsXG4gICAgICBzZW50X2F0LFxuICAgICAgc291cmNlLFxuICAgICAgc291cmNlVXVpZCxcbiAgICAgIHNvdXJjZURldmljZSxcbiAgICAgIHN0b3J5SWQsXG4gICAgICB0eXBlLFxuICAgICAgcmVhZFN0YXR1cyxcbiAgICAgIHNlZW5TdGF0dXNcbiAgICApIHZhbHVlcyAoXG4gICAgICAkaWQsXG4gICAgICAkanNvbixcblxuICAgICAgJGJvZHksXG4gICAgICAkY29udmVyc2F0aW9uSWQsXG4gICAgICAkZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wLFxuICAgICAgJGV4cGlyZVRpbWVyLFxuICAgICAgJGhhc0F0dGFjaG1lbnRzLFxuICAgICAgJGhhc0ZpbGVBdHRhY2htZW50cyxcbiAgICAgICRoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLFxuICAgICAgJGlzQ2hhbmdlQ3JlYXRlZEJ5VXMsXG4gICAgICAkaXNFcmFzZWQsXG4gICAgICAkaXNWaWV3T25jZSxcbiAgICAgICRyZWNlaXZlZF9hdCxcbiAgICAgICRzY2hlbWFWZXJzaW9uLFxuICAgICAgJHNlcnZlckd1aWQsXG4gICAgICAkc2VudF9hdCxcbiAgICAgICRzb3VyY2UsXG4gICAgICAkc291cmNlVXVpZCxcbiAgICAgICRzb3VyY2VEZXZpY2UsXG4gICAgICAkc3RvcnlJZCxcbiAgICAgICR0eXBlLFxuICAgICAgJHJlYWRTdGF0dXMsXG4gICAgICAkc2VlblN0YXR1c1xuICAgICk7XG4gICAgYFxuICApLnJ1bih7XG4gICAgLi4ucGF5bG9hZCxcbiAgICBpZDogdG9DcmVhdGUuaWQsXG4gICAganNvbjogb2JqZWN0VG9KU09OKHRvQ3JlYXRlKSxcbiAgfSk7XG5cbiAgaWYgKGpvYlRvSW5zZXJ0KSB7XG4gICAgaW5zZXJ0Sm9iU3luYyhkYiwgam9iVG9JbnNlcnQpO1xuICB9XG5cbiAgcmV0dXJuIHRvQ3JlYXRlLmlkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlTWVzc2FnZShcbiAgZGF0YTogTWVzc2FnZVR5cGUsXG4gIG9wdGlvbnM6IHtcbiAgICBqb2JUb0luc2VydD86IFN0b3JlZEpvYjtcbiAgICBmb3JjZVNhdmU/OiBib29sZWFuO1xuICAgIGFscmVhZHlJblRyYW5zYWN0aW9uPzogYm9vbGVhbjtcbiAgICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgfVxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIHNhdmVNZXNzYWdlU3luYyhkYXRhLCBvcHRpb25zKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VzKFxuICBhcnJheU9mTWVzc2FnZXM6IFJlYWRvbmx5QXJyYXk8TWVzc2FnZVR5cGU+LFxuICBvcHRpb25zOiB7IGZvcmNlU2F2ZT86IGJvb2xlYW47IG91clV1aWQ6IFVVSURTdHJpbmdUeXBlIH1cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBhcnJheU9mTWVzc2FnZXMpIHtcbiAgICAgIGFzc2VydFN5bmMoXG4gICAgICAgIHNhdmVNZXNzYWdlU3luYyhtZXNzYWdlLCB7IC4uLm9wdGlvbnMsIGFscmVhZHlJblRyYW5zYWN0aW9uOiB0cnVlIH0pXG4gICAgICApO1xuICAgIH1cbiAgfSkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlTWVzc2FnZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi5wcmVwYXJlPFF1ZXJ5PignREVMRVRFIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgPSAkaWQ7JykucnVuKHsgaWQgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1lc3NhZ2VzU3luYyhpZHM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnByZXBhcmU8QXJyYXlRdWVyeT4oXG4gICAgYFxuICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzXG4gICAgV0hFUkUgaWQgSU4gKCAke2lkcy5tYXAoKCkgPT4gJz8nKS5qb2luKCcsICcpfSApO1xuICAgIGBcbiAgKS5ydW4oaWRzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlTWVzc2FnZXMoaWRzOiBBcnJheTxzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gIGJhdGNoTXVsdGlWYXJRdWVyeShnZXRJbnN0YW5jZSgpLCBpZHMsIHJlbW92ZU1lc3NhZ2VzU3luYyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1lc3NhZ2VCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcmV0dXJuIGdldE1lc3NhZ2VCeUlkU3luYyhkYiwgaWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2FnZUJ5SWRTeW5jKFxuICBkYjogRGF0YWJhc2UsXG4gIGlkOiBzdHJpbmdcbik6IE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgcm93ID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oJ1NFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgPSAkaWQ7JylcbiAgICAuZ2V0KHtcbiAgICAgIGlkLFxuICAgIH0pO1xuXG4gIGlmICghcm93KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBqc29uVG9PYmplY3Qocm93Lmpzb24pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRNZXNzYWdlc0J5SWQoXG4gIG1lc3NhZ2VJZHM6IEFycmF5PHN0cmluZz5cbik6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICByZXR1cm4gYmF0Y2hNdWx0aVZhclF1ZXJ5KFxuICAgIGRiLFxuICAgIG1lc3NhZ2VJZHMsXG4gICAgKGJhdGNoOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8TWVzc2FnZVR5cGU+ID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gZGIucHJlcGFyZTxBcnJheVF1ZXJ5PihcbiAgICAgICAgYFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgSU4gKCR7QXJyYXkoYmF0Y2gubGVuZ3RoKVxuICAgICAgICAgIC5maWxsKCc/JylcbiAgICAgICAgICAuam9pbignLCcpfSk7YFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJvd3M6IEpTT05Sb3dzID0gcXVlcnkuYWxsKGJhdGNoKTtcbiAgICAgIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG4gICAgfVxuICApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfZ2V0QWxsTWVzc2FnZXMoKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzOiBKU09OUm93cyA9IGRiXG4gICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oJ1NFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgT1JERVIgQlkgaWQgQVNDOycpXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG59XG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlQWxsTWVzc2FnZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgZGIucHJlcGFyZTxFbXB0eVF1ZXJ5PignREVMRVRFIGZyb20gbWVzc2FnZXM7JykucnVuKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbE1lc3NhZ2VJZHMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogQXJyYXk8eyBpZDogc3RyaW5nIH0+ID0gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PignU0VMRUNUIGlkIEZST00gbWVzc2FnZXMgT1JERVIgQlkgaWQgQVNDOycpXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4gcm93LmlkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUJ5U2VuZGVyKHtcbiAgc291cmNlLFxuICBzb3VyY2VVdWlkLFxuICBzb3VyY2VEZXZpY2UsXG4gIHNlbnRfYXQsXG59OiB7XG4gIHNvdXJjZTogc3RyaW5nO1xuICBzb3VyY2VVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgc291cmNlRGV2aWNlOiBudW1iZXI7XG4gIHNlbnRfYXQ6IG51bWJlcjtcbn0pOiBQcm9taXNlPE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFXG4gICAgICAoc291cmNlID0gJHNvdXJjZSBPUiBzb3VyY2VVdWlkID0gJHNvdXJjZVV1aWQpIEFORFxuICAgICAgc291cmNlRGV2aWNlID0gJHNvdXJjZURldmljZSBBTkRcbiAgICAgIHNlbnRfYXQgPSAkc2VudF9hdFxuICAgIExJTUlUIDI7XG4gICAgYFxuICApLmFsbCh7XG4gICAgc291cmNlLFxuICAgIHNvdXJjZVV1aWQsXG4gICAgc291cmNlRGV2aWNlLFxuICAgIHNlbnRfYXQsXG4gIH0pO1xuXG4gIGlmIChyb3dzLmxlbmd0aCA+IDEpIHtcbiAgICBsb2cud2FybignZ2V0TWVzc2FnZUJ5U2VuZGVyOiBNb3JlIHRoYW4gb25lIG1lc3NhZ2UgZm91bmQgZm9yJywge1xuICAgICAgc2VudF9hdCxcbiAgICAgIHNvdXJjZSxcbiAgICAgIHNvdXJjZVV1aWQsXG4gICAgICBzb3VyY2VEZXZpY2UsXG4gICAgfSk7XG4gIH1cblxuICBpZiAocm93cy5sZW5ndGggPCAxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBqc29uVG9PYmplY3Qocm93c1swXS5qc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9zdG9yeUlkUHJlZGljYXRlKFxuICBzdG9yeUlkOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIGlzR3JvdXA/OiBib29sZWFuXG4pOiBzdHJpbmcge1xuICBpZiAoIWlzR3JvdXAgJiYgc3RvcnlJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gV2UgY291bGQgdXNlICdUUlVFJyBoZXJlLCBidXQgaXQgaXMgYmV0dGVyIHRvIHJlcXVpcmUgYCRzdG9yeUlkYFxuICAgIC8vIHBhcmFtZXRlclxuICAgIHJldHVybiAnJHN0b3J5SWQgSVMgTlVMTCc7XG4gIH1cblxuICByZXR1cm4gJ3N0b3J5SWQgSVMgJHN0b3J5SWQnO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRVbnJlYWRCeUNvbnZlcnNhdGlvbkFuZE1hcmtSZWFkKHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGlzR3JvdXAsXG4gIG5ld2VzdFVucmVhZEF0LFxuICBzdG9yeUlkLFxuICByZWFkQXQsXG59OiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGlzR3JvdXA/OiBib29sZWFuO1xuICBuZXdlc3RVbnJlYWRBdDogbnVtYmVyO1xuICBzdG9yeUlkPzogVVVJRFN0cmluZ1R5cGU7XG4gIHJlYWRBdD86IG51bWJlcjtcbn0pOiBQcm9taXNlPEdldFVucmVhZEJ5Q29udmVyc2F0aW9uQW5kTWFya1JlYWRSZXN1bHRUeXBlPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgPSBNYXRoLm1pbihEYXRlLm5vdygpLCByZWFkQXQgPz8gSW5maW5pdHkpO1xuICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgVVBEQVRFIG1lc3NhZ2VzXG4gICAgICBJTkRFWEVEIEJZIGV4cGlyaW5nX21lc3NhZ2VfYnlfY29udmVyc2F0aW9uX2FuZF9yZWNlaXZlZF9hdFxuICAgICAgU0VUXG4gICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9ICRleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAsXG4gICAgICAgIGpzb24gPSBqc29uX3BhdGNoKGpzb24sICRqc29uUGF0Y2gpXG4gICAgICBXSEVSRVxuICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgKCR7X3N0b3J5SWRQcmVkaWNhdGUoc3RvcnlJZCwgaXNHcm91cCl9KSBBTkRcbiAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICB0eXBlIElTICdpbmNvbWluZycgQU5EXG4gICAgICAgIChcbiAgICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgSVMgTlVMTCBPUlxuICAgICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA+ICRleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXBcbiAgICAgICAgKSBBTkRcbiAgICAgICAgZXhwaXJlVGltZXIgPiAwIEFORFxuICAgICAgICByZWNlaXZlZF9hdCA8PSAkbmV3ZXN0VW5yZWFkQXQ7XG4gICAgICBgXG4gICAgKS5ydW4oe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAsXG4gICAgICBqc29uUGF0Y2g6IEpTT04uc3RyaW5naWZ5KHsgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wIH0pLFxuICAgICAgbmV3ZXN0VW5yZWFkQXQsXG4gICAgICBzdG9yeUlkOiBzdG9yeUlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCByb3dzID0gZGJcbiAgICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1QgaWQsIGpzb24gRlJPTSBtZXNzYWdlc1xuICAgICAgICBXSEVSRVxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkIEFORFxuICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufSBBTkRcbiAgICAgICAgICBpc1N0b3J5ID0gMCBBTkRcbiAgICAgICAgICAoJHtfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkLCBpc0dyb3VwKX0pIEFORFxuICAgICAgICAgIHJlY2VpdmVkX2F0IDw9ICRuZXdlc3RVbnJlYWRBdFxuICAgICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBERVNDLCBzZW50X2F0IERFU0M7XG4gICAgICAgIGBcbiAgICAgIClcbiAgICAgIC5hbGwoe1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgbmV3ZXN0VW5yZWFkQXQsXG4gICAgICAgIHN0b3J5SWQ6IHN0b3J5SWQgfHwgbnVsbCxcbiAgICAgIH0pO1xuXG4gICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICAgIFVQREFURSBtZXNzYWdlc1xuICAgICAgICBTRVRcbiAgICAgICAgICByZWFkU3RhdHVzID0gJHtSZWFkU3RhdHVzLlJlYWR9LFxuICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuU2Vlbn0sXG4gICAgICAgICAganNvbiA9IGpzb25fcGF0Y2goanNvbiwgJGpzb25QYXRjaClcbiAgICAgICAgV0hFUkVcbiAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgICBzZWVuU3RhdHVzID0gJHtTZWVuU3RhdHVzLlVuc2Vlbn0gQU5EXG4gICAgICAgICAgaXNTdG9yeSA9IDAgQU5EXG4gICAgICAgICAgKCR7X3N0b3J5SWRQcmVkaWNhdGUoc3RvcnlJZCwgaXNHcm91cCl9KSBBTkRcbiAgICAgICAgICByZWNlaXZlZF9hdCA8PSAkbmV3ZXN0VW5yZWFkQXQ7XG4gICAgICAgIGBcbiAgICApLnJ1bih7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGpzb25QYXRjaDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuU2VlbixcbiAgICAgIH0pLFxuICAgICAgbmV3ZXN0VW5yZWFkQXQsXG4gICAgICBzdG9yeUlkOiBzdG9yeUlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm93cy5tYXAocm93ID0+IHtcbiAgICAgIGNvbnN0IGpzb24gPSBqc29uVG9PYmplY3Q8TWVzc2FnZVR5cGU+KHJvdy5qc29uKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9yaWdpbmFsUmVhZFN0YXR1czoganNvbi5yZWFkU3RhdHVzLFxuICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuU2VlbixcbiAgICAgICAgLi4ucGljayhqc29uLCBbXG4gICAgICAgICAgJ2V4cGlyYXRpb25TdGFydFRpbWVzdGFtcCcsXG4gICAgICAgICAgJ2lkJyxcbiAgICAgICAgICAnc2VudF9hdCcsXG4gICAgICAgICAgJ3NvdXJjZScsXG4gICAgICAgICAgJ3NvdXJjZVV1aWQnLFxuICAgICAgICAgICd0eXBlJyxcbiAgICAgICAgXSksXG4gICAgICB9O1xuICAgIH0pO1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRVbnJlYWRSZWFjdGlvbnNBbmRNYXJrUmVhZCh7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBuZXdlc3RVbnJlYWRBdCxcbiAgc3RvcnlJZCxcbn06IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgbmV3ZXN0VW5yZWFkQXQ6IG51bWJlcjtcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlO1xufSk6IFByb21pc2U8QXJyYXk8UmVhY3Rpb25SZXN1bHRUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCB1bnJlYWRNZXNzYWdlczogQXJyYXk8UmVhY3Rpb25SZXN1bHRUeXBlPiA9IGRiXG4gICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgU0VMRUNUIHJlYWN0aW9ucy5yb3dpZCwgdGFyZ2V0QXV0aG9yVXVpZCwgdGFyZ2V0VGltZXN0YW1wLCBtZXNzYWdlSWRcbiAgICAgICAgRlJPTSByZWFjdGlvbnNcbiAgICAgICAgSk9JTiBtZXNzYWdlcyBvbiBtZXNzYWdlcy5pZCBJUyByZWFjdGlvbnMubWVzc2FnZUlkXG4gICAgICAgIFdIRVJFXG4gICAgICAgICAgdW5yZWFkID4gMCBBTkRcbiAgICAgICAgICBtZXNzYWdlcy5jb252ZXJzYXRpb25JZCBJUyAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgICAgbWVzc2FnZXMucmVjZWl2ZWRfYXQgPD0gJG5ld2VzdFVucmVhZEF0IEFORFxuICAgICAgICAgIG1lc3NhZ2VzLnN0b3J5SWQgSVMgJHN0b3J5SWRcbiAgICAgICAgT1JERVIgQlkgbWVzc2FnZVJlY2VpdmVkQXQgREVTQztcbiAgICAgIGBcbiAgICAgIClcbiAgICAgIC5hbGwoe1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgbmV3ZXN0VW5yZWFkQXQsXG4gICAgICAgIHN0b3J5SWQ6IHN0b3J5SWQgfHwgbnVsbCxcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgaWRzVG9VcGRhdGUgPSB1bnJlYWRNZXNzYWdlcy5tYXAoaXRlbSA9PiBpdGVtLnJvd2lkKTtcbiAgICBiYXRjaE11bHRpVmFyUXVlcnkoZGIsIGlkc1RvVXBkYXRlLCAoaWRzOiBBcnJheTxudW1iZXI+KTogdm9pZCA9PiB7XG4gICAgICBkYi5wcmVwYXJlPEFycmF5UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIFVQREFURSByZWFjdGlvbnMgU0VUXG4gICAgICAgIHVucmVhZCA9IDAgV0hFUkUgcm93aWQgSU4gKCAke2lkcy5tYXAoKCkgPT4gJz8nKS5qb2luKCcsICcpfSApO1xuICAgICAgICBgXG4gICAgICApLnJ1bihpZHMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVucmVhZE1lc3NhZ2VzO1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrUmVhY3Rpb25Bc1JlYWQoXG4gIHRhcmdldEF1dGhvclV1aWQ6IHN0cmluZyxcbiAgdGFyZ2V0VGltZXN0YW1wOiBudW1iZXJcbik6IFByb21pc2U8UmVhY3Rpb25UeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCByZWFkUmVhY3Rpb24gPSBkYlxuICAgICAgLnByZXBhcmUoXG4gICAgICAgIGBcbiAgICAgICAgICBTRUxFQ1QgKlxuICAgICAgICAgIEZST00gcmVhY3Rpb25zXG4gICAgICAgICAgV0hFUkVcbiAgICAgICAgICAgIHRhcmdldEF1dGhvclV1aWQgPSAkdGFyZ2V0QXV0aG9yVXVpZCBBTkRcbiAgICAgICAgICAgIHRhcmdldFRpbWVzdGFtcCA9ICR0YXJnZXRUaW1lc3RhbXAgQU5EXG4gICAgICAgICAgICB1bnJlYWQgPSAxXG4gICAgICAgICAgT1JERVIgQlkgcm93SWQgREVTQ1xuICAgICAgICAgIExJTUlUIDE7XG4gICAgICAgIGBcbiAgICAgIClcbiAgICAgIC5nZXQoe1xuICAgICAgICB0YXJnZXRBdXRob3JVdWlkLFxuICAgICAgICB0YXJnZXRUaW1lc3RhbXAsXG4gICAgICB9KTtcblxuICAgIGRiLnByZXBhcmUoXG4gICAgICBgXG4gICAgICAgIFVQREFURSByZWFjdGlvbnMgU0VUXG4gICAgICAgIHVucmVhZCA9IDAgV0hFUkVcbiAgICAgICAgdGFyZ2V0QXV0aG9yVXVpZCA9ICR0YXJnZXRBdXRob3JVdWlkIEFORFxuICAgICAgICB0YXJnZXRUaW1lc3RhbXAgPSAkdGFyZ2V0VGltZXN0YW1wO1xuICAgICAgYFxuICAgICkucnVuKHtcbiAgICAgIHRhcmdldEF1dGhvclV1aWQsXG4gICAgICB0YXJnZXRUaW1lc3RhbXAsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVhZFJlYWN0aW9uO1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBhZGRSZWFjdGlvbih7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBlbW9qaSxcbiAgZnJvbUlkLFxuICBtZXNzYWdlSWQsXG4gIG1lc3NhZ2VSZWNlaXZlZEF0LFxuICB0YXJnZXRBdXRob3JVdWlkLFxuICB0YXJnZXRUaW1lc3RhbXAsXG59OiBSZWFjdGlvblR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBhd2FpdCBkYlxuICAgIC5wcmVwYXJlKFxuICAgICAgYElOU0VSVCBJTlRPIHJlYWN0aW9ucyAoXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGVtb2ppLFxuICAgICAgZnJvbUlkLFxuICAgICAgbWVzc2FnZUlkLFxuICAgICAgbWVzc2FnZVJlY2VpdmVkQXQsXG4gICAgICB0YXJnZXRBdXRob3JVdWlkLFxuICAgICAgdGFyZ2V0VGltZXN0YW1wLFxuICAgICAgdW5yZWFkXG4gICAgKSBWQUxVRVMgKFxuICAgICAgJGNvbnZlcnNhdGlvbklkLFxuICAgICAgJGVtb2ppLFxuICAgICAgJGZyb21JZCxcbiAgICAgICRtZXNzYWdlSWQsXG4gICAgICAkbWVzc2FnZVJlY2VpdmVkQXQsXG4gICAgICAkdGFyZ2V0QXV0aG9yVXVpZCxcbiAgICAgICR0YXJnZXRUaW1lc3RhbXAsXG4gICAgICAkdW5yZWFkXG4gICAgKTtgXG4gICAgKVxuICAgIC5ydW4oe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBlbW9qaSxcbiAgICAgIGZyb21JZCxcbiAgICAgIG1lc3NhZ2VJZCxcbiAgICAgIG1lc3NhZ2VSZWNlaXZlZEF0LFxuICAgICAgdGFyZ2V0QXV0aG9yVXVpZCxcbiAgICAgIHRhcmdldFRpbWVzdGFtcCxcbiAgICAgIHVucmVhZDogMSxcbiAgICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlUmVhY3Rpb25Gcm9tQ29udmVyc2F0aW9uKHtcbiAgZW1vamksXG4gIGZyb21JZCxcbiAgdGFyZ2V0QXV0aG9yVXVpZCxcbiAgdGFyZ2V0VGltZXN0YW1wLFxufToge1xuICBlbW9qaTogc3RyaW5nO1xuICBmcm9tSWQ6IHN0cmluZztcbiAgdGFyZ2V0QXV0aG9yVXVpZDogc3RyaW5nO1xuICB0YXJnZXRUaW1lc3RhbXA6IG51bWJlcjtcbn0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBhd2FpdCBkYlxuICAgIC5wcmVwYXJlKFxuICAgICAgYERFTEVURSBGUk9NIHJlYWN0aW9ucyBXSEVSRVxuICAgICAgZW1vamkgPSAkZW1vamkgQU5EXG4gICAgICBmcm9tSWQgPSAkZnJvbUlkIEFORFxuICAgICAgdGFyZ2V0QXV0aG9yVXVpZCA9ICR0YXJnZXRBdXRob3JVdWlkIEFORFxuICAgICAgdGFyZ2V0VGltZXN0YW1wID0gJHRhcmdldFRpbWVzdGFtcDtgXG4gICAgKVxuICAgIC5ydW4oe1xuICAgICAgZW1vamksXG4gICAgICBmcm9tSWQsXG4gICAgICB0YXJnZXRBdXRob3JVdWlkLFxuICAgICAgdGFyZ2V0VGltZXN0YW1wLFxuICAgIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfZ2V0QWxsUmVhY3Rpb25zKCk6IFByb21pc2U8QXJyYXk8UmVhY3Rpb25UeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHJldHVybiBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KCdTRUxFQ1QgKiBmcm9tIHJlYWN0aW9uczsnKS5hbGwoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIF9yZW1vdmVBbGxSZWFjdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgZGIucHJlcGFyZTxFbXB0eVF1ZXJ5PignREVMRVRFIGZyb20gcmVhY3Rpb25zOycpLnJ1bigpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHtcbiAgICBpc0dyb3VwOiBib29sZWFuO1xuICAgIGxpbWl0PzogbnVtYmVyO1xuICAgIG1lc3NhZ2VJZD86IHN0cmluZztcbiAgICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICAgIHNlbnRBdD86IG51bWJlcjtcbiAgICBzdG9yeUlkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIH1cbik6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGVVbmh5ZHJhdGVkPj4ge1xuICByZXR1cm4gZ2V0T2xkZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uU3luYyhjb252ZXJzYXRpb25JZCwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBnZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb25TeW5jKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICB7XG4gICAgaXNHcm91cCxcbiAgICBsaW1pdCA9IDEwMCxcbiAgICBtZXNzYWdlSWQsXG4gICAgcmVjZWl2ZWRBdCA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgc2VudEF0ID0gTnVtYmVyLk1BWF9WQUxVRSxcbiAgICBzdG9yeUlkLFxuICB9OiB7XG4gICAgaXNHcm91cDogYm9vbGVhbjtcbiAgICBsaW1pdD86IG51bWJlcjtcbiAgICBtZXNzYWdlSWQ/OiBzdHJpbmc7XG4gICAgcmVjZWl2ZWRBdD86IG51bWJlcjtcbiAgICBzZW50QXQ/OiBudW1iZXI7XG4gICAgc3RvcnlJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB9XG4pOiBBcnJheTxNZXNzYWdlVHlwZVVuaHlkcmF0ZWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIHJldHVybiBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgICgkbWVzc2FnZUlkIElTIE5VTEwgT1IgaWQgSVMgTk9UICRtZXNzYWdlSWQpIEFORFxuICAgICAgICBpc1N0b3J5IElTIDAgQU5EXG4gICAgICAgICgke19zdG9yeUlkUHJlZGljYXRlKHN0b3J5SWQsIGlzR3JvdXApfSkgQU5EXG4gICAgICAgIChcbiAgICAgICAgICAocmVjZWl2ZWRfYXQgPSAkcmVjZWl2ZWRfYXQgQU5EIHNlbnRfYXQgPCAkc2VudF9hdCkgT1JcbiAgICAgICAgICByZWNlaXZlZF9hdCA8ICRyZWNlaXZlZF9hdFxuICAgICAgICApXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBERVNDLCBzZW50X2F0IERFU0NcbiAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGxpbWl0LFxuICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQgfHwgbnVsbCxcbiAgICAgIHJlY2VpdmVkX2F0OiByZWNlaXZlZEF0LFxuICAgICAgc2VudF9hdDogc2VudEF0LFxuICAgICAgc3RvcnlJZDogc3RvcnlJZCB8fCBudWxsLFxuICAgIH0pXG4gICAgLnJldmVyc2UoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0T2xkZXJTdG9yaWVzKHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGxpbWl0ID0gOTk5OSxcbiAgcmVjZWl2ZWRBdCA9IE51bWJlci5NQVhfVkFMVUUsXG4gIHNlbnRBdCxcbiAgc291cmNlVXVpZCxcbn06IHtcbiAgY29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gIGxpbWl0PzogbnVtYmVyO1xuICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICBzZW50QXQ/OiBudW1iZXI7XG4gIHNvdXJjZVV1aWQ/OiBVVUlEU3RyaW5nVHlwZTtcbn0pOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvd3M6IEpTT05Sb3dzID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QganNvblxuICAgICAgRlJPTSBtZXNzYWdlc1xuICAgICAgV0hFUkVcbiAgICAgICAgdHlwZSBJUyAnc3RvcnknIEFORFxuICAgICAgICAoJGNvbnZlcnNhdGlvbklkIElTIE5VTEwgT1IgY29udmVyc2F0aW9uSWQgSVMgJGNvbnZlcnNhdGlvbklkKSBBTkRcbiAgICAgICAgKCRzb3VyY2VVdWlkIElTIE5VTEwgT1Igc291cmNlVXVpZCBJUyAkc291cmNlVXVpZCkgQU5EXG4gICAgICAgIChyZWNlaXZlZF9hdCA8ICRyZWNlaXZlZEF0XG4gICAgICAgICAgT1IgKHJlY2VpdmVkX2F0IElTICRyZWNlaXZlZEF0IEFORCBzZW50X2F0IDwgJHNlbnRBdClcbiAgICAgICAgKVxuICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgQVNDLCBzZW50X2F0IEFTQ1xuICAgICAgTElNSVQgJGxpbWl0O1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKHtcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb25JZCB8fCBudWxsLFxuICAgICAgcmVjZWl2ZWRBdCxcbiAgICAgIHNlbnRBdDogc2VudEF0IHx8IG51bGwsXG4gICAgICBzb3VyY2VVdWlkOiBzb3VyY2VVdWlkIHx8IG51bGwsXG4gICAgICBsaW1pdCxcbiAgICB9KTtcblxuICByZXR1cm4gcm93cy5tYXAocm93ID0+IGpzb25Ub09iamVjdChyb3cuanNvbikpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXROZXdlck1lc3NhZ2VzQnlDb252ZXJzYXRpb24oXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHtcbiAgICBpc0dyb3VwOiBib29sZWFuO1xuICAgIGxpbWl0PzogbnVtYmVyO1xuICAgIHJlY2VpdmVkQXQ/OiBudW1iZXI7XG4gICAgc2VudEF0PzogbnVtYmVyO1xuICAgIHN0b3J5SWQ6IFVVSURTdHJpbmdUeXBlIHwgdW5kZWZpbmVkO1xuICB9XG4pOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlVW5oeWRyYXRlZD4+IHtcbiAgcmV0dXJuIGdldE5ld2VyTWVzc2FnZXNCeUNvbnZlcnNhdGlvblN5bmMoY29udmVyc2F0aW9uSWQsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gZ2V0TmV3ZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uU3luYyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAge1xuICAgIGlzR3JvdXAsXG4gICAgbGltaXQgPSAxMDAsXG4gICAgcmVjZWl2ZWRBdCA9IDAsXG4gICAgc2VudEF0ID0gMCxcbiAgICBzdG9yeUlkLFxuICB9OiB7XG4gICAgaXNHcm91cDogYm9vbGVhbjtcbiAgICBsaW1pdD86IG51bWJlcjtcbiAgICByZWNlaXZlZEF0PzogbnVtYmVyO1xuICAgIHNlbnRBdD86IG51bWJlcjtcbiAgICBzdG9yeUlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgfVxuKTogQXJyYXk8TWVzc2FnZVR5cGVVbmh5ZHJhdGVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgKCR7X3N0b3J5SWRQcmVkaWNhdGUoc3RvcnlJZCwgaXNHcm91cCl9KSBBTkRcbiAgICAgICAgKFxuICAgICAgICAgIChyZWNlaXZlZF9hdCA9ICRyZWNlaXZlZF9hdCBBTkQgc2VudF9hdCA+ICRzZW50X2F0KSBPUlxuICAgICAgICAgIHJlY2VpdmVkX2F0ID4gJHJlY2VpdmVkX2F0XG4gICAgICAgIClcbiAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IEFTQywgc2VudF9hdCBBU0NcbiAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGxpbWl0LFxuICAgICAgcmVjZWl2ZWRfYXQ6IHJlY2VpdmVkQXQsXG4gICAgICBzZW50X2F0OiBzZW50QXQsXG4gICAgICBzdG9yeUlkOiBzdG9yeUlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgcmV0dXJuIHJvd3M7XG59XG5mdW5jdGlvbiBnZXRPbGRlc3RNZXNzYWdlRm9yQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBzdG9yeUlkPzogVVVJRFN0cmluZ1R5cGUsXG4gIGlzR3JvdXA/OiBib29sZWFuXG4pOiBNZXNzYWdlTWV0cmljc1R5cGUgfCB1bmRlZmluZWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvdyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUICogRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICAoJHtfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkLCBpc0dyb3VwKX0pXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBBU0MsIHNlbnRfYXQgQVNDXG4gICAgICBMSU1JVCAxO1xuICAgICAgYFxuICAgIClcbiAgICAuZ2V0KHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgc3RvcnlJZDogc3RvcnlJZCB8fCBudWxsLFxuICAgIH0pO1xuXG4gIGlmICghcm93KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiByb3c7XG59XG5mdW5jdGlvbiBnZXROZXdlc3RNZXNzYWdlRm9yQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBzdG9yeUlkPzogVVVJRFN0cmluZ1R5cGUsXG4gIGlzR3JvdXA/OiBib29sZWFuXG4pOiBNZXNzYWdlTWV0cmljc1R5cGUgfCB1bmRlZmluZWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvdyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUICogRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICAoJHtfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkLCBpc0dyb3VwKX0pXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBERVNDLCBzZW50X2F0IERFU0NcbiAgICAgIExJTUlUIDE7XG4gICAgICBgXG4gICAgKVxuICAgIC5nZXQoe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBzdG9yeUlkOiBzdG9yeUlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgaWYgKCFyb3cpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHJvdztcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdENvbnZlcnNhdGlvbkFjdGl2aXR5KHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGlzR3JvdXAsXG4gIG91clV1aWQsXG59OiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGlzR3JvdXA/OiBib29sZWFuO1xuICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbn0pOiBNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93ID0gcHJlcGFyZShcbiAgICBkYixcbiAgICBgXG4gICAgICBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzXG4gICAgICBXSEVSRVxuICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgc2hvdWxkQWZmZWN0QWN0aXZpdHkgSVMgMSBBTkRcbiAgICAgICAgaXNUaW1lckNoYW5nZUZyb21TeW5jIElTIDAgQU5EXG4gICAgICAgICR7aXNHcm91cCA/ICdzdG9yeUlkIElTIE5VTEwgQU5EJyA6ICcnfVxuICAgICAgICBpc0dyb3VwTGVhdmVFdmVudEZyb21PdGhlciBJUyAwXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBERVNDLCBzZW50X2F0IERFU0NcbiAgICAgIExJTUlUIDE7XG4gICAgICBgXG4gICkuZ2V0KHtcbiAgICBjb252ZXJzYXRpb25JZCxcbiAgICBvdXJVdWlkLFxuICB9KTtcblxuICBpZiAoIXJvdykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ganNvblRvT2JqZWN0KHJvdy5qc29uKTtcbn1cbmZ1bmN0aW9uIGdldExhc3RDb252ZXJzYXRpb25QcmV2aWV3KHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGlzR3JvdXAsXG59OiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGlzR3JvdXA/OiBib29sZWFuO1xufSk6IE1lc3NhZ2VUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3cgPSBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICAgIFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXNcbiAgICAgIFdIRVJFXG4gICAgICAgIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkIEFORFxuICAgICAgICBzaG91bGRBZmZlY3RQcmV2aWV3IElTIDEgQU5EXG4gICAgICAgIGlzR3JvdXBMZWF2ZUV2ZW50RnJvbU90aGVyIElTIDAgQU5EXG4gICAgICAgICR7aXNHcm91cCA/ICdzdG9yeUlkIElTIE5VTEwgQU5EJyA6ICcnfVxuICAgICAgICAoXG4gICAgICAgICAgZXhwaXJlc0F0IElTIE5VTExcbiAgICAgICAgICBPUlxuICAgICAgICAgIGV4cGlyZXNBdCA+ICRub3dcbiAgICAgICAgKVxuICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgREVTQywgc2VudF9hdCBERVNDXG4gICAgICBMSU1JVCAxO1xuICAgICAgYFxuICApLmdldCh7XG4gICAgY29udmVyc2F0aW9uSWQsXG4gICAgbm93OiBEYXRlLm5vdygpLFxuICB9KTtcblxuICBpZiAoIXJvdykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ganNvblRvT2JqZWN0KHJvdy5qc29uKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29udmVyc2F0aW9uTWVzc2FnZVN0YXRzKHtcbiAgY29udmVyc2F0aW9uSWQsXG4gIGlzR3JvdXAsXG4gIG91clV1aWQsXG59OiB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGlzR3JvdXA/OiBib29sZWFuO1xuICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbn0pOiBQcm9taXNlPENvbnZlcnNhdGlvbk1lc3NhZ2VTdGF0c1R5cGU+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIHJldHVybiBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGl2aXR5OiBnZXRMYXN0Q29udmVyc2F0aW9uQWN0aXZpdHkoe1xuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgaXNHcm91cCxcbiAgICAgICAgb3VyVXVpZCxcbiAgICAgIH0pLFxuICAgICAgcHJldmlldzogZ2V0TGFzdENvbnZlcnNhdGlvblByZXZpZXcoeyBjb252ZXJzYXRpb25JZCwgaXNHcm91cCB9KSxcbiAgICAgIGhhc1VzZXJJbml0aWF0ZWRNZXNzYWdlczogaGFzVXNlckluaXRpYXRlZE1lc3NhZ2VzKGNvbnZlcnNhdGlvbklkKSxcbiAgICB9O1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRMYXN0Q29udmVyc2F0aW9uTWVzc2FnZSh7XG4gIGNvbnZlcnNhdGlvbklkLFxufToge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xufSk6IFByb21pc2U8TWVzc2FnZVR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3cgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCAqIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWRcbiAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IERFU0MsIHNlbnRfYXQgREVTQ1xuICAgICAgTElNSVQgMTtcbiAgICAgIGBcbiAgICApXG4gICAgLmdldCh7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICB9KTtcblxuICBpZiAoIXJvdykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4ganNvblRvT2JqZWN0KHJvdy5qc29uKTtcbn1cblxuZnVuY3Rpb24gZ2V0T2xkZXN0VW5zZWVuTWVzc2FnZUZvckNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlLFxuICBpc0dyb3VwPzogYm9vbGVhblxuKTogTWVzc2FnZU1ldHJpY3NUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3cgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCAqIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufSBBTkRcbiAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICAoJHtfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkLCBpc0dyb3VwKX0pXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBBU0MsIHNlbnRfYXQgQVNDXG4gICAgICBMSU1JVCAxO1xuICAgICAgYFxuICAgIClcbiAgICAuZ2V0KHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgc3RvcnlJZDogc3RvcnlJZCB8fCBudWxsLFxuICAgIH0pO1xuXG4gIGlmICghcm93KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiByb3c7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFRvdGFsVW5yZWFkRm9yQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBvcHRpb25zOiB7XG4gICAgc3RvcnlJZDogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWQ7XG4gICAgaXNHcm91cDogYm9vbGVhbjtcbiAgfVxuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgcmV0dXJuIGdldFRvdGFsVW5yZWFkRm9yQ29udmVyc2F0aW9uU3luYyhjb252ZXJzYXRpb25JZCwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBnZXRUb3RhbFVucmVhZEZvckNvbnZlcnNhdGlvblN5bmMoXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIHtcbiAgICBzdG9yeUlkLFxuICAgIGlzR3JvdXAsXG4gIH06IHtcbiAgICBzdG9yeUlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgICBpc0dyb3VwOiBib29sZWFuO1xuICB9XG4pOiBudW1iZXIge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvdyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGNvdW50KGlkKVxuICAgICAgRlJPTSBtZXNzYWdlc1xuICAgICAgV0hFUkVcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgIHJlYWRTdGF0dXMgPSAke1JlYWRTdGF0dXMuVW5yZWFkfSBBTkRcbiAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICAoJHtfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkLCBpc0dyb3VwKX0pXG4gICAgICBgXG4gICAgKVxuICAgIC5nZXQoe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBzdG9yeUlkOiBzdG9yeUlkIHx8IG51bGwsXG4gICAgfSk7XG5cbiAgaWYgKCFyb3cpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFRvdGFsVW5yZWFkRm9yQ29udmVyc2F0aW9uOiBVbmFibGUgdG8gZ2V0IGNvdW50Jyk7XG4gIH1cblxuICByZXR1cm4gcm93Wydjb3VudChpZCknXTtcbn1cbmZ1bmN0aW9uIGdldFRvdGFsVW5zZWVuRm9yQ29udmVyc2F0aW9uU3luYyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlLFxuICBpc0dyb3VwPzogYm9vbGVhblxuKTogbnVtYmVyIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3cgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBjb3VudChpZClcbiAgICAgIEZST00gbWVzc2FnZXNcbiAgICAgIFdIRVJFXG4gICAgICAgIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkIEFORFxuICAgICAgICBzZWVuU3RhdHVzID0gJHtTZWVuU3RhdHVzLlVuc2Vlbn0gQU5EXG4gICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgKCR7X3N0b3J5SWRQcmVkaWNhdGUoc3RvcnlJZCwgaXNHcm91cCl9KVxuICAgICAgYFxuICAgIClcbiAgICAuZ2V0KHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgc3RvcnlJZDogc3RvcnlJZCB8fCBudWxsLFxuICAgIH0pO1xuXG4gIGlmICghcm93KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRUb3RhbFVuc2VlbkZvckNvbnZlcnNhdGlvblN5bmM6IFVuYWJsZSB0byBnZXQgY291bnQnKTtcbiAgfVxuXG4gIHJldHVybiByb3dbJ2NvdW50KGlkKSddO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRNZXNzYWdlTWV0cmljc0ZvckNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlLFxuICBpc0dyb3VwPzogYm9vbGVhblxuKTogUHJvbWlzZTxDb252ZXJzYXRpb25NZXRyaWNzVHlwZT4ge1xuICByZXR1cm4gZ2V0TWVzc2FnZU1ldHJpY3NGb3JDb252ZXJzYXRpb25TeW5jKGNvbnZlcnNhdGlvbklkLCBzdG9yeUlkLCBpc0dyb3VwKTtcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2VNZXRyaWNzRm9yQ29udmVyc2F0aW9uU3luYyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgc3RvcnlJZD86IFVVSURTdHJpbmdUeXBlLFxuICBpc0dyb3VwPzogYm9vbGVhblxuKTogQ29udmVyc2F0aW9uTWV0cmljc1R5cGUge1xuICBjb25zdCBvbGRlc3QgPSBnZXRPbGRlc3RNZXNzYWdlRm9yQ29udmVyc2F0aW9uKFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIHN0b3J5SWQsXG4gICAgaXNHcm91cFxuICApO1xuICBjb25zdCBuZXdlc3QgPSBnZXROZXdlc3RNZXNzYWdlRm9yQ29udmVyc2F0aW9uKFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIHN0b3J5SWQsXG4gICAgaXNHcm91cFxuICApO1xuICBjb25zdCBvbGRlc3RVbnNlZW4gPSBnZXRPbGRlc3RVbnNlZW5NZXNzYWdlRm9yQ29udmVyc2F0aW9uKFxuICAgIGNvbnZlcnNhdGlvbklkLFxuICAgIHN0b3J5SWQsXG4gICAgaXNHcm91cFxuICApO1xuICBjb25zdCB0b3RhbFVuc2VlbiA9IGdldFRvdGFsVW5zZWVuRm9yQ29udmVyc2F0aW9uU3luYyhcbiAgICBjb252ZXJzYXRpb25JZCxcbiAgICBzdG9yeUlkLFxuICAgIGlzR3JvdXBcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIG9sZGVzdDogb2xkZXN0ID8gcGljayhvbGRlc3QsIFsncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCcsICdpZCddKSA6IHVuZGVmaW5lZCxcbiAgICBuZXdlc3Q6IG5ld2VzdCA/IHBpY2sobmV3ZXN0LCBbJ3JlY2VpdmVkX2F0JywgJ3NlbnRfYXQnLCAnaWQnXSkgOiB1bmRlZmluZWQsXG4gICAgb2xkZXN0VW5zZWVuOiBvbGRlc3RVbnNlZW5cbiAgICAgID8gcGljayhvbGRlc3RVbnNlZW4sIFsncmVjZWl2ZWRfYXQnLCAnc2VudF9hdCcsICdpZCddKVxuICAgICAgOiB1bmRlZmluZWQsXG4gICAgdG90YWxVbnNlZW4sXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENvbnZlcnNhdGlvblJhbmdlQ2VudGVyZWRPbk1lc3NhZ2Uoe1xuICBjb252ZXJzYXRpb25JZCxcbiAgaXNHcm91cCxcbiAgbGltaXQsXG4gIG1lc3NhZ2VJZCxcbiAgcmVjZWl2ZWRBdCxcbiAgc2VudEF0LFxuICBzdG9yeUlkLFxufToge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBpc0dyb3VwOiBib29sZWFuO1xuICBsaW1pdD86IG51bWJlcjtcbiAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gIHJlY2VpdmVkQXQ6IG51bWJlcjtcbiAgc2VudEF0PzogbnVtYmVyO1xuICBzdG9yeUlkOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbn0pOiBQcm9taXNlPFxuICBHZXRDb252ZXJzYXRpb25SYW5nZUNlbnRlcmVkT25NZXNzYWdlUmVzdWx0VHlwZTxNZXNzYWdlVHlwZVVuaHlkcmF0ZWQ+XG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIHJldHVybiBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9sZGVyOiBnZXRPbGRlck1lc3NhZ2VzQnlDb252ZXJzYXRpb25TeW5jKGNvbnZlcnNhdGlvbklkLCB7XG4gICAgICAgIGlzR3JvdXAsXG4gICAgICAgIGxpbWl0LFxuICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgIHJlY2VpdmVkQXQsXG4gICAgICAgIHNlbnRBdCxcbiAgICAgICAgc3RvcnlJZCxcbiAgICAgIH0pLFxuICAgICAgbmV3ZXI6IGdldE5ld2VyTWVzc2FnZXNCeUNvbnZlcnNhdGlvblN5bmMoY29udmVyc2F0aW9uSWQsIHtcbiAgICAgICAgaXNHcm91cCxcbiAgICAgICAgbGltaXQsXG4gICAgICAgIHJlY2VpdmVkQXQsXG4gICAgICAgIHNlbnRBdCxcbiAgICAgICAgc3RvcnlJZCxcbiAgICAgIH0pLFxuICAgICAgbWV0cmljczogZ2V0TWVzc2FnZU1ldHJpY3NGb3JDb252ZXJzYXRpb25TeW5jKFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgc3RvcnlJZCxcbiAgICAgICAgaXNHcm91cFxuICAgICAgKSxcbiAgICB9O1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYXNHcm91cENhbGxIaXN0b3J5TWVzc2FnZShcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgZXJhSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCByb3c6IHsgJ2NvdW50KCopJzogbnVtYmVyIH0gfCB1bmRlZmluZWQgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBjb3VudCgqKSBGUk9NIG1lc3NhZ2VzXG4gICAgICBXSEVSRSBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZFxuICAgICAgQU5EIHR5cGUgPSAnY2FsbC1oaXN0b3J5J1xuICAgICAgQU5EIGpzb25fZXh0cmFjdChqc29uLCAnJC5jYWxsSGlzdG9yeURldGFpbHMuY2FsbE1vZGUnKSA9ICdHcm91cCdcbiAgICAgIEFORCBqc29uX2V4dHJhY3QoanNvbiwgJyQuY2FsbEhpc3RvcnlEZXRhaWxzLmVyYUlkJykgPSAkZXJhSWRcbiAgICAgIExJTUlUIDE7XG4gICAgICBgXG4gICAgKVxuICAgIC5nZXQoe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBlcmFJZCxcbiAgICB9KTtcblxuICBpZiAocm93KSB7XG4gICAgcmV0dXJuIEJvb2xlYW4ocm93Wydjb3VudCgqKSddKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyhcbiAgb2Jzb2xldGVJZDogc3RyaW5nLFxuICBjdXJyZW50SWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICBgXG4gICAgVVBEQVRFIG1lc3NhZ2VzIFNFVFxuICAgICAgY29udmVyc2F0aW9uSWQgPSAkY3VycmVudElkLFxuICAgICAganNvbiA9IGpzb25fc2V0KGpzb24sICckLmNvbnZlcnNhdGlvbklkJywgJGN1cnJlbnRJZClcbiAgICBXSEVSRSBjb252ZXJzYXRpb25JZCA9ICRvYnNvbGV0ZUlkO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIG9ic29sZXRlSWQsXG4gICAgY3VycmVudElkLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNCeVNlbnRBdChcbiAgc2VudEF0OiBudW1iZXJcbik6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXNcbiAgICAgIFdIRVJFIHNlbnRfYXQgPSAkc2VudF9hdFxuICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgREVTQywgc2VudF9hdCBERVNDO1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKHtcbiAgICAgIHNlbnRfYXQ6IHNlbnRBdCxcbiAgICB9KTtcblxuICByZXR1cm4gcm93cy5tYXAocm93ID0+IGpzb25Ub09iamVjdChyb3cuanNvbikpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRFeHBpcmVkTWVzc2FnZXMoKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gIGNvbnN0IHJvd3M6IEpTT05Sb3dzID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFXG4gICAgICAgIGV4cGlyZXNBdCBJUyBOT1QgTlVMTCBBTkRcbiAgICAgICAgZXhwaXJlc0F0IDw9ICRub3dcbiAgICAgIE9SREVSIEJZIGV4cGlyZXNBdCBBU0M7XG4gICAgICBgXG4gICAgKVxuICAgIC5hbGwoeyBub3cgfSk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiBqc29uVG9PYmplY3Qocm93Lmpzb24pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNVbmV4cGVjdGVkbHlNaXNzaW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wKCk6IFByb21pc2U8XG4gIEFycmF5PE1lc3NhZ2VUeXBlPlxuPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGpzb24gRlJPTSBtZXNzYWdlc1xuICAgICAgSU5ERVhFRCBCWSBtZXNzYWdlc191bmV4cGVjdGVkbHlfbWlzc2luZ19leHBpcmF0aW9uX3N0YXJ0X3RpbWVzdGFtcFxuICAgICAgV0hFUkVcbiAgICAgICAgZXhwaXJlVGltZXIgPiAwIEFORFxuICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgSVMgTlVMTCBBTkRcbiAgICAgICAgKFxuICAgICAgICAgIHR5cGUgSVMgJ291dGdvaW5nJyBPUlxuICAgICAgICAgICh0eXBlIElTICdpbmNvbWluZycgQU5EIChcbiAgICAgICAgICAgIHJlYWRTdGF0dXMgPSAke1JlYWRTdGF0dXMuUmVhZH0gT1JcbiAgICAgICAgICAgIHJlYWRTdGF0dXMgPSAke1JlYWRTdGF0dXMuVmlld2VkfSBPUlxuICAgICAgICAgICAgcmVhZFN0YXR1cyBJUyBOVUxMXG4gICAgICAgICAgKSlcbiAgICAgICAgKTtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNvb25lc3RNZXNzYWdlRXhwaXJ5KCk6IFByb21pc2U8dW5kZWZpbmVkIHwgbnVtYmVyPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICAvLyBOb3RlOiB3ZSB1c2UgYHBsdWNrYCB0byBvbmx5IGdldCB0aGUgZmlyc3QgY29sdW1uLlxuICBjb25zdCByZXN1bHQ6IG51bGwgfCBudW1iZXIgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIE1JTihleHBpcmVzQXQpXG4gICAgICBGUk9NIG1lc3NhZ2VzO1xuICAgICAgYFxuICAgIClcbiAgICAucGx1Y2sodHJ1ZSlcbiAgICAuZ2V0KCk7XG5cbiAgcmV0dXJuIHJlc3VsdCB8fCB1bmRlZmluZWQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE5leHRUYXBUb1ZpZXdNZXNzYWdlVGltZXN0YW1wVG9BZ2VPdXQoKTogUHJvbWlzZTxcbiAgdW5kZWZpbmVkIHwgbnVtYmVyXG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3cgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGpzb24gRlJPTSBtZXNzYWdlc1xuICAgICAgV0hFUkVcbiAgICAgICAgaXNWaWV3T25jZSA9IDFcbiAgICAgICAgQU5EIChpc0VyYXNlZCBJUyBOVUxMIE9SIGlzRXJhc2VkICE9IDEpXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBBU0MsIHNlbnRfYXQgQVNDXG4gICAgICBMSU1JVCAxO1xuICAgICAgYFxuICAgIClcbiAgICAuZ2V0KCk7XG5cbiAgaWYgKCFyb3cpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IGpzb25Ub09iamVjdDxNZXNzYWdlVHlwZT4ocm93Lmpzb24pO1xuICBjb25zdCByZXN1bHQgPSBkYXRhLnJlY2VpdmVkX2F0X21zIHx8IGRhdGEucmVjZWl2ZWRfYXQ7XG4gIHJldHVybiBpc05vcm1hbE51bWJlcihyZXN1bHQpID8gcmVzdWx0IDogdW5kZWZpbmVkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRUYXBUb1ZpZXdNZXNzYWdlc05lZWRpbmdFcmFzZSgpOiBQcm9taXNlPEFycmF5PE1lc3NhZ2VUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IFRISVJUWV9EQVlTX0FHTyA9IERhdGUubm93KCkgLSAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uXG4gICAgICBGUk9NIG1lc3NhZ2VzXG4gICAgICBXSEVSRVxuICAgICAgICBpc1ZpZXdPbmNlID0gMVxuICAgICAgICBBTkQgKGlzRXJhc2VkIElTIE5VTEwgT1IgaXNFcmFzZWQgIT0gMSlcbiAgICAgICAgQU5EIHJlY2VpdmVkX2F0IDw9ICRUSElSVFlfREFZU19BR09cbiAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IEFTQywgc2VudF9hdCBBU0M7XG4gICAgICBgXG4gICAgKVxuICAgIC5hbGwoe1xuICAgICAgVEhJUlRZX0RBWVNfQUdPLFxuICAgIH0pO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG59XG5cbmNvbnN0IE1BWF9VTlBST0NFU1NFRF9BVFRFTVBUUyA9IDM7XG5cbmZ1bmN0aW9uIHNhdmVVbnByb2Nlc3NlZFN5bmMoZGF0YTogVW5wcm9jZXNzZWRUeXBlKTogc3RyaW5nIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCB7XG4gICAgaWQsXG4gICAgdGltZXN0YW1wLFxuICAgIHJlY2VpdmVkQXRDb3VudGVyLFxuICAgIHZlcnNpb24sXG4gICAgYXR0ZW1wdHMsXG4gICAgZW52ZWxvcGUsXG4gICAgc291cmNlLFxuICAgIHNvdXJjZVV1aWQsXG4gICAgc291cmNlRGV2aWNlLFxuICAgIHNlcnZlckd1aWQsXG4gICAgc2VydmVyVGltZXN0YW1wLFxuICAgIGRlY3J5cHRlZCxcbiAgICB1cmdlbnQsXG4gIH0gPSBkYXRhO1xuICBpZiAoIWlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzYXZlVW5wcm9jZXNzZWRTeW5jOiBpZCB3YXMgZmFsc2V5Jyk7XG4gIH1cblxuICBpZiAoYXR0ZW1wdHMgPj0gTUFYX1VOUFJPQ0VTU0VEX0FUVEVNUFRTKSB7XG4gICAgcmVtb3ZlVW5wcm9jZXNzZWRTeW5jKGlkKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBwcmVwYXJlKFxuICAgIGRiLFxuICAgIGBcbiAgICBJTlNFUlQgT1IgUkVQTEFDRSBJTlRPIHVucHJvY2Vzc2VkIChcbiAgICAgIGlkLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgcmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICB2ZXJzaW9uLFxuICAgICAgYXR0ZW1wdHMsXG4gICAgICBlbnZlbG9wZSxcbiAgICAgIHNvdXJjZSxcbiAgICAgIHNvdXJjZVV1aWQsXG4gICAgICBzb3VyY2VEZXZpY2UsXG4gICAgICBzZXJ2ZXJHdWlkLFxuICAgICAgc2VydmVyVGltZXN0YW1wLFxuICAgICAgZGVjcnlwdGVkLFxuICAgICAgdXJnZW50XG4gICAgKSB2YWx1ZXMgKFxuICAgICAgJGlkLFxuICAgICAgJHRpbWVzdGFtcCxcbiAgICAgICRyZWNlaXZlZEF0Q291bnRlcixcbiAgICAgICR2ZXJzaW9uLFxuICAgICAgJGF0dGVtcHRzLFxuICAgICAgJGVudmVsb3BlLFxuICAgICAgJHNvdXJjZSxcbiAgICAgICRzb3VyY2VVdWlkLFxuICAgICAgJHNvdXJjZURldmljZSxcbiAgICAgICRzZXJ2ZXJHdWlkLFxuICAgICAgJHNlcnZlclRpbWVzdGFtcCxcbiAgICAgICRkZWNyeXB0ZWQsXG4gICAgICAkdXJnZW50XG4gICAgKTtcbiAgICBgXG4gICkucnVuKHtcbiAgICBpZCxcbiAgICB0aW1lc3RhbXAsXG4gICAgcmVjZWl2ZWRBdENvdW50ZXI6IHJlY2VpdmVkQXRDb3VudGVyID8/IG51bGwsXG4gICAgdmVyc2lvbixcbiAgICBhdHRlbXB0cyxcbiAgICBlbnZlbG9wZTogZW52ZWxvcGUgfHwgbnVsbCxcbiAgICBzb3VyY2U6IHNvdXJjZSB8fCBudWxsLFxuICAgIHNvdXJjZVV1aWQ6IHNvdXJjZVV1aWQgfHwgbnVsbCxcbiAgICBzb3VyY2VEZXZpY2U6IHNvdXJjZURldmljZSB8fCBudWxsLFxuICAgIHNlcnZlckd1aWQ6IHNlcnZlckd1aWQgfHwgbnVsbCxcbiAgICBzZXJ2ZXJUaW1lc3RhbXA6IHNlcnZlclRpbWVzdGFtcCB8fCBudWxsLFxuICAgIGRlY3J5cHRlZDogZGVjcnlwdGVkIHx8IG51bGwsXG4gICAgdXJnZW50OiB1cmdlbnQgfHwgIWlzQm9vbGVhbih1cmdlbnQpID8gMSA6IDAsXG4gIH0pO1xuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVW5wcm9jZXNzZWRXaXRoRGF0YVN5bmMoXG4gIGlkOiBzdHJpbmcsXG4gIGRhdGE6IFVucHJvY2Vzc2VkVXBkYXRlVHlwZVxuKTogdm9pZCB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qge1xuICAgIHNvdXJjZSxcbiAgICBzb3VyY2VVdWlkLFxuICAgIHNvdXJjZURldmljZSxcbiAgICBzZXJ2ZXJHdWlkLFxuICAgIHNlcnZlclRpbWVzdGFtcCxcbiAgICBkZWNyeXB0ZWQsXG4gIH0gPSBkYXRhO1xuXG4gIHByZXBhcmUoXG4gICAgZGIsXG4gICAgYFxuICAgIFVQREFURSB1bnByb2Nlc3NlZCBTRVRcbiAgICAgIHNvdXJjZSA9ICRzb3VyY2UsXG4gICAgICBzb3VyY2VVdWlkID0gJHNvdXJjZVV1aWQsXG4gICAgICBzb3VyY2VEZXZpY2UgPSAkc291cmNlRGV2aWNlLFxuICAgICAgc2VydmVyR3VpZCA9ICRzZXJ2ZXJHdWlkLFxuICAgICAgc2VydmVyVGltZXN0YW1wID0gJHNlcnZlclRpbWVzdGFtcCxcbiAgICAgIGRlY3J5cHRlZCA9ICRkZWNyeXB0ZWRcbiAgICBXSEVSRSBpZCA9ICRpZDtcbiAgICBgXG4gICkucnVuKHtcbiAgICBpZCxcbiAgICBzb3VyY2U6IHNvdXJjZSB8fCBudWxsLFxuICAgIHNvdXJjZVV1aWQ6IHNvdXJjZVV1aWQgfHwgbnVsbCxcbiAgICBzb3VyY2VEZXZpY2U6IHNvdXJjZURldmljZSB8fCBudWxsLFxuICAgIHNlcnZlckd1aWQ6IHNlcnZlckd1aWQgfHwgbnVsbCxcbiAgICBzZXJ2ZXJUaW1lc3RhbXA6IHNlcnZlclRpbWVzdGFtcCB8fCBudWxsLFxuICAgIGRlY3J5cHRlZDogZGVjcnlwdGVkIHx8IG51bGwsXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVVbnByb2Nlc3NlZFdpdGhEYXRhKFxuICBpZDogc3RyaW5nLFxuICBkYXRhOiBVbnByb2Nlc3NlZFVwZGF0ZVR5cGVcbik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gdXBkYXRlVW5wcm9jZXNzZWRXaXRoRGF0YVN5bmMoaWQsIGRhdGEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVVbnByb2Nlc3NlZHNXaXRoRGF0YShcbiAgYXJyYXlPZlVucHJvY2Vzc2VkOiBBcnJheTx7IGlkOiBzdHJpbmc7IGRhdGE6IFVucHJvY2Vzc2VkVXBkYXRlVHlwZSB9PlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZm9yIChjb25zdCB7IGlkLCBkYXRhIH0gb2YgYXJyYXlPZlVucHJvY2Vzc2VkKSB7XG4gICAgICBhc3NlcnRTeW5jKHVwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGFTeW5jKGlkLCBkYXRhKSk7XG4gICAgfVxuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRVbnByb2Nlc3NlZEJ5SWQoXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8VW5wcm9jZXNzZWRUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgcm93ID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oJ1NFTEVDVCAqIEZST00gdW5wcm9jZXNzZWQgV0hFUkUgaWQgPSAkaWQ7JylcbiAgICAuZ2V0KHtcbiAgICAgIGlkLFxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgLi4ucm93LFxuICAgIHVyZ2VudDogaXNOdW1iZXIocm93LnVyZ2VudCkgPyBCb29sZWFuKHJvdy51cmdlbnQpIDogdHJ1ZSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VW5wcm9jZXNzZWRDb3VudCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gZ2V0Q291bnRGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgJ3VucHJvY2Vzc2VkJyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTogUHJvbWlzZTxcbiAgQXJyYXk8VW5wcm9jZXNzZWRUeXBlPlxuPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICByZXR1cm4gZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGNvbnN0IHsgY2hhbmdlczogZGVsZXRlZFN0YWxlQ291bnQgfSA9IGRiXG4gICAgICAucHJlcGFyZTxRdWVyeT4oJ0RFTEVURSBGUk9NIHVucHJvY2Vzc2VkIFdIRVJFIHRpbWVzdGFtcCA8ICRtb250aEFnbycpXG4gICAgICAucnVuKHtcbiAgICAgICAgbW9udGhBZ286IERhdGUubm93KCkgLSBkdXJhdGlvbnMuTU9OVEgsXG4gICAgICB9KTtcblxuICAgIGlmIChkZWxldGVkU3RhbGVDb3VudCAhPT0gMCkge1xuICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgICdnZXRBbGxVbnByb2Nlc3NlZEFuZEluY3JlbWVudEF0dGVtcHRzOiAnICtcbiAgICAgICAgICBgZGVsZXRpbmcgJHtkZWxldGVkU3RhbGVDb3VudH0gb2xkIHVucHJvY2Vzc2VkIGVudmVsb3Blc2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZGIucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgIGBcbiAgICAgICAgVVBEQVRFIHVucHJvY2Vzc2VkXG4gICAgICAgIFNFVCBhdHRlbXB0cyA9IGF0dGVtcHRzICsgMVxuICAgICAgYFxuICAgICkucnVuKCk7XG5cbiAgICBjb25zdCB7IGNoYW5nZXM6IGRlbGV0ZWRJbnZhbGlkQ291bnQgfSA9IGRiXG4gICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgICBERUxFVEUgRlJPTSB1bnByb2Nlc3NlZFxuICAgICAgICAgIFdIRVJFIGF0dGVtcHRzID49ICRNQVhfVU5QUk9DRVNTRURfQVRURU1QVFNcbiAgICAgICAgYFxuICAgICAgKVxuICAgICAgLnJ1bih7IE1BWF9VTlBST0NFU1NFRF9BVFRFTVBUUyB9KTtcblxuICAgIGlmIChkZWxldGVkSW52YWxpZENvdW50ICE9PSAwKSB7XG4gICAgICBsb2dnZXIud2FybihcbiAgICAgICAgJ2dldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHM6ICcgK1xuICAgICAgICAgIGBkZWxldGluZyAke2RlbGV0ZWRJbnZhbGlkQ291bnR9IGludmFsaWQgdW5wcm9jZXNzZWQgZW52ZWxvcGVzYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGJcbiAgICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgICAgU0VMRUNUICpcbiAgICAgICAgICBGUk9NIHVucHJvY2Vzc2VkXG4gICAgICAgICAgT1JERVIgQlkgcmVjZWl2ZWRBdENvdW50ZXIgQVNDO1xuICAgICAgICBgXG4gICAgICApXG4gICAgICAuYWxsKClcbiAgICAgIC5tYXAocm93ID0+ICh7XG4gICAgICAgIC4uLnJvdyxcbiAgICAgICAgdXJnZW50OiBpc051bWJlcihyb3cudXJnZW50KSA/IEJvb2xlYW4ocm93LnVyZ2VudCkgOiB0cnVlLFxuICAgICAgfSkpO1xuICB9KSgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVVbnByb2Nlc3NlZHNTeW5jKGlkczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIucHJlcGFyZTxBcnJheVF1ZXJ5PihcbiAgICBgXG4gICAgREVMRVRFIEZST00gdW5wcm9jZXNzZWRcbiAgICBXSEVSRSBpZCBJTiAoICR7aWRzLm1hcCgoKSA9PiAnPycpLmpvaW4oJywgJyl9ICk7XG4gICAgYFxuICApLnJ1bihpZHMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVVbnByb2Nlc3NlZFN5bmMoaWQ6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShpZCkpIHtcbiAgICBwcmVwYXJlKGRiLCAnREVMRVRFIEZST00gdW5wcm9jZXNzZWQgV0hFUkUgaWQgPSAkaWQ7JykucnVuKHsgaWQgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUaGlzIGNhbiBoYXBwZW4gbm9ybWFsbHkgZHVlIHRvIGZsdXNoaW5nIG9mIGBjYWNoZVJlbW92ZUJhdGNoZXJgIGluXG4gIC8vIE1lc3NhZ2VSZWNlaXZlci5cbiAgaWYgKCFpZC5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3NlcnRTeW5jKGJhdGNoTXVsdGlWYXJRdWVyeShkYiwgaWQsIHJlbW92ZVVucHJvY2Vzc2Vkc1N5bmMpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVW5wcm9jZXNzZWQoaWQ6IHN0cmluZyB8IEFycmF5PHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmVtb3ZlVW5wcm9jZXNzZWRTeW5jKGlkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsVW5wcm9jZXNzZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgZGIucHJlcGFyZTxFbXB0eVF1ZXJ5PignREVMRVRFIEZST00gdW5wcm9jZXNzZWQ7JykucnVuKCk7XG59XG5cbi8vIEF0dGFjaG1lbnQgRG93bmxvYWRzXG5cbmNvbnN0IEFUVEFDSE1FTlRfRE9XTkxPQURTX1RBQkxFID0gJ2F0dGFjaG1lbnRfZG93bmxvYWRzJztcbmFzeW5jIGZ1bmN0aW9uIGdldEF0dGFjaG1lbnREb3dubG9hZEpvYkJ5SWQoXG4gIGlkOiBzdHJpbmdcbik6IFByb21pc2U8QXR0YWNobWVudERvd25sb2FkSm9iVHlwZSB8IHVuZGVmaW5lZD4ge1xuICByZXR1cm4gZ2V0QnlJZChnZXRJbnN0YW5jZSgpLCBBVFRBQ0hNRU5UX0RPV05MT0FEU19UQUJMRSwgaWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0TmV4dEF0dGFjaG1lbnREb3dubG9hZEpvYnMoXG4gIGxpbWl0PzogbnVtYmVyLFxuICBvcHRpb25zOiB7IHRpbWVzdGFtcD86IG51bWJlciB9ID0ge31cbik6IFByb21pc2U8QXJyYXk8QXR0YWNobWVudERvd25sb2FkSm9iVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCB0aW1lc3RhbXAgPVxuICAgIG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lc3RhbXAgPyBvcHRpb25zLnRpbWVzdGFtcCA6IERhdGUubm93KCk7XG5cbiAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBqc29uXG4gICAgICBGUk9NIGF0dGFjaG1lbnRfZG93bmxvYWRzXG4gICAgICBXSEVSRSBwZW5kaW5nID0gMCBBTkQgdGltZXN0YW1wIDw9ICR0aW1lc3RhbXBcbiAgICAgIE9SREVSIEJZIHRpbWVzdGFtcCBERVNDXG4gICAgICBMSU1JVCAkbGltaXQ7XG4gICAgICBgXG4gICAgKVxuICAgIC5hbGwoe1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IDMsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfSk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiBqc29uVG9PYmplY3Qocm93Lmpzb24pKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNhdmVBdHRhY2htZW50RG93bmxvYWRKb2IoXG4gIGpvYjogQXR0YWNobWVudERvd25sb2FkSm9iVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3QgeyBpZCwgcGVuZGluZywgdGltZXN0YW1wIH0gPSBqb2I7XG4gIGlmICghaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnc2F2ZUF0dGFjaG1lbnREb3dubG9hZEpvYjogUHJvdmlkZWQgam9iIGRpZCBub3QgaGF2ZSBhIHRydXRoeSBpZCdcbiAgICApO1xuICB9XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgIElOU0VSVCBPUiBSRVBMQUNFIElOVE8gYXR0YWNobWVudF9kb3dubG9hZHMgKFxuICAgICAgaWQsXG4gICAgICBwZW5kaW5nLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAganNvblxuICAgICkgdmFsdWVzIChcbiAgICAgICRpZCxcbiAgICAgICRwZW5kaW5nLFxuICAgICAgJHRpbWVzdGFtcCxcbiAgICAgICRqc29uXG4gICAgKVxuICAgIGBcbiAgKS5ydW4oe1xuICAgIGlkLFxuICAgIHBlbmRpbmcsXG4gICAgdGltZXN0YW1wLFxuICAgIGpzb246IG9iamVjdFRvSlNPTihqb2IpLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNldEF0dGFjaG1lbnREb3dubG9hZEpvYlBlbmRpbmcoXG4gIGlkOiBzdHJpbmcsXG4gIHBlbmRpbmc6IGJvb2xlYW5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBVUERBVEUgYXR0YWNobWVudF9kb3dubG9hZHNcbiAgICBTRVQgcGVuZGluZyA9ICRwZW5kaW5nXG4gICAgV0hFUkUgaWQgPSAkaWQ7XG4gICAgYFxuICApLnJ1bih7XG4gICAgaWQsXG4gICAgcGVuZGluZzogcGVuZGluZyA/IDEgOiAwLFxuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0QXR0YWNobWVudERvd25sb2FkUGVuZGluZygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgIGBcbiAgICBVUERBVEUgYXR0YWNobWVudF9kb3dubG9hZHNcbiAgICBTRVQgcGVuZGluZyA9IDBcbiAgICBXSEVSRSBwZW5kaW5nICE9IDA7XG4gICAgYFxuICApLnJ1bigpO1xufVxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQXR0YWNobWVudERvd25sb2FkSm9iKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHJlbW92ZUJ5SWQoZ2V0SW5zdGFuY2UoKSwgQVRUQUNITUVOVF9ET1dOTE9BRFNfVEFCTEUsIGlkKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbEF0dGFjaG1lbnREb3dubG9hZEpvYnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVBbGxGcm9tVGFibGUoZ2V0SW5zdGFuY2UoKSwgQVRUQUNITUVOVF9ET1dOTE9BRFNfVEFCTEUpO1xufVxuXG4vLyBTdGlja2Vyc1xuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVN0aWNrZXJQYWNrKHBhY2s6IFN0aWNrZXJQYWNrVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHtcbiAgICBhdHRlbXB0ZWRTdGF0dXMsXG4gICAgYXV0aG9yLFxuICAgIGNvdmVyU3RpY2tlcklkLFxuICAgIGNyZWF0ZWRBdCxcbiAgICBkb3dubG9hZEF0dGVtcHRzLFxuICAgIGlkLFxuICAgIGluc3RhbGxlZEF0LFxuICAgIGtleSxcbiAgICBsYXN0VXNlZCxcbiAgICBzdGF0dXMsXG4gICAgc3RpY2tlckNvdW50LFxuICAgIHRpdGxlLFxuICAgIHN0b3JhZ2VJRCxcbiAgICBzdG9yYWdlVmVyc2lvbixcbiAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICBzdG9yYWdlTmVlZHNTeW5jLFxuICB9ID0gcGFjaztcbiAgaWYgKCFpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdjcmVhdGVPclVwZGF0ZVN0aWNrZXJQYWNrOiBQcm92aWRlZCBkYXRhIGRpZCBub3QgaGF2ZSBhIHRydXRoeSBpZCdcbiAgICApO1xuICB9XG5cbiAgbGV0IHsgcG9zaXRpb24gfSA9IHBhY2s7XG5cbiAgLy8gQXNzaWduIGRlZmF1bHQgcG9zaXRpb25cbiAgaWYgKCFpc051bWJlcihwb3NpdGlvbikpIHtcbiAgICBwb3NpdGlvbiA9IGRiXG4gICAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1QgSUZOVUxMKE1BWChwb3NpdGlvbikgKyAxLCAwKVxuICAgICAgICBGUk9NIHN0aWNrZXJfcGFja3NcbiAgICAgICAgYFxuICAgICAgKVxuICAgICAgLnBsdWNrKClcbiAgICAgIC5nZXQoKTtcbiAgfVxuXG4gIGNvbnN0IHJvdyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGlkXG4gICAgICBGUk9NIHN0aWNrZXJfcGFja3NcbiAgICAgIFdIRVJFIGlkID0gJGlkO1xuICAgICAgYFxuICAgIClcbiAgICAuZ2V0KHsgaWQgfSk7XG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgYXR0ZW1wdGVkU3RhdHVzOiBhdHRlbXB0ZWRTdGF0dXMgPz8gbnVsbCxcbiAgICBhdXRob3IsXG4gICAgY292ZXJTdGlja2VySWQsXG4gICAgY3JlYXRlZEF0OiBjcmVhdGVkQXQgfHwgRGF0ZS5ub3coKSxcbiAgICBkb3dubG9hZEF0dGVtcHRzOiBkb3dubG9hZEF0dGVtcHRzIHx8IDEsXG4gICAgaWQsXG4gICAgaW5zdGFsbGVkQXQ6IGluc3RhbGxlZEF0ID8/IG51bGwsXG4gICAga2V5LFxuICAgIGxhc3RVc2VkOiBsYXN0VXNlZCB8fCBudWxsLFxuICAgIHN0YXR1cyxcbiAgICBzdGlja2VyQ291bnQsXG4gICAgdGl0bGUsXG4gICAgcG9zaXRpb246IHBvc2l0aW9uID8/IDAsXG4gICAgc3RvcmFnZUlEOiBzdG9yYWdlSUQgPz8gbnVsbCxcbiAgICBzdG9yYWdlVmVyc2lvbjogc3RvcmFnZVZlcnNpb24gPz8gbnVsbCxcbiAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogc3RvcmFnZVVua25vd25GaWVsZHMgPz8gbnVsbCxcbiAgICBzdG9yYWdlTmVlZHNTeW5jOiBzdG9yYWdlTmVlZHNTeW5jID8gMSA6IDAsXG4gIH07XG5cbiAgaWYgKHJvdykge1xuICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgVVBEQVRFIHN0aWNrZXJfcGFja3MgU0VUXG4gICAgICAgIGF0dGVtcHRlZFN0YXR1cyA9ICRhdHRlbXB0ZWRTdGF0dXMsXG4gICAgICAgIGF1dGhvciA9ICRhdXRob3IsXG4gICAgICAgIGNvdmVyU3RpY2tlcklkID0gJGNvdmVyU3RpY2tlcklkLFxuICAgICAgICBjcmVhdGVkQXQgPSAkY3JlYXRlZEF0LFxuICAgICAgICBkb3dubG9hZEF0dGVtcHRzID0gJGRvd25sb2FkQXR0ZW1wdHMsXG4gICAgICAgIGluc3RhbGxlZEF0ID0gJGluc3RhbGxlZEF0LFxuICAgICAgICBrZXkgPSAka2V5LFxuICAgICAgICBsYXN0VXNlZCA9ICRsYXN0VXNlZCxcbiAgICAgICAgc3RhdHVzID0gJHN0YXR1cyxcbiAgICAgICAgc3RpY2tlckNvdW50ID0gJHN0aWNrZXJDb3VudCxcbiAgICAgICAgdGl0bGUgPSAkdGl0bGUsXG4gICAgICAgIHBvc2l0aW9uID0gJHBvc2l0aW9uLFxuICAgICAgICBzdG9yYWdlSUQgPSAkc3RvcmFnZUlELFxuICAgICAgICBzdG9yYWdlVmVyc2lvbiA9ICRzdG9yYWdlVmVyc2lvbixcbiAgICAgICAgc3RvcmFnZVVua25vd25GaWVsZHMgPSAkc3RvcmFnZVVua25vd25GaWVsZHMsXG4gICAgICAgIHN0b3JhZ2VOZWVkc1N5bmMgPSAkc3RvcmFnZU5lZWRzU3luY1xuICAgICAgV0hFUkUgaWQgPSAkaWQ7XG4gICAgICBgXG4gICAgKS5ydW4ocGF5bG9hZCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICBgXG4gICAgSU5TRVJUIElOVE8gc3RpY2tlcl9wYWNrcyAoXG4gICAgICBhdHRlbXB0ZWRTdGF0dXMsXG4gICAgICBhdXRob3IsXG4gICAgICBjb3ZlclN0aWNrZXJJZCxcbiAgICAgIGNyZWF0ZWRBdCxcbiAgICAgIGRvd25sb2FkQXR0ZW1wdHMsXG4gICAgICBpZCxcbiAgICAgIGluc3RhbGxlZEF0LFxuICAgICAga2V5LFxuICAgICAgbGFzdFVzZWQsXG4gICAgICBzdGF0dXMsXG4gICAgICBzdGlja2VyQ291bnQsXG4gICAgICB0aXRsZSxcbiAgICAgIHBvc2l0aW9uLFxuICAgICAgc3RvcmFnZUlELFxuICAgICAgc3RvcmFnZVZlcnNpb24sXG4gICAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmNcbiAgICApIHZhbHVlcyAoXG4gICAgICAkYXR0ZW1wdGVkU3RhdHVzLFxuICAgICAgJGF1dGhvcixcbiAgICAgICRjb3ZlclN0aWNrZXJJZCxcbiAgICAgICRjcmVhdGVkQXQsXG4gICAgICAkZG93bmxvYWRBdHRlbXB0cyxcbiAgICAgICRpZCxcbiAgICAgICRpbnN0YWxsZWRBdCxcbiAgICAgICRrZXksXG4gICAgICAkbGFzdFVzZWQsXG4gICAgICAkc3RhdHVzLFxuICAgICAgJHN0aWNrZXJDb3VudCxcbiAgICAgICR0aXRsZSxcbiAgICAgICRwb3NpdGlvbixcbiAgICAgICRzdG9yYWdlSUQsXG4gICAgICAkc3RvcmFnZVZlcnNpb24sXG4gICAgICAkc3RvcmFnZVVua25vd25GaWVsZHMsXG4gICAgICAkc3RvcmFnZU5lZWRzU3luY1xuICAgIClcbiAgICBgXG4gICkucnVuKHBheWxvYWQpO1xufVxuZnVuY3Rpb24gdXBkYXRlU3RpY2tlclBhY2tTdGF0dXNTeW5jKFxuICBpZDogc3RyaW5nLFxuICBzdGF0dXM6IFN0aWNrZXJQYWNrU3RhdHVzVHlwZSxcbiAgb3B0aW9ucz86IHsgdGltZXN0YW1wOiBudW1iZXIgfVxuKTogdm9pZCB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3QgdGltZXN0YW1wID0gb3B0aW9ucyA/IG9wdGlvbnMudGltZXN0YW1wIHx8IERhdGUubm93KCkgOiBEYXRlLm5vdygpO1xuICBjb25zdCBpbnN0YWxsZWRBdCA9IHN0YXR1cyA9PT0gJ2luc3RhbGxlZCcgPyB0aW1lc3RhbXAgOiBudWxsO1xuXG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBVUERBVEUgc3RpY2tlcl9wYWNrc1xuICAgIFNFVCBzdGF0dXMgPSAkc3RhdHVzLCBpbnN0YWxsZWRBdCA9ICRpbnN0YWxsZWRBdFxuICAgIFdIRVJFIGlkID0gJGlkO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIGlkLFxuICAgIHN0YXR1cyxcbiAgICBpbnN0YWxsZWRBdCxcbiAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTdGlja2VyUGFja1N0YXR1cyhcbiAgaWQ6IHN0cmluZyxcbiAgc3RhdHVzOiBTdGlja2VyUGFja1N0YXR1c1R5cGUsXG4gIG9wdGlvbnM/OiB7IHRpbWVzdGFtcDogbnVtYmVyIH1cbik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gdXBkYXRlU3RpY2tlclBhY2tTdGF0dXNTeW5jKGlkLCBzdGF0dXMsIG9wdGlvbnMpO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RpY2tlclBhY2tJbmZvKHtcbiAgaWQsXG4gIHN0b3JhZ2VJRCxcbiAgc3RvcmFnZVZlcnNpb24sXG4gIHN0b3JhZ2VVbmtub3duRmllbGRzLFxuICBzdG9yYWdlTmVlZHNTeW5jLFxuICB1bmluc3RhbGxlZEF0LFxufTogU3RpY2tlclBhY2tJbmZvVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgaWYgKHVuaW5zdGFsbGVkQXQpIHtcbiAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFVQREFURSB1bmluc3RhbGxlZF9zdGlja2VyX3BhY2tzXG4gICAgICBTRVRcbiAgICAgICAgc3RvcmFnZUlEID0gJHN0b3JhZ2VJRCxcbiAgICAgICAgc3RvcmFnZVZlcnNpb24gPSAkc3RvcmFnZVZlcnNpb24sXG4gICAgICAgIHN0b3JhZ2VVbmtub3duRmllbGRzID0gJHN0b3JhZ2VVbmtub3duRmllbGRzLFxuICAgICAgICBzdG9yYWdlTmVlZHNTeW5jID0gJHN0b3JhZ2VOZWVkc1N5bmNcbiAgICAgIFdIRVJFIGlkID0gJGlkO1xuICAgICAgYFxuICAgICkucnVuKHtcbiAgICAgIGlkLFxuICAgICAgc3RvcmFnZUlEOiBzdG9yYWdlSUQgPz8gbnVsbCxcbiAgICAgIHN0b3JhZ2VWZXJzaW9uOiBzdG9yYWdlVmVyc2lvbiA/PyBudWxsLFxuICAgICAgc3RvcmFnZVVua25vd25GaWVsZHM6IHN0b3JhZ2VVbmtub3duRmllbGRzID8/IG51bGwsXG4gICAgICBzdG9yYWdlTmVlZHNTeW5jOiBzdG9yYWdlTmVlZHNTeW5jID8gMSA6IDAsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBVUERBVEUgc3RpY2tlcl9wYWNrc1xuICAgICAgU0VUXG4gICAgICAgIHN0b3JhZ2VJRCA9ICRzdG9yYWdlSUQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uID0gJHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyA9ICRzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luYyA9ICRzdG9yYWdlTmVlZHNTeW5jXG4gICAgICBXSEVSRSBpZCA9ICRpZDtcbiAgICAgIGBcbiAgICApLnJ1bih7XG4gICAgICBpZCxcbiAgICAgIHN0b3JhZ2VJRDogc3RvcmFnZUlEID8/IG51bGwsXG4gICAgICBzdG9yYWdlVmVyc2lvbjogc3RvcmFnZVZlcnNpb24gPz8gbnVsbCxcbiAgICAgIHN0b3JhZ2VVbmtub3duRmllbGRzOiBzdG9yYWdlVW5rbm93bkZpZWxkcyA/PyBudWxsLFxuICAgICAgc3RvcmFnZU5lZWRzU3luYzogc3RvcmFnZU5lZWRzU3luYyA/IDEgOiAwLFxuICAgIH0pO1xuICB9XG59XG5hc3luYyBmdW5jdGlvbiBjbGVhckFsbEVycm9yU3RpY2tlclBhY2tBdHRlbXB0cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgYFxuICAgIFVQREFURSBzdGlja2VyX3BhY2tzXG4gICAgU0VUIGRvd25sb2FkQXR0ZW1wdHMgPSAwXG4gICAgV0hFUkUgc3RhdHVzID0gJ2Vycm9yJztcbiAgICBgXG4gICkucnVuKCk7XG59XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZVN0aWNrZXIoc3RpY2tlcjogU3RpY2tlclR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCB7IGVtb2ppLCBoZWlnaHQsIGlkLCBpc0NvdmVyT25seSwgbGFzdFVzZWQsIHBhY2tJZCwgcGF0aCwgd2lkdGggfSA9XG4gICAgc3RpY2tlcjtcblxuICBpZiAoIWlzTnVtYmVyKGlkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdjcmVhdGVPclVwZGF0ZVN0aWNrZXI6IFByb3ZpZGVkIGRhdGEgZGlkIG5vdCBoYXZlIGEgbnVtZXJpYyBpZCdcbiAgICApO1xuICB9XG4gIGlmICghcGFja0lkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2NyZWF0ZU9yVXBkYXRlU3RpY2tlcjogUHJvdmlkZWQgZGF0YSBkaWQgbm90IGhhdmUgYSB0cnV0aHkgaWQnXG4gICAgKTtcbiAgfVxuXG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBJTlNFUlQgT1IgUkVQTEFDRSBJTlRPIHN0aWNrZXJzIChcbiAgICAgIGVtb2ppLFxuICAgICAgaGVpZ2h0LFxuICAgICAgaWQsXG4gICAgICBpc0NvdmVyT25seSxcbiAgICAgIGxhc3RVc2VkLFxuICAgICAgcGFja0lkLFxuICAgICAgcGF0aCxcbiAgICAgIHdpZHRoXG4gICAgKSB2YWx1ZXMgKFxuICAgICAgJGVtb2ppLFxuICAgICAgJGhlaWdodCxcbiAgICAgICRpZCxcbiAgICAgICRpc0NvdmVyT25seSxcbiAgICAgICRsYXN0VXNlZCxcbiAgICAgICRwYWNrSWQsXG4gICAgICAkcGF0aCxcbiAgICAgICR3aWR0aFxuICAgIClcbiAgICBgXG4gICkucnVuKHtcbiAgICBlbW9qaTogZW1vamkgPz8gbnVsbCxcbiAgICBoZWlnaHQsXG4gICAgaWQsXG4gICAgaXNDb3Zlck9ubHk6IGlzQ292ZXJPbmx5ID8gMSA6IDAsXG4gICAgbGFzdFVzZWQ6IGxhc3RVc2VkIHx8IG51bGwsXG4gICAgcGFja0lkLFxuICAgIHBhdGgsXG4gICAgd2lkdGgsXG4gIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3RpY2tlckxhc3RVc2VkKFxuICBwYWNrSWQ6IHN0cmluZyxcbiAgc3RpY2tlcklkOiBudW1iZXIsXG4gIGxhc3RVc2VkOiBudW1iZXJcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBVUERBVEUgc3RpY2tlcnNcbiAgICBTRVQgbGFzdFVzZWQgPSAkbGFzdFVzZWRcbiAgICBXSEVSRSBpZCA9ICRpZCBBTkQgcGFja0lkID0gJHBhY2tJZDtcbiAgICBgXG4gICkucnVuKHtcbiAgICBpZDogc3RpY2tlcklkLFxuICAgIHBhY2tJZCxcbiAgICBsYXN0VXNlZCxcbiAgfSk7XG4gIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgIGBcbiAgICBVUERBVEUgc3RpY2tlcl9wYWNrc1xuICAgIFNFVCBsYXN0VXNlZCA9ICRsYXN0VXNlZFxuICAgIFdIRVJFIGlkID0gJGlkO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIGlkOiBwYWNrSWQsXG4gICAgbGFzdFVzZWQsXG4gIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gYWRkU3RpY2tlclBhY2tSZWZlcmVuY2UoXG4gIG1lc3NhZ2VJZDogc3RyaW5nLFxuICBwYWNrSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBpZiAoIW1lc3NhZ2VJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdhZGRTdGlja2VyUGFja1JlZmVyZW5jZTogUHJvdmlkZWQgZGF0YSBkaWQgbm90IGhhdmUgYSB0cnV0aHkgbWVzc2FnZUlkJ1xuICAgICk7XG4gIH1cbiAgaWYgKCFwYWNrSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnYWRkU3RpY2tlclBhY2tSZWZlcmVuY2U6IFByb3ZpZGVkIGRhdGEgZGlkIG5vdCBoYXZlIGEgdHJ1dGh5IHBhY2tJZCdcbiAgICApO1xuICB9XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgIElOU0VSVCBPUiBSRVBMQUNFIElOVE8gc3RpY2tlcl9yZWZlcmVuY2VzIChcbiAgICAgIG1lc3NhZ2VJZCxcbiAgICAgIHBhY2tJZFxuICAgICkgdmFsdWVzIChcbiAgICAgICRtZXNzYWdlSWQsXG4gICAgICAkcGFja0lkXG4gICAgKVxuICAgIGBcbiAgKS5ydW4oe1xuICAgIG1lc3NhZ2VJZCxcbiAgICBwYWNrSWQsXG4gIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RpY2tlclBhY2tSZWZlcmVuY2UoXG4gIG1lc3NhZ2VJZDogc3RyaW5nLFxuICBwYWNrSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxSZWFkb25seUFycmF5PHN0cmluZz4gfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGlmICghbWVzc2FnZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2FkZFN0aWNrZXJQYWNrUmVmZXJlbmNlOiBQcm92aWRlZCBkYXRhIGRpZCBub3QgaGF2ZSBhIHRydXRoeSBtZXNzYWdlSWQnXG4gICAgKTtcbiAgfVxuICBpZiAoIXBhY2tJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdhZGRTdGlja2VyUGFja1JlZmVyZW5jZTogUHJvdmlkZWQgZGF0YSBkaWQgbm90IGhhdmUgYSB0cnV0aHkgcGFja0lkJ1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gZGJcbiAgICAudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgICAgLy8gV2UgdXNlIGFuIGltbWVkaWF0ZSB0cmFuc2FjdGlvbiBoZXJlIHRvIGltbWVkaWF0ZWx5IGFjcXVpcmUgYW4gZXhjbHVzaXZlIGxvY2ssXG4gICAgICAvLyAgIHdoaWNoIHdvdWxkIG5vcm1hbGx5IG9ubHkgaGFwcGVuIHdoZW4gd2UgZGlkIG91ciBmaXJzdCB3cml0ZS5cblxuICAgICAgLy8gV2UgbmVlZCB0aGlzIHRvIGVuc3VyZSB0aGF0IG91ciBmaXZlIHF1ZXJpZXMgYXJlIGFsbCBhdG9taWMsIHdpdGggbm9cbiAgICAgIC8vIG90aGVyIGNoYW5nZXMgaGFwcGVuaW5nIHdoaWxlIHdlIGRvIGl0OlxuICAgICAgLy8gMS4gRGVsZXRlIG91ciB0YXJnZXQgbWVzc2FnZUlkL3BhY2tJZCByZWZlcmVuY2VzXG4gICAgICAvLyAyLiBDaGVjayB0aGUgbnVtYmVyIG9mIHJlZmVyZW5jZXMgc3RpbGwgcG9pbnRpbmcgYXQgcGFja0lkXG4gICAgICAvLyAzLiBJZiB0aGF0IG51bWJlciBpcyB6ZXJvLCBnZXQgcGFjayBmcm9tIHN0aWNrZXJfcGFja3MgZGF0YWJhc2VcbiAgICAgIC8vIDQuIElmIGl0J3Mgbm90IGluc3RhbGxlZCwgdGhlbiBncmFiIGFsbCBvZiBpdHMgc3RpY2tlciBwYXRoc1xuICAgICAgLy8gNS4gSWYgaXQncyBub3QgaW5zdGFsbGVkLCB0aGVuIHN0aWNrZXIgcGFjayAod2hpY2ggY2FzY2FkZXMgdG8gYWxsXG4gICAgICAvLyAgICBzdGlja2VycyBhbmQgcmVmZXJlbmNlcylcbiAgICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIERFTEVURSBGUk9NIHN0aWNrZXJfcmVmZXJlbmNlc1xuICAgICAgICBXSEVSRSBtZXNzYWdlSWQgPSAkbWVzc2FnZUlkIEFORCBwYWNrSWQgPSAkcGFja0lkO1xuICAgICAgICBgXG4gICAgICApLnJ1bih7XG4gICAgICAgIG1lc3NhZ2VJZCxcbiAgICAgICAgcGFja0lkLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvdW50Um93ID0gZGJcbiAgICAgICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICAgIGBcbiAgICAgICAgICBTRUxFQ1QgY291bnQoKikgRlJPTSBzdGlja2VyX3JlZmVyZW5jZXNcbiAgICAgICAgICBXSEVSRSBwYWNrSWQgPSAkcGFja0lkO1xuICAgICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuZ2V0KHsgcGFja0lkIH0pO1xuICAgICAgaWYgKCFjb3VudFJvdykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2RlbGV0ZVN0aWNrZXJQYWNrUmVmZXJlbmNlOiBVbmFibGUgdG8gZ2V0IGNvdW50IG9mIHJlZmVyZW5jZXMnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBjb3VudCA9IGNvdW50Um93Wydjb3VudCgqKSddO1xuICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwYWNrUm93OiB7IHN0YXR1czogU3RpY2tlclBhY2tTdGF0dXNUeXBlIH0gPSBkYlxuICAgICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgICAgYFxuICAgICAgICAgIFNFTEVDVCBzdGF0dXMgRlJPTSBzdGlja2VyX3BhY2tzXG4gICAgICAgICAgV0hFUkUgaWQgPSAkcGFja0lkO1xuICAgICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuZ2V0KHsgcGFja0lkIH0pO1xuICAgICAgaWYgKCFwYWNrUm93KSB7XG4gICAgICAgIGxvZ2dlci53YXJuKCdkZWxldGVTdGlja2VyUGFja1JlZmVyZW5jZTogZGlkIG5vdCBmaW5kIHJlZmVyZW5jZWQgcGFjaycpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IHBhY2tSb3c7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09ICdpbnN0YWxsZWQnKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0aWNrZXJQYXRoUm93czogQXJyYXk8eyBwYXRoOiBzdHJpbmcgfT4gPSBkYlxuICAgICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgICAgYFxuICAgICAgICAgIFNFTEVDVCBwYXRoIEZST00gc3RpY2tlcnNcbiAgICAgICAgICBXSEVSRSBwYWNrSWQgPSAkcGFja0lkO1xuICAgICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuYWxsKHtcbiAgICAgICAgICBwYWNrSWQsXG4gICAgICAgIH0pO1xuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgREVMRVRFIEZST00gc3RpY2tlcl9wYWNrc1xuICAgICAgICBXSEVSRSBpZCA9ICRwYWNrSWQ7XG4gICAgICAgIGBcbiAgICAgICkucnVuKHtcbiAgICAgICAgcGFja0lkLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAoc3RpY2tlclBhdGhSb3dzIHx8IFtdKS5tYXAocm93ID0+IHJvdy5wYXRoKTtcbiAgICB9KVxuICAgIC5pbW1lZGlhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RpY2tlclBhY2socGFja0lkOiBzdHJpbmcpOiBQcm9taXNlPEFycmF5PHN0cmluZz4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGlmICghcGFja0lkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2RlbGV0ZVN0aWNrZXJQYWNrOiBQcm92aWRlZCBkYXRhIGRpZCBub3QgaGF2ZSBhIHRydXRoeSBwYWNrSWQnXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBkYlxuICAgIC50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgICAvLyBXZSB1c2UgYW4gaW1tZWRpYXRlIHRyYW5zYWN0aW9uIGhlcmUgdG8gaW1tZWRpYXRlbHkgYWNxdWlyZSBhbiBleGNsdXNpdmUgbG9jayxcbiAgICAgIC8vICAgd2hpY2ggd291bGQgbm9ybWFsbHkgb25seSBoYXBwZW4gd2hlbiB3ZSBkaWQgb3VyIGZpcnN0IHdyaXRlLlxuXG4gICAgICAvLyBXZSBuZWVkIHRoaXMgdG8gZW5zdXJlIHRoYXQgb3VyIHR3byBxdWVyaWVzIGFyZSBhdG9taWMsIHdpdGggbm8gb3RoZXIgY2hhbmdlc1xuICAgICAgLy8gICBoYXBwZW5pbmcgd2hpbGUgd2UgZG8gaXQ6XG4gICAgICAvLyAxLiBHcmFiIGFsbCBvZiB0YXJnZXQgcGFjaydzIHN0aWNrZXIgcGF0aHNcbiAgICAgIC8vIDIuIERlbGV0ZSBzdGlja2VyIHBhY2sgKHdoaWNoIGNhc2NhZGVzIHRvIGFsbCBzdGlja2VycyBhbmQgcmVmZXJlbmNlcylcblxuICAgICAgY29uc3Qgc3RpY2tlclBhdGhSb3dzOiBBcnJheTx7IHBhdGg6IHN0cmluZyB9PiA9IGRiXG4gICAgICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgICBgXG4gICAgICAgICAgU0VMRUNUIHBhdGggRlJPTSBzdGlja2Vyc1xuICAgICAgICAgIFdIRVJFIHBhY2tJZCA9ICRwYWNrSWQ7XG4gICAgICAgICAgYFxuICAgICAgICApXG4gICAgICAgIC5hbGwoe1xuICAgICAgICAgIHBhY2tJZCxcbiAgICAgICAgfSk7XG4gICAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBERUxFVEUgRlJPTSBzdGlja2VyX3BhY2tzXG4gICAgICAgIFdIRVJFIGlkID0gJHBhY2tJZDtcbiAgICAgICAgYFxuICAgICAgKS5ydW4oeyBwYWNrSWQgfSk7XG5cbiAgICAgIHJldHVybiAoc3RpY2tlclBhdGhSb3dzIHx8IFtdKS5tYXAocm93ID0+IHJvdy5wYXRoKTtcbiAgICB9KVxuICAgIC5pbW1lZGlhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U3RpY2tlckNvdW50KCk6IFByb21pc2U8bnVtYmVyPiB7XG4gIHJldHVybiBnZXRDb3VudEZyb21UYWJsZShnZXRJbnN0YW5jZSgpLCAnc3RpY2tlcnMnKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbFN0aWNrZXJQYWNrcygpOiBQcm9taXNlPEFycmF5PFN0aWNrZXJQYWNrVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGNvbnN0IHJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUICogRlJPTSBzdGlja2VyX3BhY2tzXG4gICAgICBPUkRFUiBCWSBwb3NpdGlvbiBBU0MsIGlkIEFTQ1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKCk7XG5cbiAgcmV0dXJuIHJvd3MgfHwgW107XG59XG5mdW5jdGlvbiBhZGRVbmluc3RhbGxlZFN0aWNrZXJQYWNrU3luYyhwYWNrOiBVbmluc3RhbGxlZFN0aWNrZXJQYWNrVHlwZSk6IHZvaWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgICAgICBJTlNFUlQgT1IgUkVQTEFDRSBJTlRPIHVuaW5zdGFsbGVkX3N0aWNrZXJfcGFja3NcbiAgICAgICAgKFxuICAgICAgICAgIGlkLCB1bmluc3RhbGxlZEF0LCBzdG9yYWdlSUQsIHN0b3JhZ2VWZXJzaW9uLCBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgICAgICBzdG9yYWdlTmVlZHNTeW5jXG4gICAgICAgIClcbiAgICAgICAgVkFMVUVTXG4gICAgICAgIChcbiAgICAgICAgICAkaWQsICR1bmluc3RhbGxlZEF0LCAkc3RvcmFnZUlELCAkc3RvcmFnZVZlcnNpb24sICR1bmtub3duRmllbGRzLFxuICAgICAgICAgICRzdG9yYWdlTmVlZHNTeW5jXG4gICAgICAgIClcbiAgICAgIGBcbiAgKS5ydW4oe1xuICAgIGlkOiBwYWNrLmlkLFxuICAgIHVuaW5zdGFsbGVkQXQ6IHBhY2sudW5pbnN0YWxsZWRBdCxcbiAgICBzdG9yYWdlSUQ6IHBhY2suc3RvcmFnZUlEID8/IG51bGwsXG4gICAgc3RvcmFnZVZlcnNpb246IHBhY2suc3RvcmFnZVZlcnNpb24gPz8gbnVsbCxcbiAgICB1bmtub3duRmllbGRzOiBwYWNrLnN0b3JhZ2VVbmtub3duRmllbGRzID8/IG51bGwsXG4gICAgc3RvcmFnZU5lZWRzU3luYzogcGFjay5zdG9yYWdlTmVlZHNTeW5jID8gMSA6IDAsXG4gIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFjayhcbiAgcGFjazogVW5pbnN0YWxsZWRTdGlja2VyUGFja1R5cGVcbik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFja1N5bmMocGFjayk7XG59XG5mdW5jdGlvbiByZW1vdmVVbmluc3RhbGxlZFN0aWNrZXJQYWNrU3luYyhwYWNrSWQ6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgJ0RFTEVURSBGUk9NIHVuaW5zdGFsbGVkX3N0aWNrZXJfcGFja3MgV0hFUkUgaWQgSVMgJGlkJ1xuICApLnJ1bih7IGlkOiBwYWNrSWQgfSk7XG59XG5hc3luYyBmdW5jdGlvbiByZW1vdmVVbmluc3RhbGxlZFN0aWNrZXJQYWNrKHBhY2tJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiByZW1vdmVVbmluc3RhbGxlZFN0aWNrZXJQYWNrU3luYyhwYWNrSWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0VW5pbnN0YWxsZWRTdGlja2VyUGFja3MoKTogUHJvbWlzZTxcbiAgQXJyYXk8VW5pbnN0YWxsZWRTdGlja2VyUGFja1R5cGU+XG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGNvbnN0IHJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgJ1NFTEVDVCAqIEZST00gdW5pbnN0YWxsZWRfc3RpY2tlcl9wYWNrcyBPUkRFUiBCWSBpZCBBU0MnXG4gICAgKVxuICAgIC5hbGwoKTtcblxuICByZXR1cm4gcm93cyB8fCBbXTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEluc3RhbGxlZFN0aWNrZXJQYWNrcygpOiBQcm9taXNlPEFycmF5PFN0aWNrZXJQYWNrVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIC8vIElmIHN0aWNrZXIgcGFjayBoYXMgYSBzdG9yYWdlSUQgLSBpdCBpcyBiZWluZyBkb3dubG9hZGVkIGFuZCBhYm91dCB0byBiZVxuICAvLyBpbnN0YWxsZWQgc28gd2UgYmV0dGVyIHN5bmMgaXQgYmFjayB0byBzdG9yYWdlIHNlcnZpY2UgaWYgYXNrZWQuXG4gIGNvbnN0IHJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUICpcbiAgICAgIEZST00gc3RpY2tlcl9wYWNrc1xuICAgICAgV0hFUkVcbiAgICAgICAgc3RhdHVzIElTIFwiaW5zdGFsbGVkXCIgT1JcbiAgICAgICAgc3RvcmFnZUlEIElTIE5PVCBOVUxMXG4gICAgICBPUkRFUiBCWSBpZCBBU0NcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiByb3dzIHx8IFtdO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0U3RpY2tlclBhY2tJbmZvKFxuICBwYWNrSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxTdGlja2VyUGFja0luZm9UeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICByZXR1cm4gZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGNvbnN0IHVuaW5zdGFsbGVkID0gZGJcbiAgICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1QgKiBGUk9NIHVuaW5zdGFsbGVkX3N0aWNrZXJfcGFja3NcbiAgICAgICAgV0hFUkUgaWQgSVMgJHBhY2tJZFxuICAgICAgICBgXG4gICAgICApXG4gICAgICAuZ2V0KHsgcGFja0lkIH0pO1xuICAgIGlmICh1bmluc3RhbGxlZCkge1xuICAgICAgcmV0dXJuIHVuaW5zdGFsbGVkIGFzIFVuaW5zdGFsbGVkU3RpY2tlclBhY2tUeXBlO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbGxlZCA9IGRiXG4gICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgU0VMRUNUXG4gICAgICAgICAgaWQsIGtleSwgcG9zaXRpb24sIHN0b3JhZ2VJRCwgc3RvcmFnZVZlcnNpb24sIHN0b3JhZ2VVbmtub3duRmllbGRzXG4gICAgICAgIEZST00gc3RpY2tlcl9wYWNrc1xuICAgICAgICBXSEVSRSBpZCBJUyAkcGFja0lkXG4gICAgICAgIGBcbiAgICAgIClcbiAgICAgIC5nZXQoeyBwYWNrSWQgfSk7XG4gICAgaWYgKGluc3RhbGxlZCkge1xuICAgICAgcmV0dXJuIGluc3RhbGxlZCBhcyBJbnN0YWxsZWRTdGlja2VyUGFja1R5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSkoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxTdGlja2VyUGFjayhcbiAgcGFja0lkOiBzdHJpbmcsXG4gIHRpbWVzdGFtcDogbnVtYmVyXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICByZXR1cm4gZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGNvbnN0IHN0YXR1cyA9ICdpbnN0YWxsZWQnO1xuICAgIHVwZGF0ZVN0aWNrZXJQYWNrU3RhdHVzU3luYyhwYWNrSWQsIHN0YXR1cywgeyB0aW1lc3RhbXAgfSk7XG5cbiAgICByZW1vdmVVbmluc3RhbGxlZFN0aWNrZXJQYWNrU3luYyhwYWNrSWQpO1xuICB9KSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gdW5pbnN0YWxsU3RpY2tlclBhY2soXG4gIHBhY2tJZDogc3RyaW5nLFxuICB0aW1lc3RhbXA6IG51bWJlclxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcmV0dXJuIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCBzdGF0dXMgPSAnZG93bmxvYWRlZCc7XG4gICAgdXBkYXRlU3RpY2tlclBhY2tTdGF0dXNTeW5jKHBhY2tJZCwgc3RhdHVzKTtcblxuICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgVVBEQVRFIHN0aWNrZXJfcGFja3MgU0VUXG4gICAgICAgIHN0b3JhZ2VJRCA9IE5VTEwsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uID0gTlVMTCxcbiAgICAgICAgc3RvcmFnZVVua25vd25GaWVsZHMgPSBOVUxMLFxuICAgICAgICBzdG9yYWdlTmVlZHNTeW5jID0gMFxuICAgICAgV0hFUkUgaWQgPSAkcGFja0lkO1xuICAgICAgYFxuICAgICkucnVuKHsgcGFja0lkIH0pO1xuXG4gICAgYWRkVW5pbnN0YWxsZWRTdGlja2VyUGFja1N5bmMoe1xuICAgICAgaWQ6IHBhY2tJZCxcbiAgICAgIHVuaW5zdGFsbGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgIHN0b3JhZ2VOZWVkc1N5bmM6IHRydWUsXG4gICAgfSk7XG4gIH0pKCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRBbGxTdGlja2VycygpOiBQcm9taXNlPEFycmF5PFN0aWNrZXJUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgY29uc3Qgcm93cyA9IGRiXG4gICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QgKiBGUk9NIHN0aWNrZXJzXG4gICAgICBPUkRFUiBCWSBwYWNrSWQgQVNDLCBpZCBBU0NcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCgpO1xuXG4gIHJldHVybiAocm93cyB8fCBbXSkubWFwKHJvdyA9PiByb3dUb1N0aWNrZXIocm93KSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRSZWNlbnRTdGlja2Vycyh7IGxpbWl0IH06IHsgbGltaXQ/OiBudW1iZXIgfSA9IHt9KTogUHJvbWlzZTxcbiAgQXJyYXk8U3RpY2tlclR5cGU+XG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIC8vIE5vdGU6IHdlIGF2b2lkICdJUyBOT1QgTlVMTCcgaGVyZSBiZWNhdXNlIGl0IGRvZXMgc2VlbSB0byBieXBhc3Mgb3VyIGluZGV4XG4gIGNvbnN0IHJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBzdGlja2Vycy4qIEZST00gc3RpY2tlcnNcbiAgICAgIEpPSU4gc3RpY2tlcl9wYWNrcyBvbiBzdGlja2Vycy5wYWNrSWQgPSBzdGlja2VyX3BhY2tzLmlkXG4gICAgICBXSEVSRSBzdGlja2Vycy5sYXN0VXNlZCA+IDAgQU5EIHN0aWNrZXJfcGFja3Muc3RhdHVzID0gJ2luc3RhbGxlZCdcbiAgICAgIE9SREVSIEJZIHN0aWNrZXJzLmxhc3RVc2VkIERFU0NcbiAgICAgIExJTUlUICRsaW1pdFxuICAgICAgYFxuICAgIClcbiAgICAuYWxsKHtcbiAgICAgIGxpbWl0OiBsaW1pdCB8fCAyNCxcbiAgICB9KTtcblxuICByZXR1cm4gKHJvd3MgfHwgW10pLm1hcChyb3cgPT4gcm93VG9TdGlja2VyKHJvdykpO1xufVxuXG4vLyBFbW9qaXNcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUVtb2ppVXNhZ2UoXG4gIHNob3J0TmFtZTogc3RyaW5nLFxuICB0aW1lVXNlZDogbnVtYmVyID0gRGF0ZS5ub3coKVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgY29uc3Qgcm93cyA9IGRiXG4gICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgU0VMRUNUICogRlJPTSBlbW9qaXNcbiAgICAgICAgV0hFUkUgc2hvcnROYW1lID0gJHNob3J0TmFtZTtcbiAgICAgICAgYFxuICAgICAgKVxuICAgICAgLmdldCh7XG4gICAgICAgIHNob3J0TmFtZSxcbiAgICAgIH0pO1xuXG4gICAgaWYgKHJvd3MpIHtcbiAgICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIFVQREFURSBlbW9qaXNcbiAgICAgICAgU0VUIGxhc3RVc2FnZSA9ICR0aW1lVXNlZFxuICAgICAgICBXSEVSRSBzaG9ydE5hbWUgPSAkc2hvcnROYW1lO1xuICAgICAgICBgXG4gICAgICApLnJ1bih7IHNob3J0TmFtZSwgdGltZVVzZWQgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGVtb2ppcyhzaG9ydE5hbWUsIGxhc3RVc2FnZSlcbiAgICAgICAgVkFMVUVTICgkc2hvcnROYW1lLCAkdGltZVVzZWQpO1xuICAgICAgICBgXG4gICAgICApLnJ1bih7IHNob3J0TmFtZSwgdGltZVVzZWQgfSk7XG4gICAgfVxuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRSZWNlbnRFbW9qaXMobGltaXQgPSAzMik6IFByb21pc2U8QXJyYXk8RW1vamlUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHJvd3MgPSBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCAqXG4gICAgICBGUk9NIGVtb2ppc1xuICAgICAgT1JERVIgQlkgbGFzdFVzYWdlIERFU0NcbiAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7IGxpbWl0IH0pO1xuXG4gIHJldHVybiByb3dzIHx8IFtdO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxCYWRnZXMoKTogUHJvbWlzZTxBcnJheTxCYWRnZVR5cGU+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCBbYmFkZ2VSb3dzLCBiYWRnZUltYWdlRmlsZVJvd3NdID0gZGIudHJhbnNhY3Rpb24oKCkgPT4gW1xuICAgIGRiLnByZXBhcmU8RW1wdHlRdWVyeT4oJ1NFTEVDVCAqIEZST00gYmFkZ2VzJykuYWxsKCksXG4gICAgZGIucHJlcGFyZTxFbXB0eVF1ZXJ5PignU0VMRUNUICogRlJPTSBiYWRnZUltYWdlRmlsZXMnKS5hbGwoKSxcbiAgXSkoKTtcblxuICBjb25zdCBiYWRnZUltYWdlc0J5QmFkZ2UgPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICBBcnJheTx1bmRlZmluZWQgfCBCYWRnZUltYWdlVHlwZT5cbiAgPigpO1xuICBmb3IgKGNvbnN0IGJhZGdlSW1hZ2VGaWxlUm93IG9mIGJhZGdlSW1hZ2VGaWxlUm93cykge1xuICAgIGNvbnN0IHsgYmFkZ2VJZCwgb3JkZXIsIGxvY2FsUGF0aCwgdXJsLCB0aGVtZSB9ID0gYmFkZ2VJbWFnZUZpbGVSb3c7XG4gICAgY29uc3QgYmFkZ2VJbWFnZXMgPSBiYWRnZUltYWdlc0J5QmFkZ2UuZ2V0KGJhZGdlSWQpIHx8IFtdO1xuICAgIGJhZGdlSW1hZ2VzW29yZGVyXSA9IHtcbiAgICAgIC4uLihiYWRnZUltYWdlc1tvcmRlcl0gfHwge30pLFxuICAgICAgW3BhcnNlQmFkZ2VJbWFnZVRoZW1lKHRoZW1lKV06IHtcbiAgICAgICAgbG9jYWxQYXRoOiBkcm9wTnVsbChsb2NhbFBhdGgpLFxuICAgICAgICB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gICAgYmFkZ2VJbWFnZXNCeUJhZGdlLnNldChiYWRnZUlkLCBiYWRnZUltYWdlcyk7XG4gIH1cblxuICByZXR1cm4gYmFkZ2VSb3dzLm1hcChiYWRnZVJvdyA9PiAoe1xuICAgIGlkOiBiYWRnZVJvdy5pZCxcbiAgICBjYXRlZ29yeTogcGFyc2VCYWRnZUNhdGVnb3J5KGJhZGdlUm93LmNhdGVnb3J5KSxcbiAgICBuYW1lOiBiYWRnZVJvdy5uYW1lLFxuICAgIGRlc2NyaXB0aW9uVGVtcGxhdGU6IGJhZGdlUm93LmRlc2NyaXB0aW9uVGVtcGxhdGUsXG4gICAgaW1hZ2VzOiAoYmFkZ2VJbWFnZXNCeUJhZGdlLmdldChiYWRnZVJvdy5pZCkgfHwgW10pLmZpbHRlcihpc05vdE5pbCksXG4gIH0pKTtcbn1cblxuLy8gVGhpcyBzaG91bGQgbWF0Y2ggdGhlIGxvZ2ljIGluIHRoZSBiYWRnZXMgUmVkdXggcmVkdWNlci5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9yQ3JlYXRlQmFkZ2VzKFxuICBiYWRnZXM6IFJlYWRvbmx5QXJyYXk8QmFkZ2VUeXBlPlxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCBpbnNlcnRCYWRnZSA9IHByZXBhcmU8UXVlcnk+KFxuICAgIGRiLFxuICAgIGBcbiAgICBJTlNFUlQgT1IgUkVQTEFDRSBJTlRPIGJhZGdlcyAoXG4gICAgICBpZCxcbiAgICAgIGNhdGVnb3J5LFxuICAgICAgbmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uVGVtcGxhdGVcbiAgICApIFZBTFVFUyAoXG4gICAgICAkaWQsXG4gICAgICAkY2F0ZWdvcnksXG4gICAgICAkbmFtZSxcbiAgICAgICRkZXNjcmlwdGlvblRlbXBsYXRlXG4gICAgKTtcbiAgICBgXG4gICk7XG4gIGNvbnN0IGdldEltYWdlRmlsZXNGb3JCYWRnZSA9IHByZXBhcmU8UXVlcnk+KFxuICAgIGRiLFxuICAgICdTRUxFQ1QgdXJsLCBsb2NhbFBhdGggRlJPTSBiYWRnZUltYWdlRmlsZXMgV0hFUkUgYmFkZ2VJZCA9ICRiYWRnZUlkJ1xuICApO1xuICBjb25zdCBpbnNlcnRCYWRnZUltYWdlRmlsZSA9IHByZXBhcmU8UXVlcnk+KFxuICAgIGRiLFxuICAgIGBcbiAgICBJTlNFUlQgSU5UTyBiYWRnZUltYWdlRmlsZXMgKFxuICAgICAgYmFkZ2VJZCxcbiAgICAgICdvcmRlcicsXG4gICAgICB1cmwsXG4gICAgICBsb2NhbFBhdGgsXG4gICAgICB0aGVtZVxuICAgICkgVkFMVUVTIChcbiAgICAgICRiYWRnZUlkLFxuICAgICAgJG9yZGVyLFxuICAgICAgJHVybCxcbiAgICAgICRsb2NhbFBhdGgsXG4gICAgICAkdGhlbWVcbiAgICApO1xuICAgIGBcbiAgKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgYmFkZ2VzLmZvckVhY2goYmFkZ2UgPT4ge1xuICAgICAgY29uc3QgeyBpZDogYmFkZ2VJZCB9ID0gYmFkZ2U7XG5cbiAgICAgIGNvbnN0IG9sZExvY2FsUGF0aHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgICAgZm9yIChjb25zdCB7IHVybCwgbG9jYWxQYXRoIH0gb2YgZ2V0SW1hZ2VGaWxlc0ZvckJhZGdlLmFsbCh7IGJhZGdlSWQgfSkpIHtcbiAgICAgICAgaWYgKGxvY2FsUGF0aCkge1xuICAgICAgICAgIG9sZExvY2FsUGF0aHMuc2V0KHVybCwgbG9jYWxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbnNlcnRCYWRnZS5ydW4oe1xuICAgICAgICBpZDogYmFkZ2VJZCxcbiAgICAgICAgY2F0ZWdvcnk6IGJhZGdlLmNhdGVnb3J5LFxuICAgICAgICBuYW1lOiBiYWRnZS5uYW1lLFxuICAgICAgICBkZXNjcmlwdGlvblRlbXBsYXRlOiBiYWRnZS5kZXNjcmlwdGlvblRlbXBsYXRlLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3QgW29yZGVyLCBpbWFnZV0gb2YgYmFkZ2UuaW1hZ2VzLmVudHJpZXMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IFt0aGVtZSwgaW1hZ2VGaWxlXSBvZiBPYmplY3QuZW50cmllcyhpbWFnZSkpIHtcbiAgICAgICAgICBpbnNlcnRCYWRnZUltYWdlRmlsZS5ydW4oe1xuICAgICAgICAgICAgYmFkZ2VJZCxcbiAgICAgICAgICAgIGxvY2FsUGF0aDpcbiAgICAgICAgICAgICAgaW1hZ2VGaWxlLmxvY2FsUGF0aCB8fCBvbGRMb2NhbFBhdGhzLmdldChpbWFnZUZpbGUudXJsKSB8fCBudWxsLFxuICAgICAgICAgICAgb3JkZXIsXG4gICAgICAgICAgICB0aGVtZSxcbiAgICAgICAgICAgIHVybDogaW1hZ2VGaWxlLnVybCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBiYWRnZUltYWdlRmlsZURvd25sb2FkZWQoXG4gIHVybDogc3RyaW5nLFxuICBsb2NhbFBhdGg6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgcHJlcGFyZTxRdWVyeT4oXG4gICAgZGIsXG4gICAgJ1VQREFURSBiYWRnZUltYWdlRmlsZXMgU0VUIGxvY2FsUGF0aCA9ICRsb2NhbFBhdGggV0hFUkUgdXJsID0gJHVybCdcbiAgKS5ydW4oeyB1cmwsIGxvY2FsUGF0aCB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGhzKCk6IFByb21pc2U8U2V0PHN0cmluZz4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBsb2NhbFBhdGhzID0gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgICdTRUxFQ1QgbG9jYWxQYXRoIEZST00gYmFkZ2VJbWFnZUZpbGVzIFdIRVJFIGxvY2FsUGF0aCBJUyBOT1QgTlVMTCdcbiAgICApXG4gICAgLnBsdWNrKClcbiAgICAuYWxsKCk7XG4gIHJldHVybiBuZXcgU2V0KGxvY2FsUGF0aHMpO1xufVxuXG50eXBlIFN0b3J5RGlzdHJpYnV0aW9uRm9yRGF0YWJhc2UgPSBSZWFkb25seTxcbiAge1xuICAgIGFsbG93c1JlcGxpZXM6IDAgfCAxO1xuICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogbnVtYmVyIHwgbnVsbDtcbiAgICBpc0Jsb2NrTGlzdDogMCB8IDE7XG4gICAgc2VuZGVyS2V5SW5mb0pzb246IHN0cmluZyB8IG51bGw7XG4gICAgc3RvcmFnZUlEOiBzdHJpbmcgfCBudWxsO1xuICAgIHN0b3JhZ2VWZXJzaW9uOiBudW1iZXIgfCBudWxsO1xuICAgIHN0b3JhZ2VOZWVkc1N5bmM6IDAgfCAxO1xuICB9ICYgT21pdDxcbiAgICBTdG9yeURpc3RyaWJ1dGlvblR5cGUsXG4gICAgfCAnYWxsb3dzUmVwbGllcydcbiAgICB8ICdkZWxldGVkQXRUaW1lc3RhbXAnXG4gICAgfCAnaXNCbG9ja0xpc3QnXG4gICAgfCAnc2VuZGVyS2V5SW5mbydcbiAgICB8ICdzdG9yYWdlSUQnXG4gICAgfCAnc3RvcmFnZVZlcnNpb24nXG4gICAgfCAnc3RvcmFnZU5lZWRzU3luYydcbiAgPlxuPjtcblxuZnVuY3Rpb24gaHlkcmF0ZVN0b3J5RGlzdHJpYnV0aW9uKFxuICBmcm9tRGF0YWJhc2U6IFN0b3J5RGlzdHJpYnV0aW9uRm9yRGF0YWJhc2Vcbik6IFN0b3J5RGlzdHJpYnV0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgLi4ub21pdChmcm9tRGF0YWJhc2UsICdzZW5kZXJLZXlJbmZvSnNvbicpLFxuICAgIGFsbG93c1JlcGxpZXM6IEJvb2xlYW4oZnJvbURhdGFiYXNlLmFsbG93c1JlcGxpZXMpLFxuICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogZnJvbURhdGFiYXNlLmRlbGV0ZWRBdFRpbWVzdGFtcCB8fCB1bmRlZmluZWQsXG4gICAgaXNCbG9ja0xpc3Q6IEJvb2xlYW4oZnJvbURhdGFiYXNlLmlzQmxvY2tMaXN0KSxcbiAgICBzZW5kZXJLZXlJbmZvOiBmcm9tRGF0YWJhc2Uuc2VuZGVyS2V5SW5mb0pzb25cbiAgICAgID8gSlNPTi5wYXJzZShmcm9tRGF0YWJhc2Uuc2VuZGVyS2V5SW5mb0pzb24pXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICBzdG9yYWdlSUQ6IGZyb21EYXRhYmFzZS5zdG9yYWdlSUQgfHwgdW5kZWZpbmVkLFxuICAgIHN0b3JhZ2VWZXJzaW9uOiBmcm9tRGF0YWJhc2Uuc3RvcmFnZVZlcnNpb24gfHwgdW5kZWZpbmVkLFxuICAgIHN0b3JhZ2VOZWVkc1N5bmM6IEJvb2xlYW4oZnJvbURhdGFiYXNlLnN0b3JhZ2VOZWVkc1N5bmMpLFxuICAgIHN0b3JhZ2VVbmtub3duRmllbGRzOiBmcm9tRGF0YWJhc2Uuc3RvcmFnZVVua25vd25GaWVsZHMgfHwgdW5kZWZpbmVkLFxuICB9O1xufVxuZnVuY3Rpb24gZnJlZXplU3RvcnlEaXN0cmlidXRpb24oXG4gIHN0b3J5OiBTdG9yeURpc3RyaWJ1dGlvblR5cGVcbik6IFN0b3J5RGlzdHJpYnV0aW9uRm9yRGF0YWJhc2Uge1xuICByZXR1cm4ge1xuICAgIC4uLm9taXQoc3RvcnksICdzZW5kZXJLZXlJbmZvJyksXG4gICAgYWxsb3dzUmVwbGllczogc3RvcnkuYWxsb3dzUmVwbGllcyA/IDEgOiAwLFxuICAgIGRlbGV0ZWRBdFRpbWVzdGFtcDogc3RvcnkuZGVsZXRlZEF0VGltZXN0YW1wIHx8IG51bGwsXG4gICAgaXNCbG9ja0xpc3Q6IHN0b3J5LmlzQmxvY2tMaXN0ID8gMSA6IDAsXG4gICAgc2VuZGVyS2V5SW5mb0pzb246IHN0b3J5LnNlbmRlcktleUluZm9cbiAgICAgID8gSlNPTi5zdHJpbmdpZnkoc3Rvcnkuc2VuZGVyS2V5SW5mbylcbiAgICAgIDogbnVsbCxcbiAgICBzdG9yYWdlSUQ6IHN0b3J5LnN0b3JhZ2VJRCB8fCBudWxsLFxuICAgIHN0b3JhZ2VWZXJzaW9uOiBzdG9yeS5zdG9yYWdlVmVyc2lvbiB8fCBudWxsLFxuICAgIHN0b3JhZ2VOZWVkc1N5bmM6IHN0b3J5LnN0b3JhZ2VOZWVkc1N5bmMgPyAxIDogMCxcbiAgICBzdG9yYWdlVW5rbm93bkZpZWxkczogc3Rvcnkuc3RvcmFnZVVua25vd25GaWVsZHMgfHwgbnVsbCxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9ucygpOiBQcm9taXNlPFxuICBBcnJheTxTdG9yeURpc3RyaWJ1dGlvblR5cGU+XG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBzdG9yeURpc3RyaWJ1dGlvbnMgPSBkYlxuICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KCdTRUxFQ1QgKiBGUk9NIHN0b3J5RGlzdHJpYnV0aW9uczsnKVxuICAgIC5hbGwoKTtcblxuICByZXR1cm4gc3RvcnlEaXN0cmlidXRpb25zLm1hcChoeWRyYXRlU3RvcnlEaXN0cmlidXRpb24pO1xufVxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFN0b3J5RGlzdHJpYnV0aW9uTWVtYmVycygpOiBQcm9taXNlPFxuICBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlclR5cGU+XG4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PignU0VMRUNUICogRlJPTSBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnM7JylcbiAgICAuYWxsKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfZGVsZXRlQWxsU3RvcnlEaXN0cmlidXRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGRiLnByZXBhcmU8RW1wdHlRdWVyeT4oJ0RFTEVURSBGUk9NIHN0b3J5RGlzdHJpYnV0aW9uczsnKS5ydW4oKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU5ld1N0b3J5RGlzdHJpYnV0aW9uKFxuICBkaXN0cmlidXRpb246IFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBjb25zdCBwYXlsb2FkID0gZnJlZXplU3RvcnlEaXN0cmlidXRpb24oZGlzdHJpYnV0aW9uKTtcblxuICAgIHByZXBhcmUoXG4gICAgICBkYixcbiAgICAgIGBcbiAgICAgIElOU0VSVCBJTlRPIHN0b3J5RGlzdHJpYnV0aW9ucyhcbiAgICAgICAgaWQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgICAgYWxsb3dzUmVwbGllcyxcbiAgICAgICAgaXNCbG9ja0xpc3QsXG4gICAgICAgIHNlbmRlcktleUluZm9Kc29uLFxuICAgICAgICBzdG9yYWdlSUQsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgICBzdG9yYWdlVW5rbm93bkZpZWxkcyxcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luY1xuICAgICAgKSBWQUxVRVMgKFxuICAgICAgICAkaWQsXG4gICAgICAgICRuYW1lLFxuICAgICAgICAkZGVsZXRlZEF0VGltZXN0YW1wLFxuICAgICAgICAkYWxsb3dzUmVwbGllcyxcbiAgICAgICAgJGlzQmxvY2tMaXN0LFxuICAgICAgICAkc2VuZGVyS2V5SW5mb0pzb24sXG4gICAgICAgICRzdG9yYWdlSUQsXG4gICAgICAgICRzdG9yYWdlVmVyc2lvbixcbiAgICAgICAgJHN0b3JhZ2VVbmtub3duRmllbGRzLFxuICAgICAgICAkc3RvcmFnZU5lZWRzU3luY1xuICAgICAgKTtcbiAgICAgIGBcbiAgICApLnJ1bihwYXlsb2FkKTtcblxuICAgIGNvbnN0IHsgaWQ6IGxpc3RJZCwgbWVtYmVycyB9ID0gZGlzdHJpYnV0aW9uO1xuXG4gICAgY29uc3QgbWVtYmVySW5zZXJ0U3RhdGVtZW50ID0gcHJlcGFyZShcbiAgICAgIGRiLFxuICAgICAgYFxuICAgICAgSU5TRVJUIE9SIFJFUExBQ0UgSU5UTyBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMgKFxuICAgICAgICBsaXN0SWQsXG4gICAgICAgIHV1aWRcbiAgICAgICkgVkFMVUVTIChcbiAgICAgICAgJGxpc3RJZCxcbiAgICAgICAgJHV1aWRcbiAgICAgICk7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgdXVpZCBvZiBtZW1iZXJzKSB7XG4gICAgICBtZW1iZXJJbnNlcnRTdGF0ZW1lbnQucnVuKHtcbiAgICAgICAgbGlzdElkLFxuICAgICAgICB1dWlkLFxuICAgICAgfSk7XG4gICAgfVxuICB9KSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsU3RvcnlEaXN0cmlidXRpb25zV2l0aE1lbWJlcnMoKTogUHJvbWlzZTxcbiAgQXJyYXk8U3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGU+XG4+IHtcbiAgY29uc3QgYWxsRGlzdHJpYnV0aW9ucyA9IGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnMoKTtcbiAgY29uc3QgYWxsTWVtYmVycyA9IGF3YWl0IF9nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoKTtcblxuICBjb25zdCBieUxpc3RJZCA9IGdyb3VwQnkoYWxsTWVtYmVycywgbWVtYmVyID0+IG1lbWJlci5saXN0SWQpO1xuXG4gIHJldHVybiBhbGxEaXN0cmlidXRpb25zLm1hcChsaXN0ID0+ICh7XG4gICAgLi4ubGlzdCxcbiAgICBtZW1iZXJzOiAoYnlMaXN0SWRbbGlzdC5pZF0gfHwgW10pLm1hcChtZW1iZXIgPT4gbWVtYmVyLnV1aWQpLFxuICB9KSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzKFxuICBpZDogc3RyaW5nXG4pOiBQcm9taXNlPFN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnNUeXBlIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgc3RvcnlEaXN0cmlidXRpb24gPSBwcmVwYXJlKFxuICAgIGRiLFxuICAgICdTRUxFQ1QgKiBGUk9NIHN0b3J5RGlzdHJpYnV0aW9ucyBXSEVSRSBpZCA9ICRpZDsnXG4gICkuZ2V0KHtcbiAgICBpZCxcbiAgfSk7XG5cbiAgaWYgKCFzdG9yeURpc3RyaWJ1dGlvbikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBtZW1iZXJzID0gcHJlcGFyZShcbiAgICBkYixcbiAgICAnU0VMRUNUICogRlJPTSBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMgV0hFUkUgbGlzdElkID0gJGlkOydcbiAgKS5hbGwoe1xuICAgIGlkLFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0b3J5RGlzdHJpYnV0aW9uLFxuICAgIG1lbWJlcnM6IG1lbWJlcnMubWFwKCh7IHV1aWQgfSkgPT4gdXVpZCksXG4gIH07XG59XG5mdW5jdGlvbiBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvblN5bmMoXG4gIGRiOiBEYXRhYmFzZSxcbiAgcGF5bG9hZDogU3RvcnlEaXN0cmlidXRpb25Gb3JEYXRhYmFzZVxuKTogdm9pZCB7XG4gIHByZXBhcmUoXG4gICAgZGIsXG4gICAgYFxuICAgIFVQREFURSBzdG9yeURpc3RyaWJ1dGlvbnNcbiAgICBTRVRcbiAgICAgIG5hbWUgPSAkbmFtZSxcbiAgICAgIGRlbGV0ZWRBdFRpbWVzdGFtcCA9ICRkZWxldGVkQXRUaW1lc3RhbXAsXG4gICAgICBhbGxvd3NSZXBsaWVzID0gJGFsbG93c1JlcGxpZXMsXG4gICAgICBpc0Jsb2NrTGlzdCA9ICRpc0Jsb2NrTGlzdCxcbiAgICAgIHNlbmRlcktleUluZm9Kc29uID0gJHNlbmRlcktleUluZm9Kc29uLFxuICAgICAgc3RvcmFnZUlEID0gJHN0b3JhZ2VJRCxcbiAgICAgIHN0b3JhZ2VWZXJzaW9uID0gJHN0b3JhZ2VWZXJzaW9uLFxuICAgICAgc3RvcmFnZVVua25vd25GaWVsZHMgPSAkc3RvcmFnZVVua25vd25GaWVsZHMsXG4gICAgICBzdG9yYWdlTmVlZHNTeW5jID0gJHN0b3JhZ2VOZWVkc1N5bmNcbiAgICBXSEVSRSBpZCA9ICRpZFxuICAgIGBcbiAgKS5ydW4ocGF5bG9hZCk7XG59XG5mdW5jdGlvbiBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnNTeW5jKFxuICBkYjogRGF0YWJhc2UsXG4gIGxpc3RJZDogc3RyaW5nLFxuICB7XG4gICAgdG9BZGQsXG4gICAgdG9SZW1vdmUsXG4gIH06IHsgdG9BZGQ6IEFycmF5PFVVSURTdHJpbmdUeXBlPjsgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPiB9XG4pIHtcbiAgY29uc3QgbWVtYmVySW5zZXJ0U3RhdGVtZW50ID0gcHJlcGFyZShcbiAgICBkYixcbiAgICBgXG4gICAgSU5TRVJUIE9SIFJFUExBQ0UgSU5UTyBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMgKFxuICAgICAgbGlzdElkLFxuICAgICAgdXVpZFxuICAgICkgVkFMVUVTIChcbiAgICAgICRsaXN0SWQsXG4gICAgICAkdXVpZFxuICAgICk7XG4gICAgYFxuICApO1xuXG4gIGZvciAoY29uc3QgdXVpZCBvZiB0b0FkZCkge1xuICAgIG1lbWJlckluc2VydFN0YXRlbWVudC5ydW4oe1xuICAgICAgbGlzdElkLFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgfVxuXG4gIGJhdGNoTXVsdGlWYXJRdWVyeShkYiwgdG9SZW1vdmUsICh1dWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+KSA9PiB7XG4gICAgZGIucHJlcGFyZTxBcnJheVF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIERFTEVURSBGUk9NIHN0b3J5RGlzdHJpYnV0aW9uTWVtYmVyc1xuICAgICAgV0hFUkUgbGlzdElkID0gPyBBTkQgdXVpZCBJTiAoICR7dXVpZHMubWFwKCgpID0+ICc/Jykuam9pbignLCAnKX0gKTtcbiAgICAgIGBcbiAgICApLnJ1bihbbGlzdElkLCAuLi51dWlkc10pO1xuICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uV2l0aE1lbWJlcnMoXG4gIGRpc3RyaWJ1dGlvbjogU3RvcnlEaXN0cmlidXRpb25UeXBlLFxuICB7XG4gICAgdG9BZGQsXG4gICAgdG9SZW1vdmUsXG4gIH06IHsgdG9BZGQ6IEFycmF5PFVVSURTdHJpbmdUeXBlPjsgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPiB9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcGF5bG9hZCA9IGZyZWV6ZVN0b3J5RGlzdHJpYnV0aW9uKGRpc3RyaWJ1dGlvbik7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBpZiAodG9BZGQubGVuZ3RoIHx8IHRvUmVtb3ZlLmxlbmd0aCkge1xuICAgIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICAgIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uU3luYyhkYiwgcGF5bG9hZCk7XG4gICAgICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnNTeW5jKGRiLCBwYXlsb2FkLmlkLCB7IHRvQWRkLCB0b1JlbW92ZSB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uU3luYyhkYiwgcGF5bG9hZCk7XG4gIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uKFxuICBkaXN0cmlidXRpb246IFN0b3J5RGlzdHJpYnV0aW9uVHlwZVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHBheWxvYWQgPSBmcmVlemVTdG9yeURpc3RyaWJ1dGlvbihkaXN0cmlidXRpb24pO1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIG1vZGlmeVN0b3J5RGlzdHJpYnV0aW9uU3luYyhkYiwgcGF5bG9hZCk7XG59XG5hc3luYyBmdW5jdGlvbiBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnMoXG4gIGxpc3RJZDogc3RyaW5nLFxuICB7XG4gICAgdG9BZGQsXG4gICAgdG9SZW1vdmUsXG4gIH06IHsgdG9BZGQ6IEFycmF5PFVVSURTdHJpbmdUeXBlPjsgdG9SZW1vdmU6IEFycmF5PFVVSURTdHJpbmdUeXBlPiB9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBtb2RpZnlTdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnNTeW5jKGRiLCBsaXN0SWQsIHsgdG9BZGQsIHRvUmVtb3ZlIH0pO1xuICB9KSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU3RvcnlEaXN0cmlidXRpb24oaWQ6IFVVSURTdHJpbmdUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgZGIucHJlcGFyZTxRdWVyeT4oJ0RFTEVURSBGUk9NIHN0b3J5RGlzdHJpYnV0aW9ucyBXSEVSRSBpZCA9ICRpZDsnKS5ydW4oe1xuICAgIGlkLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2dldEFsbFN0b3J5UmVhZHMoKTogUHJvbWlzZTxBcnJheTxTdG9yeVJlYWRUeXBlPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHJldHVybiBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KCdTRUxFQ1QgKiBGUk9NIHN0b3J5UmVhZHM7JykuYWxsKCk7XG59XG5hc3luYyBmdW5jdGlvbiBfZGVsZXRlQWxsU3RvcnlSZWFkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KCdERUxFVEUgRlJPTSBzdG9yeVJlYWRzOycpLnJ1bigpO1xufVxuYXN5bmMgZnVuY3Rpb24gYWRkTmV3U3RvcnlSZWFkKHJlYWQ6IFN0b3J5UmVhZFR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIHByZXBhcmUoXG4gICAgZGIsXG4gICAgYFxuICAgIElOU0VSVCBPUiBSRVBMQUNFIElOVE8gc3RvcnlSZWFkcyhcbiAgICAgIGF1dGhvcklkLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBzdG9yeUlkLFxuICAgICAgc3RvcnlSZWFkRGF0ZVxuICAgICkgVkFMVUVTIChcbiAgICAgICRhdXRob3JJZCxcbiAgICAgICRjb252ZXJzYXRpb25JZCxcbiAgICAgICRzdG9yeUlkLFxuICAgICAgJHN0b3J5UmVhZERhdGVcbiAgICApO1xuICAgIGBcbiAgKS5ydW4ocmVhZCk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRMYXN0U3RvcnlSZWFkc0ZvckF1dGhvcih7XG4gIGF1dGhvcklkLFxuICBjb252ZXJzYXRpb25JZCxcbiAgbGltaXQ6IGluaXRpYWxMaW1pdCxcbn06IHtcbiAgYXV0aG9ySWQ6IFVVSURTdHJpbmdUeXBlO1xuICBjb252ZXJzYXRpb25JZD86IFVVSURTdHJpbmdUeXBlO1xuICBsaW1pdD86IG51bWJlcjtcbn0pOiBQcm9taXNlPEFycmF5PFN0b3J5UmVhZFR5cGU+PiB7XG4gIGNvbnN0IGxpbWl0ID0gaW5pdGlhbExpbWl0IHx8IDU7XG5cbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QgKiBGUk9NIHN0b3J5UmVhZHNcbiAgICAgIFdIRVJFXG4gICAgICAgIGF1dGhvcklkID0gJGF1dGhvcklkIEFORFxuICAgICAgICAoJGNvbnZlcnNhdGlvbklkIElTIE5VTEwgT1IgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQpXG4gICAgICBPUkRFUiBCWSBzdG9yeVJlYWREYXRlIERFU0NcbiAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7XG4gICAgICBhdXRob3JJZCxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb25JZCB8fCBudWxsLFxuICAgICAgbGltaXQsXG4gICAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvdW50U3RvcnlSZWFkc0J5Q29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBQcm9taXNlPG51bWJlcj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHJldHVybiBkYlxuICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgIGBcbiAgICAgIFNFTEVDVCBDT1VOVChzdG9yeUlkKSBGUk9NIHN0b3J5UmVhZHNcbiAgICAgIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJGNvbnZlcnNhdGlvbklkO1xuICAgICAgYFxuICAgIClcbiAgICAucGx1Y2soKVxuICAgIC5nZXQoeyBjb252ZXJzYXRpb25JZCB9KTtcbn1cblxuLy8gQWxsIGRhdGEgaW4gZGF0YWJhc2VcbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIERFTEVURSBGUk9NIGF0dGFjaG1lbnRfZG93bmxvYWRzO1xuICAgICAgREVMRVRFIEZST00gYmFkZ2VJbWFnZUZpbGVzO1xuICAgICAgREVMRVRFIEZST00gYmFkZ2VzO1xuICAgICAgREVMRVRFIEZST00gY29udmVyc2F0aW9ucztcbiAgICAgIERFTEVURSBGUk9NIGVtb2ppcztcbiAgICAgIERFTEVURSBGUk9NIGdyb3VwQ2FsbFJpbmdzO1xuICAgICAgREVMRVRFIEZST00gaWRlbnRpdHlLZXlzO1xuICAgICAgREVMRVRFIEZST00gaXRlbXM7XG4gICAgICBERUxFVEUgRlJPTSBqb2JzO1xuICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzO1xuICAgICAgREVMRVRFIEZST00gbWVzc2FnZXM7XG4gICAgICBERUxFVEUgRlJPTSBwcmVLZXlzO1xuICAgICAgREVMRVRFIEZST00gcmVhY3Rpb25zO1xuICAgICAgREVMRVRFIEZST00gc2VuZGVyS2V5cztcbiAgICAgIERFTEVURSBGUk9NIHNlbmRMb2dNZXNzYWdlSWRzO1xuICAgICAgREVMRVRFIEZST00gc2VuZExvZ1BheWxvYWRzO1xuICAgICAgREVMRVRFIEZST00gc2VuZExvZ1JlY2lwaWVudHM7XG4gICAgICBERUxFVEUgRlJPTSBzZXNzaW9ucztcbiAgICAgIERFTEVURSBGUk9NIHNpZ25lZFByZUtleXM7XG4gICAgICBERUxFVEUgRlJPTSBzdGlja2VyX3BhY2tzO1xuICAgICAgREVMRVRFIEZST00gc3RpY2tlcl9yZWZlcmVuY2VzO1xuICAgICAgREVMRVRFIEZST00gc3RpY2tlcnM7XG4gICAgICBERUxFVEUgRlJPTSBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnM7XG4gICAgICBERUxFVEUgRlJPTSBzdG9yeURpc3RyaWJ1dGlvbnM7XG4gICAgICBERUxFVEUgRlJPTSBzdG9yeVJlYWRzO1xuICAgICAgREVMRVRFIEZST00gdW5wcm9jZXNzZWQ7XG4gICAgYCk7XG4gIH0pKCk7XG59XG5cbi8vIEFueXRoaW5nIHRoYXQgaXNuJ3QgdXNlci12aXNpYmxlIGRhdGFcbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUFsbENvbmZpZ3VyYXRpb24oXG4gIG1vZGUgPSBSZW1vdmVBbGxDb25maWd1cmF0aW9uLkZ1bGxcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoXG4gICAgICBgXG4gICAgICBERUxFVEUgRlJPTSBpZGVudGl0eUtleXM7XG4gICAgICBERUxFVEUgRlJPTSBqb2JzO1xuICAgICAgREVMRVRFIEZST00gcHJlS2V5cztcbiAgICAgIERFTEVURSBGUk9NIHNlbmRlcktleXM7XG4gICAgICBERUxFVEUgRlJPTSBzZW5kTG9nTWVzc2FnZUlkcztcbiAgICAgIERFTEVURSBGUk9NIHNlbmRMb2dQYXlsb2FkcztcbiAgICAgIERFTEVURSBGUk9NIHNlbmRMb2dSZWNpcGllbnRzO1xuICAgICAgREVMRVRFIEZST00gc2Vzc2lvbnM7XG4gICAgICBERUxFVEUgRlJPTSBzaWduZWRQcmVLZXlzO1xuICAgICAgREVMRVRFIEZST00gdW5wcm9jZXNzZWQ7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGlmIChtb2RlID09PSBSZW1vdmVBbGxDb25maWd1cmF0aW9uLkZ1bGwpIHtcbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgREVMRVRFIEZST00gaXRlbXM7XG4gICAgICAgIGBcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChtb2RlID09PSBSZW1vdmVBbGxDb25maWd1cmF0aW9uLlNvZnQpIHtcbiAgICAgIGNvbnN0IGl0ZW1JZHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IGRiXG4gICAgICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KCdTRUxFQ1QgaWQgRlJPTSBpdGVtcycpXG4gICAgICAgIC5wbHVjayh0cnVlKVxuICAgICAgICAuYWxsKCk7XG5cbiAgICAgIGNvbnN0IGFsbG93ZWRTZXQgPSBuZXcgU2V0PHN0cmluZz4oU1RPUkFHRV9VSV9LRVlTKTtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaXRlbUlkcykge1xuICAgICAgICBpZiAoIWFsbG93ZWRTZXQuaGFzKGlkKSkge1xuICAgICAgICAgIHJlbW92ZUJ5SWQoZGIsICdpdGVtcycsIGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKG1vZGUpO1xuICAgIH1cblxuICAgIGRiLmV4ZWMoXG4gICAgICBcIlVQREFURSBjb252ZXJzYXRpb25zIFNFVCBqc29uID0ganNvbl9yZW1vdmUoanNvbiwgJyQuc2VuZGVyS2V5SW5mbycpO1wiXG4gICAgKTtcbiAgfSkoKTtcbn1cblxuY29uc3QgTUFYX01FU1NBR0VfTUlHUkFUSU9OX0FUVEVNUFRTID0gNTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNOZWVkaW5nVXBncmFkZShcbiAgbGltaXQ6IG51bWJlcixcbiAgeyBtYXhWZXJzaW9uIH06IHsgbWF4VmVyc2lvbjogbnVtYmVyIH1cbik6IFByb21pc2U8QXJyYXk8TWVzc2FnZVR5cGU+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBjb25zdCByb3dzOiBKU09OUm93cyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGpzb25cbiAgICAgIEZST00gbWVzc2FnZXNcbiAgICAgIFdIRVJFXG4gICAgICAgIChzY2hlbWFWZXJzaW9uIElTIE5VTEwgT1Igc2NoZW1hVmVyc2lvbiA8ICRtYXhWZXJzaW9uKSBBTkRcbiAgICAgICAgSUZOVUxMKFxuICAgICAgICAgIGpzb25fZXh0cmFjdChqc29uLCAnJC5zY2hlbWFNaWdyYXRpb25BdHRlbXB0cycpLFxuICAgICAgICAgIDBcbiAgICAgICAgKSA8ICRtYXhBdHRlbXB0c1xuICAgICAgTElNSVQgJGxpbWl0O1xuICAgICAgYFxuICAgIClcbiAgICAuYWxsKHtcbiAgICAgIG1heFZlcnNpb24sXG4gICAgICBtYXhBdHRlbXB0czogTUFYX01FU1NBR0VfTUlHUkFUSU9OX0FUVEVNUFRTLFxuICAgICAgbGltaXQsXG4gICAgfSk7XG5cbiAgcmV0dXJuIHJvd3MubWFwKHJvdyA9PiBqc29uVG9PYmplY3Qocm93Lmpzb24pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZXNXaXRoVmlzdWFsTWVkaWFBdHRhY2htZW50cyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgeyBsaW1pdCB9OiB7IGxpbWl0OiBudW1iZXIgfVxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzOiBKU09OUm93cyA9IGRiXG4gICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgYFxuICAgICAgU0VMRUNUIGpzb24gRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICBpc1N0b3J5IElTIDAgQU5EXG4gICAgICAgIHN0b3J5SWQgSVMgTlVMTCBBTkRcbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWQgQU5EXG4gICAgICAgIGhhc1Zpc3VhbE1lZGlhQXR0YWNobWVudHMgPSAxXG4gICAgICBPUkRFUiBCWSByZWNlaXZlZF9hdCBERVNDLCBzZW50X2F0IERFU0NcbiAgICAgIExJTUlUICRsaW1pdDtcbiAgICAgIGBcbiAgICApXG4gICAgLmFsbCh7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGxpbWl0LFxuICAgIH0pO1xuXG4gIHJldHVybiByb3dzLm1hcChyb3cgPT4ganNvblRvT2JqZWN0KHJvdy5qc29uKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1lc3NhZ2VzV2l0aEZpbGVBdHRhY2htZW50cyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgeyBsaW1pdCB9OiB7IGxpbWl0OiBudW1iZXIgfVxuKTogUHJvbWlzZTxBcnJheTxNZXNzYWdlVHlwZT4+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCByb3dzID0gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFXG4gICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgc3RvcnlJZCBJUyBOVUxMIEFORFxuICAgICAgICBjb252ZXJzYXRpb25JZCA9ICRjb252ZXJzYXRpb25JZCBBTkRcbiAgICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzID0gMVxuICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgREVTQywgc2VudF9hdCBERVNDXG4gICAgICBMSU1JVCAkbGltaXQ7XG4gICAgICBgXG4gICAgKVxuICAgIC5hbGwoe1xuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBsaW1pdCxcbiAgICB9KTtcblxuICByZXR1cm4gbWFwKHJvd3MsIHJvdyA9PiBqc29uVG9PYmplY3Qocm93Lmpzb24pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZVNlcnZlckd1aWRzRm9yU3BhbShcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICAvLyBUaGUgc2VydmVyJ3MgbWF4aW11bSBpcyAzLCB3aGljaCBpcyB3aHkgeW91IHNlZSBgTElNSVQgM2AgaW4gdGhpcyBxdWVyeS4gTm90ZSB0aGF0IHdlXG4gIC8vICAgdXNlIGBwbHVja2AgaGVyZSB0byBvbmx5IGdldCB0aGUgZmlyc3QgY29sdW1uIVxuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1Qgc2VydmVyR3VpZFxuICAgICAgRlJPTSBtZXNzYWdlc1xuICAgICAgV0hFUkUgY29udmVyc2F0aW9uSWQgPSAkY29udmVyc2F0aW9uSWRcbiAgICAgIEFORCB0eXBlID0gJ2luY29taW5nJ1xuICAgICAgQU5EIHNlcnZlckd1aWQgSVMgTk9UIE5VTExcbiAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IERFU0MsIHNlbnRfYXQgREVTQ1xuICAgICAgTElNSVQgMztcbiAgICAgIGBcbiAgICApXG4gICAgLnBsdWNrKHRydWUpXG4gICAgLmFsbCh7IGNvbnZlcnNhdGlvbklkIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRFeHRlcm5hbEZpbGVzRm9yTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlVHlwZSk6IEFycmF5PHN0cmluZz4ge1xuICBjb25zdCB7IGF0dGFjaG1lbnRzLCBjb250YWN0LCBxdW90ZSwgcHJldmlldywgc3RpY2tlciB9ID0gbWVzc2FnZTtcbiAgY29uc3QgZmlsZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBmb3JFYWNoKGF0dGFjaG1lbnRzLCBhdHRhY2htZW50ID0+IHtcbiAgICBjb25zdCB7IHBhdGg6IGZpbGUsIHRodW1ibmFpbCwgc2NyZWVuc2hvdCB9ID0gYXR0YWNobWVudDtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG5cbiAgICBpZiAodGh1bWJuYWlsICYmIHRodW1ibmFpbC5wYXRoKSB7XG4gICAgICBmaWxlcy5wdXNoKHRodW1ibmFpbC5wYXRoKTtcbiAgICB9XG5cbiAgICBpZiAoc2NyZWVuc2hvdCAmJiBzY3JlZW5zaG90LnBhdGgpIHtcbiAgICAgIGZpbGVzLnB1c2goc2NyZWVuc2hvdC5wYXRoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChxdW90ZSAmJiBxdW90ZS5hdHRhY2htZW50cyAmJiBxdW90ZS5hdHRhY2htZW50cy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKHF1b3RlLmF0dGFjaG1lbnRzLCBhdHRhY2htZW50ID0+IHtcbiAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuXG4gICAgICBpZiAodGh1bWJuYWlsICYmIHRodW1ibmFpbC5wYXRoKSB7XG4gICAgICAgIGZpbGVzLnB1c2godGh1bWJuYWlsLnBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNvbnRhY3QgJiYgY29udGFjdC5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKGNvbnRhY3QsIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgeyBhdmF0YXIgfSA9IGl0ZW07XG5cbiAgICAgIGlmIChhdmF0YXIgJiYgYXZhdGFyLmF2YXRhciAmJiBhdmF0YXIuYXZhdGFyLnBhdGgpIHtcbiAgICAgICAgZmlsZXMucHVzaChhdmF0YXIuYXZhdGFyLnBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKHByZXZpZXcsIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgeyBpbWFnZSB9ID0gaXRlbTtcblxuICAgICAgaWYgKGltYWdlICYmIGltYWdlLnBhdGgpIHtcbiAgICAgICAgZmlsZXMucHVzaChpbWFnZS5wYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChzdGlja2VyICYmIHN0aWNrZXIuZGF0YSAmJiBzdGlja2VyLmRhdGEucGF0aCkge1xuICAgIGZpbGVzLnB1c2goc3RpY2tlci5kYXRhLnBhdGgpO1xuXG4gICAgaWYgKHN0aWNrZXIuZGF0YS50aHVtYm5haWwgJiYgc3RpY2tlci5kYXRhLnRodW1ibmFpbC5wYXRoKSB7XG4gICAgICBmaWxlcy5wdXNoKHN0aWNrZXIuZGF0YS50aHVtYm5haWwucGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbGVzO1xufVxuXG5mdW5jdGlvbiBnZXRFeHRlcm5hbEZpbGVzRm9yQ29udmVyc2F0aW9uKFxuICBjb252ZXJzYXRpb246IFBpY2s8Q29udmVyc2F0aW9uVHlwZSwgJ2F2YXRhcicgfCAncHJvZmlsZUF2YXRhcic+XG4pOiBBcnJheTxzdHJpbmc+IHtcbiAgY29uc3QgeyBhdmF0YXIsIHByb2ZpbGVBdmF0YXIgfSA9IGNvbnZlcnNhdGlvbjtcbiAgY29uc3QgZmlsZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBpZiAoYXZhdGFyICYmIGF2YXRhci5wYXRoKSB7XG4gICAgZmlsZXMucHVzaChhdmF0YXIucGF0aCk7XG4gIH1cblxuICBpZiAocHJvZmlsZUF2YXRhciAmJiBwcm9maWxlQXZhdGFyLnBhdGgpIHtcbiAgICBmaWxlcy5wdXNoKHByb2ZpbGVBdmF0YXIucGF0aCk7XG4gIH1cblxuICByZXR1cm4gZmlsZXM7XG59XG5cbmZ1bmN0aW9uIGdldEV4dGVybmFsRHJhZnRGaWxlc0ZvckNvbnZlcnNhdGlvbihcbiAgY29udmVyc2F0aW9uOiBQaWNrPENvbnZlcnNhdGlvblR5cGUsICdkcmFmdEF0dGFjaG1lbnRzJz5cbik6IEFycmF5PHN0cmluZz4ge1xuICBjb25zdCBkcmFmdEF0dGFjaG1lbnRzID0gY29udmVyc2F0aW9uLmRyYWZ0QXR0YWNobWVudHMgfHwgW107XG4gIGNvbnN0IGZpbGVzOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgZm9yRWFjaChkcmFmdEF0dGFjaG1lbnRzLCBhdHRhY2htZW50ID0+IHtcbiAgICBpZiAoYXR0YWNobWVudC5wZW5kaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBwYXRoOiBmaWxlLCBzY3JlZW5zaG90UGF0aCB9ID0gYXR0YWNobWVudDtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG5cbiAgICBpZiAoc2NyZWVuc2hvdFBhdGgpIHtcbiAgICAgIGZpbGVzLnB1c2goc2NyZWVuc2hvdFBhdGgpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZpbGVzO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVLbm93bkF0dGFjaG1lbnRzKFxuICBhbGxBdHRhY2htZW50czogQXJyYXk8c3RyaW5nPlxuKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3QgbG9va3VwOiBEaWN0aW9uYXJ5PGJvb2xlYW4+ID0gZnJvbVBhaXJzKFxuICAgIG1hcChhbGxBdHRhY2htZW50cywgZmlsZSA9PiBbZmlsZSwgdHJ1ZV0pXG4gICk7XG4gIGNvbnN0IGNodW5rU2l6ZSA9IDUwMDtcblxuICBjb25zdCB0b3RhbCA9IGdldE1lc3NhZ2VDb3VudFN5bmMoKTtcbiAgbG9nZ2VyLmluZm8oXG4gICAgYHJlbW92ZUtub3duQXR0YWNobWVudHM6IEFib3V0IHRvIGl0ZXJhdGUgdGhyb3VnaCAke3RvdGFsfSBtZXNzYWdlc2BcbiAgKTtcblxuICBsZXQgY291bnQgPSAwO1xuXG4gIGZvciAoY29uc3QgbWVzc2FnZSBvZiBuZXcgVGFibGVJdGVyYXRvcjxNZXNzYWdlVHlwZT4oZGIsICdtZXNzYWdlcycpKSB7XG4gICAgY29uc3QgZXh0ZXJuYWxGaWxlcyA9IGdldEV4dGVybmFsRmlsZXNGb3JNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIGZvckVhY2goZXh0ZXJuYWxGaWxlcywgZmlsZSA9PiB7XG4gICAgICBkZWxldGUgbG9va3VwW2ZpbGVdO1xuICAgIH0pO1xuICAgIGNvdW50ICs9IDE7XG4gIH1cblxuICBsb2dnZXIuaW5mbyhgcmVtb3ZlS25vd25BdHRhY2htZW50czogRG9uZSBwcm9jZXNzaW5nICR7Y291bnR9IG1lc3NhZ2VzYCk7XG5cbiAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gIGNvdW50ID0gMDtcbiAgbGV0IGlkID0gJyc7XG5cbiAgY29uc3QgY29udmVyc2F0aW9uVG90YWwgPSBhd2FpdCBnZXRDb252ZXJzYXRpb25Db3VudCgpO1xuICBsb2dnZXIuaW5mbyhcbiAgICBgcmVtb3ZlS25vd25BdHRhY2htZW50czogQWJvdXQgdG8gaXRlcmF0ZSB0aHJvdWdoICR7Y29udmVyc2F0aW9uVG90YWx9IGNvbnZlcnNhdGlvbnNgXG4gICk7XG5cbiAgY29uc3QgZmV0Y2hDb252ZXJzYXRpb25zID0gZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgICAgU0VMRUNUIGpzb24gRlJPTSBjb252ZXJzYXRpb25zXG4gICAgICBXSEVSRSBpZCA+ICRpZFxuICAgICAgT1JERVIgQlkgaWQgQVNDXG4gICAgICBMSU1JVCAkY2h1bmtTaXplO1xuICAgIGBcbiAgKTtcblxuICB3aGlsZSAoIWNvbXBsZXRlKSB7XG4gICAgY29uc3Qgcm93cyA9IGZldGNoQ29udmVyc2F0aW9ucy5hbGwoe1xuICAgICAgaWQsXG4gICAgICBjaHVua1NpemUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25zOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9IG1hcChyb3dzLCByb3cgPT5cbiAgICAgIGpzb25Ub09iamVjdChyb3cuanNvbilcbiAgICApO1xuICAgIGNvbnZlcnNhdGlvbnMuZm9yRWFjaChjb252ZXJzYXRpb24gPT4ge1xuICAgICAgY29uc3QgZXh0ZXJuYWxGaWxlcyA9IGdldEV4dGVybmFsRmlsZXNGb3JDb252ZXJzYXRpb24oY29udmVyc2F0aW9uKTtcbiAgICAgIGV4dGVybmFsRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgZGVsZXRlIGxvb2t1cFtmaWxlXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGFzdE1lc3NhZ2U6IENvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQgPSBsYXN0KGNvbnZlcnNhdGlvbnMpO1xuICAgIGlmIChsYXN0TWVzc2FnZSkge1xuICAgICAgKHsgaWQgfSA9IGxhc3RNZXNzYWdlKTtcbiAgICB9XG4gICAgY29tcGxldGUgPSBjb252ZXJzYXRpb25zLmxlbmd0aCA8IGNodW5rU2l6ZTtcbiAgICBjb3VudCArPSBjb252ZXJzYXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKGByZW1vdmVLbm93bkF0dGFjaG1lbnRzOiBEb25lIHByb2Nlc3NpbmcgJHtjb3VudH0gY29udmVyc2F0aW9uc2ApO1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhsb29rdXApO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVLbm93blN0aWNrZXJzKFxuICBhbGxTdGlja2VyczogQXJyYXk8c3RyaW5nPlxuKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3QgbG9va3VwOiBEaWN0aW9uYXJ5PGJvb2xlYW4+ID0gZnJvbVBhaXJzKFxuICAgIG1hcChhbGxTdGlja2VycywgZmlsZSA9PiBbZmlsZSwgdHJ1ZV0pXG4gICk7XG4gIGNvbnN0IGNodW5rU2l6ZSA9IDUwO1xuXG4gIGNvbnN0IHRvdGFsID0gYXdhaXQgZ2V0U3RpY2tlckNvdW50KCk7XG4gIGxvZ2dlci5pbmZvKFxuICAgIGByZW1vdmVLbm93blN0aWNrZXJzOiBBYm91dCB0byBpdGVyYXRlIHRocm91Z2ggJHt0b3RhbH0gc3RpY2tlcnNgXG4gICk7XG5cbiAgbGV0IGNvdW50ID0gMDtcbiAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gIGxldCByb3dpZCA9IDA7XG5cbiAgd2hpbGUgKCFjb21wbGV0ZSkge1xuICAgIGNvbnN0IHJvd3M6IEFycmF5PHsgcm93aWQ6IG51bWJlcjsgcGF0aDogc3RyaW5nIH0+ID0gZGJcbiAgICAgIC5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1Qgcm93aWQsIHBhdGggRlJPTSBzdGlja2Vyc1xuICAgICAgICBXSEVSRSByb3dpZCA+ICRyb3dpZFxuICAgICAgICBPUkRFUiBCWSByb3dpZCBBU0NcbiAgICAgICAgTElNSVQgJGNodW5rU2l6ZTtcbiAgICAgICAgYFxuICAgICAgKVxuICAgICAgLmFsbCh7XG4gICAgICAgIHJvd2lkLFxuICAgICAgICBjaHVua1NpemUsXG4gICAgICB9KTtcblxuICAgIGNvbnN0IGZpbGVzOiBBcnJheTxzdHJpbmc+ID0gcm93cy5tYXAocm93ID0+IHJvdy5wYXRoKTtcbiAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgZGVsZXRlIGxvb2t1cFtmaWxlXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxhc3RTdGlja2VyID0gbGFzdChyb3dzKTtcbiAgICBpZiAobGFzdFN0aWNrZXIpIHtcbiAgICAgICh7IHJvd2lkIH0gPSBsYXN0U3RpY2tlcik7XG4gICAgfVxuICAgIGNvbXBsZXRlID0gcm93cy5sZW5ndGggPCBjaHVua1NpemU7XG4gICAgY291bnQgKz0gcm93cy5sZW5ndGg7XG4gIH1cblxuICBsb2dnZXIuaW5mbyhgcmVtb3ZlS25vd25TdGlja2VyczogRG9uZSBwcm9jZXNzaW5nICR7Y291bnR9IHN0aWNrZXJzYCk7XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGxvb2t1cCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZUtub3duRHJhZnRBdHRhY2htZW50cyhcbiAgYWxsU3RpY2tlcnM6IEFycmF5PHN0cmluZz5cbik6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IGxvb2t1cDogRGljdGlvbmFyeTxib29sZWFuPiA9IGZyb21QYWlycyhcbiAgICBtYXAoYWxsU3RpY2tlcnMsIGZpbGUgPT4gW2ZpbGUsIHRydWVdKVxuICApO1xuICBjb25zdCBjaHVua1NpemUgPSA1MDtcblxuICBjb25zdCB0b3RhbCA9IGF3YWl0IGdldENvbnZlcnNhdGlvbkNvdW50KCk7XG4gIGxvZ2dlci5pbmZvKFxuICAgIGByZW1vdmVLbm93bkRyYWZ0QXR0YWNobWVudHM6IEFib3V0IHRvIGl0ZXJhdGUgdGhyb3VnaCAke3RvdGFsfSBjb252ZXJzYXRpb25zYFxuICApO1xuXG4gIGxldCBjb21wbGV0ZSA9IGZhbHNlO1xuICBsZXQgY291bnQgPSAwO1xuICAvLyBUaG91Z2ggY29udmVyc2F0aW9ucy5pZCBpcyBhIHN0cmluZywgdGhpcyBlbnN1cmVzIHRoYXQsIHdoZW4gY29lcmNlZCwgdGhpc1xuICAvLyAgIHZhbHVlIGlzIHN0aWxsIGEgc3RyaW5nIGJ1dCBpdCdzIHNtYWxsZXIgdGhhbiBldmVyeSBvdGhlciBzdHJpbmcuXG4gIGxldCBpZDogbnVtYmVyIHwgc3RyaW5nID0gMDtcblxuICB3aGlsZSAoIWNvbXBsZXRlKSB7XG4gICAgY29uc3Qgcm93czogSlNPTlJvd3MgPSBkYlxuICAgICAgLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIFNFTEVDVCBqc29uIEZST00gY29udmVyc2F0aW9uc1xuICAgICAgICBXSEVSRSBpZCA+ICRpZFxuICAgICAgICBPUkRFUiBCWSBpZCBBU0NcbiAgICAgICAgTElNSVQgJGNodW5rU2l6ZTtcbiAgICAgICAgYFxuICAgICAgKVxuICAgICAgLmFsbCh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaHVua1NpemUsXG4gICAgICB9KTtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+ID0gcm93cy5tYXAocm93ID0+XG4gICAgICBqc29uVG9PYmplY3Qocm93Lmpzb24pXG4gICAgKTtcbiAgICBjb252ZXJzYXRpb25zLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgIGNvbnN0IGV4dGVybmFsRmlsZXMgPSBnZXRFeHRlcm5hbERyYWZ0RmlsZXNGb3JDb252ZXJzYXRpb24oY29udmVyc2F0aW9uKTtcbiAgICAgIGV4dGVybmFsRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgZGVsZXRlIGxvb2t1cFtmaWxlXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGFzdE1lc3NhZ2U6IENvbnZlcnNhdGlvblR5cGUgfCB1bmRlZmluZWQgPSBsYXN0KGNvbnZlcnNhdGlvbnMpO1xuICAgIGlmIChsYXN0TWVzc2FnZSkge1xuICAgICAgKHsgaWQgfSA9IGxhc3RNZXNzYWdlKTtcbiAgICB9XG4gICAgY29tcGxldGUgPSBjb252ZXJzYXRpb25zLmxlbmd0aCA8IGNodW5rU2l6ZTtcbiAgICBjb3VudCArPSBjb252ZXJzYXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKFxuICAgIGByZW1vdmVLbm93bkRyYWZ0QXR0YWNobWVudHM6IERvbmUgcHJvY2Vzc2luZyAke2NvdW50fSBjb252ZXJzYXRpb25zYFxuICApO1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhsb29rdXApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRKb2JzSW5RdWV1ZShxdWV1ZVR5cGU6IHN0cmluZyk6IFByb21pc2U8QXJyYXk8U3RvcmVkSm9iPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHJldHVybiBnZXRKb2JzSW5RdWV1ZVN5bmMoZGIsIHF1ZXVlVHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRKb2JzSW5RdWV1ZVN5bmMoXG4gIGRiOiBEYXRhYmFzZSxcbiAgcXVldWVUeXBlOiBzdHJpbmdcbik6IEFycmF5PFN0b3JlZEpvYj4ge1xuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICBgXG4gICAgICBTRUxFQ1QgaWQsIHRpbWVzdGFtcCwgZGF0YVxuICAgICAgRlJPTSBqb2JzXG4gICAgICBXSEVSRSBxdWV1ZVR5cGUgPSAkcXVldWVUeXBlXG4gICAgICBPUkRFUiBCWSB0aW1lc3RhbXA7XG4gICAgICBgXG4gICAgKVxuICAgIC5hbGwoeyBxdWV1ZVR5cGUgfSlcbiAgICAubWFwKHJvdyA9PiAoe1xuICAgICAgaWQ6IHJvdy5pZCxcbiAgICAgIHF1ZXVlVHlwZSxcbiAgICAgIHRpbWVzdGFtcDogcm93LnRpbWVzdGFtcCxcbiAgICAgIGRhdGE6IGlzTm90TmlsKHJvdy5kYXRhKSA/IEpTT04ucGFyc2Uocm93LmRhdGEpIDogdW5kZWZpbmVkLFxuICAgIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEpvYlN5bmMoZGI6IERhdGFiYXNlLCBqb2I6IFJlYWRvbmx5PFN0b3JlZEpvYj4pOiB2b2lkIHtcbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgICAgSU5TRVJUIElOVE8gam9ic1xuICAgICAgKGlkLCBxdWV1ZVR5cGUsIHRpbWVzdGFtcCwgZGF0YSlcbiAgICAgIFZBTFVFU1xuICAgICAgKCRpZCwgJHF1ZXVlVHlwZSwgJHRpbWVzdGFtcCwgJGRhdGEpO1xuICAgIGBcbiAgKS5ydW4oe1xuICAgIGlkOiBqb2IuaWQsXG4gICAgcXVldWVUeXBlOiBqb2IucXVldWVUeXBlLFxuICAgIHRpbWVzdGFtcDogam9iLnRpbWVzdGFtcCxcbiAgICBkYXRhOiBpc05vdE5pbChqb2IuZGF0YSkgPyBKU09OLnN0cmluZ2lmeShqb2IuZGF0YSkgOiBudWxsLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0Sm9iKGpvYjogUmVhZG9ubHk8U3RvcmVkSm9iPik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIHJldHVybiBpbnNlcnRKb2JTeW5jKGRiLCBqb2IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVKb2IoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oJ0RFTEVURSBGUk9NIGpvYnMgV0hFUkUgaWQgPSAkaWQnKS5ydW4oeyBpZCB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0KFxuICByaW5nSWQ6IGJpZ2ludFxuKTogUHJvbWlzZTxQcm9jZXNzR3JvdXBDYWxsUmluZ1JlcXVlc3RSZXN1bHQ+IHtcbiAgY29uc3QgZGIgPSBnZXRJbnN0YW5jZSgpO1xuXG4gIHJldHVybiBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDogUHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0UmVzdWx0O1xuXG4gICAgY29uc3Qgd2FzUmluZ1ByZXZpb3VzbHlDYW5jZWxlZCA9IEJvb2xlYW4oXG4gICAgICBkYlxuICAgICAgICAucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgICAgYFxuICAgICAgICAgIFNFTEVDVCAxIEZST00gZ3JvdXBDYWxsUmluZ3NcbiAgICAgICAgICBXSEVSRSByaW5nSWQgPSAkcmluZ0lkIEFORCBpc0FjdGl2ZSA9IDBcbiAgICAgICAgICBMSU1JVCAxO1xuICAgICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAucGx1Y2sodHJ1ZSlcbiAgICAgICAgLmdldCh7IHJpbmdJZCB9KVxuICAgICk7XG5cbiAgICBpZiAod2FzUmluZ1ByZXZpb3VzbHlDYW5jZWxlZCkge1xuICAgICAgcmVzdWx0ID0gUHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0UmVzdWx0LlJpbmdXYXNQcmV2aW91c2x5Q2FuY2VsZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlzVGhlcmVBbm90aGVyQWN0aXZlUmluZyA9IEJvb2xlYW4oXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oXG4gICAgICAgICAgICBgXG4gICAgICAgICAgICBTRUxFQ1QgMSBGUk9NIGdyb3VwQ2FsbFJpbmdzXG4gICAgICAgICAgICBXSEVSRSBpc0FjdGl2ZSA9IDFcbiAgICAgICAgICAgIExJTUlUIDE7XG4gICAgICAgICAgICBgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjayh0cnVlKVxuICAgICAgICAgIC5nZXQoKVxuICAgICAgKTtcbiAgICAgIGlmIChpc1RoZXJlQW5vdGhlckFjdGl2ZVJpbmcpIHtcbiAgICAgICAgcmVzdWx0ID0gUHJvY2Vzc0dyb3VwQ2FsbFJpbmdSZXF1ZXN0UmVzdWx0LlRoZXJlSXNBbm90aGVyQWN0aXZlUmluZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IFByb2Nlc3NHcm91cENhbGxSaW5nUmVxdWVzdFJlc3VsdC5TaG91bGRSaW5nO1xuICAgICAgfVxuXG4gICAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgT1IgSUdOT1JFIElOVE8gZ3JvdXBDYWxsUmluZ3MgKHJpbmdJZCwgaXNBY3RpdmUsIGNyZWF0ZWRBdClcbiAgICAgICAgVkFMVUVTICgkcmluZ0lkLCAxLCAkY3JlYXRlZEF0KTtcbiAgICAgICAgYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzR3JvdXBDYWxsUmluZ0NhbmNlbGF0aW9uKHJpbmdJZDogYmlnaW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICBgXG4gICAgSU5TRVJUIElOVE8gZ3JvdXBDYWxsUmluZ3MgKHJpbmdJZCwgaXNBY3RpdmUsIGNyZWF0ZWRBdClcbiAgICBWQUxVRVMgKCRyaW5nSWQsIDAsICRjcmVhdGVkQXQpXG4gICAgT04gQ09ORkxJQ1QgKHJpbmdJZCkgRE9cbiAgICBVUERBVEUgU0VUIGlzQWN0aXZlID0gMDtcbiAgICBgXG4gICkucnVuKHsgcmluZ0lkLCBjcmVhdGVkQXQ6IERhdGUubm93KCkgfSk7XG59XG5cbi8vIFRoaXMgYWdlLCBpbiBtaWxsaXNlY29uZHMsIHNob3VsZCBiZSBsb25nZXIgdGhhbiBhbnkgZ3JvdXAgY2FsbCByaW5nIGR1cmF0aW9uLiBCZXlvbmRcbi8vICAgdGhhdCwgaXQgZG9lc24ndCByZWFsbHkgbWF0dGVyIHdoYXQgdGhlIHZhbHVlIGlzLlxuY29uc3QgTUFYX0dST1VQX0NBTExfUklOR19BR0UgPSAzMCAqIGR1cmF0aW9ucy5NSU5VVEU7XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFuRXhwaXJlZEdyb3VwQ2FsbFJpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgYFxuICAgIERFTEVURSBGUk9NIGdyb3VwQ2FsbFJpbmdzXG4gICAgV0hFUkUgY3JlYXRlZEF0IDwgJGV4cGlyZWRSaW5nVGltZTtcbiAgICBgXG4gICkucnVuKHtcbiAgICBleHBpcmVkUmluZ1RpbWU6IERhdGUubm93KCkgLSBNQVhfR1JPVVBfQ0FMTF9SSU5HX0FHRSxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1heE1lc3NhZ2VDb3VudGVyKCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICByZXR1cm4gZGJcbiAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgIGBcbiAgICBTRUxFQ1QgTUFYKGNvdW50ZXIpXG4gICAgRlJPTVxuICAgICAgKFxuICAgICAgICBTRUxFQ1QgTUFYKHJlY2VpdmVkX2F0KSBBUyBjb3VudGVyIEZST00gbWVzc2FnZXNcbiAgICAgICAgVU5JT05cbiAgICAgICAgU0VMRUNUIE1BWCh0aW1lc3RhbXApIEFTIGNvdW50ZXIgRlJPTSB1bnByb2Nlc3NlZFxuICAgICAgKVxuICAgIGBcbiAgICApXG4gICAgLnBsdWNrKClcbiAgICAuZ2V0KCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFN0YXRpc3RpY3NGb3JMb2dnaW5nKCk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IGNvdW50cyA9IGF3YWl0IHBQcm9wcyh7XG4gICAgbWVzc2FnZUNvdW50OiBnZXRNZXNzYWdlQ291bnQoKSxcbiAgICBjb252ZXJzYXRpb25Db3VudDogZ2V0Q29udmVyc2F0aW9uQ291bnQoKSxcbiAgICBzZXNzaW9uQ291bnQ6IGdldENvdW50RnJvbVRhYmxlKGRiLCAnc2Vzc2lvbnMnKSxcbiAgICBzZW5kZXJLZXlDb3VudDogZ2V0Q291bnRGcm9tVGFibGUoZGIsICdzZW5kZXJLZXlzJyksXG4gIH0pO1xuICByZXR1cm4gbWFwVmFsdWVzKGNvdW50cywgZm9ybWF0Q291bnRGb3JMb2dnaW5nKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQWxsQ29udmVyc2F0aW9uQ29sb3JzKFxuICBjb252ZXJzYXRpb25Db2xvcj86IENvbnZlcnNhdGlvbkNvbG9yVHlwZSxcbiAgY3VzdG9tQ29sb3JEYXRhPzoge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdmFsdWU6IEN1c3RvbUNvbG9yVHlwZTtcbiAgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGRiID0gZ2V0SW5zdGFuY2UoKTtcblxuICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICBgXG4gICAgVVBEQVRFIGNvbnZlcnNhdGlvbnNcbiAgICBTRVQganNvbiA9IEpTT05fUEFUQ0goanNvbiwgJHBhdGNoKTtcbiAgICBgXG4gICkucnVuKHtcbiAgICBwYXRjaDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgY29udmVyc2F0aW9uQ29sb3I6IGNvbnZlcnNhdGlvbkNvbG9yIHx8IG51bGwsXG4gICAgICBjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JEYXRhPy52YWx1ZSB8fCBudWxsLFxuICAgICAgY3VzdG9tQ29sb3JJZDogY3VzdG9tQ29sb3JEYXRhPy5pZCB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlQWxsUHJvZmlsZUtleUNyZWRlbnRpYWxzKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYiA9IGdldEluc3RhbmNlKCk7XG5cbiAgZGIuZXhlYyhcbiAgICBgXG4gICAgVVBEQVRFIGNvbnZlcnNhdGlvbnNcbiAgICBTRVRcbiAgICAgIGpzb24gPSBqc29uX3JlbW92ZShqc29uLCAnJC5wcm9maWxlS2V5Q3JlZGVudGlhbCcpXG4gICAgYFxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0Esa0JBQXFCO0FBQ3JCLG9CQUFtQjtBQUNuQixvQkFBbUI7QUFFbkIsNEJBQWdCO0FBQ2hCLHFCQUFtQjtBQUduQixvQkFhTztBQUVQLCtCQUEyQjtBQUczQiwyQkFBZ0M7QUFDaEMsa0JBQXFCO0FBR3JCLG9CQUFpRDtBQUNqRCwwQkFBNkI7QUFDN0IsMkJBQThCO0FBQzlCLHNCQUF5QjtBQUN6Qiw0QkFBK0I7QUFDL0Isc0JBQXlCO0FBQ3pCLDhCQUFpQztBQUNqQyw2QkFBZ0M7QUFDaEMsZ0JBQTJCO0FBQzNCLG1DQUFzQztBQUV0QyxxQkFBa0Q7QUFDbEQsb0NBQXVDO0FBRXZDLDJCQUFtQztBQUNuQyw2QkFBcUM7QUFFckMsVUFBcUI7QUFFckIsa0JBZU87QUFDUCx3QkFBNkI7QUFpRDdCLCtCQUEyQjtBQXNCM0IsTUFBTSxnQkFBaUM7QUFBQSxFQUNyQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FB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
