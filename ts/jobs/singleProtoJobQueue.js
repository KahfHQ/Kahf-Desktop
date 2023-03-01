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
var singleProtoJobQueue_exports = {};
__export(singleProtoJobQueue_exports, {
  SingleProtoJobQueue: () => SingleProtoJobQueue,
  singleProtoJobQueue: () => singleProtoJobQueue
});
module.exports = __toCommonJS(singleProtoJobQueue_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_lodash = require("lodash");
var Bytes = __toESM(require("../Bytes"));
var import_exponentialBackoff = require("../util/exponentialBackoff");
var import_JobQueue = require("./JobQueue");
var import_JobQueueDatabaseStore = require("./JobQueueDatabaseStore");
var import_durations = require("../util/durations");
var import_commonShouldJobContinue = require("./helpers/commonShouldJobContinue");
var import_protobuf = require("../protobuf");
var import_handleMessageSend = require("../util/handleMessageSend");
var import_getSendOptions = require("../util/getSendOptions");
var import_SendMessage = require("../textsecure/SendMessage");
var import_handleMultipleSendErrors = require("./helpers/handleMultipleSendErrors");
var import_isConversationUnregistered = require("../util/isConversationUnregistered");
var import_isConversationAccepted = require("../util/isConversationAccepted");
const MAX_RETRY_TIME = import_durations.DAY;
const MAX_PARALLEL_JOBS = 5;
const MAX_ATTEMPTS = (0, import_exponentialBackoff.exponentialBackoffMaxAttempts)(MAX_RETRY_TIME);
class SingleProtoJobQueue extends import_JobQueue.JobQueue {
  constructor() {
    super(...arguments);
    this.parallelQueue = new import_p_queue.default({ concurrency: MAX_PARALLEL_JOBS });
  }
  getInMemoryQueue(_parsedJob) {
    return this.parallelQueue;
  }
  parseData(data) {
    return import_SendMessage.singleProtoJobDataSchema.parse(data);
  }
  async run({
    data,
    timestamp
  }, { attempt, log }) {
    const timeRemaining = timestamp + MAX_RETRY_TIME - Date.now();
    const isFinalAttempt = attempt >= MAX_ATTEMPTS;
    const shouldContinue = await (0, import_commonShouldJobContinue.commonShouldJobContinue)({
      attempt,
      log,
      timeRemaining,
      skipWait: false
    });
    if (!shouldContinue) {
      return;
    }
    const {
      contentHint,
      identifier,
      isSyncMessage,
      messageIds = [],
      protoBase64,
      type,
      urgent
    } = data;
    log.info(`starting ${type} send to ${identifier} with timestamp ${timestamp}`);
    const conversation = window.ConversationController.get(identifier);
    if (!conversation) {
      throw new Error(`Failed to get conversation for identifier ${identifier}`);
    }
    if (!(0, import_isConversationAccepted.isConversationAccepted)(conversation.attributes)) {
      log.info(`conversation ${conversation.idForLogging()} is not accepted; refusing to send`);
      return;
    }
    if ((0, import_isConversationUnregistered.isConversationUnregistered)(conversation.attributes)) {
      log.info(`conversation ${conversation.idForLogging()} is unregistered; refusing to send`);
      return;
    }
    if (conversation.isBlocked()) {
      log.info(`conversation ${conversation.idForLogging()} is blocked; refusing to send`);
      return;
    }
    const proto = import_protobuf.SignalService.Content.decode(Bytes.fromBase64(protoBase64));
    const options = await (0, import_getSendOptions.getSendOptions)(conversation.attributes, {
      syncMessage: isSyncMessage
    });
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("messaging is not available!");
    }
    try {
      await (0, import_handleMessageSend.handleMessageSend)(messaging.sendIndividualProto({
        contentHint,
        identifier,
        options,
        proto,
        timestamp,
        urgent: (0, import_lodash.isBoolean)(urgent) ? urgent : true
      }), { messageIds, sendType: type });
    } catch (error) {
      await (0, import_handleMultipleSendErrors.handleMultipleSendErrors)({
        errors: (0, import_handleMultipleSendErrors.maybeExpandErrors)(error),
        isFinalAttempt,
        log,
        timeRemaining,
        toThrow: error
      });
    }
  }
}
const singleProtoJobQueue = new SingleProtoJobQueue({
  maxAttempts: MAX_ATTEMPTS,
  queueType: "single proto",
  store: import_JobQueueDatabaseStore.jobQueueDatabaseStore
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleProtoJobQueue,
  singleProtoJobQueue
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2luZ2xlUHJvdG9Kb2JRdWV1ZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuaW1wb3J0IHsgaXNCb29sZWFuIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vQnl0ZXMnO1xuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvTG9nZ2luZyc7XG5pbXBvcnQgeyBleHBvbmVudGlhbEJhY2tvZmZNYXhBdHRlbXB0cyB9IGZyb20gJy4uL3V0aWwvZXhwb25lbnRpYWxCYWNrb2ZmJztcbmltcG9ydCB0eXBlIHsgUGFyc2VkSm9iIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBKb2JRdWV1ZSB9IGZyb20gJy4vSm9iUXVldWUnO1xuaW1wb3J0IHsgam9iUXVldWVEYXRhYmFzZVN0b3JlIH0gZnJvbSAnLi9Kb2JRdWV1ZURhdGFiYXNlU3RvcmUnO1xuaW1wb3J0IHsgREFZIH0gZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgY29tbW9uU2hvdWxkSm9iQ29udGludWUgfSBmcm9tICcuL2hlbHBlcnMvY29tbW9uU2hvdWxkSm9iQ29udGludWUnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uL3Byb3RvYnVmJztcbmltcG9ydCB7IGhhbmRsZU1lc3NhZ2VTZW5kIH0gZnJvbSAnLi4vdXRpbC9oYW5kbGVNZXNzYWdlU2VuZCc7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4uL3V0aWwvZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBTaW5nbGVQcm90b0pvYkRhdGEgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1NlbmRNZXNzYWdlJztcbmltcG9ydCB7IHNpbmdsZVByb3RvSm9iRGF0YVNjaGVtYSB9IGZyb20gJy4uL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuaW1wb3J0IHtcbiAgaGFuZGxlTXVsdGlwbGVTZW5kRXJyb3JzLFxuICBtYXliZUV4cGFuZEVycm9ycyxcbn0gZnJvbSAnLi9oZWxwZXJzL2hhbmRsZU11bHRpcGxlU2VuZEVycm9ycyc7XG5pbXBvcnQgeyBpc0NvbnZlcnNhdGlvblVucmVnaXN0ZXJlZCB9IGZyb20gJy4uL3V0aWwvaXNDb252ZXJzYXRpb25VbnJlZ2lzdGVyZWQnO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25BY2NlcHRlZCB9IGZyb20gJy4uL3V0aWwvaXNDb252ZXJzYXRpb25BY2NlcHRlZCc7XG5cbmNvbnN0IE1BWF9SRVRSWV9USU1FID0gREFZO1xuY29uc3QgTUFYX1BBUkFMTEVMX0pPQlMgPSA1O1xuY29uc3QgTUFYX0FUVEVNUFRTID0gZXhwb25lbnRpYWxCYWNrb2ZmTWF4QXR0ZW1wdHMoTUFYX1JFVFJZX1RJTUUpO1xuXG5leHBvcnQgY2xhc3MgU2luZ2xlUHJvdG9Kb2JRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPFNpbmdsZVByb3RvSm9iRGF0YT4ge1xuICBwcml2YXRlIHBhcmFsbGVsUXVldWUgPSBuZXcgUFF1ZXVlKHsgY29uY3VycmVuY3k6IE1BWF9QQVJBTExFTF9KT0JTIH0pO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRJbk1lbW9yeVF1ZXVlKFxuICAgIF9wYXJzZWRKb2I6IFBhcnNlZEpvYjxTaW5nbGVQcm90b0pvYkRhdGE+XG4gICk6IFBRdWV1ZSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYWxsZWxRdWV1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IFNpbmdsZVByb3RvSm9iRGF0YSB7XG4gICAgcmV0dXJuIHNpbmdsZVByb3RvSm9iRGF0YVNjaGVtYS5wYXJzZShkYXRhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBydW4oXG4gICAge1xuICAgICAgZGF0YSxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9OiBSZWFkb25seTx7IGRhdGE6IFNpbmdsZVByb3RvSm9iRGF0YTsgdGltZXN0YW1wOiBudW1iZXIgfT4sXG4gICAgeyBhdHRlbXB0LCBsb2cgfTogUmVhZG9ubHk8eyBhdHRlbXB0OiBudW1iZXI7IGxvZzogTG9nZ2VyVHlwZSB9PlxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB0aW1lUmVtYWluaW5nID0gdGltZXN0YW1wICsgTUFYX1JFVFJZX1RJTUUgLSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGlzRmluYWxBdHRlbXB0ID0gYXR0ZW1wdCA+PSBNQVhfQVRURU1QVFM7XG5cbiAgICBjb25zdCBzaG91bGRDb250aW51ZSA9IGF3YWl0IGNvbW1vblNob3VsZEpvYkNvbnRpbnVlKHtcbiAgICAgIGF0dGVtcHQsXG4gICAgICBsb2csXG4gICAgICB0aW1lUmVtYWluaW5nLFxuICAgICAgc2tpcFdhaXQ6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBjb250ZW50SGludCxcbiAgICAgIGlkZW50aWZpZXIsXG4gICAgICBpc1N5bmNNZXNzYWdlLFxuICAgICAgbWVzc2FnZUlkcyA9IFtdLFxuICAgICAgcHJvdG9CYXNlNjQsXG4gICAgICB0eXBlLFxuICAgICAgdXJnZW50LFxuICAgIH0gPSBkYXRhO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYHN0YXJ0aW5nICR7dHlwZX0gc2VuZCB0byAke2lkZW50aWZpZXJ9IHdpdGggdGltZXN0YW1wICR7dGltZXN0YW1wfWBcbiAgICApO1xuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkZW50aWZpZXIpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBGYWlsZWQgdG8gZ2V0IGNvbnZlcnNhdGlvbiBmb3IgaWRlbnRpZmllciAke2lkZW50aWZpZXJ9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzQ29udmVyc2F0aW9uQWNjZXB0ZWQoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX0gaXMgbm90IGFjY2VwdGVkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IGlzIHVucmVnaXN0ZXJlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb252ZXJzYXRpb24uaXNCbG9ja2VkKCkpIHtcbiAgICAgIGxvZy5pbmZvKFxuICAgICAgICBgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpfSBpcyBibG9ja2VkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm90byA9IFByb3RvLkNvbnRlbnQuZGVjb2RlKEJ5dGVzLmZyb21CYXNlNjQocHJvdG9CYXNlNjQpKTtcbiAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgZ2V0U2VuZE9wdGlvbnMoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsIHtcbiAgICAgIHN5bmNNZXNzYWdlOiBpc1N5bmNNZXNzYWdlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgIGlmICghbWVzc2FnaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlIScpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVNZXNzYWdlU2VuZChcbiAgICAgICAgbWVzc2FnaW5nLnNlbmRJbmRpdmlkdWFsUHJvdG8oe1xuICAgICAgICAgIGNvbnRlbnRIaW50LFxuICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICBwcm90byxcbiAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgdXJnZW50OiBpc0Jvb2xlYW4odXJnZW50KSA/IHVyZ2VudCA6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICB7IG1lc3NhZ2VJZHMsIHNlbmRUeXBlOiB0eXBlIH1cbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIGF3YWl0IGhhbmRsZU11bHRpcGxlU2VuZEVycm9ycyh7XG4gICAgICAgIGVycm9yczogbWF5YmVFeHBhbmRFcnJvcnMoZXJyb3IpLFxuICAgICAgICBpc0ZpbmFsQXR0ZW1wdCxcbiAgICAgICAgbG9nLFxuICAgICAgICB0aW1lUmVtYWluaW5nLFxuICAgICAgICB0b1Rocm93OiBlcnJvcixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2luZ2xlUHJvdG9Kb2JRdWV1ZSA9IG5ldyBTaW5nbGVQcm90b0pvYlF1ZXVlKHtcbiAgbWF4QXR0ZW1wdHM6IE1BWF9BVFRFTVBUUyxcbiAgcXVldWVUeXBlOiAnc2luZ2xlIHByb3RvJyxcbiAgc3RvcmU6IGpvYlF1ZXVlRGF0YWJhc2VTdG9yZSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EscUJBQW1CO0FBQ25CLG9CQUEwQjtBQUUxQixZQUF1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
