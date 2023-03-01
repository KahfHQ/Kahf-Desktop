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
var getSignalConnections_exports = {};
__export(getSignalConnections_exports, {
  getSignalConnections: () => getSignalConnections,
  isSignalConnection: () => isSignalConnection
});
module.exports = __toCommonJS(getSignalConnections_exports);
var import_isInSystemContacts = require("./isInSystemContacts");
var import_whatTypeOfConversation = require("./whatTypeOfConversation");
function isSignalConnection(conversation) {
  return (0, import_whatTypeOfConversation.isDirectConversation)(conversation) && (conversation.profileSharing || (0, import_isInSystemContacts.isInSystemContacts)(conversation));
}
function getSignalConnections() {
  return window.getConversations().filter((conversation) => isSignalConnection(conversation.attributes));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSignalConnections,
  isSignalConnection
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0U2lnbmFsQ29ubmVjdGlvbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgaXNJblN5c3RlbUNvbnRhY3RzIH0gZnJvbSAnLi9pc0luU3lzdGVtQ29udGFjdHMnO1xuaW1wb3J0IHsgaXNEaXJlY3RDb252ZXJzYXRpb24gfSBmcm9tICcuL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTaWduYWxDb25uZWN0aW9uKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvblR5cGUgfCBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVxuKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uKSAmJlxuICAgIChjb252ZXJzYXRpb24ucHJvZmlsZVNoYXJpbmcgfHwgaXNJblN5c3RlbUNvbnRhY3RzKGNvbnZlcnNhdGlvbikpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaWduYWxDb25uZWN0aW9ucygpOiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4ge1xuICByZXR1cm4gd2luZG93XG4gICAgLmdldENvbnZlcnNhdGlvbnMoKVxuICAgIC5maWx0ZXIoY29udmVyc2F0aW9uID0+IGlzU2lnbmFsQ29ubmVjdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcykpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUEsZ0NBQW1DO0FBQ25DLG9DQUFxQztBQUU5Qiw0QkFDTCxjQUNTO0FBQ1QsU0FDRSx3REFBcUIsWUFBWSxLQUNoQyxjQUFhLGtCQUFrQixrREFBbUIsWUFBWTtBQUVuRTtBQVBnQixBQVNULGdDQUEwRDtBQUMvRCxTQUFPLE9BQ0osaUJBQWlCLEVBQ2pCLE9BQU8sa0JBQWdCLG1CQUFtQixhQUFhLFVBQVUsQ0FBQztBQUN2RTtBQUpnQiIsCiAgIm5hbWVzIjogW10KfQo=
