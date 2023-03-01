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
var Checkbox_exports = {};
__export(Checkbox_exports, {
  Checkbox: () => Checkbox
});
module.exports = __toCommonJS(Checkbox_exports);
var import_react = __toESM(require("react"));
var import_uuid = require("uuid");
var import_getClassNamesFor = require("../util/getClassNamesFor");
const Checkbox = /* @__PURE__ */ __name(({
  checked,
  children,
  description,
  disabled,
  isRadio,
  label,
  moduleClassName,
  name,
  onChange,
  onClick
}) => {
  const getClassName = (0, import_getClassNamesFor.getClassNamesFor)("Checkbox", moduleClassName);
  const id = (0, import_react.useMemo)(() => `${name}::${(0, import_uuid.v4)()}`, [name]);
  const checkboxNode = /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__checkbox")
  }, /* @__PURE__ */ import_react.default.createElement("input", {
    checked: Boolean(checked),
    disabled,
    id,
    name,
    onChange: (ev) => onChange(ev.target.checked),
    onClick,
    type: isRadio ? "radio" : "checkbox"
  }));
  const labelNode = /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", {
    htmlFor: id
  }, /* @__PURE__ */ import_react.default.createElement("div", null, label), /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__description")
  }, description)));
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("")
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__container")
  }, children ? children({ id, checkboxNode, labelNode }) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, checkboxNode, labelNode)));
}, "Checkbox");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Checkbox
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ2hlY2tib3gudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuXG5pbXBvcnQgeyBnZXRDbGFzc05hbWVzRm9yIH0gZnJvbSAnLi4vdXRpbC9nZXRDbGFzc05hbWVzRm9yJztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBjaGVja2VkPzogYm9vbGVhbjtcbiAgY2hpbGRyZW4/OiAoY2hpbGRyZW5PcHRzOiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBjaGVja2JveE5vZGU6IEpTWC5FbGVtZW50O1xuICAgIGxhYmVsTm9kZTogSlNYLkVsZW1lbnQ7XG4gIH0pID0+IEpTWC5FbGVtZW50O1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICBpc1JhZGlvPzogYm9vbGVhbjtcbiAgbGFiZWw6IHN0cmluZztcbiAgbW9kdWxlQ2xhc3NOYW1lPzogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIG9uQ2hhbmdlOiAodmFsdWU6IGJvb2xlYW4pID0+IHVua25vd247XG4gIG9uQ2xpY2s/OiAoKSA9PiB1bmtub3duO1xufTtcblxuZXhwb3J0IGNvbnN0IENoZWNrYm94ID0gKHtcbiAgY2hlY2tlZCxcbiAgY2hpbGRyZW4sXG4gIGRlc2NyaXB0aW9uLFxuICBkaXNhYmxlZCxcbiAgaXNSYWRpbyxcbiAgbGFiZWwsXG4gIG1vZHVsZUNsYXNzTmFtZSxcbiAgbmFtZSxcbiAgb25DaGFuZ2UsXG4gIG9uQ2xpY2ssXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IGdldENsYXNzTmFtZSA9IGdldENsYXNzTmFtZXNGb3IoJ0NoZWNrYm94JywgbW9kdWxlQ2xhc3NOYW1lKTtcbiAgY29uc3QgaWQgPSB1c2VNZW1vKCgpID0+IGAke25hbWV9Ojoke3V1aWQoKX1gLCBbbmFtZV0pO1xuXG4gIGNvbnN0IGNoZWNrYm94Tm9kZSA9IChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Z2V0Q2xhc3NOYW1lKCdfX2NoZWNrYm94Jyl9PlxuICAgICAgPGlucHV0XG4gICAgICAgIGNoZWNrZWQ9e0Jvb2xlYW4oY2hlY2tlZCl9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICBvbkNoYW5nZT17ZXYgPT4gb25DaGFuZ2UoZXYudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICB0eXBlPXtpc1JhZGlvID8gJ3JhZGlvJyA6ICdjaGVja2JveCd9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xuXG4gIGNvbnN0IGxhYmVsTm9kZSA9IChcbiAgICA8ZGl2PlxuICAgICAgPGxhYmVsIGh0bWxGb3I9e2lkfT5cbiAgICAgICAgPGRpdj57bGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19fZGVzY3JpcHRpb24nKX0+e2Rlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgPC9sYWJlbD5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJycpfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19fY29udGFpbmVyJyl9PlxuICAgICAgICB7Y2hpbGRyZW4gPyAoXG4gICAgICAgICAgY2hpbGRyZW4oeyBpZCwgY2hlY2tib3hOb2RlLCBsYWJlbE5vZGUgfSlcbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAge2NoZWNrYm94Tm9kZX1cbiAgICAgICAgICAgIHtsYWJlbE5vZGV9XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQStCO0FBQy9CLGtCQUEyQjtBQUUzQiw4QkFBaUM7QUFtQjFCLE1BQU0sV0FBVyx3QkFBQztBQUFBLEVBQ3ZCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDNEI7QUFDNUIsUUFBTSxlQUFlLDhDQUFpQixZQUFZLGVBQWU7QUFDakUsUUFBTSxLQUFLLDBCQUFRLE1BQU0sR0FBRyxTQUFTLG9CQUFLLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFFckQsUUFBTSxlQUNKLG1EQUFDO0FBQUEsSUFBSSxXQUFXLGFBQWEsWUFBWTtBQUFBLEtBQ3ZDLG1EQUFDO0FBQUEsSUFDQyxTQUFTLFFBQVEsT0FBTztBQUFBLElBQ3hCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLFVBQVUsUUFBTSxTQUFTLEdBQUcsT0FBTyxPQUFPO0FBQUEsSUFDMUM7QUFBQSxJQUNBLE1BQU0sVUFBVSxVQUFVO0FBQUEsR0FDNUIsQ0FDRjtBQUdGLFFBQU0sWUFDSixtREFBQyxhQUNDLG1EQUFDO0FBQUEsSUFBTSxTQUFTO0FBQUEsS0FDZCxtREFBQyxhQUFLLEtBQU0sR0FDWixtREFBQztBQUFBLElBQUksV0FBVyxhQUFhLGVBQWU7QUFBQSxLQUFJLFdBQVksQ0FDOUQsQ0FDRjtBQUdGLFNBQ0UsbURBQUM7QUFBQSxJQUFJLFdBQVcsYUFBYSxFQUFFO0FBQUEsS0FDN0IsbURBQUM7QUFBQSxJQUFJLFdBQVcsYUFBYSxhQUFhO0FBQUEsS0FDdkMsV0FDQyxTQUFTLEVBQUUsSUFBSSxjQUFjLFVBQVUsQ0FBQyxJQUV4Qyx3RkFDRyxjQUNBLFNBQ0gsQ0FFSixDQUNGO0FBRUosR0FwRHdCOyIsCiAgIm5hbWVzIjogW10KfQo=
