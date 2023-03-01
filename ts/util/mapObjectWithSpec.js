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
var mapObjectWithSpec_exports = {};
__export(mapObjectWithSpec_exports, {
  mapObjectWithSpec: () => mapObjectWithSpec
});
module.exports = __toCommonJS(mapObjectWithSpec_exports);
var import_lodash = require("lodash");
function mapObjectWithSpec(spec, data, map, target = (0, import_lodash.cloneDeep)(data)) {
  if (!data) {
    return target;
  }
  if (typeof spec === "string") {
    const value = (0, import_lodash.get)(data, spec);
    if (value) {
      (0, import_lodash.set)(target, spec, map(value));
    }
    return target;
  }
  if ("isMap" in spec) {
    for (const key of Object.keys(data)) {
      target[key] = mapObjectWithSpec(spec.valueSpec, data[key], map, target[key]);
    }
    return target;
  }
  if ("key" in spec) {
    target[spec.key] = mapObjectWithSpec(spec.valueSpec, data[spec.key], map, target[spec.key]);
    return target;
  }
  for (const key of spec) {
    mapObjectWithSpec(key, data, map, target);
  }
  return target;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapObjectWithSpec
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFwT2JqZWN0V2l0aFNwZWMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cblxuaW1wb3J0IHsgY2xvbmVEZWVwLCBnZXQsIHNldCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCB0eXBlIE9iamVjdE1hcHBpbmdTcGVjVHlwZSA9XG4gIHwgc3RyaW5nXG4gIHwgUmVhZG9ubHlBcnJheTxPYmplY3RNYXBwaW5nU3BlY1R5cGU+XG4gIHwgUmVhZG9ubHk8e1xuICAgICAga2V5OiBzdHJpbmc7XG4gICAgICB2YWx1ZVNwZWM6IE9iamVjdE1hcHBpbmdTcGVjVHlwZTtcbiAgICB9PlxuICB8IFJlYWRvbmx5PHtcbiAgICAgIGlzTWFwOiB0cnVlO1xuICAgICAgdmFsdWVTcGVjOiBPYmplY3RNYXBwaW5nU3BlY1R5cGU7XG4gICAgfT47XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYmplY3RXaXRoU3BlYzxJbnB1dCwgT3V0cHV0PihcbiAgc3BlYzogT2JqZWN0TWFwcGluZ1NwZWNUeXBlLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LW1vZHVsZS1ib3VuZGFyeS10eXBlc1xuICBkYXRhOiBhbnksXG4gIG1hcDogKHZhbHVlOiBJbnB1dCkgPT4gT3V0cHV0LFxuICB0YXJnZXQgPSBjbG9uZURlZXAoZGF0YSlcbik6IGFueSB7XG4gIGlmICghZGF0YSkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBpZiAodHlwZW9mIHNwZWMgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXQoZGF0YSwgc3BlYyk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHNldCh0YXJnZXQsIHNwZWMsIG1hcCh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgaWYgKCdpc01hcCcgaW4gc3BlYykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIHRhcmdldFtrZXldID0gbWFwT2JqZWN0V2l0aFNwZWMoXG4gICAgICAgIHNwZWMudmFsdWVTcGVjLFxuICAgICAgICBkYXRhW2tleV0sXG4gICAgICAgIG1hcCxcbiAgICAgICAgdGFyZ2V0W2tleV1cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBpZiAoJ2tleScgaW4gc3BlYykge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHRhcmdldFtzcGVjLmtleV0gPSBtYXBPYmplY3RXaXRoU3BlYyhcbiAgICAgIHNwZWMudmFsdWVTcGVjLFxuICAgICAgZGF0YVtzcGVjLmtleV0sXG4gICAgICBtYXAsXG4gICAgICB0YXJnZXRbc3BlYy5rZXldXG4gICAgKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgb2Ygc3BlYykge1xuICAgIG1hcE9iamVjdFdpdGhTcGVjKGtleSwgZGF0YSwgbWFwLCB0YXJnZXQpO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxvQkFBb0M7QUFjN0IsMkJBQ0wsTUFFQSxNQUNBLEtBQ0EsU0FBUyw2QkFBVSxJQUFJLEdBQ2xCO0FBQ0wsTUFBSSxDQUFDLE1BQU07QUFDVCxXQUFPO0FBQUEsRUFDVDtBQUVBLE1BQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsVUFBTSxRQUFRLHVCQUFJLE1BQU0sSUFBSTtBQUU1QixRQUFJLE9BQU87QUFDVCw2QkFBSSxRQUFRLE1BQU0sSUFBSSxLQUFLLENBQUM7QUFBQSxJQUM5QjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSxXQUFXLE1BQU07QUFDbkIsZUFBVyxPQUFPLE9BQU8sS0FBSyxJQUFJLEdBQUc7QUFFbkMsYUFBTyxPQUFPLGtCQUNaLEtBQUssV0FDTCxLQUFLLE1BQ0wsS0FDQSxPQUFPLElBQ1Q7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFJLFNBQVMsTUFBTTtBQUVqQixXQUFPLEtBQUssT0FBTyxrQkFDakIsS0FBSyxXQUNMLEtBQUssS0FBSyxNQUNWLEtBQ0EsT0FBTyxLQUFLLElBQ2Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLGFBQVcsT0FBTyxNQUFNO0FBQ3RCLHNCQUFrQixLQUFLLE1BQU0sS0FBSyxNQUFNO0FBQUEsRUFDMUM7QUFFQSxTQUFPO0FBQ1Q7QUFqRGdCIiwKICAibmFtZXMiOiBbXQp9Cg==
