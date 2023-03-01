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
var StandaloneRegistration_exports = {};
__export(StandaloneRegistration_exports, {
  StandaloneRegistration: () => StandaloneRegistration
});
module.exports = __toCommonJS(StandaloneRegistration_exports);
var import_react = __toESM(require("react"));
var import_intl_tel_input = __toESM(require("intl-tel-input"));
var import_assert = require("../util/assert");
var import_libphonenumberUtil = require("../util/libphonenumberUtil");
var import_challenge = require("../challenge");
const PhoneInput = /* @__PURE__ */ __name(({
  onValidation,
  onNumberChange
}) => {
  const [isValid, setIsValid] = (0, import_react.useState)(false);
  const pluginRef = (0, import_react.useRef)();
  const elemRef = (0, import_react.useRef)(null);
  const onRef = (0, import_react.useCallback)((elem) => {
    elemRef.current = elem;
    if (!elem) {
      return;
    }
    pluginRef.current?.destroy();
    const plugin = (0, import_intl_tel_input.default)(elem);
    pluginRef.current = plugin;
  }, []);
  const validateNumber = (0, import_react.useCallback)((number) => {
    const { current: plugin } = pluginRef;
    if (!plugin) {
      return;
    }
    const regionCode = plugin.getSelectedCountryData().iso2;
    const parsedNumber = (0, import_libphonenumberUtil.parseNumber)(number, regionCode);
    setIsValid(parsedNumber.isValidNumber);
    onValidation(parsedNumber.isValidNumber);
    onNumberChange(parsedNumber.isValidNumber ? parsedNumber.e164 : void 0);
  }, [setIsValid, onNumberChange, onValidation]);
  const onChange = (0, import_react.useCallback)((_) => {
    if (elemRef.current) {
      validateNumber(elemRef.current.value);
    }
  }, [validateNumber]);
  const onKeyDown = (0, import_react.useCallback)((event) => {
    if (event.target instanceof HTMLInputElement) {
      validateNumber(event.target.value);
    }
  }, [validateNumber]);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "phone-input"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "phone-input-form"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: `number-container ${isValid ? "valid" : "invalid"}`
  }, /* @__PURE__ */ import_react.default.createElement("input", {
    className: "number",
    type: "tel",
    ref: onRef,
    onChange,
    onKeyDown,
    placeholder: "Phone Number"
  }))));
}, "PhoneInput");
const StandaloneRegistration = /* @__PURE__ */ __name(({
  onComplete,
  requestVerification,
  registerSingleDevice
}) => {
  (0, import_react.useEffect)(() => {
    window.readyForUpdates();
  }, []);
  const [isValidNumber, setIsValidNumber] = (0, import_react.useState)(false);
  const [isValidCode, setIsValidCode] = (0, import_react.useState)(false);
  const [number, setNumber] = (0, import_react.useState)(void 0);
  const [code, setCode] = (0, import_react.useState)("");
  const [error, setError] = (0, import_react.useState)(void 0);
  const [status, setStatus] = (0, import_react.useState)(void 0);
  const onRequestCode = (0, import_react.useCallback)(async (type) => {
    if (!isValidNumber) {
      return;
    }
    if (!number) {
      setIsValidNumber(false);
      setError(void 0);
      return;
    }
    document.location.href = (0, import_challenge.getChallengeURL)();
    if (!window.Signal.challengeHandler) {
      setError("Captcha handler is not ready!");
      return;
    }
    const token = await window.Signal.challengeHandler.requestCaptcha();
    try {
      requestVerification(type, number, token);
      setError(void 0);
    } catch (err) {
      setError(err.message);
    }
  }, [isValidNumber, setIsValidNumber, setError, requestVerification, number]);
  const onSMSClick = (0, import_react.useCallback)((e) => {
    e.preventDefault();
    e.stopPropagation();
    onRequestCode("sms");
  }, [onRequestCode]);
  const onVoiceClick = (0, import_react.useCallback)((e) => {
    e.preventDefault();
    e.stopPropagation();
    onRequestCode("voice");
  }, [onRequestCode]);
  const onChangeCode = (0, import_react.useCallback)((event) => {
    const { value } = event.target;
    setIsValidCode(value.length === 6);
    setCode(value);
  }, [setIsValidCode, setCode]);
  const onVerifyCode = (0, import_react.useCallback)(async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isValidNumber || !isValidCode) {
      return;
    }
    (0, import_assert.strictAssert)(number && code, "Missing number or code");
    try {
      await registerSingleDevice(number, code);
      onComplete();
    } catch (err) {
      setStatus(err.message);
    }
  }, [
    registerSingleDevice,
    onComplete,
    number,
    code,
    setStatus,
    isValidNumber,
    isValidCode
  ]);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: "full-screen-flow"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "module-title-bar-drag-area"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "step"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "inner"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "step-body"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "banner-image module-splash-screen__logo module-img--128"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "header"
  }, "Create your Signal Account"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "phone-input-form"
  }, /* @__PURE__ */ import_react.default.createElement(PhoneInput, {
    onValidation: setIsValidNumber,
    onNumberChange: setNumber
  }))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "clearfix"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: "button",
    disabled: !isValidNumber,
    onClick: onSMSClick
  }, "Send SMS"), /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: "link",
    tabIndex: -1,
    disabled: !isValidNumber,
    onClick: onVoiceClick
  }, "Call")), /* @__PURE__ */ import_react.default.createElement("input", {
    className: `form-control ${isValidCode ? "valid" : "invalid"}`,
    type: "text",
    pattern: "\\s*[0-9]{3}-?[0-9]{3}\\s*",
    title: "Enter your 6-digit verification code. If you did not receive a code, click Call or Send SMS to request a new one",
    placeholder: "Verification Code",
    autoComplete: "off",
    value: code,
    onChange: onChangeCode
  }), /* @__PURE__ */ import_react.default.createElement("div", null, error), /* @__PURE__ */ import_react.default.createElement("div", null, status)), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "nav"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    className: "button",
    disabled: !isValidNumber || !isValidCode,
    onClick: onVerifyCode
  }, "Register")))));
}, "StandaloneRegistration");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StandaloneRegistration
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RhbmRhbG9uZVJlZ2lzdHJhdGlvbi50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IENoYW5nZUV2ZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrLCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ2ludGwtdGVsLWlucHV0JztcbmltcG9ydCBpbnRsVGVsSW5wdXQgZnJvbSAnaW50bC10ZWwtaW5wdXQnO1xuXG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBwYXJzZU51bWJlciB9IGZyb20gJy4uL3V0aWwvbGlicGhvbmVudW1iZXJVdGlsJztcbmltcG9ydCB7IGdldENoYWxsZW5nZVVSTCB9IGZyb20gJy4uL2NoYWxsZW5nZSc7XG5cbmNvbnN0IFBob25lSW5wdXQgPSAoe1xuICBvblZhbGlkYXRpb24sXG4gIG9uTnVtYmVyQ2hhbmdlLFxufToge1xuICBvblZhbGlkYXRpb246IChpc1ZhbGlkOiBib29sZWFuKSA9PiB2b2lkO1xuICBvbk51bWJlckNoYW5nZTogKG51bWJlcj86IHN0cmluZykgPT4gdm9pZDtcbn0pOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IFtpc1ZhbGlkLCBzZXRJc1ZhbGlkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgcGx1Z2luUmVmID0gdXNlUmVmPFBsdWdpbiB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgZWxlbVJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50IHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3Qgb25SZWYgPSB1c2VDYWxsYmFjaygoZWxlbTogSFRNTElucHV0RWxlbWVudCB8IG51bGwpID0+IHtcbiAgICBlbGVtUmVmLmN1cnJlbnQgPSBlbGVtO1xuXG4gICAgaWYgKCFlbGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGx1Z2luUmVmLmN1cnJlbnQ/LmRlc3Ryb3koKTtcblxuICAgIGNvbnN0IHBsdWdpbiA9IGludGxUZWxJbnB1dChlbGVtKTtcbiAgICBwbHVnaW5SZWYuY3VycmVudCA9IHBsdWdpbjtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHZhbGlkYXRlTnVtYmVyID0gdXNlQ2FsbGJhY2soXG4gICAgKG51bWJlcjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IHBsdWdpbiB9ID0gcGx1Z2luUmVmO1xuICAgICAgaWYgKCFwbHVnaW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWdpb25Db2RlID0gcGx1Z2luLmdldFNlbGVjdGVkQ291bnRyeURhdGEoKS5pc28yO1xuXG4gICAgICBjb25zdCBwYXJzZWROdW1iZXIgPSBwYXJzZU51bWJlcihudW1iZXIsIHJlZ2lvbkNvZGUpO1xuXG4gICAgICBzZXRJc1ZhbGlkKHBhcnNlZE51bWJlci5pc1ZhbGlkTnVtYmVyKTtcbiAgICAgIG9uVmFsaWRhdGlvbihwYXJzZWROdW1iZXIuaXNWYWxpZE51bWJlcik7XG5cbiAgICAgIG9uTnVtYmVyQ2hhbmdlKFxuICAgICAgICBwYXJzZWROdW1iZXIuaXNWYWxpZE51bWJlciA/IHBhcnNlZE51bWJlci5lMTY0IDogdW5kZWZpbmVkXG4gICAgICApO1xuICAgIH0sXG4gICAgW3NldElzVmFsaWQsIG9uTnVtYmVyQ2hhbmdlLCBvblZhbGlkYXRpb25dXG4gICk7XG5cbiAgY29uc3Qgb25DaGFuZ2UgPSB1c2VDYWxsYmFjayhcbiAgICAoXzogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgIGlmIChlbGVtUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgdmFsaWRhdGVOdW1iZXIoZWxlbVJlZi5jdXJyZW50LnZhbHVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFt2YWxpZGF0ZU51bWJlcl1cbiAgKTtcblxuICBjb25zdCBvbktleURvd24gPSB1c2VDYWxsYmFjayhcbiAgICAoZXZlbnQ6IFJlYWN0LktleWJvYXJkRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgIC8vIFBhY2lmeSBUeXBlU2NyaXB0IGFuZCBoYW5kbGUgZXZlbnRzIGJ1YmJsaW5nIHVwXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICB2YWxpZGF0ZU51bWJlcihldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3ZhbGlkYXRlTnVtYmVyXVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwaG9uZS1pbnB1dFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwaG9uZS1pbnB1dC1mb3JtXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbnVtYmVyLWNvbnRhaW5lciAke2lzVmFsaWQgPyAndmFsaWQnIDogJ2ludmFsaWQnfWB9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibnVtYmVyXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZWxcIlxuICAgICAgICAgICAgcmVmPXtvblJlZn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAgIG9uS2V5RG93bj17b25LZXlEb3dufVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQaG9uZSBOdW1iZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgU3RhbmRhbG9uZVJlZ2lzdHJhdGlvbiA9ICh7XG4gIG9uQ29tcGxldGUsXG4gIHJlcXVlc3RWZXJpZmljYXRpb24sXG4gIHJlZ2lzdGVyU2luZ2xlRGV2aWNlLFxufToge1xuICBvbkNvbXBsZXRlOiAoKSA9PiB2b2lkO1xuICByZXF1ZXN0VmVyaWZpY2F0aW9uOiAoXG4gICAgdHlwZTogJ3NtcycgfCAndm9pY2UnLFxuICAgIG51bWJlcjogc3RyaW5nLFxuICAgIHRva2VuOiBzdHJpbmdcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZWdpc3RlclNpbmdsZURldmljZTogKG51bWJlcjogc3RyaW5nLCBjb2RlOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59KTogSlNYLkVsZW1lbnQgPT4ge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5yZWFkeUZvclVwZGF0ZXMoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IFtpc1ZhbGlkTnVtYmVyLCBzZXRJc1ZhbGlkTnVtYmVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzVmFsaWRDb2RlLCBzZXRJc1ZhbGlkQ29kZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtudW1iZXIsIHNldE51bWJlcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIGNvbnN0IFtjb2RlLCBzZXRDb2RlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIGNvbnN0IFtzdGF0dXMsIHNldFN0YXR1c10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgY29uc3Qgb25SZXF1ZXN0Q29kZSA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh0eXBlOiAnc21zJyB8ICd2b2ljZScpID0+IHtcbiAgICAgIGlmICghaXNWYWxpZE51bWJlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghbnVtYmVyKSB7XG4gICAgICAgIHNldElzVmFsaWROdW1iZXIoZmFsc2UpO1xuICAgICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBnZXRDaGFsbGVuZ2VVUkwoKTtcbiAgICAgIGlmICghd2luZG93LlNpZ25hbC5jaGFsbGVuZ2VIYW5kbGVyKSB7XG4gICAgICAgIHNldEVycm9yKCdDYXB0Y2hhIGhhbmRsZXIgaXMgbm90IHJlYWR5IScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5TaWduYWwuY2hhbGxlbmdlSGFuZGxlci5yZXF1ZXN0Q2FwdGNoYSgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0VmVyaWZpY2F0aW9uKHR5cGUsIG51bWJlciwgdG9rZW4pO1xuICAgICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtpc1ZhbGlkTnVtYmVyLCBzZXRJc1ZhbGlkTnVtYmVyLCBzZXRFcnJvciwgcmVxdWVzdFZlcmlmaWNhdGlvbiwgbnVtYmVyXVxuICApO1xuXG4gIGNvbnN0IG9uU01TQ2xpY2sgPSB1c2VDYWxsYmFjayhcbiAgICAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQnV0dG9uRWxlbWVudD4pID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIG9uUmVxdWVzdENvZGUoJ3NtcycpO1xuICAgIH0sXG4gICAgW29uUmVxdWVzdENvZGVdXG4gICk7XG5cbiAgY29uc3Qgb25Wb2ljZUNsaWNrID0gdXNlQ2FsbGJhY2soXG4gICAgKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBvblJlcXVlc3RDb2RlKCd2b2ljZScpO1xuICAgIH0sXG4gICAgW29uUmVxdWVzdENvZGVdXG4gICk7XG5cbiAgY29uc3Qgb25DaGFuZ2VDb2RlID0gdXNlQ2FsbGJhY2soXG4gICAgKGV2ZW50OiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICBzZXRJc1ZhbGlkQ29kZSh2YWx1ZS5sZW5ndGggPT09IDYpO1xuICAgICAgc2V0Q29kZSh2YWx1ZSk7XG4gICAgfSxcbiAgICBbc2V0SXNWYWxpZENvZGUsIHNldENvZGVdXG4gICk7XG5cbiAgY29uc3Qgb25WZXJpZnlDb2RlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoIWlzVmFsaWROdW1iZXIgfHwgIWlzVmFsaWRDb2RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3RyaWN0QXNzZXJ0KG51bWJlciAmJiBjb2RlLCAnTWlzc2luZyBudW1iZXIgb3IgY29kZScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCByZWdpc3RlclNpbmdsZURldmljZShudW1iZXIsIGNvZGUpO1xuICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc2V0U3RhdHVzKGVyci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtcbiAgICAgIHJlZ2lzdGVyU2luZ2xlRGV2aWNlLFxuICAgICAgb25Db21wbGV0ZSxcbiAgICAgIG51bWJlcixcbiAgICAgIGNvZGUsXG4gICAgICBzZXRTdGF0dXMsXG4gICAgICBpc1ZhbGlkTnVtYmVyLFxuICAgICAgaXNWYWxpZENvZGUsXG4gICAgXVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmdWxsLXNjcmVlbi1mbG93XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS10aXRsZS1iYXItZHJhZy1hcmVhXCIgLz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGVwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0ZXAtYm9keVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiYW5uZXItaW1hZ2UgbW9kdWxlLXNwbGFzaC1zY3JlZW5fX2xvZ28gbW9kdWxlLWltZy0tMTI4XCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+Q3JlYXRlIHlvdXIgU2lnbmFsIEFjY291bnQ8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGhvbmUtaW5wdXQtZm9ybVwiPlxuICAgICAgICAgICAgICAgIDxQaG9uZUlucHV0XG4gICAgICAgICAgICAgICAgICBvblZhbGlkYXRpb249e3NldElzVmFsaWROdW1iZXJ9XG4gICAgICAgICAgICAgICAgICBvbk51bWJlckNoYW5nZT17c2V0TnVtYmVyfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNWYWxpZE51bWJlcn1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvblNNU0NsaWNrfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgU2VuZCBTTVNcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsaW5rXCJcbiAgICAgICAgICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFpc1ZhbGlkTnVtYmVyfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uVm9pY2VDbGlja31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIENhbGxcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2Bmb3JtLWNvbnRyb2wgJHtpc1ZhbGlkQ29kZSA/ICd2YWxpZCcgOiAnaW52YWxpZCd9YH1cbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICBwYXR0ZXJuPVwiXFxzKlswLTldezN9LT9bMC05XXszfVxccypcIlxuICAgICAgICAgICAgICB0aXRsZT1cIkVudGVyIHlvdXIgNi1kaWdpdCB2ZXJpZmljYXRpb24gY29kZS4gSWYgeW91IGRpZCBub3QgcmVjZWl2ZSBhIGNvZGUsIGNsaWNrIENhbGwgb3IgU2VuZCBTTVMgdG8gcmVxdWVzdCBhIG5ldyBvbmVcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlZlcmlmaWNhdGlvbiBDb2RlXCJcbiAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICAgICAgICAgdmFsdWU9e2NvZGV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZUNvZGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdj57ZXJyb3J9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2PntzdGF0dXN9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXshaXNWYWxpZE51bWJlciB8fCAhaXNWYWxpZENvZGV9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uVmVyaWZ5Q29kZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgUmVnaXN0ZXJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBZ0U7QUFFaEUsNEJBQXlCO0FBRXpCLG9CQUE2QjtBQUM3QixnQ0FBNEI7QUFDNUIsdUJBQWdDO0FBRWhDLE1BQU0sYUFBYSx3QkFBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQTtBQUFBLE1BSWlCO0FBQ2pCLFFBQU0sQ0FBQyxTQUFTLGNBQWMsMkJBQVMsS0FBSztBQUM1QyxRQUFNLFlBQVkseUJBQTJCO0FBQzdDLFFBQU0sVUFBVSx5QkFBZ0MsSUFBSTtBQUVwRCxRQUFNLFFBQVEsOEJBQVksQ0FBQyxTQUFrQztBQUMzRCxZQUFRLFVBQVU7QUFFbEIsUUFBSSxDQUFDLE1BQU07QUFDVDtBQUFBLElBQ0Y7QUFFQSxjQUFVLFNBQVMsUUFBUTtBQUUzQixVQUFNLFNBQVMsbUNBQWEsSUFBSTtBQUNoQyxjQUFVLFVBQVU7QUFBQSxFQUN0QixHQUFHLENBQUMsQ0FBQztBQUVMLFFBQU0saUJBQWlCLDhCQUNyQixDQUFDLFdBQW1CO0FB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
