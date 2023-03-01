var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_shims = require("../shims");
var import_react = __toESM(require("react"));
var import_react_dom = __toESM(require("react-dom"));
var import_electron = require("electron");
var import_context = require("../context");
var import_DebugLogWindow = require("../../components/DebugLogWindow");
var debugLog = __toESM(require("../../logging/debuglogs"));
var import_uploadDebugLog = require("../../logging/uploadDebugLog");
var logger = __toESM(require("../../logging/log"));
import_electron.contextBridge.exposeInMainWorld("SignalContext", {
  ...import_context.SignalContext,
  renderWindow: () => {
    const environmentText = [import_context.SignalContext.getEnvironment()];
    const appInstance = import_context.SignalContext.getAppInstance();
    if (appInstance) {
      environmentText.push(appInstance);
    }
    import_react_dom.default.render(import_react.default.createElement(import_DebugLogWindow.DebugLogWindow, {
      hasCustomTitleBar: import_context.SignalContext.OS.hasCustomTitleBar(),
      executeMenuRole: import_context.SignalContext.executeMenuRole,
      closeWindow: () => import_context.SignalContext.executeMenuRole("close"),
      downloadLog: (logText) => import_electron.ipcRenderer.send("show-debug-log-save-dialog", logText),
      i18n: import_context.SignalContext.i18n,
      fetchLogs() {
        return debugLog.fetch(import_context.SignalContext.getNodeVersion(), import_context.SignalContext.getVersion());
      },
      uploadLogs(logs) {
        return (0, import_uploadDebugLog.upload)({
          content: logs,
          appVersion: import_context.SignalContext.getVersion(),
          logger
        });
      }
    }), document.getElementById("app"));
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJlbG9hZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8vIFRoaXMgaGFzIHRvIGJlIHRoZSBmaXJzdCBpbXBvcnQgYmVjYXVzZSBvZiBtb25rZXktcGF0Y2hpbmdcbmltcG9ydCAnLi4vc2hpbXMnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHsgU2lnbmFsQ29udGV4dCB9IGZyb20gJy4uL2NvbnRleHQnO1xuaW1wb3J0IHsgRGVidWdMb2dXaW5kb3cgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0RlYnVnTG9nV2luZG93JztcbmltcG9ydCAqIGFzIGRlYnVnTG9nIGZyb20gJy4uLy4uL2xvZ2dpbmcvZGVidWdsb2dzJztcbmltcG9ydCB7IHVwbG9hZCB9IGZyb20gJy4uLy4uL2xvZ2dpbmcvdXBsb2FkRGVidWdMb2cnO1xuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nJztcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnU2lnbmFsQ29udGV4dCcsIHtcbiAgLi4uU2lnbmFsQ29udGV4dCxcbiAgcmVuZGVyV2luZG93OiAoKSA9PiB7XG4gICAgY29uc3QgZW52aXJvbm1lbnRUZXh0OiBBcnJheTxzdHJpbmc+ID0gW1NpZ25hbENvbnRleHQuZ2V0RW52aXJvbm1lbnQoKV07XG5cbiAgICBjb25zdCBhcHBJbnN0YW5jZSA9IFNpZ25hbENvbnRleHQuZ2V0QXBwSW5zdGFuY2UoKTtcbiAgICBpZiAoYXBwSW5zdGFuY2UpIHtcbiAgICAgIGVudmlyb25tZW50VGV4dC5wdXNoKGFwcEluc3RhbmNlKTtcbiAgICB9XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERlYnVnTG9nV2luZG93LCB7XG4gICAgICAgIGhhc0N1c3RvbVRpdGxlQmFyOiBTaWduYWxDb250ZXh0Lk9TLmhhc0N1c3RvbVRpdGxlQmFyKCksXG4gICAgICAgIGV4ZWN1dGVNZW51Um9sZTogU2lnbmFsQ29udGV4dC5leGVjdXRlTWVudVJvbGUsXG4gICAgICAgIGNsb3NlV2luZG93OiAoKSA9PiBTaWduYWxDb250ZXh0LmV4ZWN1dGVNZW51Um9sZSgnY2xvc2UnKSxcbiAgICAgICAgZG93bmxvYWRMb2c6IChsb2dUZXh0OiBzdHJpbmcpID0+XG4gICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnc2hvdy1kZWJ1Zy1sb2ctc2F2ZS1kaWFsb2cnLCBsb2dUZXh0KSxcbiAgICAgICAgaTE4bjogU2lnbmFsQ29udGV4dC5pMThuLFxuICAgICAgICBmZXRjaExvZ3MoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlYnVnTG9nLmZldGNoKFxuICAgICAgICAgICAgU2lnbmFsQ29udGV4dC5nZXROb2RlVmVyc2lvbigpLFxuICAgICAgICAgICAgU2lnbmFsQ29udGV4dC5nZXRWZXJzaW9uKClcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB1cGxvYWRMb2dzKGxvZ3M6IHN0cmluZykge1xuICAgICAgICAgIHJldHVybiB1cGxvYWQoe1xuICAgICAgICAgICAgY29udGVudDogbG9ncyxcbiAgICAgICAgICAgIGFwcFZlcnNpb246IFNpZ25hbENvbnRleHQuZ2V0VmVyc2lvbigpLFxuICAgICAgICAgICAgbG9nZ2VyLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcbiAgICApO1xuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSxtQkFBTztBQUVQLG1CQUFrQjtBQUNsQix1QkFBcUI7QUFDckIsc0JBQTJDO0FBRTNDLHFCQUE4QjtBQUM5Qiw0QkFBK0I7QUFDL0IsZUFBMEI7QUFDMUIsNEJBQXVCO0FBQ3ZCLGFBQXdCO0FBRXhCLDhCQUFjLGtCQUFrQixpQkFBaUI7QUFBQSxLQUM1QztBQUFBLEVBQ0gsY0FBYyxNQUFNO0FBQ2xCLFVBQU0sa0JBQWlDLENBQUMsNkJBQWMsZUFBZSxDQUFDO0FBRXRFLFVBQU0sY0FBYyw2QkFBYyxlQUFlO0FBQ2pELFFBQUksYUFBYTtBQUNmLHNCQUFnQixLQUFLLFdBQVc7QUFBQSxJQUNsQztBQUVBLDZCQUFTLE9BQ1AscUJBQU0sY0FBYyxzQ0FBZ0I7QUFBQSxNQUNsQyxtQkFBbUIsNkJBQWMsR0FBRyxrQkFBa0I7QUFBQSxNQUN0RCxpQkFBaUIsNkJBQWM7QUFBQSxNQUMvQixhQUFhLE1BQU0sNkJBQWMsZ0JBQWdCLE9BQU87QUFBQSxNQUN4RCxhQUFhLENBQUMsWUFDWiw0QkFBWSxLQUFLLDhCQUE4QixPQUFPO0FBQUEsTUFDeEQsTUFBTSw2QkFBYztBQUFBLE1BQ3BCLFlBQVk7QUFDVixlQUFPLFNBQVMsTUFDZCw2QkFBYyxlQUFlLEdBQzdCLDZCQUFjLFdBQVcsQ0FDM0I7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXLE1BQWM7QUFDdkIsZUFBTyxrQ0FBTztBQUFBLFVBQ1osU0FBUztBQUFBLFVBQ1QsWUFBWSw2QkFBYyxXQUFXO0FBQUEsVUFDckM7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDLEdBQ0QsU0FBUyxlQUFlLEtBQUssQ0FDL0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
