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
var getClassNamesFor_exports = {};
__export(getClassNamesFor_exports, {
  getClassNamesFor: () => getClassNamesFor
});
module.exports = __toCommonJS(getClassNamesFor_exports);
var import_classnames = __toESM(require("classnames"));
function getClassNamesFor(...modules) {
  return (modifier) => {
    if (modifier === void 0) {
      return "";
    }
    const cx = modules.flatMap((m) => m ? m.split(" ") : void 0).map((parentModule) => parentModule ? `${parentModule}${modifier}` : void 0);
    return (0, import_classnames.default)(cx);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getClassNamesFor
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0Q2xhc3NOYW1lc0Zvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzTmFtZXNGb3IoXG4gIC4uLm1vZHVsZXM6IEFycmF5PHN0cmluZyB8IHVuZGVmaW5lZD5cbik6IChtb2RpZmllcj86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgcmV0dXJuIG1vZGlmaWVyID0+IHtcbiAgICBpZiAobW9kaWZpZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IGN4ID0gbW9kdWxlc1xuICAgICAgLmZsYXRNYXAobSA9PiAobSA/IG0uc3BsaXQoJyAnKSA6IHVuZGVmaW5lZCkpXG4gICAgICAubWFwKHBhcmVudE1vZHVsZSA9PlxuICAgICAgICBwYXJlbnRNb2R1bGUgPyBgJHtwYXJlbnRNb2R1bGV9JHttb2RpZmllcn1gIDogdW5kZWZpbmVkXG4gICAgICApO1xuXG4gICAgcmV0dXJuIGNsYXNzTmFtZXMoY3gpO1xuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHdCQUF1QjtBQUVoQiw2QkFDRixTQUM0QjtBQUMvQixTQUFPLGNBQVk7QUFDakIsUUFBSSxhQUFhLFFBQVc7QUFDMUIsYUFBTztBQUFBLElBQ1Q7QUFFQSxVQUFNLEtBQUssUUFDUixRQUFRLE9BQU0sSUFBSSxFQUFFLE1BQU0sR0FBRyxJQUFJLE1BQVUsRUFDM0MsSUFBSSxrQkFDSCxlQUFlLEdBQUcsZUFBZSxhQUFhLE1BQ2hEO0FBRUYsV0FBTywrQkFBVyxFQUFFO0FBQUEsRUFDdEI7QUFDRjtBQWhCZ0IiLAogICJuYW1lcyI6IFtdCn0K
