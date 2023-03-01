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
var add_storage_id_to_stickers_exports = {};
__export(add_storage_id_to_stickers_exports, {
  default: () => updateToSchemaVersion65
});
module.exports = __toCommonJS(add_storage_id_to_stickers_exports);
function updateToSchemaVersion65(currentVersion, db, logger) {
  if (currentVersion >= 65) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE sticker_packs ADD COLUMN position INTEGER DEFAULT 0 NOT NULL;
      ALTER TABLE sticker_packs ADD COLUMN storageID STRING;
      ALTER TABLE sticker_packs ADD COLUMN storageVersion INTEGER;
      ALTER TABLE sticker_packs ADD COLUMN storageUnknownFields BLOB;
      ALTER TABLE sticker_packs
      ADD COLUMN storageNeedsSync
      INTEGER DEFAULT 0 NOT NULL;

      CREATE TABLE uninstalled_sticker_packs (
        id STRING NOT NULL PRIMARY KEY,
        uninstalledAt NUMBER NOT NULL,
        storageID STRING,
        storageVersion NUMBER,
        storageUnknownFields BLOB,
        storageNeedsSync INTEGER NOT NULL
      );

      -- Set initial position

      UPDATE sticker_packs
      SET
        position = (row_number - 1),
        storageNeedsSync = 1
      FROM (
        SELECT id, row_number() OVER (ORDER BY lastUsed DESC) as row_number
        FROM sticker_packs
      ) as ordered_pairs
      WHERE sticker_packs.id IS ordered_pairs.id;

      -- See: getAllStickerPacks

      CREATE INDEX sticker_packs_by_position_and_id ON sticker_packs (
        position ASC,
        id ASC
      );
      `);
    db.pragma("user_version = 65");
  })();
  logger.info("updateToSchemaVersion65: success!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiNjUtYWRkLXN0b3JhZ2UtaWQtdG8tc3RpY2tlcnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlIH0gZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuXG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9Mb2dnaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjUoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDY1KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoXG4gICAgICBgXG4gICAgICBBTFRFUiBUQUJMRSBzdGlja2VyX3BhY2tzIEFERCBDT0xVTU4gcG9zaXRpb24gSU5URUdFUiBERUZBVUxUIDAgTk9UIE5VTEw7XG4gICAgICBBTFRFUiBUQUJMRSBzdGlja2VyX3BhY2tzIEFERCBDT0xVTU4gc3RvcmFnZUlEIFNUUklORztcbiAgICAgIEFMVEVSIFRBQkxFIHN0aWNrZXJfcGFja3MgQUREIENPTFVNTiBzdG9yYWdlVmVyc2lvbiBJTlRFR0VSO1xuICAgICAgQUxURVIgVEFCTEUgc3RpY2tlcl9wYWNrcyBBREQgQ09MVU1OIHN0b3JhZ2VVbmtub3duRmllbGRzIEJMT0I7XG4gICAgICBBTFRFUiBUQUJMRSBzdGlja2VyX3BhY2tzXG4gICAgICBBREQgQ09MVU1OIHN0b3JhZ2VOZWVkc1N5bmNcbiAgICAgIElOVEVHRVIgREVGQVVMVCAwIE5PVCBOVUxMO1xuXG4gICAgICBDUkVBVEUgVEFCTEUgdW5pbnN0YWxsZWRfc3RpY2tlcl9wYWNrcyAoXG4gICAgICAgIGlkIFNUUklORyBOT1QgTlVMTCBQUklNQVJZIEtFWSxcbiAgICAgICAgdW5pbnN0YWxsZWRBdCBOVU1CRVIgTk9UIE5VTEwsXG4gICAgICAgIHN0b3JhZ2VJRCBTVFJJTkcsXG4gICAgICAgIHN0b3JhZ2VWZXJzaW9uIE5VTUJFUixcbiAgICAgICAgc3RvcmFnZVVua25vd25GaWVsZHMgQkxPQixcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luYyBJTlRFR0VSIE5PVCBOVUxMXG4gICAgICApO1xuXG4gICAgICAtLSBTZXQgaW5pdGlhbCBwb3NpdGlvblxuXG4gICAgICBVUERBVEUgc3RpY2tlcl9wYWNrc1xuICAgICAgU0VUXG4gICAgICAgIHBvc2l0aW9uID0gKHJvd19udW1iZXIgLSAxKSxcbiAgICAgICAgc3RvcmFnZU5lZWRzU3luYyA9IDFcbiAgICAgIEZST00gKFxuICAgICAgICBTRUxFQ1QgaWQsIHJvd19udW1iZXIoKSBPVkVSIChPUkRFUiBCWSBsYXN0VXNlZCBERVNDKSBhcyByb3dfbnVtYmVyXG4gICAgICAgIEZST00gc3RpY2tlcl9wYWNrc1xuICAgICAgKSBhcyBvcmRlcmVkX3BhaXJzXG4gICAgICBXSEVSRSBzdGlja2VyX3BhY2tzLmlkIElTIG9yZGVyZWRfcGFpcnMuaWQ7XG5cbiAgICAgIC0tIFNlZTogZ2V0QWxsU3RpY2tlclBhY2tzXG5cbiAgICAgIENSRUFURSBJTkRFWCBzdGlja2VyX3BhY2tzX2J5X3Bvc2l0aW9uX2FuZF9pZCBPTiBzdGlja2VyX3BhY2tzIChcbiAgICAgICAgcG9zaXRpb24gQVNDLFxuICAgICAgICBpZCBBU0NcbiAgICAgICk7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gNjUnKTtcbiAgfSkoKTtcblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjU6IHN1Y2Nlc3MhJyk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT2UsaUNBQ2IsZ0JBQ0EsSUFDQSxRQUNNO0FBQ04sTUFBSSxrQkFBa0IsSUFBSTtBQUN4QjtBQUFBLEVBQ0Y7QUFFQSxLQUFHLFlBQVksTUFBTTtBQUNuQixPQUFHLEtBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FxQ0Y7QUFFQSxPQUFHLE9BQU8sbUJBQW1CO0FBQUEsRUFDL0IsQ0FBQyxFQUFFO0FBRUgsU0FBTyxLQUFLLG1DQUFtQztBQUNqRDtBQXREd0IiLAogICJuYW1lcyI6IFtdCn0K
