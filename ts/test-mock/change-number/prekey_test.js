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
var prekey_test_exports = {};
__export(prekey_test_exports, {
  debug: () => debug
});
module.exports = __toCommonJS(prekey_test_exports);
var import_mock_server = require("@signalapp/mock-server");
var import_debug = __toESM(require("debug"));
var durations = __toESM(require("../../util/durations"));
var import_bootstrap = require("../bootstrap");
const debug = (0, import_debug.default)("mock:test:change-number");
describe("change number", function needsName() {
  this.timeout(durations.MINUTE);
  let bootstrap;
  let app;
  beforeEach(async () => {
    bootstrap = new import_bootstrap.Bootstrap();
    await bootstrap.init();
    app = await bootstrap.link();
  });
  afterEach(async function after() {
    if (this.currentTest?.state !== "passed") {
      await bootstrap.saveLogs();
    }
    await app.close();
    await bootstrap.teardown();
  });
  it("should accept sync message and update keys", async () => {
    const { server, phone, desktop, contacts } = bootstrap;
    const [first] = contacts;
    const window = await app.getWindow();
    const leftPane = window.locator(".left-pane-wrapper");
    debug("prepare a message for original PNI");
    const messageBefore = await first.encryptText(desktop, "Before", {
      uuidKind: import_mock_server.UUIDKind.PNI
    });
    debug("preparing change number");
    const changeNumber = await phone.prepareChangeNumber();
    const newKey = await desktop.popSingleUseKey(import_mock_server.UUIDKind.PNI);
    await first.addSingleUseKey(desktop, newKey, import_mock_server.UUIDKind.PNI);
    debug("prepare a message for updated PNI");
    const messageAfter = await first.encryptText(desktop, "After", {
      uuidKind: import_mock_server.UUIDKind.PNI
    });
    debug("sending all messages");
    await Promise.all([
      server.send(desktop, messageBefore),
      phone.sendChangeNumber(changeNumber),
      server.send(desktop, messageAfter)
    ]);
    debug("opening conversation with the first contact");
    await leftPane.locator(`_react=ConversationListItem[title = ${JSON.stringify(first.profileName)}]  >> "After"`).click();
    debug("done");
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJla2V5X3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgVVVJREtpbmQgfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5cbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBCb290c3RyYXAgfSBmcm9tICcuLi9ib290c3RyYXAnO1xuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICcuLi9ib290c3RyYXAnO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbW9jazp0ZXN0OmNoYW5nZS1udW1iZXInKTtcblxuZGVzY3JpYmUoJ2NoYW5nZSBudW1iZXInLCBmdW5jdGlvbiBuZWVkc05hbWUoKSB7XG4gIHRoaXMudGltZW91dChkdXJhdGlvbnMuTUlOVVRFKTtcblxuICBsZXQgYm9vdHN0cmFwOiBCb290c3RyYXA7XG4gIGxldCBhcHA6IEFwcDtcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBib290c3RyYXAgPSBuZXcgQm9vdHN0cmFwKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLmluaXQoKTtcbiAgICBhcHAgPSBhd2FpdCBib290c3RyYXAubGluaygpO1xuICB9KTtcblxuICBhZnRlckVhY2goYXN5bmMgZnVuY3Rpb24gYWZ0ZXIoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRlc3Q/LnN0YXRlICE9PSAncGFzc2VkJykge1xuICAgICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgYXBwLmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWNjZXB0IHN5bmMgbWVzc2FnZSBhbmQgdXBkYXRlIGtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBzZXJ2ZXIsIHBob25lLCBkZXNrdG9wLCBjb250YWN0cyB9ID0gYm9vdHN0cmFwO1xuXG4gICAgY29uc3QgW2ZpcnN0XSA9IGNvbnRhY3RzO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG5cbiAgICBkZWJ1ZygncHJlcGFyZSBhIG1lc3NhZ2UgZm9yIG9yaWdpbmFsIFBOSScpO1xuICAgIGNvbnN0IG1lc3NhZ2VCZWZvcmUgPSBhd2FpdCBmaXJzdC5lbmNyeXB0VGV4dChkZXNrdG9wLCAnQmVmb3JlJywge1xuICAgICAgdXVpZEtpbmQ6IFVVSURLaW5kLlBOSSxcbiAgICB9KTtcblxuICAgIGRlYnVnKCdwcmVwYXJpbmcgY2hhbmdlIG51bWJlcicpO1xuICAgIGNvbnN0IGNoYW5nZU51bWJlciA9IGF3YWl0IHBob25lLnByZXBhcmVDaGFuZ2VOdW1iZXIoKTtcblxuICAgIGNvbnN0IG5ld0tleSA9IGF3YWl0IGRlc2t0b3AucG9wU2luZ2xlVXNlS2V5KFVVSURLaW5kLlBOSSk7XG4gICAgYXdhaXQgZmlyc3QuYWRkU2luZ2xlVXNlS2V5KGRlc2t0b3AsIG5ld0tleSwgVVVJREtpbmQuUE5JKTtcblxuICAgIGRlYnVnKCdwcmVwYXJlIGEgbWVzc2FnZSBmb3IgdXBkYXRlZCBQTkknKTtcbiAgICBjb25zdCBtZXNzYWdlQWZ0ZXIgPSBhd2FpdCBmaXJzdC5lbmNyeXB0VGV4dChkZXNrdG9wLCAnQWZ0ZXInLCB7XG4gICAgICB1dWlkS2luZDogVVVJREtpbmQuUE5JLFxuICAgIH0pO1xuXG4gICAgZGVidWcoJ3NlbmRpbmcgYWxsIG1lc3NhZ2VzJyk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgc2VydmVyLnNlbmQoZGVza3RvcCwgbWVzc2FnZUJlZm9yZSksXG4gICAgICBwaG9uZS5zZW5kQ2hhbmdlTnVtYmVyKGNoYW5nZU51bWJlciksXG4gICAgICBzZXJ2ZXIuc2VuZChkZXNrdG9wLCBtZXNzYWdlQWZ0ZXIpLFxuICAgIF0pO1xuXG4gICAgZGVidWcoJ29wZW5pbmcgY29udmVyc2F0aW9uIHdpdGggdGhlIGZpcnN0IGNvbnRhY3QnKTtcbiAgICBhd2FpdCBsZWZ0UGFuZVxuICAgICAgLmxvY2F0b3IoXG4gICAgICAgICdfcmVhY3Q9Q29udmVyc2F0aW9uTGlzdEl0ZW0nICtcbiAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShmaXJzdC5wcm9maWxlTmFtZSl9XSBgICtcbiAgICAgICAgICAnID4+IFwiQWZ0ZXJcIidcbiAgICAgIClcbiAgICAgIC5jbGljaygpO1xuXG4gICAgZGVidWcoJ2RvbmUnKTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSx5QkFBeUI7QUFDekIsbUJBQXdCO0FBRXhCLGdCQUEyQjtBQUMzQix1QkFBMEI7QUFHbkIsTUFBTSxRQUFRLDBCQUFZLHlCQUF5QjtBQUUxRCxTQUFTLGlCQUFpQixxQkFBcUI7QUFDN0MsT0FBSyxRQUFRLFVBQVUsTUFBTTtBQUU3QixNQUFJO0FBQ0osTUFBSTtBQUVKLGFBQVcsWUFBWTtBQUNyQixnQkFBWSxJQUFJLDJCQUFVO0FBQzFCLFVBQU0sVUFBVSxLQUFLO0FBQ3JCLFVBQU0sTUFBTSxVQUFVLEtBQUs7QUFBQSxFQUM3QixDQUFDO0FBRUQsWUFBVSx1QkFBdUI7QUFDL0IsUUFBSSxLQUFLLGFBQWEsVUFBVSxVQUFVO0FBQ3hDLFlBQU0sVUFBVSxTQUFTO0FBQUEsSUFDM0I7QUFFQSxVQUFNLElBQUksTUFBTTtBQUNoQixVQUFNLFVBQVUsU0FBUztBQUFBLEVBQzNCLENBQUM7QUFFRCxLQUFHLDhDQUE4QyxZQUFZO0FBQzNELFVBQU0sRUFBRSxRQUFRLE9BQU8sU0FBUyxhQUFhO0FBRTdDLFVBQU0sQ0FBQyxTQUFTO0FBRWhCLFVBQU0sU0FBUyxNQUFNLElBQUksVUFBVTtBQUVuQyxVQUFNLFdBQVcsT0FBTyxRQUFRLG9CQUFvQjtBQUVwRCxVQUFNLG9DQUFvQztBQUMxQyxVQUFNLGdCQUFnQixNQUFNLE1BQU0sWUFBWSxTQUFTLFVBQVU7QUFBQSxNQUMvRCxVQUFVLDRCQUFTO0FBQUEsSUFDckIsQ0FBQztBQUVELFVBQU0seUJBQXlCO0FBQy9CLFVBQU0sZUFBZSxNQUFNLE1BQU0sb0JBQW9CO0FBRXJELFVBQU0sU0FBUyxNQUFNLFFBQVEsZ0JBQWdCLDRCQUFTLEdBQUc7QUFDekQsVUFBTSxNQUFNLGdCQUFnQixTQUFTLFFBQVEsNEJBQVMsR0FBRztBQUV6RCxVQUFNLG1DQUFtQztBQUN6QyxVQUFNLGVBQWUsTUFBTSxNQUFNLFlBQVksU0FBUyxTQUFTO0FBQUEsTUFDN0QsVUFBVSw0QkFBUztBQUFBLElBQ3JCLENBQUM7QUFFRCxVQUFNLHNCQUFzQjtBQUM1QixVQUFNLFFBQVEsSUFBSTtBQUFBLE1BQ2hCLE9BQU8sS0FBSyxTQUFTLGFBQWE7QUFBQSxNQUNsQyxNQUFNLGlCQUFpQixZQUFZO0FBQUEsTUFDbkMsT0FBTyxLQUFLLFNBQVMsWUFBWTtBQUFBLElBQ25DLENBQUM7QUFFRCxVQUFNLDZDQUE2QztBQUNuRCxVQUFNLFNBQ0gsUUFDQyx1Q0FDYyxLQUFLLFVBQVUsTUFBTSxXQUFXLGdCQUVoRCxFQUNDLE1BQU07QUFFVCxVQUFNLE1BQU07QUFBQSxFQUNkLENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
