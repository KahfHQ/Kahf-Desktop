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
var WebsocketResources_exports = {};
__export(WebsocketResources_exports, {
  CloseEvent: () => CloseEvent,
  IncomingWebSocketRequest: () => IncomingWebSocketRequest,
  default: () => WebSocketResource
});
module.exports = __toCommonJS(WebsocketResources_exports);
var import_long = __toESM(require("long"));
var import_EventTarget = __toESM(require("./EventTarget"));
var durations = __toESM(require("../util/durations"));
var import_dropNull = require("../util/dropNull");
var import_timestamp = require("../util/timestamp");
var import_assert = require("../util/assert");
var Errors = __toESM(require("../types/errors"));
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var Timers = __toESM(require("../Timers"));
const THIRTY_SECONDS = 30 * durations.SECOND;
const MAX_MESSAGE_SIZE = 256 * 1024;
class IncomingWebSocketRequest {
  constructor(request, sendBytes) {
    this.sendBytes = sendBytes;
    (0, import_assert.strictAssert)(request.id, "request without id");
    (0, import_assert.strictAssert)(request.verb, "request without verb");
    (0, import_assert.strictAssert)(request.path, "request without path");
    this.id = request.id;
    this.verb = request.verb;
    this.path = request.path;
    this.body = (0, import_dropNull.dropNull)(request.body);
    this.headers = request.headers || [];
  }
  respond(status, message) {
    const bytes = import_protobuf.SignalService.WebSocketMessage.encode({
      type: import_protobuf.SignalService.WebSocketMessage.Type.RESPONSE,
      response: { id: this.id, message, status }
    }).finish();
    this.sendBytes(Buffer.from(bytes));
  }
}
class CloseEvent extends Event {
  constructor(code, reason) {
    super("close");
    this.code = code;
    this.reason = reason;
  }
}
class WebSocketResource extends import_EventTarget.default {
  constructor(socket, options = {}) {
    super();
    this.socket = socket;
    this.options = options;
    this.outgoingId = import_long.default.fromNumber(1, true);
    this.closed = false;
    this.outgoingMap = /* @__PURE__ */ new Map();
    this.activeRequests = /* @__PURE__ */ new Set();
    this.shuttingDown = false;
    this.boundOnMessage = this.onMessage.bind(this);
    socket.on("message", this.boundOnMessage);
    if (options.keepalive) {
      const keepalive = new KeepAlive(this, options.keepalive === true ? {} : options.keepalive);
      this.keepalive = keepalive;
      keepalive.reset();
      socket.on("message", () => keepalive.reset());
      socket.on("close", () => keepalive.stop());
      socket.on("error", (error) => {
        log.warn("WebSocketResource: WebSocket error", Errors.toLogFormat(error));
      });
    }
    socket.on("close", (code, reason) => {
      this.closed = true;
      log.warn("WebSocketResource: Socket closed");
      this.dispatchEvent(new CloseEvent(code, reason || "normal"));
    });
    this.addEventListener("close", () => this.onClose());
  }
  addEventListener(name, handler) {
    return super.addEventListener(name, handler);
  }
  async sendRequest(options) {
    const id = this.outgoingId;
    const idString = id.toString();
    (0, import_assert.strictAssert)(!this.outgoingMap.has(idString), "Duplicate outgoing request");
    this.outgoingId = this.outgoingId.add(1);
    const bytes = import_protobuf.SignalService.WebSocketMessage.encode({
      type: import_protobuf.SignalService.WebSocketMessage.Type.REQUEST,
      request: {
        verb: options.verb,
        path: options.path,
        body: options.body,
        headers: options.headers ? options.headers.slice() : void 0,
        id
      }
    }).finish();
    (0, import_assert.strictAssert)(bytes.length <= MAX_MESSAGE_SIZE, "WebSocket request byte size exceeded");
    (0, import_assert.strictAssert)(!this.shuttingDown, "Cannot send request, shutting down");
    this.addActive(idString);
    const promise = new Promise((resolve, reject) => {
      let timer = options.timeout ? Timers.setTimeout(() => {
        this.removeActive(idString);
        reject(new Error("Request timed out"));
      }, options.timeout) : void 0;
      this.outgoingMap.set(idString, (result) => {
        if (timer !== void 0) {
          Timers.clearTimeout(timer);
          timer = void 0;
        }
        this.removeActive(idString);
        resolve(result);
      });
    });
    this.socket.sendBytes(Buffer.from(bytes));
    return promise;
  }
  forceKeepAlive() {
    if (!this.keepalive) {
      return;
    }
    this.keepalive.send();
  }
  close(code = 3e3, reason) {
    if (this.closed) {
      return;
    }
    log.info("WebSocketResource.close()");
    if (this.keepalive) {
      this.keepalive.stop();
    }
    this.socket.close(code, reason);
    this.socket.removeListener("message", this.boundOnMessage);
    Timers.setTimeout(() => {
      if (this.closed) {
        return;
      }
      log.warn("WebSocketResource: Dispatching our own socket close event");
      this.dispatchEvent(new CloseEvent(code, reason || "normal"));
    }, 5e3);
  }
  shutdown() {
    if (this.closed) {
      return;
    }
    if (this.activeRequests.size === 0) {
      log.info("WebSocketResource: no active requests, closing");
      this.close(3e3, "Shutdown");
      return;
    }
    this.shuttingDown = true;
    log.info("WebSocketResource: shutting down");
    this.shutdownTimer = Timers.setTimeout(() => {
      if (this.closed) {
        return;
      }
      log.warn("WebSocketResource: Failed to shutdown gracefully");
      this.close(3e3, "Shutdown");
    }, THIRTY_SECONDS);
  }
  onMessage({ type, binaryData }) {
    if (type !== "binary" || !binaryData) {
      throw new Error(`Unsupported websocket message type: ${type}`);
    }
    const message = import_protobuf.SignalService.WebSocketMessage.decode(binaryData);
    if (message.type === import_protobuf.SignalService.WebSocketMessage.Type.REQUEST && message.request) {
      const handleRequest = this.options.handleRequest || ((request) => request.respond(404, "Not found"));
      const incomingRequest = new IncomingWebSocketRequest(message.request, (bytes) => {
        this.removeActive(incomingRequest);
        (0, import_assert.strictAssert)(bytes.length <= MAX_MESSAGE_SIZE, "WebSocket response byte size exceeded");
        this.socket.sendBytes(bytes);
      });
      if (this.shuttingDown) {
        incomingRequest.respond(-1, "Shutting down");
        return;
      }
      this.addActive(incomingRequest);
      handleRequest(incomingRequest);
    } else if (message.type === import_protobuf.SignalService.WebSocketMessage.Type.RESPONSE && message.response) {
      const { response } = message;
      (0, import_assert.strictAssert)(response.id, "response without id");
      const responseIdString = response.id.toString();
      const resolve = this.outgoingMap.get(responseIdString);
      this.outgoingMap.delete(responseIdString);
      if (!resolve) {
        throw new Error(`Received response for unknown request ${response.id}`);
      }
      resolve({
        status: response.status ?? -1,
        message: response.message ?? "",
        response: (0, import_dropNull.dropNull)(response.body),
        headers: response.headers ?? []
      });
    }
  }
  onClose() {
    const outgoing = new Map(this.outgoingMap);
    this.outgoingMap.clear();
    for (const resolve of outgoing.values()) {
      resolve({
        status: -1,
        message: "Connection closed",
        response: void 0,
        headers: []
      });
    }
  }
  addActive(request) {
    this.activeRequests.add(request);
  }
  removeActive(request) {
    if (!this.activeRequests.has(request)) {
      log.warn("WebSocketResource: removing unknown request");
      return;
    }
    this.activeRequests.delete(request);
    if (this.activeRequests.size !== 0) {
      return;
    }
    if (!this.shuttingDown) {
      return;
    }
    if (this.shutdownTimer) {
      Timers.clearTimeout(this.shutdownTimer);
      this.shutdownTimer = void 0;
    }
    log.info("WebSocketResource: shutdown complete");
    this.close(3e3, "Shutdown");
  }
}
const KEEPALIVE_INTERVAL_MS = 30 * durations.SECOND;
const MAX_KEEPALIVE_INTERVAL_MS = 5 * durations.MINUTE;
class KeepAlive {
  constructor(websocketResource, opts = {}) {
    this.lastAliveAt = Date.now();
    if (websocketResource instanceof WebSocketResource) {
      this.path = opts.path !== void 0 ? opts.path : "/";
      this.disconnect = opts.disconnect !== void 0 ? opts.disconnect : true;
      this.wsr = websocketResource;
    } else {
      throw new TypeError("KeepAlive expected a WebSocketResource");
    }
  }
  stop() {
    this.clearTimers();
  }
  async send() {
    this.clearTimers();
    if ((0, import_timestamp.isOlderThan)(this.lastAliveAt, MAX_KEEPALIVE_INTERVAL_MS)) {
      log.info("WebSocketResources: disconnecting due to stale state");
      this.wsr.close(3001, `Last keepalive request was too far in the past: ${this.lastAliveAt}`);
      return;
    }
    if (this.disconnect) {
      this.disconnectTimer = Timers.setTimeout(() => {
        log.info("WebSocketResources: disconnecting due to no response");
        this.clearTimers();
        this.wsr.close(3001, "No response to keepalive request");
      }, 1e4);
    } else {
      this.reset();
    }
    log.info("WebSocketResources: Sending a keepalive message");
    const { status } = await this.wsr.sendRequest({
      verb: "GET",
      path: this.path
    });
    if (status >= 200 || status < 300) {
      this.reset();
    }
  }
  reset() {
    this.lastAliveAt = Date.now();
    this.clearTimers();
    this.keepAliveTimer = Timers.setTimeout(() => this.send(), KEEPALIVE_INTERVAL_MS);
  }
  clearTimers() {
    if (this.keepAliveTimer) {
      Timers.clearTimeout(this.keepAliveTimer);
      this.keepAliveTimer = void 0;
    }
    if (this.disconnectTimer) {
      Timers.clearTimeout(this.disconnectTimer);
      this.disconnectTimer = void 0;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CloseEvent,
  IncomingWebSocketRequest
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiV2Vic29ja2V0UmVzb3VyY2VzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cbi8qXG4gKiBXZWJTb2NrZXQtUmVzb3VyY2VzXG4gKlxuICogQ3JlYXRlIGEgcmVxdWVzdC1yZXNwb25zZSBpbnRlcmZhY2Ugb3ZlciB3ZWJzb2NrZXRzIHVzaW5nIHRoZVxuICogV2ViU29ja2V0LVJlc291cmNlcyBzdWItcHJvdG9jb2xbMV0uXG4gKlxuICogdmFyIGNsaWVudCA9IG5ldyBXZWJTb2NrZXRSZXNvdXJjZShzb2NrZXQsIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAqICAgIHJlcXVlc3QucmVzcG9uZCgyMDAsICdPSycpO1xuICogfSk7XG4gKlxuICogY29uc3QgeyByZXNwb25zZSwgc3RhdHVzIH0gPSBhd2FpdCBjbGllbnQuc2VuZFJlcXVlc3Qoe1xuICogICAgdmVyYjogJ1BVVCcsXG4gKiAgICBwYXRoOiAnL3YxL21lc3NhZ2VzJyxcbiAqICAgIGhlYWRlcnM6IFsnY29udGVudC10eXBlOmFwcGxpY2F0aW9uL2pzb24nXSxcbiAqICAgIGJvZHk6IEJ1ZmZlci5mcm9tKCd7IHNvbWU6IFwianNvblwiIH0nKSxcbiAqIH0pO1xuICpcbiAqIDEuIGh0dHBzOi8vZ2l0aHViLmNvbS9zaWduYWxhcHAvV2ViU29ja2V0LVJlc291cmNlc1xuICpcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IGNvbm5lY3Rpb24gYXMgV2ViU29ja2V0LCBJTWVzc2FnZSB9IGZyb20gJ3dlYnNvY2tldCc7XG5pbXBvcnQgTG9uZyBmcm9tICdsb25nJztcblxuaW1wb3J0IHR5cGUgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuL0V2ZW50VGFyZ2V0JztcbmltcG9ydCBFdmVudFRhcmdldCBmcm9tICcuL0V2ZW50VGFyZ2V0JztcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IGRyb3BOdWxsIH0gZnJvbSAnLi4vdXRpbC9kcm9wTnVsbCc7XG5pbXBvcnQgeyBpc09sZGVyVGhhbiB9IGZyb20gJy4uL3V0aWwvdGltZXN0YW1wJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uL3Byb3RvYnVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgKiBhcyBUaW1lcnMgZnJvbSAnLi4vVGltZXJzJztcblxuY29uc3QgVEhJUlRZX1NFQ09ORFMgPSAzMCAqIGR1cmF0aW9ucy5TRUNPTkQ7XG5cbmNvbnN0IE1BWF9NRVNTQUdFX1NJWkUgPSAyNTYgKiAxMDI0O1xuXG5leHBvcnQgY2xhc3MgSW5jb21pbmdXZWJTb2NrZXRSZXF1ZXN0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBpZDogTG9uZztcblxuICBwdWJsaWMgcmVhZG9ubHkgdmVyYjogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGJvZHk6IFVpbnQ4QXJyYXkgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIHJlYWRvbmx5IGhlYWRlcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZXF1ZXN0OiBQcm90by5JV2ViU29ja2V0UmVxdWVzdE1lc3NhZ2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBzZW5kQnl0ZXM6IChieXRlczogQnVmZmVyKSA9PiB2b2lkXG4gICkge1xuICAgIHN0cmljdEFzc2VydChyZXF1ZXN0LmlkLCAncmVxdWVzdCB3aXRob3V0IGlkJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHJlcXVlc3QudmVyYiwgJ3JlcXVlc3Qgd2l0aG91dCB2ZXJiJyk7XG4gICAgc3RyaWN0QXNzZXJ0KHJlcXVlc3QucGF0aCwgJ3JlcXVlc3Qgd2l0aG91dCBwYXRoJyk7XG5cbiAgICB0aGlzLmlkID0gcmVxdWVzdC5pZDtcbiAgICB0aGlzLnZlcmIgPSByZXF1ZXN0LnZlcmI7XG4gICAgdGhpcy5wYXRoID0gcmVxdWVzdC5wYXRoO1xuICAgIHRoaXMuYm9keSA9IGRyb3BOdWxsKHJlcXVlc3QuYm9keSk7XG4gICAgdGhpcy5oZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzIHx8IFtdO1xuICB9XG5cbiAgcHVibGljIHJlc3BvbmQoc3RhdHVzOiBudW1iZXIsIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGJ5dGVzID0gUHJvdG8uV2ViU29ja2V0TWVzc2FnZS5lbmNvZGUoe1xuICAgICAgdHlwZTogUHJvdG8uV2ViU29ja2V0TWVzc2FnZS5UeXBlLlJFU1BPTlNFLFxuICAgICAgcmVzcG9uc2U6IHsgaWQ6IHRoaXMuaWQsIG1lc3NhZ2UsIHN0YXR1cyB9LFxuICAgIH0pLmZpbmlzaCgpO1xuXG4gICAgdGhpcy5zZW5kQnl0ZXMoQnVmZmVyLmZyb20oYnl0ZXMpKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBTZW5kUmVxdWVzdE9wdGlvbnMgPSBSZWFkb25seTx7XG4gIHZlcmI6IHN0cmluZztcbiAgcGF0aDogc3RyaW5nO1xuICBib2R5PzogVWludDhBcnJheTtcbiAgdGltZW91dD86IG51bWJlcjtcbiAgaGVhZGVycz86IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbn0+O1xuXG5leHBvcnQgdHlwZSBTZW5kUmVxdWVzdFJlc3VsdCA9IFJlYWRvbmx5PHtcbiAgc3RhdHVzOiBudW1iZXI7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgcmVzcG9uc2U/OiBVaW50OEFycmF5O1xuICBoZWFkZXJzOiBSZWFkb25seUFycmF5PHN0cmluZz47XG59PjtcblxuZXhwb3J0IHR5cGUgV2ViU29ja2V0UmVzb3VyY2VPcHRpb25zID0ge1xuICBoYW5kbGVSZXF1ZXN0PzogKHJlcXVlc3Q6IEluY29taW5nV2ViU29ja2V0UmVxdWVzdCkgPT4gdm9pZDtcbiAga2VlcGFsaXZlPzogS2VlcEFsaXZlT3B0aW9uc1R5cGUgfCB0cnVlO1xufTtcblxuZXhwb3J0IGNsYXNzIENsb3NlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjb2RlOiBudW1iZXIsIHB1YmxpYyByZWFkb25seSByZWFzb246IHN0cmluZykge1xuICAgIHN1cGVyKCdjbG9zZScpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldFJlc291cmNlIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuICBwcml2YXRlIG91dGdvaW5nSWQgPSBMb25nLmZyb21OdW1iZXIoMSwgdHJ1ZSk7XG5cbiAgcHJpdmF0ZSBjbG9zZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG91dGdvaW5nTWFwID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgKHJlc3VsdDogU2VuZFJlcXVlc3RSZXN1bHQpID0+IHZvaWRcbiAgPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYm91bmRPbk1lc3NhZ2U6IChtZXNzYWdlOiBJTWVzc2FnZSkgPT4gdm9pZDtcblxuICBwcml2YXRlIGFjdGl2ZVJlcXVlc3RzID0gbmV3IFNldDxJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QgfCBzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSBzaHV0dGluZ0Rvd24gPSBmYWxzZTtcblxuICBwcml2YXRlIHNodXRkb3duVGltZXI/OiBUaW1lcnMuVGltZW91dDtcblxuICAvLyBQdWJsaWMgZm9yIHRlc3RzXG4gIHB1YmxpYyByZWFkb25seSBrZWVwYWxpdmU/OiBLZWVwQWxpdmU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBzb2NrZXQ6IFdlYlNvY2tldCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IFdlYlNvY2tldFJlc291cmNlT3B0aW9ucyA9IHt9XG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmJvdW5kT25NZXNzYWdlID0gdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKTtcblxuICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMuYm91bmRPbk1lc3NhZ2UpO1xuXG4gICAgaWYgKG9wdGlvbnMua2VlcGFsaXZlKSB7XG4gICAgICBjb25zdCBrZWVwYWxpdmUgPSBuZXcgS2VlcEFsaXZlKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvcHRpb25zLmtlZXBhbGl2ZSA9PT0gdHJ1ZSA/IHt9IDogb3B0aW9ucy5rZWVwYWxpdmVcbiAgICAgICk7XG4gICAgICB0aGlzLmtlZXBhbGl2ZSA9IGtlZXBhbGl2ZTtcblxuICAgICAga2VlcGFsaXZlLnJlc2V0KCk7XG4gICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCAoKSA9PiBrZWVwYWxpdmUucmVzZXQoKSk7XG4gICAgICBzb2NrZXQub24oJ2Nsb3NlJywgKCkgPT4ga2VlcGFsaXZlLnN0b3AoKSk7XG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgKGVycm9yOiBFcnJvcikgPT4ge1xuICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAnV2ViU29ja2V0UmVzb3VyY2U6IFdlYlNvY2tldCBlcnJvcicsXG4gICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKCdjbG9zZScsIChjb2RlLCByZWFzb24pID0+IHtcbiAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgbG9nLndhcm4oJ1dlYlNvY2tldFJlc291cmNlOiBTb2NrZXQgY2xvc2VkJyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IENsb3NlRXZlbnQoY29kZSwgcmVhc29uIHx8ICdub3JtYWwnKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgKCkgPT4gdGhpcy5vbkNsb3NlKCkpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgbmFtZTogJ2Nsb3NlJyxcbiAgICBoYW5kbGVyOiAoZXY6IENsb3NlRXZlbnQpID0+IHZvaWRcbiAgKTogdm9pZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcihuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHZvaWQge1xuICAgIHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGhhbmRsZXIpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNlbmRSZXF1ZXN0KFxuICAgIG9wdGlvbnM6IFNlbmRSZXF1ZXN0T3B0aW9uc1xuICApOiBQcm9taXNlPFNlbmRSZXF1ZXN0UmVzdWx0PiB7XG4gICAgY29uc3QgaWQgPSB0aGlzLm91dGdvaW5nSWQ7XG4gICAgY29uc3QgaWRTdHJpbmcgPSBpZC50b1N0cmluZygpO1xuICAgIHN0cmljdEFzc2VydCghdGhpcy5vdXRnb2luZ01hcC5oYXMoaWRTdHJpbmcpLCAnRHVwbGljYXRlIG91dGdvaW5nIHJlcXVlc3QnKTtcblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGF1dG9tYXRpY2FsbHkgd3JhcHNcbiAgICB0aGlzLm91dGdvaW5nSWQgPSB0aGlzLm91dGdvaW5nSWQuYWRkKDEpO1xuXG4gICAgY29uc3QgYnl0ZXMgPSBQcm90by5XZWJTb2NrZXRNZXNzYWdlLmVuY29kZSh7XG4gICAgICB0eXBlOiBQcm90by5XZWJTb2NrZXRNZXNzYWdlLlR5cGUuUkVRVUVTVCxcbiAgICAgIHJlcXVlc3Q6IHtcbiAgICAgICAgdmVyYjogb3B0aW9ucy52ZXJiLFxuICAgICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICAgIGJvZHk6IG9wdGlvbnMuYm9keSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzID8gb3B0aW9ucy5oZWFkZXJzLnNsaWNlKCkgOiB1bmRlZmluZWQsXG4gICAgICAgIGlkLFxuICAgICAgfSxcbiAgICB9KS5maW5pc2goKTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBieXRlcy5sZW5ndGggPD0gTUFYX01FU1NBR0VfU0laRSxcbiAgICAgICdXZWJTb2NrZXQgcmVxdWVzdCBieXRlIHNpemUgZXhjZWVkZWQnXG4gICAgKTtcblxuICAgIHN0cmljdEFzc2VydCghdGhpcy5zaHV0dGluZ0Rvd24sICdDYW5ub3Qgc2VuZCByZXF1ZXN0LCBzaHV0dGluZyBkb3duJyk7XG4gICAgdGhpcy5hZGRBY3RpdmUoaWRTdHJpbmcpO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZTxTZW5kUmVxdWVzdFJlc3VsdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHRpbWVyID0gb3B0aW9ucy50aW1lb3V0XG4gICAgICAgID8gVGltZXJzLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmUoaWRTdHJpbmcpO1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUmVxdWVzdCB0aW1lZCBvdXQnKSk7XG4gICAgICAgICAgfSwgb3B0aW9ucy50aW1lb3V0KVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy5vdXRnb2luZ01hcC5zZXQoaWRTdHJpbmcsIHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICh0aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgVGltZXJzLmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZShpZFN0cmluZyk7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQuc2VuZEJ5dGVzKEJ1ZmZlci5mcm9tKGJ5dGVzKSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JjZUtlZXBBbGl2ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMua2VlcGFsaXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMua2VlcGFsaXZlLnNlbmQoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZShjb2RlID0gMzAwMCwgcmVhc29uPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nLmluZm8oJ1dlYlNvY2tldFJlc291cmNlLmNsb3NlKCknKTtcbiAgICBpZiAodGhpcy5rZWVwYWxpdmUpIHtcbiAgICAgIHRoaXMua2VlcGFsaXZlLnN0b3AoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvY2tldC5jbG9zZShjb2RlLCByZWFzb24pO1xuXG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLmJvdW5kT25NZXNzYWdlKTtcblxuICAgIC8vIE9uIGxpbnV4IHRoZSBzb2NrZXQgY2FuIHdhaXQgYSBsb25nIHRpbWUgdG8gZW1pdCBpdHMgY2xvc2UgZXZlbnQgaWYgd2UndmVcbiAgICAvLyAgIGxvc3QgdGhlIGludGVybmV0IGNvbm5lY3Rpb24uIE9uIHRoZSBvcmRlciBvZiBtaW51dGVzLiBUaGlzIHNwZWVkcyB0aGF0XG4gICAgLy8gICBwcm9jZXNzIHVwLlxuICAgIFRpbWVycy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvZy53YXJuKCdXZWJTb2NrZXRSZXNvdXJjZTogRGlzcGF0Y2hpbmcgb3VyIG93biBzb2NrZXQgY2xvc2UgZXZlbnQnKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ2xvc2VFdmVudChjb2RlLCByZWFzb24gfHwgJ25vcm1hbCcpKTtcbiAgICB9LCA1MDAwKTtcbiAgfVxuXG4gIHB1YmxpYyBzaHV0ZG93bigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3RpdmVSZXF1ZXN0cy5zaXplID09PSAwKSB7XG4gICAgICBsb2cuaW5mbygnV2ViU29ja2V0UmVzb3VyY2U6IG5vIGFjdGl2ZSByZXF1ZXN0cywgY2xvc2luZycpO1xuICAgICAgdGhpcy5jbG9zZSgzMDAwLCAnU2h1dGRvd24nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNodXR0aW5nRG93biA9IHRydWU7XG5cbiAgICBsb2cuaW5mbygnV2ViU29ja2V0UmVzb3VyY2U6IHNodXR0aW5nIGRvd24nKTtcbiAgICB0aGlzLnNodXRkb3duVGltZXIgPSBUaW1lcnMuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2cud2FybignV2ViU29ja2V0UmVzb3VyY2U6IEZhaWxlZCB0byBzaHV0ZG93biBncmFjZWZ1bGx5Jyk7XG4gICAgICB0aGlzLmNsb3NlKDMwMDAsICdTaHV0ZG93bicpO1xuICAgIH0sIFRISVJUWV9TRUNPTkRTKTtcbiAgfVxuXG4gIHByaXZhdGUgb25NZXNzYWdlKHsgdHlwZSwgYmluYXJ5RGF0YSB9OiBJTWVzc2FnZSk6IHZvaWQge1xuICAgIGlmICh0eXBlICE9PSAnYmluYXJ5JyB8fCAhYmluYXJ5RGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB3ZWJzb2NrZXQgbWVzc2FnZSB0eXBlOiAke3R5cGV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IFByb3RvLldlYlNvY2tldE1lc3NhZ2UuZGVjb2RlKGJpbmFyeURhdGEpO1xuICAgIGlmIChcbiAgICAgIG1lc3NhZ2UudHlwZSA9PT0gUHJvdG8uV2ViU29ja2V0TWVzc2FnZS5UeXBlLlJFUVVFU1QgJiZcbiAgICAgIG1lc3NhZ2UucmVxdWVzdFxuICAgICkge1xuICAgICAgY29uc3QgaGFuZGxlUmVxdWVzdCA9XG4gICAgICAgIHRoaXMub3B0aW9ucy5oYW5kbGVSZXF1ZXN0IHx8XG4gICAgICAgIChyZXF1ZXN0ID0+IHJlcXVlc3QucmVzcG9uZCg0MDQsICdOb3QgZm91bmQnKSk7XG5cbiAgICAgIGNvbnN0IGluY29taW5nUmVxdWVzdCA9IG5ldyBJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QoXG4gICAgICAgIG1lc3NhZ2UucmVxdWVzdCxcbiAgICAgICAgKGJ5dGVzOiBCdWZmZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZShpbmNvbWluZ1JlcXVlc3QpO1xuXG4gICAgICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICAgICAgYnl0ZXMubGVuZ3RoIDw9IE1BWF9NRVNTQUdFX1NJWkUsXG4gICAgICAgICAgICAnV2ViU29ja2V0IHJlc3BvbnNlIGJ5dGUgc2l6ZSBleGNlZWRlZCdcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmRCeXRlcyhieXRlcyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLnNodXR0aW5nRG93bikge1xuICAgICAgICBpbmNvbWluZ1JlcXVlc3QucmVzcG9uZCgtMSwgJ1NodXR0aW5nIGRvd24nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZEFjdGl2ZShpbmNvbWluZ1JlcXVlc3QpO1xuICAgICAgaGFuZGxlUmVxdWVzdChpbmNvbWluZ1JlcXVlc3QpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBtZXNzYWdlLnR5cGUgPT09IFByb3RvLldlYlNvY2tldE1lc3NhZ2UuVHlwZS5SRVNQT05TRSAmJlxuICAgICAgbWVzc2FnZS5yZXNwb25zZVxuICAgICkge1xuICAgICAgY29uc3QgeyByZXNwb25zZSB9ID0gbWVzc2FnZTtcbiAgICAgIHN0cmljdEFzc2VydChyZXNwb25zZS5pZCwgJ3Jlc3BvbnNlIHdpdGhvdXQgaWQnKTtcblxuICAgICAgY29uc3QgcmVzcG9uc2VJZFN0cmluZyA9IHJlc3BvbnNlLmlkLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCByZXNvbHZlID0gdGhpcy5vdXRnb2luZ01hcC5nZXQocmVzcG9uc2VJZFN0cmluZyk7XG4gICAgICB0aGlzLm91dGdvaW5nTWFwLmRlbGV0ZShyZXNwb25zZUlkU3RyaW5nKTtcblxuICAgICAgaWYgKCFyZXNvbHZlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVjZWl2ZWQgcmVzcG9uc2UgZm9yIHVua25vd24gcmVxdWVzdCAke3Jlc3BvbnNlLmlkfWApO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlKHtcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMgPz8gLTEsXG4gICAgICAgIG1lc3NhZ2U6IHJlc3BvbnNlLm1lc3NhZ2UgPz8gJycsXG4gICAgICAgIHJlc3BvbnNlOiBkcm9wTnVsbChyZXNwb25zZS5ib2R5KSxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2UuaGVhZGVycyA/PyBbXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25DbG9zZSgpOiB2b2lkIHtcbiAgICBjb25zdCBvdXRnb2luZyA9IG5ldyBNYXAodGhpcy5vdXRnb2luZ01hcCk7XG4gICAgdGhpcy5vdXRnb2luZ01hcC5jbGVhcigpO1xuXG4gICAgZm9yIChjb25zdCByZXNvbHZlIG9mIG91dGdvaW5nLnZhbHVlcygpKSB7XG4gICAgICByZXNvbHZlKHtcbiAgICAgICAgc3RhdHVzOiAtMSxcbiAgICAgICAgbWVzc2FnZTogJ0Nvbm5lY3Rpb24gY2xvc2VkJyxcbiAgICAgICAgcmVzcG9uc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVhZGVyczogW10sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEFjdGl2ZShyZXF1ZXN0OiBJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QgfCBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZVJlcXVlc3RzLmFkZChyZXF1ZXN0KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQWN0aXZlKHJlcXVlc3Q6IEluY29taW5nV2ViU29ja2V0UmVxdWVzdCB8IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hY3RpdmVSZXF1ZXN0cy5oYXMocmVxdWVzdCkpIHtcbiAgICAgIGxvZy53YXJuKCdXZWJTb2NrZXRSZXNvdXJjZTogcmVtb3ZpbmcgdW5rbm93biByZXF1ZXN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVSZXF1ZXN0cy5kZWxldGUocmVxdWVzdCk7XG4gICAgaWYgKHRoaXMuYWN0aXZlUmVxdWVzdHMuc2l6ZSAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2h1dHRpbmdEb3duKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2h1dGRvd25UaW1lcikge1xuICAgICAgVGltZXJzLmNsZWFyVGltZW91dCh0aGlzLnNodXRkb3duVGltZXIpO1xuICAgICAgdGhpcy5zaHV0ZG93blRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCdXZWJTb2NrZXRSZXNvdXJjZTogc2h1dGRvd24gY29tcGxldGUnKTtcbiAgICB0aGlzLmNsb3NlKDMwMDAsICdTaHV0ZG93bicpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEtlZXBBbGl2ZU9wdGlvbnNUeXBlID0ge1xuICBwYXRoPzogc3RyaW5nO1xuICBkaXNjb25uZWN0PzogYm9vbGVhbjtcbn07XG5cbi8vIDMwIHNlY29uZHMgKyA1IHNlY29uZHMgZm9yIGNsb3NpbmcgdGhlIHNvY2tldCBhYm92ZS5cbmNvbnN0IEtFRVBBTElWRV9JTlRFUlZBTF9NUyA9IDMwICogZHVyYXRpb25zLlNFQ09ORDtcbmNvbnN0IE1BWF9LRUVQQUxJVkVfSU5URVJWQUxfTVMgPSA1ICogZHVyYXRpb25zLk1JTlVURTtcblxuY2xhc3MgS2VlcEFsaXZlIHtcbiAgcHJpdmF0ZSBrZWVwQWxpdmVUaW1lcjogVGltZXJzLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBkaXNjb25uZWN0VGltZXI6IFRpbWVycy5UaW1lb3V0IHwgdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuXG4gIHByaXZhdGUgZGlzY29ubmVjdDogYm9vbGVhbjtcblxuICBwcml2YXRlIHdzcjogV2ViU29ja2V0UmVzb3VyY2U7XG5cbiAgcHJpdmF0ZSBsYXN0QWxpdmVBdDogbnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB3ZWJzb2NrZXRSZXNvdXJjZTogV2ViU29ja2V0UmVzb3VyY2UsXG4gICAgb3B0czogS2VlcEFsaXZlT3B0aW9uc1R5cGUgPSB7fVxuICApIHtcbiAgICBpZiAod2Vic29ja2V0UmVzb3VyY2UgaW5zdGFuY2VvZiBXZWJTb2NrZXRSZXNvdXJjZSkge1xuICAgICAgdGhpcy5wYXRoID0gb3B0cy5wYXRoICE9PSB1bmRlZmluZWQgPyBvcHRzLnBhdGggOiAnLyc7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QgPSBvcHRzLmRpc2Nvbm5lY3QgIT09IHVuZGVmaW5lZCA/IG9wdHMuZGlzY29ubmVjdCA6IHRydWU7XG4gICAgICB0aGlzLndzciA9IHdlYnNvY2tldFJlc291cmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdLZWVwQWxpdmUgZXhwZWN0ZWQgYSBXZWJTb2NrZXRSZXNvdXJjZScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdG9wKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZW5kKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcblxuICAgIGlmIChpc09sZGVyVGhhbih0aGlzLmxhc3RBbGl2ZUF0LCBNQVhfS0VFUEFMSVZFX0lOVEVSVkFMX01TKSkge1xuICAgICAgbG9nLmluZm8oJ1dlYlNvY2tldFJlc291cmNlczogZGlzY29ubmVjdGluZyBkdWUgdG8gc3RhbGUgc3RhdGUnKTtcbiAgICAgIHRoaXMud3NyLmNsb3NlKFxuICAgICAgICAzMDAxLFxuICAgICAgICBgTGFzdCBrZWVwYWxpdmUgcmVxdWVzdCB3YXMgdG9vIGZhciBpbiB0aGUgcGFzdDogJHt0aGlzLmxhc3RBbGl2ZUF0fWBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGlzY29ubmVjdCkge1xuICAgICAgLy8gYXV0b21hdGljYWxseSBkaXNjb25uZWN0IGlmIHNlcnZlciBkb2Vzbid0IGFja1xuICAgICAgdGhpcy5kaXNjb25uZWN0VGltZXIgPSBUaW1lcnMuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxvZy5pbmZvKCdXZWJTb2NrZXRSZXNvdXJjZXM6IGRpc2Nvbm5lY3RpbmcgZHVlIHRvIG5vIHJlc3BvbnNlJyk7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcblxuICAgICAgICB0aGlzLndzci5jbG9zZSgzMDAxLCAnTm8gcmVzcG9uc2UgdG8ga2VlcGFsaXZlIHJlcXVlc3QnKTtcbiAgICAgIH0sIDEwMDAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKCdXZWJTb2NrZXRSZXNvdXJjZXM6IFNlbmRpbmcgYSBrZWVwYWxpdmUgbWVzc2FnZScpO1xuICAgIGNvbnN0IHsgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLndzci5zZW5kUmVxdWVzdCh7XG4gICAgICB2ZXJiOiAnR0VUJyxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICB9KTtcblxuICAgIGlmIChzdGF0dXMgPj0gMjAwIHx8IHN0YXR1cyA8IDMwMCkge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmxhc3RBbGl2ZUF0ID0gRGF0ZS5ub3coKTtcblxuICAgIHRoaXMuY2xlYXJUaW1lcnMoKTtcblxuICAgIHRoaXMua2VlcEFsaXZlVGltZXIgPSBUaW1lcnMuc2V0VGltZW91dChcbiAgICAgICgpID0+IHRoaXMuc2VuZCgpLFxuICAgICAgS0VFUEFMSVZFX0lOVEVSVkFMX01TXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJUaW1lcnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMua2VlcEFsaXZlVGltZXIpIHtcbiAgICAgIFRpbWVycy5jbGVhclRpbWVvdXQodGhpcy5rZWVwQWxpdmVUaW1lcik7XG4gICAgICB0aGlzLmtlZXBBbGl2ZVRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXNjb25uZWN0VGltZXIpIHtcbiAgICAgIFRpbWVycy5jbGVhclRpbWVvdXQodGhpcy5kaXNjb25uZWN0VGltZXIpO1xuICAgICAgdGhpcy5kaXNjb25uZWN0VGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTBCQSxrQkFBaUI7QUFHakIseUJBQXdCO0FBRXhCLGdCQUEyQjtBQUMzQixzQkFBeUI7QUFDekIsdUJBQTRCO0FBQzVCLG9CQUE2QjtBQUM3QixhQUF3QjtBQUN4QixzQkFBdUM7QUFDdkMsVUFBcUI7QUFDckIsYUFBd0I7QUFFeEIsTUFBTSxpQkFBaUIsS0FBSyxVQUFVO0FBRXRDLE1BQU0sbUJBQW1CLE1BQU07QUFFeEIsTUFBTSx5QkFBeUI7QUFBQSxFQVdwQyxZQUNFLFNBQ2lCLFdBQ2pCO0FBRGlCO0FBRWpCLG9DQUFhLFFBQVEsSUFBSSxvQkFBb0I7QUFDN0Msb0NBQWEsUUFBUSxNQUFNLHNC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
