var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var uuid_column_for_pre_keys_exports = {};
__export(uuid_column_for_pre_keys_exports, {
  default: () => updateToSchemaVersion64
});
module.exports = __toCommonJS(uuid_column_for_pre_keys_exports);
function updateToSchemaVersion64(currentVersion, db, logger) {
  if (currentVersion >= 64) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE preKeys
        ADD COLUMN ourUuid STRING
        GENERATED ALWAYS AS (json_extract(json, '$.ourUuid'));

      CREATE INDEX preKeys_ourUuid ON preKeys (ourUuid);

      ALTER TABLE signedPreKeys
        ADD COLUMN ourUuid STRING
        GENERATED ALWAYS AS (json_extract(json, '$.ourUuid'));

      CREATE INDEX signedPreKeys_ourUuid ON signedPreKeys (ourUuid);
      `);
    db.pragma("user_version = 64");
  })();
  logger.info("updateToSchemaVersion64: success!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiNjQtdXVpZC1jb2x1bW4tZm9yLXByZS1rZXlzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgRGF0YWJhc2UgfSBmcm9tICdiZXR0ZXItc3FsaXRlMyc7XG5cbmltcG9ydCB0eXBlIHsgTG9nZ2VyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb242NChcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gNjQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhcbiAgICAgIGBcbiAgICAgIEFMVEVSIFRBQkxFIHByZUtleXNcbiAgICAgICAgQUREIENPTFVNTiBvdXJVdWlkIFNUUklOR1xuICAgICAgICBHRU5FUkFURUQgQUxXQVlTIEFTIChqc29uX2V4dHJhY3QoanNvbiwgJyQub3VyVXVpZCcpKTtcblxuICAgICAgQ1JFQVRFIElOREVYIHByZUtleXNfb3VyVXVpZCBPTiBwcmVLZXlzIChvdXJVdWlkKTtcblxuICAgICAgQUxURVIgVEFCTEUgc2lnbmVkUHJlS2V5c1xuICAgICAgICBBREQgQ09MVU1OIG91clV1aWQgU1RSSU5HXG4gICAgICAgIEdFTkVSQVRFRCBBTFdBWVMgQVMgKGpzb25fZXh0cmFjdChqc29uLCAnJC5vdXJVdWlkJykpO1xuXG4gICAgICBDUkVBVEUgSU5ERVggc2lnbmVkUHJlS2V5c19vdXJVdWlkIE9OIHNpZ25lZFByZUtleXMgKG91clV1aWQpO1xuICAgICAgYFxuICAgICk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDY0Jyk7XG4gIH0pKCk7XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjY0OiBzdWNjZXNzIScpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9lLGlDQUNiLGdCQUNBLElBQ0EsUUFDTTtBQUNOLE1BQUksa0JBQWtCLElBQUk7QUFDeEI7QUFBQSxFQUNGO0FBRUEsS0FBRyxZQUFZLE1BQU07QUFDbkIsT0FBRyxLQUNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BYUY7QUFFQSxPQUFHLE9BQU8sbUJBQW1CO0FBQUEsRUFDL0IsQ0FBQyxFQUFFO0FBRUgsU0FBTyxLQUFLLG1DQUFtQztBQUNqRDtBQTlCd0IiLAogICJuYW1lcyI6IFtdCn0K
