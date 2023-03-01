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
var Attachment_exports = {};
__export(Attachment_exports, {
  TextAttachmentStyleType: () => TextAttachmentStyleType,
  _replaceUnicodeOrderOverridesSync: () => _replaceUnicodeOrderOverridesSync,
  areAllAttachmentsVisual: () => areAllAttachmentsVisual,
  autoOrientJPEG: () => autoOrientJPEG,
  canBeDownloaded: () => canBeDownloaded,
  canBeTranscoded: () => canBeTranscoded,
  canDisplayImage: () => canDisplayImage,
  captureDimensionsAndScreenshot: () => captureDimensionsAndScreenshot,
  defaultBlurHash: () => defaultBlurHash,
  deleteData: () => deleteData,
  getAlt: () => getAlt,
  getExtensionForDisplay: () => getExtensionForDisplay,
  getFileExtension: () => getFileExtension,
  getGridDimensions: () => getGridDimensions,
  getImageDimensions: () => getImageDimensions,
  getMaximumAttachmentSize: () => getMaximumAttachmentSize,
  getSuggestedFilename: () => getSuggestedFilename,
  getThumbnailUrl: () => getThumbnailUrl,
  getUrl: () => getUrl,
  hasData: () => hasData,
  hasFailed: () => hasFailed,
  hasImage: () => hasImage,
  hasNotResolved: () => hasNotResolved,
  hasVideoBlurHash: () => hasVideoBlurHash,
  hasVideoScreenshot: () => hasVideoScreenshot,
  isAudio: () => isAudio,
  isDownloaded: () => isDownloaded,
  isDownloading: () => isDownloading,
  isFile: () => isFile,
  isGIF: () => isGIF,
  isImage: () => isImage,
  isImageAttachment: () => isImageAttachment,
  isValid: () => isValid,
  isVideo: () => isVideo,
  isVideoAttachment: () => isVideoAttachment,
  isVisualMedia: () => isVisualMedia,
  isVoiceMessage: () => isVoiceMessage,
  loadData: () => loadData,
  migrateDataToFileSystem: () => migrateDataToFileSystem,
  removeSchemaVersion: () => removeSchemaVersion,
  replaceUnicodeOrderOverrides: () => replaceUnicodeOrderOverrides,
  replaceUnicodeV2: () => replaceUnicodeV2,
  save: () => save
});
module.exports = __toCommonJS(Attachment_exports);
var import_is = __toESM(require("@sindresorhus/is"));
var import_moment = __toESM(require("moment"));
var import_lodash = require("lodash");
var import_blob_util = require("blob-util");
var MIME = __toESM(require("./MIME"));
var log = __toESM(require("../logging/log"));
var import_errors = require("./errors");
var import_protobuf = require("../protobuf");
var import_GoogleChrome = require("../util/GoogleChrome");
var import_Util = require("./Util");
var import_scaleImageToLevel = require("../util/scaleImageToLevel");
var GoogleChrome = __toESM(require("../util/GoogleChrome"));
var import_parseIntOrThrow = require("../util/parseIntOrThrow");
var import_RemoteConfig = require("../RemoteConfig");
var import_isRecord = require("../util/isRecord");
const MAX_WIDTH = 300;
const MAX_HEIGHT = MAX_WIDTH * 1.5;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 50;
var TextAttachmentStyleType = /* @__PURE__ */ ((TextAttachmentStyleType2) => {
  TextAttachmentStyleType2[TextAttachmentStyleType2["DEFAULT"] = 0] = "DEFAULT";
  TextAttachmentStyleType2[TextAttachmentStyleType2["REGULAR"] = 1] = "REGULAR";
  TextAttachmentStyleType2[TextAttachmentStyleType2["BOLD"] = 2] = "BOLD";
  TextAttachmentStyleType2[TextAttachmentStyleType2["SERIF"] = 3] = "SERIF";
  TextAttachmentStyleType2[TextAttachmentStyleType2["SCRIPT"] = 4] = "SCRIPT";
  TextAttachmentStyleType2[TextAttachmentStyleType2["CONDENSED"] = 5] = "CONDENSED";
  return TextAttachmentStyleType2;
})(TextAttachmentStyleType || {});
async function migrateDataToFileSystem(attachment, {
  writeNewAttachmentData,
  logger
}) {
  if (!(0, import_lodash.isFunction)(writeNewAttachmentData)) {
    throw new TypeError("'writeNewAttachmentData' must be a function");
  }
  const { data } = attachment;
  const attachmentHasData = !(0, import_lodash.isUndefined)(data);
  const shouldSkipSchemaUpgrade = !attachmentHasData;
  if (shouldSkipSchemaUpgrade) {
    return attachment;
  }
  if (!(0, import_lodash.isTypedArray)(data)) {
    logger.warn("migrateDataToFileSystem: Attachment had non-array `data` field; deleting.");
    return (0, import_lodash.omit)({ ...attachment }, ["data"]);
  }
  const path = await writeNewAttachmentData(data);
  const attachmentWithoutData = (0, import_lodash.omit)({ ...attachment, path }, ["data"]);
  return attachmentWithoutData;
}
function isValid(rawAttachment) {
  if (!rawAttachment) {
    return false;
  }
  return true;
}
async function autoOrientJPEG(attachment, { logger }, {
  sendHQImages = false,
  isIncoming = false
} = {}) {
  if (isIncoming && !MIME.isJPEG(attachment.contentType)) {
    return attachment;
  }
  if (!canBeTranscoded(attachment)) {
    return attachment;
  }
  if (!attachment.data || sendHQImages) {
    return attachment;
  }
  const dataBlob = new Blob([attachment.data], {
    type: attachment.contentType
  });
  try {
    const { blob: xcodedDataBlob } = await (0, import_scaleImageToLevel.scaleImageToLevel)(dataBlob, attachment.contentType, isIncoming);
    const xcodedDataArrayBuffer = await (0, import_blob_util.blobToArrayBuffer)(xcodedDataBlob);
    const xcodedAttachment = {
      ...(0, import_lodash.omit)(attachment, "digest"),
      data: new Uint8Array(xcodedDataArrayBuffer),
      size: xcodedDataArrayBuffer.byteLength
    };
    return xcodedAttachment;
  } catch (error) {
    const errorString = (0, import_isRecord.isRecord)(error) && "stack" in error ? error.stack : error;
    logger.error("autoOrientJPEG: Failed to rotate/scale attachment", errorString);
    return attachment;
  }
}
const UNICODE_LEFT_TO_RIGHT_OVERRIDE = "\u202D";
const UNICODE_RIGHT_TO_LEFT_OVERRIDE = "\u202E";
const UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";
const INVALID_CHARACTERS_PATTERN = new RegExp(`[${UNICODE_LEFT_TO_RIGHT_OVERRIDE}${UNICODE_RIGHT_TO_LEFT_OVERRIDE}]`, "g");
function _replaceUnicodeOrderOverridesSync(attachment) {
  if (!import_is.default.string(attachment.fileName)) {
    return attachment;
  }
  const normalizedFilename = attachment.fileName.replace(INVALID_CHARACTERS_PATTERN, UNICODE_REPLACEMENT_CHARACTER);
  const newAttachment = { ...attachment, fileName: normalizedFilename };
  return newAttachment;
}
const replaceUnicodeOrderOverrides = /* @__PURE__ */ __name(async (attachment) => {
  return _replaceUnicodeOrderOverridesSync(attachment);
}, "replaceUnicodeOrderOverrides");
const V2_UNWANTED_UNICODE = /[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g;
async function replaceUnicodeV2(attachment) {
  if (!import_is.default.string(attachment.fileName)) {
    return attachment;
  }
  const fileName = attachment.fileName.replace(V2_UNWANTED_UNICODE, UNICODE_REPLACEMENT_CHARACTER);
  return {
    ...attachment,
    fileName
  };
}
function removeSchemaVersion({
  attachment,
  logger
}) {
  if (!isValid(attachment)) {
    logger.error("Attachment.removeSchemaVersion: Invalid input attachment:", attachment);
    return attachment;
  }
  return (0, import_lodash.omit)(attachment, "schemaVersion");
}
function hasData(attachment) {
  return attachment.data instanceof Uint8Array;
}
function loadData(readAttachmentData) {
  if (!import_is.default.function_(readAttachmentData)) {
    throw new TypeError("'readAttachmentData' must be a function");
  }
  return async (attachment) => {
    if (!isValid(attachment)) {
      throw new TypeError("'attachment' is not valid");
    }
    const isAlreadyLoaded = Boolean(attachment.data);
    if (isAlreadyLoaded) {
      return attachment;
    }
    if (!import_is.default.string(attachment.path)) {
      throw new TypeError("'attachment.path' is required");
    }
    const data = await readAttachmentData(attachment.path);
    return { ...attachment, data, size: data.byteLength };
  };
}
function deleteData(deleteOnDisk) {
  if (!import_is.default.function_(deleteOnDisk)) {
    throw new TypeError("deleteData: deleteOnDisk must be a function");
  }
  return async (attachment) => {
    if (!isValid(attachment)) {
      throw new TypeError("deleteData: attachment is not valid");
    }
    const { path, thumbnail, screenshot } = attachment;
    if (import_is.default.string(path)) {
      await deleteOnDisk(path);
    }
    if (thumbnail && import_is.default.string(thumbnail.path)) {
      await deleteOnDisk(thumbnail.path);
    }
    if (screenshot && import_is.default.string(screenshot.path)) {
      await deleteOnDisk(screenshot.path);
    }
  };
}
const THUMBNAIL_SIZE = 150;
const THUMBNAIL_CONTENT_TYPE = MIME.IMAGE_PNG;
async function captureDimensionsAndScreenshot(attachment, params) {
  const { contentType } = attachment;
  const {
    writeNewAttachmentData,
    getAbsoluteAttachmentPath,
    makeObjectUrl,
    revokeObjectUrl,
    getImageDimensions: getImageDimensionsFromURL,
    makeImageThumbnail,
    makeVideoScreenshot,
    logger
  } = params;
  if (!GoogleChrome.isImageTypeSupported(contentType) && !GoogleChrome.isVideoTypeSupported(contentType)) {
    return attachment;
  }
  if (!attachment.path) {
    return attachment;
  }
  const absolutePath = getAbsoluteAttachmentPath(attachment.path);
  if (GoogleChrome.isImageTypeSupported(contentType)) {
    try {
      const { width, height } = await getImageDimensionsFromURL({
        objectUrl: absolutePath,
        logger
      });
      const thumbnailBuffer = await (0, import_blob_util.blobToArrayBuffer)(await makeImageThumbnail({
        size: THUMBNAIL_SIZE,
        objectUrl: absolutePath,
        contentType: THUMBNAIL_CONTENT_TYPE,
        logger
      }));
      const thumbnailPath = await writeNewAttachmentData(new Uint8Array(thumbnailBuffer));
      return {
        ...attachment,
        width,
        height,
        thumbnail: {
          path: thumbnailPath,
          contentType: THUMBNAIL_CONTENT_TYPE,
          width: THUMBNAIL_SIZE,
          height: THUMBNAIL_SIZE
        }
      };
    } catch (error) {
      logger.error("captureDimensionsAndScreenshot:", "error processing image; skipping screenshot generation", (0, import_errors.toLogFormat)(error));
      return attachment;
    }
  }
  let screenshotObjectUrl;
  try {
    const screenshotBuffer = await (0, import_blob_util.blobToArrayBuffer)(await makeVideoScreenshot({
      objectUrl: absolutePath,
      contentType: THUMBNAIL_CONTENT_TYPE,
      logger
    }));
    screenshotObjectUrl = makeObjectUrl(screenshotBuffer, THUMBNAIL_CONTENT_TYPE);
    const { width, height } = await getImageDimensionsFromURL({
      objectUrl: screenshotObjectUrl,
      logger
    });
    const screenshotPath = await writeNewAttachmentData(new Uint8Array(screenshotBuffer));
    const thumbnailBuffer = await (0, import_blob_util.blobToArrayBuffer)(await makeImageThumbnail({
      size: THUMBNAIL_SIZE,
      objectUrl: screenshotObjectUrl,
      contentType: THUMBNAIL_CONTENT_TYPE,
      logger
    }));
    const thumbnailPath = await writeNewAttachmentData(new Uint8Array(thumbnailBuffer));
    return {
      ...attachment,
      screenshot: {
        contentType: THUMBNAIL_CONTENT_TYPE,
        path: screenshotPath,
        width,
        height
      },
      thumbnail: {
        path: thumbnailPath,
        contentType: THUMBNAIL_CONTENT_TYPE,
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE
      },
      width,
      height
    };
  } catch (error) {
    logger.error("captureDimensionsAndScreenshot: error processing video; skipping screenshot generation", (0, import_errors.toLogFormat)(error));
    return attachment;
  } finally {
    if (screenshotObjectUrl !== void 0) {
      revokeObjectUrl(screenshotObjectUrl);
    }
  }
}
function getExtensionForDisplay({
  fileName,
  contentType
}) {
  if (fileName && fileName.indexOf(".") >= 0) {
    const lastPeriod = fileName.lastIndexOf(".");
    const extension = fileName.slice(lastPeriod + 1);
    if (extension.length) {
      return extension;
    }
  }
  if (!contentType) {
    return void 0;
  }
  const slash = contentType.indexOf("/");
  if (slash >= 0) {
    return contentType.slice(slash + 1);
  }
  return void 0;
}
function isAudio(attachments) {
  return Boolean(attachments && attachments[0] && attachments[0].contentType && !attachments[0].isCorrupted && MIME.isAudio(attachments[0].contentType));
}
function canDisplayImage(attachments) {
  const { height, width } = attachments && attachments[0] ? attachments[0] : { height: 0, width: 0 };
  return Boolean(height && height > 0 && height <= 4096 && width && width > 0 && width <= 4096);
}
function getThumbnailUrl(attachment) {
  if (attachment.thumbnail) {
    return attachment.thumbnail.url;
  }
  return getUrl(attachment);
}
function getUrl(attachment) {
  if (attachment.screenshot) {
    return attachment.screenshot.url;
  }
  if (isVideoAttachment(attachment)) {
    return void 0;
  }
  return attachment.url;
}
function isImage(attachments) {
  return Boolean(attachments && attachments[0] && attachments[0].contentType && (0, import_GoogleChrome.isImageTypeSupported)(attachments[0].contentType));
}
function isImageAttachment(attachment) {
  return Boolean(attachment && attachment.contentType && (0, import_GoogleChrome.isImageTypeSupported)(attachment.contentType));
}
function canBeTranscoded(attachment) {
  return Boolean(attachment && isImageAttachment(attachment) && !MIME.isGif(attachment.contentType));
}
function hasImage(attachments) {
  return Boolean(attachments && attachments[0] && (attachments[0].url || attachments[0].pending || attachments[0].blurHash));
}
function isVideo(attachments) {
  if (!attachments || attachments.length === 0) {
    return false;
  }
  return isVideoAttachment(attachments[0]);
}
function isVideoAttachment(attachment) {
  if (!attachment || !attachment.contentType) {
    return false;
  }
  return (0, import_GoogleChrome.isVideoTypeSupported)(attachment.contentType);
}
function isGIF(attachments) {
  if (!attachments || attachments.length !== 1) {
    return false;
  }
  const [attachment] = attachments;
  const flag = import_protobuf.SignalService.AttachmentPointer.Flags.GIF;
  const hasFlag = !import_is.default.undefined(attachment.flags) && (attachment.flags & flag) === flag;
  return hasFlag && isVideoAttachment(attachment);
}
function isDownloaded(attachment) {
  return Boolean(attachment && (attachment.path || attachment.textAttachment));
}
function hasNotResolved(attachment) {
  return Boolean(attachment && !attachment.url && !attachment.textAttachment);
}
function isDownloading(attachment) {
  return Boolean(attachment && attachment.downloadJobId && attachment.pending);
}
function hasFailed(attachment) {
  return Boolean(attachment && attachment.error);
}
function hasVideoBlurHash(attachments) {
  const firstAttachment = attachments ? attachments[0] : null;
  return Boolean(firstAttachment && firstAttachment.blurHash);
}
function hasVideoScreenshot(attachments) {
  const firstAttachment = attachments ? attachments[0] : null;
  return firstAttachment && firstAttachment.screenshot && firstAttachment.screenshot.url;
}
function getImageDimensions(attachment, forcedWidth) {
  const { height, width } = attachment;
  if (!height || !width) {
    return {
      height: MIN_HEIGHT,
      width: MIN_WIDTH
    };
  }
  const aspectRatio = height / width;
  const targetWidth = forcedWidth || Math.max(Math.min(MAX_WIDTH, width), MIN_WIDTH);
  const candidateHeight = Math.round(targetWidth * aspectRatio);
  return {
    width: targetWidth,
    height: Math.max(Math.min(MAX_HEIGHT, candidateHeight), MIN_HEIGHT)
  };
}
function areAllAttachmentsVisual(attachments) {
  if (!attachments) {
    return false;
  }
  const max = attachments.length;
  for (let i = 0; i < max; i += 1) {
    const attachment = attachments[i];
    if (!isImageAttachment(attachment) && !isVideoAttachment(attachment)) {
      return false;
    }
  }
  return true;
}
function getGridDimensions(attachments) {
  if (!attachments || !attachments.length) {
    return null;
  }
  if (!isImage(attachments) && !isVideo(attachments)) {
    return null;
  }
  if (attachments.length === 1) {
    return getImageDimensions(attachments[0]);
  }
  if (attachments.length === 2) {
    return {
      height: 150,
      width: 300
    };
  }
  if (attachments.length === 3) {
    return {
      height: 200,
      width: 300
    };
  }
  if (attachments.length === 4) {
    return {
      height: 300,
      width: 300
    };
  }
  return {
    height: 250,
    width: 300
  };
}
function getAlt(attachment, i18n) {
  if (isVideoAttachment(attachment)) {
    return i18n("videoAttachmentAlt");
  }
  return i18n("imageAttachmentAlt");
}
const isVisualMedia = /* @__PURE__ */ __name((attachment) => {
  const { contentType } = attachment;
  if (import_is.default.undefined(contentType)) {
    return false;
  }
  if (isVoiceMessage(attachment)) {
    return false;
  }
  return MIME.isImage(contentType) || MIME.isVideo(contentType);
}, "isVisualMedia");
const isFile = /* @__PURE__ */ __name((attachment) => {
  const { contentType } = attachment;
  if (import_is.default.undefined(contentType)) {
    return false;
  }
  if (isVisualMedia(attachment)) {
    return false;
  }
  if (isVoiceMessage(attachment)) {
    return false;
  }
  return true;
}, "isFile");
const isVoiceMessage = /* @__PURE__ */ __name((attachment) => {
  const flag = import_protobuf.SignalService.AttachmentPointer.Flags.VOICE_MESSAGE;
  const hasFlag = !import_is.default.undefined(attachment.flags) && (attachment.flags & flag) === flag;
  if (hasFlag) {
    return true;
  }
  const isLegacyAndroidVoiceMessage = !import_is.default.undefined(attachment.contentType) && MIME.isAudio(attachment.contentType) && !attachment.fileName;
  if (isLegacyAndroidVoiceMessage) {
    return true;
  }
  return false;
}, "isVoiceMessage");
const save = /* @__PURE__ */ __name(async ({
  attachment,
  index,
  readAttachmentData,
  saveAttachmentToDisk,
  timestamp
}) => {
  let data;
  if (attachment.path) {
    data = await readAttachmentData(attachment.path);
  } else if (attachment.data) {
    data = attachment.data;
  } else {
    throw new Error("Attachment had neither path nor data");
  }
  const name = getSuggestedFilename({ attachment, timestamp, index });
  const result = await saveAttachmentToDisk({
    data,
    name
  });
  if (!result) {
    return null;
  }
  return result.fullPath;
}, "save");
const getSuggestedFilename = /* @__PURE__ */ __name(({
  attachment,
  timestamp,
  index
}) => {
  const { fileName } = attachment;
  if (fileName && (!(0, import_lodash.isNumber)(index) || index === 1)) {
    return fileName;
  }
  const prefix = "signal";
  const suffix = timestamp ? (0, import_moment.default)(timestamp).format("-YYYY-MM-DD-HHmmss") : "";
  const fileType = getFileExtension(attachment);
  const extension = fileType ? `.${fileType}` : "";
  const indexSuffix = (0, import_lodash.isNumber)(index) && index > 1 ? `_${(0, import_lodash.padStart)(index.toString(), 3, "0")}` : "";
  return `${prefix}${suffix}${indexSuffix}${extension}`;
}, "getSuggestedFilename");
const getFileExtension = /* @__PURE__ */ __name((attachment) => {
  if (!attachment.contentType) {
    return void 0;
  }
  switch (attachment.contentType) {
    case "video/quicktime":
      return "mov";
    default:
      return attachment.contentType.split("/")[1];
  }
}, "getFileExtension");
const MEBIBYTE = 1024 * 1024;
const DEFAULT_MAX = 100 * MEBIBYTE;
const getMaximumAttachmentSize = /* @__PURE__ */ __name(() => {
  try {
    return (0, import_parseIntOrThrow.parseIntOrThrow)((0, import_RemoteConfig.getValue)("global.attachments.maxBytes"), "preProcessAttachment/maxAttachmentSize");
  } catch (error) {
    log.warn("Failed to parse integer out of global.attachments.maxBytes feature flag");
    return DEFAULT_MAX;
  }
}, "getMaximumAttachmentSize");
const defaultBlurHash = /* @__PURE__ */ __name((theme = import_Util.ThemeType.light) => {
  if (theme === import_Util.ThemeType.dark) {
    return "L05OQnoffQofoffQfQfQfQfQfQfQ";
  }
  return "L1Q]+w-;fQ-;~qfQfQfQfQfQfQfQ";
}, "defaultBlurHash");
const canBeDownloaded = /* @__PURE__ */ __name((attachment) => {
  return Boolean(attachment.key && attachment.digest);
}, "canBeDownloaded");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextAttachmentStyleType,
  _replaceUnicodeOrderOverridesSync,
  areAllAttachmentsVisual,
  autoOrientJPEG,
  canBeDownloaded,
  canBeTranscoded,
  canDisplayImage,
  captureDimensionsAndScreenshot,
  defaultBlurHash,
  deleteData,
  getAlt,
  getExtensionForDisplay,
  getFileExtension,
  getGridDimensions,
  getImageDimensions,
  getMaximumAttachmentSize,
  getSuggestedFilename,
  getThumbnailUrl,
  getUrl,
  hasData,
  hasFailed,
  hasImage,
  hasNotResolved,
  hasVideoBlurHash,
  hasVideoScreenshot,
  isAudio,
  isDownloaded,
  isDownloading,
  isFile,
  isGIF,
  isImage,
  isImageAttachment,
  isValid,
  isVideo,
  isVideoAttachment,
  isVisualMedia,
  isVoiceMessage,
  loadData,
  migrateDataToFileSystem,
  removeSchemaVersion,
  replaceUnicodeOrderOverrides,
  replaceUnicodeV2,
  save
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXR0YWNobWVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBpcyBmcm9tICdAc2luZHJlc29yaHVzL2lzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7XG4gIGlzTnVtYmVyLFxuICBwYWRTdGFydCxcbiAgaXNUeXBlZEFycmF5LFxuICBpc0Z1bmN0aW9uLFxuICBpc1VuZGVmaW5lZCxcbiAgb21pdCxcbn0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGJsb2JUb0FycmF5QnVmZmVyIH0gZnJvbSAnYmxvYi11dGlsJztcblxuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi9Mb2dnaW5nJztcbmltcG9ydCAqIGFzIE1JTUUgZnJvbSAnLi9NSU1FJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyB0b0xvZ0Zvcm1hdCB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQge1xuICBpc0ltYWdlVHlwZVN1cHBvcnRlZCxcbiAgaXNWaWRlb1R5cGVTdXBwb3J0ZWQsXG59IGZyb20gJy4uL3V0aWwvR29vZ2xlQ2hyb21lJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4vVXRpbCc7XG5pbXBvcnQgeyBUaGVtZVR5cGUgfSBmcm9tICcuL1V0aWwnO1xuaW1wb3J0IHsgc2NhbGVJbWFnZVRvTGV2ZWwgfSBmcm9tICcuLi91dGlsL3NjYWxlSW1hZ2VUb0xldmVsJztcbmltcG9ydCAqIGFzIEdvb2dsZUNocm9tZSBmcm9tICcuLi91dGlsL0dvb2dsZUNocm9tZSc7XG5pbXBvcnQgeyBwYXJzZUludE9yVGhyb3cgfSBmcm9tICcuLi91dGlsL3BhcnNlSW50T3JUaHJvdyc7XG5pbXBvcnQgeyBnZXRWYWx1ZSB9IGZyb20gJy4uL1JlbW90ZUNvbmZpZyc7XG5pbXBvcnQgeyBpc1JlY29yZCB9IGZyb20gJy4uL3V0aWwvaXNSZWNvcmQnO1xuXG5jb25zdCBNQVhfV0lEVEggPSAzMDA7XG5jb25zdCBNQVhfSEVJR0hUID0gTUFYX1dJRFRIICogMS41O1xuY29uc3QgTUlOX1dJRFRIID0gMjAwO1xuY29uc3QgTUlOX0hFSUdIVCA9IDUwO1xuXG4vLyBVc2VkIGZvciBkaXNwbGF5XG5cbmV4cG9ydCB0eXBlIEF0dGFjaG1lbnRUeXBlID0ge1xuICBlcnJvcj86IGJvb2xlYW47XG4gIGJsdXJIYXNoPzogc3RyaW5nO1xuICBjYXB0aW9uPzogc3RyaW5nO1xuICBjb250ZW50VHlwZTogTUlNRS5NSU1FVHlwZTtcbiAgZmlsZU5hbWU/OiBzdHJpbmc7XG4gIC8qKiBOb3QgaW5jbHVkZWQgaW4gcHJvdG9idWYsIG5lZWRzIHRvIGJlIHB1bGxlZCBmcm9tIGZsYWdzICovXG4gIGlzVm9pY2VNZXNzYWdlPzogYm9vbGVhbjtcbiAgLyoqIEZvciBtZXNzYWdlcyBub3QgYWxyZWFkeSBvbiBkaXNrLCB0aGlzIHdpbGwgYmUgYSBkYXRhIHVybCAqL1xuICB1cmw/OiBzdHJpbmc7XG4gIHNpemU6IG51bWJlcjtcbiAgZmlsZVNpemU/OiBzdHJpbmc7XG4gIHBlbmRpbmc/OiBib29sZWFuO1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBwYXRoPzogc3RyaW5nO1xuICBzY3JlZW5zaG90Pzoge1xuICAgIGhlaWdodDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgdXJsPzogc3RyaW5nO1xuICAgIGNvbnRlbnRUeXBlOiBNSU1FLk1JTUVUeXBlO1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBkYXRhPzogVWludDhBcnJheTtcbiAgfTtcbiAgc2NyZWVuc2hvdERhdGE/OiBVaW50OEFycmF5O1xuICBzY3JlZW5zaG90UGF0aD86IHN0cmluZztcbiAgZmxhZ3M/OiBudW1iZXI7XG4gIHRodW1ibmFpbD86IFRodW1ibmFpbFR5cGU7XG4gIGlzQ29ycnVwdGVkPzogYm9vbGVhbjtcbiAgZG93bmxvYWRKb2JJZD86IHN0cmluZztcbiAgY2RuTnVtYmVyPzogbnVtYmVyO1xuICBjZG5JZD86IHN0cmluZztcbiAgY2RuS2V5Pzogc3RyaW5nO1xuICBkYXRhPzogVWludDhBcnJheTtcbiAgdGV4dEF0dGFjaG1lbnQ/OiBUZXh0QXR0YWNobWVudFR5cGU7XG5cbiAgLyoqIExlZ2FjeSBmaWVsZC4gVXNlZCBvbmx5IGZvciBkb3dubG9hZGluZyBvbGQgYXR0YWNobWVudHMgKi9cbiAgaWQ/OiBudW1iZXI7XG5cbiAgLyoqIExlZ2FjeSBmaWVsZCwgdXNlZCBsb25nIGFnbyBmb3IgbWlncmF0aW5nIGF0dGFjaG1lbnRzIHRvIGRpc2suICovXG4gIHNjaGVtYVZlcnNpb24/OiBudW1iZXI7XG5cbiAgLyoqIFJlbW92ZWQgb25jZSB3ZSBkb3dubG9hZCB0aGUgYXR0YWNobWVudCAqL1xuICBkaWdlc3Q/OiBzdHJpbmc7XG4gIGtleT86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEF0dGFjaG1lbnRXaXRoSHlkcmF0ZWREYXRhID0gQXR0YWNobWVudFR5cGUgJiB7XG4gIGRhdGE6IFVpbnQ4QXJyYXk7XG59O1xuXG5leHBvcnQgZW51bSBUZXh0QXR0YWNobWVudFN0eWxlVHlwZSB7XG4gIERFRkFVTFQgPSAwLFxuICBSRUdVTEFSID0gMSxcbiAgQk9MRCA9IDIsXG4gIFNFUklGID0gMyxcbiAgU0NSSVBUID0gNCxcbiAgQ09OREVOU0VEID0gNSxcbn1cblxuZXhwb3J0IHR5cGUgVGV4dEF0dGFjaG1lbnRUeXBlID0ge1xuICB0ZXh0Pzogc3RyaW5nIHwgbnVsbDtcbiAgdGV4dFN0eWxlPzogbnVtYmVyIHwgbnVsbDtcbiAgdGV4dEZvcmVncm91bmRDb2xvcj86IG51bWJlciB8IG51bGw7XG4gIHRleHRCYWNrZ3JvdW5kQ29sb3I/OiBudW1iZXIgfCBudWxsO1xuICBwcmV2aWV3Pzoge1xuICAgIGltYWdlPzogQXR0YWNobWVudFR5cGU7XG4gICAgdGl0bGU/OiBzdHJpbmcgfCBudWxsO1xuICAgIHVybD86IHN0cmluZyB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBncmFkaWVudD86IHtcbiAgICBzdGFydENvbG9yPzogbnVtYmVyIHwgbnVsbDtcbiAgICBlbmRDb2xvcj86IG51bWJlciB8IG51bGw7XG4gICAgYW5nbGU/OiBudW1iZXIgfCBudWxsO1xuICB9IHwgbnVsbDtcbiAgY29sb3I/OiBudW1iZXIgfCBudWxsO1xufTtcblxuZXhwb3J0IHR5cGUgRG93bmxvYWRlZEF0dGFjaG1lbnRUeXBlID0gQXR0YWNobWVudFR5cGUgJiB7XG4gIGRhdGE6IFVpbnQ4QXJyYXk7XG59O1xuXG5leHBvcnQgdHlwZSBCYXNlQXR0YWNobWVudERyYWZ0VHlwZSA9IHtcbiAgYmx1ckhhc2g/OiBzdHJpbmc7XG4gIGNvbnRlbnRUeXBlOiBNSU1FLk1JTUVUeXBlO1xuICBzY3JlZW5zaG90Q29udGVudFR5cGU/OiBzdHJpbmc7XG4gIHNjcmVlbnNob3RTaXplPzogbnVtYmVyO1xuICBzaXplOiBudW1iZXI7XG4gIGZsYWdzPzogbnVtYmVyO1xufTtcblxuLy8gQW4gZXBoZW1lcmFsIGF0dGFjaG1lbnQgdHlwZSwgdXNlZCBiZXR3ZWVuIHVzZXIncyByZXF1ZXN0IHRvIGFkZCB0aGUgYXR0YWNobWVudCBhc1xuLy8gICBhIGRyYWZ0IGFuZCBmaW5hbCBzYXZlIG9uIGRpc2sgYW5kIGluIGNvbnZlcnNhdGlvbi5kcmFmdEF0dGFjaG1lbnRzLlxuZXhwb3J0IHR5cGUgSW5NZW1vcnlBdHRhY2htZW50RHJhZnRUeXBlID1cbiAgfCAoe1xuICAgICAgZGF0YTogVWludDhBcnJheTtcbiAgICAgIHBlbmRpbmc6IGZhbHNlO1xuICAgICAgc2NyZWVuc2hvdERhdGE/OiBVaW50OEFycmF5O1xuICAgICAgZmlsZU5hbWU/OiBzdHJpbmc7XG4gICAgICBwYXRoPzogc3RyaW5nO1xuICAgIH0gJiBCYXNlQXR0YWNobWVudERyYWZ0VHlwZSlcbiAgfCB7XG4gICAgICBjb250ZW50VHlwZTogTUlNRS5NSU1FVHlwZTtcbiAgICAgIGZpbGVOYW1lPzogc3RyaW5nO1xuICAgICAgcGF0aD86IHN0cmluZztcbiAgICAgIHBlbmRpbmc6IHRydWU7XG4gICAgICBzaXplOiBudW1iZXI7XG4gICAgfTtcblxuLy8gV2hhdCdzIHN0b3JlZCBpbiBjb252ZXJzYXRpb24uZHJhZnRBdHRhY2htZW50c1xuZXhwb3J0IHR5cGUgQXR0YWNobWVudERyYWZ0VHlwZSA9XG4gIHwgKHtcbiAgICAgIHVybD86IHN0cmluZztcbiAgICAgIHNjcmVlbnNob3RQYXRoPzogc3RyaW5nO1xuICAgICAgcGVuZGluZzogZmFsc2U7XG4gICAgICAvLyBPbGQgZHJhZnQgYXR0YWNobWVudHMgbWF5IGhhdmUgYSBjYXB0aW9uLCB0aG91Z2ggdGhleSBhcmUgbm8gbG9uZ2VyIGVkaXRhYmxlXG4gICAgICAvLyAgIGJlY2F1c2Ugd2UgcmVtb3ZlZCB0aGUgY2FwdGlvbiBlZGl0b3IuXG4gICAgICBjYXB0aW9uPzogc3RyaW5nO1xuICAgICAgZmlsZU5hbWU/OiBzdHJpbmc7XG4gICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICB3aWR0aD86IG51bWJlcjtcbiAgICAgIGhlaWdodD86IG51bWJlcjtcbiAgICB9ICYgQmFzZUF0dGFjaG1lbnREcmFmdFR5cGUpXG4gIHwge1xuICAgICAgY29udGVudFR5cGU6IE1JTUUuTUlNRVR5cGU7XG4gICAgICBmaWxlTmFtZT86IHN0cmluZztcbiAgICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgICBwZW5kaW5nOiB0cnVlO1xuICAgICAgc2l6ZTogbnVtYmVyO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIFRodW1ibmFpbFR5cGUgPSBQaWNrPFxuICBBdHRhY2htZW50VHlwZSxcbiAgJ2hlaWdodCcgfCAnd2lkdGgnIHwgJ3VybCcgfCAnY29udGVudFR5cGUnIHwgJ3BhdGgnIHwgJ2RhdGEnXG4+ICYge1xuICAvLyBPbmx5IHVzZWQgd2hlbiBxdW90ZSBuZWVkZWQgdG8gbWFrZSBhbiBpbi1tZW1vcnkgdGh1bWJuYWlsXG4gIG9iamVjdFVybD86IHN0cmluZztcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaWdyYXRlRGF0YVRvRmlsZVN5c3RlbShcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGUsXG4gIHtcbiAgICB3cml0ZU5ld0F0dGFjaG1lbnREYXRhLFxuICAgIGxvZ2dlcixcbiAgfToge1xuICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGE6IChkYXRhOiBVaW50OEFycmF5KSA9PiBQcm9taXNlPHN0cmluZz47XG4gICAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xuICB9XG4pOiBQcm9taXNlPEF0dGFjaG1lbnRUeXBlPiB7XG4gIGlmICghaXNGdW5jdGlvbih3cml0ZU5ld0F0dGFjaG1lbnREYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInd3JpdGVOZXdBdHRhY2htZW50RGF0YScgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgY29uc3QgeyBkYXRhIH0gPSBhdHRhY2htZW50O1xuICBjb25zdCBhdHRhY2htZW50SGFzRGF0YSA9ICFpc1VuZGVmaW5lZChkYXRhKTtcbiAgY29uc3Qgc2hvdWxkU2tpcFNjaGVtYVVwZ3JhZGUgPSAhYXR0YWNobWVudEhhc0RhdGE7XG4gIGlmIChzaG91bGRTa2lwU2NoZW1hVXBncmFkZSkge1xuICAgIHJldHVybiBhdHRhY2htZW50O1xuICB9XG5cbiAgLy8gVGhpcyBhdHRhY2htZW50IHdhcyBhbHJlYWR5IGJyb2tlbiBieSBhIHJvdW5kdHJpcCB0byB0aGUgZGF0YWJhc2UgLSByZXBhaXIgaXQgbm93XG4gIGlmICghaXNUeXBlZEFycmF5KGRhdGEpKSB7XG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICAnbWlncmF0ZURhdGFUb0ZpbGVTeXN0ZW06IEF0dGFjaG1lbnQgaGFkIG5vbi1hcnJheSBgZGF0YWAgZmllbGQ7IGRlbGV0aW5nLidcbiAgICApO1xuICAgIHJldHVybiBvbWl0KHsgLi4uYXR0YWNobWVudCB9LCBbJ2RhdGEnXSk7XG4gIH1cblxuICBjb25zdCBwYXRoID0gYXdhaXQgd3JpdGVOZXdBdHRhY2htZW50RGF0YShkYXRhKTtcblxuICBjb25zdCBhdHRhY2htZW50V2l0aG91dERhdGEgPSBvbWl0KHsgLi4uYXR0YWNobWVudCwgcGF0aCB9LCBbJ2RhdGEnXSk7XG4gIHJldHVybiBhdHRhY2htZW50V2l0aG91dERhdGE7XG59XG5cbi8vIC8vIEluY29taW5nIG1lc3NhZ2UgYXR0YWNobWVudCBmaWVsZHNcbi8vIHtcbi8vICAgaWQ6IHN0cmluZ1xuLy8gICBjb250ZW50VHlwZTogTUlNRVR5cGVcbi8vICAgZGF0YTogVWludDhBcnJheVxuLy8gICBkaWdlc3Q6IFVpbnQ4QXJyYXlcbi8vICAgZmlsZU5hbWU/OiBzdHJpbmdcbi8vICAgZmxhZ3M6IG51bGxcbi8vICAga2V5OiBVaW50OEFycmF5XG4vLyAgIHNpemU6IGludGVnZXJcbi8vICAgdGh1bWJuYWlsOiBVaW50OEFycmF5XG4vLyB9XG5cbi8vIC8vIE91dGdvaW5nIG1lc3NhZ2UgYXR0YWNobWVudCBmaWVsZHNcbi8vIHtcbi8vICAgY29udGVudFR5cGU6IE1JTUVUeXBlXG4vLyAgIGRhdGE6IFVpbnQ4QXJyYXlcbi8vICAgZmlsZU5hbWU6IHN0cmluZ1xuLy8gICBzaXplOiBpbnRlZ2VyXG4vLyB9XG5cbi8vIFJldHVybnMgdHJ1ZSBpZiBgcmF3QXR0YWNobWVudGAgaXMgYSB2YWxpZCBhdHRhY2htZW50IGJhc2VkIG9uIG91ciBjdXJyZW50IHNjaGVtYS5cbi8vIE92ZXIgdGltZSwgd2UgY2FuIGV4cGFuZCB0aGlzIGRlZmluaXRpb24gdG8gYmVjb21lIG1vcmUgbmFycm93LCBlLmcuIHJlcXVpcmUgY2VydGFpblxuLy8gZmllbGRzLCBldGMuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZChcbiAgcmF3QXR0YWNobWVudD86IFBpY2s8QXR0YWNobWVudFR5cGUsICdkYXRhJyB8ICdwYXRoJz5cbik6IHJhd0F0dGFjaG1lbnQgaXMgQXR0YWNobWVudFR5cGUge1xuICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlIGBfLmlzUGxhaW5PYmplY3RgIGJlY2F1c2UgYHJhd0F0dGFjaG1lbnRgIGlzXG4gIC8vIGRlc2VyaWFsaXplZCBieSBwcm90b2J1ZjpcbiAgaWYgKCFyYXdBdHRhY2htZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFVwZ3JhZGUgc3RlcHNcbi8vIE5PVEU6IFRoaXMgc3RlcCBzdHJpcHMgYWxsIEVYSUYgbWV0YWRhdGEgZnJvbSBKUEVHIGltYWdlcyBhc1xuLy8gcGFydCBvZiByZS1lbmNvZGluZyB0aGUgaW1hZ2U6XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXV0b09yaWVudEpQRUcoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICB7IGxvZ2dlciB9OiB7IGxvZ2dlcjogTG9nZ2VyVHlwZSB9LFxuICB7XG4gICAgc2VuZEhRSW1hZ2VzID0gZmFsc2UsXG4gICAgaXNJbmNvbWluZyA9IGZhbHNlLFxuICB9OiB7XG4gICAgc2VuZEhRSW1hZ2VzPzogYm9vbGVhbjtcbiAgICBpc0luY29taW5nPzogYm9vbGVhbjtcbiAgfSA9IHt9XG4pOiBQcm9taXNlPEF0dGFjaG1lbnRUeXBlPiB7XG4gIGlmIChpc0luY29taW5nICYmICFNSU1FLmlzSlBFRyhhdHRhY2htZW50LmNvbnRlbnRUeXBlKSkge1xuICAgIHJldHVybiBhdHRhY2htZW50O1xuICB9XG5cbiAgaWYgKCFjYW5CZVRyYW5zY29kZWQoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgfVxuXG4gIC8vIElmIHdlIGhhdmVuJ3QgZG93bmxvYWRlZCB0aGUgYXR0YWNobWVudCB5ZXQsIHdlIHdvbid0IGhhdmUgdGhlIGRhdGEuXG4gIC8vIEFsbCBpbWFnZXMgZ28gdGhyb3VnaCBoYW5kbGVJbWFnZUF0dGFjaG1lbnQgYmVmb3JlIGJlaW5nIHNlbnQgYW5kIHRodXMgaGF2ZVxuICAvLyBhbHJlYWR5IGJlZW4gc2NhbGVkIHRvIGxldmVsLCBvcmllbnRlZCwgc3RyaXBwZWQgb2YgZXhpZiBkYXRhLCBhbmQgc2F2ZWRcbiAgLy8gaW4gaGlnaCBxdWFsaXR5IGZvcm1hdC4gSWYgd2Ugd2FudCB0byBzZW5kIHRoZSBpbWFnZSBpbiBIUSB3ZSBjYW4gcmV0dXJuXG4gIC8vIHRoZSBhdHRhY2htZW50IGFzLWlzLiBPdGhlcndpc2Ugd2UnbGwgaGF2ZSB0byBmdXJ0aGVyIHNjYWxlIGl0IGRvd24uXG4gIGlmICghYXR0YWNobWVudC5kYXRhIHx8IHNlbmRIUUltYWdlcykge1xuICAgIHJldHVybiBhdHRhY2htZW50O1xuICB9XG5cbiAgY29uc3QgZGF0YUJsb2IgPSBuZXcgQmxvYihbYXR0YWNobWVudC5kYXRhXSwge1xuICAgIHR5cGU6IGF0dGFjaG1lbnQuY29udGVudFR5cGUsXG4gIH0pO1xuICB0cnkge1xuICAgIGNvbnN0IHsgYmxvYjogeGNvZGVkRGF0YUJsb2IgfSA9IGF3YWl0IHNjYWxlSW1hZ2VUb0xldmVsKFxuICAgICAgZGF0YUJsb2IsXG4gICAgICBhdHRhY2htZW50LmNvbnRlbnRUeXBlLFxuICAgICAgaXNJbmNvbWluZ1xuICAgICk7XG4gICAgY29uc3QgeGNvZGVkRGF0YUFycmF5QnVmZmVyID0gYXdhaXQgYmxvYlRvQXJyYXlCdWZmZXIoeGNvZGVkRGF0YUJsb2IpO1xuXG4gICAgLy8gSU1QT1JUQU5UOiBXZSBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGBkYXRhYCBgVWludDhBcnJheWAgbG9zaW5nIHRoZSBvcmlnaW5hbFxuICAgIC8vIGltYWdlIGRhdGEuIElkZWFsbHksIHdlXHUyMDE5ZCBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgaW1hZ2UgZGF0YSBmb3IgdXNlcnMgd2hvIHdhbnQgdG9cbiAgICAvLyByZXRhaW4gaXQgYnV0IGR1ZSB0byByZXBvcnRzIG9mIGRhdGEgbG9zcywgd2UgZG9uXHUyMDE5dCB3YW50IHRvIG92ZXJidXJkZW4gSW5kZXhlZERCXG4gICAgLy8gYnkgcG90ZW50aWFsbHkgZG91Ymxpbmcgc3RvcmVkIGltYWdlIGRhdGEuXG4gICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vc2lnbmFsYXBwL1NpZ25hbC1EZXNrdG9wL2lzc3Vlcy8xNTg5XG4gICAgY29uc3QgeGNvZGVkQXR0YWNobWVudCA9IHtcbiAgICAgIC8vIGBkaWdlc3RgIGlzIG5vIGxvbmdlciB2YWxpZCBmb3IgYXV0by1vcmllbnRlZCBpbWFnZSBkYXRhLCBzbyB3ZSBkaXNjYXJkIGl0OlxuICAgICAgLi4ub21pdChhdHRhY2htZW50LCAnZGlnZXN0JyksXG4gICAgICBkYXRhOiBuZXcgVWludDhBcnJheSh4Y29kZWREYXRhQXJyYXlCdWZmZXIpLFxuICAgICAgc2l6ZTogeGNvZGVkRGF0YUFycmF5QnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgfTtcblxuICAgIHJldHVybiB4Y29kZWRBdHRhY2htZW50O1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnN0IGVycm9yU3RyaW5nID1cbiAgICAgIGlzUmVjb3JkKGVycm9yKSAmJiAnc3RhY2snIGluIGVycm9yID8gZXJyb3Iuc3RhY2sgOiBlcnJvcjtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnYXV0b09yaWVudEpQRUc6IEZhaWxlZCB0byByb3RhdGUvc2NhbGUgYXR0YWNobWVudCcsXG4gICAgICBlcnJvclN0cmluZ1xuICAgICk7XG5cbiAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgfVxufVxuXG5jb25zdCBVTklDT0RFX0xFRlRfVE9fUklHSFRfT1ZFUlJJREUgPSAnXFx1MjAyRCc7XG5jb25zdCBVTklDT0RFX1JJR0hUX1RPX0xFRlRfT1ZFUlJJREUgPSAnXFx1MjAyRSc7XG5jb25zdCBVTklDT0RFX1JFUExBQ0VNRU5UX0NIQVJBQ1RFUiA9ICdcXHVGRkZEJztcbmNvbnN0IElOVkFMSURfQ0hBUkFDVEVSU19QQVRURVJOID0gbmV3IFJlZ0V4cChcbiAgYFske1VOSUNPREVfTEVGVF9UT19SSUdIVF9PVkVSUklERX0ke1VOSUNPREVfUklHSFRfVE9fTEVGVF9PVkVSUklERX1dYCxcbiAgJ2cnXG4pO1xuXG4vLyBOT1RFOiBFeHBvc2Ugc3luY2hyb25vdXMgdmVyc2lvbiB0byBkbyBwcm9wZXJ0eS1iYXNlZCB0ZXN0aW5nIHVzaW5nIGB0ZXN0Y2hlY2tgLFxuLy8gd2hpY2ggY3VycmVudGx5IGRvZXNuXHUyMDE5dCBzdXBwb3J0IGFzeW5jIHRlc3Rpbmc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbGVlYnlyb24vdGVzdGNoZWNrLWpzL2lzc3Vlcy80NVxuZXhwb3J0IGZ1bmN0aW9uIF9yZXBsYWNlVW5pY29kZU9yZGVyT3ZlcnJpZGVzU3luYyhcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGVcbik6IEF0dGFjaG1lbnRUeXBlIHtcbiAgaWYgKCFpcy5zdHJpbmcoYXR0YWNobWVudC5maWxlTmFtZSkpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgfVxuXG4gIGNvbnN0IG5vcm1hbGl6ZWRGaWxlbmFtZSA9IGF0dGFjaG1lbnQuZmlsZU5hbWUucmVwbGFjZShcbiAgICBJTlZBTElEX0NIQVJBQ1RFUlNfUEFUVEVSTixcbiAgICBVTklDT0RFX1JFUExBQ0VNRU5UX0NIQVJBQ1RFUlxuICApO1xuICBjb25zdCBuZXdBdHRhY2htZW50ID0geyAuLi5hdHRhY2htZW50LCBmaWxlTmFtZTogbm9ybWFsaXplZEZpbGVuYW1lIH07XG5cbiAgcmV0dXJuIG5ld0F0dGFjaG1lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCByZXBsYWNlVW5pY29kZU9yZGVyT3ZlcnJpZGVzID0gYXN5bmMgKFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZVxuKTogUHJvbWlzZTxBdHRhY2htZW50VHlwZT4gPT4ge1xuICByZXR1cm4gX3JlcGxhY2VVbmljb2RlT3JkZXJPdmVycmlkZXNTeW5jKGF0dGFjaG1lbnQpO1xufTtcblxuLy8gXFx1MjAyQS1cXHUyMDJFIGlzIExSRSwgUkxFLCBQREYsIExSTywgUkxPXG4vLyBcXHUyMDY2LVxcdTIwNjkgaXMgTFJJLCBSTEksIEZTSSwgUERJXG4vLyBcXHUyMDBFIGlzIExSTVxuLy8gXFx1MjAwRiBpcyBSTE1cbi8vIFxcdTA2MUMgaXMgQUxNXG5jb25zdCBWMl9VTldBTlRFRF9VTklDT0RFID0gL1tcXHUyMDJBLVxcdTIwMkVcXHUyMDY2LVxcdTIwNjlcXHUyMDBFXFx1MjAwRlxcdTA2MUNdL2c7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXBsYWNlVW5pY29kZVYyKFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZVxuKTogUHJvbWlzZTxBdHRhY2htZW50VHlwZT4ge1xuICBpZiAoIWlzLnN0cmluZyhhdHRhY2htZW50LmZpbGVOYW1lKSkge1xuICAgIHJldHVybiBhdHRhY2htZW50O1xuICB9XG5cbiAgY29uc3QgZmlsZU5hbWUgPSBhdHRhY2htZW50LmZpbGVOYW1lLnJlcGxhY2UoXG4gICAgVjJfVU5XQU5URURfVU5JQ09ERSxcbiAgICBVTklDT0RFX1JFUExBQ0VNRU5UX0NIQVJBQ1RFUlxuICApO1xuXG4gIHJldHVybiB7XG4gICAgLi4uYXR0YWNobWVudCxcbiAgICBmaWxlTmFtZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNjaGVtYVZlcnNpb24oe1xuICBhdHRhY2htZW50LFxuICBsb2dnZXIsXG59OiB7XG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICBsb2dnZXI6IExvZ2dlclR5cGU7XG59KTogQXR0YWNobWVudFR5cGUge1xuICBpZiAoIWlzVmFsaWQoYXR0YWNobWVudCkpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnQXR0YWNobWVudC5yZW1vdmVTY2hlbWFWZXJzaW9uOiBJbnZhbGlkIGlucHV0IGF0dGFjaG1lbnQ6JyxcbiAgICAgIGF0dGFjaG1lbnRcbiAgICApO1xuICAgIHJldHVybiBhdHRhY2htZW50O1xuICB9XG5cbiAgcmV0dXJuIG9taXQoYXR0YWNobWVudCwgJ3NjaGVtYVZlcnNpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0RhdGEoYXR0YWNobWVudDogQXR0YWNobWVudFR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIGF0dGFjaG1lbnQuZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRGF0YShcbiAgcmVhZEF0dGFjaG1lbnREYXRhOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPFVpbnQ4QXJyYXk+XG4pOiAoXG4gIGF0dGFjaG1lbnQ6IFBpY2s8QXR0YWNobWVudFR5cGUsICdkYXRhJyB8ICdwYXRoJz5cbikgPT4gUHJvbWlzZTxBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YT4ge1xuICBpZiAoIWlzLmZ1bmN0aW9uXyhyZWFkQXR0YWNobWVudERhdGEpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidyZWFkQXR0YWNobWVudERhdGEnIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHJldHVybiBhc3luYyBhdHRhY2htZW50ID0+IHtcbiAgICBpZiAoIWlzVmFsaWQoYXR0YWNobWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInYXR0YWNobWVudCcgaXMgbm90IHZhbGlkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzQWxyZWFkeUxvYWRlZCA9IEJvb2xlYW4oYXR0YWNobWVudC5kYXRhKTtcbiAgICBpZiAoaXNBbHJlYWR5TG9hZGVkKSB7XG4gICAgICByZXR1cm4gYXR0YWNobWVudCBhcyBBdHRhY2htZW50V2l0aEh5ZHJhdGVkRGF0YTtcbiAgICB9XG5cbiAgICBpZiAoIWlzLnN0cmluZyhhdHRhY2htZW50LnBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ2F0dGFjaG1lbnQucGF0aCcgaXMgcmVxdWlyZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlYWRBdHRhY2htZW50RGF0YShhdHRhY2htZW50LnBhdGgpO1xuICAgIHJldHVybiB7IC4uLmF0dGFjaG1lbnQsIGRhdGEsIHNpemU6IGRhdGEuYnl0ZUxlbmd0aCB9O1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRGF0YShcbiAgZGVsZXRlT25EaXNrOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+XG4pOiAoYXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlKSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCFpcy5mdW5jdGlvbl8oZGVsZXRlT25EaXNrKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RlbGV0ZURhdGE6IGRlbGV0ZU9uRGlzayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHJldHVybiBhc3luYyAoYXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkKGF0dGFjaG1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdkZWxldGVEYXRhOiBhdHRhY2htZW50IGlzIG5vdCB2YWxpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcGF0aCwgdGh1bWJuYWlsLCBzY3JlZW5zaG90IH0gPSBhdHRhY2htZW50O1xuICAgIGlmIChpcy5zdHJpbmcocGF0aCkpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayhwYXRoKTtcbiAgICB9XG5cbiAgICBpZiAodGh1bWJuYWlsICYmIGlzLnN0cmluZyh0aHVtYm5haWwucGF0aCkpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayh0aHVtYm5haWwucGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKHNjcmVlbnNob3QgJiYgaXMuc3RyaW5nKHNjcmVlbnNob3QucGF0aCkpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayhzY3JlZW5zaG90LnBhdGgpO1xuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgVEhVTUJOQUlMX1NJWkUgPSAxNTA7XG5jb25zdCBUSFVNQk5BSUxfQ09OVEVOVF9UWVBFID0gTUlNRS5JTUFHRV9QTkc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYXB0dXJlRGltZW5zaW9uc0FuZFNjcmVlbnNob3QoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICBwYXJhbXM6IHtcbiAgICB3cml0ZU5ld0F0dGFjaG1lbnREYXRhOiAoZGF0YTogVWludDhBcnJheSkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICAgIGdldEFic29sdXRlQXR0YWNobWVudFBhdGg6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZztcbiAgICBtYWtlT2JqZWN0VXJsOiAoXG4gICAgICBkYXRhOiBVaW50OEFycmF5IHwgQXJyYXlCdWZmZXIsXG4gICAgICBjb250ZW50VHlwZTogTUlNRS5NSU1FVHlwZVxuICAgICkgPT4gc3RyaW5nO1xuICAgIHJldm9rZU9iamVjdFVybDogKHBhdGg6IHN0cmluZykgPT4gdm9pZDtcbiAgICBnZXRJbWFnZURpbWVuc2lvbnM6IChwYXJhbXM6IHtcbiAgICAgIG9iamVjdFVybDogc3RyaW5nO1xuICAgICAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xuICAgIH0pID0+IFByb21pc2U8e1xuICAgICAgd2lkdGg6IG51bWJlcjtcbiAgICAgIGhlaWdodDogbnVtYmVyO1xuICAgIH0+O1xuICAgIG1ha2VJbWFnZVRodW1ibmFpbDogKHBhcmFtczoge1xuICAgICAgc2l6ZTogbnVtYmVyO1xuICAgICAgb2JqZWN0VXJsOiBzdHJpbmc7XG4gICAgICBjb250ZW50VHlwZTogTUlNRS5NSU1FVHlwZTtcbiAgICAgIGxvZ2dlcjogTG9nZ2VyVHlwZTtcbiAgICB9KSA9PiBQcm9taXNlPEJsb2I+O1xuICAgIG1ha2VWaWRlb1NjcmVlbnNob3Q6IChwYXJhbXM6IHtcbiAgICAgIG9iamVjdFVybDogc3RyaW5nO1xuICAgICAgY29udGVudFR5cGU6IE1JTUUuTUlNRVR5cGU7XG4gICAgICBsb2dnZXI6IExvZ2dlclR5cGU7XG4gICAgfSkgPT4gUHJvbWlzZTxCbG9iPjtcbiAgICBsb2dnZXI6IExvZ2dlclR5cGU7XG4gIH1cbik6IFByb21pc2U8QXR0YWNobWVudFR5cGU+IHtcbiAgY29uc3QgeyBjb250ZW50VHlwZSB9ID0gYXR0YWNobWVudDtcblxuICBjb25zdCB7XG4gICAgd3JpdGVOZXdBdHRhY2htZW50RGF0YSxcbiAgICBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoLFxuICAgIG1ha2VPYmplY3RVcmwsXG4gICAgcmV2b2tlT2JqZWN0VXJsLFxuICAgIGdldEltYWdlRGltZW5zaW9uczogZ2V0SW1hZ2VEaW1lbnNpb25zRnJvbVVSTCxcbiAgICBtYWtlSW1hZ2VUaHVtYm5haWwsXG4gICAgbWFrZVZpZGVvU2NyZWVuc2hvdCxcbiAgICBsb2dnZXIsXG4gIH0gPSBwYXJhbXM7XG5cbiAgaWYgKFxuICAgICFHb29nbGVDaHJvbWUuaXNJbWFnZVR5cGVTdXBwb3J0ZWQoY29udGVudFR5cGUpICYmXG4gICAgIUdvb2dsZUNocm9tZS5pc1ZpZGVvVHlwZVN1cHBvcnRlZChjb250ZW50VHlwZSlcbiAgKSB7XG4gICAgcmV0dXJuIGF0dGFjaG1lbnQ7XG4gIH1cblxuICAvLyBJZiB0aGUgYXR0YWNobWVudCBoYXNuJ3QgYmVlbiBkb3dubG9hZGVkIHlldCwgd2Ugd29uJ3QgaGF2ZSBhIHBhdGhcbiAgaWYgKCFhdHRhY2htZW50LnBhdGgpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgfVxuXG4gIGNvbnN0IGFic29sdXRlUGF0aCA9IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgoYXR0YWNobWVudC5wYXRoKTtcblxuICBpZiAoR29vZ2xlQ2hyb21lLmlzSW1hZ2VUeXBlU3VwcG9ydGVkKGNvbnRlbnRUeXBlKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGF3YWl0IGdldEltYWdlRGltZW5zaW9uc0Zyb21VUkwoe1xuICAgICAgICBvYmplY3RVcmw6IGFic29sdXRlUGF0aCxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0aHVtYm5haWxCdWZmZXIgPSBhd2FpdCBibG9iVG9BcnJheUJ1ZmZlcihcbiAgICAgICAgYXdhaXQgbWFrZUltYWdlVGh1bWJuYWlsKHtcbiAgICAgICAgICBzaXplOiBUSFVNQk5BSUxfU0laRSxcbiAgICAgICAgICBvYmplY3RVcmw6IGFic29sdXRlUGF0aCxcbiAgICAgICAgICBjb250ZW50VHlwZTogVEhVTUJOQUlMX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgICBsb2dnZXIsXG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBjb25zdCB0aHVtYm5haWxQYXRoID0gYXdhaXQgd3JpdGVOZXdBdHRhY2htZW50RGF0YShcbiAgICAgICAgbmV3IFVpbnQ4QXJyYXkodGh1bWJuYWlsQnVmZmVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmF0dGFjaG1lbnQsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHRodW1ibmFpbDoge1xuICAgICAgICAgIHBhdGg6IHRodW1ibmFpbFBhdGgsXG4gICAgICAgICAgY29udGVudFR5cGU6IFRIVU1CTkFJTF9DT05URU5UX1RZUEUsXG4gICAgICAgICAgd2lkdGg6IFRIVU1CTkFJTF9TSVpFLFxuICAgICAgICAgIGhlaWdodDogVEhVTUJOQUlMX1NJWkUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICdjYXB0dXJlRGltZW5zaW9uc0FuZFNjcmVlbnNob3Q6JyxcbiAgICAgICAgJ2Vycm9yIHByb2Nlc3NpbmcgaW1hZ2U7IHNraXBwaW5nIHNjcmVlbnNob3QgZ2VuZXJhdGlvbicsXG4gICAgICAgIHRvTG9nRm9ybWF0KGVycm9yKVxuICAgICAgKTtcbiAgICAgIHJldHVybiBhdHRhY2htZW50O1xuICAgIH1cbiAgfVxuXG4gIGxldCBzY3JlZW5zaG90T2JqZWN0VXJsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IGJsb2JUb0FycmF5QnVmZmVyKFxuICAgICAgYXdhaXQgbWFrZVZpZGVvU2NyZWVuc2hvdCh7XG4gICAgICAgIG9iamVjdFVybDogYWJzb2x1dGVQYXRoLFxuICAgICAgICBjb250ZW50VHlwZTogVEhVTUJOQUlMX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgfSlcbiAgICApO1xuICAgIHNjcmVlbnNob3RPYmplY3RVcmwgPSBtYWtlT2JqZWN0VXJsKFxuICAgICAgc2NyZWVuc2hvdEJ1ZmZlcixcbiAgICAgIFRIVU1CTkFJTF9DT05URU5UX1RZUEVcbiAgICApO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYXdhaXQgZ2V0SW1hZ2VEaW1lbnNpb25zRnJvbVVSTCh7XG4gICAgICBvYmplY3RVcmw6IHNjcmVlbnNob3RPYmplY3RVcmwsXG4gICAgICBsb2dnZXIsXG4gICAgfSk7XG4gICAgY29uc3Qgc2NyZWVuc2hvdFBhdGggPSBhd2FpdCB3cml0ZU5ld0F0dGFjaG1lbnREYXRhKFxuICAgICAgbmV3IFVpbnQ4QXJyYXkoc2NyZWVuc2hvdEJ1ZmZlcilcbiAgICApO1xuXG4gICAgY29uc3QgdGh1bWJuYWlsQnVmZmVyID0gYXdhaXQgYmxvYlRvQXJyYXlCdWZmZXIoXG4gICAgICBhd2FpdCBtYWtlSW1hZ2VUaHVtYm5haWwoe1xuICAgICAgICBzaXplOiBUSFVNQk5BSUxfU0laRSxcbiAgICAgICAgb2JqZWN0VXJsOiBzY3JlZW5zaG90T2JqZWN0VXJsLFxuICAgICAgICBjb250ZW50VHlwZTogVEhVTUJOQUlMX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgY29uc3QgdGh1bWJuYWlsUGF0aCA9IGF3YWl0IHdyaXRlTmV3QXR0YWNobWVudERhdGEoXG4gICAgICBuZXcgVWludDhBcnJheSh0aHVtYm5haWxCdWZmZXIpXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5hdHRhY2htZW50LFxuICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICBjb250ZW50VHlwZTogVEhVTUJOQUlMX0NPTlRFTlRfVFlQRSxcbiAgICAgICAgcGF0aDogc2NyZWVuc2hvdFBhdGgsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICB9LFxuICAgICAgdGh1bWJuYWlsOiB7XG4gICAgICAgIHBhdGg6IHRodW1ibmFpbFBhdGgsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBUSFVNQk5BSUxfQ09OVEVOVF9UWVBFLFxuICAgICAgICB3aWR0aDogVEhVTUJOQUlMX1NJWkUsXG4gICAgICAgIGhlaWdodDogVEhVTUJOQUlMX1NJWkUsXG4gICAgICB9LFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnY2FwdHVyZURpbWVuc2lvbnNBbmRTY3JlZW5zaG90OiBlcnJvciBwcm9jZXNzaW5nIHZpZGVvOyBza2lwcGluZyBzY3JlZW5zaG90IGdlbmVyYXRpb24nLFxuICAgICAgdG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgKTtcbiAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoc2NyZWVuc2hvdE9iamVjdFVybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXZva2VPYmplY3RVcmwoc2NyZWVuc2hvdE9iamVjdFVybCk7XG4gICAgfVxuICB9XG59XG5cbi8vIFVJLWZvY3VzZWQgZnVuY3Rpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb25Gb3JEaXNwbGF5KHtcbiAgZmlsZU5hbWUsXG4gIGNvbnRlbnRUeXBlLFxufToge1xuICBmaWxlTmFtZT86IHN0cmluZztcbiAgY29udGVudFR5cGU6IE1JTUUuTUlNRVR5cGU7XG59KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGZpbGVOYW1lICYmIGZpbGVOYW1lLmluZGV4T2YoJy4nKSA+PSAwKSB7XG4gICAgY29uc3QgbGFzdFBlcmlvZCA9IGZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gZmlsZU5hbWUuc2xpY2UobGFzdFBlcmlvZCArIDEpO1xuICAgIGlmIChleHRlbnNpb24ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZXh0ZW5zaW9uO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGVudFR5cGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3Qgc2xhc2ggPSBjb250ZW50VHlwZS5pbmRleE9mKCcvJyk7XG4gIGlmIChzbGFzaCA+PSAwKSB7XG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlLnNsaWNlKHNsYXNoICsgMSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBdWRpbyhhdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+KTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKFxuICAgIGF0dGFjaG1lbnRzICYmXG4gICAgICBhdHRhY2htZW50c1swXSAmJlxuICAgICAgYXR0YWNobWVudHNbMF0uY29udGVudFR5cGUgJiZcbiAgICAgICFhdHRhY2htZW50c1swXS5pc0NvcnJ1cHRlZCAmJlxuICAgICAgTUlNRS5pc0F1ZGlvKGF0dGFjaG1lbnRzWzBdLmNvbnRlbnRUeXBlKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuRGlzcGxheUltYWdlKFxuICBhdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+XG4pOiBib29sZWFuIHtcbiAgY29uc3QgeyBoZWlnaHQsIHdpZHRoIH0gPVxuICAgIGF0dGFjaG1lbnRzICYmIGF0dGFjaG1lbnRzWzBdID8gYXR0YWNobWVudHNbMF0gOiB7IGhlaWdodDogMCwgd2lkdGg6IDAgfTtcblxuICByZXR1cm4gQm9vbGVhbihcbiAgICBoZWlnaHQgJiZcbiAgICAgIGhlaWdodCA+IDAgJiZcbiAgICAgIGhlaWdodCA8PSA0MDk2ICYmXG4gICAgICB3aWR0aCAmJlxuICAgICAgd2lkdGggPiAwICYmXG4gICAgICB3aWR0aCA8PSA0MDk2XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaHVtYm5haWxVcmwoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoYXR0YWNobWVudC50aHVtYm5haWwpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudC50aHVtYm5haWwudXJsO1xuICB9XG5cbiAgcmV0dXJuIGdldFVybChhdHRhY2htZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybChhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmIChhdHRhY2htZW50LnNjcmVlbnNob3QpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudC5zY3JlZW5zaG90LnVybDtcbiAgfVxuXG4gIGlmIChpc1ZpZGVvQXR0YWNobWVudChhdHRhY2htZW50KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gYXR0YWNobWVudC51cmw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ltYWdlKGF0dGFjaG1lbnRzPzogUmVhZG9ubHlBcnJheTxBdHRhY2htZW50VHlwZT4pOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgYXR0YWNobWVudHMgJiZcbiAgICAgIGF0dGFjaG1lbnRzWzBdICYmXG4gICAgICBhdHRhY2htZW50c1swXS5jb250ZW50VHlwZSAmJlxuICAgICAgaXNJbWFnZVR5cGVTdXBwb3J0ZWQoYXR0YWNobWVudHNbMF0uY29udGVudFR5cGUpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ltYWdlQXR0YWNobWVudChcbiAgYXR0YWNobWVudD86IFBpY2s8QXR0YWNobWVudFR5cGUsICdjb250ZW50VHlwZSc+XG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgYXR0YWNobWVudCAmJlxuICAgICAgYXR0YWNobWVudC5jb250ZW50VHlwZSAmJlxuICAgICAgaXNJbWFnZVR5cGVTdXBwb3J0ZWQoYXR0YWNobWVudC5jb250ZW50VHlwZSlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbkJlVHJhbnNjb2RlZChcbiAgYXR0YWNobWVudD86IFBpY2s8QXR0YWNobWVudFR5cGUsICdjb250ZW50VHlwZSc+XG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgYXR0YWNobWVudCAmJlxuICAgICAgaXNJbWFnZUF0dGFjaG1lbnQoYXR0YWNobWVudCkgJiZcbiAgICAgICFNSU1FLmlzR2lmKGF0dGFjaG1lbnQuY29udGVudFR5cGUpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbWFnZShhdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+KTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKFxuICAgIGF0dGFjaG1lbnRzICYmXG4gICAgICBhdHRhY2htZW50c1swXSAmJlxuICAgICAgKGF0dGFjaG1lbnRzWzBdLnVybCB8fCBhdHRhY2htZW50c1swXS5wZW5kaW5nIHx8IGF0dGFjaG1lbnRzWzBdLmJsdXJIYXNoKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWaWRlbyhhdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+KTogYm9vbGVhbiB7XG4gIGlmICghYXR0YWNobWVudHMgfHwgYXR0YWNobWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBpc1ZpZGVvQXR0YWNobWVudChhdHRhY2htZW50c1swXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZpZGVvQXR0YWNobWVudChhdHRhY2htZW50PzogQXR0YWNobWVudFR5cGUpOiBib29sZWFuIHtcbiAgaWYgKCFhdHRhY2htZW50IHx8ICFhdHRhY2htZW50LmNvbnRlbnRUeXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBpc1ZpZGVvVHlwZVN1cHBvcnRlZChhdHRhY2htZW50LmNvbnRlbnRUeXBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR0lGKGF0dGFjaG1lbnRzPzogUmVhZG9ubHlBcnJheTxBdHRhY2htZW50VHlwZT4pOiBib29sZWFuIHtcbiAgaWYgKCFhdHRhY2htZW50cyB8fCBhdHRhY2htZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBbYXR0YWNobWVudF0gPSBhdHRhY2htZW50cztcblxuICBjb25zdCBmbGFnID0gU2lnbmFsU2VydmljZS5BdHRhY2htZW50UG9pbnRlci5GbGFncy5HSUY7XG4gIGNvbnN0IGhhc0ZsYWcgPVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgIWlzLnVuZGVmaW5lZChhdHRhY2htZW50LmZsYWdzKSAmJiAoYXR0YWNobWVudC5mbGFncyAmIGZsYWcpID09PSBmbGFnO1xuXG4gIHJldHVybiBoYXNGbGFnICYmIGlzVmlkZW9BdHRhY2htZW50KGF0dGFjaG1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEb3dubG9hZGVkKGF0dGFjaG1lbnQ/OiBBdHRhY2htZW50VHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gQm9vbGVhbihhdHRhY2htZW50ICYmIChhdHRhY2htZW50LnBhdGggfHwgYXR0YWNobWVudC50ZXh0QXR0YWNobWVudCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzTm90UmVzb2x2ZWQoYXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKGF0dGFjaG1lbnQgJiYgIWF0dGFjaG1lbnQudXJsICYmICFhdHRhY2htZW50LnRleHRBdHRhY2htZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRG93bmxvYWRpbmcoYXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKGF0dGFjaG1lbnQgJiYgYXR0YWNobWVudC5kb3dubG9hZEpvYklkICYmIGF0dGFjaG1lbnQucGVuZGluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNGYWlsZWQoYXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKGF0dGFjaG1lbnQgJiYgYXR0YWNobWVudC5lcnJvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNWaWRlb0JsdXJIYXNoKGF0dGFjaG1lbnRzPzogQXJyYXk8QXR0YWNobWVudFR5cGU+KTogYm9vbGVhbiB7XG4gIGNvbnN0IGZpcnN0QXR0YWNobWVudCA9IGF0dGFjaG1lbnRzID8gYXR0YWNobWVudHNbMF0gOiBudWxsO1xuXG4gIHJldHVybiBCb29sZWFuKGZpcnN0QXR0YWNobWVudCAmJiBmaXJzdEF0dGFjaG1lbnQuYmx1ckhhc2gpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzVmlkZW9TY3JlZW5zaG90KFxuICBhdHRhY2htZW50cz86IEFycmF5PEF0dGFjaG1lbnRUeXBlPlxuKTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGZpcnN0QXR0YWNobWVudCA9IGF0dGFjaG1lbnRzID8gYXR0YWNobWVudHNbMF0gOiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgZmlyc3RBdHRhY2htZW50ICYmXG4gICAgZmlyc3RBdHRhY2htZW50LnNjcmVlbnNob3QgJiZcbiAgICBmaXJzdEF0dGFjaG1lbnQuc2NyZWVuc2hvdC51cmxcbiAgKTtcbn1cblxudHlwZSBEaW1lbnNpb25zVHlwZSA9IHtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1hZ2VEaW1lbnNpb25zKFxuICBhdHRhY2htZW50OiBQaWNrPEF0dGFjaG1lbnRUeXBlLCAnd2lkdGgnIHwgJ2hlaWdodCc+LFxuICBmb3JjZWRXaWR0aD86IG51bWJlclxuKTogRGltZW5zaW9uc1R5cGUge1xuICBjb25zdCB7IGhlaWdodCwgd2lkdGggfSA9IGF0dGFjaG1lbnQ7XG4gIGlmICghaGVpZ2h0IHx8ICF3aWR0aCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IE1JTl9IRUlHSFQsXG4gICAgICB3aWR0aDogTUlOX1dJRFRILFxuICAgIH07XG4gIH1cblxuICBjb25zdCBhc3BlY3RSYXRpbyA9IGhlaWdodCAvIHdpZHRoO1xuICBjb25zdCB0YXJnZXRXaWR0aCA9XG4gICAgZm9yY2VkV2lkdGggfHwgTWF0aC5tYXgoTWF0aC5taW4oTUFYX1dJRFRILCB3aWR0aCksIE1JTl9XSURUSCk7XG4gIGNvbnN0IGNhbmRpZGF0ZUhlaWdodCA9IE1hdGgucm91bmQodGFyZ2V0V2lkdGggKiBhc3BlY3RSYXRpbyk7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogdGFyZ2V0V2lkdGgsXG4gICAgaGVpZ2h0OiBNYXRoLm1heChNYXRoLm1pbihNQVhfSEVJR0hULCBjYW5kaWRhdGVIZWlnaHQpLCBNSU5fSEVJR0hUKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZUFsbEF0dGFjaG1lbnRzVmlzdWFsKFxuICBhdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+XG4pOiBib29sZWFuIHtcbiAgaWYgKCFhdHRhY2htZW50cykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG1heCA9IGF0dGFjaG1lbnRzLmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBhdHRhY2htZW50c1tpXTtcbiAgICBpZiAoIWlzSW1hZ2VBdHRhY2htZW50KGF0dGFjaG1lbnQpICYmICFpc1ZpZGVvQXR0YWNobWVudChhdHRhY2htZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JpZERpbWVuc2lvbnMoXG4gIGF0dGFjaG1lbnRzPzogUmVhZG9ubHlBcnJheTxBdHRhY2htZW50VHlwZT5cbik6IG51bGwgfCBEaW1lbnNpb25zVHlwZSB7XG4gIGlmICghYXR0YWNobWVudHMgfHwgIWF0dGFjaG1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFpc0ltYWdlKGF0dGFjaG1lbnRzKSAmJiAhaXNWaWRlbyhhdHRhY2htZW50cykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZ2V0SW1hZ2VEaW1lbnNpb25zKGF0dGFjaG1lbnRzWzBdKTtcbiAgfVxuXG4gIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAvLyBBIEJcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAxNTAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgIH07XG4gIH1cblxuICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgLy8gQSBBIEJcbiAgICAvLyBBIEEgQ1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT09IDQpIHtcbiAgICAvLyBBIEJcbiAgICAvLyBDIERcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgIH07XG4gIH1cblxuICAvLyBBIEEgQSBCIEIgQlxuICAvLyBBIEEgQSBCIEIgQlxuICAvLyBBIEEgQSBCIEIgQlxuICAvLyBDIEMgRCBEIEUgRVxuICAvLyBDIEMgRCBEIEUgRVxuICByZXR1cm4ge1xuICAgIGhlaWdodDogMjUwLFxuICAgIHdpZHRoOiAzMDAsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbHQoXG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICBpMThuOiBMb2NhbGl6ZXJUeXBlXG4pOiBzdHJpbmcge1xuICBpZiAoaXNWaWRlb0F0dGFjaG1lbnQoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm4gaTE4bigndmlkZW9BdHRhY2htZW50QWx0Jyk7XG4gIH1cbiAgcmV0dXJuIGkxOG4oJ2ltYWdlQXR0YWNobWVudEFsdCcpO1xufVxuXG4vLyBNaWdyYXRpb24tcmVsYXRlZCBhdHRhY2htZW50IHN0dWZmXG5cbmV4cG9ydCBjb25zdCBpc1Zpc3VhbE1lZGlhID0gKGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlKTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IHsgY29udGVudFR5cGUgfSA9IGF0dGFjaG1lbnQ7XG5cbiAgaWYgKGlzLnVuZGVmaW5lZChjb250ZW50VHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNWb2ljZU1lc3NhZ2UoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gTUlNRS5pc0ltYWdlKGNvbnRlbnRUeXBlKSB8fCBNSU1FLmlzVmlkZW8oY29udGVudFR5cGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IChhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCB7IGNvbnRlbnRUeXBlIH0gPSBhdHRhY2htZW50O1xuXG4gIGlmIChpcy51bmRlZmluZWQoY29udGVudFR5cGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzVmlzdWFsTWVkaWEoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNWb2ljZU1lc3NhZ2UoYXR0YWNobWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1ZvaWNlTWVzc2FnZSA9IChhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCBmbGFnID0gU2lnbmFsU2VydmljZS5BdHRhY2htZW50UG9pbnRlci5GbGFncy5WT0lDRV9NRVNTQUdFO1xuICBjb25zdCBoYXNGbGFnID1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgICFpcy51bmRlZmluZWQoYXR0YWNobWVudC5mbGFncykgJiYgKGF0dGFjaG1lbnQuZmxhZ3MgJiBmbGFnKSA9PT0gZmxhZztcbiAgaWYgKGhhc0ZsYWcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGlzTGVnYWN5QW5kcm9pZFZvaWNlTWVzc2FnZSA9XG4gICAgIWlzLnVuZGVmaW5lZChhdHRhY2htZW50LmNvbnRlbnRUeXBlKSAmJlxuICAgIE1JTUUuaXNBdWRpbyhhdHRhY2htZW50LmNvbnRlbnRUeXBlKSAmJlxuICAgICFhdHRhY2htZW50LmZpbGVOYW1lO1xuICBpZiAoaXNMZWdhY3lBbmRyb2lkVm9pY2VNZXNzYWdlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZSA9IGFzeW5jICh7XG4gIGF0dGFjaG1lbnQsXG4gIGluZGV4LFxuICByZWFkQXR0YWNobWVudERhdGEsXG4gIHNhdmVBdHRhY2htZW50VG9EaXNrLFxuICB0aW1lc3RhbXAsXG59OiB7XG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICBpbmRleD86IG51bWJlcjtcbiAgcmVhZEF0dGFjaG1lbnREYXRhOiAocmVsYXRpdmVQYXRoOiBzdHJpbmcpID0+IFByb21pc2U8VWludDhBcnJheT47XG4gIHNhdmVBdHRhY2htZW50VG9EaXNrOiAob3B0aW9uczoge1xuICAgIGRhdGE6IFVpbnQ4QXJyYXk7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9KSA9PiBQcm9taXNlPHsgbmFtZTogc3RyaW5nOyBmdWxsUGF0aDogc3RyaW5nIH0gfCBudWxsPjtcbiAgdGltZXN0YW1wPzogbnVtYmVyO1xufSk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT4ge1xuICBsZXQgZGF0YTogVWludDhBcnJheTtcbiAgaWYgKGF0dGFjaG1lbnQucGF0aCkge1xuICAgIGRhdGEgPSBhd2FpdCByZWFkQXR0YWNobWVudERhdGEoYXR0YWNobWVudC5wYXRoKTtcbiAgfSBlbHNlIGlmIChhdHRhY2htZW50LmRhdGEpIHtcbiAgICBkYXRhID0gYXR0YWNobWVudC5kYXRhO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQXR0YWNobWVudCBoYWQgbmVpdGhlciBwYXRoIG5vciBkYXRhJyk7XG4gIH1cblxuICBjb25zdCBuYW1lID0gZ2V0U3VnZ2VzdGVkRmlsZW5hbWUoeyBhdHRhY2htZW50LCB0aW1lc3RhbXAsIGluZGV4IH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNhdmVBdHRhY2htZW50VG9EaXNrKHtcbiAgICBkYXRhLFxuICAgIG5hbWUsXG4gIH0pO1xuXG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmZ1bGxQYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFN1Z2dlc3RlZEZpbGVuYW1lID0gKHtcbiAgYXR0YWNobWVudCxcbiAgdGltZXN0YW1wLFxuICBpbmRleCxcbn06IHtcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGU7XG4gIHRpbWVzdGFtcD86IG51bWJlciB8IERhdGU7XG4gIGluZGV4PzogbnVtYmVyO1xufSk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgZmlsZU5hbWUgfSA9IGF0dGFjaG1lbnQ7XG4gIGlmIChmaWxlTmFtZSAmJiAoIWlzTnVtYmVyKGluZGV4KSB8fCBpbmRleCA9PT0gMSkpIHtcbiAgICByZXR1cm4gZmlsZU5hbWU7XG4gIH1cblxuICBjb25zdCBwcmVmaXggPSAnc2lnbmFsJztcbiAgY29uc3Qgc3VmZml4ID0gdGltZXN0YW1wXG4gICAgPyBtb21lbnQodGltZXN0YW1wKS5mb3JtYXQoJy1ZWVlZLU1NLURELUhIbW1zcycpXG4gICAgOiAnJztcbiAgY29uc3QgZmlsZVR5cGUgPSBnZXRGaWxlRXh0ZW5zaW9uKGF0dGFjaG1lbnQpO1xuICBjb25zdCBleHRlbnNpb24gPSBmaWxlVHlwZSA/IGAuJHtmaWxlVHlwZX1gIDogJyc7XG4gIGNvbnN0IGluZGV4U3VmZml4ID1cbiAgICBpc051bWJlcihpbmRleCkgJiYgaW5kZXggPiAxXG4gICAgICA/IGBfJHtwYWRTdGFydChpbmRleC50b1N0cmluZygpLCAzLCAnMCcpfWBcbiAgICAgIDogJyc7XG5cbiAgcmV0dXJuIGAke3ByZWZpeH0ke3N1ZmZpeH0ke2luZGV4U3VmZml4fSR7ZXh0ZW5zaW9ufWA7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmlsZUV4dGVuc2lvbiA9IChcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGVcbik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghYXR0YWNobWVudC5jb250ZW50VHlwZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBzd2l0Y2ggKGF0dGFjaG1lbnQuY29udGVudFR5cGUpIHtcbiAgICBjYXNlICd2aWRlby9xdWlja3RpbWUnOlxuICAgICAgcmV0dXJuICdtb3YnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYXR0YWNobWVudC5jb250ZW50VHlwZS5zcGxpdCgnLycpWzFdO1xuICB9XG59O1xuXG5jb25zdCBNRUJJQllURSA9IDEwMjQgKiAxMDI0O1xuY29uc3QgREVGQVVMVF9NQVggPSAxMDAgKiBNRUJJQllURTtcblxuZXhwb3J0IGNvbnN0IGdldE1heGltdW1BdHRhY2htZW50U2l6ZSA9ICgpOiBudW1iZXIgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBwYXJzZUludE9yVGhyb3coXG4gICAgICBnZXRWYWx1ZSgnZ2xvYmFsLmF0dGFjaG1lbnRzLm1heEJ5dGVzJyksXG4gICAgICAncHJlUHJvY2Vzc0F0dGFjaG1lbnQvbWF4QXR0YWNobWVudFNpemUnXG4gICAgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cud2FybihcbiAgICAgICdGYWlsZWQgdG8gcGFyc2UgaW50ZWdlciBvdXQgb2YgZ2xvYmFsLmF0dGFjaG1lbnRzLm1heEJ5dGVzIGZlYXR1cmUgZmxhZydcbiAgICApO1xuICAgIHJldHVybiBERUZBVUxUX01BWDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRCbHVySGFzaCA9ICh0aGVtZTogVGhlbWVUeXBlID0gVGhlbWVUeXBlLmxpZ2h0KTogc3RyaW5nID0+IHtcbiAgaWYgKHRoZW1lID09PSBUaGVtZVR5cGUuZGFyaykge1xuICAgIHJldHVybiAnTDA1T1Fub2ZmUW9mb2ZmUWZRZlFmUWZRZlFmUSc7XG4gIH1cbiAgcmV0dXJuICdMMVFdK3ctO2ZRLTt+cWZRZlFmUWZRZlFmUWZRJztcbn07XG5cbmV4cG9ydCBjb25zdCBjYW5CZURvd25sb2FkZWQgPSAoXG4gIGF0dGFjaG1lbnQ6IFBpY2s8QXR0YWNobWVudFR5cGUsICdrZXknIHwgJ2RpZ2VzdCc+XG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIEJvb2xlYW4oYXR0YWNobWVudC5rZXkgJiYgYXR0YWNobWVudC5kaWdlc3QpO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFB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
