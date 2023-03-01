var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_chai = require("chai");
var durations = __toESM(require("../../util/durations"));
var import_fixtures = require("./fixtures");
describe("storage service", function needsName() {
  this.timeout(durations.MINUTE);
  let bootstrap;
  let app;
  beforeEach(async () => {
    ({ bootstrap, app } = await (0, import_fixtures.initStorage)());
  });
  afterEach(async function after() {
    if (!bootstrap) {
      return;
    }
    if (this.currentTest?.state !== "passed") {
      await bootstrap.saveLogs();
    }
    await app.close();
    await bootstrap.teardown();
  });
  it("should handle message request state changes", async () => {
    const { phone, desktop, server } = bootstrap;
    const initialState = await phone.expectStorageState("initial state");
    (0, import_fixtures.debug)("Creating stranger");
    const stranger = await server.createPrimaryDevice({
      profileName: "Mysterious Stranger"
    });
    const ourKey = await desktop.popSingleUseKey();
    await stranger.addSingleUseKey(desktop, ourKey);
    (0, import_fixtures.debug)("Sending a message from a stranger");
    await stranger.sendText(desktop, "Hello!", {
      withProfileKey: true,
      timestamp: bootstrap.getTimestamp()
    });
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    const conversationStack = window.locator(".conversation-stack");
    (0, import_fixtures.debug)("Opening conversation with a stranger");
    await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(stranger.profileName)}]`).click();
    (0, import_fixtures.debug)("Verify that we stored stranger's profile key");
    const postMessageState = await phone.waitForStorageState({
      after: initialState
    });
    {
      import_chai.assert.strictEqual(postMessageState.version, 2);
      import_chai.assert.isFalse(postMessageState.getContact(stranger)?.whitelisted);
      import_chai.assert.strictEqual(postMessageState.getContact(stranger)?.profileKey?.length, 32);
      const { added, removed } = postMessageState.diff(initialState);
      import_chai.assert.strictEqual(added.length, 1, "only one record must be added");
      import_chai.assert.strictEqual(removed.length, 0, "no records should be removed");
    }
    (0, import_fixtures.debug)("Accept conversation from a stranger");
    await conversationStack.locator('.module-message-request-actions button >> "Accept"').click();
    (0, import_fixtures.debug)("Verify that storage state was updated");
    {
      const nextState = await phone.waitForStorageState({
        after: postMessageState
      });
      import_chai.assert.strictEqual(nextState.version, 3);
      import_chai.assert.isTrue(nextState.getContact(stranger)?.whitelisted);
      const { added, removed } = nextState.diff(postMessageState);
      import_chai.assert.strictEqual(added.length, 1, "only one record must be added");
      import_chai.assert.strictEqual(removed.length, 1, "only one record should be removed");
    }
    {
      const { body, source, dataMessage } = await stranger.waitForMessage();
      import_chai.assert.strictEqual(body, "", "profile key message has no body");
      import_chai.assert.strictEqual(source, desktop, "profile key message has valid source");
      import_chai.assert.isTrue(phone.profileKey.serialize().equals(dataMessage.profileKey ?? new Uint8Array(0)), "profile key message has correct profile key");
    }
    (0, import_fixtures.debug)("Enter message text");
    const composeArea = window.locator(".composition-area-wrapper, .ConversationView__template .react-wrapper");
    const input = composeArea.locator("_react=CompositionInput");
    await input.type("hello stranger!");
    await input.press("Enter");
    {
      const { body, source } = await stranger.waitForMessage();
      import_chai.assert.strictEqual(body, "hello stranger!", "text message has body");
      import_chai.assert.strictEqual(source, desktop, "text message has valid source");
    }
    (0, import_fixtures.debug)("Verifying the final manifest version");
    const finalState = await phone.expectStorageState("consistency check");
    import_chai.assert.strictEqual(finalState.version, 3);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWVzc2FnZV9yZXF1ZXN0X3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IEFwcCwgQm9vdHN0cmFwIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5pbXBvcnQgeyBpbml0U3RvcmFnZSwgZGVidWcgfSBmcm9tICcuL2ZpeHR1cmVzJztcblxuZGVzY3JpYmUoJ3N0b3JhZ2Ugc2VydmljZScsIGZ1bmN0aW9uIG5lZWRzTmFtZSgpIHtcbiAgdGhpcy50aW1lb3V0KGR1cmF0aW9ucy5NSU5VVEUpO1xuXG4gIGxldCBib290c3RyYXA6IEJvb3RzdHJhcDtcbiAgbGV0IGFwcDogQXBwO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICh7IGJvb3RzdHJhcCwgYXBwIH0gPSBhd2FpdCBpbml0U3RvcmFnZSgpKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICghYm9vdHN0cmFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFRlc3Q/LnN0YXRlICE9PSAncGFzc2VkJykge1xuICAgICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgYXBwLmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaGFuZGxlIG1lc3NhZ2UgcmVxdWVzdCBzdGF0ZSBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUsIGRlc2t0b3AsIHNlcnZlciB9ID0gYm9vdHN0cmFwO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdpbml0aWFsIHN0YXRlJyk7XG5cbiAgICBkZWJ1ZygnQ3JlYXRpbmcgc3RyYW5nZXInKTtcbiAgICBjb25zdCBzdHJhbmdlciA9IGF3YWl0IHNlcnZlci5jcmVhdGVQcmltYXJ5RGV2aWNlKHtcbiAgICAgIHByb2ZpbGVOYW1lOiAnTXlzdGVyaW91cyBTdHJhbmdlcicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdXJLZXkgPSBhd2FpdCBkZXNrdG9wLnBvcFNpbmdsZVVzZUtleSgpO1xuICAgIGF3YWl0IHN0cmFuZ2VyLmFkZFNpbmdsZVVzZUtleShkZXNrdG9wLCBvdXJLZXkpO1xuXG4gICAgZGVidWcoJ1NlbmRpbmcgYSBtZXNzYWdlIGZyb20gYSBzdHJhbmdlcicpO1xuICAgIGF3YWl0IHN0cmFuZ2VyLnNlbmRUZXh0KGRlc2t0b3AsICdIZWxsbyEnLCB7XG4gICAgICB3aXRoUHJvZmlsZUtleTogdHJ1ZSxcbiAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG4gICAgY29uc3QgY29udmVyc2F0aW9uU3RhY2sgPSB3aW5kb3cubG9jYXRvcignLmNvbnZlcnNhdGlvbi1zdGFjaycpO1xuXG4gICAgZGVidWcoJ09wZW5pbmcgY29udmVyc2F0aW9uIHdpdGggYSBzdHJhbmdlcicpO1xuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcihcbiAgICAgICAgJ19yZWFjdD1Db252ZXJzYXRpb25MaXN0SXRlbScgK1xuICAgICAgICAgIGBbdGl0bGUgPSAke0pTT04uc3RyaW5naWZ5KHN0cmFuZ2VyLnByb2ZpbGVOYW1lKX1dYFxuICAgICAgKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBkZWJ1ZyhcIlZlcmlmeSB0aGF0IHdlIHN0b3JlZCBzdHJhbmdlcidzIHByb2ZpbGUga2V5XCIpO1xuICAgIGNvbnN0IHBvc3RNZXNzYWdlU3RhdGUgPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3RvcmFnZVN0YXRlKHtcbiAgICAgIGFmdGVyOiBpbml0aWFsU3RhdGUsXG4gICAgfSk7XG4gICAge1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHBvc3RNZXNzYWdlU3RhdGUudmVyc2lvbiwgMik7XG4gICAgICBhc3NlcnQuaXNGYWxzZShwb3N0TWVzc2FnZVN0YXRlLmdldENvbnRhY3Qoc3RyYW5nZXIpPy53aGl0ZWxpc3RlZCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIHBvc3RNZXNzYWdlU3RhdGUuZ2V0Q29udGFjdChzdHJhbmdlcik/LnByb2ZpbGVLZXk/Lmxlbmd0aCxcbiAgICAgICAgMzJcbiAgICAgICk7XG5cbiAgICAgIC8vIENvbnRhY3RSZWNvcmRcbiAgICAgIGNvbnN0IHsgYWRkZWQsIHJlbW92ZWQgfSA9IHBvc3RNZXNzYWdlU3RhdGUuZGlmZihpbml0aWFsU3RhdGUpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFkZGVkLmxlbmd0aCwgMSwgJ29ubHkgb25lIHJlY29yZCBtdXN0IGJlIGFkZGVkJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVtb3ZlZC5sZW5ndGgsIDAsICdubyByZWNvcmRzIHNob3VsZCBiZSByZW1vdmVkJyk7XG4gICAgfVxuXG4gICAgZGVidWcoJ0FjY2VwdCBjb252ZXJzYXRpb24gZnJvbSBhIHN0cmFuZ2VyJyk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLW1lc3NhZ2UtcmVxdWVzdC1hY3Rpb25zIGJ1dHRvbiA+PiBcIkFjY2VwdFwiJylcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZGVidWcoJ1ZlcmlmeSB0aGF0IHN0b3JhZ2Ugc3RhdGUgd2FzIHVwZGF0ZWQnKTtcbiAgICB7XG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3RvcmFnZVN0YXRlKHtcbiAgICAgICAgYWZ0ZXI6IHBvc3RNZXNzYWdlU3RhdGUsXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChuZXh0U3RhdGUudmVyc2lvbiwgMyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKG5leHRTdGF0ZS5nZXRDb250YWN0KHN0cmFuZ2VyKT8ud2hpdGVsaXN0ZWQpO1xuXG4gICAgICAvLyBDb250YWN0UmVjb3JkXG4gICAgICBjb25zdCB7IGFkZGVkLCByZW1vdmVkIH0gPSBuZXh0U3RhdGUuZGlmZihwb3N0TWVzc2FnZVN0YXRlKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChhZGRlZC5sZW5ndGgsIDEsICdvbmx5IG9uZSByZWNvcmQgbXVzdCBiZSBhZGRlZCcpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICByZW1vdmVkLmxlbmd0aCxcbiAgICAgICAgMSxcbiAgICAgICAgJ29ubHkgb25lIHJlY29yZCBzaG91bGQgYmUgcmVtb3ZlZCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gU3RyYW5nZXIgc2hvdWxkIHJlY2VpdmUgb3VyIHByb2ZpbGUga2V5XG4gICAge1xuICAgICAgY29uc3QgeyBib2R5LCBzb3VyY2UsIGRhdGFNZXNzYWdlIH0gPSBhd2FpdCBzdHJhbmdlci53YWl0Rm9yTWVzc2FnZSgpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGJvZHksICcnLCAncHJvZmlsZSBrZXkgbWVzc2FnZSBoYXMgbm8gYm9keScpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIGRlc2t0b3AsXG4gICAgICAgICdwcm9maWxlIGtleSBtZXNzYWdlIGhhcyB2YWxpZCBzb3VyY2UnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgcGhvbmUucHJvZmlsZUtleVxuICAgICAgICAgIC5zZXJpYWxpemUoKVxuICAgICAgICAgIC5lcXVhbHMoZGF0YU1lc3NhZ2UucHJvZmlsZUtleSA/PyBuZXcgVWludDhBcnJheSgwKSksXG4gICAgICAgICdwcm9maWxlIGtleSBtZXNzYWdlIGhhcyBjb3JyZWN0IHByb2ZpbGUga2V5J1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBkZWJ1ZygnRW50ZXIgbWVzc2FnZSB0ZXh0Jyk7XG4gICAgY29uc3QgY29tcG9zZUFyZWEgPSB3aW5kb3cubG9jYXRvcihcbiAgICAgICcuY29tcG9zaXRpb24tYXJlYS13cmFwcGVyLCAnICtcbiAgICAgICAgJy5Db252ZXJzYXRpb25WaWV3X190ZW1wbGF0ZSAucmVhY3Qtd3JhcHBlcidcbiAgICApO1xuICAgIGNvbnN0IGlucHV0ID0gY29tcG9zZUFyZWEubG9jYXRvcignX3JlYWN0PUNvbXBvc2l0aW9uSW5wdXQnKTtcblxuICAgIGF3YWl0IGlucHV0LnR5cGUoJ2hlbGxvIHN0cmFuZ2VyIScpO1xuICAgIGF3YWl0IGlucHV0LnByZXNzKCdFbnRlcicpO1xuXG4gICAge1xuICAgICAgY29uc3QgeyBib2R5LCBzb3VyY2UgfSA9IGF3YWl0IHN0cmFuZ2VyLndhaXRGb3JNZXNzYWdlKCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYm9keSwgJ2hlbGxvIHN0cmFuZ2VyIScsICd0ZXh0IG1lc3NhZ2UgaGFzIGJvZHknKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzb3VyY2UsIGRlc2t0b3AsICd0ZXh0IG1lc3NhZ2UgaGFzIHZhbGlkIHNvdXJjZScpO1xuICAgIH1cblxuICAgIGRlYnVnKCdWZXJpZnlpbmcgdGhlIGZpbmFsIG1hbmlmZXN0IHZlcnNpb24nKTtcbiAgICBjb25zdCBmaW5hbFN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChmaW5hbFN0YXRlLnZlcnNpb24sIDMpO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtCQUF1QjtBQUV2QixnQkFBMkI7QUFFM0Isc0JBQW1DO0FBRW5DLFNBQVMsbUJBQW1CLHFCQUFxQjtBQUMvQyxPQUFLLFFBQVEsVUFBVSxNQUFNO0FBRTdCLE1BQUk7QUFDSixNQUFJO0FBRUosYUFBVyxZQUFZO0FBQ3JCLElBQUMsR0FBRSxXQUFXLElBQUksSUFBSSxNQUFNLGlDQUFZO0FBQUEsRUFDMUMsQ0FBQztBQUVELFlBQVUsdUJBQXVCO0FBQy9CLFFBQUksQ0FBQyxXQUFXO0FBQ2Q7QUFBQSxJQUNGO0FBRUEsUUFBSSxLQUFLLGFBQWEsVUFBVSxVQUFVO0FBQ3hDLFlBQU0sVUFBVSxTQUFTO0FBQUEsSUFDM0I7QUFFQSxVQUFNLElBQUksTUFBTTtBQUNoQixVQUFNLFVBQVUsU0FBUztBQUFBLEVBQzNCLENBQUM7QUFFRCxLQUFHLCtDQUErQyxZQUFZO0FBQzVELFVBQU0sRUFBRSxPQUFPLFNBQVMsV0FBVztBQUVuQyxVQUFNLGVBQWUsTUFBTSxNQUFNLG1CQUFtQixlQUFlO0FBRW5FLCtCQUFNLG1CQUFtQjtBQUN6QixVQUFNLFdBQVcsTUFBTSxPQUFPLG9CQUFvQjtBQUFBLE1BQ2hELGFBQWE7QUFBQSxJQUNmLENBQUM7QUFFRCxVQUFNLFNBQVMsTUFBTSxRQUFRLGdCQUFnQjtBQUM3QyxVQUFNLFNBQVMsZ0JBQWdCLFNBQVMsTUFBTTtBQUU5QywrQkFBTSxtQ0FBbUM7QUFDekMsVUFBTSxTQUFTLFNBQVMsU0FBUyxVQUFVO0FBQUEsTUFDekMsZ0JBQWdCO0FBQUEsTUFDaEIsV0FBVyxVQUFVLGFBQWE7QUFBQSxJQUNwQyxDQUFDO0FBRUQsVUFBTSxTQUFTLE1BQU0sSUFBSSxVQUFVO0FBRW5DLFVBQU0sV0FBVyxPQUFPLFFBQVEsb0JBQW9CO0FBQ3BELFVBQU0sb0JBQW9CLE9BQU8sUUFBUSxxQkFBcUI7QUFFOUQsK0JBQU0sc0NBQXNDO0FBQzVDLFVBQU0sU0FDSCxRQUNDLHVDQUNjLEtBQUssVUFBVSxTQUFTLFdBQVcsSUFDbkQsRUFDQyxNQUFNO0FBRVQsK0JBQU0sOENBQThDO0FBQ3BELFVBQU0sbUJBQW1CLE1BQU0sTUFBTSxvQkFBb0I7QUFBQSxNQUN2RCxPQUFPO0FBQUEsSUFDVCxDQUFDO0FBQ0Q7QUFDRSx5QkFBTyxZQUFZLGlCQUFpQixTQUFTLENBQUM7QUFDOUMseUJBQU8sUUFBUSxpQkFBaUIsV0FBVyxRQUFRLEdBQUcsV0FBVztBQUNqRSx5QkFBTyxZQUNMLGlCQUFpQixXQUFXLFFBQVEsR0FBRyxZQUFZLFFBQ25ELEVBQ0Y7QUFHQSxZQUFNLEVBQUUsT0FBTyxZQUFZLGlCQUFpQixLQUFLLFlBQVk7QUFDN0QseUJBQU8sWUFBWSxNQUFNLFFBQVEsR0FBRywrQkFBK0I7QUFDbkUseUJBQU8sWUFBWSxRQUFRLFFBQVEsR0FBRyw4QkFBOEI7QUFBQSxJQUN0RTtBQUVBLCtCQUFNLHFDQUFxQztBQUMzQyxVQUFNLGtCQUNILFFBQVEsb0RBQW9ELEVBQzVELE1BQU07QUFFVCwrQkFBTSx1Q0FBdUM7QUFDN0M7QUFDRSxZQUFNLFlBQVksTUFBTSxNQUFNLG9CQUFvQjtBQUFBLFFBQ2hELE9BQU87QUFBQSxNQUNULENBQUM7QUFDRCx5QkFBTyxZQUFZLFVBQVUsU0FBUyxDQUFDO0FBQ3ZDLHlCQUFPLE9BQU8sVUFBVSxXQUFXLFFBQVEsR0FBRyxXQUFXO0FBR3pELFlBQU0sRUFBRSxPQUFPLFlBQVksVUFBVSxLQUFLLGdCQUFnQjtBQUMxRCx5QkFBTyxZQUFZLE1BQU0sUUFBUSxHQUFHLCtCQUErQjtBQUNuRSx5QkFBTyxZQUNMLFFBQVEsUUFDUixHQUNBLG1DQUNGO0FBQUEsSUFDRjtBQUdBO0FBQ0UsWUFBTSxFQUFFLE1BQU0sUUFBUSxnQkFBZ0IsTUFBTSxTQUFTLGVBQWU7QUFDcEUseUJBQU8sWUFBWSxNQUFNLElBQUksaUNBQWlDO0FBQzlELHlCQUFPLFlBQ0wsUUFDQSxTQUNBLHNDQUNGO0FBQ0EseUJBQU8sT0FDTCxNQUFNLFdBQ0gsVUFBVSxFQUNWLE9BQU8sWUFBWSxjQUFjLElBQUksV0FBVyxDQUFDLENBQUMsR0FDckQsNkNBQ0Y7QUFBQSxJQUNGO0FBRUEsK0JBQU0sb0JBQW9CO0FBQzFCLFVBQU0sY0FBYyxPQUFPLFFBQ3pCLHVFQUVGO0FBQ0EsVUFBTSxRQUFRLFlBQVksUUFBUSx5QkFBeUI7QUFFM0QsVUFBTSxNQUFNLEtBQUssaUJBQWlCO0FBQ2xDLFVBQU0sTUFBTSxNQUFNLE9BQU87QUFFekI7QUFDRSxZQUFNLEVBQUUsTUFBTSxXQUFXLE1BQU0sU0FBUyxlQUFlO0FBQ3ZELHlCQUFPLFlBQVksTUFBTSxtQkFBbUIsdUJBQXVCO0FBQ25FLHlCQUFPLFlBQVksUUFBUSxTQUFTLCtCQUErQjtBQUFBLElBQ3JFO0FBRUEsK0JBQU0sc0NBQXNDO0FBQzVDLFVBQU0sYUFBYSxNQUFNLE1BQU0sbUJBQW1CLG1CQUFtQjtBQUNyRSx1QkFBTyxZQUFZLFdBQVcsU0FBUyxDQUFDO0FBQUEsRUFDMUMsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
