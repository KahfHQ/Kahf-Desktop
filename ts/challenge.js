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
var challenge_exports = {};
__export(challenge_exports, {
  ChallengeHandler: () => ChallengeHandler,
  STORAGE_KEY: () => STORAGE_KEY,
  getChallengeURL: () => getChallengeURL
});
module.exports = __toCommonJS(challenge_exports);
var import_assert = require("./util/assert");
var import_timestamp = require("./util/timestamp");
var import_parseRetryAfter = require("./util/parseRetryAfter");
var import_clearTimeoutIfNecessary = require("./util/clearTimeoutIfNecessary");
var import_environment = require("./environment");
var import_Errors = require("./textsecure/Errors");
var log = __toESM(require("./logging/log"));
const STORAGE_KEY = "challenge:conversations";
const DEFAULT_EXPIRE_AFTER = 24 * 3600 * 1e3;
const CAPTCHA_URL = "https://signalcaptchas.org/challenge/generate.html";
const CAPTCHA_STAGING_URL = "https://signalcaptchas.org/staging/challenge/generate.html";
function shouldStartQueue(registered) {
  if (!registered.retryAt) {
    return false;
  }
  if (registered.retryAt <= Date.now()) {
    return true;
  }
  return false;
}
function getChallengeURL() {
  if ((0, import_environment.getEnvironment)() === import_environment.Environment.Staging) {
    return CAPTCHA_STAGING_URL;
  }
  return CAPTCHA_URL;
}
class ChallengeHandler {
  constructor(options) {
    this.options = options;
    this.solving = 0;
    this.isLoaded = false;
    this.seq = 0;
    this.isOnline = false;
    this.responseHandlers = /* @__PURE__ */ new Map();
    this.registeredConversations = /* @__PURE__ */ new Map();
    this.startTimers = /* @__PURE__ */ new Map();
    this.pendingStarts = /* @__PURE__ */ new Set();
  }
  async load() {
    if (this.isLoaded) {
      return;
    }
    this.isLoaded = true;
    const challenges = this.options.storage.get(STORAGE_KEY) || [];
    log.info(`challenge: loading ${challenges.length} challenges`);
    await Promise.all(challenges.map(async (challenge) => {
      const expireAfter = this.options.expireAfter || DEFAULT_EXPIRE_AFTER;
      if ((0, import_timestamp.isOlderThan)(challenge.createdAt, expireAfter)) {
        log.info(`challenge: expired challenge for conversation ${challenge.conversationId}`);
        return;
      }
      await this.register(challenge);
    }));
  }
  async onOffline() {
    this.isOnline = false;
    log.info("challenge: offline");
  }
  async onOnline() {
    this.isOnline = true;
    const pending = Array.from(this.pendingStarts.values());
    this.pendingStarts.clear();
    log.info(`challenge: online, starting ${pending.length} queues`);
    await Promise.all(pending.map((conversationId) => this.startQueue(conversationId)));
    await this.startAllQueues();
  }
  maybeSolve(conversationId) {
    const challenge = this.registeredConversations.get(conversationId);
    if (!challenge) {
      return;
    }
    if (this.solving > 0) {
      return;
    }
    if (challenge.token) {
      this.solve(challenge.token);
    }
  }
  async register(challenge, data) {
    const { conversationId } = challenge;
    if (this.isRegistered(conversationId)) {
      log.info(`challenge: conversation ${conversationId}  already registered`);
      return;
    }
    this.registeredConversations.set(conversationId, challenge);
    await this.persist();
    if (shouldStartQueue(challenge)) {
      log.info(`challenge: starting conversation ${conversationId} immediately`);
      await this.startQueue(conversationId);
      return;
    }
    if (challenge.retryAt) {
      const waitTime = Math.max(0, challenge.retryAt - Date.now());
      const oldTimer = this.startTimers.get(conversationId);
      if (oldTimer) {
        (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(oldTimer);
      }
      this.startTimers.set(conversationId, setTimeout(() => {
        this.startTimers.delete(conversationId);
        this.startQueue(conversationId);
      }, waitTime));
      log.info(`challenge: tracking ${conversationId} with waitTime=${waitTime}`);
    } else {
      log.info(`challenge: tracking ${conversationId} with no waitTime`);
    }
    if (data && !data.options?.includes("recaptcha")) {
      log.error(`challenge: unexpected options ${JSON.stringify(data.options)}`);
    }
    if (!challenge.token) {
      const dataString = JSON.stringify(data);
      log.error(`challenge: ${conversationId} is waiting; no token in data ${dataString}`);
      return;
    }
    this.solve(challenge.token);
  }
  onResponse(response) {
    const handler = this.responseHandlers.get(response.seq);
    if (!handler) {
      return;
    }
    this.responseHandlers.delete(response.seq);
    handler.resolve(response.data);
  }
  async unregister(conversationId) {
    log.info(`challenge: unregistered conversation ${conversationId}`);
    this.registeredConversations.delete(conversationId);
    this.pendingStarts.delete(conversationId);
    const timer = this.startTimers.get(conversationId);
    this.startTimers.delete(conversationId);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timer);
    await this.persist();
  }
  async requestCaptcha(token = "") {
    const request = { seq: this.seq };
    this.seq += 1;
    this.options.requestChallenge(request);
    const response = await new Promise((resolve, reject) => {
      this.responseHandlers.set(request.seq, { token, resolve, reject });
    });
    return response.captcha;
  }
  async persist() {
    (0, import_assert.assert)(this.isLoaded, "ChallengeHandler has to be loaded before persisting new data");
    await this.options.storage.put(STORAGE_KEY, Array.from(this.registeredConversations.values()));
  }
  isRegistered(conversationId) {
    return this.registeredConversations.has(conversationId);
  }
  startAllQueues({
    force = false
  } = {}) {
    log.info(`challenge: startAllQueues force=${force}`);
    Array.from(this.registeredConversations.values()).filter((challenge) => force || shouldStartQueue(challenge)).forEach((challenge) => this.startQueue(challenge.conversationId));
  }
  async startQueue(conversationId) {
    if (!this.isOnline) {
      this.pendingStarts.add(conversationId);
      return;
    }
    await this.unregister(conversationId);
    if (this.registeredConversations.size === 0) {
      this.options.setChallengeStatus("idle");
    }
    log.info(`startQueue: starting queue ${conversationId}`);
    this.options.startQueue(conversationId);
  }
  async solve(token) {
    this.solving += 1;
    this.options.setChallengeStatus("required");
    this.challengeToken = token;
    const captcha = await this.requestCaptcha(token);
    if (this.challengeToken === void 0) {
      this.solving -= 1;
      return;
    }
    const lastToken = this.challengeToken;
    this.challengeToken = void 0;
    this.options.setChallengeStatus("pending");
    log.info("challenge: sending challenge to server");
    try {
      await this.sendChallengeResponse({
        type: "recaptcha",
        token: lastToken,
        captcha
      });
    } catch (error) {
      log.error(`challenge: challenge failure, error: ${error && error.stack}`);
      this.options.setChallengeStatus("required");
      this.solving -= 1;
      return;
    }
    log.info("challenge: challenge success. force sending");
    this.options.setChallengeStatus("idle");
    this.startAllQueues({ force: true });
    this.solving -= 1;
  }
  async sendChallengeResponse(data) {
    try {
      await this.options.sendChallengeResponse(data);
    } catch (error) {
      if (!(error instanceof import_Errors.HTTPError) || !(error.code === 413 || error.code === 429) || !error.responseHeaders) {
        this.options.onChallengeFailed();
        throw error;
      }
      const retryAfter = (0, import_parseRetryAfter.parseRetryAfterWithDefault)(error.responseHeaders["retry-after"]);
      log.info(`challenge: retry after ${retryAfter}ms`);
      this.options.onChallengeFailed(retryAfter);
      return;
    }
    this.options.onChallengeSolved();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChallengeHandler,
  STORAGE_KEY,
  getChallengeURL
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2hhbGxlbmdlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLy8gYENoYWxsZW5nZUhhbmRsZXJgIGlzIHJlc3BvbnNpYmxlIGZvcjpcbi8vIDEuIHRyYWNraW5nIHRoZSBtZXNzYWdlcyB0aGF0IGZhaWxlZCB0byBzZW5kIHdpdGggNDI4IGVycm9yIGFuZCBjb3VsZCBiZVxuLy8gICAgcmV0cmllZCB3aGVuIHVzZXIgc29sdmVzIHRoZSBjaGFsbGVuZ2Vcbi8vIDIuIHByZXNlbnRpbmcgdGhlIGNoYWxsZW5nZSB0byB1c2VyIGFuZCBzZW5kaW5nIHRoZSBjaGFsbGVuZ2UgcmVzcG9uc2UgYmFja1xuLy8gICAgdG8gdGhlIHNlcnZlclxuLy9cbi8vIFRoZSB0cmFja2VkIG1lc3NhZ2VzIGFyZSBwZXJzaXN0ZWQgaW4gdGhlIGRhdGFiYXNlLCBhbmQgYXJlIGltcG9ydGVkIGJhY2tcbi8vIHRvIHRoZSBgQ2hhbGxlbmdlSGFuZGxlcmAgb24gYC5sb2FkKClgIGNhbGwgKGZyb20gYHRzL2JhY2tncm91bmQudHNgKS4gVGhleVxuLy8gYXJlIG5vdCBpbW1lZGlhdGVseSByZXRyaWVkLCBob3dldmVyLCB1bnRpbCBgLm9uT25saW5lKClgIGlzIGNhbGxlZCBmcm9tXG4vLyB3aGVuIHdlIGFyZSBhY3R1YWxseSBvbmxpbmUuXG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJy4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgaXNPbGRlclRoYW4gfSBmcm9tICcuL3V0aWwvdGltZXN0YW1wJztcbmltcG9ydCB7IHBhcnNlUmV0cnlBZnRlcldpdGhEZWZhdWx0IH0gZnJvbSAnLi91dGlsL3BhcnNlUmV0cnlBZnRlcic7XG5pbXBvcnQgeyBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSB9IGZyb20gJy4vdXRpbC9jbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSc7XG5pbXBvcnQgeyBnZXRFbnZpcm9ubWVudCwgRW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZUludGVyZmFjZSB9IGZyb20gJy4vdHlwZXMvU3RvcmFnZS5kJztcbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4vdGV4dHNlY3VyZS9FcnJvcnMnO1xuaW1wb3J0IHR5cGUgeyBTZW5kTWVzc2FnZUNoYWxsZW5nZURhdGEgfSBmcm9tICcuL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuL2xvZ2dpbmcvbG9nJztcblxuZXhwb3J0IHR5cGUgQ2hhbGxlbmdlUmVzcG9uc2UgPSB7XG4gIHJlYWRvbmx5IGNhcHRjaGE6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIElQQ1JlcXVlc3QgPSB7XG4gIHJlYWRvbmx5IHNlcTogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgSVBDUmVzcG9uc2UgPSB7XG4gIHJlYWRvbmx5IHNlcTogbnVtYmVyO1xuICByZWFkb25seSBkYXRhOiBDaGFsbGVuZ2VSZXNwb25zZTtcbn07XG5cbnR5cGUgSGFuZGxlciA9IHtcbiAgcmVhZG9ubHkgdG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICByZXNvbHZlKHJlc3BvbnNlOiBDaGFsbGVuZ2VSZXNwb25zZSk6IHZvaWQ7XG4gIHJlamVjdChlcnJvcjogRXJyb3IpOiB2b2lkO1xufTtcblxuZXhwb3J0IHR5cGUgQ2hhbGxlbmdlRGF0YSA9IHtcbiAgcmVhZG9ubHkgdHlwZTogJ3JlY2FwdGNoYSc7XG4gIHJlYWRvbmx5IHRva2VuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNhcHRjaGE6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIE9wdGlvbnMgPSB7XG4gIHJlYWRvbmx5IHN0b3JhZ2U6IFBpY2s8U3RvcmFnZUludGVyZmFjZSwgJ2dldCcgfCAncHV0Jz47XG5cbiAgcmVxdWVzdENoYWxsZW5nZShyZXF1ZXN0OiBJUENSZXF1ZXN0KTogdm9pZDtcblxuICBzdGFydFF1ZXVlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiB2b2lkO1xuXG4gIHNlbmRDaGFsbGVuZ2VSZXNwb25zZShkYXRhOiBDaGFsbGVuZ2VEYXRhKTogUHJvbWlzZTx2b2lkPjtcblxuICBzZXRDaGFsbGVuZ2VTdGF0dXMoY2hhbGxlbmdlU3RhdHVzOiAnaWRsZScgfCAncmVxdWlyZWQnIHwgJ3BlbmRpbmcnKTogdm9pZDtcblxuICBvbkNoYWxsZW5nZVNvbHZlZCgpOiB2b2lkO1xuICBvbkNoYWxsZW5nZUZhaWxlZChyZXRyeUFmdGVyPzogbnVtYmVyKTogdm9pZDtcblxuICBleHBpcmVBZnRlcj86IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjb25zdCBTVE9SQUdFX0tFWSA9ICdjaGFsbGVuZ2U6Y29udmVyc2F0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIFJlZ2lzdGVyZWRDaGFsbGVuZ2VUeXBlID0gUmVhZG9ubHk8e1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBjcmVhdGVkQXQ6IG51bWJlcjtcbiAgcmV0cnlBdD86IG51bWJlcjtcbiAgdG9rZW4/OiBzdHJpbmc7XG59PjtcblxuY29uc3QgREVGQVVMVF9FWFBJUkVfQUZURVIgPSAyNCAqIDM2MDAgKiAxMDAwOyAvLyBvbmUgZGF5XG5jb25zdCBDQVBUQ0hBX1VSTCA9ICdodHRwczovL3NpZ25hbGNhcHRjaGFzLm9yZy9jaGFsbGVuZ2UvZ2VuZXJhdGUuaHRtbCc7XG5jb25zdCBDQVBUQ0hBX1NUQUdJTkdfVVJMID1cbiAgJ2h0dHBzOi8vc2lnbmFsY2FwdGNoYXMub3JnL3N0YWdpbmcvY2hhbGxlbmdlL2dlbmVyYXRlLmh0bWwnO1xuXG5mdW5jdGlvbiBzaG91bGRTdGFydFF1ZXVlKHJlZ2lzdGVyZWQ6IFJlZ2lzdGVyZWRDaGFsbGVuZ2VUeXBlKTogYm9vbGVhbiB7XG4gIC8vIE5vIHJldHJ5QXQgcHJvdmlkZWQ7IHdhaXRpbmcgZm9yIHVzZXIgdG8gY29tcGxldGUgY2FwdGNoYVxuICBpZiAoIXJlZ2lzdGVyZWQucmV0cnlBdCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChyZWdpc3RlcmVkLnJldHJ5QXQgPD0gRGF0ZS5ub3coKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhbGxlbmdlVVJMKCk6IHN0cmluZyB7XG4gIGlmIChnZXRFbnZpcm9ubWVudCgpID09PSBFbnZpcm9ubWVudC5TdGFnaW5nKSB7XG4gICAgcmV0dXJuIENBUFRDSEFfU1RBR0lOR19VUkw7XG4gIH1cbiAgcmV0dXJuIENBUFRDSEFfVVJMO1xufVxuXG4vLyBOb3RlIHRoYXQgZXZlbiB0aG91Z2ggdGhpcyBpcyBhIGNsYXNzIC0gb25seSBvbmUgaW5zdGFuY2Ugb2Zcbi8vIGBDaGFsbGVuZ2VIYW5kbGVyYCBzaG91bGQgYmUgaW4gbWVtb3J5IGF0IHRoZSBzYW1lIHRpbWUgYmVjYXVzZSB0aGV5IGNvdWxkXG4vLyBvdmVyd3JpdGUgZWFjaCBvdGhlcnMgc3RvcmFnZSBkYXRhLlxuZXhwb3J0IGNsYXNzIENoYWxsZW5nZUhhbmRsZXIge1xuICBwcml2YXRlIHNvbHZpbmcgPSAwO1xuXG4gIHByaXZhdGUgaXNMb2FkZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIGNoYWxsZW5nZVRva2VuOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBzZXEgPSAwO1xuXG4gIHByaXZhdGUgaXNPbmxpbmUgPSBmYWxzZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHJlc3BvbnNlSGFuZGxlcnMgPSBuZXcgTWFwPG51bWJlciwgSGFuZGxlcj4oKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHJlZ2lzdGVyZWRDb252ZXJzYXRpb25zID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgUmVnaXN0ZXJlZENoYWxsZW5nZVR5cGVcbiAgPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhcnRUaW1lcnMgPSBuZXcgTWFwPHN0cmluZywgTm9kZUpTLlRpbWVvdXQ+KCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwZW5kaW5nU3RhcnRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBPcHRpb25zKSB7fVxuXG4gIHB1YmxpYyBhc3luYyBsb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XG4gICAgY29uc3QgY2hhbGxlbmdlczogUmVhZG9ubHlBcnJheTxSZWdpc3RlcmVkQ2hhbGxlbmdlVHlwZT4gPVxuICAgICAgdGhpcy5vcHRpb25zLnN0b3JhZ2UuZ2V0KFNUT1JBR0VfS0VZKSB8fCBbXTtcblxuICAgIGxvZy5pbmZvKGBjaGFsbGVuZ2U6IGxvYWRpbmcgJHtjaGFsbGVuZ2VzLmxlbmd0aH0gY2hhbGxlbmdlc2ApO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBjaGFsbGVuZ2VzLm1hcChhc3luYyBjaGFsbGVuZ2UgPT4ge1xuICAgICAgICBjb25zdCBleHBpcmVBZnRlciA9IHRoaXMub3B0aW9ucy5leHBpcmVBZnRlciB8fCBERUZBVUxUX0VYUElSRV9BRlRFUjtcbiAgICAgICAgaWYgKGlzT2xkZXJUaGFuKGNoYWxsZW5nZS5jcmVhdGVkQXQsIGV4cGlyZUFmdGVyKSkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYGNoYWxsZW5nZTogZXhwaXJlZCBjaGFsbGVuZ2UgZm9yIGNvbnZlcnNhdGlvbiAke2NoYWxsZW5nZS5jb252ZXJzYXRpb25JZH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgaW5pdGlhbGl6YXRpb24gb3JkZXIgaXMgZm9sbG93aW5nOlxuICAgICAgICAvL1xuICAgICAgICAvLyAxLiBgLmxvYWQoKWAgd2hlbiB0aGUgYHdpbmRvdy5zdG9yYWdlYCBpcyByZWFkeVxuICAgICAgICAvLyAyLiBgLm9uT25saW5lKClgIHdoZW4gd2UgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2FpdCBmb3IgYC5vbk9ubGluZSgpYCB0byB0cmlnZ2VyIHRoZSByZXRyaWVzIGluc3RlYWQgb2YgdHJpZ2dlcmluZ1xuICAgICAgICAvLyB0aGVtIGhlcmUgaW1tZWRpYXRlbHkgKGlmIHRoZSBtZXNzYWdlIGlzIHJlYWR5IHRvIGJlIHJldHJpZWQpLlxuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyKGNoYWxsZW5nZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb25PZmZsaW5lKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuaXNPbmxpbmUgPSBmYWxzZTtcblxuICAgIGxvZy5pbmZvKCdjaGFsbGVuZ2U6IG9mZmxpbmUnKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvbk9ubGluZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmlzT25saW5lID0gdHJ1ZTtcblxuICAgIGNvbnN0IHBlbmRpbmcgPSBBcnJheS5mcm9tKHRoaXMucGVuZGluZ1N0YXJ0cy52YWx1ZXMoKSk7XG4gICAgdGhpcy5wZW5kaW5nU3RhcnRzLmNsZWFyKCk7XG5cbiAgICBsb2cuaW5mbyhgY2hhbGxlbmdlOiBvbmxpbmUsIHN0YXJ0aW5nICR7cGVuZGluZy5sZW5ndGh9IHF1ZXVlc2ApO1xuXG4gICAgLy8gU3RhcnQgcXVldWVzIGZvciBjaGFsbGVuZ2VzIHRoYXQgbWF0dXJlZCB3aGlsZSB3ZSB3ZXJlIG9mZmxpbmVcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHBlbmRpbmcubWFwKGNvbnZlcnNhdGlvbklkID0+IHRoaXMuc3RhcnRRdWV1ZShjb252ZXJzYXRpb25JZCkpXG4gICAgKTtcblxuICAgIGF3YWl0IHRoaXMuc3RhcnRBbGxRdWV1ZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXliZVNvbHZlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFsbGVuZ2UgPSB0aGlzLnJlZ2lzdGVyZWRDb252ZXJzYXRpb25zLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjaGFsbGVuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb2x2aW5nID4gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjaGFsbGVuZ2UudG9rZW4pIHtcbiAgICAgIHRoaXMuc29sdmUoY2hhbGxlbmdlLnRva2VuKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVnaXN0ZXIoXG4gICAgY2hhbGxlbmdlOiBSZWdpc3RlcmVkQ2hhbGxlbmdlVHlwZSxcbiAgICBkYXRhPzogU2VuZE1lc3NhZ2VDaGFsbGVuZ2VEYXRhXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQgfSA9IGNoYWxsZW5nZTtcblxuICAgIGlmICh0aGlzLmlzUmVnaXN0ZXJlZChjb252ZXJzYXRpb25JZCkpIHtcbiAgICAgIGxvZy5pbmZvKGBjaGFsbGVuZ2U6IGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbklkfSAgYWxyZWFkeSByZWdpc3RlcmVkYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RlcmVkQ29udmVyc2F0aW9ucy5zZXQoY29udmVyc2F0aW9uSWQsIGNoYWxsZW5nZSk7XG4gICAgYXdhaXQgdGhpcy5wZXJzaXN0KCk7XG5cbiAgICAvLyBDaGFsbGVuZ2UgaXMgYWxyZWFkeSByZXRyeWFibGUgLSBzdGFydCB0aGUgcXVldWVcbiAgICBpZiAoc2hvdWxkU3RhcnRRdWV1ZShjaGFsbGVuZ2UpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGNoYWxsZW5nZTogc3RhcnRpbmcgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uSWR9IGltbWVkaWF0ZWx5YFxuICAgICAgKTtcbiAgICAgIGF3YWl0IHRoaXMuc3RhcnRRdWV1ZShjb252ZXJzYXRpb25JZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNoYWxsZW5nZS5yZXRyeUF0KSB7XG4gICAgICBjb25zdCB3YWl0VGltZSA9IE1hdGgubWF4KDAsIGNoYWxsZW5nZS5yZXRyeUF0IC0gRGF0ZS5ub3coKSk7XG4gICAgICBjb25zdCBvbGRUaW1lciA9IHRoaXMuc3RhcnRUaW1lcnMuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgIGlmIChvbGRUaW1lcikge1xuICAgICAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeShvbGRUaW1lcik7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXJ0VGltZXJzLnNldChcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3RhcnRUaW1lcnMuZGVsZXRlKGNvbnZlcnNhdGlvbklkKTtcblxuICAgICAgICAgIHRoaXMuc3RhcnRRdWV1ZShjb252ZXJzYXRpb25JZCk7XG4gICAgICAgIH0sIHdhaXRUaW1lKVxuICAgICAgKTtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgY2hhbGxlbmdlOiB0cmFja2luZyAke2NvbnZlcnNhdGlvbklkfSB3aXRoIHdhaXRUaW1lPSR7d2FpdFRpbWV9YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oYGNoYWxsZW5nZTogdHJhY2tpbmcgJHtjb252ZXJzYXRpb25JZH0gd2l0aCBubyB3YWl0VGltZWApO1xuICAgIH1cblxuICAgIGlmIChkYXRhICYmICFkYXRhLm9wdGlvbnM/LmluY2x1ZGVzKCdyZWNhcHRjaGEnKSkge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgY2hhbGxlbmdlOiB1bmV4cGVjdGVkIG9wdGlvbnMgJHtKU09OLnN0cmluZ2lmeShkYXRhLm9wdGlvbnMpfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjaGFsbGVuZ2UudG9rZW4pIHtcbiAgICAgIGNvbnN0IGRhdGFTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYGNoYWxsZW5nZTogJHtjb252ZXJzYXRpb25JZH0gaXMgd2FpdGluZzsgbm8gdG9rZW4gaW4gZGF0YSAke2RhdGFTdHJpbmd9YFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNvbHZlKGNoYWxsZW5nZS50b2tlbik7XG4gIH1cblxuICBwdWJsaWMgb25SZXNwb25zZShyZXNwb25zZTogSVBDUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5yZXNwb25zZUhhbmRsZXJzLmdldChyZXNwb25zZS5zZXEpO1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVzcG9uc2VIYW5kbGVycy5kZWxldGUocmVzcG9uc2Uuc2VxKTtcbiAgICBoYW5kbGVyLnJlc29sdmUocmVzcG9uc2UuZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdW5yZWdpc3Rlcihjb252ZXJzYXRpb25JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oYGNoYWxsZW5nZTogdW5yZWdpc3RlcmVkIGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbklkfWApO1xuICAgIHRoaXMucmVnaXN0ZXJlZENvbnZlcnNhdGlvbnMuZGVsZXRlKGNvbnZlcnNhdGlvbklkKTtcbiAgICB0aGlzLnBlbmRpbmdTdGFydHMuZGVsZXRlKGNvbnZlcnNhdGlvbklkKTtcblxuICAgIGNvbnN0IHRpbWVyID0gdGhpcy5zdGFydFRpbWVycy5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIHRoaXMuc3RhcnRUaW1lcnMuZGVsZXRlKGNvbnZlcnNhdGlvbklkKTtcbiAgICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aW1lcik7XG5cbiAgICBhd2FpdCB0aGlzLnBlcnNpc3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXF1ZXN0Q2FwdGNoYSh0b2tlbiA9ICcnKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBJUENSZXF1ZXN0ID0geyBzZXE6IHRoaXMuc2VxIH07XG4gICAgdGhpcy5zZXEgKz0gMTtcblxuICAgIHRoaXMub3B0aW9ucy5yZXF1ZXN0Q2hhbGxlbmdlKHJlcXVlc3QpO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBuZXcgUHJvbWlzZTxDaGFsbGVuZ2VSZXNwb25zZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNwb25zZUhhbmRsZXJzLnNldChyZXF1ZXN0LnNlcSwgeyB0b2tlbiwgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmNhcHRjaGE7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHBlcnNpc3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXNzZXJ0KFxuICAgICAgdGhpcy5pc0xvYWRlZCxcbiAgICAgICdDaGFsbGVuZ2VIYW5kbGVyIGhhcyB0byBiZSBsb2FkZWQgYmVmb3JlIHBlcnNpc3RpbmcgbmV3IGRhdGEnXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLm9wdGlvbnMuc3RvcmFnZS5wdXQoXG4gICAgICBTVE9SQUdFX0tFWSxcbiAgICAgIEFycmF5LmZyb20odGhpcy5yZWdpc3RlcmVkQ29udmVyc2F0aW9ucy52YWx1ZXMoKSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGlzUmVnaXN0ZXJlZChjb252ZXJzYXRpb25JZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJlZENvbnZlcnNhdGlvbnMuaGFzKGNvbnZlcnNhdGlvbklkKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRBbGxRdWV1ZXMoe1xuICAgIGZvcmNlID0gZmFsc2UsXG4gIH06IHtcbiAgICBmb3JjZT86IGJvb2xlYW47XG4gIH0gPSB7fSk6IHZvaWQge1xuICAgIGxvZy5pbmZvKGBjaGFsbGVuZ2U6IHN0YXJ0QWxsUXVldWVzIGZvcmNlPSR7Zm9yY2V9YCk7XG5cbiAgICBBcnJheS5mcm9tKHRoaXMucmVnaXN0ZXJlZENvbnZlcnNhdGlvbnMudmFsdWVzKCkpXG4gICAgICAuZmlsdGVyKGNoYWxsZW5nZSA9PiBmb3JjZSB8fCBzaG91bGRTdGFydFF1ZXVlKGNoYWxsZW5nZSkpXG4gICAgICAuZm9yRWFjaChjaGFsbGVuZ2UgPT4gdGhpcy5zdGFydFF1ZXVlKGNoYWxsZW5nZS5jb252ZXJzYXRpb25JZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdGFydFF1ZXVlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuaXNPbmxpbmUpIHtcbiAgICAgIHRoaXMucGVuZGluZ1N0YXJ0cy5hZGQoY29udmVyc2F0aW9uSWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMudW5yZWdpc3Rlcihjb252ZXJzYXRpb25JZCk7XG5cbiAgICBpZiAodGhpcy5yZWdpc3RlcmVkQ29udmVyc2F0aW9ucy5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuc2V0Q2hhbGxlbmdlU3RhdHVzKCdpZGxlJyk7XG4gICAgfVxuXG4gICAgbG9nLmluZm8oYHN0YXJ0UXVldWU6IHN0YXJ0aW5nIHF1ZXVlICR7Y29udmVyc2F0aW9uSWR9YCk7XG4gICAgdGhpcy5vcHRpb25zLnN0YXJ0UXVldWUoY29udmVyc2F0aW9uSWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzb2x2ZSh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zb2x2aW5nICs9IDE7XG4gICAgdGhpcy5vcHRpb25zLnNldENoYWxsZW5nZVN0YXR1cygncmVxdWlyZWQnKTtcbiAgICB0aGlzLmNoYWxsZW5nZVRva2VuID0gdG9rZW47XG5cbiAgICBjb25zdCBjYXB0Y2hhID0gYXdhaXQgdGhpcy5yZXF1ZXN0Q2FwdGNoYSh0b2tlbik7XG5cbiAgICAvLyBBbm90aGVyIGAuc29sdmUoKWAgaGFzIGNvbXBsZXRlZCBlYXJsaWVyIHRoYW4gdXNcbiAgICBpZiAodGhpcy5jaGFsbGVuZ2VUb2tlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNvbHZpbmcgLT0gMTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0VG9rZW4gPSB0aGlzLmNoYWxsZW5nZVRva2VuO1xuICAgIHRoaXMuY2hhbGxlbmdlVG9rZW4gPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm9wdGlvbnMuc2V0Q2hhbGxlbmdlU3RhdHVzKCdwZW5kaW5nJyk7XG5cbiAgICBsb2cuaW5mbygnY2hhbGxlbmdlOiBzZW5kaW5nIGNoYWxsZW5nZSB0byBzZXJ2ZXInKTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnNlbmRDaGFsbGVuZ2VSZXNwb25zZSh7XG4gICAgICAgIHR5cGU6ICdyZWNhcHRjaGEnLFxuICAgICAgICB0b2tlbjogbGFzdFRva2VuLFxuICAgICAgICBjYXB0Y2hhLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihgY2hhbGxlbmdlOiBjaGFsbGVuZ2UgZmFpbHVyZSwgZXJyb3I6ICR7ZXJyb3IgJiYgZXJyb3Iuc3RhY2t9YCk7XG4gICAgICB0aGlzLm9wdGlvbnMuc2V0Q2hhbGxlbmdlU3RhdHVzKCdyZXF1aXJlZCcpO1xuICAgICAgdGhpcy5zb2x2aW5nIC09IDE7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oJ2NoYWxsZW5nZTogY2hhbGxlbmdlIHN1Y2Nlc3MuIGZvcmNlIHNlbmRpbmcnKTtcblxuICAgIHRoaXMub3B0aW9ucy5zZXRDaGFsbGVuZ2VTdGF0dXMoJ2lkbGUnKTtcblxuICAgIHRoaXMuc3RhcnRBbGxRdWV1ZXMoeyBmb3JjZTogdHJ1ZSB9KTtcbiAgICB0aGlzLnNvbHZpbmcgLT0gMTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZENoYWxsZW5nZVJlc3BvbnNlKGRhdGE6IENoYWxsZW5nZURhdGEpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5vcHRpb25zLnNlbmRDaGFsbGVuZ2VSZXNwb25zZShkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKFxuICAgICAgICAhKGVycm9yIGluc3RhbmNlb2YgSFRUUEVycm9yKSB8fFxuICAgICAgICAhKGVycm9yLmNvZGUgPT09IDQxMyB8fCBlcnJvci5jb2RlID09PSA0MjkpIHx8XG4gICAgICAgICFlcnJvci5yZXNwb25zZUhlYWRlcnNcbiAgICAgICkge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DaGFsbGVuZ2VGYWlsZWQoKTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJldHJ5QWZ0ZXIgPSBwYXJzZVJldHJ5QWZ0ZXJXaXRoRGVmYXVsdChcbiAgICAgICAgZXJyb3IucmVzcG9uc2VIZWFkZXJzWydyZXRyeS1hZnRlciddXG4gICAgICApO1xuXG4gICAgICBsb2cuaW5mbyhgY2hhbGxlbmdlOiByZXRyeSBhZnRlciAke3JldHJ5QWZ0ZXJ9bXNgKTtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkNoYWxsZW5nZUZhaWxlZChyZXRyeUFmdGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMub25DaGFsbGVuZ2VTb2x2ZWQoKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjQSxvQkFBdUI7QUFDdkIsdUJBQTRCO0FBQzVCLDZCQUEyQztBQUMzQyxxQ0FBd0M7QUFDeEMseUJBQTRDO0FBRTVD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
