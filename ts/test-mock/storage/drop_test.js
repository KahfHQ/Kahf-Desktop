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
  it("should drop gv1 record if there is a matching gv2 record", async () => {
    const { phone } = bootstrap;
    (0, import_fixtures.debug)("adding both records");
    {
      const state = await phone.expectStorageState("consistency check");
      const groupV1Id = Buffer.from("Wi9258rCEp7AdSdp+jCMlQ==", "base64");
      const masterKey = Buffer.from("2+rdvzFGCOJI8POHcPNZHrYQWS/JXmT63R5OXKxhrPk=", "base64");
      const updatedState = await phone.setStorageState(state.addRecord({
        type: IdentifierType.GROUPV1,
        record: {
          groupV1: {
            id: groupV1Id
          }
        }
      }).addRecord({
        type: IdentifierType.GROUPV2,
        record: {
          groupV2: {
            masterKey
          }
        }
      }));
      (0, import_fixtures.debug)("sending fetch storage");
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      (0, import_fixtures.debug)("waiting for next storage state");
      const nextState = await phone.waitForStorageState({
        after: updatedState
      });
      import_chai.assert.isFalse(nextState.hasRecord(({ type }) => {
        return type === IdentifierType.GROUPV1;
      }), "should not have gv1 record");
      import_chai.assert.isTrue(nextState.hasRecord(({ type, record }) => {
        if (type !== IdentifierType.GROUPV2) {
          return false;
        }
        if (!record.groupV2?.masterKey) {
          return false;
        }
        return Buffer.from(masterKey).equals(record.groupV2.masterKey);
      }), "should have gv2 record");
    }
  });
  it("should drop duplicate account record", async () => {
    const { phone } = bootstrap;
    (0, import_fixtures.debug)("duplicating account record");
    {
      const state = await phone.expectStorageState("consistency check");
      const oldAccount = state.findRecord(({ type }) => {
        return type === IdentifierType.ACCOUNT;
      });
      if (oldAccount === void 0) {
        throw new Error("should have initial account record");
      }
      const updatedState = await phone.setStorageState(state.addRecord({
        type: IdentifierType.ACCOUNT,
        record: oldAccount.record
      }));
      (0, import_fixtures.debug)("sending fetch storage");
      await phone.sendFetchStorage({
        timestamp: bootstrap.getTimestamp()
      });
      (0, import_fixtures.debug)("waiting for next storage state");
      const nextState = await phone.waitForStorageState({
        after: updatedState
      });
      import_chai.assert.isFalse(nextState.hasRecord(({ type, key }) => {
        return type === IdentifierType.ACCOUNT && key.equals(oldAccount.key);
      }), "should not have old account record");
      import_chai.assert.isTrue(nextState.hasRecord(({ type }) => {
        return type === IdentifierType.ACCOUNT;
      }), "should have new account record");
    }
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZHJvcF90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHsgUHJvdG8gfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uLy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB0eXBlIHsgQXBwLCBCb290c3RyYXAgfSBmcm9tICcuL2ZpeHR1cmVzJztcbmltcG9ydCB7IGluaXRTdG9yYWdlLCBkZWJ1ZyB9IGZyb20gJy4vZml4dHVyZXMnO1xuXG5jb25zdCBJZGVudGlmaWVyVHlwZSA9IFByb3RvLk1hbmlmZXN0UmVjb3JkLklkZW50aWZpZXIuVHlwZTtcblxuZGVzY3JpYmUoJ3N0b3JhZ2Ugc2VydmljZScsIGZ1bmN0aW9uIG5lZWRzTmFtZSgpIHtcbiAgdGhpcy50aW1lb3V0KGR1cmF0aW9ucy5NSU5VVEUpO1xuXG4gIGxldCBib290c3RyYXA6IEJvb3RzdHJhcDtcbiAgbGV0IGFwcDogQXBwO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICh7IGJvb3RzdHJhcCwgYXBwIH0gPSBhd2FpdCBpbml0U3RvcmFnZSgpKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGFzeW5jIGZ1bmN0aW9uIGFmdGVyKCkge1xuICAgIGlmICghYm9vdHN0cmFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFRlc3Q/LnN0YXRlICE9PSAncGFzc2VkJykge1xuICAgICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgYXBwLmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZHJvcCBndjEgcmVjb3JkIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZ3YyIHJlY29yZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBob25lIH0gPSBib290c3RyYXA7XG5cbiAgICBkZWJ1ZygnYWRkaW5nIGJvdGggcmVjb3JkcycpO1xuICAgIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgcGhvbmUuZXhwZWN0U3RvcmFnZVN0YXRlKCdjb25zaXN0ZW5jeSBjaGVjaycpO1xuXG4gICAgICBjb25zdCBncm91cFYxSWQgPSBCdWZmZXIuZnJvbSgnV2k5MjU4ckNFcDdBZFNkcCtqQ01sUT09JywgJ2Jhc2U2NCcpO1xuICAgICAgY29uc3QgbWFzdGVyS2V5ID0gQnVmZmVyLmZyb20oXG4gICAgICAgICcyK3JkdnpGR0NPSkk4UE9IY1BOWkhyWVFXUy9KWG1UNjNSNU9YS3hoclBrPScsXG4gICAgICAgICdiYXNlNjQnXG4gICAgICApO1xuXG4gICAgICBjb25zdCB1cGRhdGVkU3RhdGUgPSBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoXG4gICAgICAgIHN0YXRlXG4gICAgICAgICAgLmFkZFJlY29yZCh7XG4gICAgICAgICAgICB0eXBlOiBJZGVudGlmaWVyVHlwZS5HUk9VUFYxLFxuICAgICAgICAgICAgcmVjb3JkOiB7XG4gICAgICAgICAgICAgIGdyb3VwVjE6IHtcbiAgICAgICAgICAgICAgICBpZDogZ3JvdXBWMUlkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hZGRSZWNvcmQoe1xuICAgICAgICAgICAgdHlwZTogSWRlbnRpZmllclR5cGUuR1JPVVBWMixcbiAgICAgICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgICBncm91cFYyOiB7XG4gICAgICAgICAgICAgICAgbWFzdGVyS2V5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgZGVidWcoJ3NlbmRpbmcgZmV0Y2ggc3RvcmFnZScpO1xuICAgICAgYXdhaXQgcGhvbmUuc2VuZEZldGNoU3RvcmFnZSh7XG4gICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgfSk7XG5cbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBuZXh0IHN0b3JhZ2Ugc3RhdGUnKTtcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IGF3YWl0IHBob25lLndhaXRGb3JTdG9yYWdlU3RhdGUoe1xuICAgICAgICBhZnRlcjogdXBkYXRlZFN0YXRlLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKFxuICAgICAgICBuZXh0U3RhdGUuaGFzUmVjb3JkKCh7IHR5cGUgfSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0eXBlID09PSBJZGVudGlmaWVyVHlwZS5HUk9VUFYxO1xuICAgICAgICB9KSxcbiAgICAgICAgJ3Nob3VsZCBub3QgaGF2ZSBndjEgcmVjb3JkJ1xuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgbmV4dFN0YXRlLmhhc1JlY29yZCgoeyB0eXBlLCByZWNvcmQgfSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlICE9PSBJZGVudGlmaWVyVHlwZS5HUk9VUFYyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFyZWNvcmQuZ3JvdXBWMj8ubWFzdGVyS2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShtYXN0ZXJLZXkpLmVxdWFscyhyZWNvcmQuZ3JvdXBWMi5tYXN0ZXJLZXkpO1xuICAgICAgICB9KSxcbiAgICAgICAgJ3Nob3VsZCBoYXZlIGd2MiByZWNvcmQnXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBkcm9wIGR1cGxpY2F0ZSBhY2NvdW50IHJlY29yZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBob25lIH0gPSBib290c3RyYXA7XG5cbiAgICBkZWJ1ZygnZHVwbGljYXRpbmcgYWNjb3VudCByZWNvcmQnKTtcbiAgICB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHBob25lLmV4cGVjdFN0b3JhZ2VTdGF0ZSgnY29uc2lzdGVuY3kgY2hlY2snKTtcblxuICAgICAgY29uc3Qgb2xkQWNjb3VudCA9IHN0YXRlLmZpbmRSZWNvcmQoKHsgdHlwZSB9KSA9PiB7XG4gICAgICAgIHJldHVybiB0eXBlID09PSBJZGVudGlmaWVyVHlwZS5BQ0NPVU5UO1xuICAgICAgfSk7XG4gICAgICBpZiAob2xkQWNjb3VudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2hvdWxkIGhhdmUgaW5pdGlhbCBhY2NvdW50IHJlY29yZCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGVkU3RhdGUgPSBhd2FpdCBwaG9uZS5zZXRTdG9yYWdlU3RhdGUoXG4gICAgICAgIHN0YXRlLmFkZFJlY29yZCh7XG4gICAgICAgICAgdHlwZTogSWRlbnRpZmllclR5cGUuQUNDT1VOVCxcbiAgICAgICAgICByZWNvcmQ6IG9sZEFjY291bnQucmVjb3JkLFxuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgZGVidWcoJ3NlbmRpbmcgZmV0Y2ggc3RvcmFnZScpO1xuICAgICAgYXdhaXQgcGhvbmUuc2VuZEZldGNoU3RvcmFnZSh7XG4gICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgfSk7XG5cbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBuZXh0IHN0b3JhZ2Ugc3RhdGUnKTtcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IGF3YWl0IHBob25lLndhaXRGb3JTdG9yYWdlU3RhdGUoe1xuICAgICAgICBhZnRlcjogdXBkYXRlZFN0YXRlLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKFxuICAgICAgICBuZXh0U3RhdGUuaGFzUmVjb3JkKCh7IHR5cGUsIGtleSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHR5cGUgPT09IElkZW50aWZpZXJUeXBlLkFDQ09VTlQgJiYga2V5LmVxdWFscyhvbGRBY2NvdW50LmtleSk7XG4gICAgICAgIH0pLFxuICAgICAgICAnc2hvdWxkIG5vdCBoYXZlIG9sZCBhY2NvdW50IHJlY29yZCdcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIG5leHRTdGF0ZS5oYXNSZWNvcmQoKHsgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHR5cGUgPT09IElkZW50aWZpZXJUeXBlLkFDQ09VTlQ7XG4gICAgICAgIH0pLFxuICAgICAgICAnc2hvdWxkIGhhdmUgbmV3IGFjY291bnQgcmVjb3JkJ1xuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esa0JBQXVCO0FBQ3ZCLHlCQUFzQjtBQUV0QixnQkFBMkI7QUFFM0Isc0JBQW1DO0FBRW5DLE1BQU0saUJBQWlCLHlCQUFNLGVBQWUsV0FBVztBQUV2RCxTQUFTLG1CQUFtQixxQkFBcUI7QUFDL0MsT0FBSyxRQUFRLFVBQVUsTUFBTTtBQUU3QixNQUFJO0FBQ0osTUFBSTtBQUVKLGFBQVcsWUFBWTtBQUNyQixJQUFDLEdBQUUsV0FBVyxJQUFJLElBQUksTUFBTSxpQ0FBWTtBQUFBLEVBQzFDLENBQUM7QUFFRCxZQUFVLHVCQUF1QjtBQUMvQixRQUFJLENBQUMsV0FBVztBQUNkO0FBQUEsSUFDRjtBQUVBLFFBQUksS0FBSyxhQUFhLFVBQVUsVUFBVTtBQUN4QyxZQUFNLFVBQVUsU0FBUztBQUFBLElBQzNCO0FBRUEsVUFBTSxJQUFJLE1BQU07QUFDaEIsVUFBTSxVQUFVLFNBQVM7QUFBQSxFQUMzQixDQUFDO0FBRUQsS0FB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
