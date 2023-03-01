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
var DebugLogWindow_exports = {};
__export(DebugLogWindow_exports, {
  DebugLogWindow: () => DebugLogWindow
});
module.exports = __toCommonJS(DebugLogWindow_exports);
var import_react = __toESM(require("react"));
var import_copy_text_to_clipboard = __toESM(require("copy-text-to-clipboard"));
var log = __toESM(require("../logging/log"));
var import_Button = require("./Button");
var import_Spinner = require("./Spinner");
var import_ToastDebugLogError = require("./ToastDebugLogError");
var import_ToastLinkCopied = require("./ToastLinkCopied");
var import_TitleBarContainer = require("./TitleBarContainer");
var import_ToastLoadingFullLogs = require("./ToastLoadingFullLogs");
var import_openLinkInWebBrowser = require("../util/openLinkInWebBrowser");
var import_createSupportUrl = require("../util/createSupportUrl");
var import_useEscapeHandling = require("../hooks/useEscapeHandling");
var import_useTheme = require("../hooks/useTheme");
var LoadState = /* @__PURE__ */ ((LoadState2) => {
  LoadState2[LoadState2["NotStarted"] = 0] = "NotStarted";
  LoadState2[LoadState2["Started"] = 1] = "Started";
  LoadState2[LoadState2["Loaded"] = 2] = "Loaded";
  LoadState2[LoadState2["Submitting"] = 3] = "Submitting";
  return LoadState2;
})(LoadState || {});
var ToastType = /* @__PURE__ */ ((ToastType2) => {
  ToastType2[ToastType2["Copied"] = 0] = "Copied";
  ToastType2[ToastType2["Error"] = 1] = "Error";
  ToastType2[ToastType2["Loading"] = 2] = "Loading";
  return ToastType2;
})(ToastType || {});
const DebugLogWindow = /* @__PURE__ */ __name(({
  closeWindow,
  downloadLog,
  i18n,
  fetchLogs,
  uploadLogs,
  hasCustomTitleBar,
  executeMenuRole
}) => {
  const [loadState, setLoadState] = (0, import_react.useState)(0 /* NotStarted */);
  const [logText, setLogText] = (0, import_react.useState)();
  const [publicLogURL, setPublicLogURL] = (0, import_react.useState)();
  const [textAreaValue, setTextAreaValue] = (0, import_react.useState)(i18n("loading"));
  const [toastType, setToastType] = (0, import_react.useState)();
  const theme = (0, import_useTheme.useTheme)();
  (0, import_useEscapeHandling.useEscapeHandling)(closeWindow);
  (0, import_react.useEffect)(() => {
    setLoadState(1 /* Started */);
    let shouldCancel = false;
    async function doFetchLogs() {
      const fetchedLogText = await fetchLogs();
      if (shouldCancel) {
        return;
      }
      setToastType(2 /* Loading */);
      setLogText(fetchedLogText);
      setLoadState(2 /* Loaded */);
      const linesToShow = Math.ceil(Math.min(window.innerHeight, 2e3) / 5);
      const value = fetchedLogText.split(/\n/g, linesToShow).join("\n");
      setTextAreaValue(`${value}


${i18n("debugLogLogIsIncomplete")}`);
      setToastType(void 0);
    }
    doFetchLogs();
    return () => {
      shouldCancel = true;
    };
  }, [fetchLogs, i18n]);
  const handleSubmit = /* @__PURE__ */ __name(async (ev) => {
    ev.preventDefault();
    const text = logText;
    if (!text || text.length === 0) {
      return;
    }
    setLoadState(3 /* Submitting */);
    try {
      const publishedLogURL = await uploadLogs(text);
      setPublicLogURL(publishedLogURL);
    } catch (error) {
      log.error("DebugLogWindow error:", error && error.stack ? error.stack : error);
      setLoadState(2 /* Loaded */);
      setToastType(1 /* Error */);
    }
  }, "handleSubmit");
  function closeToast() {
    setToastType(void 0);
  }
  let toastElement;
  if (toastType === 2 /* Loading */) {
    toastElement = /* @__PURE__ */ import_react.default.createElement(import_ToastLoadingFullLogs.ToastLoadingFullLogs, {
      i18n,
      onClose: closeToast
    });
  } else if (toastType === 0 /* Copied */) {
    toastElement = /* @__PURE__ */ import_react.default.createElement(import_ToastLinkCopied.ToastLinkCopied, {
      i18n,
      onClose: closeToast
    });
  } else if (toastType === 1 /* Error */) {
    toastElement = /* @__PURE__ */ import_react.default.createElement(import_ToastDebugLogError.ToastDebugLogError, {
      i18n,
      onClose: closeToast
    });
  }
  if (publicLogURL) {
    const copyLog = /* @__PURE__ */ __name((ev) => {
      ev.preventDefault();
      (0, import_copy_text_to_clipboard.default)(publicLogURL);
      setToastType(0 /* Copied */);
    }, "copyLog");
    const supportURL = (0, import_createSupportUrl.createSupportUrl)({
      locale: i18n.getLocale(),
      query: {
        debugLog: publicLogURL
      }
    });
    return /* @__PURE__ */ import_react.default.createElement(import_TitleBarContainer.TitleBarContainer, {
      hasCustomTitleBar,
      theme,
      executeMenuRole
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "DebugLogWindow"
    }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "DebugLogWindow__title"
    }, i18n("debugLogSuccess")), /* @__PURE__ */ import_react.default.createElement("p", {
      className: "DebugLogWindow__subtitle"
    }, i18n("debugLogSuccessNextSteps"))), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "DebugLogWindow__container"
    }, /* @__PURE__ */ import_react.default.createElement("input", {
      className: "DebugLogWindow__link",
      readOnly: true,
      type: "text",
      value: publicLogURL
    })), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "DebugLogWindow__footer"
    }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: () => (0, import_openLinkInWebBrowser.openLinkInWebBrowser)(supportURL),
      variant: import_Button.ButtonVariant.Secondary
    }, i18n("reportIssue")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: copyLog
    }, i18n("debugLogCopy"))), toastElement));
  }
  const canSubmit = Boolean(logText) && loadState !== 3 /* Submitting */;
  const canSave = Boolean(logText);
  const isLoading = loadState === 1 /* Started */ || loadState === 3 /* Submitting */;
  return /* @__PURE__ */ import_react.default.createElement(import_TitleBarContainer.TitleBarContainer, {
    hasCustomTitleBar,
    theme,
    executeMenuRole
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "DebugLogWindow"
  }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "DebugLogWindow__title"
  }, i18n("submitDebugLog")), /* @__PURE__ */ import_react.default.createElement("p", {
    className: "DebugLogWindow__subtitle"
  }, i18n("debugLogExplanation"))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "DebugLogWindow__container"
  }, isLoading ? /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
    svgSize: "normal"
  }) : /* @__PURE__ */ import_react.default.createElement("textarea", {
    className: "DebugLogWindow__textarea",
    readOnly: true,
    rows: 5,
    spellCheck: false,
    value: textAreaValue
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "DebugLogWindow__footer"
  }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    disabled: !canSave,
    onClick: () => {
      if (logText) {
        downloadLog(logText);
      }
    },
    variant: import_Button.ButtonVariant.Secondary
  }, i18n("debugLogSave")), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    disabled: !canSubmit,
    onClick: handleSubmit
  }, i18n("submit"))), toastElement));
}, "DebugLogWindow");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DebugLogWindow
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRGVidWdMb2dXaW5kb3cudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNS0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNb3VzZUV2ZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY29weVRleHQgZnJvbSAnY29weS10ZXh0LXRvLWNsaXBib2FyZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25WYXJpYW50IH0gZnJvbSAnLi9CdXR0b24nO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSAnLi9TcGlubmVyJztcbmltcG9ydCB7IFRvYXN0RGVidWdMb2dFcnJvciB9IGZyb20gJy4vVG9hc3REZWJ1Z0xvZ0Vycm9yJztcbmltcG9ydCB7IFRvYXN0TGlua0NvcGllZCB9IGZyb20gJy4vVG9hc3RMaW5rQ29waWVkJztcbmltcG9ydCB7IFRpdGxlQmFyQ29udGFpbmVyIH0gZnJvbSAnLi9UaXRsZUJhckNvbnRhaW5lcic7XG5pbXBvcnQgdHlwZSB7IEV4ZWN1dGVNZW51Um9sZVR5cGUgfSBmcm9tICcuL1RpdGxlQmFyQ29udGFpbmVyJztcbmltcG9ydCB7IFRvYXN0TG9hZGluZ0Z1bGxMb2dzIH0gZnJvbSAnLi9Ub2FzdExvYWRpbmdGdWxsTG9ncyc7XG5pbXBvcnQgeyBvcGVuTGlua0luV2ViQnJvd3NlciB9IGZyb20gJy4uL3V0aWwvb3BlbkxpbmtJbldlYkJyb3dzZXInO1xuaW1wb3J0IHsgY3JlYXRlU3VwcG9ydFVybCB9IGZyb20gJy4uL3V0aWwvY3JlYXRlU3VwcG9ydFVybCc7XG5pbXBvcnQgeyB1c2VFc2NhcGVIYW5kbGluZyB9IGZyb20gJy4uL2hvb2tzL3VzZUVzY2FwZUhhbmRsaW5nJztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnLi4vaG9va3MvdXNlVGhlbWUnO1xuXG5lbnVtIExvYWRTdGF0ZSB7XG4gIE5vdFN0YXJ0ZWQsXG4gIFN0YXJ0ZWQsXG4gIExvYWRlZCxcbiAgU3VibWl0dGluZyxcbn1cblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBjbG9zZVdpbmRvdzogKCkgPT4gdW5rbm93bjtcbiAgZG93bmxvYWRMb2c6ICh0ZXh0OiBzdHJpbmcpID0+IHVua25vd247XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIGZldGNoTG9nczogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICB1cGxvYWRMb2dzOiAobG9nczogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIGhhc0N1c3RvbVRpdGxlQmFyOiBib29sZWFuO1xuICBleGVjdXRlTWVudVJvbGU6IEV4ZWN1dGVNZW51Um9sZVR5cGU7XG59O1xuXG5lbnVtIFRvYXN0VHlwZSB7XG4gIENvcGllZCxcbiAgRXJyb3IsXG4gIExvYWRpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBEZWJ1Z0xvZ1dpbmRvdyA9ICh7XG4gIGNsb3NlV2luZG93LFxuICBkb3dubG9hZExvZyxcbiAgaTE4bixcbiAgZmV0Y2hMb2dzLFxuICB1cGxvYWRMb2dzLFxuICBoYXNDdXN0b21UaXRsZUJhcixcbiAgZXhlY3V0ZU1lbnVSb2xlLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbbG9hZFN0YXRlLCBzZXRMb2FkU3RhdGVdID0gdXNlU3RhdGU8TG9hZFN0YXRlPihMb2FkU3RhdGUuTm90U3RhcnRlZCk7XG4gIGNvbnN0IFtsb2dUZXh0LCBzZXRMb2dUZXh0XSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgW3B1YmxpY0xvZ1VSTCwgc2V0UHVibGljTG9nVVJMXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgW3RleHRBcmVhVmFsdWUsIHNldFRleHRBcmVhVmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nPihpMThuKCdsb2FkaW5nJykpO1xuICBjb25zdCBbdG9hc3RUeXBlLCBzZXRUb2FzdFR5cGVdID0gdXNlU3RhdGU8VG9hc3RUeXBlIHwgdW5kZWZpbmVkPigpO1xuXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICB1c2VFc2NhcGVIYW5kbGluZyhjbG9zZVdpbmRvdyk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRMb2FkU3RhdGUoTG9hZFN0YXRlLlN0YXJ0ZWQpO1xuXG4gICAgbGV0IHNob3VsZENhbmNlbCA9IGZhbHNlO1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaExvZ3MoKSB7XG4gICAgICBjb25zdCBmZXRjaGVkTG9nVGV4dCA9IGF3YWl0IGZldGNoTG9ncygpO1xuXG4gICAgICBpZiAoc2hvdWxkQ2FuY2VsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0VG9hc3RUeXBlKFRvYXN0VHlwZS5Mb2FkaW5nKTtcbiAgICAgIHNldExvZ1RleHQoZmV0Y2hlZExvZ1RleHQpO1xuICAgICAgc2V0TG9hZFN0YXRlKExvYWRTdGF0ZS5Mb2FkZWQpO1xuXG4gICAgICAvLyBUaGlzIG51bWJlciBpcyBzb21ld2hhdCBhcmJpdHJhcnk7IHdlIHdhbnQgdG8gc2hvdyBlbm91Z2ggdGhhdCBpdCdzXG4gICAgICAvLyBjbGVhciB0aGF0IHdlIG5lZWQgdG8gc2Nyb2xsLCBidXQgbm90IHNvIG1hbnkgdGhhdCB0aGluZ3MgZ2V0IHNsb3cuXG4gICAgICBjb25zdCBsaW5lc1RvU2hvdyA9IE1hdGguY2VpbChNYXRoLm1pbih3aW5kb3cuaW5uZXJIZWlnaHQsIDIwMDApIC8gNSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZldGNoZWRMb2dUZXh0LnNwbGl0KC9cXG4vZywgbGluZXNUb1Nob3cpLmpvaW4oJ1xcbicpO1xuXG4gICAgICBzZXRUZXh0QXJlYVZhbHVlKGAke3ZhbHVlfVxcblxcblxcbiR7aTE4bignZGVidWdMb2dMb2dJc0luY29tcGxldGUnKX1gKTtcbiAgICAgIHNldFRvYXN0VHlwZSh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGRvRmV0Y2hMb2dzKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc2hvdWxkQ2FuY2VsID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbZmV0Y2hMb2dzLCBpMThuXSk7XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHRleHQgPSBsb2dUZXh0O1xuXG4gICAgaWYgKCF0ZXh0IHx8IHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0TG9hZFN0YXRlKExvYWRTdGF0ZS5TdWJtaXR0aW5nKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwdWJsaXNoZWRMb2dVUkwgPSBhd2FpdCB1cGxvYWRMb2dzKHRleHQpO1xuICAgICAgc2V0UHVibGljTG9nVVJMKHB1Ymxpc2hlZExvZ1VSTCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ0RlYnVnTG9nV2luZG93IGVycm9yOicsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICAgIHNldExvYWRTdGF0ZShMb2FkU3RhdGUuTG9hZGVkKTtcbiAgICAgIHNldFRvYXN0VHlwZShUb2FzdFR5cGUuRXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjbG9zZVRvYXN0KCkge1xuICAgIHNldFRvYXN0VHlwZSh1bmRlZmluZWQpO1xuICB9XG5cbiAgbGV0IHRvYXN0RWxlbWVudDogSlNYLkVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGlmICh0b2FzdFR5cGUgPT09IFRvYXN0VHlwZS5Mb2FkaW5nKSB7XG4gICAgdG9hc3RFbGVtZW50ID0gPFRvYXN0TG9hZGluZ0Z1bGxMb2dzIGkxOG49e2kxOG59IG9uQ2xvc2U9e2Nsb3NlVG9hc3R9IC8+O1xuICB9IGVsc2UgaWYgKHRvYXN0VHlwZSA9PT0gVG9hc3RUeXBlLkNvcGllZCkge1xuICAgIHRvYXN0RWxlbWVudCA9IDxUb2FzdExpbmtDb3BpZWQgaTE4bj17aTE4bn0gb25DbG9zZT17Y2xvc2VUb2FzdH0gLz47XG4gIH0gZWxzZSBpZiAodG9hc3RUeXBlID09PSBUb2FzdFR5cGUuRXJyb3IpIHtcbiAgICB0b2FzdEVsZW1lbnQgPSA8VG9hc3REZWJ1Z0xvZ0Vycm9yIGkxOG49e2kxOG59IG9uQ2xvc2U9e2Nsb3NlVG9hc3R9IC8+O1xuICB9XG5cbiAgaWYgKHB1YmxpY0xvZ1VSTCkge1xuICAgIGNvbnN0IGNvcHlMb2cgPSAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb3B5VGV4dChwdWJsaWNMb2dVUkwpO1xuICAgICAgc2V0VG9hc3RUeXBlKFRvYXN0VHlwZS5Db3BpZWQpO1xuICAgIH07XG5cbiAgICBjb25zdCBzdXBwb3J0VVJMID0gY3JlYXRlU3VwcG9ydFVybCh7XG4gICAgICBsb2NhbGU6IGkxOG4uZ2V0TG9jYWxlKCksXG4gICAgICBxdWVyeToge1xuICAgICAgICBkZWJ1Z0xvZzogcHVibGljTG9nVVJMLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VGl0bGVCYXJDb250YWluZXJcbiAgICAgICAgaGFzQ3VzdG9tVGl0bGVCYXI9e2hhc0N1c3RvbVRpdGxlQmFyfVxuICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93XCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiRGVidWdMb2dXaW5kb3dfX3RpdGxlXCI+XG4gICAgICAgICAgICAgIHtpMThuKCdkZWJ1Z0xvZ1N1Y2Nlc3MnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiRGVidWdMb2dXaW5kb3dfX3N1YnRpdGxlXCI+XG4gICAgICAgICAgICAgIHtpMThuKCdkZWJ1Z0xvZ1N1Y2Nlc3NOZXh0U3RlcHMnKX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93X19jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJEZWJ1Z0xvZ1dpbmRvd19fbGlua1wiXG4gICAgICAgICAgICAgIHJlYWRPbmx5XG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3B1YmxpY0xvZ1VSTH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJEZWJ1Z0xvZ1dpbmRvd19fZm9vdGVyXCI+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9wZW5MaW5rSW5XZWJCcm93c2VyKHN1cHBvcnRVUkwpfVxuICAgICAgICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlNlY29uZGFyeX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2kxOG4oJ3JlcG9ydElzc3VlJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17Y29weUxvZ30+e2kxOG4oJ2RlYnVnTG9nQ29weScpfTwvQnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0b2FzdEVsZW1lbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaXRsZUJhckNvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgY2FuU3VibWl0ID0gQm9vbGVhbihsb2dUZXh0KSAmJiBsb2FkU3RhdGUgIT09IExvYWRTdGF0ZS5TdWJtaXR0aW5nO1xuICBjb25zdCBjYW5TYXZlID0gQm9vbGVhbihsb2dUZXh0KTtcbiAgY29uc3QgaXNMb2FkaW5nID1cbiAgICBsb2FkU3RhdGUgPT09IExvYWRTdGF0ZS5TdGFydGVkIHx8IGxvYWRTdGF0ZSA9PT0gTG9hZFN0YXRlLlN1Ym1pdHRpbmc7XG5cbiAgcmV0dXJuIChcbiAgICA8VGl0bGVCYXJDb250YWluZXJcbiAgICAgIGhhc0N1c3RvbVRpdGxlQmFyPXtoYXNDdXN0b21UaXRsZUJhcn1cbiAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgIGV4ZWN1dGVNZW51Um9sZT17ZXhlY3V0ZU1lbnVSb2xlfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiRGVidWdMb2dXaW5kb3dcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93X190aXRsZVwiPntpMThuKCdzdWJtaXREZWJ1Z0xvZycpfTwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93X19zdWJ0aXRsZVwiPlxuICAgICAgICAgICAge2kxOG4oJ2RlYnVnTG9nRXhwbGFuYXRpb24nKX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93X19jb250YWluZXJcIj5cbiAgICAgICAgICB7aXNMb2FkaW5nID8gKFxuICAgICAgICAgICAgPFNwaW5uZXIgc3ZnU2l6ZT1cIm5vcm1hbFwiIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJEZWJ1Z0xvZ1dpbmRvd19fdGV4dGFyZWFcIlxuICAgICAgICAgICAgICByZWFkT25seVxuICAgICAgICAgICAgICByb3dzPXs1fVxuICAgICAgICAgICAgICBzcGVsbENoZWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgdmFsdWU9e3RleHRBcmVhVmFsdWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkRlYnVnTG9nV2luZG93X19mb290ZXJcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblNhdmV9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChsb2dUZXh0KSB7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRMb2cobG9nVGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlNlY29uZGFyeX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aTE4bignZGVidWdMb2dTYXZlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiBkaXNhYmxlZD17IWNhblN1Ym1pdH0gb25DbGljaz17aGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgIHtpMThuKCdzdWJtaXQnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0b2FzdEVsZW1lbnR9XG4gICAgICA8L2Rpdj5cbiAgICA8L1RpdGxlQmFyQ29udGFpbmVyPlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBMkM7QUFDM0Msb0NBQXFCO0FBQ3JCLFVBQXFCO0FBQ3JCLG9CQUFzQztBQUV0QyxxQkFBd0I7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
