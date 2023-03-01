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
var themeChanged_exports = {};
__export(themeChanged_exports, {
  themeChanged: () => themeChanged
});
module.exports = __toCommonJS(themeChanged_exports);
var import_getThemeType = require("../util/getThemeType");
function themeChanged() {
  if (window.reduxActions && window.reduxActions.user) {
    const theme = (0, import_getThemeType.getThemeType)();
    window.reduxActions.user.userChanged({ theme });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  themeChanged
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidGhlbWVDaGFuZ2VkLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgZ2V0VGhlbWVUeXBlIH0gZnJvbSAnLi4vdXRpbC9nZXRUaGVtZVR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gdGhlbWVDaGFuZ2VkKCk6IHZvaWQge1xuICBpZiAod2luZG93LnJlZHV4QWN0aW9ucyAmJiB3aW5kb3cucmVkdXhBY3Rpb25zLnVzZXIpIHtcbiAgICBjb25zdCB0aGVtZSA9IGdldFRoZW1lVHlwZSgpO1xuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMudXNlci51c2VyQ2hhbmdlZCh7IHRoZW1lIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsMEJBQTZCO0FBRXRCLHdCQUE4QjtBQUNuQyxNQUFJLE9BQU8sZ0JBQWdCLE9BQU8sYUFBYSxNQUFNO0FBQ25ELFVBQU0sUUFBUSxzQ0FBYTtBQUMzQixXQUFPLGFBQWEsS0FBSyxZQUFZLEVBQUUsTUFBTSxDQUFDO0FBQUEsRUFDaEQ7QUFDRjtBQUxnQiIsCiAgIm5hbWVzIjogW10KfQo=
