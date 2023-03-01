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
var ErrorBoundary_exports = {};
__export(ErrorBoundary_exports, {
  ErrorBoundary: () => ErrorBoundary
});
module.exports = __toCommonJS(ErrorBoundary_exports);
var import_react = __toESM(require("react"));
var Errors = __toESM(require("../types/errors"));
var log = __toESM(require("../logging/log"));
var import_toast = require("../state/ducks/toast");
class ErrorBoundary extends import_react.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: void 0 };
  }
  static getDerivedStateFromError(error) {
    log.error("ErrorBoundary: captured rendering error", Errors.toLogFormat(error));
    if (window.reduxActions) {
      window.reduxActions.toast.showToast(import_toast.ToastType.Error);
    }
    return { error };
  }
  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return null;
    }
    return children;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorBoundary
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRXJyb3JCb3VuZGFyeS50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBUb2FzdFR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy90b2FzdCc7XG5cbmV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xufTtcblxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XG4gIGVycm9yPzogRXJyb3I7XG59O1xuXG5leHBvcnQgY2xhc3MgRXJyb3JCb3VuZGFyeSBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IGVycm9yOiB1bmRlZmluZWQgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKGVycm9yOiBFcnJvcik6IFN0YXRlIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICAnRXJyb3JCb3VuZGFyeTogY2FwdHVyZWQgcmVuZGVyaW5nIGVycm9yJyxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuICAgIGlmICh3aW5kb3cucmVkdXhBY3Rpb25zKSB7XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLnRvYXN0LnNob3dUb2FzdChUb2FzdFR5cGUuRXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4geyBlcnJvciB9O1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIHJlbmRlcigpOiBSZWFjdE5vZGUge1xuICAgIGNvbnN0IHsgZXJyb3IgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtCO0FBRWxCLGFBQXdCO0FBQ3hCLFVBQXFCO0FBQ3JCLG1CQUEwQjtBQVVuQixNQUFNLHNCQUFzQixxQkFBTSxjQUE0QjtBQUFBLEVBQ25FLFlBQVksT0FBYztBQUN4QixVQUFNLEtBQUs7QUFFWCxTQUFLLFFBQVEsRUFBRSxPQUFPLE9BQVU7QUFBQSxFQUNsQztBQUFBLFNBRWMseUJBQXlCLE9BQXFCO0FBQzFELFFBQUksTUFDRiwyQ0FDQSxPQUFPLFlBQVksS0FBSyxDQUMxQjtBQUNBLFFBQUksT0FBTyxjQUFjO0FBQ3ZCLGFBQU8sYUFBYSxNQUFNLFVBQVUsdUJBQVUsS0FBSztBQUFBLElBQ3JEO0FBQ0EsV0FBTyxFQUFFLE1BQU07QUFBQSxFQUNqQjtBQUFBLEVBRWdCLFNBQW9CO0FBQ2xDLFVBQU0sRUFBRSxVQUFVLEtBQUs7QUFDdkIsVUFBTSxFQUFFLGFBQWEsS0FBSztBQUUxQixRQUFJLE9BQU87QUFDVCxhQUFPO0FBQUEsSUFDVDtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUE1Qk8iLAogICJuYW1lcyI6IFtdCn0K
