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
var background_exports = {};
__export(background_exports, {
  cleanupSessionResets: () => cleanupSessionResets,
  isOverHourIntoPast: () => isOverHourIntoPast,
  startApp: () => startApp
});
module.exports = __toCommonJS(background_exports);
var import_electron = require("electron");
var import_lodash = require("lodash");
var import_redux = require("redux");
var import_react_dom = require("react-dom");
var import_react_redux = require("react-redux");
var import_MessageReceiver = __toESM(require("./textsecure/MessageReceiver"));
var import_Errors = require("./textsecure/Errors");
var import_TaskWithTimeout = __toESM(require("./textsecure/TaskWithTimeout"));
var Bytes = __toESM(require("./Bytes"));
var Timers = __toESM(require("./Timers"));
var indexedDb = __toESM(require("./indexeddb"));
var import_SocketStatus = require("./types/SocketStatus");
var import_Colors = require("./types/Colors");
var import_Util = require("./types/Util");
var import_challenge = require("./challenge");
var durations = __toESM(require("./util/durations"));
var import_explodePromise = require("./util/explodePromise");
var import_isWindowDragElement = require("./util/isWindowDragElement");
var import_assert = require("./util/assert");
var import_normalizeUuid = require("./util/normalizeUuid");
var import_iterables = require("./util/iterables");
var import_isNotNil = require("./util/isNotNil");
var import_setAppLoadingScreenMessage = require("./setAppLoadingScreenMessage");
var import_IdleDetector = require("./IdleDetector");
var import_expiringMessagesDeletion = require("./services/expiringMessagesDeletion");
var import_tapToViewMessagesDeletionService = require("./services/tapToViewMessagesDeletionService");
var import_storyLoader = require("./services/storyLoader");
var import_distributionListLoader = require("./services/distributionListLoader");
var import_senderCertificate = require("./services/senderCertificate");
var import_groupCredentialFetcher = require("./services/groupCredentialFetcher");
var KeyboardLayout = __toESM(require("./services/keyboardLayout"));
var import_routineProfileRefresh = require("./routineProfileRefresh");
var import_timestamp = require("./util/timestamp");
var import_isValidReactionEmoji = require("./reactions/isValidReactionEmoji");
var import_helpers = require("./messages/helpers");
var import_migrateMessageData = require("./messages/migrateMessageData");
var import_batcher = require("./util/batcher");
var import_updateConversationsWithUuidLookup = require("./updateConversationsWithUuidLookup");
var import_initializeAllJobQueues = require("./jobs/initializeAllJobQueues");
var import_removeStorageKeyJobQueue = require("./jobs/removeStorageKeyJobQueue");
var import_ourProfileKey = require("./services/ourProfileKey");
var import_notifications = require("./services/notifications");
var import_areWeASubscriber = require("./services/areWeASubscriber");
var import_startTimeTravelDetector = require("./util/startTimeTravelDetector");
var import_shouldRespondWithProfileKey = require("./util/shouldRespondWithProfileKey");
var import_LatestQueue = require("./util/LatestQueue");
var import_parseIntOrThrow = require("./util/parseIntOrThrow");
var import_getProfile = require("./util/getProfile");
var KeyChangeListener = __toESM(require("./textsecure/KeyChangeListener"));
var import_RotateSignedPreKeyListener = require("./textsecure/RotateSignedPreKeyListener");
var import_whatTypeOfConversation = require("./util/whatTypeOfConversation");
var import_BackOff = require("./util/BackOff");
var import_app = require("./state/ducks/app");
var import_badgeImageFileDownloader = require("./badges/badgeImageFileDownloader");
var import_message = require("./state/selectors/message");
var import_actions = require("./state/actions");
var import_Deletes = require("./messageModifiers/Deletes");
var import_MessageReceipts = require("./messageModifiers/MessageReceipts");
var import_MessageRequests = require("./messageModifiers/MessageRequests");
var import_Reactions = require("./messageModifiers/Reactions");
var import_ReadSyncs = require("./messageModifiers/ReadSyncs");
var import_ViewSyncs = require("./messageModifiers/ViewSyncs");
var import_ViewOnceOpenSyncs = require("./messageModifiers/ViewOnceOpenSyncs");
var import_MessageReadStatus = require("./messages/MessageReadStatus");
var import_MessageSendState = require("./messages/MessageSendState");
var AttachmentDownloads = __toESM(require("./messageModifiers/AttachmentDownloads"));
var Conversation = __toESM(require("./types/Conversation"));
var Stickers = __toESM(require("./types/Stickers"));
var Errors = __toESM(require("./types/errors"));
var import_protobuf = require("./protobuf");
var import_handleRetry = require("./util/handleRetry");
var import_themeChanged = require("./shims/themeChanged");
var import_createIPCEvents = require("./util/createIPCEvents");
var import_RemoveAllConfiguration = require("./types/RemoveAllConfiguration");
var import_UUID = require("./types/UUID");
var log = __toESM(require("./logging/log"));
var import_loadRecentEmojis = require("./util/loadRecentEmojis");
var import_deleteAllLogs = require("./util/deleteAllLogs");
var import_ReactWrapperView = require("./views/ReactWrapperView");
var import_ToastCaptchaFailed = require("./components/ToastCaptchaFailed");
var import_ToastCaptchaSolved = require("./components/ToastCaptchaSolved");
var import_ToastConversationArchived = require("./components/ToastConversationArchived");
var import_ToastConversationUnarchived = require("./components/ToastConversationUnarchived");
var import_showToast = require("./util/showToast");
var import_startInteractionMode = require("./windows/startInteractionMode");
var import_deliveryReceiptsJobQueue = require("./jobs/deliveryReceiptsJobQueue");
var import_updateOurUsernameAndPni = require("./util/updateOurUsernameAndPni");
var import_ReactionSource = require("./reactions/ReactionSource");
var import_singleProtoJobQueue = require("./jobs/singleProtoJobQueue");
var import_getInitialState = require("./state/getInitialState");
var import_conversationJobQueue = require("./jobs/conversationJobQueue");
var import_MessageSeenStatus = require("./MessageSeenStatus");
var import_SendMessage = __toESM(require("./textsecure/SendMessage"));
var import_onStoryRecipientUpdate = require("./util/onStoryRecipientUpdate");
var import_validateConversation = require("./util/validateConversation");
const MAX_ATTACHMENT_DOWNLOAD_AGE = 3600 * 72 * 1e3;
function isOverHourIntoPast(timestamp) {
  const HOUR = 1e3 * 60 * 60;
  return (0, import_lodash.isNumber)(timestamp) && (0, import_timestamp.isOlderThan)(timestamp, HOUR);
}
async function cleanupSessionResets() {
  const sessionResets = window.storage.get("sessionResets", {});
  const keys = Object.keys(sessionResets);
  keys.forEach((key) => {
    const timestamp = sessionResets[key];
    if (!timestamp || isOverHourIntoPast(timestamp)) {
      delete sessionResets[key];
    }
  });
  await window.storage.put("sessionResets", sessionResets);
}
async function startApp() {
  window.textsecure.storage.protocol = new window.SignalProtocolStore();
  if (window.initialTheme === import_Util.ThemeType.light) {
    document.body.classList.add("light-theme");
  }
  if (window.initialTheme === import_Util.ThemeType.dark) {
    document.body.classList.add("dark-theme");
  }
  const idleDetector = new import_IdleDetector.IdleDetector();
  await KeyboardLayout.initialize();
  window.Whisper.events = window._.clone(window.Backbone.Events);
  window.Signal.Util.MessageController.install();
  window.Signal.conversationControllerStart();
  window.startupProcessingQueue = new window.Signal.Util.StartupQueue();
  import_notifications.notificationService.initialize({
    i18n: window.i18n,
    storage: window.storage
  });
  window.attachmentDownloadQueue = [];
  await window.Signal.Util.initializeMessageCounter();
  let initialBadgesState = { byId: {} };
  async function loadInitialBadgesState() {
    initialBadgesState = {
      byId: window.Signal.Util.makeLookup(await window.Signal.Data.getAllBadges(), "id")
    };
  }
  let server;
  let messageReceiver;
  let challengeHandler;
  let routineProfileRefresher;
  window.storage.onready(() => {
    server = window.WebAPI.connect(window.textsecure.storage.user.getWebAPICredentials());
    window.textsecure.server = server;
    (0, import_initializeAllJobQueues.initializeAllJobQueues)({
      server
    });
    challengeHandler = new import_challenge.ChallengeHandler({
      storage: window.storage,
      startQueue(conversationId) {
        import_conversationJobQueue.conversationJobQueue.resolveVerificationWaiter(conversationId);
      },
      requestChallenge(request) {
        window.sendChallengeRequest(request);
      },
      async sendChallengeResponse(data) {
        const { messaging } = window.textsecure;
        if (!messaging) {
          throw new Error("sendChallengeResponse: messaging is not available!");
        }
        await messaging.sendChallengeResponse(data);
      },
      onChallengeFailed() {
        (0, import_showToast.showToast)(import_ToastCaptchaFailed.ToastCaptchaFailed);
      },
      onChallengeSolved() {
        (0, import_showToast.showToast)(import_ToastCaptchaSolved.ToastCaptchaSolved);
      },
      setChallengeStatus(challengeStatus) {
        window.reduxActions.network.setChallengeStatus(challengeStatus);
      }
    });
    window.Whisper.events.on("challengeResponse", (response) => {
      if (!challengeHandler) {
        throw new Error("Expected challenge handler to be there");
      }
      challengeHandler.onResponse(response);
    });
    window.Signal.challengeHandler = challengeHandler;
    log.info("Initializing MessageReceiver");
    messageReceiver = new import_MessageReceiver.default({
      server,
      storage: window.storage,
      serverTrustRoot: window.getServerTrustRoot()
    });
    function queuedEventListener(handler, track = true) {
      return (...args) => {
        eventHandlerQueue.add(async () => {
          try {
            await handler(...args);
          } finally {
            if (track) {
              window.Whisper.events.trigger("incrementProgress");
            }
          }
        });
      };
    }
    messageReceiver.addEventListener("envelope", queuedEventListener(onEnvelopeReceived, false));
    messageReceiver.addEventListener("message", queuedEventListener(onMessageReceived, false));
    messageReceiver.addEventListener("delivery", queuedEventListener(onDeliveryReceipt));
    messageReceiver.addEventListener("contact", queuedEventListener(onContactReceived, false));
    messageReceiver.addEventListener("contactSync", queuedEventListener(onContactSyncComplete));
    messageReceiver.addEventListener("group", queuedEventListener(onGroupReceived));
    messageReceiver.addEventListener("groupSync", queuedEventListener(onGroupSyncComplete));
    messageReceiver.addEventListener("sent", queuedEventListener(onSentMessage, false));
    messageReceiver.addEventListener("readSync", queuedEventListener(onReadSync));
    messageReceiver.addEventListener("viewSync", queuedEventListener(onViewSync));
    messageReceiver.addEventListener("read", queuedEventListener(onReadReceipt));
    messageReceiver.addEventListener("view", queuedEventListener(onViewReceipt));
    messageReceiver.addEventListener("error", queuedEventListener(onError, false));
    messageReceiver.addEventListener("decryption-error", queuedEventListener((event) => {
      onDecryptionErrorQueue.add(() => (0, import_handleRetry.onDecryptionError)(event));
    }));
    messageReceiver.addEventListener("retry-request", queuedEventListener((event) => {
      onRetryRequestQueue.add(() => (0, import_handleRetry.onRetryRequest)(event));
    }));
    messageReceiver.addEventListener("empty", queuedEventListener(onEmpty));
    messageReceiver.addEventListener("configuration", queuedEventListener(onConfiguration));
    messageReceiver.addEventListener("typing", queuedEventListener(onTyping));
    messageReceiver.addEventListener("sticker-pack", queuedEventListener(onStickerPack));
    messageReceiver.addEventListener("viewOnceOpenSync", queuedEventListener(onViewOnceOpenSync));
    messageReceiver.addEventListener("messageRequestResponse", queuedEventListener(onMessageRequestResponse));
    messageReceiver.addEventListener("profileKeyUpdate", queuedEventListener(onProfileKeyUpdate));
    messageReceiver.addEventListener("fetchLatest", queuedEventListener(onFetchLatestSync));
    messageReceiver.addEventListener("keys", queuedEventListener(onKeysSync));
    messageReceiver.addEventListener("storyRecipientUpdate", queuedEventListener(import_onStoryRecipientUpdate.onStoryRecipientUpdate, false));
  });
  import_ourProfileKey.ourProfileKeyService.initialize(window.storage);
  window.storage.onready(() => {
    if (!window.storage.get("defaultConversationColor")) {
      window.storage.put("defaultConversationColor", import_Colors.DEFAULT_CONVERSATION_COLOR);
    }
  });
  let resolveOnAppView;
  const onAppView = new Promise((resolve) => {
    resolveOnAppView = resolve;
  });
  const reconnectBackOff = new import_BackOff.BackOff(import_BackOff.FIBONACCI_TIMEOUTS);
  window.storage.onready(() => {
    (0, import_assert.strictAssert)(server, "WebAPI not ready");
    import_senderCertificate.senderCertificateService.initialize({
      server,
      navigator,
      onlineEventTarget: window,
      storage: window.storage
    });
    import_areWeASubscriber.areWeASubscriberService.update(window.storage, server);
  });
  const eventHandlerQueue = new window.PQueue({
    concurrency: 1,
    timeout: durations.MINUTE * 30
  });
  const profileKeyResponseQueue = new window.PQueue();
  profileKeyResponseQueue.pause();
  const lightSessionResetQueue = new window.PQueue({ concurrency: 1 });
  window.Signal.Services.lightSessionResetQueue = lightSessionResetQueue;
  lightSessionResetQueue.pause();
  const onDecryptionErrorQueue = new window.PQueue({ concurrency: 1 });
  onDecryptionErrorQueue.pause();
  const onRetryRequestQueue = new window.PQueue({ concurrency: 1 });
  onRetryRequestQueue.pause();
  window.Whisper.deliveryReceiptQueue = new window.PQueue({
    concurrency: 1,
    timeout: durations.MINUTE * 30
  });
  window.Whisper.deliveryReceiptQueue.pause();
  window.Whisper.deliveryReceiptBatcher = window.Signal.Util.createBatcher({
    name: "Whisper.deliveryReceiptBatcher",
    wait: 500,
    maxSize: 100,
    processBatch: async (deliveryReceipts) => {
      await import_deliveryReceiptsJobQueue.deliveryReceiptsJobQueue.add({ deliveryReceipts });
    }
  });
  if (window.platform === "darwin") {
    window.addEventListener("dblclick", (event) => {
      const target = event.target;
      if ((0, import_isWindowDragElement.isWindowDragElement)(target)) {
        window.titleBarDoubleClick();
      }
    });
  }
  document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
  document.body.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
  (0, import_startInteractionMode.startInteractionMode)();
  window.preloadedImages = [];
  function preload(list) {
    for (let index = 0, max = list.length; index < max; index += 1) {
      const image = new Image();
      image.src = `./images/${list[index]}`;
      window.preloadedImages.push(image);
    }
  }
  const builtInImages = await window.getBuiltInImages();
  preload(builtInImages);
  window.setImmediate = window.nodeSetImmediate;
  const { Message } = window.Signal.Types;
  const {
    upgradeMessageSchema,
    writeNewAttachmentData,
    deleteAttachmentData,
    doesAttachmentExist
  } = window.Signal.Migrations;
  log.info("background page reloaded");
  log.info("environment:", window.getEnvironment());
  let newVersion = false;
  let lastVersion;
  window.document.title = window.getTitle();
  document.documentElement.setAttribute("lang", window.getLocale().substring(0, 2));
  KeyChangeListener.init(window.textsecure.storage.protocol);
  window.textsecure.storage.protocol.on("removePreKey", (ourUuid) => {
    const uuidKind = window.textsecure.storage.user.getOurUuidKind(ourUuid);
    window.getAccountManager().refreshPreKeys(uuidKind);
  });
  window.getSocketStatus = () => {
    if (server === void 0) {
      return import_SocketStatus.SocketStatus.CLOSED;
    }
    return server.getSocketStatus();
  };
  let accountManager;
  window.getAccountManager = () => {
    if (accountManager) {
      return accountManager;
    }
    if (!server) {
      throw new Error("getAccountManager: server is not available!");
    }
    accountManager = new window.textsecure.AccountManager(server);
    accountManager.addEventListener("registration", () => {
      window.Whisper.events.trigger("userChanged", false);
      window.Signal.Util.Registration.markDone();
      log.info("dispatching registration event");
      window.Whisper.events.trigger("registration_done");
    });
    return accountManager;
  };
  const cancelInitializationMessage = (0, import_setAppLoadingScreenMessage.setAppLoadingScreenMessage)(void 0, window.i18n);
  const version = await window.Signal.Data.getItemById("version");
  if (!version) {
    const isIndexedDBPresent = await indexedDb.doesDatabaseExist();
    if (isIndexedDBPresent) {
      log.info("Found IndexedDB database.");
      try {
        log.info("Confirming deletion of old data with user...");
        try {
          await new Promise((resolve, reject) => {
            window.showConfirmationDialog({
              onTopOfEverything: true,
              cancelText: window.i18n("quit"),
              confirmStyle: "negative",
              message: window.i18n("deleteOldIndexedDBData"),
              okText: window.i18n("deleteOldData"),
              reject: () => reject(),
              resolve: () => resolve()
            });
          });
        } catch (error) {
          log.info("User chose not to delete old data. Shutting down.", error && error.stack ? error.stack : error);
          window.shutdown();
          return;
        }
        log.info("Deleting all previously-migrated data in SQL...");
        log.info("Deleting IndexedDB file...");
        await Promise.all([
          indexedDb.removeDatabase(),
          window.Signal.Data.removeAll(),
          window.Signal.Data.removeIndexedDBFiles()
        ]);
        log.info("Done with SQL deletion and IndexedDB file deletion.");
      } catch (error) {
        log.error("Failed to remove IndexedDB file or remove SQL data:", error && error.stack ? error.stack : error);
      }
      await window.Signal.Data.createOrUpdateItem({
        id: "indexeddb-delete-needed",
        value: true
      });
    }
  }
  log.info("Storage fetch");
  window.storage.fetch();
  function mapOldThemeToNew(theme) {
    switch (theme) {
      case "dark":
      case "light":
      case "system":
        return theme;
      case "android-dark":
        return "dark";
      case "android":
      case "ios":
      default:
        return "light";
    }
  }
  let first = true;
  window.storage.onready(async () => {
    if (!first) {
      return;
    }
    first = false;
    (0, import_assert.strictAssert)(server !== void 0, "WebAPI not ready");
    cleanupSessionResets();
    window.Events = (0, import_createIPCEvents.createIPCEvents)({
      shutdown: async () => {
        log.info("background/shutdown");
        window.Signal.Util.flushMessageCounter();
        AttachmentDownloads.stop();
        idleDetector.stop();
        if (messageReceiver) {
          (0, import_assert.strictAssert)(server !== void 0, "WebAPI should be initialized together with MessageReceiver");
          log.info("background/shutdown: shutting down messageReceiver");
          server.unregisterRequestHandler(messageReceiver);
          messageReceiver.stopProcessing();
          await window.waitForAllBatchers();
        }
        log.info("background/shutdown: flushing conversations");
        await Promise.all(window.ConversationController.getAll().map((convo) => convo.flushDebouncedUpdates()));
        log.info("background/shutdown: waiting for all batchers");
        await Promise.all([
          window.waitForAllBatchers(),
          window.waitForAllWaitBatchers()
        ]);
        log.info("background/shutdown: closing the database");
        await window.Signal.Data.shutdown();
      }
    });
    const zoomFactor = window.Events.getZoomFactor();
    import_electron.webFrame.setZoomFactor(zoomFactor);
    document.body.style.setProperty("--zoom-factor", zoomFactor.toString());
    window.addEventListener("resize", () => {
      document.body.style.setProperty("--zoom-factor", import_electron.webFrame.getZoomFactor().toString());
    });
    const lastHeartbeat = (0, import_timestamp.toDayMillis)(window.storage.get("lastHeartbeat", 0));
    const previousLastStartup = window.storage.get("lastStartup");
    await window.storage.put("lastStartup", Date.now());
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1e3;
    if (lastHeartbeat > 0 && (0, import_timestamp.isOlderThan)(lastHeartbeat, THIRTY_DAYS)) {
      log.warn(`This instance has not been used for 30 days. Last heartbeat: ${lastHeartbeat}. Last startup: ${previousLastStartup}.`);
      await unlinkAndDisconnect(import_RemoveAllConfiguration.RemoveAllConfiguration.Soft);
    }
    window.storage.put("lastHeartbeat", (0, import_timestamp.toDayMillis)(Date.now()));
    const TWELVE_HOURS = 12 * 60 * 60 * 1e3;
    setInterval(() => window.storage.put("lastHeartbeat", (0, import_timestamp.toDayMillis)(Date.now())), TWELVE_HOURS);
    const currentVersion = window.getVersion();
    lastVersion = window.storage.get("version");
    newVersion = !lastVersion || currentVersion !== lastVersion;
    await window.storage.put("version", currentVersion);
    if (newVersion && lastVersion) {
      log.info(`New version detected: ${currentVersion}; previous: ${lastVersion}`);
      const remoteBuildExpiration = window.storage.get("remoteBuildExpiration");
      if (remoteBuildExpiration) {
        log.info(`Clearing remoteBuildExpiration. Previous value was ${remoteBuildExpiration}`);
        window.storage.remove("remoteBuildExpiration");
      }
      if (window.isBeforeVersion(lastVersion, "v1.29.2-beta.1")) {
        await Promise.all([
          window.storage.put("showStickersIntroduction", true),
          window.storage.put("showStickerPickerHint", true)
        ]);
      }
      if (window.isBeforeVersion(lastVersion, "v1.26.0")) {
        await window.storage.put("hasRegisterSupportForUnauthenticatedDelivery", false);
      }
      const themeSetting = window.Events.getThemeSetting();
      const newThemeSetting = mapOldThemeToNew(themeSetting);
      if (window.isBeforeVersion(lastVersion, "v1.25.0")) {
        if (newThemeSetting === window.systemTheme) {
          window.Events.setThemeSetting("system");
        } else {
          window.Events.setThemeSetting(newThemeSetting);
        }
      }
      if (window.isBeforeVersion(lastVersion, "v1.36.0-beta.1") && window.isAfterVersion(lastVersion, "v1.35.0-beta.1")) {
        await window.Signal.Services.eraseAllStorageServiceState();
      }
      if (window.isBeforeVersion(lastVersion, "v5.2.0")) {
        const legacySenderCertificateStorageKey = "senderCertificateWithUuid";
        await import_removeStorageKeyJobQueue.removeStorageKeyJobQueue.add({
          key: legacySenderCertificateStorageKey
        });
      }
      if (window.isBeforeVersion(lastVersion, "v5.18.0")) {
        await window.storage.remove("senderCertificate");
        await window.storage.remove("senderCertificateNoE164");
      }
      if (window.isBeforeVersion(lastVersion, "v5.19.0")) {
        await window.storage.remove(import_groupCredentialFetcher.GROUP_CREDENTIALS_KEY);
      }
      if (window.isBeforeVersion(lastVersion, "v5.37.0-alpha")) {
        const legacyChallengeKey = "challenge:retry-message-ids";
        await import_removeStorageKeyJobQueue.removeStorageKeyJobQueue.add({
          key: legacyChallengeKey
        });
        await window.Signal.Data.clearAllErrorStickerPackAttempts();
      }
      if (window.isBeforeVersion(lastVersion, "v5.51.0-beta.2")) {
        await window.storage.put("groupCredentials", []);
        await window.Signal.Data.removeAllProfileKeyCredentials();
      }
      if (window.isBeforeVersion(lastVersion, "v5.30.0-alpha")) {
        await (0, import_deleteAllLogs.deleteAllLogs)();
        window.restart();
        return;
      }
    }
    (0, import_setAppLoadingScreenMessage.setAppLoadingScreenMessage)(window.i18n("optimizingApplication"), window.i18n);
    if (newVersion) {
      try {
        await window.Signal.Data.cleanupOrphanedAttachments();
      } catch (error) {
        log.error("background: Failed to cleanup orphaned attachments:", error && error.stack ? error.stack : error);
      }
      window.Signal.Data.ensureFilePermissions();
    }
    try {
      await window.Signal.Data.startInRendererProcess();
    } catch (err) {
      log.error("SQL failed to initialize", err && err.stack ? err.stack : err);
    }
    (0, import_setAppLoadingScreenMessage.setAppLoadingScreenMessage)(window.i18n("loading"), window.i18n);
    let isMigrationWithIndexComplete = false;
    let isIdleTaskProcessing = false;
    log.info(`Starting background data migration. Target version: ${Message.CURRENT_SCHEMA_VERSION}`);
    idleDetector.on("idle", async () => {
      const NUM_MESSAGES_PER_BATCH = 25;
      const BATCH_DELAY = 10 * durations.SECOND;
      if (isIdleTaskProcessing) {
        log.warn("idleDetector/idle: previous batch incomplete, not starting another");
        return;
      }
      try {
        isIdleTaskProcessing = true;
        if (!isMigrationWithIndexComplete) {
          log.warn(`idleDetector/idle: fetching at most ${NUM_MESSAGES_PER_BATCH} for migration`);
          const batchWithIndex = await (0, import_migrateMessageData.migrateMessageData)({
            numMessagesPerBatch: NUM_MESSAGES_PER_BATCH,
            upgradeMessageSchema,
            getMessagesNeedingUpgrade: window.Signal.Data.getMessagesNeedingUpgrade,
            saveMessages: window.Signal.Data.saveMessages
          });
          log.info("idleDetector/idle: Upgraded messages:", batchWithIndex);
          isMigrationWithIndexComplete = batchWithIndex.done;
        }
      } finally {
        idleDetector.stop();
        if (isMigrationWithIndexComplete) {
          log.info("idleDetector/idle: Background migration complete. Stopping.");
        } else {
          log.info(`idleDetector/idle: Background migration not complete. Pausing for ${BATCH_DELAY}ms.`);
          setTimeout(() => {
            idleDetector.start();
          }, BATCH_DELAY);
        }
        isIdleTaskProcessing = false;
      }
    });
    window.Signal.RemoteConfig.initRemoteConfig(server);
    let retryReceiptLifespan;
    try {
      retryReceiptLifespan = (0, import_parseIntOrThrow.parseIntOrThrow)(window.Signal.RemoteConfig.getValue("desktop.retryReceiptLifespan"), "retryReceiptLifeSpan");
    } catch (error) {
      log.warn("Failed to parse integer out of desktop.retryReceiptLifespan feature flag");
    }
    const retryPlaceholders = new window.Signal.Util.RetryPlaceholders({
      retryReceiptLifespan
    });
    window.Signal.Services.retryPlaceholders = retryPlaceholders;
    setInterval(async () => {
      const now = Date.now();
      const HOUR = 1e3 * 60 * 60;
      const DAY = 24 * HOUR;
      let sentProtoMaxAge = 14 * DAY;
      try {
        sentProtoMaxAge = (0, import_parseIntOrThrow.parseIntOrThrow)(window.Signal.RemoteConfig.getValue("desktop.retryRespondMaxAge"), "retryRespondMaxAge");
      } catch (error) {
        log.warn("background/setInterval: Failed to parse integer from desktop.retryRespondMaxAge feature flag", error && error.stack ? error.stack : error);
      }
      try {
        await window.Signal.Data.deleteSentProtosOlderThan(now - sentProtoMaxAge);
      } catch (error) {
        log.error("background/onready/setInterval: Error deleting sent protos: ", error && error.stack ? error.stack : error);
      }
      try {
        const expired = await retryPlaceholders.getExpiredAndRemove();
        log.info(`retryPlaceholders/interval: Found ${expired.length} expired items`);
        expired.forEach((item) => {
          const { conversationId, senderUuid, sentAt } = item;
          const conversation = window.ConversationController.get(conversationId);
          if (conversation) {
            const receivedAt = Date.now();
            const receivedAtCounter = window.Signal.Util.incrementMessageCounter();
            conversation.queueJob("addDeliveryIssue", () => conversation.addDeliveryIssue({
              receivedAt,
              receivedAtCounter,
              senderUuid,
              sentAt
            }));
          }
        });
      } catch (error) {
        log.error("background/onready/setInterval: Error getting expired retry placeholders: ", error && error.stack ? error.stack : error);
      }
    }, FIVE_MINUTES);
    let mainWindowStats = {
      isMaximized: false,
      isFullScreen: false
    };
    let menuOptions = {
      development: false,
      devTools: false,
      includeSetup: false,
      isProduction: true,
      platform: "unknown"
    };
    try {
      await Promise.all([
        window.ConversationController.load(),
        Stickers.load(),
        (0, import_loadRecentEmojis.loadRecentEmojis)(),
        loadInitialBadgesState(),
        (0, import_storyLoader.loadStories)(),
        (0, import_distributionListLoader.loadDistributionLists)(),
        window.textsecure.storage.protocol.hydrateCaches(),
        (async () => {
          mainWindowStats = await window.SignalContext.getMainWindowStats();
        })(),
        (async () => {
          menuOptions = await window.SignalContext.getMenuOptions();
        })()
      ]);
      await window.ConversationController.checkForConflicts();
    } catch (error) {
      log.error("background.js: ConversationController failed to load:", error && error.stack ? error.stack : error);
    } finally {
      initializeRedux({ mainWindowStats, menuOptions });
      start();
      window.Signal.Services.initializeNetworkObserver(window.reduxActions.network);
      window.Signal.Services.initializeUpdateListener(window.reduxActions.updates);
      window.Signal.Services.calling.initialize(window.reduxActions.calling, window.getSfuUrl());
      window.reduxActions.expiration.hydrateExpirationStatus(window.Signal.Util.hasExpired());
    }
  });
  function initializeRedux({
    mainWindowStats,
    menuOptions
  }) {
    const convoCollection = window.getConversations();
    const initialState = (0, import_getInitialState.getInitialState)({
      badges: initialBadgesState,
      mainWindowStats,
      menuOptions,
      stories: (0, import_storyLoader.getStoriesForRedux)(),
      storyDistributionLists: (0, import_distributionListLoader.getDistributionListsForRedux)()
    });
    const store = window.Signal.State.createStore(initialState);
    window.reduxStore = store;
    window.reduxActions = {
      accounts: (0, import_redux.bindActionCreators)(import_actions.actionCreators.accounts, store.dispatch),
      app: (0, import_redux.bindActionCreators)(import_actions.actionCreators.app, store.dispatch),
      audioPlayer: (0, import_redux.bindActionCreators)(import_actions.actionCreators.audioPlayer, store.dispatch),
      audioRecorder: (0, import_redux.bindActionCreators)(import_actions.actionCreators.audioRecorder, store.dispatch),
      badges: (0, import_redux.bindActionCreators)(import_actions.actionCreators.badges, store.dispatch),
      calling: (0, import_redux.bindActionCreators)(import_actions.actionCreators.calling, store.dispatch),
      composer: (0, import_redux.bindActionCreators)(import_actions.actionCreators.composer, store.dispatch),
      conversations: (0, import_redux.bindActionCreators)(import_actions.actionCreators.conversations, store.dispatch),
      crashReports: (0, import_redux.bindActionCreators)(import_actions.actionCreators.crashReports, store.dispatch),
      emojis: (0, import_redux.bindActionCreators)(import_actions.actionCreators.emojis, store.dispatch),
      expiration: (0, import_redux.bindActionCreators)(import_actions.actionCreators.expiration, store.dispatch),
      globalModals: (0, import_redux.bindActionCreators)(import_actions.actionCreators.globalModals, store.dispatch),
      items: (0, import_redux.bindActionCreators)(import_actions.actionCreators.items, store.dispatch),
      linkPreviews: (0, import_redux.bindActionCreators)(import_actions.actionCreators.linkPreviews, store.dispatch),
      network: (0, import_redux.bindActionCreators)(import_actions.actionCreators.network, store.dispatch),
      safetyNumber: (0, import_redux.bindActionCreators)(import_actions.actionCreators.safetyNumber, store.dispatch),
      search: (0, import_redux.bindActionCreators)(import_actions.actionCreators.search, store.dispatch),
      stickers: (0, import_redux.bindActionCreators)(import_actions.actionCreators.stickers, store.dispatch),
      stories: (0, import_redux.bindActionCreators)(import_actions.actionCreators.stories, store.dispatch),
      storyDistributionLists: (0, import_redux.bindActionCreators)(import_actions.actionCreators.storyDistributionLists, store.dispatch),
      toast: (0, import_redux.bindActionCreators)(import_actions.actionCreators.toast, store.dispatch),
      updates: (0, import_redux.bindActionCreators)(import_actions.actionCreators.updates, store.dispatch),
      user: (0, import_redux.bindActionCreators)(import_actions.actionCreators.user, store.dispatch)
    };
    const {
      conversationAdded,
      conversationChanged,
      conversationRemoved,
      removeAllConversations
    } = window.reduxActions.conversations;
    convoCollection.on("remove", (conversation) => {
      const { id } = conversation || {};
      conversation.trigger("unload", "removed");
      conversationRemoved(id);
    });
    convoCollection.on("add", (conversation) => {
      if (!conversation) {
        return;
      }
      conversationAdded(conversation.id, conversation.format());
    });
    const changedConvoBatcher = (0, import_batcher.createBatcher)({
      name: "changedConvoBatcher",
      processBatch(batch) {
        const deduped = new Set(batch);
        log.info(`changedConvoBatcher: deduped ${batch.length} into ${deduped.size}`);
        (0, import_react_redux.batch)(() => {
          deduped.forEach((conversation) => {
            conversationChanged(conversation.id, conversation.format());
          });
        });
      },
      wait: 1,
      maxSize: Infinity
    });
    convoCollection.on("props-change", (conversation, isBatched) => {
      if (!conversation) {
        return;
      }
      if (isBatched) {
        changedConvoBatcher.removeAll(conversation);
        conversationChanged(conversation.id, conversation.format());
        return;
      }
      changedConvoBatcher.add(conversation);
    });
    convoCollection.on("reset", removeAllConversations);
    window.Whisper.events.on("userChanged", (reconnect = false) => {
      const newDeviceId = window.textsecure.storage.user.getDeviceId();
      const newNumber = window.textsecure.storage.user.getNumber();
      const newACI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI)?.toString();
      const newPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI)?.toString();
      const ourConversation = window.ConversationController.getOurConversation();
      if (ourConversation?.get("e164") !== newNumber) {
        ourConversation?.set("e164", newNumber);
      }
      window.reduxActions.user.userChanged({
        ourConversationId: ourConversation?.get("id"),
        ourDeviceId: newDeviceId,
        ourNumber: newNumber,
        ourACI: newACI,
        ourPNI: newPNI,
        regionCode: window.storage.get("regionCode")
      });
      if (reconnect) {
        log.info("background: reconnecting websocket on user change");
        enqueueReconnectToWebSocket();
      }
    });
    window.Whisper.events.on("setWindowStats", ({
      isFullScreen,
      isMaximized
    }) => {
      window.reduxActions.user.userChanged({
        isMainWindowMaximized: isMaximized,
        isMainWindowFullScreen: isFullScreen
      });
    });
    window.Whisper.events.on("setMenuOptions", (options) => {
      window.reduxActions.user.userChanged({ menuOptions: options });
    });
    let shortcutGuideView = null;
    window.showKeyboardShortcuts = () => {
      if (!shortcutGuideView) {
        shortcutGuideView = new import_ReactWrapperView.ReactWrapperView({
          className: "shortcut-guide-wrapper",
          JSX: window.Signal.State.Roots.createShortcutGuideModal(window.reduxStore, {
            close: () => {
              if (shortcutGuideView) {
                shortcutGuideView.remove();
                shortcutGuideView = null;
              }
            }
          }),
          onClose: () => {
            shortcutGuideView = null;
          }
        });
      }
    };
    document.addEventListener("keydown", (event) => {
      const { ctrlKey, metaKey, shiftKey } = event;
      const commandKey = window.platform === "darwin" && metaKey;
      const controlKey = window.platform !== "darwin" && ctrlKey;
      const commandOrCtrl = commandKey || controlKey;
      const state = store.getState();
      const selectedId = state.conversations.selectedConversationId;
      const conversation = window.ConversationController.get(selectedId);
      const key = KeyboardLayout.lookup(event);
      if (commandOrCtrl && key === "/") {
        window.showKeyboardShortcuts();
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (commandOrCtrl && !shiftKey && (key === "t" || key === "T")) {
        window.enterKeyboardMode();
        const focusedElement = document.activeElement;
        const targets = [
          document.querySelector(".module-main-header .module-avatar-button"),
          document.querySelector(".module-left-pane__header__contents__back-button"),
          document.querySelector(".LeftPaneSearchInput__input"),
          document.querySelector(".module-main-header__compose-icon"),
          document.querySelector(".module-left-pane__compose-search-form__input"),
          document.querySelector(".module-conversation-list__item--contact-or-conversation"),
          document.querySelector(".module-search-results"),
          document.querySelector(".CompositionArea .ql-editor")
        ];
        const focusedIndex = targets.findIndex((target) => {
          if (!target || !focusedElement) {
            return false;
          }
          if (target === focusedElement) {
            return true;
          }
          if (target.contains(focusedElement)) {
            return true;
          }
          return false;
        });
        const lastIndex = targets.length - 1;
        let index;
        if (focusedIndex < 0 || focusedIndex >= lastIndex) {
          index = 0;
        } else {
          index = focusedIndex + 1;
        }
        while (!targets[index]) {
          index += 1;
          if (index > lastIndex) {
            index = 0;
          }
        }
        targets[index].focus();
      }
      if (shortcutGuideView && key === "Escape") {
        shortcutGuideView.remove();
        shortcutGuideView = null;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (key === "Escape") {
        const target = document.activeElement;
        if (target && target.attributes && target.attributes.class && target.attributes.class.value) {
          const className = target.attributes.class.value;
          if (className.includes("LeftPaneSearchInput__input")) {
            return;
          }
        }
        const confirmationModal = document.querySelector(".module-confirmation-dialog__overlay");
        if (confirmationModal) {
          return;
        }
        const emojiPicker = document.querySelector(".module-emoji-picker");
        if (emojiPicker) {
          return;
        }
        const lightBox = document.querySelector(".Lightbox");
        if (lightBox) {
          return;
        }
        const stickerPicker = document.querySelector(".module-sticker-picker");
        if (stickerPicker) {
          return;
        }
        const stickerPreview = document.querySelector(".module-sticker-manager__preview-modal__overlay");
        if (stickerPreview) {
          return;
        }
        const reactionViewer = document.querySelector(".module-reaction-viewer");
        if (reactionViewer) {
          return;
        }
        const reactionPicker = document.querySelector(".module-ReactionPicker");
        if (reactionPicker) {
          return;
        }
        const contactModal = document.querySelector(".module-contact-modal");
        if (contactModal) {
          return;
        }
        const modalHost = document.querySelector(".module-modal-host__overlay");
        if (modalHost) {
          return;
        }
      }
      if (conversation && key === "Escape") {
        conversation.trigger("escape-pressed");
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "l" || key === "L")) {
        const button = document.querySelector(".module-ConversationHeader__button--more");
        if (!button) {
          return;
        }
        const { x, y, width, height } = button.getBoundingClientRect();
        const mouseEvent = document.createEvent("MouseEvents");
        mouseEvent.initMouseEvent("click", true, false, null, null, 0, 0, x + width / 2, y + height / 2, false, false, false, false, false, document.body);
        button.dispatchEvent(mouseEvent);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "t" || key === "T")) {
        conversation.trigger("focus-composer");
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "m" || key === "M")) {
        conversation.trigger("open-all-media");
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && !conversation.get("isArchived") && commandOrCtrl && shiftKey && (key === "a" || key === "A")) {
        conversation.setArchived(true);
        conversation.trigger("unload", "keyboard shortcut archive");
        (0, import_showToast.showToast)(import_ToastConversationArchived.ToastConversationArchived, {
          undo: () => {
            conversation.setArchived(false);
            window.Whisper.events.trigger("showConversation", conversation.get("id"));
          }
        });
        if (document.activeElement === document.body) {
          const leftPaneEl = document.querySelector(".module-left-pane__list");
          if (leftPaneEl) {
            leftPaneEl.focus();
          }
        }
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && conversation.get("isArchived") && commandOrCtrl && shiftKey && (key === "u" || key === "U")) {
        conversation.setArchived(false);
        (0, import_showToast.showToast)(import_ToastConversationUnarchived.ToastConversationUnarchived);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "c" || key === "C")) {
        conversation.trigger("unload", "keyboard shortcut close");
        window.reduxActions.conversations.showConversation({
          conversationId: void 0,
          messageId: void 0
        });
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && !shiftKey && (key === "d" || key === "D")) {
        const { selectedMessage } = state.conversations;
        if (!selectedMessage) {
          return;
        }
        conversation.trigger("show-message-details", selectedMessage);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "r" || key === "R")) {
        const { selectedMessage } = state.conversations;
        conversation.trigger("toggle-reply", selectedMessage);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && !shiftKey && (key === "s" || key === "S")) {
        const { selectedMessage } = state.conversations;
        if (selectedMessage) {
          conversation.trigger("save-attachment", selectedMessage);
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "d" || key === "D")) {
        const { selectedMessage } = state.conversations;
        if (selectedMessage) {
          conversation.trigger("delete-message", selectedMessage);
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
      if (conversation && commandOrCtrl && !shiftKey && (key === "p" || key === "P")) {
        conversation.trigger("remove-link-review");
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (conversation && commandOrCtrl && shiftKey && (key === "p" || key === "P")) {
        conversation.trigger("remove-all-draft-attachments");
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }
  window.Whisper.events.on("setupAsNewDevice", () => {
    window.reduxActions.app.openInstaller();
  });
  window.Whisper.events.on("setupAsStandalone", () => {
    window.reduxActions.app.openStandalone();
  });
  window.Whisper.events.on("powerMonitorSuspend", () => {
    log.info("powerMonitor: suspend");
    (0, import_TaskWithTimeout.suspendTasksWithTimeout)();
  });
  window.Whisper.events.on("powerMonitorResume", () => {
    log.info("powerMonitor: resume");
    server?.checkSockets();
    (0, import_TaskWithTimeout.resumeTasksWithTimeout)();
  });
  window.Whisper.events.on("powerMonitorLockScreen", () => {
    window.reduxActions.calling.hangUpActiveCall();
  });
  const reconnectToWebSocketQueue = new import_LatestQueue.LatestQueue();
  const enqueueReconnectToWebSocket = /* @__PURE__ */ __name(() => {
    reconnectToWebSocketQueue.add(async () => {
      if (!server) {
        log.info("reconnectToWebSocket: No server. Early return.");
        return;
      }
      log.info("reconnectToWebSocket starting...");
      await server.onOffline();
      await server.onOnline();
      log.info("reconnectToWebSocket complete.");
    });
  }, "enqueueReconnectToWebSocket");
  window.Whisper.events.on("mightBeUnlinked", window._.debounce(enqueueReconnectToWebSocket, 1e3, { maxWait: 5e3 }));
  window.Whisper.events.on("unlinkAndDisconnect", () => {
    unlinkAndDisconnect(import_RemoveAllConfiguration.RemoveAllConfiguration.Full);
  });
  async function runStorageService() {
    window.Signal.Services.enableStorageService();
    if (window.ConversationController.areWePrimaryDevice()) {
      log.warn("background/runStorageService: We are primary device; not sending key sync request");
      return;
    }
    try {
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestKeySyncMessage());
    } catch (error) {
      log.error("runStorageService: Failed to queue sync message", Errors.toLogFormat(error));
    }
  }
  async function start() {
    (0, import_assert.strictAssert)(challengeHandler, "start: challengeHandler");
    await challengeHandler.load();
    if (!window.storage.user.getNumber()) {
      const ourConversation = window.ConversationController.getOurConversation();
      const ourE164 = ourConversation?.get("e164");
      if (ourE164) {
        log.warn("Restoring E164 from our conversation");
        window.storage.user.setNumber(ourE164);
      }
    }
    if (newVersion && lastVersion) {
      if (window.isBeforeVersion(lastVersion, "v5.31.0")) {
        window.ConversationController.repairPinnedConversations();
      }
    }
    window.dispatchEvent(new Event("storage_ready"));
    import_badgeImageFileDownloader.badgeImageFileDownloader.checkForFilesToDownload();
    log.info("Expiration start timestamp cleanup: starting...");
    const messagesUnexpectedlyMissingExpirationStartTimestamp = await window.Signal.Data.getMessagesUnexpectedlyMissingExpirationStartTimestamp();
    log.info(`Expiration start timestamp cleanup: Found ${messagesUnexpectedlyMissingExpirationStartTimestamp.length} messages for cleanup`);
    if (!window.textsecure.storage.user.getUuid()) {
      log.info("Expiration start timestamp cleanup: Cancelling update; we don't have our own UUID");
    } else if (messagesUnexpectedlyMissingExpirationStartTimestamp.length) {
      const newMessageAttributes = messagesUnexpectedlyMissingExpirationStartTimestamp.map((message) => {
        const expirationStartTimestamp = Math.min(...(0, import_iterables.filter)([
          message.sent_at,
          Date.now(),
          message.expirationStartTimestamp
        ], import_isNotNil.isNotNil));
        log.info(`Expiration start timestamp cleanup: starting timer for ${message.type} message sent at ${message.sent_at}. Starting timer at ${expirationStartTimestamp}`);
        return {
          ...message,
          expirationStartTimestamp
        };
      });
      await window.Signal.Data.saveMessages(newMessageAttributes, {
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    }
    log.info("Expiration start timestamp cleanup: complete");
    log.info("listening for registration events");
    window.Whisper.events.on("registration_done", () => {
      log.info("handling registration event");
      (0, import_assert.strictAssert)(server !== void 0, "WebAPI not ready");
      server.authenticate(window.textsecure.storage.user.getWebAPICredentials());
      connect(true);
    });
    cancelInitializationMessage();
    (0, import_react_dom.render)(window.Signal.State.Roots.createApp(window.reduxStore), document.getElementById("app-container"));
    const hideMenuBar = window.storage.get("hide-menu-bar", false);
    window.setAutoHideMenuBar(hideMenuBar);
    window.setMenuBarVisibility(!hideMenuBar);
    (0, import_startTimeTravelDetector.startTimeTravelDetector)(() => {
      window.Whisper.events.trigger("timetravel");
    });
    import_expiringMessagesDeletion.expiringMessagesDeletionService.update();
    import_tapToViewMessagesDeletionService.tapToViewMessagesDeletionService.update();
    window.Whisper.events.on("timetravel", () => {
      import_expiringMessagesDeletion.expiringMessagesDeletionService.update();
      import_tapToViewMessagesDeletionService.tapToViewMessagesDeletionService.update();
    });
    const isCoreDataValid = Boolean(window.textsecure.storage.user.getUuid() && window.ConversationController.getOurConversation());
    if (isCoreDataValid && window.Signal.Util.Registration.everDone()) {
      connect();
      window.reduxActions.app.openInbox();
    } else {
      window.reduxActions.app.openInstaller();
    }
    const { activeWindowService } = window.SignalContext;
    activeWindowService.registerForActive(() => import_notifications.notificationService.clear());
    window.addEventListener("unload", () => import_notifications.notificationService.fastClear());
    import_notifications.notificationService.on("click", (id, messageId) => {
      window.showWindow();
      if (id) {
        window.Whisper.events.trigger("showConversation", id, messageId);
      } else {
        window.reduxActions.app.openInbox();
      }
    });
    activeWindowService.registerForActive(async () => {
      (0, import_assert.strictAssert)(server !== void 0, "WebAPI not ready");
      try {
        await window.Signal.RemoteConfig.maybeRefreshRemoteConfig(server);
      } catch (error) {
        if (error instanceof import_Errors.HTTPError) {
          log.warn(`registerForActive: Failed to to refresh remote config. Code: ${error.code}`);
          return;
        }
        throw error;
      }
    });
    window.Signal.RemoteConfig.onChange("desktop.clientExpiration", ({ value }) => {
      const remoteBuildExpirationTimestamp = window.Signal.Util.parseRemoteClientExpiration(value);
      if (remoteBuildExpirationTimestamp) {
        window.storage.put("remoteBuildExpiration", remoteBuildExpirationTimestamp);
        window.reduxActions.expiration.hydrateExpirationStatus(window.Signal.Util.hasExpired());
      }
    });
    const removeMessageRequestListener = window.Signal.RemoteConfig.onChange("desktop.messageRequests", ({ enabled }) => {
      if (!enabled) {
        return;
      }
      const conversations = window.getConversations();
      conversations.forEach((conversation) => {
        conversation.set({
          messageCountBeforeMessageRequests: conversation.get("messageCount") || 0
        });
        window.Signal.Data.updateConversation(conversation.attributes);
      });
      removeMessageRequestListener();
    });
    if (resolveOnAppView) {
      resolveOnAppView();
      resolveOnAppView = void 0;
    }
  }
  window.getSyncRequest = (timeoutMillis) => {
    (0, import_assert.strictAssert)(messageReceiver, "MessageReceiver not initialized");
    const syncRequest = new window.textsecure.SyncRequest(messageReceiver, timeoutMillis);
    syncRequest.start();
    return syncRequest;
  };
  let disconnectTimer;
  let reconnectTimer;
  function onOffline() {
    log.info("offline");
    window.removeEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    disconnectTimer = Timers.setTimeout(disconnect, 1e3);
    if (challengeHandler) {
      challengeHandler.onOffline();
    }
  }
  function onOnline() {
    log.info("online");
    window.removeEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    if (disconnectTimer && isSocketOnline()) {
      log.warn("Already online. Had a blip in online/offline status.");
      Timers.clearTimeout(disconnectTimer);
      disconnectTimer = void 0;
      return;
    }
    if (disconnectTimer) {
      Timers.clearTimeout(disconnectTimer);
      disconnectTimer = void 0;
    }
    connect();
  }
  function isSocketOnline() {
    const socketStatus = window.getSocketStatus();
    return socketStatus === import_SocketStatus.SocketStatus.CONNECTING || socketStatus === import_SocketStatus.SocketStatus.OPEN;
  }
  async function disconnect() {
    log.info("disconnect");
    disconnectTimer = void 0;
    AttachmentDownloads.stop();
    if (server !== void 0) {
      (0, import_assert.strictAssert)(messageReceiver !== void 0, "WebAPI should be initialized together with MessageReceiver");
      await server.onOffline();
      await messageReceiver.drain();
    }
  }
  let isInitialSync = false;
  let connectCount = 0;
  let connecting = false;
  async function connect(firstRun) {
    if (connecting) {
      log.warn("connect already running", { connectCount });
      return;
    }
    (0, import_assert.strictAssert)(server !== void 0, "WebAPI not connected");
    try {
      connecting = true;
      isInitialSync = false;
      log.info("connect", { firstRun, connectCount });
      if (reconnectTimer) {
        Timers.clearTimeout(reconnectTimer);
        reconnectTimer = void 0;
      }
      if (connectCount === 0 && navigator.onLine) {
        window.addEventListener("offline", onOffline);
      }
      if (connectCount === 0 && !navigator.onLine) {
        log.warn("Starting up offline; will connect when we have network access");
        window.addEventListener("online", onOnline);
        onEmpty();
        if (window.reduxStore.getState().app.appView === import_app.AppViewType.Installer) {
          log.info("firstRun: offline, opening inbox");
          window.reduxActions.app.openInbox();
        } else {
          log.info("firstRun: offline, not opening inbox");
        }
        return;
      }
      if (!window.Signal.Util.Registration.everDone()) {
        return;
      }
      window.textsecure.messaging = new window.textsecure.MessageSender(server);
      const profileKey = await import_ourProfileKey.ourProfileKeyService.get();
      if (firstRun && profileKey) {
        const me = window.ConversationController.getOurConversation();
        (0, import_assert.strictAssert)(me !== void 0, "Didn't find newly created ourselves");
        await me.setProfileKey(Bytes.toBase64(profileKey));
      }
      if (connectCount === 0) {
        try {
          await window.Signal.RemoteConfig.refreshRemoteConfig(server);
          const expiration = window.Signal.RemoteConfig.getValue("desktop.clientExpiration");
          if (expiration) {
            const remoteBuildExpirationTimestamp = window.Signal.Util.parseRemoteClientExpiration(expiration);
            if (remoteBuildExpirationTimestamp) {
              window.storage.put("remoteBuildExpiration", remoteBuildExpirationTimestamp);
              window.reduxActions.expiration.hydrateExpirationStatus(window.Signal.Util.hasExpired());
            }
          }
        } catch (error) {
          log.error("connect: Error refreshing remote config:", error && error.stack ? error.stack : error);
        }
        try {
          const lonelyE164Conversations = window.getConversations().filter((c) => Boolean((0, import_whatTypeOfConversation.isDirectConversation)(c.attributes) && c.get("e164") && !c.get("uuid") && !c.isEverUnregistered()));
          await (0, import_updateConversationsWithUuidLookup.updateConversationsWithUuidLookup)({
            conversationController: window.ConversationController,
            conversations: lonelyE164Conversations,
            messaging: window.textsecure.messaging
          });
        } catch (error) {
          log.error("connect: Error fetching UUIDs for lonely e164s:", error && error.stack ? error.stack : error);
        }
      }
      connectCount += 1;
      profileKeyResponseQueue.pause();
      lightSessionResetQueue.pause();
      onDecryptionErrorQueue.pause();
      onRetryRequestQueue.pause();
      window.Whisper.deliveryReceiptQueue.pause();
      import_notifications.notificationService.disable();
      window.Signal.Services.initializeGroupCredentialFetcher();
      (0, import_assert.strictAssert)(server !== void 0, "WebAPI not initialized");
      (0, import_assert.strictAssert)(messageReceiver !== void 0, "MessageReceiver not initialized");
      messageReceiver.reset();
      server.registerRequestHandler(messageReceiver);
      await server.onOnline();
      AttachmentDownloads.start({
        logger: log
      });
      if (connectCount === 1) {
        Stickers.downloadQueuedPacks();
        if (!newVersion) {
          runStorageService();
        }
      }
      if (!firstRun && connectCount === 1 && newVersion && window.textsecure.storage.user.getDeviceId() !== 1) {
        log.info("Boot after upgrading. Requesting contact sync");
        window.getSyncRequest();
        runStorageService();
        try {
          const manager = window.getAccountManager();
          await Promise.all([
            manager.maybeUpdateDeviceName(),
            window.textsecure.storage.user.removeSignalingKey()
          ]);
        } catch (e) {
          log.error("Problem with account manager updates after starting new version: ", e && e.stack ? e.stack : e);
        }
      }
      const udSupportKey = "hasRegisterSupportForUnauthenticatedDelivery";
      if (!window.storage.get(udSupportKey)) {
        try {
          await server.registerSupportForUnauthenticatedDelivery();
          window.storage.put(udSupportKey, true);
        } catch (error) {
          log.error("Error: Unable to register for unauthenticated delivery support.", error && error.stack ? error.stack : error);
        }
      }
      const deviceId = window.textsecure.storage.user.getDeviceId();
      if (!window.textsecure.storage.user.getUuid()) {
        log.error("UUID not captured during registration, unlinking");
        return unlinkAndDisconnect(import_RemoveAllConfiguration.RemoveAllConfiguration.Full);
      }
      if (connectCount === 1) {
        try {
          await Promise.all([
            server.registerCapabilities({
              announcementGroup: true,
              giftBadges: true,
              "gv2-3": true,
              "gv1-migration": true,
              senderKey: true,
              changeNumber: true,
              stories: true
            }),
            (0, import_updateOurUsernameAndPni.updateOurUsernameAndPni)()
          ]);
        } catch (error) {
          log.error("Error: Unable to register our capabilities.", error && error.stack ? error.stack : error);
        }
      }
      if (!window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI)) {
        log.error("PNI not captured during registration, unlinking softly");
        return unlinkAndDisconnect(import_RemoveAllConfiguration.RemoveAllConfiguration.Soft);
      }
      if (firstRun === true && deviceId !== 1) {
        const hasThemeSetting = Boolean(window.storage.get("theme-setting"));
        if (!hasThemeSetting && window.textsecure.storage.get("userAgent") === "OWI") {
          window.storage.put("theme-setting", await window.Events.getThemeSetting());
          (0, import_themeChanged.themeChanged)();
        }
        const waitForEvent = (0, import_TaskWithTimeout.default)((event) => {
          const { promise, resolve } = (0, import_explodePromise.explodePromise)();
          window.Whisper.events.once(event, () => resolve());
          return promise;
        }, "firstRun:waitForEvent");
        let storageServiceSyncComplete;
        if (window.ConversationController.areWePrimaryDevice()) {
          storageServiceSyncComplete = Promise.resolve();
        } else {
          storageServiceSyncComplete = waitForEvent("storageService:syncComplete");
        }
        const contactSyncComplete = waitForEvent("contactSync:complete");
        log.info("firstRun: requesting initial sync");
        isInitialSync = true;
        try {
          await Promise.all([
            import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestConfigurationSyncMessage()),
            import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestBlockSyncMessage()),
            import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestGroupSyncMessage()),
            import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestContactSyncMessage()),
            runStorageService()
          ]);
        } catch (error) {
          log.error("connect: Failed to request initial syncs", Errors.toLogFormat(error));
        }
        log.info("firstRun: waiting for storage service and contact sync");
        try {
          await Promise.all([storageServiceSyncComplete, contactSyncComplete]);
        } catch (error) {
          log.error("connect: Failed to run storage service and contact syncs", Errors.toLogFormat(error));
        }
        log.info("firstRun: initial sync complete");
        isInitialSync = false;
        if (window.reduxStore.getState().app.appView === import_app.AppViewType.Installer) {
          log.info("firstRun: opening inbox");
          window.reduxActions.app.openInbox();
        } else {
          log.info("firstRun: not opening inbox");
        }
        const installedStickerPacks = Stickers.getInstalledStickerPacks();
        if (installedStickerPacks.length) {
          const operations = installedStickerPacks.map((pack) => ({
            packId: pack.id,
            packKey: pack.key,
            installed: true
          }));
          if (window.ConversationController.areWePrimaryDevice()) {
            log.warn("background/connect: We are primary device; not sending sticker pack sync");
            return;
          }
          log.info("firstRun: requesting stickers", operations.length);
          try {
            await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getStickerPackSync(operations));
          } catch (error) {
            log.error("connect: Failed to queue sticker sync message", Errors.toLogFormat(error));
          }
        }
        log.info("firstRun: done");
      }
      window.storage.onready(async () => {
        idleDetector.start();
      });
      if (!challengeHandler) {
        throw new Error("Expected challenge handler to be initialized");
      }
      challengeHandler.onOnline();
      reconnectBackOff.reset();
    } finally {
      connecting = false;
    }
  }
  window.SignalContext.nativeThemeListener.subscribe(import_themeChanged.themeChanged);
  const FIVE_MINUTES = 5 * durations.MINUTE;
  async function waitForEmptyEventQueue() {
    if (!messageReceiver) {
      log.info("waitForEmptyEventQueue: No messageReceiver available, returning early");
      return;
    }
    if (!messageReceiver.hasEmptied()) {
      log.info("waitForEmptyEventQueue: Waiting for MessageReceiver empty event...");
      const { resolve, reject, promise } = (0, import_explodePromise.explodePromise)();
      const timeout = Timers.setTimeout(() => {
        reject(new Error("Empty queue never fired"));
      }, FIVE_MINUTES);
      const onEmptyOnce = /* @__PURE__ */ __name(() => {
        if (messageReceiver) {
          messageReceiver.removeEventListener("empty", onEmptyOnce);
        }
        Timers.clearTimeout(timeout);
        if (resolve) {
          resolve();
        }
      }, "onEmptyOnce");
      messageReceiver.addEventListener("empty", onEmptyOnce);
      await promise;
    }
    log.info("waitForEmptyEventQueue: Waiting for event handler queue idle...");
    await eventHandlerQueue.onIdle();
  }
  window.waitForEmptyEventQueue = waitForEmptyEventQueue;
  async function onEmpty() {
    const { storage } = window.textsecure;
    await Promise.all([
      window.waitForAllBatchers(),
      window.flushAllWaitBatchers()
    ]);
    log.info("onEmpty: All outstanding database requests complete");
    window.readyForUpdates();
    window.ConversationController.onEmpty();
    import_RotateSignedPreKeyListener.RotateSignedPreKeyListener.init(window.Whisper.events, newVersion);
    await window.Signal.Data.goBackToMainProcess();
    profileKeyResponseQueue.start();
    lightSessionResetQueue.start();
    onDecryptionErrorQueue.start();
    onRetryRequestQueue.start();
    window.Whisper.deliveryReceiptQueue.start();
    import_notifications.notificationService.enable();
    await onAppView;
    window.reduxActions.app.initialLoadComplete();
    const processedCount = messageReceiver?.getAndResetProcessedCount() || 0;
    window.logAppLoadedEvent?.({
      processedCount
    });
    if (messageReceiver) {
      log.info("App loaded - messages:", processedCount);
    }
    window.Signal.Util.setBatchingStrategy(false);
    const attachmentDownloadQueue = window.attachmentDownloadQueue || [];
    window.attachmentDownloadQueue = void 0;
    const MAX_ATTACHMENT_MSGS_TO_DOWNLOAD = 250;
    const attachmentsToDownload = attachmentDownloadQueue.filter((message, index) => index <= MAX_ATTACHMENT_MSGS_TO_DOWNLOAD || (0, import_timestamp.isMoreRecentThan)(message.getReceivedAt(), MAX_ATTACHMENT_DOWNLOAD_AGE) || message.hasRequiredAttachmentDownloads());
    log.info("Downloading recent attachments of total attachments", attachmentsToDownload.length, attachmentDownloadQueue.length);
    if (window.startupProcessingQueue) {
      window.startupProcessingQueue.flush();
      window.startupProcessingQueue = void 0;
    }
    const messagesWithDownloads = await Promise.all(attachmentsToDownload.map((message) => message.queueAttachmentDownloads()));
    const messagesToSave = [];
    messagesWithDownloads.forEach((shouldSave, messageKey) => {
      if (shouldSave) {
        const message = attachmentsToDownload[messageKey];
        messagesToSave.push(message.attributes);
      }
    });
    await window.Signal.Data.saveMessages(messagesToSave, {
      ourUuid: storage.user.getCheckedUuid().toString()
    });
    window.reduxActions.crashReports.setCrashReportCount(await window.crashReports.getCount());
    if (!routineProfileRefresher) {
      routineProfileRefresher = new import_routineProfileRefresh.RoutineProfileRefresher({
        getAllConversations: () => window.ConversationController.getAll(),
        getOurConversationId: () => window.ConversationController.getOurConversationId(),
        storage
      });
      routineProfileRefresher.start();
    }
    const pni = storage.user.getCheckedUuid(import_UUID.UUIDKind.PNI);
    const pniIdentity = await storage.protocol.getIdentityKeyPair(pni);
    if (!pniIdentity) {
      log.info("Requesting PNI identity sync");
      await import_singleProtoJobQueue.singleProtoJobQueue.add(import_SendMessage.default.getRequestPniIdentitySyncMessage());
    }
  }
  let initialStartupCount = 0;
  window.Whisper.events.on("incrementProgress", incrementProgress);
  function incrementProgress() {
    initialStartupCount += 1;
    if (initialStartupCount % 10 !== 0) {
      return;
    }
    log.info(`incrementProgress: Message count is ${initialStartupCount}`);
    window.Whisper.events.trigger("loadingProgress", initialStartupCount);
  }
  window.Whisper.events.on("manualConnect", manualConnect);
  function manualConnect() {
    if (isSocketOnline()) {
      log.info("manualConnect: already online; not connecting again");
      return;
    }
    log.info("manualConnect: calling connect()");
    connect();
  }
  function onConfiguration(ev) {
    ev.confirm();
    const { configuration } = ev;
    const {
      readReceipts,
      typingIndicators,
      unidentifiedDeliveryIndicators,
      linkPreviews
    } = configuration;
    window.storage.put("read-receipt-setting", Boolean(readReceipts));
    if (unidentifiedDeliveryIndicators === true || unidentifiedDeliveryIndicators === false) {
      window.storage.put("unidentifiedDeliveryIndicators", unidentifiedDeliveryIndicators);
    }
    if (typingIndicators === true || typingIndicators === false) {
      window.storage.put("typingIndicators", typingIndicators);
    }
    if (linkPreviews === true || linkPreviews === false) {
      window.storage.put("linkPreviews", linkPreviews);
    }
  }
  function onTyping(ev) {
    const { typing, sender, senderUuid, senderDevice } = ev;
    const { groupId, groupV2Id, started } = typing || {};
    if (!window.storage.get("typingIndicators")) {
      return;
    }
    let conversation;
    const senderConversation = window.ConversationController.maybeMergeContacts({
      e164: sender,
      aci: senderUuid,
      reason: `onTyping(${typing.timestamp})`
    });
    if (groupV2Id) {
      conversation = window.ConversationController.get(groupV2Id);
    }
    if (!conversation && groupId) {
      conversation = window.ConversationController.get(groupId);
    }
    if (!groupV2Id && !groupId && senderConversation) {
      conversation = senderConversation;
    }
    const ourId = window.ConversationController.getOurConversationId();
    if (!senderConversation) {
      log.warn("onTyping: maybeMergeContacts returned falsey sender!");
      return;
    }
    if (!ourId) {
      log.warn("onTyping: Couldn't get our own id!");
      return;
    }
    if (!conversation) {
      log.warn(`onTyping: Did not find conversation for typing indicator (groupv2(${groupV2Id}), group(${groupId}), ${sender}, ${senderUuid})`);
      return;
    }
    const ourACI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI);
    const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes) && !(ourACI && conversation.hasMember(ourACI)) && !(ourPNI && conversation.hasMember(ourPNI))) {
      log.warn(`Received typing indicator for group ${conversation.idForLogging()}, which we're not a part of. Dropping.`);
      return;
    }
    if (conversation?.isBlocked()) {
      log.info(`onTyping: conversation ${conversation.idForLogging()} is blocked, dropping typing message`);
      return;
    }
    if (!senderConversation) {
      log.warn("onTyping: No conversation for sender!");
      return;
    }
    if (senderConversation.isBlocked()) {
      log.info(`onTyping: sender ${conversation.idForLogging()} is blocked, dropping typing message`);
      return;
    }
    const senderId = senderConversation.id;
    conversation.notifyTyping({
      isTyping: started,
      fromMe: senderId === ourId,
      senderId,
      senderDevice
    });
  }
  async function onStickerPack(ev) {
    ev.confirm();
    const packs = ev.stickerPacks;
    packs.forEach((pack) => {
      const { id, key, isInstall, isRemove } = pack || {};
      if (!id || !key || !isInstall && !isRemove) {
        log.warn("Received malformed sticker pack operation sync message");
        return;
      }
      const status = Stickers.getStickerPackStatus(id);
      if (status === "installed" && isRemove) {
        window.reduxActions.stickers.uninstallStickerPack(id, key, {
          fromSync: true
        });
      } else if (isInstall) {
        if (status === "downloaded") {
          window.reduxActions.stickers.installStickerPack(id, key, {
            fromSync: true
          });
        } else {
          Stickers.downloadStickerPack(id, key, {
            finalStatus: "installed",
            fromSync: true
          });
        }
      }
    });
  }
  async function onContactSyncComplete() {
    log.info("onContactSyncComplete");
    await window.storage.put("synced_at", Date.now());
    window.Whisper.events.trigger("contactSync:complete");
  }
  function onContactReceived(ev) {
    const details = ev.contactDetails;
    const partialConversation = {
      e164: details.number,
      uuid: import_UUID.UUID.cast(details.uuid),
      type: "private"
    };
    const validationError = (0, import_validateConversation.validateConversation)(partialConversation);
    if (validationError) {
      log.error("Invalid contact received:", Errors.toLogFormat(validationError));
      return;
    }
    const conversation = window.ConversationController.maybeMergeContacts({
      e164: details.number,
      aci: details.uuid,
      reason: "onContactReceived"
    });
    (0, import_assert.strictAssert)(conversation, "need conversation to queue the job!");
    conversation.queueJob("onContactReceived", async () => {
      try {
        conversation.set({
          name: details.name,
          inbox_position: details.inboxPosition
        });
        const { avatar } = details;
        if (avatar && avatar.data) {
          const newAttributes = await Conversation.maybeUpdateAvatar(conversation.attributes, avatar.data, {
            writeNewAttachmentData,
            deleteAttachmentData,
            doesAttachmentExist
          });
          conversation.set(newAttributes);
        } else {
          const { attributes } = conversation;
          if (attributes.avatar && attributes.avatar.path) {
            await deleteAttachmentData(attributes.avatar.path);
          }
          conversation.set({ avatar: null });
        }
        window.Signal.Data.updateConversation(conversation.attributes);
        const { expireTimer } = details;
        const isValidExpireTimer = typeof expireTimer === "number";
        if (isValidExpireTimer) {
          await conversation.updateExpirationTimer(expireTimer, {
            source: window.ConversationController.getOurConversationId(),
            receivedAt: ev.receivedAtCounter,
            fromSync: true,
            isInitialSync,
            reason: "contact sync"
          });
        }
        window.Whisper.events.trigger("incrementProgress");
      } catch (error) {
        log.error("onContactReceived error:", Errors.toLogFormat(error));
      }
    });
  }
  async function onGroupSyncComplete() {
    log.info("onGroupSyncComplete");
    await window.storage.put("synced_at", Date.now());
  }
  async function onGroupReceived(ev) {
    const details = ev.groupDetails;
    const { id } = details;
    const conversation = await window.ConversationController.getOrCreateAndWait(id, "group");
    if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes)) {
      log.warn("Got group sync for v2 group: ", conversation.idForLogging());
      return;
    }
    const memberConversations = details.membersE164.map((e164) => window.ConversationController.getOrCreate(e164, "private"));
    const members = memberConversations.map((c) => c.get("id"));
    const updates = {
      name: details.name,
      members,
      type: "group",
      inbox_position: details.inboxPosition
    };
    if (details.active) {
      updates.left = false;
    } else {
      updates.left = true;
    }
    if (details.blocked) {
      conversation.block();
    } else {
      conversation.unblock();
    }
    conversation.set(updates);
    const { avatar } = details;
    if (avatar && avatar.data) {
      const newAttributes = await Conversation.maybeUpdateAvatar(conversation.attributes, avatar.data, {
        writeNewAttachmentData,
        deleteAttachmentData,
        doesAttachmentExist
      });
      conversation.set(newAttributes);
    }
    window.Signal.Data.updateConversation(conversation.attributes);
    const { expireTimer } = details;
    const isValidExpireTimer = typeof expireTimer === "number";
    if (!isValidExpireTimer) {
      return;
    }
    await conversation.updateExpirationTimer(expireTimer, {
      fromSync: true,
      receivedAt: ev.receivedAtCounter,
      source: window.ConversationController.getOurConversationId(),
      reason: "group sync"
    });
  }
  async function handleMessageReceivedProfileUpdate({
    data,
    confirm,
    messageDescriptor
  }) {
    const { profileKey } = data.message;
    (0, import_assert.strictAssert)(profileKey !== void 0, "handleMessageReceivedProfileUpdate: missing profileKey");
    const sender = window.ConversationController.get(messageDescriptor.id);
    if (sender) {
      await sender.setProfileKey(profileKey);
    }
    return confirm();
  }
  const respondWithProfileKeyBatcher = (0, import_batcher.createBatcher)({
    name: "respondWithProfileKeyBatcher",
    processBatch(batch) {
      const deduped = new Set(batch);
      deduped.forEach(async (sender) => {
        try {
          if (!await (0, import_shouldRespondWithProfileKey.shouldRespondWithProfileKey)(sender)) {
            return;
          }
        } catch (error) {
          log.error("respondWithProfileKeyBatcher error", error && error.stack);
        }
        sender.queueJob("sendProfileKeyUpdate", () => sender.sendProfileKeyUpdate());
      });
    },
    wait: 200,
    maxSize: Infinity
  });
  function onEnvelopeReceived({ envelope }) {
    const ourUuid = window.textsecure.storage.user.getUuid()?.toString();
    if (envelope.sourceUuid && envelope.sourceUuid !== ourUuid) {
      window.ConversationController.maybeMergeContacts({
        e164: envelope.source,
        aci: envelope.sourceUuid,
        reason: `onEnvelopeReceived(${envelope.timestamp})`
      });
    }
  }
  function onMessageReceived(event) {
    const { data, confirm } = event;
    const messageDescriptor = getMessageDescriptor({
      confirm,
      ...data,
      destination: data.source,
      destinationUuid: data.sourceUuid
    });
    const { PROFILE_KEY_UPDATE } = import_protobuf.SignalService.DataMessage.Flags;
    const isProfileUpdate = Boolean(data.message.flags & PROFILE_KEY_UPDATE);
    if (isProfileUpdate) {
      return handleMessageReceivedProfileUpdate({
        data,
        confirm,
        messageDescriptor
      });
    }
    const message = initIncomingMessage(data, messageDescriptor);
    if ((0, import_message.isIncoming)(message.attributes) && !message.get("unidentifiedDeliveryReceived")) {
      const sender = (0, import_helpers.getContact)(message.attributes);
      if (!sender) {
        throw new Error("MessageModel has no sender.");
      }
      profileKeyResponseQueue.add(() => {
        respondWithProfileKeyBatcher.add(sender);
      });
    }
    if (data.message.reaction) {
      (0, import_assert.strictAssert)(data.message.reaction.targetAuthorUuid, "Reaction without targetAuthorUuid");
      const targetAuthorUuid = (0, import_normalizeUuid.normalizeUuid)(data.message.reaction.targetAuthorUuid, "DataMessage.Reaction.targetAuthorUuid");
      const { reaction, timestamp } = data.message;
      if (!(0, import_isValidReactionEmoji.isValidReactionEmoji)(reaction.emoji)) {
        log.warn("Received an invalid reaction emoji. Dropping it");
        confirm();
        return Promise.resolve();
      }
      (0, import_assert.strictAssert)(reaction.targetTimestamp, "Reaction without targetTimestamp");
      const fromConversation = window.ConversationController.lookupOrCreate({
        e164: data.source,
        uuid: data.sourceUuid
      });
      (0, import_assert.strictAssert)(fromConversation, "Reaction without fromConversation");
      log.info("Queuing incoming reaction for", reaction.targetTimestamp);
      const attributes = {
        emoji: reaction.emoji,
        remove: reaction.remove,
        targetAuthorUuid,
        targetTimestamp: reaction.targetTimestamp,
        timestamp,
        fromId: fromConversation.id,
        source: import_ReactionSource.ReactionSource.FromSomeoneElse
      };
      const reactionModel = import_Reactions.Reactions.getSingleton().add(attributes);
      import_Reactions.Reactions.getSingleton().onReaction(reactionModel, message);
      confirm();
      return Promise.resolve();
    }
    if (data.message.delete) {
      const { delete: del } = data.message;
      log.info("Queuing incoming DOE for", del.targetSentTimestamp);
      (0, import_assert.strictAssert)(del.targetSentTimestamp, "Delete missing targetSentTimestamp");
      (0, import_assert.strictAssert)(data.serverTimestamp, "Delete missing serverTimestamp");
      const fromConversation = window.ConversationController.lookupOrCreate({
        e164: data.source,
        uuid: data.sourceUuid
      });
      (0, import_assert.strictAssert)(fromConversation, "Delete missing fromConversation");
      const attributes = {
        targetSentTimestamp: del.targetSentTimestamp,
        serverTimestamp: data.serverTimestamp,
        fromId: fromConversation.id
      };
      const deleteModel = import_Deletes.Deletes.getSingleton().add(attributes);
      import_Deletes.Deletes.getSingleton().onDelete(deleteModel);
      confirm();
      return Promise.resolve();
    }
    if (handleGroupCallUpdateMessage(data.message, messageDescriptor)) {
      confirm();
      return Promise.resolve();
    }
    message.handleDataMessage(data.message, event.confirm);
    return Promise.resolve();
  }
  async function onProfileKeyUpdate({ data, confirm }) {
    const conversation = window.ConversationController.maybeMergeContacts({
      aci: data.sourceUuid,
      e164: data.source,
      reason: "onProfileKeyUpdate"
    });
    if (!conversation) {
      log.error("onProfileKeyUpdate: could not find conversation", data.source, data.sourceUuid);
      confirm();
      return;
    }
    if (!data.profileKey) {
      log.error("onProfileKeyUpdate: missing profileKey", data.profileKey);
      confirm();
      return;
    }
    log.info("onProfileKeyUpdate: updating profileKey for", data.sourceUuid, data.source);
    await conversation.setProfileKey(data.profileKey);
    confirm();
  }
  async function handleMessageSentProfileUpdate({
    data,
    confirm,
    messageDescriptor
  }) {
    const { id } = messageDescriptor;
    const conversation = window.ConversationController.get(id);
    conversation.enableProfileSharing();
    window.Signal.Data.updateConversation(conversation.attributes);
    const ourId = window.ConversationController.getOurConversationId();
    const me = window.ConversationController.get(ourId);
    const { profileKey } = data.message;
    (0, import_assert.strictAssert)(profileKey !== void 0, "handleMessageSentProfileUpdate: missing profileKey");
    await me.setProfileKey(profileKey);
    return confirm();
  }
  function createSentMessage(data, descriptor) {
    const now = Date.now();
    const timestamp = data.timestamp || now;
    const ourId = window.ConversationController.getOurConversationIdOrThrow();
    const { unidentifiedStatus = [] } = data;
    const sendStateByConversationId = unidentifiedStatus.reduce((result, { destinationUuid, destination, isAllowedToReplyToStory }) => {
      const conversation = window.ConversationController.lookupOrCreate({
        uuid: destinationUuid,
        e164: destination
      });
      if (!conversation || conversation.id === ourId) {
        return result;
      }
      return {
        ...result,
        [conversation.id]: {
          isAllowedToReplyToStory,
          status: import_MessageSendState.SendStatus.Sent,
          updatedAt: timestamp
        }
      };
    }, {
      [ourId]: {
        status: import_MessageSendState.SendStatus.Sent,
        updatedAt: timestamp
      }
    });
    let unidentifiedDeliveries = [];
    if (unidentifiedStatus.length) {
      const unidentified = window._.filter(data.unidentifiedStatus, (item) => Boolean(item.unidentified));
      unidentifiedDeliveries = unidentified.map((item) => item.destinationUuid || item.destination).filter(import_isNotNil.isNotNil);
    }
    const partialMessage = {
      id: import_UUID.UUID.generate().toString(),
      canReplyToStory: data.message.isStory ? data.message.canReplyToStory : void 0,
      conversationId: descriptor.id,
      expirationStartTimestamp: Math.min(data.expirationStartTimestamp || timestamp, now),
      readStatus: import_MessageReadStatus.ReadStatus.Read,
      received_at_ms: data.receivedAtDate,
      received_at: data.receivedAtCounter,
      seenStatus: import_MessageSeenStatus.SeenStatus.NotApplicable,
      sendStateByConversationId,
      sent_at: timestamp,
      serverTimestamp: data.serverTimestamp,
      source: window.textsecure.storage.user.getNumber(),
      sourceDevice: data.device,
      sourceUuid: window.textsecure.storage.user.getUuid()?.toString(),
      timestamp,
      type: data.message.isStory ? "story" : "outgoing",
      storyDistributionListId: data.storyDistributionListId,
      unidentifiedDeliveries
    };
    return new window.Whisper.Message(partialMessage);
  }
  const getMessageDescriptor = /* @__PURE__ */ __name(({
    confirm,
    message,
    source,
    sourceUuid,
    destination,
    destinationUuid
  }) => {
    if (message.groupV2) {
      const { id } = message.groupV2;
      if (!id) {
        throw new Error("getMessageDescriptor: GroupV2 data was missing an id");
      }
      const groupV2 = window.ConversationController.get(id);
      if (groupV2) {
        return {
          type: Message.GROUP,
          id: groupV2.id
        };
      }
      const groupV1 = window.ConversationController.getByDerivedGroupV2Id(id);
      if (groupV1) {
        return {
          type: Message.GROUP,
          id: groupV1.id
        };
      }
      const conversationId = window.ConversationController.ensureGroup(id, {
        groupVersion: 2,
        masterKey: message.groupV2.masterKey,
        secretParams: message.groupV2.secretParams,
        publicParams: message.groupV2.publicParams
      });
      return {
        type: Message.GROUP,
        id: conversationId
      };
    }
    if (message.group) {
      const { id, derivedGroupV2Id } = message.group;
      if (!id) {
        throw new Error("getMessageDescriptor: GroupV1 data was missing id");
      }
      if (!derivedGroupV2Id) {
        log.warn("getMessageDescriptor: GroupV1 data was missing derivedGroupV2Id");
      } else {
        const migratedGroup = window.ConversationController.get(derivedGroupV2Id);
        if (migratedGroup) {
          return {
            type: Message.GROUP,
            id: migratedGroup.id
          };
        }
      }
      const fromContact = window.ConversationController.maybeMergeContacts({
        aci: sourceUuid,
        e164: source,
        reason: `getMessageDescriptor(${message.timestamp}): group v1`
      });
      const conversationId = window.ConversationController.ensureGroup(id, {
        addedBy: fromContact?.id
      });
      return {
        type: Message.GROUP,
        id: conversationId
      };
    }
    const conversation = window.ConversationController.maybeMergeContacts({
      aci: destinationUuid,
      e164: destination,
      reason: `getMessageDescriptor(${message.timestamp}): private`
    });
    if (!conversation) {
      confirm();
      throw new Error(`getMessageDescriptor/${message.timestamp}: maybeMergeContacts returned falsey conversation`);
    }
    return {
      type: Message.PRIVATE,
      id: conversation.id
    };
  }, "getMessageDescriptor");
  function onSentMessage(event) {
    const { data, confirm } = event;
    const source = window.textsecure.storage.user.getNumber();
    const sourceUuid = window.textsecure.storage.user.getUuid()?.toString();
    (0, import_assert.strictAssert)(source && sourceUuid, "Missing user number and uuid");
    const messageDescriptor = getMessageDescriptor({
      confirm,
      ...data,
      source,
      sourceUuid
    });
    const { PROFILE_KEY_UPDATE } = import_protobuf.SignalService.DataMessage.Flags;
    const isProfileUpdate = Boolean(data.message.flags & PROFILE_KEY_UPDATE);
    if (isProfileUpdate) {
      return handleMessageSentProfileUpdate({
        data,
        confirm,
        messageDescriptor
      });
    }
    const message = createSentMessage(data, messageDescriptor);
    if (data.message.reaction) {
      (0, import_assert.strictAssert)(data.message.reaction.targetAuthorUuid, "Reaction without targetAuthorUuid");
      const targetAuthorUuid = (0, import_normalizeUuid.normalizeUuid)(data.message.reaction.targetAuthorUuid, "DataMessage.Reaction.targetAuthorUuid");
      const { reaction, timestamp } = data.message;
      (0, import_assert.strictAssert)(reaction.targetTimestamp, "Reaction without targetAuthorUuid");
      if (!(0, import_isValidReactionEmoji.isValidReactionEmoji)(reaction.emoji)) {
        log.warn("Received an invalid reaction emoji. Dropping it");
        event.confirm();
        return Promise.resolve();
      }
      log.info("Queuing sent reaction for", reaction.targetTimestamp);
      const attributes = {
        emoji: reaction.emoji,
        remove: reaction.remove,
        targetAuthorUuid,
        targetTimestamp: reaction.targetTimestamp,
        timestamp,
        fromId: window.ConversationController.getOurConversationIdOrThrow(),
        source: import_ReactionSource.ReactionSource.FromSync
      };
      const reactionModel = import_Reactions.Reactions.getSingleton().add(attributes);
      import_Reactions.Reactions.getSingleton().onReaction(reactionModel, message);
      event.confirm();
      return Promise.resolve();
    }
    if (data.message.delete) {
      const { delete: del } = data.message;
      (0, import_assert.strictAssert)(del.targetSentTimestamp, "Delete without targetSentTimestamp");
      (0, import_assert.strictAssert)(data.serverTimestamp, "Data has no serverTimestamp");
      log.info("Queuing sent DOE for", del.targetSentTimestamp);
      const attributes = {
        targetSentTimestamp: del.targetSentTimestamp,
        serverTimestamp: data.serverTimestamp,
        fromId: window.ConversationController.getOurConversationIdOrThrow()
      };
      const deleteModel = import_Deletes.Deletes.getSingleton().add(attributes);
      import_Deletes.Deletes.getSingleton().onDelete(deleteModel);
      confirm();
      return Promise.resolve();
    }
    if (handleGroupCallUpdateMessage(data.message, messageDescriptor)) {
      event.confirm();
      return Promise.resolve();
    }
    message.handleDataMessage(data.message, event.confirm, {
      data
    });
    return Promise.resolve();
  }
  function initIncomingMessage(data, descriptor) {
    (0, import_assert.assert)(Boolean(data.receivedAtCounter), `Did not receive receivedAtCounter for message: ${data.timestamp}`);
    const partialMessage = {
      id: import_UUID.UUID.generate().toString(),
      canReplyToStory: data.message.isStory ? data.message.canReplyToStory : void 0,
      conversationId: descriptor.id,
      readStatus: import_MessageReadStatus.ReadStatus.Unread,
      received_at: data.receivedAtCounter,
      received_at_ms: data.receivedAtDate,
      seenStatus: import_MessageSeenStatus.SeenStatus.Unseen,
      sent_at: data.timestamp,
      serverGuid: data.serverGuid,
      serverTimestamp: data.serverTimestamp,
      source: data.source,
      sourceDevice: data.sourceDevice,
      sourceUuid: data.sourceUuid ? import_UUID.UUID.cast(data.sourceUuid) : void 0,
      timestamp: data.timestamp,
      type: data.message.isStory ? "story" : "incoming",
      unidentifiedDeliveryReceived: data.unidentifiedDeliveryReceived
    };
    return new window.Whisper.Message(partialMessage);
  }
  function handleGroupCallUpdateMessage(message, messageDescriptor) {
    if (message.groupCallUpdate) {
      if (message.groupV2 && messageDescriptor.type === Message.GROUP) {
        window.reduxActions.calling.peekNotConnectedGroupCall({
          conversationId: messageDescriptor.id
        });
        return true;
      }
      log.warn("Received a group call update for a conversation that is not a GV2 group. Ignoring that property and continuing.");
    }
    return false;
  }
  async function unlinkAndDisconnect(mode) {
    window.Whisper.events.trigger("unauthorized");
    log.warn("unlinkAndDisconnect: Client is no longer authorized; deleting local configuration");
    if (messageReceiver) {
      log.info("unlinkAndDisconnect: logging out");
      (0, import_assert.strictAssert)(server !== void 0, "WebAPI not initialized");
      server.unregisterRequestHandler(messageReceiver);
      messageReceiver.stopProcessing();
      await server.logout();
      await window.waitForAllBatchers();
    }
    onEmpty();
    window.Signal.Util.Registration.remove();
    const NUMBER_ID_KEY = "number_id";
    const UUID_ID_KEY = "uuid_id";
    const VERSION_KEY = "version";
    const LAST_PROCESSED_INDEX_KEY = "attachmentMigration_lastProcessedIndex";
    const IS_MIGRATION_COMPLETE_KEY = "attachmentMigration_isComplete";
    const previousNumberId = window.textsecure.storage.get(NUMBER_ID_KEY);
    const previousUuidId = window.textsecure.storage.get(UUID_ID_KEY);
    const lastProcessedIndex = window.textsecure.storage.get(LAST_PROCESSED_INDEX_KEY);
    const isMigrationComplete = window.textsecure.storage.get(IS_MIGRATION_COMPLETE_KEY);
    try {
      log.info(`unlinkAndDisconnect: removing configuration, mode ${mode}`);
      await window.textsecure.storage.protocol.removeAllConfiguration(mode);
      window.getConversations().forEach((conversation) => {
        delete conversation.attributes.senderKeyInfo;
      });
      if (previousNumberId !== void 0) {
        await window.textsecure.storage.put(NUMBER_ID_KEY, previousNumberId);
      }
      if (previousUuidId !== void 0) {
        await window.textsecure.storage.put(UUID_ID_KEY, previousUuidId);
      }
      await window.textsecure.storage.put(IS_MIGRATION_COMPLETE_KEY, isMigrationComplete || false);
      if (lastProcessedIndex !== void 0) {
        await window.textsecure.storage.put(LAST_PROCESSED_INDEX_KEY, lastProcessedIndex);
      } else {
        await window.textsecure.storage.remove(LAST_PROCESSED_INDEX_KEY);
      }
      await window.textsecure.storage.put(VERSION_KEY, window.getVersion());
      log.info("unlinkAndDisconnect: Successfully cleared local configuration");
    } catch (eraseError) {
      log.error("unlinkAndDisconnect: Something went wrong clearing local configuration", eraseError && eraseError.stack ? eraseError.stack : eraseError);
    } finally {
      window.Signal.Util.Registration.markEverDone();
    }
  }
  function onError(ev) {
    const { error } = ev;
    log.error("background onError:", Errors.toLogFormat(error));
    if (error instanceof import_Errors.HTTPError && (error.code === 401 || error.code === 403)) {
      unlinkAndDisconnect(import_RemoveAllConfiguration.RemoveAllConfiguration.Full);
      return;
    }
    log.warn("background onError: Doing nothing with incoming error");
  }
  async function onViewOnceOpenSync(ev) {
    ev.confirm();
    const { source, sourceUuid, timestamp } = ev;
    log.info(`view once open sync ${source} ${timestamp}`);
    (0, import_assert.strictAssert)(sourceUuid, "ViewOnceOpen without sourceUuid");
    (0, import_assert.strictAssert)(timestamp, "ViewOnceOpen without timestamp");
    const attributes = {
      source,
      sourceUuid,
      timestamp
    };
    const sync = import_ViewOnceOpenSyncs.ViewOnceOpenSyncs.getSingleton().add(attributes);
    import_ViewOnceOpenSyncs.ViewOnceOpenSyncs.getSingleton().onSync(sync);
  }
  async function onFetchLatestSync(ev) {
    ev.confirm();
    const { eventType } = ev;
    const FETCH_LATEST_ENUM = import_protobuf.SignalService.SyncMessage.FetchLatest.Type;
    switch (eventType) {
      case FETCH_LATEST_ENUM.LOCAL_PROFILE: {
        const ourUuid = window.textsecure.storage.user.getUuid()?.toString();
        const ourE164 = window.textsecure.storage.user.getNumber();
        await Promise.all([
          (0, import_getProfile.getProfile)(ourUuid, ourE164),
          (0, import_updateOurUsernameAndPni.updateOurUsernameAndPni)()
        ]);
        break;
      }
      case FETCH_LATEST_ENUM.STORAGE_MANIFEST:
        log.info("onFetchLatestSync: fetching latest manifest");
        await window.Signal.Services.runStorageServiceSyncJob();
        break;
      case FETCH_LATEST_ENUM.SUBSCRIPTION_STATUS:
        log.info("onFetchLatestSync: fetching latest subscription status");
        (0, import_assert.strictAssert)(server, "WebAPI not ready");
        import_areWeASubscriber.areWeASubscriberService.update(window.storage, server);
        break;
      default:
        log.info(`onFetchLatestSync: Unknown type encountered ${eventType}`);
    }
  }
  async function onKeysSync(ev) {
    ev.confirm();
    const { storageServiceKey } = ev;
    if (storageServiceKey === null) {
      log.info("onKeysSync: deleting window.storageKey");
      window.storage.remove("storageKey");
    }
    if (storageServiceKey) {
      const storageServiceKeyBase64 = Bytes.toBase64(storageServiceKey);
      if (window.storage.get("storageKey") === storageServiceKeyBase64) {
        log.info("onKeysSync: storage service key didn't change, fetching manifest anyway");
      } else {
        log.info("onKeysSync: updated storage service key, erasing state and fetching");
        await window.storage.put("storageKey", storageServiceKeyBase64);
        await window.Signal.Services.eraseAllStorageServiceState({
          keepUnknownFields: true
        });
      }
      await window.Signal.Services.runStorageServiceSyncJob();
    }
  }
  async function onMessageRequestResponse(ev) {
    ev.confirm();
    const {
      threadE164,
      threadUuid,
      groupId,
      groupV2Id,
      messageRequestResponseType
    } = ev;
    log.info("onMessageRequestResponse", {
      threadE164,
      threadUuid,
      groupId: `group(${groupId})`,
      groupV2Id: `groupv2(${groupV2Id})`,
      messageRequestResponseType
    });
    (0, import_assert.strictAssert)(messageRequestResponseType, "onMessageRequestResponse: missing type");
    const attributes = {
      threadE164,
      threadUuid,
      groupId,
      groupV2Id,
      type: messageRequestResponseType
    };
    const sync = import_MessageRequests.MessageRequests.getSingleton().add(attributes);
    import_MessageRequests.MessageRequests.getSingleton().onResponse(sync);
  }
  function onReadReceipt(event) {
    onReadOrViewReceipt({
      logTitle: "read receipt",
      event,
      type: import_MessageReceipts.MessageReceiptType.Read
    });
  }
  function onViewReceipt(event) {
    onReadOrViewReceipt({
      logTitle: "view receipt",
      event,
      type: import_MessageReceipts.MessageReceiptType.View
    });
  }
  function onReadOrViewReceipt({
    event,
    logTitle,
    type
  }) {
    const { envelopeTimestamp, timestamp, source, sourceUuid, sourceDevice } = event.receipt;
    const sourceConversation = window.ConversationController.maybeMergeContacts({
      aci: sourceUuid,
      e164: source,
      reason: `onReadOrViewReceipt(${envelopeTimestamp})`
    });
    log.info(logTitle, source, sourceUuid, sourceDevice, envelopeTimestamp, sourceConversation?.id, "for sent message", timestamp);
    event.confirm();
    if (!window.storage.get("read-receipt-setting") || !sourceConversation) {
      return;
    }
    (0, import_assert.strictAssert)((0, import_UUID.isValidUuid)(sourceUuid), "onReadOrViewReceipt: Missing sourceUuid");
    (0, import_assert.strictAssert)(sourceDevice, "onReadOrViewReceipt: Missing sourceDevice");
    const attributes = {
      messageSentAt: timestamp,
      receiptTimestamp: envelopeTimestamp,
      sourceConversationId: sourceConversation?.id,
      sourceUuid,
      sourceDevice,
      type
    };
    const receipt = import_MessageReceipts.MessageReceipts.getSingleton().add(attributes);
    import_MessageReceipts.MessageReceipts.getSingleton().onReceipt(receipt);
  }
  function onReadSync(ev) {
    const { envelopeTimestamp, sender, senderUuid, timestamp } = ev.read;
    const readAt = envelopeTimestamp;
    const senderConversation = window.ConversationController.lookupOrCreate({
      e164: sender,
      uuid: senderUuid
    });
    const senderId = senderConversation?.id;
    log.info("read sync", sender, senderUuid, envelopeTimestamp, senderId, "for message", timestamp);
    (0, import_assert.strictAssert)(senderId, "onReadSync missing senderId");
    (0, import_assert.strictAssert)(senderUuid, "onReadSync missing senderUuid");
    (0, import_assert.strictAssert)(timestamp, "onReadSync missing timestamp");
    const attributes = {
      senderId,
      sender,
      senderUuid,
      timestamp,
      readAt
    };
    const receipt = import_ReadSyncs.ReadSyncs.getSingleton().add(attributes);
    receipt.on("remove", ev.confirm);
    return import_ReadSyncs.ReadSyncs.getSingleton().onSync(receipt);
  }
  function onViewSync(ev) {
    const { envelopeTimestamp, senderE164, senderUuid, timestamp } = ev.view;
    const senderConversation = window.ConversationController.lookupOrCreate({
      e164: senderE164,
      uuid: senderUuid
    });
    const senderId = senderConversation?.id;
    log.info("view sync", senderE164, senderUuid, envelopeTimestamp, senderId, "for message", timestamp);
    (0, import_assert.strictAssert)(senderId, "onViewSync missing senderId");
    (0, import_assert.strictAssert)(senderUuid, "onViewSync missing senderUuid");
    (0, import_assert.strictAssert)(timestamp, "onViewSync missing timestamp");
    const attributes = {
      senderId,
      senderE164,
      senderUuid,
      timestamp,
      viewedAt: envelopeTimestamp
    };
    const receipt = import_ViewSyncs.ViewSyncs.getSingleton().add(attributes);
    receipt.on("remove", ev.confirm);
    return import_ViewSyncs.ViewSyncs.getSingleton().onSync(receipt);
  }
  function onDeliveryReceipt(ev) {
    const { deliveryReceipt } = ev;
    const { envelopeTimestamp, sourceUuid, source, sourceDevice, timestamp } = deliveryReceipt;
    ev.confirm();
    const sourceConversation = window.ConversationController.maybeMergeContacts({
      aci: sourceUuid,
      e164: source,
      reason: `onDeliveryReceipt(${envelopeTimestamp})`
    });
    log.info("delivery receipt from", source, sourceUuid, sourceDevice, sourceConversation?.id, envelopeTimestamp, "for sent message", timestamp);
    if (!sourceConversation) {
      log.info("no conversation for", source, sourceUuid);
      return;
    }
    (0, import_assert.strictAssert)(envelopeTimestamp, "onDeliveryReceipt: missing envelopeTimestamp");
    (0, import_assert.strictAssert)((0, import_UUID.isValidUuid)(sourceUuid), "onDeliveryReceipt: missing valid sourceUuid");
    (0, import_assert.strictAssert)(sourceDevice, "onDeliveryReceipt: missing sourceDevice");
    const attributes = {
      messageSentAt: timestamp,
      receiptTimestamp: envelopeTimestamp,
      sourceConversationId: sourceConversation?.id,
      sourceUuid,
      sourceDevice,
      type: import_MessageReceipts.MessageReceiptType.Delivery
    };
    const receipt = import_MessageReceipts.MessageReceipts.getSingleton().add(attributes);
    import_MessageReceipts.MessageReceipts.getSingleton().onReceipt(receipt);
  }
}
window.startApp = startApp;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanupSessionResets,
  isOverHourIntoPast,
  startApp
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYmFja2dyb3VuZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IHdlYkZyYW1lIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGJhdGNoIGFzIGJhdGNoRGlzcGF0Y2ggfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmltcG9ydCBNZXNzYWdlUmVjZWl2ZXIgZnJvbSAnLi90ZXh0c2VjdXJlL01lc3NhZ2VSZWNlaXZlcic7XG5pbXBvcnQgdHlwZSB7XG4gIFNlc3Npb25SZXNldHNUeXBlLFxuICBQcm9jZXNzZWREYXRhTWVzc2FnZSxcbn0gZnJvbSAnLi90ZXh0c2VjdXJlL1R5cGVzLmQnO1xuaW1wb3J0IHsgSFRUUEVycm9yIH0gZnJvbSAnLi90ZXh0c2VjdXJlL0Vycm9ycyc7XG5pbXBvcnQgY3JlYXRlVGFza1dpdGhUaW1lb3V0LCB7XG4gIHN1c3BlbmRUYXNrc1dpdGhUaW1lb3V0LFxuICByZXN1bWVUYXNrc1dpdGhUaW1lb3V0LFxufSBmcm9tICcuL3RleHRzZWN1cmUvVGFza1dpdGhUaW1lb3V0JztcbmltcG9ydCB0eXBlIHtcbiAgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgUmVhY3Rpb25BdHRyaWJ1dGVzVHlwZSxcbiAgVmFsaWRhdGVDb252ZXJzYXRpb25UeXBlLFxufSBmcm9tICcuL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi9CeXRlcyc7XG5pbXBvcnQgKiBhcyBUaW1lcnMgZnJvbSAnLi9UaW1lcnMnO1xuaW1wb3J0ICogYXMgaW5kZXhlZERiIGZyb20gJy4vaW5kZXhlZGRiJztcbmltcG9ydCB0eXBlIHsgTWVudU9wdGlvbnNUeXBlIH0gZnJvbSAnLi90eXBlcy9tZW51JztcbmltcG9ydCB0eXBlIHsgUmVjZWlwdCB9IGZyb20gJy4vdHlwZXMvUmVjZWlwdCc7XG5pbXBvcnQgeyBTb2NrZXRTdGF0dXMgfSBmcm9tICcuL3R5cGVzL1NvY2tldFN0YXR1cyc7XG5pbXBvcnQgeyBERUZBVUxUX0NPTlZFUlNBVElPTl9DT0xPUiB9IGZyb20gJy4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBDaGFsbGVuZ2VIYW5kbGVyIH0gZnJvbSAnLi9jaGFsbGVuZ2UnO1xuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgZXhwbG9kZVByb21pc2UgfSBmcm9tICcuL3V0aWwvZXhwbG9kZVByb21pc2UnO1xuaW1wb3J0IHsgaXNXaW5kb3dEcmFnRWxlbWVudCB9IGZyb20gJy4vdXRpbC9pc1dpbmRvd0RyYWdFbGVtZW50JztcbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBub3JtYWxpemVVdWlkIH0gZnJvbSAnLi91dGlsL25vcm1hbGl6ZVV1aWQnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi91dGlsL2l0ZXJhYmxlcyc7XG5pbXBvcnQgeyBpc05vdE5pbCB9IGZyb20gJy4vdXRpbC9pc05vdE5pbCc7XG5pbXBvcnQgeyBzZXRBcHBMb2FkaW5nU2NyZWVuTWVzc2FnZSB9IGZyb20gJy4vc2V0QXBwTG9hZGluZ1NjcmVlbk1lc3NhZ2UnO1xuaW1wb3J0IHsgSWRsZURldGVjdG9yIH0gZnJvbSAnLi9JZGxlRGV0ZWN0b3InO1xuaW1wb3J0IHsgZXhwaXJpbmdNZXNzYWdlc0RlbGV0aW9uU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZXhwaXJpbmdNZXNzYWdlc0RlbGV0aW9uJztcbmltcG9ydCB7IHRhcFRvVmlld01lc3NhZ2VzRGVsZXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy90YXBUb1ZpZXdNZXNzYWdlc0RlbGV0aW9uU2VydmljZSc7XG5pbXBvcnQgeyBnZXRTdG9yaWVzRm9yUmVkdXgsIGxvYWRTdG9yaWVzIH0gZnJvbSAnLi9zZXJ2aWNlcy9zdG9yeUxvYWRlcic7XG5pbXBvcnQge1xuICBnZXREaXN0cmlidXRpb25MaXN0c0ZvclJlZHV4LFxuICBsb2FkRGlzdHJpYnV0aW9uTGlzdHMsXG59IGZyb20gJy4vc2VydmljZXMvZGlzdHJpYnV0aW9uTGlzdExvYWRlcic7XG5pbXBvcnQgeyBzZW5kZXJDZXJ0aWZpY2F0ZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3NlbmRlckNlcnRpZmljYXRlJztcbmltcG9ydCB7IEdST1VQX0NSRURFTlRJQUxTX0tFWSB9IGZyb20gJy4vc2VydmljZXMvZ3JvdXBDcmVkZW50aWFsRmV0Y2hlcic7XG5pbXBvcnQgKiBhcyBLZXlib2FyZExheW91dCBmcm9tICcuL3NlcnZpY2VzL2tleWJvYXJkTGF5b3V0JztcbmltcG9ydCB7IFJvdXRpbmVQcm9maWxlUmVmcmVzaGVyIH0gZnJvbSAnLi9yb3V0aW5lUHJvZmlsZVJlZnJlc2gnO1xuaW1wb3J0IHsgaXNNb3JlUmVjZW50VGhhbiwgaXNPbGRlclRoYW4sIHRvRGF5TWlsbGlzIH0gZnJvbSAnLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBpc1ZhbGlkUmVhY3Rpb25FbW9qaSB9IGZyb20gJy4vcmVhY3Rpb25zL2lzVmFsaWRSZWFjdGlvbkVtb2ppJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uTW9kZWwgfSBmcm9tICcuL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldENvbnRhY3QgfSBmcm9tICcuL21lc3NhZ2VzL2hlbHBlcnMnO1xuaW1wb3J0IHsgbWlncmF0ZU1lc3NhZ2VEYXRhIH0gZnJvbSAnLi9tZXNzYWdlcy9taWdyYXRlTWVzc2FnZURhdGEnO1xuaW1wb3J0IHsgY3JlYXRlQmF0Y2hlciB9IGZyb20gJy4vdXRpbC9iYXRjaGVyJztcbmltcG9ydCB7IHVwZGF0ZUNvbnZlcnNhdGlvbnNXaXRoVXVpZExvb2t1cCB9IGZyb20gJy4vdXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwJztcbmltcG9ydCB7IGluaXRpYWxpemVBbGxKb2JRdWV1ZXMgfSBmcm9tICcuL2pvYnMvaW5pdGlhbGl6ZUFsbEpvYlF1ZXVlcyc7XG5pbXBvcnQgeyByZW1vdmVTdG9yYWdlS2V5Sm9iUXVldWUgfSBmcm9tICcuL2pvYnMvcmVtb3ZlU3RvcmFnZUtleUpvYlF1ZXVlJztcbmltcG9ydCB7IG91clByb2ZpbGVLZXlTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9vdXJQcm9maWxlS2V5JztcbmltcG9ydCB7IG5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IHsgYXJlV2VBU3Vic2NyaWJlclNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2FyZVdlQVN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3RhcnRUaW1lVHJhdmVsRGV0ZWN0b3IgfSBmcm9tICcuL3V0aWwvc3RhcnRUaW1lVHJhdmVsRGV0ZWN0b3InO1xuaW1wb3J0IHsgc2hvdWxkUmVzcG9uZFdpdGhQcm9maWxlS2V5IH0gZnJvbSAnLi91dGlsL3Nob3VsZFJlc3BvbmRXaXRoUHJvZmlsZUtleSc7XG5pbXBvcnQgeyBMYXRlc3RRdWV1ZSB9IGZyb20gJy4vdXRpbC9MYXRlc3RRdWV1ZSc7XG5pbXBvcnQgeyBwYXJzZUludE9yVGhyb3cgfSBmcm9tICcuL3V0aWwvcGFyc2VJbnRPclRocm93JztcbmltcG9ydCB7IGdldFByb2ZpbGUgfSBmcm9tICcuL3V0aWwvZ2V0UHJvZmlsZSc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbmZpZ3VyYXRpb25FdmVudCxcbiAgQ29udGFjdEV2ZW50LFxuICBEZWNyeXB0aW9uRXJyb3JFdmVudCxcbiAgRGVsaXZlcnlFdmVudCxcbiAgRW52ZWxvcGVFdmVudCxcbiAgRXJyb3JFdmVudCxcbiAgRmV0Y2hMYXRlc3RFdmVudCxcbiAgR3JvdXBFdmVudCxcbiAgS2V5c0V2ZW50LFxuICBNZXNzYWdlRXZlbnQsXG4gIE1lc3NhZ2VFdmVudERhdGEsXG4gIE1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VFdmVudCxcbiAgUHJvZmlsZUtleVVwZGF0ZUV2ZW50LFxuICBSZWFkRXZlbnQsXG4gIFJlYWRTeW5jRXZlbnQsXG4gIFJldHJ5UmVxdWVzdEV2ZW50LFxuICBTZW50RXZlbnQsXG4gIFNlbnRFdmVudERhdGEsXG4gIFN0aWNrZXJQYWNrRXZlbnQsXG4gIFR5cGluZ0V2ZW50LFxuICBWaWV3RXZlbnQsXG4gIFZpZXdPbmNlT3BlblN5bmNFdmVudCxcbiAgVmlld1N5bmNFdmVudCxcbn0gZnJvbSAnLi90ZXh0c2VjdXJlL21lc3NhZ2VSZWNlaXZlckV2ZW50cyc7XG5pbXBvcnQgdHlwZSB7IFdlYkFQSVR5cGUgfSBmcm9tICcuL3RleHRzZWN1cmUvV2ViQVBJJztcbmltcG9ydCAqIGFzIEtleUNoYW5nZUxpc3RlbmVyIGZyb20gJy4vdGV4dHNlY3VyZS9LZXlDaGFuZ2VMaXN0ZW5lcic7XG5pbXBvcnQgeyBSb3RhdGVTaWduZWRQcmVLZXlMaXN0ZW5lciB9IGZyb20gJy4vdGV4dHNlY3VyZS9Sb3RhdGVTaWduZWRQcmVLZXlMaXN0ZW5lcic7XG5pbXBvcnQgeyBpc0RpcmVjdENvbnZlcnNhdGlvbiwgaXNHcm91cFYyIH0gZnJvbSAnLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgQmFja09mZiwgRklCT05BQ0NJX1RJTUVPVVRTIH0gZnJvbSAnLi91dGlsL0JhY2tPZmYnO1xuaW1wb3J0IHsgQXBwVmlld1R5cGUgfSBmcm9tICcuL3N0YXRlL2R1Y2tzL2FwcCc7XG5pbXBvcnQgdHlwZSB7IEJhZGdlc1N0YXRlVHlwZSB9IGZyb20gJy4vc3RhdGUvZHVja3MvYmFkZ2VzJztcbmltcG9ydCB7IGJhZGdlSW1hZ2VGaWxlRG93bmxvYWRlciB9IGZyb20gJy4vYmFkZ2VzL2JhZGdlSW1hZ2VGaWxlRG93bmxvYWRlcic7XG5pbXBvcnQgeyBpc0luY29taW5nIH0gZnJvbSAnLi9zdGF0ZS9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgeyBhY3Rpb25DcmVhdG9ycyB9IGZyb20gJy4vc3RhdGUvYWN0aW9ucyc7XG5pbXBvcnQgeyBEZWxldGVzIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL0RlbGV0ZXMnO1xuaW1wb3J0IHtcbiAgTWVzc2FnZVJlY2VpcHRzLFxuICBNZXNzYWdlUmVjZWlwdFR5cGUsXG59IGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9NZXNzYWdlUmVjZWlwdHMnO1xuaW1wb3J0IHsgTWVzc2FnZVJlcXVlc3RzIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL01lc3NhZ2VSZXF1ZXN0cyc7XG5pbXBvcnQgeyBSZWFjdGlvbnMgfSBmcm9tICcuL21lc3NhZ2VNb2RpZmllcnMvUmVhY3Rpb25zJztcbmltcG9ydCB7IFJlYWRTeW5jcyB9IGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9SZWFkU3luY3MnO1xuaW1wb3J0IHsgVmlld1N5bmNzIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL1ZpZXdTeW5jcyc7XG5pbXBvcnQgeyBWaWV3T25jZU9wZW5TeW5jcyB9IGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9WaWV3T25jZU9wZW5TeW5jcyc7XG5pbXBvcnQgdHlwZSB7IERlbGV0ZUF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL0RlbGV0ZXMnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlUmVjZWlwdEF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL01lc3NhZ2VSZWNlaXB0cyc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VSZXF1ZXN0QXR0cmlidXRlc1R5cGUgfSBmcm9tICcuL21lc3NhZ2VNb2RpZmllcnMvTWVzc2FnZVJlcXVlc3RzJztcbmltcG9ydCB0eXBlIHsgUmVhZFN5bmNBdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9SZWFkU3luY3MnO1xuaW1wb3J0IHR5cGUgeyBWaWV3U3luY0F0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi9tZXNzYWdlTW9kaWZpZXJzL1ZpZXdTeW5jcyc7XG5pbXBvcnQgdHlwZSB7IFZpZXdPbmNlT3BlblN5bmNBdHRyaWJ1dGVzVHlwZSB9IGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9WaWV3T25jZU9wZW5TeW5jcyc7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgdHlwZSB7IFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgfSBmcm9tICcuL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgKiBhcyBBdHRhY2htZW50RG93bmxvYWRzIGZyb20gJy4vbWVzc2FnZU1vZGlmaWVycy9BdHRhY2htZW50RG93bmxvYWRzJztcbmltcG9ydCAqIGFzIENvbnZlcnNhdGlvbiBmcm9tICcuL3R5cGVzL0NvbnZlcnNhdGlvbic7XG5pbXBvcnQgKiBhcyBTdGlja2VycyBmcm9tICcuL3R5cGVzL1N0aWNrZXJzJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi9wcm90b2J1Zic7XG5pbXBvcnQgeyBvblJldHJ5UmVxdWVzdCwgb25EZWNyeXB0aW9uRXJyb3IgfSBmcm9tICcuL3V0aWwvaGFuZGxlUmV0cnknO1xuaW1wb3J0IHsgdGhlbWVDaGFuZ2VkIH0gZnJvbSAnLi9zaGltcy90aGVtZUNoYW5nZWQnO1xuaW1wb3J0IHsgY3JlYXRlSVBDRXZlbnRzIH0gZnJvbSAnLi91dGlsL2NyZWF0ZUlQQ0V2ZW50cyc7XG5pbXBvcnQgeyBSZW1vdmVBbGxDb25maWd1cmF0aW9uIH0gZnJvbSAnLi90eXBlcy9SZW1vdmVBbGxDb25maWd1cmF0aW9uJztcbmltcG9ydCB7IGlzVmFsaWRVdWlkLCBVVUlES2luZCwgVVVJRCB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBsb2FkUmVjZW50RW1vamlzIH0gZnJvbSAnLi91dGlsL2xvYWRSZWNlbnRFbW9qaXMnO1xuaW1wb3J0IHsgZGVsZXRlQWxsTG9ncyB9IGZyb20gJy4vdXRpbC9kZWxldGVBbGxMb2dzJztcbmltcG9ydCB7IFJlYWN0V3JhcHBlclZpZXcgfSBmcm9tICcuL3ZpZXdzL1JlYWN0V3JhcHBlclZpZXcnO1xuaW1wb3J0IHsgVG9hc3RDYXB0Y2hhRmFpbGVkIH0gZnJvbSAnLi9jb21wb25lbnRzL1RvYXN0Q2FwdGNoYUZhaWxlZCc7XG5pbXBvcnQgeyBUb2FzdENhcHRjaGFTb2x2ZWQgfSBmcm9tICcuL2NvbXBvbmVudHMvVG9hc3RDYXB0Y2hhU29sdmVkJztcbmltcG9ydCB7IFRvYXN0Q29udmVyc2F0aW9uQXJjaGl2ZWQgfSBmcm9tICcuL2NvbXBvbmVudHMvVG9hc3RDb252ZXJzYXRpb25BcmNoaXZlZCc7XG5pbXBvcnQgeyBUb2FzdENvbnZlcnNhdGlvblVuYXJjaGl2ZWQgfSBmcm9tICcuL2NvbXBvbmVudHMvVG9hc3RDb252ZXJzYXRpb25VbmFyY2hpdmVkJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4vdXRpbC9zaG93VG9hc3QnO1xuaW1wb3J0IHsgc3RhcnRJbnRlcmFjdGlvbk1vZGUgfSBmcm9tICcuL3dpbmRvd3Mvc3RhcnRJbnRlcmFjdGlvbk1vZGUnO1xuaW1wb3J0IHR5cGUgeyBNYWluV2luZG93U3RhdHNUeXBlIH0gZnJvbSAnLi93aW5kb3dzL2NvbnRleHQnO1xuaW1wb3J0IHsgZGVsaXZlcnlSZWNlaXB0c0pvYlF1ZXVlIH0gZnJvbSAnLi9qb2JzL2RlbGl2ZXJ5UmVjZWlwdHNKb2JRdWV1ZSc7XG5pbXBvcnQgeyB1cGRhdGVPdXJVc2VybmFtZUFuZFBuaSB9IGZyb20gJy4vdXRpbC91cGRhdGVPdXJVc2VybmFtZUFuZFBuaSc7XG5pbXBvcnQgeyBSZWFjdGlvblNvdXJjZSB9IGZyb20gJy4vcmVhY3Rpb25zL1JlYWN0aW9uU291cmNlJztcbmltcG9ydCB7IHNpbmdsZVByb3RvSm9iUXVldWUgfSBmcm9tICcuL2pvYnMvc2luZ2xlUHJvdG9Kb2JRdWV1ZSc7XG5pbXBvcnQgeyBnZXRJbml0aWFsU3RhdGUgfSBmcm9tICcuL3N0YXRlL2dldEluaXRpYWxTdGF0ZSc7XG5pbXBvcnQgeyBjb252ZXJzYXRpb25Kb2JRdWV1ZSB9IGZyb20gJy4vam9icy9jb252ZXJzYXRpb25Kb2JRdWV1ZSc7XG5pbXBvcnQgeyBTZWVuU3RhdHVzIH0gZnJvbSAnLi9NZXNzYWdlU2VlblN0YXR1cyc7XG5pbXBvcnQgTWVzc2FnZVNlbmRlciBmcm9tICcuL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuaW1wb3J0IHR5cGUgQWNjb3VudE1hbmFnZXIgZnJvbSAnLi90ZXh0c2VjdXJlL0FjY291bnRNYW5hZ2VyJztcbmltcG9ydCB7IG9uU3RvcnlSZWNpcGllbnRVcGRhdGUgfSBmcm9tICcuL3V0aWwvb25TdG9yeVJlY2lwaWVudFVwZGF0ZSc7XG5pbXBvcnQgeyB2YWxpZGF0ZUNvbnZlcnNhdGlvbiB9IGZyb20gJy4vdXRpbC92YWxpZGF0ZUNvbnZlcnNhdGlvbic7XG5cbmNvbnN0IE1BWF9BVFRBQ0hNRU5UX0RPV05MT0FEX0FHRSA9IDM2MDAgKiA3MiAqIDEwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc092ZXJIb3VySW50b1Bhc3QodGltZXN0YW1wOiBudW1iZXIpOiBib29sZWFuIHtcbiAgY29uc3QgSE9VUiA9IDEwMDAgKiA2MCAqIDYwO1xuICByZXR1cm4gaXNOdW1iZXIodGltZXN0YW1wKSAmJiBpc09sZGVyVGhhbih0aW1lc3RhbXAsIEhPVVIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYW51cFNlc3Npb25SZXNldHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNlc3Npb25SZXNldHMgPSB3aW5kb3cuc3RvcmFnZS5nZXQoXG4gICAgJ3Nlc3Npb25SZXNldHMnLFxuICAgIDxTZXNzaW9uUmVzZXRzVHlwZT57fVxuICApO1xuXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZXNzaW9uUmVzZXRzKTtcbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gc2Vzc2lvblJlc2V0c1trZXldO1xuICAgIGlmICghdGltZXN0YW1wIHx8IGlzT3ZlckhvdXJJbnRvUGFzdCh0aW1lc3RhbXApKSB7XG4gICAgICBkZWxldGUgc2Vzc2lvblJlc2V0c1trZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgYXdhaXQgd2luZG93LnN0b3JhZ2UucHV0KCdzZXNzaW9uUmVzZXRzJywgc2Vzc2lvblJlc2V0cyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydEFwcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbCA9IG5ldyB3aW5kb3cuU2lnbmFsUHJvdG9jb2xTdG9yZSgpO1xuXG4gIGlmICh3aW5kb3cuaW5pdGlhbFRoZW1lID09PSBUaGVtZVR5cGUubGlnaHQpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2xpZ2h0LXRoZW1lJyk7XG4gIH1cbiAgaWYgKHdpbmRvdy5pbml0aWFsVGhlbWUgPT09IFRoZW1lVHlwZS5kYXJrKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdkYXJrLXRoZW1lJyk7XG4gIH1cblxuICBjb25zdCBpZGxlRGV0ZWN0b3IgPSBuZXcgSWRsZURldGVjdG9yKCk7XG5cbiAgYXdhaXQgS2V5Ym9hcmRMYXlvdXQuaW5pdGlhbGl6ZSgpO1xuXG4gIHdpbmRvdy5XaGlzcGVyLmV2ZW50cyA9IHdpbmRvdy5fLmNsb25lKHdpbmRvdy5CYWNrYm9uZS5FdmVudHMpO1xuICB3aW5kb3cuU2lnbmFsLlV0aWwuTWVzc2FnZUNvbnRyb2xsZXIuaW5zdGFsbCgpO1xuICB3aW5kb3cuU2lnbmFsLmNvbnZlcnNhdGlvbkNvbnRyb2xsZXJTdGFydCgpO1xuICB3aW5kb3cuc3RhcnR1cFByb2Nlc3NpbmdRdWV1ZSA9IG5ldyB3aW5kb3cuU2lnbmFsLlV0aWwuU3RhcnR1cFF1ZXVlKCk7XG4gIG5vdGlmaWNhdGlvblNlcnZpY2UuaW5pdGlhbGl6ZSh7XG4gICAgaTE4bjogd2luZG93LmkxOG4sXG4gICAgc3RvcmFnZTogd2luZG93LnN0b3JhZ2UsXG4gIH0pO1xuICB3aW5kb3cuYXR0YWNobWVudERvd25sb2FkUXVldWUgPSBbXTtcblxuICBhd2FpdCB3aW5kb3cuU2lnbmFsLlV0aWwuaW5pdGlhbGl6ZU1lc3NhZ2VDb3VudGVyKCk7XG5cbiAgbGV0IGluaXRpYWxCYWRnZXNTdGF0ZTogQmFkZ2VzU3RhdGVUeXBlID0geyBieUlkOiB7fSB9O1xuICBhc3luYyBmdW5jdGlvbiBsb2FkSW5pdGlhbEJhZGdlc1N0YXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGluaXRpYWxCYWRnZXNTdGF0ZSA9IHtcbiAgICAgIGJ5SWQ6IHdpbmRvdy5TaWduYWwuVXRpbC5tYWtlTG9va3VwKFxuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0QWxsQmFkZ2VzKCksXG4gICAgICAgICdpZCdcbiAgICAgICksXG4gICAgfTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgV2ViQVBJIGFzIGVhcmx5IGFzIHBvc3NpYmxlXG4gIGxldCBzZXJ2ZXI6IFdlYkFQSVR5cGUgfCB1bmRlZmluZWQ7XG4gIGxldCBtZXNzYWdlUmVjZWl2ZXI6IE1lc3NhZ2VSZWNlaXZlciB8IHVuZGVmaW5lZDtcbiAgbGV0IGNoYWxsZW5nZUhhbmRsZXI6IENoYWxsZW5nZUhhbmRsZXIgfCB1bmRlZmluZWQ7XG4gIGxldCByb3V0aW5lUHJvZmlsZVJlZnJlc2hlcjogUm91dGluZVByb2ZpbGVSZWZyZXNoZXIgfCB1bmRlZmluZWQ7XG5cbiAgd2luZG93LnN0b3JhZ2Uub25yZWFkeSgoKSA9PiB7XG4gICAgc2VydmVyID0gd2luZG93LldlYkFQSS5jb25uZWN0KFxuICAgICAgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFdlYkFQSUNyZWRlbnRpYWxzKClcbiAgICApO1xuICAgIHdpbmRvdy50ZXh0c2VjdXJlLnNlcnZlciA9IHNlcnZlcjtcblxuICAgIGluaXRpYWxpemVBbGxKb2JRdWV1ZXMoe1xuICAgICAgc2VydmVyLFxuICAgIH0pO1xuXG4gICAgY2hhbGxlbmdlSGFuZGxlciA9IG5ldyBDaGFsbGVuZ2VIYW5kbGVyKHtcbiAgICAgIHN0b3JhZ2U6IHdpbmRvdy5zdG9yYWdlLFxuXG4gICAgICBzdGFydFF1ZXVlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpIHtcbiAgICAgICAgY29udmVyc2F0aW9uSm9iUXVldWUucmVzb2x2ZVZlcmlmaWNhdGlvbldhaXRlcihjb252ZXJzYXRpb25JZCk7XG4gICAgICB9LFxuXG4gICAgICByZXF1ZXN0Q2hhbGxlbmdlKHJlcXVlc3QpIHtcbiAgICAgICAgd2luZG93LnNlbmRDaGFsbGVuZ2VSZXF1ZXN0KHJlcXVlc3QpO1xuICAgICAgfSxcblxuICAgICAgYXN5bmMgc2VuZENoYWxsZW5nZVJlc3BvbnNlKGRhdGEpIHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgICAgICBpZiAoIW1lc3NhZ2luZykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2VuZENoYWxsZW5nZVJlc3BvbnNlOiBtZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZSEnKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBtZXNzYWdpbmcuc2VuZENoYWxsZW5nZVJlc3BvbnNlKGRhdGEpO1xuICAgICAgfSxcblxuICAgICAgb25DaGFsbGVuZ2VGYWlsZWQoKSB7XG4gICAgICAgIC8vIFRPRE86IERFU0tUT1AtMTUzMFxuICAgICAgICAvLyBEaXNwbGF5IGh1bWFuaXplZCBgcmV0cnlBZnRlcmBcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0Q2FwdGNoYUZhaWxlZCk7XG4gICAgICB9LFxuXG4gICAgICBvbkNoYWxsZW5nZVNvbHZlZCgpIHtcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0Q2FwdGNoYVNvbHZlZCk7XG4gICAgICB9LFxuXG4gICAgICBzZXRDaGFsbGVuZ2VTdGF0dXMoY2hhbGxlbmdlU3RhdHVzKSB7XG4gICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMubmV0d29yay5zZXRDaGFsbGVuZ2VTdGF0dXMoY2hhbGxlbmdlU3RhdHVzKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ2NoYWxsZW5nZVJlc3BvbnNlJywgcmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKCFjaGFsbGVuZ2VIYW5kbGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2hhbGxlbmdlIGhhbmRsZXIgdG8gYmUgdGhlcmUnKTtcbiAgICAgIH1cblxuICAgICAgY2hhbGxlbmdlSGFuZGxlci5vblJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5TaWduYWwuY2hhbGxlbmdlSGFuZGxlciA9IGNoYWxsZW5nZUhhbmRsZXI7XG5cbiAgICBsb2cuaW5mbygnSW5pdGlhbGl6aW5nIE1lc3NhZ2VSZWNlaXZlcicpO1xuICAgIG1lc3NhZ2VSZWNlaXZlciA9IG5ldyBNZXNzYWdlUmVjZWl2ZXIoe1xuICAgICAgc2VydmVyLFxuICAgICAgc3RvcmFnZTogd2luZG93LnN0b3JhZ2UsXG4gICAgICBzZXJ2ZXJUcnVzdFJvb3Q6IHdpbmRvdy5nZXRTZXJ2ZXJUcnVzdFJvb3QoKSxcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHF1ZXVlZEV2ZW50TGlzdGVuZXI8QXJncyBleHRlbmRzIEFycmF5PHVua25vd24+PihcbiAgICAgIGhhbmRsZXI6ICguLi5hcmdzOiBBcmdzKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZCxcbiAgICAgIHRyYWNrID0gdHJ1ZVxuICAgICk6ICguLi5hcmdzOiBBcmdzKSA9PiB2b2lkIHtcbiAgICAgIHJldHVybiAoLi4uYXJnczogQXJncyk6IHZvaWQgPT4ge1xuICAgICAgICBldmVudEhhbmRsZXJRdWV1ZS5hZGQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAvLyBtZXNzYWdlL3NlbnQ6IE1lc3NhZ2UuaGFuZGxlRGF0YU1lc3NhZ2UgaGFzIGl0cyBvd24gcXVldWUgYW5kIHdpbGxcbiAgICAgICAgICAgIC8vICAgdHJpZ2dlciB0aGlzIGV2ZW50IGl0c2VsZiB3aGVuIGNvbXBsZXRlLlxuICAgICAgICAgICAgLy8gZXJyb3I6IEVycm9yIHByb2Nlc3NpbmcgKGJlbG93KSBhbHNvIGhhcyBpdHMgb3duIHF1ZXVlIGFuZCBzZWxmLXRyaWdnZXIuXG4gICAgICAgICAgICBpZiAodHJhY2spIHtcbiAgICAgICAgICAgICAgd2luZG93LldoaXNwZXIuZXZlbnRzLnRyaWdnZXIoJ2luY3JlbWVudFByb2dyZXNzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZW52ZWxvcGUnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvbkVudmVsb3BlUmVjZWl2ZWQsIGZhbHNlKVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnbWVzc2FnZScsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uTWVzc2FnZVJlY2VpdmVkLCBmYWxzZSlcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RlbGl2ZXJ5JyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25EZWxpdmVyeVJlY2VpcHQpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjb250YWN0JyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25Db250YWN0UmVjZWl2ZWQsIGZhbHNlKVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY29udGFjdFN5bmMnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvbkNvbnRhY3RTeW5jQ29tcGxldGUpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdncm91cCcsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uR3JvdXBSZWNlaXZlZClcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2dyb3VwU3luYycsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uR3JvdXBTeW5jQ29tcGxldGUpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdzZW50JyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25TZW50TWVzc2FnZSwgZmFsc2UpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdyZWFkU3luYycsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uUmVhZFN5bmMpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICd2aWV3U3luYycsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uVmlld1N5bmMpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdyZWFkJyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25SZWFkUmVjZWlwdClcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ3ZpZXcnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvblZpZXdSZWNlaXB0KVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZXJyb3InLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvbkVycm9yLCBmYWxzZSlcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2RlY3J5cHRpb24tZXJyb3InLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcigoZXZlbnQ6IERlY3J5cHRpb25FcnJvckV2ZW50KSA9PiB7XG4gICAgICAgIG9uRGVjcnlwdGlvbkVycm9yUXVldWUuYWRkKCgpID0+IG9uRGVjcnlwdGlvbkVycm9yKGV2ZW50KSk7XG4gICAgICB9KVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncmV0cnktcmVxdWVzdCcsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKChldmVudDogUmV0cnlSZXF1ZXN0RXZlbnQpID0+IHtcbiAgICAgICAgb25SZXRyeVJlcXVlc3RRdWV1ZS5hZGQoKCkgPT4gb25SZXRyeVJlcXVlc3QoZXZlbnQpKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcignZW1wdHknLCBxdWV1ZWRFdmVudExpc3RlbmVyKG9uRW1wdHkpKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjb25maWd1cmF0aW9uJyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25Db25maWd1cmF0aW9uKVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3R5cGluZycsIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25UeXBpbmcpKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdzdGlja2VyLXBhY2snLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvblN0aWNrZXJQYWNrKVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAndmlld09uY2VPcGVuU3luYycsXG4gICAgICBxdWV1ZWRFdmVudExpc3RlbmVyKG9uVmlld09uY2VPcGVuU3luYylcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ21lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvbk1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UpXG4gICAgKTtcbiAgICBtZXNzYWdlUmVjZWl2ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdwcm9maWxlS2V5VXBkYXRlJyxcbiAgICAgIHF1ZXVlZEV2ZW50TGlzdGVuZXIob25Qcm9maWxlS2V5VXBkYXRlKVxuICAgICk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZmV0Y2hMYXRlc3QnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvbkZldGNoTGF0ZXN0U3luYylcbiAgICApO1xuICAgIG1lc3NhZ2VSZWNlaXZlci5hZGRFdmVudExpc3RlbmVyKCdrZXlzJywgcXVldWVkRXZlbnRMaXN0ZW5lcihvbktleXNTeW5jKSk7XG4gICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnc3RvcnlSZWNpcGllbnRVcGRhdGUnLFxuICAgICAgcXVldWVkRXZlbnRMaXN0ZW5lcihvblN0b3J5UmVjaXBpZW50VXBkYXRlLCBmYWxzZSlcbiAgICApO1xuICB9KTtcblxuICBvdXJQcm9maWxlS2V5U2VydmljZS5pbml0aWFsaXplKHdpbmRvdy5zdG9yYWdlKTtcblxuICB3aW5kb3cuc3RvcmFnZS5vbnJlYWR5KCgpID0+IHtcbiAgICBpZiAoIXdpbmRvdy5zdG9yYWdlLmdldCgnZGVmYXVsdENvbnZlcnNhdGlvbkNvbG9yJykpIHtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dChcbiAgICAgICAgJ2RlZmF1bHRDb252ZXJzYXRpb25Db2xvcicsXG4gICAgICAgIERFRkFVTFRfQ09OVkVSU0FUSU9OX0NPTE9SXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IHJlc29sdmVPbkFwcFZpZXc6ICgoKSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgb25BcHBWaWV3ID0gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgcmVzb2x2ZU9uQXBwVmlldyA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIGNvbnN0IHJlY29ubmVjdEJhY2tPZmYgPSBuZXcgQmFja09mZihGSUJPTkFDQ0lfVElNRU9VVFMpO1xuXG4gIHdpbmRvdy5zdG9yYWdlLm9ucmVhZHkoKCkgPT4ge1xuICAgIHN0cmljdEFzc2VydChzZXJ2ZXIsICdXZWJBUEkgbm90IHJlYWR5Jyk7XG5cbiAgICBzZW5kZXJDZXJ0aWZpY2F0ZVNlcnZpY2UuaW5pdGlhbGl6ZSh7XG4gICAgICBzZXJ2ZXIsXG4gICAgICBuYXZpZ2F0b3IsXG4gICAgICBvbmxpbmVFdmVudFRhcmdldDogd2luZG93LFxuICAgICAgc3RvcmFnZTogd2luZG93LnN0b3JhZ2UsXG4gICAgfSk7XG5cbiAgICBhcmVXZUFTdWJzY3JpYmVyU2VydmljZS51cGRhdGUod2luZG93LnN0b3JhZ2UsIHNlcnZlcik7XG4gIH0pO1xuXG4gIGNvbnN0IGV2ZW50SGFuZGxlclF1ZXVlID0gbmV3IHdpbmRvdy5QUXVldWUoe1xuICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgIHRpbWVvdXQ6IGR1cmF0aW9ucy5NSU5VVEUgKiAzMCxcbiAgfSk7XG5cbiAgLy8gTm90ZTogdGhpcyBxdWV1ZSBpcyBtZWFudCB0byBhbGxvdyBmb3Igc3RvcC9zdGFydCBvZiB0YXNrcywgbm90IGxpbWl0IHBhcmFsbGVsaXNtLlxuICBjb25zdCBwcm9maWxlS2V5UmVzcG9uc2VRdWV1ZSA9IG5ldyB3aW5kb3cuUFF1ZXVlKCk7XG4gIHByb2ZpbGVLZXlSZXNwb25zZVF1ZXVlLnBhdXNlKCk7XG5cbiAgY29uc3QgbGlnaHRTZXNzaW9uUmVzZXRRdWV1ZSA9IG5ldyB3aW5kb3cuUFF1ZXVlKHsgY29uY3VycmVuY3k6IDEgfSk7XG4gIHdpbmRvdy5TaWduYWwuU2VydmljZXMubGlnaHRTZXNzaW9uUmVzZXRRdWV1ZSA9IGxpZ2h0U2Vzc2lvblJlc2V0UXVldWU7XG4gIGxpZ2h0U2Vzc2lvblJlc2V0UXVldWUucGF1c2UoKTtcblxuICBjb25zdCBvbkRlY3J5cHRpb25FcnJvclF1ZXVlID0gbmV3IHdpbmRvdy5QUXVldWUoeyBjb25jdXJyZW5jeTogMSB9KTtcbiAgb25EZWNyeXB0aW9uRXJyb3JRdWV1ZS5wYXVzZSgpO1xuXG4gIGNvbnN0IG9uUmV0cnlSZXF1ZXN0UXVldWUgPSBuZXcgd2luZG93LlBRdWV1ZSh7IGNvbmN1cnJlbmN5OiAxIH0pO1xuICBvblJldHJ5UmVxdWVzdFF1ZXVlLnBhdXNlKCk7XG5cbiAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0UXVldWUgPSBuZXcgd2luZG93LlBRdWV1ZSh7XG4gICAgY29uY3VycmVuY3k6IDEsXG4gICAgdGltZW91dDogZHVyYXRpb25zLk1JTlVURSAqIDMwLFxuICB9KTtcbiAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0UXVldWUucGF1c2UoKTtcbiAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0QmF0Y2hlciA9XG4gICAgd2luZG93LlNpZ25hbC5VdGlsLmNyZWF0ZUJhdGNoZXI8UmVjZWlwdD4oe1xuICAgICAgbmFtZTogJ1doaXNwZXIuZGVsaXZlcnlSZWNlaXB0QmF0Y2hlcicsXG4gICAgICB3YWl0OiA1MDAsXG4gICAgICBtYXhTaXplOiAxMDAsXG4gICAgICBwcm9jZXNzQmF0Y2g6IGFzeW5jIGRlbGl2ZXJ5UmVjZWlwdHMgPT4ge1xuICAgICAgICBhd2FpdCBkZWxpdmVyeVJlY2VpcHRzSm9iUXVldWUuYWRkKHsgZGVsaXZlcnlSZWNlaXB0cyB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgaWYgKHdpbmRvdy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAoaXNXaW5kb3dEcmFnRWxlbWVudCh0YXJnZXQpKSB7XG4gICAgICAgIHdpbmRvdy50aXRsZUJhckRvdWJsZUNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBHbG9iYWxseSBkaXNhYmxlIGRyYWcgYW5kIGRyb3BcbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICdkcmFnb3ZlcicsXG4gICAgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG4gICAgZmFsc2VcbiAgKTtcbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICdkcm9wJyxcbiAgICBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcbiAgICBmYWxzZVxuICApO1xuXG4gIHN0YXJ0SW50ZXJhY3Rpb25Nb2RlKCk7XG5cbiAgLy8gTG9hZCB0aGVzZSBpbWFnZXMgbm93IHRvIGVuc3VyZSB0aGF0IHRoZXkgZG9uJ3QgZmxpY2tlciBvbiBmaXJzdCB1c2VcbiAgd2luZG93LnByZWxvYWRlZEltYWdlcyA9IFtdO1xuICBmdW5jdGlvbiBwcmVsb2FkKGxpc3Q6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPikge1xuICAgIGZvciAobGV0IGluZGV4ID0gMCwgbWF4ID0gbGlzdC5sZW5ndGg7IGluZGV4IDwgbWF4OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2Uuc3JjID0gYC4vaW1hZ2VzLyR7bGlzdFtpbmRleF19YDtcbiAgICAgIHdpbmRvdy5wcmVsb2FkZWRJbWFnZXMucHVzaChpbWFnZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnVpbHRJbkltYWdlcyA9IGF3YWl0IHdpbmRvdy5nZXRCdWlsdEluSW1hZ2VzKCk7XG4gIHByZWxvYWQoYnVpbHRJbkltYWdlcyk7XG5cbiAgLy8gV2UgYWRkIHRoaXMgdG8gd2luZG93IGhlcmUgYmVjYXVzZSB0aGUgZGVmYXVsdCBOb2RlIGNvbnRleHQgaXMgZXJhc2VkIGF0IHRoZSBlbmRcbiAgLy8gICBvZiBwcmVsb2FkLmpzIHByb2Nlc3NpbmdcbiAgd2luZG93LnNldEltbWVkaWF0ZSA9IHdpbmRvdy5ub2RlU2V0SW1tZWRpYXRlO1xuXG4gIGNvbnN0IHsgTWVzc2FnZSB9ID0gd2luZG93LlNpZ25hbC5UeXBlcztcbiAgY29uc3Qge1xuICAgIHVwZ3JhZGVNZXNzYWdlU2NoZW1hLFxuICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGEsXG4gICAgZGVsZXRlQXR0YWNobWVudERhdGEsXG4gICAgZG9lc0F0dGFjaG1lbnRFeGlzdCxcbiAgfSA9IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucztcblxuICBsb2cuaW5mbygnYmFja2dyb3VuZCBwYWdlIHJlbG9hZGVkJyk7XG4gIGxvZy5pbmZvKCdlbnZpcm9ubWVudDonLCB3aW5kb3cuZ2V0RW52aXJvbm1lbnQoKSk7XG5cbiAgbGV0IG5ld1ZlcnNpb24gPSBmYWxzZTtcbiAgbGV0IGxhc3RWZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgd2luZG93LmRvY3VtZW50LnRpdGxlID0gd2luZG93LmdldFRpdGxlKCk7XG5cbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcbiAgICAnbGFuZycsXG4gICAgd2luZG93LmdldExvY2FsZSgpLnN1YnN0cmluZygwLCAyKVxuICApO1xuXG4gIEtleUNoYW5nZUxpc3RlbmVyLmluaXQod2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbCk7XG4gIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wub24oJ3JlbW92ZVByZUtleScsIChvdXJVdWlkOiBVVUlEKSA9PiB7XG4gICAgY29uc3QgdXVpZEtpbmQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0T3VyVXVpZEtpbmQob3VyVXVpZCk7XG4gICAgd2luZG93LmdldEFjY291bnRNYW5hZ2VyKCkucmVmcmVzaFByZUtleXModXVpZEtpbmQpO1xuICB9KTtcblxuICB3aW5kb3cuZ2V0U29ja2V0U3RhdHVzID0gKCkgPT4ge1xuICAgIGlmIChzZXJ2ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFNvY2tldFN0YXR1cy5DTE9TRUQ7XG4gICAgfVxuICAgIHJldHVybiBzZXJ2ZXIuZ2V0U29ja2V0U3RhdHVzKCk7XG4gIH07XG4gIGxldCBhY2NvdW50TWFuYWdlcjogQWNjb3VudE1hbmFnZXI7XG4gIHdpbmRvdy5nZXRBY2NvdW50TWFuYWdlciA9ICgpID0+IHtcbiAgICBpZiAoYWNjb3VudE1hbmFnZXIpIHtcbiAgICAgIHJldHVybiBhY2NvdW50TWFuYWdlcjtcbiAgICB9XG4gICAgaWYgKCFzZXJ2ZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0QWNjb3VudE1hbmFnZXI6IHNlcnZlciBpcyBub3QgYXZhaWxhYmxlIScpO1xuICAgIH1cblxuICAgIGFjY291bnRNYW5hZ2VyID0gbmV3IHdpbmRvdy50ZXh0c2VjdXJlLkFjY291bnRNYW5hZ2VyKHNlcnZlcik7XG4gICAgYWNjb3VudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcigncmVnaXN0cmF0aW9uJywgKCkgPT4ge1xuICAgICAgd2luZG93LldoaXNwZXIuZXZlbnRzLnRyaWdnZXIoJ3VzZXJDaGFuZ2VkJywgZmFsc2UpO1xuXG4gICAgICB3aW5kb3cuU2lnbmFsLlV0aWwuUmVnaXN0cmF0aW9uLm1hcmtEb25lKCk7XG4gICAgICBsb2cuaW5mbygnZGlzcGF0Y2hpbmcgcmVnaXN0cmF0aW9uIGV2ZW50Jyk7XG4gICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcigncmVnaXN0cmF0aW9uX2RvbmUnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjb3VudE1hbmFnZXI7XG4gIH07XG5cbiAgY29uc3QgY2FuY2VsSW5pdGlhbGl6YXRpb25NZXNzYWdlID0gc2V0QXBwTG9hZGluZ1NjcmVlbk1lc3NhZ2UoXG4gICAgdW5kZWZpbmVkLFxuICAgIHdpbmRvdy5pMThuXG4gICk7XG5cbiAgY29uc3QgdmVyc2lvbiA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJdGVtQnlJZCgndmVyc2lvbicpO1xuICBpZiAoIXZlcnNpb24pIHtcbiAgICBjb25zdCBpc0luZGV4ZWREQlByZXNlbnQgPSBhd2FpdCBpbmRleGVkRGIuZG9lc0RhdGFiYXNlRXhpc3QoKTtcbiAgICBpZiAoaXNJbmRleGVkREJQcmVzZW50KSB7XG4gICAgICBsb2cuaW5mbygnRm91bmQgSW5kZXhlZERCIGRhdGFiYXNlLicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbG9nLmluZm8oJ0NvbmZpcm1pbmcgZGVsZXRpb24gb2Ygb2xkIGRhdGEgd2l0aCB1c2VyLi4uJyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cuc2hvd0NvbmZpcm1hdGlvbkRpYWxvZyh7XG4gICAgICAgICAgICAgIG9uVG9wT2ZFdmVyeXRoaW5nOiB0cnVlLFxuICAgICAgICAgICAgICBjYW5jZWxUZXh0OiB3aW5kb3cuaTE4bigncXVpdCcpLFxuICAgICAgICAgICAgICBjb25maXJtU3R5bGU6ICduZWdhdGl2ZScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IHdpbmRvdy5pMThuKCdkZWxldGVPbGRJbmRleGVkREJEYXRhJyksXG4gICAgICAgICAgICAgIG9rVGV4dDogd2luZG93LmkxOG4oJ2RlbGV0ZU9sZERhdGEnKSxcbiAgICAgICAgICAgICAgcmVqZWN0OiAoKSA9PiByZWplY3QoKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZTogKCkgPT4gcmVzb2x2ZSgpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAnVXNlciBjaG9zZSBub3QgdG8gZGVsZXRlIG9sZCBkYXRhLiBTaHV0dGluZyBkb3duLicsXG4gICAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICAgIHdpbmRvdy5zaHV0ZG93bigpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKCdEZWxldGluZyBhbGwgcHJldmlvdXNseS1taWdyYXRlZCBkYXRhIGluIFNRTC4uLicpO1xuICAgICAgICBsb2cuaW5mbygnRGVsZXRpbmcgSW5kZXhlZERCIGZpbGUuLi4nKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgaW5kZXhlZERiLnJlbW92ZURhdGFiYXNlKCksXG4gICAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUFsbCgpLFxuICAgICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVJbmRleGVkREJGaWxlcygpLFxuICAgICAgICBdKTtcbiAgICAgICAgbG9nLmluZm8oJ0RvbmUgd2l0aCBTUUwgZGVsZXRpb24gYW5kIEluZGV4ZWREQiBmaWxlIGRlbGV0aW9uLicpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdGYWlsZWQgdG8gcmVtb3ZlIEluZGV4ZWREQiBmaWxlIG9yIHJlbW92ZSBTUUwgZGF0YTonLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgYSBmbGFnIHRvIGRlbGV0ZSBJbmRleGVkREIgb24gbmV4dCBzdGFydHVwIGlmIGl0IHdhc24ndCBkZWxldGVkIGp1c3Qgbm93LlxuICAgICAgLy8gV2UgbmVlZCB0byB1c2UgZGlyZWN0IGRhdGEgY2FsbHMsIHNpbmNlIHdpbmRvdy5zdG9yYWdlIGlzbid0IHJlYWR5IHlldC5cbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jcmVhdGVPclVwZGF0ZUl0ZW0oe1xuICAgICAgICBpZDogJ2luZGV4ZWRkYi1kZWxldGUtbmVlZGVkJyxcbiAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBsb2cuaW5mbygnU3RvcmFnZSBmZXRjaCcpO1xuICB3aW5kb3cuc3RvcmFnZS5mZXRjaCgpO1xuXG4gIGZ1bmN0aW9uIG1hcE9sZFRoZW1lVG9OZXcoXG4gICAgdGhlbWU6IFJlYWRvbmx5PFxuICAgICAgJ3N5c3RlbScgfCAnbGlnaHQnIHwgJ2RhcmsnIHwgJ2FuZHJvaWQnIHwgJ2lvcycgfCAnYW5kcm9pZC1kYXJrJ1xuICAgID5cbiAgKTogJ3N5c3RlbScgfCAnbGlnaHQnIHwgJ2RhcmsnIHtcbiAgICBzd2l0Y2ggKHRoZW1lKSB7XG4gICAgICBjYXNlICdkYXJrJzpcbiAgICAgIGNhc2UgJ2xpZ2h0JzpcbiAgICAgIGNhc2UgJ3N5c3RlbSc6XG4gICAgICAgIHJldHVybiB0aGVtZTtcbiAgICAgIGNhc2UgJ2FuZHJvaWQtZGFyayc6XG4gICAgICAgIHJldHVybiAnZGFyayc7XG4gICAgICBjYXNlICdhbmRyb2lkJzpcbiAgICAgIGNhc2UgJ2lvcyc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ2xpZ2h0JztcbiAgICB9XG4gIH1cblxuICAvLyBXZSBuZWVkIHRoaXMgJ2ZpcnN0JyBjaGVjayBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gc3RhcnQgdGhlIGFwcCB1cCBhbnkgb3RoZXIgdGltZVxuICAvLyAgIHRoYW4gdGhlIGZpcnN0IHRpbWUuIEFuZCB3aW5kb3cuc3RvcmFnZS5mZXRjaCgpIHdpbGwgY2F1c2Ugb25yZWFkeSgpIHRvIGZpcmUuXG4gIGxldCBmaXJzdCA9IHRydWU7XG4gIHdpbmRvdy5zdG9yYWdlLm9ucmVhZHkoYXN5bmMgKCkgPT4ge1xuICAgIGlmICghZmlyc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlyc3QgPSBmYWxzZTtcblxuICAgIHN0cmljdEFzc2VydChzZXJ2ZXIgIT09IHVuZGVmaW5lZCwgJ1dlYkFQSSBub3QgcmVhZHknKTtcblxuICAgIGNsZWFudXBTZXNzaW9uUmVzZXRzKCk7XG5cbiAgICAvLyBUaGVzZSBtYWtlIGtleSBvcGVyYXRpb25zIGF2YWlsYWJsZSB0byBJUEMgaGFuZGxlcnMgY3JlYXRlZCBpbiBwcmVsb2FkLmpzXG4gICAgd2luZG93LkV2ZW50cyA9IGNyZWF0ZUlQQ0V2ZW50cyh7XG4gICAgICBzaHV0ZG93bjogYXN5bmMgKCkgPT4ge1xuICAgICAgICBsb2cuaW5mbygnYmFja2dyb3VuZC9zaHV0ZG93bicpO1xuXG4gICAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5mbHVzaE1lc3NhZ2VDb3VudGVyKCk7XG5cbiAgICAgICAgLy8gU3RvcCBiYWNrZ3JvdW5kIHByb2Nlc3NpbmdcbiAgICAgICAgQXR0YWNobWVudERvd25sb2Fkcy5zdG9wKCk7XG4gICAgICAgIGlkbGVEZXRlY3Rvci5zdG9wKCk7XG5cbiAgICAgICAgLy8gU3RvcCBwcm9jZXNzaW5nIGluY29taW5nIG1lc3NhZ2VzXG4gICAgICAgIGlmIChtZXNzYWdlUmVjZWl2ZXIpIHtcbiAgICAgICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgICAgICBzZXJ2ZXIgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICdXZWJBUEkgc2hvdWxkIGJlIGluaXRpYWxpemVkIHRvZ2V0aGVyIHdpdGggTWVzc2FnZVJlY2VpdmVyJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgbG9nLmluZm8oJ2JhY2tncm91bmQvc2h1dGRvd246IHNodXR0aW5nIGRvd24gbWVzc2FnZVJlY2VpdmVyJyk7XG4gICAgICAgICAgc2VydmVyLnVucmVnaXN0ZXJSZXF1ZXN0SGFuZGxlcihtZXNzYWdlUmVjZWl2ZXIpO1xuICAgICAgICAgIG1lc3NhZ2VSZWNlaXZlci5zdG9wUHJvY2Vzc2luZygpO1xuICAgICAgICAgIGF3YWl0IHdpbmRvdy53YWl0Rm9yQWxsQmF0Y2hlcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKCdiYWNrZ3JvdW5kL3NodXRkb3duOiBmbHVzaGluZyBjb252ZXJzYXRpb25zJyk7XG5cbiAgICAgICAgLy8gRmx1c2ggZGVib3VuY2VkIHVwZGF0ZXMgZm9yIGNvbnZlcnNhdGlvbnNcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0QWxsKCkubWFwKGNvbnZvID0+XG4gICAgICAgICAgICBjb252by5mbHVzaERlYm91bmNlZFVwZGF0ZXMoKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcblxuICAgICAgICBsb2cuaW5mbygnYmFja2dyb3VuZC9zaHV0ZG93bjogd2FpdGluZyBmb3IgYWxsIGJhdGNoZXJzJyk7XG5cbiAgICAgICAgLy8gQSBudW1iZXIgb2Ygc3RpbGwtdG8tcXVldWUgZGF0YWJhc2UgcXVlcmllcyBtaWdodCBiZSB3YWl0aW5nIGluc2lkZSBiYXRjaGVycy5cbiAgICAgICAgLy8gICBXZSB3YWl0IGZvciB0aGVzZSB0byBlbXB0eSBmaXJzdCwgYW5kIHRoZW4gc2h1dCBkb3duIHRoZSBkYXRhIGludGVyZmFjZS5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIHdpbmRvdy53YWl0Rm9yQWxsQmF0Y2hlcnMoKSxcbiAgICAgICAgICB3aW5kb3cud2FpdEZvckFsbFdhaXRCYXRjaGVycygpLFxuICAgICAgICBdKTtcblxuICAgICAgICBsb2cuaW5mbygnYmFja2dyb3VuZC9zaHV0ZG93bjogY2xvc2luZyB0aGUgZGF0YWJhc2UnKTtcblxuICAgICAgICAvLyBTaHV0IGRvd24gdGhlIGRhdGEgaW50ZXJmYWNlIGNsZWFubHlcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNodXRkb3duKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHdpbmRvdy5FdmVudHMuZ2V0Wm9vbUZhY3RvcigpO1xuICAgIHdlYkZyYW1lLnNldFpvb21GYWN0b3Ioem9vbUZhY3Rvcik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS16b29tLWZhY3RvcicsIHpvb21GYWN0b3IudG9TdHJpbmcoKSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgJy0tem9vbS1mYWN0b3InLFxuICAgICAgICB3ZWJGcmFtZS5nZXRab29tRmFjdG9yKCkudG9TdHJpbmcoKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIEhvdyBsb25nIHNpbmNlIHdlIHdlcmUgbGFzdCBydW5uaW5nP1xuICAgIGNvbnN0IGxhc3RIZWFydGJlYXQgPSB0b0RheU1pbGxpcyh3aW5kb3cuc3RvcmFnZS5nZXQoJ2xhc3RIZWFydGJlYXQnLCAwKSk7XG4gICAgY29uc3QgcHJldmlvdXNMYXN0U3RhcnR1cCA9IHdpbmRvdy5zdG9yYWdlLmdldCgnbGFzdFN0YXJ0dXAnKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wdXQoJ2xhc3RTdGFydHVwJywgRGF0ZS5ub3coKSk7XG5cbiAgICBjb25zdCBUSElSVFlfREFZUyA9IDMwICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBpZiAobGFzdEhlYXJ0YmVhdCA+IDAgJiYgaXNPbGRlclRoYW4obGFzdEhlYXJ0YmVhdCwgVEhJUlRZX0RBWVMpKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYFRoaXMgaW5zdGFuY2UgaGFzIG5vdCBiZWVuIHVzZWQgZm9yIDMwIGRheXMuIExhc3QgaGVhcnRiZWF0OiAke2xhc3RIZWFydGJlYXR9LiBMYXN0IHN0YXJ0dXA6ICR7cHJldmlvdXNMYXN0U3RhcnR1cH0uYFxuICAgICAgKTtcbiAgICAgIGF3YWl0IHVubGlua0FuZERpc2Nvbm5lY3QoUmVtb3ZlQWxsQ29uZmlndXJhdGlvbi5Tb2Z0KTtcbiAgICB9XG5cbiAgICAvLyBTdGFydCBoZWFydGJlYXQgdGltZXJcbiAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ2xhc3RIZWFydGJlYXQnLCB0b0RheU1pbGxpcyhEYXRlLm5vdygpKSk7XG4gICAgY29uc3QgVFdFTFZFX0hPVVJTID0gMTIgKiA2MCAqIDYwICogMTAwMDtcbiAgICBzZXRJbnRlcnZhbChcbiAgICAgICgpID0+IHdpbmRvdy5zdG9yYWdlLnB1dCgnbGFzdEhlYXJ0YmVhdCcsIHRvRGF5TWlsbGlzKERhdGUubm93KCkpKSxcbiAgICAgIFRXRUxWRV9IT1VSU1xuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50VmVyc2lvbiA9IHdpbmRvdy5nZXRWZXJzaW9uKCk7XG4gICAgbGFzdFZlcnNpb24gPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ3ZlcnNpb24nKTtcbiAgICBuZXdWZXJzaW9uID0gIWxhc3RWZXJzaW9uIHx8IGN1cnJlbnRWZXJzaW9uICE9PSBsYXN0VmVyc2lvbjtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wdXQoJ3ZlcnNpb24nLCBjdXJyZW50VmVyc2lvbik7XG5cbiAgICBpZiAobmV3VmVyc2lvbiAmJiBsYXN0VmVyc2lvbikge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBOZXcgdmVyc2lvbiBkZXRlY3RlZDogJHtjdXJyZW50VmVyc2lvbn07IHByZXZpb3VzOiAke2xhc3RWZXJzaW9ufWBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZUJ1aWxkRXhwaXJhdGlvbiA9IHdpbmRvdy5zdG9yYWdlLmdldCgncmVtb3RlQnVpbGRFeHBpcmF0aW9uJyk7XG4gICAgICBpZiAocmVtb3RlQnVpbGRFeHBpcmF0aW9uKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBDbGVhcmluZyByZW1vdGVCdWlsZEV4cGlyYXRpb24uIFByZXZpb3VzIHZhbHVlIHdhcyAke3JlbW90ZUJ1aWxkRXhwaXJhdGlvbn1gXG4gICAgICAgICk7XG4gICAgICAgIHdpbmRvdy5zdG9yYWdlLnJlbW92ZSgncmVtb3RlQnVpbGRFeHBpcmF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjEuMjkuMi1iZXRhLjEnKSkge1xuICAgICAgICAvLyBTdGlja2VycyBmbGFnc1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCdzaG93U3RpY2tlcnNJbnRyb2R1Y3Rpb24nLCB0cnVlKSxcbiAgICAgICAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ3Nob3dTdGlja2VyUGlja2VySGludCcsIHRydWUpLFxuICAgICAgICBdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHdpbmRvdy5pc0JlZm9yZVZlcnNpb24obGFzdFZlcnNpb24sICd2MS4yNi4wJykpIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgd2UgcmUtcmVnaXN0ZXIgb3VyIHN1cHBvcnQgZm9yIHNlYWxlZCBzZW5kZXJcbiAgICAgICAgYXdhaXQgd2luZG93LnN0b3JhZ2UucHV0KFxuICAgICAgICAgICdoYXNSZWdpc3RlclN1cHBvcnRGb3JVbmF1dGhlbnRpY2F0ZWREZWxpdmVyeScsXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGhlbWVTZXR0aW5nID0gd2luZG93LkV2ZW50cy5nZXRUaGVtZVNldHRpbmcoKTtcbiAgICAgIGNvbnN0IG5ld1RoZW1lU2V0dGluZyA9IG1hcE9sZFRoZW1lVG9OZXcodGhlbWVTZXR0aW5nKTtcbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjEuMjUuMCcpKSB7XG4gICAgICAgIGlmIChuZXdUaGVtZVNldHRpbmcgPT09IHdpbmRvdy5zeXN0ZW1UaGVtZSkge1xuICAgICAgICAgIHdpbmRvdy5FdmVudHMuc2V0VGhlbWVTZXR0aW5nKCdzeXN0ZW0nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cuRXZlbnRzLnNldFRoZW1lU2V0dGluZyhuZXdUaGVtZVNldHRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgd2luZG93LmlzQmVmb3JlVmVyc2lvbihsYXN0VmVyc2lvbiwgJ3YxLjM2LjAtYmV0YS4xJykgJiZcbiAgICAgICAgd2luZG93LmlzQWZ0ZXJWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjEuMzUuMC1iZXRhLjEnKVxuICAgICAgKSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuU2VydmljZXMuZXJhc2VBbGxTdG9yYWdlU2VydmljZVN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjUuMi4wJykpIHtcbiAgICAgICAgY29uc3QgbGVnYWN5U2VuZGVyQ2VydGlmaWNhdGVTdG9yYWdlS2V5ID0gJ3NlbmRlckNlcnRpZmljYXRlV2l0aFV1aWQnO1xuICAgICAgICBhd2FpdCByZW1vdmVTdG9yYWdlS2V5Sm9iUXVldWUuYWRkKHtcbiAgICAgICAgICBrZXk6IGxlZ2FjeVNlbmRlckNlcnRpZmljYXRlU3RvcmFnZUtleSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjUuMTguMCcpKSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnJlbW92ZSgnc2VuZGVyQ2VydGlmaWNhdGUnKTtcbiAgICAgICAgYXdhaXQgd2luZG93LnN0b3JhZ2UucmVtb3ZlKCdzZW5kZXJDZXJ0aWZpY2F0ZU5vRTE2NCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAod2luZG93LmlzQmVmb3JlVmVyc2lvbihsYXN0VmVyc2lvbiwgJ3Y1LjE5LjAnKSkge1xuICAgICAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5yZW1vdmUoR1JPVVBfQ1JFREVOVElBTFNfS0VZKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHdpbmRvdy5pc0JlZm9yZVZlcnNpb24obGFzdFZlcnNpb24sICd2NS4zNy4wLWFscGhhJykpIHtcbiAgICAgICAgY29uc3QgbGVnYWN5Q2hhbGxlbmdlS2V5ID0gJ2NoYWxsZW5nZTpyZXRyeS1tZXNzYWdlLWlkcyc7XG4gICAgICAgIGF3YWl0IHJlbW92ZVN0b3JhZ2VLZXlKb2JRdWV1ZS5hZGQoe1xuICAgICAgICAgIGtleTogbGVnYWN5Q2hhbGxlbmdlS2V5LFxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuY2xlYXJBbGxFcnJvclN0aWNrZXJQYWNrQXR0ZW1wdHMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHdpbmRvdy5pc0JlZm9yZVZlcnNpb24obGFzdFZlcnNpb24sICd2NS41MS4wLWJldGEuMicpKSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dCgnZ3JvdXBDcmVkZW50aWFscycsIFtdKTtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUFsbFByb2ZpbGVLZXlDcmVkZW50aWFscygpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIG9uZSBzaG91bGQgYWx3YXlzIGJlIGxhc3QgLSBpdCBjb3VsZCByZXN0YXJ0IHRoZSBhcHBcbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjUuMzAuMC1hbHBoYScpKSB7XG4gICAgICAgIGF3YWl0IGRlbGV0ZUFsbExvZ3MoKTtcbiAgICAgICAgd2luZG93LnJlc3RhcnQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEFwcExvYWRpbmdTY3JlZW5NZXNzYWdlKFxuICAgICAgd2luZG93LmkxOG4oJ29wdGltaXppbmdBcHBsaWNhdGlvbicpLFxuICAgICAgd2luZG93LmkxOG5cbiAgICApO1xuXG4gICAgaWYgKG5ld1ZlcnNpb24pIHtcbiAgICAgIC8vIFdlJ3ZlIHJlY2VpdmVkIHJlcG9ydHMgdGhhdCB0aGlzIHVwZGF0ZSBjYW4gdGFrZSBsb25nZXIgdGhhbiB0d28gbWludXRlcywgc28gd2VcbiAgICAgIC8vICAgYWxsb3cgaXQgdG8gY29udGludWUgYW5kIGp1c3QgbW92ZSBvbiBpbiB0aGF0IHRpbWVvdXQgY2FzZS5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5jbGVhbnVwT3JwaGFuZWRBdHRhY2htZW50cygpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdiYWNrZ3JvdW5kOiBGYWlsZWQgdG8gY2xlYW51cCBvcnBoYW5lZCBhdHRhY2htZW50czonLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBEb24ndCBibG9jayBvbiB0aGUgZm9sbG93aW5nIG9wZXJhdGlvblxuICAgICAgd2luZG93LlNpZ25hbC5EYXRhLmVuc3VyZUZpbGVQZXJtaXNzaW9ucygpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc3RhcnRJblJlbmRlcmVyUHJvY2VzcygpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLmVycm9yKCdTUUwgZmFpbGVkIHRvIGluaXRpYWxpemUnLCBlcnIgJiYgZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyKTtcbiAgICB9XG5cbiAgICBzZXRBcHBMb2FkaW5nU2NyZWVuTWVzc2FnZSh3aW5kb3cuaTE4bignbG9hZGluZycpLCB3aW5kb3cuaTE4bik7XG5cbiAgICBsZXQgaXNNaWdyYXRpb25XaXRoSW5kZXhDb21wbGV0ZSA9IGZhbHNlO1xuICAgIGxldCBpc0lkbGVUYXNrUHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYFN0YXJ0aW5nIGJhY2tncm91bmQgZGF0YSBtaWdyYXRpb24uIFRhcmdldCB2ZXJzaW9uOiAke01lc3NhZ2UuQ1VSUkVOVF9TQ0hFTUFfVkVSU0lPTn1gXG4gICAgKTtcbiAgICBpZGxlRGV0ZWN0b3Iub24oJ2lkbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBOVU1fTUVTU0FHRVNfUEVSX0JBVENIID0gMjU7XG4gICAgICBjb25zdCBCQVRDSF9ERUxBWSA9IDEwICogZHVyYXRpb25zLlNFQ09ORDtcblxuICAgICAgaWYgKGlzSWRsZVRhc2tQcm9jZXNzaW5nKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdpZGxlRGV0ZWN0b3IvaWRsZTogcHJldmlvdXMgYmF0Y2ggaW5jb21wbGV0ZSwgbm90IHN0YXJ0aW5nIGFub3RoZXInXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGlzSWRsZVRhc2tQcm9jZXNzaW5nID0gdHJ1ZTtcblxuICAgICAgICBpZiAoIWlzTWlncmF0aW9uV2l0aEluZGV4Q29tcGxldGUpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGBpZGxlRGV0ZWN0b3IvaWRsZTogZmV0Y2hpbmcgYXQgbW9zdCAke05VTV9NRVNTQUdFU19QRVJfQkFUQ0h9IGZvciBtaWdyYXRpb25gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBiYXRjaFdpdGhJbmRleCA9IGF3YWl0IG1pZ3JhdGVNZXNzYWdlRGF0YSh7XG4gICAgICAgICAgICBudW1NZXNzYWdlc1BlckJhdGNoOiBOVU1fTUVTU0FHRVNfUEVSX0JBVENILFxuICAgICAgICAgICAgdXBncmFkZU1lc3NhZ2VTY2hlbWEsXG4gICAgICAgICAgICBnZXRNZXNzYWdlc05lZWRpbmdVcGdyYWRlOlxuICAgICAgICAgICAgICB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0TWVzc2FnZXNOZWVkaW5nVXBncmFkZSxcbiAgICAgICAgICAgIHNhdmVNZXNzYWdlczogd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsb2cuaW5mbygnaWRsZURldGVjdG9yL2lkbGU6IFVwZ3JhZGVkIG1lc3NhZ2VzOicsIGJhdGNoV2l0aEluZGV4KTtcbiAgICAgICAgICBpc01pZ3JhdGlvbldpdGhJbmRleENvbXBsZXRlID0gYmF0Y2hXaXRoSW5kZXguZG9uZTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWRsZURldGVjdG9yLnN0b3AoKTtcblxuICAgICAgICBpZiAoaXNNaWdyYXRpb25XaXRoSW5kZXhDb21wbGV0ZSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgJ2lkbGVEZXRlY3Rvci9pZGxlOiBCYWNrZ3JvdW5kIG1pZ3JhdGlvbiBjb21wbGV0ZS4gU3RvcHBpbmcuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICBgaWRsZURldGVjdG9yL2lkbGU6IEJhY2tncm91bmQgbWlncmF0aW9uIG5vdCBjb21wbGV0ZS4gUGF1c2luZyBmb3IgJHtCQVRDSF9ERUxBWX1tcy5gXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWRsZURldGVjdG9yLnN0YXJ0KCk7XG4gICAgICAgICAgfSwgQkFUQ0hfREVMQVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNJZGxlVGFza1Byb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5TaWduYWwuUmVtb3RlQ29uZmlnLmluaXRSZW1vdGVDb25maWcoc2VydmVyKTtcblxuICAgIGxldCByZXRyeVJlY2VpcHRMaWZlc3BhbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICByZXRyeVJlY2VpcHRMaWZlc3BhbiA9IHBhcnNlSW50T3JUaHJvdyhcbiAgICAgICAgd2luZG93LlNpZ25hbC5SZW1vdGVDb25maWcuZ2V0VmFsdWUoJ2Rlc2t0b3AucmV0cnlSZWNlaXB0TGlmZXNwYW4nKSxcbiAgICAgICAgJ3JldHJ5UmVjZWlwdExpZmVTcGFuJ1xuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdGYWlsZWQgdG8gcGFyc2UgaW50ZWdlciBvdXQgb2YgZGVza3RvcC5yZXRyeVJlY2VpcHRMaWZlc3BhbiBmZWF0dXJlIGZsYWcnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHJldHJ5UGxhY2Vob2xkZXJzID0gbmV3IHdpbmRvdy5TaWduYWwuVXRpbC5SZXRyeVBsYWNlaG9sZGVycyh7XG4gICAgICByZXRyeVJlY2VpcHRMaWZlc3BhbixcbiAgICB9KTtcbiAgICB3aW5kb3cuU2lnbmFsLlNlcnZpY2VzLnJldHJ5UGxhY2Vob2xkZXJzID0gcmV0cnlQbGFjZWhvbGRlcnM7XG5cbiAgICBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgSE9VUiA9IDEwMDAgKiA2MCAqIDYwO1xuICAgICAgY29uc3QgREFZID0gMjQgKiBIT1VSO1xuICAgICAgbGV0IHNlbnRQcm90b01heEFnZSA9IDE0ICogREFZO1xuXG4gICAgICB0cnkge1xuICAgICAgICBzZW50UHJvdG9NYXhBZ2UgPSBwYXJzZUludE9yVGhyb3coXG4gICAgICAgICAgd2luZG93LlNpZ25hbC5SZW1vdGVDb25maWcuZ2V0VmFsdWUoJ2Rlc2t0b3AucmV0cnlSZXNwb25kTWF4QWdlJyksXG4gICAgICAgICAgJ3JldHJ5UmVzcG9uZE1heEFnZSdcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdiYWNrZ3JvdW5kL3NldEludGVydmFsOiBGYWlsZWQgdG8gcGFyc2UgaW50ZWdlciBmcm9tIGRlc2t0b3AucmV0cnlSZXNwb25kTWF4QWdlIGZlYXR1cmUgZmxhZycsXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5kZWxldGVTZW50UHJvdG9zT2xkZXJUaGFuKFxuICAgICAgICAgIG5vdyAtIHNlbnRQcm90b01heEFnZVxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdiYWNrZ3JvdW5kL29ucmVhZHkvc2V0SW50ZXJ2YWw6IEVycm9yIGRlbGV0aW5nIHNlbnQgcHJvdG9zOiAnLFxuICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBleHBpcmVkID0gYXdhaXQgcmV0cnlQbGFjZWhvbGRlcnMuZ2V0RXhwaXJlZEFuZFJlbW92ZSgpO1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgcmV0cnlQbGFjZWhvbGRlcnMvaW50ZXJ2YWw6IEZvdW5kICR7ZXhwaXJlZC5sZW5ndGh9IGV4cGlyZWQgaXRlbXNgXG4gICAgICAgICk7XG4gICAgICAgIGV4cGlyZWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkLCBzZW5kZXJVdWlkLCBzZW50QXQgfSA9IGl0ZW07XG4gICAgICAgICAgY29uc3QgY29udmVyc2F0aW9uID1cbiAgICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgICAgaWYgKGNvbnZlcnNhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcmVjZWl2ZWRBdCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBjb25zdCByZWNlaXZlZEF0Q291bnRlciA9XG4gICAgICAgICAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5pbmNyZW1lbnRNZXNzYWdlQ291bnRlcigpO1xuICAgICAgICAgICAgY29udmVyc2F0aW9uLnF1ZXVlSm9iKCdhZGREZWxpdmVyeUlzc3VlJywgKCkgPT5cbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uLmFkZERlbGl2ZXJ5SXNzdWUoe1xuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICAgICAgICAgICAgc2VuZGVyVXVpZCxcbiAgICAgICAgICAgICAgICBzZW50QXQsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgJ2JhY2tncm91bmQvb25yZWFkeS9zZXRJbnRlcnZhbDogRXJyb3IgZ2V0dGluZyBleHBpcmVkIHJldHJ5IHBsYWNlaG9sZGVyczogJyxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LCBGSVZFX01JTlVURVMpO1xuXG4gICAgbGV0IG1haW5XaW5kb3dTdGF0cyA9IHtcbiAgICAgIGlzTWF4aW1pemVkOiBmYWxzZSxcbiAgICAgIGlzRnVsbFNjcmVlbjogZmFsc2UsXG4gICAgfTtcblxuICAgIGxldCBtZW51T3B0aW9ucyA9IHtcbiAgICAgIGRldmVsb3BtZW50OiBmYWxzZSxcbiAgICAgIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVTZXR1cDogZmFsc2UsXG4gICAgICBpc1Byb2R1Y3Rpb246IHRydWUsXG4gICAgICBwbGF0Zm9ybTogJ3Vua25vd24nLFxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb2FkKCksXG4gICAgICAgIFN0aWNrZXJzLmxvYWQoKSxcbiAgICAgICAgbG9hZFJlY2VudEVtb2ppcygpLFxuICAgICAgICBsb2FkSW5pdGlhbEJhZGdlc1N0YXRlKCksXG4gICAgICAgIGxvYWRTdG9yaWVzKCksXG4gICAgICAgIGxvYWREaXN0cmlidXRpb25MaXN0cygpLFxuICAgICAgICB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmh5ZHJhdGVDYWNoZXMoKSxcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBtYWluV2luZG93U3RhdHMgPSBhd2FpdCB3aW5kb3cuU2lnbmFsQ29udGV4dC5nZXRNYWluV2luZG93U3RhdHMoKTtcbiAgICAgICAgfSkoKSxcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBtZW51T3B0aW9ucyA9IGF3YWl0IHdpbmRvdy5TaWduYWxDb250ZXh0LmdldE1lbnVPcHRpb25zKCk7XG4gICAgICAgIH0pKCksXG4gICAgICBdKTtcbiAgICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmNoZWNrRm9yQ29uZmxpY3RzKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ2JhY2tncm91bmQuanM6IENvbnZlcnNhdGlvbkNvbnRyb2xsZXIgZmFpbGVkIHRvIGxvYWQ6JyxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpbml0aWFsaXplUmVkdXgoeyBtYWluV2luZG93U3RhdHMsIG1lbnVPcHRpb25zIH0pO1xuICAgICAgc3RhcnQoKTtcbiAgICAgIHdpbmRvdy5TaWduYWwuU2VydmljZXMuaW5pdGlhbGl6ZU5ldHdvcmtPYnNlcnZlcihcbiAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5uZXR3b3JrXG4gICAgICApO1xuICAgICAgd2luZG93LlNpZ25hbC5TZXJ2aWNlcy5pbml0aWFsaXplVXBkYXRlTGlzdGVuZXIoXG4gICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMudXBkYXRlc1xuICAgICAgKTtcbiAgICAgIHdpbmRvdy5TaWduYWwuU2VydmljZXMuY2FsbGluZy5pbml0aWFsaXplKFxuICAgICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNhbGxpbmcsXG4gICAgICAgIHdpbmRvdy5nZXRTZnVVcmwoKVxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuZXhwaXJhdGlvbi5oeWRyYXRlRXhwaXJhdGlvblN0YXR1cyhcbiAgICAgICAgd2luZG93LlNpZ25hbC5VdGlsLmhhc0V4cGlyZWQoKVxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVSZWR1eCh7XG4gICAgbWFpbldpbmRvd1N0YXRzLFxuICAgIG1lbnVPcHRpb25zLFxuICB9OiB7XG4gICAgbWFpbldpbmRvd1N0YXRzOiBNYWluV2luZG93U3RhdHNUeXBlO1xuICAgIG1lbnVPcHRpb25zOiBNZW51T3B0aW9uc1R5cGU7XG4gIH0pIHtcbiAgICAvLyBIZXJlIHdlIHNldCB1cCBhIGZ1bGwgcmVkdXggc3RvcmUgd2l0aCBpbml0aWFsIHN0YXRlIGZvciBvdXIgTGVmdFBhbmUgUm9vdFxuICAgIGNvbnN0IGNvbnZvQ29sbGVjdGlvbiA9IHdpbmRvdy5nZXRDb252ZXJzYXRpb25zKCk7XG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gZ2V0SW5pdGlhbFN0YXRlKHtcbiAgICAgIGJhZGdlczogaW5pdGlhbEJhZGdlc1N0YXRlLFxuICAgICAgbWFpbldpbmRvd1N0YXRzLFxuICAgICAgbWVudU9wdGlvbnMsXG4gICAgICBzdG9yaWVzOiBnZXRTdG9yaWVzRm9yUmVkdXgoKSxcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHM6IGdldERpc3RyaWJ1dGlvbkxpc3RzRm9yUmVkdXgoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0b3JlID0gd2luZG93LlNpZ25hbC5TdGF0ZS5jcmVhdGVTdG9yZShpbml0aWFsU3RhdGUpO1xuICAgIHdpbmRvdy5yZWR1eFN0b3JlID0gc3RvcmU7XG5cbiAgICAvLyBCaW5kaW5nIHRoZXNlIGFjdGlvbnMgdG8gb3VyIHJlZHV4IHN0b3JlIGFuZCBleHBvc2luZyB0aGVtIGFsbG93cyB1cyB0byB1cGRhdGVcbiAgICAvLyAgIHJlZHV4IHdoZW4gdGhpbmdzIGNoYW5nZSBpbiB0aGUgYmFja2JvbmUgd29ybGQuXG4gICAgd2luZG93LnJlZHV4QWN0aW9ucyA9IHtcbiAgICAgIGFjY291bnRzOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMuYWNjb3VudHMsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIGFwcDogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLmFwcCwgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgYXVkaW9QbGF5ZXI6IGJpbmRBY3Rpb25DcmVhdG9ycyhcbiAgICAgICAgYWN0aW9uQ3JlYXRvcnMuYXVkaW9QbGF5ZXIsXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoXG4gICAgICApLFxuICAgICAgYXVkaW9SZWNvcmRlcjogYmluZEFjdGlvbkNyZWF0b3JzKFxuICAgICAgICBhY3Rpb25DcmVhdG9ycy5hdWRpb1JlY29yZGVyLFxuICAgICAgICBzdG9yZS5kaXNwYXRjaFxuICAgICAgKSxcbiAgICAgIGJhZGdlczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLmJhZGdlcywgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgY2FsbGluZzogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLmNhbGxpbmcsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIGNvbXBvc2VyOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMuY29tcG9zZXIsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIGNvbnZlcnNhdGlvbnM6IGJpbmRBY3Rpb25DcmVhdG9ycyhcbiAgICAgICAgYWN0aW9uQ3JlYXRvcnMuY29udmVyc2F0aW9ucyxcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2hcbiAgICAgICksXG4gICAgICBjcmFzaFJlcG9ydHM6IGJpbmRBY3Rpb25DcmVhdG9ycyhcbiAgICAgICAgYWN0aW9uQ3JlYXRvcnMuY3Jhc2hSZXBvcnRzLFxuICAgICAgICBzdG9yZS5kaXNwYXRjaFxuICAgICAgKSxcbiAgICAgIGVtb2ppczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLmVtb2ppcywgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgZXhwaXJhdGlvbjogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLmV4cGlyYXRpb24sIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIGdsb2JhbE1vZGFsczogYmluZEFjdGlvbkNyZWF0b3JzKFxuICAgICAgICBhY3Rpb25DcmVhdG9ycy5nbG9iYWxNb2RhbHMsXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoXG4gICAgICApLFxuICAgICAgaXRlbXM6IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycy5pdGVtcywgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgbGlua1ByZXZpZXdzOiBiaW5kQWN0aW9uQ3JlYXRvcnMoXG4gICAgICAgIGFjdGlvbkNyZWF0b3JzLmxpbmtQcmV2aWV3cyxcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2hcbiAgICAgICksXG4gICAgICBuZXR3b3JrOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMubmV0d29yaywgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgc2FmZXR5TnVtYmVyOiBiaW5kQWN0aW9uQ3JlYXRvcnMoXG4gICAgICAgIGFjdGlvbkNyZWF0b3JzLnNhZmV0eU51bWJlcixcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2hcbiAgICAgICksXG4gICAgICBzZWFyY2g6IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycy5zZWFyY2gsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIHN0aWNrZXJzOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMuc3RpY2tlcnMsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIHN0b3JpZXM6IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycy5zdG9yaWVzLCBzdG9yZS5kaXNwYXRjaCksXG4gICAgICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RzOiBiaW5kQWN0aW9uQ3JlYXRvcnMoXG4gICAgICAgIGFjdGlvbkNyZWF0b3JzLnN0b3J5RGlzdHJpYnV0aW9uTGlzdHMsXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoXG4gICAgICApLFxuICAgICAgdG9hc3Q6IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycy50b2FzdCwgc3RvcmUuZGlzcGF0Y2gpLFxuICAgICAgdXBkYXRlczogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLnVwZGF0ZXMsIHN0b3JlLmRpc3BhdGNoKSxcbiAgICAgIHVzZXI6IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycy51c2VyLCBzdG9yZS5kaXNwYXRjaCksXG4gICAgfTtcblxuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvbkFkZGVkLFxuICAgICAgY29udmVyc2F0aW9uQ2hhbmdlZCxcbiAgICAgIGNvbnZlcnNhdGlvblJlbW92ZWQsXG4gICAgICByZW1vdmVBbGxDb252ZXJzYXRpb25zLFxuICAgIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnM7XG5cbiAgICBjb252b0NvbGxlY3Rpb24ub24oJ3JlbW92ZScsIGNvbnZlcnNhdGlvbiA9PiB7XG4gICAgICBjb25zdCB7IGlkIH0gPSBjb252ZXJzYXRpb24gfHwge307XG5cbiAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCd1bmxvYWQnLCAncmVtb3ZlZCcpO1xuICAgICAgY29udmVyc2F0aW9uUmVtb3ZlZChpZCk7XG4gICAgfSk7XG4gICAgY29udm9Db2xsZWN0aW9uLm9uKCdhZGQnLCBjb252ZXJzYXRpb24gPT4ge1xuICAgICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29udmVyc2F0aW9uQWRkZWQoY29udmVyc2F0aW9uLmlkLCBjb252ZXJzYXRpb24uZm9ybWF0KCkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2hhbmdlZENvbnZvQmF0Y2hlciA9IGNyZWF0ZUJhdGNoZXI8Q29udmVyc2F0aW9uTW9kZWw+KHtcbiAgICAgIG5hbWU6ICdjaGFuZ2VkQ29udm9CYXRjaGVyJyxcbiAgICAgIHByb2Nlc3NCYXRjaChiYXRjaCkge1xuICAgICAgICBjb25zdCBkZWR1cGVkID0gbmV3IFNldChiYXRjaCk7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdjaGFuZ2VkQ29udm9CYXRjaGVyOiBkZWR1cGVkICcgK1xuICAgICAgICAgICAgYCR7YmF0Y2gubGVuZ3RofSBpbnRvICR7ZGVkdXBlZC5zaXplfWBcbiAgICAgICAgKTtcblxuICAgICAgICBiYXRjaERpc3BhdGNoKCgpID0+IHtcbiAgICAgICAgICBkZWR1cGVkLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbkNoYW5nZWQoY29udmVyc2F0aW9uLmlkLCBjb252ZXJzYXRpb24uZm9ybWF0KCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFRoaXMgZGVsYXkgZW5zdXJlcyB0aGF0IHRoZSAuZm9ybWF0KCkgY2FsbCBpc24ndCBzeW5jaHJvbm91cyBhcyBhXG4gICAgICAvLyAgIEJhY2tib25lIHByb3BlcnR5IGlzIGNoYW5nZWQuIEltcG9ydGFudCBiZWNhdXNlIG91ciBfYnlVdWlkL19ieUUxNjRcbiAgICAgIC8vICAgbG9va3VwcyBhcmVuJ3QgdXAtdG8tZGF0ZSBhcyB0aGUgY2hhbmdlIGhhcHBlbnM7IGp1c3QgYSBsaXR0bGUgYml0XG4gICAgICAvLyAgIGFmdGVyLlxuICAgICAgd2FpdDogMSxcbiAgICAgIG1heFNpemU6IEluZmluaXR5LFxuICAgIH0pO1xuXG4gICAgY29udm9Db2xsZWN0aW9uLm9uKCdwcm9wcy1jaGFuZ2UnLCAoY29udmVyc2F0aW9uLCBpc0JhdGNoZWQpID0+IHtcbiAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYGlzQmF0Y2hlZGAgaXMgdHJ1ZSB3aGVuIHRoZSBgLnNldCgpYCBjYWxsIG9uIHRoZSBjb252ZXJzYXRpb24gbW9kZWxcbiAgICAgIC8vIGFscmVhZHkgcnVucyBmcm9tIHdpdGhpbiBgcmVhY3QtcmVkdXhgJ3MgYmF0Y2guIEluc3RlYWQgb2YgYmF0Y2hpbmdcbiAgICAgIC8vIHRoZSByZWR1eCB1cGRhdGUgZm9yIGxhdGVyIC0gY2xlYXIgYWxsIHF1ZXVlZCB1cGRhdGVzIGFuZCB1cGRhdGVcbiAgICAgIC8vIGltbWVkaWF0ZWx5LlxuICAgICAgaWYgKGlzQmF0Y2hlZCkge1xuICAgICAgICBjaGFuZ2VkQ29udm9CYXRjaGVyLnJlbW92ZUFsbChjb252ZXJzYXRpb24pO1xuICAgICAgICBjb252ZXJzYXRpb25DaGFuZ2VkKGNvbnZlcnNhdGlvbi5pZCwgY29udmVyc2F0aW9uLmZvcm1hdCgpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjaGFuZ2VkQ29udm9CYXRjaGVyLmFkZChjb252ZXJzYXRpb24pO1xuICAgIH0pO1xuICAgIGNvbnZvQ29sbGVjdGlvbi5vbigncmVzZXQnLCByZW1vdmVBbGxDb252ZXJzYXRpb25zKTtcblxuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbigndXNlckNoYW5nZWQnLCAocmVjb25uZWN0ID0gZmFsc2UpID0+IHtcbiAgICAgIGNvbnN0IG5ld0RldmljZUlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldERldmljZUlkKCk7XG4gICAgICBjb25zdCBuZXdOdW1iZXIgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0TnVtYmVyKCk7XG4gICAgICBjb25zdCBuZXdBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAgICAgLmdldFV1aWQoVVVJREtpbmQuQUNJKVxuICAgICAgICA/LnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBuZXdQTkkgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAgICAgLmdldFV1aWQoVVVJREtpbmQuUE5JKVxuICAgICAgICA/LnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBvdXJDb252ZXJzYXRpb24gPVxuICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb24oKTtcblxuICAgICAgaWYgKG91ckNvbnZlcnNhdGlvbj8uZ2V0KCdlMTY0JykgIT09IG5ld051bWJlcikge1xuICAgICAgICBvdXJDb252ZXJzYXRpb24/LnNldCgnZTE2NCcsIG5ld051bWJlcik7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMudXNlci51c2VyQ2hhbmdlZCh7XG4gICAgICAgIG91ckNvbnZlcnNhdGlvbklkOiBvdXJDb252ZXJzYXRpb24/LmdldCgnaWQnKSxcbiAgICAgICAgb3VyRGV2aWNlSWQ6IG5ld0RldmljZUlkLFxuICAgICAgICBvdXJOdW1iZXI6IG5ld051bWJlcixcbiAgICAgICAgb3VyQUNJOiBuZXdBQ0ksXG4gICAgICAgIG91clBOSTogbmV3UE5JLFxuICAgICAgICByZWdpb25Db2RlOiB3aW5kb3cuc3RvcmFnZS5nZXQoJ3JlZ2lvbkNvZGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVjb25uZWN0KSB7XG4gICAgICAgIGxvZy5pbmZvKCdiYWNrZ3JvdW5kOiByZWNvbm5lY3Rpbmcgd2Vic29ja2V0IG9uIHVzZXIgY2hhbmdlJyk7XG4gICAgICAgIGVucXVldWVSZWNvbm5lY3RUb1dlYlNvY2tldCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2luZG93LldoaXNwZXIuZXZlbnRzLm9uKFxuICAgICAgJ3NldFdpbmRvd1N0YXRzJyxcbiAgICAgICh7XG4gICAgICAgIGlzRnVsbFNjcmVlbixcbiAgICAgICAgaXNNYXhpbWl6ZWQsXG4gICAgICB9OiB7XG4gICAgICAgIGlzRnVsbFNjcmVlbjogYm9vbGVhbjtcbiAgICAgICAgaXNNYXhpbWl6ZWQ6IGJvb2xlYW47XG4gICAgICB9KSA9PiB7XG4gICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMudXNlci51c2VyQ2hhbmdlZCh7XG4gICAgICAgICAgaXNNYWluV2luZG93TWF4aW1pemVkOiBpc01heGltaXplZCxcbiAgICAgICAgICBpc01haW5XaW5kb3dGdWxsU2NyZWVuOiBpc0Z1bGxTY3JlZW4sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3NldE1lbnVPcHRpb25zJywgKG9wdGlvbnM6IE1lbnVPcHRpb25zVHlwZSkgPT4ge1xuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy51c2VyLnVzZXJDaGFuZ2VkKHsgbWVudU9wdGlvbnM6IG9wdGlvbnMgfSk7XG4gICAgfSk7XG5cbiAgICBsZXQgc2hvcnRjdXRHdWlkZVZpZXc6IFJlYWN0V3JhcHBlclZpZXcgfCBudWxsID0gbnVsbDtcblxuICAgIHdpbmRvdy5zaG93S2V5Ym9hcmRTaG9ydGN1dHMgPSAoKSA9PiB7XG4gICAgICBpZiAoIXNob3J0Y3V0R3VpZGVWaWV3KSB7XG4gICAgICAgIHNob3J0Y3V0R3VpZGVWaWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3Nob3J0Y3V0LWd1aWRlLXdyYXBwZXInLFxuICAgICAgICAgIEpTWDogd2luZG93LlNpZ25hbC5TdGF0ZS5Sb290cy5jcmVhdGVTaG9ydGN1dEd1aWRlTW9kYWwoXG4gICAgICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvcnRjdXRHdWlkZVZpZXcpIHtcbiAgICAgICAgICAgICAgICAgIHNob3J0Y3V0R3VpZGVWaWV3LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgc2hvcnRjdXRHdWlkZVZpZXcgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApLFxuICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHtcbiAgICAgICAgICAgIHNob3J0Y3V0R3VpZGVWaWV3ID0gbnVsbDtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHsgY3RybEtleSwgbWV0YUtleSwgc2hpZnRLZXkgfSA9IGV2ZW50O1xuXG4gICAgICBjb25zdCBjb21tYW5kS2V5ID0gd2luZG93LnBsYXRmb3JtID09PSAnZGFyd2luJyAmJiBtZXRhS2V5O1xuICAgICAgY29uc3QgY29udHJvbEtleSA9IHdpbmRvdy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicgJiYgY3RybEtleTtcbiAgICAgIGNvbnN0IGNvbW1hbmRPckN0cmwgPSBjb21tYW5kS2V5IHx8IGNvbnRyb2xLZXk7XG5cbiAgICAgIGNvbnN0IHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSWQgPSBzdGF0ZS5jb252ZXJzYXRpb25zLnNlbGVjdGVkQ29udmVyc2F0aW9uSWQ7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoc2VsZWN0ZWRJZCk7XG5cbiAgICAgIGNvbnN0IGtleSA9IEtleWJvYXJkTGF5b3V0Lmxvb2t1cChldmVudCk7XG5cbiAgICAgIC8vIE5BVklHQVRJT05cblxuICAgICAgLy8gU2hvdyBrZXlib2FyZCBzaG9ydGN1dHMgLSBoYW5kbGVkIGJ5IEVsZWN0cm9uLW1hbmFnZWQga2V5Ym9hcmQgc2hvcnRjdXRzXG4gICAgICAvLyBIb3dldmVyLCBvbiBsaW51eCBDdHJsKy8gc2VsZWN0cyBhbGwgdGV4dCwgc28gd2UgcHJldmVudCB0aGF0XG4gICAgICBpZiAoY29tbWFuZE9yQ3RybCAmJiBrZXkgPT09ICcvJykge1xuICAgICAgICB3aW5kb3cuc2hvd0tleWJvYXJkU2hvcnRjdXRzKCk7XG5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBOYXZpZ2F0ZSBieSBzZWN0aW9uXG4gICAgICBpZiAoY29tbWFuZE9yQ3RybCAmJiAhc2hpZnRLZXkgJiYgKGtleSA9PT0gJ3QnIHx8IGtleSA9PT0gJ1QnKSkge1xuICAgICAgICB3aW5kb3cuZW50ZXJLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgY29uc3QgZm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIGNvbnN0IHRhcmdldHM6IEFycmF5PEhUTUxFbGVtZW50IHwgbnVsbD4gPSBbXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZHVsZS1tYWluLWhlYWRlciAubW9kdWxlLWF2YXRhci1idXR0b24nKSxcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgJy5tb2R1bGUtbGVmdC1wYW5lX19oZWFkZXJfX2NvbnRlbnRzX19iYWNrLWJ1dHRvbidcbiAgICAgICAgICApLFxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5MZWZ0UGFuZVNlYXJjaElucHV0X19pbnB1dCcpLFxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2R1bGUtbWFpbi1oZWFkZXJfX2NvbXBvc2UtaWNvbicpLFxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLm1vZHVsZS1sZWZ0LXBhbmVfX2NvbXBvc2Utc2VhcmNoLWZvcm1fX2lucHV0J1xuICAgICAgICAgICksXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICcubW9kdWxlLWNvbnZlcnNhdGlvbi1saXN0X19pdGVtLS1jb250YWN0LW9yLWNvbnZlcnNhdGlvbidcbiAgICAgICAgICApLFxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2R1bGUtc2VhcmNoLXJlc3VsdHMnKSxcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuQ29tcG9zaXRpb25BcmVhIC5xbC1lZGl0b3InKSxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgZm9jdXNlZEluZGV4ID0gdGFyZ2V0cy5maW5kSW5kZXgodGFyZ2V0ID0+IHtcbiAgICAgICAgICBpZiAoIXRhcmdldCB8fCAhZm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGFyZ2V0ID09PSBmb2N1c2VkRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRhcmdldC5jb250YWlucyhmb2N1c2VkRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHRhcmdldHMubGVuZ3RoIC0gMTtcblxuICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgIGlmIChmb2N1c2VkSW5kZXggPCAwIHx8IGZvY3VzZWRJbmRleCA+PSBsYXN0SW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXggPSBmb2N1c2VkSW5kZXggKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCF0YXJnZXRzW2luZGV4XSkge1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgdGFyZ2V0c1tpbmRleF0hLmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbCBvdXQgb2Yga2V5Ym9hcmQgc2hvcnRjdXQgc2NyZWVuIC0gaGFzIGZpcnN0IHByZWNlZGVuY2VcbiAgICAgIGlmIChzaG9ydGN1dEd1aWRlVmlldyAmJiBrZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHNob3J0Y3V0R3VpZGVWaWV3LnJlbW92ZSgpO1xuICAgICAgICBzaG9ydGN1dEd1aWRlVmlldyA9IG51bGw7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEVzY2FwZSBpcyBoZWF2aWx5IG92ZXJsb2FkZWQgLSBoZXJlIHdlIGF2b2lkIGNsYXNoZXMgd2l0aCBvdGhlciBFc2NhcGUgaGFuZGxlcnNcbiAgICAgIGlmIChrZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIC8vIENoZWNrIG9yaWdpbiAtIGlmIHdpdGhpbiBhIHJlYWN0IGNvbXBvbmVudCB3aGljaCBoYW5kbGVzIGVzY2FwZSwgZG9uJ3QgaGFuZGxlLlxuICAgICAgICAvLyAgIFdoeT8gQmVjYXVzZSBSZWFjdCdzIHN5bnRoZXRpYyBldmVudHMgY2FuIGNhdXNlIGV2ZW50cyB0byBiZSBoYW5kbGVkIHR3aWNlLlxuICAgICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIC8vIFdlIG1pZ2h0IHdhbnQgdG8gdXNlIE5hbWVkTm9kZU1hcC5nZXROYW1lZEl0ZW0oJ2NsYXNzJylcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGFyZ2V0ICYmXG4gICAgICAgICAgdGFyZ2V0LmF0dHJpYnV0ZXMgJiZcbiAgICAgICAgICAodGFyZ2V0LmF0dHJpYnV0ZXMgYXMgYW55KS5jbGFzcyAmJlxuICAgICAgICAgICh0YXJnZXQuYXR0cmlidXRlcyBhcyBhbnkpLmNsYXNzLnZhbHVlXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9ICh0YXJnZXQuYXR0cmlidXRlcyBhcyBhbnkpLmNsYXNzLnZhbHVlO1xuICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuXG4gICAgICAgICAgLy8gU2VhcmNoIGJveCB3YW50cyB0byBoYW5kbGUgZXZlbnRzIGludGVybmFsbHlcbiAgICAgICAgICBpZiAoY2xhc3NOYW1lLmluY2x1ZGVzKCdMZWZ0UGFuZVNlYXJjaElucHV0X19pbnB1dCcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlc2UgYWRkIGxpc3RlbmVycyB0byBkb2N1bWVudCwgYnV0IHdlJ2xsIHJ1biBmaXJzdFxuICAgICAgICBjb25zdCBjb25maXJtYXRpb25Nb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgJy5tb2R1bGUtY29uZmlybWF0aW9uLWRpYWxvZ19fb3ZlcmxheSdcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGNvbmZpcm1hdGlvbk1vZGFsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW1vamlQaWNrZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kdWxlLWVtb2ppLXBpY2tlcicpO1xuICAgICAgICBpZiAoZW1vamlQaWNrZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaWdodEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5MaWdodGJveCcpO1xuICAgICAgICBpZiAobGlnaHRCb3gpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGlja2VyUGlja2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZHVsZS1zdGlja2VyLXBpY2tlcicpO1xuICAgICAgICBpZiAoc3RpY2tlclBpY2tlcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0aWNrZXJQcmV2aWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAnLm1vZHVsZS1zdGlja2VyLW1hbmFnZXJfX3ByZXZpZXctbW9kYWxfX292ZXJsYXknXG4gICAgICAgICk7XG4gICAgICAgIGlmIChzdGlja2VyUHJldmlldykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlYWN0aW9uVmlld2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAnLm1vZHVsZS1yZWFjdGlvbi12aWV3ZXInXG4gICAgICAgICk7XG4gICAgICAgIGlmIChyZWFjdGlvblZpZXdlcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlYWN0aW9uUGlja2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZHVsZS1SZWFjdGlvblBpY2tlcicpO1xuICAgICAgICBpZiAocmVhY3Rpb25QaWNrZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb250YWN0TW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kdWxlLWNvbnRhY3QtbW9kYWwnKTtcbiAgICAgICAgaWYgKGNvbnRhY3RNb2RhbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGFsSG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2R1bGUtbW9kYWwtaG9zdF9fb3ZlcmxheScpO1xuICAgICAgICBpZiAobW9kYWxIb3N0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlbmQgRXNjYXBlIHRvIGFjdGl2ZSBjb252ZXJzYXRpb24gc28gaXQgY2FuIGNsb3NlIHBhbmVsc1xuICAgICAgaWYgKGNvbnZlcnNhdGlvbiAmJiBrZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdlc2NhcGUtcHJlc3NlZCcpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVmZXJlbmNlcyAtIGhhbmRsZWQgYnkgRWxlY3Ryb24tbWFuYWdlZCBrZXlib2FyZCBzaG9ydGN1dHNcblxuICAgICAgLy8gT3BlbiB0aGUgdG9wLXJpZ2h0IG1lbnUgZm9yIGN1cnJlbnQgY29udmVyc2F0aW9uXG4gICAgICBpZiAoXG4gICAgICAgIGNvbnZlcnNhdGlvbiAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAgIChrZXkgPT09ICdsJyB8fCBrZXkgPT09ICdMJylcbiAgICAgICkge1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICcubW9kdWxlLUNvbnZlcnNhdGlvbkhlYWRlcl9fYnV0dG9uLS1tb3JlJ1xuICAgICAgICApO1xuICAgICAgICBpZiAoIWJ1dHRvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIG1lbnUgaXMgc2hvd24gYXQgYSBsb2NhdGlvbiBiYXNlZCBvbiB0aGUgaW5pdGlhdGluZyBjbGljaywgd2UgbmVlZFxuICAgICAgICAvLyAgIHRvIGZha2UgdXAgYSBtb3VzZSBldmVudCB0byBnZXQgdGhlIG1lbnUgdG8gc2hvdyBzb21ld2hlcmUgb3RoZXIgdGhhbiAoMCwwKS5cbiAgICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBidXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG1vdXNlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcbiAgICAgICAgLy8gVHlwZXMgZG8gbm90IG1hdGNoIHNpZ25hdHVyZVxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4gICAgICAgIG1vdXNlRXZlbnQuaW5pdE1vdXNlRXZlbnQoXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICB0cnVlLCAvLyBidWJibGVzXG4gICAgICAgICAgZmFsc2UsIC8vIGNhbmNlbGFibGVcbiAgICAgICAgICBudWxsIGFzIGFueSwgLy8gdmlld1xuICAgICAgICAgIG51bGwgYXMgYW55LCAvLyBkZXRhaWxcbiAgICAgICAgICAwLCAvLyBzY3JlZW5YLFxuICAgICAgICAgIDAsIC8vIHNjcmVlblksXG4gICAgICAgICAgeCArIHdpZHRoIC8gMixcbiAgICAgICAgICB5ICsgaGVpZ2h0IC8gMixcbiAgICAgICAgICBmYWxzZSwgLy8gY3RybEtleSxcbiAgICAgICAgICBmYWxzZSwgLy8gYWx0S2V5LFxuICAgICAgICAgIGZhbHNlLCAvLyBzaGlmdEtleSxcbiAgICAgICAgICBmYWxzZSwgLy8gbWV0YUtleSxcbiAgICAgICAgICBmYWxzZSBhcyBhbnksIC8vIGJ1dHRvbixcbiAgICAgICAgICBkb2N1bWVudC5ib2R5XG4gICAgICAgICk7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuXG4gICAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQpO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEZvY3VzIGNvbXBvc2VyIGZpZWxkXG4gICAgICBpZiAoXG4gICAgICAgIGNvbnZlcnNhdGlvbiAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAgIChrZXkgPT09ICd0JyB8fCBrZXkgPT09ICdUJylcbiAgICAgICkge1xuICAgICAgICBjb252ZXJzYXRpb24udHJpZ2dlcignZm9jdXMtY29tcG9zZXInKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gT3BlbiBhbGwgbWVkaWFcbiAgICAgIGlmIChcbiAgICAgICAgY29udmVyc2F0aW9uICYmXG4gICAgICAgIGNvbW1hbmRPckN0cmwgJiZcbiAgICAgICAgc2hpZnRLZXkgJiZcbiAgICAgICAgKGtleSA9PT0gJ20nIHx8IGtleSA9PT0gJ00nKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdvcGVuLWFsbC1tZWRpYScpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBPcGVuIGVtb2ppIHBpY2tlciAtIGhhbmRsZWQgYnkgY29tcG9uZW50XG5cbiAgICAgIC8vIE9wZW4gc3RpY2tlciBwaWNrZXIgLSBoYW5kbGVkIGJ5IGNvbXBvbmVudFxuXG4gICAgICAvLyBCZWdpbiByZWNvcmRpbmcgdm9pY2Ugbm90ZSAtIGhhbmRsZWQgYnkgY29tcG9uZW50XG5cbiAgICAgIC8vIEFyY2hpdmUgb3IgdW5hcmNoaXZlIGNvbnZlcnNhdGlvblxuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24gJiZcbiAgICAgICAgIWNvbnZlcnNhdGlvbi5nZXQoJ2lzQXJjaGl2ZWQnKSAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAgIChrZXkgPT09ICdhJyB8fCBrZXkgPT09ICdBJylcbiAgICAgICkge1xuICAgICAgICBjb252ZXJzYXRpb24uc2V0QXJjaGl2ZWQodHJ1ZSk7XG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCd1bmxvYWQnLCAna2V5Ym9hcmQgc2hvcnRjdXQgYXJjaGl2ZScpO1xuICAgICAgICBzaG93VG9hc3QoVG9hc3RDb252ZXJzYXRpb25BcmNoaXZlZCwge1xuICAgICAgICAgIHVuZG86ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5zZXRBcmNoaXZlZChmYWxzZSk7XG4gICAgICAgICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcihcbiAgICAgICAgICAgICAgJ3Nob3dDb252ZXJzYXRpb24nLFxuICAgICAgICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCdpZCcpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEl0J3MgdmVyeSBsaWtlbHkgdGhhdCB0aGUgYWN0IG9mIGFyY2hpdmluZyBhIGNvbnZlcnNhdGlvbiB3aWxsIHNldCBmb2N1cyB0b1xuICAgICAgICAvLyAgICdub25lLCcgb3IgdGhlIHRvcC1sZXZlbCBib2R5IGVsZW1lbnQuIFRoaXMgcmVzZXRzIGl0IHRvIHRoZSBsZWZ0IHBhbmUuXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgY29uc3QgbGVmdFBhbmVFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICcubW9kdWxlLWxlZnQtcGFuZV9fbGlzdCdcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChsZWZ0UGFuZUVsKSB7XG4gICAgICAgICAgICBsZWZ0UGFuZUVsLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgY29udmVyc2F0aW9uICYmXG4gICAgICAgIGNvbnZlcnNhdGlvbi5nZXQoJ2lzQXJjaGl2ZWQnKSAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAgIChrZXkgPT09ICd1JyB8fCBrZXkgPT09ICdVJylcbiAgICAgICkge1xuICAgICAgICBjb252ZXJzYXRpb24uc2V0QXJjaGl2ZWQoZmFsc2UpO1xuICAgICAgICBzaG93VG9hc3QoVG9hc3RDb252ZXJzYXRpb25VbmFyY2hpdmVkKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBTY3JvbGwgdG8gYm90dG9tIG9mIGxpc3QgLSBoYW5kbGVkIGJ5IGNvbXBvbmVudFxuXG4gICAgICAvLyBTY3JvbGwgdG8gdG9wIG9mIGxpc3QgLSBoYW5kbGVkIGJ5IGNvbXBvbmVudFxuXG4gICAgICAvLyBDbG9zZSBjb252ZXJzYXRpb25cbiAgICAgIGlmIChcbiAgICAgICAgY29udmVyc2F0aW9uICYmXG4gICAgICAgIGNvbW1hbmRPckN0cmwgJiZcbiAgICAgICAgc2hpZnRLZXkgJiZcbiAgICAgICAgKGtleSA9PT0gJ2MnIHx8IGtleSA9PT0gJ0MnKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCd1bmxvYWQnLCAna2V5Ym9hcmQgc2hvcnRjdXQgY2xvc2UnKTtcbiAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNob3dDb252ZXJzYXRpb24oe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiB1bmRlZmluZWQsXG4gICAgICAgICAgbWVzc2FnZUlkOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBNRVNTQUdFU1xuXG4gICAgICAvLyBTaG93IG1lc3NhZ2UgZGV0YWlsc1xuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24gJiZcbiAgICAgICAgY29tbWFuZE9yQ3RybCAmJlxuICAgICAgICAhc2hpZnRLZXkgJiZcbiAgICAgICAgKGtleSA9PT0gJ2QnIHx8IGtleSA9PT0gJ0QnKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRNZXNzYWdlIH0gPSBzdGF0ZS5jb252ZXJzYXRpb25zO1xuICAgICAgICBpZiAoIXNlbGVjdGVkTWVzc2FnZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdzaG93LW1lc3NhZ2UtZGV0YWlscycsIHNlbGVjdGVkTWVzc2FnZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRvZ2dsZSByZXBseSB0byBtZXNzYWdlXG4gICAgICBpZiAoXG4gICAgICAgIGNvbnZlcnNhdGlvbiAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAgIChrZXkgPT09ICdyJyB8fCBrZXkgPT09ICdSJylcbiAgICAgICkge1xuICAgICAgICBjb25zdCB7IHNlbGVjdGVkTWVzc2FnZSB9ID0gc3RhdGUuY29udmVyc2F0aW9ucztcblxuICAgICAgICBjb252ZXJzYXRpb24udHJpZ2dlcigndG9nZ2xlLXJlcGx5Jywgc2VsZWN0ZWRNZXNzYWdlKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU2F2ZSBhdHRhY2htZW50XG4gICAgICBpZiAoXG4gICAgICAgIGNvbnZlcnNhdGlvbiAmJlxuICAgICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAgICFzaGlmdEtleSAmJlxuICAgICAgICAoa2V5ID09PSAncycgfHwga2V5ID09PSAnUycpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZE1lc3NhZ2UgfSA9IHN0YXRlLmNvbnZlcnNhdGlvbnM7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkTWVzc2FnZSkge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdzYXZlLWF0dGFjaG1lbnQnLCBzZWxlY3RlZE1lc3NhZ2UpO1xuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24gJiZcbiAgICAgICAgY29tbWFuZE9yQ3RybCAmJlxuICAgICAgICBzaGlmdEtleSAmJlxuICAgICAgICAoa2V5ID09PSAnZCcgfHwga2V5ID09PSAnRCcpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZE1lc3NhZ2UgfSA9IHN0YXRlLmNvbnZlcnNhdGlvbnM7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkTWVzc2FnZSkge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdkZWxldGUtbWVzc2FnZScsIHNlbGVjdGVkTWVzc2FnZSk7XG5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDT01QT1NFUlxuXG4gICAgICAvLyBDcmVhdGUgYSBuZXdsaW5lIGluIHlvdXIgbWVzc2FnZSAtIGhhbmRsZWQgYnkgY29tcG9uZW50XG5cbiAgICAgIC8vIEV4cGFuZCBjb21wb3NlciAtIGhhbmRsZWQgYnkgY29tcG9uZW50XG5cbiAgICAgIC8vIFNlbmQgaW4gZXhwYW5kZWQgY29tcG9zZXIgLSBoYW5kbGVkIGJ5IGNvbXBvbmVudFxuXG4gICAgICAvLyBBdHRhY2ggZmlsZVxuICAgICAgLy8gaG9va3MvdXNlS2V5Ym9hcmRTaG9yY3V0cyB1c2VBdHRhY2hGaWxlU2hvcnRjdXRcblxuICAgICAgLy8gUmVtb3ZlIGRyYWZ0IGxpbmsgcHJldmlld1xuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24gJiZcbiAgICAgICAgY29tbWFuZE9yQ3RybCAmJlxuICAgICAgICAhc2hpZnRLZXkgJiZcbiAgICAgICAgKGtleSA9PT0gJ3AnIHx8IGtleSA9PT0gJ1AnKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbi50cmlnZ2VyKCdyZW1vdmUtbGluay1yZXZpZXcnKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBBdHRhY2ggZmlsZVxuICAgICAgaWYgKFxuICAgICAgICBjb252ZXJzYXRpb24gJiZcbiAgICAgICAgY29tbWFuZE9yQ3RybCAmJlxuICAgICAgICBzaGlmdEtleSAmJlxuICAgICAgICAoa2V5ID09PSAncCcgfHwga2V5ID09PSAnUCcpXG4gICAgICApIHtcbiAgICAgICAgY29udmVyc2F0aW9uLnRyaWdnZXIoJ3JlbW92ZS1hbGwtZHJhZnQtYXR0YWNobWVudHMnKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQ29tbWVudGVkIG91dCBiZWNhdXNlIHRoaXMgaXMgdGhlIGxhc3QgaXRlbVxuICAgICAgICAvLyByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3NldHVwQXNOZXdEZXZpY2UnLCAoKSA9PiB7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5hcHAub3Blbkluc3RhbGxlcigpO1xuICB9KTtcblxuICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3NldHVwQXNTdGFuZGFsb25lJywgKCkgPT4ge1xuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuYXBwLm9wZW5TdGFuZGFsb25lKCk7XG4gIH0pO1xuXG4gIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbigncG93ZXJNb25pdG9yU3VzcGVuZCcsICgpID0+IHtcbiAgICBsb2cuaW5mbygncG93ZXJNb25pdG9yOiBzdXNwZW5kJyk7XG4gICAgc3VzcGVuZFRhc2tzV2l0aFRpbWVvdXQoKTtcbiAgfSk7XG5cbiAgd2luZG93LldoaXNwZXIuZXZlbnRzLm9uKCdwb3dlck1vbml0b3JSZXN1bWUnLCAoKSA9PiB7XG4gICAgbG9nLmluZm8oJ3Bvd2VyTW9uaXRvcjogcmVzdW1lJyk7XG4gICAgc2VydmVyPy5jaGVja1NvY2tldHMoKTtcbiAgICByZXN1bWVUYXNrc1dpdGhUaW1lb3V0KCk7XG4gIH0pO1xuXG4gIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbigncG93ZXJNb25pdG9yTG9ja1NjcmVlbicsICgpID0+IHtcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNhbGxpbmcuaGFuZ1VwQWN0aXZlQ2FsbCgpO1xuICB9KTtcblxuICBjb25zdCByZWNvbm5lY3RUb1dlYlNvY2tldFF1ZXVlID0gbmV3IExhdGVzdFF1ZXVlKCk7XG5cbiAgY29uc3QgZW5xdWV1ZVJlY29ubmVjdFRvV2ViU29ja2V0ID0gKCkgPT4ge1xuICAgIHJlY29ubmVjdFRvV2ViU29ja2V0UXVldWUuYWRkKGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghc2VydmVyKSB7XG4gICAgICAgIGxvZy5pbmZvKCdyZWNvbm5lY3RUb1dlYlNvY2tldDogTm8gc2VydmVyLiBFYXJseSByZXR1cm4uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oJ3JlY29ubmVjdFRvV2ViU29ja2V0IHN0YXJ0aW5nLi4uJyk7XG4gICAgICBhd2FpdCBzZXJ2ZXIub25PZmZsaW5lKCk7XG4gICAgICBhd2FpdCBzZXJ2ZXIub25PbmxpbmUoKTtcbiAgICAgIGxvZy5pbmZvKCdyZWNvbm5lY3RUb1dlYlNvY2tldCBjb21wbGV0ZS4nKTtcbiAgICB9KTtcbiAgfTtcblxuICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oXG4gICAgJ21pZ2h0QmVVbmxpbmtlZCcsXG4gICAgd2luZG93Ll8uZGVib3VuY2UoZW5xdWV1ZVJlY29ubmVjdFRvV2ViU29ja2V0LCAxMDAwLCB7IG1heFdhaXQ6IDUwMDAgfSlcbiAgKTtcblxuICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3VubGlua0FuZERpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgdW5saW5rQW5kRGlzY29ubmVjdChSZW1vdmVBbGxDb25maWd1cmF0aW9uLkZ1bGwpO1xuICB9KTtcblxuICBhc3luYyBmdW5jdGlvbiBydW5TdG9yYWdlU2VydmljZSgpIHtcbiAgICB3aW5kb3cuU2lnbmFsLlNlcnZpY2VzLmVuYWJsZVN0b3JhZ2VTZXJ2aWNlKCk7XG5cbiAgICBpZiAod2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuYXJlV2VQcmltYXJ5RGV2aWNlKCkpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICAnYmFja2dyb3VuZC9ydW5TdG9yYWdlU2VydmljZTogV2UgYXJlIHByaW1hcnkgZGV2aWNlOyBub3Qgc2VuZGluZyBrZXkgc3luYyByZXF1ZXN0J1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2luZ2xlUHJvdG9Kb2JRdWV1ZS5hZGQoTWVzc2FnZVNlbmRlci5nZXRSZXF1ZXN0S2V5U3luY01lc3NhZ2UoKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ3J1blN0b3JhZ2VTZXJ2aWNlOiBGYWlsZWQgdG8gcXVldWUgc3luYyBtZXNzYWdlJyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAvLyBTdG9yYWdlIGlzIHJlYWR5IGJlY2F1c2UgYHN0YXJ0KClgIGlzIGNhbGxlZCBmcm9tIGBzdG9yYWdlLm9ucmVhZHkoKWBcblxuICAgIHN0cmljdEFzc2VydChjaGFsbGVuZ2VIYW5kbGVyLCAnc3RhcnQ6IGNoYWxsZW5nZUhhbmRsZXInKTtcbiAgICBhd2FpdCBjaGFsbGVuZ2VIYW5kbGVyLmxvYWQoKTtcblxuICAgIGlmICghd2luZG93LnN0b3JhZ2UudXNlci5nZXROdW1iZXIoKSkge1xuICAgICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uID1cbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uKCk7XG4gICAgICBjb25zdCBvdXJFMTY0ID0gb3VyQ29udmVyc2F0aW9uPy5nZXQoJ2UxNjQnKTtcbiAgICAgIGlmIChvdXJFMTY0KSB7XG4gICAgICAgIGxvZy53YXJuKCdSZXN0b3JpbmcgRTE2NCBmcm9tIG91ciBjb252ZXJzYXRpb24nKTtcbiAgICAgICAgd2luZG93LnN0b3JhZ2UudXNlci5zZXROdW1iZXIob3VyRTE2NCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5ld1ZlcnNpb24gJiYgbGFzdFZlcnNpb24pIHtcbiAgICAgIGlmICh3aW5kb3cuaXNCZWZvcmVWZXJzaW9uKGxhc3RWZXJzaW9uLCAndjUuMzEuMCcpKSB7XG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLnJlcGFpclBpbm5lZENvbnZlcnNhdGlvbnMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3N0b3JhZ2VfcmVhZHknKSk7XG5cbiAgICBiYWRnZUltYWdlRmlsZURvd25sb2FkZXIuY2hlY2tGb3JGaWxlc1RvRG93bmxvYWQoKTtcblxuICAgIGxvZy5pbmZvKCdFeHBpcmF0aW9uIHN0YXJ0IHRpbWVzdGFtcCBjbGVhbnVwOiBzdGFydGluZy4uLicpO1xuICAgIGNvbnN0IG1lc3NhZ2VzVW5leHBlY3RlZGx5TWlzc2luZ0V4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0TWVzc2FnZXNVbmV4cGVjdGVkbHlNaXNzaW5nRXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wKCk7XG4gICAgbG9nLmluZm8oXG4gICAgICBgRXhwaXJhdGlvbiBzdGFydCB0aW1lc3RhbXAgY2xlYW51cDogRm91bmQgJHttZXNzYWdlc1VuZXhwZWN0ZWRseU1pc3NpbmdFeHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAubGVuZ3RofSBtZXNzYWdlcyBmb3IgY2xlYW51cGBcbiAgICApO1xuICAgIGlmICghd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKSkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIFwiRXhwaXJhdGlvbiBzdGFydCB0aW1lc3RhbXAgY2xlYW51cDogQ2FuY2VsbGluZyB1cGRhdGU7IHdlIGRvbid0IGhhdmUgb3VyIG93biBVVUlEXCJcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlc1VuZXhwZWN0ZWRseU1pc3NpbmdFeHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAubGVuZ3RoKSB7XG4gICAgICBjb25zdCBuZXdNZXNzYWdlQXR0cmlidXRlcyA9XG4gICAgICAgIG1lc3NhZ2VzVW5leHBlY3RlZGx5TWlzc2luZ0V4cGlyYXRpb25TdGFydFRpbWVzdGFtcC5tYXAobWVzc2FnZSA9PiB7XG4gICAgICAgICAgY29uc3QgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wID0gTWF0aC5taW4oXG4gICAgICAgICAgICAuLi5maWx0ZXIoXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBUaGVzZSBtZXNzYWdlcyBzaG91bGQgYWx3YXlzIGhhdmUgYSBzZW50X2F0LCBidXQgd2UgaGF2ZSBmYWxsYmFja3NcbiAgICAgICAgICAgICAgICAvLyAgIGp1c3QgaW4gY2FzZS5cbiAgICAgICAgICAgICAgICBtZXNzYWdlLnNlbnRfYXQsXG4gICAgICAgICAgICAgICAgRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICAvLyBUaGUgcXVlcnkgc2hvdWxkbid0IHJldHVybiBtZXNzYWdlcyB3aXRoIGV4cGlyYXRpb24gc3RhcnQgdGltZXN0YW1wcyxcbiAgICAgICAgICAgICAgICAvLyAgIGJ1dCB3ZSdyZSB0cnlpbmcgdG8gYmUgZXh0cmEgY2FyZWZ1bC5cbiAgICAgICAgICAgICAgICBtZXNzYWdlLmV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgaXNOb3ROaWxcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYEV4cGlyYXRpb24gc3RhcnQgdGltZXN0YW1wIGNsZWFudXA6IHN0YXJ0aW5nIHRpbWVyIGZvciAke21lc3NhZ2UudHlwZX0gbWVzc2FnZSBzZW50IGF0ICR7bWVzc2FnZS5zZW50X2F0fS4gU3RhcnRpbmcgdGltZXIgYXQgJHtleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXB9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLm1lc3NhZ2UsXG4gICAgICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZXMobmV3TWVzc2FnZUF0dHJpYnV0ZXMsIHtcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsb2cuaW5mbygnRXhwaXJhdGlvbiBzdGFydCB0aW1lc3RhbXAgY2xlYW51cDogY29tcGxldGUnKTtcblxuICAgIGxvZy5pbmZvKCdsaXN0ZW5pbmcgZm9yIHJlZ2lzdHJhdGlvbiBldmVudHMnKTtcbiAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3JlZ2lzdHJhdGlvbl9kb25lJywgKCkgPT4ge1xuICAgICAgbG9nLmluZm8oJ2hhbmRsaW5nIHJlZ2lzdHJhdGlvbiBldmVudCcpO1xuXG4gICAgICBzdHJpY3RBc3NlcnQoc2VydmVyICE9PSB1bmRlZmluZWQsICdXZWJBUEkgbm90IHJlYWR5Jyk7XG4gICAgICBzZXJ2ZXIuYXV0aGVudGljYXRlKFxuICAgICAgICB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0V2ViQVBJQ3JlZGVudGlhbHMoKVxuICAgICAgKTtcbiAgICAgIGNvbm5lY3QodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBjYW5jZWxJbml0aWFsaXphdGlvbk1lc3NhZ2UoKTtcbiAgICByZW5kZXIoXG4gICAgICB3aW5kb3cuU2lnbmFsLlN0YXRlLlJvb3RzLmNyZWF0ZUFwcCh3aW5kb3cucmVkdXhTdG9yZSksXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwLWNvbnRhaW5lcicpXG4gICAgKTtcbiAgICBjb25zdCBoaWRlTWVudUJhciA9IHdpbmRvdy5zdG9yYWdlLmdldCgnaGlkZS1tZW51LWJhcicsIGZhbHNlKTtcbiAgICB3aW5kb3cuc2V0QXV0b0hpZGVNZW51QmFyKGhpZGVNZW51QmFyKTtcbiAgICB3aW5kb3cuc2V0TWVudUJhclZpc2liaWxpdHkoIWhpZGVNZW51QmFyKTtcblxuICAgIHN0YXJ0VGltZVRyYXZlbERldGVjdG9yKCgpID0+IHtcbiAgICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCd0aW1ldHJhdmVsJyk7XG4gICAgfSk7XG5cbiAgICBleHBpcmluZ01lc3NhZ2VzRGVsZXRpb25TZXJ2aWNlLnVwZGF0ZSgpO1xuICAgIHRhcFRvVmlld01lc3NhZ2VzRGVsZXRpb25TZXJ2aWNlLnVwZGF0ZSgpO1xuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbigndGltZXRyYXZlbCcsICgpID0+IHtcbiAgICAgIGV4cGlyaW5nTWVzc2FnZXNEZWxldGlvblNlcnZpY2UudXBkYXRlKCk7XG4gICAgICB0YXBUb1ZpZXdNZXNzYWdlc0RlbGV0aW9uU2VydmljZS51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGlzQ29yZURhdGFWYWxpZCA9IEJvb2xlYW4oXG4gICAgICB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZCgpICYmXG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbigpXG4gICAgKTtcblxuICAgIGlmIChpc0NvcmVEYXRhVmFsaWQgJiYgd2luZG93LlNpZ25hbC5VdGlsLlJlZ2lzdHJhdGlvbi5ldmVyRG9uZSgpKSB7XG4gICAgICBjb25uZWN0KCk7XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmFwcC5vcGVuSW5ib3goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5hcHAub3Blbkluc3RhbGxlcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYWN0aXZlV2luZG93U2VydmljZSB9ID0gd2luZG93LlNpZ25hbENvbnRleHQ7XG5cbiAgICBhY3RpdmVXaW5kb3dTZXJ2aWNlLnJlZ2lzdGVyRm9yQWN0aXZlKCgpID0+IG5vdGlmaWNhdGlvblNlcnZpY2UuY2xlYXIoKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsICgpID0+IG5vdGlmaWNhdGlvblNlcnZpY2UuZmFzdENsZWFyKCkpO1xuXG4gICAgbm90aWZpY2F0aW9uU2VydmljZS5vbignY2xpY2snLCAoaWQsIG1lc3NhZ2VJZCkgPT4ge1xuICAgICAgd2luZG93LnNob3dXaW5kb3coKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcignc2hvd0NvbnZlcnNhdGlvbicsIGlkLCBtZXNzYWdlSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5hcHAub3BlbkluYm94KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBNYXliZSByZWZyZXNoIHJlbW90ZSBjb25maWd1cmF0aW9uIHdoZW4gd2UgYmVjb21lIGFjdGl2ZVxuICAgIGFjdGl2ZVdpbmRvd1NlcnZpY2UucmVnaXN0ZXJGb3JBY3RpdmUoYXN5bmMgKCkgPT4ge1xuICAgICAgc3RyaWN0QXNzZXJ0KHNlcnZlciAhPT0gdW5kZWZpbmVkLCAnV2ViQVBJIG5vdCByZWFkeScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLlJlbW90ZUNvbmZpZy5tYXliZVJlZnJlc2hSZW1vdGVDb25maWcoc2VydmVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvcikge1xuICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgYHJlZ2lzdGVyRm9yQWN0aXZlOiBGYWlsZWQgdG8gdG8gcmVmcmVzaCByZW1vdGUgY29uZmlnLiBDb2RlOiAke2Vycm9yLmNvZGV9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBgZGVza3RvcC5jbGllbnRFeHBpcmF0aW9uYCByZW1vdGUgZmxhZ1xuICAgIHdpbmRvdy5TaWduYWwuUmVtb3RlQ29uZmlnLm9uQ2hhbmdlKFxuICAgICAgJ2Rlc2t0b3AuY2xpZW50RXhwaXJhdGlvbicsXG4gICAgICAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW90ZUJ1aWxkRXhwaXJhdGlvblRpbWVzdGFtcCA9XG4gICAgICAgICAgd2luZG93LlNpZ25hbC5VdGlsLnBhcnNlUmVtb3RlQ2xpZW50RXhwaXJhdGlvbih2YWx1ZSBhcyBzdHJpbmcpO1xuICAgICAgICBpZiAocmVtb3RlQnVpbGRFeHBpcmF0aW9uVGltZXN0YW1wKSB7XG4gICAgICAgICAgd2luZG93LnN0b3JhZ2UucHV0KFxuICAgICAgICAgICAgJ3JlbW90ZUJ1aWxkRXhwaXJhdGlvbicsXG4gICAgICAgICAgICByZW1vdGVCdWlsZEV4cGlyYXRpb25UaW1lc3RhbXBcbiAgICAgICAgICApO1xuICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuZXhwaXJhdGlvbi5oeWRyYXRlRXhwaXJhdGlvblN0YXR1cyhcbiAgICAgICAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5oYXNFeHBpcmVkKClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgYGRlc2t0b3AubWVzc2FnZVJlcXVlc3RzYCByZW1vdGUgY29uZmlndXJhdGlvbiBmbGFnXG4gICAgY29uc3QgcmVtb3ZlTWVzc2FnZVJlcXVlc3RMaXN0ZW5lciA9IHdpbmRvdy5TaWduYWwuUmVtb3RlQ29uZmlnLm9uQ2hhbmdlKFxuICAgICAgJ2Rlc2t0b3AubWVzc2FnZVJlcXVlc3RzJyxcbiAgICAgICh7IGVuYWJsZWQgfSkgPT4ge1xuICAgICAgICBpZiAoIWVuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb252ZXJzYXRpb25zID0gd2luZG93LmdldENvbnZlcnNhdGlvbnMoKTtcbiAgICAgICAgY29udmVyc2F0aW9ucy5mb3JFYWNoKGNvbnZlcnNhdGlvbiA9PiB7XG4gICAgICAgICAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgICBtZXNzYWdlQ291bnRCZWZvcmVNZXNzYWdlUmVxdWVzdHM6XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5nZXQoJ21lc3NhZ2VDb3VudCcpIHx8IDAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlbW92ZU1lc3NhZ2VSZXF1ZXN0TGlzdGVuZXIoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKHJlc29sdmVPbkFwcFZpZXcpIHtcbiAgICAgIHJlc29sdmVPbkFwcFZpZXcoKTtcbiAgICAgIHJlc29sdmVPbkFwcFZpZXcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmdldFN5bmNSZXF1ZXN0ID0gKHRpbWVvdXRNaWxsaXM/OiBudW1iZXIpID0+IHtcbiAgICBzdHJpY3RBc3NlcnQobWVzc2FnZVJlY2VpdmVyLCAnTWVzc2FnZVJlY2VpdmVyIG5vdCBpbml0aWFsaXplZCcpO1xuXG4gICAgY29uc3Qgc3luY1JlcXVlc3QgPSBuZXcgd2luZG93LnRleHRzZWN1cmUuU3luY1JlcXVlc3QoXG4gICAgICBtZXNzYWdlUmVjZWl2ZXIsXG4gICAgICB0aW1lb3V0TWlsbGlzXG4gICAgKTtcbiAgICBzeW5jUmVxdWVzdC5zdGFydCgpO1xuICAgIHJldHVybiBzeW5jUmVxdWVzdDtcbiAgfTtcblxuICBsZXQgZGlzY29ubmVjdFRpbWVyOiBUaW1lcnMuVGltZW91dCB8IHVuZGVmaW5lZDtcbiAgbGV0IHJlY29ubmVjdFRpbWVyOiBUaW1lcnMuVGltZW91dCB8IHVuZGVmaW5lZDtcbiAgZnVuY3Rpb24gb25PZmZsaW5lKCkge1xuICAgIGxvZy5pbmZvKCdvZmZsaW5lJyk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIG9uT2ZmbGluZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIG9uT25saW5lKTtcblxuICAgIC8vIFdlJ3ZlIHJlY2VpdmVkIGxvZ3MgZnJvbSBMaW51eCB3aGVyZSB3ZSBnZXQgYW4gJ29mZmxpbmUnIGV2ZW50LCB0aGVuIDMwbXMgbGF0ZXJcbiAgICAvLyAgIHdlIGdldCBhbiBvbmxpbmUgZXZlbnQuIFRoaXMgd2FpdHMgYSBiaXQgYWZ0ZXIgZ2V0dGluZyBhbiAnb2ZmbGluZScgZXZlbnRcbiAgICAvLyAgIGJlZm9yZSBkaXNjb25uZWN0aW5nIHRoZSBzb2NrZXQgbWFudWFsbHkuXG4gICAgZGlzY29ubmVjdFRpbWVyID0gVGltZXJzLnNldFRpbWVvdXQoZGlzY29ubmVjdCwgMTAwMCk7XG5cbiAgICBpZiAoY2hhbGxlbmdlSGFuZGxlcikge1xuICAgICAgY2hhbGxlbmdlSGFuZGxlci5vbk9mZmxpbmUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbk9ubGluZSgpIHtcbiAgICBsb2cuaW5mbygnb25saW5lJyk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgb25PbmxpbmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgb25PZmZsaW5lKTtcblxuICAgIGlmIChkaXNjb25uZWN0VGltZXIgJiYgaXNTb2NrZXRPbmxpbmUoKSkge1xuICAgICAgbG9nLndhcm4oJ0FscmVhZHkgb25saW5lLiBIYWQgYSBibGlwIGluIG9ubGluZS9vZmZsaW5lIHN0YXR1cy4nKTtcbiAgICAgIFRpbWVycy5jbGVhclRpbWVvdXQoZGlzY29ubmVjdFRpbWVyKTtcbiAgICAgIGRpc2Nvbm5lY3RUaW1lciA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGRpc2Nvbm5lY3RUaW1lcikge1xuICAgICAgVGltZXJzLmNsZWFyVGltZW91dChkaXNjb25uZWN0VGltZXIpO1xuICAgICAgZGlzY29ubmVjdFRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU29ja2V0T25saW5lKCkge1xuICAgIGNvbnN0IHNvY2tldFN0YXR1cyA9IHdpbmRvdy5nZXRTb2NrZXRTdGF0dXMoKTtcbiAgICByZXR1cm4gKFxuICAgICAgc29ja2V0U3RhdHVzID09PSBTb2NrZXRTdGF0dXMuQ09OTkVDVElORyB8fFxuICAgICAgc29ja2V0U3RhdHVzID09PSBTb2NrZXRTdGF0dXMuT1BFTlxuICAgICk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICAgIGxvZy5pbmZvKCdkaXNjb25uZWN0Jyk7XG5cbiAgICAvLyBDbGVhciB0aW1lciwgc2luY2Ugd2UncmUgb25seSBjYWxsZWQgd2hlbiB0aGUgdGltZXIgaXMgZXhwaXJlZFxuICAgIGRpc2Nvbm5lY3RUaW1lciA9IHVuZGVmaW5lZDtcblxuICAgIEF0dGFjaG1lbnREb3dubG9hZHMuc3RvcCgpO1xuICAgIGlmIChzZXJ2ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBtZXNzYWdlUmVjZWl2ZXIgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgJ1dlYkFQSSBzaG91bGQgYmUgaW5pdGlhbGl6ZWQgdG9nZXRoZXIgd2l0aCBNZXNzYWdlUmVjZWl2ZXInXG4gICAgICApO1xuICAgICAgYXdhaXQgc2VydmVyLm9uT2ZmbGluZSgpO1xuICAgICAgYXdhaXQgbWVzc2FnZVJlY2VpdmVyLmRyYWluKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2hlbiB0cnVlIC0gd2UgYXJlIHJ1bm5pbmcgdGhlIHZlcnkgZmlyc3Qgc3RvcmFnZSBhbmQgY29udGFjdCBzeW5jIGFmdGVyXG4gIC8vIGxpbmtpbmcuXG4gIGxldCBpc0luaXRpYWxTeW5jID0gZmFsc2U7XG5cbiAgbGV0IGNvbm5lY3RDb3VudCA9IDA7XG4gIGxldCBjb25uZWN0aW5nID0gZmFsc2U7XG4gIGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3QoZmlyc3RSdW4/OiBib29sZWFuKSB7XG4gICAgaWYgKGNvbm5lY3RpbmcpIHtcbiAgICAgIGxvZy53YXJuKCdjb25uZWN0IGFscmVhZHkgcnVubmluZycsIHsgY29ubmVjdENvdW50IH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0cmljdEFzc2VydChzZXJ2ZXIgIT09IHVuZGVmaW5lZCwgJ1dlYkFQSSBub3QgY29ubmVjdGVkJyk7XG5cbiAgICB0cnkge1xuICAgICAgY29ubmVjdGluZyA9IHRydWU7XG5cbiAgICAgIC8vIFJlc2V0IHRoZSBmbGFnIGFuZCB1cGRhdGUgaXQgYmVsb3cgaWYgbmVlZGVkXG4gICAgICBpc0luaXRpYWxTeW5jID0gZmFsc2U7XG5cbiAgICAgIGxvZy5pbmZvKCdjb25uZWN0JywgeyBmaXJzdFJ1biwgY29ubmVjdENvdW50IH0pO1xuXG4gICAgICBpZiAocmVjb25uZWN0VGltZXIpIHtcbiAgICAgICAgVGltZXJzLmNsZWFyVGltZW91dChyZWNvbm5lY3RUaW1lcik7XG4gICAgICAgIHJlY29ubmVjdFRpbWVyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICAvLyBCb290c3RyYXAgb3VyIG9ubGluZS9vZmZsaW5lIGRldGVjdGlvbiwgb25seSB0aGUgZmlyc3QgdGltZSB3ZSBjb25uZWN0XG4gICAgICBpZiAoY29ubmVjdENvdW50ID09PSAwICYmIG5hdmlnYXRvci5vbkxpbmUpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCBvbk9mZmxpbmUpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbm5lY3RDb3VudCA9PT0gMCAmJiAhbmF2aWdhdG9yLm9uTGluZSkge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnU3RhcnRpbmcgdXAgb2ZmbGluZTsgd2lsbCBjb25uZWN0IHdoZW4gd2UgaGF2ZSBuZXR3b3JrIGFjY2VzcydcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIG9uT25saW5lKTtcbiAgICAgICAgb25FbXB0eSgpOyAvLyB0aGlzIGVuc3VyZXMgdGhhdCB0aGUgbG9hZGluZyBzY3JlZW4gaXMgZGlzbWlzc2VkXG5cbiAgICAgICAgLy8gU3dpdGNoIHRvIGluYm94IHZpZXcgZXZlbiBpZiBjb250YWN0IHN5bmMgaXMgc3RpbGwgcnVubmluZ1xuICAgICAgICBpZiAoXG4gICAgICAgICAgd2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKS5hcHAuYXBwVmlldyA9PT0gQXBwVmlld1R5cGUuSW5zdGFsbGVyXG4gICAgICAgICkge1xuICAgICAgICAgIGxvZy5pbmZvKCdmaXJzdFJ1bjogb2ZmbGluZSwgb3BlbmluZyBpbmJveCcpO1xuICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuYXBwLm9wZW5JbmJveCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy5pbmZvKCdmaXJzdFJ1bjogb2ZmbGluZSwgbm90IG9wZW5pbmcgaW5ib3gnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghd2luZG93LlNpZ25hbC5VdGlsLlJlZ2lzdHJhdGlvbi5ldmVyRG9uZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nID0gbmV3IHdpbmRvdy50ZXh0c2VjdXJlLk1lc3NhZ2VTZW5kZXIoc2VydmVyKTtcblxuICAgICAgLy8gVXBkYXRlIG91ciBwcm9maWxlIGtleSBpbiB0aGUgY29udmVyc2F0aW9uIGlmIHdlIGp1c3QgZ290IGxpbmtlZC5cbiAgICAgIGNvbnN0IHByb2ZpbGVLZXkgPSBhd2FpdCBvdXJQcm9maWxlS2V5U2VydmljZS5nZXQoKTtcbiAgICAgIGlmIChmaXJzdFJ1biAmJiBwcm9maWxlS2V5KSB7XG4gICAgICAgIGNvbnN0IG1lID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uKCk7XG4gICAgICAgIHN0cmljdEFzc2VydChtZSAhPT0gdW5kZWZpbmVkLCBcIkRpZG4ndCBmaW5kIG5ld2x5IGNyZWF0ZWQgb3Vyc2VsdmVzXCIpO1xuICAgICAgICBhd2FpdCBtZS5zZXRQcm9maWxlS2V5KEJ5dGVzLnRvQmFzZTY0KHByb2ZpbGVLZXkpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbm5lY3RDb3VudCA9PT0gMCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEZvcmNlIGEgcmUtZmV0Y2ggYmVmb3JlIHdlIHByb2Nlc3Mgb3VyIHF1ZXVlLiBXZSBtYXkgd2FudCB0byB0dXJuIG9uXG4gICAgICAgICAgLy8gICBzb21ldGhpbmcgd2hpY2ggY2hhbmdlcyBob3cgd2UgcHJvY2VzcyBpbmNvbWluZyBtZXNzYWdlcyFcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLlJlbW90ZUNvbmZpZy5yZWZyZXNoUmVtb3RlQ29uZmlnKHNlcnZlcik7XG5cbiAgICAgICAgICBjb25zdCBleHBpcmF0aW9uID0gd2luZG93LlNpZ25hbC5SZW1vdGVDb25maWcuZ2V0VmFsdWUoXG4gICAgICAgICAgICAnZGVza3RvcC5jbGllbnRFeHBpcmF0aW9uJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGV4cGlyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW90ZUJ1aWxkRXhwaXJhdGlvblRpbWVzdGFtcCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5wYXJzZVJlbW90ZUNsaWVudEV4cGlyYXRpb24oXG4gICAgICAgICAgICAgICAgZXhwaXJhdGlvbiBhcyBzdHJpbmdcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChyZW1vdGVCdWlsZEV4cGlyYXRpb25UaW1lc3RhbXApIHtcbiAgICAgICAgICAgICAgd2luZG93LnN0b3JhZ2UucHV0KFxuICAgICAgICAgICAgICAgICdyZW1vdGVCdWlsZEV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgIHJlbW90ZUJ1aWxkRXhwaXJhdGlvblRpbWVzdGFtcFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmV4cGlyYXRpb24uaHlkcmF0ZUV4cGlyYXRpb25TdGF0dXMoXG4gICAgICAgICAgICAgICAgd2luZG93LlNpZ25hbC5VdGlsLmhhc0V4cGlyZWQoKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnY29ubmVjdDogRXJyb3IgcmVmcmVzaGluZyByZW1vdGUgY29uZmlnOicsXG4gICAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBsb25lbHlFMTY0Q29udmVyc2F0aW9ucyA9IHdpbmRvd1xuICAgICAgICAgICAgLmdldENvbnZlcnNhdGlvbnMoKVxuICAgICAgICAgICAgLmZpbHRlcihjID0+XG4gICAgICAgICAgICAgIEJvb2xlYW4oXG4gICAgICAgICAgICAgICAgaXNEaXJlY3RDb252ZXJzYXRpb24oYy5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICAgICAgICAgICAgYy5nZXQoJ2UxNjQnKSAmJlxuICAgICAgICAgICAgICAgICAgIWMuZ2V0KCd1dWlkJykgJiZcbiAgICAgICAgICAgICAgICAgICFjLmlzRXZlclVucmVnaXN0ZXJlZCgpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgYXdhaXQgdXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uczogbG9uZWx5RTE2NENvbnZlcnNhdGlvbnMsXG4gICAgICAgICAgICBtZXNzYWdpbmc6IHdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnY29ubmVjdDogRXJyb3IgZmV0Y2hpbmcgVVVJRHMgZm9yIGxvbmVseSBlMTY0czonLFxuICAgICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25uZWN0Q291bnQgKz0gMTtcblxuICAgICAgLy8gVG8gYXZvaWQgYSBmbG9vZCBvZiBvcGVyYXRpb25zIGJlZm9yZSB3ZSBjYXRjaCB1cCwgd2UgcGF1c2Ugc29tZSBxdWV1ZXMuXG4gICAgICBwcm9maWxlS2V5UmVzcG9uc2VRdWV1ZS5wYXVzZSgpO1xuICAgICAgbGlnaHRTZXNzaW9uUmVzZXRRdWV1ZS5wYXVzZSgpO1xuICAgICAgb25EZWNyeXB0aW9uRXJyb3JRdWV1ZS5wYXVzZSgpO1xuICAgICAgb25SZXRyeVJlcXVlc3RRdWV1ZS5wYXVzZSgpO1xuICAgICAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0UXVldWUucGF1c2UoKTtcbiAgICAgIG5vdGlmaWNhdGlvblNlcnZpY2UuZGlzYWJsZSgpO1xuXG4gICAgICB3aW5kb3cuU2lnbmFsLlNlcnZpY2VzLmluaXRpYWxpemVHcm91cENyZWRlbnRpYWxGZXRjaGVyKCk7XG5cbiAgICAgIHN0cmljdEFzc2VydChzZXJ2ZXIgIT09IHVuZGVmaW5lZCwgJ1dlYkFQSSBub3QgaW5pdGlhbGl6ZWQnKTtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgbWVzc2FnZVJlY2VpdmVyICE9PSB1bmRlZmluZWQsXG4gICAgICAgICdNZXNzYWdlUmVjZWl2ZXIgbm90IGluaXRpYWxpemVkJ1xuICAgICAgKTtcbiAgICAgIG1lc3NhZ2VSZWNlaXZlci5yZXNldCgpO1xuICAgICAgc2VydmVyLnJlZ2lzdGVyUmVxdWVzdEhhbmRsZXIobWVzc2FnZVJlY2VpdmVyKTtcblxuICAgICAgLy8gSWYgY29taW5nIGhlcmUgYWZ0ZXIgYG9mZmxpbmVgIGV2ZW50IC0gY29ubmVjdCBhZ2Fpbi5cbiAgICAgIGF3YWl0IHNlcnZlci5vbk9ubGluZSgpO1xuXG4gICAgICBBdHRhY2htZW50RG93bmxvYWRzLnN0YXJ0KHtcbiAgICAgICAgbG9nZ2VyOiBsb2csXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbm5lY3RDb3VudCA9PT0gMSkge1xuICAgICAgICBTdGlja2Vycy5kb3dubG9hZFF1ZXVlZFBhY2tzKCk7XG4gICAgICAgIGlmICghbmV3VmVyc2lvbikge1xuICAgICAgICAgIHJ1blN0b3JhZ2VTZXJ2aWNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT24gc3RhcnR1cCBhZnRlciB1cGdyYWRpbmcgdG8gYSBuZXcgdmVyc2lvbiwgcmVxdWVzdCBhIGNvbnRhY3Qgc3luY1xuICAgICAgLy8gICAoYnV0IG9ubHkgaWYgd2UncmUgbm90IHRoZSBwcmltYXJ5IGRldmljZSlcbiAgICAgIGlmIChcbiAgICAgICAgIWZpcnN0UnVuICYmXG4gICAgICAgIGNvbm5lY3RDb3VudCA9PT0gMSAmJlxuICAgICAgICBuZXdWZXJzaW9uICYmXG4gICAgICAgIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXREZXZpY2VJZCgpICE9PSAxXG4gICAgICApIHtcbiAgICAgICAgbG9nLmluZm8oJ0Jvb3QgYWZ0ZXIgdXBncmFkaW5nLiBSZXF1ZXN0aW5nIGNvbnRhY3Qgc3luYycpO1xuICAgICAgICB3aW5kb3cuZ2V0U3luY1JlcXVlc3QoKTtcblxuICAgICAgICBydW5TdG9yYWdlU2VydmljZSgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgbWFuYWdlciA9IHdpbmRvdy5nZXRBY2NvdW50TWFuYWdlcigpO1xuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIG1hbmFnZXIubWF5YmVVcGRhdGVEZXZpY2VOYW1lKCksXG4gICAgICAgICAgICB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIucmVtb3ZlU2lnbmFsaW5nS2V5KCksXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnUHJvYmxlbSB3aXRoIGFjY291bnQgbWFuYWdlciB1cGRhdGVzIGFmdGVyIHN0YXJ0aW5nIG5ldyB2ZXJzaW9uOiAnLFxuICAgICAgICAgICAgZSAmJiBlLnN0YWNrID8gZS5zdGFjayA6IGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVkU3VwcG9ydEtleSA9ICdoYXNSZWdpc3RlclN1cHBvcnRGb3JVbmF1dGhlbnRpY2F0ZWREZWxpdmVyeSc7XG4gICAgICBpZiAoIXdpbmRvdy5zdG9yYWdlLmdldCh1ZFN1cHBvcnRLZXkpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgc2VydmVyLnJlZ2lzdGVyU3VwcG9ydEZvclVuYXV0aGVudGljYXRlZERlbGl2ZXJ5KCk7XG4gICAgICAgICAgd2luZG93LnN0b3JhZ2UucHV0KHVkU3VwcG9ydEtleSwgdHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgJ0Vycm9yOiBVbmFibGUgdG8gcmVnaXN0ZXIgZm9yIHVuYXV0aGVudGljYXRlZCBkZWxpdmVyeSBzdXBwb3J0LicsXG4gICAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRldmljZUlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldERldmljZUlkKCk7XG5cbiAgICAgIGlmICghd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKSkge1xuICAgICAgICBsb2cuZXJyb3IoJ1VVSUQgbm90IGNhcHR1cmVkIGR1cmluZyByZWdpc3RyYXRpb24sIHVubGlua2luZycpO1xuICAgICAgICByZXR1cm4gdW5saW5rQW5kRGlzY29ubmVjdChSZW1vdmVBbGxDb25maWd1cmF0aW9uLkZ1bGwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29ubmVjdENvdW50ID09PSAxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gTm90ZTogd2UgYWx3YXlzIGhhdmUgdG8gcmVnaXN0ZXIgb3VyIGNhcGFiaWxpdGllcyBhbGwgYXQgb25jZSwgc28gd2UgZG8gdGhpc1xuICAgICAgICAgIC8vICAgYWZ0ZXIgY29ubmVjdCBvbiBldmVyeSBzdGFydHVwXG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgc2VydmVyLnJlZ2lzdGVyQ2FwYWJpbGl0aWVzKHtcbiAgICAgICAgICAgICAgYW5ub3VuY2VtZW50R3JvdXA6IHRydWUsXG4gICAgICAgICAgICAgIGdpZnRCYWRnZXM6IHRydWUsXG4gICAgICAgICAgICAgICdndjItMyc6IHRydWUsXG4gICAgICAgICAgICAgICdndjEtbWlncmF0aW9uJzogdHJ1ZSxcbiAgICAgICAgICAgICAgc2VuZGVyS2V5OiB0cnVlLFxuICAgICAgICAgICAgICBjaGFuZ2VOdW1iZXI6IHRydWUsXG4gICAgICAgICAgICAgIHN0b3JpZXM6IHRydWUsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHVwZGF0ZU91clVzZXJuYW1lQW5kUG5pKCksXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgJ0Vycm9yOiBVbmFibGUgdG8gcmVnaXN0ZXIgb3VyIGNhcGFiaWxpdGllcy4nLFxuICAgICAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLlBOSSkpIHtcbiAgICAgICAgbG9nLmVycm9yKCdQTkkgbm90IGNhcHR1cmVkIGR1cmluZyByZWdpc3RyYXRpb24sIHVubGlua2luZyBzb2Z0bHknKTtcbiAgICAgICAgcmV0dXJuIHVubGlua0FuZERpc2Nvbm5lY3QoUmVtb3ZlQWxsQ29uZmlndXJhdGlvbi5Tb2Z0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0UnVuID09PSB0cnVlICYmIGRldmljZUlkICE9PSAxKSB7XG4gICAgICAgIGNvbnN0IGhhc1RoZW1lU2V0dGluZyA9IEJvb2xlYW4od2luZG93LnN0b3JhZ2UuZ2V0KCd0aGVtZS1zZXR0aW5nJykpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWhhc1RoZW1lU2V0dGluZyAmJlxuICAgICAgICAgIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UuZ2V0KCd1c2VyQWdlbnQnKSA9PT0gJ09XSSdcbiAgICAgICAgKSB7XG4gICAgICAgICAgd2luZG93LnN0b3JhZ2UucHV0KFxuICAgICAgICAgICAgJ3RoZW1lLXNldHRpbmcnLFxuICAgICAgICAgICAgYXdhaXQgd2luZG93LkV2ZW50cy5nZXRUaGVtZVNldHRpbmcoKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhlbWVDaGFuZ2VkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3YWl0Rm9yRXZlbnQgPSBjcmVhdGVUYXNrV2l0aFRpbWVvdXQoXG4gICAgICAgICAgKGV2ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJvbWlzZSwgcmVzb2x2ZSB9ID0gZXhwbG9kZVByb21pc2U8dm9pZD4oKTtcbiAgICAgICAgICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbmNlKGV2ZW50LCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZmlyc3RSdW46d2FpdEZvckV2ZW50J1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBzdG9yYWdlU2VydmljZVN5bmNDb21wbGV0ZTogUHJvbWlzZTx2b2lkPjtcbiAgICAgICAgaWYgKHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmFyZVdlUHJpbWFyeURldmljZSgpKSB7XG4gICAgICAgICAgc3RvcmFnZVNlcnZpY2VTeW5jQ29tcGxldGUgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdG9yYWdlU2VydmljZVN5bmNDb21wbGV0ZSA9IHdhaXRGb3JFdmVudChcbiAgICAgICAgICAgICdzdG9yYWdlU2VydmljZTpzeW5jQ29tcGxldGUnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRhY3RTeW5jQ29tcGxldGUgPSB3YWl0Rm9yRXZlbnQoJ2NvbnRhY3RTeW5jOmNvbXBsZXRlJyk7XG5cbiAgICAgICAgbG9nLmluZm8oJ2ZpcnN0UnVuOiByZXF1ZXN0aW5nIGluaXRpYWwgc3luYycpO1xuICAgICAgICBpc0luaXRpYWxTeW5jID0gdHJ1ZTtcblxuICAgICAgICAvLyBSZXF1ZXN0IGNvbmZpZ3VyYXRpb24sIGJsb2NrLCBHVjEgc3luYyBtZXNzYWdlcywgY29udGFjdHNcbiAgICAgICAgLy8gKG9ubHkgYXZhdGFycyBhbmQgaW5ib3hQb3NpdGlvbiksYW5kIFN0b3JhZ2UgU2VydmljZSBzeW5jLlxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHNpbmdsZVByb3RvSm9iUXVldWUuYWRkKFxuICAgICAgICAgICAgICBNZXNzYWdlU2VuZGVyLmdldFJlcXVlc3RDb25maWd1cmF0aW9uU3luY01lc3NhZ2UoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHNpbmdsZVByb3RvSm9iUXVldWUuYWRkKE1lc3NhZ2VTZW5kZXIuZ2V0UmVxdWVzdEJsb2NrU3luY01lc3NhZ2UoKSksXG4gICAgICAgICAgICBzaW5nbGVQcm90b0pvYlF1ZXVlLmFkZChNZXNzYWdlU2VuZGVyLmdldFJlcXVlc3RHcm91cFN5bmNNZXNzYWdlKCkpLFxuICAgICAgICAgICAgc2luZ2xlUHJvdG9Kb2JRdWV1ZS5hZGQoXG4gICAgICAgICAgICAgIE1lc3NhZ2VTZW5kZXIuZ2V0UmVxdWVzdENvbnRhY3RTeW5jTWVzc2FnZSgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcnVuU3RvcmFnZVNlcnZpY2UoKSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnY29ubmVjdDogRmFpbGVkIHRvIHJlcXVlc3QgaW5pdGlhbCBzeW5jcycsXG4gICAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKCdmaXJzdFJ1bjogd2FpdGluZyBmb3Igc3RvcmFnZSBzZXJ2aWNlIGFuZCBjb250YWN0IHN5bmMnKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtzdG9yYWdlU2VydmljZVN5bmNDb21wbGV0ZSwgY29udGFjdFN5bmNDb21wbGV0ZV0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgICdjb25uZWN0OiBGYWlsZWQgdG8gcnVuIHN0b3JhZ2Ugc2VydmljZSBhbmQgY29udGFjdCBzeW5jcycsXG4gICAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy5pbmZvKCdmaXJzdFJ1bjogaW5pdGlhbCBzeW5jIGNvbXBsZXRlJyk7XG4gICAgICAgIGlzSW5pdGlhbFN5bmMgPSBmYWxzZTtcblxuICAgICAgICAvLyBTd2l0Y2ggdG8gaW5ib3ggdmlldyBldmVuIGlmIGNvbnRhY3Qgc3luYyBpcyBzdGlsbCBydW5uaW5nXG4gICAgICAgIGlmIChcbiAgICAgICAgICB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpLmFwcC5hcHBWaWV3ID09PSBBcHBWaWV3VHlwZS5JbnN0YWxsZXJcbiAgICAgICAgKSB7XG4gICAgICAgICAgbG9nLmluZm8oJ2ZpcnN0UnVuOiBvcGVuaW5nIGluYm94Jyk7XG4gICAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5hcHAub3BlbkluYm94KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLmluZm8oJ2ZpcnN0UnVuOiBub3Qgb3BlbmluZyBpbmJveCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5zdGFsbGVkU3RpY2tlclBhY2tzID0gU3RpY2tlcnMuZ2V0SW5zdGFsbGVkU3RpY2tlclBhY2tzKCk7XG4gICAgICAgIGlmIChpbnN0YWxsZWRTdGlja2VyUGFja3MubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IGluc3RhbGxlZFN0aWNrZXJQYWNrcy5tYXAocGFjayA9PiAoe1xuICAgICAgICAgICAgcGFja0lkOiBwYWNrLmlkLFxuICAgICAgICAgICAgcGFja0tleTogcGFjay5rZXksXG4gICAgICAgICAgICBpbnN0YWxsZWQ6IHRydWUsXG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgaWYgKHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmFyZVdlUHJpbWFyeURldmljZSgpKSB7XG4gICAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgICAgJ2JhY2tncm91bmQvY29ubmVjdDogV2UgYXJlIHByaW1hcnkgZGV2aWNlOyBub3Qgc2VuZGluZyBzdGlja2VyIHBhY2sgc3luYydcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbG9nLmluZm8oJ2ZpcnN0UnVuOiByZXF1ZXN0aW5nIHN0aWNrZXJzJywgb3BlcmF0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBzaW5nbGVQcm90b0pvYlF1ZXVlLmFkZChcbiAgICAgICAgICAgICAgTWVzc2FnZVNlbmRlci5nZXRTdGlja2VyUGFja1N5bmMob3BlcmF0aW9ucylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgICAgJ2Nvbm5lY3Q6IEZhaWxlZCB0byBxdWV1ZSBzdGlja2VyIHN5bmMgbWVzc2FnZScsXG4gICAgICAgICAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9nLmluZm8oJ2ZpcnN0UnVuOiBkb25lJyk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5zdG9yYWdlLm9ucmVhZHkoYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZGxlRGV0ZWN0b3Iuc3RhcnQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWNoYWxsZW5nZUhhbmRsZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjaGFsbGVuZ2UgaGFuZGxlciB0byBiZSBpbml0aWFsaXplZCcpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbnRlbnRpb25hbGx5IG5vdCBhd2FpdGluZ1xuICAgICAgY2hhbGxlbmdlSGFuZGxlci5vbk9ubGluZSgpO1xuXG4gICAgICByZWNvbm5lY3RCYWNrT2ZmLnJlc2V0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGNvbm5lY3RpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB3aW5kb3cuU2lnbmFsQ29udGV4dC5uYXRpdmVUaGVtZUxpc3RlbmVyLnN1YnNjcmliZSh0aGVtZUNoYW5nZWQpO1xuXG4gIGNvbnN0IEZJVkVfTUlOVVRFUyA9IDUgKiBkdXJhdGlvbnMuTUlOVVRFO1xuXG4gIC8vIE5vdGU6IG9uY2UgdGhpcyBmdW5jdGlvbiByZXR1cm5zLCB0aGVyZSBzdGlsbCBtaWdodCBiZSBtZXNzYWdlcyBiZWluZyBwcm9jZXNzZWQgb25cbiAgLy8gICBhIGdpdmVuIGNvbnZlcnNhdGlvbidzIHF1ZXVlLiBCdXQgd2UgaGF2ZSBwcm9jZXNzZWQgYWxsIGV2ZW50cyBmcm9tIHRoZSB3ZWJzb2NrZXQuXG4gIGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JFbXB0eUV2ZW50UXVldWUoKSB7XG4gICAgaWYgKCFtZXNzYWdlUmVjZWl2ZXIpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICAnd2FpdEZvckVtcHR5RXZlbnRRdWV1ZTogTm8gbWVzc2FnZVJlY2VpdmVyIGF2YWlsYWJsZSwgcmV0dXJuaW5nIGVhcmx5J1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2VSZWNlaXZlci5oYXNFbXB0aWVkKCkpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICAnd2FpdEZvckVtcHR5RXZlbnRRdWV1ZTogV2FpdGluZyBmb3IgTWVzc2FnZVJlY2VpdmVyIGVtcHR5IGV2ZW50Li4uJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IHsgcmVzb2x2ZSwgcmVqZWN0LCBwcm9taXNlIH0gPSBleHBsb2RlUHJvbWlzZTx2b2lkPigpO1xuXG4gICAgICBjb25zdCB0aW1lb3V0ID0gVGltZXJzLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdFbXB0eSBxdWV1ZSBuZXZlciBmaXJlZCcpKTtcbiAgICAgIH0sIEZJVkVfTUlOVVRFUyk7XG5cbiAgICAgIGNvbnN0IG9uRW1wdHlPbmNlID0gKCkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZVJlY2VpdmVyKSB7XG4gICAgICAgICAgbWVzc2FnZVJlY2VpdmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2VtcHR5Jywgb25FbXB0eU9uY2UpO1xuICAgICAgICB9XG4gICAgICAgIFRpbWVycy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2VtcHR5Jywgb25FbXB0eU9uY2UpO1xuXG4gICAgICBhd2FpdCBwcm9taXNlO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCd3YWl0Rm9yRW1wdHlFdmVudFF1ZXVlOiBXYWl0aW5nIGZvciBldmVudCBoYW5kbGVyIHF1ZXVlIGlkbGUuLi4nKTtcbiAgICBhd2FpdCBldmVudEhhbmRsZXJRdWV1ZS5vbklkbGUoKTtcbiAgfVxuXG4gIHdpbmRvdy53YWl0Rm9yRW1wdHlFdmVudFF1ZXVlID0gd2FpdEZvckVtcHR5RXZlbnRRdWV1ZTtcblxuICBhc3luYyBmdW5jdGlvbiBvbkVtcHR5KCkge1xuICAgIGNvbnN0IHsgc3RvcmFnZSB9ID0gd2luZG93LnRleHRzZWN1cmU7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB3aW5kb3cud2FpdEZvckFsbEJhdGNoZXJzKCksXG4gICAgICB3aW5kb3cuZmx1c2hBbGxXYWl0QmF0Y2hlcnMoKSxcbiAgICBdKTtcbiAgICBsb2cuaW5mbygnb25FbXB0eTogQWxsIG91dHN0YW5kaW5nIGRhdGFiYXNlIHJlcXVlc3RzIGNvbXBsZXRlJyk7XG4gICAgd2luZG93LnJlYWR5Rm9yVXBkYXRlcygpO1xuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm9uRW1wdHkoKTtcblxuICAgIC8vIFN0YXJ0IGxpc3RlbmVycyBoZXJlLCBhZnRlciB3ZSBnZXQgdGhyb3VnaCBvdXIgcXVldWUuXG4gICAgUm90YXRlU2lnbmVkUHJlS2V5TGlzdGVuZXIuaW5pdCh3aW5kb3cuV2hpc3Blci5ldmVudHMsIG5ld1ZlcnNpb24pO1xuXG4gICAgLy8gR28gYmFjayB0byBtYWluIHByb2Nlc3MgYmVmb3JlIHByb2Nlc3NpbmcgZGVsYXllZCBhY3Rpb25zXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdvQmFja1RvTWFpblByb2Nlc3MoKTtcblxuICAgIHByb2ZpbGVLZXlSZXNwb25zZVF1ZXVlLnN0YXJ0KCk7XG4gICAgbGlnaHRTZXNzaW9uUmVzZXRRdWV1ZS5zdGFydCgpO1xuICAgIG9uRGVjcnlwdGlvbkVycm9yUXVldWUuc3RhcnQoKTtcbiAgICBvblJldHJ5UmVxdWVzdFF1ZXVlLnN0YXJ0KCk7XG4gICAgd2luZG93LldoaXNwZXIuZGVsaXZlcnlSZWNlaXB0UXVldWUuc3RhcnQoKTtcbiAgICBub3RpZmljYXRpb25TZXJ2aWNlLmVuYWJsZSgpO1xuXG4gICAgYXdhaXQgb25BcHBWaWV3O1xuXG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5hcHAuaW5pdGlhbExvYWRDb21wbGV0ZSgpO1xuXG4gICAgY29uc3QgcHJvY2Vzc2VkQ291bnQgPSBtZXNzYWdlUmVjZWl2ZXI/LmdldEFuZFJlc2V0UHJvY2Vzc2VkQ291bnQoKSB8fCAwO1xuICAgIHdpbmRvdy5sb2dBcHBMb2FkZWRFdmVudD8uKHtcbiAgICAgIHByb2Nlc3NlZENvdW50LFxuICAgIH0pO1xuICAgIGlmIChtZXNzYWdlUmVjZWl2ZXIpIHtcbiAgICAgIGxvZy5pbmZvKCdBcHAgbG9hZGVkIC0gbWVzc2FnZXM6JywgcHJvY2Vzc2VkQ291bnQpO1xuICAgIH1cblxuICAgIHdpbmRvdy5TaWduYWwuVXRpbC5zZXRCYXRjaGluZ1N0cmF0ZWd5KGZhbHNlKTtcblxuICAgIGNvbnN0IGF0dGFjaG1lbnREb3dubG9hZFF1ZXVlID0gd2luZG93LmF0dGFjaG1lbnREb3dubG9hZFF1ZXVlIHx8IFtdO1xuXG4gICAgLy8gTk9URTogdHMvbW9kZWxzL21lc3NhZ2VzLnRzIGV4cGVjdHMgdGhpcyBnbG9iYWwgdG8gYmVjb21lIHVuZGVmaW5lZFxuICAgIC8vIG9uY2Ugd2Ugc3RvcCBwcm9jZXNzaW5nIHRoZSBxdWV1ZS5cbiAgICB3aW5kb3cuYXR0YWNobWVudERvd25sb2FkUXVldWUgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBNQVhfQVRUQUNITUVOVF9NU0dTX1RPX0RPV05MT0FEID0gMjUwO1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzVG9Eb3dubG9hZCA9IGF0dGFjaG1lbnREb3dubG9hZFF1ZXVlLmZpbHRlcihcbiAgICAgIChtZXNzYWdlLCBpbmRleCkgPT5cbiAgICAgICAgaW5kZXggPD0gTUFYX0FUVEFDSE1FTlRfTVNHU19UT19ET1dOTE9BRCB8fFxuICAgICAgICBpc01vcmVSZWNlbnRUaGFuKFxuICAgICAgICAgIG1lc3NhZ2UuZ2V0UmVjZWl2ZWRBdCgpLFxuICAgICAgICAgIE1BWF9BVFRBQ0hNRU5UX0RPV05MT0FEX0FHRVxuICAgICAgICApIHx8XG4gICAgICAgIC8vIFN0aWNrZXJzIGFuZCBsb25nIHRleHQgYXR0YWNobWVudHMgaGFzIHRvIGJlIGRvd25sb2FkZWQgZm9yIFVJXG4gICAgICAgIC8vIHRvIGRpc3BsYXkgdGhlIG1lc3NhZ2UgcHJvcGVybHkuXG4gICAgICAgIG1lc3NhZ2UuaGFzUmVxdWlyZWRBdHRhY2htZW50RG93bmxvYWRzKClcbiAgICApO1xuICAgIGxvZy5pbmZvKFxuICAgICAgJ0Rvd25sb2FkaW5nIHJlY2VudCBhdHRhY2htZW50cyBvZiB0b3RhbCBhdHRhY2htZW50cycsXG4gICAgICBhdHRhY2htZW50c1RvRG93bmxvYWQubGVuZ3RoLFxuICAgICAgYXR0YWNobWVudERvd25sb2FkUXVldWUubGVuZ3RoXG4gICAgKTtcblxuICAgIGlmICh3aW5kb3cuc3RhcnR1cFByb2Nlc3NpbmdRdWV1ZSkge1xuICAgICAgd2luZG93LnN0YXJ0dXBQcm9jZXNzaW5nUXVldWUuZmx1c2goKTtcbiAgICAgIHdpbmRvdy5zdGFydHVwUHJvY2Vzc2luZ1F1ZXVlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzV2l0aERvd25sb2FkcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgYXR0YWNobWVudHNUb0Rvd25sb2FkLm1hcChtZXNzYWdlID0+IG1lc3NhZ2UucXVldWVBdHRhY2htZW50RG93bmxvYWRzKCkpXG4gICAgKTtcbiAgICBjb25zdCBtZXNzYWdlc1RvU2F2ZTogQXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9IFtdO1xuICAgIG1lc3NhZ2VzV2l0aERvd25sb2Fkcy5mb3JFYWNoKChzaG91bGRTYXZlLCBtZXNzYWdlS2V5KSA9PiB7XG4gICAgICBpZiAoc2hvdWxkU2F2ZSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYXR0YWNobWVudHNUb0Rvd25sb2FkW21lc3NhZ2VLZXldO1xuICAgICAgICBtZXNzYWdlc1RvU2F2ZS5wdXNoKG1lc3NhZ2UuYXR0cmlidXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlcyhtZXNzYWdlc1RvU2F2ZSwge1xuICAgICAgb3VyVXVpZDogc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICB9KTtcblxuICAgIC8vIFByb2Nlc3MgY3Jhc2ggcmVwb3J0cyBpZiBhbnlcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNyYXNoUmVwb3J0cy5zZXRDcmFzaFJlcG9ydENvdW50KFxuICAgICAgYXdhaXQgd2luZG93LmNyYXNoUmVwb3J0cy5nZXRDb3VudCgpXG4gICAgKTtcblxuICAgIC8vIEtpY2sgb2ZmIGEgcHJvZmlsZSByZWZyZXNoIGlmIG5lY2Vzc2FyeSwgYnV0IGRvbid0IHdhaXQgZm9yIGl0LCBhcyBmYWlsdXJlIGlzXG4gICAgLy8gICB0b2xlcmFibGUuXG4gICAgaWYgKCFyb3V0aW5lUHJvZmlsZVJlZnJlc2hlcikge1xuICAgICAgcm91dGluZVByb2ZpbGVSZWZyZXNoZXIgPSBuZXcgUm91dGluZVByb2ZpbGVSZWZyZXNoZXIoe1xuICAgICAgICBnZXRBbGxDb252ZXJzYXRpb25zOiAoKSA9PiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRBbGwoKSxcbiAgICAgICAgZ2V0T3VyQ29udmVyc2F0aW9uSWQ6ICgpID0+XG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKSxcbiAgICAgICAgc3RvcmFnZSxcbiAgICAgIH0pO1xuXG4gICAgICByb3V0aW5lUHJvZmlsZVJlZnJlc2hlci5zdGFydCgpO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIHRoZSBQTkkgaWRlbnRpdHlcblxuICAgIGNvbnN0IHBuaSA9IHN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZChVVUlES2luZC5QTkkpO1xuICAgIGNvbnN0IHBuaUlkZW50aXR5ID0gYXdhaXQgc3RvcmFnZS5wcm90b2NvbC5nZXRJZGVudGl0eUtleVBhaXIocG5pKTtcbiAgICBpZiAoIXBuaUlkZW50aXR5KSB7XG4gICAgICBsb2cuaW5mbygnUmVxdWVzdGluZyBQTkkgaWRlbnRpdHkgc3luYycpO1xuICAgICAgYXdhaXQgc2luZ2xlUHJvdG9Kb2JRdWV1ZS5hZGQoXG4gICAgICAgIE1lc3NhZ2VTZW5kZXIuZ2V0UmVxdWVzdFBuaUlkZW50aXR5U3luY01lc3NhZ2UoKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBsZXQgaW5pdGlhbFN0YXJ0dXBDb3VudCA9IDA7XG4gIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy5vbignaW5jcmVtZW50UHJvZ3Jlc3MnLCBpbmNyZW1lbnRQcm9ncmVzcyk7XG4gIGZ1bmN0aW9uIGluY3JlbWVudFByb2dyZXNzKCkge1xuICAgIGluaXRpYWxTdGFydHVwQ291bnQgKz0gMTtcblxuICAgIC8vIE9ubHkgdXBkYXRlIHByb2dyZXNzIGV2ZXJ5IDEwIGl0ZW1zXG4gICAgaWYgKGluaXRpYWxTdGFydHVwQ291bnQgJSAxMCAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKGBpbmNyZW1lbnRQcm9ncmVzczogTWVzc2FnZSBjb3VudCBpcyAke2luaXRpYWxTdGFydHVwQ291bnR9YCk7XG5cbiAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcignbG9hZGluZ1Byb2dyZXNzJywgaW5pdGlhbFN0YXJ0dXBDb3VudCk7XG4gIH1cblxuICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ21hbnVhbENvbm5lY3QnLCBtYW51YWxDb25uZWN0KTtcbiAgZnVuY3Rpb24gbWFudWFsQ29ubmVjdCgpIHtcbiAgICBpZiAoaXNTb2NrZXRPbmxpbmUoKSkge1xuICAgICAgbG9nLmluZm8oJ21hbnVhbENvbm5lY3Q6IGFscmVhZHkgb25saW5lOyBub3QgY29ubmVjdGluZyBhZ2FpbicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCdtYW51YWxDb25uZWN0OiBjYWxsaW5nIGNvbm5lY3QoKScpO1xuICAgIGNvbm5lY3QoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQ29uZmlndXJhdGlvbihldjogQ29uZmlndXJhdGlvbkV2ZW50KSB7XG4gICAgZXYuY29uZmlybSgpO1xuXG4gICAgY29uc3QgeyBjb25maWd1cmF0aW9uIH0gPSBldjtcbiAgICBjb25zdCB7XG4gICAgICByZWFkUmVjZWlwdHMsXG4gICAgICB0eXBpbmdJbmRpY2F0b3JzLFxuICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcnlJbmRpY2F0b3JzLFxuICAgICAgbGlua1ByZXZpZXdzLFxuICAgIH0gPSBjb25maWd1cmF0aW9uO1xuXG4gICAgd2luZG93LnN0b3JhZ2UucHV0KCdyZWFkLXJlY2VpcHQtc2V0dGluZycsIEJvb2xlYW4ocmVhZFJlY2VpcHRzKSk7XG5cbiAgICBpZiAoXG4gICAgICB1bmlkZW50aWZpZWREZWxpdmVyeUluZGljYXRvcnMgPT09IHRydWUgfHxcbiAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJ5SW5kaWNhdG9ycyA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLnB1dChcbiAgICAgICAgJ3VuaWRlbnRpZmllZERlbGl2ZXJ5SW5kaWNhdG9ycycsXG4gICAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJ5SW5kaWNhdG9yc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodHlwaW5nSW5kaWNhdG9ycyA9PT0gdHJ1ZSB8fCB0eXBpbmdJbmRpY2F0b3JzID09PSBmYWxzZSkge1xuICAgICAgd2luZG93LnN0b3JhZ2UucHV0KCd0eXBpbmdJbmRpY2F0b3JzJywgdHlwaW5nSW5kaWNhdG9ycyk7XG4gICAgfVxuXG4gICAgaWYgKGxpbmtQcmV2aWV3cyA9PT0gdHJ1ZSB8fCBsaW5rUHJldmlld3MgPT09IGZhbHNlKSB7XG4gICAgICB3aW5kb3cuc3RvcmFnZS5wdXQoJ2xpbmtQcmV2aWV3cycsIGxpbmtQcmV2aWV3cyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25UeXBpbmcoZXY6IFR5cGluZ0V2ZW50KSB7XG4gICAgLy8gTm90ZTogdGhpcyB0eXBlIG9mIG1lc3NhZ2UgaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gY2FjaGUgaW4gTWVzc2FnZVJlY2VpdmVyXG5cbiAgICBjb25zdCB7IHR5cGluZywgc2VuZGVyLCBzZW5kZXJVdWlkLCBzZW5kZXJEZXZpY2UgfSA9IGV2O1xuICAgIGNvbnN0IHsgZ3JvdXBJZCwgZ3JvdXBWMklkLCBzdGFydGVkIH0gPSB0eXBpbmcgfHwge307XG5cbiAgICAvLyBXZSBkb24ndCBkbyBhbnl0aGluZyB3aXRoIGluY29taW5nIHR5cGluZyBtZXNzYWdlcyBpZiB0aGUgc2V0dGluZyBpcyBkaXNhYmxlZFxuICAgIGlmICghd2luZG93LnN0b3JhZ2UuZ2V0KCd0eXBpbmdJbmRpY2F0b3JzJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY29udmVyc2F0aW9uO1xuXG4gICAgY29uc3Qgc2VuZGVyQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKFxuICAgICAge1xuICAgICAgICBlMTY0OiBzZW5kZXIsXG4gICAgICAgIGFjaTogc2VuZGVyVXVpZCxcbiAgICAgICAgcmVhc29uOiBgb25UeXBpbmcoJHt0eXBpbmcudGltZXN0YW1wfSlgLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBXZSBtdWx0aXBsZXggYmV0d2VlbiBHVjEvR1YyIGdyb3VwcyBoZXJlLCBidXQgd2UgZG9uJ3Qga2ljayBvZmYgbWlncmF0aW9uc1xuICAgIGlmIChncm91cFYySWQpIHtcbiAgICAgIGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChncm91cFYySWQpO1xuICAgIH1cbiAgICBpZiAoIWNvbnZlcnNhdGlvbiAmJiBncm91cElkKSB7XG4gICAgICBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoZ3JvdXBJZCk7XG4gICAgfVxuICAgIGlmICghZ3JvdXBWMklkICYmICFncm91cElkICYmIHNlbmRlckNvbnZlcnNhdGlvbikge1xuICAgICAgY29udmVyc2F0aW9uID0gc2VuZGVyQ29udmVyc2F0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG91cklkID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcblxuICAgIGlmICghc2VuZGVyQ29udmVyc2F0aW9uKSB7XG4gICAgICBsb2cud2Fybignb25UeXBpbmc6IG1heWJlTWVyZ2VDb250YWN0cyByZXR1cm5lZCBmYWxzZXkgc2VuZGVyIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIW91cklkKSB7XG4gICAgICBsb2cud2FybihcIm9uVHlwaW5nOiBDb3VsZG4ndCBnZXQgb3VyIG93biBpZCFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgYG9uVHlwaW5nOiBEaWQgbm90IGZpbmQgY29udmVyc2F0aW9uIGZvciB0eXBpbmcgaW5kaWNhdG9yIChncm91cHYyKCR7Z3JvdXBWMklkfSksIGdyb3VwKCR7Z3JvdXBJZH0pLCAke3NlbmRlcn0sICR7c2VuZGVyVXVpZH0pYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5BQ0kpO1xuICAgIGNvbnN0IG91clBOSSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLlBOSSk7XG5cbiAgICAvLyBXZSBkcm9wIHR5cGluZyBub3RpZmljYXRpb25zIGluIGdyb3VwcyB3ZSdyZSBub3QgYSBwYXJ0IG9mXG4gICAgaWYgKFxuICAgICAgIWlzRGlyZWN0Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJlxuICAgICAgIShvdXJBQ0kgJiYgY29udmVyc2F0aW9uLmhhc01lbWJlcihvdXJBQ0kpKSAmJlxuICAgICAgIShvdXJQTkkgJiYgY29udmVyc2F0aW9uLmhhc01lbWJlcihvdXJQTkkpKVxuICAgICkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGBSZWNlaXZlZCB0eXBpbmcgaW5kaWNhdG9yIGZvciBncm91cCAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0sIHdoaWNoIHdlJ3JlIG5vdCBhIHBhcnQgb2YuIERyb3BwaW5nLmBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb252ZXJzYXRpb24/LmlzQmxvY2tlZCgpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYG9uVHlwaW5nOiBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGlzIGJsb2NrZWQsIGRyb3BwaW5nIHR5cGluZyBtZXNzYWdlYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZW5kZXJDb252ZXJzYXRpb24pIHtcbiAgICAgIGxvZy53YXJuKCdvblR5cGluZzogTm8gY29udmVyc2F0aW9uIGZvciBzZW5kZXIhJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzZW5kZXJDb252ZXJzYXRpb24uaXNCbG9ja2VkKCkpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgb25UeXBpbmc6IHNlbmRlciAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgYmxvY2tlZCwgZHJvcHBpbmcgdHlwaW5nIG1lc3NhZ2VgXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbmRlcklkID0gc2VuZGVyQ29udmVyc2F0aW9uLmlkO1xuICAgIGNvbnZlcnNhdGlvbi5ub3RpZnlUeXBpbmcoe1xuICAgICAgaXNUeXBpbmc6IHN0YXJ0ZWQsXG4gICAgICBmcm9tTWU6IHNlbmRlcklkID09PSBvdXJJZCxcbiAgICAgIHNlbmRlcklkLFxuICAgICAgc2VuZGVyRGV2aWNlLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25TdGlja2VyUGFjayhldjogU3RpY2tlclBhY2tFdmVudCkge1xuICAgIGV2LmNvbmZpcm0oKTtcblxuICAgIGNvbnN0IHBhY2tzID0gZXYuc3RpY2tlclBhY2tzO1xuXG4gICAgcGFja3MuZm9yRWFjaChwYWNrID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGtleSwgaXNJbnN0YWxsLCBpc1JlbW92ZSB9ID0gcGFjayB8fCB7fTtcblxuICAgICAgaWYgKCFpZCB8fCAha2V5IHx8ICghaXNJbnN0YWxsICYmICFpc1JlbW92ZSkpIHtcbiAgICAgICAgbG9nLndhcm4oJ1JlY2VpdmVkIG1hbGZvcm1lZCBzdGlja2VyIHBhY2sgb3BlcmF0aW9uIHN5bmMgbWVzc2FnZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IFN0aWNrZXJzLmdldFN0aWNrZXJQYWNrU3RhdHVzKGlkKTtcblxuICAgICAgaWYgKHN0YXR1cyA9PT0gJ2luc3RhbGxlZCcgJiYgaXNSZW1vdmUpIHtcbiAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5zdGlja2Vycy51bmluc3RhbGxTdGlja2VyUGFjayhpZCwga2V5LCB7XG4gICAgICAgICAgZnJvbVN5bmM6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChpc0luc3RhbGwpIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ2Rvd25sb2FkZWQnKSB7XG4gICAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5zdGlja2Vycy5pbnN0YWxsU3RpY2tlclBhY2soaWQsIGtleSwge1xuICAgICAgICAgICAgZnJvbVN5bmM6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU3RpY2tlcnMuZG93bmxvYWRTdGlja2VyUGFjayhpZCwga2V5LCB7XG4gICAgICAgICAgICBmaW5hbFN0YXR1czogJ2luc3RhbGxlZCcsXG4gICAgICAgICAgICBmcm9tU3luYzogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25Db250YWN0U3luY0NvbXBsZXRlKCkge1xuICAgIGxvZy5pbmZvKCdvbkNvbnRhY3RTeW5jQ29tcGxldGUnKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wdXQoJ3N5bmNlZF9hdCcsIERhdGUubm93KCkpO1xuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCdjb250YWN0U3luYzpjb21wbGV0ZScpO1xuICB9XG5cbiAgLy8gTm90ZTogTGlrZSB0aGUgaGFuZGxpbmcgZm9yIGluY29taW5nL291dGdvaW5nIG1lc3NhZ2VzLCB0aGlzIG1ldGhvZCBpcyBzeW5jaHJvbm91cyxcbiAgLy8gICBkZWZlcnJpbmcgaXRzIGFzeW5jIGxvZ2ljIHRvIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gY29udmVyc2F0aW9uLnF1ZXVlSm9iKCkuXG4gIGZ1bmN0aW9uIG9uQ29udGFjdFJlY2VpdmVkKGV2OiBDb250YWN0RXZlbnQpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gZXYuY29udGFjdERldGFpbHM7XG5cbiAgICBjb25zdCBwYXJ0aWFsQ29udmVyc2F0aW9uOiBWYWxpZGF0ZUNvbnZlcnNhdGlvblR5cGUgPSB7XG4gICAgICBlMTY0OiBkZXRhaWxzLm51bWJlcixcbiAgICAgIHV1aWQ6IFVVSUQuY2FzdChkZXRhaWxzLnV1aWQpLFxuICAgICAgdHlwZTogJ3ByaXZhdGUnLFxuICAgIH07XG5cbiAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB2YWxpZGF0ZUNvbnZlcnNhdGlvbihwYXJ0aWFsQ29udmVyc2F0aW9uKTtcbiAgICBpZiAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdJbnZhbGlkIGNvbnRhY3QgcmVjZWl2ZWQ6JyxcbiAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KHZhbGlkYXRpb25FcnJvcilcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgIGUxNjQ6IGRldGFpbHMubnVtYmVyLFxuICAgICAgYWNpOiBkZXRhaWxzLnV1aWQsXG4gICAgICByZWFzb246ICdvbkNvbnRhY3RSZWNlaXZlZCcsXG4gICAgfSk7XG4gICAgc3RyaWN0QXNzZXJ0KGNvbnZlcnNhdGlvbiwgJ25lZWQgY29udmVyc2F0aW9uIHRvIHF1ZXVlIHRoZSBqb2IhJyk7XG5cbiAgICAvLyBJdCdzIGltcG9ydGFudCB0byB1c2UgcXVldWVKb2IgaGVyZSBiZWNhdXNlIHdlIG1pZ2h0IHVwZGF0ZSB0aGUgZXhwaXJhdGlvbiB0aW1lclxuICAgIC8vICAgYW5kIHdlIGRvbid0IHdhbnQgY29uZmxpY3RzIHdpdGggaW5jb21pbmcgbWVzc2FnZSBwcm9jZXNzaW5nIGhhcHBlbmluZyBvbiB0aGVcbiAgICAvLyAgIGNvbnZlcnNhdGlvbiBxdWV1ZS5cbiAgICBjb252ZXJzYXRpb24ucXVldWVKb2IoJ29uQ29udGFjdFJlY2VpdmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgbmFtZTogZGV0YWlscy5uYW1lLFxuICAgICAgICAgIGluYm94X3Bvc2l0aW9uOiBkZXRhaWxzLmluYm94UG9zaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY29udmVyc2F0aW9uIGF2YXRhciBvbmx5IGlmIG5ldyBhdmF0YXIgZXhpc3RzIGFuZCBoYXNoIGRpZmZlcnNcbiAgICAgICAgY29uc3QgeyBhdmF0YXIgfSA9IGRldGFpbHM7XG4gICAgICAgIGlmIChhdmF0YXIgJiYgYXZhdGFyLmRhdGEpIHtcbiAgICAgICAgICBjb25zdCBuZXdBdHRyaWJ1dGVzID0gYXdhaXQgQ29udmVyc2F0aW9uLm1heWJlVXBkYXRlQXZhdGFyKFxuICAgICAgICAgICAgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBhdmF0YXIuZGF0YSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgd3JpdGVOZXdBdHRhY2htZW50RGF0YSxcbiAgICAgICAgICAgICAgZGVsZXRlQXR0YWNobWVudERhdGEsXG4gICAgICAgICAgICAgIGRvZXNBdHRhY2htZW50RXhpc3QsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb252ZXJzYXRpb24uc2V0KG5ld0F0dHJpYnV0ZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gY29udmVyc2F0aW9uO1xuICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmF2YXRhciAmJiBhdHRyaWJ1dGVzLmF2YXRhci5wYXRoKSB7XG4gICAgICAgICAgICBhd2FpdCBkZWxldGVBdHRhY2htZW50RGF0YShhdHRyaWJ1dGVzLmF2YXRhci5wYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udmVyc2F0aW9uLnNldCh7IGF2YXRhcjogbnVsbCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIC8vIGV4cGlyZVRpbWVyIGlzbid0IGluIFN0b3JhZ2UgU2VydmljZSBzbyB3ZSBoYXZlIHRvIHJlbHkgb24gY29udGFjdCBzeW5jLlxuICAgICAgICBjb25zdCB7IGV4cGlyZVRpbWVyIH0gPSBkZXRhaWxzO1xuICAgICAgICBjb25zdCBpc1ZhbGlkRXhwaXJlVGltZXIgPSB0eXBlb2YgZXhwaXJlVGltZXIgPT09ICdudW1iZXInO1xuICAgICAgICBpZiAoaXNWYWxpZEV4cGlyZVRpbWVyKSB7XG4gICAgICAgICAgYXdhaXQgY29udmVyc2F0aW9uLnVwZGF0ZUV4cGlyYXRpb25UaW1lcihleHBpcmVUaW1lciwge1xuICAgICAgICAgICAgc291cmNlOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZCgpLFxuICAgICAgICAgICAgcmVjZWl2ZWRBdDogZXYucmVjZWl2ZWRBdENvdW50ZXIsXG4gICAgICAgICAgICBmcm9tU3luYzogdHJ1ZSxcbiAgICAgICAgICAgIGlzSW5pdGlhbFN5bmMsXG4gICAgICAgICAgICByZWFzb246ICdjb250YWN0IHN5bmMnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LldoaXNwZXIuZXZlbnRzLnRyaWdnZXIoJ2luY3JlbWVudFByb2dyZXNzJyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoJ29uQ29udGFjdFJlY2VpdmVkIGVycm9yOicsIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcikpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25Hcm91cFN5bmNDb21wbGV0ZSgpIHtcbiAgICBsb2cuaW5mbygnb25Hcm91cFN5bmNDb21wbGV0ZScpO1xuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dCgnc3luY2VkX2F0JywgRGF0ZS5ub3coKSk7XG4gIH1cblxuICAvLyBOb3RlOiB0aGlzIGhhbmRsZXIgaXMgb25seSBmb3IgdjEgZ3JvdXBzIHJlY2VpdmVkIHZpYSAnZ3JvdXAgc3luYycgbWVzc2FnZXNcbiAgYXN5bmMgZnVuY3Rpb24gb25Hcm91cFJlY2VpdmVkKGV2OiBHcm91cEV2ZW50KSB7XG4gICAgY29uc3QgZGV0YWlscyA9IGV2Lmdyb3VwRGV0YWlscztcbiAgICBjb25zdCB7IGlkIH0gPSBkZXRhaWxzO1xuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGVBbmRXYWl0KFxuICAgICAgaWQsXG4gICAgICAnZ3JvdXAnXG4gICAgKTtcbiAgICBpZiAoaXNHcm91cFYyKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgbG9nLndhcm4oJ0dvdCBncm91cCBzeW5jIGZvciB2MiBncm91cDogJywgY29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZW1iZXJDb252ZXJzYXRpb25zID0gZGV0YWlscy5tZW1iZXJzRTE2NC5tYXAoZTE2NCA9PlxuICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoZTE2NCwgJ3ByaXZhdGUnKVxuICAgICk7XG5cbiAgICBjb25zdCBtZW1iZXJzID0gbWVtYmVyQ29udmVyc2F0aW9ucy5tYXAoYyA9PiBjLmdldCgnaWQnKSk7XG5cbiAgICBjb25zdCB1cGRhdGVzOiBQYXJ0aWFsPENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlPiA9IHtcbiAgICAgIG5hbWU6IGRldGFpbHMubmFtZSxcbiAgICAgIG1lbWJlcnMsXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgaW5ib3hfcG9zaXRpb246IGRldGFpbHMuaW5ib3hQb3NpdGlvbixcbiAgICB9O1xuXG4gICAgaWYgKGRldGFpbHMuYWN0aXZlKSB7XG4gICAgICB1cGRhdGVzLmxlZnQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlcy5sZWZ0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGV0YWlscy5ibG9ja2VkKSB7XG4gICAgICBjb252ZXJzYXRpb24uYmxvY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udmVyc2F0aW9uLnVuYmxvY2soKTtcbiAgICB9XG5cbiAgICBjb252ZXJzYXRpb24uc2V0KHVwZGF0ZXMpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBjb252ZXJzYXRpb24gYXZhdGFyIG9ubHkgaWYgbmV3IGF2YXRhciBleGlzdHMgYW5kIGhhc2ggZGlmZmVyc1xuICAgIGNvbnN0IHsgYXZhdGFyIH0gPSBkZXRhaWxzO1xuICAgIGlmIChhdmF0YXIgJiYgYXZhdGFyLmRhdGEpIHtcbiAgICAgIGNvbnN0IG5ld0F0dHJpYnV0ZXMgPSBhd2FpdCBDb252ZXJzYXRpb24ubWF5YmVVcGRhdGVBdmF0YXIoXG4gICAgICAgIGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzLFxuICAgICAgICBhdmF0YXIuZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGEsXG4gICAgICAgICAgZGVsZXRlQXR0YWNobWVudERhdGEsXG4gICAgICAgICAgZG9lc0F0dGFjaG1lbnRFeGlzdCxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIGNvbnZlcnNhdGlvbi5zZXQobmV3QXR0cmlidXRlcyk7XG4gICAgfVxuXG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG5cbiAgICBjb25zdCB7IGV4cGlyZVRpbWVyIH0gPSBkZXRhaWxzO1xuICAgIGNvbnN0IGlzVmFsaWRFeHBpcmVUaW1lciA9IHR5cGVvZiBleHBpcmVUaW1lciA9PT0gJ251bWJlcic7XG4gICAgaWYgKCFpc1ZhbGlkRXhwaXJlVGltZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBjb252ZXJzYXRpb24udXBkYXRlRXhwaXJhdGlvblRpbWVyKGV4cGlyZVRpbWVyLCB7XG4gICAgICBmcm9tU3luYzogdHJ1ZSxcbiAgICAgIHJlY2VpdmVkQXQ6IGV2LnJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgc291cmNlOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZCgpLFxuICAgICAgcmVhc29uOiAnZ3JvdXAgc3luYycsXG4gICAgfSk7XG4gIH1cblxuICAvLyBSZWNlaXZlZDpcbiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZVJlY2VpdmVkUHJvZmlsZVVwZGF0ZSh7XG4gICAgZGF0YSxcbiAgICBjb25maXJtLFxuICAgIG1lc3NhZ2VEZXNjcmlwdG9yLFxuICB9OiB7XG4gICAgZGF0YTogTWVzc2FnZUV2ZW50RGF0YTtcbiAgICBjb25maXJtOiAoKSA9PiB2b2lkO1xuICAgIG1lc3NhZ2VEZXNjcmlwdG9yOiBNZXNzYWdlRGVzY3JpcHRvcjtcbiAgfSkge1xuICAgIGNvbnN0IHsgcHJvZmlsZUtleSB9ID0gZGF0YS5tZXNzYWdlO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIHByb2ZpbGVLZXkgIT09IHVuZGVmaW5lZCxcbiAgICAgICdoYW5kbGVNZXNzYWdlUmVjZWl2ZWRQcm9maWxlVXBkYXRlOiBtaXNzaW5nIHByb2ZpbGVLZXknXG4gICAgKTtcbiAgICBjb25zdCBzZW5kZXIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQobWVzc2FnZURlc2NyaXB0b3IuaWQpO1xuXG4gICAgaWYgKHNlbmRlcikge1xuICAgICAgLy8gV2lsbCBkbyB0aGUgc2F2ZSBmb3IgdXNcbiAgICAgIGF3YWl0IHNlbmRlci5zZXRQcm9maWxlS2V5KHByb2ZpbGVLZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maXJtKCk7XG4gIH1cblxuICBjb25zdCByZXNwb25kV2l0aFByb2ZpbGVLZXlCYXRjaGVyID0gY3JlYXRlQmF0Y2hlcjxDb252ZXJzYXRpb25Nb2RlbD4oe1xuICAgIG5hbWU6ICdyZXNwb25kV2l0aFByb2ZpbGVLZXlCYXRjaGVyJyxcbiAgICBwcm9jZXNzQmF0Y2goYmF0Y2gpIHtcbiAgICAgIGNvbnN0IGRlZHVwZWQgPSBuZXcgU2V0KGJhdGNoKTtcbiAgICAgIGRlZHVwZWQuZm9yRWFjaChhc3luYyBzZW5kZXIgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICghKGF3YWl0IHNob3VsZFJlc3BvbmRXaXRoUHJvZmlsZUtleShzZW5kZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoJ3Jlc3BvbmRXaXRoUHJvZmlsZUtleUJhdGNoZXIgZXJyb3InLCBlcnJvciAmJiBlcnJvci5zdGFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBzZW5kZXIucXVldWVKb2IoJ3NlbmRQcm9maWxlS2V5VXBkYXRlJywgKCkgPT5cbiAgICAgICAgICBzZW5kZXIuc2VuZFByb2ZpbGVLZXlVcGRhdGUoKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHdhaXQ6IDIwMCxcbiAgICBtYXhTaXplOiBJbmZpbml0eSxcbiAgfSk7XG5cbiAgZnVuY3Rpb24gb25FbnZlbG9wZVJlY2VpdmVkKHsgZW52ZWxvcGUgfTogRW52ZWxvcGVFdmVudCkge1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZCgpPy50b1N0cmluZygpO1xuICAgIGlmIChlbnZlbG9wZS5zb3VyY2VVdWlkICYmIGVudmVsb3BlLnNvdXJjZVV1aWQgIT09IG91clV1aWQpIHtcbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgIGUxNjQ6IGVudmVsb3BlLnNvdXJjZSxcbiAgICAgICAgYWNpOiBlbnZlbG9wZS5zb3VyY2VVdWlkLFxuICAgICAgICByZWFzb246IGBvbkVudmVsb3BlUmVjZWl2ZWQoJHtlbnZlbG9wZS50aW1lc3RhbXB9KWAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3RlOiBXZSBkbyB2ZXJ5IGxpdHRsZSBpbiB0aGlzIGZ1bmN0aW9uLCBzaW5jZSBldmVyeXRoaW5nIGluIGhhbmRsZURhdGFNZXNzYWdlIGlzXG4gIC8vICAgaW5zaWRlIGEgY29udmVyc2F0aW9uLXNwZWNpZmljIHF1ZXVlKCkuIEFueSBjb2RlIGhlcmUgbWlnaHQgcnVuIGJlZm9yZSBhbiBlYXJsaWVyXG4gIC8vICAgbWVzc2FnZSBpcyBwcm9jZXNzZWQgaW4gaGFuZGxlRGF0YU1lc3NhZ2UoKS5cbiAgZnVuY3Rpb24gb25NZXNzYWdlUmVjZWl2ZWQoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSwgY29uZmlybSB9ID0gZXZlbnQ7XG5cbiAgICBjb25zdCBtZXNzYWdlRGVzY3JpcHRvciA9IGdldE1lc3NhZ2VEZXNjcmlwdG9yKHtcbiAgICAgIGNvbmZpcm0sXG4gICAgICAuLi5kYXRhLFxuICAgICAgLy8gJ21lc3NhZ2UnIGV2ZW50OiBmb3IgMToxIGNvbnZlcmF0aW9ucywgdGhlIGNvbnZlcnNhdGlvbiBpcyBzYW1lIGFzIHNlbmRlclxuICAgICAgZGVzdGluYXRpb246IGRhdGEuc291cmNlLFxuICAgICAgZGVzdGluYXRpb25VdWlkOiBkYXRhLnNvdXJjZVV1aWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCB7IFBST0ZJTEVfS0VZX1VQREFURSB9ID0gUHJvdG8uRGF0YU1lc3NhZ2UuRmxhZ3M7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgICBjb25zdCBpc1Byb2ZpbGVVcGRhdGUgPSBCb29sZWFuKGRhdGEubWVzc2FnZS5mbGFncyAmIFBST0ZJTEVfS0VZX1VQREFURSk7XG4gICAgaWYgKGlzUHJvZmlsZVVwZGF0ZSkge1xuICAgICAgcmV0dXJuIGhhbmRsZU1lc3NhZ2VSZWNlaXZlZFByb2ZpbGVVcGRhdGUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBjb25maXJtLFxuICAgICAgICBtZXNzYWdlRGVzY3JpcHRvcixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBpbml0SW5jb21pbmdNZXNzYWdlKGRhdGEsIG1lc3NhZ2VEZXNjcmlwdG9yKTtcblxuICAgIGlmIChcbiAgICAgIGlzSW5jb21pbmcobWVzc2FnZS5hdHRyaWJ1dGVzKSAmJlxuICAgICAgIW1lc3NhZ2UuZ2V0KCd1bmlkZW50aWZpZWREZWxpdmVyeVJlY2VpdmVkJylcbiAgICApIHtcbiAgICAgIGNvbnN0IHNlbmRlciA9IGdldENvbnRhY3QobWVzc2FnZS5hdHRyaWJ1dGVzKTtcblxuICAgICAgaWYgKCFzZW5kZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlTW9kZWwgaGFzIG5vIHNlbmRlci4nKTtcbiAgICAgIH1cblxuICAgICAgcHJvZmlsZUtleVJlc3BvbnNlUXVldWUuYWRkKCgpID0+IHtcbiAgICAgICAgcmVzcG9uZFdpdGhQcm9maWxlS2V5QmF0Y2hlci5hZGQoc2VuZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkYXRhLm1lc3NhZ2UucmVhY3Rpb24pIHtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgZGF0YS5tZXNzYWdlLnJlYWN0aW9uLnRhcmdldEF1dGhvclV1aWQsXG4gICAgICAgICdSZWFjdGlvbiB3aXRob3V0IHRhcmdldEF1dGhvclV1aWQnXG4gICAgICApO1xuICAgICAgY29uc3QgdGFyZ2V0QXV0aG9yVXVpZCA9IG5vcm1hbGl6ZVV1aWQoXG4gICAgICAgIGRhdGEubWVzc2FnZS5yZWFjdGlvbi50YXJnZXRBdXRob3JVdWlkLFxuICAgICAgICAnRGF0YU1lc3NhZ2UuUmVhY3Rpb24udGFyZ2V0QXV0aG9yVXVpZCdcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHsgcmVhY3Rpb24sIHRpbWVzdGFtcCB9ID0gZGF0YS5tZXNzYWdlO1xuXG4gICAgICBpZiAoIWlzVmFsaWRSZWFjdGlvbkVtb2ppKHJlYWN0aW9uLmVtb2ppKSkge1xuICAgICAgICBsb2cud2FybignUmVjZWl2ZWQgYW4gaW52YWxpZCByZWFjdGlvbiBlbW9qaS4gRHJvcHBpbmcgaXQnKTtcbiAgICAgICAgY29uZmlybSgpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgcmVhY3Rpb24udGFyZ2V0VGltZXN0YW1wLFxuICAgICAgICAnUmVhY3Rpb24gd2l0aG91dCB0YXJnZXRUaW1lc3RhbXAnXG4gICAgICApO1xuICAgICAgY29uc3QgZnJvbUNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgZTE2NDogZGF0YS5zb3VyY2UsXG4gICAgICAgIHV1aWQ6IGRhdGEuc291cmNlVXVpZCxcbiAgICAgIH0pO1xuICAgICAgc3RyaWN0QXNzZXJ0KGZyb21Db252ZXJzYXRpb24sICdSZWFjdGlvbiB3aXRob3V0IGZyb21Db252ZXJzYXRpb24nKTtcblxuICAgICAgbG9nLmluZm8oJ1F1ZXVpbmcgaW5jb21pbmcgcmVhY3Rpb24gZm9yJywgcmVhY3Rpb24udGFyZ2V0VGltZXN0YW1wKTtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXM6IFJlYWN0aW9uQXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICAgIGVtb2ppOiByZWFjdGlvbi5lbW9qaSxcbiAgICAgICAgcmVtb3ZlOiByZWFjdGlvbi5yZW1vdmUsXG4gICAgICAgIHRhcmdldEF1dGhvclV1aWQsXG4gICAgICAgIHRhcmdldFRpbWVzdGFtcDogcmVhY3Rpb24udGFyZ2V0VGltZXN0YW1wLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIGZyb21JZDogZnJvbUNvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgc291cmNlOiBSZWFjdGlvblNvdXJjZS5Gcm9tU29tZW9uZUVsc2UsXG4gICAgICB9O1xuICAgICAgY29uc3QgcmVhY3Rpb25Nb2RlbCA9IFJlYWN0aW9ucy5nZXRTaW5nbGV0b24oKS5hZGQoYXR0cmlidXRlcyk7XG5cbiAgICAgIC8vIE5vdGU6IFdlIGRvIG5vdCB3YWl0IGZvciBjb21wbGV0aW9uIGhlcmVcbiAgICAgIFJlYWN0aW9ucy5nZXRTaW5nbGV0b24oKS5vblJlYWN0aW9uKHJlYWN0aW9uTW9kZWwsIG1lc3NhZ2UpO1xuICAgICAgY29uZmlybSgpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLm1lc3NhZ2UuZGVsZXRlKSB7XG4gICAgICBjb25zdCB7IGRlbGV0ZTogZGVsIH0gPSBkYXRhLm1lc3NhZ2U7XG4gICAgICBsb2cuaW5mbygnUXVldWluZyBpbmNvbWluZyBET0UgZm9yJywgZGVsLnRhcmdldFNlbnRUaW1lc3RhbXApO1xuXG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIGRlbC50YXJnZXRTZW50VGltZXN0YW1wLFxuICAgICAgICAnRGVsZXRlIG1pc3NpbmcgdGFyZ2V0U2VudFRpbWVzdGFtcCdcbiAgICAgICk7XG4gICAgICBzdHJpY3RBc3NlcnQoZGF0YS5zZXJ2ZXJUaW1lc3RhbXAsICdEZWxldGUgbWlzc2luZyBzZXJ2ZXJUaW1lc3RhbXAnKTtcbiAgICAgIGNvbnN0IGZyb21Db252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICAgIGUxNjQ6IGRhdGEuc291cmNlLFxuICAgICAgICB1dWlkOiBkYXRhLnNvdXJjZVV1aWQsXG4gICAgICB9KTtcbiAgICAgIHN0cmljdEFzc2VydChmcm9tQ29udmVyc2F0aW9uLCAnRGVsZXRlIG1pc3NpbmcgZnJvbUNvbnZlcnNhdGlvbicpO1xuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzOiBEZWxldGVBdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAgICAgdGFyZ2V0U2VudFRpbWVzdGFtcDogZGVsLnRhcmdldFNlbnRUaW1lc3RhbXAsXG4gICAgICAgIHNlcnZlclRpbWVzdGFtcDogZGF0YS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICAgIGZyb21JZDogZnJvbUNvbnZlcnNhdGlvbi5pZCxcbiAgICAgIH07XG4gICAgICBjb25zdCBkZWxldGVNb2RlbCA9IERlbGV0ZXMuZ2V0U2luZ2xldG9uKCkuYWRkKGF0dHJpYnV0ZXMpO1xuXG4gICAgICAvLyBOb3RlOiBXZSBkbyBub3Qgd2FpdCBmb3IgY29tcGxldGlvbiBoZXJlXG4gICAgICBEZWxldGVzLmdldFNpbmdsZXRvbigpLm9uRGVsZXRlKGRlbGV0ZU1vZGVsKTtcblxuICAgICAgY29uZmlybSgpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmIChoYW5kbGVHcm91cENhbGxVcGRhdGVNZXNzYWdlKGRhdGEubWVzc2FnZSwgbWVzc2FnZURlc2NyaXB0b3IpKSB7XG4gICAgICBjb25maXJtKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLy8gRG9uJ3Qgd2FpdCBmb3IgaGFuZGxlRGF0YU1lc3NhZ2UsIGFzIGl0IGhhcyBpdHMgb3duIHBlci1jb252ZXJzYXRpb24gcXVldWVpbmdcbiAgICBtZXNzYWdlLmhhbmRsZURhdGFNZXNzYWdlKGRhdGEubWVzc2FnZSwgZXZlbnQuY29uZmlybSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBvblByb2ZpbGVLZXlVcGRhdGUoeyBkYXRhLCBjb25maXJtIH06IFByb2ZpbGVLZXlVcGRhdGVFdmVudCkge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICBhY2k6IGRhdGEuc291cmNlVXVpZCxcbiAgICAgIGUxNjQ6IGRhdGEuc291cmNlLFxuICAgICAgcmVhc29uOiAnb25Qcm9maWxlS2V5VXBkYXRlJyxcbiAgICB9KTtcblxuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdvblByb2ZpbGVLZXlVcGRhdGU6IGNvdWxkIG5vdCBmaW5kIGNvbnZlcnNhdGlvbicsXG4gICAgICAgIGRhdGEuc291cmNlLFxuICAgICAgICBkYXRhLnNvdXJjZVV1aWRcbiAgICAgICk7XG4gICAgICBjb25maXJtKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFkYXRhLnByb2ZpbGVLZXkpIHtcbiAgICAgIGxvZy5lcnJvcignb25Qcm9maWxlS2V5VXBkYXRlOiBtaXNzaW5nIHByb2ZpbGVLZXknLCBkYXRhLnByb2ZpbGVLZXkpO1xuICAgICAgY29uZmlybSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgJ29uUHJvZmlsZUtleVVwZGF0ZTogdXBkYXRpbmcgcHJvZmlsZUtleSBmb3InLFxuICAgICAgZGF0YS5zb3VyY2VVdWlkLFxuICAgICAgZGF0YS5zb3VyY2VcbiAgICApO1xuXG4gICAgYXdhaXQgY29udmVyc2F0aW9uLnNldFByb2ZpbGVLZXkoZGF0YS5wcm9maWxlS2V5KTtcblxuICAgIGNvbmZpcm0oKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2VTZW50UHJvZmlsZVVwZGF0ZSh7XG4gICAgZGF0YSxcbiAgICBjb25maXJtLFxuICAgIG1lc3NhZ2VEZXNjcmlwdG9yLFxuICB9OiB7XG4gICAgZGF0YTogU2VudEV2ZW50RGF0YTtcbiAgICBjb25maXJtOiAoKSA9PiB2b2lkO1xuICAgIG1lc3NhZ2VEZXNjcmlwdG9yOiBNZXNzYWdlRGVzY3JpcHRvcjtcbiAgfSkge1xuICAgIC8vIEZpcnN0IHNldCBwcm9maWxlU2hhcmluZyA9IHRydWUgZm9yIHRoZSBjb252ZXJzYXRpb24gd2Ugc2VudCB0b1xuICAgIGNvbnN0IHsgaWQgfSA9IG1lc3NhZ2VEZXNjcmlwdG9yO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKSE7XG5cbiAgICBjb252ZXJzYXRpb24uZW5hYmxlUHJvZmlsZVNoYXJpbmcoKTtcbiAgICB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcblxuICAgIC8vIFRoZW4gd2UgdXBkYXRlIG91ciBvd24gcHJvZmlsZUtleSBpZiBpdCdzIGRpZmZlcmVudCBmcm9tIHdoYXQgd2UgaGF2ZVxuICAgIGNvbnN0IG91cklkID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IG1lID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KG91cklkKSE7XG4gICAgY29uc3QgeyBwcm9maWxlS2V5IH0gPSBkYXRhLm1lc3NhZ2U7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgcHJvZmlsZUtleSAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ2hhbmRsZU1lc3NhZ2VTZW50UHJvZmlsZVVwZGF0ZTogbWlzc2luZyBwcm9maWxlS2V5J1xuICAgICk7XG5cbiAgICAvLyBXaWxsIGRvIHRoZSBzYXZlIGZvciB1cyBpZiBuZWVkZWRcbiAgICBhd2FpdCBtZS5zZXRQcm9maWxlS2V5KHByb2ZpbGVLZXkpO1xuXG4gICAgcmV0dXJuIGNvbmZpcm0oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNlbnRNZXNzYWdlKFxuICAgIGRhdGE6IFNlbnRFdmVudERhdGEsXG4gICAgZGVzY3JpcHRvcjogTWVzc2FnZURlc2NyaXB0b3JcbiAgKSB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBkYXRhLnRpbWVzdGFtcCB8fCBub3c7XG5cbiAgICBjb25zdCBvdXJJZCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpO1xuXG4gICAgY29uc3QgeyB1bmlkZW50aWZpZWRTdGF0dXMgPSBbXSB9ID0gZGF0YTtcblxuICAgIGNvbnN0IHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPVxuICAgICAgdW5pZGVudGlmaWVkU3RhdHVzLnJlZHVjZShcbiAgICAgICAgKFxuICAgICAgICAgIHJlc3VsdDogU2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCxcbiAgICAgICAgICB7IGRlc3RpbmF0aW9uVXVpZCwgZGVzdGluYXRpb24sIGlzQWxsb3dlZFRvUmVwbHlUb1N0b3J5IH1cbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgICAgICAgdXVpZDogZGVzdGluYXRpb25VdWlkLFxuICAgICAgICAgICAgZTE2NDogZGVzdGluYXRpb24sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFjb252ZXJzYXRpb24gfHwgY29udmVyc2F0aW9uLmlkID09PSBvdXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgW2NvbnZlcnNhdGlvbi5pZF06IHtcbiAgICAgICAgICAgICAgaXNBbGxvd2VkVG9SZXBseVRvU3RvcnksXG4gICAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFtvdXJJZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgIGxldCB1bmlkZW50aWZpZWREZWxpdmVyaWVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgaWYgKHVuaWRlbnRpZmllZFN0YXR1cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHVuaWRlbnRpZmllZCA9IHdpbmRvdy5fLmZpbHRlcihkYXRhLnVuaWRlbnRpZmllZFN0YXR1cywgaXRlbSA9PlxuICAgICAgICBCb29sZWFuKGl0ZW0udW5pZGVudGlmaWVkKVxuICAgICAgKTtcbiAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJpZXMgPSB1bmlkZW50aWZpZWRcbiAgICAgICAgLm1hcChpdGVtID0+IGl0ZW0uZGVzdGluYXRpb25VdWlkIHx8IGl0ZW0uZGVzdGluYXRpb24pXG4gICAgICAgIC5maWx0ZXIoaXNOb3ROaWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRpYWxNZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBjYW5SZXBseVRvU3Rvcnk6IGRhdGEubWVzc2FnZS5pc1N0b3J5XG4gICAgICAgID8gZGF0YS5tZXNzYWdlLmNhblJlcGx5VG9TdG9yeVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBkZXNjcmlwdG9yLmlkLFxuICAgICAgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wOiBNYXRoLm1pbihcbiAgICAgICAgZGF0YS5leHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgfHwgdGltZXN0YW1wLFxuICAgICAgICBub3dcbiAgICAgICksXG4gICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICByZWNlaXZlZF9hdF9tczogZGF0YS5yZWNlaXZlZEF0RGF0ZSxcbiAgICAgIHJlY2VpdmVkX2F0OiBkYXRhLnJlY2VpdmVkQXRDb3VudGVyLFxuICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5Ob3RBcHBsaWNhYmxlLFxuICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZCxcbiAgICAgIHNlbnRfYXQ6IHRpbWVzdGFtcCxcbiAgICAgIHNlcnZlclRpbWVzdGFtcDogZGF0YS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICBzb3VyY2U6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXROdW1iZXIoKSxcbiAgICAgIHNvdXJjZURldmljZTogZGF0YS5kZXZpY2UsXG4gICAgICBzb3VyY2VVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZCgpPy50b1N0cmluZygpLFxuICAgICAgdGltZXN0YW1wLFxuICAgICAgdHlwZTogZGF0YS5tZXNzYWdlLmlzU3RvcnkgPyAnc3RvcnknIDogJ291dGdvaW5nJyxcbiAgICAgIHN0b3J5RGlzdHJpYnV0aW9uTGlzdElkOiBkYXRhLnN0b3J5RGlzdHJpYnV0aW9uTGlzdElkLFxuICAgICAgdW5pZGVudGlmaWVkRGVsaXZlcmllcyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyB3aW5kb3cuV2hpc3Blci5NZXNzYWdlKHBhcnRpYWxNZXNzYWdlKTtcbiAgfVxuXG4gIC8vIFdvcmtzIHdpdGggJ3NlbnQnIGFuZCAnbWVzc2FnZScgZGF0YSBzZW50IGZyb20gTWVzc2FnZVJlY2VpdmVyLCB3aXRoIGEgbGl0dGxlIG1hc3NhZ2VcbiAgLy8gICBhdCBjYWxsc2l0ZXMgdG8gbWFrZSBzdXJlIGJvdGggc291cmNlIGFuZCBkZXN0aW5hdGlvbiBhcmUgcG9wdWxhdGVkLlxuICBjb25zdCBnZXRNZXNzYWdlRGVzY3JpcHRvciA9ICh7XG4gICAgY29uZmlybSxcbiAgICBtZXNzYWdlLFxuICAgIHNvdXJjZSxcbiAgICBzb3VyY2VVdWlkLFxuICAgIGRlc3RpbmF0aW9uLFxuICAgIGRlc3RpbmF0aW9uVXVpZCxcbiAgfToge1xuICAgIGNvbmZpcm06ICgpID0+IHVua25vd247XG4gICAgbWVzc2FnZTogUHJvY2Vzc2VkRGF0YU1lc3NhZ2U7XG4gICAgc291cmNlPzogc3RyaW5nO1xuICAgIHNvdXJjZVV1aWQ/OiBzdHJpbmc7XG4gICAgZGVzdGluYXRpb24/OiBzdHJpbmc7XG4gICAgZGVzdGluYXRpb25VdWlkPzogc3RyaW5nO1xuICB9KTogTWVzc2FnZURlc2NyaXB0b3IgPT4ge1xuICAgIGlmIChtZXNzYWdlLmdyb3VwVjIpIHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IG1lc3NhZ2UuZ3JvdXBWMjtcbiAgICAgIGlmICghaWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRNZXNzYWdlRGVzY3JpcHRvcjogR3JvdXBWMiBkYXRhIHdhcyBtaXNzaW5nIGFuIGlkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IHdlIGNoZWNrIGZvciBhbiBleGlzdGluZyBHcm91cFYyIGdyb3VwXG4gICAgICBjb25zdCBncm91cFYyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKTtcbiAgICAgIGlmIChncm91cFYyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogTWVzc2FnZS5HUk9VUCxcbiAgICAgICAgICBpZDogZ3JvdXBWMi5pZCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlbiBjaGVjayBmb3IgVjEgZ3JvdXAgd2l0aCBtYXRjaGluZyBkZXJpdmVkIEdWMiBpZFxuICAgICAgY29uc3QgZ3JvdXBWMSA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldEJ5RGVyaXZlZEdyb3VwVjJJZChpZCk7XG4gICAgICBpZiAoZ3JvdXBWMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IE1lc3NhZ2UuR1JPVVAsXG4gICAgICAgICAgaWQ6IGdyb3VwVjEuaWQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbmFsbHkgY3JlYXRlIHRoZSBWMiBncm91cCBub3JtYWxseVxuICAgICAgY29uc3QgY29udmVyc2F0aW9uSWQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5lbnN1cmVHcm91cChpZCwge1xuICAgICAgICBncm91cFZlcnNpb246IDIsXG4gICAgICAgIG1hc3RlcktleTogbWVzc2FnZS5ncm91cFYyLm1hc3RlcktleSxcbiAgICAgICAgc2VjcmV0UGFyYW1zOiBtZXNzYWdlLmdyb3VwVjIuc2VjcmV0UGFyYW1zLFxuICAgICAgICBwdWJsaWNQYXJhbXM6IG1lc3NhZ2UuZ3JvdXBWMi5wdWJsaWNQYXJhbXMsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogTWVzc2FnZS5HUk9VUCxcbiAgICAgICAgaWQ6IGNvbnZlcnNhdGlvbklkLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UuZ3JvdXApIHtcbiAgICAgIGNvbnN0IHsgaWQsIGRlcml2ZWRHcm91cFYySWQgfSA9IG1lc3NhZ2UuZ3JvdXA7XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0TWVzc2FnZURlc2NyaXB0b3I6IEdyb3VwVjEgZGF0YSB3YXMgbWlzc2luZyBpZCcpO1xuICAgICAgfVxuICAgICAgaWYgKCFkZXJpdmVkR3JvdXBWMklkKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdnZXRNZXNzYWdlRGVzY3JpcHRvcjogR3JvdXBWMSBkYXRhIHdhcyBtaXNzaW5nIGRlcml2ZWRHcm91cFYySWQnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGaXJzdCB3ZSBjaGVjayBmb3IgYW4gYWxyZWFkeS1taWdyYXRlZCBHcm91cFYyIGdyb3VwXG4gICAgICAgIGNvbnN0IG1pZ3JhdGVkR3JvdXAgPVxuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChkZXJpdmVkR3JvdXBWMklkKTtcbiAgICAgICAgaWYgKG1pZ3JhdGVkR3JvdXApIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogTWVzc2FnZS5HUk9VUCxcbiAgICAgICAgICAgIGlkOiBtaWdyYXRlZEdyb3VwLmlkLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgY2FuJ3QgZmluZCBvbmUsIHdlIHRyZWF0IHRoaXMgYXMgYSBub3JtYWwgR3JvdXBWMSBncm91cFxuICAgICAgY29uc3QgZnJvbUNvbnRhY3QgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICBhY2k6IHNvdXJjZVV1aWQsXG4gICAgICAgIGUxNjQ6IHNvdXJjZSxcbiAgICAgICAgcmVhc29uOiBgZ2V0TWVzc2FnZURlc2NyaXB0b3IoJHttZXNzYWdlLnRpbWVzdGFtcH0pOiBncm91cCB2MWAsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29udmVyc2F0aW9uSWQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5lbnN1cmVHcm91cChpZCwge1xuICAgICAgICBhZGRlZEJ5OiBmcm9tQ29udGFjdD8uaWQsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogTWVzc2FnZS5HUk9VUCxcbiAgICAgICAgaWQ6IGNvbnZlcnNhdGlvbklkLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgYWNpOiBkZXN0aW5hdGlvblV1aWQsXG4gICAgICBlMTY0OiBkZXN0aW5hdGlvbixcbiAgICAgIHJlYXNvbjogYGdldE1lc3NhZ2VEZXNjcmlwdG9yKCR7bWVzc2FnZS50aW1lc3RhbXB9KTogcHJpdmF0ZWAsXG4gICAgfSk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgIGNvbmZpcm0oKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGdldE1lc3NhZ2VEZXNjcmlwdG9yLyR7bWVzc2FnZS50aW1lc3RhbXB9OiBtYXliZU1lcmdlQ29udGFjdHMgcmV0dXJuZWQgZmFsc2V5IGNvbnZlcnNhdGlvbmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IE1lc3NhZ2UuUFJJVkFURSxcbiAgICAgIGlkOiBjb252ZXJzYXRpb24uaWQsXG4gICAgfTtcbiAgfTtcblxuICAvLyBOb3RlOiBXZSBkbyB2ZXJ5IGxpdHRsZSBpbiB0aGlzIGZ1bmN0aW9uLCBzaW5jZSBldmVyeXRoaW5nIGluIGhhbmRsZURhdGFNZXNzYWdlIGlzXG4gIC8vICAgaW5zaWRlIGEgY29udmVyc2F0aW9uLXNwZWNpZmljIHF1ZXVlKCkuIEFueSBjb2RlIGhlcmUgbWlnaHQgcnVuIGJlZm9yZSBhbiBlYXJsaWVyXG4gIC8vICAgbWVzc2FnZSBpcyBwcm9jZXNzZWQgaW4gaGFuZGxlRGF0YU1lc3NhZ2UoKS5cbiAgZnVuY3Rpb24gb25TZW50TWVzc2FnZShldmVudDogU2VudEV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhLCBjb25maXJtIH0gPSBldmVudDtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXROdW1iZXIoKTtcbiAgICBjb25zdCBzb3VyY2VVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldFV1aWQoKT8udG9TdHJpbmcoKTtcbiAgICBzdHJpY3RBc3NlcnQoc291cmNlICYmIHNvdXJjZVV1aWQsICdNaXNzaW5nIHVzZXIgbnVtYmVyIGFuZCB1dWlkJyk7XG5cbiAgICBjb25zdCBtZXNzYWdlRGVzY3JpcHRvciA9IGdldE1lc3NhZ2VEZXNjcmlwdG9yKHtcbiAgICAgIGNvbmZpcm0sXG4gICAgICAuLi5kYXRhLFxuXG4gICAgICAvLyAnc2VudCcgZXZlbnQ6IHRoZSBzZW5kZXIgaXMgYWx3YXlzIHVzIVxuICAgICAgc291cmNlLFxuICAgICAgc291cmNlVXVpZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgUFJPRklMRV9LRVlfVVBEQVRFIH0gPSBQcm90by5EYXRhTWVzc2FnZS5GbGFncztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIGNvbnN0IGlzUHJvZmlsZVVwZGF0ZSA9IEJvb2xlYW4oZGF0YS5tZXNzYWdlLmZsYWdzICYgUFJPRklMRV9LRVlfVVBEQVRFKTtcbiAgICBpZiAoaXNQcm9maWxlVXBkYXRlKSB7XG4gICAgICByZXR1cm4gaGFuZGxlTWVzc2FnZVNlbnRQcm9maWxlVXBkYXRlKHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29uZmlybSxcbiAgICAgICAgbWVzc2FnZURlc2NyaXB0b3IsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gY3JlYXRlU2VudE1lc3NhZ2UoZGF0YSwgbWVzc2FnZURlc2NyaXB0b3IpO1xuXG4gICAgaWYgKGRhdGEubWVzc2FnZS5yZWFjdGlvbikge1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBkYXRhLm1lc3NhZ2UucmVhY3Rpb24udGFyZ2V0QXV0aG9yVXVpZCxcbiAgICAgICAgJ1JlYWN0aW9uIHdpdGhvdXQgdGFyZ2V0QXV0aG9yVXVpZCdcbiAgICAgICk7XG4gICAgICBjb25zdCB0YXJnZXRBdXRob3JVdWlkID0gbm9ybWFsaXplVXVpZChcbiAgICAgICAgZGF0YS5tZXNzYWdlLnJlYWN0aW9uLnRhcmdldEF1dGhvclV1aWQsXG4gICAgICAgICdEYXRhTWVzc2FnZS5SZWFjdGlvbi50YXJnZXRBdXRob3JVdWlkJ1xuICAgICAgKTtcblxuICAgICAgY29uc3QgeyByZWFjdGlvbiwgdGltZXN0YW1wIH0gPSBkYXRhLm1lc3NhZ2U7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIHJlYWN0aW9uLnRhcmdldFRpbWVzdGFtcCxcbiAgICAgICAgJ1JlYWN0aW9uIHdpdGhvdXQgdGFyZ2V0QXV0aG9yVXVpZCdcbiAgICAgICk7XG5cbiAgICAgIGlmICghaXNWYWxpZFJlYWN0aW9uRW1vamkocmVhY3Rpb24uZW1vamkpKSB7XG4gICAgICAgIGxvZy53YXJuKCdSZWNlaXZlZCBhbiBpbnZhbGlkIHJlYWN0aW9uIGVtb2ppLiBEcm9wcGluZyBpdCcpO1xuICAgICAgICBldmVudC5jb25maXJtKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgbG9nLmluZm8oJ1F1ZXVpbmcgc2VudCByZWFjdGlvbiBmb3InLCByZWFjdGlvbi50YXJnZXRUaW1lc3RhbXApO1xuICAgICAgY29uc3QgYXR0cmlidXRlczogUmVhY3Rpb25BdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAgICAgZW1vamk6IHJlYWN0aW9uLmVtb2ppLFxuICAgICAgICByZW1vdmU6IHJlYWN0aW9uLnJlbW92ZSxcbiAgICAgICAgdGFyZ2V0QXV0aG9yVXVpZCxcbiAgICAgICAgdGFyZ2V0VGltZXN0YW1wOiByZWFjdGlvbi50YXJnZXRUaW1lc3RhbXAsXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgZnJvbUlkOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZE9yVGhyb3coKSxcbiAgICAgICAgc291cmNlOiBSZWFjdGlvblNvdXJjZS5Gcm9tU3luYyxcbiAgICAgIH07XG4gICAgICBjb25zdCByZWFjdGlvbk1vZGVsID0gUmVhY3Rpb25zLmdldFNpbmdsZXRvbigpLmFkZChhdHRyaWJ1dGVzKTtcbiAgICAgIC8vIE5vdGU6IFdlIGRvIG5vdCB3YWl0IGZvciBjb21wbGV0aW9uIGhlcmVcbiAgICAgIFJlYWN0aW9ucy5nZXRTaW5nbGV0b24oKS5vblJlYWN0aW9uKHJlYWN0aW9uTW9kZWwsIG1lc3NhZ2UpO1xuXG4gICAgICBldmVudC5jb25maXJtKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubWVzc2FnZS5kZWxldGUpIHtcbiAgICAgIGNvbnN0IHsgZGVsZXRlOiBkZWwgfSA9IGRhdGEubWVzc2FnZTtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgZGVsLnRhcmdldFNlbnRUaW1lc3RhbXAsXG4gICAgICAgICdEZWxldGUgd2l0aG91dCB0YXJnZXRTZW50VGltZXN0YW1wJ1xuICAgICAgKTtcbiAgICAgIHN0cmljdEFzc2VydChkYXRhLnNlcnZlclRpbWVzdGFtcCwgJ0RhdGEgaGFzIG5vIHNlcnZlclRpbWVzdGFtcCcpO1xuXG4gICAgICBsb2cuaW5mbygnUXVldWluZyBzZW50IERPRSBmb3InLCBkZWwudGFyZ2V0U2VudFRpbWVzdGFtcCk7XG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXM6IERlbGV0ZUF0dHJpYnV0ZXNUeXBlID0ge1xuICAgICAgICB0YXJnZXRTZW50VGltZXN0YW1wOiBkZWwudGFyZ2V0U2VudFRpbWVzdGFtcCxcbiAgICAgICAgc2VydmVyVGltZXN0YW1wOiBkYXRhLnNlcnZlclRpbWVzdGFtcCxcbiAgICAgICAgZnJvbUlkOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPdXJDb252ZXJzYXRpb25JZE9yVGhyb3coKSxcbiAgICAgIH07XG4gICAgICBjb25zdCBkZWxldGVNb2RlbCA9IERlbGV0ZXMuZ2V0U2luZ2xldG9uKCkuYWRkKGF0dHJpYnV0ZXMpO1xuICAgICAgLy8gTm90ZTogV2UgZG8gbm90IHdhaXQgZm9yIGNvbXBsZXRpb24gaGVyZVxuICAgICAgRGVsZXRlcy5nZXRTaW5nbGV0b24oKS5vbkRlbGV0ZShkZWxldGVNb2RlbCk7XG4gICAgICBjb25maXJtKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhhbmRsZUdyb3VwQ2FsbFVwZGF0ZU1lc3NhZ2UoZGF0YS5tZXNzYWdlLCBtZXNzYWdlRGVzY3JpcHRvcikpIHtcbiAgICAgIGV2ZW50LmNvbmZpcm0oKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICAvLyBEb24ndCB3YWl0IGZvciBoYW5kbGVEYXRhTWVzc2FnZSwgYXMgaXQgaGFzIGl0cyBvd24gcGVyLWNvbnZlcnNhdGlvbiBxdWV1ZWluZ1xuICAgIG1lc3NhZ2UuaGFuZGxlRGF0YU1lc3NhZ2UoZGF0YS5tZXNzYWdlLCBldmVudC5jb25maXJtLCB7XG4gICAgICBkYXRhLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgdHlwZSBNZXNzYWdlRGVzY3JpcHRvciA9IHtcbiAgICB0eXBlOiAncHJpdmF0ZScgfCAnZ3JvdXAnO1xuICAgIGlkOiBzdHJpbmc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW5pdEluY29taW5nTWVzc2FnZShcbiAgICBkYXRhOiBNZXNzYWdlRXZlbnREYXRhLFxuICAgIGRlc2NyaXB0b3I6IE1lc3NhZ2VEZXNjcmlwdG9yXG4gICkge1xuICAgIGFzc2VydChcbiAgICAgIEJvb2xlYW4oZGF0YS5yZWNlaXZlZEF0Q291bnRlciksXG4gICAgICBgRGlkIG5vdCByZWNlaXZlIHJlY2VpdmVkQXRDb3VudGVyIGZvciBtZXNzYWdlOiAke2RhdGEudGltZXN0YW1wfWBcbiAgICApO1xuICAgIGNvbnN0IHBhcnRpYWxNZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBjYW5SZXBseVRvU3Rvcnk6IGRhdGEubWVzc2FnZS5pc1N0b3J5XG4gICAgICAgID8gZGF0YS5tZXNzYWdlLmNhblJlcGx5VG9TdG9yeVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBkZXNjcmlwdG9yLmlkLFxuICAgICAgcmVhZFN0YXR1czogUmVhZFN0YXR1cy5VbnJlYWQsXG4gICAgICByZWNlaXZlZF9hdDogZGF0YS5yZWNlaXZlZEF0Q291bnRlcixcbiAgICAgIHJlY2VpdmVkX2F0X21zOiBkYXRhLnJlY2VpdmVkQXREYXRlLFxuICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICBzZW50X2F0OiBkYXRhLnRpbWVzdGFtcCxcbiAgICAgIHNlcnZlckd1aWQ6IGRhdGEuc2VydmVyR3VpZCxcbiAgICAgIHNlcnZlclRpbWVzdGFtcDogZGF0YS5zZXJ2ZXJUaW1lc3RhbXAsXG4gICAgICBzb3VyY2U6IGRhdGEuc291cmNlLFxuICAgICAgc291cmNlRGV2aWNlOiBkYXRhLnNvdXJjZURldmljZSxcbiAgICAgIHNvdXJjZVV1aWQ6IGRhdGEuc291cmNlVXVpZCA/IFVVSUQuY2FzdChkYXRhLnNvdXJjZVV1aWQpIDogdW5kZWZpbmVkLFxuICAgICAgdGltZXN0YW1wOiBkYXRhLnRpbWVzdGFtcCxcbiAgICAgIHR5cGU6IGRhdGEubWVzc2FnZS5pc1N0b3J5ID8gJ3N0b3J5JyA6ICdpbmNvbWluZycsXG4gICAgICB1bmlkZW50aWZpZWREZWxpdmVyeVJlY2VpdmVkOiBkYXRhLnVuaWRlbnRpZmllZERlbGl2ZXJ5UmVjZWl2ZWQsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2UocGFydGlhbE1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgZmFsc2VgIGlmIHRoaXMgbWVzc2FnZSBpc24ndCBhIGdyb3VwIGNhbGwgbWVzc2FnZS5cbiAgZnVuY3Rpb24gaGFuZGxlR3JvdXBDYWxsVXBkYXRlTWVzc2FnZShcbiAgICBtZXNzYWdlOiBQcm9jZXNzZWREYXRhTWVzc2FnZSxcbiAgICBtZXNzYWdlRGVzY3JpcHRvcjogTWVzc2FnZURlc2NyaXB0b3JcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKG1lc3NhZ2UuZ3JvdXBDYWxsVXBkYXRlKSB7XG4gICAgICBpZiAobWVzc2FnZS5ncm91cFYyICYmIG1lc3NhZ2VEZXNjcmlwdG9yLnR5cGUgPT09IE1lc3NhZ2UuR1JPVVApIHtcbiAgICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5jYWxsaW5nLnBlZWtOb3RDb25uZWN0ZWRHcm91cENhbGwoe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBtZXNzYWdlRGVzY3JpcHRvci5pZCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdSZWNlaXZlZCBhIGdyb3VwIGNhbGwgdXBkYXRlIGZvciBhIGNvbnZlcnNhdGlvbiB0aGF0IGlzIG5vdCBhIEdWMiBncm91cC4gSWdub3JpbmcgdGhhdCBwcm9wZXJ0eSBhbmQgY29udGludWluZy4nXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiB1bmxpbmtBbmREaXNjb25uZWN0KFxuICAgIG1vZGU6IFJlbW92ZUFsbENvbmZpZ3VyYXRpb25cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgd2luZG93LldoaXNwZXIuZXZlbnRzLnRyaWdnZXIoJ3VuYXV0aG9yaXplZCcpO1xuXG4gICAgbG9nLndhcm4oXG4gICAgICAndW5saW5rQW5kRGlzY29ubmVjdDogQ2xpZW50IGlzIG5vIGxvbmdlciBhdXRob3JpemVkOyAnICtcbiAgICAgICAgJ2RlbGV0aW5nIGxvY2FsIGNvbmZpZ3VyYXRpb24nXG4gICAgKTtcblxuICAgIGlmIChtZXNzYWdlUmVjZWl2ZXIpIHtcbiAgICAgIGxvZy5pbmZvKCd1bmxpbmtBbmREaXNjb25uZWN0OiBsb2dnaW5nIG91dCcpO1xuICAgICAgc3RyaWN0QXNzZXJ0KHNlcnZlciAhPT0gdW5kZWZpbmVkLCAnV2ViQVBJIG5vdCBpbml0aWFsaXplZCcpO1xuICAgICAgc2VydmVyLnVucmVnaXN0ZXJSZXF1ZXN0SGFuZGxlcihtZXNzYWdlUmVjZWl2ZXIpO1xuICAgICAgbWVzc2FnZVJlY2VpdmVyLnN0b3BQcm9jZXNzaW5nKCk7XG5cbiAgICAgIGF3YWl0IHNlcnZlci5sb2dvdXQoKTtcbiAgICAgIGF3YWl0IHdpbmRvdy53YWl0Rm9yQWxsQmF0Y2hlcnMoKTtcbiAgICB9XG5cbiAgICBvbkVtcHR5KCk7XG5cbiAgICB3aW5kb3cuU2lnbmFsLlV0aWwuUmVnaXN0cmF0aW9uLnJlbW92ZSgpO1xuXG4gICAgY29uc3QgTlVNQkVSX0lEX0tFWSA9ICdudW1iZXJfaWQnO1xuICAgIGNvbnN0IFVVSURfSURfS0VZID0gJ3V1aWRfaWQnO1xuICAgIGNvbnN0IFZFUlNJT05fS0VZID0gJ3ZlcnNpb24nO1xuICAgIGNvbnN0IExBU1RfUFJPQ0VTU0VEX0lOREVYX0tFWSA9ICdhdHRhY2htZW50TWlncmF0aW9uX2xhc3RQcm9jZXNzZWRJbmRleCc7XG4gICAgY29uc3QgSVNfTUlHUkFUSU9OX0NPTVBMRVRFX0tFWSA9ICdhdHRhY2htZW50TWlncmF0aW9uX2lzQ29tcGxldGUnO1xuXG4gICAgY29uc3QgcHJldmlvdXNOdW1iZXJJZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UuZ2V0KE5VTUJFUl9JRF9LRVkpO1xuICAgIGNvbnN0IHByZXZpb3VzVXVpZElkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5nZXQoVVVJRF9JRF9LRVkpO1xuICAgIGNvbnN0IGxhc3RQcm9jZXNzZWRJbmRleCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UuZ2V0KFxuICAgICAgTEFTVF9QUk9DRVNTRURfSU5ERVhfS0VZXG4gICAgKTtcbiAgICBjb25zdCBpc01pZ3JhdGlvbkNvbXBsZXRlID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5nZXQoXG4gICAgICBJU19NSUdSQVRJT05fQ09NUExFVEVfS0VZXG4gICAgKTtcblxuICAgIHRyeSB7XG4gICAgICBsb2cuaW5mbyhgdW5saW5rQW5kRGlzY29ubmVjdDogcmVtb3ZpbmcgY29uZmlndXJhdGlvbiwgbW9kZSAke21vZGV9YCk7XG4gICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLnJlbW92ZUFsbENvbmZpZ3VyYXRpb24obW9kZSk7XG5cbiAgICAgIC8vIFRoaXMgd2FzIGFscmVhZHkgZG9uZSBpbiB0aGUgZGF0YWJhc2Ugd2l0aCByZW1vdmVBbGxDb25maWd1cmF0aW9uOyB0aGlzIGRvZXMgaXRcbiAgICAgIC8vICAgZm9yIGFsbCB0aGUgY29udmVyc2F0aW9uIG1vZGVscyBpbiBtZW1vcnkuXG4gICAgICB3aW5kb3cuZ2V0Q29udmVyc2F0aW9ucygpLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGRlbGV0ZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcy5zZW5kZXJLZXlJbmZvO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRoZXNlIHR3byBiaXRzIG9mIGRhdGEgYXJlIGltcG9ydGFudCB0byBlbnN1cmUgdGhhdCB0aGUgYXBwIGxvYWRzIHVwXG4gICAgICAvLyAgIHRoZSBjb252ZXJzYXRpb24gbGlzdCwgaW5zdGVhZCBvZiBzaG93aW5nIGp1c3QgdGhlIFFSIGNvZGUgc2NyZWVuLlxuICAgICAgaWYgKHByZXZpb3VzTnVtYmVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnB1dChOVU1CRVJfSURfS0VZLCBwcmV2aW91c051bWJlcklkKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcmV2aW91c1V1aWRJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHV0KFVVSURfSURfS0VZLCBwcmV2aW91c1V1aWRJZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZXNlIHR3byBhcmUgaW1wb3J0YW50IHRvIGVuc3VyZSB3ZSBkb24ndCByaXAgdGhyb3VnaCBldmVyeSBtZXNzYWdlXG4gICAgICAvLyAgIGluIHRoZSBkYXRhYmFzZSBhdHRlbXB0aW5nIHRvIHVwZ3JhZGUgaXQgYWZ0ZXIgc3RhcnRpbmcgdXAgYWdhaW4uXG4gICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnB1dChcbiAgICAgICAgSVNfTUlHUkFUSU9OX0NPTVBMRVRFX0tFWSxcbiAgICAgICAgaXNNaWdyYXRpb25Db21wbGV0ZSB8fCBmYWxzZVxuICAgICAgKTtcbiAgICAgIGlmIChsYXN0UHJvY2Vzc2VkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnB1dChcbiAgICAgICAgICBMQVNUX1BST0NFU1NFRF9JTkRFWF9LRVksXG4gICAgICAgICAgbGFzdFByb2Nlc3NlZEluZGV4XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnJlbW92ZShMQVNUX1BST0NFU1NFRF9JTkRFWF9LRVkpO1xuICAgICAgfVxuICAgICAgYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wdXQoVkVSU0lPTl9LRVksIHdpbmRvdy5nZXRWZXJzaW9uKCkpO1xuXG4gICAgICBsb2cuaW5mbygndW5saW5rQW5kRGlzY29ubmVjdDogU3VjY2Vzc2Z1bGx5IGNsZWFyZWQgbG9jYWwgY29uZmlndXJhdGlvbicpO1xuICAgIH0gY2F0Y2ggKGVyYXNlRXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ3VubGlua0FuZERpc2Nvbm5lY3Q6IFNvbWV0aGluZyB3ZW50IHdyb25nIGNsZWFyaW5nICcgK1xuICAgICAgICAgICdsb2NhbCBjb25maWd1cmF0aW9uJyxcbiAgICAgICAgZXJhc2VFcnJvciAmJiBlcmFzZUVycm9yLnN0YWNrID8gZXJhc2VFcnJvci5zdGFjayA6IGVyYXNlRXJyb3JcbiAgICAgICk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5SZWdpc3RyYXRpb24ubWFya0V2ZXJEb25lKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25FcnJvcihldjogRXJyb3JFdmVudCkge1xuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGV2O1xuICAgIGxvZy5lcnJvcignYmFja2dyb3VuZCBvbkVycm9yOicsIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcikpO1xuXG4gICAgaWYgKFxuICAgICAgZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IgJiZcbiAgICAgIChlcnJvci5jb2RlID09PSA0MDEgfHwgZXJyb3IuY29kZSA9PT0gNDAzKVxuICAgICkge1xuICAgICAgdW5saW5rQW5kRGlzY29ubmVjdChSZW1vdmVBbGxDb25maWd1cmF0aW9uLkZ1bGwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy53YXJuKCdiYWNrZ3JvdW5kIG9uRXJyb3I6IERvaW5nIG5vdGhpbmcgd2l0aCBpbmNvbWluZyBlcnJvcicpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25WaWV3T25jZU9wZW5TeW5jKGV2OiBWaWV3T25jZU9wZW5TeW5jRXZlbnQpIHtcbiAgICBldi5jb25maXJtKCk7XG5cbiAgICBjb25zdCB7IHNvdXJjZSwgc291cmNlVXVpZCwgdGltZXN0YW1wIH0gPSBldjtcbiAgICBsb2cuaW5mbyhgdmlldyBvbmNlIG9wZW4gc3luYyAke3NvdXJjZX0gJHt0aW1lc3RhbXB9YCk7XG4gICAgc3RyaWN0QXNzZXJ0KHNvdXJjZVV1aWQsICdWaWV3T25jZU9wZW4gd2l0aG91dCBzb3VyY2VVdWlkJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHRpbWVzdGFtcCwgJ1ZpZXdPbmNlT3BlbiB3aXRob3V0IHRpbWVzdGFtcCcpO1xuXG4gICAgY29uc3QgYXR0cmlidXRlczogVmlld09uY2VPcGVuU3luY0F0dHJpYnV0ZXNUeXBlID0ge1xuICAgICAgc291cmNlLFxuICAgICAgc291cmNlVXVpZCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGNvbnN0IHN5bmMgPSBWaWV3T25jZU9wZW5TeW5jcy5nZXRTaW5nbGV0b24oKS5hZGQoYXR0cmlidXRlcyk7XG5cbiAgICBWaWV3T25jZU9wZW5TeW5jcy5nZXRTaW5nbGV0b24oKS5vblN5bmMoc3luYyk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBvbkZldGNoTGF0ZXN0U3luYyhldjogRmV0Y2hMYXRlc3RFdmVudCkge1xuICAgIGV2LmNvbmZpcm0oKTtcblxuICAgIGNvbnN0IHsgZXZlbnRUeXBlIH0gPSBldjtcblxuICAgIGNvbnN0IEZFVENIX0xBVEVTVF9FTlVNID0gUHJvdG8uU3luY01lc3NhZ2UuRmV0Y2hMYXRlc3QuVHlwZTtcblxuICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICBjYXNlIEZFVENIX0xBVEVTVF9FTlVNLkxPQ0FMX1BST0ZJTEU6IHtcbiAgICAgICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRVdWlkKCk/LnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IG91ckUxNjQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0TnVtYmVyKCk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBnZXRQcm9maWxlKG91clV1aWQsIG91ckUxNjQpLFxuICAgICAgICAgIHVwZGF0ZU91clVzZXJuYW1lQW5kUG5pKCksXG4gICAgICAgIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRkVUQ0hfTEFURVNUX0VOVU0uU1RPUkFHRV9NQU5JRkVTVDpcbiAgICAgICAgbG9nLmluZm8oJ29uRmV0Y2hMYXRlc3RTeW5jOiBmZXRjaGluZyBsYXRlc3QgbWFuaWZlc3QnKTtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5TZXJ2aWNlcy5ydW5TdG9yYWdlU2VydmljZVN5bmNKb2IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEZFVENIX0xBVEVTVF9FTlVNLlNVQlNDUklQVElPTl9TVEFUVVM6XG4gICAgICAgIGxvZy5pbmZvKCdvbkZldGNoTGF0ZXN0U3luYzogZmV0Y2hpbmcgbGF0ZXN0IHN1YnNjcmlwdGlvbiBzdGF0dXMnKTtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KHNlcnZlciwgJ1dlYkFQSSBub3QgcmVhZHknKTtcbiAgICAgICAgYXJlV2VBU3Vic2NyaWJlclNlcnZpY2UudXBkYXRlKHdpbmRvdy5zdG9yYWdlLCBzZXJ2ZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZy5pbmZvKGBvbkZldGNoTGF0ZXN0U3luYzogVW5rbm93biB0eXBlIGVuY291bnRlcmVkICR7ZXZlbnRUeXBlfWApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIG9uS2V5c1N5bmMoZXY6IEtleXNFdmVudCkge1xuICAgIGV2LmNvbmZpcm0oKTtcblxuICAgIGNvbnN0IHsgc3RvcmFnZVNlcnZpY2VLZXkgfSA9IGV2O1xuXG4gICAgaWYgKHN0b3JhZ2VTZXJ2aWNlS2V5ID09PSBudWxsKSB7XG4gICAgICBsb2cuaW5mbygnb25LZXlzU3luYzogZGVsZXRpbmcgd2luZG93LnN0b3JhZ2VLZXknKTtcbiAgICAgIHdpbmRvdy5zdG9yYWdlLnJlbW92ZSgnc3RvcmFnZUtleScpO1xuICAgIH1cblxuICAgIGlmIChzdG9yYWdlU2VydmljZUtleSkge1xuICAgICAgY29uc3Qgc3RvcmFnZVNlcnZpY2VLZXlCYXNlNjQgPSBCeXRlcy50b0Jhc2U2NChzdG9yYWdlU2VydmljZUtleSk7XG4gICAgICBpZiAod2luZG93LnN0b3JhZ2UuZ2V0KCdzdG9yYWdlS2V5JykgPT09IHN0b3JhZ2VTZXJ2aWNlS2V5QmFzZTY0KSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIFwib25LZXlzU3luYzogc3RvcmFnZSBzZXJ2aWNlIGtleSBkaWRuJ3QgY2hhbmdlLCBcIiArXG4gICAgICAgICAgICAnZmV0Y2hpbmcgbWFuaWZlc3QgYW55d2F5J1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ29uS2V5c1N5bmM6IHVwZGF0ZWQgc3RvcmFnZSBzZXJ2aWNlIGtleSwgZXJhc2luZyBzdGF0ZSBhbmQgZmV0Y2hpbmcnXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnB1dCgnc3RvcmFnZUtleScsIHN0b3JhZ2VTZXJ2aWNlS2V5QmFzZTY0KTtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5TZXJ2aWNlcy5lcmFzZUFsbFN0b3JhZ2VTZXJ2aWNlU3RhdGUoe1xuICAgICAgICAgIGtlZXBVbmtub3duRmllbGRzOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5TZXJ2aWNlcy5ydW5TdG9yYWdlU2VydmljZVN5bmNKb2IoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBvbk1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoZXY6IE1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VFdmVudCkge1xuICAgIGV2LmNvbmZpcm0oKTtcblxuICAgIGNvbnN0IHtcbiAgICAgIHRocmVhZEUxNjQsXG4gICAgICB0aHJlYWRVdWlkLFxuICAgICAgZ3JvdXBJZCxcbiAgICAgIGdyb3VwVjJJZCxcbiAgICAgIG1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlLFxuICAgIH0gPSBldjtcblxuICAgIGxvZy5pbmZvKCdvbk1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UnLCB7XG4gICAgICB0aHJlYWRFMTY0LFxuICAgICAgdGhyZWFkVXVpZCxcbiAgICAgIGdyb3VwSWQ6IGBncm91cCgke2dyb3VwSWR9KWAsXG4gICAgICBncm91cFYySWQ6IGBncm91cHYyKCR7Z3JvdXBWMklkfSlgLFxuICAgICAgbWVzc2FnZVJlcXVlc3RSZXNwb25zZVR5cGUsXG4gICAgfSk7XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBtZXNzYWdlUmVxdWVzdFJlc3BvbnNlVHlwZSxcbiAgICAgICdvbk1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2U6IG1pc3NpbmcgdHlwZSdcbiAgICApO1xuXG4gICAgY29uc3QgYXR0cmlidXRlczogTWVzc2FnZVJlcXVlc3RBdHRyaWJ1dGVzVHlwZSA9IHtcbiAgICAgIHRocmVhZEUxNjQsXG4gICAgICB0aHJlYWRVdWlkLFxuICAgICAgZ3JvdXBJZCxcbiAgICAgIGdyb3VwVjJJZCxcbiAgICAgIHR5cGU6IG1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlLFxuICAgIH07XG4gICAgY29uc3Qgc3luYyA9IE1lc3NhZ2VSZXF1ZXN0cy5nZXRTaW5nbGV0b24oKS5hZGQoYXR0cmlidXRlcyk7XG5cbiAgICBNZXNzYWdlUmVxdWVzdHMuZ2V0U2luZ2xldG9uKCkub25SZXNwb25zZShzeW5jKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVhZFJlY2VpcHQoZXZlbnQ6IFJlYWRvbmx5PFJlYWRFdmVudD4pIHtcbiAgICBvblJlYWRPclZpZXdSZWNlaXB0KHtcbiAgICAgIGxvZ1RpdGxlOiAncmVhZCByZWNlaXB0JyxcbiAgICAgIGV2ZW50LFxuICAgICAgdHlwZTogTWVzc2FnZVJlY2VpcHRUeXBlLlJlYWQsXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblZpZXdSZWNlaXB0KGV2ZW50OiBSZWFkb25seTxWaWV3RXZlbnQ+KTogdm9pZCB7XG4gICAgb25SZWFkT3JWaWV3UmVjZWlwdCh7XG4gICAgICBsb2dUaXRsZTogJ3ZpZXcgcmVjZWlwdCcsXG4gICAgICBldmVudCxcbiAgICAgIHR5cGU6IE1lc3NhZ2VSZWNlaXB0VHlwZS5WaWV3LFxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25SZWFkT3JWaWV3UmVjZWlwdCh7XG4gICAgZXZlbnQsXG4gICAgbG9nVGl0bGUsXG4gICAgdHlwZSxcbiAgfTogUmVhZG9ubHk8e1xuICAgIGV2ZW50OiBSZWFkRXZlbnQgfCBWaWV3RXZlbnQ7XG4gICAgbG9nVGl0bGU6IHN0cmluZztcbiAgICB0eXBlOiBNZXNzYWdlUmVjZWlwdFR5cGUuUmVhZCB8IE1lc3NhZ2VSZWNlaXB0VHlwZS5WaWV3O1xuICB9Pik6IHZvaWQge1xuICAgIGNvbnN0IHsgZW52ZWxvcGVUaW1lc3RhbXAsIHRpbWVzdGFtcCwgc291cmNlLCBzb3VyY2VVdWlkLCBzb3VyY2VEZXZpY2UgfSA9XG4gICAgICBldmVudC5yZWNlaXB0O1xuICAgIGNvbnN0IHNvdXJjZUNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyhcbiAgICAgIHtcbiAgICAgICAgYWNpOiBzb3VyY2VVdWlkLFxuICAgICAgICBlMTY0OiBzb3VyY2UsXG4gICAgICAgIHJlYXNvbjogYG9uUmVhZE9yVmlld1JlY2VpcHQoJHtlbnZlbG9wZVRpbWVzdGFtcH0pYCxcbiAgICAgIH1cbiAgICApO1xuICAgIGxvZy5pbmZvKFxuICAgICAgbG9nVGl0bGUsXG4gICAgICBzb3VyY2UsXG4gICAgICBzb3VyY2VVdWlkLFxuICAgICAgc291cmNlRGV2aWNlLFxuICAgICAgZW52ZWxvcGVUaW1lc3RhbXAsXG4gICAgICBzb3VyY2VDb252ZXJzYXRpb24/LmlkLFxuICAgICAgJ2ZvciBzZW50IG1lc3NhZ2UnLFxuICAgICAgdGltZXN0YW1wXG4gICAgKTtcblxuICAgIGV2ZW50LmNvbmZpcm0oKTtcblxuICAgIGlmICghd2luZG93LnN0b3JhZ2UuZ2V0KCdyZWFkLXJlY2VpcHQtc2V0dGluZycpIHx8ICFzb3VyY2VDb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBpc1ZhbGlkVXVpZChzb3VyY2VVdWlkKSxcbiAgICAgICdvblJlYWRPclZpZXdSZWNlaXB0OiBNaXNzaW5nIHNvdXJjZVV1aWQnXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoc291cmNlRGV2aWNlLCAnb25SZWFkT3JWaWV3UmVjZWlwdDogTWlzc2luZyBzb3VyY2VEZXZpY2UnKTtcblxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE1lc3NhZ2VSZWNlaXB0QXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICBtZXNzYWdlU2VudEF0OiB0aW1lc3RhbXAsXG4gICAgICByZWNlaXB0VGltZXN0YW1wOiBlbnZlbG9wZVRpbWVzdGFtcCxcbiAgICAgIHNvdXJjZUNvbnZlcnNhdGlvbklkOiBzb3VyY2VDb252ZXJzYXRpb24/LmlkLFxuICAgICAgc291cmNlVXVpZCxcbiAgICAgIHNvdXJjZURldmljZSxcbiAgICAgIHR5cGUsXG4gICAgfTtcbiAgICBjb25zdCByZWNlaXB0ID0gTWVzc2FnZVJlY2VpcHRzLmdldFNpbmdsZXRvbigpLmFkZChhdHRyaWJ1dGVzKTtcblxuICAgIC8vIE5vdGU6IFdlIGRvIG5vdCB3YWl0IGZvciBjb21wbGV0aW9uIGhlcmVcbiAgICBNZXNzYWdlUmVjZWlwdHMuZ2V0U2luZ2xldG9uKCkub25SZWNlaXB0KHJlY2VpcHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25SZWFkU3luYyhldjogUmVhZFN5bmNFdmVudCkge1xuICAgIGNvbnN0IHsgZW52ZWxvcGVUaW1lc3RhbXAsIHNlbmRlciwgc2VuZGVyVXVpZCwgdGltZXN0YW1wIH0gPSBldi5yZWFkO1xuICAgIGNvbnN0IHJlYWRBdCA9IGVudmVsb3BlVGltZXN0YW1wO1xuICAgIGNvbnN0IHNlbmRlckNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgIGUxNjQ6IHNlbmRlcixcbiAgICAgIHV1aWQ6IHNlbmRlclV1aWQsXG4gICAgfSk7XG4gICAgY29uc3Qgc2VuZGVySWQgPSBzZW5kZXJDb252ZXJzYXRpb24/LmlkO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICAncmVhZCBzeW5jJyxcbiAgICAgIHNlbmRlcixcbiAgICAgIHNlbmRlclV1aWQsXG4gICAgICBlbnZlbG9wZVRpbWVzdGFtcCxcbiAgICAgIHNlbmRlcklkLFxuICAgICAgJ2ZvciBtZXNzYWdlJyxcbiAgICAgIHRpbWVzdGFtcFxuICAgICk7XG5cbiAgICBzdHJpY3RBc3NlcnQoc2VuZGVySWQsICdvblJlYWRTeW5jIG1pc3Npbmcgc2VuZGVySWQnKTtcbiAgICBzdHJpY3RBc3NlcnQoc2VuZGVyVXVpZCwgJ29uUmVhZFN5bmMgbWlzc2luZyBzZW5kZXJVdWlkJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHRpbWVzdGFtcCwgJ29uUmVhZFN5bmMgbWlzc2luZyB0aW1lc3RhbXAnKTtcblxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IFJlYWRTeW5jQXR0cmlidXRlc1R5cGUgPSB7XG4gICAgICBzZW5kZXJJZCxcbiAgICAgIHNlbmRlcixcbiAgICAgIHNlbmRlclV1aWQsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICByZWFkQXQsXG4gICAgfTtcbiAgICBjb25zdCByZWNlaXB0ID0gUmVhZFN5bmNzLmdldFNpbmdsZXRvbigpLmFkZChhdHRyaWJ1dGVzKTtcblxuICAgIHJlY2VpcHQub24oJ3JlbW92ZScsIGV2LmNvbmZpcm0pO1xuXG4gICAgLy8gTm90ZTogSGVyZSB3ZSB3YWl0LCBiZWNhdXNlIHdlIHdhbnQgcmVhZCBzdGF0ZXMgdG8gYmUgaW4gdGhlIGRhdGFiYXNlXG4gICAgLy8gICBiZWZvcmUgd2UgbW92ZSBvbi5cbiAgICByZXR1cm4gUmVhZFN5bmNzLmdldFNpbmdsZXRvbigpLm9uU3luYyhyZWNlaXB0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVmlld1N5bmMoZXY6IFZpZXdTeW5jRXZlbnQpIHtcbiAgICBjb25zdCB7IGVudmVsb3BlVGltZXN0YW1wLCBzZW5kZXJFMTY0LCBzZW5kZXJVdWlkLCB0aW1lc3RhbXAgfSA9IGV2LnZpZXc7XG4gICAgY29uc3Qgc2VuZGVyQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgZTE2NDogc2VuZGVyRTE2NCxcbiAgICAgIHV1aWQ6IHNlbmRlclV1aWQsXG4gICAgfSk7XG4gICAgY29uc3Qgc2VuZGVySWQgPSBzZW5kZXJDb252ZXJzYXRpb24/LmlkO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICAndmlldyBzeW5jJyxcbiAgICAgIHNlbmRlckUxNjQsXG4gICAgICBzZW5kZXJVdWlkLFxuICAgICAgZW52ZWxvcGVUaW1lc3RhbXAsXG4gICAgICBzZW5kZXJJZCxcbiAgICAgICdmb3IgbWVzc2FnZScsXG4gICAgICB0aW1lc3RhbXBcbiAgICApO1xuXG4gICAgc3RyaWN0QXNzZXJ0KHNlbmRlcklkLCAnb25WaWV3U3luYyBtaXNzaW5nIHNlbmRlcklkJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHNlbmRlclV1aWQsICdvblZpZXdTeW5jIG1pc3Npbmcgc2VuZGVyVXVpZCcpO1xuICAgIHN0cmljdEFzc2VydCh0aW1lc3RhbXAsICdvblZpZXdTeW5jIG1pc3NpbmcgdGltZXN0YW1wJyk7XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBWaWV3U3luY0F0dHJpYnV0ZXNUeXBlID0ge1xuICAgICAgc2VuZGVySWQsXG4gICAgICBzZW5kZXJFMTY0LFxuICAgICAgc2VuZGVyVXVpZCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIHZpZXdlZEF0OiBlbnZlbG9wZVRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGNvbnN0IHJlY2VpcHQgPSBWaWV3U3luY3MuZ2V0U2luZ2xldG9uKCkuYWRkKGF0dHJpYnV0ZXMpO1xuXG4gICAgcmVjZWlwdC5vbigncmVtb3ZlJywgZXYuY29uZmlybSk7XG5cbiAgICAvLyBOb3RlOiBIZXJlIHdlIHdhaXQsIGJlY2F1c2Ugd2Ugd2FudCB2aWV3ZWQgc3RhdGVzIHRvIGJlIGluIHRoZSBkYXRhYmFzZVxuICAgIC8vICAgYmVmb3JlIHdlIG1vdmUgb24uXG4gICAgcmV0dXJuIFZpZXdTeW5jcy5nZXRTaW5nbGV0b24oKS5vblN5bmMocmVjZWlwdCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkRlbGl2ZXJ5UmVjZWlwdChldjogRGVsaXZlcnlFdmVudCkge1xuICAgIGNvbnN0IHsgZGVsaXZlcnlSZWNlaXB0IH0gPSBldjtcbiAgICBjb25zdCB7IGVudmVsb3BlVGltZXN0YW1wLCBzb3VyY2VVdWlkLCBzb3VyY2UsIHNvdXJjZURldmljZSwgdGltZXN0YW1wIH0gPVxuICAgICAgZGVsaXZlcnlSZWNlaXB0O1xuXG4gICAgZXYuY29uZmlybSgpO1xuXG4gICAgY29uc3Qgc291cmNlQ29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKFxuICAgICAge1xuICAgICAgICBhY2k6IHNvdXJjZVV1aWQsXG4gICAgICAgIGUxNjQ6IHNvdXJjZSxcbiAgICAgICAgcmVhc29uOiBgb25EZWxpdmVyeVJlY2VpcHQoJHtlbnZlbG9wZVRpbWVzdGFtcH0pYCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICAnZGVsaXZlcnkgcmVjZWlwdCBmcm9tJyxcbiAgICAgIHNvdXJjZSxcbiAgICAgIHNvdXJjZVV1aWQsXG4gICAgICBzb3VyY2VEZXZpY2UsXG4gICAgICBzb3VyY2VDb252ZXJzYXRpb24/LmlkLFxuICAgICAgZW52ZWxvcGVUaW1lc3RhbXAsXG4gICAgICAnZm9yIHNlbnQgbWVzc2FnZScsXG4gICAgICB0aW1lc3RhbXBcbiAgICApO1xuXG4gICAgaWYgKCFzb3VyY2VDb252ZXJzYXRpb24pIHtcbiAgICAgIGxvZy5pbmZvKCdubyBjb252ZXJzYXRpb24gZm9yJywgc291cmNlLCBzb3VyY2VVdWlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBlbnZlbG9wZVRpbWVzdGFtcCxcbiAgICAgICdvbkRlbGl2ZXJ5UmVjZWlwdDogbWlzc2luZyBlbnZlbG9wZVRpbWVzdGFtcCdcbiAgICApO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIGlzVmFsaWRVdWlkKHNvdXJjZVV1aWQpLFxuICAgICAgJ29uRGVsaXZlcnlSZWNlaXB0OiBtaXNzaW5nIHZhbGlkIHNvdXJjZVV1aWQnXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoc291cmNlRGV2aWNlLCAnb25EZWxpdmVyeVJlY2VpcHQ6IG1pc3Npbmcgc291cmNlRGV2aWNlJyk7XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBNZXNzYWdlUmVjZWlwdEF0dHJpYnV0ZXNUeXBlID0ge1xuICAgICAgbWVzc2FnZVNlbnRBdDogdGltZXN0YW1wLFxuICAgICAgcmVjZWlwdFRpbWVzdGFtcDogZW52ZWxvcGVUaW1lc3RhbXAsXG4gICAgICBzb3VyY2VDb252ZXJzYXRpb25JZDogc291cmNlQ29udmVyc2F0aW9uPy5pZCxcbiAgICAgIHNvdXJjZVV1aWQsXG4gICAgICBzb3VyY2VEZXZpY2UsXG4gICAgICB0eXBlOiBNZXNzYWdlUmVjZWlwdFR5cGUuRGVsaXZlcnksXG4gICAgfTtcbiAgICBjb25zdCByZWNlaXB0ID0gTWVzc2FnZVJlY2VpcHRzLmdldFNpbmdsZXRvbigpLmFkZChhdHRyaWJ1dGVzKTtcblxuICAgIC8vIE5vdGU6IFdlIGRvbid0IHdhaXQgZm9yIGNvbXBsZXRpb24gaGVyZVxuICAgIE1lc3NhZ2VSZWNlaXB0cy5nZXRTaW5nbGV0b24oKS5vblJlY2VpcHQocmVjZWlwdCk7XG4gIH1cbn1cblxud2luZG93LnN0YXJ0QXBwID0gc3RhcnRBcHA7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUF5QjtBQUN6QixvQkFBeUI7QUFDekIsbUJBQW1DO0FBQ25DLHVCQUF1QjtBQUN2Qix5QkFBdUM7QUFFdkMsNkJBQTRCO0FBSzVCLG9CQUEwQjtBQUMxQiw2QkFHTztBQU9QLFlBQXVCO0FBQ3ZCLGFBQXdCO0FBQ3hCLGdCQUEyQjtBQUczQiwwQkFBNkI7QUFDN0Isb0JBQTJDO0FBQzNDLGtCQUEwQjtBQUMxQix1QkFBaUM7QUFDakMsZ0JBQTJCO0FBQzNCLDRCQUErQjtBQUMvQixpQ0FBb0M7QUFDcEMsb0JBQXFDO0FBQ3JDLDJCQUE4QjtBQUM5Qix1QkFBdUI7QUFDdkIsc0JBQXlCO0FBQ3pCLHdDQUEyQztBQUMzQywwQkFBNkI7QUFDN0Isc0NBQWdEO0FBQ2hELDhDQUFpRDtBQUNqRCx5QkFBZ0Q7QUFDaEQsb0NBR087QUFDUCwrQkFBeUM7QUFDekMsb0NBQXNDO0FBQ3RDLHFCQUFnQztBQUNoQyxtQ0FBd0M7QUFDeEMsdUJBQTJEO0FBQzNELGtDQUFxQztBQUVyQyxxQkFBMkI7QUFDM0IsZ0NBQW1DO0FBQ25DLHFCQUE4QjtBQUM5QiwrQ0FB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
