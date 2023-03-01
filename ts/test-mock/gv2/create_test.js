var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var create_test_exports = {};
__export(create_test_exports, {
  debug: () => debug
});
module.exports = __toCommonJS(create_test_exports);
var import_chai = require("chai");
var import_mock_server = require("@signalapp/mock-server");
var import_debug = __toESM(require("debug"));
var durations = __toESM(require("../../util/durations"));
var import_bootstrap = require("../bootstrap");
var import_Stories = require("../../types/Stories");
var import_uuidToBytes = require("../../util/uuidToBytes");
const IdentifierType = import_mock_server.Proto.ManifestRecord.Identifier.Type;
const debug = (0, import_debug.default)("mock:test:gv2");
describe("gv2", function needsName() {
  this.timeout(durations.MINUTE);
  let bootstrap;
  let app;
  let aciContact;
  let pniContact;
  beforeEach(async () => {
    bootstrap = new import_bootstrap.Bootstrap();
    await bootstrap.init();
    const { phone, server } = bootstrap;
    let state = import_mock_server.StorageState.getEmpty();
    state = state.updateAccount({
      profileKey: phone.profileKey.serialize(),
      e164: phone.device.number
    });
    aciContact = await server.createPrimaryDevice({
      profileName: "ACI Contact"
    });
    state = state.addContact(aciContact, {
      identityState: import_mock_server.Proto.ContactRecord.IdentityState.VERIFIED,
      whitelisted: true,
      identityKey: aciContact.publicKey.serialize(),
      profileKey: aciContact.profileKey.serialize()
    });
    pniContact = await server.createPrimaryDevice({
      profileName: "My profile is a secret"
    });
    state = state.addContact(pniContact, {
      identityState: import_mock_server.Proto.ContactRecord.IdentityState.VERIFIED,
      whitelisted: true,
      identityKey: pniContact.getPublicKey(import_mock_server.UUIDKind.PNI).serialize(),
      serviceUuid: pniContact.device.pni,
      givenName: "PNI Contact"
    });
    state = state.addRecord({
      type: IdentifierType.STORY_DISTRIBUTION_LIST,
      record: {
        storyDistributionList: {
          allowsReplies: true,
          identifier: (0, import_uuidToBytes.uuidToBytes)(import_Stories.MY_STORIES_ID),
          isBlockList: true,
          name: import_Stories.MY_STORIES_ID,
          recipientUuids: []
        }
      }
    });
    await phone.setStorageState(state);
    app = await bootstrap.link();
  });
  afterEach(async function after() {
    if (this.currentTest?.state !== "passed") {
      await bootstrap.saveLogs();
    }
    await app.close();
    await bootstrap.teardown();
  });
  it("should create group and modify it", async () => {
    const { phone } = bootstrap;
    let state = await phone.expectStorageState("initial state");
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    const conversationStack = window.locator(".conversation-stack");
    debug('clicking compose and "New group" buttons');
    await leftPane.locator(".module-main-header__compose-icon").click();
    await leftPane.locator('_react=BaseConversationListItem[title = "New group"]').click();
    debug("inviting ACI member");
    await leftPane.locator(".module-left-pane__compose-search-form__input").fill("ACI");
    await leftPane.locator('_react=BaseConversationListItem[title = "ACI Contact"]').click();
    debug("inviting PNI member");
    await leftPane.locator(".module-left-pane__compose-search-form__input").fill("PNI");
    await leftPane.locator('_react=BaseConversationListItem[title = "PNI Contact"]').click();
    await leftPane.locator('.module-left-pane__footer button >> "Next"').click();
    debug("entering group title");
    await leftPane.type("My group");
    await leftPane.locator('.module-left-pane__footer button >> "Create"').click();
    debug("waiting for invitation modal");
    {
      const modal = window.locator('.module-GroupDialog:has-text("Invitation sent")');
      await modal.locator('button >> "Okay"').click();
    }
    debug("waiting for group data from storage service");
    let group;
    {
      state = await phone.waitForStorageState({ after: state });
      const groups = await phone.getAllGroups(state);
      import_chai.assert.strictEqual(groups.length, 1);
      [group] = groups;
      import_chai.assert.strictEqual(group.title, "My group");
      import_chai.assert.strictEqual(group.revision, 0);
      import_chai.assert.strictEqual(group.state.members?.length, 2);
      import_chai.assert.strictEqual(group.state.membersPendingProfileKey?.length, 1);
    }
    debug("opening group settings");
    await conversationStack.locator("button.module-ConversationHeader__button--more").click();
    await conversationStack.locator('.react-contextmenu-item >> "Group settings"').click();
    debug("editing group title");
    {
      const detailsHeader = conversationStack.locator("_react=ConversationDetailsHeader");
      detailsHeader.locator('button >> "My group"').click();
      const modal = window.locator('.module-Modal:has-text("Edit group")');
      await modal.type(" (v2)");
      await modal.locator('button >> "Save"').click();
    }
    debug("waiting for the second group update");
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.title, "My group (v2)");
    import_chai.assert.strictEqual(group.revision, 1);
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY3JlYXRlX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgdHlwZSB7IFByaW1hcnlEZXZpY2UsIEdyb3VwIH0gZnJvbSAnQHNpZ25hbGFwcC9tb2NrLXNlcnZlcic7XG5pbXBvcnQgeyBTdG9yYWdlU3RhdGUsIFByb3RvLCBVVUlES2luZCB9IGZyb20gJ0BzaWduYWxhcHAvbW9jay1zZXJ2ZXInO1xuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IEJvb3RzdHJhcCB9IGZyb20gJy4uL2Jvb3RzdHJhcCc7XG5pbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gJy4uL2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBNWV9TVE9SSUVTX0lEIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyB1dWlkVG9CeXRlcyB9IGZyb20gJy4uLy4uL3V0aWwvdXVpZFRvQnl0ZXMnO1xuXG5jb25zdCBJZGVudGlmaWVyVHlwZSA9IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIuVHlwZTtcblxuZXhwb3J0IGNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ21vY2s6dGVzdDpndjInKTtcblxuZGVzY3JpYmUoJ2d2MicsIGZ1bmN0aW9uIG5lZWRzTmFtZSgpIHtcbiAgdGhpcy50aW1lb3V0KGR1cmF0aW9ucy5NSU5VVEUpO1xuXG4gIGxldCBib290c3RyYXA6IEJvb3RzdHJhcDtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgYWNpQ29udGFjdDogUHJpbWFyeURldmljZTtcbiAgbGV0IHBuaUNvbnRhY3Q6IFByaW1hcnlEZXZpY2U7XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYm9vdHN0cmFwID0gbmV3IEJvb3RzdHJhcCgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC5pbml0KCk7XG5cbiAgICBjb25zdCB7IHBob25lLCBzZXJ2ZXIgfSA9IGJvb3RzdHJhcDtcblxuICAgIGxldCBzdGF0ZSA9IFN0b3JhZ2VTdGF0ZS5nZXRFbXB0eSgpO1xuXG4gICAgc3RhdGUgPSBzdGF0ZS51cGRhdGVBY2NvdW50KHtcbiAgICAgIHByb2ZpbGVLZXk6IHBob25lLnByb2ZpbGVLZXkuc2VyaWFsaXplKCksXG4gICAgICBlMTY0OiBwaG9uZS5kZXZpY2UubnVtYmVyLFxuICAgIH0pO1xuXG4gICAgYWNpQ29udGFjdCA9IGF3YWl0IHNlcnZlci5jcmVhdGVQcmltYXJ5RGV2aWNlKHtcbiAgICAgIHByb2ZpbGVOYW1lOiAnQUNJIENvbnRhY3QnLFxuICAgIH0pO1xuICAgIHN0YXRlID0gc3RhdGUuYWRkQ29udGFjdChhY2lDb250YWN0LCB7XG4gICAgICBpZGVudGl0eVN0YXRlOiBQcm90by5Db250YWN0UmVjb3JkLklkZW50aXR5U3RhdGUuVkVSSUZJRUQsXG4gICAgICB3aGl0ZWxpc3RlZDogdHJ1ZSxcblxuICAgICAgaWRlbnRpdHlLZXk6IGFjaUNvbnRhY3QucHVibGljS2V5LnNlcmlhbGl6ZSgpLFxuICAgICAgcHJvZmlsZUtleTogYWNpQ29udGFjdC5wcm9maWxlS2V5LnNlcmlhbGl6ZSgpLFxuICAgIH0pO1xuXG4gICAgcG5pQ29udGFjdCA9IGF3YWl0IHNlcnZlci5jcmVhdGVQcmltYXJ5RGV2aWNlKHtcbiAgICAgIHByb2ZpbGVOYW1lOiAnTXkgcHJvZmlsZSBpcyBhIHNlY3JldCcsXG4gICAgfSk7XG4gICAgc3RhdGUgPSBzdGF0ZS5hZGRDb250YWN0KHBuaUNvbnRhY3QsIHtcbiAgICAgIGlkZW50aXR5U3RhdGU6IFByb3RvLkNvbnRhY3RSZWNvcmQuSWRlbnRpdHlTdGF0ZS5WRVJJRklFRCxcbiAgICAgIHdoaXRlbGlzdGVkOiB0cnVlLFxuXG4gICAgICBpZGVudGl0eUtleTogcG5pQ29udGFjdC5nZXRQdWJsaWNLZXkoVVVJREtpbmQuUE5JKS5zZXJpYWxpemUoKSxcblxuICAgICAgLy8gR2l2ZSBQTkkgYXMgdGhlIHV1aWQhXG4gICAgICBzZXJ2aWNlVXVpZDogcG5pQ29udGFjdC5kZXZpY2UucG5pLFxuICAgICAgZ2l2ZW5OYW1lOiAnUE5JIENvbnRhY3QnLFxuICAgIH0pO1xuXG4gICAgc3RhdGUgPSBzdGF0ZS5hZGRSZWNvcmQoe1xuICAgICAgdHlwZTogSWRlbnRpZmllclR5cGUuU1RPUllfRElTVFJJQlVUSU9OX0xJU1QsXG4gICAgICByZWNvcmQ6IHtcbiAgICAgICAgc3RvcnlEaXN0cmlidXRpb25MaXN0OiB7XG4gICAgICAgICAgYWxsb3dzUmVwbGllczogdHJ1ZSxcbiAgICAgICAgICBpZGVudGlmaWVyOiB1dWlkVG9CeXRlcyhNWV9TVE9SSUVTX0lEKSxcbiAgICAgICAgICBpc0Jsb2NrTGlzdDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiBNWV9TVE9SSUVTX0lELFxuICAgICAgICAgIHJlY2lwaWVudFV1aWRzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoc3RhdGUpO1xuXG4gICAgYXBwID0gYXdhaXQgYm9vdHN0cmFwLmxpbmsoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUZXN0Py5zdGF0ZSAhPT0gJ3Bhc3NlZCcpIHtcbiAgICAgIGF3YWl0IGJvb3RzdHJhcC5zYXZlTG9ncygpO1xuICAgIH1cblxuICAgIGF3YWl0IGFwcC5jbG9zZSgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC50ZWFyZG93bigpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBncm91cCBhbmQgbW9kaWZ5IGl0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUgfSA9IGJvb3RzdHJhcDtcblxuICAgIGxldCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnaW5pdGlhbCBzdGF0ZScpO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG4gICAgY29uc3QgY29udmVyc2F0aW9uU3RhY2sgPSB3aW5kb3cubG9jYXRvcignLmNvbnZlcnNhdGlvbi1zdGFjaycpO1xuXG4gICAgZGVidWcoJ2NsaWNraW5nIGNvbXBvc2UgYW5kIFwiTmV3IGdyb3VwXCIgYnV0dG9ucycpO1xuXG4gICAgYXdhaXQgbGVmdFBhbmUubG9jYXRvcignLm1vZHVsZS1tYWluLWhlYWRlcl9fY29tcG9zZS1pY29uJykuY2xpY2soKTtcblxuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcignX3JlYWN0PUJhc2VDb252ZXJzYXRpb25MaXN0SXRlbVt0aXRsZSA9IFwiTmV3IGdyb3VwXCJdJylcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZGVidWcoJ2ludml0aW5nIEFDSSBtZW1iZXInKTtcblxuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcignLm1vZHVsZS1sZWZ0LXBhbmVfX2NvbXBvc2Utc2VhcmNoLWZvcm1fX2lucHV0JylcbiAgICAgIC5maWxsKCdBQ0knKTtcblxuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcignX3JlYWN0PUJhc2VDb252ZXJzYXRpb25MaXN0SXRlbVt0aXRsZSA9IFwiQUNJIENvbnRhY3RcIl0nKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBkZWJ1ZygnaW52aXRpbmcgUE5JIG1lbWJlcicpO1xuXG4gICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLWxlZnQtcGFuZV9fY29tcG9zZS1zZWFyY2gtZm9ybV9faW5wdXQnKVxuICAgICAgLmZpbGwoJ1BOSScpO1xuXG4gICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgIC5sb2NhdG9yKCdfcmVhY3Q9QmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtW3RpdGxlID0gXCJQTkkgQ29udGFjdFwiXScpXG4gICAgICAuY2xpY2soKTtcblxuICAgIGF3YWl0IGxlZnRQYW5lXG4gICAgICAubG9jYXRvcignLm1vZHVsZS1sZWZ0LXBhbmVfX2Zvb3RlciBidXR0b24gPj4gXCJOZXh0XCInKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBkZWJ1ZygnZW50ZXJpbmcgZ3JvdXAgdGl0bGUnKTtcblxuICAgIGF3YWl0IGxlZnRQYW5lLnR5cGUoJ015IGdyb3VwJyk7XG5cbiAgICBhd2FpdCBsZWZ0UGFuZVxuICAgICAgLmxvY2F0b3IoJy5tb2R1bGUtbGVmdC1wYW5lX19mb290ZXIgYnV0dG9uID4+IFwiQ3JlYXRlXCInKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBkZWJ1Zygnd2FpdGluZyBmb3IgaW52aXRhdGlvbiBtb2RhbCcpO1xuXG4gICAge1xuICAgICAgY29uc3QgbW9kYWwgPSB3aW5kb3cubG9jYXRvcihcbiAgICAgICAgJy5tb2R1bGUtR3JvdXBEaWFsb2c6aGFzLXRleHQoXCJJbnZpdGF0aW9uIHNlbnRcIiknXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBtb2RhbC5sb2NhdG9yKCdidXR0b24gPj4gXCJPa2F5XCInKS5jbGljaygpO1xuICAgIH1cblxuICAgIGRlYnVnKCd3YWl0aW5nIGZvciBncm91cCBkYXRhIGZyb20gc3RvcmFnZSBzZXJ2aWNlJyk7XG5cbiAgICBsZXQgZ3JvdXA6IEdyb3VwO1xuICAgIHtcbiAgICAgIHN0YXRlID0gYXdhaXQgcGhvbmUud2FpdEZvclN0b3JhZ2VTdGF0ZSh7IGFmdGVyOiBzdGF0ZSB9KTtcblxuICAgICAgY29uc3QgZ3JvdXBzID0gYXdhaXQgcGhvbmUuZ2V0QWxsR3JvdXBzKHN0YXRlKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cHMubGVuZ3RoLCAxKTtcblxuICAgICAgW2dyb3VwXSA9IGdyb3VwcztcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC50aXRsZSwgJ015IGdyb3VwJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZ3JvdXAucmV2aXNpb24sIDApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnN0YXRlLm1lbWJlcnM/Lmxlbmd0aCwgMik7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZ3JvdXAuc3RhdGUubWVtYmVyc1BlbmRpbmdQcm9maWxlS2V5Py5sZW5ndGgsIDEpO1xuICAgIH1cblxuICAgIGRlYnVnKCdvcGVuaW5nIGdyb3VwIHNldHRpbmdzJyk7XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb25TdGFja1xuICAgICAgLmxvY2F0b3IoJ2J1dHRvbi5tb2R1bGUtQ29udmVyc2F0aW9uSGVhZGVyX19idXR0b24tLW1vcmUnKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb25TdGFja1xuICAgICAgLmxvY2F0b3IoJy5yZWFjdC1jb250ZXh0bWVudS1pdGVtID4+IFwiR3JvdXAgc2V0dGluZ3NcIicpXG4gICAgICAuY2xpY2soKTtcblxuICAgIGRlYnVnKCdlZGl0aW5nIGdyb3VwIHRpdGxlJyk7XG4gICAge1xuICAgICAgY29uc3QgZGV0YWlsc0hlYWRlciA9IGNvbnZlcnNhdGlvblN0YWNrLmxvY2F0b3IoXG4gICAgICAgICdfcmVhY3Q9Q29udmVyc2F0aW9uRGV0YWlsc0hlYWRlcidcbiAgICAgICk7XG4gICAgICBkZXRhaWxzSGVhZGVyLmxvY2F0b3IoJ2J1dHRvbiA+PiBcIk15IGdyb3VwXCInKS5jbGljaygpO1xuXG4gICAgICBjb25zdCBtb2RhbCA9IHdpbmRvdy5sb2NhdG9yKCcubW9kdWxlLU1vZGFsOmhhcy10ZXh0KFwiRWRpdCBncm91cFwiKScpO1xuXG4gICAgICAvLyBHcm91cCB0aXRsZSBzaG91bGQgYmUgaW1tZWRpYXRlbHkgZm9jdXNlZC5cbiAgICAgIGF3YWl0IG1vZGFsLnR5cGUoJyAodjIpJyk7XG5cbiAgICAgIGF3YWl0IG1vZGFsLmxvY2F0b3IoJ2J1dHRvbiA+PiBcIlNhdmVcIicpLmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZGVidWcoJ3dhaXRpbmcgZm9yIHRoZSBzZWNvbmQgZ3JvdXAgdXBkYXRlJyk7XG4gICAgZ3JvdXAgPSBhd2FpdCBwaG9uZS53YWl0Rm9yR3JvdXBVcGRhdGUoZ3JvdXApO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnRpdGxlLCAnTXkgZ3JvdXAgKHYyKScpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC5yZXZpc2lvbiwgMSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esa0JBQXVCO0FBRXZCLHlCQUE4QztBQUM5QyxtQkFBd0I7QUFFeEIsZ0JBQTJCO0FBQzNCLHVCQUEwQjtBQUUxQixxQkFBOEI7QUFDOUIseUJBQTRCO0FBRTVCLE1BQU0saUJBQWlCLHlCQUFNLGVBQWUsV0FBVztBQUVoRCxNQUFNLFFBQVEsMEJBQVksZUFBZTtBQUVoRCxTQUFTLE9BQU8scUJBQXFCO0FBQ25DLE9BQUssUUFBUSxVQUFVLE1BQU07QUFFN0IsTUFBSTtBQUNKLE1BQUk7QUFDSixNQUFJO0FBQ0osTUFBSTtBQUVKLGFBQVcsWUFBWTtBQUNyQixnQkFBWSxJQUFJLDJCQUFVO0FBQzFCLFVBQU0sVUFBVSxLQUFLO0FBRXJCLFVBQU0sRUFBRSxPQUFPLFdBQVc7QUFFMUIsUUFBSSxRQUFRLGdDQUFhLFNBQVM7QUFFbEMsWUFBUSxNQUFNLGNBQWM7QUFBQSxNQUMxQixZQUFZLE1BQU0sV0FBVyxVQUFVO0FBQUEsTUFDdkMsTUFBTSxNQUFNLE9BQU87QUFBQSxJQUNyQixDQUFDO0FBRUQsaUJBQWEsTUFBTSxPQUFPLG9CQUFvQjtBQUFBLE1BQzVDLGFB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
