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
var User_exports = {};
__export(User_exports, {
  User: () => User
});
module.exports = __toCommonJS(User_exports);
var import_assert = require("../../util/assert");
var import_UUID = require("../../types/UUID");
var log = __toESM(require("../../logging/log"));
var import_Helpers = __toESM(require("../Helpers"));
class User {
  constructor(storage) {
    this.storage = storage;
  }
  async setUuidAndDeviceId(uuid, deviceId) {
    await this.storage.put("uuid_id", `${uuid}.${deviceId}`);
    log.info("storage.user: uuid and device id changed");
  }
  async setNumber(number) {
    if (this.getNumber() === number) {
      return;
    }
    const deviceId = this.getDeviceId();
    (0, import_assert.strictAssert)(deviceId !== void 0, "Cannot update device number without knowing device id");
    log.info("storage.user: number changed");
    await Promise.all([
      this.storage.put("number_id", `${number}.${deviceId}`),
      this.storage.remove("senderCertificate")
    ]);
    window.Whisper.events.trigger("userChanged", true);
  }
  getNumber() {
    const numberId = this.storage.get("number_id");
    if (numberId === void 0)
      return void 0;
    return import_Helpers.default.unencodeNumber(numberId)[0];
  }
  getUuid(uuidKind = import_UUID.UUIDKind.ACI) {
    if (uuidKind === import_UUID.UUIDKind.PNI) {
      const pni = this.storage.get("pni");
      if (pni === void 0)
        return void 0;
      return new import_UUID.UUID(pni);
    }
    (0, import_assert.strictAssert)(uuidKind === import_UUID.UUIDKind.ACI, `Unsupported uuid kind: ${uuidKind}`);
    const uuid = this.storage.get("uuid_id");
    if (!uuid)
      return void 0;
    return new import_UUID.UUID(import_Helpers.default.unencodeNumber(uuid.toLowerCase())[0]);
  }
  getCheckedUuid(uuidKind) {
    const uuid = this.getUuid(uuidKind);
    (0, import_assert.strictAssert)(uuid !== void 0, "Must have our own uuid");
    return uuid;
  }
  async setPni(pni) {
    await this.storage.put("pni", import_UUID.UUID.cast(pni));
  }
  getOurUuidKind(uuid) {
    const ourUuid = this.getUuid();
    if (ourUuid?.toString() === uuid.toString()) {
      return import_UUID.UUIDKind.ACI;
    }
    const pni = this.getUuid(import_UUID.UUIDKind.PNI);
    if (pni?.toString() === uuid.toString()) {
      return import_UUID.UUIDKind.PNI;
    }
    return import_UUID.UUIDKind.Unknown;
  }
  getDeviceId() {
    const value = this._getDeviceIdFromUuid() || this._getDeviceIdFromNumber();
    if (value === void 0) {
      return void 0;
    }
    return parseInt(value, 10);
  }
  getDeviceName() {
    return this.storage.get("device_name");
  }
  async setDeviceNameEncrypted() {
    return this.storage.put("deviceNameEncrypted", true);
  }
  getDeviceNameEncrypted() {
    return this.storage.get("deviceNameEncrypted");
  }
  async removeSignalingKey() {
    return this.storage.remove("signaling_key");
  }
  async setCredentials(credentials) {
    const { uuid, pni, number, deviceId, deviceName, password } = credentials;
    await Promise.all([
      this.storage.put("number_id", `${number}.${deviceId}`),
      this.storage.put("uuid_id", `${uuid}.${deviceId}`),
      this.storage.put("password", password),
      this.setPni(pni),
      deviceName ? this.storage.put("device_name", deviceName) : Promise.resolve()
    ]);
  }
  async removeCredentials() {
    log.info("storage.user: removeCredentials");
    await Promise.all([
      this.storage.remove("number_id"),
      this.storage.remove("uuid_id"),
      this.storage.remove("password"),
      this.storage.remove("device_name")
    ]);
  }
  getWebAPICredentials() {
    return {
      username: this.storage.get("uuid_id") || this.storage.get("number_id") || "",
      password: this.storage.get("password", "")
    };
  }
  _getDeviceIdFromUuid() {
    const uuid = this.storage.get("uuid_id");
    if (uuid === void 0)
      return void 0;
    return import_Helpers.default.unencodeNumber(uuid)[1];
  }
  _getDeviceIdFromNumber() {
    const numberId = this.storage.get("number_id");
    if (numberId === void 0)
      return void 0;
    return import_Helpers.default.unencodeNumber(numberId)[1];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  User
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVXNlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFdlYkFQSUNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vVHlwZXMuZCc7XG5cbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JhZ2UuZCc7XG5pbXBvcnQgeyBVVUlELCBVVUlES2luZCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nJztcblxuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi4vSGVscGVycyc7XG5cbmV4cG9ydCB0eXBlIFNldENyZWRlbnRpYWxzT3B0aW9ucyA9IHtcbiAgdXVpZDogc3RyaW5nO1xuICBwbmk6IHN0cmluZztcbiAgbnVtYmVyOiBzdHJpbmc7XG4gIGRldmljZUlkOiBudW1iZXI7XG4gIGRldmljZU5hbWU/OiBzdHJpbmc7XG4gIHBhc3N3b3JkOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY2xhc3MgVXNlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc3RvcmFnZTogU3RvcmFnZUludGVyZmFjZSkge31cblxuICBwdWJsaWMgYXN5bmMgc2V0VXVpZEFuZERldmljZUlkKFxuICAgIHV1aWQ6IHN0cmluZyxcbiAgICBkZXZpY2VJZDogbnVtYmVyXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wdXQoJ3V1aWRfaWQnLCBgJHt1dWlkfS4ke2RldmljZUlkfWApO1xuXG4gICAgbG9nLmluZm8oJ3N0b3JhZ2UudXNlcjogdXVpZCBhbmQgZGV2aWNlIGlkIGNoYW5nZWQnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXROdW1iZXIobnVtYmVyOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5nZXROdW1iZXIoKSA9PT0gbnVtYmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGV2aWNlSWQgPSB0aGlzLmdldERldmljZUlkKCk7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgZGV2aWNlSWQgIT09IHVuZGVmaW5lZCxcbiAgICAgICdDYW5ub3QgdXBkYXRlIGRldmljZSBudW1iZXIgd2l0aG91dCBrbm93aW5nIGRldmljZSBpZCdcbiAgICApO1xuXG4gICAgbG9nLmluZm8oJ3N0b3JhZ2UudXNlcjogbnVtYmVyIGNoYW5nZWQnKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuc3RvcmFnZS5wdXQoJ251bWJlcl9pZCcsIGAke251bWJlcn0uJHtkZXZpY2VJZH1gKSxcbiAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoJ3NlbmRlckNlcnRpZmljYXRlJyksXG4gICAgXSk7XG5cbiAgICAvLyBOb3RpZnkgcmVkdXggYWJvdXQgcGhvbmUgbnVtYmVyIGNoYW5nZVxuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCd1c2VyQ2hhbmdlZCcsIHRydWUpO1xuICB9XG5cbiAgcHVibGljIGdldE51bWJlcigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG51bWJlcklkID0gdGhpcy5zdG9yYWdlLmdldCgnbnVtYmVyX2lkJyk7XG4gICAgaWYgKG51bWJlcklkID09PSB1bmRlZmluZWQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIEhlbHBlcnMudW5lbmNvZGVOdW1iZXIobnVtYmVySWQpWzBdO1xuICB9XG5cbiAgcHVibGljIGdldFV1aWQodXVpZEtpbmQgPSBVVUlES2luZC5BQ0kpOiBVVUlEIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodXVpZEtpbmQgPT09IFVVSURLaW5kLlBOSSkge1xuICAgICAgY29uc3QgcG5pID0gdGhpcy5zdG9yYWdlLmdldCgncG5pJyk7XG4gICAgICBpZiAocG5pID09PSB1bmRlZmluZWQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gbmV3IFVVSUQocG5pKTtcbiAgICB9XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICB1dWlkS2luZCA9PT0gVVVJREtpbmQuQUNJLFxuICAgICAgYFVuc3VwcG9ydGVkIHV1aWQga2luZDogJHt1dWlkS2luZH1gXG4gICAgKTtcbiAgICBjb25zdCB1dWlkID0gdGhpcy5zdG9yYWdlLmdldCgndXVpZF9pZCcpO1xuICAgIGlmICghdXVpZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbmV3IFVVSUQoSGVscGVycy51bmVuY29kZU51bWJlcih1dWlkLnRvTG93ZXJDYXNlKCkpWzBdKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDaGVja2VkVXVpZCh1dWlkS2luZD86IFVVSURLaW5kKTogVVVJRCB7XG4gICAgY29uc3QgdXVpZCA9IHRoaXMuZ2V0VXVpZCh1dWlkS2luZCk7XG4gICAgc3RyaWN0QXNzZXJ0KHV1aWQgIT09IHVuZGVmaW5lZCwgJ011c3QgaGF2ZSBvdXIgb3duIHV1aWQnKTtcbiAgICByZXR1cm4gdXVpZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXRQbmkocG5pOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnN0b3JhZ2UucHV0KCdwbmknLCBVVUlELmNhc3QocG5pKSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0T3VyVXVpZEtpbmQodXVpZDogVVVJRCk6IFVVSURLaW5kIHtcbiAgICBjb25zdCBvdXJVdWlkID0gdGhpcy5nZXRVdWlkKCk7XG5cbiAgICBpZiAob3VyVXVpZD8udG9TdHJpbmcoKSA9PT0gdXVpZC50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm4gVVVJREtpbmQuQUNJO1xuICAgIH1cblxuICAgIGNvbnN0IHBuaSA9IHRoaXMuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuICAgIGlmIChwbmk/LnRvU3RyaW5nKCkgPT09IHV1aWQudG9TdHJpbmcoKSkge1xuICAgICAgcmV0dXJuIFVVSURLaW5kLlBOSTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVVJREtpbmQuVW5rbm93bjtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZXZpY2VJZCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0RGV2aWNlSWRGcm9tVXVpZCgpIHx8IHRoaXMuX2dldERldmljZUlkRnJvbU51bWJlcigpO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZXZpY2VOYW1lKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXQoJ2RldmljZV9uYW1lJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2V0RGV2aWNlTmFtZUVuY3J5cHRlZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnB1dCgnZGV2aWNlTmFtZUVuY3J5cHRlZCcsIHRydWUpO1xuICB9XG5cbiAgcHVibGljIGdldERldmljZU5hbWVFbmNyeXB0ZWQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXQoJ2RldmljZU5hbWVFbmNyeXB0ZWQnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZW1vdmVTaWduYWxpbmdLZXkoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5yZW1vdmUoJ3NpZ25hbGluZ19rZXknKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXRDcmVkZW50aWFscyhcbiAgICBjcmVkZW50aWFsczogU2V0Q3JlZGVudGlhbHNPcHRpb25zXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgdXVpZCwgcG5pLCBudW1iZXIsIGRldmljZUlkLCBkZXZpY2VOYW1lLCBwYXNzd29yZCB9ID0gY3JlZGVudGlhbHM7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLnN0b3JhZ2UucHV0KCdudW1iZXJfaWQnLCBgJHtudW1iZXJ9LiR7ZGV2aWNlSWR9YCksXG4gICAgICB0aGlzLnN0b3JhZ2UucHV0KCd1dWlkX2lkJywgYCR7dXVpZH0uJHtkZXZpY2VJZH1gKSxcbiAgICAgIHRoaXMuc3RvcmFnZS5wdXQoJ3Bhc3N3b3JkJywgcGFzc3dvcmQpLFxuICAgICAgdGhpcy5zZXRQbmkocG5pKSxcbiAgICAgIGRldmljZU5hbWVcbiAgICAgICAgPyB0aGlzLnN0b3JhZ2UucHV0KCdkZXZpY2VfbmFtZScsIGRldmljZU5hbWUpXG4gICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgXSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVtb3ZlQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ3N0b3JhZ2UudXNlcjogcmVtb3ZlQ3JlZGVudGlhbHMnKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoJ251bWJlcl9pZCcpLFxuICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZSgndXVpZF9pZCcpLFxuICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZSgncGFzc3dvcmQnKSxcbiAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoJ2RldmljZV9uYW1lJyksXG4gICAgXSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0V2ViQVBJQ3JlZGVudGlhbHMoKTogV2ViQVBJQ3JlZGVudGlhbHMge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VybmFtZTpcbiAgICAgICAgdGhpcy5zdG9yYWdlLmdldCgndXVpZF9pZCcpIHx8IHRoaXMuc3RvcmFnZS5nZXQoJ251bWJlcl9pZCcpIHx8ICcnLFxuICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RvcmFnZS5nZXQoJ3Bhc3N3b3JkJywgJycpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9nZXREZXZpY2VJZEZyb21VdWlkKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgdXVpZCA9IHRoaXMuc3RvcmFnZS5nZXQoJ3V1aWRfaWQnKTtcbiAgICBpZiAodXVpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBIZWxwZXJzLnVuZW5jb2RlTnVtYmVyKHV1aWQpWzFdO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RGV2aWNlSWRGcm9tTnVtYmVyKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgbnVtYmVySWQgPSB0aGlzLnN0b3JhZ2UuZ2V0KCdudW1iZXJfaWQnKTtcbiAgICBpZiAobnVtYmVySWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gSGVscGVycy51bmVuY29kZU51bWJlcihudW1iZXJJZClbMV07XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxvQkFBNkI7QUFFN0Isa0JBQStCO0FBQy9CLFVBQXFCO0FBRXJCLHFCQUFvQjtBQVdiLE1BQU0sS0FBSztBQUFBLEVBQ2hCLFlBQTZCLFNBQTJCO0FBQTNCO0FBQUEsRUFBNEI7QUFBQSxRQUU1QyxtQkFDWCxNQUNBLFVBQ2U7QUFDZixVQUFNLEtBQUssUUFBUSxJQUFJLFdBQVcsR0FBRyxRQUFRLFVBQVU7QUFFdkQsUUFBSSxLQUFLLDBDQUEwQztBQUFBLEVBQ3JEO0FBQUEsUUFFYSxVQUFVLFFBQStCO0FBQ3BELFFBQUksS0FBSyxVQUFVLE1BQU0sUUFBUTtBQUMvQjtBQUFBLElBQ0Y7QUFFQSxVQUFNLFdBQVcsS0FBSyxZQUFZO0FBQ2xD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
