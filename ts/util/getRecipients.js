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
var getRecipients_exports = {};
__export(getRecipients_exports, {
  getRecipients: () => getRecipients
});
module.exports = __toCommonJS(getRecipients_exports);
var import_lodash = require("lodash");
var import_getConversationMembers = require("./getConversationMembers");
var import_getSendTarget = require("./getSendTarget");
var import_whatTypeOfConversation = require("./whatTypeOfConversation");
var import_isNotNil = require("./isNotNil");
function getRecipients(conversationAttributes, {
  includePendingMembers,
  extraConversationsForSend
} = {}) {
  if ((0, import_whatTypeOfConversation.isDirectConversation)(conversationAttributes)) {
    return [(0, import_getSendTarget.getSendTarget)(conversationAttributes)];
  }
  const members = (0, import_getConversationMembers.getConversationMembers)(conversationAttributes, {
    includePendingMembers
  });
  const extraConversations = extraConversationsForSend ? extraConversationsForSend.map((id) => window.ConversationController.get(id)?.attributes).filter(import_isNotNil.isNotNil) : [];
  const uniqueMembers = extraConversations.length ? (0, import_lodash.uniq)([...members, ...extraConversations]) : members;
  return (0, import_lodash.compact)(uniqueMembers.map((memberAttrs) => (0, import_whatTypeOfConversation.isMe)(memberAttrs) ? null : (0, import_getSendTarget.getSendTarget)(memberAttrs)));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRecipients
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0UmVjaXBpZW50cy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBjb21wYWN0LCB1bmlxIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuXG5pbXBvcnQgeyBnZXRDb252ZXJzYXRpb25NZW1iZXJzIH0gZnJvbSAnLi9nZXRDb252ZXJzYXRpb25NZW1iZXJzJztcbmltcG9ydCB7IGdldFNlbmRUYXJnZXQgfSBmcm9tICcuL2dldFNlbmRUYXJnZXQnO1xuaW1wb3J0IHsgaXNEaXJlY3RDb252ZXJzYXRpb24sIGlzTWUgfSBmcm9tICcuL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuL2lzTm90TmlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY2lwaWVudHMoXG4gIGNvbnZlcnNhdGlvbkF0dHJpYnV0ZXM6IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLFxuICB7XG4gICAgaW5jbHVkZVBlbmRpbmdNZW1iZXJzLFxuICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQsXG4gIH06IHtcbiAgICBpbmNsdWRlUGVuZGluZ01lbWJlcnM/OiBib29sZWFuO1xuICAgIGV4dHJhQ29udmVyc2F0aW9uc0ZvclNlbmQ/OiBBcnJheTxzdHJpbmc+O1xuICB9ID0ge31cbik6IEFycmF5PHN0cmluZz4ge1xuICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uQXR0cmlidXRlcykpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIHJldHVybiBbZ2V0U2VuZFRhcmdldChjb252ZXJzYXRpb25BdHRyaWJ1dGVzKSFdO1xuICB9XG5cbiAgY29uc3QgbWVtYmVycyA9IGdldENvbnZlcnNhdGlvbk1lbWJlcnMoY29udmVyc2F0aW9uQXR0cmlidXRlcywge1xuICAgIGluY2x1ZGVQZW5kaW5nTWVtYmVycyxcbiAgfSk7XG5cbiAgLy8gVGhlcmUgYXJlIGNhc2VzIHdoZXJlIHdlIG5lZWQgdG8gc2VuZCB0byBzb21lb25lIHdlIGp1c3QgcmVtb3ZlZCBmcm9tIHRoZSBncm91cCwgdG9cbiAgLy8gICBsZXQgdGhlbSBrbm93IHRoYXQgd2UgcmVtb3ZlZCB0aGVtLiBJbiB0aGF0IGNhc2UsIHdlIG5lZWQgdG8gc2VuZCB0byBtb3JlIHRoYW5cbiAgLy8gICBhcmUgY3VycmVudGx5IGluIHRoZSBncm91cC5cbiAgY29uc3QgZXh0cmFDb252ZXJzYXRpb25zID0gZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZFxuICAgID8gZXh0cmFDb252ZXJzYXRpb25zRm9yU2VuZFxuICAgICAgICAubWFwKGlkID0+IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChpZCk/LmF0dHJpYnV0ZXMpXG4gICAgICAgIC5maWx0ZXIoaXNOb3ROaWwpXG4gICAgOiBbXTtcblxuICBjb25zdCB1bmlxdWVNZW1iZXJzID0gZXh0cmFDb252ZXJzYXRpb25zLmxlbmd0aFxuICAgID8gdW5pcShbLi4ubWVtYmVycywgLi4uZXh0cmFDb252ZXJzYXRpb25zXSlcbiAgICA6IG1lbWJlcnM7XG5cbiAgLy8gRWxpbWluYXRlIG91cnNlbGZcbiAgcmV0dXJuIGNvbXBhY3QoXG4gICAgdW5pcXVlTWVtYmVycy5tYXAobWVtYmVyQXR0cnMgPT5cbiAgICAgIGlzTWUobWVtYmVyQXR0cnMpID8gbnVsbCA6IGdldFNlbmRUYXJnZXQobWVtYmVyQXR0cnMpXG4gICAgKVxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUE4QjtBQUk5QixvQ0FBdUM7QUFDdkMsMkJBQThCO0FBQzlCLG9DQUEyQztBQUMzQyxzQkFBeUI7QUFFbEIsdUJBQ0wsd0JBQ0E7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLElBSUUsQ0FBQyxHQUNVO0FBQ2YsTUFBSSx3REFBcUIsc0JBQXNCLEdBQUc7QUFFaEQsV0FBTyxDQUFDLHdDQUFjLHNCQUFzQixDQUFFO0FBQUEsRUFDaEQ7QUFFQSxRQUFNLFVBQVUsMERBQXVCLHdCQUF3QjtBQUFBLElBQzdEO0FBQUEsRUFDRixDQUFDO0FBS0QsUUFBTSxxQkFBcUIsNEJBQ3ZCLDBCQUNHLElBQUksUUFBTSxPQUFPLHVCQUF1QixJQUFJLEVBQUUsR0FBRyxVQUFVLEVBQzNELE9BQU8sd0JBQVEsSUFDbEIsQ0FBQztBQUVMLFFBQU0sZ0JBQWdCLG1CQUFtQixTQUNyQyx3QkFBSyxDQUFDLEdBQUcsU0FBUyxHQUFHLGtCQUFrQixDQUFDLElBQ3hDO0FBR0osU0FBTywyQkFDTCxjQUFjLElBQUksaUJBQ2hCLHdDQUFLLFdBQVcsSUFBSSxPQUFPLHdDQUFjLFdBQVcsQ0FDdEQsQ0FDRjtBQUNGO0FBdENnQiIsCiAgIm5hbWVzIjogW10KfQo=
