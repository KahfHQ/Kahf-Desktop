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
var add_urgent_to_unprocessed_exports = {};
__export(add_urgent_to_unprocessed_exports, {
  default: () => updateToSchemaVersion63
});
module.exports = __toCommonJS(add_urgent_to_unprocessed_exports);
function updateToSchemaVersion63(currentVersion, db, logger) {
  if (currentVersion >= 63) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE unprocessed ADD COLUMN urgent INTEGER;
      `);
    db.pragma("user_version = 63");
  })();
  logger.info("updateToSchemaVersion63: success!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiNjMtYWRkLXVyZ2VudC10by11bnByb2Nlc3NlZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgRGF0YWJhc2UgfSBmcm9tICdiZXR0ZXItc3FsaXRlMyc7XG5cbmltcG9ydCB0eXBlIHsgTG9nZ2VyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL0xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb242MyhcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gNjMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhcbiAgICAgIGBcbiAgICAgIEFMVEVSIFRBQkxFIHVucHJvY2Vzc2VkIEFERCBDT0xVTU4gdXJnZW50IElOVEVHRVI7XG4gICAgICBgXG4gICAgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gNjMnKTtcbiAgfSkoKTtcblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjM6IHN1Y2Nlc3MhJyk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT2UsaUNBQ2IsZ0JBQ0EsSUFDQSxRQUNNO0FBQ04sTUFBSSxrQkFBa0IsSUFBSTtBQUN4QjtBQUFBLEVBQ0Y7QUFFQSxLQUFHLFlBQVksTUFBTTtBQUNuQixPQUFHLEtBQ0Q7QUFBQTtBQUFBLE9BR0Y7QUFFQSxPQUFHLE9BQU8sbUJBQW1CO0FBQUEsRUFDL0IsQ0FBQyxFQUFFO0FBRUgsU0FBTyxLQUFLLG1DQUFtQztBQUNqRDtBQXBCd0IiLAogICJuYW1lcyI6IFtdCn0K
