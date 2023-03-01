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
var import_chai = require("chai");
var import_Crypto = require("../../Crypto");
var import_Curve = require("../../Curve");
var import_AccountManager = __toESM(require("../../textsecure/AccountManager"));
var import_UUID = require("../../types/UUID");
const { textsecure } = window;
const assertEqualBuffers = /* @__PURE__ */ __name((a, b) => {
  import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(a, b));
}, "assertEqualBuffers");
describe("Key generation", function thisNeeded() {
  const count = 10;
  const ourUuid = new import_UUID.UUID("aaaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee");
  this.timeout(count * 2e3);
  function itStoresPreKey(keyId) {
    it(`prekey ${keyId} is valid`, async () => {
      const keyPair = await textsecure.storage.protocol.loadPreKey(ourUuid, keyId);
      (0, import_chai.assert)(keyPair, `PreKey ${keyId} not found`);
    });
  }
  function itStoresSignedPreKey(keyId) {
    it(`signed prekey ${keyId} is valid`, async () => {
      const keyPair = await textsecure.storage.protocol.loadSignedPreKey(ourUuid, keyId);
      (0, import_chai.assert)(keyPair, `SignedPreKey ${keyId} not found`);
    });
  }
  async function validateResultKey(resultKey) {
    const keyPair = await textsecure.storage.protocol.loadPreKey(ourUuid, resultKey.keyId);
    if (!keyPair) {
      throw new Error(`PreKey ${resultKey.keyId} not found`);
    }
    assertEqualBuffers(resultKey.publicKey, keyPair.publicKey().serialize());
  }
  async function validateResultSignedKey(resultSignedKey) {
    const keyPair = await textsecure.storage.protocol.loadSignedPreKey(ourUuid, resultSignedKey.keyId);
    if (!keyPair) {
      throw new Error(`SignedPreKey ${resultSignedKey.keyId} not found`);
    }
    assertEqualBuffers(resultSignedKey.publicKey, keyPair.publicKey().serialize());
  }
  before(async () => {
    const keyPair = (0, import_Curve.generateKeyPair)();
    await textsecure.storage.put("identityKeyMap", {
      [ourUuid.toString()]: keyPair
    });
    await textsecure.storage.user.setUuidAndDeviceId(ourUuid.toString(), 1);
    await textsecure.storage.protocol.hydrateCaches();
  });
  after(async () => {
    await textsecure.storage.protocol.clearPreKeyStore();
    await textsecure.storage.protocol.clearSignedPreKeysStore();
  });
  describe("the first time", () => {
    let result;
    before(async () => {
      const accountManager = new import_AccountManager.default({});
      result = await accountManager.generateKeys(count, import_UUID.UUIDKind.ACI);
    });
    for (let i = 1; i <= count; i += 1) {
      itStoresPreKey(i);
    }
    itStoresSignedPreKey(1);
    it(`result contains ${count} preKeys`, () => {
      import_chai.assert.isArray(result.preKeys);
      import_chai.assert.lengthOf(result.preKeys, count);
      for (let i = 0; i < count; i += 1) {
        import_chai.assert.isObject(result.preKeys[i]);
      }
    });
    it("result contains the correct keyIds", () => {
      for (let i = 0; i < count; i += 1) {
        import_chai.assert.strictEqual(result.preKeys[i].keyId, i + 1);
      }
    });
    it("result contains the correct public keys", async () => {
      await Promise.all(result.preKeys.map(validateResultKey));
    });
    it("returns a signed prekey", () => {
      import_chai.assert.strictEqual(result.signedPreKey.keyId, 1);
      import_chai.assert.instanceOf(result.signedPreKey.signature, Uint8Array);
      return validateResultSignedKey(result.signedPreKey);
    });
  });
  describe("the second time", () => {
    let result;
    before(async () => {
      const accountManager = new import_AccountManager.default({});
      result = await accountManager.generateKeys(count, import_UUID.UUIDKind.ACI);
    });
    for (let i = 1; i <= 2 * count; i += 1) {
      itStoresPreKey(i);
    }
    itStoresSignedPreKey(1);
    itStoresSignedPreKey(2);
    it(`result contains ${count} preKeys`, () => {
      import_chai.assert.isArray(result.preKeys);
      import_chai.assert.lengthOf(result.preKeys, count);
      for (let i = 0; i < count; i += 1) {
        import_chai.assert.isObject(result.preKeys[i]);
      }
    });
    it("result contains the correct keyIds", () => {
      for (let i = 1; i <= count; i += 1) {
        import_chai.assert.strictEqual(result.preKeys[i - 1].keyId, i + count);
      }
    });
    it("result contains the correct public keys", async () => {
      await Promise.all(result.preKeys.map(validateResultKey));
    });
    it("returns a signed prekey", () => {
      import_chai.assert.strictEqual(result.signedPreKey.keyId, 2);
      import_chai.assert.instanceOf(result.signedPreKey.signature, Uint8Array);
      return validateResultSignedKey(result.signedPreKey);
    });
  });
  describe("the third time", () => {
    let result;
    before(async () => {
      const accountManager = new import_AccountManager.default({});
      result = await accountManager.generateKeys(count, import_UUID.UUIDKind.ACI);
    });
    for (let i = 1; i <= 3 * count; i += 1) {
      itStoresPreKey(i);
    }
    itStoresSignedPreKey(2);
    itStoresSignedPreKey(3);
    it(`result contains ${count} preKeys`, () => {
      import_chai.assert.isArray(result.preKeys);
      import_chai.assert.lengthOf(result.preKeys, count);
      for (let i = 0; i < count; i += 1) {
        import_chai.assert.isObject(result.preKeys[i]);
      }
    });
    it("result contains the correct keyIds", () => {
      for (let i = 1; i <= count; i += 1) {
        import_chai.assert.strictEqual(result.preKeys[i - 1].keyId, i + 2 * count);
      }
    });
    it("result contains the correct public keys", async () => {
      await Promise.all(result.preKeys.map(validateResultKey));
    });
    it("result contains a signed prekey", () => {
      import_chai.assert.strictEqual(result.signedPreKey.keyId, 3);
      import_chai.assert.instanceOf(result.signedPreKey.signature, Uint8Array);
      return validateResultSignedKey(result.signedPreKey);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2VuZXJhdGVfa2V5c190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNS0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7IGNvbnN0YW50VGltZUVxdWFsIH0gZnJvbSAnLi4vLi4vQ3J5cHRvJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5UGFpciB9IGZyb20gJy4uLy4uL0N1cnZlJztcbmltcG9ydCB0eXBlIHsgR2VuZXJhdGVkS2V5c1R5cGUgfSBmcm9tICcuLi8uLi90ZXh0c2VjdXJlL0FjY291bnRNYW5hZ2VyJztcbmltcG9ydCBBY2NvdW50TWFuYWdlciBmcm9tICcuLi8uLi90ZXh0c2VjdXJlL0FjY291bnRNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgUHJlS2V5VHlwZSwgU2lnbmVkUHJlS2V5VHlwZSB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvVHlwZXMuZCc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuXG5jb25zdCB7IHRleHRzZWN1cmUgfSA9IHdpbmRvdztcblxuY29uc3QgYXNzZXJ0RXF1YWxCdWZmZXJzID0gKGE6IFVpbnQ4QXJyYXksIGI6IFVpbnQ4QXJyYXkpID0+IHtcbiAgYXNzZXJ0LmlzVHJ1ZShjb25zdGFudFRpbWVFcXVhbChhLCBiKSk7XG59O1xuXG5kZXNjcmliZSgnS2V5IGdlbmVyYXRpb24nLCBmdW5jdGlvbiB0aGlzTmVlZGVkKCkge1xuICBjb25zdCBjb3VudCA9IDEwO1xuICBjb25zdCBvdXJVdWlkID0gbmV3IFVVSUQoJ2FhYWFhYWFhLWJiYmItNGNjYy05ZGRkLWVlZWVlZWVlZWVlZScpO1xuICB0aGlzLnRpbWVvdXQoY291bnQgKiAyMDAwKTtcblxuICBmdW5jdGlvbiBpdFN0b3Jlc1ByZUtleShrZXlJZDogbnVtYmVyKTogdm9pZCB7XG4gICAgaXQoYHByZWtleSAke2tleUlkfSBpcyB2YWxpZGAsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGtleVBhaXIgPSBhd2FpdCB0ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wubG9hZFByZUtleShcbiAgICAgICAgb3VyVXVpZCxcbiAgICAgICAga2V5SWRcbiAgICAgICk7XG4gICAgICBhc3NlcnQoa2V5UGFpciwgYFByZUtleSAke2tleUlkfSBub3QgZm91bmRgKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBpdFN0b3Jlc1NpZ25lZFByZUtleShrZXlJZDogbnVtYmVyKTogdm9pZCB7XG4gICAgaXQoYHNpZ25lZCBwcmVrZXkgJHtrZXlJZH0gaXMgdmFsaWRgLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBrZXlQYWlyID0gYXdhaXQgdGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmxvYWRTaWduZWRQcmVLZXkoXG4gICAgICAgIG91clV1aWQsXG4gICAgICAgIGtleUlkXG4gICAgICApO1xuICAgICAgYXNzZXJ0KGtleVBhaXIsIGBTaWduZWRQcmVLZXkgJHtrZXlJZH0gbm90IGZvdW5kYCk7XG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVSZXN1bHRLZXkoXG4gICAgcmVzdWx0S2V5OiBQaWNrPFByZUtleVR5cGUsICdrZXlJZCcgfCAncHVibGljS2V5Jz5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qga2V5UGFpciA9IGF3YWl0IHRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5sb2FkUHJlS2V5KFxuICAgICAgb3VyVXVpZCxcbiAgICAgIHJlc3VsdEtleS5rZXlJZFxuICAgICk7XG4gICAgaWYgKCFrZXlQYWlyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFByZUtleSAke3Jlc3VsdEtleS5rZXlJZH0gbm90IGZvdW5kYCk7XG4gICAgfVxuICAgIGFzc2VydEVxdWFsQnVmZmVycyhyZXN1bHRLZXkucHVibGljS2V5LCBrZXlQYWlyLnB1YmxpY0tleSgpLnNlcmlhbGl6ZSgpKTtcbiAgfVxuICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVJlc3VsdFNpZ25lZEtleShcbiAgICByZXN1bHRTaWduZWRLZXk6IFBpY2s8U2lnbmVkUHJlS2V5VHlwZSwgJ2tleUlkJyB8ICdwdWJsaWNLZXknPlxuICApIHtcbiAgICBjb25zdCBrZXlQYWlyID0gYXdhaXQgdGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmxvYWRTaWduZWRQcmVLZXkoXG4gICAgICBvdXJVdWlkLFxuICAgICAgcmVzdWx0U2lnbmVkS2V5LmtleUlkXG4gICAgKTtcbiAgICBpZiAoIWtleVBhaXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2lnbmVkUHJlS2V5ICR7cmVzdWx0U2lnbmVkS2V5LmtleUlkfSBub3QgZm91bmRgKTtcbiAgICB9XG4gICAgYXNzZXJ0RXF1YWxCdWZmZXJzKFxuICAgICAgcmVzdWx0U2lnbmVkS2V5LnB1YmxpY0tleSxcbiAgICAgIGtleVBhaXIucHVibGljS2V5KCkuc2VyaWFsaXplKClcbiAgICApO1xuICB9XG5cbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBrZXlQYWlyID0gZ2VuZXJhdGVLZXlQYWlyKCk7XG4gICAgYXdhaXQgdGV4dHNlY3VyZS5zdG9yYWdlLnB1dCgnaWRlbnRpdHlLZXlNYXAnLCB7XG4gICAgICBbb3VyVXVpZC50b1N0cmluZygpXToga2V5UGFpcixcbiAgICB9KTtcbiAgICBhd2FpdCB0ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5zZXRVdWlkQW5kRGV2aWNlSWQob3VyVXVpZC50b1N0cmluZygpLCAxKTtcbiAgICBhd2FpdCB0ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuaHlkcmF0ZUNhY2hlcygpO1xuICB9KTtcblxuICBhZnRlcihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmNsZWFyUHJlS2V5U3RvcmUoKTtcbiAgICBhd2FpdCB0ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuY2xlYXJTaWduZWRQcmVLZXlzU3RvcmUoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RoZSBmaXJzdCB0aW1lJywgKCkgPT4ge1xuICAgIGxldCByZXN1bHQ6IEdlbmVyYXRlZEtleXNUeXBlO1xuXG4gICAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICBjb25zdCBhY2NvdW50TWFuYWdlciA9IG5ldyBBY2NvdW50TWFuYWdlcih7fSBhcyBhbnkpO1xuICAgICAgcmVzdWx0ID0gYXdhaXQgYWNjb3VudE1hbmFnZXIuZ2VuZXJhdGVLZXlzKGNvdW50LCBVVUlES2luZC5BQ0kpO1xuICAgIH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY291bnQ7IGkgKz0gMSkge1xuICAgICAgaXRTdG9yZXNQcmVLZXkoaSk7XG4gICAgfVxuICAgIGl0U3RvcmVzU2lnbmVkUHJlS2V5KDEpO1xuXG4gICAgaXQoYHJlc3VsdCBjb250YWlucyAke2NvdW50fSBwcmVLZXlzYCwgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzQXJyYXkocmVzdWx0LnByZUtleXMpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHJlc3VsdC5wcmVLZXlzLCBjb3VudCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpICs9IDEpIHtcbiAgICAgICAgYXNzZXJ0LmlzT2JqZWN0KHJlc3VsdC5wcmVLZXlzW2ldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpdCgncmVzdWx0IGNvbnRhaW5zIHRoZSBjb3JyZWN0IGtleUlkcycsICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkgKz0gMSkge1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0LnByZUtleXNbaV0ua2V5SWQsIGkgKyAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpdCgncmVzdWx0IGNvbnRhaW5zIHRoZSBjb3JyZWN0IHB1YmxpYyBrZXlzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocmVzdWx0LnByZUtleXMubWFwKHZhbGlkYXRlUmVzdWx0S2V5KSk7XG4gICAgfSk7XG4gICAgaXQoJ3JldHVybnMgYSBzaWduZWQgcHJla2V5JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdC5zaWduZWRQcmVLZXkua2V5SWQsIDEpO1xuICAgICAgYXNzZXJ0Lmluc3RhbmNlT2YocmVzdWx0LnNpZ25lZFByZUtleS5zaWduYXR1cmUsIFVpbnQ4QXJyYXkpO1xuICAgICAgcmV0dXJuIHZhbGlkYXRlUmVzdWx0U2lnbmVkS2V5KHJlc3VsdC5zaWduZWRQcmVLZXkpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3RoZSBzZWNvbmQgdGltZScsICgpID0+IHtcbiAgICBsZXQgcmVzdWx0OiBHZW5lcmF0ZWRLZXlzVHlwZTtcbiAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgIGNvbnN0IGFjY291bnRNYW5hZ2VyID0gbmV3IEFjY291bnRNYW5hZ2VyKHt9IGFzIGFueSk7XG4gICAgICByZXN1bHQgPSBhd2FpdCBhY2NvdW50TWFuYWdlci5nZW5lcmF0ZUtleXMoY291bnQsIFVVSURLaW5kLkFDSSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyICogY291bnQ7IGkgKz0gMSkge1xuICAgICAgaXRTdG9yZXNQcmVLZXkoaSk7XG4gICAgfVxuICAgIGl0U3RvcmVzU2lnbmVkUHJlS2V5KDEpO1xuICAgIGl0U3RvcmVzU2lnbmVkUHJlS2V5KDIpO1xuICAgIGl0KGByZXN1bHQgY29udGFpbnMgJHtjb3VudH0gcHJlS2V5c2AsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0FycmF5KHJlc3VsdC5wcmVLZXlzKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihyZXN1bHQucHJlS2V5cywgY291bnQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGFzc2VydC5pc09iamVjdChyZXN1bHQucHJlS2V5c1tpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ3Jlc3VsdCBjb250YWlucyB0aGUgY29ycmVjdCBrZXlJZHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQucHJlS2V5c1tpIC0gMV0ua2V5SWQsIGkgKyBjb3VudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ3Jlc3VsdCBjb250YWlucyB0aGUgY29ycmVjdCBwdWJsaWMga2V5cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHJlc3VsdC5wcmVLZXlzLm1hcCh2YWxpZGF0ZVJlc3VsdEtleSkpO1xuICAgIH0pO1xuICAgIGl0KCdyZXR1cm5zIGEgc2lnbmVkIHByZWtleScsICgpID0+IHtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQuc2lnbmVkUHJlS2V5LmtleUlkLCAyKTtcbiAgICAgIGFzc2VydC5pbnN0YW5jZU9mKHJlc3VsdC5zaWduZWRQcmVLZXkuc2lnbmF0dXJlLCBVaW50OEFycmF5KTtcbiAgICAgIHJldHVybiB2YWxpZGF0ZVJlc3VsdFNpZ25lZEtleShyZXN1bHQuc2lnbmVkUHJlS2V5KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCd0aGUgdGhpcmQgdGltZScsICgpID0+IHtcbiAgICBsZXQgcmVzdWx0OiBHZW5lcmF0ZWRLZXlzVHlwZTtcbiAgICBiZWZvcmUoYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgIGNvbnN0IGFjY291bnRNYW5hZ2VyID0gbmV3IEFjY291bnRNYW5hZ2VyKHt9IGFzIGFueSk7XG4gICAgICByZXN1bHQgPSBhd2FpdCBhY2NvdW50TWFuYWdlci5nZW5lcmF0ZUtleXMoY291bnQsIFVVSURLaW5kLkFDSSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzICogY291bnQ7IGkgKz0gMSkge1xuICAgICAgaXRTdG9yZXNQcmVLZXkoaSk7XG4gICAgfVxuICAgIGl0U3RvcmVzU2lnbmVkUHJlS2V5KDIpO1xuICAgIGl0U3RvcmVzU2lnbmVkUHJlS2V5KDMpO1xuICAgIGl0KGByZXN1bHQgY29udGFpbnMgJHtjb3VudH0gcHJlS2V5c2AsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0FycmF5KHJlc3VsdC5wcmVLZXlzKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihyZXN1bHQucHJlS2V5cywgY291bnQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGFzc2VydC5pc09iamVjdChyZXN1bHQucHJlS2V5c1tpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ3Jlc3VsdCBjb250YWlucyB0aGUgY29ycmVjdCBrZXlJZHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQucHJlS2V5c1tpIC0gMV0ua2V5SWQsIGkgKyAyICogY291bnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGl0KCdyZXN1bHQgY29udGFpbnMgdGhlIGNvcnJlY3QgcHVibGljIGtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChyZXN1bHQucHJlS2V5cy5tYXAodmFsaWRhdGVSZXN1bHRLZXkpKTtcbiAgICB9KTtcbiAgICBpdCgncmVzdWx0IGNvbnRhaW5zIGEgc2lnbmVkIHByZWtleScsICgpID0+IHtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQuc2lnbmVkUHJlS2V5LmtleUlkLCAzKTtcbiAgICAgIGFzc2VydC5pbnN0YW5jZU9mKHJlc3VsdC5zaWduZWRQcmVLZXkuc2lnbmF0dXJlLCBVaW50OEFycmF5KTtcbiAgICAgIHJldHVybiB2YWxpZGF0ZVJlc3VsdFNpZ25lZEtleShyZXN1bHQuc2lnbmVkUHJlS2V5KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrQkFBdUI7QUFFdkIsb0JBQWtDO0FBQ2xDLG1CQUFnQztBQUVoQyw0QkFBMkI7QUFFM0Isa0JBQStCO0FBRS9CLE1BQU0sRUFBRSxlQUFlO0FBRXZCLE1BQU0scUJBQXFCLHdCQUFDLEdBQWUsTUFBa0I7QUFDM0QscUJBQU8sT0FBTyxxQ0FBa0IsR0FBRyxDQUFDLENBQUM7QUFDdkMsR0FGMkI7QUFJM0IsU0FBUyxrQkFBa0Isc0JBQXNCO0FBQy9DLFFBQU0sUUFBUTtBQUNkLFFBQU0sVUFBVSxJQUFJLGlCQUFLLHNDQUFzQztBQUMvRCxPQUFLLFFBQVEsUUFBUSxHQUFJO0FBRXpCLDBCQUF3QixPQUFxQjtBQUMzQyxPQUFHLFVBQVUsa0JBQWtCLFlBQVk7QUFDekMsWUFBTSxVQUFVLE1BQU0sV0FBVyxRQUFRLFNBQVMsV0FDaEQsU0FDQSxLQUNGO0FBQ0EsOEJBQU8sU0FBUyxVQUFVLGlCQUFpQjtBQUFBLElBQzdDLENBQUM7QUFBQSxFQUNIO0FBUlMsQUFTVCxnQ0FBOEIsT0FBcUI7QUFDakQsT0FBRyxpQkFBaUIsa0JBQWtCLFlBQVk7QUFDaEQsWUFBTSxVQUFVLE1BQU0sV0FBVyxRQUFRLFNBQVMsaUJBQ2hELFNBQ0EsS0FDRjtBQUNBLDhCQUFPLFNBQVMsZ0JBQWdCLGlCQUFpQjtBQUFBLElBQ25E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
