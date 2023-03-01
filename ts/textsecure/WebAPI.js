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
var WebAPI_exports = {};
__export(WebAPI_exports, {
  initialize: () => initialize,
  multiRecipient200ResponseSchema: () => multiRecipient200ResponseSchema,
  multiRecipient409ResponseSchema: () => multiRecipient409ResponseSchema,
  multiRecipient410ResponseSchema: () => multiRecipient410ResponseSchema
});
module.exports = __toCommonJS(WebAPI_exports);
var import_abort_controller = __toESM(require("abort-controller"));
var import_node_fetch = __toESM(require("node-fetch"));
var import_proxy_agent = __toESM(require("proxy-agent"));
var import_https = require("https");
var import_lodash = require("lodash");
var import_is = __toESM(require("@sindresorhus/is"));
var import_p_queue = __toESM(require("p-queue"));
var import_uuid = require("uuid");
var import_zod = require("zod");
var import_assert = require("../util/assert");
var import_isRecord = require("../util/isRecord");
var durations = __toESM(require("../util/durations"));
var import_explodePromise = require("../util/explodePromise");
var import_getUserAgent = require("../util/getUserAgent");
var import_getStreamWithTimeout = require("../util/getStreamWithTimeout");
var import_userLanguages = require("../util/userLanguages");
var import_webSafeBase64 = require("../util/webSafeBase64");
var import_getBasicAuth = require("../util/getBasicAuth");
var import_errors = require("../types/errors");
var import_Stickers = require("../types/Stickers");
var import_UUID = require("../types/UUID");
var Bytes = __toESM(require("../Bytes"));
var import_Crypto = require("../Crypto");
var linkPreviewFetch = __toESM(require("../linkPreviews/linkPreviewFetch"));
var import_isBadgeImageFileUrlValid = require("../badges/isBadgeImageFileUrlValid");
var import_SocketManager = require("./SocketManager");
var import_LegacyCDS = require("./cds/LegacyCDS");
var import_CDSH = require("./cds/CDSH");
var import_CDSI = require("./cds/CDSI");
var import_protobuf = require("../protobuf");
var import_Errors = require("./Errors");
var import_Utils = require("./Utils");
var log = __toESM(require("../logging/log"));
var import_url = require("../util/url");
const DEBUG = false;
function _createRedactor(...toReplace) {
  const stringsToReplace = toReplace.filter(Boolean);
  return (href) => stringsToReplace.reduce((result, stringToReplace) => {
    const pattern = RegExp((0, import_lodash.escapeRegExp)(stringToReplace), "g");
    const replacement = `[REDACTED]${stringToReplace.slice(-3)}`;
    return result.replace(pattern, replacement);
  }, href);
}
function _validateResponse(response, schema) {
  try {
    for (const i in schema) {
      switch (schema[i]) {
        case "object":
        case "string":
        case "number":
          if (typeof response[i] !== schema[i]) {
            return false;
          }
          break;
        default:
      }
    }
  } catch (ex) {
    return false;
  }
  return true;
}
const FIVE_MINUTES = 5 * durations.MINUTE;
const GET_ATTACHMENT_CHUNK_TIMEOUT = 10 * durations.SECOND;
const agents = {};
function getContentType(response) {
  if (response.headers && response.headers.get) {
    return response.headers.get("content-type");
  }
  return null;
}
const multiRecipient200ResponseSchema = import_zod.z.object({
  uuids404: import_zod.z.array(import_zod.z.string()).optional(),
  needsSync: import_zod.z.boolean().optional()
}).passthrough();
const multiRecipient409ResponseSchema = import_zod.z.array(import_zod.z.object({
  uuid: import_zod.z.string(),
  devices: import_zod.z.object({
    missingDevices: import_zod.z.array(import_zod.z.number()).optional(),
    extraDevices: import_zod.z.array(import_zod.z.number()).optional()
  }).passthrough()
}).passthrough());
const multiRecipient410ResponseSchema = import_zod.z.array(import_zod.z.object({
  uuid: import_zod.z.string(),
  devices: import_zod.z.object({
    staleDevices: import_zod.z.array(import_zod.z.number()).optional()
  }).passthrough()
}).passthrough());
function isSuccess(status) {
  return status >= 0 && status < 400;
}
function getHostname(url) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}
async function _promiseAjax(providedUrl, options) {
  const { proxyUrl, socketManager } = options;
  const url = providedUrl || `${options.host}/${options.path}`;
  const logType = socketManager ? "(WS)" : "(REST)";
  const redactedURL = options.redactUrl ? options.redactUrl(url) : url;
  const unauthLabel = options.unauthenticated ? " (unauth)" : "";
  const logId = `${options.type} ${logType} ${redactedURL}${unauthLabel}`;
  log.info(logId);
  const timeout = typeof options.timeout === "number" ? options.timeout : 1e4;
  const agentType = options.unauthenticated ? "unauth" : "auth";
  const cacheKey = `${proxyUrl}-${agentType}`;
  const { timestamp } = agents[cacheKey] || { timestamp: null };
  if (!timestamp || timestamp + FIVE_MINUTES < Date.now()) {
    if (timestamp) {
      log.info(`Cycling agent for type ${cacheKey}`);
    }
    agents[cacheKey] = {
      agent: proxyUrl ? new import_proxy_agent.default(proxyUrl) : new import_https.Agent({ keepAlive: true }),
      timestamp: Date.now()
    };
  }
  const { agent } = agents[cacheKey];
  const fetchOptions = {
    method: options.type,
    body: options.data,
    headers: {
      "User-Agent": (0, import_getUserAgent.getUserAgent)(options.version),
      "X-Signal-Agent": "OWD",
      ...options.headers
    },
    redirect: options.redirect,
    agent,
    ca: options.certificateAuthority,
    timeout,
    abortSignal: options.abortSignal
  };
  if (fetchOptions.body instanceof Uint8Array) {
    const contentLength = fetchOptions.body.byteLength;
    fetchOptions.body = Buffer.from(fetchOptions.body);
    fetchOptions.headers["Content-Length"] = contentLength.toString();
  }
  const { accessKey, basicAuth, unauthenticated } = options;
  if (basicAuth) {
    fetchOptions.headers.Authorization = `Basic ${basicAuth}`;
  } else if (unauthenticated) {
    if (accessKey) {
      fetchOptions.headers["Unidentified-Access-Key"] = accessKey;
    }
  } else if (options.user && options.password) {
    fetchOptions.headers.Authorization = (0, import_getBasicAuth.getBasicAuth)({
      username: options.user,
      password: options.password
    });
  }
  if (options.contentType) {
    fetchOptions.headers["Content-Type"] = options.contentType;
  }
  let response;
  let result;
  try {
    response = socketManager ? await socketManager.fetch(url, fetchOptions) : await (0, import_node_fetch.default)(url, fetchOptions);
    if (options.serverUrl && getHostname(options.serverUrl) === getHostname(url)) {
      await (0, import_Utils.handleStatusCode)(response.status);
      if (!unauthenticated && response.status === 401) {
        log.error("Got 401 from Signal Server. We might be unlinked.");
        window.Whisper.events.trigger("mightBeUnlinked");
      }
    }
    if (DEBUG && !isSuccess(response.status)) {
      result = await response.text();
    } else if ((options.responseType === "json" || options.responseType === "jsonwithdetails") && /^application\/json(;.*)?$/.test(response.headers.get("Content-Type") || "")) {
      result = await response.json();
    } else if (options.responseType === "bytes" || options.responseType === "byteswithdetails") {
      result = await response.buffer();
    } else if (options.responseType === "stream") {
      result = response.body;
    } else {
      result = await response.textConverted();
    }
  } catch (e) {
    log.error(logId, 0, "Error");
    const stack = `${e.stack}
Initial stack:
${options.stack}`;
    throw makeHTTPError("promiseAjax catch", 0, {}, e.toString(), stack);
  }
  if (!isSuccess(response.status)) {
    log.error(logId, response.status, "Error");
    throw makeHTTPError("promiseAjax: error response", response.status, response.headers.raw(), result, options.stack);
  }
  if (options.responseType === "json" || options.responseType === "jsonwithdetails") {
    if (options.validateResponse) {
      if (!_validateResponse(result, options.validateResponse)) {
        log.error(logId, response.status, "Error");
        throw makeHTTPError("promiseAjax: invalid response", response.status, response.headers.raw(), result, options.stack);
      }
    }
  }
  log.info(logId, response.status, "Success");
  if (options.responseType === "byteswithdetails") {
    (0, import_assert.assert)(result instanceof Uint8Array, "Expected Uint8Array result");
    const fullResult = {
      data: result,
      contentType: getContentType(response),
      response
    };
    return fullResult;
  }
  if (options.responseType === "jsonwithdetails") {
    const fullResult = {
      data: result,
      contentType: getContentType(response),
      response
    };
    return fullResult;
  }
  return result;
}
async function _retryAjax(url, options, providedLimit, providedCount) {
  const count = (providedCount || 0) + 1;
  const limit = providedLimit || 3;
  try {
    return await _promiseAjax(url, options);
  } catch (e) {
    if (e instanceof import_Errors.HTTPError && e.code === -1 && count < limit) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(_retryAjax(url, options, limit, count));
        }, 1e3);
      });
    }
    throw e;
  }
}
async function _outerAjax(url, options) {
  options.stack = new Error().stack;
  return _retryAjax(url, options);
}
function makeHTTPError(message, providedCode, headers, response, stack) {
  return new import_Errors.HTTPError(message, {
    code: providedCode,
    headers,
    response,
    stack
  });
}
const URL_CALLS = {
  accounts: "v1/accounts",
  accountExistence: "v1/accounts/account",
  attachmentId: "v2/attachments/form/upload",
  attestation: "v1/attestation",
  boostBadges: "v1/subscription/boost/badges",
  challenge: "v1/challenge",
  config: "v1/config",
  deliveryCert: "v1/certificate/delivery",
  devices: "v1/devices",
  directoryAuth: "v1/directory/auth",
  directoryAuthV2: "v2/directory/auth",
  discovery: "v1/discovery",
  getGroupAvatarUpload: "v1/groups/avatar/form",
  getGroupCredentials: "v1/certificate/auth/group",
  getIceServers: "v1/accounts/turn",
  getStickerPackUpload: "v1/sticker/pack/form",
  groupLog: "v1/groups/logs",
  groupJoinedAtVersion: "v1/groups/joined_at_version",
  groups: "v1/groups",
  groupsViaLink: "v1/groups/join/",
  groupToken: "v1/groups/token",
  keys: "v2/keys",
  messages: "v1/messages",
  multiRecipient: "v1/messages/multi_recipient",
  profile: "v1/profile",
  registerCapabilities: "v1/devices/capabilities",
  reportMessage: "v1/messages/report",
  signed: "v2/keys/signed",
  storageManifest: "v1/storage/manifest",
  storageModify: "v1/storage/",
  storageRead: "v1/storage/read",
  storageToken: "v1/storage/auth",
  subscriptions: "v1/subscription",
  supportUnauthenticatedDelivery: "v1/devices/unauthenticated_delivery",
  updateDeviceName: "v1/accounts/name",
  username: "v1/accounts/username",
  whoami: "v1/accounts/whoami"
};
const WEBSOCKET_CALLS = /* @__PURE__ */ new Set([
  "messages",
  "multiRecipient",
  "reportMessage",
  "profile",
  "attachmentId",
  "config",
  "deliveryCert",
  "getGroupCredentials",
  "devices",
  "registerCapabilities",
  "supportUnauthenticatedDelivery",
  "directoryAuth",
  "directoryAuthV2",
  "storageToken"
]);
const uploadAvatarHeadersZod = import_zod.z.object({
  acl: import_zod.z.string(),
  algorithm: import_zod.z.string(),
  credential: import_zod.z.string(),
  date: import_zod.z.string(),
  key: import_zod.z.string(),
  policy: import_zod.z.string(),
  signature: import_zod.z.string()
}).passthrough();
const whoamiResultZod = import_zod.z.object({
  uuid: import_zod.z.string(),
  pni: import_zod.z.string(),
  number: import_zod.z.string(),
  username: import_zod.z.string().or(import_zod.z.null()).optional()
}).passthrough();
function initialize({
  url,
  storageUrl,
  updatesUrl,
  directoryConfig,
  cdnUrlObject,
  certificateAuthority,
  contentProxyUrl,
  proxyUrl,
  version
}) {
  if (!import_is.default.string(url)) {
    throw new Error("WebAPI.initialize: Invalid server url");
  }
  if (!import_is.default.string(storageUrl)) {
    throw new Error("WebAPI.initialize: Invalid storageUrl");
  }
  if (!import_is.default.string(updatesUrl)) {
    throw new Error("WebAPI.initialize: Invalid updatesUrl");
  }
  if (!import_is.default.object(cdnUrlObject)) {
    throw new Error("WebAPI.initialize: Invalid cdnUrlObject");
  }
  if (!import_is.default.string(cdnUrlObject["0"])) {
    throw new Error("WebAPI.initialize: Missing CDN 0 configuration");
  }
  if (!import_is.default.string(cdnUrlObject["2"])) {
    throw new Error("WebAPI.initialize: Missing CDN 2 configuration");
  }
  if (!import_is.default.string(certificateAuthority)) {
    throw new Error("WebAPI.initialize: Invalid certificateAuthority");
  }
  if (!import_is.default.string(contentProxyUrl)) {
    throw new Error("WebAPI.initialize: Invalid contentProxyUrl");
  }
  if (proxyUrl && !import_is.default.string(proxyUrl)) {
    throw new Error("WebAPI.initialize: Invalid proxyUrl");
  }
  if (!import_is.default.string(version)) {
    throw new Error("WebAPI.initialize: Invalid version");
  }
  return {
    connect
  };
  function connect({
    username: initialUsername,
    password: initialPassword,
    useWebSocket = true
  }) {
    let username = initialUsername;
    let password = initialPassword;
    const PARSE_RANGE_HEADER = /\/(\d+)$/;
    const PARSE_GROUP_LOG_RANGE_HEADER = /^versions\s+(\d{1,10})-(\d{1,10})\/(\d{1,10})/;
    let activeRegistration;
    const socketManager = new import_SocketManager.SocketManager({
      url,
      certificateAuthority,
      version,
      proxyUrl
    });
    socketManager.on("statusChange", () => {
      window.Whisper.events.trigger("socketStatusChange");
    });
    socketManager.on("authError", () => {
      window.Whisper.events.trigger("unlinkAndDisconnect");
    });
    if (useWebSocket) {
      socketManager.authenticate({ username, password });
    }
    let cds;
    if (directoryConfig.directoryVersion === 1) {
      const { directoryUrl, directoryEnclaveId, directoryTrustAnchor } = directoryConfig;
      cds = new import_LegacyCDS.LegacyCDS({
        logger: log,
        directoryEnclaveId,
        directoryTrustAnchor,
        proxyUrl,
        async putAttestation(auth, publicKey) {
          const data = JSON.stringify({
            clientPublic: Bytes.toBase64(publicKey),
            iasVersion: 4
          });
          const result = await _outerAjax(null, {
            certificateAuthority,
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            host: directoryUrl,
            path: `${URL_CALLS.attestation}/${directoryEnclaveId}`,
            user: auth.username,
            password: auth.password,
            responseType: "jsonwithdetails",
            data,
            timeout: 3e4,
            version
          });
          const { response, data: responseBody } = result;
          const cookie = response.headers.get("set-cookie") ?? void 0;
          return { cookie, responseBody };
        },
        async fetchDiscoveryData(auth, data, cookie) {
          const response = await _outerAjax(null, {
            certificateAuthority,
            type: "PUT",
            headers: cookie ? {
              cookie
            } : void 0,
            contentType: "application/json; charset=utf-8",
            host: directoryUrl,
            path: `${URL_CALLS.discovery}/${directoryEnclaveId}`,
            user: auth.username,
            password: auth.password,
            responseType: "json",
            timeout: 3e4,
            data: JSON.stringify(data),
            version
          });
          return {
            requestId: Bytes.fromBase64(response.requestId),
            iv: Bytes.fromBase64(response.iv),
            data: Bytes.fromBase64(response.data),
            mac: Bytes.fromBase64(response.mac)
          };
        },
        async getAuth() {
          return await _ajax({
            call: "directoryAuth",
            httpType: "GET",
            responseType: "json"
          });
        }
      });
    } else if (directoryConfig.directoryVersion === 2) {
      const { directoryV2Url, directoryV2PublicKey, directoryV2CodeHashes } = directoryConfig;
      cds = new import_CDSH.CDSH({
        logger: log,
        proxyUrl,
        url: directoryV2Url,
        publicKey: directoryV2PublicKey,
        codeHashes: directoryV2CodeHashes,
        certificateAuthority,
        version,
        async getAuth() {
          return await _ajax({
            call: "directoryAuthV2",
            httpType: "GET",
            responseType: "json"
          });
        }
      });
    } else if (directoryConfig.directoryVersion === 3) {
      const { directoryV3Url, directoryV3MRENCLAVE } = directoryConfig;
      cds = new import_CDSI.CDSI({
        logger: log,
        proxyUrl,
        url: directoryV3Url,
        mrenclave: directoryV3MRENCLAVE,
        certificateAuthority,
        version,
        async getAuth() {
          return await _ajax({
            call: "directoryAuthV2",
            httpType: "GET",
            responseType: "json"
          });
        }
      });
    }
    let fetchForLinkPreviews;
    if (proxyUrl) {
      const agent = new import_proxy_agent.default(proxyUrl);
      fetchForLinkPreviews = /* @__PURE__ */ __name((href, init) => (0, import_node_fetch.default)(href, { ...init, agent }), "fetchForLinkPreviews");
    } else {
      fetchForLinkPreviews = import_node_fetch.default;
    }
    return {
      getSocketStatus,
      checkSockets,
      onOnline,
      onOffline,
      registerRequestHandler,
      unregisterRequestHandler,
      authenticate,
      logout,
      checkAccountExistence,
      confirmCode,
      createGroup,
      deleteUsername,
      finishRegistration,
      fetchLinkPreviewImage,
      fetchLinkPreviewMetadata,
      getAttachment,
      getAvatar,
      getConfig,
      getDevices,
      getGroup,
      getGroupAvatar,
      getGroupCredentials,
      getGroupExternalCredential,
      getGroupFromLink,
      getGroupLog,
      getHasSubscription,
      getIceServers,
      getKeysForIdentifier,
      getKeysForIdentifierUnauth,
      getMyKeys,
      getProfile,
      getProfileForUsername,
      getProfileUnauth,
      getBadgeImageFile,
      getBoostBadgesFromServer,
      getProvisioningResource,
      getSenderCertificate,
      getSticker,
      getStickerPackManifest,
      getStorageCredentials,
      getStorageManifest,
      getStorageRecords,
      getUuidsForE164s,
      getUuidsForE164sV2,
      makeProxiedRequest,
      makeSfuRequest,
      modifyGroup,
      modifyStorageRecords,
      putAttachment,
      putProfile,
      putStickers,
      putUsername,
      registerCapabilities,
      registerKeys,
      registerSupportForUnauthenticatedDelivery,
      reportMessage,
      requestVerificationSMS,
      requestVerificationVoice,
      sendMessages,
      sendMessagesUnauth,
      sendWithSenderKey,
      setSignedPreKey,
      startRegistration,
      updateDeviceName,
      uploadAvatar,
      uploadGroupAvatar,
      whoami,
      sendChallengeResponse
    };
    async function _ajax(param) {
      if (!param.unauthenticated && activeRegistration && !param.isRegistration) {
        log.info("WebAPI: request blocked by active registration");
        const start = Date.now();
        await activeRegistration.promise;
        const duration = Date.now() - start;
        log.info(`WebAPI: request unblocked after ${duration}ms`);
      }
      if (!param.urlParameters) {
        param.urlParameters = "";
      }
      const useWebSocketForEndpoint = useWebSocket && WEBSOCKET_CALLS.has(param.call);
      const outerParams = {
        socketManager: useWebSocketForEndpoint ? socketManager : void 0,
        basicAuth: param.basicAuth,
        certificateAuthority,
        contentType: param.contentType || "application/json; charset=utf-8",
        data: param.data || (param.jsonData ? JSON.stringify(param.jsonData) : void 0),
        headers: param.headers,
        host: param.host || url,
        password: param.password ?? password,
        path: URL_CALLS[param.call] + param.urlParameters,
        proxyUrl,
        responseType: param.responseType,
        timeout: param.timeout,
        type: param.httpType,
        user: param.username ?? username,
        redactUrl: param.redactUrl,
        serverUrl: url,
        validateResponse: param.validateResponse,
        version,
        unauthenticated: param.unauthenticated,
        accessKey: param.accessKey
      };
      try {
        return await _outerAjax(null, outerParams);
      } catch (e) {
        if (!(e instanceof import_Errors.HTTPError)) {
          throw e;
        }
        const translatedError = (0, import_Utils.translateError)(e);
        if (translatedError) {
          throw translatedError;
        }
        throw e;
      }
    }
    function uuidKindToQuery(kind) {
      let value;
      if (kind === import_UUID.UUIDKind.ACI) {
        value = "aci";
      } else if (kind === import_UUID.UUIDKind.PNI) {
        value = "pni";
      } else {
        throw new Error(`Unsupported UUIDKind: ${kind}`);
      }
      return `identity=${value}`;
    }
    async function whoami() {
      const response = await _ajax({
        call: "whoami",
        httpType: "GET",
        responseType: "json"
      });
      return whoamiResultZod.parse(response);
    }
    async function sendChallengeResponse(challengeResponse) {
      await _ajax({
        call: "challenge",
        httpType: "PUT",
        jsonData: challengeResponse
      });
    }
    async function authenticate({
      username: newUsername,
      password: newPassword
    }) {
      username = newUsername;
      password = newPassword;
      if (useWebSocket) {
        await socketManager.authenticate({ username, password });
      }
    }
    async function logout() {
      username = "";
      password = "";
      if (useWebSocket) {
        await socketManager.logout();
      }
    }
    function getSocketStatus() {
      return socketManager.getStatus();
    }
    function checkSockets() {
      socketManager.check();
    }
    async function onOnline() {
      await socketManager.onOnline();
    }
    async function onOffline() {
      await socketManager.onOffline();
    }
    function registerRequestHandler(handler) {
      socketManager.registerRequestHandler(handler);
    }
    function unregisterRequestHandler(handler) {
      socketManager.unregisterRequestHandler(handler);
    }
    async function getConfig() {
      const res = await _ajax({
        call: "config",
        httpType: "GET",
        responseType: "json"
      });
      return res.config.filter(({ name }) => name.startsWith("desktop.") || name.startsWith("global."));
    }
    async function getSenderCertificate(omitE164) {
      return await _ajax({
        call: "deliveryCert",
        httpType: "GET",
        responseType: "json",
        validateResponse: { certificate: "string" },
        ...omitE164 ? { urlParameters: "?includeE164=false" } : {}
      });
    }
    async function getStorageCredentials() {
      return await _ajax({
        call: "storageToken",
        httpType: "GET",
        responseType: "json",
        schema: { username: "string", password: "string" }
      });
    }
    async function getStorageManifest(options = {}) {
      const { credentials, greaterThanVersion } = options;
      const { data, response } = await _ajax({
        call: "storageManifest",
        contentType: "application/x-protobuf",
        host: storageUrl,
        httpType: "GET",
        responseType: "byteswithdetails",
        urlParameters: greaterThanVersion ? `/version/${greaterThanVersion}` : "",
        ...credentials
      });
      if (response.status === 204) {
        throw makeHTTPError("promiseAjax: error response", response.status, response.headers.raw(), data, new Error().stack);
      }
      return data;
    }
    async function getStorageRecords(data, options = {}) {
      const { credentials } = options;
      return _ajax({
        call: "storageRead",
        contentType: "application/x-protobuf",
        data,
        host: storageUrl,
        httpType: "PUT",
        responseType: "bytes",
        ...credentials
      });
    }
    async function modifyStorageRecords(data, options = {}) {
      const { credentials } = options;
      return _ajax({
        call: "storageModify",
        contentType: "application/x-protobuf",
        data,
        host: storageUrl,
        httpType: "PUT",
        responseType: "bytes",
        ...credentials
      });
    }
    async function registerSupportForUnauthenticatedDelivery() {
      await _ajax({
        call: "supportUnauthenticatedDelivery",
        httpType: "PUT",
        responseType: "json"
      });
    }
    async function registerCapabilities(capabilities) {
      await _ajax({
        call: "registerCapabilities",
        httpType: "PUT",
        jsonData: capabilities
      });
    }
    function getProfileUrl(identifier, {
      profileKeyVersion,
      profileKeyCredentialRequest,
      credentialType = "expiringProfileKey"
    }) {
      let profileUrl = `/${identifier}`;
      if (profileKeyVersion !== void 0) {
        profileUrl += `/${profileKeyVersion}`;
        if (profileKeyCredentialRequest !== void 0) {
          profileUrl += `/${profileKeyCredentialRequest}?credentialType=${credentialType}`;
        }
      } else {
        (0, import_assert.strictAssert)(profileKeyCredentialRequest === void 0, "getProfileUrl called without version, but with request");
      }
      return profileUrl;
    }
    async function getProfile(identifier, options) {
      const { profileKeyVersion, profileKeyCredentialRequest, userLanguages } = options;
      return await _ajax({
        call: "profile",
        httpType: "GET",
        urlParameters: getProfileUrl(identifier, options),
        headers: {
          "Accept-Language": (0, import_userLanguages.formatAcceptLanguageHeader)(userLanguages)
        },
        responseType: "json",
        redactUrl: _createRedactor(identifier, profileKeyVersion, profileKeyCredentialRequest)
      });
    }
    async function getProfileForUsername(usernameToFetch) {
      return await _ajax({
        call: "profile",
        httpType: "GET",
        urlParameters: `/username/${usernameToFetch}`,
        responseType: "json",
        redactUrl: _createRedactor(usernameToFetch)
      });
    }
    async function putProfile(jsonData) {
      const res = await _ajax({
        call: "profile",
        httpType: "PUT",
        responseType: "json",
        jsonData
      });
      if (!res) {
        return;
      }
      return uploadAvatarHeadersZod.parse(res);
    }
    async function getProfileUnauth(identifier, options) {
      const {
        accessKey,
        profileKeyVersion,
        profileKeyCredentialRequest,
        userLanguages
      } = options;
      return await _ajax({
        call: "profile",
        httpType: "GET",
        urlParameters: getProfileUrl(identifier, options),
        headers: {
          "Accept-Language": (0, import_userLanguages.formatAcceptLanguageHeader)(userLanguages)
        },
        responseType: "json",
        unauthenticated: true,
        accessKey,
        redactUrl: _createRedactor(identifier, profileKeyVersion, profileKeyCredentialRequest)
      });
    }
    async function getBadgeImageFile(imageFileUrl) {
      (0, import_assert.strictAssert)((0, import_isBadgeImageFileUrlValid.isBadgeImageFileUrlValid)(imageFileUrl, updatesUrl), "getBadgeImageFile got an invalid URL. Was bad data saved?");
      return _outerAjax(imageFileUrl, {
        certificateAuthority,
        contentType: "application/octet-stream",
        proxyUrl,
        responseType: "bytes",
        timeout: 0,
        type: "GET",
        redactUrl: (href) => {
          const parsedUrl = (0, import_url.maybeParseUrl)(href);
          if (!parsedUrl) {
            return href;
          }
          const { pathname } = parsedUrl;
          const pattern = RegExp((0, import_lodash.escapeRegExp)(pathname), "g");
          return href.replace(pattern, `[REDACTED]${pathname.slice(-3)}`);
        },
        version
      });
    }
    async function getBoostBadgesFromServer(userLanguages) {
      return _ajax({
        call: "boostBadges",
        httpType: "GET",
        headers: {
          "Accept-Language": (0, import_userLanguages.formatAcceptLanguageHeader)(userLanguages)
        },
        responseType: "json"
      });
    }
    async function getAvatar(path) {
      return _outerAjax(`${cdnUrlObject["0"]}/${path}`, {
        certificateAuthority,
        contentType: "application/octet-stream",
        proxyUrl,
        responseType: "bytes",
        timeout: 0,
        type: "GET",
        redactUrl: (href) => {
          const pattern = RegExp((0, import_lodash.escapeRegExp)(path), "g");
          return href.replace(pattern, `[REDACTED]${path.slice(-3)}`);
        },
        version
      });
    }
    async function deleteUsername() {
      await _ajax({
        call: "username",
        httpType: "DELETE"
      });
    }
    async function putUsername(newUsername) {
      await _ajax({
        call: "username",
        httpType: "PUT",
        urlParameters: `/${newUsername}`
      });
    }
    async function reportMessage(senderUuid, serverGuid) {
      await _ajax({
        call: "reportMessage",
        httpType: "POST",
        urlParameters: `/${senderUuid}/${serverGuid}`,
        responseType: "bytes"
      });
    }
    async function requestVerificationSMS(number, token) {
      await _ajax({
        call: "accounts",
        httpType: "GET",
        urlParameters: `/sms/code/${number}?captcha=${token}`
      });
    }
    async function requestVerificationVoice(number, token) {
      await _ajax({
        call: "accounts",
        httpType: "GET",
        urlParameters: `/voice/code/${number}?captcha=${token}`
      });
    }
    async function checkAccountExistence(uuid) {
      try {
        await _ajax({
          httpType: "HEAD",
          call: "accountExistence",
          urlParameters: `/${uuid.toString()}`,
          unauthenticated: true,
          accessKey: void 0
        });
        return true;
      } catch (error) {
        if (error instanceof import_Errors.HTTPError && error.code === 404) {
          return false;
        }
        throw error;
      }
    }
    function startRegistration() {
      (0, import_assert.strictAssert)(activeRegistration === void 0, "Registration already in progress");
      activeRegistration = (0, import_explodePromise.explodePromise)();
      log.info("WebAPI: starting registration");
      return activeRegistration;
    }
    function finishRegistration(registration) {
      (0, import_assert.strictAssert)(activeRegistration !== void 0, "No active registration");
      (0, import_assert.strictAssert)(activeRegistration === registration, "Invalid registration baton");
      log.info("WebAPI: finishing registration");
      const current = activeRegistration;
      activeRegistration = void 0;
      current.resolve();
    }
    async function confirmCode(number, code, newPassword, registrationId, deviceName, options = {}) {
      const capabilities = {
        announcementGroup: true,
        giftBadges: true,
        "gv2-3": true,
        "gv1-migration": true,
        senderKey: true,
        changeNumber: true,
        stories: true
      };
      const { accessKey } = options;
      const jsonData = {
        capabilities,
        fetchesMessages: true,
        name: deviceName || void 0,
        registrationId,
        supportsSms: false,
        unidentifiedAccessKey: accessKey ? Bytes.toBase64(accessKey) : void 0,
        unrestrictedUnidentifiedAccess: false
      };
      const call = deviceName ? "devices" : "accounts";
      const urlPrefix = deviceName ? "/" : "/code/";
      await logout();
      username = number;
      password = newPassword;
      const response = await _ajax({
        isRegistration: true,
        call,
        httpType: "PUT",
        responseType: "json",
        urlParameters: urlPrefix + code,
        jsonData
      });
      username = `${response.uuid || number}.${response.deviceId || 1}`;
      password = newPassword;
      return response;
    }
    async function updateDeviceName(deviceName) {
      await _ajax({
        call: "updateDeviceName",
        httpType: "PUT",
        jsonData: {
          deviceName
        }
      });
    }
    async function getIceServers() {
      return await _ajax({
        call: "getIceServers",
        httpType: "GET",
        responseType: "json"
      });
    }
    async function getDevices() {
      return await _ajax({
        call: "devices",
        httpType: "GET",
        responseType: "json"
      });
    }
    async function registerKeys(genKeys, uuidKind) {
      const preKeys = genKeys.preKeys.map((key) => ({
        keyId: key.keyId,
        publicKey: Bytes.toBase64(key.publicKey)
      }));
      const keys = {
        identityKey: Bytes.toBase64(genKeys.identityKey),
        signedPreKey: {
          keyId: genKeys.signedPreKey.keyId,
          publicKey: Bytes.toBase64(genKeys.signedPreKey.publicKey),
          signature: Bytes.toBase64(genKeys.signedPreKey.signature)
        },
        preKeys
      };
      await _ajax({
        isRegistration: true,
        call: "keys",
        urlParameters: `?${uuidKindToQuery(uuidKind)}`,
        httpType: "PUT",
        jsonData: keys
      });
    }
    async function setSignedPreKey(signedPreKey, uuidKind) {
      await _ajax({
        call: "signed",
        urlParameters: `?${uuidKindToQuery(uuidKind)}`,
        httpType: "PUT",
        jsonData: {
          keyId: signedPreKey.keyId,
          publicKey: Bytes.toBase64(signedPreKey.publicKey),
          signature: Bytes.toBase64(signedPreKey.signature)
        }
      });
    }
    async function getMyKeys(uuidKind) {
      const result = await _ajax({
        call: "keys",
        urlParameters: `?${uuidKindToQuery(uuidKind)}`,
        httpType: "GET",
        responseType: "json",
        validateResponse: { count: "number" }
      });
      return result.count;
    }
    function handleKeys(res) {
      if (!Array.isArray(res.devices)) {
        throw new Error("Invalid response");
      }
      const devices = res.devices.map((device) => {
        if (!_validateResponse(device, { signedPreKey: "object" }) || !_validateResponse(device.signedPreKey, {
          publicKey: "string",
          signature: "string"
        })) {
          throw new Error("Invalid signedPreKey");
        }
        let preKey;
        if (device.preKey) {
          if (!_validateResponse(device, { preKey: "object" }) || !_validateResponse(device.preKey, { publicKey: "string" })) {
            throw new Error("Invalid preKey");
          }
          preKey = {
            keyId: device.preKey.keyId,
            publicKey: Bytes.fromBase64(device.preKey.publicKey)
          };
        }
        return {
          deviceId: device.deviceId,
          registrationId: device.registrationId,
          preKey,
          signedPreKey: {
            keyId: device.signedPreKey.keyId,
            publicKey: Bytes.fromBase64(device.signedPreKey.publicKey),
            signature: Bytes.fromBase64(device.signedPreKey.signature)
          }
        };
      });
      return {
        devices,
        identityKey: Bytes.fromBase64(res.identityKey)
      };
    }
    async function getKeysForIdentifier(identifier, deviceId) {
      const keys = await _ajax({
        call: "keys",
        httpType: "GET",
        urlParameters: `/${identifier}/${deviceId || "*"}`,
        responseType: "json",
        validateResponse: { identityKey: "string", devices: "object" }
      });
      return handleKeys(keys);
    }
    async function getKeysForIdentifierUnauth(identifier, deviceId, { accessKey } = {}) {
      const keys = await _ajax({
        call: "keys",
        httpType: "GET",
        urlParameters: `/${identifier}/${deviceId || "*"}`,
        responseType: "json",
        validateResponse: { identityKey: "string", devices: "object" },
        unauthenticated: true,
        accessKey
      });
      return handleKeys(keys);
    }
    async function sendMessagesUnauth(destination, messages, timestamp, {
      accessKey,
      online,
      urgent = true
    }) {
      const jsonData = {
        messages,
        timestamp,
        online: Boolean(online),
        urgent
      };
      await _ajax({
        call: "messages",
        httpType: "PUT",
        urlParameters: `/${destination}`,
        jsonData,
        responseType: "json",
        unauthenticated: true,
        accessKey
      });
    }
    async function sendMessages(destination, messages, timestamp, { online, urgent = true }) {
      const jsonData = {
        messages,
        timestamp,
        online: Boolean(online),
        urgent
      };
      await _ajax({
        call: "messages",
        httpType: "PUT",
        urlParameters: `/${destination}`,
        jsonData,
        responseType: "json"
      });
    }
    function booleanToString(value) {
      return value ? "true" : "false";
    }
    async function sendWithSenderKey(data, accessKeys, timestamp, {
      online,
      urgent = true
    }) {
      const onlineParam = `&online=${booleanToString(online)}`;
      const urgentParam = `&urgent=${booleanToString(urgent)}`;
      const response = await _ajax({
        call: "multiRecipient",
        httpType: "PUT",
        contentType: "application/vnd.signal-messenger.mrm",
        data,
        urlParameters: `?ts=${timestamp}${onlineParam}${urgentParam}`,
        responseType: "json",
        unauthenticated: true,
        accessKey: Bytes.toBase64(accessKeys)
      });
      const parseResult = multiRecipient200ResponseSchema.safeParse(response);
      if (parseResult.success) {
        return parseResult.data;
      }
      log.warn("WebAPI: invalid response from sendWithSenderKey", (0, import_errors.toLogFormat)(parseResult.error));
      return response;
    }
    function redactStickerUrl(stickerUrl) {
      return stickerUrl.replace(/(\/stickers\/)([^/]+)(\/)/, (_, begin, packId, end) => `${begin}${(0, import_Stickers.redactPackId)(packId)}${end}`);
    }
    async function getSticker(packId, stickerId) {
      if (!(0, import_Stickers.isPackIdValid)(packId)) {
        throw new Error("getSticker: pack ID was invalid");
      }
      return _outerAjax(`${cdnUrlObject["0"]}/stickers/${packId}/full/${stickerId}`, {
        certificateAuthority,
        proxyUrl,
        responseType: "bytes",
        type: "GET",
        redactUrl: redactStickerUrl,
        version
      });
    }
    async function getStickerPackManifest(packId) {
      if (!(0, import_Stickers.isPackIdValid)(packId)) {
        throw new Error("getStickerPackManifest: pack ID was invalid");
      }
      return _outerAjax(`${cdnUrlObject["0"]}/stickers/${packId}/manifest.proto`, {
        certificateAuthority,
        proxyUrl,
        responseType: "bytes",
        type: "GET",
        redactUrl: redactStickerUrl,
        version
      });
    }
    function makePutParams({
      key,
      credential,
      acl,
      algorithm,
      date,
      policy,
      signature
    }, encryptedBin) {
      const boundaryString = `----------------${(0, import_uuid.v4)().replace(/-/g, "")}`;
      const CRLF = "\r\n";
      const getSection = /* @__PURE__ */ __name((name, value) => [
        `--${boundaryString}`,
        `Content-Disposition: form-data; name="${name}"${CRLF}`,
        value
      ].join(CRLF), "getSection");
      const start = [
        getSection("key", key),
        getSection("x-amz-credential", credential),
        getSection("acl", acl),
        getSection("x-amz-algorithm", algorithm),
        getSection("x-amz-date", date),
        getSection("policy", policy),
        getSection("x-amz-signature", signature),
        getSection("Content-Type", "application/octet-stream"),
        `--${boundaryString}`,
        'Content-Disposition: form-data; name="file"',
        `Content-Type: application/octet-stream${CRLF}${CRLF}`
      ].join(CRLF);
      const end = `${CRLF}--${boundaryString}--${CRLF}`;
      const startBuffer = Buffer.from(start, "utf8");
      const attachmentBuffer = Buffer.from(encryptedBin);
      const endBuffer = Buffer.from(end, "utf8");
      const contentLength = startBuffer.length + attachmentBuffer.length + endBuffer.length;
      const data = Buffer.concat([startBuffer, attachmentBuffer, endBuffer], contentLength);
      return {
        data,
        contentType: `multipart/form-data; boundary=${boundaryString}`,
        headers: {
          "Content-Length": contentLength.toString()
        }
      };
    }
    async function putStickers(encryptedManifest, encryptedStickers, onProgress) {
      const { packId, manifest, stickers } = await _ajax({
        call: "getStickerPackUpload",
        responseType: "json",
        httpType: "GET",
        urlParameters: `/${encryptedStickers.length}`
      });
      const manifestParams = makePutParams(manifest, encryptedManifest);
      await _outerAjax(`${cdnUrlObject["0"]}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: "POST",
        version
      });
      const queue = new import_p_queue.default({
        concurrency: 3,
        timeout: durations.MINUTE * 30,
        throwOnTimeout: true
      });
      await Promise.all(stickers.map(async (sticker, index) => {
        const stickerParams = makePutParams(sticker, encryptedStickers[index]);
        await queue.add(async () => _outerAjax(`${cdnUrlObject["0"]}/`, {
          ...stickerParams,
          certificateAuthority,
          proxyUrl,
          timeout: 0,
          type: "POST",
          version
        }));
        if (onProgress) {
          onProgress();
        }
      }));
      return packId;
    }
    async function getAttachment(cdnKey, cdnNumber) {
      const abortController = new import_abort_controller.default();
      const cdnUrl = (0, import_lodash.isNumber)(cdnNumber) ? cdnUrlObject[cdnNumber] || cdnUrlObject["0"] : cdnUrlObject["0"];
      const stream = await _outerAjax(`${cdnUrl}/${cdnKey}`, {
        certificateAuthority,
        proxyUrl,
        responseType: "stream",
        timeout: 0,
        type: "GET",
        redactUrl: _createRedactor(cdnKey),
        version,
        abortSignal: abortController.signal
      });
      return (0, import_getStreamWithTimeout.getStreamWithTimeout)(stream, {
        name: `getAttachment(${cdnKey})`,
        timeout: GET_ATTACHMENT_CHUNK_TIMEOUT,
        abortController
      });
    }
    async function putAttachment(encryptedBin) {
      const response = await _ajax({
        call: "attachmentId",
        httpType: "GET",
        responseType: "json"
      });
      const { attachmentIdString } = response;
      const params = makePutParams(response, encryptedBin);
      await _outerAjax(`${cdnUrlObject["0"]}/`, {
        ...params,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: "POST",
        version
      });
      return attachmentIdString;
    }
    function getHeaderPadding() {
      const max = (0, import_Crypto.getRandomValue)(1, 64);
      let characters = "";
      for (let i = 0; i < max; i += 1) {
        characters += String.fromCharCode((0, import_Crypto.getRandomValue)(65, 122));
      }
      return characters;
    }
    async function fetchLinkPreviewMetadata(href, abortSignal) {
      return linkPreviewFetch.fetchLinkPreviewMetadata(fetchForLinkPreviews, href, abortSignal);
    }
    async function fetchLinkPreviewImage(href, abortSignal) {
      return linkPreviewFetch.fetchLinkPreviewImage(fetchForLinkPreviews, href, abortSignal);
    }
    async function makeProxiedRequest(targetUrl, options = {}) {
      const { returnUint8Array, start, end } = options;
      const headers = {
        "X-SignalPadding": getHeaderPadding()
      };
      if (import_is.default.number(start) && import_is.default.number(end)) {
        headers.Range = `bytes=${start}-${end}`;
      }
      const result = await _outerAjax(targetUrl, {
        responseType: returnUint8Array ? "byteswithdetails" : void 0,
        proxyUrl: contentProxyUrl,
        type: "GET",
        redirect: "follow",
        redactUrl: () => "[REDACTED_URL]",
        headers,
        version
      });
      if (!returnUint8Array) {
        return result;
      }
      const { response } = result;
      if (!response.headers || !response.headers.get) {
        throw new Error("makeProxiedRequest: Problem retrieving header value");
      }
      const range = response.headers.get("content-range");
      const match = PARSE_RANGE_HEADER.exec(range || "");
      if (!match || !match[1]) {
        throw new Error(`makeProxiedRequest: Unable to parse total size from ${range}`);
      }
      const totalSize = parseInt(match[1], 10);
      return {
        totalSize,
        result
      };
    }
    async function makeSfuRequest(targetUrl, type, headers, body) {
      return _outerAjax(targetUrl, {
        certificateAuthority,
        data: body,
        headers,
        proxyUrl,
        responseType: "byteswithdetails",
        timeout: 0,
        type,
        version
      });
    }
    function generateGroupAuth(groupPublicParamsHex, authCredentialPresentationHex) {
      return Bytes.toBase64(Bytes.fromString(`${groupPublicParamsHex}:${authCredentialPresentationHex}`));
    }
    async function getGroupCredentials({
      startDayInMs,
      endDayInMs
    }) {
      const startDayInSeconds = startDayInMs / durations.SECOND;
      const endDayInSeconds = endDayInMs / durations.SECOND;
      const response = await _ajax({
        call: "getGroupCredentials",
        urlParameters: `?redemptionStartSeconds=${startDayInSeconds}&redemptionEndSeconds=${endDayInSeconds}`,
        httpType: "GET",
        responseType: "json"
      });
      return response;
    }
    async function getGroupExternalCredential(options) {
      const basicAuth = generateGroupAuth(options.groupPublicParamsHex, options.authCredentialPresentationHex);
      const response = await _ajax({
        basicAuth,
        call: "groupToken",
        httpType: "GET",
        contentType: "application/x-protobuf",
        responseType: "bytes",
        host: storageUrl
      });
      return import_protobuf.SignalService.GroupExternalCredential.decode(response);
    }
    function verifyAttributes(attributes) {
      const { key, credential, acl, algorithm, date, policy, signature } = attributes;
      if (!key || !credential || !acl || !algorithm || !date || !policy || !signature) {
        throw new Error("verifyAttributes: Missing value from AvatarUploadAttributes");
      }
      return {
        key,
        credential,
        acl,
        algorithm,
        date,
        policy,
        signature
      };
    }
    async function uploadAvatar(uploadAvatarRequestHeaders, avatarData) {
      const verified = verifyAttributes(uploadAvatarRequestHeaders);
      const { key } = verified;
      const manifestParams = makePutParams(verified, avatarData);
      await _outerAjax(`${cdnUrlObject["0"]}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: "POST",
        version
      });
      return key;
    }
    async function uploadGroupAvatar(avatarData, options) {
      const basicAuth = generateGroupAuth(options.groupPublicParamsHex, options.authCredentialPresentationHex);
      const response = await _ajax({
        basicAuth,
        call: "getGroupAvatarUpload",
        httpType: "GET",
        responseType: "bytes",
        host: storageUrl
      });
      const attributes = import_protobuf.SignalService.AvatarUploadAttributes.decode(response);
      const verified = verifyAttributes(attributes);
      const { key } = verified;
      const manifestParams = makePutParams(verified, avatarData);
      await _outerAjax(`${cdnUrlObject["0"]}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: "POST",
        version
      });
      return key;
    }
    async function getGroupAvatar(key) {
      return _outerAjax(`${cdnUrlObject["0"]}/${key}`, {
        certificateAuthority,
        proxyUrl,
        responseType: "bytes",
        timeout: 0,
        type: "GET",
        version,
        redactUrl: _createRedactor(key)
      });
    }
    async function createGroup(group, options) {
      const basicAuth = generateGroupAuth(options.groupPublicParamsHex, options.authCredentialPresentationHex);
      const data = import_protobuf.SignalService.Group.encode(group).finish();
      await _ajax({
        basicAuth,
        call: "groups",
        contentType: "application/x-protobuf",
        data,
        host: storageUrl,
        httpType: "PUT"
      });
    }
    async function getGroup(options) {
      const basicAuth = generateGroupAuth(options.groupPublicParamsHex, options.authCredentialPresentationHex);
      const response = await _ajax({
        basicAuth,
        call: "groups",
        contentType: "application/x-protobuf",
        host: storageUrl,
        httpType: "GET",
        responseType: "bytes"
      });
      return import_protobuf.SignalService.Group.decode(response);
    }
    async function getGroupFromLink(inviteLinkPassword, auth) {
      const basicAuth = generateGroupAuth(auth.groupPublicParamsHex, auth.authCredentialPresentationHex);
      const safeInviteLinkPassword = inviteLinkPassword ? (0, import_webSafeBase64.toWebSafeBase64)(inviteLinkPassword) : void 0;
      const response = await _ajax({
        basicAuth,
        call: "groupsViaLink",
        contentType: "application/x-protobuf",
        host: storageUrl,
        httpType: "GET",
        responseType: "bytes",
        urlParameters: safeInviteLinkPassword ? `${safeInviteLinkPassword}` : void 0,
        redactUrl: _createRedactor(safeInviteLinkPassword)
      });
      return import_protobuf.SignalService.GroupJoinInfo.decode(response);
    }
    async function modifyGroup(changes, options, inviteLinkBase64) {
      const basicAuth = generateGroupAuth(options.groupPublicParamsHex, options.authCredentialPresentationHex);
      const data = import_protobuf.SignalService.GroupChange.Actions.encode(changes).finish();
      const safeInviteLinkPassword = inviteLinkBase64 ? (0, import_webSafeBase64.toWebSafeBase64)(inviteLinkBase64) : void 0;
      const response = await _ajax({
        basicAuth,
        call: "groups",
        contentType: "application/x-protobuf",
        data,
        host: storageUrl,
        httpType: "PATCH",
        responseType: "bytes",
        urlParameters: safeInviteLinkPassword ? `?inviteLinkPassword=${safeInviteLinkPassword}` : void 0,
        redactUrl: safeInviteLinkPassword ? _createRedactor(safeInviteLinkPassword) : void 0
      });
      return import_protobuf.SignalService.GroupChange.decode(response);
    }
    async function getGroupLog(options, credentials) {
      const basicAuth = generateGroupAuth(credentials.groupPublicParamsHex, credentials.authCredentialPresentationHex);
      const {
        startVersion,
        includeFirstState,
        includeLastState,
        maxSupportedChangeEpoch
      } = options;
      if (startVersion === void 0) {
        const { data: joinedData } = await _ajax({
          basicAuth,
          call: "groupJoinedAtVersion",
          contentType: "application/x-protobuf",
          host: storageUrl,
          httpType: "GET",
          responseType: "byteswithdetails"
        });
        const { joinedAtVersion } = import_protobuf.SignalService.Member.decode(joinedData);
        return getGroupLog({
          ...options,
          startVersion: joinedAtVersion
        }, credentials);
      }
      const withDetails = await _ajax({
        basicAuth,
        call: "groupLog",
        contentType: "application/x-protobuf",
        host: storageUrl,
        httpType: "GET",
        responseType: "byteswithdetails",
        urlParameters: `/${startVersion}?includeFirstState=${Boolean(includeFirstState)}&includeLastState=${Boolean(includeLastState)}&maxSupportedChangeEpoch=${Number(maxSupportedChangeEpoch)}`
      });
      const { data, response } = withDetails;
      const changes = import_protobuf.SignalService.GroupChanges.decode(data);
      if (response && response.status === 206) {
        const range = response.headers.get("Content-Range");
        const match = PARSE_GROUP_LOG_RANGE_HEADER.exec(range || "");
        const start = match ? parseInt(match[1], 10) : void 0;
        const end = match ? parseInt(match[2], 10) : void 0;
        const currentRevision = match ? parseInt(match[3], 10) : void 0;
        if (match && import_is.default.number(start) && import_is.default.number(end) && import_is.default.number(currentRevision)) {
          return {
            changes,
            start,
            end,
            currentRevision
          };
        }
      }
      return {
        changes
      };
    }
    async function getHasSubscription(subscriberId) {
      const formattedId = (0, import_webSafeBase64.toWebSafeBase64)(Bytes.toBase64(subscriberId));
      const data = await _ajax({
        call: "subscriptions",
        httpType: "GET",
        urlParameters: `/${formattedId}`,
        responseType: "json",
        unauthenticated: true,
        accessKey: void 0,
        redactUrl: _createRedactor(formattedId)
      });
      return (0, import_isRecord.isRecord)(data) && (0, import_isRecord.isRecord)(data.subscription) && Boolean(data.subscription.active);
    }
    function getProvisioningResource(handler) {
      return socketManager.getProvisioningResource(handler);
    }
    async function getUuidsForE164s(e164s) {
      const map = await cds.request({
        e164s
      });
      const result = {};
      for (const [key, value] of map) {
        result[key] = value.pni ?? value.aci ?? null;
      }
      return result;
    }
    async function getUuidsForE164sV2({
      e164s,
      acis,
      accessKeys
    }) {
      return cds.request({
        e164s,
        acis,
        accessKeys
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initialize,
  multiRecipient200ResponseSchema,
  multiRecipient409ResponseSchema,
  multiRecipient410ResponseSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiV2ViQVBJLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbi8qIGVzbGludC1kaXNhYmxlIGd1YXJkLWZvci1pbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cblxuaW1wb3J0IEFib3J0Q29udHJvbGxlciBmcm9tICdhYm9ydC1jb250cm9sbGVyJztcbmltcG9ydCB0eXBlIHsgUmVzcG9uc2UgfSBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCBQcm94eUFnZW50IGZyb20gJ3Byb3h5LWFnZW50JztcbmltcG9ydCB7IEFnZW50IH0gZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHR5cGUgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGVzY2FwZVJlZ0V4cCwgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGlzIGZyb20gJ0BzaW5kcmVzb3JodXMvaXMnO1xuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCB7IHY0IGFzIGdldEd1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuaW1wb3J0IHR5cGUgeyBSZWFkYWJsZSB9IGZyb20gJ3N0cmVhbSc7XG5cbmltcG9ydCB7IGFzc2VydCwgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuLi91dGlsL2lzUmVjb3JkJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IEV4cGxvZGVQcm9taXNlUmVzdWx0VHlwZSB9IGZyb20gJy4uL3V0aWwvZXhwbG9kZVByb21pc2UnO1xuaW1wb3J0IHsgZXhwbG9kZVByb21pc2UgfSBmcm9tICcuLi91dGlsL2V4cGxvZGVQcm9taXNlJztcbmltcG9ydCB7IGdldFVzZXJBZ2VudCB9IGZyb20gJy4uL3V0aWwvZ2V0VXNlckFnZW50JztcbmltcG9ydCB7IGdldFN0cmVhbVdpdGhUaW1lb3V0IH0gZnJvbSAnLi4vdXRpbC9nZXRTdHJlYW1XaXRoVGltZW91dCc7XG5pbXBvcnQgeyBmb3JtYXRBY2NlcHRMYW5ndWFnZUhlYWRlciB9IGZyb20gJy4uL3V0aWwvdXNlckxhbmd1YWdlcyc7XG5pbXBvcnQgeyB0b1dlYlNhZmVCYXNlNjQgfSBmcm9tICcuLi91dGlsL3dlYlNhZmVCYXNlNjQnO1xuaW1wb3J0IHsgZ2V0QmFzaWNBdXRoIH0gZnJvbSAnLi4vdXRpbC9nZXRCYXNpY0F1dGgnO1xuaW1wb3J0IHR5cGUgeyBTb2NrZXRTdGF0dXMgfSBmcm9tICcuLi90eXBlcy9Tb2NrZXRTdGF0dXMnO1xuaW1wb3J0IHsgdG9Mb2dGb3JtYXQgfSBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgaXNQYWNrSWRWYWxpZCwgcmVkYWN0UGFja0lkIH0gZnJvbSAnLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHR5cGUgeyBVVUlELCBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgVVVJREtpbmQgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB7IGdldFJhbmRvbVZhbHVlIH0gZnJvbSAnLi4vQ3J5cHRvJztcbmltcG9ydCAqIGFzIGxpbmtQcmV2aWV3RmV0Y2ggZnJvbSAnLi4vbGlua1ByZXZpZXdzL2xpbmtQcmV2aWV3RmV0Y2gnO1xuaW1wb3J0IHsgaXNCYWRnZUltYWdlRmlsZVVybFZhbGlkIH0gZnJvbSAnLi4vYmFkZ2VzL2lzQmFkZ2VJbWFnZUZpbGVVcmxWYWxpZCc7XG5cbmltcG9ydCB7IFNvY2tldE1hbmFnZXIgfSBmcm9tICcuL1NvY2tldE1hbmFnZXInO1xuaW1wb3J0IHR5cGUgeyBDRFNBdXRoVHlwZSwgQ0RTUmVzcG9uc2VUeXBlIH0gZnJvbSAnLi9jZHMvVHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7IENEU0Jhc2UgfSBmcm9tICcuL2Nkcy9DRFNCYXNlJztcbmltcG9ydCB7IExlZ2FjeUNEUyB9IGZyb20gJy4vY2RzL0xlZ2FjeUNEUyc7XG5pbXBvcnQgdHlwZSB7IExlZ2FjeUNEU1B1dEF0dGVzdGF0aW9uUmVzcG9uc2VUeXBlIH0gZnJvbSAnLi9jZHMvTGVnYWN5Q0RTJztcbmltcG9ydCB7IENEU0ggfSBmcm9tICcuL2Nkcy9DRFNIJztcbmltcG9ydCB7IENEU0kgfSBmcm9tICcuL2Nkcy9DRFNJJztcbmltcG9ydCB0eXBlIFdlYlNvY2tldFJlc291cmNlIGZyb20gJy4vV2Vic29ja2V0UmVzb3VyY2VzJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5cbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4vRXJyb3JzJztcbmltcG9ydCB0eXBlIE1lc3NhZ2VTZW5kZXIgZnJvbSAnLi9TZW5kTWVzc2FnZSc7XG5pbXBvcnQgdHlwZSB7XG4gIFdlYkFQSUNyZWRlbnRpYWxzLFxuICBJUmVxdWVzdEhhbmRsZXIsXG4gIFN0b3JhZ2VTZXJ2aWNlQ2FsbE9wdGlvbnNUeXBlLFxuICBTdG9yYWdlU2VydmljZUNyZWRlbnRpYWxzLFxufSBmcm9tICcuL1R5cGVzLmQnO1xuaW1wb3J0IHsgaGFuZGxlU3RhdHVzQ29kZSwgdHJhbnNsYXRlRXJyb3IgfSBmcm9tICcuL1V0aWxzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBtYXliZVBhcnNlVXJsIH0gZnJvbSAnLi4vdXRpbC91cmwnO1xuXG4vLyBOb3RlOiB0aGlzIHdpbGwgYnJlYWsgc29tZSBjb2RlIHRoYXQgZXhwZWN0cyB0byBiZSBhYmxlIHRvIHVzZSBlcnIucmVzcG9uc2Ugd2hlbiBhXG4vLyAgIHdlYiByZXF1ZXN0IGZhaWxzLCBiZWNhdXNlIGl0IHdpbGwgZm9yY2UgaXQgdG8gdGV4dC4gQnV0IGl0IGlzIHZlcnkgdXNlZnVsIGZvclxuLy8gICBkZWJ1Z2dpbmcgZmFpbGVkIHJlcXVlc3RzLlxuY29uc3QgREVCVUcgPSBmYWxzZTtcblxuZnVuY3Rpb24gX2NyZWF0ZVJlZGFjdG9yKFxuICAuLi50b1JlcGxhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nIHwgdW5kZWZpbmVkPlxuKTogUmVkYWN0VXJsIHtcbiAgLy8gTk9URTogSXQgd291bGQgYmUgbmljZSB0byByZW1vdmUgdGhpcyBjYXN0LCBidXQgVHlwZVNjcmlwdCBkb2Vzbid0IHN1cHBvcnRcbiAgLy8gICBpdC4gSG93ZXZlciwgdGhlcmUgaXMgW2FuIGlzc3VlXVswXSB0aGF0IGRpc2N1c3NlcyB0aGlzIGluIG1vcmUgZGV0YWlsLlxuICAvLyBbMF06IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTYwNjlcbiAgY29uc3Qgc3RyaW5nc1RvUmVwbGFjZSA9IHRvUmVwbGFjZS5maWx0ZXIoQm9vbGVhbikgYXMgQXJyYXk8c3RyaW5nPjtcbiAgcmV0dXJuIGhyZWYgPT5cbiAgICBzdHJpbmdzVG9SZXBsYWNlLnJlZHVjZSgocmVzdWx0OiBzdHJpbmcsIHN0cmluZ1RvUmVwbGFjZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gUmVnRXhwKGVzY2FwZVJlZ0V4cChzdHJpbmdUb1JlcGxhY2UpLCAnZycpO1xuICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBgW1JFREFDVEVEXSR7c3RyaW5nVG9SZXBsYWNlLnNsaWNlKC0zKX1gO1xuICAgICAgcmV0dXJuIHJlc3VsdC5yZXBsYWNlKHBhdHRlcm4sIHJlcGxhY2VtZW50KTtcbiAgICB9LCBocmVmKTtcbn1cblxuZnVuY3Rpb24gX3ZhbGlkYXRlUmVzcG9uc2UocmVzcG9uc2U6IGFueSwgc2NoZW1hOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gc2NoZW1hKSB7XG4gICAgICBzd2l0Y2ggKHNjaGVtYVtpXSkge1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2VbaV0gIT09IHNjaGVtYVtpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IEZJVkVfTUlOVVRFUyA9IDUgKiBkdXJhdGlvbnMuTUlOVVRFO1xuY29uc3QgR0VUX0FUVEFDSE1FTlRfQ0hVTktfVElNRU9VVCA9IDEwICogZHVyYXRpb25zLlNFQ09ORDtcblxudHlwZSBBZ2VudENhY2hlVHlwZSA9IHtcbiAgW25hbWU6IHN0cmluZ106IHtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICBhZ2VudDogUmV0dXJuVHlwZTx0eXBlb2YgUHJveHlBZ2VudD4gfCBBZ2VudDtcbiAgfTtcbn07XG5jb25zdCBhZ2VudHM6IEFnZW50Q2FjaGVUeXBlID0ge307XG5cbmZ1bmN0aW9uIGdldENvbnRlbnRUeXBlKHJlc3BvbnNlOiBSZXNwb25zZSkge1xuICBpZiAocmVzcG9uc2UuaGVhZGVycyAmJiByZXNwb25zZS5oZWFkZXJzLmdldCkge1xuICAgIHJldHVybiByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudHlwZSBGZXRjaEhlYWRlckxpc3RUeXBlID0geyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG5leHBvcnQgdHlwZSBIZWFkZXJMaXN0VHlwZSA9IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB8IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB9O1xudHlwZSBIVFRQQ29kZVR5cGUgPSAnR0VUJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURScgfCAnUEFUQ0gnIHwgJ0hFQUQnO1xuXG50eXBlIFJlZGFjdFVybCA9ICh1cmw6IHN0cmluZykgPT4gc3RyaW5nO1xuXG50eXBlIFByb21pc2VBamF4T3B0aW9uc1R5cGUgPSB7XG4gIHNvY2tldE1hbmFnZXI/OiBTb2NrZXRNYW5hZ2VyO1xuICBiYXNpY0F1dGg/OiBzdHJpbmc7XG4gIGNlcnRpZmljYXRlQXV0aG9yaXR5Pzogc3RyaW5nO1xuICBjb250ZW50VHlwZT86IHN0cmluZztcbiAgZGF0YT86IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIGhlYWRlcnM/OiBIZWFkZXJMaXN0VHlwZTtcbiAgaG9zdD86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIHBhdGg/OiBzdHJpbmc7XG4gIHByb3h5VXJsPzogc3RyaW5nO1xuICByZWRhY3RVcmw/OiBSZWRhY3RVcmw7XG4gIHJlZGlyZWN0PzogJ2Vycm9yJyB8ICdmb2xsb3cnIHwgJ21hbnVhbCc7XG4gIHJlc3BvbnNlVHlwZT86XG4gICAgfCAnanNvbidcbiAgICB8ICdqc29ud2l0aGRldGFpbHMnXG4gICAgfCAnYnl0ZXMnXG4gICAgfCAnYnl0ZXN3aXRoZGV0YWlscydcbiAgICB8ICdzdHJlYW0nO1xuICBzZXJ2ZXJVcmw/OiBzdHJpbmc7XG4gIHN0YWNrPzogc3RyaW5nO1xuICB0aW1lb3V0PzogbnVtYmVyO1xuICB0eXBlOiBIVFRQQ29kZVR5cGU7XG4gIHVzZXI/OiBzdHJpbmc7XG4gIHZhbGlkYXRlUmVzcG9uc2U/OiBhbnk7XG4gIHZlcnNpb246IHN0cmluZztcbiAgYWJvcnRTaWduYWw/OiBBYm9ydFNpZ25hbDtcbn0gJiAoXG4gIHwge1xuICAgICAgdW5hdXRoZW50aWNhdGVkPzogZmFsc2U7XG4gICAgICBhY2Nlc3NLZXk/OiBzdHJpbmc7XG4gICAgfVxuICB8IHtcbiAgICAgIHVuYXV0aGVudGljYXRlZDogdHJ1ZTtcbiAgICAgIGFjY2Vzc0tleTogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICAgIH1cbik7XG5cbnR5cGUgSlNPTldpdGhEZXRhaWxzVHlwZTxEYXRhID0gdW5rbm93bj4gPSB7XG4gIGRhdGE6IERhdGE7XG4gIGNvbnRlbnRUeXBlOiBzdHJpbmcgfCBudWxsO1xuICByZXNwb25zZTogUmVzcG9uc2U7XG59O1xudHlwZSBCeXRlc1dpdGhEZXRhaWxzVHlwZSA9IHtcbiAgZGF0YTogVWludDhBcnJheTtcbiAgY29udGVudFR5cGU6IHN0cmluZyB8IG51bGw7XG4gIHJlc3BvbnNlOiBSZXNwb25zZTtcbn07XG5cbmV4cG9ydCBjb25zdCBtdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlU2NoZW1hID0gelxuICAub2JqZWN0KHtcbiAgICB1dWlkczQwNDogei5hcnJheSh6LnN0cmluZygpKS5vcHRpb25hbCgpLFxuICAgIG5lZWRzU3luYzogei5ib29sZWFuKCkub3B0aW9uYWwoKSxcbiAgfSlcbiAgLnBhc3N0aHJvdWdoKCk7XG5leHBvcnQgdHlwZSBNdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlVHlwZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBtdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlU2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgbXVsdGlSZWNpcGllbnQ0MDlSZXNwb25zZVNjaGVtYSA9IHouYXJyYXkoXG4gIHpcbiAgICAub2JqZWN0KHtcbiAgICAgIHV1aWQ6IHouc3RyaW5nKCksXG4gICAgICBkZXZpY2VzOiB6XG4gICAgICAgIC5vYmplY3Qoe1xuICAgICAgICAgIG1pc3NpbmdEZXZpY2VzOiB6LmFycmF5KHoubnVtYmVyKCkpLm9wdGlvbmFsKCksXG4gICAgICAgICAgZXh0cmFEZXZpY2VzOiB6LmFycmF5KHoubnVtYmVyKCkpLm9wdGlvbmFsKCksXG4gICAgICAgIH0pXG4gICAgICAgIC5wYXNzdGhyb3VnaCgpLFxuICAgIH0pXG4gICAgLnBhc3N0aHJvdWdoKClcbik7XG5leHBvcnQgdHlwZSBNdWx0aVJlY2lwaWVudDQwOVJlc3BvbnNlVHlwZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBtdWx0aVJlY2lwaWVudDQwOVJlc3BvbnNlU2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgbXVsdGlSZWNpcGllbnQ0MTBSZXNwb25zZVNjaGVtYSA9IHouYXJyYXkoXG4gIHpcbiAgICAub2JqZWN0KHtcbiAgICAgIHV1aWQ6IHouc3RyaW5nKCksXG4gICAgICBkZXZpY2VzOiB6XG4gICAgICAgIC5vYmplY3Qoe1xuICAgICAgICAgIHN0YWxlRGV2aWNlczogei5hcnJheSh6Lm51bWJlcigpKS5vcHRpb25hbCgpLFxuICAgICAgICB9KVxuICAgICAgICAucGFzc3Rocm91Z2goKSxcbiAgICB9KVxuICAgIC5wYXNzdGhyb3VnaCgpXG4pO1xuZXhwb3J0IHR5cGUgTXVsdGlSZWNpcGllbnQ0MTBSZXNwb25zZVR5cGUgPSB6LmluZmVyPFxuICB0eXBlb2YgbXVsdGlSZWNpcGllbnQ0MTBSZXNwb25zZVNjaGVtYVxuPjtcblxuZnVuY3Rpb24gaXNTdWNjZXNzKHN0YXR1czogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBzdGF0dXMgPj0gMCAmJiBzdGF0dXMgPCA0MDA7XG59XG5cbmZ1bmN0aW9uIGdldEhvc3RuYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdXJsT2JqZWN0ID0gbmV3IFVSTCh1cmwpO1xuICByZXR1cm4gdXJsT2JqZWN0Lmhvc3RuYW1lO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcHJvbWlzZUFqYXgoXG4gIHByb3ZpZGVkVXJsOiBzdHJpbmcgfCBudWxsLFxuICBvcHRpb25zOiBQcm9taXNlQWpheE9wdGlvbnNUeXBlXG4pOiBQcm9taXNlPHVua25vd24+IHtcbiAgY29uc3QgeyBwcm94eVVybCwgc29ja2V0TWFuYWdlciB9ID0gb3B0aW9ucztcblxuICBjb25zdCB1cmwgPSBwcm92aWRlZFVybCB8fCBgJHtvcHRpb25zLmhvc3R9LyR7b3B0aW9ucy5wYXRofWA7XG4gIGNvbnN0IGxvZ1R5cGUgPSBzb2NrZXRNYW5hZ2VyID8gJyhXUyknIDogJyhSRVNUKSc7XG4gIGNvbnN0IHJlZGFjdGVkVVJMID0gb3B0aW9ucy5yZWRhY3RVcmwgPyBvcHRpb25zLnJlZGFjdFVybCh1cmwpIDogdXJsO1xuXG4gIGNvbnN0IHVuYXV0aExhYmVsID0gb3B0aW9ucy51bmF1dGhlbnRpY2F0ZWQgPyAnICh1bmF1dGgpJyA6ICcnO1xuICBjb25zdCBsb2dJZCA9IGAke29wdGlvbnMudHlwZX0gJHtsb2dUeXBlfSAke3JlZGFjdGVkVVJMfSR7dW5hdXRoTGFiZWx9YDtcbiAgbG9nLmluZm8obG9nSWQpO1xuXG4gIGNvbnN0IHRpbWVvdXQgPSB0eXBlb2Ygb3B0aW9ucy50aW1lb3V0ID09PSAnbnVtYmVyJyA/IG9wdGlvbnMudGltZW91dCA6IDEwMDAwO1xuXG4gIGNvbnN0IGFnZW50VHlwZSA9IG9wdGlvbnMudW5hdXRoZW50aWNhdGVkID8gJ3VuYXV0aCcgOiAnYXV0aCc7XG4gIGNvbnN0IGNhY2hlS2V5ID0gYCR7cHJveHlVcmx9LSR7YWdlbnRUeXBlfWA7XG5cbiAgY29uc3QgeyB0aW1lc3RhbXAgfSA9IGFnZW50c1tjYWNoZUtleV0gfHwgeyB0aW1lc3RhbXA6IG51bGwgfTtcbiAgaWYgKCF0aW1lc3RhbXAgfHwgdGltZXN0YW1wICsgRklWRV9NSU5VVEVTIDwgRGF0ZS5ub3coKSkge1xuICAgIGlmICh0aW1lc3RhbXApIHtcbiAgICAgIGxvZy5pbmZvKGBDeWNsaW5nIGFnZW50IGZvciB0eXBlICR7Y2FjaGVLZXl9YCk7XG4gICAgfVxuICAgIGFnZW50c1tjYWNoZUtleV0gPSB7XG4gICAgICBhZ2VudDogcHJveHlVcmxcbiAgICAgICAgPyBuZXcgUHJveHlBZ2VudChwcm94eVVybClcbiAgICAgICAgOiBuZXcgQWdlbnQoeyBrZWVwQWxpdmU6IHRydWUgfSksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgfTtcbiAgfVxuICBjb25zdCB7IGFnZW50IH0gPSBhZ2VudHNbY2FjaGVLZXldO1xuXG4gIGNvbnN0IGZldGNoT3B0aW9ucyA9IHtcbiAgICBtZXRob2Q6IG9wdGlvbnMudHlwZSxcbiAgICBib2R5OiBvcHRpb25zLmRhdGEsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ1VzZXItQWdlbnQnOiBnZXRVc2VyQWdlbnQob3B0aW9ucy52ZXJzaW9uKSxcbiAgICAgICdYLVNpZ25hbC1BZ2VudCc6ICdPV0QnLFxuICAgICAgLi4ub3B0aW9ucy5oZWFkZXJzLFxuICAgIH0gYXMgRmV0Y2hIZWFkZXJMaXN0VHlwZSxcbiAgICByZWRpcmVjdDogb3B0aW9ucy5yZWRpcmVjdCxcbiAgICBhZ2VudCxcbiAgICBjYTogb3B0aW9ucy5jZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICB0aW1lb3V0LFxuICAgIGFib3J0U2lnbmFsOiBvcHRpb25zLmFib3J0U2lnbmFsLFxuICB9O1xuXG4gIGlmIChmZXRjaE9wdGlvbnMuYm9keSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAvLyBub2RlLWZldGNoIGRvZXNuJ3Qgc3VwcG9ydCBVaW50OEFycmF5LCBvbmx5IG5vZGUgQnVmZmVyXG4gICAgY29uc3QgY29udGVudExlbmd0aCA9IGZldGNoT3B0aW9ucy5ib2R5LmJ5dGVMZW5ndGg7XG4gICAgZmV0Y2hPcHRpb25zLmJvZHkgPSBCdWZmZXIuZnJvbShmZXRjaE9wdGlvbnMuYm9keSk7XG5cbiAgICAvLyBub2RlLWZldGNoIGRvZXNuJ3Qgc2V0IGNvbnRlbnQtbGVuZ3RoIGxpa2UgUzMgcmVxdWlyZXNcbiAgICBmZXRjaE9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IGNvbnRlbnRMZW5ndGgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIGNvbnN0IHsgYWNjZXNzS2V5LCBiYXNpY0F1dGgsIHVuYXV0aGVudGljYXRlZCB9ID0gb3B0aW9ucztcbiAgaWYgKGJhc2ljQXV0aCkge1xuICAgIGZldGNoT3B0aW9ucy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmFzaWMgJHtiYXNpY0F1dGh9YDtcbiAgfSBlbHNlIGlmICh1bmF1dGhlbnRpY2F0ZWQpIHtcbiAgICBpZiAoYWNjZXNzS2V5KSB7XG4gICAgICAvLyBBY2Nlc3Mga2V5IGlzIGFscmVhZHkgYSBCYXNlNjQgc3RyaW5nXG4gICAgICBmZXRjaE9wdGlvbnMuaGVhZGVyc1snVW5pZGVudGlmaWVkLUFjY2Vzcy1LZXknXSA9IGFjY2Vzc0tleTtcbiAgICB9XG4gIH0gZWxzZSBpZiAob3B0aW9ucy51c2VyICYmIG9wdGlvbnMucGFzc3dvcmQpIHtcbiAgICBmZXRjaE9wdGlvbnMuaGVhZGVycy5BdXRob3JpemF0aW9uID0gZ2V0QmFzaWNBdXRoKHtcbiAgICAgIHVzZXJuYW1lOiBvcHRpb25zLnVzZXIsXG4gICAgICBwYXNzd29yZDogb3B0aW9ucy5wYXNzd29yZCxcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlKSB7XG4gICAgZmV0Y2hPcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gb3B0aW9ucy5jb250ZW50VHlwZTtcbiAgfVxuXG4gIGxldCByZXNwb25zZTogUmVzcG9uc2U7XG4gIGxldCByZXN1bHQ6IHN0cmluZyB8IFVpbnQ4QXJyYXkgfCBSZWFkYWJsZSB8IHVua25vd247XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBzb2NrZXRNYW5hZ2VyXG4gICAgICA/IGF3YWl0IHNvY2tldE1hbmFnZXIuZmV0Y2godXJsLCBmZXRjaE9wdGlvbnMpXG4gICAgICA6IGF3YWl0IGZldGNoKHVybCwgZmV0Y2hPcHRpb25zKTtcblxuICAgIGlmIChcbiAgICAgIG9wdGlvbnMuc2VydmVyVXJsICYmXG4gICAgICBnZXRIb3N0bmFtZShvcHRpb25zLnNlcnZlclVybCkgPT09IGdldEhvc3RuYW1lKHVybClcbiAgICApIHtcbiAgICAgIGF3YWl0IGhhbmRsZVN0YXR1c0NvZGUocmVzcG9uc2Uuc3RhdHVzKTtcblxuICAgICAgaWYgKCF1bmF1dGhlbnRpY2F0ZWQgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgbG9nLmVycm9yKCdHb3QgNDAxIGZyb20gU2lnbmFsIFNlcnZlci4gV2UgbWlnaHQgYmUgdW5saW5rZWQuJyk7XG4gICAgICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKCdtaWdodEJlVW5saW5rZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoREVCVUcgJiYgIWlzU3VjY2VzcyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIChvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nIHx8XG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnanNvbndpdGhkZXRhaWxzJykgJiZcbiAgICAgIC9eYXBwbGljYXRpb25cXC9qc29uKDsuKik/JC8udGVzdChcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnYnl0ZXMnIHx8XG4gICAgICBvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ2J5dGVzd2l0aGRldGFpbHMnXG4gICAgKSB7XG4gICAgICByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5idWZmZXIoKTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJykge1xuICAgICAgcmVzdWx0ID0gcmVzcG9uc2UuYm9keTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UudGV4dENvbnZlcnRlZCgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZy5lcnJvcihsb2dJZCwgMCwgJ0Vycm9yJyk7XG4gICAgY29uc3Qgc3RhY2sgPSBgJHtlLnN0YWNrfVxcbkluaXRpYWwgc3RhY2s6XFxuJHtvcHRpb25zLnN0YWNrfWA7XG4gICAgdGhyb3cgbWFrZUhUVFBFcnJvcigncHJvbWlzZUFqYXggY2F0Y2gnLCAwLCB7fSwgZS50b1N0cmluZygpLCBzdGFjayk7XG4gIH1cblxuICBpZiAoIWlzU3VjY2VzcyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgbG9nLmVycm9yKGxvZ0lkLCByZXNwb25zZS5zdGF0dXMsICdFcnJvcicpO1xuXG4gICAgdGhyb3cgbWFrZUhUVFBFcnJvcihcbiAgICAgICdwcm9taXNlQWpheDogZXJyb3IgcmVzcG9uc2UnLFxuICAgICAgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycy5yYXcoKSxcbiAgICAgIHJlc3VsdCxcbiAgICAgIG9wdGlvbnMuc3RhY2tcbiAgICApO1xuICB9XG5cbiAgaWYgKFxuICAgIG9wdGlvbnMucmVzcG9uc2VUeXBlID09PSAnanNvbicgfHxcbiAgICBvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb253aXRoZGV0YWlscydcbiAgKSB7XG4gICAgaWYgKG9wdGlvbnMudmFsaWRhdGVSZXNwb25zZSkge1xuICAgICAgaWYgKCFfdmFsaWRhdGVSZXNwb25zZShyZXN1bHQsIG9wdGlvbnMudmFsaWRhdGVSZXNwb25zZSkpIHtcbiAgICAgICAgbG9nLmVycm9yKGxvZ0lkLCByZXNwb25zZS5zdGF0dXMsICdFcnJvcicpO1xuICAgICAgICB0aHJvdyBtYWtlSFRUUEVycm9yKFxuICAgICAgICAgICdwcm9taXNlQWpheDogaW52YWxpZCByZXNwb25zZScsXG4gICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMucmF3KCksXG4gICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgIG9wdGlvbnMuc3RhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2cuaW5mbyhsb2dJZCwgcmVzcG9uc2Uuc3RhdHVzLCAnU3VjY2VzcycpO1xuXG4gIGlmIChvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ2J5dGVzd2l0aGRldGFpbHMnKSB7XG4gICAgYXNzZXJ0KHJlc3VsdCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXksICdFeHBlY3RlZCBVaW50OEFycmF5IHJlc3VsdCcpO1xuICAgIGNvbnN0IGZ1bGxSZXN1bHQ6IEJ5dGVzV2l0aERldGFpbHNUeXBlID0ge1xuICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgY29udGVudFR5cGU6IGdldENvbnRlbnRUeXBlKHJlc3BvbnNlKSxcbiAgICAgIHJlc3BvbnNlLFxuICAgIH07XG5cbiAgICByZXR1cm4gZnVsbFJlc3VsdDtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb253aXRoZGV0YWlscycpIHtcbiAgICBjb25zdCBmdWxsUmVzdWx0OiBKU09OV2l0aERldGFpbHNUeXBlID0ge1xuICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgY29udGVudFR5cGU6IGdldENvbnRlbnRUeXBlKHJlc3BvbnNlKSxcbiAgICAgIHJlc3BvbnNlLFxuICAgIH07XG5cbiAgICByZXR1cm4gZnVsbFJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9yZXRyeUFqYXgoXG4gIHVybDogc3RyaW5nIHwgbnVsbCxcbiAgb3B0aW9uczogUHJvbWlzZUFqYXhPcHRpb25zVHlwZSxcbiAgcHJvdmlkZWRMaW1pdD86IG51bWJlcixcbiAgcHJvdmlkZWRDb3VudD86IG51bWJlclxuKTogUHJvbWlzZTx1bmtub3duPiB7XG4gIGNvbnN0IGNvdW50ID0gKHByb3ZpZGVkQ291bnQgfHwgMCkgKyAxO1xuICBjb25zdCBsaW1pdCA9IHByb3ZpZGVkTGltaXQgfHwgMztcblxuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBfcHJvbWlzZUFqYXgodXJsLCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgSFRUUEVycm9yICYmIGUuY29kZSA9PT0gLTEgJiYgY291bnQgPCBsaW1pdCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKF9yZXRyeUFqYXgodXJsLCBvcHRpb25zLCBsaW1pdCwgY291bnQpKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb3V0ZXJBamF4KFxuICBwcm92aWRlZFVybDogc3RyaW5nIHwgbnVsbCxcbiAgb3B0aW9uczogUHJvbWlzZUFqYXhPcHRpb25zVHlwZSAmIHsgcmVzcG9uc2VUeXBlOiAnanNvbicgfVxuKTogUHJvbWlzZTx1bmtub3duPjtcbmZ1bmN0aW9uIF9vdXRlckFqYXgoXG4gIHByb3ZpZGVkVXJsOiBzdHJpbmcgfCBudWxsLFxuICBvcHRpb25zOiBQcm9taXNlQWpheE9wdGlvbnNUeXBlICYgeyByZXNwb25zZVR5cGU6ICdqc29ud2l0aGRldGFpbHMnIH1cbik6IFByb21pc2U8SlNPTldpdGhEZXRhaWxzVHlwZT47XG5mdW5jdGlvbiBfb3V0ZXJBamF4KFxuICBwcm92aWRlZFVybDogc3RyaW5nIHwgbnVsbCxcbiAgb3B0aW9uczogUHJvbWlzZUFqYXhPcHRpb25zVHlwZSAmIHsgcmVzcG9uc2VUeXBlPzogJ2J5dGVzJyB9XG4pOiBQcm9taXNlPFVpbnQ4QXJyYXk+O1xuZnVuY3Rpb24gX291dGVyQWpheChcbiAgcHJvdmlkZWRVcmw6IHN0cmluZyB8IG51bGwsXG4gIG9wdGlvbnM6IFByb21pc2VBamF4T3B0aW9uc1R5cGUgJiB7IHJlc3BvbnNlVHlwZTogJ2J5dGVzd2l0aGRldGFpbHMnIH1cbik6IFByb21pc2U8Qnl0ZXNXaXRoRGV0YWlsc1R5cGU+O1xuZnVuY3Rpb24gX291dGVyQWpheChcbiAgcHJvdmlkZWRVcmw6IHN0cmluZyB8IG51bGwsXG4gIG9wdGlvbnM6IFByb21pc2VBamF4T3B0aW9uc1R5cGUgJiB7IHJlc3BvbnNlVHlwZT86ICdzdHJlYW0nIH1cbik6IFByb21pc2U8UmVhZGFibGU+O1xuZnVuY3Rpb24gX291dGVyQWpheChcbiAgcHJvdmlkZWRVcmw6IHN0cmluZyB8IG51bGwsXG4gIG9wdGlvbnM6IFByb21pc2VBamF4T3B0aW9uc1R5cGVcbik6IFByb21pc2U8dW5rbm93bj47XG5cbmFzeW5jIGZ1bmN0aW9uIF9vdXRlckFqYXgoXG4gIHVybDogc3RyaW5nIHwgbnVsbCxcbiAgb3B0aW9uczogUHJvbWlzZUFqYXhPcHRpb25zVHlwZVxuKTogUHJvbWlzZTx1bmtub3duPiB7XG4gIG9wdGlvbnMuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjazsgLy8ganVzdCBpbiBjYXNlLCBzYXZlIHN0YWNrIGhlcmUuXG5cbiAgcmV0dXJuIF9yZXRyeUFqYXgodXJsLCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gbWFrZUhUVFBFcnJvcihcbiAgbWVzc2FnZTogc3RyaW5nLFxuICBwcm92aWRlZENvZGU6IG51bWJlcixcbiAgaGVhZGVyczogSGVhZGVyTGlzdFR5cGUsXG4gIHJlc3BvbnNlOiB1bmtub3duLFxuICBzdGFjaz86IHN0cmluZ1xuKSB7XG4gIHJldHVybiBuZXcgSFRUUEVycm9yKG1lc3NhZ2UsIHtcbiAgICBjb2RlOiBwcm92aWRlZENvZGUsXG4gICAgaGVhZGVycyxcbiAgICByZXNwb25zZSxcbiAgICBzdGFjayxcbiAgfSk7XG59XG5cbmNvbnN0IFVSTF9DQUxMUyA9IHtcbiAgYWNjb3VudHM6ICd2MS9hY2NvdW50cycsXG4gIGFjY291bnRFeGlzdGVuY2U6ICd2MS9hY2NvdW50cy9hY2NvdW50JyxcbiAgYXR0YWNobWVudElkOiAndjIvYXR0YWNobWVudHMvZm9ybS91cGxvYWQnLFxuICBhdHRlc3RhdGlvbjogJ3YxL2F0dGVzdGF0aW9uJyxcbiAgYm9vc3RCYWRnZXM6ICd2MS9zdWJzY3JpcHRpb24vYm9vc3QvYmFkZ2VzJyxcbiAgY2hhbGxlbmdlOiAndjEvY2hhbGxlbmdlJyxcbiAgY29uZmlnOiAndjEvY29uZmlnJyxcbiAgZGVsaXZlcnlDZXJ0OiAndjEvY2VydGlmaWNhdGUvZGVsaXZlcnknLFxuICBkZXZpY2VzOiAndjEvZGV2aWNlcycsXG4gIGRpcmVjdG9yeUF1dGg6ICd2MS9kaXJlY3RvcnkvYXV0aCcsXG4gIGRpcmVjdG9yeUF1dGhWMjogJ3YyL2RpcmVjdG9yeS9hdXRoJyxcbiAgZGlzY292ZXJ5OiAndjEvZGlzY292ZXJ5JyxcbiAgZ2V0R3JvdXBBdmF0YXJVcGxvYWQ6ICd2MS9ncm91cHMvYXZhdGFyL2Zvcm0nLFxuICBnZXRHcm91cENyZWRlbnRpYWxzOiAndjEvY2VydGlmaWNhdGUvYXV0aC9ncm91cCcsXG4gIGdldEljZVNlcnZlcnM6ICd2MS9hY2NvdW50cy90dXJuJyxcbiAgZ2V0U3RpY2tlclBhY2tVcGxvYWQ6ICd2MS9zdGlja2VyL3BhY2svZm9ybScsXG4gIGdyb3VwTG9nOiAndjEvZ3JvdXBzL2xvZ3MnLFxuICBncm91cEpvaW5lZEF0VmVyc2lvbjogJ3YxL2dyb3Vwcy9qb2luZWRfYXRfdmVyc2lvbicsXG4gIGdyb3VwczogJ3YxL2dyb3VwcycsXG4gIGdyb3Vwc1ZpYUxpbms6ICd2MS9ncm91cHMvam9pbi8nLFxuICBncm91cFRva2VuOiAndjEvZ3JvdXBzL3Rva2VuJyxcbiAga2V5czogJ3YyL2tleXMnLFxuICBtZXNzYWdlczogJ3YxL21lc3NhZ2VzJyxcbiAgbXVsdGlSZWNpcGllbnQ6ICd2MS9tZXNzYWdlcy9tdWx0aV9yZWNpcGllbnQnLFxuICBwcm9maWxlOiAndjEvcHJvZmlsZScsXG4gIHJlZ2lzdGVyQ2FwYWJpbGl0aWVzOiAndjEvZGV2aWNlcy9jYXBhYmlsaXRpZXMnLFxuICByZXBvcnRNZXNzYWdlOiAndjEvbWVzc2FnZXMvcmVwb3J0JyxcbiAgc2lnbmVkOiAndjIva2V5cy9zaWduZWQnLFxuICBzdG9yYWdlTWFuaWZlc3Q6ICd2MS9zdG9yYWdlL21hbmlmZXN0JyxcbiAgc3RvcmFnZU1vZGlmeTogJ3YxL3N0b3JhZ2UvJyxcbiAgc3RvcmFnZVJlYWQ6ICd2MS9zdG9yYWdlL3JlYWQnLFxuICBzdG9yYWdlVG9rZW46ICd2MS9zdG9yYWdlL2F1dGgnLFxuICBzdWJzY3JpcHRpb25zOiAndjEvc3Vic2NyaXB0aW9uJyxcbiAgc3VwcG9ydFVuYXV0aGVudGljYXRlZERlbGl2ZXJ5OiAndjEvZGV2aWNlcy91bmF1dGhlbnRpY2F0ZWRfZGVsaXZlcnknLFxuICB1cGRhdGVEZXZpY2VOYW1lOiAndjEvYWNjb3VudHMvbmFtZScsXG4gIHVzZXJuYW1lOiAndjEvYWNjb3VudHMvdXNlcm5hbWUnLFxuICB3aG9hbWk6ICd2MS9hY2NvdW50cy93aG9hbWknLFxufTtcblxuY29uc3QgV0VCU09DS0VUX0NBTExTID0gbmV3IFNldDxrZXlvZiB0eXBlb2YgVVJMX0NBTExTPihbXG4gIC8vIE1lc3NhZ2VDb250cm9sbGVyXG4gICdtZXNzYWdlcycsXG4gICdtdWx0aVJlY2lwaWVudCcsXG4gICdyZXBvcnRNZXNzYWdlJyxcblxuICAvLyBQcm9maWxlQ29udHJvbGxlclxuICAncHJvZmlsZScsXG5cbiAgLy8gQXR0YWNobWVudENvbnRyb2xsZXJWMlxuICAnYXR0YWNobWVudElkJyxcblxuICAvLyBSZW1vdGVDb25maWdDb250cm9sbGVyXG4gICdjb25maWcnLFxuXG4gIC8vIENlcnRpZmljYXRlXG4gICdkZWxpdmVyeUNlcnQnLFxuICAnZ2V0R3JvdXBDcmVkZW50aWFscycsXG5cbiAgLy8gRGV2aWNlc1xuICAnZGV2aWNlcycsXG4gICdyZWdpc3RlckNhcGFiaWxpdGllcycsXG4gICdzdXBwb3J0VW5hdXRoZW50aWNhdGVkRGVsaXZlcnknLFxuXG4gIC8vIERpcmVjdG9yeVxuICAnZGlyZWN0b3J5QXV0aCcsXG4gICdkaXJlY3RvcnlBdXRoVjInLFxuXG4gIC8vIFN0b3JhZ2VcbiAgJ3N0b3JhZ2VUb2tlbicsXG5dKTtcblxudHlwZSBEaXJlY3RvcnlWMU9wdGlvbnNUeXBlID0gUmVhZG9ubHk8e1xuICBkaXJlY3RvcnlWZXJzaW9uOiAxO1xuICBkaXJlY3RvcnlVcmw6IHN0cmluZztcbiAgZGlyZWN0b3J5RW5jbGF2ZUlkOiBzdHJpbmc7XG4gIGRpcmVjdG9yeVRydXN0QW5jaG9yOiBzdHJpbmc7XG59PjtcblxudHlwZSBEaXJlY3RvcnlWMk9wdGlvbnNUeXBlID0gUmVhZG9ubHk8e1xuICBkaXJlY3RvcnlWZXJzaW9uOiAyO1xuICBkaXJlY3RvcnlWMlVybDogc3RyaW5nO1xuICBkaXJlY3RvcnlWMlB1YmxpY0tleTogc3RyaW5nO1xuICBkaXJlY3RvcnlWMkNvZGVIYXNoZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbn0+O1xuXG50eXBlIERpcmVjdG9yeVYzT3B0aW9uc1R5cGUgPSBSZWFkb25seTx7XG4gIGRpcmVjdG9yeVZlcnNpb246IDM7XG4gIGRpcmVjdG9yeVYzVXJsOiBzdHJpbmc7XG4gIGRpcmVjdG9yeVYzTVJFTkNMQVZFOiBzdHJpbmc7XG59PjtcblxudHlwZSBPcHRpb25hbERpcmVjdG9yeUZpZWxkc1R5cGUgPSB7XG4gIGRpcmVjdG9yeVVybD86IHVua25vd247XG4gIGRpcmVjdG9yeUVuY2xhdmVJZD86IHVua25vd247XG4gIGRpcmVjdG9yeVRydXN0QW5jaG9yPzogdW5rbm93bjtcbiAgZGlyZWN0b3J5VjJVcmw/OiB1bmtub3duO1xuICBkaXJlY3RvcnlWMlB1YmxpY0tleT86IHVua25vd247XG4gIGRpcmVjdG9yeVYyQ29kZUhhc2hlcz86IHVua25vd247XG4gIGRpcmVjdG9yeVYzVXJsPzogdW5rbm93bjtcbiAgZGlyZWN0b3J5VjNNUkVOQ0xBVkU/OiB1bmtub3duO1xufTtcblxudHlwZSBEaXJlY3RvcnlPcHRpb25zVHlwZSA9IE9wdGlvbmFsRGlyZWN0b3J5RmllbGRzVHlwZSAmXG4gIChEaXJlY3RvcnlWMU9wdGlvbnNUeXBlIHwgRGlyZWN0b3J5VjJPcHRpb25zVHlwZSB8IERpcmVjdG9yeVYzT3B0aW9uc1R5cGUpO1xuXG50eXBlIEluaXRpYWxpemVPcHRpb25zVHlwZSA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHN0b3JhZ2VVcmw6IHN0cmluZztcbiAgdXBkYXRlc1VybDogc3RyaW5nO1xuICBjZG5VcmxPYmplY3Q6IHtcbiAgICByZWFkb25seSAnMCc6IHN0cmluZztcbiAgICByZWFkb25seSBbcHJvcE5hbWU6IHN0cmluZ106IHN0cmluZztcbiAgfTtcbiAgY2VydGlmaWNhdGVBdXRob3JpdHk6IHN0cmluZztcbiAgY29udGVudFByb3h5VXJsOiBzdHJpbmc7XG4gIHByb3h5VXJsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHZlcnNpb246IHN0cmluZztcbiAgZGlyZWN0b3J5Q29uZmlnOiBEaXJlY3RvcnlPcHRpb25zVHlwZTtcbn07XG5cbmV4cG9ydCB0eXBlIE1lc3NhZ2VUeXBlID0gUmVhZG9ubHk8e1xuICB0eXBlOiBudW1iZXI7XG4gIGRlc3RpbmF0aW9uRGV2aWNlSWQ6IG51bWJlcjtcbiAgZGVzdGluYXRpb25SZWdpc3RyYXRpb25JZDogbnVtYmVyO1xuICBjb250ZW50OiBzdHJpbmc7XG59PjtcblxudHlwZSBBamF4T3B0aW9uc1R5cGUgPSB7XG4gIGJhc2ljQXV0aD86IHN0cmluZztcbiAgY2FsbDoga2V5b2YgdHlwZW9mIFVSTF9DQUxMUztcbiAgY29udGVudFR5cGU/OiBzdHJpbmc7XG4gIGRhdGE/OiBVaW50OEFycmF5IHwgQnVmZmVyIHwgVWludDhBcnJheSB8IHN0cmluZztcbiAgaGVhZGVycz86IEhlYWRlckxpc3RUeXBlO1xuICBob3N0Pzogc3RyaW5nO1xuICBodHRwVHlwZTogSFRUUENvZGVUeXBlO1xuICBqc29uRGF0YT86IHVua25vd247XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICByZWRhY3RVcmw/OiBSZWRhY3RVcmw7XG4gIHJlc3BvbnNlVHlwZT86ICdqc29uJyB8ICdieXRlcycgfCAnYnl0ZXN3aXRoZGV0YWlscycgfCAnc3RyZWFtJztcbiAgc2NoZW1hPzogdW5rbm93bjtcbiAgdGltZW91dD86IG51bWJlcjtcbiAgdXJsUGFyYW1ldGVycz86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHZhbGlkYXRlUmVzcG9uc2U/OiBhbnk7XG4gIGlzUmVnaXN0cmF0aW9uPzogdHJ1ZTtcbn0gJiAoXG4gIHwge1xuICAgICAgdW5hdXRoZW50aWNhdGVkPzogZmFsc2U7XG4gICAgICBhY2Nlc3NLZXk/OiBzdHJpbmc7XG4gICAgfVxuICB8IHtcbiAgICAgIHVuYXV0aGVudGljYXRlZDogdHJ1ZTtcbiAgICAgIGFjY2Vzc0tleTogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICAgIH1cbik7XG5cbmV4cG9ydCB0eXBlIFdlYkFQSUNvbm5lY3RPcHRpb25zVHlwZSA9IFdlYkFQSUNyZWRlbnRpYWxzICYge1xuICB1c2VXZWJTb2NrZXQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgV2ViQVBJQ29ubmVjdFR5cGUgPSB7XG4gIGNvbm5lY3Q6IChvcHRpb25zOiBXZWJBUElDb25uZWN0T3B0aW9uc1R5cGUpID0+IFdlYkFQSVR5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBDYXBhYmlsaXRpZXNUeXBlID0ge1xuICBhbm5vdW5jZW1lbnRHcm91cDogYm9vbGVhbjtcbiAgZ2lmdEJhZGdlczogYm9vbGVhbjtcbiAgJ2d2MS1taWdyYXRpb24nOiBib29sZWFuO1xuICBzZW5kZXJLZXk6IGJvb2xlYW47XG4gIGNoYW5nZU51bWJlcjogYm9vbGVhbjtcbiAgc3RvcmllczogYm9vbGVhbjtcbn07XG5leHBvcnQgdHlwZSBDYXBhYmlsaXRpZXNVcGxvYWRUeXBlID0ge1xuICBhbm5vdW5jZW1lbnRHcm91cDogdHJ1ZTtcbiAgZ2lmdEJhZGdlczogdHJ1ZTtcbiAgJ2d2Mi0zJzogdHJ1ZTtcbiAgJ2d2MS1taWdyYXRpb24nOiB0cnVlO1xuICBzZW5kZXJLZXk6IHRydWU7XG4gIGNoYW5nZU51bWJlcjogdHJ1ZTtcbiAgc3RvcmllczogdHJ1ZTtcbn07XG5cbnR5cGUgU3RpY2tlclBhY2tNYW5pZmVzdFR5cGUgPSBVaW50OEFycmF5O1xuXG5leHBvcnQgdHlwZSBHcm91cENyZWRlbnRpYWxUeXBlID0ge1xuICBjcmVkZW50aWFsOiBzdHJpbmc7XG4gIHJlZGVtcHRpb25UaW1lOiBudW1iZXI7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBDcmVkZW50aWFsc1R5cGUgPSB7XG4gIGdyb3VwUHVibGljUGFyYW1zSGV4OiBzdHJpbmc7XG4gIGF1dGhDcmVkZW50aWFsUHJlc2VudGF0aW9uSGV4OiBzdHJpbmc7XG59O1xuZXhwb3J0IHR5cGUgR2V0R3JvdXBMb2dPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgc3RhcnRWZXJzaW9uOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIGluY2x1ZGVGaXJzdFN0YXRlOiBib29sZWFuO1xuICBpbmNsdWRlTGFzdFN0YXRlOiBib29sZWFuO1xuICBtYXhTdXBwb3J0ZWRDaGFuZ2VFcG9jaDogbnVtYmVyO1xufT47XG5leHBvcnQgdHlwZSBHcm91cExvZ1Jlc3BvbnNlVHlwZSA9IHtcbiAgY3VycmVudFJldmlzaW9uPzogbnVtYmVyO1xuICBzdGFydD86IG51bWJlcjtcbiAgZW5kPzogbnVtYmVyO1xuICBjaGFuZ2VzOiBQcm90by5Hcm91cENoYW5nZXM7XG59O1xuXG5leHBvcnQgdHlwZSBQcm9maWxlUmVxdWVzdERhdGFUeXBlID0ge1xuICBhYm91dDogc3RyaW5nIHwgbnVsbDtcbiAgYWJvdXRFbW9qaTogc3RyaW5nIHwgbnVsbDtcbiAgYXZhdGFyOiBib29sZWFuO1xuICBzYW1lQXZhdGFyOiBib29sZWFuO1xuICBjb21taXRtZW50OiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcGF5bWVudEFkZHJlc3M6IHN0cmluZyB8IG51bGw7XG4gIHZlcnNpb246IHN0cmluZztcbn07XG5cbmNvbnN0IHVwbG9hZEF2YXRhckhlYWRlcnNab2QgPSB6XG4gIC5vYmplY3Qoe1xuICAgIGFjbDogei5zdHJpbmcoKSxcbiAgICBhbGdvcml0aG06IHouc3RyaW5nKCksXG4gICAgY3JlZGVudGlhbDogei5zdHJpbmcoKSxcbiAgICBkYXRlOiB6LnN0cmluZygpLFxuICAgIGtleTogei5zdHJpbmcoKSxcbiAgICBwb2xpY3k6IHouc3RyaW5nKCksXG4gICAgc2lnbmF0dXJlOiB6LnN0cmluZygpLFxuICB9KVxuICAucGFzc3Rocm91Z2goKTtcbmV4cG9ydCB0eXBlIFVwbG9hZEF2YXRhckhlYWRlcnNUeXBlID0gei5pbmZlcjx0eXBlb2YgdXBsb2FkQXZhdGFySGVhZGVyc1pvZD47XG5cbmV4cG9ydCB0eXBlIFByb2ZpbGVUeXBlID0gUmVhZG9ubHk8e1xuICBpZGVudGl0eUtleT86IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbiAgYWJvdXQ/OiBzdHJpbmc7XG4gIGFib3V0RW1vamk/OiBzdHJpbmc7XG4gIGF2YXRhcj86IHN0cmluZztcbiAgdW5pZGVudGlmaWVkQWNjZXNzPzogc3RyaW5nO1xuICB1bnJlc3RyaWN0ZWRVbmlkZW50aWZpZWRBY2Nlc3M/OiBzdHJpbmc7XG4gIHV1aWQ/OiBzdHJpbmc7XG4gIGNyZWRlbnRpYWw/OiBzdHJpbmc7XG5cbiAgLy8gT25seSBwcmVzZW50IHdoZW4gYGNyZWRlbnRpYWxUeXBlYCBpcyBgcG5pYFxuICBwbmlDcmVkZW50aWFsPzogc3RyaW5nO1xuICBjYXBhYmlsaXRpZXM/OiBDYXBhYmlsaXRpZXNUeXBlO1xuICBwYXltZW50QWRkcmVzcz86IHN0cmluZztcbiAgYmFkZ2VzPzogdW5rbm93bjtcbn0+O1xuXG5leHBvcnQgdHlwZSBHZXRJY2VTZXJ2ZXJzUmVzdWx0VHlwZSA9IFJlYWRvbmx5PHtcbiAgdXNlcm5hbWU6IHN0cmluZztcbiAgcGFzc3dvcmQ6IHN0cmluZztcbiAgdXJsczogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xufT47XG5cbmV4cG9ydCB0eXBlIEdldERldmljZXNSZXN1bHRUeXBlID0gUmVhZG9ubHlBcnJheTxcbiAgUmVhZG9ubHk8e1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGxhc3RTZWVuOiBudW1iZXI7XG4gICAgY3JlYXRlZDogbnVtYmVyO1xuICB9PlxuPjtcblxuZXhwb3J0IHR5cGUgR2V0U2VuZGVyQ2VydGlmaWNhdGVSZXN1bHRUeXBlID0gUmVhZG9ubHk8eyBjZXJ0aWZpY2F0ZTogc3RyaW5nIH0+O1xuXG5leHBvcnQgdHlwZSBNYWtlUHJveGllZFJlcXVlc3RSZXN1bHRUeXBlID1cbiAgfCBVaW50OEFycmF5XG4gIHwge1xuICAgICAgcmVzdWx0OiBCeXRlc1dpdGhEZXRhaWxzVHlwZTtcbiAgICAgIHRvdGFsU2l6ZTogbnVtYmVyO1xuICAgIH07XG5cbmNvbnN0IHdob2FtaVJlc3VsdFpvZCA9IHpcbiAgLm9iamVjdCh7XG4gICAgdXVpZDogei5zdHJpbmcoKSxcbiAgICBwbmk6IHouc3RyaW5nKCksXG4gICAgbnVtYmVyOiB6LnN0cmluZygpLFxuICAgIHVzZXJuYW1lOiB6LnN0cmluZygpLm9yKHoubnVsbCgpKS5vcHRpb25hbCgpLFxuICB9KVxuICAucGFzc3Rocm91Z2goKTtcbmV4cG9ydCB0eXBlIFdob2FtaVJlc3VsdFR5cGUgPSB6LmluZmVyPHR5cGVvZiB3aG9hbWlSZXN1bHRab2Q+O1xuXG5leHBvcnQgdHlwZSBDb25maXJtQ29kZVJlc3VsdFR5cGUgPSBSZWFkb25seTx7XG4gIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICBwbmk6IFVVSURTdHJpbmdUeXBlO1xuICBkZXZpY2VJZD86IG51bWJlcjtcbn0+O1xuXG5leHBvcnQgdHlwZSBHZXRVdWlkc0ZvckUxNjRzVjJPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgZTE2NHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgYWNpczogUmVhZG9ubHlBcnJheTxVVUlEU3RyaW5nVHlwZT47XG4gIGFjY2Vzc0tleXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbn0+O1xuXG50eXBlIEdldFByb2ZpbGVDb21tb25PcHRpb25zVHlwZSA9IFJlYWRvbmx5PFxuICB7XG4gICAgdXNlckxhbmd1YWdlczogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xuICAgIGNyZWRlbnRpYWxUeXBlPzogJ3BuaScgfCAnZXhwaXJpbmdQcm9maWxlS2V5JztcbiAgfSAmIChcbiAgICB8IHtcbiAgICAgICAgcHJvZmlsZUtleVZlcnNpb24/OiB1bmRlZmluZWQ7XG4gICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdD86IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB8IHtcbiAgICAgICAgcHJvZmlsZUtleVZlcnNpb246IHN0cmluZztcbiAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0Pzogc3RyaW5nO1xuICAgICAgfVxuICApXG4+O1xuXG5leHBvcnQgdHlwZSBHZXRQcm9maWxlT3B0aW9uc1R5cGUgPSBHZXRQcm9maWxlQ29tbW9uT3B0aW9uc1R5cGUgJlxuICBSZWFkb25seTx7XG4gICAgYWNjZXNzS2V5PzogdW5kZWZpbmVkO1xuICB9PjtcblxuZXhwb3J0IHR5cGUgR2V0UHJvZmlsZVVuYXV0aE9wdGlvbnNUeXBlID0gR2V0UHJvZmlsZUNvbW1vbk9wdGlvbnNUeXBlICZcbiAgUmVhZG9ubHk8e1xuICAgIGFjY2Vzc0tleTogc3RyaW5nO1xuICB9PjtcblxuZXhwb3J0IHR5cGUgR2V0R3JvdXBDcmVkZW50aWFsc09wdGlvbnNUeXBlID0gUmVhZG9ubHk8e1xuICBzdGFydERheUluTXM6IG51bWJlcjtcbiAgZW5kRGF5SW5NczogbnVtYmVyO1xufT47XG5cbmV4cG9ydCB0eXBlIEdldEdyb3VwQ3JlZGVudGlhbHNSZXN1bHRUeXBlID0gUmVhZG9ubHk8e1xuICBwbmk/OiBzdHJpbmcgfCBudWxsO1xuICBjcmVkZW50aWFsczogUmVhZG9ubHlBcnJheTxHcm91cENyZWRlbnRpYWxUeXBlPjtcbn0+O1xuXG5leHBvcnQgdHlwZSBXZWJBUElUeXBlID0ge1xuICBzdGFydFJlZ2lzdHJhdGlvbigpOiB1bmtub3duO1xuICBmaW5pc2hSZWdpc3RyYXRpb24oYmF0b246IHVua25vd24pOiB2b2lkO1xuICBjb25maXJtQ29kZTogKFxuICAgIG51bWJlcjogc3RyaW5nLFxuICAgIGNvZGU6IHN0cmluZyxcbiAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgIHJlZ2lzdHJhdGlvbklkOiBudW1iZXIsXG4gICAgZGV2aWNlTmFtZT86IHN0cmluZyB8IG51bGwsXG4gICAgb3B0aW9ucz86IHsgYWNjZXNzS2V5PzogVWludDhBcnJheSB9XG4gICkgPT4gUHJvbWlzZTxDb25maXJtQ29kZVJlc3VsdFR5cGU+O1xuICBjcmVhdGVHcm91cDogKFxuICAgIGdyb3VwOiBQcm90by5JR3JvdXAsXG4gICAgb3B0aW9uczogR3JvdXBDcmVkZW50aWFsc1R5cGVcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVVc2VybmFtZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZ2V0QXR0YWNobWVudDogKGNkbktleTogc3RyaW5nLCBjZG5OdW1iZXI/OiBudW1iZXIpID0+IFByb21pc2U8VWludDhBcnJheT47XG4gIGdldEF2YXRhcjogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxVaW50OEFycmF5PjtcbiAgZ2V0RGV2aWNlczogKCkgPT4gUHJvbWlzZTxHZXREZXZpY2VzUmVzdWx0VHlwZT47XG4gIGdldEhhc1N1YnNjcmlwdGlvbjogKHN1YnNjcmliZXJJZDogVWludDhBcnJheSkgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgZ2V0R3JvdXA6IChvcHRpb25zOiBHcm91cENyZWRlbnRpYWxzVHlwZSkgPT4gUHJvbWlzZTxQcm90by5Hcm91cD47XG4gIGdldEdyb3VwRnJvbUxpbms6IChcbiAgICBpbnZpdGVMaW5rUGFzc3dvcmQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBhdXRoOiBHcm91cENyZWRlbnRpYWxzVHlwZVxuICApID0+IFByb21pc2U8UHJvdG8uR3JvdXBKb2luSW5mbz47XG4gIGdldEdyb3VwQXZhdGFyOiAoa2V5OiBzdHJpbmcpID0+IFByb21pc2U8VWludDhBcnJheT47XG4gIGdldEdyb3VwQ3JlZGVudGlhbHM6IChcbiAgICBvcHRpb25zOiBHZXRHcm91cENyZWRlbnRpYWxzT3B0aW9uc1R5cGVcbiAgKSA9PiBQcm9taXNlPEdldEdyb3VwQ3JlZGVudGlhbHNSZXN1bHRUeXBlPjtcbiAgZ2V0R3JvdXBFeHRlcm5hbENyZWRlbnRpYWw6IChcbiAgICBvcHRpb25zOiBHcm91cENyZWRlbnRpYWxzVHlwZVxuICApID0+IFByb21pc2U8UHJvdG8uR3JvdXBFeHRlcm5hbENyZWRlbnRpYWw+O1xuICBnZXRHcm91cExvZzogKFxuICAgIG9wdGlvbnM6IEdldEdyb3VwTG9nT3B0aW9uc1R5cGUsXG4gICAgY3JlZGVudGlhbHM6IEdyb3VwQ3JlZGVudGlhbHNUeXBlXG4gICkgPT4gUHJvbWlzZTxHcm91cExvZ1Jlc3BvbnNlVHlwZT47XG4gIGdldEljZVNlcnZlcnM6ICgpID0+IFByb21pc2U8R2V0SWNlU2VydmVyc1Jlc3VsdFR5cGU+O1xuICBnZXRLZXlzRm9ySWRlbnRpZmllcjogKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBkZXZpY2VJZD86IG51bWJlclxuICApID0+IFByb21pc2U8U2VydmVyS2V5c1R5cGU+O1xuICBnZXRLZXlzRm9ySWRlbnRpZmllclVuYXV0aDogKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBkZXZpY2VJZD86IG51bWJlcixcbiAgICBvcHRpb25zPzogeyBhY2Nlc3NLZXk/OiBzdHJpbmcgfVxuICApID0+IFByb21pc2U8U2VydmVyS2V5c1R5cGU+O1xuICBnZXRNeUtleXM6ICh1dWlkS2luZDogVVVJREtpbmQpID0+IFByb21pc2U8bnVtYmVyPjtcbiAgZ2V0UHJvZmlsZTogKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBvcHRpb25zOiBHZXRQcm9maWxlT3B0aW9uc1R5cGVcbiAgKSA9PiBQcm9taXNlPFByb2ZpbGVUeXBlPjtcbiAgZ2V0UHJvZmlsZUZvclVzZXJuYW1lOiAodXNlcm5hbWU6IHN0cmluZykgPT4gUHJvbWlzZTxQcm9maWxlVHlwZT47XG4gIGdldFByb2ZpbGVVbmF1dGg6IChcbiAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgb3B0aW9uczogR2V0UHJvZmlsZVVuYXV0aE9wdGlvbnNUeXBlXG4gICkgPT4gUHJvbWlzZTxQcm9maWxlVHlwZT47XG4gIGdldEJhZGdlSW1hZ2VGaWxlOiAoaW1hZ2VVcmw6IHN0cmluZykgPT4gUHJvbWlzZTxVaW50OEFycmF5PjtcbiAgZ2V0Qm9vc3RCYWRnZXNGcm9tU2VydmVyOiAoXG4gICAgdXNlckxhbmd1YWdlczogUmVhZG9ubHlBcnJheTxzdHJpbmc+XG4gICkgPT4gUHJvbWlzZTx1bmtub3duPjtcbiAgZ2V0UHJvdmlzaW9uaW5nUmVzb3VyY2U6IChcbiAgICBoYW5kbGVyOiBJUmVxdWVzdEhhbmRsZXJcbiAgKSA9PiBQcm9taXNlPFdlYlNvY2tldFJlc291cmNlPjtcbiAgZ2V0U2VuZGVyQ2VydGlmaWNhdGU6IChcbiAgICB3aXRoVXVpZD86IGJvb2xlYW5cbiAgKSA9PiBQcm9taXNlPEdldFNlbmRlckNlcnRpZmljYXRlUmVzdWx0VHlwZT47XG4gIGdldFN0aWNrZXI6IChwYWNrSWQ6IHN0cmluZywgc3RpY2tlcklkOiBudW1iZXIpID0+IFByb21pc2U8VWludDhBcnJheT47XG4gIGdldFN0aWNrZXJQYWNrTWFuaWZlc3Q6IChwYWNrSWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdGlja2VyUGFja01hbmlmZXN0VHlwZT47XG4gIGdldFN0b3JhZ2VDcmVkZW50aWFsczogTWVzc2FnZVNlbmRlclsnZ2V0U3RvcmFnZUNyZWRlbnRpYWxzJ107XG4gIGdldFN0b3JhZ2VNYW5pZmVzdDogTWVzc2FnZVNlbmRlclsnZ2V0U3RvcmFnZU1hbmlmZXN0J107XG4gIGdldFN0b3JhZ2VSZWNvcmRzOiBNZXNzYWdlU2VuZGVyWydnZXRTdG9yYWdlUmVjb3JkcyddO1xuICBnZXRVdWlkc0ZvckUxNjRzOiAoXG4gICAgZTE2NHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICApID0+IFByb21pc2U8RGljdGlvbmFyeTxVVUlEU3RyaW5nVHlwZSB8IG51bGw+PjtcbiAgZ2V0VXVpZHNGb3JFMTY0c1YyOiAoXG4gICAgb3B0aW9uczogR2V0VXVpZHNGb3JFMTY0c1YyT3B0aW9uc1R5cGVcbiAgKSA9PiBQcm9taXNlPENEU1Jlc3BvbnNlVHlwZT47XG4gIGZldGNoTGlua1ByZXZpZXdNZXRhZGF0YTogKFxuICAgIGhyZWY6IHN0cmluZyxcbiAgICBhYm9ydFNpZ25hbDogQWJvcnRTaWduYWxcbiAgKSA9PiBQcm9taXNlPG51bGwgfCBsaW5rUHJldmlld0ZldGNoLkxpbmtQcmV2aWV3TWV0YWRhdGE+O1xuICBmZXRjaExpbmtQcmV2aWV3SW1hZ2U6IChcbiAgICBocmVmOiBzdHJpbmcsXG4gICAgYWJvcnRTaWduYWw6IEFib3J0U2lnbmFsXG4gICkgPT4gUHJvbWlzZTxudWxsIHwgbGlua1ByZXZpZXdGZXRjaC5MaW5rUHJldmlld0ltYWdlPjtcbiAgbWFrZVByb3hpZWRSZXF1ZXN0OiAoXG4gICAgdGFyZ2V0VXJsOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IFByb3hpZWRSZXF1ZXN0T3B0aW9uc1R5cGVcbiAgKSA9PiBQcm9taXNlPE1ha2VQcm94aWVkUmVxdWVzdFJlc3VsdFR5cGU+O1xuICBtYWtlU2Z1UmVxdWVzdDogKFxuICAgIHRhcmdldFVybDogc3RyaW5nLFxuICAgIHR5cGU6IEhUVFBDb2RlVHlwZSxcbiAgICBoZWFkZXJzOiBIZWFkZXJMaXN0VHlwZSxcbiAgICBib2R5OiBVaW50OEFycmF5IHwgdW5kZWZpbmVkXG4gICkgPT4gUHJvbWlzZTxCeXRlc1dpdGhEZXRhaWxzVHlwZT47XG4gIG1vZGlmeUdyb3VwOiAoXG4gICAgY2hhbmdlczogUHJvdG8uR3JvdXBDaGFuZ2UuSUFjdGlvbnMsXG4gICAgb3B0aW9uczogR3JvdXBDcmVkZW50aWFsc1R5cGUsXG4gICAgaW52aXRlTGlua0Jhc2U2ND86IHN0cmluZ1xuICApID0+IFByb21pc2U8UHJvdG8uSUdyb3VwQ2hhbmdlPjtcbiAgbW9kaWZ5U3RvcmFnZVJlY29yZHM6IE1lc3NhZ2VTZW5kZXJbJ21vZGlmeVN0b3JhZ2VSZWNvcmRzJ107XG4gIHB1dEF0dGFjaG1lbnQ6IChlbmNyeXB0ZWRCaW46IFVpbnQ4QXJyYXkpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgcHV0UHJvZmlsZTogKFxuICAgIGpzb25EYXRhOiBQcm9maWxlUmVxdWVzdERhdGFUeXBlXG4gICkgPT4gUHJvbWlzZTxVcGxvYWRBdmF0YXJIZWFkZXJzVHlwZSB8IHVuZGVmaW5lZD47XG4gIHB1dFN0aWNrZXJzOiAoXG4gICAgZW5jcnlwdGVkTWFuaWZlc3Q6IFVpbnQ4QXJyYXksXG4gICAgZW5jcnlwdGVkU3RpY2tlcnM6IEFycmF5PFVpbnQ4QXJyYXk+LFxuICAgIG9uUHJvZ3Jlc3M/OiAoKSA9PiB2b2lkXG4gICkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBwdXRVc2VybmFtZTogKG5ld1VzZXJuYW1lOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIHJlZ2lzdGVyQ2FwYWJpbGl0aWVzOiAoY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXRpZXNVcGxvYWRUeXBlKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZWdpc3RlcktleXM6IChnZW5LZXlzOiBLZXlzVHlwZSwgdXVpZEtpbmQ6IFVVSURLaW5kKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZWdpc3RlclN1cHBvcnRGb3JVbmF1dGhlbnRpY2F0ZWREZWxpdmVyeTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgcmVwb3J0TWVzc2FnZTogKHNlbmRlclV1aWQ6IHN0cmluZywgc2VydmVyR3VpZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICByZXF1ZXN0VmVyaWZpY2F0aW9uU01TOiAobnVtYmVyOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIHJlcXVlc3RWZXJpZmljYXRpb25Wb2ljZTogKG51bWJlcjogc3RyaW5nLCB0b2tlbjogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBjaGVja0FjY291bnRFeGlzdGVuY2U6ICh1dWlkOiBVVUlEKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBzZW5kTWVzc2FnZXM6IChcbiAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgIG1lc3NhZ2VBcnJheTogUmVhZG9ubHlBcnJheTxNZXNzYWdlVHlwZT4sXG4gICAgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBvbmxpbmU/OiBib29sZWFuOyB1cmdlbnQ/OiBib29sZWFuIH1cbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBzZW5kTWVzc2FnZXNVbmF1dGg6IChcbiAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgIG1lc3NhZ2VBcnJheTogUmVhZG9ubHlBcnJheTxNZXNzYWdlVHlwZT4sXG4gICAgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgb3B0aW9uczogeyBhY2Nlc3NLZXk/OiBzdHJpbmc7IG9ubGluZT86IGJvb2xlYW47IHVyZ2VudD86IGJvb2xlYW4gfVxuICApID0+IFByb21pc2U8dm9pZD47XG4gIHNlbmRXaXRoU2VuZGVyS2V5OiAoXG4gICAgcGF5bG9hZDogVWludDhBcnJheSxcbiAgICBhY2Nlc3NLZXlzOiBVaW50OEFycmF5LFxuICAgIHRpbWVzdGFtcDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIG9ubGluZT86IGJvb2xlYW47XG4gICAgICB1cmdlbnQ/OiBib29sZWFuO1xuICAgIH1cbiAgKSA9PiBQcm9taXNlPE11bHRpUmVjaXBpZW50MjAwUmVzcG9uc2VUeXBlPjtcbiAgc2V0U2lnbmVkUHJlS2V5OiAoXG4gICAgc2lnbmVkUHJlS2V5OiBTaWduZWRQcmVLZXlUeXBlLFxuICAgIHV1aWRLaW5kOiBVVUlES2luZFxuICApID0+IFByb21pc2U8dm9pZD47XG4gIHVwZGF0ZURldmljZU5hbWU6IChkZXZpY2VOYW1lOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIHVwbG9hZEF2YXRhcjogKFxuICAgIHVwbG9hZEF2YXRhclJlcXVlc3RIZWFkZXJzOiBVcGxvYWRBdmF0YXJIZWFkZXJzVHlwZSxcbiAgICBhdmF0YXJEYXRhOiBVaW50OEFycmF5XG4gICkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICB1cGxvYWRHcm91cEF2YXRhcjogKFxuICAgIGF2YXRhckRhdGE6IFVpbnQ4QXJyYXksXG4gICAgb3B0aW9uczogR3JvdXBDcmVkZW50aWFsc1R5cGVcbiAgKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIHdob2FtaTogKCkgPT4gUHJvbWlzZTxXaG9hbWlSZXN1bHRUeXBlPjtcbiAgc2VuZENoYWxsZW5nZVJlc3BvbnNlOiAoY2hhbGxlbmdlUmVzcG9uc2U6IENoYWxsZW5nZVR5cGUpID0+IFByb21pc2U8dm9pZD47XG4gIGdldENvbmZpZzogKCkgPT4gUHJvbWlzZTxcbiAgICBBcnJheTx7IG5hbWU6IHN0cmluZzsgZW5hYmxlZDogYm9vbGVhbjsgdmFsdWU6IHN0cmluZyB8IG51bGwgfT5cbiAgPjtcbiAgYXV0aGVudGljYXRlOiAoY3JlZGVudGlhbHM6IFdlYkFQSUNyZWRlbnRpYWxzKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsb2dvdXQ6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGdldFNvY2tldFN0YXR1czogKCkgPT4gU29ja2V0U3RhdHVzO1xuICByZWdpc3RlclJlcXVlc3RIYW5kbGVyOiAoaGFuZGxlcjogSVJlcXVlc3RIYW5kbGVyKSA9PiB2b2lkO1xuICB1bnJlZ2lzdGVyUmVxdWVzdEhhbmRsZXI6IChoYW5kbGVyOiBJUmVxdWVzdEhhbmRsZXIpID0+IHZvaWQ7XG4gIGNoZWNrU29ja2V0czogKCkgPT4gdm9pZDtcbiAgb25PbmxpbmU6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIG9uT2ZmbGluZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbn07XG5cbmV4cG9ydCB0eXBlIFNpZ25lZFByZUtleVR5cGUgPSB7XG4gIGtleUlkOiBudW1iZXI7XG4gIHB1YmxpY0tleTogVWludDhBcnJheTtcbiAgc2lnbmF0dXJlOiBVaW50OEFycmF5O1xufTtcblxuZXhwb3J0IHR5cGUgS2V5c1R5cGUgPSB7XG4gIGlkZW50aXR5S2V5OiBVaW50OEFycmF5O1xuICBzaWduZWRQcmVLZXk6IFNpZ25lZFByZUtleVR5cGU7XG4gIHByZUtleXM6IEFycmF5PHtcbiAgICBrZXlJZDogbnVtYmVyO1xuICAgIHB1YmxpY0tleTogVWludDhBcnJheTtcbiAgfT47XG59O1xuXG5leHBvcnQgdHlwZSBTZXJ2ZXJLZXlzVHlwZSA9IHtcbiAgZGV2aWNlczogQXJyYXk8e1xuICAgIGRldmljZUlkOiBudW1iZXI7XG4gICAgcmVnaXN0cmF0aW9uSWQ6IG51bWJlcjtcbiAgICBzaWduZWRQcmVLZXk6IHtcbiAgICAgIGtleUlkOiBudW1iZXI7XG4gICAgICBwdWJsaWNLZXk6IFVpbnQ4QXJyYXk7XG4gICAgICBzaWduYXR1cmU6IFVpbnQ4QXJyYXk7XG4gICAgfTtcbiAgICBwcmVLZXk/OiB7XG4gICAgICBrZXlJZDogbnVtYmVyO1xuICAgICAgcHVibGljS2V5OiBVaW50OEFycmF5O1xuICAgIH07XG4gIH0+O1xuICBpZGVudGl0eUtleTogVWludDhBcnJheTtcbn07XG5cbmV4cG9ydCB0eXBlIENoYWxsZW5nZVR5cGUgPSB7XG4gIHJlYWRvbmx5IHR5cGU6ICdyZWNhcHRjaGEnO1xuICByZWFkb25seSB0b2tlbjogc3RyaW5nO1xuICByZWFkb25seSBjYXB0Y2hhOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQcm94aWVkUmVxdWVzdE9wdGlvbnNUeXBlID0ge1xuICByZXR1cm5VaW50OEFycmF5PzogYm9vbGVhbjtcbiAgc3RhcnQ/OiBudW1iZXI7XG4gIGVuZD86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFRvcExldmVsVHlwZSA9IHtcbiAgbXVsdGlSZWNpcGllbnQyMDBSZXNwb25zZVNjaGVtYTogdHlwZW9mIG11bHRpUmVjaXBpZW50MjAwUmVzcG9uc2VTY2hlbWE7XG4gIG11bHRpUmVjaXBpZW50NDA5UmVzcG9uc2VTY2hlbWE6IHR5cGVvZiBtdWx0aVJlY2lwaWVudDQwOVJlc3BvbnNlU2NoZW1hO1xuICBtdWx0aVJlY2lwaWVudDQxMFJlc3BvbnNlU2NoZW1hOiB0eXBlb2YgbXVsdGlSZWNpcGllbnQ0MTBSZXNwb25zZVNjaGVtYTtcbiAgaW5pdGlhbGl6ZTogKG9wdGlvbnM6IEluaXRpYWxpemVPcHRpb25zVHlwZSkgPT4gV2ViQVBJQ29ubmVjdFR5cGU7XG59O1xuXG4vLyBXZSBmaXJzdCBzZXQgdXAgdGhlIGRhdGEgdGhhdCB3b24ndCBjaGFuZ2UgZHVyaW5nIHRoaXMgc2Vzc2lvbiBvZiB0aGUgYXBwXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSh7XG4gIHVybCxcbiAgc3RvcmFnZVVybCxcbiAgdXBkYXRlc1VybCxcbiAgZGlyZWN0b3J5Q29uZmlnLFxuICBjZG5VcmxPYmplY3QsXG4gIGNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICBjb250ZW50UHJveHlVcmwsXG4gIHByb3h5VXJsLFxuICB2ZXJzaW9uLFxufTogSW5pdGlhbGl6ZU9wdGlvbnNUeXBlKTogV2ViQVBJQ29ubmVjdFR5cGUge1xuICBpZiAoIWlzLnN0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdXZWJBUEkuaW5pdGlhbGl6ZTogSW52YWxpZCBzZXJ2ZXIgdXJsJyk7XG4gIH1cbiAgaWYgKCFpcy5zdHJpbmcoc3RvcmFnZVVybCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFQSS5pbml0aWFsaXplOiBJbnZhbGlkIHN0b3JhZ2VVcmwnKTtcbiAgfVxuICBpZiAoIWlzLnN0cmluZyh1cGRhdGVzVXJsKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV2ViQVBJLmluaXRpYWxpemU6IEludmFsaWQgdXBkYXRlc1VybCcpO1xuICB9XG4gIGlmICghaXMub2JqZWN0KGNkblVybE9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFQSS5pbml0aWFsaXplOiBJbnZhbGlkIGNkblVybE9iamVjdCcpO1xuICB9XG4gIGlmICghaXMuc3RyaW5nKGNkblVybE9iamVjdFsnMCddKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV2ViQVBJLmluaXRpYWxpemU6IE1pc3NpbmcgQ0ROIDAgY29uZmlndXJhdGlvbicpO1xuICB9XG4gIGlmICghaXMuc3RyaW5nKGNkblVybE9iamVjdFsnMiddKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV2ViQVBJLmluaXRpYWxpemU6IE1pc3NpbmcgQ0ROIDIgY29uZmlndXJhdGlvbicpO1xuICB9XG4gIGlmICghaXMuc3RyaW5nKGNlcnRpZmljYXRlQXV0aG9yaXR5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV2ViQVBJLmluaXRpYWxpemU6IEludmFsaWQgY2VydGlmaWNhdGVBdXRob3JpdHknKTtcbiAgfVxuICBpZiAoIWlzLnN0cmluZyhjb250ZW50UHJveHlVcmwpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdXZWJBUEkuaW5pdGlhbGl6ZTogSW52YWxpZCBjb250ZW50UHJveHlVcmwnKTtcbiAgfVxuICBpZiAocHJveHlVcmwgJiYgIWlzLnN0cmluZyhwcm94eVVybCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFQSS5pbml0aWFsaXplOiBJbnZhbGlkIHByb3h5VXJsJyk7XG4gIH1cbiAgaWYgKCFpcy5zdHJpbmcodmVyc2lvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFQSS5pbml0aWFsaXplOiBJbnZhbGlkIHZlcnNpb24nKTtcbiAgfVxuXG4gIC8vIFRoYW5rcyB0byBmdW5jdGlvbi1ob2lzdGluZywgd2UgY2FuIHB1dCB0aGlzIHJldHVybiBzdGF0ZW1lbnQgYmVmb3JlIGFsbCBvZiB0aGVcbiAgLy8gICBiZWxvdyBmdW5jdGlvbiBkZWZpbml0aW9ucy5cbiAgcmV0dXJuIHtcbiAgICBjb25uZWN0LFxuICB9O1xuXG4gIC8vIFRoZW4gd2UgY29ubmVjdCB0byB0aGUgc2VydmVyIHdpdGggdXNlci1zcGVjaWZpYyBpbmZvcm1hdGlvbi4gVGhpcyBpcyB0aGUgb25seSBBUElcbiAgLy8gICBleHBvc2VkIHRvIHRoZSBicm93c2VyIGNvbnRleHQsIGVuc3VyaW5nIHRoYXQgaXQgY2FuJ3QgY29ubmVjdCB0byBhcmJpdHJhcnlcbiAgLy8gICBsb2NhdGlvbnMuXG4gIGZ1bmN0aW9uIGNvbm5lY3Qoe1xuICAgIHVzZXJuYW1lOiBpbml0aWFsVXNlcm5hbWUsXG4gICAgcGFzc3dvcmQ6IGluaXRpYWxQYXNzd29yZCxcbiAgICB1c2VXZWJTb2NrZXQgPSB0cnVlLFxuICB9OiBXZWJBUElDb25uZWN0T3B0aW9uc1R5cGUpIHtcbiAgICBsZXQgdXNlcm5hbWUgPSBpbml0aWFsVXNlcm5hbWU7XG4gICAgbGV0IHBhc3N3b3JkID0gaW5pdGlhbFBhc3N3b3JkO1xuICAgIGNvbnN0IFBBUlNFX1JBTkdFX0hFQURFUiA9IC9cXC8oXFxkKykkLztcbiAgICBjb25zdCBQQVJTRV9HUk9VUF9MT0dfUkFOR0VfSEVBREVSID1cbiAgICAgIC9edmVyc2lvbnNcXHMrKFxcZHsxLDEwfSktKFxcZHsxLDEwfSlcXC8oXFxkezEsMTB9KS87XG5cbiAgICBsZXQgYWN0aXZlUmVnaXN0cmF0aW9uOiBFeHBsb2RlUHJvbWlzZVJlc3VsdFR5cGU8dm9pZD4gfCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBzb2NrZXRNYW5hZ2VyID0gbmV3IFNvY2tldE1hbmFnZXIoe1xuICAgICAgdXJsLFxuICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICB2ZXJzaW9uLFxuICAgICAgcHJveHlVcmwsXG4gICAgfSk7XG5cbiAgICBzb2NrZXRNYW5hZ2VyLm9uKCdzdGF0dXNDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcignc29ja2V0U3RhdHVzQ2hhbmdlJyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXRNYW5hZ2VyLm9uKCdhdXRoRXJyb3InLCAoKSA9PiB7XG4gICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcigndW5saW5rQW5kRGlzY29ubmVjdCcpO1xuICAgIH0pO1xuXG4gICAgaWYgKHVzZVdlYlNvY2tldCkge1xuICAgICAgc29ja2V0TWFuYWdlci5hdXRoZW50aWNhdGUoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSk7XG4gICAgfVxuXG4gICAgbGV0IGNkczogQ0RTQmFzZTtcbiAgICBpZiAoZGlyZWN0b3J5Q29uZmlnLmRpcmVjdG9yeVZlcnNpb24gPT09IDEpIHtcbiAgICAgIGNvbnN0IHsgZGlyZWN0b3J5VXJsLCBkaXJlY3RvcnlFbmNsYXZlSWQsIGRpcmVjdG9yeVRydXN0QW5jaG9yIH0gPVxuICAgICAgICBkaXJlY3RvcnlDb25maWc7XG5cbiAgICAgIGNkcyA9IG5ldyBMZWdhY3lDRFMoe1xuICAgICAgICBsb2dnZXI6IGxvZyxcbiAgICAgICAgZGlyZWN0b3J5RW5jbGF2ZUlkLFxuICAgICAgICBkaXJlY3RvcnlUcnVzdEFuY2hvcixcbiAgICAgICAgcHJveHlVcmwsXG5cbiAgICAgICAgYXN5bmMgcHV0QXR0ZXN0YXRpb24oYXV0aCwgcHVibGljS2V5KSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGNsaWVudFB1YmxpYzogQnl0ZXMudG9CYXNlNjQocHVibGljS2V5KSxcbiAgICAgICAgICAgIGlhc1ZlcnNpb246IDQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gKGF3YWl0IF9vdXRlckFqYXgobnVsbCwge1xuICAgICAgICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICAgICAgICB0eXBlOiAnUFVUJyxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgICBob3N0OiBkaXJlY3RvcnlVcmwsXG4gICAgICAgICAgICBwYXRoOiBgJHtVUkxfQ0FMTFMuYXR0ZXN0YXRpb259LyR7ZGlyZWN0b3J5RW5jbGF2ZUlkfWAsXG4gICAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dGgucGFzc3dvcmQsXG4gICAgICAgICAgICByZXNwb25zZVR5cGU6ICdqc29ud2l0aGRldGFpbHMnLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMwMDAwLFxuICAgICAgICAgICAgdmVyc2lvbixcbiAgICAgICAgICB9KSkgYXMgSlNPTldpdGhEZXRhaWxzVHlwZTxMZWdhY3lDRFNQdXRBdHRlc3RhdGlvblJlc3BvbnNlVHlwZT47XG5cbiAgICAgICAgICBjb25zdCB7IHJlc3BvbnNlLCBkYXRhOiByZXNwb25zZUJvZHkgfSA9IHJlc3VsdDtcblxuICAgICAgICAgIGNvbnN0IGNvb2tpZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdzZXQtY29va2llJykgPz8gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgcmV0dXJuIHsgY29va2llLCByZXNwb25zZUJvZHkgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBhc3luYyBmZXRjaERpc2NvdmVyeURhdGEoYXV0aCwgZGF0YSwgY29va2llKSB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSAoYXdhaXQgX291dGVyQWpheChudWxsLCB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgICAgIHR5cGU6ICdQVVQnLFxuICAgICAgICAgICAgaGVhZGVyczogY29va2llXG4gICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgY29va2llLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgaG9zdDogZGlyZWN0b3J5VXJsLFxuICAgICAgICAgICAgcGF0aDogYCR7VVJMX0NBTExTLmRpc2NvdmVyeX0vJHtkaXJlY3RvcnlFbmNsYXZlSWR9YCxcbiAgICAgICAgICAgIHVzZXI6IGF1dGgudXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogYXV0aC5wYXNzd29yZCxcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgdGltZW91dDogMzAwMDAsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgICAgfSkpIGFzIHtcbiAgICAgICAgICAgIHJlcXVlc3RJZDogc3RyaW5nO1xuICAgICAgICAgICAgaXY6IHN0cmluZztcbiAgICAgICAgICAgIGRhdGE6IHN0cmluZztcbiAgICAgICAgICAgIG1hYzogc3RyaW5nO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWVzdElkOiBCeXRlcy5mcm9tQmFzZTY0KHJlc3BvbnNlLnJlcXVlc3RJZCksXG4gICAgICAgICAgICBpdjogQnl0ZXMuZnJvbUJhc2U2NChyZXNwb25zZS5pdiksXG4gICAgICAgICAgICBkYXRhOiBCeXRlcy5mcm9tQmFzZTY0KHJlc3BvbnNlLmRhdGEpLFxuICAgICAgICAgICAgbWFjOiBCeXRlcy5mcm9tQmFzZTY0KHJlc3BvbnNlLm1hYyksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBhc3luYyBnZXRBdXRoKCkge1xuICAgICAgICAgIHJldHVybiAoYXdhaXQgX2FqYXgoe1xuICAgICAgICAgICAgY2FsbDogJ2RpcmVjdG9yeUF1dGgnLFxuICAgICAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgICAgfSkpIGFzIENEU0F1dGhUeXBlO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3RvcnlDb25maWcuZGlyZWN0b3J5VmVyc2lvbiA9PT0gMikge1xuICAgICAgY29uc3QgeyBkaXJlY3RvcnlWMlVybCwgZGlyZWN0b3J5VjJQdWJsaWNLZXksIGRpcmVjdG9yeVYyQ29kZUhhc2hlcyB9ID1cbiAgICAgICAgZGlyZWN0b3J5Q29uZmlnO1xuXG4gICAgICBjZHMgPSBuZXcgQ0RTSCh7XG4gICAgICAgIGxvZ2dlcjogbG9nLFxuICAgICAgICBwcm94eVVybCxcblxuICAgICAgICB1cmw6IGRpcmVjdG9yeVYyVXJsLFxuICAgICAgICBwdWJsaWNLZXk6IGRpcmVjdG9yeVYyUHVibGljS2V5LFxuICAgICAgICBjb2RlSGFzaGVzOiBkaXJlY3RvcnlWMkNvZGVIYXNoZXMsXG4gICAgICAgIGNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICAgICAgICB2ZXJzaW9uLFxuXG4gICAgICAgIGFzeW5jIGdldEF1dGgoKSB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgICAgICBjYWxsOiAnZGlyZWN0b3J5QXV0aFYyJyxcbiAgICAgICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICAgIH0pKSBhcyBDRFNBdXRoVHlwZTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0b3J5Q29uZmlnLmRpcmVjdG9yeVZlcnNpb24gPT09IDMpIHtcbiAgICAgIGNvbnN0IHsgZGlyZWN0b3J5VjNVcmwsIGRpcmVjdG9yeVYzTVJFTkNMQVZFIH0gPSBkaXJlY3RvcnlDb25maWc7XG5cbiAgICAgIGNkcyA9IG5ldyBDRFNJKHtcbiAgICAgICAgbG9nZ2VyOiBsb2csXG4gICAgICAgIHByb3h5VXJsLFxuXG4gICAgICAgIHVybDogZGlyZWN0b3J5VjNVcmwsXG4gICAgICAgIG1yZW5jbGF2ZTogZGlyZWN0b3J5VjNNUkVOQ0xBVkUsXG4gICAgICAgIGNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICAgICAgICB2ZXJzaW9uLFxuXG4gICAgICAgIGFzeW5jIGdldEF1dGgoKSB7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgICAgICBjYWxsOiAnZGlyZWN0b3J5QXV0aFYyJyxcbiAgICAgICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICAgIH0pKSBhcyBDRFNBdXRoVHlwZTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBmZXRjaEZvckxpbmtQcmV2aWV3czogbGlua1ByZXZpZXdGZXRjaC5GZXRjaEZuO1xuICAgIGlmIChwcm94eVVybCkge1xuICAgICAgY29uc3QgYWdlbnQgPSBuZXcgUHJveHlBZ2VudChwcm94eVVybCk7XG4gICAgICBmZXRjaEZvckxpbmtQcmV2aWV3cyA9IChocmVmLCBpbml0KSA9PiBmZXRjaChocmVmLCB7IC4uLmluaXQsIGFnZW50IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmZXRjaEZvckxpbmtQcmV2aWV3cyA9IGZldGNoO1xuICAgIH1cblxuICAgIC8vIFRoYW5rcywgZnVuY3Rpb24gaG9pc3RpbmchXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNvY2tldFN0YXR1cyxcbiAgICAgIGNoZWNrU29ja2V0cyxcbiAgICAgIG9uT25saW5lLFxuICAgICAgb25PZmZsaW5lLFxuICAgICAgcmVnaXN0ZXJSZXF1ZXN0SGFuZGxlcixcbiAgICAgIHVucmVnaXN0ZXJSZXF1ZXN0SGFuZGxlcixcbiAgICAgIGF1dGhlbnRpY2F0ZSxcbiAgICAgIGxvZ291dCxcbiAgICAgIGNoZWNrQWNjb3VudEV4aXN0ZW5jZSxcbiAgICAgIGNvbmZpcm1Db2RlLFxuICAgICAgY3JlYXRlR3JvdXAsXG4gICAgICBkZWxldGVVc2VybmFtZSxcbiAgICAgIGZpbmlzaFJlZ2lzdHJhdGlvbixcbiAgICAgIGZldGNoTGlua1ByZXZpZXdJbWFnZSxcbiAgICAgIGZldGNoTGlua1ByZXZpZXdNZXRhZGF0YSxcbiAgICAgIGdldEF0dGFjaG1lbnQsXG4gICAgICBnZXRBdmF0YXIsXG4gICAgICBnZXRDb25maWcsXG4gICAgICBnZXREZXZpY2VzLFxuICAgICAgZ2V0R3JvdXAsXG4gICAgICBnZXRHcm91cEF2YXRhcixcbiAgICAgIGdldEdyb3VwQ3JlZGVudGlhbHMsXG4gICAgICBnZXRHcm91cEV4dGVybmFsQ3JlZGVudGlhbCxcbiAgICAgIGdldEdyb3VwRnJvbUxpbmssXG4gICAgICBnZXRHcm91cExvZyxcbiAgICAgIGdldEhhc1N1YnNjcmlwdGlvbixcbiAgICAgIGdldEljZVNlcnZlcnMsXG4gICAgICBnZXRLZXlzRm9ySWRlbnRpZmllcixcbiAgICAgIGdldEtleXNGb3JJZGVudGlmaWVyVW5hdXRoLFxuICAgICAgZ2V0TXlLZXlzLFxuICAgICAgZ2V0UHJvZmlsZSxcbiAgICAgIGdldFByb2ZpbGVGb3JVc2VybmFtZSxcbiAgICAgIGdldFByb2ZpbGVVbmF1dGgsXG4gICAgICBnZXRCYWRnZUltYWdlRmlsZSxcbiAgICAgIGdldEJvb3N0QmFkZ2VzRnJvbVNlcnZlcixcbiAgICAgIGdldFByb3Zpc2lvbmluZ1Jlc291cmNlLFxuICAgICAgZ2V0U2VuZGVyQ2VydGlmaWNhdGUsXG4gICAgICBnZXRTdGlja2VyLFxuICAgICAgZ2V0U3RpY2tlclBhY2tNYW5pZmVzdCxcbiAgICAgIGdldFN0b3JhZ2VDcmVkZW50aWFscyxcbiAgICAgIGdldFN0b3JhZ2VNYW5pZmVzdCxcbiAgICAgIGdldFN0b3JhZ2VSZWNvcmRzLFxuICAgICAgZ2V0VXVpZHNGb3JFMTY0cyxcbiAgICAgIGdldFV1aWRzRm9yRTE2NHNWMixcbiAgICAgIG1ha2VQcm94aWVkUmVxdWVzdCxcbiAgICAgIG1ha2VTZnVSZXF1ZXN0LFxuICAgICAgbW9kaWZ5R3JvdXAsXG4gICAgICBtb2RpZnlTdG9yYWdlUmVjb3JkcyxcbiAgICAgIHB1dEF0dGFjaG1lbnQsXG4gICAgICBwdXRQcm9maWxlLFxuICAgICAgcHV0U3RpY2tlcnMsXG4gICAgICBwdXRVc2VybmFtZSxcbiAgICAgIHJlZ2lzdGVyQ2FwYWJpbGl0aWVzLFxuICAgICAgcmVnaXN0ZXJLZXlzLFxuICAgICAgcmVnaXN0ZXJTdXBwb3J0Rm9yVW5hdXRoZW50aWNhdGVkRGVsaXZlcnksXG4gICAgICByZXBvcnRNZXNzYWdlLFxuICAgICAgcmVxdWVzdFZlcmlmaWNhdGlvblNNUyxcbiAgICAgIHJlcXVlc3RWZXJpZmljYXRpb25Wb2ljZSxcbiAgICAgIHNlbmRNZXNzYWdlcyxcbiAgICAgIHNlbmRNZXNzYWdlc1VuYXV0aCxcbiAgICAgIHNlbmRXaXRoU2VuZGVyS2V5LFxuICAgICAgc2V0U2lnbmVkUHJlS2V5LFxuICAgICAgc3RhcnRSZWdpc3RyYXRpb24sXG4gICAgICB1cGRhdGVEZXZpY2VOYW1lLFxuICAgICAgdXBsb2FkQXZhdGFyLFxuICAgICAgdXBsb2FkR3JvdXBBdmF0YXIsXG4gICAgICB3aG9hbWksXG4gICAgICBzZW5kQ2hhbGxlbmdlUmVzcG9uc2UsXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9hamF4KFxuICAgICAgcGFyYW06IEFqYXhPcHRpb25zVHlwZSAmIHsgcmVzcG9uc2VUeXBlPzogJ2J5dGVzJyB9XG4gICAgKTogUHJvbWlzZTxVaW50OEFycmF5PjtcbiAgICBmdW5jdGlvbiBfYWpheChcbiAgICAgIHBhcmFtOiBBamF4T3B0aW9uc1R5cGUgJiB7IHJlc3BvbnNlVHlwZTogJ2J5dGVzd2l0aGRldGFpbHMnIH1cbiAgICApOiBQcm9taXNlPEJ5dGVzV2l0aERldGFpbHNUeXBlPjtcbiAgICBmdW5jdGlvbiBfYWpheChcbiAgICAgIHBhcmFtOiBBamF4T3B0aW9uc1R5cGUgJiB7IHJlc3BvbnNlVHlwZTogJ3N0cmVhbScgfVxuICAgICk6IFByb21pc2U8UmVhZGFibGU+O1xuICAgIGZ1bmN0aW9uIF9hamF4KFxuICAgICAgcGFyYW06IEFqYXhPcHRpb25zVHlwZSAmIHsgcmVzcG9uc2VUeXBlOiAnanNvbicgfVxuICAgICk6IFByb21pc2U8dW5rbm93bj47XG5cbiAgICBhc3luYyBmdW5jdGlvbiBfYWpheChwYXJhbTogQWpheE9wdGlvbnNUeXBlKTogUHJvbWlzZTx1bmtub3duPiB7XG4gICAgICBpZiAoXG4gICAgICAgICFwYXJhbS51bmF1dGhlbnRpY2F0ZWQgJiZcbiAgICAgICAgYWN0aXZlUmVnaXN0cmF0aW9uICYmXG4gICAgICAgICFwYXJhbS5pc1JlZ2lzdHJhdGlvblxuICAgICAgKSB7XG4gICAgICAgIGxvZy5pbmZvKCdXZWJBUEk6IHJlcXVlc3QgYmxvY2tlZCBieSBhY3RpdmUgcmVnaXN0cmF0aW9uJyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgYXdhaXQgYWN0aXZlUmVnaXN0cmF0aW9uLnByb21pc2U7XG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gRGF0ZS5ub3coKSAtIHN0YXJ0O1xuICAgICAgICBsb2cuaW5mbyhgV2ViQVBJOiByZXF1ZXN0IHVuYmxvY2tlZCBhZnRlciAke2R1cmF0aW9ufW1zYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcGFyYW0udXJsUGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbS51cmxQYXJhbWV0ZXJzID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZVdlYlNvY2tldEZvckVuZHBvaW50ID1cbiAgICAgICAgdXNlV2ViU29ja2V0ICYmIFdFQlNPQ0tFVF9DQUxMUy5oYXMocGFyYW0uY2FsbCk7XG5cbiAgICAgIGNvbnN0IG91dGVyUGFyYW1zID0ge1xuICAgICAgICBzb2NrZXRNYW5hZ2VyOiB1c2VXZWJTb2NrZXRGb3JFbmRwb2ludCA/IHNvY2tldE1hbmFnZXIgOiB1bmRlZmluZWQsXG4gICAgICAgIGJhc2ljQXV0aDogcGFyYW0uYmFzaWNBdXRoLFxuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgY29udGVudFR5cGU6IHBhcmFtLmNvbnRlbnRUeXBlIHx8ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgZGF0YTpcbiAgICAgICAgICBwYXJhbS5kYXRhIHx8XG4gICAgICAgICAgKHBhcmFtLmpzb25EYXRhID8gSlNPTi5zdHJpbmdpZnkocGFyYW0uanNvbkRhdGEpIDogdW5kZWZpbmVkKSxcbiAgICAgICAgaGVhZGVyczogcGFyYW0uaGVhZGVycyxcbiAgICAgICAgaG9zdDogcGFyYW0uaG9zdCB8fCB1cmwsXG4gICAgICAgIHBhc3N3b3JkOiBwYXJhbS5wYXNzd29yZCA/PyBwYXNzd29yZCxcbiAgICAgICAgcGF0aDogVVJMX0NBTExTW3BhcmFtLmNhbGxdICsgcGFyYW0udXJsUGFyYW1ldGVycyxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogcGFyYW0ucmVzcG9uc2VUeXBlLFxuICAgICAgICB0aW1lb3V0OiBwYXJhbS50aW1lb3V0LFxuICAgICAgICB0eXBlOiBwYXJhbS5odHRwVHlwZSxcbiAgICAgICAgdXNlcjogcGFyYW0udXNlcm5hbWUgPz8gdXNlcm5hbWUsXG4gICAgICAgIHJlZGFjdFVybDogcGFyYW0ucmVkYWN0VXJsLFxuICAgICAgICBzZXJ2ZXJVcmw6IHVybCxcbiAgICAgICAgdmFsaWRhdGVSZXNwb25zZTogcGFyYW0udmFsaWRhdGVSZXNwb25zZSxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgICAgdW5hdXRoZW50aWNhdGVkOiBwYXJhbS51bmF1dGhlbnRpY2F0ZWQsXG4gICAgICAgIGFjY2Vzc0tleTogcGFyYW0uYWNjZXNzS2V5LFxuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IF9vdXRlckFqYXgobnVsbCwgb3V0ZXJQYXJhbXMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIShlIGluc3RhbmNlb2YgSFRUUEVycm9yKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdHJhbnNsYXRlZEVycm9yID0gdHJhbnNsYXRlRXJyb3IoZSk7XG4gICAgICAgIGlmICh0cmFuc2xhdGVkRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyB0cmFuc2xhdGVkRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1dWlkS2luZFRvUXVlcnkoa2luZDogVVVJREtpbmQpOiBzdHJpbmcge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG4gICAgICBpZiAoa2luZCA9PT0gVVVJREtpbmQuQUNJKSB7XG4gICAgICAgIHZhbHVlID0gJ2FjaSc7XG4gICAgICB9IGVsc2UgaWYgKGtpbmQgPT09IFVVSURLaW5kLlBOSSkge1xuICAgICAgICB2YWx1ZSA9ICdwbmknO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBVVUlES2luZDogJHtraW5kfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGBpZGVudGl0eT0ke3ZhbHVlfWA7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gd2hvYW1pKCk6IFByb21pc2U8V2hvYW1pUmVzdWx0VHlwZT4ge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICd3aG9hbWknLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB3aG9hbWlSZXN1bHRab2QucGFyc2UocmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHNlbmRDaGFsbGVuZ2VSZXNwb25zZShjaGFsbGVuZ2VSZXNwb25zZTogQ2hhbGxlbmdlVHlwZSkge1xuICAgICAgYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAnY2hhbGxlbmdlJyxcbiAgICAgICAgaHR0cFR5cGU6ICdQVVQnLFxuICAgICAgICBqc29uRGF0YTogY2hhbGxlbmdlUmVzcG9uc2UsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBhdXRoZW50aWNhdGUoe1xuICAgICAgdXNlcm5hbWU6IG5ld1VzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IG5ld1Bhc3N3b3JkLFxuICAgIH06IFdlYkFQSUNyZWRlbnRpYWxzKSB7XG4gICAgICB1c2VybmFtZSA9IG5ld1VzZXJuYW1lO1xuICAgICAgcGFzc3dvcmQgPSBuZXdQYXNzd29yZDtcblxuICAgICAgaWYgKHVzZVdlYlNvY2tldCkge1xuICAgICAgICBhd2FpdCBzb2NrZXRNYW5hZ2VyLmF1dGhlbnRpY2F0ZSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgcGFzc3dvcmQgPSAnJztcblxuICAgICAgaWYgKHVzZVdlYlNvY2tldCkge1xuICAgICAgICBhd2FpdCBzb2NrZXRNYW5hZ2VyLmxvZ291dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNvY2tldFN0YXR1cygpOiBTb2NrZXRTdGF0dXMge1xuICAgICAgcmV0dXJuIHNvY2tldE1hbmFnZXIuZ2V0U3RhdHVzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tTb2NrZXRzKCk6IHZvaWQge1xuICAgICAgLy8gSW50ZW50aW9uYWxseSBub3QgYXdhaXRpbmdcbiAgICAgIHNvY2tldE1hbmFnZXIuY2hlY2soKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBvbk9ubGluZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IHNvY2tldE1hbmFnZXIub25PbmxpbmUoKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBvbk9mZmxpbmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBhd2FpdCBzb2NrZXRNYW5hZ2VyLm9uT2ZmbGluZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyUmVxdWVzdEhhbmRsZXIoaGFuZGxlcjogSVJlcXVlc3RIYW5kbGVyKTogdm9pZCB7XG4gICAgICBzb2NrZXRNYW5hZ2VyLnJlZ2lzdGVyUmVxdWVzdEhhbmRsZXIoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5yZWdpc3RlclJlcXVlc3RIYW5kbGVyKGhhbmRsZXI6IElSZXF1ZXN0SGFuZGxlcik6IHZvaWQge1xuICAgICAgc29ja2V0TWFuYWdlci51bnJlZ2lzdGVyUmVxdWVzdEhhbmRsZXIoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuICAgICAgdHlwZSBSZXNUeXBlID0ge1xuICAgICAgICBjb25maWc6IEFycmF5PHsgbmFtZTogc3RyaW5nOyBlbmFibGVkOiBib29sZWFuOyB2YWx1ZTogc3RyaW5nIHwgbnVsbCB9PjtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXMgPSAoYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAnY29uZmlnJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIH0pKSBhcyBSZXNUeXBlO1xuXG4gICAgICByZXR1cm4gcmVzLmNvbmZpZy5maWx0ZXIoXG4gICAgICAgICh7IG5hbWUgfTogeyBuYW1lOiBzdHJpbmcgfSkgPT5cbiAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgoJ2Rlc2t0b3AuJykgfHwgbmFtZS5zdGFydHNXaXRoKCdnbG9iYWwuJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0U2VuZGVyQ2VydGlmaWNhdGUob21pdEUxNjQ/OiBib29sZWFuKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IF9hamF4KHtcbiAgICAgICAgY2FsbDogJ2RlbGl2ZXJ5Q2VydCcsXG4gICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgIHZhbGlkYXRlUmVzcG9uc2U6IHsgY2VydGlmaWNhdGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIC4uLihvbWl0RTE2NCA/IHsgdXJsUGFyYW1ldGVyczogJz9pbmNsdWRlRTE2ND1mYWxzZScgfSA6IHt9KSxcbiAgICAgIH0pKSBhcyBHZXRTZW5kZXJDZXJ0aWZpY2F0ZVJlc3VsdFR5cGU7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZUNyZWRlbnRpYWxzKCk6IFByb21pc2U8U3RvcmFnZVNlcnZpY2VDcmVkZW50aWFscz4ge1xuICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdzdG9yYWdlVG9rZW4nLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICBzY2hlbWE6IHsgdXNlcm5hbWU6ICdzdHJpbmcnLCBwYXNzd29yZDogJ3N0cmluZycgfSxcbiAgICAgIH0pKSBhcyBTdG9yYWdlU2VydmljZUNyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2VNYW5pZmVzdChcbiAgICAgIG9wdGlvbnM6IFN0b3JhZ2VTZXJ2aWNlQ2FsbE9wdGlvbnNUeXBlID0ge31cbiAgICApOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICAgIGNvbnN0IHsgY3JlZGVudGlhbHMsIGdyZWF0ZXJUaGFuVmVyc2lvbiB9ID0gb3B0aW9ucztcblxuICAgICAgY29uc3QgeyBkYXRhLCByZXNwb25zZSB9ID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAnc3RvcmFnZU1hbmlmZXN0JyxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXByb3RvYnVmJyxcbiAgICAgICAgaG9zdDogc3RvcmFnZVVybCxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlc3dpdGhkZXRhaWxzJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogZ3JlYXRlclRoYW5WZXJzaW9uXG4gICAgICAgICAgPyBgL3ZlcnNpb24vJHtncmVhdGVyVGhhblZlcnNpb259YFxuICAgICAgICAgIDogJycsXG4gICAgICAgIC4uLmNyZWRlbnRpYWxzLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwNCkge1xuICAgICAgICB0aHJvdyBtYWtlSFRUUEVycm9yKFxuICAgICAgICAgICdwcm9taXNlQWpheDogZXJyb3IgcmVzcG9uc2UnLFxuICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLnJhdygpLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgbmV3IEVycm9yKCkuc3RhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZVJlY29yZHMoXG4gICAgICBkYXRhOiBVaW50OEFycmF5LFxuICAgICAgb3B0aW9uczogU3RvcmFnZVNlcnZpY2VDYWxsT3B0aW9uc1R5cGUgPSB7fVxuICAgICk6IFByb21pc2U8VWludDhBcnJheT4ge1xuICAgICAgY29uc3QgeyBjcmVkZW50aWFscyB9ID0gb3B0aW9ucztcblxuICAgICAgcmV0dXJuIF9hamF4KHtcbiAgICAgICAgY2FsbDogJ3N0b3JhZ2VSZWFkJyxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXByb3RvYnVmJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgaG9zdDogc3RvcmFnZVVybCxcbiAgICAgICAgaHR0cFR5cGU6ICdQVVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgIC4uLmNyZWRlbnRpYWxzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gbW9kaWZ5U3RvcmFnZVJlY29yZHMoXG4gICAgICBkYXRhOiBVaW50OEFycmF5LFxuICAgICAgb3B0aW9uczogU3RvcmFnZVNlcnZpY2VDYWxsT3B0aW9uc1R5cGUgPSB7fVxuICAgICk6IFByb21pc2U8VWludDhBcnJheT4ge1xuICAgICAgY29uc3QgeyBjcmVkZW50aWFscyB9ID0gb3B0aW9ucztcblxuICAgICAgcmV0dXJuIF9hamF4KHtcbiAgICAgICAgY2FsbDogJ3N0b3JhZ2VNb2RpZnknLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtcHJvdG9idWYnLFxuICAgICAgICBkYXRhLFxuICAgICAgICBob3N0OiBzdG9yYWdlVXJsLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICAgIC8vIElmIHdlIHJ1biBpbnRvIGEgY29uZmxpY3QsIHRoZSBjdXJyZW50IG1hbmlmZXN0IGlzIHJldHVybmVkIC1cbiAgICAgICAgLy8gICBpdCB3aWxsIHdpbGwgYmUgYW4gVWludDhBcnJheSBhdCB0aGUgcmVzcG9uc2Uga2V5IG9uIHRoZSBFcnJvclxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgIC4uLmNyZWRlbnRpYWxzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJTdXBwb3J0Rm9yVW5hdXRoZW50aWNhdGVkRGVsaXZlcnkoKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdzdXBwb3J0VW5hdXRoZW50aWNhdGVkRGVsaXZlcnknLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJDYXBhYmlsaXRpZXMoY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXRpZXNVcGxvYWRUeXBlKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdyZWdpc3RlckNhcGFiaWxpdGllcycsXG4gICAgICAgIGh0dHBUeXBlOiAnUFVUJyxcbiAgICAgICAganNvbkRhdGE6IGNhcGFiaWxpdGllcyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb2ZpbGVVcmwoXG4gICAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgICB7XG4gICAgICAgIHByb2ZpbGVLZXlWZXJzaW9uLFxuICAgICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3QsXG4gICAgICAgIGNyZWRlbnRpYWxUeXBlID0gJ2V4cGlyaW5nUHJvZmlsZUtleScsXG4gICAgICB9OiBHZXRQcm9maWxlQ29tbW9uT3B0aW9uc1R5cGVcbiAgICApIHtcbiAgICAgIGxldCBwcm9maWxlVXJsID0gYC8ke2lkZW50aWZpZXJ9YDtcbiAgICAgIGlmIChwcm9maWxlS2V5VmVyc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb2ZpbGVVcmwgKz0gYC8ke3Byb2ZpbGVLZXlWZXJzaW9ufWA7XG4gICAgICAgIGlmIChwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHByb2ZpbGVVcmwgKz1cbiAgICAgICAgICAgIGAvJHtwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3R9YCArXG4gICAgICAgICAgICBgP2NyZWRlbnRpYWxUeXBlPSR7Y3JlZGVudGlhbFR5cGV9YDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdCA9PT0gdW5kZWZpbmVkLFxuICAgICAgICAgICdnZXRQcm9maWxlVXJsIGNhbGxlZCB3aXRob3V0IHZlcnNpb24sIGJ1dCB3aXRoIHJlcXVlc3QnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9maWxlVXJsO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldFByb2ZpbGUoXG4gICAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgICBvcHRpb25zOiBHZXRQcm9maWxlT3B0aW9uc1R5cGVcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgcHJvZmlsZUtleVZlcnNpb24sIHByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdCwgdXNlckxhbmd1YWdlcyB9ID1cbiAgICAgICAgb3B0aW9ucztcblxuICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdwcm9maWxlJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBnZXRQcm9maWxlVXJsKGlkZW50aWZpZXIsIG9wdGlvbnMpLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6IGZvcm1hdEFjY2VwdExhbmd1YWdlSGVhZGVyKHVzZXJMYW5ndWFnZXMpLFxuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgcmVkYWN0VXJsOiBfY3JlYXRlUmVkYWN0b3IoXG4gICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICBwcm9maWxlS2V5VmVyc2lvbixcbiAgICAgICAgICBwcm9maWxlS2V5Q3JlZGVudGlhbFJlcXVlc3RcbiAgICAgICAgKSxcbiAgICAgIH0pKSBhcyBQcm9maWxlVHlwZTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRQcm9maWxlRm9yVXNlcm5hbWUodXNlcm5hbWVUb0ZldGNoOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAncHJvZmlsZScsXG4gICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC91c2VybmFtZS8ke3VzZXJuYW1lVG9GZXRjaH1gLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgcmVkYWN0VXJsOiBfY3JlYXRlUmVkYWN0b3IodXNlcm5hbWVUb0ZldGNoKSxcbiAgICAgIH0pKSBhcyBQcm9maWxlVHlwZTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBwdXRQcm9maWxlKFxuICAgICAganNvbkRhdGE6IFByb2ZpbGVSZXF1ZXN0RGF0YVR5cGVcbiAgICApOiBQcm9taXNlPFVwbG9hZEF2YXRhckhlYWRlcnNUeXBlIHwgdW5kZWZpbmVkPiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdwcm9maWxlJyxcbiAgICAgICAgaHR0cFR5cGU6ICdQVVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAganNvbkRhdGEsXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdXBsb2FkQXZhdGFySGVhZGVyc1pvZC5wYXJzZShyZXMpO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldFByb2ZpbGVVbmF1dGgoXG4gICAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgICBvcHRpb25zOiBHZXRQcm9maWxlVW5hdXRoT3B0aW9uc1R5cGVcbiAgICApIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYWNjZXNzS2V5LFxuICAgICAgICBwcm9maWxlS2V5VmVyc2lvbixcbiAgICAgICAgcHJvZmlsZUtleUNyZWRlbnRpYWxSZXF1ZXN0LFxuICAgICAgICB1c2VyTGFuZ3VhZ2VzLFxuICAgICAgfSA9IG9wdGlvbnM7XG5cbiAgICAgIHJldHVybiAoYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAncHJvZmlsZScsXG4gICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogZ2V0UHJvZmlsZVVybChpZGVudGlmaWVyLCBvcHRpb25zKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBmb3JtYXRBY2NlcHRMYW5ndWFnZUhlYWRlcih1c2VyTGFuZ3VhZ2VzKSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgIHVuYXV0aGVudGljYXRlZDogdHJ1ZSxcbiAgICAgICAgYWNjZXNzS2V5LFxuICAgICAgICByZWRhY3RVcmw6IF9jcmVhdGVSZWRhY3RvcihcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgIHByb2ZpbGVLZXlWZXJzaW9uLFxuICAgICAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsUmVxdWVzdFxuICAgICAgICApLFxuICAgICAgfSkpIGFzIFByb2ZpbGVUeXBlO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldEJhZGdlSW1hZ2VGaWxlKFxuICAgICAgaW1hZ2VGaWxlVXJsOiBzdHJpbmdcbiAgICApOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICAgIHN0cmljdEFzc2VydChcbiAgICAgICAgaXNCYWRnZUltYWdlRmlsZVVybFZhbGlkKGltYWdlRmlsZVVybCwgdXBkYXRlc1VybCksXG4gICAgICAgICdnZXRCYWRnZUltYWdlRmlsZSBnb3QgYW4gaW52YWxpZCBVUkwuIFdhcyBiYWQgZGF0YSBzYXZlZD8nXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gX291dGVyQWpheChpbWFnZUZpbGVVcmwsIHtcbiAgICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzJyxcbiAgICAgICAgdGltZW91dDogMCxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHJlZGFjdFVybDogKGhyZWY6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhcnNlZFVybCA9IG1heWJlUGFyc2VVcmwoaHJlZik7XG4gICAgICAgICAgaWYgKCFwYXJzZWRVcmwpIHtcbiAgICAgICAgICAgIHJldHVybiBocmVmO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB7IHBhdGhuYW1lIH0gPSBwYXJzZWRVcmw7XG4gICAgICAgICAgY29uc3QgcGF0dGVybiA9IFJlZ0V4cChlc2NhcGVSZWdFeHAocGF0aG5hbWUpLCAnZycpO1xuICAgICAgICAgIHJldHVybiBocmVmLnJlcGxhY2UocGF0dGVybiwgYFtSRURBQ1RFRF0ke3BhdGhuYW1lLnNsaWNlKC0zKX1gKTtcbiAgICAgICAgfSxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldEJvb3N0QmFkZ2VzRnJvbVNlcnZlcihcbiAgICAgIHVzZXJMYW5ndWFnZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICAgICk6IFByb21pc2U8dW5rbm93bj4ge1xuICAgICAgcmV0dXJuIF9hamF4KHtcbiAgICAgICAgY2FsbDogJ2Jvb3N0QmFkZ2VzJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6IGZvcm1hdEFjY2VwdExhbmd1YWdlSGVhZGVyKHVzZXJMYW5ndWFnZXMpLFxuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldEF2YXRhcihwYXRoOiBzdHJpbmcpIHtcbiAgICAgIC8vIFVzaW5nIF9vdXRlckFKQVgsIHNpbmNlIGl0J3Mgbm90IGhhcmRjb2RlZCB0byB0aGUgU2lnbmFsIFNlcnZlci4gVW5saWtlIG91clxuICAgICAgLy8gICBhdHRhY2htZW50IENETiwgaXQgdXNlcyBvdXIgc2VsZi1zaWduZWQgY2VydGlmaWNhdGUsIHNvIHdlIHBhc3MgaXQgaW4uXG4gICAgICByZXR1cm4gX291dGVyQWpheChgJHtjZG5VcmxPYmplY3RbJzAnXX0vJHtwYXRofWAsIHtcbiAgICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzJyxcbiAgICAgICAgdGltZW91dDogMCxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHJlZGFjdFVybDogKGhyZWY6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBSZWdFeHAoZXNjYXBlUmVnRXhwKHBhdGgpLCAnZycpO1xuICAgICAgICAgIHJldHVybiBocmVmLnJlcGxhY2UocGF0dGVybiwgYFtSRURBQ1RFRF0ke3BhdGguc2xpY2UoLTMpfWApO1xuICAgICAgICB9LFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVXNlcm5hbWUoKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICd1c2VybmFtZScsXG4gICAgICAgIGh0dHBUeXBlOiAnREVMRVRFJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBwdXRVc2VybmFtZShuZXdVc2VybmFtZTogc3RyaW5nKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICd1c2VybmFtZScsXG4gICAgICAgIGh0dHBUeXBlOiAnUFVUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC8ke25ld1VzZXJuYW1lfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiByZXBvcnRNZXNzYWdlKFxuICAgICAgc2VuZGVyVXVpZDogc3RyaW5nLFxuICAgICAgc2VydmVyR3VpZDogc3RyaW5nXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdyZXBvcnRNZXNzYWdlJyxcbiAgICAgICAgaHR0cFR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC8ke3NlbmRlclV1aWR9LyR7c2VydmVyR3VpZH1gLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiByZXF1ZXN0VmVyaWZpY2F0aW9uU01TKG51bWJlcjogc3RyaW5nLCB0b2tlbjogc3RyaW5nKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdhY2NvdW50cycsXG4gICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC9zbXMvY29kZS8ke251bWJlcn0/Y2FwdGNoYT0ke3Rva2VufWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiByZXF1ZXN0VmVyaWZpY2F0aW9uVm9pY2UobnVtYmVyOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcpIHtcbiAgICAgIGF3YWl0IF9hamF4KHtcbiAgICAgICAgY2FsbDogJ2FjY291bnRzJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgL3ZvaWNlL2NvZGUvJHtudW1iZXJ9P2NhcHRjaGE9JHt0b2tlbn1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gY2hlY2tBY2NvdW50RXhpc3RlbmNlKHV1aWQ6IFVVSUQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IF9hamF4KHtcbiAgICAgICAgICBodHRwVHlwZTogJ0hFQUQnLFxuICAgICAgICAgIGNhbGw6ICdhY2NvdW50RXhpc3RlbmNlJyxcbiAgICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgLyR7dXVpZC50b1N0cmluZygpfWAsXG4gICAgICAgICAgdW5hdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICAgIGFjY2Vzc0tleTogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIVFRQRXJyb3IgJiYgZXJyb3IuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRSZWdpc3RyYXRpb24oKSB7XG4gICAgICBzdHJpY3RBc3NlcnQoXG4gICAgICAgIGFjdGl2ZVJlZ2lzdHJhdGlvbiA9PT0gdW5kZWZpbmVkLFxuICAgICAgICAnUmVnaXN0cmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MnXG4gICAgICApO1xuXG4gICAgICBhY3RpdmVSZWdpc3RyYXRpb24gPSBleHBsb2RlUHJvbWlzZTx2b2lkPigpO1xuICAgICAgbG9nLmluZm8oJ1dlYkFQSTogc3RhcnRpbmcgcmVnaXN0cmF0aW9uJyk7XG5cbiAgICAgIHJldHVybiBhY3RpdmVSZWdpc3RyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluaXNoUmVnaXN0cmF0aW9uKHJlZ2lzdHJhdGlvbjogdW5rbm93bikge1xuICAgICAgc3RyaWN0QXNzZXJ0KGFjdGl2ZVJlZ2lzdHJhdGlvbiAhPT0gdW5kZWZpbmVkLCAnTm8gYWN0aXZlIHJlZ2lzdHJhdGlvbicpO1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICBhY3RpdmVSZWdpc3RyYXRpb24gPT09IHJlZ2lzdHJhdGlvbixcbiAgICAgICAgJ0ludmFsaWQgcmVnaXN0cmF0aW9uIGJhdG9uJ1xuICAgICAgKTtcblxuICAgICAgbG9nLmluZm8oJ1dlYkFQSTogZmluaXNoaW5nIHJlZ2lzdHJhdGlvbicpO1xuICAgICAgY29uc3QgY3VycmVudCA9IGFjdGl2ZVJlZ2lzdHJhdGlvbjtcbiAgICAgIGFjdGl2ZVJlZ2lzdHJhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgIGN1cnJlbnQucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGNvbmZpcm1Db2RlKFxuICAgICAgbnVtYmVyOiBzdHJpbmcsXG4gICAgICBjb2RlOiBzdHJpbmcsXG4gICAgICBuZXdQYXNzd29yZDogc3RyaW5nLFxuICAgICAgcmVnaXN0cmF0aW9uSWQ6IG51bWJlcixcbiAgICAgIGRldmljZU5hbWU/OiBzdHJpbmcgfCBudWxsLFxuICAgICAgb3B0aW9uczogeyBhY2Nlc3NLZXk/OiBVaW50OEFycmF5IH0gPSB7fVxuICAgICkge1xuICAgICAgY29uc3QgY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXRpZXNVcGxvYWRUeXBlID0ge1xuICAgICAgICBhbm5vdW5jZW1lbnRHcm91cDogdHJ1ZSxcbiAgICAgICAgZ2lmdEJhZGdlczogdHJ1ZSxcbiAgICAgICAgJ2d2Mi0zJzogdHJ1ZSxcbiAgICAgICAgJ2d2MS1taWdyYXRpb24nOiB0cnVlLFxuICAgICAgICBzZW5kZXJLZXk6IHRydWUsXG4gICAgICAgIGNoYW5nZU51bWJlcjogdHJ1ZSxcbiAgICAgICAgc3RvcmllczogdHJ1ZSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHsgYWNjZXNzS2V5IH0gPSBvcHRpb25zO1xuICAgICAgY29uc3QganNvbkRhdGEgPSB7XG4gICAgICAgIGNhcGFiaWxpdGllcyxcbiAgICAgICAgZmV0Y2hlc01lc3NhZ2VzOiB0cnVlLFxuICAgICAgICBuYW1lOiBkZXZpY2VOYW1lIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgcmVnaXN0cmF0aW9uSWQsXG4gICAgICAgIHN1cHBvcnRzU21zOiBmYWxzZSxcbiAgICAgICAgdW5pZGVudGlmaWVkQWNjZXNzS2V5OiBhY2Nlc3NLZXlcbiAgICAgICAgICA/IEJ5dGVzLnRvQmFzZTY0KGFjY2Vzc0tleSlcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgdW5yZXN0cmljdGVkVW5pZGVudGlmaWVkQWNjZXNzOiBmYWxzZSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGNhbGwgPSBkZXZpY2VOYW1lID8gJ2RldmljZXMnIDogJ2FjY291bnRzJztcbiAgICAgIGNvbnN0IHVybFByZWZpeCA9IGRldmljZU5hbWUgPyAnLycgOiAnL2NvZGUvJztcblxuICAgICAgLy8gUmVzZXQgb2xkIHdlYnNvY2tldCBjcmVkZW50aWFscyBhbmQgZGlzY29ubmVjdC5cbiAgICAgIC8vIEFjY291bnRNYW5hZ2VyIGlzIG91ciBvbmx5IGNhbGxlciBhbmQgaXQgd2lsbCB0cmlnZ2VyXG4gICAgICAvLyBgcmVnaXN0cmF0aW9uX2RvbmVgIHdoaWNoIHdpbGwgdXBkYXRlIGNyZWRlbnRpYWxzLlxuICAgICAgYXdhaXQgbG9nb3V0KCk7XG5cbiAgICAgIC8vIFVwZGF0ZSBSRVNUIGNyZWRlbnRpYWxzLCB0aG91Z2guIFdlIG5lZWQgdGhlbSBmb3IgdGhlIGNhbGwgYmVsb3dcbiAgICAgIHVzZXJuYW1lID0gbnVtYmVyO1xuICAgICAgcGFzc3dvcmQgPSBuZXdQYXNzd29yZDtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSAoYXdhaXQgX2FqYXgoe1xuICAgICAgICBpc1JlZ2lzdHJhdGlvbjogdHJ1ZSxcbiAgICAgICAgY2FsbCxcbiAgICAgICAgaHR0cFR5cGU6ICdQVVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogdXJsUHJlZml4ICsgY29kZSxcbiAgICAgICAganNvbkRhdGEsXG4gICAgICB9KSkgYXMgQ29uZmlybUNvZGVSZXN1bHRUeXBlO1xuXG4gICAgICAvLyBTZXQgZmluYWwgUkVTVCBjcmVkZW50aWFscyB0byBsZXQgYHJlZ2lzdGVyS2V5c2Agc3VjY2VlZC5cbiAgICAgIHVzZXJuYW1lID0gYCR7cmVzcG9uc2UudXVpZCB8fCBudW1iZXJ9LiR7cmVzcG9uc2UuZGV2aWNlSWQgfHwgMX1gO1xuICAgICAgcGFzc3dvcmQgPSBuZXdQYXNzd29yZDtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURldmljZU5hbWUoZGV2aWNlTmFtZTogc3RyaW5nKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICd1cGRhdGVEZXZpY2VOYW1lJyxcbiAgICAgICAgaHR0cFR5cGU6ICdQVVQnLFxuICAgICAgICBqc29uRGF0YToge1xuICAgICAgICAgIGRldmljZU5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRJY2VTZXJ2ZXJzKCkge1xuICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdnZXRJY2VTZXJ2ZXJzJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIH0pKSBhcyBHZXRJY2VTZXJ2ZXJzUmVzdWx0VHlwZTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXREZXZpY2VzKCkge1xuICAgICAgcmV0dXJuIChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdkZXZpY2VzJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIH0pKSBhcyBHZXREZXZpY2VzUmVzdWx0VHlwZTtcbiAgICB9XG5cbiAgICB0eXBlIEpTT05TaWduZWRQcmVLZXlUeXBlID0ge1xuICAgICAga2V5SWQ6IG51bWJlcjtcbiAgICAgIHB1YmxpY0tleTogc3RyaW5nO1xuICAgICAgc2lnbmF0dXJlOiBzdHJpbmc7XG4gICAgfTtcblxuICAgIHR5cGUgSlNPTktleXNUeXBlID0ge1xuICAgICAgaWRlbnRpdHlLZXk6IHN0cmluZztcbiAgICAgIHNpZ25lZFByZUtleTogSlNPTlNpZ25lZFByZUtleVR5cGU7XG4gICAgICBwcmVLZXlzOiBBcnJheTx7XG4gICAgICAgIGtleUlkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpY0tleTogc3RyaW5nO1xuICAgICAgfT47XG4gICAgfTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyS2V5cyhnZW5LZXlzOiBLZXlzVHlwZSwgdXVpZEtpbmQ6IFVVSURLaW5kKSB7XG4gICAgICBjb25zdCBwcmVLZXlzID0gZ2VuS2V5cy5wcmVLZXlzLm1hcChrZXkgPT4gKHtcbiAgICAgICAga2V5SWQ6IGtleS5rZXlJZCxcbiAgICAgICAgcHVibGljS2V5OiBCeXRlcy50b0Jhc2U2NChrZXkucHVibGljS2V5KSxcbiAgICAgIH0pKTtcblxuICAgICAgY29uc3Qga2V5czogSlNPTktleXNUeXBlID0ge1xuICAgICAgICBpZGVudGl0eUtleTogQnl0ZXMudG9CYXNlNjQoZ2VuS2V5cy5pZGVudGl0eUtleSksXG4gICAgICAgIHNpZ25lZFByZUtleToge1xuICAgICAgICAgIGtleUlkOiBnZW5LZXlzLnNpZ25lZFByZUtleS5rZXlJZCxcbiAgICAgICAgICBwdWJsaWNLZXk6IEJ5dGVzLnRvQmFzZTY0KGdlbktleXMuc2lnbmVkUHJlS2V5LnB1YmxpY0tleSksXG4gICAgICAgICAgc2lnbmF0dXJlOiBCeXRlcy50b0Jhc2U2NChnZW5LZXlzLnNpZ25lZFByZUtleS5zaWduYXR1cmUpLFxuICAgICAgICB9LFxuICAgICAgICBwcmVLZXlzLFxuICAgICAgfTtcblxuICAgICAgYXdhaXQgX2FqYXgoe1xuICAgICAgICBpc1JlZ2lzdHJhdGlvbjogdHJ1ZSxcbiAgICAgICAgY2FsbDogJ2tleXMnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgPyR7dXVpZEtpbmRUb1F1ZXJ5KHV1aWRLaW5kKX1gLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICAgIGpzb25EYXRhOiBrZXlzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gc2V0U2lnbmVkUHJlS2V5KFxuICAgICAgc2lnbmVkUHJlS2V5OiBTaWduZWRQcmVLZXlUeXBlLFxuICAgICAgdXVpZEtpbmQ6IFVVSURLaW5kXG4gICAgKSB7XG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdzaWduZWQnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgPyR7dXVpZEtpbmRUb1F1ZXJ5KHV1aWRLaW5kKX1gLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICAgIGpzb25EYXRhOiB7XG4gICAgICAgICAga2V5SWQ6IHNpZ25lZFByZUtleS5rZXlJZCxcbiAgICAgICAgICBwdWJsaWNLZXk6IEJ5dGVzLnRvQmFzZTY0KHNpZ25lZFByZUtleS5wdWJsaWNLZXkpLFxuICAgICAgICAgIHNpZ25hdHVyZTogQnl0ZXMudG9CYXNlNjQoc2lnbmVkUHJlS2V5LnNpZ25hdHVyZSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0eXBlIFNlcnZlcktleUNvdW50VHlwZSA9IHtcbiAgICAgIGNvdW50OiBudW1iZXI7XG4gICAgfTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldE15S2V5cyh1dWlkS2luZDogVVVJREtpbmQpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gKGF3YWl0IF9hamF4KHtcbiAgICAgICAgY2FsbDogJ2tleXMnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgPyR7dXVpZEtpbmRUb1F1ZXJ5KHV1aWRLaW5kKX1gLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICB2YWxpZGF0ZVJlc3BvbnNlOiB7IGNvdW50OiAnbnVtYmVyJyB9LFxuICAgICAgfSkpIGFzIFNlcnZlcktleUNvdW50VHlwZTtcblxuICAgICAgcmV0dXJuIHJlc3VsdC5jb3VudDtcbiAgICB9XG5cbiAgICB0eXBlIFNlcnZlcktleVJlc3BvbnNlVHlwZSA9IHtcbiAgICAgIGRldmljZXM6IEFycmF5PHtcbiAgICAgICAgZGV2aWNlSWQ6IG51bWJlcjtcbiAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IG51bWJlcjtcbiAgICAgICAgc2lnbmVkUHJlS2V5OiB7XG4gICAgICAgICAga2V5SWQ6IG51bWJlcjtcbiAgICAgICAgICBwdWJsaWNLZXk6IHN0cmluZztcbiAgICAgICAgICBzaWduYXR1cmU6IHN0cmluZztcbiAgICAgICAgfTtcbiAgICAgICAgcHJlS2V5Pzoge1xuICAgICAgICAgIGtleUlkOiBudW1iZXI7XG4gICAgICAgICAgcHVibGljS2V5OiBzdHJpbmc7XG4gICAgICAgIH07XG4gICAgICB9PjtcbiAgICAgIGlkZW50aXR5S2V5OiBzdHJpbmc7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZUtleXMocmVzOiBTZXJ2ZXJLZXlSZXNwb25zZVR5cGUpOiBTZXJ2ZXJLZXlzVHlwZSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzLmRldmljZXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByZXNwb25zZScpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkZXZpY2VzID0gcmVzLmRldmljZXMubWFwKGRldmljZSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhX3ZhbGlkYXRlUmVzcG9uc2UoZGV2aWNlLCB7IHNpZ25lZFByZUtleTogJ29iamVjdCcgfSkgfHxcbiAgICAgICAgICAhX3ZhbGlkYXRlUmVzcG9uc2UoZGV2aWNlLnNpZ25lZFByZUtleSwge1xuICAgICAgICAgICAgcHVibGljS2V5OiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHNpZ25hdHVyZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHNpZ25lZFByZUtleScpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZUtleTtcbiAgICAgICAgaWYgKGRldmljZS5wcmVLZXkpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhX3ZhbGlkYXRlUmVzcG9uc2UoZGV2aWNlLCB7IHByZUtleTogJ29iamVjdCcgfSkgfHxcbiAgICAgICAgICAgICFfdmFsaWRhdGVSZXNwb25zZShkZXZpY2UucHJlS2V5LCB7IHB1YmxpY0tleTogJ3N0cmluZycgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwcmVLZXknKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcmVLZXkgPSB7XG4gICAgICAgICAgICBrZXlJZDogZGV2aWNlLnByZUtleS5rZXlJZCxcbiAgICAgICAgICAgIHB1YmxpY0tleTogQnl0ZXMuZnJvbUJhc2U2NChkZXZpY2UucHJlS2V5LnB1YmxpY0tleSksXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGV2aWNlSWQ6IGRldmljZS5kZXZpY2VJZCxcbiAgICAgICAgICByZWdpc3RyYXRpb25JZDogZGV2aWNlLnJlZ2lzdHJhdGlvbklkLFxuICAgICAgICAgIHByZUtleSxcbiAgICAgICAgICBzaWduZWRQcmVLZXk6IHtcbiAgICAgICAgICAgIGtleUlkOiBkZXZpY2Uuc2lnbmVkUHJlS2V5LmtleUlkLFxuICAgICAgICAgICAgcHVibGljS2V5OiBCeXRlcy5mcm9tQmFzZTY0KGRldmljZS5zaWduZWRQcmVLZXkucHVibGljS2V5KSxcbiAgICAgICAgICAgIHNpZ25hdHVyZTogQnl0ZXMuZnJvbUJhc2U2NChkZXZpY2Uuc2lnbmVkUHJlS2V5LnNpZ25hdHVyZSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkZXZpY2VzLFxuICAgICAgICBpZGVudGl0eUtleTogQnl0ZXMuZnJvbUJhc2U2NChyZXMuaWRlbnRpdHlLZXkpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRLZXlzRm9ySWRlbnRpZmllcihpZGVudGlmaWVyOiBzdHJpbmcsIGRldmljZUlkPzogbnVtYmVyKSB7XG4gICAgICBjb25zdCBrZXlzID0gKGF3YWl0IF9hamF4KHtcbiAgICAgICAgY2FsbDogJ2tleXMnLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6IGAvJHtpZGVudGlmaWVyfS8ke2RldmljZUlkIHx8ICcqJ31gLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgdmFsaWRhdGVSZXNwb25zZTogeyBpZGVudGl0eUtleTogJ3N0cmluZycsIGRldmljZXM6ICdvYmplY3QnIH0sXG4gICAgICB9KSkgYXMgU2VydmVyS2V5UmVzcG9uc2VUeXBlO1xuICAgICAgcmV0dXJuIGhhbmRsZUtleXMoa2V5cyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0S2V5c0ZvcklkZW50aWZpZXJVbmF1dGgoXG4gICAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgICBkZXZpY2VJZD86IG51bWJlcixcbiAgICAgIHsgYWNjZXNzS2V5IH06IHsgYWNjZXNzS2V5Pzogc3RyaW5nIH0gPSB7fVxuICAgICkge1xuICAgICAgY29uc3Qga2V5cyA9IChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdrZXlzJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICB1cmxQYXJhbWV0ZXJzOiBgLyR7aWRlbnRpZmllcn0vJHtkZXZpY2VJZCB8fCAnKid9YCxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgIHZhbGlkYXRlUmVzcG9uc2U6IHsgaWRlbnRpdHlLZXk6ICdzdHJpbmcnLCBkZXZpY2VzOiAnb2JqZWN0JyB9LFxuICAgICAgICB1bmF1dGhlbnRpY2F0ZWQ6IHRydWUsXG4gICAgICAgIGFjY2Vzc0tleSxcbiAgICAgIH0pKSBhcyBTZXJ2ZXJLZXlSZXNwb25zZVR5cGU7XG4gICAgICByZXR1cm4gaGFuZGxlS2V5cyhrZXlzKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZXNVbmF1dGgoXG4gICAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgICAgbWVzc2FnZXM6IFJlYWRvbmx5QXJyYXk8TWVzc2FnZVR5cGU+LFxuICAgICAgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICB7XG4gICAgICAgIGFjY2Vzc0tleSxcbiAgICAgICAgb25saW5lLFxuICAgICAgICB1cmdlbnQgPSB0cnVlLFxuICAgICAgfTogeyBhY2Nlc3NLZXk/OiBzdHJpbmc7IG9ubGluZT86IGJvb2xlYW47IHVyZ2VudD86IGJvb2xlYW4gfVxuICAgICkge1xuICAgICAgY29uc3QganNvbkRhdGEgPSB7XG4gICAgICAgIG1lc3NhZ2VzLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIG9ubGluZTogQm9vbGVhbihvbmxpbmUpLFxuICAgICAgICB1cmdlbnQsXG4gICAgICB9O1xuXG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdtZXNzYWdlcycsXG4gICAgICAgIGh0dHBUeXBlOiAnUFVUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC8ke2Rlc3RpbmF0aW9ufWAsXG4gICAgICAgIGpzb25EYXRhLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgdW5hdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICBhY2Nlc3NLZXksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZXMoXG4gICAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgICAgbWVzc2FnZXM6IFJlYWRvbmx5QXJyYXk8TWVzc2FnZVR5cGU+LFxuICAgICAgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICB7IG9ubGluZSwgdXJnZW50ID0gdHJ1ZSB9OiB7IG9ubGluZT86IGJvb2xlYW47IHVyZ2VudD86IGJvb2xlYW4gfVxuICAgICkge1xuICAgICAgY29uc3QganNvbkRhdGEgPSB7XG4gICAgICAgIG1lc3NhZ2VzLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIG9ubGluZTogQm9vbGVhbihvbmxpbmUpLFxuICAgICAgICB1cmdlbnQsXG4gICAgICB9O1xuXG4gICAgICBhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdtZXNzYWdlcycsXG4gICAgICAgIGh0dHBUeXBlOiAnUFVUJyxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYC8ke2Rlc3RpbmF0aW9ufWAsXG4gICAgICAgIGpzb25EYXRhLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvb2xlYW5Ub1N0cmluZyh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdmFsdWUgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHNlbmRXaXRoU2VuZGVyS2V5KFxuICAgICAgZGF0YTogVWludDhBcnJheSxcbiAgICAgIGFjY2Vzc0tleXM6IFVpbnQ4QXJyYXksXG4gICAgICB0aW1lc3RhbXA6IG51bWJlcixcbiAgICAgIHtcbiAgICAgICAgb25saW5lLFxuICAgICAgICB1cmdlbnQgPSB0cnVlLFxuICAgICAgfToge1xuICAgICAgICBvbmxpbmU/OiBib29sZWFuO1xuICAgICAgICB1cmdlbnQ/OiBib29sZWFuO1xuICAgICAgfVxuICAgICk6IFByb21pc2U8TXVsdGlSZWNpcGllbnQyMDBSZXNwb25zZVR5cGU+IHtcbiAgICAgIGNvbnN0IG9ubGluZVBhcmFtID0gYCZvbmxpbmU9JHtib29sZWFuVG9TdHJpbmcob25saW5lKX1gO1xuICAgICAgY29uc3QgdXJnZW50UGFyYW0gPSBgJnVyZ2VudD0ke2Jvb2xlYW5Ub1N0cmluZyh1cmdlbnQpfWA7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAnbXVsdGlSZWNpcGllbnQnLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vdm5kLnNpZ25hbC1tZXNzZW5nZXIubXJtJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgdXJsUGFyYW1ldGVyczogYD90cz0ke3RpbWVzdGFtcH0ke29ubGluZVBhcmFtfSR7dXJnZW50UGFyYW19YCxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICAgIHVuYXV0aGVudGljYXRlZDogdHJ1ZSxcbiAgICAgICAgYWNjZXNzS2V5OiBCeXRlcy50b0Jhc2U2NChhY2Nlc3NLZXlzKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcGFyc2VSZXN1bHQgPSBtdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlU2NoZW1hLnNhZmVQYXJzZShyZXNwb25zZSk7XG4gICAgICBpZiAocGFyc2VSZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gcGFyc2VSZXN1bHQuZGF0YTtcbiAgICAgIH1cblxuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdXZWJBUEk6IGludmFsaWQgcmVzcG9uc2UgZnJvbSBzZW5kV2l0aFNlbmRlcktleScsXG4gICAgICAgIHRvTG9nRm9ybWF0KHBhcnNlUmVzdWx0LmVycm9yKVxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXNwb25zZSBhcyBNdWx0aVJlY2lwaWVudDIwMFJlc3BvbnNlVHlwZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWRhY3RTdGlja2VyVXJsKHN0aWNrZXJVcmw6IHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0aWNrZXJVcmwucmVwbGFjZShcbiAgICAgICAgLyhcXC9zdGlja2Vyc1xcLykoW14vXSspKFxcLykvLFxuICAgICAgICAoXywgYmVnaW46IHN0cmluZywgcGFja0lkOiBzdHJpbmcsIGVuZDogc3RyaW5nKSA9PlxuICAgICAgICAgIGAke2JlZ2lufSR7cmVkYWN0UGFja0lkKHBhY2tJZCl9JHtlbmR9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRTdGlja2VyKHBhY2tJZDogc3RyaW5nLCBzdGlja2VySWQ6IG51bWJlcikge1xuICAgICAgaWYgKCFpc1BhY2tJZFZhbGlkKHBhY2tJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRTdGlja2VyOiBwYWNrIElEIHdhcyBpbnZhbGlkJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX291dGVyQWpheChcbiAgICAgICAgYCR7Y2RuVXJsT2JqZWN0WycwJ119L3N0aWNrZXJzLyR7cGFja0lkfS9mdWxsLyR7c3RpY2tlcklkfWAsXG4gICAgICAgIHtcbiAgICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgICBwcm94eVVybCxcbiAgICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgcmVkYWN0VXJsOiByZWRhY3RTdGlja2VyVXJsLFxuICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0U3RpY2tlclBhY2tNYW5pZmVzdChwYWNrSWQ6IHN0cmluZykge1xuICAgICAgaWYgKCFpc1BhY2tJZFZhbGlkKHBhY2tJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRTdGlja2VyUGFja01hbmlmZXN0OiBwYWNrIElEIHdhcyBpbnZhbGlkJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX291dGVyQWpheChcbiAgICAgICAgYCR7Y2RuVXJsT2JqZWN0WycwJ119L3N0aWNrZXJzLyR7cGFja0lkfS9tYW5pZmVzdC5wcm90b2AsXG4gICAgICAgIHtcbiAgICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgICBwcm94eVVybCxcbiAgICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgcmVkYWN0VXJsOiByZWRhY3RTdGlja2VyVXJsLFxuICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHlwZSBTZXJ2ZXJBdHRhY2htZW50VHlwZSA9IHtcbiAgICAgIGtleTogc3RyaW5nO1xuICAgICAgY3JlZGVudGlhbDogc3RyaW5nO1xuICAgICAgYWNsOiBzdHJpbmc7XG4gICAgICBhbGdvcml0aG06IHN0cmluZztcbiAgICAgIGRhdGU6IHN0cmluZztcbiAgICAgIHBvbGljeTogc3RyaW5nO1xuICAgICAgc2lnbmF0dXJlOiBzdHJpbmc7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG1ha2VQdXRQYXJhbXMoXG4gICAgICB7XG4gICAgICAgIGtleSxcbiAgICAgICAgY3JlZGVudGlhbCxcbiAgICAgICAgYWNsLFxuICAgICAgICBhbGdvcml0aG0sXG4gICAgICAgIGRhdGUsXG4gICAgICAgIHBvbGljeSxcbiAgICAgICAgc2lnbmF0dXJlLFxuICAgICAgfTogU2VydmVyQXR0YWNobWVudFR5cGUsXG4gICAgICBlbmNyeXB0ZWRCaW46IFVpbnQ4QXJyYXlcbiAgICApIHtcbiAgICAgIC8vIE5vdGU6IHdoZW4gdXNpbmcgdGhlIGJvdW5kYXJ5IHN0cmluZyBpbiB0aGUgUE9TVCBib2R5LCBpdCBuZWVkcyB0byBiZSBwcmVmaXhlZCBieVxuICAgICAgLy8gICBhbiBleHRyYSAtLSwgYW5kIHRoZSBmaW5hbCBib3VuZGFyeSBzdHJpbmcgYXQgdGhlIGVuZCBnZXRzIGEgLS0gcHJlZml4IGFuZCBhIC0tXG4gICAgICAvLyAgIHN1ZmZpeC5cbiAgICAgIGNvbnN0IGJvdW5kYXJ5U3RyaW5nID0gYC0tLS0tLS0tLS0tLS0tLS0ke2dldEd1aWQoKS5yZXBsYWNlKC8tL2csICcnKX1gO1xuICAgICAgY29uc3QgQ1JMRiA9ICdcXHJcXG4nO1xuICAgICAgY29uc3QgZ2V0U2VjdGlvbiA9IChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+XG4gICAgICAgIFtcbiAgICAgICAgICBgLS0ke2JvdW5kYXJ5U3RyaW5nfWAsXG4gICAgICAgICAgYENvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cIiR7bmFtZX1cIiR7Q1JMRn1gLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICBdLmpvaW4oQ1JMRik7XG5cbiAgICAgIGNvbnN0IHN0YXJ0ID0gW1xuICAgICAgICBnZXRTZWN0aW9uKCdrZXknLCBrZXkpLFxuICAgICAgICBnZXRTZWN0aW9uKCd4LWFtei1jcmVkZW50aWFsJywgY3JlZGVudGlhbCksXG4gICAgICAgIGdldFNlY3Rpb24oJ2FjbCcsIGFjbCksXG4gICAgICAgIGdldFNlY3Rpb24oJ3gtYW16LWFsZ29yaXRobScsIGFsZ29yaXRobSksXG4gICAgICAgIGdldFNlY3Rpb24oJ3gtYW16LWRhdGUnLCBkYXRlKSxcbiAgICAgICAgZ2V0U2VjdGlvbigncG9saWN5JywgcG9saWN5KSxcbiAgICAgICAgZ2V0U2VjdGlvbigneC1hbXotc2lnbmF0dXJlJywgc2lnbmF0dXJlKSxcbiAgICAgICAgZ2V0U2VjdGlvbignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpLFxuICAgICAgICBgLS0ke2JvdW5kYXJ5U3RyaW5nfWAsXG4gICAgICAgICdDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJmaWxlXCInLFxuICAgICAgICBgQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0ke0NSTEZ9JHtDUkxGfWAsXG4gICAgICBdLmpvaW4oQ1JMRik7XG4gICAgICBjb25zdCBlbmQgPSBgJHtDUkxGfS0tJHtib3VuZGFyeVN0cmluZ30tLSR7Q1JMRn1gO1xuXG4gICAgICBjb25zdCBzdGFydEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHN0YXJ0LCAndXRmOCcpO1xuICAgICAgY29uc3QgYXR0YWNobWVudEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGVuY3J5cHRlZEJpbik7XG4gICAgICBjb25zdCBlbmRCdWZmZXIgPSBCdWZmZXIuZnJvbShlbmQsICd1dGY4Jyk7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnRMZW5ndGggPVxuICAgICAgICBzdGFydEJ1ZmZlci5sZW5ndGggKyBhdHRhY2htZW50QnVmZmVyLmxlbmd0aCArIGVuZEJ1ZmZlci5sZW5ndGg7XG4gICAgICBjb25zdCBkYXRhID0gQnVmZmVyLmNvbmNhdChcbiAgICAgICAgW3N0YXJ0QnVmZmVyLCBhdHRhY2htZW50QnVmZmVyLCBlbmRCdWZmZXJdLFxuICAgICAgICBjb250ZW50TGVuZ3RoXG4gICAgICApO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhLFxuICAgICAgICBjb250ZW50VHlwZTogYG11bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PSR7Ym91bmRhcnlTdHJpbmd9YCxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IGNvbnRlbnRMZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcHV0U3RpY2tlcnMoXG4gICAgICBlbmNyeXB0ZWRNYW5pZmVzdDogVWludDhBcnJheSxcbiAgICAgIGVuY3J5cHRlZFN0aWNrZXJzOiBBcnJheTxVaW50OEFycmF5PixcbiAgICAgIG9uUHJvZ3Jlc3M/OiAoKSA9PiB2b2lkXG4gICAgKSB7XG4gICAgICAvLyBHZXQgbWFuaWZlc3QgYW5kIHN0aWNrZXIgdXBsb2FkIHBhcmFtZXRlcnNcbiAgICAgIGNvbnN0IHsgcGFja0lkLCBtYW5pZmVzdCwgc3RpY2tlcnMgfSA9IChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdnZXRTdGlja2VyUGFja1VwbG9hZCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6IGAvJHtlbmNyeXB0ZWRTdGlja2Vycy5sZW5ndGh9YCxcbiAgICAgIH0pKSBhcyB7XG4gICAgICAgIHBhY2tJZDogc3RyaW5nO1xuICAgICAgICBtYW5pZmVzdDogU2VydmVyQXR0YWNobWVudFR5cGU7XG4gICAgICAgIHN0aWNrZXJzOiBSZWFkb25seUFycmF5PFNlcnZlckF0dGFjaG1lbnRUeXBlPjtcbiAgICAgIH07XG5cbiAgICAgIC8vIFVwbG9hZCBtYW5pZmVzdFxuICAgICAgY29uc3QgbWFuaWZlc3RQYXJhbXMgPSBtYWtlUHV0UGFyYW1zKG1hbmlmZXN0LCBlbmNyeXB0ZWRNYW5pZmVzdCk7XG4gICAgICAvLyBUaGlzIGlzIGdvaW5nIHRvIHRoZSBDRE4sIG5vdCB0aGUgc2VydmljZSwgc28gd2UgdXNlIF9vdXRlckFqYXhcbiAgICAgIGF3YWl0IF9vdXRlckFqYXgoYCR7Y2RuVXJsT2JqZWN0WycwJ119L2AsIHtcbiAgICAgICAgLi4ubWFuaWZlc3RQYXJhbXMsXG4gICAgICAgIGNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICAgICAgICBwcm94eVVybCxcbiAgICAgICAgdGltZW91dDogMCxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFVwbG9hZCBzdGlja2Vyc1xuICAgICAgY29uc3QgcXVldWUgPSBuZXcgUFF1ZXVlKHtcbiAgICAgICAgY29uY3VycmVuY3k6IDMsXG4gICAgICAgIHRpbWVvdXQ6IGR1cmF0aW9ucy5NSU5VVEUgKiAzMCxcbiAgICAgICAgdGhyb3dPblRpbWVvdXQ6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBzdGlja2Vycy5tYXAoYXN5bmMgKHN0aWNrZXI6IFNlcnZlckF0dGFjaG1lbnRUeXBlLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RpY2tlclBhcmFtcyA9IG1ha2VQdXRQYXJhbXMoXG4gICAgICAgICAgICBzdGlja2VyLFxuICAgICAgICAgICAgZW5jcnlwdGVkU3RpY2tlcnNbaW5kZXhdXG4gICAgICAgICAgKTtcbiAgICAgICAgICBhd2FpdCBxdWV1ZS5hZGQoYXN5bmMgKCkgPT5cbiAgICAgICAgICAgIF9vdXRlckFqYXgoYCR7Y2RuVXJsT2JqZWN0WycwJ119L2AsIHtcbiAgICAgICAgICAgICAgLi4uc3RpY2tlclBhcmFtcyxcbiAgICAgICAgICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICAgICAgICAgIHByb3h5VXJsLFxuICAgICAgICAgICAgICB0aW1lb3V0OiAwLFxuICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKG9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICAvLyBEb25lIVxuICAgICAgcmV0dXJuIHBhY2tJZDtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRBdHRhY2htZW50KGNkbktleTogc3RyaW5nLCBjZG5OdW1iZXI/OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICAgICAgY29uc3QgY2RuVXJsID0gaXNOdW1iZXIoY2RuTnVtYmVyKVxuICAgICAgICA/IGNkblVybE9iamVjdFtjZG5OdW1iZXJdIHx8IGNkblVybE9iamVjdFsnMCddXG4gICAgICAgIDogY2RuVXJsT2JqZWN0WycwJ107XG4gICAgICAvLyBUaGlzIGlzIGdvaW5nIHRvIHRoZSBDRE4sIG5vdCB0aGUgc2VydmljZSwgc28gd2UgdXNlIF9vdXRlckFqYXhcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IF9vdXRlckFqYXgoYCR7Y2RuVXJsfS8ke2NkbktleX1gLCB7XG4gICAgICAgIGNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICAgICAgICBwcm94eVVybCxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnc3RyZWFtJyxcbiAgICAgICAgdGltZW91dDogMCxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHJlZGFjdFVybDogX2NyZWF0ZVJlZGFjdG9yKGNkbktleSksXG4gICAgICAgIHZlcnNpb24sXG4gICAgICAgIGFib3J0U2lnbmFsOiBhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBnZXRTdHJlYW1XaXRoVGltZW91dChzdHJlYW0sIHtcbiAgICAgICAgbmFtZTogYGdldEF0dGFjaG1lbnQoJHtjZG5LZXl9KWAsXG4gICAgICAgIHRpbWVvdXQ6IEdFVF9BVFRBQ0hNRU5UX0NIVU5LX1RJTUVPVVQsXG4gICAgICAgIGFib3J0Q29udHJvbGxlcixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHR5cGUgUHV0QXR0YWNobWVudFJlc3BvbnNlVHlwZSA9IFNlcnZlckF0dGFjaG1lbnRUeXBlICYge1xuICAgICAgYXR0YWNobWVudElkU3RyaW5nOiBzdHJpbmc7XG4gICAgfTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHB1dEF0dGFjaG1lbnQoZW5jcnlwdGVkQmluOiBVaW50OEFycmF5KSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IChhd2FpdCBfYWpheCh7XG4gICAgICAgIGNhbGw6ICdhdHRhY2htZW50SWQnLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgfSkpIGFzIFB1dEF0dGFjaG1lbnRSZXNwb25zZVR5cGU7XG5cbiAgICAgIGNvbnN0IHsgYXR0YWNobWVudElkU3RyaW5nIH0gPSByZXNwb25zZTtcblxuICAgICAgY29uc3QgcGFyYW1zID0gbWFrZVB1dFBhcmFtcyhyZXNwb25zZSwgZW5jcnlwdGVkQmluKTtcblxuICAgICAgLy8gVGhpcyBpcyBnb2luZyB0byB0aGUgQ0ROLCBub3QgdGhlIHNlcnZpY2UsIHNvIHdlIHVzZSBfb3V0ZXJBamF4XG4gICAgICBhd2FpdCBfb3V0ZXJBamF4KGAke2NkblVybE9iamVjdFsnMCddfS9gLCB7XG4gICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgY2VydGlmaWNhdGVBdXRob3JpdHksXG4gICAgICAgIHByb3h5VXJsLFxuICAgICAgICB0aW1lb3V0OiAwLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHZlcnNpb24sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGF0dGFjaG1lbnRJZFN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIZWFkZXJQYWRkaW5nKCkge1xuICAgICAgY29uc3QgbWF4ID0gZ2V0UmFuZG9tVmFsdWUoMSwgNjQpO1xuICAgICAgbGV0IGNoYXJhY3RlcnMgPSAnJztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgICBjaGFyYWN0ZXJzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZ2V0UmFuZG9tVmFsdWUoNjUsIDEyMikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hhcmFjdGVycztcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBmZXRjaExpbmtQcmV2aWV3TWV0YWRhdGEoXG4gICAgICBocmVmOiBzdHJpbmcsXG4gICAgICBhYm9ydFNpZ25hbDogQWJvcnRTaWduYWxcbiAgICApIHtcbiAgICAgIHJldHVybiBsaW5rUHJldmlld0ZldGNoLmZldGNoTGlua1ByZXZpZXdNZXRhZGF0YShcbiAgICAgICAgZmV0Y2hGb3JMaW5rUHJldmlld3MsXG4gICAgICAgIGhyZWYsXG4gICAgICAgIGFib3J0U2lnbmFsXG4gICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoTGlua1ByZXZpZXdJbWFnZShcbiAgICAgIGhyZWY6IHN0cmluZyxcbiAgICAgIGFib3J0U2lnbmFsOiBBYm9ydFNpZ25hbFxuICAgICkge1xuICAgICAgcmV0dXJuIGxpbmtQcmV2aWV3RmV0Y2guZmV0Y2hMaW5rUHJldmlld0ltYWdlKFxuICAgICAgICBmZXRjaEZvckxpbmtQcmV2aWV3cyxcbiAgICAgICAgaHJlZixcbiAgICAgICAgYWJvcnRTaWduYWxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gbWFrZVByb3hpZWRSZXF1ZXN0KFxuICAgICAgdGFyZ2V0VXJsOiBzdHJpbmcsXG4gICAgICBvcHRpb25zOiBQcm94aWVkUmVxdWVzdE9wdGlvbnNUeXBlID0ge31cbiAgICApOiBQcm9taXNlPE1ha2VQcm94aWVkUmVxdWVzdFJlc3VsdFR5cGU+IHtcbiAgICAgIGNvbnN0IHsgcmV0dXJuVWludDhBcnJheSwgc3RhcnQsIGVuZCB9ID0gb3B0aW9ucztcbiAgICAgIGNvbnN0IGhlYWRlcnM6IEhlYWRlckxpc3RUeXBlID0ge1xuICAgICAgICAnWC1TaWduYWxQYWRkaW5nJzogZ2V0SGVhZGVyUGFkZGluZygpLFxuICAgICAgfTtcblxuICAgICAgaWYgKGlzLm51bWJlcihzdGFydCkgJiYgaXMubnVtYmVyKGVuZCkpIHtcbiAgICAgICAgaGVhZGVycy5SYW5nZSA9IGBieXRlcz0ke3N0YXJ0fS0ke2VuZH1gO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBfb3V0ZXJBamF4KHRhcmdldFVybCwge1xuICAgICAgICByZXNwb25zZVR5cGU6IHJldHVyblVpbnQ4QXJyYXkgPyAnYnl0ZXN3aXRoZGV0YWlscycgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb3h5VXJsOiBjb250ZW50UHJveHlVcmwsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICByZWRpcmVjdDogJ2ZvbGxvdycsXG4gICAgICAgIHJlZGFjdFVybDogKCkgPT4gJ1tSRURBQ1RFRF9VUkxdJyxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXJldHVyblVpbnQ4QXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBVaW50OEFycmF5O1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IHJlc3BvbnNlIH0gPSByZXN1bHQgYXMgQnl0ZXNXaXRoRGV0YWlsc1R5cGU7XG4gICAgICBpZiAoIXJlc3BvbnNlLmhlYWRlcnMgfHwgIXJlc3BvbnNlLmhlYWRlcnMuZ2V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFrZVByb3hpZWRSZXF1ZXN0OiBQcm9ibGVtIHJldHJpZXZpbmcgaGVhZGVyIHZhbHVlJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJhbmdlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtcmFuZ2UnKTtcbiAgICAgIGNvbnN0IG1hdGNoID0gUEFSU0VfUkFOR0VfSEVBREVSLmV4ZWMocmFuZ2UgfHwgJycpO1xuXG4gICAgICBpZiAoIW1hdGNoIHx8ICFtYXRjaFsxXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYG1ha2VQcm94aWVkUmVxdWVzdDogVW5hYmxlIHRvIHBhcnNlIHRvdGFsIHNpemUgZnJvbSAke3JhbmdlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG90YWxTaXplID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG90YWxTaXplLFxuICAgICAgICByZXN1bHQ6IHJlc3VsdCBhcyBCeXRlc1dpdGhEZXRhaWxzVHlwZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gbWFrZVNmdVJlcXVlc3QoXG4gICAgICB0YXJnZXRVcmw6IHN0cmluZyxcbiAgICAgIHR5cGU6IEhUVFBDb2RlVHlwZSxcbiAgICAgIGhlYWRlcnM6IEhlYWRlckxpc3RUeXBlLFxuICAgICAgYm9keTogVWludDhBcnJheSB8IHVuZGVmaW5lZFxuICAgICk6IFByb21pc2U8Qnl0ZXNXaXRoRGV0YWlsc1R5cGU+IHtcbiAgICAgIHJldHVybiBfb3V0ZXJBamF4KHRhcmdldFVybCwge1xuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgZGF0YTogYm9keSxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzd2l0aGRldGFpbHMnLFxuICAgICAgICB0aW1lb3V0OiAwLFxuICAgICAgICB0eXBlLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR3JvdXBzXG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUdyb3VwQXV0aChcbiAgICAgIGdyb3VwUHVibGljUGFyYW1zSGV4OiBzdHJpbmcsXG4gICAgICBhdXRoQ3JlZGVudGlhbFByZXNlbnRhdGlvbkhleDogc3RyaW5nXG4gICAgKSB7XG4gICAgICByZXR1cm4gQnl0ZXMudG9CYXNlNjQoXG4gICAgICAgIEJ5dGVzLmZyb21TdHJpbmcoXG4gICAgICAgICAgYCR7Z3JvdXBQdWJsaWNQYXJhbXNIZXh9OiR7YXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXh9YFxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHR5cGUgQ3JlZGVudGlhbFJlc3BvbnNlVHlwZSA9IHtcbiAgICAgIGNyZWRlbnRpYWxzOiBBcnJheTxHcm91cENyZWRlbnRpYWxUeXBlPjtcbiAgICB9O1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0R3JvdXBDcmVkZW50aWFscyh7XG4gICAgICBzdGFydERheUluTXMsXG4gICAgICBlbmREYXlJbk1zLFxuICAgIH06IEdldEdyb3VwQ3JlZGVudGlhbHNPcHRpb25zVHlwZSk6IFByb21pc2U8R2V0R3JvdXBDcmVkZW50aWFsc1Jlc3VsdFR5cGU+IHtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5SW5TZWNvbmRzID0gc3RhcnREYXlJbk1zIC8gZHVyYXRpb25zLlNFQ09ORDtcbiAgICAgIGNvbnN0IGVuZERheUluU2Vjb25kcyA9IGVuZERheUluTXMgLyBkdXJhdGlvbnMuU0VDT05EO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSAoYXdhaXQgX2FqYXgoe1xuICAgICAgICBjYWxsOiAnZ2V0R3JvdXBDcmVkZW50aWFscycsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6XG4gICAgICAgICAgYD9yZWRlbXB0aW9uU3RhcnRTZWNvbmRzPSR7c3RhcnREYXlJblNlY29uZHN9JmAgK1xuICAgICAgICAgIGByZWRlbXB0aW9uRW5kU2Vjb25kcz0ke2VuZERheUluU2Vjb25kc31gLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICAgICAgfSkpIGFzIENyZWRlbnRpYWxSZXNwb25zZVR5cGU7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRHcm91cEV4dGVybmFsQ3JlZGVudGlhbChcbiAgICAgIG9wdGlvbnM6IEdyb3VwQ3JlZGVudGlhbHNUeXBlXG4gICAgKTogUHJvbWlzZTxQcm90by5Hcm91cEV4dGVybmFsQ3JlZGVudGlhbD4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIG9wdGlvbnMuZ3JvdXBQdWJsaWNQYXJhbXNIZXgsXG4gICAgICAgIG9wdGlvbnMuYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXhcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBiYXNpY0F1dGgsXG4gICAgICAgIGNhbGw6ICdncm91cFRva2VuJyxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtcHJvdG9idWYnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgIGhvc3Q6IHN0b3JhZ2VVcmwsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb3RvLkdyb3VwRXh0ZXJuYWxDcmVkZW50aWFsLmRlY29kZShyZXNwb25zZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmVyaWZ5QXR0cmlidXRlcyhhdHRyaWJ1dGVzOiBQcm90by5JQXZhdGFyVXBsb2FkQXR0cmlidXRlcykge1xuICAgICAgY29uc3QgeyBrZXksIGNyZWRlbnRpYWwsIGFjbCwgYWxnb3JpdGhtLCBkYXRlLCBwb2xpY3ksIHNpZ25hdHVyZSB9ID1cbiAgICAgICAgYXR0cmlidXRlcztcblxuICAgICAgaWYgKFxuICAgICAgICAha2V5IHx8XG4gICAgICAgICFjcmVkZW50aWFsIHx8XG4gICAgICAgICFhY2wgfHxcbiAgICAgICAgIWFsZ29yaXRobSB8fFxuICAgICAgICAhZGF0ZSB8fFxuICAgICAgICAhcG9saWN5IHx8XG4gICAgICAgICFzaWduYXR1cmVcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ3ZlcmlmeUF0dHJpYnV0ZXM6IE1pc3NpbmcgdmFsdWUgZnJvbSBBdmF0YXJVcGxvYWRBdHRyaWJ1dGVzJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXksXG4gICAgICAgIGNyZWRlbnRpYWwsXG4gICAgICAgIGFjbCxcbiAgICAgICAgYWxnb3JpdGhtLFxuICAgICAgICBkYXRlLFxuICAgICAgICBwb2xpY3ksXG4gICAgICAgIHNpZ25hdHVyZSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBsb2FkQXZhdGFyKFxuICAgICAgdXBsb2FkQXZhdGFyUmVxdWVzdEhlYWRlcnM6IFVwbG9hZEF2YXRhckhlYWRlcnNUeXBlLFxuICAgICAgYXZhdGFyRGF0YTogVWludDhBcnJheVxuICAgICk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICBjb25zdCB2ZXJpZmllZCA9IHZlcmlmeUF0dHJpYnV0ZXModXBsb2FkQXZhdGFyUmVxdWVzdEhlYWRlcnMpO1xuICAgICAgY29uc3QgeyBrZXkgfSA9IHZlcmlmaWVkO1xuXG4gICAgICBjb25zdCBtYW5pZmVzdFBhcmFtcyA9IG1ha2VQdXRQYXJhbXModmVyaWZpZWQsIGF2YXRhckRhdGEpO1xuXG4gICAgICBhd2FpdCBfb3V0ZXJBamF4KGAke2NkblVybE9iamVjdFsnMCddfS9gLCB7XG4gICAgICAgIC4uLm1hbmlmZXN0UGFyYW1zLFxuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHRpbWVvdXQ6IDAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwbG9hZEdyb3VwQXZhdGFyKFxuICAgICAgYXZhdGFyRGF0YTogVWludDhBcnJheSxcbiAgICAgIG9wdGlvbnM6IEdyb3VwQ3JlZGVudGlhbHNUeXBlXG4gICAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgIGNvbnN0IGJhc2ljQXV0aCA9IGdlbmVyYXRlR3JvdXBBdXRoKFxuICAgICAgICBvcHRpb25zLmdyb3VwUHVibGljUGFyYW1zSGV4LFxuICAgICAgICBvcHRpb25zLmF1dGhDcmVkZW50aWFsUHJlc2VudGF0aW9uSGV4XG4gICAgICApO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IF9hamF4KHtcbiAgICAgICAgYmFzaWNBdXRoLFxuICAgICAgICBjYWxsOiAnZ2V0R3JvdXBBdmF0YXJVcGxvYWQnLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzJyxcbiAgICAgICAgaG9zdDogc3RvcmFnZVVybCxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IFByb3RvLkF2YXRhclVwbG9hZEF0dHJpYnV0ZXMuZGVjb2RlKHJlc3BvbnNlKTtcblxuICAgICAgY29uc3QgdmVyaWZpZWQgPSB2ZXJpZnlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgY29uc3QgeyBrZXkgfSA9IHZlcmlmaWVkO1xuXG4gICAgICBjb25zdCBtYW5pZmVzdFBhcmFtcyA9IG1ha2VQdXRQYXJhbXModmVyaWZpZWQsIGF2YXRhckRhdGEpO1xuXG4gICAgICBhd2FpdCBfb3V0ZXJBamF4KGAke2NkblVybE9iamVjdFsnMCddfS9gLCB7XG4gICAgICAgIC4uLm1hbmlmZXN0UGFyYW1zLFxuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHRpbWVvdXQ6IDAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdmVyc2lvbixcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldEdyb3VwQXZhdGFyKGtleTogc3RyaW5nKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgICByZXR1cm4gX291dGVyQWpheChgJHtjZG5VcmxPYmplY3RbJzAnXX0vJHtrZXl9YCwge1xuICAgICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eSxcbiAgICAgICAgcHJveHlVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzJyxcbiAgICAgICAgdGltZW91dDogMCxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHZlcnNpb24sXG4gICAgICAgIHJlZGFjdFVybDogX2NyZWF0ZVJlZGFjdG9yKGtleSksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVHcm91cChcbiAgICAgIGdyb3VwOiBQcm90by5JR3JvdXAsXG4gICAgICBvcHRpb25zOiBHcm91cENyZWRlbnRpYWxzVHlwZVxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIG9wdGlvbnMuZ3JvdXBQdWJsaWNQYXJhbXNIZXgsXG4gICAgICAgIG9wdGlvbnMuYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBkYXRhID0gUHJvdG8uR3JvdXAuZW5jb2RlKGdyb3VwKS5maW5pc2goKTtcblxuICAgICAgYXdhaXQgX2FqYXgoe1xuICAgICAgICBiYXNpY0F1dGgsXG4gICAgICAgIGNhbGw6ICdncm91cHMnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtcHJvdG9idWYnLFxuICAgICAgICBkYXRhLFxuICAgICAgICBob3N0OiBzdG9yYWdlVXJsLFxuICAgICAgICBodHRwVHlwZTogJ1BVVCcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRHcm91cChcbiAgICAgIG9wdGlvbnM6IEdyb3VwQ3JlZGVudGlhbHNUeXBlXG4gICAgKTogUHJvbWlzZTxQcm90by5Hcm91cD4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIG9wdGlvbnMuZ3JvdXBQdWJsaWNQYXJhbXNIZXgsXG4gICAgICAgIG9wdGlvbnMuYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXhcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBiYXNpY0F1dGgsXG4gICAgICAgIGNhbGw6ICdncm91cHMnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtcHJvdG9idWYnLFxuICAgICAgICBob3N0OiBzdG9yYWdlVXJsLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ2J5dGVzJyxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gUHJvdG8uR3JvdXAuZGVjb2RlKHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRHcm91cEZyb21MaW5rKFxuICAgICAgaW52aXRlTGlua1Bhc3N3b3JkOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgICBhdXRoOiBHcm91cENyZWRlbnRpYWxzVHlwZVxuICAgICk6IFByb21pc2U8UHJvdG8uR3JvdXBKb2luSW5mbz4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIGF1dGguZ3JvdXBQdWJsaWNQYXJhbXNIZXgsXG4gICAgICAgIGF1dGguYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBzYWZlSW52aXRlTGlua1Bhc3N3b3JkID0gaW52aXRlTGlua1Bhc3N3b3JkXG4gICAgICAgID8gdG9XZWJTYWZlQmFzZTY0KGludml0ZUxpbmtQYXNzd29yZClcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBiYXNpY0F1dGgsXG4gICAgICAgIGNhbGw6ICdncm91cHNWaWFMaW5rJyxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXByb3RvYnVmJyxcbiAgICAgICAgaG9zdDogc3RvcmFnZVVybCxcbiAgICAgICAgaHR0cFR5cGU6ICdHRVQnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6IHNhZmVJbnZpdGVMaW5rUGFzc3dvcmRcbiAgICAgICAgICA/IGAke3NhZmVJbnZpdGVMaW5rUGFzc3dvcmR9YFxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICByZWRhY3RVcmw6IF9jcmVhdGVSZWRhY3RvcihzYWZlSW52aXRlTGlua1Bhc3N3b3JkKSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gUHJvdG8uR3JvdXBKb2luSW5mby5kZWNvZGUocmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIG1vZGlmeUdyb3VwKFxuICAgICAgY2hhbmdlczogUHJvdG8uR3JvdXBDaGFuZ2UuSUFjdGlvbnMsXG4gICAgICBvcHRpb25zOiBHcm91cENyZWRlbnRpYWxzVHlwZSxcbiAgICAgIGludml0ZUxpbmtCYXNlNjQ/OiBzdHJpbmdcbiAgICApOiBQcm9taXNlPFByb3RvLklHcm91cENoYW5nZT4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIG9wdGlvbnMuZ3JvdXBQdWJsaWNQYXJhbXNIZXgsXG4gICAgICAgIG9wdGlvbnMuYXV0aENyZWRlbnRpYWxQcmVzZW50YXRpb25IZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBkYXRhID0gUHJvdG8uR3JvdXBDaGFuZ2UuQWN0aW9ucy5lbmNvZGUoY2hhbmdlcykuZmluaXNoKCk7XG4gICAgICBjb25zdCBzYWZlSW52aXRlTGlua1Bhc3N3b3JkID0gaW52aXRlTGlua0Jhc2U2NFxuICAgICAgICA/IHRvV2ViU2FmZUJhc2U2NChpbnZpdGVMaW5rQmFzZTY0KVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBfYWpheCh7XG4gICAgICAgIGJhc2ljQXV0aCxcbiAgICAgICAgY2FsbDogJ2dyb3VwcycsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1wcm90b2J1ZicsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGhvc3Q6IHN0b3JhZ2VVcmwsXG4gICAgICAgIGh0dHBUeXBlOiAnUEFUQ0gnLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlcycsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6IHNhZmVJbnZpdGVMaW5rUGFzc3dvcmRcbiAgICAgICAgICA/IGA/aW52aXRlTGlua1Bhc3N3b3JkPSR7c2FmZUludml0ZUxpbmtQYXNzd29yZH1gXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIHJlZGFjdFVybDogc2FmZUludml0ZUxpbmtQYXNzd29yZFxuICAgICAgICAgID8gX2NyZWF0ZVJlZGFjdG9yKHNhZmVJbnZpdGVMaW5rUGFzc3dvcmQpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb3RvLkdyb3VwQ2hhbmdlLmRlY29kZShyZXNwb25zZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0R3JvdXBMb2coXG4gICAgICBvcHRpb25zOiBHZXRHcm91cExvZ09wdGlvbnNUeXBlLFxuICAgICAgY3JlZGVudGlhbHM6IEdyb3VwQ3JlZGVudGlhbHNUeXBlXG4gICAgKTogUHJvbWlzZTxHcm91cExvZ1Jlc3BvbnNlVHlwZT4ge1xuICAgICAgY29uc3QgYmFzaWNBdXRoID0gZ2VuZXJhdGVHcm91cEF1dGgoXG4gICAgICAgIGNyZWRlbnRpYWxzLmdyb3VwUHVibGljUGFyYW1zSGV4LFxuICAgICAgICBjcmVkZW50aWFscy5hdXRoQ3JlZGVudGlhbFByZXNlbnRhdGlvbkhleFxuICAgICAgKTtcblxuICAgICAgY29uc3Qge1xuICAgICAgICBzdGFydFZlcnNpb24sXG4gICAgICAgIGluY2x1ZGVGaXJzdFN0YXRlLFxuICAgICAgICBpbmNsdWRlTGFzdFN0YXRlLFxuICAgICAgICBtYXhTdXBwb3J0ZWRDaGFuZ2VFcG9jaCxcbiAgICAgIH0gPSBvcHRpb25zO1xuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBrbm93IHN0YXJ0aW5nIHJldmlzaW9uIC0gZmV0Y2ggaXQgZnJvbSB0aGUgc2VydmVyXG4gICAgICBpZiAoc3RhcnRWZXJzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgeyBkYXRhOiBqb2luZWREYXRhIH0gPSBhd2FpdCBfYWpheCh7XG4gICAgICAgICAgYmFzaWNBdXRoLFxuICAgICAgICAgIGNhbGw6ICdncm91cEpvaW5lZEF0VmVyc2lvbicsXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LXByb3RvYnVmJyxcbiAgICAgICAgICBob3N0OiBzdG9yYWdlVXJsLFxuICAgICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgICByZXNwb25zZVR5cGU6ICdieXRlc3dpdGhkZXRhaWxzJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgeyBqb2luZWRBdFZlcnNpb24gfSA9IFByb3RvLk1lbWJlci5kZWNvZGUoam9pbmVkRGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIGdldEdyb3VwTG9nKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBzdGFydFZlcnNpb246IGpvaW5lZEF0VmVyc2lvbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdpdGhEZXRhaWxzID0gYXdhaXQgX2FqYXgoe1xuICAgICAgICBiYXNpY0F1dGgsXG4gICAgICAgIGNhbGw6ICdncm91cExvZycsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1wcm90b2J1ZicsXG4gICAgICAgIGhvc3Q6IHN0b3JhZ2VVcmwsXG4gICAgICAgIGh0dHBUeXBlOiAnR0VUJyxcbiAgICAgICAgcmVzcG9uc2VUeXBlOiAnYnl0ZXN3aXRoZGV0YWlscycsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6XG4gICAgICAgICAgYC8ke3N0YXJ0VmVyc2lvbn0/YCArXG4gICAgICAgICAgYGluY2x1ZGVGaXJzdFN0YXRlPSR7Qm9vbGVhbihpbmNsdWRlRmlyc3RTdGF0ZSl9JmAgK1xuICAgICAgICAgIGBpbmNsdWRlTGFzdFN0YXRlPSR7Qm9vbGVhbihpbmNsdWRlTGFzdFN0YXRlKX0mYCArXG4gICAgICAgICAgYG1heFN1cHBvcnRlZENoYW5nZUVwb2NoPSR7TnVtYmVyKG1heFN1cHBvcnRlZENoYW5nZUVwb2NoKX1gLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB7IGRhdGEsIHJlc3BvbnNlIH0gPSB3aXRoRGV0YWlscztcbiAgICAgIGNvbnN0IGNoYW5nZXMgPSBQcm90by5Hcm91cENoYW5nZXMuZGVjb2RlKGRhdGEpO1xuXG4gICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDYpIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1SYW5nZScpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IFBBUlNFX0dST1VQX0xPR19SQU5HRV9IRUFERVIuZXhlYyhyYW5nZSB8fCAnJyk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnQgPSBtYXRjaCA/IHBhcnNlSW50KG1hdGNoWzFdLCAxMCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGVuZCA9IG1hdGNoID8gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgY3VycmVudFJldmlzaW9uID0gbWF0Y2ggPyBwYXJzZUludChtYXRjaFszXSwgMTApIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBtYXRjaCAmJlxuICAgICAgICAgIGlzLm51bWJlcihzdGFydCkgJiZcbiAgICAgICAgICBpcy5udW1iZXIoZW5kKSAmJlxuICAgICAgICAgIGlzLm51bWJlcihjdXJyZW50UmV2aXNpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFuZ2VzLFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBlbmQsXG4gICAgICAgICAgICBjdXJyZW50UmV2aXNpb24sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VzLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRIYXNTdWJzY3JpcHRpb24oXG4gICAgICBzdWJzY3JpYmVySWQ6IFVpbnQ4QXJyYXlcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZElkID0gdG9XZWJTYWZlQmFzZTY0KEJ5dGVzLnRvQmFzZTY0KHN1YnNjcmliZXJJZCkpO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9hamF4KHtcbiAgICAgICAgY2FsbDogJ3N1YnNjcmlwdGlvbnMnLFxuICAgICAgICBodHRwVHlwZTogJ0dFVCcsXG4gICAgICAgIHVybFBhcmFtZXRlcnM6IGAvJHtmb3JtYXR0ZWRJZH1gLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgICAgICAgdW5hdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICBhY2Nlc3NLZXk6IHVuZGVmaW5lZCxcbiAgICAgICAgcmVkYWN0VXJsOiBfY3JlYXRlUmVkYWN0b3IoZm9ybWF0dGVkSWQpLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIGlzUmVjb3JkKGRhdGEpICYmXG4gICAgICAgIGlzUmVjb3JkKGRhdGEuc3Vic2NyaXB0aW9uKSAmJlxuICAgICAgICBCb29sZWFuKGRhdGEuc3Vic2NyaXB0aW9uLmFjdGl2ZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlzaW9uaW5nUmVzb3VyY2UoXG4gICAgICBoYW5kbGVyOiBJUmVxdWVzdEhhbmRsZXJcbiAgICApOiBQcm9taXNlPFdlYlNvY2tldFJlc291cmNlPiB7XG4gICAgICByZXR1cm4gc29ja2V0TWFuYWdlci5nZXRQcm92aXNpb25pbmdSZXNvdXJjZShoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBnZXRVdWlkc0ZvckUxNjRzKFxuICAgICAgZTE2NHM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPlxuICAgICk6IFByb21pc2U8RGljdGlvbmFyeTxVVUlEU3RyaW5nVHlwZSB8IG51bGw+PiB7XG4gICAgICBjb25zdCBtYXAgPSBhd2FpdCBjZHMucmVxdWVzdCh7XG4gICAgICAgIGUxNjRzLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdDogRGljdGlvbmFyeTxVVUlEU3RyaW5nVHlwZSB8IG51bGw+ID0ge307XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBtYXApIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZS5wbmkgPz8gdmFsdWUuYWNpID8/IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldFV1aWRzRm9yRTE2NHNWMih7XG4gICAgICBlMTY0cyxcbiAgICAgIGFjaXMsXG4gICAgICBhY2Nlc3NLZXlzLFxuICAgIH06IEdldFV1aWRzRm9yRTE2NHNWMk9wdGlvbnNUeXBlKTogUHJvbWlzZTxDRFNSZXNwb25zZVR5cGU+IHtcbiAgICAgIHJldHVybiBjZHMucmVxdWVzdCh7XG4gICAgICAgIGUxNjRzLFxuICAgICAgICBhY2lzLFxuICAgICAgICBhY2Nlc3NLZXlzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUEsOEJBQTRCO0FBRTVCLHdCQUFrQjtBQUNsQix5QkFBdUI7QUFDdkIsbUJBQXNCO0FBRXRCLG9CQUF1QztBQUN2QyxnQkFBZTtBQUNmLHFCQUFtQjtBQUNuQixrQkFBOEI7QUFDOUIsaUJBQWtCO0FBR2xCLG9CQUFxQztBQUNyQyxzQkFBeUI7QUFDekIsZ0JBQTJCO0FBRTNCLDRCQUErQjtBQUMvQiwwQkFBNkI7QUFDN0Isa0NBQXFDO0FBQ3JDLDJCQUEyQztBQUMzQywyQkFBZ0M7QUFDaEMsMEJBQTZCO0FBRTdCLG9CQUE0QjtBQUM1QixzQkFBNEM7QUFFNUMsa0JBQXlCO0FBQ3pCLFlBQXVCO0FBQ3ZCLG9CQUErQjtBQUMvQix1QkFBa0M7QUFDbEMsc0NBQXlDO0FBRXpDLDJCQUE4QjtBQUc5Qix1QkFBMEI7QUFFMUIsa0JBQXFCO0FBQ3JCLGtCQUFxQjtBQUVyQixzQkFBdUM7QUFFdkMsb0JBQTBCO0FBUTFCLG1CQUFpRDtBQUNqRCxVQUFxQjtBQUNyQixpQkFBOEI7QUFLOUIsTUFBTSxRQUFRO0FBRWQsNEJBQ0ssV0FDUTtBQUlYLFFBQU0sbUJBQW1CLFVBQVUsT0FBTyxP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
