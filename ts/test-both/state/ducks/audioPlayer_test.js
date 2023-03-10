var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_audioPlayer = require("../../../state/ducks/audioPlayer");
var import_conversations = require("../../../state/ducks/conversations");
var import_noop = require("../../../state/ducks/noop");
var import_reducer = require("../../../state/reducer");
const { messageDeleted, messageChanged } = import_conversations.actions;
const MESSAGE_ID = "message-id";
describe("both/state/ducks/audioPlayer", () => {
  const getEmptyRootState = /* @__PURE__ */ __name(() => {
    return (0, import_reducer.reducer)(void 0, (0, import_noop.noopAction)());
  }, "getEmptyRootState");
  const getInitializedState = /* @__PURE__ */ __name(() => {
    const state = getEmptyRootState();
    const updated = (0, import_reducer.reducer)(state, import_audioPlayer.actions.setActiveAudioID(MESSAGE_ID, "context"));
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioID, MESSAGE_ID);
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioContext, "context");
    return updated;
  }, "getInitializedState");
  describe("setActiveAudioID", () => {
    it("updates `activeAudioID` in the audioPlayer's state", () => {
      const state = getEmptyRootState();
      import_chai.assert.strictEqual(state.audioPlayer.activeAudioID, void 0);
      const updated = (0, import_reducer.reducer)(state, import_audioPlayer.actions.setActiveAudioID("test", "context"));
      import_chai.assert.strictEqual(updated.audioPlayer.activeAudioID, "test");
      import_chai.assert.strictEqual(updated.audioPlayer.activeAudioContext, "context");
    });
  });
  it("resets activeAudioID when changing the conversation", () => {
    const state = getInitializedState();
    const updated = (0, import_reducer.reducer)(state, {
      type: import_conversations.SELECTED_CONVERSATION_CHANGED,
      payload: { id: "any" }
    });
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioID, void 0);
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioContext, "context");
  });
  it("resets activeAudioID when message was deleted", () => {
    const state = getInitializedState();
    const updated = (0, import_reducer.reducer)(state, messageDeleted(MESSAGE_ID, "conversation-id"));
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioID, void 0);
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioContext, "context");
  });
  it("resets activeAudioID when message was erased", () => {
    const state = getInitializedState();
    const updated = (0, import_reducer.reducer)(state, messageChanged(MESSAGE_ID, "conversation-id", {
      id: MESSAGE_ID,
      type: "incoming",
      sent_at: 1,
      received_at: 1,
      timestamp: 1,
      conversationId: "conversation-id",
      deletedForEveryone: true
    }));
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioID, void 0);
    import_chai.assert.strictEqual(updated.audioPlayer.activeAudioContext, "context");
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXVkaW9QbGF5ZXJfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHsgYWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2F1ZGlvUGxheWVyJztcbmltcG9ydCB0eXBlIHsgU2VsZWN0ZWRDb252ZXJzYXRpb25DaGFuZ2VkQWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHtcbiAgU0VMRUNURURfQ09OVkVSU0FUSU9OX0NIQU5HRUQsXG4gIGFjdGlvbnMgYXMgY29udmVyc2F0aW9uc0FjdGlvbnMsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgbm9vcEFjdGlvbiB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL25vb3AnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL3JlZHVjZXInO1xuaW1wb3J0IHsgcmVkdWNlciBhcyByb290UmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL3JlZHVjZXInO1xuXG5jb25zdCB7IG1lc3NhZ2VEZWxldGVkLCBtZXNzYWdlQ2hhbmdlZCB9ID0gY29udmVyc2F0aW9uc0FjdGlvbnM7XG5cbmNvbnN0IE1FU1NBR0VfSUQgPSAnbWVzc2FnZS1pZCc7XG5cbmRlc2NyaWJlKCdib3RoL3N0YXRlL2R1Y2tzL2F1ZGlvUGxheWVyJywgKCkgPT4ge1xuICBjb25zdCBnZXRFbXB0eVJvb3RTdGF0ZSA9ICgpOiBTdGF0ZVR5cGUgPT4ge1xuICAgIHJldHVybiByb290UmVkdWNlcih1bmRlZmluZWQsIG5vb3BBY3Rpb24oKSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0SW5pdGlhbGl6ZWRTdGF0ZSA9ICgpOiBTdGF0ZVR5cGUgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0gZ2V0RW1wdHlSb290U3RhdGUoKTtcblxuICAgIGNvbnN0IHVwZGF0ZWQgPSByb290UmVkdWNlcihcbiAgICAgIHN0YXRlLFxuICAgICAgYWN0aW9ucy5zZXRBY3RpdmVBdWRpb0lEKE1FU1NBR0VfSUQsICdjb250ZXh0JylcbiAgICApO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVwZGF0ZWQuYXVkaW9QbGF5ZXIuYWN0aXZlQXVkaW9JRCwgTUVTU0FHRV9JRCk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVwZGF0ZWQuYXVkaW9QbGF5ZXIuYWN0aXZlQXVkaW9Db250ZXh0LCAnY29udGV4dCcpO1xuXG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG4gIH07XG5cbiAgZGVzY3JpYmUoJ3NldEFjdGl2ZUF1ZGlvSUQnLCAoKSA9PiB7XG4gICAgaXQoXCJ1cGRhdGVzIGBhY3RpdmVBdWRpb0lEYCBpbiB0aGUgYXVkaW9QbGF5ZXIncyBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGdldEVtcHR5Um9vdFN0YXRlKCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoc3RhdGUuYXVkaW9QbGF5ZXIuYWN0aXZlQXVkaW9JRCwgdW5kZWZpbmVkKTtcblxuICAgICAgY29uc3QgdXBkYXRlZCA9IHJvb3RSZWR1Y2VyKFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgYWN0aW9ucy5zZXRBY3RpdmVBdWRpb0lEKCd0ZXN0JywgJ2NvbnRleHQnKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh1cGRhdGVkLmF1ZGlvUGxheWVyLmFjdGl2ZUF1ZGlvSUQsICd0ZXN0Jyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodXBkYXRlZC5hdWRpb1BsYXllci5hY3RpdmVBdWRpb0NvbnRleHQsICdjb250ZXh0Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdyZXNldHMgYWN0aXZlQXVkaW9JRCB3aGVuIGNoYW5naW5nIHRoZSBjb252ZXJzYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRJbml0aWFsaXplZFN0YXRlKCk7XG5cbiAgICBjb25zdCB1cGRhdGVkID0gcm9vdFJlZHVjZXIoc3RhdGUsIDxTZWxlY3RlZENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlPntcbiAgICAgIHR5cGU6IFNFTEVDVEVEX0NPTlZFUlNBVElPTl9DSEFOR0VELFxuICAgICAgcGF5bG9hZDogeyBpZDogJ2FueScgfSxcbiAgICB9KTtcblxuICAgIGFzc2VydC5zdHJpY3RFcXVhbCh1cGRhdGVkLmF1ZGlvUGxheWVyLmFjdGl2ZUF1ZGlvSUQsIHVuZGVmaW5lZCk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVwZGF0ZWQuYXVkaW9QbGF5ZXIuYWN0aXZlQXVkaW9Db250ZXh0LCAnY29udGV4dCcpO1xuICB9KTtcblxuICBpdCgncmVzZXRzIGFjdGl2ZUF1ZGlvSUQgd2hlbiBtZXNzYWdlIHdhcyBkZWxldGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0gZ2V0SW5pdGlhbGl6ZWRTdGF0ZSgpO1xuXG4gICAgY29uc3QgdXBkYXRlZCA9IHJvb3RSZWR1Y2VyKFxuICAgICAgc3RhdGUsXG4gICAgICBtZXNzYWdlRGVsZXRlZChNRVNTQUdFX0lELCAnY29udmVyc2F0aW9uLWlkJylcbiAgICApO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHVwZGF0ZWQuYXVkaW9QbGF5ZXIuYWN0aXZlQXVkaW9JRCwgdW5kZWZpbmVkKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodXBkYXRlZC5hdWRpb1BsYXllci5hY3RpdmVBdWRpb0NvbnRleHQsICdjb250ZXh0Jyk7XG4gIH0pO1xuXG4gIGl0KCdyZXNldHMgYWN0aXZlQXVkaW9JRCB3aGVuIG1lc3NhZ2Ugd2FzIGVyYXNlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IGdldEluaXRpYWxpemVkU3RhdGUoKTtcblxuICAgIGNvbnN0IHVwZGF0ZWQgPSByb290UmVkdWNlcihcbiAgICAgIHN0YXRlLFxuICAgICAgbWVzc2FnZUNoYW5nZWQoTUVTU0FHRV9JRCwgJ2NvbnZlcnNhdGlvbi1pZCcsIHtcbiAgICAgICAgaWQ6IE1FU1NBR0VfSUQsXG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycsXG4gICAgICAgIHNlbnRfYXQ6IDEsXG4gICAgICAgIHJlY2VpdmVkX2F0OiAxLFxuICAgICAgICB0aW1lc3RhbXA6IDEsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnY29udmVyc2F0aW9uLWlkJyxcblxuICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodXBkYXRlZC5hdWRpb1BsYXllci5hY3RpdmVBdWRpb0lELCB1bmRlZmluZWQpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbCh1cGRhdGVkLmF1ZGlvUGxheWVyLmFjdGl2ZUF1ZGlvQ29udGV4dCwgJ2NvbnRleHQnKTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBR0Esa0JBQXVCO0FBRXZCLHlCQUF3QjtBQUV4QiwyQkFHTztBQUNQLGtCQUEyQjtBQUczQixxQkFBdUM7QUFFdkMsTUFBTSxFQUFFLGdCQUFnQixtQkFBbUI7QUFFM0MsTUFBTSxhQUFhO0FBRW5CLFNBQVMsZ0NBQWdDLE1BQU07QUFDN0MsUUFBTSxvQkFBb0IsNkJBQWlCO0FBQ3pDLFdBQU8sNEJBQVksUUFBVyw0QkFBVyxDQUFDO0FBQUEsRUFDNUMsR0FGMEI7QUFJMUIsUUFBTSxzQkFBc0IsNkJBQWlCO0FBQzNDLFVBQU0sUUFBUSxrQkFBa0I7QUFFaEMsVUFBTSxVQUFVLDRCQUNkLE9BQ0EsMkJBQVEsaUJBQWlCLFlBQVksU0FBUyxDQUNoRDtBQUVBLHVCQUFPLFlBQVksUUFBUSxZQUFZLGVBQWUsVUFBVTtBQUNoRSx1QkFBTyxZQUFZLFFBQVEsWUFBWSxvQkFBb0IsU0FBUztBQUVwRSxXQUFPO0FBQUEsRUFDVCxHQVo0QjtBQWM1QixXQUFTLG9CQUFvQixNQUFNO0FBQ2pDLE9BQUcsc0RBQXNELE1BQU07QUFDN0QsWUFBTSxRQUFRLGtCQUFrQjtBQUNoQyx5QkFBTyxZQUFZLE1BQU0sWUFBWSxlQUFlLE1BQVM7QUFFN0QsWUFBTSxVQUFVLDRCQUNkLE9BQ0EsMkJBQVEsaUJBQWlCLFFBQVEsU0FBUyxDQUM1QztBQUNBLHlCQUFPLFlBQVksUUFBUSxZQUFZLGVBQWUsTUFBTTtBQUM1RCx5QkFBTyxZQUFZLFFBQVEsWUFBWSxvQkFBb0IsU0FBUztBQUFBLElBQ3RFLENBQUM7QUFBQSxFQUNILENBQUM7QUFFRCxLQUFHLHVEQUF1RCxNQUFNO0FBQzlELFVBQU0sUUFBUSxvQkFBb0I7QUFFbEMsVUFBTSxVQUFVLDRCQUFZLE9BQThDO0FBQUEsTUFDeEUsTUFBTTtBQUFBLE1BQ04sU0FBUyxFQUFFLElBQUksTUFBTTtBQUFBLElBQ3ZCLENBQUM7QUFFRCx1QkFBTyxZQUFZLFFBQVEsWUFBWSxlQUFlLE1BQVM7QUFDL0QsdUJBQU8sWUFBWSxRQUFRLFlBQVksb0JBQW9CLFNBQVM7QUFBQSxFQUN0RSxDQUFDO0FBRUQsS0FBRyxpREFBaUQsTUFBTTtBQUN4RCxVQUFNLFFBQVEsb0JBQW9CO0FBRWxDLFVBQU0sVUFBVSw0QkFDZCxPQUNBLGVBQWUsWUFBWSxpQkFBaUIsQ0FDOUM7QUFFQSx1QkFBTyxZQUFZLFFBQVEsWUFBWSxlQUFlLE1BQVM7QUFDL0QsdUJBQU8sWUFBWSxRQUFRLFlBQVksb0JBQW9CLFNBQVM7QUFBQSxFQUN0RSxDQUFDO0FBRUQsS0FBRyxnREFBZ0QsTUFBTTtBQUN2RCxVQUFNLFFBQVEsb0JBQW9CO0FBRWxDLFVBQU0sVUFBVSw0QkFDZCxPQUNBLGVBQWUsWUFBWSxtQkFBbUI7QUFBQSxNQUM1QyxJQUFJO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixXQUFXO0FBQUEsTUFDWCxnQkFBZ0I7QUFBQSxNQUVoQixvQkFBb0I7QUFBQSxJQUN0QixDQUFDLENBQ0g7QUFFQSx1QkFBTyxZQUFZLFFBQVEsWUFBWSxlQUFlLE1BQVM7QUFDL0QsdUJBQU8sWUFBWSxRQUFRLFlBQVksb0JBQW9CLFNBQVM7QUFBQSxFQUN0RSxDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
