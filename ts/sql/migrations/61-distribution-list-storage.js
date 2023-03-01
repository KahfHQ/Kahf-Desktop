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
var distribution_list_storage_exports = {};
__export(distribution_list_storage_exports, {
  default: () => updateToSchemaVersion61
});
module.exports = __toCommonJS(distribution_list_storage_exports);
function updateToSchemaVersion61(currentVersion, db, logger) {
  if (currentVersion >= 61) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE storyDistributions DROP COLUMN avatarKey;
      ALTER TABLE storyDistributions DROP COLUMN avatarUrlPath;

      ALTER TABLE storyDistributions ADD COLUMN deletedAtTimestamp INTEGER;
      ALTER TABLE storyDistributions ADD COLUMN allowsReplies INTEGER;
      ALTER TABLE storyDistributions ADD COLUMN isBlockList INTEGER;

      ALTER TABLE storyDistributions ADD COLUMN storageID STRING;
      ALTER TABLE storyDistributions ADD COLUMN storageVersion INTEGER;
      ALTER TABLE storyDistributions ADD COLUMN storageUnknownFields BLOB;
      ALTER TABLE storyDistributions ADD COLUMN storageNeedsSync INTEGER;

      ALTER TABLE messages ADD COLUMN storyDistributionListId STRING;

      CREATE INDEX messages_by_distribution_list
        ON messages(storyDistributionListId, received_at)
        WHERE storyDistributionListId IS NOT NULL;
      `);
    db.pragma("user_version = 61");
  })();
  logger.info("updateToSchemaVersion61: success!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiNjEtZGlzdHJpYnV0aW9uLWxpc3Qtc3RvcmFnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlIH0gZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuXG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9Mb2dnaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjEoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDYxKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoXG4gICAgICBgXG4gICAgICBBTFRFUiBUQUJMRSBzdG9yeURpc3RyaWJ1dGlvbnMgRFJPUCBDT0xVTU4gYXZhdGFyS2V5O1xuICAgICAgQUxURVIgVEFCTEUgc3RvcnlEaXN0cmlidXRpb25zIERST1AgQ09MVU1OIGF2YXRhclVybFBhdGg7XG5cbiAgICAgIEFMVEVSIFRBQkxFIHN0b3J5RGlzdHJpYnV0aW9ucyBBREQgQ09MVU1OIGRlbGV0ZWRBdFRpbWVzdGFtcCBJTlRFR0VSO1xuICAgICAgQUxURVIgVEFCTEUgc3RvcnlEaXN0cmlidXRpb25zIEFERCBDT0xVTU4gYWxsb3dzUmVwbGllcyBJTlRFR0VSO1xuICAgICAgQUxURVIgVEFCTEUgc3RvcnlEaXN0cmlidXRpb25zIEFERCBDT0xVTU4gaXNCbG9ja0xpc3QgSU5URUdFUjtcblxuICAgICAgQUxURVIgVEFCTEUgc3RvcnlEaXN0cmlidXRpb25zIEFERCBDT0xVTU4gc3RvcmFnZUlEIFNUUklORztcbiAgICAgIEFMVEVSIFRBQkxFIHN0b3J5RGlzdHJpYnV0aW9ucyBBREQgQ09MVU1OIHN0b3JhZ2VWZXJzaW9uIElOVEVHRVI7XG4gICAgICBBTFRFUiBUQUJMRSBzdG9yeURpc3RyaWJ1dGlvbnMgQUREIENPTFVNTiBzdG9yYWdlVW5rbm93bkZpZWxkcyBCTE9CO1xuICAgICAgQUxURVIgVEFCTEUgc3RvcnlEaXN0cmlidXRpb25zIEFERCBDT0xVTU4gc3RvcmFnZU5lZWRzU3luYyBJTlRFR0VSO1xuXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlcyBBREQgQ09MVU1OIHN0b3J5RGlzdHJpYnV0aW9uTGlzdElkIFNUUklORztcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX2J5X2Rpc3RyaWJ1dGlvbl9saXN0XG4gICAgICAgIE9OIG1lc3NhZ2VzKHN0b3J5RGlzdHJpYnV0aW9uTGlzdElkLCByZWNlaXZlZF9hdClcbiAgICAgICAgV0hFUkUgc3RvcnlEaXN0cmlidXRpb25MaXN0SWQgSVMgTk9UIE5VTEw7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gNjEnKTtcbiAgfSkoKTtcblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjE6IHN1Y2Nlc3MhJyk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT2UsaUNBQ2IsZ0JBQ0EsSUFDQSxRQUNNO0FBQ04sTUFBSSxrQkFBa0IsSUFBSTtBQUN4QjtBQUFBLEVBQ0Y7QUFFQSxLQUFHLFlBQVksTUFBTTtBQUNuQixPQUFHLEtBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FtQkY7QUFFQSxPQUFHLE9BQU8sbUJBQW1CO0FBQUEsRUFDL0IsQ0FBQyxFQUFFO0FBRUgsU0FBTyxLQUFLLG1DQUFtQztBQUNqRDtBQXBDd0IiLAogICJuYW1lcyI6IFtdCn0K
