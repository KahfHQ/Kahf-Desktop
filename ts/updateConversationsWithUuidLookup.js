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
var updateConversationsWithUuidLookup_exports = {};
__export(updateConversationsWithUuidLookup_exports, {
  updateConversationsWithUuidLookup: () => updateConversationsWithUuidLookup
});
module.exports = __toCommonJS(updateConversationsWithUuidLookup_exports);
var import_assert = require("./util/assert");
var import_getOwn = require("./util/getOwn");
var import_isNotNil = require("./util/isNotNil");
async function updateConversationsWithUuidLookup({
  conversationController,
  conversations,
  messaging
}) {
  const e164s = conversations.map((conversation) => conversation.get("e164")).filter(import_isNotNil.isNotNil);
  if (!e164s.length) {
    return;
  }
  const serverLookup = await messaging.getUuidsForE164s(e164s);
  await Promise.all(conversations.map(async (conversation) => {
    const e164 = conversation.get("e164");
    if (!e164) {
      return;
    }
    let finalConversation;
    const uuidFromServer = (0, import_getOwn.getOwn)(serverLookup, e164);
    if (uuidFromServer) {
      const maybeFinalConversation = conversationController.maybeMergeContacts({
        aci: uuidFromServer,
        e164,
        reason: "updateConversationsWithUuidLookup"
      });
      (0, import_assert.assert)(maybeFinalConversation, "updateConversationsWithUuidLookup: expected a conversation to be found or created");
      finalConversation = maybeFinalConversation;
    } else {
      finalConversation = conversation;
    }
    let finalUuid = finalConversation.getUuid();
    if (!uuidFromServer && finalUuid) {
      const doesAccountExist = await messaging.checkAccountExistence(finalUuid);
      if (!doesAccountExist) {
        finalConversation.updateUuid(void 0);
        finalUuid = void 0;
      }
    }
    if (!finalConversation.get("e164") || !finalUuid) {
      finalConversation.setUnregistered();
    }
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateConversationsWithUuidLookup
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uQ29udHJvbGxlciB9IGZyb20gJy4vQ29udmVyc2F0aW9uQ29udHJvbGxlcic7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi9tb2RlbHMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSBTZW5kTWVzc2FnZSBmcm9tICcuL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRPd24gfSBmcm9tICcuL3V0aWwvZ2V0T3duJztcbmltcG9ydCB7IGlzTm90TmlsIH0gZnJvbSAnLi91dGlsL2lzTm90TmlsJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbnZlcnNhdGlvbnNXaXRoVXVpZExvb2t1cCh7XG4gIGNvbnZlcnNhdGlvbkNvbnRyb2xsZXIsXG4gIGNvbnZlcnNhdGlvbnMsXG4gIG1lc3NhZ2luZyxcbn06IFJlYWRvbmx5PHtcbiAgY29udmVyc2F0aW9uQ29udHJvbGxlcjogUGljazxcbiAgICBDb252ZXJzYXRpb25Db250cm9sbGVyLFxuICAgICdtYXliZU1lcmdlQ29udGFjdHMnIHwgJ2dldCdcbiAgPjtcbiAgY29udmVyc2F0aW9uczogUmVhZG9ubHlBcnJheTxDb252ZXJzYXRpb25Nb2RlbD47XG4gIG1lc3NhZ2luZzogUGljazxTZW5kTWVzc2FnZSwgJ2dldFV1aWRzRm9yRTE2NHMnIHwgJ2NoZWNrQWNjb3VudEV4aXN0ZW5jZSc+O1xufT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZTE2NHMgPSBjb252ZXJzYXRpb25zXG4gICAgLm1hcChjb252ZXJzYXRpb24gPT4gY29udmVyc2F0aW9uLmdldCgnZTE2NCcpKVxuICAgIC5maWx0ZXIoaXNOb3ROaWwpO1xuICBpZiAoIWUxNjRzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHNlcnZlckxvb2t1cCA9IGF3YWl0IG1lc3NhZ2luZy5nZXRVdWlkc0ZvckUxNjRzKGUxNjRzKTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBjb252ZXJzYXRpb25zLm1hcChhc3luYyBjb252ZXJzYXRpb24gPT4ge1xuICAgICAgY29uc3QgZTE2NCA9IGNvbnZlcnNhdGlvbi5nZXQoJ2UxNjQnKTtcbiAgICAgIGlmICghZTE2NCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBmaW5hbENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWw7XG5cbiAgICAgIGNvbnN0IHV1aWRGcm9tU2VydmVyID0gZ2V0T3duKHNlcnZlckxvb2t1cCwgZTE2NCk7XG4gICAgICBpZiAodXVpZEZyb21TZXJ2ZXIpIHtcbiAgICAgICAgY29uc3QgbWF5YmVGaW5hbENvbnZlcnNhdGlvbiA9XG4gICAgICAgICAgY29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgICAgYWNpOiB1dWlkRnJvbVNlcnZlcixcbiAgICAgICAgICAgIGUxNjQsXG4gICAgICAgICAgICByZWFzb246ICd1cGRhdGVDb252ZXJzYXRpb25zV2l0aFV1aWRMb29rdXAnLFxuICAgICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQoXG4gICAgICAgICAgbWF5YmVGaW5hbENvbnZlcnNhdGlvbixcbiAgICAgICAgICAndXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwOiBleHBlY3RlZCBhIGNvbnZlcnNhdGlvbiB0byBiZSBmb3VuZCBvciBjcmVhdGVkJ1xuICAgICAgICApO1xuICAgICAgICBmaW5hbENvbnZlcnNhdGlvbiA9IG1heWJlRmluYWxDb252ZXJzYXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5hbENvbnZlcnNhdGlvbiA9IGNvbnZlcnNhdGlvbjtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZ290IG5vIHV1aWQgZnJvbSBDRFMgc28gZWl0aGVyIHRoZSBwZXJzb24gaXMgbm93IHVucmVnaXN0ZXJlZCBvclxuICAgICAgLy8gdGhleSBjYW4ndCBiZSBsb29rZWQgdXAgYnkgYSBwaG9uZSBudW1iZXIuIENoZWNrIHRoYXQgdXVpZCBzdGlsbCBleGlzdHMsXG4gICAgICAvLyBhbmQgaWYgbm90IC0gZHJvcCBpdC5cbiAgICAgIGxldCBmaW5hbFV1aWQgPSBmaW5hbENvbnZlcnNhdGlvbi5nZXRVdWlkKCk7XG4gICAgICBpZiAoIXV1aWRGcm9tU2VydmVyICYmIGZpbmFsVXVpZCkge1xuICAgICAgICBjb25zdCBkb2VzQWNjb3VudEV4aXN0ID0gYXdhaXQgbWVzc2FnaW5nLmNoZWNrQWNjb3VudEV4aXN0ZW5jZShcbiAgICAgICAgICBmaW5hbFV1aWRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFkb2VzQWNjb3VudEV4aXN0KSB7XG4gICAgICAgICAgZmluYWxDb252ZXJzYXRpb24udXBkYXRlVXVpZCh1bmRlZmluZWQpO1xuICAgICAgICAgIGZpbmFsVXVpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZpbmFsQ29udmVyc2F0aW9uLmdldCgnZTE2NCcpIHx8ICFmaW5hbFV1aWQpIHtcbiAgICAgICAgZmluYWxDb252ZXJzYXRpb24uc2V0VW5yZWdpc3RlcmVkKCk7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQSxvQkFBdUI7QUFDdkIsb0JBQXVCO0FBQ3ZCLHNCQUF5QjtBQUV6QixpREFBd0Q7QUFBQSxFQUN0RDtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FRaUI7QUFDakIsUUFBTSxRQUFRLGNBQ1gsSUFBSSxrQkFBZ0IsYUFBYSxJQUFJLE1BQU0sQ0FBQyxFQUM1QyxPQUFPLHdCQUFRO0FBQ2xCLE1BQUksQ0FBQyxNQUFNLFFBQVE7QUFDakI7QUFBQSxFQUNGO0FBRUEsUUFBTSxlQUFlLE1BQU0sVUFBVSxpQkFBaUIsS0FBSztBQUUzRCxRQUFNLFFBQVEsSUFDWixjQUFjLElBQUksT0FBTSxpQkFBZ0I7QUFDdEMsVUFBTSxPQUFPLGFBQWEsSUFBSSxNQUFNO0FBQ3BDLFFBQUksQ0FBQyxNQUFNO0FBQ1Q7QUFBQSxJQUNGO0FBRUEsUUFBSTtBQUVKLFVBQU0saUJBQWlCLDBCQUFPLGNBQWMsSUFBSTtBQUNoRCxRQUFJLGdCQUFnQjtBQUNsQixZQUFNLHlCQUNKLHVCQUF1QixtQkFBbUI7QUFBQSxRQUN4QyxLQUFLO0FBQUEsUUFDTDtBQUFBLFFBQ0EsUUFBUTtBQUFBLE1BQ1YsQ0FBQztBQUNILGdDQUNFLHdCQUNBLG1GQUNGO0FBQ0EsMEJBQW9CO0FBQUEsSUFDdEIsT0FBTztBQUNMLDBCQUFvQjtBQUFBLElBQ3RCO0FBS0EsUUFBSSxZQUFZLGtCQUFrQixRQUFRO0FBQzFDLFFBQUksQ0FBQyxrQkFBa0IsV0FBVztBQUNoQyxZQUFNLG1CQUFtQixNQUFNLFVBQVUsc0JBQ3ZDLFNBQ0Y7QUFDQSxVQUFJLENBQUMsa0JBQWtCO0FBQ3JCLDBCQUFrQixXQUFXLE1BQVM7QUFDdEMsb0JBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUVBLFFBQUksQ0FBQyxrQkFBa0IsSUFBSSxNQUFNLEtBQUssQ0FBQyxXQUFXO0FBQ2hELHdCQUFrQixnQkFBZ0I7QUFBQSxJQUNwQztBQUFBLEVBQ0YsQ0FBQyxDQUNIO0FBQ0Y7QUFsRXNCIiwKICAibmFtZXMiOiBbXQp9Cg==
