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
var calling_exports = {};
__export(calling_exports, {
  getActiveCall: () => getActiveCall,
  getActiveCallState: () => getActiveCallState,
  getCallSelector: () => getCallSelector,
  getCallsByConversation: () => getCallsByConversation,
  getIncomingCall: () => getIncomingCall,
  isInCall: () => isInCall,
  isInFullScreenCall: () => isInFullScreenCall,
  isInSpeakerView: () => isInSpeakerView
});
module.exports = __toCommonJS(calling_exports);
var import_reselect = require("reselect");
var import_calling = require("../ducks/calling");
var import_user = require("./user");
var import_getOwn = require("../../util/getOwn");
var import_Calling = require("../../types/Calling");
const getCalling = /* @__PURE__ */ __name((state) => state.calling, "getCalling");
const getActiveCallState = (0, import_reselect.createSelector)(getCalling, (state) => state.activeCallState);
const getCallsByConversation = (0, import_reselect.createSelector)(getCalling, (state) => state.callsByConversation);
const getCallSelector = (0, import_reselect.createSelector)(getCallsByConversation, (callsByConversation) => (conversationId) => (0, import_getOwn.getOwn)(callsByConversation, conversationId));
const getActiveCall = (0, import_reselect.createSelector)(getActiveCallState, getCallSelector, (activeCallState, callSelector) => {
  if (activeCallState && activeCallState.conversationId) {
    return callSelector(activeCallState.conversationId);
  }
  return void 0;
});
const isInCall = (0, import_reselect.createSelector)(getActiveCall, (call) => Boolean(call));
const isInFullScreenCall = (0, import_reselect.createSelector)(getCalling, (state) => Boolean(state.activeCallState && !state.activeCallState.pip));
const getIncomingCall = (0, import_reselect.createSelector)(getCallsByConversation, import_user.getUserACI, (callsByConversation, ourUuid) => {
  if (!ourUuid) {
    return void 0;
  }
  return (0, import_calling.getIncomingCall)(callsByConversation, ourUuid);
});
const isInSpeakerView = /* @__PURE__ */ __name((call) => {
  return Boolean(call?.viewMode === import_Calling.CallViewMode.Presentation || call?.viewMode === import_Calling.CallViewMode.Speaker);
}, "isInSpeakerView");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getActiveCall,
  getActiveCallState,
  getCallSelector,
  getCallsByConversation,
  getIncomingCall,
  isInCall,
  isInFullScreenCall,
  isInSpeakerView
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FsbGluZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSB9IGZyb20gJy4uL3JlZHVjZXInO1xuaW1wb3J0IHR5cGUge1xuICBBY3RpdmVDYWxsU3RhdGVUeXBlLFxuICBDYWxsaW5nU3RhdGVUeXBlLFxuICBDYWxsc0J5Q29udmVyc2F0aW9uVHlwZSxcbiAgRGlyZWN0Q2FsbFN0YXRlVHlwZSxcbiAgR3JvdXBDYWxsU3RhdGVUeXBlLFxufSBmcm9tICcuLi9kdWNrcy9jYWxsaW5nJztcbmltcG9ydCB7IGdldEluY29taW5nQ2FsbCBhcyBnZXRJbmNvbWluZ0NhbGxIZWxwZXIgfSBmcm9tICcuLi9kdWNrcy9jYWxsaW5nJztcbmltcG9ydCB7IGdldFVzZXJBQ0kgfSBmcm9tICcuL3VzZXInO1xuaW1wb3J0IHsgZ2V0T3duIH0gZnJvbSAnLi4vLi4vdXRpbC9nZXRPd24nO1xuaW1wb3J0IHsgQ2FsbFZpZXdNb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMvQ2FsbGluZyc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5cbmV4cG9ydCB0eXBlIENhbGxTdGF0ZVR5cGUgPSBEaXJlY3RDYWxsU3RhdGVUeXBlIHwgR3JvdXBDYWxsU3RhdGVUeXBlO1xuXG5jb25zdCBnZXRDYWxsaW5nID0gKHN0YXRlOiBTdGF0ZVR5cGUpOiBDYWxsaW5nU3RhdGVUeXBlID0+IHN0YXRlLmNhbGxpbmc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3RpdmVDYWxsU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q2FsbGluZyxcbiAgKHN0YXRlOiBDYWxsaW5nU3RhdGVUeXBlKSA9PiBzdGF0ZS5hY3RpdmVDYWxsU3RhdGVcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDYWxsc0J5Q29udmVyc2F0aW9uID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldENhbGxpbmcsXG4gIChzdGF0ZTogQ2FsbGluZ1N0YXRlVHlwZSk6IENhbGxzQnlDb252ZXJzYXRpb25UeXBlID0+XG4gICAgc3RhdGUuY2FsbHNCeUNvbnZlcnNhdGlvblxuKTtcblxuZXhwb3J0IHR5cGUgQ2FsbFNlbGVjdG9yVHlwZSA9IChcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKSA9PiBDYWxsU3RhdGVUeXBlIHwgdW5kZWZpbmVkO1xuZXhwb3J0IGNvbnN0IGdldENhbGxTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDYWxsc0J5Q29udmVyc2F0aW9uLFxuICAoY2FsbHNCeUNvbnZlcnNhdGlvbjogQ2FsbHNCeUNvbnZlcnNhdGlvblR5cGUpOiBDYWxsU2VsZWN0b3JUeXBlID0+XG4gICAgKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+XG4gICAgICBnZXRPd24oY2FsbHNCeUNvbnZlcnNhdGlvbiwgY29udmVyc2F0aW9uSWQpXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0aXZlQ2FsbCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRBY3RpdmVDYWxsU3RhdGUsXG4gIGdldENhbGxTZWxlY3RvcixcbiAgKGFjdGl2ZUNhbGxTdGF0ZSwgY2FsbFNlbGVjdG9yKTogdW5kZWZpbmVkIHwgQ2FsbFN0YXRlVHlwZSA9PiB7XG4gICAgaWYgKGFjdGl2ZUNhbGxTdGF0ZSAmJiBhY3RpdmVDYWxsU3RhdGUuY29udmVyc2F0aW9uSWQpIHtcbiAgICAgIHJldHVybiBjYWxsU2VsZWN0b3IoYWN0aXZlQ2FsbFN0YXRlLmNvbnZlcnNhdGlvbklkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgaXNJbkNhbGwgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0QWN0aXZlQ2FsbCxcbiAgKGNhbGw6IENhbGxTdGF0ZVR5cGUgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IEJvb2xlYW4oY2FsbClcbik7XG5cbmV4cG9ydCBjb25zdCBpc0luRnVsbFNjcmVlbkNhbGwgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q2FsbGluZyxcbiAgKHN0YXRlOiBDYWxsaW5nU3RhdGVUeXBlKTogYm9vbGVhbiA9PlxuICAgIEJvb2xlYW4oc3RhdGUuYWN0aXZlQ2FsbFN0YXRlICYmICFzdGF0ZS5hY3RpdmVDYWxsU3RhdGUucGlwKVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEluY29taW5nQ2FsbCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRDYWxsc0J5Q29udmVyc2F0aW9uLFxuICBnZXRVc2VyQUNJLFxuICAoXG4gICAgY2FsbHNCeUNvbnZlcnNhdGlvbjogQ2FsbHNCeUNvbnZlcnNhdGlvblR5cGUsXG4gICAgb3VyVXVpZDogVVVJRFN0cmluZ1R5cGUgfCB1bmRlZmluZWRcbiAgKTogdW5kZWZpbmVkIHwgRGlyZWN0Q2FsbFN0YXRlVHlwZSB8IEdyb3VwQ2FsbFN0YXRlVHlwZSA9PiB7XG4gICAgaWYgKCFvdXJVdWlkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRJbmNvbWluZ0NhbGxIZWxwZXIoY2FsbHNCeUNvbnZlcnNhdGlvbiwgb3VyVXVpZCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBpc0luU3BlYWtlclZpZXcgPSAoXG4gIGNhbGw6IFBpY2s8QWN0aXZlQ2FsbFN0YXRlVHlwZSwgJ3ZpZXdNb2RlJz4gfCB1bmRlZmluZWRcbik6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gQm9vbGVhbihcbiAgICBjYWxsPy52aWV3TW9kZSA9PT0gQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvbiB8fFxuICAgICAgY2FsbD8udmlld01vZGUgPT09IENhbGxWaWV3TW9kZS5TcGVha2VyXG4gICk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esc0JBQStCO0FBVS9CLHFCQUF5RDtBQUN6RCxrQkFBMkI7QUFDM0Isb0JBQXVCO0FBQ3ZCLHFCQUE2QjtBQUs3QixNQUFNLGFBQWEsd0JBQUMsVUFBdUMsTUFBTSxTQUE5QztBQUVaLE1BQU0scUJBQXFCLG9DQUNoQyxZQUNBLENBQUMsVUFBNEIsTUFBTSxlQUNyQztBQUVPLE1BQU0seUJBQXlCLG9DQUNwQyxZQUNBLENBQUMsVUFDQyxNQUFNLG1CQUNWO0FBS08sTUFBTSxrQkFBa0Isb0NBQzdCLHdCQUNBLENBQUMsd0JBQ0MsQ0FBQyxtQkFDQywwQkFBTyxxQkFBcUIsY0FBYyxDQUNoRDtBQUVPLE1BQU0sZ0JBQWdCLG9DQUMzQixvQkFDQSxpQkFDQSxDQUFDLGlCQUFpQixpQkFBNEM7QUFDNUQsTUFBSSxtQkFBbUIsZ0JBQWdCLGdCQUFnQjtBQUNyRCxXQUFPLGFBQWEsZ0JBQWdCLGNBQWM7QUFBQSxFQUNwRDtBQUVBLFNBQU87QUFDVCxDQUNGO0FBRU8sTUFBTSxXQUFXLG9DQUN0QixlQUNBLENBQUMsU0FBNkMsUUFBUSxJQUFJLENBQzVEO0FBRU8sTUFBTSxxQkFBcUIsb0NBQ2hDLFlBQ0EsQ0FBQyxVQUNDLFFBQVEsTUFBTSxtQkFBbUIsQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQy9EO0FBRU8sTUFBTSxrQkFBa0Isb0NBQzdCLHdCQUNBLHdCQUNBLENBQ0UscUJBQ0EsWUFDeUQ7QUFDekQsTUFBSSxDQUFDLFNBQVM7QUFDWixXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU8sb0NBQXNCLHFCQUFxQixPQUFPO0FBQzNELENBQ0Y7QUFFTyxNQUFNLGtCQUFrQix3QkFDN0IsU0FDWTtBQUNaLFNBQU8sUUFDTCxNQUFNLGFBQWEsNEJBQWEsZ0JBQzlCLE1BQU0sYUFBYSw0QkFBYSxPQUNwQztBQUNGLEdBUCtCOyIsCiAgIm5hbWVzIjogW10KfQo=
