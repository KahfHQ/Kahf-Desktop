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
var fixtures_exports = {};
__export(fixtures_exports, {
  App: () => import_playwright.App,
  Bootstrap: () => import_bootstrap.Bootstrap,
  debug: () => debug,
  initStorage: () => initStorage
});
module.exports = __toCommonJS(fixtures_exports);
var import_debug = __toESM(require("debug"));
var import_mock_server = require("@signalapp/mock-server");
var import_playwright = require("../playwright");
var import_bootstrap = require("../bootstrap");
var import_Stories = require("../../types/Stories");
var import_uuidToBytes = require("../../util/uuidToBytes");
const debug = (0, import_debug.default)("mock:test:storage");
const GROUP_SIZE = 8;
const IdentifierType = import_mock_server.Proto.ManifestRecord.Identifier.Type;
async function initStorage(options) {
  const bootstrap = new import_bootstrap.Bootstrap(options);
  await bootstrap.init();
  try {
    const { contacts, phone } = bootstrap;
    const [firstContact] = contacts;
    const members = [...contacts].slice(0, GROUP_SIZE);
    const group = await phone.createGroup({
      title: "Mock Group",
      members: [phone, ...members]
    });
    let state = import_mock_server.StorageState.getEmpty();
    state = state.updateAccount({
      profileKey: phone.profileKey.serialize(),
      e164: phone.device.number,
      givenName: phone.profileName
    });
    state = state.addGroup(group, {
      whitelisted: true
    }).pinGroup(group);
    for (const contact of contacts) {
      state = state.addContact(contact, {
        identityState: import_mock_server.Proto.ContactRecord.IdentityState.VERIFIED,
        whitelisted: true,
        identityKey: contact.publicKey.serialize(),
        profileKey: contact.profileKey.serialize(),
        givenName: contact.profileName
      });
    }
    state = state.pin(firstContact);
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
    const app = await bootstrap.link();
    const { desktop } = bootstrap;
    const contactSend = contacts[0].sendText(desktop, "hello from contact", {
      timestamp: bootstrap.getTimestamp(),
      sealed: true
    });
    const groupSend = members[0].sendText(desktop, "hello in group", {
      timestamp: bootstrap.getTimestamp(),
      sealed: true,
      group
    });
    await Promise.all([contactSend, groupSend]);
    return { bootstrap, app, group, members };
  } catch (error) {
    await bootstrap.saveLogs();
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App,
  Bootstrap,
  debug,
  initStorage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZml4dHVyZXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB0eXBlIHsgR3JvdXAsIFByaW1hcnlEZXZpY2UgfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcbmltcG9ydCB7IFN0b3JhZ2VTdGF0ZSwgUHJvdG8gfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgQm9vdHN0cmFwIH0gZnJvbSAnLi4vYm9vdHN0cmFwJztcbmltcG9ydCB0eXBlIHsgQm9vdHN0cmFwT3B0aW9ucyB9IGZyb20gJy4uL2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBNWV9TVE9SSUVTX0lEIH0gZnJvbSAnLi4vLi4vdHlwZXMvU3Rvcmllcyc7XG5pbXBvcnQgeyB1dWlkVG9CeXRlcyB9IGZyb20gJy4uLy4uL3V0aWwvdXVpZFRvQnl0ZXMnO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbW9jazp0ZXN0OnN0b3JhZ2UnKTtcblxuZXhwb3J0IHsgQXBwLCBCb290c3RyYXAgfTtcblxuY29uc3QgR1JPVVBfU0laRSA9IDg7XG5cbmNvbnN0IElkZW50aWZpZXJUeXBlID0gUHJvdG8uTWFuaWZlc3RSZWNvcmQuSWRlbnRpZmllci5UeXBlO1xuXG5leHBvcnQgdHlwZSBJbml0U3RvcmFnZVJlc3VsdFR5cGUgPSBSZWFkb25seTx7XG4gIGJvb3RzdHJhcDogQm9vdHN0cmFwO1xuICBhcHA6IEFwcDtcbiAgZ3JvdXA6IEdyb3VwO1xuICBtZW1iZXJzOiBSZWFkb25seUFycmF5PFByaW1hcnlEZXZpY2U+O1xufT47XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGNyZWF0ZXMgYW4gaW5pdGlhbCBzdG9yYWdlIHNlcnZpY2Ugc3RhdGUgdGhhdCBpbmNsdWRlczpcbi8vXG4vLyAtIEFsbCBjb250YWN0cyBmcm9tIGNvbnRhY3Qgc3luYyAoZmlyc3QgY29udGFjdCBwaW5uZWQpXG4vLyAtIEEgcGlubmVkIGdyb3VwIHdpdGggR1JPVVBfU0laRSBtZW1iZXJzIChmcm9tIHRoZSBjb250YWN0cylcbi8vIC0gQWNjb3VudCB3aXRoIGUxNjQgYW5kIHByb2ZpbGVLZXlcbi8vXG4vLyBJbiBhZGRpdGlvbiB0byBhYm92ZSwgdGhpcyBmdW5jdGlvbiB3aWxsIHF1ZXVlIG9uZSBpbmNvbWluZyBtZXNzYWdlIGluIHRoZVxuLy8gZ3JvdXAsIGFuZCBvbmUgZm9yIHRoZSBmaXJzdCBjb250YWN0IChzbyB0aGF0IGJvdGggd2lsbCBhcHBlYXIgaW4gdGhlIGxlZnRcbi8vIHBhbmUpLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRTdG9yYWdlKFxuICBvcHRpb25zPzogQm9vdHN0cmFwT3B0aW9uc1xuKTogUHJvbWlzZTxJbml0U3RvcmFnZVJlc3VsdFR5cGU+IHtcbiAgLy8gQ3JlYXRlcyBwcmltYXJ5IGRldmljZSwgY29udGFjdHNcbiAgY29uc3QgYm9vdHN0cmFwID0gbmV3IEJvb3RzdHJhcChvcHRpb25zKTtcblxuICBhd2FpdCBib290c3RyYXAuaW5pdCgpO1xuXG4gIHRyeSB7XG4gICAgLy8gUG9wdWxhdGUgc3RvcmFnZSBzZXJ2aWNlXG4gICAgY29uc3QgeyBjb250YWN0cywgcGhvbmUgfSA9IGJvb3RzdHJhcDtcblxuICAgIGNvbnN0IFtmaXJzdENvbnRhY3RdID0gY29udGFjdHM7XG5cbiAgICBjb25zdCBtZW1iZXJzID0gWy4uLmNvbnRhY3RzXS5zbGljZSgwLCBHUk9VUF9TSVpFKTtcblxuICAgIGNvbnN0IGdyb3VwID0gYXdhaXQgcGhvbmUuY3JlYXRlR3JvdXAoe1xuICAgICAgdGl0bGU6ICdNb2NrIEdyb3VwJyxcbiAgICAgIG1lbWJlcnM6IFtwaG9uZSwgLi4ubWVtYmVyc10sXG4gICAgfSk7XG5cbiAgICBsZXQgc3RhdGUgPSBTdG9yYWdlU3RhdGUuZ2V0RW1wdHkoKTtcblxuICAgIHN0YXRlID0gc3RhdGUudXBkYXRlQWNjb3VudCh7XG4gICAgICBwcm9maWxlS2V5OiBwaG9uZS5wcm9maWxlS2V5LnNlcmlhbGl6ZSgpLFxuICAgICAgZTE2NDogcGhvbmUuZGV2aWNlLm51bWJlcixcbiAgICAgIGdpdmVuTmFtZTogcGhvbmUucHJvZmlsZU5hbWUsXG4gICAgfSk7XG5cbiAgICBzdGF0ZSA9IHN0YXRlXG4gICAgICAuYWRkR3JvdXAoZ3JvdXAsIHtcbiAgICAgICAgd2hpdGVsaXN0ZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICAgLnBpbkdyb3VwKGdyb3VwKTtcblxuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBjb250YWN0cykge1xuICAgICAgc3RhdGUgPSBzdGF0ZS5hZGRDb250YWN0KGNvbnRhY3QsIHtcbiAgICAgICAgaWRlbnRpdHlTdGF0ZTogUHJvdG8uQ29udGFjdFJlY29yZC5JZGVudGl0eVN0YXRlLlZFUklGSUVELFxuICAgICAgICB3aGl0ZWxpc3RlZDogdHJ1ZSxcblxuICAgICAgICBpZGVudGl0eUtleTogY29udGFjdC5wdWJsaWNLZXkuc2VyaWFsaXplKCksXG4gICAgICAgIHByb2ZpbGVLZXk6IGNvbnRhY3QucHJvZmlsZUtleS5zZXJpYWxpemUoKSxcbiAgICAgICAgZ2l2ZW5OYW1lOiBjb250YWN0LnByb2ZpbGVOYW1lLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGUgPSBzdGF0ZS5waW4oZmlyc3RDb250YWN0KTtcblxuICAgIHN0YXRlID0gc3RhdGUuYWRkUmVjb3JkKHtcbiAgICAgIHR5cGU6IElkZW50aWZpZXJUeXBlLlNUT1JZX0RJU1RSSUJVVElPTl9MSVNULFxuICAgICAgcmVjb3JkOiB7XG4gICAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdDoge1xuICAgICAgICAgIGFsbG93c1JlcGxpZXM6IHRydWUsXG4gICAgICAgICAgaWRlbnRpZmllcjogdXVpZFRvQnl0ZXMoTVlfU1RPUklFU19JRCksXG4gICAgICAgICAgaXNCbG9ja0xpc3Q6IHRydWUsXG4gICAgICAgICAgbmFtZTogTVlfU1RPUklFU19JRCxcbiAgICAgICAgICByZWNpcGllbnRVdWlkczogW10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXdhaXQgcGhvbmUuc2V0U3RvcmFnZVN0YXRlKHN0YXRlKTtcblxuICAgIC8vIExpbmsgbmV3IGRldmljZVxuICAgIGNvbnN0IGFwcCA9IGF3YWl0IGJvb3RzdHJhcC5saW5rKCk7XG5cbiAgICBjb25zdCB7IGRlc2t0b3AgfSA9IGJvb3RzdHJhcDtcblxuICAgIC8vIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBncm91cCBhbmQgdGhlIGZpcnN0IGNvbnRhY3RcbiAgICBjb25zdCBjb250YWN0U2VuZCA9IGNvbnRhY3RzWzBdLnNlbmRUZXh0KGRlc2t0b3AsICdoZWxsbyBmcm9tIGNvbnRhY3QnLCB7XG4gICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgIHNlYWxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwU2VuZCA9IG1lbWJlcnNbMF0uc2VuZFRleHQoZGVza3RvcCwgJ2hlbGxvIGluIGdyb3VwJywge1xuICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICBzZWFsZWQ6IHRydWUsXG4gICAgICBncm91cCxcbiAgICB9KTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtjb250YWN0U2VuZCwgZ3JvdXBTZW5kXSk7XG5cbiAgICByZXR1cm4geyBib290c3RyYXAsIGFwcCwgZ3JvdXAsIG1lbWJlcnMgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhd2FpdCBib290c3RyYXAuc2F2ZUxvZ3MoKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuIl0s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
