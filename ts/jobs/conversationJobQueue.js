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
var conversationJobQueue_exports = {};
__export(conversationJobQueue_exports, {
  ConversationJobQueue: () => ConversationJobQueue,
  conversationJobQueue: () => conversationJobQueue,
  conversationQueueJobDataSchema: () => conversationQueueJobDataSchema,
  conversationQueueJobEnum: () => conversationQueueJobEnum
});
module.exports = __toCommonJS(conversationJobQueue_exports);
var import_zod = require("zod");
var globalLogger = __toESM(require("../logging/log"));
var durations = __toESM(require("../util/durations"));
var import_exponentialBackoff = require("../util/exponentialBackoff");
var import_commonShouldJobContinue = require("./helpers/commonShouldJobContinue");
var import_InMemoryQueues = require("./helpers/InMemoryQueues");
var import_JobQueueDatabaseStore = require("./JobQueueDatabaseStore");
var import_JobQueue = require("./JobQueue");
var import_sendNormalMessage = require("./helpers/sendNormalMessage");
var import_sendDirectExpirationTimerUpdate = require("./helpers/sendDirectExpirationTimerUpdate");
var import_sendGroupUpdate = require("./helpers/sendGroupUpdate");
var import_sendDeleteForEveryone = require("./helpers/sendDeleteForEveryone");
var import_sendProfileKey = require("./helpers/sendProfileKey");
var import_sendReaction = require("./helpers/sendReaction");
var import_sendStory = require("./helpers/sendStory");
var import_conversationsEnums = require("../state/ducks/conversationsEnums");
var import_sleep = require("../util/sleep");
var import_durations = require("../util/durations");
var import_Errors = require("../textsecure/Errors");
var import_assert = require("../util/assert");
var import_missingCaseError = require("../util/missingCaseError");
var import_explodePromise = require("../util/explodePromise");
const conversationQueueJobEnum = import_zod.z.enum([
  "DeleteForEveryone",
  "DirectExpirationTimerUpdate",
  "GroupUpdate",
  "NormalMessage",
  "ProfileKey",
  "Reaction",
  "Story"
]);
const deleteForEveryoneJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.DeleteForEveryone),
  conversationId: import_zod.z.string(),
  messageId: import_zod.z.string(),
  recipients: import_zod.z.array(import_zod.z.string()),
  revision: import_zod.z.number().optional(),
  targetTimestamp: import_zod.z.number()
});
const expirationTimerUpdateJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.DirectExpirationTimerUpdate),
  conversationId: import_zod.z.string(),
  expireTimer: import_zod.z.number().or(import_zod.z.undefined())
});
const groupUpdateJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.GroupUpdate),
  conversationId: import_zod.z.string(),
  groupChangeBase64: import_zod.z.string().optional(),
  recipients: import_zod.z.array(import_zod.z.string()),
  revision: import_zod.z.number()
});
const normalMessageSendJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.NormalMessage),
  conversationId: import_zod.z.string(),
  messageId: import_zod.z.string(),
  revision: import_zod.z.number().optional()
});
const profileKeyJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.ProfileKey),
  conversationId: import_zod.z.string(),
  revision: import_zod.z.number().optional()
});
const reactionJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.Reaction),
  conversationId: import_zod.z.string(),
  messageId: import_zod.z.string(),
  revision: import_zod.z.number().optional()
});
const storyJobDataSchema = import_zod.z.object({
  type: import_zod.z.literal(conversationQueueJobEnum.enum.Story),
  conversationId: import_zod.z.string(),
  messageIds: import_zod.z.string().array(),
  timestamp: import_zod.z.number(),
  revision: import_zod.z.number().optional()
});
const conversationQueueJobDataSchema = import_zod.z.union([
  deleteForEveryoneJobDataSchema,
  expirationTimerUpdateJobDataSchema,
  groupUpdateJobDataSchema,
  normalMessageSendJobDataSchema,
  profileKeyJobDataSchema,
  reactionJobDataSchema,
  storyJobDataSchema
]);
const MAX_RETRY_TIME = durations.DAY;
const MAX_ATTEMPTS = (0, import_exponentialBackoff.exponentialBackoffMaxAttempts)(MAX_RETRY_TIME);
class ConversationJobQueue extends import_JobQueue.JobQueue {
  constructor() {
    super(...arguments);
    this.inMemoryQueues = new import_InMemoryQueues.InMemoryQueues();
    this.verificationWaitMap = /* @__PURE__ */ new Map();
  }
  async add(data, insert) {
    const { conversationId } = data;
    (0, import_assert.strictAssert)(window.Signal.challengeHandler, "conversationJobQueue.add: Missing challengeHandler!");
    window.Signal.challengeHandler.maybeSolve(conversationId);
    return super.add(data, insert);
  }
  parseData(data) {
    return conversationQueueJobDataSchema.parse(data);
  }
  getInMemoryQueue({
    data
  }) {
    return this.inMemoryQueues.get(data.conversationId);
  }
  startVerificationWaiter(conversationId) {
    const existing = this.verificationWaitMap.get(conversationId);
    if (existing) {
      globalLogger.info(`startVerificationWaiter: Found existing waiter for conversation ${conversationId}. Returning it.`);
      return existing.promise;
    }
    globalLogger.info(`startVerificationWaiter: Starting new waiter for conversation ${conversationId}.`);
    const { resolve, reject, promise } = (0, import_explodePromise.explodePromise)();
    this.verificationWaitMap.set(conversationId, {
      resolve,
      reject,
      promise
    });
    return promise;
  }
  resolveVerificationWaiter(conversationId) {
    const existing = this.verificationWaitMap.get(conversationId);
    if (existing) {
      globalLogger.info(`resolveVerificationWaiter: Found waiter for conversation ${conversationId}. Resolving.`);
      existing.resolve("resolveVerificationWaiter: success");
      this.verificationWaitMap.delete(conversationId);
    } else {
      globalLogger.warn(`resolveVerificationWaiter: Missing waiter for conversation ${conversationId}.`);
    }
  }
  async run({
    data,
    timestamp
  }, { attempt, log }) {
    const { type, conversationId } = data;
    const isFinalAttempt = attempt >= MAX_ATTEMPTS;
    await window.ConversationController.load();
    const conversation = window.ConversationController.get(conversationId);
    if (!conversation) {
      throw new Error(`Failed to find conversation ${conversationId}`);
    }
    let timeRemaining;
    let shouldContinue;
    let count = 0;
    while (true) {
      count += 1;
      log.info("calculating timeRemaining and shouldContinue...");
      timeRemaining = timestamp + MAX_RETRY_TIME - Date.now();
      shouldContinue = await (0, import_commonShouldJobContinue.commonShouldJobContinue)({
        attempt,
        log,
        timeRemaining,
        skipWait: count > 1
      });
      if (!shouldContinue) {
        break;
      }
      if (window.Signal.challengeHandler?.isRegistered(conversationId)) {
        log.info("captcha challenge is pending for this conversation; waiting at most 5m...");
        await Promise.race([
          this.startVerificationWaiter(conversation.id),
          (0, import_sleep.sleep)(5 * import_durations.MINUTE)
        ]);
        continue;
      }
      const verificationData = window.reduxStore.getState().conversations.verificationDataByConversation[conversationId];
      if (!verificationData) {
        break;
      }
      if (verificationData.type === import_conversationsEnums.ConversationVerificationState.PendingVerification) {
        log.info("verification is pending for this conversation; waiting at most 5m...");
        await Promise.race([
          this.startVerificationWaiter(conversation.id),
          (0, import_sleep.sleep)(5 * import_durations.MINUTE)
        ]);
        continue;
      }
      if (verificationData.type === import_conversationsEnums.ConversationVerificationState.VerificationCancelled) {
        if (verificationData.canceledAt >= timestamp) {
          log.info("cancelling job; user cancelled out of verification dialog.");
          shouldContinue = false;
        } else {
          log.info("clearing cancellation tombstone; continuing ahead with job");
          window.reduxActions.conversations.clearCancelledConversationVerification(conversation.id);
        }
        break;
      }
      throw (0, import_missingCaseError.missingCaseError)(verificationData);
    }
    const { messaging } = window.textsecure;
    if (!messaging) {
      throw new Error("messaging interface is not available!");
    }
    const jobBundle = {
      messaging,
      isFinalAttempt,
      shouldContinue,
      timeRemaining,
      timestamp,
      log
    };
    const jobSet = conversationQueueJobEnum.enum;
    try {
      switch (type) {
        case jobSet.DeleteForEveryone:
          await (0, import_sendDeleteForEveryone.sendDeleteForEveryone)(conversation, jobBundle, data);
          break;
        case jobSet.DirectExpirationTimerUpdate:
          await (0, import_sendDirectExpirationTimerUpdate.sendDirectExpirationTimerUpdate)(conversation, jobBundle, data);
          break;
        case jobSet.GroupUpdate:
          await (0, import_sendGroupUpdate.sendGroupUpdate)(conversation, jobBundle, data);
          break;
        case jobSet.NormalMessage:
          await (0, import_sendNormalMessage.sendNormalMessage)(conversation, jobBundle, data);
          break;
        case jobSet.ProfileKey:
          await (0, import_sendProfileKey.sendProfileKey)(conversation, jobBundle, data);
          break;
        case jobSet.Reaction:
          await (0, import_sendReaction.sendReaction)(conversation, jobBundle, data);
          break;
        case jobSet.Story:
          await (0, import_sendStory.sendStory)(conversation, jobBundle, data);
          break;
        default: {
          const problem = type;
          log.error(`conversationJobQueue: Got job with type ${problem}; Cancelling job.`);
        }
      }
    } catch (error) {
      const untrustedUuids = [];
      const processError = /* @__PURE__ */ __name((toProcess) => {
        if (toProcess instanceof import_Errors.OutgoingIdentityKeyError) {
          const failedConversation = window.ConversationController.getOrCreate(toProcess.identifier, "private");
          (0, import_assert.strictAssert)(failedConversation, "Conversation should be created");
          const uuid = failedConversation.get("uuid");
          if (!uuid) {
            log.error(`failedConversation: Conversation ${failedConversation.idForLogging()} missing UUID!`);
            return;
          }
          untrustedUuids.push(uuid);
        } else if (toProcess instanceof import_Errors.SendMessageChallengeError) {
          window.Signal.challengeHandler?.register({
            conversationId,
            createdAt: Date.now(),
            retryAt: toProcess.retryAt,
            token: toProcess.data?.token
          }, toProcess.data);
        }
      }, "processError");
      processError(error);
      if (error instanceof import_Errors.SendMessageProtoError) {
        (error.errors || []).forEach(processError);
      }
      if (untrustedUuids.length) {
        log.error(`Send failed because ${untrustedUuids.length} conversation(s) were untrusted. Adding to verification list.`);
        window.reduxActions.conversations.conversationStoppedByMissingVerification({
          conversationId: conversation.id,
          untrustedUuids
        });
      }
      throw error;
    }
  }
}
const conversationJobQueue = new ConversationJobQueue({
  store: import_JobQueueDatabaseStore.jobQueueDatabaseStore,
  queueType: "conversation",
  maxAttempts: MAX_ATTEMPTS
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationJobQueue,
  conversationJobQueue,
  conversationQueueJobDataSchema,
  conversationQueueJobEnum
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9uSm9iUXVldWUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB0eXBlIFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCAqIGFzIGdsb2JhbExvZ2dlciBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5cbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBleHBvbmVudGlhbEJhY2tvZmZNYXhBdHRlbXB0cyB9IGZyb20gJy4uL3V0aWwvZXhwb25lbnRpYWxCYWNrb2ZmJztcbmltcG9ydCB7IGNvbW1vblNob3VsZEpvYkNvbnRpbnVlIH0gZnJvbSAnLi9oZWxwZXJzL2NvbW1vblNob3VsZEpvYkNvbnRpbnVlJztcbmltcG9ydCB7IEluTWVtb3J5UXVldWVzIH0gZnJvbSAnLi9oZWxwZXJzL0luTWVtb3J5UXVldWVzJztcbmltcG9ydCB7IGpvYlF1ZXVlRGF0YWJhc2VTdG9yZSB9IGZyb20gJy4vSm9iUXVldWVEYXRhYmFzZVN0b3JlJztcbmltcG9ydCB7IEpvYlF1ZXVlIH0gZnJvbSAnLi9Kb2JRdWV1ZSc7XG5cbmltcG9ydCB7IHNlbmROb3JtYWxNZXNzYWdlIH0gZnJvbSAnLi9oZWxwZXJzL3NlbmROb3JtYWxNZXNzYWdlJztcbmltcG9ydCB7IHNlbmREaXJlY3RFeHBpcmF0aW9uVGltZXJVcGRhdGUgfSBmcm9tICcuL2hlbHBlcnMvc2VuZERpcmVjdEV4cGlyYXRpb25UaW1lclVwZGF0ZSc7XG5pbXBvcnQgeyBzZW5kR3JvdXBVcGRhdGUgfSBmcm9tICcuL2hlbHBlcnMvc2VuZEdyb3VwVXBkYXRlJztcbmltcG9ydCB7IHNlbmREZWxldGVGb3JFdmVyeW9uZSB9IGZyb20gJy4vaGVscGVycy9zZW5kRGVsZXRlRm9yRXZlcnlvbmUnO1xuaW1wb3J0IHsgc2VuZFByb2ZpbGVLZXkgfSBmcm9tICcuL2hlbHBlcnMvc2VuZFByb2ZpbGVLZXknO1xuaW1wb3J0IHsgc2VuZFJlYWN0aW9uIH0gZnJvbSAnLi9oZWxwZXJzL3NlbmRSZWFjdGlvbic7XG5pbXBvcnQgeyBzZW5kU3RvcnkgfSBmcm9tICcuL2hlbHBlcnMvc2VuZFN0b3J5JztcblxuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvTG9nZ2luZyc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25WZXJpZmljYXRpb25TdGF0ZSB9IGZyb20gJy4uL3N0YXRlL2R1Y2tzL2NvbnZlcnNhdGlvbnNFbnVtcyc7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4uL3V0aWwvc2xlZXAnO1xuaW1wb3J0IHsgTUlOVVRFIH0gZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHtcbiAgT3V0Z29pbmdJZGVudGl0eUtleUVycm9yLFxuICBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yLFxuICBTZW5kTWVzc2FnZVByb3RvRXJyb3IsXG59IGZyb20gJy4uL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgZXhwbG9kZVByb21pc2UgfSBmcm9tICcuLi91dGlsL2V4cGxvZGVQcm9taXNlJztcbmltcG9ydCB0eXBlIHsgSm9iIH0gZnJvbSAnLi9Kb2InO1xuaW1wb3J0IHR5cGUgeyBQYXJzZWRKb2IgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB0eXBlIFNlbmRNZXNzYWdlIGZyb20gJy4uL3RleHRzZWN1cmUvU2VuZE1lc3NhZ2UnO1xuXG4vLyBOb3RlOiBnZW5lcmFsbHksIHdlIG9ubHkgd2FudCB0byBhZGQgdG8gdGhpcyBsaXN0LiBJZiB5b3UgZG8gbmVlZCB0byBjaGFuZ2Ugb25lIG9mXG4vLyAgIHRoZXNlIHZhbHVlcywgeW91J2xsIGxpa2VseSBuZWVkIHRvIHdyaXRlIGEgZGF0YWJhc2UgbWlncmF0aW9uLlxuZXhwb3J0IGNvbnN0IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bSA9IHouZW51bShbXG4gICdEZWxldGVGb3JFdmVyeW9uZScsXG4gICdEaXJlY3RFeHBpcmF0aW9uVGltZXJVcGRhdGUnLFxuICAnR3JvdXBVcGRhdGUnLFxuICAnTm9ybWFsTWVzc2FnZScsXG4gICdQcm9maWxlS2V5JyxcbiAgJ1JlYWN0aW9uJyxcbiAgJ1N0b3J5Jyxcbl0pO1xuXG5jb25zdCBkZWxldGVGb3JFdmVyeW9uZUpvYkRhdGFTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHR5cGU6IHoubGl0ZXJhbChjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0uZW51bS5EZWxldGVGb3JFdmVyeW9uZSksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICBtZXNzYWdlSWQ6IHouc3RyaW5nKCksXG4gIHJlY2lwaWVudHM6IHouYXJyYXkoei5zdHJpbmcoKSksXG4gIHJldmlzaW9uOiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG4gIHRhcmdldFRpbWVzdGFtcDogei5udW1iZXIoKSxcbn0pO1xuZXhwb3J0IHR5cGUgRGVsZXRlRm9yRXZlcnlvbmVKb2JEYXRhID0gei5pbmZlcjxcbiAgdHlwZW9mIGRlbGV0ZUZvckV2ZXJ5b25lSm9iRGF0YVNjaGVtYVxuPjtcblxuY29uc3QgZXhwaXJhdGlvblRpbWVyVXBkYXRlSm9iRGF0YVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgdHlwZTogei5saXRlcmFsKGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLkRpcmVjdEV4cGlyYXRpb25UaW1lclVwZGF0ZSksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICBleHBpcmVUaW1lcjogei5udW1iZXIoKS5vcih6LnVuZGVmaW5lZCgpKSxcbiAgLy8gTm90ZTogbm8gcmVjaXBpZW50cy9yZXZpc2lvbiwgYmVjYXVzZSB0aGlzIGpvYiBpcyBmb3IgMToxIGNvbnZlcnNhdGlvbnMgb25seSFcbn0pO1xuZXhwb3J0IHR5cGUgRXhwaXJhdGlvblRpbWVyVXBkYXRlSm9iRGF0YSA9IHouaW5mZXI8XG4gIHR5cGVvZiBleHBpcmF0aW9uVGltZXJVcGRhdGVKb2JEYXRhU2NoZW1hXG4+O1xuXG5jb25zdCBncm91cFVwZGF0ZUpvYkRhdGFTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHR5cGU6IHoubGl0ZXJhbChjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0uZW51bS5Hcm91cFVwZGF0ZSksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICBncm91cENoYW5nZUJhc2U2NDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICByZWNpcGllbnRzOiB6LmFycmF5KHouc3RyaW5nKCkpLFxuICByZXZpc2lvbjogei5udW1iZXIoKSxcbn0pO1xuZXhwb3J0IHR5cGUgR3JvdXBVcGRhdGVKb2JEYXRhID0gei5pbmZlcjx0eXBlb2YgZ3JvdXBVcGRhdGVKb2JEYXRhU2NoZW1hPjtcblxuY29uc3Qgbm9ybWFsTWVzc2FnZVNlbmRKb2JEYXRhU2NoZW1hID0gei5vYmplY3Qoe1xuICB0eXBlOiB6LmxpdGVyYWwoY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLmVudW0uTm9ybWFsTWVzc2FnZSksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICBtZXNzYWdlSWQ6IHouc3RyaW5nKCksXG4gIC8vIE5vdGU6IHJlY2lwaWVudHMgYXJlIGJha2VkIGludG8gdGhlIG1lc3NhZ2UgaXRzZWxmXG4gIHJldmlzaW9uOiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG59KTtcbmV4cG9ydCB0eXBlIE5vcm1hbE1lc3NhZ2VTZW5kSm9iRGF0YSA9IHouaW5mZXI8XG4gIHR5cGVvZiBub3JtYWxNZXNzYWdlU2VuZEpvYkRhdGFTY2hlbWFcbj47XG5cbmNvbnN0IHByb2ZpbGVLZXlKb2JEYXRhU2NoZW1hID0gei5vYmplY3Qoe1xuICB0eXBlOiB6LmxpdGVyYWwoY29udmVyc2F0aW9uUXVldWVKb2JFbnVtLmVudW0uUHJvZmlsZUtleSksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICAvLyBOb3RlOiB3ZSB3aWxsIHVzZSB3aGljaGV2ZXIgcmVjaXBpZW50cyBsaXN0IGlzIHVwIHRvIGRhdGUgd2hlbiB0aGlzIGpvYiBydW5zXG4gIHJldmlzaW9uOiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG59KTtcbmV4cG9ydCB0eXBlIFByb2ZpbGVLZXlKb2JEYXRhID0gei5pbmZlcjx0eXBlb2YgcHJvZmlsZUtleUpvYkRhdGFTY2hlbWE+O1xuXG5jb25zdCByZWFjdGlvbkpvYkRhdGFTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHR5cGU6IHoubGl0ZXJhbChjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0uZW51bS5SZWFjdGlvbiksXG4gIGNvbnZlcnNhdGlvbklkOiB6LnN0cmluZygpLFxuICBtZXNzYWdlSWQ6IHouc3RyaW5nKCksXG4gIC8vIE5vdGU6IHJlY2lwaWVudHMgYXJlIGJha2VkIGludG8gdGhlIG1lc3NhZ2UgaXRzZWxmXG4gIHJldmlzaW9uOiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG59KTtcbmV4cG9ydCB0eXBlIFJlYWN0aW9uSm9iRGF0YSA9IHouaW5mZXI8dHlwZW9mIHJlYWN0aW9uSm9iRGF0YVNjaGVtYT47XG5cbmNvbnN0IHN0b3J5Sm9iRGF0YVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgdHlwZTogei5saXRlcmFsKGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLlN0b3J5KSxcbiAgY29udmVyc2F0aW9uSWQ6IHouc3RyaW5nKCksXG4gIC8vIE5vdGU6IHJlY2lwaWVudHMgYXJlIGJha2VkIGludG8gdGhlIG1lc3NhZ2UgaXRzZWxmXG4gIG1lc3NhZ2VJZHM6IHouc3RyaW5nKCkuYXJyYXkoKSxcbiAgdGltZXN0YW1wOiB6Lm51bWJlcigpLFxuICByZXZpc2lvbjogei5udW1iZXIoKS5vcHRpb25hbCgpLFxufSk7XG5leHBvcnQgdHlwZSBTdG9yeUpvYkRhdGEgPSB6LmluZmVyPHR5cGVvZiBzdG9yeUpvYkRhdGFTY2hlbWE+O1xuXG5leHBvcnQgY29uc3QgY29udmVyc2F0aW9uUXVldWVKb2JEYXRhU2NoZW1hID0gei51bmlvbihbXG4gIGRlbGV0ZUZvckV2ZXJ5b25lSm9iRGF0YVNjaGVtYSxcbiAgZXhwaXJhdGlvblRpbWVyVXBkYXRlSm9iRGF0YVNjaGVtYSxcbiAgZ3JvdXBVcGRhdGVKb2JEYXRhU2NoZW1hLFxuICBub3JtYWxNZXNzYWdlU2VuZEpvYkRhdGFTY2hlbWEsXG4gIHByb2ZpbGVLZXlKb2JEYXRhU2NoZW1hLFxuICByZWFjdGlvbkpvYkRhdGFTY2hlbWEsXG4gIHN0b3J5Sm9iRGF0YVNjaGVtYSxcbl0pO1xuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uUXVldWVKb2JEYXRhID0gei5pbmZlcjxcbiAgdHlwZW9mIGNvbnZlcnNhdGlvblF1ZXVlSm9iRGF0YVNjaGVtYVxuPjtcblxuZXhwb3J0IHR5cGUgQ29udmVyc2F0aW9uUXVldWVKb2JCdW5kbGUgPSB7XG4gIGlzRmluYWxBdHRlbXB0OiBib29sZWFuO1xuICBsb2c6IExvZ2dlclR5cGU7XG4gIG1lc3NhZ2luZzogU2VuZE1lc3NhZ2U7XG4gIHNob3VsZENvbnRpbnVlOiBib29sZWFuO1xuICB0aW1lUmVtYWluaW5nOiBudW1iZXI7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufTtcblxuY29uc3QgTUFYX1JFVFJZX1RJTUUgPSBkdXJhdGlvbnMuREFZO1xuY29uc3QgTUFYX0FUVEVNUFRTID0gZXhwb25lbnRpYWxCYWNrb2ZmTWF4QXR0ZW1wdHMoTUFYX1JFVFJZX1RJTUUpO1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uSm9iUXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxDb252ZXJzYXRpb25RdWV1ZUpvYkRhdGE+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBpbk1lbW9yeVF1ZXVlcyA9IG5ldyBJbk1lbW9yeVF1ZXVlcygpO1xuICBwcml2YXRlIHJlYWRvbmx5IHZlcmlmaWNhdGlvbldhaXRNYXAgPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICB7XG4gICAgICByZXNvbHZlOiAodmFsdWU6IHVua25vd24pID0+IHVua25vd247XG4gICAgICByZWplY3Q6IChlcnJvcjogRXJyb3IpID0+IHVua25vd247XG4gICAgICBwcm9taXNlOiBQcm9taXNlPHVua25vd24+O1xuICAgIH1cbiAgPigpO1xuXG4gIHB1YmxpYyBvdmVycmlkZSBhc3luYyBhZGQoXG4gICAgZGF0YTogUmVhZG9ubHk8Q29udmVyc2F0aW9uUXVldWVKb2JEYXRhPixcbiAgICBpbnNlcnQ/OiAoam9iOiBQYXJzZWRKb2I8Q29udmVyc2F0aW9uUXVldWVKb2JEYXRhPikgPT4gUHJvbWlzZTx2b2lkPlxuICApOiBQcm9taXNlPEpvYjxDb252ZXJzYXRpb25RdWV1ZUpvYkRhdGE+PiB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gZGF0YTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICB3aW5kb3cuU2lnbmFsLmNoYWxsZW5nZUhhbmRsZXIsXG4gICAgICAnY29udmVyc2F0aW9uSm9iUXVldWUuYWRkOiBNaXNzaW5nIGNoYWxsZW5nZUhhbmRsZXIhJ1xuICAgICk7XG4gICAgd2luZG93LlNpZ25hbC5jaGFsbGVuZ2VIYW5kbGVyLm1heWJlU29sdmUoY29udmVyc2F0aW9uSWQpO1xuXG4gICAgcmV0dXJuIHN1cGVyLmFkZChkYXRhLCBpbnNlcnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlRGF0YShkYXRhOiB1bmtub3duKTogQ29udmVyc2F0aW9uUXVldWVKb2JEYXRhIHtcbiAgICByZXR1cm4gY29udmVyc2F0aW9uUXVldWVKb2JEYXRhU2NoZW1hLnBhcnNlKGRhdGEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldEluTWVtb3J5UXVldWUoe1xuICAgIGRhdGEsXG4gIH06IFJlYWRvbmx5PHsgZGF0YTogQ29udmVyc2F0aW9uUXVldWVKb2JEYXRhIH0+KTogUFF1ZXVlIHtcbiAgICByZXR1cm4gdGhpcy5pbk1lbW9yeVF1ZXVlcy5nZXQoZGF0YS5jb252ZXJzYXRpb25JZCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0VmVyaWZpY2F0aW9uV2FpdGVyKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMudmVyaWZpY2F0aW9uV2FpdE1hcC5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgZ2xvYmFsTG9nZ2VyLmluZm8oXG4gICAgICAgIGBzdGFydFZlcmlmaWNhdGlvbldhaXRlcjogRm91bmQgZXhpc3Rpbmcgd2FpdGVyIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH0uIFJldHVybmluZyBpdC5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIGV4aXN0aW5nLnByb21pc2U7XG4gICAgfVxuXG4gICAgZ2xvYmFsTG9nZ2VyLmluZm8oXG4gICAgICBgc3RhcnRWZXJpZmljYXRpb25XYWl0ZXI6IFN0YXJ0aW5nIG5ldyB3YWl0ZXIgZm9yIGNvbnZlcnNhdGlvbiAke2NvbnZlcnNhdGlvbklkfS5gXG4gICAgKTtcbiAgICBjb25zdCB7IHJlc29sdmUsIHJlamVjdCwgcHJvbWlzZSB9ID0gZXhwbG9kZVByb21pc2UoKTtcbiAgICB0aGlzLnZlcmlmaWNhdGlvbldhaXRNYXAuc2V0KGNvbnZlcnNhdGlvbklkLCB7XG4gICAgICByZXNvbHZlLFxuICAgICAgcmVqZWN0LFxuICAgICAgcHJvbWlzZSxcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmVWZXJpZmljYXRpb25XYWl0ZXIoY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy52ZXJpZmljYXRpb25XYWl0TWFwLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBnbG9iYWxMb2dnZXIuaW5mbyhcbiAgICAgICAgYHJlc29sdmVWZXJpZmljYXRpb25XYWl0ZXI6IEZvdW5kIHdhaXRlciBmb3IgY29udmVyc2F0aW9uICR7Y29udmVyc2F0aW9uSWR9LiBSZXNvbHZpbmcuYFxuICAgICAgKTtcbiAgICAgIGV4aXN0aW5nLnJlc29sdmUoJ3Jlc29sdmVWZXJpZmljYXRpb25XYWl0ZXI6IHN1Y2Nlc3MnKTtcbiAgICAgIHRoaXMudmVyaWZpY2F0aW9uV2FpdE1hcC5kZWxldGUoY29udmVyc2F0aW9uSWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxMb2dnZXIud2FybihcbiAgICAgICAgYHJlc29sdmVWZXJpZmljYXRpb25XYWl0ZXI6IE1pc3Npbmcgd2FpdGVyIGZvciBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH0uYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgcnVuKFxuICAgIHtcbiAgICAgIGRhdGEsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgfTogUmVhZG9ubHk8eyBkYXRhOiBDb252ZXJzYXRpb25RdWV1ZUpvYkRhdGE7IHRpbWVzdGFtcDogbnVtYmVyIH0+LFxuICAgIHsgYXR0ZW1wdCwgbG9nIH06IFJlYWRvbmx5PHsgYXR0ZW1wdDogbnVtYmVyOyBsb2c6IExvZ2dlclR5cGUgfT5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyB0eXBlLCBjb252ZXJzYXRpb25JZCB9ID0gZGF0YTtcbiAgICBjb25zdCBpc0ZpbmFsQXR0ZW1wdCA9IGF0dGVtcHQgPj0gTUFYX0FUVEVNUFRTO1xuXG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9hZCgpO1xuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmluZCBjb252ZXJzYXRpb24gJHtjb252ZXJzYXRpb25JZH1gKTtcbiAgICB9XG5cbiAgICBsZXQgdGltZVJlbWFpbmluZzogbnVtYmVyO1xuICAgIGxldCBzaG91bGRDb250aW51ZTogYm9vbGVhbjtcbiAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgbG9nLmluZm8oJ2NhbGN1bGF0aW5nIHRpbWVSZW1haW5pbmcgYW5kIHNob3VsZENvbnRpbnVlLi4uJyk7XG4gICAgICB0aW1lUmVtYWluaW5nID0gdGltZXN0YW1wICsgTUFYX1JFVFJZX1RJTUUgLSBEYXRlLm5vdygpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIHNob3VsZENvbnRpbnVlID0gYXdhaXQgY29tbW9uU2hvdWxkSm9iQ29udGludWUoe1xuICAgICAgICBhdHRlbXB0LFxuICAgICAgICBsb2csXG4gICAgICAgIHRpbWVSZW1haW5pbmcsXG4gICAgICAgIHNraXBXYWl0OiBjb3VudCA+IDEsXG4gICAgICB9KTtcbiAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmICh3aW5kb3cuU2lnbmFsLmNoYWxsZW5nZUhhbmRsZXI/LmlzUmVnaXN0ZXJlZChjb252ZXJzYXRpb25JZCkpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgJ2NhcHRjaGEgY2hhbGxlbmdlIGlzIHBlbmRpbmcgZm9yIHRoaXMgY29udmVyc2F0aW9uOyB3YWl0aW5nIGF0IG1vc3QgNW0uLi4nXG4gICAgICAgICk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgdGhpcy5zdGFydFZlcmlmaWNhdGlvbldhaXRlcihjb252ZXJzYXRpb24uaWQpLFxuICAgICAgICAgIHNsZWVwKDUgKiBNSU5VVEUpLFxuICAgICAgICBdKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZlcmlmaWNhdGlvbkRhdGEgPVxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpLmNvbnZlcnNhdGlvbnNcbiAgICAgICAgICAudmVyaWZpY2F0aW9uRGF0YUJ5Q29udmVyc2F0aW9uW2NvbnZlcnNhdGlvbklkXTtcblxuICAgICAgaWYgKCF2ZXJpZmljYXRpb25EYXRhKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHZlcmlmaWNhdGlvbkRhdGEudHlwZSA9PT1cbiAgICAgICAgQ29udmVyc2F0aW9uVmVyaWZpY2F0aW9uU3RhdGUuUGVuZGluZ1ZlcmlmaWNhdGlvblxuICAgICAgKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICd2ZXJpZmljYXRpb24gaXMgcGVuZGluZyBmb3IgdGhpcyBjb252ZXJzYXRpb247IHdhaXRpbmcgYXQgbW9zdCA1bS4uLidcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICB0aGlzLnN0YXJ0VmVyaWZpY2F0aW9uV2FpdGVyKGNvbnZlcnNhdGlvbi5pZCksXG4gICAgICAgICAgc2xlZXAoNSAqIE1JTlVURSksXG4gICAgICAgIF0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICB2ZXJpZmljYXRpb25EYXRhLnR5cGUgPT09XG4gICAgICAgIENvbnZlcnNhdGlvblZlcmlmaWNhdGlvblN0YXRlLlZlcmlmaWNhdGlvbkNhbmNlbGxlZFxuICAgICAgKSB7XG4gICAgICAgIGlmICh2ZXJpZmljYXRpb25EYXRhLmNhbmNlbGVkQXQgPj0gdGltZXN0YW1wKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAnY2FuY2VsbGluZyBqb2I7IHVzZXIgY2FuY2VsbGVkIG91dCBvZiB2ZXJpZmljYXRpb24gZGlhbG9nLidcbiAgICAgICAgICApO1xuICAgICAgICAgIHNob3VsZENvbnRpbnVlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICAnY2xlYXJpbmcgY2FuY2VsbGF0aW9uIHRvbWJzdG9uZTsgY29udGludWluZyBhaGVhZCB3aXRoIGpvYidcbiAgICAgICAgICApO1xuICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5jbGVhckNhbmNlbGxlZENvbnZlcnNhdGlvblZlcmlmaWNhdGlvbihcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5pZFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IodmVyaWZpY2F0aW9uRGF0YSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBtZXNzYWdpbmcgfSA9IHdpbmRvdy50ZXh0c2VjdXJlO1xuICAgIGlmICghbWVzc2FnaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2luZyBpbnRlcmZhY2UgaXMgbm90IGF2YWlsYWJsZSEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBqb2JCdW5kbGU6IENvbnZlcnNhdGlvblF1ZXVlSm9iQnVuZGxlID0ge1xuICAgICAgbWVzc2FnaW5nLFxuICAgICAgaXNGaW5hbEF0dGVtcHQsXG4gICAgICBzaG91bGRDb250aW51ZSxcbiAgICAgIHRpbWVSZW1haW5pbmcsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICBsb2csXG4gICAgfTtcbiAgICAvLyBOb3RlOiBBIHNpeC1sZXR0ZXIgdmFyaWFibGUgbWFrZXMgYmVsb3cgY29kZSBhdXRvZm9ybWF0dGluZyBlYXNpZXIgdG8gcmVhZC5cbiAgICBjb25zdCBqb2JTZXQgPSBjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0uZW51bTtcblxuICAgIHRyeSB7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBqb2JTZXQuRGVsZXRlRm9yRXZlcnlvbmU6XG4gICAgICAgICAgYXdhaXQgc2VuZERlbGV0ZUZvckV2ZXJ5b25lKGNvbnZlcnNhdGlvbiwgam9iQnVuZGxlLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBqb2JTZXQuRGlyZWN0RXhwaXJhdGlvblRpbWVyVXBkYXRlOlxuICAgICAgICAgIGF3YWl0IHNlbmREaXJlY3RFeHBpcmF0aW9uVGltZXJVcGRhdGUoY29udmVyc2F0aW9uLCBqb2JCdW5kbGUsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGpvYlNldC5Hcm91cFVwZGF0ZTpcbiAgICAgICAgICBhd2FpdCBzZW5kR3JvdXBVcGRhdGUoY29udmVyc2F0aW9uLCBqb2JCdW5kbGUsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGpvYlNldC5Ob3JtYWxNZXNzYWdlOlxuICAgICAgICAgIGF3YWl0IHNlbmROb3JtYWxNZXNzYWdlKGNvbnZlcnNhdGlvbiwgam9iQnVuZGxlLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBqb2JTZXQuUHJvZmlsZUtleTpcbiAgICAgICAgICBhd2FpdCBzZW5kUHJvZmlsZUtleShjb252ZXJzYXRpb24sIGpvYkJ1bmRsZSwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugam9iU2V0LlJlYWN0aW9uOlxuICAgICAgICAgIGF3YWl0IHNlbmRSZWFjdGlvbihjb252ZXJzYXRpb24sIGpvYkJ1bmRsZSwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugam9iU2V0LlN0b3J5OlxuICAgICAgICAgIGF3YWl0IHNlbmRTdG9yeShjb252ZXJzYXRpb24sIGpvYkJ1bmRsZSwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAvLyBOb3RlOiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4sIGJlY2F1c2UgdGhlIHpvZCBjYWxsIGluIHBhcnNlRGF0YSB3b3VsZG4ndFxuICAgICAgICAgIC8vICAgYWNjZXB0IGRhdGEgdGhhdCBkb2Vzbid0IGxvb2sgbGlrZSBvdXIgdHlwZSBzcGVjaWZpY2F0aW9uLlxuICAgICAgICAgIGNvbnN0IHByb2JsZW06IG5ldmVyID0gdHlwZTtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICBgY29udmVyc2F0aW9uSm9iUXVldWU6IEdvdCBqb2Igd2l0aCB0eXBlICR7cHJvYmxlbX07IENhbmNlbGxpbmcgam9iLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIGNvbnN0IHVudHJ1c3RlZFV1aWRzOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgICAgIGNvbnN0IHByb2Nlc3NFcnJvciA9ICh0b1Byb2Nlc3M6IHVua25vd24pID0+IHtcbiAgICAgICAgaWYgKHRvUHJvY2VzcyBpbnN0YW5jZW9mIE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvcikge1xuICAgICAgICAgIGNvbnN0IGZhaWxlZENvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlKFxuICAgICAgICAgICAgdG9Qcm9jZXNzLmlkZW50aWZpZXIsXG4gICAgICAgICAgICAncHJpdmF0ZSdcbiAgICAgICAgICApO1xuICAgICAgICAgIHN0cmljdEFzc2VydChmYWlsZWRDb252ZXJzYXRpb24sICdDb252ZXJzYXRpb24gc2hvdWxkIGJlIGNyZWF0ZWQnKTtcbiAgICAgICAgICBjb25zdCB1dWlkID0gZmFpbGVkQ29udmVyc2F0aW9uLmdldCgndXVpZCcpO1xuICAgICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICBgZmFpbGVkQ29udmVyc2F0aW9uOiBDb252ZXJzYXRpb24gJHtmYWlsZWRDb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9IG1pc3NpbmcgVVVJRCFgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bnRydXN0ZWRVdWlkcy5wdXNoKHV1aWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRvUHJvY2VzcyBpbnN0YW5jZW9mIFNlbmRNZXNzYWdlQ2hhbGxlbmdlRXJyb3IpIHtcbiAgICAgICAgICB3aW5kb3cuU2lnbmFsLmNoYWxsZW5nZUhhbmRsZXI/LnJlZ2lzdGVyKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICByZXRyeUF0OiB0b1Byb2Nlc3MucmV0cnlBdCxcbiAgICAgICAgICAgICAgdG9rZW46IHRvUHJvY2Vzcy5kYXRhPy50b2tlbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b1Byb2Nlc3MuZGF0YVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHByb2Nlc3NFcnJvcihlcnJvcik7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBTZW5kTWVzc2FnZVByb3RvRXJyb3IpIHtcbiAgICAgICAgKGVycm9yLmVycm9ycyB8fCBbXSkuZm9yRWFjaChwcm9jZXNzRXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAodW50cnVzdGVkVXVpZHMubGVuZ3RoKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICBgU2VuZCBmYWlsZWQgYmVjYXVzZSAke3VudHJ1c3RlZFV1aWRzLmxlbmd0aH0gY29udmVyc2F0aW9uKHMpIHdlcmUgdW50cnVzdGVkLiBBZGRpbmcgdG8gdmVyaWZpY2F0aW9uIGxpc3QuYFxuICAgICAgICApO1xuICAgICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuY29udmVyc2F0aW9uU3RvcHBlZEJ5TWlzc2luZ1ZlcmlmaWNhdGlvbihcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgICAgICAgdW50cnVzdGVkVXVpZHMsXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbnZlcnNhdGlvbkpvYlF1ZXVlID0gbmV3IENvbnZlcnNhdGlvbkpvYlF1ZXVlKHtcbiAgc3RvcmU6IGpvYlF1ZXVlRGF0YWJhc2VTdG9yZSxcbiAgcXVldWVUeXBlOiAnY29udmVyc2F0aW9uJyxcbiAgbWF4QXR0ZW1wdHM6IE1BWF9BVFRFTVBUUyxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLGlCQUFrQjtBQUVsQixtQkFBOEI7QUFFOUIsZ0JBQTJCO0FBQzNCLGdDQUE4QztBQUM5QyxxQ0FBd0M7QUFDeEMsNEJBQStCO0FBQy9CLG1DQUFzQztBQUN0QyxzQkFBeUI7QUFFekIsK0JBQWtDO0FBQ2xDLDZDQUFnRDtBQUNoRCw2QkFBZ0M7QUFDaEMsbUNBQXNDO0FBQ3RDLDRCQUErQjtBQUMvQiwwQkFBNkI7QUFDN0IsdUJBQTBCO0FBRzFCLGdDQUE4QztBQUM5QyxtQkFBc0I7QUFDdEIsdUJBQXVC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
