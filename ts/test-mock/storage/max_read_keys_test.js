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
var import_mock_server = require("@signalapp/mock-server");
var durations = __toESM(require("../../util/durations"));
var import_UUID = require("../../types/UUID");
var import_storageConstants = require("../../services/storageConstants");
var import_fixtures = require("./fixtures");
const IdentifierType = import_mock_server.Proto.ManifestRecord.Identifier.Type;
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
  it("should receive all contacts despite low read keys limit", async () => {
    (0, import_fixtures.debug)("prepare for a slow test");
    const { phone, contacts } = bootstrap;
    const firstContact = contacts[0];
    const lastContact = contacts[contacts.length - 1];
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    (0, import_fixtures.debug)("wait for first contact to be pinned in the left pane");
    await leftPane.locator(`_react=ConversationListItem[isPinned = true] [title = ${JSON.stringify(firstContact.profileName)}]`).waitFor();
    {
      let state = await phone.expectStorageState("consistency check");
      (0, import_fixtures.debug)("generating a lot of fake contacts");
      for (let i = 0; i < import_storageConstants.MAX_READ_KEYS + 1; i += 1) {
        state = state.addRecord({
          type: IdentifierType.CONTACT,
          record: {
            contact: {
              serviceUuid: import_UUID.UUID.generate().toString()
            }
          }
        });
      }
      (0, import_fixtures.debug)("pinning last contact");
      state = state.pin(lastContact);
      await phone.setStorageState(state);
      (0, import_fixtures.debug)("sending fetch storage");
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
    }
    (0, import_fixtures.debug)("wait for last contact to be pinned in the left pane");
    await leftPane.locator(`_react=ConversationListItem[isPinned = true] [title = ${JSON.stringify(lastContact.profileName)}]`).waitFor({ timeout: durations.MINUTE });
    (0, import_fixtures.debug)("Verifying the final manifest version");
    const finalState = await phone.expectStorageState("consistency check");
    import_chai.assert.strictEqual(finalState.version, 2);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWF4X3JlYWRfa2V5c190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHsgUHJvdG8gfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IE1BWF9SRUFEX0tFWVMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zdG9yYWdlQ29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgQXBwLCBCb290c3RyYXAgfSBmcm9tICcuL2ZpeHR1cmVzJztcbmltcG9ydCB7IGluaXRTdG9yYWdlLCBkZWJ1ZyB9IGZyb20gJy4vZml4dHVyZXMnO1xuXG5jb25zdCBJZGVudGlmaWVyVHlwZSA9IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIuVHlwZTtcblxuZGVzY3JpYmUoJ3N0b3JhZ2Ugc2VydmljZScsIGZ1bmN0aW9uIG5lZWRzTmFtZSgpIHtcbiAgdGhpcy50aW1lb3V0KGR1cmF0aW9ucy5NSU5VVEUpO1xuXG4gIGxldCBib290c3RyYXA6IEJvb3RzdHJhcDtcbiAgbGV0IGFwcDogQXBwO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICh7IGJvb3RzdHJhcCwgYXBwIH0gPSBhd2FpdCBpbml0U3RvcmFnZSgpKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICghYm9vdHN0cmFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFRlc3Q/LnN0YXRlICE9PSAncGFzc2VkJykge1xuICAgICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgYXBwLmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVjZWl2ZSBhbGwgY29udGFjdHMgZGVzcGl0ZSBsb3cgcmVhZCBrZXlzIGxpbWl0JywgYXN5bmMgKCkgPT4ge1xuICAgIGRlYnVnKCdwcmVwYXJlIGZvciBhIHNsb3cgdGVzdCcpO1xuXG4gICAgY29uc3QgeyBwaG9uZSwgY29udGFjdHMgfSA9IGJvb3RzdHJhcDtcbiAgICBjb25zdCBmaXJzdENvbnRhY3QgPSBjb250YWN0c1swXTtcbiAgICBjb25zdCBsYXN0Q29udGFjdCA9IGNvbnRhY3RzW2NvbnRhY3RzLmxlbmd0aCAtIDFdO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG5cbiAgICBkZWJ1Zygnd2FpdCBmb3IgZmlyc3QgY29udGFjdCB0byBiZSBwaW5uZWQgaW4gdGhlIGxlZnQgcGFuZScpO1xuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcihcbiAgICAgICAgJ19yZWFjdD1Db252ZXJzYXRpb25MaXN0SXRlbScgK1xuICAgICAgICAgICdbaXNQaW5uZWQgPSB0cnVlXSAnICtcbiAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShmaXJzdENvbnRhY3QucHJvZmlsZU5hbWUpfV1gXG4gICAgICApXG4gICAgICAud2FpdEZvcigpO1xuXG4gICAge1xuICAgICAgbGV0IHN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgICBkZWJ1ZygnZ2VuZXJhdGluZyBhIGxvdCBvZiBmYWtlIGNvbnRhY3RzJyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1BWF9SRUFEX0tFWVMgKyAxOyBpICs9IDEpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZS5hZGRSZWNvcmQoe1xuICAgICAgICAgIHR5cGU6IElkZW50aWZpZXJUeXBlLkNPTlRBQ1QsXG4gICAgICAgICAgcmVjb3JkOiB7XG4gICAgICAgICAgICBjb250YWN0OiB7XG4gICAgICAgICAgICAgIHNlcnZpY2VVdWlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGRlYnVnKCdwaW5uaW5nIGxhc3QgY29udGFjdCcpO1xuICAgICAgc3RhdGUgPSBzdGF0ZS5waW4obGFzdENvbnRhY3QpO1xuXG4gICAgICBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoc3RhdGUpO1xuXG4gICAgICBkZWJ1Zygnc2VuZGluZyBmZXRjaCBzdG9yYWdlJyk7XG4gICAgICBhd2FpdCBwaG9uZS5zZW5kRmV0Y2hTdG9yYWdlKHtcbiAgICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkZWJ1Zygnd2FpdCBmb3IgbGFzdCBjb250YWN0IHRvIGJlIHBpbm5lZCBpbiB0aGUgbGVmdCBwYW5lJyk7XG4gICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgIC5sb2NhdG9yKFxuICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgJ1tpc1Bpbm5lZCA9IHRydWVdICcgK1xuICAgICAgICAgIGBbdGl0bGUgPSAke0pTT04uc3RyaW5naWZ5KGxhc3RDb250YWN0LnByb2ZpbGVOYW1lKX1dYFxuICAgICAgKVxuICAgICAgLndhaXRGb3IoeyB0aW1lb3V0OiBkdXJhdGlvbnMuTUlOVVRFIH0pO1xuXG4gICAgZGVidWcoJ1ZlcmlmeWluZyB0aGUgZmluYWwgbWFuaWZlc3QgdmVyc2lvbicpO1xuICAgIGNvbnN0IGZpbmFsU3RhdGUgPSBhd2FpdCBwaG9uZS5leHBlY3RTdG9yYWdlU3RhdGUoJ2NvbnNpc3RlbmN5IGNoZWNrJyk7XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZmluYWxTdGF0ZS52ZXJzaW9uLCAyKTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrQkFBdUI7QUFDdkIseUJBQXNCO0FBRXRCLGdCQUEyQjtBQUMzQixrQkFBcUI7QUFDckIsOEJBQThCO0FBRTlCLHNCQUFtQztBQUVuQyxNQUFNLGlCQUFpQix5QkFBTSxlQUFlLFdBQVc7QUFFdkQsU0FBUyxtQkFBbUIscUJBQXFCO0FBQy9DLE9BQUssUUFBUSxVQUFVLE1BQU07QUFFN0IsTUFBSTtBQUNKLE1BQUk7QUFFSixhQUFXLFlBQVk7QUFDckIsSUFBQyxHQUFFLFdBQVcsSUFBSSxJQUFJLE1BQU0saUNBQVk7QUFBQSxFQUMxQyxDQUFDO0FBRUQsWUFBVSx1QkFBdUI7QUFDL0IsUUFBSSxDQUFDLFdBQVc7QUFDZDtBQUFBLElBQ0Y7QUFFQSxRQUFJLEtBQUssYUFBYSxVQUFVLFVBQVU7QUFDeEMsWUFBTSxVQUFVLFNBQVM7QUFBQSxJQUMzQjtBQUVBLFVBQU0sSUFBSSxNQUFNO0FBQ2hCLFVBQU0sVUFBVSxTQUFTO0FBQUEsRUFDM0IsQ0FBQztBQUVELEtBQUcsMkRBQTJELFlBQVk7QUFDeEUsK0JBQU0seUJBQXlCO0FBRS9CLFVBQU0sRUFBRSxPQUFPLGFBQWE7QUFDNUIsVUFBTSxlQUFlLFNBQVM7QUFDOUIsVUFBTSxjQUFjLFNBQVMsU0FBUyxTQUFTO0FBRS9DLFVBQU0sU0FBUyxNQUFNLElBQUksVUFBVTtBQUVuQyxVQUFNLFdBQVcsT0FBTyxRQUFRLG9CQUFvQjtBQUVwRCwrQkFBTSxzREFBc0Q7QUFDNUQsVUFBTSxTQUNILFFBQ0MseURBRWMsS0FBSyxVQUFVLGFBQWEsV0FBVyxJQUN2RCxFQUNDLFFBQVE7QUFFWDtBQUNFLFVBQUksUUFBUSxNQUFNLE1BQU0sbUJBQW1CLG1CQUFtQjtBQUU5RCxpQ0FBTSxtQ0FBbUM7QUFDekMsZUFBUyxJQUFJLEdBQUcsSUFBSSx3Q0FBZ0IsR0FBRyxLQUFLLEdBQUc7QUFDN0MsZ0JBQVEsTUFBTSxVQUFVO0FBQUEsVUFDdEIsTUFBTSxlQUFlO0FBQUEsVUFDckIsUUFBUTtBQUFBLFlBQ04sU0FBUztBQUFBLGNBQ1AsYUFBYSxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUFBLFlBQ3hDO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0g7QUFFQSxpQ0FBTSxzQkFBc0I7QUFDNUIsY0FBUSxNQUFNLElBQUksV0FBVztBQUU3QixZQUFNLE1BQU0sZ0JBQWdCLEtBQUs7QUFFakMsaUNBQU0sdUJBQXVCO0FBQzdCLFlBQU0sTUFBTSxpQkFBaUI7QUFBQSxRQUMzQixXQUFXLFVBQVUsYUFBYTtBQUFBLE1BQ3BDLENBQUM7QUFBQSxJQUNIO0FBRUEsK0JBQU0scURBQXFEO0FBQzNELFVBQU0sU0FDSCxRQUNDLHlEQUVjLEtBQUssVUFBVSxZQUFZLFdBQVcsSUFDdEQsRUFDQyxRQUFRLEVBQUUsU0FBUyxVQUFVLE9BQU8sQ0FBQztBQUV4QywrQkFBTSxzQ0FBc0M7QUFDNUMsVUFBTSxhQUFhLE1BQU0sTUFBTSxtQkFBbUIsbUJBQW1CO0FBRXJFLHVCQUFPLFlBQVksV0FBVyxTQUFTLENBQUM7QUFBQSxFQUMxQyxDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
