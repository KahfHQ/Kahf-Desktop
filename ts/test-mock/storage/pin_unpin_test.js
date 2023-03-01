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
  let group;
  beforeEach(async () => {
    ({ bootstrap, app, group } = await (0, import_fixtures.initStorage)());
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
  it("should pin/unpin groups", async () => {
    const { phone, desktop, contacts } = bootstrap;
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    const conversationStack = window.locator(".conversation-stack");
    (0, import_fixtures.debug)("Verifying that the group is pinned on startup");
    await leftPane.locator(`_react=ConversationListItem[isPinned = true] [title = ${JSON.stringify(group.title)}]`).waitFor();
    (0, import_fixtures.debug)("Unpinning group via storage service");
    {
      const state = await phone.expectStorageState("initial state");
      await phone.setStorageState(state.unpinGroup(group));
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      await leftPane.locator(`_react=ConversationListItem[isPinned = false] [title = ${JSON.stringify(group.title)}]`).waitFor();
    }
    (0, import_fixtures.debug)("Pinning group in the app");
    {
      const state = await phone.expectStorageState("consistency check");
      const convo = leftPane.locator(`_react=ConversationListItem[isPinned = false] [title = ${JSON.stringify(group.title)}]`);
      await convo.click();
      const moreButton = conversationStack.locator("button.module-ConversationHeader__button--more");
      await moreButton.click();
      const pinButton = conversationStack.locator('.react-contextmenu-item >> "Pin Conversation"');
      await pinButton.click();
      const newState = await phone.waitForStorageState({
        after: state
      });
      import_chai.assert.isTrue(await newState.isGroupPinned(group), "group not pinned");
      const { added, removed } = newState.diff(state);
      import_chai.assert.strictEqual(added.length, 1, "only one record must be added");
      import_chai.assert.strictEqual(removed.length, 1, "only one record must be removed");
    }
    (0, import_fixtures.debug)("Pinning > 4 conversations");
    {
      const toPin = contacts.slice(1, 4);
      for (const [i, contact] of toPin.entries()) {
        const isLast = i === toPin.length - 1;
        (0, import_fixtures.debug)("sending a message to contact=%d", i);
        await contact.sendText(desktop, "Hello!", {
          timestamp: bootstrap.getTimestamp()
        });
        const state = await phone.expectStorageState("consistency check");
        (0, import_fixtures.debug)("pinning contact=%d", i);
        const convo = leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(contact.profileName)}]`);
        await convo.click();
        const moreButton = conversationStack.locator("button.module-ConversationHeader__button--more");
        await moreButton.click();
        const pinButton = conversationStack.locator('.react-contextmenu-item >> "Pin Conversation"');
        await pinButton.click();
        if (isLast) {
          await window.locator('.Toast >> "You can only pin up to 4 chats"').waitFor();
          break;
        }
        (0, import_fixtures.debug)("verifying storage state change contact=%d", i);
        const newState = await phone.waitForStorageState({
          after: state
        });
        import_chai.assert.isTrue(await newState.isPinned(contact), "contact not pinned");
        const { added, removed } = newState.diff(state);
        import_chai.assert.strictEqual(added.length, 1, "only one record must be added");
        import_chai.assert.strictEqual(removed.length, 1, "only one record must be removed");
      }
    }
    (0, import_fixtures.debug)("Verifying the final manifest version");
    const finalState = await phone.expectStorageState("consistency check");
    import_chai.assert.strictEqual(finalState.version, 5);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGluX3VucGluX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcbi8qIGVzbGludC1kaXNhYmxlIG5vLWF3YWl0LWluLWxvb3AgKi9cblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB0eXBlIHsgR3JvdXAgfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB0eXBlIHsgQXBwLCBCb290c3RyYXAgfSBmcm9tICcuL2ZpeHR1cmVzJztcbmltcG9ydCB7IGluaXRTdG9yYWdlLCBkZWJ1ZyB9IGZyb20gJy4vZml4dHVyZXMnO1xuXG5kZXNjcmliZSgnc3RvcmFnZSBzZXJ2aWNlJywgZnVuY3Rpb24gbmVlZHNOYW1lKCkge1xuICB0aGlzLnRpbWVvdXQoZHVyYXRpb25zLk1JTlVURSk7XG5cbiAgbGV0IGJvb3RzdHJhcDogQm9vdHN0cmFwO1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBncm91cDogR3JvdXA7XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgKHsgYm9vdHN0cmFwLCBhcHAsIGdyb3VwIH0gPSBhd2FpdCBpbml0U3RvcmFnZSgpKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICghYm9vdHN0cmFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFRlc3Q/LnN0YXRlICE9PSAncGFzc2VkJykge1xuICAgICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgYXBwLmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcGluL3VucGluIGdyb3VwcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBob25lLCBkZXNrdG9wLCBjb250YWN0cyB9ID0gYm9vdHN0cmFwO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG4gICAgY29uc3QgY29udmVyc2F0aW9uU3RhY2sgPSB3aW5kb3cubG9jYXRvcignLmNvbnZlcnNhdGlvbi1zdGFjaycpO1xuXG4gICAgZGVidWcoJ1ZlcmlmeWluZyB0aGF0IHRoZSBncm91cCBpcyBwaW5uZWQgb24gc3RhcnR1cCcpO1xuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcihcbiAgICAgICAgJ19yZWFjdD1Db252ZXJzYXRpb25MaXN0SXRlbScgK1xuICAgICAgICAgICdbaXNQaW5uZWQgPSB0cnVlXSAnICtcbiAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShncm91cC50aXRsZSl9XWBcbiAgICAgIClcbiAgICAgIC53YWl0Rm9yKCk7XG5cbiAgICBkZWJ1ZygnVW5waW5uaW5nIGdyb3VwIHZpYSBzdG9yYWdlIHNlcnZpY2UnKTtcbiAgICB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnaW5pdGlhbCBzdGF0ZScpO1xuXG4gICAgICBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoc3RhdGUudW5waW5Hcm91cChncm91cCkpO1xuICAgICAgYXdhaXQgcGhvbmUuc2VuZEZldGNoU3RvcmFnZSh7XG4gICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAgIC5sb2NhdG9yKFxuICAgICAgICAgICdfcmVhY3Q9Q29udmVyc2F0aW9uTGlzdEl0ZW0nICtcbiAgICAgICAgICAgICdbaXNQaW5uZWQgPSBmYWxzZV0gJyArXG4gICAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShncm91cC50aXRsZSl9XWBcbiAgICAgICAgKVxuICAgICAgICAud2FpdEZvcigpO1xuICAgIH1cblxuICAgIGRlYnVnKCdQaW5uaW5nIGdyb3VwIGluIHRoZSBhcHAnKTtcbiAgICB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnY29uc2lzdGVuY3kgY2hlY2snKTtcblxuICAgICAgY29uc3QgY29udm8gPSBsZWZ0UGFuZS5sb2NhdG9yKFxuICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgJ1tpc1Bpbm5lZCA9IGZhbHNlXSAnICtcbiAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShncm91cC50aXRsZSl9XWBcbiAgICAgICk7XG4gICAgICBhd2FpdCBjb252by5jbGljaygpO1xuXG4gICAgICBjb25zdCBtb3JlQnV0dG9uID0gY29udmVyc2F0aW9uU3RhY2subG9jYXRvcihcbiAgICAgICAgJ2J1dHRvbi5tb2R1bGUtQ29udmVyc2F0aW9uSGVhZGVyX19idXR0b24tLW1vcmUnXG4gICAgICApO1xuICAgICAgYXdhaXQgbW9yZUJ1dHRvbi5jbGljaygpO1xuXG4gICAgICBjb25zdCBwaW5CdXR0b24gPSBjb252ZXJzYXRpb25TdGFjay5sb2NhdG9yKFxuICAgICAgICAnLnJlYWN0LWNvbnRleHRtZW51LWl0ZW0gPj4gXCJQaW4gQ29udmVyc2F0aW9uXCInXG4gICAgICApO1xuICAgICAgYXdhaXQgcGluQnV0dG9uLmNsaWNrKCk7XG5cbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gYXdhaXQgcGhvbmUud2FpdEZvclN0b3JhZ2VTdGF0ZSh7XG4gICAgICAgIGFmdGVyOiBzdGF0ZSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShhd2FpdCBuZXdTdGF0ZS5pc0dyb3VwUGlubmVkKGdyb3VwKSwgJ2dyb3VwIG5vdCBwaW5uZWQnKTtcblxuICAgICAgLy8gQWNjb3VudFJlY29yZFxuICAgICAgY29uc3QgeyBhZGRlZCwgcmVtb3ZlZCB9ID0gbmV3U3RhdGUuZGlmZihzdGF0ZSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWRkZWQubGVuZ3RoLCAxLCAnb25seSBvbmUgcmVjb3JkIG11c3QgYmUgYWRkZWQnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZW1vdmVkLmxlbmd0aCwgMSwgJ29ubHkgb25lIHJlY29yZCBtdXN0IGJlIHJlbW92ZWQnKTtcbiAgICB9XG5cbiAgICBkZWJ1ZygnUGlubmluZyA+IDQgY29udmVyc2F0aW9ucycpO1xuICAgIHtcbiAgICAgIC8vIFdlIGFscmVhZHkgaGF2ZSBvbmUgZ3JvdXAgYW5kIGZpcnN0IGNvbnRhY3QgcGlubmVkIHNvIHdlIG5lZWQgdGhyZWVcbiAgICAgIC8vIG1vcmUuXG4gICAgICBjb25zdCB0b1BpbiA9IGNvbnRhY3RzLnNsaWNlKDEsIDQpO1xuXG4gICAgICAvLyBUbyBkbyB0aGF0IHdlIG5lZWQgdGhlbSB0byBhcHBlYXIgaW4gdGhlIGxlZnQgcGFuZSwgdGhvdWdoLlxuICAgICAgZm9yIChjb25zdCBbaSwgY29udGFjdF0gb2YgdG9QaW4uZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHRvUGluLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZGVidWcoJ3NlbmRpbmcgYSBtZXNzYWdlIHRvIGNvbnRhY3Q9JWQnLCBpKTtcbiAgICAgICAgYXdhaXQgY29udGFjdC5zZW5kVGV4dChkZXNrdG9wLCAnSGVsbG8hJywge1xuICAgICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnY29uc2lzdGVuY3kgY2hlY2snKTtcblxuICAgICAgICBkZWJ1ZygncGlubmluZyBjb250YWN0PSVkJywgaSk7XG4gICAgICAgIGNvbnN0IGNvbnZvID0gbGVmdFBhbmUubG9jYXRvcihcbiAgICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShjb250YWN0LnByb2ZpbGVOYW1lKX1dYFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBjb252by5jbGljaygpO1xuXG4gICAgICAgIGNvbnN0IG1vcmVCdXR0b24gPSBjb252ZXJzYXRpb25TdGFjay5sb2NhdG9yKFxuICAgICAgICAgICdidXR0b24ubW9kdWxlLUNvbnZlcnNhdGlvbkhlYWRlcl9fYnV0dG9uLS1tb3JlJ1xuICAgICAgICApO1xuICAgICAgICBhd2FpdCBtb3JlQnV0dG9uLmNsaWNrKCk7XG5cbiAgICAgICAgY29uc3QgcGluQnV0dG9uID0gY29udmVyc2F0aW9uU3RhY2subG9jYXRvcihcbiAgICAgICAgICAnLnJlYWN0LWNvbnRleHRtZW51LWl0ZW0gPj4gXCJQaW4gQ29udmVyc2F0aW9uXCInXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHBpbkJ1dHRvbi5jbGljaygpO1xuXG4gICAgICAgIGlmIChpc0xhc3QpIHtcbiAgICAgICAgICAvLyBTdG9yYWdlIHN0YXRlIHNob3VsZG4ndCBiZSB1cGRhdGVkIGJlY2F1c2Ugd2UgZmFpbGVkIHRvIHBpblxuICAgICAgICAgIGF3YWl0IHdpbmRvd1xuICAgICAgICAgICAgLmxvY2F0b3IoJy5Ub2FzdCA+PiBcIllvdSBjYW4gb25seSBwaW4gdXAgdG8gNCBjaGF0c1wiJylcbiAgICAgICAgICAgIC53YWl0Rm9yKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWJ1ZygndmVyaWZ5aW5nIHN0b3JhZ2Ugc3RhdGUgY2hhbmdlIGNvbnRhY3Q9JWQnLCBpKTtcbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3RvcmFnZVN0YXRlKHtcbiAgICAgICAgICBhZnRlcjogc3RhdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGF3YWl0IG5ld1N0YXRlLmlzUGlubmVkKGNvbnRhY3QpLCAnY29udGFjdCBub3QgcGlubmVkJyk7XG5cbiAgICAgICAgLy8gQWNjb3VudFJlY29yZFxuICAgICAgICBjb25zdCB7IGFkZGVkLCByZW1vdmVkIH0gPSBuZXdTdGF0ZS5kaWZmKHN0YXRlKTtcbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFkZGVkLmxlbmd0aCwgMSwgJ29ubHkgb25lIHJlY29yZCBtdXN0IGJlIGFkZGVkJyk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICByZW1vdmVkLmxlbmd0aCxcbiAgICAgICAgICAxLFxuICAgICAgICAgICdvbmx5IG9uZSByZWNvcmQgbXVzdCBiZSByZW1vdmVkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCdWZXJpZnlpbmcgdGhlIGZpbmFsIG1hbmlmZXN0IHZlcnNpb24nKTtcbiAgICBjb25zdCBmaW5hbFN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGZpbmFsU3RhdGUudmVyc2lvbiwgNSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsa0JBQXVCO0FBSXZCLGdCQUEyQjtBQUUzQixzQkFBbUM7QUFFbkMsU0FBUyxtQkFBbUIscUJBQXFCO0FBQy9DLE9BQUssUUFBUSxVQUFVLE1BQU07QUFFN0IsTUFBSTtBQUNKLE1BQUk7QUFDSixNQUFJO0FBRUosYUFBVyxZQUFZO0FBQ3JCLElBQUMsR0FBRSxXQUFXLEtBQUss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
