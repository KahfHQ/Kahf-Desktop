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
var getThemeType_exports = {};
__export(getThemeType_exports, {
  getThemeType: () => getThemeType
});
module.exports = __toCommonJS(getThemeType_exports);
var import_Util = require("../types/Util");
function getThemeType() {
  const themeSetting = window.Events.getThemeSetting();
  if (themeSetting === "light") {
    return import_Util.ThemeType.light;
  }
  if (themeSetting === "dark") {
    return import_Util.ThemeType.dark;
  }
  return window.systemTheme;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getThemeType
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0VGhlbWVUeXBlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhlbWVUeXBlKCk6IFRoZW1lVHlwZSB7XG4gIGNvbnN0IHRoZW1lU2V0dGluZyA9IHdpbmRvdy5FdmVudHMuZ2V0VGhlbWVTZXR0aW5nKCk7XG5cbiAgaWYgKHRoZW1lU2V0dGluZyA9PT0gJ2xpZ2h0Jykge1xuICAgIHJldHVybiBUaGVtZVR5cGUubGlnaHQ7XG4gIH1cblxuICBpZiAodGhlbWVTZXR0aW5nID09PSAnZGFyaycpIHtcbiAgICByZXR1cm4gVGhlbWVUeXBlLmRhcms7XG4gIH1cblxuICByZXR1cm4gd2luZG93LnN5c3RlbVRoZW1lO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLGtCQUEwQjtBQUVuQix3QkFBbUM7QUFDeEMsUUFBTSxlQUFlLE9BQU8sT0FBTyxnQkFBZ0I7QUFFbkQsTUFBSSxpQkFBaUIsU0FBUztBQUM1QixXQUFPLHNCQUFVO0FBQUEsRUFDbkI7QUFFQSxNQUFJLGlCQUFpQixRQUFRO0FBQzNCLFdBQU8sc0JBQVU7QUFBQSxFQUNuQjtBQUVBLFNBQU8sT0FBTztBQUNoQjtBQVpnQiIsCiAgIm5hbWVzIjogW10KfQo=
