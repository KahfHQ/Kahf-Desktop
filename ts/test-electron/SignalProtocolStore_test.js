var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_chai = __toESM(require("chai"));
var import_chai_as_promised = __toESM(require("chai-as-promised"));
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_compiled = require("../protobuf/compiled");
var import_sessionTranslation = require("../util/sessionTranslation");
var durations = __toESM(require("../util/durations"));
var import_Zone = require("../util/Zone");
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var import_Curve = require("../Curve");
var import_SignalProtocolStore = require("../SignalProtocolStore");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
import_chai.default.use(import_chai_as_promised.default);
const {
  RecordStructure,
  SessionStructure,
  SenderKeyRecordStructure,
  SenderKeyStateStructure
} = import_compiled.signal.proto.storage;
describe("SignalProtocolStore", () => {
  const ourUuid = import_UUID.UUID.generate();
  const theirUuid = import_UUID.UUID.generate();
  let store;
  let identityKey;
  let testKey;
  function getSessionRecord(isOpen) {
    const proto = new RecordStructure();
    proto.previousSessions = [];
    if (isOpen) {
      proto.currentSession = new SessionStructure();
      proto.currentSession.aliceBaseKey = getPublicKey();
      proto.currentSession.localIdentityPublic = getPublicKey();
      proto.currentSession.localRegistrationId = 435;
      proto.currentSession.previousCounter = 1;
      proto.currentSession.remoteIdentityPublic = getPublicKey();
      proto.currentSession.remoteRegistrationId = 243;
      proto.currentSession.rootKey = getPrivateKey();
      proto.currentSession.sessionVersion = 3;
    }
    return import_libsignal_client.SessionRecord.deserialize(Buffer.from((0, import_sessionTranslation.sessionStructureToBytes)(proto)));
  }
  function getSenderKeyRecord() {
    const proto = new SenderKeyRecordStructure();
    const state = new SenderKeyStateStructure();
    state.senderKeyId = 4;
    const senderChainKey = new SenderKeyStateStructure.SenderChainKey();
    senderChainKey.iteration = 10;
    senderChainKey.seed = getPublicKey();
    state.senderChainKey = senderChainKey;
    const senderSigningKey = new SenderKeyStateStructure.SenderSigningKey();
    senderSigningKey.public = getPublicKey();
    senderSigningKey.private = getPrivateKey();
    state.senderSigningKey = senderSigningKey;
    state.senderMessageKeys = [];
    const messageKey = new SenderKeyStateStructure.SenderMessageKey();
    messageKey.iteration = 234;
    messageKey.seed = getPublicKey();
    state.senderMessageKeys.push(messageKey);
    proto.senderKeyStates = [];
    proto.senderKeyStates.push(state);
    return import_libsignal_client.SenderKeyRecord.deserialize(Buffer.from(import_compiled.signal.proto.storage.SenderKeyRecordStructure.encode(proto).finish()));
  }
  function getPrivateKey() {
    const key = (0, import_Crypto.getRandomBytes)(32);
    (0, import_Curve.clampPrivateKey)(key);
    return key;
  }
  function getPublicKey() {
    const key = (0, import_Crypto.getRandomBytes)(33);
    (0, import_Curve.setPublicKeyTypeByte)(key);
    return key;
  }
  before(async () => {
    store = window.textsecure.storage.protocol;
    store.hydrateCaches();
    identityKey = {
      pubKey: getPublicKey(),
      privKey: getPrivateKey()
    };
    testKey = {
      pubKey: getPublicKey(),
      privKey: getPrivateKey()
    };
    (0, import_Curve.setPublicKeyTypeByte)(identityKey.pubKey);
    (0, import_Curve.setPublicKeyTypeByte)(testKey.pubKey);
    (0, import_Curve.clampPrivateKey)(identityKey.privKey);
    (0, import_Curve.clampPrivateKey)(testKey.privKey);
    window.storage.put("registrationIdMap", { [ourUuid.toString()]: 1337 });
    window.storage.put("identityKeyMap", {
      [ourUuid.toString()]: {
        privKey: identityKey.privKey,
        pubKey: identityKey.pubKey
      }
    });
    await window.storage.fetch();
    window.ConversationController.reset();
    await window.ConversationController.load();
    await window.ConversationController.getOrCreateAndWait(theirUuid.toString(), "private");
  });
  describe("getLocalRegistrationId", () => {
    it("retrieves my registration id", async () => {
      await store.hydrateCaches();
      const id = await store.getLocalRegistrationId(ourUuid);
      import_chai.assert.strictEqual(id, 1337);
    });
  });
  describe("getIdentityKeyPair", () => {
    it("retrieves my identity key", async () => {
      await store.hydrateCaches();
      const key = await store.getIdentityKeyPair(ourUuid);
      if (!key) {
        throw new Error("Missing key!");
      }
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(key.pubKey, identityKey.pubKey));
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(key.privKey, identityKey.privKey));
    });
  });
  describe("senderKeys", () => {
    it("roundtrips in memory", async () => {
      const distributionId = import_UUID.UUID.generate().toString();
      const expected = getSenderKeyRecord();
      const deviceId = 1;
      const qualifiedAddress = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId));
      await store.saveSenderKey(qualifiedAddress, distributionId, expected);
      const actual = await store.getSenderKey(qualifiedAddress, distributionId);
      if (!actual) {
        throw new Error("getSenderKey returned nothing!");
      }
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(expected.serialize(), actual.serialize()));
      await store.removeSenderKey(qualifiedAddress, distributionId);
      const postDeleteGet = await store.getSenderKey(qualifiedAddress, distributionId);
      import_chai.assert.isUndefined(postDeleteGet);
    });
    it("roundtrips through database", async () => {
      const distributionId = import_UUID.UUID.generate().toString();
      const expected = getSenderKeyRecord();
      const deviceId = 1;
      const qualifiedAddress = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId));
      await store.saveSenderKey(qualifiedAddress, distributionId, expected);
      await store.hydrateCaches();
      const actual = await store.getSenderKey(qualifiedAddress, distributionId);
      if (!actual) {
        throw new Error("getSenderKey returned nothing!");
      }
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(expected.serialize(), actual.serialize()));
      await store.removeSenderKey(qualifiedAddress, distributionId);
      await store.hydrateCaches();
      const postDeleteGet = await store.getSenderKey(qualifiedAddress, distributionId);
      import_chai.assert.isUndefined(postDeleteGet);
    });
  });
  describe("saveIdentity", () => {
    const identifier = new import_Address.Address(theirUuid, 1);
    it("stores identity keys", async () => {
      await store.saveIdentity(identifier, testKey.pubKey);
      const key = await store.loadIdentityKey(theirUuid);
      if (!key) {
        throw new Error("Missing key!");
      }
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(key, testKey.pubKey));
    });
    it("allows key changes", async () => {
      const newIdentity = getPublicKey();
      await store.saveIdentity(identifier, testKey.pubKey);
      await store.saveIdentity(identifier, newIdentity);
    });
    describe("When there is no existing key (first use)", () => {
      before(async () => {
        await store.removeIdentityKey(theirUuid);
        await store.saveIdentity(identifier, testKey.pubKey);
      });
      it("marks the key firstUse", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        (0, import_chai.assert)(identity.firstUse);
      });
      it("sets the timestamp", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        (0, import_chai.assert)(identity.timestamp);
      });
      it("sets the verified status to DEFAULT", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.DEFAULT);
      });
    });
    describe("When there is a different existing key (non first use)", () => {
      const newIdentity = getPublicKey();
      const oldTimestamp = Date.now();
      before(async () => {
        await window.Signal.Data.createOrUpdateIdentityKey({
          id: theirUuid.toString(),
          publicKey: testKey.pubKey,
          firstUse: true,
          timestamp: oldTimestamp,
          nonblockingApproval: false,
          verified: store.VerifiedStatus.DEFAULT
        });
        await store.hydrateCaches();
        await store.saveIdentity(identifier, newIdentity);
      });
      it("marks the key not firstUse", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        (0, import_chai.assert)(!identity.firstUse);
      });
      it("updates the timestamp", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.notEqual(identity.timestamp, oldTimestamp);
      });
      describe("The previous verified status was DEFAULT", () => {
        before(async () => {
          await window.Signal.Data.createOrUpdateIdentityKey({
            id: theirUuid.toString(),
            publicKey: testKey.pubKey,
            firstUse: true,
            timestamp: oldTimestamp,
            nonblockingApproval: false,
            verified: store.VerifiedStatus.DEFAULT
          });
          await store.hydrateCaches();
          await store.saveIdentity(identifier, newIdentity);
        });
        it("sets the new key to default", async () => {
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.DEFAULT);
        });
      });
      describe("The previous verified status was VERIFIED", () => {
        before(async () => {
          await window.Signal.Data.createOrUpdateIdentityKey({
            id: theirUuid.toString(),
            publicKey: testKey.pubKey,
            firstUse: true,
            timestamp: oldTimestamp,
            nonblockingApproval: false,
            verified: store.VerifiedStatus.VERIFIED
          });
          await store.hydrateCaches();
          await store.saveIdentity(identifier, newIdentity);
        });
        it("sets the new key to unverified", async () => {
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.UNVERIFIED);
        });
      });
      describe("The previous verified status was UNVERIFIED", () => {
        before(async () => {
          await window.Signal.Data.createOrUpdateIdentityKey({
            id: theirUuid.toString(),
            publicKey: testKey.pubKey,
            firstUse: true,
            timestamp: oldTimestamp,
            nonblockingApproval: false,
            verified: store.VerifiedStatus.UNVERIFIED
          });
          await store.hydrateCaches();
          await store.saveIdentity(identifier, newIdentity);
        });
        it("sets the new key to unverified", async () => {
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.UNVERIFIED);
        });
      });
    });
    describe("When the key has not changed", () => {
      const oldTimestamp = Date.now();
      before(async () => {
        await window.Signal.Data.createOrUpdateIdentityKey({
          id: theirUuid.toString(),
          publicKey: testKey.pubKey,
          timestamp: oldTimestamp,
          nonblockingApproval: false,
          firstUse: false,
          verified: store.VerifiedStatus.DEFAULT
        });
        await store.hydrateCaches();
      });
      describe("If it is marked firstUse", () => {
        before(async () => {
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          identity.firstUse = true;
          await window.Signal.Data.createOrUpdateIdentityKey(identity);
          await store.hydrateCaches();
        });
        it("nothing changes", async () => {
          await store.saveIdentity(identifier, testKey.pubKey, true);
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          (0, import_chai.assert)(!identity.nonblockingApproval);
          import_chai.assert.strictEqual(identity.timestamp, oldTimestamp);
        });
      });
      describe("If it is not marked firstUse", () => {
        before(async () => {
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          identity.firstUse = false;
          await window.Signal.Data.createOrUpdateIdentityKey(identity);
          await store.hydrateCaches();
        });
        describe("If nonblocking approval is required", () => {
          let now;
          before(async () => {
            now = Date.now();
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            identity.timestamp = now;
            await window.Signal.Data.createOrUpdateIdentityKey(identity);
            await store.hydrateCaches();
          });
          it("sets non-blocking approval", async () => {
            await store.saveIdentity(identifier, testKey.pubKey, true);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.nonblockingApproval, true);
            import_chai.assert.strictEqual(identity.timestamp, now);
            import_chai.assert.strictEqual(identity.firstUse, false);
          });
        });
      });
    });
  });
  describe("saveIdentityWithAttributes", () => {
    let now;
    let validAttributes;
    before(async () => {
      now = Date.now();
      validAttributes = {
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        firstUse: true,
        timestamp: now,
        verified: store.VerifiedStatus.VERIFIED,
        nonblockingApproval: false
      };
      await store.removeIdentityKey(theirUuid);
    });
    describe("with valid attributes", () => {
      before(async () => {
        await store.saveIdentityWithAttributes(theirUuid, validAttributes);
      });
      it("publicKey is saved", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
      });
      it("firstUse is saved", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.firstUse, true);
      });
      it("timestamp is saved", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.timestamp, now);
      });
      it("verified is saved", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
      });
      it("nonblockingApproval is saved", async () => {
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.nonblockingApproval, false);
      });
    });
    describe("with invalid attributes", () => {
      let attributes;
      beforeEach(() => {
        attributes = window._.clone(validAttributes);
      });
      async function testInvalidAttributes() {
        try {
          await store.saveIdentityWithAttributes(theirUuid, attributes);
          throw new Error("saveIdentityWithAttributes should have failed");
        } catch (error) {
        }
      }
      it("rejects an invalid publicKey", async () => {
        attributes.publicKey = "a string";
        await testInvalidAttributes();
      });
      it("rejects invalid firstUse", async () => {
        attributes.firstUse = 0;
        await testInvalidAttributes();
      });
      it("rejects invalid timestamp", async () => {
        attributes.timestamp = NaN;
        await testInvalidAttributes();
      });
      it("rejects invalid verified", async () => {
        attributes.verified = null;
        await testInvalidAttributes();
      });
      it("rejects invalid nonblockingApproval", async () => {
        attributes.nonblockingApproval = 0;
        await testInvalidAttributes();
      });
    });
  });
  describe("setApproval", () => {
    it("sets nonblockingApproval", async () => {
      await store.setApproval(theirUuid, true);
      const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
      if (!identity) {
        throw new Error("Missing identity!");
      }
      import_chai.assert.strictEqual(identity.nonblockingApproval, true);
    });
  });
  describe("setVerified", () => {
    async function saveRecordDefault() {
      await window.Signal.Data.createOrUpdateIdentityKey({
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        firstUse: true,
        timestamp: Date.now(),
        verified: store.VerifiedStatus.DEFAULT,
        nonblockingApproval: false
      });
      await store.hydrateCaches();
    }
    describe("with no public key argument", () => {
      before(saveRecordDefault);
      it("updates the verified status", async () => {
        await store.setVerified(theirUuid, store.VerifiedStatus.VERIFIED);
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
        import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
      });
    });
    describe("with the current public key", () => {
      before(saveRecordDefault);
      it("updates the verified status", async () => {
        await store.setVerified(theirUuid, store.VerifiedStatus.VERIFIED, testKey.pubKey);
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
        import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
      });
    });
    describe("with a mismatching public key", () => {
      const newIdentity = getPublicKey();
      before(saveRecordDefault);
      it("does not change the record.", async () => {
        await store.setVerified(theirUuid, store.VerifiedStatus.VERIFIED, newIdentity);
        const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
        if (!identity) {
          throw new Error("Missing identity!");
        }
        import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.DEFAULT);
        import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
      });
    });
  });
  describe("processVerifiedMessage", () => {
    const newIdentity = getPublicKey();
    let keychangeTriggered;
    beforeEach(() => {
      keychangeTriggered = 0;
      store.bind("keychange", () => {
        keychangeTriggered += 1;
      });
    });
    afterEach(() => {
      store.unbind("keychange");
    });
    describe("when the new verified status is DEFAULT", () => {
      describe("when there is no existing record", () => {
        before(async () => {
          await window.Signal.Data.removeIdentityKeyById(theirUuid.toString());
          await store.hydrateCaches();
        });
        it("sets the identity key", async () => {
          await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.DEFAULT, newIdentity);
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          import_chai.assert.isTrue(identity?.publicKey && (0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
          import_chai.assert.strictEqual(keychangeTriggered, 0);
        });
      });
      describe("when the record exists", () => {
        describe("when the existing key is different", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.VERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("updates the identity", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.DEFAULT, newIdentity);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.DEFAULT);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
            import_chai.assert.strictEqual(keychangeTriggered, 1);
          });
        });
        describe("when the existing key is the same but VERIFIED", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.VERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("updates the verified status", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.DEFAULT, testKey.pubKey);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.DEFAULT);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
        describe("when the existing key is the same and already DEFAULT", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.DEFAULT,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("does not hang", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.DEFAULT, testKey.pubKey);
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
      });
    });
    describe("when the new verified status is UNVERIFIED", () => {
      describe("when there is no existing record", () => {
        before(async () => {
          await window.Signal.Data.removeIdentityKeyById(theirUuid.toString());
          await store.hydrateCaches();
        });
        it("saves the new identity and marks it UNVERIFIED", async () => {
          await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.UNVERIFIED, newIdentity);
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.UNVERIFIED);
          import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
          import_chai.assert.strictEqual(keychangeTriggered, 0);
        });
      });
      describe("when the record exists", () => {
        describe("when the existing key is different", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.VERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("saves the new identity and marks it UNVERIFIED", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.UNVERIFIED, newIdentity);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.UNVERIFIED);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
            import_chai.assert.strictEqual(keychangeTriggered, 1);
          });
        });
        describe("when the key exists and is DEFAULT", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.DEFAULT,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("updates the verified status", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.UNVERIFIED, testKey.pubKey);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.UNVERIFIED);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
        describe("when the key exists and is already UNVERIFIED", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.UNVERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("does not hang", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.UNVERIFIED, testKey.pubKey);
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
      });
    });
    describe("when the new verified status is VERIFIED", () => {
      describe("when there is no existing record", () => {
        before(async () => {
          await window.Signal.Data.removeIdentityKeyById(theirUuid.toString());
          await store.hydrateCaches();
        });
        it("saves the new identity and marks it verified", async () => {
          await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.VERIFIED, newIdentity);
          const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
          if (!identity) {
            throw new Error("Missing identity!");
          }
          import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
          import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
          import_chai.assert.strictEqual(keychangeTriggered, 0);
        });
      });
      describe("when the record exists", () => {
        describe("when the existing key is different", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.VERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("saves the new identity and marks it VERIFIED", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.VERIFIED, newIdentity);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, newIdentity));
            import_chai.assert.strictEqual(keychangeTriggered, 1);
          });
        });
        describe("when the existing key is the same but UNVERIFIED", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.UNVERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("saves the identity and marks it verified", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.VERIFIED, testKey.pubKey);
            const identity = await window.Signal.Data.getIdentityKeyById(theirUuid.toString());
            if (!identity) {
              throw new Error("Missing identity!");
            }
            import_chai.assert.strictEqual(identity.verified, store.VerifiedStatus.VERIFIED);
            import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(identity.publicKey, testKey.pubKey));
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
        describe("when the existing key is the same and already VERIFIED", () => {
          before(async () => {
            await window.Signal.Data.createOrUpdateIdentityKey({
              id: theirUuid.toString(),
              publicKey: testKey.pubKey,
              firstUse: true,
              timestamp: Date.now(),
              verified: store.VerifiedStatus.VERIFIED,
              nonblockingApproval: false
            });
            await store.hydrateCaches();
          });
          it("does not hang", async () => {
            await store.processVerifiedMessage(theirUuid, store.VerifiedStatus.VERIFIED, testKey.pubKey);
            import_chai.assert.strictEqual(keychangeTriggered, 0);
          });
        });
      });
    });
  });
  describe("isUntrusted", () => {
    it("returns false if identity key old enough", async () => {
      await window.Signal.Data.createOrUpdateIdentityKey({
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        timestamp: Date.now() - 10 * 1e3 * 60,
        verified: store.VerifiedStatus.DEFAULT,
        firstUse: false,
        nonblockingApproval: false
      });
      await store.hydrateCaches();
      const untrusted = await store.isUntrusted(theirUuid);
      import_chai.assert.strictEqual(untrusted, false);
    });
    it("returns false if new but nonblockingApproval is true", async () => {
      await window.Signal.Data.createOrUpdateIdentityKey({
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        timestamp: Date.now(),
        verified: store.VerifiedStatus.DEFAULT,
        firstUse: false,
        nonblockingApproval: true
      });
      await store.hydrateCaches();
      const untrusted = await store.isUntrusted(theirUuid);
      import_chai.assert.strictEqual(untrusted, false);
    });
    it("returns false if new but firstUse is true", async () => {
      await window.Signal.Data.createOrUpdateIdentityKey({
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        timestamp: Date.now(),
        verified: store.VerifiedStatus.DEFAULT,
        firstUse: true,
        nonblockingApproval: false
      });
      await store.hydrateCaches();
      const untrusted = await store.isUntrusted(theirUuid);
      import_chai.assert.strictEqual(untrusted, false);
    });
    it("returns true if new, and no flags are set", async () => {
      await window.Signal.Data.createOrUpdateIdentityKey({
        id: theirUuid.toString(),
        publicKey: testKey.pubKey,
        timestamp: Date.now(),
        verified: store.VerifiedStatus.DEFAULT,
        firstUse: false,
        nonblockingApproval: false
      });
      await store.hydrateCaches();
      const untrusted = await store.isUntrusted(theirUuid);
      import_chai.assert.strictEqual(untrusted, true);
    });
  });
  describe("getVerified", () => {
    before(async () => {
      await store.setVerified(theirUuid, store.VerifiedStatus.VERIFIED);
    });
    it("resolves to the verified status", async () => {
      const result = await store.getVerified(theirUuid);
      import_chai.assert.strictEqual(result, store.VerifiedStatus.VERIFIED);
    });
  });
  describe("isTrustedIdentity", () => {
    const identifier = new import_Address.Address(theirUuid, 1);
    describe("When invalid direction is given", () => {
      it("should fail", async () => {
        await import_chai.assert.isRejected(store.isTrustedIdentity(identifier, testKey.pubKey, "dir"));
      });
    });
    describe("When direction is RECEIVING", () => {
      it("always returns true", async () => {
        const newIdentity = getPublicKey();
        await store.saveIdentity(identifier, testKey.pubKey);
        const trusted = await store.isTrustedIdentity(identifier, newIdentity, import_libsignal_client.Direction.Receiving);
        if (!trusted) {
          throw new Error("isTrusted returned false when receiving");
        }
      });
    });
    describe("When direction is SENDING", () => {
      describe("When there is no existing key (first use)", () => {
        before(async () => {
          await store.removeIdentityKey(theirUuid);
        });
        it("returns true", async () => {
          const newIdentity = getPublicKey();
          const trusted = await store.isTrustedIdentity(identifier, newIdentity, import_libsignal_client.Direction.Sending);
          if (!trusted) {
            throw new Error("isTrusted returned false on first use");
          }
        });
      });
      describe("When there is an existing key", () => {
        before(async () => {
          await store.saveIdentity(identifier, testKey.pubKey);
        });
        describe("When the existing key is different", () => {
          it("returns false", async () => {
            const newIdentity = getPublicKey();
            const trusted = await store.isTrustedIdentity(identifier, newIdentity, import_libsignal_client.Direction.Sending);
            if (trusted) {
              throw new Error("isTrusted returned true on untrusted key");
            }
          });
        });
        describe("When the existing key matches the new key", () => {
          const newIdentity = getPublicKey();
          before(async () => {
            await store.saveIdentity(identifier, newIdentity);
          });
          it("returns false if keys match but we just received this new identiy", async () => {
            const trusted = await store.isTrustedIdentity(identifier, newIdentity, import_libsignal_client.Direction.Sending);
            if (trusted) {
              throw new Error("isTrusted returned true on untrusted key");
            }
          });
          it("returns true if we have already approved identity", async () => {
            await store.saveIdentity(identifier, newIdentity, true);
            const trusted = await store.isTrustedIdentity(identifier, newIdentity, import_libsignal_client.Direction.Sending);
            if (!trusted) {
              throw new Error("isTrusted returned false on an approved key");
            }
          });
        });
      });
    });
  });
  describe("storePreKey", () => {
    it("stores prekeys", async () => {
      await store.storePreKey(ourUuid, 1, testKey);
      const key = await store.loadPreKey(ourUuid, 1);
      if (!key) {
        throw new Error("Missing key!");
      }
      const keyPair = {
        pubKey: key.publicKey().serialize(),
        privKey: key.privateKey().serialize()
      };
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(keyPair.pubKey, testKey.pubKey));
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(keyPair.privKey, testKey.privKey));
    });
  });
  describe("removePreKey", () => {
    before(async () => {
      await store.storePreKey(ourUuid, 2, testKey);
    });
    it("deletes prekeys", async () => {
      await store.removePreKey(ourUuid, 2);
      const key = await store.loadPreKey(ourUuid, 2);
      import_chai.assert.isUndefined(key);
    });
  });
  describe("storeSignedPreKey", () => {
    it("stores signed prekeys", async () => {
      await store.storeSignedPreKey(ourUuid, 3, testKey);
      const key = await store.loadSignedPreKey(ourUuid, 3);
      if (!key) {
        throw new Error("Missing key!");
      }
      const keyPair = {
        pubKey: key.publicKey().serialize(),
        privKey: key.privateKey().serialize()
      };
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(keyPair.pubKey, testKey.pubKey));
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(keyPair.privKey, testKey.privKey));
    });
  });
  describe("removeSignedPreKey", () => {
    before(async () => {
      await store.storeSignedPreKey(ourUuid, 4, testKey);
    });
    it("deletes signed prekeys", async () => {
      await store.removeSignedPreKey(ourUuid, 4);
      const key = await store.loadSignedPreKey(ourUuid, 4);
      import_chai.assert.isUndefined(key);
    });
  });
  describe("storeSession", () => {
    it("stores sessions", async () => {
      const testRecord = getSessionRecord();
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      await store.storeSession(id, testRecord);
      const record = await store.loadSession(id);
      if (!record) {
        throw new Error("Missing record!");
      }
      import_chai.assert.equal(record, testRecord);
    });
  });
  describe("removeAllSessions", () => {
    it("removes all sessions for a uuid", async () => {
      const devices = [1, 2, 3].map((deviceId) => new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId)));
      await Promise.all(devices.map(async (encodedAddress) => {
        await store.storeSession(encodedAddress, getSessionRecord());
      }));
      await store.removeAllSessions(theirUuid.toString());
      const records = await Promise.all(devices.map((device) => store.loadSession(device)));
      for (let i = 0, max = records.length; i < max; i += 1) {
        import_chai.assert.isUndefined(records[i]);
      }
    });
  });
  describe("clearSessionStore", () => {
    it("clears the session store", async () => {
      const testRecord = getSessionRecord();
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      await store.storeSession(id, testRecord);
      await store.clearSessionStore();
      const record = await store.loadSession(id);
      import_chai.assert.isUndefined(record);
    });
  });
  describe("getDeviceIds", () => {
    it("returns deviceIds for a uuid", async () => {
      const openRecord = getSessionRecord(true);
      const openDevices = [1, 2, 3, 10].map((deviceId) => new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId)));
      await Promise.all(openDevices.map(async (address) => {
        await store.storeSession(address, openRecord);
      }));
      const closedRecord = getSessionRecord(false);
      await store.storeSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 11)), closedRecord);
      const deviceIds = await store.getDeviceIds({
        ourUuid,
        identifier: theirUuid.toString()
      });
      import_chai.assert.sameMembers(deviceIds, [1, 2, 3, 10]);
    });
    it("returns empty array for a uuid with no device ids", async () => {
      const deviceIds = await store.getDeviceIds({
        ourUuid,
        identifier: "foo"
      });
      import_chai.assert.sameMembers(deviceIds, []);
    });
  });
  describe("getOpenDevices", () => {
    it("returns all open devices for a uuid", async () => {
      const openRecord = getSessionRecord(true);
      const openDevices = [1, 2, 3, 10].map((deviceId) => new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId)));
      await Promise.all(openDevices.map(async (address) => {
        await store.storeSession(address, openRecord);
      }));
      const closedRecord = getSessionRecord(false);
      await store.storeSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 11)), closedRecord);
      const result = await store.getOpenDevices(ourUuid, [
        theirUuid.toString(),
        "blah",
        "blah2"
      ]);
      import_chai.assert.deepStrictEqual({
        ...result,
        devices: result.devices.map(({ id, identifier, registrationId }) => ({
          id,
          identifier: identifier.toString(),
          registrationId
        }))
      }, {
        devices: [
          {
            id: 1,
            identifier: theirUuid.toString(),
            registrationId: 243
          },
          {
            id: 2,
            identifier: theirUuid.toString(),
            registrationId: 243
          },
          {
            id: 3,
            identifier: theirUuid.toString(),
            registrationId: 243
          },
          {
            id: 10,
            identifier: theirUuid.toString(),
            registrationId: 243
          }
        ],
        emptyIdentifiers: ["blah", "blah2"]
      });
    });
    it("returns empty array for a uuid with no device ids", async () => {
      const result = await store.getOpenDevices(ourUuid, ["foo"]);
      import_chai.assert.deepEqual(result, {
        devices: [],
        emptyIdentifiers: ["foo"]
      });
    });
  });
  describe("zones", () => {
    const distributionId = import_UUID.UUID.generate().toString();
    const zone = new import_Zone.Zone("zone", {
      pendingSenderKeys: true,
      pendingSessions: true,
      pendingUnprocessed: true
    });
    beforeEach(async () => {
      await store.removeAllUnprocessed();
      await store.removeAllSessions(theirUuid.toString());
      await store.removeAllSenderKeys();
    });
    it("should not store pending sessions in global zone", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const testRecord = getSessionRecord();
      await import_chai.assert.isRejected(store.withZone(import_SignalProtocolStore.GLOBAL_ZONE, "test", async () => {
        await store.storeSession(id, testRecord);
        throw new Error("Failure");
      }), "Failure");
      import_chai.assert.equal(await store.loadSession(id), testRecord);
    });
    it("should not store pending sender keys in global zone", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const testRecord = getSenderKeyRecord();
      await import_chai.assert.isRejected(store.withZone(import_SignalProtocolStore.GLOBAL_ZONE, "test", async () => {
        await store.saveSenderKey(id, distributionId, testRecord);
        throw new Error("Failure");
      }), "Failure");
      import_chai.assert.equal(await store.getSenderKey(id, distributionId), testRecord);
    });
    it("commits sender keys, sessions and unprocessed on success", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const testSession = getSessionRecord();
      const testSenderKey = getSenderKeyRecord();
      await store.withZone(zone, "test", async () => {
        await store.storeSession(id, testSession, { zone });
        await store.saveSenderKey(id, distributionId, testSenderKey, { zone });
        await store.addUnprocessed({
          id: "2-two",
          version: 2,
          attempts: 0,
          envelope: "second",
          receivedAtCounter: 0,
          timestamp: Date.now() + 2,
          urgent: true
        }, { zone });
        import_chai.assert.equal(await store.loadSession(id, { zone }), testSession);
        import_chai.assert.equal(await store.getSenderKey(id, distributionId, { zone }), testSenderKey);
      });
      import_chai.assert.equal(await store.loadSession(id), testSession);
      import_chai.assert.equal(await store.getSenderKey(id, distributionId), testSenderKey);
      const allUnprocessed = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.deepEqual(allUnprocessed.map(({ envelope }) => envelope), ["second"]);
    });
    it("reverts sender keys, sessions and unprocessed on error", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const testSession = getSessionRecord();
      const failedSession = getSessionRecord();
      const testSenderKey = getSenderKeyRecord();
      const failedSenderKey = getSenderKeyRecord();
      await store.storeSession(id, testSession);
      import_chai.assert.equal(await store.loadSession(id), testSession);
      await store.saveSenderKey(id, distributionId, testSenderKey);
      import_chai.assert.equal(await store.getSenderKey(id, distributionId), testSenderKey);
      await import_chai.assert.isRejected(store.withZone(zone, "test", async () => {
        await store.storeSession(id, failedSession, { zone });
        import_chai.assert.equal(await store.loadSession(id, { zone }), failedSession);
        await store.saveSenderKey(id, distributionId, failedSenderKey, {
          zone
        });
        import_chai.assert.equal(await store.getSenderKey(id, distributionId, { zone }), failedSenderKey);
        await store.addUnprocessed({
          id: "2-two",
          version: 2,
          attempts: 0,
          envelope: "second",
          receivedAtCounter: 0,
          timestamp: 2,
          urgent: true
        }, { zone });
        throw new Error("Failure");
      }), "Failure");
      import_chai.assert.equal(await store.loadSession(id), testSession);
      import_chai.assert.equal(await store.getSenderKey(id, distributionId), testSenderKey);
      import_chai.assert.deepEqual(await store.getAllUnprocessedAndIncrementAttempts(), []);
    });
    it("can be re-entered", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const testRecord = getSessionRecord();
      await store.withZone(zone, "test", async () => {
        await store.withZone(zone, "nested", async () => {
          await store.storeSession(id, testRecord, { zone });
          import_chai.assert.equal(await store.loadSession(id, { zone }), testRecord);
        });
        import_chai.assert.equal(await store.loadSession(id, { zone }), testRecord);
      });
      import_chai.assert.equal(await store.loadSession(id), testRecord);
    });
    it("can be re-entered after waiting", async () => {
      const a = new import_Zone.Zone("a");
      const b = new import_Zone.Zone("b");
      const order = [];
      const promises = [];
      promises.push(store.withZone(a, "a", async () => order.push(1)));
      promises.push(store.withZone(b, "b", async () => order.push(2)));
      await Promise.resolve();
      await Promise.resolve();
      promises.push(store.withZone(a, "a again", async () => order.push(3)));
      await Promise.all(promises);
      import_chai.assert.deepEqual(order, [1, 2, 3]);
    });
    it("should not deadlock in archiveSiblingSessions", async () => {
      const id = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 1));
      const sibling = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, 2));
      await store.storeSession(id, getSessionRecord(true));
      await store.storeSession(sibling, getSessionRecord(true));
      await store.archiveSiblingSessions(id.address, { zone });
    });
    it("can be concurrently re-entered after waiting", async () => {
      const a = new import_Zone.Zone("a");
      const b = new import_Zone.Zone("b");
      const order = [];
      const promises = [];
      promises.push(store.withZone(a, "a", async () => order.push(1)));
      promises.push(store.withZone(b, "b", async () => {
        order.push(2);
        await Promise.resolve();
        order.push(22);
      }));
      promises.push(store.withZone(b, "b", async () => {
        order.push(3);
        await Promise.resolve();
        order.push(33);
      }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.all(promises);
      import_chai.assert.deepEqual(order, [1, 2, 3, 22, 33]);
    });
  });
  describe("Not yet processed messages", () => {
    const NOW = Date.now();
    beforeEach(async () => {
      await store.removeAllUnprocessed();
      const items = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.strictEqual(items.length, 0);
    });
    it("adds three and gets them back", async () => {
      await Promise.all([
        store.addUnprocessed({
          id: "0-dropped",
          version: 2,
          attempts: 0,
          envelope: "old envelope",
          receivedAtCounter: -1,
          timestamp: NOW - 2 * durations.MONTH,
          urgent: true
        }),
        store.addUnprocessed({
          id: "2-two",
          version: 2,
          attempts: 0,
          envelope: "second",
          receivedAtCounter: 1,
          timestamp: NOW + 2,
          urgent: true
        }),
        store.addUnprocessed({
          id: "3-three",
          version: 2,
          attempts: 0,
          envelope: "third",
          receivedAtCounter: 2,
          timestamp: NOW + 3,
          urgent: true
        }),
        store.addUnprocessed({
          id: "1-one",
          version: 2,
          attempts: 0,
          envelope: "first",
          receivedAtCounter: 0,
          timestamp: NOW + 1,
          urgent: true
        })
      ]);
      const items = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.strictEqual(items.length, 3);
      import_chai.assert.strictEqual(items[0].envelope, "first");
      import_chai.assert.strictEqual(items[1].envelope, "second");
      import_chai.assert.strictEqual(items[2].envelope, "third");
    });
    it("can updates items", async () => {
      const id = "1-one";
      await store.addUnprocessed({
        id,
        version: 2,
        attempts: 0,
        envelope: "first",
        receivedAtCounter: 0,
        timestamp: NOW + 1,
        urgent: false
      });
      await store.updateUnprocessedWithData(id, { decrypted: "updated" });
      const items = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.strictEqual(items.length, 1);
      import_chai.assert.strictEqual(items[0].decrypted, "updated");
      import_chai.assert.strictEqual(items[0].timestamp, NOW + 1);
      import_chai.assert.strictEqual(items[0].attempts, 1);
      import_chai.assert.strictEqual(items[0].urgent, false);
    });
    it("removeUnprocessed successfully deletes item", async () => {
      const id = "1-one";
      await store.addUnprocessed({
        id,
        version: 2,
        attempts: 0,
        envelope: "first",
        receivedAtCounter: 0,
        timestamp: NOW + 1,
        urgent: true
      });
      await store.removeUnprocessed(id);
      const items = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.strictEqual(items.length, 0);
    });
    it("getAllUnprocessedAndIncrementAttempts deletes items", async () => {
      await store.addUnprocessed({
        id: "1-one",
        version: 2,
        attempts: 3,
        envelope: "first",
        receivedAtCounter: 0,
        timestamp: NOW + 1,
        urgent: true
      });
      const items = await store.getAllUnprocessedAndIncrementAttempts();
      import_chai.assert.strictEqual(items.length, 0);
    });
  });
  describe("removeOurOldPni/updateOurPniKeyMaterial", () => {
    beforeEach(async () => {
      await store.storePreKey(ourUuid, 2, testKey);
      await store.storeSignedPreKey(ourUuid, 3, testKey);
    });
    it("removes old data and sets new", async () => {
      const oldPni = ourUuid;
      const newPni = import_UUID.UUID.generate();
      const newIdentity = import_libsignal_client.IdentityKeyPair.generate();
      const data = (0, import_Curve.generateSignedPreKey)({
        pubKey: newIdentity.publicKey.serialize(),
        privKey: newIdentity.privateKey.serialize()
      }, 8201);
      const createdAt = Date.now() - 1241;
      const signedPreKey = import_libsignal_client.SignedPreKeyRecord.new(data.keyId, createdAt, import_libsignal_client.PublicKey.deserialize(Buffer.from(data.keyPair.pubKey)), import_libsignal_client.PrivateKey.deserialize(Buffer.from(data.keyPair.privKey)), Buffer.from(data.signature));
      await store.removeOurOldPni(oldPni);
      await store.updateOurPniKeyMaterial(newPni, {
        identityKeyPair: newIdentity.serialize(),
        signedPreKey: signedPreKey.serialize(),
        registrationId: 5231
      });
      import_chai.assert.isUndefined(await store.getIdentityKeyPair(oldPni));
      import_chai.assert.isUndefined(await store.getLocalRegistrationId(oldPni));
      import_chai.assert.isUndefined(await store.loadPreKey(oldPni, 2));
      import_chai.assert.isUndefined(await store.loadSignedPreKey(oldPni, 3));
      const storedIdentity = await store.getIdentityKeyPair(newPni);
      if (!storedIdentity) {
        throw new Error("New identity not found");
      }
      import_chai.assert.isTrue(Bytes.areEqual(storedIdentity.privKey, newIdentity.privateKey.serialize()));
      import_chai.assert.isTrue(Bytes.areEqual(storedIdentity.pubKey, newIdentity.publicKey.serialize()));
      const storedSignedPreKey = await store.loadSignedPreKey(newPni, 8201);
      if (!storedSignedPreKey) {
        throw new Error("New signed pre key not found");
      }
      import_chai.assert.isTrue(Bytes.areEqual(storedSignedPreKey.publicKey().serialize(), data.keyPair.pubKey));
      import_chai.assert.isTrue(Bytes.areEqual(storedSignedPreKey.privateKey().serialize(), data.keyPair.privKey));
      import_chai.assert.strictEqual(storedSignedPreKey.timestamp(), createdAt);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU2lnbmFsUHJvdG9jb2xTdG9yZV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuXG5pbXBvcnQgY2hhaSwgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcbmltcG9ydCB7XG4gIERpcmVjdGlvbixcbiAgSWRlbnRpdHlLZXlQYWlyLFxuICBQcml2YXRlS2V5LFxuICBQdWJsaWNLZXksXG4gIFNlbmRlcktleVJlY29yZCxcbiAgU2Vzc2lvblJlY29yZCxcbiAgU2lnbmVkUHJlS2V5UmVjb3JkLFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuXG5pbXBvcnQgeyBzaWduYWwgfSBmcm9tICcuLi9wcm90b2J1Zi9jb21waWxlZCc7XG5pbXBvcnQgeyBzZXNzaW9uU3RydWN0dXJlVG9CeXRlcyB9IGZyb20gJy4uL3V0aWwvc2Vzc2lvblRyYW5zbGF0aW9uJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBab25lIH0gZnJvbSAnLi4vdXRpbC9ab25lJztcblxuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQnl0ZXMsIGNvbnN0YW50VGltZUVxdWFsIH0gZnJvbSAnLi4vQ3J5cHRvJztcbmltcG9ydCB7XG4gIGNsYW1wUHJpdmF0ZUtleSxcbiAgc2V0UHVibGljS2V5VHlwZUJ5dGUsXG4gIGdlbmVyYXRlU2lnbmVkUHJlS2V5LFxufSBmcm9tICcuLi9DdXJ2ZSc7XG5pbXBvcnQgdHlwZSB7IFNpZ25hbFByb3RvY29sU3RvcmUgfSBmcm9tICcuLi9TaWduYWxQcm90b2NvbFN0b3JlJztcbmltcG9ydCB7IEdMT0JBTF9aT05FIH0gZnJvbSAnLi4vU2lnbmFsUHJvdG9jb2xTdG9yZSc7XG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvQWRkcmVzcyc7XG5pbXBvcnQgeyBRdWFsaWZpZWRBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvUXVhbGlmaWVkQWRkcmVzcyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IElkZW50aXR5S2V5VHlwZSwgS2V5UGFpclR5cGUgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1R5cGVzLmQnO1xuXG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmNvbnN0IHtcbiAgUmVjb3JkU3RydWN0dXJlLFxuICBTZXNzaW9uU3RydWN0dXJlLFxuICBTZW5kZXJLZXlSZWNvcmRTdHJ1Y3R1cmUsXG4gIFNlbmRlcktleVN0YXRlU3RydWN0dXJlLFxufSA9IHNpZ25hbC5wcm90by5zdG9yYWdlO1xuXG5kZXNjcmliZSgnU2lnbmFsUHJvdG9jb2xTdG9yZScsICgpID0+IHtcbiAgY29uc3Qgb3VyVXVpZCA9IFVVSUQuZ2VuZXJhdGUoKTtcbiAgY29uc3QgdGhlaXJVdWlkID0gVVVJRC5nZW5lcmF0ZSgpO1xuICBsZXQgc3RvcmU6IFNpZ25hbFByb3RvY29sU3RvcmU7XG4gIGxldCBpZGVudGl0eUtleTogS2V5UGFpclR5cGU7XG4gIGxldCB0ZXN0S2V5OiBLZXlQYWlyVHlwZTtcblxuICBmdW5jdGlvbiBnZXRTZXNzaW9uUmVjb3JkKGlzT3Blbj86IGJvb2xlYW4pOiBTZXNzaW9uUmVjb3JkIHtcbiAgICBjb25zdCBwcm90byA9IG5ldyBSZWNvcmRTdHJ1Y3R1cmUoKTtcblxuICAgIHByb3RvLnByZXZpb3VzU2Vzc2lvbnMgPSBbXTtcblxuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIHByb3RvLmN1cnJlbnRTZXNzaW9uID0gbmV3IFNlc3Npb25TdHJ1Y3R1cmUoKTtcblxuICAgICAgcHJvdG8uY3VycmVudFNlc3Npb24uYWxpY2VCYXNlS2V5ID0gZ2V0UHVibGljS2V5KCk7XG4gICAgICBwcm90by5jdXJyZW50U2Vzc2lvbi5sb2NhbElkZW50aXR5UHVibGljID0gZ2V0UHVibGljS2V5KCk7XG4gICAgICBwcm90by5jdXJyZW50U2Vzc2lvbi5sb2NhbFJlZ2lzdHJhdGlvbklkID0gNDM1O1xuXG4gICAgICBwcm90by5jdXJyZW50U2Vzc2lvbi5wcmV2aW91c0NvdW50ZXIgPSAxO1xuICAgICAgcHJvdG8uY3VycmVudFNlc3Npb24ucmVtb3RlSWRlbnRpdHlQdWJsaWMgPSBnZXRQdWJsaWNLZXkoKTtcbiAgICAgIHByb3RvLmN1cnJlbnRTZXNzaW9uLnJlbW90ZVJlZ2lzdHJhdGlvbklkID0gMjQzO1xuXG4gICAgICBwcm90by5jdXJyZW50U2Vzc2lvbi5yb290S2V5ID0gZ2V0UHJpdmF0ZUtleSgpO1xuICAgICAgcHJvdG8uY3VycmVudFNlc3Npb24uc2Vzc2lvblZlcnNpb24gPSAzO1xuICAgIH1cblxuICAgIHJldHVybiBTZXNzaW9uUmVjb3JkLmRlc2VyaWFsaXplKFxuICAgICAgQnVmZmVyLmZyb20oc2Vzc2lvblN0cnVjdHVyZVRvQnl0ZXMocHJvdG8pKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTZW5kZXJLZXlSZWNvcmQoKTogU2VuZGVyS2V5UmVjb3JkIHtcbiAgICBjb25zdCBwcm90byA9IG5ldyBTZW5kZXJLZXlSZWNvcmRTdHJ1Y3R1cmUoKTtcblxuICAgIGNvbnN0IHN0YXRlID0gbmV3IFNlbmRlcktleVN0YXRlU3RydWN0dXJlKCk7XG5cbiAgICBzdGF0ZS5zZW5kZXJLZXlJZCA9IDQ7XG5cbiAgICBjb25zdCBzZW5kZXJDaGFpbktleSA9IG5ldyBTZW5kZXJLZXlTdGF0ZVN0cnVjdHVyZS5TZW5kZXJDaGFpbktleSgpO1xuXG4gICAgc2VuZGVyQ2hhaW5LZXkuaXRlcmF0aW9uID0gMTA7XG4gICAgc2VuZGVyQ2hhaW5LZXkuc2VlZCA9IGdldFB1YmxpY0tleSgpO1xuICAgIHN0YXRlLnNlbmRlckNoYWluS2V5ID0gc2VuZGVyQ2hhaW5LZXk7XG5cbiAgICBjb25zdCBzZW5kZXJTaWduaW5nS2V5ID0gbmV3IFNlbmRlcktleVN0YXRlU3RydWN0dXJlLlNlbmRlclNpZ25pbmdLZXkoKTtcbiAgICBzZW5kZXJTaWduaW5nS2V5LnB1YmxpYyA9IGdldFB1YmxpY0tleSgpO1xuICAgIHNlbmRlclNpZ25pbmdLZXkucHJpdmF0ZSA9IGdldFByaXZhdGVLZXkoKTtcblxuICAgIHN0YXRlLnNlbmRlclNpZ25pbmdLZXkgPSBzZW5kZXJTaWduaW5nS2V5O1xuXG4gICAgc3RhdGUuc2VuZGVyTWVzc2FnZUtleXMgPSBbXTtcbiAgICBjb25zdCBtZXNzYWdlS2V5ID0gbmV3IFNlbmRlcktleVN0YXRlU3RydWN0dXJlLlNlbmRlck1lc3NhZ2VLZXkoKTtcbiAgICBtZXNzYWdlS2V5Lml0ZXJhdGlvbiA9IDIzNDtcbiAgICBtZXNzYWdlS2V5LnNlZWQgPSBnZXRQdWJsaWNLZXkoKTtcbiAgICBzdGF0ZS5zZW5kZXJNZXNzYWdlS2V5cy5wdXNoKG1lc3NhZ2VLZXkpO1xuXG4gICAgcHJvdG8uc2VuZGVyS2V5U3RhdGVzID0gW107XG4gICAgcHJvdG8uc2VuZGVyS2V5U3RhdGVzLnB1c2goc3RhdGUpO1xuXG4gICAgcmV0dXJuIFNlbmRlcktleVJlY29yZC5kZXNlcmlhbGl6ZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBzaWduYWwucHJvdG8uc3RvcmFnZS5TZW5kZXJLZXlSZWNvcmRTdHJ1Y3R1cmUuZW5jb2RlKHByb3RvKS5maW5pc2goKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQcml2YXRlS2V5KCkge1xuICAgIGNvbnN0IGtleSA9IGdldFJhbmRvbUJ5dGVzKDMyKTtcbiAgICBjbGFtcFByaXZhdGVLZXkoa2V5KTtcbiAgICByZXR1cm4ga2V5O1xuICB9XG4gIGZ1bmN0aW9uIGdldFB1YmxpY0tleSgpIHtcbiAgICBjb25zdCBrZXkgPSBnZXRSYW5kb21CeXRlcygzMyk7XG4gICAgc2V0UHVibGljS2V5VHlwZUJ5dGUoa2V5KTtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBzdG9yZSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2w7XG4gICAgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgIGlkZW50aXR5S2V5ID0ge1xuICAgICAgcHViS2V5OiBnZXRQdWJsaWNLZXkoKSxcbiAgICAgIHByaXZLZXk6IGdldFByaXZhdGVLZXkoKSxcbiAgICB9O1xuICAgIHRlc3RLZXkgPSB7XG4gICAgICBwdWJLZXk6IGdldFB1YmxpY0tleSgpLFxuICAgICAgcHJpdktleTogZ2V0UHJpdmF0ZUtleSgpLFxuICAgIH07XG5cbiAgICBzZXRQdWJsaWNLZXlUeXBlQnl0ZShpZGVudGl0eUtleS5wdWJLZXkpO1xuICAgIHNldFB1YmxpY0tleVR5cGVCeXRlKHRlc3RLZXkucHViS2V5KTtcblxuICAgIGNsYW1wUHJpdmF0ZUtleShpZGVudGl0eUtleS5wcml2S2V5KTtcbiAgICBjbGFtcFByaXZhdGVLZXkodGVzdEtleS5wcml2S2V5KTtcblxuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgncmVnaXN0cmF0aW9uSWRNYXAnLCB7IFtvdXJVdWlkLnRvU3RyaW5nKCldOiAxMzM3IH0pO1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgnaWRlbnRpdHlLZXlNYXAnLCB7XG4gICAgICBbb3VyVXVpZC50b1N0cmluZygpXToge1xuICAgICAgICBwcml2S2V5OiBpZGVudGl0eUtleS5wcml2S2V5LFxuICAgICAgICBwdWJLZXk6IGlkZW50aXR5S2V5LnB1YktleSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgYXdhaXQgd2luZG93LnN0b3JhZ2UuZmV0Y2goKTtcblxuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLnJlc2V0KCk7XG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9hZCgpO1xuICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlQW5kV2FpdChcbiAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgJ3ByaXZhdGUnXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldExvY2FsUmVnaXN0cmF0aW9uSWQnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHJpZXZlcyBteSByZWdpc3RyYXRpb24gaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICBjb25zdCBpZCA9IGF3YWl0IHN0b3JlLmdldExvY2FsUmVnaXN0cmF0aW9uSWQob3VyVXVpZCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWQsIDEzMzcpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ2dldElkZW50aXR5S2V5UGFpcicsICgpID0+IHtcbiAgICBpdCgncmV0cmlldmVzIG15IGlkZW50aXR5IGtleScsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHN0b3JlLmdldElkZW50aXR5S2V5UGFpcihvdXJVdWlkKTtcbiAgICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBrZXkhJyk7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoa2V5LnB1YktleSwgaWRlbnRpdHlLZXkucHViS2V5KSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGtleS5wcml2S2V5LCBpZGVudGl0eUtleS5wcml2S2V5KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzZW5kZXJLZXlzJywgKCkgPT4ge1xuICAgIGl0KCdyb3VuZHRyaXBzIGluIG1lbW9yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpc3RyaWJ1dGlvbklkID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IGdldFNlbmRlcktleVJlY29yZCgpO1xuXG4gICAgICBjb25zdCBkZXZpY2VJZCA9IDE7XG4gICAgICBjb25zdCBxdWFsaWZpZWRBZGRyZXNzID0gbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICAgIG91clV1aWQsXG4gICAgICAgIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgZGV2aWNlSWQpXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBzdG9yZS5zYXZlU2VuZGVyS2V5KHF1YWxpZmllZEFkZHJlc3MsIGRpc3RyaWJ1dGlvbklkLCBleHBlY3RlZCk7XG5cbiAgICAgIGNvbnN0IGFjdHVhbCA9IGF3YWl0IHN0b3JlLmdldFNlbmRlcktleShxdWFsaWZpZWRBZGRyZXNzLCBkaXN0cmlidXRpb25JZCk7XG4gICAgICBpZiAoIWFjdHVhbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNlbmRlcktleSByZXR1cm5lZCBub3RoaW5nIScpO1xuICAgICAgfVxuXG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBjb25zdGFudFRpbWVFcXVhbChleHBlY3RlZC5zZXJpYWxpemUoKSwgYWN0dWFsLnNlcmlhbGl6ZSgpKVxuICAgICAgKTtcblxuICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlU2VuZGVyS2V5KHF1YWxpZmllZEFkZHJlc3MsIGRpc3RyaWJ1dGlvbklkKTtcblxuICAgICAgY29uc3QgcG9zdERlbGV0ZUdldCA9IGF3YWl0IHN0b3JlLmdldFNlbmRlcktleShcbiAgICAgICAgcXVhbGlmaWVkQWRkcmVzcyxcbiAgICAgICAgZGlzdHJpYnV0aW9uSWRcbiAgICAgICk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocG9zdERlbGV0ZUdldCk7XG4gICAgfSk7XG5cbiAgICBpdCgncm91bmR0cmlwcyB0aHJvdWdoIGRhdGFiYXNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlzdHJpYnV0aW9uSWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gZ2V0U2VuZGVyS2V5UmVjb3JkKCk7XG5cbiAgICAgIGNvbnN0IGRldmljZUlkID0gMTtcbiAgICAgIGNvbnN0IHF1YWxpZmllZEFkZHJlc3MgPSBuZXcgUXVhbGlmaWVkQWRkcmVzcyhcbiAgICAgICAgb3VyVXVpZCxcbiAgICAgICAgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCBkZXZpY2VJZClcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IHN0b3JlLnNhdmVTZW5kZXJLZXkocXVhbGlmaWVkQWRkcmVzcywgZGlzdHJpYnV0aW9uSWQsIGV4cGVjdGVkKTtcblxuICAgICAgLy8gUmUtZmV0Y2ggZnJvbSB0aGUgZGF0YWJhc2UgdG8gZW5zdXJlIHdlIGdldCB0aGUgbGF0ZXN0IGRhdGFiYXNlIHZhbHVlXG4gICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG5cbiAgICAgIGNvbnN0IGFjdHVhbCA9IGF3YWl0IHN0b3JlLmdldFNlbmRlcktleShxdWFsaWZpZWRBZGRyZXNzLCBkaXN0cmlidXRpb25JZCk7XG4gICAgICBpZiAoIWFjdHVhbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNlbmRlcktleSByZXR1cm5lZCBub3RoaW5nIScpO1xuICAgICAgfVxuXG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBjb25zdGFudFRpbWVFcXVhbChleHBlY3RlZC5zZXJpYWxpemUoKSwgYWN0dWFsLnNlcmlhbGl6ZSgpKVxuICAgICAgKTtcblxuICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlU2VuZGVyS2V5KHF1YWxpZmllZEFkZHJlc3MsIGRpc3RyaWJ1dGlvbklkKTtcblxuICAgICAgLy8gUmUtZmV0Y2ggZnJvbSB0aGUgZGF0YWJhc2UgdG8gZW5zdXJlIHdlIGdldCB0aGUgbGF0ZXN0IGRhdGFiYXNlIHZhbHVlXG4gICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG5cbiAgICAgIGNvbnN0IHBvc3REZWxldGVHZXQgPSBhd2FpdCBzdG9yZS5nZXRTZW5kZXJLZXkoXG4gICAgICAgIHF1YWxpZmllZEFkZHJlc3MsXG4gICAgICAgIGRpc3RyaWJ1dGlvbklkXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHBvc3REZWxldGVHZXQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2F2ZUlkZW50aXR5JywgKCkgPT4ge1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgQWRkcmVzcyh0aGVpclV1aWQsIDEpO1xuXG4gICAgaXQoJ3N0b3JlcyBpZGVudGl0eSBrZXlzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5KGlkZW50aWZpZXIsIHRlc3RLZXkucHViS2V5KTtcbiAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHN0b3JlLmxvYWRJZGVudGl0eUtleSh0aGVpclV1aWQpO1xuICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGtleSEnKTtcbiAgICAgIH1cblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChrZXksIHRlc3RLZXkucHViS2V5KSk7XG4gICAgfSk7XG4gICAgaXQoJ2FsbG93cyBrZXkgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld0lkZW50aXR5ID0gZ2V0UHVibGljS2V5KCk7XG4gICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgdGVzdEtleS5wdWJLZXkpO1xuICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5KGlkZW50aWZpZXIsIG5ld0lkZW50aXR5KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaGVuIHRoZXJlIGlzIG5vIGV4aXN0aW5nIGtleSAoZmlyc3QgdXNlKScsICgpID0+IHtcbiAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZUlkZW50aXR5S2V5KHRoZWlyVXVpZCk7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNhdmVJZGVudGl0eShpZGVudGlmaWVyLCB0ZXN0S2V5LnB1YktleSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdtYXJrcyB0aGUga2V5IGZpcnN0VXNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoaWRlbnRpdHkuZmlyc3RVc2UpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2V0cyB0aGUgdGltZXN0YW1wJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoaWRlbnRpdHkudGltZXN0YW1wKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3NldHMgdGhlIHZlcmlmaWVkIHN0YXR1cyB0byBERUZBVUxUJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkudmVyaWZpZWQsIHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBkaWZmZXJlbnQgZXhpc3Rpbmcga2V5IChub24gZmlyc3QgdXNlKScsICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld0lkZW50aXR5ID0gZ2V0UHVibGljS2V5KCk7XG4gICAgICBjb25zdCBvbGRUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgIHB1YmxpY0tleTogdGVzdEtleS5wdWJLZXksXG4gICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgdGltZXN0YW1wOiBvbGRUaW1lc3RhbXAsXG4gICAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5KGlkZW50aWZpZXIsIG5ld0lkZW50aXR5KTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ21hcmtzIHRoZSBrZXkgbm90IGZpcnN0VXNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoIWlkZW50aXR5LmZpcnN0VXNlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3VwZGF0ZXMgdGhlIHRpbWVzdGFtcCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICk7XG4gICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0Lm5vdEVxdWFsKGlkZW50aXR5LnRpbWVzdGFtcCwgb2xkVGltZXN0YW1wKTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnVGhlIHByZXZpb3VzIHZlcmlmaWVkIHN0YXR1cyB3YXMgREVGQVVMVCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG9sZFRpbWVzdGFtcCxcbiAgICAgICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuXG4gICAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5KGlkZW50aWZpZXIsIG5ld0lkZW50aXR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzZXRzIHRoZSBuZXcga2V5IHRvIGRlZmF1bHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGlkZW50aXR5LnZlcmlmaWVkLCBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxUKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdUaGUgcHJldmlvdXMgdmVyaWZpZWQgc3RhdHVzIHdhcyBWRVJJRklFRCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG9sZFRpbWVzdGFtcCxcbiAgICAgICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnNhdmVJZGVudGl0eShpZGVudGlmaWVyLCBuZXdJZGVudGl0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2V0cyB0aGUgbmV3IGtleSB0byB1bnZlcmlmaWVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICAgIGlkZW50aXR5LnZlcmlmaWVkLFxuICAgICAgICAgICAgc3RvcmUuVmVyaWZpZWRTdGF0dXMuVU5WRVJJRklFRFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkZXNjcmliZSgnVGhlIHByZXZpb3VzIHZlcmlmaWVkIHN0YXR1cyB3YXMgVU5WRVJJRklFRCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG9sZFRpbWVzdGFtcCxcbiAgICAgICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRUQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5KGlkZW50aWZpZXIsIG5ld0lkZW50aXR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzZXRzIHRoZSBuZXcga2V5IHRvIHVudmVyaWZpZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICAgICAgaWRlbnRpdHkudmVyaWZpZWQsXG4gICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5VTlZFUklGSUVEXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnV2hlbiB0aGUga2V5IGhhcyBub3QgY2hhbmdlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9sZFRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgIHB1YmxpY0tleTogdGVzdEtleS5wdWJLZXksXG4gICAgICAgICAgdGltZXN0YW1wOiBvbGRUaW1lc3RhbXAsXG4gICAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICAgICAgZmlyc3RVc2U6IGZhbHNlLFxuICAgICAgICAgIHZlcmlmaWVkOiBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxULFxuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgfSk7XG4gICAgICBkZXNjcmliZSgnSWYgaXQgaXMgbWFya2VkIGZpcnN0VXNlJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlkZW50aXR5LmZpcnN0VXNlID0gdHJ1ZTtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleShpZGVudGl0eSk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ25vdGhpbmcgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgdGVzdEtleS5wdWJLZXksIHRydWUpO1xuXG4gICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXNzZXJ0KCFpZGVudGl0eS5ub25ibG9ja2luZ0FwcHJvdmFsKTtcbiAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkudGltZXN0YW1wLCBvbGRUaW1lc3RhbXApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ0lmIGl0IGlzIG5vdCBtYXJrZWQgZmlyc3RVc2UnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWRlbnRpdHkuZmlyc3RVc2UgPSBmYWxzZTtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleShpZGVudGl0eSk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVzY3JpYmUoJ0lmIG5vbmJsb2NraW5nIGFwcHJvdmFsIGlzIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgIGxldCBub3c6IG51bWJlcjtcbiAgICAgICAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkZW50aXR5LnRpbWVzdGFtcCA9IG5vdztcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KGlkZW50aXR5KTtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpdCgnc2V0cyBub24tYmxvY2tpbmcgYXBwcm92YWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgdGVzdEtleS5wdWJLZXksIHRydWUpO1xuXG4gICAgICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS5ub25ibG9ja2luZ0FwcHJvdmFsLCB0cnVlKTtcbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS50aW1lc3RhbXAsIG5vdyk7XG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkuZmlyc3RVc2UsIGZhbHNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdzYXZlSWRlbnRpdHlXaXRoQXR0cmlidXRlcycsICgpID0+IHtcbiAgICBsZXQgbm93OiBudW1iZXI7XG4gICAgbGV0IHZhbGlkQXR0cmlidXRlczogSWRlbnRpdHlLZXlUeXBlO1xuXG4gICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgIG5vdyA9IERhdGUubm93KCk7XG4gICAgICB2YWxpZEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQsXG4gICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgfTtcblxuICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlSWRlbnRpdHlLZXkodGhlaXJVdWlkKTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnd2l0aCB2YWxpZCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5V2l0aEF0dHJpYnV0ZXModGhlaXJVdWlkLCB2YWxpZEF0dHJpYnV0ZXMpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdwdWJsaWNLZXkgaXMgc2F2ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHkucHVibGljS2V5LCB0ZXN0S2V5LnB1YktleSkpO1xuICAgICAgfSk7XG4gICAgICBpdCgnZmlyc3RVc2UgaXMgc2F2ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS5maXJzdFVzZSwgdHJ1ZSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCd0aW1lc3RhbXAgaXMgc2F2ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS50aW1lc3RhbXAsIG5vdyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCd2ZXJpZmllZCBpcyBzYXZlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICk7XG4gICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGlkZW50aXR5LnZlcmlmaWVkLCBzdG9yZS5WZXJpZmllZFN0YXR1cy5WRVJJRklFRCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdub25ibG9ja2luZ0FwcHJvdmFsIGlzIHNhdmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkubm9uYmxvY2tpbmdBcHByb3ZhbCwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3dpdGggaW52YWxpZCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZXM6IElkZW50aXR5S2V5VHlwZTtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdHRyaWJ1dGVzID0gd2luZG93Ll8uY2xvbmUodmFsaWRBdHRyaWJ1dGVzKTtcbiAgICAgIH0pO1xuXG4gICAgICBhc3luYyBmdW5jdGlvbiB0ZXN0SW52YWxpZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZUlkZW50aXR5V2l0aEF0dHJpYnV0ZXModGhlaXJVdWlkLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NhdmVJZGVudGl0eVdpdGhBdHRyaWJ1dGVzIHNob3VsZCBoYXZlIGZhaWxlZCcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIC8vIGdvb2QuIHdlIGV4cGVjdCB0byBmYWlsIHdpdGggaW52YWxpZCBhdHRyaWJ1dGVzLlxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGl0KCdyZWplY3RzIGFuIGludmFsaWQgcHVibGljS2V5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1YmxpY0tleSA9ICdhIHN0cmluZycgYXMgYW55O1xuICAgICAgICBhd2FpdCB0ZXN0SW52YWxpZEF0dHJpYnV0ZXMoKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlamVjdHMgaW52YWxpZCBmaXJzdFVzZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXR0cmlidXRlcy5maXJzdFVzZSA9IDAgYXMgYW55O1xuICAgICAgICBhd2FpdCB0ZXN0SW52YWxpZEF0dHJpYnV0ZXMoKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlamVjdHMgaW52YWxpZCB0aW1lc3RhbXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF0dHJpYnV0ZXMudGltZXN0YW1wID0gTmFOIGFzIGFueTtcbiAgICAgICAgYXdhaXQgdGVzdEludmFsaWRBdHRyaWJ1dGVzKCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZWplY3RzIGludmFsaWQgdmVyaWZpZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF0dHJpYnV0ZXMudmVyaWZpZWQgPSBudWxsIGFzIGFueTtcbiAgICAgICAgYXdhaXQgdGVzdEludmFsaWRBdHRyaWJ1dGVzKCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZWplY3RzIGludmFsaWQgbm9uYmxvY2tpbmdBcHByb3ZhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXR0cmlidXRlcy5ub25ibG9ja2luZ0FwcHJvdmFsID0gMCBhcyBhbnk7XG4gICAgICAgIGF3YWl0IHRlc3RJbnZhbGlkQXR0cmlidXRlcygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnc2V0QXBwcm92YWwnLCAoKSA9PiB7XG4gICAgaXQoJ3NldHMgbm9uYmxvY2tpbmdBcHByb3ZhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnNldEFwcHJvdmFsKHRoZWlyVXVpZCwgdHJ1ZSk7XG4gICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICApO1xuICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS5ub25ibG9ja2luZ0FwcHJvdmFsLCB0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdzZXRWZXJpZmllZCcsICgpID0+IHtcbiAgICBhc3luYyBmdW5jdGlvbiBzYXZlUmVjb3JkRGVmYXVsdCgpIHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuREVGQVVMVCxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICB9XG4gICAgZGVzY3JpYmUoJ3dpdGggbm8gcHVibGljIGtleSBhcmd1bWVudCcsICgpID0+IHtcbiAgICAgIGJlZm9yZShzYXZlUmVjb3JkRGVmYXVsdCk7XG4gICAgICBpdCgndXBkYXRlcyB0aGUgdmVyaWZpZWQgc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXRWZXJpZmllZCh0aGVpclV1aWQsIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVEKTtcblxuICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpZGVudGl0eS52ZXJpZmllZCwgc3RvcmUuVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGlkZW50aXR5LnB1YmxpY0tleSwgdGVzdEtleS5wdWJLZXkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBjdXJyZW50IHB1YmxpYyBrZXknLCAoKSA9PiB7XG4gICAgICBiZWZvcmUoc2F2ZVJlY29yZERlZmF1bHQpO1xuICAgICAgaXQoJ3VwZGF0ZXMgdGhlIHZlcmlmaWVkIHN0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0VmVyaWZpZWQoXG4gICAgICAgICAgdGhlaXJVdWlkLFxuICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgIHRlc3RLZXkucHViS2V5XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICk7XG4gICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkudmVyaWZpZWQsIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVEKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChpZGVudGl0eS5wdWJsaWNLZXksIHRlc3RLZXkucHViS2V5KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnd2l0aCBhIG1pc21hdGNoaW5nIHB1YmxpYyBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdJZGVudGl0eSA9IGdldFB1YmxpY0tleSgpO1xuICAgICAgYmVmb3JlKHNhdmVSZWNvcmREZWZhdWx0KTtcbiAgICAgIGl0KCdkb2VzIG5vdCBjaGFuZ2UgdGhlIHJlY29yZC4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldFZlcmlmaWVkKFxuICAgICAgICAgIHRoZWlyVXVpZCxcbiAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5WRVJJRklFRCxcbiAgICAgICAgICBuZXdJZGVudGl0eVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGlkZW50aXR5LnZlcmlmaWVkLCBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxUKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChpZGVudGl0eS5wdWJsaWNLZXksIHRlc3RLZXkucHViS2V5KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwcm9jZXNzVmVyaWZpZWRNZXNzYWdlJywgKCkgPT4ge1xuICAgIGNvbnN0IG5ld0lkZW50aXR5ID0gZ2V0UHVibGljS2V5KCk7XG4gICAgbGV0IGtleWNoYW5nZVRyaWdnZXJlZDogbnVtYmVyO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBrZXljaGFuZ2VUcmlnZ2VyZWQgPSAwO1xuICAgICAgc3RvcmUuYmluZCgna2V5Y2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBrZXljaGFuZ2VUcmlnZ2VyZWQgKz0gMTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICBzdG9yZS51bmJpbmQoJ2tleWNoYW5nZScpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIG5ldyB2ZXJpZmllZCBzdGF0dXMgaXMgREVGQVVMVCcsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIG5vIGV4aXN0aW5nIHJlY29yZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlSWRlbnRpdHlLZXlCeUlkKHRoZWlyVXVpZC50b1N0cmluZygpKTtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZXRzIHRoZSBpZGVudGl0eSBrZXknLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgc3RvcmUucHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICAgICAgICAgIHRoZWlyVXVpZCxcbiAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgICAgICBuZXdJZGVudGl0eVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgICAgIGlkZW50aXR5Py5wdWJsaWNLZXkgJiZcbiAgICAgICAgICAgICAgY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHkucHVibGljS2V5LCBuZXdJZGVudGl0eSlcbiAgICAgICAgICApO1xuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChrZXljaGFuZ2VUcmlnZ2VyZWQsIDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIHJlY29yZCBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBleGlzdGluZyBrZXkgaXMgZGlmZmVyZW50JywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3VwZGF0ZXMgdGhlIGlkZW50aXR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUucHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxULFxuICAgICAgICAgICAgICBuZXdJZGVudGl0eVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaWRlbnRpdHkudmVyaWZpZWQsIHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQpO1xuICAgICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChpZGVudGl0eS5wdWJsaWNLZXksIG5ld0lkZW50aXR5KSk7XG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoa2V5Y2hhbmdlVHJpZ2dlcmVkLCAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBleGlzdGluZyBrZXkgaXMgdGhlIHNhbWUgYnV0IFZFUklGSUVEJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3VwZGF0ZXMgdGhlIHZlcmlmaWVkIHN0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLnByb2Nlc3NWZXJpZmllZE1lc3NhZ2UoXG4gICAgICAgICAgICAgIHRoZWlyVXVpZCxcbiAgICAgICAgICAgICAgc3RvcmUuVmVyaWZpZWRTdGF0dXMuREVGQVVMVCxcbiAgICAgICAgICAgICAgdGVzdEtleS5wdWJLZXlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGlkZW50aXR5LnZlcmlmaWVkLCBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxUKTtcbiAgICAgICAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgICAgICAgIGNvbnN0YW50VGltZUVxdWFsKGlkZW50aXR5LnB1YmxpY0tleSwgdGVzdEtleS5wdWJLZXkpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgZXhpc3Rpbmcga2V5IGlzIHRoZSBzYW1lIGFuZCBhbHJlYWR5IERFRkFVTFQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuREVGQVVMVCxcbiAgICAgICAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdkb2VzIG5vdCBoYW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUucHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5ERUZBVUxULFxuICAgICAgICAgICAgICB0ZXN0S2V5LnB1YktleVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIG5ldyB2ZXJpZmllZCBzdGF0dXMgaXMgVU5WRVJJRklFRCcsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIG5vIGV4aXN0aW5nIHJlY29yZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEucmVtb3ZlSWRlbnRpdHlLZXlCeUlkKHRoZWlyVXVpZC50b1N0cmluZygpKTtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzYXZlcyB0aGUgbmV3IGlkZW50aXR5IGFuZCBtYXJrcyBpdCBVTlZFUklGSUVEJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnByb2Nlc3NWZXJpZmllZE1lc3NhZ2UoXG4gICAgICAgICAgICB0aGVpclV1aWQsXG4gICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5VTlZFUklGSUVELFxuICAgICAgICAgICAgbmV3SWRlbnRpdHlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBpZGVudGl0eSEnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgICBpZGVudGl0eS52ZXJpZmllZCxcbiAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRURcbiAgICAgICAgICApO1xuICAgICAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHkucHVibGljS2V5LCBuZXdJZGVudGl0eSkpO1xuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChrZXljaGFuZ2VUcmlnZ2VyZWQsIDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIHJlY29yZCBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBleGlzdGluZyBrZXkgaXMgZGlmZmVyZW50JywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3NhdmVzIHRoZSBuZXcgaWRlbnRpdHkgYW5kIG1hcmtzIGl0IFVOVkVSSUZJRUQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5wcm9jZXNzVmVyaWZpZWRNZXNzYWdlKFxuICAgICAgICAgICAgICB0aGVpclV1aWQsXG4gICAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRUQsXG4gICAgICAgICAgICAgIG5ld0lkZW50aXR5XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJZGVudGl0eUtleUJ5SWQoXG4gICAgICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFpZGVudGl0eSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICAgICAgaWRlbnRpdHkudmVyaWZpZWQsXG4gICAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRURcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGlkZW50aXR5LnB1YmxpY0tleSwgbmV3SWRlbnRpdHkpKTtcbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChrZXljaGFuZ2VUcmlnZ2VyZWQsIDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGtleSBleGlzdHMgYW5kIGlzIERFRkFVTFQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuREVGQVVMVCxcbiAgICAgICAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCd1cGRhdGVzIHRoZSB2ZXJpZmllZCBzdGF0dXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5wcm9jZXNzVmVyaWZpZWRNZXNzYWdlKFxuICAgICAgICAgICAgICB0aGVpclV1aWQsXG4gICAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRUQsXG4gICAgICAgICAgICAgIHRlc3RLZXkucHViS2V5XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgICAgIGlkZW50aXR5LnZlcmlmaWVkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5VTlZFUklGSUVEXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgICAgICAgY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHkucHVibGljS2V5LCB0ZXN0S2V5LnB1YktleSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoa2V5Y2hhbmdlVHJpZ2dlcmVkLCAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBrZXkgZXhpc3RzIGFuZCBpcyBhbHJlYWR5IFVOVkVSSUZJRUQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuVU5WRVJJRklFRCxcbiAgICAgICAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdkb2VzIG5vdCBoYW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUucHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5VTlZFUklGSUVELFxuICAgICAgICAgICAgICB0ZXN0S2V5LnB1YktleVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIG5ldyB2ZXJpZmllZCBzdGF0dXMgaXMgVkVSSUZJRUQnLCAoKSA9PiB7XG4gICAgICBkZXNjcmliZSgnd2hlbiB0aGVyZSBpcyBubyBleGlzdGluZyByZWNvcmQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUlkZW50aXR5S2V5QnlJZCh0aGVpclV1aWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2F2ZXMgdGhlIG5ldyBpZGVudGl0eSBhbmQgbWFya3MgaXQgdmVyaWZpZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgc3RvcmUucHJvY2Vzc1ZlcmlmaWVkTWVzc2FnZShcbiAgICAgICAgICAgIHRoZWlyVXVpZCxcbiAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgbmV3SWRlbnRpdHlcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldElkZW50aXR5S2V5QnlJZChcbiAgICAgICAgICAgIHRoZWlyVXVpZC50b1N0cmluZygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoIWlkZW50aXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgaWRlbnRpdHkhJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGlkZW50aXR5LnZlcmlmaWVkLCBzdG9yZS5WZXJpZmllZFN0YXR1cy5WRVJJRklFRCk7XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChpZGVudGl0eS5wdWJsaWNLZXksIG5ld0lkZW50aXR5KSk7XG4gICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkZXNjcmliZSgnd2hlbiB0aGUgcmVjb3JkIGV4aXN0cycsICgpID0+IHtcbiAgICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGV4aXN0aW5nIGtleSBpcyBkaWZmZXJlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICAgICAgICBmaXJzdFVzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogc3RvcmUuVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQsXG4gICAgICAgICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2F2ZXMgdGhlIG5ldyBpZGVudGl0eSBhbmQgbWFya3MgaXQgVkVSSUZJRUQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5wcm9jZXNzVmVyaWZpZWRNZXNzYWdlKFxuICAgICAgICAgICAgICB0aGVpclV1aWQsXG4gICAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICBuZXdJZGVudGl0eVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgICAgIGlkZW50aXR5LnZlcmlmaWVkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5WRVJJRklFRFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoaWRlbnRpdHkucHVibGljS2V5LCBuZXdJZGVudGl0eSkpO1xuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgZXhpc3Rpbmcga2V5IGlzIHRoZSBzYW1lIGJ1dCBVTlZFUklGSUVEJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlVOVkVSSUZJRUQsXG4gICAgICAgICAgICAgIG5vbmJsb2NraW5nQXBwcm92YWw6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5oeWRyYXRlQ2FjaGVzKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2F2ZXMgdGhlIGlkZW50aXR5IGFuZCBtYXJrcyBpdCB2ZXJpZmllZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLnByb2Nlc3NWZXJpZmllZE1lc3NhZ2UoXG4gICAgICAgICAgICAgIHRoZWlyVXVpZCxcbiAgICAgICAgICAgICAgc3RvcmUuVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQsXG4gICAgICAgICAgICAgIHRlc3RLZXkucHViS2V5XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0SWRlbnRpdHlLZXlCeUlkKFxuICAgICAgICAgICAgICB0aGVpclV1aWQudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGlkZW50aXR5IScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgICAgIGlkZW50aXR5LnZlcmlmaWVkLFxuICAgICAgICAgICAgICBzdG9yZS5WZXJpZmllZFN0YXR1cy5WRVJJRklFRFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgICAgICAgIGNvbnN0YW50VGltZUVxdWFsKGlkZW50aXR5LnB1YmxpY0tleSwgdGVzdEtleS5wdWJLZXkpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgZXhpc3Rpbmcga2V5IGlzIHRoZSBzYW1lIGFuZCBhbHJlYWR5IFZFUklGSUVEJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY3JlYXRlT3JVcGRhdGVJZGVudGl0eUtleSh7XG4gICAgICAgICAgICAgIGlkOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcHVibGljS2V5OiB0ZXN0S2V5LnB1YktleSxcbiAgICAgICAgICAgICAgZmlyc3RVc2U6IHRydWUsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ2RvZXMgbm90IGhhbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5wcm9jZXNzVmVyaWZpZWRNZXNzYWdlKFxuICAgICAgICAgICAgICB0aGVpclV1aWQsXG4gICAgICAgICAgICAgIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVELFxuICAgICAgICAgICAgICB0ZXN0S2V5LnB1YktleVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGtleWNoYW5nZVRyaWdnZXJlZCwgMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc1VudHJ1c3RlZCcsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBpZGVudGl0eSBrZXkgb2xkIGVub3VnaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUlkZW50aXR5S2V5KHtcbiAgICAgICAgaWQ6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICBwdWJsaWNLZXk6IHRlc3RLZXkucHViS2V5LFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAxMCAqIDEwMDAgKiA2MCxcbiAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgIGZpcnN0VXNlOiBmYWxzZSxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuICAgICAgY29uc3QgdW50cnVzdGVkID0gYXdhaXQgc3RvcmUuaXNVbnRydXN0ZWQodGhlaXJVdWlkKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh1bnRydXN0ZWQsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5ldyBidXQgbm9uYmxvY2tpbmdBcHByb3ZhbCBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmNyZWF0ZU9yVXBkYXRlSWRlbnRpdHlLZXkoe1xuICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgIHB1YmxpY0tleTogdGVzdEtleS5wdWJLZXksXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgIGZpcnN0VXNlOiBmYWxzZSxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuXG4gICAgICBjb25zdCB1bnRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1VudHJ1c3RlZCh0aGVpclV1aWQpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVudHJ1c3RlZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbmV3IGJ1dCBmaXJzdFVzZSBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmNyZWF0ZU9yVXBkYXRlSWRlbnRpdHlLZXkoe1xuICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgIHB1YmxpY0tleTogdGVzdEtleS5wdWJLZXksXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgIGZpcnN0VXNlOiB0cnVlLFxuICAgICAgICBub25ibG9ja2luZ0FwcHJvdmFsOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgc3RvcmUuaHlkcmF0ZUNhY2hlcygpO1xuXG4gICAgICBjb25zdCB1bnRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1VudHJ1c3RlZCh0aGVpclV1aWQpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVudHJ1c3RlZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBuZXcsIGFuZCBubyBmbGFncyBhcmUgc2V0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmNyZWF0ZU9yVXBkYXRlSWRlbnRpdHlLZXkoe1xuICAgICAgICBpZDogdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgIHB1YmxpY0tleTogdGVzdEtleS5wdWJLZXksXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgdmVyaWZpZWQ6IHN0b3JlLlZlcmlmaWVkU3RhdHVzLkRFRkFVTFQsXG4gICAgICAgIGZpcnN0VXNlOiBmYWxzZSxcbiAgICAgICAgbm9uYmxvY2tpbmdBcHByb3ZhbDogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHN0b3JlLmh5ZHJhdGVDYWNoZXMoKTtcblxuICAgICAgY29uc3QgdW50cnVzdGVkID0gYXdhaXQgc3RvcmUuaXNVbnRydXN0ZWQodGhlaXJVdWlkKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh1bnRydXN0ZWQsIHRydWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0VmVyaWZpZWQnLCAoKSA9PiB7XG4gICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnNldFZlcmlmaWVkKHRoZWlyVXVpZCwgc3RvcmUuVmVyaWZpZWRTdGF0dXMuVkVSSUZJRUQpO1xuICAgIH0pO1xuICAgIGl0KCdyZXNvbHZlcyB0byB0aGUgdmVyaWZpZWQgc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3RvcmUuZ2V0VmVyaWZpZWQodGhlaXJVdWlkKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQsIHN0b3JlLlZlcmlmaWVkU3RhdHVzLlZFUklGSUVEKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdpc1RydXN0ZWRJZGVudGl0eScsICgpID0+IHtcbiAgICBjb25zdCBpZGVudGlmaWVyID0gbmV3IEFkZHJlc3ModGhlaXJVdWlkLCAxKTtcblxuICAgIGRlc2NyaWJlKCdXaGVuIGludmFsaWQgZGlyZWN0aW9uIGlzIGdpdmVuJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBmYWlsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChcbiAgICAgICAgICBzdG9yZS5pc1RydXN0ZWRJZGVudGl0eShpZGVudGlmaWVyLCB0ZXN0S2V5LnB1YktleSwgJ2RpcicgYXMgYW55KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gZGlyZWN0aW9uIGlzIFJFQ0VJVklORycsICgpID0+IHtcbiAgICAgIGl0KCdhbHdheXMgcmV0dXJucyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdJZGVudGl0eSA9IGdldFB1YmxpY0tleSgpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgdGVzdEtleS5wdWJLZXkpO1xuXG4gICAgICAgIGNvbnN0IHRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1RydXN0ZWRJZGVudGl0eShcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgIG5ld0lkZW50aXR5LFxuICAgICAgICAgIERpcmVjdGlvbi5SZWNlaXZpbmdcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIXRydXN0ZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lzVHJ1c3RlZCByZXR1cm5lZCBmYWxzZSB3aGVuIHJlY2VpdmluZycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnV2hlbiBkaXJlY3Rpb24gaXMgU0VORElORycsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCdXaGVuIHRoZXJlIGlzIG5vIGV4aXN0aW5nIGtleSAoZmlyc3QgdXNlKScsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmVJZGVudGl0eUtleSh0aGVpclV1aWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdJZGVudGl0eSA9IGdldFB1YmxpY0tleSgpO1xuICAgICAgICAgIGNvbnN0IHRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1RydXN0ZWRJZGVudGl0eShcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBuZXdJZGVudGl0eSxcbiAgICAgICAgICAgIERpcmVjdGlvbi5TZW5kaW5nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoIXRydXN0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaXNUcnVzdGVkIHJldHVybmVkIGZhbHNlIG9uIGZpcnN0IHVzZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdXaGVuIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGtleScsICgpID0+IHtcbiAgICAgICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgdGVzdEtleS5wdWJLZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVzY3JpYmUoJ1doZW4gdGhlIGV4aXN0aW5nIGtleSBpcyBkaWZmZXJlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdJZGVudGl0eSA9IGdldFB1YmxpY0tleSgpO1xuICAgICAgICAgICAgY29uc3QgdHJ1c3RlZCA9IGF3YWl0IHN0b3JlLmlzVHJ1c3RlZElkZW50aXR5KFxuICAgICAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgICAgICBuZXdJZGVudGl0eSxcbiAgICAgICAgICAgICAgRGlyZWN0aW9uLlNlbmRpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHJ1c3RlZCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lzVHJ1c3RlZCByZXR1cm5lZCB0cnVlIG9uIHVudHJ1c3RlZCBrZXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlc2NyaWJlKCdXaGVuIHRoZSBleGlzdGluZyBrZXkgbWF0Y2hlcyB0aGUgbmV3IGtleScsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdJZGVudGl0eSA9IGdldFB1YmxpY0tleSgpO1xuICAgICAgICAgIGJlZm9yZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBzdG9yZS5zYXZlSWRlbnRpdHkoaWRlbnRpZmllciwgbmV3SWRlbnRpdHkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGtleXMgbWF0Y2ggYnV0IHdlIGp1c3QgcmVjZWl2ZWQgdGhpcyBuZXcgaWRlbnRpeScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1RydXN0ZWRJZGVudGl0eShcbiAgICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgbmV3SWRlbnRpdHksXG4gICAgICAgICAgICAgIERpcmVjdGlvbi5TZW5kaW5nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAodHJ1c3RlZCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lzVHJ1c3RlZCByZXR1cm5lZCB0cnVlIG9uIHVudHJ1c3RlZCBrZXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHdlIGhhdmUgYWxyZWFkeSBhcHByb3ZlZCBpZGVudGl0eScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHN0b3JlLnNhdmVJZGVudGl0eShpZGVudGlmaWVyLCBuZXdJZGVudGl0eSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRydXN0ZWQgPSBhd2FpdCBzdG9yZS5pc1RydXN0ZWRJZGVudGl0eShcbiAgICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgbmV3SWRlbnRpdHksXG4gICAgICAgICAgICAgIERpcmVjdGlvbi5TZW5kaW5nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCF0cnVzdGVkKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaXNUcnVzdGVkIHJldHVybmVkIGZhbHNlIG9uIGFuIGFwcHJvdmVkIGtleScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3N0b3JlUHJlS2V5JywgKCkgPT4ge1xuICAgIGl0KCdzdG9yZXMgcHJla2V5cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnN0b3JlUHJlS2V5KG91clV1aWQsIDEsIHRlc3RLZXkpO1xuICAgICAgY29uc3Qga2V5ID0gYXdhaXQgc3RvcmUubG9hZFByZUtleShvdXJVdWlkLCAxKTtcbiAgICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBrZXkhJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGtleVBhaXIgPSB7XG4gICAgICAgIHB1YktleToga2V5LnB1YmxpY0tleSgpLnNlcmlhbGl6ZSgpLFxuICAgICAgICBwcml2S2V5OiBrZXkucHJpdmF0ZUtleSgpLnNlcmlhbGl6ZSgpLFxuICAgICAgfTtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChrZXlQYWlyLnB1YktleSwgdGVzdEtleS5wdWJLZXkpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoa2V5UGFpci5wcml2S2V5LCB0ZXN0S2V5LnByaXZLZXkpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdyZW1vdmVQcmVLZXknLCAoKSA9PiB7XG4gICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnN0b3JlUHJlS2V5KG91clV1aWQsIDIsIHRlc3RLZXkpO1xuICAgIH0pO1xuICAgIGl0KCdkZWxldGVzIHByZWtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBzdG9yZS5yZW1vdmVQcmVLZXkob3VyVXVpZCwgMik7XG5cbiAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHN0b3JlLmxvYWRQcmVLZXkob3VyVXVpZCwgMik7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoa2V5KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdzdG9yZVNpZ25lZFByZUtleScsICgpID0+IHtcbiAgICBpdCgnc3RvcmVzIHNpZ25lZCBwcmVrZXlzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTaWduZWRQcmVLZXkob3VyVXVpZCwgMywgdGVzdEtleSk7XG4gICAgICBjb25zdCBrZXkgPSBhd2FpdCBzdG9yZS5sb2FkU2lnbmVkUHJlS2V5KG91clV1aWQsIDMpO1xuICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGtleSEnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2V5UGFpciA9IHtcbiAgICAgICAgcHViS2V5OiBrZXkucHVibGljS2V5KCkuc2VyaWFsaXplKCksXG4gICAgICAgIHByaXZLZXk6IGtleS5wcml2YXRlS2V5KCkuc2VyaWFsaXplKCksXG4gICAgICB9O1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGtleVBhaXIucHViS2V5LCB0ZXN0S2V5LnB1YktleSkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChrZXlQYWlyLnByaXZLZXksIHRlc3RLZXkucHJpdktleSkpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3JlbW92ZVNpZ25lZFByZUtleScsICgpID0+IHtcbiAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTaWduZWRQcmVLZXkob3VyVXVpZCwgNCwgdGVzdEtleSk7XG4gICAgfSk7XG4gICAgaXQoJ2RlbGV0ZXMgc2lnbmVkIHByZWtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBzdG9yZS5yZW1vdmVTaWduZWRQcmVLZXkob3VyVXVpZCwgNCk7XG5cbiAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHN0b3JlLmxvYWRTaWduZWRQcmVLZXkob3VyVXVpZCwgNCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoa2V5KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdzdG9yZVNlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ3N0b3JlcyBzZXNzaW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3RSZWNvcmQgPSBnZXRTZXNzaW9uUmVjb3JkKCk7XG4gICAgICBjb25zdCBpZCA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMSkpO1xuICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTZXNzaW9uKGlkLCB0ZXN0UmVjb3JkKTtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmxvYWRTZXNzaW9uKGlkKTtcbiAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZWNvcmQhJyk7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydC5lcXVhbChyZWNvcmQsIHRlc3RSZWNvcmQpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3JlbW92ZUFsbFNlc3Npb25zJywgKCkgPT4ge1xuICAgIGl0KCdyZW1vdmVzIGFsbCBzZXNzaW9ucyBmb3IgYSB1dWlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGV2aWNlcyA9IFsxLCAyLCAzXS5tYXAoXG4gICAgICAgIGRldmljZUlkID0+XG4gICAgICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCBkZXZpY2VJZCkpXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgZGV2aWNlcy5tYXAoYXN5bmMgZW5jb2RlZEFkZHJlc3MgPT4ge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2Vzc2lvbihlbmNvZGVkQWRkcmVzcywgZ2V0U2Vzc2lvblJlY29yZCgpKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZUFsbFNlc3Npb25zKHRoZWlyVXVpZC50b1N0cmluZygpKTtcblxuICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBkZXZpY2VzLm1hcChkZXZpY2UgPT4gc3RvcmUubG9hZFNlc3Npb24oZGV2aWNlKSlcbiAgICAgICk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBtYXggPSByZWNvcmRzLmxlbmd0aDsgaSA8IG1heDsgaSArPSAxKSB7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChyZWNvcmRzW2ldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdjbGVhclNlc3Npb25TdG9yZScsICgpID0+IHtcbiAgICBpdCgnY2xlYXJzIHRoZSBzZXNzaW9uIHN0b3JlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGVzdFJlY29yZCA9IGdldFNlc3Npb25SZWNvcmQoKTtcbiAgICAgIGNvbnN0IGlkID0gbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCAxKSk7XG4gICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oaWQsIHRlc3RSZWNvcmQpO1xuICAgICAgYXdhaXQgc3RvcmUuY2xlYXJTZXNzaW9uU3RvcmUoKTtcblxuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUubG9hZFNlc3Npb24oaWQpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHJlY29yZCk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnZ2V0RGV2aWNlSWRzJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGRldmljZUlkcyBmb3IgYSB1dWlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb3BlblJlY29yZCA9IGdldFNlc3Npb25SZWNvcmQodHJ1ZSk7XG4gICAgICBjb25zdCBvcGVuRGV2aWNlcyA9IFsxLCAyLCAzLCAxMF0ubWFwKFxuICAgICAgICBkZXZpY2VJZCA9PlxuICAgICAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgZGV2aWNlSWQpKVxuICAgICAgKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBvcGVuRGV2aWNlcy5tYXAoYXN5bmMgYWRkcmVzcyA9PiB7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTZXNzaW9uKGFkZHJlc3MsIG9wZW5SZWNvcmQpO1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgY29uc3QgY2xvc2VkUmVjb3JkID0gZ2V0U2Vzc2lvblJlY29yZChmYWxzZSk7XG4gICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oXG4gICAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMTEpKSxcbiAgICAgICAgY2xvc2VkUmVjb3JkXG4gICAgICApO1xuXG4gICAgICBjb25zdCBkZXZpY2VJZHMgPSBhd2FpdCBzdG9yZS5nZXREZXZpY2VJZHMoe1xuICAgICAgICBvdXJVdWlkLFxuICAgICAgICBpZGVudGlmaWVyOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LnNhbWVNZW1iZXJzKGRldmljZUlkcywgWzEsIDIsIDMsIDEwXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBlbXB0eSBhcnJheSBmb3IgYSB1dWlkIHdpdGggbm8gZGV2aWNlIGlkcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRldmljZUlkcyA9IGF3YWl0IHN0b3JlLmdldERldmljZUlkcyh7XG4gICAgICAgIG91clV1aWQsXG4gICAgICAgIGlkZW50aWZpZXI6ICdmb28nLFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuc2FtZU1lbWJlcnMoZGV2aWNlSWRzLCBbXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRPcGVuRGV2aWNlcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBhbGwgb3BlbiBkZXZpY2VzIGZvciBhIHV1aWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvcGVuUmVjb3JkID0gZ2V0U2Vzc2lvblJlY29yZCh0cnVlKTtcbiAgICAgIGNvbnN0IG9wZW5EZXZpY2VzID0gWzEsIDIsIDMsIDEwXS5tYXAoXG4gICAgICAgIGRldmljZUlkID0+XG4gICAgICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCBkZXZpY2VJZCkpXG4gICAgICApO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIG9wZW5EZXZpY2VzLm1hcChhc3luYyBhZGRyZXNzID0+IHtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oYWRkcmVzcywgb3BlblJlY29yZCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBjb25zdCBjbG9zZWRSZWNvcmQgPSBnZXRTZXNzaW9uUmVjb3JkKGZhbHNlKTtcbiAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2Vzc2lvbihcbiAgICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCAxMSkpLFxuICAgICAgICBjbG9zZWRSZWNvcmRcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0b3JlLmdldE9wZW5EZXZpY2VzKG91clV1aWQsIFtcbiAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICdibGFoJyxcbiAgICAgICAgJ2JsYWgyJyxcbiAgICAgIF0pO1xuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgICAge1xuICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICBkZXZpY2VzOiByZXN1bHQuZGV2aWNlcy5tYXAoKHsgaWQsIGlkZW50aWZpZXIsIHJlZ2lzdHJhdGlvbklkIH0pID0+ICh7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvbklkLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGRldmljZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICByZWdpc3RyYXRpb25JZDogMjQzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICByZWdpc3RyYXRpb25JZDogMjQzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6IHRoZWlyVXVpZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICByZWdpc3RyYXRpb25JZDogMjQzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IDEwLFxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiB0aGVpclV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDI0MyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBlbXB0eUlkZW50aWZpZXJzOiBbJ2JsYWgnLCAnYmxhaDInXSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGVtcHR5IGFycmF5IGZvciBhIHV1aWQgd2l0aCBubyBkZXZpY2UgaWRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3RvcmUuZ2V0T3BlbkRldmljZXMob3VyVXVpZCwgWydmb28nXSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdCwge1xuICAgICAgICBkZXZpY2VzOiBbXSxcbiAgICAgICAgZW1wdHlJZGVudGlmaWVyczogWydmb28nXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnem9uZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZGlzdHJpYnV0aW9uSWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICBjb25zdCB6b25lID0gbmV3IFpvbmUoJ3pvbmUnLCB7XG4gICAgICBwZW5kaW5nU2VuZGVyS2V5czogdHJ1ZSxcbiAgICAgIHBlbmRpbmdTZXNzaW9uczogdHJ1ZSxcbiAgICAgIHBlbmRpbmdVbnByb2Nlc3NlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlQWxsVW5wcm9jZXNzZWQoKTtcbiAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZUFsbFNlc3Npb25zKHRoZWlyVXVpZC50b1N0cmluZygpKTtcbiAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZUFsbFNlbmRlcktleXMoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHN0b3JlIHBlbmRpbmcgc2Vzc2lvbnMgaW4gZ2xvYmFsIHpvbmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMSkpO1xuICAgICAgY29uc3QgdGVzdFJlY29yZCA9IGdldFNlc3Npb25SZWNvcmQoKTtcblxuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQoXG4gICAgICAgIHN0b3JlLndpdGhab25lKEdMT0JBTF9aT05FLCAndGVzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oaWQsIHRlc3RSZWNvcmQpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbHVyZScpO1xuICAgICAgICB9KSxcbiAgICAgICAgJ0ZhaWx1cmUnXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoYXdhaXQgc3RvcmUubG9hZFNlc3Npb24oaWQpLCB0ZXN0UmVjb3JkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHN0b3JlIHBlbmRpbmcgc2VuZGVyIGtleXMgaW4gZ2xvYmFsIHpvbmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMSkpO1xuICAgICAgY29uc3QgdGVzdFJlY29yZCA9IGdldFNlbmRlcktleVJlY29yZCgpO1xuXG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChcbiAgICAgICAgc3RvcmUud2l0aFpvbmUoR0xPQkFMX1pPTkUsICd0ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnNhdmVTZW5kZXJLZXkoaWQsIGRpc3RyaWJ1dGlvbklkLCB0ZXN0UmVjb3JkKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWx1cmUnKTtcbiAgICAgICAgfSksXG4gICAgICAgICdGYWlsdXJlJ1xuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGF3YWl0IHN0b3JlLmdldFNlbmRlcktleShpZCwgZGlzdHJpYnV0aW9uSWQpLCB0ZXN0UmVjb3JkKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb21taXRzIHNlbmRlciBrZXlzLCBzZXNzaW9ucyBhbmQgdW5wcm9jZXNzZWQgb24gc3VjY2VzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gbmV3IFF1YWxpZmllZEFkZHJlc3Mob3VyVXVpZCwgbmV3IEFkZHJlc3ModGhlaXJVdWlkLCAxKSk7XG4gICAgICBjb25zdCB0ZXN0U2Vzc2lvbiA9IGdldFNlc3Npb25SZWNvcmQoKTtcbiAgICAgIGNvbnN0IHRlc3RTZW5kZXJLZXkgPSBnZXRTZW5kZXJLZXlSZWNvcmQoKTtcblxuICAgICAgYXdhaXQgc3RvcmUud2l0aFpvbmUoem9uZSwgJ3Rlc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2Vzc2lvbihpZCwgdGVzdFNlc3Npb24sIHsgem9uZSB9KTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2F2ZVNlbmRlcktleShpZCwgZGlzdHJpYnV0aW9uSWQsIHRlc3RTZW5kZXJLZXksIHsgem9uZSB9KTtcblxuICAgICAgICBhd2FpdCBzdG9yZS5hZGRVbnByb2Nlc3NlZChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJzItdHdvJyxcbiAgICAgICAgICAgIHZlcnNpb246IDIsXG5cbiAgICAgICAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgICAgICAgZW52ZWxvcGU6ICdzZWNvbmQnLFxuICAgICAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXI6IDAsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCkgKyAyLFxuICAgICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB6b25lIH1cbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoYXdhaXQgc3RvcmUubG9hZFNlc3Npb24oaWQsIHsgem9uZSB9KSwgdGVzdFNlc3Npb24pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgYXdhaXQgc3RvcmUuZ2V0U2VuZGVyS2V5KGlkLCBkaXN0cmlidXRpb25JZCwgeyB6b25lIH0pLFxuICAgICAgICAgIHRlc3RTZW5kZXJLZXlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoYXdhaXQgc3RvcmUubG9hZFNlc3Npb24oaWQpLCB0ZXN0U2Vzc2lvbik7XG4gICAgICBhc3NlcnQuZXF1YWwoYXdhaXQgc3RvcmUuZ2V0U2VuZGVyS2V5KGlkLCBkaXN0cmlidXRpb25JZCksIHRlc3RTZW5kZXJLZXkpO1xuXG4gICAgICBjb25zdCBhbGxVbnByb2Nlc3NlZCA9XG4gICAgICAgIGF3YWl0IHN0b3JlLmdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGFsbFVucHJvY2Vzc2VkLm1hcCgoeyBlbnZlbG9wZSB9KSA9PiBlbnZlbG9wZSksXG4gICAgICAgIFsnc2Vjb25kJ11cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV2ZXJ0cyBzZW5kZXIga2V5cywgc2Vzc2lvbnMgYW5kIHVucHJvY2Vzc2VkIG9uIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBuZXcgUXVhbGlmaWVkQWRkcmVzcyhvdXJVdWlkLCBuZXcgQWRkcmVzcyh0aGVpclV1aWQsIDEpKTtcbiAgICAgIGNvbnN0IHRlc3RTZXNzaW9uID0gZ2V0U2Vzc2lvblJlY29yZCgpO1xuICAgICAgY29uc3QgZmFpbGVkU2Vzc2lvbiA9IGdldFNlc3Npb25SZWNvcmQoKTtcbiAgICAgIGNvbnN0IHRlc3RTZW5kZXJLZXkgPSBnZXRTZW5kZXJLZXlSZWNvcmQoKTtcbiAgICAgIGNvbnN0IGZhaWxlZFNlbmRlcktleSA9IGdldFNlbmRlcktleVJlY29yZCgpO1xuXG4gICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oaWQsIHRlc3RTZXNzaW9uKTtcbiAgICAgIGFzc2VydC5lcXVhbChhd2FpdCBzdG9yZS5sb2FkU2Vzc2lvbihpZCksIHRlc3RTZXNzaW9uKTtcblxuICAgICAgYXdhaXQgc3RvcmUuc2F2ZVNlbmRlcktleShpZCwgZGlzdHJpYnV0aW9uSWQsIHRlc3RTZW5kZXJLZXkpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF3YWl0IHN0b3JlLmdldFNlbmRlcktleShpZCwgZGlzdHJpYnV0aW9uSWQpLCB0ZXN0U2VuZGVyS2V5KTtcblxuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQoXG4gICAgICAgIHN0b3JlLndpdGhab25lKHpvbmUsICd0ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2Vzc2lvbihpZCwgZmFpbGVkU2Vzc2lvbiwgeyB6b25lIH0pO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChhd2FpdCBzdG9yZS5sb2FkU2Vzc2lvbihpZCwgeyB6b25lIH0pLCBmYWlsZWRTZXNzaW9uKTtcblxuICAgICAgICAgIGF3YWl0IHN0b3JlLnNhdmVTZW5kZXJLZXkoaWQsIGRpc3RyaWJ1dGlvbklkLCBmYWlsZWRTZW5kZXJLZXksIHtcbiAgICAgICAgICAgIHpvbmUsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgICAgYXdhaXQgc3RvcmUuZ2V0U2VuZGVyS2V5KGlkLCBkaXN0cmlidXRpb25JZCwgeyB6b25lIH0pLFxuICAgICAgICAgICAgZmFpbGVkU2VuZGVyS2V5XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGF3YWl0IHN0b3JlLmFkZFVucHJvY2Vzc2VkKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJzItdHdvJyxcbiAgICAgICAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICAgICAgICBhdHRlbXB0czogMCxcbiAgICAgICAgICAgICAgZW52ZWxvcGU6ICdzZWNvbmQnLFxuICAgICAgICAgICAgICByZWNlaXZlZEF0Q291bnRlcjogMCxcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiAyLFxuICAgICAgICAgICAgICB1cmdlbnQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB6b25lIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsdXJlJyk7XG4gICAgICAgIH0pLFxuICAgICAgICAnRmFpbHVyZSdcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChhd2FpdCBzdG9yZS5sb2FkU2Vzc2lvbihpZCksIHRlc3RTZXNzaW9uKTtcbiAgICAgIGFzc2VydC5lcXVhbChhd2FpdCBzdG9yZS5nZXRTZW5kZXJLZXkoaWQsIGRpc3RyaWJ1dGlvbklkKSwgdGVzdFNlbmRlcktleSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGF3YWl0IHN0b3JlLmdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKSwgW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbiBiZSByZS1lbnRlcmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBuZXcgUXVhbGlmaWVkQWRkcmVzcyhvdXJVdWlkLCBuZXcgQWRkcmVzcyh0aGVpclV1aWQsIDEpKTtcbiAgICAgIGNvbnN0IHRlc3RSZWNvcmQgPSBnZXRTZXNzaW9uUmVjb3JkKCk7XG5cbiAgICAgIGF3YWl0IHN0b3JlLndpdGhab25lKHpvbmUsICd0ZXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBzdG9yZS53aXRoWm9uZSh6b25lLCAnbmVzdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHN0b3JlLnN0b3JlU2Vzc2lvbihpZCwgdGVzdFJlY29yZCwgeyB6b25lIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGF3YWl0IHN0b3JlLmxvYWRTZXNzaW9uKGlkLCB7IHpvbmUgfSksIHRlc3RSZWNvcmQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoYXdhaXQgc3RvcmUubG9hZFNlc3Npb24oaWQsIHsgem9uZSB9KSwgdGVzdFJlY29yZCk7XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGF3YWl0IHN0b3JlLmxvYWRTZXNzaW9uKGlkKSwgdGVzdFJlY29yZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FuIGJlIHJlLWVudGVyZWQgYWZ0ZXIgd2FpdGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGEgPSBuZXcgWm9uZSgnYScpO1xuICAgICAgY29uc3QgYiA9IG5ldyBab25lKCdiJyk7XG5cbiAgICAgIGNvbnN0IG9yZGVyOiBBcnJheTxudW1iZXI+ID0gW107XG4gICAgICBjb25zdCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTx1bmtub3duPj4gPSBbXTtcblxuICAgICAgLy8gV2hhdCBoYXBwZW5zIGJlbG93IGlzIGJyaWVmbHkgZm9sbG93aW5nOlxuICAgICAgLy8gMS4gV2UgZW50ZXIgem9uZSBcImFcIlxuICAgICAgLy8gMi4gV2Ugd2FpdCBmb3Igem9uZSBcImFcIiB0byBiZSBsZWZ0IHRvIGVudGVyIHpvbmUgXCJiXCJcbiAgICAgIC8vIDMuIFNraXAgZmV3IHRpY2tzIHRvIHRyaWdnZXIgbGVhdmUgb2Ygem9uZSBcImFcIiBhbmQgcmVzb2x2ZSB0aGUgd2FpdGluZ1xuICAgICAgLy8gICAgcXVldWUgcHJvbWlzZSBmb3Igem9uZSBcImJcIlxuICAgICAgLy8gNC4gRW50ZXIgem9uZSBcImFcIiB3aGlsZSByZXNvbHV0aW9uIHdhcyB0aGUgcHJvbWlzZSBhYm92ZSBpcyBxdWV1ZWQgaW5cbiAgICAgIC8vICAgIG1pY3JvdGFza3MgcXVldWUuXG5cbiAgICAgIHByb21pc2VzLnB1c2goc3RvcmUud2l0aFpvbmUoYSwgJ2EnLCBhc3luYyAoKSA9PiBvcmRlci5wdXNoKDEpKSk7XG4gICAgICBwcm9taXNlcy5wdXNoKHN0b3JlLndpdGhab25lKGIsICdiJywgYXN5bmMgKCkgPT4gb3JkZXIucHVzaCgyKSkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VzLnB1c2goc3RvcmUud2l0aFpvbmUoYSwgJ2EgYWdhaW4nLCBhc3luYyAoKSA9PiBvcmRlci5wdXNoKDMpKSk7XG5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvcmRlciwgWzEsIDIsIDNdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGRlYWRsb2NrIGluIGFyY2hpdmVTaWJsaW5nU2Vzc2lvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMSkpO1xuICAgICAgY29uc3Qgc2libGluZyA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgMikpO1xuXG4gICAgICBhd2FpdCBzdG9yZS5zdG9yZVNlc3Npb24oaWQsIGdldFNlc3Npb25SZWNvcmQodHJ1ZSkpO1xuICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTZXNzaW9uKHNpYmxpbmcsIGdldFNlc3Npb25SZWNvcmQodHJ1ZSkpO1xuXG4gICAgICBhd2FpdCBzdG9yZS5hcmNoaXZlU2libGluZ1Nlc3Npb25zKGlkLmFkZHJlc3MsIHsgem9uZSB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gYmUgY29uY3VycmVudGx5IHJlLWVudGVyZWQgYWZ0ZXIgd2FpdGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGEgPSBuZXcgWm9uZSgnYScpO1xuICAgICAgY29uc3QgYiA9IG5ldyBab25lKCdiJyk7XG5cbiAgICAgIGNvbnN0IG9yZGVyOiBBcnJheTxudW1iZXI+ID0gW107XG4gICAgICBjb25zdCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTx1bmtub3duPj4gPSBbXTtcblxuICAgICAgLy8gMS4gRW50ZXIgem9uZSBcImFcIlxuICAgICAgLy8gMi4gV2FpdCBmb3Igem9uZSBcImFcIiB0byBiZSBsZWZ0IHRvIGVudGVyIHpvbmUgXCJiXCIgdHdpY2VcbiAgICAgIC8vIDMuIFZlcmlmeSB0aGF0IGJvdGggem9uZSBcImJcIiB0YXNrcyByYW4gaW4gcGFyYWxsZWxcblxuICAgICAgcHJvbWlzZXMucHVzaChzdG9yZS53aXRoWm9uZShhLCAnYScsIGFzeW5jICgpID0+IG9yZGVyLnB1c2goMSkpKTtcbiAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgIHN0b3JlLndpdGhab25lKGIsICdiJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIG9yZGVyLnB1c2goMik7XG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgb3JkZXIucHVzaCgyMik7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgcHJvbWlzZXMucHVzaChcbiAgICAgICAgc3RvcmUud2l0aFpvbmUoYiwgJ2InLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgb3JkZXIucHVzaCgzKTtcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICBvcmRlci5wdXNoKDMzKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3JkZXIsIFsxLCAyLCAzLCAyMiwgMzNdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ05vdCB5ZXQgcHJvY2Vzc2VkIG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgIGNvbnN0IE5PVyA9IERhdGUubm93KCk7XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZUFsbFVucHJvY2Vzc2VkKCk7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHN0b3JlLmdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpdGVtcy5sZW5ndGgsIDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgdGhyZWUgYW5kIGdldHMgdGhlbSBiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBzdG9yZS5hZGRVbnByb2Nlc3NlZCh7XG4gICAgICAgICAgaWQ6ICcwLWRyb3BwZWQnLFxuICAgICAgICAgIHZlcnNpb246IDIsXG5cbiAgICAgICAgICBhdHRlbXB0czogMCxcbiAgICAgICAgICBlbnZlbG9wZTogJ29sZCBlbnZlbG9wZScsXG4gICAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXI6IC0xLFxuICAgICAgICAgIHRpbWVzdGFtcDogTk9XIC0gMiAqIGR1cmF0aW9ucy5NT05USCxcbiAgICAgICAgICB1cmdlbnQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBzdG9yZS5hZGRVbnByb2Nlc3NlZCh7XG4gICAgICAgICAgaWQ6ICcyLXR3bycsXG4gICAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgICAgIGVudmVsb3BlOiAnc2Vjb25kJyxcbiAgICAgICAgICByZWNlaXZlZEF0Q291bnRlcjogMSxcbiAgICAgICAgICB0aW1lc3RhbXA6IE5PVyArIDIsXG4gICAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgc3RvcmUuYWRkVW5wcm9jZXNzZWQoe1xuICAgICAgICAgIGlkOiAnMy10aHJlZScsXG4gICAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgICAgIGVudmVsb3BlOiAndGhpcmQnLFxuICAgICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiAyLFxuICAgICAgICAgIHRpbWVzdGFtcDogTk9XICsgMyxcbiAgICAgICAgICB1cmdlbnQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBzdG9yZS5hZGRVbnByb2Nlc3NlZCh7XG4gICAgICAgICAgaWQ6ICcxLW9uZScsXG4gICAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgICAgIGVudmVsb3BlOiAnZmlyc3QnLFxuICAgICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiAwLFxuICAgICAgICAgIHRpbWVzdGFtcDogTk9XICsgMSxcbiAgICAgICAgICB1cmdlbnQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgc3RvcmUuZ2V0QWxsVW5wcm9jZXNzZWRBbmRJbmNyZW1lbnRBdHRlbXB0cygpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zLmxlbmd0aCwgMyk7XG5cbiAgICAgIC8vIHRoZXkgYXJlIGluIHRoZSBwcm9wZXIgb3JkZXIgYmVjYXVzZSB0aGUgY29sbGVjdGlvbiBjb21wYXJhdG9yIGlzXG4gICAgICAvLyAncmVjZWl2ZWRBdENvdW50ZXInXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaXRlbXNbMF0uZW52ZWxvcGUsICdmaXJzdCcpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zWzFdLmVudmVsb3BlLCAnc2Vjb25kJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaXRlbXNbMl0uZW52ZWxvcGUsICd0aGlyZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbiB1cGRhdGVzIGl0ZW1zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSAnMS1vbmUnO1xuICAgICAgYXdhaXQgc3RvcmUuYWRkVW5wcm9jZXNzZWQoe1xuICAgICAgICBpZCxcbiAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICBhdHRlbXB0czogMCxcbiAgICAgICAgZW52ZWxvcGU6ICdmaXJzdCcsXG4gICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiAwLFxuICAgICAgICB0aW1lc3RhbXA6IE5PVyArIDEsXG4gICAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHN0b3JlLnVwZGF0ZVVucHJvY2Vzc2VkV2l0aERhdGEoaWQsIHsgZGVjcnlwdGVkOiAndXBkYXRlZCcgfSk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgc3RvcmUuZ2V0QWxsVW5wcm9jZXNzZWRBbmRJbmNyZW1lbnRBdHRlbXB0cygpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaXRlbXNbMF0uZGVjcnlwdGVkLCAndXBkYXRlZCcpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zWzBdLnRpbWVzdGFtcCwgTk9XICsgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaXRlbXNbMF0uYXR0ZW1wdHMsIDEpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zWzBdLnVyZ2VudCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZVVucHJvY2Vzc2VkIHN1Y2Nlc3NmdWxseSBkZWxldGVzIGl0ZW0nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpZCA9ICcxLW9uZSc7XG4gICAgICBhd2FpdCBzdG9yZS5hZGRVbnByb2Nlc3NlZCh7XG4gICAgICAgIGlkLFxuICAgICAgICB2ZXJzaW9uOiAyLFxuXG4gICAgICAgIGF0dGVtcHRzOiAwLFxuICAgICAgICBlbnZlbG9wZTogJ2ZpcnN0JyxcbiAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXI6IDAsXG4gICAgICAgIHRpbWVzdGFtcDogTk9XICsgMSxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBzdG9yZS5yZW1vdmVVbnByb2Nlc3NlZChpZCk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgc3RvcmUuZ2V0QWxsVW5wcm9jZXNzZWRBbmRJbmNyZW1lbnRBdHRlbXB0cygpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1zLmxlbmd0aCwgMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZ2V0QWxsVW5wcm9jZXNzZWRBbmRJbmNyZW1lbnRBdHRlbXB0cyBkZWxldGVzIGl0ZW1zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgc3RvcmUuYWRkVW5wcm9jZXNzZWQoe1xuICAgICAgICBpZDogJzEtb25lJyxcbiAgICAgICAgdmVyc2lvbjogMixcblxuICAgICAgICBhdHRlbXB0czogMyxcbiAgICAgICAgZW52ZWxvcGU6ICdmaXJzdCcsXG4gICAgICAgIHJlY2VpdmVkQXRDb3VudGVyOiAwLFxuICAgICAgICB0aW1lc3RhbXA6IE5PVyArIDEsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHN0b3JlLmdldEFsbFVucHJvY2Vzc2VkQW5kSW5jcmVtZW50QXR0ZW1wdHMoKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpdGVtcy5sZW5ndGgsIDApO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3JlbW92ZU91ck9sZFBuaS91cGRhdGVPdXJQbmlLZXlNYXRlcmlhbCcsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHN0b3JlLnN0b3JlUHJlS2V5KG91clV1aWQsIDIsIHRlc3RLZXkpO1xuICAgICAgYXdhaXQgc3RvcmUuc3RvcmVTaWduZWRQcmVLZXkob3VyVXVpZCwgMywgdGVzdEtleSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBvbGQgZGF0YSBhbmQgc2V0cyBuZXcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbGRQbmkgPSBvdXJVdWlkO1xuICAgICAgY29uc3QgbmV3UG5pID0gVVVJRC5nZW5lcmF0ZSgpO1xuXG4gICAgICBjb25zdCBuZXdJZGVudGl0eSA9IElkZW50aXR5S2V5UGFpci5nZW5lcmF0ZSgpO1xuXG4gICAgICBjb25zdCBkYXRhID0gZ2VuZXJhdGVTaWduZWRQcmVLZXkoXG4gICAgICAgIHtcbiAgICAgICAgICBwdWJLZXk6IG5ld0lkZW50aXR5LnB1YmxpY0tleS5zZXJpYWxpemUoKSxcbiAgICAgICAgICBwcml2S2V5OiBuZXdJZGVudGl0eS5wcml2YXRlS2V5LnNlcmlhbGl6ZSgpLFxuICAgICAgICB9LFxuICAgICAgICA4MjAxXG4gICAgICApO1xuICAgICAgY29uc3QgY3JlYXRlZEF0ID0gRGF0ZS5ub3coKSAtIDEyNDE7XG4gICAgICBjb25zdCBzaWduZWRQcmVLZXkgPSBTaWduZWRQcmVLZXlSZWNvcmQubmV3KFxuICAgICAgICBkYXRhLmtleUlkLFxuICAgICAgICBjcmVhdGVkQXQsXG4gICAgICAgIFB1YmxpY0tleS5kZXNlcmlhbGl6ZShCdWZmZXIuZnJvbShkYXRhLmtleVBhaXIucHViS2V5KSksXG4gICAgICAgIFByaXZhdGVLZXkuZGVzZXJpYWxpemUoQnVmZmVyLmZyb20oZGF0YS5rZXlQYWlyLnByaXZLZXkpKSxcbiAgICAgICAgQnVmZmVyLmZyb20oZGF0YS5zaWduYXR1cmUpXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBzdG9yZS5yZW1vdmVPdXJPbGRQbmkob2xkUG5pKTtcbiAgICAgIGF3YWl0IHN0b3JlLnVwZGF0ZU91clBuaUtleU1hdGVyaWFsKG5ld1BuaSwge1xuICAgICAgICBpZGVudGl0eUtleVBhaXI6IG5ld0lkZW50aXR5LnNlcmlhbGl6ZSgpLFxuICAgICAgICBzaWduZWRQcmVLZXk6IHNpZ25lZFByZUtleS5zZXJpYWxpemUoKSxcbiAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDUyMzEsXG4gICAgICB9KTtcblxuICAgICAgLy8gT2xkIGRhdGEgaGFzIHRvIGJlIHJlbW92ZWRcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChhd2FpdCBzdG9yZS5nZXRJZGVudGl0eUtleVBhaXIob2xkUG5pKSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXdhaXQgc3RvcmUuZ2V0TG9jYWxSZWdpc3RyYXRpb25JZChvbGRQbmkpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChhd2FpdCBzdG9yZS5sb2FkUHJlS2V5KG9sZFBuaSwgMikpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF3YWl0IHN0b3JlLmxvYWRTaWduZWRQcmVLZXkob2xkUG5pLCAzKSk7XG5cbiAgICAgIC8vIE5ldyBkYXRhIGhhcyB0byBiZSBhZGRlZFxuICAgICAgY29uc3Qgc3RvcmVkSWRlbnRpdHkgPSBhd2FpdCBzdG9yZS5nZXRJZGVudGl0eUtleVBhaXIobmV3UG5pKTtcbiAgICAgIGlmICghc3RvcmVkSWRlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXcgaWRlbnRpdHkgbm90IGZvdW5kJyk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBCeXRlcy5hcmVFcXVhbChcbiAgICAgICAgICBzdG9yZWRJZGVudGl0eS5wcml2S2V5LFxuICAgICAgICAgIG5ld0lkZW50aXR5LnByaXZhdGVLZXkuc2VyaWFsaXplKClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIEJ5dGVzLmFyZUVxdWFsKHN0b3JlZElkZW50aXR5LnB1YktleSwgbmV3SWRlbnRpdHkucHVibGljS2V5LnNlcmlhbGl6ZSgpKVxuICAgICAgKTtcblxuICAgICAgY29uc3Qgc3RvcmVkU2lnbmVkUHJlS2V5ID0gYXdhaXQgc3RvcmUubG9hZFNpZ25lZFByZUtleShuZXdQbmksIDgyMDEpO1xuICAgICAgaWYgKCFzdG9yZWRTaWduZWRQcmVLZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXcgc2lnbmVkIHByZSBrZXkgbm90IGZvdW5kJyk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBCeXRlcy5hcmVFcXVhbChcbiAgICAgICAgICBzdG9yZWRTaWduZWRQcmVLZXkucHVibGljS2V5KCkuc2VyaWFsaXplKCksXG4gICAgICAgICAgZGF0YS5rZXlQYWlyLnB1YktleVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgQnl0ZXMuYXJlRXF1YWwoXG4gICAgICAgICAgc3RvcmVkU2lnbmVkUHJlS2V5LnByaXZhdGVLZXkoKS5zZXJpYWxpemUoKSxcbiAgICAgICAgICBkYXRhLmtleVBhaXIucHJpdktleVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHN0b3JlZFNpZ25lZFByZUtleS50aW1lc3RhbXAoKSwgY3JlYXRlZEF0KTtcbiAgICAgIC8vIE5vdGU6IHNpZ25hdHVyZSBpcyBpZ25vcmVkLlxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLGtCQUE2QjtBQUM3Qiw4QkFBMkI7QUFDM0IsOEJBUU87QUFFUCxzQkFBdUI7QUFDdkIsZ0NBQXdDO0FBQ3hDLGdCQUEyQjtBQUMzQixrQkFBcUI7QUFFckIsWUFBdUI7QUFDdkIsb0JBQWtEO0FBQ2xELG1CQUlPO0FBRVAsaUNBQTRCO0FBQzVCLHFCQUF3QjtBQUN4Qiw4QkFBaUM7QUFDakMsa0JBQXFCO0FBR3JCLG9CQUFLLElBQUksK0JBQWM7QUFFdkIsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxJQUNFLHVCQUFPLE1BQU07QUFFakIsU0FBUyx1QkFBdUIsTUFBTTtBQUNwQyxRQUFNLFVBQVUsaUJBQUssU0FBUztBQUM5QixRQUFNLFlBQVksaUJBQUssU0FBUztBQUNoQyxNQUFJO0FBQ0osTUFBSTtBQUNKLE1BQUk7QUFFSiw0QkFBMEIsUUFBaUM7QUFDekQsVUFBTSxRQUFRLElBQUksZ0JBQWdCO0FBRWxDLFVBQU0sbUJBQW1CLENBQUM7QUFFMUIsUUFBSSxRQUFRO0FBQ1YsWUFBTSxpQkFBaUIsSUFBSSxpQkFBaUI7QUFFNUMsWUFBTSxlQUFlLGVBQWUsYUFBYTtBQUNqRCxZQUFNLGVBQWUsc0JBQXNCLGFBQWE7QUFDeEQsWUFBTSxlQUFlLHNC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
