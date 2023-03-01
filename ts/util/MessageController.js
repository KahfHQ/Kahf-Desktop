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
var MessageController_exports = {};
__export(MessageController_exports, {
  MessageController: () => MessageController
});
module.exports = __toCommonJS(MessageController_exports);
var durations = __toESM(require("./durations"));
var log = __toESM(require("../logging/log"));
var import_iterables = require("./iterables");
var import_isNotNil = require("./isNotNil");
var import_RemoteConfig = require("../RemoteConfig");
const FIVE_MINUTES = 5 * durations.MINUTE;
class MessageController {
  constructor() {
    this.messageLookup = /* @__PURE__ */ Object.create(null);
    this.msgIDsBySender = /* @__PURE__ */ new Map();
    this.msgIDsBySentAt = /* @__PURE__ */ new Map();
  }
  static install() {
    const instance = new MessageController();
    window.MessageController = instance;
    instance.startCleanupInterval();
    return instance;
  }
  register(id, data) {
    if (!id || !data) {
      throw new Error("MessageController.register: Got falsey id or message");
    }
    const existing = this.messageLookup[id];
    if (existing) {
      this.messageLookup[id] = {
        message: existing.message,
        timestamp: Date.now()
      };
      return existing.message;
    }
    const message = "attributes" in data ? data : new window.Whisper.Message(data);
    this.messageLookup[id] = {
      message,
      timestamp: Date.now()
    };
    const sentAt = message.get("sent_at");
    const previousIdsBySentAt = this.msgIDsBySentAt.get(sentAt);
    if (previousIdsBySentAt) {
      previousIdsBySentAt.add(id);
    } else {
      this.msgIDsBySentAt.set(sentAt, /* @__PURE__ */ new Set([id]));
    }
    this.msgIDsBySender.set(message.getSenderIdentifier(), id);
    return message;
  }
  unregister(id) {
    const { message } = this.messageLookup[id] || {};
    if (message) {
      this.msgIDsBySender.delete(message.getSenderIdentifier());
      const sentAt = message.get("sent_at");
      const idsBySentAt = this.msgIDsBySentAt.get(sentAt) || /* @__PURE__ */ new Set();
      idsBySentAt.delete(id);
      if (!idsBySentAt.size) {
        this.msgIDsBySentAt.delete(sentAt);
      }
    }
    delete this.messageLookup[id];
  }
  cleanup() {
    const messages = Object.values(this.messageLookup);
    const now = Date.now();
    for (let i = 0, max = messages.length; i < max; i += 1) {
      const { message, timestamp } = messages[i];
      const conversation = message.getConversation();
      const state = window.reduxStore.getState();
      const selectedId = state?.conversations?.selectedConversationId;
      const inActiveConversation = conversation && selectedId && conversation.id === selectedId;
      if (now - timestamp > FIVE_MINUTES && !inActiveConversation) {
        this.unregister(message.id);
      }
    }
  }
  getById(id) {
    const existing = this.messageLookup[id];
    return existing && existing.message ? existing.message : void 0;
  }
  filterBySentAt(sentAt) {
    const ids = this.msgIDsBySentAt.get(sentAt) || [];
    const maybeMessages = (0, import_iterables.map)(ids, (id) => this.getById(id));
    return (0, import_iterables.filter)(maybeMessages, import_isNotNil.isNotNil);
  }
  findBySender(sender) {
    const id = this.msgIDsBySender.get(sender);
    if (!id) {
      return void 0;
    }
    return this.getById(id);
  }
  update(predicate) {
    const values = Object.values(this.messageLookup);
    log.info(`MessageController.update: About to process ${values.length} messages`);
    values.forEach(({ message }) => predicate(message));
  }
  _get() {
    return this.messageLookup;
  }
  startCleanupInterval() {
    return setInterval(this.cleanup.bind(this), (0, import_RemoteConfig.isEnabled)("desktop.messageCleanup") ? FIVE_MINUTES : durations.HOUR);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageController
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZUNvbnRyb2xsZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlcyc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi9kdXJhdGlvbnMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IG1hcCwgZmlsdGVyIH0gZnJvbSAnLi9pdGVyYWJsZXMnO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuL2lzTm90TmlsJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgeyBpc0VuYWJsZWQgfSBmcm9tICcuLi9SZW1vdGVDb25maWcnO1xuXG5jb25zdCBGSVZFX01JTlVURVMgPSA1ICogZHVyYXRpb25zLk1JTlVURTtcblxudHlwZSBMb29rdXBJdGVtVHlwZSA9IHtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbDtcbn07XG50eXBlIExvb2t1cFR5cGUgPSBSZWNvcmQ8c3RyaW5nLCBMb29rdXBJdGVtVHlwZT47XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlQ29udHJvbGxlciB7XG4gIHByaXZhdGUgbWVzc2FnZUxvb2t1cDogTG9va3VwVHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgcHJpdmF0ZSBtc2dJRHNCeVNlbmRlciA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSBtc2dJRHNCeVNlbnRBdCA9IG5ldyBNYXA8bnVtYmVyLCBTZXQ8c3RyaW5nPj4oKTtcblxuICBzdGF0aWMgaW5zdGFsbCgpOiBNZXNzYWdlQ29udHJvbGxlciB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgTWVzc2FnZUNvbnRyb2xsZXIoKTtcbiAgICB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIgPSBpbnN0YW5jZTtcblxuICAgIGluc3RhbmNlLnN0YXJ0Q2xlYW51cEludGVydmFsKCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgcmVnaXN0ZXIoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBkYXRhOiBNZXNzYWdlTW9kZWwgfCBNZXNzYWdlQXR0cmlidXRlc1R5cGVcbiAgKTogTWVzc2FnZU1vZGVsIHtcbiAgICBpZiAoIWlkIHx8ICFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyOiBHb3QgZmFsc2V5IGlkIG9yIG1lc3NhZ2UnKTtcbiAgICB9XG5cbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMubWVzc2FnZUxvb2t1cFtpZF07XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VMb29rdXBbaWRdID0ge1xuICAgICAgICBtZXNzYWdlOiBleGlzdGluZy5tZXNzYWdlLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGV4aXN0aW5nLm1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAnYXR0cmlidXRlcycgaW4gZGF0YSA/IGRhdGEgOiBuZXcgd2luZG93LldoaXNwZXIuTWVzc2FnZShkYXRhKTtcbiAgICB0aGlzLm1lc3NhZ2VMb29rdXBbaWRdID0ge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VudEF0ID0gbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKTtcbiAgICBjb25zdCBwcmV2aW91c0lkc0J5U2VudEF0ID0gdGhpcy5tc2dJRHNCeVNlbnRBdC5nZXQoc2VudEF0KTtcbiAgICBpZiAocHJldmlvdXNJZHNCeVNlbnRBdCkge1xuICAgICAgcHJldmlvdXNJZHNCeVNlbnRBdC5hZGQoaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1zZ0lEc0J5U2VudEF0LnNldChzZW50QXQsIG5ldyBTZXQoW2lkXSkpO1xuICAgIH1cblxuICAgIHRoaXMubXNnSURzQnlTZW5kZXIuc2V0KG1lc3NhZ2UuZ2V0U2VuZGVySWRlbnRpZmllcigpLCBpZCk7XG5cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIHVucmVnaXN0ZXIoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gdGhpcy5tZXNzYWdlTG9va3VwW2lkXSB8fCB7fTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5tc2dJRHNCeVNlbmRlci5kZWxldGUobWVzc2FnZS5nZXRTZW5kZXJJZGVudGlmaWVyKCkpO1xuXG4gICAgICBjb25zdCBzZW50QXQgPSBtZXNzYWdlLmdldCgnc2VudF9hdCcpO1xuICAgICAgY29uc3QgaWRzQnlTZW50QXQgPSB0aGlzLm1zZ0lEc0J5U2VudEF0LmdldChzZW50QXQpIHx8IG5ldyBTZXQoKTtcbiAgICAgIGlkc0J5U2VudEF0LmRlbGV0ZShpZCk7XG4gICAgICBpZiAoIWlkc0J5U2VudEF0LnNpemUpIHtcbiAgICAgICAgdGhpcy5tc2dJRHNCeVNlbnRBdC5kZWxldGUoc2VudEF0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGVsZXRlIHRoaXMubWVzc2FnZUxvb2t1cFtpZF07XG4gIH1cblxuICBjbGVhbnVwKCk6IHZvaWQge1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gT2JqZWN0LnZhbHVlcyh0aGlzLm1lc3NhZ2VMb29rdXApO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbWF4OyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSwgdGltZXN0YW1wIH0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IG1lc3NhZ2UuZ2V0Q29udmVyc2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IHN0YXRlID0gd2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSWQgPSBzdGF0ZT8uY29udmVyc2F0aW9ucz8uc2VsZWN0ZWRDb252ZXJzYXRpb25JZDtcbiAgICAgIGNvbnN0IGluQWN0aXZlQ29udmVyc2F0aW9uID1cbiAgICAgICAgY29udmVyc2F0aW9uICYmIHNlbGVjdGVkSWQgJiYgY29udmVyc2F0aW9uLmlkID09PSBzZWxlY3RlZElkO1xuXG4gICAgICBpZiAobm93IC0gdGltZXN0YW1wID4gRklWRV9NSU5VVEVTICYmICFpbkFjdGl2ZUNvbnZlcnNhdGlvbikge1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXIobWVzc2FnZS5pZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0QnlJZChpZDogc3RyaW5nKTogTWVzc2FnZU1vZGVsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMubWVzc2FnZUxvb2t1cFtpZF07XG4gICAgcmV0dXJuIGV4aXN0aW5nICYmIGV4aXN0aW5nLm1lc3NhZ2UgPyBleGlzdGluZy5tZXNzYWdlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZmlsdGVyQnlTZW50QXQoc2VudEF0OiBudW1iZXIpOiBJdGVyYWJsZTxNZXNzYWdlTW9kZWw+IHtcbiAgICBjb25zdCBpZHMgPSB0aGlzLm1zZ0lEc0J5U2VudEF0LmdldChzZW50QXQpIHx8IFtdO1xuICAgIGNvbnN0IG1heWJlTWVzc2FnZXMgPSBtYXAoaWRzLCBpZCA9PiB0aGlzLmdldEJ5SWQoaWQpKTtcbiAgICByZXR1cm4gZmlsdGVyKG1heWJlTWVzc2FnZXMsIGlzTm90TmlsKTtcbiAgfVxuXG4gIGZpbmRCeVNlbmRlcihzZW5kZXI6IHN0cmluZyk6IE1lc3NhZ2VNb2RlbCB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgaWQgPSB0aGlzLm1zZ0lEc0J5U2VuZGVyLmdldChzZW5kZXIpO1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldEJ5SWQoaWQpO1xuICB9XG5cbiAgdXBkYXRlKHByZWRpY2F0ZTogKG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXModGhpcy5tZXNzYWdlTG9va3VwKTtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGBNZXNzYWdlQ29udHJvbGxlci51cGRhdGU6IEFib3V0IHRvIHByb2Nlc3MgJHt2YWx1ZXMubGVuZ3RofSBtZXNzYWdlc2BcbiAgICApO1xuICAgIHZhbHVlcy5mb3JFYWNoKCh7IG1lc3NhZ2UgfSkgPT4gcHJlZGljYXRlKG1lc3NhZ2UpKTtcbiAgfVxuXG4gIF9nZXQoKTogTG9va3VwVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZUxvb2t1cDtcbiAgfVxuXG4gIHN0YXJ0Q2xlYW51cEludGVydmFsKCk6IE5vZGVKUy5UaW1lb3V0IHwgbnVtYmVyIHtcbiAgICByZXR1cm4gc2V0SW50ZXJ2YWwoXG4gICAgICB0aGlzLmNsZWFudXAuYmluZCh0aGlzKSxcbiAgICAgIGlzRW5hYmxlZCgnZGVza3RvcC5tZXNzYWdlQ2xlYW51cCcpID8gRklWRV9NSU5VVEVTIDogZHVyYXRpb25zLkhPVVJcbiAgICApO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsZ0JBQTJCO0FBQzNCLFVBQXFCO0FBQ3JCLHVCQUE0QjtBQUM1QixzQkFBeUI7QUFFekIsMEJBQTBCO0FBRTFCLE1BQU0sZUFBZSxJQUFJLFVBQVU7QUFRNUIsTUFBTSxrQkFBa0I7QUFBQSxFQUF4QjtBQUNH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
