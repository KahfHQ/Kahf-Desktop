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
var TitleBarContainer_exports = {};
__export(TitleBarContainer_exports, {
  TitleBarContainer: () => TitleBarContainer
});
module.exports = __toCommonJS(TitleBarContainer_exports);
var import_react = __toESM(require("react"));
var import_frameless_titlebar = __toESM(require("@indutny/frameless-titlebar"));
var import_classnames = __toESM(require("classnames"));
var import_menu = require("../../app/menu");
var import_Util = require("../types/Util");
var import_useIsWindowActive = require("../hooks/useIsWindowActive");
const TITLEBAR_HEIGHT = 28;
const ROLE_TO_ACCELERATOR = /* @__PURE__ */ new Map();
ROLE_TO_ACCELERATOR.set("undo", "CmdOrCtrl+Z");
ROLE_TO_ACCELERATOR.set("redo", "CmdOrCtrl+Y");
ROLE_TO_ACCELERATOR.set("cut", "CmdOrCtrl+X");
ROLE_TO_ACCELERATOR.set("copy", "CmdOrCtrl+C");
ROLE_TO_ACCELERATOR.set("paste", "CmdOrCtrl+V");
ROLE_TO_ACCELERATOR.set("pasteAndMatchStyle", "CmdOrCtrl+Shift+V");
ROLE_TO_ACCELERATOR.set("selectAll", "CmdOrCtrl+A");
ROLE_TO_ACCELERATOR.set("resetZoom", "CmdOrCtrl+0");
ROLE_TO_ACCELERATOR.set("zoomIn", "CmdOrCtrl+=");
ROLE_TO_ACCELERATOR.set("zoomOut", "CmdOrCtrl+-");
ROLE_TO_ACCELERATOR.set("togglefullscreen", "F11");
ROLE_TO_ACCELERATOR.set("toggleDevTools", "CmdOrCtrl+Shift+I");
ROLE_TO_ACCELERATOR.set("minimize", "CmdOrCtrl+M");
function convertMenu(menuList, executeMenuRole, localeMessages) {
  return menuList.map((item) => {
    const {
      type,
      label,
      accelerator: originalAccelerator,
      click: originalClick,
      submenu: originalSubmenu,
      role
    } = item;
    let submenu;
    if (Array.isArray(originalSubmenu)) {
      submenu = convertMenu(originalSubmenu, executeMenuRole, localeMessages);
    } else if (originalSubmenu) {
      throw new Error("Non-array submenu is not supported");
    }
    let click;
    if (originalClick) {
      if (role) {
        throw new Error(`Menu item: ${label} has both click and role`);
      }
      click = originalClick;
    } else if (role) {
      click = /* @__PURE__ */ __name(() => executeMenuRole(role), "click");
    }
    let accelerator;
    if (originalAccelerator) {
      accelerator = originalAccelerator.toString();
    } else if (role) {
      accelerator = ROLE_TO_ACCELERATOR.get(role);
    }
    accelerator = accelerator?.replace(/CommandOrControl|CmdOrCtrl/g, localeMessages["Keyboard--Key--ctrl"].message);
    accelerator = accelerator?.replace(/Shift/g, localeMessages["Keyboard--Key--shift"].message);
    return {
      type,
      label,
      accelerator,
      click,
      submenu
    };
  });
}
const TitleBarContainer = /* @__PURE__ */ __name((props) => {
  const {
    theme,
    isMaximized,
    isFullScreen,
    hasCustomTitleBar,
    hideMenuBar,
    executeMenuRole,
    titleBarDoubleClick,
    children,
    hasMenu,
    iconSrc = "images/icon_32.png"
  } = props;
  const isWindowActive = (0, import_useIsWindowActive.useIsWindowActive)();
  const titleBarTheme = (0, import_react.useMemo)(() => ({
    bar: {
      height: TITLEBAR_HEIGHT,
      palette: theme === import_Util.ThemeType.light ? "light" : "dark",
      ...theme === import_Util.ThemeType.dark ? {
        color: "#e9e9e9",
        background: "#2e2e2e",
        borderBottom: "1px solid #121212",
        button: {
          active: {
            color: "#e9e9e9",
            background: "#3b3b3b"
          },
          hover: {
            color: "#e9e9e9",
            background: "#3b3b3b"
          }
        }
      } : {}
    },
    menu: {
      overlay: {
        opacity: 0
      },
      autoHide: hideMenuBar,
      ...theme === import_Util.ThemeType.dark ? {
        separator: {
          color: "#5e5e5e"
        },
        accelerator: {
          color: "#b9b9b9"
        },
        list: {
          background: "#3b3b3b",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.12)",
          borderRadius: "0px 0px 6px 6px"
        }
      } : {
        list: {
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.12)",
          borderRadius: "0px 0px 6px 6px"
        }
      }
    },
    enableOverflow: false,
    scalingFunction(value) {
      return `calc(${value} * var(--zoom-factor))`;
    }
  }), [theme, hideMenuBar]);
  if (!hasCustomTitleBar) {
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, children);
  }
  let maybeMenu;
  if (hasMenu) {
    const { localeMessages, menuOptions, executeMenuAction } = props;
    const menuTemplate = (0, import_menu.createTemplate)({
      ...menuOptions,
      forceUpdate: () => executeMenuAction("forceUpdate"),
      openContactUs: () => executeMenuAction("openContactUs"),
      openForums: () => executeMenuAction("openForums"),
      openJoinTheBeta: () => executeMenuAction("openJoinTheBeta"),
      openReleaseNotes: () => executeMenuAction("openReleaseNotes"),
      openSupportPage: () => executeMenuAction("openSupportPage"),
      setupAsNewDevice: () => executeMenuAction("setupAsNewDevice"),
      setupAsStandalone: () => executeMenuAction("setupAsStandalone"),
      showAbout: () => executeMenuAction("showAbout"),
      showDebugLog: () => executeMenuAction("showDebugLog"),
      showKeyboardShortcuts: () => executeMenuAction("showKeyboardShortcuts"),
      showSettings: () => executeMenuAction("showSettings"),
      showStickerCreator: () => executeMenuAction("showStickerCreator"),
      showWindow: () => executeMenuAction("showWindow")
    }, localeMessages);
    maybeMenu = convertMenu(menuTemplate, executeMenuRole, localeMessages);
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("TitleBarContainer", isWindowActive ? "TitleBarContainer--active" : null, isFullScreen ? "TitleBarContainer--fullscreen" : null)
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TitleBarContainer__padding"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TitleBarContainer__content"
  }, children), !isFullScreen ? /* @__PURE__ */ import_react.default.createElement(import_frameless_titlebar.default, {
    className: "TitleBarContainer__title",
    platform: "win32",
    iconSrc,
    theme: titleBarTheme,
    maximized: isMaximized,
    menu: maybeMenu,
    onDoubleClick: titleBarDoubleClick,
    hideControls: true
  }) : null);
}, "TitleBarContainer");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TitleBarContainer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGl0bGVCYXJDb250YWluZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGl0bGVCYXIgZnJvbSAnQGluZHV0bnkvZnJhbWVsZXNzLXRpdGxlYmFyJztcbmltcG9ydCB0eXBlIHsgTWVudUl0ZW0gfSBmcm9tICdAaW5kdXRueS9mcmFtZWxlc3MtdGl0bGViYXInO1xuaW1wb3J0IHR5cGUgeyBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgeyBjcmVhdGVUZW1wbGF0ZSB9IGZyb20gJy4uLy4uL2FwcC9tZW51JztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGVNZXNzYWdlc1R5cGUgfSBmcm9tICcuLi90eXBlcy9JMThOJztcbmltcG9ydCB0eXBlIHsgTWVudU9wdGlvbnNUeXBlLCBNZW51QWN0aW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL21lbnUnO1xuaW1wb3J0IHsgdXNlSXNXaW5kb3dBY3RpdmUgfSBmcm9tICcuLi9ob29rcy91c2VJc1dpbmRvd0FjdGl2ZSc7XG5cbmV4cG9ydCB0eXBlIE1lbnVQcm9wc1R5cGUgPSBSZWFkb25seTx7XG4gIGhhc01lbnU6IHRydWU7XG4gIGxvY2FsZU1lc3NhZ2VzOiBMb2NhbGVNZXNzYWdlc1R5cGU7XG4gIG1lbnVPcHRpb25zOiBNZW51T3B0aW9uc1R5cGU7XG4gIGV4ZWN1dGVNZW51QWN0aW9uOiAoYWN0aW9uOiBNZW51QWN0aW9uVHlwZSkgPT4gdm9pZDtcbn0+O1xuXG5leHBvcnQgdHlwZSBFeGVjdXRlTWVudVJvbGVUeXBlID0gKFxuICByb2xlOiBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9uc1sncm9sZSddXG4pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IFJlYWRvbmx5PHtcbiAgdGhlbWU6IFRoZW1lVHlwZTtcbiAgaXNNYXhpbWl6ZWQ/OiBib29sZWFuO1xuICBpc0Z1bGxTY3JlZW4/OiBib29sZWFuO1xuICBoYXNDdXN0b21UaXRsZUJhcjogYm9vbGVhbjtcbiAgaGlkZU1lbnVCYXI/OiBib29sZWFuO1xuICBleGVjdXRlTWVudVJvbGU6IEV4ZWN1dGVNZW51Um9sZVR5cGU7XG4gIHRpdGxlQmFyRG91YmxlQ2xpY2s/OiAoKSA9PiB2b2lkO1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuXG4gIC8vIE5lZWRzIHRvIGJlIG92ZXJyaWRlbiBpbiBzdGlja2VyLWNyZWF0b3JcbiAgaWNvblNyYz86IHN0cmluZztcbn0+ICZcbiAgKE1lbnVQcm9wc1R5cGUgfCB7IGhhc01lbnU/OiBmYWxzZSB9KTtcblxuY29uc3QgVElUTEVCQVJfSEVJR0hUID0gMjg7XG5cbi8vIFdpbmRvd3Mgb25seVxuY29uc3QgUk9MRV9UT19BQ0NFTEVSQVRPUiA9IG5ldyBNYXA8XG4gIE1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zWydyb2xlJ10sXG4gIHN0cmluZ1xuPigpO1xuUk9MRV9UT19BQ0NFTEVSQVRPUi5zZXQoJ3VuZG8nLCAnQ21kT3JDdHJsK1onKTtcblJPTEVfVE9fQUNDRUxFUkFUT1Iuc2V0KCdyZWRvJywgJ0NtZE9yQ3RybCtZJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgnY3V0JywgJ0NtZE9yQ3RybCtYJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgnY29weScsICdDbWRPckN0cmwrQycpO1xuUk9MRV9UT19BQ0NFTEVSQVRPUi5zZXQoJ3Bhc3RlJywgJ0NtZE9yQ3RybCtWJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgncGFzdGVBbmRNYXRjaFN0eWxlJywgJ0NtZE9yQ3RybCtTaGlmdCtWJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgnc2VsZWN0QWxsJywgJ0NtZE9yQ3RybCtBJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgncmVzZXRab29tJywgJ0NtZE9yQ3RybCswJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgnem9vbUluJywgJ0NtZE9yQ3RybCs9Jyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgnem9vbU91dCcsICdDbWRPckN0cmwrLScpO1xuUk9MRV9UT19BQ0NFTEVSQVRPUi5zZXQoJ3RvZ2dsZWZ1bGxzY3JlZW4nLCAnRjExJyk7XG5ST0xFX1RPX0FDQ0VMRVJBVE9SLnNldCgndG9nZ2xlRGV2VG9vbHMnLCAnQ21kT3JDdHJsK1NoaWZ0K0knKTtcblJPTEVfVE9fQUNDRUxFUkFUT1Iuc2V0KCdtaW5pbWl6ZScsICdDbWRPckN0cmwrTScpO1xuXG5mdW5jdGlvbiBjb252ZXJ0TWVudShcbiAgbWVudUxpc3Q6IFJlYWRvbmx5QXJyYXk8TWVudUl0ZW1Db25zdHJ1Y3Rvck9wdGlvbnM+LFxuICBleGVjdXRlTWVudVJvbGU6IChyb2xlOiBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9uc1sncm9sZSddKSA9PiB2b2lkLFxuICBsb2NhbGVNZXNzYWdlczogTG9jYWxlTWVzc2FnZXNUeXBlXG4pOiBBcnJheTxNZW51SXRlbT4ge1xuICByZXR1cm4gbWVudUxpc3QubWFwKGl0ZW0gPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHR5cGUsXG4gICAgICBsYWJlbCxcbiAgICAgIGFjY2VsZXJhdG9yOiBvcmlnaW5hbEFjY2VsZXJhdG9yLFxuICAgICAgY2xpY2s6IG9yaWdpbmFsQ2xpY2ssXG4gICAgICBzdWJtZW51OiBvcmlnaW5hbFN1Ym1lbnUsXG4gICAgICByb2xlLFxuICAgIH0gPSBpdGVtO1xuICAgIGxldCBzdWJtZW51OiBBcnJheTxNZW51SXRlbT4gfCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcmlnaW5hbFN1Ym1lbnUpKSB7XG4gICAgICBzdWJtZW51ID0gY29udmVydE1lbnUob3JpZ2luYWxTdWJtZW51LCBleGVjdXRlTWVudVJvbGUsIGxvY2FsZU1lc3NhZ2VzKTtcbiAgICB9IGVsc2UgaWYgKG9yaWdpbmFsU3VibWVudSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb24tYXJyYXkgc3VibWVudSBpcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgfVxuXG4gICAgbGV0IGNsaWNrOiAoKCkgPT4gdW5rbm93bikgfCB1bmRlZmluZWQ7XG4gICAgaWYgKG9yaWdpbmFsQ2xpY2spIHtcbiAgICAgIGlmIChyb2xlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWVudSBpdGVtOiAke2xhYmVsfSBoYXMgYm90aCBjbGljayBhbmQgcm9sZWApO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBkb24ndCB1c2UgYXJndW1lbnRzIGluIGFwcC9tZW51LnRzXG4gICAgICBjbGljayA9IG9yaWdpbmFsQ2xpY2sgYXMgKCkgPT4gdW5rbm93bjtcbiAgICB9IGVsc2UgaWYgKHJvbGUpIHtcbiAgICAgIGNsaWNrID0gKCkgPT4gZXhlY3V0ZU1lbnVSb2xlKHJvbGUpO1xuICAgIH1cblxuICAgIGxldCBhY2NlbGVyYXRvcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmIChvcmlnaW5hbEFjY2VsZXJhdG9yKSB7XG4gICAgICBhY2NlbGVyYXRvciA9IG9yaWdpbmFsQWNjZWxlcmF0b3IudG9TdHJpbmcoKTtcbiAgICB9IGVsc2UgaWYgKHJvbGUpIHtcbiAgICAgIGFjY2VsZXJhdG9yID0gUk9MRV9UT19BQ0NFTEVSQVRPUi5nZXQocm9sZSk7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIHRpdGxlYmFyIGlzIHZpc2libGUgb25seSBvbiBXaW5kb3dzIGFuZCB0aGlzIHN0cmluZyBpcyB1c2VkIG9ubHlcbiAgICAvLyBpbiBVSS4gQWN0dWFsIGFjY2VsZXJhdG9yIGludGVyY2VwdGlvbiBpcyBoYW5kbGVkIGJ5IEVsZWN0cm9uIHRocm91Z2hcbiAgICAvLyBgYXBwL21haW4udHNgLlxuICAgIGFjY2VsZXJhdG9yID0gYWNjZWxlcmF0b3I/LnJlcGxhY2UoXG4gICAgICAvQ29tbWFuZE9yQ29udHJvbHxDbWRPckN0cmwvZyxcbiAgICAgIGxvY2FsZU1lc3NhZ2VzWydLZXlib2FyZC0tS2V5LS1jdHJsJ10ubWVzc2FnZVxuICAgICk7XG4gICAgYWNjZWxlcmF0b3IgPSBhY2NlbGVyYXRvcj8ucmVwbGFjZShcbiAgICAgIC9TaGlmdC9nLFxuICAgICAgbG9jYWxlTWVzc2FnZXNbJ0tleWJvYXJkLS1LZXktLXNoaWZ0J10ubWVzc2FnZVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZSxcbiAgICAgIGxhYmVsLFxuICAgICAgYWNjZWxlcmF0b3IsXG4gICAgICBjbGljayxcbiAgICAgIHN1Ym1lbnUsXG4gICAgfTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBUaXRsZUJhckNvbnRhaW5lciA9IChwcm9wczogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCB7XG4gICAgdGhlbWUsXG4gICAgaXNNYXhpbWl6ZWQsXG4gICAgaXNGdWxsU2NyZWVuLFxuICAgIGhhc0N1c3RvbVRpdGxlQmFyLFxuICAgIGhpZGVNZW51QmFyLFxuICAgIGV4ZWN1dGVNZW51Um9sZSxcbiAgICB0aXRsZUJhckRvdWJsZUNsaWNrLFxuICAgIGNoaWxkcmVuLFxuICAgIGhhc01lbnUsXG4gICAgaWNvblNyYyA9ICdpbWFnZXMvaWNvbl8zMi5wbmcnLFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgaXNXaW5kb3dBY3RpdmUgPSB1c2VJc1dpbmRvd0FjdGl2ZSgpO1xuXG4gIGNvbnN0IHRpdGxlQmFyVGhlbWUgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBiYXI6IHtcbiAgICAgICAgLy8gU2VlIHN0eWxlc2hlZXRzL19nbG9iYWwuc2Nzc1xuICAgICAgICBoZWlnaHQ6IFRJVExFQkFSX0hFSUdIVCxcbiAgICAgICAgcGFsZXR0ZTpcbiAgICAgICAgICB0aGVtZSA9PT0gVGhlbWVUeXBlLmxpZ2h0ID8gKCdsaWdodCcgYXMgY29uc3QpIDogKCdkYXJrJyBhcyBjb25zdCksXG4gICAgICAgIC4uLih0aGVtZSA9PT0gVGhlbWVUeXBlLmRhcmtcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktMDVcbiAgICAgICAgICAgICAgY29sb3I6ICcjZTllOWU5JyxcbiAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktODBcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyMyZTJlMmUnLFxuICAgICAgICAgICAgICAvLyAkY29sb3ItZ3JheS05NVxuICAgICAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgIzEyMTIxMicsXG4gICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgIGJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktMDVcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2U5ZTllOScsXG4gICAgICAgICAgICAgICAgICAvLyAkY29sb3ItZ3JheS03NVxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyMzYjNiM2InLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICAgIC8vICRjb2xvci1ncmF5LTA1XG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNlOWU5ZTknLFxuICAgICAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktNzVcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjM2IzYjNiJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDoge30pLFxuICAgICAgfSxcblxuICAgICAgLy8gSGlkZSBvdmVybGF5XG4gICAgICBtZW51OiB7XG4gICAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICB9LFxuICAgICAgICBhdXRvSGlkZTogaGlkZU1lbnVCYXIsXG5cbiAgICAgICAgLi4uKHRoZW1lID09PSBUaGVtZVR5cGUuZGFya1xuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICBzZXBhcmF0b3I6IHtcbiAgICAgICAgICAgICAgICAvLyAkY29sb3ItZ3JheS05NVxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzVlNWU1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFjY2VsZXJhdG9yOiB7XG4gICAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktMjVcbiAgICAgICAgICAgICAgICBjb2xvcjogJyNiOWI5YjknLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBsaXN0OiB7XG4gICAgICAgICAgICAgICAgLy8gJGNvbG9yLWdyYXktNzVcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzNiM2IzYicsXG4gICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMHB4IDRweCA0cHggcmdiYSgwLCAwLCAwLCAwLjEyKScsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMHB4IDBweCA2cHggNnB4JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgbGlzdDoge1xuICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzBweCA0cHggNHB4IHJnYmEoMCwgMCwgMCwgMC4xMiknLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzBweCAwcHggNnB4IDZweCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgIH0sXG5cbiAgICAgIC8vIFpvb20gc3VwcG9ydFxuICAgICAgZW5hYmxlT3ZlcmZsb3c6IGZhbHNlLFxuICAgICAgc2NhbGluZ0Z1bmN0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGBjYWxjKCR7dmFsdWV9ICogdmFyKC0tem9vbS1mYWN0b3IpKWA7XG4gICAgICB9LFxuICAgIH0pLFxuICAgIFt0aGVtZSwgaGlkZU1lbnVCYXJdXG4gICk7XG5cbiAgaWYgKCFoYXNDdXN0b21UaXRsZUJhcikge1xuICAgIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG4gIH1cblxuICBsZXQgbWF5YmVNZW51OiBBcnJheTxNZW51SXRlbT4gfCB1bmRlZmluZWQ7XG4gIGlmIChoYXNNZW51KSB7XG4gICAgY29uc3QgeyBsb2NhbGVNZXNzYWdlcywgbWVudU9wdGlvbnMsIGV4ZWN1dGVNZW51QWN0aW9uIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IG1lbnVUZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlKFxuICAgICAge1xuICAgICAgICAuLi5tZW51T3B0aW9ucyxcblxuICAgICAgICAvLyBhY3Rpb25zXG4gICAgICAgIGZvcmNlVXBkYXRlOiAoKSA9PiBleGVjdXRlTWVudUFjdGlvbignZm9yY2VVcGRhdGUnKSxcbiAgICAgICAgb3BlbkNvbnRhY3RVczogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ29wZW5Db250YWN0VXMnKSxcbiAgICAgICAgb3BlbkZvcnVtczogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ29wZW5Gb3J1bXMnKSxcbiAgICAgICAgb3BlbkpvaW5UaGVCZXRhOiAoKSA9PiBleGVjdXRlTWVudUFjdGlvbignb3BlbkpvaW5UaGVCZXRhJyksXG4gICAgICAgIG9wZW5SZWxlYXNlTm90ZXM6ICgpID0+IGV4ZWN1dGVNZW51QWN0aW9uKCdvcGVuUmVsZWFzZU5vdGVzJyksXG4gICAgICAgIG9wZW5TdXBwb3J0UGFnZTogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ29wZW5TdXBwb3J0UGFnZScpLFxuICAgICAgICBzZXR1cEFzTmV3RGV2aWNlOiAoKSA9PiBleGVjdXRlTWVudUFjdGlvbignc2V0dXBBc05ld0RldmljZScpLFxuICAgICAgICBzZXR1cEFzU3RhbmRhbG9uZTogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ3NldHVwQXNTdGFuZGFsb25lJyksXG4gICAgICAgIHNob3dBYm91dDogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ3Nob3dBYm91dCcpLFxuICAgICAgICBzaG93RGVidWdMb2c6ICgpID0+IGV4ZWN1dGVNZW51QWN0aW9uKCdzaG93RGVidWdMb2cnKSxcbiAgICAgICAgc2hvd0tleWJvYXJkU2hvcnRjdXRzOiAoKSA9PiBleGVjdXRlTWVudUFjdGlvbignc2hvd0tleWJvYXJkU2hvcnRjdXRzJyksXG4gICAgICAgIHNob3dTZXR0aW5nczogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ3Nob3dTZXR0aW5ncycpLFxuICAgICAgICBzaG93U3RpY2tlckNyZWF0b3I6ICgpID0+IGV4ZWN1dGVNZW51QWN0aW9uKCdzaG93U3RpY2tlckNyZWF0b3InKSxcbiAgICAgICAgc2hvd1dpbmRvdzogKCkgPT4gZXhlY3V0ZU1lbnVBY3Rpb24oJ3Nob3dXaW5kb3cnKSxcbiAgICAgIH0sXG4gICAgICBsb2NhbGVNZXNzYWdlc1xuICAgICk7XG5cbiAgICBtYXliZU1lbnUgPSBjb252ZXJ0TWVudShtZW51VGVtcGxhdGUsIGV4ZWN1dGVNZW51Um9sZSwgbG9jYWxlTWVzc2FnZXMpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICdUaXRsZUJhckNvbnRhaW5lcicsXG4gICAgICAgIGlzV2luZG93QWN0aXZlID8gJ1RpdGxlQmFyQ29udGFpbmVyLS1hY3RpdmUnIDogbnVsbCxcbiAgICAgICAgaXNGdWxsU2NyZWVuID8gJ1RpdGxlQmFyQ29udGFpbmVyLS1mdWxsc2NyZWVuJyA6IG51bGxcbiAgICAgICl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJUaXRsZUJhckNvbnRhaW5lcl9fcGFkZGluZ1wiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlRpdGxlQmFyQ29udGFpbmVyX19jb250ZW50XCI+e2NoaWxkcmVufTwvZGl2PlxuXG4gICAgICB7IWlzRnVsbFNjcmVlbiA/IChcbiAgICAgICAgPFRpdGxlQmFyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiVGl0bGVCYXJDb250YWluZXJfX3RpdGxlXCJcbiAgICAgICAgICBwbGF0Zm9ybT1cIndpbjMyXCJcbiAgICAgICAgICBpY29uU3JjPXtpY29uU3JjfVxuICAgICAgICAgIHRoZW1lPXt0aXRsZUJhclRoZW1lfVxuICAgICAgICAgIG1heGltaXplZD17aXNNYXhpbWl6ZWR9XG4gICAgICAgICAgbWVudT17bWF5YmVNZW51fVxuICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e3RpdGxlQmFyRG91YmxlQ2xpY2t9XG4gICAgICAgICAgaGlkZUNvbnRyb2xzXG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQStCO0FBRS9CLGdDQUFxQjtBQUdyQix3QkFBdUI7QUFFdkIsa0JBQStCO0FBQy9CLGtCQUEwQjtBQUcxQiwrQkFBa0M7QUE0QmxDLE1BQU0sa0JBQWtCO0FBR3hCLE1BQU0sc0JBQXNCLG9CQUFJLElBRzlCO0FBQ0Ysb0JBQW9CLElBQUksUUFBUSxhQUFhO0FBQzdDLG9CQUFvQixJQUFJLFFBQVEsYUFBYTtBQUM3QyxvQkFBb0IsSUFBSSxPQUFPLGFBQWE7QUFDNUMsb0JBQW9CLElBQUksUUFBUSxhQUFhO0FBQzdDLG9CQUFvQixJQUFJLFNBQVMsYUFBYTtBQUM5QyxvQkFBb0IsSUFBSSxzQkFBc0IsbUJBQW1CO0FBQ2pFLG9CQUFvQixJQUFJLGFBQWEsYUFBYTtBQUNsRCxvQkFBb0Is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O0FBQzdCLGFBQU8sUUFBUTtBQUFBLElBQ2pCO0FBQUEsRUFDRixJQUNBLENBQUMsT0FBTyxXQUFXLENBQ3JCO0FBRUEsTUFBSSxDQUFDLG1CQUFtQjtBQUN0QixXQUFPLHdGQUFHLFFBQVM7QUFBQSxFQUNyQjtBQUVBLE1BQUk7QUFDSixNQUFJLFNBQVM7QUFDWCxVQUFNLEVBQUUsZ0JBQWdCLGFBQWEsc0JBQXNCO0FBRTNELFVBQU0sZUFBZSxnQ0FDbkI7QUFBQSxTQUNLO0FBQUEsTUFHSCxhQUFhLE1BQU0sa0JBQWtCLGFBQWE7QUFBQSxNQUNsRCxlQUFlLE1BQU0sa0JBQWtCLGVBQWU7QUFBQSxNQUN0RCxZQUFZLE1BQU0sa0JBQWtCLFlBQVk7QUFBQSxNQUNoRCxpQkFBaUIsTUFBTSxrQkFBa0IsaUJBQWlCO0FBQUEsTUFDMUQsa0JBQWtCLE1BQU0sa0JBQWtCLGtCQUFrQjtBQUFBLE1BQzVELGlCQUFpQixNQUFNLGtCQUFrQixpQkFBaUI7QUFBQSxNQUMxRCxrQkFBa0IsTUFBTSxrQkFBa0Isa0JBQWtCO0FBQUEsTUFDNUQsbUJBQW1CLE1BQU0sa0JBQWtCLG1CQUFtQjtBQUFBLE1BQzlELFdBQVcsTUFBTSxrQkFBa0IsV0FBVztBQUFBLE1BQzlDLGNBQWMsTUFBTSxrQkFBa0IsY0FBYztBQUFBLE1BQ3BELHVCQUF1QixNQUFNLGtCQUFrQix1QkFBdUI7QUFBQSxNQUN0RSxjQUFjLE1BQU0sa0JBQWtCLGNBQWM7QUFBQSxNQUNwRCxvQkFBb0IsTUFBTSxrQkFBa0Isb0JBQW9CO0FBQUEsTUFDaEUsWUFBWSxNQUFNLGtCQUFrQixZQUFZO0FBQUEsSUFDbEQsR0FDQSxjQUNGO0FBRUEsZ0JBQVksWUFBWSxjQUFjLGlCQUFpQixjQUFjO0FBQUEsRUFDdkU7QUFFQSxTQUNFLG1EQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULHFCQUNBLGlCQUFpQiw4QkFBOEIsTUFDL0MsZUFBZSxrQ0FBa0MsSUFDbkQ7QUFBQSxLQUVBLG1EQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsR0FBNkIsR0FDNUMsbURBQUM7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUE4QixRQUFTLEdBRXJELENBQUMsZUFDQSxtREFBQztBQUFBLElBQ0MsV0FBVTtBQUFBLElBQ1YsVUFBUztBQUFBLElBQ1Q7QUFBQSxJQUNBLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxJQUNYLE1BQU07QUFBQSxJQUNOLGVBQWU7QUFBQSxJQUNmLGNBQVk7QUFBQSxHQUNkLElBQ0UsSUFDTjtBQUVKLEdBdEppQzsiLAogICJuYW1lcyI6IFtdCn0K
