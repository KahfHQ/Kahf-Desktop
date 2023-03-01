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
var uuidToBytes_exports = {};
__export(uuidToBytes_exports, {
  uuidToBytes: () => uuidToBytes
});
module.exports = __toCommonJS(uuidToBytes_exports);
var import_lodash = require("lodash");
var log = __toESM(require("../logging/log"));
function uuidToBytes(uuid) {
  if (uuid.length !== 36) {
    log.warn("uuidToBytes: received a string of invalid length. Returning an empty Uint8Array");
    return new Uint8Array(0);
  }
  return Uint8Array.from((0, import_lodash.chunk)(uuid.replace(/-/g, ""), 2).map((pair) => parseInt(pair.join(""), 16)));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uuidToBytes
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXVpZFRvQnl0ZXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgY2h1bmsgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHV1aWRUb0J5dGVzKHV1aWQ6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xuICBpZiAodXVpZC5sZW5ndGggIT09IDM2KSB7XG4gICAgbG9nLndhcm4oXG4gICAgICAndXVpZFRvQnl0ZXM6IHJlY2VpdmVkIGEgc3RyaW5nIG9mIGludmFsaWQgbGVuZ3RoLiAnICtcbiAgICAgICAgJ1JldHVybmluZyBhbiBlbXB0eSBVaW50OEFycmF5J1xuICAgICk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KDApO1xuICB9XG5cbiAgcmV0dXJuIFVpbnQ4QXJyYXkuZnJvbShcbiAgICBjaHVuayh1dWlkLnJlcGxhY2UoLy0vZywgJycpLCAyKS5tYXAocGFpciA9PiBwYXJzZUludChwYWlyLmpvaW4oJycpLCAxNikpXG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXNCO0FBQ3RCLFVBQXFCO0FBRWQscUJBQXFCLE1BQTBCO0FBQ3BELE1BQUksS0FBSyxXQUFXLElBQUk7QUFDdEIsUUFBSSxLQUNGLGlGQUVGO0FBQ0EsV0FBTyxJQUFJLFdBQVcsQ0FBQztBQUFBLEVBQ3pCO0FBRUEsU0FBTyxXQUFXLEtBQ2hCLHlCQUFNLEtBQUssUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxVQUFRLFNBQVMsS0FBSyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FDMUU7QUFDRjtBQVpnQiIsCiAgIm5hbWVzIjogW10KfQo=
