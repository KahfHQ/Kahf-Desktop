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
var accept_invite_test_exports = {};
__export(accept_invite_test_exports, {
  debug: () => debug
});
module.exports = __toCommonJS(accept_invite_test_exports);
var import_chai = require("chai");
var import_mock_server = require("@signalapp/mock-server");
var import_debug = __toESM(require("debug"));
var durations = __toESM(require("../../util/durations"));
var import_bootstrap = require("../bootstrap");
const debug = (0, import_debug.default)("mock:test:gv2");
describe("gv2", function needsName() {
  this.timeout(durations.MINUTE);
  let bootstrap;
  let app;
  let group;
  beforeEach(async () => {
    bootstrap = new import_bootstrap.Bootstrap();
    await bootstrap.init();
    const { contacts } = bootstrap;
    const [first, second] = contacts;
    group = await first.createGroup({
      title: "Invite by PNI",
      members: [first, second]
    });
    app = await bootstrap.link();
    const { desktop } = bootstrap;
    group = await first.inviteToGroup(group, desktop, {
      uuidKind: import_mock_server.UUIDKind.PNI
    });
    import_chai.assert.strictEqual(group.state?.members?.length, 2);
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(group.getPendingMemberByUUID(desktop.pni));
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    debug("Opening group");
    await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(group.title)}]`).click();
  });
  afterEach(async function after() {
    if (this.currentTest?.state !== "passed") {
      await bootstrap.saveLogs();
    }
    await app.close();
    await bootstrap.teardown();
  });
  it("should accept PNI invite and modify the group state", async () => {
    const { phone, contacts, desktop } = bootstrap;
    const [first, second] = contacts;
    const window = await app.getWindow();
    const conversationStack = window.locator(".conversation-stack");
    debug("Accepting");
    await conversationStack.locator('.module-message-request-actions button >> "Accept"').click();
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.revision, 2);
    import_chai.assert.strictEqual(group.state?.members?.length, 3);
    (0, import_chai.assert)(group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.pni));
    debug("Checking that notifications are present");
    await window.locator(`"${first.profileName} invited you to the group."`).waitFor();
    await window.locator(`"You accepted an invitation to the group from ${first.profileName}."`).waitFor();
    debug("Invite PNI again");
    group = await second.inviteToGroup(group, desktop, {
      uuidKind: import_mock_server.UUIDKind.PNI
    });
    (0, import_chai.assert)(group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(group.getPendingMemberByUUID(desktop.pni));
    await window.locator(`"${second.profileName} invited you to the group."`).waitFor();
    debug("Verify that message request state is not visible");
    await conversationStack.locator('.module-message-request-actions button >> "Accept"').waitFor({ state: "hidden" });
    debug("Leave the group through settings");
    await conversationStack.locator("button.module-ConversationHeader__button--more").click();
    await conversationStack.locator('.react-contextmenu-item >> "Group settings"').click();
    await conversationStack.locator('.conversation-details-panel >> "Leave group"').click();
    await window.locator('.module-Modal button >> "Leave"').click();
    debug("Waiting for final group update");
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.revision, 4);
    import_chai.assert.strictEqual(group.state?.members?.length, 2);
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(group.getPendingMemberByUUID(desktop.pni));
  });
  it("should decline PNI invite and modify the group state", async () => {
    const { phone, desktop } = bootstrap;
    const window = await app.getWindow();
    const conversationStack = window.locator(".conversation-stack");
    debug("Declining");
    await conversationStack.locator('.module-message-request-actions button >> "Delete"').click();
    debug("waiting for confirmation modal");
    await window.locator('.module-Modal button >> "Delete and Leave"').click();
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.revision, 2);
    import_chai.assert.strictEqual(group.state?.members?.length, 2);
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.pni));
  });
  it("should accept ACI invite with extra PNI on the invite list", async () => {
    const { phone, contacts, desktop } = bootstrap;
    const [first, second] = contacts;
    const window = await app.getWindow();
    debug("Sending another invite");
    group = await second.inviteToGroup(group, desktop, {
      uuidKind: import_mock_server.UUIDKind.ACI
    });
    const conversationStack = window.locator(".conversation-stack");
    debug("Accepting");
    await conversationStack.locator('.module-message-request-actions button >> "Accept"').click();
    debug("Verifying notifications");
    await window.locator(`"${first.profileName} invited you to the group."`).waitFor();
    await window.locator('"You were invited to the group."').waitFor();
    await window.locator(`"You accepted an invitation to the group from ${second.profileName}."`).waitFor();
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.revision, 3);
    import_chai.assert.strictEqual(group.state?.members?.length, 3);
    (0, import_chai.assert)(group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(group.getPendingMemberByUUID(desktop.pni));
  });
  it("should decline ACI invite with extra PNI on the invite list", async () => {
    const { phone, contacts, desktop } = bootstrap;
    const [, second] = contacts;
    const window = await app.getWindow();
    debug("Sending another invite");
    group = await second.inviteToGroup(group, desktop, {
      uuidKind: import_mock_server.UUIDKind.ACI
    });
    const conversationStack = window.locator(".conversation-stack");
    debug("Declining");
    await conversationStack.locator('.module-message-request-actions button >> "Delete"').click();
    debug("waiting for confirmation modal");
    await window.locator('.module-Modal button >> "Delete and Leave"').click();
    group = await phone.waitForGroupUpdate(group);
    import_chai.assert.strictEqual(group.revision, 3);
    import_chai.assert.strictEqual(group.state?.members?.length, 2);
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(!group.getMemberByUUID(desktop.pni));
    (0, import_chai.assert)(!group.getPendingMemberByUUID(desktop.uuid));
    (0, import_chai.assert)(group.getPendingMemberByUUID(desktop.pni));
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWNjZXB0X2ludml0ZV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHR5cGUgeyBHcm91cCB9IGZyb20gJ0BzaWduYWxhcHAvbW9jay1zZXJ2ZXInO1xuaW1wb3J0IHsgVVVJREtpbmQgfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBCb290c3RyYXAgfSBmcm9tICcuLi9ib290c3RyYXAnO1xuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICcuLi9ib290c3RyYXAnO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbW9jazp0ZXN0Omd2MicpO1xuXG5kZXNjcmliZSgnZ3YyJywgZnVuY3Rpb24gbmVlZHNOYW1lKCkge1xuICB0aGlzLnRpbWVvdXQoZHVyYXRpb25zLk1JTlVURSk7XG5cbiAgbGV0IGJvb3RzdHJhcDogQm9vdHN0cmFwO1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBncm91cDogR3JvdXA7XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYm9vdHN0cmFwID0gbmV3IEJvb3RzdHJhcCgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC5pbml0KCk7XG5cbiAgICBjb25zdCB7IGNvbnRhY3RzIH0gPSBib290c3RyYXA7XG5cbiAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBjb250YWN0cztcblxuICAgIGdyb3VwID0gYXdhaXQgZmlyc3QuY3JlYXRlR3JvdXAoe1xuICAgICAgdGl0bGU6ICdJbnZpdGUgYnkgUE5JJyxcbiAgICAgIG1lbWJlcnM6IFtmaXJzdCwgc2Vjb25kXSxcbiAgICB9KTtcblxuICAgIGFwcCA9IGF3YWl0IGJvb3RzdHJhcC5saW5rKCk7XG5cbiAgICBjb25zdCB7IGRlc2t0b3AgfSA9IGJvb3RzdHJhcDtcblxuICAgIGdyb3VwID0gYXdhaXQgZmlyc3QuaW52aXRlVG9Hcm91cChncm91cCwgZGVza3RvcCwge1xuICAgICAgdXVpZEtpbmQ6IFVVSURLaW5kLlBOSSxcbiAgICB9KTtcblxuICAgIC8vIFZlcmlmeSB0aGF0IGNyZWF0ZWQgZ3JvdXAgaGFzIHBlbmRpbmcgbWVtYmVyXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnN0YXRlPy5tZW1iZXJzPy5sZW5ndGgsIDIpO1xuICAgIGFzc2VydCghZ3JvdXAuZ2V0TWVtYmVyQnlVVUlEKGRlc2t0b3AudXVpZCkpO1xuICAgIGFzc2VydCghZ3JvdXAuZ2V0TWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AudXVpZCkpO1xuICAgIGFzc2VydChncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBjb25zdCBsZWZ0UGFuZSA9IHdpbmRvdy5sb2NhdG9yKCcubGVmdC1wYW5lLXdyYXBwZXInKTtcblxuICAgIGRlYnVnKCdPcGVuaW5nIGdyb3VwJyk7XG4gICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgIC5sb2NhdG9yKFxuICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgYFt0aXRsZSA9ICR7SlNPTi5zdHJpbmdpZnkoZ3JvdXAudGl0bGUpfV1gXG4gICAgICApXG4gICAgICAuY2xpY2soKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUZXN0Py5zdGF0ZSAhPT0gJ3Bhc3NlZCcpIHtcbiAgICAgIGF3YWl0IGJvb3RzdHJhcC5zYXZlTG9ncygpO1xuICAgIH1cblxuICAgIGF3YWl0IGFwcC5jbG9zZSgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC50ZWFyZG93bigpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFjY2VwdCBQTkkgaW52aXRlIGFuZCBtb2RpZnkgdGhlIGdyb3VwIHN0YXRlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUsIGNvbnRhY3RzLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG4gICAgY29uc3QgW2ZpcnN0LCBzZWNvbmRdID0gY29udGFjdHM7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25TdGFjayA9IHdpbmRvdy5sb2NhdG9yKCcuY29udmVyc2F0aW9uLXN0YWNrJyk7XG5cbiAgICBkZWJ1ZygnQWNjZXB0aW5nJyk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLW1lc3NhZ2UtcmVxdWVzdC1hY3Rpb25zIGJ1dHRvbiA+PiBcIkFjY2VwdFwiJylcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZ3JvdXAgPSBhd2FpdCBwaG9uZS53YWl0Rm9yR3JvdXBVcGRhdGUoZ3JvdXApO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC5yZXZpc2lvbiwgMik7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnN0YXRlPy5tZW1iZXJzPy5sZW5ndGgsIDMpO1xuICAgIGFzc2VydChncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC5wbmkpKTtcbiAgICBhc3NlcnQoIWdyb3VwLmdldFBlbmRpbmdNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG5cbiAgICBkZWJ1ZygnQ2hlY2tpbmcgdGhhdCBub3RpZmljYXRpb25zIGFyZSBwcmVzZW50Jyk7XG4gICAgYXdhaXQgd2luZG93XG4gICAgICAubG9jYXRvcihgXCIke2ZpcnN0LnByb2ZpbGVOYW1lfSBpbnZpdGVkIHlvdSB0byB0aGUgZ3JvdXAuXCJgKVxuICAgICAgLndhaXRGb3IoKTtcbiAgICBhd2FpdCB3aW5kb3dcbiAgICAgIC5sb2NhdG9yKFxuICAgICAgICBgXCJZb3UgYWNjZXB0ZWQgYW4gaW52aXRhdGlvbiB0byB0aGUgZ3JvdXAgZnJvbSAke2ZpcnN0LnByb2ZpbGVOYW1lfS5cImBcbiAgICAgIClcbiAgICAgIC53YWl0Rm9yKCk7XG5cbiAgICBkZWJ1ZygnSW52aXRlIFBOSSBhZ2FpbicpO1xuICAgIGdyb3VwID0gYXdhaXQgc2Vjb25kLmludml0ZVRvR3JvdXAoZ3JvdXAsIGRlc2t0b3AsIHtcbiAgICAgIHV1aWRLaW5kOiBVVUlES2luZC5QTkksXG4gICAgfSk7XG4gICAgYXNzZXJ0KGdyb3VwLmdldE1lbWJlckJ5VVVJRChkZXNrdG9wLnV1aWQpKTtcbiAgICBhc3NlcnQoZ3JvdXAuZ2V0UGVuZGluZ01lbWJlckJ5VVVJRChkZXNrdG9wLnBuaSkpO1xuXG4gICAgYXdhaXQgd2luZG93XG4gICAgICAubG9jYXRvcihgXCIke3NlY29uZC5wcm9maWxlTmFtZX0gaW52aXRlZCB5b3UgdG8gdGhlIGdyb3VwLlwiYClcbiAgICAgIC53YWl0Rm9yKCk7XG5cbiAgICBkZWJ1ZygnVmVyaWZ5IHRoYXQgbWVzc2FnZSByZXF1ZXN0IHN0YXRlIGlzIG5vdCB2aXNpYmxlJyk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLW1lc3NhZ2UtcmVxdWVzdC1hY3Rpb25zIGJ1dHRvbiA+PiBcIkFjY2VwdFwiJylcbiAgICAgIC53YWl0Rm9yKHsgc3RhdGU6ICdoaWRkZW4nIH0pO1xuXG4gICAgZGVidWcoJ0xlYXZlIHRoZSBncm91cCB0aHJvdWdoIHNldHRpbmdzJyk7XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb25TdGFja1xuICAgICAgLmxvY2F0b3IoJ2J1dHRvbi5tb2R1bGUtQ29udmVyc2F0aW9uSGVhZGVyX19idXR0b24tLW1vcmUnKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb25TdGFja1xuICAgICAgLmxvY2F0b3IoJy5yZWFjdC1jb250ZXh0bWVudS1pdGVtID4+IFwiR3JvdXAgc2V0dGluZ3NcIicpXG4gICAgICAuY2xpY2soKTtcblxuICAgIGF3YWl0IGNvbnZlcnNhdGlvblN0YWNrXG4gICAgICAubG9jYXRvcignLmNvbnZlcnNhdGlvbi1kZXRhaWxzLXBhbmVsID4+IFwiTGVhdmUgZ3JvdXBcIicpXG4gICAgICAuY2xpY2soKTtcblxuICAgIGF3YWl0IHdpbmRvdy5sb2NhdG9yKCcubW9kdWxlLU1vZGFsIGJ1dHRvbiA+PiBcIkxlYXZlXCInKS5jbGljaygpO1xuXG4gICAgZGVidWcoJ1dhaXRpbmcgZm9yIGZpbmFsIGdyb3VwIHVwZGF0ZScpO1xuICAgIGdyb3VwID0gYXdhaXQgcGhvbmUud2FpdEZvckdyb3VwVXBkYXRlKGdyb3VwKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZ3JvdXAucmV2aXNpb24sIDQpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC5zdGF0ZT8ubWVtYmVycz8ubGVuZ3RoLCAyKTtcbiAgICBhc3NlcnQoIWdyb3VwLmdldE1lbWJlckJ5VVVJRChkZXNrdG9wLnV1aWQpKTtcbiAgICBhc3NlcnQoIWdyb3VwLmdldE1lbWJlckJ5VVVJRChkZXNrdG9wLnBuaSkpO1xuICAgIGFzc2VydCghZ3JvdXAuZ2V0UGVuZGluZ01lbWJlckJ5VVVJRChkZXNrdG9wLnV1aWQpKTtcbiAgICBhc3NlcnQoZ3JvdXAuZ2V0UGVuZGluZ01lbWJlckJ5VVVJRChkZXNrdG9wLnBuaSkpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGRlY2xpbmUgUE5JIGludml0ZSBhbmQgbW9kaWZ5IHRoZSBncm91cCBzdGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBob25lLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25TdGFjayA9IHdpbmRvdy5sb2NhdG9yKCcuY29udmVyc2F0aW9uLXN0YWNrJyk7XG5cbiAgICBkZWJ1ZygnRGVjbGluaW5nJyk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLW1lc3NhZ2UtcmVxdWVzdC1hY3Rpb25zIGJ1dHRvbiA+PiBcIkRlbGV0ZVwiJylcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZGVidWcoJ3dhaXRpbmcgZm9yIGNvbmZpcm1hdGlvbiBtb2RhbCcpO1xuICAgIGF3YWl0IHdpbmRvdy5sb2NhdG9yKCcubW9kdWxlLU1vZGFsIGJ1dHRvbiA+PiBcIkRlbGV0ZSBhbmQgTGVhdmVcIicpLmNsaWNrKCk7XG5cbiAgICBncm91cCA9IGF3YWl0IHBob25lLndhaXRGb3JHcm91cFVwZGF0ZShncm91cCk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnJldmlzaW9uLCAyKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZ3JvdXAuc3RhdGU/Lm1lbWJlcnM/Lmxlbmd0aCwgMik7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC5wbmkpKTtcbiAgICBhc3NlcnQoIWdyb3VwLmdldFBlbmRpbmdNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWNjZXB0IEFDSSBpbnZpdGUgd2l0aCBleHRyYSBQTkkgb24gdGhlIGludml0ZSBsaXN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUsIGNvbnRhY3RzLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG4gICAgY29uc3QgW2ZpcnN0LCBzZWNvbmRdID0gY29udGFjdHM7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBkZWJ1ZygnU2VuZGluZyBhbm90aGVyIGludml0ZScpO1xuXG4gICAgLy8gSW52aXRlIEFDSSBmcm9tIGFub3RoZXIgY29udGFjdFxuICAgIGdyb3VwID0gYXdhaXQgc2Vjb25kLmludml0ZVRvR3JvdXAoZ3JvdXAsIGRlc2t0b3AsIHtcbiAgICAgIHV1aWRLaW5kOiBVVUlES2luZC5BQ0ksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25TdGFjayA9IHdpbmRvdy5sb2NhdG9yKCcuY29udmVyc2F0aW9uLXN0YWNrJyk7XG5cbiAgICBkZWJ1ZygnQWNjZXB0aW5nJyk7XG4gICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgIC5sb2NhdG9yKCcubW9kdWxlLW1lc3NhZ2UtcmVxdWVzdC1hY3Rpb25zIGJ1dHRvbiA+PiBcIkFjY2VwdFwiJylcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZGVidWcoJ1ZlcmlmeWluZyBub3RpZmljYXRpb25zJyk7XG4gICAgYXdhaXQgd2luZG93XG4gICAgICAubG9jYXRvcihgXCIke2ZpcnN0LnByb2ZpbGVOYW1lfSBpbnZpdGVkIHlvdSB0byB0aGUgZ3JvdXAuXCJgKVxuICAgICAgLndhaXRGb3IoKTtcbiAgICBhd2FpdCB3aW5kb3cubG9jYXRvcignXCJZb3Ugd2VyZSBpbnZpdGVkIHRvIHRoZSBncm91cC5cIicpLndhaXRGb3IoKTtcbiAgICBhd2FpdCB3aW5kb3dcbiAgICAgIC5sb2NhdG9yKFxuICAgICAgICBgXCJZb3UgYWNjZXB0ZWQgYW4gaW52aXRhdGlvbiB0byB0aGUgZ3JvdXAgZnJvbSAke3NlY29uZC5wcm9maWxlTmFtZX0uXCJgXG4gICAgICApXG4gICAgICAud2FpdEZvcigpO1xuXG4gICAgZ3JvdXAgPSBhd2FpdCBwaG9uZS53YWl0Rm9yR3JvdXBVcGRhdGUoZ3JvdXApO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC5yZXZpc2lvbiwgMyk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnN0YXRlPy5tZW1iZXJzPy5sZW5ndGgsIDMpO1xuICAgIGFzc2VydChncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRNZW1iZXJCeVVVSUQoZGVza3RvcC5wbmkpKTtcbiAgICBhc3NlcnQoIWdyb3VwLmdldFBlbmRpbmdNZW1iZXJCeVVVSUQoZGVza3RvcC51dWlkKSk7XG4gICAgYXNzZXJ0KGdyb3VwLmdldFBlbmRpbmdNZW1iZXJCeVVVSUQoZGVza3RvcC5wbmkpKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBkZWNsaW5lIEFDSSBpbnZpdGUgd2l0aCBleHRyYSBQTkkgb24gdGhlIGludml0ZSBsaXN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGhvbmUsIGNvbnRhY3RzLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG4gICAgY29uc3QgWywgc2Vjb25kXSA9IGNvbnRhY3RzO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgZGVidWcoJ1NlbmRpbmcgYW5vdGhlciBpbnZpdGUnKTtcblxuICAgIC8vIEludml0ZSBBQ0kgZnJvbSBhbm90aGVyIGNvbnRhY3RcbiAgICBncm91cCA9IGF3YWl0IHNlY29uZC5pbnZpdGVUb0dyb3VwKGdyb3VwLCBkZXNrdG9wLCB7XG4gICAgICB1dWlkS2luZDogVVVJREtpbmQuQUNJLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udmVyc2F0aW9uU3RhY2sgPSB3aW5kb3cubG9jYXRvcignLmNvbnZlcnNhdGlvbi1zdGFjaycpO1xuXG4gICAgZGVidWcoJ0RlY2xpbmluZycpO1xuICAgIGF3YWl0IGNvbnZlcnNhdGlvblN0YWNrXG4gICAgICAubG9jYXRvcignLm1vZHVsZS1tZXNzYWdlLXJlcXVlc3QtYWN0aW9ucyBidXR0b24gPj4gXCJEZWxldGVcIicpXG4gICAgICAuY2xpY2soKTtcblxuICAgIGRlYnVnKCd3YWl0aW5nIGZvciBjb25maXJtYXRpb24gbW9kYWwnKTtcbiAgICBhd2FpdCB3aW5kb3cubG9jYXRvcignLm1vZHVsZS1Nb2RhbCBidXR0b24gPj4gXCJEZWxldGUgYW5kIExlYXZlXCInKS5jbGljaygpO1xuXG4gICAgZ3JvdXAgPSBhd2FpdCBwaG9uZS53YWl0Rm9yR3JvdXBVcGRhdGUoZ3JvdXApO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChncm91cC5yZXZpc2lvbiwgMyk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGdyb3VwLnN0YXRlPy5tZW1iZXJzPy5sZW5ndGgsIDIpO1xuICAgIGFzc2VydCghZ3JvdXAuZ2V0TWVtYmVyQnlVVUlEKGRlc2t0b3AudXVpZCkpO1xuICAgIGFzc2VydCghZ3JvdXAuZ2V0TWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG4gICAgYXNzZXJ0KCFncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AudXVpZCkpO1xuICAgIGFzc2VydChncm91cC5nZXRQZW5kaW5nTWVtYmVyQnlVVUlEKGRlc2t0b3AucG5pKSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esa0JBQXVCO0FBRXZCLHlCQUF5QjtBQUN6QixtQkFBd0I7QUFFeEIsZ0JBQTJCO0FBQzNCLHVCQUEwQjtBQUduQixNQUFNLFFBQVEsMEJBQVksZUFBZTtBQUVoRCxTQUFTLE9BQU8scUJBQXFCO0FBQ25DLE9BQUssUUFBUSxV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
