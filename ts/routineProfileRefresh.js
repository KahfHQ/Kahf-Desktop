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
var routineProfileRefresh_exports = {};
__export(routineProfileRefresh_exports, {
  RoutineProfileRefresher: () => RoutineProfileRefresher,
  routineProfileRefresh: () => routineProfileRefresh
});
module.exports = __toCommonJS(routineProfileRefresh_exports);
var import_lodash = require("lodash");
var import_p_queue = __toESM(require("p-queue"));
var log = __toESM(require("./logging/log"));
var import_assert = require("./util/assert");
var import_sleep = require("./util/sleep");
var import_missingCaseError = require("./util/missingCaseError");
var import_isNormalNumber = require("./util/isNormalNumber");
var import_iterables = require("./util/iterables");
var Errors = __toESM(require("./types/errors"));
var import_getProfile = require("./util/getProfile");
var import_durations = require("./util/durations");
const STORAGE_KEY = "lastAttemptedToRefreshProfilesAt";
const MAX_AGE_TO_BE_CONSIDERED_ACTIVE = import_durations.MONTH;
const MAX_AGE_TO_BE_CONSIDERED_RECENTLY_REFRESHED = import_durations.DAY;
const MAX_CONVERSATIONS_TO_REFRESH = 50;
const MIN_ELAPSED_DURATION_TO_REFRESH_AGAIN = 12 * import_durations.HOUR;
const MIN_REFRESH_DELAY = import_durations.MINUTE;
let idCounter = 1;
class RoutineProfileRefresher {
  constructor(options) {
    this.options = options;
    this.started = false;
    idCounter += 1;
    this.id = idCounter;
    log.info(`Creating new RoutineProfileRefresher instance with id ${this.id}`);
  }
  async start() {
    const logId = `RoutineProfileRefresher.start/${this.id}`;
    if (this.started) {
      log.warn(`${logId}: already started!`);
      return;
    }
    this.started = true;
    const { storage, getAllConversations, getOurConversationId } = this.options;
    while (true) {
      const refreshInMs = timeUntilNextRefresh(storage);
      log.info(`${logId}: waiting for ${refreshInMs}ms`);
      await (0, import_sleep.sleep)(refreshInMs);
      const ourConversationId = getOurConversationId();
      if (!ourConversationId) {
        log.warn(`${logId}: missing our conversation id`);
        await (0, import_sleep.sleep)(MIN_REFRESH_DELAY);
        continue;
      }
      try {
        await routineProfileRefresh({
          allConversations: getAllConversations(),
          ourConversationId,
          storage,
          id: this.id
        });
      } catch (error) {
        log.error(`${logId}: failure`, Errors.toLogFormat(error));
      } finally {
        await (0, import_sleep.sleep)(MIN_REFRESH_DELAY);
      }
    }
  }
}
async function routineProfileRefresh({
  allConversations,
  ourConversationId,
  storage,
  id,
  getProfileFn = import_getProfile.getProfile
}) {
  const logId = `routineProfileRefresh/${id}`;
  log.info(`${logId}: starting`);
  const refreshInMs = timeUntilNextRefresh(storage);
  if (refreshInMs > 0) {
    log.info(`${logId}: too soon to refresh. Doing nothing`);
    return;
  }
  log.info(`${logId}: updating last refresh time`);
  await storage.put(STORAGE_KEY, Date.now());
  const conversationsToRefresh = getConversationsToRefresh(allConversations, ourConversationId);
  log.info(`${logId}: starting to refresh conversations`);
  let totalCount = 0;
  let successCount = 0;
  async function refreshConversation(conversation) {
    log.info(`${logId}: refreshing profile for ${conversation.idForLogging()}`);
    totalCount += 1;
    try {
      await getProfileFn(conversation.get("uuid"), conversation.get("e164"));
      log.info(`${logId}: refreshed profile for ${conversation.idForLogging()}`);
      successCount += 1;
    } catch (err) {
      log.error(`${logId}: refreshed profile for ${conversation.idForLogging()}`, err?.stack || err);
    }
  }
  const refreshQueue = new import_p_queue.default({
    concurrency: 5,
    timeout: import_durations.MINUTE * 30,
    throwOnTimeout: true
  });
  for (const conversation of conversationsToRefresh) {
    refreshQueue.add(() => refreshConversation(conversation));
  }
  await refreshQueue.onIdle();
  log.info(`${logId}: successfully refreshed ${successCount} out of ${totalCount} conversation(s)`);
}
function timeUntilNextRefresh(storage) {
  const storedValue = storage.get(STORAGE_KEY);
  if ((0, import_lodash.isNil)(storedValue)) {
    return 0;
  }
  if ((0, import_isNormalNumber.isNormalNumber)(storedValue)) {
    const planned = storedValue + MIN_ELAPSED_DURATION_TO_REFRESH_AGAIN;
    const now = Date.now();
    return Math.min(Math.max(0, planned - now), import_durations.WEEK);
  }
  (0, import_assert.assert)(false, `An invalid value was stored in ${STORAGE_KEY}; treating it as nil`);
  return 0;
}
function getConversationsToRefresh(conversations, ourConversationId) {
  const filteredConversations = getFilteredConversations(conversations, ourConversationId);
  return (0, import_iterables.take)(filteredConversations, MAX_CONVERSATIONS_TO_REFRESH);
}
function* getFilteredConversations(conversations, ourConversationId) {
  const sorted = (0, import_lodash.sortBy)(conversations, (c) => c.get("active_at"));
  const conversationIdsSeen = /* @__PURE__ */ new Set([ourConversationId]);
  for (const conversation of sorted) {
    const type = conversation.get("type");
    switch (type) {
      case "private":
        if (conversation.hasProfileKeyCredentialExpired() && (conversation.id === ourConversationId || !conversationIdsSeen.has(conversation.id))) {
          conversationIdsSeen.add(conversation.id);
          yield conversation;
          break;
        }
        if (!conversationIdsSeen.has(conversation.id) && isConversationActive(conversation) && !hasRefreshedProfileRecently(conversation)) {
          conversationIdsSeen.add(conversation.id);
          yield conversation;
        }
        break;
      case "group":
        for (const member of conversation.getMembers()) {
          if (!conversationIdsSeen.has(member.id) && !hasRefreshedProfileRecently(member)) {
            conversationIdsSeen.add(member.id);
            yield member;
          }
        }
        break;
      default:
        throw (0, import_missingCaseError.missingCaseError)(type);
    }
  }
}
function isConversationActive(conversation) {
  const activeAt = conversation.get("active_at");
  return (0, import_isNormalNumber.isNormalNumber)(activeAt) && activeAt + MAX_AGE_TO_BE_CONSIDERED_ACTIVE > Date.now();
}
function hasRefreshedProfileRecently(conversation) {
  const profileLastFetchedAt = conversation.get("profileLastFetchedAt");
  return (0, import_isNormalNumber.isNormalNumber)(profileLastFetchedAt) && profileLastFetchedAt + MAX_AGE_TO_BE_CONSIDERED_RECENTLY_REFRESHED > Date.now();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RoutineProfileRefresher,
  routineProfileRefresh
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicm91dGluZVByb2ZpbGVSZWZyZXNoLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgaXNOaWwsIHNvcnRCeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICcuL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi91dGlsL3NsZWVwJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgeyBpc05vcm1hbE51bWJlciB9IGZyb20gJy4vdXRpbC9pc05vcm1hbE51bWJlcic7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi91dGlsL2l0ZXJhYmxlcyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi9tb2RlbHMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFN0b3JhZ2VJbnRlcmZhY2UgfSBmcm9tICcuL3R5cGVzL1N0b3JhZ2UuZCc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgZ2V0UHJvZmlsZSB9IGZyb20gJy4vdXRpbC9nZXRQcm9maWxlJztcbmltcG9ydCB7IE1JTlVURSwgSE9VUiwgREFZLCBXRUVLLCBNT05USCB9IGZyb20gJy4vdXRpbC9kdXJhdGlvbnMnO1xuXG5jb25zdCBTVE9SQUdFX0tFWSA9ICdsYXN0QXR0ZW1wdGVkVG9SZWZyZXNoUHJvZmlsZXNBdCc7XG5jb25zdCBNQVhfQUdFX1RPX0JFX0NPTlNJREVSRURfQUNUSVZFID0gTU9OVEg7XG5jb25zdCBNQVhfQUdFX1RPX0JFX0NPTlNJREVSRURfUkVDRU5UTFlfUkVGUkVTSEVEID0gREFZO1xuY29uc3QgTUFYX0NPTlZFUlNBVElPTlNfVE9fUkVGUkVTSCA9IDUwO1xuY29uc3QgTUlOX0VMQVBTRURfRFVSQVRJT05fVE9fUkVGUkVTSF9BR0FJTiA9IDEyICogSE9VUjtcbmNvbnN0IE1JTl9SRUZSRVNIX0RFTEFZID0gTUlOVVRFO1xuXG5sZXQgaWRDb3VudGVyID0gMTtcblxuZXhwb3J0IGNsYXNzIFJvdXRpbmVQcm9maWxlUmVmcmVzaGVyIHtcbiAgcHJpdmF0ZSBzdGFydGVkID0gZmFsc2U7XG4gIHByaXZhdGUgaWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IHtcbiAgICAgIGdldEFsbENvbnZlcnNhdGlvbnM6ICgpID0+IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+O1xuICAgICAgZ2V0T3VyQ29udmVyc2F0aW9uSWQ6ICgpID0+IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIHN0b3JhZ2U6IFBpY2s8U3RvcmFnZUludGVyZmFjZSwgJ2dldCcgfCAncHV0Jz47XG4gICAgfVxuICApIHtcbiAgICAvLyBXZSBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IG9mIHRoZXNlIGNsYXNzZXMgd2UgY3JlYXRlLCBiZWNhdXNlIHdlIHN1c3BlY3QgdGhhdFxuICAgIC8vICAgdGhlcmUgbWlnaHQgYmUgdG9vIG1hbnkuLi5cbiAgICBpZENvdW50ZXIgKz0gMTtcbiAgICB0aGlzLmlkID0gaWRDb3VudGVyO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYENyZWF0aW5nIG5ldyBSb3V0aW5lUHJvZmlsZVJlZnJlc2hlciBpbnN0YW5jZSB3aXRoIGlkICR7dGhpcy5pZH1gXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsb2dJZCA9IGBSb3V0aW5lUHJvZmlsZVJlZnJlc2hlci5zdGFydC8ke3RoaXMuaWR9YDtcblxuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIGxvZy53YXJuKGAke2xvZ0lkfTogYWxyZWFkeSBzdGFydGVkIWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgeyBzdG9yYWdlLCBnZXRBbGxDb252ZXJzYXRpb25zLCBnZXRPdXJDb252ZXJzYXRpb25JZCB9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCByZWZyZXNoSW5NcyA9IHRpbWVVbnRpbE5leHRSZWZyZXNoKHN0b3JhZ2UpO1xuXG4gICAgICBsb2cuaW5mbyhgJHtsb2dJZH06IHdhaXRpbmcgZm9yICR7cmVmcmVzaEluTXN9bXNgKTtcblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IHNsZWVwKHJlZnJlc2hJbk1zKTtcblxuICAgICAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPSBnZXRPdXJDb252ZXJzYXRpb25JZCgpO1xuICAgICAgaWYgKCFvdXJDb252ZXJzYXRpb25JZCkge1xuICAgICAgICBsb2cud2FybihgJHtsb2dJZH06IG1pc3Npbmcgb3VyIGNvbnZlcnNhdGlvbiBpZGApO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGF3YWl0IHNsZWVwKE1JTl9SRUZSRVNIX0RFTEFZKTtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgcm91dGluZVByb2ZpbGVSZWZyZXNoKHtcbiAgICAgICAgICBhbGxDb252ZXJzYXRpb25zOiBnZXRBbGxDb252ZXJzYXRpb25zKCksXG4gICAgICAgICAgb3VyQ29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgc3RvcmFnZSxcbiAgICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2cuZXJyb3IoYCR7bG9nSWR9OiBmYWlsdXJlYCwgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBzbGVlcChNSU5fUkVGUkVTSF9ERUxBWSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByb3V0aW5lUHJvZmlsZVJlZnJlc2goe1xuICBhbGxDb252ZXJzYXRpb25zLFxuICBvdXJDb252ZXJzYXRpb25JZCxcbiAgc3RvcmFnZSxcbiAgaWQsXG4gIC8vIE9ubHkgZm9yIHRlc3RzXG4gIGdldFByb2ZpbGVGbiA9IGdldFByb2ZpbGUsXG59OiB7XG4gIGFsbENvbnZlcnNhdGlvbnM6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+O1xuICBvdXJDb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBzdG9yYWdlOiBQaWNrPFN0b3JhZ2VJbnRlcmZhY2UsICdnZXQnIHwgJ3B1dCc+O1xuICBpZDogbnVtYmVyO1xuICBnZXRQcm9maWxlRm4/OiB0eXBlb2YgZ2V0UHJvZmlsZTtcbn0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbG9nSWQgPSBgcm91dGluZVByb2ZpbGVSZWZyZXNoLyR7aWR9YDtcbiAgbG9nLmluZm8oYCR7bG9nSWR9OiBzdGFydGluZ2ApO1xuXG4gIGNvbnN0IHJlZnJlc2hJbk1zID0gdGltZVVudGlsTmV4dFJlZnJlc2goc3RvcmFnZSk7XG4gIGlmIChyZWZyZXNoSW5NcyA+IDApIHtcbiAgICBsb2cuaW5mbyhgJHtsb2dJZH06IHRvbyBzb29uIHRvIHJlZnJlc2guIERvaW5nIG5vdGhpbmdgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2cuaW5mbyhgJHtsb2dJZH06IHVwZGF0aW5nIGxhc3QgcmVmcmVzaCB0aW1lYCk7XG4gIGF3YWl0IHN0b3JhZ2UucHV0KFNUT1JBR0VfS0VZLCBEYXRlLm5vdygpKTtcblxuICBjb25zdCBjb252ZXJzYXRpb25zVG9SZWZyZXNoID0gZ2V0Q29udmVyc2F0aW9uc1RvUmVmcmVzaChcbiAgICBhbGxDb252ZXJzYXRpb25zLFxuICAgIG91ckNvbnZlcnNhdGlvbklkXG4gICk7XG5cbiAgbG9nLmluZm8oYCR7bG9nSWR9OiBzdGFydGluZyB0byByZWZyZXNoIGNvbnZlcnNhdGlvbnNgKTtcblxuICBsZXQgdG90YWxDb3VudCA9IDA7XG4gIGxldCBzdWNjZXNzQ291bnQgPSAwO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hDb252ZXJzYXRpb24oXG4gICAgY29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbyhgJHtsb2dJZH06IHJlZnJlc2hpbmcgcHJvZmlsZSBmb3IgJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YCk7XG5cbiAgICB0b3RhbENvdW50ICs9IDE7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGdldFByb2ZpbGVGbihjb252ZXJzYXRpb24uZ2V0KCd1dWlkJyksIGNvbnZlcnNhdGlvbi5nZXQoJ2UxNjQnKSk7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgYCR7bG9nSWR9OiByZWZyZXNoZWQgcHJvZmlsZSBmb3IgJHtjb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgKTtcbiAgICAgIHN1Y2Nlc3NDb3VudCArPSAxO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICBgJHtsb2dJZH06IHJlZnJlc2hlZCBwcm9maWxlIGZvciAke2NvbnZlcnNhdGlvbi5pZEZvckxvZ2dpbmcoKX1gLFxuICAgICAgICBlcnI/LnN0YWNrIHx8IGVyclxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWZyZXNoUXVldWUgPSBuZXcgUFF1ZXVlKHtcbiAgICBjb25jdXJyZW5jeTogNSxcbiAgICB0aW1lb3V0OiBNSU5VVEUgKiAzMCxcbiAgICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbiAgfSk7XG4gIGZvciAoY29uc3QgY29udmVyc2F0aW9uIG9mIGNvbnZlcnNhdGlvbnNUb1JlZnJlc2gpIHtcbiAgICByZWZyZXNoUXVldWUuYWRkKCgpID0+IHJlZnJlc2hDb252ZXJzYXRpb24oY29udmVyc2F0aW9uKSk7XG4gIH1cbiAgYXdhaXQgcmVmcmVzaFF1ZXVlLm9uSWRsZSgpO1xuXG4gIGxvZy5pbmZvKFxuICAgIGAke2xvZ0lkfTogc3VjY2Vzc2Z1bGx5IHJlZnJlc2hlZCAke3N1Y2Nlc3NDb3VudH0gb3V0IG9mICR7dG90YWxDb3VudH0gY29udmVyc2F0aW9uKHMpYFxuICApO1xufVxuXG5mdW5jdGlvbiB0aW1lVW50aWxOZXh0UmVmcmVzaChzdG9yYWdlOiBQaWNrPFN0b3JhZ2VJbnRlcmZhY2UsICdnZXQnPik6IG51bWJlciB7XG4gIGNvbnN0IHN0b3JlZFZhbHVlID0gc3RvcmFnZS5nZXQoU1RPUkFHRV9LRVkpO1xuXG4gIGlmIChpc05pbChzdG9yZWRWYWx1ZSkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChpc05vcm1hbE51bWJlcihzdG9yZWRWYWx1ZSkpIHtcbiAgICBjb25zdCBwbGFubmVkID0gc3RvcmVkVmFsdWUgKyBNSU5fRUxBUFNFRF9EVVJBVElPTl9UT19SRUZSRVNIX0FHQUlOO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KDAsIHBsYW5uZWQgLSBub3cpLCBXRUVLKTtcbiAgfVxuXG4gIGFzc2VydChcbiAgICBmYWxzZSxcbiAgICBgQW4gaW52YWxpZCB2YWx1ZSB3YXMgc3RvcmVkIGluICR7U1RPUkFHRV9LRVl9OyB0cmVhdGluZyBpdCBhcyBuaWxgXG4gICk7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBnZXRDb252ZXJzYXRpb25zVG9SZWZyZXNoKFxuICBjb252ZXJzYXRpb25zOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvbk1vZGVsPixcbiAgb3VyQ29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogSXRlcmFibGU8Q29udmVyc2F0aW9uTW9kZWw+IHtcbiAgY29uc3QgZmlsdGVyZWRDb252ZXJzYXRpb25zID0gZ2V0RmlsdGVyZWRDb252ZXJzYXRpb25zKFxuICAgIGNvbnZlcnNhdGlvbnMsXG4gICAgb3VyQ29udmVyc2F0aW9uSWRcbiAgKTtcbiAgcmV0dXJuIHRha2UoZmlsdGVyZWRDb252ZXJzYXRpb25zLCBNQVhfQ09OVkVSU0FUSU9OU19UT19SRUZSRVNIKTtcbn1cblxuZnVuY3Rpb24qIGdldEZpbHRlcmVkQ29udmVyc2F0aW9ucyhcbiAgY29udmVyc2F0aW9uczogUmVhZG9ubHlBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4sXG4gIG91ckNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbik6IEl0ZXJhYmxlPENvbnZlcnNhdGlvbk1vZGVsPiB7XG4gIGNvbnN0IHNvcnRlZCA9IHNvcnRCeShjb252ZXJzYXRpb25zLCBjID0+IGMuZ2V0KCdhY3RpdmVfYXQnKSk7XG5cbiAgY29uc3QgY29udmVyc2F0aW9uSWRzU2VlbiA9IG5ldyBTZXQ8c3RyaW5nPihbb3VyQ29udmVyc2F0aW9uSWRdKTtcblxuICBmb3IgKGNvbnN0IGNvbnZlcnNhdGlvbiBvZiBzb3J0ZWQpIHtcbiAgICBjb25zdCB0eXBlID0gY29udmVyc2F0aW9uLmdldCgndHlwZScpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncHJpdmF0ZSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb252ZXJzYXRpb24uaGFzUHJvZmlsZUtleUNyZWRlbnRpYWxFeHBpcmVkKCkgJiZcbiAgICAgICAgICAoY29udmVyc2F0aW9uLmlkID09PSBvdXJDb252ZXJzYXRpb25JZCB8fFxuICAgICAgICAgICAgIWNvbnZlcnNhdGlvbklkc1NlZW4uaGFzKGNvbnZlcnNhdGlvbi5pZCkpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkc1NlZW4uYWRkKGNvbnZlcnNhdGlvbi5pZCk7XG4gICAgICAgICAgeWllbGQgY29udmVyc2F0aW9uO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICFjb252ZXJzYXRpb25JZHNTZWVuLmhhcyhjb252ZXJzYXRpb24uaWQpICYmXG4gICAgICAgICAgaXNDb252ZXJzYXRpb25BY3RpdmUoY29udmVyc2F0aW9uKSAmJlxuICAgICAgICAgICFoYXNSZWZyZXNoZWRQcm9maWxlUmVjZW50bHkoY29udmVyc2F0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZHNTZWVuLmFkZChjb252ZXJzYXRpb24uaWQpO1xuICAgICAgICAgIHlpZWxkIGNvbnZlcnNhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dyb3VwJzpcbiAgICAgICAgZm9yIChjb25zdCBtZW1iZXIgb2YgY29udmVyc2F0aW9uLmdldE1lbWJlcnMoKSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFjb252ZXJzYXRpb25JZHNTZWVuLmhhcyhtZW1iZXIuaWQpICYmXG4gICAgICAgICAgICAhaGFzUmVmcmVzaGVkUHJvZmlsZVJlY2VudGx5KG1lbWJlcilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkc1NlZW4uYWRkKG1lbWJlci5pZCk7XG4gICAgICAgICAgICB5aWVsZCBtZW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcih0eXBlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNDb252ZXJzYXRpb25BY3RpdmUoXG4gIGNvbnZlcnNhdGlvbjogUmVhZG9ubHk8Q29udmVyc2F0aW9uTW9kZWw+XG4pOiBib29sZWFuIHtcbiAgY29uc3QgYWN0aXZlQXQgPSBjb252ZXJzYXRpb24uZ2V0KCdhY3RpdmVfYXQnKTtcbiAgcmV0dXJuIChcbiAgICBpc05vcm1hbE51bWJlcihhY3RpdmVBdCkgJiZcbiAgICBhY3RpdmVBdCArIE1BWF9BR0VfVE9fQkVfQ09OU0lERVJFRF9BQ1RJVkUgPiBEYXRlLm5vdygpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhc1JlZnJlc2hlZFByb2ZpbGVSZWNlbnRseShcbiAgY29udmVyc2F0aW9uOiBSZWFkb25seTxDb252ZXJzYXRpb25Nb2RlbD5cbik6IGJvb2xlYW4ge1xuICBjb25zdCBwcm9maWxlTGFzdEZldGNoZWRBdCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3Byb2ZpbGVMYXN0RmV0Y2hlZEF0Jyk7XG4gIHJldHVybiAoXG4gICAgaXNOb3JtYWxOdW1iZXIocHJvZmlsZUxhc3RGZXRjaGVkQXQpICYmXG4gICAgcHJvZmlsZUxhc3RGZXRjaGVkQXQgKyBNQVhfQUdFX1RPX0JFX0NPTlNJREVSRURfUkVDRU5UTFlfUkVGUkVTSEVEID5cbiAgICAgIERhdGUubm93KClcbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUE4QjtBQUM5QixxQkFBbUI7QUFFbkIsVUFBcUI7QUFDckIsb0JBQXVCO0FBQ3ZCLG1CQUFzQjtBQUN0Qiw4QkFBaUM7QUFDakMsNEJBQStCO0FBQy9CLHVCQUFxQjtBQUdyQixhQUF3QjtBQUN4Qix3QkFBMkI7QUFDM0IsdUJBQStDO0FBRS9DLE1BQU0sY0FBYztBQUNwQixNQUFNLGtDQUFrQztBQUN4QyxNQUFNLDhDQUE4QztBQUNwRCxNQUFNLCtCQUErQjtBQUNyQyxNQUFNLHdDQUF3QyxLQUFLO0FBQ25ELE1BQU0sb0JBQW9CO0FBRTFCLElBQUksWUFBWTtBQUVULE1BQU0sd0JBQXdCO0FBQUEsRUFJbkMsWUFDbUIsU0FLakI7QUFMaUI7QUFKWCxtQkFBVTtBQVloQixpQkFBYTtBQUNiLFNBQUssS0FBSztBQUNWLFFBQUksS0FDRix5REFBeUQsS0FBSyxJQUNoRTtBQUFBLEVBQ0Y7QUFBQSxRQUVhLFFBQXVCO0FBQ2xDLFVBQU0sUUFBUSxpQ0FBaUMsS0FBSztBQUVwRCxRQUFJLEtBQUssU0FBUztBQUNoQixVQUFJLEtBQUssR0FBRyx5QkFBeUI7QUFDckM7QUFBQSxJQUNGO0FBQ0EsU0FBSyxVQUFVO0FBRWYsVUFBTSxFQUFFLFNBQVMscUJBQXFCLHlCQUF5QixLQUFLO0FBR3BFLFdBQU8sTUFBTTtBQUNYLFlBQU0sY0FBYyxxQkFBcUIsT0FBTztBQUVoRCxVQUFJLEtBQUssR0FBRyxzQkFBc0IsZUFBZTtBQUdqRCxZQUFNLHdCQUFNLFdBQVc7QUFFdkIsWUFBTSxvQkFBb0IscUJBQXFCO0FBQy9DLFVBQUksQ0FBQyxtQkFBbUI7QUFDdEIsWUFBSSxLQUFLLEdBQUcsb0NBQW9DO0FBR2hELGNBQU0sd0JBQU0saUJBQWlCO0FBRTdCO0FBQUEsTUFDRjtBQUVBLFVBQUk7QUFFRixjQUFNLHNCQUFzQjtBQUFBLFVBQzFCLGtCQUFrQixvQkFBb0I7QUFBQSxVQUN0QztBQUFBLFVBQ0E7QUFBQSxVQUNBLElBQUksS0FBSztBQUFBLFFBQ1gsQ0FBQztBQUFBLE1BQ0gsU0FBUyxPQUFQO0FBQ0EsWUFBSSxNQUFNLEdBQUcsa0JBQWtCLE9BQU8sWUFBWSxLQUFLLENBQUM7QUFBQSxNQUMxRCxVQUFFO0FBRUEsY0FBTSx3QkFBTSxpQkFBaUI7QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFsRU8sQUFvRVAscUNBQTRDO0FBQUEsRUFDMUM7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBLGVBQWU7QUFBQSxHQU9DO0FBQ2hCLFFBQU0sUUFBUSx5QkFBeUI7QUFDdkMsTUFBSSxLQUFLLEdBQUcsaUJBQWlCO0FBRTdCLFFBQU0sY0FBYyxxQkFBcUIsT0FBTztBQUNoRCxNQUFJLGNBQWMsR0FBRztBQUNuQixRQUFJLEtBQUssR0FBRywyQ0FBMkM7QUFDdkQ7QUFBQSxFQUNGO0FBRUEsTUFBSSxLQUFLLEdBQUcsbUNBQW1DO0FBQy9DLFFBQU0sUUFBUSxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUM7QUFFekMsUUFBTSx5QkFBeUIsMEJBQzdCLGtCQUNBLGlCQUNGO0FBRUEsTUFBSSxLQUFLLEdBQUcsMENBQTBDO0FBRXRELE1BQUksYUFBYTtBQUNqQixNQUFJLGVBQWU7QUFFbkIscUNBQ0UsY0FDZTtBQUNmLFFBQUksS0FBSyxHQUFHLGlDQUFpQyxhQUFhLGFBQWEsR0FBRztBQUUxRSxrQkFBYztBQUNkLFFBQUk7QUFDRixZQUFNLGFBQWEsYUFBYSxJQUFJLE1BQU0sR0FBRyxhQUFhLElBQUksTUFBTSxDQUFDO0FBQ3JFLFVBQUksS0FDRixHQUFHLGdDQUFnQyxhQUFhLGFBQWEsR0FDL0Q7QUFDQSxzQkFBZ0I7QUFBQSxJQUNsQixTQUFTLEtBQVA7QUFDQSxVQUFJLE1BQ0YsR0FBRyxnQ0FBZ0MsYUFBYSxhQUFhLEtBQzdELEtBQUssU0FBUyxHQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBbEJlLEFBb0JmLFFBQU0sZUFBZSxJQUFJLHVCQUFPO0FBQUEsSUFDOUIsYUFBYTtBQUFBLElBQ2IsU0FBUywwQkFBUztBQUFBLElBQ2xCLGdCQUFnQjtBQUFBLEVBQ2xCLENBQUM7QUFDRCxhQUFXLGdCQUFnQix3QkFBd0I7QUFDakQsaUJBQWEsSUFBSSxNQUFNLG9CQUFvQixZQUFZLENBQUM7QUFBQSxFQUMxRDtBQUNBLFFBQU0sYUFBYSxPQUFPO0FBRTFCLE1BQUksS0FDRixHQUFHLGlDQUFpQyx1QkFBdUIsNEJBQzdEO0FBQ0Y7QUFyRXNCLEFBdUV0Qiw4QkFBOEIsU0FBZ0Q7QUFDNUUsUUFBTSxjQUFjLFFBQVEsSUFBSSxXQUFXO0FBRTNDLE1BQUkseUJBQU0sV0FBVyxHQUFHO0FBQ3RCLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSwwQ0FBZSxXQUFXLEdBQUc7QUFDL0IsVUFBTSxVQUFVLGNBQWM7QUFDOUIsVUFBTSxNQUFNLEtBQUssSUFBSTtBQUNyQixXQUFPLEtBQUssSUFBSSxLQUFLLElBQUksR0FBRyxVQUFVLEdBQUcsR0FBRyxxQkFBSTtBQUFBLEVBQ2xEO0FBRUEsNEJBQ0UsT0FDQSxrQ0FBa0MsaUNBQ3BDO0FBQ0EsU0FBTztBQUNUO0FBbEJTLEFBb0JULG1DQUNFLGVBQ0EsbUJBQzZCO0FBQzdCLFFBQU0sd0JBQXdCLHlCQUM1QixlQUNBLGlCQUNGO0FBQ0EsU0FBTywyQkFBSyx1QkFBdUIsNEJBQTRCO0FBQ2pFO0FBVFMsQUFXVCxtQ0FDRSxlQUNBLG1CQUM2QjtBQUM3QixRQUFNLFNBQVMsMEJBQU8sZUFBZSxPQUFLLEVBQUUsSUFBSSxXQUFXLENBQUM7QUFFNUQsUUFBTSxzQkFBc0Isb0JBQUksSUFBWSxDQUFDLGlCQUFpQixDQUFDO0FBRS9ELGFBQVcsZ0JBQWdCLFFBQVE7QUFDakMsVUFBTSxPQUFPLGFBQWEsSUFBSSxNQUFNO0FBQ3BDLFlBQVE7QUFBQSxXQUNEO0FBQ0gsWUFDRSxhQUFhLCtCQUErQixLQUMzQyxjQUFhLE9BQU8scUJBQ25CLENBQUMsb0JBQW9CLElBQUksYUFBYSxFQUFFLElBQzFDO0FBQ0EsOEJBQW9CLElBQUksYUFBYSxFQUFFO0FBQ3ZDLGdCQUFNO0FBQ047QUFBQSxRQUNGO0FBRUEsWUFDRSxDQUFDLG9CQUFvQixJQUFJLGFBQWEsRUFBRSxLQUN4QyxxQkFBcUIsWUFBWSxLQUNqQyxDQUFDLDRCQUE0QixZQUFZLEdBQ3pDO0FBQ0EsOEJBQW9CLElBQUksYUFBYSxFQUFFO0FBQ3ZDLGdCQUFNO0FBQUEsUUFDUjtBQUNBO0FBQUEsV0FDRztBQUNILG1CQUFXLFVBQVUsYUFBYSxXQUFXLEdBQUc7QUFDOUMsY0FDRSxDQUFDLG9CQUFvQixJQUFJLE9BQU8sRUFBRSxLQUNsQyxDQUFDLDRCQUE0QixNQUFNLEdBQ25DO0FBQ0EsZ0NBQW9CLElBQUksT0FBTyxFQUFFO0FBQ2pDLGtCQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFDQTtBQUFBO0FBRUEsY0FBTSw4Q0FBaUIsSUFBSTtBQUFBO0FBQUEsRUFFakM7QUFDRjtBQTlDVSxBQWdEViw4QkFDRSxjQUNTO0FBQ1QsUUFBTSxXQUFXLGFBQWEsSUFBSSxXQUFXO0FBQzdDLFNBQ0UsMENBQWUsUUFBUSxLQUN2QixXQUFXLGtDQUFrQyxLQUFLLElBQUk7QUFFMUQ7QUFSUyxBQVVULHFDQUNFLGNBQ1M7QUFDVCxRQUFNLHVCQUF1QixhQUFhLElBQUksc0JBQXNCO0FBQ3BFLFNBQ0UsMENBQWUsb0JBQW9CLEtBQ25DLHVCQUF1Qiw4Q0FDckIsS0FBSyxJQUFJO0FBRWY7QUFUUyIsCiAgIm5hbWVzIjogW10KfQo=
