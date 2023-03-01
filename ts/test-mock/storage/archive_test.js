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
  it("should archive/unarchive contacts", async () => {
    const { phone, contacts } = bootstrap;
    const [firstContact] = contacts;
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    const conversationStack = window.locator(".conversation-stack");
    (0, import_fixtures.debug)("archiving contact");
    {
      const state = await phone.expectStorageState("consistency check");
      await phone.setStorageState(state.updateContact(firstContact, { archived: true }).unpin(firstContact));
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(firstContact.profileName)}]`).waitFor({ state: "hidden" });
      await leftPane.locator("button.module-conversation-list__item--archive-button").waitFor();
    }
    (0, import_fixtures.debug)("unarchiving pinned contact");
    {
      const state = await phone.expectStorageState("consistency check");
      await phone.setStorageState(state.updateContact(firstContact, { archived: false }).pin(firstContact));
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      await leftPane.locator(`_react=ConversationListItem[isPinned = true][title = ${JSON.stringify(firstContact.profileName)}]`).waitFor();
      await leftPane.locator("button.module-conversation-list__item--archive-button").waitFor({ state: "hidden" });
    }
    (0, import_fixtures.debug)("archive pinned contact in the app");
    {
      const state = await phone.expectStorageState("consistency check");
      await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(firstContact.profileName)}]`).click();
      const moreButton = conversationStack.locator("button.module-ConversationHeader__button--more");
      await moreButton.click();
      const archiveButton = conversationStack.locator('.react-contextmenu-item >> "Archive"');
      await archiveButton.click();
      const newState = await phone.waitForStorageState({
        after: state
      });
      import_chai.assert.ok(!await newState.isPinned(firstContact), "contact not pinned");
      const record = await newState.getContact(firstContact);
      import_chai.assert.ok(record, "contact record not found");
      import_chai.assert.ok(record?.archived, "contact archived");
      const { added, removed } = newState.diff(state);
      import_chai.assert.strictEqual(added.length, 2, "only two records must be added");
      import_chai.assert.strictEqual(removed.length, 2, "only two records must be removed");
    }
    (0, import_fixtures.debug)("Verifying the final manifest version");
    const finalState = await phone.expectStorageState("consistency check");
    import_chai.assert.strictEqual(finalState.version, 4);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXJjaGl2ZV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBBcHAsIEJvb3RzdHJhcCB9IGZyb20gJy4vZml4dHVyZXMnO1xuaW1wb3J0IHsgaW5pdFN0b3JhZ2UsIGRlYnVnIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5cbmRlc2NyaWJlKCdzdG9yYWdlIHNlcnZpY2UnLCBmdW5jdGlvbiBuZWVkc05hbWUoKSB7XG4gIHRoaXMudGltZW91dChkdXJhdGlvbnMuTUlOVVRFKTtcblxuICBsZXQgYm9vdHN0cmFwOiBCb290c3RyYXA7XG4gIGxldCBhcHA6IEFwcDtcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAoeyBib290c3RyYXAsIGFwcCB9ID0gYXdhaXQgaW5pdFN0b3JhZ2UoKSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChhc3luYyBmdW5jdGlvbiBhZnRlcigpIHtcbiAgICBpZiAoIWJvb3RzdHJhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmN1cnJlbnRUZXN0Py5zdGF0ZSAhPT0gJ3Bhc3NlZCcpIHtcbiAgICAgIGF3YWl0IGJvb3RzdHJhcC5zYXZlTG9ncygpO1xuICAgIH1cblxuICAgIGF3YWl0IGFwcC5jbG9zZSgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC50ZWFyZG93bigpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFyY2hpdmUvdW5hcmNoaXZlIGNvbnRhY3RzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUsIGNvbnRhY3RzIH0gPSBib290c3RyYXA7XG4gICAgY29uc3QgW2ZpcnN0Q29udGFjdF0gPSBjb250YWN0cztcblxuICAgIGNvbnN0IHdpbmRvdyA9IGF3YWl0IGFwcC5nZXRXaW5kb3coKTtcblxuICAgIGNvbnN0IGxlZnRQYW5lID0gd2luZG93LmxvY2F0b3IoJy5sZWZ0LXBhbmUtd3JhcHBlcicpO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvblN0YWNrID0gd2luZG93LmxvY2F0b3IoJy5jb252ZXJzYXRpb24tc3RhY2snKTtcblxuICAgIGRlYnVnKCdhcmNoaXZpbmcgY29udGFjdCcpO1xuICAgIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgICBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoXG4gICAgICAgIHN0YXRlXG4gICAgICAgICAgLnVwZGF0ZUNvbnRhY3QoZmlyc3RDb250YWN0LCB7IGFyY2hpdmVkOiB0cnVlIH0pXG4gICAgICAgICAgLnVucGluKGZpcnN0Q29udGFjdClcbiAgICAgICk7XG4gICAgICBhd2FpdCBwaG9uZS5zZW5kRmV0Y2hTdG9yYWdlKHtcbiAgICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgICAgLmxvY2F0b3IoXG4gICAgICAgICAgJ19yZWFjdD1Db252ZXJzYXRpb25MaXN0SXRlbScgK1xuICAgICAgICAgICAgYFt0aXRsZSA9ICR7SlNPTi5zdHJpbmdpZnkoZmlyc3RDb250YWN0LnByb2ZpbGVOYW1lKX1dYFxuICAgICAgICApXG4gICAgICAgIC53YWl0Rm9yKHsgc3RhdGU6ICdoaWRkZW4nIH0pO1xuXG4gICAgICBhd2FpdCBsZWZ0UGFuZVxuICAgICAgICAubG9jYXRvcignYnV0dG9uLm1vZHVsZS1jb252ZXJzYXRpb24tbGlzdF9faXRlbS0tYXJjaGl2ZS1idXR0b24nKVxuICAgICAgICAud2FpdEZvcigpO1xuICAgIH1cblxuICAgIGRlYnVnKCd1bmFyY2hpdmluZyBwaW5uZWQgY29udGFjdCcpO1xuICAgIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgICBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoXG4gICAgICAgIHN0YXRlLnVwZGF0ZUNvbnRhY3QoZmlyc3RDb250YWN0LCB7IGFyY2hpdmVkOiBmYWxzZSB9KS5waW4oZmlyc3RDb250YWN0KVxuICAgICAgKTtcbiAgICAgIGF3YWl0IHBob25lLnNlbmRGZXRjaFN0b3JhZ2Uoe1xuICAgICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBsZWZ0UGFuZVxuICAgICAgICAubG9jYXRvcihcbiAgICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgICAnW2lzUGlubmVkID0gdHJ1ZV0nICtcbiAgICAgICAgICAgIGBbdGl0bGUgPSAke0pTT04uc3RyaW5naWZ5KGZpcnN0Q29udGFjdC5wcm9maWxlTmFtZSl9XWBcbiAgICAgICAgKVxuICAgICAgICAud2FpdEZvcigpO1xuXG4gICAgICBhd2FpdCBsZWZ0UGFuZVxuICAgICAgICAubG9jYXRvcignYnV0dG9uLm1vZHVsZS1jb252ZXJzYXRpb24tbGlzdF9faXRlbS0tYXJjaGl2ZS1idXR0b24nKVxuICAgICAgICAud2FpdEZvcih7IHN0YXRlOiAnaGlkZGVuJyB9KTtcbiAgICB9XG5cbiAgICBkZWJ1ZygnYXJjaGl2ZSBwaW5uZWQgY29udGFjdCBpbiB0aGUgYXBwJyk7XG4gICAge1xuICAgICAgY29uc3Qgc3RhdGUgPSBhd2FpdCBwaG9uZS5leHBlY3RTdG9yYWdlU3RhdGUoJ2NvbnNpc3RlbmN5IGNoZWNrJyk7XG5cbiAgICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAgIC5sb2NhdG9yKFxuICAgICAgICAgICdfcmVhY3Q9Q29udmVyc2F0aW9uTGlzdEl0ZW0nICtcbiAgICAgICAgICAgIGBbdGl0bGUgPSAke0pTT04uc3RyaW5naWZ5KGZpcnN0Q29udGFjdC5wcm9maWxlTmFtZSl9XWBcbiAgICAgICAgKVxuICAgICAgICAuY2xpY2soKTtcblxuICAgICAgY29uc3QgbW9yZUJ1dHRvbiA9IGNvbnZlcnNhdGlvblN0YWNrLmxvY2F0b3IoXG4gICAgICAgICdidXR0b24ubW9kdWxlLUNvbnZlcnNhdGlvbkhlYWRlcl9fYnV0dG9uLS1tb3JlJ1xuICAgICAgKTtcbiAgICAgIGF3YWl0IG1vcmVCdXR0b24uY2xpY2soKTtcblxuICAgICAgY29uc3QgYXJjaGl2ZUJ1dHRvbiA9IGNvbnZlcnNhdGlvblN0YWNrLmxvY2F0b3IoXG4gICAgICAgICcucmVhY3QtY29udGV4dG1lbnUtaXRlbSA+PiBcIkFyY2hpdmVcIidcbiAgICAgICk7XG4gICAgICBhd2FpdCBhcmNoaXZlQnV0dG9uLmNsaWNrKCk7XG5cbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gYXdhaXQgcGhvbmUud2FpdEZvclN0b3JhZ2VTdGF0ZSh7XG4gICAgICAgIGFmdGVyOiBzdGF0ZSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0Lm9rKCEoYXdhaXQgbmV3U3RhdGUuaXNQaW5uZWQoZmlyc3RDb250YWN0KSksICdjb250YWN0IG5vdCBwaW5uZWQnKTtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IG5ld1N0YXRlLmdldENvbnRhY3QoZmlyc3RDb250YWN0KTtcbiAgICAgIGFzc2VydC5vayhyZWNvcmQsICdjb250YWN0IHJlY29yZCBub3QgZm91bmQnKTtcbiAgICAgIGFzc2VydC5vayhyZWNvcmQ/LmFyY2hpdmVkLCAnY29udGFjdCBhcmNoaXZlZCcpO1xuXG4gICAgICAvLyBBY2NvdW50UmVjb3JkICsgQ29udGFjdFJlY29yZFxuICAgICAgY29uc3QgeyBhZGRlZCwgcmVtb3ZlZCB9ID0gbmV3U3RhdGUuZGlmZihzdGF0ZSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWRkZWQubGVuZ3RoLCAyLCAnb25seSB0d28gcmVjb3JkcyBtdXN0IGJlIGFkZGVkJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVtb3ZlZC5sZW5ndGgsIDIsICdvbmx5IHR3byByZWNvcmRzIG11c3QgYmUgcmVtb3ZlZCcpO1xuICAgIH1cblxuICAgIGRlYnVnKCdWZXJpZnlpbmcgdGhlIGZpbmFsIG1hbmlmZXN0IHZlcnNpb24nKTtcbiAgICBjb25zdCBmaW5hbFN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGZpbmFsU3RhdGUudmVyc2lvbiwgNCk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esa0JBQXVCO0FBRXZCLGdCQUEyQjtBQUUzQixzQkFBbUM7QUFFbkMsU0FBUyxtQkFBbUIscUJBQXFCO0FBQy9DLE9BQUssUUFBUSxVQUFVLE1BQU07QUFFN0IsTUFBSTtBQUNKLE1BQUk7QUFFSixhQUFXLFlBQVk7QUFDckIsSUFBQyxHQUFFLFdBQVcsSUFBSSxJQUFJLE1BQU0saUNBQVk7QUFBQSxFQUMxQyxDQUFDO0FBRUQsWUFBVSx1QkFBdUI7QUFDL0IsUUFBSSxDQUFDLFdBQVc7QUFDZDtBQUFBLElBQ0Y7QUFFQSxRQUFJLEtBQUssYUFBYSxVQUFVLFVBQVU7QUFDeEMsWUFBTSxVQUFVLFNBQVM7QUFBQSxJQUMzQjtBQUVBLFVBQU0sSUFBSSxNQUFNO0FBQ2hCLFVBQU0sVUFBVSxTQUFTO0FBQUEsRUFDM0IsQ0FBQztBQUVELEtBQUcscUNBQXFDLFlBQVk7QUFDbEQsVUFBTSxFQUFFLE9BQU8sYUFBYTtBQUM1QixVQUFNLENBQUMsZ0JBQWdCO0FBRXZCLFVBQU0sU0FBUyxNQUFNLElBQUksVUFBVTtBQUVuQyxVQUFNLFdBQVcsT0FBTyxRQUFRLG9CQUFvQjtBQUNwRCxVQUFNLG9CQUFvQixPQUFPLFFBQVEscUJBQXFCO0FBRTlELCtCQUFNLG1CQUFtQjtBQUN6QjtBQUNFLFlBQU0sUUFBUSxNQUFNLE1BQU0sbUJBQW1CLG1CQUFtQjtBQUVoRSxZQUFNLE1BQU0sZ0JBQ1YsTUFDRyxjQUFjLGNBQWMsRUFBRSxVQUFVLEtBQUssQ0FBQyxFQUM5QyxNQUFNLFlBQVksQ0FDdkI7QUFDQSxZQUFNLE1BQU0saUJBQWlCO0FBQUEsUUFDM0IsV0FBVyxVQUFVLGFBQWE7QUFBQSxNQUNwQyxDQUFDO0FBRUQsWUFBTSxTQUNILFFBQ0MsdUNBQ2MsS0FBSyxVQUFVLGFBQWEsV0FBVyxJQUN2RCxFQUNDLFFBQVEsRUFBRSxPQUFPLFNBQVMsQ0FBQztBQUU5QixZQUFNLFNBQ0gsUUFBUSx1REFBdUQsRUFDL0QsUUFBUTtBQUFBLElBQ2I7QUFFQSwrQkFBTSw0QkFBNEI7QUFDbEM7QUFDRSxZQUFNLFFBQVEsTUFBTSxNQUFNLG1CQUFtQixtQkFBbUI7QUFFaEUsWUFBTSxNQUFNLGdCQUNWLE1BQU0sY0FBYyxjQUFjLEVBQUUsVUFBVSxNQUFNLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FDekU7QUFDQSxZQUFNLE1BQU0saUJBQWlCO0FBQUEsUUFDM0IsV0FBVyxVQUFVLGFBQWE7QUFBQSxNQUNwQyxDQUFDO0FBRUQsWUFBTSxTQUNILFFBQ0Msd0RBRWMsS0FBSyxVQUFVLGFBQWEsV0FBVyxJQUN2RCxFQUNDLFFBQVE7QUFFWCxZQUFNLFNBQ0gsUUFBUSx1REFBdUQsRUFDL0QsUUFBUSxFQUFFLE9BQU8sU0FBUyxDQUFDO0FBQUEsSUFDaEM7QUFFQSwrQkFBTSxtQ0FBbUM7QUFDekM7QUFDRSxZQUFNLFFBQVEsTUFBTSxNQUFNLG1CQUFtQixtQkFBbUI7QUFFaEUsWUFBTSxTQUNILFFBQ0MsdUNBQ2MsS0FBSyxVQUFVLGFBQWEsV0FBVyxJQUN2RCxFQUNDLE1BQU07QUFFVCxZQUFNLGFBQWEsa0JBQWtCLFFBQ25DLGdEQUNGO0FBQ0EsWUFBTSxXQUFXLE1BQU07QUFFdkIsWUFBTSxnQkFBZ0Isa0JBQWtCLFFBQ3RDLHNDQUNGO0FBQ0EsWUFBTSxjQUFjLE1BQU07QUFFMUIsWUFBTSxXQUFXLE1BQU0sTUFBTSxvQkFBb0I7QUFBQSxRQUMvQyxPQUFPO0FBQUEsTUFDVCxDQUFDO0FBQ0QseUJBQU8sR0FBRyxDQUFFLE1BQU0sU0FBUyxTQUFTLFlBQVksR0FBSSxvQkFBb0I7QUFDeEUsWUFBTSxTQUFTLE1BQU0sU0FBUyxXQUFXLFlBQVk7QUFDckQseUJBQU8sR0FBRyxRQUFRLDBCQUEwQjtBQUM1Qyx5QkFBTyxHQUFHLFFBQVEsVUFBVSxrQkFBa0I7QUFHOUMsWUFBTSxFQUFFLE9BQU8sWUFBWSxTQUFTLEtBQUssS0FBSztBQUM5Qyx5QkFBTyxZQUFZLE1BQU0sUUFBUSxHQUFHLGdDQUFnQztBQUNwRSx5QkFBTyxZQUFZLFFBQVEsUUFBUSxHQUFHLGtDQUFrQztBQUFBLElBQzFFO0FBRUEsK0JBQU0sc0NBQXNDO0FBQzVDLFVBQU0sYUFBYSxNQUFNLE1BQU0sbUJBQW1CLG1CQUFtQjtBQUVyRSx1QkFBTyxZQUFZLFdBQVcsU0FBUyxDQUFDO0FBQUEsRUFDMUMsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
