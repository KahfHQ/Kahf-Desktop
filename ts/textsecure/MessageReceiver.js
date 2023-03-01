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
var MessageReceiver_exports = {};
__export(MessageReceiver_exports, {
  default: () => MessageReceiver
});
module.exports = __toCommonJS(MessageReceiver_exports);
var import_lodash = require("lodash");
var import_p_queue = __toESM(require("p-queue"));
var import_uuid = require("uuid");
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_LibSignalStores = require("../LibSignalStores");
var import_Curve = require("../Curve");
var import_assert = require("../util/assert");
var import_batcher = require("../util/batcher");
var import_dropNull = require("../util/dropNull");
var import_normalizeUuid = require("../util/normalizeUuid");
var import_parseIntOrThrow = require("../util/parseIntOrThrow");
var import_clearTimeoutIfNecessary = require("../util/clearTimeoutIfNecessary");
var import_Zone = require("../util/Zone");
var import_Crypto = require("../Crypto");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
var Errors = __toESM(require("../types/errors"));
var import_RemoteConfig = require("../RemoteConfig");
var import_protobuf = require("../protobuf");
var import_groups = require("../groups");
var import_TaskWithTimeout = __toESM(require("./TaskWithTimeout"));
var import_processDataMessage = require("./processDataMessage");
var import_processSyncMessage = require("./processSyncMessage");
var import_EventTarget = __toESM(require("./EventTarget"));
var import_downloadAttachment = require("./downloadAttachment");
var import_ContactsParser = require("./ContactsParser");
var import_Errors = require("./Errors");
var Bytes = __toESM(require("../Bytes"));
var import_messageReceiverEvents = require("./messageReceiverEvents");
var log = __toESM(require("../logging/log"));
var durations = __toESM(require("../util/durations"));
var import_areArraysMatchingSets = require("../util/areArraysMatchingSets");
var import_generateBlurHash = require("../util/generateBlurHash");
var import_MIME = require("../types/MIME");
const GROUPV1_ID_LENGTH = 16;
const GROUPV2_ID_LENGTH = 32;
const RETRY_TIMEOUT = 2 * 60 * 1e3;
var TaskType = /* @__PURE__ */ ((TaskType2) => {
  TaskType2["Encrypted"] = "Encrypted";
  TaskType2["Decrypted"] = "Decrypted";
  return TaskType2;
})(TaskType || {});
const LOG_UNEXPECTED_URGENT_VALUES = false;
const MUST_BE_URGENT_TYPES = [
  "message",
  "deleteForEveryone",
  "reaction",
  "readSync"
];
const CAN_BE_URGENT_TYPES = [
  "callingMessage",
  "senderKeyDistributionMessage",
  "resetSession",
  "legacyGroupChange"
];
function logUnexpectedUrgentValue(envelope, type) {
  if (!LOG_UNEXPECTED_URGENT_VALUES) {
    return;
  }
  const mustBeUrgent = MUST_BE_URGENT_TYPES.includes(type);
  const canBeUrgent = mustBeUrgent || CAN_BE_URGENT_TYPES.includes(type);
  if (envelope.urgent && !canBeUrgent) {
    const envelopeId = getEnvelopeId(envelope);
    log.warn(`${envelopeId}: Message of type '${type}' was marked urgent, but shouldn't be!`);
  }
  if (!envelope.urgent && mustBeUrgent) {
    const envelopeId = getEnvelopeId(envelope);
    log.warn(`${envelopeId}: Message of type '${type}' wasn't marked urgent, but should be!`);
  }
}
function getEnvelopeId(envelope) {
  const { timestamp } = envelope;
  let prefix = "";
  if (envelope.sourceUuid || envelope.source) {
    const sender = envelope.sourceUuid || envelope.source;
    prefix += `${sender}.${envelope.sourceDevice} `;
  }
  prefix += `> ${envelope.destinationUuid.toString()}`;
  return `${prefix} ${timestamp} (${envelope.id})`;
}
class MessageReceiver extends import_EventTarget.default {
  constructor({ server, storage, serverTrustRoot }) {
    super();
    this.server = server;
    this.storage = storage;
    this.count = 0;
    this.processedCount = 0;
    if (!serverTrustRoot) {
      throw new Error("Server trust root is required!");
    }
    this.serverTrustRoot = Bytes.fromBase64(serverTrustRoot);
    this.incomingQueue = new import_p_queue.default({
      concurrency: 1,
      throwOnTimeout: true
    });
    this.appQueue = new import_p_queue.default({
      concurrency: 1,
      throwOnTimeout: true
    });
    this.encryptedQueue = new import_p_queue.default({
      concurrency: 1,
      throwOnTimeout: true
    });
    this.decryptedQueue = new import_p_queue.default({
      concurrency: 1,
      throwOnTimeout: true
    });
    this.decryptAndCacheBatcher = (0, import_batcher.createBatcher)({
      name: "MessageReceiver.decryptAndCacheBatcher",
      wait: 75,
      maxSize: 30,
      processBatch: (items) => {
        this.decryptAndCacheBatch(items);
      }
    });
    this.cacheRemoveBatcher = (0, import_batcher.createBatcher)({
      name: "MessageReceiver.cacheRemoveBatcher",
      wait: 75,
      maxSize: 30,
      processBatch: this.cacheRemoveBatch.bind(this)
    });
  }
  getAndResetProcessedCount() {
    const count = this.processedCount;
    this.processedCount = 0;
    return count;
  }
  handleRequest(request) {
    log.info("MessageReceiver: got request", request.verb, request.path);
    if (request.path !== "/api/v1/message") {
      request.respond(200, "OK");
      if (request.verb === "PUT" && request.path === "/api/v1/queue/empty") {
        this.incomingQueue.add((0, import_TaskWithTimeout.default)(async () => {
          this.onEmpty();
        }, "incomingQueue/onEmpty"));
      }
      return;
    }
    const job = /* @__PURE__ */ __name(async () => {
      const headers = request.headers || [];
      if (!request.body) {
        throw new Error("MessageReceiver.handleRequest: request.body was falsey!");
      }
      const plaintext = request.body;
      try {
        const decoded = import_protobuf.SignalService.Envelope.decode(plaintext);
        const serverTimestamp = decoded.serverTimestamp?.toNumber();
        const ourUuid = this.storage.user.getCheckedUuid();
        const envelope = {
          id: (0, import_uuid.v4)().replace(/-/g, ""),
          receivedAtCounter: window.Signal.Util.incrementMessageCounter(),
          receivedAtDate: Date.now(),
          messageAgeSec: this.calculateMessageAge(headers, serverTimestamp),
          type: decoded.type,
          sourceUuid: decoded.sourceUuid ? (0, import_normalizeUuid.normalizeUuid)(decoded.sourceUuid, "MessageReceiver.handleRequest.sourceUuid") : void 0,
          sourceDevice: decoded.sourceDevice,
          destinationUuid: decoded.destinationUuid ? new import_UUID.UUID((0, import_normalizeUuid.normalizeUuid)(decoded.destinationUuid, "MessageReceiver.handleRequest.destinationUuid")) : ourUuid,
          updatedPni: decoded.updatedPni ? new import_UUID.UUID((0, import_normalizeUuid.normalizeUuid)(decoded.updatedPni, "MessageReceiver.handleRequest.updatedPni")) : void 0,
          timestamp: decoded.timestamp?.toNumber(),
          content: (0, import_dropNull.dropNull)(decoded.content),
          serverGuid: decoded.serverGuid,
          serverTimestamp,
          urgent: (0, import_lodash.isBoolean)(decoded.urgent) ? decoded.urgent : true
        };
        this.decryptAndCache(envelope, plaintext, request);
        this.processedCount += 1;
      } catch (e) {
        request.respond(500, "Bad encrypted websocket message");
        log.error("Error handling incoming message:", Errors.toLogFormat(e));
        await this.dispatchAndWait(new import_messageReceiverEvents.ErrorEvent(e));
      }
    }, "job");
    this.incomingQueue.add((0, import_TaskWithTimeout.default)(job, "incomingQueue/websocket"));
  }
  reset() {
    this.incomingQueue.add((0, import_TaskWithTimeout.default)(async () => this.queueAllCached(), "incomingQueue/queueAllCached"));
    this.count = 0;
    this.isEmptied = false;
    this.stoppingProcessing = false;
  }
  stopProcessing() {
    log.info("MessageReceiver.stopProcessing");
    this.stoppingProcessing = true;
  }
  hasEmptied() {
    return Boolean(this.isEmptied);
  }
  async drain() {
    const waitForEncryptedQueue = /* @__PURE__ */ __name(async () => this.addToQueue(async () => {
      log.info("drained");
    }, "drain/waitForDecrypted", "Decrypted" /* Decrypted */), "waitForEncryptedQueue");
    const waitForIncomingQueue = /* @__PURE__ */ __name(async () => this.addToQueue(waitForEncryptedQueue, "drain/waitForEncrypted", "Encrypted" /* Encrypted */), "waitForIncomingQueue");
    return this.incomingQueue.add((0, import_TaskWithTimeout.default)(waitForIncomingQueue, "drain/waitForIncoming"));
  }
  addEventListener(name, handler) {
    return super.addEventListener(name, handler);
  }
  removeEventListener(name, handler) {
    return super.removeEventListener(name, handler);
  }
  async dispatchAndWait(event) {
    this.appQueue.add((0, import_TaskWithTimeout.default)(async () => Promise.all(this.dispatchEvent(event)), "dispatchEvent"));
  }
  calculateMessageAge(headers, serverTimestamp) {
    let messageAgeSec = 0;
    if (serverTimestamp) {
      let it = headers.length;
      while (--it >= 0) {
        const match = headers[it].match(/^X-Signal-Timestamp:\s*(\d+)\s*$/);
        if (match && match.length === 2) {
          const timestamp = Number(match[1]);
          if (timestamp > serverTimestamp) {
            messageAgeSec = Math.floor((timestamp - serverTimestamp) / 1e3);
          }
          break;
        }
      }
    }
    return messageAgeSec;
  }
  async addToQueue(task, id, taskType) {
    if (taskType === "Encrypted" /* Encrypted */) {
      this.count += 1;
    }
    const queue = taskType === "Encrypted" /* Encrypted */ ? this.encryptedQueue : this.decryptedQueue;
    try {
      return await queue.add((0, import_TaskWithTimeout.default)(task, id));
    } finally {
      this.updateProgress(this.count);
    }
  }
  onEmpty() {
    const emitEmpty = /* @__PURE__ */ __name(async () => {
      await Promise.all([
        this.decryptAndCacheBatcher.flushAndWait(),
        this.cacheRemoveBatcher.flushAndWait()
      ]);
      log.info("MessageReceiver: emitting 'empty' event");
      this.dispatchEvent(new import_messageReceiverEvents.EmptyEvent());
      this.isEmptied = true;
      this.maybeScheduleRetryTimeout();
    }, "emitEmpty");
    const waitForDecryptedQueue = /* @__PURE__ */ __name(async () => {
      log.info("MessageReceiver: finished processing messages after 'empty', now waiting for application");
      this.appQueue.add((0, import_TaskWithTimeout.default)(emitEmpty, "emitEmpty"));
    }, "waitForDecryptedQueue");
    const waitForEncryptedQueue = /* @__PURE__ */ __name(async () => {
      this.addToQueue(waitForDecryptedQueue, "onEmpty/waitForDecrypted", "Decrypted" /* Decrypted */);
    }, "waitForEncryptedQueue");
    const waitForIncomingQueue = /* @__PURE__ */ __name(async () => {
      this.count = 0;
      this.addToQueue(waitForEncryptedQueue, "onEmpty/waitForEncrypted", "Encrypted" /* Encrypted */);
    }, "waitForIncomingQueue");
    const waitForCacheAddBatcher = /* @__PURE__ */ __name(async () => {
      await this.decryptAndCacheBatcher.onIdle();
      this.incomingQueue.add((0, import_TaskWithTimeout.default)(waitForIncomingQueue, "onEmpty/waitForIncoming"));
    }, "waitForCacheAddBatcher");
    waitForCacheAddBatcher();
  }
  updateProgress(count) {
    if (count % 10 !== 0) {
      return;
    }
    this.dispatchEvent(new import_messageReceiverEvents.ProgressEvent({ count }));
  }
  async queueAllCached() {
    const items = await this.getAllFromCache();
    const max = items.length;
    for (let i = 0; i < max; i += 1) {
      await this.queueCached(items[i]);
    }
  }
  async queueCached(item) {
    log.info("MessageReceiver.queueCached", item.id);
    try {
      let envelopePlaintext;
      if (item.envelope && item.version === 2) {
        envelopePlaintext = Bytes.fromBase64(item.envelope);
      } else if (item.envelope && typeof item.envelope === "string") {
        envelopePlaintext = Bytes.fromBinary(item.envelope);
      } else {
        throw new Error("MessageReceiver.queueCached: item.envelope was malformed");
      }
      const decoded = import_protobuf.SignalService.Envelope.decode(envelopePlaintext);
      const ourUuid = this.storage.user.getCheckedUuid();
      const envelope = {
        id: item.id,
        receivedAtCounter: item.receivedAtCounter ?? item.timestamp,
        receivedAtDate: item.receivedAtCounter === null ? Date.now() : item.timestamp,
        messageAgeSec: item.messageAgeSec || 0,
        type: decoded.type,
        source: item.source,
        sourceUuid: decoded.sourceUuid ? import_UUID.UUID.cast(decoded.sourceUuid) : item.sourceUuid,
        sourceDevice: decoded.sourceDevice || item.sourceDevice,
        destinationUuid: new import_UUID.UUID(decoded.destinationUuid || item.destinationUuid || ourUuid.toString()),
        updatedPni: decoded.updatedPni ? new import_UUID.UUID(decoded.updatedPni) : void 0,
        timestamp: decoded.timestamp?.toNumber(),
        content: (0, import_dropNull.dropNull)(decoded.content),
        serverGuid: decoded.serverGuid,
        serverTimestamp: item.serverTimestamp || decoded.serverTimestamp?.toNumber(),
        urgent: (0, import_lodash.isBoolean)(item.urgent) ? item.urgent : true
      };
      const { decrypted } = item;
      if (decrypted) {
        let payloadPlaintext;
        if (item.version === 2) {
          payloadPlaintext = Bytes.fromBase64(decrypted);
        } else if (typeof decrypted === "string") {
          payloadPlaintext = Bytes.fromBinary(decrypted);
        } else {
          throw new Error("Cached decrypted value was not a string!");
        }
        this.addToQueue(async () => {
          this.queueDecryptedEnvelope(envelope, payloadPlaintext);
        }, "queueDecryptedEnvelope", "Encrypted" /* Encrypted */);
      } else {
        this.queueCachedEnvelope(item, envelope);
      }
    } catch (error) {
      log.error("queueCached error handling item", item.id, "removing it. Error:", Errors.toLogFormat(error));
      try {
        const { id } = item;
        await this.storage.protocol.removeUnprocessed(id);
      } catch (deleteError) {
        log.error("queueCached error deleting item", item.id, "Error:", Errors.toLogFormat(deleteError));
      }
    }
  }
  clearRetryTimeout() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(this.retryCachedTimeout);
    this.retryCachedTimeout = void 0;
  }
  maybeScheduleRetryTimeout() {
    if (this.isEmptied) {
      this.clearRetryTimeout();
      this.retryCachedTimeout = setTimeout(() => {
        this.incomingQueue.add((0, import_TaskWithTimeout.default)(async () => this.queueAllCached(), "queueAllCached"));
      }, RETRY_TIMEOUT);
    }
  }
  async getAllFromCache() {
    log.info("getAllFromCache");
    const count = await this.storage.protocol.getUnprocessedCount();
    if (count > 1500) {
      await this.storage.protocol.removeAllUnprocessed();
      log.warn(`There were ${count} messages in cache. Deleted all instead of reprocessing`);
      return [];
    }
    const items = await this.storage.protocol.getAllUnprocessedAndIncrementAttempts();
    log.info("getAllFromCache loaded", items.length, "saved envelopes");
    return items;
  }
  async decryptAndCacheBatch(items) {
    log.info("MessageReceiver.decryptAndCacheBatch", items.length);
    const decrypted = [];
    const storageProtocol = this.storage.protocol;
    try {
      const zone = new import_Zone.Zone("decryptAndCacheBatch", {
        pendingSenderKeys: true,
        pendingSessions: true,
        pendingUnprocessed: true
      });
      const storesMap = /* @__PURE__ */ new Map();
      const failed = [];
      await storageProtocol.withZone(zone, "MessageReceiver", async () => {
        await Promise.all(items.map(async ({ data, envelope }) => {
          try {
            const { destinationUuid } = envelope;
            let stores = storesMap.get(destinationUuid.toString());
            if (!stores) {
              stores = {
                senderKeyStore: new import_LibSignalStores.SenderKeys({
                  ourUuid: destinationUuid,
                  zone
                }),
                sessionStore: new import_LibSignalStores.Sessions({
                  zone,
                  ourUuid: destinationUuid
                }),
                identityKeyStore: new import_LibSignalStores.IdentityKeys({
                  zone,
                  ourUuid: destinationUuid
                }),
                zone
              };
              storesMap.set(destinationUuid.toString(), stores);
            }
            const result = await this.queueEncryptedEnvelope(stores, envelope);
            if (result.plaintext) {
              decrypted.push({
                plaintext: result.plaintext,
                envelope: result.envelope,
                data
              });
            }
          } catch (error) {
            failed.push(data);
            log.error("MessageReceiver.decryptAndCacheBatch error when processing the envelope", Errors.toLogFormat(error));
          }
        }));
        log.info(`MessageReceiver.decryptAndCacheBatch storing ${decrypted.length} decrypted envelopes, keeping ${failed.length} failed envelopes.`);
        const unprocesseds = decrypted.map(({ envelope, data, plaintext }) => {
          return {
            ...data,
            source: envelope.source,
            sourceUuid: envelope.sourceUuid,
            sourceDevice: envelope.sourceDevice,
            destinationUuid: envelope.destinationUuid.toString(),
            updatedPni: envelope.updatedPni?.toString(),
            serverGuid: envelope.serverGuid,
            serverTimestamp: envelope.serverTimestamp,
            decrypted: Bytes.toBase64(plaintext)
          };
        });
        await storageProtocol.addMultipleUnprocessed(unprocesseds.concat(failed), { zone });
      });
      log.info("MessageReceiver.decryptAndCacheBatch acknowledging receipt");
      for (const { request } of items) {
        try {
          request.respond(200, "OK");
        } catch (error) {
          log.error("decryptAndCacheBatch: Failed to send 200 to server; still queuing envelope");
        }
      }
    } catch (error) {
      log.error("decryptAndCache error trying to add messages to cache:", Errors.toLogFormat(error));
      items.forEach((item) => {
        item.request.respond(500, "Failed to cache message");
      });
      return;
    }
    await Promise.all(decrypted.map(async ({ envelope, plaintext }) => {
      try {
        await this.queueDecryptedEnvelope(envelope, plaintext);
      } catch (error) {
        log.error("decryptAndCache error when processing decrypted envelope", Errors.toLogFormat(error));
      }
    }));
    log.info("MessageReceiver.decryptAndCacheBatch fully processed");
    this.maybeScheduleRetryTimeout();
  }
  decryptAndCache(envelope, plaintext, request) {
    const { id } = envelope;
    const data = {
      id,
      version: 2,
      attempts: 1,
      envelope: Bytes.toBase64(plaintext),
      messageAgeSec: envelope.messageAgeSec,
      receivedAtCounter: envelope.receivedAtCounter,
      timestamp: envelope.timestamp,
      urgent: envelope.urgent
    };
    this.decryptAndCacheBatcher.add({
      request,
      envelope,
      data
    });
  }
  async cacheRemoveBatch(items) {
    await this.storage.protocol.removeUnprocessed(items);
  }
  removeFromCache(envelope) {
    const { id } = envelope;
    this.cacheRemoveBatcher.add(id);
  }
  async queueDecryptedEnvelope(envelope, plaintext) {
    const id = getEnvelopeId(envelope);
    log.info("queueing decrypted envelope", id);
    const task = this.handleDecryptedEnvelope.bind(this, envelope, plaintext);
    const taskWithTimeout = (0, import_TaskWithTimeout.default)(task, `queueDecryptedEnvelope ${id}`);
    try {
      await this.addToQueue(taskWithTimeout, "dispatchEvent", "Decrypted" /* Decrypted */);
    } catch (error) {
      log.error(`queueDecryptedEnvelope error handling envelope ${id}:`, Errors.toLogFormat(error));
    }
  }
  async queueEncryptedEnvelope(stores, envelope) {
    let logId = getEnvelopeId(envelope);
    log.info("queueing envelope", logId);
    const task = /* @__PURE__ */ __name(async () => {
      const { destinationUuid } = envelope;
      const uuidKind = this.storage.user.getOurUuidKind(destinationUuid);
      if (uuidKind === import_UUID.UUIDKind.Unknown) {
        log.warn(`MessageReceiver.decryptAndCacheBatch: Rejecting envelope ${getEnvelopeId(envelope)}, unknown uuid: ${destinationUuid}`);
        return { plaintext: void 0, envelope };
      }
      const unsealedEnvelope = await this.unsealEnvelope(stores, envelope, uuidKind);
      if (!unsealedEnvelope) {
        return { plaintext: void 0, envelope };
      }
      logId = getEnvelopeId(unsealedEnvelope);
      this.addToQueue(async () => this.dispatchEvent(new import_messageReceiverEvents.EnvelopeEvent(unsealedEnvelope)), "dispatchEvent", "Decrypted" /* Decrypted */);
      return this.decryptEnvelope(stores, unsealedEnvelope, uuidKind);
    }, "task");
    try {
      return await this.addToQueue(task, `MessageReceiver: unseal and decrypt ${logId}`, "Encrypted" /* Encrypted */);
    } catch (error) {
      const args = [
        "queueEncryptedEnvelope error handling envelope",
        logId,
        ":",
        Errors.toLogFormat(error)
      ];
      if (error instanceof import_Errors.WarnOnlyError) {
        log.warn(...args);
      } else {
        log.error(...args);
      }
      throw error;
    }
  }
  async queueCachedEnvelope(data, envelope) {
    this.decryptAndCacheBatcher.add({
      request: {
        respond(code, status) {
          log.info(`queueCachedEnvelope: fake response with code ${code} and status ${status}`);
        }
      },
      envelope,
      data
    });
  }
  async handleDecryptedEnvelope(envelope, plaintext) {
    if (this.stoppingProcessing) {
      return;
    }
    if (envelope.content) {
      await this.innerHandleContentMessage(envelope, plaintext);
      return;
    }
    this.removeFromCache(envelope);
    throw new Error("Received message with no content");
  }
  async unsealEnvelope(stores, envelope, uuidKind) {
    const logId = getEnvelopeId(envelope);
    if (this.stoppingProcessing) {
      log.warn(`MessageReceiver.unsealEnvelope(${logId}): dropping`);
      throw new Error("Sealed envelope dropped due to stopping processing");
    }
    if (envelope.type !== import_protobuf.SignalService.Envelope.Type.UNIDENTIFIED_SENDER) {
      return {
        ...envelope,
        cipherTextBytes: envelope.content,
        cipherTextType: envelopeTypeToCiphertextType(envelope.type)
      };
    }
    if (uuidKind === import_UUID.UUIDKind.PNI) {
      log.warn(`MessageReceiver.unsealEnvelope(${logId}): dropping for PNI`);
      return void 0;
    }
    (0, import_assert.strictAssert)(uuidKind === import_UUID.UUIDKind.ACI, "Sealed non-ACI envelope");
    const ciphertext = envelope.content;
    if (!ciphertext) {
      this.removeFromCache(envelope);
      throw new Error("Received message with no content");
    }
    log.info(`MessageReceiver.unsealEnvelope(${logId}): unidentified message`);
    const messageContent = await (0, import_libsignal_client.sealedSenderDecryptToUsmc)(Buffer.from(ciphertext), stores.identityKeyStore);
    const certificate = messageContent.senderCertificate();
    const originalSource = envelope.source;
    const originalSourceUuid = envelope.sourceUuid;
    const newEnvelope = {
      ...envelope,
      cipherTextBytes: messageContent.contents(),
      cipherTextType: messageContent.msgType(),
      source: (0, import_dropNull.dropNull)(certificate.senderE164()),
      sourceUuid: (0, import_normalizeUuid.normalizeUuid)(certificate.senderUuid(), "MessageReceiver.unsealEnvelope.UNIDENTIFIED_SENDER.sourceUuid"),
      sourceDevice: certificate.senderDeviceId(),
      unidentifiedDeliveryReceived: !(originalSource || originalSourceUuid),
      contentHint: messageContent.contentHint(),
      groupId: messageContent.groupId()?.toString("base64"),
      certificate,
      unsealedContent: messageContent
    };
    this.validateUnsealedEnvelope(newEnvelope);
    return newEnvelope;
  }
  async decryptEnvelope(stores, envelope, uuidKind) {
    const logId = getEnvelopeId(envelope);
    if (this.stoppingProcessing) {
      log.warn(`MessageReceiver.decryptEnvelope(${logId}): dropping unsealed`);
      throw new Error("Unsealed envelope dropped due to stopping processing");
    }
    if (envelope.type === import_protobuf.SignalService.Envelope.Type.RECEIPT) {
      await this.onDeliveryReceipt(envelope);
      return { plaintext: void 0, envelope };
    }
    let ciphertext;
    if (envelope.content) {
      ciphertext = envelope.content;
    } else {
      this.removeFromCache(envelope);
      (0, import_assert.strictAssert)(false, "Contentless envelope should be handled by unsealEnvelope");
    }
    log.info(`MessageReceiver.decryptEnvelope(${logId})`);
    const plaintext = await this.decrypt(stores, envelope, ciphertext, uuidKind);
    if (!plaintext) {
      log.warn("MessageReceiver.decryptEnvelope: plaintext was falsey");
      return { plaintext, envelope };
    }
    let isGroupV2 = false;
    try {
      const content = import_protobuf.SignalService.Content.decode(plaintext);
      isGroupV2 = Boolean(content.dataMessage?.groupV2);
      if (content.senderKeyDistributionMessage && Bytes.isNotEmpty(content.senderKeyDistributionMessage)) {
        await this.handleSenderKeyDistributionMessage(stores, envelope, content.senderKeyDistributionMessage);
      }
      const { syncMessage } = content;
      if (syncMessage?.pniIdentity) {
        await this.handlePNIIdentity(envelope, syncMessage.pniIdentity);
        return { plaintext: void 0, envelope };
      }
      if (syncMessage?.pniChangeNumber) {
        await this.handlePNIChangeNumber(envelope, syncMessage.pniChangeNumber);
        return { plaintext: void 0, envelope };
      }
    } catch (error) {
      log.error(`MessageReceiver.decryptEnvelope: Failed to process sender key distribution message: ${Errors.toLogFormat(error)}`);
    }
    if (!isGroupV2 && (envelope.source && this.isBlocked(envelope.source) || envelope.sourceUuid && this.isUuidBlocked(envelope.sourceUuid))) {
      log.info("MessageReceiver.decryptEnvelope: Dropping non-GV2 message from blocked sender");
      return { plaintext: void 0, envelope };
    }
    return { plaintext, envelope };
  }
  validateUnsealedEnvelope(envelope) {
    const { unsealedContent: messageContent, certificate } = envelope;
    (0, import_assert.strictAssert)(messageContent !== void 0, "Missing message content for sealed sender message");
    (0, import_assert.strictAssert)(certificate !== void 0, "Missing sender certificate for sealed sender message");
    if (!envelope.serverTimestamp) {
      throw new Error("MessageReceiver.decryptSealedSender: Sealed sender message was missing serverTimestamp");
    }
    const serverCertificate = certificate.serverCertificate();
    if (!(0, import_Curve.verifySignature)(this.serverTrustRoot, serverCertificate.certificateData(), serverCertificate.signature())) {
      throw new Error("MessageReceiver.validateUnsealedEnvelope: Server certificate trust root validation failed");
    }
    if (!(0, import_Curve.verifySignature)(serverCertificate.key().serialize(), certificate.certificate(), certificate.signature())) {
      throw new Error("MessageReceiver.validateUnsealedEnvelope: Server certificate server signature validation failed");
    }
    const logId = getEnvelopeId(envelope);
    if (envelope.serverTimestamp > certificate.expiration()) {
      throw new Error(`MessageReceiver.validateUnsealedEnvelope: Sender certificate is expired for envelope ${logId}, serverTimestamp: ${envelope.serverTimestamp}, expiration: ${certificate.expiration()}`);
    }
    return void 0;
  }
  async onDeliveryReceipt(envelope) {
    logUnexpectedUrgentValue(envelope, "deliveryReceipt");
    await this.dispatchAndWait(new import_messageReceiverEvents.DeliveryEvent({
      timestamp: envelope.timestamp,
      envelopeTimestamp: envelope.serverTimestamp,
      source: envelope.source,
      sourceUuid: envelope.sourceUuid,
      sourceDevice: envelope.sourceDevice
    }, this.removeFromCache.bind(this, envelope)));
  }
  unpad(paddedPlaintext) {
    for (let i = paddedPlaintext.length - 1; i >= 0; i -= 1) {
      if (paddedPlaintext[i] === 128) {
        return new Uint8Array(paddedPlaintext.slice(0, i));
      }
      if (paddedPlaintext[i] !== 0) {
        throw new Error("Invalid padding");
      }
    }
    return paddedPlaintext;
  }
  async decryptSealedSender({ senderKeyStore, sessionStore, identityKeyStore, zone }, envelope, ciphertext) {
    const localE164 = this.storage.user.getNumber();
    const { destinationUuid } = envelope;
    const localDeviceId = (0, import_parseIntOrThrow.parseIntOrThrow)(this.storage.user.getDeviceId(), "MessageReceiver.decryptSealedSender: localDeviceId");
    const logId = getEnvelopeId(envelope);
    const { unsealedContent: messageContent, certificate } = envelope;
    (0, import_assert.strictAssert)(messageContent !== void 0, "Missing message content for sealed sender message");
    (0, import_assert.strictAssert)(certificate !== void 0, "Missing sender certificate for sealed sender message");
    const unidentifiedSenderTypeEnum = import_protobuf.SignalService.UnidentifiedSenderMessage.Message.Type;
    if (messageContent.msgType() === unidentifiedSenderTypeEnum.PLAINTEXT_CONTENT) {
      log.info(`MessageReceiver.decryptSealedSender(${logId}): unidentified message/plaintext contents`);
      const plaintextContent = import_libsignal_client.PlaintextContent.deserialize(messageContent.contents());
      return {
        plaintext: plaintextContent.body()
      };
    }
    if (messageContent.msgType() === unidentifiedSenderTypeEnum.SENDERKEY_MESSAGE) {
      log.info(`MessageReceiver.decryptSealedSender(${logId}): unidentified message/sender key contents`);
      const sealedSenderIdentifier2 = certificate.senderUuid();
      const sealedSenderSourceDevice = certificate.senderDeviceId();
      const address2 = new import_QualifiedAddress.QualifiedAddress(destinationUuid, import_Address.Address.create(sealedSenderIdentifier2, sealedSenderSourceDevice));
      const plaintext = await this.storage.protocol.enqueueSenderKeyJob(address2, () => (0, import_libsignal_client.groupDecrypt)(import_libsignal_client.ProtocolAddress.new(sealedSenderIdentifier2, sealedSenderSourceDevice), senderKeyStore, messageContent.contents()), zone);
      return { plaintext };
    }
    log.info(`MessageReceiver.decryptSealedSender(${logId}): unidentified message/passing to sealedSenderDecryptMessage`);
    const preKeyStore = new import_LibSignalStores.PreKeys({ ourUuid: destinationUuid });
    const signedPreKeyStore = new import_LibSignalStores.SignedPreKeys({ ourUuid: destinationUuid });
    const sealedSenderIdentifier = envelope.sourceUuid;
    (0, import_assert.strictAssert)(sealedSenderIdentifier !== void 0, "Empty sealed sender identifier");
    (0, import_assert.strictAssert)(envelope.sourceDevice !== void 0, "Empty sealed sender device");
    const address = new import_QualifiedAddress.QualifiedAddress(destinationUuid, import_Address.Address.create(sealedSenderIdentifier, envelope.sourceDevice));
    const unsealedPlaintext = await this.storage.protocol.enqueueSessionJob(address, () => (0, import_libsignal_client.sealedSenderDecryptMessage)(Buffer.from(ciphertext), import_libsignal_client.PublicKey.deserialize(Buffer.from(this.serverTrustRoot)), envelope.serverTimestamp, localE164 || null, destinationUuid.toString(), localDeviceId, sessionStore, identityKeyStore, preKeyStore, signedPreKeyStore), zone);
    return { unsealedPlaintext };
  }
  async innerDecrypt(stores, envelope, ciphertext, uuidKind) {
    const { sessionStore, identityKeyStore, zone } = stores;
    const logId = getEnvelopeId(envelope);
    const envelopeTypeEnum = import_protobuf.SignalService.Envelope.Type;
    const identifier = envelope.sourceUuid;
    const { sourceDevice } = envelope;
    const { destinationUuid } = envelope;
    const preKeyStore = new import_LibSignalStores.PreKeys({ ourUuid: destinationUuid });
    const signedPreKeyStore = new import_LibSignalStores.SignedPreKeys({ ourUuid: destinationUuid });
    (0, import_assert.strictAssert)(identifier !== void 0, "Empty identifier");
    (0, import_assert.strictAssert)(sourceDevice !== void 0, "Empty source device");
    const address = new import_QualifiedAddress.QualifiedAddress(destinationUuid, import_Address.Address.create(identifier, sourceDevice));
    if (uuidKind === import_UUID.UUIDKind.PNI && envelope.type !== envelopeTypeEnum.PREKEY_BUNDLE) {
      log.warn(`MessageReceiver.innerDecrypt(${logId}): non-PreKey envelope on PNI`);
      return void 0;
    }
    (0, import_assert.strictAssert)(uuidKind === import_UUID.UUIDKind.PNI || uuidKind === import_UUID.UUIDKind.ACI, `Unsupported uuidKind: ${uuidKind}`);
    if (envelope.type === envelopeTypeEnum.PLAINTEXT_CONTENT) {
      log.info(`decrypt/${logId}: plaintext message`);
      const buffer = Buffer.from(ciphertext);
      const plaintextContent = import_libsignal_client.PlaintextContent.deserialize(buffer);
      return this.unpad(plaintextContent.body());
    }
    if (envelope.type === envelopeTypeEnum.CIPHERTEXT) {
      log.info(`decrypt/${logId}: ciphertext message`);
      if (!identifier) {
        throw new Error("MessageReceiver.innerDecrypt: No identifier for CIPHERTEXT message");
      }
      if (!sourceDevice) {
        throw new Error("MessageReceiver.innerDecrypt: No sourceDevice for CIPHERTEXT message");
      }
      const signalMessage = import_libsignal_client.SignalMessage.deserialize(Buffer.from(ciphertext));
      const plaintext = await this.storage.protocol.enqueueSessionJob(address, async () => this.unpad(await (0, import_libsignal_client.signalDecrypt)(signalMessage, import_libsignal_client.ProtocolAddress.new(identifier, sourceDevice), sessionStore, identityKeyStore)), zone);
      return plaintext;
    }
    if (envelope.type === envelopeTypeEnum.PREKEY_BUNDLE) {
      log.info(`decrypt/${logId}: prekey message`);
      if (!identifier) {
        throw new Error("MessageReceiver.innerDecrypt: No identifier for PREKEY_BUNDLE message");
      }
      if (!sourceDevice) {
        throw new Error("MessageReceiver.innerDecrypt: No sourceDevice for PREKEY_BUNDLE message");
      }
      const preKeySignalMessage = import_libsignal_client.PreKeySignalMessage.deserialize(Buffer.from(ciphertext));
      const plaintext = await this.storage.protocol.enqueueSessionJob(address, async () => this.unpad(await (0, import_libsignal_client.signalDecryptPreKey)(preKeySignalMessage, import_libsignal_client.ProtocolAddress.new(identifier, sourceDevice), sessionStore, identityKeyStore, preKeyStore, signedPreKeyStore)), zone);
      return plaintext;
    }
    if (envelope.type === envelopeTypeEnum.UNIDENTIFIED_SENDER) {
      log.info(`decrypt/${logId}: unidentified message`);
      const { plaintext, unsealedPlaintext } = await this.decryptSealedSender(stores, envelope, ciphertext);
      if (plaintext) {
        return this.unpad(plaintext);
      }
      if (unsealedPlaintext) {
        const content = unsealedPlaintext.message();
        if (!content) {
          throw new Error("MessageReceiver.innerDecrypt: Content returned was falsey!");
        }
        return this.unpad(content);
      }
      throw new Error("Unexpected lack of plaintext from unidentified sender");
    }
    throw new Error("Unknown message type");
  }
  async decrypt(stores, envelope, ciphertext, uuidKind) {
    try {
      return await this.innerDecrypt(stores, envelope, ciphertext, uuidKind);
    } catch (error) {
      const uuid = envelope.sourceUuid;
      const deviceId = envelope.sourceDevice;
      if (error?.name === "TimeoutError" || error?.message?.includes?.("task did not complete in time")) {
        this.removeFromCache(envelope);
        throw error;
      }
      if (error?.message?.includes?.("message with old counter")) {
        this.removeFromCache(envelope);
        throw error;
      }
      if (error?.message?.includes?.("trust root validation failed")) {
        this.removeFromCache(envelope);
        throw error;
      }
      if (envelope.source && this.isBlocked(envelope.source) || envelope.sourceUuid && this.isUuidBlocked(envelope.sourceUuid)) {
        log.info("MessageReceiver.decrypt: Error from blocked sender; no further processing");
        this.removeFromCache(envelope);
        throw error;
      }
      if (uuid && deviceId) {
        const { cipherTextBytes, cipherTextType } = envelope;
        const event = new import_messageReceiverEvents.DecryptionErrorEvent({
          cipherTextBytes,
          cipherTextType,
          contentHint: envelope.contentHint,
          groupId: envelope.groupId,
          receivedAtCounter: envelope.receivedAtCounter,
          receivedAtDate: envelope.receivedAtDate,
          senderDevice: deviceId,
          senderUuid: uuid,
          timestamp: envelope.timestamp
        }, () => this.removeFromCache(envelope));
        this.addToQueue(async () => this.dispatchEvent(event), "decrypted/dispatchEvent", "Decrypted" /* Decrypted */);
      } else {
        const envelopeId = getEnvelopeId(envelope);
        this.removeFromCache(envelope);
        log.error(`MessageReceiver.decrypt: Envelope ${envelopeId} missing uuid or deviceId`);
      }
      throw error;
    }
  }
  async handleSentMessage(envelope, sentContainer) {
    log.info("MessageReceiver.handleSentMessage", getEnvelopeId(envelope));
    logUnexpectedUrgentValue(envelope, "sentSync");
    const {
      destination,
      destinationUuid,
      timestamp,
      message: msg,
      expirationStartTimestamp,
      unidentifiedStatus,
      isRecipientUpdate
    } = sentContainer;
    if (!msg) {
      throw new Error("MessageReceiver.handleSentMessage: message was falsey!");
    }
    let p = Promise.resolve();
    if (msg.flags && msg.flags & import_protobuf.SignalService.DataMessage.Flags.END_SESSION) {
      if (destinationUuid) {
        p = this.handleEndSession(envelope, new import_UUID.UUID(destinationUuid));
      } else if (destination) {
        const theirUuid = import_UUID.UUID.lookup(destination);
        if (theirUuid) {
          p = this.handleEndSession(envelope, theirUuid);
        } else {
          log.warn(`handleSentMessage: uuid not found for ${destination}`);
          p = Promise.resolve();
        }
      } else {
        throw new Error("MessageReceiver.handleSentMessage: Cannot end session with falsey destination");
      }
    }
    await p;
    const message = await this.processDecrypted(envelope, msg);
    const groupId = this.getProcessedGroupId(message);
    const isBlocked = groupId ? this.isGroupBlocked(groupId) : false;
    const { source, sourceUuid } = envelope;
    const ourE164 = this.storage.user.getNumber();
    const ourUuid = this.storage.user.getCheckedUuid().toString();
    const isMe = source && ourE164 && source === ourE164 || sourceUuid && ourUuid && sourceUuid === ourUuid;
    const isLeavingGroup = Boolean(!message.groupV2 && message.group && message.group.type === import_protobuf.SignalService.GroupContext.Type.QUIT);
    if (groupId && isBlocked && !(isMe && isLeavingGroup)) {
      log.warn(`Message ${getEnvelopeId(envelope)} ignored; destined for blocked group`);
      this.removeFromCache(envelope);
      return void 0;
    }
    const ev = new import_messageReceiverEvents.SentEvent({
      destination: (0, import_dropNull.dropNull)(destination),
      destinationUuid: (0, import_dropNull.dropNull)(destinationUuid) || envelope.destinationUuid.toString(),
      timestamp: timestamp?.toNumber(),
      serverTimestamp: envelope.serverTimestamp,
      device: envelope.sourceDevice,
      unidentifiedStatus,
      message,
      isRecipientUpdate: Boolean(isRecipientUpdate),
      receivedAtCounter: envelope.receivedAtCounter,
      receivedAtDate: envelope.receivedAtDate,
      expirationStartTimestamp: expirationStartTimestamp?.toNumber()
    }, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleStoryMessage(envelope, msg, sentMessage) {
    const logId = getEnvelopeId(envelope);
    log.info("MessageReceiver.handleStoryMessage", logId);
    const attachments = [];
    if (!window.Events.getHasStoriesEnabled()) {
      log.info("MessageReceiver.handleStoryMessage: dropping", logId);
      this.removeFromCache(envelope);
      return;
    }
    if (msg.fileAttachment) {
      const attachment = (0, import_processDataMessage.processAttachment)(msg.fileAttachment);
      attachments.push(attachment);
    }
    if (msg.textAttachment) {
      const { text } = msg.textAttachment;
      if (!text) {
        throw new Error("Text attachments must have text!");
      }
      attachments.push({
        size: text.length,
        contentType: import_MIME.TEXT_ATTACHMENT,
        textAttachment: msg.textAttachment,
        blurHash: (0, import_generateBlurHash.generateBlurHash)((msg.textAttachment.color || msg.textAttachment.gradient?.startColor) ?? void 0)
      });
    }
    const groupV2 = msg.group ? (0, import_processDataMessage.processGroupV2Context)(msg.group) : void 0;
    if (groupV2 && this.isGroupBlocked(groupV2.id)) {
      log.warn(`MessageReceiver.handleStoryMessage: envelope ${getEnvelopeId(envelope)} ignored; destined for blocked group`);
      this.removeFromCache(envelope);
      return;
    }
    const expireTimer = Math.min(Math.floor((envelope.serverTimestamp + durations.DAY - Date.now()) / 1e3), durations.DAY / 1e3);
    if (expireTimer <= 0) {
      log.info("MessageReceiver.handleStoryMessage: story already expired", logId);
      this.removeFromCache(envelope);
      return;
    }
    const message = {
      attachments,
      canReplyToStory: Boolean(msg.allowsReplies),
      expireTimer,
      flags: 0,
      groupV2,
      isStory: true,
      isViewOnce: false,
      timestamp: envelope.timestamp
    };
    if (sentMessage && message.groupV2) {
      const ev2 = new import_messageReceiverEvents.SentEvent({
        destinationUuid: envelope.destinationUuid.toString(),
        isRecipientUpdate: Boolean(sentMessage.isRecipientUpdate),
        message,
        receivedAtCounter: envelope.receivedAtCounter,
        receivedAtDate: envelope.receivedAtDate,
        serverTimestamp: envelope.serverTimestamp,
        timestamp: envelope.timestamp,
        unidentifiedStatus: sentMessage.unidentifiedStatus
      }, this.removeFromCache.bind(this, envelope));
      this.dispatchAndWait(ev2);
      return;
    }
    if (sentMessage) {
      const { storyMessageRecipients } = sentMessage;
      const recipients = storyMessageRecipients ?? [];
      const isAllowedToReply = /* @__PURE__ */ new Map();
      const distributionListToSentUuid = /* @__PURE__ */ new Map();
      recipients.forEach((recipient) => {
        const { destinationUuid } = recipient;
        if (!destinationUuid) {
          return;
        }
        const normalizedDestinationUuid = (0, import_normalizeUuid.normalizeUuid)(destinationUuid, "handleStoryMessage.destinationUuid");
        recipient.distributionListIds?.forEach((listId) => {
          const sentUuids = distributionListToSentUuid.get(listId) || /* @__PURE__ */ new Set();
          sentUuids.add(normalizedDestinationUuid);
          distributionListToSentUuid.set(listId, sentUuids);
        });
        isAllowedToReply.set(normalizedDestinationUuid, recipient.isAllowedToReply !== false);
      });
      distributionListToSentUuid.forEach((sentToUuids, listId) => {
        const ev2 = new import_messageReceiverEvents.SentEvent({
          destinationUuid: envelope.destinationUuid.toString(),
          timestamp: envelope.timestamp,
          serverTimestamp: envelope.serverTimestamp,
          unidentifiedStatus: Array.from(sentToUuids).map((destinationUuid) => ({
            destinationUuid,
            isAllowedToReplyToStory: isAllowedToReply.get(destinationUuid)
          })),
          message,
          isRecipientUpdate: Boolean(sentMessage.isRecipientUpdate),
          receivedAtCounter: envelope.receivedAtCounter,
          receivedAtDate: envelope.receivedAtDate,
          storyDistributionListId: (0, import_normalizeUuid.normalizeUuid)(listId, "storyDistributionListId")
        }, this.removeFromCache.bind(this, envelope));
        this.dispatchAndWait(ev2);
      });
      return;
    }
    const ev = new import_messageReceiverEvents.MessageEvent({
      source: envelope.source,
      sourceUuid: envelope.sourceUuid,
      sourceDevice: envelope.sourceDevice,
      timestamp: envelope.timestamp,
      serverGuid: envelope.serverGuid,
      serverTimestamp: envelope.serverTimestamp,
      unidentifiedDeliveryReceived: Boolean(envelope.unidentifiedDeliveryReceived),
      message,
      receivedAtCounter: envelope.receivedAtCounter,
      receivedAtDate: envelope.receivedAtDate
    }, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleDataMessage(envelope, msg) {
    const logId = getEnvelopeId(envelope);
    log.info("MessageReceiver.handleDataMessage", logId);
    const isStoriesEnabled = (0, import_RemoteConfig.isEnabled)("desktop.stories") || (0, import_RemoteConfig.isEnabled)("desktop.internalUser");
    if (!isStoriesEnabled && msg.storyContext) {
      logUnexpectedUrgentValue(envelope, "story");
      log.info(`MessageReceiver.handleDataMessage/${logId}: Dropping incoming dataMessage with storyContext field`);
      this.removeFromCache(envelope);
      return void 0;
    }
    let p = Promise.resolve();
    const destination = envelope.sourceUuid;
    if (!destination) {
      throw new Error("MessageReceiver.handleDataMessage: source and sourceUuid were falsey");
    }
    if (this.isInvalidGroupData(msg, envelope)) {
      this.removeFromCache(envelope);
      return void 0;
    }
    await this.checkGroupV1Data(msg);
    if (msg.flags && msg.flags & import_protobuf.SignalService.DataMessage.Flags.END_SESSION) {
      p = this.handleEndSession(envelope, new import_UUID.UUID(destination));
    }
    if (msg.flags && msg.flags & import_protobuf.SignalService.DataMessage.Flags.PROFILE_KEY_UPDATE) {
      (0, import_assert.strictAssert)(msg.profileKey && msg.profileKey.length > 0, "PROFILE_KEY_UPDATE without profileKey");
      logUnexpectedUrgentValue(envelope, "profileKeyUpdate");
      const ev2 = new import_messageReceiverEvents.ProfileKeyUpdateEvent({
        source: envelope.source,
        sourceUuid: envelope.sourceUuid,
        profileKey: Bytes.toBase64(msg.profileKey)
      }, this.removeFromCache.bind(this, envelope));
      return this.dispatchAndWait(ev2);
    }
    await p;
    let type = "message";
    if (msg.storyContext) {
      type = "story";
    } else if (msg.body) {
      type = "message";
    } else if (msg.reaction) {
      type = "reaction";
    } else if (msg.delete) {
      type = "deleteForEveryone";
    } else if (msg.flags && msg.flags & import_protobuf.SignalService.DataMessage.Flags.EXPIRATION_TIMER_UPDATE) {
      type = "expirationTimerUpdate";
    } else if (msg.group) {
      type = "legacyGroupChange";
    }
    logUnexpectedUrgentValue(envelope, type);
    const message = await this.processDecrypted(envelope, msg);
    const groupId = this.getProcessedGroupId(message);
    const isBlocked = groupId ? this.isGroupBlocked(groupId) : false;
    const { source, sourceUuid } = envelope;
    const ourE164 = this.storage.user.getNumber();
    const ourUuid = this.storage.user.getCheckedUuid().toString();
    const isMe = source && ourE164 && source === ourE164 || sourceUuid && ourUuid && sourceUuid === ourUuid;
    const isLeavingGroup = Boolean(!message.groupV2 && message.group && message.group.type === import_protobuf.SignalService.GroupContext.Type.QUIT);
    if (groupId && isBlocked && !(isMe && isLeavingGroup)) {
      log.warn(`Message ${getEnvelopeId(envelope)} ignored; destined for blocked group`);
      this.removeFromCache(envelope);
      return void 0;
    }
    const ev = new import_messageReceiverEvents.MessageEvent({
      source: envelope.source,
      sourceUuid: envelope.sourceUuid,
      sourceDevice: envelope.sourceDevice,
      timestamp: envelope.timestamp,
      serverGuid: envelope.serverGuid,
      serverTimestamp: envelope.serverTimestamp,
      unidentifiedDeliveryReceived: Boolean(envelope.unidentifiedDeliveryReceived),
      message,
      receivedAtCounter: envelope.receivedAtCounter,
      receivedAtDate: envelope.receivedAtDate
    }, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async maybeUpdateTimestamp(envelope) {
    const { retryPlaceholders } = window.Signal.Services;
    if (!retryPlaceholders) {
      log.warn("maybeUpdateTimestamp: retry placeholders not available!");
      return envelope;
    }
    const { timestamp } = envelope;
    const identifier = envelope.groupId || envelope.sourceUuid;
    const conversation = window.ConversationController.get(identifier);
    try {
      if (!conversation) {
        const idForLogging = envelope.groupId ? `groupv2(${envelope.groupId})` : envelope.sourceUuid;
        log.info(`maybeUpdateTimestamp/${timestamp}: No conversation found for identifier ${idForLogging}`);
        return envelope;
      }
      const logId = `${conversation.idForLogging()}/${timestamp}`;
      const item = await retryPlaceholders.findByMessageAndRemove(conversation.id, timestamp);
      if (item && item.wasOpened) {
        log.info(`maybeUpdateTimestamp/${logId}: found retry placeholder, but conversation was opened. No updates made.`);
      } else if (item) {
        log.info(`maybeUpdateTimestamp/${logId}: found retry placeholder. Updating receivedAtCounter/receivedAtDate`);
        return {
          ...envelope,
          receivedAtCounter: item.receivedAtCounter,
          receivedAtDate: item.receivedAt
        };
      }
    } catch (error) {
      log.error(`maybeUpdateTimestamp/${timestamp}: Failed to process message: ${Errors.toLogFormat(error)}`);
    }
    return envelope;
  }
  async innerHandleContentMessage(incomingEnvelope, plaintext) {
    const content = import_protobuf.SignalService.Content.decode(plaintext);
    const envelope = await this.maybeUpdateTimestamp(incomingEnvelope);
    if (content.decryptionErrorMessage && Bytes.isNotEmpty(content.decryptionErrorMessage)) {
      await this.handleDecryptionError(envelope, content.decryptionErrorMessage);
      return;
    }
    if (content.syncMessage) {
      await this.handleSyncMessage(envelope, (0, import_processSyncMessage.processSyncMessage)(content.syncMessage));
      return;
    }
    if (content.dataMessage) {
      await this.handleDataMessage(envelope, content.dataMessage);
      return;
    }
    if (content.nullMessage) {
      await this.handleNullMessage(envelope);
      return;
    }
    if (content.callingMessage) {
      await this.handleCallingMessage(envelope, content.callingMessage);
      return;
    }
    if (content.receiptMessage) {
      await this.handleReceiptMessage(envelope, content.receiptMessage);
      return;
    }
    if (content.typingMessage) {
      await this.handleTypingMessage(envelope, content.typingMessage);
      return;
    }
    const isStoriesEnabled = (0, import_RemoteConfig.isEnabled)("desktop.stories") || (0, import_RemoteConfig.isEnabled)("desktop.internalUser");
    if (content.storyMessage) {
      if (isStoriesEnabled) {
        await this.handleStoryMessage(envelope, content.storyMessage);
        return;
      }
      const logId = getEnvelopeId(envelope);
      log.info(`innerHandleContentMessage/${logId}: Dropping incoming message with storyMessage field`);
      this.removeFromCache(envelope);
      return;
    }
    this.removeFromCache(envelope);
    if (Bytes.isEmpty(content.senderKeyDistributionMessage)) {
      throw new Error("Unsupported content message");
    }
  }
  async handleDecryptionError(envelope, decryptionError) {
    const logId = getEnvelopeId(envelope);
    log.info(`handleDecryptionError: ${logId}`);
    logUnexpectedUrgentValue(envelope, "retryRequest");
    const buffer = Buffer.from(decryptionError);
    const request = import_libsignal_client.DecryptionErrorMessage.deserialize(buffer);
    const { sourceUuid, sourceDevice } = envelope;
    if (!sourceUuid || !sourceDevice) {
      log.error(`handleDecryptionError/${logId}: Missing uuid or device!`);
      this.removeFromCache(envelope);
      return;
    }
    const event = new import_messageReceiverEvents.RetryRequestEvent({
      groupId: envelope.groupId,
      requesterDevice: sourceDevice,
      requesterUuid: sourceUuid,
      ratchetKey: request.ratchetKey(),
      senderDevice: request.deviceId(),
      sentAt: request.timestamp()
    }, () => this.removeFromCache(envelope));
    await this.dispatchEvent(event);
  }
  async handleSenderKeyDistributionMessage(stores, envelope, distributionMessage) {
    const envelopeId = getEnvelopeId(envelope);
    log.info(`handleSenderKeyDistributionMessage/${envelopeId}`);
    logUnexpectedUrgentValue(envelope, "senderKeyDistributionMessage");
    const identifier = envelope.sourceUuid;
    const { sourceDevice } = envelope;
    if (!identifier) {
      throw new Error(`handleSenderKeyDistributionMessage: No identifier for envelope ${envelopeId}`);
    }
    if (!(0, import_lodash.isNumber)(sourceDevice)) {
      throw new Error(`handleSenderKeyDistributionMessage: Missing sourceDevice for envelope ${envelopeId}`);
    }
    const sender = import_libsignal_client.ProtocolAddress.new(identifier, sourceDevice);
    const senderKeyDistributionMessage = import_libsignal_client.SenderKeyDistributionMessage.deserialize(Buffer.from(distributionMessage));
    const { destinationUuid } = envelope;
    const address = new import_QualifiedAddress.QualifiedAddress(destinationUuid, import_Address.Address.create(identifier, sourceDevice));
    await this.storage.protocol.enqueueSenderKeyJob(address, () => (0, import_libsignal_client.processSenderKeyDistributionMessage)(sender, senderKeyDistributionMessage, stores.senderKeyStore), stores.zone);
  }
  async handleCallingMessage(envelope, callingMessage) {
    logUnexpectedUrgentValue(envelope, "callingMessage");
    this.removeFromCache(envelope);
    await window.Signal.Services.calling.handleCallingMessage(envelope, callingMessage);
  }
  async handleReceiptMessage(envelope, receiptMessage) {
    (0, import_assert.strictAssert)(receiptMessage.timestamp, "Receipt message without timestamp");
    let EventClass;
    let type;
    switch (receiptMessage.type) {
      case import_protobuf.SignalService.ReceiptMessage.Type.DELIVERY:
        EventClass = import_messageReceiverEvents.DeliveryEvent;
        type = "deliveryReceipt";
        break;
      case import_protobuf.SignalService.ReceiptMessage.Type.READ:
        EventClass = import_messageReceiverEvents.ReadEvent;
        type = "readReceipt";
        break;
      case import_protobuf.SignalService.ReceiptMessage.Type.VIEWED:
        EventClass = import_messageReceiverEvents.ViewEvent;
        type = "viewedReceipt";
        break;
      default:
        return;
    }
    logUnexpectedUrgentValue(envelope, type);
    await Promise.all(receiptMessage.timestamp.map(async (rawTimestamp) => {
      const ev = new EventClass({
        timestamp: rawTimestamp?.toNumber(),
        envelopeTimestamp: envelope.timestamp,
        source: envelope.source,
        sourceUuid: envelope.sourceUuid,
        sourceDevice: envelope.sourceDevice
      }, this.removeFromCache.bind(this, envelope));
      await this.dispatchAndWait(ev);
    }));
  }
  async handleTypingMessage(envelope, typingMessage) {
    this.removeFromCache(envelope);
    logUnexpectedUrgentValue(envelope, "typing");
    if (envelope.timestamp && typingMessage.timestamp) {
      const envelopeTimestamp = envelope.timestamp;
      const typingTimestamp = typingMessage.timestamp?.toNumber();
      if (typingTimestamp !== envelopeTimestamp) {
        log.warn(`Typing message envelope timestamp (${envelopeTimestamp}) did not match typing timestamp (${typingTimestamp})`);
        return;
      }
    }
    (0, import_assert.strictAssert)(envelope.sourceDevice !== void 0, "TypingMessage requires sourceDevice in the envelope");
    const { groupId, timestamp, action } = typingMessage;
    let groupIdString;
    let groupV2IdString;
    if (groupId && groupId.byteLength > 0) {
      if (groupId.byteLength === GROUPV1_ID_LENGTH) {
        groupIdString = Bytes.toBinary(groupId);
        groupV2IdString = this.deriveGroupV2FromV1(groupId);
      } else if (groupId.byteLength === GROUPV2_ID_LENGTH) {
        groupV2IdString = Bytes.toBase64(groupId);
      } else {
        log.error("handleTypingMessage: Received invalid groupId value");
      }
    }
    await this.dispatchEvent(new import_messageReceiverEvents.TypingEvent({
      sender: envelope.source,
      senderUuid: envelope.sourceUuid,
      senderDevice: envelope.sourceDevice,
      typing: {
        typingMessage,
        timestamp: timestamp?.toNumber() ?? Date.now(),
        started: action === import_protobuf.SignalService.TypingMessage.Action.STARTED,
        stopped: action === import_protobuf.SignalService.TypingMessage.Action.STOPPED,
        groupId: groupIdString,
        groupV2Id: groupV2IdString
      }
    }));
  }
  handleNullMessage(envelope) {
    log.info("MessageReceiver.handleNullMessage", getEnvelopeId(envelope));
    logUnexpectedUrgentValue(envelope, "nullMessage");
    this.removeFromCache(envelope);
  }
  isInvalidGroupData(message, envelope) {
    const { group, groupV2 } = message;
    if (group) {
      const { id } = group;
      (0, import_assert.strictAssert)(id, "Group data has no id");
      const isInvalid = id.byteLength !== GROUPV1_ID_LENGTH;
      if (isInvalid) {
        log.info("isInvalidGroupData: invalid GroupV1 message from", getEnvelopeId(envelope));
      }
      return isInvalid;
    }
    if (groupV2) {
      const { masterKey } = groupV2;
      (0, import_assert.strictAssert)(masterKey, "Group v2 data has no masterKey");
      const isInvalid = masterKey.byteLength !== import_groups.MASTER_KEY_LENGTH;
      if (isInvalid) {
        log.info("isInvalidGroupData: invalid GroupV2 message from", getEnvelopeId(envelope));
      }
      return isInvalid;
    }
    return false;
  }
  deriveGroupV2FromV1(groupId) {
    if (groupId.byteLength !== GROUPV1_ID_LENGTH) {
      throw new Error(`deriveGroupV2FromV1: had id with wrong byteLength: ${groupId.byteLength}`);
    }
    const masterKey = (0, import_Crypto.deriveMasterKeyFromGroupV1)(groupId);
    const data = (0, import_groups.deriveGroupFields)(masterKey);
    return Bytes.toBase64(data.id);
  }
  async checkGroupV1Data(message) {
    const { group } = message;
    if (!group) {
      return;
    }
    if (!group.id) {
      throw new Error("deriveGroupV1Data: had falsey id");
    }
    const { id } = group;
    if (id.byteLength !== GROUPV1_ID_LENGTH) {
      throw new Error(`deriveGroupV1Data: had id with wrong byteLength: ${id.byteLength}`);
    }
  }
  getProcessedGroupId(message) {
    if (message.groupV2) {
      return message.groupV2.id;
    }
    if (message.group && message.group.id) {
      return message.group.id;
    }
    return void 0;
  }
  getGroupId(message) {
    if (message.groupV2) {
      (0, import_assert.strictAssert)(message.groupV2.masterKey, "Missing groupV2.masterKey");
      const { id } = (0, import_groups.deriveGroupFields)(message.groupV2.masterKey);
      return Bytes.toBase64(id);
    }
    if (message.group && message.group.id) {
      return Bytes.toBinary(message.group.id);
    }
    return void 0;
  }
  getDestination(sentMessage) {
    if (sentMessage.message && sentMessage.message.groupV2) {
      return `groupv2(${this.getGroupId(sentMessage.message)})`;
    }
    if (sentMessage.message && sentMessage.message.group) {
      (0, import_assert.strictAssert)(sentMessage.message.group.id, "group without id");
      return `group(${this.getGroupId(sentMessage.message)})`;
    }
    return sentMessage.destination || sentMessage.destinationUuid;
  }
  async handleSyncMessage(envelope, syncMessage) {
    const ourNumber = this.storage.user.getNumber();
    const ourUuid = this.storage.user.getCheckedUuid();
    const fromSelfSource = envelope.source && envelope.source === ourNumber;
    const fromSelfSourceUuid = envelope.sourceUuid && envelope.sourceUuid === ourUuid.toString();
    if (!fromSelfSource && !fromSelfSourceUuid) {
      throw new Error("Received sync message from another number");
    }
    const ourDeviceId = this.storage.user.getDeviceId();
    if (envelope.sourceDevice == ourDeviceId) {
      throw new Error("Received sync message from our own device");
    }
    if (syncMessage.pniIdentity) {
      return;
    }
    if (syncMessage.sent) {
      const sentMessage = syncMessage.sent;
      if (sentMessage.storyMessage) {
        this.handleStoryMessage(envelope, sentMessage.storyMessage, sentMessage);
        return;
      }
      if (sentMessage.storyMessageRecipients && sentMessage.isRecipientUpdate) {
        if (!window.Events.getHasStoriesEnabled()) {
          log.info("MessageReceiver.handleSyncMessage: dropping story recipients update");
          this.removeFromCache(envelope);
          return;
        }
        log.info("MessageReceiver.handleSyncMessage: handling storyMessageRecipients isRecipientUpdate sync message", getEnvelopeId(envelope));
        const ev = new import_messageReceiverEvents.StoryRecipientUpdateEvent({
          destinationUuid: envelope.destinationUuid.toString(),
          timestamp: envelope.timestamp,
          storyMessageRecipients: sentMessage.storyMessageRecipients
        }, this.removeFromCache.bind(this, envelope));
        return this.dispatchAndWait(ev);
      }
      if (!sentMessage || !sentMessage.message) {
        throw new Error("MessageReceiver.handleSyncMessage: sync sent message was missing message");
      }
      if (this.isInvalidGroupData(sentMessage.message, envelope)) {
        this.removeFromCache(envelope);
        return;
      }
      await this.checkGroupV1Data(sentMessage.message);
      (0, import_assert.strictAssert)(sentMessage.timestamp, "sent message without timestamp");
      log.info("sent message to", this.getDestination(sentMessage), sentMessage.timestamp?.toNumber(), "from", getEnvelopeId(envelope));
      return this.handleSentMessage(envelope, sentMessage);
    }
    if (syncMessage.contacts) {
      this.handleContacts(envelope, syncMessage.contacts);
      return;
    }
    if (syncMessage.groups) {
      this.handleGroups(envelope, syncMessage.groups);
      return;
    }
    if (syncMessage.blocked) {
      return this.handleBlocked(envelope, syncMessage.blocked);
    }
    if (syncMessage.request) {
      log.info("Got SyncMessage Request");
      this.removeFromCache(envelope);
      return;
    }
    if (syncMessage.read && syncMessage.read.length) {
      return this.handleRead(envelope, syncMessage.read);
    }
    if (syncMessage.verified) {
      log.info("Got verified sync message, dropping");
      this.removeFromCache(envelope);
      return;
    }
    if (syncMessage.configuration) {
      return this.handleConfiguration(envelope, syncMessage.configuration);
    }
    if (syncMessage.stickerPackOperation && syncMessage.stickerPackOperation.length > 0) {
      return this.handleStickerPackOperation(envelope, syncMessage.stickerPackOperation);
    }
    if (syncMessage.viewOnceOpen) {
      return this.handleViewOnceOpen(envelope, syncMessage.viewOnceOpen);
    }
    if (syncMessage.messageRequestResponse) {
      return this.handleMessageRequestResponse(envelope, syncMessage.messageRequestResponse);
    }
    if (syncMessage.fetchLatest) {
      return this.handleFetchLatest(envelope, syncMessage.fetchLatest);
    }
    if (syncMessage.keys) {
      return this.handleKeys(envelope, syncMessage.keys);
    }
    if (syncMessage.viewed && syncMessage.viewed.length) {
      return this.handleViewed(envelope, syncMessage.viewed);
    }
    this.removeFromCache(envelope);
    log.warn(`handleSyncMessage/${getEnvelopeId(envelope)}: Got empty SyncMessage`);
  }
  async handleConfiguration(envelope, configuration) {
    log.info("got configuration sync message");
    logUnexpectedUrgentValue(envelope, "configurationSync");
    const ev = new import_messageReceiverEvents.ConfigurationEvent(configuration, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleViewOnceOpen(envelope, sync) {
    log.info("got view once open sync message");
    logUnexpectedUrgentValue(envelope, "viewOnceSync");
    const ev = new import_messageReceiverEvents.ViewOnceOpenSyncEvent({
      source: (0, import_dropNull.dropNull)(sync.sender),
      sourceUuid: sync.senderUuid ? (0, import_normalizeUuid.normalizeUuid)(sync.senderUuid, "handleViewOnceOpen.senderUuid") : void 0,
      timestamp: sync.timestamp?.toNumber()
    }, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleMessageRequestResponse(envelope, sync) {
    log.info("got message request response sync message");
    logUnexpectedUrgentValue(envelope, "messageRequestSync");
    const { groupId } = sync;
    let groupIdString;
    let groupV2IdString;
    if (groupId && groupId.byteLength > 0) {
      if (groupId.byteLength === GROUPV1_ID_LENGTH) {
        groupIdString = Bytes.toBinary(groupId);
        groupV2IdString = this.deriveGroupV2FromV1(groupId);
      } else if (groupId.byteLength === GROUPV2_ID_LENGTH) {
        groupV2IdString = Bytes.toBase64(groupId);
      } else {
        this.removeFromCache(envelope);
        log.error("Received message request with invalid groupId");
        return void 0;
      }
    }
    const ev = new import_messageReceiverEvents.MessageRequestResponseEvent({
      threadE164: (0, import_dropNull.dropNull)(sync.threadE164),
      threadUuid: sync.threadUuid ? (0, import_normalizeUuid.normalizeUuid)(sync.threadUuid, "handleMessageRequestResponse.threadUuid") : void 0,
      messageRequestResponseType: sync.type,
      groupId: groupIdString,
      groupV2Id: groupV2IdString
    }, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleFetchLatest(envelope, sync) {
    log.info("got fetch latest sync message");
    logUnexpectedUrgentValue(envelope, "fetchLatestManifestSync");
    const ev = new import_messageReceiverEvents.FetchLatestEvent(sync.type, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleKeys(envelope, sync) {
    log.info("got keys sync message");
    logUnexpectedUrgentValue(envelope, "keySync");
    if (!sync.storageService) {
      return void 0;
    }
    const ev = new import_messageReceiverEvents.KeysEvent(sync.storageService, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handlePNIIdentity(envelope, { publicKey, privateKey }) {
    log.info("MessageReceiver: got pni identity sync message");
    logUnexpectedUrgentValue(envelope, "pniIdentitySync");
    if (!publicKey || !privateKey) {
      log.warn("MessageReceiver: empty pni identity sync message");
      return;
    }
    const manager = window.getAccountManager();
    await manager.updatePNIIdentity({ privKey: privateKey, pubKey: publicKey });
  }
  async handlePNIChangeNumber(envelope, {
    identityKeyPair,
    signedPreKey,
    registrationId
  }) {
    log.info("MessageReceiver: got pni change number sync message");
    logUnexpectedUrgentValue(envelope, "pniIdentitySync");
    const { updatedPni } = envelope;
    if (!updatedPni) {
      log.warn("MessageReceiver: missing pni in change number sync message");
      return;
    }
    if (!Bytes.isNotEmpty(identityKeyPair) || !Bytes.isNotEmpty(signedPreKey) || !(0, import_lodash.isNumber)(registrationId)) {
      log.warn("MessageReceiver: empty pni change number sync message");
      return;
    }
    const manager = window.getAccountManager();
    await manager.setPni(updatedPni.toString(), {
      identityKeyPair,
      signedPreKey,
      registrationId
    });
  }
  async handleStickerPackOperation(envelope, operations) {
    const ENUM = import_protobuf.SignalService.SyncMessage.StickerPackOperation.Type;
    log.info("got sticker pack operation sync message");
    logUnexpectedUrgentValue(envelope, "stickerPackSync");
    const stickerPacks = operations.map((operation) => ({
      id: operation.packId ? Bytes.toHex(operation.packId) : void 0,
      key: operation.packKey ? Bytes.toBase64(operation.packKey) : void 0,
      isInstall: operation.type === ENUM.INSTALL,
      isRemove: operation.type === ENUM.REMOVE
    }));
    const ev = new import_messageReceiverEvents.StickerPackEvent(stickerPacks, this.removeFromCache.bind(this, envelope));
    return this.dispatchAndWait(ev);
  }
  async handleRead(envelope, read) {
    log.info("MessageReceiver.handleRead", getEnvelopeId(envelope));
    logUnexpectedUrgentValue(envelope, "readSync");
    const results = [];
    for (const { timestamp, sender, senderUuid } of read) {
      const ev = new import_messageReceiverEvents.ReadSyncEvent({
        envelopeTimestamp: envelope.timestamp,
        timestamp: timestamp?.toNumber(),
        sender: (0, import_dropNull.dropNull)(sender),
        senderUuid: senderUuid ? (0, import_normalizeUuid.normalizeUuid)(senderUuid, "handleRead.senderUuid") : void 0
      }, this.removeFromCache.bind(this, envelope));
      results.push(this.dispatchAndWait(ev));
    }
    await Promise.all(results);
  }
  async handleViewed(envelope, viewed) {
    log.info("MessageReceiver.handleViewed", getEnvelopeId(envelope));
    logUnexpectedUrgentValue(envelope, "viewSync");
    await Promise.all(viewed.map(async ({ timestamp, senderE164, senderUuid }) => {
      const ev = new import_messageReceiverEvents.ViewSyncEvent({
        envelopeTimestamp: envelope.timestamp,
        timestamp: timestamp?.toNumber(),
        senderE164: (0, import_dropNull.dropNull)(senderE164),
        senderUuid: senderUuid ? (0, import_normalizeUuid.normalizeUuid)(senderUuid, "handleViewed.senderUuid") : void 0
      }, this.removeFromCache.bind(this, envelope));
      await this.dispatchAndWait(ev);
    }));
  }
  async handleContacts(envelope, contacts) {
    log.info(`MessageReceiver: handleContacts ${getEnvelopeId(envelope)}`);
    const { blob } = contacts;
    if (!blob) {
      throw new Error("MessageReceiver.handleContacts: blob field was missing");
    }
    logUnexpectedUrgentValue(envelope, "contactSync");
    this.removeFromCache(envelope);
    const attachmentPointer = await this.handleAttachment(blob);
    const results = [];
    const contactBuffer = new import_ContactsParser.ContactBuffer(attachmentPointer.data);
    let contactDetails = contactBuffer.next();
    while (contactDetails !== void 0) {
      const contactEvent = new import_messageReceiverEvents.ContactEvent(contactDetails, envelope.receivedAtCounter);
      results.push(this.dispatchAndWait(contactEvent));
      contactDetails = contactBuffer.next();
    }
    await Promise.all(results);
    const finalEvent = new import_messageReceiverEvents.ContactSyncEvent();
    await this.dispatchAndWait(finalEvent);
    log.info("handleContacts: finished");
  }
  async handleGroups(envelope, groups) {
    log.info("group sync");
    log.info(`MessageReceiver: handleGroups ${getEnvelopeId(envelope)}`);
    const { blob } = groups;
    this.removeFromCache(envelope);
    logUnexpectedUrgentValue(envelope, "groupSync");
    if (!blob) {
      throw new Error("MessageReceiver.handleGroups: blob field was missing");
    }
    const attachmentPointer = await this.handleAttachment(blob);
    const groupBuffer = new import_ContactsParser.GroupBuffer(attachmentPointer.data);
    let groupDetails = groupBuffer.next();
    const promises = [];
    while (groupDetails) {
      const { id } = groupDetails;
      (0, import_assert.strictAssert)(id, "Group details without id");
      if (id.byteLength !== 16) {
        log.error(`onGroupReceived: Id was ${id} bytes, expected 16 bytes. Dropping group.`);
        continue;
      }
      const ev2 = new import_messageReceiverEvents.GroupEvent({
        ...groupDetails,
        id: Bytes.toBinary(id)
      }, envelope.receivedAtCounter);
      const promise = this.dispatchAndWait(ev2).catch((e) => {
        log.error("error processing group", e);
      });
      groupDetails = groupBuffer.next();
      promises.push(promise);
    }
    await Promise.all(promises);
    const ev = new import_messageReceiverEvents.GroupSyncEvent();
    return this.dispatchAndWait(ev);
  }
  async handleBlocked(envelope, blocked) {
    const allIdentifiers = [];
    let changed = false;
    logUnexpectedUrgentValue(envelope, "blockSync");
    if (blocked.numbers) {
      const previous = this.storage.get("blocked", []);
      log.info("handleBlocked: Blocking these numbers:", blocked.numbers);
      await this.storage.put("blocked", blocked.numbers);
      if (!(0, import_areArraysMatchingSets.areArraysMatchingSets)(previous, blocked.numbers)) {
        changed = true;
        allIdentifiers.push(...previous);
        allIdentifiers.push(...blocked.numbers);
      }
    }
    if (blocked.uuids) {
      const previous = this.storage.get("blocked-uuids", []);
      const uuids = blocked.uuids.map((uuid, index) => {
        return (0, import_normalizeUuid.normalizeUuid)(uuid, `handleBlocked.uuids.${index}`);
      });
      log.info("handleBlocked: Blocking these uuids:", uuids);
      await this.storage.put("blocked-uuids", uuids);
      if (!(0, import_areArraysMatchingSets.areArraysMatchingSets)(previous, uuids)) {
        changed = true;
        allIdentifiers.push(...previous);
        allIdentifiers.push(...blocked.uuids);
      }
    }
    if (blocked.groupIds) {
      const previous = this.storage.get("blocked-groups", []);
      const groupV1Ids = [];
      const groupIds = [];
      blocked.groupIds.forEach((groupId) => {
        if (groupId.byteLength === GROUPV1_ID_LENGTH) {
          groupV1Ids.push(Bytes.toBinary(groupId));
          groupIds.push(this.deriveGroupV2FromV1(groupId));
        } else if (groupId.byteLength === GROUPV2_ID_LENGTH) {
          groupIds.push(Bytes.toBase64(groupId));
        } else {
          log.error("handleBlocked: Received invalid groupId value");
        }
      });
      log.info("handleBlocked: Blocking these groups - v2:", groupIds.map((groupId) => `groupv2(${groupId})`), "v1:", groupV1Ids.map((groupId) => `group(${groupId})`));
      const ids = [...groupIds, ...groupV1Ids];
      await this.storage.put("blocked-groups", ids);
      if (!(0, import_areArraysMatchingSets.areArraysMatchingSets)(previous, ids)) {
        changed = true;
        allIdentifiers.push(...previous);
        allIdentifiers.push(...ids);
      }
    }
    this.removeFromCache(envelope);
    if (changed) {
      log.info("handleBlocked: Block list changed, forcing re-render.");
      const uniqueIdentifiers = Array.from(new Set(allIdentifiers));
      window.ConversationController.forceRerender(uniqueIdentifiers);
    }
  }
  isBlocked(number) {
    return this.storage.blocked.isBlocked(number);
  }
  isUuidBlocked(uuid) {
    return this.storage.blocked.isUuidBlocked(uuid);
  }
  isGroupBlocked(groupId) {
    return this.storage.blocked.isGroupBlocked(groupId);
  }
  async handleAttachment(attachment) {
    const cleaned = (0, import_processDataMessage.processAttachment)(attachment);
    return (0, import_downloadAttachment.downloadAttachment)(this.server, cleaned);
  }
  async handleEndSession(envelope, theirUuid) {
    log.info(`handleEndSession: closing sessions for ${theirUuid.toString()}`);
    logUnexpectedUrgentValue(envelope, "resetSession");
    await this.storage.protocol.archiveAllSessions(theirUuid);
  }
  async processDecrypted(envelope, decrypted) {
    return (0, import_processDataMessage.processDataMessage)(decrypted, envelope.timestamp);
  }
}
function envelopeTypeToCiphertextType(type) {
  const { Type } = import_protobuf.SignalService.Envelope;
  if (type === Type.CIPHERTEXT) {
    return import_libsignal_client.CiphertextMessageType.Whisper;
  }
  if (type === Type.KEY_EXCHANGE) {
    throw new Error("envelopeTypeToCiphertextType: Cannot process KEY_EXCHANGE messages");
  }
  if (type === Type.PLAINTEXT_CONTENT) {
    return import_libsignal_client.CiphertextMessageType.Plaintext;
  }
  if (type === Type.PREKEY_BUNDLE) {
    return import_libsignal_client.CiphertextMessageType.PreKey;
  }
  if (type === Type.RECEIPT) {
    return import_libsignal_client.CiphertextMessageType.Plaintext;
  }
  if (type === Type.UNIDENTIFIED_SENDER) {
    throw new Error("envelopeTypeToCiphertextType: Cannot process UNIDENTIFIED_SENDER messages");
  }
  if (type === Type.UNKNOWN) {
    throw new Error("envelopeTypeToCiphertextType: Cannot process UNKNOWN messages");
  }
  throw new Error(`envelopeTypeToCiphertextType: Unknown type ${type}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZVJlY2VpdmVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuXG5pbXBvcnQgeyBpc0Jvb2xlYW4sIGlzTnVtYmVyIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5pbXBvcnQgeyB2NCBhcyBnZXRHdWlkIH0gZnJvbSAndXVpZCc7XG5cbmltcG9ydCB0eXBlIHtcbiAgU2VhbGVkU2VuZGVyRGVjcnlwdGlvblJlc3VsdCxcbiAgU2VuZGVyQ2VydGlmaWNhdGUsXG4gIFVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2VDb250ZW50LFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuaW1wb3J0IHtcbiAgQ2lwaGVydGV4dE1lc3NhZ2VUeXBlLFxuICBEZWNyeXB0aW9uRXJyb3JNZXNzYWdlLFxuICBncm91cERlY3J5cHQsXG4gIFBsYWludGV4dENvbnRlbnQsXG4gIFByZUtleVNpZ25hbE1lc3NhZ2UsXG4gIHByb2Nlc3NTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlLFxuICBQcm90b2NvbEFkZHJlc3MsXG4gIFB1YmxpY0tleSxcbiAgc2VhbGVkU2VuZGVyRGVjcnlwdE1lc3NhZ2UsXG4gIHNlYWxlZFNlbmRlckRlY3J5cHRUb1VzbWMsXG4gIFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UsXG4gIHNpZ25hbERlY3J5cHQsXG4gIHNpZ25hbERlY3J5cHRQcmVLZXksXG4gIFNpZ25hbE1lc3NhZ2UsXG59IGZyb20gJ0BzaWduYWxhcHAvbGlic2lnbmFsLWNsaWVudCc7XG5cbmltcG9ydCB7XG4gIElkZW50aXR5S2V5cyxcbiAgUHJlS2V5cyxcbiAgU2VuZGVyS2V5cyxcbiAgU2Vzc2lvbnMsXG4gIFNpZ25lZFByZUtleXMsXG59IGZyb20gJy4uL0xpYlNpZ25hbFN0b3Jlcyc7XG5pbXBvcnQgeyB2ZXJpZnlTaWduYXR1cmUgfSBmcm9tICcuLi9DdXJ2ZSc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgdHlwZSB7IEJhdGNoZXJUeXBlIH0gZnJvbSAnLi4vdXRpbC9iYXRjaGVyJztcbmltcG9ydCB7IGNyZWF0ZUJhdGNoZXIgfSBmcm9tICcuLi91dGlsL2JhdGNoZXInO1xuaW1wb3J0IHsgZHJvcE51bGwgfSBmcm9tICcuLi91dGlsL2Ryb3BOdWxsJztcbmltcG9ydCB7IG5vcm1hbGl6ZVV1aWQgfSBmcm9tICcuLi91dGlsL25vcm1hbGl6ZVV1aWQnO1xuaW1wb3J0IHsgcGFyc2VJbnRPclRocm93IH0gZnJvbSAnLi4vdXRpbC9wYXJzZUludE9yVGhyb3cnO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkgfSBmcm9tICcuLi91dGlsL2NsZWFyVGltZW91dElmTmVjZXNzYXJ5JztcbmltcG9ydCB7IFpvbmUgfSBmcm9tICcuLi91dGlsL1pvbmUnO1xuaW1wb3J0IHsgZGVyaXZlTWFzdGVyS2V5RnJvbUdyb3VwVjEgfSBmcm9tICcuLi9DcnlwdG8nO1xuaW1wb3J0IHR5cGUgeyBEb3dubG9hZGVkQXR0YWNobWVudFR5cGUgfSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IEFkZHJlc3MgfSBmcm9tICcuLi90eXBlcy9BZGRyZXNzJztcbmltcG9ydCB7IFF1YWxpZmllZEFkZHJlc3MgfSBmcm9tICcuLi90eXBlcy9RdWFsaWZpZWRBZGRyZXNzJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IFVVSUQsIFVVSURLaW5kIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB7IGlzRW5hYmxlZCB9IGZyb20gJy4uL1JlbW90ZUNvbmZpZyc7XG5cbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgeyBkZXJpdmVHcm91cEZpZWxkcywgTUFTVEVSX0tFWV9MRU5HVEggfSBmcm9tICcuLi9ncm91cHMnO1xuXG5pbXBvcnQgY3JlYXRlVGFza1dpdGhUaW1lb3V0IGZyb20gJy4vVGFza1dpdGhUaW1lb3V0JztcbmltcG9ydCB7XG4gIHByb2Nlc3NBdHRhY2htZW50LFxuICBwcm9jZXNzRGF0YU1lc3NhZ2UsXG4gIHByb2Nlc3NHcm91cFYyQ29udGV4dCxcbn0gZnJvbSAnLi9wcm9jZXNzRGF0YU1lc3NhZ2UnO1xuaW1wb3J0IHsgcHJvY2Vzc1N5bmNNZXNzYWdlIH0gZnJvbSAnLi9wcm9jZXNzU3luY01lc3NhZ2UnO1xuaW1wb3J0IHR5cGUgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuL0V2ZW50VGFyZ2V0JztcbmltcG9ydCBFdmVudFRhcmdldCBmcm9tICcuL0V2ZW50VGFyZ2V0JztcbmltcG9ydCB7IGRvd25sb2FkQXR0YWNobWVudCB9IGZyb20gJy4vZG93bmxvYWRBdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgSW5jb21pbmdXZWJTb2NrZXRSZXF1ZXN0IH0gZnJvbSAnLi9XZWJzb2NrZXRSZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29udGFjdEJ1ZmZlciwgR3JvdXBCdWZmZXIgfSBmcm9tICcuL0NvbnRhY3RzUGFyc2VyJztcbmltcG9ydCB0eXBlIHsgV2ViQVBJVHlwZSB9IGZyb20gJy4vV2ViQVBJJztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBXYXJuT25seUVycm9yIH0gZnJvbSAnLi9FcnJvcnMnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHR5cGUge1xuICBQcm9jZXNzZWRBdHRhY2htZW50LFxuICBQcm9jZXNzZWREYXRhTWVzc2FnZSxcbiAgUHJvY2Vzc2VkU3luY01lc3NhZ2UsXG4gIFByb2Nlc3NlZFNlbnQsXG4gIFByb2Nlc3NlZEVudmVsb3BlLFxuICBJUmVxdWVzdEhhbmRsZXIsXG4gIFVucHJvY2Vzc2VkVHlwZSxcbn0gZnJvbSAnLi9UeXBlcy5kJztcbmltcG9ydCB7XG4gIEVtcHR5RXZlbnQsXG4gIEVudmVsb3BlRXZlbnQsXG4gIFByb2dyZXNzRXZlbnQsXG4gIFR5cGluZ0V2ZW50LFxuICBFcnJvckV2ZW50LFxuICBEZWxpdmVyeUV2ZW50LFxuICBEZWNyeXB0aW9uRXJyb3JFdmVudCxcbiAgU2VudEV2ZW50LFxuICBQcm9maWxlS2V5VXBkYXRlRXZlbnQsXG4gIE1lc3NhZ2VFdmVudCxcbiAgUmV0cnlSZXF1ZXN0RXZlbnQsXG4gIFJlYWRFdmVudCxcbiAgVmlld0V2ZW50LFxuICBDb25maWd1cmF0aW9uRXZlbnQsXG4gIFZpZXdPbmNlT3BlblN5bmNFdmVudCxcbiAgTWVzc2FnZVJlcXVlc3RSZXNwb25zZUV2ZW50LFxuICBGZXRjaExhdGVzdEV2ZW50LFxuICBLZXlzRXZlbnQsXG4gIFN0aWNrZXJQYWNrRXZlbnQsXG4gIFJlYWRTeW5jRXZlbnQsXG4gIFZpZXdTeW5jRXZlbnQsXG4gIENvbnRhY3RFdmVudCxcbiAgQ29udGFjdFN5bmNFdmVudCxcbiAgR3JvdXBFdmVudCxcbiAgR3JvdXBTeW5jRXZlbnQsXG4gIFN0b3J5UmVjaXBpZW50VXBkYXRlRXZlbnQsXG59IGZyb20gJy4vbWVzc2FnZVJlY2VpdmVyRXZlbnRzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgYXJlQXJyYXlzTWF0Y2hpbmdTZXRzIH0gZnJvbSAnLi4vdXRpbC9hcmVBcnJheXNNYXRjaGluZ1NldHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVCbHVySGFzaCB9IGZyb20gJy4uL3V0aWwvZ2VuZXJhdGVCbHVySGFzaCc7XG5pbXBvcnQgeyBURVhUX0FUVEFDSE1FTlQgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB0eXBlIHsgU2VuZFR5cGVzVHlwZSB9IGZyb20gJy4uL3V0aWwvaGFuZGxlTWVzc2FnZVNlbmQnO1xuXG5jb25zdCBHUk9VUFYxX0lEX0xFTkdUSCA9IDE2O1xuY29uc3QgR1JPVVBWMl9JRF9MRU5HVEggPSAzMjtcbmNvbnN0IFJFVFJZX1RJTUVPVVQgPSAyICogNjAgKiAxMDAwO1xuXG50eXBlIFVuc2VhbGVkRW52ZWxvcGUgPSBSZWFkb25seTxcbiAgUHJvY2Vzc2VkRW52ZWxvcGUgJiB7XG4gICAgdW5pZGVudGlmaWVkRGVsaXZlcnlSZWNlaXZlZD86IGJvb2xlYW47XG4gICAgY29udGVudEhpbnQ/OiBudW1iZXI7XG4gICAgZ3JvdXBJZD86IHN0cmluZztcbiAgICBjaXBoZXJUZXh0Qnl0ZXM/OiBVaW50OEFycmF5O1xuICAgIGNpcGhlclRleHRUeXBlPzogbnVtYmVyO1xuICAgIGNlcnRpZmljYXRlPzogU2VuZGVyQ2VydGlmaWNhdGU7XG4gICAgdW5zZWFsZWRDb250ZW50PzogVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZUNvbnRlbnQ7XG4gIH1cbj47XG5cbnR5cGUgRGVjcnlwdFJlc3VsdCA9IFJlYWRvbmx5PHtcbiAgZW52ZWxvcGU6IFVuc2VhbGVkRW52ZWxvcGU7XG4gIHBsYWludGV4dD86IFVpbnQ4QXJyYXk7XG59PjtcblxudHlwZSBEZWNyeXB0U2VhbGVkU2VuZGVyUmVzdWx0ID0gUmVhZG9ubHk8e1xuICBwbGFpbnRleHQ/OiBVaW50OEFycmF5O1xuICB1bnNlYWxlZFBsYWludGV4dD86IFNlYWxlZFNlbmRlckRlY3J5cHRpb25SZXN1bHQ7XG59PjtcblxudHlwZSBDYWNoZUFkZEl0ZW1UeXBlID0ge1xuICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGU7XG4gIGRhdGE6IFVucHJvY2Vzc2VkVHlwZTtcbiAgcmVxdWVzdDogUGljazxJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QsICdyZXNwb25kJz47XG59O1xuXG50eXBlIExvY2tlZFN0b3JlcyA9IHtcbiAgcmVhZG9ubHkgc2VuZGVyS2V5U3RvcmU6IFNlbmRlcktleXM7XG4gIHJlYWRvbmx5IHNlc3Npb25TdG9yZTogU2Vzc2lvbnM7XG4gIHJlYWRvbmx5IGlkZW50aXR5S2V5U3RvcmU6IElkZW50aXR5S2V5cztcbiAgcmVhZG9ubHkgem9uZT86IFpvbmU7XG59O1xuXG5lbnVtIFRhc2tUeXBlIHtcbiAgRW5jcnlwdGVkID0gJ0VuY3J5cHRlZCcsXG4gIERlY3J5cHRlZCA9ICdEZWNyeXB0ZWQnLFxufVxuXG5leHBvcnQgdHlwZSBNZXNzYWdlUmVjZWl2ZXJPcHRpb25zID0ge1xuICBzZXJ2ZXI6IFdlYkFQSVR5cGU7XG4gIHN0b3JhZ2U6IFN0b3JhZ2U7XG4gIHNlcnZlclRydXN0Um9vdDogc3RyaW5nO1xufTtcblxuY29uc3QgTE9HX1VORVhQRUNURURfVVJHRU5UX1ZBTFVFUyA9IGZhbHNlO1xuY29uc3QgTVVTVF9CRV9VUkdFTlRfVFlQRVM6IEFycmF5PFNlbmRUeXBlc1R5cGU+ID0gW1xuICAnbWVzc2FnZScsXG4gICdkZWxldGVGb3JFdmVyeW9uZScsXG4gICdyZWFjdGlvbicsXG4gICdyZWFkU3luYycsXG5dO1xuY29uc3QgQ0FOX0JFX1VSR0VOVF9UWVBFUzogQXJyYXk8U2VuZFR5cGVzVHlwZT4gPSBbXG4gICdjYWxsaW5nTWVzc2FnZScsXG4gICdzZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlJyxcblxuICAvLyBEZXByZWNhdGVkXG4gICdyZXNldFNlc3Npb24nLFxuICAnbGVnYWN5R3JvdXBDaGFuZ2UnLFxuXTtcblxuZnVuY3Rpb24gbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKFxuICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gIHR5cGU6IFNlbmRUeXBlc1R5cGVcbikge1xuICBpZiAoIUxPR19VTkVYUEVDVEVEX1VSR0VOVF9WQUxVRVMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtdXN0QmVVcmdlbnQgPSBNVVNUX0JFX1VSR0VOVF9UWVBFUy5pbmNsdWRlcyh0eXBlKTtcbiAgY29uc3QgY2FuQmVVcmdlbnQgPSBtdXN0QmVVcmdlbnQgfHwgQ0FOX0JFX1VSR0VOVF9UWVBFUy5pbmNsdWRlcyh0eXBlKTtcblxuICBpZiAoZW52ZWxvcGUudXJnZW50ICYmICFjYW5CZVVyZ2VudCkge1xuICAgIGNvbnN0IGVudmVsb3BlSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cud2FybihcbiAgICAgIGAke2VudmVsb3BlSWR9OiBNZXNzYWdlIG9mIHR5cGUgJyR7dHlwZX0nIHdhcyBtYXJrZWQgdXJnZW50LCBidXQgc2hvdWxkbid0IGJlIWBcbiAgICApO1xuICB9XG4gIGlmICghZW52ZWxvcGUudXJnZW50ICYmIG11c3RCZVVyZ2VudCkge1xuICAgIGNvbnN0IGVudmVsb3BlSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cud2FybihcbiAgICAgIGAke2VudmVsb3BlSWR9OiBNZXNzYWdlIG9mIHR5cGUgJyR7dHlwZX0nIHdhc24ndCBtYXJrZWQgdXJnZW50LCBidXQgc2hvdWxkIGJlIWBcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVudmVsb3BlSWQoZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlKTogc3RyaW5nIHtcbiAgY29uc3QgeyB0aW1lc3RhbXAgfSA9IGVudmVsb3BlO1xuXG4gIGxldCBwcmVmaXggPSAnJztcblxuICBpZiAoZW52ZWxvcGUuc291cmNlVXVpZCB8fCBlbnZlbG9wZS5zb3VyY2UpIHtcbiAgICBjb25zdCBzZW5kZXIgPSBlbnZlbG9wZS5zb3VyY2VVdWlkIHx8IGVudmVsb3BlLnNvdXJjZTtcbiAgICBwcmVmaXggKz0gYCR7c2VuZGVyfS4ke2VudmVsb3BlLnNvdXJjZURldmljZX0gYDtcbiAgfVxuXG4gIHByZWZpeCArPSBgPiAke2VudmVsb3BlLmRlc3RpbmF0aW9uVXVpZC50b1N0cmluZygpfWA7XG5cbiAgcmV0dXJuIGAke3ByZWZpeH0gJHt0aW1lc3RhbXB9ICgke2VudmVsb3BlLmlkfSlgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlUmVjZWl2ZXJcbiAgZXh0ZW5kcyBFdmVudFRhcmdldFxuICBpbXBsZW1lbnRzIElSZXF1ZXN0SGFuZGxlclxue1xuICBwcml2YXRlIHNlcnZlcjogV2ViQVBJVHlwZTtcblxuICBwcml2YXRlIHN0b3JhZ2U6IFN0b3JhZ2U7XG5cbiAgcHJpdmF0ZSBhcHBRdWV1ZTogUFF1ZXVlO1xuXG4gIHByaXZhdGUgZGVjcnlwdEFuZENhY2hlQmF0Y2hlcjogQmF0Y2hlclR5cGU8Q2FjaGVBZGRJdGVtVHlwZT47XG5cbiAgcHJpdmF0ZSBjYWNoZVJlbW92ZUJhdGNoZXI6IEJhdGNoZXJUeXBlPHN0cmluZz47XG5cbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyO1xuXG4gIHByaXZhdGUgcHJvY2Vzc2VkQ291bnQ6IG51bWJlcjtcblxuICBwcml2YXRlIGluY29taW5nUXVldWU6IFBRdWV1ZTtcblxuICBwcml2YXRlIGlzRW1wdGllZD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBlbmNyeXB0ZWRRdWV1ZTogUFF1ZXVlO1xuXG4gIHByaXZhdGUgZGVjcnlwdGVkUXVldWU6IFBRdWV1ZTtcblxuICBwcml2YXRlIHJldHJ5Q2FjaGVkVGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBzZXJ2ZXJUcnVzdFJvb3Q6IFVpbnQ4QXJyYXk7XG5cbiAgcHJpdmF0ZSBzdG9wcGluZ1Byb2Nlc3Npbmc/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHsgc2VydmVyLCBzdG9yYWdlLCBzZXJ2ZXJUcnVzdFJvb3QgfTogTWVzc2FnZVJlY2VpdmVyT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuXG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5wcm9jZXNzZWRDb3VudCA9IDA7XG5cbiAgICBpZiAoIXNlcnZlclRydXN0Um9vdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2ZXIgdHJ1c3Qgcm9vdCBpcyByZXF1aXJlZCEnKTtcbiAgICB9XG4gICAgdGhpcy5zZXJ2ZXJUcnVzdFJvb3QgPSBCeXRlcy5mcm9tQmFzZTY0KHNlcnZlclRydXN0Um9vdCk7XG5cbiAgICB0aGlzLmluY29taW5nUXVldWUgPSBuZXcgUFF1ZXVlKHtcbiAgICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgICAgdGhyb3dPblRpbWVvdXQ6IHRydWUsXG4gICAgfSk7XG4gICAgdGhpcy5hcHBRdWV1ZSA9IG5ldyBQUXVldWUoe1xuICAgICAgY29uY3VycmVuY3k6IDEsXG4gICAgICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIEFsbCBlbnZlbG9wZXMgc3RhcnQgaW4gZW5jcnlwdGVkUXVldWUgYW5kIHByb2dyZXNzIHRvIGRlY3J5cHRlZFF1ZXVlXG4gICAgdGhpcy5lbmNyeXB0ZWRRdWV1ZSA9IG5ldyBQUXVldWUoe1xuICAgICAgY29uY3VycmVuY3k6IDEsXG4gICAgICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLmRlY3J5cHRlZFF1ZXVlID0gbmV3IFBRdWV1ZSh7XG4gICAgICBjb25jdXJyZW5jeTogMSxcbiAgICAgIHRocm93T25UaW1lb3V0OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kZWNyeXB0QW5kQ2FjaGVCYXRjaGVyID0gY3JlYXRlQmF0Y2hlcjxDYWNoZUFkZEl0ZW1UeXBlPih7XG4gICAgICBuYW1lOiAnTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHRBbmRDYWNoZUJhdGNoZXInLFxuICAgICAgd2FpdDogNzUsXG4gICAgICBtYXhTaXplOiAzMCxcbiAgICAgIHByb2Nlc3NCYXRjaDogKGl0ZW1zOiBBcnJheTxDYWNoZUFkZEl0ZW1UeXBlPikgPT4ge1xuICAgICAgICAvLyBOb3QgcmV0dXJuaW5nIHRoZSBwcm9taXNlIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YWxsXG4gICAgICAgIC8vIHRoZSBiYXRjaC5cbiAgICAgICAgdGhpcy5kZWNyeXB0QW5kQ2FjaGVCYXRjaChpdGVtcyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuY2FjaGVSZW1vdmVCYXRjaGVyID0gY3JlYXRlQmF0Y2hlcjxzdHJpbmc+KHtcbiAgICAgIG5hbWU6ICdNZXNzYWdlUmVjZWl2ZXIuY2FjaGVSZW1vdmVCYXRjaGVyJyxcbiAgICAgIHdhaXQ6IDc1LFxuICAgICAgbWF4U2l6ZTogMzAsXG4gICAgICBwcm9jZXNzQmF0Y2g6IHRoaXMuY2FjaGVSZW1vdmVCYXRjaC5iaW5kKHRoaXMpLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldEFuZFJlc2V0UHJvY2Vzc2VkQ291bnQoKTogbnVtYmVyIHtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMucHJvY2Vzc2VkQ291bnQ7XG4gICAgdGhpcy5wcm9jZXNzZWRDb3VudCA9IDA7XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVJlcXVlc3QocmVxdWVzdDogSW5jb21pbmdXZWJTb2NrZXRSZXF1ZXN0KTogdm9pZCB7XG4gICAgLy8gV2UgZG8gdGhlIG1lc3NhZ2UgZGVjcnlwdGlvbiBoZXJlLCBpbnN0ZWFkIG9mIGluIHRoZSBvcmRlcmVkIHBlbmRpbmcgcXVldWUsXG4gICAgLy8gdG8gYXZvaWQgZXhwb3NpbmcgdGhlIHRpbWUgaXQgdG9vayB1cyB0byBwcm9jZXNzIG1lc3NhZ2VzIHRocm91Z2ggdGhlIHRpbWUtdG8tYWNrLlxuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXI6IGdvdCByZXF1ZXN0JywgcmVxdWVzdC52ZXJiLCByZXF1ZXN0LnBhdGgpO1xuICAgIGlmIChyZXF1ZXN0LnBhdGggIT09ICcvYXBpL3YxL21lc3NhZ2UnKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbmQoMjAwLCAnT0snKTtcblxuICAgICAgaWYgKHJlcXVlc3QudmVyYiA9PT0gJ1BVVCcgJiYgcmVxdWVzdC5wYXRoID09PSAnL2FwaS92MS9xdWV1ZS9lbXB0eScpIHtcbiAgICAgICAgdGhpcy5pbmNvbWluZ1F1ZXVlLmFkZChcbiAgICAgICAgICBjcmVhdGVUYXNrV2l0aFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkVtcHR5KCk7XG4gICAgICAgICAgfSwgJ2luY29taW5nUXVldWUvb25FbXB0eScpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgam9iID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyB8fCBbXTtcblxuICAgICAgaWYgKCFyZXF1ZXN0LmJvZHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlUmVxdWVzdDogcmVxdWVzdC5ib2R5IHdhcyBmYWxzZXkhJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwbGFpbnRleHQgPSByZXF1ZXN0LmJvZHk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSBQcm90by5FbnZlbG9wZS5kZWNvZGUocGxhaW50ZXh0KTtcbiAgICAgICAgY29uc3Qgc2VydmVyVGltZXN0YW1wID0gZGVjb2RlZC5zZXJ2ZXJUaW1lc3RhbXA/LnRvTnVtYmVyKCk7XG5cbiAgICAgICAgY29uc3Qgb3VyVXVpZCA9IHRoaXMuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG5cbiAgICAgICAgY29uc3QgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlID0ge1xuICAgICAgICAgIC8vIE1ha2Ugbm9uLXByaXZhdGUgZW52ZWxvcGUgSURzIGRhc2hsZXNzIHNvIHRoZXkgZG9uJ3QgZ2V0IHJlZGFjdGVkXG4gICAgICAgICAgLy8gICBmcm9tIGxvZ3NcbiAgICAgICAgICBpZDogZ2V0R3VpZCgpLnJlcGxhY2UoLy0vZywgJycpLFxuICAgICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiB3aW5kb3cuU2lnbmFsLlV0aWwuaW5jcmVtZW50TWVzc2FnZUNvdW50ZXIoKSxcbiAgICAgICAgICByZWNlaXZlZEF0RGF0ZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIG1lc3NhZ2UgYWdlICh0aW1lIG9uIHNlcnZlcikuXG4gICAgICAgICAgbWVzc2FnZUFnZVNlYzogdGhpcy5jYWxjdWxhdGVNZXNzYWdlQWdlKGhlYWRlcnMsIHNlcnZlclRpbWVzdGFtcCksXG5cbiAgICAgICAgICAvLyBQcm90by5FbnZlbG9wZSBmaWVsZHNcbiAgICAgICAgICB0eXBlOiBkZWNvZGVkLnR5cGUsXG4gICAgICAgICAgc291cmNlVXVpZDogZGVjb2RlZC5zb3VyY2VVdWlkXG4gICAgICAgICAgICA/IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgICAgICAgICAgZGVjb2RlZC5zb3VyY2VVdWlkLFxuICAgICAgICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlUmVxdWVzdC5zb3VyY2VVdWlkJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzb3VyY2VEZXZpY2U6IGRlY29kZWQuc291cmNlRGV2aWNlLFxuICAgICAgICAgIGRlc3RpbmF0aW9uVXVpZDogZGVjb2RlZC5kZXN0aW5hdGlvblV1aWRcbiAgICAgICAgICAgID8gbmV3IFVVSUQoXG4gICAgICAgICAgICAgICAgbm9ybWFsaXplVXVpZChcbiAgICAgICAgICAgICAgICAgIGRlY29kZWQuZGVzdGluYXRpb25VdWlkLFxuICAgICAgICAgICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVSZXF1ZXN0LmRlc3RpbmF0aW9uVXVpZCdcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogb3VyVXVpZCxcbiAgICAgICAgICB1cGRhdGVkUG5pOiBkZWNvZGVkLnVwZGF0ZWRQbmlcbiAgICAgICAgICAgID8gbmV3IFVVSUQoXG4gICAgICAgICAgICAgICAgbm9ybWFsaXplVXVpZChcbiAgICAgICAgICAgICAgICAgIGRlY29kZWQudXBkYXRlZFBuaSxcbiAgICAgICAgICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlUmVxdWVzdC51cGRhdGVkUG5pJ1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgdGltZXN0YW1wOiBkZWNvZGVkLnRpbWVzdGFtcD8udG9OdW1iZXIoKSxcbiAgICAgICAgICBjb250ZW50OiBkcm9wTnVsbChkZWNvZGVkLmNvbnRlbnQpLFxuICAgICAgICAgIHNlcnZlckd1aWQ6IGRlY29kZWQuc2VydmVyR3VpZCxcbiAgICAgICAgICBzZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgICAgdXJnZW50OiBpc0Jvb2xlYW4oZGVjb2RlZC51cmdlbnQpID8gZGVjb2RlZC51cmdlbnQgOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFmdGVyIHRoaXMgcG9pbnQsIGRlY29kaW5nIGVycm9ycyBhcmUgbm90IHRoZSBzZXJ2ZXInc1xuICAgICAgICAvLyAgIGZhdWx0LCBhbmQgd2Ugc2hvdWxkIGhhbmRsZSB0aGVtIGdyYWNlZnVsbHkgYW5kIHRlbGwgdGhlXG4gICAgICAgIC8vICAgdXNlciB0aGV5IHJlY2VpdmVkIGFuIGludmFsaWQgbWVzc2FnZVxuXG4gICAgICAgIHRoaXMuZGVjcnlwdEFuZENhY2hlKGVudmVsb3BlLCBwbGFpbnRleHQsIHJlcXVlc3QpO1xuICAgICAgICB0aGlzLnByb2Nlc3NlZENvdW50ICs9IDE7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uZCg1MDAsICdCYWQgZW5jcnlwdGVkIHdlYnNvY2tldCBtZXNzYWdlJyk7XG4gICAgICAgIGxvZy5lcnJvcignRXJyb3IgaGFuZGxpbmcgaW5jb21pbmcgbWVzc2FnZTonLCBFcnJvcnMudG9Mb2dGb3JtYXQoZSkpO1xuICAgICAgICBhd2FpdCB0aGlzLmRpc3BhdGNoQW5kV2FpdChuZXcgRXJyb3JFdmVudChlKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaW5jb21pbmdRdWV1ZS5hZGQoXG4gICAgICBjcmVhdGVUYXNrV2l0aFRpbWVvdXQoam9iLCAnaW5jb21pbmdRdWV1ZS93ZWJzb2NrZXQnKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgLy8gV2UgYWx3YXlzIHByb2Nlc3Mgb3VyIGNhY2hlIGJlZm9yZSBwcm9jZXNzaW5nIGEgbmV3IHdlYnNvY2tldCBtZXNzYWdlXG4gICAgdGhpcy5pbmNvbWluZ1F1ZXVlLmFkZChcbiAgICAgIGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5xdWV1ZUFsbENhY2hlZCgpLFxuICAgICAgICAnaW5jb21pbmdRdWV1ZS9xdWV1ZUFsbENhY2hlZCdcbiAgICAgIClcbiAgICApO1xuXG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pc0VtcHRpZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0b3BwaW5nUHJvY2Vzc2luZyA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHN0b3BQcm9jZXNzaW5nKCk6IHZvaWQge1xuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuc3RvcFByb2Nlc3NpbmcnKTtcbiAgICB0aGlzLnN0b3BwaW5nUHJvY2Vzc2luZyA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaGFzRW1wdGllZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmlzRW1wdGllZCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZHJhaW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvckVuY3J5cHRlZFF1ZXVlID0gYXN5bmMgKCkgPT5cbiAgICAgIHRoaXMuYWRkVG9RdWV1ZShcbiAgICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxvZy5pbmZvKCdkcmFpbmVkJyk7XG4gICAgICAgIH0sXG4gICAgICAgICdkcmFpbi93YWl0Rm9yRGVjcnlwdGVkJyxcbiAgICAgICAgVGFza1R5cGUuRGVjcnlwdGVkXG4gICAgICApO1xuXG4gICAgY29uc3Qgd2FpdEZvckluY29taW5nUXVldWUgPSBhc3luYyAoKSA9PlxuICAgICAgdGhpcy5hZGRUb1F1ZXVlKFxuICAgICAgICB3YWl0Rm9yRW5jcnlwdGVkUXVldWUsXG4gICAgICAgICdkcmFpbi93YWl0Rm9yRW5jcnlwdGVkJyxcbiAgICAgICAgVGFza1R5cGUuRW5jcnlwdGVkXG4gICAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5jb21pbmdRdWV1ZS5hZGQoXG4gICAgICBjcmVhdGVUYXNrV2l0aFRpbWVvdXQod2FpdEZvckluY29taW5nUXVldWUsICdkcmFpbi93YWl0Rm9ySW5jb21pbmcnKVxuICAgICk7XG4gIH1cblxuICAvL1xuICAvLyBFdmVudFRhcmdldCB0eXBlc1xuICAvL1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdlbXB0eScsXG4gICAgaGFuZGxlcjogKGV2OiBFbXB0eUV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3Byb2dyZXNzJyxcbiAgICBoYW5kbGVyOiAoZXY6IFByb2dyZXNzRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAndHlwaW5nJyxcbiAgICBoYW5kbGVyOiAoZXY6IFR5cGluZ0V2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ2Vycm9yJyxcbiAgICBoYW5kbGVyOiAoZXY6IEVycm9yRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnZGVsaXZlcnknLFxuICAgIGhhbmRsZXI6IChldjogRGVsaXZlcnlFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdkZWNyeXB0aW9uLWVycm9yJyxcbiAgICBoYW5kbGVyOiAoZXY6IERlY3J5cHRpb25FcnJvckV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3NlbnQnLFxuICAgIGhhbmRsZXI6IChldjogU2VudEV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3Byb2ZpbGVLZXlVcGRhdGUnLFxuICAgIGhhbmRsZXI6IChldjogUHJvZmlsZUtleVVwZGF0ZUV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ21lc3NhZ2UnLFxuICAgIGhhbmRsZXI6IChldjogTWVzc2FnZUV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3JldHJ5LXJlcXVlc3QnLFxuICAgIGhhbmRsZXI6IChldjogUmV0cnlSZXF1ZXN0RXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAncmVhZCcsXG4gICAgaGFuZGxlcjogKGV2OiBSZWFkRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAndmlldycsXG4gICAgaGFuZGxlcjogKGV2OiBWaWV3RXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnY29uZmlndXJhdGlvbicsXG4gICAgaGFuZGxlcjogKGV2OiBDb25maWd1cmF0aW9uRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAndmlld09uY2VPcGVuU3luYycsXG4gICAgaGFuZGxlcjogKGV2OiBWaWV3T25jZU9wZW5TeW5jRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnbWVzc2FnZVJlcXVlc3RSZXNwb25zZScsXG4gICAgaGFuZGxlcjogKGV2OiBNZXNzYWdlUmVxdWVzdFJlc3BvbnNlRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnZmV0Y2hMYXRlc3QnLFxuICAgIGhhbmRsZXI6IChldjogRmV0Y2hMYXRlc3RFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdrZXlzJyxcbiAgICBoYW5kbGVyOiAoZXY6IEtleXNFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdzdGlja2VyLXBhY2snLFxuICAgIGhhbmRsZXI6IChldjogU3RpY2tlclBhY2tFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdyZWFkU3luYycsXG4gICAgaGFuZGxlcjogKGV2OiBSZWFkU3luY0V2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3ZpZXdTeW5jJyxcbiAgICBoYW5kbGVyOiAoZXY6IFZpZXdTeW5jRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnY29udGFjdCcsXG4gICAgaGFuZGxlcjogKGV2OiBDb250YWN0RXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBuYW1lOiAnY29udGFjdFN5bmMnLFxuICAgIGhhbmRsZXI6IChldjogQ29udGFjdFN5bmNFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdncm91cCcsXG4gICAgaGFuZGxlcjogKGV2OiBHcm91cEV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ2dyb3VwU3luYycsXG4gICAgaGFuZGxlcjogKGV2OiBHcm91cFN5bmNFdmVudCkgPT4gdm9pZFxuICApOiB2b2lkO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyKFxuICAgIG5hbWU6ICdlbnZlbG9wZScsXG4gICAgaGFuZGxlcjogKGV2OiBFbnZlbG9wZUV2ZW50KSA9PiB2b2lkXG4gICk6IHZvaWQ7XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ3N0b3J5UmVjaXBpZW50VXBkYXRlJyxcbiAgICBoYW5kbGVyOiAoZXY6IFN0b3J5UmVjaXBpZW50VXBkYXRlRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHZvaWQge1xuICAgIHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGhhbmRsZXIpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGhhbmRsZXI6IEV2ZW50SGFuZGxlclxuICApOiB2b2lkIHtcbiAgICByZXR1cm4gc3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBoYW5kbGVyKTtcbiAgfVxuXG4gIC8vXG4gIC8vIFByaXZhdGVcbiAgLy9cblxuICBwcml2YXRlIGFzeW5jIGRpc3BhdGNoQW5kV2FpdChldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmFwcFF1ZXVlLmFkZChcbiAgICAgIGNyZWF0ZVRhc2tXaXRoVGltZW91dChcbiAgICAgICAgYXN5bmMgKCkgPT4gUHJvbWlzZS5hbGwodGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KSksXG4gICAgICAgICdkaXNwYXRjaEV2ZW50J1xuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZU1lc3NhZ2VBZ2UoXG4gICAgaGVhZGVyczogUmVhZG9ubHlBcnJheTxzdHJpbmc+LFxuICAgIHNlcnZlclRpbWVzdGFtcD86IG51bWJlclxuICApOiBudW1iZXIge1xuICAgIGxldCBtZXNzYWdlQWdlU2VjID0gMDsgLy8gRGVmYXVsdCB0byAwIGluIGNhc2Ugb2YgdW5yZWxpYWJsZSBwYXJhbWV0ZXJzLlxuXG4gICAgaWYgKHNlcnZlclRpbWVzdGFtcCkge1xuICAgICAgLy8gVGhlICdYLVNpZ25hbC1UaW1lc3RhbXAnIGlzIHVzdWFsbHkgdGhlIGxhc3QgaXRlbSwgc28gc3RhcnQgdGhlcmUuXG4gICAgICBsZXQgaXQgPSBoZWFkZXJzLmxlbmd0aDtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wbHVzcGx1c1xuICAgICAgd2hpbGUgKC0taXQgPj0gMCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGhlYWRlcnNbaXRdLm1hdGNoKC9eWC1TaWduYWwtVGltZXN0YW1wOlxccyooXFxkKylcXHMqJC8pO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgY29uc3QgdGltZXN0YW1wID0gTnVtYmVyKG1hdGNoWzFdKTtcblxuICAgICAgICAgIC8vIE9uZSBmaW5hbCBzYW5pdHkgY2hlY2ssIHRoZSB0aW1lc3RhbXAgd2hlbiBhIG1lc3NhZ2UgaXMgcHVsbGVkIGZyb21cbiAgICAgICAgICAvLyB0aGUgc2VydmVyIHNob3VsZCBiZSBsYXRlciB0aGFuIHdoZW4gaXQgd2FzIHB1c2hlZC5cbiAgICAgICAgICBpZiAodGltZXN0YW1wID4gc2VydmVyVGltZXN0YW1wKSB7XG4gICAgICAgICAgICBtZXNzYWdlQWdlU2VjID0gTWF0aC5mbG9vcigodGltZXN0YW1wIC0gc2VydmVyVGltZXN0YW1wKSAvIDEwMDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VBZ2VTZWM7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFkZFRvUXVldWU8VD4oXG4gICAgdGFzazogKCkgPT4gUHJvbWlzZTxUPixcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhc2tUeXBlOiBUYXNrVHlwZVxuICApOiBQcm9taXNlPFQ+IHtcbiAgICBpZiAodGFza1R5cGUgPT09IFRhc2tUeXBlLkVuY3J5cHRlZCkge1xuICAgICAgdGhpcy5jb3VudCArPSAxO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXVlID1cbiAgICAgIHRhc2tUeXBlID09PSBUYXNrVHlwZS5FbmNyeXB0ZWRcbiAgICAgICAgPyB0aGlzLmVuY3J5cHRlZFF1ZXVlXG4gICAgICAgIDogdGhpcy5kZWNyeXB0ZWRRdWV1ZTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcXVldWUuYWRkKGNyZWF0ZVRhc2tXaXRoVGltZW91dCh0YXNrLCBpZCkpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKHRoaXMuY291bnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25FbXB0eSgpOiB2b2lkIHtcbiAgICBjb25zdCBlbWl0RW1wdHkgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHRoaXMuZGVjcnlwdEFuZENhY2hlQmF0Y2hlci5mbHVzaEFuZFdhaXQoKSxcbiAgICAgICAgdGhpcy5jYWNoZVJlbW92ZUJhdGNoZXIuZmx1c2hBbmRXYWl0KCksXG4gICAgICBdKTtcblxuICAgICAgbG9nLmluZm8oXCJNZXNzYWdlUmVjZWl2ZXI6IGVtaXR0aW5nICdlbXB0eScgZXZlbnRcIik7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEVtcHR5RXZlbnQoKSk7XG4gICAgICB0aGlzLmlzRW1wdGllZCA9IHRydWU7XG5cbiAgICAgIHRoaXMubWF5YmVTY2hlZHVsZVJldHJ5VGltZW91dCgpO1xuICAgIH07XG5cbiAgICBjb25zdCB3YWl0Rm9yRGVjcnlwdGVkUXVldWUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgXCJNZXNzYWdlUmVjZWl2ZXI6IGZpbmlzaGVkIHByb2Nlc3NpbmcgbWVzc2FnZXMgYWZ0ZXIgJ2VtcHR5Jywgbm93IHdhaXRpbmcgZm9yIGFwcGxpY2F0aW9uXCJcbiAgICAgICk7XG5cbiAgICAgIC8vIFdlIGRvbid0IGF3YWl0IGhlcmUgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoaXMgdG8gZ2F0ZSBmdXR1cmUgbWVzc2FnZSBwcm9jZXNzaW5nXG4gICAgICB0aGlzLmFwcFF1ZXVlLmFkZChjcmVhdGVUYXNrV2l0aFRpbWVvdXQoZW1pdEVtcHR5LCAnZW1pdEVtcHR5JykpO1xuICAgIH07XG5cbiAgICBjb25zdCB3YWl0Rm9yRW5jcnlwdGVkUXVldWUgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLmFkZFRvUXVldWUoXG4gICAgICAgIHdhaXRGb3JEZWNyeXB0ZWRRdWV1ZSxcbiAgICAgICAgJ29uRW1wdHkvd2FpdEZvckRlY3J5cHRlZCcsXG4gICAgICAgIFRhc2tUeXBlLkRlY3J5cHRlZFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2FpdEZvckluY29taW5nUXVldWUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBOb3RlOiB0aGlzLmNvdW50IGlzIHVzZWQgaW4gYWRkVG9RdWV1ZVxuICAgICAgLy8gUmVzZXR0aW5nIGNvdW50IHNvIGV2ZXJ5dGhpbmcgZnJvbSB0aGUgd2Vic29ja2V0IGFmdGVyIHRoaXMgc3RhcnRzIGF0IHplcm9cbiAgICAgIHRoaXMuY291bnQgPSAwO1xuXG4gICAgICB0aGlzLmFkZFRvUXVldWUoXG4gICAgICAgIHdhaXRGb3JFbmNyeXB0ZWRRdWV1ZSxcbiAgICAgICAgJ29uRW1wdHkvd2FpdEZvckVuY3J5cHRlZCcsXG4gICAgICAgIFRhc2tUeXBlLkVuY3J5cHRlZFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2FpdEZvckNhY2hlQWRkQmF0Y2hlciA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuZGVjcnlwdEFuZENhY2hlQmF0Y2hlci5vbklkbGUoKTtcbiAgICAgIHRoaXMuaW5jb21pbmdRdWV1ZS5hZGQoXG4gICAgICAgIGNyZWF0ZVRhc2tXaXRoVGltZW91dCh3YWl0Rm9ySW5jb21pbmdRdWV1ZSwgJ29uRW1wdHkvd2FpdEZvckluY29taW5nJylcbiAgICAgICk7XG4gICAgfTtcblxuICAgIHdhaXRGb3JDYWNoZUFkZEJhdGNoZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUHJvZ3Jlc3MoY291bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIGNvdW50IGJ5IDEwc1xuICAgIGlmIChjb3VudCAlIDEwICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgUHJvZ3Jlc3NFdmVudCh7IGNvdW50IH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcXVldWVBbGxDYWNoZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbEZyb21DYWNoZSgpO1xuICAgIGNvbnN0IG1heCA9IGl0ZW1zLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heDsgaSArPSAxKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgdGhpcy5xdWV1ZUNhY2hlZChpdGVtc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBxdWV1ZUNhY2hlZChpdGVtOiBVbnByb2Nlc3NlZFR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygnTWVzc2FnZVJlY2VpdmVyLnF1ZXVlQ2FjaGVkJywgaXRlbS5pZCk7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBlbnZlbG9wZVBsYWludGV4dDogVWludDhBcnJheTtcblxuICAgICAgaWYgKGl0ZW0uZW52ZWxvcGUgJiYgaXRlbS52ZXJzaW9uID09PSAyKSB7XG4gICAgICAgIGVudmVsb3BlUGxhaW50ZXh0ID0gQnl0ZXMuZnJvbUJhc2U2NChpdGVtLmVudmVsb3BlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5lbnZlbG9wZSAmJiB0eXBlb2YgaXRlbS5lbnZlbG9wZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZW52ZWxvcGVQbGFpbnRleHQgPSBCeXRlcy5mcm9tQmluYXJ5KGl0ZW0uZW52ZWxvcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIucXVldWVDYWNoZWQ6IGl0ZW0uZW52ZWxvcGUgd2FzIG1hbGZvcm1lZCdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVjb2RlZCA9IFByb3RvLkVudmVsb3BlLmRlY29kZShlbnZlbG9wZVBsYWludGV4dCk7XG5cbiAgICAgIGNvbnN0IG91clV1aWQgPSB0aGlzLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgICBjb25zdCBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUgPSB7XG4gICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICByZWNlaXZlZEF0Q291bnRlcjogaXRlbS5yZWNlaXZlZEF0Q291bnRlciA/PyBpdGVtLnRpbWVzdGFtcCxcbiAgICAgICAgcmVjZWl2ZWRBdERhdGU6XG4gICAgICAgICAgaXRlbS5yZWNlaXZlZEF0Q291bnRlciA9PT0gbnVsbCA/IERhdGUubm93KCkgOiBpdGVtLnRpbWVzdGFtcCxcbiAgICAgICAgbWVzc2FnZUFnZVNlYzogaXRlbS5tZXNzYWdlQWdlU2VjIHx8IDAsXG5cbiAgICAgICAgLy8gUHJvdG8uRW52ZWxvcGUgZmllbGRzXG4gICAgICAgIHR5cGU6IGRlY29kZWQudHlwZSxcbiAgICAgICAgc291cmNlOiBpdGVtLnNvdXJjZSxcbiAgICAgICAgc291cmNlVXVpZDogZGVjb2RlZC5zb3VyY2VVdWlkXG4gICAgICAgICAgPyBVVUlELmNhc3QoZGVjb2RlZC5zb3VyY2VVdWlkKVxuICAgICAgICAgIDogaXRlbS5zb3VyY2VVdWlkLFxuICAgICAgICBzb3VyY2VEZXZpY2U6IGRlY29kZWQuc291cmNlRGV2aWNlIHx8IGl0ZW0uc291cmNlRGV2aWNlLFxuICAgICAgICBkZXN0aW5hdGlvblV1aWQ6IG5ldyBVVUlEKFxuICAgICAgICAgIGRlY29kZWQuZGVzdGluYXRpb25VdWlkIHx8IGl0ZW0uZGVzdGluYXRpb25VdWlkIHx8IG91clV1aWQudG9TdHJpbmcoKVxuICAgICAgICApLFxuICAgICAgICB1cGRhdGVkUG5pOiBkZWNvZGVkLnVwZGF0ZWRQbmlcbiAgICAgICAgICA/IG5ldyBVVUlEKGRlY29kZWQudXBkYXRlZFBuaSlcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGltZXN0YW1wOiBkZWNvZGVkLnRpbWVzdGFtcD8udG9OdW1iZXIoKSxcbiAgICAgICAgY29udGVudDogZHJvcE51bGwoZGVjb2RlZC5jb250ZW50KSxcbiAgICAgICAgc2VydmVyR3VpZDogZGVjb2RlZC5zZXJ2ZXJHdWlkLFxuICAgICAgICBzZXJ2ZXJUaW1lc3RhbXA6XG4gICAgICAgICAgaXRlbS5zZXJ2ZXJUaW1lc3RhbXAgfHwgZGVjb2RlZC5zZXJ2ZXJUaW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gICAgICAgIHVyZ2VudDogaXNCb29sZWFuKGl0ZW0udXJnZW50KSA/IGl0ZW0udXJnZW50IDogdHJ1ZSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHsgZGVjcnlwdGVkIH0gPSBpdGVtO1xuICAgICAgaWYgKGRlY3J5cHRlZCkge1xuICAgICAgICBsZXQgcGF5bG9hZFBsYWludGV4dDogVWludDhBcnJheTtcblxuICAgICAgICBpZiAoaXRlbS52ZXJzaW9uID09PSAyKSB7XG4gICAgICAgICAgcGF5bG9hZFBsYWludGV4dCA9IEJ5dGVzLmZyb21CYXNlNjQoZGVjcnlwdGVkKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGVjcnlwdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHBheWxvYWRQbGFpbnRleHQgPSBCeXRlcy5mcm9tQmluYXJ5KGRlY3J5cHRlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYWNoZWQgZGVjcnlwdGVkIHZhbHVlIHdhcyBub3QgYSBzdHJpbmchJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWludGFpbiBpbnZhcmlhbnQ6IGVuY3J5cHRlZCBxdWV1ZSA9PiBkZWNyeXB0ZWQgcXVldWVcbiAgICAgICAgdGhpcy5hZGRUb1F1ZXVlKFxuICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucXVldWVEZWNyeXB0ZWRFbnZlbG9wZShlbnZlbG9wZSwgcGF5bG9hZFBsYWludGV4dCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAncXVldWVEZWNyeXB0ZWRFbnZlbG9wZScsXG4gICAgICAgICAgVGFza1R5cGUuRW5jcnlwdGVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXVlQ2FjaGVkRW52ZWxvcGUoaXRlbSwgZW52ZWxvcGUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdxdWV1ZUNhY2hlZCBlcnJvciBoYW5kbGluZyBpdGVtJyxcbiAgICAgICAgaXRlbS5pZCxcbiAgICAgICAgJ3JlbW92aW5nIGl0LiBFcnJvcjonLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGlkIH0gPSBpdGVtO1xuICAgICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UucHJvdG9jb2wucmVtb3ZlVW5wcm9jZXNzZWQoaWQpO1xuICAgICAgfSBjYXRjaCAoZGVsZXRlRXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdxdWV1ZUNhY2hlZCBlcnJvciBkZWxldGluZyBpdGVtJyxcbiAgICAgICAgICBpdGVtLmlkLFxuICAgICAgICAgICdFcnJvcjonLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChkZWxldGVFcnJvcilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFyUmV0cnlUaW1lb3V0KCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRoaXMucmV0cnlDYWNoZWRUaW1lb3V0KTtcbiAgICB0aGlzLnJldHJ5Q2FjaGVkVGltZW91dCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgbWF5YmVTY2hlZHVsZVJldHJ5VGltZW91dCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0VtcHRpZWQpIHtcbiAgICAgIHRoaXMuY2xlYXJSZXRyeVRpbWVvdXQoKTtcbiAgICAgIHRoaXMucmV0cnlDYWNoZWRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5jb21pbmdRdWV1ZS5hZGQoXG4gICAgICAgICAgY3JlYXRlVGFza1dpdGhUaW1lb3V0KFxuICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5xdWV1ZUFsbENhY2hlZCgpLFxuICAgICAgICAgICAgJ3F1ZXVlQWxsQ2FjaGVkJ1xuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0sIFJFVFJZX1RJTUVPVVQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0QWxsRnJvbUNhY2hlKCk6IFByb21pc2U8QXJyYXk8VW5wcm9jZXNzZWRUeXBlPj4ge1xuICAgIGxvZy5pbmZvKCdnZXRBbGxGcm9tQ2FjaGUnKTtcbiAgICBjb25zdCBjb3VudCA9IGF3YWl0IHRoaXMuc3RvcmFnZS5wcm90b2NvbC5nZXRVbnByb2Nlc3NlZENvdW50KCk7XG5cbiAgICBpZiAoY291bnQgPiAxNTAwKSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UucHJvdG9jb2wucmVtb3ZlQWxsVW5wcm9jZXNzZWQoKTtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgVGhlcmUgd2VyZSAke2NvdW50fSBtZXNzYWdlcyBpbiBjYWNoZS4gRGVsZXRlZCBhbGwgaW5zdGVhZCBvZiByZXByb2Nlc3NpbmdgXG4gICAgICApO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID1cbiAgICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wcm90b2NvbC5nZXRBbGxVbnByb2Nlc3NlZEFuZEluY3JlbWVudEF0dGVtcHRzKCk7XG4gICAgbG9nLmluZm8oJ2dldEFsbEZyb21DYWNoZSBsb2FkZWQnLCBpdGVtcy5sZW5ndGgsICdzYXZlZCBlbnZlbG9wZXMnKTtcblxuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVjcnlwdEFuZENhY2hlQmF0Y2goXG4gICAgaXRlbXM6IEFycmF5PENhY2hlQWRkSXRlbVR5cGU+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdEFuZENhY2hlQmF0Y2gnLCBpdGVtcy5sZW5ndGgpO1xuXG4gICAgY29uc3QgZGVjcnlwdGVkOiBBcnJheTxcbiAgICAgIFJlYWRvbmx5PHtcbiAgICAgICAgcGxhaW50ZXh0OiBVaW50OEFycmF5O1xuICAgICAgICBkYXRhOiBVbnByb2Nlc3NlZFR5cGU7XG4gICAgICAgIGVudmVsb3BlOiBVbnNlYWxlZEVudmVsb3BlO1xuICAgICAgfT5cbiAgICA+ID0gW107XG5cbiAgICBjb25zdCBzdG9yYWdlUHJvdG9jb2wgPSB0aGlzLnN0b3JhZ2UucHJvdG9jb2w7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgem9uZSA9IG5ldyBab25lKCdkZWNyeXB0QW5kQ2FjaGVCYXRjaCcsIHtcbiAgICAgICAgcGVuZGluZ1NlbmRlcktleXM6IHRydWUsXG4gICAgICAgIHBlbmRpbmdTZXNzaW9uczogdHJ1ZSxcbiAgICAgICAgcGVuZGluZ1VucHJvY2Vzc2VkOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0b3Jlc01hcCA9IG5ldyBNYXA8VVVJRFN0cmluZ1R5cGUsIExvY2tlZFN0b3Jlcz4oKTtcbiAgICAgIGNvbnN0IGZhaWxlZDogQXJyYXk8VW5wcm9jZXNzZWRUeXBlPiA9IFtdO1xuXG4gICAgICAvLyBCZWxvdyB3ZTpcbiAgICAgIC8vXG4gICAgICAvLyAxLiBFbnRlciB6b25lXG4gICAgICAvLyAyLiBEZWNyeXB0IGFsbCBiYXRjaGVkIGVudmVsb3Blc1xuICAgICAgLy8gMy4gUGVyc2lzdCBib3RoIGRlY3J5cHRlZCBlbnZlbG9wZXMgYW5kIGVudmVsb3BlcyB0aGF0IHdlIGZhaWxlZCB0b1xuICAgICAgLy8gICAgZGVjcnlwdCAoZm9yIGZ1dHVyZSByZXRyaWVzLCBzZWUgYGF0dGVtcHRzYCBmaWVsZClcbiAgICAgIC8vIDQuIExlYXZlIHpvbmUgYW5kIGNvbW1pdCBhbGwgcGVuZGluZyBzZXNzaW9ucyBhbmQgdW5wcm9jZXNzZWRzXG4gICAgICAvLyA1LiBBY2tub3dsZWRnZSBlbnZlbG9wZXMgKGNhbid0IGZhaWwpXG4gICAgICAvLyA2LiBGaW5hbGx5IHByb2Nlc3MgZGVjcnlwdGVkIGVudmVsb3Blc1xuICAgICAgYXdhaXQgc3RvcmFnZVByb3RvY29sLndpdGhab25lKHpvbmUsICdNZXNzYWdlUmVjZWl2ZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsPHZvaWQ+KFxuICAgICAgICAgIGl0ZW1zLm1hcChhc3luYyAoeyBkYXRhLCBlbnZlbG9wZSB9KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCB7IGRlc3RpbmF0aW9uVXVpZCB9ID0gZW52ZWxvcGU7XG5cbiAgICAgICAgICAgICAgbGV0IHN0b3JlcyA9IHN0b3Jlc01hcC5nZXQoZGVzdGluYXRpb25VdWlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICBpZiAoIXN0b3Jlcykge1xuICAgICAgICAgICAgICAgIHN0b3JlcyA9IHtcbiAgICAgICAgICAgICAgICAgIHNlbmRlcktleVN0b3JlOiBuZXcgU2VuZGVyS2V5cyh7XG4gICAgICAgICAgICAgICAgICAgIG91clV1aWQ6IGRlc3RpbmF0aW9uVXVpZCxcbiAgICAgICAgICAgICAgICAgICAgem9uZSxcbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JlOiBuZXcgU2Vzc2lvbnMoe1xuICAgICAgICAgICAgICAgICAgICB6b25lLFxuICAgICAgICAgICAgICAgICAgICBvdXJVdWlkOiBkZXN0aW5hdGlvblV1aWQsXG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIGlkZW50aXR5S2V5U3RvcmU6IG5ldyBJZGVudGl0eUtleXMoe1xuICAgICAgICAgICAgICAgICAgICB6b25lLFxuICAgICAgICAgICAgICAgICAgICBvdXJVdWlkOiBkZXN0aW5hdGlvblV1aWQsXG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIHpvbmUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzdG9yZXNNYXAuc2V0KGRlc3RpbmF0aW9uVXVpZC50b1N0cmluZygpLCBzdG9yZXMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5xdWV1ZUVuY3J5cHRlZEVudmVsb3BlKFxuICAgICAgICAgICAgICAgIHN0b3JlcyxcbiAgICAgICAgICAgICAgICBlbnZlbG9wZVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LnBsYWludGV4dCkge1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIHBsYWludGV4dDogcmVzdWx0LnBsYWludGV4dCxcbiAgICAgICAgICAgICAgICAgIGVudmVsb3BlOiByZXN1bHQuZW52ZWxvcGUsXG4gICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBmYWlsZWQucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdEFuZENhY2hlQmF0Y2ggZXJyb3Igd2hlbiAnICtcbiAgICAgICAgICAgICAgICAgICdwcm9jZXNzaW5nIHRoZSBlbnZlbG9wZScsXG4gICAgICAgICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5kZWNyeXB0QW5kQ2FjaGVCYXRjaCBzdG9yaW5nICcgK1xuICAgICAgICAgICAgYCR7ZGVjcnlwdGVkLmxlbmd0aH0gZGVjcnlwdGVkIGVudmVsb3Blcywga2VlcGluZyBgICtcbiAgICAgICAgICAgIGAke2ZhaWxlZC5sZW5ndGh9IGZhaWxlZCBlbnZlbG9wZXMuYFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFN0b3JlIGJvdGggZGVjcnlwdGVkIGFuZCBmYWlsZWQgdW5wcm9jZXNzZWQgZW52ZWxvcGVzXG4gICAgICAgIGNvbnN0IHVucHJvY2Vzc2VkczogQXJyYXk8VW5wcm9jZXNzZWRUeXBlPiA9IGRlY3J5cHRlZC5tYXAoXG4gICAgICAgICAgKHsgZW52ZWxvcGUsIGRhdGEsIHBsYWludGV4dCB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5kYXRhLFxuXG4gICAgICAgICAgICAgIHNvdXJjZTogZW52ZWxvcGUuc291cmNlLFxuICAgICAgICAgICAgICBzb3VyY2VVdWlkOiBlbnZlbG9wZS5zb3VyY2VVdWlkLFxuICAgICAgICAgICAgICBzb3VyY2VEZXZpY2U6IGVudmVsb3BlLnNvdXJjZURldmljZSxcbiAgICAgICAgICAgICAgZGVzdGluYXRpb25VdWlkOiBlbnZlbG9wZS5kZXN0aW5hdGlvblV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdXBkYXRlZFBuaTogZW52ZWxvcGUudXBkYXRlZFBuaT8udG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgc2VydmVyR3VpZDogZW52ZWxvcGUuc2VydmVyR3VpZCxcbiAgICAgICAgICAgICAgc2VydmVyVGltZXN0YW1wOiBlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgICAgICAgIGRlY3J5cHRlZDogQnl0ZXMudG9CYXNlNjQocGxhaW50ZXh0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGF3YWl0IHN0b3JhZ2VQcm90b2NvbC5hZGRNdWx0aXBsZVVucHJvY2Vzc2VkKFxuICAgICAgICAgIHVucHJvY2Vzc2Vkcy5jb25jYXQoZmFpbGVkKSxcbiAgICAgICAgICB7IHpvbmUgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdEFuZENhY2hlQmF0Y2ggYWNrbm93bGVkZ2luZyByZWNlaXB0Jyk7XG5cbiAgICAgIC8vIEFja25vd2xlZGdlIGFsbCBlbnZlbG9wZXNcbiAgICAgIGZvciAoY29uc3QgeyByZXF1ZXN0IH0gb2YgaXRlbXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXF1ZXN0LnJlc3BvbmQoMjAwLCAnT0snKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnZGVjcnlwdEFuZENhY2hlQmF0Y2g6IEZhaWxlZCB0byBzZW5kIDIwMCB0byBzZXJ2ZXI7IHN0aWxsIHF1ZXVpbmcgZW52ZWxvcGUnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdkZWNyeXB0QW5kQ2FjaGUgZXJyb3IgdHJ5aW5nIHRvIGFkZCBtZXNzYWdlcyB0byBjYWNoZTonLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuXG4gICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLnJlcXVlc3QucmVzcG9uZCg1MDAsICdGYWlsZWQgdG8gY2FjaGUgbWVzc2FnZScpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBkZWNyeXB0ZWQubWFwKGFzeW5jICh7IGVudmVsb3BlLCBwbGFpbnRleHQgfSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMucXVldWVEZWNyeXB0ZWRFbnZlbG9wZShlbnZlbG9wZSwgcGxhaW50ZXh0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnZGVjcnlwdEFuZENhY2hlIGVycm9yIHdoZW4gcHJvY2Vzc2luZyBkZWNyeXB0ZWQgZW52ZWxvcGUnLFxuICAgICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdEFuZENhY2hlQmF0Y2ggZnVsbHkgcHJvY2Vzc2VkJyk7XG5cbiAgICB0aGlzLm1heWJlU2NoZWR1bGVSZXRyeVRpbWVvdXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjcnlwdEFuZENhY2hlKFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICBwbGFpbnRleHQ6IFVpbnQ4QXJyYXksXG4gICAgcmVxdWVzdDogSW5jb21pbmdXZWJTb2NrZXRSZXF1ZXN0XG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHsgaWQgfSA9IGVudmVsb3BlO1xuICAgIGNvbnN0IGRhdGE6IFVucHJvY2Vzc2VkVHlwZSA9IHtcbiAgICAgIGlkLFxuICAgICAgdmVyc2lvbjogMixcblxuICAgICAgYXR0ZW1wdHM6IDEsXG4gICAgICBlbnZlbG9wZTogQnl0ZXMudG9CYXNlNjQocGxhaW50ZXh0KSxcbiAgICAgIG1lc3NhZ2VBZ2VTZWM6IGVudmVsb3BlLm1lc3NhZ2VBZ2VTZWMsXG4gICAgICByZWNlaXZlZEF0Q291bnRlcjogZW52ZWxvcGUucmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICB0aW1lc3RhbXA6IGVudmVsb3BlLnRpbWVzdGFtcCxcbiAgICAgIHVyZ2VudDogZW52ZWxvcGUudXJnZW50LFxuICAgIH07XG4gICAgdGhpcy5kZWNyeXB0QW5kQ2FjaGVCYXRjaGVyLmFkZCh7XG4gICAgICByZXF1ZXN0LFxuICAgICAgZW52ZWxvcGUsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjYWNoZVJlbW92ZUJhdGNoKGl0ZW1zOiBBcnJheTxzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zdG9yYWdlLnByb3RvY29sLnJlbW92ZVVucHJvY2Vzc2VkKGl0ZW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSk6IHZvaWQge1xuICAgIGNvbnN0IHsgaWQgfSA9IGVudmVsb3BlO1xuICAgIHRoaXMuY2FjaGVSZW1vdmVCYXRjaGVyLmFkZChpZCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHF1ZXVlRGVjcnlwdGVkRW52ZWxvcGUoXG4gICAgZW52ZWxvcGU6IFVuc2VhbGVkRW52ZWxvcGUsXG4gICAgcGxhaW50ZXh0OiBVaW50OEFycmF5XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlkID0gZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSk7XG4gICAgbG9nLmluZm8oJ3F1ZXVlaW5nIGRlY3J5cHRlZCBlbnZlbG9wZScsIGlkKTtcblxuICAgIGNvbnN0IHRhc2sgPSB0aGlzLmhhbmRsZURlY3J5cHRlZEVudmVsb3BlLmJpbmQodGhpcywgZW52ZWxvcGUsIHBsYWludGV4dCk7XG4gICAgY29uc3QgdGFza1dpdGhUaW1lb3V0ID0gY3JlYXRlVGFza1dpdGhUaW1lb3V0KFxuICAgICAgdGFzayxcbiAgICAgIGBxdWV1ZURlY3J5cHRlZEVudmVsb3BlICR7aWR9YFxuICAgICk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hZGRUb1F1ZXVlKFxuICAgICAgICB0YXNrV2l0aFRpbWVvdXQsXG4gICAgICAgICdkaXNwYXRjaEV2ZW50JyxcbiAgICAgICAgVGFza1R5cGUuRGVjcnlwdGVkXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgIGBxdWV1ZURlY3J5cHRlZEVudmVsb3BlIGVycm9yIGhhbmRsaW5nIGVudmVsb3BlICR7aWR9OmAsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBxdWV1ZUVuY3J5cHRlZEVudmVsb3BlKFxuICAgIHN0b3JlczogTG9ja2VkU3RvcmVzLFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZVxuICApOiBQcm9taXNlPERlY3J5cHRSZXN1bHQ+IHtcbiAgICBsZXQgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cuaW5mbygncXVldWVpbmcgZW52ZWxvcGUnLCBsb2dJZCk7XG5cbiAgICBjb25zdCB0YXNrID0gYXN5bmMgKCk6IFByb21pc2U8RGVjcnlwdFJlc3VsdD4gPT4ge1xuICAgICAgY29uc3QgeyBkZXN0aW5hdGlvblV1aWQgfSA9IGVudmVsb3BlO1xuICAgICAgY29uc3QgdXVpZEtpbmQgPSB0aGlzLnN0b3JhZ2UudXNlci5nZXRPdXJVdWlkS2luZChkZXN0aW5hdGlvblV1aWQpO1xuICAgICAgaWYgKHV1aWRLaW5kID09PSBVVUlES2luZC5Vbmtub3duKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdEFuZENhY2hlQmF0Y2g6ICcgK1xuICAgICAgICAgICAgYFJlamVjdGluZyBlbnZlbG9wZSAke2dldEVudmVsb3BlSWQoZW52ZWxvcGUpfSwgYCArXG4gICAgICAgICAgICBgdW5rbm93biB1dWlkOiAke2Rlc3RpbmF0aW9uVXVpZH1gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IHBsYWludGV4dDogdW5kZWZpbmVkLCBlbnZlbG9wZSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1bnNlYWxlZEVudmVsb3BlID0gYXdhaXQgdGhpcy51bnNlYWxFbnZlbG9wZShcbiAgICAgICAgc3RvcmVzLFxuICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgdXVpZEtpbmRcbiAgICAgICk7XG5cbiAgICAgIC8vIERyb3BwZWQgZWFybHlcbiAgICAgIGlmICghdW5zZWFsZWRFbnZlbG9wZSkge1xuICAgICAgICByZXR1cm4geyBwbGFpbnRleHQ6IHVuZGVmaW5lZCwgZW52ZWxvcGUgfTtcbiAgICAgIH1cblxuICAgICAgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKHVuc2VhbGVkRW52ZWxvcGUpO1xuXG4gICAgICB0aGlzLmFkZFRvUXVldWUoXG4gICAgICAgIGFzeW5jICgpID0+IHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRW52ZWxvcGVFdmVudCh1bnNlYWxlZEVudmVsb3BlKSksXG4gICAgICAgICdkaXNwYXRjaEV2ZW50JyxcbiAgICAgICAgVGFza1R5cGUuRGVjcnlwdGVkXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdGhpcy5kZWNyeXB0RW52ZWxvcGUoc3RvcmVzLCB1bnNlYWxlZEVudmVsb3BlLCB1dWlkS2luZCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5hZGRUb1F1ZXVlKFxuICAgICAgICB0YXNrLFxuICAgICAgICBgTWVzc2FnZVJlY2VpdmVyOiB1bnNlYWwgYW5kIGRlY3J5cHQgJHtsb2dJZH1gLFxuICAgICAgICBUYXNrVHlwZS5FbmNyeXB0ZWRcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAgICdxdWV1ZUVuY3J5cHRlZEVudmVsb3BlIGVycm9yIGhhbmRsaW5nIGVudmVsb3BlJyxcbiAgICAgICAgbG9nSWQsXG4gICAgICAgICc6JyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKSxcbiAgICAgIF07XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBXYXJuT25seUVycm9yKSB7XG4gICAgICAgIGxvZy53YXJuKC4uLmFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLmVycm9yKC4uLmFyZ3MpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBxdWV1ZUNhY2hlZEVudmVsb3BlKFxuICAgIGRhdGE6IFVucHJvY2Vzc2VkVHlwZSxcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGVcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5kZWNyeXB0QW5kQ2FjaGVCYXRjaGVyLmFkZCh7XG4gICAgICByZXF1ZXN0OiB7XG4gICAgICAgIHJlc3BvbmQoY29kZSwgc3RhdHVzKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAncXVldWVDYWNoZWRFbnZlbG9wZTogZmFrZSByZXNwb25zZSAnICtcbiAgICAgICAgICAgICAgYHdpdGggY29kZSAke2NvZGV9IGFuZCBzdGF0dXMgJHtzdGF0dXN9YFxuICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZW52ZWxvcGUsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGBkZWNyeXB0RW52ZWxvcGVgIGRlY3J5cHRlZCB0aGUgbWVzc2FnZS5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVEZWNyeXB0ZWRFbnZlbG9wZShcbiAgICBlbnZlbG9wZTogVW5zZWFsZWRFbnZlbG9wZSxcbiAgICBwbGFpbnRleHQ6IFVpbnQ4QXJyYXlcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc3RvcHBpbmdQcm9jZXNzaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVudmVsb3BlLmNvbnRlbnQpIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5uZXJIYW5kbGVDb250ZW50TWVzc2FnZShlbnZlbG9wZSwgcGxhaW50ZXh0KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY2VpdmVkIG1lc3NhZ2Ugd2l0aCBubyBjb250ZW50Jyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVuc2VhbEVudmVsb3BlKFxuICAgIHN0b3JlczogTG9ja2VkU3RvcmVzLFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICB1dWlkS2luZDogVVVJREtpbmRcbiAgKTogUHJvbWlzZTxVbnNlYWxlZEVudmVsb3BlIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcblxuICAgIGlmICh0aGlzLnN0b3BwaW5nUHJvY2Vzc2luZykge1xuICAgICAgbG9nLndhcm4oYE1lc3NhZ2VSZWNlaXZlci51bnNlYWxFbnZlbG9wZSgke2xvZ0lkfSk6IGRyb3BwaW5nYCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlYWxlZCBlbnZlbG9wZSBkcm9wcGVkIGR1ZSB0byBzdG9wcGluZyBwcm9jZXNzaW5nJyk7XG4gICAgfVxuXG4gICAgaWYgKGVudmVsb3BlLnR5cGUgIT09IFByb3RvLkVudmVsb3BlLlR5cGUuVU5JREVOVElGSUVEX1NFTkRFUikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZW52ZWxvcGUsXG4gICAgICAgIGNpcGhlclRleHRCeXRlczogZW52ZWxvcGUuY29udGVudCxcbiAgICAgICAgY2lwaGVyVGV4dFR5cGU6IGVudmVsb3BlVHlwZVRvQ2lwaGVydGV4dFR5cGUoZW52ZWxvcGUudHlwZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh1dWlkS2luZCA9PT0gVVVJREtpbmQuUE5JKSB7XG4gICAgICBsb2cud2FybihgTWVzc2FnZVJlY2VpdmVyLnVuc2VhbEVudmVsb3BlKCR7bG9nSWR9KTogZHJvcHBpbmcgZm9yIFBOSWApO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBzdHJpY3RBc3NlcnQodXVpZEtpbmQgPT09IFVVSURLaW5kLkFDSSwgJ1NlYWxlZCBub24tQUNJIGVudmVsb3BlJyk7XG5cbiAgICBjb25zdCBjaXBoZXJ0ZXh0ID0gZW52ZWxvcGUuY29udGVudDtcbiAgICBpZiAoIWNpcGhlcnRleHQpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVjZWl2ZWQgbWVzc2FnZSB3aXRoIG5vIGNvbnRlbnQnKTtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhgTWVzc2FnZVJlY2VpdmVyLnVuc2VhbEVudmVsb3BlKCR7bG9nSWR9KTogdW5pZGVudGlmaWVkIG1lc3NhZ2VgKTtcbiAgICBjb25zdCBtZXNzYWdlQ29udGVudCA9IGF3YWl0IHNlYWxlZFNlbmRlckRlY3J5cHRUb1VzbWMoXG4gICAgICBCdWZmZXIuZnJvbShjaXBoZXJ0ZXh0KSxcbiAgICAgIHN0b3Jlcy5pZGVudGl0eUtleVN0b3JlXG4gICAgKTtcblxuICAgIC8vIEhlcmUgd2UgdGFrZSB0aGlzIHNlbmRlciBpbmZvcm1hdGlvbiBhbmQgYXR0YWNoIGl0IGJhY2sgdG8gdGhlIGVudmVsb3BlXG4gICAgLy8gICB0byBtYWtlIHRoZSByZXN0IG9mIHRoZSBhcHAgd29yayBwcm9wZXJseS5cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG1lc3NhZ2VDb250ZW50LnNlbmRlckNlcnRpZmljYXRlKCk7XG5cbiAgICBjb25zdCBvcmlnaW5hbFNvdXJjZSA9IGVudmVsb3BlLnNvdXJjZTtcbiAgICBjb25zdCBvcmlnaW5hbFNvdXJjZVV1aWQgPSBlbnZlbG9wZS5zb3VyY2VVdWlkO1xuXG4gICAgY29uc3QgbmV3RW52ZWxvcGU6IFVuc2VhbGVkRW52ZWxvcGUgPSB7XG4gICAgICAuLi5lbnZlbG9wZSxcblxuICAgICAgY2lwaGVyVGV4dEJ5dGVzOiBtZXNzYWdlQ29udGVudC5jb250ZW50cygpLFxuICAgICAgY2lwaGVyVGV4dFR5cGU6IG1lc3NhZ2VDb250ZW50Lm1zZ1R5cGUoKSxcblxuICAgICAgLy8gT3ZlcndyaXRlIEVudmVsb3BlIGZpZWxkc1xuICAgICAgc291cmNlOiBkcm9wTnVsbChjZXJ0aWZpY2F0ZS5zZW5kZXJFMTY0KCkpLFxuICAgICAgc291cmNlVXVpZDogbm9ybWFsaXplVXVpZChcbiAgICAgICAgY2VydGlmaWNhdGUuc2VuZGVyVXVpZCgpLFxuICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLnVuc2VhbEVudmVsb3BlLlVOSURFTlRJRklFRF9TRU5ERVIuc291cmNlVXVpZCdcbiAgICAgICksXG4gICAgICBzb3VyY2VEZXZpY2U6IGNlcnRpZmljYXRlLnNlbmRlckRldmljZUlkKCksXG5cbiAgICAgIC8vIFVuc2VhbGVkRW52ZWxvcGUtb25seSBmaWVsZHNcbiAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJ5UmVjZWl2ZWQ6ICEob3JpZ2luYWxTb3VyY2UgfHwgb3JpZ2luYWxTb3VyY2VVdWlkKSxcbiAgICAgIGNvbnRlbnRIaW50OiBtZXNzYWdlQ29udGVudC5jb250ZW50SGludCgpLFxuICAgICAgZ3JvdXBJZDogbWVzc2FnZUNvbnRlbnQuZ3JvdXBJZCgpPy50b1N0cmluZygnYmFzZTY0JyksXG4gICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIHVuc2VhbGVkQ29udGVudDogbWVzc2FnZUNvbnRlbnQsXG4gICAgfTtcblxuICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBpZiB0aGVyZSdzIGEgcHJvYmxlbVxuICAgIHRoaXMudmFsaWRhdGVVbnNlYWxlZEVudmVsb3BlKG5ld0VudmVsb3BlKTtcblxuICAgIHJldHVybiBuZXdFbnZlbG9wZTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVjcnlwdEVudmVsb3BlKFxuICAgIHN0b3JlczogTG9ja2VkU3RvcmVzLFxuICAgIGVudmVsb3BlOiBVbnNlYWxlZEVudmVsb3BlLFxuICAgIHV1aWRLaW5kOiBVVUlES2luZFxuICApOiBQcm9taXNlPERlY3J5cHRSZXN1bHQ+IHtcbiAgICBjb25zdCBsb2dJZCA9IGdldEVudmVsb3BlSWQoZW52ZWxvcGUpO1xuXG4gICAgaWYgKHRoaXMuc3RvcHBpbmdQcm9jZXNzaW5nKSB7XG4gICAgICBsb2cud2FybihgTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHRFbnZlbG9wZSgke2xvZ0lkfSk6IGRyb3BwaW5nIHVuc2VhbGVkYCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc2VhbGVkIGVudmVsb3BlIGRyb3BwZWQgZHVlIHRvIHN0b3BwaW5nIHByb2Nlc3NpbmcnKTtcbiAgICB9XG5cbiAgICBpZiAoZW52ZWxvcGUudHlwZSA9PT0gUHJvdG8uRW52ZWxvcGUuVHlwZS5SRUNFSVBUKSB7XG4gICAgICBhd2FpdCB0aGlzLm9uRGVsaXZlcnlSZWNlaXB0KGVudmVsb3BlKTtcbiAgICAgIHJldHVybiB7IHBsYWludGV4dDogdW5kZWZpbmVkLCBlbnZlbG9wZSB9O1xuICAgIH1cblxuICAgIGxldCBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5O1xuICAgIGlmIChlbnZlbG9wZS5jb250ZW50KSB7XG4gICAgICBjaXBoZXJ0ZXh0ID0gZW52ZWxvcGUuY29udGVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgJ0NvbnRlbnRsZXNzIGVudmVsb3BlIHNob3VsZCBiZSBoYW5kbGVkIGJ5IHVuc2VhbEVudmVsb3BlJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBsb2cuaW5mbyhgTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHRFbnZlbG9wZSgke2xvZ0lkfSlgKTtcbiAgICBjb25zdCBwbGFpbnRleHQgPSBhd2FpdCB0aGlzLmRlY3J5cHQoXG4gICAgICBzdG9yZXMsXG4gICAgICBlbnZlbG9wZSxcbiAgICAgIGNpcGhlcnRleHQsXG4gICAgICB1dWlkS2luZFxuICAgICk7XG5cbiAgICBpZiAoIXBsYWludGV4dCkge1xuICAgICAgbG9nLndhcm4oJ01lc3NhZ2VSZWNlaXZlci5kZWNyeXB0RW52ZWxvcGU6IHBsYWludGV4dCB3YXMgZmFsc2V5Jyk7XG4gICAgICByZXR1cm4geyBwbGFpbnRleHQsIGVudmVsb3BlIH07XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgbmVlZCB0byBwcm9jZXNzIHRoaXMgYXMgcGFydCBvZiBkZWNyeXB0aW9uLCBiZWNhdXNlIHdlIG1pZ2h0IG5lZWQgdGhpc1xuICAgIC8vICAgc2VuZGVyIGtleSB0byBkZWNyeXB0IHRoZSBuZXh0IG1lc3NhZ2UgaW4gdGhlIHF1ZXVlIVxuICAgIGxldCBpc0dyb3VwVjIgPSBmYWxzZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gUHJvdG8uQ29udGVudC5kZWNvZGUocGxhaW50ZXh0KTtcblxuICAgICAgaXNHcm91cFYyID0gQm9vbGVhbihjb250ZW50LmRhdGFNZXNzYWdlPy5ncm91cFYyKTtcblxuICAgICAgaWYgKFxuICAgICAgICBjb250ZW50LnNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UgJiZcbiAgICAgICAgQnl0ZXMuaXNOb3RFbXB0eShjb250ZW50LnNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UpXG4gICAgICApIHtcbiAgICAgICAgYXdhaXQgdGhpcy5oYW5kbGVTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKFxuICAgICAgICAgIHN0b3JlcyxcbiAgICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgICBjb250ZW50LnNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2VcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gU29tZSBzeW5jIG1lc3NhZ2VzIGhhdmUgdG8gYmUgZnVsbHkgcHJvY2Vzc2VkIGluIHRoZSBtaWRkbGUgb2ZcbiAgICAgIC8vIGRlY3J5cHRpb24gcXVldWUgc2luY2Ugc3Vic2VxdWVudCBlbnZlbG9wZXMgdXNlIHRoZWlyIGtleSBtYXRlcmlhbC5cbiAgICAgIGNvbnN0IHsgc3luY01lc3NhZ2UgfSA9IGNvbnRlbnQ7XG4gICAgICBpZiAoc3luY01lc3NhZ2U/LnBuaUlkZW50aXR5KSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlUE5JSWRlbnRpdHkoZW52ZWxvcGUsIHN5bmNNZXNzYWdlLnBuaUlkZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIHsgcGxhaW50ZXh0OiB1bmRlZmluZWQsIGVudmVsb3BlIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzeW5jTWVzc2FnZT8ucG5pQ2hhbmdlTnVtYmVyKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlUE5JQ2hhbmdlTnVtYmVyKGVudmVsb3BlLCBzeW5jTWVzc2FnZS5wbmlDaGFuZ2VOdW1iZXIpO1xuICAgICAgICByZXR1cm4geyBwbGFpbnRleHQ6IHVuZGVmaW5lZCwgZW52ZWxvcGUgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHRFbnZlbG9wZTogRmFpbGVkIHRvIHByb2Nlc3Mgc2VuZGVyICcgK1xuICAgICAgICAgIGBrZXkgZGlzdHJpYnV0aW9uIG1lc3NhZ2U6ICR7RXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gcHJvY2VzcyBHcm91cFYyIHVwZGF0ZXMsIGV2ZW4gZnJvbSBibG9ja2VkIHVzZXJzLiBXZSdsbCBkcm9wIHRoZW0gbGF0ZXIuXG4gICAgaWYgKFxuICAgICAgIWlzR3JvdXBWMiAmJlxuICAgICAgKChlbnZlbG9wZS5zb3VyY2UgJiYgdGhpcy5pc0Jsb2NrZWQoZW52ZWxvcGUuc291cmNlKSkgfHxcbiAgICAgICAgKGVudmVsb3BlLnNvdXJjZVV1aWQgJiYgdGhpcy5pc1V1aWRCbG9ja2VkKGVudmVsb3BlLnNvdXJjZVV1aWQpKSlcbiAgICApIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHRFbnZlbG9wZTogRHJvcHBpbmcgbm9uLUdWMiBtZXNzYWdlIGZyb20gYmxvY2tlZCBzZW5kZXInXG4gICAgICApO1xuICAgICAgcmV0dXJuIHsgcGxhaW50ZXh0OiB1bmRlZmluZWQsIGVudmVsb3BlIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcGxhaW50ZXh0LCBlbnZlbG9wZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVVuc2VhbGVkRW52ZWxvcGUoZW52ZWxvcGU6IFVuc2VhbGVkRW52ZWxvcGUpOiB2b2lkIHtcbiAgICBjb25zdCB7IHVuc2VhbGVkQ29udGVudDogbWVzc2FnZUNvbnRlbnQsIGNlcnRpZmljYXRlIH0gPSBlbnZlbG9wZTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBtZXNzYWdlQ29udGVudCAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ01pc3NpbmcgbWVzc2FnZSBjb250ZW50IGZvciBzZWFsZWQgc2VuZGVyIG1lc3NhZ2UnXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBjZXJ0aWZpY2F0ZSAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ01pc3Npbmcgc2VuZGVyIGNlcnRpZmljYXRlIGZvciBzZWFsZWQgc2VuZGVyIG1lc3NhZ2UnXG4gICAgKTtcblxuICAgIGlmICghZW52ZWxvcGUuc2VydmVyVGltZXN0YW1wKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdFNlYWxlZFNlbmRlcjogJyArXG4gICAgICAgICAgJ1NlYWxlZCBzZW5kZXIgbWVzc2FnZSB3YXMgbWlzc2luZyBzZXJ2ZXJUaW1lc3RhbXAnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHNlcnZlckNlcnRpZmljYXRlID0gY2VydGlmaWNhdGUuc2VydmVyQ2VydGlmaWNhdGUoKTtcblxuICAgIGlmIChcbiAgICAgICF2ZXJpZnlTaWduYXR1cmUoXG4gICAgICAgIHRoaXMuc2VydmVyVHJ1c3RSb290LFxuICAgICAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZS5jZXJ0aWZpY2F0ZURhdGEoKSxcbiAgICAgICAgc2VydmVyQ2VydGlmaWNhdGUuc2lnbmF0dXJlKClcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci52YWxpZGF0ZVVuc2VhbGVkRW52ZWxvcGU6ICcgK1xuICAgICAgICAgICdTZXJ2ZXIgY2VydGlmaWNhdGUgdHJ1c3Qgcm9vdCB2YWxpZGF0aW9uIGZhaWxlZCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIXZlcmlmeVNpZ25hdHVyZShcbiAgICAgICAgc2VydmVyQ2VydGlmaWNhdGUua2V5KCkuc2VyaWFsaXplKCksXG4gICAgICAgIGNlcnRpZmljYXRlLmNlcnRpZmljYXRlKCksXG4gICAgICAgIGNlcnRpZmljYXRlLnNpZ25hdHVyZSgpXG4gICAgICApXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdNZXNzYWdlUmVjZWl2ZXIudmFsaWRhdGVVbnNlYWxlZEVudmVsb3BlOiAnICtcbiAgICAgICAgICAnU2VydmVyIGNlcnRpZmljYXRlIHNlcnZlciBzaWduYXR1cmUgdmFsaWRhdGlvbiBmYWlsZWQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ0lkID0gZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSk7XG5cbiAgICBpZiAoZW52ZWxvcGUuc2VydmVyVGltZXN0YW1wID4gY2VydGlmaWNhdGUuZXhwaXJhdGlvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdNZXNzYWdlUmVjZWl2ZXIudmFsaWRhdGVVbnNlYWxlZEVudmVsb3BlOiAnICtcbiAgICAgICAgICBgU2VuZGVyIGNlcnRpZmljYXRlIGlzIGV4cGlyZWQgZm9yIGVudmVsb3BlICR7bG9nSWR9LCBgICtcbiAgICAgICAgICBgc2VydmVyVGltZXN0YW1wOiAke2VudmVsb3BlLnNlcnZlclRpbWVzdGFtcH0sIGAgK1xuICAgICAgICAgIGBleHBpcmF0aW9uOiAke2NlcnRpZmljYXRlLmV4cGlyYXRpb24oKX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG9uRGVsaXZlcnlSZWNlaXB0KGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgJ2RlbGl2ZXJ5UmVjZWlwdCcpO1xuXG4gICAgYXdhaXQgdGhpcy5kaXNwYXRjaEFuZFdhaXQoXG4gICAgICBuZXcgRGVsaXZlcnlFdmVudChcbiAgICAgICAge1xuICAgICAgICAgIHRpbWVzdGFtcDogZW52ZWxvcGUudGltZXN0YW1wLFxuICAgICAgICAgIGVudmVsb3BlVGltZXN0YW1wOiBlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgICAgc291cmNlOiBlbnZlbG9wZS5zb3VyY2UsXG4gICAgICAgICAgc291cmNlVXVpZDogZW52ZWxvcGUuc291cmNlVXVpZCxcbiAgICAgICAgICBzb3VyY2VEZXZpY2U6IGVudmVsb3BlLnNvdXJjZURldmljZSxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnBhZChwYWRkZWRQbGFpbnRleHQ6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgICBmb3IgKGxldCBpID0gcGFkZGVkUGxhaW50ZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICBpZiAocGFkZGVkUGxhaW50ZXh0W2ldID09PSAweDgwKSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShwYWRkZWRQbGFpbnRleHQuc2xpY2UoMCwgaSkpO1xuICAgICAgfVxuICAgICAgaWYgKHBhZGRlZFBsYWludGV4dFtpXSAhPT0gMHgwMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFkZGluZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYWRkZWRQbGFpbnRleHQ7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlY3J5cHRTZWFsZWRTZW5kZXIoXG4gICAgeyBzZW5kZXJLZXlTdG9yZSwgc2Vzc2lvblN0b3JlLCBpZGVudGl0eUtleVN0b3JlLCB6b25lIH06IExvY2tlZFN0b3JlcyxcbiAgICBlbnZlbG9wZTogVW5zZWFsZWRFbnZlbG9wZSxcbiAgICBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5XG4gICk6IFByb21pc2U8RGVjcnlwdFNlYWxlZFNlbmRlclJlc3VsdD4ge1xuICAgIGNvbnN0IGxvY2FsRTE2NCA9IHRoaXMuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb25VdWlkIH0gPSBlbnZlbG9wZTtcbiAgICBjb25zdCBsb2NhbERldmljZUlkID0gcGFyc2VJbnRPclRocm93KFxuICAgICAgdGhpcy5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKSxcbiAgICAgICdNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdFNlYWxlZFNlbmRlcjogbG9jYWxEZXZpY2VJZCdcbiAgICApO1xuXG4gICAgY29uc3QgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcblxuICAgIGNvbnN0IHsgdW5zZWFsZWRDb250ZW50OiBtZXNzYWdlQ29udGVudCwgY2VydGlmaWNhdGUgfSA9IGVudmVsb3BlO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIG1lc3NhZ2VDb250ZW50ICE9PSB1bmRlZmluZWQsXG4gICAgICAnTWlzc2luZyBtZXNzYWdlIGNvbnRlbnQgZm9yIHNlYWxlZCBzZW5kZXIgbWVzc2FnZSdcbiAgICApO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGNlcnRpZmljYXRlICE9PSB1bmRlZmluZWQsXG4gICAgICAnTWlzc2luZyBzZW5kZXIgY2VydGlmaWNhdGUgZm9yIHNlYWxlZCBzZW5kZXIgbWVzc2FnZSdcbiAgICApO1xuXG4gICAgY29uc3QgdW5pZGVudGlmaWVkU2VuZGVyVHlwZUVudW0gPVxuICAgICAgUHJvdG8uVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZS5NZXNzYWdlLlR5cGU7XG5cbiAgICBpZiAoXG4gICAgICBtZXNzYWdlQ29udGVudC5tc2dUeXBlKCkgPT09IHVuaWRlbnRpZmllZFNlbmRlclR5cGVFbnVtLlBMQUlOVEVYVF9DT05URU5UXG4gICAgKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYE1lc3NhZ2VSZWNlaXZlci5kZWNyeXB0U2VhbGVkU2VuZGVyKCR7bG9nSWR9KTogYCArXG4gICAgICAgICAgJ3VuaWRlbnRpZmllZCBtZXNzYWdlL3BsYWludGV4dCBjb250ZW50cydcbiAgICAgICk7XG4gICAgICBjb25zdCBwbGFpbnRleHRDb250ZW50ID0gUGxhaW50ZXh0Q29udGVudC5kZXNlcmlhbGl6ZShcbiAgICAgICAgbWVzc2FnZUNvbnRlbnQuY29udGVudHMoKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGxhaW50ZXh0OiBwbGFpbnRleHRDb250ZW50LmJvZHkoKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbWVzc2FnZUNvbnRlbnQubXNnVHlwZSgpID09PSB1bmlkZW50aWZpZWRTZW5kZXJUeXBlRW51bS5TRU5ERVJLRVlfTUVTU0FHRVxuICAgICkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdFNlYWxlZFNlbmRlcigke2xvZ0lkfSk6IGAgK1xuICAgICAgICAgICd1bmlkZW50aWZpZWQgbWVzc2FnZS9zZW5kZXIga2V5IGNvbnRlbnRzJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IHNlYWxlZFNlbmRlcklkZW50aWZpZXIgPSBjZXJ0aWZpY2F0ZS5zZW5kZXJVdWlkKCk7XG4gICAgICBjb25zdCBzZWFsZWRTZW5kZXJTb3VyY2VEZXZpY2UgPSBjZXJ0aWZpY2F0ZS5zZW5kZXJEZXZpY2VJZCgpO1xuXG4gICAgICBjb25zdCBhZGRyZXNzID0gbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICAgIGRlc3RpbmF0aW9uVXVpZCxcbiAgICAgICAgQWRkcmVzcy5jcmVhdGUoc2VhbGVkU2VuZGVySWRlbnRpZmllciwgc2VhbGVkU2VuZGVyU291cmNlRGV2aWNlKVxuICAgICAgKTtcblxuICAgICAgY29uc3QgcGxhaW50ZXh0ID0gYXdhaXQgdGhpcy5zdG9yYWdlLnByb3RvY29sLmVucXVldWVTZW5kZXJLZXlKb2IoXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgICgpID0+XG4gICAgICAgICAgZ3JvdXBEZWNyeXB0KFxuICAgICAgICAgICAgUHJvdG9jb2xBZGRyZXNzLm5ldyhcbiAgICAgICAgICAgICAgc2VhbGVkU2VuZGVySWRlbnRpZmllcixcbiAgICAgICAgICAgICAgc2VhbGVkU2VuZGVyU291cmNlRGV2aWNlXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc2VuZGVyS2V5U3RvcmUsXG4gICAgICAgICAgICBtZXNzYWdlQ29udGVudC5jb250ZW50cygpXG4gICAgICAgICAgKSxcbiAgICAgICAgem9uZVxuICAgICAgKTtcbiAgICAgIHJldHVybiB7IHBsYWludGV4dCB9O1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYE1lc3NhZ2VSZWNlaXZlci5kZWNyeXB0U2VhbGVkU2VuZGVyKCR7bG9nSWR9KTogYCArXG4gICAgICAgICd1bmlkZW50aWZpZWQgbWVzc2FnZS9wYXNzaW5nIHRvIHNlYWxlZFNlbmRlckRlY3J5cHRNZXNzYWdlJ1xuICAgICk7XG5cbiAgICBjb25zdCBwcmVLZXlTdG9yZSA9IG5ldyBQcmVLZXlzKHsgb3VyVXVpZDogZGVzdGluYXRpb25VdWlkIH0pO1xuICAgIGNvbnN0IHNpZ25lZFByZUtleVN0b3JlID0gbmV3IFNpZ25lZFByZUtleXMoeyBvdXJVdWlkOiBkZXN0aW5hdGlvblV1aWQgfSk7XG5cbiAgICBjb25zdCBzZWFsZWRTZW5kZXJJZGVudGlmaWVyID0gZW52ZWxvcGUuc291cmNlVXVpZDtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBzZWFsZWRTZW5kZXJJZGVudGlmaWVyICE9PSB1bmRlZmluZWQsXG4gICAgICAnRW1wdHkgc2VhbGVkIHNlbmRlciBpZGVudGlmaWVyJ1xuICAgICk7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgZW52ZWxvcGUuc291cmNlRGV2aWNlICE9PSB1bmRlZmluZWQsXG4gICAgICAnRW1wdHkgc2VhbGVkIHNlbmRlciBkZXZpY2UnXG4gICAgKTtcbiAgICBjb25zdCBhZGRyZXNzID0gbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICBkZXN0aW5hdGlvblV1aWQsXG4gICAgICBBZGRyZXNzLmNyZWF0ZShzZWFsZWRTZW5kZXJJZGVudGlmaWVyLCBlbnZlbG9wZS5zb3VyY2VEZXZpY2UpXG4gICAgKTtcbiAgICBjb25zdCB1bnNlYWxlZFBsYWludGV4dCA9IGF3YWl0IHRoaXMuc3RvcmFnZS5wcm90b2NvbC5lbnF1ZXVlU2Vzc2lvbkpvYihcbiAgICAgIGFkZHJlc3MsXG4gICAgICAoKSA9PlxuICAgICAgICBzZWFsZWRTZW5kZXJEZWNyeXB0TWVzc2FnZShcbiAgICAgICAgICBCdWZmZXIuZnJvbShjaXBoZXJ0ZXh0KSxcbiAgICAgICAgICBQdWJsaWNLZXkuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20odGhpcy5zZXJ2ZXJUcnVzdFJvb3QpKSxcbiAgICAgICAgICBlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgICAgbG9jYWxFMTY0IHx8IG51bGwsXG4gICAgICAgICAgZGVzdGluYXRpb25VdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgbG9jYWxEZXZpY2VJZCxcbiAgICAgICAgICBzZXNzaW9uU3RvcmUsXG4gICAgICAgICAgaWRlbnRpdHlLZXlTdG9yZSxcbiAgICAgICAgICBwcmVLZXlTdG9yZSxcbiAgICAgICAgICBzaWduZWRQcmVLZXlTdG9yZVxuICAgICAgICApLFxuICAgICAgem9uZVxuICAgICk7XG5cbiAgICByZXR1cm4geyB1bnNlYWxlZFBsYWludGV4dCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbm5lckRlY3J5cHQoXG4gICAgc3RvcmVzOiBMb2NrZWRTdG9yZXMsXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIGNpcGhlcnRleHQ6IFVpbnQ4QXJyYXksXG4gICAgdXVpZEtpbmQ6IFVVSURLaW5kXG4gICk6IFByb21pc2U8VWludDhBcnJheSB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHsgc2Vzc2lvblN0b3JlLCBpZGVudGl0eUtleVN0b3JlLCB6b25lIH0gPSBzdG9yZXM7XG5cbiAgICBjb25zdCBsb2dJZCA9IGdldEVudmVsb3BlSWQoZW52ZWxvcGUpO1xuICAgIGNvbnN0IGVudmVsb3BlVHlwZUVudW0gPSBQcm90by5FbnZlbG9wZS5UeXBlO1xuXG4gICAgY29uc3QgaWRlbnRpZmllciA9IGVudmVsb3BlLnNvdXJjZVV1aWQ7XG4gICAgY29uc3QgeyBzb3VyY2VEZXZpY2UgfSA9IGVudmVsb3BlO1xuXG4gICAgY29uc3QgeyBkZXN0aW5hdGlvblV1aWQgfSA9IGVudmVsb3BlO1xuICAgIGNvbnN0IHByZUtleVN0b3JlID0gbmV3IFByZUtleXMoeyBvdXJVdWlkOiBkZXN0aW5hdGlvblV1aWQgfSk7XG4gICAgY29uc3Qgc2lnbmVkUHJlS2V5U3RvcmUgPSBuZXcgU2lnbmVkUHJlS2V5cyh7IG91clV1aWQ6IGRlc3RpbmF0aW9uVXVpZCB9KTtcblxuICAgIHN0cmljdEFzc2VydChpZGVudGlmaWVyICE9PSB1bmRlZmluZWQsICdFbXB0eSBpZGVudGlmaWVyJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHNvdXJjZURldmljZSAhPT0gdW5kZWZpbmVkLCAnRW1wdHkgc291cmNlIGRldmljZScpO1xuXG4gICAgY29uc3QgYWRkcmVzcyA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKFxuICAgICAgZGVzdGluYXRpb25VdWlkLFxuICAgICAgQWRkcmVzcy5jcmVhdGUoaWRlbnRpZmllciwgc291cmNlRGV2aWNlKVxuICAgICk7XG5cbiAgICBpZiAoXG4gICAgICB1dWlkS2luZCA9PT0gVVVJREtpbmQuUE5JICYmXG4gICAgICBlbnZlbG9wZS50eXBlICE9PSBlbnZlbG9wZVR5cGVFbnVtLlBSRUtFWV9CVU5ETEVcbiAgICApIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgTWVzc2FnZVJlY2VpdmVyLmlubmVyRGVjcnlwdCgke2xvZ0lkfSk6IGAgK1xuICAgICAgICAgICdub24tUHJlS2V5IGVudmVsb3BlIG9uIFBOSSdcbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0cmljdEFzc2VydChcbiAgICAgIHV1aWRLaW5kID09PSBVVUlES2luZC5QTkkgfHwgdXVpZEtpbmQgPT09IFVVSURLaW5kLkFDSSxcbiAgICAgIGBVbnN1cHBvcnRlZCB1dWlkS2luZDogJHt1dWlkS2luZH1gXG4gICAgKTtcblxuICAgIGlmIChlbnZlbG9wZS50eXBlID09PSBlbnZlbG9wZVR5cGVFbnVtLlBMQUlOVEVYVF9DT05URU5UKSB7XG4gICAgICBsb2cuaW5mbyhgZGVjcnlwdC8ke2xvZ0lkfTogcGxhaW50ZXh0IG1lc3NhZ2VgKTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGNpcGhlcnRleHQpO1xuICAgICAgY29uc3QgcGxhaW50ZXh0Q29udGVudCA9IFBsYWludGV4dENvbnRlbnQuZGVzZXJpYWxpemUoYnVmZmVyKTtcblxuICAgICAgcmV0dXJuIHRoaXMudW5wYWQocGxhaW50ZXh0Q29udGVudC5ib2R5KCkpO1xuICAgIH1cbiAgICBpZiAoZW52ZWxvcGUudHlwZSA9PT0gZW52ZWxvcGVUeXBlRW51bS5DSVBIRVJURVhUKSB7XG4gICAgICBsb2cuaW5mbyhgZGVjcnlwdC8ke2xvZ0lkfTogY2lwaGVydGV4dCBtZXNzYWdlYCk7XG4gICAgICBpZiAoIWlkZW50aWZpZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaW5uZXJEZWNyeXB0OiBObyBpZGVudGlmaWVyIGZvciBDSVBIRVJURVhUIG1lc3NhZ2UnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIXNvdXJjZURldmljZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5pbm5lckRlY3J5cHQ6IE5vIHNvdXJjZURldmljZSBmb3IgQ0lQSEVSVEVYVCBtZXNzYWdlJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2lnbmFsTWVzc2FnZSA9IFNpZ25hbE1lc3NhZ2UuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20oY2lwaGVydGV4dCkpO1xuXG4gICAgICBjb25zdCBwbGFpbnRleHQgPSBhd2FpdCB0aGlzLnN0b3JhZ2UucHJvdG9jb2wuZW5xdWV1ZVNlc3Npb25Kb2IoXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFzeW5jICgpID0+XG4gICAgICAgICAgdGhpcy51bnBhZChcbiAgICAgICAgICAgIGF3YWl0IHNpZ25hbERlY3J5cHQoXG4gICAgICAgICAgICAgIHNpZ25hbE1lc3NhZ2UsXG4gICAgICAgICAgICAgIFByb3RvY29sQWRkcmVzcy5uZXcoaWRlbnRpZmllciwgc291cmNlRGV2aWNlKSxcbiAgICAgICAgICAgICAgc2Vzc2lvblN0b3JlLFxuICAgICAgICAgICAgICBpZGVudGl0eUtleVN0b3JlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgem9uZVxuICAgICAgKTtcbiAgICAgIHJldHVybiBwbGFpbnRleHQ7XG4gICAgfVxuICAgIGlmIChlbnZlbG9wZS50eXBlID09PSBlbnZlbG9wZVR5cGVFbnVtLlBSRUtFWV9CVU5ETEUpIHtcbiAgICAgIGxvZy5pbmZvKGBkZWNyeXB0LyR7bG9nSWR9OiBwcmVrZXkgbWVzc2FnZWApO1xuICAgICAgaWYgKCFpZGVudGlmaWVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLmlubmVyRGVjcnlwdDogTm8gaWRlbnRpZmllciBmb3IgUFJFS0VZX0JVTkRMRSBtZXNzYWdlJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCFzb3VyY2VEZXZpY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaW5uZXJEZWNyeXB0OiBObyBzb3VyY2VEZXZpY2UgZm9yIFBSRUtFWV9CVU5ETEUgbWVzc2FnZSdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByZUtleVNpZ25hbE1lc3NhZ2UgPSBQcmVLZXlTaWduYWxNZXNzYWdlLmRlc2VyaWFsaXplKFxuICAgICAgICBCdWZmZXIuZnJvbShjaXBoZXJ0ZXh0KVxuICAgICAgKTtcblxuICAgICAgY29uc3QgcGxhaW50ZXh0ID0gYXdhaXQgdGhpcy5zdG9yYWdlLnByb3RvY29sLmVucXVldWVTZXNzaW9uSm9iKFxuICAgICAgICBhZGRyZXNzLFxuICAgICAgICBhc3luYyAoKSA9PlxuICAgICAgICAgIHRoaXMudW5wYWQoXG4gICAgICAgICAgICBhd2FpdCBzaWduYWxEZWNyeXB0UHJlS2V5KFxuICAgICAgICAgICAgICBwcmVLZXlTaWduYWxNZXNzYWdlLFxuICAgICAgICAgICAgICBQcm90b2NvbEFkZHJlc3MubmV3KGlkZW50aWZpZXIsIHNvdXJjZURldmljZSksXG4gICAgICAgICAgICAgIHNlc3Npb25TdG9yZSxcbiAgICAgICAgICAgICAgaWRlbnRpdHlLZXlTdG9yZSxcbiAgICAgICAgICAgICAgcHJlS2V5U3RvcmUsXG4gICAgICAgICAgICAgIHNpZ25lZFByZUtleVN0b3JlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgem9uZVxuICAgICAgKTtcbiAgICAgIHJldHVybiBwbGFpbnRleHQ7XG4gICAgfVxuICAgIGlmIChlbnZlbG9wZS50eXBlID09PSBlbnZlbG9wZVR5cGVFbnVtLlVOSURFTlRJRklFRF9TRU5ERVIpIHtcbiAgICAgIGxvZy5pbmZvKGBkZWNyeXB0LyR7bG9nSWR9OiB1bmlkZW50aWZpZWQgbWVzc2FnZWApO1xuICAgICAgY29uc3QgeyBwbGFpbnRleHQsIHVuc2VhbGVkUGxhaW50ZXh0IH0gPSBhd2FpdCB0aGlzLmRlY3J5cHRTZWFsZWRTZW5kZXIoXG4gICAgICAgIHN0b3JlcyxcbiAgICAgICAgZW52ZWxvcGUsXG4gICAgICAgIGNpcGhlcnRleHRcbiAgICAgICk7XG5cbiAgICAgIGlmIChwbGFpbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5wYWQocGxhaW50ZXh0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVuc2VhbGVkUGxhaW50ZXh0KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB1bnNlYWxlZFBsYWludGV4dC5tZXNzYWdlKCk7XG5cbiAgICAgICAgaWYgKCFjb250ZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5pbm5lckRlY3J5cHQ6IENvbnRlbnQgcmV0dXJuZWQgd2FzIGZhbHNleSEnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBqdXN0IHRoZSBjb250ZW50IGJlY2F1c2UgdGhhdCBtYXRjaGVzIHRoZSBzaWduYXR1cmUgb2YgdGhlIG90aGVyXG4gICAgICAgIC8vICAgZGVjcnlwdCBtZXRob2RzIHVzZWQgYWJvdmUuXG4gICAgICAgIHJldHVybiB0aGlzLnVucGFkKGNvbnRlbnQpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgbGFjayBvZiBwbGFpbnRleHQgZnJvbSB1bmlkZW50aWZpZWQgc2VuZGVyJyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBtZXNzYWdlIHR5cGUnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVjcnlwdChcbiAgICBzdG9yZXM6IExvY2tlZFN0b3JlcyxcbiAgICBlbnZlbG9wZTogVW5zZWFsZWRFbnZlbG9wZSxcbiAgICBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5LFxuICAgIHV1aWRLaW5kOiBVVUlES2luZFxuICApOiBQcm9taXNlPFVpbnQ4QXJyYXkgfCB1bmRlZmluZWQ+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaW5uZXJEZWNyeXB0KHN0b3JlcywgZW52ZWxvcGUsIGNpcGhlcnRleHQsIHV1aWRLaW5kKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc3QgdXVpZCA9IGVudmVsb3BlLnNvdXJjZVV1aWQ7XG4gICAgICBjb25zdCBkZXZpY2VJZCA9IGVudmVsb3BlLnNvdXJjZURldmljZTtcblxuICAgICAgLy8gSm9iIHRpbWVkIG91dCwgbm90IGEgZGVjcnlwdGlvbiBlcnJvclxuICAgICAgaWYgKFxuICAgICAgICBlcnJvcj8ubmFtZSA9PT0gJ1RpbWVvdXRFcnJvcicgfHxcbiAgICAgICAgZXJyb3I/Lm1lc3NhZ2U/LmluY2x1ZGVzPy4oJ3Rhc2sgZGlkIG5vdCBjb21wbGV0ZSBpbiB0aW1lJylcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBkb24ndCBkbyBhbnl0aGluZyBpZiBpdCdzIGp1c3QgYSBkdXBsaWNhdGVkIG1lc3NhZ2VcbiAgICAgIGlmIChlcnJvcj8ubWVzc2FnZT8uaW5jbHVkZXM/LignbWVzc2FnZSB3aXRoIG9sZCBjb3VudGVyJykpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZG9uJ3QgZG8gYSBsaWdodCBzZXNzaW9uIHJlc2V0IGlmIGl0J3MgYW4gZXJyb3Igd2l0aCB0aGUgc2VhbGVkIHNlbmRlclxuICAgICAgLy8gICB3cmFwcGVyLCBzaW5jZSB3ZSBkb24ndCB0cnVzdCB0aGUgc2VuZGVyIGluZm9ybWF0aW9uLlxuICAgICAgaWYgKGVycm9yPy5tZXNzYWdlPy5pbmNsdWRlcz8uKCd0cnVzdCByb290IHZhbGlkYXRpb24gZmFpbGVkJykpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAoZW52ZWxvcGUuc291cmNlICYmIHRoaXMuaXNCbG9ja2VkKGVudmVsb3BlLnNvdXJjZSkpIHx8XG4gICAgICAgIChlbnZlbG9wZS5zb3VyY2VVdWlkICYmIHRoaXMuaXNVdWlkQmxvY2tlZChlbnZlbG9wZS5zb3VyY2VVdWlkKSlcbiAgICAgICkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLmRlY3J5cHQ6IEVycm9yIGZyb20gYmxvY2tlZCBzZW5kZXI7IG5vIGZ1cnRoZXIgcHJvY2Vzc2luZydcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV1aWQgJiYgZGV2aWNlSWQpIHtcbiAgICAgICAgY29uc3QgeyBjaXBoZXJUZXh0Qnl0ZXMsIGNpcGhlclRleHRUeXBlIH0gPSBlbnZlbG9wZTtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgRGVjcnlwdGlvbkVycm9yRXZlbnQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2lwaGVyVGV4dEJ5dGVzLFxuICAgICAgICAgICAgY2lwaGVyVGV4dFR5cGUsXG4gICAgICAgICAgICBjb250ZW50SGludDogZW52ZWxvcGUuY29udGVudEhpbnQsXG4gICAgICAgICAgICBncm91cElkOiBlbnZlbG9wZS5ncm91cElkLFxuICAgICAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXI6IGVudmVsb3BlLnJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgICAgICAgcmVjZWl2ZWRBdERhdGU6IGVudmVsb3BlLnJlY2VpdmVkQXREYXRlLFxuICAgICAgICAgICAgc2VuZGVyRGV2aWNlOiBkZXZpY2VJZCxcbiAgICAgICAgICAgIHNlbmRlclV1aWQ6IHV1aWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IGVudmVsb3BlLnRpbWVzdGFtcCxcbiAgICAgICAgICB9LFxuICAgICAgICAgICgpID0+IHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEF2b2lkIGRlYWRsb2NrcyBieSBzY2hlZHVsaW5nIHByb2Nlc3Npbmcgb24gZGVjcnlwdGVkIHF1ZXVlXG4gICAgICAgIHRoaXMuYWRkVG9RdWV1ZShcbiAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpLFxuICAgICAgICAgICdkZWNyeXB0ZWQvZGlzcGF0Y2hFdmVudCcsXG4gICAgICAgICAgVGFza1R5cGUuRGVjcnlwdGVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlbnZlbG9wZUlkID0gZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgIGBNZXNzYWdlUmVjZWl2ZXIuZGVjcnlwdDogRW52ZWxvcGUgJHtlbnZlbG9wZUlkfSBtaXNzaW5nIHV1aWQgb3IgZGV2aWNlSWRgXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU2VudE1lc3NhZ2UoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIHNlbnRDb250YWluZXI6IFByb2Nlc3NlZFNlbnRcbiAgKSB7XG4gICAgbG9nLmluZm8oJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVTZW50TWVzc2FnZScsIGdldEVudmVsb3BlSWQoZW52ZWxvcGUpKTtcblxuICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgJ3NlbnRTeW5jJyk7XG5cbiAgICBjb25zdCB7XG4gICAgICBkZXN0aW5hdGlvbixcbiAgICAgIGRlc3RpbmF0aW9uVXVpZCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICAgIHVuaWRlbnRpZmllZFN0YXR1cyxcbiAgICAgIGlzUmVjaXBpZW50VXBkYXRlLFxuICAgIH0gPSBzZW50Q29udGFpbmVyO1xuXG4gICAgaWYgKCFtc2cpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZVJlY2VpdmVyLmhhbmRsZVNlbnRNZXNzYWdlOiBtZXNzYWdlIHdhcyBmYWxzZXkhJyk7XG4gICAgfVxuXG4gICAgbGV0IHA6IFByb21pc2U8dm9pZD4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAobXNnLmZsYWdzICYmIG1zZy5mbGFncyAmIFByb3RvLkRhdGFNZXNzYWdlLkZsYWdzLkVORF9TRVNTSU9OKSB7XG4gICAgICBpZiAoZGVzdGluYXRpb25VdWlkKSB7XG4gICAgICAgIHAgPSB0aGlzLmhhbmRsZUVuZFNlc3Npb24oZW52ZWxvcGUsIG5ldyBVVUlEKGRlc3RpbmF0aW9uVXVpZCkpO1xuICAgICAgfSBlbHNlIGlmIChkZXN0aW5hdGlvbikge1xuICAgICAgICBjb25zdCB0aGVpclV1aWQgPSBVVUlELmxvb2t1cChkZXN0aW5hdGlvbik7XG4gICAgICAgIGlmICh0aGVpclV1aWQpIHtcbiAgICAgICAgICBwID0gdGhpcy5oYW5kbGVFbmRTZXNzaW9uKGVudmVsb3BlLCB0aGVpclV1aWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy53YXJuKGBoYW5kbGVTZW50TWVzc2FnZTogdXVpZCBub3QgZm91bmQgZm9yICR7ZGVzdGluYXRpb259YCk7XG4gICAgICAgICAgcCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVTZW50TWVzc2FnZTogQ2Fubm90IGVuZCBzZXNzaW9uIHdpdGggZmFsc2V5IGRlc3RpbmF0aW9uJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBhd2FpdCBwO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IHRoaXMucHJvY2Vzc0RlY3J5cHRlZChlbnZlbG9wZSwgbXNnKTtcbiAgICBjb25zdCBncm91cElkID0gdGhpcy5nZXRQcm9jZXNzZWRHcm91cElkKG1lc3NhZ2UpO1xuICAgIGNvbnN0IGlzQmxvY2tlZCA9IGdyb3VwSWQgPyB0aGlzLmlzR3JvdXBCbG9ja2VkKGdyb3VwSWQpIDogZmFsc2U7XG4gICAgY29uc3QgeyBzb3VyY2UsIHNvdXJjZVV1aWQgfSA9IGVudmVsb3BlO1xuICAgIGNvbnN0IG91ckUxNjQgPSB0aGlzLnN0b3JhZ2UudXNlci5nZXROdW1iZXIoKTtcbiAgICBjb25zdCBvdXJVdWlkID0gdGhpcy5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpO1xuICAgIGNvbnN0IGlzTWUgPVxuICAgICAgKHNvdXJjZSAmJiBvdXJFMTY0ICYmIHNvdXJjZSA9PT0gb3VyRTE2NCkgfHxcbiAgICAgIChzb3VyY2VVdWlkICYmIG91clV1aWQgJiYgc291cmNlVXVpZCA9PT0gb3VyVXVpZCk7XG4gICAgY29uc3QgaXNMZWF2aW5nR3JvdXAgPSBCb29sZWFuKFxuICAgICAgIW1lc3NhZ2UuZ3JvdXBWMiAmJlxuICAgICAgICBtZXNzYWdlLmdyb3VwICYmXG4gICAgICAgIG1lc3NhZ2UuZ3JvdXAudHlwZSA9PT0gUHJvdG8uR3JvdXBDb250ZXh0LlR5cGUuUVVJVFxuICAgICk7XG5cbiAgICBpZiAoZ3JvdXBJZCAmJiBpc0Jsb2NrZWQgJiYgIShpc01lICYmIGlzTGVhdmluZ0dyb3VwKSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBNZXNzYWdlICR7Z2V0RW52ZWxvcGVJZChlbnZlbG9wZSl9IGlnbm9yZWQ7IGRlc3RpbmVkIGZvciBibG9ja2VkIGdyb3VwYFxuICAgICAgKTtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgZXYgPSBuZXcgU2VudEV2ZW50KFxuICAgICAge1xuICAgICAgICBkZXN0aW5hdGlvbjogZHJvcE51bGwoZGVzdGluYXRpb24pLFxuICAgICAgICBkZXN0aW5hdGlvblV1aWQ6XG4gICAgICAgICAgZHJvcE51bGwoZGVzdGluYXRpb25VdWlkKSB8fCBlbnZlbG9wZS5kZXN0aW5hdGlvblV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gICAgICAgIHNlcnZlclRpbWVzdGFtcDogZW52ZWxvcGUuc2VydmVyVGltZXN0YW1wLFxuICAgICAgICBkZXZpY2U6IGVudmVsb3BlLnNvdXJjZURldmljZSxcbiAgICAgICAgdW5pZGVudGlmaWVkU3RhdHVzLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBpc1JlY2lwaWVudFVwZGF0ZTogQm9vbGVhbihpc1JlY2lwaWVudFVwZGF0ZSksXG4gICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiBlbnZlbG9wZS5yZWNlaXZlZEF0Q291bnRlcixcbiAgICAgICAgcmVjZWl2ZWRBdERhdGU6IGVudmVsb3BlLnJlY2VpdmVkQXREYXRlLFxuICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXA6IGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcD8udG9OdW1iZXIoKSxcbiAgICAgIH0sXG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZS5iaW5kKHRoaXMsIGVudmVsb3BlKVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RvcnlNZXNzYWdlKFxuICAgIGVudmVsb3BlOiBVbnNlYWxlZEVudmVsb3BlLFxuICAgIG1zZzogUHJvdG8uSVN0b3J5TWVzc2FnZSxcbiAgICBzZW50TWVzc2FnZT86IFByb2Nlc3NlZFNlbnRcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cuaW5mbygnTWVzc2FnZVJlY2VpdmVyLmhhbmRsZVN0b3J5TWVzc2FnZScsIGxvZ0lkKTtcblxuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBBcnJheTxQcm9jZXNzZWRBdHRhY2htZW50PiA9IFtdO1xuXG4gICAgaWYgKCF3aW5kb3cuRXZlbnRzLmdldEhhc1N0b3JpZXNFbmFibGVkKCkpIHtcbiAgICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlU3RvcnlNZXNzYWdlOiBkcm9wcGluZycsIGxvZ0lkKTtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobXNnLmZpbGVBdHRhY2htZW50KSB7XG4gICAgICBjb25zdCBhdHRhY2htZW50ID0gcHJvY2Vzc0F0dGFjaG1lbnQobXNnLmZpbGVBdHRhY2htZW50KTtcbiAgICAgIGF0dGFjaG1lbnRzLnB1c2goYXR0YWNobWVudCk7XG4gICAgfVxuXG4gICAgaWYgKG1zZy50ZXh0QXR0YWNobWVudCkge1xuICAgICAgY29uc3QgeyB0ZXh0IH0gPSBtc2cudGV4dEF0dGFjaG1lbnQ7XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0IGF0dGFjaG1lbnRzIG11c3QgaGF2ZSB0ZXh0IScpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPIERFU0tUT1AtMzcxNCB3ZSBzaG91bGQgZG93bmxvYWQgdGhlIHN0b3J5IGxpbmsgcHJldmlldyBpbWFnZVxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHNpemU6IHRleHQubGVuZ3RoLFxuICAgICAgICBjb250ZW50VHlwZTogVEVYVF9BVFRBQ0hNRU5ULFxuICAgICAgICB0ZXh0QXR0YWNobWVudDogbXNnLnRleHRBdHRhY2htZW50LFxuICAgICAgICBibHVySGFzaDogZ2VuZXJhdGVCbHVySGFzaChcbiAgICAgICAgICAobXNnLnRleHRBdHRhY2htZW50LmNvbG9yIHx8XG4gICAgICAgICAgICBtc2cudGV4dEF0dGFjaG1lbnQuZ3JhZGllbnQ/LnN0YXJ0Q29sb3IpID8/XG4gICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VwVjIgPSBtc2cuZ3JvdXAgPyBwcm9jZXNzR3JvdXBWMkNvbnRleHQobXNnLmdyb3VwKSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoZ3JvdXBWMiAmJiB0aGlzLmlzR3JvdXBCbG9ja2VkKGdyb3VwVjIuaWQpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYE1lc3NhZ2VSZWNlaXZlci5oYW5kbGVTdG9yeU1lc3NhZ2U6IGVudmVsb3BlICR7Z2V0RW52ZWxvcGVJZChcbiAgICAgICAgICBlbnZlbG9wZVxuICAgICAgICApfSBpZ25vcmVkOyBkZXN0aW5lZCBmb3IgYmxvY2tlZCBncm91cGBcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXhwaXJlVGltZXIgPSBNYXRoLm1pbihcbiAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgIChlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAgKyBkdXJhdGlvbnMuREFZIC0gRGF0ZS5ub3coKSkgLyAxMDAwXG4gICAgICApLFxuICAgICAgZHVyYXRpb25zLkRBWSAvIDEwMDBcbiAgICApO1xuXG4gICAgaWYgKGV4cGlyZVRpbWVyIDw9IDApIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICAnTWVzc2FnZVJlY2VpdmVyLmhhbmRsZVN0b3J5TWVzc2FnZTogc3RvcnkgYWxyZWFkeSBleHBpcmVkJyxcbiAgICAgICAgbG9nSWRcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgY2FuUmVwbHlUb1N0b3J5OiBCb29sZWFuKG1zZy5hbGxvd3NSZXBsaWVzKSxcbiAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgZmxhZ3M6IDAsXG4gICAgICBncm91cFYyLFxuICAgICAgaXNTdG9yeTogdHJ1ZSxcbiAgICAgIGlzVmlld09uY2U6IGZhbHNlLFxuICAgICAgdGltZXN0YW1wOiBlbnZlbG9wZS50aW1lc3RhbXAsXG4gICAgfTtcblxuICAgIGlmIChzZW50TWVzc2FnZSAmJiBtZXNzYWdlLmdyb3VwVjIpIHtcbiAgICAgIGNvbnN0IGV2ID0gbmV3IFNlbnRFdmVudChcbiAgICAgICAge1xuICAgICAgICAgIGRlc3RpbmF0aW9uVXVpZDogZW52ZWxvcGUuZGVzdGluYXRpb25VdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgaXNSZWNpcGllbnRVcGRhdGU6IEJvb2xlYW4oc2VudE1lc3NhZ2UuaXNSZWNpcGllbnRVcGRhdGUpLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXI6IGVudmVsb3BlLnJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgICAgIHJlY2VpdmVkQXREYXRlOiBlbnZlbG9wZS5yZWNlaXZlZEF0RGF0ZSxcbiAgICAgICAgICBzZXJ2ZXJUaW1lc3RhbXA6IGVudmVsb3BlLnNlcnZlclRpbWVzdGFtcCxcbiAgICAgICAgICB0aW1lc3RhbXA6IGVudmVsb3BlLnRpbWVzdGFtcCxcbiAgICAgICAgICB1bmlkZW50aWZpZWRTdGF0dXM6IHNlbnRNZXNzYWdlLnVuaWRlbnRpZmllZFN0YXR1cyxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmRpc3BhdGNoQW5kV2FpdChldik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHNlbnRNZXNzYWdlKSB7XG4gICAgICBjb25zdCB7IHN0b3J5TWVzc2FnZVJlY2lwaWVudHMgfSA9IHNlbnRNZXNzYWdlO1xuICAgICAgY29uc3QgcmVjaXBpZW50cyA9IHN0b3J5TWVzc2FnZVJlY2lwaWVudHMgPz8gW107XG5cbiAgICAgIGNvbnN0IGlzQWxsb3dlZFRvUmVwbHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgICAgIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RUb1NlbnRVdWlkID0gbmV3IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PigpO1xuXG4gICAgICByZWNpcGllbnRzLmZvckVhY2gocmVjaXBpZW50ID0+IHtcbiAgICAgICAgY29uc3QgeyBkZXN0aW5hdGlvblV1aWQgfSA9IHJlY2lwaWVudDtcbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblV1aWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3JtYWxpemVkRGVzdGluYXRpb25VdWlkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgICBkZXN0aW5hdGlvblV1aWQsXG4gICAgICAgICAgJ2hhbmRsZVN0b3J5TWVzc2FnZS5kZXN0aW5hdGlvblV1aWQnXG4gICAgICAgICk7XG5cbiAgICAgICAgcmVjaXBpZW50LmRpc3RyaWJ1dGlvbkxpc3RJZHM/LmZvckVhY2gobGlzdElkID0+IHtcbiAgICAgICAgICBjb25zdCBzZW50VXVpZHM6IFNldDxzdHJpbmc+ID1cbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RUb1NlbnRVdWlkLmdldChsaXN0SWQpIHx8IG5ldyBTZXQoKTtcbiAgICAgICAgICBzZW50VXVpZHMuYWRkKG5vcm1hbGl6ZWREZXN0aW5hdGlvblV1aWQpO1xuICAgICAgICAgIGRpc3RyaWJ1dGlvbkxpc3RUb1NlbnRVdWlkLnNldChsaXN0SWQsIHNlbnRVdWlkcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlzQWxsb3dlZFRvUmVwbHkuc2V0KFxuICAgICAgICAgIG5vcm1hbGl6ZWREZXN0aW5hdGlvblV1aWQsXG4gICAgICAgICAgcmVjaXBpZW50LmlzQWxsb3dlZFRvUmVwbHkgIT09IGZhbHNlXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgZGlzdHJpYnV0aW9uTGlzdFRvU2VudFV1aWQuZm9yRWFjaCgoc2VudFRvVXVpZHMsIGxpc3RJZCkgPT4ge1xuICAgICAgICBjb25zdCBldiA9IG5ldyBTZW50RXZlbnQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVzdGluYXRpb25VdWlkOiBlbnZlbG9wZS5kZXN0aW5hdGlvblV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogZW52ZWxvcGUudGltZXN0YW1wLFxuICAgICAgICAgICAgc2VydmVyVGltZXN0YW1wOiBlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgICAgICB1bmlkZW50aWZpZWRTdGF0dXM6IEFycmF5LmZyb20oc2VudFRvVXVpZHMpLm1hcChcbiAgICAgICAgICAgICAgZGVzdGluYXRpb25VdWlkID0+ICh7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25VdWlkLFxuICAgICAgICAgICAgICAgIGlzQWxsb3dlZFRvUmVwbHlUb1N0b3J5OiBpc0FsbG93ZWRUb1JlcGx5LmdldChkZXN0aW5hdGlvblV1aWQpLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICBpc1JlY2lwaWVudFVwZGF0ZTogQm9vbGVhbihzZW50TWVzc2FnZS5pc1JlY2lwaWVudFVwZGF0ZSksXG4gICAgICAgICAgICByZWNlaXZlZEF0Q291bnRlcjogZW52ZWxvcGUucmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICAgICAgICByZWNlaXZlZEF0RGF0ZTogZW52ZWxvcGUucmVjZWl2ZWRBdERhdGUsXG4gICAgICAgICAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RJZDogbm9ybWFsaXplVXVpZChcbiAgICAgICAgICAgICAgbGlzdElkLFxuICAgICAgICAgICAgICAnc3RvcnlEaXN0cmlidXRpb25MaXN0SWQnXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEFuZFdhaXQoZXYpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXYgPSBuZXcgTWVzc2FnZUV2ZW50KFxuICAgICAge1xuICAgICAgICBzb3VyY2U6IGVudmVsb3BlLnNvdXJjZSxcbiAgICAgICAgc291cmNlVXVpZDogZW52ZWxvcGUuc291cmNlVXVpZCxcbiAgICAgICAgc291cmNlRGV2aWNlOiBlbnZlbG9wZS5zb3VyY2VEZXZpY2UsXG4gICAgICAgIHRpbWVzdGFtcDogZW52ZWxvcGUudGltZXN0YW1wLFxuICAgICAgICBzZXJ2ZXJHdWlkOiBlbnZlbG9wZS5zZXJ2ZXJHdWlkLFxuICAgICAgICBzZXJ2ZXJUaW1lc3RhbXA6IGVudmVsb3BlLnNlcnZlclRpbWVzdGFtcCxcbiAgICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcnlSZWNlaXZlZDogQm9vbGVhbihcbiAgICAgICAgICBlbnZlbG9wZS51bmlkZW50aWZpZWREZWxpdmVyeVJlY2VpdmVkXG4gICAgICAgICksXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiBlbnZlbG9wZS5yZWNlaXZlZEF0Q291bnRlcixcbiAgICAgICAgcmVjZWl2ZWRBdERhdGU6IGVudmVsb3BlLnJlY2VpdmVkQXREYXRlLFxuICAgICAgfSxcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEFuZFdhaXQoZXYpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVEYXRhTWVzc2FnZShcbiAgICBlbnZlbG9wZTogVW5zZWFsZWRFbnZlbG9wZSxcbiAgICBtc2c6IFByb3RvLklEYXRhTWVzc2FnZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsb2dJZCA9IGdldEVudmVsb3BlSWQoZW52ZWxvcGUpO1xuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlRGF0YU1lc3NhZ2UnLCBsb2dJZCk7XG5cbiAgICBjb25zdCBpc1N0b3JpZXNFbmFibGVkID1cbiAgICAgIGlzRW5hYmxlZCgnZGVza3RvcC5zdG9yaWVzJykgfHwgaXNFbmFibGVkKCdkZXNrdG9wLmludGVybmFsVXNlcicpO1xuICAgIGlmICghaXNTdG9yaWVzRW5hYmxlZCAmJiBtc2cuc3RvcnlDb250ZXh0KSB7XG4gICAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdzdG9yeScpO1xuXG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYE1lc3NhZ2VSZWNlaXZlci5oYW5kbGVEYXRhTWVzc2FnZS8ke2xvZ0lkfTogRHJvcHBpbmcgaW5jb21pbmcgZGF0YU1lc3NhZ2Ugd2l0aCBzdG9yeUNvbnRleHQgZmllbGRgXG4gICAgICApO1xuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgcDogUHJvbWlzZTx2b2lkPiA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gZW52ZWxvcGUuc291cmNlVXVpZDtcbiAgICBpZiAoIWRlc3RpbmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlRGF0YU1lc3NhZ2U6IHNvdXJjZSBhbmQgc291cmNlVXVpZCB3ZXJlIGZhbHNleSdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNJbnZhbGlkR3JvdXBEYXRhKG1zZywgZW52ZWxvcGUpKSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuY2hlY2tHcm91cFYxRGF0YShtc2cpO1xuXG4gICAgaWYgKG1zZy5mbGFncyAmJiBtc2cuZmxhZ3MgJiBQcm90by5EYXRhTWVzc2FnZS5GbGFncy5FTkRfU0VTU0lPTikge1xuICAgICAgcCA9IHRoaXMuaGFuZGxlRW5kU2Vzc2lvbihlbnZlbG9wZSwgbmV3IFVVSUQoZGVzdGluYXRpb24pKTtcbiAgICB9XG5cbiAgICBpZiAobXNnLmZsYWdzICYmIG1zZy5mbGFncyAmIFByb3RvLkRhdGFNZXNzYWdlLkZsYWdzLlBST0ZJTEVfS0VZX1VQREFURSkge1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBtc2cucHJvZmlsZUtleSAmJiBtc2cucHJvZmlsZUtleS5sZW5ndGggPiAwLFxuICAgICAgICAnUFJPRklMRV9LRVlfVVBEQVRFIHdpdGhvdXQgcHJvZmlsZUtleSdcbiAgICAgICk7XG5cbiAgICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgJ3Byb2ZpbGVLZXlVcGRhdGUnKTtcblxuICAgICAgY29uc3QgZXYgPSBuZXcgUHJvZmlsZUtleVVwZGF0ZUV2ZW50KFxuICAgICAgICB7XG4gICAgICAgICAgc291cmNlOiBlbnZlbG9wZS5zb3VyY2UsXG4gICAgICAgICAgc291cmNlVXVpZDogZW52ZWxvcGUuc291cmNlVXVpZCxcbiAgICAgICAgICBwcm9maWxlS2V5OiBCeXRlcy50b0Jhc2U2NChtc2cucHJvZmlsZUtleSksXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgICB9XG4gICAgYXdhaXQgcDtcblxuICAgIGxldCB0eXBlOiBTZW5kVHlwZXNUeXBlID0gJ21lc3NhZ2UnO1xuXG4gICAgaWYgKG1zZy5zdG9yeUNvbnRleHQpIHtcbiAgICAgIHR5cGUgPSAnc3RvcnknO1xuICAgIH0gZWxzZSBpZiAobXNnLmJvZHkpIHtcbiAgICAgIHR5cGUgPSAnbWVzc2FnZSc7XG4gICAgfSBlbHNlIGlmIChtc2cucmVhY3Rpb24pIHtcbiAgICAgIHR5cGUgPSAncmVhY3Rpb24nO1xuICAgIH0gZWxzZSBpZiAobXNnLmRlbGV0ZSkge1xuICAgICAgdHlwZSA9ICdkZWxldGVGb3JFdmVyeW9uZSc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG1zZy5mbGFncyAmJlxuICAgICAgbXNnLmZsYWdzICYgUHJvdG8uRGF0YU1lc3NhZ2UuRmxhZ3MuRVhQSVJBVElPTl9USU1FUl9VUERBVEVcbiAgICApIHtcbiAgICAgIHR5cGUgPSAnZXhwaXJhdGlvblRpbWVyVXBkYXRlJztcbiAgICB9IGVsc2UgaWYgKG1zZy5ncm91cCkge1xuICAgICAgdHlwZSA9ICdsZWdhY3lHcm91cENoYW5nZSc7XG4gICAgfVxuICAgIC8vIE5vdGU6IG90aGVyIGRhdGEgbWVzc2FnZXMgd2l0aG91dCBhbnkgb2YgdGhlc2UgYXR0cmlidXRlcyB3aWxsIGZhbGwgaW50byB0aGVcbiAgICAvLyAgICdtZXNzYWdlJyBidWNrZXQgLSBsaWtlIHN0aWNrZXJzLCBnaWZ0IGJhZGdlcywgZXRjLlxuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCB0eXBlKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCB0aGlzLnByb2Nlc3NEZWNyeXB0ZWQoZW52ZWxvcGUsIG1zZyk7XG4gICAgY29uc3QgZ3JvdXBJZCA9IHRoaXMuZ2V0UHJvY2Vzc2VkR3JvdXBJZChtZXNzYWdlKTtcbiAgICBjb25zdCBpc0Jsb2NrZWQgPSBncm91cElkID8gdGhpcy5pc0dyb3VwQmxvY2tlZChncm91cElkKSA6IGZhbHNlO1xuICAgIGNvbnN0IHsgc291cmNlLCBzb3VyY2VVdWlkIH0gPSBlbnZlbG9wZTtcbiAgICBjb25zdCBvdXJFMTY0ID0gdGhpcy5zdG9yYWdlLnVzZXIuZ2V0TnVtYmVyKCk7XG4gICAgY29uc3Qgb3VyVXVpZCA9IHRoaXMuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKTtcbiAgICBjb25zdCBpc01lID1cbiAgICAgIChzb3VyY2UgJiYgb3VyRTE2NCAmJiBzb3VyY2UgPT09IG91ckUxNjQpIHx8XG4gICAgICAoc291cmNlVXVpZCAmJiBvdXJVdWlkICYmIHNvdXJjZVV1aWQgPT09IG91clV1aWQpO1xuICAgIGNvbnN0IGlzTGVhdmluZ0dyb3VwID0gQm9vbGVhbihcbiAgICAgICFtZXNzYWdlLmdyb3VwVjIgJiZcbiAgICAgICAgbWVzc2FnZS5ncm91cCAmJlxuICAgICAgICBtZXNzYWdlLmdyb3VwLnR5cGUgPT09IFByb3RvLkdyb3VwQ29udGV4dC5UeXBlLlFVSVRcbiAgICApO1xuXG4gICAgaWYgKGdyb3VwSWQgJiYgaXNCbG9ja2VkICYmICEoaXNNZSAmJiBpc0xlYXZpbmdHcm91cCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgTWVzc2FnZSAke2dldEVudmVsb3BlSWQoZW52ZWxvcGUpfSBpZ25vcmVkOyBkZXN0aW5lZCBmb3IgYmxvY2tlZCBncm91cGBcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ID0gbmV3IE1lc3NhZ2VFdmVudChcbiAgICAgIHtcbiAgICAgICAgc291cmNlOiBlbnZlbG9wZS5zb3VyY2UsXG4gICAgICAgIHNvdXJjZVV1aWQ6IGVudmVsb3BlLnNvdXJjZVV1aWQsXG4gICAgICAgIHNvdXJjZURldmljZTogZW52ZWxvcGUuc291cmNlRGV2aWNlLFxuICAgICAgICB0aW1lc3RhbXA6IGVudmVsb3BlLnRpbWVzdGFtcCxcbiAgICAgICAgc2VydmVyR3VpZDogZW52ZWxvcGUuc2VydmVyR3VpZCxcbiAgICAgICAgc2VydmVyVGltZXN0YW1wOiBlbnZlbG9wZS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJ5UmVjZWl2ZWQ6IEJvb2xlYW4oXG4gICAgICAgICAgZW52ZWxvcGUudW5pZGVudGlmaWVkRGVsaXZlcnlSZWNlaXZlZFxuICAgICAgICApLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICByZWNlaXZlZEF0Q291bnRlcjogZW52ZWxvcGUucmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICAgIHJlY2VpdmVkQXREYXRlOiBlbnZlbG9wZS5yZWNlaXZlZEF0RGF0ZSxcbiAgICAgIH0sXG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZS5iaW5kKHRoaXMsIGVudmVsb3BlKVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbWF5YmVVcGRhdGVUaW1lc3RhbXAoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlXG4gICk6IFByb21pc2U8UHJvY2Vzc2VkRW52ZWxvcGU+IHtcbiAgICBjb25zdCB7IHJldHJ5UGxhY2Vob2xkZXJzIH0gPSB3aW5kb3cuU2lnbmFsLlNlcnZpY2VzO1xuICAgIGlmICghcmV0cnlQbGFjZWhvbGRlcnMpIHtcbiAgICAgIGxvZy53YXJuKCdtYXliZVVwZGF0ZVRpbWVzdGFtcDogcmV0cnkgcGxhY2Vob2xkZXJzIG5vdCBhdmFpbGFibGUhJyk7XG4gICAgICByZXR1cm4gZW52ZWxvcGU7XG4gICAgfVxuXG4gICAgY29uc3QgeyB0aW1lc3RhbXAgfSA9IGVudmVsb3BlO1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBlbnZlbG9wZS5ncm91cElkIHx8IGVudmVsb3BlLnNvdXJjZVV1aWQ7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IGlkRm9yTG9nZ2luZyA9IGVudmVsb3BlLmdyb3VwSWRcbiAgICAgICAgICA/IGBncm91cHYyKCR7ZW52ZWxvcGUuZ3JvdXBJZH0pYFxuICAgICAgICAgIDogZW52ZWxvcGUuc291cmNlVXVpZDtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYG1heWJlVXBkYXRlVGltZXN0YW1wLyR7dGltZXN0YW1wfTogTm8gY29udmVyc2F0aW9uIGZvdW5kIGZvciBpZGVudGlmaWVyICR7aWRGb3JMb2dnaW5nfWBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVudmVsb3BlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2dJZCA9IGAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0vJHt0aW1lc3RhbXB9YDtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCByZXRyeVBsYWNlaG9sZGVycy5maW5kQnlNZXNzYWdlQW5kUmVtb3ZlKFxuICAgICAgICBjb252ZXJzYXRpb24uaWQsXG4gICAgICAgIHRpbWVzdGFtcFxuICAgICAgKTtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW0ud2FzT3BlbmVkKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBtYXliZVVwZGF0ZVRpbWVzdGFtcC8ke2xvZ0lkfTogZm91bmQgcmV0cnkgcGxhY2Vob2xkZXIsIGJ1dCBjb252ZXJzYXRpb24gd2FzIG9wZW5lZC4gTm8gdXBkYXRlcyBtYWRlLmBcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgbWF5YmVVcGRhdGVUaW1lc3RhbXAvJHtsb2dJZH06IGZvdW5kIHJldHJ5IHBsYWNlaG9sZGVyLiBVcGRhdGluZyByZWNlaXZlZEF0Q291bnRlci9yZWNlaXZlZEF0RGF0ZWBcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmVudmVsb3BlLFxuICAgICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiBpdGVtLnJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgICAgIHJlY2VpdmVkQXREYXRlOiBpdGVtLnJlY2VpdmVkQXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYG1heWJlVXBkYXRlVGltZXN0YW1wLyR7dGltZXN0YW1wfTogRmFpbGVkIHRvIHByb2Nlc3MgbWVzc2FnZTogJHtFcnJvcnMudG9Mb2dGb3JtYXQoXG4gICAgICAgICAgZXJyb3JcbiAgICAgICAgKX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBlbnZlbG9wZTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5uZXJIYW5kbGVDb250ZW50TWVzc2FnZShcbiAgICBpbmNvbWluZ0VudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICBwbGFpbnRleHQ6IFVpbnQ4QXJyYXlcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY29udGVudCA9IFByb3RvLkNvbnRlbnQuZGVjb2RlKHBsYWludGV4dCk7XG4gICAgY29uc3QgZW52ZWxvcGUgPSBhd2FpdCB0aGlzLm1heWJlVXBkYXRlVGltZXN0YW1wKGluY29taW5nRW52ZWxvcGUpO1xuXG4gICAgaWYgKFxuICAgICAgY29udGVudC5kZWNyeXB0aW9uRXJyb3JNZXNzYWdlICYmXG4gICAgICBCeXRlcy5pc05vdEVtcHR5KGNvbnRlbnQuZGVjcnlwdGlvbkVycm9yTWVzc2FnZSlcbiAgICApIHtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlRGVjcnlwdGlvbkVycm9yKFxuICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgY29udGVudC5kZWNyeXB0aW9uRXJyb3JNZXNzYWdlXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29udGVudC5zeW5jTWVzc2FnZSkge1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVTeW5jTWVzc2FnZShcbiAgICAgICAgZW52ZWxvcGUsXG4gICAgICAgIHByb2Nlc3NTeW5jTWVzc2FnZShjb250ZW50LnN5bmNNZXNzYWdlKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNvbnRlbnQuZGF0YU1lc3NhZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlRGF0YU1lc3NhZ2UoZW52ZWxvcGUsIGNvbnRlbnQuZGF0YU1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29udGVudC5udWxsTWVzc2FnZSkge1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVOdWxsTWVzc2FnZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb250ZW50LmNhbGxpbmdNZXNzYWdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZUNhbGxpbmdNZXNzYWdlKGVudmVsb3BlLCBjb250ZW50LmNhbGxpbmdNZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNvbnRlbnQucmVjZWlwdE1lc3NhZ2UpIHtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlUmVjZWlwdE1lc3NhZ2UoZW52ZWxvcGUsIGNvbnRlbnQucmVjZWlwdE1lc3NhZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29udGVudC50eXBpbmdNZXNzYWdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZVR5cGluZ01lc3NhZ2UoZW52ZWxvcGUsIGNvbnRlbnQudHlwaW5nTWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNTdG9yaWVzRW5hYmxlZCA9XG4gICAgICBpc0VuYWJsZWQoJ2Rlc2t0b3Auc3RvcmllcycpIHx8IGlzRW5hYmxlZCgnZGVza3RvcC5pbnRlcm5hbFVzZXInKTtcbiAgICBpZiAoY29udGVudC5zdG9yeU1lc3NhZ2UpIHtcbiAgICAgIGlmIChpc1N0b3JpZXNFbmFibGVkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlU3RvcnlNZXNzYWdlKGVudmVsb3BlLCBjb250ZW50LnN0b3J5TWVzc2FnZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgaW5uZXJIYW5kbGVDb250ZW50TWVzc2FnZS8ke2xvZ0lkfTogRHJvcHBpbmcgaW5jb21pbmcgbWVzc2FnZSB3aXRoIHN0b3J5TWVzc2FnZSBmaWVsZGBcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuXG4gICAgaWYgKEJ5dGVzLmlzRW1wdHkoY29udGVudC5zZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjb250ZW50IG1lc3NhZ2UnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZURlY3J5cHRpb25FcnJvcihcbiAgICBlbnZlbG9wZTogVW5zZWFsZWRFbnZlbG9wZSxcbiAgICBkZWNyeXB0aW9uRXJyb3I6IFVpbnQ4QXJyYXlcbiAgKSB7XG4gICAgY29uc3QgbG9nSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cuaW5mbyhgaGFuZGxlRGVjcnlwdGlvbkVycm9yOiAke2xvZ0lkfWApO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAncmV0cnlSZXF1ZXN0Jyk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShkZWNyeXB0aW9uRXJyb3IpO1xuICAgIGNvbnN0IHJlcXVlc3QgPSBEZWNyeXB0aW9uRXJyb3JNZXNzYWdlLmRlc2VyaWFsaXplKGJ1ZmZlcik7XG5cbiAgICBjb25zdCB7IHNvdXJjZVV1aWQsIHNvdXJjZURldmljZSB9ID0gZW52ZWxvcGU7XG4gICAgaWYgKCFzb3VyY2VVdWlkIHx8ICFzb3VyY2VEZXZpY2UpIHtcbiAgICAgIGxvZy5lcnJvcihgaGFuZGxlRGVjcnlwdGlvbkVycm9yLyR7bG9nSWR9OiBNaXNzaW5nIHV1aWQgb3IgZGV2aWNlIWApO1xuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFJldHJ5UmVxdWVzdEV2ZW50KFxuICAgICAge1xuICAgICAgICBncm91cElkOiBlbnZlbG9wZS5ncm91cElkLFxuICAgICAgICByZXF1ZXN0ZXJEZXZpY2U6IHNvdXJjZURldmljZSxcbiAgICAgICAgcmVxdWVzdGVyVXVpZDogc291cmNlVXVpZCxcbiAgICAgICAgcmF0Y2hldEtleTogcmVxdWVzdC5yYXRjaGV0S2V5KCksXG4gICAgICAgIHNlbmRlckRldmljZTogcmVxdWVzdC5kZXZpY2VJZCgpLFxuICAgICAgICBzZW50QXQ6IHJlcXVlc3QudGltZXN0YW1wKCksXG4gICAgICB9LFxuICAgICAgKCkgPT4gdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKFxuICAgIHN0b3JlczogTG9ja2VkU3RvcmVzLFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICBkaXN0cmlidXRpb25NZXNzYWdlOiBVaW50OEFycmF5XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGVudmVsb3BlSWQgPSBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKTtcbiAgICBsb2cuaW5mbyhgaGFuZGxlU2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZS8ke2VudmVsb3BlSWR9YCk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdzZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlJyk7XG5cbiAgICAvLyBOb3RlOiB3ZSBkb24ndCBjYWxsIHJlbW92ZUZyb21DYWNoZSBoZXJlIGJlY2F1c2UgdGhpcyBtZXNzYWdlIGNhbiBiZSBjb21iaW5lZFxuICAgIC8vICAgd2l0aCBhIGRhdGFNZXNzYWdlLCBmb3IgZXhhbXBsZS4gVGhhdCBwcm9jZXNzaW5nIHdpbGwgZGljdGF0ZSBjYWNoZSByZW1vdmFsLlxuXG4gICAgY29uc3QgaWRlbnRpZmllciA9IGVudmVsb3BlLnNvdXJjZVV1aWQ7XG4gICAgY29uc3QgeyBzb3VyY2VEZXZpY2UgfSA9IGVudmVsb3BlO1xuICAgIGlmICghaWRlbnRpZmllcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgaGFuZGxlU2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZTogTm8gaWRlbnRpZmllciBmb3IgZW52ZWxvcGUgJHtlbnZlbG9wZUlkfWBcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICghaXNOdW1iZXIoc291cmNlRGV2aWNlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgaGFuZGxlU2VuZGVyS2V5RGlzdHJpYnV0aW9uTWVzc2FnZTogTWlzc2luZyBzb3VyY2VEZXZpY2UgZm9yIGVudmVsb3BlICR7ZW52ZWxvcGVJZH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRlciA9IFByb3RvY29sQWRkcmVzcy5uZXcoaWRlbnRpZmllciwgc291cmNlRGV2aWNlKTtcbiAgICBjb25zdCBzZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlID1cbiAgICAgIFNlbmRlcktleURpc3RyaWJ1dGlvbk1lc3NhZ2UuZGVzZXJpYWxpemUoXG4gICAgICAgIEJ1ZmZlci5mcm9tKGRpc3RyaWJ1dGlvbk1lc3NhZ2UpXG4gICAgICApO1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb25VdWlkIH0gPSBlbnZlbG9wZTtcbiAgICBjb25zdCBhZGRyZXNzID0gbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICBkZXN0aW5hdGlvblV1aWQsXG4gICAgICBBZGRyZXNzLmNyZWF0ZShpZGVudGlmaWVyLCBzb3VyY2VEZXZpY2UpXG4gICAgKTtcblxuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wcm90b2NvbC5lbnF1ZXVlU2VuZGVyS2V5Sm9iKFxuICAgICAgYWRkcmVzcyxcbiAgICAgICgpID0+XG4gICAgICAgIHByb2Nlc3NTZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlKFxuICAgICAgICAgIHNlbmRlcixcbiAgICAgICAgICBzZW5kZXJLZXlEaXN0cmlidXRpb25NZXNzYWdlLFxuICAgICAgICAgIHN0b3Jlcy5zZW5kZXJLZXlTdG9yZVxuICAgICAgICApLFxuICAgICAgc3RvcmVzLnpvbmVcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVDYWxsaW5nTWVzc2FnZShcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgY2FsbGluZ01lc3NhZ2U6IFByb3RvLklDYWxsaW5nTWVzc2FnZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdjYWxsaW5nTWVzc2FnZScpO1xuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuU2VydmljZXMuY2FsbGluZy5oYW5kbGVDYWxsaW5nTWVzc2FnZShcbiAgICAgIGVudmVsb3BlLFxuICAgICAgY2FsbGluZ01lc3NhZ2VcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVSZWNlaXB0TWVzc2FnZShcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgcmVjZWlwdE1lc3NhZ2U6IFByb3RvLklSZWNlaXB0TWVzc2FnZVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBzdHJpY3RBc3NlcnQocmVjZWlwdE1lc3NhZ2UudGltZXN0YW1wLCAnUmVjZWlwdCBtZXNzYWdlIHdpdGhvdXQgdGltZXN0YW1wJyk7XG5cbiAgICBsZXQgRXZlbnRDbGFzczogdHlwZW9mIERlbGl2ZXJ5RXZlbnQgfCB0eXBlb2YgUmVhZEV2ZW50IHwgdHlwZW9mIFZpZXdFdmVudDtcbiAgICBsZXQgdHlwZTogU2VuZFR5cGVzVHlwZTtcbiAgICBzd2l0Y2ggKHJlY2VpcHRNZXNzYWdlLnR5cGUpIHtcbiAgICAgIGNhc2UgUHJvdG8uUmVjZWlwdE1lc3NhZ2UuVHlwZS5ERUxJVkVSWTpcbiAgICAgICAgRXZlbnRDbGFzcyA9IERlbGl2ZXJ5RXZlbnQ7XG4gICAgICAgIHR5cGUgPSAnZGVsaXZlcnlSZWNlaXB0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFByb3RvLlJlY2VpcHRNZXNzYWdlLlR5cGUuUkVBRDpcbiAgICAgICAgRXZlbnRDbGFzcyA9IFJlYWRFdmVudDtcbiAgICAgICAgdHlwZSA9ICdyZWFkUmVjZWlwdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQcm90by5SZWNlaXB0TWVzc2FnZS5UeXBlLlZJRVdFRDpcbiAgICAgICAgRXZlbnRDbGFzcyA9IFZpZXdFdmVudDtcbiAgICAgICAgdHlwZSA9ICd2aWV3ZWRSZWNlaXB0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgd2UgZ2V0IGEgcmVjZWlwdCB0eXBlIHdlIGRvbid0IGtub3cgYWJvdXQgeWV0LCB3aGljaFxuICAgICAgICAvLyAgIGlzIHRvdGFsbHkgZmluZS5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgdHlwZSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHJlY2VpcHRNZXNzYWdlLnRpbWVzdGFtcC5tYXAoYXN5bmMgcmF3VGltZXN0YW1wID0+IHtcbiAgICAgICAgY29uc3QgZXYgPSBuZXcgRXZlbnRDbGFzcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aW1lc3RhbXA6IHJhd1RpbWVzdGFtcD8udG9OdW1iZXIoKSxcbiAgICAgICAgICAgIGVudmVsb3BlVGltZXN0YW1wOiBlbnZlbG9wZS50aW1lc3RhbXAsXG4gICAgICAgICAgICBzb3VyY2U6IGVudmVsb3BlLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZVV1aWQ6IGVudmVsb3BlLnNvdXJjZVV1aWQsXG4gICAgICAgICAgICBzb3VyY2VEZXZpY2U6IGVudmVsb3BlLnNvdXJjZURldmljZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlVHlwaW5nTWVzc2FnZShcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgdHlwaW5nTWVzc2FnZTogUHJvdG8uSVR5cGluZ01lc3NhZ2VcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAndHlwaW5nJyk7XG5cbiAgICBpZiAoZW52ZWxvcGUudGltZXN0YW1wICYmIHR5cGluZ01lc3NhZ2UudGltZXN0YW1wKSB7XG4gICAgICBjb25zdCBlbnZlbG9wZVRpbWVzdGFtcCA9IGVudmVsb3BlLnRpbWVzdGFtcDtcbiAgICAgIGNvbnN0IHR5cGluZ1RpbWVzdGFtcCA9IHR5cGluZ01lc3NhZ2UudGltZXN0YW1wPy50b051bWJlcigpO1xuXG4gICAgICBpZiAodHlwaW5nVGltZXN0YW1wICE9PSBlbnZlbG9wZVRpbWVzdGFtcCkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICBgVHlwaW5nIG1lc3NhZ2UgZW52ZWxvcGUgdGltZXN0YW1wICgke2VudmVsb3BlVGltZXN0YW1wfSkgZGlkIG5vdCBtYXRjaCB0eXBpbmcgdGltZXN0YW1wICgke3R5cGluZ1RpbWVzdGFtcH0pYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgZW52ZWxvcGUuc291cmNlRGV2aWNlICE9PSB1bmRlZmluZWQsXG4gICAgICAnVHlwaW5nTWVzc2FnZSByZXF1aXJlcyBzb3VyY2VEZXZpY2UgaW4gdGhlIGVudmVsb3BlJ1xuICAgICk7XG5cbiAgICBjb25zdCB7IGdyb3VwSWQsIHRpbWVzdGFtcCwgYWN0aW9uIH0gPSB0eXBpbmdNZXNzYWdlO1xuXG4gICAgbGV0IGdyb3VwSWRTdHJpbmc6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgZ3JvdXBWMklkU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGdyb3VwSWQgJiYgZ3JvdXBJZC5ieXRlTGVuZ3RoID4gMCkge1xuICAgICAgaWYgKGdyb3VwSWQuYnl0ZUxlbmd0aCA9PT0gR1JPVVBWMV9JRF9MRU5HVEgpIHtcbiAgICAgICAgZ3JvdXBJZFN0cmluZyA9IEJ5dGVzLnRvQmluYXJ5KGdyb3VwSWQpO1xuICAgICAgICBncm91cFYySWRTdHJpbmcgPSB0aGlzLmRlcml2ZUdyb3VwVjJGcm9tVjEoZ3JvdXBJZCk7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwSWQuYnl0ZUxlbmd0aCA9PT0gR1JPVVBWMl9JRF9MRU5HVEgpIHtcbiAgICAgICAgZ3JvdXBWMklkU3RyaW5nID0gQnl0ZXMudG9CYXNlNjQoZ3JvdXBJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cuZXJyb3IoJ2hhbmRsZVR5cGluZ01lc3NhZ2U6IFJlY2VpdmVkIGludmFsaWQgZ3JvdXBJZCB2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBUeXBpbmdFdmVudCh7XG4gICAgICAgIHNlbmRlcjogZW52ZWxvcGUuc291cmNlLFxuICAgICAgICBzZW5kZXJVdWlkOiBlbnZlbG9wZS5zb3VyY2VVdWlkLFxuICAgICAgICBzZW5kZXJEZXZpY2U6IGVudmVsb3BlLnNvdXJjZURldmljZSxcbiAgICAgICAgdHlwaW5nOiB7XG4gICAgICAgICAgdHlwaW5nTWVzc2FnZSxcbiAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcD8udG9OdW1iZXIoKSA/PyBEYXRlLm5vdygpLFxuICAgICAgICAgIHN0YXJ0ZWQ6IGFjdGlvbiA9PT0gUHJvdG8uVHlwaW5nTWVzc2FnZS5BY3Rpb24uU1RBUlRFRCxcbiAgICAgICAgICBzdG9wcGVkOiBhY3Rpb24gPT09IFByb3RvLlR5cGluZ01lc3NhZ2UuQWN0aW9uLlNUT1BQRUQsXG5cbiAgICAgICAgICBncm91cElkOiBncm91cElkU3RyaW5nLFxuICAgICAgICAgIGdyb3VwVjJJZDogZ3JvdXBWMklkU3RyaW5nLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVOdWxsTWVzc2FnZShlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUpOiB2b2lkIHtcbiAgICBsb2cuaW5mbygnTWVzc2FnZVJlY2VpdmVyLmhhbmRsZU51bGxNZXNzYWdlJywgZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSkpO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAnbnVsbE1lc3NhZ2UnKTtcblxuICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlKGVudmVsb3BlKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNJbnZhbGlkR3JvdXBEYXRhKFxuICAgIG1lc3NhZ2U6IFByb3RvLklEYXRhTWVzc2FnZSxcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGVcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBncm91cCwgZ3JvdXBWMiB9ID0gbWVzc2FnZTtcblxuICAgIGlmIChncm91cCkge1xuICAgICAgY29uc3QgeyBpZCB9ID0gZ3JvdXA7XG4gICAgICBzdHJpY3RBc3NlcnQoaWQsICdHcm91cCBkYXRhIGhhcyBubyBpZCcpO1xuICAgICAgY29uc3QgaXNJbnZhbGlkID0gaWQuYnl0ZUxlbmd0aCAhPT0gR1JPVVBWMV9JRF9MRU5HVEg7XG5cbiAgICAgIGlmIChpc0ludmFsaWQpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ2lzSW52YWxpZEdyb3VwRGF0YTogaW52YWxpZCBHcm91cFYxIG1lc3NhZ2UgZnJvbScsXG4gICAgICAgICAgZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzSW52YWxpZDtcbiAgICB9XG5cbiAgICBpZiAoZ3JvdXBWMikge1xuICAgICAgY29uc3QgeyBtYXN0ZXJLZXkgfSA9IGdyb3VwVjI7XG4gICAgICBzdHJpY3RBc3NlcnQobWFzdGVyS2V5LCAnR3JvdXAgdjIgZGF0YSBoYXMgbm8gbWFzdGVyS2V5Jyk7XG4gICAgICBjb25zdCBpc0ludmFsaWQgPSBtYXN0ZXJLZXkuYnl0ZUxlbmd0aCAhPT0gTUFTVEVSX0tFWV9MRU5HVEg7XG5cbiAgICAgIGlmIChpc0ludmFsaWQpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ2lzSW52YWxpZEdyb3VwRGF0YTogaW52YWxpZCBHcm91cFYyIG1lc3NhZ2UgZnJvbScsXG4gICAgICAgICAgZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpc0ludmFsaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXJpdmVHcm91cFYyRnJvbVYxKGdyb3VwSWQ6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICAgIGlmIChncm91cElkLmJ5dGVMZW5ndGggIT09IEdST1VQVjFfSURfTEVOR1RIKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBkZXJpdmVHcm91cFYyRnJvbVYxOiBoYWQgaWQgd2l0aCB3cm9uZyBieXRlTGVuZ3RoOiAke2dyb3VwSWQuYnl0ZUxlbmd0aH1gXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBtYXN0ZXJLZXkgPSBkZXJpdmVNYXN0ZXJLZXlGcm9tR3JvdXBWMShncm91cElkKTtcbiAgICBjb25zdCBkYXRhID0gZGVyaXZlR3JvdXBGaWVsZHMobWFzdGVyS2V5KTtcblxuICAgIHJldHVybiBCeXRlcy50b0Jhc2U2NChkYXRhLmlkKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2hlY2tHcm91cFYxRGF0YShcbiAgICBtZXNzYWdlOiBSZWFkb25seTxQcm90by5JRGF0YU1lc3NhZ2U+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgZ3JvdXAgfSA9IG1lc3NhZ2U7XG5cbiAgICBpZiAoIWdyb3VwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFncm91cC5pZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkZXJpdmVHcm91cFYxRGF0YTogaGFkIGZhbHNleSBpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgaWQgfSA9IGdyb3VwO1xuICAgIGlmIChpZC5ieXRlTGVuZ3RoICE9PSBHUk9VUFYxX0lEX0xFTkdUSCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZGVyaXZlR3JvdXBWMURhdGE6IGhhZCBpZCB3aXRoIHdyb25nIGJ5dGVMZW5ndGg6ICR7aWQuYnl0ZUxlbmd0aH1gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJvY2Vzc2VkR3JvdXBJZChcbiAgICBtZXNzYWdlOiBQcm9jZXNzZWREYXRhTWVzc2FnZVxuICApOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGlmIChtZXNzYWdlLmdyb3VwVjIpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlLmdyb3VwVjIuaWQ7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLmdyb3VwICYmIG1lc3NhZ2UuZ3JvdXAuaWQpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlLmdyb3VwLmlkO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcm91cElkKG1lc3NhZ2U6IFByb3RvLklEYXRhTWVzc2FnZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKG1lc3NhZ2UuZ3JvdXBWMikge1xuICAgICAgc3RyaWN0QXNzZXJ0KG1lc3NhZ2UuZ3JvdXBWMi5tYXN0ZXJLZXksICdNaXNzaW5nIGdyb3VwVjIubWFzdGVyS2V5Jyk7XG4gICAgICBjb25zdCB7IGlkIH0gPSBkZXJpdmVHcm91cEZpZWxkcyhtZXNzYWdlLmdyb3VwVjIubWFzdGVyS2V5KTtcbiAgICAgIHJldHVybiBCeXRlcy50b0Jhc2U2NChpZCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLmdyb3VwICYmIG1lc3NhZ2UuZ3JvdXAuaWQpIHtcbiAgICAgIHJldHVybiBCeXRlcy50b0JpbmFyeShtZXNzYWdlLmdyb3VwLmlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZXN0aW5hdGlvbihzZW50TWVzc2FnZTogUHJvdG8uU3luY01lc3NhZ2UuSVNlbnQpIHtcbiAgICBpZiAoc2VudE1lc3NhZ2UubWVzc2FnZSAmJiBzZW50TWVzc2FnZS5tZXNzYWdlLmdyb3VwVjIpIHtcbiAgICAgIHJldHVybiBgZ3JvdXB2Migke3RoaXMuZ2V0R3JvdXBJZChzZW50TWVzc2FnZS5tZXNzYWdlKX0pYDtcbiAgICB9XG4gICAgaWYgKHNlbnRNZXNzYWdlLm1lc3NhZ2UgJiYgc2VudE1lc3NhZ2UubWVzc2FnZS5ncm91cCkge1xuICAgICAgc3RyaWN0QXNzZXJ0KHNlbnRNZXNzYWdlLm1lc3NhZ2UuZ3JvdXAuaWQsICdncm91cCB3aXRob3V0IGlkJyk7XG4gICAgICByZXR1cm4gYGdyb3VwKCR7dGhpcy5nZXRHcm91cElkKHNlbnRNZXNzYWdlLm1lc3NhZ2UpfSlgO1xuICAgIH1cbiAgICByZXR1cm4gc2VudE1lc3NhZ2UuZGVzdGluYXRpb24gfHwgc2VudE1lc3NhZ2UuZGVzdGluYXRpb25VdWlkO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTeW5jTWVzc2FnZShcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgc3luY01lc3NhZ2U6IFByb2Nlc3NlZFN5bmNNZXNzYWdlXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG91ck51bWJlciA9IHRoaXMuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IG91clV1aWQgPSB0aGlzLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuXG4gICAgY29uc3QgZnJvbVNlbGZTb3VyY2UgPSBlbnZlbG9wZS5zb3VyY2UgJiYgZW52ZWxvcGUuc291cmNlID09PSBvdXJOdW1iZXI7XG4gICAgY29uc3QgZnJvbVNlbGZTb3VyY2VVdWlkID1cbiAgICAgIGVudmVsb3BlLnNvdXJjZVV1aWQgJiYgZW52ZWxvcGUuc291cmNlVXVpZCA9PT0gb3VyVXVpZC50b1N0cmluZygpO1xuICAgIGlmICghZnJvbVNlbGZTb3VyY2UgJiYgIWZyb21TZWxmU291cmNlVXVpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWNlaXZlZCBzeW5jIG1lc3NhZ2UgZnJvbSBhbm90aGVyIG51bWJlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IG91ckRldmljZUlkID0gdGhpcy5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKGVudmVsb3BlLnNvdXJjZURldmljZSA9PSBvdXJEZXZpY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWNlaXZlZCBzeW5jIG1lc3NhZ2UgZnJvbSBvdXIgb3duIGRldmljZScpO1xuICAgIH1cbiAgICBpZiAoc3luY01lc3NhZ2UucG5pSWRlbnRpdHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN5bmNNZXNzYWdlLnNlbnQpIHtcbiAgICAgIGNvbnN0IHNlbnRNZXNzYWdlID0gc3luY01lc3NhZ2Uuc2VudDtcblxuICAgICAgaWYgKHNlbnRNZXNzYWdlLnN0b3J5TWVzc2FnZSkge1xuICAgICAgICB0aGlzLmhhbmRsZVN0b3J5TWVzc2FnZShcbiAgICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgICBzZW50TWVzc2FnZS5zdG9yeU1lc3NhZ2UsXG4gICAgICAgICAgc2VudE1lc3NhZ2VcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VudE1lc3NhZ2Uuc3RvcnlNZXNzYWdlUmVjaXBpZW50cyAmJiBzZW50TWVzc2FnZS5pc1JlY2lwaWVudFVwZGF0ZSkge1xuICAgICAgICBpZiAoIXdpbmRvdy5FdmVudHMuZ2V0SGFzU3Rvcmllc0VuYWJsZWQoKSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVTeW5jTWVzc2FnZTogZHJvcHBpbmcgc3RvcnkgcmVjaXBpZW50cyB1cGRhdGUnXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVTeW5jTWVzc2FnZTogaGFuZGxpbmcgc3RvcnlNZXNzYWdlUmVjaXBpZW50cyBpc1JlY2lwaWVudFVwZGF0ZSBzeW5jIG1lc3NhZ2UnLFxuICAgICAgICAgIGdldEVudmVsb3BlSWQoZW52ZWxvcGUpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGV2ID0gbmV3IFN0b3J5UmVjaXBpZW50VXBkYXRlRXZlbnQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVzdGluYXRpb25VdWlkOiBlbnZlbG9wZS5kZXN0aW5hdGlvblV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogZW52ZWxvcGUudGltZXN0YW1wLFxuICAgICAgICAgICAgc3RvcnlNZXNzYWdlUmVjaXBpZW50czogc2VudE1lc3NhZ2Uuc3RvcnlNZXNzYWdlUmVjaXBpZW50cyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoQW5kV2FpdChldik7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2VudE1lc3NhZ2UgfHwgIXNlbnRNZXNzYWdlLm1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlU3luY01lc3NhZ2U6IHN5bmMgc2VudCBtZXNzYWdlIHdhcyBtaXNzaW5nIG1lc3NhZ2UnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzSW52YWxpZEdyb3VwRGF0YShzZW50TWVzc2FnZS5tZXNzYWdlLCBlbnZlbG9wZSkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuY2hlY2tHcm91cFYxRGF0YShzZW50TWVzc2FnZS5tZXNzYWdlKTtcblxuICAgICAgc3RyaWN0QXNzZXJ0KHNlbnRNZXNzYWdlLnRpbWVzdGFtcCwgJ3NlbnQgbWVzc2FnZSB3aXRob3V0IHRpbWVzdGFtcCcpO1xuXG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ3NlbnQgbWVzc2FnZSB0bycsXG4gICAgICAgIHRoaXMuZ2V0RGVzdGluYXRpb24oc2VudE1lc3NhZ2UpLFxuICAgICAgICBzZW50TWVzc2FnZS50aW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gICAgICAgICdmcm9tJyxcbiAgICAgICAgZ2V0RW52ZWxvcGVJZChlbnZlbG9wZSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTZW50TWVzc2FnZShlbnZlbG9wZSwgc2VudE1lc3NhZ2UpO1xuICAgIH1cbiAgICBpZiAoc3luY01lc3NhZ2UuY29udGFjdHMpIHtcbiAgICAgIHRoaXMuaGFuZGxlQ29udGFjdHMoZW52ZWxvcGUsIHN5bmNNZXNzYWdlLmNvbnRhY3RzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN5bmNNZXNzYWdlLmdyb3Vwcykge1xuICAgICAgdGhpcy5oYW5kbGVHcm91cHMoZW52ZWxvcGUsIHN5bmNNZXNzYWdlLmdyb3Vwcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzeW5jTWVzc2FnZS5ibG9ja2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVCbG9ja2VkKGVudmVsb3BlLCBzeW5jTWVzc2FnZS5ibG9ja2VkKTtcbiAgICB9XG4gICAgaWYgKHN5bmNNZXNzYWdlLnJlcXVlc3QpIHtcbiAgICAgIGxvZy5pbmZvKCdHb3QgU3luY01lc3NhZ2UgUmVxdWVzdCcpO1xuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3luY01lc3NhZ2UucmVhZCAmJiBzeW5jTWVzc2FnZS5yZWFkLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVhZChlbnZlbG9wZSwgc3luY01lc3NhZ2UucmVhZCk7XG4gICAgfVxuICAgIGlmIChzeW5jTWVzc2FnZS52ZXJpZmllZCkge1xuICAgICAgbG9nLmluZm8oJ0dvdCB2ZXJpZmllZCBzeW5jIG1lc3NhZ2UsIGRyb3BwaW5nJyk7XG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZShlbnZlbG9wZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzeW5jTWVzc2FnZS5jb25maWd1cmF0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVDb25maWd1cmF0aW9uKGVudmVsb3BlLCBzeW5jTWVzc2FnZS5jb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgc3luY01lc3NhZ2Uuc3RpY2tlclBhY2tPcGVyYXRpb24gJiZcbiAgICAgIHN5bmNNZXNzYWdlLnN0aWNrZXJQYWNrT3BlcmF0aW9uLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVN0aWNrZXJQYWNrT3BlcmF0aW9uKFxuICAgICAgICBlbnZlbG9wZSxcbiAgICAgICAgc3luY01lc3NhZ2Uuc3RpY2tlclBhY2tPcGVyYXRpb25cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChzeW5jTWVzc2FnZS52aWV3T25jZU9wZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVZpZXdPbmNlT3BlbihlbnZlbG9wZSwgc3luY01lc3NhZ2Uudmlld09uY2VPcGVuKTtcbiAgICB9XG4gICAgaWYgKHN5bmNNZXNzYWdlLm1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoXG4gICAgICAgIGVudmVsb3BlLFxuICAgICAgICBzeW5jTWVzc2FnZS5tZXNzYWdlUmVxdWVzdFJlc3BvbnNlXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc3luY01lc3NhZ2UuZmV0Y2hMYXRlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoTGF0ZXN0KGVudmVsb3BlLCBzeW5jTWVzc2FnZS5mZXRjaExhdGVzdCk7XG4gICAgfVxuICAgIGlmIChzeW5jTWVzc2FnZS5rZXlzKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVLZXlzKGVudmVsb3BlLCBzeW5jTWVzc2FnZS5rZXlzKTtcbiAgICB9XG4gICAgaWYgKHN5bmNNZXNzYWdlLnZpZXdlZCAmJiBzeW5jTWVzc2FnZS52aWV3ZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVWaWV3ZWQoZW52ZWxvcGUsIHN5bmNNZXNzYWdlLnZpZXdlZCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgIGxvZy53YXJuKFxuICAgICAgYGhhbmRsZVN5bmNNZXNzYWdlLyR7Z2V0RW52ZWxvcGVJZChlbnZlbG9wZSl9OiBHb3QgZW1wdHkgU3luY01lc3NhZ2VgXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29uZmlndXJhdGlvbihcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgY29uZmlndXJhdGlvbjogUHJvdG8uU3luY01lc3NhZ2UuSUNvbmZpZ3VyYXRpb25cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ2dvdCBjb25maWd1cmF0aW9uIHN5bmMgbWVzc2FnZScpO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAnY29uZmlndXJhdGlvblN5bmMnKTtcblxuICAgIGNvbnN0IGV2ID0gbmV3IENvbmZpZ3VyYXRpb25FdmVudChcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZS5iaW5kKHRoaXMsIGVudmVsb3BlKVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlVmlld09uY2VPcGVuKFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICBzeW5jOiBQcm90by5TeW5jTWVzc2FnZS5JVmlld09uY2VPcGVuXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdnb3QgdmlldyBvbmNlIG9wZW4gc3luYyBtZXNzYWdlJyk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICd2aWV3T25jZVN5bmMnKTtcblxuICAgIGNvbnN0IGV2ID0gbmV3IFZpZXdPbmNlT3BlblN5bmNFdmVudChcbiAgICAgIHtcbiAgICAgICAgc291cmNlOiBkcm9wTnVsbChzeW5jLnNlbmRlciksXG4gICAgICAgIHNvdXJjZVV1aWQ6IHN5bmMuc2VuZGVyVXVpZFxuICAgICAgICAgID8gbm9ybWFsaXplVXVpZChzeW5jLnNlbmRlclV1aWQsICdoYW5kbGVWaWV3T25jZU9wZW4uc2VuZGVyVXVpZCcpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIHRpbWVzdGFtcDogc3luYy50aW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gICAgICB9LFxuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlTWVzc2FnZVJlcXVlc3RSZXNwb25zZShcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgc3luYzogUHJvdG8uU3luY01lc3NhZ2UuSU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ2dvdCBtZXNzYWdlIHJlcXVlc3QgcmVzcG9uc2Ugc3luYyBtZXNzYWdlJyk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdtZXNzYWdlUmVxdWVzdFN5bmMnKTtcblxuICAgIGNvbnN0IHsgZ3JvdXBJZCB9ID0gc3luYztcblxuICAgIGxldCBncm91cElkU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgbGV0IGdyb3VwVjJJZFN0cmluZzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmIChncm91cElkICYmIGdyb3VwSWQuYnl0ZUxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChncm91cElkLmJ5dGVMZW5ndGggPT09IEdST1VQVjFfSURfTEVOR1RIKSB7XG4gICAgICAgIGdyb3VwSWRTdHJpbmcgPSBCeXRlcy50b0JpbmFyeShncm91cElkKTtcbiAgICAgICAgZ3JvdXBWMklkU3RyaW5nID0gdGhpcy5kZXJpdmVHcm91cFYyRnJvbVYxKGdyb3VwSWQpO1xuICAgICAgfSBlbHNlIGlmIChncm91cElkLmJ5dGVMZW5ndGggPT09IEdST1VQVjJfSURfTEVOR1RIKSB7XG4gICAgICAgIGdyb3VwVjJJZFN0cmluZyA9IEJ5dGVzLnRvQmFzZTY0KGdyb3VwSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuICAgICAgICBsb2cuZXJyb3IoJ1JlY2VpdmVkIG1lc3NhZ2UgcmVxdWVzdCB3aXRoIGludmFsaWQgZ3JvdXBJZCcpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGV2ID0gbmV3IE1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VFdmVudChcbiAgICAgIHtcbiAgICAgICAgdGhyZWFkRTE2NDogZHJvcE51bGwoc3luYy50aHJlYWRFMTY0KSxcbiAgICAgICAgdGhyZWFkVXVpZDogc3luYy50aHJlYWRVdWlkXG4gICAgICAgICAgPyBub3JtYWxpemVVdWlkKFxuICAgICAgICAgICAgICBzeW5jLnRocmVhZFV1aWQsXG4gICAgICAgICAgICAgICdoYW5kbGVNZXNzYWdlUmVxdWVzdFJlc3BvbnNlLnRocmVhZFV1aWQnXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIG1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlOiBzeW5jLnR5cGUsXG4gICAgICAgIGdyb3VwSWQ6IGdyb3VwSWRTdHJpbmcsXG4gICAgICAgIGdyb3VwVjJJZDogZ3JvdXBWMklkU3RyaW5nLFxuICAgICAgfSxcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoQW5kV2FpdChldik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUZldGNoTGF0ZXN0KFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICBzeW5jOiBQcm90by5TeW5jTWVzc2FnZS5JRmV0Y2hMYXRlc3RcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ2dvdCBmZXRjaCBsYXRlc3Qgc3luYyBtZXNzYWdlJyk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdmZXRjaExhdGVzdE1hbmlmZXN0U3luYycpO1xuXG4gICAgY29uc3QgZXYgPSBuZXcgRmV0Y2hMYXRlc3RFdmVudChcbiAgICAgIHN5bmMudHlwZSxcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoQW5kV2FpdChldik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUtleXMoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIHN5bmM6IFByb3RvLlN5bmNNZXNzYWdlLklLZXlzXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdnb3Qga2V5cyBzeW5jIG1lc3NhZ2UnKTtcblxuICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgJ2tleVN5bmMnKTtcblxuICAgIGlmICghc3luYy5zdG9yYWdlU2VydmljZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBldiA9IG5ldyBLZXlzRXZlbnQoXG4gICAgICBzeW5jLnN0b3JhZ2VTZXJ2aWNlLFxuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIC8vIFJ1bnMgb24gVGFza1R5cGUuRW5jcnlwdGVkIHF1ZXVlXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlUE5JSWRlbnRpdHkoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIHsgcHVibGljS2V5LCBwcml2YXRlS2V5IH06IFByb3RvLlN5bmNNZXNzYWdlLklQbmlJZGVudGl0eVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygnTWVzc2FnZVJlY2VpdmVyOiBnb3QgcG5pIGlkZW50aXR5IHN5bmMgbWVzc2FnZScpO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAncG5pSWRlbnRpdHlTeW5jJyk7XG5cbiAgICBpZiAoIXB1YmxpY0tleSB8fCAhcHJpdmF0ZUtleSkge1xuICAgICAgbG9nLndhcm4oJ01lc3NhZ2VSZWNlaXZlcjogZW1wdHkgcG5pIGlkZW50aXR5IHN5bmMgbWVzc2FnZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hbmFnZXIgPSB3aW5kb3cuZ2V0QWNjb3VudE1hbmFnZXIoKTtcbiAgICBhd2FpdCBtYW5hZ2VyLnVwZGF0ZVBOSUlkZW50aXR5KHsgcHJpdktleTogcHJpdmF0ZUtleSwgcHViS2V5OiBwdWJsaWNLZXkgfSk7XG4gIH1cblxuICAvLyBSdW5zIG9uIFRhc2tUeXBlLkVuY3J5cHRlZCBxdWV1ZVxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVBOSUNoYW5nZU51bWJlcihcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAge1xuICAgICAgaWRlbnRpdHlLZXlQYWlyLFxuICAgICAgc2lnbmVkUHJlS2V5LFxuICAgICAgcmVnaXN0cmF0aW9uSWQsXG4gICAgfTogUHJvdG8uU3luY01lc3NhZ2UuSVBuaUNoYW5nZU51bWJlclxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygnTWVzc2FnZVJlY2VpdmVyOiBnb3QgcG5pIGNoYW5nZSBudW1iZXIgc3luYyBtZXNzYWdlJyk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdwbmlJZGVudGl0eVN5bmMnKTtcblxuICAgIGNvbnN0IHsgdXBkYXRlZFBuaSB9ID0gZW52ZWxvcGU7XG4gICAgaWYgKCF1cGRhdGVkUG5pKSB7XG4gICAgICBsb2cud2FybignTWVzc2FnZVJlY2VpdmVyOiBtaXNzaW5nIHBuaSBpbiBjaGFuZ2UgbnVtYmVyIHN5bmMgbWVzc2FnZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFCeXRlcy5pc05vdEVtcHR5KGlkZW50aXR5S2V5UGFpcikgfHxcbiAgICAgICFCeXRlcy5pc05vdEVtcHR5KHNpZ25lZFByZUtleSkgfHxcbiAgICAgICFpc051bWJlcihyZWdpc3RyYXRpb25JZClcbiAgICApIHtcbiAgICAgIGxvZy53YXJuKCdNZXNzYWdlUmVjZWl2ZXI6IGVtcHR5IHBuaSBjaGFuZ2UgbnVtYmVyIHN5bmMgbWVzc2FnZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hbmFnZXIgPSB3aW5kb3cuZ2V0QWNjb3VudE1hbmFnZXIoKTtcbiAgICBhd2FpdCBtYW5hZ2VyLnNldFBuaSh1cGRhdGVkUG5pLnRvU3RyaW5nKCksIHtcbiAgICAgIGlkZW50aXR5S2V5UGFpcixcbiAgICAgIHNpZ25lZFByZUtleSxcbiAgICAgIHJlZ2lzdHJhdGlvbklkLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdGlja2VyUGFja09wZXJhdGlvbihcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgb3BlcmF0aW9uczogQXJyYXk8UHJvdG8uU3luY01lc3NhZ2UuSVN0aWNrZXJQYWNrT3BlcmF0aW9uPlxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBFTlVNID0gUHJvdG8uU3luY01lc3NhZ2UuU3RpY2tlclBhY2tPcGVyYXRpb24uVHlwZTtcbiAgICBsb2cuaW5mbygnZ290IHN0aWNrZXIgcGFjayBvcGVyYXRpb24gc3luYyBtZXNzYWdlJyk7XG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAnc3RpY2tlclBhY2tTeW5jJyk7XG5cbiAgICBjb25zdCBzdGlja2VyUGFja3MgPSBvcGVyYXRpb25zLm1hcChvcGVyYXRpb24gPT4gKHtcbiAgICAgIGlkOiBvcGVyYXRpb24ucGFja0lkID8gQnl0ZXMudG9IZXgob3BlcmF0aW9uLnBhY2tJZCkgOiB1bmRlZmluZWQsXG4gICAgICBrZXk6IG9wZXJhdGlvbi5wYWNrS2V5ID8gQnl0ZXMudG9CYXNlNjQob3BlcmF0aW9uLnBhY2tLZXkpIDogdW5kZWZpbmVkLFxuICAgICAgaXNJbnN0YWxsOiBvcGVyYXRpb24udHlwZSA9PT0gRU5VTS5JTlNUQUxMLFxuICAgICAgaXNSZW1vdmU6IG9wZXJhdGlvbi50eXBlID09PSBFTlVNLlJFTU9WRSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBldiA9IG5ldyBTdGlja2VyUGFja0V2ZW50KFxuICAgICAgc3RpY2tlclBhY2tzLFxuICAgICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUuYmluZCh0aGlzLCBlbnZlbG9wZSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlUmVhZChcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgcmVhZDogQXJyYXk8UHJvdG8uU3luY01lc3NhZ2UuSVJlYWQ+XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlUmVhZCcsIGdldEVudmVsb3BlSWQoZW52ZWxvcGUpKTtcblxuICAgIGxvZ1VuZXhwZWN0ZWRVcmdlbnRWYWx1ZShlbnZlbG9wZSwgJ3JlYWRTeW5jJyk7XG5cbiAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgZm9yIChjb25zdCB7IHRpbWVzdGFtcCwgc2VuZGVyLCBzZW5kZXJVdWlkIH0gb2YgcmVhZCkge1xuICAgICAgY29uc3QgZXYgPSBuZXcgUmVhZFN5bmNFdmVudChcbiAgICAgICAge1xuICAgICAgICAgIGVudmVsb3BlVGltZXN0YW1wOiBlbnZlbG9wZS50aW1lc3RhbXAsXG4gICAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXA/LnRvTnVtYmVyKCksXG4gICAgICAgICAgc2VuZGVyOiBkcm9wTnVsbChzZW5kZXIpLFxuICAgICAgICAgIHNlbmRlclV1aWQ6IHNlbmRlclV1aWRcbiAgICAgICAgICAgID8gbm9ybWFsaXplVXVpZChzZW5kZXJVdWlkLCAnaGFuZGxlUmVhZC5zZW5kZXJVdWlkJylcbiAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgICB0aGlzLnJlbW92ZUZyb21DYWNoZS5iaW5kKHRoaXMsIGVudmVsb3BlKVxuICAgICAgKTtcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmRpc3BhdGNoQW5kV2FpdChldikpO1xuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChyZXN1bHRzKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlVmlld2VkKFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICB2aWV3ZWQ6IFJlYWRvbmx5QXJyYXk8UHJvdG8uU3luY01lc3NhZ2UuSVZpZXdlZD5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ01lc3NhZ2VSZWNlaXZlci5oYW5kbGVWaWV3ZWQnLCBnZXRFbnZlbG9wZUlkKGVudmVsb3BlKSk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICd2aWV3U3luYycpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICB2aWV3ZWQubWFwKGFzeW5jICh7IHRpbWVzdGFtcCwgc2VuZGVyRTE2NCwgc2VuZGVyVXVpZCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ID0gbmV3IFZpZXdTeW5jRXZlbnQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgZW52ZWxvcGVUaW1lc3RhbXA6IGVudmVsb3BlLnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wPy50b051bWJlcigpLFxuICAgICAgICAgICAgc2VuZGVyRTE2NDogZHJvcE51bGwoc2VuZGVyRTE2NCksXG4gICAgICAgICAgICBzZW5kZXJVdWlkOiBzZW5kZXJVdWlkXG4gICAgICAgICAgICAgID8gbm9ybWFsaXplVXVpZChzZW5kZXJVdWlkLCAnaGFuZGxlVmlld2VkLnNlbmRlclV1aWQnKVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRoaXMucmVtb3ZlRnJvbUNhY2hlLmJpbmQodGhpcywgZW52ZWxvcGUpXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29udGFjdHMoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIGNvbnRhY3RzOiBQcm90by5TeW5jTWVzc2FnZS5JQ29udGFjdHNcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oYE1lc3NhZ2VSZWNlaXZlcjogaGFuZGxlQ29udGFjdHMgJHtnZXRFbnZlbG9wZUlkKGVudmVsb3BlKX1gKTtcbiAgICBjb25zdCB7IGJsb2IgfSA9IGNvbnRhY3RzO1xuICAgIGlmICghYmxvYikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlUmVjZWl2ZXIuaGFuZGxlQ29udGFjdHM6IGJsb2IgZmllbGQgd2FzIG1pc3NpbmcnKTtcbiAgICB9XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdjb250YWN0U3luYycpO1xuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuXG4gICAgLy8gTm90ZTogd2UgZG8gbm90IHJldHVybiBoZXJlIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBibG9jayB0aGUgbmV4dCBtZXNzYWdlIG9uXG4gICAgLy8gICB0aGlzIGF0dGFjaG1lbnQgZG93bmxvYWQgYW5kIGEgbG90IG9mIHByb2Nlc3Npbmcgb2YgdGhhdCBhdHRhY2htZW50LlxuICAgIGNvbnN0IGF0dGFjaG1lbnRQb2ludGVyID0gYXdhaXQgdGhpcy5oYW5kbGVBdHRhY2htZW50KGJsb2IpO1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBjb25zdCBjb250YWN0QnVmZmVyID0gbmV3IENvbnRhY3RCdWZmZXIoYXR0YWNobWVudFBvaW50ZXIuZGF0YSk7XG4gICAgbGV0IGNvbnRhY3REZXRhaWxzID0gY29udGFjdEJ1ZmZlci5uZXh0KCk7XG4gICAgd2hpbGUgKGNvbnRhY3REZXRhaWxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGNvbnRhY3RFdmVudCA9IG5ldyBDb250YWN0RXZlbnQoXG4gICAgICAgIGNvbnRhY3REZXRhaWxzLFxuICAgICAgICBlbnZlbG9wZS5yZWNlaXZlZEF0Q291bnRlclxuICAgICAgKTtcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmRpc3BhdGNoQW5kV2FpdChjb250YWN0RXZlbnQpKTtcblxuICAgICAgY29udGFjdERldGFpbHMgPSBjb250YWN0QnVmZmVyLm5leHQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChyZXN1bHRzKTtcblxuICAgIGNvbnN0IGZpbmFsRXZlbnQgPSBuZXcgQ29udGFjdFN5bmNFdmVudCgpO1xuICAgIGF3YWl0IHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGZpbmFsRXZlbnQpO1xuXG4gICAgbG9nLmluZm8oJ2hhbmRsZUNvbnRhY3RzOiBmaW5pc2hlZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVHcm91cHMoXG4gICAgZW52ZWxvcGU6IFByb2Nlc3NlZEVudmVsb3BlLFxuICAgIGdyb3VwczogUHJvdG8uU3luY01lc3NhZ2UuSUdyb3Vwc1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygnZ3JvdXAgc3luYycpO1xuICAgIGxvZy5pbmZvKGBNZXNzYWdlUmVjZWl2ZXI6IGhhbmRsZUdyb3VwcyAke2dldEVudmVsb3BlSWQoZW52ZWxvcGUpfWApO1xuICAgIGNvbnN0IHsgYmxvYiB9ID0gZ3JvdXBzO1xuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAnZ3JvdXBTeW5jJyk7XG5cbiAgICBpZiAoIWJsb2IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZVJlY2VpdmVyLmhhbmRsZUdyb3VwczogYmxvYiBmaWVsZCB3YXMgbWlzc2luZycpO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIGRvIG5vdCByZXR1cm4gaGVyZSBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gYmxvY2sgdGhlIG5leHQgbWVzc2FnZSBvblxuICAgIC8vICAgdGhpcyBhdHRhY2htZW50IGRvd25sb2FkIGFuZCBhIGxvdCBvZiBwcm9jZXNzaW5nIG9mIHRoYXQgYXR0YWNobWVudC5cbiAgICBjb25zdCBhdHRhY2htZW50UG9pbnRlciA9IGF3YWl0IHRoaXMuaGFuZGxlQXR0YWNobWVudChibG9iKTtcbiAgICBjb25zdCBncm91cEJ1ZmZlciA9IG5ldyBHcm91cEJ1ZmZlcihhdHRhY2htZW50UG9pbnRlci5kYXRhKTtcbiAgICBsZXQgZ3JvdXBEZXRhaWxzID0gZ3JvdXBCdWZmZXIubmV4dCgpO1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgd2hpbGUgKGdyb3VwRGV0YWlscykge1xuICAgICAgY29uc3QgeyBpZCB9ID0gZ3JvdXBEZXRhaWxzO1xuICAgICAgc3RyaWN0QXNzZXJ0KGlkLCAnR3JvdXAgZGV0YWlscyB3aXRob3V0IGlkJyk7XG5cbiAgICAgIGlmIChpZC5ieXRlTGVuZ3RoICE9PSAxNikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgYG9uR3JvdXBSZWNlaXZlZDogSWQgd2FzICR7aWR9IGJ5dGVzLCBleHBlY3RlZCAxNiBieXRlcy4gRHJvcHBpbmcgZ3JvdXAuYFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXYgPSBuZXcgR3JvdXBFdmVudChcbiAgICAgICAge1xuICAgICAgICAgIC4uLmdyb3VwRGV0YWlscyxcbiAgICAgICAgICBpZDogQnl0ZXMudG9CaW5hcnkoaWQpLFxuICAgICAgICB9LFxuICAgICAgICBlbnZlbG9wZS5yZWNlaXZlZEF0Q291bnRlclxuICAgICAgKTtcbiAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmRpc3BhdGNoQW5kV2FpdChldikuY2F0Y2goZSA9PiB7XG4gICAgICAgIGxvZy5lcnJvcignZXJyb3IgcHJvY2Vzc2luZyBncm91cCcsIGUpO1xuICAgICAgfSk7XG4gICAgICBncm91cERldGFpbHMgPSBncm91cEJ1ZmZlci5uZXh0KCk7XG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgIGNvbnN0IGV2ID0gbmV3IEdyb3VwU3luY0V2ZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hBbmRXYWl0KGV2KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQmxvY2tlZChcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgYmxvY2tlZDogUHJvdG8uU3luY01lc3NhZ2UuSUJsb2NrZWRcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWxsSWRlbnRpZmllcnMgPSBbXTtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgbG9nVW5leHBlY3RlZFVyZ2VudFZhbHVlKGVudmVsb3BlLCAnYmxvY2tTeW5jJyk7XG5cbiAgICBpZiAoYmxvY2tlZC5udW1iZXJzKSB7XG4gICAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuc3RvcmFnZS5nZXQoJ2Jsb2NrZWQnLCBbXSk7XG5cbiAgICAgIGxvZy5pbmZvKCdoYW5kbGVCbG9ja2VkOiBCbG9ja2luZyB0aGVzZSBudW1iZXJzOicsIGJsb2NrZWQubnVtYmVycyk7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UucHV0KCdibG9ja2VkJywgYmxvY2tlZC5udW1iZXJzKTtcblxuICAgICAgaWYgKCFhcmVBcnJheXNNYXRjaGluZ1NldHMocHJldmlvdXMsIGJsb2NrZWQubnVtYmVycykpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGFsbElkZW50aWZpZXJzLnB1c2goLi4ucHJldmlvdXMpO1xuICAgICAgICBhbGxJZGVudGlmaWVycy5wdXNoKC4uLmJsb2NrZWQubnVtYmVycyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChibG9ja2VkLnV1aWRzKSB7XG4gICAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuc3RvcmFnZS5nZXQoJ2Jsb2NrZWQtdXVpZHMnLCBbXSk7XG4gICAgICBjb25zdCB1dWlkcyA9IGJsb2NrZWQudXVpZHMubWFwKCh1dWlkLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplVXVpZCh1dWlkLCBgaGFuZGxlQmxvY2tlZC51dWlkcy4ke2luZGV4fWApO1xuICAgICAgfSk7XG4gICAgICBsb2cuaW5mbygnaGFuZGxlQmxvY2tlZDogQmxvY2tpbmcgdGhlc2UgdXVpZHM6JywgdXVpZHMpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9yYWdlLnB1dCgnYmxvY2tlZC11dWlkcycsIHV1aWRzKTtcblxuICAgICAgaWYgKCFhcmVBcnJheXNNYXRjaGluZ1NldHMocHJldmlvdXMsIHV1aWRzKSkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgYWxsSWRlbnRpZmllcnMucHVzaCguLi5wcmV2aW91cyk7XG4gICAgICAgIGFsbElkZW50aWZpZXJzLnB1c2goLi4uYmxvY2tlZC51dWlkcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJsb2NrZWQuZ3JvdXBJZHMpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5zdG9yYWdlLmdldCgnYmxvY2tlZC1ncm91cHMnLCBbXSk7XG4gICAgICBjb25zdCBncm91cFYxSWRzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICBjb25zdCBncm91cElkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gICAgICBibG9ja2VkLmdyb3VwSWRzLmZvckVhY2goZ3JvdXBJZCA9PiB7XG4gICAgICAgIGlmIChncm91cElkLmJ5dGVMZW5ndGggPT09IEdST1VQVjFfSURfTEVOR1RIKSB7XG4gICAgICAgICAgZ3JvdXBWMUlkcy5wdXNoKEJ5dGVzLnRvQmluYXJ5KGdyb3VwSWQpKTtcbiAgICAgICAgICBncm91cElkcy5wdXNoKHRoaXMuZGVyaXZlR3JvdXBWMkZyb21WMShncm91cElkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBJZC5ieXRlTGVuZ3RoID09PSBHUk9VUFYyX0lEX0xFTkdUSCkge1xuICAgICAgICAgIGdyb3VwSWRzLnB1c2goQnl0ZXMudG9CYXNlNjQoZ3JvdXBJZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy5lcnJvcignaGFuZGxlQmxvY2tlZDogUmVjZWl2ZWQgaW52YWxpZCBncm91cElkIHZhbHVlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdoYW5kbGVCbG9ja2VkOiBCbG9ja2luZyB0aGVzZSBncm91cHMgLSB2MjonLFxuICAgICAgICBncm91cElkcy5tYXAoZ3JvdXBJZCA9PiBgZ3JvdXB2Migke2dyb3VwSWR9KWApLFxuICAgICAgICAndjE6JyxcbiAgICAgICAgZ3JvdXBWMUlkcy5tYXAoZ3JvdXBJZCA9PiBgZ3JvdXAoJHtncm91cElkfSlgKVxuICAgICAgKTtcblxuICAgICAgY29uc3QgaWRzID0gWy4uLmdyb3VwSWRzLCAuLi5ncm91cFYxSWRzXTtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wdXQoJ2Jsb2NrZWQtZ3JvdXBzJywgaWRzKTtcblxuICAgICAgaWYgKCFhcmVBcnJheXNNYXRjaGluZ1NldHMocHJldmlvdXMsIGlkcykpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGFsbElkZW50aWZpZXJzLnB1c2goLi4ucHJldmlvdXMpO1xuICAgICAgICBhbGxJZGVudGlmaWVycy5wdXNoKC4uLmlkcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVGcm9tQ2FjaGUoZW52ZWxvcGUpO1xuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIGxvZy5pbmZvKCdoYW5kbGVCbG9ja2VkOiBCbG9jayBsaXN0IGNoYW5nZWQsIGZvcmNpbmcgcmUtcmVuZGVyLicpO1xuICAgICAgY29uc3QgdW5pcXVlSWRlbnRpZmllcnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWxsSWRlbnRpZmllcnMpKTtcbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmZvcmNlUmVyZW5kZXIodW5pcXVlSWRlbnRpZmllcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNCbG9ja2VkKG51bWJlcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5ibG9ja2VkLmlzQmxvY2tlZChudW1iZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1V1aWRCbG9ja2VkKHV1aWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuYmxvY2tlZC5pc1V1aWRCbG9ja2VkKHV1aWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0dyb3VwQmxvY2tlZChncm91cElkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmJsb2NrZWQuaXNHcm91cEJsb2NrZWQoZ3JvdXBJZCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUF0dGFjaG1lbnQoXG4gICAgYXR0YWNobWVudDogUHJvdG8uSUF0dGFjaG1lbnRQb2ludGVyXG4gICk6IFByb21pc2U8RG93bmxvYWRlZEF0dGFjaG1lbnRUeXBlPiB7XG4gICAgY29uc3QgY2xlYW5lZCA9IHByb2Nlc3NBdHRhY2htZW50KGF0dGFjaG1lbnQpO1xuICAgIHJldHVybiBkb3dubG9hZEF0dGFjaG1lbnQodGhpcy5zZXJ2ZXIsIGNsZWFuZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVFbmRTZXNzaW9uKFxuICAgIGVudmVsb3BlOiBQcm9jZXNzZWRFbnZlbG9wZSxcbiAgICB0aGVpclV1aWQ6IFVVSURcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oYGhhbmRsZUVuZFNlc3Npb246IGNsb3Npbmcgc2Vzc2lvbnMgZm9yICR7dGhlaXJVdWlkLnRvU3RyaW5nKCl9YCk7XG5cbiAgICBsb2dVbmV4cGVjdGVkVXJnZW50VmFsdWUoZW52ZWxvcGUsICdyZXNldFNlc3Npb24nKTtcblxuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wcm90b2NvbC5hcmNoaXZlQWxsU2Vzc2lvbnModGhlaXJVdWlkKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvY2Vzc0RlY3J5cHRlZChcbiAgICBlbnZlbG9wZTogUHJvY2Vzc2VkRW52ZWxvcGUsXG4gICAgZGVjcnlwdGVkOiBQcm90by5JRGF0YU1lc3NhZ2VcbiAgKTogUHJvbWlzZTxQcm9jZXNzZWREYXRhTWVzc2FnZT4ge1xuICAgIHJldHVybiBwcm9jZXNzRGF0YU1lc3NhZ2UoZGVjcnlwdGVkLCBlbnZlbG9wZS50aW1lc3RhbXApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVudmVsb3BlVHlwZVRvQ2lwaGVydGV4dFR5cGUodHlwZTogbnVtYmVyIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgY29uc3QgeyBUeXBlIH0gPSBQcm90by5FbnZlbG9wZTtcblxuICBpZiAodHlwZSA9PT0gVHlwZS5DSVBIRVJURVhUKSB7XG4gICAgcmV0dXJuIENpcGhlcnRleHRNZXNzYWdlVHlwZS5XaGlzcGVyO1xuICB9XG4gIGlmICh0eXBlID09PSBUeXBlLktFWV9FWENIQU5HRSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdlbnZlbG9wZVR5cGVUb0NpcGhlcnRleHRUeXBlOiBDYW5ub3QgcHJvY2VzcyBLRVlfRVhDSEFOR0UgbWVzc2FnZXMnXG4gICAgKTtcbiAgfVxuICBpZiAodHlwZSA9PT0gVHlwZS5QTEFJTlRFWFRfQ09OVEVOVCkge1xuICAgIHJldHVybiBDaXBoZXJ0ZXh0TWVzc2FnZVR5cGUuUGxhaW50ZXh0O1xuICB9XG4gIGlmICh0eXBlID09PSBUeXBlLlBSRUtFWV9CVU5ETEUpIHtcbiAgICByZXR1cm4gQ2lwaGVydGV4dE1lc3NhZ2VUeXBlLlByZUtleTtcbiAgfVxuICBpZiAodHlwZSA9PT0gVHlwZS5SRUNFSVBUKSB7XG4gICAgcmV0dXJuIENpcGhlcnRleHRNZXNzYWdlVHlwZS5QbGFpbnRleHQ7XG4gIH1cbiAgaWYgKHR5cGUgPT09IFR5cGUuVU5JREVOVElGSUVEX1NFTkRFUikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdlbnZlbG9wZVR5cGVUb0NpcGhlcnRleHRUeXBlOiBDYW5ub3QgcHJvY2VzcyBVTklERU5USUZJRURfU0VOREVSIG1lc3NhZ2VzJ1xuICAgICk7XG4gIH1cbiAgaWYgKHR5cGUgPT09IFR5cGUuVU5LTk9XTikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdlbnZlbG9wZVR5cGVUb0NpcGhlcnRleHRUeXBlOiBDYW5ub3QgcHJvY2VzcyBVTktOT1dOIG1lc3NhZ2VzJ1xuICAgICk7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYGVudmVsb3BlVHlwZVRvQ2lwaGVydGV4dFR5cGU6IFVua25vd24gdHlwZSAke3R5cGV9YCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0Esb0JBQW9DO0FBQ3BDLHFCQUFtQjtBQUNuQixrQkFBOEI7QUFPOUIsOEJBZU87QUFFUCw2QkFNTztBQUNQLG1CQUFnQztBQUNoQyxvQkFBNkI7QUFFN0IscUJBQThCO0FBQzlCLHNCQUF5QjtBQUN6QiwyQkFBOEI7QUFDOUIsNkJBQWdDO0FBQ2hDLHFDQUF3QztBQUN4QyxrQkFBcUI7QUFDckIsb0JBQTJDO0FBRTNDLHFCQUF3QjtBQUN4Qiw4QkFBaUM7QUFFakMsa0JBQStCO0FBQy9CLGFBQXdCO0FBQ3hCLDBCQUEwQjtBQUUxQixzQkFBdUM7QUFDdkMsb0JBQXFEO0FBRXJELDZCQUFrQztBQUNsQyxnQ0FJTztBQUNQLGdDQUFtQztBQUVuQyx5QkFBd0I7QUFDeEIsZ0NBQW1DO0FBRW5DLDRCQUEyQztBQUczQyxvQkFBOEI7QUFDOUIsWUFBdUI7QUFVdkIsbUNBMkJPO0FBQ1AsVUFBcUI7QUFDckIsZ0JBQTJCO0FBQzNCLG1DQUFzQztBQUN0Qyw4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
