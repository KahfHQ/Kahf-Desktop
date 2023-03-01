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
var SignalProtocolStore_exports = {};
__export(SignalProtocolStore_exports, {
  GLOBAL_ZONE: () => GLOBAL_ZONE,
  SignalProtocolStore: () => SignalProtocolStore,
  freezePreKey: () => freezePreKey,
  freezePublicKey: () => freezePublicKey,
  freezeSession: () => freezeSession,
  freezeSignedPreKey: () => freezeSignedPreKey,
  hydratePreKey: () => hydratePreKey,
  hydratePublicKey: () => hydratePublicKey,
  hydrateSession: () => hydrateSession,
  hydrateSignedPreKey: () => hydrateSignedPreKey
});
module.exports = __toCommonJS(SignalProtocolStore_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_lodash = require("lodash");
var import_zod = require("zod");
var import_libsignal_client = require("@signalapp/libsignal-client");
var Bytes = __toESM(require("./Bytes"));
var import_Crypto = require("./Crypto");
var import_assert = require("./util/assert");
var import_isNotNil = require("./util/isNotNil");
var import_Zone = require("./util/Zone");
var import_timestamp = require("./util/timestamp");
var import_sessionTranslation = require("./util/sessionTranslation");
var import_UUID = require("./types/UUID");
var import_QualifiedAddress = require("./types/QualifiedAddress");
var log = __toESM(require("./logging/log"));
var import_singleProtoJobQueue = require("./jobs/singleProtoJobQueue");
var Errors = __toESM(require("./types/errors"));
var import_SendMessage = __toESM(require("./textsecure/SendMessage"));
var import_durations = require("./util/durations");
const TIMESTAMP_THRESHOLD = 5 * 1e3;
const VerifiedStatus = {
  DEFAULT: 0,
  VERIFIED: 1,
  UNVERIFIED: 2
};
function validateVerifiedStatus(status) {
  if (status === VerifiedStatus.DEFAULT || status === VerifiedStatus.VERIFIED || status === VerifiedStatus.UNVERIFIED) {
    return true;
  }
  return false;
}
const identityKeySchema = import_zod.z.object({
  id: import_zod.z.string(),
  publicKey: import_zod.z.instanceof(Uint8Array),
  firstUse: import_zod.z.boolean(),
  timestamp: import_zod.z.number().refine((value) => value % 1 === 0 && value > 0),
  verified: import_zod.z.number().refine(validateVerifiedStatus),
  nonblockingApproval: import_zod.z.boolean()
});
function validateIdentityKey(attrs) {
  identityKeySchema.parse(attrs);
  return true;
}
const GLOBAL_ZONE = new import_Zone.Zone("GLOBAL_ZONE");
async function _fillCaches(object, field, itemsPromise) {
  const items = await itemsPromise;
  const cache = /* @__PURE__ */ new Map();
  for (let i = 0, max = items.length; i < max; i += 1) {
    const fromDB = items[i];
    const { id } = fromDB;
    cache.set(id, {
      fromDB,
      hydrated: false
    });
  }
  log.info(`SignalProtocolStore: Finished caching ${field} data`);
  object[field] = cache;
}
function hydrateSession(session) {
  return import_libsignal_client.SessionRecord.deserialize(Buffer.from(session.record, "base64"));
}
function hydratePublicKey(identityKey) {
  return import_libsignal_client.PublicKey.deserialize(Buffer.from(identityKey.publicKey));
}
function hydratePreKey(preKey) {
  const publicKey = import_libsignal_client.PublicKey.deserialize(Buffer.from(preKey.publicKey));
  const privateKey = import_libsignal_client.PrivateKey.deserialize(Buffer.from(preKey.privateKey));
  return import_libsignal_client.PreKeyRecord.new(preKey.keyId, publicKey, privateKey);
}
function hydrateSignedPreKey(signedPreKey) {
  const createdAt = signedPreKey.created_at;
  const pubKey = import_libsignal_client.PublicKey.deserialize(Buffer.from(signedPreKey.publicKey));
  const privKey = import_libsignal_client.PrivateKey.deserialize(Buffer.from(signedPreKey.privateKey));
  const signature = Buffer.from([]);
  return import_libsignal_client.SignedPreKeyRecord.new(signedPreKey.keyId, createdAt, pubKey, privKey, signature);
}
function freezeSession(session) {
  return session.serialize().toString("base64");
}
function freezePublicKey(publicKey) {
  return publicKey.serialize();
}
function freezePreKey(preKey) {
  const keyPair = {
    pubKey: preKey.publicKey().serialize(),
    privKey: preKey.privateKey().serialize()
  };
  return keyPair;
}
function freezeSignedPreKey(signedPreKey) {
  const keyPair = {
    pubKey: signedPreKey.publicKey().serialize(),
    privKey: signedPreKey.privateKey().serialize()
  };
  return keyPair;
}
const EventsMixin = /* @__PURE__ */ __name(function EventsMixin2() {
  Object.assign(this, window.Backbone.Events);
}, "EventsMixin");
class SignalProtocolStore extends EventsMixin {
  constructor() {
    super(...arguments);
    this.VerifiedStatus = VerifiedStatus;
    this.ourIdentityKeys = /* @__PURE__ */ new Map();
    this.ourRegistrationIds = /* @__PURE__ */ new Map();
    this.senderKeyQueues = /* @__PURE__ */ new Map();
    this.sessionQueues = /* @__PURE__ */ new Map();
    this.currentZoneDepth = 0;
    this.zoneQueue = [];
    this.pendingSessions = /* @__PURE__ */ new Map();
    this.pendingSenderKeys = /* @__PURE__ */ new Map();
    this.pendingUnprocessed = /* @__PURE__ */ new Map();
  }
  async hydrateCaches() {
    await Promise.all([
      (async () => {
        this.ourIdentityKeys.clear();
        const map = await window.Signal.Data.getItemById("identityKeyMap");
        if (!map) {
          return;
        }
        for (const key of Object.keys(map.value)) {
          const { privKey, pubKey } = map.value[key];
          this.ourIdentityKeys.set(new import_UUID.UUID(key).toString(), {
            privKey,
            pubKey
          });
        }
      })(),
      (async () => {
        this.ourRegistrationIds.clear();
        const map = await window.Signal.Data.getItemById("registrationIdMap");
        if (!map) {
          return;
        }
        for (const key of Object.keys(map.value)) {
          this.ourRegistrationIds.set(new import_UUID.UUID(key).toString(), map.value[key]);
        }
      })(),
      _fillCaches(this, "identityKeys", window.Signal.Data.getAllIdentityKeys()),
      _fillCaches(this, "sessions", window.Signal.Data.getAllSessions()),
      _fillCaches(this, "preKeys", window.Signal.Data.getAllPreKeys()),
      _fillCaches(this, "senderKeys", window.Signal.Data.getAllSenderKeys()),
      _fillCaches(this, "signedPreKeys", window.Signal.Data.getAllSignedPreKeys())
    ]);
  }
  async getIdentityKeyPair(ourUuid) {
    return this.ourIdentityKeys.get(ourUuid.toString());
  }
  async getLocalRegistrationId(ourUuid) {
    return this.ourRegistrationIds.get(ourUuid.toString());
  }
  async loadPreKey(ourUuid, keyId) {
    if (!this.preKeys) {
      throw new Error("loadPreKey: this.preKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    const entry = this.preKeys.get(id);
    if (!entry) {
      log.error("Failed to fetch prekey:", id);
      return void 0;
    }
    if (entry.hydrated) {
      log.info("Successfully fetched prekey (cache hit):", id);
      return entry.item;
    }
    const item = hydratePreKey(entry.fromDB);
    this.preKeys.set(id, {
      hydrated: true,
      fromDB: entry.fromDB,
      item
    });
    log.info("Successfully fetched prekey (cache miss):", id);
    return item;
  }
  async storePreKey(ourUuid, keyId, keyPair) {
    if (!this.preKeys) {
      throw new Error("storePreKey: this.preKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    if (this.preKeys.has(id)) {
      throw new Error(`storePreKey: prekey ${id} already exists!`);
    }
    const fromDB = {
      id,
      keyId,
      ourUuid: ourUuid.toString(),
      publicKey: keyPair.pubKey,
      privateKey: keyPair.privKey
    };
    await window.Signal.Data.createOrUpdatePreKey(fromDB);
    this.preKeys.set(id, {
      hydrated: false,
      fromDB
    });
  }
  async removePreKey(ourUuid, keyId) {
    if (!this.preKeys) {
      throw new Error("removePreKey: this.preKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    try {
      this.trigger("removePreKey", ourUuid);
    } catch (error) {
      log.error("removePreKey error triggering removePreKey:", error && error.stack ? error.stack : error);
    }
    this.preKeys.delete(id);
    await window.Signal.Data.removePreKeyById(id);
  }
  async clearPreKeyStore() {
    if (this.preKeys) {
      this.preKeys.clear();
    }
    await window.Signal.Data.removeAllPreKeys();
  }
  async loadSignedPreKey(ourUuid, keyId) {
    if (!this.signedPreKeys) {
      throw new Error("loadSignedPreKey: this.signedPreKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    const entry = this.signedPreKeys.get(id);
    if (!entry) {
      log.error("Failed to fetch signed prekey:", id);
      return void 0;
    }
    if (entry.hydrated) {
      log.info("Successfully fetched signed prekey (cache hit):", id);
      return entry.item;
    }
    const item = hydrateSignedPreKey(entry.fromDB);
    this.signedPreKeys.set(id, {
      hydrated: true,
      item,
      fromDB: entry.fromDB
    });
    log.info("Successfully fetched signed prekey (cache miss):", id);
    return item;
  }
  async loadSignedPreKeys(ourUuid) {
    if (!this.signedPreKeys) {
      throw new Error("loadSignedPreKeys: this.signedPreKeys not yet cached!");
    }
    if (arguments.length > 1) {
      throw new Error("loadSignedPreKeys takes one argument");
    }
    const entries = Array.from(this.signedPreKeys.values());
    return entries.filter(({ fromDB }) => fromDB.ourUuid === ourUuid.toString()).map((entry) => {
      const preKey = entry.fromDB;
      return {
        pubKey: preKey.publicKey,
        privKey: preKey.privateKey,
        created_at: preKey.created_at,
        keyId: preKey.keyId,
        confirmed: preKey.confirmed
      };
    });
  }
  async storeSignedPreKey(ourUuid, keyId, keyPair, confirmed, createdAt = Date.now()) {
    if (!this.signedPreKeys) {
      throw new Error("storeSignedPreKey: this.signedPreKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    const fromDB = {
      id,
      ourUuid: ourUuid.toString(),
      keyId,
      publicKey: keyPair.pubKey,
      privateKey: keyPair.privKey,
      created_at: createdAt,
      confirmed: Boolean(confirmed)
    };
    await window.Signal.Data.createOrUpdateSignedPreKey(fromDB);
    this.signedPreKeys.set(id, {
      hydrated: false,
      fromDB
    });
  }
  async removeSignedPreKey(ourUuid, keyId) {
    if (!this.signedPreKeys) {
      throw new Error("removeSignedPreKey: this.signedPreKeys not yet cached!");
    }
    const id = `${ourUuid.toString()}:${keyId}`;
    this.signedPreKeys.delete(id);
    await window.Signal.Data.removeSignedPreKeyById(id);
  }
  async clearSignedPreKeysStore() {
    if (this.signedPreKeys) {
      this.signedPreKeys.clear();
    }
    await window.Signal.Data.removeAllSignedPreKeys();
  }
  async enqueueSenderKeyJob(qualifiedAddress, task, zone = GLOBAL_ZONE) {
    return this.withZone(zone, "enqueueSenderKeyJob", async () => {
      const queue = this._getSenderKeyQueue(qualifiedAddress);
      return queue.add(task);
    });
  }
  _createSenderKeyQueue() {
    return new import_p_queue.default({
      concurrency: 1,
      timeout: import_durations.MINUTE * 30,
      throwOnTimeout: true
    });
  }
  _getSenderKeyQueue(senderId) {
    const cachedQueue = this.senderKeyQueues.get(senderId.toString());
    if (cachedQueue) {
      return cachedQueue;
    }
    const freshQueue = this._createSenderKeyQueue();
    this.senderKeyQueues.set(senderId.toString(), freshQueue);
    return freshQueue;
  }
  getSenderKeyId(senderKeyId, distributionId) {
    return `${senderKeyId.toString()}--${distributionId}`;
  }
  async saveSenderKey(qualifiedAddress, distributionId, record, { zone = GLOBAL_ZONE } = {}) {
    await this.withZone(zone, "saveSenderKey", async () => {
      if (!this.senderKeys) {
        throw new Error("saveSenderKey: this.senderKeys not yet cached!");
      }
      const senderId = qualifiedAddress.toString();
      try {
        const id = this.getSenderKeyId(qualifiedAddress, distributionId);
        const fromDB = {
          id,
          senderId,
          distributionId,
          data: record.serialize(),
          lastUpdatedDate: Date.now()
        };
        this.pendingSenderKeys.set(id, {
          hydrated: true,
          fromDB,
          item: record
        });
        if (!zone.supportsPendingSenderKeys()) {
          await this.commitZoneChanges("saveSenderKey");
        }
      } catch (error) {
        const errorString = error && error.stack ? error.stack : error;
        log.error(`saveSenderKey: failed to save senderKey ${senderId}/${distributionId}: ${errorString}`);
      }
    });
  }
  async getSenderKey(qualifiedAddress, distributionId, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "getSenderKey", async () => {
      if (!this.senderKeys) {
        throw new Error("getSenderKey: this.senderKeys not yet cached!");
      }
      const senderId = qualifiedAddress.toString();
      try {
        const id = this.getSenderKeyId(qualifiedAddress, distributionId);
        const map = this.pendingSenderKeys.has(id) ? this.pendingSenderKeys : this.senderKeys;
        const entry = map.get(id);
        if (!entry) {
          log.error("Failed to fetch sender key:", id);
          return void 0;
        }
        if (entry.hydrated) {
          log.info("Successfully fetched sender key (cache hit):", id);
          return entry.item;
        }
        const item = import_libsignal_client.SenderKeyRecord.deserialize(Buffer.from(entry.fromDB.data));
        this.senderKeys.set(id, {
          hydrated: true,
          item,
          fromDB: entry.fromDB
        });
        log.info("Successfully fetched sender key(cache miss):", id);
        return item;
      } catch (error) {
        const errorString = error && error.stack ? error.stack : error;
        log.error(`getSenderKey: failed to load sender key ${senderId}/${distributionId}: ${errorString}`);
        return void 0;
      }
    });
  }
  async removeSenderKey(qualifiedAddress, distributionId) {
    if (!this.senderKeys) {
      throw new Error("getSenderKey: this.senderKeys not yet cached!");
    }
    const senderId = qualifiedAddress.toString();
    try {
      const id = this.getSenderKeyId(qualifiedAddress, distributionId);
      await window.Signal.Data.removeSenderKeyById(id);
      this.senderKeys.delete(id);
    } catch (error) {
      const errorString = error && error.stack ? error.stack : error;
      log.error(`removeSenderKey: failed to remove senderKey ${senderId}/${distributionId}: ${errorString}`);
    }
  }
  async removeAllSenderKeys() {
    return this.withZone(GLOBAL_ZONE, "removeAllSenderKeys", async () => {
      if (this.senderKeys) {
        this.senderKeys.clear();
      }
      if (this.pendingSenderKeys) {
        this.pendingSenderKeys.clear();
      }
      await window.Signal.Data.removeAllSenderKeys();
    });
  }
  async enqueueSessionJob(qualifiedAddress, task, zone = GLOBAL_ZONE) {
    return this.withZone(zone, "enqueueSessionJob", async () => {
      const queue = this._getSessionQueue(qualifiedAddress);
      return queue.add(task);
    });
  }
  _createSessionQueue() {
    return new import_p_queue.default({
      concurrency: 1,
      timeout: import_durations.MINUTE * 30,
      throwOnTimeout: true
    });
  }
  _getSessionQueue(id) {
    const cachedQueue = this.sessionQueues.get(id.toString());
    if (cachedQueue) {
      return cachedQueue;
    }
    const freshQueue = this._createSessionQueue();
    this.sessionQueues.set(id.toString(), freshQueue);
    return freshQueue;
  }
  async withZone(zone, name, body) {
    const debugName = `withZone(${zone.name}:${name})`;
    if (this.currentZone && this.currentZone !== zone) {
      const start = Date.now();
      log.info(`${debugName}: locked by ${this.currentZone.name}, waiting`);
      return new Promise((resolve, reject) => {
        const callback = /* @__PURE__ */ __name(async () => {
          const duration = Date.now() - start;
          log.info(`${debugName}: unlocked after ${duration}ms`);
          try {
            resolve(await this.withZone(zone, name, body));
          } catch (error) {
            reject(error);
          }
        }, "callback");
        this.zoneQueue.push({ zone, callback });
      });
    }
    this.enterZone(zone, name);
    let result;
    try {
      result = await body();
    } catch (error) {
      if (this.isInTopLevelZone()) {
        await this.revertZoneChanges(name, error);
      }
      this.leaveZone(zone);
      throw error;
    }
    if (this.isInTopLevelZone()) {
      await this.commitZoneChanges(name);
    }
    this.leaveZone(zone);
    return result;
  }
  async commitZoneChanges(name) {
    const { pendingSenderKeys, pendingSessions, pendingUnprocessed } = this;
    if (pendingSenderKeys.size === 0 && pendingSessions.size === 0 && pendingUnprocessed.size === 0) {
      return;
    }
    log.info(`commitZoneChanges(${name}): pending sender keys ${pendingSenderKeys.size}, pending sessions ${pendingSessions.size}, pending unprocessed ${pendingUnprocessed.size}`);
    this.pendingSenderKeys = /* @__PURE__ */ new Map();
    this.pendingSessions = /* @__PURE__ */ new Map();
    this.pendingUnprocessed = /* @__PURE__ */ new Map();
    await window.Signal.Data.commitDecryptResult({
      senderKeys: Array.from(pendingSenderKeys.values()).map(({ fromDB }) => fromDB),
      sessions: Array.from(pendingSessions.values()).map(({ fromDB }) => fromDB),
      unprocessed: Array.from(pendingUnprocessed.values())
    });
    const { sessions } = this;
    (0, import_assert.assert)(sessions !== void 0, "Can't commit unhydrated session storage");
    pendingSessions.forEach((value, key) => {
      sessions.set(key, value);
    });
    const { senderKeys } = this;
    (0, import_assert.assert)(senderKeys !== void 0, "Can't commit unhydrated sender key storage");
    pendingSenderKeys.forEach((value, key) => {
      senderKeys.set(key, value);
    });
  }
  async revertZoneChanges(name, error) {
    log.info(`revertZoneChanges(${name}): pending sender keys size ${this.pendingSenderKeys.size}, pending sessions size ${this.pendingSessions.size}, pending unprocessed size ${this.pendingUnprocessed.size}`, error && error.stack);
    this.pendingSenderKeys.clear();
    this.pendingSessions.clear();
    this.pendingUnprocessed.clear();
  }
  isInTopLevelZone() {
    return this.currentZoneDepth === 1;
  }
  enterZone(zone, name) {
    this.currentZoneDepth += 1;
    if (this.currentZoneDepth === 1) {
      (0, import_assert.assert)(this.currentZone === void 0, "Should not be in the zone");
      this.currentZone = zone;
      if (zone !== GLOBAL_ZONE) {
        log.info(`SignalProtocolStore.enterZone(${zone.name}:${name})`);
      }
    }
  }
  leaveZone(zone) {
    (0, import_assert.assert)(this.currentZone === zone, "Should be in the correct zone");
    this.currentZoneDepth -= 1;
    (0, import_assert.assert)(this.currentZoneDepth >= 0, "Unmatched number of leaveZone calls");
    if (this.currentZoneDepth !== 0) {
      return;
    }
    if (zone !== GLOBAL_ZONE) {
      log.info(`SignalProtocolStore.leaveZone(${zone.name})`);
    }
    this.currentZone = void 0;
    const next = this.zoneQueue.shift();
    if (!next) {
      return;
    }
    const toEnter = [next];
    while (this.zoneQueue[0]?.zone === next.zone) {
      const elem = this.zoneQueue.shift();
      (0, import_assert.assert)(elem, "Zone element should be present");
      toEnter.push(elem);
    }
    log.info(`SignalProtocolStore: running blocked ${toEnter.length} jobs in zone ${next.zone.name}`);
    for (const { callback } of toEnter) {
      callback();
    }
  }
  async loadSession(qualifiedAddress, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "loadSession", async () => {
      if (!this.sessions) {
        throw new Error("loadSession: this.sessions not yet cached!");
      }
      if (qualifiedAddress === null || qualifiedAddress === void 0) {
        throw new Error("loadSession: qualifiedAddress was undefined/null");
      }
      const id = qualifiedAddress.toString();
      try {
        const map = this.pendingSessions.has(id) ? this.pendingSessions : this.sessions;
        const entry = map.get(id);
        if (!entry) {
          return void 0;
        }
        if (entry.hydrated) {
          return entry.item;
        }
        return await this._maybeMigrateSession(entry.fromDB, { zone });
      } catch (error) {
        const errorString = error && error.stack ? error.stack : error;
        log.error(`loadSession: failed to load session ${id}: ${errorString}`);
        return void 0;
      }
    });
  }
  async loadSessions(qualifiedAddresses, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "loadSessions", async () => {
      const sessions = await Promise.all(qualifiedAddresses.map(async (address) => this.loadSession(address, { zone })));
      return sessions.filter(import_isNotNil.isNotNil);
    });
  }
  async _maybeMigrateSession(session, { zone = GLOBAL_ZONE } = {}) {
    if (!this.sessions) {
      throw new Error("_maybeMigrateSession: this.sessions not yet cached!");
    }
    if (session.version === 2) {
      const item = hydrateSession(session);
      const map = this.pendingSessions.has(session.id) ? this.pendingSessions : this.sessions;
      map.set(session.id, {
        hydrated: true,
        item,
        fromDB: session
      });
      return item;
    }
    if (session.version !== void 0) {
      throw new Error("_maybeMigrateSession: Unknown session version type!");
    }
    const ourUuid = new import_UUID.UUID(session.ourUuid);
    const keyPair = await this.getIdentityKeyPair(ourUuid);
    if (!keyPair) {
      throw new Error("_maybeMigrateSession: No identity key for ourself!");
    }
    const localRegistrationId = await this.getLocalRegistrationId(ourUuid);
    if (!(0, import_lodash.isNumber)(localRegistrationId)) {
      throw new Error("_maybeMigrateSession: No registration id for ourself!");
    }
    const localUserData = {
      identityKeyPublic: keyPair.pubKey,
      registrationId: localRegistrationId
    };
    log.info(`_maybeMigrateSession: Migrating session with id ${session.id}`);
    const sessionProto = (0, import_sessionTranslation.sessionRecordToProtobuf)(JSON.parse(session.record), localUserData);
    const record = import_libsignal_client.SessionRecord.deserialize(Buffer.from((0, import_sessionTranslation.sessionStructureToBytes)(sessionProto)));
    await this.storeSession(import_QualifiedAddress.QualifiedAddress.parse(session.id), record, {
      zone
    });
    return record;
  }
  async storeSession(qualifiedAddress, record, { zone = GLOBAL_ZONE } = {}) {
    await this.withZone(zone, "storeSession", async () => {
      if (!this.sessions) {
        throw new Error("storeSession: this.sessions not yet cached!");
      }
      if (qualifiedAddress === null || qualifiedAddress === void 0) {
        throw new Error("storeSession: qualifiedAddress was undefined/null");
      }
      const { uuid, deviceId } = qualifiedAddress;
      const conversation = window.ConversationController.lookupOrCreate({
        uuid: uuid.toString()
      });
      (0, import_assert.strictAssert)(conversation !== void 0, "storeSession: Ensure contact ids failed");
      const id = qualifiedAddress.toString();
      try {
        const fromDB = {
          id,
          version: 2,
          ourUuid: qualifiedAddress.ourUuid.toString(),
          conversationId: conversation.id,
          uuid: uuid.toString(),
          deviceId,
          record: record.serialize().toString("base64")
        };
        const newSession = {
          hydrated: true,
          fromDB,
          item: record
        };
        (0, import_assert.assert)(this.currentZone, "Must run in the zone");
        this.pendingSessions.set(id, newSession);
        if (!zone.supportsPendingSessions()) {
          await this.commitZoneChanges("storeSession");
        }
      } catch (error) {
        const errorString = error && error.stack ? error.stack : error;
        log.error(`storeSession: Save failed for ${id}: ${errorString}`);
        throw error;
      }
    });
  }
  async getOpenDevices(ourUuid, identifiers, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "getOpenDevices", async () => {
      if (!this.sessions) {
        throw new Error("getOpenDevices: this.sessions not yet cached!");
      }
      if (identifiers.length === 0) {
        return { devices: [], emptyIdentifiers: [] };
      }
      try {
        const uuidsOrIdentifiers = new Set(identifiers.map((identifier) => import_UUID.UUID.lookup(identifier)?.toString() || identifier));
        const allSessions = this._getAllSessions();
        const entries = allSessions.filter(({ fromDB }) => fromDB.ourUuid === ourUuid.toString() && uuidsOrIdentifiers.has(fromDB.uuid));
        const openEntries = await Promise.all(entries.map(async (entry) => {
          if (entry.hydrated) {
            const record2 = entry.item;
            if (record2.hasCurrentState()) {
              return { record: record2, entry };
            }
            return void 0;
          }
          const record = await this._maybeMigrateSession(entry.fromDB, {
            zone
          });
          if (record.hasCurrentState()) {
            return { record, entry };
          }
          return void 0;
        }));
        const devices = openEntries.map((item) => {
          if (!item) {
            return void 0;
          }
          const { entry, record } = item;
          const { uuid } = entry.fromDB;
          uuidsOrIdentifiers.delete(uuid);
          const id = entry.fromDB.deviceId;
          const registrationId = record.remoteRegistrationId();
          return {
            identifier: uuid,
            id,
            registrationId
          };
        }).filter(import_isNotNil.isNotNil);
        const emptyIdentifiers = Array.from(uuidsOrIdentifiers.values());
        return {
          devices,
          emptyIdentifiers
        };
      } catch (error) {
        log.error("getOpenDevices: Failed to get devices", error && error.stack ? error.stack : error);
        throw error;
      }
    });
  }
  async getDeviceIds({
    ourUuid,
    identifier
  }) {
    const { devices } = await this.getOpenDevices(ourUuid, [identifier]);
    return devices.map((device) => device.id);
  }
  async removeSession(qualifiedAddress) {
    return this.withZone(GLOBAL_ZONE, "removeSession", async () => {
      if (!this.sessions) {
        throw new Error("removeSession: this.sessions not yet cached!");
      }
      const id = qualifiedAddress.toString();
      log.info("removeSession: deleting session for", id);
      try {
        await window.Signal.Data.removeSessionById(id);
        this.sessions.delete(id);
        this.pendingSessions.delete(id);
      } catch (e) {
        log.error(`removeSession: Failed to delete session for ${id}`);
      }
    });
  }
  async removeAllSessions(identifier) {
    return this.withZone(GLOBAL_ZONE, "removeAllSessions", async () => {
      if (!this.sessions) {
        throw new Error("removeAllSessions: this.sessions not yet cached!");
      }
      if (identifier === null || identifier === void 0) {
        throw new Error("removeAllSessions: identifier was undefined/null");
      }
      log.info("removeAllSessions: deleting sessions for", identifier);
      const id = window.ConversationController.getConversationId(identifier);
      (0, import_assert.strictAssert)(id, `removeAllSessions: Conversation not found: ${identifier}`);
      const entries = Array.from(this.sessions.values());
      for (let i = 0, max = entries.length; i < max; i += 1) {
        const entry = entries[i];
        if (entry.fromDB.conversationId === id) {
          this.sessions.delete(entry.fromDB.id);
          this.pendingSessions.delete(entry.fromDB.id);
        }
      }
      await window.Signal.Data.removeSessionsByConversation(id);
    });
  }
  async _archiveSession(entry, zone) {
    if (!entry) {
      return;
    }
    const addr = import_QualifiedAddress.QualifiedAddress.parse(entry.fromDB.id);
    await this.enqueueSessionJob(addr, async () => {
      const item = entry.hydrated ? entry.item : await this._maybeMigrateSession(entry.fromDB, { zone });
      if (!item.hasCurrentState()) {
        return;
      }
      item.archiveCurrentState();
      await this.storeSession(addr, item, { zone });
    }, zone);
  }
  async archiveSession(qualifiedAddress) {
    return this.withZone(GLOBAL_ZONE, "archiveSession", async () => {
      if (!this.sessions) {
        throw new Error("archiveSession: this.sessions not yet cached!");
      }
      const id = qualifiedAddress.toString();
      log.info(`archiveSession: session for ${id}`);
      const entry = this.pendingSessions.get(id) || this.sessions.get(id);
      await this._archiveSession(entry);
    });
  }
  async archiveSiblingSessions(encodedAddress, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "archiveSiblingSessions", async () => {
      if (!this.sessions) {
        throw new Error("archiveSiblingSessions: this.sessions not yet cached!");
      }
      log.info("archiveSiblingSessions: archiving sibling sessions for", encodedAddress.toString());
      const { uuid, deviceId } = encodedAddress;
      const allEntries = this._getAllSessions();
      const entries = allEntries.filter((entry) => entry.fromDB.uuid === uuid.toString() && entry.fromDB.deviceId !== deviceId);
      await Promise.all(entries.map(async (entry) => {
        await this._archiveSession(entry, zone);
      }));
    });
  }
  async archiveAllSessions(uuid) {
    return this.withZone(GLOBAL_ZONE, "archiveAllSessions", async () => {
      if (!this.sessions) {
        throw new Error("archiveAllSessions: this.sessions not yet cached!");
      }
      log.info("archiveAllSessions: archiving all sessions for", uuid.toString());
      const allEntries = this._getAllSessions();
      const entries = allEntries.filter((entry) => entry.fromDB.uuid === uuid.toString());
      await Promise.all(entries.map(async (entry) => {
        await this._archiveSession(entry);
      }));
    });
  }
  async clearSessionStore() {
    return this.withZone(GLOBAL_ZONE, "clearSessionStore", async () => {
      if (this.sessions) {
        this.sessions.clear();
      }
      this.pendingSessions.clear();
      await window.Signal.Data.removeAllSessions();
    });
  }
  async lightSessionReset(qualifiedAddress) {
    const id = qualifiedAddress.toString();
    const sessionResets = window.storage.get("sessionResets", {});
    const lastReset = sessionResets[id];
    const ONE_HOUR = 60 * 60 * 1e3;
    if (lastReset && (0, import_timestamp.isMoreRecentThan)(lastReset, ONE_HOUR)) {
      log.warn(`lightSessionReset/${id}: Skipping session reset, last reset at ${lastReset}`);
      return;
    }
    sessionResets[id] = Date.now();
    window.storage.put("sessionResets", sessionResets);
    try {
      const { uuid } = qualifiedAddress;
      const conversation = window.ConversationController.lookupOrCreate({
        uuid: uuid.toString()
      });
      (0, import_assert.assert)(conversation, `lightSessionReset/${id}: missing conversation`);
      log.warn(`lightSessionReset/${id}: Resetting session`);
      await this.archiveSession(qualifiedAddress);
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getNullMessage({
        uuid: uuid.toString()
      }));
    } catch (error) {
      delete sessionResets[id];
      window.storage.put("sessionResets", sessionResets);
      log.error(`lightSessionReset/${id}: Encountered error`, Errors.toLogFormat(error));
    }
  }
  getIdentityRecord(uuid) {
    if (!this.identityKeys) {
      throw new Error("getIdentityRecord: this.identityKeys not yet cached!");
    }
    const id = uuid.toString();
    try {
      const entry = this.identityKeys.get(id);
      if (!entry) {
        return void 0;
      }
      return entry.fromDB;
    } catch (e) {
      log.error(`getIdentityRecord: Failed to get identity record for identifier ${id}`);
      return void 0;
    }
  }
  async getOrMigrateIdentityRecord(uuid) {
    if (!this.identityKeys) {
      throw new Error("getOrMigrateIdentityRecord: this.identityKeys not yet cached!");
    }
    const result = this.getIdentityRecord(uuid);
    if (result) {
      return result;
    }
    const newId = uuid.toString();
    const conversation = window.ConversationController.get(newId);
    if (!conversation) {
      return void 0;
    }
    const conversationId = conversation.id;
    const record = this.identityKeys.get(`conversation:${conversationId}`);
    if (!record) {
      return void 0;
    }
    const newRecord = {
      ...record.fromDB,
      id: newId
    };
    log.info(`SignalProtocolStore: migrating identity key from ${record.fromDB.id} to ${newRecord.id}`);
    await this._saveIdentityKey(newRecord);
    this.identityKeys.delete(record.fromDB.id);
    await window.Signal.Data.removeIdentityKeyById(record.fromDB.id);
    return newRecord;
  }
  async isTrustedIdentity(encodedAddress, publicKey, direction) {
    if (!this.identityKeys) {
      throw new Error("isTrustedIdentity: this.identityKeys not yet cached!");
    }
    if (encodedAddress === null || encodedAddress === void 0) {
      throw new Error("isTrustedIdentity: encodedAddress was undefined/null");
    }
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const isOurIdentifier = encodedAddress.uuid.isEqual(ourUuid);
    const identityRecord = await this.getOrMigrateIdentityRecord(encodedAddress.uuid);
    if (isOurIdentifier) {
      if (identityRecord && identityRecord.publicKey) {
        return (0, import_Crypto.constantTimeEqual)(identityRecord.publicKey, publicKey);
      }
      log.warn("isTrustedIdentity: No local record for our own identifier. Returning true.");
      return true;
    }
    switch (direction) {
      case import_libsignal_client.Direction.Sending:
        return this.isTrustedForSending(publicKey, identityRecord);
      case import_libsignal_client.Direction.Receiving:
        return true;
      default:
        throw new Error(`isTrustedIdentity: Unknown direction: ${direction}`);
    }
  }
  isTrustedForSending(publicKey, identityRecord) {
    if (!identityRecord) {
      log.info("isTrustedForSending: No previous record, returning true...");
      return true;
    }
    const existing = identityRecord.publicKey;
    if (!existing) {
      log.info("isTrustedForSending: Nothing here, returning true...");
      return true;
    }
    if (!(0, import_Crypto.constantTimeEqual)(existing, publicKey)) {
      log.info("isTrustedForSending: Identity keys don't match...");
      return false;
    }
    if (identityRecord.verified === VerifiedStatus.UNVERIFIED) {
      log.error("isTrustedIdentity: Needs unverified approval!");
      return false;
    }
    if (this.isNonBlockingApprovalRequired(identityRecord)) {
      log.error("isTrustedForSending: Needs non-blocking approval!");
      return false;
    }
    return true;
  }
  async loadIdentityKey(uuid) {
    if (uuid === null || uuid === void 0) {
      throw new Error("loadIdentityKey: uuid was undefined/null");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    if (identityRecord) {
      return identityRecord.publicKey;
    }
    return void 0;
  }
  async _saveIdentityKey(data) {
    if (!this.identityKeys) {
      throw new Error("_saveIdentityKey: this.identityKeys not yet cached!");
    }
    const { id } = data;
    await window.Signal.Data.createOrUpdateIdentityKey(data);
    this.identityKeys.set(id, {
      hydrated: false,
      fromDB: data
    });
  }
  async saveIdentity(encodedAddress, publicKey, nonblockingApproval = false, { zone } = {}) {
    if (!this.identityKeys) {
      throw new Error("saveIdentity: this.identityKeys not yet cached!");
    }
    if (encodedAddress === null || encodedAddress === void 0) {
      throw new Error("saveIdentity: encodedAddress was undefined/null");
    }
    if (!(publicKey instanceof Uint8Array)) {
      publicKey = Bytes.fromBinary(publicKey);
    }
    if (typeof nonblockingApproval !== "boolean") {
      nonblockingApproval = false;
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(encodedAddress.uuid);
    const id = encodedAddress.uuid.toString();
    if (!identityRecord || !identityRecord.publicKey) {
      log.info("saveIdentity: Saving new identity...");
      await this._saveIdentityKey({
        id,
        publicKey,
        firstUse: true,
        timestamp: Date.now(),
        verified: VerifiedStatus.DEFAULT,
        nonblockingApproval
      });
      return false;
    }
    const oldpublicKey = identityRecord.publicKey;
    if (!(0, import_Crypto.constantTimeEqual)(oldpublicKey, publicKey)) {
      log.info("saveIdentity: Replacing existing identity...");
      const previousStatus = identityRecord.verified;
      let verifiedStatus;
      if (previousStatus === VerifiedStatus.VERIFIED || previousStatus === VerifiedStatus.UNVERIFIED) {
        verifiedStatus = VerifiedStatus.UNVERIFIED;
      } else {
        verifiedStatus = VerifiedStatus.DEFAULT;
      }
      await this._saveIdentityKey({
        id,
        publicKey,
        firstUse: false,
        timestamp: Date.now(),
        verified: verifiedStatus,
        nonblockingApproval
      });
      try {
        this.trigger("keychange", encodedAddress.uuid);
      } catch (error) {
        log.error("saveIdentity: error triggering keychange:", error && error.stack ? error.stack : error);
      }
      await this.archiveSiblingSessions(encodedAddress, {
        zone
      });
      return true;
    }
    if (this.isNonBlockingApprovalRequired(identityRecord)) {
      log.info("saveIdentity: Setting approval status...");
      identityRecord.nonblockingApproval = nonblockingApproval;
      await this._saveIdentityKey(identityRecord);
      return false;
    }
    return false;
  }
  isNonBlockingApprovalRequired(identityRecord) {
    return !identityRecord.firstUse && (0, import_timestamp.isMoreRecentThan)(identityRecord.timestamp, TIMESTAMP_THRESHOLD) && !identityRecord.nonblockingApproval;
  }
  async saveIdentityWithAttributes(uuid, attributes) {
    if (uuid === null || uuid === void 0) {
      throw new Error("saveIdentityWithAttributes: uuid was undefined/null");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    const id = uuid.toString();
    const uuidKind = window.textsecure.storage.user.getOurUuidKind(uuid);
    if (uuidKind !== import_UUID.UUIDKind.PNI) {
      window.ConversationController.getOrCreate(id, "private");
    }
    const updates = {
      ...identityRecord,
      ...attributes,
      id
    };
    if (validateIdentityKey(updates)) {
      await this._saveIdentityKey(updates);
    }
  }
  async setApproval(uuid, nonblockingApproval) {
    if (uuid === null || uuid === void 0) {
      throw new Error("setApproval: uuid was undefined/null");
    }
    if (typeof nonblockingApproval !== "boolean") {
      throw new Error("setApproval: Invalid approval status");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    if (!identityRecord) {
      throw new Error(`setApproval: No identity record for ${uuid}`);
    }
    identityRecord.nonblockingApproval = nonblockingApproval;
    await this._saveIdentityKey(identityRecord);
  }
  async setVerified(uuid, verifiedStatus, publicKey) {
    if (uuid === null || uuid === void 0) {
      throw new Error("setVerified: uuid was undefined/null");
    }
    if (!validateVerifiedStatus(verifiedStatus)) {
      throw new Error("setVerified: Invalid verified status");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    if (!identityRecord) {
      throw new Error(`setVerified: No identity record for ${uuid.toString()}`);
    }
    if (!publicKey || (0, import_Crypto.constantTimeEqual)(identityRecord.publicKey, publicKey)) {
      identityRecord.verified = verifiedStatus;
      if (validateIdentityKey(identityRecord)) {
        await this._saveIdentityKey(identityRecord);
      }
    } else {
      log.info("setVerified: No identity record for specified publicKey");
    }
  }
  async getVerified(uuid) {
    if (uuid === null || uuid === void 0) {
      throw new Error("getVerified: uuid was undefined/null");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    if (!identityRecord) {
      throw new Error(`getVerified: No identity record for ${uuid}`);
    }
    const verifiedStatus = identityRecord.verified;
    if (validateVerifiedStatus(verifiedStatus)) {
      return verifiedStatus;
    }
    return VerifiedStatus.DEFAULT;
  }
  async processVerifiedMessage(uuid, verifiedStatus, publicKey) {
    if (uuid === null || uuid === void 0) {
      throw new Error("processVerifiedMessage: uuid was undefined/null");
    }
    if (!validateVerifiedStatus(verifiedStatus)) {
      throw new Error("processVerifiedMessage: Invalid verified status");
    }
    if (publicKey !== void 0 && !(publicKey instanceof Uint8Array)) {
      throw new Error("processVerifiedMessage: Invalid public key");
    }
    const identityRecord = await this.getOrMigrateIdentityRecord(uuid);
    let isEqual = false;
    if (identityRecord && publicKey) {
      isEqual = (0, import_Crypto.constantTimeEqual)(publicKey, identityRecord.publicKey);
    }
    if (isEqual || !publicKey) {
      await this.setVerified(uuid, verifiedStatus, publicKey);
      return false;
    }
    await this.saveIdentityWithAttributes(uuid, {
      publicKey,
      verified: verifiedStatus,
      firstUse: false,
      timestamp: Date.now(),
      nonblockingApproval: verifiedStatus === VerifiedStatus.VERIFIED
    });
    if (identityRecord) {
      try {
        this.trigger("keychange", uuid);
      } catch (error) {
        log.error("processVerifiedMessage error triggering keychange:", Errors.toLogFormat(error));
      }
      return true;
    }
    return false;
  }
  isUntrusted(uuid) {
    if (uuid === null || uuid === void 0) {
      throw new Error("isUntrusted: uuid was undefined/null");
    }
    const identityRecord = this.getIdentityRecord(uuid);
    if (!identityRecord) {
      throw new Error(`isUntrusted: No identity record for ${uuid.toString()}`);
    }
    if ((0, import_timestamp.isMoreRecentThan)(identityRecord.timestamp, TIMESTAMP_THRESHOLD) && !identityRecord.nonblockingApproval && !identityRecord.firstUse) {
      return true;
    }
    return false;
  }
  async removeIdentityKey(uuid) {
    if (!this.identityKeys) {
      throw new Error("removeIdentityKey: this.identityKeys not yet cached!");
    }
    const id = uuid.toString();
    this.identityKeys.delete(id);
    await window.Signal.Data.removeIdentityKeyById(id);
    await this.removeAllSessions(id);
  }
  getUnprocessedCount() {
    return this.withZone(GLOBAL_ZONE, "getUnprocessedCount", async () => {
      return window.Signal.Data.getUnprocessedCount();
    });
  }
  getAllUnprocessedAndIncrementAttempts() {
    return this.withZone(GLOBAL_ZONE, "getAllUnprocessed", async () => {
      return window.Signal.Data.getAllUnprocessedAndIncrementAttempts();
    });
  }
  getUnprocessedById(id) {
    return this.withZone(GLOBAL_ZONE, "getUnprocessedById", async () => {
      return window.Signal.Data.getUnprocessedById(id);
    });
  }
  addUnprocessed(data, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "addUnprocessed", async () => {
      this.pendingUnprocessed.set(data.id, data);
      if (!zone.supportsPendingUnprocessed()) {
        await this.commitZoneChanges("addUnprocessed");
      }
    });
  }
  addMultipleUnprocessed(array, { zone = GLOBAL_ZONE } = {}) {
    return this.withZone(zone, "addMultipleUnprocessed", async () => {
      for (const elem of array) {
        this.pendingUnprocessed.set(elem.id, elem);
      }
      if (!zone.supportsPendingUnprocessed()) {
        await this.commitZoneChanges("addMultipleUnprocessed");
      }
    });
  }
  updateUnprocessedWithData(id, data) {
    return this.withZone(GLOBAL_ZONE, "updateUnprocessedWithData", async () => {
      await window.Signal.Data.updateUnprocessedWithData(id, data);
    });
  }
  updateUnprocessedsWithData(items) {
    return this.withZone(GLOBAL_ZONE, "updateUnprocessedsWithData", async () => {
      await window.Signal.Data.updateUnprocessedsWithData(items);
    });
  }
  removeUnprocessed(idOrArray) {
    return this.withZone(GLOBAL_ZONE, "removeUnprocessed", async () => {
      await window.Signal.Data.removeUnprocessed(idOrArray);
    });
  }
  removeAllUnprocessed() {
    return this.withZone(GLOBAL_ZONE, "removeAllUnprocessed", async () => {
      await window.Signal.Data.removeAllUnprocessed();
    });
  }
  async removeOurOldPni(oldPni) {
    const { storage } = window;
    log.info(`SignalProtocolStore.removeOurOldPni(${oldPni})`);
    this.ourIdentityKeys.delete(oldPni.toString());
    this.ourRegistrationIds.delete(oldPni.toString());
    const preKeyPrefix = `${oldPni.toString()}:`;
    if (this.preKeys) {
      for (const key of this.preKeys.keys()) {
        if (key.startsWith(preKeyPrefix)) {
          this.preKeys.delete(key);
        }
      }
    }
    if (this.signedPreKeys) {
      for (const key of this.signedPreKeys.keys()) {
        if (key.startsWith(preKeyPrefix)) {
          this.signedPreKeys.delete(key);
        }
      }
    }
    await Promise.all([
      storage.put("identityKeyMap", (0, import_lodash.omit)(storage.get("identityKeyMap") || {}, oldPni.toString())),
      storage.put("registrationIdMap", (0, import_lodash.omit)(storage.get("registrationIdMap") || {}, oldPni.toString())),
      window.Signal.Data.removePreKeysByUuid(oldPni.toString()),
      window.Signal.Data.removeSignedPreKeysByUuid(oldPni.toString())
    ]);
  }
  async updateOurPniKeyMaterial(pni, {
    identityKeyPair: identityBytes,
    signedPreKey: signedPreKeyBytes,
    registrationId
  }) {
    log.info(`SignalProtocolStore.updateOurPniKeyMaterial(${pni})`);
    const identityKeyPair = import_libsignal_client.IdentityKeyPair.deserialize(Buffer.from(identityBytes));
    const signedPreKey = import_libsignal_client.SignedPreKeyRecord.deserialize(Buffer.from(signedPreKeyBytes));
    const { storage } = window;
    const pniPublicKey = identityKeyPair.publicKey.serialize();
    const pniPrivateKey = identityKeyPair.privateKey.serialize();
    this.ourIdentityKeys.set(pni.toString(), {
      pubKey: pniPublicKey,
      privKey: pniPrivateKey
    });
    this.ourRegistrationIds.set(pni.toString(), registrationId);
    await Promise.all([
      storage.put("identityKeyMap", {
        ...storage.get("identityKeyMap") || {},
        [pni.toString()]: {
          pubKey: pniPublicKey,
          privKey: pniPrivateKey
        }
      }),
      storage.put("registrationIdMap", {
        ...storage.get("registrationIdMap") || {},
        [pni.toString()]: registrationId
      }),
      this.storeSignedPreKey(pni, signedPreKey.id(), {
        privKey: signedPreKey.privateKey().serialize(),
        pubKey: signedPreKey.publicKey().serialize()
      }, true, signedPreKey.timestamp())
    ]);
  }
  async removeAllData() {
    await window.Signal.Data.removeAll();
    await this.hydrateCaches();
    window.storage.reset();
    await window.storage.fetch();
    window.ConversationController.reset();
    await window.ConversationController.load();
  }
  async removeAllConfiguration(mode) {
    await window.Signal.Data.removeAllConfiguration(mode);
    await this.hydrateCaches();
    window.storage.reset();
    await window.storage.fetch();
  }
  _getAllSessions() {
    const union = /* @__PURE__ */ new Map();
    this.sessions?.forEach((value, key) => {
      union.set(key, value);
    });
    this.pendingSessions.forEach((value, key) => {
      union.set(key, value);
    });
    return Array.from(union.values());
  }
}
window.SignalProtocolStore = SignalProtocolStore;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GLOBAL_ZONE,
  SignalProtocolStore,
  freezePreKey,
  freezePublicKey,
  freezeSession,
  freezeSignedPreKey,
  hydratePreKey,
  hydratePublicKey,
  hydrateSession,
  hydrateSignedPreKey
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2lnbmFsUHJvdG9jb2xTdG9yZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTYtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5pbXBvcnQgeyBpc051bWJlciwgb21pdCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuaW1wb3J0IHtcbiAgRGlyZWN0aW9uLFxuICBJZGVudGl0eUtleVBhaXIsXG4gIFByZUtleVJlY29yZCxcbiAgUHJpdmF0ZUtleSxcbiAgUHVibGljS2V5LFxuICBTZW5kZXJLZXlSZWNvcmQsXG4gIFNlc3Npb25SZWNvcmQsXG4gIFNpZ25lZFByZUtleVJlY29yZCxcbn0gZnJvbSAnQHNpZ25hbGFwcC9saWJzaWduYWwtY2xpZW50JztcblxuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi9CeXRlcyc7XG5pbXBvcnQgeyBjb25zdGFudFRpbWVFcXVhbCB9IGZyb20gJy4vQ3J5cHRvJztcbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBpc05vdE5pbCB9IGZyb20gJy4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBab25lIH0gZnJvbSAnLi91dGlsL1pvbmUnO1xuaW1wb3J0IHsgaXNNb3JlUmVjZW50VGhhbiB9IGZyb20gJy4vdXRpbC90aW1lc3RhbXAnO1xuaW1wb3J0IHtcbiAgc2Vzc2lvblJlY29yZFRvUHJvdG9idWYsXG4gIHNlc3Npb25TdHJ1Y3R1cmVUb0J5dGVzLFxufSBmcm9tICcuL3V0aWwvc2Vzc2lvblRyYW5zbGF0aW9uJztcbmltcG9ydCB0eXBlIHtcbiAgRGV2aWNlVHlwZSxcbiAgSWRlbnRpdHlLZXlUeXBlLFxuICBJZGVudGl0eUtleUlkVHlwZSxcbiAgS2V5UGFpclR5cGUsXG4gIE91dGVyU2lnbmVkUHJla2V5VHlwZSxcbiAgUG5pS2V5TWF0ZXJpYWxUeXBlLFxuICBQcmVLZXlJZFR5cGUsXG4gIFByZUtleVR5cGUsXG4gIFNlbmRlcktleUlkVHlwZSxcbiAgU2VuZGVyS2V5VHlwZSxcbiAgU2Vzc2lvbklkVHlwZSxcbiAgU2Vzc2lvblJlc2V0c1R5cGUsXG4gIFNlc3Npb25UeXBlLFxuICBTaWduZWRQcmVLZXlJZFR5cGUsXG4gIFNpZ25lZFByZUtleVR5cGUsXG4gIFVucHJvY2Vzc2VkVHlwZSxcbiAgVW5wcm9jZXNzZWRVcGRhdGVUeXBlLFxufSBmcm9tICcuL3RleHRzZWN1cmUvVHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7IFJlbW92ZUFsbENvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3R5cGVzL1JlbW92ZUFsbENvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IEFkZHJlc3MgfSBmcm9tICcuL3R5cGVzL0FkZHJlc3MnO1xuaW1wb3J0IHR5cGUgeyBRdWFsaWZpZWRBZGRyZXNzU3RyaW5nVHlwZSB9IGZyb20gJy4vdHlwZXMvUXVhbGlmaWVkQWRkcmVzcyc7XG5pbXBvcnQgeyBRdWFsaWZpZWRBZGRyZXNzIH0gZnJvbSAnLi90eXBlcy9RdWFsaWZpZWRBZGRyZXNzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IHNpbmdsZVByb3RvSm9iUXVldWUgfSBmcm9tICcuL2pvYnMvc2luZ2xlUHJvdG9Kb2JRdWV1ZSc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IE1lc3NhZ2VTZW5kZXIgZnJvbSAnLi90ZXh0c2VjdXJlL1NlbmRNZXNzYWdlJztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4vdXRpbC9kdXJhdGlvbnMnO1xuXG5jb25zdCBUSU1FU1RBTVBfVEhSRVNIT0xEID0gNSAqIDEwMDA7IC8vIDUgc2Vjb25kc1xuXG5jb25zdCBWZXJpZmllZFN0YXR1cyA9IHtcbiAgREVGQVVMVDogMCxcbiAgVkVSSUZJRUQ6IDEsXG4gIFVOVkVSSUZJRUQ6IDIsXG59O1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVZlcmlmaWVkU3RhdHVzKHN0YXR1czogbnVtYmVyKTogYm9vbGVhbiB7XG4gIGlmIChcbiAgICBzdGF0dXMgPT09IFZlcmlmaWVkU3RhdHVzLkRFRkFVTFQgfHxcbiAgICBzdGF0dXMgPT09IFZlcmlmaWVkU3RhdHVzLlZFUklGSUVEIHx8XG4gICAgc3RhdHVzID09PSBWZXJpZmllZFN0YXR1cy5VTlZFUklGSUVEXG4gICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaWRlbnRpdHlLZXlTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICBwdWJsaWNLZXk6IHouaW5zdGFuY2VvZihVaW50OEFycmF5KSxcbiAgZmlyc3RVc2U6IHouYm9vbGVhbigpLFxuICB0aW1lc3RhbXA6IHoubnVtYmVyKCkucmVmaW5lKCh2YWx1ZTogbnVtYmVyKSA9PiB2YWx1ZSAlIDEgPT09IDAgJiYgdmFsdWUgPiAwKSxcbiAgdmVyaWZpZWQ6IHoubnVtYmVyKCkucmVmaW5lKHZhbGlkYXRlVmVyaWZpZWRTdGF0dXMpLFxuICBub25ibG9ja2luZ0FwcHJvdmFsOiB6LmJvb2xlYW4oKSxcbn0pO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUlkZW50aXR5S2V5KGF0dHJzOiB1bmtub3duKTogYXR0cnMgaXMgSWRlbnRpdHlLZXlUeXBlIHtcbiAgLy8gV2UnbGwgdGhyb3cgaWYgdGhpcyBkb2Vzbid0IG1hdGNoXG4gIGlkZW50aXR5S2V5U2NoZW1hLnBhcnNlKGF0dHJzKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbnR5cGUgSGFzSWRUeXBlPFQ+ID0ge1xuICBpZDogVDtcbn07XG50eXBlIENhY2hlRW50cnlUeXBlPERCVHlwZSwgSHlkcmF0ZWRUeXBlPiA9XG4gIHwge1xuICAgICAgaHlkcmF0ZWQ6IGZhbHNlO1xuICAgICAgZnJvbURCOiBEQlR5cGU7XG4gICAgfVxuICB8IHsgaHlkcmF0ZWQ6IHRydWU7IGZyb21EQjogREJUeXBlOyBpdGVtOiBIeWRyYXRlZFR5cGUgfTtcblxudHlwZSBNYXBGaWVsZHMgPVxuICB8ICdpZGVudGl0eUtleXMnXG4gIHwgJ3ByZUtleXMnXG4gIHwgJ3NlbmRlcktleXMnXG4gIHwgJ3Nlc3Npb25zJ1xuICB8ICdzaWduZWRQcmVLZXlzJztcblxuZXhwb3J0IHR5cGUgU2Vzc2lvblRyYW5zYWN0aW9uT3B0aW9ucyA9IHtcbiAgcmVhZG9ubHkgem9uZT86IFpvbmU7XG59O1xuXG5leHBvcnQgY29uc3QgR0xPQkFMX1pPTkUgPSBuZXcgWm9uZSgnR0xPQkFMX1pPTkUnKTtcblxuYXN5bmMgZnVuY3Rpb24gX2ZpbGxDYWNoZXM8SUQsIFQgZXh0ZW5kcyBIYXNJZFR5cGU8SUQ+LCBIeWRyYXRlZFR5cGU+KFxuICBvYmplY3Q6IFNpZ25hbFByb3RvY29sU3RvcmUsXG4gIGZpZWxkOiBNYXBGaWVsZHMsXG4gIGl0ZW1zUHJvbWlzZTogUHJvbWlzZTxBcnJheTxUPj5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBpdGVtcyA9IGF3YWl0IGl0ZW1zUHJvbWlzZTtcblxuICBjb25zdCBjYWNoZSA9IG5ldyBNYXA8SUQsIENhY2hlRW50cnlUeXBlPFQsIEh5ZHJhdGVkVHlwZT4+KCk7XG4gIGZvciAobGV0IGkgPSAwLCBtYXggPSBpdGVtcy5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGZyb21EQiA9IGl0ZW1zW2ldO1xuICAgIGNvbnN0IHsgaWQgfSA9IGZyb21EQjtcblxuICAgIGNhY2hlLnNldChpZCwge1xuICAgICAgZnJvbURCLFxuICAgICAgaHlkcmF0ZWQ6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgbG9nLmluZm8oYFNpZ25hbFByb3RvY29sU3RvcmU6IEZpbmlzaGVkIGNhY2hpbmcgJHtmaWVsZH0gZGF0YWApO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ24sIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgb2JqZWN0W2ZpZWxkXSA9IGNhY2hlIGFzIGFueTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh5ZHJhdGVTZXNzaW9uKHNlc3Npb246IFNlc3Npb25UeXBlKTogU2Vzc2lvblJlY29yZCB7XG4gIHJldHVybiBTZXNzaW9uUmVjb3JkLmRlc2VyaWFsaXplKEJ1ZmZlci5mcm9tKHNlc3Npb24ucmVjb3JkLCAnYmFzZTY0JykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGh5ZHJhdGVQdWJsaWNLZXkoaWRlbnRpdHlLZXk6IElkZW50aXR5S2V5VHlwZSk6IFB1YmxpY0tleSB7XG4gIHJldHVybiBQdWJsaWNLZXkuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20oaWRlbnRpdHlLZXkucHVibGljS2V5KSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaHlkcmF0ZVByZUtleShwcmVLZXk6IFByZUtleVR5cGUpOiBQcmVLZXlSZWNvcmQge1xuICBjb25zdCBwdWJsaWNLZXkgPSBQdWJsaWNLZXkuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20ocHJlS2V5LnB1YmxpY0tleSkpO1xuICBjb25zdCBwcml2YXRlS2V5ID0gUHJpdmF0ZUtleS5kZXNlcmlhbGl6ZShCdWZmZXIuZnJvbShwcmVLZXkucHJpdmF0ZUtleSkpO1xuICByZXR1cm4gUHJlS2V5UmVjb3JkLm5ldyhwcmVLZXkua2V5SWQsIHB1YmxpY0tleSwgcHJpdmF0ZUtleSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaHlkcmF0ZVNpZ25lZFByZUtleShcbiAgc2lnbmVkUHJlS2V5OiBTaWduZWRQcmVLZXlUeXBlXG4pOiBTaWduZWRQcmVLZXlSZWNvcmQge1xuICBjb25zdCBjcmVhdGVkQXQgPSBzaWduZWRQcmVLZXkuY3JlYXRlZF9hdDtcbiAgY29uc3QgcHViS2V5ID0gUHVibGljS2V5LmRlc2VyaWFsaXplKEJ1ZmZlci5mcm9tKHNpZ25lZFByZUtleS5wdWJsaWNLZXkpKTtcbiAgY29uc3QgcHJpdktleSA9IFByaXZhdGVLZXkuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20oc2lnbmVkUHJlS2V5LnByaXZhdGVLZXkpKTtcbiAgY29uc3Qgc2lnbmF0dXJlID0gQnVmZmVyLmZyb20oW10pO1xuXG4gIHJldHVybiBTaWduZWRQcmVLZXlSZWNvcmQubmV3KFxuICAgIHNpZ25lZFByZUtleS5rZXlJZCxcbiAgICBjcmVhdGVkQXQsXG4gICAgcHViS2V5LFxuICAgIHByaXZLZXksXG4gICAgc2lnbmF0dXJlXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcmVlemVTZXNzaW9uKHNlc3Npb246IFNlc3Npb25SZWNvcmQpOiBzdHJpbmcge1xuICByZXR1cm4gc2Vzc2lvbi5zZXJpYWxpemUoKS50b1N0cmluZygnYmFzZTY0Jyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJlZXplUHVibGljS2V5KHB1YmxpY0tleTogUHVibGljS2V5KTogVWludDhBcnJheSB7XG4gIHJldHVybiBwdWJsaWNLZXkuc2VyaWFsaXplKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJlZXplUHJlS2V5KHByZUtleTogUHJlS2V5UmVjb3JkKTogS2V5UGFpclR5cGUge1xuICBjb25zdCBrZXlQYWlyID0ge1xuICAgIHB1YktleTogcHJlS2V5LnB1YmxpY0tleSgpLnNlcmlhbGl6ZSgpLFxuICAgIHByaXZLZXk6IHByZUtleS5wcml2YXRlS2V5KCkuc2VyaWFsaXplKCksXG4gIH07XG4gIHJldHVybiBrZXlQYWlyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyZWV6ZVNpZ25lZFByZUtleShcbiAgc2lnbmVkUHJlS2V5OiBTaWduZWRQcmVLZXlSZWNvcmRcbik6IEtleVBhaXJUeXBlIHtcbiAgY29uc3Qga2V5UGFpciA9IHtcbiAgICBwdWJLZXk6IHNpZ25lZFByZUtleS5wdWJsaWNLZXkoKS5zZXJpYWxpemUoKSxcbiAgICBwcml2S2V5OiBzaWduZWRQcmVLZXkucHJpdmF0ZUtleSgpLnNlcmlhbGl6ZSgpLFxuICB9O1xuICByZXR1cm4ga2V5UGFpcjtcbn1cblxuLy8gV2UgYWRkIGEgdGhpcyBwYXJhbWV0ZXIgdG8gYXZvaWQgYW4gJ2ltcGxpY2l0IGFueScgZXJyb3Igb24gdGhlIG5leHQgbGluZVxuY29uc3QgRXZlbnRzTWl4aW4gPSBmdW5jdGlvbiBFdmVudHNNaXhpbih0aGlzOiB1bmtub3duKSB7XG4gIE9iamVjdC5hc3NpZ24odGhpcywgd2luZG93LkJhY2tib25lLkV2ZW50cyk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG59IGFzIGFueSBhcyB0eXBlb2Ygd2luZG93LkJhY2tib25lLkV2ZW50c01peGluO1xuXG50eXBlIFNlc3Npb25DYWNoZUVudHJ5ID0gQ2FjaGVFbnRyeVR5cGU8U2Vzc2lvblR5cGUsIFNlc3Npb25SZWNvcmQ+O1xudHlwZSBTZW5kZXJLZXlDYWNoZUVudHJ5ID0gQ2FjaGVFbnRyeVR5cGU8U2VuZGVyS2V5VHlwZSwgU2VuZGVyS2V5UmVjb3JkPjtcblxudHlwZSBab25lUXVldWVFbnRyeVR5cGUgPSBSZWFkb25seTx7XG4gIHpvbmU6IFpvbmU7XG4gIGNhbGxiYWNrKCk6IHZvaWQ7XG59PjtcblxuZXhwb3J0IGNsYXNzIFNpZ25hbFByb3RvY29sU3RvcmUgZXh0ZW5kcyBFdmVudHNNaXhpbiB7XG4gIC8vIEVudW1zIHVzZWQgYWNyb3NzIHRoZSBhcHBcblxuICBWZXJpZmllZFN0YXR1cyA9IFZlcmlmaWVkU3RhdHVzO1xuXG4gIC8vIENhY2hlZCB2YWx1ZXNcblxuICBwcml2YXRlIG91cklkZW50aXR5S2V5cyA9IG5ldyBNYXA8VVVJRFN0cmluZ1R5cGUsIEtleVBhaXJUeXBlPigpO1xuXG4gIHByaXZhdGUgb3VyUmVnaXN0cmF0aW9uSWRzID0gbmV3IE1hcDxVVUlEU3RyaW5nVHlwZSwgbnVtYmVyPigpO1xuXG4gIGlkZW50aXR5S2V5cz86IE1hcDxcbiAgICBJZGVudGl0eUtleUlkVHlwZSxcbiAgICBDYWNoZUVudHJ5VHlwZTxJZGVudGl0eUtleVR5cGUsIFB1YmxpY0tleT5cbiAgPjtcblxuICBzZW5kZXJLZXlzPzogTWFwPFNlbmRlcktleUlkVHlwZSwgU2VuZGVyS2V5Q2FjaGVFbnRyeT47XG5cbiAgc2Vzc2lvbnM/OiBNYXA8U2Vzc2lvbklkVHlwZSwgU2Vzc2lvbkNhY2hlRW50cnk+O1xuXG4gIHByZUtleXM/OiBNYXA8UHJlS2V5SWRUeXBlLCBDYWNoZUVudHJ5VHlwZTxQcmVLZXlUeXBlLCBQcmVLZXlSZWNvcmQ+PjtcblxuICBzaWduZWRQcmVLZXlzPzogTWFwPFxuICAgIFNpZ25lZFByZUtleUlkVHlwZSxcbiAgICBDYWNoZUVudHJ5VHlwZTxTaWduZWRQcmVLZXlUeXBlLCBTaWduZWRQcmVLZXlSZWNvcmQ+XG4gID47XG5cbiAgc2VuZGVyS2V5UXVldWVzID0gbmV3IE1hcDxRdWFsaWZpZWRBZGRyZXNzU3RyaW5nVHlwZSwgUFF1ZXVlPigpO1xuXG4gIHNlc3Npb25RdWV1ZXMgPSBuZXcgTWFwPFNlc3Npb25JZFR5cGUsIFBRdWV1ZT4oKTtcblxuICBwcml2YXRlIGN1cnJlbnRab25lPzogWm9uZTtcblxuICBwcml2YXRlIGN1cnJlbnRab25lRGVwdGggPSAwO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgem9uZVF1ZXVlOiBBcnJheTxab25lUXVldWVFbnRyeVR5cGU+ID0gW107XG5cbiAgcHJpdmF0ZSBwZW5kaW5nU2Vzc2lvbnMgPSBuZXcgTWFwPFNlc3Npb25JZFR5cGUsIFNlc3Npb25DYWNoZUVudHJ5PigpO1xuXG4gIHByaXZhdGUgcGVuZGluZ1NlbmRlcktleXMgPSBuZXcgTWFwPFNlbmRlcktleUlkVHlwZSwgU2VuZGVyS2V5Q2FjaGVFbnRyeT4oKTtcblxuICBwcml2YXRlIHBlbmRpbmdVbnByb2Nlc3NlZCA9IG5ldyBNYXA8c3RyaW5nLCBVbnByb2Nlc3NlZFR5cGU+KCk7XG5cbiAgYXN5bmMgaHlkcmF0ZUNhY2hlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLm91cklkZW50aXR5S2V5cy5jbGVhcigpO1xuICAgICAgICBjb25zdCBtYXAgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SXRlbUJ5SWQoJ2lkZW50aXR5S2V5TWFwJyk7XG4gICAgICAgIGlmICghbWFwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMobWFwLnZhbHVlKSkge1xuICAgICAgICAgIGNvbnN0IHsgcHJpdktleSwgcHViS2V5IH0gPSBtYXAudmFsdWVba2V5XTtcbiAgICAgICAgICB0aGlzLm91cklkZW50aXR5S2V5cy5zZXQobmV3IFVVSUQoa2V5KS50b1N0cmluZygpLCB7XG4gICAgICAgICAgICBwcml2S2V5LFxuICAgICAgICAgICAgcHViS2V5LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KSgpLFxuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdGhpcy5vdXJSZWdpc3RyYXRpb25JZHMuY2xlYXIoKTtcbiAgICAgICAgY29uc3QgbWFwID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldEl0ZW1CeUlkKCdyZWdpc3RyYXRpb25JZE1hcCcpO1xuICAgICAgICBpZiAoIW1hcCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG1hcC52YWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLm91clJlZ2lzdHJhdGlvbklkcy5zZXQobmV3IFVVSUQoa2V5KS50b1N0cmluZygpLCBtYXAudmFsdWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICBfZmlsbENhY2hlczxzdHJpbmcsIElkZW50aXR5S2V5VHlwZSwgUHVibGljS2V5PihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgJ2lkZW50aXR5S2V5cycsXG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS5nZXRBbGxJZGVudGl0eUtleXMoKVxuICAgICAgKSxcbiAgICAgIF9maWxsQ2FjaGVzPHN0cmluZywgU2Vzc2lvblR5cGUsIFNlc3Npb25SZWNvcmQ+KFxuICAgICAgICB0aGlzLFxuICAgICAgICAnc2Vzc2lvbnMnLFxuICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0QWxsU2Vzc2lvbnMoKVxuICAgICAgKSxcbiAgICAgIF9maWxsQ2FjaGVzPHN0cmluZywgUHJlS2V5VHlwZSwgUHJlS2V5UmVjb3JkPihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgJ3ByZUtleXMnLFxuICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0QWxsUHJlS2V5cygpXG4gICAgICApLFxuICAgICAgX2ZpbGxDYWNoZXM8c3RyaW5nLCBTZW5kZXJLZXlUeXBlLCBTZW5kZXJLZXlSZWNvcmQ+KFxuICAgICAgICB0aGlzLFxuICAgICAgICAnc2VuZGVyS2V5cycsXG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS5nZXRBbGxTZW5kZXJLZXlzKClcbiAgICAgICksXG4gICAgICBfZmlsbENhY2hlczxzdHJpbmcsIFNpZ25lZFByZUtleVR5cGUsIFNpZ25lZFByZUtleVJlY29yZD4oXG4gICAgICAgIHRoaXMsXG4gICAgICAgICdzaWduZWRQcmVLZXlzJyxcbiAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLmdldEFsbFNpZ25lZFByZUtleXMoKVxuICAgICAgKSxcbiAgICBdKTtcbiAgfVxuXG4gIGFzeW5jIGdldElkZW50aXR5S2V5UGFpcihvdXJVdWlkOiBVVUlEKTogUHJvbWlzZTxLZXlQYWlyVHlwZSB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLm91cklkZW50aXR5S2V5cy5nZXQob3VyVXVpZC50b1N0cmluZygpKTtcbiAgfVxuXG4gIGFzeW5jIGdldExvY2FsUmVnaXN0cmF0aW9uSWQob3VyVXVpZDogVVVJRCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMub3VyUmVnaXN0cmF0aW9uSWRzLmdldChvdXJVdWlkLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgLy8gUHJlS2V5c1xuXG4gIGFzeW5jIGxvYWRQcmVLZXkoXG4gICAgb3VyVXVpZDogVVVJRCxcbiAgICBrZXlJZDogbnVtYmVyXG4gICk6IFByb21pc2U8UHJlS2V5UmVjb3JkIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKCF0aGlzLnByZUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZFByZUtleTogdGhpcy5wcmVLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkOiBQcmVLZXlJZFR5cGUgPSBgJHtvdXJVdWlkLnRvU3RyaW5nKCl9OiR7a2V5SWR9YDtcblxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5wcmVLZXlzLmdldChpZCk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgbG9nLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggcHJla2V5OicsIGlkKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGVudHJ5Lmh5ZHJhdGVkKSB7XG4gICAgICBsb2cuaW5mbygnU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcHJla2V5IChjYWNoZSBoaXQpOicsIGlkKTtcbiAgICAgIHJldHVybiBlbnRyeS5pdGVtO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW0gPSBoeWRyYXRlUHJlS2V5KGVudHJ5LmZyb21EQik7XG4gICAgdGhpcy5wcmVLZXlzLnNldChpZCwge1xuICAgICAgaHlkcmF0ZWQ6IHRydWUsXG4gICAgICBmcm9tREI6IGVudHJ5LmZyb21EQixcbiAgICAgIGl0ZW0sXG4gICAgfSk7XG4gICAgbG9nLmluZm8oJ1N1Y2Nlc3NmdWxseSBmZXRjaGVkIHByZWtleSAoY2FjaGUgbWlzcyk6JywgaWQpO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgYXN5bmMgc3RvcmVQcmVLZXkoXG4gICAgb3VyVXVpZDogVVVJRCxcbiAgICBrZXlJZDogbnVtYmVyLFxuICAgIGtleVBhaXI6IEtleVBhaXJUeXBlXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5wcmVLZXlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0b3JlUHJlS2V5OiB0aGlzLnByZUtleXMgbm90IHlldCBjYWNoZWQhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgaWQ6IFByZUtleUlkVHlwZSA9IGAke291clV1aWQudG9TdHJpbmcoKX06JHtrZXlJZH1gO1xuICAgIGlmICh0aGlzLnByZUtleXMuaGFzKGlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzdG9yZVByZUtleTogcHJla2V5ICR7aWR9IGFscmVhZHkgZXhpc3RzIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGZyb21EQiA9IHtcbiAgICAgIGlkLFxuICAgICAga2V5SWQsXG4gICAgICBvdXJVdWlkOiBvdXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICBwdWJsaWNLZXk6IGtleVBhaXIucHViS2V5LFxuICAgICAgcHJpdmF0ZUtleToga2V5UGFpci5wcml2S2V5LFxuICAgIH07XG5cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVQcmVLZXkoZnJvbURCKTtcbiAgICB0aGlzLnByZUtleXMuc2V0KGlkLCB7XG4gICAgICBoeWRyYXRlZDogZmFsc2UsXG4gICAgICBmcm9tREIsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZW1vdmVQcmVLZXkob3VyVXVpZDogVVVJRCwga2V5SWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5wcmVLZXlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZVByZUtleTogdGhpcy5wcmVLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkOiBQcmVLZXlJZFR5cGUgPSBgJHtvdXJVdWlkLnRvU3RyaW5nKCl9OiR7a2V5SWR9YDtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3JlbW92ZVByZUtleScsIG91clV1aWQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdyZW1vdmVQcmVLZXkgZXJyb3IgdHJpZ2dlcmluZyByZW1vdmVQcmVLZXk6JyxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMucHJlS2V5cy5kZWxldGUoaWQpO1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVQcmVLZXlCeUlkKGlkKTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFyUHJlS2V5U3RvcmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucHJlS2V5cykge1xuICAgICAgdGhpcy5wcmVLZXlzLmNsZWFyKCk7XG4gICAgfVxuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVBbGxQcmVLZXlzKCk7XG4gIH1cblxuICAvLyBTaWduZWQgUHJlS2V5c1xuXG4gIGFzeW5jIGxvYWRTaWduZWRQcmVLZXkoXG4gICAgb3VyVXVpZDogVVVJRCxcbiAgICBrZXlJZDogbnVtYmVyXG4gICk6IFByb21pc2U8U2lnbmVkUHJlS2V5UmVjb3JkIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKCF0aGlzLnNpZ25lZFByZUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZFNpZ25lZFByZUtleTogdGhpcy5zaWduZWRQcmVLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkOiBTaWduZWRQcmVLZXlJZFR5cGUgPSBgJHtvdXJVdWlkLnRvU3RyaW5nKCl9OiR7a2V5SWR9YDtcblxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5zaWduZWRQcmVLZXlzLmdldChpZCk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgbG9nLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggc2lnbmVkIHByZWtleTonLCBpZCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChlbnRyeS5oeWRyYXRlZCkge1xuICAgICAgbG9nLmluZm8oJ1N1Y2Nlc3NmdWxseSBmZXRjaGVkIHNpZ25lZCBwcmVrZXkgKGNhY2hlIGhpdCk6JywgaWQpO1xuICAgICAgcmV0dXJuIGVudHJ5Lml0ZW07XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbSA9IGh5ZHJhdGVTaWduZWRQcmVLZXkoZW50cnkuZnJvbURCKTtcbiAgICB0aGlzLnNpZ25lZFByZUtleXMuc2V0KGlkLCB7XG4gICAgICBoeWRyYXRlZDogdHJ1ZSxcbiAgICAgIGl0ZW0sXG4gICAgICBmcm9tREI6IGVudHJ5LmZyb21EQixcbiAgICB9KTtcbiAgICBsb2cuaW5mbygnU3VjY2Vzc2Z1bGx5IGZldGNoZWQgc2lnbmVkIHByZWtleSAoY2FjaGUgbWlzcyk6JywgaWQpO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNpZ25lZFByZUtleXMoXG4gICAgb3VyVXVpZDogVVVJRFxuICApOiBQcm9taXNlPEFycmF5PE91dGVyU2lnbmVkUHJla2V5VHlwZT4+IHtcbiAgICBpZiAoIXRoaXMuc2lnbmVkUHJlS2V5cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2FkU2lnbmVkUHJlS2V5czogdGhpcy5zaWduZWRQcmVLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2FkU2lnbmVkUHJlS2V5cyB0YWtlcyBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbSh0aGlzLnNpZ25lZFByZUtleXMudmFsdWVzKCkpO1xuICAgIHJldHVybiBlbnRyaWVzXG4gICAgICAuZmlsdGVyKCh7IGZyb21EQiB9KSA9PiBmcm9tREIub3VyVXVpZCA9PT0gb3VyVXVpZC50b1N0cmluZygpKVxuICAgICAgLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGNvbnN0IHByZUtleSA9IGVudHJ5LmZyb21EQjtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwdWJLZXk6IHByZUtleS5wdWJsaWNLZXksXG4gICAgICAgICAgcHJpdktleTogcHJlS2V5LnByaXZhdGVLZXksXG4gICAgICAgICAgY3JlYXRlZF9hdDogcHJlS2V5LmNyZWF0ZWRfYXQsXG4gICAgICAgICAga2V5SWQ6IHByZUtleS5rZXlJZCxcbiAgICAgICAgICBjb25maXJtZWQ6IHByZUtleS5jb25maXJtZWQsXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIE5vdGUgdGhhdCB0aGlzIGlzIGFsc28gY2FsbGVkIGluIHVwZGF0ZSBzY2VuYXJpb3MsIGZvciBjb25maXJtaW5nIHRoYXQgc2lnbmVkIHByZWtleXNcbiAgLy8gICBoYXZlIGluZGVlZCBiZWVuIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gIGFzeW5jIHN0b3JlU2lnbmVkUHJlS2V5KFxuICAgIG91clV1aWQ6IFVVSUQsXG4gICAga2V5SWQ6IG51bWJlcixcbiAgICBrZXlQYWlyOiBLZXlQYWlyVHlwZSxcbiAgICBjb25maXJtZWQ/OiBib29sZWFuLFxuICAgIGNyZWF0ZWRBdCA9IERhdGUubm93KClcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnNpZ25lZFByZUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc3RvcmVTaWduZWRQcmVLZXk6IHRoaXMuc2lnbmVkUHJlS2V5cyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZDogU2lnbmVkUHJlS2V5SWRUeXBlID0gYCR7b3VyVXVpZC50b1N0cmluZygpfToke2tleUlkfWA7XG5cbiAgICBjb25zdCBmcm9tREIgPSB7XG4gICAgICBpZCxcbiAgICAgIG91clV1aWQ6IG91clV1aWQudG9TdHJpbmcoKSxcbiAgICAgIGtleUlkLFxuICAgICAgcHVibGljS2V5OiBrZXlQYWlyLnB1YktleSxcbiAgICAgIHByaXZhdGVLZXk6IGtleVBhaXIucHJpdktleSxcbiAgICAgIGNyZWF0ZWRfYXQ6IGNyZWF0ZWRBdCxcbiAgICAgIGNvbmZpcm1lZDogQm9vbGVhbihjb25maXJtZWQpLFxuICAgIH07XG5cbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVTaWduZWRQcmVLZXkoZnJvbURCKTtcbiAgICB0aGlzLnNpZ25lZFByZUtleXMuc2V0KGlkLCB7XG4gICAgICBoeWRyYXRlZDogZmFsc2UsXG4gICAgICBmcm9tREIsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZW1vdmVTaWduZWRQcmVLZXkob3VyVXVpZDogVVVJRCwga2V5SWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zaWduZWRQcmVLZXlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZVNpZ25lZFByZUtleTogdGhpcy5zaWduZWRQcmVLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkOiBTaWduZWRQcmVLZXlJZFR5cGUgPSBgJHtvdXJVdWlkLnRvU3RyaW5nKCl9OiR7a2V5SWR9YDtcbiAgICB0aGlzLnNpZ25lZFByZUtleXMuZGVsZXRlKGlkKTtcbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlU2lnbmVkUHJlS2V5QnlJZChpZCk7XG4gIH1cblxuICBhc3luYyBjbGVhclNpZ25lZFByZUtleXNTdG9yZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5zaWduZWRQcmVLZXlzKSB7XG4gICAgICB0aGlzLnNpZ25lZFByZUtleXMuY2xlYXIoKTtcbiAgICB9XG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUFsbFNpZ25lZFByZUtleXMoKTtcbiAgfVxuXG4gIC8vIFNlbmRlciBLZXlcblxuICAvLyBSZS1lbnRyYW50IHNlbmRlciBrZXkgdHJhbnNhY3Rpb24gcm91dGluZS4gT25seSBvbmUgc2VuZGVyIGtleSB0cmFuc2FjdGlvbiBjb3VsZFxuICAvLyBiZSBydW5uaW5nIGF0IHRoZSBzYW1lIHRpbWUuXG4gIC8vXG4gIC8vIFdoaWxlIGluIHRyYW5zYWN0aW9uOlxuICAvL1xuICAvLyAtIGBzYXZlU2VuZGVyS2V5KClgIGFkZHMgdGhlIHVwZGF0ZWQgc2Vzc2lvbiB0byB0aGUgYHBlbmRpbmdTZW5kZXJLZXlzYFxuICAvLyAtIGBnZXRTZW5kZXJLZXkoKWAgbG9va3MgdXAgdGhlIHNlc3Npb24gZmlyc3QgaW4gYHBlbmRpbmdTZW5kZXJLZXlzYCBhbmQgb25seVxuICAvLyAgIHRoZW4gaW4gdGhlIG1haW4gYHNlbmRlcktleXNgIHN0b3JlXG4gIC8vXG4gIC8vIFdoZW4gdHJhbnNhY3Rpb24gZW5kczpcbiAgLy9cbiAgLy8gLSBzdWNjZXNzZnVsbHk6IHBlbmRpbmcgc2VuZGVyIGtleSBzdG9yZXMgYXJlIGJhdGNoZWQgaW50byB0aGUgZGF0YWJhc2VcbiAgLy8gLSB3aXRoIGFuIGVycm9yOiBwZW5kaW5nIHNlbmRlciBrZXkgc3RvcmVzIGFyZSByZXZlcnRlZFxuXG4gIGFzeW5jIGVucXVldWVTZW5kZXJLZXlKb2I8VD4oXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICB0YXNrOiAoKSA9PiBQcm9taXNlPFQ+LFxuICAgIHpvbmUgPSBHTE9CQUxfWk9ORVxuICApOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZSh6b25lLCAnZW5xdWV1ZVNlbmRlcktleUpvYicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHF1ZXVlID0gdGhpcy5fZ2V0U2VuZGVyS2V5UXVldWUocXVhbGlmaWVkQWRkcmVzcyk7XG5cbiAgICAgIHJldHVybiBxdWV1ZS5hZGQ8VD4odGFzayk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVTZW5kZXJLZXlRdWV1ZSgpOiBQUXVldWUge1xuICAgIHJldHVybiBuZXcgUFF1ZXVlKHtcbiAgICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgICAgdGltZW91dDogTUlOVVRFICogMzAsXG4gICAgICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNlbmRlcktleVF1ZXVlKHNlbmRlcklkOiBRdWFsaWZpZWRBZGRyZXNzKTogUFF1ZXVlIHtcbiAgICBjb25zdCBjYWNoZWRRdWV1ZSA9IHRoaXMuc2VuZGVyS2V5UXVldWVzLmdldChzZW5kZXJJZC50b1N0cmluZygpKTtcbiAgICBpZiAoY2FjaGVkUXVldWUpIHtcbiAgICAgIHJldHVybiBjYWNoZWRRdWV1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmVzaFF1ZXVlID0gdGhpcy5fY3JlYXRlU2VuZGVyS2V5UXVldWUoKTtcbiAgICB0aGlzLnNlbmRlcktleVF1ZXVlcy5zZXQoc2VuZGVySWQudG9TdHJpbmcoKSwgZnJlc2hRdWV1ZSk7XG4gICAgcmV0dXJuIGZyZXNoUXVldWU7XG4gIH1cblxuICBwcml2YXRlIGdldFNlbmRlcktleUlkKFxuICAgIHNlbmRlcktleUlkOiBRdWFsaWZpZWRBZGRyZXNzLFxuICAgIGRpc3RyaWJ1dGlvbklkOiBzdHJpbmdcbiAgKTogU2VuZGVyS2V5SWRUeXBlIHtcbiAgICByZXR1cm4gYCR7c2VuZGVyS2V5SWQudG9TdHJpbmcoKX0tLSR7ZGlzdHJpYnV0aW9uSWR9YDtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZW5kZXJLZXkoXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICBkaXN0cmlidXRpb25JZDogc3RyaW5nLFxuICAgIHJlY29yZDogU2VuZGVyS2V5UmVjb3JkLFxuICAgIHsgem9uZSA9IEdMT0JBTF9aT05FIH06IFNlc3Npb25UcmFuc2FjdGlvbk9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLndpdGhab25lKHpvbmUsICdzYXZlU2VuZGVyS2V5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNlbmRlcktleXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzYXZlU2VuZGVyS2V5OiB0aGlzLnNlbmRlcktleXMgbm90IHlldCBjYWNoZWQhJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbmRlcklkID0gcXVhbGlmaWVkQWRkcmVzcy50b1N0cmluZygpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0U2VuZGVyS2V5SWQocXVhbGlmaWVkQWRkcmVzcywgZGlzdHJpYnV0aW9uSWQpO1xuXG4gICAgICAgIGNvbnN0IGZyb21EQjogU2VuZGVyS2V5VHlwZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBzZW5kZXJJZCxcbiAgICAgICAgICBkaXN0cmlidXRpb25JZCxcbiAgICAgICAgICBkYXRhOiByZWNvcmQuc2VyaWFsaXplKCksXG4gICAgICAgICAgbGFzdFVwZGF0ZWREYXRlOiBEYXRlLm5vdygpLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGVuZGluZ1NlbmRlcktleXMuc2V0KGlkLCB7XG4gICAgICAgICAgaHlkcmF0ZWQ6IHRydWUsXG4gICAgICAgICAgZnJvbURCLFxuICAgICAgICAgIGl0ZW06IHJlY29yZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3VycmVudCB6b25lIGRvZXNuJ3Qgc3VwcG9ydCBwZW5kaW5nIHNlc3Npb25zIC0gY29tbWl0IGltbWVkaWF0ZWx5XG4gICAgICAgIGlmICghem9uZS5zdXBwb3J0c1BlbmRpbmdTZW5kZXJLZXlzKCkpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmNvbW1pdFpvbmVDaGFuZ2VzKCdzYXZlU2VuZGVyS2V5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGVycm9yU3RyaW5nID0gZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yO1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgYHNhdmVTZW5kZXJLZXk6IGZhaWxlZCB0byBzYXZlIHNlbmRlcktleSAke3NlbmRlcklkfS8ke2Rpc3RyaWJ1dGlvbklkfTogJHtlcnJvclN0cmluZ31gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRTZW5kZXJLZXkoXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICBkaXN0cmlidXRpb25JZDogc3RyaW5nLFxuICAgIHsgem9uZSA9IEdMT0JBTF9aT05FIH06IFNlc3Npb25UcmFuc2FjdGlvbk9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPFNlbmRlcktleVJlY29yZCB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKHpvbmUsICdnZXRTZW5kZXJLZXknLCBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2VuZGVyS2V5cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNlbmRlcktleTogdGhpcy5zZW5kZXJLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZW5kZXJJZCA9IHF1YWxpZmllZEFkZHJlc3MudG9TdHJpbmcoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldFNlbmRlcktleUlkKHF1YWxpZmllZEFkZHJlc3MsIGRpc3RyaWJ1dGlvbklkKTtcblxuICAgICAgICBjb25zdCBtYXAgPSB0aGlzLnBlbmRpbmdTZW5kZXJLZXlzLmhhcyhpZClcbiAgICAgICAgICA/IHRoaXMucGVuZGluZ1NlbmRlcktleXNcbiAgICAgICAgICA6IHRoaXMuc2VuZGVyS2V5cztcbiAgICAgICAgY29uc3QgZW50cnkgPSBtYXAuZ2V0KGlkKTtcblxuICAgICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgICAgbG9nLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggc2VuZGVyIGtleTonLCBpZCk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS5oeWRyYXRlZCkge1xuICAgICAgICAgIGxvZy5pbmZvKCdTdWNjZXNzZnVsbHkgZmV0Y2hlZCBzZW5kZXIga2V5IChjYWNoZSBoaXQpOicsIGlkKTtcbiAgICAgICAgICByZXR1cm4gZW50cnkuaXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBTZW5kZXJLZXlSZWNvcmQuZGVzZXJpYWxpemUoXG4gICAgICAgICAgQnVmZmVyLmZyb20oZW50cnkuZnJvbURCLmRhdGEpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2VuZGVyS2V5cy5zZXQoaWQsIHtcbiAgICAgICAgICBoeWRyYXRlZDogdHJ1ZSxcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIGZyb21EQjogZW50cnkuZnJvbURCLFxuICAgICAgICB9KTtcbiAgICAgICAgbG9nLmluZm8oJ1N1Y2Nlc3NmdWxseSBmZXRjaGVkIHNlbmRlciBrZXkoY2FjaGUgbWlzcyk6JywgaWQpO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGVycm9yU3RyaW5nID0gZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yO1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgYGdldFNlbmRlcktleTogZmFpbGVkIHRvIGxvYWQgc2VuZGVyIGtleSAke3NlbmRlcklkfS8ke2Rpc3RyaWJ1dGlvbklkfTogJHtlcnJvclN0cmluZ31gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZW1vdmVTZW5kZXJLZXkoXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICBkaXN0cmlidXRpb25JZDogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zZW5kZXJLZXlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNlbmRlcktleTogdGhpcy5zZW5kZXJLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRlcklkID0gcXVhbGlmaWVkQWRkcmVzcy50b1N0cmluZygpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRTZW5kZXJLZXlJZChxdWFsaWZpZWRBZGRyZXNzLCBkaXN0cmlidXRpb25JZCk7XG5cbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVTZW5kZXJLZXlCeUlkKGlkKTtcblxuICAgICAgdGhpcy5zZW5kZXJLZXlzLmRlbGV0ZShpZCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IGVycm9yU3RyaW5nID0gZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yO1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgcmVtb3ZlU2VuZGVyS2V5OiBmYWlsZWQgdG8gcmVtb3ZlIHNlbmRlcktleSAke3NlbmRlcklkfS8ke2Rpc3RyaWJ1dGlvbklkfTogJHtlcnJvclN0cmluZ31gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUFsbFNlbmRlcktleXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdyZW1vdmVBbGxTZW5kZXJLZXlzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2VuZGVyS2V5cykge1xuICAgICAgICB0aGlzLnNlbmRlcktleXMuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBlbmRpbmdTZW5kZXJLZXlzKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ1NlbmRlcktleXMuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVBbGxTZW5kZXJLZXlzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTZXNzaW9uIFF1ZXVlXG5cbiAgYXN5bmMgZW5xdWV1ZVNlc3Npb25Kb2I8VD4oXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICB0YXNrOiAoKSA9PiBQcm9taXNlPFQ+LFxuICAgIHpvbmU6IFpvbmUgPSBHTE9CQUxfWk9ORVxuICApOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZSh6b25lLCAnZW5xdWV1ZVNlc3Npb25Kb2InLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBxdWV1ZSA9IHRoaXMuX2dldFNlc3Npb25RdWV1ZShxdWFsaWZpZWRBZGRyZXNzKTtcblxuICAgICAgcmV0dXJuIHF1ZXVlLmFkZDxUPih0YXNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVNlc3Npb25RdWV1ZSgpOiBQUXVldWUge1xuICAgIHJldHVybiBuZXcgUFF1ZXVlKHtcbiAgICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgICAgdGltZW91dDogTUlOVVRFICogMzAsXG4gICAgICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNlc3Npb25RdWV1ZShpZDogUXVhbGlmaWVkQWRkcmVzcyk6IFBRdWV1ZSB7XG4gICAgY29uc3QgY2FjaGVkUXVldWUgPSB0aGlzLnNlc3Npb25RdWV1ZXMuZ2V0KGlkLnRvU3RyaW5nKCkpO1xuICAgIGlmIChjYWNoZWRRdWV1ZSkge1xuICAgICAgcmV0dXJuIGNhY2hlZFF1ZXVlO1xuICAgIH1cblxuICAgIGNvbnN0IGZyZXNoUXVldWUgPSB0aGlzLl9jcmVhdGVTZXNzaW9uUXVldWUoKTtcbiAgICB0aGlzLnNlc3Npb25RdWV1ZXMuc2V0KGlkLnRvU3RyaW5nKCksIGZyZXNoUXVldWUpO1xuICAgIHJldHVybiBmcmVzaFF1ZXVlO1xuICB9XG5cbiAgLy8gU2Vzc2lvbnNcblxuICAvLyBSZS1lbnRyYW50IHNlc3Npb24gdHJhbnNhY3Rpb24gcm91dGluZS4gT25seSBvbmUgc2Vzc2lvbiB0cmFuc2FjdGlvbiBjb3VsZFxuICAvLyBiZSBydW5uaW5nIGF0IHRoZSBzYW1lIHRpbWUuXG4gIC8vXG4gIC8vIFdoaWxlIGluIHRyYW5zYWN0aW9uOlxuICAvL1xuICAvLyAtIGBzdG9yZVNlc3Npb24oKWAgYWRkcyB0aGUgdXBkYXRlZCBzZXNzaW9uIHRvIHRoZSBgcGVuZGluZ1Nlc3Npb25zYFxuICAvLyAtIGBsb2FkU2Vzc2lvbigpYCBsb29rcyB1cCB0aGUgc2Vzc2lvbiBmaXJzdCBpbiBgcGVuZGluZ1Nlc3Npb25zYCBhbmQgb25seVxuICAvLyAgIHRoZW4gaW4gdGhlIG1haW4gYHNlc3Npb25zYCBzdG9yZVxuICAvL1xuICAvLyBXaGVuIHRyYW5zYWN0aW9uIGVuZHM6XG4gIC8vXG4gIC8vIC0gc3VjY2Vzc2Z1bGx5OiBwZW5kaW5nIHNlc3Npb24gc3RvcmVzIGFyZSBiYXRjaGVkIGludG8gdGhlIGRhdGFiYXNlXG4gIC8vIC0gd2l0aCBhbiBlcnJvcjogcGVuZGluZyBzZXNzaW9uIHN0b3JlcyBhcmUgcmV2ZXJ0ZWRcblxuICBwdWJsaWMgYXN5bmMgd2l0aFpvbmU8VD4oXG4gICAgem9uZTogWm9uZSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgYm9keTogKCkgPT4gUHJvbWlzZTxUPlxuICApOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBkZWJ1Z05hbWUgPSBgd2l0aFpvbmUoJHt6b25lLm5hbWV9OiR7bmFtZX0pYDtcblxuICAgIC8vIEFsbG93IHJlLWVudGVyaW5nIGZyb20gTGliU2lnbmFsU3RvcmVzXG4gICAgaWYgKHRoaXMuY3VycmVudFpvbmUgJiYgdGhpcy5jdXJyZW50Wm9uZSAhPT0gem9uZSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBsb2cuaW5mbyhgJHtkZWJ1Z05hbWV9OiBsb2NrZWQgYnkgJHt0aGlzLmN1cnJlbnRab25lLm5hbWV9LCB3YWl0aW5nYCk7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gRGF0ZS5ub3coKSAtIHN0YXJ0O1xuICAgICAgICAgIGxvZy5pbmZvKGAke2RlYnVnTmFtZX06IHVubG9ja2VkIGFmdGVyICR7ZHVyYXRpb259bXNgKTtcblxuICAgICAgICAgIC8vIENhbGwgYC53aXRoWm9uZWAgc3luY2hyb25vdXNseSBmcm9tIGB0aGlzLnpvbmVRdWV1ZWAgdG8gYXZvaWRcbiAgICAgICAgICAvLyBleHRyYSBpbi1iZXR3ZWVuIHRpY2tzIHdoaWxlIHdlIGFyZSBvbiBtaWNyb3Rhc2tzIHF1ZXVlLlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNvbHZlKGF3YWl0IHRoaXMud2l0aFpvbmUoem9uZSwgbmFtZSwgYm9keSkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnpvbmVRdWV1ZS5wdXNoKHsgem9uZSwgY2FsbGJhY2sgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmVudGVyWm9uZSh6b25lLCBuYW1lKTtcblxuICAgIGxldCByZXN1bHQ6IFQ7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGF3YWl0IGJvZHkoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKHRoaXMuaXNJblRvcExldmVsWm9uZSgpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMucmV2ZXJ0Wm9uZUNoYW5nZXMobmFtZSwgZXJyb3IpO1xuICAgICAgfVxuICAgICAgdGhpcy5sZWF2ZVpvbmUoem9uZSk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0luVG9wTGV2ZWxab25lKCkpIHtcbiAgICAgIGF3YWl0IHRoaXMuY29tbWl0Wm9uZUNoYW5nZXMobmFtZSk7XG4gICAgfVxuICAgIHRoaXMubGVhdmVab25lKHpvbmUpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY29tbWl0Wm9uZUNoYW5nZXMobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBwZW5kaW5nU2VuZGVyS2V5cywgcGVuZGluZ1Nlc3Npb25zLCBwZW5kaW5nVW5wcm9jZXNzZWQgfSA9IHRoaXM7XG5cbiAgICBpZiAoXG4gICAgICBwZW5kaW5nU2VuZGVyS2V5cy5zaXplID09PSAwICYmXG4gICAgICBwZW5kaW5nU2Vzc2lvbnMuc2l6ZSA9PT0gMCAmJlxuICAgICAgcGVuZGluZ1VucHJvY2Vzc2VkLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhcbiAgICAgIGBjb21taXRab25lQ2hhbmdlcygke25hbWV9KTogYCArXG4gICAgICAgIGBwZW5kaW5nIHNlbmRlciBrZXlzICR7cGVuZGluZ1NlbmRlcktleXMuc2l6ZX0sIGAgK1xuICAgICAgICBgcGVuZGluZyBzZXNzaW9ucyAke3BlbmRpbmdTZXNzaW9ucy5zaXplfSwgYCArXG4gICAgICAgIGBwZW5kaW5nIHVucHJvY2Vzc2VkICR7cGVuZGluZ1VucHJvY2Vzc2VkLnNpemV9YFxuICAgICk7XG5cbiAgICB0aGlzLnBlbmRpbmdTZW5kZXJLZXlzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucGVuZGluZ1Nlc3Npb25zID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucGVuZGluZ1VucHJvY2Vzc2VkID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gQ29tbWl0IGJvdGggc2VuZGVyIGtleXMsIHNlc3Npb25zIGFuZCB1bnByb2Nlc3NlZCBpbiB0aGUgc2FtZSBkYXRhYmFzZSB0cmFuc2FjdGlvblxuICAgIC8vICAgdG8gdW5yb2xsIGJvdGggb24gZXJyb3IuXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmNvbW1pdERlY3J5cHRSZXN1bHQoe1xuICAgICAgc2VuZGVyS2V5czogQXJyYXkuZnJvbShwZW5kaW5nU2VuZGVyS2V5cy52YWx1ZXMoKSkubWFwKFxuICAgICAgICAoeyBmcm9tREIgfSkgPT4gZnJvbURCXG4gICAgICApLFxuICAgICAgc2Vzc2lvbnM6IEFycmF5LmZyb20ocGVuZGluZ1Nlc3Npb25zLnZhbHVlcygpKS5tYXAoXG4gICAgICAgICh7IGZyb21EQiB9KSA9PiBmcm9tREJcbiAgICAgICksXG4gICAgICB1bnByb2Nlc3NlZDogQXJyYXkuZnJvbShwZW5kaW5nVW5wcm9jZXNzZWQudmFsdWVzKCkpLFxuICAgIH0pO1xuXG4gICAgLy8gQXBwbHkgY2hhbmdlcyB0byBpbi1tZW1vcnkgc3RvcmFnZSBhZnRlciBzdWNjZXNzZnVsIERCIHdyaXRlLlxuXG4gICAgY29uc3QgeyBzZXNzaW9ucyB9ID0gdGhpcztcbiAgICBhc3NlcnQoc2Vzc2lvbnMgIT09IHVuZGVmaW5lZCwgXCJDYW4ndCBjb21taXQgdW5oeWRyYXRlZCBzZXNzaW9uIHN0b3JhZ2VcIik7XG4gICAgcGVuZGluZ1Nlc3Npb25zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHNlc3Npb25zLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgc2VuZGVyS2V5cyB9ID0gdGhpcztcbiAgICBhc3NlcnQoXG4gICAgICBzZW5kZXJLZXlzICE9PSB1bmRlZmluZWQsXG4gICAgICBcIkNhbid0IGNvbW1pdCB1bmh5ZHJhdGVkIHNlbmRlciBrZXkgc3RvcmFnZVwiXG4gICAgKTtcbiAgICBwZW5kaW5nU2VuZGVyS2V5cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBzZW5kZXJLZXlzLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmV2ZXJ0Wm9uZUNoYW5nZXMobmFtZTogc3RyaW5nLCBlcnJvcjogRXJyb3IpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGByZXZlcnRab25lQ2hhbmdlcygke25hbWV9KTogYCArXG4gICAgICAgIGBwZW5kaW5nIHNlbmRlciBrZXlzIHNpemUgJHt0aGlzLnBlbmRpbmdTZW5kZXJLZXlzLnNpemV9LCBgICtcbiAgICAgICAgYHBlbmRpbmcgc2Vzc2lvbnMgc2l6ZSAke3RoaXMucGVuZGluZ1Nlc3Npb25zLnNpemV9LCBgICtcbiAgICAgICAgYHBlbmRpbmcgdW5wcm9jZXNzZWQgc2l6ZSAke3RoaXMucGVuZGluZ1VucHJvY2Vzc2VkLnNpemV9YCxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrXG4gICAgKTtcbiAgICB0aGlzLnBlbmRpbmdTZW5kZXJLZXlzLmNsZWFyKCk7XG4gICAgdGhpcy5wZW5kaW5nU2Vzc2lvbnMuY2xlYXIoKTtcbiAgICB0aGlzLnBlbmRpbmdVbnByb2Nlc3NlZC5jbGVhcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0luVG9wTGV2ZWxab25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRab25lRGVwdGggPT09IDE7XG4gIH1cblxuICBwcml2YXRlIGVudGVyWm9uZSh6b25lOiBab25lLCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRab25lRGVwdGggKz0gMTtcbiAgICBpZiAodGhpcy5jdXJyZW50Wm9uZURlcHRoID09PSAxKSB7XG4gICAgICBhc3NlcnQodGhpcy5jdXJyZW50Wm9uZSA9PT0gdW5kZWZpbmVkLCAnU2hvdWxkIG5vdCBiZSBpbiB0aGUgem9uZScpO1xuICAgICAgdGhpcy5jdXJyZW50Wm9uZSA9IHpvbmU7XG5cbiAgICAgIGlmICh6b25lICE9PSBHTE9CQUxfWk9ORSkge1xuICAgICAgICBsb2cuaW5mbyhgU2lnbmFsUHJvdG9jb2xTdG9yZS5lbnRlclpvbmUoJHt6b25lLm5hbWV9OiR7bmFtZX0pYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsZWF2ZVpvbmUoem9uZTogWm9uZSk6IHZvaWQge1xuICAgIGFzc2VydCh0aGlzLmN1cnJlbnRab25lID09PSB6b25lLCAnU2hvdWxkIGJlIGluIHRoZSBjb3JyZWN0IHpvbmUnKTtcblxuICAgIHRoaXMuY3VycmVudFpvbmVEZXB0aCAtPSAxO1xuICAgIGFzc2VydCh0aGlzLmN1cnJlbnRab25lRGVwdGggPj0gMCwgJ1VubWF0Y2hlZCBudW1iZXIgb2YgbGVhdmVab25lIGNhbGxzJyk7XG5cbiAgICAvLyBTaW5jZSB3ZSBhbGxvdyByZS1lbnRlcmluZyB6b25lcyB3ZSBtaWdodCBhY3R1YWxseSBiZSBpbiB0d28gb3ZlcmxhcHBpbmdcbiAgICAvLyBhc3luYyBjYWxscy4gTGVhdmUgdGhlIHpvbmUgYW5kIHlpZWxkIHRvIGFub3RoZXIgb25lIG9ubHkgaWYgdGhlcmUgYXJlXG4gICAgLy8gbm8gYWN0aXZlIHpvbmUgdXNlcnMgYW55bW9yZS5cbiAgICBpZiAodGhpcy5jdXJyZW50Wm9uZURlcHRoICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHpvbmUgIT09IEdMT0JBTF9aT05FKSB7XG4gICAgICBsb2cuaW5mbyhgU2lnbmFsUHJvdG9jb2xTdG9yZS5sZWF2ZVpvbmUoJHt6b25lLm5hbWV9KWApO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFpvbmUgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBuZXh0ID0gdGhpcy56b25lUXVldWUuc2hpZnQoKTtcbiAgICBpZiAoIW5leHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b0VudGVyID0gW25leHRdO1xuXG4gICAgd2hpbGUgKHRoaXMuem9uZVF1ZXVlWzBdPy56b25lID09PSBuZXh0LnpvbmUpIHtcbiAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLnpvbmVRdWV1ZS5zaGlmdCgpO1xuICAgICAgYXNzZXJ0KGVsZW0sICdab25lIGVsZW1lbnQgc2hvdWxkIGJlIHByZXNlbnQnKTtcblxuICAgICAgdG9FbnRlci5wdXNoKGVsZW0pO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYFNpZ25hbFByb3RvY29sU3RvcmU6IHJ1bm5pbmcgYmxvY2tlZCAke3RvRW50ZXIubGVuZ3RofSBqb2JzIGluIGAgK1xuICAgICAgICBgem9uZSAke25leHQuem9uZS5uYW1lfWBcbiAgICApO1xuICAgIGZvciAoY29uc3QgeyBjYWxsYmFjayB9IG9mIHRvRW50ZXIpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZFNlc3Npb24oXG4gICAgcXVhbGlmaWVkQWRkcmVzczogUXVhbGlmaWVkQWRkcmVzcyxcbiAgICB7IHpvbmUgPSBHTE9CQUxfWk9ORSB9OiBTZXNzaW9uVHJhbnNhY3Rpb25PcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTxTZXNzaW9uUmVjb3JkIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoem9uZSwgJ2xvYWRTZXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNlc3Npb25zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZFNlc3Npb246IHRoaXMuc2Vzc2lvbnMgbm90IHlldCBjYWNoZWQhJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChxdWFsaWZpZWRBZGRyZXNzID09PSBudWxsIHx8IHF1YWxpZmllZEFkZHJlc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xvYWRTZXNzaW9uOiBxdWFsaWZpZWRBZGRyZXNzIHdhcyB1bmRlZmluZWQvbnVsbCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpZCA9IHF1YWxpZmllZEFkZHJlc3MudG9TdHJpbmcoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5wZW5kaW5nU2Vzc2lvbnMuaGFzKGlkKVxuICAgICAgICAgID8gdGhpcy5wZW5kaW5nU2Vzc2lvbnNcbiAgICAgICAgICA6IHRoaXMuc2Vzc2lvbnM7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gbWFwLmdldChpZCk7XG5cbiAgICAgICAgaWYgKCFlbnRyeSkge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkuaHlkcmF0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gZW50cnkuaXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlJ2xsIGVpdGhlciBqdXN0IGh5ZHJhdGUgdGhlIGl0ZW0gb3Igd2UnbGwgZnVsbHkgbWlncmF0ZSB0aGUgc2Vzc2lvblxuICAgICAgICAvLyAgIGFuZCBzYXZlIGl0IHRvIHRoZSBkYXRhYmFzZS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX21heWJlTWlncmF0ZVNlc3Npb24oZW50cnkuZnJvbURCLCB7IHpvbmUgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvclN0cmluZyA9IGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvcjtcbiAgICAgICAgbG9nLmVycm9yKGBsb2FkU2Vzc2lvbjogZmFpbGVkIHRvIGxvYWQgc2Vzc2lvbiAke2lkfTogJHtlcnJvclN0cmluZ31gKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXNzaW9ucyhcbiAgICBxdWFsaWZpZWRBZGRyZXNzZXM6IEFycmF5PFF1YWxpZmllZEFkZHJlc3M+LFxuICAgIHsgem9uZSA9IEdMT0JBTF9aT05FIH06IFNlc3Npb25UcmFuc2FjdGlvbk9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPEFycmF5PFNlc3Npb25SZWNvcmQ+PiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoem9uZSwgJ2xvYWRTZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNlc3Npb25zID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIHF1YWxpZmllZEFkZHJlc3Nlcy5tYXAoYXN5bmMgYWRkcmVzcyA9PlxuICAgICAgICAgIHRoaXMubG9hZFNlc3Npb24oYWRkcmVzcywgeyB6b25lIH0pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBzZXNzaW9ucy5maWx0ZXIoaXNOb3ROaWwpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbWF5YmVNaWdyYXRlU2Vzc2lvbihcbiAgICBzZXNzaW9uOiBTZXNzaW9uVHlwZSxcbiAgICB7IHpvbmUgPSBHTE9CQUxfWk9ORSB9OiBTZXNzaW9uVHJhbnNhY3Rpb25PcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTxTZXNzaW9uUmVjb3JkPiB7XG4gICAgaWYgKCF0aGlzLnNlc3Npb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ19tYXliZU1pZ3JhdGVTZXNzaW9uOiB0aGlzLnNlc3Npb25zIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIC8vIEFscmVhZHkgbWlncmF0ZWQsIGh5ZHJhdGUgYW5kIHVwZGF0ZSBjYWNoZVxuICAgIGlmIChzZXNzaW9uLnZlcnNpb24gPT09IDIpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBoeWRyYXRlU2Vzc2lvbihzZXNzaW9uKTtcblxuICAgICAgY29uc3QgbWFwID0gdGhpcy5wZW5kaW5nU2Vzc2lvbnMuaGFzKHNlc3Npb24uaWQpXG4gICAgICAgID8gdGhpcy5wZW5kaW5nU2Vzc2lvbnNcbiAgICAgICAgOiB0aGlzLnNlc3Npb25zO1xuICAgICAgbWFwLnNldChzZXNzaW9uLmlkLCB7XG4gICAgICAgIGh5ZHJhdGVkOiB0cnVlLFxuICAgICAgICBpdGVtLFxuICAgICAgICBmcm9tREI6IHNlc3Npb24sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgLy8gTm90IHlldCBjb252ZXJ0ZWQsIG5lZWQgdG8gdHJhbnNsYXRlIHRvIG5ldyBmb3JtYXQgYW5kIHNhdmVcbiAgICBpZiAoc2Vzc2lvbi52ZXJzaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignX21heWJlTWlncmF0ZVNlc3Npb246IFVua25vd24gc2Vzc2lvbiB2ZXJzaW9uIHR5cGUhJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3VyVXVpZCA9IG5ldyBVVUlEKHNlc3Npb24ub3VyVXVpZCk7XG5cbiAgICBjb25zdCBrZXlQYWlyID0gYXdhaXQgdGhpcy5nZXRJZGVudGl0eUtleVBhaXIob3VyVXVpZCk7XG4gICAgaWYgKCFrZXlQYWlyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ19tYXliZU1pZ3JhdGVTZXNzaW9uOiBObyBpZGVudGl0eSBrZXkgZm9yIG91cnNlbGYhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxSZWdpc3RyYXRpb25JZCA9IGF3YWl0IHRoaXMuZ2V0TG9jYWxSZWdpc3RyYXRpb25JZChvdXJVdWlkKTtcbiAgICBpZiAoIWlzTnVtYmVyKGxvY2FsUmVnaXN0cmF0aW9uSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ19tYXliZU1pZ3JhdGVTZXNzaW9uOiBObyByZWdpc3RyYXRpb24gaWQgZm9yIG91cnNlbGYhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxVc2VyRGF0YSA9IHtcbiAgICAgIGlkZW50aXR5S2V5UHVibGljOiBrZXlQYWlyLnB1YktleSxcbiAgICAgIHJlZ2lzdHJhdGlvbklkOiBsb2NhbFJlZ2lzdHJhdGlvbklkLFxuICAgIH07XG5cbiAgICBsb2cuaW5mbyhgX21heWJlTWlncmF0ZVNlc3Npb246IE1pZ3JhdGluZyBzZXNzaW9uIHdpdGggaWQgJHtzZXNzaW9uLmlkfWApO1xuICAgIGNvbnN0IHNlc3Npb25Qcm90byA9IHNlc3Npb25SZWNvcmRUb1Byb3RvYnVmKFxuICAgICAgSlNPTi5wYXJzZShzZXNzaW9uLnJlY29yZCksXG4gICAgICBsb2NhbFVzZXJEYXRhXG4gICAgKTtcbiAgICBjb25zdCByZWNvcmQgPSBTZXNzaW9uUmVjb3JkLmRlc2VyaWFsaXplKFxuICAgICAgQnVmZmVyLmZyb20oc2Vzc2lvblN0cnVjdHVyZVRvQnl0ZXMoc2Vzc2lvblByb3RvKSlcbiAgICApO1xuXG4gICAgYXdhaXQgdGhpcy5zdG9yZVNlc3Npb24oUXVhbGlmaWVkQWRkcmVzcy5wYXJzZShzZXNzaW9uLmlkKSwgcmVjb3JkLCB7XG4gICAgICB6b25lLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuXG4gIGFzeW5jIHN0b3JlU2Vzc2lvbihcbiAgICBxdWFsaWZpZWRBZGRyZXNzOiBRdWFsaWZpZWRBZGRyZXNzLFxuICAgIHJlY29yZDogU2Vzc2lvblJlY29yZCxcbiAgICB7IHpvbmUgPSBHTE9CQUxfWk9ORSB9OiBTZXNzaW9uVHJhbnNhY3Rpb25PcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy53aXRoWm9uZSh6b25lLCAnc3RvcmVTZXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNlc3Npb25zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3RvcmVTZXNzaW9uOiB0aGlzLnNlc3Npb25zIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgICAgfVxuXG4gICAgICBpZiAocXVhbGlmaWVkQWRkcmVzcyA9PT0gbnVsbCB8fCBxdWFsaWZpZWRBZGRyZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdG9yZVNlc3Npb246IHF1YWxpZmllZEFkZHJlc3Mgd2FzIHVuZGVmaW5lZC9udWxsJyk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHV1aWQsIGRldmljZUlkIH0gPSBxdWFsaWZpZWRBZGRyZXNzO1xuXG4gICAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICAgIHV1aWQ6IHV1aWQudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBjb252ZXJzYXRpb24gIT09IHVuZGVmaW5lZCxcbiAgICAgICAgJ3N0b3JlU2Vzc2lvbjogRW5zdXJlIGNvbnRhY3QgaWRzIGZhaWxlZCdcbiAgICAgICk7XG4gICAgICBjb25zdCBpZCA9IHF1YWxpZmllZEFkZHJlc3MudG9TdHJpbmcoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZnJvbURCID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHZlcnNpb246IDIsXG4gICAgICAgICAgb3VyVXVpZDogcXVhbGlmaWVkQWRkcmVzcy5vdXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICB1dWlkOiB1dWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgZGV2aWNlSWQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmQuc2VyaWFsaXplKCkudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG5ld1Nlc3Npb24gPSB7XG4gICAgICAgICAgaHlkcmF0ZWQ6IHRydWUsXG4gICAgICAgICAgZnJvbURCLFxuICAgICAgICAgIGl0ZW06IHJlY29yZCxcbiAgICAgICAgfTtcblxuICAgICAgICBhc3NlcnQodGhpcy5jdXJyZW50Wm9uZSwgJ011c3QgcnVuIGluIHRoZSB6b25lJyk7XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nU2Vzc2lvbnMuc2V0KGlkLCBuZXdTZXNzaW9uKTtcblxuICAgICAgICAvLyBDdXJyZW50IHpvbmUgZG9lc24ndCBzdXBwb3J0IHBlbmRpbmcgc2Vzc2lvbnMgLSBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgICAgaWYgKCF6b25lLnN1cHBvcnRzUGVuZGluZ1Nlc3Npb25zKCkpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmNvbW1pdFpvbmVDaGFuZ2VzKCdzdG9yZVNlc3Npb24nKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc3QgZXJyb3JTdHJpbmcgPSBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3I7XG4gICAgICAgIGxvZy5lcnJvcihgc3RvcmVTZXNzaW9uOiBTYXZlIGZhaWxlZCBmb3IgJHtpZH06ICR7ZXJyb3JTdHJpbmd9YCk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0T3BlbkRldmljZXMoXG4gICAgb3VyVXVpZDogVVVJRCxcbiAgICBpZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPixcbiAgICB7IHpvbmUgPSBHTE9CQUxfWk9ORSB9OiBTZXNzaW9uVHJhbnNhY3Rpb25PcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTx7XG4gICAgZGV2aWNlczogQXJyYXk8RGV2aWNlVHlwZT47XG4gICAgZW1wdHlJZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPjtcbiAgfT4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKHpvbmUsICdnZXRPcGVuRGV2aWNlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZXNzaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE9wZW5EZXZpY2VzOiB0aGlzLnNlc3Npb25zIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgICAgfVxuICAgICAgaWYgKGlkZW50aWZpZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4geyBkZXZpY2VzOiBbXSwgZW1wdHlJZGVudGlmaWVyczogW10gfTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXVpZHNPcklkZW50aWZpZXJzID0gbmV3IFNldChcbiAgICAgICAgICBpZGVudGlmaWVycy5tYXAoXG4gICAgICAgICAgICBpZGVudGlmaWVyID0+IFVVSUQubG9va3VwKGlkZW50aWZpZXIpPy50b1N0cmluZygpIHx8IGlkZW50aWZpZXJcbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgYWxsU2Vzc2lvbnMgPSB0aGlzLl9nZXRBbGxTZXNzaW9ucygpO1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gYWxsU2Vzc2lvbnMuZmlsdGVyKFxuICAgICAgICAgICh7IGZyb21EQiB9KSA9PlxuICAgICAgICAgICAgZnJvbURCLm91clV1aWQgPT09IG91clV1aWQudG9TdHJpbmcoKSAmJlxuICAgICAgICAgICAgdXVpZHNPcklkZW50aWZpZXJzLmhhcyhmcm9tREIudXVpZClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgb3BlbkVudHJpZXM6IEFycmF5PFxuICAgICAgICAgIHwgdW5kZWZpbmVkXG4gICAgICAgICAgfCB7XG4gICAgICAgICAgICAgIGVudHJ5OiBTZXNzaW9uQ2FjaGVFbnRyeTtcbiAgICAgICAgICAgICAgcmVjb3JkOiBTZXNzaW9uUmVjb3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICA+ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgZW50cmllcy5tYXAoYXN5bmMgZW50cnkgPT4ge1xuICAgICAgICAgICAgaWYgKGVudHJ5Lmh5ZHJhdGVkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IGVudHJ5Lml0ZW07XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQuaGFzQ3VycmVudFN0YXRlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyByZWNvcmQsIGVudHJ5IH07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLl9tYXliZU1pZ3JhdGVTZXNzaW9uKGVudHJ5LmZyb21EQiwge1xuICAgICAgICAgICAgICB6b25lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVjb3JkLmhhc0N1cnJlbnRTdGF0ZSgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IHJlY29yZCwgZW50cnkgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGRldmljZXMgPSBvcGVuRW50cmllc1xuICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZW50cnksIHJlY29yZCB9ID0gaXRlbTtcblxuICAgICAgICAgICAgY29uc3QgeyB1dWlkIH0gPSBlbnRyeS5mcm9tREI7XG4gICAgICAgICAgICB1dWlkc09ySWRlbnRpZmllcnMuZGVsZXRlKHV1aWQpO1xuXG4gICAgICAgICAgICBjb25zdCBpZCA9IGVudHJ5LmZyb21EQi5kZXZpY2VJZDtcblxuICAgICAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uSWQgPSByZWNvcmQucmVtb3RlUmVnaXN0cmF0aW9uSWQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogdXVpZCxcbiAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgIHJlZ2lzdHJhdGlvbklkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoaXNOb3ROaWwpO1xuICAgICAgICBjb25zdCBlbXB0eUlkZW50aWZpZXJzID0gQXJyYXkuZnJvbSh1dWlkc09ySWRlbnRpZmllcnMudmFsdWVzKCkpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGV2aWNlcyxcbiAgICAgICAgICBlbXB0eUlkZW50aWZpZXJzLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdnZXRPcGVuRGV2aWNlczogRmFpbGVkIHRvIGdldCBkZXZpY2VzJyxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXREZXZpY2VJZHMoe1xuICAgIG91clV1aWQsXG4gICAgaWRlbnRpZmllcixcbiAgfTogUmVhZG9ubHk8e1xuICAgIG91clV1aWQ6IFVVSUQ7XG4gICAgaWRlbnRpZmllcjogc3RyaW5nO1xuICB9Pik6IFByb21pc2U8QXJyYXk8bnVtYmVyPj4ge1xuICAgIGNvbnN0IHsgZGV2aWNlcyB9ID0gYXdhaXQgdGhpcy5nZXRPcGVuRGV2aWNlcyhvdXJVdWlkLCBbaWRlbnRpZmllcl0pO1xuICAgIHJldHVybiBkZXZpY2VzLm1hcCgoZGV2aWNlOiBEZXZpY2VUeXBlKSA9PiBkZXZpY2UuaWQpO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlU2Vzc2lvbihxdWFsaWZpZWRBZGRyZXNzOiBRdWFsaWZpZWRBZGRyZXNzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdyZW1vdmVTZXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNlc3Npb25zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlU2Vzc2lvbjogdGhpcy5zZXNzaW9ucyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWQgPSBxdWFsaWZpZWRBZGRyZXNzLnRvU3RyaW5nKCk7XG4gICAgICBsb2cuaW5mbygncmVtb3ZlU2Vzc2lvbjogZGVsZXRpbmcgc2Vzc2lvbiBmb3InLCBpZCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlU2Vzc2lvbkJ5SWQoaWQpO1xuICAgICAgICB0aGlzLnNlc3Npb25zLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMucGVuZGluZ1Nlc3Npb25zLmRlbGV0ZShpZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5lcnJvcihgcmVtb3ZlU2Vzc2lvbjogRmFpbGVkIHRvIGRlbGV0ZSBzZXNzaW9uIGZvciAke2lkfWApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQWxsU2Vzc2lvbnMoaWRlbnRpZmllcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdyZW1vdmVBbGxTZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZXNzaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUFsbFNlc3Npb25zOiB0aGlzLnNlc3Npb25zIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWRlbnRpZmllciA9PT0gbnVsbCB8fCBpZGVudGlmaWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVBbGxTZXNzaW9uczogaWRlbnRpZmllciB3YXMgdW5kZWZpbmVkL251bGwnKTtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oJ3JlbW92ZUFsbFNlc3Npb25zOiBkZWxldGluZyBzZXNzaW9ucyBmb3InLCBpZGVudGlmaWVyKTtcblxuICAgICAgY29uc3QgaWQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRDb252ZXJzYXRpb25JZChpZGVudGlmaWVyKTtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgaWQsXG4gICAgICAgIGByZW1vdmVBbGxTZXNzaW9uczogQ29udmVyc2F0aW9uIG5vdCBmb3VuZDogJHtpZGVudGlmaWVyfWBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKHRoaXMuc2Vzc2lvbnMudmFsdWVzKCkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gZW50cmllcy5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5mcm9tREIuY29udmVyc2F0aW9uSWQgPT09IGlkKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9ucy5kZWxldGUoZW50cnkuZnJvbURCLmlkKTtcbiAgICAgICAgICB0aGlzLnBlbmRpbmdTZXNzaW9ucy5kZWxldGUoZW50cnkuZnJvbURCLmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlU2Vzc2lvbnNCeUNvbnZlcnNhdGlvbihpZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9hcmNoaXZlU2Vzc2lvbihlbnRyeT86IFNlc3Npb25DYWNoZUVudHJ5LCB6b25lPzogWm9uZSkge1xuICAgIGlmICghZW50cnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRyID0gUXVhbGlmaWVkQWRkcmVzcy5wYXJzZShlbnRyeS5mcm9tREIuaWQpO1xuXG4gICAgYXdhaXQgdGhpcy5lbnF1ZXVlU2Vzc2lvbkpvYihcbiAgICAgIGFkZHIsXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBlbnRyeS5oeWRyYXRlZFxuICAgICAgICAgID8gZW50cnkuaXRlbVxuICAgICAgICAgIDogYXdhaXQgdGhpcy5fbWF5YmVNaWdyYXRlU2Vzc2lvbihlbnRyeS5mcm9tREIsIHsgem9uZSB9KTtcblxuICAgICAgICBpZiAoIWl0ZW0uaGFzQ3VycmVudFN0YXRlKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtLmFyY2hpdmVDdXJyZW50U3RhdGUoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnN0b3JlU2Vzc2lvbihhZGRyLCBpdGVtLCB7IHpvbmUgfSk7XG4gICAgICB9LFxuICAgICAgem9uZVxuICAgICk7XG4gIH1cblxuICBhc3luYyBhcmNoaXZlU2Vzc2lvbihxdWFsaWZpZWRBZGRyZXNzOiBRdWFsaWZpZWRBZGRyZXNzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdhcmNoaXZlU2Vzc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZXNzaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FyY2hpdmVTZXNzaW9uOiB0aGlzLnNlc3Npb25zIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpZCA9IHF1YWxpZmllZEFkZHJlc3MudG9TdHJpbmcoKTtcblxuICAgICAgbG9nLmluZm8oYGFyY2hpdmVTZXNzaW9uOiBzZXNzaW9uIGZvciAke2lkfWApO1xuXG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMucGVuZGluZ1Nlc3Npb25zLmdldChpZCkgfHwgdGhpcy5zZXNzaW9ucy5nZXQoaWQpO1xuXG4gICAgICBhd2FpdCB0aGlzLl9hcmNoaXZlU2Vzc2lvbihlbnRyeSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBhcmNoaXZlU2libGluZ1Nlc3Npb25zKFxuICAgIGVuY29kZWRBZGRyZXNzOiBBZGRyZXNzLFxuICAgIHsgem9uZSA9IEdMT0JBTF9aT05FIH06IFNlc3Npb25UcmFuc2FjdGlvbk9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZSh6b25lLCAnYXJjaGl2ZVNpYmxpbmdTZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZXNzaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2FyY2hpdmVTaWJsaW5nU2Vzc2lvbnM6IHRoaXMuc2Vzc2lvbnMgbm90IHlldCBjYWNoZWQhJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ2FyY2hpdmVTaWJsaW5nU2Vzc2lvbnM6IGFyY2hpdmluZyBzaWJsaW5nIHNlc3Npb25zIGZvcicsXG4gICAgICAgIGVuY29kZWRBZGRyZXNzLnRvU3RyaW5nKClcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHsgdXVpZCwgZGV2aWNlSWQgfSA9IGVuY29kZWRBZGRyZXNzO1xuXG4gICAgICBjb25zdCBhbGxFbnRyaWVzID0gdGhpcy5fZ2V0QWxsU2Vzc2lvbnMoKTtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBhbGxFbnRyaWVzLmZpbHRlcihcbiAgICAgICAgZW50cnkgPT5cbiAgICAgICAgICBlbnRyeS5mcm9tREIudXVpZCA9PT0gdXVpZC50b1N0cmluZygpICYmXG4gICAgICAgICAgZW50cnkuZnJvbURCLmRldmljZUlkICE9PSBkZXZpY2VJZFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGVudHJpZXMubWFwKGFzeW5jIGVudHJ5ID0+IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLl9hcmNoaXZlU2Vzc2lvbihlbnRyeSwgem9uZSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgYXJjaGl2ZUFsbFNlc3Npb25zKHV1aWQ6IFVVSUQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZShHTE9CQUxfWk9ORSwgJ2FyY2hpdmVBbGxTZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZXNzaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FyY2hpdmVBbGxTZXNzaW9uczogdGhpcy5zZXNzaW9ucyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdhcmNoaXZlQWxsU2Vzc2lvbnM6IGFyY2hpdmluZyBhbGwgc2Vzc2lvbnMgZm9yJyxcbiAgICAgICAgdXVpZC50b1N0cmluZygpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBhbGxFbnRyaWVzID0gdGhpcy5fZ2V0QWxsU2Vzc2lvbnMoKTtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBhbGxFbnRyaWVzLmZpbHRlcihcbiAgICAgICAgZW50cnkgPT4gZW50cnkuZnJvbURCLnV1aWQgPT09IHV1aWQudG9TdHJpbmcoKVxuICAgICAgKTtcblxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGVudHJpZXMubWFwKGFzeW5jIGVudHJ5ID0+IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLl9hcmNoaXZlU2Vzc2lvbihlbnRyeSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY2xlYXJTZXNzaW9uU3RvcmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdjbGVhclNlc3Npb25TdG9yZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNlc3Npb25zKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbnMuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGVuZGluZ1Nlc3Npb25zLmNsZWFyKCk7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlQWxsU2Vzc2lvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxpZ2h0U2Vzc2lvblJlc2V0KHF1YWxpZmllZEFkZHJlc3M6IFF1YWxpZmllZEFkZHJlc3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpZCA9IHF1YWxpZmllZEFkZHJlc3MudG9TdHJpbmcoKTtcblxuICAgIGNvbnN0IHNlc3Npb25SZXNldHMgPSB3aW5kb3cuc3RvcmFnZS5nZXQoXG4gICAgICAnc2Vzc2lvblJlc2V0cycsXG4gICAgICA8U2Vzc2lvblJlc2V0c1R5cGU+e31cbiAgICApO1xuXG4gICAgY29uc3QgbGFzdFJlc2V0ID0gc2Vzc2lvblJlc2V0c1tpZF07XG5cbiAgICBjb25zdCBPTkVfSE9VUiA9IDYwICogNjAgKiAxMDAwO1xuICAgIGlmIChsYXN0UmVzZXQgJiYgaXNNb3JlUmVjZW50VGhhbihsYXN0UmVzZXQsIE9ORV9IT1VSKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBsaWdodFNlc3Npb25SZXNldC8ke2lkfTogU2tpcHBpbmcgc2Vzc2lvbiByZXNldCwgbGFzdCByZXNldCBhdCAke2xhc3RSZXNldH1gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlc3Npb25SZXNldHNbaWRdID0gRGF0ZS5ub3coKTtcbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3Nlc3Npb25SZXNldHMnLCBzZXNzaW9uUmVzZXRzKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHV1aWQgfSA9IHF1YWxpZmllZEFkZHJlc3M7XG5cbiAgICAgIC8vIEZpcnN0LCBmZXRjaCB0aGlzIGNvbnZlcnNhdGlvblxuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgICB1dWlkOiB1dWlkLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICAgIGFzc2VydChjb252ZXJzYXRpb24sIGBsaWdodFNlc3Npb25SZXNldC8ke2lkfTogbWlzc2luZyBjb252ZXJzYXRpb25gKTtcblxuICAgICAgbG9nLndhcm4oYGxpZ2h0U2Vzc2lvblJlc2V0LyR7aWR9OiBSZXNldHRpbmcgc2Vzc2lvbmApO1xuXG4gICAgICAvLyBBcmNoaXZlIG9wZW4gc2Vzc2lvbiB3aXRoIHRoaXMgZGV2aWNlXG4gICAgICBhd2FpdCB0aGlzLmFyY2hpdmVTZXNzaW9uKHF1YWxpZmllZEFkZHJlc3MpO1xuXG4gICAgICAvLyBFbnF1ZXVlIGEgbnVsbCBtZXNzYWdlIHdpdGggbmV3bHktY3JlYXRlZCBzZXNzaW9uXG4gICAgICBhd2FpdCBzaW5nbGVQcm90b0pvYlF1ZXVlLmFkZChcbiAgICAgICAgTWVzc2FnZVNlbmRlci5nZXROdWxsTWVzc2FnZSh7XG4gICAgICAgICAgdXVpZDogdXVpZC50b1N0cmluZygpLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGRvIHRoZSBzZXNzaW9uIHJlc2V0LCB0aGVuIHdlJ2xsIGFsbG93IGFub3RoZXIgYXR0ZW1wdCBzb29uZXJcbiAgICAgIC8vICAgdGhhbiBvbmUgaG91ciBmcm9tIG5vdy5cbiAgICAgIGRlbGV0ZSBzZXNzaW9uUmVzZXRzW2lkXTtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnc2Vzc2lvblJlc2V0cycsIHNlc3Npb25SZXNldHMpO1xuXG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGBsaWdodFNlc3Npb25SZXNldC8ke2lkfTogRW5jb3VudGVyZWQgZXJyb3JgLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIElkZW50aXR5IEtleXNcblxuICBnZXRJZGVudGl0eVJlY29yZCh1dWlkOiBVVUlEKTogSWRlbnRpdHlLZXlUeXBlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuaWRlbnRpdHlLZXlzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldElkZW50aXR5UmVjb3JkOiB0aGlzLmlkZW50aXR5S2V5cyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHV1aWQudG9TdHJpbmcoKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuaWRlbnRpdHlLZXlzLmdldChpZCk7XG4gICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbnRyeS5mcm9tREI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgZ2V0SWRlbnRpdHlSZWNvcmQ6IEZhaWxlZCB0byBnZXQgaWRlbnRpdHkgcmVjb3JkIGZvciBpZGVudGlmaWVyICR7aWR9YFxuICAgICAgKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0T3JNaWdyYXRlSWRlbnRpdHlSZWNvcmQoXG4gICAgdXVpZDogVVVJRFxuICApOiBQcm9taXNlPElkZW50aXR5S2V5VHlwZSB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICghdGhpcy5pZGVudGl0eUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2dldE9yTWlncmF0ZUlkZW50aXR5UmVjb3JkOiB0aGlzLmlkZW50aXR5S2V5cyBub3QgeWV0IGNhY2hlZCEnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZ2V0SWRlbnRpdHlSZWNvcmQodXVpZCk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdJZCA9IHV1aWQudG9TdHJpbmcoKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQobmV3SWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gY29udmVyc2F0aW9uLmlkO1xuICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuaWRlbnRpdHlLZXlzLmdldChgY29udmVyc2F0aW9uOiR7Y29udmVyc2F0aW9uSWR9YCk7XG4gICAgaWYgKCFyZWNvcmQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UmVjb3JkID0ge1xuICAgICAgLi4ucmVjb3JkLmZyb21EQixcbiAgICAgIGlkOiBuZXdJZCxcbiAgICB9O1xuXG4gICAgbG9nLmluZm8oXG4gICAgICBgU2lnbmFsUHJvdG9jb2xTdG9yZTogbWlncmF0aW5nIGlkZW50aXR5IGtleSBmcm9tICR7cmVjb3JkLmZyb21EQi5pZH0gYCArXG4gICAgICAgIGB0byAke25ld1JlY29yZC5pZH1gXG4gICAgKTtcblxuICAgIGF3YWl0IHRoaXMuX3NhdmVJZGVudGl0eUtleShuZXdSZWNvcmQpO1xuXG4gICAgdGhpcy5pZGVudGl0eUtleXMuZGVsZXRlKHJlY29yZC5mcm9tREIuaWQpO1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVJZGVudGl0eUtleUJ5SWQocmVjb3JkLmZyb21EQi5pZCk7XG5cbiAgICByZXR1cm4gbmV3UmVjb3JkO1xuICB9XG5cbiAgYXN5bmMgaXNUcnVzdGVkSWRlbnRpdHkoXG4gICAgZW5jb2RlZEFkZHJlc3M6IEFkZHJlc3MsXG4gICAgcHVibGljS2V5OiBVaW50OEFycmF5LFxuICAgIGRpcmVjdGlvbjogbnVtYmVyXG4gICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5pZGVudGl0eUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaXNUcnVzdGVkSWRlbnRpdHk6IHRoaXMuaWRlbnRpdHlLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGlmIChlbmNvZGVkQWRkcmVzcyA9PT0gbnVsbCB8fCBlbmNvZGVkQWRkcmVzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lzVHJ1c3RlZElkZW50aXR5OiBlbmNvZGVkQWRkcmVzcyB3YXMgdW5kZWZpbmVkL251bGwnKTtcbiAgICB9XG4gICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuICAgIGNvbnN0IGlzT3VySWRlbnRpZmllciA9IGVuY29kZWRBZGRyZXNzLnV1aWQuaXNFcXVhbChvdXJVdWlkKTtcblxuICAgIGNvbnN0IGlkZW50aXR5UmVjb3JkID0gYXdhaXQgdGhpcy5nZXRPck1pZ3JhdGVJZGVudGl0eVJlY29yZChcbiAgICAgIGVuY29kZWRBZGRyZXNzLnV1aWRcbiAgICApO1xuXG4gICAgaWYgKGlzT3VySWRlbnRpZmllcikge1xuICAgICAgaWYgKGlkZW50aXR5UmVjb3JkICYmIGlkZW50aXR5UmVjb3JkLnB1YmxpY0tleSkge1xuICAgICAgICByZXR1cm4gY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHlSZWNvcmQucHVibGljS2V5LCBwdWJsaWNLZXkpO1xuICAgICAgfVxuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdpc1RydXN0ZWRJZGVudGl0eTogTm8gbG9jYWwgcmVjb3JkIGZvciBvdXIgb3duIGlkZW50aWZpZXIuIFJldHVybmluZyB0cnVlLidcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBEaXJlY3Rpb24uU2VuZGluZzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUcnVzdGVkRm9yU2VuZGluZyhwdWJsaWNLZXksIGlkZW50aXR5UmVjb3JkKTtcbiAgICAgIGNhc2UgRGlyZWN0aW9uLlJlY2VpdmluZzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzVHJ1c3RlZElkZW50aXR5OiBVbmtub3duIGRpcmVjdGlvbjogJHtkaXJlY3Rpb259YCk7XG4gICAgfVxuICB9XG5cbiAgaXNUcnVzdGVkRm9yU2VuZGluZyhcbiAgICBwdWJsaWNLZXk6IFVpbnQ4QXJyYXksXG4gICAgaWRlbnRpdHlSZWNvcmQ/OiBJZGVudGl0eUtleVR5cGVcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpZGVudGl0eVJlY29yZCkge1xuICAgICAgbG9nLmluZm8oJ2lzVHJ1c3RlZEZvclNlbmRpbmc6IE5vIHByZXZpb3VzIHJlY29yZCwgcmV0dXJuaW5nIHRydWUuLi4nKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nID0gaWRlbnRpdHlSZWNvcmQucHVibGljS2V5O1xuXG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgbG9nLmluZm8oJ2lzVHJ1c3RlZEZvclNlbmRpbmc6IE5vdGhpbmcgaGVyZSwgcmV0dXJuaW5nIHRydWUuLi4nKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWNvbnN0YW50VGltZUVxdWFsKGV4aXN0aW5nLCBwdWJsaWNLZXkpKSB7XG4gICAgICBsb2cuaW5mbyhcImlzVHJ1c3RlZEZvclNlbmRpbmc6IElkZW50aXR5IGtleXMgZG9uJ3QgbWF0Y2guLi5cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpZGVudGl0eVJlY29yZC52ZXJpZmllZCA9PT0gVmVyaWZpZWRTdGF0dXMuVU5WRVJJRklFRCkge1xuICAgICAgbG9nLmVycm9yKCdpc1RydXN0ZWRJZGVudGl0eTogTmVlZHMgdW52ZXJpZmllZCBhcHByb3ZhbCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNOb25CbG9ja2luZ0FwcHJvdmFsUmVxdWlyZWQoaWRlbnRpdHlSZWNvcmQpKSB7XG4gICAgICBsb2cuZXJyb3IoJ2lzVHJ1c3RlZEZvclNlbmRpbmc6IE5lZWRzIG5vbi1ibG9ja2luZyBhcHByb3ZhbCEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRJZGVudGl0eUtleSh1dWlkOiBVVUlEKTogUHJvbWlzZTxVaW50OEFycmF5IHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKHV1aWQgPT09IG51bGwgfHwgdXVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xvYWRJZGVudGl0eUtleTogdXVpZCB3YXMgdW5kZWZpbmVkL251bGwnKTtcbiAgICB9XG4gICAgY29uc3QgaWRlbnRpdHlSZWNvcmQgPSBhd2FpdCB0aGlzLmdldE9yTWlncmF0ZUlkZW50aXR5UmVjb3JkKHV1aWQpO1xuXG4gICAgaWYgKGlkZW50aXR5UmVjb3JkKSB7XG4gICAgICByZXR1cm4gaWRlbnRpdHlSZWNvcmQucHVibGljS2V5O1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9zYXZlSWRlbnRpdHlLZXkoZGF0YTogSWRlbnRpdHlLZXlUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmlkZW50aXR5S2V5cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdfc2F2ZUlkZW50aXR5S2V5OiB0aGlzLmlkZW50aXR5S2V5cyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGlkIH0gPSBkYXRhO1xuXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmNyZWF0ZU9yVXBkYXRlSWRlbnRpdHlLZXkoZGF0YSk7XG4gICAgdGhpcy5pZGVudGl0eUtleXMuc2V0KGlkLCB7XG4gICAgICBoeWRyYXRlZDogZmFsc2UsXG4gICAgICBmcm9tREI6IGRhdGEsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzYXZlSWRlbnRpdHkoXG4gICAgZW5jb2RlZEFkZHJlc3M6IEFkZHJlc3MsXG4gICAgcHVibGljS2V5OiBVaW50OEFycmF5LFxuICAgIG5vbmJsb2NraW5nQXBwcm92YWwgPSBmYWxzZSxcbiAgICB7IHpvbmUgfTogU2Vzc2lvblRyYW5zYWN0aW9uT3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5pZGVudGl0eUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2F2ZUlkZW50aXR5OiB0aGlzLmlkZW50aXR5S2V5cyBub3QgeWV0IGNhY2hlZCEnKTtcbiAgICB9XG5cbiAgICBpZiAoZW5jb2RlZEFkZHJlc3MgPT09IG51bGwgfHwgZW5jb2RlZEFkZHJlc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzYXZlSWRlbnRpdHk6IGVuY29kZWRBZGRyZXNzIHdhcyB1bmRlZmluZWQvbnVsbCcpO1xuICAgIH1cbiAgICBpZiAoIShwdWJsaWNLZXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBwdWJsaWNLZXkgPSBCeXRlcy5mcm9tQmluYXJ5KHB1YmxpY0tleSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygbm9uYmxvY2tpbmdBcHByb3ZhbCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG5vbmJsb2NraW5nQXBwcm92YWwgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpZGVudGl0eVJlY29yZCA9IGF3YWl0IHRoaXMuZ2V0T3JNaWdyYXRlSWRlbnRpdHlSZWNvcmQoXG4gICAgICBlbmNvZGVkQWRkcmVzcy51dWlkXG4gICAgKTtcblxuICAgIGNvbnN0IGlkID0gZW5jb2RlZEFkZHJlc3MudXVpZC50b1N0cmluZygpO1xuXG4gICAgaWYgKCFpZGVudGl0eVJlY29yZCB8fCAhaWRlbnRpdHlSZWNvcmQucHVibGljS2V5KSB7XG4gICAgICAvLyBMb29rdXAgZmFpbGVkLCBvciB0aGUgY3VycmVudCBrZXkgd2FzIHJlbW92ZWQsIHNvIHNhdmUgdGhpcyBvbmUuXG4gICAgICBsb2cuaW5mbygnc2F2ZUlkZW50aXR5OiBTYXZpbmcgbmV3IGlkZW50aXR5Li4uJyk7XG4gICAgICBhd2FpdCB0aGlzLl9zYXZlSWRlbnRpdHlLZXkoe1xuICAgICAgICBpZCxcbiAgICAgICAgcHVibGljS2V5LFxuICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICB2ZXJpZmllZDogVmVyaWZpZWRTdGF0dXMuREVGQVVMVCxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbCxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkcHVibGljS2V5ID0gaWRlbnRpdHlSZWNvcmQucHVibGljS2V5O1xuICAgIGlmICghY29uc3RhbnRUaW1lRXF1YWwob2xkcHVibGljS2V5LCBwdWJsaWNLZXkpKSB7XG4gICAgICBsb2cuaW5mbygnc2F2ZUlkZW50aXR5OiBSZXBsYWNpbmcgZXhpc3RpbmcgaWRlbnRpdHkuLi4nKTtcbiAgICAgIGNvbnN0IHByZXZpb3VzU3RhdHVzID0gaWRlbnRpdHlSZWNvcmQudmVyaWZpZWQ7XG4gICAgICBsZXQgdmVyaWZpZWRTdGF0dXM7XG4gICAgICBpZiAoXG4gICAgICAgIHByZXZpb3VzU3RhdHVzID09PSBWZXJpZmllZFN0YXR1cy5WRVJJRklFRCB8fFxuICAgICAgICBwcmV2aW91c1N0YXR1cyA9PT0gVmVyaWZpZWRTdGF0dXMuVU5WRVJJRklFRFxuICAgICAgKSB7XG4gICAgICAgIHZlcmlmaWVkU3RhdHVzID0gVmVyaWZpZWRTdGF0dXMuVU5WRVJJRklFRDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZlcmlmaWVkU3RhdHVzID0gVmVyaWZpZWRTdGF0dXMuREVGQVVMVDtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5fc2F2ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHB1YmxpY0tleSxcbiAgICAgICAgZmlyc3RVc2U6IGZhbHNlLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIHZlcmlmaWVkOiB2ZXJpZmllZFN0YXR1cyxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbCxcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ2tleWNoYW5nZScsIGVuY29kZWRBZGRyZXNzLnV1aWQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdzYXZlSWRlbnRpdHk6IGVycm9yIHRyaWdnZXJpbmcga2V5Y2hhbmdlOicsXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBhc3MgdGhlIHpvbmUgdG8gZmFjaWxpdGF0ZSB0cmFuc2FjdGlvbmFsIHNlc3Npb24gdXNlIGluXG4gICAgICAvLyBNZXNzYWdlUmVjZWl2ZXIudHNcbiAgICAgIGF3YWl0IHRoaXMuYXJjaGl2ZVNpYmxpbmdTZXNzaW9ucyhlbmNvZGVkQWRkcmVzcywge1xuICAgICAgICB6b25lLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc05vbkJsb2NraW5nQXBwcm92YWxSZXF1aXJlZChpZGVudGl0eVJlY29yZCkpIHtcbiAgICAgIGxvZy5pbmZvKCdzYXZlSWRlbnRpdHk6IFNldHRpbmcgYXBwcm92YWwgc3RhdHVzLi4uJyk7XG5cbiAgICAgIGlkZW50aXR5UmVjb3JkLm5vbmJsb2NraW5nQXBwcm92YWwgPSBub25ibG9ja2luZ0FwcHJvdmFsO1xuICAgICAgYXdhaXQgdGhpcy5fc2F2ZUlkZW50aXR5S2V5KGlkZW50aXR5UmVjb3JkKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzTm9uQmxvY2tpbmdBcHByb3ZhbFJlcXVpcmVkKGlkZW50aXR5UmVjb3JkOiBJZGVudGl0eUtleVR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgIWlkZW50aXR5UmVjb3JkLmZpcnN0VXNlICYmXG4gICAgICBpc01vcmVSZWNlbnRUaGFuKGlkZW50aXR5UmVjb3JkLnRpbWVzdGFtcCwgVElNRVNUQU1QX1RIUkVTSE9MRCkgJiZcbiAgICAgICFpZGVudGl0eVJlY29yZC5ub25ibG9ja2luZ0FwcHJvdmFsXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVJZGVudGl0eVdpdGhBdHRyaWJ1dGVzKFxuICAgIHV1aWQ6IFVVSUQsXG4gICAgYXR0cmlidXRlczogUGFydGlhbDxJZGVudGl0eUtleVR5cGU+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh1dWlkID09PSBudWxsIHx8IHV1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzYXZlSWRlbnRpdHlXaXRoQXR0cmlidXRlczogdXVpZCB3YXMgdW5kZWZpbmVkL251bGwnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZGVudGl0eVJlY29yZCA9IGF3YWl0IHRoaXMuZ2V0T3JNaWdyYXRlSWRlbnRpdHlSZWNvcmQodXVpZCk7XG4gICAgY29uc3QgaWQgPSB1dWlkLnRvU3RyaW5nKCk7XG5cbiAgICAvLyBXaGVuIHNhdmluZyBhIFBOSSBpZGVudGl0eSAtIGRvbid0IGNyZWF0ZSBhIHNlcGFyYXRlIGNvbnZlcnNhdGlvblxuICAgIGNvbnN0IHV1aWRLaW5kID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE91clV1aWRLaW5kKHV1aWQpO1xuICAgIGlmICh1dWlkS2luZCAhPT0gVVVJREtpbmQuUE5JKSB7XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShpZCwgJ3ByaXZhdGUnKTtcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVzOiBQYXJ0aWFsPElkZW50aXR5S2V5VHlwZT4gPSB7XG4gICAgICAuLi5pZGVudGl0eVJlY29yZCxcbiAgICAgIC4uLmF0dHJpYnV0ZXMsXG4gICAgICBpZCxcbiAgICB9O1xuXG4gICAgaWYgKHZhbGlkYXRlSWRlbnRpdHlLZXkodXBkYXRlcykpIHtcbiAgICAgIGF3YWl0IHRoaXMuX3NhdmVJZGVudGl0eUtleSh1cGRhdGVzKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZXRBcHByb3ZhbCh1dWlkOiBVVUlELCBub25ibG9ja2luZ0FwcHJvdmFsOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHV1aWQgPT09IG51bGwgfHwgdXVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldEFwcHJvdmFsOiB1dWlkIHdhcyB1bmRlZmluZWQvbnVsbCcpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5vbmJsb2NraW5nQXBwcm92YWwgIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRBcHByb3ZhbDogSW52YWxpZCBhcHByb3ZhbCBzdGF0dXMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZGVudGl0eVJlY29yZCA9IGF3YWl0IHRoaXMuZ2V0T3JNaWdyYXRlSWRlbnRpdHlSZWNvcmQodXVpZCk7XG5cbiAgICBpZiAoIWlkZW50aXR5UmVjb3JkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNldEFwcHJvdmFsOiBObyBpZGVudGl0eSByZWNvcmQgZm9yICR7dXVpZH1gKTtcbiAgICB9XG5cbiAgICBpZGVudGl0eVJlY29yZC5ub25ibG9ja2luZ0FwcHJvdmFsID0gbm9uYmxvY2tpbmdBcHByb3ZhbDtcbiAgICBhd2FpdCB0aGlzLl9zYXZlSWRlbnRpdHlLZXkoaWRlbnRpdHlSZWNvcmQpO1xuICB9XG5cbiAgYXN5bmMgc2V0VmVyaWZpZWQoXG4gICAgdXVpZDogVVVJRCxcbiAgICB2ZXJpZmllZFN0YXR1czogbnVtYmVyLFxuICAgIHB1YmxpY0tleT86IFVpbnQ4QXJyYXlcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHV1aWQgPT09IG51bGwgfHwgdXVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFZlcmlmaWVkOiB1dWlkIHdhcyB1bmRlZmluZWQvbnVsbCcpO1xuICAgIH1cbiAgICBpZiAoIXZhbGlkYXRlVmVyaWZpZWRTdGF0dXModmVyaWZpZWRTdGF0dXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFZlcmlmaWVkOiBJbnZhbGlkIHZlcmlmaWVkIHN0YXR1cycpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkZW50aXR5UmVjb3JkID0gYXdhaXQgdGhpcy5nZXRPck1pZ3JhdGVJZGVudGl0eVJlY29yZCh1dWlkKTtcblxuICAgIGlmICghaWRlbnRpdHlSZWNvcmQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2V0VmVyaWZpZWQ6IE5vIGlkZW50aXR5IHJlY29yZCBmb3IgJHt1dWlkLnRvU3RyaW5nKCl9YCk7XG4gICAgfVxuXG4gICAgaWYgKCFwdWJsaWNLZXkgfHwgY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHlSZWNvcmQucHVibGljS2V5LCBwdWJsaWNLZXkpKSB7XG4gICAgICBpZGVudGl0eVJlY29yZC52ZXJpZmllZCA9IHZlcmlmaWVkU3RhdHVzO1xuXG4gICAgICBpZiAodmFsaWRhdGVJZGVudGl0eUtleShpZGVudGl0eVJlY29yZCkpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZUlkZW50aXR5S2V5KGlkZW50aXR5UmVjb3JkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oJ3NldFZlcmlmaWVkOiBObyBpZGVudGl0eSByZWNvcmQgZm9yIHNwZWNpZmllZCBwdWJsaWNLZXknKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRWZXJpZmllZCh1dWlkOiBVVUlEKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBpZiAodXVpZCA9PT0gbnVsbCB8fCB1dWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0VmVyaWZpZWQ6IHV1aWQgd2FzIHVuZGVmaW5lZC9udWxsJyk7XG4gICAgfVxuXG4gICAgY29uc3QgaWRlbnRpdHlSZWNvcmQgPSBhd2FpdCB0aGlzLmdldE9yTWlncmF0ZUlkZW50aXR5UmVjb3JkKHV1aWQpO1xuICAgIGlmICghaWRlbnRpdHlSZWNvcmQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZ2V0VmVyaWZpZWQ6IE5vIGlkZW50aXR5IHJlY29yZCBmb3IgJHt1dWlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcmlmaWVkU3RhdHVzID0gaWRlbnRpdHlSZWNvcmQudmVyaWZpZWQ7XG4gICAgaWYgKHZhbGlkYXRlVmVyaWZpZWRTdGF0dXModmVyaWZpZWRTdGF0dXMpKSB7XG4gICAgICByZXR1cm4gdmVyaWZpZWRTdGF0dXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIFZlcmlmaWVkU3RhdHVzLkRFRkFVTFQ7XG4gIH1cblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3NpZ25hbGFwcC9TaWduYWwtaU9TLVByaXZhdGUvYmxvYi9lMzJjMmRmZjBkMDNmNjc0NjdiNGRmNjIxZDg0YjExNDEyZDUwY2RiL1NpZ25hbFNlcnZpY2VLaXQvc3JjL01lc3NhZ2VzL09XU0lkZW50aXR5TWFuYWdlci5tI0wzMTdcbiAgLy8gZm9yIHJlZmVyZW5jZS5cbiAgYXN5bmMgcHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICB1dWlkOiBVVUlELFxuICAgIHZlcmlmaWVkU3RhdHVzOiBudW1iZXIsXG4gICAgcHVibGljS2V5PzogVWludDhBcnJheVxuICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAodXVpZCA9PT0gbnVsbCB8fCB1dWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZTogdXVpZCB3YXMgdW5kZWZpbmVkL251bGwnKTtcbiAgICB9XG4gICAgaWYgKCF2YWxpZGF0ZVZlcmlmaWVkU3RhdHVzKHZlcmlmaWVkU3RhdHVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzVmVyaWZpZWRNZXNzYWdlOiBJbnZhbGlkIHZlcmlmaWVkIHN0YXR1cycpO1xuICAgIH1cbiAgICBpZiAocHVibGljS2V5ICE9PSB1bmRlZmluZWQgJiYgIShwdWJsaWNLZXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzVmVyaWZpZWRNZXNzYWdlOiBJbnZhbGlkIHB1YmxpYyBrZXknKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZGVudGl0eVJlY29yZCA9IGF3YWl0IHRoaXMuZ2V0T3JNaWdyYXRlSWRlbnRpdHlSZWNvcmQodXVpZCk7XG5cbiAgICBsZXQgaXNFcXVhbCA9IGZhbHNlO1xuXG4gICAgaWYgKGlkZW50aXR5UmVjb3JkICYmIHB1YmxpY0tleSkge1xuICAgICAgaXNFcXVhbCA9IGNvbnN0YW50VGltZUVxdWFsKHB1YmxpY0tleSwgaWRlbnRpdHlSZWNvcmQucHVibGljS2V5KTtcbiAgICB9XG5cbiAgICAvLyBKdXN0IHVwZGF0ZSB2ZXJpZmllZCBzdGF0dXMgaWYgdGhlIGtleSBpcyB0aGUgc2FtZSBvciBub3QgcHJlc2VudFxuICAgIGlmIChpc0VxdWFsIHx8ICFwdWJsaWNLZXkpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2V0VmVyaWZpZWQodXVpZCwgdmVyaWZpZWRTdGF0dXMsIHB1YmxpY0tleSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5zYXZlSWRlbnRpdHlXaXRoQXR0cmlidXRlcyh1dWlkLCB7XG4gICAgICBwdWJsaWNLZXksXG4gICAgICB2ZXJpZmllZDogdmVyaWZpZWRTdGF0dXMsXG4gICAgICBmaXJzdFVzZTogZmFsc2UsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiB2ZXJpZmllZFN0YXR1cyA9PT0gVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQsXG4gICAgfSk7XG5cbiAgICBpZiAoaWRlbnRpdHlSZWNvcmQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigna2V5Y2hhbmdlJywgdXVpZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgJ3Byb2Nlc3NWZXJpZmllZE1lc3NhZ2UgZXJyb3IgdHJpZ2dlcmluZyBrZXljaGFuZ2U6JyxcbiAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIHRydWUgc2lnbmlmaWVzIHRoYXQgd2Ugb3Zlcndyb3RlIGEgcHJldmlvdXMga2V5IHdpdGggYSBuZXcgb25lXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1VudHJ1c3RlZCh1dWlkOiBVVUlEKTogYm9vbGVhbiB7XG4gICAgaWYgKHV1aWQgPT09IG51bGwgfHwgdXVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lzVW50cnVzdGVkOiB1dWlkIHdhcyB1bmRlZmluZWQvbnVsbCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkZW50aXR5UmVjb3JkID0gdGhpcy5nZXRJZGVudGl0eVJlY29yZCh1dWlkKTtcbiAgICBpZiAoIWlkZW50aXR5UmVjb3JkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzVW50cnVzdGVkOiBObyBpZGVudGl0eSByZWNvcmQgZm9yICR7dXVpZC50b1N0cmluZygpfWApO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGlzTW9yZVJlY2VudFRoYW4oaWRlbnRpdHlSZWNvcmQudGltZXN0YW1wLCBUSU1FU1RBTVBfVEhSRVNIT0xEKSAmJlxuICAgICAgIWlkZW50aXR5UmVjb3JkLm5vbmJsb2NraW5nQXBwcm92YWwgJiZcbiAgICAgICFpZGVudGl0eVJlY29yZC5maXJzdFVzZVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlSWRlbnRpdHlLZXkodXVpZDogVVVJRCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5pZGVudGl0eUtleXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlSWRlbnRpdHlLZXk6IHRoaXMuaWRlbnRpdHlLZXlzIG5vdCB5ZXQgY2FjaGVkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkID0gdXVpZC50b1N0cmluZygpO1xuICAgIHRoaXMuaWRlbnRpdHlLZXlzLmRlbGV0ZShpZCk7XG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUlkZW50aXR5S2V5QnlJZChpZCk7XG4gICAgYXdhaXQgdGhpcy5yZW1vdmVBbGxTZXNzaW9ucyhpZCk7XG4gIH1cblxuICAvLyBOb3QgeWV0IHByb2Nlc3NlZCBtZXNzYWdlcyAtIGZvciByZXNpbGllbmN5XG4gIGdldFVucHJvY2Vzc2VkQ291bnQoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZShHTE9CQUxfWk9ORSwgJ2dldFVucHJvY2Vzc2VkQ291bnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZXR1cm4gd2luZG93LlNpZ25hbC5EYXRhLmdldFVucHJvY2Vzc2VkQ291bnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTogUHJvbWlzZTxBcnJheTxVbnByb2Nlc3NlZFR5cGU+PiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoR0xPQkFMX1pPTkUsICdnZXRBbGxVbnByb2Nlc3NlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0QWxsVW5wcm9jZXNzZWRBbmRJbmNyZW1lbnRBdHRlbXB0cygpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VW5wcm9jZXNzZWRCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPFVucHJvY2Vzc2VkVHlwZSB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKEdMT0JBTF9aT05FLCAnZ2V0VW5wcm9jZXNzZWRCeUlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuRGF0YS5nZXRVbnByb2Nlc3NlZEJ5SWQoaWQpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkVW5wcm9jZXNzZWQoXG4gICAgZGF0YTogVW5wcm9jZXNzZWRUeXBlLFxuICAgIHsgem9uZSA9IEdMT0JBTF9aT05FIH06IFNlc3Npb25UcmFuc2FjdGlvbk9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZSh6b25lLCAnYWRkVW5wcm9jZXNzZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdVbnByb2Nlc3NlZC5zZXQoZGF0YS5pZCwgZGF0YSk7XG5cbiAgICAgIC8vIEN1cnJlbnQgem9uZSBkb2Vzbid0IHN1cHBvcnQgcGVuZGluZyB1bnByb2Nlc3NlZCAtIGNvbW1pdCBpbW1lZGlhdGVseVxuICAgICAgaWYgKCF6b25lLnN1cHBvcnRzUGVuZGluZ1VucHJvY2Vzc2VkKCkpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5jb21taXRab25lQ2hhbmdlcygnYWRkVW5wcm9jZXNzZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFkZE11bHRpcGxlVW5wcm9jZXNzZWQoXG4gICAgYXJyYXk6IEFycmF5PFVucHJvY2Vzc2VkVHlwZT4sXG4gICAgeyB6b25lID0gR0xPQkFMX1pPTkUgfTogU2Vzc2lvblRyYW5zYWN0aW9uT3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKHpvbmUsICdhZGRNdWx0aXBsZVVucHJvY2Vzc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbGVtIG9mIGFycmF5KSB7XG4gICAgICAgIHRoaXMucGVuZGluZ1VucHJvY2Vzc2VkLnNldChlbGVtLmlkLCBlbGVtKTtcbiAgICAgIH1cbiAgICAgIC8vIEN1cnJlbnQgem9uZSBkb2Vzbid0IHN1cHBvcnQgcGVuZGluZyB1bnByb2Nlc3NlZCAtIGNvbW1pdCBpbW1lZGlhdGVseVxuICAgICAgaWYgKCF6b25lLnN1cHBvcnRzUGVuZGluZ1VucHJvY2Vzc2VkKCkpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5jb21taXRab25lQ2hhbmdlcygnYWRkTXVsdGlwbGVVbnByb2Nlc3NlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlVW5wcm9jZXNzZWRXaXRoRGF0YShcbiAgICBpZDogc3RyaW5nLFxuICAgIGRhdGE6IFVucHJvY2Vzc2VkVXBkYXRlVHlwZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53aXRoWm9uZShHTE9CQUxfWk9ORSwgJ3VwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGEnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlVW5wcm9jZXNzZWRXaXRoRGF0YShpZCwgZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVVbnByb2Nlc3NlZHNXaXRoRGF0YShcbiAgICBpdGVtczogQXJyYXk8eyBpZDogc3RyaW5nOyBkYXRhOiBVbnByb2Nlc3NlZFVwZGF0ZVR5cGUgfT5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFpvbmUoXG4gICAgICBHTE9CQUxfWk9ORSxcbiAgICAgICd1cGRhdGVVbnByb2Nlc3NlZHNXaXRoRGF0YScsXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVVbnByb2Nlc3NlZHNXaXRoRGF0YShpdGVtcyk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHJlbW92ZVVucHJvY2Vzc2VkKGlkT3JBcnJheTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKEdMT0JBTF9aT05FLCAncmVtb3ZlVW5wcm9jZXNzZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlVW5wcm9jZXNzZWQoaWRPckFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZUFsbFVucHJvY2Vzc2VkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndpdGhab25lKEdMT0JBTF9aT05FLCAncmVtb3ZlQWxsVW5wcm9jZXNzZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlQWxsVW5wcm9jZXNzZWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZU91ck9sZFBuaShvbGRQbmk6IFVVSUQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHN0b3JhZ2UgfSA9IHdpbmRvdztcblxuICAgIGxvZy5pbmZvKGBTaWduYWxQcm90b2NvbFN0b3JlLnJlbW92ZU91ck9sZFBuaSgke29sZFBuaX0pYCk7XG5cbiAgICAvLyBVcGRhdGUgY2FjaGVzXG4gICAgdGhpcy5vdXJJZGVudGl0eUtleXMuZGVsZXRlKG9sZFBuaS50b1N0cmluZygpKTtcbiAgICB0aGlzLm91clJlZ2lzdHJhdGlvbklkcy5kZWxldGUob2xkUG5pLnRvU3RyaW5nKCkpO1xuXG4gICAgY29uc3QgcHJlS2V5UHJlZml4ID0gYCR7b2xkUG5pLnRvU3RyaW5nKCl9OmA7XG4gICAgaWYgKHRoaXMucHJlS2V5cykge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5wcmVLZXlzLmtleXMoKSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgocHJlS2V5UHJlZml4KSkge1xuICAgICAgICAgIHRoaXMucHJlS2V5cy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5zaWduZWRQcmVLZXlzKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLnNpZ25lZFByZUtleXMua2V5cygpKSB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwcmVLZXlQcmVmaXgpKSB7XG4gICAgICAgICAgdGhpcy5zaWduZWRQcmVLZXlzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGRhdGFiYXNlXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgc3RvcmFnZS5wdXQoXG4gICAgICAgICdpZGVudGl0eUtleU1hcCcsXG4gICAgICAgIG9taXQoc3RvcmFnZS5nZXQoJ2lkZW50aXR5S2V5TWFwJykgfHwge30sIG9sZFBuaS50b1N0cmluZygpKVxuICAgICAgKSxcbiAgICAgIHN0b3JhZ2UucHV0KFxuICAgICAgICAncmVnaXN0cmF0aW9uSWRNYXAnLFxuICAgICAgICBvbWl0KHN0b3JhZ2UuZ2V0KCdyZWdpc3RyYXRpb25JZE1hcCcpIHx8IHt9LCBvbGRQbmkudG9TdHJpbmcoKSlcbiAgICAgICksXG4gICAgICB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlUHJlS2V5c0J5VXVpZChvbGRQbmkudG9TdHJpbmcoKSksXG4gICAgICB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlU2lnbmVkUHJlS2V5c0J5VXVpZChvbGRQbmkudG9TdHJpbmcoKSksXG4gICAgXSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVPdXJQbmlLZXlNYXRlcmlhbChcbiAgICBwbmk6IFVVSUQsXG4gICAge1xuICAgICAgaWRlbnRpdHlLZXlQYWlyOiBpZGVudGl0eUJ5dGVzLFxuICAgICAgc2lnbmVkUHJlS2V5OiBzaWduZWRQcmVLZXlCeXRlcyxcbiAgICAgIHJlZ2lzdHJhdGlvbklkLFxuICAgIH06IFBuaUtleU1hdGVyaWFsVHlwZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbyhgU2lnbmFsUHJvdG9jb2xTdG9yZS51cGRhdGVPdXJQbmlLZXlNYXRlcmlhbCgke3BuaX0pYCk7XG5cbiAgICBjb25zdCBpZGVudGl0eUtleVBhaXIgPSBJZGVudGl0eUtleVBhaXIuZGVzZXJpYWxpemUoXG4gICAgICBCdWZmZXIuZnJvbShpZGVudGl0eUJ5dGVzKVxuICAgICk7XG4gICAgY29uc3Qgc2lnbmVkUHJlS2V5ID0gU2lnbmVkUHJlS2V5UmVjb3JkLmRlc2VyaWFsaXplKFxuICAgICAgQnVmZmVyLmZyb20oc2lnbmVkUHJlS2V5Qnl0ZXMpXG4gICAgKTtcblxuICAgIGNvbnN0IHsgc3RvcmFnZSB9ID0gd2luZG93O1xuXG4gICAgY29uc3QgcG5pUHVibGljS2V5ID0gaWRlbnRpdHlLZXlQYWlyLnB1YmxpY0tleS5zZXJpYWxpemUoKTtcbiAgICBjb25zdCBwbmlQcml2YXRlS2V5ID0gaWRlbnRpdHlLZXlQYWlyLnByaXZhdGVLZXkuc2VyaWFsaXplKCk7XG5cbiAgICAvLyBVcGRhdGUgY2FjaGVzXG4gICAgdGhpcy5vdXJJZGVudGl0eUtleXMuc2V0KHBuaS50b1N0cmluZygpLCB7XG4gICAgICBwdWJLZXk6IHBuaVB1YmxpY0tleSxcbiAgICAgIHByaXZLZXk6IHBuaVByaXZhdGVLZXksXG4gICAgfSk7XG4gICAgdGhpcy5vdXJSZWdpc3RyYXRpb25JZHMuc2V0KHBuaS50b1N0cmluZygpLCByZWdpc3RyYXRpb25JZCk7XG5cbiAgICAvLyBVcGRhdGUgZGF0YWJhc2VcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBzdG9yYWdlLnB1dCgnaWRlbnRpdHlLZXlNYXAnLCB7XG4gICAgICAgIC4uLihzdG9yYWdlLmdldCgnaWRlbnRpdHlLZXlNYXAnKSB8fCB7fSksXG4gICAgICAgIFtwbmkudG9TdHJpbmcoKV06IHtcbiAgICAgICAgICBwdWJLZXk6IHBuaVB1YmxpY0tleSxcbiAgICAgICAgICBwcml2S2V5OiBwbmlQcml2YXRlS2V5LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBzdG9yYWdlLnB1dCgncmVnaXN0cmF0aW9uSWRNYXAnLCB7XG4gICAgICAgIC4uLihzdG9yYWdlLmdldCgncmVnaXN0cmF0aW9uSWRNYXAnKSB8fCB7fSksXG4gICAgICAgIFtwbmkudG9TdHJpbmcoKV06IHJlZ2lzdHJhdGlvbklkLFxuICAgICAgfSksXG4gICAgICB0aGlzLnN0b3JlU2lnbmVkUHJlS2V5KFxuICAgICAgICBwbmksXG4gICAgICAgIHNpZ25lZFByZUtleS5pZCgpLFxuICAgICAgICB7XG4gICAgICAgICAgcHJpdktleTogc2lnbmVkUHJlS2V5LnByaXZhdGVLZXkoKS5zZXJpYWxpemUoKSxcbiAgICAgICAgICBwdWJLZXk6IHNpZ25lZFByZUtleS5wdWJsaWNLZXkoKS5zZXJpYWxpemUoKSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgc2lnbmVkUHJlS2V5LnRpbWVzdGFtcCgpXG4gICAgICApLFxuICAgIF0pO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQWxsRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlQWxsKCk7XG4gICAgYXdhaXQgdGhpcy5oeWRyYXRlQ2FjaGVzKCk7XG5cbiAgICB3aW5kb3cuc3RvcmFnZS5yZXNldCgpO1xuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLmZldGNoKCk7XG5cbiAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5yZXNldCgpO1xuICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvYWQoKTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUFsbENvbmZpZ3VyYXRpb24obW9kZTogUmVtb3ZlQWxsQ29uZmlndXJhdGlvbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVBbGxDb25maWd1cmF0aW9uKG1vZGUpO1xuICAgIGF3YWl0IHRoaXMuaHlkcmF0ZUNhY2hlcygpO1xuXG4gICAgd2luZG93LnN0b3JhZ2UucmVzZXQoKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5mZXRjaCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QWxsU2Vzc2lvbnMoKTogQXJyYXk8U2Vzc2lvbkNhY2hlRW50cnk+IHtcbiAgICBjb25zdCB1bmlvbiA9IG5ldyBNYXA8c3RyaW5nLCBTZXNzaW9uQ2FjaGVFbnRyeT4oKTtcblxuICAgIHRoaXMuc2Vzc2lvbnM/LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHVuaW9uLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnBlbmRpbmdTZXNzaW9ucy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICB1bmlvbi5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbSh1bmlvbi52YWx1ZXMoKSk7XG4gIH1cbn1cblxud2luZG93LlNpZ25hbFByb3RvY29sU3RvcmUgPSBTaWduYWxQcm90b2NvbFN0b3JlO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHFCQUFtQjtBQUNuQixvQkFBK0I7QUFDL0IsaUJBQWtCO0FBRWxCLDhCQVNPO0FBRVAsWUFBdUI7QUFDdkIsb0JBQWtDO0FBQ2xDLG9CQUFxQztBQUNyQyxzQkFBeUI7QUFDekIsa0JBQXFCO0FBQ3JCLHVCQUFpQztBQUNqQyxnQ0FHTztBQXNCUCxrQkFBK0I7QUFHL0IsOEJBQWlDO0FBQ2pDLFVBQXFCO0FBQ3JCLGlDQUFvQztBQUNwQyxhQUF3QjtBQUN4Qix5QkFBMEI7QUFDMUIsdUJBQXVCO0FBRXZCLE1BQU0sc0JBQXNCLElBQUk7QUFFaEMsTUFBTSxpQkFBaUI7QUFBQSxFQUNy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
