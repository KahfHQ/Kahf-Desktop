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
var getProfile_exports = {};
__export(getProfile_exports, {
  getProfile: () => getProfile
});
module.exports = __toCommonJS(getProfile_exports);
var log = __toESM(require("../logging/log"));
var import_profiles = require("../services/profiles");
async function getProfile(uuid, e164) {
  const c = window.ConversationController.lookupOrCreate({
    uuid,
    e164
  });
  if (!c) {
    log.error("getProfile: failed to find conversation; doing nothing");
    return;
  }
  return import_profiles.profileService.get(c.id);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProfile
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0UHJvZmlsZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBwcm9maWxlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3Byb2ZpbGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFByb2ZpbGUodXVpZD86IHN0cmluZywgZTE2ND86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBjID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgIHV1aWQsXG4gICAgZTE2NCxcbiAgfSk7XG4gIGlmICghYykge1xuICAgIGxvZy5lcnJvcignZ2V0UHJvZmlsZTogZmFpbGVkIHRvIGZpbmQgY29udmVyc2F0aW9uOyBkb2luZyBub3RoaW5nJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIHByb2ZpbGVTZXJ2aWNlLmdldChjLmlkKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxVQUFxQjtBQUNyQixzQkFBK0I7QUFFL0IsMEJBQWlDLE1BQWUsTUFBOEI7QUFDNUUsUUFBTSxJQUFJLE9BQU8sdUJBQXVCLGVBQWU7QUFBQSxJQUNyRDtBQUFBLElBQ0E7QUFBQSxFQUNGLENBQUM7QUFDRCxNQUFJLENBQUMsR0FBRztBQUNOLFFBQUksTUFBTSx3REFBd0Q7QUFDbEU7QUFBQSxFQUNGO0FBRUEsU0FBTywrQkFBZSxJQUFJLEVBQUUsRUFBRTtBQUNoQztBQVhzQiIsCiAgIm5hbWVzIjogW10KfQo=
