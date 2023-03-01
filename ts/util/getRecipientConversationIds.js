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
var getRecipientConversationIds_exports = {};
__export(getRecipientConversationIds_exports, {
  getRecipientConversationIds: () => getRecipientConversationIds
});
module.exports = __toCommonJS(getRecipientConversationIds_exports);
var import_getRecipients = require("./getRecipients");
var import_assert = require("./assert");
function getRecipientConversationIds(conversationAttrs) {
  const recipients = (0, import_getRecipients.getRecipients)(conversationAttrs);
  const conversationIds = recipients.map((identifier) => {
    const conversation = window.ConversationController.getOrCreate(identifier, "private");
    (0, import_assert.strictAssert)(conversation, "getRecipientConversationIds should have created conversation!");
    return conversation.id;
  });
  return new Set(conversationIds);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRecipientConversationIds
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0UmVjaXBpZW50Q29udmVyc2F0aW9uSWRzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcblxuaW1wb3J0IHsgZ2V0UmVjaXBpZW50cyB9IGZyb20gJy4vZ2V0UmVjaXBpZW50cyc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuL2Fzc2VydCc7XG5cbi8vIFJlY2lwaWVudHMgaW5jbHVkZXMgb25seSB0aGUgcGVvcGxlIHdlJ2xsIGFjdHVhbGx5IHNlbmQgdG8gZm9yIHRoaXMgY29udmVyc2F0aW9uXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVjaXBpZW50Q29udmVyc2F0aW9uSWRzKFxuICBjb252ZXJzYXRpb25BdHRyczogQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGVcbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgcmVjaXBpZW50cyA9IGdldFJlY2lwaWVudHMoY29udmVyc2F0aW9uQXR0cnMpO1xuICBjb25zdCBjb252ZXJzYXRpb25JZHMgPSByZWNpcGllbnRzLm1hcChpZGVudGlmaWVyID0+IHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShcbiAgICAgIGlkZW50aWZpZXIsXG4gICAgICAncHJpdmF0ZSdcbiAgICApO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICdnZXRSZWNpcGllbnRDb252ZXJzYXRpb25JZHMgc2hvdWxkIGhhdmUgY3JlYXRlZCBjb252ZXJzYXRpb24hJ1xuICAgICk7XG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbi5pZDtcbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBTZXQoY29udmVyc2F0aW9uSWRzKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSwyQkFBOEI7QUFDOUIsb0JBQTZCO0FBR3RCLHFDQUNMLG1CQUNhO0FBQ2IsUUFBTSxhQUFhLHdDQUFjLGlCQUFpQjtBQUNsRCxRQUFNLGtCQUFrQixXQUFXLElBQUksZ0JBQWM7QUFDbkQsVUFBTSxlQUFlLE9BQU8sdUJBQXVCLFlBQ2pELFlBQ0EsU0FDRjtBQUNBLG9DQUNFLGNBQ0EsK0RBQ0Y7QUFDQSxXQUFPLGFBQWE7QUFBQSxFQUN0QixDQUFDO0FBRUQsU0FBTyxJQUFJLElBQUksZUFBZTtBQUNoQztBQWpCZ0IiLAogICJuYW1lcyI6IFtdCn0K
