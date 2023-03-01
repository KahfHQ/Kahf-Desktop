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
var shouldNeverBeCalled_exports = {};
__export(shouldNeverBeCalled_exports, {
  asyncShouldNeverBeCalled: () => asyncShouldNeverBeCalled,
  shouldNeverBeCalled: () => shouldNeverBeCalled
});
module.exports = __toCommonJS(shouldNeverBeCalled_exports);
var import_assert = require("./assert");
function shouldNeverBeCalled(..._args) {
  (0, import_assert.assert)(false, "This should never be called. Doing nothing");
}
async function asyncShouldNeverBeCalled(..._args) {
  shouldNeverBeCalled();
  return void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asyncShouldNeverBeCalled,
  shouldNeverBeCalled
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2hvdWxkTmV2ZXJCZUNhbGxlZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJy4vYXNzZXJ0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE5ldmVyQmVDYWxsZWQoLi4uX2FyZ3M6IFJlYWRvbmx5QXJyYXk8dW5rbm93bj4pOiB2b2lkIHtcbiAgYXNzZXJ0KGZhbHNlLCAnVGhpcyBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkLiBEb2luZyBub3RoaW5nJyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY1Nob3VsZE5ldmVyQmVDYWxsZWQoXG4gIC4uLl9hcmdzOiBSZWFkb25seUFycmF5PHVua25vd24+XG4pOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBzaG91bGROZXZlckJlQ2FsbGVkKCk7XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUF1QjtBQUVoQixnQ0FBZ0MsT0FBcUM7QUFDMUUsNEJBQU8sT0FBTyw0Q0FBNEM7QUFDNUQ7QUFGZ0IsQUFJaEIsMkNBQ0ssT0FDaUI7QUFDcEIsc0JBQW9CO0FBRXBCLFNBQU87QUFDVDtBQU5zQiIsCiAgIm5hbWVzIjogW10KfQo=
