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
var getFakeDistributionLists_exports = {};
__export(getFakeDistributionLists_exports, {
  getFakeDistributionList: () => getFakeDistributionList,
  getFakeDistributionLists: () => getFakeDistributionLists,
  getMyStories: () => getMyStories
});
module.exports = __toCommonJS(getFakeDistributionLists_exports);
var import_casual = __toESM(require("casual"));
var import_Stories = require("../../types/Stories");
var import_UUID = require("../../types/UUID");
function getFakeDistributionLists() {
  return [
    getMyStories(),
    ...Array.from(Array(import_casual.default.integer(2, 8)), getFakeDistributionList)
  ];
}
function getFakeDistributionList() {
  return {
    allowsReplies: Boolean(import_casual.default.coin_flip),
    id: import_UUID.UUID.generate().toString(),
    isBlockList: false,
    memberUuids: Array.from(Array(import_casual.default.integer(3, 12)), () => import_UUID.UUID.generate().toString()),
    name: import_casual.default.title
  };
}
function getMyStories() {
  return {
    allowsReplies: true,
    id: import_Stories.MY_STORIES_ID,
    isBlockList: true,
    memberUuids: [],
    name: import_Stories.MY_STORIES_ID
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFakeDistributionList,
  getFakeDistributionLists,
  getMyStories
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0RmFrZURpc3RyaWJ1dGlvbkxpc3RzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBjYXN1YWwgZnJvbSAnY2FzdWFsJztcblxuaW1wb3J0IHR5cGUgeyBTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZSB9IGZyb20gJy4uLy4uL3N0YXRlL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgTVlfU1RPUklFU19JRCB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmFrZURpc3RyaWJ1dGlvbkxpc3RzKCk6IEFycmF5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlPiB7XG4gIHJldHVybiBbXG4gICAgZ2V0TXlTdG9yaWVzKCksXG4gICAgLi4uQXJyYXkuZnJvbShBcnJheShjYXN1YWwuaW50ZWdlcigyLCA4KSksIGdldEZha2VEaXN0cmlidXRpb25MaXN0KSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZha2VEaXN0cmlidXRpb25MaXN0KCk6IFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICBhbGxvd3NSZXBsaWVzOiBCb29sZWFuKGNhc3VhbC5jb2luX2ZsaXApLFxuICAgIGlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICBpc0Jsb2NrTGlzdDogZmFsc2UsXG4gICAgbWVtYmVyVXVpZHM6IEFycmF5LmZyb20oQXJyYXkoY2FzdWFsLmludGVnZXIoMywgMTIpKSwgKCkgPT5cbiAgICAgIFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpXG4gICAgKSxcbiAgICBuYW1lOiBjYXN1YWwudGl0bGUsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNeVN0b3JpZXMoKTogU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUge1xuICByZXR1cm4ge1xuICAgIGFsbG93c1JlcGxpZXM6IHRydWUsXG4gICAgaWQ6IE1ZX1NUT1JJRVNfSUQsXG4gICAgaXNCbG9ja0xpc3Q6IHRydWUsXG4gICAgbWVtYmVyVXVpZHM6IFtdLFxuICAgIG5hbWU6IE1ZX1NUT1JJRVNfSUQsXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUFtQjtBQUduQixxQkFBOEI7QUFDOUIsa0JBQXFCO0FBRWQsb0NBQTBFO0FBQy9FLFNBQU87QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLEdBQUcsTUFBTSxLQUFLLE1BQU0sc0JBQU8sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLHVCQUF1QjtBQUFBLEVBQ3BFO0FBQ0Y7QUFMZ0IsQUFPVCxtQ0FBa0U7QUFDdkUsU0FBTztBQUFBLElBQ0wsZUFBZSxRQUFRLHNCQUFPLFNBQVM7QUFBQSxJQUN2QyxJQUFJLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsYUFBYSxNQUFNLEtBQUssTUFBTSxzQkFBTyxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFDcEQsaUJBQUssU0FBUyxFQUFFLFNBQVMsQ0FDM0I7QUFBQSxJQUNBLE1BQU0sc0JBQU87QUFBQSxFQUNmO0FBQ0Y7QUFWZ0IsQUFZVCx3QkFBdUQ7QUFDNUQsU0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLElBQ2YsSUFBSTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsYUFBYSxDQUFDO0FBQUEsSUFDZCxNQUFNO0FBQUEsRUFDUjtBQUNGO0FBUmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
