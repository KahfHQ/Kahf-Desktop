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
var LegacyCDS_exports = {};
__export(LegacyCDS_exports, {
  LegacyCDS: () => LegacyCDS
});
module.exports = __toCommonJS(LegacyCDS_exports);
var import_p_props = __toESM(require("p-props"));
var import_lodash = require("lodash");
var import_long = __toESM(require("long"));
var import_crypto = require("crypto");
var import_node_forge = require("node-forge");
var import_Crypto = require("../../Crypto");
var import_Curve = require("../../Curve");
var Bytes = __toESM(require("../../Bytes"));
var import_assert = require("../../util/assert");
var import_UUID = require("../../types/UUID");
var import_CDSBase = require("./CDSBase");
let sgxConstantCache = null;
function makeLong(value) {
  return import_long.default.fromString(value);
}
function getSgxConstants() {
  if (sgxConstantCache) {
    return sgxConstantCache;
  }
  sgxConstantCache = {
    SGX_FLAGS_INITTED: makeLong("x0000000000000001L"),
    SGX_FLAGS_DEBUG: makeLong("x0000000000000002L"),
    SGX_FLAGS_MODE64BIT: makeLong("x0000000000000004L"),
    SGX_FLAGS_PROVISION_KEY: makeLong("x0000000000000004L"),
    SGX_FLAGS_EINITTOKEN_KEY: makeLong("x0000000000000004L"),
    SGX_FLAGS_RESERVED: makeLong("xFFFFFFFFFFFFFFC8L"),
    SGX_XFRM_LEGACY: makeLong("x0000000000000003L"),
    SGX_XFRM_AVX: makeLong("x0000000000000006L"),
    SGX_XFRM_RESERVED: makeLong("xFFFFFFFFFFFFFFF8L")
  };
  return sgxConstantCache;
}
class LegacyCDS extends import_CDSBase.CDSBase {
  async request({
    e164s,
    acis,
    accessKeys
  }) {
    (0, import_assert.strictAssert)(!acis && !accessKeys, "LegacyCDS does not support PNP");
    const directoryAuth = await this.getAuth();
    const attestationResult = await this.putAttestation(directoryAuth);
    const data = await (0, import_Crypto.encryptCdsDiscoveryRequest)(attestationResult.attestations, e164s);
    const { cookie } = attestationResult;
    const discoveryResponse = await this.options.fetchDiscoveryData(directoryAuth, data, cookie);
    const returnedAttestation = Object.values(attestationResult.attestations).find((at) => (0, import_Crypto.constantTimeEqual)(at.requestId, discoveryResponse.requestId));
    if (!returnedAttestation) {
      throw new Error("No known attestations returned from CDS");
    }
    const decryptedDiscoveryData = (0, import_Crypto.decryptAesGcm)(returnedAttestation.serverKey, discoveryResponse.iv, Bytes.concatenate([discoveryResponse.data, discoveryResponse.mac]));
    const uuids = (0, import_Crypto.splitUuids)(decryptedDiscoveryData);
    if (uuids.length !== e164s.length) {
      throw new Error("Returned set of UUIDs did not match returned set of e164s!");
    }
    const result = /* @__PURE__ */ new Map();
    for (const [i, e164] of e164s.entries()) {
      const uuid = uuids[i];
      result.set(e164, {
        aci: void 0,
        pni: uuid ? import_UUID.UUID.cast(uuid) : void 0
      });
    }
    return result;
  }
  async putAttestation(auth) {
    const { privKey, pubKey } = (0, import_Curve.generateKeyPair)();
    const slicedPubKey = pubKey.slice(1);
    const { cookie, responseBody } = await this.options.putAttestation(auth, slicedPubKey);
    const attestationsLength = Object.keys(responseBody.attestations).length;
    if (attestationsLength > 3) {
      throw new Error("Got more than three attestations from the Contact Discovery Service");
    }
    if (attestationsLength < 1) {
      throw new Error("Got no attestations from the Contact Discovery Service");
    }
    return {
      cookie,
      attestations: await (0, import_p_props.default)(responseBody.attestations, async (attestation) => {
        const decoded = {
          ...attestation,
          ciphertext: Bytes.fromBase64(attestation.ciphertext),
          iv: Bytes.fromBase64(attestation.iv),
          quote: Bytes.fromBase64(attestation.quote),
          serverEphemeralPublic: Bytes.fromBase64(attestation.serverEphemeralPublic),
          serverStaticPublic: Bytes.fromBase64(attestation.serverStaticPublic),
          signature: Bytes.fromBase64(attestation.signature),
          tag: Bytes.fromBase64(attestation.tag)
        };
        this.validateAttestationQuote(decoded);
        validateAttestationSignatureBody(JSON.parse(decoded.signatureBody), attestation.quote);
        await this.validateAttestationSignature(decoded.signature, decoded.signatureBody, decoded.certificates);
        const ephemeralToEphemeral = (0, import_Curve.calculateAgreement)(decoded.serverEphemeralPublic, privKey);
        const ephemeralToStatic = (0, import_Curve.calculateAgreement)(decoded.serverStaticPublic, privKey);
        const masterSecret = Bytes.concatenate([
          ephemeralToEphemeral,
          ephemeralToStatic
        ]);
        const publicKeys = Bytes.concatenate([
          slicedPubKey,
          decoded.serverEphemeralPublic,
          decoded.serverStaticPublic
        ]);
        const [clientKey, serverKey] = (0, import_Crypto.deriveSecrets)(masterSecret, publicKeys, new Uint8Array(0));
        const requestId = (0, import_Crypto.decryptAesGcm)(serverKey, decoded.iv, Bytes.concatenate([decoded.ciphertext, decoded.tag]));
        return {
          clientKey,
          serverKey,
          requestId
        };
      })
    };
  }
  async validateAttestationSignature(signature, signatureBody, certificates) {
    const CERT_PREFIX = "-----BEGIN CERTIFICATE-----";
    const pem = (0, import_lodash.compact)(certificates.split(CERT_PREFIX).map((match) => {
      if (!match) {
        return null;
      }
      return `${CERT_PREFIX}${match}`;
    }));
    if (pem.length < 2) {
      throw new Error(`validateAttestationSignature: Expect two or more entries; got ${pem.length}`);
    }
    const verify = (0, import_crypto.createVerify)("RSA-SHA256");
    verify.update(Buffer.from(Bytes.fromString(signatureBody)));
    const isValid = verify.verify(pem[0], Buffer.from(signature));
    if (!isValid) {
      throw new Error("Validation of signature across signatureBody failed!");
    }
    const caStore = import_node_forge.pki.createCaStore([this.options.directoryTrustAnchor]);
    const chain = (0, import_lodash.compact)(pem.map((cert) => import_node_forge.pki.certificateFromPem(cert)));
    const isChainValid = import_node_forge.pki.verifyCertificateChain(caStore, chain);
    if (!isChainValid) {
      throw new Error("Validation of certificate chain failed!");
    }
    const leafCert = chain[0];
    const fieldCN = leafCert.subject.getField("CN");
    if (!fieldCN || fieldCN.value !== "Intel SGX Attestation Report Signing") {
      throw new Error("Leaf cert CN field had unexpected value");
    }
    const fieldO = leafCert.subject.getField("O");
    if (!fieldO || fieldO.value !== "Intel Corporation") {
      throw new Error("Leaf cert O field had unexpected value");
    }
    const fieldL = leafCert.subject.getField("L");
    if (!fieldL || fieldL.value !== "Santa Clara") {
      throw new Error("Leaf cert L field had unexpected value");
    }
    const fieldST = leafCert.subject.getField("ST");
    if (!fieldST || fieldST.value !== "CA") {
      throw new Error("Leaf cert ST field had unexpected value");
    }
    const fieldC = leafCert.subject.getField("C");
    if (!fieldC || fieldC.value !== "US") {
      throw new Error("Leaf cert C field had unexpected value");
    }
  }
  validateAttestationQuote({
    serverStaticPublic,
    quote: quoteBytes
  }) {
    const SGX_CONSTANTS = getSgxConstants();
    const quote = Buffer.from(quoteBytes);
    const quoteVersion = quote.readInt16LE(0) & 65535;
    if (quoteVersion < 0 || quoteVersion > 2) {
      throw new Error(`Unknown version ${quoteVersion}`);
    }
    const miscSelect = quote.slice(64, 64 + 4);
    if (!miscSelect.every((byte) => byte === 0)) {
      throw new Error("Quote miscSelect invalid!");
    }
    const reserved1 = quote.slice(68, 68 + 28);
    if (!reserved1.every((byte) => byte === 0)) {
      throw new Error("Quote reserved1 invalid!");
    }
    const flags = import_long.default.fromBytesLE(Array.from(quote.slice(96, 96 + 8).values()));
    if (flags.and(SGX_CONSTANTS.SGX_FLAGS_RESERVED).notEquals(0) || flags.and(SGX_CONSTANTS.SGX_FLAGS_INITTED).equals(0) || flags.and(SGX_CONSTANTS.SGX_FLAGS_MODE64BIT).equals(0)) {
      throw new Error(`Quote flags invalid ${flags.toString()}`);
    }
    const xfrm = import_long.default.fromBytesLE(Array.from(quote.slice(104, 104 + 8).values()));
    if (xfrm.and(SGX_CONSTANTS.SGX_XFRM_RESERVED).notEquals(0)) {
      throw new Error(`Quote xfrm invalid ${xfrm}`);
    }
    const mrenclave = quote.slice(112, 112 + 32);
    const enclaveIdBytes = Bytes.fromHex(this.options.directoryEnclaveId);
    if (mrenclave.compare(enclaveIdBytes) !== 0) {
      throw new Error("Quote mrenclave invalid!");
    }
    const reserved2 = quote.slice(144, 144 + 32);
    if (!reserved2.every((byte) => byte === 0)) {
      throw new Error("Quote reserved2 invalid!");
    }
    const reportData = quote.slice(368, 368 + 64);
    const serverStaticPublicBytes = serverStaticPublic;
    if (!reportData.every((byte, index) => {
      if (index >= 32) {
        return byte === 0;
      }
      return byte === serverStaticPublicBytes[index];
    })) {
      throw new Error("Quote report_data invalid!");
    }
    const reserved3 = quote.slice(208, 208 + 96);
    if (!reserved3.every((byte) => byte === 0)) {
      throw new Error("Quote reserved3 invalid!");
    }
    const reserved4 = quote.slice(308, 308 + 60);
    if (!reserved4.every((byte) => byte === 0)) {
      throw new Error("Quote reserved4 invalid!");
    }
    const signatureLength = quote.readInt32LE(432) >>> 0;
    if (signatureLength !== quote.byteLength - 436) {
      throw new Error(`Bad signatureLength ${signatureLength}`);
    }
  }
}
function validateAttestationSignatureBody(signatureBody, encodedQuote) {
  const { timestamp } = signatureBody;
  const utcTimestamp = timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`;
  const signatureTime = new Date(utcTimestamp).getTime();
  const now = Date.now();
  if (signatureBody.version !== 4) {
    throw new Error("Attestation signature invalid version!");
  }
  if (!encodedQuote.startsWith(signatureBody.isvEnclaveQuoteBody)) {
    throw new Error("Attestion signature mismatches quote!");
  }
  if (signatureBody.isvEnclaveQuoteStatus !== "SW_HARDENING_NEEDED") {
    throw new Error('Attestation signature status not "SW_HARDENING_NEEDED"!');
  }
  if (signatureBody.advisoryIDs.length !== 1 || signatureBody.advisoryIDs[0] !== "INTEL-SA-00334") {
    throw new Error("Attestation advisory ids are incorrect");
  }
  if (signatureTime < now - 24 * 60 * 60 * 1e3) {
    throw new Error("Attestation signature timestamp older than 24 hours!");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LegacyCDS
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTGVnYWN5Q0RTLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcbi8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cblxuaW1wb3J0IHBQcm9wcyBmcm9tICdwLXByb3BzJztcbmltcG9ydCB7IGNvbXBhY3QgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IExvbmcgZnJvbSAnbG9uZyc7XG5pbXBvcnQgeyBjcmVhdGVWZXJpZnkgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgcGtpIH0gZnJvbSAnbm9kZS1mb3JnZSc7XG5cbmltcG9ydCB7XG4gIGNvbnN0YW50VGltZUVxdWFsLFxuICBkZWNyeXB0QWVzR2NtLFxuICBkZXJpdmVTZWNyZXRzLFxuICBlbmNyeXB0Q2RzRGlzY292ZXJ5UmVxdWVzdCxcbiAgc3BsaXRVdWlkcyxcbn0gZnJvbSAnLi4vLi4vQ3J5cHRvJztcbmltcG9ydCB7IGNhbGN1bGF0ZUFncmVlbWVudCwgZ2VuZXJhdGVLZXlQYWlyIH0gZnJvbSAnLi4vLi4vQ3VydmUnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vLi4vQnl0ZXMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBDRFNCYXNlT3B0aW9uc1R5cGUgfSBmcm9tICcuL0NEU0Jhc2UnO1xuaW1wb3J0IHsgQ0RTQmFzZSB9IGZyb20gJy4vQ0RTQmFzZSc7XG5pbXBvcnQgdHlwZSB7XG4gIENEU1JlcXVlc3RPcHRpb25zVHlwZSxcbiAgQ0RTUmVzcG9uc2VUeXBlLFxuICBDRFNBdXRoVHlwZSxcbiAgQ0RTUmVzcG9uc2VFbnRyeVR5cGUsXG59IGZyb20gJy4vVHlwZXMuZCc7XG5cbmV4cG9ydCB0eXBlIExlZ2FjeUNEU1B1dEF0dGVzdGF0aW9uUmVzcG9uc2VUeXBlID0gUmVhZG9ubHk8e1xuICBhdHRlc3RhdGlvbnM6IFJlY29yZDxcbiAgICBzdHJpbmcsXG4gICAge1xuICAgICAgY2lwaGVydGV4dDogc3RyaW5nO1xuICAgICAgaXY6IHN0cmluZztcbiAgICAgIHF1b3RlOiBzdHJpbmc7XG4gICAgICBzZXJ2ZXJFcGhlbWVyYWxQdWJsaWM6IHN0cmluZztcbiAgICAgIHNlcnZlclN0YXRpY1B1YmxpYzogc3RyaW5nO1xuICAgICAgc2lnbmF0dXJlOiBzdHJpbmc7XG4gICAgICBzaWduYXR1cmVCb2R5OiBzdHJpbmc7XG4gICAgICB0YWc6IHN0cmluZztcbiAgICAgIGNlcnRpZmljYXRlczogc3RyaW5nO1xuICAgIH1cbiAgPjtcbn0+O1xuXG5leHBvcnQgdHlwZSBMZWdhY3lDRFNQdXRBdHRlc3RhdGlvblJlc3VsdFR5cGUgPSBSZWFkb25seTx7XG4gIGNvb2tpZT86IHN0cmluZztcbiAgcmVzcG9uc2VCb2R5OiBMZWdhY3lDRFNQdXRBdHRlc3RhdGlvblJlc3BvbnNlVHlwZTtcbn0+O1xuXG5leHBvcnQgdHlwZSBMZWdhY3lDRFNEaXNjb3ZlcnlSZXNwb25zZVR5cGUgPSBSZWFkb25seTx7XG4gIHJlcXVlc3RJZDogVWludDhBcnJheTtcbiAgaXY6IFVpbnQ4QXJyYXk7XG4gIGRhdGE6IFVpbnQ4QXJyYXk7XG4gIG1hYzogVWludDhBcnJheTtcbn0+O1xuXG5leHBvcnQgdHlwZSBMZWdhY3lDRFNPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgZGlyZWN0b3J5RW5jbGF2ZUlkOiBzdHJpbmc7XG4gIGRpcmVjdG9yeVRydXN0QW5jaG9yOiBzdHJpbmc7XG5cbiAgcHV0QXR0ZXN0YXRpb246IChcbiAgICBhdXRoOiBDRFNBdXRoVHlwZSxcbiAgICBwdWJsaWNLZXk6IFVpbnQ4QXJyYXlcbiAgKSA9PiBQcm9taXNlPExlZ2FjeUNEU1B1dEF0dGVzdGF0aW9uUmVzdWx0VHlwZT47XG4gIGZldGNoRGlzY292ZXJ5RGF0YTogKFxuICAgIGF1dGg6IENEU0F1dGhUeXBlLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIGNvb2tpZT86IHN0cmluZ1xuICApID0+IFByb21pc2U8TGVnYWN5Q0RTRGlzY292ZXJ5UmVzcG9uc2VUeXBlPjtcbn0+ICZcbiAgQ0RTQmFzZU9wdGlvbnNUeXBlO1xuXG50eXBlIEF0dGVzdGF0aW9uTWFwVHlwZSA9IFJlYWRvbmx5PHtcbiAgY29va2llPzogc3RyaW5nO1xuICBhdHRlc3RhdGlvbnM6IFJlY29yZDxcbiAgICBzdHJpbmcsXG4gICAgUmVhZG9ubHk8e1xuICAgICAgY2xpZW50S2V5OiBVaW50OEFycmF5O1xuICAgICAgc2VydmVyS2V5OiBVaW50OEFycmF5O1xuICAgICAgcmVxdWVzdElkOiBVaW50OEFycmF5O1xuICAgIH0+XG4gID47XG59PjtcblxudHlwZSBTZ3hDb25zdGFudHNUeXBlID0ge1xuICBTR1hfRkxBR1NfSU5JVFRFRDogTG9uZztcbiAgU0dYX0ZMQUdTX0RFQlVHOiBMb25nO1xuICBTR1hfRkxBR1NfTU9ERTY0QklUOiBMb25nO1xuICBTR1hfRkxBR1NfUFJPVklTSU9OX0tFWTogTG9uZztcbiAgU0dYX0ZMQUdTX0VJTklUVE9LRU5fS0VZOiBMb25nO1xuICBTR1hfRkxBR1NfUkVTRVJWRUQ6IExvbmc7XG4gIFNHWF9YRlJNX0xFR0FDWTogTG9uZztcbiAgU0dYX1hGUk1fQVZYOiBMb25nO1xuICBTR1hfWEZSTV9SRVNFUlZFRDogTG9uZztcbn07XG5cbmxldCBzZ3hDb25zdGFudENhY2hlOiBTZ3hDb25zdGFudHNUeXBlIHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIG1ha2VMb25nKHZhbHVlOiBzdHJpbmcpOiBMb25nIHtcbiAgcmV0dXJuIExvbmcuZnJvbVN0cmluZyh2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRTZ3hDb25zdGFudHMoKSB7XG4gIGlmIChzZ3hDb25zdGFudENhY2hlKSB7XG4gICAgcmV0dXJuIHNneENvbnN0YW50Q2FjaGU7XG4gIH1cblxuICBzZ3hDb25zdGFudENhY2hlID0ge1xuICAgIFNHWF9GTEFHU19JTklUVEVEOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDFMJyksXG4gICAgU0dYX0ZMQUdTX0RFQlVHOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDJMJyksXG4gICAgU0dYX0ZMQUdTX01PREU2NEJJVDogbWFrZUxvbmcoJ3gwMDAwMDAwMDAwMDAwMDA0TCcpLFxuICAgIFNHWF9GTEFHU19QUk9WSVNJT05fS0VZOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDRMJyksXG4gICAgU0dYX0ZMQUdTX0VJTklUVE9LRU5fS0VZOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDRMJyksXG4gICAgU0dYX0ZMQUdTX1JFU0VSVkVEOiBtYWtlTG9uZygneEZGRkZGRkZGRkZGRkZGQzhMJyksXG4gICAgU0dYX1hGUk1fTEVHQUNZOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDNMJyksXG4gICAgU0dYX1hGUk1fQVZYOiBtYWtlTG9uZygneDAwMDAwMDAwMDAwMDAwMDZMJyksXG4gICAgU0dYX1hGUk1fUkVTRVJWRUQ6IG1ha2VMb25nKCd4RkZGRkZGRkZGRkZGRkZGOEwnKSxcbiAgfTtcblxuICByZXR1cm4gc2d4Q29uc3RhbnRDYWNoZTtcbn1cblxuZXhwb3J0IGNsYXNzIExlZ2FjeUNEUyBleHRlbmRzIENEU0Jhc2U8TGVnYWN5Q0RTT3B0aW9uc1R5cGU+IHtcbiAgcHVibGljIG92ZXJyaWRlIGFzeW5jIHJlcXVlc3Qoe1xuICAgIGUxNjRzLFxuICAgIGFjaXMsXG4gICAgYWNjZXNzS2V5cyxcbiAgfTogQ0RTUmVxdWVzdE9wdGlvbnNUeXBlKTogUHJvbWlzZTxDRFNSZXNwb25zZVR5cGU+IHtcbiAgICBzdHJpY3RBc3NlcnQoIWFjaXMgJiYgIWFjY2Vzc0tleXMsICdMZWdhY3lDRFMgZG9lcyBub3Qgc3VwcG9ydCBQTlAnKTtcblxuICAgIGNvbnN0IGRpcmVjdG9yeUF1dGggPSBhd2FpdCB0aGlzLmdldEF1dGgoKTtcbiAgICBjb25zdCBhdHRlc3RhdGlvblJlc3VsdCA9IGF3YWl0IHRoaXMucHV0QXR0ZXN0YXRpb24oZGlyZWN0b3J5QXV0aCk7XG5cbiAgICAvLyBFbmNyeXB0IGRhdGEgZm9yIGRpc2NvdmVyeVxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBlbmNyeXB0Q2RzRGlzY292ZXJ5UmVxdWVzdChcbiAgICAgIGF0dGVzdGF0aW9uUmVzdWx0LmF0dGVzdGF0aW9ucyxcbiAgICAgIGUxNjRzXG4gICAgKTtcbiAgICBjb25zdCB7IGNvb2tpZSB9ID0gYXR0ZXN0YXRpb25SZXN1bHQ7XG5cbiAgICAvLyBTZW5kIGRpc2NvdmVyeSByZXF1ZXN0XG4gICAgY29uc3QgZGlzY292ZXJ5UmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9wdGlvbnMuZmV0Y2hEaXNjb3ZlcnlEYXRhKFxuICAgICAgZGlyZWN0b3J5QXV0aCxcbiAgICAgIGRhdGEsXG4gICAgICBjb29raWVcbiAgICApO1xuXG4gICAgY29uc3QgcmV0dXJuZWRBdHRlc3RhdGlvbiA9IE9iamVjdC52YWx1ZXMoXG4gICAgICBhdHRlc3RhdGlvblJlc3VsdC5hdHRlc3RhdGlvbnNcbiAgICApLmZpbmQoYXQgPT4gY29uc3RhbnRUaW1lRXF1YWwoYXQucmVxdWVzdElkLCBkaXNjb3ZlcnlSZXNwb25zZS5yZXF1ZXN0SWQpKTtcbiAgICBpZiAoIXJldHVybmVkQXR0ZXN0YXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8ga25vd24gYXR0ZXN0YXRpb25zIHJldHVybmVkIGZyb20gQ0RTJyk7XG4gICAgfVxuXG4gICAgLy8gRGVjcnlwdCBkaXNjb3ZlcnkgcmVzcG9uc2VcbiAgICBjb25zdCBkZWNyeXB0ZWREaXNjb3ZlcnlEYXRhID0gZGVjcnlwdEFlc0djbShcbiAgICAgIHJldHVybmVkQXR0ZXN0YXRpb24uc2VydmVyS2V5LFxuICAgICAgZGlzY292ZXJ5UmVzcG9uc2UuaXYsXG4gICAgICBCeXRlcy5jb25jYXRlbmF0ZShbZGlzY292ZXJ5UmVzcG9uc2UuZGF0YSwgZGlzY292ZXJ5UmVzcG9uc2UubWFjXSlcbiAgICApO1xuXG4gICAgLy8gUHJvY2VzcyBhbmQgcmV0dXJuIHJlc3VsdFxuICAgIGNvbnN0IHV1aWRzID0gc3BsaXRVdWlkcyhkZWNyeXB0ZWREaXNjb3ZlcnlEYXRhKTtcblxuICAgIGlmICh1dWlkcy5sZW5ndGggIT09IGUxNjRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnUmV0dXJuZWQgc2V0IG9mIFVVSURzIGRpZCBub3QgbWF0Y2ggcmV0dXJuZWQgc2V0IG9mIGUxNjRzISdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcDxzdHJpbmcsIENEU1Jlc3BvbnNlRW50cnlUeXBlPigpO1xuXG4gICAgZm9yIChjb25zdCBbaSwgZTE2NF0gb2YgZTE2NHMuZW50cmllcygpKSB7XG4gICAgICBjb25zdCB1dWlkID0gdXVpZHNbaV07XG4gICAgICByZXN1bHQuc2V0KGUxNjQsIHtcbiAgICAgICAgYWNpOiB1bmRlZmluZWQsXG4gICAgICAgIHBuaTogdXVpZCA/IFVVSUQuY2FzdCh1dWlkKSA6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvL1xuICAvLyBQcml2YXRlXG4gIC8vXG5cbiAgcHJpdmF0ZSBhc3luYyBwdXRBdHRlc3RhdGlvbihhdXRoOiBDRFNBdXRoVHlwZSk6IFByb21pc2U8QXR0ZXN0YXRpb25NYXBUeXBlPiB7XG4gICAgY29uc3QgeyBwcml2S2V5LCBwdWJLZXkgfSA9IGdlbmVyYXRlS2V5UGFpcigpO1xuICAgIC8vIFJlbW92ZSBmaXJzdCBcImtleSB0eXBlXCIgYnl0ZSBmcm9tIHB1YmxpYyBrZXlcbiAgICBjb25zdCBzbGljZWRQdWJLZXkgPSBwdWJLZXkuc2xpY2UoMSk7XG4gICAgLy8gRG8gcmVxdWVzdFxuICAgIGNvbnN0IHsgY29va2llLCByZXNwb25zZUJvZHkgfSA9IGF3YWl0IHRoaXMub3B0aW9ucy5wdXRBdHRlc3RhdGlvbihcbiAgICAgIGF1dGgsXG4gICAgICBzbGljZWRQdWJLZXlcbiAgICApO1xuXG4gICAgY29uc3QgYXR0ZXN0YXRpb25zTGVuZ3RoID0gT2JqZWN0LmtleXMocmVzcG9uc2VCb2R5LmF0dGVzdGF0aW9ucykubGVuZ3RoO1xuICAgIGlmIChhdHRlc3RhdGlvbnNMZW5ndGggPiAzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdHb3QgbW9yZSB0aGFuIHRocmVlIGF0dGVzdGF0aW9ucyBmcm9tIHRoZSBDb250YWN0IERpc2NvdmVyeSBTZXJ2aWNlJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGF0dGVzdGF0aW9uc0xlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR290IG5vIGF0dGVzdGF0aW9ucyBmcm9tIHRoZSBDb250YWN0IERpc2NvdmVyeSBTZXJ2aWNlJyk7XG4gICAgfVxuXG4gICAgLy8gRGVjb2RlIHJlc3BvbnNlXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb2tpZSxcbiAgICAgIGF0dGVzdGF0aW9uczogYXdhaXQgcFByb3BzKFxuICAgICAgICByZXNwb25zZUJvZHkuYXR0ZXN0YXRpb25zLFxuICAgICAgICBhc3luYyBhdHRlc3RhdGlvbiA9PiB7XG4gICAgICAgICAgY29uc3QgZGVjb2RlZCA9IHtcbiAgICAgICAgICAgIC4uLmF0dGVzdGF0aW9uLFxuICAgICAgICAgICAgY2lwaGVydGV4dDogQnl0ZXMuZnJvbUJhc2U2NChhdHRlc3RhdGlvbi5jaXBoZXJ0ZXh0KSxcbiAgICAgICAgICAgIGl2OiBCeXRlcy5mcm9tQmFzZTY0KGF0dGVzdGF0aW9uLml2KSxcbiAgICAgICAgICAgIHF1b3RlOiBCeXRlcy5mcm9tQmFzZTY0KGF0dGVzdGF0aW9uLnF1b3RlKSxcbiAgICAgICAgICAgIHNlcnZlckVwaGVtZXJhbFB1YmxpYzogQnl0ZXMuZnJvbUJhc2U2NChcbiAgICAgICAgICAgICAgYXR0ZXN0YXRpb24uc2VydmVyRXBoZW1lcmFsUHVibGljXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc2VydmVyU3RhdGljUHVibGljOiBCeXRlcy5mcm9tQmFzZTY0KFxuICAgICAgICAgICAgICBhdHRlc3RhdGlvbi5zZXJ2ZXJTdGF0aWNQdWJsaWNcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBzaWduYXR1cmU6IEJ5dGVzLmZyb21CYXNlNjQoYXR0ZXN0YXRpb24uc2lnbmF0dXJlKSxcbiAgICAgICAgICAgIHRhZzogQnl0ZXMuZnJvbUJhc2U2NChhdHRlc3RhdGlvbi50YWcpLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBWYWxpZGF0ZSByZXNwb25zZVxuICAgICAgICAgIHRoaXMudmFsaWRhdGVBdHRlc3RhdGlvblF1b3RlKGRlY29kZWQpO1xuICAgICAgICAgIHZhbGlkYXRlQXR0ZXN0YXRpb25TaWduYXR1cmVCb2R5KFxuICAgICAgICAgICAgSlNPTi5wYXJzZShkZWNvZGVkLnNpZ25hdHVyZUJvZHkpLFxuICAgICAgICAgICAgYXR0ZXN0YXRpb24ucXVvdGVcbiAgICAgICAgICApO1xuICAgICAgICAgIGF3YWl0IHRoaXMudmFsaWRhdGVBdHRlc3RhdGlvblNpZ25hdHVyZShcbiAgICAgICAgICAgIGRlY29kZWQuc2lnbmF0dXJlLFxuICAgICAgICAgICAgZGVjb2RlZC5zaWduYXR1cmVCb2R5LFxuICAgICAgICAgICAgZGVjb2RlZC5jZXJ0aWZpY2F0ZXNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gRGVyaXZlIGtleVxuICAgICAgICAgIGNvbnN0IGVwaGVtZXJhbFRvRXBoZW1lcmFsID0gY2FsY3VsYXRlQWdyZWVtZW50KFxuICAgICAgICAgICAgZGVjb2RlZC5zZXJ2ZXJFcGhlbWVyYWxQdWJsaWMsXG4gICAgICAgICAgICBwcml2S2V5XG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBlcGhlbWVyYWxUb1N0YXRpYyA9IGNhbGN1bGF0ZUFncmVlbWVudChcbiAgICAgICAgICAgIGRlY29kZWQuc2VydmVyU3RhdGljUHVibGljLFxuICAgICAgICAgICAgcHJpdktleVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgbWFzdGVyU2VjcmV0ID0gQnl0ZXMuY29uY2F0ZW5hdGUoW1xuICAgICAgICAgICAgZXBoZW1lcmFsVG9FcGhlbWVyYWwsXG4gICAgICAgICAgICBlcGhlbWVyYWxUb1N0YXRpYyxcbiAgICAgICAgICBdKTtcbiAgICAgICAgICBjb25zdCBwdWJsaWNLZXlzID0gQnl0ZXMuY29uY2F0ZW5hdGUoW1xuICAgICAgICAgICAgc2xpY2VkUHViS2V5LFxuICAgICAgICAgICAgZGVjb2RlZC5zZXJ2ZXJFcGhlbWVyYWxQdWJsaWMsXG4gICAgICAgICAgICBkZWNvZGVkLnNlcnZlclN0YXRpY1B1YmxpYyxcbiAgICAgICAgICBdKTtcbiAgICAgICAgICBjb25zdCBbY2xpZW50S2V5LCBzZXJ2ZXJLZXldID0gZGVyaXZlU2VjcmV0cyhcbiAgICAgICAgICAgIG1hc3RlclNlY3JldCxcbiAgICAgICAgICAgIHB1YmxpY0tleXMsXG4gICAgICAgICAgICBuZXcgVWludDhBcnJheSgwKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBEZWNyeXB0IGNpcGhlcnRleHQgaW50byByZXF1ZXN0SWRcbiAgICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSBkZWNyeXB0QWVzR2NtKFxuICAgICAgICAgICAgc2VydmVyS2V5LFxuICAgICAgICAgICAgZGVjb2RlZC5pdixcbiAgICAgICAgICAgIEJ5dGVzLmNvbmNhdGVuYXRlKFtkZWNvZGVkLmNpcGhlcnRleHQsIGRlY29kZWQudGFnXSlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNsaWVudEtleSxcbiAgICAgICAgICAgIHNlcnZlcktleSxcbiAgICAgICAgICAgIHJlcXVlc3RJZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHZhbGlkYXRlQXR0ZXN0YXRpb25TaWduYXR1cmUoXG4gICAgc2lnbmF0dXJlOiBVaW50OEFycmF5LFxuICAgIHNpZ25hdHVyZUJvZHk6IHN0cmluZyxcbiAgICBjZXJ0aWZpY2F0ZXM6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBDRVJUX1BSRUZJWCA9ICctLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0nO1xuICAgIGNvbnN0IHBlbSA9IGNvbXBhY3QoXG4gICAgICBjZXJ0aWZpY2F0ZXMuc3BsaXQoQ0VSVF9QUkVGSVgpLm1hcChtYXRjaCA9PiB7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgJHtDRVJUX1BSRUZJWH0ke21hdGNofWA7XG4gICAgICB9KVxuICAgICk7XG4gICAgaWYgKHBlbS5sZW5ndGggPCAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGB2YWxpZGF0ZUF0dGVzdGF0aW9uU2lnbmF0dXJlOiBFeHBlY3QgdHdvIG9yIG1vcmUgZW50cmllczsgZ290ICR7cGVtLmxlbmd0aH1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcmlmeSA9IGNyZWF0ZVZlcmlmeSgnUlNBLVNIQTI1NicpO1xuICAgIHZlcmlmeS51cGRhdGUoQnVmZmVyLmZyb20oQnl0ZXMuZnJvbVN0cmluZyhzaWduYXR1cmVCb2R5KSkpO1xuICAgIGNvbnN0IGlzVmFsaWQgPSB2ZXJpZnkudmVyaWZ5KHBlbVswXSwgQnVmZmVyLmZyb20oc2lnbmF0dXJlKSk7XG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbGlkYXRpb24gb2Ygc2lnbmF0dXJlIGFjcm9zcyBzaWduYXR1cmVCb2R5IGZhaWxlZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYVN0b3JlID0gcGtpLmNyZWF0ZUNhU3RvcmUoW3RoaXMub3B0aW9ucy5kaXJlY3RvcnlUcnVzdEFuY2hvcl0pO1xuICAgIGNvbnN0IGNoYWluID0gY29tcGFjdChwZW0ubWFwKGNlcnQgPT4gcGtpLmNlcnRpZmljYXRlRnJvbVBlbShjZXJ0KSkpO1xuICAgIGNvbnN0IGlzQ2hhaW5WYWxpZCA9IHBraS52ZXJpZnlDZXJ0aWZpY2F0ZUNoYWluKGNhU3RvcmUsIGNoYWluKTtcbiAgICBpZiAoIWlzQ2hhaW5WYWxpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWxpZGF0aW9uIG9mIGNlcnRpZmljYXRlIGNoYWluIGZhaWxlZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBsZWFmQ2VydCA9IGNoYWluWzBdO1xuICAgIGNvbnN0IGZpZWxkQ04gPSBsZWFmQ2VydC5zdWJqZWN0LmdldEZpZWxkKCdDTicpO1xuICAgIGlmICghZmllbGRDTiB8fCBmaWVsZENOLnZhbHVlICE9PSAnSW50ZWwgU0dYIEF0dGVzdGF0aW9uIFJlcG9ydCBTaWduaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMZWFmIGNlcnQgQ04gZmllbGQgaGFkIHVuZXhwZWN0ZWQgdmFsdWUnKTtcbiAgICB9XG4gICAgY29uc3QgZmllbGRPID0gbGVhZkNlcnQuc3ViamVjdC5nZXRGaWVsZCgnTycpO1xuICAgIGlmICghZmllbGRPIHx8IGZpZWxkTy52YWx1ZSAhPT0gJ0ludGVsIENvcnBvcmF0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMZWFmIGNlcnQgTyBmaWVsZCBoYWQgdW5leHBlY3RlZCB2YWx1ZScpO1xuICAgIH1cbiAgICBjb25zdCBmaWVsZEwgPSBsZWFmQ2VydC5zdWJqZWN0LmdldEZpZWxkKCdMJyk7XG4gICAgaWYgKCFmaWVsZEwgfHwgZmllbGRMLnZhbHVlICE9PSAnU2FudGEgQ2xhcmEnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xlYWYgY2VydCBMIGZpZWxkIGhhZCB1bmV4cGVjdGVkIHZhbHVlJyk7XG4gICAgfVxuICAgIGNvbnN0IGZpZWxkU1QgPSBsZWFmQ2VydC5zdWJqZWN0LmdldEZpZWxkKCdTVCcpO1xuICAgIGlmICghZmllbGRTVCB8fCBmaWVsZFNULnZhbHVlICE9PSAnQ0EnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xlYWYgY2VydCBTVCBmaWVsZCBoYWQgdW5leHBlY3RlZCB2YWx1ZScpO1xuICAgIH1cbiAgICBjb25zdCBmaWVsZEMgPSBsZWFmQ2VydC5zdWJqZWN0LmdldEZpZWxkKCdDJyk7XG4gICAgaWYgKCFmaWVsZEMgfHwgZmllbGRDLnZhbHVlICE9PSAnVVMnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xlYWYgY2VydCBDIGZpZWxkIGhhZCB1bmV4cGVjdGVkIHZhbHVlJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUF0dGVzdGF0aW9uUXVvdGUoe1xuICAgIHNlcnZlclN0YXRpY1B1YmxpYyxcbiAgICBxdW90ZTogcXVvdGVCeXRlcyxcbiAgfToge1xuICAgIHNlcnZlclN0YXRpY1B1YmxpYzogVWludDhBcnJheTtcbiAgICBxdW90ZTogVWludDhBcnJheTtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IFNHWF9DT05TVEFOVFMgPSBnZXRTZ3hDb25zdGFudHMoKTtcbiAgICBjb25zdCBxdW90ZSA9IEJ1ZmZlci5mcm9tKHF1b3RlQnl0ZXMpO1xuXG4gICAgY29uc3QgcXVvdGVWZXJzaW9uID0gcXVvdGUucmVhZEludDE2TEUoMCkgJiAweGZmZmY7XG4gICAgaWYgKHF1b3RlVmVyc2lvbiA8IDAgfHwgcXVvdGVWZXJzaW9uID4gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHZlcnNpb24gJHtxdW90ZVZlcnNpb259YCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWlzY1NlbGVjdCA9IHF1b3RlLnNsaWNlKDY0LCA2NCArIDQpO1xuICAgIGlmICghbWlzY1NlbGVjdC5ldmVyeShieXRlID0+IGJ5dGUgPT09IDApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1F1b3RlIG1pc2NTZWxlY3QgaW52YWxpZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNlcnZlZDEgPSBxdW90ZS5zbGljZSg2OCwgNjggKyAyOCk7XG4gICAgaWYgKCFyZXNlcnZlZDEuZXZlcnkoYnl0ZSA9PiBieXRlID09PSAwKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdRdW90ZSByZXNlcnZlZDEgaW52YWxpZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBmbGFncyA9IExvbmcuZnJvbUJ5dGVzTEUoXG4gICAgICBBcnJheS5mcm9tKHF1b3RlLnNsaWNlKDk2LCA5NiArIDgpLnZhbHVlcygpKVxuICAgICk7XG4gICAgaWYgKFxuICAgICAgZmxhZ3MuYW5kKFNHWF9DT05TVEFOVFMuU0dYX0ZMQUdTX1JFU0VSVkVEKS5ub3RFcXVhbHMoMCkgfHxcbiAgICAgIGZsYWdzLmFuZChTR1hfQ09OU1RBTlRTLlNHWF9GTEFHU19JTklUVEVEKS5lcXVhbHMoMCkgfHxcbiAgICAgIGZsYWdzLmFuZChTR1hfQ09OU1RBTlRTLlNHWF9GTEFHU19NT0RFNjRCSVQpLmVxdWFscygwKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBRdW90ZSBmbGFncyBpbnZhbGlkICR7ZmxhZ3MudG9TdHJpbmcoKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB4ZnJtID0gTG9uZy5mcm9tQnl0ZXNMRShcbiAgICAgIEFycmF5LmZyb20ocXVvdGUuc2xpY2UoMTA0LCAxMDQgKyA4KS52YWx1ZXMoKSlcbiAgICApO1xuICAgIGlmICh4ZnJtLmFuZChTR1hfQ09OU1RBTlRTLlNHWF9YRlJNX1JFU0VSVkVEKS5ub3RFcXVhbHMoMCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUXVvdGUgeGZybSBpbnZhbGlkICR7eGZybX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBtcmVuY2xhdmUgPSBxdW90ZS5zbGljZSgxMTIsIDExMiArIDMyKTtcbiAgICBjb25zdCBlbmNsYXZlSWRCeXRlcyA9IEJ5dGVzLmZyb21IZXgodGhpcy5vcHRpb25zLmRpcmVjdG9yeUVuY2xhdmVJZCk7XG4gICAgaWYgKG1yZW5jbGF2ZS5jb21wYXJlKGVuY2xhdmVJZEJ5dGVzKSAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdRdW90ZSBtcmVuY2xhdmUgaW52YWxpZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNlcnZlZDIgPSBxdW90ZS5zbGljZSgxNDQsIDE0NCArIDMyKTtcbiAgICBpZiAoIXJlc2VydmVkMi5ldmVyeShieXRlID0+IGJ5dGUgPT09IDApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1F1b3RlIHJlc2VydmVkMiBpbnZhbGlkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcG9ydERhdGEgPSBxdW90ZS5zbGljZSgzNjgsIDM2OCArIDY0KTtcbiAgICBjb25zdCBzZXJ2ZXJTdGF0aWNQdWJsaWNCeXRlcyA9IHNlcnZlclN0YXRpY1B1YmxpYztcbiAgICBpZiAoXG4gICAgICAhcmVwb3J0RGF0YS5ldmVyeSgoYnl0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID49IDMyKSB7XG4gICAgICAgICAgcmV0dXJuIGJ5dGUgPT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ5dGUgPT09IHNlcnZlclN0YXRpY1B1YmxpY0J5dGVzW2luZGV4XTtcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1F1b3RlIHJlcG9ydF9kYXRhIGludmFsaWQhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXJ2ZWQzID0gcXVvdGUuc2xpY2UoMjA4LCAyMDggKyA5Nik7XG4gICAgaWYgKCFyZXNlcnZlZDMuZXZlcnkoYnl0ZSA9PiBieXRlID09PSAwKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdRdW90ZSByZXNlcnZlZDMgaW52YWxpZCEnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNlcnZlZDQgPSBxdW90ZS5zbGljZSgzMDgsIDMwOCArIDYwKTtcbiAgICBpZiAoIXJlc2VydmVkNC5ldmVyeShieXRlID0+IGJ5dGUgPT09IDApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1F1b3RlIHJlc2VydmVkNCBpbnZhbGlkIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHNpZ25hdHVyZUxlbmd0aCA9IHF1b3RlLnJlYWRJbnQzMkxFKDQzMikgPj4+IDA7XG4gICAgaWYgKHNpZ25hdHVyZUxlbmd0aCAhPT0gcXVvdGUuYnl0ZUxlbmd0aCAtIDQzNikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgc2lnbmF0dXJlTGVuZ3RoICR7c2lnbmF0dXJlTGVuZ3RofWApO1xuICAgIH1cblxuICAgIC8vIGNvbnN0IHNpZ25hdHVyZSA9IHF1b3RlLnNsaWNlKDQzNiwgNDM2ICsgc2lnbmF0dXJlTGVuZ3RoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dGVzdGF0aW9uU2lnbmF0dXJlQm9keShcbiAgc2lnbmF0dXJlQm9keToge1xuICAgIHRpbWVzdGFtcDogc3RyaW5nO1xuICAgIHZlcnNpb246IG51bWJlcjtcbiAgICBpc3ZFbmNsYXZlUXVvdGVCb2R5OiBzdHJpbmc7XG4gICAgaXN2RW5jbGF2ZVF1b3RlU3RhdHVzOiBzdHJpbmc7XG4gICAgYWR2aXNvcnlJRHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgfSxcbiAgZW5jb2RlZFF1b3RlOiBzdHJpbmdcbikge1xuICAvLyBQYXJzZSB0aW1lc3RhbXAgYXMgVVRDXG4gIGNvbnN0IHsgdGltZXN0YW1wIH0gPSBzaWduYXR1cmVCb2R5O1xuICBjb25zdCB1dGNUaW1lc3RhbXAgPSB0aW1lc3RhbXAuZW5kc1dpdGgoJ1onKSA/IHRpbWVzdGFtcCA6IGAke3RpbWVzdGFtcH1aYDtcbiAgY29uc3Qgc2lnbmF0dXJlVGltZSA9IG5ldyBEYXRlKHV0Y1RpbWVzdGFtcCkuZ2V0VGltZSgpO1xuXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGlmIChzaWduYXR1cmVCb2R5LnZlcnNpb24gIT09IDQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVzdGF0aW9uIHNpZ25hdHVyZSBpbnZhbGlkIHZlcnNpb24hJyk7XG4gIH1cbiAgaWYgKCFlbmNvZGVkUXVvdGUuc3RhcnRzV2l0aChzaWduYXR1cmVCb2R5LmlzdkVuY2xhdmVRdW90ZUJvZHkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlc3Rpb24gc2lnbmF0dXJlIG1pc21hdGNoZXMgcXVvdGUhJyk7XG4gIH1cbiAgaWYgKHNpZ25hdHVyZUJvZHkuaXN2RW5jbGF2ZVF1b3RlU3RhdHVzICE9PSAnU1dfSEFSREVOSU5HX05FRURFRCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVzdGF0aW9uIHNpZ25hdHVyZSBzdGF0dXMgbm90IFwiU1dfSEFSREVOSU5HX05FRURFRFwiIScpO1xuICB9XG4gIGlmIChcbiAgICBzaWduYXR1cmVCb2R5LmFkdmlzb3J5SURzLmxlbmd0aCAhPT0gMSB8fFxuICAgIHNpZ25hdHVyZUJvZHkuYWR2aXNvcnlJRHNbMF0gIT09ICdJTlRFTC1TQS0wMDMzNCdcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlc3RhdGlvbiBhZHZpc29yeSBpZHMgYXJlIGluY29ycmVjdCcpO1xuICB9XG4gIGlmIChzaWduYXR1cmVUaW1lIDwgbm93IC0gMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQXR0ZXN0YXRpb24gc2lnbmF0dXJlIHRpbWVzdGFtcCBvbGRlciB0aGFuIDI0IGhvdXJzIScpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEscUJBQW1CO0FBQ25CLG9CQUF3QjtBQUN4QixrQkFBaUI7QUFDakIsb0JBQTZCO0FBQzdCLHdCQUFvQjtBQUVwQixvQkFNTztBQUNQLG1CQUFvRDtBQUNwRCxZQUF1QjtBQUN2QixvQkFB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