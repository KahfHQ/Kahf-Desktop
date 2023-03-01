var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var updateOurUsernameAndPni_exports = {};
__export(updateOurUsernameAndPni_exports, {
  updateOurUsernameAndPni: () => updateOurUsernameAndPni
});
module.exports = __toCommonJS(updateOurUsernameAndPni_exports);
var import_assert = require("./assert");
var import_dropNull = require("./dropNull");
async function updateOurUsernameAndPni() {
  const { server } = window.textsecure;
  (0, import_assert.strictAssert)(server, "updateOurUsernameAndPni: window.textsecure.server not available");
  const me = window.ConversationController.getOurConversationOrThrow();
  const { username } = await server.whoami();
  me.set({ username: (0, import_dropNull.dropNull)(username) });
  window.Signal.Data.updateConversation(me.attributes);
  const manager = window.getAccountManager();
  (0, import_assert.strictAssert)(manager, "updateOurUsernameAndPni: AccountManager not available");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateOurUsernameAndPni
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXBkYXRlT3VyVXNlcm5hbWVBbmRQbmkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuL2Fzc2VydCc7XG5pbXBvcnQgeyBkcm9wTnVsbCB9IGZyb20gJy4vZHJvcE51bGwnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlT3VyVXNlcm5hbWVBbmRQbmkoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgc2VydmVyIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcblxuICBzdHJpY3RBc3NlcnQoXG4gICAgc2VydmVyLFxuICAgICd1cGRhdGVPdXJVc2VybmFtZUFuZFBuaTogd2luZG93LnRleHRzZWN1cmUuc2VydmVyIG5vdCBhdmFpbGFibGUnXG4gICk7XG5cbiAgY29uc3QgbWUgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25PclRocm93KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF3YWl0IHNlcnZlci53aG9hbWkoKTtcblxuICBtZS5zZXQoeyB1c2VybmFtZTogZHJvcE51bGwodXNlcm5hbWUpIH0pO1xuICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKG1lLmF0dHJpYnV0ZXMpO1xuXG4gIGNvbnN0IG1hbmFnZXIgPSB3aW5kb3cuZ2V0QWNjb3VudE1hbmFnZXIoKTtcbiAgc3RyaWN0QXNzZXJ0KFxuICAgIG1hbmFnZXIsXG4gICAgJ3VwZGF0ZU91clVzZXJuYW1lQW5kUG5pOiBBY2NvdW50TWFuYWdlciBub3QgYXZhaWxhYmxlJ1xuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUE2QjtBQUM3QixzQkFBeUI7QUFFekIseUNBQStEO0FBQzdELFFBQU0sRUFBRSxXQUFXLE9BQU87QUFFMUIsa0NBQ0UsUUFDQSxpRUFDRjtBQUVBLFFBQU0sS0FBSyxPQUFPLHVCQUF1QiwwQkFBMEI7QUFDbkUsUUFBTSxFQUFFLGFBQWEsTUFBTSxPQUFPLE9BQU87QUFFekMsS0FBRyxJQUFJLEVBQUUsVUFBVSw4QkFBUyxRQUFRLEVBQUUsQ0FBQztBQUN2QyxTQUFPLE9BQU8sS0FBSyxtQkFBbUIsR0FBRyxVQUFVO0FBRW5ELFFBQU0sVUFBVSxPQUFPLGtCQUFrQjtBQUN6QyxrQ0FDRSxTQUNBLHVEQUNGO0FBQ0Y7QUFuQnNCIiwKICAibmFtZXMiOiBbXQp9Cg==
