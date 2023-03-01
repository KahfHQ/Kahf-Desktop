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
var main_exports = {};
__export(main_exports, {
  windowConfigSchema: () => windowConfigSchema
});
module.exports = __toCommonJS(main_exports);
var import_patchWindows7Hostname = require("../ts/util/patchWindows7Hostname");
var import_path = require("path");
var import_url = require("url");
var os = __toESM(require("os"));
var import_fs_extra = require("fs-extra");
var import_crypto = require("crypto");
var import_normalize_path = __toESM(require("normalize-path"));
var import_fast_glob = __toESM(require("fast-glob"));
var import_p_queue = __toESM(require("p-queue"));
var import_lodash = require("lodash");
var import_electron = require("electron");
var import_zod = require("zod");
var import_package = __toESM(require("../package.json"));
var GlobalErrors = __toESM(require("./global_errors"));
var import_crashReports = require("./crashReports");
var import_spell_check = require("./spell_check");
var import_privacy = require("../ts/util/privacy");
var import_createSupportUrl = require("../ts/util/createSupportUrl");
var import_missingCaseError = require("../ts/util/missingCaseError");
var import_assert = require("../ts/util/assert");
var import_consoleLogger = require("../ts/util/consoleLogger");
var import_Util = require("../ts/types/Util");
var import_startup_config = require("./startup_config");
var import_RendererConfig = require("../ts/types/RendererConfig");
var import_config = __toESM(require("./config"));
var import_environment = require("../ts/environment");
var userConfig = __toESM(require("./user_config"));
var attachments = __toESM(require("./attachments"));
var attachmentChannel = __toESM(require("./attachment_channel"));
var bounce = __toESM(require("../ts/services/bounce"));
var updater = __toESM(require("../ts/updater/index"));
var import_updateDefaultSession = require("./updateDefaultSession");
var import_PreventDisplaySleepService = require("./PreventDisplaySleepService");
var import_SystemTrayService = require("./SystemTrayService");
var import_SystemTraySettingCache = require("./SystemTraySettingCache");
var import_SystemTraySetting = require("../ts/types/SystemTraySetting");
var ephemeralConfig = __toESM(require("./ephemeral_config"));
var logging = __toESM(require("../ts/logging/main_process_logging"));
var import_main = require("../ts/sql/main");
var sqlChannels = __toESM(require("./sql_channel"));
var windowState = __toESM(require("./window_state"));
var import_menu = require("./menu");
var import_protocol_filter = require("./protocol_filter");
var OS = __toESM(require("../ts/OS"));
var import_version = require("../ts/util/version");
var import_sgnlHref = require("../ts/util/sgnlHref");
var import_clearTimeoutIfNecessary = require("../ts/util/clearTimeoutIfNecessary");
var import_toggleMaximizedBrowserWindow = require("../ts/util/toggleMaximizedBrowserWindow");
var import_challengeMain = require("../ts/main/challengeMain");
var import_NativeThemeNotifier = require("../ts/main/NativeThemeNotifier");
var import_powerChannel = require("../ts/main/powerChannel");
var import_settingsChannel = require("../ts/main/settingsChannel");
var import_url2 = require("../ts/util/url");
var import_heicConverterMain = require("../ts/workers/heicConverterMain");
var import_locale = require("./locale");
const animationSettings = import_electron.systemPreferences.getAnimationSettings();
let mainWindow;
let mainWindowCreated = false;
let loadingWindow;
const activeWindows = /* @__PURE__ */ new Set();
function getMainWindow() {
  return mainWindow;
}
const development = (0, import_environment.getEnvironment)() === import_environment.Environment.Development || (0, import_environment.getEnvironment)() === import_environment.Environment.Staging;
const isThrottlingEnabled = development || !(0, import_version.isProduction)(import_electron.app.getVersion());
const enableCI = import_config.default.get("enableCI");
const forcePreloadBundle = import_config.default.get("forcePreloadBundle");
const preventDisplaySleepService = new import_PreventDisplaySleepService.PreventDisplaySleepService(import_electron.powerSaveBlocker);
const challengeHandler = new import_challengeMain.ChallengeMainHandler();
const nativeThemeNotifier = new import_NativeThemeNotifier.NativeThemeNotifier();
nativeThemeNotifier.initialize();
let appStartInitialSpellcheckSetting = true;
const defaultWebPrefs = {
  devTools: process.argv.some((arg) => arg === "--enable-dev-tools") || (0, import_environment.getEnvironment)() !== import_environment.Environment.Production || !(0, import_version.isProduction)(import_electron.app.getVersion()),
  spellcheck: false
};
function showWindow() {
  if (!mainWindow) {
    return;
  }
  if (mainWindow.isVisible()) {
    mainWindow.focus();
  } else {
    mainWindow.show();
  }
}
if (!process.mas) {
  console.log("making app single instance");
  const gotLock = import_electron.app.requestSingleInstanceLock();
  if (!gotLock) {
    console.log("quitting; we are the second instance");
    import_electron.app.exit();
  } else {
    import_electron.app.on("second-instance", (_e, argv) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        showWindow();
      }
      if (!logger) {
        console.log("second-instance: logger not initialized; skipping further checks");
        return;
      }
      const incomingCaptchaHref = getIncomingCaptchaHref(argv);
      if (incomingCaptchaHref) {
        const { captcha } = (0, import_sgnlHref.parseCaptchaHref)(incomingCaptchaHref, getLogger());
        challengeHandler.handleCaptcha(captcha);
        return true;
      }
      const incomingHref = getIncomingHref(argv);
      if (incomingHref) {
        handleSgnlHref(incomingHref);
      }
      return true;
    });
  }
}
let sqlInitTimeStart = 0;
let sqlInitTimeEnd = 0;
const sql = new import_main.MainSQL();
const heicConverter = (0, import_heicConverterMain.getHeicConverter)();
async function getSpellCheckSetting() {
  const fastValue = ephemeralConfig.get("spell-check");
  if (fastValue !== void 0) {
    getLogger().info("got fast spellcheck setting", fastValue);
    return fastValue;
  }
  const json = await sql.sqlCall("getItemById", ["spell-check"]);
  const slowValue = json ? json.value : true;
  ephemeralConfig.set("spell-check", slowValue);
  getLogger().info("got slow spellcheck setting", slowValue);
  return slowValue;
}
async function getThemeSetting({
  ephemeralOnly = false
} = {}) {
  const fastValue = ephemeralConfig.get("theme-setting");
  if (fastValue !== void 0) {
    getLogger().info("got fast theme-setting value", fastValue);
    return fastValue;
  }
  if (ephemeralOnly) {
    return "system";
  }
  const json = await sql.sqlCall("getItemById", ["theme-setting"]);
  const setting = json?.value;
  const slowValue = setting === "light" || setting === "dark" || setting === "system" ? setting : "system";
  ephemeralConfig.set("theme-setting", slowValue);
  getLogger().info("got slow theme-setting value", slowValue);
  return slowValue;
}
async function getResolvedThemeSetting(options) {
  const theme = await getThemeSetting(options);
  if (theme === "system") {
    return import_electron.nativeTheme.shouldUseDarkColors ? import_Util.ThemeType.dark : import_Util.ThemeType.light;
  }
  return import_Util.ThemeType[theme];
}
async function getBackgroundColor(options) {
  const theme = await getResolvedThemeSetting(options);
  if (theme === "light") {
    return "#3a76f0";
  }
  if (theme === "dark") {
    return "#121212";
  }
  throw (0, import_missingCaseError.missingCaseError)(theme);
}
let systemTrayService;
const systemTraySettingCache = new import_SystemTraySettingCache.SystemTraySettingCache(sql, ephemeralConfig, process.argv, import_electron.app.getVersion());
const windowFromUserConfig = userConfig.get("window");
const windowFromEphemeral = ephemeralConfig.get("window");
const windowConfigSchema = import_zod.z.object({
  maximized: import_zod.z.boolean().optional(),
  autoHideMenuBar: import_zod.z.boolean().optional(),
  fullscreen: import_zod.z.boolean().optional(),
  width: import_zod.z.number(),
  height: import_zod.z.number(),
  x: import_zod.z.number(),
  y: import_zod.z.number()
});
let windowConfig;
const windowConfigParsed = windowConfigSchema.safeParse(windowFromEphemeral || windowFromUserConfig);
if (windowConfigParsed.success) {
  windowConfig = windowConfigParsed.data;
}
if (windowFromUserConfig) {
  userConfig.set("window", null);
  ephemeralConfig.set("window", windowConfig);
}
let menuOptions;
let logger;
let locale;
let settingsChannel;
function getLogger() {
  if (!logger) {
    console.warn("getLogger: Logger not yet initialized!");
    return import_consoleLogger.consoleLogger;
  }
  return logger;
}
function getLocale() {
  if (!locale) {
    throw new Error("getLocale: Locale not yet initialized!");
  }
  return locale;
}
async function prepareFileUrl(pathSegments, options = {}) {
  const filePath = (0, import_path.join)(...pathSegments);
  const fileUrl = (0, import_url.pathToFileURL)(filePath);
  return prepareUrl(fileUrl, options);
}
async function prepareUrl(url, { forCalling, forCamera } = {}) {
  const theme = await getResolvedThemeSetting();
  const directoryConfig = import_RendererConfig.directoryConfigSchema.safeParse({
    directoryVersion: import_config.default.get("directoryVersion") || 1,
    directoryUrl: import_config.default.get("directoryUrl") || void 0,
    directoryEnclaveId: import_config.default.get("directoryEnclaveId") || void 0,
    directoryTrustAnchor: import_config.default.get("directoryTrustAnchor") || void 0,
    directoryV2Url: import_config.default.get("directoryV2Url") || void 0,
    directoryV2PublicKey: import_config.default.get("directoryV2PublicKey") || void 0,
    directoryV2CodeHashes: import_config.default.get("directoryV2CodeHashes") || void 0,
    directoryV3Url: import_config.default.get("directoryV3Url") || void 0,
    directoryV3MRENCLAVE: import_config.default.get("directoryV3MRENCLAVE") || void 0
  });
  if (!directoryConfig.success) {
    throw new Error(`prepareUrl: Failed to parse renderer directory config ${JSON.stringify(directoryConfig.error.flatten())}`);
  }
  const urlParams = {
    name: import_package.default.productName,
    locale: getLocale().name,
    version: import_electron.app.getVersion(),
    buildCreation: import_config.default.get("buildCreation"),
    buildExpiration: import_config.default.get("buildExpiration"),
    serverUrl: import_config.default.get("serverUrl"),
    storageUrl: import_config.default.get("storageUrl"),
    updatesUrl: import_config.default.get("updatesUrl"),
    cdnUrl0: import_config.default.get("cdn").get("0"),
    cdnUrl2: import_config.default.get("cdn").get("2"),
    certificateAuthority: import_config.default.get("certificateAuthority"),
    environment: enableCI ? import_environment.Environment.Production : (0, import_environment.getEnvironment)(),
    enableCI,
    nodeVersion: process.versions.node,
    hostname: os.hostname(),
    appInstance: process.env.NODE_APP_INSTANCE || void 0,
    proxyUrl: process.env.HTTPS_PROXY || process.env.https_proxy || void 0,
    contentProxyUrl: import_config.default.get("contentProxyUrl"),
    sfuUrl: import_config.default.get("sfuUrl"),
    reducedMotionSetting: animationSettings.prefersReducedMotion,
    serverPublicParams: import_config.default.get("serverPublicParams"),
    serverTrustRoot: import_config.default.get("serverTrustRoot"),
    theme,
    appStartInitialSpellcheckSetting,
    userDataPath: import_electron.app.getPath("userData"),
    homePath: import_electron.app.getPath("home"),
    crashDumpsPath: import_electron.app.getPath("crashDumps"),
    directoryConfig: directoryConfig.data,
    isMainWindowFullScreen: Boolean(mainWindow?.isFullScreen()),
    isMainWindowMaximized: Boolean(mainWindow?.isMaximized()),
    argv: JSON.stringify(process.argv),
    forCalling: Boolean(forCalling),
    forCamera: Boolean(forCamera)
  };
  const parsed = import_RendererConfig.rendererConfigSchema.safeParse(urlParams);
  if (!parsed.success) {
    throw new Error(`prepareUrl: Failed to parse renderer config ${JSON.stringify(parsed.error.flatten())}`);
  }
  return (0, import_url2.setUrlSearchParams)(url, { config: JSON.stringify(parsed.data) }).href;
}
async function handleUrl(event, rawTarget) {
  event.preventDefault();
  const parsedUrl = (0, import_url2.maybeParseUrl)(rawTarget);
  if (!parsedUrl) {
    return;
  }
  const target = (0, import_sgnlHref.rewriteSignalHrefsIfNecessary)(rawTarget);
  const { protocol, hostname } = parsedUrl;
  const isDevServer = process.env.SIGNAL_ENABLE_HTTP && hostname === "localhost";
  if ((0, import_sgnlHref.isSgnlHref)(target, getLogger()) || (0, import_sgnlHref.isSignalHttpsLink)(target, getLogger())) {
    handleSgnlHref(target);
    return;
  }
  if ((protocol === "http:" || protocol === "https:") && !isDevServer) {
    try {
      await import_electron.shell.openExternal(target);
    } catch (error) {
      getLogger().error(`Failed to open url: ${error.stack}`);
    }
  }
}
function handleCommonWindowEvents(window, titleBarOverlay = false) {
  window.webContents.on("will-navigate", handleUrl);
  window.webContents.on("new-window", handleUrl);
  window.webContents.on("preload-error", (_event, preloadPath, error) => {
    getLogger().error(`Preload error in ${preloadPath}: `, error.message);
  });
  activeWindows.add(window);
  window.on("closed", () => activeWindows.delete(window));
  const setWindowFocus = /* @__PURE__ */ __name(() => {
    window.webContents.send("set-window-focus", window.isFocused());
  }, "setWindowFocus");
  window.on("focus", setWindowFocus);
  window.on("blur", setWindowFocus);
  window.once("ready-to-show", setWindowFocus);
  const focusInterval = setInterval(setWindowFocus, 1e4);
  window.on("closed", () => clearInterval(focusInterval));
  let lastZoomFactor = window.webContents.getZoomFactor();
  const onZoomChanged = /* @__PURE__ */ __name(() => {
    if (window.isDestroyed() || !window.webContents || window.webContents.isDestroyed()) {
      return;
    }
    const zoomFactor = window.webContents.getZoomFactor();
    if (lastZoomFactor === zoomFactor) {
      return;
    }
    settingsChannel?.invokeCallbackInMainWindow("persistZoomFactor", [
      zoomFactor
    ]);
    lastZoomFactor = zoomFactor;
  }, "onZoomChanged");
  window.webContents.on("preferred-size-changed", onZoomChanged);
  nativeThemeNotifier.addWindow(window);
  if (titleBarOverlay) {
    const onThemeChange = /* @__PURE__ */ __name(async () => {
      try {
        const newOverlay = await getTitleBarOverlay();
        if (!newOverlay) {
          return;
        }
        window.setTitleBarOverlay(newOverlay);
      } catch (error) {
        console.error("onThemeChange error", error);
      }
    }, "onThemeChange");
    import_electron.nativeTheme.on("updated", onThemeChange);
    settingsChannel?.on("change:themeSetting", onThemeChange);
  }
}
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 610;
const MIN_WIDTH = 712;
const MIN_HEIGHT = 550;
const BOUNDS_BUFFER = 100;
function isVisible(window, bounds) {
  const boundsX = bounds?.x || 0;
  const boundsY = bounds?.y || 0;
  const boundsWidth = bounds?.width || DEFAULT_WIDTH;
  const boundsHeight = bounds?.height || DEFAULT_HEIGHT;
  const rightSideClearOfLeftBound = window.x + window.width >= boundsX + BOUNDS_BUFFER;
  const leftSideClearOfRightBound = window.x <= boundsX + boundsWidth - BOUNDS_BUFFER;
  const topClearOfUpperBound = window.y >= boundsY;
  const topClearOfLowerBound = window.y <= boundsY + boundsHeight - BOUNDS_BUFFER;
  return rightSideClearOfLeftBound && leftSideClearOfRightBound && topClearOfUpperBound && topClearOfLowerBound;
}
let windowIcon;
if (OS.isWindows()) {
  windowIcon = (0, import_path.join)(__dirname, "../build/icons/win/icon.ico");
} else if (OS.isLinux()) {
  windowIcon = (0, import_path.join)(__dirname, "../images/signal-logo-desktop-linux.png");
} else {
  windowIcon = (0, import_path.join)(__dirname, "../build/icons/png/512x512.png");
}
const mainTitleBarStyle = (OS.isMacOS() || OS.hasCustomTitleBar()) && !(0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)()) ? "hidden" : "default";
const nonMainTitleBarStyle = OS.hasCustomTitleBar() ? "hidden" : "default";
async function getTitleBarOverlay() {
  if (!OS.hasCustomTitleBar()) {
    return false;
  }
  const theme = await getResolvedThemeSetting();
  let color;
  let symbolColor;
  if (theme === "light") {
    color = "#e8e8e8";
    symbolColor = "#1b1b1b";
  } else if (theme === "dark") {
    color = "#2e2e2e";
    symbolColor = "#e9e9e9";
  } else {
    throw (0, import_missingCaseError.missingCaseError)(theme);
  }
  return {
    color,
    symbolColor,
    height: 28 - 1
  };
}
async function createWindow() {
  const usePreloadBundle = !(0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)()) || forcePreloadBundle;
  const titleBarOverlay = await getTitleBarOverlay();
  const windowOptions = {
    show: false,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    autoHideMenuBar: false,
    titleBarStyle: mainTitleBarStyle,
    titleBarOverlay,
    backgroundColor: (0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)()) ? "#ffffff" : await getBackgroundColor(),
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: false,
      preload: (0, import_path.join)(__dirname, usePreloadBundle ? "../preload.bundle.js" : "../ts/windows/main/preload.js"),
      spellcheck: await getSpellCheckSetting(),
      backgroundThrottling: isThrottlingEnabled,
      enablePreferredSizeMode: true,
      disableBlinkFeatures: "Accelerated2dCanvas,AcceleratedSmallCanvases"
    },
    icon: windowIcon,
    ...(0, import_lodash.pick)(windowConfig, ["autoHideMenuBar", "width", "height", "x", "y"])
  };
  if (!(0, import_lodash.isNumber)(windowOptions.width) || windowOptions.width < MIN_WIDTH) {
    windowOptions.width = DEFAULT_WIDTH;
  }
  if (!(0, import_lodash.isNumber)(windowOptions.height) || windowOptions.height < MIN_HEIGHT) {
    windowOptions.height = DEFAULT_HEIGHT;
  }
  if (!(0, import_lodash.isBoolean)(windowOptions.autoHideMenuBar)) {
    delete windowOptions.autoHideMenuBar;
  }
  const startInTray = await systemTraySettingCache.get() === import_SystemTraySetting.SystemTraySetting.MinimizeToAndStartInSystemTray;
  const visibleOnAnyScreen = (0, import_lodash.some)(import_electron.screen.getAllDisplays(), (display) => {
    if ((0, import_lodash.isNumber)(windowOptions.x) && (0, import_lodash.isNumber)(windowOptions.y) && (0, import_lodash.isNumber)(windowOptions.width) && (0, import_lodash.isNumber)(windowOptions.height)) {
      return isVisible(windowOptions, (0, import_lodash.get)(display, "bounds"));
    }
    getLogger().error("visibleOnAnyScreen: windowOptions didn't have valid bounds fields");
    return false;
  });
  if (!visibleOnAnyScreen) {
    getLogger().info("Location reset needed");
    delete windowOptions.x;
    delete windowOptions.y;
  }
  getLogger().info("Initializing BrowserWindow config:", JSON.stringify(windowOptions));
  mainWindow = new import_electron.BrowserWindow(windowOptions);
  if (settingsChannel) {
    settingsChannel.setMainWindow(mainWindow);
  }
  mainWindowCreated = true;
  (0, import_spell_check.setup)(mainWindow, getLocale());
  if (!startInTray && windowConfig && windowConfig.maximized) {
    mainWindow.maximize();
  }
  if (!startInTray && windowConfig && windowConfig.fullscreen) {
    mainWindow.setFullScreen(true);
  }
  if (systemTrayService) {
    systemTrayService.setMainWindow(mainWindow);
  }
  function saveWindowStats() {
    if (!windowConfig) {
      return;
    }
    getLogger().info("Updating BrowserWindow config: %s", JSON.stringify(windowConfig));
    ephemeralConfig.set("window", windowConfig);
  }
  const debouncedSaveStats = (0, import_lodash.debounce)(saveWindowStats, 500);
  function captureWindowStats() {
    if (!mainWindow) {
      return;
    }
    const size = mainWindow.getSize();
    const position = mainWindow.getPosition();
    const newWindowConfig = {
      maximized: mainWindow.isMaximized(),
      autoHideMenuBar: mainWindow.autoHideMenuBar,
      fullscreen: mainWindow.isFullScreen(),
      width: size[0],
      height: size[1],
      x: position[0],
      y: position[1]
    };
    if (newWindowConfig.fullscreen !== windowConfig?.fullscreen || newWindowConfig.maximized !== windowConfig?.maximized) {
      mainWindow.webContents.send("window:set-window-stats", {
        isMaximized: newWindowConfig.maximized,
        isFullScreen: newWindowConfig.fullscreen
      });
    }
    windowConfig = newWindowConfig;
    if (!windowState.requestedShutdown()) {
      debouncedSaveStats();
    }
  }
  mainWindow.on("resize", captureWindowStats);
  mainWindow.on("move", captureWindowStats);
  if ((0, import_environment.getEnvironment)() === import_environment.Environment.Test) {
    mainWindow.loadURL(await prepareFileUrl([__dirname, "../test/index.html"]));
  } else {
    mainWindow.loadURL(await prepareFileUrl([__dirname, "../background.html"]));
  }
  if (!enableCI && import_config.default.get("openDevTools")) {
    mainWindow.webContents.openDevTools();
  }
  handleCommonWindowEvents(mainWindow, titleBarOverlay);
  bounce.init(mainWindow);
  mainWindow.on("close", async (e) => {
    if (!mainWindow) {
      getLogger().info("close event: no main window");
      return;
    }
    getLogger().info("close event", {
      readyForShutdown: windowState.readyForShutdown(),
      shouldQuit: windowState.shouldQuit()
    });
    if ((0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)()) || windowState.readyForShutdown() && windowState.shouldQuit()) {
      return;
    }
    e.preventDefault();
    if (mainWindow.isFullScreen()) {
      mainWindow.once("leave-full-screen", () => mainWindow?.hide());
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.hide();
    }
    const usingTrayIcon = (0, import_SystemTraySetting.shouldMinimizeToSystemTray)(await systemTraySettingCache.get());
    if (!windowState.shouldQuit() && (usingTrayIcon || OS.isMacOS())) {
      return;
    }
    windowState.markRequestedShutdown();
    await requestShutdown();
    windowState.markReadyForShutdown();
    await sql.close();
    import_electron.app.quit();
  });
  mainWindow.on("closed", () => {
    mainWindow = void 0;
    if (settingsChannel) {
      settingsChannel.setMainWindow(mainWindow);
    }
    if (systemTrayService) {
      systemTrayService.setMainWindow(mainWindow);
    }
  });
  mainWindow.on("enter-full-screen", () => {
    if (mainWindow) {
      mainWindow.webContents.send("full-screen-change", true);
    }
  });
  mainWindow.on("leave-full-screen", () => {
    if (mainWindow) {
      mainWindow.webContents.send("full-screen-change", false);
    }
  });
  mainWindow.once("ready-to-show", async () => {
    getLogger().info("main window is ready-to-show");
    await sqlInitPromise;
    if (!mainWindow) {
      return;
    }
    const shouldShowWindow = !import_electron.app.getLoginItemSettings().wasOpenedAsHidden && !startInTray;
    if (shouldShowWindow) {
      getLogger().info("showing main window");
      mainWindow.show();
    }
  });
}
import_electron.ipcMain.on("database-ready", async (event) => {
  if (!sqlInitPromise) {
    getLogger().error("database-ready requested, but sqlInitPromise is falsey");
    return;
  }
  const { error } = await sqlInitPromise;
  if (error) {
    getLogger().error("database-ready requested, but got sql error", error && error.stack);
    return;
  }
  getLogger().info("sending `database-ready`");
  event.sender.send("database-ready");
});
import_electron.ipcMain.on("show-window", () => {
  showWindow();
});
import_electron.ipcMain.on("title-bar-double-click", () => {
  if (!mainWindow) {
    return;
  }
  if (OS.isMacOS()) {
    switch (import_electron.systemPreferences.getUserDefault("AppleActionOnDoubleClick", "string")) {
      case "Minimize":
        mainWindow.minimize();
        break;
      case "Maximize":
        (0, import_toggleMaximizedBrowserWindow.toggleMaximizedBrowserWindow)(mainWindow);
        break;
      default:
        break;
    }
  } else {
    (0, import_toggleMaximizedBrowserWindow.toggleMaximizedBrowserWindow)(mainWindow);
  }
});
import_electron.ipcMain.on("set-is-call-active", (_event, isCallActive) => {
  preventDisplaySleepService.setEnabled(isCallActive);
  if (!mainWindow) {
    return;
  }
  if (!isThrottlingEnabled) {
    return;
  }
  let backgroundThrottling;
  if (isCallActive) {
    getLogger().info("Background throttling disabled because a call is active");
    backgroundThrottling = false;
  } else {
    getLogger().info("Background throttling enabled because no call is active");
    backgroundThrottling = true;
  }
  mainWindow.webContents.setBackgroundThrottling(backgroundThrottling);
});
import_electron.ipcMain.on("convert-image", async (event, uuid, data) => {
  const { error, response } = await heicConverter(uuid, data);
  event.reply(`convert-image:${uuid}`, { error, response });
});
let isReadyForUpdates = false;
async function readyForUpdates() {
  if (isReadyForUpdates) {
    return;
  }
  isReadyForUpdates = true;
  const incomingHref = getIncomingHref(process.argv);
  if (incomingHref) {
    handleSgnlHref(incomingHref);
  }
  try {
    (0, import_assert.strictAssert)(settingsChannel !== void 0, "SettingsChannel must be initialized");
    await updater.start(settingsChannel, getLogger(), getMainWindow);
  } catch (error) {
    getLogger().error("Error starting update checks:", error && error.stack ? error.stack : error);
  }
}
async function forceUpdate() {
  try {
    getLogger().info("starting force update");
    await updater.force();
  } catch (error) {
    getLogger().error("Error during force update:", error && error.stack ? error.stack : error);
  }
}
import_electron.ipcMain.once("ready-for-updates", readyForUpdates);
const TEN_MINUTES = 10 * 60 * 1e3;
setTimeout(readyForUpdates, TEN_MINUTES);
function openContactUs() {
  import_electron.shell.openExternal((0, import_createSupportUrl.createSupportUrl)({ locale: import_electron.app.getLocale() }));
}
function openJoinTheBeta() {
  import_electron.shell.openExternal("https://support.signal.org/hc/articles/360007318471");
}
function openReleaseNotes() {
  if (mainWindow && mainWindow.isVisible()) {
    mainWindow.webContents.send("show-release-notes");
    return;
  }
  import_electron.shell.openExternal(`https://github.com/signalapp/Signal-Desktop/releases/tag/v${import_electron.app.getVersion()}`);
}
function openSupportPage() {
  import_electron.shell.openExternal("https://support.signal.org/hc/sections/360001602812");
}
function openForums() {
  import_electron.shell.openExternal("https://community.signalusers.org/");
}
function showKeyboardShortcuts() {
  if (mainWindow) {
    mainWindow.webContents.send("show-keyboard-shortcuts");
  }
}
function setupAsNewDevice() {
  if (mainWindow) {
    mainWindow.webContents.send("set-up-as-new-device");
  }
}
function setupAsStandalone() {
  if (mainWindow) {
    mainWindow.webContents.send("set-up-as-standalone");
  }
}
let screenShareWindow;
async function showScreenShareWindow(sourceName) {
  if (screenShareWindow) {
    screenShareWindow.showInactive();
    return;
  }
  const width = 480;
  const display = import_electron.screen.getPrimaryDisplay();
  const options = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    backgroundColor: "#2e2e2e",
    darkTheme: true,
    frame: false,
    fullscreenable: false,
    height: 44,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    title: getLocale().i18n("screenShareWindow"),
    titleBarStyle: nonMainTitleBarStyle,
    width,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: (0, import_path.join)(__dirname, "../ts/windows/screenShare/preload.js")
    },
    x: Math.floor(display.size.width / 2) - width / 2,
    y: 24
  };
  screenShareWindow = new import_electron.BrowserWindow(options);
  handleCommonWindowEvents(screenShareWindow);
  screenShareWindow.loadURL(await prepareFileUrl([__dirname, "../screenShare.html"]));
  screenShareWindow.on("closed", () => {
    screenShareWindow = void 0;
  });
  screenShareWindow.once("ready-to-show", () => {
    if (screenShareWindow) {
      screenShareWindow.showInactive();
      screenShareWindow.webContents.send("render-screen-sharing-controller", sourceName);
    }
  });
}
let aboutWindow;
async function showAbout() {
  if (aboutWindow) {
    aboutWindow.show();
    return;
  }
  const titleBarOverlay = await getTitleBarOverlay();
  const options = {
    width: 500,
    height: 500,
    resizable: false,
    title: getLocale().i18n("aboutSignalDesktop"),
    titleBarStyle: nonMainTitleBarStyle,
    titleBarOverlay,
    autoHideMenuBar: true,
    backgroundColor: await getBackgroundColor(),
    show: false,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: (0, import_path.join)(__dirname, "../ts/windows/about/preload.js"),
      nativeWindowOpen: true
    }
  };
  aboutWindow = new import_electron.BrowserWindow(options);
  handleCommonWindowEvents(aboutWindow, titleBarOverlay);
  aboutWindow.loadURL(await prepareFileUrl([__dirname, "../about.html"]));
  aboutWindow.on("closed", () => {
    aboutWindow = void 0;
  });
  aboutWindow.once("ready-to-show", () => {
    if (aboutWindow) {
      aboutWindow.show();
    }
  });
}
let settingsWindow;
async function showSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.show();
    return;
  }
  const titleBarOverlay = await getTitleBarOverlay();
  const options = {
    width: 700,
    height: 700,
    frame: true,
    resizable: false,
    title: getLocale().i18n("signalDesktopPreferences"),
    titleBarStyle: nonMainTitleBarStyle,
    titleBarOverlay,
    autoHideMenuBar: true,
    backgroundColor: await getBackgroundColor(),
    show: false,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: (0, import_path.join)(__dirname, "../ts/windows/settings/preload.js"),
      nativeWindowOpen: true
    }
  };
  settingsWindow = new import_electron.BrowserWindow(options);
  handleCommonWindowEvents(settingsWindow, titleBarOverlay);
  settingsWindow.loadURL(await prepareFileUrl([__dirname, "../settings.html"]));
  settingsWindow.on("closed", () => {
    settingsWindow = void 0;
  });
  import_electron.ipcMain.once("settings-done-rendering", () => {
    if (!settingsWindow) {
      getLogger().warn("settings-done-rendering: no settingsWindow available!");
      return;
    }
    settingsWindow.show();
  });
}
async function getIsLinked() {
  try {
    const number = await sql.sqlCall("getItemById", ["number_id"]);
    const password = await sql.sqlCall("getItemById", ["password"]);
    return Boolean(number && password);
  } catch (e) {
    return false;
  }
}
let stickerCreatorWindow;
async function showStickerCreator() {
  if (!await getIsLinked()) {
    const message = getLocale().i18n("StickerCreator--Authentication--error");
    import_electron.dialog.showMessageBox({
      type: "warning",
      message
    });
    return;
  }
  if (stickerCreatorWindow) {
    stickerCreatorWindow.show();
    return;
  }
  const { x = 0, y = 0 } = windowConfig || {};
  const titleBarOverlay = await getTitleBarOverlay();
  const options = {
    x: x + 100,
    y: y + 100,
    width: 800,
    minWidth: 800,
    height: 650,
    title: getLocale().i18n("signalDesktopStickerCreator"),
    titleBarStyle: nonMainTitleBarStyle,
    titleBarOverlay,
    autoHideMenuBar: true,
    backgroundColor: await getBackgroundColor(),
    show: false,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: false,
      preload: (0, import_path.join)(__dirname, "../sticker-creator/preload.js"),
      nativeWindowOpen: true,
      spellcheck: await getSpellCheckSetting()
    }
  };
  stickerCreatorWindow = new import_electron.BrowserWindow(options);
  (0, import_spell_check.setup)(stickerCreatorWindow, getLocale());
  handleCommonWindowEvents(stickerCreatorWindow, titleBarOverlay);
  const appUrl = process.env.SIGNAL_ENABLE_HTTP ? prepareUrl(new URL("http://localhost:6380/sticker-creator/dist/index.html")) : prepareFileUrl([__dirname, "../sticker-creator/dist/index.html"]);
  stickerCreatorWindow.loadURL(await appUrl);
  stickerCreatorWindow.on("closed", () => {
    stickerCreatorWindow = void 0;
  });
  stickerCreatorWindow.once("ready-to-show", () => {
    if (!stickerCreatorWindow) {
      return;
    }
    stickerCreatorWindow.show();
    if (import_config.default.get("openDevTools")) {
      stickerCreatorWindow.webContents.openDevTools();
    }
  });
}
let debugLogWindow;
async function showDebugLogWindow() {
  if (debugLogWindow) {
    debugLogWindow.show();
    return;
  }
  const titleBarOverlay = await getTitleBarOverlay();
  const options = {
    width: 700,
    height: 500,
    resizable: false,
    title: getLocale().i18n("debugLog"),
    titleBarStyle: nonMainTitleBarStyle,
    titleBarOverlay,
    autoHideMenuBar: true,
    backgroundColor: await getBackgroundColor(),
    show: false,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: (0, import_path.join)(__dirname, "../ts/windows/debuglog/preload.js"),
      nativeWindowOpen: true
    },
    parent: mainWindow,
    fullscreenable: !OS.isMacOS()
  };
  debugLogWindow = new import_electron.BrowserWindow(options);
  handleCommonWindowEvents(debugLogWindow, titleBarOverlay);
  debugLogWindow.loadURL(await prepareFileUrl([__dirname, "../debug_log.html"]));
  debugLogWindow.on("closed", () => {
    debugLogWindow = void 0;
  });
  debugLogWindow.once("ready-to-show", () => {
    if (debugLogWindow) {
      debugLogWindow.show();
      debugLogWindow.center();
    }
  });
}
let permissionsPopupWindow;
function showPermissionsPopupWindow(forCalling, forCamera) {
  return new Promise(async (resolveFn, reject) => {
    if (permissionsPopupWindow) {
      permissionsPopupWindow.show();
      reject(new Error("Permission window already showing"));
      return;
    }
    if (!mainWindow) {
      reject(new Error("No main window"));
      return;
    }
    const size = mainWindow.getSize();
    const options = {
      width: Math.min(400, size[0]),
      height: Math.min(150, size[1]),
      resizable: false,
      title: getLocale().i18n("allowAccess"),
      titleBarStyle: nonMainTitleBarStyle,
      autoHideMenuBar: true,
      backgroundColor: await getBackgroundColor(),
      show: false,
      modal: true,
      webPreferences: {
        ...defaultWebPrefs,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        contextIsolation: true,
        preload: (0, import_path.join)(__dirname, "../ts/windows/permissions/preload.js"),
        nativeWindowOpen: true
      },
      parent: mainWindow
    };
    permissionsPopupWindow = new import_electron.BrowserWindow(options);
    handleCommonWindowEvents(permissionsPopupWindow);
    permissionsPopupWindow.loadURL(await prepareFileUrl([__dirname, "../permissions_popup.html"], {
      forCalling,
      forCamera
    }));
    permissionsPopupWindow.on("closed", () => {
      removeDarkOverlay();
      permissionsPopupWindow = void 0;
      resolveFn();
    });
    permissionsPopupWindow.once("ready-to-show", () => {
      if (permissionsPopupWindow) {
        addDarkOverlay();
        permissionsPopupWindow.show();
      }
    });
  });
}
const runSQLCorruptionHandler = /* @__PURE__ */ __name(async () => {
  const error = await sql.whenCorrupted();
  getLogger().error(`Detected sql corruption in main process. Restarting the application immediately. Error: ${error.message}`);
  await onDatabaseError(error.stack || error.message);
}, "runSQLCorruptionHandler");
async function initializeSQL(userDataPath) {
  let key;
  const keyFromConfig = userConfig.get("key");
  if (typeof keyFromConfig === "string") {
    key = keyFromConfig;
  } else if (keyFromConfig) {
    getLogger().warn("initializeSQL: got key from config, but it wasn't a string");
  }
  if (!key) {
    getLogger().info("key/initialize: Generating new encryption key, since we did not find it on disk");
    key = (0, import_crypto.randomBytes)(32).toString("hex");
    userConfig.set("key", key);
  }
  sqlInitTimeStart = Date.now();
  try {
    await sql.initialize({
      configDir: userDataPath,
      key,
      logger: getLogger()
    });
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new Error(`initializeSQL: Caught a non-error '${error}'`)
    };
  } finally {
    sqlInitTimeEnd = Date.now();
  }
  runSQLCorruptionHandler();
  return { ok: true, error: void 0 };
}
const onDatabaseError = /* @__PURE__ */ __name(async (error) => {
  ready = false;
  if (mainWindow) {
    settingsChannel?.invokeCallbackInMainWindow("closeDB", []);
    mainWindow.close();
  }
  mainWindow = void 0;
  const buttonIndex = import_electron.dialog.showMessageBoxSync({
    buttons: [
      getLocale().i18n("deleteAndRestart"),
      getLocale().i18n("copyErrorAndQuit")
    ],
    defaultId: 1,
    cancelId: 1,
    detail: (0, import_privacy.redactAll)(error),
    message: getLocale().i18n("databaseError"),
    noLink: true,
    type: "error"
  });
  if (buttonIndex === 1) {
    import_electron.clipboard.writeText(`Database startup error:

${(0, import_privacy.redactAll)(error)}`);
  } else {
    await sql.removeDB();
    userConfig.remove();
    getLogger().error("onDatabaseError: Requesting immediate restart after quit");
    import_electron.app.relaunch();
  }
  getLogger().error("onDatabaseError: Quitting application");
  import_electron.app.exit(1);
}, "onDatabaseError");
let sqlInitPromise;
import_electron.ipcMain.on("database-error", (_event, error) => {
  onDatabaseError(error);
});
function getAppLocale() {
  return (0, import_environment.getEnvironment)() === import_environment.Environment.Test ? "en" : import_electron.app.getLocale();
}
import_electron.app.commandLine.appendSwitch("disable-features", "HardwareMediaKeyHandling");
import_electron.app.commandLine.appendSwitch("password-store", "basic");
let ready = false;
import_electron.app.on("ready", async () => {
  (0, import_updateDefaultSession.updateDefaultSession)(import_electron.session.defaultSession);
  const [userDataPath, crashDumpsPath] = await Promise.all([
    (0, import_fs_extra.realpath)(import_electron.app.getPath("userData")),
    (0, import_fs_extra.realpath)(import_electron.app.getPath("crashDumps"))
  ]);
  logger = await logging.initialize(getMainWindow);
  await (0, import_crashReports.setup)(getLogger);
  if (!locale) {
    const appLocale = getAppLocale();
    locale = (0, import_locale.load)({ appLocale, logger: getLogger() });
  }
  sqlInitPromise = initializeSQL(userDataPath);
  const startTime = Date.now();
  settingsChannel = new import_settingsChannel.SettingsChannel();
  settingsChannel.install();
  import_electron.ipcMain.once("signal-app-loaded", (event, info) => {
    const { preloadTime, connectTime, processedCount } = info;
    const loadTime = Date.now() - startTime;
    const sqlInitTime = sqlInitTimeEnd - sqlInitTimeStart;
    const messageTime = loadTime - preloadTime - connectTime;
    const messagesPerSec = processedCount * 1e3 / messageTime;
    const innerLogger = getLogger();
    innerLogger.info("App loaded - time:", loadTime);
    innerLogger.info("SQL init - time:", sqlInitTime);
    innerLogger.info("Preload - time:", preloadTime);
    innerLogger.info("WebSocket connect - time:", connectTime);
    innerLogger.info("Processed count:", processedCount);
    innerLogger.info("Messages per second:", messagesPerSec);
    event.sender.send("ci:event", "app-loaded", {
      loadTime,
      sqlInitTime,
      preloadTime,
      connectTime,
      processedCount,
      messagesPerSec
    });
  });
  const installPath = await (0, import_fs_extra.realpath)(import_electron.app.getAppPath());
  (0, import_privacy.addSensitivePath)(userDataPath);
  (0, import_privacy.addSensitivePath)(crashDumpsPath);
  if ((0, import_environment.getEnvironment)() !== import_environment.Environment.Test) {
    (0, import_protocol_filter.installFileHandler)({
      protocol: import_electron.protocol,
      userDataPath,
      installPath,
      isWindows: OS.isWindows()
    });
  }
  (0, import_protocol_filter.installWebHandler)({
    enableHttp: Boolean(process.env.SIGNAL_ENABLE_HTTP),
    protocol: import_electron.protocol
  });
  logger.info("app ready");
  logger.info(`starting version ${import_package.default.version}`);
  {
    let getMediaAccessStatus;
    if (import_electron.systemPreferences.getMediaAccessStatus) {
      getMediaAccessStatus = import_electron.systemPreferences.getMediaAccessStatus.bind(import_electron.systemPreferences);
    } else {
      getMediaAccessStatus = import_lodash.noop;
    }
    logger.info("media access status", getMediaAccessStatus("microphone"), getMediaAccessStatus("camera"));
  }
  GlobalErrors.updateLocale(locale.messages);
  const timeout = new Promise((resolveFn) => setTimeout(resolveFn, 3e3, "timeout"));
  const backgroundColor = await getBackgroundColor({ ephemeralOnly: true });
  Promise.race([sqlInitPromise, timeout]).then(async (maybeTimeout) => {
    if (maybeTimeout !== "timeout") {
      return;
    }
    getLogger().info("sql.initialize is taking more than three seconds; showing loading dialog");
    loadingWindow = new import_electron.BrowserWindow({
      show: false,
      width: 300,
      height: 265,
      resizable: false,
      frame: false,
      backgroundColor,
      webPreferences: {
        ...defaultWebPrefs,
        nodeIntegration: false,
        contextIsolation: true,
        preload: (0, import_path.join)(__dirname, "../ts/windows/loading/preload.js")
      },
      icon: windowIcon
    });
    loadingWindow.once("ready-to-show", async () => {
      if (!loadingWindow) {
        return;
      }
      loadingWindow.show();
      await sqlInitPromise;
      loadingWindow.destroy();
      loadingWindow = void 0;
    });
    loadingWindow.loadURL(await prepareFileUrl([__dirname, "../loading.html"]));
  });
  try {
    await attachments.clearTempPath(userDataPath);
  } catch (err) {
    logger.error("main/ready: Error deleting temp dir:", err && err.stack ? err.stack : err);
  }
  attachmentChannel.initialize({
    configDir: userDataPath,
    cleanupOrphanedAttachments
  });
  sqlChannels.initialize(sql);
  import_powerChannel.PowerChannel.initialize({
    send(event) {
      if (!mainWindow) {
        return;
      }
      mainWindow.webContents.send(event);
    }
  });
  await createWindow();
  const { error: sqlError } = await sqlInitPromise;
  if (sqlError) {
    getLogger().error("sql.initialize was unsuccessful; returning early");
    await onDatabaseError(sqlError.stack || sqlError.message);
    return;
  }
  appStartInitialSpellcheckSetting = await getSpellCheckSetting();
  try {
    const IDB_KEY = "indexeddb-delete-needed";
    const item = await sql.sqlCall("getItemById", [IDB_KEY]);
    if (item && item.value) {
      await sql.sqlCall("removeIndexedDBFiles", []);
      await sql.sqlCall("removeItemById", [IDB_KEY]);
    }
  } catch (err) {
    getLogger().error("(ready event handler) error deleting IndexedDB:", err && err.stack ? err.stack : err);
  }
  async function cleanupOrphanedAttachments() {
    const allAttachments = await attachments.getAllAttachments(userDataPath);
    const orphanedAttachments = await sql.sqlCall("removeKnownAttachments", [
      allAttachments
    ]);
    await attachments.deleteAll({
      userDataPath,
      attachments: orphanedAttachments
    });
    await attachments.deleteAllBadges({
      userDataPath,
      pathsToKeep: await sql.sqlCall("getAllBadgeImageFileLocalPaths", [])
    });
    const allStickers = await attachments.getAllStickers(userDataPath);
    const orphanedStickers = await sql.sqlCall("removeKnownStickers", [
      allStickers
    ]);
    await attachments.deleteAllStickers({
      userDataPath,
      stickers: orphanedStickers
    });
    const allDraftAttachments = await attachments.getAllDraftAttachments(userDataPath);
    const orphanedDraftAttachments = await sql.sqlCall("removeKnownDraftAttachments", [allDraftAttachments]);
    await attachments.deleteAllDraftAttachments({
      userDataPath,
      attachments: orphanedDraftAttachments
    });
  }
  ready = true;
  setupMenu();
  systemTrayService = new import_SystemTrayService.SystemTrayService({ messages: locale.messages });
  systemTrayService.setMainWindow(mainWindow);
  systemTrayService.setEnabled((0, import_SystemTraySetting.shouldMinimizeToSystemTray)(await systemTraySettingCache.get()));
  ensureFilePermissions([
    "config.json",
    "sql/db.sqlite",
    "sql/db.sqlite-wal",
    "sql/db.sqlite-shm"
  ]);
});
function setupMenu(options) {
  const { platform } = process;
  menuOptions = {
    development,
    devTools: defaultWebPrefs.devTools,
    includeSetup: false,
    isProduction: (0, import_version.isProduction)(import_electron.app.getVersion()),
    platform,
    forceUpdate,
    openContactUs,
    openForums,
    openJoinTheBeta,
    openReleaseNotes,
    openSupportPage,
    setupAsNewDevice,
    setupAsStandalone,
    showAbout,
    showDebugLog: showDebugLogWindow,
    showKeyboardShortcuts,
    showSettings: showSettingsWindow,
    showStickerCreator,
    showWindow,
    ...options
  };
  const template = (0, import_menu.createTemplate)(menuOptions, getLocale().messages);
  const menu = import_electron.Menu.buildFromTemplate(template);
  import_electron.Menu.setApplicationMenu(menu);
  mainWindow?.webContents.send("window:set-menu-options", {
    development: menuOptions.development,
    devTools: menuOptions.devTools,
    includeSetup: menuOptions.includeSetup,
    isProduction: menuOptions.isProduction,
    platform: menuOptions.platform
  });
}
async function requestShutdown() {
  if (!mainWindow || !mainWindow.webContents) {
    return;
  }
  getLogger().info("requestShutdown: Requesting close of mainWindow...");
  const request = new Promise((resolveFn) => {
    let timeout;
    if (!mainWindow) {
      resolveFn();
      return;
    }
    import_electron.ipcMain.once("now-ready-for-shutdown", (_event, error) => {
      getLogger().info("requestShutdown: Response received");
      if (error) {
        getLogger().error("requestShutdown: got error, still shutting down.", error);
      }
      (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
      resolveFn();
    });
    mainWindow.webContents.send("get-ready-for-shutdown");
    timeout = setTimeout(() => {
      getLogger().error("requestShutdown: Response never received; forcing shutdown.");
      resolveFn();
    }, 2 * 60 * 1e3);
  });
  try {
    await request;
  } catch (error) {
    getLogger().error("requestShutdown error:", error && error.stack ? error.stack : error);
  }
}
import_electron.app.on("before-quit", () => {
  getLogger().info("before-quit event", {
    readyForShutdown: windowState.readyForShutdown(),
    shouldQuit: windowState.shouldQuit()
  });
  systemTrayService?.markShouldQuit();
  windowState.markShouldQuit();
  if (mainWindow) {
    mainWindow.webContents.send("quit");
  }
});
import_electron.app.on("window-all-closed", () => {
  getLogger().info("main process handling window-all-closed");
  const shouldAutoClose = !OS.isMacOS() || (0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)());
  if (shouldAutoClose && mainWindowCreated) {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (!ready) {
    return;
  }
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
import_electron.app.on("web-contents-created", (_createEvent, contents) => {
  contents.on("will-attach-webview", (attachEvent) => {
    attachEvent.preventDefault();
  });
  contents.on("new-window", (newEvent) => {
    newEvent.preventDefault();
  });
});
import_electron.app.setAsDefaultProtocolClient("sgnl");
import_electron.app.setAsDefaultProtocolClient("signalcaptcha");
import_electron.app.on("will-finish-launching", () => {
  import_electron.app.on("open-url", (event, incomingHref) => {
    event.preventDefault();
    if ((0, import_sgnlHref.isCaptchaHref)(incomingHref, getLogger())) {
      const { captcha } = (0, import_sgnlHref.parseCaptchaHref)(incomingHref, getLogger());
      challengeHandler.handleCaptcha(captcha);
      showWindow();
      return;
    }
    handleSgnlHref(incomingHref);
  });
});
import_electron.ipcMain.on("set-badge-count", (_event, count) => {
  import_electron.app.badgeCount = count;
});
import_electron.ipcMain.on("remove-setup-menu-items", () => {
  setupMenu();
});
import_electron.ipcMain.on("add-setup-menu-items", () => {
  setupMenu({
    includeSetup: true
  });
});
import_electron.ipcMain.on("draw-attention", () => {
  if (!mainWindow) {
    return;
  }
  if (OS.isWindows() || OS.isLinux()) {
    mainWindow.flashFrame(true);
  }
});
import_electron.ipcMain.on("restart", () => {
  getLogger().info("Relaunching application");
  import_electron.app.relaunch();
  import_electron.app.quit();
});
import_electron.ipcMain.on("shutdown", () => {
  import_electron.app.quit();
});
import_electron.ipcMain.on("set-auto-hide-menu-bar", (_event, autoHide) => {
  if (mainWindow) {
    mainWindow.autoHideMenuBar = autoHide;
  }
});
import_electron.ipcMain.on("set-menu-bar-visibility", (_event, visibility) => {
  if (mainWindow) {
    mainWindow.setMenuBarVisibility(visibility);
  }
});
import_electron.ipcMain.on("update-system-tray-setting", (_event, rawSystemTraySetting) => {
  const systemTraySetting = (0, import_SystemTraySetting.parseSystemTraySetting)(rawSystemTraySetting);
  systemTraySettingCache.set(systemTraySetting);
  if (systemTrayService) {
    const isEnabled = (0, import_SystemTraySetting.shouldMinimizeToSystemTray)(systemTraySetting);
    systemTrayService.setEnabled(isEnabled);
  }
});
import_electron.ipcMain.on("close-screen-share-controller", () => {
  if (screenShareWindow) {
    screenShareWindow.close();
  }
});
import_electron.ipcMain.on("stop-screen-share", () => {
  if (mainWindow) {
    mainWindow.webContents.send("stop-screen-share");
  }
});
import_electron.ipcMain.on("show-screen-share", (_event, sourceName) => {
  showScreenShareWindow(sourceName);
});
import_electron.ipcMain.on("update-tray-icon", (_event, unreadCount) => {
  if (systemTrayService) {
    systemTrayService.setUnreadCount(unreadCount);
  }
});
import_electron.ipcMain.on("show-debug-log", showDebugLogWindow);
import_electron.ipcMain.on("show-debug-log-save-dialog", async (_event, logText) => {
  const { filePath } = await import_electron.dialog.showSaveDialog({
    defaultPath: "debuglog.txt"
  });
  if (filePath) {
    await (0, import_fs_extra.writeFile)(filePath, logText);
  }
});
import_electron.ipcMain.handle("show-permissions-popup", async (_event, forCalling, forCamera) => {
  try {
    await showPermissionsPopupWindow(forCalling, forCamera);
  } catch (error) {
    getLogger().error("show-permissions-popup error:", error && error.stack ? error.stack : error);
  }
});
function addDarkOverlay() {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("add-dark-overlay");
  }
}
function removeDarkOverlay() {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("remove-dark-overlay");
  }
}
import_electron.ipcMain.on("show-settings", showSettingsWindow);
import_electron.ipcMain.on("delete-all-data", () => {
  if (settingsWindow) {
    settingsWindow.close();
  }
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("delete-all-data");
  }
});
import_electron.ipcMain.on("get-built-in-images", async () => {
  if (!mainWindow) {
    getLogger().warn("ipc/get-built-in-images: No mainWindow!");
    return;
  }
  try {
    const images = await attachments.getBuiltInImages();
    mainWindow.webContents.send("get-success-built-in-images", null, images);
  } catch (error) {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("get-success-built-in-images", error.message);
    } else {
      getLogger().error("Error handling get-built-in-images:", error.stack);
    }
  }
});
import_electron.ipcMain.on("locale-data", (event) => {
  event.returnValue = getLocale().messages;
});
import_electron.ipcMain.on("user-config-key", (event) => {
  event.returnValue = userConfig.get("key");
});
import_electron.ipcMain.on("get-user-data-path", (event) => {
  event.returnValue = import_electron.app.getPath("userData");
});
import_electron.ipcMain.on("preferences-changed", () => {
  for (const window of activeWindows) {
    if (window.webContents) {
      window.webContents.send("preferences-changed");
    }
  }
});
function getIncomingHref(argv) {
  return argv.find((arg) => (0, import_sgnlHref.isSgnlHref)(arg, getLogger()));
}
function getIncomingCaptchaHref(argv) {
  return argv.find((arg) => (0, import_sgnlHref.isCaptchaHref)(arg, getLogger()));
}
function handleSgnlHref(incomingHref) {
  let command;
  let args;
  let hash;
  if ((0, import_sgnlHref.isSgnlHref)(incomingHref, getLogger())) {
    ({ command, args, hash } = (0, import_sgnlHref.parseSgnlHref)(incomingHref, getLogger()));
  } else if ((0, import_sgnlHref.isSignalHttpsLink)(incomingHref, getLogger())) {
    ({ command, args, hash } = (0, import_sgnlHref.parseSignalHttpsLink)(incomingHref, getLogger()));
  }
  if (mainWindow && mainWindow.webContents) {
    if (command === "addstickers") {
      getLogger().info("Opening sticker pack from sgnl protocol link");
      const packId = args?.get("pack_id");
      const packKeyHex = args?.get("pack_key");
      const packKey = packKeyHex ? Buffer.from(packKeyHex, "hex").toString("base64") : "";
      mainWindow.webContents.send("show-sticker-pack", { packId, packKey });
    } else if (command === "signal.group" && hash) {
      getLogger().info("Showing group from sgnl protocol link");
      mainWindow.webContents.send("show-group-via-link", { hash });
    } else if (command === "signal.me" && hash) {
      getLogger().info("Showing conversation from sgnl protocol link");
      mainWindow.webContents.send("show-conversation-via-signal.me", { hash });
    } else {
      getLogger().info("Showing warning that we cannot process link");
      mainWindow.webContents.send("unknown-sgnl-link");
    }
  } else {
    getLogger().error("Unhandled sgnl link");
  }
}
import_electron.ipcMain.on("install-sticker-pack", (_event, packId, packKeyHex) => {
  const packKey = Buffer.from(packKeyHex, "hex").toString("base64");
  if (mainWindow) {
    mainWindow.webContents.send("install-sticker-pack", { packId, packKey });
  }
});
import_electron.ipcMain.on("ensure-file-permissions", async (event) => {
  await ensureFilePermissions();
  event.reply("ensure-file-permissions-done");
});
async function ensureFilePermissions(onlyFiles) {
  getLogger().info("Begin ensuring permissions");
  const start = Date.now();
  const userDataPath = await (0, import_fs_extra.realpath)(import_electron.app.getPath("userData"));
  const userDataGlob = (0, import_normalize_path.default)((0, import_path.join)(userDataPath, "**", "*"));
  const files = onlyFiles ? onlyFiles.map((f) => (0, import_path.join)(userDataPath, f)) : await (0, import_fast_glob.default)(userDataGlob, {
    markDirectories: true,
    onlyFiles: false,
    ignore: ["**/Singleton*"]
  });
  getLogger().info(`Ensuring file permissions for ${files.length} files`);
  const q = new import_p_queue.default({ concurrency: 5, timeout: 1e3 * 60 * 2 });
  q.addAll(files.map((f) => async () => {
    const isDir = f.endsWith("/");
    try {
      await (0, import_fs_extra.chmod)((0, import_path.normalize)(f), isDir ? 448 : 384);
    } catch (error) {
      getLogger().error("ensureFilePermissions: Error from chmod", error.message);
    }
  }));
  await q.onEmpty();
  getLogger().info(`Finish ensuring permissions in ${Date.now() - start}ms`);
}
import_electron.ipcMain.handle("get-auto-launch", async () => {
  return import_electron.app.getLoginItemSettings().openAtLogin;
});
import_electron.ipcMain.handle("set-auto-launch", async (_event, value) => {
  import_electron.app.setLoginItemSettings({ openAtLogin: Boolean(value) });
});
import_electron.ipcMain.on("show-message-box", (_event, { type, message }) => {
  import_electron.dialog.showMessageBox({ type, message });
});
import_electron.ipcMain.on("show-item-in-folder", (_event, folder) => {
  import_electron.shell.showItemInFolder(folder);
});
import_electron.ipcMain.handle("show-save-dialog", async (_event, { defaultPath }) => {
  if (!mainWindow) {
    getLogger().warn("show-save-dialog: no main window");
    return { canceled: true };
  }
  return import_electron.dialog.showSaveDialog(mainWindow, {
    defaultPath
  });
});
import_electron.ipcMain.handle("getScreenCaptureSources", async () => {
  return import_electron.desktopCapturer.getSources({
    fetchWindowIcons: true,
    thumbnailSize: { height: 102, width: 184 },
    types: ["window", "screen"]
  });
});
import_electron.ipcMain.handle("executeMenuRole", async ({ sender }, untypedRole) => {
  const role = untypedRole;
  const senderWindow = import_electron.BrowserWindow.fromWebContents(sender);
  switch (role) {
    case "undo":
      sender.undo();
      break;
    case "redo":
      sender.redo();
      break;
    case "cut":
      sender.cut();
      break;
    case "copy":
      sender.copy();
      break;
    case "paste":
      sender.paste();
      break;
    case "pasteAndMatchStyle":
      sender.pasteAndMatchStyle();
      break;
    case "delete":
      sender.delete();
      break;
    case "selectAll":
      sender.selectAll();
      break;
    case "reload":
      sender.reload();
      break;
    case "toggleDevTools":
      sender.toggleDevTools();
      break;
    case "resetZoom":
      sender.setZoomLevel(0);
      break;
    case "zoomIn":
      sender.setZoomLevel(sender.getZoomLevel() + 1);
      break;
    case "zoomOut":
      sender.setZoomLevel(sender.getZoomLevel() - 1);
      break;
    case "togglefullscreen":
      senderWindow?.setFullScreen(!senderWindow?.isFullScreen());
      break;
    case "minimize":
      senderWindow?.minimize();
      break;
    case "close":
      senderWindow?.close();
      break;
    case "quit":
      import_electron.app.quit();
      break;
    default:
      break;
  }
});
import_electron.ipcMain.handle("getMainWindowStats", async () => {
  return {
    isMaximized: windowConfig?.maximized ?? false,
    isFullScreen: windowConfig?.fullscreen ?? false
  };
});
import_electron.ipcMain.handle("getMenuOptions", async () => {
  return {
    development: menuOptions?.development ?? false,
    devTools: menuOptions?.devTools ?? false,
    includeSetup: menuOptions?.includeSetup ?? false,
    isProduction: menuOptions?.isProduction ?? true,
    platform: menuOptions?.platform ?? "unknown"
  };
});
import_electron.ipcMain.handle("executeMenuAction", async (_event, action) => {
  if (action === "forceUpdate") {
    forceUpdate();
  } else if (action === "openContactUs") {
    openContactUs();
  } else if (action === "openForums") {
    openForums();
  } else if (action === "openJoinTheBeta") {
    openJoinTheBeta();
  } else if (action === "openReleaseNotes") {
    openReleaseNotes();
  } else if (action === "openSupportPage") {
    openSupportPage();
  } else if (action === "setupAsNewDevice") {
    setupAsNewDevice();
  } else if (action === "setupAsStandalone") {
    setupAsStandalone();
  } else if (action === "showAbout") {
    showAbout();
  } else if (action === "showDebugLog") {
    showDebugLogWindow();
  } else if (action === "showKeyboardShortcuts") {
    showKeyboardShortcuts();
  } else if (action === "showSettings") {
    showSettingsWindow();
  } else if (action === "showStickerCreator") {
    showStickerCreator();
  } else if (action === "showWindow") {
    showWindow();
  } else {
    throw (0, import_missingCaseError.missingCaseError)(action);
  }
});
if ((0, import_environment.isTestEnvironment)((0, import_environment.getEnvironment)())) {
  import_electron.ipcMain.handle("ci:test-electron:done", async (_event, info) => {
    if (!process.env.TEST_QUIT_ON_COMPLETE) {
      return;
    }
    process.stdout.write(`ci:test-electron:done=${JSON.stringify(info)}
`, () => import_electron.app.quit());
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  windowConfigSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTctMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8vIFRoaXMgaGFzIHRvIGJlIHRoZSBmaXJzdCBpbXBvcnQgYmVjYXVzZSBpdCBwYXRjaGVzIFwib3NcIiBtb2R1bGVcbmltcG9ydCAnLi4vdHMvdXRpbC9wYXRjaFdpbmRvd3M3SG9zdG5hbWUnO1xuXG5pbXBvcnQgeyBqb2luLCBub3JtYWxpemUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHBhdGhUb0ZpbGVVUkwgfSBmcm9tICd1cmwnO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHsgY2htb2QsIHJlYWxwYXRoLCB3cml0ZUZpbGUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyByYW5kb21CeXRlcyB9IGZyb20gJ2NyeXB0byc7XG5cbmltcG9ydCBub3JtYWxpemVQYXRoIGZyb20gJ25vcm1hbGl6ZS1wYXRoJztcbmltcG9ydCBmYXN0R2xvYiBmcm9tICdmYXN0LWdsb2InO1xuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCB7IGdldCwgcGljaywgaXNOdW1iZXIsIGlzQm9vbGVhbiwgc29tZSwgZGVib3VuY2UsIG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgYXBwLFxuICBCcm93c2VyV2luZG93LFxuICBjbGlwYm9hcmQsXG4gIGRlc2t0b3BDYXB0dXJlcixcbiAgZGlhbG9nLFxuICBpcGNNYWluIGFzIGlwYyxcbiAgTWVudSxcbiAgbmF0aXZlVGhlbWUsXG4gIHBvd2VyU2F2ZUJsb2NrZXIsXG4gIHByb3RvY29sIGFzIGVsZWN0cm9uUHJvdG9jb2wsXG4gIHNjcmVlbixcbiAgc2Vzc2lvbixcbiAgc2hlbGwsXG4gIHN5c3RlbVByZWZlcmVuY2VzLFxufSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgdHlwZSB7XG4gIE1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zLFxuICBUaXRsZUJhck92ZXJsYXlPcHRpb25zLFxufSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuaW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgKiBhcyBHbG9iYWxFcnJvcnMgZnJvbSAnLi9nbG9iYWxfZXJyb3JzJztcbmltcG9ydCB7IHNldHVwIGFzIHNldHVwQ3Jhc2hSZXBvcnRzIH0gZnJvbSAnLi9jcmFzaFJlcG9ydHMnO1xuaW1wb3J0IHsgc2V0dXAgYXMgc2V0dXBTcGVsbENoZWNrZXIgfSBmcm9tICcuL3NwZWxsX2NoZWNrJztcbmltcG9ydCB7IHJlZGFjdEFsbCwgYWRkU2Vuc2l0aXZlUGF0aCB9IGZyb20gJy4uL3RzL3V0aWwvcHJpdmFjeSc7XG5pbXBvcnQgeyBjcmVhdGVTdXBwb3J0VXJsIH0gZnJvbSAnLi4vdHMvdXRpbC9jcmVhdGVTdXBwb3J0VXJsJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi90cy91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdHMvdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgY29uc29sZUxvZ2dlciB9IGZyb20gJy4uL3RzL3V0aWwvY29uc29sZUxvZ2dlcic7XG5pbXBvcnQgdHlwZSB7IFRoZW1lU2V0dGluZ1R5cGUgfSBmcm9tICcuLi90cy90eXBlcy9TdG9yYWdlVUlLZXlzJztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uL3RzL3R5cGVzL1V0aWwnO1xuXG5pbXBvcnQgJy4vc3RhcnR1cF9jb25maWcnO1xuXG5pbXBvcnQgdHlwZSB7IENvbmZpZ1R5cGUgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgdHlwZSB7IFJlbmRlcmVyQ29uZmlnVHlwZSB9IGZyb20gJy4uL3RzL3R5cGVzL1JlbmRlcmVyQ29uZmlnJztcbmltcG9ydCB7XG4gIGRpcmVjdG9yeUNvbmZpZ1NjaGVtYSxcbiAgcmVuZGVyZXJDb25maWdTY2hlbWEsXG59IGZyb20gJy4uL3RzL3R5cGVzL1JlbmRlcmVyQ29uZmlnJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgRW52aXJvbm1lbnQsXG4gIGdldEVudmlyb25tZW50LFxuICBpc1Rlc3RFbnZpcm9ubWVudCxcbn0gZnJvbSAnLi4vdHMvZW52aXJvbm1lbnQnO1xuXG4vLyBWZXJ5IGltcG9ydGFudCB0byBwdXQgYmVmb3JlIHRoZSBzaW5nbGUgaW5zdGFuY2UgY2hlY2ssIHNpbmNlIGl0IGlzIGJhc2VkIG9uIHRoZVxuLy8gICB1c2VyRGF0YSBkaXJlY3RvcnkuIChzZWUgcmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jayBiZWxvdylcbmltcG9ydCAqIGFzIHVzZXJDb25maWcgZnJvbSAnLi91c2VyX2NvbmZpZyc7XG5cbi8vIFdlIGdlbmVyYWxseSB3YW50IHRvIHB1bGwgaW4gb3VyIG93biBtb2R1bGVzIGFmdGVyIHRoaXMgcG9pbnQsIGFmdGVyIHRoZSB1c2VyXG4vLyAgIGRhdGEgZGlyZWN0b3J5IGhhcyBiZWVuIHNldC5cbmltcG9ydCAqIGFzIGF0dGFjaG1lbnRzIGZyb20gJy4vYXR0YWNobWVudHMnO1xuaW1wb3J0ICogYXMgYXR0YWNobWVudENoYW5uZWwgZnJvbSAnLi9hdHRhY2htZW50X2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgYm91bmNlIGZyb20gJy4uL3RzL3NlcnZpY2VzL2JvdW5jZSc7XG5pbXBvcnQgKiBhcyB1cGRhdGVyIGZyb20gJy4uL3RzL3VwZGF0ZXIvaW5kZXgnO1xuaW1wb3J0IHsgdXBkYXRlRGVmYXVsdFNlc3Npb24gfSBmcm9tICcuL3VwZGF0ZURlZmF1bHRTZXNzaW9uJztcbmltcG9ydCB7IFByZXZlbnREaXNwbGF5U2xlZXBTZXJ2aWNlIH0gZnJvbSAnLi9QcmV2ZW50RGlzcGxheVNsZWVwU2VydmljZSc7XG5pbXBvcnQgeyBTeXN0ZW1UcmF5U2VydmljZSB9IGZyb20gJy4vU3lzdGVtVHJheVNlcnZpY2UnO1xuaW1wb3J0IHsgU3lzdGVtVHJheVNldHRpbmdDYWNoZSB9IGZyb20gJy4vU3lzdGVtVHJheVNldHRpbmdDYWNoZSc7XG5pbXBvcnQge1xuICBTeXN0ZW1UcmF5U2V0dGluZyxcbiAgc2hvdWxkTWluaW1pemVUb1N5c3RlbVRyYXksXG4gIHBhcnNlU3lzdGVtVHJheVNldHRpbmcsXG59IGZyb20gJy4uL3RzL3R5cGVzL1N5c3RlbVRyYXlTZXR0aW5nJztcbmltcG9ydCAqIGFzIGVwaGVtZXJhbENvbmZpZyBmcm9tICcuL2VwaGVtZXJhbF9jb25maWcnO1xuaW1wb3J0ICogYXMgbG9nZ2luZyBmcm9tICcuLi90cy9sb2dnaW5nL21haW5fcHJvY2Vzc19sb2dnaW5nJztcbmltcG9ydCB7IE1haW5TUUwgfSBmcm9tICcuLi90cy9zcWwvbWFpbic7XG5pbXBvcnQgKiBhcyBzcWxDaGFubmVscyBmcm9tICcuL3NxbF9jaGFubmVsJztcbmltcG9ydCAqIGFzIHdpbmRvd1N0YXRlIGZyb20gJy4vd2luZG93X3N0YXRlJztcbmltcG9ydCB0eXBlIHsgQ3JlYXRlVGVtcGxhdGVPcHRpb25zVHlwZSB9IGZyb20gJy4vbWVudSc7XG5pbXBvcnQgdHlwZSB7IE1lbnVBY3Rpb25UeXBlIH0gZnJvbSAnLi4vdHMvdHlwZXMvbWVudSc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wbGF0ZSB9IGZyb20gJy4vbWVudSc7XG5pbXBvcnQgeyBpbnN0YWxsRmlsZUhhbmRsZXIsIGluc3RhbGxXZWJIYW5kbGVyIH0gZnJvbSAnLi9wcm90b2NvbF9maWx0ZXInO1xuaW1wb3J0ICogYXMgT1MgZnJvbSAnLi4vdHMvT1MnO1xuaW1wb3J0IHsgaXNQcm9kdWN0aW9uIH0gZnJvbSAnLi4vdHMvdXRpbC92ZXJzaW9uJztcbmltcG9ydCB7XG4gIGlzU2dubEhyZWYsXG4gIGlzQ2FwdGNoYUhyZWYsXG4gIGlzU2lnbmFsSHR0cHNMaW5rLFxuICBwYXJzZVNnbmxIcmVmLFxuICBwYXJzZUNhcHRjaGFIcmVmLFxuICBwYXJzZVNpZ25hbEh0dHBzTGluayxcbiAgcmV3cml0ZVNpZ25hbEhyZWZzSWZOZWNlc3NhcnksXG59IGZyb20gJy4uL3RzL3V0aWwvc2dubEhyZWYnO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkgfSBmcm9tICcuLi90cy91dGlsL2NsZWFyVGltZW91dElmTmVjZXNzYXJ5JztcbmltcG9ydCB7IHRvZ2dsZU1heGltaXplZEJyb3dzZXJXaW5kb3cgfSBmcm9tICcuLi90cy91dGlsL3RvZ2dsZU1heGltaXplZEJyb3dzZXJXaW5kb3cnO1xuaW1wb3J0IHsgQ2hhbGxlbmdlTWFpbkhhbmRsZXIgfSBmcm9tICcuLi90cy9tYWluL2NoYWxsZW5nZU1haW4nO1xuaW1wb3J0IHsgTmF0aXZlVGhlbWVOb3RpZmllciB9IGZyb20gJy4uL3RzL21haW4vTmF0aXZlVGhlbWVOb3RpZmllcic7XG5pbXBvcnQgeyBQb3dlckNoYW5uZWwgfSBmcm9tICcuLi90cy9tYWluL3Bvd2VyQ2hhbm5lbCc7XG5pbXBvcnQgeyBTZXR0aW5nc0NoYW5uZWwgfSBmcm9tICcuLi90cy9tYWluL3NldHRpbmdzQ2hhbm5lbCc7XG5pbXBvcnQgeyBtYXliZVBhcnNlVXJsLCBzZXRVcmxTZWFyY2hQYXJhbXMgfSBmcm9tICcuLi90cy91dGlsL3VybCc7XG5pbXBvcnQgeyBnZXRIZWljQ29udmVydGVyIH0gZnJvbSAnLi4vdHMvd29ya2Vycy9oZWljQ29udmVydGVyTWFpbic7XG5cbmltcG9ydCB0eXBlIHsgTG9jYWxlVHlwZSB9IGZyb20gJy4vbG9jYWxlJztcbmltcG9ydCB7IGxvYWQgYXMgbG9hZExvY2FsZSB9IGZyb20gJy4vbG9jYWxlJztcblxuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi4vdHMvdHlwZXMvTG9nZ2luZyc7XG5cbmNvbnN0IGFuaW1hdGlvblNldHRpbmdzID0gc3lzdGVtUHJlZmVyZW5jZXMuZ2V0QW5pbWF0aW9uU2V0dGluZ3MoKTtcblxuLy8gS2VlcCBhIGdsb2JhbCByZWZlcmVuY2Ugb2YgdGhlIHdpbmRvdyBvYmplY3QsIGlmIHlvdSBkb24ndCwgdGhlIHdpbmRvdyB3aWxsXG4vLyAgIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxubGV0IG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQ7XG5sZXQgbWFpbldpbmRvd0NyZWF0ZWQgPSBmYWxzZTtcbmxldCBsb2FkaW5nV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuXG5jb25zdCBhY3RpdmVXaW5kb3dzID0gbmV3IFNldDxCcm93c2VyV2luZG93PigpO1xuXG5mdW5jdGlvbiBnZXRNYWluV2luZG93KCkge1xuICByZXR1cm4gbWFpbldpbmRvdztcbn1cblxuY29uc3QgZGV2ZWxvcG1lbnQgPVxuICBnZXRFbnZpcm9ubWVudCgpID09PSBFbnZpcm9ubWVudC5EZXZlbG9wbWVudCB8fFxuICBnZXRFbnZpcm9ubWVudCgpID09PSBFbnZpcm9ubWVudC5TdGFnaW5nO1xuXG5jb25zdCBpc1Rocm90dGxpbmdFbmFibGVkID0gZGV2ZWxvcG1lbnQgfHwgIWlzUHJvZHVjdGlvbihhcHAuZ2V0VmVyc2lvbigpKTtcblxuY29uc3QgZW5hYmxlQ0kgPSBjb25maWcuZ2V0PGJvb2xlYW4+KCdlbmFibGVDSScpO1xuY29uc3QgZm9yY2VQcmVsb2FkQnVuZGxlID0gY29uZmlnLmdldDxib29sZWFuPignZm9yY2VQcmVsb2FkQnVuZGxlJyk7XG5cbmNvbnN0IHByZXZlbnREaXNwbGF5U2xlZXBTZXJ2aWNlID0gbmV3IFByZXZlbnREaXNwbGF5U2xlZXBTZXJ2aWNlKFxuICBwb3dlclNhdmVCbG9ja2VyXG4pO1xuXG5jb25zdCBjaGFsbGVuZ2VIYW5kbGVyID0gbmV3IENoYWxsZW5nZU1haW5IYW5kbGVyKCk7XG5cbmNvbnN0IG5hdGl2ZVRoZW1lTm90aWZpZXIgPSBuZXcgTmF0aXZlVGhlbWVOb3RpZmllcigpO1xubmF0aXZlVGhlbWVOb3RpZmllci5pbml0aWFsaXplKCk7XG5cbmxldCBhcHBTdGFydEluaXRpYWxTcGVsbGNoZWNrU2V0dGluZyA9IHRydWU7XG5cbmNvbnN0IGRlZmF1bHRXZWJQcmVmcyA9IHtcbiAgZGV2VG9vbHM6XG4gICAgcHJvY2Vzcy5hcmd2LnNvbWUoYXJnID0+IGFyZyA9PT0gJy0tZW5hYmxlLWRldi10b29scycpIHx8XG4gICAgZ2V0RW52aXJvbm1lbnQoKSAhPT0gRW52aXJvbm1lbnQuUHJvZHVjdGlvbiB8fFxuICAgICFpc1Byb2R1Y3Rpb24oYXBwLmdldFZlcnNpb24oKSksXG4gIHNwZWxsY2hlY2s6IGZhbHNlLFxufTtcblxuZnVuY3Rpb24gc2hvd1dpbmRvdygpIHtcbiAgaWYgKCFtYWluV2luZG93KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVXNpbmcgZm9jdXMoKSBpbnN0ZWFkIG9mIHNob3coKSBzZWVtcyB0byBiZSBpbXBvcnRhbnQgb24gV2luZG93cyB3aGVuIG91ciB3aW5kb3dcbiAgLy8gICBoYXMgYmVlbiBkb2NrZWQgdXNpbmcgQWVybyBTbmFwL1NuYXAgQXNzaXN0LiBBIGZ1bGwgLnNob3coKSBjYWxsIGhlcmUgd2lsbCBjYXVzZVxuICAvLyAgIHRoZSB3aW5kb3cgdG8gcmVwb3NpdGlvbjpcbiAgLy8gICBodHRwczovL2dpdGh1Yi5jb20vc2lnbmFsYXBwL1NpZ25hbC1EZXNrdG9wL2lzc3Vlcy8xNDI5XG4gIGlmIChtYWluV2luZG93LmlzVmlzaWJsZSgpKSB7XG4gICAgbWFpbldpbmRvdy5mb2N1cygpO1xuICB9IGVsc2Uge1xuICAgIG1haW5XaW5kb3cuc2hvdygpO1xuICB9XG59XG5cbmlmICghcHJvY2Vzcy5tYXMpIHtcbiAgY29uc29sZS5sb2coJ21ha2luZyBhcHAgc2luZ2xlIGluc3RhbmNlJyk7XG4gIGNvbnN0IGdvdExvY2sgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xuICBpZiAoIWdvdExvY2spIHtcbiAgICBjb25zb2xlLmxvZygncXVpdHRpbmc7IHdlIGFyZSB0aGUgc2Vjb25kIGluc3RhbmNlJyk7XG4gICAgYXBwLmV4aXQoKTtcbiAgfSBlbHNlIHtcbiAgICBhcHAub24oJ3NlY29uZC1pbnN0YW5jZScsIChfZTogRWxlY3Ryb24uRXZlbnQsIGFyZ3Y6IEFycmF5PHN0cmluZz4pID0+IHtcbiAgICAgIC8vIFNvbWVvbmUgdHJpZWQgdG8gcnVuIGEgc2Vjb25kIGluc3RhbmNlLCB3ZSBzaG91bGQgZm9jdXMgb3VyIHdpbmRvd1xuICAgICAgaWYgKG1haW5XaW5kb3cpIHtcbiAgICAgICAgaWYgKG1haW5XaW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xuICAgICAgICAgIG1haW5XaW5kb3cucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1dpbmRvdygpO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2dnZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgJ3NlY29uZC1pbnN0YW5jZTogbG9nZ2VyIG5vdCBpbml0aWFsaXplZDsgc2tpcHBpbmcgZnVydGhlciBjaGVja3MnXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5jb21pbmdDYXB0Y2hhSHJlZiA9IGdldEluY29taW5nQ2FwdGNoYUhyZWYoYXJndik7XG4gICAgICBpZiAoaW5jb21pbmdDYXB0Y2hhSHJlZikge1xuICAgICAgICBjb25zdCB7IGNhcHRjaGEgfSA9IHBhcnNlQ2FwdGNoYUhyZWYoaW5jb21pbmdDYXB0Y2hhSHJlZiwgZ2V0TG9nZ2VyKCkpO1xuICAgICAgICBjaGFsbGVuZ2VIYW5kbGVyLmhhbmRsZUNhcHRjaGEoY2FwdGNoYSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gQXJlIHRoZXkgdHJ5aW5nIHRvIG9wZW4gYSBrYWhmOi8vIGhyZWY/XG4gICAgICBjb25zdCBpbmNvbWluZ0hyZWYgPSBnZXRJbmNvbWluZ0hyZWYoYXJndik7XG4gICAgICBpZiAoaW5jb21pbmdIcmVmKSB7XG4gICAgICAgIGhhbmRsZVNnbmxIcmVmKGluY29taW5nSHJlZik7XG4gICAgICB9XG4gICAgICAvLyBIYW5kbGVkXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG5cbmxldCBzcWxJbml0VGltZVN0YXJ0ID0gMDtcbmxldCBzcWxJbml0VGltZUVuZCA9IDA7XG5cbmNvbnN0IHNxbCA9IG5ldyBNYWluU1FMKCk7XG5jb25zdCBoZWljQ29udmVydGVyID0gZ2V0SGVpY0NvbnZlcnRlcigpO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRTcGVsbENoZWNrU2V0dGluZygpIHtcbiAgY29uc3QgZmFzdFZhbHVlID0gZXBoZW1lcmFsQ29uZmlnLmdldCgnc3BlbGwtY2hlY2snKTtcbiAgaWYgKGZhc3RWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZ2V0TG9nZ2VyKCkuaW5mbygnZ290IGZhc3Qgc3BlbGxjaGVjayBzZXR0aW5nJywgZmFzdFZhbHVlKTtcbiAgICByZXR1cm4gZmFzdFZhbHVlO1xuICB9XG5cbiAgY29uc3QganNvbiA9IGF3YWl0IHNxbC5zcWxDYWxsKCdnZXRJdGVtQnlJZCcsIFsnc3BlbGwtY2hlY2snXSk7XG5cbiAgLy8gRGVmYXVsdCB0byBgdHJ1ZWAgaWYgc2V0dGluZyBkb2Vzbid0IGV4aXN0IHlldFxuICBjb25zdCBzbG93VmFsdWUgPSBqc29uID8ganNvbi52YWx1ZSA6IHRydWU7XG5cbiAgZXBoZW1lcmFsQ29uZmlnLnNldCgnc3BlbGwtY2hlY2snLCBzbG93VmFsdWUpO1xuXG4gIGdldExvZ2dlcigpLmluZm8oJ2dvdCBzbG93IHNwZWxsY2hlY2sgc2V0dGluZycsIHNsb3dWYWx1ZSk7XG5cbiAgcmV0dXJuIHNsb3dWYWx1ZTtcbn1cblxudHlwZSBHZXRUaGVtZVNldHRpbmdPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgZXBoZW1lcmFsT25seT86IGJvb2xlYW47XG59PjtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VGhlbWVTZXR0aW5nKHtcbiAgZXBoZW1lcmFsT25seSA9IGZhbHNlLFxufTogR2V0VGhlbWVTZXR0aW5nT3B0aW9uc1R5cGUgPSB7fSk6IFByb21pc2U8VGhlbWVTZXR0aW5nVHlwZT4ge1xuICBjb25zdCBmYXN0VmFsdWUgPSBlcGhlbWVyYWxDb25maWcuZ2V0KCd0aGVtZS1zZXR0aW5nJyk7XG4gIGlmIChmYXN0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGdldExvZ2dlcigpLmluZm8oJ2dvdCBmYXN0IHRoZW1lLXNldHRpbmcgdmFsdWUnLCBmYXN0VmFsdWUpO1xuICAgIHJldHVybiBmYXN0VmFsdWUgYXMgVGhlbWVTZXR0aW5nVHlwZTtcbiAgfVxuXG4gIGlmIChlcGhlbWVyYWxPbmx5KSB7XG4gICAgcmV0dXJuICdzeXN0ZW0nO1xuICB9XG5cbiAgY29uc3QganNvbiA9IGF3YWl0IHNxbC5zcWxDYWxsKCdnZXRJdGVtQnlJZCcsIFsndGhlbWUtc2V0dGluZyddKTtcblxuICAvLyBEZWZhdWx0IHRvIGBzeXN0ZW1gIGlmIHNldHRpbmcgZG9lc24ndCBleGlzdCBvciBpcyBpbnZhbGlkXG4gIGNvbnN0IHNldHRpbmc6IHVua25vd24gPSBqc29uPy52YWx1ZTtcbiAgY29uc3Qgc2xvd1ZhbHVlID1cbiAgICBzZXR0aW5nID09PSAnbGlnaHQnIHx8IHNldHRpbmcgPT09ICdkYXJrJyB8fCBzZXR0aW5nID09PSAnc3lzdGVtJ1xuICAgICAgPyBzZXR0aW5nXG4gICAgICA6ICdzeXN0ZW0nO1xuXG4gIGVwaGVtZXJhbENvbmZpZy5zZXQoJ3RoZW1lLXNldHRpbmcnLCBzbG93VmFsdWUpO1xuXG4gIGdldExvZ2dlcigpLmluZm8oJ2dvdCBzbG93IHRoZW1lLXNldHRpbmcgdmFsdWUnLCBzbG93VmFsdWUpO1xuXG4gIHJldHVybiBzbG93VmFsdWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJlc29sdmVkVGhlbWVTZXR0aW5nKFxuICBvcHRpb25zPzogR2V0VGhlbWVTZXR0aW5nT3B0aW9uc1R5cGVcbik6IFByb21pc2U8VGhlbWVUeXBlPiB7XG4gIGNvbnN0IHRoZW1lID0gYXdhaXQgZ2V0VGhlbWVTZXR0aW5nKG9wdGlvbnMpO1xuICBpZiAodGhlbWUgPT09ICdzeXN0ZW0nKSB7XG4gICAgcmV0dXJuIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPyBUaGVtZVR5cGUuZGFyayA6IFRoZW1lVHlwZS5saWdodDtcbiAgfVxuICByZXR1cm4gVGhlbWVUeXBlW3RoZW1lXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QmFja2dyb3VuZENvbG9yKFxuICBvcHRpb25zPzogR2V0VGhlbWVTZXR0aW5nT3B0aW9uc1R5cGVcbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHRoZW1lID0gYXdhaXQgZ2V0UmVzb2x2ZWRUaGVtZVNldHRpbmcob3B0aW9ucyk7XG5cbiAgaWYgKHRoZW1lID09PSAnbGlnaHQnKSB7XG4gICAgcmV0dXJuICcjM2E3NmYwJztcbiAgfVxuXG4gIGlmICh0aGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgcmV0dXJuICcjMTIxMjEyJztcbiAgfVxuXG4gIHRocm93IG1pc3NpbmdDYXNlRXJyb3IodGhlbWUpO1xufVxuXG5sZXQgc3lzdGVtVHJheVNlcnZpY2U6IFN5c3RlbVRyYXlTZXJ2aWNlIHwgdW5kZWZpbmVkO1xuY29uc3Qgc3lzdGVtVHJheVNldHRpbmdDYWNoZSA9IG5ldyBTeXN0ZW1UcmF5U2V0dGluZ0NhY2hlKFxuICBzcWwsXG4gIGVwaGVtZXJhbENvbmZpZyxcbiAgcHJvY2Vzcy5hcmd2LFxuICBhcHAuZ2V0VmVyc2lvbigpXG4pO1xuXG5jb25zdCB3aW5kb3dGcm9tVXNlckNvbmZpZyA9IHVzZXJDb25maWcuZ2V0KCd3aW5kb3cnKTtcbmNvbnN0IHdpbmRvd0Zyb21FcGhlbWVyYWwgPSBlcGhlbWVyYWxDb25maWcuZ2V0KCd3aW5kb3cnKTtcbmV4cG9ydCBjb25zdCB3aW5kb3dDb25maWdTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIG1heGltaXplZDogei5ib29sZWFuKCkub3B0aW9uYWwoKSxcbiAgYXV0b0hpZGVNZW51QmFyOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICBmdWxsc2NyZWVuOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICB3aWR0aDogei5udW1iZXIoKSxcbiAgaGVpZ2h0OiB6Lm51bWJlcigpLFxuICB4OiB6Lm51bWJlcigpLFxuICB5OiB6Lm51bWJlcigpLFxufSk7XG50eXBlIFdpbmRvd0NvbmZpZ1R5cGUgPSB6LmluZmVyPHR5cGVvZiB3aW5kb3dDb25maWdTY2hlbWE+O1xuXG5sZXQgd2luZG93Q29uZmlnOiBXaW5kb3dDb25maWdUeXBlIHwgdW5kZWZpbmVkO1xuY29uc3Qgd2luZG93Q29uZmlnUGFyc2VkID0gd2luZG93Q29uZmlnU2NoZW1hLnNhZmVQYXJzZShcbiAgd2luZG93RnJvbUVwaGVtZXJhbCB8fCB3aW5kb3dGcm9tVXNlckNvbmZpZ1xuKTtcbmlmICh3aW5kb3dDb25maWdQYXJzZWQuc3VjY2Vzcykge1xuICB3aW5kb3dDb25maWcgPSB3aW5kb3dDb25maWdQYXJzZWQuZGF0YTtcbn1cblxuaWYgKHdpbmRvd0Zyb21Vc2VyQ29uZmlnKSB7XG4gIHVzZXJDb25maWcuc2V0KCd3aW5kb3cnLCBudWxsKTtcbiAgZXBoZW1lcmFsQ29uZmlnLnNldCgnd2luZG93Jywgd2luZG93Q29uZmlnKTtcbn1cblxubGV0IG1lbnVPcHRpb25zOiBDcmVhdGVUZW1wbGF0ZU9wdGlvbnNUeXBlIHwgdW5kZWZpbmVkO1xuXG4vLyBUaGVzZSB3aWxsIGJlIHNldCBhZnRlciBhcHAgZmlyZXMgdGhlICdyZWFkeScgZXZlbnRcbmxldCBsb2dnZXI6IExvZ2dlclR5cGUgfCB1bmRlZmluZWQ7XG5sZXQgbG9jYWxlOiBMb2NhbGVUeXBlIHwgdW5kZWZpbmVkO1xubGV0IHNldHRpbmdzQ2hhbm5lbDogU2V0dGluZ3NDaGFubmVsIHwgdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBnZXRMb2dnZXIoKTogTG9nZ2VyVHlwZSB7XG4gIGlmICghbG9nZ2VyKSB7XG4gICAgY29uc29sZS53YXJuKCdnZXRMb2dnZXI6IExvZ2dlciBub3QgeWV0IGluaXRpYWxpemVkIScpO1xuICAgIHJldHVybiBjb25zb2xlTG9nZ2VyO1xuICB9XG5cbiAgcmV0dXJuIGxvZ2dlcjtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYWxlKCk6IExvY2FsZVR5cGUge1xuICBpZiAoIWxvY2FsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0TG9jYWxlOiBMb2NhbGUgbm90IHlldCBpbml0aWFsaXplZCEnKTtcbiAgfVxuXG4gIHJldHVybiBsb2NhbGU7XG59XG5cbnR5cGUgUHJlcGFyZVVybE9wdGlvbnMgPSB7IGZvckNhbGxpbmc/OiBib29sZWFuOyBmb3JDYW1lcmE/OiBib29sZWFuIH07XG5cbmFzeW5jIGZ1bmN0aW9uIHByZXBhcmVGaWxlVXJsKFxuICBwYXRoU2VnbWVudHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPixcbiAgb3B0aW9uczogUHJlcGFyZVVybE9wdGlvbnMgPSB7fVxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgZmlsZVBhdGggPSBqb2luKC4uLnBhdGhTZWdtZW50cyk7XG4gIGNvbnN0IGZpbGVVcmwgPSBwYXRoVG9GaWxlVVJMKGZpbGVQYXRoKTtcbiAgcmV0dXJuIHByZXBhcmVVcmwoZmlsZVVybCwgb3B0aW9ucyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHByZXBhcmVVcmwoXG4gIHVybDogVVJMLFxuICB7IGZvckNhbGxpbmcsIGZvckNhbWVyYSB9OiBQcmVwYXJlVXJsT3B0aW9ucyA9IHt9XG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCB0aGVtZSA9IGF3YWl0IGdldFJlc29sdmVkVGhlbWVTZXR0aW5nKCk7XG5cbiAgY29uc3QgZGlyZWN0b3J5Q29uZmlnID0gZGlyZWN0b3J5Q29uZmlnU2NoZW1hLnNhZmVQYXJzZSh7XG4gICAgZGlyZWN0b3J5VmVyc2lvbjogY29uZmlnLmdldDxudW1iZXIgfCB1bmRlZmluZWQ+KCdkaXJlY3RvcnlWZXJzaW9uJykgfHwgMSxcbiAgICBkaXJlY3RvcnlVcmw6IGNvbmZpZy5nZXQ8c3RyaW5nIHwgbnVsbD4oJ2RpcmVjdG9yeVVybCcpIHx8IHVuZGVmaW5lZCxcbiAgICBkaXJlY3RvcnlFbmNsYXZlSWQ6XG4gICAgICBjb25maWcuZ2V0PHN0cmluZyB8IG51bGw+KCdkaXJlY3RvcnlFbmNsYXZlSWQnKSB8fCB1bmRlZmluZWQsXG4gICAgZGlyZWN0b3J5VHJ1c3RBbmNob3I6XG4gICAgICBjb25maWcuZ2V0PHN0cmluZyB8IG51bGw+KCdkaXJlY3RvcnlUcnVzdEFuY2hvcicpIHx8IHVuZGVmaW5lZCxcbiAgICBkaXJlY3RvcnlWMlVybDogY29uZmlnLmdldDxzdHJpbmcgfCBudWxsPignZGlyZWN0b3J5VjJVcmwnKSB8fCB1bmRlZmluZWQsXG4gICAgZGlyZWN0b3J5VjJQdWJsaWNLZXk6XG4gICAgICBjb25maWcuZ2V0PHN0cmluZyB8IG51bGw+KCdkaXJlY3RvcnlWMlB1YmxpY0tleScpIHx8IHVuZGVmaW5lZCxcbiAgICBkaXJlY3RvcnlWMkNvZGVIYXNoZXM6XG4gICAgICBjb25maWcuZ2V0PEFycmF5PHN0cmluZz4gfCBudWxsPignZGlyZWN0b3J5VjJDb2RlSGFzaGVzJykgfHwgdW5kZWZpbmVkLFxuICAgIGRpcmVjdG9yeVYzVXJsOiBjb25maWcuZ2V0PHN0cmluZyB8IG51bGw+KCdkaXJlY3RvcnlWM1VybCcpIHx8IHVuZGVmaW5lZCxcbiAgICBkaXJlY3RvcnlWM01SRU5DTEFWRTpcbiAgICAgIGNvbmZpZy5nZXQ8c3RyaW5nIHwgbnVsbD4oJ2RpcmVjdG9yeVYzTVJFTkNMQVZFJykgfHwgdW5kZWZpbmVkLFxuICB9KTtcbiAgaWYgKCFkaXJlY3RvcnlDb25maWcuc3VjY2Vzcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBwcmVwYXJlVXJsOiBGYWlsZWQgdG8gcGFyc2UgcmVuZGVyZXIgZGlyZWN0b3J5IGNvbmZpZyAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICBkaXJlY3RvcnlDb25maWcuZXJyb3IuZmxhdHRlbigpXG4gICAgICApfWBcbiAgICApO1xuICB9XG5cbiAgY29uc3QgdXJsUGFyYW1zOiBSZW5kZXJlckNvbmZpZ1R5cGUgPSB7XG4gICAgbmFtZTogcGFja2FnZUpzb24ucHJvZHVjdE5hbWUsXG4gICAgbG9jYWxlOiBnZXRMb2NhbGUoKS5uYW1lLFxuICAgIHZlcnNpb246IGFwcC5nZXRWZXJzaW9uKCksXG4gICAgYnVpbGRDcmVhdGlvbjogY29uZmlnLmdldDxudW1iZXI+KCdidWlsZENyZWF0aW9uJyksXG4gICAgYnVpbGRFeHBpcmF0aW9uOiBjb25maWcuZ2V0PG51bWJlcj4oJ2J1aWxkRXhwaXJhdGlvbicpLFxuICAgIHNlcnZlclVybDogY29uZmlnLmdldDxzdHJpbmc+KCdzZXJ2ZXJVcmwnKSxcbiAgICBzdG9yYWdlVXJsOiBjb25maWcuZ2V0PHN0cmluZz4oJ3N0b3JhZ2VVcmwnKSxcbiAgICB1cGRhdGVzVXJsOiBjb25maWcuZ2V0PHN0cmluZz4oJ3VwZGF0ZXNVcmwnKSxcbiAgICBjZG5VcmwwOiBjb25maWcuZ2V0PENvbmZpZ1R5cGU+KCdjZG4nKS5nZXQ8c3RyaW5nPignMCcpLFxuICAgIGNkblVybDI6IGNvbmZpZy5nZXQ8Q29uZmlnVHlwZT4oJ2NkbicpLmdldDxzdHJpbmc+KCcyJyksXG4gICAgY2VydGlmaWNhdGVBdXRob3JpdHk6IGNvbmZpZy5nZXQ8c3RyaW5nPignY2VydGlmaWNhdGVBdXRob3JpdHknKSxcbiAgICBlbnZpcm9ubWVudDogZW5hYmxlQ0kgPyBFbnZpcm9ubWVudC5Qcm9kdWN0aW9uIDogZ2V0RW52aXJvbm1lbnQoKSxcbiAgICBlbmFibGVDSSxcbiAgICBub2RlVmVyc2lvbjogcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLFxuICAgIGhvc3RuYW1lOiBvcy5ob3N0bmFtZSgpLFxuICAgIGFwcEluc3RhbmNlOiBwcm9jZXNzLmVudi5OT0RFX0FQUF9JTlNUQU5DRSB8fCB1bmRlZmluZWQsXG4gICAgcHJveHlVcmw6IHByb2Nlc3MuZW52LkhUVFBTX1BST1hZIHx8IHByb2Nlc3MuZW52Lmh0dHBzX3Byb3h5IHx8IHVuZGVmaW5lZCxcbiAgICBjb250ZW50UHJveHlVcmw6IGNvbmZpZy5nZXQ8c3RyaW5nPignY29udGVudFByb3h5VXJsJyksXG4gICAgc2Z1VXJsOiBjb25maWcuZ2V0KCdzZnVVcmwnKSxcbiAgICByZWR1Y2VkTW90aW9uU2V0dGluZzogYW5pbWF0aW9uU2V0dGluZ3MucHJlZmVyc1JlZHVjZWRNb3Rpb24sXG4gICAgc2VydmVyUHVibGljUGFyYW1zOiBjb25maWcuZ2V0PHN0cmluZz4oJ3NlcnZlclB1YmxpY1BhcmFtcycpLFxuICAgIHNlcnZlclRydXN0Um9vdDogY29uZmlnLmdldDxzdHJpbmc+KCdzZXJ2ZXJUcnVzdFJvb3QnKSxcbiAgICB0aGVtZSxcbiAgICBhcHBTdGFydEluaXRpYWxTcGVsbGNoZWNrU2V0dGluZyxcbiAgICB1c2VyRGF0YVBhdGg6IGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpLFxuICAgIGhvbWVQYXRoOiBhcHAuZ2V0UGF0aCgnaG9tZScpLFxuICAgIGNyYXNoRHVtcHNQYXRoOiBhcHAuZ2V0UGF0aCgnY3Jhc2hEdW1wcycpLFxuXG4gICAgZGlyZWN0b3J5Q29uZmlnOiBkaXJlY3RvcnlDb25maWcuZGF0YSxcblxuICAgIC8vIE9ubHkgdXNlZCBieSB0aGUgbWFpbiB3aW5kb3dcbiAgICBpc01haW5XaW5kb3dGdWxsU2NyZWVuOiBCb29sZWFuKG1haW5XaW5kb3c/LmlzRnVsbFNjcmVlbigpKSxcbiAgICBpc01haW5XaW5kb3dNYXhpbWl6ZWQ6IEJvb2xlYW4obWFpbldpbmRvdz8uaXNNYXhpbWl6ZWQoKSksXG5cbiAgICAvLyBPbmx5IGZvciB0ZXN0c1xuICAgIGFyZ3Y6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuYXJndiksXG5cbiAgICAvLyBPbmx5IGZvciBwZXJtaXNzaW9uIHBvcHVwIHdpbmRvd1xuICAgIGZvckNhbGxpbmc6IEJvb2xlYW4oZm9yQ2FsbGluZyksXG4gICAgZm9yQ2FtZXJhOiBCb29sZWFuKGZvckNhbWVyYSksXG4gIH07XG5cbiAgY29uc3QgcGFyc2VkID0gcmVuZGVyZXJDb25maWdTY2hlbWEuc2FmZVBhcnNlKHVybFBhcmFtcyk7XG4gIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgcHJlcGFyZVVybDogRmFpbGVkIHRvIHBhcnNlIHJlbmRlcmVyIGNvbmZpZyAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICBwYXJzZWQuZXJyb3IuZmxhdHRlbigpXG4gICAgICApfWBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHNldFVybFNlYXJjaFBhcmFtcyh1cmwsIHsgY29uZmlnOiBKU09OLnN0cmluZ2lmeShwYXJzZWQuZGF0YSkgfSkuaHJlZjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVXJsKGV2ZW50OiBFbGVjdHJvbi5FdmVudCwgcmF3VGFyZ2V0OiBzdHJpbmcpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgcGFyc2VkVXJsID0gbWF5YmVQYXJzZVVybChyYXdUYXJnZXQpO1xuICBpZiAoIXBhcnNlZFVybCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldCA9IHJld3JpdGVTaWduYWxIcmVmc0lmTmVjZXNzYXJ5KHJhd1RhcmdldCk7XG5cbiAgY29uc3QgeyBwcm90b2NvbCwgaG9zdG5hbWUgfSA9IHBhcnNlZFVybDtcbiAgY29uc3QgaXNEZXZTZXJ2ZXIgPVxuICAgIHByb2Nlc3MuZW52LlNJR05BTF9FTkFCTEVfSFRUUCAmJiBob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCc7XG4gIC8vIFdlIG9ubHkgd2FudCB0byBzcGVjaWFsbHkgaGFuZGxlIHVybHMgdGhhdCBhcmVuJ3QgcmVxdWVzdGluZyB0aGUgZGV2IHNlcnZlclxuICBpZiAoXG4gICAgaXNTZ25sSHJlZih0YXJnZXQsIGdldExvZ2dlcigpKSB8fFxuICAgIGlzU2lnbmFsSHR0cHNMaW5rKHRhcmdldCwgZ2V0TG9nZ2VyKCkpXG4gICkge1xuICAgIGhhbmRsZVNnbmxIcmVmKHRhcmdldCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKChwcm90b2NvbCA9PT0gJ2h0dHA6JyB8fCBwcm90b2NvbCA9PT0gJ2h0dHBzOicpICYmICFpc0RldlNlcnZlcikge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBzaGVsbC5vcGVuRXh0ZXJuYWwodGFyZ2V0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IoYEZhaWxlZCB0byBvcGVuIHVybDogJHtlcnJvci5zdGFja31gKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29tbW9uV2luZG93RXZlbnRzKFxuICB3aW5kb3c6IEJyb3dzZXJXaW5kb3csXG4gIHRpdGxlQmFyT3ZlcmxheTogVGl0bGVCYXJPdmVybGF5T3B0aW9ucyB8IGZhbHNlID0gZmFsc2Vcbikge1xuICB3aW5kb3cud2ViQ29udGVudHMub24oJ3dpbGwtbmF2aWdhdGUnLCBoYW5kbGVVcmwpO1xuICB3aW5kb3cud2ViQ29udGVudHMub24oJ25ldy13aW5kb3cnLCBoYW5kbGVVcmwpO1xuICB3aW5kb3cud2ViQ29udGVudHMub24oXG4gICAgJ3ByZWxvYWQtZXJyb3InLFxuICAgIChfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBwcmVsb2FkUGF0aDogc3RyaW5nLCBlcnJvcjogRXJyb3IpID0+IHtcbiAgICAgIGdldExvZ2dlcigpLmVycm9yKGBQcmVsb2FkIGVycm9yIGluICR7cHJlbG9hZFBhdGh9OiBgLCBlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gICk7XG5cbiAgYWN0aXZlV2luZG93cy5hZGQod2luZG93KTtcbiAgd2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiBhY3RpdmVXaW5kb3dzLmRlbGV0ZSh3aW5kb3cpKTtcblxuICBjb25zdCBzZXRXaW5kb3dGb2N1cyA9ICgpID0+IHtcbiAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnc2V0LXdpbmRvdy1mb2N1cycsIHdpbmRvdy5pc0ZvY3VzZWQoKSk7XG4gIH07XG4gIHdpbmRvdy5vbignZm9jdXMnLCBzZXRXaW5kb3dGb2N1cyk7XG4gIHdpbmRvdy5vbignYmx1cicsIHNldFdpbmRvd0ZvY3VzKTtcblxuICB3aW5kb3cub25jZSgncmVhZHktdG8tc2hvdycsIHNldFdpbmRvd0ZvY3VzKTtcbiAgLy8gVGhpcyBpcyBhIGZhbGxiYWNrIGluIGNhc2Ugd2UgZHJvcCBhbiBldmVudCBmb3Igc29tZSByZWFzb24uXG4gIGNvbnN0IGZvY3VzSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChzZXRXaW5kb3dGb2N1cywgMTAwMDApO1xuICB3aW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IGNsZWFySW50ZXJ2YWwoZm9jdXNJbnRlcnZhbCkpO1xuXG4gIC8vIFdvcmtzIG9ubHkgZm9yIG1haW5XaW5kb3cgYmVjYXVzZSBpdCBoYXMgYGVuYWJsZVByZWZlcnJlZFNpemVNb2RlYFxuICBsZXQgbGFzdFpvb21GYWN0b3IgPSB3aW5kb3cud2ViQ29udGVudHMuZ2V0Wm9vbUZhY3RvcigpO1xuICBjb25zdCBvblpvb21DaGFuZ2VkID0gKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIHdpbmRvdy5pc0Rlc3Ryb3llZCgpIHx8XG4gICAgICAhd2luZG93LndlYkNvbnRlbnRzIHx8XG4gICAgICB3aW5kb3cud2ViQ29udGVudHMuaXNEZXN0cm95ZWQoKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB3aW5kb3cud2ViQ29udGVudHMuZ2V0Wm9vbUZhY3RvcigpO1xuICAgIGlmIChsYXN0Wm9vbUZhY3RvciA9PT0gem9vbUZhY3Rvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldHRpbmdzQ2hhbm5lbD8uaW52b2tlQ2FsbGJhY2tJbk1haW5XaW5kb3coJ3BlcnNpc3Rab29tRmFjdG9yJywgW1xuICAgICAgem9vbUZhY3RvcixcbiAgICBdKTtcblxuICAgIGxhc3Rab29tRmFjdG9yID0gem9vbUZhY3RvcjtcbiAgfTtcbiAgd2luZG93LndlYkNvbnRlbnRzLm9uKCdwcmVmZXJyZWQtc2l6ZS1jaGFuZ2VkJywgb25ab29tQ2hhbmdlZCk7XG5cbiAgbmF0aXZlVGhlbWVOb3RpZmllci5hZGRXaW5kb3cod2luZG93KTtcblxuICBpZiAodGl0bGVCYXJPdmVybGF5KSB7XG4gICAgY29uc3Qgb25UaGVtZUNoYW5nZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld092ZXJsYXkgPSBhd2FpdCBnZXRUaXRsZUJhck92ZXJsYXkoKTtcbiAgICAgICAgaWYgKCFuZXdPdmVybGF5KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5zZXRUaXRsZUJhck92ZXJsYXkobmV3T3ZlcmxheSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdvblRoZW1lQ2hhbmdlIGVycm9yJywgZXJyb3IpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBuYXRpdmVUaGVtZS5vbigndXBkYXRlZCcsIG9uVGhlbWVDaGFuZ2UpO1xuICAgIHNldHRpbmdzQ2hhbm5lbD8ub24oJ2NoYW5nZTp0aGVtZVNldHRpbmcnLCBvblRoZW1lQ2hhbmdlKTtcbiAgfVxufVxuXG5jb25zdCBERUZBVUxUX1dJRFRIID0gODAwO1xuY29uc3QgREVGQVVMVF9IRUlHSFQgPSA2MTA7XG4vLyBMQVJHRVNUX0xFRlRfUEFORV9XSURUSCA9IDM4MFxuLy8gVElNRUxJTkVfV0lEVEggPSAzMDBcbi8vIFRJTUVMSU5FX01BUkdJTiA9IDE2ICsgMTZcbi8vIDcxMiA9IExBUkdFU1RfTEVGVF9QQU5FX1dJRFRIICsgVElNRUxJTkVfV0lEVEggKyBUSU1FTElORV9NQVJHSU5cbmNvbnN0IE1JTl9XSURUSCA9IDcxMjtcbmNvbnN0IE1JTl9IRUlHSFQgPSA1NTA7XG5jb25zdCBCT1VORFNfQlVGRkVSID0gMTAwO1xuXG50eXBlIEJvdW5kc1R5cGUgPSB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn07XG5cbmZ1bmN0aW9uIGlzVmlzaWJsZSh3aW5kb3c6IEJvdW5kc1R5cGUsIGJvdW5kczogQm91bmRzVHlwZSkge1xuICBjb25zdCBib3VuZHNYID0gYm91bmRzPy54IHx8IDA7XG4gIGNvbnN0IGJvdW5kc1kgPSBib3VuZHM/LnkgfHwgMDtcbiAgY29uc3QgYm91bmRzV2lkdGggPSBib3VuZHM/LndpZHRoIHx8IERFRkFVTFRfV0lEVEg7XG4gIGNvbnN0IGJvdW5kc0hlaWdodCA9IGJvdW5kcz8uaGVpZ2h0IHx8IERFRkFVTFRfSEVJR0hUO1xuXG4gIC8vIHJlcXVpcmluZyBCT1VORFNfQlVGRkVSIHBpeGVscyBvbiB0aGUgbGVmdCBvciByaWdodCBzaWRlXG4gIGNvbnN0IHJpZ2h0U2lkZUNsZWFyT2ZMZWZ0Qm91bmQgPVxuICAgIHdpbmRvdy54ICsgd2luZG93LndpZHRoID49IGJvdW5kc1ggKyBCT1VORFNfQlVGRkVSO1xuICBjb25zdCBsZWZ0U2lkZUNsZWFyT2ZSaWdodEJvdW5kID1cbiAgICB3aW5kb3cueCA8PSBib3VuZHNYICsgYm91bmRzV2lkdGggLSBCT1VORFNfQlVGRkVSO1xuXG4gIC8vIHRvcCBjYW4ndCBiZSBvZmZzY3JlZW4sIGFuZCBtdXN0IHNob3cgYXQgbGVhc3QgQk9VTkRTX0JVRkZFUiBwaXhlbHMgYXQgYm90dG9tXG4gIGNvbnN0IHRvcENsZWFyT2ZVcHBlckJvdW5kID0gd2luZG93LnkgPj0gYm91bmRzWTtcbiAgY29uc3QgdG9wQ2xlYXJPZkxvd2VyQm91bmQgPVxuICAgIHdpbmRvdy55IDw9IGJvdW5kc1kgKyBib3VuZHNIZWlnaHQgLSBCT1VORFNfQlVGRkVSO1xuXG4gIHJldHVybiAoXG4gICAgcmlnaHRTaWRlQ2xlYXJPZkxlZnRCb3VuZCAmJlxuICAgIGxlZnRTaWRlQ2xlYXJPZlJpZ2h0Qm91bmQgJiZcbiAgICB0b3BDbGVhck9mVXBwZXJCb3VuZCAmJlxuICAgIHRvcENsZWFyT2ZMb3dlckJvdW5kXG4gICk7XG59XG5cbmxldCB3aW5kb3dJY29uOiBzdHJpbmc7XG5cbmlmIChPUy5pc1dpbmRvd3MoKSkge1xuICB3aW5kb3dJY29uID0gam9pbihfX2Rpcm5hbWUsICcuLi9idWlsZC9pY29ucy93aW4vaWNvbi5pY28nKTtcbn0gZWxzZSBpZiAoT1MuaXNMaW51eCgpKSB7XG4gIHdpbmRvd0ljb24gPSBqb2luKF9fZGlybmFtZSwgJy4uL2ltYWdlcy9zaWduYWwtbG9nby1kZXNrdG9wLWxpbnV4LnBuZycpO1xufSBlbHNlIHtcbiAgd2luZG93SWNvbiA9IGpvaW4oX19kaXJuYW1lLCAnLi4vYnVpbGQvaWNvbnMvcG5nLzUxMng1MTIucG5nJyk7XG59XG5cbi8vIFRoZSB0aXRsZWJhciBpcyBoaWRkZW4gb246XG4vLyAgIC0gV2luZG93cyA8IDEwICg3LCA4KVxuLy8gICAtIG1hY09TIChidXQgbm8gY3VzdG9tIHRpdGxlYmFyIGlzIGRpc3BsYXllZCwgc2VlXG4vLyAgICAgYC0tdGl0bGUtYmFyLWRyYWctYXJlYS1oZWlnaHRgIGluIGBzdHlsZXNoZWV0cy9fdGl0bGViYXIuc2Nzc2BcbmNvbnN0IG1haW5UaXRsZUJhclN0eWxlID1cbiAgKE9TLmlzTWFjT1MoKSB8fCBPUy5oYXNDdXN0b21UaXRsZUJhcigpKSAmJlxuICAhaXNUZXN0RW52aXJvbm1lbnQoZ2V0RW52aXJvbm1lbnQoKSlcbiAgICA/ICgnaGlkZGVuJyBhcyBjb25zdClcbiAgICA6ICgnZGVmYXVsdCcgYXMgY29uc3QpO1xuXG5jb25zdCBub25NYWluVGl0bGVCYXJTdHlsZSA9IE9TLmhhc0N1c3RvbVRpdGxlQmFyKClcbiAgPyAoJ2hpZGRlbicgYXMgY29uc3QpXG4gIDogKCdkZWZhdWx0JyBhcyBjb25zdCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFRpdGxlQmFyT3ZlcmxheSgpOiBQcm9taXNlPFRpdGxlQmFyT3ZlcmxheU9wdGlvbnMgfCBmYWxzZT4ge1xuICBpZiAoIU9TLmhhc0N1c3RvbVRpdGxlQmFyKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB0aGVtZSA9IGF3YWl0IGdldFJlc29sdmVkVGhlbWVTZXR0aW5nKCk7XG5cbiAgbGV0IGNvbG9yOiBzdHJpbmc7XG4gIGxldCBzeW1ib2xDb2xvcjogc3RyaW5nO1xuICBpZiAodGhlbWUgPT09ICdsaWdodCcpIHtcbiAgICBjb2xvciA9ICcjZThlOGU4JztcbiAgICBzeW1ib2xDb2xvciA9ICcjMWIxYjFiJztcbiAgfSBlbHNlIGlmICh0aGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgLy8gJGNvbG9yLWdyYXktODBcbiAgICBjb2xvciA9ICcjMmUyZTJlJztcbiAgICAvLyAkY29sb3ItZ3JheS0wNVxuICAgIHN5bWJvbENvbG9yID0gJyNlOWU5ZTknO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IodGhlbWUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb2xvcixcbiAgICBzeW1ib2xDb2xvcixcblxuICAgIC8vIFNob3VsZCBtYXRjaCBgLS10aXRsZWJhci1oZWlnaHRgIGluIHN0eWxlc2hlZXRzL190aXRsZWJhci5zY3NzXG4gICAgaGVpZ2h0OiAyOCAtIDEsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgY29uc3QgdXNlUHJlbG9hZEJ1bmRsZSA9XG4gICAgIWlzVGVzdEVudmlyb25tZW50KGdldEVudmlyb25tZW50KCkpIHx8IGZvcmNlUHJlbG9hZEJ1bmRsZTtcblxuICBjb25zdCB0aXRsZUJhck92ZXJsYXkgPSBhd2FpdCBnZXRUaXRsZUJhck92ZXJsYXkoKTtcblxuICBjb25zdCB3aW5kb3dPcHRpb25zOiBFbGVjdHJvbi5Ccm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zID0ge1xuICAgIHNob3c6IGZhbHNlLFxuICAgIHdpZHRoOiBERUZBVUxUX1dJRFRILFxuICAgIGhlaWdodDogREVGQVVMVF9IRUlHSFQsXG4gICAgbWluV2lkdGg6IE1JTl9XSURUSCxcbiAgICBtaW5IZWlnaHQ6IE1JTl9IRUlHSFQsXG4gICAgYXV0b0hpZGVNZW51QmFyOiBmYWxzZSxcbiAgICB0aXRsZUJhclN0eWxlOiBtYWluVGl0bGVCYXJTdHlsZSxcbiAgICB0aXRsZUJhck92ZXJsYXksXG4gICAgYmFja2dyb3VuZENvbG9yOiBpc1Rlc3RFbnZpcm9ubWVudChnZXRFbnZpcm9ubWVudCgpKVxuICAgICAgPyAnI2ZmZmZmZicgLy8gVGVzdHMgc2hvdWxkIGFsd2F5cyBiZSByZW5kZXJlZCBvbiBhIHdoaXRlIGJhY2tncm91bmRcbiAgICAgIDogYXdhaXQgZ2V0QmFja2dyb3VuZENvbG9yKCksXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIC4uLmRlZmF1bHRXZWJQcmVmcyxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsXG4gICAgICBub2RlSW50ZWdyYXRpb25JbldvcmtlcjogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiBmYWxzZSxcbiAgICAgIHByZWxvYWQ6IGpvaW4oXG4gICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgdXNlUHJlbG9hZEJ1bmRsZVxuICAgICAgICAgID8gJy4uL3ByZWxvYWQuYnVuZGxlLmpzJ1xuICAgICAgICAgIDogJy4uL3RzL3dpbmRvd3MvbWFpbi9wcmVsb2FkLmpzJ1xuICAgICAgKSxcbiAgICAgIHNwZWxsY2hlY2s6IGF3YWl0IGdldFNwZWxsQ2hlY2tTZXR0aW5nKCksXG4gICAgICBiYWNrZ3JvdW5kVGhyb3R0bGluZzogaXNUaHJvdHRsaW5nRW5hYmxlZCxcbiAgICAgIGVuYWJsZVByZWZlcnJlZFNpemVNb2RlOiB0cnVlLFxuICAgICAgZGlzYWJsZUJsaW5rRmVhdHVyZXM6ICdBY2NlbGVyYXRlZDJkQ2FudmFzLEFjY2VsZXJhdGVkU21hbGxDYW52YXNlcycsXG4gICAgfSxcbiAgICBpY29uOiB3aW5kb3dJY29uLFxuICAgIC4uLnBpY2sod2luZG93Q29uZmlnLCBbJ2F1dG9IaWRlTWVudUJhcicsICd3aWR0aCcsICdoZWlnaHQnLCAneCcsICd5J10pLFxuICB9O1xuXG4gIGlmICghaXNOdW1iZXIod2luZG93T3B0aW9ucy53aWR0aCkgfHwgd2luZG93T3B0aW9ucy53aWR0aCA8IE1JTl9XSURUSCkge1xuICAgIHdpbmRvd09wdGlvbnMud2lkdGggPSBERUZBVUxUX1dJRFRIO1xuICB9XG4gIGlmICghaXNOdW1iZXIod2luZG93T3B0aW9ucy5oZWlnaHQpIHx8IHdpbmRvd09wdGlvbnMuaGVpZ2h0IDwgTUlOX0hFSUdIVCkge1xuICAgIHdpbmRvd09wdGlvbnMuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gIH1cbiAgaWYgKCFpc0Jvb2xlYW4od2luZG93T3B0aW9ucy5hdXRvSGlkZU1lbnVCYXIpKSB7XG4gICAgZGVsZXRlIHdpbmRvd09wdGlvbnMuYXV0b0hpZGVNZW51QmFyO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRJblRyYXkgPVxuICAgIChhd2FpdCBzeXN0ZW1UcmF5U2V0dGluZ0NhY2hlLmdldCgpKSA9PT1cbiAgICBTeXN0ZW1UcmF5U2V0dGluZy5NaW5pbWl6ZVRvQW5kU3RhcnRJblN5c3RlbVRyYXk7XG5cbiAgY29uc3QgdmlzaWJsZU9uQW55U2NyZWVuID0gc29tZShzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKSwgZGlzcGxheSA9PiB7XG4gICAgaWYgKFxuICAgICAgaXNOdW1iZXIod2luZG93T3B0aW9ucy54KSAmJlxuICAgICAgaXNOdW1iZXIod2luZG93T3B0aW9ucy55KSAmJlxuICAgICAgaXNOdW1iZXIod2luZG93T3B0aW9ucy53aWR0aCkgJiZcbiAgICAgIGlzTnVtYmVyKHdpbmRvd09wdGlvbnMuaGVpZ2h0KVxuICAgICkge1xuICAgICAgcmV0dXJuIGlzVmlzaWJsZSh3aW5kb3dPcHRpb25zIGFzIEJvdW5kc1R5cGUsIGdldChkaXNwbGF5LCAnYm91bmRzJykpO1xuICAgIH1cblxuICAgIGdldExvZ2dlcigpLmVycm9yKFxuICAgICAgXCJ2aXNpYmxlT25BbnlTY3JlZW46IHdpbmRvd09wdGlvbnMgZGlkbid0IGhhdmUgdmFsaWQgYm91bmRzIGZpZWxkc1wiXG4gICAgKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuICBpZiAoIXZpc2libGVPbkFueVNjcmVlbikge1xuICAgIGdldExvZ2dlcigpLmluZm8oJ0xvY2F0aW9uIHJlc2V0IG5lZWRlZCcpO1xuICAgIGRlbGV0ZSB3aW5kb3dPcHRpb25zLng7XG4gICAgZGVsZXRlIHdpbmRvd09wdGlvbnMueTtcbiAgfVxuXG4gIGdldExvZ2dlcigpLmluZm8oXG4gICAgJ0luaXRpYWxpemluZyBCcm93c2VyV2luZG93IGNvbmZpZzonLFxuICAgIEpTT04uc3RyaW5naWZ5KHdpbmRvd09wdGlvbnMpXG4gICk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBicm93c2VyIHdpbmRvdy5cbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHdpbmRvd09wdGlvbnMpO1xuICBpZiAoc2V0dGluZ3NDaGFubmVsKSB7XG4gICAgc2V0dGluZ3NDaGFubmVsLnNldE1haW5XaW5kb3cobWFpbldpbmRvdyk7XG4gIH1cblxuICBtYWluV2luZG93Q3JlYXRlZCA9IHRydWU7XG4gIHNldHVwU3BlbGxDaGVja2VyKG1haW5XaW5kb3csIGdldExvY2FsZSgpKTtcbiAgaWYgKCFzdGFydEluVHJheSAmJiB3aW5kb3dDb25maWcgJiYgd2luZG93Q29uZmlnLm1heGltaXplZCkge1xuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKTtcbiAgfVxuICBpZiAoIXN0YXJ0SW5UcmF5ICYmIHdpbmRvd0NvbmZpZyAmJiB3aW5kb3dDb25maWcuZnVsbHNjcmVlbikge1xuICAgIG1haW5XaW5kb3cuc2V0RnVsbFNjcmVlbih0cnVlKTtcbiAgfVxuICBpZiAoc3lzdGVtVHJheVNlcnZpY2UpIHtcbiAgICBzeXN0ZW1UcmF5U2VydmljZS5zZXRNYWluV2luZG93KG1haW5XaW5kb3cpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZVdpbmRvd1N0YXRzKCkge1xuICAgIGlmICghd2luZG93Q29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0TG9nZ2VyKCkuaW5mbyhcbiAgICAgICdVcGRhdGluZyBCcm93c2VyV2luZG93IGNvbmZpZzogJXMnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkod2luZG93Q29uZmlnKVxuICAgICk7XG4gICAgZXBoZW1lcmFsQ29uZmlnLnNldCgnd2luZG93Jywgd2luZG93Q29uZmlnKTtcbiAgfVxuICBjb25zdCBkZWJvdW5jZWRTYXZlU3RhdHMgPSBkZWJvdW5jZShzYXZlV2luZG93U3RhdHMsIDUwMCk7XG5cbiAgZnVuY3Rpb24gY2FwdHVyZVdpbmRvd1N0YXRzKCkge1xuICAgIGlmICghbWFpbldpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNpemUgPSBtYWluV2luZG93LmdldFNpemUoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IG1haW5XaW5kb3cuZ2V0UG9zaXRpb24oKTtcblxuICAgIGNvbnN0IG5ld1dpbmRvd0NvbmZpZyA9IHtcbiAgICAgIG1heGltaXplZDogbWFpbldpbmRvdy5pc01heGltaXplZCgpLFxuICAgICAgYXV0b0hpZGVNZW51QmFyOiBtYWluV2luZG93LmF1dG9IaWRlTWVudUJhcixcbiAgICAgIGZ1bGxzY3JlZW46IG1haW5XaW5kb3cuaXNGdWxsU2NyZWVuKCksXG4gICAgICB3aWR0aDogc2l6ZVswXSxcbiAgICAgIGhlaWdodDogc2l6ZVsxXSxcbiAgICAgIHg6IHBvc2l0aW9uWzBdLFxuICAgICAgeTogcG9zaXRpb25bMV0sXG4gICAgfTtcblxuICAgIGlmIChcbiAgICAgIG5ld1dpbmRvd0NvbmZpZy5mdWxsc2NyZWVuICE9PSB3aW5kb3dDb25maWc/LmZ1bGxzY3JlZW4gfHxcbiAgICAgIG5ld1dpbmRvd0NvbmZpZy5tYXhpbWl6ZWQgIT09IHdpbmRvd0NvbmZpZz8ubWF4aW1pemVkXG4gICAgKSB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3dpbmRvdzpzZXQtd2luZG93LXN0YXRzJywge1xuICAgICAgICBpc01heGltaXplZDogbmV3V2luZG93Q29uZmlnLm1heGltaXplZCxcbiAgICAgICAgaXNGdWxsU2NyZWVuOiBuZXdXaW5kb3dDb25maWcuZnVsbHNjcmVlbixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHNvIGlmIHdlIG5lZWQgdG8gcmVjcmVhdGUgdGhlIHdpbmRvdywgd2UgaGF2ZSB0aGUgbW9zdCByZWNlbnQgc2V0dGluZ3NcbiAgICB3aW5kb3dDb25maWcgPSBuZXdXaW5kb3dDb25maWc7XG5cbiAgICBpZiAoIXdpbmRvd1N0YXRlLnJlcXVlc3RlZFNodXRkb3duKCkpIHtcbiAgICAgIGRlYm91bmNlZFNhdmVTdGF0cygpO1xuICAgIH1cbiAgfVxuXG4gIG1haW5XaW5kb3cub24oJ3Jlc2l6ZScsIGNhcHR1cmVXaW5kb3dTdGF0cyk7XG4gIG1haW5XaW5kb3cub24oJ21vdmUnLCBjYXB0dXJlV2luZG93U3RhdHMpO1xuXG4gIGlmIChnZXRFbnZpcm9ubWVudCgpID09PSBFbnZpcm9ubWVudC5UZXN0KSB7XG4gICAgbWFpbldpbmRvdy5sb2FkVVJMKGF3YWl0IHByZXBhcmVGaWxlVXJsKFtfX2Rpcm5hbWUsICcuLi90ZXN0L2luZGV4Lmh0bWwnXSkpO1xuICB9IGVsc2Uge1xuICAgIG1haW5XaW5kb3cubG9hZFVSTChhd2FpdCBwcmVwYXJlRmlsZVVybChbX19kaXJuYW1lLCAnLi4vYmFja2dyb3VuZC5odG1sJ10pKTtcbiAgfVxuXG4gIGlmICghZW5hYmxlQ0kgJiYgY29uZmlnLmdldDxib29sZWFuPignb3BlbkRldlRvb2xzJykpIHtcbiAgICAvLyBPcGVuIHRoZSBEZXZUb29scy5cbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICB9XG5cbiAgaGFuZGxlQ29tbW9uV2luZG93RXZlbnRzKG1haW5XaW5kb3csIHRpdGxlQmFyT3ZlcmxheSk7XG5cbiAgLy8gQXBwIGRvY2sgaWNvbiBib3VuY2VcbiAgYm91bmNlLmluaXQobWFpbldpbmRvdyk7XG5cbiAgLy8gRW1pdHRlZCB3aGVuIHRoZSB3aW5kb3cgaXMgYWJvdXQgdG8gYmUgY2xvc2VkLlxuICAvLyBOb3RlOiBXZSBkbyBtb3N0IG9mIG91ciBzaHV0ZG93biBsb2dpYyBoZXJlIGJlY2F1c2UgYWxsIHdpbmRvd3MgYXJlIGNsb3NlZCBieVxuICAvLyAgIEVsZWN0cm9uIGJlZm9yZSB0aGUgYXBwIHF1aXRzLlxuICBtYWluV2luZG93Lm9uKCdjbG9zZScsIGFzeW5jIGUgPT4ge1xuICAgIGlmICghbWFpbldpbmRvdykge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygnY2xvc2UgZXZlbnQ6IG5vIG1haW4gd2luZG93Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0TG9nZ2VyKCkuaW5mbygnY2xvc2UgZXZlbnQnLCB7XG4gICAgICByZWFkeUZvclNodXRkb3duOiB3aW5kb3dTdGF0ZS5yZWFkeUZvclNodXRkb3duKCksXG4gICAgICBzaG91bGRRdWl0OiB3aW5kb3dTdGF0ZS5zaG91bGRRdWl0KCksXG4gICAgfSk7XG4gICAgLy8gSWYgdGhlIGFwcGxpY2F0aW9uIGlzIHRlcm1pbmF0aW5nLCBqdXN0IGRvIHRoZSBkZWZhdWx0XG4gICAgaWYgKFxuICAgICAgaXNUZXN0RW52aXJvbm1lbnQoZ2V0RW52aXJvbm1lbnQoKSkgfHxcbiAgICAgICh3aW5kb3dTdGF0ZS5yZWFkeUZvclNodXRkb3duKCkgJiYgd2luZG93U3RhdGUuc2hvdWxkUXVpdCgpKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgdGhlIHNodXRkb3duXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIHVzZXIgaXMgaW4gZnVsbHNjcmVlbiBtb2RlIGFuZCBjbG9zZXMgdGhlIHdpbmRvdywgbm90IHRoZVxuICAgICAqIGFwcGxpY2F0aW9uLCB3ZSBuZWVkIHRoZW0gbGVhdmUgZnVsbHNjcmVlbiBmaXJzdCBiZWZvcmUgY2xvc2luZyBpdCB0b1xuICAgICAqIHByZXZlbnQgYSBibGFjayBzY3JlZW4uXG4gICAgICpcbiAgICAgKiBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL3NpZ25hbGFwcC9TaWduYWwtRGVza3RvcC9pc3N1ZXMvNDM0OFxuICAgICAqL1xuXG4gICAgaWYgKG1haW5XaW5kb3cuaXNGdWxsU2NyZWVuKCkpIHtcbiAgICAgIG1haW5XaW5kb3cub25jZSgnbGVhdmUtZnVsbC1zY3JlZW4nLCAoKSA9PiBtYWluV2luZG93Py5oaWRlKCkpO1xuICAgICAgbWFpbldpbmRvdy5zZXRGdWxsU2NyZWVuKGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFpbldpbmRvdy5oaWRlKCk7XG4gICAgfVxuXG4gICAgLy8gT24gTWFjLCBvciBvbiBvdGhlciBwbGF0Zm9ybXMgd2hlbiB0aGUgdHJheSBpY29uIGlzIGluIHVzZSwgdGhlIHdpbmRvd1xuICAgIC8vIHNob3VsZCBiZSBvbmx5IGhpZGRlbiwgbm90IGNsb3NlZCwgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIGNsb3NlIGJ1dHRvblxuICAgIGNvbnN0IHVzaW5nVHJheUljb24gPSBzaG91bGRNaW5pbWl6ZVRvU3lzdGVtVHJheShcbiAgICAgIGF3YWl0IHN5c3RlbVRyYXlTZXR0aW5nQ2FjaGUuZ2V0KClcbiAgICApO1xuICAgIGlmICghd2luZG93U3RhdGUuc2hvdWxkUXVpdCgpICYmICh1c2luZ1RyYXlJY29uIHx8IE9TLmlzTWFjT1MoKSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3aW5kb3dTdGF0ZS5tYXJrUmVxdWVzdGVkU2h1dGRvd24oKTtcbiAgICBhd2FpdCByZXF1ZXN0U2h1dGRvd24oKTtcbiAgICB3aW5kb3dTdGF0ZS5tYXJrUmVhZHlGb3JTaHV0ZG93bigpO1xuXG4gICAgYXdhaXQgc3FsLmNsb3NlKCk7XG4gICAgYXBwLnF1aXQoKTtcbiAgfSk7XG5cbiAgLy8gRW1pdHRlZCB3aGVuIHRoZSB3aW5kb3cgaXMgY2xvc2VkLlxuICBtYWluV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAvLyBpbiBhbiBhcnJheSBpZiB5b3VyIGFwcCBzdXBwb3J0cyBtdWx0aSB3aW5kb3dzLCB0aGlzIGlzIHRoZSB0aW1lXG4gICAgLy8gd2hlbiB5b3Ugc2hvdWxkIGRlbGV0ZSB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50LlxuICAgIG1haW5XaW5kb3cgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHNldHRpbmdzQ2hhbm5lbCkge1xuICAgICAgc2V0dGluZ3NDaGFubmVsLnNldE1haW5XaW5kb3cobWFpbldpbmRvdyk7XG4gICAgfVxuICAgIGlmIChzeXN0ZW1UcmF5U2VydmljZSkge1xuICAgICAgc3lzdGVtVHJheVNlcnZpY2Uuc2V0TWFpbldpbmRvdyhtYWluV2luZG93KTtcbiAgICB9XG4gIH0pO1xuXG4gIG1haW5XaW5kb3cub24oJ2VudGVyLWZ1bGwtc2NyZWVuJywgKCkgPT4ge1xuICAgIGlmIChtYWluV2luZG93KSB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2Z1bGwtc2NyZWVuLWNoYW5nZScsIHRydWUpO1xuICAgIH1cbiAgfSk7XG4gIG1haW5XaW5kb3cub24oJ2xlYXZlLWZ1bGwtc2NyZWVuJywgKCkgPT4ge1xuICAgIGlmIChtYWluV2luZG93KSB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2Z1bGwtc2NyZWVuLWNoYW5nZScsIGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIG1haW5XaW5kb3cub25jZSgncmVhZHktdG8tc2hvdycsIGFzeW5jICgpID0+IHtcbiAgICBnZXRMb2dnZXIoKS5pbmZvKCdtYWluIHdpbmRvdyBpcyByZWFkeS10by1zaG93Jyk7XG5cbiAgICAvLyBJZ25vcmUgc3FsIGVycm9ycyBhbmQgc2hvdyB0aGUgd2luZG93IGFueXdheVxuICAgIGF3YWl0IHNxbEluaXRQcm9taXNlO1xuXG4gICAgaWYgKCFtYWluV2luZG93KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvdWxkU2hvd1dpbmRvdyA9XG4gICAgICAhYXBwLmdldExvZ2luSXRlbVNldHRpbmdzKCkud2FzT3BlbmVkQXNIaWRkZW4gJiYgIXN0YXJ0SW5UcmF5O1xuXG4gICAgaWYgKHNob3VsZFNob3dXaW5kb3cpIHtcbiAgICAgIGdldExvZ2dlcigpLmluZm8oJ3Nob3dpbmcgbWFpbiB3aW5kb3cnKTtcbiAgICAgIG1haW5XaW5kb3cuc2hvdygpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFJlbmRlcmVyIGFza3MgaWYgd2UgYXJlIGRvbmUgd2l0aCB0aGUgZGF0YWJhc2VcbmlwYy5vbignZGF0YWJhc2UtcmVhZHknLCBhc3luYyBldmVudCA9PiB7XG4gIGlmICghc3FsSW5pdFByb21pc2UpIHtcbiAgICBnZXRMb2dnZXIoKS5lcnJvcignZGF0YWJhc2UtcmVhZHkgcmVxdWVzdGVkLCBidXQgc3FsSW5pdFByb21pc2UgaXMgZmFsc2V5Jyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3FsSW5pdFByb21pc2U7XG4gIGlmIChlcnJvcikge1xuICAgIGdldExvZ2dlcigpLmVycm9yKFxuICAgICAgJ2RhdGFiYXNlLXJlYWR5IHJlcXVlc3RlZCwgYnV0IGdvdCBzcWwgZXJyb3InLFxuICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2tcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGdldExvZ2dlcigpLmluZm8oJ3NlbmRpbmcgYGRhdGFiYXNlLXJlYWR5YCcpO1xuICBldmVudC5zZW5kZXIuc2VuZCgnZGF0YWJhc2UtcmVhZHknKTtcbn0pO1xuXG5pcGMub24oJ3Nob3ctd2luZG93JywgKCkgPT4ge1xuICBzaG93V2luZG93KCk7XG59KTtcblxuaXBjLm9uKCd0aXRsZS1iYXItZG91YmxlLWNsaWNrJywgKCkgPT4ge1xuICBpZiAoIW1haW5XaW5kb3cpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoT1MuaXNNYWNPUygpKSB7XG4gICAgc3dpdGNoIChcbiAgICAgIHN5c3RlbVByZWZlcmVuY2VzLmdldFVzZXJEZWZhdWx0KCdBcHBsZUFjdGlvbk9uRG91YmxlQ2xpY2snLCAnc3RyaW5nJylcbiAgICApIHtcbiAgICAgIGNhc2UgJ01pbmltaXplJzpcbiAgICAgICAgbWFpbldpbmRvdy5taW5pbWl6ZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ01heGltaXplJzpcbiAgICAgICAgdG9nZ2xlTWF4aW1pemVkQnJvd3NlcldpbmRvdyhtYWluV2luZG93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBJZiB0aGlzIGlzIGRpc2FibGVkLCBpdCdsbCBiZSAnTm9uZScuIElmIGl0J3MgYW55dGhpbmcgZWxzZSwgdGhhdCdzIHVuZXhwZWN0ZWQsXG4gICAgICAgIC8vICAgYnV0IHdlJ2xsIGp1c3Qgbm8tb3AuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBvbiBtYWNPUy4gVGhpcyBgZWxzZWAgYnJhbmNoIGlzIGp1c3QgaGVyZSB3aGVuL2lmXG4gICAgLy8gICB3ZSBhZGQgc3VwcG9ydCBmb3Igb3RoZXIgb3BlcmF0aW5nIHN5c3RlbXMuXG4gICAgdG9nZ2xlTWF4aW1pemVkQnJvd3NlcldpbmRvdyhtYWluV2luZG93KTtcbiAgfVxufSk7XG5cbmlwYy5vbignc2V0LWlzLWNhbGwtYWN0aXZlJywgKF9ldmVudCwgaXNDYWxsQWN0aXZlKSA9PiB7XG4gIHByZXZlbnREaXNwbGF5U2xlZXBTZXJ2aWNlLnNldEVuYWJsZWQoaXNDYWxsQWN0aXZlKTtcblxuICBpZiAoIW1haW5XaW5kb3cpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWlzVGhyb3R0bGluZ0VuYWJsZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgYmFja2dyb3VuZFRocm90dGxpbmc6IGJvb2xlYW47XG4gIGlmIChpc0NhbGxBY3RpdmUpIHtcbiAgICBnZXRMb2dnZXIoKS5pbmZvKCdCYWNrZ3JvdW5kIHRocm90dGxpbmcgZGlzYWJsZWQgYmVjYXVzZSBhIGNhbGwgaXMgYWN0aXZlJyk7XG4gICAgYmFja2dyb3VuZFRocm90dGxpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBnZXRMb2dnZXIoKS5pbmZvKCdCYWNrZ3JvdW5kIHRocm90dGxpbmcgZW5hYmxlZCBiZWNhdXNlIG5vIGNhbGwgaXMgYWN0aXZlJyk7XG4gICAgYmFja2dyb3VuZFRocm90dGxpbmcgPSB0cnVlO1xuICB9XG5cbiAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZXRCYWNrZ3JvdW5kVGhyb3R0bGluZyhiYWNrZ3JvdW5kVGhyb3R0bGluZyk7XG59KTtcblxuaXBjLm9uKCdjb252ZXJ0LWltYWdlJywgYXN5bmMgKGV2ZW50LCB1dWlkLCBkYXRhKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IsIHJlc3BvbnNlIH0gPSBhd2FpdCBoZWljQ29udmVydGVyKHV1aWQsIGRhdGEpO1xuICBldmVudC5yZXBseShgY29udmVydC1pbWFnZToke3V1aWR9YCwgeyBlcnJvciwgcmVzcG9uc2UgfSk7XG59KTtcblxubGV0IGlzUmVhZHlGb3JVcGRhdGVzID0gZmFsc2U7XG5hc3luYyBmdW5jdGlvbiByZWFkeUZvclVwZGF0ZXMoKSB7XG4gIGlmIChpc1JlYWR5Rm9yVXBkYXRlcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlzUmVhZHlGb3JVcGRhdGVzID0gdHJ1ZTtcblxuICAvLyBGaXJzdCwgaW5zdGFsbCByZXF1ZXN0ZWQgc3RpY2tlciBwYWNrXG4gIGNvbnN0IGluY29taW5nSHJlZiA9IGdldEluY29taW5nSHJlZihwcm9jZXNzLmFyZ3YpO1xuICBpZiAoaW5jb21pbmdIcmVmKSB7XG4gICAgaGFuZGxlU2dubEhyZWYoaW5jb21pbmdIcmVmKTtcbiAgfVxuXG4gIC8vIFNlY29uZCwgc3RhcnQgY2hlY2tpbmcgZm9yIGFwcCB1cGRhdGVzXG4gIHRyeSB7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgc2V0dGluZ3NDaGFubmVsICE9PSB1bmRlZmluZWQsXG4gICAgICAnU2V0dGluZ3NDaGFubmVsIG11c3QgYmUgaW5pdGlhbGl6ZWQnXG4gICAgKTtcbiAgICBhd2FpdCB1cGRhdGVyLnN0YXJ0KHNldHRpbmdzQ2hhbm5lbCwgZ2V0TG9nZ2VyKCksIGdldE1haW5XaW5kb3cpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGdldExvZ2dlcigpLmVycm9yKFxuICAgICAgJ0Vycm9yIHN0YXJ0aW5nIHVwZGF0ZSBjaGVja3M6JyxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gIHRyeSB7XG4gICAgZ2V0TG9nZ2VyKCkuaW5mbygnc3RhcnRpbmcgZm9yY2UgdXBkYXRlJyk7XG4gICAgYXdhaXQgdXBkYXRlci5mb3JjZSgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGdldExvZ2dlcigpLmVycm9yKFxuICAgICAgJ0Vycm9yIGR1cmluZyBmb3JjZSB1cGRhdGU6JyxcbiAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICk7XG4gIH1cbn1cblxuaXBjLm9uY2UoJ3JlYWR5LWZvci11cGRhdGVzJywgcmVhZHlGb3JVcGRhdGVzKTtcblxuY29uc3QgVEVOX01JTlVURVMgPSAxMCAqIDYwICogMTAwMDtcbnNldFRpbWVvdXQocmVhZHlGb3JVcGRhdGVzLCBURU5fTUlOVVRFUyk7XG5cbmZ1bmN0aW9uIG9wZW5Db250YWN0VXMoKSB7XG4gIHNoZWxsLm9wZW5FeHRlcm5hbChjcmVhdGVTdXBwb3J0VXJsKHsgbG9jYWxlOiBhcHAuZ2V0TG9jYWxlKCkgfSkpO1xufVxuXG5mdW5jdGlvbiBvcGVuSm9pblRoZUJldGEoKSB7XG4gIC8vIElmIHdlIG9taXQgdGhlIGxhbmd1YWdlLCB0aGUgc2l0ZSB3aWxsIGRldGVjdCB0aGUgbGFuZ3VhZ2UgYW5kIHJlZGlyZWN0XG4gIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9zdXBwb3J0LnNpZ25hbC5vcmcvaGMvYXJ0aWNsZXMvMzYwMDA3MzE4NDcxJyk7XG59XG5cbmZ1bmN0aW9uIG9wZW5SZWxlYXNlTm90ZXMoKSB7XG4gIGlmIChtYWluV2luZG93ICYmIG1haW5XaW5kb3cuaXNWaXNpYmxlKCkpIHtcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3Nob3ctcmVsZWFzZS1ub3RlcycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNoZWxsLm9wZW5FeHRlcm5hbChcbiAgICBgaHR0cHM6Ly9naXRodWIuY29tL3NpZ25hbGFwcC9TaWduYWwtRGVza3RvcC9yZWxlYXNlcy90YWcvdiR7YXBwLmdldFZlcnNpb24oKX1gXG4gICk7XG59XG5cbmZ1bmN0aW9uIG9wZW5TdXBwb3J0UGFnZSgpIHtcbiAgLy8gSWYgd2Ugb21pdCB0aGUgbGFuZ3VhZ2UsIHRoZSBzaXRlIHdpbGwgZGV0ZWN0IHRoZSBsYW5ndWFnZSBhbmQgcmVkaXJlY3RcbiAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL3N1cHBvcnQuc2lnbmFsLm9yZy9oYy9zZWN0aW9ucy8zNjAwMDE2MDI4MTInKTtcbn1cblxuZnVuY3Rpb24gb3BlbkZvcnVtcygpIHtcbiAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2NvbW11bml0eS5zaWduYWx1c2Vycy5vcmcvJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dLZXlib2FyZFNob3J0Y3V0cygpIHtcbiAgaWYgKG1haW5XaW5kb3cpIHtcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3Nob3cta2V5Ym9hcmQtc2hvcnRjdXRzJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0dXBBc05ld0RldmljZSgpIHtcbiAgaWYgKG1haW5XaW5kb3cpIHtcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3NldC11cC1hcy1uZXctZGV2aWNlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0dXBBc1N0YW5kYWxvbmUoKSB7XG4gIGlmIChtYWluV2luZG93KSB7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdzZXQtdXAtYXMtc3RhbmRhbG9uZScpO1xuICB9XG59XG5cbmxldCBzY3JlZW5TaGFyZVdpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZDtcbmFzeW5jIGZ1bmN0aW9uIHNob3dTY3JlZW5TaGFyZVdpbmRvdyhzb3VyY2VOYW1lOiBzdHJpbmcpIHtcbiAgaWYgKHNjcmVlblNoYXJlV2luZG93KSB7XG4gICAgc2NyZWVuU2hhcmVXaW5kb3cuc2hvd0luYWN0aXZlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2lkdGggPSA0ODA7XG5cbiAgY29uc3QgZGlzcGxheSA9IHNjcmVlbi5nZXRQcmltYXJ5RGlzcGxheSgpO1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMmUyZTJlJyxcbiAgICBkYXJrVGhlbWU6IHRydWUsXG4gICAgZnJhbWU6IGZhbHNlLFxuICAgIGZ1bGxzY3JlZW5hYmxlOiBmYWxzZSxcbiAgICBoZWlnaHQ6IDQ0LFxuICAgIG1heGltaXphYmxlOiBmYWxzZSxcbiAgICBtaW5pbWl6YWJsZTogZmFsc2UsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICBzaG93OiBmYWxzZSxcbiAgICB0aXRsZTogZ2V0TG9jYWxlKCkuaTE4bignc2NyZWVuU2hhcmVXaW5kb3cnKSxcbiAgICB0aXRsZUJhclN0eWxlOiBub25NYWluVGl0bGVCYXJTdHlsZSxcbiAgICB3aWR0aCxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgLi4uZGVmYXVsdFdlYlByZWZzLFxuICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uL3RzL3dpbmRvd3Mvc2NyZWVuU2hhcmUvcHJlbG9hZC5qcycpLFxuICAgIH0sXG4gICAgeDogTWF0aC5mbG9vcihkaXNwbGF5LnNpemUud2lkdGggLyAyKSAtIHdpZHRoIC8gMixcbiAgICB5OiAyNCxcbiAgfTtcblxuICBzY3JlZW5TaGFyZVdpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KG9wdGlvbnMpO1xuXG4gIGhhbmRsZUNvbW1vbldpbmRvd0V2ZW50cyhzY3JlZW5TaGFyZVdpbmRvdyk7XG5cbiAgc2NyZWVuU2hhcmVXaW5kb3cubG9hZFVSTChcbiAgICBhd2FpdCBwcmVwYXJlRmlsZVVybChbX19kaXJuYW1lLCAnLi4vc2NyZWVuU2hhcmUuaHRtbCddKVxuICApO1xuXG4gIHNjcmVlblNoYXJlV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgc2NyZWVuU2hhcmVXaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHNjcmVlblNoYXJlV2luZG93Lm9uY2UoJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiB7XG4gICAgaWYgKHNjcmVlblNoYXJlV2luZG93KSB7XG4gICAgICBzY3JlZW5TaGFyZVdpbmRvdy5zaG93SW5hY3RpdmUoKTtcbiAgICAgIHNjcmVlblNoYXJlV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXG4gICAgICAgICdyZW5kZXItc2NyZWVuLXNoYXJpbmctY29udHJvbGxlcicsXG4gICAgICAgIHNvdXJjZU5hbWVcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxubGV0IGFib3V0V2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuYXN5bmMgZnVuY3Rpb24gc2hvd0Fib3V0KCkge1xuICBpZiAoYWJvdXRXaW5kb3cpIHtcbiAgICBhYm91dFdpbmRvdy5zaG93KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGl0bGVCYXJPdmVybGF5ID0gYXdhaXQgZ2V0VGl0bGVCYXJPdmVybGF5KCk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICB3aWR0aDogNTAwLFxuICAgIGhlaWdodDogNTAwLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdGl0bGU6IGdldExvY2FsZSgpLmkxOG4oJ2Fib3V0U2lnbmFsRGVza3RvcCcpLFxuICAgIHRpdGxlQmFyU3R5bGU6IG5vbk1haW5UaXRsZUJhclN0eWxlLFxuICAgIHRpdGxlQmFyT3ZlcmxheSxcbiAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgYmFja2dyb3VuZENvbG9yOiBhd2FpdCBnZXRCYWNrZ3JvdW5kQ29sb3IoKSxcbiAgICBzaG93OiBmYWxzZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgLi4uZGVmYXVsdFdlYlByZWZzLFxuICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uL3RzL3dpbmRvd3MvYWJvdXQvcHJlbG9hZC5qcycpLFxuICAgICAgbmF0aXZlV2luZG93T3BlbjogdHJ1ZSxcbiAgICB9LFxuICB9O1xuXG4gIGFib3V0V2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3cob3B0aW9ucyk7XG5cbiAgaGFuZGxlQ29tbW9uV2luZG93RXZlbnRzKGFib3V0V2luZG93LCB0aXRsZUJhck92ZXJsYXkpO1xuXG4gIGFib3V0V2luZG93LmxvYWRVUkwoYXdhaXQgcHJlcGFyZUZpbGVVcmwoW19fZGlybmFtZSwgJy4uL2Fib3V0Lmh0bWwnXSkpO1xuXG4gIGFib3V0V2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgYWJvdXRXaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIGFib3V0V2luZG93Lm9uY2UoJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiB7XG4gICAgaWYgKGFib3V0V2luZG93KSB7XG4gICAgICBhYm91dFdpbmRvdy5zaG93KCk7XG4gICAgfVxuICB9KTtcbn1cblxubGV0IHNldHRpbmdzV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuYXN5bmMgZnVuY3Rpb24gc2hvd1NldHRpbmdzV2luZG93KCkge1xuICBpZiAoc2V0dGluZ3NXaW5kb3cpIHtcbiAgICBzZXR0aW5nc1dpbmRvdy5zaG93KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGl0bGVCYXJPdmVybGF5ID0gYXdhaXQgZ2V0VGl0bGVCYXJPdmVybGF5KCk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICB3aWR0aDogNzAwLFxuICAgIGhlaWdodDogNzAwLFxuICAgIGZyYW1lOiB0cnVlLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdGl0bGU6IGdldExvY2FsZSgpLmkxOG4oJ3NpZ25hbERlc2t0b3BQcmVmZXJlbmNlcycpLFxuICAgIHRpdGxlQmFyU3R5bGU6IG5vbk1haW5UaXRsZUJhclN0eWxlLFxuICAgIHRpdGxlQmFyT3ZlcmxheSxcbiAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgYmFja2dyb3VuZENvbG9yOiBhd2FpdCBnZXRCYWNrZ3JvdW5kQ29sb3IoKSxcbiAgICBzaG93OiBmYWxzZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgLi4uZGVmYXVsdFdlYlByZWZzLFxuICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uL3RzL3dpbmRvd3Mvc2V0dGluZ3MvcHJlbG9hZC5qcycpLFxuICAgICAgbmF0aXZlV2luZG93T3BlbjogdHJ1ZSxcbiAgICB9LFxuICB9O1xuXG4gIHNldHRpbmdzV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3cob3B0aW9ucyk7XG5cbiAgaGFuZGxlQ29tbW9uV2luZG93RXZlbnRzKHNldHRpbmdzV2luZG93LCB0aXRsZUJhck92ZXJsYXkpO1xuXG4gIHNldHRpbmdzV2luZG93LmxvYWRVUkwoYXdhaXQgcHJlcGFyZUZpbGVVcmwoW19fZGlybmFtZSwgJy4uL3NldHRpbmdzLmh0bWwnXSkpO1xuXG4gIHNldHRpbmdzV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgc2V0dGluZ3NXaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIGlwYy5vbmNlKCdzZXR0aW5ncy1kb25lLXJlbmRlcmluZycsICgpID0+IHtcbiAgICBpZiAoIXNldHRpbmdzV2luZG93KSB7XG4gICAgICBnZXRMb2dnZXIoKS53YXJuKCdzZXR0aW5ncy1kb25lLXJlbmRlcmluZzogbm8gc2V0dGluZ3NXaW5kb3cgYXZhaWxhYmxlIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldHRpbmdzV2luZG93LnNob3coKTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldElzTGlua2VkKCkge1xuICB0cnkge1xuICAgIGNvbnN0IG51bWJlciA9IGF3YWl0IHNxbC5zcWxDYWxsKCdnZXRJdGVtQnlJZCcsIFsnbnVtYmVyX2lkJ10pO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gYXdhaXQgc3FsLnNxbENhbGwoJ2dldEl0ZW1CeUlkJywgWydwYXNzd29yZCddKTtcbiAgICByZXR1cm4gQm9vbGVhbihudW1iZXIgJiYgcGFzc3dvcmQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmxldCBzdGlja2VyQ3JlYXRvcldpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZDtcbmFzeW5jIGZ1bmN0aW9uIHNob3dTdGlja2VyQ3JlYXRvcigpIHtcbiAgaWYgKCEoYXdhaXQgZ2V0SXNMaW5rZWQoKSkpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gZ2V0TG9jYWxlKCkuaTE4bignU3RpY2tlckNyZWF0b3ItLUF1dGhlbnRpY2F0aW9uLS1lcnJvcicpO1xuXG4gICAgZGlhbG9nLnNob3dNZXNzYWdlQm94KHtcbiAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgIG1lc3NhZ2UsXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc3RpY2tlckNyZWF0b3JXaW5kb3cpIHtcbiAgICBzdGlja2VyQ3JlYXRvcldpbmRvdy5zaG93KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyB4ID0gMCwgeSA9IDAgfSA9IHdpbmRvd0NvbmZpZyB8fCB7fTtcblxuICBjb25zdCB0aXRsZUJhck92ZXJsYXkgPSBhd2FpdCBnZXRUaXRsZUJhck92ZXJsYXkoKTtcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIHg6IHggKyAxMDAsXG4gICAgeTogeSArIDEwMCxcbiAgICB3aWR0aDogODAwLFxuICAgIG1pbldpZHRoOiA4MDAsXG4gICAgaGVpZ2h0OiA2NTAsXG4gICAgdGl0bGU6IGdldExvY2FsZSgpLmkxOG4oJ3NpZ25hbERlc2t0b3BTdGlja2VyQ3JlYXRvcicpLFxuICAgIHRpdGxlQmFyU3R5bGU6IG5vbk1haW5UaXRsZUJhclN0eWxlLFxuICAgIHRpdGxlQmFyT3ZlcmxheSxcbiAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgYmFja2dyb3VuZENvbG9yOiBhd2FpdCBnZXRCYWNrZ3JvdW5kQ29sb3IoKSxcbiAgICBzaG93OiBmYWxzZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgLi4uZGVmYXVsdFdlYlByZWZzLFxuICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IGZhbHNlLFxuICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi9zdGlja2VyLWNyZWF0b3IvcHJlbG9hZC5qcycpLFxuICAgICAgbmF0aXZlV2luZG93T3BlbjogdHJ1ZSxcbiAgICAgIHNwZWxsY2hlY2s6IGF3YWl0IGdldFNwZWxsQ2hlY2tTZXR0aW5nKCksXG4gICAgfSxcbiAgfTtcblxuICBzdGlja2VyQ3JlYXRvcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KG9wdGlvbnMpO1xuICBzZXR1cFNwZWxsQ2hlY2tlcihzdGlja2VyQ3JlYXRvcldpbmRvdywgZ2V0TG9jYWxlKCkpO1xuXG4gIGhhbmRsZUNvbW1vbldpbmRvd0V2ZW50cyhzdGlja2VyQ3JlYXRvcldpbmRvdywgdGl0bGVCYXJPdmVybGF5KTtcblxuICBjb25zdCBhcHBVcmwgPSBwcm9jZXNzLmVudi5TSUdOQUxfRU5BQkxFX0hUVFBcbiAgICA/IHByZXBhcmVVcmwoXG4gICAgICAgIG5ldyBVUkwoJ2h0dHA6Ly9sb2NhbGhvc3Q6NjM4MC9zdGlja2VyLWNyZWF0b3IvZGlzdC9pbmRleC5odG1sJylcbiAgICAgIClcbiAgICA6IHByZXBhcmVGaWxlVXJsKFtfX2Rpcm5hbWUsICcuLi9zdGlja2VyLWNyZWF0b3IvZGlzdC9pbmRleC5odG1sJ10pO1xuXG4gIHN0aWNrZXJDcmVhdG9yV2luZG93LmxvYWRVUkwoYXdhaXQgYXBwVXJsKTtcblxuICBzdGlja2VyQ3JlYXRvcldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgIHN0aWNrZXJDcmVhdG9yV2luZG93ID0gdW5kZWZpbmVkO1xuICB9KTtcblxuICBzdGlja2VyQ3JlYXRvcldpbmRvdy5vbmNlKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xuICAgIGlmICghc3RpY2tlckNyZWF0b3JXaW5kb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdGlja2VyQ3JlYXRvcldpbmRvdy5zaG93KCk7XG5cbiAgICBpZiAoY29uZmlnLmdldDxib29sZWFuPignb3BlbkRldlRvb2xzJykpIHtcbiAgICAgIC8vIE9wZW4gdGhlIERldlRvb2xzLlxuICAgICAgc3RpY2tlckNyZWF0b3JXaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gICAgfVxuICB9KTtcbn1cblxubGV0IGRlYnVnTG9nV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuYXN5bmMgZnVuY3Rpb24gc2hvd0RlYnVnTG9nV2luZG93KCkge1xuICBpZiAoZGVidWdMb2dXaW5kb3cpIHtcbiAgICBkZWJ1Z0xvZ1dpbmRvdy5zaG93KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGl0bGVCYXJPdmVybGF5ID0gYXdhaXQgZ2V0VGl0bGVCYXJPdmVybGF5KCk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICB3aWR0aDogNzAwLFxuICAgIGhlaWdodDogNTAwLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdGl0bGU6IGdldExvY2FsZSgpLmkxOG4oJ2RlYnVnTG9nJyksXG4gICAgdGl0bGVCYXJTdHlsZTogbm9uTWFpblRpdGxlQmFyU3R5bGUsXG4gICAgdGl0bGVCYXJPdmVybGF5LFxuICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IGF3YWl0IGdldEJhY2tncm91bmRDb2xvcigpLFxuICAgIHNob3c6IGZhbHNlLFxuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAuLi5kZWZhdWx0V2ViUHJlZnMsXG4gICAgICBub2RlSW50ZWdyYXRpb246IGZhbHNlLFxuICAgICAgbm9kZUludGVncmF0aW9uSW5Xb3JrZXI6IGZhbHNlLFxuICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgIHByZWxvYWQ6IGpvaW4oX19kaXJuYW1lLCAnLi4vdHMvd2luZG93cy9kZWJ1Z2xvZy9wcmVsb2FkLmpzJyksXG4gICAgICBuYXRpdmVXaW5kb3dPcGVuOiB0cnVlLFxuICAgIH0sXG4gICAgcGFyZW50OiBtYWluV2luZG93LFxuICAgIC8vIEVsZWN0cm9uIGhhcyBbYSBtYWNPUyBidWddWzBdIHRoYXQgY2F1c2VzIHBhcmVudCB3aW5kb3dzIHRvIGJlY29tZSB1bnJlc3BvbnNpdmUgaWZcbiAgICAvLyAgIGl0J3MgZnVsbHNjcmVlbiBhbmQgb3BlbnMgYSBmdWxsc2NyZWVuIGNoaWxkIHdpbmRvdy4gVW50aWwgdGhhdCdzIGZpeGVkLCB3ZVxuICAgIC8vICAgcHJldmVudCB0aGUgY2hpbGQgd2luZG93IGZyb20gYmVpbmcgZnVsbHNjcmVlbmFibGUsIHdoaWNoIHNpZGVzdGVwcyB0aGUgcHJvYmxlbS5cbiAgICAvLyBbMF06IGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMzIzNzRcbiAgICBmdWxsc2NyZWVuYWJsZTogIU9TLmlzTWFjT1MoKSxcbiAgfTtcblxuICBkZWJ1Z0xvZ1dpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KG9wdGlvbnMpO1xuXG4gIGhhbmRsZUNvbW1vbldpbmRvd0V2ZW50cyhkZWJ1Z0xvZ1dpbmRvdywgdGl0bGVCYXJPdmVybGF5KTtcblxuICBkZWJ1Z0xvZ1dpbmRvdy5sb2FkVVJMKFxuICAgIGF3YWl0IHByZXBhcmVGaWxlVXJsKFtfX2Rpcm5hbWUsICcuLi9kZWJ1Z19sb2cuaHRtbCddKVxuICApO1xuXG4gIGRlYnVnTG9nV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgZGVidWdMb2dXaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIGRlYnVnTG9nV2luZG93Lm9uY2UoJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiB7XG4gICAgaWYgKGRlYnVnTG9nV2luZG93KSB7XG4gICAgICBkZWJ1Z0xvZ1dpbmRvdy5zaG93KCk7XG5cbiAgICAgIC8vIEVsZWN0cm9uIHNvbWV0aW1lcyBwdXRzIHRoZSB3aW5kb3cgaW4gYSBzdHJhbmdlIHNwb3QgdW50aWwgaXQncyBzaG93bi5cbiAgICAgIGRlYnVnTG9nV2luZG93LmNlbnRlcigpO1xuICAgIH1cbiAgfSk7XG59XG5cbmxldCBwZXJtaXNzaW9uc1BvcHVwV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuZnVuY3Rpb24gc2hvd1Blcm1pc3Npb25zUG9wdXBXaW5kb3coZm9yQ2FsbGluZzogYm9vbGVhbiwgZm9yQ2FtZXJhOiBib29sZWFuKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hc3luYy1wcm9taXNlLWV4ZWN1dG9yXG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihhc3luYyAocmVzb2x2ZUZuLCByZWplY3QpID0+IHtcbiAgICBpZiAocGVybWlzc2lvbnNQb3B1cFdpbmRvdykge1xuICAgICAgcGVybWlzc2lvbnNQb3B1cFdpbmRvdy5zaG93KCk7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdQZXJtaXNzaW9uIHdpbmRvdyBhbHJlYWR5IHNob3dpbmcnKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghbWFpbldpbmRvdykge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcignTm8gbWFpbiB3aW5kb3cnKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZSA9IG1haW5XaW5kb3cuZ2V0U2l6ZSgpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICB3aWR0aDogTWF0aC5taW4oNDAwLCBzaXplWzBdKSxcbiAgICAgIGhlaWdodDogTWF0aC5taW4oMTUwLCBzaXplWzFdKSxcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICB0aXRsZTogZ2V0TG9jYWxlKCkuaTE4bignYWxsb3dBY2Nlc3MnKSxcbiAgICAgIHRpdGxlQmFyU3R5bGU6IG5vbk1haW5UaXRsZUJhclN0eWxlLFxuICAgICAgYXV0b0hpZGVNZW51QmFyOiB0cnVlLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBhd2FpdCBnZXRCYWNrZ3JvdW5kQ29sb3IoKSxcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICAuLi5kZWZhdWx0V2ViUHJlZnMsXG4gICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsXG4gICAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgICAgcHJlbG9hZDogam9pbihfX2Rpcm5hbWUsICcuLi90cy93aW5kb3dzL3Blcm1pc3Npb25zL3ByZWxvYWQuanMnKSxcbiAgICAgICAgbmF0aXZlV2luZG93T3BlbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBwYXJlbnQ6IG1haW5XaW5kb3csXG4gICAgfTtcblxuICAgIHBlcm1pc3Npb25zUG9wdXBXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyhvcHRpb25zKTtcblxuICAgIGhhbmRsZUNvbW1vbldpbmRvd0V2ZW50cyhwZXJtaXNzaW9uc1BvcHVwV2luZG93KTtcblxuICAgIHBlcm1pc3Npb25zUG9wdXBXaW5kb3cubG9hZFVSTChcbiAgICAgIGF3YWl0IHByZXBhcmVGaWxlVXJsKFtfX2Rpcm5hbWUsICcuLi9wZXJtaXNzaW9uc19wb3B1cC5odG1sJ10sIHtcbiAgICAgICAgZm9yQ2FsbGluZyxcbiAgICAgICAgZm9yQ2FtZXJhLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcGVybWlzc2lvbnNQb3B1cFdpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgICAgcmVtb3ZlRGFya092ZXJsYXkoKTtcbiAgICAgIHBlcm1pc3Npb25zUG9wdXBXaW5kb3cgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHJlc29sdmVGbigpO1xuICAgIH0pO1xuXG4gICAgcGVybWlzc2lvbnNQb3B1cFdpbmRvdy5vbmNlKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xuICAgICAgaWYgKHBlcm1pc3Npb25zUG9wdXBXaW5kb3cpIHtcbiAgICAgICAgYWRkRGFya092ZXJsYXkoKTtcbiAgICAgICAgcGVybWlzc2lvbnNQb3B1cFdpbmRvdy5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5jb25zdCBydW5TUUxDb3JydXB0aW9uSGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgLy8gVGhpcyBpcyBhIGdsb3JpZmllZCBldmVudCBoYW5kbGVyLiBOb3JtYWxseSwgdGhpcyBwcm9taXNlIG5ldmVyIHJlc29sdmVzLFxuICAvLyBidXQgaWYgdGhlcmUgaXMgYSBjb3JydXB0aW9uIGVycm9yIHRyaWdnZXJlZCBieSBhbnkgcXVlcnkgdGhhdCB3ZSBydW5cbiAgLy8gYWdhaW5zdCB0aGUgZGF0YWJhc2UgLSB0aGUgcHJvbWlzZSB3aWxsIHJlc29sdmUgYW5kIHdlIHdpbGwgY2FsbFxuICAvLyBgb25EYXRhYmFzZUVycm9yYC5cbiAgY29uc3QgZXJyb3IgPSBhd2FpdCBzcWwud2hlbkNvcnJ1cHRlZCgpO1xuXG4gIGdldExvZ2dlcigpLmVycm9yKFxuICAgICdEZXRlY3RlZCBzcWwgY29ycnVwdGlvbiBpbiBtYWluIHByb2Nlc3MuICcgK1xuICAgICAgYFJlc3RhcnRpbmcgdGhlIGFwcGxpY2F0aW9uIGltbWVkaWF0ZWx5LiBFcnJvcjogJHtlcnJvci5tZXNzYWdlfWBcbiAgKTtcblxuICBhd2FpdCBvbkRhdGFiYXNlRXJyb3IoZXJyb3Iuc3RhY2sgfHwgZXJyb3IubWVzc2FnZSk7XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplU1FMKFxuICB1c2VyRGF0YVBhdGg6IHN0cmluZ1xuKTogUHJvbWlzZTx7IG9rOiB0cnVlOyBlcnJvcjogdW5kZWZpbmVkIH0gfCB7IG9rOiBmYWxzZTsgZXJyb3I6IEVycm9yIH0+IHtcbiAgbGV0IGtleTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBjb25zdCBrZXlGcm9tQ29uZmlnID0gdXNlckNvbmZpZy5nZXQoJ2tleScpO1xuICBpZiAodHlwZW9mIGtleUZyb21Db25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAga2V5ID0ga2V5RnJvbUNvbmZpZztcbiAgfSBlbHNlIGlmIChrZXlGcm9tQ29uZmlnKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcbiAgICAgIFwiaW5pdGlhbGl6ZVNRTDogZ290IGtleSBmcm9tIGNvbmZpZywgYnV0IGl0IHdhc24ndCBhIHN0cmluZ1wiXG4gICAgKTtcbiAgfVxuICBpZiAoIWtleSkge1xuICAgIGdldExvZ2dlcigpLmluZm8oXG4gICAgICAna2V5L2luaXRpYWxpemU6IEdlbmVyYXRpbmcgbmV3IGVuY3J5cHRpb24ga2V5LCBzaW5jZSB3ZSBkaWQgbm90IGZpbmQgaXQgb24gZGlzaydcbiAgICApO1xuICAgIC8vIGh0dHBzOi8vd3d3LnpldGV0aWMubmV0L3NxbGNpcGhlci9zcWxjaXBoZXItYXBpLyNrZXlcbiAgICBrZXkgPSByYW5kb21CeXRlcygzMikudG9TdHJpbmcoJ2hleCcpO1xuICAgIHVzZXJDb25maWcuc2V0KCdrZXknLCBrZXkpO1xuICB9XG5cbiAgc3FsSW5pdFRpbWVTdGFydCA9IERhdGUubm93KCk7XG4gIHRyeSB7XG4gICAgLy8gVGhpcyBzaG91bGQgYmUgdGhlIGZpcnN0IGF3YWl0ZWQgY2FsbCBpbiB0aGlzIGZ1bmN0aW9uLCBvdGhlcndpc2VcbiAgICAvLyBgc3FsLnNxbENhbGxgIHdpbGwgdGhyb3cgYW4gdW5pbml0aWFsaXplZCBlcnJvciBpbnN0ZWFkIG9mIHdhaXRpbmcgZm9yXG4gICAgLy8gaW5pdCB0byBmaW5pc2guXG4gICAgYXdhaXQgc3FsLmluaXRpYWxpemUoe1xuICAgICAgY29uZmlnRGlyOiB1c2VyRGF0YVBhdGgsXG4gICAgICBrZXksXG4gICAgICBsb2dnZXI6IGdldExvZ2dlcigpLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiBmYWxzZSxcbiAgICAgIGVycm9yOiBuZXcgRXJyb3IoYGluaXRpYWxpemVTUUw6IENhdWdodCBhIG5vbi1lcnJvciAnJHtlcnJvcn0nYCksXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICBzcWxJbml0VGltZUVuZCA9IERhdGUubm93KCk7XG4gIH1cblxuICAvLyBPbmx5IGlmIHdlJ3ZlIGluaXRpYWxpemVkIHRoaW5ncyBzdWNjZXNzZnVsbHkgZG8gd2Ugc2V0IHVwIHRoZSBjb3JydXB0aW9uIGhhbmRsZXJcbiAgcnVuU1FMQ29ycnVwdGlvbkhhbmRsZXIoKTtcblxuICByZXR1cm4geyBvazogdHJ1ZSwgZXJyb3I6IHVuZGVmaW5lZCB9O1xufVxuXG5jb25zdCBvbkRhdGFiYXNlRXJyb3IgPSBhc3luYyAoZXJyb3I6IHN0cmluZykgPT4ge1xuICAvLyBQcmV2ZW50IHdpbmRvdyBmcm9tIHJlLW9wZW5pbmdcbiAgcmVhZHkgPSBmYWxzZTtcblxuICBpZiAobWFpbldpbmRvdykge1xuICAgIHNldHRpbmdzQ2hhbm5lbD8uaW52b2tlQ2FsbGJhY2tJbk1haW5XaW5kb3coJ2Nsb3NlREInLCBbXSk7XG4gICAgbWFpbldpbmRvdy5jbG9zZSgpO1xuICB9XG4gIG1haW5XaW5kb3cgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3QgYnV0dG9uSW5kZXggPSBkaWFsb2cuc2hvd01lc3NhZ2VCb3hTeW5jKHtcbiAgICBidXR0b25zOiBbXG4gICAgICBnZXRMb2NhbGUoKS5pMThuKCdkZWxldGVBbmRSZXN0YXJ0JyksXG4gICAgICBnZXRMb2NhbGUoKS5pMThuKCdjb3B5RXJyb3JBbmRRdWl0JyksXG4gICAgXSxcbiAgICBkZWZhdWx0SWQ6IDEsXG4gICAgY2FuY2VsSWQ6IDEsXG4gICAgZGV0YWlsOiByZWRhY3RBbGwoZXJyb3IpLFxuICAgIG1lc3NhZ2U6IGdldExvY2FsZSgpLmkxOG4oJ2RhdGFiYXNlRXJyb3InKSxcbiAgICBub0xpbms6IHRydWUsXG4gICAgdHlwZTogJ2Vycm9yJyxcbiAgfSk7XG5cbiAgaWYgKGJ1dHRvbkluZGV4ID09PSAxKSB7XG4gICAgY2xpcGJvYXJkLndyaXRlVGV4dChgRGF0YWJhc2Ugc3RhcnR1cCBlcnJvcjpcXG5cXG4ke3JlZGFjdEFsbChlcnJvcil9YCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgc3FsLnJlbW92ZURCKCk7XG4gICAgdXNlckNvbmZpZy5yZW1vdmUoKTtcbiAgICBnZXRMb2dnZXIoKS5lcnJvcihcbiAgICAgICdvbkRhdGFiYXNlRXJyb3I6IFJlcXVlc3RpbmcgaW1tZWRpYXRlIHJlc3RhcnQgYWZ0ZXIgcXVpdCdcbiAgICApO1xuICAgIGFwcC5yZWxhdW5jaCgpO1xuICB9XG5cbiAgZ2V0TG9nZ2VyKCkuZXJyb3IoJ29uRGF0YWJhc2VFcnJvcjogUXVpdHRpbmcgYXBwbGljYXRpb24nKTtcbiAgYXBwLmV4aXQoMSk7XG59O1xuXG5sZXQgc3FsSW5pdFByb21pc2U6XG4gIHwgUHJvbWlzZTx7IG9rOiB0cnVlOyBlcnJvcjogdW5kZWZpbmVkIH0gfCB7IG9rOiBmYWxzZTsgZXJyb3I6IEVycm9yIH0+XG4gIHwgdW5kZWZpbmVkO1xuXG5pcGMub24oJ2RhdGFiYXNlLWVycm9yJywgKF9ldmVudDogRWxlY3Ryb24uRXZlbnQsIGVycm9yOiBzdHJpbmcpID0+IHtcbiAgb25EYXRhYmFzZUVycm9yKGVycm9yKTtcbn0pO1xuXG5mdW5jdGlvbiBnZXRBcHBMb2NhbGUoKTogc3RyaW5nIHtcbiAgcmV0dXJuIGdldEVudmlyb25tZW50KCkgPT09IEVudmlyb25tZW50LlRlc3QgPyAnZW4nIDogYXBwLmdldExvY2FsZSgpO1xufVxuXG4vLyBTaWduYWwgZG9lc24ndCByZWFsbHkgdXNlIG1lZGlhIGtleXMgc28gd2Ugc2V0IHRoaXMgc3dpdGNoIGhlcmUgdG8gdW5ibG9ja1xuLy8gdGhlbSBzbyB0aGF0IG90aGVyIGFwcHMgY2FuIHVzZSB0aGVtIGlmIHRoZXkgbmVlZCB0by5cbmFwcC5jb21tYW5kTGluZS5hcHBlbmRTd2l0Y2goJ2Rpc2FibGUtZmVhdHVyZXMnLCAnSGFyZHdhcmVNZWRpYUtleUhhbmRsaW5nJyk7XG5cbi8vIElmIHdlIGRvbid0IHNldCB0aGlzLCBEZXNrdG9wIHdpbGwgYXNrIGZvciBhY2Nlc3MgdG8ga2V5Y2hhaW4va2V5cmluZyBvbiBzdGFydHVwXG5hcHAuY29tbWFuZExpbmUuYXBwZW5kU3dpdGNoKCdwYXNzd29yZC1zdG9yZScsICdiYXNpYycpO1xuXG4vLyBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aGVuIEVsZWN0cm9uIGhhcyBmaW5pc2hlZFxuLy8gaW5pdGlhbGl6YXRpb24gYW5kIGlzIHJlYWR5IHRvIGNyZWF0ZSBicm93c2VyIHdpbmRvd3MuXG4vLyBTb21lIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciB0aGlzIGV2ZW50IG9jY3Vycy5cbmxldCByZWFkeSA9IGZhbHNlO1xuYXBwLm9uKCdyZWFkeScsIGFzeW5jICgpID0+IHtcbiAgdXBkYXRlRGVmYXVsdFNlc3Npb24oc2Vzc2lvbi5kZWZhdWx0U2Vzc2lvbik7XG5cbiAgY29uc3QgW3VzZXJEYXRhUGF0aCwgY3Jhc2hEdW1wc1BhdGhdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIHJlYWxwYXRoKGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpKSxcbiAgICByZWFscGF0aChhcHAuZ2V0UGF0aCgnY3Jhc2hEdW1wcycpKSxcbiAgXSk7XG5cbiAgbG9nZ2VyID0gYXdhaXQgbG9nZ2luZy5pbml0aWFsaXplKGdldE1haW5XaW5kb3cpO1xuXG4gIGF3YWl0IHNldHVwQ3Jhc2hSZXBvcnRzKGdldExvZ2dlcik7XG5cbiAgaWYgKCFsb2NhbGUpIHtcbiAgICBjb25zdCBhcHBMb2NhbGUgPSBnZXRBcHBMb2NhbGUoKTtcbiAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHsgYXBwTG9jYWxlLCBsb2dnZXI6IGdldExvZ2dlcigpIH0pO1xuICB9XG5cbiAgc3FsSW5pdFByb21pc2UgPSBpbml0aWFsaXplU1FMKHVzZXJEYXRhUGF0aCk7XG5cbiAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICBzZXR0aW5nc0NoYW5uZWwgPSBuZXcgU2V0dGluZ3NDaGFubmVsKCk7XG4gIHNldHRpbmdzQ2hhbm5lbC5pbnN0YWxsKCk7XG5cbiAgLy8gV2UgdXNlIHRoaXMgZXZlbnQgb25seSBhIHNpbmdsZSB0aW1lIHRvIGxvZyB0aGUgc3RhcnR1cCB0aW1lIG9mIHRoZSBhcHBcbiAgLy8gZnJvbSB3aGVuIGl0J3MgZmlyc3QgcmVhZHkgdW50aWwgdGhlIGxvYWRpbmcgc2NyZWVuIGRpc2FwcGVhcnMuXG4gIGlwYy5vbmNlKCdzaWduYWwtYXBwLWxvYWRlZCcsIChldmVudCwgaW5mbykgPT4ge1xuICAgIGNvbnN0IHsgcHJlbG9hZFRpbWUsIGNvbm5lY3RUaW1lLCBwcm9jZXNzZWRDb3VudCB9ID0gaW5mbztcblxuICAgIGNvbnN0IGxvYWRUaW1lID0gRGF0ZS5ub3coKSAtIHN0YXJ0VGltZTtcbiAgICBjb25zdCBzcWxJbml0VGltZSA9IHNxbEluaXRUaW1lRW5kIC0gc3FsSW5pdFRpbWVTdGFydDtcblxuICAgIGNvbnN0IG1lc3NhZ2VUaW1lID0gbG9hZFRpbWUgLSBwcmVsb2FkVGltZSAtIGNvbm5lY3RUaW1lO1xuICAgIGNvbnN0IG1lc3NhZ2VzUGVyU2VjID0gKHByb2Nlc3NlZENvdW50ICogMTAwMCkgLyBtZXNzYWdlVGltZTtcblxuICAgIGNvbnN0IGlubmVyTG9nZ2VyID0gZ2V0TG9nZ2VyKCk7XG4gICAgaW5uZXJMb2dnZXIuaW5mbygnQXBwIGxvYWRlZCAtIHRpbWU6JywgbG9hZFRpbWUpO1xuICAgIGlubmVyTG9nZ2VyLmluZm8oJ1NRTCBpbml0IC0gdGltZTonLCBzcWxJbml0VGltZSk7XG4gICAgaW5uZXJMb2dnZXIuaW5mbygnUHJlbG9hZCAtIHRpbWU6JywgcHJlbG9hZFRpbWUpO1xuICAgIGlubmVyTG9nZ2VyLmluZm8oJ1dlYlNvY2tldCBjb25uZWN0IC0gdGltZTonLCBjb25uZWN0VGltZSk7XG4gICAgaW5uZXJMb2dnZXIuaW5mbygnUHJvY2Vzc2VkIGNvdW50OicsIHByb2Nlc3NlZENvdW50KTtcbiAgICBpbm5lckxvZ2dlci5pbmZvKCdNZXNzYWdlcyBwZXIgc2Vjb25kOicsIG1lc3NhZ2VzUGVyU2VjKTtcblxuICAgIGV2ZW50LnNlbmRlci5zZW5kKCdjaTpldmVudCcsICdhcHAtbG9hZGVkJywge1xuICAgICAgbG9hZFRpbWUsXG4gICAgICBzcWxJbml0VGltZSxcbiAgICAgIHByZWxvYWRUaW1lLFxuICAgICAgY29ubmVjdFRpbWUsXG4gICAgICBwcm9jZXNzZWRDb3VudCxcbiAgICAgIG1lc3NhZ2VzUGVyU2VjLFxuICAgIH0pO1xuICB9KTtcblxuICBjb25zdCBpbnN0YWxsUGF0aCA9IGF3YWl0IHJlYWxwYXRoKGFwcC5nZXRBcHBQYXRoKCkpO1xuXG4gIGFkZFNlbnNpdGl2ZVBhdGgodXNlckRhdGFQYXRoKTtcbiAgYWRkU2Vuc2l0aXZlUGF0aChjcmFzaER1bXBzUGF0aCk7XG5cbiAgaWYgKGdldEVudmlyb25tZW50KCkgIT09IEVudmlyb25tZW50LlRlc3QpIHtcbiAgICBpbnN0YWxsRmlsZUhhbmRsZXIoe1xuICAgICAgcHJvdG9jb2w6IGVsZWN0cm9uUHJvdG9jb2wsXG4gICAgICB1c2VyRGF0YVBhdGgsXG4gICAgICBpbnN0YWxsUGF0aCxcbiAgICAgIGlzV2luZG93czogT1MuaXNXaW5kb3dzKCksXG4gICAgfSk7XG4gIH1cblxuICBpbnN0YWxsV2ViSGFuZGxlcih7XG4gICAgZW5hYmxlSHR0cDogQm9vbGVhbihwcm9jZXNzLmVudi5TSUdOQUxfRU5BQkxFX0hUVFApLFxuICAgIHByb3RvY29sOiBlbGVjdHJvblByb3RvY29sLFxuICB9KTtcblxuICBsb2dnZXIuaW5mbygnYXBwIHJlYWR5Jyk7XG4gIGxvZ2dlci5pbmZvKGBzdGFydGluZyB2ZXJzaW9uICR7cGFja2FnZUpzb24udmVyc2lvbn1gKTtcblxuICAvLyBUaGlzIGxvZ2dpbmcgaGVscHMgdXMgZGVidWcgdXNlciByZXBvcnRzIGFib3V0IGJyb2tlbiBkZXZpY2VzLlxuICB7XG4gICAgbGV0IGdldE1lZGlhQWNjZXNzU3RhdHVzO1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgbm90IHN1cHBvcnRlZCBvbiBMaW51eCwgc28gd2UgaGF2ZSBhIGZhbGxiYWNrLlxuICAgIGlmIChzeXN0ZW1QcmVmZXJlbmNlcy5nZXRNZWRpYUFjY2Vzc1N0YXR1cykge1xuICAgICAgZ2V0TWVkaWFBY2Nlc3NTdGF0dXMgPVxuICAgICAgICBzeXN0ZW1QcmVmZXJlbmNlcy5nZXRNZWRpYUFjY2Vzc1N0YXR1cy5iaW5kKHN5c3RlbVByZWZlcmVuY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0TWVkaWFBY2Nlc3NTdGF0dXMgPSBub29wO1xuICAgIH1cbiAgICBsb2dnZXIuaW5mbyhcbiAgICAgICdtZWRpYSBhY2Nlc3Mgc3RhdHVzJyxcbiAgICAgIGdldE1lZGlhQWNjZXNzU3RhdHVzKCdtaWNyb3Bob25lJyksXG4gICAgICBnZXRNZWRpYUFjY2Vzc1N0YXR1cygnY2FtZXJhJylcbiAgICApO1xuICB9XG5cbiAgR2xvYmFsRXJyb3JzLnVwZGF0ZUxvY2FsZShsb2NhbGUubWVzc2FnZXMpO1xuXG4gIC8vIElmIHRoZSBzcWwgaW5pdGlhbGl6YXRpb24gdGFrZXMgbW9yZSB0aGFuIHRocmVlIHNlY29uZHMgdG8gY29tcGxldGUsIHdlXG4gIC8vIHdhbnQgdG8gbm90aWZ5IHRoZSB1c2VyIHRoYXQgdGhpbmdzIGFyZSBoYXBwZW5pbmdcbiAgY29uc3QgdGltZW91dCA9IG5ldyBQcm9taXNlKHJlc29sdmVGbiA9PlxuICAgIHNldFRpbWVvdXQocmVzb2x2ZUZuLCAzMDAwLCAndGltZW91dCcpXG4gICk7XG5cbiAgLy8gVGhpcyBjb2xvciBpcyB0byBiZSB1c2VkIG9ubHkgaW4gbG9hZGluZyBzY3JlZW4gYW5kIGluIHRoaXMgY2FzZSB3ZSBzaG91bGRcbiAgLy8gbmV2ZXIgd2FpdCBmb3IgdGhlIGRhdGFiYXNlIHRvIGJlIGluaXRpYWxpemVkLiBUaHVzIHRoZSB0aGVtZSBzZXR0aW5nXG4gIC8vIGxvb2t1cCBzaG91bGQgYmUgZG9uZSBvbmx5IGluIGVwaGVtZXJhbCBjb25maWcuXG4gIGNvbnN0IGJhY2tncm91bmRDb2xvciA9IGF3YWl0IGdldEJhY2tncm91bmRDb2xvcih7IGVwaGVtZXJhbE9ubHk6IHRydWUgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1vcmUvbm8tdGhlblxuICBQcm9taXNlLnJhY2UoW3NxbEluaXRQcm9taXNlLCB0aW1lb3V0XSkudGhlbihhc3luYyBtYXliZVRpbWVvdXQgPT4ge1xuICAgIGlmIChtYXliZVRpbWVvdXQgIT09ICd0aW1lb3V0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdldExvZ2dlcigpLmluZm8oXG4gICAgICAnc3FsLmluaXRpYWxpemUgaXMgdGFraW5nIG1vcmUgdGhhbiB0aHJlZSBzZWNvbmRzOyBzaG93aW5nIGxvYWRpbmcgZGlhbG9nJ1xuICAgICk7XG5cbiAgICBsb2FkaW5nV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAyNjUsXG4gICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdFdlYlByZWZzLFxuICAgICAgICBub2RlSW50ZWdyYXRpb246IGZhbHNlLFxuICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uL3RzL3dpbmRvd3MvbG9hZGluZy9wcmVsb2FkLmpzJyksXG4gICAgICB9LFxuICAgICAgaWNvbjogd2luZG93SWNvbixcbiAgICB9KTtcblxuICAgIGxvYWRpbmdXaW5kb3cub25jZSgncmVhZHktdG8tc2hvdycsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghbG9hZGluZ1dpbmRvdykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2FkaW5nV2luZG93LnNob3coKTtcbiAgICAgIC8vIFdhaXQgZm9yIHNxbCBpbml0aWFsaXphdGlvbiB0byBjb21wbGV0ZSwgYnV0IGlnbm9yZSBlcnJvcnNcbiAgICAgIGF3YWl0IHNxbEluaXRQcm9taXNlO1xuICAgICAgbG9hZGluZ1dpbmRvdy5kZXN0cm95KCk7XG4gICAgICBsb2FkaW5nV2luZG93ID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuXG4gICAgbG9hZGluZ1dpbmRvdy5sb2FkVVJMKGF3YWl0IHByZXBhcmVGaWxlVXJsKFtfX2Rpcm5hbWUsICcuLi9sb2FkaW5nLmh0bWwnXSkpO1xuICB9KTtcblxuICB0cnkge1xuICAgIGF3YWl0IGF0dGFjaG1lbnRzLmNsZWFyVGVtcFBhdGgodXNlckRhdGFQYXRoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ21haW4vcmVhZHk6IEVycm9yIGRlbGV0aW5nIHRlbXAgZGlyOicsXG4gICAgICBlcnIgJiYgZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyXG4gICAgKTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgSVBDIGNoYW5uZWxzIGJlZm9yZSBjcmVhdGluZyB0aGUgd2luZG93XG5cbiAgYXR0YWNobWVudENoYW5uZWwuaW5pdGlhbGl6ZSh7XG4gICAgY29uZmlnRGlyOiB1c2VyRGF0YVBhdGgsXG4gICAgY2xlYW51cE9ycGhhbmVkQXR0YWNobWVudHMsXG4gIH0pO1xuICBzcWxDaGFubmVscy5pbml0aWFsaXplKHNxbCk7XG4gIFBvd2VyQ2hhbm5lbC5pbml0aWFsaXplKHtcbiAgICBzZW5kKGV2ZW50KSB7XG4gICAgICBpZiAoIW1haW5XaW5kb3cpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKGV2ZW50KTtcbiAgICB9LFxuICB9KTtcblxuICAvLyBSdW4gd2luZG93IHByZWxvYWRpbmcgaW4gcGFyYWxsZWwgd2l0aCBkYXRhYmFzZSBpbml0aWFsaXphdGlvbi5cbiAgYXdhaXQgY3JlYXRlV2luZG93KCk7XG5cbiAgY29uc3QgeyBlcnJvcjogc3FsRXJyb3IgfSA9IGF3YWl0IHNxbEluaXRQcm9taXNlO1xuICBpZiAoc3FsRXJyb3IpIHtcbiAgICBnZXRMb2dnZXIoKS5lcnJvcignc3FsLmluaXRpYWxpemUgd2FzIHVuc3VjY2Vzc2Z1bDsgcmV0dXJuaW5nIGVhcmx5Jyk7XG5cbiAgICBhd2FpdCBvbkRhdGFiYXNlRXJyb3Ioc3FsRXJyb3Iuc3RhY2sgfHwgc3FsRXJyb3IubWVzc2FnZSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBhcHBTdGFydEluaXRpYWxTcGVsbGNoZWNrU2V0dGluZyA9IGF3YWl0IGdldFNwZWxsQ2hlY2tTZXR0aW5nKCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBJREJfS0VZID0gJ2luZGV4ZWRkYi1kZWxldGUtbmVlZGVkJztcbiAgICBjb25zdCBpdGVtID0gYXdhaXQgc3FsLnNxbENhbGwoJ2dldEl0ZW1CeUlkJywgW0lEQl9LRVldKTtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLnZhbHVlKSB7XG4gICAgICBhd2FpdCBzcWwuc3FsQ2FsbCgncmVtb3ZlSW5kZXhlZERCRmlsZXMnLCBbXSk7XG4gICAgICBhd2FpdCBzcWwuc3FsQ2FsbCgncmVtb3ZlSXRlbUJ5SWQnLCBbSURCX0tFWV0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXG4gICAgICAnKHJlYWR5IGV2ZW50IGhhbmRsZXIpIGVycm9yIGRlbGV0aW5nIEluZGV4ZWREQjonLFxuICAgICAgZXJyICYmIGVyci5zdGFjayA/IGVyci5zdGFjayA6IGVyclxuICAgICk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBjbGVhbnVwT3JwaGFuZWRBdHRhY2htZW50cygpIHtcbiAgICBjb25zdCBhbGxBdHRhY2htZW50cyA9IGF3YWl0IGF0dGFjaG1lbnRzLmdldEFsbEF0dGFjaG1lbnRzKHVzZXJEYXRhUGF0aCk7XG4gICAgY29uc3Qgb3JwaGFuZWRBdHRhY2htZW50cyA9IGF3YWl0IHNxbC5zcWxDYWxsKCdyZW1vdmVLbm93bkF0dGFjaG1lbnRzJywgW1xuICAgICAgYWxsQXR0YWNobWVudHMsXG4gICAgXSk7XG4gICAgYXdhaXQgYXR0YWNobWVudHMuZGVsZXRlQWxsKHtcbiAgICAgIHVzZXJEYXRhUGF0aCxcbiAgICAgIGF0dGFjaG1lbnRzOiBvcnBoYW5lZEF0dGFjaG1lbnRzLFxuICAgIH0pO1xuXG4gICAgYXdhaXQgYXR0YWNobWVudHMuZGVsZXRlQWxsQmFkZ2VzKHtcbiAgICAgIHVzZXJEYXRhUGF0aCxcbiAgICAgIHBhdGhzVG9LZWVwOiBhd2FpdCBzcWwuc3FsQ2FsbCgnZ2V0QWxsQmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGhzJywgW10pLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxsU3RpY2tlcnMgPSBhd2FpdCBhdHRhY2htZW50cy5nZXRBbGxTdGlja2Vycyh1c2VyRGF0YVBhdGgpO1xuICAgIGNvbnN0IG9ycGhhbmVkU3RpY2tlcnMgPSBhd2FpdCBzcWwuc3FsQ2FsbCgncmVtb3ZlS25vd25TdGlja2VycycsIFtcbiAgICAgIGFsbFN0aWNrZXJzLFxuICAgIF0pO1xuICAgIGF3YWl0IGF0dGFjaG1lbnRzLmRlbGV0ZUFsbFN0aWNrZXJzKHtcbiAgICAgIHVzZXJEYXRhUGF0aCxcbiAgICAgIHN0aWNrZXJzOiBvcnBoYW5lZFN0aWNrZXJzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxsRHJhZnRBdHRhY2htZW50cyA9IGF3YWl0IGF0dGFjaG1lbnRzLmdldEFsbERyYWZ0QXR0YWNobWVudHMoXG4gICAgICB1c2VyRGF0YVBhdGhcbiAgICApO1xuICAgIGNvbnN0IG9ycGhhbmVkRHJhZnRBdHRhY2htZW50cyA9IGF3YWl0IHNxbC5zcWxDYWxsKFxuICAgICAgJ3JlbW92ZUtub3duRHJhZnRBdHRhY2htZW50cycsXG4gICAgICBbYWxsRHJhZnRBdHRhY2htZW50c11cbiAgICApO1xuICAgIGF3YWl0IGF0dGFjaG1lbnRzLmRlbGV0ZUFsbERyYWZ0QXR0YWNobWVudHMoe1xuICAgICAgdXNlckRhdGFQYXRoLFxuICAgICAgYXR0YWNobWVudHM6IG9ycGhhbmVkRHJhZnRBdHRhY2htZW50cyxcbiAgICB9KTtcbiAgfVxuXG4gIHJlYWR5ID0gdHJ1ZTtcblxuICBzZXR1cE1lbnUoKTtcblxuICBzeXN0ZW1UcmF5U2VydmljZSA9IG5ldyBTeXN0ZW1UcmF5U2VydmljZSh7IG1lc3NhZ2VzOiBsb2NhbGUubWVzc2FnZXMgfSk7XG4gIHN5c3RlbVRyYXlTZXJ2aWNlLnNldE1haW5XaW5kb3cobWFpbldpbmRvdyk7XG4gIHN5c3RlbVRyYXlTZXJ2aWNlLnNldEVuYWJsZWQoXG4gICAgc2hvdWxkTWluaW1pemVUb1N5c3RlbVRyYXkoYXdhaXQgc3lzdGVtVHJheVNldHRpbmdDYWNoZS5nZXQoKSlcbiAgKTtcblxuICBlbnN1cmVGaWxlUGVybWlzc2lvbnMoW1xuICAgICdjb25maWcuanNvbicsXG4gICAgJ3NxbC9kYi5zcWxpdGUnLFxuICAgICdzcWwvZGIuc3FsaXRlLXdhbCcsXG4gICAgJ3NxbC9kYi5zcWxpdGUtc2htJyxcbiAgXSk7XG59KTtcblxuZnVuY3Rpb24gc2V0dXBNZW51KG9wdGlvbnM/OiBQYXJ0aWFsPENyZWF0ZVRlbXBsYXRlT3B0aW9uc1R5cGU+KSB7XG4gIGNvbnN0IHsgcGxhdGZvcm0gfSA9IHByb2Nlc3M7XG4gIG1lbnVPcHRpb25zID0ge1xuICAgIC8vIG9wdGlvbnNcbiAgICBkZXZlbG9wbWVudCxcbiAgICBkZXZUb29sczogZGVmYXVsdFdlYlByZWZzLmRldlRvb2xzLFxuICAgIGluY2x1ZGVTZXR1cDogZmFsc2UsXG4gICAgaXNQcm9kdWN0aW9uOiBpc1Byb2R1Y3Rpb24oYXBwLmdldFZlcnNpb24oKSksXG4gICAgcGxhdGZvcm0sXG5cbiAgICAvLyBhY3Rpb25zXG4gICAgZm9yY2VVcGRhdGUsXG4gICAgb3BlbkNvbnRhY3RVcyxcbiAgICBvcGVuRm9ydW1zLFxuICAgIG9wZW5Kb2luVGhlQmV0YSxcbiAgICBvcGVuUmVsZWFzZU5vdGVzLFxuICAgIG9wZW5TdXBwb3J0UGFnZSxcbiAgICBzZXR1cEFzTmV3RGV2aWNlLFxuICAgIHNldHVwQXNTdGFuZGFsb25lLFxuICAgIHNob3dBYm91dCxcbiAgICBzaG93RGVidWdMb2c6IHNob3dEZWJ1Z0xvZ1dpbmRvdyxcbiAgICBzaG93S2V5Ym9hcmRTaG9ydGN1dHMsXG4gICAgc2hvd1NldHRpbmdzOiBzaG93U2V0dGluZ3NXaW5kb3csXG4gICAgc2hvd1N0aWNrZXJDcmVhdG9yLFxuICAgIHNob3dXaW5kb3csXG5cbiAgICAvLyBvdmVycmlkZXNcbiAgICAuLi5vcHRpb25zLFxuICB9O1xuICBjb25zdCB0ZW1wbGF0ZSA9IGNyZWF0ZVRlbXBsYXRlKG1lbnVPcHRpb25zLCBnZXRMb2NhbGUoKS5tZXNzYWdlcyk7XG4gIGNvbnN0IG1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSk7XG5cbiAgbWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZCgnd2luZG93OnNldC1tZW51LW9wdGlvbnMnLCB7XG4gICAgZGV2ZWxvcG1lbnQ6IG1lbnVPcHRpb25zLmRldmVsb3BtZW50LFxuICAgIGRldlRvb2xzOiBtZW51T3B0aW9ucy5kZXZUb29scyxcbiAgICBpbmNsdWRlU2V0dXA6IG1lbnVPcHRpb25zLmluY2x1ZGVTZXR1cCxcbiAgICBpc1Byb2R1Y3Rpb246IG1lbnVPcHRpb25zLmlzUHJvZHVjdGlvbixcbiAgICBwbGF0Zm9ybTogbWVudU9wdGlvbnMucGxhdGZvcm0sXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0U2h1dGRvd24oKSB7XG4gIGlmICghbWFpbldpbmRvdyB8fCAhbWFpbldpbmRvdy53ZWJDb250ZW50cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGdldExvZ2dlcigpLmluZm8oJ3JlcXVlc3RTaHV0ZG93bjogUmVxdWVzdGluZyBjbG9zZSBvZiBtYWluV2luZG93Li4uJyk7XG4gIGNvbnN0IHJlcXVlc3QgPSBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlRm4gPT4ge1xuICAgIGxldCB0aW1lb3V0OiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZDtcblxuICAgIGlmICghbWFpbldpbmRvdykge1xuICAgICAgcmVzb2x2ZUZuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXBjLm9uY2UoJ25vdy1yZWFkeS1mb3Itc2h1dGRvd24nLCAoX2V2ZW50LCBlcnJvcikgPT4ge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygncmVxdWVzdFNodXRkb3duOiBSZXNwb25zZSByZWNlaXZlZCcpO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXG4gICAgICAgICAgJ3JlcXVlc3RTaHV0ZG93bjogZ290IGVycm9yLCBzdGlsbCBzaHV0dGluZyBkb3duLicsXG4gICAgICAgICAgZXJyb3JcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRpbWVvdXQpO1xuXG4gICAgICByZXNvbHZlRm4oKTtcbiAgICB9KTtcblxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2V0LXJlYWR5LWZvci1zaHV0ZG93bicpO1xuXG4gICAgLy8gV2UnbGwgd2FpdCB0d28gbWludXRlcywgdGhlbiBmb3JjZSB0aGUgYXBwIHRvIGdvIGRvd24uIFRoaXMgY2FuIGhhcHBlbiBpZiBzb21lb25lXG4gICAgLy8gICBleGl0cyB0aGUgYXBwIGJlZm9yZSB3ZSd2ZSBzZXQgZXZlcnl0aGluZyB1cCBpbiBwcmVsb2FkKCkgKHNvIHRoZSBicm93c2VyIGlzbid0XG4gICAgLy8gICB5ZXQgbGlzdGVuaW5nIGZvciB0aGVzZSBldmVudHMpLCBvciBpZiB0aGVyZSBhcmUgYSB3aG9sZSBsb3Qgb2Ygc3RhY2tlZC11cCB0YXNrcy5cbiAgICAvLyBOb3RlOiB0d28gbWludXRlcyBpcyBhbHNvIG91ciB0aW1lb3V0IGZvciBTUUwgdGFza3MgaW4gZGF0YS5qcyBpbiB0aGUgYnJvd3Nlci5cbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBnZXRMb2dnZXIoKS5lcnJvcihcbiAgICAgICAgJ3JlcXVlc3RTaHV0ZG93bjogUmVzcG9uc2UgbmV2ZXIgcmVjZWl2ZWQ7IGZvcmNpbmcgc2h1dGRvd24uJ1xuICAgICAgKTtcbiAgICAgIHJlc29sdmVGbigpO1xuICAgIH0sIDIgKiA2MCAqIDEwMDApO1xuICB9KTtcblxuICB0cnkge1xuICAgIGF3YWl0IHJlcXVlc3Q7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXG4gICAgICAncmVxdWVzdFNodXRkb3duIGVycm9yOicsXG4gICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICApO1xuICB9XG59XG5cbmFwcC5vbignYmVmb3JlLXF1aXQnLCAoKSA9PiB7XG4gIGdldExvZ2dlcigpLmluZm8oJ2JlZm9yZS1xdWl0IGV2ZW50Jywge1xuICAgIHJlYWR5Rm9yU2h1dGRvd246IHdpbmRvd1N0YXRlLnJlYWR5Rm9yU2h1dGRvd24oKSxcbiAgICBzaG91bGRRdWl0OiB3aW5kb3dTdGF0ZS5zaG91bGRRdWl0KCksXG4gIH0pO1xuXG4gIHN5c3RlbVRyYXlTZXJ2aWNlPy5tYXJrU2hvdWxkUXVpdCgpO1xuICB3aW5kb3dTdGF0ZS5tYXJrU2hvdWxkUXVpdCgpO1xuXG4gIGlmIChtYWluV2luZG93KSB7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdxdWl0Jyk7XG4gIH1cbn0pO1xuXG4vLyBRdWl0IHdoZW4gYWxsIHdpbmRvd3MgYXJlIGNsb3NlZC5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIGdldExvZ2dlcigpLmluZm8oJ21haW4gcHJvY2VzcyBoYW5kbGluZyB3aW5kb3ctYWxsLWNsb3NlZCcpO1xuICAvLyBPbiBPUyBYIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICBjb25zdCBzaG91bGRBdXRvQ2xvc2UgPSAhT1MuaXNNYWNPUygpIHx8IGlzVGVzdEVudmlyb25tZW50KGdldEVudmlyb25tZW50KCkpO1xuXG4gIC8vIE9ubHkgYXV0b21hdGljYWxseSBxdWl0IGlmIHRoZSBtYWluIHdpbmRvdyBoYXMgYmVlbiBjcmVhdGVkXG4gIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYHdpbmRvdy1hbGwtY2xvc2VkYCBjYW4gYmUgdHJpZ2dlcmVkIGJ5IHRoZVxuICAvLyBcIm9wdGltaXppbmcgYXBwbGljYXRpb25cIiB3aW5kb3cgY2xvc2luZ1xuICBpZiAoc2hvdWxkQXV0b0Nsb3NlICYmIG1haW5XaW5kb3dDcmVhdGVkKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gIGlmICghcmVhZHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBPbiBPUyBYIGl0J3MgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4gIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxuICBpZiAobWFpbldpbmRvdykge1xuICAgIG1haW5XaW5kb3cuc2hvdygpO1xuICB9IGVsc2Uge1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG59KTtcblxuLy8gRGVmZW5zZSBpbiBkZXB0aC4gV2UgbmV2ZXIgaW50ZW5kIHRvIG9wZW4gd2Vidmlld3Mgb3Igd2luZG93cy4gUHJldmVudCBpdCBjb21wbGV0ZWx5LlxuYXBwLm9uKFxuICAnd2ViLWNvbnRlbnRzLWNyZWF0ZWQnLFxuICAoX2NyZWF0ZUV2ZW50OiBFbGVjdHJvbi5FdmVudCwgY29udGVudHM6IEVsZWN0cm9uLldlYkNvbnRlbnRzKSA9PiB7XG4gICAgY29udGVudHMub24oJ3dpbGwtYXR0YWNoLXdlYnZpZXcnLCBhdHRhY2hFdmVudCA9PiB7XG4gICAgICBhdHRhY2hFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuICAgIGNvbnRlbnRzLm9uKCduZXctd2luZG93JywgbmV3RXZlbnQgPT4ge1xuICAgICAgbmV3RXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgfVxuKTtcblxuYXBwLnNldEFzRGVmYXVsdFByb3RvY29sQ2xpZW50KCdzZ25sJyk7XG5hcHAuc2V0QXNEZWZhdWx0UHJvdG9jb2xDbGllbnQoJ3NpZ25hbGNhcHRjaGEnKTtcblxuYXBwLm9uKCd3aWxsLWZpbmlzaC1sYXVuY2hpbmcnLCAoKSA9PiB7XG4gIC8vIG9wZW4tdXJsIG11c3QgYmUgc2V0IGZyb20gd2l0aGluIHdpbGwtZmluaXNoLWxhdW5jaGluZyBmb3IgbWFjT1NcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQzOTQ5MjkxXG4gIGFwcC5vbignb3Blbi11cmwnLCAoZXZlbnQsIGluY29taW5nSHJlZikgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoaXNDYXB0Y2hhSHJlZihpbmNvbWluZ0hyZWYsIGdldExvZ2dlcigpKSkge1xuICAgICAgY29uc3QgeyBjYXB0Y2hhIH0gPSBwYXJzZUNhcHRjaGFIcmVmKGluY29taW5nSHJlZiwgZ2V0TG9nZ2VyKCkpO1xuICAgICAgY2hhbGxlbmdlSGFuZGxlci5oYW5kbGVDYXB0Y2hhKGNhcHRjaGEpO1xuXG4gICAgICAvLyBTaG93IHdpbmRvdyBhZnRlciBoYW5kbGluZyBjYXB0Y2hhXG4gICAgICBzaG93V2luZG93KCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBoYW5kbGVTZ25sSHJlZihpbmNvbWluZ0hyZWYpO1xuICB9KTtcbn0pO1xuXG5pcGMub24oJ3NldC1iYWRnZS1jb3VudCcsIChfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBjb3VudDogbnVtYmVyKSA9PiB7XG4gIGFwcC5iYWRnZUNvdW50ID0gY291bnQ7XG59KTtcblxuaXBjLm9uKCdyZW1vdmUtc2V0dXAtbWVudS1pdGVtcycsICgpID0+IHtcbiAgc2V0dXBNZW51KCk7XG59KTtcblxuaXBjLm9uKCdhZGQtc2V0dXAtbWVudS1pdGVtcycsICgpID0+IHtcbiAgc2V0dXBNZW51KHtcbiAgICBpbmNsdWRlU2V0dXA6IHRydWUsXG4gIH0pO1xufSk7XG5cbmlwYy5vbignZHJhdy1hdHRlbnRpb24nLCAoKSA9PiB7XG4gIGlmICghbWFpbldpbmRvdykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChPUy5pc1dpbmRvd3MoKSB8fCBPUy5pc0xpbnV4KCkpIHtcbiAgICBtYWluV2luZG93LmZsYXNoRnJhbWUodHJ1ZSk7XG4gIH1cbn0pO1xuXG5pcGMub24oJ3Jlc3RhcnQnLCAoKSA9PiB7XG4gIGdldExvZ2dlcigpLmluZm8oJ1JlbGF1bmNoaW5nIGFwcGxpY2F0aW9uJyk7XG4gIGFwcC5yZWxhdW5jaCgpO1xuICBhcHAucXVpdCgpO1xufSk7XG5pcGMub24oJ3NodXRkb3duJywgKCkgPT4ge1xuICBhcHAucXVpdCgpO1xufSk7XG5cbmlwYy5vbihcbiAgJ3NldC1hdXRvLWhpZGUtbWVudS1iYXInLFxuICAoX2V2ZW50OiBFbGVjdHJvbi5FdmVudCwgYXV0b0hpZGU6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAobWFpbldpbmRvdykge1xuICAgICAgbWFpbldpbmRvdy5hdXRvSGlkZU1lbnVCYXIgPSBhdXRvSGlkZTtcbiAgICB9XG4gIH1cbik7XG5cbmlwYy5vbihcbiAgJ3NldC1tZW51LWJhci12aXNpYmlsaXR5JyxcbiAgKF9ldmVudDogRWxlY3Ryb24uRXZlbnQsIHZpc2liaWxpdHk6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAobWFpbldpbmRvdykge1xuICAgICAgbWFpbldpbmRvdy5zZXRNZW51QmFyVmlzaWJpbGl0eSh2aXNpYmlsaXR5KTtcbiAgICB9XG4gIH1cbik7XG5cbmlwYy5vbihcbiAgJ3VwZGF0ZS1zeXN0ZW0tdHJheS1zZXR0aW5nJyxcbiAgKF9ldmVudCwgcmF3U3lzdGVtVHJheVNldHRpbmcgLyogOiBSZWFkb25seTx1bmtub3duPiAqLykgPT4ge1xuICAgIGNvbnN0IHN5c3RlbVRyYXlTZXR0aW5nID0gcGFyc2VTeXN0ZW1UcmF5U2V0dGluZyhyYXdTeXN0ZW1UcmF5U2V0dGluZyk7XG4gICAgc3lzdGVtVHJheVNldHRpbmdDYWNoZS5zZXQoc3lzdGVtVHJheVNldHRpbmcpO1xuXG4gICAgaWYgKHN5c3RlbVRyYXlTZXJ2aWNlKSB7XG4gICAgICBjb25zdCBpc0VuYWJsZWQgPSBzaG91bGRNaW5pbWl6ZVRvU3lzdGVtVHJheShzeXN0ZW1UcmF5U2V0dGluZyk7XG4gICAgICBzeXN0ZW1UcmF5U2VydmljZS5zZXRFbmFibGVkKGlzRW5hYmxlZCk7XG4gICAgfVxuICB9XG4pO1xuXG5pcGMub24oJ2Nsb3NlLXNjcmVlbi1zaGFyZS1jb250cm9sbGVyJywgKCkgPT4ge1xuICBpZiAoc2NyZWVuU2hhcmVXaW5kb3cpIHtcbiAgICBzY3JlZW5TaGFyZVdpbmRvdy5jbG9zZSgpO1xuICB9XG59KTtcblxuaXBjLm9uKCdzdG9wLXNjcmVlbi1zaGFyZScsICgpID0+IHtcbiAgaWYgKG1haW5XaW5kb3cpIHtcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3N0b3Atc2NyZWVuLXNoYXJlJyk7XG4gIH1cbn0pO1xuXG5pcGMub24oJ3Nob3ctc2NyZWVuLXNoYXJlJywgKF9ldmVudDogRWxlY3Ryb24uRXZlbnQsIHNvdXJjZU5hbWU6IHN0cmluZykgPT4ge1xuICBzaG93U2NyZWVuU2hhcmVXaW5kb3coc291cmNlTmFtZSk7XG59KTtcblxuaXBjLm9uKCd1cGRhdGUtdHJheS1pY29uJywgKF9ldmVudDogRWxlY3Ryb24uRXZlbnQsIHVucmVhZENvdW50OiBudW1iZXIpID0+IHtcbiAgaWYgKHN5c3RlbVRyYXlTZXJ2aWNlKSB7XG4gICAgc3lzdGVtVHJheVNlcnZpY2Uuc2V0VW5yZWFkQ291bnQodW5yZWFkQ291bnQpO1xuICB9XG59KTtcblxuLy8gRGVidWcgTG9nLXJlbGF0ZWQgSVBDIGNhbGxzXG5cbmlwYy5vbignc2hvdy1kZWJ1Zy1sb2cnLCBzaG93RGVidWdMb2dXaW5kb3cpO1xuaXBjLm9uKFxuICAnc2hvdy1kZWJ1Zy1sb2ctc2F2ZS1kaWFsb2cnLFxuICBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5FdmVudCwgbG9nVGV4dDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBmaWxlUGF0aCB9ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICAgIGRlZmF1bHRQYXRoOiAnZGVidWdsb2cudHh0JyxcbiAgICB9KTtcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGF3YWl0IHdyaXRlRmlsZShmaWxlUGF0aCwgbG9nVGV4dCk7XG4gICAgfVxuICB9XG4pO1xuXG4vLyBQZXJtaXNzaW9ucyBQb3B1cC1yZWxhdGVkIElQQyBjYWxsc1xuXG5pcGMuaGFuZGxlKFxuICAnc2hvdy1wZXJtaXNzaW9ucy1wb3B1cCcsXG4gIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBmb3JDYWxsaW5nOiBib29sZWFuLCBmb3JDYW1lcmE6IGJvb2xlYW4pID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2hvd1Blcm1pc3Npb25zUG9wdXBXaW5kb3coZm9yQ2FsbGluZywgZm9yQ2FtZXJhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXG4gICAgICAgICdzaG93LXBlcm1pc3Npb25zLXBvcHVwIGVycm9yOicsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG4gIH1cbik7XG5cbi8vIFNldHRpbmdzLXJlbGF0ZWQgSVBDIGNhbGxzXG5cbmZ1bmN0aW9uIGFkZERhcmtPdmVybGF5KCkge1xuICBpZiAobWFpbldpbmRvdyAmJiBtYWluV2luZG93LndlYkNvbnRlbnRzKSB7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhZGQtZGFyay1vdmVybGF5Jyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZURhcmtPdmVybGF5KCkge1xuICBpZiAobWFpbldpbmRvdyAmJiBtYWluV2luZG93LndlYkNvbnRlbnRzKSB7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdyZW1vdmUtZGFyay1vdmVybGF5Jyk7XG4gIH1cbn1cblxuaXBjLm9uKCdzaG93LXNldHRpbmdzJywgc2hvd1NldHRpbmdzV2luZG93KTtcblxuaXBjLm9uKCdkZWxldGUtYWxsLWRhdGEnLCAoKSA9PiB7XG4gIGlmIChzZXR0aW5nc1dpbmRvdykge1xuICAgIHNldHRpbmdzV2luZG93LmNsb3NlKCk7XG4gIH1cbiAgaWYgKG1haW5XaW5kb3cgJiYgbWFpbldpbmRvdy53ZWJDb250ZW50cykge1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZGVsZXRlLWFsbC1kYXRhJyk7XG4gIH1cbn0pO1xuXG5pcGMub24oJ2dldC1idWlsdC1pbi1pbWFnZXMnLCBhc3luYyAoKSA9PiB7XG4gIGlmICghbWFpbldpbmRvdykge1xuICAgIGdldExvZ2dlcigpLndhcm4oJ2lwYy9nZXQtYnVpbHQtaW4taW1hZ2VzOiBObyBtYWluV2luZG93IScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgaW1hZ2VzID0gYXdhaXQgYXR0YWNobWVudHMuZ2V0QnVpbHRJbkltYWdlcygpO1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZ2V0LXN1Y2Nlc3MtYnVpbHQtaW4taW1hZ2VzJywgbnVsbCwgaW1hZ2VzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAobWFpbldpbmRvdyAmJiBtYWluV2luZG93LndlYkNvbnRlbnRzKSB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2dldC1zdWNjZXNzLWJ1aWx0LWluLWltYWdlcycsIGVycm9yLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZXRMb2dnZXIoKS5lcnJvcignRXJyb3IgaGFuZGxpbmcgZ2V0LWJ1aWx0LWluLWltYWdlczonLCBlcnJvci5zdGFjayk7XG4gICAgfVxuICB9XG59KTtcblxuLy8gSW5nZXN0ZWQgaW4gcHJlbG9hZC5qcyB2aWEgYSBzZW5kU3luYyBjYWxsXG5pcGMub24oJ2xvY2FsZS1kYXRhJywgZXZlbnQgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBnZXRMb2NhbGUoKS5tZXNzYWdlcztcbn0pO1xuXG5pcGMub24oJ3VzZXItY29uZmlnLWtleScsIGV2ZW50ID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGV2ZW50LnJldHVyblZhbHVlID0gdXNlckNvbmZpZy5nZXQoJ2tleScpO1xufSk7XG5cbmlwYy5vbignZ2V0LXVzZXItZGF0YS1wYXRoJywgZXZlbnQgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZXZlbnQucmV0dXJuVmFsdWUgPSBhcHAuZ2V0UGF0aCgndXNlckRhdGEnKTtcbn0pO1xuXG4vLyBSZWZyZXNoIHRoZSBzZXR0aW5ncyB3aW5kb3cgd2hlbmV2ZXIgcHJlZmVyZW5jZXMgY2hhbmdlXG5pcGMub24oJ3ByZWZlcmVuY2VzLWNoYW5nZWQnLCAoKSA9PiB7XG4gIGZvciAoY29uc3Qgd2luZG93IG9mIGFjdGl2ZVdpbmRvd3MpIHtcbiAgICBpZiAod2luZG93LndlYkNvbnRlbnRzKSB7XG4gICAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgncHJlZmVyZW5jZXMtY2hhbmdlZCcpO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGdldEluY29taW5nSHJlZihhcmd2OiBBcnJheTxzdHJpbmc+KSB7XG4gIHJldHVybiBhcmd2LmZpbmQoYXJnID0+IGlzU2dubEhyZWYoYXJnLCBnZXRMb2dnZXIoKSkpO1xufVxuXG5mdW5jdGlvbiBnZXRJbmNvbWluZ0NhcHRjaGFIcmVmKGFyZ3Y6IEFycmF5PHN0cmluZz4pIHtcbiAgcmV0dXJuIGFyZ3YuZmluZChhcmcgPT4gaXNDYXB0Y2hhSHJlZihhcmcsIGdldExvZ2dlcigpKSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNnbmxIcmVmKGluY29taW5nSHJlZjogc3RyaW5nKSB7XG4gIGxldCBjb21tYW5kO1xuICBsZXQgYXJncztcbiAgbGV0IGhhc2g7XG5cbiAgaWYgKGlzU2dubEhyZWYoaW5jb21pbmdIcmVmLCBnZXRMb2dnZXIoKSkpIHtcbiAgICAoeyBjb21tYW5kLCBhcmdzLCBoYXNoIH0gPSBwYXJzZVNnbmxIcmVmKGluY29taW5nSHJlZiwgZ2V0TG9nZ2VyKCkpKTtcbiAgfSBlbHNlIGlmIChpc1NpZ25hbEh0dHBzTGluayhpbmNvbWluZ0hyZWYsIGdldExvZ2dlcigpKSkge1xuICAgICh7IGNvbW1hbmQsIGFyZ3MsIGhhc2ggfSA9IHBhcnNlU2lnbmFsSHR0cHNMaW5rKGluY29taW5nSHJlZiwgZ2V0TG9nZ2VyKCkpKTtcbiAgfVxuXG4gIGlmIChtYWluV2luZG93ICYmIG1haW5XaW5kb3cud2ViQ29udGVudHMpIHtcbiAgICBpZiAoY29tbWFuZCA9PT0gJ2FkZHN0aWNrZXJzJykge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygnT3BlbmluZyBzdGlja2VyIHBhY2sgZnJvbSBzZ25sIHByb3RvY29sIGxpbmsnKTtcbiAgICAgIGNvbnN0IHBhY2tJZCA9IGFyZ3M/LmdldCgncGFja19pZCcpO1xuICAgICAgY29uc3QgcGFja0tleUhleCA9IGFyZ3M/LmdldCgncGFja19rZXknKTtcbiAgICAgIGNvbnN0IHBhY2tLZXkgPSBwYWNrS2V5SGV4XG4gICAgICAgID8gQnVmZmVyLmZyb20ocGFja0tleUhleCwgJ2hleCcpLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICA6ICcnO1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdzaG93LXN0aWNrZXItcGFjaycsIHsgcGFja0lkLCBwYWNrS2V5IH0pO1xuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3NpZ25hbC5ncm91cCcgJiYgaGFzaCkge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygnU2hvd2luZyBncm91cCBmcm9tIHNnbmwgcHJvdG9jb2wgbGluaycpO1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdzaG93LWdyb3VwLXZpYS1saW5rJywgeyBoYXNoIH0pO1xuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3NpZ25hbC5tZScgJiYgaGFzaCkge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygnU2hvd2luZyBjb252ZXJzYXRpb24gZnJvbSBzZ25sIHByb3RvY29sIGxpbmsnKTtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnc2hvdy1jb252ZXJzYXRpb24tdmlhLXNpZ25hbC5tZScsIHsgaGFzaCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0TG9nZ2VyKCkuaW5mbygnU2hvd2luZyB3YXJuaW5nIHRoYXQgd2UgY2Fubm90IHByb2Nlc3MgbGluaycpO1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCd1bmtub3duLXNnbmwtbGluaycpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBnZXRMb2dnZXIoKS5lcnJvcignVW5oYW5kbGVkIHNnbmwgbGluaycpO1xuICB9XG59XG5cbmlwYy5vbignaW5zdGFsbC1zdGlja2VyLXBhY2snLCAoX2V2ZW50LCBwYWNrSWQsIHBhY2tLZXlIZXgpID0+IHtcbiAgY29uc3QgcGFja0tleSA9IEJ1ZmZlci5mcm9tKHBhY2tLZXlIZXgsICdoZXgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIGlmIChtYWluV2luZG93KSB7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdpbnN0YWxsLXN0aWNrZXItcGFjaycsIHsgcGFja0lkLCBwYWNrS2V5IH0pO1xuICB9XG59KTtcblxuaXBjLm9uKCdlbnN1cmUtZmlsZS1wZXJtaXNzaW9ucycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgYXdhaXQgZW5zdXJlRmlsZVBlcm1pc3Npb25zKCk7XG4gIGV2ZW50LnJlcGx5KCdlbnN1cmUtZmlsZS1wZXJtaXNzaW9ucy1kb25lJyk7XG59KTtcblxuLyoqXG4gKiBFbnN1cmUgZmlsZXMgaW4gdGhlIHVzZXIncyBkYXRhIGRpcmVjdG9yeSBoYXZlIHRoZSBwcm9wZXIgcGVybWlzc2lvbnMuXG4gKiBPcHRpb25hbGx5IHRha2VzIGFuIGFycmF5IG9mIGZpbGUgcGF0aHMgdG8gZXhjbHVzaXZlbHkgYWZmZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IFtvbmx5RmlsZXNdIC0gT25seSBlbnN1cmUgcGVybWlzc2lvbnMgb24gdGhlc2UgZ2l2ZW4gZmlsZXNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZW5zdXJlRmlsZVBlcm1pc3Npb25zKG9ubHlGaWxlcz86IEFycmF5PHN0cmluZz4pIHtcbiAgZ2V0TG9nZ2VyKCkuaW5mbygnQmVnaW4gZW5zdXJpbmcgcGVybWlzc2lvbnMnKTtcblxuICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gIGNvbnN0IHVzZXJEYXRhUGF0aCA9IGF3YWl0IHJlYWxwYXRoKGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpKTtcbiAgLy8gZmFzdC1nbG9iIHVzZXMgYC9gIGZvciBhbGwgcGxhdGZvcm1zXG4gIGNvbnN0IHVzZXJEYXRhR2xvYiA9IG5vcm1hbGl6ZVBhdGgoam9pbih1c2VyRGF0YVBhdGgsICcqKicsICcqJykpO1xuXG4gIC8vIERldGVybWluZSBmaWxlcyB0byB0b3VjaFxuICBjb25zdCBmaWxlcyA9IG9ubHlGaWxlc1xuICAgID8gb25seUZpbGVzLm1hcChmID0+IGpvaW4odXNlckRhdGFQYXRoLCBmKSlcbiAgICA6IGF3YWl0IGZhc3RHbG9iKHVzZXJEYXRhR2xvYiwge1xuICAgICAgICBtYXJrRGlyZWN0b3JpZXM6IHRydWUsXG4gICAgICAgIG9ubHlGaWxlczogZmFsc2UsXG4gICAgICAgIGlnbm9yZTogWycqKi9TaW5nbGV0b24qJ10sXG4gICAgICB9KTtcblxuICBnZXRMb2dnZXIoKS5pbmZvKGBFbnN1cmluZyBmaWxlIHBlcm1pc3Npb25zIGZvciAke2ZpbGVzLmxlbmd0aH0gZmlsZXNgKTtcblxuICAvLyBUb3VjaCBlYWNoIGZpbGUgaW4gYSBxdWV1ZVxuICBjb25zdCBxID0gbmV3IFBRdWV1ZSh7IGNvbmN1cnJlbmN5OiA1LCB0aW1lb3V0OiAxMDAwICogNjAgKiAyIH0pO1xuICBxLmFkZEFsbChcbiAgICBmaWxlcy5tYXAoZiA9PiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpc0RpciA9IGYuZW5kc1dpdGgoJy8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNobW9kKG5vcm1hbGl6ZShmKSwgaXNEaXIgPyAwbzcwMCA6IDBvNjAwKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGdldExvZ2dlcigpLmVycm9yKFxuICAgICAgICAgICdlbnN1cmVGaWxlUGVybWlzc2lvbnM6IEVycm9yIGZyb20gY2htb2QnLFxuICAgICAgICAgIGVycm9yLm1lc3NhZ2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIGF3YWl0IHEub25FbXB0eSgpO1xuXG4gIGdldExvZ2dlcigpLmluZm8oYEZpbmlzaCBlbnN1cmluZyBwZXJtaXNzaW9ucyBpbiAke0RhdGUubm93KCkgLSBzdGFydH1tc2ApO1xufVxuXG5pcGMuaGFuZGxlKCdnZXQtYXV0by1sYXVuY2gnLCBhc3luYyAoKSA9PiB7XG4gIHJldHVybiBhcHAuZ2V0TG9naW5JdGVtU2V0dGluZ3MoKS5vcGVuQXRMb2dpbjtcbn0pO1xuXG5pcGMuaGFuZGxlKCdzZXQtYXV0by1sYXVuY2gnLCBhc3luYyAoX2V2ZW50LCB2YWx1ZSkgPT4ge1xuICBhcHAuc2V0TG9naW5JdGVtU2V0dGluZ3MoeyBvcGVuQXRMb2dpbjogQm9vbGVhbih2YWx1ZSkgfSk7XG59KTtcblxuaXBjLm9uKCdzaG93LW1lc3NhZ2UtYm94JywgKF9ldmVudCwgeyB0eXBlLCBtZXNzYWdlIH0pID0+IHtcbiAgZGlhbG9nLnNob3dNZXNzYWdlQm94KHsgdHlwZSwgbWVzc2FnZSB9KTtcbn0pO1xuXG5pcGMub24oJ3Nob3ctaXRlbS1pbi1mb2xkZXInLCAoX2V2ZW50LCBmb2xkZXIpID0+IHtcbiAgc2hlbGwuc2hvd0l0ZW1JbkZvbGRlcihmb2xkZXIpO1xufSk7XG5cbmlwYy5oYW5kbGUoJ3Nob3ctc2F2ZS1kaWFsb2cnLCBhc3luYyAoX2V2ZW50LCB7IGRlZmF1bHRQYXRoIH0pID0+IHtcbiAgaWYgKCFtYWluV2luZG93KSB7XG4gICAgZ2V0TG9nZ2VyKCkud2Fybignc2hvdy1zYXZlLWRpYWxvZzogbm8gbWFpbiB3aW5kb3cnKTtcblxuICAgIHJldHVybiB7IGNhbmNlbGVkOiB0cnVlIH07XG4gIH1cblxuICByZXR1cm4gZGlhbG9nLnNob3dTYXZlRGlhbG9nKG1haW5XaW5kb3csIHtcbiAgICBkZWZhdWx0UGF0aCxcbiAgfSk7XG59KTtcblxuaXBjLmhhbmRsZSgnZ2V0U2NyZWVuQ2FwdHVyZVNvdXJjZXMnLCBhc3luYyAoKSA9PiB7XG4gIHJldHVybiBkZXNrdG9wQ2FwdHVyZXIuZ2V0U291cmNlcyh7XG4gICAgZmV0Y2hXaW5kb3dJY29uczogdHJ1ZSxcbiAgICB0aHVtYm5haWxTaXplOiB7IGhlaWdodDogMTAyLCB3aWR0aDogMTg0IH0sXG4gICAgdHlwZXM6IFsnd2luZG93JywgJ3NjcmVlbiddLFxuICB9KTtcbn0pO1xuXG5pcGMuaGFuZGxlKCdleGVjdXRlTWVudVJvbGUnLCBhc3luYyAoeyBzZW5kZXIgfSwgdW50eXBlZFJvbGUpID0+IHtcbiAgY29uc3Qgcm9sZSA9IHVudHlwZWRSb2xlIGFzIE1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zWydyb2xlJ107XG5cbiAgY29uc3Qgc2VuZGVyV2luZG93ID0gQnJvd3NlcldpbmRvdy5mcm9tV2ViQ29udGVudHMoc2VuZGVyKTtcblxuICBzd2l0Y2ggKHJvbGUpIHtcbiAgICBjYXNlICd1bmRvJzpcbiAgICAgIHNlbmRlci51bmRvKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZWRvJzpcbiAgICAgIHNlbmRlci5yZWRvKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjdXQnOlxuICAgICAgc2VuZGVyLmN1dCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29weSc6XG4gICAgICBzZW5kZXIuY29weSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncGFzdGUnOlxuICAgICAgc2VuZGVyLnBhc3RlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwYXN0ZUFuZE1hdGNoU3R5bGUnOlxuICAgICAgc2VuZGVyLnBhc3RlQW5kTWF0Y2hTdHlsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgIHNlbmRlci5kZWxldGUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NlbGVjdEFsbCc6XG4gICAgICBzZW5kZXIuc2VsZWN0QWxsKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgc2VuZGVyLnJlbG9hZCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndG9nZ2xlRGV2VG9vbHMnOlxuICAgICAgc2VuZGVyLnRvZ2dsZURldlRvb2xzKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Jlc2V0Wm9vbSc6XG4gICAgICBzZW5kZXIuc2V0Wm9vbUxldmVsKDApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnem9vbUluJzpcbiAgICAgIHNlbmRlci5zZXRab29tTGV2ZWwoc2VuZGVyLmdldFpvb21MZXZlbCgpICsgMSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd6b29tT3V0JzpcbiAgICAgIHNlbmRlci5zZXRab29tTGV2ZWwoc2VuZGVyLmdldFpvb21MZXZlbCgpIC0gMSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3RvZ2dsZWZ1bGxzY3JlZW4nOlxuICAgICAgc2VuZGVyV2luZG93Py5zZXRGdWxsU2NyZWVuKCFzZW5kZXJXaW5kb3c/LmlzRnVsbFNjcmVlbigpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21pbmltaXplJzpcbiAgICAgIHNlbmRlcldpbmRvdz8ubWluaW1pemUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgIHNlbmRlcldpbmRvdz8uY2xvc2UoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncXVpdCc6XG4gICAgICBhcHAucXVpdCgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgLy8gaWdub3JlZFxuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5pcGMuaGFuZGxlKCdnZXRNYWluV2luZG93U3RhdHMnLCBhc3luYyAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgaXNNYXhpbWl6ZWQ6IHdpbmRvd0NvbmZpZz8ubWF4aW1pemVkID8/IGZhbHNlLFxuICAgIGlzRnVsbFNjcmVlbjogd2luZG93Q29uZmlnPy5mdWxsc2NyZWVuID8/IGZhbHNlLFxuICB9O1xufSk7XG5cbmlwYy5oYW5kbGUoJ2dldE1lbnVPcHRpb25zJywgYXN5bmMgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGRldmVsb3BtZW50OiBtZW51T3B0aW9ucz8uZGV2ZWxvcG1lbnQgPz8gZmFsc2UsXG4gICAgZGV2VG9vbHM6IG1lbnVPcHRpb25zPy5kZXZUb29scyA/PyBmYWxzZSxcbiAgICBpbmNsdWRlU2V0dXA6IG1lbnVPcHRpb25zPy5pbmNsdWRlU2V0dXAgPz8gZmFsc2UsXG4gICAgaXNQcm9kdWN0aW9uOiBtZW51T3B0aW9ucz8uaXNQcm9kdWN0aW9uID8/IHRydWUsXG4gICAgcGxhdGZvcm06IG1lbnVPcHRpb25zPy5wbGF0Zm9ybSA/PyAndW5rbm93bicsXG4gIH07XG59KTtcblxuaXBjLmhhbmRsZSgnZXhlY3V0ZU1lbnVBY3Rpb24nLCBhc3luYyAoX2V2ZW50LCBhY3Rpb246IE1lbnVBY3Rpb25UeXBlKSA9PiB7XG4gIGlmIChhY3Rpb24gPT09ICdmb3JjZVVwZGF0ZScpIHtcbiAgICBmb3JjZVVwZGF0ZSgpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ29wZW5Db250YWN0VXMnKSB7XG4gICAgb3BlbkNvbnRhY3RVcygpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ29wZW5Gb3J1bXMnKSB7XG4gICAgb3BlbkZvcnVtcygpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ29wZW5Kb2luVGhlQmV0YScpIHtcbiAgICBvcGVuSm9pblRoZUJldGEoKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdvcGVuUmVsZWFzZU5vdGVzJykge1xuICAgIG9wZW5SZWxlYXNlTm90ZXMoKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdvcGVuU3VwcG9ydFBhZ2UnKSB7XG4gICAgb3BlblN1cHBvcnRQYWdlKCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnc2V0dXBBc05ld0RldmljZScpIHtcbiAgICBzZXR1cEFzTmV3RGV2aWNlKCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnc2V0dXBBc1N0YW5kYWxvbmUnKSB7XG4gICAgc2V0dXBBc1N0YW5kYWxvbmUoKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdzaG93QWJvdXQnKSB7XG4gICAgc2hvd0Fib3V0KCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnc2hvd0RlYnVnTG9nJykge1xuICAgIHNob3dEZWJ1Z0xvZ1dpbmRvdygpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3Nob3dLZXlib2FyZFNob3J0Y3V0cycpIHtcbiAgICBzaG93S2V5Ym9hcmRTaG9ydGN1dHMoKTtcbiAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdzaG93U2V0dGluZ3MnKSB7XG4gICAgc2hvd1NldHRpbmdzV2luZG93KCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnc2hvd1N0aWNrZXJDcmVhdG9yJykge1xuICAgIHNob3dTdGlja2VyQ3JlYXRvcigpO1xuICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3Nob3dXaW5kb3cnKSB7XG4gICAgc2hvd1dpbmRvdygpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoYWN0aW9uKTtcbiAgfVxufSk7XG5cbmlmIChpc1Rlc3RFbnZpcm9ubWVudChnZXRFbnZpcm9ubWVudCgpKSkge1xuICBpcGMuaGFuZGxlKCdjaTp0ZXN0LWVsZWN0cm9uOmRvbmUnLCBhc3luYyAoX2V2ZW50LCBpbmZvKSA9PiB7XG4gICAgaWYgKCFwcm9jZXNzLmVudi5URVNUX1FVSVRfT05fQ09NUExFVEUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShcbiAgICAgIGBjaTp0ZXN0LWVsZWN0cm9uOmRvbmU9JHtKU09OLnN0cmluZ2lmeShpbmZvKX1cXG5gLFxuICAgICAgKCkgPT4gYXBwLnF1aXQoKVxuICAgICk7XG4gIH0pO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1DQUFPO0FBRVAsa0JBQWdDO0FBQ2hDLGlCQUE4QjtBQUM5QixTQUFvQjtBQUNwQixzQkFBMkM7QUFDM0Msb0JBQTRC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
