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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sticker_test_exports = {};
module.exports = __toCommonJS(sticker_test_exports);
var import_chai = require("chai");
var import_lodash = require("lodash");
var import_mock_server = require("@signalapp/mock-server");
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var durations = __toESM(require("../../util/durations"));
var import_fixtures = require("./fixtures");
const { StickerPackOperation } = import_mock_server.Proto.SyncMessage;
const FIXTURES = import_path.default.join(__dirname, "..", "..", "..", "fixtures");
const IdentifierType = import_mock_server.Proto.ManifestRecord.Identifier.Type;
const EMPTY = new Uint8Array(0);
const STICKER_PACKS = [
  {
    id: Buffer.from("c40ed069cdc2b91eccfccf25e6bcddfc", "hex"),
    key: Buffer.from("cefadd6e81c128680aead1711eb5c92c10f63bdfbc78528a4519ba682de396e4", "hex"),
    stickerCount: 1
  },
  {
    id: Buffer.from("ae8fedafda4768fd3384d4b3b9db963d", "hex"),
    key: Buffer.from("53f4aa8b95e1c2e75afab2328fe67eb6d7affbcd4f50cd4da89dfc325dbc73ca", "hex"),
    stickerCount: 1
  }
];
function getStickerPackLink(pack) {
  return `https://signal.art/addstickers/#pack_id=${pack.id.toString("hex")}&pack_key=${pack.key.toString("hex")}`;
}
function getStickerPackRecordPredicate(pack) {
  return ({ type, record }) => {
    if (type !== IdentifierType.STICKER_PACK) {
      return false;
    }
    return pack.id.equals(record.stickerPack?.packId ?? EMPTY);
  };
}
describe("storage service", function needsName() {
  this.timeout(durations.MINUTE);
  let bootstrap;
  let app;
  beforeEach(async () => {
    ({ bootstrap, app } = await (0, import_fixtures.initStorage)());
    const { server } = bootstrap;
    await Promise.all(STICKER_PACKS.map(async ({ id, stickerCount }) => {
      const hexId = id.toString("hex");
      await server.storeStickerPack({
        id,
        manifest: await import_promises.default.readFile(import_path.default.join(FIXTURES, `stickerpack-${hexId}.bin`)),
        stickers: await Promise.all((0, import_lodash.range)(0, stickerCount).map(async (index) => import_promises.default.readFile(import_path.default.join(FIXTURES, `stickerpack-${hexId}-${index}.bin`))))
      });
    }));
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
  it("should install/uninstall stickers", async () => {
    const { phone, desktop, contacts } = bootstrap;
    const [firstContact] = contacts;
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    const conversationStack = window.locator(".conversation-stack");
    (0, import_fixtures.debug)("sending two sticker pack links");
    await firstContact.sendText(desktop, `First sticker pack ${getStickerPackLink(STICKER_PACKS[0])}`);
    await firstContact.sendText(desktop, `Second sticker pack ${getStickerPackLink(STICKER_PACKS[1])}`);
    await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(firstContact.profileName)}]`).click();
    {
      (0, import_fixtures.debug)("installing first sticker pack via UI");
      const state = await phone.expectStorageState("initial state");
      await conversationStack.locator(`a:has-text("${STICKER_PACKS[0].id.toString("hex")}")`).click({ noWaitAfter: true });
      await window.locator('.module-sticker-manager__preview-modal__container button >> "Install"').click();
      (0, import_fixtures.debug)("waiting for sync message");
      const { syncMessage } = await phone.waitForSyncMessage((entry) => Boolean(entry.syncMessage.stickerPackOperation?.length));
      const [syncOp] = syncMessage.stickerPackOperation ?? [];
      import_chai.assert.isTrue(STICKER_PACKS[0].id.equals(syncOp?.packId ?? EMPTY));
      import_chai.assert.isTrue(STICKER_PACKS[0].key.equals(syncOp?.packKey ?? EMPTY));
      import_chai.assert.strictEqual(syncOp?.type, StickerPackOperation.Type.INSTALL);
      (0, import_fixtures.debug)("waiting for storage service update");
      const stateAfter = await phone.waitForStorageState({ after: state });
      const stickerPack = stateAfter.findRecord(getStickerPackRecordPredicate(STICKER_PACKS[0]));
      import_chai.assert.ok(stickerPack, "New storage state should have sticker pack record");
      import_chai.assert.isTrue(STICKER_PACKS[0].key.equals(stickerPack?.record.stickerPack?.packKey ?? EMPTY), "Wrong sticker pack key");
      import_chai.assert.strictEqual(stickerPack?.record.stickerPack?.position, 6, "Wrong sticker pack position");
    }
    {
      (0, import_fixtures.debug)("uninstalling first sticker pack via UI");
      const state = await phone.expectStorageState("initial state");
      await conversationStack.locator(`a:has-text("${STICKER_PACKS[0].id.toString("hex")}")`).click({ noWaitAfter: true });
      await window.locator('.module-sticker-manager__preview-modal__container button >> "Uninstall"').click();
      await window.locator('.module-Modal button >> "Uninstall"').click();
      (0, import_fixtures.debug)("waiting for sync message");
      const { syncMessage } = await phone.waitForSyncMessage((entry) => Boolean(entry.syncMessage.stickerPackOperation?.length));
      const [syncOp] = syncMessage.stickerPackOperation ?? [];
      import_chai.assert.isTrue(STICKER_PACKS[0].id.equals(syncOp?.packId ?? EMPTY));
      import_chai.assert.strictEqual(syncOp?.type, StickerPackOperation.Type.REMOVE);
      (0, import_fixtures.debug)("waiting for storage service update");
      const stateAfter = await phone.waitForStorageState({ after: state });
      const stickerPack = stateAfter.findRecord(getStickerPackRecordPredicate(STICKER_PACKS[0]));
      import_chai.assert.ok(stickerPack, "New storage state should have sticker pack record");
      import_chai.assert.deepStrictEqual(stickerPack?.record.stickerPack?.packKey, EMPTY, "Sticker pack key should be removed");
      const deletedAt = stickerPack?.record.stickerPack?.deletedAtTimestamp?.toNumber() ?? 0;
      import_chai.assert.isAbove(deletedAt, Date.now() - durations.HOUR, "Sticker pack should have deleted at timestamp");
    }
    (0, import_fixtures.debug)("opening sticker picker");
    conversationStack.locator(".CompositionArea .module-sticker-button__button").click();
    const stickerPicker = conversationStack.locator(".module-sticker-picker");
    {
      (0, import_fixtures.debug)("installing first sticker pack via storage service");
      const state = await phone.expectStorageState("initial state");
      await phone.setStorageState(state.updateRecord(getStickerPackRecordPredicate(STICKER_PACKS[0]), (record) => ({
        ...record,
        stickerPack: {
          ...record?.stickerPack,
          packKey: STICKER_PACKS[0].key,
          position: 7,
          deletedAtTimestamp: void 0
        }
      })));
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      (0, import_fixtures.debug)("waiting for sticker pack to become visible");
      stickerPicker.locator(`button.module-sticker-picker__header__button[key="${STICKER_PACKS[0].id.toString("hex")}"]`).waitFor();
    }
    {
      (0, import_fixtures.debug)("installing second sticker pack via sync message");
      const state = await phone.expectStorageState("initial state");
      await phone.sendStickerPackSync({
        type: "install",
        packId: STICKER_PACKS[1].id,
        packKey: STICKER_PACKS[1].key,
        timestamp: bootstrap.getTimestamp()
      });
      (0, import_fixtures.debug)("waiting for sticker pack to become visible");
      stickerPicker.locator(`button.module-sticker-picker__header__button[key="${STICKER_PACKS[1].id.toString("hex")}"]`).waitFor();
      (0, import_fixtures.debug)("waiting for storage service update");
      const stateAfter = await phone.waitForStorageState({ after: state });
      const stickerPack = stateAfter.findRecord(getStickerPackRecordPredicate(STICKER_PACKS[1]));
      import_chai.assert.ok(stickerPack, "New storage state should have sticker pack record");
      import_chai.assert.isTrue(STICKER_PACKS[1].key.equals(stickerPack?.record.stickerPack?.packKey ?? EMPTY), "Wrong sticker pack key");
      import_chai.assert.strictEqual(stickerPack?.record.stickerPack?.position, 6, "Wrong sticker pack position");
    }
    (0, import_fixtures.debug)("Verifying the final manifest version");
    const finalState = await phone.expectStorageState("consistency check");
    import_chai.assert.strictEqual(finalState.version, 5);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RpY2tlcl90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHsgcmFuZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUHJvdG8gfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZVN0YXRlUmVjb3JkIH0gZnJvbSAnQHNpZ25hbGFwcC9tb2NrLXNlcnZlcic7XG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IEFwcCwgQm9vdHN0cmFwIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5pbXBvcnQgeyBpbml0U3RvcmFnZSwgZGVidWcgfSBmcm9tICcuL2ZpeHR1cmVzJztcblxuY29uc3QgeyBTdGlja2VyUGFja09wZXJhdGlvbiB9ID0gUHJvdG8uU3luY01lc3NhZ2U7XG5cbmNvbnN0IEZJWFRVUkVTID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ2ZpeHR1cmVzJyk7XG5jb25zdCBJZGVudGlmaWVyVHlwZSA9IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIuVHlwZTtcblxuY29uc3QgRU1QVFkgPSBuZXcgVWludDhBcnJheSgwKTtcblxuZXhwb3J0IHR5cGUgU3RpY2tlclBhY2tUeXBlID0gUmVhZG9ubHk8e1xuICBpZDogQnVmZmVyO1xuICBrZXk6IEJ1ZmZlcjtcbiAgc3RpY2tlckNvdW50OiBudW1iZXI7XG59PjtcblxuY29uc3QgU1RJQ0tFUl9QQUNLUzogUmVhZG9ubHlBcnJheTxTdGlja2VyUGFja1R5cGU+ID0gW1xuICB7XG4gICAgaWQ6IEJ1ZmZlci5mcm9tKCdjNDBlZDA2OWNkYzJiOTFlY2NmY2NmMjVlNmJjZGRmYycsICdoZXgnKSxcbiAgICBrZXk6IEJ1ZmZlci5mcm9tKFxuICAgICAgJ2NlZmFkZDZlODFjMTI4NjgwYWVhZDE3MTFlYjVjOTJjMTBmNjNiZGZiYzc4NTI4YTQ1MTliYTY4MmRlMzk2ZTQnLFxuICAgICAgJ2hleCdcbiAgICApLFxuICAgIHN0aWNrZXJDb3VudDogMSxcbiAgfSxcbiAge1xuICAgIGlkOiBCdWZmZXIuZnJvbSgnYWU4ZmVkYWZkYTQ3NjhmZDMzODRkNGIzYjlkYjk2M2QnLCAnaGV4JyksXG4gICAga2V5OiBCdWZmZXIuZnJvbShcbiAgICAgICc1M2Y0YWE4Yjk1ZTFjMmU3NWFmYWIyMzI4ZmU2N2ViNmQ3YWZmYmNkNGY1MGNkNGRhODlkZmMzMjVkYmM3M2NhJyxcbiAgICAgICdoZXgnXG4gICAgKSxcbiAgICBzdGlja2VyQ291bnQ6IDEsXG4gIH0sXG5dO1xuXG5mdW5jdGlvbiBnZXRTdGlja2VyUGFja0xpbmsocGFjazogU3RpY2tlclBhY2tUeXBlKTogc3RyaW5nIHtcbiAgcmV0dXJuIChcbiAgICBgaHR0cHM6Ly9zaWduYWwuYXJ0L2FkZHN0aWNrZXJzLyNwYWNrX2lkPSR7cGFjay5pZC50b1N0cmluZygnaGV4Jyl9JmAgK1xuICAgIGBwYWNrX2tleT0ke3BhY2sua2V5LnRvU3RyaW5nKCdoZXgnKX1gXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFN0aWNrZXJQYWNrUmVjb3JkUHJlZGljYXRlKFxuICBwYWNrOiBTdGlja2VyUGFja1R5cGVcbik6IChyZWNvcmQ6IFN0b3JhZ2VTdGF0ZVJlY29yZCkgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAoeyB0eXBlLCByZWNvcmQgfTogU3RvcmFnZVN0YXRlUmVjb3JkKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGUgIT09IElkZW50aWZpZXJUeXBlLlNUSUNLRVJfUEFDSykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGFjay5pZC5lcXVhbHMocmVjb3JkLnN0aWNrZXJQYWNrPy5wYWNrSWQgPz8gRU1QVFkpO1xuICB9O1xufVxuXG5kZXNjcmliZSgnc3RvcmFnZSBzZXJ2aWNlJywgZnVuY3Rpb24gbmVlZHNOYW1lKCkge1xuICB0aGlzLnRpbWVvdXQoZHVyYXRpb25zLk1JTlVURSk7XG5cbiAgbGV0IGJvb3RzdHJhcDogQm9vdHN0cmFwO1xuICBsZXQgYXBwOiBBcHA7XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgKHsgYm9vdHN0cmFwLCBhcHAgfSA9IGF3YWl0IGluaXRTdG9yYWdlKCkpO1xuXG4gICAgY29uc3QgeyBzZXJ2ZXIgfSA9IGJvb3RzdHJhcDtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgU1RJQ0tFUl9QQUNLUy5tYXAoYXN5bmMgKHsgaWQsIHN0aWNrZXJDb3VudCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGhleElkID0gaWQudG9TdHJpbmcoJ2hleCcpO1xuXG4gICAgICAgIGF3YWl0IHNlcnZlci5zdG9yZVN0aWNrZXJQYWNrKHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBtYW5pZmVzdDogYXdhaXQgZnMucmVhZEZpbGUoXG4gICAgICAgICAgICBwYXRoLmpvaW4oRklYVFVSRVMsIGBzdGlja2VycGFjay0ke2hleElkfS5iaW5gKVxuICAgICAgICAgICksXG4gICAgICAgICAgc3RpY2tlcnM6IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgcmFuZ2UoMCwgc3RpY2tlckNvdW50KS5tYXAoYXN5bmMgaW5kZXggPT5cbiAgICAgICAgICAgICAgZnMucmVhZEZpbGUoXG4gICAgICAgICAgICAgICAgcGF0aC5qb2luKEZJWFRVUkVTLCBgc3RpY2tlcnBhY2stJHtoZXhJZH0tJHtpbmRleH0uYmluYClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApO1xuICB9KTtcblxuICBhZnRlckVhY2goYXN5bmMgZnVuY3Rpb24gYWZ0ZXIoKSB7XG4gICAgaWYgKCFib290c3RyYXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50VGVzdD8uc3RhdGUgIT09ICdwYXNzZWQnKSB7XG4gICAgICBhd2FpdCBib290c3RyYXAuc2F2ZUxvZ3MoKTtcbiAgICB9XG5cbiAgICBhd2FpdCBhcHAuY2xvc2UoKTtcbiAgICBhd2FpdCBib290c3RyYXAudGVhcmRvd24oKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBpbnN0YWxsL3VuaW5zdGFsbCBzdGlja2VycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBob25lLCBkZXNrdG9wLCBjb250YWN0cyB9ID0gYm9vdHN0cmFwO1xuICAgIGNvbnN0IFtmaXJzdENvbnRhY3RdID0gY29udGFjdHM7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBjb25zdCBsZWZ0UGFuZSA9IHdpbmRvdy5sb2NhdG9yKCcubGVmdC1wYW5lLXdyYXBwZXInKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb25TdGFjayA9IHdpbmRvdy5sb2NhdG9yKCcuY29udmVyc2F0aW9uLXN0YWNrJyk7XG5cbiAgICBkZWJ1Zygnc2VuZGluZyB0d28gc3RpY2tlciBwYWNrIGxpbmtzJyk7XG4gICAgYXdhaXQgZmlyc3RDb250YWN0LnNlbmRUZXh0KFxuICAgICAgZGVza3RvcCxcbiAgICAgIGBGaXJzdCBzdGlja2VyIHBhY2sgJHtnZXRTdGlja2VyUGFja0xpbmsoU1RJQ0tFUl9QQUNLU1swXSl9YFxuICAgICk7XG4gICAgYXdhaXQgZmlyc3RDb250YWN0LnNlbmRUZXh0KFxuICAgICAgZGVza3RvcCxcbiAgICAgIGBTZWNvbmQgc3RpY2tlciBwYWNrICR7Z2V0U3RpY2tlclBhY2tMaW5rKFNUSUNLRVJfUEFDS1NbMV0pfWBcbiAgICApO1xuXG4gICAgYXdhaXQgbGVmdFBhbmVcbiAgICAgIC5sb2NhdG9yKFxuICAgICAgICAnX3JlYWN0PUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgYFt0aXRsZSA9ICR7SlNPTi5zdHJpbmdpZnkoZmlyc3RDb250YWN0LnByb2ZpbGVOYW1lKX1dYFxuICAgICAgKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICB7XG4gICAgICBkZWJ1ZygnaW5zdGFsbGluZyBmaXJzdCBzdGlja2VyIHBhY2sgdmlhIFVJJyk7XG4gICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnaW5pdGlhbCBzdGF0ZScpO1xuXG4gICAgICBhd2FpdCBjb252ZXJzYXRpb25TdGFja1xuICAgICAgICAubG9jYXRvcihgYTpoYXMtdGV4dChcIiR7U1RJQ0tFUl9QQUNLU1swXS5pZC50b1N0cmluZygnaGV4Jyl9XCIpYClcbiAgICAgICAgLmNsaWNrKHsgbm9XYWl0QWZ0ZXI6IHRydWUgfSk7XG4gICAgICBhd2FpdCB3aW5kb3dcbiAgICAgICAgLmxvY2F0b3IoXG4gICAgICAgICAgJy5tb2R1bGUtc3RpY2tlci1tYW5hZ2VyX19wcmV2aWV3LW1vZGFsX19jb250YWluZXIgYnV0dG9uID4+IFwiSW5zdGFsbFwiJ1xuICAgICAgICApXG4gICAgICAgIC5jbGljaygpO1xuXG4gICAgICBkZWJ1Zygnd2FpdGluZyBmb3Igc3luYyBtZXNzYWdlJyk7XG4gICAgICBjb25zdCB7IHN5bmNNZXNzYWdlIH0gPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3luY01lc3NhZ2UoZW50cnkgPT5cbiAgICAgICAgQm9vbGVhbihlbnRyeS5zeW5jTWVzc2FnZS5zdGlja2VyUGFja09wZXJhdGlvbj8ubGVuZ3RoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IFtzeW5jT3BdID0gc3luY01lc3NhZ2Uuc3RpY2tlclBhY2tPcGVyYXRpb24gPz8gW107XG4gICAgICBhc3NlcnQuaXNUcnVlKFNUSUNLRVJfUEFDS1NbMF0uaWQuZXF1YWxzKHN5bmNPcD8ucGFja0lkID8/IEVNUFRZKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKFNUSUNLRVJfUEFDS1NbMF0ua2V5LmVxdWFscyhzeW5jT3A/LnBhY2tLZXkgPz8gRU1QVFkpKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzeW5jT3A/LnR5cGUsIFN0aWNrZXJQYWNrT3BlcmF0aW9uLlR5cGUuSU5TVEFMTCk7XG5cbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBzdG9yYWdlIHNlcnZpY2UgdXBkYXRlJyk7XG4gICAgICBjb25zdCBzdGF0ZUFmdGVyID0gYXdhaXQgcGhvbmUud2FpdEZvclN0b3JhZ2VTdGF0ZSh7IGFmdGVyOiBzdGF0ZSB9KTtcbiAgICAgIGNvbnN0IHN0aWNrZXJQYWNrID0gc3RhdGVBZnRlci5maW5kUmVjb3JkKFxuICAgICAgICBnZXRTdGlja2VyUGFja1JlY29yZFByZWRpY2F0ZShTVElDS0VSX1BBQ0tTWzBdKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5vayhcbiAgICAgICAgc3RpY2tlclBhY2ssXG4gICAgICAgICdOZXcgc3RvcmFnZSBzdGF0ZSBzaG91bGQgaGF2ZSBzdGlja2VyIHBhY2sgcmVjb3JkJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIFNUSUNLRVJfUEFDS1NbMF0ua2V5LmVxdWFscyhcbiAgICAgICAgICBzdGlja2VyUGFjaz8ucmVjb3JkLnN0aWNrZXJQYWNrPy5wYWNrS2V5ID8/IEVNUFRZXG4gICAgICAgICksXG4gICAgICAgICdXcm9uZyBzdGlja2VyIHBhY2sga2V5J1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgc3RpY2tlclBhY2s/LnJlY29yZC5zdGlja2VyUGFjaz8ucG9zaXRpb24sXG4gICAgICAgIDYsXG4gICAgICAgICdXcm9uZyBzdGlja2VyIHBhY2sgcG9zaXRpb24nXG4gICAgICApO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGRlYnVnKCd1bmluc3RhbGxpbmcgZmlyc3Qgc3RpY2tlciBwYWNrIHZpYSBVSScpO1xuICAgICAgY29uc3Qgc3RhdGUgPSBhd2FpdCBwaG9uZS5leHBlY3RTdG9yYWdlU3RhdGUoJ2luaXRpYWwgc3RhdGUnKTtcblxuICAgICAgYXdhaXQgY29udmVyc2F0aW9uU3RhY2tcbiAgICAgICAgLmxvY2F0b3IoYGE6aGFzLXRleHQoXCIke1NUSUNLRVJfUEFDS1NbMF0uaWQudG9TdHJpbmcoJ2hleCcpfVwiKWApXG4gICAgICAgIC5jbGljayh7IG5vV2FpdEFmdGVyOiB0cnVlIH0pO1xuICAgICAgYXdhaXQgd2luZG93XG4gICAgICAgIC5sb2NhdG9yKFxuICAgICAgICAgICcubW9kdWxlLXN0aWNrZXItbWFuYWdlcl9fcHJldmlldy1tb2RhbF9fY29udGFpbmVyIGJ1dHRvbiAnICtcbiAgICAgICAgICAgICc+PiBcIlVuaW5zdGFsbFwiJ1xuICAgICAgICApXG4gICAgICAgIC5jbGljaygpO1xuXG4gICAgICAvLyBDb25maXJtXG4gICAgICBhd2FpdCB3aW5kb3cubG9jYXRvcignLm1vZHVsZS1Nb2RhbCBidXR0b24gPj4gXCJVbmluc3RhbGxcIicpLmNsaWNrKCk7XG5cbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBzeW5jIG1lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHsgc3luY01lc3NhZ2UgfSA9IGF3YWl0IHBob25lLndhaXRGb3JTeW5jTWVzc2FnZShlbnRyeSA9PlxuICAgICAgICBCb29sZWFuKGVudHJ5LnN5bmNNZXNzYWdlLnN0aWNrZXJQYWNrT3BlcmF0aW9uPy5sZW5ndGgpXG4gICAgICApO1xuICAgICAgY29uc3QgW3N5bmNPcF0gPSBzeW5jTWVzc2FnZS5zdGlja2VyUGFja09wZXJhdGlvbiA/PyBbXTtcbiAgICAgIGFzc2VydC5pc1RydWUoU1RJQ0tFUl9QQUNLU1swXS5pZC5lcXVhbHMoc3luY09wPy5wYWNrSWQgPz8gRU1QVFkpKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzeW5jT3A/LnR5cGUsIFN0aWNrZXJQYWNrT3BlcmF0aW9uLlR5cGUuUkVNT1ZFKTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIHN0b3JhZ2Ugc2VydmljZSB1cGRhdGUnKTtcbiAgICAgIGNvbnN0IHN0YXRlQWZ0ZXIgPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3RvcmFnZVN0YXRlKHsgYWZ0ZXI6IHN0YXRlIH0pO1xuICAgICAgY29uc3Qgc3RpY2tlclBhY2sgPSBzdGF0ZUFmdGVyLmZpbmRSZWNvcmQoXG4gICAgICAgIGdldFN0aWNrZXJQYWNrUmVjb3JkUHJlZGljYXRlKFNUSUNLRVJfUEFDS1NbMF0pXG4gICAgICApO1xuICAgICAgYXNzZXJ0Lm9rKFxuICAgICAgICBzdGlja2VyUGFjayxcbiAgICAgICAgJ05ldyBzdG9yYWdlIHN0YXRlIHNob3VsZCBoYXZlIHN0aWNrZXIgcGFjayByZWNvcmQnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgICAgc3RpY2tlclBhY2s/LnJlY29yZC5zdGlja2VyUGFjaz8ucGFja0tleSxcbiAgICAgICAgRU1QVFksXG4gICAgICAgICdTdGlja2VyIHBhY2sga2V5IHNob3VsZCBiZSByZW1vdmVkJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IGRlbGV0ZWRBdCA9XG4gICAgICAgIHN0aWNrZXJQYWNrPy5yZWNvcmQuc3RpY2tlclBhY2s/LmRlbGV0ZWRBdFRpbWVzdGFtcD8udG9OdW1iZXIoKSA/PyAwO1xuICAgICAgYXNzZXJ0LmlzQWJvdmUoXG4gICAgICAgIGRlbGV0ZWRBdCxcbiAgICAgICAgRGF0ZS5ub3coKSAtIGR1cmF0aW9ucy5IT1VSLFxuICAgICAgICAnU3RpY2tlciBwYWNrIHNob3VsZCBoYXZlIGRlbGV0ZWQgYXQgdGltZXN0YW1wJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBkZWJ1Zygnb3BlbmluZyBzdGlja2VyIHBpY2tlcicpO1xuICAgIGNvbnZlcnNhdGlvblN0YWNrXG4gICAgICAubG9jYXRvcignLkNvbXBvc2l0aW9uQXJlYSAubW9kdWxlLXN0aWNrZXItYnV0dG9uX19idXR0b24nKVxuICAgICAgLmNsaWNrKCk7XG5cbiAgICBjb25zdCBzdGlja2VyUGlja2VyID0gY29udmVyc2F0aW9uU3RhY2subG9jYXRvcignLm1vZHVsZS1zdGlja2VyLXBpY2tlcicpO1xuXG4gICAge1xuICAgICAgZGVidWcoJ2luc3RhbGxpbmcgZmlyc3Qgc3RpY2tlciBwYWNrIHZpYSBzdG9yYWdlIHNlcnZpY2UnKTtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdpbml0aWFsIHN0YXRlJyk7XG5cbiAgICAgIGF3YWl0IHBob25lLnNldFN0b3JhZ2VTdGF0ZShcbiAgICAgICAgc3RhdGUudXBkYXRlUmVjb3JkKFxuICAgICAgICAgIGdldFN0aWNrZXJQYWNrUmVjb3JkUHJlZGljYXRlKFNUSUNLRVJfUEFDS1NbMF0pLFxuICAgICAgICAgIHJlY29yZCA9PiAoe1xuICAgICAgICAgICAgLi4ucmVjb3JkLFxuICAgICAgICAgICAgc3RpY2tlclBhY2s6IHtcbiAgICAgICAgICAgICAgLi4ucmVjb3JkPy5zdGlja2VyUGFjayxcbiAgICAgICAgICAgICAgcGFja0tleTogU1RJQ0tFUl9QQUNLU1swXS5rZXksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiA3LFxuICAgICAgICAgICAgICBkZWxldGVkQXRUaW1lc3RhbXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGF3YWl0IHBob25lLnNlbmRGZXRjaFN0b3JhZ2Uoe1xuICAgICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgIH0pO1xuXG4gICAgICBkZWJ1Zygnd2FpdGluZyBmb3Igc3RpY2tlciBwYWNrIHRvIGJlY29tZSB2aXNpYmxlJyk7XG4gICAgICBzdGlja2VyUGlja2VyXG4gICAgICAgIC5sb2NhdG9yKFxuICAgICAgICAgICdidXR0b24ubW9kdWxlLXN0aWNrZXItcGlja2VyX19oZWFkZXJfX2J1dHRvbicgK1xuICAgICAgICAgICAgYFtrZXk9XCIke1NUSUNLRVJfUEFDS1NbMF0uaWQudG9TdHJpbmcoJ2hleCcpfVwiXWBcbiAgICAgICAgKVxuICAgICAgICAud2FpdEZvcigpO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGRlYnVnKCdpbnN0YWxsaW5nIHNlY29uZCBzdGlja2VyIHBhY2sgdmlhIHN5bmMgbWVzc2FnZScpO1xuICAgICAgY29uc3Qgc3RhdGUgPSBhd2FpdCBwaG9uZS5leHBlY3RTdG9yYWdlU3RhdGUoJ2luaXRpYWwgc3RhdGUnKTtcblxuICAgICAgYXdhaXQgcGhvbmUuc2VuZFN0aWNrZXJQYWNrU3luYyh7XG4gICAgICAgIHR5cGU6ICdpbnN0YWxsJyxcbiAgICAgICAgcGFja0lkOiBTVElDS0VSX1BBQ0tTWzFdLmlkLFxuICAgICAgICBwYWNrS2V5OiBTVElDS0VSX1BBQ0tTWzFdLmtleSxcbiAgICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICB9KTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIHN0aWNrZXIgcGFjayB0byBiZWNvbWUgdmlzaWJsZScpO1xuICAgICAgc3RpY2tlclBpY2tlclxuICAgICAgICAubG9jYXRvcihcbiAgICAgICAgICAnYnV0dG9uLm1vZHVsZS1zdGlja2VyLXBpY2tlcl9faGVhZGVyX19idXR0b24nICtcbiAgICAgICAgICAgIGBba2V5PVwiJHtTVElDS0VSX1BBQ0tTWzFdLmlkLnRvU3RyaW5nKCdoZXgnKX1cIl1gXG4gICAgICAgIClcbiAgICAgICAgLndhaXRGb3IoKTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIHN0b3JhZ2Ugc2VydmljZSB1cGRhdGUnKTtcbiAgICAgIGNvbnN0IHN0YXRlQWZ0ZXIgPSBhd2FpdCBwaG9uZS53YWl0Rm9yU3RvcmFnZVN0YXRlKHsgYWZ0ZXI6IHN0YXRlIH0pO1xuICAgICAgY29uc3Qgc3RpY2tlclBhY2sgPSBzdGF0ZUFmdGVyLmZpbmRSZWNvcmQoXG4gICAgICAgIGdldFN0aWNrZXJQYWNrUmVjb3JkUHJlZGljYXRlKFNUSUNLRVJfUEFDS1NbMV0pXG4gICAgICApO1xuICAgICAgYXNzZXJ0Lm9rKFxuICAgICAgICBzdGlja2VyUGFjayxcbiAgICAgICAgJ05ldyBzdG9yYWdlIHN0YXRlIHNob3VsZCBoYXZlIHN0aWNrZXIgcGFjayByZWNvcmQnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgU1RJQ0tFUl9QQUNLU1sxXS5rZXkuZXF1YWxzKFxuICAgICAgICAgIHN0aWNrZXJQYWNrPy5yZWNvcmQuc3RpY2tlclBhY2s/LnBhY2tLZXkgPz8gRU1QVFlcbiAgICAgICAgKSxcbiAgICAgICAgJ1dyb25nIHN0aWNrZXIgcGFjayBrZXknXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBzdGlja2VyUGFjaz8ucmVjb3JkLnN0aWNrZXJQYWNrPy5wb3NpdGlvbixcbiAgICAgICAgNixcbiAgICAgICAgJ1dyb25nIHN0aWNrZXIgcGFjayBwb3NpdGlvbidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZGVidWcoJ1ZlcmlmeWluZyB0aGUgZmluYWwgbWFuaWZlc3QgdmVyc2lvbicpO1xuICAgIGNvbnN0IGZpbmFsU3RhdGUgPSBhd2FpdCBwaG9uZS5leHBlY3RTdG9yYWdlU3RhdGUoJ2NvbnNpc3RlbmN5IGNoZWNrJyk7XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZmluYWxTdGF0ZS52ZXJzaW9uLCA1KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUdBLGtCQUF1QjtBQUN2QixvQkFBc0I7QUFDdEIseUJBQXNCO0FBRXRCLHNCQUFlO0FBQ2Ysa0JBQWlCO0FBRWpCLGdCQUEyQjtBQUUzQixzQkFBbUM7QUFFbkMsTUFB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
