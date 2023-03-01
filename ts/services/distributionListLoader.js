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
var distributionListLoader_exports = {};
__export(distributionListLoader_exports, {
  getDistributionListsForRedux: () => getDistributionListsForRedux,
  loadDistributionLists: () => loadDistributionLists
});
module.exports = __toCommonJS(distributionListLoader_exports);
var import_Client = __toESM(require("../sql/Client"));
var import_assert = require("../util/assert");
let distributionLists;
async function loadDistributionLists() {
  distributionLists = await import_Client.default.getAllStoryDistributionsWithMembers();
}
function getDistributionListsForRedux() {
  (0, import_assert.strictAssert)(distributionLists, "distributionLists has not been loaded");
  const lists = distributionLists.map((list) => ({
    allowsReplies: Boolean(list.allowsReplies),
    deletedAtTimestamp: list.deletedAtTimestamp,
    id: list.id,
    isBlockList: Boolean(list.isBlockList),
    name: list.name,
    memberUuids: list.members
  })).filter((list) => !list.deletedAtTimestamp);
  distributionLists = void 0;
  return lists;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDistributionListsForRedux,
  loadDistributionLists
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGlzdHJpYnV0aW9uTGlzdExvYWRlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgZGF0YUludGVyZmFjZSBmcm9tICcuLi9zcWwvQ2xpZW50JztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25XaXRoTWVtYmVyc1R5cGUgfSBmcm9tICcuLi9zcWwvSW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdG9yeURpc3RyaWJ1dGlvbkxpc3RzJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxubGV0IGRpc3RyaWJ1dGlvbkxpc3RzOiBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbldpdGhNZW1iZXJzVHlwZT4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkRGlzdHJpYnV0aW9uTGlzdHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGRpc3RyaWJ1dGlvbkxpc3RzID0gYXdhaXQgZGF0YUludGVyZmFjZS5nZXRBbGxTdG9yeURpc3RyaWJ1dGlvbnNXaXRoTWVtYmVycygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzdHJpYnV0aW9uTGlzdHNGb3JSZWR1eCgpOiBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZT4ge1xuICBzdHJpY3RBc3NlcnQoZGlzdHJpYnV0aW9uTGlzdHMsICdkaXN0cmlidXRpb25MaXN0cyBoYXMgbm90IGJlZW4gbG9hZGVkJyk7XG5cbiAgY29uc3QgbGlzdHMgPSBkaXN0cmlidXRpb25MaXN0c1xuICAgIC5tYXAobGlzdCA9PiAoe1xuICAgICAgYWxsb3dzUmVwbGllczogQm9vbGVhbihsaXN0LmFsbG93c1JlcGxpZXMpLFxuICAgICAgZGVsZXRlZEF0VGltZXN0YW1wOiBsaXN0LmRlbGV0ZWRBdFRpbWVzdGFtcCxcbiAgICAgIGlkOiBsaXN0LmlkLFxuICAgICAgaXNCbG9ja0xpc3Q6IEJvb2xlYW4obGlzdC5pc0Jsb2NrTGlzdCksXG4gICAgICBuYW1lOiBsaXN0Lm5hbWUsXG4gICAgICBtZW1iZXJVdWlkczogbGlzdC5tZW1iZXJzLFxuICAgIH0pKVxuICAgIC5maWx0ZXIobGlzdCA9PiAhbGlzdC5kZWxldGVkQXRUaW1lc3RhbXApO1xuXG4gIGRpc3RyaWJ1dGlvbkxpc3RzID0gdW5kZWZpbmVkO1xuXG4gIHJldHVybiBsaXN0cztcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUEwQjtBQUcxQixvQkFBNkI7QUFFN0IsSUFBSTtBQUVKLHVDQUE2RDtBQUMzRCxzQkFBb0IsTUFBTSxzQkFBYyxvQ0FBb0M7QUFDOUU7QUFGc0IsQUFJZix3Q0FBOEU7QUFDbkYsa0NBQWEsbUJBQW1CLHVDQUF1QztBQUV2RSxRQUFNLFFBQVEsa0JBQ1gsSUFBSSxVQUFTO0FBQUEsSUFDWixlQUFlLFFBQVEsS0FBSyxhQUFhO0FBQUEsSUFDekMsb0JBQW9CLEtBQUs7QUFBQSxJQUN6QixJQUFJLEtBQUs7QUFBQSxJQUNULGFBQWEsUUFBUSxLQUFLLFdBQVc7QUFBQSxJQUNyQyxNQUFNLEtBQUs7QUFBQSxJQUNYLGFBQWEsS0FBSztBQUFBLEVBQ3BCLEVBQUUsRUFDRCxPQUFPLFVBQVEsQ0FBQyxLQUFLLGtCQUFrQjtBQUUxQyxzQkFBb0I7QUFFcEIsU0FBTztBQUNUO0FBakJnQiIsCiAgIm5hbWVzIjogW10KfQo=
