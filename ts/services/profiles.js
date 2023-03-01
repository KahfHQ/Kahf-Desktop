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
var profiles_exports = {};
__export(profiles_exports, {
  ProfileService: () => ProfileService,
  profileService: () => profileService
});
module.exports = __toCommonJS(profiles_exports);
var import_p_queue = __toESM(require("p-queue"));
var log = __toESM(require("../logging/log"));
var Errors = __toESM(require("../types/errors"));
var Bytes = __toESM(require("../Bytes"));
var import_explodePromise = require("../util/explodePromise");
var import_isRecord = require("../util/isRecord");
var import_sleep = require("../util/sleep");
var import_durations = require("../util/durations");
var import_zkgroup = require("../util/zkgroup");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_userLanguages = require("../util/userLanguages");
var import_parseBadgesFromServer = require("../badges/parseBadgesFromServer");
var import_assert = require("../util/assert");
var import_findRetryAfterTimeFromError = require("../jobs/helpers/findRetryAfterTimeFromError");
var import_SealedSender = require("../types/SealedSender");
var import_Errors = require("../textsecure/Errors");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
var import_Crypto = require("../Crypto");
class ProfileService {
  constructor(fetchProfile = doGetProfile) {
    this.fetchProfile = fetchProfile;
    this.jobsByConversationId = /* @__PURE__ */ new Map();
    this.isPaused = false;
    this.jobQueue = new import_p_queue.default({ concurrency: 3, timeout: import_durations.MINUTE * 2 });
    this.jobsByConversationId = /* @__PURE__ */ new Map();
    log.info("Profile Service initialized");
  }
  async get(conversationId) {
    const preCheckConversation = window.ConversationController.get(conversationId);
    if (!preCheckConversation) {
      throw new Error(`ProfileServices.get: Pre-check conversation ${conversationId} not found`);
    }
    if (this.isPaused) {
      throw new Error(`ProfileService.get: Cannot add job to paused queue for conversation ${preCheckConversation.idForLogging()}`);
    }
    const existing = this.jobsByConversationId.get(conversationId);
    if (existing) {
      return existing.promise;
    }
    const { resolve, reject, promise } = (0, import_explodePromise.explodePromise)();
    const jobData = {
      promise,
      resolve,
      reject,
      startTime: Date.now()
    };
    const job = /* @__PURE__ */ __name(async () => {
      const conversation = window.ConversationController.get(conversationId);
      if (!conversation) {
        throw new Error(`ProfileServices.get: Conversation ${conversationId} not found`);
      }
      try {
        await this.fetchProfile(conversation);
        resolve();
      } catch (error) {
        reject(error);
        if (this.isPaused) {
          return;
        }
        if ((0, import_isRecord.isRecord)(error) && "code" in error && error.code === 413) {
          this.clearAll("got 413 from server");
          const time = (0, import_findRetryAfterTimeFromError.findRetryAfterTimeFromError)(error);
          this.pause(time);
        }
      } finally {
        this.jobsByConversationId.delete(conversationId);
        const now = Date.now();
        const delta = now - jobData.startTime;
        if (delta > 30 * import_durations.SECOND) {
          log.warn(`ProfileServices.get: Job for ${conversation.idForLogging()} finished ${delta}ms after queue`);
        }
      }
    }, "job");
    this.jobsByConversationId.set(conversationId, jobData);
    this.jobQueue.add(job);
    return promise;
  }
  clearAll(reason) {
    if (this.isPaused) {
      log.warn(`ProfileService.clearAll: Already paused; not clearing; reason: '${reason}'`);
      return;
    }
    log.info(`ProfileService.clearAll: Clearing; reason: '${reason}'`);
    try {
      this.isPaused = true;
      this.jobQueue.pause();
      this.jobsByConversationId.forEach((job) => {
        job.reject(new Error(`ProfileService.clearAll: job cancelled because '${reason}'`));
      });
      this.jobsByConversationId.clear();
      this.jobQueue.clear();
      this.jobQueue.start();
    } finally {
      this.isPaused = false;
      log.info("ProfileService.clearAll: Done clearing");
    }
  }
  async pause(timeInMS) {
    if (this.isPaused) {
      log.warn("ProfileService.pause: Already paused, not pausing again.");
      return;
    }
    log.info(`ProfileService.pause: Pausing queue for ${timeInMS}ms`);
    this.isPaused = true;
    this.jobQueue.pause();
    try {
      await (0, import_sleep.sleep)(timeInMS);
    } finally {
      log.info("ProfileService.pause: Restarting queue");
      this.jobQueue.start();
      this.isPaused = false;
    }
  }
}
const profileService = new ProfileService();
async function doGetProfile(c) {
  const idForLogging = c.idForLogging();
  const { messaging } = window.textsecure;
  (0, import_assert.strictAssert)(messaging, "getProfile: window.textsecure.messaging not available");
  const { updatesUrl } = window.SignalContext.config;
  (0, import_assert.strictAssert)(typeof updatesUrl === "string", "getProfile: expected updatesUrl to be a defined string");
  const clientZkProfileCipher = (0, import_zkgroup.getClientZkProfileOperations)(window.getServerPublicParams());
  const userLanguages = (0, import_userLanguages.getUserLanguages)(navigator.languages, window.getLocale());
  let profile;
  c.deriveAccessKeyIfNeeded();
  const profileKey = c.get("profileKey");
  const profileKeyVersion = c.deriveProfileKeyVersion();
  const uuid = c.getCheckedUuid("getProfile");
  const lastProfile = c.get("lastProfile");
  let profileCredentialRequestContext;
  let getProfileOptions;
  let accessKey = c.get("accessKey");
  if (profileKey) {
    (0, import_assert.strictAssert)(profileKeyVersion && accessKey, "profileKeyVersion and accessKey are derived from profileKey");
    if (!c.hasProfileKeyCredentialExpired()) {
      getProfileOptions = {
        accessKey,
        profileKeyVersion,
        userLanguages
      };
    } else {
      log.info(`getProfile: generating profile key credential request for conversation ${idForLogging}`);
      let profileKeyCredentialRequestHex;
      ({
        requestHex: profileKeyCredentialRequestHex,
        context: profileCredentialRequestContext
      } = (0, import_zkgroup.generateProfileKeyCredentialRequest)(clientZkProfileCipher, uuid.toString(), profileKey));
      getProfileOptions = {
        accessKey,
        userLanguages,
        profileKeyVersion,
        profileKeyCredentialRequest: profileKeyCredentialRequestHex
      };
    }
  } else {
    (0, import_assert.strictAssert)(!accessKey, "accessKey have to be absent because there is no profileKey");
    if (lastProfile?.profileKeyVersion) {
      getProfileOptions = {
        userLanguages,
        profileKeyVersion: lastProfile.profileKeyVersion
      };
    } else {
      getProfileOptions = { userLanguages };
    }
  }
  const isVersioned = Boolean(getProfileOptions.profileKeyVersion);
  log.info(`getProfile: getting ${isVersioned ? "versioned" : "unversioned"} profile for conversation ${idForLogging}`);
  try {
    if (getProfileOptions.accessKey) {
      try {
        profile = await messaging.getProfile(uuid, getProfileOptions);
      } catch (error) {
        if (!(error instanceof import_Errors.HTTPError)) {
          throw error;
        }
        if (error.code === 401 || error.code === 403) {
          if ((0, import_whatTypeOfConversation.isMe)(c.attributes)) {
            throw error;
          }
          await c.setProfileKey(void 0);
          return doGetProfile(c);
        }
        if (error.code === 404) {
          await c.removeLastProfile(lastProfile);
        }
        throw error;
      }
    } else {
      try {
        profile = await messaging.getProfile(uuid, getProfileOptions);
      } catch (error) {
        if (error instanceof import_Errors.HTTPError && error.code === 404) {
          log.info(`getProfile: failed to find a profile for ${idForLogging}`);
          await c.removeLastProfile(lastProfile);
          if (!isVersioned) {
            log.info(`getProfile: marking ${idForLogging} as unregistered`);
            c.setUnregistered();
          }
        }
        throw error;
      }
    }
    if ((0, import_whatTypeOfConversation.isMe)(c.attributes) && profileKey && profileKeyVersion) {
      try {
        await maybeGetPNICredential(c, {
          clientZkProfileCipher,
          profileKey,
          profileKeyVersion,
          userLanguages
        });
      } catch (error) {
        log.warn("getProfile failed to get our own PNI credential", Errors.toLogFormat(error));
      }
    }
    if (profile.identityKey) {
      const identityKey = Bytes.fromBase64(profile.identityKey);
      const changed = await window.textsecure.storage.protocol.saveIdentity(new import_Address.Address(uuid, 1), identityKey, false);
      if (changed) {
        const ourUuid = window.textsecure.storage.user.getCheckedUuid();
        await window.textsecure.storage.protocol.archiveSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(uuid, 1)));
      }
    }
    accessKey = c.get("accessKey");
    if (profile.unrestrictedUnidentifiedAccess && profile.unidentifiedAccess) {
      log.info(`getProfile: setting sealedSender to UNRESTRICTED for conversation ${idForLogging}`);
      c.set({
        sealedSender: import_SealedSender.SEALED_SENDER.UNRESTRICTED
      });
    } else if (accessKey && profile.unidentifiedAccess) {
      const haveCorrectKey = (0, import_Crypto.verifyAccessKey)(Bytes.fromBase64(accessKey), Bytes.fromBase64(profile.unidentifiedAccess));
      if (haveCorrectKey) {
        log.info(`getProfile: setting sealedSender to ENABLED for conversation ${idForLogging}`);
        c.set({
          sealedSender: import_SealedSender.SEALED_SENDER.ENABLED
        });
      } else {
        log.warn(`getProfile: setting sealedSender to DISABLED for conversation ${idForLogging}`);
        c.set({
          sealedSender: import_SealedSender.SEALED_SENDER.DISABLED
        });
      }
    } else {
      log.info(`getProfile: setting sealedSender to DISABLED for conversation ${idForLogging}`);
      c.set({
        sealedSender: import_SealedSender.SEALED_SENDER.DISABLED
      });
    }
    const rawDecryptionKey = c.get("profileKey") || lastProfile?.profileKey;
    const decryptionKey2 = rawDecryptionKey ? Bytes.fromBase64(rawDecryptionKey) : void 0;
    if (profile.about) {
      if (decryptionKey2) {
        const decrypted = (0, import_Crypto.decryptProfile)(Bytes.fromBase64(profile.about), decryptionKey2);
        c.set("about", Bytes.toString((0, import_Crypto.trimForDisplay)(decrypted)));
      }
    } else {
      c.unset("about");
    }
    if (profile.aboutEmoji) {
      if (decryptionKey2) {
        const decrypted = (0, import_Crypto.decryptProfile)(Bytes.fromBase64(profile.aboutEmoji), decryptionKey2);
        c.set("aboutEmoji", Bytes.toString((0, import_Crypto.trimForDisplay)(decrypted)));
      }
    } else {
      c.unset("aboutEmoji");
    }
    if (profile.paymentAddress && (0, import_whatTypeOfConversation.isMe)(c.attributes)) {
      window.storage.put("paymentAddress", profile.paymentAddress);
    }
    if (profile.capabilities) {
      c.set({ capabilities: profile.capabilities });
    } else {
      c.unset("capabilities");
    }
    const badges = (0, import_parseBadgesFromServer.parseBadgesFromServer)(profile.badges, updatesUrl);
    if (badges.length) {
      await window.reduxActions.badges.updateOrCreate(badges);
      c.set({
        badges: badges.map((badge) => ({
          id: badge.id,
          ..."expiresAt" in badge ? {
            expiresAt: badge.expiresAt,
            isVisible: badge.isVisible
          } : {}
        }))
      });
    } else {
      c.unset("badges");
    }
    if (profileCredentialRequestContext) {
      if (profile.credential) {
        const {
          credential: profileKeyCredential,
          expiration: profileKeyCredentialExpiration
        } = (0, import_zkgroup.handleProfileKeyCredential)(clientZkProfileCipher, profileCredentialRequestContext, profile.credential);
        c.set({ profileKeyCredential, profileKeyCredentialExpiration });
      } else {
        log.warn("getProfile: Included credential request, but got no credential. Clearing profileKeyCredential.");
        c.unset("profileKeyCredential");
      }
    }
  } catch (error) {
    if (!(error instanceof import_Errors.HTTPError)) {
      throw error;
    }
    switch (error.code) {
      case 401:
      case 403:
        if (c.get("sealedSender") === import_SealedSender.SEALED_SENDER.ENABLED || c.get("sealedSender") === import_SealedSender.SEALED_SENDER.UNRESTRICTED) {
          log.warn(`getProfile: Got 401/403 when using accessKey for ${idForLogging}, removing profileKey`);
          if (!(0, import_whatTypeOfConversation.isMe)(c.attributes)) {
            await c.setProfileKey(void 0);
          }
        }
        if (c.get("sealedSender") === import_SealedSender.SEALED_SENDER.UNKNOWN) {
          log.warn(`getProfile: Got 401/403 when using accessKey for ${idForLogging}, setting sealedSender = DISABLED`);
          c.set("sealedSender", import_SealedSender.SEALED_SENDER.DISABLED);
        }
        return;
      default:
        log.warn("getProfile failure:", idForLogging, Errors.toLogFormat(error));
        return;
    }
  }
  const decryptionKeyString = profileKey || lastProfile?.profileKey;
  const decryptionKey = decryptionKeyString ? Bytes.fromBase64(decryptionKeyString) : void 0;
  let isSuccessfullyDecrypted = true;
  if (profile.name) {
    if (decryptionKey) {
      try {
        await c.setEncryptedProfileName(profile.name, decryptionKey);
      } catch (error) {
        log.warn("getProfile decryption failure:", idForLogging, Errors.toLogFormat(error));
        isSuccessfullyDecrypted = false;
        await c.set({
          profileName: void 0,
          profileFamilyName: void 0
        });
      }
    }
  } else {
    c.set({
      profileName: void 0,
      profileFamilyName: void 0
    });
  }
  try {
    if (decryptionKey) {
      await c.setProfileAvatar(profile.avatar, decryptionKey);
    }
  } catch (error) {
    if (error instanceof import_Errors.HTTPError) {
      if (error.code === 403 || error.code === 404) {
        log.warn(`getProfile: profile avatar is missing for conversation ${idForLogging}`);
      }
    } else {
      log.warn(`getProfile: failed to decrypt avatar for conversation ${idForLogging}`, Errors.toLogFormat(error));
      isSuccessfullyDecrypted = false;
    }
  }
  c.set("profileLastFetchedAt", Date.now());
  if (isSuccessfullyDecrypted && profileKey && getProfileOptions.profileKeyVersion) {
    await c.updateLastProfile(lastProfile, {
      profileKey,
      profileKeyVersion: getProfileOptions.profileKeyVersion
    });
  }
  window.Signal.Data.updateConversation(c.attributes);
}
async function maybeGetPNICredential(c, {
  clientZkProfileCipher,
  profileKey,
  profileKeyVersion,
  userLanguages
}) {
  if (c.get("pniCredential")) {
    return;
  }
  (0, import_assert.strictAssert)((0, import_whatTypeOfConversation.isMe)(c.attributes), "Has to fetch PNI credential for ourselves");
  log.info("maybeGetPNICredential: requesting PNI credential");
  const { storage, messaging } = window.textsecure;
  (0, import_assert.strictAssert)(messaging, "maybeGetPNICredential: window.textsecure.messaging not available");
  const ourACI = storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  const ourPNI = storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI);
  const {
    requestHex: profileKeyCredentialRequestHex,
    context: profileCredentialRequestContext
  } = (0, import_zkgroup.generatePNICredentialRequest)(clientZkProfileCipher, ourACI.toString(), ourPNI.toString(), profileKey);
  const profile = await messaging.getProfile(ourACI, {
    userLanguages,
    profileKeyVersion,
    profileKeyCredentialRequest: profileKeyCredentialRequestHex,
    credentialType: "pni"
  });
  (0, import_assert.strictAssert)(profile.pniCredential, "We must get the credential for ourselves");
  const pniCredential = (0, import_zkgroup.handleProfileKeyPNICredential)(clientZkProfileCipher, profileCredentialRequestContext, profile.pniCredential);
  c.set({ pniCredential });
  log.info("maybeGetPNICredential: updated PNI credential");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProfileService,
  profileService
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJvZmlsZXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUge1xuICBQcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3RDb250ZXh0LFxuICBDbGllbnRaa1Byb2ZpbGVPcGVyYXRpb25zLFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQvemtncm91cCc7XG5pbXBvcnQgUFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUge1xuICBHZXRQcm9maWxlT3B0aW9uc1R5cGUsXG4gIEdldFByb2ZpbGVVbmF1dGhPcHRpb25zVHlwZSxcbn0gZnJvbSAnLi4vdGV4dHNlY3VyZS9XZWJBUEknO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHsgZXhwbG9kZVByb21pc2UgfSBmcm9tICcuLi91dGlsL2V4cGxvZGVQcm9taXNlJztcbmltcG9ydCB7IGlzUmVjb3JkIH0gZnJvbSAnLi4vdXRpbC9pc1JlY29yZCc7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4uL3V0aWwvc2xlZXAnO1xuaW1wb3J0IHsgTUlOVVRFLCBTRUNPTkQgfSBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQge1xuICBnZW5lcmF0ZVByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdCxcbiAgZ2VuZXJhdGVQTklDcmVkZW50aWFsUmVxdWVzdCxcbiAgZ2V0Q2xpZW50WmtQcm9maWxlT3BlcmF0aW9ucyxcbiAgaGFuZGxlUHJvZmlsZUtleUNyZWRlbnRpYWwsXG4gIGhhbmRsZVByb2ZpbGVLZXlQTklDcmVkZW50aWFsLFxufSBmcm9tICcuLi91dGlsL3prZ3JvdXAnO1xuaW1wb3J0IHsgaXNNZSB9IGZyb20gJy4uL3V0aWwvd2hhdFR5cGVPZkNvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRVc2VyTGFuZ3VhZ2VzIH0gZnJvbSAnLi4vdXRpbC91c2VyTGFuZ3VhZ2VzJztcbmltcG9ydCB7IHBhcnNlQmFkZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4uL2JhZGdlcy9wYXJzZUJhZGdlc0Zyb21TZXJ2ZXInO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgZmluZFJldHJ5QWZ0ZXJUaW1lRnJvbUVycm9yIH0gZnJvbSAnLi4vam9icy9oZWxwZXJzL2ZpbmRSZXRyeUFmdGVyVGltZUZyb21FcnJvcic7XG5pbXBvcnQgeyBTRUFMRURfU0VOREVSIH0gZnJvbSAnLi4vdHlwZXMvU2VhbGVkU2VuZGVyJztcbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4uL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCB7IEFkZHJlc3MgfSBmcm9tICcuLi90eXBlcy9BZGRyZXNzJztcbmltcG9ydCB7IFF1YWxpZmllZEFkZHJlc3MgfSBmcm9tICcuLi90eXBlcy9RdWFsaWZpZWRBZGRyZXNzJztcbmltcG9ydCB7IFVVSURLaW5kIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyB0cmltRm9yRGlzcGxheSwgdmVyaWZ5QWNjZXNzS2V5LCBkZWNyeXB0UHJvZmlsZSB9IGZyb20gJy4uL0NyeXB0byc7XG5cbnR5cGUgSm9iVHlwZSA9IHtcbiAgcmVzb2x2ZTogKCkgPT4gdm9pZDtcbiAgcmVqZWN0OiAoZXJyb3I6IEVycm9yKSA9PiB2b2lkO1xuICBwcm9taXNlOiBQcm9taXNlPHZvaWQ+O1xuICBzdGFydFRpbWU6IG51bWJlcjtcbn07XG5cbi8vIEdvYWxzIGZvciB0aGlzIHNlcnZpY2U6XG4vLyAgIDEuIEVuc3VyZSB0aGF0IHdoZW4gd2UgZ2V0IGEgNDEzIGZyb20gdGhlIHNlcnZlciwgd2Ugc3RvcCBmaXJpbmcgb2ZmIHByb2ZpbGVcbi8vICAgICAgZmV0Y2hlcyBmb3IgYSB3aGlsZS5cbi8vICAgMi4gRW5zdXJlIHRoYXQgYWxsIGV4aXN0aW5nIHByb2ZpbGUgZmV0Y2hlcyBkb24ndCBoYW5nIGluIHRoaXMgY2FzZTsgdG8gc29sdmUgdGhpcyB3ZVxuLy8gICAgICBjYW5jZWwgYWxsIG91dHN0YW5kaW5nIHJlcXVlc3RzIHdoZW4gd2UgaGl0IGEgNDEzLCBhbmQgdGhyb3cgaW5zdGVhZCBvZiBxdWV1ZWluZ1xuLy8gICAgICBzb21ldGhpbmcgbmV3IGlmIHdlJ3JlIHdhaXRpbmcgZHVlIHRvIGEgcmV0cnktYWZ0ZXIuIE5vdGU6IEl0J3Mgbm8gd29yc2UgdGhhbiB3aGF0XG4vLyAgICAgIHdlIHdlcmUgZG9pbmcgYmVmb3JlLCBmYWlsaW5nIGFsbCByZXF1ZXN0cyBhbmQgcHVzaGluZyB0aGUgcmV0cnktYWZ0ZXIgdGltZSBvdXRcbi8vICAgICAgZnVydGhlci5cbi8vICAgMy4gUmVxdWlyZSBubyBjaGFuZ2VzIHRvIGNhbGxlcnMuXG5cbi8vIFBvdGVudGlhbCBmdXR1cmUgZ29hbHMgZm9yIHRoaXMgcHJvYmxlbSBhcmVhOlxuLy8gICAtIFVwZGF0ZSBhbGwgZ2V0UHJvZmlsZXMoKSBjYWxsZXJzOyBtYWtlIHRoZW0gcmVzaWxpZW50IHRvIGxvbmdlciBkZWxheXNcbi8vICAgLSBLZWVwIHRyYWNrIG9mIGxhc3QgcHJvZmlsZSBmZXRjaCBwZXIgY29udmVyc2F0aW9uLCByZWR1Y2UgdW5uZWNlc3NhcnkgcmUtZmV0Y2hlc1xuLy8gICAtIEVuZm9yY2UgYSBtYXhpbXVtIHByb2ZpbGUgZmV0Y2ggZnJlcXVlbmN5XG4vLyAgIC0gRG9uJ3QgZXZlbiBhdHRlbXB0IGpvYnMgd2hlbiBvZmZsaW5lXG5cbmV4cG9ydCBjbGFzcyBQcm9maWxlU2VydmljZSB7XG4gIHByaXZhdGUgam9iUXVldWU6IFBRdWV1ZTtcblxuICBwcml2YXRlIGpvYnNCeUNvbnZlcnNhdGlvbklkOiBNYXA8c3RyaW5nLCBKb2JUeXBlPiA9IG5ldyBNYXAoKTtcblxuICBwcml2YXRlIGlzUGF1c2VkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmZXRjaFByb2ZpbGUgPSBkb0dldFByb2ZpbGUpIHtcbiAgICB0aGlzLmpvYlF1ZXVlID0gbmV3IFBRdWV1ZSh7IGNvbmN1cnJlbmN5OiAzLCB0aW1lb3V0OiBNSU5VVEUgKiAyIH0pO1xuICAgIHRoaXMuam9ic0J5Q29udmVyc2F0aW9uSWQgPSBuZXcgTWFwKCk7XG5cbiAgICBsb2cuaW5mbygnUHJvZmlsZSBTZXJ2aWNlIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwcmVDaGVja0NvbnZlcnNhdGlvbiA9XG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghcHJlQ2hlY2tDb252ZXJzYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFByb2ZpbGVTZXJ2aWNlcy5nZXQ6IFByZS1jaGVjayBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH0gbm90IGZvdW5kYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgUHJvZmlsZVNlcnZpY2UuZ2V0OiBDYW5ub3QgYWRkIGpvYiB0byBwYXVzZWQgcXVldWUgZm9yIGNvbnZlcnNhdGlvbiAke3ByZUNoZWNrQ29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmpvYnNCeUNvbnZlcnNhdGlvbklkLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICByZXR1cm4gZXhpc3RpbmcucHJvbWlzZTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHJlc29sdmUsIHJlamVjdCwgcHJvbWlzZSB9ID0gZXhwbG9kZVByb21pc2U8dm9pZD4oKTtcbiAgICBjb25zdCBqb2JEYXRhID0ge1xuICAgICAgcHJvbWlzZSxcbiAgICAgIHJlc29sdmUsXG4gICAgICByZWplY3QsXG4gICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgfTtcblxuICAgIGNvbnN0IGpvYiA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFByb2ZpbGVTZXJ2aWNlcy5nZXQ6IENvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbklkfSBub3QgZm91bmRgXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZmV0Y2hQcm9maWxlKGNvbnZlcnNhdGlvbik7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNSZWNvcmQoZXJyb3IpICYmICdjb2RlJyBpbiBlcnJvciAmJiBlcnJvci5jb2RlID09PSA0MTMpIHtcbiAgICAgICAgICB0aGlzLmNsZWFyQWxsKCdnb3QgNDEzIGZyb20gc2VydmVyJyk7XG4gICAgICAgICAgY29uc3QgdGltZSA9IGZpbmRSZXRyeUFmdGVyVGltZUZyb21FcnJvcihlcnJvcik7XG4gICAgICAgICAgdGhpcy5wYXVzZSh0aW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5qb2JzQnlDb252ZXJzYXRpb25JZC5kZWxldGUoY29udmVyc2F0aW9uSWQpO1xuXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gbm93IC0gam9iRGF0YS5zdGFydFRpbWU7XG4gICAgICAgIGlmIChkZWx0YSA+IDMwICogU0VDT05EKSB7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgUHJvZmlsZVNlcnZpY2VzLmdldDogSm9iIGZvciAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gZmluaXNoZWQgJHtkZWx0YX1tcyBhZnRlciBxdWV1ZWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuam9ic0J5Q29udmVyc2F0aW9uSWQuc2V0KGNvbnZlcnNhdGlvbklkLCBqb2JEYXRhKTtcbiAgICB0aGlzLmpvYlF1ZXVlLmFkZChqb2IpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJBbGwocmVhc29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBQcm9maWxlU2VydmljZS5jbGVhckFsbDogQWxyZWFkeSBwYXVzZWQ7IG5vdCBjbGVhcmluZzsgcmVhc29uOiAnJHtyZWFzb259J2BcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oYFByb2ZpbGVTZXJ2aWNlLmNsZWFyQWxsOiBDbGVhcmluZzsgcmVhc29uOiAnJHtyZWFzb259J2ApO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5qb2JRdWV1ZS5wYXVzZSgpO1xuXG4gICAgICB0aGlzLmpvYnNCeUNvbnZlcnNhdGlvbklkLmZvckVhY2goam9iID0+IHtcbiAgICAgICAgam9iLnJlamVjdChcbiAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgUHJvZmlsZVNlcnZpY2UuY2xlYXJBbGw6IGpvYiBjYW5jZWxsZWQgYmVjYXVzZSAnJHtyZWFzb259J2BcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5qb2JzQnlDb252ZXJzYXRpb25JZC5jbGVhcigpO1xuICAgICAgdGhpcy5qb2JRdWV1ZS5jbGVhcigpO1xuXG4gICAgICB0aGlzLmpvYlF1ZXVlLnN0YXJ0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgIGxvZy5pbmZvKCdQcm9maWxlU2VydmljZS5jbGVhckFsbDogRG9uZSBjbGVhcmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwYXVzZSh0aW1lSW5NUzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgIGxvZy53YXJuKCdQcm9maWxlU2VydmljZS5wYXVzZTogQWxyZWFkeSBwYXVzZWQsIG5vdCBwYXVzaW5nIGFnYWluLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKGBQcm9maWxlU2VydmljZS5wYXVzZTogUGF1c2luZyBxdWV1ZSBmb3IgJHt0aW1lSW5NU31tc2ApO1xuXG4gICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG4gICAgdGhpcy5qb2JRdWV1ZS5wYXVzZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHNsZWVwKHRpbWVJbk1TKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgbG9nLmluZm8oJ1Byb2ZpbGVTZXJ2aWNlLnBhdXNlOiBSZXN0YXJ0aW5nIHF1ZXVlJyk7XG4gICAgICB0aGlzLmpvYlF1ZXVlLnN0YXJ0KCk7XG4gICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlU2VydmljZSA9IG5ldyBQcm9maWxlU2VydmljZSgpO1xuXG5hc3luYyBmdW5jdGlvbiBkb0dldFByb2ZpbGUoYzogQ29udmVyc2F0aW9uTW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgaWRGb3JMb2dnaW5nID0gYy5pZEZvckxvZ2dpbmcoKTtcbiAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICBzdHJpY3RBc3NlcnQoXG4gICAgbWVzc2FnaW5nLFxuICAgICdnZXRQcm9maWxlOiB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcgbm90IGF2YWlsYWJsZSdcbiAgKTtcblxuICBjb25zdCB7IHVwZGF0ZXNVcmwgfSA9IHdpbmRvdy5TaWduYWxDb250ZXh0LmNvbmZpZztcbiAgc3RyaWN0QXNzZXJ0KFxuICAgIHR5cGVvZiB1cGRhdGVzVXJsID09PSAnc3RyaW5nJyxcbiAgICAnZ2V0UHJvZmlsZTogZXhwZWN0ZWQgdXBkYXRlc1VybCB0byBiZSBhIGRlZmluZWQgc3RyaW5nJ1xuICApO1xuXG4gIGNvbnN0IGNsaWVudFprUHJvZmlsZUNpcGhlciA9IGdldENsaWVudFprUHJvZmlsZU9wZXJhdGlvbnMoXG4gICAgd2luZG93LmdldFNlcnZlclB1YmxpY1BhcmFtcygpXG4gICk7XG5cbiAgY29uc3QgdXNlckxhbmd1YWdlcyA9IGdldFVzZXJMYW5ndWFnZXMoXG4gICAgbmF2aWdhdG9yLmxhbmd1YWdlcyxcbiAgICB3aW5kb3cuZ2V0TG9jYWxlKClcbiAgKTtcblxuICBsZXQgcHJvZmlsZTtcblxuICBjLmRlcml2ZUFjY2Vzc0tleUlmTmVlZGVkKCk7XG5cbiAgY29uc3QgcHJvZmlsZUtleSA9IGMuZ2V0KCdwcm9maWxlS2V5Jyk7XG4gIGNvbnN0IHByb2ZpbGVLZXlWZXJzaW9uID0gYy5kZXJpdmVQcm9maWxlS2V5VmVyc2lvbigpO1xuICBjb25zdCB1dWlkID0gYy5nZXRDaGVja2VkVXVpZCgnZ2V0UHJvZmlsZScpO1xuICBjb25zdCBsYXN0UHJvZmlsZSA9IGMuZ2V0KCdsYXN0UHJvZmlsZScpO1xuXG4gIGxldCBwcm9maWxlQ3JlZGVudGlhbFJlcXVlc3RDb250ZXh0OlxuICAgIHwgdW5kZWZpbmVkXG4gICAgfCBQcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3RDb250ZXh0O1xuXG4gIGxldCBnZXRQcm9maWxlT3B0aW9uczogR2V0UHJvZmlsZU9wdGlvbnNUeXBlIHwgR2V0UHJvZmlsZVVuYXV0aE9wdGlvbnNUeXBlO1xuXG4gIGxldCBhY2Nlc3NLZXkgPSBjLmdldCgnYWNjZXNzS2V5Jyk7XG4gIGlmIChwcm9maWxlS2V5KSB7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgcHJvZmlsZUtleVZlcnNpb24gJiYgYWNjZXNzS2V5LFxuICAgICAgJ3Byb2ZpbGVLZXlWZXJzaW9uIGFuZCBhY2Nlc3NLZXkgYXJlIGRlcml2ZWQgZnJvbSBwcm9maWxlS2V5J1xuICAgICk7XG5cbiAgICBpZiAoIWMuaGFzUHJvZmlsZUtleUNyZWRlbnRpYWxFeHBpcmVkKCkpIHtcbiAgICAgIGdldFByb2ZpbGVPcHRpb25zID0ge1xuICAgICAgICBhY2Nlc3NLZXksXG4gICAgICAgIHByb2ZpbGVLZXlWZXJzaW9uLFxuICAgICAgICB1c2VyTGFuZ3VhZ2VzLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdnZXRQcm9maWxlOiBnZW5lcmF0aW5nIHByb2ZpbGUga2V5IGNyZWRlbnRpYWwgcmVxdWVzdCBmb3IgJyArXG4gICAgICAgICAgYGNvbnZlcnNhdGlvbiAke2lkRm9yTG9nZ2luZ31gXG4gICAgICApO1xuXG4gICAgICBsZXQgcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0SGV4OiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gICAgICAoe1xuICAgICAgICByZXF1ZXN0SGV4OiBwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3RIZXgsXG4gICAgICAgIGNvbnRleHQ6IHByb2ZpbGVDcmVkZW50aWFsUmVxdWVzdENvbnRleHQsXG4gICAgICB9ID0gZ2VuZXJhdGVQcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3QoXG4gICAgICAgIGNsaWVudFprUHJvZmlsZUNpcGhlcixcbiAgICAgICAgdXVpZC50b1N0cmluZygpLFxuICAgICAgICBwcm9maWxlS2V5XG4gICAgICApKTtcblxuICAgICAgZ2V0UHJvZmlsZU9wdGlvbnMgPSB7XG4gICAgICAgIGFjY2Vzc0tleSxcbiAgICAgICAgdXNlckxhbmd1YWdlcyxcbiAgICAgICAgcHJvZmlsZUtleVZlcnNpb24sXG4gICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdDogcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0SGV4LFxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgIWFjY2Vzc0tleSxcbiAgICAgICdhY2Nlc3NLZXkgaGF2ZSB0byBiZSBhYnNlbnQgYmVjYXVzZSB0aGVyZSBpcyBubyBwcm9maWxlS2V5J1xuICAgICk7XG5cbiAgICBpZiAobGFzdFByb2ZpbGU/LnByb2ZpbGVLZXlWZXJzaW9uKSB7XG4gICAgICBnZXRQcm9maWxlT3B0aW9ucyA9IHtcbiAgICAgICAgdXNlckxhbmd1YWdlcyxcbiAgICAgICAgcHJvZmlsZUtleVZlcnNpb246IGxhc3RQcm9maWxlLnByb2ZpbGVLZXlWZXJzaW9uLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0UHJvZmlsZU9wdGlvbnMgPSB7IHVzZXJMYW5ndWFnZXMgfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpc1ZlcnNpb25lZCA9IEJvb2xlYW4oZ2V0UHJvZmlsZU9wdGlvbnMucHJvZmlsZUtleVZlcnNpb24pO1xuICBsb2cuaW5mbyhcbiAgICBgZ2V0UHJvZmlsZTogZ2V0dGluZyAke2lzVmVyc2lvbmVkID8gJ3ZlcnNpb25lZCcgOiAndW52ZXJzaW9uZWQnfSBgICtcbiAgICAgIGBwcm9maWxlIGZvciBjb252ZXJzYXRpb24gJHtpZEZvckxvZ2dpbmd9YFxuICApO1xuXG4gIHRyeSB7XG4gICAgaWYgKGdldFByb2ZpbGVPcHRpb25zLmFjY2Vzc0tleSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvZmlsZSA9IGF3YWl0IG1lc3NhZ2luZy5nZXRQcm9maWxlKHV1aWQsIGdldFByb2ZpbGVPcHRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgSFRUUEVycm9yKSkge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0MDEgfHwgZXJyb3IuY29kZSA9PT0gNDAzKSB7XG4gICAgICAgICAgaWYgKGlzTWUoYy5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXdhaXQgYy5zZXRQcm9maWxlS2V5KHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAvLyBSZXRyeSBmZXRjaCB1c2luZyBsYXN0IGtub3duIHByb2ZpbGVLZXlWZXJzaW9uIG9yIGZldGNoXG4gICAgICAgICAgLy8gdW52ZXJzaW9uZWQgcHJvZmlsZS5cbiAgICAgICAgICByZXR1cm4gZG9HZXRQcm9maWxlKGMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgIGF3YWl0IGMucmVtb3ZlTGFzdFByb2ZpbGUobGFzdFByb2ZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFdlIHdvbid0IGdldCB0aGUgY3JlZGVudGlhbCwgYnV0IGxldHMgZWl0aGVyIGZldGNoOlxuICAgICAgICAvLyAtIGEgdmVyc2lvbmVkIHByb2ZpbGUgdXNpbmcgbGFzdCBrbm93biBwcm9maWxlS2V5VmVyc2lvblxuICAgICAgICAvLyAtIHNvbWUgYmFzaWMgcHJvZmlsZSBpbmZvcm1hdGlvbiAoY2FwYWJpbGl0aWVzLCBiYWRnZXMsIGV0YykuXG4gICAgICAgIHByb2ZpbGUgPSBhd2FpdCBtZXNzYWdpbmcuZ2V0UHJvZmlsZSh1dWlkLCBnZXRQcm9maWxlT3B0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IgJiYgZXJyb3IuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgbG9nLmluZm8oYGdldFByb2ZpbGU6IGZhaWxlZCB0byBmaW5kIGEgcHJvZmlsZSBmb3IgJHtpZEZvckxvZ2dpbmd9YCk7XG5cbiAgICAgICAgICBhd2FpdCBjLnJlbW92ZUxhc3RQcm9maWxlKGxhc3RQcm9maWxlKTtcbiAgICAgICAgICBpZiAoIWlzVmVyc2lvbmVkKSB7XG4gICAgICAgICAgICBsb2cuaW5mbyhgZ2V0UHJvZmlsZTogbWFya2luZyAke2lkRm9yTG9nZ2luZ30gYXMgdW5yZWdpc3RlcmVkYCk7XG4gICAgICAgICAgICBjLnNldFVucmVnaXN0ZXJlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNNZShjLmF0dHJpYnV0ZXMpICYmIHByb2ZpbGVLZXkgJiYgcHJvZmlsZUtleVZlcnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG1heWJlR2V0UE5JQ3JlZGVudGlhbChjLCB7XG4gICAgICAgICAgY2xpZW50WmtQcm9maWxlQ2lwaGVyLFxuICAgICAgICAgIHByb2ZpbGVLZXksXG4gICAgICAgICAgcHJvZmlsZUtleVZlcnNpb24sXG4gICAgICAgICAgdXNlckxhbmd1YWdlcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnZ2V0UHJvZmlsZSBmYWlsZWQgdG8gZ2V0IG91ciBvd24gUE5JIGNyZWRlbnRpYWwnLFxuICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvZmlsZS5pZGVudGl0eUtleSkge1xuICAgICAgY29uc3QgaWRlbnRpdHlLZXkgPSBCeXRlcy5mcm9tQmFzZTY0KHByb2ZpbGUuaWRlbnRpdHlLZXkpO1xuICAgICAgY29uc3QgY2hhbmdlZCA9IGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuc2F2ZUlkZW50aXR5KFxuICAgICAgICBuZXcgQWRkcmVzcyh1dWlkLCAxKSxcbiAgICAgICAgaWRlbnRpdHlLZXksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgLy8gc2F2ZSBpZGVudGl0eSB3aWxsIGNsb3NlIGFsbCBzZXNzaW9ucyBleGNlcHQgZm9yIC4xLCBzbyB3ZVxuICAgICAgICAvLyBtdXN0IGNsb3NlIHRoYXQgb25lIG1hbnVhbGx5LlxuICAgICAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuYXJjaGl2ZVNlc3Npb24oXG4gICAgICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModXVpZCwgMSkpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGFjY2Vzc0tleSB0byBwcmV2ZW50IHJhY2UgY29uZGl0aW9ucy4gU2luY2Ugd2UgcnVuIGFzeW5jaHJvbm91c1xuICAgIC8vIHJlcXVlc3RzIGFib3ZlIC0gaXQgaXMgcG9zc2libGUgdGhhdCBzb21lb25lIHVwZGF0ZXMgb3IgZXJhc2VzXG4gICAgLy8gdGhlIHByb2ZpbGUga2V5IGZyb20gdW5kZXIgdXMuXG4gICAgYWNjZXNzS2V5ID0gYy5nZXQoJ2FjY2Vzc0tleScpO1xuXG4gICAgaWYgKHByb2ZpbGUudW5yZXN0cmljdGVkVW5pZGVudGlmaWVkQWNjZXNzICYmIHByb2ZpbGUudW5pZGVudGlmaWVkQWNjZXNzKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGdldFByb2ZpbGU6IHNldHRpbmcgc2VhbGVkU2VuZGVyIHRvIFVOUkVTVFJJQ1RFRCBmb3IgY29udmVyc2F0aW9uICR7aWRGb3JMb2dnaW5nfWBcbiAgICAgICk7XG4gICAgICBjLnNldCh7XG4gICAgICAgIHNlYWxlZFNlbmRlcjogU0VBTEVEX1NFTkRFUi5VTlJFU1RSSUNURUQsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFjY2Vzc0tleSAmJiBwcm9maWxlLnVuaWRlbnRpZmllZEFjY2Vzcykge1xuICAgICAgY29uc3QgaGF2ZUNvcnJlY3RLZXkgPSB2ZXJpZnlBY2Nlc3NLZXkoXG4gICAgICAgIEJ5dGVzLmZyb21CYXNlNjQoYWNjZXNzS2V5KSxcbiAgICAgICAgQnl0ZXMuZnJvbUJhc2U2NChwcm9maWxlLnVuaWRlbnRpZmllZEFjY2VzcylcbiAgICAgICk7XG5cbiAgICAgIGlmIChoYXZlQ29ycmVjdEtleSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgZ2V0UHJvZmlsZTogc2V0dGluZyBzZWFsZWRTZW5kZXIgdG8gRU5BQkxFRCBmb3IgY29udmVyc2F0aW9uICR7aWRGb3JMb2dnaW5nfWBcbiAgICAgICAgKTtcbiAgICAgICAgYy5zZXQoe1xuICAgICAgICAgIHNlYWxlZFNlbmRlcjogU0VBTEVEX1NFTkRFUi5FTkFCTEVELFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBnZXRQcm9maWxlOiBzZXR0aW5nIHNlYWxlZFNlbmRlciB0byBESVNBQkxFRCBmb3IgY29udmVyc2F0aW9uICR7aWRGb3JMb2dnaW5nfWBcbiAgICAgICAgKTtcbiAgICAgICAgYy5zZXQoe1xuICAgICAgICAgIHNlYWxlZFNlbmRlcjogU0VBTEVEX1NFTkRFUi5ESVNBQkxFRCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgZ2V0UHJvZmlsZTogc2V0dGluZyBzZWFsZWRTZW5kZXIgdG8gRElTQUJMRUQgZm9yIGNvbnZlcnNhdGlvbiAke2lkRm9yTG9nZ2luZ31gXG4gICAgICApO1xuICAgICAgYy5zZXQoe1xuICAgICAgICBzZWFsZWRTZW5kZXI6IFNFQUxFRF9TRU5ERVIuRElTQUJMRUQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdEZWNyeXB0aW9uS2V5ID0gYy5nZXQoJ3Byb2ZpbGVLZXknKSB8fCBsYXN0UHJvZmlsZT8ucHJvZmlsZUtleTtcbiAgICBjb25zdCBkZWNyeXB0aW9uS2V5ID0gcmF3RGVjcnlwdGlvbktleVxuICAgICAgPyBCeXRlcy5mcm9tQmFzZTY0KHJhd0RlY3J5cHRpb25LZXkpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgICBpZiAocHJvZmlsZS5hYm91dCkge1xuICAgICAgaWYgKGRlY3J5cHRpb25LZXkpIHtcbiAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjcnlwdFByb2ZpbGUoXG4gICAgICAgICAgQnl0ZXMuZnJvbUJhc2U2NChwcm9maWxlLmFib3V0KSxcbiAgICAgICAgICBkZWNyeXB0aW9uS2V5XG4gICAgICAgICk7XG4gICAgICAgIGMuc2V0KCdhYm91dCcsIEJ5dGVzLnRvU3RyaW5nKHRyaW1Gb3JEaXNwbGF5KGRlY3J5cHRlZCkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYy51bnNldCgnYWJvdXQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvZmlsZS5hYm91dEVtb2ppKSB7XG4gICAgICBpZiAoZGVjcnlwdGlvbktleSkge1xuICAgICAgICBjb25zdCBkZWNyeXB0ZWQgPSBkZWNyeXB0UHJvZmlsZShcbiAgICAgICAgICBCeXRlcy5mcm9tQmFzZTY0KHByb2ZpbGUuYWJvdXRFbW9qaSksXG4gICAgICAgICAgZGVjcnlwdGlvbktleVxuICAgICAgICApO1xuICAgICAgICBjLnNldCgnYWJvdXRFbW9qaScsIEJ5dGVzLnRvU3RyaW5nKHRyaW1Gb3JEaXNwbGF5KGRlY3J5cHRlZCkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYy51bnNldCgnYWJvdXRFbW9qaScpO1xuICAgIH1cblxuICAgIGlmIChwcm9maWxlLnBheW1lbnRBZGRyZXNzICYmIGlzTWUoYy5hdHRyaWJ1dGVzKSkge1xuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdwYXltZW50QWRkcmVzcycsIHByb2ZpbGUucGF5bWVudEFkZHJlc3MpO1xuICAgIH1cblxuICAgIGlmIChwcm9maWxlLmNhcGFiaWxpdGllcykge1xuICAgICAgYy5zZXQoeyBjYXBhYmlsaXRpZXM6IHByb2ZpbGUuY2FwYWJpbGl0aWVzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjLnVuc2V0KCdjYXBhYmlsaXRpZXMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBiYWRnZXMgPSBwYXJzZUJhZGdlc0Zyb21TZXJ2ZXIocHJvZmlsZS5iYWRnZXMsIHVwZGF0ZXNVcmwpO1xuICAgIGlmIChiYWRnZXMubGVuZ3RoKSB7XG4gICAgICBhd2FpdCB3aW5kb3cucmVkdXhBY3Rpb25zLmJhZGdlcy51cGRhdGVPckNyZWF0ZShiYWRnZXMpO1xuICAgICAgYy5zZXQoe1xuICAgICAgICBiYWRnZXM6IGJhZGdlcy5tYXAoYmFkZ2UgPT4gKHtcbiAgICAgICAgICBpZDogYmFkZ2UuaWQsXG4gICAgICAgICAgLi4uKCdleHBpcmVzQXQnIGluIGJhZGdlXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBleHBpcmVzQXQ6IGJhZGdlLmV4cGlyZXNBdCxcbiAgICAgICAgICAgICAgICBpc1Zpc2libGU6IGJhZGdlLmlzVmlzaWJsZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB7fSksXG4gICAgICAgIH0pKSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjLnVuc2V0KCdiYWRnZXMnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvZmlsZUNyZWRlbnRpYWxSZXF1ZXN0Q29udGV4dCkge1xuICAgICAgaWYgKHByb2ZpbGUuY3JlZGVudGlhbCkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgY3JlZGVudGlhbDogcHJvZmlsZUtleUNyZWRlbnRpYWwsXG4gICAgICAgICAgZXhwaXJhdGlvbjogcHJvZmlsZUtleUNyZWRlbnRpYWxFeHBpcmF0aW9uLFxuICAgICAgICB9ID0gaGFuZGxlUHJvZmlsZUtleUNyZWRlbnRpYWwoXG4gICAgICAgICAgY2xpZW50WmtQcm9maWxlQ2lwaGVyLFxuICAgICAgICAgIHByb2ZpbGVDcmVkZW50aWFsUmVxdWVzdENvbnRleHQsXG4gICAgICAgICAgcHJvZmlsZS5jcmVkZW50aWFsXG4gICAgICAgICk7XG4gICAgICAgIGMuc2V0KHsgcHJvZmlsZUtleUNyZWRlbnRpYWwsIHByb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbiB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdnZXRQcm9maWxlOiBJbmNsdWRlZCBjcmVkZW50aWFsIHJlcXVlc3QsIGJ1dCBnb3Qgbm8gY3JlZGVudGlhbC4gQ2xlYXJpbmcgcHJvZmlsZUtleUNyZWRlbnRpYWwuJ1xuICAgICAgICApO1xuICAgICAgICBjLnVuc2V0KCdwcm9maWxlS2V5Q3JlZGVudGlhbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvcikpIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgICAgY2FzZSA0MDE6XG4gICAgICBjYXNlIDQwMzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGMuZ2V0KCdzZWFsZWRTZW5kZXInKSA9PT0gU0VBTEVEX1NFTkRFUi5FTkFCTEVEIHx8XG4gICAgICAgICAgYy5nZXQoJ3NlYWxlZFNlbmRlcicpID09PSBTRUFMRURfU0VOREVSLlVOUkVTVFJJQ1RFRFxuICAgICAgICApIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBnZXRQcm9maWxlOiBHb3QgNDAxLzQwMyB3aGVuIHVzaW5nIGFjY2Vzc0tleSBmb3IgJHtpZEZvckxvZ2dpbmd9LCByZW1vdmluZyBwcm9maWxlS2V5YFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKCFpc01lKGMuYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgIGF3YWl0IGMuc2V0UHJvZmlsZUtleSh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYy5nZXQoJ3NlYWxlZFNlbmRlcicpID09PSBTRUFMRURfU0VOREVSLlVOS05PV04pIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBnZXRQcm9maWxlOiBHb3QgNDAxLzQwMyB3aGVuIHVzaW5nIGFjY2Vzc0tleSBmb3IgJHtpZEZvckxvZ2dpbmd9LCBzZXR0aW5nIHNlYWxlZFNlbmRlciA9IERJU0FCTEVEYFxuICAgICAgICAgICk7XG4gICAgICAgICAgYy5zZXQoJ3NlYWxlZFNlbmRlcicsIFNFQUxFRF9TRU5ERVIuRElTQUJMRUQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdnZXRQcm9maWxlIGZhaWx1cmU6JyxcbiAgICAgICAgICBpZEZvckxvZ2dpbmcsXG4gICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZGVjcnlwdGlvbktleVN0cmluZyA9IHByb2ZpbGVLZXkgfHwgbGFzdFByb2ZpbGU/LnByb2ZpbGVLZXk7XG4gIGNvbnN0IGRlY3J5cHRpb25LZXkgPSBkZWNyeXB0aW9uS2V5U3RyaW5nXG4gICAgPyBCeXRlcy5mcm9tQmFzZTY0KGRlY3J5cHRpb25LZXlTdHJpbmcpXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgbGV0IGlzU3VjY2Vzc2Z1bGx5RGVjcnlwdGVkID0gdHJ1ZTtcbiAgaWYgKHByb2ZpbGUubmFtZSkge1xuICAgIGlmIChkZWNyeXB0aW9uS2V5KSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjLnNldEVuY3J5cHRlZFByb2ZpbGVOYW1lKHByb2ZpbGUubmFtZSwgZGVjcnlwdGlvbktleSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnZ2V0UHJvZmlsZSBkZWNyeXB0aW9uIGZhaWx1cmU6JyxcbiAgICAgICAgICBpZEZvckxvZ2dpbmcsXG4gICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICApO1xuICAgICAgICBpc1N1Y2Nlc3NmdWxseURlY3J5cHRlZCA9IGZhbHNlO1xuICAgICAgICBhd2FpdCBjLnNldCh7XG4gICAgICAgICAgcHJvZmlsZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICBwcm9maWxlRmFtaWx5TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYy5zZXQoe1xuICAgICAgcHJvZmlsZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIHByb2ZpbGVGYW1pbHlOYW1lOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChkZWNyeXB0aW9uS2V5KSB7XG4gICAgICBhd2FpdCBjLnNldFByb2ZpbGVBdmF0YXIocHJvZmlsZS5hdmF0YXIsIGRlY3J5cHRpb25LZXkpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSA0MDMgfHwgZXJyb3IuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBnZXRQcm9maWxlOiBwcm9maWxlIGF2YXRhciBpcyBtaXNzaW5nIGZvciBjb252ZXJzYXRpb24gJHtpZEZvckxvZ2dpbmd9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYGdldFByb2ZpbGU6IGZhaWxlZCB0byBkZWNyeXB0IGF2YXRhciBmb3IgY29udmVyc2F0aW9uICR7aWRGb3JMb2dnaW5nfWAsXG4gICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICk7XG4gICAgICBpc1N1Y2Nlc3NmdWxseURlY3J5cHRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGMuc2V0KCdwcm9maWxlTGFzdEZldGNoZWRBdCcsIERhdGUubm93KCkpO1xuXG4gIC8vIEFmdGVyIHdlIHN1Y2Nlc3NmdWxseSBkZWNyeXB0ZWQgLSB1cGRhdGUgbGFzdFByb2ZpbGUgcHJvcGVydHlcbiAgaWYgKFxuICAgIGlzU3VjY2Vzc2Z1bGx5RGVjcnlwdGVkICYmXG4gICAgcHJvZmlsZUtleSAmJlxuICAgIGdldFByb2ZpbGVPcHRpb25zLnByb2ZpbGVLZXlWZXJzaW9uXG4gICkge1xuICAgIGF3YWl0IGMudXBkYXRlTGFzdFByb2ZpbGUobGFzdFByb2ZpbGUsIHtcbiAgICAgIHByb2ZpbGVLZXksXG4gICAgICBwcm9maWxlS2V5VmVyc2lvbjogZ2V0UHJvZmlsZU9wdGlvbnMucHJvZmlsZUtleVZlcnNpb24sXG4gICAgfSk7XG4gIH1cblxuICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKGMuYXR0cmlidXRlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1heWJlR2V0UE5JQ3JlZGVudGlhbChcbiAgYzogQ29udmVyc2F0aW9uTW9kZWwsXG4gIHtcbiAgICBjbGllbnRaa1Byb2ZpbGVDaXBoZXIsXG4gICAgcHJvZmlsZUtleSxcbiAgICBwcm9maWxlS2V5VmVyc2lvbixcbiAgICB1c2VyTGFuZ3VhZ2VzLFxuICB9OiB7XG4gICAgY2xpZW50WmtQcm9maWxlQ2lwaGVyOiBDbGllbnRaa1Byb2ZpbGVPcGVyYXRpb25zO1xuICAgIHByb2ZpbGVLZXk6IHN0cmluZztcbiAgICBwcm9maWxlS2V5VmVyc2lvbjogc3RyaW5nO1xuICAgIHVzZXJMYW5ndWFnZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIEFscmVhZHkgcHJlc2VudCBhbmQgdXAtdG8tZGF0ZVxuICBpZiAoYy5nZXQoJ3BuaUNyZWRlbnRpYWwnKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBzdHJpY3RBc3NlcnQoaXNNZShjLmF0dHJpYnV0ZXMpLCAnSGFzIHRvIGZldGNoIFBOSSBjcmVkZW50aWFsIGZvciBvdXJzZWx2ZXMnKTtcblxuICBsb2cuaW5mbygnbWF5YmVHZXRQTklDcmVkZW50aWFsOiByZXF1ZXN0aW5nIFBOSSBjcmVkZW50aWFsJyk7XG5cbiAgY29uc3QgeyBzdG9yYWdlLCBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICBzdHJpY3RBc3NlcnQoXG4gICAgbWVzc2FnaW5nLFxuICAgICdtYXliZUdldFBOSUNyZWRlbnRpYWw6IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZyBub3QgYXZhaWxhYmxlJ1xuICApO1xuXG4gIGNvbnN0IG91ckFDSSA9IHN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5BQ0kpO1xuICBjb25zdCBvdXJQTkkgPSBzdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuUE5JKTtcblxuICBjb25zdCB7XG4gICAgcmVxdWVzdEhleDogcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0SGV4LFxuICAgIGNvbnRleHQ6IHByb2ZpbGVDcmVkZW50aWFsUmVxdWVzdENvbnRleHQsXG4gIH0gPSBnZW5lcmF0ZVBOSUNyZWRlbnRpYWxSZXF1ZXN0KFxuICAgIGNsaWVudFprUHJvZmlsZUNpcGhlcixcbiAgICBvdXJBQ0kudG9TdHJpbmcoKSxcbiAgICBvdXJQTkkudG9TdHJpbmcoKSxcbiAgICBwcm9maWxlS2V5XG4gICk7XG5cbiAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IG1lc3NhZ2luZy5nZXRQcm9maWxlKG91ckFDSSwge1xuICAgIHVzZXJMYW5ndWFnZXMsXG4gICAgcHJvZmlsZUtleVZlcnNpb24sXG4gICAgcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0OiBwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3RIZXgsXG4gICAgY3JlZGVudGlhbFR5cGU6ICdwbmknLFxuICB9KTtcblxuICBzdHJpY3RBc3NlcnQoXG4gICAgcHJvZmlsZS5wbmlDcmVkZW50aWFsLFxuICAgICdXZSBtdXN0IGdldCB0aGUgY3JlZGVudGlhbCBmb3Igb3Vyc2VsdmVzJ1xuICApO1xuICBjb25zdCBwbmlDcmVkZW50aWFsID0gaGFuZGxlUHJvZmlsZUtleVBOSUNyZWRlbnRpYWwoXG4gICAgY2xpZW50WmtQcm9maWxlQ2lwaGVyLFxuICAgIHByb2ZpbGVDcmVkZW50aWFsUmVxdWVzdENvbnRleHQsXG4gICAgcHJvZmlsZS5wbmlDcmVkZW50aWFsXG4gICk7XG4gIGMuc2V0KHsgcG5pQ3JlZGVudGlhbCB9KTtcblxuICBsb2cuaW5mbygnbWF5YmVHZXRQTklDcmVkZW50aWFsOiB1cGRhdGVkIFBOSSBjcmVkZW50aWFsJyk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQSxxQkFBbUI7QUFPbkIsVUFBcUI7QUFDckIsYUFBd0I7QUFDeEIsWUFBdUI7QUFDdkIsNEJBQStCO0FBQy9CLHNCQUF5QjtBQUN6QixtQkFBc0I7QUFDdEIsdUJBQStCO0FBQy9CLHFCQU1PO0FBQ1Asb0NBQXFCO0FBQ3JCLDJCQUFpQztBQUNqQyxtQ0FBc0M7QUFDdEMsb0JBQTZCO0FBQzdCLHlDQUE0QztBQUM1QywwQkFBOEI7QUFDOUIsb0JBQTBCO0FBQzFCLHFCQUF3QjtBQUN4Qiw4QkFBaUM7QUFDakMsa0JBQXlCO0FBQ3pCLG9CQUFnRTtBQXlCekQsTUFBTSxlQUFlO0FBQUEsRUFPMUIsWUFBb0IsZUFBZSxjQUFjO0FBQTdCO0FBSlosZ0NBQTZDLG9CQUFJLElBQUk7QUFFckQsb0JBQVc7QUFHakIsU0FBSyxXQUFXLElBQUksdUJBQU8sRUFBRSxhQUFhLEdBQUcsU0FBUywwQkFBUyxFQUFFLENBQUM7QUFDbEUsU0FBSyx1QkFBdUIsb0JBQUksSUFBSTtBQUVwQyxRQUFJLEtBQUssNkJBQTZCO0FBQUEsRUFDeEM7QUFBQSxRQUVhLElBQUksZ0JBQXVDO0FBQ3RELFVBQU0sdUJBQ0osT0FBTyx1QkFBdUIsSUFBSSxjQUFjO0FBQ2xELFFBQUksQ0FBQyxzQkFBc0I7QUFDekIsWUFBTSxJQUFJLE1BQ1IsK0NBQStDLDBCQUNqRDtBQUFBLElBQ0Y7QUFFQSxRQUFJLEtBQUssVUFBVTtBQUNqQixZQUFNLElBQUksTUFDUix1RUFBdUUscUJBQXFCLGFBQWEsR0FDM0c7QUFBQSxJQUNGO0FBRUEsVUFBTSxXQUFXLEtBQUsscUJBQXFCLElBQUksY0FBYztBQUM3RCxRQUFJLFVBQVU7QUFDWixhQUFPLFNBQVM7QUFBQSxJQUNsQjtBQUVBLFVBQU0sRUFBRSxTQUFTLFFBQVEsWUFBWSwwQ0FBcUI7QUFDMUQsVUFBTSxVQUFVO0FBQUEsTUFDZDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQSxXQUFXLEtBQUssSUFBSTtBQUFBLElBQ3RCO0FBRUEsVUFBTSxNQUFNLG1DQUFZO0FBQ3RCLFlBQU0sZUFBZSxPQUFPLHVCQUF1QixJQUFJLGNBQWM7QUFDckUsVUFBSSxDQUFDLGNBQWM7QUFDakIsY0FBTSxJQUFJLE1BQ1IscUNBQXFDLDBCQUN2QztBQUFBLE1BQ0Y7QUFFQSxVQUFJO0FBQ0YsY0FBTSxLQUFLLGFBQWEsWUFBWTtBQUNwQyxnQkFBUTtBQUFBLE1BQ1YsU0FBUyxPQUFQO0FBQ0EsZUFBTyxLQUFLO0FBRVosWUFBSSxLQUFLLFVBQVU7QUFDakI7QUFBQSxRQUNGO0FBRUEsWUFBSSw4QkFBUyxLQUFLLEtBQUssVUFBVSxTQUFTLE1BQU0sU0FBUyxLQUFLO0FBQzVELGVBQUssU0FBUyxxQkFBcUI7QUFDbkMsZ0JBQU0sT0FBTyxvRUFBNEIsS0FBSztBQUM5QyxlQUFLLE1BQU0sSUFBSTtBQUFBLFFBQ2pCO0FBQUEsTUFDRixVQUFFO0FBQ0EsYUFBSyxxQkFBcUIsT0FBTyxjQUFjO0FBRS9DLGNBQU0sTUFBTSxLQUFLLElBQUk7QUFDckIsY0FBTSxRQUFRLE1BQU0sUUFBUTtBQUM1QixZQUFJLFFBQVEsS0FBSyx5QkFBUTtBQUN2QixjQUFJLEtBQ0YsZ0NBQWdDLGFBQWEsYUFBYSxjQUFjLHFCQUMxRTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixHQWxDWTtBQW9DWixTQUFLLHFCQUFxQixJQUFJLGdCQUFnQixPQUFPO0FBQ3JELFNBQUssU0FBUyxJQUFJLEdBQUc7QUFFckIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLFNBQVMsUUFBc0I7QUFDcEMsUUFBSSxLQUFLLFVBQVU7QUFDakIsVUFBSSxLQUNGLG1FQUFtRSxTQUNyRTtBQUNBO0FBQUEsSUFDRjtBQUVBLFFBQUksS0FBSywrQ0FBK0MsU0FBUztBQUVqRSxRQUFJO0FBQ0YsV0FBSyxXQUFXO0FBQ2hCLFdBQUssU0FBUyxNQUFNO0FBRXBCLFdBQUsscUJBQXFCLFFBQVEsU0FBTztBQUN2QyxZQUFJLE9BQ0YsSUFBSSxNQUNGLG1EQUFtRCxTQUNyRCxDQUNGO0FBQUEsTUFDRixDQUFDO0FBRUQsV0FBSyxxQkFBcUIsTUFBTTtBQUNoQyxXQUFLLFNBQVMsTUFBTTtBQUVwQixXQUFLLFNBQVMsTUFBTTtBQUFBLElBQ3RCLFVBQUU7QUFDQSxXQUFLLFdBQVc7QUFDaEIsVUFBSSxLQUFLLHdDQUF3QztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUFBLFFBRWEsTUFBTSxVQUFpQztBQUNsRCxRQUFJLEtBQUssVUFBVTtBQUNqQixVQUFJLEtBQUssMERBQTBEO0FBQ25FO0FBQUEsSUFDRjtBQUVBLFFBQUksS0FBSywyQ0FBMkMsWUFBWTtBQUVoRSxTQUFLLFdBQVc7QUFDaEIsU0FBSyxTQUFTLE1BQU07QUFFcEIsUUFBSTtBQUNGLFlBQU0sd0JBQU0sUUFBUTtBQUFBLElBQ3RCLFVBQUU7QUFDQSxVQUFJLEtBQUssd0NBQXdDO0FBQ2pELFdBQUssU0FBUyxNQUFNO0FBQ3BCLFdBQUssV0FBVztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNGO0FBdklPLEFBeUlBLE1BQU0saUJBQWlCLElBQUksZUFBZTtBQUVqRCw0QkFBNEIsR0FBcUM7QUFDL0QsUUFBTSxlQUFlLEVBQUUsYUFBYTtBQUNwQyxRQUFNLEVBQUUsY0FBYyxPQUFPO0FBQzdCLGtDQUNFLFdBQ0EsdURBQ0Y7QUFFQSxRQUFNLEVBQUUsZUFBZSxPQUFPLGNBQWM7QUFDNUMsa0NBQ0UsT0FBTyxlQUFlLFVBQ3RCLHdEQUNGO0FBRUEsUUFBTSx3QkFBd0IsaURBQzVCLE9BQU8sc0JBQXNCLENBQy9CO0FBRUEsUUFBTSxnQkFBZ0IsMkNBQ3BCLFVBQVUsV0FDVixPQUFPLFVBQVUsQ0FDbkI7QUFFQSxNQUFJO0FBRUosSUFBRSx3QkFBd0I7QUFFMUIsUUFBTSxhQUFhLEVBQUUsSUFBSSxZQUFZO0FBQ3JDLFFBQU0sb0JBQW9CLEVBQUUsd0JBQXdCO0FBQ3BELFFBQU0sT0FBTyxFQUFFLGVBQWUsWUFBWTtBQUMxQyxRQUFNLGNBQWMsRUFBRSxJQUFJLGFBQWE7QUFFdkMsTUFBSTtBQUlKLE1BQUk7QUFFSixNQUFJLFlBQVksRUFBRSxJQUFJLFdBQVc7QUFDakMsTUFBSSxZQUFZO0FBQ2Qsb0NBQ0UscUJBQXFCLFdBQ3JCLDZEQUNGO0FBRUEsUUFBSSxDQUFDLEVBQUUsK0JBQStCLEdBQUc7QUFDdkMsMEJBQW9CO0FBQUEsUUFDbEI7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLE9BQU87QUFDTCxVQUFJLEtBQ0YsMEVBQ2tCLGNBQ3BCO0FBRUEsVUFBSTtBQUNKLE1BQUM7QUFBQSxRQUNDLFlBQVk7QUFBQSxRQUNaLFNBQVM7QUFBQSxNQUNYLElBQUksd0RBQ0YsdUJBQ0EsS0FBSyxTQUFTLEdBQ2QsVUFDRjtBQUVBLDBCQUFvQjtBQUFBLFFBQ2xCO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBLDZCQUE2QjtBQUFBLE1BQy9CO0FBQUEsSUFDRjtBQUFBLEVBQ0YsT0FBTztBQUNMLG9DQUNFLENBQUMsV0FDRCw0REFDRjtBQUVBLFFBQUksYUFBYSxtQkFBbUI7QUFDbEMsMEJBQW9CO0FBQUEsUUFDbEI7QUFBQSxRQUNBLG1CQUFtQixZQUFZO0FBQUEsTUFDakM7QUFBQSxJQUNGLE9BQU87QUFDTCwwQkFBb0IsRUFBRSxjQUFjO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBRUEsUUFBTSxjQUFjLFFBQVEsa0JBQWtCLGlCQUFpQjtBQUMvRCxNQUFJLEtBQ0YsdUJBQXVCLGNBQWMsY0FBYywwQ0FDckIsY0FDaEM7QUFFQSxNQUFJO0FBQ0YsUUFBSSxrQkFBa0IsV0FBVztBQUMvQixVQUFJO0FBQ0Ysa0JBQVUsTUFBTSxVQUFVLFdBQVcsTUFBTSxpQkFBaUI7QUFBQSxNQUM5RCxTQUFTLE9BQVA7QUFDQSxZQUFJLENBQUUsa0JBQWlCLDBCQUFZO0FBQ2pDLGdCQUFNO0FBQUEsUUFDUjtBQUNBLFlBQUksTUFBTSxTQUFTLE9BQU8sTUFBTSxTQUFTLEtBQUs7QUFDNUMsY0FBSSx3Q0FBSyxFQUFFLFVBQVUsR0FBRztBQUN0QixrQkFBTTtBQUFBLFVBQ1I7QUFFQSxnQkFBTSxFQUFFLGNBQWMsTUFBUztBQUkvQixpQkFBTyxhQUFhLENBQUM7QUFBQSxRQUN2QjtBQUVBLFlBQUksTUFBTSxTQUFTLEtBQUs7QUFDdEIsZ0JBQU0sRUFBRSxrQkFBa0IsV0FBVztBQUFBLFFBQ3ZDO0FBRUEsY0FBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGLE9BQU87QUFDTCxVQUFJO0FBSUYsa0JBQVUsTUFBTSxVQUFVLFdBQVcsTUFBTSxpQkFBaUI7QUFBQSxNQUM5RCxTQUFTLE9BQVA7QUFDQSxZQUFJLGlCQUFpQiwyQkFBYSxNQUFNLFNBQVMsS0FBSztBQUNwRCxjQUFJLEtBQUssNENBQTRDLGNBQWM7QUFFbkUsZ0JBQU0sRUFBRSxrQkFBa0IsV0FBVztBQUNyQyxjQUFJLENBQUMsYUFBYTtBQUNoQixnQkFBSSxLQUFLLHVCQUF1Qiw4QkFBOEI7QUFDOUQsY0FBRSxnQkFBZ0I7QUFBQSxVQUNwQjtBQUFBLFFBQ0Y7QUFDQSxjQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFFQSxRQUFJLHdDQUFLLEVBQUUsVUFBVSxLQUFLLGNBQWMsbUJBQW1CO0FBQ3pELFVBQUk7QUFDRixjQUFNLHNCQUFzQixHQUFHO0FBQUEsVUFDN0I7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILFNBQVMsT0FBUDtBQUNBLFlBQUksS0FDRixtREFDQSxPQUFPLFlBQVksS0FBSyxDQUMxQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsUUFBSSxRQUFRLGFBQWE7QUFDdkIsWUFBTSxjQUFjLE1BQU0sV0FBVyxRQUFRLFdBQVc7QUFDeEQsWUFBTSxVQUFVLE1BQU0sT0FBTyxXQUFXLFFBQVEsU0FBUyxhQUN2RCxJQUFJLHVCQUFRLE1BQU0sQ0FBQyxHQUNuQixhQUNBLEtBQ0Y7QUFDQSxVQUFJLFNBQVM7QUFHWCxjQUFNLFVBQVUsT0FBTyxXQUFXLFFBQVEsS0FBSyxlQUFlO0FBQzlELGNBQU0sT0FBTyxXQUFXLFFBQVEsU0FBUyxlQUN2QyxJQUFJLHlDQUFpQixTQUFTLElBQUksdUJBQVEsTUFBTSxDQUFDLENBQUMsQ0FDcEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUtBLGdCQUFZLEVBQUUsSUFBSSxXQUFXO0FBRTdCLFFBQUksUUFBUSxrQ0FBa0MsUUFBUSxvQkFBb0I7QUFDeEUsVUFBSSxLQUNGLHFFQUFxRSxjQUN2RTtBQUNBLFFBQUUsSUFBSTtBQUFBLFFBQ0osY0FBYyxrQ0FBYztBQUFBLE1BQzlCLENBQUM7QUFBQSxJQUNILFdBQVcsYUFBYSxRQUFRLG9CQUFvQjtBQUNsRCxZQUFNLGlCQUFpQixtQ0FDckIsTUFBTSxXQUFXLFNBQVMsR0FDMUIsTUFBTSxXQUFXLFFBQVEsa0JBQWtCLENBQzdDO0FBRUEsVUFBSSxnQkFBZ0I7QUFDbEIsWUFBSSxLQUNGLGdFQUFnRSxjQUNsRTtBQUNBLFVBQUUsSUFBSTtBQUFBLFVBQ0osY0FBYyxrQ0FBYztBQUFBLFFBQzlCLENBQUM7QUFBQSxNQUNILE9BQU87QUFDTCxZQUFJLEtBQ0YsaUVBQWlFLGNBQ25FO0FBQ0EsVUFBRSxJQUFJO0FBQUEsVUFDSixjQUFjLGtDQUFjO0FBQUEsUUFDOUIsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLE9BQU87QUFDTCxVQUFJLEtBQ0YsaUVBQWlFLGNBQ25FO0FBQ0EsUUFBRSxJQUFJO0FBQUEsUUFDSixjQUFjLGtDQUFjO0FBQUEsTUFDOUIsQ0FBQztBQUFBLElBQ0g7QUFFQSxVQUFNLG1CQUFtQixFQUFFLElBQUksWUFBWSxLQUFLLGFBQWE7QUFDN0QsVUFBTSxpQkFBZ0IsbUJBQ2xCLE1BQU0sV0FBVyxnQkFBZ0IsSUFDakM7QUFDSixRQUFJLFFBQVEsT0FBTztBQUNqQixVQUFJLGdCQUFlO0FBQ2pCLGNBQU0sWUFBWSxrQ0FDaEIsTUFBTSxXQUFXLFFBQVEsS0FBSyxHQUM5QixjQUNGO0FBQ0EsVUFBRSxJQUFJLFNBQVMsTUFBTSxTQUFTLGtDQUFlLFNBQVMsQ0FBQyxDQUFDO0FBQUEsTUFDMUQ7QUFBQSxJQUNGLE9BQU87QUFDTCxRQUFFLE1BQU0sT0FBTztBQUFBLElBQ2pCO0FBRUEsUUFBSSxRQUFRLFlBQVk7QUFDdEIsVUFBSSxnQkFBZTtBQUNqQixjQUFNLFlBQVksa0NBQ2hCLE1BQU0sV0FBVyxRQUFRLFVBQVUsR0FDbkMsY0FDRjtBQUNBLFVBQUUsSUFBSSxjQUFjLE1BQU0sU0FBUyxrQ0FBZSxTQUFTLENBQUMsQ0FBQztBQUFBLE1BQy9EO0FBQUEsSUFDRixPQUFPO0FBQ0wsUUFBRSxNQUFNLFlBQVk7QUFBQSxJQUN0QjtBQUVBLFFBQUksUUFBUSxrQkFBa0Isd0NBQUssRUFBRSxVQUFVLEdBQUc7QUFDaEQsYUFBTyxRQUFRLElBQUksa0JBQWtCLFFBQVEsY0FBYztBQUFBLElBQzdEO0FBRUEsUUFBSSxRQUFRLGNBQWM7QUFDeEIsUUFBRSxJQUFJLEVBQUUsY0FBYyxRQUFRLGFBQWEsQ0FBQztBQUFBLElBQzlDLE9BQU87QUFDTCxRQUFFLE1BQU0sY0FBYztBQUFBLElBQ3hCO0FBRUEsVUFBTSxTQUFTLHdEQUFzQixRQUFRLFFBQVEsVUFBVTtBQUMvRCxRQUFJLE9BQU8sUUFBUTtBQUNqQixZQUFNLE9BQU8sYUFBYSxPQUFPLGVBQWUsTUFBTTtBQUN0RCxRQUFFLElBQUk7QUFBQSxRQUNKLFFBQVEsT0FBTyxJQUFJLFdBQVU7QUFBQSxVQUMzQixJQUFJLE1BQU07QUFBQSxhQUNOLGVBQWUsUUFDZjtBQUFBLFlBQ0UsV0FBVyxNQUFNO0FBQUEsWUFDakIsV0FBVyxNQUFNO0FBQUEsVUFDbkIsSUFDQSxDQUFDO0FBQUEsUUFDUCxFQUFFO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDSCxPQUFPO0FBQ0wsUUFBRSxNQUFNLFFBQVE7QUFBQSxJQUNsQjtBQUVBLFFBQUksaUNBQWlDO0FBQ25DLFVBQUksUUFBUSxZQUFZO0FBQ3RCLGNBQU07QUFBQSxVQUNKLFlBQVk7QUFBQSxVQUNaLFlBQVk7QUFBQSxZQUNWLCtDQUNGLHVCQUNBLGlDQUNBLFFBQVEsVUFDVjtBQUNBLFVBQUUsSUFBSSxFQUFFLHNCQUFzQiwrQkFBK0IsQ0FBQztBQUFBLE1BQ2hFLE9BQU87QUFDTCxZQUFJLEtBQ0YsZ0dBQ0Y7QUFDQSxVQUFFLE1BQU0sc0JBQXNCO0FBQUEsTUFDaEM7QUFBQSxJQUNGO0FBQUEsRUFDRixTQUFTLE9BQVA7QUFDQSxRQUFJLENBQUUsa0JBQWlCLDBCQUFZO0FBQ2pDLFlBQU07QUFBQSxJQUNSO0FBRUEsWUFBUSxNQUFNO0FBQUEsV0FDUDtBQUFBLFdBQ0E7QUFDSCxZQUNFLEVBQUUsSUFBSSxjQUFjLE1BQU0sa0NBQWMsV0FDeEMsRUFBRSxJQUFJLGNBQWMsTUFBTSxrQ0FBYyxjQUN4QztBQUNBLGNBQUksS0FDRixvREFBb0QsbUNBQ3REO0FBQ0EsY0FBSSxDQUFDLHdDQUFLLEVBQUUsVUFBVSxHQUFHO0FBQ3ZCLGtCQUFNLEVBQUUsY0FBYyxNQUFTO0FBQUEsVUFDakM7QUFBQSxRQUNGO0FBQ0EsWUFBSSxFQUFFLElBQUksY0FBYyxNQUFNLGtDQUFjLFNBQVM7QUFDbkQsY0FBSSxLQUNGLG9EQUFvRCwrQ0FDdEQ7QUFDQSxZQUFFLElBQUksZ0JBQWdCLGtDQUFjLFFBQVE7QUFBQSxRQUM5QztBQUNBO0FBQUE7QUFFQSxZQUFJLEtBQ0YsdUJBQ0EsY0FDQSxPQUFPLFlBQVksS0FBSyxDQUMxQjtBQUNBO0FBQUE7QUFBQSxFQUVOO0FBRUEsUUFBTSxzQkFBc0IsY0FBYyxhQUFhO0FBQ3ZELFFBQU0sZ0JBQWdCLHNCQUNsQixNQUFNLFdBQVcsbUJBQW1CLElBQ3BDO0FBRUosTUFBSSwwQkFBMEI7QUFDOUIsTUFBSSxRQUFRLE1BQU07QUFDaEIsUUFBSSxlQUFlO0FBQ2pCLFVBQUk7QUFDRixjQUFNLEVBQUUsd0JBQXdCLFFBQVEsTUFBTSxhQUFhO0FBQUEsTUFDN0QsU0FBUyxPQUFQO0FBQ0EsWUFBSSxLQUNGLGtDQUNBLGNBQ0EsT0FBTyxZQUFZLEtBQUssQ0FDMUI7QUFDQSxrQ0FBMEI7QUFDMUIsY0FBTSxFQUFFLElBQUk7QUFBQSxVQUNWLGFBQWE7QUFBQSxVQUNiLG1CQUFtQjtBQUFBLFFBQ3JCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0YsT0FBTztBQUNMLE1BQUUsSUFBSTtBQUFBLE1BQ0osYUFBYTtBQUFBLE1BQ2IsbUJBQW1CO0FBQUEsSUFDckIsQ0FBQztBQUFBLEVBQ0g7QUFFQSxNQUFJO0FBQ0YsUUFBSSxlQUFlO0FBQ2pCLFlBQU0sRUFBRSxpQkFBaUIsUUFBUSxRQUFRLGFBQWE7QUFBQSxJQUN4RDtBQUFBLEVBQ0YsU0FBUyxPQUFQO0FBQ0EsUUFBSSxpQkFBaUIseUJBQVc7QUFDOUIsVUFBSSxNQUFNLFNBQVMsT0FBTyxNQUFNLFNBQVMsS0FBSztBQUM1QyxZQUFJLEtBQ0YsMERBQTBELGNBQzVEO0FBQUEsTUFDRjtBQUFBLElBQ0YsT0FBTztBQUNMLFVBQUksS0FDRix5REFBeUQsZ0JBQ3pELE9BQU8sWUFBWSxLQUFLLENBQzFCO0FBQ0EsZ0NBQTBCO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBRUEsSUFBRSxJQUFJLHdCQUF3QixLQUFLLElBQUksQ0FBQztBQUd4QyxNQUNFLDJCQUNBLGNBQ0Esa0JBQWtCLG1CQUNsQjtBQUNBLFVBQU0sRUFBRSxrQkFBa0IsYUFBYTtBQUFBLE1BQ3JDO0FBQUEsTUFDQSxtQkFBbUIsa0JBQWtCO0FBQUEsSUFDdkMsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPLE9BQU8sS0FBSyxtQkFBbUIsRUFBRSxVQUFVO0FBQ3BEO0FBeFllLEFBMFlmLHFDQUNFLEdBQ0E7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FPYTtBQUVmLE1BQUksRUFBRSxJQUFJLGVBQWUsR0FBRztBQUMxQjtBQUFBLEVBQ0Y7QUFDQSxrQ0FBYSx3Q0FBSyxFQUFFLFVBQVUsR0FBRywyQ0FBMkM7QUFFNUUsTUFBSSxLQUFLLGtEQUFrRDtBQUUzRCxRQUFNLEVBQUUsU0FBUyxjQUFjLE9BQU87QUFDdEMsa0NBQ0UsV0FDQSxrRUFDRjtBQUVBLFFBQU0sU0FBUyxRQUFRLEtBQUssZUFBZSxxQkFBUyxHQUFHO0FBQ3ZELFFBQU0sU0FBUyxRQUFRLEtBQUssZUFBZSxxQkFBUyxHQUFHO0FBRXZELFFBQU07QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQLGlEQUNGLHVCQUNBLE9BQU8sU0FBUyxHQUNoQixPQUFPLFNBQVMsR0FDaEIsVUFDRjtBQUVBLFFBQU0sVUFBVSxNQUFNLFVBQVUsV0FBVyxRQUFRO0FBQUEsSUFDakQ7QUFBQSxJQUNBO0FBQUEsSUFDQSw2QkFBNkI7QUFBQSxJQUM3QixnQkFBZ0I7QUFBQSxFQUNsQixDQUFDO0FBRUQsa0NBQ0UsUUFBUSxlQUNSLDBDQUNGO0FBQ0EsUUFBTSxnQkFBZ0Isa0RBQ3BCLHVCQUNBLGlDQUNBLFFBQVEsYUFDVjtBQUNBLElBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQztBQUV2QixNQUFJLEtBQUssK0NBQStDO0FBQzFEO0FBNURlIiwKICAibmFtZXMiOiBbXQp9Cg==
