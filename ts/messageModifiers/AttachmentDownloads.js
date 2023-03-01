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
var AttachmentDownloads_exports = {};
__export(AttachmentDownloads_exports, {
  addJob: () => addJob,
  start: () => start,
  stop: () => stop
});
module.exports = __toCommonJS(AttachmentDownloads_exports);
var import_lodash = require("lodash");
var import_uuid = require("uuid");
var import_Client = __toESM(require("../sql/Client"));
var durations = __toESM(require("../util/durations"));
var import_clearTimeoutIfNecessary = require("../util/clearTimeoutIfNecessary");
var import_assert = require("../util/assert");
var import_downloadAttachment = require("../util/downloadAttachment");
var Bytes = __toESM(require("../Bytes"));
var Errors = __toESM(require("../types/errors"));
var log = __toESM(require("../logging/log"));
const {
  getMessageById,
  getAttachmentDownloadJobById,
  getNextAttachmentDownloadJobs,
  removeAttachmentDownloadJob,
  resetAttachmentDownloadPending,
  saveAttachmentDownloadJob,
  saveMessage,
  setAttachmentDownloadJobPending
} = import_Client.default;
const MAX_ATTACHMENT_JOB_PARALLELISM = 3;
const TICK_INTERVAL = durations.MINUTE;
const RETRY_BACKOFF = {
  1: 30 * durations.SECOND,
  2: 30 * durations.MINUTE,
  3: 6 * durations.HOUR
};
let enabled = false;
let timeout;
let logger;
const _activeAttachmentDownloadJobs = {};
async function start(options) {
  ({ logger } = options);
  if (!logger) {
    throw new Error("attachment_downloads/start: logger must be provided!");
  }
  logger.info("attachment_downloads/start: enabling");
  enabled = true;
  await resetAttachmentDownloadPending();
  _tick();
}
async function stop() {
  if (logger) {
    logger.info("attachment_downloads/stop: disabling");
  }
  enabled = false;
  (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
  timeout = null;
}
async function addJob(attachment, job) {
  if (!attachment) {
    throw new Error("attachments_download/addJob: attachment is required");
  }
  const { messageId, type, index } = job;
  if (!messageId) {
    throw new Error("attachments_download/addJob: job.messageId is required");
  }
  if (!type) {
    throw new Error("attachments_download/addJob: job.type is required");
  }
  if (!(0, import_lodash.isNumber)(index)) {
    throw new Error("attachments_download/addJob: index must be a number");
  }
  if (attachment.downloadJobId) {
    let existingJob = await getAttachmentDownloadJobById(attachment.downloadJobId);
    if (existingJob) {
      existingJob = { ...existingJob, attempts: 0 };
      if (_activeAttachmentDownloadJobs[existingJob.id]) {
        logger.info(`attachment_downloads/addJob: ${existingJob.id} already running`);
      } else {
        logger.info(`attachment_downloads/addJob: restarting existing job ${existingJob.id}`);
        _activeAttachmentDownloadJobs[existingJob.id] = _runJob(existingJob);
      }
      return {
        ...attachment,
        pending: true
      };
    }
  }
  const id = (0, import_uuid.v4)();
  const timestamp = Date.now();
  const toSave = {
    ...job,
    id,
    attachment,
    timestamp,
    pending: 0,
    attempts: 0
  };
  await saveAttachmentDownloadJob(toSave);
  _maybeStartJob();
  return {
    ...attachment,
    pending: true,
    downloadJobId: id
  };
}
async function _tick() {
  (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
  timeout = null;
  _maybeStartJob();
  timeout = setTimeout(_tick, TICK_INTERVAL);
}
async function _maybeStartJob() {
  if (!enabled) {
    logger.info("attachment_downloads/_maybeStartJob: not enabled, returning");
    return;
  }
  const jobCount = getActiveJobCount();
  const limit = MAX_ATTACHMENT_JOB_PARALLELISM - jobCount;
  if (limit <= 0) {
    logger.info("attachment_downloads/_maybeStartJob: reached active job limit, waiting");
    return;
  }
  const nextJobs = await getNextAttachmentDownloadJobs(limit);
  if (nextJobs.length <= 0) {
    logger.info("attachment_downloads/_maybeStartJob: no attachment jobs to run");
    return;
  }
  const secondJobCount = getActiveJobCount();
  const needed = MAX_ATTACHMENT_JOB_PARALLELISM - secondJobCount;
  if (needed <= 0) {
    logger.info("attachment_downloads/_maybeStartJob: reached active job limit after db query, waiting");
    return;
  }
  const jobs = nextJobs.slice(0, Math.min(needed, nextJobs.length));
  logger.info(`attachment_downloads/_maybeStartJob: starting ${jobs.length} jobs`);
  for (let i = 0, max = jobs.length; i < max; i += 1) {
    const job = jobs[i];
    const existing = _activeAttachmentDownloadJobs[job.id];
    if (existing) {
      logger.warn(`attachment_downloads/_maybeStartJob: Job ${job.id} is already running`);
    } else {
      logger.info(`attachment_downloads/_maybeStartJob: Starting job ${job.id}`);
      const promise = _runJob(job);
      _activeAttachmentDownloadJobs[job.id] = promise;
      const postProcess = /* @__PURE__ */ __name(async () => {
        const logId = `attachment_downloads/_maybeStartJob/postProcess/${job.id}`;
        try {
          await promise;
          if (_activeAttachmentDownloadJobs[job.id]) {
            throw new Error(`${logId}: Active attachments jobs list still has this job!`);
          }
        } catch (error) {
          log.error(`${logId}: Download job threw an error, deleting.`, Errors.toLogFormat(error));
          delete _activeAttachmentDownloadJobs[job.id];
          try {
            await _markAttachmentAsFailed(job);
          } catch (deleteError) {
            log.error(`${logId}: Failed to delete attachment job`, Errors.toLogFormat(error));
          } finally {
            _maybeStartJob();
          }
        }
      }, "postProcess");
      postProcess();
    }
  }
}
async function _runJob(job) {
  if (!job) {
    log.warn("attachment_downloads/_runJob: Job was missing!");
    return;
  }
  const { id, messageId, attachment, type, index, attempts } = job;
  let message;
  try {
    if (!job || !attachment || !messageId) {
      throw new Error(`_runJob: Key information required for job was missing. Job id: ${id}`);
    }
    logger.info(`attachment_downloads/_runJob(${id}): starting`);
    const pending = true;
    await setAttachmentDownloadJobPending(id, pending);
    message = await _getMessageById(id, messageId);
    if (!message) {
      return;
    }
    await _addAttachmentToMessage(message, { ...attachment, pending: true }, { type, index });
    const downloaded = await (0, import_downloadAttachment.downloadAttachment)(attachment);
    if (!downloaded) {
      logger.warn(`attachment_downloads/_runJob(${id}): Got 404 from server for CDN ${attachment.cdnNumber}, marking attachment ${attachment.cdnId || attachment.cdnKey} from message ${message.idForLogging()} as permanent error`);
      await _addAttachmentToMessage(message, _markAttachmentAsPermanentError(attachment), { type, index });
      await _finishJob(message, id);
      return;
    }
    const upgradedAttachment = await window.Signal.Migrations.processNewAttachment(downloaded);
    await _addAttachmentToMessage(message, (0, import_lodash.omit)(upgradedAttachment, "error"), {
      type,
      index
    });
    await _finishJob(message, id);
  } catch (error) {
    const logId = message ? message.idForLogging() : id || "<no id>";
    const currentAttempt = (attempts || 0) + 1;
    if (currentAttempt >= 3) {
      logger.error(`attachment_downloads/runJob(${id}): ${currentAttempt} failed attempts, marking attachment from message ${logId} as error:`, Errors.toLogFormat(error));
      try {
        await _addAttachmentToMessage(message, _markAttachmentAsTransientError(attachment), { type, index });
      } finally {
        await _finishJob(message, id);
      }
      return;
    }
    logger.error(`attachment_downloads/_runJob(${id}): Failed to download attachment type ${type} for message ${logId}, attempt ${currentAttempt}:`, Errors.toLogFormat(error));
    try {
      await _addAttachmentToMessage(message, {
        ...attachment,
        downloadJobId: id
      }, { type, index });
      if (message) {
        await saveMessage(message.attributes, {
          ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
        });
      }
      const failedJob = {
        ...job,
        pending: 0,
        attempts: currentAttempt,
        timestamp: Date.now() + (RETRY_BACKOFF[currentAttempt] || RETRY_BACKOFF[3])
      };
      await saveAttachmentDownloadJob(failedJob);
    } finally {
      delete _activeAttachmentDownloadJobs[id];
      _maybeStartJob();
    }
  }
}
async function _markAttachmentAsFailed(job) {
  const { id, messageId, attachment, type, index } = job;
  const message = await _getMessageById(id, messageId);
  if (!message) {
    return;
  }
  await _addAttachmentToMessage(message, _markAttachmentAsPermanentError(attachment), { type, index });
  await _finishJob(message, id);
}
async function _getMessageById(id, messageId) {
  const message = window.MessageController.getById(messageId);
  if (message) {
    return message;
  }
  const messageAttributes = await getMessageById(messageId);
  if (!messageAttributes) {
    logger.error(`attachment_downloads/_runJob(${id}): Source message not found, deleting job`);
    await _finishJob(null, id);
    return;
  }
  (0, import_assert.strictAssert)(messageId === messageAttributes.id, "message id mismatch");
  return window.MessageController.register(messageId, messageAttributes);
}
async function _finishJob(message, id) {
  if (message) {
    logger.info(`attachment_downloads/_finishJob for job id: ${id}`);
    await saveMessage(message.attributes, {
      ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
    });
  }
  await removeAttachmentDownloadJob(id);
  delete _activeAttachmentDownloadJobs[id];
  _maybeStartJob();
}
function getActiveJobCount() {
  return Object.keys(_activeAttachmentDownloadJobs).length;
}
function _markAttachmentAsPermanentError(attachment) {
  return {
    ...(0, import_lodash.omit)(attachment, ["key", "digest", "id"]),
    error: true
  };
}
function _markAttachmentAsTransientError(attachment) {
  return { ...attachment, error: true };
}
async function _addAttachmentToMessage(message, attachment, { type, index }) {
  if (!message) {
    return;
  }
  const logPrefix = `${message.idForLogging()} (type: ${type}, index: ${index})`;
  if (type === "long-message") {
    if (!attachment.path) {
      message.set({
        bodyAttachment: attachment
      });
      return;
    }
    try {
      const { data } = await window.Signal.Migrations.loadAttachmentData(attachment);
      message.set({
        body: Bytes.toString(data),
        bodyAttachment: void 0
      });
    } finally {
      if (attachment.path) {
        window.Signal.Migrations.deleteAttachmentData(attachment.path);
      }
    }
    return;
  }
  if (type === "attachment") {
    const attachments = message.get("attachments");
    if (!attachments || attachments.length <= index) {
      throw new Error(`_addAttachmentToMessage: attachments didn't exist or ${index} was too large`);
    }
    _checkOldAttachment(attachments, index.toString(), logPrefix);
    const newAttachments = [...attachments];
    newAttachments[index] = attachment;
    message.set({ attachments: newAttachments });
    return;
  }
  if (type === "preview") {
    const preview = message.get("preview");
    if (!preview || preview.length <= index) {
      throw new Error(`_addAttachmentToMessage: preview didn't exist or ${index} was too large`);
    }
    const item = preview[index];
    if (!item) {
      throw new Error(`_addAttachmentToMessage: preview ${index} was falsey`);
    }
    _checkOldAttachment(item, "image", logPrefix);
    const newPreview = [...preview];
    newPreview[index] = {
      ...preview[index],
      image: attachment
    };
    message.set({ preview: newPreview });
    return;
  }
  if (type === "contact") {
    const contact = message.get("contact");
    if (!contact || contact.length <= index) {
      throw new Error(`_addAttachmentToMessage: contact didn't exist or ${index} was too large`);
    }
    const item = contact[index];
    if (item && item.avatar && item.avatar.avatar) {
      _checkOldAttachment(item.avatar, "avatar", logPrefix);
      const newContact = [...contact];
      newContact[index] = {
        ...item,
        avatar: {
          ...item.avatar,
          avatar: attachment
        }
      };
      message.set({ contact: newContact });
    } else {
      logger.warn(`_addAttachmentToMessage: Couldn't update contact with avatar attachment for message ${message.idForLogging()}`);
    }
    return;
  }
  if (type === "quote") {
    const quote = message.get("quote");
    if (!quote) {
      throw new Error("_addAttachmentToMessage: quote didn't exist");
    }
    const { attachments } = quote;
    if (!attachments || attachments.length <= index) {
      throw new Error(`_addAttachmentToMessage: quote attachments didn't exist or ${index} was too large`);
    }
    const item = attachments[index];
    if (!item) {
      throw new Error(`_addAttachmentToMessage: quote attachment ${index} was falsey`);
    }
    _checkOldAttachment(item, "thumbnail", logPrefix);
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...attachments[index],
      thumbnail: attachment
    };
    const newQuote = {
      ...quote,
      attachments: newAttachments
    };
    message.set({ quote: newQuote });
    return;
  }
  if (type === "sticker") {
    const sticker = message.get("sticker");
    if (!sticker) {
      throw new Error("_addAttachmentToMessage: sticker didn't exist");
    }
    message.set({
      sticker: {
        ...sticker,
        data: attachment
      }
    });
    return;
  }
  throw new Error(`_addAttachmentToMessage: Unknown job type ${type} for message ${message.idForLogging()}`);
}
function _checkOldAttachment(object, key, logPrefix) {
  const oldAttachment = object[key];
  if (oldAttachment && oldAttachment.path) {
    logger.error(`_checkOldAttachment: ${logPrefix} - old attachment already had path, not replacing`);
    throw new Error("_checkOldAttachment: old attachment already had path, not replacing");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addJob,
  start,
  stop
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXR0YWNobWVudERvd25sb2Fkcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlzTnVtYmVyLCBvbWl0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHY0IGFzIGdldEd1aWQgfSBmcm9tICd1dWlkJztcblxuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkgfSBmcm9tICcuLi91dGlsL2NsZWFyVGltZW91dElmTmVjZXNzYXJ5JztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IGRvd25sb2FkQXR0YWNobWVudCB9IGZyb20gJy4uL3V0aWwvZG93bmxvYWRBdHRhY2htZW50JztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB0eXBlIHtcbiAgQXR0YWNobWVudERvd25sb2FkSm9iVHlwZSxcbiAgQXR0YWNobWVudERvd25sb2FkSm9iVHlwZVR5cGUsXG59IGZyb20gJy4uL3NxbC9JbnRlcmZhY2UnO1xuXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlcyc7XG5pbXBvcnQgdHlwZSB7IEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB0eXBlIHsgTG9nZ2VyVHlwZSB9IGZyb20gJy4uL3R5cGVzL0xvZ2dpbmcnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcblxuY29uc3Qge1xuICBnZXRNZXNzYWdlQnlJZCxcbiAgZ2V0QXR0YWNobWVudERvd25sb2FkSm9iQnlJZCxcbiAgZ2V0TmV4dEF0dGFjaG1lbnREb3dubG9hZEpvYnMsXG4gIHJlbW92ZUF0dGFjaG1lbnREb3dubG9hZEpvYixcbiAgcmVzZXRBdHRhY2htZW50RG93bmxvYWRQZW5kaW5nLFxuICBzYXZlQXR0YWNobWVudERvd25sb2FkSm9iLFxuICBzYXZlTWVzc2FnZSxcbiAgc2V0QXR0YWNobWVudERvd25sb2FkSm9iUGVuZGluZyxcbn0gPSBkYXRhSW50ZXJmYWNlO1xuXG5jb25zdCBNQVhfQVRUQUNITUVOVF9KT0JfUEFSQUxMRUxJU00gPSAzO1xuXG5jb25zdCBUSUNLX0lOVEVSVkFMID0gZHVyYXRpb25zLk1JTlVURTtcblxuY29uc3QgUkVUUllfQkFDS09GRjogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHtcbiAgMTogMzAgKiBkdXJhdGlvbnMuU0VDT05ELFxuICAyOiAzMCAqIGR1cmF0aW9ucy5NSU5VVEUsXG4gIDM6IDYgKiBkdXJhdGlvbnMuSE9VUixcbn07XG5cbmxldCBlbmFibGVkID0gZmFsc2U7XG5sZXQgdGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCBudWxsO1xubGV0IGxvZ2dlcjogTG9nZ2VyVHlwZTtcbmNvbnN0IF9hY3RpdmVBdHRhY2htZW50RG93bmxvYWRKb2JzOiBSZWNvcmQ8c3RyaW5nLCBQcm9taXNlPHZvaWQ+IHwgdW5kZWZpbmVkPiA9XG4gIHt9O1xuXG50eXBlIFN0YXJ0T3B0aW9uc1R5cGUgPSB7XG4gIGxvZ2dlcjogTG9nZ2VyVHlwZTtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydChvcHRpb25zOiBTdGFydE9wdGlvbnNUeXBlKTogUHJvbWlzZTx2b2lkPiB7XG4gICh7IGxvZ2dlciB9ID0gb3B0aW9ucyk7XG4gIGlmICghbG9nZ2VyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhdHRhY2htZW50X2Rvd25sb2Fkcy9zdGFydDogbG9nZ2VyIG11c3QgYmUgcHJvdmlkZWQhJyk7XG4gIH1cblxuICBsb2dnZXIuaW5mbygnYXR0YWNobWVudF9kb3dubG9hZHMvc3RhcnQ6IGVuYWJsaW5nJyk7XG4gIGVuYWJsZWQgPSB0cnVlO1xuICBhd2FpdCByZXNldEF0dGFjaG1lbnREb3dubG9hZFBlbmRpbmcoKTtcblxuICBfdGljaygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RvcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gSWYgYC5zdGFydCgpYCB3YXNuJ3QgY2FsbGVkIC0gdGhlIGBsb2dnZXJgIGlzIGB1bmRlZmluZWRgXG4gIGlmIChsb2dnZXIpIHtcbiAgICBsb2dnZXIuaW5mbygnYXR0YWNobWVudF9kb3dubG9hZHMvc3RvcDogZGlzYWJsaW5nJyk7XG4gIH1cbiAgZW5hYmxlZCA9IGZhbHNlO1xuICBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSh0aW1lb3V0KTtcbiAgdGltZW91dCA9IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRKb2IoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICBqb2I6IHsgbWVzc2FnZUlkOiBzdHJpbmc7IHR5cGU6IEF0dGFjaG1lbnREb3dubG9hZEpvYlR5cGVUeXBlOyBpbmRleDogbnVtYmVyIH1cbik6IFByb21pc2U8QXR0YWNobWVudFR5cGU+IHtcbiAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhdHRhY2htZW50c19kb3dubG9hZC9hZGRKb2I6IGF0dGFjaG1lbnQgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGNvbnN0IHsgbWVzc2FnZUlkLCB0eXBlLCBpbmRleCB9ID0gam9iO1xuICBpZiAoIW1lc3NhZ2VJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYXR0YWNobWVudHNfZG93bmxvYWQvYWRkSm9iOiBqb2IubWVzc2FnZUlkIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCF0eXBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhdHRhY2htZW50c19kb3dubG9hZC9hZGRKb2I6IGpvYi50eXBlIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc051bWJlcihpbmRleCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2F0dGFjaG1lbnRzX2Rvd25sb2FkL2FkZEpvYjogaW5kZXggbXVzdCBiZSBhIG51bWJlcicpO1xuICB9XG5cbiAgaWYgKGF0dGFjaG1lbnQuZG93bmxvYWRKb2JJZCkge1xuICAgIGxldCBleGlzdGluZ0pvYiA9IGF3YWl0IGdldEF0dGFjaG1lbnREb3dubG9hZEpvYkJ5SWQoXG4gICAgICBhdHRhY2htZW50LmRvd25sb2FkSm9iSWRcbiAgICApO1xuICAgIGlmIChleGlzdGluZ0pvYikge1xuICAgICAgLy8gUmVzZXQgam9iIGF0dGVtcHRzIHRocm91Z2ggdXNlcidzIGV4cGxpY2l0IGFjdGlvblxuICAgICAgZXhpc3RpbmdKb2IgPSB7IC4uLmV4aXN0aW5nSm9iLCBhdHRlbXB0czogMCB9O1xuXG4gICAgICBpZiAoX2FjdGl2ZUF0dGFjaG1lbnREb3dubG9hZEpvYnNbZXhpc3RpbmdKb2IuaWRdKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9hZGRKb2I6ICR7ZXhpc3RpbmdKb2IuaWR9IGFscmVhZHkgcnVubmluZ2BcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9hZGRKb2I6IHJlc3RhcnRpbmcgZXhpc3Rpbmcgam9iICR7ZXhpc3RpbmdKb2IuaWR9YFxuICAgICAgICApO1xuICAgICAgICBfYWN0aXZlQXR0YWNobWVudERvd25sb2FkSm9ic1tleGlzdGluZ0pvYi5pZF0gPSBfcnVuSm9iKGV4aXN0aW5nSm9iKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYXR0YWNobWVudCxcbiAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaWQgPSBnZXRHdWlkKCk7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gIGNvbnN0IHRvU2F2ZTogQXR0YWNobWVudERvd25sb2FkSm9iVHlwZSA9IHtcbiAgICAuLi5qb2IsXG4gICAgaWQsXG4gICAgYXR0YWNobWVudCxcbiAgICB0aW1lc3RhbXAsXG4gICAgcGVuZGluZzogMCxcbiAgICBhdHRlbXB0czogMCxcbiAgfTtcblxuICBhd2FpdCBzYXZlQXR0YWNobWVudERvd25sb2FkSm9iKHRvU2F2ZSk7XG5cbiAgX21heWJlU3RhcnRKb2IoKTtcblxuICByZXR1cm4ge1xuICAgIC4uLmF0dGFjaG1lbnQsXG4gICAgcGVuZGluZzogdHJ1ZSxcbiAgICBkb3dubG9hZEpvYklkOiBpZCxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3RpY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRpbWVvdXQpO1xuICB0aW1lb3V0ID0gbnVsbDtcblxuICBfbWF5YmVTdGFydEpvYigpO1xuICB0aW1lb3V0ID0gc2V0VGltZW91dChfdGljaywgVElDS19JTlRFUlZBTCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9tYXliZVN0YXJ0Sm9iKCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIWVuYWJsZWQpIHtcbiAgICBsb2dnZXIuaW5mbygnYXR0YWNobWVudF9kb3dubG9hZHMvX21heWJlU3RhcnRKb2I6IG5vdCBlbmFibGVkLCByZXR1cm5pbmcnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBqb2JDb3VudCA9IGdldEFjdGl2ZUpvYkNvdW50KCk7XG4gIGNvbnN0IGxpbWl0ID0gTUFYX0FUVEFDSE1FTlRfSk9CX1BBUkFMTEVMSVNNIC0gam9iQ291bnQ7XG4gIGlmIChsaW1pdCA8PSAwKSB7XG4gICAgbG9nZ2VyLmluZm8oXG4gICAgICAnYXR0YWNobWVudF9kb3dubG9hZHMvX21heWJlU3RhcnRKb2I6IHJlYWNoZWQgYWN0aXZlIGpvYiBsaW1pdCwgd2FpdGluZydcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG5leHRKb2JzID0gYXdhaXQgZ2V0TmV4dEF0dGFjaG1lbnREb3dubG9hZEpvYnMobGltaXQpO1xuICBpZiAobmV4dEpvYnMubGVuZ3RoIDw9IDApIHtcbiAgICBsb2dnZXIuaW5mbyhcbiAgICAgICdhdHRhY2htZW50X2Rvd25sb2Fkcy9fbWF5YmVTdGFydEpvYjogbm8gYXR0YWNobWVudCBqb2JzIHRvIHJ1bidcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFRvIHByZXZlbnQgdGhlIHJhY2UgY29uZGl0aW9uIGNhdXNlZCBieSB0d28gcGFyYWxsZWwgZGF0YWJhc2UgY2FsbHMsIGVhY2hlZCBraWNrZWRcbiAgLy8gICBvZmYgYmVjYXVzZSB0aGUgam9iQ291bnQgd2Fzbid0IGF0IHRoZSBtYXguXG4gIGNvbnN0IHNlY29uZEpvYkNvdW50ID0gZ2V0QWN0aXZlSm9iQ291bnQoKTtcbiAgY29uc3QgbmVlZGVkID0gTUFYX0FUVEFDSE1FTlRfSk9CX1BBUkFMTEVMSVNNIC0gc2Vjb25kSm9iQ291bnQ7XG4gIGlmIChuZWVkZWQgPD0gMCkge1xuICAgIGxvZ2dlci5pbmZvKFxuICAgICAgJ2F0dGFjaG1lbnRfZG93bmxvYWRzL19tYXliZVN0YXJ0Sm9iOiByZWFjaGVkIGFjdGl2ZSBqb2IgbGltaXQgYWZ0ZXIgJyArXG4gICAgICAgICdkYiBxdWVyeSwgd2FpdGluZydcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGpvYnMgPSBuZXh0Sm9icy5zbGljZSgwLCBNYXRoLm1pbihuZWVkZWQsIG5leHRKb2JzLmxlbmd0aCkpO1xuXG4gIGxvZ2dlci5pbmZvKFxuICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9fbWF5YmVTdGFydEpvYjogc3RhcnRpbmcgJHtqb2JzLmxlbmd0aH0gam9ic2BcbiAgKTtcblxuICBmb3IgKGxldCBpID0gMCwgbWF4ID0gam9icy5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGpvYiA9IGpvYnNbaV07XG4gICAgY29uc3QgZXhpc3RpbmcgPSBfYWN0aXZlQXR0YWNobWVudERvd25sb2FkSm9ic1tqb2IuaWRdO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9fbWF5YmVTdGFydEpvYjogSm9iICR7am9iLmlkfSBpcyBhbHJlYWR5IHJ1bm5pbmdgXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgYGF0dGFjaG1lbnRfZG93bmxvYWRzL19tYXliZVN0YXJ0Sm9iOiBTdGFydGluZyBqb2IgJHtqb2IuaWR9YFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBfcnVuSm9iKGpvYik7XG4gICAgICBfYWN0aXZlQXR0YWNobWVudERvd25sb2FkSm9ic1tqb2IuaWRdID0gcHJvbWlzZTtcblxuICAgICAgY29uc3QgcG9zdFByb2Nlc3MgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvZ0lkID0gYGF0dGFjaG1lbnRfZG93bmxvYWRzL19tYXliZVN0YXJ0Sm9iL3Bvc3RQcm9jZXNzLyR7am9iLmlkfWA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICBpZiAoX2FjdGl2ZUF0dGFjaG1lbnREb3dubG9hZEpvYnNbam9iLmlkXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgJHtsb2dJZH06IEFjdGl2ZSBhdHRhY2htZW50cyBqb2JzIGxpc3Qgc3RpbGwgaGFzIHRoaXMgam9iIWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgIGAke2xvZ0lkfTogRG93bmxvYWQgam9iIHRocmV3IGFuIGVycm9yLCBkZWxldGluZy5gLFxuICAgICAgICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBkZWxldGUgX2FjdGl2ZUF0dGFjaG1lbnREb3dubG9hZEpvYnNbam9iLmlkXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgX21hcmtBdHRhY2htZW50QXNGYWlsZWQoam9iKTtcbiAgICAgICAgICB9IGNhdGNoIChkZWxldGVFcnJvcikge1xuICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICBgJHtsb2dJZH06IEZhaWxlZCB0byBkZWxldGUgYXR0YWNobWVudCBqb2JgLFxuICAgICAgICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfbWF5YmVTdGFydEpvYigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gTm90ZTogaW50ZW50aW9uYWxseSBub3QgYXdhaXRpbmdcbiAgICAgIHBvc3RQcm9jZXNzKCk7XG4gICAgfVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9ydW5Kb2Ioam9iPzogQXR0YWNobWVudERvd25sb2FkSm9iVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIWpvYikge1xuICAgIGxvZy53YXJuKCdhdHRhY2htZW50X2Rvd25sb2Fkcy9fcnVuSm9iOiBKb2Igd2FzIG1pc3NpbmchJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBpZCwgbWVzc2FnZUlkLCBhdHRhY2htZW50LCB0eXBlLCBpbmRleCwgYXR0ZW1wdHMgfSA9IGpvYjtcbiAgbGV0IG1lc3NhZ2U7XG5cbiAgdHJ5IHtcbiAgICBpZiAoIWpvYiB8fCAhYXR0YWNobWVudCB8fCAhbWVzc2FnZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBfcnVuSm9iOiBLZXkgaW5mb3JtYXRpb24gcmVxdWlyZWQgZm9yIGpvYiB3YXMgbWlzc2luZy4gSm9iIGlkOiAke2lkfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbG9nZ2VyLmluZm8oYGF0dGFjaG1lbnRfZG93bmxvYWRzL19ydW5Kb2IoJHtpZH0pOiBzdGFydGluZ2ApO1xuXG4gICAgY29uc3QgcGVuZGluZyA9IHRydWU7XG4gICAgYXdhaXQgc2V0QXR0YWNobWVudERvd25sb2FkSm9iUGVuZGluZyhpZCwgcGVuZGluZyk7XG5cbiAgICBtZXNzYWdlID0gYXdhaXQgX2dldE1lc3NhZ2VCeUlkKGlkLCBtZXNzYWdlSWQpO1xuXG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2UoXG4gICAgICBtZXNzYWdlLFxuICAgICAgeyAuLi5hdHRhY2htZW50LCBwZW5kaW5nOiB0cnVlIH0sXG4gICAgICB7IHR5cGUsIGluZGV4IH1cbiAgICApO1xuXG4gICAgY29uc3QgZG93bmxvYWRlZCA9IGF3YWl0IGRvd25sb2FkQXR0YWNobWVudChhdHRhY2htZW50KTtcblxuICAgIGlmICghZG93bmxvYWRlZCkge1xuICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9fcnVuSm9iKCR7aWR9KTogR290IDQwNCBmcm9tIHNlcnZlciBmb3IgQ0ROICR7XG4gICAgICAgICAgYXR0YWNobWVudC5jZG5OdW1iZXJcbiAgICAgICAgfSwgbWFya2luZyBhdHRhY2htZW50ICR7XG4gICAgICAgICAgYXR0YWNobWVudC5jZG5JZCB8fCBhdHRhY2htZW50LmNkbktleVxuICAgICAgICB9IGZyb20gbWVzc2FnZSAke21lc3NhZ2UuaWRGb3JMb2dnaW5nKCl9IGFzIHBlcm1hbmVudCBlcnJvcmBcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IF9hZGRBdHRhY2htZW50VG9NZXNzYWdlKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBfbWFya0F0dGFjaG1lbnRBc1Blcm1hbmVudEVycm9yKGF0dGFjaG1lbnQpLFxuICAgICAgICB7IHR5cGUsIGluZGV4IH1cbiAgICAgICk7XG4gICAgICBhd2FpdCBfZmluaXNoSm9iKG1lc3NhZ2UsIGlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cGdyYWRlZEF0dGFjaG1lbnQgPVxuICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLnByb2Nlc3NOZXdBdHRhY2htZW50KGRvd25sb2FkZWQpO1xuXG4gICAgYXdhaXQgX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2UobWVzc2FnZSwgb21pdCh1cGdyYWRlZEF0dGFjaG1lbnQsICdlcnJvcicpLCB7XG4gICAgICB0eXBlLFxuICAgICAgaW5kZXgsXG4gICAgfSk7XG5cbiAgICBhd2FpdCBfZmluaXNoSm9iKG1lc3NhZ2UsIGlkKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBsb2dJZCA9IG1lc3NhZ2UgPyBtZXNzYWdlLmlkRm9yTG9nZ2luZygpIDogaWQgfHwgJzxubyBpZD4nO1xuICAgIGNvbnN0IGN1cnJlbnRBdHRlbXB0ID0gKGF0dGVtcHRzIHx8IDApICsgMTtcblxuICAgIGlmIChjdXJyZW50QXR0ZW1wdCA+PSAzKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9ydW5Kb2IoJHtpZH0pOiAke2N1cnJlbnRBdHRlbXB0fSBmYWlsZWQgYCArXG4gICAgICAgICAgYGF0dGVtcHRzLCBtYXJraW5nIGF0dGFjaG1lbnQgZnJvbSBtZXNzYWdlICR7bG9nSWR9IGFzIGAgK1xuICAgICAgICAgICdlcnJvcjonLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBfYWRkQXR0YWNobWVudFRvTWVzc2FnZShcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIF9tYXJrQXR0YWNobWVudEFzVHJhbnNpZW50RXJyb3IoYXR0YWNobWVudCksXG4gICAgICAgICAgeyB0eXBlLCBpbmRleCB9XG4gICAgICAgICk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhd2FpdCBfZmluaXNoSm9iKG1lc3NhZ2UsIGlkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIGBhdHRhY2htZW50X2Rvd25sb2Fkcy9fcnVuSm9iKCR7aWR9KTogRmFpbGVkIHRvIGRvd25sb2FkIGF0dGFjaG1lbnQgYCArXG4gICAgICAgIGB0eXBlICR7dHlwZX0gZm9yIG1lc3NhZ2UgJHtsb2dJZH0sIGF0dGVtcHQgJHtjdXJyZW50QXR0ZW1wdH06YCxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFJlbW92ZSBgcGVuZGluZ2AgZmxhZyBmcm9tIHRoZSBhdHRhY2htZW50LlxuICAgICAgYXdhaXQgX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2UoXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHtcbiAgICAgICAgICAuLi5hdHRhY2htZW50LFxuICAgICAgICAgIGRvd25sb2FkSm9iSWQ6IGlkLFxuICAgICAgICB9LFxuICAgICAgICB7IHR5cGUsIGluZGV4IH1cbiAgICAgICk7XG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICBhd2FpdCBzYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFpbGVkSm9iID0ge1xuICAgICAgICAuLi5qb2IsXG4gICAgICAgIHBlbmRpbmc6IDAsXG4gICAgICAgIGF0dGVtcHRzOiBjdXJyZW50QXR0ZW1wdCxcbiAgICAgICAgdGltZXN0YW1wOlxuICAgICAgICAgIERhdGUubm93KCkgKyAoUkVUUllfQkFDS09GRltjdXJyZW50QXR0ZW1wdF0gfHwgUkVUUllfQkFDS09GRlszXSksXG4gICAgICB9O1xuXG4gICAgICBhd2FpdCBzYXZlQXR0YWNobWVudERvd25sb2FkSm9iKGZhaWxlZEpvYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGRlbGV0ZSBfYWN0aXZlQXR0YWNobWVudERvd25sb2FkSm9ic1tpZF07XG4gICAgICBfbWF5YmVTdGFydEpvYigpO1xuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBfbWFya0F0dGFjaG1lbnRBc0ZhaWxlZChcbiAgam9iOiBBdHRhY2htZW50RG93bmxvYWRKb2JUeXBlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBpZCwgbWVzc2FnZUlkLCBhdHRhY2htZW50LCB0eXBlLCBpbmRleCB9ID0gam9iO1xuICBjb25zdCBtZXNzYWdlID0gYXdhaXQgX2dldE1lc3NhZ2VCeUlkKGlkLCBtZXNzYWdlSWQpO1xuXG4gIGlmICghbWVzc2FnZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IF9hZGRBdHRhY2htZW50VG9NZXNzYWdlKFxuICAgIG1lc3NhZ2UsXG4gICAgX21hcmtBdHRhY2htZW50QXNQZXJtYW5lbnRFcnJvcihhdHRhY2htZW50KSxcbiAgICB7IHR5cGUsIGluZGV4IH1cbiAgKTtcbiAgYXdhaXQgX2ZpbmlzaEpvYihtZXNzYWdlLCBpZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9nZXRNZXNzYWdlQnlJZChcbiAgaWQ6IHN0cmluZyxcbiAgbWVzc2FnZUlkOiBzdHJpbmdcbik6IFByb21pc2U8TWVzc2FnZU1vZGVsIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIuZ2V0QnlJZChtZXNzYWdlSWQpO1xuXG4gIGlmIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH1cblxuICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gIGlmICghbWVzc2FnZUF0dHJpYnV0ZXMpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBgYXR0YWNobWVudF9kb3dubG9hZHMvX3J1bkpvYigke2lkfSk6IGAgK1xuICAgICAgICAnU291cmNlIG1lc3NhZ2Ugbm90IGZvdW5kLCBkZWxldGluZyBqb2InXG4gICAgKTtcbiAgICBhd2FpdCBfZmluaXNoSm9iKG51bGwsIGlkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdHJpY3RBc3NlcnQobWVzc2FnZUlkID09PSBtZXNzYWdlQXR0cmlidXRlcy5pZCwgJ21lc3NhZ2UgaWQgbWlzbWF0Y2gnKTtcbiAgcmV0dXJuIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihtZXNzYWdlSWQsIG1lc3NhZ2VBdHRyaWJ1dGVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2ZpbmlzaEpvYihcbiAgbWVzc2FnZTogTWVzc2FnZU1vZGVsIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgaWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChtZXNzYWdlKSB7XG4gICAgbG9nZ2VyLmluZm8oYGF0dGFjaG1lbnRfZG93bmxvYWRzL19maW5pc2hKb2IgZm9yIGpvYiBpZDogJHtpZH1gKTtcbiAgICBhd2FpdCBzYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgfSk7XG4gIH1cblxuICBhd2FpdCByZW1vdmVBdHRhY2htZW50RG93bmxvYWRKb2IoaWQpO1xuICBkZWxldGUgX2FjdGl2ZUF0dGFjaG1lbnREb3dubG9hZEpvYnNbaWRdO1xuICBfbWF5YmVTdGFydEpvYigpO1xufVxuXG5mdW5jdGlvbiBnZXRBY3RpdmVKb2JDb3VudCgpOiBudW1iZXIge1xuICByZXR1cm4gT2JqZWN0LmtleXMoX2FjdGl2ZUF0dGFjaG1lbnREb3dubG9hZEpvYnMpLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gX21hcmtBdHRhY2htZW50QXNQZXJtYW5lbnRFcnJvcihcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGVcbik6IEF0dGFjaG1lbnRUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5vbWl0KGF0dGFjaG1lbnQsIFsna2V5JywgJ2RpZ2VzdCcsICdpZCddKSxcbiAgICBlcnJvcjogdHJ1ZSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gX21hcmtBdHRhY2htZW50QXNUcmFuc2llbnRFcnJvcihcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGVcbik6IEF0dGFjaG1lbnRUeXBlIHtcbiAgcmV0dXJuIHsgLi4uYXR0YWNobWVudCwgZXJyb3I6IHRydWUgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2UoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICB7IHR5cGUsIGluZGV4IH06IHsgdHlwZTogQXR0YWNobWVudERvd25sb2FkSm9iVHlwZVR5cGU7IGluZGV4OiBudW1iZXIgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICghbWVzc2FnZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGxvZ1ByZWZpeCA9IGAke21lc3NhZ2UuaWRGb3JMb2dnaW5nKCl9ICh0eXBlOiAke3R5cGV9LCBpbmRleDogJHtpbmRleH0pYDtcblxuICBpZiAodHlwZSA9PT0gJ2xvbmctbWVzc2FnZScpIHtcbiAgICAvLyBBdHRhY2htZW50IHdhc24ndCBkb3dubG9hZGVkIHlldC5cbiAgICBpZiAoIWF0dGFjaG1lbnQucGF0aCkge1xuICAgICAgbWVzc2FnZS5zZXQoe1xuICAgICAgICBib2R5QXR0YWNobWVudDogYXR0YWNobWVudCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5sb2FkQXR0YWNobWVudERhdGEoXG4gICAgICAgIGF0dGFjaG1lbnRcbiAgICAgICk7XG4gICAgICBtZXNzYWdlLnNldCh7XG4gICAgICAgIGJvZHk6IEJ5dGVzLnRvU3RyaW5nKGRhdGEpLFxuICAgICAgICBib2R5QXR0YWNobWVudDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChhdHRhY2htZW50LnBhdGgpIHtcbiAgICAgICAgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZUF0dGFjaG1lbnREYXRhKGF0dGFjaG1lbnQucGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnYXR0YWNobWVudCcpIHtcbiAgICBjb25zdCBhdHRhY2htZW50cyA9IG1lc3NhZ2UuZ2V0KCdhdHRhY2htZW50cycpO1xuICAgIGlmICghYXR0YWNobWVudHMgfHwgYXR0YWNobWVudHMubGVuZ3RoIDw9IGluZGV4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBfYWRkQXR0YWNobWVudFRvTWVzc2FnZTogYXR0YWNobWVudHMgZGlkbid0IGV4aXN0IG9yICR7aW5kZXh9IHdhcyB0b28gbGFyZ2VgXG4gICAgICApO1xuICAgIH1cbiAgICBfY2hlY2tPbGRBdHRhY2htZW50KGF0dGFjaG1lbnRzLCBpbmRleC50b1N0cmluZygpLCBsb2dQcmVmaXgpO1xuXG4gICAgY29uc3QgbmV3QXR0YWNobWVudHMgPSBbLi4uYXR0YWNobWVudHNdO1xuICAgIG5ld0F0dGFjaG1lbnRzW2luZGV4XSA9IGF0dGFjaG1lbnQ7XG5cbiAgICBtZXNzYWdlLnNldCh7IGF0dGFjaG1lbnRzOiBuZXdBdHRhY2htZW50cyB9KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAncHJldmlldycpIHtcbiAgICBjb25zdCBwcmV2aWV3ID0gbWVzc2FnZS5nZXQoJ3ByZXZpZXcnKTtcbiAgICBpZiAoIXByZXZpZXcgfHwgcHJldmlldy5sZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYF9hZGRBdHRhY2htZW50VG9NZXNzYWdlOiBwcmV2aWV3IGRpZG4ndCBleGlzdCBvciAke2luZGV4fSB3YXMgdG9vIGxhcmdlYFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IHByZXZpZXdbaW5kZXhdO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBfYWRkQXR0YWNobWVudFRvTWVzc2FnZTogcHJldmlldyAke2luZGV4fSB3YXMgZmFsc2V5YCk7XG4gICAgfVxuXG4gICAgX2NoZWNrT2xkQXR0YWNobWVudChpdGVtLCAnaW1hZ2UnLCBsb2dQcmVmaXgpO1xuXG4gICAgY29uc3QgbmV3UHJldmlldyA9IFsuLi5wcmV2aWV3XTtcbiAgICBuZXdQcmV2aWV3W2luZGV4XSA9IHtcbiAgICAgIC4uLnByZXZpZXdbaW5kZXhdLFxuICAgICAgaW1hZ2U6IGF0dGFjaG1lbnQsXG4gICAgfTtcblxuICAgIG1lc3NhZ2Uuc2V0KHsgcHJldmlldzogbmV3UHJldmlldyB9KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnY29udGFjdCcpIHtcbiAgICBjb25zdCBjb250YWN0ID0gbWVzc2FnZS5nZXQoJ2NvbnRhY3QnKTtcbiAgICBpZiAoIWNvbnRhY3QgfHwgY29udGFjdC5sZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYF9hZGRBdHRhY2htZW50VG9NZXNzYWdlOiBjb250YWN0IGRpZG4ndCBleGlzdCBvciAke2luZGV4fSB3YXMgdG9vIGxhcmdlYFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IGNvbnRhY3RbaW5kZXhdO1xuICAgIGlmIChpdGVtICYmIGl0ZW0uYXZhdGFyICYmIGl0ZW0uYXZhdGFyLmF2YXRhcikge1xuICAgICAgX2NoZWNrT2xkQXR0YWNobWVudChpdGVtLmF2YXRhciwgJ2F2YXRhcicsIGxvZ1ByZWZpeCk7XG5cbiAgICAgIGNvbnN0IG5ld0NvbnRhY3QgPSBbLi4uY29udGFjdF07XG4gICAgICBuZXdDb250YWN0W2luZGV4XSA9IHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgYXZhdGFyOiB7XG4gICAgICAgICAgLi4uaXRlbS5hdmF0YXIsXG4gICAgICAgICAgYXZhdGFyOiBhdHRhY2htZW50LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgbWVzc2FnZS5zZXQoeyBjb250YWN0OiBuZXdDb250YWN0IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIud2FybihcbiAgICAgICAgYF9hZGRBdHRhY2htZW50VG9NZXNzYWdlOiBDb3VsZG4ndCB1cGRhdGUgY29udGFjdCB3aXRoIGF2YXRhciBhdHRhY2htZW50IGZvciBtZXNzYWdlICR7bWVzc2FnZS5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAncXVvdGUnKSB7XG4gICAgY29uc3QgcXVvdGUgPSBtZXNzYWdlLmdldCgncXVvdGUnKTtcbiAgICBpZiAoIXF1b3RlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJfYWRkQXR0YWNobWVudFRvTWVzc2FnZTogcXVvdGUgZGlkbid0IGV4aXN0XCIpO1xuICAgIH1cbiAgICBjb25zdCB7IGF0dGFjaG1lbnRzIH0gPSBxdW90ZTtcbiAgICBpZiAoIWF0dGFjaG1lbnRzIHx8IGF0dGFjaG1lbnRzLmxlbmd0aCA8PSBpbmRleCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2U6IHF1b3RlIGF0dGFjaG1lbnRzIGRpZG4ndCBleGlzdCBvciAke2luZGV4fSB3YXMgdG9vIGxhcmdlYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtID0gYXR0YWNobWVudHNbaW5kZXhdO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2U6IHF1b3RlIGF0dGFjaG1lbnQgJHtpbmRleH0gd2FzIGZhbHNleWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgX2NoZWNrT2xkQXR0YWNobWVudChpdGVtLCAndGh1bWJuYWlsJywgbG9nUHJlZml4KTtcblxuICAgIGNvbnN0IG5ld0F0dGFjaG1lbnRzID0gWy4uLmF0dGFjaG1lbnRzXTtcbiAgICBuZXdBdHRhY2htZW50c1tpbmRleF0gPSB7XG4gICAgICAuLi5hdHRhY2htZW50c1tpbmRleF0sXG4gICAgICB0aHVtYm5haWw6IGF0dGFjaG1lbnQsXG4gICAgfTtcblxuICAgIGNvbnN0IG5ld1F1b3RlID0ge1xuICAgICAgLi4ucXVvdGUsXG4gICAgICBhdHRhY2htZW50czogbmV3QXR0YWNobWVudHMsXG4gICAgfTtcblxuICAgIG1lc3NhZ2Uuc2V0KHsgcXVvdGU6IG5ld1F1b3RlIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdGlja2VyJykge1xuICAgIGNvbnN0IHN0aWNrZXIgPSBtZXNzYWdlLmdldCgnc3RpY2tlcicpO1xuICAgIGlmICghc3RpY2tlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiX2FkZEF0dGFjaG1lbnRUb01lc3NhZ2U6IHN0aWNrZXIgZGlkbid0IGV4aXN0XCIpO1xuICAgIH1cblxuICAgIG1lc3NhZ2Uuc2V0KHtcbiAgICAgIHN0aWNrZXI6IHtcbiAgICAgICAgLi4uc3RpY2tlcixcbiAgICAgICAgZGF0YTogYXR0YWNobWVudCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGBfYWRkQXR0YWNobWVudFRvTWVzc2FnZTogVW5rbm93biBqb2IgdHlwZSAke3R5cGV9IGZvciBtZXNzYWdlICR7bWVzc2FnZS5pZEZvckxvZ2dpbmcoKX1gXG4gICk7XG59XG5cbmZ1bmN0aW9uIF9jaGVja09sZEF0dGFjaG1lbnQoXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIG9iamVjdDogYW55LFxuICBrZXk6IHN0cmluZyxcbiAgbG9nUHJlZml4OiBzdHJpbmdcbik6IHZvaWQge1xuICBjb25zdCBvbGRBdHRhY2htZW50ID0gb2JqZWN0W2tleV07XG4gIGlmIChvbGRBdHRhY2htZW50ICYmIG9sZEF0dGFjaG1lbnQucGF0aCkge1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIGBfY2hlY2tPbGRBdHRhY2htZW50OiAke2xvZ1ByZWZpeH0gLSBvbGQgYXR0YWNobWVudCBhbHJlYWR5IGhhZCBwYXRoLCBub3QgcmVwbGFjaW5nYFxuICAgICk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ19jaGVja09sZEF0dGFjaG1lbnQ6IG9sZCBhdHRhY2htZW50IGFscmVhZHkgaGFkIHBhdGgsIG5vdCByZXBsYWNpbmcnXG4gICAgKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBK0I7QUFDL0Isa0JBQThCO0FBRTlCLG9CQUEwQjtBQUMxQixnQkFBMkI7QUFDM0IscUNBQXdDO0FBQ3hDLG9CQUE2QjtBQUM3QixnQ0FBbUM7QUFDbkMsWUFBdUI7QUFRdkIsYUFBd0I7QUFFeEIsVUFBcUI7QUFF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
