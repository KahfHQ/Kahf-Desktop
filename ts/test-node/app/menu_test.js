var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_sinon = require("sinon");
var import_menu = require("../../../app/menu");
var import_locale = require("../../../app/locale");
const forceUpdate = (0, import_sinon.stub)();
const openContactUs = (0, import_sinon.stub)();
const openForums = (0, import_sinon.stub)();
const openJoinTheBeta = (0, import_sinon.stub)();
const openReleaseNotes = (0, import_sinon.stub)();
const openSupportPage = (0, import_sinon.stub)();
const setupAsNewDevice = (0, import_sinon.stub)();
const setupAsStandalone = (0, import_sinon.stub)();
const showAbout = (0, import_sinon.stub)();
const showDebugLog = (0, import_sinon.stub)();
const showKeyboardShortcuts = (0, import_sinon.stub)();
const showSettings = (0, import_sinon.stub)();
const showStickerCreator = (0, import_sinon.stub)();
const showWindow = (0, import_sinon.stub)();
const getExpectedEditMenu = /* @__PURE__ */ __name((includeSpeech) => ({
  label: "&Edit",
  submenu: [
    { label: "Undo", role: "undo" },
    { label: "Redo", role: "redo" },
    { type: "separator" },
    { label: "Cut", role: "cut" },
    { label: "Copy", role: "copy" },
    { label: "Paste", role: "paste" },
    { label: "Paste and Match Style", role: "pasteAndMatchStyle" },
    { label: "Delete", role: "delete" },
    { label: "Select All", role: "selectAll" },
    ...includeSpeech ? [
      { type: "separator" },
      {
        label: "Speech",
        submenu: [
          { label: "Start speaking", role: "startSpeaking" },
          { label: "Stop speaking", role: "stopSpeaking" }
        ]
      }
    ] : []
  ]
}), "getExpectedEditMenu");
const getExpectedViewMenu = /* @__PURE__ */ __name(() => ({
  label: "&View",
  submenu: [
    { label: "Actual Size", role: "resetZoom" },
    { accelerator: "CmdOrCtrl+=", label: "Zoom In", role: "zoomIn" },
    { label: "Zoom Out", role: "zoomOut" },
    { type: "separator" },
    { label: "Toggle Full Screen", role: "togglefullscreen" },
    { type: "separator" },
    { label: "Debug Log", click: showDebugLog },
    { type: "separator" },
    { label: "Toggle Developer Tools", role: "toggleDevTools" },
    { label: "Force Update", click: forceUpdate }
  ]
}), "getExpectedViewMenu");
const getExpectedHelpMenu = /* @__PURE__ */ __name((includeAbout) => ({
  label: "&Help",
  role: "help",
  submenu: [
    {
      label: "Show Keyboard Shortcuts",
      accelerator: "CmdOrCtrl+/",
      click: showKeyboardShortcuts
    },
    { type: "separator" },
    { label: "Contact Us", click: openContactUs },
    { label: "Go to Release Notes", click: openReleaseNotes },
    { label: "Go to Forums", click: openForums },
    { label: "Go to Support Page", click: openSupportPage },
    { label: "Join the Beta", click: openJoinTheBeta },
    ...includeAbout ? [
      { type: "separator" },
      { label: "About Signal Desktop", click: showAbout }
    ] : []
  ]
}), "getExpectedHelpMenu");
const EXPECTED_MACOS = [
  {
    label: "Signal Desktop",
    submenu: [
      { label: "About Signal Desktop", click: showAbout },
      { type: "separator" },
      {
        label: "Preferences\u2026",
        accelerator: "CommandOrControl+,",
        click: showSettings
      },
      { type: "separator" },
      { label: "Services", role: "services" },
      { type: "separator" },
      { label: "Hide", role: "hide" },
      { label: "Hide Others", role: "hideOthers" },
      { label: "Show All", role: "unhide" },
      { type: "separator" },
      { label: "Quit Signal", role: "quit" }
    ]
  },
  {
    label: "&File",
    submenu: [
      { label: "Create/upload sticker pack", click: showStickerCreator },
      { type: "separator" },
      { accelerator: "CmdOrCtrl+W", label: "Close Window", role: "close" }
    ]
  },
  getExpectedEditMenu(true),
  getExpectedViewMenu(),
  {
    label: "&Window",
    role: "window",
    submenu: [
      { label: "Minimize", accelerator: "CmdOrCtrl+M", role: "minimize" },
      { label: "Zoom", role: "zoom" },
      { label: "Show", accelerator: "CmdOrCtrl+Shift+0", click: showWindow },
      { type: "separator" },
      { label: "Bring All to Front", role: "front" }
    ]
  },
  getExpectedHelpMenu(false)
];
const EXPECTED_WINDOWS = [
  {
    label: "&File",
    submenu: [
      { label: "Create/upload sticker pack", click: showStickerCreator },
      {
        label: "Preferences\u2026",
        accelerator: "CommandOrControl+,",
        click: showSettings
      },
      { type: "separator" },
      { label: "Quit Signal", role: "quit" }
    ]
  },
  getExpectedEditMenu(false),
  getExpectedViewMenu(),
  {
    label: "&Window",
    role: "window",
    submenu: [{ label: "Minimize", role: "minimize" }]
  },
  getExpectedHelpMenu(true)
];
const EXPECTED_LINUX = EXPECTED_WINDOWS.map((menuItem) => {
  if (menuItem.label === "&View" && Array.isArray(menuItem.submenu)) {
    return {
      ...menuItem,
      submenu: menuItem.submenu.filter((submenuItem) => submenuItem.label !== "Force Update")
    };
  }
  return menuItem;
});
const PLATFORMS = [
  {
    label: "macOS",
    platform: "darwin",
    expectedDefault: EXPECTED_MACOS
  },
  {
    label: "Windows",
    platform: "win32",
    expectedDefault: EXPECTED_WINDOWS
  },
  {
    label: "Linux",
    platform: "linux",
    expectedDefault: EXPECTED_LINUX
  }
];
describe("createTemplate", () => {
  const { messages } = (0, import_locale.load)({
    appLocale: "en",
    logger: {
      error(arg) {
        throw new Error(String(arg));
      },
      warn(arg) {
        throw new Error(String(arg));
      }
    }
  });
  const actions = {
    forceUpdate,
    openContactUs,
    openForums,
    openJoinTheBeta,
    openReleaseNotes,
    openSupportPage,
    setupAsNewDevice,
    setupAsStandalone,
    showAbout,
    showDebugLog,
    showKeyboardShortcuts,
    showSettings,
    showStickerCreator,
    showWindow
  };
  PLATFORMS.forEach(({ label, platform, expectedDefault }) => {
    describe(label, () => {
      it("should return the correct template without setup options", () => {
        const options = {
          development: false,
          devTools: true,
          includeSetup: false,
          isProduction: true,
          platform,
          ...actions
        };
        const actual = (0, import_menu.createTemplate)(options, messages);
        import_chai.assert.deepEqual(actual, expectedDefault);
      });
      it("should return correct template with setup options", () => {
        const options = {
          development: false,
          devTools: true,
          includeSetup: true,
          isProduction: true,
          platform,
          ...actions
        };
        const expected = expectedDefault.map((menuItem) => {
          if (menuItem.label === "&File" && Array.isArray(menuItem.submenu)) {
            return {
              ...menuItem,
              submenu: [
                { label: "Set Up as New Device", click: setupAsNewDevice },
                { type: "separator" },
                ...menuItem.submenu
              ]
            };
          }
          return menuItem;
        });
        const actual = (0, import_menu.createTemplate)(options, messages);
        import_chai.assert.deepEqual(actual, expected);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWVudV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyBzdHViIH0gZnJvbSAnc2lub24nO1xuaW1wb3J0IHR5cGUgeyBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHR5cGUgeyBDcmVhdGVUZW1wbGF0ZU9wdGlvbnNUeXBlIH0gZnJvbSAnLi4vLi4vLi4vYXBwL21lbnUnO1xuaW1wb3J0IHsgY3JlYXRlVGVtcGxhdGUgfSBmcm9tICcuLi8uLi8uLi9hcHAvbWVudSc7XG5pbXBvcnQgeyBsb2FkIGFzIGxvYWRMb2NhbGUgfSBmcm9tICcuLi8uLi8uLi9hcHAvbG9jYWxlJztcbmltcG9ydCB0eXBlIHsgTWVudUxpc3RUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvbWVudSc7XG5cbmNvbnN0IGZvcmNlVXBkYXRlID0gc3R1YigpO1xuY29uc3Qgb3BlbkNvbnRhY3RVcyA9IHN0dWIoKTtcbmNvbnN0IG9wZW5Gb3J1bXMgPSBzdHViKCk7XG5jb25zdCBvcGVuSm9pblRoZUJldGEgPSBzdHViKCk7XG5jb25zdCBvcGVuUmVsZWFzZU5vdGVzID0gc3R1YigpO1xuY29uc3Qgb3BlblN1cHBvcnRQYWdlID0gc3R1YigpO1xuY29uc3Qgc2V0dXBBc05ld0RldmljZSA9IHN0dWIoKTtcbmNvbnN0IHNldHVwQXNTdGFuZGFsb25lID0gc3R1YigpO1xuY29uc3Qgc2hvd0Fib3V0ID0gc3R1YigpO1xuY29uc3Qgc2hvd0RlYnVnTG9nID0gc3R1YigpO1xuY29uc3Qgc2hvd0tleWJvYXJkU2hvcnRjdXRzID0gc3R1YigpO1xuY29uc3Qgc2hvd1NldHRpbmdzID0gc3R1YigpO1xuY29uc3Qgc2hvd1N0aWNrZXJDcmVhdG9yID0gc3R1YigpO1xuY29uc3Qgc2hvd1dpbmRvdyA9IHN0dWIoKTtcblxuY29uc3QgZ2V0RXhwZWN0ZWRFZGl0TWVudSA9IChcbiAgaW5jbHVkZVNwZWVjaDogYm9vbGVhblxuKTogTWVudUl0ZW1Db25zdHJ1Y3Rvck9wdGlvbnMgPT4gKHtcbiAgbGFiZWw6ICcmRWRpdCcsXG4gIHN1Ym1lbnU6IFtcbiAgICB7IGxhYmVsOiAnVW5kbycsIHJvbGU6ICd1bmRvJyB9LFxuICAgIHsgbGFiZWw6ICdSZWRvJywgcm9sZTogJ3JlZG8nIH0sXG4gICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgIHsgbGFiZWw6ICdDdXQnLCByb2xlOiAnY3V0JyB9LFxuICAgIHsgbGFiZWw6ICdDb3B5Jywgcm9sZTogJ2NvcHknIH0sXG4gICAgeyBsYWJlbDogJ1Bhc3RlJywgcm9sZTogJ3Bhc3RlJyB9LFxuICAgIHsgbGFiZWw6ICdQYXN0ZSBhbmQgTWF0Y2ggU3R5bGUnLCByb2xlOiAncGFzdGVBbmRNYXRjaFN0eWxlJyB9LFxuICAgIHsgbGFiZWw6ICdEZWxldGUnLCByb2xlOiAnZGVsZXRlJyB9LFxuICAgIHsgbGFiZWw6ICdTZWxlY3QgQWxsJywgcm9sZTogJ3NlbGVjdEFsbCcgfSxcbiAgICAuLi4oaW5jbHVkZVNwZWVjaFxuICAgICAgPyAoW1xuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1NwZWVjaCcsXG4gICAgICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAgICAgIHsgbGFiZWw6ICdTdGFydCBzcGVha2luZycsIHJvbGU6ICdzdGFydFNwZWFraW5nJyB9LFxuICAgICAgICAgICAgICB7IGxhYmVsOiAnU3RvcCBzcGVha2luZycsIHJvbGU6ICdzdG9wU3BlYWtpbmcnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0gYXMgTWVudUxpc3RUeXBlKVxuICAgICAgOiBbXSksXG4gIF0sXG59KTtcblxuY29uc3QgZ2V0RXhwZWN0ZWRWaWV3TWVudSA9ICgpOiBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9ucyA9PiAoe1xuICBsYWJlbDogJyZWaWV3JyxcbiAgc3VibWVudTogW1xuICAgIHsgbGFiZWw6ICdBY3R1YWwgU2l6ZScsIHJvbGU6ICdyZXNldFpvb20nIH0sXG4gICAgeyBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCs9JywgbGFiZWw6ICdab29tIEluJywgcm9sZTogJ3pvb21JbicgfSxcbiAgICB7IGxhYmVsOiAnWm9vbSBPdXQnLCByb2xlOiAnem9vbU91dCcgfSxcbiAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgeyBsYWJlbDogJ1RvZ2dsZSBGdWxsIFNjcmVlbicsIHJvbGU6ICd0b2dnbGVmdWxsc2NyZWVuJyB9LFxuICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICB7IGxhYmVsOiAnRGVidWcgTG9nJywgY2xpY2s6IHNob3dEZWJ1Z0xvZyB9LFxuICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICB7IGxhYmVsOiAnVG9nZ2xlIERldmVsb3BlciBUb29scycsIHJvbGU6ICd0b2dnbGVEZXZUb29scycgfSxcbiAgICB7IGxhYmVsOiAnRm9yY2UgVXBkYXRlJywgY2xpY2s6IGZvcmNlVXBkYXRlIH0sXG4gIF0sXG59KTtcblxuY29uc3QgZ2V0RXhwZWN0ZWRIZWxwTWVudSA9IChcbiAgaW5jbHVkZUFib3V0OiBib29sZWFuXG4pOiBNZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9ucyA9PiAoe1xuICBsYWJlbDogJyZIZWxwJyxcbiAgcm9sZTogJ2hlbHAnLFxuICBzdWJtZW51OiBbXG4gICAge1xuICAgICAgbGFiZWw6ICdTaG93IEtleWJvYXJkIFNob3J0Y3V0cycsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCsvJyxcbiAgICAgIGNsaWNrOiBzaG93S2V5Ym9hcmRTaG9ydGN1dHMsXG4gICAgfSxcbiAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgeyBsYWJlbDogJ0NvbnRhY3QgVXMnLCBjbGljazogb3BlbkNvbnRhY3RVcyB9LFxuICAgIHsgbGFiZWw6ICdHbyB0byBSZWxlYXNlIE5vdGVzJywgY2xpY2s6IG9wZW5SZWxlYXNlTm90ZXMgfSxcbiAgICB7IGxhYmVsOiAnR28gdG8gRm9ydW1zJywgY2xpY2s6IG9wZW5Gb3J1bXMgfSxcbiAgICB7IGxhYmVsOiAnR28gdG8gU3VwcG9ydCBQYWdlJywgY2xpY2s6IG9wZW5TdXBwb3J0UGFnZSB9LFxuICAgIHsgbGFiZWw6ICdKb2luIHRoZSBCZXRhJywgY2xpY2s6IG9wZW5Kb2luVGhlQmV0YSB9LFxuICAgIC4uLihpbmNsdWRlQWJvdXRcbiAgICAgID8gKFtcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ0Fib3V0IFNpZ25hbCBEZXNrdG9wJywgY2xpY2s6IHNob3dBYm91dCB9LFxuICAgICAgICBdIGFzIE1lbnVMaXN0VHlwZSlcbiAgICAgIDogW10pLFxuICBdLFxufSk7XG5cbmNvbnN0IEVYUEVDVEVEX01BQ09TOiBNZW51TGlzdFR5cGUgPSBbXG4gIHtcbiAgICBsYWJlbDogJ1NpZ25hbCBEZXNrdG9wJyxcbiAgICBzdWJtZW51OiBbXG4gICAgICB7IGxhYmVsOiAnQWJvdXQgU2lnbmFsIERlc2t0b3AnLCBjbGljazogc2hvd0Fib3V0IH0sXG4gICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHJlZmVyZW5jZXNcdTIwMjYnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmRPckNvbnRyb2wrLCcsXG4gICAgICAgIGNsaWNrOiBzaG93U2V0dGluZ3MsXG4gICAgICB9LFxuICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgeyBsYWJlbDogJ1NlcnZpY2VzJywgcm9sZTogJ3NlcnZpY2VzJyB9LFxuICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgeyBsYWJlbDogJ0hpZGUnLCByb2xlOiAnaGlkZScgfSxcbiAgICAgIHsgbGFiZWw6ICdIaWRlIE90aGVycycsIHJvbGU6ICdoaWRlT3RoZXJzJyB9LFxuICAgICAgeyBsYWJlbDogJ1Nob3cgQWxsJywgcm9sZTogJ3VuaGlkZScgfSxcbiAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIHsgbGFiZWw6ICdRdWl0IFNpZ25hbCcsIHJvbGU6ICdxdWl0JyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJyZGaWxlJyxcbiAgICBzdWJtZW51OiBbXG4gICAgICB7IGxhYmVsOiAnQ3JlYXRlL3VwbG9hZCBzdGlja2VyIHBhY2snLCBjbGljazogc2hvd1N0aWNrZXJDcmVhdG9yIH0sXG4gICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICB7IGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1cnLCBsYWJlbDogJ0Nsb3NlIFdpbmRvdycsIHJvbGU6ICdjbG9zZScgfSxcbiAgICBdLFxuICB9LFxuICBnZXRFeHBlY3RlZEVkaXRNZW51KHRydWUpLFxuICBnZXRFeHBlY3RlZFZpZXdNZW51KCksXG4gIHtcbiAgICBsYWJlbDogJyZXaW5kb3cnLFxuICAgIHJvbGU6ICd3aW5kb3cnLFxuICAgIHN1Ym1lbnU6IFtcbiAgICAgIHsgbGFiZWw6ICdNaW5pbWl6ZScsIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLCByb2xlOiAnbWluaW1pemUnIH0sXG4gICAgICB7IGxhYmVsOiAnWm9vbScsIHJvbGU6ICd6b29tJyB9LFxuICAgICAgeyBsYWJlbDogJ1Nob3cnLCBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTaGlmdCswJywgY2xpY2s6IHNob3dXaW5kb3cgfSxcbiAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIHsgbGFiZWw6ICdCcmluZyBBbGwgdG8gRnJvbnQnLCByb2xlOiAnZnJvbnQnIH0sXG4gICAgXSxcbiAgfSxcbiAgZ2V0RXhwZWN0ZWRIZWxwTWVudShmYWxzZSksXG5dO1xuXG5jb25zdCBFWFBFQ1RFRF9XSU5ET1dTOiBNZW51TGlzdFR5cGUgPSBbXG4gIHtcbiAgICBsYWJlbDogJyZGaWxlJyxcbiAgICBzdWJtZW51OiBbXG4gICAgICB7IGxhYmVsOiAnQ3JlYXRlL3VwbG9hZCBzdGlja2VyIHBhY2snLCBjbGljazogc2hvd1N0aWNrZXJDcmVhdG9yIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHJlZmVyZW5jZXNcdTIwMjYnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NvbW1hbmRPckNvbnRyb2wrLCcsXG4gICAgICAgIGNsaWNrOiBzaG93U2V0dGluZ3MsXG4gICAgICB9LFxuICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgeyBsYWJlbDogJ1F1aXQgU2lnbmFsJywgcm9sZTogJ3F1aXQnIH0sXG4gICAgXSxcbiAgfSxcbiAgZ2V0RXhwZWN0ZWRFZGl0TWVudShmYWxzZSksXG4gIGdldEV4cGVjdGVkVmlld01lbnUoKSxcbiAge1xuICAgIGxhYmVsOiAnJldpbmRvdycsXG4gICAgcm9sZTogJ3dpbmRvdycsXG4gICAgc3VibWVudTogW3sgbGFiZWw6ICdNaW5pbWl6ZScsIHJvbGU6ICdtaW5pbWl6ZScgfV0sXG4gIH0sXG4gIGdldEV4cGVjdGVkSGVscE1lbnUodHJ1ZSksXG5dO1xuXG5jb25zdCBFWFBFQ1RFRF9MSU5VWDogTWVudUxpc3RUeXBlID0gRVhQRUNURURfV0lORE9XUy5tYXAobWVudUl0ZW0gPT4ge1xuICBpZiAobWVudUl0ZW0ubGFiZWwgPT09ICcmVmlldycgJiYgQXJyYXkuaXNBcnJheShtZW51SXRlbS5zdWJtZW51KSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5tZW51SXRlbSxcbiAgICAgIHN1Ym1lbnU6IG1lbnVJdGVtLnN1Ym1lbnUuZmlsdGVyKFxuICAgICAgICBzdWJtZW51SXRlbSA9PiBzdWJtZW51SXRlbS5sYWJlbCAhPT0gJ0ZvcmNlIFVwZGF0ZSdcbiAgICAgICksXG4gICAgfTtcbiAgfVxuICByZXR1cm4gbWVudUl0ZW07XG59KTtcblxuY29uc3QgUExBVEZPUk1TID0gW1xuICB7XG4gICAgbGFiZWw6ICdtYWNPUycsXG4gICAgcGxhdGZvcm06ICdkYXJ3aW4nLFxuICAgIGV4cGVjdGVkRGVmYXVsdDogRVhQRUNURURfTUFDT1MsXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ1dpbmRvd3MnLFxuICAgIHBsYXRmb3JtOiAnd2luMzInLFxuICAgIGV4cGVjdGVkRGVmYXVsdDogRVhQRUNURURfV0lORE9XUyxcbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnTGludXgnLFxuICAgIHBsYXRmb3JtOiAnbGludXgnLFxuICAgIGV4cGVjdGVkRGVmYXVsdDogRVhQRUNURURfTElOVVgsXG4gIH0sXG5dO1xuXG5kZXNjcmliZSgnY3JlYXRlVGVtcGxhdGUnLCAoKSA9PiB7XG4gIGNvbnN0IHsgbWVzc2FnZXMgfSA9IGxvYWRMb2NhbGUoe1xuICAgIGFwcExvY2FsZTogJ2VuJyxcbiAgICBsb2dnZXI6IHtcbiAgICAgIGVycm9yKGFyZzogdW5rbm93bikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoU3RyaW5nKGFyZykpO1xuICAgICAgfSxcbiAgICAgIHdhcm4oYXJnOiB1bmtub3duKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihTdHJpbmcoYXJnKSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IGFjdGlvbnMgPSB7XG4gICAgZm9yY2VVcGRhdGUsXG4gICAgb3BlbkNvbnRhY3RVcyxcbiAgICBvcGVuRm9ydW1zLFxuICAgIG9wZW5Kb2luVGhlQmV0YSxcbiAgICBvcGVuUmVsZWFzZU5vdGVzLFxuICAgIG9wZW5TdXBwb3J0UGFnZSxcbiAgICBzZXR1cEFzTmV3RGV2aWNlLFxuICAgIHNldHVwQXNTdGFuZGFsb25lLFxuICAgIHNob3dBYm91dCxcbiAgICBzaG93RGVidWdMb2csXG4gICAgc2hvd0tleWJvYXJkU2hvcnRjdXRzLFxuICAgIHNob3dTZXR0aW5ncyxcbiAgICBzaG93U3RpY2tlckNyZWF0b3IsXG4gICAgc2hvd1dpbmRvdyxcbiAgfTtcblxuICBQTEFURk9STVMuZm9yRWFjaCgoeyBsYWJlbCwgcGxhdGZvcm0sIGV4cGVjdGVkRGVmYXVsdCB9KSA9PiB7XG4gICAgZGVzY3JpYmUobGFiZWwsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IHRlbXBsYXRlIHdpdGhvdXQgc2V0dXAgb3B0aW9ucycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogQ3JlYXRlVGVtcGxhdGVPcHRpb25zVHlwZSA9IHtcbiAgICAgICAgICBkZXZlbG9wbWVudDogZmFsc2UsXG4gICAgICAgICAgZGV2VG9vbHM6IHRydWUsXG4gICAgICAgICAgaW5jbHVkZVNldHVwOiBmYWxzZSxcbiAgICAgICAgICBpc1Byb2R1Y3Rpb246IHRydWUsXG4gICAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgICAgLi4uYWN0aW9ucyxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhY3R1YWwgPSBjcmVhdGVUZW1wbGF0ZShvcHRpb25zLCBtZXNzYWdlcyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZERlZmF1bHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGVtcGxhdGUgd2l0aCBzZXR1cCBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBDcmVhdGVUZW1wbGF0ZU9wdGlvbnNUeXBlID0ge1xuICAgICAgICAgIGRldmVsb3BtZW50OiBmYWxzZSxcbiAgICAgICAgICBkZXZUb29sczogdHJ1ZSxcbiAgICAgICAgICBpbmNsdWRlU2V0dXA6IHRydWUsXG4gICAgICAgICAgaXNQcm9kdWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHBsYXRmb3JtLFxuICAgICAgICAgIC4uLmFjdGlvbnMsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZXhwZWN0ZWQ6IE1lbnVMaXN0VHlwZSA9IGV4cGVjdGVkRGVmYXVsdC5tYXAobWVudUl0ZW0gPT4ge1xuICAgICAgICAgIGlmIChtZW51SXRlbS5sYWJlbCA9PT0gJyZGaWxlJyAmJiBBcnJheS5pc0FycmF5KG1lbnVJdGVtLnN1Ym1lbnUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5tZW51SXRlbSxcbiAgICAgICAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdTZXQgVXAgYXMgTmV3IERldmljZScsIGNsaWNrOiBzZXR1cEFzTmV3RGV2aWNlIH0sXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgICAgICAgIC4uLm1lbnVJdGVtLnN1Ym1lbnUsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWVudUl0ZW07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IGNyZWF0ZVRlbXBsYXRlKG9wdGlvbnMsIG1lc3NhZ2VzKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFHQSxrQkFBdUI7QUFDdkIsbUJBQXFCO0FBSXJCLGtCQUErQjtBQUMvQixvQkFBbUM7QUFHbkMsTUFBTSxjQUFjLHVCQUFLO0FBQ3pCLE1BQU0sZ0JBQWdCLHVCQUFLO0FBQzNCLE1BQU0sYUFBYSx1QkFBSztBQUN4QixNQUFNLGtCQUFrQix1QkFBSztBQUM3QixNQUFNLG1CQUFtQix1QkFBSztBQUM5QixNQUFNLGtCQUFrQix1QkFBSztBQUM3QixNQUFNLG1CQUFtQix1QkFBSztBQUM5QixNQUFNLG9CQUFvQix1QkFBSztBQUMvQixNQUFNLFlBQVksdUJBQUs7QUFD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QjtBQUFBLE1BQ0EsS0FBSyxLQUFjO0FBQ2pCLGNBQU0sSUFBSSxNQUFNLE9BQU8sR0FBRyxDQUFDO0FBQUEsTUFDN0I7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBRUQsUUFBTSxVQUFVO0FBQUEsSUFDZDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBRUEsWUFBVSxRQUFRLENBQUMsRUFBRSxPQUFPLFVBQVUsc0JBQXNCO0FBQzFELGFBQVMsT0FBTyxNQUFNO0FBQ3BCLFNBQUcsNERBQTRELE1BQU07QUFDbkUsY0FBTSxVQUFxQztBQUFBLFVBQ3pDLGFBQWE7QUFBQSxVQUNiLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxVQUNkLGNBQWM7QUFBQSxVQUNkO0FBQUEsYUFDRztBQUFBLFFBQ0w7QUFFQSxjQUFNLFNBQVMsZ0NBQWUsU0FBUyxRQUFRO0FBQy9DLDJCQUFPLFVBQVUsUUFBUSxlQUFlO0FBQUEsTUFDMUMsQ0FBQztBQUVELFNBQUcscURBQXFELE1BQU07QUFDNUQsY0FBTSxVQUFxQztBQUFBLFVBQ3pDLGFBQWE7QUFBQSxVQUNiLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxVQUNkLGNBQWM7QUFBQSxVQUNkO0FBQUEsYUFDRztBQUFBLFFBQ0w7QUFFQSxjQUFNLFdBQXlCLGdCQUFnQixJQUFJLGNBQVk7QUFDN0QsY0FBSSxTQUFTLFVBQVUsV0FBVyxNQUFNLFFBQVEsU0FBUyxPQUFPLEdBQUc7QUFDakUsbUJBQU87QUFBQSxpQkFDRjtBQUFBLGNBQ0gsU0FBUztBQUFBLGdCQUNQLEVBQUUsT0FBTyx3QkFBd0IsT0FBTyxpQkFBaUI7QUFBQSxnQkFDekQsRUFBRSxNQUFNLFlBQVk7QUFBQSxnQkFDcEIsR0FBRyxTQUFTO0FBQUEsY0FDZDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQ0EsaUJBQU87QUFBQSxRQUNULENBQUM7QUFFRCxjQUFNLFNBQVMsZ0NBQWUsU0FBUyxRQUFRO0FBQy9DLDJCQUFPLFVBQVUsUUFBUSxRQUFRO0FBQUEsTUFDbkMsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
