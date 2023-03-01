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
var AccountManager_exports = {};
__export(AccountManager_exports, {
  default: () => AccountManager
});
module.exports = __toCommonJS(AccountManager_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_lodash = require("lodash");
var import_EventTarget = __toESM(require("./EventTarget"));
var import_Errors = require("./Errors");
var import_ProvisioningCipher = __toESM(require("./ProvisioningCipher"));
var import_TaskWithTimeout = __toESM(require("./TaskWithTimeout"));
var Bytes = __toESM(require("../Bytes"));
var import_RemoveAllConfiguration = require("../types/RemoveAllConfiguration");
var Errors = __toESM(require("../types/errors"));
var import_senderCertificate = require("../services/senderCertificate");
var import_Crypto = require("../Crypto");
var import_Curve = require("../Curve");
var import_UUID = require("../types/UUID");
var import_timestamp = require("../util/timestamp");
var import_ourProfileKey = require("../services/ourProfileKey");
var import_assert = require("../util/assert");
var import_libphonenumberUtil = require("../util/libphonenumberUtil");
var import_getProvisioningUrl = require("../util/getProvisioningUrl");
var import_isNotNil = require("../util/isNotNil");
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
const DAY = 24 * 60 * 60 * 1e3;
const MINIMUM_SIGNED_PREKEYS = 5;
const ARCHIVE_AGE = 30 * DAY;
const PREKEY_ROTATION_AGE = DAY * 1.5;
const PROFILE_KEY_LENGTH = 32;
const SIGNED_KEY_GEN_BATCH_SIZE = 100;
class AccountManager extends import_EventTarget.default {
  constructor(server) {
    super();
    this.server = server;
    this.pending = Promise.resolve();
  }
  async requestVoiceVerification(number, token) {
    return this.server.requestVerificationVoice(number, token);
  }
  async requestSMSVerification(number, token) {
    return this.server.requestVerificationSMS(number, token);
  }
  encryptDeviceName(name, identityKey) {
    if (!name) {
      return null;
    }
    const encrypted = (0, import_Crypto.encryptDeviceName)(name, identityKey.pubKey);
    const proto = new import_protobuf.SignalService.DeviceName();
    proto.ephemeralPublic = encrypted.ephemeralPublic;
    proto.syntheticIv = encrypted.syntheticIv;
    proto.ciphertext = encrypted.ciphertext;
    const bytes = import_protobuf.SignalService.DeviceName.encode(proto).finish();
    return Bytes.toBase64(bytes);
  }
  async decryptDeviceName(base64) {
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const identityKey = await window.textsecure.storage.protocol.getIdentityKeyPair(ourUuid);
    if (!identityKey) {
      throw new Error("decryptDeviceName: No identity key pair!");
    }
    const bytes = Bytes.fromBase64(base64);
    const proto = import_protobuf.SignalService.DeviceName.decode(bytes);
    (0, import_assert.assert)(proto.ephemeralPublic && proto.syntheticIv && proto.ciphertext, "Missing required fields in DeviceName");
    const name = (0, import_Crypto.decryptDeviceName)(proto, identityKey.privKey);
    return name;
  }
  async maybeUpdateDeviceName() {
    const isNameEncrypted = window.textsecure.storage.user.getDeviceNameEncrypted();
    if (isNameEncrypted) {
      return;
    }
    const { storage } = window.textsecure;
    const deviceName = storage.user.getDeviceName();
    const identityKeyPair = await storage.protocol.getIdentityKeyPair(storage.user.getCheckedUuid());
    (0, import_assert.strictAssert)(identityKeyPair !== void 0, "Can't encrypt device name without identity key pair");
    const base64 = this.encryptDeviceName(deviceName || "", identityKeyPair);
    if (base64) {
      await this.server.updateDeviceName(base64);
    }
  }
  async deviceNameIsEncrypted() {
    await window.textsecure.storage.user.setDeviceNameEncrypted();
  }
  async registerSingleDevice(number, verificationCode) {
    return this.queueTask(async () => {
      const aciKeyPair = (0, import_Curve.generateKeyPair)();
      const pniKeyPair = (0, import_Curve.generateKeyPair)();
      const profileKey = (0, import_Crypto.getRandomBytes)(PROFILE_KEY_LENGTH);
      const accessKey = (0, import_Crypto.deriveAccessKey)(profileKey);
      const registrationBaton = this.server.startRegistration();
      try {
        await this.createAccount({
          number,
          verificationCode,
          aciKeyPair,
          pniKeyPair,
          profileKey,
          accessKey
        });
        await this.clearSessionsAndPreKeys();
        await Promise.all([import_UUID.UUIDKind.ACI, import_UUID.UUIDKind.PNI].map(async (kind) => {
          const keys = await this.generateKeys(SIGNED_KEY_GEN_BATCH_SIZE, kind);
          await this.server.registerKeys(keys, kind);
          await this.confirmKeys(keys, kind);
        }));
      } finally {
        this.server.finishRegistration(registrationBaton);
      }
      await this.registrationDone();
    });
  }
  async registerSecondDevice(setProvisioningUrl, confirmNumber) {
    const clearSessionsAndPreKeys = this.clearSessionsAndPreKeys.bind(this);
    const provisioningCipher = new import_ProvisioningCipher.default();
    const pubKey = await provisioningCipher.getPublicKey();
    let envelopeCallbacks;
    const envelopePromise = new Promise((resolve, reject) => {
      envelopeCallbacks = { resolve, reject };
    });
    const wsr = await this.server.getProvisioningResource({
      handleRequest(request) {
        if (request.path === "/v1/address" && request.verb === "PUT" && request.body) {
          const proto = import_protobuf.SignalService.ProvisioningUuid.decode(request.body);
          const { uuid } = proto;
          if (!uuid) {
            throw new Error("registerSecondDevice: expected a UUID");
          }
          const url = (0, import_getProvisioningUrl.getProvisioningUrl)(uuid, pubKey);
          window.CI?.setProvisioningURL(url);
          setProvisioningUrl(url);
          request.respond(200, "OK");
        } else if (request.path === "/v1/message" && request.verb === "PUT" && request.body) {
          const envelope2 = import_protobuf.SignalService.ProvisionEnvelope.decode(request.body);
          request.respond(200, "OK");
          wsr.close();
          envelopeCallbacks?.resolve(envelope2);
        } else {
          log.error("Unknown websocket message", request.path);
        }
      }
    });
    log.info("provisioning socket open");
    wsr.addEventListener("close", ({ code, reason }) => {
      log.info(`provisioning socket closed. Code: ${code} Reason: ${reason}`);
      envelopeCallbacks?.reject(new Error("websocket closed"));
    });
    const envelope = await envelopePromise;
    const provisionMessage = await provisioningCipher.decrypt(envelope);
    await this.queueTask(async () => {
      const deviceName = await confirmNumber(provisionMessage.number);
      if (typeof deviceName !== "string" || deviceName.length === 0) {
        throw new Error("AccountManager.registerSecondDevice: Invalid device name");
      }
      if (!provisionMessage.number || !provisionMessage.provisioningCode || !provisionMessage.aciKeyPair) {
        throw new Error("AccountManager.registerSecondDevice: Provision message was missing key data");
      }
      const registrationBaton = this.server.startRegistration();
      try {
        await this.createAccount({
          number: provisionMessage.number,
          verificationCode: provisionMessage.provisioningCode,
          aciKeyPair: provisionMessage.aciKeyPair,
          pniKeyPair: provisionMessage.pniKeyPair,
          profileKey: provisionMessage.profileKey,
          deviceName,
          userAgent: provisionMessage.userAgent,
          readReceipts: provisionMessage.readReceipts
        });
        await clearSessionsAndPreKeys();
        const keyKinds = [import_UUID.UUIDKind.ACI];
        if (provisionMessage.pniKeyPair) {
          keyKinds.push(import_UUID.UUIDKind.PNI);
        }
        await Promise.all(keyKinds.map(async (kind) => {
          const keys = await this.generateKeys(SIGNED_KEY_GEN_BATCH_SIZE, kind);
          try {
            await this.server.registerKeys(keys, kind);
            await this.confirmKeys(keys, kind);
          } catch (error) {
            if (kind === import_UUID.UUIDKind.PNI) {
              log.error("Failed to upload PNI prekeys. Moving on", Errors.toLogFormat(error));
              return;
            }
            throw error;
          }
        }));
      } finally {
        this.server.finishRegistration(registrationBaton);
      }
      await this.registrationDone();
    });
  }
  async refreshPreKeys(uuidKind) {
    return this.queueTask(async () => {
      const preKeyCount = await this.server.getMyKeys(uuidKind);
      log.info(`prekey count ${preKeyCount}`);
      if (preKeyCount >= 10) {
        return;
      }
      const keys = await this.generateKeys(SIGNED_KEY_GEN_BATCH_SIZE, uuidKind);
      await this.server.registerKeys(keys, uuidKind);
      await this.confirmKeys(keys, uuidKind);
    });
  }
  async rotateSignedPreKey(uuidKind) {
    return this.queueTask(async () => {
      const ourUuid = window.textsecure.storage.user.getCheckedUuid(uuidKind);
      const signedKeyId = window.textsecure.storage.get("signedKeyId", 1);
      if (typeof signedKeyId !== "number") {
        throw new Error("Invalid signedKeyId");
      }
      const store = window.textsecure.storage.protocol;
      const { server } = this;
      const existingKeys = await store.loadSignedPreKeys(ourUuid);
      existingKeys.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      const confirmedKeys = existingKeys.filter((key) => key.confirmed);
      const mostRecent = confirmedKeys[0];
      if ((0, import_timestamp.isMoreRecentThan)(mostRecent?.created_at || 0, PREKEY_ROTATION_AGE)) {
        log.warn(`rotateSignedPreKey(${uuidKind}): ${confirmedKeys.length} confirmed keys, most recent was created ${mostRecent?.created_at}. Cancelling rotation.`);
        return;
      }
      let identityKey;
      try {
        identityKey = await store.getIdentityKeyPair(ourUuid);
      } catch (error) {
        log.error("Failed to get identity key. Canceling key rotation.", Errors.toLogFormat(error));
        return;
      }
      if (!identityKey) {
        if (uuidKind === import_UUID.UUIDKind.PNI) {
          log.warn(`rotateSignedPreKey(${uuidKind}): No identity key pair!`);
          return;
        }
        throw new Error(`rotateSignedPreKey(${uuidKind}): No identity key pair!`);
      }
      const res = await (0, import_Curve.generateSignedPreKey)(identityKey, signedKeyId);
      log.info(`rotateSignedPreKey(${uuidKind}): Saving new signed prekey`, res.keyId);
      await Promise.all([
        window.textsecure.storage.put("signedKeyId", signedKeyId + 1),
        store.storeSignedPreKey(ourUuid, res.keyId, res.keyPair)
      ]);
      try {
        await server.setSignedPreKey({
          keyId: res.keyId,
          publicKey: res.keyPair.pubKey,
          signature: res.signature
        }, uuidKind);
      } catch (error) {
        log.error(`rotateSignedPrekey(${uuidKind}) error:`, Errors.toLogFormat(error));
        if (error instanceof import_Errors.HTTPError && error.code >= 400 && error.code <= 599) {
          const rejections = 1 + window.textsecure.storage.get("signedKeyRotationRejected", 0);
          await window.textsecure.storage.put("signedKeyRotationRejected", rejections);
          log.error(`rotateSignedPreKey(${uuidKind}): Signed key rotation rejected count:`, rejections);
          return;
        }
        throw error;
      }
      const confirmed = true;
      log.info("Confirming new signed prekey", res.keyId);
      await Promise.all([
        window.textsecure.storage.remove("signedKeyRotationRejected"),
        store.storeSignedPreKey(ourUuid, res.keyId, res.keyPair, confirmed)
      ]);
      try {
        await this.cleanSignedPreKeys();
      } catch (_error) {
      }
    });
  }
  async queueTask(task) {
    this.pendingQueue = this.pendingQueue || new import_p_queue.default({ concurrency: 1 });
    const taskWithTimeout = (0, import_TaskWithTimeout.default)(task, "AccountManager task");
    return this.pendingQueue.add(taskWithTimeout);
  }
  async cleanSignedPreKeys() {
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const store = window.textsecure.storage.protocol;
    const allKeys = await store.loadSignedPreKeys(ourUuid);
    allKeys.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    const confirmed = allKeys.filter((key) => key.confirmed);
    const unconfirmed = allKeys.filter((key) => !key.confirmed);
    const recent = allKeys[0] ? allKeys[0].keyId : "none";
    const recentConfirmed = confirmed[0] ? confirmed[0].keyId : "none";
    const recentUnconfirmed = unconfirmed[0] ? unconfirmed[0].keyId : "none";
    log.info(`cleanSignedPreKeys: Most recent signed key: ${recent}`);
    log.info(`cleanSignedPreKeys: Most recent confirmed signed key: ${recentConfirmed}`);
    log.info(`cleanSignedPreKeys: Most recent unconfirmed signed key: ${recentUnconfirmed}`);
    log.info("cleanSignedPreKeys: Total signed key count:", allKeys.length, "-", confirmed.length, "confirmed");
    await Promise.all(allKeys.map(async (key, index) => {
      if (index < MINIMUM_SIGNED_PREKEYS) {
        return;
      }
      const createdAt = key.created_at || 0;
      if ((0, import_timestamp.isOlderThan)(createdAt, ARCHIVE_AGE)) {
        const timestamp = new Date(createdAt).toJSON();
        const confirmedText = key.confirmed ? " (confirmed)" : "";
        log.info(`Removing signed prekey: ${key.keyId} with timestamp ${timestamp}${confirmedText}`);
        await store.removeSignedPreKey(ourUuid, key.keyId);
      }
    }));
  }
  async createAccount({
    number,
    verificationCode,
    aciKeyPair,
    pniKeyPair,
    profileKey,
    deviceName,
    userAgent,
    readReceipts,
    accessKey
  }) {
    const { storage } = window.textsecure;
    let password = Bytes.toBase64((0, import_Crypto.getRandomBytes)(16));
    password = password.substring(0, password.length - 2);
    const registrationId = (0, import_Crypto.generateRegistrationId)();
    const previousNumber = storage.user.getNumber();
    const previousACI = storage.user.getUuid(import_UUID.UUIDKind.ACI)?.toString();
    const previousPNI = storage.user.getUuid(import_UUID.UUIDKind.PNI)?.toString();
    let encryptedDeviceName;
    if (deviceName) {
      encryptedDeviceName = this.encryptDeviceName(deviceName, aciKeyPair);
      await this.deviceNameIsEncrypted();
    }
    log.info(`createAccount: Number is ${number}, password has length: ${password ? password.length : "none"}`);
    const response = await this.server.confirmCode(number, verificationCode, password, registrationId, encryptedDeviceName, { accessKey });
    const ourUuid = import_UUID.UUID.cast(response.uuid);
    const ourPni = import_UUID.UUID.cast(response.pni);
    const uuidChanged = previousACI && ourUuid && previousACI !== ourUuid;
    const numberChanged = !previousACI && previousNumber && previousNumber !== number;
    if (uuidChanged || numberChanged) {
      if (uuidChanged) {
        log.warn("createAccount: New uuid is different from old uuid; deleting all previous data");
      }
      if (numberChanged) {
        log.warn("createAccount: New number is different from old number; deleting all previous data");
      }
      try {
        await storage.protocol.removeAllData();
        log.info("createAccount: Successfully deleted previous data");
      } catch (error) {
        log.error("Something went wrong deleting data from previous number", error && error.stack ? error.stack : error);
      }
    } else {
      log.info("createAccount: Erasing configuration (soft)");
      await storage.protocol.removeAllConfiguration(import_RemoveAllConfiguration.RemoveAllConfiguration.Soft);
    }
    await import_senderCertificate.senderCertificateService.clear();
    const previousUuids = [previousACI, previousPNI].filter(import_isNotNil.isNotNil);
    if (previousUuids.length > 0) {
      await Promise.all([
        storage.put("identityKeyMap", (0, import_lodash.omit)(storage.get("identityKeyMap") || {}, previousUuids)),
        storage.put("registrationIdMap", (0, import_lodash.omit)(storage.get("registrationIdMap") || {}, previousUuids))
      ]);
    }
    await storage.user.setCredentials({
      uuid: ourUuid,
      pni: ourPni,
      number,
      deviceId: response.deviceId ?? 1,
      deviceName: deviceName ?? void 0,
      password
    });
    const conversationId = window.ConversationController.maybeMergeContacts({
      aci: ourUuid,
      e164: number,
      reason: "createAccount"
    });
    if (!conversationId) {
      throw new Error("registrationDone: no conversationId!");
    }
    const identityAttrs = {
      firstUse: true,
      timestamp: Date.now(),
      verified: storage.protocol.VerifiedStatus.VERIFIED,
      nonblockingApproval: true
    };
    await Promise.all([
      storage.protocol.saveIdentityWithAttributes(new import_UUID.UUID(ourUuid), {
        ...identityAttrs,
        publicKey: aciKeyPair.pubKey
      }),
      pniKeyPair ? storage.protocol.saveIdentityWithAttributes(new import_UUID.UUID(ourPni), {
        ...identityAttrs,
        publicKey: pniKeyPair.pubKey
      }) : Promise.resolve()
    ]);
    const identityKeyMap = {
      ...storage.get("identityKeyMap") || {},
      [ourUuid]: aciKeyPair,
      ...pniKeyPair ? {
        [ourPni]: pniKeyPair
      } : {}
    };
    const registrationIdMap = {
      ...storage.get("registrationIdMap") || {},
      [ourUuid]: registrationId,
      [ourPni]: registrationId
    };
    await storage.put("identityKeyMap", identityKeyMap);
    await storage.put("registrationIdMap", registrationIdMap);
    if (profileKey) {
      await import_ourProfileKey.ourProfileKeyService.set(profileKey);
    }
    if (userAgent) {
      await storage.put("userAgent", userAgent);
    }
    await storage.put("read-receipt-setting", Boolean(readReceipts));
    const regionCode = (0, import_libphonenumberUtil.getRegionCodeForNumber)(number);
    await storage.put("regionCode", regionCode);
    await storage.protocol.hydrateCaches();
  }
  async clearSessionsAndPreKeys() {
    const store = window.textsecure.storage.protocol;
    log.info("clearing all sessions, prekeys, and signed prekeys");
    await Promise.all([
      store.clearPreKeyStore(),
      store.clearSignedPreKeysStore(),
      store.clearSessionStore()
    ]);
  }
  async updatePNIIdentity(identityKeyPair) {
    const { storage } = window.textsecure;
    log.info("AccountManager.updatePNIIdentity: generating new keys");
    await this.queueTask(async () => {
      log.info("AccountManager.updatePNIIdentity: updating identity key and registration id");
      const pni = storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI);
      const identityKeyMap = {
        ...storage.get("identityKeyMap") || {},
        [pni.toString()]: identityKeyPair
      };
      const aci = storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
      const oldRegistrationIdMap = storage.get("registrationIdMap") || {};
      const registrationIdMap = {
        ...oldRegistrationIdMap,
        [pni.toString()]: oldRegistrationIdMap[aci.toString()]
      };
      await Promise.all([
        storage.put("identityKeyMap", identityKeyMap),
        storage.put("registrationIdMap", registrationIdMap)
      ]);
      await storage.protocol.hydrateCaches();
    });
    this.queueTask(async () => {
      try {
        const keys = await this.generateKeys(SIGNED_KEY_GEN_BATCH_SIZE, import_UUID.UUIDKind.PNI, identityKeyPair);
        await this.server.registerKeys(keys, import_UUID.UUIDKind.PNI);
        await this.confirmKeys(keys, import_UUID.UUIDKind.PNI);
      } catch (error) {
        log.error("updatePNIIdentity: Failed to upload PNI prekeys. Moving on", Errors.toLogFormat(error));
      }
    });
  }
  async confirmKeys(keys, uuidKind) {
    const store = window.textsecure.storage.protocol;
    const key = keys.signedPreKey;
    const confirmed = true;
    if (!key) {
      throw new Error("confirmKeys: signedPreKey is null");
    }
    log.info(`AccountManager.confirmKeys(${uuidKind}): confirming key`, key.keyId);
    const ourUuid = window.textsecure.storage.user.getCheckedUuid(uuidKind);
    await store.storeSignedPreKey(ourUuid, key.keyId, key.keyPair, confirmed);
  }
  async generateKeys(count, uuidKind, maybeIdentityKey) {
    const { storage } = window.textsecure;
    const startId = storage.get("maxPreKeyId", 1);
    const signedKeyId = storage.get("signedKeyId", 1);
    const ourUuid = storage.user.getCheckedUuid(uuidKind);
    if (typeof startId !== "number") {
      throw new Error("Invalid maxPreKeyId");
    }
    if (typeof signedKeyId !== "number") {
      throw new Error("Invalid signedKeyId");
    }
    const store = storage.protocol;
    const identityKey = maybeIdentityKey ?? await store.getIdentityKeyPair(ourUuid);
    (0, import_assert.strictAssert)(identityKey, "generateKeys: No identity key pair!");
    const result = {
      preKeys: [],
      identityKey: identityKey.pubKey
    };
    const promises = [];
    for (let keyId = startId; keyId < startId + count; keyId += 1) {
      promises.push((async () => {
        const res = (0, import_Curve.generatePreKey)(keyId);
        await store.storePreKey(ourUuid, res.keyId, res.keyPair);
        result.preKeys.push({
          keyId: res.keyId,
          publicKey: res.keyPair.pubKey
        });
      })());
    }
    const signedPreKey = (async () => {
      const res = (0, import_Curve.generateSignedPreKey)(identityKey, signedKeyId);
      await store.storeSignedPreKey(ourUuid, res.keyId, res.keyPair);
      return {
        keyId: res.keyId,
        publicKey: res.keyPair.pubKey,
        signature: res.signature,
        keyPair: res.keyPair
      };
    })();
    promises.push(signedPreKey);
    promises.push(storage.put("maxPreKeyId", startId + count));
    promises.push(storage.put("signedKeyId", signedKeyId + 1));
    await Promise.all(promises);
    this.cleanSignedPreKeys();
    return {
      ...result,
      signedPreKey: await signedPreKey
    };
  }
  async registrationDone() {
    log.info("registration done");
    this.dispatchEvent(new Event("registration"));
  }
  async setPni(pni, keyMaterial) {
    const { storage } = window.textsecure;
    const oldPni = storage.user.getUuid(import_UUID.UUIDKind.PNI)?.toString();
    if (oldPni === pni && !keyMaterial) {
      return;
    }
    log.info(`AccountManager.setPni(${pni}): updating from ${oldPni}`);
    if (oldPni) {
      await storage.protocol.removeOurOldPni(new import_UUID.UUID(oldPni));
    }
    await storage.user.setPni(pni);
    if (keyMaterial) {
      await storage.protocol.updateOurPniKeyMaterial(new import_UUID.UUID(pni), keyMaterial);
      this.queueTask(async () => {
        try {
          const keys = await this.generateKeys(SIGNED_KEY_GEN_BATCH_SIZE, import_UUID.UUIDKind.PNI);
          await this.server.registerKeys(keys, import_UUID.UUIDKind.PNI);
          await this.confirmKeys(keys, import_UUID.UUIDKind.PNI);
        } catch (error) {
          log.error("setPni: Failed to upload PNI prekeys. Moving on", Errors.toLogFormat(error));
        }
      });
      await storage.put("groupCredentials", []);
    } else {
      log.warn(`AccountManager.setPni(${pni}): no key material`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQWNjb3VudE1hbmFnZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuaW1wb3J0IHsgb21pdCB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCBFdmVudFRhcmdldCBmcm9tICcuL0V2ZW50VGFyZ2V0JztcbmltcG9ydCB0eXBlIHsgV2ViQVBJVHlwZSB9IGZyb20gJy4vV2ViQVBJJztcbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4vRXJyb3JzJztcbmltcG9ydCB0eXBlIHsgS2V5UGFpclR5cGUsIFBuaUtleU1hdGVyaWFsVHlwZSB9IGZyb20gJy4vVHlwZXMuZCc7XG5pbXBvcnQgUHJvdmlzaW9uaW5nQ2lwaGVyIGZyb20gJy4vUHJvdmlzaW9uaW5nQ2lwaGVyJztcbmltcG9ydCB0eXBlIHsgSW5jb21pbmdXZWJTb2NrZXRSZXF1ZXN0IH0gZnJvbSAnLi9XZWJzb2NrZXRSZXNvdXJjZXMnO1xuaW1wb3J0IGNyZWF0ZVRhc2tXaXRoVGltZW91dCBmcm9tICcuL1Rhc2tXaXRoVGltZW91dCc7XG5pbXBvcnQgKiBhcyBCeXRlcyBmcm9tICcuLi9CeXRlcyc7XG5pbXBvcnQgeyBSZW1vdmVBbGxDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vdHlwZXMvUmVtb3ZlQWxsQ29uZmlndXJhdGlvbic7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB7IHNlbmRlckNlcnRpZmljYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3NlbmRlckNlcnRpZmljYXRlJztcbmltcG9ydCB7XG4gIGRlcml2ZUFjY2Vzc0tleSxcbiAgZ2VuZXJhdGVSZWdpc3RyYXRpb25JZCxcbiAgZ2V0UmFuZG9tQnl0ZXMsXG4gIGRlY3J5cHREZXZpY2VOYW1lLFxuICBlbmNyeXB0RGV2aWNlTmFtZSxcbn0gZnJvbSAnLi4vQ3J5cHRvJztcbmltcG9ydCB7XG4gIGdlbmVyYXRlS2V5UGFpcixcbiAgZ2VuZXJhdGVTaWduZWRQcmVLZXksXG4gIGdlbmVyYXRlUHJlS2V5LFxufSBmcm9tICcuLi9DdXJ2ZSc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgaXNNb3JlUmVjZW50VGhhbiwgaXNPbGRlclRoYW4gfSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBvdXJQcm9maWxlS2V5U2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL291clByb2ZpbGVLZXknO1xuaW1wb3J0IHsgYXNzZXJ0LCBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRSZWdpb25Db2RlRm9yTnVtYmVyIH0gZnJvbSAnLi4vdXRpbC9saWJwaG9uZW51bWJlclV0aWwnO1xuaW1wb3J0IHsgZ2V0UHJvdmlzaW9uaW5nVXJsIH0gZnJvbSAnLi4vdXRpbC9nZXRQcm92aXNpb25pbmdVcmwnO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuLi91dGlsL2lzTm90TmlsJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuXG5jb25zdCBEQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuY29uc3QgTUlOSU1VTV9TSUdORURfUFJFS0VZUyA9IDU7XG5jb25zdCBBUkNISVZFX0FHRSA9IDMwICogREFZO1xuY29uc3QgUFJFS0VZX1JPVEFUSU9OX0FHRSA9IERBWSAqIDEuNTtcbmNvbnN0IFBST0ZJTEVfS0VZX0xFTkdUSCA9IDMyO1xuY29uc3QgU0lHTkVEX0tFWV9HRU5fQkFUQ0hfU0laRSA9IDEwMDtcblxuZXhwb3J0IHR5cGUgR2VuZXJhdGVkS2V5c1R5cGUgPSB7XG4gIHByZUtleXM6IEFycmF5PHtcbiAgICBrZXlJZDogbnVtYmVyO1xuICAgIHB1YmxpY0tleTogVWludDhBcnJheTtcbiAgfT47XG4gIHNpZ25lZFByZUtleToge1xuICAgIGtleUlkOiBudW1iZXI7XG4gICAgcHVibGljS2V5OiBVaW50OEFycmF5O1xuICAgIHNpZ25hdHVyZTogVWludDhBcnJheTtcbiAgICBrZXlQYWlyOiBLZXlQYWlyVHlwZTtcbiAgfTtcbiAgaWRlbnRpdHlLZXk6IFVpbnQ4QXJyYXk7XG59O1xuXG50eXBlIENyZWF0ZUFjY291bnRPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgbnVtYmVyOiBzdHJpbmc7XG4gIHZlcmlmaWNhdGlvbkNvZGU6IHN0cmluZztcbiAgYWNpS2V5UGFpcjogS2V5UGFpclR5cGU7XG4gIHBuaUtleVBhaXI/OiBLZXlQYWlyVHlwZTtcbiAgcHJvZmlsZUtleT86IFVpbnQ4QXJyYXk7XG4gIGRldmljZU5hbWU/OiBzdHJpbmc7XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgcmVhZFJlY2VpcHRzPzogYm9vbGVhbjtcbiAgYWNjZXNzS2V5PzogVWludDhBcnJheTtcbn0+O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50TWFuYWdlciBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcbiAgcGVuZGluZzogUHJvbWlzZTx2b2lkPjtcblxuICBwZW5kaW5nUXVldWU/OiBQUXVldWU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzZXJ2ZXI6IFdlYkFQSVR5cGUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5wZW5kaW5nID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBhc3luYyByZXF1ZXN0Vm9pY2VWZXJpZmljYXRpb24obnVtYmVyOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJ2ZXIucmVxdWVzdFZlcmlmaWNhdGlvblZvaWNlKG51bWJlciwgdG9rZW4pO1xuICB9XG5cbiAgYXN5bmMgcmVxdWVzdFNNU1ZlcmlmaWNhdGlvbihudW1iZXI6IHN0cmluZywgdG9rZW46IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcnZlci5yZXF1ZXN0VmVyaWZpY2F0aW9uU01TKG51bWJlciwgdG9rZW4pO1xuICB9XG5cbiAgZW5jcnlwdERldmljZU5hbWUobmFtZTogc3RyaW5nLCBpZGVudGl0eUtleTogS2V5UGFpclR5cGUpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBlbmNyeXB0ZWQgPSBlbmNyeXB0RGV2aWNlTmFtZShuYW1lLCBpZGVudGl0eUtleS5wdWJLZXkpO1xuXG4gICAgY29uc3QgcHJvdG8gPSBuZXcgUHJvdG8uRGV2aWNlTmFtZSgpO1xuICAgIHByb3RvLmVwaGVtZXJhbFB1YmxpYyA9IGVuY3J5cHRlZC5lcGhlbWVyYWxQdWJsaWM7XG4gICAgcHJvdG8uc3ludGhldGljSXYgPSBlbmNyeXB0ZWQuc3ludGhldGljSXY7XG4gICAgcHJvdG8uY2lwaGVydGV4dCA9IGVuY3J5cHRlZC5jaXBoZXJ0ZXh0O1xuXG4gICAgY29uc3QgYnl0ZXMgPSBQcm90by5EZXZpY2VOYW1lLmVuY29kZShwcm90bykuZmluaXNoKCk7XG4gICAgcmV0dXJuIEJ5dGVzLnRvQmFzZTY0KGJ5dGVzKTtcbiAgfVxuXG4gIGFzeW5jIGRlY3J5cHREZXZpY2VOYW1lKGJhc2U2NDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgY29uc3QgaWRlbnRpdHlLZXkgPVxuICAgICAgYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5nZXRJZGVudGl0eUtleVBhaXIob3VyVXVpZCk7XG4gICAgaWYgKCFpZGVudGl0eUtleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkZWNyeXB0RGV2aWNlTmFtZTogTm8gaWRlbnRpdHkga2V5IHBhaXIhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYnl0ZXMgPSBCeXRlcy5mcm9tQmFzZTY0KGJhc2U2NCk7XG4gICAgY29uc3QgcHJvdG8gPSBQcm90by5EZXZpY2VOYW1lLmRlY29kZShieXRlcyk7XG4gICAgYXNzZXJ0KFxuICAgICAgcHJvdG8uZXBoZW1lcmFsUHVibGljICYmIHByb3RvLnN5bnRoZXRpY0l2ICYmIHByb3RvLmNpcGhlcnRleHQsXG4gICAgICAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHMgaW4gRGV2aWNlTmFtZSdcbiAgICApO1xuXG4gICAgY29uc3QgbmFtZSA9IGRlY3J5cHREZXZpY2VOYW1lKHByb3RvLCBpZGVudGl0eUtleS5wcml2S2V5KTtcblxuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbiAgYXN5bmMgbWF5YmVVcGRhdGVEZXZpY2VOYW1lKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlzTmFtZUVuY3J5cHRlZCA9XG4gICAgICB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlTmFtZUVuY3J5cHRlZCgpO1xuICAgIGlmIChpc05hbWVFbmNyeXB0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyBzdG9yYWdlIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgICBjb25zdCBkZXZpY2VOYW1lID0gc3RvcmFnZS51c2VyLmdldERldmljZU5hbWUoKTtcbiAgICBjb25zdCBpZGVudGl0eUtleVBhaXIgPSBhd2FpdCBzdG9yYWdlLnByb3RvY29sLmdldElkZW50aXR5S2V5UGFpcihcbiAgICAgIHN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBpZGVudGl0eUtleVBhaXIgIT09IHVuZGVmaW5lZCxcbiAgICAgIFwiQ2FuJ3QgZW5jcnlwdCBkZXZpY2UgbmFtZSB3aXRob3V0IGlkZW50aXR5IGtleSBwYWlyXCJcbiAgICApO1xuICAgIGNvbnN0IGJhc2U2NCA9IHRoaXMuZW5jcnlwdERldmljZU5hbWUoZGV2aWNlTmFtZSB8fCAnJywgaWRlbnRpdHlLZXlQYWlyKTtcblxuICAgIGlmIChiYXNlNjQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnVwZGF0ZURldmljZU5hbWUoYmFzZTY0KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkZXZpY2VOYW1lSXNFbmNyeXB0ZWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLnNldERldmljZU5hbWVFbmNyeXB0ZWQoKTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyU2luZ2xlRGV2aWNlKFxuICAgIG51bWJlcjogc3RyaW5nLFxuICAgIHZlcmlmaWNhdGlvbkNvZGU6IHN0cmluZ1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZVRhc2soYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYWNpS2V5UGFpciA9IGdlbmVyYXRlS2V5UGFpcigpO1xuICAgICAgY29uc3QgcG5pS2V5UGFpciA9IGdlbmVyYXRlS2V5UGFpcigpO1xuICAgICAgY29uc3QgcHJvZmlsZUtleSA9IGdldFJhbmRvbUJ5dGVzKFBST0ZJTEVfS0VZX0xFTkdUSCk7XG4gICAgICBjb25zdCBhY2Nlc3NLZXkgPSBkZXJpdmVBY2Nlc3NLZXkocHJvZmlsZUtleSk7XG5cbiAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbkJhdG9uID0gdGhpcy5zZXJ2ZXIuc3RhcnRSZWdpc3RyYXRpb24oKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlQWNjb3VudCh7XG4gICAgICAgICAgbnVtYmVyLFxuICAgICAgICAgIHZlcmlmaWNhdGlvbkNvZGUsXG4gICAgICAgICAgYWNpS2V5UGFpcixcbiAgICAgICAgICBwbmlLZXlQYWlyLFxuICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgYWNjZXNzS2V5LFxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmNsZWFyU2Vzc2lvbnNBbmRQcmVLZXlzKCk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgW1VVSURLaW5kLkFDSSwgVVVJREtpbmQuUE5JXS5tYXAoYXN5bmMga2luZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUtleXMoXG4gICAgICAgICAgICAgIFNJR05FRF9LRVlfR0VOX0JBVENIX1NJWkUsXG4gICAgICAgICAgICAgIGtpbmRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlci5yZWdpc3RlcktleXMoa2V5cywga2luZCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbmZpcm1LZXlzKGtleXMsIGtpbmQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnNlcnZlci5maW5pc2hSZWdpc3RyYXRpb24ocmVnaXN0cmF0aW9uQmF0b24pO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5yZWdpc3RyYXRpb25Eb25lKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZWdpc3RlclNlY29uZERldmljZShcbiAgICBzZXRQcm92aXNpb25pbmdVcmw6ICh1cmw6IHN0cmluZykgPT4gdm9pZCxcbiAgICBjb25maXJtTnVtYmVyOiAobnVtYmVyPzogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2xlYXJTZXNzaW9uc0FuZFByZUtleXMgPSB0aGlzLmNsZWFyU2Vzc2lvbnNBbmRQcmVLZXlzLmJpbmQodGhpcyk7XG4gICAgY29uc3QgcHJvdmlzaW9uaW5nQ2lwaGVyID0gbmV3IFByb3Zpc2lvbmluZ0NpcGhlcigpO1xuICAgIGNvbnN0IHB1YktleSA9IGF3YWl0IHByb3Zpc2lvbmluZ0NpcGhlci5nZXRQdWJsaWNLZXkoKTtcblxuICAgIGxldCBlbnZlbG9wZUNhbGxiYWNrczpcbiAgICAgIHwge1xuICAgICAgICAgIHJlc29sdmUoZGF0YTogUHJvdG8uUHJvdmlzaW9uRW52ZWxvcGUpOiB2b2lkO1xuICAgICAgICAgIHJlamVjdChlcnJvcjogRXJyb3IpOiB2b2lkO1xuICAgICAgICB9XG4gICAgICB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBlbnZlbG9wZVByb21pc2UgPSBuZXcgUHJvbWlzZTxQcm90by5Qcm92aXNpb25FbnZlbG9wZT4oXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGVudmVsb3BlQ2FsbGJhY2tzID0geyByZXNvbHZlLCByZWplY3QgfTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3Qgd3NyID0gYXdhaXQgdGhpcy5zZXJ2ZXIuZ2V0UHJvdmlzaW9uaW5nUmVzb3VyY2Uoe1xuICAgICAgaGFuZGxlUmVxdWVzdChyZXF1ZXN0OiBJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJlcXVlc3QucGF0aCA9PT0gJy92MS9hZGRyZXNzJyAmJlxuICAgICAgICAgIHJlcXVlc3QudmVyYiA9PT0gJ1BVVCcgJiZcbiAgICAgICAgICByZXF1ZXN0LmJvZHlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgcHJvdG8gPSBQcm90by5Qcm92aXNpb25pbmdVdWlkLmRlY29kZShyZXF1ZXN0LmJvZHkpO1xuICAgICAgICAgIGNvbnN0IHsgdXVpZCB9ID0gcHJvdG87XG4gICAgICAgICAgaWYgKCF1dWlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdGVyU2Vjb25kRGV2aWNlOiBleHBlY3RlZCBhIFVVSUQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdXJsID0gZ2V0UHJvdmlzaW9uaW5nVXJsKHV1aWQsIHB1YktleSk7XG5cbiAgICAgICAgICB3aW5kb3cuQ0k/LnNldFByb3Zpc2lvbmluZ1VSTCh1cmwpO1xuXG4gICAgICAgICAgc2V0UHJvdmlzaW9uaW5nVXJsKHVybCk7XG4gICAgICAgICAgcmVxdWVzdC5yZXNwb25kKDIwMCwgJ09LJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgcmVxdWVzdC5wYXRoID09PSAnL3YxL21lc3NhZ2UnICYmXG4gICAgICAgICAgcmVxdWVzdC52ZXJiID09PSAnUFVUJyAmJlxuICAgICAgICAgIHJlcXVlc3QuYm9keVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBlbnZlbG9wZSA9IFByb3RvLlByb3Zpc2lvbkVudmVsb3BlLmRlY29kZShyZXF1ZXN0LmJvZHkpO1xuICAgICAgICAgIHJlcXVlc3QucmVzcG9uZCgyMDAsICdPSycpO1xuICAgICAgICAgIHdzci5jbG9zZSgpO1xuICAgICAgICAgIGVudmVsb3BlQ2FsbGJhY2tzPy5yZXNvbHZlKGVudmVsb3BlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cuZXJyb3IoJ1Vua25vd24gd2Vic29ja2V0IG1lc3NhZ2UnLCByZXF1ZXN0LnBhdGgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbG9nLmluZm8oJ3Byb3Zpc2lvbmluZyBzb2NrZXQgb3BlbicpO1xuXG4gICAgd3NyLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgKHsgY29kZSwgcmVhc29uIH0pID0+IHtcbiAgICAgIGxvZy5pbmZvKGBwcm92aXNpb25pbmcgc29ja2V0IGNsb3NlZC4gQ29kZTogJHtjb2RlfSBSZWFzb246ICR7cmVhc29ufWApO1xuXG4gICAgICAvLyBOb3RlOiBpZiB3ZSBoYXZlIHJlc29sdmVkIHRoZSBlbnZlbG9wZSBhbHJlYWR5IC0gdGhpcyBoYXMgbm8gZWZmZWN0XG4gICAgICBlbnZlbG9wZUNhbGxiYWNrcz8ucmVqZWN0KG5ldyBFcnJvcignd2Vic29ja2V0IGNsb3NlZCcpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGVudmVsb3BlID0gYXdhaXQgZW52ZWxvcGVQcm9taXNlO1xuICAgIGNvbnN0IHByb3Zpc2lvbk1lc3NhZ2UgPSBhd2FpdCBwcm92aXNpb25pbmdDaXBoZXIuZGVjcnlwdChlbnZlbG9wZSk7XG5cbiAgICBhd2FpdCB0aGlzLnF1ZXVlVGFzayhhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXZpY2VOYW1lID0gYXdhaXQgY29uZmlybU51bWJlcihwcm92aXNpb25NZXNzYWdlLm51bWJlcik7XG4gICAgICBpZiAodHlwZW9mIGRldmljZU5hbWUgIT09ICdzdHJpbmcnIHx8IGRldmljZU5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQWNjb3VudE1hbmFnZXIucmVnaXN0ZXJTZWNvbmREZXZpY2U6IEludmFsaWQgZGV2aWNlIG5hbWUnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICFwcm92aXNpb25NZXNzYWdlLm51bWJlciB8fFxuICAgICAgICAhcHJvdmlzaW9uTWVzc2FnZS5wcm92aXNpb25pbmdDb2RlIHx8XG4gICAgICAgICFwcm92aXNpb25NZXNzYWdlLmFjaUtleVBhaXJcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0FjY291bnRNYW5hZ2VyLnJlZ2lzdGVyU2Vjb25kRGV2aWNlOiBQcm92aXNpb24gbWVzc2FnZSB3YXMgbWlzc2luZyBrZXkgZGF0YSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVnaXN0cmF0aW9uQmF0b24gPSB0aGlzLnNlcnZlci5zdGFydFJlZ2lzdHJhdGlvbigpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUFjY291bnQoe1xuICAgICAgICAgIG51bWJlcjogcHJvdmlzaW9uTWVzc2FnZS5udW1iZXIsXG4gICAgICAgICAgdmVyaWZpY2F0aW9uQ29kZTogcHJvdmlzaW9uTWVzc2FnZS5wcm92aXNpb25pbmdDb2RlLFxuICAgICAgICAgIGFjaUtleVBhaXI6IHByb3Zpc2lvbk1lc3NhZ2UuYWNpS2V5UGFpcixcbiAgICAgICAgICBwbmlLZXlQYWlyOiBwcm92aXNpb25NZXNzYWdlLnBuaUtleVBhaXIsXG4gICAgICAgICAgcHJvZmlsZUtleTogcHJvdmlzaW9uTWVzc2FnZS5wcm9maWxlS2V5LFxuICAgICAgICAgIGRldmljZU5hbWUsXG4gICAgICAgICAgdXNlckFnZW50OiBwcm92aXNpb25NZXNzYWdlLnVzZXJBZ2VudCxcbiAgICAgICAgICByZWFkUmVjZWlwdHM6IHByb3Zpc2lvbk1lc3NhZ2UucmVhZFJlY2VpcHRzLFxuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgY2xlYXJTZXNzaW9uc0FuZFByZUtleXMoKTtcblxuICAgICAgICBjb25zdCBrZXlLaW5kcyA9IFtVVUlES2luZC5BQ0ldO1xuICAgICAgICBpZiAocHJvdmlzaW9uTWVzc2FnZS5wbmlLZXlQYWlyKSB7XG4gICAgICAgICAga2V5S2luZHMucHVzaChVVUlES2luZC5QTkkpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAga2V5S2luZHMubWFwKGFzeW5jIGtpbmQgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVLZXlzKFxuICAgICAgICAgICAgICBTSUdORURfS0VZX0dFTl9CQVRDSF9TSVpFLFxuICAgICAgICAgICAgICBraW5kXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlci5yZWdpc3RlcktleXMoa2V5cywga2luZCk7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuY29uZmlybUtleXMoa2V5cywga2luZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoa2luZCA9PT0gVVVJREtpbmQuUE5JKSB7XG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICAgICAgJ0ZhaWxlZCB0byB1cGxvYWQgUE5JIHByZWtleXMuIE1vdmluZyBvbicsXG4gICAgICAgICAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZmluaXNoUmVnaXN0cmF0aW9uKHJlZ2lzdHJhdGlvbkJhdG9uKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5yZWdpc3RyYXRpb25Eb25lKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoUHJlS2V5cyh1dWlkS2luZDogVVVJREtpbmQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZVRhc2soYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcHJlS2V5Q291bnQgPSBhd2FpdCB0aGlzLnNlcnZlci5nZXRNeUtleXModXVpZEtpbmQpO1xuICAgICAgbG9nLmluZm8oYHByZWtleSBjb3VudCAke3ByZUtleUNvdW50fWApO1xuICAgICAgaWYgKHByZUtleUNvdW50ID49IDEwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlS2V5cyhTSUdORURfS0VZX0dFTl9CQVRDSF9TSVpFLCB1dWlkS2luZCk7XG4gICAgICBhd2FpdCB0aGlzLnNlcnZlci5yZWdpc3RlcktleXMoa2V5cywgdXVpZEtpbmQpO1xuICAgICAgYXdhaXQgdGhpcy5jb25maXJtS2V5cyhrZXlzLCB1dWlkS2luZCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByb3RhdGVTaWduZWRQcmVLZXkodXVpZEtpbmQ6IFVVSURLaW5kKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMucXVldWVUYXNrKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQodXVpZEtpbmQpO1xuICAgICAgY29uc3Qgc2lnbmVkS2V5SWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLmdldCgnc2lnbmVkS2V5SWQnLCAxKTtcbiAgICAgIGlmICh0eXBlb2Ygc2lnbmVkS2V5SWQgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzaWduZWRLZXlJZCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdG9yZSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2w7XG4gICAgICBjb25zdCB7IHNlcnZlciB9ID0gdGhpcztcblxuICAgICAgY29uc3QgZXhpc3RpbmdLZXlzID0gYXdhaXQgc3RvcmUubG9hZFNpZ25lZFByZUtleXMob3VyVXVpZCk7XG4gICAgICBleGlzdGluZ0tleXMuc29ydCgoYSwgYikgPT4gKGIuY3JlYXRlZF9hdCB8fCAwKSAtIChhLmNyZWF0ZWRfYXQgfHwgMCkpO1xuICAgICAgY29uc3QgY29uZmlybWVkS2V5cyA9IGV4aXN0aW5nS2V5cy5maWx0ZXIoa2V5ID0+IGtleS5jb25maXJtZWQpO1xuICAgICAgY29uc3QgbW9zdFJlY2VudCA9IGNvbmZpcm1lZEtleXNbMF07XG5cbiAgICAgIGlmIChpc01vcmVSZWNlbnRUaGFuKG1vc3RSZWNlbnQ/LmNyZWF0ZWRfYXQgfHwgMCwgUFJFS0VZX1JPVEFUSU9OX0FHRSkpIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYHJvdGF0ZVNpZ25lZFByZUtleSgke3V1aWRLaW5kfSk6ICR7Y29uZmlybWVkS2V5cy5sZW5ndGh9IGAgK1xuICAgICAgICAgICAgYGNvbmZpcm1lZCBrZXlzLCBtb3N0IHJlY2VudCB3YXMgY3JlYXRlZCAke21vc3RSZWNlbnQ/LmNyZWF0ZWRfYXR9LiBDYW5jZWxsaW5nIHJvdGF0aW9uLmBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgaWRlbnRpdHlLZXk6IEtleVBhaXJUeXBlIHwgdW5kZWZpbmVkO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWRlbnRpdHlLZXkgPSBhd2FpdCBzdG9yZS5nZXRJZGVudGl0eUtleVBhaXIob3VyVXVpZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBXZSBzd2FsbG93IGFueSBlcnJvciBoZXJlLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gZ2V0IGludG9cbiAgICAgICAgLy8gICBhIGxvb3Agb2YgcmVwZWF0ZWQgcmV0cmllcy5cbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdGYWlsZWQgdG8gZ2V0IGlkZW50aXR5IGtleS4gQ2FuY2VsaW5nIGtleSByb3RhdGlvbi4nLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlkZW50aXR5S2V5KSB7XG4gICAgICAgIC8vIFRPRE86IERFU0tUT1AtMjg1NVxuICAgICAgICBpZiAodXVpZEtpbmQgPT09IFVVSURLaW5kLlBOSSkge1xuICAgICAgICAgIGxvZy53YXJuKGByb3RhdGVTaWduZWRQcmVLZXkoJHt1dWlkS2luZH0pOiBObyBpZGVudGl0eSBrZXkgcGFpciFgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGByb3RhdGVTaWduZWRQcmVLZXkoJHt1dWlkS2luZH0pOiBObyBpZGVudGl0eSBrZXkgcGFpciFgXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGdlbmVyYXRlU2lnbmVkUHJlS2V5KGlkZW50aXR5S2V5LCBzaWduZWRLZXlJZCk7XG5cbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgcm90YXRlU2lnbmVkUHJlS2V5KCR7dXVpZEtpbmR9KTogU2F2aW5nIG5ldyBzaWduZWQgcHJla2V5YCxcbiAgICAgICAgcmVzLmtleUlkXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHV0KCdzaWduZWRLZXlJZCcsIHNpZ25lZEtleUlkICsgMSksXG4gICAgICAgIHN0b3JlLnN0b3JlU2lnbmVkUHJlS2V5KG91clV1aWQsIHJlcy5rZXlJZCwgcmVzLmtleVBhaXIpLFxuICAgICAgXSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNlcnZlci5zZXRTaWduZWRQcmVLZXkoXG4gICAgICAgICAge1xuICAgICAgICAgICAga2V5SWQ6IHJlcy5rZXlJZCxcbiAgICAgICAgICAgIHB1YmxpY0tleTogcmVzLmtleVBhaXIucHViS2V5LFxuICAgICAgICAgICAgc2lnbmF0dXJlOiByZXMuc2lnbmF0dXJlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXVpZEtpbmRcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICBgcm90YXRlU2lnbmVkUHJla2V5KCR7dXVpZEtpbmR9KSBlcnJvcjpgLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IgJiZcbiAgICAgICAgICBlcnJvci5jb2RlID49IDQwMCAmJlxuICAgICAgICAgIGVycm9yLmNvZGUgPD0gNTk5XG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHJlamVjdGlvbnMgPVxuICAgICAgICAgICAgMSArIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UuZ2V0KCdzaWduZWRLZXlSb3RhdGlvblJlamVjdGVkJywgMCk7XG4gICAgICAgICAgYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wdXQoXG4gICAgICAgICAgICAnc2lnbmVkS2V5Um90YXRpb25SZWplY3RlZCcsXG4gICAgICAgICAgICByZWplY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICBgcm90YXRlU2lnbmVkUHJlS2V5KCR7dXVpZEtpbmR9KTogU2lnbmVkIGtleSByb3RhdGlvbiByZWplY3RlZCBjb3VudDpgLFxuICAgICAgICAgICAgcmVqZWN0aW9uc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgIGxvZy5pbmZvKCdDb25maXJtaW5nIG5ldyBzaWduZWQgcHJla2V5JywgcmVzLmtleUlkKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5yZW1vdmUoJ3NpZ25lZEtleVJvdGF0aW9uUmVqZWN0ZWQnKSxcbiAgICAgICAgc3RvcmUuc3RvcmVTaWduZWRQcmVLZXkob3VyVXVpZCwgcmVzLmtleUlkLCByZXMua2V5UGFpciwgY29uZmlybWVkKSxcbiAgICAgIF0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmNsZWFuU2lnbmVkUHJlS2V5cygpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIC8vIElnbm9yaW5nIHRoZSBlcnJvclxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcXVldWVUYXNrPFQ+KHRhc2s6ICgpID0+IFByb21pc2U8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICB0aGlzLnBlbmRpbmdRdWV1ZSA9IHRoaXMucGVuZGluZ1F1ZXVlIHx8IG5ldyBQUXVldWUoeyBjb25jdXJyZW5jeTogMSB9KTtcbiAgICBjb25zdCB0YXNrV2l0aFRpbWVvdXQgPSBjcmVhdGVUYXNrV2l0aFRpbWVvdXQodGFzaywgJ0FjY291bnRNYW5hZ2VyIHRhc2snKTtcblxuICAgIHJldHVybiB0aGlzLnBlbmRpbmdRdWV1ZS5hZGQodGFza1dpdGhUaW1lb3V0KTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFuU2lnbmVkUHJlS2V5cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgY29uc3Qgc3RvcmUgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sO1xuXG4gICAgY29uc3QgYWxsS2V5cyA9IGF3YWl0IHN0b3JlLmxvYWRTaWduZWRQcmVLZXlzKG91clV1aWQpO1xuICAgIGFsbEtleXMuc29ydCgoYSwgYikgPT4gKGIuY3JlYXRlZF9hdCB8fCAwKSAtIChhLmNyZWF0ZWRfYXQgfHwgMCkpO1xuICAgIGNvbnN0IGNvbmZpcm1lZCA9IGFsbEtleXMuZmlsdGVyKGtleSA9PiBrZXkuY29uZmlybWVkKTtcbiAgICBjb25zdCB1bmNvbmZpcm1lZCA9IGFsbEtleXMuZmlsdGVyKGtleSA9PiAha2V5LmNvbmZpcm1lZCk7XG5cbiAgICBjb25zdCByZWNlbnQgPSBhbGxLZXlzWzBdID8gYWxsS2V5c1swXS5rZXlJZCA6ICdub25lJztcbiAgICBjb25zdCByZWNlbnRDb25maXJtZWQgPSBjb25maXJtZWRbMF0gPyBjb25maXJtZWRbMF0ua2V5SWQgOiAnbm9uZSc7XG4gICAgY29uc3QgcmVjZW50VW5jb25maXJtZWQgPSB1bmNvbmZpcm1lZFswXSA/IHVuY29uZmlybWVkWzBdLmtleUlkIDogJ25vbmUnO1xuICAgIGxvZy5pbmZvKGBjbGVhblNpZ25lZFByZUtleXM6IE1vc3QgcmVjZW50IHNpZ25lZCBrZXk6ICR7cmVjZW50fWApO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGNsZWFuU2lnbmVkUHJlS2V5czogTW9zdCByZWNlbnQgY29uZmlybWVkIHNpZ25lZCBrZXk6ICR7cmVjZW50Q29uZmlybWVkfWBcbiAgICApO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGNsZWFuU2lnbmVkUHJlS2V5czogTW9zdCByZWNlbnQgdW5jb25maXJtZWQgc2lnbmVkIGtleTogJHtyZWNlbnRVbmNvbmZpcm1lZH1gXG4gICAgKTtcbiAgICBsb2cuaW5mbyhcbiAgICAgICdjbGVhblNpZ25lZFByZUtleXM6IFRvdGFsIHNpZ25lZCBrZXkgY291bnQ6JyxcbiAgICAgIGFsbEtleXMubGVuZ3RoLFxuICAgICAgJy0nLFxuICAgICAgY29uZmlybWVkLmxlbmd0aCxcbiAgICAgICdjb25maXJtZWQnXG4gICAgKTtcblxuICAgIC8vIEtlZXAgTUlOSU1VTV9TSUdORURfUFJFS0VZUyBrZXlzLCB0aGVuIGRyb3AgaWYgb2xkZXIgdGhhbiBBUkNISVZFX0FHRVxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgYWxsS2V5cy5tYXAoYXN5bmMgKGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4IDwgTUlOSU1VTV9TSUdORURfUFJFS0VZUykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBrZXkuY3JlYXRlZF9hdCB8fCAwO1xuXG4gICAgICAgIGlmIChpc09sZGVyVGhhbihjcmVhdGVkQXQsIEFSQ0hJVkVfQUdFKSkge1xuICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKGNyZWF0ZWRBdCkudG9KU09OKCk7XG4gICAgICAgICAgY29uc3QgY29uZmlybWVkVGV4dCA9IGtleS5jb25maXJtZWQgPyAnIChjb25maXJtZWQpJyA6ICcnO1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYFJlbW92aW5nIHNpZ25lZCBwcmVrZXk6ICR7a2V5LmtleUlkfSB3aXRoIHRpbWVzdGFtcCAke3RpbWVzdGFtcH0ke2NvbmZpcm1lZFRleHR9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlU2lnbmVkUHJlS2V5KG91clV1aWQsIGtleS5rZXlJZCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUFjY291bnQoe1xuICAgIG51bWJlcixcbiAgICB2ZXJpZmljYXRpb25Db2RlLFxuICAgIGFjaUtleVBhaXIsXG4gICAgcG5pS2V5UGFpcixcbiAgICBwcm9maWxlS2V5LFxuICAgIGRldmljZU5hbWUsXG4gICAgdXNlckFnZW50LFxuICAgIHJlYWRSZWNlaXB0cyxcbiAgICBhY2Nlc3NLZXksXG4gIH06IENyZWF0ZUFjY291bnRPcHRpb25zVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgc3RvcmFnZSB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gICAgbGV0IHBhc3N3b3JkID0gQnl0ZXMudG9CYXNlNjQoZ2V0UmFuZG9tQnl0ZXMoMTYpKTtcbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkLnN1YnN0cmluZygwLCBwYXNzd29yZC5sZW5ndGggLSAyKTtcbiAgICBjb25zdCByZWdpc3RyYXRpb25JZCA9IGdlbmVyYXRlUmVnaXN0cmF0aW9uSWQoKTtcblxuICAgIGNvbnN0IHByZXZpb3VzTnVtYmVyID0gc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IHByZXZpb3VzQUNJID0gc3RvcmFnZS51c2VyLmdldFV1aWQoVVVJREtpbmQuQUNJKT8udG9TdHJpbmcoKTtcbiAgICBjb25zdCBwcmV2aW91c1BOSSA9IHN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLlBOSSk/LnRvU3RyaW5nKCk7XG5cbiAgICBsZXQgZW5jcnlwdGVkRGV2aWNlTmFtZTtcbiAgICBpZiAoZGV2aWNlTmFtZSkge1xuICAgICAgZW5jcnlwdGVkRGV2aWNlTmFtZSA9IHRoaXMuZW5jcnlwdERldmljZU5hbWUoZGV2aWNlTmFtZSwgYWNpS2V5UGFpcik7XG4gICAgICBhd2FpdCB0aGlzLmRldmljZU5hbWVJc0VuY3J5cHRlZCgpO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYGNyZWF0ZUFjY291bnQ6IE51bWJlciBpcyAke251bWJlcn0sIHBhc3N3b3JkIGhhcyBsZW5ndGg6ICR7XG4gICAgICAgIHBhc3N3b3JkID8gcGFzc3dvcmQubGVuZ3RoIDogJ25vbmUnXG4gICAgICB9YFxuICAgICk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VydmVyLmNvbmZpcm1Db2RlKFxuICAgICAgbnVtYmVyLFxuICAgICAgdmVyaWZpY2F0aW9uQ29kZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgcmVnaXN0cmF0aW9uSWQsXG4gICAgICBlbmNyeXB0ZWREZXZpY2VOYW1lLFxuICAgICAgeyBhY2Nlc3NLZXkgfVxuICAgICk7XG5cbiAgICBjb25zdCBvdXJVdWlkID0gVVVJRC5jYXN0KHJlc3BvbnNlLnV1aWQpO1xuICAgIGNvbnN0IG91clBuaSA9IFVVSUQuY2FzdChyZXNwb25zZS5wbmkpO1xuXG4gICAgY29uc3QgdXVpZENoYW5nZWQgPSBwcmV2aW91c0FDSSAmJiBvdXJVdWlkICYmIHByZXZpb3VzQUNJICE9PSBvdXJVdWlkO1xuXG4gICAgLy8gV2Ugb25seSBjb25zaWRlciB0aGUgbnVtYmVyIGNoYW5nZWQgaWYgd2UgZGlkbid0IGhhdmUgYSBVVUlEIGJlZm9yZVxuICAgIGNvbnN0IG51bWJlckNoYW5nZWQgPVxuICAgICAgIXByZXZpb3VzQUNJICYmIHByZXZpb3VzTnVtYmVyICYmIHByZXZpb3VzTnVtYmVyICE9PSBudW1iZXI7XG5cbiAgICBpZiAodXVpZENoYW5nZWQgfHwgbnVtYmVyQ2hhbmdlZCkge1xuICAgICAgaWYgKHV1aWRDaGFuZ2VkKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdjcmVhdGVBY2NvdW50OiBOZXcgdXVpZCBpcyBkaWZmZXJlbnQgZnJvbSBvbGQgdXVpZDsgZGVsZXRpbmcgYWxsIHByZXZpb3VzIGRhdGEnXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAobnVtYmVyQ2hhbmdlZCkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnY3JlYXRlQWNjb3VudDogTmV3IG51bWJlciBpcyBkaWZmZXJlbnQgZnJvbSBvbGQgbnVtYmVyOyBkZWxldGluZyBhbGwgcHJldmlvdXMgZGF0YSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5wcm90b2NvbC5yZW1vdmVBbGxEYXRhKCk7XG4gICAgICAgIGxvZy5pbmZvKCdjcmVhdGVBY2NvdW50OiBTdWNjZXNzZnVsbHkgZGVsZXRlZCBwcmV2aW91cyBkYXRhJyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgJ1NvbWV0aGluZyB3ZW50IHdyb25nIGRlbGV0aW5nIGRhdGEgZnJvbSBwcmV2aW91cyBudW1iZXInLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuaW5mbygnY3JlYXRlQWNjb3VudDogRXJhc2luZyBjb25maWd1cmF0aW9uIChzb2Z0KScpO1xuICAgICAgYXdhaXQgc3RvcmFnZS5wcm90b2NvbC5yZW1vdmVBbGxDb25maWd1cmF0aW9uKFxuICAgICAgICBSZW1vdmVBbGxDb25maWd1cmF0aW9uLlNvZnRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXdhaXQgc2VuZGVyQ2VydGlmaWNhdGVTZXJ2aWNlLmNsZWFyKCk7XG5cbiAgICBjb25zdCBwcmV2aW91c1V1aWRzID0gW3ByZXZpb3VzQUNJLCBwcmV2aW91c1BOSV0uZmlsdGVyKGlzTm90TmlsKTtcblxuICAgIGlmIChwcmV2aW91c1V1aWRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc3RvcmFnZS5wdXQoXG4gICAgICAgICAgJ2lkZW50aXR5S2V5TWFwJyxcbiAgICAgICAgICBvbWl0KHN0b3JhZ2UuZ2V0KCdpZGVudGl0eUtleU1hcCcpIHx8IHt9LCBwcmV2aW91c1V1aWRzKVxuICAgICAgICApLFxuICAgICAgICBzdG9yYWdlLnB1dChcbiAgICAgICAgICAncmVnaXN0cmF0aW9uSWRNYXAnLFxuICAgICAgICAgIG9taXQoc3RvcmFnZS5nZXQoJ3JlZ2lzdHJhdGlvbklkTWFwJykgfHwge30sIHByZXZpb3VzVXVpZHMpXG4gICAgICAgICksXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICAvLyBgc2V0Q3JlZGVudGlhbHNgIG5lZWRzIHRvIGJlIGNhbGxlZFxuICAgIC8vIGJlZm9yZSBgc2F2ZUlkZW50aWZ5V2l0aEF0dHJpYnV0ZXNgIHNpbmNlIGBzYXZlSWRlbnRpdHlXaXRoQXR0cmlidXRlc2BcbiAgICAvLyBpbmRpcmVjdGx5IGNhbGxzIGBDb252ZXJzYXRpb25Db250cm9sbGVyLmdldENvbnZlcmF0aW9uSWQoKWAgd2hpY2hcbiAgICAvLyBpbml0aWFsaXplcyB0aGUgY29udmVyc2F0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIChvdXIgbnVtYmVyKSB3aGljaFxuICAgIC8vIGNhbGxzIG91dCB0byB0aGUgdXNlciBzdG9yYWdlIEFQSSB0byBnZXQgdGhlIHN0b3JlZCBVVUlEIGFuZCBudW1iZXJcbiAgICAvLyBpbmZvcm1hdGlvbi5cbiAgICBhd2FpdCBzdG9yYWdlLnVzZXIuc2V0Q3JlZGVudGlhbHMoe1xuICAgICAgdXVpZDogb3VyVXVpZCxcbiAgICAgIHBuaTogb3VyUG5pLFxuICAgICAgbnVtYmVyLFxuICAgICAgZGV2aWNlSWQ6IHJlc3BvbnNlLmRldmljZUlkID8/IDEsXG4gICAgICBkZXZpY2VOYW1lOiBkZXZpY2VOYW1lID8/IHVuZGVmaW5lZCxcbiAgICAgIHBhc3N3b3JkLFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkb25lIHZlcnkgZWFybHksIGJlY2F1c2UgaXQgY2hhbmdlcyBob3cgdGhpbmdzIGFyZSBzYXZlZCBpbiB0aGVcbiAgICAvLyAgIGRhdGFiYXNlLiBZb3VyIGlkZW50aXR5LCBmb3IgZXhhbXBsZSwgaW4gdGhlIHNhdmVJZGVudGl0eVdpdGhBdHRyaWJ1dGVzIGNhbGxcbiAgICAvLyAgIGJlbG93LlxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgIGFjaTogb3VyVXVpZCxcbiAgICAgIGUxNjQ6IG51bWJlcixcbiAgICAgIHJlYXNvbjogJ2NyZWF0ZUFjY291bnQnLFxuICAgIH0pO1xuXG4gICAgaWYgKCFjb252ZXJzYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RyYXRpb25Eb25lOiBubyBjb252ZXJzYXRpb25JZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZGVudGl0eUF0dHJzID0ge1xuICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB2ZXJpZmllZDogc3RvcmFnZS5wcm90b2NvbC5WZXJpZmllZFN0YXR1cy5WRVJJRklFRCxcbiAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IHRydWUsXG4gICAgfTtcblxuICAgIC8vIHVwZGF0ZSBvdXIgb3duIGlkZW50aXR5IGtleSwgd2hpY2ggbWF5IGhhdmUgY2hhbmdlZFxuICAgIC8vIGlmIHdlJ3JlIHJlbGlua2luZyBhZnRlciBhIHJlaW5zdGFsbCBvbiB0aGUgbWFzdGVyIGRldmljZVxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHN0b3JhZ2UucHJvdG9jb2wuc2F2ZUlkZW50aXR5V2l0aEF0dHJpYnV0ZXMobmV3IFVVSUQob3VyVXVpZCksIHtcbiAgICAgICAgLi4uaWRlbnRpdHlBdHRycyxcbiAgICAgICAgcHVibGljS2V5OiBhY2lLZXlQYWlyLnB1YktleSxcbiAgICAgIH0pLFxuICAgICAgcG5pS2V5UGFpclxuICAgICAgICA/IHN0b3JhZ2UucHJvdG9jb2wuc2F2ZUlkZW50aXR5V2l0aEF0dHJpYnV0ZXMobmV3IFVVSUQob3VyUG5pKSwge1xuICAgICAgICAgICAgLi4uaWRlbnRpdHlBdHRycyxcbiAgICAgICAgICAgIHB1YmxpY0tleTogcG5pS2V5UGFpci5wdWJLZXksXG4gICAgICAgICAgfSlcbiAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGlkZW50aXR5S2V5TWFwID0ge1xuICAgICAgLi4uKHN0b3JhZ2UuZ2V0KCdpZGVudGl0eUtleU1hcCcpIHx8IHt9KSxcbiAgICAgIFtvdXJVdWlkXTogYWNpS2V5UGFpcixcbiAgICAgIC4uLihwbmlLZXlQYWlyXG4gICAgICAgID8ge1xuICAgICAgICAgICAgW291clBuaV06IHBuaUtleVBhaXIsXG4gICAgICAgICAgfVxuICAgICAgICA6IHt9KSxcbiAgICB9O1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbklkTWFwID0ge1xuICAgICAgLi4uKHN0b3JhZ2UuZ2V0KCdyZWdpc3RyYXRpb25JZE1hcCcpIHx8IHt9KSxcbiAgICAgIFtvdXJVdWlkXTogcmVnaXN0cmF0aW9uSWQsXG5cbiAgICAgIC8vIFRPRE86IERFU0tUT1AtMzMxOFxuICAgICAgW291clBuaV06IHJlZ2lzdHJhdGlvbklkLFxuICAgIH07XG5cbiAgICBhd2FpdCBzdG9yYWdlLnB1dCgnaWRlbnRpdHlLZXlNYXAnLCBpZGVudGl0eUtleU1hcCk7XG4gICAgYXdhaXQgc3RvcmFnZS5wdXQoJ3JlZ2lzdHJhdGlvbklkTWFwJywgcmVnaXN0cmF0aW9uSWRNYXApO1xuICAgIGlmIChwcm9maWxlS2V5KSB7XG4gICAgICBhd2FpdCBvdXJQcm9maWxlS2V5U2VydmljZS5zZXQocHJvZmlsZUtleSk7XG4gICAgfVxuICAgIGlmICh1c2VyQWdlbnQpIHtcbiAgICAgIGF3YWl0IHN0b3JhZ2UucHV0KCd1c2VyQWdlbnQnLCB1c2VyQWdlbnQpO1xuICAgIH1cblxuICAgIGF3YWl0IHN0b3JhZ2UucHV0KCdyZWFkLXJlY2VpcHQtc2V0dGluZycsIEJvb2xlYW4ocmVhZFJlY2VpcHRzKSk7XG5cbiAgICBjb25zdCByZWdpb25Db2RlID0gZ2V0UmVnaW9uQ29kZUZvck51bWJlcihudW1iZXIpO1xuICAgIGF3YWl0IHN0b3JhZ2UucHV0KCdyZWdpb25Db2RlJywgcmVnaW9uQ29kZSk7XG4gICAgYXdhaXQgc3RvcmFnZS5wcm90b2NvbC5oeWRyYXRlQ2FjaGVzKCk7XG4gIH1cblxuICBhc3luYyBjbGVhclNlc3Npb25zQW5kUHJlS2V5cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdG9yZSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2w7XG5cbiAgICBsb2cuaW5mbygnY2xlYXJpbmcgYWxsIHNlc3Npb25zLCBwcmVrZXlzLCBhbmQgc2lnbmVkIHByZWtleXMnKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBzdG9yZS5jbGVhclByZUtleVN0b3JlKCksXG4gICAgICBzdG9yZS5jbGVhclNpZ25lZFByZUtleXNTdG9yZSgpLFxuICAgICAgc3RvcmUuY2xlYXJTZXNzaW9uU3RvcmUoKSxcbiAgICBdKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVBOSUlkZW50aXR5KGlkZW50aXR5S2V5UGFpcjogS2V5UGFpclR5cGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHN0b3JhZ2UgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuXG4gICAgbG9nLmluZm8oJ0FjY291bnRNYW5hZ2VyLnVwZGF0ZVBOSUlkZW50aXR5OiBnZW5lcmF0aW5nIG5ldyBrZXlzJyk7XG5cbiAgICBhd2FpdCB0aGlzLnF1ZXVlVGFzayhhc3luYyAoKSA9PiB7XG4gICAgICAvLyBTZXJ2ZXIgaGFzIGFjY2VwdGVkIG91ciBrZXlzIHdoaWNoIG1lYW5zIHdlIGhhdmUgdGhlIGxhdGVzdCBQTkkgaWRlbnRpdHlcbiAgICAgIC8vIG5vdyB0aGF0IGRvZXNuJ3QgY29uZmxpY3QgdGhlIFBOSSBpZGVudGl0eSBvZiB0aGUgcHJpbWFyeSBkZXZpY2UuXG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ0FjY291bnRNYW5hZ2VyLnVwZGF0ZVBOSUlkZW50aXR5OiB1cGRhdGluZyBpZGVudGl0eSBrZXkgJyArXG4gICAgICAgICAgJ2FuZCByZWdpc3RyYXRpb24gaWQnXG4gICAgICApO1xuXG4gICAgICBjb25zdCBwbmkgPSBzdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuUE5JKTtcbiAgICAgIGNvbnN0IGlkZW50aXR5S2V5TWFwID0ge1xuICAgICAgICAuLi4oc3RvcmFnZS5nZXQoJ2lkZW50aXR5S2V5TWFwJykgfHwge30pLFxuICAgICAgICBbcG5pLnRvU3RyaW5nKCldOiBpZGVudGl0eUtleVBhaXIsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhY2kgPSBzdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcbiAgICAgIGNvbnN0IG9sZFJlZ2lzdHJhdGlvbklkTWFwID0gc3RvcmFnZS5nZXQoJ3JlZ2lzdHJhdGlvbklkTWFwJykgfHwge307XG4gICAgICBjb25zdCByZWdpc3RyYXRpb25JZE1hcCA9IHtcbiAgICAgICAgLi4ub2xkUmVnaXN0cmF0aW9uSWRNYXAsXG5cbiAgICAgICAgLy8gVE9ETzogREVTS1RPUC0zMzE4XG4gICAgICAgIFtwbmkudG9TdHJpbmcoKV06IG9sZFJlZ2lzdHJhdGlvbklkTWFwW2FjaS50b1N0cmluZygpXSxcbiAgICAgIH07XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc3RvcmFnZS5wdXQoJ2lkZW50aXR5S2V5TWFwJywgaWRlbnRpdHlLZXlNYXApLFxuICAgICAgICBzdG9yYWdlLnB1dCgncmVnaXN0cmF0aW9uSWRNYXAnLCByZWdpc3RyYXRpb25JZE1hcCksXG4gICAgICBdKTtcblxuICAgICAgYXdhaXQgc3RvcmFnZS5wcm90b2NvbC5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbnRlbnRpb25hbGx5IG5vdCBhd2FpdGluZyBiZWNhc2UgYHVwZGF0ZVBOSUlkZW50aXR5YCBydW5zIG9uIGFuXG4gICAgLy8gRW5jcnlwdGVkIHF1ZXVlIG9mIE1lc3NhZ2VSZWNlaXZlciBhbmQgd2UgZG9uJ3Qgd2FudCB0byBhd2FpdCByZW1vdGVcbiAgICAvLyBlbmRwb2ludHMgYW5kIGJsb2NrIG1lc3NhZ2UgcHJvY2Vzc2luZy5cbiAgICB0aGlzLnF1ZXVlVGFzayhhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBrZXlzID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUtleXMoXG4gICAgICAgICAgU0lHTkVEX0tFWV9HRU5fQkFUQ0hfU0laRSxcbiAgICAgICAgICBVVUlES2luZC5QTkksXG4gICAgICAgICAgaWRlbnRpdHlLZXlQYWlyXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnJlZ2lzdGVyS2V5cyhrZXlzLCBVVUlES2luZC5QTkkpO1xuICAgICAgICBhd2FpdCB0aGlzLmNvbmZpcm1LZXlzKGtleXMsIFVVSURLaW5kLlBOSSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgJ3VwZGF0ZVBOSUlkZW50aXR5OiBGYWlsZWQgdG8gdXBsb2FkIFBOSSBwcmVrZXlzLiBNb3Zpbmcgb24nLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRha2VzIHRoZSBzYW1lIG9iamVjdCByZXR1cm5lZCBieSBnZW5lcmF0ZUtleXNcbiAgYXN5bmMgY29uZmlybUtleXMoXG4gICAga2V5czogR2VuZXJhdGVkS2V5c1R5cGUsXG4gICAgdXVpZEtpbmQ6IFVVSURLaW5kXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0b3JlID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbDtcbiAgICBjb25zdCBrZXkgPSBrZXlzLnNpZ25lZFByZUtleTtcbiAgICBjb25zdCBjb25maXJtZWQgPSB0cnVlO1xuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29uZmlybUtleXM6IHNpZ25lZFByZUtleSBpcyBudWxsJyk7XG4gICAgfVxuXG4gICAgbG9nLmluZm8oXG4gICAgICBgQWNjb3VudE1hbmFnZXIuY29uZmlybUtleXMoJHt1dWlkS2luZH0pOiBjb25maXJtaW5nIGtleWAsXG4gICAgICBrZXkua2V5SWRcbiAgICApO1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQodXVpZEtpbmQpO1xuICAgIGF3YWl0IHN0b3JlLnN0b3JlU2lnbmVkUHJlS2V5KG91clV1aWQsIGtleS5rZXlJZCwga2V5LmtleVBhaXIsIGNvbmZpcm1lZCk7XG4gIH1cblxuICBhc3luYyBnZW5lcmF0ZUtleXMoXG4gICAgY291bnQ6IG51bWJlcixcbiAgICB1dWlkS2luZDogVVVJREtpbmQsXG4gICAgbWF5YmVJZGVudGl0eUtleT86IEtleVBhaXJUeXBlXG4gICk6IFByb21pc2U8R2VuZXJhdGVkS2V5c1R5cGU+IHtcbiAgICBjb25zdCB7IHN0b3JhZ2UgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuXG4gICAgY29uc3Qgc3RhcnRJZCA9IHN0b3JhZ2UuZ2V0KCdtYXhQcmVLZXlJZCcsIDEpO1xuICAgIGNvbnN0IHNpZ25lZEtleUlkID0gc3RvcmFnZS5nZXQoJ3NpZ25lZEtleUlkJywgMSk7XG4gICAgY29uc3Qgb3VyVXVpZCA9IHN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCh1dWlkS2luZCk7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0SWQgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWF4UHJlS2V5SWQnKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzaWduZWRLZXlJZCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzaWduZWRLZXlJZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0b3JlID0gc3RvcmFnZS5wcm90b2NvbDtcbiAgICBjb25zdCBpZGVudGl0eUtleSA9XG4gICAgICBtYXliZUlkZW50aXR5S2V5ID8/IChhd2FpdCBzdG9yZS5nZXRJZGVudGl0eUtleVBhaXIob3VyVXVpZCkpO1xuICAgIHN0cmljdEFzc2VydChpZGVudGl0eUtleSwgJ2dlbmVyYXRlS2V5czogTm8gaWRlbnRpdHkga2V5IHBhaXIhJyk7XG5cbiAgICBjb25zdCByZXN1bHQ6IE9taXQ8R2VuZXJhdGVkS2V5c1R5cGUsICdzaWduZWRQcmVLZXknPiA9IHtcbiAgICAgIHByZUtleXM6IFtdLFxuICAgICAgaWRlbnRpdHlLZXk6IGlkZW50aXR5S2V5LnB1YktleSxcbiAgICB9O1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBmb3IgKGxldCBrZXlJZCA9IHN0YXJ0SWQ7IGtleUlkIDwgc3RhcnRJZCArIGNvdW50OyBrZXlJZCArPSAxKSB7XG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IGdlbmVyYXRlUHJlS2V5KGtleUlkKTtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5zdG9yZVByZUtleShvdXJVdWlkLCByZXMua2V5SWQsIHJlcy5rZXlQYWlyKTtcbiAgICAgICAgICByZXN1bHQucHJlS2V5cy5wdXNoKHtcbiAgICAgICAgICAgIGtleUlkOiByZXMua2V5SWQsXG4gICAgICAgICAgICBwdWJsaWNLZXk6IHJlcy5rZXlQYWlyLnB1YktleSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaWduZWRQcmVLZXkgPSAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gZ2VuZXJhdGVTaWduZWRQcmVLZXkoaWRlbnRpdHlLZXksIHNpZ25lZEtleUlkKTtcbiAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2lnbmVkUHJlS2V5KG91clV1aWQsIHJlcy5rZXlJZCwgcmVzLmtleVBhaXIpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5SWQ6IHJlcy5rZXlJZCxcbiAgICAgICAgcHVibGljS2V5OiByZXMua2V5UGFpci5wdWJLZXksXG4gICAgICAgIHNpZ25hdHVyZTogcmVzLnNpZ25hdHVyZSxcbiAgICAgICAgLy8gc2VydmVyLnJlZ2lzdGVyS2V5cyBkb2Vzbid0IHVzZSBrZXlQYWlyLCBjb25maXJtS2V5cyBkb2VzXG4gICAgICAgIGtleVBhaXI6IHJlcy5rZXlQYWlyLFxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgcHJvbWlzZXMucHVzaChzaWduZWRQcmVLZXkpO1xuICAgIHByb21pc2VzLnB1c2goc3RvcmFnZS5wdXQoJ21heFByZUtleUlkJywgc3RhcnRJZCArIGNvdW50KSk7XG4gICAgcHJvbWlzZXMucHVzaChzdG9yYWdlLnB1dCgnc2lnbmVkS2V5SWQnLCBzaWduZWRLZXlJZCArIDEpKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgIC8vIFRoaXMgaXMgcHJpbWFyaWx5IGZvciB0aGUgc2lnbmVkIHByZWtleSBzdW1tYXJ5IGl0IGxvZ3Mgb3V0XG4gICAgdGhpcy5jbGVhblNpZ25lZFByZUtleXMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5yZXN1bHQsXG4gICAgICBzaWduZWRQcmVLZXk6IGF3YWl0IHNpZ25lZFByZUtleSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0cmF0aW9uRG9uZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygncmVnaXN0cmF0aW9uIGRvbmUnKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZWdpc3RyYXRpb24nKSk7XG4gIH1cblxuICBhc3luYyBzZXRQbmkocG5pOiBzdHJpbmcsIGtleU1hdGVyaWFsPzogUG5pS2V5TWF0ZXJpYWxUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBzdG9yYWdlIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcblxuICAgIGNvbnN0IG9sZFBuaSA9IHN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLlBOSSk/LnRvU3RyaW5nKCk7XG4gICAgaWYgKG9sZFBuaSA9PT0gcG5pICYmICFrZXlNYXRlcmlhbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKGBBY2NvdW50TWFuYWdlci5zZXRQbmkoJHtwbml9KTogdXBkYXRpbmcgZnJvbSAke29sZFBuaX1gKTtcblxuICAgIGlmIChvbGRQbmkpIHtcbiAgICAgIGF3YWl0IHN0b3JhZ2UucHJvdG9jb2wucmVtb3ZlT3VyT2xkUG5pKG5ldyBVVUlEKG9sZFBuaSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHN0b3JhZ2UudXNlci5zZXRQbmkocG5pKTtcblxuICAgIGlmIChrZXlNYXRlcmlhbCkge1xuICAgICAgYXdhaXQgc3RvcmFnZS5wcm90b2NvbC51cGRhdGVPdXJQbmlLZXlNYXRlcmlhbChcbiAgICAgICAgbmV3IFVVSUQocG5pKSxcbiAgICAgICAga2V5TWF0ZXJpYWxcbiAgICAgICk7XG5cbiAgICAgIC8vIEludGVudGlvbmFsbHkgbm90IGF3YWl0aW5nIHNpbmNlIHRoaXMgaXMgcHJvY2Vzc2VkIG9uIGVuY3J5cHRlZCBxdWV1ZVxuICAgICAgLy8gb2YgTWVzc2FnZVJlY2VpdmVyLlxuICAgICAgdGhpcy5xdWV1ZVRhc2soYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlS2V5cyhcbiAgICAgICAgICAgIFNJR05FRF9LRVlfR0VOX0JBVENIX1NJWkUsXG4gICAgICAgICAgICBVVUlES2luZC5QTklcbiAgICAgICAgICApO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyLnJlZ2lzdGVyS2V5cyhrZXlzLCBVVUlES2luZC5QTkkpO1xuICAgICAgICAgIGF3YWl0IHRoaXMuY29uZmlybUtleXMoa2V5cywgVVVJREtpbmQuUE5JKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnc2V0UG5pOiBGYWlsZWQgdG8gdXBsb2FkIFBOSSBwcmVrZXlzLiBNb3Zpbmcgb24nLFxuICAgICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBQTkkgaGFzIGNoYW5nZWQgYW5kIGNyZWRlbnRpYWxzIGFyZSBubyBsb25nZXIgdmFsaWRcbiAgICAgIGF3YWl0IHN0b3JhZ2UucHV0KCdncm91cENyZWRlbnRpYWxzJywgW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihgQWNjb3VudE1hbmFnZXIuc2V0UG5pKCR7cG5pfSk6IG5vIGtleSBtYXRlcmlhbGApO1xuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHFCQUFtQjtBQUNuQixvQkFBcUI7QUFFckIseUJBQXdCO0FBRXhCLG9CQUEwQjtBQUUxQixnQ0FBK0I7QUFFL0IsNkJBQWtDO0FBQ2xDLFlBQXVCO0FBQ3ZCLG9DQUF1QztBQUN2QyxhQUF3QjtBQUN4QiwrQkFBeUM7QUFDekMsb0JBTU87QUFDUCxtQkFJTztBQUNQLGtCQUErQjtBQUMvQix1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
