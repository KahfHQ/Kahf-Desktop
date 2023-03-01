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
var global_errors_exports = {};
__export(global_errors_exports, {
  addHandler: () => addHandler,
  updateLocale: () => updateLocale
});
module.exports = __toCommonJS(global_errors_exports);
var import_electron = require("electron");
var Errors = __toESM(require("../ts/types/errors"));
var import_privacy = require("../ts/util/privacy");
var import_reallyJsonStringify = require("../ts/util/reallyJsonStringify");
let quitText = "Quit";
let copyErrorAndQuitText = "Copy error and quit";
function handleError(prefix, error) {
  if (console._error) {
    console._error(`${prefix}:`, Errors.toLogFormat(error));
  }
  console.error(`${prefix}:`, Errors.toLogFormat(error));
  if (import_electron.app.isReady()) {
    const buttonIndex = import_electron.dialog.showMessageBoxSync({
      buttons: [quitText, copyErrorAndQuitText],
      defaultId: 0,
      detail: (0, import_privacy.redactAll)(error.stack || ""),
      message: prefix,
      noLink: true,
      type: "error"
    });
    if (buttonIndex === 1) {
      import_electron.clipboard.writeText(`${prefix}

${(0, import_privacy.redactAll)(error.stack || "")}`);
    }
  } else {
    import_electron.dialog.showErrorBox(prefix, error.stack || "");
  }
  import_electron.app.exit(1);
}
const updateLocale = /* @__PURE__ */ __name((messages) => {
  quitText = messages.quit.message;
  copyErrorAndQuitText = messages.copyErrorAndQuit.message;
}, "updateLocale");
function _getError(reason) {
  if (reason instanceof Error) {
    return reason;
  }
  const errorString = (0, import_reallyJsonStringify.reallyJsonStringify)(reason);
  return new Error(`Promise rejected with a non-error: ${errorString}`);
}
const addHandler = /* @__PURE__ */ __name(() => {
  import_electron.app.on("render-process-gone", (_event, _webContents, details) => {
    const { reason, exitCode } = details;
    if (reason === "clean-exit") {
      return;
    }
    handleError("Render process is gone", new Error(`Reason: ${reason}, Exit Code: ${exitCode}`));
  });
  process.on("uncaughtException", (reason) => {
    handleError("Unhandled Error", _getError(reason));
  });
  process.on("unhandledRejection", (reason) => {
    handleError("Unhandled Promise Rejection", _getError(reason));
  });
}, "addHandler");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addHandler,
  updateLocale
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2xvYmFsX2Vycm9ycy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMCBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFwcCwgZGlhbG9nLCBjbGlwYm9hcmQgfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90cy90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgcmVkYWN0QWxsIH0gZnJvbSAnLi4vdHMvdXRpbC9wcml2YWN5JztcbmltcG9ydCB0eXBlIHsgTG9jYWxlTWVzc2FnZXNUeXBlIH0gZnJvbSAnLi4vdHMvdHlwZXMvSTE4Tic7XG5pbXBvcnQgeyByZWFsbHlKc29uU3RyaW5naWZ5IH0gZnJvbSAnLi4vdHMvdXRpbC9yZWFsbHlKc29uU3RyaW5naWZ5JztcblxuLy8gV2UgdXNlIGhhcmQtY29kZWQgc3RyaW5ncyB1bnRpbCB3ZSdyZSBhYmxlIHRvIHVwZGF0ZSB0aGVzZSBzdHJpbmdzIGZyb20gdGhlIGxvY2FsZS5cbmxldCBxdWl0VGV4dCA9ICdRdWl0JztcbmxldCBjb3B5RXJyb3JBbmRRdWl0VGV4dCA9ICdDb3B5IGVycm9yIGFuZCBxdWl0JztcblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IocHJlZml4OiBzdHJpbmcsIGVycm9yOiBFcnJvcik6IHZvaWQge1xuICBpZiAoY29uc29sZS5fZXJyb3IpIHtcbiAgICBjb25zb2xlLl9lcnJvcihgJHtwcmVmaXh9OmAsIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcikpO1xuICB9XG4gIGNvbnNvbGUuZXJyb3IoYCR7cHJlZml4fTpgLCBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpKTtcblxuICBpZiAoYXBwLmlzUmVhZHkoKSkge1xuICAgIC8vIHRpdGxlIGZpZWxkIGlzIG5vdCBzaG93biBvbiBtYWNPUywgc28gd2UgZG9uJ3QgdXNlIGl0XG4gICAgY29uc3QgYnV0dG9uSW5kZXggPSBkaWFsb2cuc2hvd01lc3NhZ2VCb3hTeW5jKHtcbiAgICAgIGJ1dHRvbnM6IFtxdWl0VGV4dCwgY29weUVycm9yQW5kUXVpdFRleHRdLFxuICAgICAgZGVmYXVsdElkOiAwLFxuICAgICAgZGV0YWlsOiByZWRhY3RBbGwoZXJyb3Iuc3RhY2sgfHwgJycpLFxuICAgICAgbWVzc2FnZTogcHJlZml4LFxuICAgICAgbm9MaW5rOiB0cnVlLFxuICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICB9KTtcblxuICAgIGlmIChidXR0b25JbmRleCA9PT0gMSkge1xuICAgICAgY2xpcGJvYXJkLndyaXRlVGV4dChgJHtwcmVmaXh9XFxuXFxuJHtyZWRhY3RBbGwoZXJyb3Iuc3RhY2sgfHwgJycpfWApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkaWFsb2cuc2hvd0Vycm9yQm94KHByZWZpeCwgZXJyb3Iuc3RhY2sgfHwgJycpO1xuICB9XG5cbiAgYXBwLmV4aXQoMSk7XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVMb2NhbGUgPSAobWVzc2FnZXM6IExvY2FsZU1lc3NhZ2VzVHlwZSk6IHZvaWQgPT4ge1xuICBxdWl0VGV4dCA9IG1lc3NhZ2VzLnF1aXQubWVzc2FnZTtcbiAgY29weUVycm9yQW5kUXVpdFRleHQgPSBtZXNzYWdlcy5jb3B5RXJyb3JBbmRRdWl0Lm1lc3NhZ2U7XG59O1xuXG5mdW5jdGlvbiBfZ2V0RXJyb3IocmVhc29uOiB1bmtub3duKTogRXJyb3Ige1xuICBpZiAocmVhc29uIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gcmVhc29uO1xuICB9XG5cbiAgY29uc3QgZXJyb3JTdHJpbmcgPSByZWFsbHlKc29uU3RyaW5naWZ5KHJlYXNvbik7XG4gIHJldHVybiBuZXcgRXJyb3IoYFByb21pc2UgcmVqZWN0ZWQgd2l0aCBhIG5vbi1lcnJvcjogJHtlcnJvclN0cmluZ31gKTtcbn1cblxuZXhwb3J0IGNvbnN0IGFkZEhhbmRsZXIgPSAoKTogdm9pZCA9PiB7XG4gIGFwcC5vbigncmVuZGVyLXByb2Nlc3MtZ29uZScsIChfZXZlbnQsIF93ZWJDb250ZW50cywgZGV0YWlscykgPT4ge1xuICAgIGNvbnN0IHsgcmVhc29uLCBleGl0Q29kZSB9ID0gZGV0YWlscztcblxuICAgIGlmIChyZWFzb24gPT09ICdjbGVhbi1leGl0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKFxuICAgICAgJ1JlbmRlciBwcm9jZXNzIGlzIGdvbmUnLFxuICAgICAgbmV3IEVycm9yKGBSZWFzb246ICR7cmVhc29ufSwgRXhpdCBDb2RlOiAke2V4aXRDb2RlfWApXG4gICAgKTtcbiAgfSk7XG5cbiAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCAocmVhc29uOiB1bmtub3duKSA9PiB7XG4gICAgaGFuZGxlRXJyb3IoJ1VuaGFuZGxlZCBFcnJvcicsIF9nZXRFcnJvcihyZWFzb24pKTtcbiAgfSk7XG5cbiAgcHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbjogdW5rbm93bikgPT4ge1xuICAgIGhhbmRsZUVycm9yKCdVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb24nLCBfZ2V0RXJyb3IocmVhc29uKSk7XG4gIH0pO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUF1QztBQUV2QyxhQUF3QjtBQUN4QixxQkFBMEI7QUFFMUIsaUNBQW9DO0FBR3BDLElBQUksV0FBVztBQUNmLElBQUksdUJBQXVCO0FBRTNCLHFCQUFxQixRQUFnQixPQUFvQjtBQUN2RCxNQUFJLFFBQVEsUUFBUTtBQUNsQixZQUFRLE9BQU8sR0FBRyxXQUFXLE9BQU8sWUFBWSxLQUFLLENBQUM7QUFBQSxFQUN4RDtBQUNBLFVBQVEsTUFBTSxHQUFHLFdBQVcsT0FBTyxZQUFZLEtBQUssQ0FBQztBQUVyRCxNQUFJLG9CQUFJLFFBQVEsR0FBRztBQUVqQixVQUFNLGNBQWMsdUJBQU8sbUJBQW1CO0FBQUEsTUFDNUMsU0FBUyxDQUFDLFVBQVUsb0JBQW9CO0FBQUEsTUFDeEMsV0FBVztBQUFBLE1BQ1gsUUFBUSw4QkFBVSxNQUFNLFNBQVMsRUFBRTtBQUFBLE1BQ25DLFNBQVM7QUFBQSxNQUNULFFBQVE7QUFBQSxNQUNSLE1BQU07QUFBQSxJQUNSLENBQUM7QUFFRCxRQUFJLGdCQUFnQixHQUFHO0FBQ3JCLGdDQUFVLFVBQVUsR0FBRztBQUFBO0FBQUEsRUFBYSw4QkFBVSxNQUFNLFNBQVMsRUFBRSxHQUFHO0FBQUEsSUFDcEU7QUFBQSxFQUNGLE9BQU87QUFDTCwyQkFBTyxhQUFhLFFBQVEsTUFBTSxTQUFTLEVBQUU7QUFBQSxFQUMvQztBQUVBLHNCQUFJLEtBQUssQ0FBQztBQUNaO0FBekJTLEFBMkJGLE1BQU0sZUFBZSx3QkFBQyxhQUF1QztBQUNsRSxhQUFXLFNBQVMsS0FBSztBQUN6Qix5QkFBdUIsU0FBUyxpQkFBaUI7QUFDbkQsR0FINEI7QUFLNUIsbUJBQW1CLFFBQXdCO0FBQ3pDLE1BQUksa0JBQWtCLE9BQU87QUFDM0IsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLGNBQWMsb0RBQW9CLE1BQU07QUFDOUMsU0FBTyxJQUFJLE1BQU0sc0NBQXNDLGFBQWE7QUFDdEU7QUFQUyxBQVNGLE1BQU0sYUFBYSw2QkFBWTtBQUNwQyxzQkFBSSxHQUFHLHVCQUF1QixDQUFDLFFBQVEsY0FBYyxZQUFZO0FBQy9ELFVBQU0sRUFBRSxRQUFRLGFBQWE7QUFFN0IsUUFBSSxXQUFXLGNBQWM7QUFDM0I7QUFBQSxJQUNGO0FBRUEsZ0JBQ0UsMEJBQ0EsSUFBSSxNQUFNLFdBQVcsc0JBQXNCLFVBQVUsQ0FDdkQ7QUFBQSxFQUNGLENBQUM7QUFFRCxVQUFRLEdBQUcscUJBQXFCLENBQUMsV0FBb0I7QUFDbkQsZ0JBQVksbUJBQW1CLFVBQVUsTUFBTSxDQUFDO0FBQUEsRUFDbEQsQ0FBQztBQUVELFVBQVEsR0FBRyxzQkFBc0IsQ0FBQyxXQUFvQjtBQUNwRCxnQkFBWSwrQkFBK0IsVUFBVSxNQUFNLENBQUM7QUFBQSxFQUM5RCxDQUFDO0FBQ0gsR0FyQjBCOyIsCiAgIm5hbWVzIjogW10KfQo=
