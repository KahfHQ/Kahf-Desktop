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
var storyDistributionLists_exports = {};
__export(storyDistributionLists_exports, {
  getDistributionListSelector: () => getDistributionListSelector,
  getDistributionLists: () => getDistributionLists,
  getDistributionListsWithMembers: () => getDistributionListsWithMembers
});
module.exports = __toCommonJS(storyDistributionLists_exports);
var import_reselect = require("reselect");
var import_conversations = require("./conversations");
var import_Stories = require("../../types/Stories");
const getDistributionLists = /* @__PURE__ */ __name((state) => state.storyDistributionLists.distributionLists.filter((list) => !list.deletedAtTimestamp).sort((list) => list.id === import_Stories.MY_STORIES_ID ? -1 : 1), "getDistributionLists");
const getDistributionListSelector = (0, import_reselect.createSelector)(getDistributionLists, (distributionLists) => (id) => distributionLists.find((list) => list.id === id));
const getDistributionListsWithMembers = (0, import_reselect.createSelector)(import_conversations.getConversationSelector, getDistributionLists, (conversationSelector, distributionLists) => distributionLists.map((list) => ({
  ...list,
  members: list.memberUuids.map((uuid) => conversationSelector(uuid))
})));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDistributionListSelector,
  getDistributionLists,
  getDistributionListsWithMembers
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RvcnlEaXN0cmlidXRpb25MaXN0cy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUgfSBmcm9tICcuLi9kdWNrcy9zdG9yeURpc3RyaWJ1dGlvbkxpc3RzJztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0V2l0aE1lbWJlcnNEYXRhVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IgfSBmcm9tICcuL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgTVlfU1RPUklFU19JRCB9IGZyb20gJy4uLy4uL3R5cGVzL1N0b3JpZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0RGlzdHJpYnV0aW9uTGlzdHMgPSAoXG4gIHN0YXRlOiBTdGF0ZVR5cGVcbik6IEFycmF5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdERhdGFUeXBlPiA9PlxuICBzdGF0ZS5zdG9yeURpc3RyaWJ1dGlvbkxpc3RzLmRpc3RyaWJ1dGlvbkxpc3RzXG4gICAgLmZpbHRlcihsaXN0ID0+ICFsaXN0LmRlbGV0ZWRBdFRpbWVzdGFtcClcbiAgICAuc29ydChsaXN0ID0+IChsaXN0LmlkID09PSBNWV9TVE9SSUVTX0lEID8gLTEgOiAxKSk7XG5cbmV4cG9ydCBjb25zdCBnZXREaXN0cmlidXRpb25MaXN0U2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0RGlzdHJpYnV0aW9uTGlzdHMsXG4gIGRpc3RyaWJ1dGlvbkxpc3RzID0+IChpZDogc3RyaW5nKSA9PlxuICAgIGRpc3RyaWJ1dGlvbkxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09PSBpZClcbik7XG5cbmV4cG9ydCBjb25zdCBnZXREaXN0cmlidXRpb25MaXN0c1dpdGhNZW1iZXJzID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENvbnZlcnNhdGlvblNlbGVjdG9yLFxuICBnZXREaXN0cmlidXRpb25MaXN0cyxcbiAgKFxuICAgIGNvbnZlcnNhdGlvblNlbGVjdG9yLFxuICAgIGRpc3RyaWJ1dGlvbkxpc3RzXG4gICk6IEFycmF5PFN0b3J5RGlzdHJpYnV0aW9uTGlzdFdpdGhNZW1iZXJzRGF0YVR5cGU+ID0+XG4gICAgZGlzdHJpYnV0aW9uTGlzdHMubWFwKGxpc3QgPT4gKHtcbiAgICAgIC4uLmxpc3QsXG4gICAgICBtZW1iZXJzOiBsaXN0Lm1lbWJlclV1aWRzLm1hcCh1dWlkID0+IGNvbnZlcnNhdGlvblNlbGVjdG9yKHV1aWQpKSxcbiAgICB9KSlcbik7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUErQjtBQUsvQiwyQkFBd0M7QUFDeEMscUJBQThCO0FBRXZCLE1BQU0sdUJBQXVCLHdCQUNsQyxVQUVBLE1BQU0sdUJBQXVCLGtCQUMxQixPQUFPLFVBQVEsQ0FBQyxLQUFLLGtCQUFrQixFQUN2QyxLQUFLLFVBQVMsS0FBSyxPQUFPLCtCQUFnQixLQUFLLENBQUUsR0FMbEI7QUFPN0IsTUFBTSw4QkFBOEIsb0NBQ3pDLHNCQUNBLHVCQUFxQixDQUFDLE9BQ3BCLGtCQUFrQixLQUFLLFVBQVEsS0FBSyxPQUFPLEVBQUUsQ0FDakQ7QUFFTyxNQUFNLGtDQUFrQyxvQ0FDN0MsOENBQ0Esc0JBQ0EsQ0FDRSxzQkFDQSxzQkFFQSxrQkFBa0IsSUFBSSxVQUFTO0FBQUEsS0FDMUI7QUFBQSxFQUNILFNBQVMsS0FBSyxZQUFZLElBQUksVUFBUSxxQkFBcUIsSUFBSSxDQUFDO0FBQ2xFLEVBQUUsQ0FDTjsiLAogICJuYW1lcyI6IFtdCn0K
