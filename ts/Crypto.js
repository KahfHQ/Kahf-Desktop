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
var Crypto_exports = {};
__export(Crypto_exports, {
  CipherType: () => import_Crypto.CipherType,
  HashType: () => import_Crypto.HashType,
  PaddedLengths: () => PaddedLengths,
  bytesToUuid: () => bytesToUuid,
  computeHash: () => computeHash,
  constantTimeEqual: () => constantTimeEqual,
  decrypt: () => decrypt,
  decryptAes256CbcPkcsPadding: () => decryptAes256CbcPkcsPadding,
  decryptAesCtr: () => decryptAesCtr,
  decryptAesGcm: () => decryptAesGcm,
  decryptAttachment: () => decryptAttachment,
  decryptDeviceName: () => decryptDeviceName,
  decryptProfile: () => decryptProfile,
  decryptProfileName: () => decryptProfileName,
  decryptSymmetric: () => decryptSymmetric,
  deriveAccessKey: () => deriveAccessKey,
  deriveMasterKeyFromGroupV1: () => deriveMasterKeyFromGroupV1,
  deriveSecrets: () => deriveSecrets,
  deriveStickerPackKey: () => deriveStickerPackKey,
  deriveStorageItemKey: () => deriveStorageItemKey,
  deriveStorageManifestKey: () => deriveStorageManifestKey,
  encrypt: () => encrypt,
  encryptAes256CbcPkcsPadding: () => encryptAes256CbcPkcsPadding,
  encryptAesCtr: () => encryptAesCtr,
  encryptAesGcm: () => encryptAesGcm,
  encryptAttachment: () => encryptAttachment,
  encryptCdsDiscoveryRequest: () => encryptCdsDiscoveryRequest,
  encryptDeviceName: () => encryptDeviceName,
  encryptProfile: () => encryptProfile,
  encryptProfileItemWithPadding: () => encryptProfileItemWithPadding,
  encryptSymmetric: () => encryptSymmetric,
  generateRegistrationId: () => generateRegistrationId,
  getAccessKeyVerifier: () => getAccessKeyVerifier,
  getBytes: () => getBytes,
  getFirstBytes: () => getFirstBytes,
  getRandomBytes: () => getRandomBytes,
  getRandomValue: () => getRandomValue,
  getZeroes: () => getZeroes,
  hash: () => hash,
  highBitsToInt: () => highBitsToInt,
  hmacSha256: () => hmacSha256,
  intsToByteHighAndLow: () => intsToByteHighAndLow,
  sha256: () => sha256,
  sign: () => sign,
  splitUuids: () => splitUuids,
  trimForDisplay: () => trimForDisplay,
  uuidToBytes: () => import_uuidToBytes.uuidToBytes,
  verifyAccessKey: () => verifyAccessKey,
  verifyHmacSha256: () => verifyHmacSha256
});
module.exports = __toCommonJS(Crypto_exports);
var import_buffer = require("buffer");
var import_p_props = __toESM(require("p-props"));
var import_long = __toESM(require("long"));
var import_libsignal_client = require("@signalapp/libsignal-client");
var Bytes = __toESM(require("./Bytes"));
var import_Curve = require("./Curve");
var log = __toESM(require("./logging/log"));
var import_Crypto = require("./types/Crypto");
var import_errors = require("./types/errors");
var import_UUID = require("./types/UUID");
var import_uuidToBytes = require("./util/uuidToBytes");
const PROFILE_IV_LENGTH = 12;
const PROFILE_KEY_LENGTH = 32;
const PaddedLengths = {
  Name: [53, 257],
  About: [128, 254, 512],
  AboutEmoji: [32],
  PaymentAddress: [554]
};
function generateRegistrationId() {
  const bytes = getRandomBytes(2);
  const id = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2)[0];
  return id & 16383;
}
function deriveStickerPackKey(packKey) {
  const salt = getZeroes(32);
  const info = Bytes.fromString("Sticker Pack");
  const [part1, part2] = deriveSecrets(packKey, salt, info);
  return Bytes.concatenate([part1, part2]);
}
function deriveSecrets(input, salt, info) {
  const hkdf = import_libsignal_client.HKDF.new(3);
  const output = hkdf.deriveSecrets(3 * 32, import_buffer.Buffer.from(input), import_buffer.Buffer.from(info), import_buffer.Buffer.from(salt));
  return [output.slice(0, 32), output.slice(32, 64), output.slice(64, 96)];
}
function deriveMasterKeyFromGroupV1(groupV1Id) {
  const salt = getZeroes(32);
  const info = Bytes.fromString("GV2 Migration");
  const [part1] = deriveSecrets(groupV1Id, salt, info);
  return part1;
}
function computeHash(data) {
  return Bytes.toBase64(hash(import_Crypto.HashType.size512, data));
}
function encryptDeviceName(deviceName, identityPublic) {
  const plaintext = Bytes.fromString(deviceName);
  const ephemeralKeyPair = (0, import_Curve.generateKeyPair)();
  const masterSecret = (0, import_Curve.calculateAgreement)(identityPublic, ephemeralKeyPair.privKey);
  const key1 = hmacSha256(masterSecret, Bytes.fromString("auth"));
  const syntheticIv = getFirstBytes(hmacSha256(key1, plaintext), 16);
  const key2 = hmacSha256(masterSecret, Bytes.fromString("cipher"));
  const cipherKey = hmacSha256(key2, syntheticIv);
  const counter = getZeroes(16);
  const ciphertext = encryptAesCtr(cipherKey, plaintext, counter);
  return {
    ephemeralPublic: ephemeralKeyPair.pubKey,
    syntheticIv,
    ciphertext
  };
}
function decryptDeviceName({ ephemeralPublic, syntheticIv, ciphertext }, identityPrivate) {
  const masterSecret = (0, import_Curve.calculateAgreement)(ephemeralPublic, identityPrivate);
  const key2 = hmacSha256(masterSecret, Bytes.fromString("cipher"));
  const cipherKey = hmacSha256(key2, syntheticIv);
  const counter = getZeroes(16);
  const plaintext = decryptAesCtr(cipherKey, ciphertext, counter);
  const key1 = hmacSha256(masterSecret, Bytes.fromString("auth"));
  const ourSyntheticIv = getFirstBytes(hmacSha256(key1, plaintext), 16);
  if (!constantTimeEqual(ourSyntheticIv, syntheticIv)) {
    throw new Error("decryptDeviceName: synthetic IV did not match");
  }
  return Bytes.toString(plaintext);
}
function deriveStorageManifestKey(storageServiceKey, version = import_long.default.fromNumber(0)) {
  return hmacSha256(storageServiceKey, Bytes.fromString(`Manifest_${version}`));
}
function deriveStorageItemKey(storageServiceKey, itemID) {
  return hmacSha256(storageServiceKey, Bytes.fromString(`Item_${itemID}`));
}
function deriveAccessKey(profileKey) {
  const iv = getZeroes(12);
  const plaintext = getZeroes(16);
  const accessKey = encryptAesGcm(profileKey, iv, plaintext);
  return getFirstBytes(accessKey, 16);
}
function getAccessKeyVerifier(accessKey) {
  const plaintext = getZeroes(32);
  return hmacSha256(accessKey, plaintext);
}
function verifyAccessKey(accessKey, theirVerifier) {
  const ourVerifier = getAccessKeyVerifier(accessKey);
  if (constantTimeEqual(ourVerifier, theirVerifier)) {
    return true;
  }
  return false;
}
const IV_LENGTH = 16;
const MAC_LENGTH = 16;
const NONCE_LENGTH = 16;
function encryptSymmetric(key, plaintext) {
  const iv = getZeroes(IV_LENGTH);
  const nonce = getRandomBytes(NONCE_LENGTH);
  const cipherKey = hmacSha256(key, nonce);
  const macKey = hmacSha256(key, cipherKey);
  const ciphertext = encryptAes256CbcPkcsPadding(cipherKey, plaintext, iv);
  const mac = getFirstBytes(hmacSha256(macKey, ciphertext), MAC_LENGTH);
  return Bytes.concatenate([nonce, ciphertext, mac]);
}
function decryptSymmetric(key, data) {
  const iv = getZeroes(IV_LENGTH);
  const nonce = getFirstBytes(data, NONCE_LENGTH);
  const ciphertext = getBytes(data, NONCE_LENGTH, data.byteLength - NONCE_LENGTH - MAC_LENGTH);
  const theirMac = getBytes(data, data.byteLength - MAC_LENGTH, MAC_LENGTH);
  const cipherKey = hmacSha256(key, nonce);
  const macKey = hmacSha256(key, cipherKey);
  const ourMac = getFirstBytes(hmacSha256(macKey, ciphertext), MAC_LENGTH);
  if (!constantTimeEqual(theirMac, ourMac)) {
    throw new Error("decryptSymmetric: Failed to decrypt; MAC verification failed");
  }
  return decryptAes256CbcPkcsPadding(cipherKey, ciphertext, iv);
}
function hmacSha256(key, plaintext) {
  return sign(key, plaintext);
}
function verifyHmacSha256(plaintext, key, theirMac, length) {
  const ourMac = hmacSha256(key, plaintext);
  if (theirMac.byteLength !== length || ourMac.byteLength < length) {
    throw new Error("Bad MAC length");
  }
  let result = 0;
  for (let i = 0; i < theirMac.byteLength; i += 1) {
    result |= ourMac[i] ^ theirMac[i];
  }
  if (result !== 0) {
    throw new Error("Bad MAC");
  }
}
function encryptAes256CbcPkcsPadding(key, plaintext, iv) {
  return encrypt(import_Crypto.CipherType.AES256CBC, {
    key,
    plaintext,
    iv
  });
}
function decryptAes256CbcPkcsPadding(key, ciphertext, iv) {
  return decrypt(import_Crypto.CipherType.AES256CBC, {
    key,
    ciphertext,
    iv
  });
}
function encryptAesCtr(key, plaintext, counter) {
  return encrypt(import_Crypto.CipherType.AES256CTR, {
    key,
    plaintext,
    iv: counter
  });
}
function decryptAesCtr(key, ciphertext, counter) {
  return decrypt(import_Crypto.CipherType.AES256CTR, {
    key,
    ciphertext,
    iv: counter
  });
}
function encryptAesGcm(key, iv, plaintext, aad) {
  return encrypt(import_Crypto.CipherType.AES256GCM, {
    key,
    plaintext,
    iv,
    aad
  });
}
function decryptAesGcm(key, iv, ciphertext) {
  return decrypt(import_Crypto.CipherType.AES256GCM, {
    key,
    ciphertext,
    iv
  });
}
function sha256(data) {
  return hash(import_Crypto.HashType.size256, data);
}
function getRandomValue(low, high) {
  const diff = high - low;
  const bytes = getRandomBytes(1);
  const mod = diff + 1;
  return bytes[0] % mod + low;
}
function getZeroes(n) {
  return new Uint8Array(n);
}
function highBitsToInt(byte) {
  return (byte & 255) >> 4;
}
function intsToByteHighAndLow(highValue, lowValue) {
  return (highValue << 4 | lowValue) & 255;
}
function getFirstBytes(data, n) {
  return data.subarray(0, n);
}
function getBytes(data, start, n) {
  return data.subarray(start, start + n);
}
function _getMacAndData(ciphertext) {
  const dataLength = ciphertext.byteLength - MAC_LENGTH;
  const data = getBytes(ciphertext, 0, dataLength);
  const mac = getBytes(ciphertext, dataLength, MAC_LENGTH);
  return { data, mac };
}
async function encryptCdsDiscoveryRequest(attestations, phoneNumbers) {
  const nonce = getRandomBytes(32);
  const numbersArray = import_buffer.Buffer.concat(phoneNumbers.map((number) => {
    return new Uint8Array(import_long.default.fromString(number).toBytesBE());
  }));
  const queryDataPlaintext = Bytes.concatenate([nonce, numbersArray]);
  const queryDataKey = getRandomBytes(32);
  const commitment = sha256(queryDataPlaintext);
  const iv = getRandomBytes(12);
  const queryDataCiphertext = encryptAesGcm(queryDataKey, iv, queryDataPlaintext);
  const { data: queryDataCiphertextData, mac: queryDataCiphertextMac } = _getMacAndData(queryDataCiphertext);
  const envelopes = await (0, import_p_props.default)(attestations, async ({ clientKey, requestId }) => {
    const envelopeIv = getRandomBytes(12);
    const ciphertext = encryptAesGcm(clientKey, envelopeIv, queryDataKey, requestId);
    const { data, mac } = _getMacAndData(ciphertext);
    return {
      requestId: Bytes.toBase64(requestId),
      data: Bytes.toBase64(data),
      iv: Bytes.toBase64(envelopeIv),
      mac: Bytes.toBase64(mac)
    };
  });
  return {
    addressCount: phoneNumbers.length,
    commitment: Bytes.toBase64(commitment),
    data: Bytes.toBase64(queryDataCiphertextData),
    iv: Bytes.toBase64(iv),
    mac: Bytes.toBase64(queryDataCiphertextMac),
    envelopes
  };
}
function bytesToUuid(bytes) {
  if (bytes.byteLength !== import_UUID.UUID_BYTE_SIZE) {
    log.warn("bytesToUuid: received an Uint8Array of invalid length. Returning undefined");
    return void 0;
  }
  const uuids = splitUuids(bytes);
  if (uuids.length === 1) {
    return uuids[0] || void 0;
  }
  return void 0;
}
function splitUuids(buffer) {
  const uuids = new Array();
  for (let i = 0; i < buffer.byteLength; i += import_UUID.UUID_BYTE_SIZE) {
    const bytes = getBytes(buffer, i, import_UUID.UUID_BYTE_SIZE);
    const hex = Bytes.toHex(bytes);
    const chunks = [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20)
    ];
    const uuid = chunks.join("-");
    if (uuid !== "00000000-0000-0000-0000-000000000000") {
      uuids.push(import_UUID.UUID.cast(uuid));
    } else {
      uuids.push(null);
    }
  }
  return uuids;
}
function trimForDisplay(padded) {
  let paddingEnd = 0;
  for (paddingEnd; paddingEnd < padded.length; paddingEnd += 1) {
    if (padded[paddingEnd] === 0) {
      break;
    }
  }
  return padded.slice(0, paddingEnd);
}
function verifyDigest(data, theirDigest) {
  const ourDigest = sha256(data);
  let result = 0;
  for (let i = 0; i < theirDigest.byteLength; i += 1) {
    result |= ourDigest[i] ^ theirDigest[i];
  }
  if (result !== 0) {
    throw new Error("Bad digest");
  }
}
function decryptAttachment(encryptedBin, keys, theirDigest) {
  if (keys.byteLength !== 64) {
    throw new Error("Got invalid length attachment keys");
  }
  if (encryptedBin.byteLength < 16 + 32) {
    throw new Error("Got invalid length attachment");
  }
  const aesKey = keys.slice(0, 32);
  const macKey = keys.slice(32, 64);
  const iv = encryptedBin.slice(0, 16);
  const ciphertext = encryptedBin.slice(16, encryptedBin.byteLength - 32);
  const ivAndCiphertext = encryptedBin.slice(0, encryptedBin.byteLength - 32);
  const mac = encryptedBin.slice(encryptedBin.byteLength - 32, encryptedBin.byteLength);
  verifyHmacSha256(ivAndCiphertext, macKey, mac, 32);
  if (theirDigest) {
    verifyDigest(encryptedBin, theirDigest);
  }
  return decryptAes256CbcPkcsPadding(aesKey, ciphertext, iv);
}
function encryptAttachment(plaintext, keys, iv) {
  if (!(plaintext instanceof Uint8Array)) {
    throw new TypeError(`\`plaintext\` must be an \`Uint8Array\`; got: ${typeof plaintext}`);
  }
  if (keys.byteLength !== 64) {
    throw new Error("Got invalid length attachment keys");
  }
  if (iv.byteLength !== 16) {
    throw new Error("Got invalid length attachment iv");
  }
  const aesKey = keys.slice(0, 32);
  const macKey = keys.slice(32, 64);
  const ciphertext = encryptAes256CbcPkcsPadding(aesKey, plaintext, iv);
  const ivAndCiphertext = Bytes.concatenate([iv, ciphertext]);
  const mac = hmacSha256(macKey, ivAndCiphertext);
  const encryptedBin = Bytes.concatenate([ivAndCiphertext, mac]);
  const digest = sha256(encryptedBin);
  return {
    ciphertext: encryptedBin,
    digest
  };
}
function encryptProfile(data, key) {
  const iv = getRandomBytes(PROFILE_IV_LENGTH);
  if (key.byteLength !== PROFILE_KEY_LENGTH) {
    throw new Error("Got invalid length profile key");
  }
  if (iv.byteLength !== PROFILE_IV_LENGTH) {
    throw new Error("Got invalid length profile iv");
  }
  const ciphertext = encryptAesGcm(key, iv, data);
  return Bytes.concatenate([iv, ciphertext]);
}
function decryptProfile(data, key) {
  if (data.byteLength < 12 + 16 + 1) {
    throw new Error(`Got too short input: ${data.byteLength}`);
  }
  const iv = data.slice(0, PROFILE_IV_LENGTH);
  const ciphertext = data.slice(PROFILE_IV_LENGTH, data.byteLength);
  if (key.byteLength !== PROFILE_KEY_LENGTH) {
    throw new Error("Got invalid length profile key");
  }
  if (iv.byteLength !== PROFILE_IV_LENGTH) {
    throw new Error("Got invalid length profile iv");
  }
  try {
    return decryptAesGcm(key, iv, ciphertext);
  } catch (_) {
    throw new import_errors.ProfileDecryptError("Failed to decrypt profile data. Most likely the profile key has changed.");
  }
}
function encryptProfileItemWithPadding(item, profileKey, paddedLengths) {
  const paddedLength = paddedLengths.find((length) => item.byteLength <= length);
  if (!paddedLength) {
    throw new Error("Oversized value");
  }
  const padded = new Uint8Array(paddedLength);
  padded.set(new Uint8Array(item));
  return encryptProfile(padded, profileKey);
}
function decryptProfileName(encryptedProfileName, key) {
  const data = Bytes.fromBase64(encryptedProfileName);
  const padded = decryptProfile(data, key);
  let givenEnd;
  for (givenEnd = 0; givenEnd < padded.length; givenEnd += 1) {
    if (padded[givenEnd] === 0) {
      break;
    }
  }
  let familyEnd;
  for (familyEnd = givenEnd + 1; familyEnd < padded.length; familyEnd += 1) {
    if (padded[familyEnd] === 0) {
      break;
    }
  }
  const foundFamilyName = familyEnd > givenEnd + 1;
  return {
    given: padded.slice(0, givenEnd),
    family: foundFamilyName ? padded.slice(givenEnd + 1, familyEnd) : null
  };
}
const { crypto } = window.SignalContext;
function sign(key, data) {
  return crypto.sign(key, data);
}
function hash(type, data) {
  return crypto.hash(type, data);
}
function encrypt(...args) {
  return crypto.encrypt(...args);
}
function decrypt(...args) {
  return crypto.decrypt(...args);
}
function getRandomBytes(size) {
  return crypto.getRandomBytes(size);
}
function constantTimeEqual(left, right) {
  return crypto.constantTimeEqual(left, right);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CipherType,
  HashType,
  PaddedLengths,
  bytesToUuid,
  computeHash,
  constantTimeEqual,
  decrypt,
  decryptAes256CbcPkcsPadding,
  decryptAesCtr,
  decryptAesGcm,
  decryptAttachment,
  decryptDeviceName,
  decryptProfile,
  decryptProfileName,
  decryptSymmetric,
  deriveAccessKey,
  deriveMasterKeyFromGroupV1,
  deriveSecrets,
  deriveStickerPackKey,
  deriveStorageItemKey,
  deriveStorageManifestKey,
  encrypt,
  encryptAes256CbcPkcsPadding,
  encryptAesCtr,
  encryptAesGcm,
  encryptAttachment,
  encryptCdsDiscoveryRequest,
  encryptDeviceName,
  encryptProfile,
  encryptProfileItemWithPadding,
  encryptSymmetric,
  generateRegistrationId,
  getAccessKeyVerifier,
  getBytes,
  getFirstBytes,
  getRandomBytes,
  getRandomValue,
  getZeroes,
  hash,
  highBitsToInt,
  hmacSha256,
  intsToByteHighAndLow,
  sha256,
  sign,
  splitUuids,
  trimForDisplay,
  uuidToBytes,
  verifyAccessKey,
  verifyHmacSha256
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ3J5cHRvLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcbmltcG9ydCBwUHJvcHMgZnJvbSAncC1wcm9wcyc7XG5pbXBvcnQgTG9uZyBmcm9tICdsb25nJztcbmltcG9ydCB7IEhLREYgfSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuXG5pbXBvcnQgKiBhcyBCeXRlcyBmcm9tICcuL0J5dGVzJztcbmltcG9ydCB7IGNhbGN1bGF0ZUFncmVlbWVudCwgZ2VuZXJhdGVLZXlQYWlyIH0gZnJvbSAnLi9DdXJ2ZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBIYXNoVHlwZSwgQ2lwaGVyVHlwZSB9IGZyb20gJy4vdHlwZXMvQ3J5cHRvJztcbmltcG9ydCB7IFByb2ZpbGVEZWNyeXB0RXJyb3IgfSBmcm9tICcuL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBVVUlELCBVVUlEX0JZVEVfU0laRSB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi90eXBlcy9VVUlEJztcblxuZXhwb3J0IHsgdXVpZFRvQnl0ZXMgfSBmcm9tICcuL3V0aWwvdXVpZFRvQnl0ZXMnO1xuXG5leHBvcnQgeyBIYXNoVHlwZSwgQ2lwaGVyVHlwZSB9O1xuXG5jb25zdCBQUk9GSUxFX0lWX0xFTkdUSCA9IDEyOyAvLyBieXRlc1xuY29uc3QgUFJPRklMRV9LRVlfTEVOR1RIID0gMzI7IC8vIGJ5dGVzXG5cbi8vIGJ5dGVzXG5leHBvcnQgY29uc3QgUGFkZGVkTGVuZ3RocyA9IHtcbiAgTmFtZTogWzUzLCAyNTddLFxuICBBYm91dDogWzEyOCwgMjU0LCA1MTJdLFxuICBBYm91dEVtb2ppOiBbMzJdLFxuICBQYXltZW50QWRkcmVzczogWzU1NF0sXG59O1xuXG5leHBvcnQgdHlwZSBFbmNyeXB0ZWRBdHRhY2htZW50ID0ge1xuICBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5O1xuICBkaWdlc3Q6IFVpbnQ4QXJyYXk7XG59O1xuXG4vLyBHZW5lcmF0ZSBhIG51bWJlciBiZXR3ZWVuIHplcm8gYW5kIDE2MzgzXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVSZWdpc3RyYXRpb25JZCgpOiBudW1iZXIge1xuICBjb25zdCBieXRlcyA9IGdldFJhbmRvbUJ5dGVzKDIpO1xuICBjb25zdCBpZCA9IG5ldyBVaW50MTZBcnJheShcbiAgICBieXRlcy5idWZmZXIsXG4gICAgYnl0ZXMuYnl0ZU9mZnNldCxcbiAgICBieXRlcy5ieXRlTGVuZ3RoIC8gMlxuICApWzBdO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gIHJldHVybiBpZCAmIDB4M2ZmZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVN0aWNrZXJQYWNrS2V5KHBhY2tLZXk6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgY29uc3Qgc2FsdCA9IGdldFplcm9lcygzMik7XG4gIGNvbnN0IGluZm8gPSBCeXRlcy5mcm9tU3RyaW5nKCdTdGlja2VyIFBhY2snKTtcblxuICBjb25zdCBbcGFydDEsIHBhcnQyXSA9IGRlcml2ZVNlY3JldHMocGFja0tleSwgc2FsdCwgaW5mbyk7XG5cbiAgcmV0dXJuIEJ5dGVzLmNvbmNhdGVuYXRlKFtwYXJ0MSwgcGFydDJdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVNlY3JldHMoXG4gIGlucHV0OiBVaW50OEFycmF5LFxuICBzYWx0OiBVaW50OEFycmF5LFxuICBpbmZvOiBVaW50OEFycmF5XG4pOiBbVWludDhBcnJheSwgVWludDhBcnJheSwgVWludDhBcnJheV0ge1xuICBjb25zdCBoa2RmID0gSEtERi5uZXcoMyk7XG4gIGNvbnN0IG91dHB1dCA9IGhrZGYuZGVyaXZlU2VjcmV0cyhcbiAgICAzICogMzIsXG4gICAgQnVmZmVyLmZyb20oaW5wdXQpLFxuICAgIEJ1ZmZlci5mcm9tKGluZm8pLFxuICAgIEJ1ZmZlci5mcm9tKHNhbHQpXG4gICk7XG4gIHJldHVybiBbb3V0cHV0LnNsaWNlKDAsIDMyKSwgb3V0cHV0LnNsaWNlKDMyLCA2NCksIG91dHB1dC5zbGljZSg2NCwgOTYpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZU1hc3RlcktleUZyb21Hcm91cFYxKGdyb3VwVjFJZDogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBzYWx0ID0gZ2V0WmVyb2VzKDMyKTtcbiAgY29uc3QgaW5mbyA9IEJ5dGVzLmZyb21TdHJpbmcoJ0dWMiBNaWdyYXRpb24nKTtcblxuICBjb25zdCBbcGFydDFdID0gZGVyaXZlU2VjcmV0cyhncm91cFYxSWQsIHNhbHQsIGluZm8pO1xuXG4gIHJldHVybiBwYXJ0MTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVIYXNoKGRhdGE6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICByZXR1cm4gQnl0ZXMudG9CYXNlNjQoaGFzaChIYXNoVHlwZS5zaXplNTEyLCBkYXRhKSk7XG59XG5cbi8vIEhpZ2gtbGV2ZWwgT3BlcmF0aW9uc1xuXG5leHBvcnQgdHlwZSBFbmNyeXB0ZWREZXZpY2VOYW1lID0ge1xuICBlcGhlbWVyYWxQdWJsaWM6IFVpbnQ4QXJyYXk7XG4gIHN5bnRoZXRpY0l2OiBVaW50OEFycmF5O1xuICBjaXBoZXJ0ZXh0OiBVaW50OEFycmF5O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHREZXZpY2VOYW1lKFxuICBkZXZpY2VOYW1lOiBzdHJpbmcsXG4gIGlkZW50aXR5UHVibGljOiBVaW50OEFycmF5XG4pOiBFbmNyeXB0ZWREZXZpY2VOYW1lIHtcbiAgY29uc3QgcGxhaW50ZXh0ID0gQnl0ZXMuZnJvbVN0cmluZyhkZXZpY2VOYW1lKTtcbiAgY29uc3QgZXBoZW1lcmFsS2V5UGFpciA9IGdlbmVyYXRlS2V5UGFpcigpO1xuICBjb25zdCBtYXN0ZXJTZWNyZXQgPSBjYWxjdWxhdGVBZ3JlZW1lbnQoXG4gICAgaWRlbnRpdHlQdWJsaWMsXG4gICAgZXBoZW1lcmFsS2V5UGFpci5wcml2S2V5XG4gICk7XG5cbiAgY29uc3Qga2V5MSA9IGhtYWNTaGEyNTYobWFzdGVyU2VjcmV0LCBCeXRlcy5mcm9tU3RyaW5nKCdhdXRoJykpO1xuICBjb25zdCBzeW50aGV0aWNJdiA9IGdldEZpcnN0Qnl0ZXMoaG1hY1NoYTI1NihrZXkxLCBwbGFpbnRleHQpLCAxNik7XG5cbiAgY29uc3Qga2V5MiA9IGhtYWNTaGEyNTYobWFzdGVyU2VjcmV0LCBCeXRlcy5mcm9tU3RyaW5nKCdjaXBoZXInKSk7XG4gIGNvbnN0IGNpcGhlcktleSA9IGhtYWNTaGEyNTYoa2V5Miwgc3ludGhldGljSXYpO1xuXG4gIGNvbnN0IGNvdW50ZXIgPSBnZXRaZXJvZXMoMTYpO1xuICBjb25zdCBjaXBoZXJ0ZXh0ID0gZW5jcnlwdEFlc0N0cihjaXBoZXJLZXksIHBsYWludGV4dCwgY291bnRlcik7XG5cbiAgcmV0dXJuIHtcbiAgICBlcGhlbWVyYWxQdWJsaWM6IGVwaGVtZXJhbEtleVBhaXIucHViS2V5LFxuICAgIHN5bnRoZXRpY0l2LFxuICAgIGNpcGhlcnRleHQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0RGV2aWNlTmFtZShcbiAgeyBlcGhlbWVyYWxQdWJsaWMsIHN5bnRoZXRpY0l2LCBjaXBoZXJ0ZXh0IH06IEVuY3J5cHRlZERldmljZU5hbWUsXG4gIGlkZW50aXR5UHJpdmF0ZTogVWludDhBcnJheVxuKTogc3RyaW5nIHtcbiAgY29uc3QgbWFzdGVyU2VjcmV0ID0gY2FsY3VsYXRlQWdyZWVtZW50KGVwaGVtZXJhbFB1YmxpYywgaWRlbnRpdHlQcml2YXRlKTtcblxuICBjb25zdCBrZXkyID0gaG1hY1NoYTI1NihtYXN0ZXJTZWNyZXQsIEJ5dGVzLmZyb21TdHJpbmcoJ2NpcGhlcicpKTtcbiAgY29uc3QgY2lwaGVyS2V5ID0gaG1hY1NoYTI1NihrZXkyLCBzeW50aGV0aWNJdik7XG5cbiAgY29uc3QgY291bnRlciA9IGdldFplcm9lcygxNik7XG4gIGNvbnN0IHBsYWludGV4dCA9IGRlY3J5cHRBZXNDdHIoY2lwaGVyS2V5LCBjaXBoZXJ0ZXh0LCBjb3VudGVyKTtcblxuICBjb25zdCBrZXkxID0gaG1hY1NoYTI1NihtYXN0ZXJTZWNyZXQsIEJ5dGVzLmZyb21TdHJpbmcoJ2F1dGgnKSk7XG4gIGNvbnN0IG91clN5bnRoZXRpY0l2ID0gZ2V0Rmlyc3RCeXRlcyhobWFjU2hhMjU2KGtleTEsIHBsYWludGV4dCksIDE2KTtcblxuICBpZiAoIWNvbnN0YW50VGltZUVxdWFsKG91clN5bnRoZXRpY0l2LCBzeW50aGV0aWNJdikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY3J5cHREZXZpY2VOYW1lOiBzeW50aGV0aWMgSVYgZGlkIG5vdCBtYXRjaCcpO1xuICB9XG5cbiAgcmV0dXJuIEJ5dGVzLnRvU3RyaW5nKHBsYWludGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVTdG9yYWdlTWFuaWZlc3RLZXkoXG4gIHN0b3JhZ2VTZXJ2aWNlS2V5OiBVaW50OEFycmF5LFxuICB2ZXJzaW9uOiBMb25nID0gTG9uZy5mcm9tTnVtYmVyKDApXG4pOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGhtYWNTaGEyNTYoc3RvcmFnZVNlcnZpY2VLZXksIEJ5dGVzLmZyb21TdHJpbmcoYE1hbmlmZXN0XyR7dmVyc2lvbn1gKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVTdG9yYWdlSXRlbUtleShcbiAgc3RvcmFnZVNlcnZpY2VLZXk6IFVpbnQ4QXJyYXksXG4gIGl0ZW1JRDogc3RyaW5nXG4pOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGhtYWNTaGEyNTYoc3RvcmFnZVNlcnZpY2VLZXksIEJ5dGVzLmZyb21TdHJpbmcoYEl0ZW1fJHtpdGVtSUR9YCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlQWNjZXNzS2V5KHByb2ZpbGVLZXk6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgY29uc3QgaXYgPSBnZXRaZXJvZXMoMTIpO1xuICBjb25zdCBwbGFpbnRleHQgPSBnZXRaZXJvZXMoMTYpO1xuICBjb25zdCBhY2Nlc3NLZXkgPSBlbmNyeXB0QWVzR2NtKHByb2ZpbGVLZXksIGl2LCBwbGFpbnRleHQpO1xuXG4gIHJldHVybiBnZXRGaXJzdEJ5dGVzKGFjY2Vzc0tleSwgMTYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWNjZXNzS2V5VmVyaWZpZXIoYWNjZXNzS2V5OiBVaW50OEFycmF5KTogVWludDhBcnJheSB7XG4gIGNvbnN0IHBsYWludGV4dCA9IGdldFplcm9lcygzMik7XG5cbiAgcmV0dXJuIGhtYWNTaGEyNTYoYWNjZXNzS2V5LCBwbGFpbnRleHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5QWNjZXNzS2V5KFxuICBhY2Nlc3NLZXk6IFVpbnQ4QXJyYXksXG4gIHRoZWlyVmVyaWZpZXI6IFVpbnQ4QXJyYXlcbik6IGJvb2xlYW4ge1xuICBjb25zdCBvdXJWZXJpZmllciA9IGdldEFjY2Vzc0tleVZlcmlmaWVyKGFjY2Vzc0tleSk7XG5cbiAgaWYgKGNvbnN0YW50VGltZUVxdWFsKG91clZlcmlmaWVyLCB0aGVpclZlcmlmaWVyKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBJVl9MRU5HVEggPSAxNjtcbmNvbnN0IE1BQ19MRU5HVEggPSAxNjtcbmNvbnN0IE5PTkNFX0xFTkdUSCA9IDE2O1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdFN5bW1ldHJpYyhcbiAga2V5OiBVaW50OEFycmF5LFxuICBwbGFpbnRleHQ6IFVpbnQ4QXJyYXlcbik6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBpdiA9IGdldFplcm9lcyhJVl9MRU5HVEgpO1xuICBjb25zdCBub25jZSA9IGdldFJhbmRvbUJ5dGVzKE5PTkNFX0xFTkdUSCk7XG5cbiAgY29uc3QgY2lwaGVyS2V5ID0gaG1hY1NoYTI1NihrZXksIG5vbmNlKTtcbiAgY29uc3QgbWFjS2V5ID0gaG1hY1NoYTI1NihrZXksIGNpcGhlcktleSk7XG5cbiAgY29uc3QgY2lwaGVydGV4dCA9IGVuY3J5cHRBZXMyNTZDYmNQa2NzUGFkZGluZyhjaXBoZXJLZXksIHBsYWludGV4dCwgaXYpO1xuICBjb25zdCBtYWMgPSBnZXRGaXJzdEJ5dGVzKGhtYWNTaGEyNTYobWFjS2V5LCBjaXBoZXJ0ZXh0KSwgTUFDX0xFTkdUSCk7XG5cbiAgcmV0dXJuIEJ5dGVzLmNvbmNhdGVuYXRlKFtub25jZSwgY2lwaGVydGV4dCwgbWFjXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0U3ltbWV0cmljKFxuICBrZXk6IFVpbnQ4QXJyYXksXG4gIGRhdGE6IFVpbnQ4QXJyYXlcbik6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBpdiA9IGdldFplcm9lcyhJVl9MRU5HVEgpO1xuXG4gIGNvbnN0IG5vbmNlID0gZ2V0Rmlyc3RCeXRlcyhkYXRhLCBOT05DRV9MRU5HVEgpO1xuICBjb25zdCBjaXBoZXJ0ZXh0ID0gZ2V0Qnl0ZXMoXG4gICAgZGF0YSxcbiAgICBOT05DRV9MRU5HVEgsXG4gICAgZGF0YS5ieXRlTGVuZ3RoIC0gTk9OQ0VfTEVOR1RIIC0gTUFDX0xFTkdUSFxuICApO1xuICBjb25zdCB0aGVpck1hYyA9IGdldEJ5dGVzKGRhdGEsIGRhdGEuYnl0ZUxlbmd0aCAtIE1BQ19MRU5HVEgsIE1BQ19MRU5HVEgpO1xuXG4gIGNvbnN0IGNpcGhlcktleSA9IGhtYWNTaGEyNTYoa2V5LCBub25jZSk7XG4gIGNvbnN0IG1hY0tleSA9IGhtYWNTaGEyNTYoa2V5LCBjaXBoZXJLZXkpO1xuXG4gIGNvbnN0IG91ck1hYyA9IGdldEZpcnN0Qnl0ZXMoaG1hY1NoYTI1NihtYWNLZXksIGNpcGhlcnRleHQpLCBNQUNfTEVOR1RIKTtcbiAgaWYgKCFjb25zdGFudFRpbWVFcXVhbCh0aGVpck1hYywgb3VyTWFjKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdkZWNyeXB0U3ltbWV0cmljOiBGYWlsZWQgdG8gZGVjcnlwdDsgTUFDIHZlcmlmaWNhdGlvbiBmYWlsZWQnXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBkZWNyeXB0QWVzMjU2Q2JjUGtjc1BhZGRpbmcoY2lwaGVyS2V5LCBjaXBoZXJ0ZXh0LCBpdik7XG59XG5cbi8vIEVuY3J5cHRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIGhtYWNTaGEyNTYoa2V5OiBVaW50OEFycmF5LCBwbGFpbnRleHQ6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIHNpZ24oa2V5LCBwbGFpbnRleHQpO1xufVxuXG4vLyBXZSB1c2UgcGFydCBvZiB0aGUgY29uc3RhbnRUaW1lRXF1YWwgYWxnb3JpdGhtIGZyb20gYmVsb3cgaGVyZSwgYnV0IHdlIGFsbG93IG91ck1hY1xuLy8gICB0byBiZSBsb25nZXIgdGhhbiB0aGUgcGFzc2VkLWluIGxlbmd0aC4gVGhpcyBhbGxvd3MgZWFzeSBjb21wYXJpc29ucyBhZ2FpbnN0XG4vLyAgIGFyYml0cmFyeSBNQUMgbGVuZ3Rocy5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlIbWFjU2hhMjU2KFxuICBwbGFpbnRleHQ6IFVpbnQ4QXJyYXksXG4gIGtleTogVWludDhBcnJheSxcbiAgdGhlaXJNYWM6IFVpbnQ4QXJyYXksXG4gIGxlbmd0aDogbnVtYmVyXG4pOiB2b2lkIHtcbiAgY29uc3Qgb3VyTWFjID0gaG1hY1NoYTI1NihrZXksIHBsYWludGV4dCk7XG5cbiAgaWYgKHRoZWlyTWFjLmJ5dGVMZW5ndGggIT09IGxlbmd0aCB8fCBvdXJNYWMuYnl0ZUxlbmd0aCA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQmFkIE1BQyBsZW5ndGgnKTtcbiAgfVxuICBsZXQgcmVzdWx0ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoZWlyTWFjLmJ5dGVMZW5ndGg7IGkgKz0gMSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgcmVzdWx0IHw9IG91ck1hY1tpXSBeIHRoZWlyTWFjW2ldO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBNQUMnKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdEFlczI1NkNiY1BrY3NQYWRkaW5nKFxuICBrZXk6IFVpbnQ4QXJyYXksXG4gIHBsYWludGV4dDogVWludDhBcnJheSxcbiAgaXY6IFVpbnQ4QXJyYXlcbik6IFVpbnQ4QXJyYXkge1xuICByZXR1cm4gZW5jcnlwdChDaXBoZXJUeXBlLkFFUzI1NkNCQywge1xuICAgIGtleSxcbiAgICBwbGFpbnRleHQsXG4gICAgaXYsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdEFlczI1NkNiY1BrY3NQYWRkaW5nKFxuICBrZXk6IFVpbnQ4QXJyYXksXG4gIGNpcGhlcnRleHQ6IFVpbnQ4QXJyYXksXG4gIGl2OiBVaW50OEFycmF5XG4pOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGRlY3J5cHQoQ2lwaGVyVHlwZS5BRVMyNTZDQkMsIHtcbiAgICBrZXksXG4gICAgY2lwaGVydGV4dCxcbiAgICBpdixcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0QWVzQ3RyKFxuICBrZXk6IFVpbnQ4QXJyYXksXG4gIHBsYWludGV4dDogVWludDhBcnJheSxcbiAgY291bnRlcjogVWludDhBcnJheVxuKTogVWludDhBcnJheSB7XG4gIHJldHVybiBlbmNyeXB0KENpcGhlclR5cGUuQUVTMjU2Q1RSLCB7XG4gICAga2V5LFxuICAgIHBsYWludGV4dCxcbiAgICBpdjogY291bnRlcixcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0QWVzQ3RyKFxuICBrZXk6IFVpbnQ4QXJyYXksXG4gIGNpcGhlcnRleHQ6IFVpbnQ4QXJyYXksXG4gIGNvdW50ZXI6IFVpbnQ4QXJyYXlcbik6IFVpbnQ4QXJyYXkge1xuICByZXR1cm4gZGVjcnlwdChDaXBoZXJUeXBlLkFFUzI1NkNUUiwge1xuICAgIGtleSxcbiAgICBjaXBoZXJ0ZXh0LFxuICAgIGl2OiBjb3VudGVyLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRBZXNHY20oXG4gIGtleTogVWludDhBcnJheSxcbiAgaXY6IFVpbnQ4QXJyYXksXG4gIHBsYWludGV4dDogVWludDhBcnJheSxcbiAgYWFkPzogVWludDhBcnJheVxuKTogVWludDhBcnJheSB7XG4gIHJldHVybiBlbmNyeXB0KENpcGhlclR5cGUuQUVTMjU2R0NNLCB7XG4gICAga2V5LFxuICAgIHBsYWludGV4dCxcbiAgICBpdixcbiAgICBhYWQsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdEFlc0djbShcbiAga2V5OiBVaW50OEFycmF5LFxuICBpdjogVWludDhBcnJheSxcbiAgY2lwaGVydGV4dDogVWludDhBcnJheVxuKTogVWludDhBcnJheSB7XG4gIHJldHVybiBkZWNyeXB0KENpcGhlclR5cGUuQUVTMjU2R0NNLCB7XG4gICAga2V5LFxuICAgIGNpcGhlcnRleHQsXG4gICAgaXYsXG4gIH0pO1xufVxuXG4vLyBIYXNoaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBzaGEyNTYoZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICByZXR1cm4gaGFzaChIYXNoVHlwZS5zaXplMjU2LCBkYXRhKTtcbn1cblxuLy8gVXRpbGl0eVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tVmFsdWUobG93OiBudW1iZXIsIGhpZ2g6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IGRpZmYgPSBoaWdoIC0gbG93O1xuICBjb25zdCBieXRlcyA9IGdldFJhbmRvbUJ5dGVzKDEpO1xuXG4gIC8vIEJlY2F1c2UgaGlnaCBhbmQgbG93IGFyZSBpbmNsdXNpdmVcbiAgY29uc3QgbW9kID0gZGlmZiArIDE7XG5cbiAgcmV0dXJuIChieXRlc1swXSAlIG1vZCkgKyBsb3c7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRaZXJvZXMobjogbnVtYmVyKTogVWludDhBcnJheSB7XG4gIHJldHVybiBuZXcgVWludDhBcnJheShuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hCaXRzVG9JbnQoYnl0ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgcmV0dXJuIChieXRlICYgMHhmZikgPj4gNDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludHNUb0J5dGVIaWdoQW5kTG93KFxuICBoaWdoVmFsdWU6IG51bWJlcixcbiAgbG93VmFsdWU6IG51bWJlclxuKTogbnVtYmVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgcmV0dXJuICgoaGlnaFZhbHVlIDw8IDQpIHwgbG93VmFsdWUpICYgMHhmZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpcnN0Qnl0ZXMoZGF0YTogVWludDhBcnJheSwgbjogbnVtYmVyKTogVWludDhBcnJheSB7XG4gIHJldHVybiBkYXRhLnN1YmFycmF5KDAsIG4pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qnl0ZXMoXG4gIGRhdGE6IFVpbnQ4QXJyYXksXG4gIHN0YXJ0OiBudW1iZXIsXG4gIG46IG51bWJlclxuKTogVWludDhBcnJheSB7XG4gIHJldHVybiBkYXRhLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIG4pO1xufVxuXG5mdW5jdGlvbiBfZ2V0TWFjQW5kRGF0YShjaXBoZXJ0ZXh0OiBVaW50OEFycmF5KSB7XG4gIGNvbnN0IGRhdGFMZW5ndGggPSBjaXBoZXJ0ZXh0LmJ5dGVMZW5ndGggLSBNQUNfTEVOR1RIO1xuICBjb25zdCBkYXRhID0gZ2V0Qnl0ZXMoY2lwaGVydGV4dCwgMCwgZGF0YUxlbmd0aCk7XG4gIGNvbnN0IG1hYyA9IGdldEJ5dGVzKGNpcGhlcnRleHQsIGRhdGFMZW5ndGgsIE1BQ19MRU5HVEgpO1xuXG4gIHJldHVybiB7IGRhdGEsIG1hYyB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5jcnlwdENkc0Rpc2NvdmVyeVJlcXVlc3QoXG4gIGF0dGVzdGF0aW9uczoge1xuICAgIFtrZXk6IHN0cmluZ106IHsgY2xpZW50S2V5OiBVaW50OEFycmF5OyByZXF1ZXN0SWQ6IFVpbnQ4QXJyYXkgfTtcbiAgfSxcbiAgcGhvbmVOdW1iZXJzOiBSZWFkb25seUFycmF5PHN0cmluZz5cbik6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgY29uc3Qgbm9uY2UgPSBnZXRSYW5kb21CeXRlcygzMik7XG4gIGNvbnN0IG51bWJlcnNBcnJheSA9IEJ1ZmZlci5jb25jYXQoXG4gICAgcGhvbmVOdW1iZXJzLm1hcChudW1iZXIgPT4ge1xuICAgICAgLy8gTG9uZy5mcm9tU3RyaW5nIGhhbmRsZXMgbnVtYmVycyB3aXRoIG9yIHdpdGhvdXQgYSBsZWFkaW5nICcrJ1xuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KExvbmcuZnJvbVN0cmluZyhudW1iZXIpLnRvQnl0ZXNCRSgpKTtcbiAgICB9KVxuICApO1xuXG4gIC8vIFdlJ3ZlIHdyaXR0ZW4gdG8gdGhlIGFycmF5LCBzbyBvZmZzZXQgPT09IGJ5dGVMZW5ndGg7IHdlIG5lZWQgdG8gcmVzZXQgaXQuIFRoZW4gd2UnbGxcbiAgLy8gICBoYXZlIGFjY2VzcyB0byBldmVyeXRoaW5nIGluIHRoZSBhcnJheSB3aGVuIHdlIGdlbmVyYXRlIGFuIFVpbnQ4QXJyYXkgZnJvbSBpdC5cbiAgY29uc3QgcXVlcnlEYXRhUGxhaW50ZXh0ID0gQnl0ZXMuY29uY2F0ZW5hdGUoW25vbmNlLCBudW1iZXJzQXJyYXldKTtcblxuICBjb25zdCBxdWVyeURhdGFLZXkgPSBnZXRSYW5kb21CeXRlcygzMik7XG4gIGNvbnN0IGNvbW1pdG1lbnQgPSBzaGEyNTYocXVlcnlEYXRhUGxhaW50ZXh0KTtcbiAgY29uc3QgaXYgPSBnZXRSYW5kb21CeXRlcygxMik7XG4gIGNvbnN0IHF1ZXJ5RGF0YUNpcGhlcnRleHQgPSBlbmNyeXB0QWVzR2NtKFxuICAgIHF1ZXJ5RGF0YUtleSxcbiAgICBpdixcbiAgICBxdWVyeURhdGFQbGFpbnRleHRcbiAgKTtcbiAgY29uc3QgeyBkYXRhOiBxdWVyeURhdGFDaXBoZXJ0ZXh0RGF0YSwgbWFjOiBxdWVyeURhdGFDaXBoZXJ0ZXh0TWFjIH0gPVxuICAgIF9nZXRNYWNBbmREYXRhKHF1ZXJ5RGF0YUNpcGhlcnRleHQpO1xuXG4gIGNvbnN0IGVudmVsb3BlcyA9IGF3YWl0IHBQcm9wcyhcbiAgICBhdHRlc3RhdGlvbnMsXG4gICAgYXN5bmMgKHsgY2xpZW50S2V5LCByZXF1ZXN0SWQgfSkgPT4ge1xuICAgICAgY29uc3QgZW52ZWxvcGVJdiA9IGdldFJhbmRvbUJ5dGVzKDEyKTtcbiAgICAgIGNvbnN0IGNpcGhlcnRleHQgPSBlbmNyeXB0QWVzR2NtKFxuICAgICAgICBjbGllbnRLZXksXG4gICAgICAgIGVudmVsb3BlSXYsXG4gICAgICAgIHF1ZXJ5RGF0YUtleSxcbiAgICAgICAgcmVxdWVzdElkXG4gICAgICApO1xuICAgICAgY29uc3QgeyBkYXRhLCBtYWMgfSA9IF9nZXRNYWNBbmREYXRhKGNpcGhlcnRleHQpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0SWQ6IEJ5dGVzLnRvQmFzZTY0KHJlcXVlc3RJZCksXG4gICAgICAgIGRhdGE6IEJ5dGVzLnRvQmFzZTY0KGRhdGEpLFxuICAgICAgICBpdjogQnl0ZXMudG9CYXNlNjQoZW52ZWxvcGVJdiksXG4gICAgICAgIG1hYzogQnl0ZXMudG9CYXNlNjQobWFjKSxcbiAgICAgIH07XG4gICAgfVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgYWRkcmVzc0NvdW50OiBwaG9uZU51bWJlcnMubGVuZ3RoLFxuICAgIGNvbW1pdG1lbnQ6IEJ5dGVzLnRvQmFzZTY0KGNvbW1pdG1lbnQpLFxuICAgIGRhdGE6IEJ5dGVzLnRvQmFzZTY0KHF1ZXJ5RGF0YUNpcGhlcnRleHREYXRhKSxcbiAgICBpdjogQnl0ZXMudG9CYXNlNjQoaXYpLFxuICAgIG1hYzogQnl0ZXMudG9CYXNlNjQocXVlcnlEYXRhQ2lwaGVydGV4dE1hYyksXG4gICAgZW52ZWxvcGVzLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiB1bmRlZmluZWQgfCBVVUlEU3RyaW5nVHlwZSB7XG4gIGlmIChieXRlcy5ieXRlTGVuZ3RoICE9PSBVVUlEX0JZVEVfU0laRSkge1xuICAgIGxvZy53YXJuKFxuICAgICAgJ2J5dGVzVG9VdWlkOiByZWNlaXZlZCBhbiBVaW50OEFycmF5IG9mIGludmFsaWQgbGVuZ3RoLiAnICtcbiAgICAgICAgJ1JldHVybmluZyB1bmRlZmluZWQnXG4gICAgKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgdXVpZHMgPSBzcGxpdFV1aWRzKGJ5dGVzKTtcbiAgaWYgKHV1aWRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB1dWlkc1swXSB8fCB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0VXVpZHMoYnVmZmVyOiBVaW50OEFycmF5KTogQXJyYXk8VVVJRFN0cmluZ1R5cGUgfCBudWxsPiB7XG4gIGNvbnN0IHV1aWRzID0gbmV3IEFycmF5PFVVSURTdHJpbmdUeXBlIHwgbnVsbD4oKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIuYnl0ZUxlbmd0aDsgaSArPSBVVUlEX0JZVEVfU0laRSkge1xuICAgIGNvbnN0IGJ5dGVzID0gZ2V0Qnl0ZXMoYnVmZmVyLCBpLCBVVUlEX0JZVEVfU0laRSk7XG4gICAgY29uc3QgaGV4ID0gQnl0ZXMudG9IZXgoYnl0ZXMpO1xuICAgIGNvbnN0IGNodW5rcyA9IFtcbiAgICAgIGhleC5zdWJzdHJpbmcoMCwgOCksXG4gICAgICBoZXguc3Vic3RyaW5nKDgsIDEyKSxcbiAgICAgIGhleC5zdWJzdHJpbmcoMTIsIDE2KSxcbiAgICAgIGhleC5zdWJzdHJpbmcoMTYsIDIwKSxcbiAgICAgIGhleC5zdWJzdHJpbmcoMjApLFxuICAgIF07XG4gICAgY29uc3QgdXVpZCA9IGNodW5rcy5qb2luKCctJyk7XG4gICAgaWYgKHV1aWQgIT09ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnKSB7XG4gICAgICB1dWlkcy5wdXNoKFVVSUQuY2FzdCh1dWlkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHV1aWRzLnB1c2gobnVsbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1dWlkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1Gb3JEaXNwbGF5KHBhZGRlZDogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICBsZXQgcGFkZGluZ0VuZCA9IDA7XG4gIGZvciAocGFkZGluZ0VuZDsgcGFkZGluZ0VuZCA8IHBhZGRlZC5sZW5ndGg7IHBhZGRpbmdFbmQgKz0gMSkge1xuICAgIGlmIChwYWRkZWRbcGFkZGluZ0VuZF0gPT09IDB4MDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFkZGVkLnNsaWNlKDAsIHBhZGRpbmdFbmQpO1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlEaWdlc3QoZGF0YTogVWludDhBcnJheSwgdGhlaXJEaWdlc3Q6IFVpbnQ4QXJyYXkpOiB2b2lkIHtcbiAgY29uc3Qgb3VyRGlnZXN0ID0gc2hhMjU2KGRhdGEpO1xuICBsZXQgcmVzdWx0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGVpckRpZ2VzdC5ieXRlTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIHJlc3VsdCB8PSBvdXJEaWdlc3RbaV0gXiB0aGVpckRpZ2VzdFtpXTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgZGlnZXN0Jyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRBdHRhY2htZW50KFxuICBlbmNyeXB0ZWRCaW46IFVpbnQ4QXJyYXksXG4gIGtleXM6IFVpbnQ4QXJyYXksXG4gIHRoZWlyRGlnZXN0PzogVWludDhBcnJheVxuKTogVWludDhBcnJheSB7XG4gIGlmIChrZXlzLmJ5dGVMZW5ndGggIT09IDY0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHb3QgaW52YWxpZCBsZW5ndGggYXR0YWNobWVudCBrZXlzJyk7XG4gIH1cbiAgaWYgKGVuY3J5cHRlZEJpbi5ieXRlTGVuZ3RoIDwgMTYgKyAzMikge1xuICAgIHRocm93IG5ldyBFcnJvcignR290IGludmFsaWQgbGVuZ3RoIGF0dGFjaG1lbnQnKTtcbiAgfVxuXG4gIGNvbnN0IGFlc0tleSA9IGtleXMuc2xpY2UoMCwgMzIpO1xuICBjb25zdCBtYWNLZXkgPSBrZXlzLnNsaWNlKDMyLCA2NCk7XG5cbiAgY29uc3QgaXYgPSBlbmNyeXB0ZWRCaW4uc2xpY2UoMCwgMTYpO1xuICBjb25zdCBjaXBoZXJ0ZXh0ID0gZW5jcnlwdGVkQmluLnNsaWNlKDE2LCBlbmNyeXB0ZWRCaW4uYnl0ZUxlbmd0aCAtIDMyKTtcbiAgY29uc3QgaXZBbmRDaXBoZXJ0ZXh0ID0gZW5jcnlwdGVkQmluLnNsaWNlKDAsIGVuY3J5cHRlZEJpbi5ieXRlTGVuZ3RoIC0gMzIpO1xuICBjb25zdCBtYWMgPSBlbmNyeXB0ZWRCaW4uc2xpY2UoXG4gICAgZW5jcnlwdGVkQmluLmJ5dGVMZW5ndGggLSAzMixcbiAgICBlbmNyeXB0ZWRCaW4uYnl0ZUxlbmd0aFxuICApO1xuXG4gIHZlcmlmeUhtYWNTaGEyNTYoaXZBbmRDaXBoZXJ0ZXh0LCBtYWNLZXksIG1hYywgMzIpO1xuXG4gIGlmICh0aGVpckRpZ2VzdCkge1xuICAgIHZlcmlmeURpZ2VzdChlbmNyeXB0ZWRCaW4sIHRoZWlyRGlnZXN0KTtcbiAgfVxuXG4gIHJldHVybiBkZWNyeXB0QWVzMjU2Q2JjUGtjc1BhZGRpbmcoYWVzS2V5LCBjaXBoZXJ0ZXh0LCBpdik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0QXR0YWNobWVudChcbiAgcGxhaW50ZXh0OiBVaW50OEFycmF5LFxuICBrZXlzOiBVaW50OEFycmF5LFxuICBpdjogVWludDhBcnJheVxuKTogRW5jcnlwdGVkQXR0YWNobWVudCB7XG4gIGlmICghKHBsYWludGV4dCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIGBcXGBwbGFpbnRleHRcXGAgbXVzdCBiZSBhbiBcXGBVaW50OEFycmF5XFxgOyBnb3Q6ICR7dHlwZW9mIHBsYWludGV4dH1gXG4gICAgKTtcbiAgfVxuXG4gIGlmIChrZXlzLmJ5dGVMZW5ndGggIT09IDY0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHb3QgaW52YWxpZCBsZW5ndGggYXR0YWNobWVudCBrZXlzJyk7XG4gIH1cbiAgaWYgKGl2LmJ5dGVMZW5ndGggIT09IDE2KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHb3QgaW52YWxpZCBsZW5ndGggYXR0YWNobWVudCBpdicpO1xuICB9XG4gIGNvbnN0IGFlc0tleSA9IGtleXMuc2xpY2UoMCwgMzIpO1xuICBjb25zdCBtYWNLZXkgPSBrZXlzLnNsaWNlKDMyLCA2NCk7XG5cbiAgY29uc3QgY2lwaGVydGV4dCA9IGVuY3J5cHRBZXMyNTZDYmNQa2NzUGFkZGluZyhhZXNLZXksIHBsYWludGV4dCwgaXYpO1xuXG4gIGNvbnN0IGl2QW5kQ2lwaGVydGV4dCA9IEJ5dGVzLmNvbmNhdGVuYXRlKFtpdiwgY2lwaGVydGV4dF0pO1xuXG4gIGNvbnN0IG1hYyA9IGhtYWNTaGEyNTYobWFjS2V5LCBpdkFuZENpcGhlcnRleHQpO1xuXG4gIGNvbnN0IGVuY3J5cHRlZEJpbiA9IEJ5dGVzLmNvbmNhdGVuYXRlKFtpdkFuZENpcGhlcnRleHQsIG1hY10pO1xuICBjb25zdCBkaWdlc3QgPSBzaGEyNTYoZW5jcnlwdGVkQmluKTtcblxuICByZXR1cm4ge1xuICAgIGNpcGhlcnRleHQ6IGVuY3J5cHRlZEJpbixcbiAgICBkaWdlc3QsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0UHJvZmlsZShkYXRhOiBVaW50OEFycmF5LCBrZXk6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgY29uc3QgaXYgPSBnZXRSYW5kb21CeXRlcyhQUk9GSUxFX0lWX0xFTkdUSCk7XG4gIGlmIChrZXkuYnl0ZUxlbmd0aCAhPT0gUFJPRklMRV9LRVlfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHb3QgaW52YWxpZCBsZW5ndGggcHJvZmlsZSBrZXknKTtcbiAgfVxuICBpZiAoaXYuYnl0ZUxlbmd0aCAhPT0gUFJPRklMRV9JVl9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dvdCBpbnZhbGlkIGxlbmd0aCBwcm9maWxlIGl2Jyk7XG4gIH1cbiAgY29uc3QgY2lwaGVydGV4dCA9IGVuY3J5cHRBZXNHY20oa2V5LCBpdiwgZGF0YSk7XG4gIHJldHVybiBCeXRlcy5jb25jYXRlbmF0ZShbaXYsIGNpcGhlcnRleHRdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQcm9maWxlKGRhdGE6IFVpbnQ4QXJyYXksIGtleTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICBpZiAoZGF0YS5ieXRlTGVuZ3RoIDwgMTIgKyAxNiArIDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEdvdCB0b28gc2hvcnQgaW5wdXQ6ICR7ZGF0YS5ieXRlTGVuZ3RofWApO1xuICB9XG4gIGNvbnN0IGl2ID0gZGF0YS5zbGljZSgwLCBQUk9GSUxFX0lWX0xFTkdUSCk7XG4gIGNvbnN0IGNpcGhlcnRleHQgPSBkYXRhLnNsaWNlKFBST0ZJTEVfSVZfTEVOR1RILCBkYXRhLmJ5dGVMZW5ndGgpO1xuICBpZiAoa2V5LmJ5dGVMZW5ndGggIT09IFBST0ZJTEVfS0VZX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBFcnJvcignR290IGludmFsaWQgbGVuZ3RoIHByb2ZpbGUga2V5Jyk7XG4gIH1cbiAgaWYgKGl2LmJ5dGVMZW5ndGggIT09IFBST0ZJTEVfSVZfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHb3QgaW52YWxpZCBsZW5ndGggcHJvZmlsZSBpdicpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjcnlwdEFlc0djbShrZXksIGl2LCBjaXBoZXJ0ZXh0KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHRocm93IG5ldyBQcm9maWxlRGVjcnlwdEVycm9yKFxuICAgICAgJ0ZhaWxlZCB0byBkZWNyeXB0IHByb2ZpbGUgZGF0YS4gJyArXG4gICAgICAgICdNb3N0IGxpa2VseSB0aGUgcHJvZmlsZSBrZXkgaGFzIGNoYW5nZWQuJ1xuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRQcm9maWxlSXRlbVdpdGhQYWRkaW5nKFxuICBpdGVtOiBVaW50OEFycmF5LFxuICBwcm9maWxlS2V5OiBVaW50OEFycmF5LFxuICBwYWRkZWRMZW5ndGhzOiB0eXBlb2YgUGFkZGVkTGVuZ3Roc1trZXlvZiB0eXBlb2YgUGFkZGVkTGVuZ3Roc11cbik6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBwYWRkZWRMZW5ndGggPSBwYWRkZWRMZW5ndGhzLmZpbmQoXG4gICAgKGxlbmd0aDogbnVtYmVyKSA9PiBpdGVtLmJ5dGVMZW5ndGggPD0gbGVuZ3RoXG4gICk7XG4gIGlmICghcGFkZGVkTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPdmVyc2l6ZWQgdmFsdWUnKTtcbiAgfVxuICBjb25zdCBwYWRkZWQgPSBuZXcgVWludDhBcnJheShwYWRkZWRMZW5ndGgpO1xuICBwYWRkZWQuc2V0KG5ldyBVaW50OEFycmF5KGl0ZW0pKTtcbiAgcmV0dXJuIGVuY3J5cHRQcm9maWxlKHBhZGRlZCwgcHJvZmlsZUtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0UHJvZmlsZU5hbWUoXG4gIGVuY3J5cHRlZFByb2ZpbGVOYW1lOiBzdHJpbmcsXG4gIGtleTogVWludDhBcnJheVxuKTogeyBnaXZlbjogVWludDhBcnJheTsgZmFtaWx5OiBVaW50OEFycmF5IHwgbnVsbCB9IHtcbiAgY29uc3QgZGF0YSA9IEJ5dGVzLmZyb21CYXNlNjQoZW5jcnlwdGVkUHJvZmlsZU5hbWUpO1xuICBjb25zdCBwYWRkZWQgPSBkZWNyeXB0UHJvZmlsZShkYXRhLCBrZXkpO1xuXG4gIC8vIEdpdmVuIG5hbWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmcgdG8gdGhlIGZpcnN0IG51bGwgY2hhcmFjdGVyXG4gIGxldCBnaXZlbkVuZDtcbiAgZm9yIChnaXZlbkVuZCA9IDA7IGdpdmVuRW5kIDwgcGFkZGVkLmxlbmd0aDsgZ2l2ZW5FbmQgKz0gMSkge1xuICAgIGlmIChwYWRkZWRbZ2l2ZW5FbmRdID09PSAweDAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBGYW1pbHkgbmFtZSBpcyB0aGUgbmV4dCBjaHVuayBvZiBub24tbnVsbCBjaGFyYWN0ZXJzIGFmdGVyIHRoYXQgZmlyc3QgbnVsbFxuICBsZXQgZmFtaWx5RW5kO1xuICBmb3IgKGZhbWlseUVuZCA9IGdpdmVuRW5kICsgMTsgZmFtaWx5RW5kIDwgcGFkZGVkLmxlbmd0aDsgZmFtaWx5RW5kICs9IDEpIHtcbiAgICBpZiAocGFkZGVkW2ZhbWlseUVuZF0gPT09IDB4MDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBjb25zdCBmb3VuZEZhbWlseU5hbWUgPSBmYW1pbHlFbmQgPiBnaXZlbkVuZCArIDE7XG5cbiAgcmV0dXJuIHtcbiAgICBnaXZlbjogcGFkZGVkLnNsaWNlKDAsIGdpdmVuRW5kKSxcbiAgICBmYW1pbHk6IGZvdW5kRmFtaWx5TmFtZSA/IHBhZGRlZC5zbGljZShnaXZlbkVuZCArIDEsIGZhbWlseUVuZCkgOiBudWxsLFxuICB9O1xufVxuXG4vL1xuLy8gU2lnbmFsQ29udGV4dCBBUElzXG4vL1xuXG5jb25zdCB7IGNyeXB0byB9ID0gd2luZG93LlNpZ25hbENvbnRleHQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduKGtleTogVWludDhBcnJheSwgZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICByZXR1cm4gY3J5cHRvLnNpZ24oa2V5LCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc2godHlwZTogSGFzaFR5cGUsIGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGNyeXB0by5oYXNoKHR5cGUsIGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdChcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgY3J5cHRvLmVuY3J5cHQ+XG4pOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGNyeXB0by5lbmNyeXB0KC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdChcbiAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgY3J5cHRvLmRlY3J5cHQ+XG4pOiBVaW50OEFycmF5IHtcbiAgcmV0dXJuIGNyeXB0by5kZWNyeXB0KC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tQnl0ZXMoc2l6ZTogbnVtYmVyKTogVWludDhBcnJheSB7XG4gIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tQnl0ZXMoc2l6ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdGFudFRpbWVFcXVhbChcbiAgbGVmdDogVWludDhBcnJheSxcbiAgcmlnaHQ6IFVpbnQ4QXJyYXlcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gY3J5cHRvLmNvbnN0YW50VGltZUVxdWFsKGxlZnQsIHJpZ2h0KTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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
