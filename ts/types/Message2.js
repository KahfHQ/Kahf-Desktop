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
var Message2_exports = {};
__export(Message2_exports, {
  CURRENT_SCHEMA_VERSION: () => CURRENT_SCHEMA_VERSION,
  GROUP: () => GROUP,
  PRIVATE: () => PRIVATE,
  VERSION_NEEDED_FOR_DISPLAY: () => VERSION_NEEDED_FOR_DISPLAY,
  _mapAttachments: () => _mapAttachments,
  _mapContact: () => _mapContact,
  _mapPreviewAttachments: () => _mapPreviewAttachments,
  _mapQuotedAttachments: () => _mapQuotedAttachments,
  _withSchemaVersion: () => _withSchemaVersion,
  createAttachmentDataWriter: () => createAttachmentDataWriter,
  createAttachmentLoader: () => createAttachmentLoader,
  deleteAllExternalFiles: () => deleteAllExternalFiles,
  hasExpiration: () => import_Message.hasExpiration,
  initializeSchemaVersion: () => initializeSchemaVersion,
  isValid: () => isValid,
  loadContactData: () => loadContactData,
  loadPreviewData: () => loadPreviewData,
  loadQuoteData: () => loadQuoteData,
  loadStickerData: () => loadStickerData,
  processNewAttachment: () => processNewAttachment,
  processNewSticker: () => processNewSticker,
  upgradeSchema: () => upgradeSchema
});
module.exports = __toCommonJS(Message2_exports);
var import_lodash = require("lodash");
var Contact = __toESM(require("./EmbeddedContact"));
var import_Attachment = require("./Attachment");
var Errors = __toESM(require("./errors"));
var SchemaVersion = __toESM(require("./SchemaVersion"));
var import_initializeAttachmentMetadata = require("./message/initializeAttachmentMetadata");
var import_Message = require("./Message");
const GROUP = "group";
const PRIVATE = "private";
const INITIAL_SCHEMA_VERSION = 0;
const isValid = /* @__PURE__ */ __name((_message) => true, "isValid");
const initializeSchemaVersion = /* @__PURE__ */ __name(({
  message,
  logger
}) => {
  const isInitialized = SchemaVersion.isValid(message.schemaVersion) && message.schemaVersion >= 1;
  if (isInitialized) {
    return message;
  }
  const firstAttachment = message?.attachments?.[0];
  if (!firstAttachment) {
    return { ...message, schemaVersion: INITIAL_SCHEMA_VERSION };
  }
  const inheritedSchemaVersion = SchemaVersion.isValid(firstAttachment.schemaVersion) ? firstAttachment.schemaVersion : INITIAL_SCHEMA_VERSION;
  const messageWithInitialSchema = {
    ...message,
    schemaVersion: inheritedSchemaVersion,
    attachments: message?.attachments?.map((attachment) => (0, import_Attachment.removeSchemaVersion)({ attachment, logger })) || []
  };
  return messageWithInitialSchema;
}, "initializeSchemaVersion");
const _withSchemaVersion = /* @__PURE__ */ __name(({
  schemaVersion,
  upgrade
}) => {
  if (!SchemaVersion.isValid(schemaVersion)) {
    throw new TypeError("_withSchemaVersion: schemaVersion is invalid");
  }
  if (!(0, import_lodash.isFunction)(upgrade)) {
    throw new TypeError("_withSchemaVersion: upgrade must be a function");
  }
  return async (message, context) => {
    if (!context || !(0, import_lodash.isObject)(context.logger)) {
      throw new TypeError("_withSchemaVersion: context must have logger object");
    }
    const { logger } = context;
    if (!isValid(message)) {
      logger.error("Message._withSchemaVersion: Invalid input message:", message);
      return message;
    }
    const isAlreadyUpgraded = (message.schemaVersion || 0) >= schemaVersion;
    if (isAlreadyUpgraded) {
      return message;
    }
    const expectedVersion = schemaVersion - 1;
    const hasExpectedVersion = message.schemaVersion === expectedVersion;
    if (!hasExpectedVersion) {
      logger.warn("WARNING: Message._withSchemaVersion: Unexpected version:", `Expected message to have version ${expectedVersion},`, `but got ${message.schemaVersion}.`);
      return message;
    }
    let upgradedMessage;
    try {
      upgradedMessage = await upgrade(message, context);
    } catch (error) {
      logger.error(`Message._withSchemaVersion: error updating message ${message.id}:`, Errors.toLogFormat(error));
      return message;
    }
    if (!isValid(upgradedMessage)) {
      logger.error("Message._withSchemaVersion: Invalid upgraded message:", upgradedMessage);
      return message;
    }
    return { ...upgradedMessage, schemaVersion };
  };
}, "_withSchemaVersion");
const _mapAttachments = /* @__PURE__ */ __name((upgradeAttachment) => async (message, context) => {
  const upgradeWithContext = /* @__PURE__ */ __name((attachment) => upgradeAttachment(attachment, context, message), "upgradeWithContext");
  const attachments = await Promise.all((message.attachments || []).map(upgradeWithContext));
  return { ...message, attachments };
}, "_mapAttachments");
const _mapContact = /* @__PURE__ */ __name((upgradeContact) => async (message, context) => {
  const contextWithMessage = { ...context, message };
  const upgradeWithContext = /* @__PURE__ */ __name((contact2) => upgradeContact(contact2, contextWithMessage), "upgradeWithContext");
  const contact = await Promise.all((message.contact || []).map(upgradeWithContext));
  return { ...message, contact };
}, "_mapContact");
const _mapQuotedAttachments = /* @__PURE__ */ __name((upgradeAttachment) => async (message, context) => {
  if (!message.quote) {
    return message;
  }
  if (!context || !(0, import_lodash.isObject)(context.logger)) {
    throw new Error("_mapQuotedAttachments: context must have logger object");
  }
  const upgradeWithContext = /* @__PURE__ */ __name(async (attachment) => {
    const { thumbnail } = attachment;
    if (!thumbnail) {
      return attachment;
    }
    const upgradedThumbnail = await upgradeAttachment(thumbnail, context, message);
    return { ...attachment, thumbnail: upgradedThumbnail };
  }, "upgradeWithContext");
  const quotedAttachments = message.quote && message.quote.attachments || [];
  const attachments = await Promise.all(quotedAttachments.map(upgradeWithContext));
  return { ...message, quote: { ...message.quote, attachments } };
}, "_mapQuotedAttachments");
const _mapPreviewAttachments = /* @__PURE__ */ __name((upgradeAttachment) => async (message, context) => {
  if (!message.preview) {
    return message;
  }
  if (!context || !(0, import_lodash.isObject)(context.logger)) {
    throw new Error("_mapPreviewAttachments: context must have logger object");
  }
  const upgradeWithContext = /* @__PURE__ */ __name(async (preview2) => {
    const { image } = preview2;
    if (!image) {
      return preview2;
    }
    const upgradedImage = await upgradeAttachment(image, context, message);
    return { ...preview2, image: upgradedImage };
  }, "upgradeWithContext");
  const preview = await Promise.all((message.preview || []).map(upgradeWithContext));
  return { ...message, preview };
}, "_mapPreviewAttachments");
const toVersion0 = /* @__PURE__ */ __name(async (message, context) => initializeSchemaVersion({ message, logger: context.logger }), "toVersion0");
const toVersion1 = _withSchemaVersion({
  schemaVersion: 1,
  upgrade: _mapAttachments(import_Attachment.autoOrientJPEG)
});
const toVersion2 = _withSchemaVersion({
  schemaVersion: 2,
  upgrade: _mapAttachments(import_Attachment.replaceUnicodeOrderOverrides)
});
const toVersion3 = _withSchemaVersion({
  schemaVersion: 3,
  upgrade: _mapAttachments(import_Attachment.migrateDataToFileSystem)
});
const toVersion4 = _withSchemaVersion({
  schemaVersion: 4,
  upgrade: _mapQuotedAttachments(import_Attachment.migrateDataToFileSystem)
});
const toVersion5 = _withSchemaVersion({
  schemaVersion: 5,
  upgrade: import_initializeAttachmentMetadata.initializeAttachmentMetadata
});
const toVersion6 = _withSchemaVersion({
  schemaVersion: 6,
  upgrade: _mapContact(Contact.parseAndWriteAvatar(import_Attachment.migrateDataToFileSystem))
});
const toVersion7 = _withSchemaVersion({
  schemaVersion: 7,
  upgrade: import_initializeAttachmentMetadata.initializeAttachmentMetadata
});
const toVersion8 = _withSchemaVersion({
  schemaVersion: 8,
  upgrade: _mapAttachments(import_Attachment.captureDimensionsAndScreenshot)
});
const toVersion9 = _withSchemaVersion({
  schemaVersion: 9,
  upgrade: _mapAttachments(import_Attachment.replaceUnicodeV2)
});
const toVersion10 = _withSchemaVersion({
  schemaVersion: 10,
  upgrade: async (message, context) => {
    const processPreviews = _mapPreviewAttachments(import_Attachment.migrateDataToFileSystem);
    const processSticker = /* @__PURE__ */ __name(async (stickerMessage, stickerContext) => {
      const { sticker } = stickerMessage;
      if (!sticker || !sticker.data || !sticker.data.data) {
        return stickerMessage;
      }
      return {
        ...stickerMessage,
        sticker: {
          ...sticker,
          data: await (0, import_Attachment.migrateDataToFileSystem)(sticker.data, stickerContext)
        }
      };
    }, "processSticker");
    const previewProcessed = await processPreviews(message, context);
    const stickerProcessed = await processSticker(previewProcessed, context);
    return stickerProcessed;
  }
});
const VERSIONS = [
  toVersion0,
  toVersion1,
  toVersion2,
  toVersion3,
  toVersion4,
  toVersion5,
  toVersion6,
  toVersion7,
  toVersion8,
  toVersion9,
  toVersion10
];
const CURRENT_SCHEMA_VERSION = VERSIONS.length - 1;
const VERSION_NEEDED_FOR_DISPLAY = 9;
const upgradeSchema = /* @__PURE__ */ __name(async (rawMessage, {
  writeNewAttachmentData,
  getRegionCode,
  getAbsoluteAttachmentPath,
  getAbsoluteStickerPath,
  makeObjectUrl,
  revokeObjectUrl,
  getImageDimensions,
  makeImageThumbnail,
  makeVideoScreenshot,
  writeNewStickerData,
  logger,
  maxVersion = CURRENT_SCHEMA_VERSION
}) => {
  if (!(0, import_lodash.isFunction)(writeNewAttachmentData)) {
    throw new TypeError("context.writeNewAttachmentData is required");
  }
  if (!(0, import_lodash.isFunction)(getRegionCode)) {
    throw new TypeError("context.getRegionCode is required");
  }
  if (!(0, import_lodash.isFunction)(getAbsoluteAttachmentPath)) {
    throw new TypeError("context.getAbsoluteAttachmentPath is required");
  }
  if (!(0, import_lodash.isFunction)(makeObjectUrl)) {
    throw new TypeError("context.makeObjectUrl is required");
  }
  if (!(0, import_lodash.isFunction)(revokeObjectUrl)) {
    throw new TypeError("context.revokeObjectUrl is required");
  }
  if (!(0, import_lodash.isFunction)(getImageDimensions)) {
    throw new TypeError("context.getImageDimensions is required");
  }
  if (!(0, import_lodash.isFunction)(makeImageThumbnail)) {
    throw new TypeError("context.makeImageThumbnail is required");
  }
  if (!(0, import_lodash.isFunction)(makeVideoScreenshot)) {
    throw new TypeError("context.makeVideoScreenshot is required");
  }
  if (!(0, import_lodash.isObject)(logger)) {
    throw new TypeError("context.logger is required");
  }
  if (!(0, import_lodash.isFunction)(getAbsoluteStickerPath)) {
    throw new TypeError("context.getAbsoluteStickerPath is required");
  }
  if (!(0, import_lodash.isFunction)(writeNewStickerData)) {
    throw new TypeError("context.writeNewStickerData is required");
  }
  let message = rawMessage;
  for (let index = 0, max = VERSIONS.length; index < max; index += 1) {
    if (maxVersion < index) {
      break;
    }
    const currentVersion = VERSIONS[index];
    message = await currentVersion(message, {
      writeNewAttachmentData,
      getAbsoluteAttachmentPath,
      makeObjectUrl,
      revokeObjectUrl,
      getImageDimensions,
      makeImageThumbnail,
      makeVideoScreenshot,
      logger,
      getAbsoluteStickerPath,
      getRegionCode,
      writeNewStickerData
    });
  }
  return message;
}, "upgradeSchema");
const processNewAttachment = /* @__PURE__ */ __name(async (attachment, {
  writeNewAttachmentData,
  getAbsoluteAttachmentPath,
  makeObjectUrl,
  revokeObjectUrl,
  getImageDimensions,
  makeImageThumbnail,
  makeVideoScreenshot,
  logger
}) => {
  if (!(0, import_lodash.isFunction)(writeNewAttachmentData)) {
    throw new TypeError("context.writeNewAttachmentData is required");
  }
  if (!(0, import_lodash.isFunction)(getAbsoluteAttachmentPath)) {
    throw new TypeError("context.getAbsoluteAttachmentPath is required");
  }
  if (!(0, import_lodash.isFunction)(makeObjectUrl)) {
    throw new TypeError("context.makeObjectUrl is required");
  }
  if (!(0, import_lodash.isFunction)(revokeObjectUrl)) {
    throw new TypeError("context.revokeObjectUrl is required");
  }
  if (!(0, import_lodash.isFunction)(getImageDimensions)) {
    throw new TypeError("context.getImageDimensions is required");
  }
  if (!(0, import_lodash.isFunction)(makeImageThumbnail)) {
    throw new TypeError("context.makeImageThumbnail is required");
  }
  if (!(0, import_lodash.isFunction)(makeVideoScreenshot)) {
    throw new TypeError("context.makeVideoScreenshot is required");
  }
  if (!(0, import_lodash.isObject)(logger)) {
    throw new TypeError("context.logger is required");
  }
  const rotatedAttachment = await (0, import_Attachment.autoOrientJPEG)(attachment, { logger }, {
    isIncoming: true
  });
  const onDiskAttachment = await (0, import_Attachment.migrateDataToFileSystem)(rotatedAttachment, {
    writeNewAttachmentData,
    logger
  });
  const finalAttachment = await (0, import_Attachment.captureDimensionsAndScreenshot)(onDiskAttachment, {
    writeNewAttachmentData,
    getAbsoluteAttachmentPath,
    makeObjectUrl,
    revokeObjectUrl,
    getImageDimensions,
    makeImageThumbnail,
    makeVideoScreenshot,
    logger
  });
  return finalAttachment;
}, "processNewAttachment");
const processNewSticker = /* @__PURE__ */ __name(async (stickerData, {
  writeNewStickerData,
  getAbsoluteStickerPath,
  getImageDimensions,
  logger
}) => {
  if (!(0, import_lodash.isFunction)(writeNewStickerData)) {
    throw new TypeError("context.writeNewStickerData is required");
  }
  if (!(0, import_lodash.isFunction)(getAbsoluteStickerPath)) {
    throw new TypeError("context.getAbsoluteStickerPath is required");
  }
  if (!(0, import_lodash.isFunction)(getImageDimensions)) {
    throw new TypeError("context.getImageDimensions is required");
  }
  if (!(0, import_lodash.isObject)(logger)) {
    throw new TypeError("context.logger is required");
  }
  const path = await writeNewStickerData(stickerData);
  const absolutePath = await getAbsoluteStickerPath(path);
  const { width, height } = await getImageDimensions({
    objectUrl: absolutePath,
    logger
  });
  return {
    path,
    width,
    height
  };
}, "processNewSticker");
const createAttachmentLoader = /* @__PURE__ */ __name((loadAttachmentData) => {
  if (!(0, import_lodash.isFunction)(loadAttachmentData)) {
    throw new TypeError("createAttachmentLoader: loadAttachmentData is required");
  }
  return async (message) => ({
    ...message,
    attachments: await Promise.all((message.attachments || []).map(loadAttachmentData))
  });
}, "createAttachmentLoader");
const loadQuoteData = /* @__PURE__ */ __name((loadAttachmentData) => {
  if (!(0, import_lodash.isFunction)(loadAttachmentData)) {
    throw new TypeError("loadQuoteData: loadAttachmentData is required");
  }
  return async (quote) => {
    if (!quote) {
      return null;
    }
    return {
      ...quote,
      attachments: await Promise.all((quote.attachments || []).map(async (attachment) => {
        const { thumbnail } = attachment;
        if (!thumbnail || !thumbnail.path) {
          return attachment;
        }
        return {
          ...attachment,
          thumbnail: await loadAttachmentData(thumbnail)
        };
      }))
    };
  };
}, "loadQuoteData");
const loadContactData = /* @__PURE__ */ __name((loadAttachmentData) => {
  if (!(0, import_lodash.isFunction)(loadAttachmentData)) {
    throw new TypeError("loadContactData: loadAttachmentData is required");
  }
  return async (contact) => {
    if (!contact) {
      return void 0;
    }
    return Promise.all(contact.map(async (item) => {
      if (!item || !item.avatar || !item.avatar.avatar || !item.avatar.avatar.path) {
        return item;
      }
      return {
        ...item,
        avatar: {
          ...item.avatar,
          avatar: {
            ...item.avatar.avatar,
            ...await loadAttachmentData(item.avatar.avatar)
          }
        }
      };
    }));
  };
}, "loadContactData");
const loadPreviewData = /* @__PURE__ */ __name((loadAttachmentData) => {
  if (!(0, import_lodash.isFunction)(loadAttachmentData)) {
    throw new TypeError("loadPreviewData: loadAttachmentData is required");
  }
  return async (preview) => {
    if (!preview || !preview.length) {
      return [];
    }
    return Promise.all(preview.map(async (item) => {
      if (!item.image) {
        return item;
      }
      return {
        ...item,
        image: await loadAttachmentData(item.image)
      };
    }));
  };
}, "loadPreviewData");
const loadStickerData = /* @__PURE__ */ __name((loadAttachmentData) => {
  if (!(0, import_lodash.isFunction)(loadAttachmentData)) {
    throw new TypeError("loadStickerData: loadAttachmentData is required");
  }
  return async (sticker) => {
    if (!sticker || !sticker.data) {
      return void 0;
    }
    return {
      ...sticker,
      data: await loadAttachmentData(sticker.data)
    };
  };
}, "loadStickerData");
const deleteAllExternalFiles = /* @__PURE__ */ __name(({
  deleteAttachmentData,
  deleteOnDisk
}) => {
  if (!(0, import_lodash.isFunction)(deleteAttachmentData)) {
    throw new TypeError("deleteAllExternalFiles: deleteAttachmentData must be a function");
  }
  if (!(0, import_lodash.isFunction)(deleteOnDisk)) {
    throw new TypeError("deleteAllExternalFiles: deleteOnDisk must be a function");
  }
  return async (message) => {
    const { attachments, quote, contact, preview, sticker } = message;
    if (attachments && attachments.length) {
      await Promise.all(attachments.map(deleteAttachmentData));
    }
    if (quote && quote.attachments && quote.attachments.length) {
      await Promise.all(quote.attachments.map(async (attachment) => {
        const { thumbnail } = attachment;
        if (thumbnail && thumbnail.path && !thumbnail.copied) {
          await deleteOnDisk(thumbnail.path);
        }
      }));
    }
    if (contact && contact.length) {
      await Promise.all(contact.map(async (item) => {
        const { avatar } = item;
        if (avatar && avatar.avatar && avatar.avatar.path) {
          await deleteOnDisk(avatar.avatar.path);
        }
      }));
    }
    if (preview && preview.length) {
      await Promise.all(preview.map(async (item) => {
        const { image } = item;
        if (image && image.path) {
          await deleteOnDisk(image.path);
        }
      }));
    }
    if (sticker && sticker.data && sticker.data.path) {
      await deleteOnDisk(sticker.data.path);
      if (sticker.data.thumbnail && sticker.data.thumbnail.path) {
        await deleteOnDisk(sticker.data.thumbnail.path);
      }
    }
  };
}, "deleteAllExternalFiles");
const createAttachmentDataWriter = /* @__PURE__ */ __name(({
  writeExistingAttachmentData,
  logger
}) => {
  if (!(0, import_lodash.isFunction)(writeExistingAttachmentData)) {
    throw new TypeError("createAttachmentDataWriter: writeExistingAttachmentData must be a function");
  }
  if (!(0, import_lodash.isObject)(logger)) {
    throw new TypeError("createAttachmentDataWriter: logger must be an object");
  }
  return async (rawMessage) => {
    if (!isValid(rawMessage)) {
      throw new TypeError("'rawMessage' is not valid");
    }
    const message = initializeSchemaVersion({
      message: rawMessage,
      logger
    });
    const { attachments, quote, contact, preview } = message;
    const hasFilesToWrite = quote && quote.attachments && quote.attachments.length > 0 || attachments && attachments.length > 0 || contact && contact.length > 0 || preview && preview.length > 0;
    if (!hasFilesToWrite) {
      return message;
    }
    const lastVersionWithAttachmentDataInMemory = 2;
    const willAttachmentsGoToFileSystemOnUpgrade = (message.schemaVersion || 0) <= lastVersionWithAttachmentDataInMemory;
    if (willAttachmentsGoToFileSystemOnUpgrade) {
      return message;
    }
    (attachments || []).forEach((attachment) => {
      if (!(0, import_Attachment.hasData)(attachment)) {
        throw new TypeError("'attachment.data' is required during message import");
      }
      if (!(0, import_lodash.isString)(attachment.path)) {
        throw new TypeError("'attachment.path' is required during message import");
      }
    });
    const writeQuoteAttachment = /* @__PURE__ */ __name(async (attachment) => {
      const { thumbnail } = attachment;
      if (!thumbnail) {
        return attachment;
      }
      const { data, path } = thumbnail;
      if (!data || !path) {
        logger.warn("quote attachment had neither data nor path.", "id:", message.id, "source:", message.source);
        return attachment;
      }
      await writeExistingAttachmentData(thumbnail);
      return {
        ...attachment,
        thumbnail: (0, import_lodash.omit)(thumbnail, ["data"])
      };
    }, "writeQuoteAttachment");
    const writeContactAvatar = /* @__PURE__ */ __name(async (messageContact) => {
      const { avatar } = messageContact;
      if (!avatar) {
        return messageContact;
      }
      if (avatar && !avatar.avatar) {
        return (0, import_lodash.omit)(messageContact, ["avatar"]);
      }
      await writeExistingAttachmentData(avatar.avatar);
      return {
        ...messageContact,
        avatar: { ...avatar, avatar: (0, import_lodash.omit)(avatar.avatar, ["data"]) }
      };
    }, "writeContactAvatar");
    const writePreviewImage = /* @__PURE__ */ __name(async (item) => {
      const { image } = item;
      if (!image) {
        return (0, import_lodash.omit)(item, ["image"]);
      }
      await writeExistingAttachmentData(image);
      return { ...item, image: (0, import_lodash.omit)(image, ["data"]) };
    }, "writePreviewImage");
    const messageWithoutAttachmentData = {
      ...message,
      ...quote ? {
        quote: {
          ...quote,
          attachments: await Promise.all((quote?.attachments || []).map(writeQuoteAttachment))
        }
      } : void 0,
      contact: await Promise.all((contact || []).map(writeContactAvatar)),
      preview: await Promise.all((preview || []).map(writePreviewImage)),
      attachments: await Promise.all((attachments || []).map(async (attachment) => {
        await writeExistingAttachmentData(attachment);
        if (attachment.screenshot && attachment.screenshot.data) {
          await writeExistingAttachmentData(attachment.screenshot);
        }
        if (attachment.thumbnail && attachment.thumbnail.data) {
          await writeExistingAttachmentData(attachment.thumbnail);
        }
        return {
          ...(0, import_lodash.omit)(attachment, ["data"]),
          ...attachment.thumbnail ? { thumbnail: (0, import_lodash.omit)(attachment.thumbnail, ["data"]) } : null,
          ...attachment.screenshot ? { screenshot: (0, import_lodash.omit)(attachment.screenshot, ["data"]) } : null
        };
      }))
    };
    return messageWithoutAttachmentData;
  };
}, "createAttachmentDataWriter");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CURRENT_SCHEMA_VERSION,
  GROUP,
  PRIVATE,
  VERSION_NEEDED_FOR_DISPLAY,
  _mapAttachments,
  _mapContact,
  _mapPreviewAttachments,
  _mapQuotedAttachments,
  _withSchemaVersion,
  createAttachmentDataWriter,
  createAttachmentLoader,
  deleteAllExternalFiles,
  hasExpiration,
  initializeSchemaVersion,
  isValid,
  loadContactData,
  loadPreviewData,
  loadQuoteData,
  loadStickerData,
  processNewAttachment,
  processNewSticker,
  upgradeSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZTIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE4LTIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCBpc09iamVjdCwgaXNTdHJpbmcsIG9taXQgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgKiBhcyBDb250YWN0IGZyb20gJy4vRW1iZWRkZWRDb250YWN0JztcbmltcG9ydCB0eXBlIHsgQXR0YWNobWVudFR5cGUsIEF0dGFjaG1lbnRXaXRoSHlkcmF0ZWREYXRhIH0gZnJvbSAnLi9BdHRhY2htZW50JztcbmltcG9ydCB7XG4gIGF1dG9PcmllbnRKUEVHLFxuICBjYXB0dXJlRGltZW5zaW9uc0FuZFNjcmVlbnNob3QsXG4gIGhhc0RhdGEsXG4gIG1pZ3JhdGVEYXRhVG9GaWxlU3lzdGVtLFxuICByZW1vdmVTY2hlbWFWZXJzaW9uLFxuICByZXBsYWNlVW5pY29kZU9yZGVyT3ZlcnJpZGVzLFxuICByZXBsYWNlVW5pY29kZVYyLFxufSBmcm9tICcuL0F0dGFjaG1lbnQnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCAqIGFzIFNjaGVtYVZlcnNpb24gZnJvbSAnLi9TY2hlbWFWZXJzaW9uJztcbmltcG9ydCB7IGluaXRpYWxpemVBdHRhY2htZW50TWV0YWRhdGEgfSBmcm9tICcuL21lc3NhZ2UvaW5pdGlhbGl6ZUF0dGFjaG1lbnRNZXRhZGF0YSc7XG5cbmltcG9ydCB0eXBlICogYXMgTUlNRSBmcm9tICcuL01JTUUnO1xuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi9Mb2dnaW5nJztcbmltcG9ydCB0eXBlIHsgRW1iZWRkZWRDb250YWN0VHlwZSB9IGZyb20gJy4vRW1iZWRkZWRDb250YWN0JztcblxuaW1wb3J0IHR5cGUge1xuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gIFF1b3RlZE1lc3NhZ2VUeXBlLFxufSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB0eXBlIHsgTGlua1ByZXZpZXdUeXBlIH0gZnJvbSAnLi9tZXNzYWdlL0xpbmtQcmV2aWV3cyc7XG5pbXBvcnQgdHlwZSB7IFN0aWNrZXJUeXBlLCBTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSB9IGZyb20gJy4vU3RpY2tlcnMnO1xuXG5leHBvcnQgeyBoYXNFeHBpcmF0aW9uIH0gZnJvbSAnLi9NZXNzYWdlJztcblxuZXhwb3J0IGNvbnN0IEdST1VQID0gJ2dyb3VwJztcbmV4cG9ydCBjb25zdCBQUklWQVRFID0gJ3ByaXZhdGUnO1xuXG5leHBvcnQgdHlwZSBDb250ZXh0VHlwZSA9IHtcbiAgZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aDogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nO1xuICBnZXRBYnNvbHV0ZVN0aWNrZXJQYXRoOiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGdldEltYWdlRGltZW5zaW9uczogKHBhcmFtczoge1xuICAgIG9iamVjdFVybDogc3RyaW5nO1xuICAgIGxvZ2dlcjogTG9nZ2VyVHlwZTtcbiAgfSkgPT4gUHJvbWlzZTx7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgfT47XG4gIGdldFJlZ2lvbkNvZGU6ICgpID0+IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xuICBtYWtlSW1hZ2VUaHVtYm5haWw6IChwYXJhbXM6IHtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgb2JqZWN0VXJsOiBzdHJpbmc7XG4gICAgY29udGVudFR5cGU6IE1JTUUuTUlNRVR5cGU7XG4gICAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xuICB9KSA9PiBQcm9taXNlPEJsb2I+O1xuICBtYWtlT2JqZWN0VXJsOiAoXG4gICAgZGF0YTogVWludDhBcnJheSB8IEFycmF5QnVmZmVyLFxuICAgIGNvbnRlbnRUeXBlOiBNSU1FLk1JTUVUeXBlXG4gICkgPT4gc3RyaW5nO1xuICBtYWtlVmlkZW9TY3JlZW5zaG90OiAocGFyYW1zOiB7XG4gICAgb2JqZWN0VXJsOiBzdHJpbmc7XG4gICAgY29udGVudFR5cGU6IE1JTUUuTUlNRVR5cGU7XG4gICAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xuICB9KSA9PiBQcm9taXNlPEJsb2I+O1xuICBtYXhWZXJzaW9uPzogbnVtYmVyO1xuICByZXZva2VPYmplY3RVcmw6IChvYmplY3RVcmw6IHN0cmluZykgPT4gdm9pZDtcbiAgd3JpdGVOZXdBdHRhY2htZW50RGF0YTogKGRhdGE6IFVpbnQ4QXJyYXkpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgd3JpdGVOZXdTdGlja2VyRGF0YTogKGRhdGE6IFVpbnQ4QXJyYXkpID0+IFByb21pc2U8c3RyaW5nPjtcbn07XG5cbnR5cGUgV3JpdGVFeGlzdGluZ0F0dGFjaG1lbnREYXRhVHlwZSA9IChcbiAgYXR0YWNobWVudDogUGljazxBdHRhY2htZW50VHlwZSwgJ2RhdGEnIHwgJ3BhdGgnPlxuKSA9PiBQcm9taXNlPHN0cmluZz47XG5cbmV4cG9ydCB0eXBlIENvbnRleHRXaXRoTWVzc2FnZVR5cGUgPSBDb250ZXh0VHlwZSAmIHtcbiAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlO1xufTtcblxuLy8gU2NoZW1hIHZlcnNpb24gaGlzdG9yeVxuLy9cbi8vIFZlcnNpb24gMFxuLy8gICAtIFNjaGVtYSBpbml0aWFsaXplZFxuLy8gVmVyc2lvbiAxXG4vLyAgIC0gQXR0YWNobWVudHM6IEF1dG8tb3JpZW50IEpQRUcgYXR0YWNobWVudHMgdXNpbmcgRVhJRiBgT3JpZW50YXRpb25gIGRhdGEuXG4vLyAgICAgTi5CLiBUaGUgcHJvY2VzcyBvZiBhdXRvLW9yaWVudCBmb3IgSlBFR3Mgc3RyaXBzIChsb3NlcykgYWxsIGV4aXN0aW5nXG4vLyAgICAgRVhJRiBtZXRhZGF0YSBpbXByb3ZpbmcgcHJpdmFjeSwgZS5nLiBnZW9sb2NhdGlvbiwgY2FtZXJhIG1ha2UsIGV0Yy5cbi8vIFZlcnNpb24gMlxuLy8gICAtIEF0dGFjaG1lbnRzOiBTYW5pdGl6ZSBVbmljb2RlIG9yZGVyIG92ZXJyaWRlIGNoYXJhY3RlcnMuXG4vLyBWZXJzaW9uIDNcbi8vICAgLSBBdHRhY2htZW50czogV3JpdGUgYXR0YWNobWVudCBkYXRhIHRvIGRpc2sgYW5kIHN0b3JlIHJlbGF0aXZlIHBhdGggdG8gaXQuXG4vLyBWZXJzaW9uIDRcbi8vICAgLSBRdW90ZXM6IFdyaXRlIHRodW1ibmFpbCBkYXRhIHRvIGRpc2sgYW5kIHN0b3JlIHJlbGF0aXZlIHBhdGggdG8gaXQuXG4vLyBWZXJzaW9uIDUgKGRlcHJlY2F0ZWQpXG4vLyAgIC0gQXR0YWNobWVudHM6IFRyYWNrIG51bWJlciBhbmQga2luZCBvZiBhdHRhY2htZW50cyBmb3IgbWVkaWEgZ2FsbGVyeVxuLy8gICAgIC0gYGhhc0F0dGFjaG1lbnRzPzogMSB8IDBgXG4vLyAgICAgLSBgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cz86IDEgfCB1bmRlZmluZWRgIChmb3IgbWVkaWEgZ2FsbGVyeSBcdTIwMThNZWRpYVx1MjAxOSB2aWV3KVxuLy8gICAgIC0gYGhhc0ZpbGVBdHRhY2htZW50cz86IDEgfCB1bmRlZmluZWRgIChmb3IgbWVkaWEgZ2FsbGVyeSBcdTIwMThEb2N1bWVudHNcdTIwMTkgdmlldylcbi8vICAgLSBJTVBPUlRBTlQ6IFZlcnNpb24gNyBjaGFuZ2VzIHRoZSBjbGFzc2lmaWNhdGlvbiBvZiB2aXN1YWwgbWVkaWEgYW5kIGZpbGVzLlxuLy8gICAgIFRoZXJlZm9yZSB2ZXJzaW9uIDUgaXMgY29uc2lkZXJlZCBkZXByZWNhdGVkLiBGb3IgYW4gZWFzaWVyIGltcGxlbWVudGF0aW9uLFxuLy8gICAgIG5ldyBmaWxlcyBoYXZlIHRoZSBzYW1lIGNsYXNzaWZpY2F0aW9uIGluIHZlcnNpb24gNSBhcyBpbiB2ZXJzaW9uIDcuXG4vLyBWZXJzaW9uIDZcbi8vICAgLSBDb250YWN0OiBXcml0ZSBjb250YWN0IGF2YXRhciB0byBkaXNrLCBlbnN1cmUgY29udGFjdCBkYXRhIGlzIHdlbGwtZm9ybWVkXG4vLyBWZXJzaW9uIDcgKHN1cGVyc2VkZXMgYXR0YWNobWVudCBjbGFzc2lmaWNhdGlvbiBpbiB2ZXJzaW9uIDUpXG4vLyAgIC0gQXR0YWNobWVudHM6IFVwZGF0ZSBjbGFzc2lmaWNhdGlvbiBmb3I6XG4vLyAgICAgLSBgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50c2A6IEluY2x1ZGUgYWxsIGltYWdlcyBhbmQgdmlkZW8gcmVnYXJkbGVzcyBvZlxuLy8gICAgICAgd2hldGhlciBDaHJvbWl1bSBjYW4gcmVuZGVyIGl0IG9yIG5vdC5cbi8vICAgICAtIGBoYXNGaWxlQXR0YWNobWVudHNgOiBFeGNsdWRlIHZvaWNlIG1lc3NhZ2VzLlxuLy8gVmVyc2lvbiA4XG4vLyAgIC0gQXR0YWNobWVudHM6IENhcHR1cmUgdmlkZW8vaW1hZ2UgZGltZW5zaW9ucyBhbmQgdGh1bWJuYWlscywgYXMgd2VsbCBhcyBhXG4vLyAgICAgICBmdWxsLXNpemUgc2NyZWVuc2hvdCBmb3IgdmlkZW8uXG4vLyBWZXJzaW9uIDlcbi8vICAgLSBBdHRhY2htZW50czogRXhwYW5kIHRoZSBzZXQgb2YgdW5pY29kZSBjaGFyYWN0ZXJzIHdlIGZpbHRlciBvdXQgb2Zcbi8vICAgICBhdHRhY2htZW50IGZpbGVuYW1lc1xuLy8gVmVyc2lvbiAxMFxuLy8gICAtIFByZXZpZXc6IEEgbmV3IHR5cGUgb2YgYXR0YWNobWVudCBjYW4gYmUgaW5jbHVkZWQgaW4gYSBtZXNzYWdlLlxuXG5jb25zdCBJTklUSUFMX1NDSEVNQV9WRVJTSU9OID0gMDtcblxuLy8gUGxhY2Vob2xkZXIgdW50aWwgd2UgaGF2ZSBzdHJvbmdlciBwcmVjb25kaXRpb25zOlxuZXhwb3J0IGNvbnN0IGlzVmFsaWQgPSAoX21lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSk6IGJvb2xlYW4gPT4gdHJ1ZTtcblxuLy8gU2NoZW1hXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVNjaGVtYVZlcnNpb24gPSAoe1xuICBtZXNzYWdlLFxuICBsb2dnZXIsXG59OiB7XG4gIG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZTtcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlO1xufSk6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSA9PiB7XG4gIGNvbnN0IGlzSW5pdGlhbGl6ZWQgPVxuICAgIFNjaGVtYVZlcnNpb24uaXNWYWxpZChtZXNzYWdlLnNjaGVtYVZlcnNpb24pICYmIG1lc3NhZ2Uuc2NoZW1hVmVyc2lvbiA+PSAxO1xuICBpZiAoaXNJbml0aWFsaXplZCkge1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG5cbiAgY29uc3QgZmlyc3RBdHRhY2htZW50ID0gbWVzc2FnZT8uYXR0YWNobWVudHM/LlswXTtcbiAgaWYgKCFmaXJzdEF0dGFjaG1lbnQpIHtcbiAgICByZXR1cm4geyAuLi5tZXNzYWdlLCBzY2hlbWFWZXJzaW9uOiBJTklUSUFMX1NDSEVNQV9WRVJTSU9OIH07XG4gIH1cblxuICAvLyBBbGwgYXR0YWNobWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgc2NoZW1hIHZlcnNpb24sIHNvIHdlIGp1c3QgcGlja1xuICAvLyB0aGUgZmlyc3Qgb25lOlxuICBjb25zdCBpbmhlcml0ZWRTY2hlbWFWZXJzaW9uID0gU2NoZW1hVmVyc2lvbi5pc1ZhbGlkKFxuICAgIGZpcnN0QXR0YWNobWVudC5zY2hlbWFWZXJzaW9uXG4gIClcbiAgICA/IGZpcnN0QXR0YWNobWVudC5zY2hlbWFWZXJzaW9uXG4gICAgOiBJTklUSUFMX1NDSEVNQV9WRVJTSU9OO1xuICBjb25zdCBtZXNzYWdlV2l0aEluaXRpYWxTY2hlbWEgPSB7XG4gICAgLi4ubWVzc2FnZSxcbiAgICBzY2hlbWFWZXJzaW9uOiBpbmhlcml0ZWRTY2hlbWFWZXJzaW9uLFxuICAgIGF0dGFjaG1lbnRzOlxuICAgICAgbWVzc2FnZT8uYXR0YWNobWVudHM/Lm1hcChhdHRhY2htZW50ID0+XG4gICAgICAgIHJlbW92ZVNjaGVtYVZlcnNpb24oeyBhdHRhY2htZW50LCBsb2dnZXIgfSlcbiAgICAgICkgfHwgW10sXG4gIH07XG5cbiAgcmV0dXJuIG1lc3NhZ2VXaXRoSW5pdGlhbFNjaGVtYTtcbn07XG5cbi8vIE1pZGRsZXdhcmVcbi8vIHR5cGUgVXBncmFkZVN0ZXAgPSAoTWVzc2FnZSwgQ29udGV4dCkgLT4gUHJvbWlzZSBNZXNzYWdlXG5cbi8vIFNjaGVtYVZlcnNpb24gLT4gVXBncmFkZVN0ZXAgLT4gVXBncmFkZVN0ZXBcbmV4cG9ydCBjb25zdCBfd2l0aFNjaGVtYVZlcnNpb24gPSAoe1xuICBzY2hlbWFWZXJzaW9uLFxuICB1cGdyYWRlLFxufToge1xuICBzY2hlbWFWZXJzaW9uOiBudW1iZXI7XG4gIHVwZ3JhZGU6IChcbiAgICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gICAgY29udGV4dDogQ29udGV4dFR5cGVcbiAgKSA9PiBQcm9taXNlPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT47XG59KTogKChcbiAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICBjb250ZXh0OiBDb250ZXh0VHlwZVxuKSA9PiBQcm9taXNlPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT4pID0+IHtcbiAgaWYgKCFTY2hlbWFWZXJzaW9uLmlzVmFsaWQoc2NoZW1hVmVyc2lvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdfd2l0aFNjaGVtYVZlcnNpb246IHNjaGVtYVZlcnNpb24gaXMgaW52YWxpZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbih1cGdyYWRlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ193aXRoU2NoZW1hVmVyc2lvbjogdXBncmFkZSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHJldHVybiBhc3luYyAobWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLCBjb250ZXh0OiBDb250ZXh0VHlwZSkgPT4ge1xuICAgIGlmICghY29udGV4dCB8fCAhaXNPYmplY3QoY29udGV4dC5sb2dnZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnX3dpdGhTY2hlbWFWZXJzaW9uOiBjb250ZXh0IG11c3QgaGF2ZSBsb2dnZXIgb2JqZWN0J1xuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgeyBsb2dnZXIgfSA9IGNvbnRleHQ7XG5cbiAgICBpZiAoIWlzVmFsaWQobWVzc2FnZSkpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgJ01lc3NhZ2UuX3dpdGhTY2hlbWFWZXJzaW9uOiBJbnZhbGlkIGlucHV0IG1lc3NhZ2U6JyxcbiAgICAgICAgbWVzc2FnZVxuICAgICAgKTtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IGlzQWxyZWFkeVVwZ3JhZGVkID0gKG1lc3NhZ2Uuc2NoZW1hVmVyc2lvbiB8fCAwKSA+PSBzY2hlbWFWZXJzaW9uO1xuICAgIGlmIChpc0FscmVhZHlVcGdyYWRlZCkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwZWN0ZWRWZXJzaW9uID0gc2NoZW1hVmVyc2lvbiAtIDE7XG4gICAgY29uc3QgaGFzRXhwZWN0ZWRWZXJzaW9uID0gbWVzc2FnZS5zY2hlbWFWZXJzaW9uID09PSBleHBlY3RlZFZlcnNpb247XG4gICAgaWYgKCFoYXNFeHBlY3RlZFZlcnNpb24pIHtcbiAgICAgIGxvZ2dlci53YXJuKFxuICAgICAgICAnV0FSTklORzogTWVzc2FnZS5fd2l0aFNjaGVtYVZlcnNpb246IFVuZXhwZWN0ZWQgdmVyc2lvbjonLFxuICAgICAgICBgRXhwZWN0ZWQgbWVzc2FnZSB0byBoYXZlIHZlcnNpb24gJHtleHBlY3RlZFZlcnNpb259LGAsXG4gICAgICAgIGBidXQgZ290ICR7bWVzc2FnZS5zY2hlbWFWZXJzaW9ufS5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgbGV0IHVwZ3JhZGVkTWVzc2FnZTtcbiAgICB0cnkge1xuICAgICAgdXBncmFkZWRNZXNzYWdlID0gYXdhaXQgdXBncmFkZShtZXNzYWdlLCBjb250ZXh0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICBgTWVzc2FnZS5fd2l0aFNjaGVtYVZlcnNpb246IGVycm9yIHVwZGF0aW5nIG1lc3NhZ2UgJHttZXNzYWdlLmlkfTpgLFxuICAgICAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgaWYgKCFpc1ZhbGlkKHVwZ3JhZGVkTWVzc2FnZSkpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgJ01lc3NhZ2UuX3dpdGhTY2hlbWFWZXJzaW9uOiBJbnZhbGlkIHVwZ3JhZGVkIG1lc3NhZ2U6JyxcbiAgICAgICAgdXBncmFkZWRNZXNzYWdlXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgLi4udXBncmFkZWRNZXNzYWdlLCBzY2hlbWFWZXJzaW9uIH07XG4gIH07XG59O1xuXG4vLyBQdWJsaWMgQVBJXG4vLyAgICAgIF9tYXBBdHRhY2htZW50cyA6OiAoQXR0YWNobWVudCAtPiBQcm9taXNlIEF0dGFjaG1lbnQpIC0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAoTWVzc2FnZSwgQ29udGV4dCkgLT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UgTWVzc2FnZVxuZXhwb3J0IHR5cGUgVXBncmFkZUF0dGFjaG1lbnRUeXBlID0gKFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSxcbiAgY29udGV4dDogQ29udGV4dFR5cGUsXG4gIG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVxuKSA9PiBQcm9taXNlPEF0dGFjaG1lbnRUeXBlPjtcblxuZXhwb3J0IGNvbnN0IF9tYXBBdHRhY2htZW50cyA9XG4gICh1cGdyYWRlQXR0YWNobWVudDogVXBncmFkZUF0dGFjaG1lbnRUeXBlKSA9PlxuICBhc3luYyAoXG4gICAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICAgIGNvbnRleHQ6IENvbnRleHRUeXBlXG4gICk6IFByb21pc2U8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9PiB7XG4gICAgY29uc3QgdXBncmFkZVdpdGhDb250ZXh0ID0gKGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlKSA9PlxuICAgICAgdXBncmFkZUF0dGFjaG1lbnQoYXR0YWNobWVudCwgY29udGV4dCwgbWVzc2FnZSk7XG4gICAgY29uc3QgYXR0YWNobWVudHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIChtZXNzYWdlLmF0dGFjaG1lbnRzIHx8IFtdKS5tYXAodXBncmFkZVdpdGhDb250ZXh0KVxuICAgICk7XG4gICAgcmV0dXJuIHsgLi4ubWVzc2FnZSwgYXR0YWNobWVudHMgfTtcbiAgfTtcblxuLy8gUHVibGljIEFQSVxuLy8gICAgICBfbWFwQ29udGFjdCA6OiAoQ29udGFjdCAtPiBQcm9taXNlIENvbnRhY3QpIC0+XG4vLyAgICAgICAgICAgICAgICAgICAgIChNZXNzYWdlLCBDb250ZXh0KSAtPlxuLy8gICAgICAgICAgICAgICAgICAgICBQcm9taXNlIE1lc3NhZ2VcblxuZXhwb3J0IHR5cGUgVXBncmFkZUNvbnRhY3RUeXBlID0gKFxuICBjb250YWN0OiBFbWJlZGRlZENvbnRhY3RUeXBlLFxuICBjb250ZXh0V2l0aE1lc3NhZ2U6IENvbnRleHRXaXRoTWVzc2FnZVR5cGVcbikgPT4gUHJvbWlzZTxFbWJlZGRlZENvbnRhY3RUeXBlPjtcbmV4cG9ydCBjb25zdCBfbWFwQ29udGFjdCA9XG4gICh1cGdyYWRlQ29udGFjdDogVXBncmFkZUNvbnRhY3RUeXBlKSA9PlxuICBhc3luYyAoXG4gICAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlLFxuICAgIGNvbnRleHQ6IENvbnRleHRUeXBlXG4gICk6IFByb21pc2U8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9PiB7XG4gICAgY29uc3QgY29udGV4dFdpdGhNZXNzYWdlID0geyAuLi5jb250ZXh0LCBtZXNzYWdlIH07XG4gICAgY29uc3QgdXBncmFkZVdpdGhDb250ZXh0ID0gKGNvbnRhY3Q6IEVtYmVkZGVkQ29udGFjdFR5cGUpID0+XG4gICAgICB1cGdyYWRlQ29udGFjdChjb250YWN0LCBjb250ZXh0V2l0aE1lc3NhZ2UpO1xuICAgIGNvbnN0IGNvbnRhY3QgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIChtZXNzYWdlLmNvbnRhY3QgfHwgW10pLm1hcCh1cGdyYWRlV2l0aENvbnRleHQpXG4gICAgKTtcbiAgICByZXR1cm4geyAuLi5tZXNzYWdlLCBjb250YWN0IH07XG4gIH07XG5cbi8vICAgICAgX21hcFF1b3RlZEF0dGFjaG1lbnRzIDo6IChRdW90ZWRBdHRhY2htZW50IC0+IFByb21pc2UgUXVvdGVkQXR0YWNobWVudCkgLT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNZXNzYWdlLCBDb250ZXh0KSAtPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZSBNZXNzYWdlXG5leHBvcnQgY29uc3QgX21hcFF1b3RlZEF0dGFjaG1lbnRzID1cbiAgKHVwZ3JhZGVBdHRhY2htZW50OiBVcGdyYWRlQXR0YWNobWVudFR5cGUpID0+XG4gIGFzeW5jIChcbiAgICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gICAgY29udGV4dDogQ29udGV4dFR5cGVcbiAgKTogUHJvbWlzZTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2UucXVvdGUpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cbiAgICBpZiAoIWNvbnRleHQgfHwgIWlzT2JqZWN0KGNvbnRleHQubG9nZ2VyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdfbWFwUXVvdGVkQXR0YWNobWVudHM6IGNvbnRleHQgbXVzdCBoYXZlIGxvZ2dlciBvYmplY3QnKTtcbiAgICB9XG5cbiAgICBjb25zdCB1cGdyYWRlV2l0aENvbnRleHQgPSBhc3luYyAoXG4gICAgICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZVxuICAgICk6IFByb21pc2U8QXR0YWNobWVudFR5cGU+ID0+IHtcbiAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuICAgICAgaWYgKCF0aHVtYm5haWwpIHtcbiAgICAgICAgcmV0dXJuIGF0dGFjaG1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZ3JhZGVkVGh1bWJuYWlsID0gYXdhaXQgdXBncmFkZUF0dGFjaG1lbnQoXG4gICAgICAgIHRodW1ibmFpbCBhcyBBdHRhY2htZW50VHlwZSxcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgbWVzc2FnZVxuICAgICAgKTtcbiAgICAgIHJldHVybiB7IC4uLmF0dGFjaG1lbnQsIHRodW1ibmFpbDogdXBncmFkZWRUaHVtYm5haWwgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgcXVvdGVkQXR0YWNobWVudHMgPVxuICAgICAgKG1lc3NhZ2UucXVvdGUgJiYgbWVzc2FnZS5xdW90ZS5hdHRhY2htZW50cykgfHwgW107XG5cbiAgICBjb25zdCBhdHRhY2htZW50cyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgcXVvdGVkQXR0YWNobWVudHMubWFwKHVwZ3JhZGVXaXRoQ29udGV4dClcbiAgICApO1xuICAgIHJldHVybiB7IC4uLm1lc3NhZ2UsIHF1b3RlOiB7IC4uLm1lc3NhZ2UucXVvdGUsIGF0dGFjaG1lbnRzIH0gfTtcbiAgfTtcblxuLy8gICAgICBfbWFwUHJldmlld0F0dGFjaG1lbnRzIDo6IChQcmV2aWV3QXR0YWNobWVudCAtPiBQcm9taXNlIFByZXZpZXdBdHRhY2htZW50KSAtPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1lc3NhZ2UsIENvbnRleHQpIC0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlIE1lc3NhZ2VcbmV4cG9ydCBjb25zdCBfbWFwUHJldmlld0F0dGFjaG1lbnRzID1cbiAgKHVwZ3JhZGVBdHRhY2htZW50OiBVcGdyYWRlQXR0YWNobWVudFR5cGUpID0+XG4gIGFzeW5jIChcbiAgICBtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gICAgY29udGV4dDogQ29udGV4dFR5cGVcbiAgKTogUHJvbWlzZTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2UucHJldmlldykge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuICAgIGlmICghY29udGV4dCB8fCAhaXNPYmplY3QoY29udGV4dC5sb2dnZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdfbWFwUHJldmlld0F0dGFjaG1lbnRzOiBjb250ZXh0IG11c3QgaGF2ZSBsb2dnZXIgb2JqZWN0J1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB1cGdyYWRlV2l0aENvbnRleHQgPSBhc3luYyAocHJldmlldzogTGlua1ByZXZpZXdUeXBlKSA9PiB7XG4gICAgICBjb25zdCB7IGltYWdlIH0gPSBwcmV2aWV3O1xuICAgICAgaWYgKCFpbWFnZSkge1xuICAgICAgICByZXR1cm4gcHJldmlldztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBncmFkZWRJbWFnZSA9IGF3YWl0IHVwZ3JhZGVBdHRhY2htZW50KGltYWdlLCBjb250ZXh0LCBtZXNzYWdlKTtcbiAgICAgIHJldHVybiB7IC4uLnByZXZpZXcsIGltYWdlOiB1cGdyYWRlZEltYWdlIH07XG4gICAgfTtcblxuICAgIGNvbnN0IHByZXZpZXcgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIChtZXNzYWdlLnByZXZpZXcgfHwgW10pLm1hcCh1cGdyYWRlV2l0aENvbnRleHQpXG4gICAgKTtcbiAgICByZXR1cm4geyAuLi5tZXNzYWdlLCBwcmV2aWV3IH07XG4gIH07XG5cbmNvbnN0IHRvVmVyc2lvbjAgPSBhc3luYyAoXG4gIG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgY29udGV4dDogQ29udGV4dFR5cGVcbikgPT4gaW5pdGlhbGl6ZVNjaGVtYVZlcnNpb24oeyBtZXNzYWdlLCBsb2dnZXI6IGNvbnRleHQubG9nZ2VyIH0pO1xuY29uc3QgdG9WZXJzaW9uMSA9IF93aXRoU2NoZW1hVmVyc2lvbih7XG4gIHNjaGVtYVZlcnNpb246IDEsXG4gIHVwZ3JhZGU6IF9tYXBBdHRhY2htZW50cyhhdXRvT3JpZW50SlBFRyksXG59KTtcbmNvbnN0IHRvVmVyc2lvbjIgPSBfd2l0aFNjaGVtYVZlcnNpb24oe1xuICBzY2hlbWFWZXJzaW9uOiAyLFxuICB1cGdyYWRlOiBfbWFwQXR0YWNobWVudHMocmVwbGFjZVVuaWNvZGVPcmRlck92ZXJyaWRlcyksXG59KTtcbmNvbnN0IHRvVmVyc2lvbjMgPSBfd2l0aFNjaGVtYVZlcnNpb24oe1xuICBzY2hlbWFWZXJzaW9uOiAzLFxuICB1cGdyYWRlOiBfbWFwQXR0YWNobWVudHMobWlncmF0ZURhdGFUb0ZpbGVTeXN0ZW0pLFxufSk7XG5jb25zdCB0b1ZlcnNpb240ID0gX3dpdGhTY2hlbWFWZXJzaW9uKHtcbiAgc2NoZW1hVmVyc2lvbjogNCxcbiAgdXBncmFkZTogX21hcFF1b3RlZEF0dGFjaG1lbnRzKG1pZ3JhdGVEYXRhVG9GaWxlU3lzdGVtKSxcbn0pO1xuY29uc3QgdG9WZXJzaW9uNSA9IF93aXRoU2NoZW1hVmVyc2lvbih7XG4gIHNjaGVtYVZlcnNpb246IDUsXG4gIHVwZ3JhZGU6IGluaXRpYWxpemVBdHRhY2htZW50TWV0YWRhdGEsXG59KTtcbmNvbnN0IHRvVmVyc2lvbjYgPSBfd2l0aFNjaGVtYVZlcnNpb24oe1xuICBzY2hlbWFWZXJzaW9uOiA2LFxuICB1cGdyYWRlOiBfbWFwQ29udGFjdChDb250YWN0LnBhcnNlQW5kV3JpdGVBdmF0YXIobWlncmF0ZURhdGFUb0ZpbGVTeXN0ZW0pKSxcbn0pO1xuLy8gSU1QT1JUQU5UOiBXZVx1MjAxOXZlIHVwZGF0ZWQgb3VyIGRlZmluaXRpb24gb2YgYGluaXRpYWxpemVBdHRhY2htZW50TWV0YWRhdGFgLCBzb1xuLy8gd2UgbmVlZCB0byBydW4gaXQgYWdhaW4gb24gZXhpc3RpbmcgaXRlbXMgdGhhdCBoYXZlIHByZXZpb3VzbHkgYmVlbiBpbmNvcnJlY3RseVxuLy8gY2xhc3NpZmllZDpcbmNvbnN0IHRvVmVyc2lvbjcgPSBfd2l0aFNjaGVtYVZlcnNpb24oe1xuICBzY2hlbWFWZXJzaW9uOiA3LFxuICB1cGdyYWRlOiBpbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhLFxufSk7XG5cbmNvbnN0IHRvVmVyc2lvbjggPSBfd2l0aFNjaGVtYVZlcnNpb24oe1xuICBzY2hlbWFWZXJzaW9uOiA4LFxuICB1cGdyYWRlOiBfbWFwQXR0YWNobWVudHMoY2FwdHVyZURpbWVuc2lvbnNBbmRTY3JlZW5zaG90KSxcbn0pO1xuXG5jb25zdCB0b1ZlcnNpb245ID0gX3dpdGhTY2hlbWFWZXJzaW9uKHtcbiAgc2NoZW1hVmVyc2lvbjogOSxcbiAgdXBncmFkZTogX21hcEF0dGFjaG1lbnRzKHJlcGxhY2VVbmljb2RlVjIpLFxufSk7XG5jb25zdCB0b1ZlcnNpb24xMCA9IF93aXRoU2NoZW1hVmVyc2lvbih7XG4gIHNjaGVtYVZlcnNpb246IDEwLFxuICB1cGdyYWRlOiBhc3luYyAobWVzc2FnZSwgY29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHByb2Nlc3NQcmV2aWV3cyA9IF9tYXBQcmV2aWV3QXR0YWNobWVudHMobWlncmF0ZURhdGFUb0ZpbGVTeXN0ZW0pO1xuICAgIGNvbnN0IHByb2Nlc3NTdGlja2VyID0gYXN5bmMgKFxuICAgICAgc3RpY2tlck1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgICAgIHN0aWNrZXJDb250ZXh0OiBDb250ZXh0VHlwZVxuICAgICk6IFByb21pc2U8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9PiB7XG4gICAgICBjb25zdCB7IHN0aWNrZXIgfSA9IHN0aWNrZXJNZXNzYWdlO1xuICAgICAgaWYgKCFzdGlja2VyIHx8ICFzdGlja2VyLmRhdGEgfHwgIXN0aWNrZXIuZGF0YS5kYXRhKSB7XG4gICAgICAgIHJldHVybiBzdGlja2VyTWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RpY2tlck1lc3NhZ2UsXG4gICAgICAgIHN0aWNrZXI6IHtcbiAgICAgICAgICAuLi5zdGlja2VyLFxuICAgICAgICAgIGRhdGE6IGF3YWl0IG1pZ3JhdGVEYXRhVG9GaWxlU3lzdGVtKHN0aWNrZXIuZGF0YSwgc3RpY2tlckNvbnRleHQpLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgcHJldmlld1Byb2Nlc3NlZCA9IGF3YWl0IHByb2Nlc3NQcmV2aWV3cyhtZXNzYWdlLCBjb250ZXh0KTtcbiAgICBjb25zdCBzdGlja2VyUHJvY2Vzc2VkID0gYXdhaXQgcHJvY2Vzc1N0aWNrZXIocHJldmlld1Byb2Nlc3NlZCwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gc3RpY2tlclByb2Nlc3NlZDtcbiAgfSxcbn0pO1xuXG5jb25zdCBWRVJTSU9OUyA9IFtcbiAgdG9WZXJzaW9uMCxcbiAgdG9WZXJzaW9uMSxcbiAgdG9WZXJzaW9uMixcbiAgdG9WZXJzaW9uMyxcbiAgdG9WZXJzaW9uNCxcbiAgdG9WZXJzaW9uNSxcbiAgdG9WZXJzaW9uNixcbiAgdG9WZXJzaW9uNyxcbiAgdG9WZXJzaW9uOCxcbiAgdG9WZXJzaW9uOSxcbiAgdG9WZXJzaW9uMTAsXG5dO1xuZXhwb3J0IGNvbnN0IENVUlJFTlRfU0NIRU1BX1ZFUlNJT04gPSBWRVJTSU9OUy5sZW5ndGggLSAxO1xuXG4vLyBXZSBuZWVkIGRpbWVuc2lvbnMgYW5kIHNjcmVlbnNob3RzIGZvciBpbWFnZXMgZm9yIHByb3BlciBkaXNwbGF5XG5leHBvcnQgY29uc3QgVkVSU0lPTl9ORUVERURfRk9SX0RJU1BMQVkgPSA5O1xuXG4vLyBVcGdyYWRlU3RlcFxuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTY2hlbWEgPSBhc3luYyAoXG4gIHJhd01lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAge1xuICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGEsXG4gICAgZ2V0UmVnaW9uQ29kZSxcbiAgICBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoLFxuICAgIGdldEFic29sdXRlU3RpY2tlclBhdGgsXG4gICAgbWFrZU9iamVjdFVybCxcbiAgICByZXZva2VPYmplY3RVcmwsXG4gICAgZ2V0SW1hZ2VEaW1lbnNpb25zLFxuICAgIG1ha2VJbWFnZVRodW1ibmFpbCxcbiAgICBtYWtlVmlkZW9TY3JlZW5zaG90LFxuICAgIHdyaXRlTmV3U3RpY2tlckRhdGEsXG4gICAgbG9nZ2VyLFxuICAgIG1heFZlcnNpb24gPSBDVVJSRU5UX1NDSEVNQV9WRVJTSU9OLFxuICB9OiBDb250ZXh0VHlwZVxuKTogUHJvbWlzZTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+ID0+IHtcbiAgaWYgKCFpc0Z1bmN0aW9uKHdyaXRlTmV3QXR0YWNobWVudERhdGEpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC53cml0ZU5ld0F0dGFjaG1lbnREYXRhIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKGdldFJlZ2lvbkNvZGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5nZXRSZWdpb25Db2RlIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKGdldEFic29sdXRlQXR0YWNobWVudFBhdGgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5nZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKG1ha2VPYmplY3RVcmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5tYWtlT2JqZWN0VXJsIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKHJldm9rZU9iamVjdFVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZXh0LnJldm9rZU9iamVjdFVybCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihnZXRJbWFnZURpbWVuc2lvbnMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5nZXRJbWFnZURpbWVuc2lvbnMgaXMgcmVxdWlyZWQnKTtcbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24obWFrZUltYWdlVGh1bWJuYWlsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQubWFrZUltYWdlVGh1bWJuYWlsIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKG1ha2VWaWRlb1NjcmVlbnNob3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5tYWtlVmlkZW9TY3JlZW5zaG90IGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc09iamVjdChsb2dnZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5sb2dnZXIgaXMgcmVxdWlyZWQnKTtcbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oZ2V0QWJzb2x1dGVTdGlja2VyUGF0aCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZXh0LmdldEFic29sdXRlU3RpY2tlclBhdGggaXMgcmVxdWlyZWQnKTtcbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24od3JpdGVOZXdTdGlja2VyRGF0YSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZXh0LndyaXRlTmV3U3RpY2tlckRhdGEgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGxldCBtZXNzYWdlID0gcmF3TWVzc2FnZTtcbiAgZm9yIChsZXQgaW5kZXggPSAwLCBtYXggPSBWRVJTSU9OUy5sZW5ndGg7IGluZGV4IDwgbWF4OyBpbmRleCArPSAxKSB7XG4gICAgaWYgKG1heFZlcnNpb24gPCBpbmRleCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudFZlcnNpb24gPSBWRVJTSU9OU1tpbmRleF07XG4gICAgLy8gV2UgcmVhbGx5IGRvIHdhbnQgdGhpcyBpbnRyYS1sb29wIGF3YWl0IGJlY2F1c2UgdGhpcyBpcyBhIGNoYWluZWQgYXN5bmMgYWN0aW9uLFxuICAgIC8vICAgZWFjaCBzdGVwIGRlcGVuZGVudCBvbiB0aGUgcHJldmlvdXNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgIG1lc3NhZ2UgPSBhd2FpdCBjdXJyZW50VmVyc2lvbihtZXNzYWdlLCB7XG4gICAgICB3cml0ZU5ld0F0dGFjaG1lbnREYXRhLFxuICAgICAgZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCxcbiAgICAgIG1ha2VPYmplY3RVcmwsXG4gICAgICByZXZva2VPYmplY3RVcmwsXG4gICAgICBnZXRJbWFnZURpbWVuc2lvbnMsXG4gICAgICBtYWtlSW1hZ2VUaHVtYm5haWwsXG4gICAgICBtYWtlVmlkZW9TY3JlZW5zaG90LFxuICAgICAgbG9nZ2VyLFxuICAgICAgZ2V0QWJzb2x1dGVTdGlja2VyUGF0aCxcbiAgICAgIGdldFJlZ2lvbkNvZGUsXG4gICAgICB3cml0ZU5ld1N0aWNrZXJEYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1lc3NhZ2U7XG59O1xuXG4vLyBSdW5zIG9uIGF0dGFjaG1lbnRzIG91dHNpZGUgb2YgdGhlIHNjaGVtYSB1cGdyYWRlIHByb2Nlc3MsIHNpbmNlIGF0dGFjaG1lbnRzIGFyZVxuLy8gICBkb3dubG9hZGVkIG91dCBvZiBiYW5kLlxuZXhwb3J0IGNvbnN0IHByb2Nlc3NOZXdBdHRhY2htZW50ID0gYXN5bmMgKFxuICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSxcbiAge1xuICAgIHdyaXRlTmV3QXR0YWNobWVudERhdGEsXG4gICAgZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCxcbiAgICBtYWtlT2JqZWN0VXJsLFxuICAgIHJldm9rZU9iamVjdFVybCxcbiAgICBnZXRJbWFnZURpbWVuc2lvbnMsXG4gICAgbWFrZUltYWdlVGh1bWJuYWlsLFxuICAgIG1ha2VWaWRlb1NjcmVlbnNob3QsXG4gICAgbG9nZ2VyLFxuICB9OiBQaWNrPFxuICAgIENvbnRleHRUeXBlLFxuICAgIHwgJ3dyaXRlTmV3QXR0YWNobWVudERhdGEnXG4gICAgfCAnZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCdcbiAgICB8ICdtYWtlT2JqZWN0VXJsJ1xuICAgIHwgJ3Jldm9rZU9iamVjdFVybCdcbiAgICB8ICdnZXRJbWFnZURpbWVuc2lvbnMnXG4gICAgfCAnbWFrZUltYWdlVGh1bWJuYWlsJ1xuICAgIHwgJ21ha2VWaWRlb1NjcmVlbnNob3QnXG4gICAgfCAnbG9nZ2VyJ1xuICA+XG4pOiBQcm9taXNlPEF0dGFjaG1lbnRUeXBlPiA9PiB7XG4gIGlmICghaXNGdW5jdGlvbih3cml0ZU5ld0F0dGFjaG1lbnREYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQud3JpdGVOZXdBdHRhY2htZW50RGF0YSBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQuZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihtYWtlT2JqZWN0VXJsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQubWFrZU9iamVjdFVybCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihyZXZva2VPYmplY3RVcmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5yZXZva2VPYmplY3RVcmwgaXMgcmVxdWlyZWQnKTtcbiAgfVxuICBpZiAoIWlzRnVuY3Rpb24oZ2V0SW1hZ2VEaW1lbnNpb25zKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQuZ2V0SW1hZ2VEaW1lbnNpb25zIGlzIHJlcXVpcmVkJyk7XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKG1ha2VJbWFnZVRodW1ibmFpbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZXh0Lm1ha2VJbWFnZVRodW1ibmFpbCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihtYWtlVmlkZW9TY3JlZW5zaG90KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQubWFrZVZpZGVvU2NyZWVuc2hvdCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNPYmplY3QobG9nZ2VyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQubG9nZ2VyIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCByb3RhdGVkQXR0YWNobWVudCA9IGF3YWl0IGF1dG9PcmllbnRKUEVHKFxuICAgIGF0dGFjaG1lbnQsXG4gICAgeyBsb2dnZXIgfSxcbiAgICB7XG4gICAgICBpc0luY29taW5nOiB0cnVlLFxuICAgIH1cbiAgKTtcbiAgY29uc3Qgb25EaXNrQXR0YWNobWVudCA9IGF3YWl0IG1pZ3JhdGVEYXRhVG9GaWxlU3lzdGVtKHJvdGF0ZWRBdHRhY2htZW50LCB7XG4gICAgd3JpdGVOZXdBdHRhY2htZW50RGF0YSxcbiAgICBsb2dnZXIsXG4gIH0pO1xuICBjb25zdCBmaW5hbEF0dGFjaG1lbnQgPSBhd2FpdCBjYXB0dXJlRGltZW5zaW9uc0FuZFNjcmVlbnNob3QoXG4gICAgb25EaXNrQXR0YWNobWVudCxcbiAgICB7XG4gICAgICB3cml0ZU5ld0F0dGFjaG1lbnREYXRhLFxuICAgICAgZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCxcbiAgICAgIG1ha2VPYmplY3RVcmwsXG4gICAgICByZXZva2VPYmplY3RVcmwsXG4gICAgICBnZXRJbWFnZURpbWVuc2lvbnMsXG4gICAgICBtYWtlSW1hZ2VUaHVtYm5haWwsXG4gICAgICBtYWtlVmlkZW9TY3JlZW5zaG90LFxuICAgICAgbG9nZ2VyLFxuICAgIH1cbiAgKTtcblxuICByZXR1cm4gZmluYWxBdHRhY2htZW50O1xufTtcblxuZXhwb3J0IGNvbnN0IHByb2Nlc3NOZXdTdGlja2VyID0gYXN5bmMgKFxuICBzdGlja2VyRGF0YTogVWludDhBcnJheSxcbiAge1xuICAgIHdyaXRlTmV3U3RpY2tlckRhdGEsXG4gICAgZ2V0QWJzb2x1dGVTdGlja2VyUGF0aCxcbiAgICBnZXRJbWFnZURpbWVuc2lvbnMsXG4gICAgbG9nZ2VyLFxuICB9OiBQaWNrPFxuICAgIENvbnRleHRUeXBlLFxuICAgIHwgJ3dyaXRlTmV3U3RpY2tlckRhdGEnXG4gICAgfCAnZ2V0QWJzb2x1dGVTdGlja2VyUGF0aCdcbiAgICB8ICdnZXRJbWFnZURpbWVuc2lvbnMnXG4gICAgfCAnbG9nZ2VyJ1xuICA+XG4pOiBQcm9taXNlPHsgcGF0aDogc3RyaW5nOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiA9PiB7XG4gIGlmICghaXNGdW5jdGlvbih3cml0ZU5ld1N0aWNrZXJEYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQud3JpdGVOZXdTdGlja2VyRGF0YSBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihnZXRBYnNvbHV0ZVN0aWNrZXJQYXRoKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRleHQuZ2V0QWJzb2x1dGVTdGlja2VyUGF0aCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghaXNGdW5jdGlvbihnZXRJbWFnZURpbWVuc2lvbnMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGV4dC5nZXRJbWFnZURpbWVuc2lvbnMgaXMgcmVxdWlyZWQnKTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZXh0LmxvZ2dlciBpcyByZXF1aXJlZCcpO1xuICB9XG5cbiAgY29uc3QgcGF0aCA9IGF3YWl0IHdyaXRlTmV3U3RpY2tlckRhdGEoc3RpY2tlckRhdGEpO1xuICBjb25zdCBhYnNvbHV0ZVBhdGggPSBhd2FpdCBnZXRBYnNvbHV0ZVN0aWNrZXJQYXRoKHBhdGgpO1xuXG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYXdhaXQgZ2V0SW1hZ2VEaW1lbnNpb25zKHtcbiAgICBvYmplY3RVcmw6IGFic29sdXRlUGF0aCxcbiAgICBsb2dnZXIsXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgcGF0aCxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gIH07XG59O1xuXG50eXBlIExvYWRBdHRhY2htZW50VHlwZSA9IChcbiAgYXR0YWNobWVudDogUGljazxBdHRhY2htZW50VHlwZSwgJ2RhdGEnIHwgJ3BhdGgnPlxuKSA9PiBQcm9taXNlPEF0dGFjaG1lbnRXaXRoSHlkcmF0ZWREYXRhPjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUF0dGFjaG1lbnRMb2FkZXIgPSAoXG4gIGxvYWRBdHRhY2htZW50RGF0YTogTG9hZEF0dGFjaG1lbnRUeXBlXG4pOiAoKG1lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSkgPT4gUHJvbWlzZTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+KSA9PiB7XG4gIGlmICghaXNGdW5jdGlvbihsb2FkQXR0YWNobWVudERhdGEpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdjcmVhdGVBdHRhY2htZW50TG9hZGVyOiBsb2FkQXR0YWNobWVudERhdGEgaXMgcmVxdWlyZWQnXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBhc3luYyAoXG4gICAgbWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlXG4gICk6IFByb21pc2U8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9PiAoe1xuICAgIC4uLm1lc3NhZ2UsXG4gICAgYXR0YWNobWVudHM6IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgKG1lc3NhZ2UuYXR0YWNobWVudHMgfHwgW10pLm1hcChsb2FkQXR0YWNobWVudERhdGEpXG4gICAgKSxcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgbG9hZFF1b3RlRGF0YSA9IChcbiAgbG9hZEF0dGFjaG1lbnREYXRhOiBMb2FkQXR0YWNobWVudFR5cGVcbik6ICgoXG4gIHF1b3RlOiBRdW90ZWRNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZCB8IG51bGxcbikgPT4gUHJvbWlzZTxRdW90ZWRNZXNzYWdlVHlwZSB8IG51bGw+KSA9PiB7XG4gIGlmICghaXNGdW5jdGlvbihsb2FkQXR0YWNobWVudERhdGEpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbG9hZFF1b3RlRGF0YTogbG9hZEF0dGFjaG1lbnREYXRhIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICByZXR1cm4gYXN5bmMgKFxuICAgIHF1b3RlOiBRdW90ZWRNZXNzYWdlVHlwZSB8IHVuZGVmaW5lZCB8IG51bGxcbiAgKTogUHJvbWlzZTxRdW90ZWRNZXNzYWdlVHlwZSB8IG51bGw+ID0+IHtcbiAgICBpZiAoIXF1b3RlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ucXVvdGUsXG4gICAgICBhdHRhY2htZW50czogYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIChxdW90ZS5hdHRhY2htZW50cyB8fCBbXSkubWFwKGFzeW5jIGF0dGFjaG1lbnQgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuXG4gICAgICAgICAgaWYgKCF0aHVtYm5haWwgfHwgIXRodW1ibmFpbC5wYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uYXR0YWNobWVudCxcbiAgICAgICAgICAgIHRodW1ibmFpbDogYXdhaXQgbG9hZEF0dGFjaG1lbnREYXRhKHRodW1ibmFpbCksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2FkQ29udGFjdERhdGEgPSAoXG4gIGxvYWRBdHRhY2htZW50RGF0YTogTG9hZEF0dGFjaG1lbnRUeXBlXG4pOiAoKFxuICBjb250YWN0OiBBcnJheTxFbWJlZGRlZENvbnRhY3RUeXBlPiB8IHVuZGVmaW5lZFxuKSA9PiBQcm9taXNlPEFycmF5PEVtYmVkZGVkQ29udGFjdFR5cGU+IHwgdW5kZWZpbmVkPikgPT4ge1xuICBpZiAoIWlzRnVuY3Rpb24obG9hZEF0dGFjaG1lbnREYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xvYWRDb250YWN0RGF0YTogbG9hZEF0dGFjaG1lbnREYXRhIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICByZXR1cm4gYXN5bmMgKFxuICAgIGNvbnRhY3Q6IEFycmF5PEVtYmVkZGVkQ29udGFjdFR5cGU+IHwgdW5kZWZpbmVkXG4gICk6IFByb21pc2U8QXJyYXk8RW1iZWRkZWRDb250YWN0VHlwZT4gfCB1bmRlZmluZWQ+ID0+IHtcbiAgICBpZiAoIWNvbnRhY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgY29udGFjdC5tYXAoXG4gICAgICAgIGFzeW5jIChpdGVtOiBFbWJlZGRlZENvbnRhY3RUeXBlKTogUHJvbWlzZTxFbWJlZGRlZENvbnRhY3RUeXBlPiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWl0ZW0gfHxcbiAgICAgICAgICAgICFpdGVtLmF2YXRhciB8fFxuICAgICAgICAgICAgIWl0ZW0uYXZhdGFyLmF2YXRhciB8fFxuICAgICAgICAgICAgIWl0ZW0uYXZhdGFyLmF2YXRhci5wYXRoXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgIGF2YXRhcjoge1xuICAgICAgICAgICAgICAuLi5pdGVtLmF2YXRhcixcbiAgICAgICAgICAgICAgYXZhdGFyOiB7XG4gICAgICAgICAgICAgICAgLi4uaXRlbS5hdmF0YXIuYXZhdGFyLFxuICAgICAgICAgICAgICAgIC4uLihhd2FpdCBsb2FkQXR0YWNobWVudERhdGEoaXRlbS5hdmF0YXIuYXZhdGFyKSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRQcmV2aWV3RGF0YSA9IChcbiAgbG9hZEF0dGFjaG1lbnREYXRhOiBMb2FkQXR0YWNobWVudFR5cGVcbik6ICgoXG4gIHByZXZpZXc6IEFycmF5PExpbmtQcmV2aWV3VHlwZT4gfCB1bmRlZmluZWRcbikgPT4gUHJvbWlzZTxBcnJheTxMaW5rUHJldmlld1R5cGU+PikgPT4ge1xuICBpZiAoIWlzRnVuY3Rpb24obG9hZEF0dGFjaG1lbnREYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xvYWRQcmV2aWV3RGF0YTogbG9hZEF0dGFjaG1lbnREYXRhIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICByZXR1cm4gYXN5bmMgKHByZXZpZXc6IEFycmF5PExpbmtQcmV2aWV3VHlwZT4gfCB1bmRlZmluZWQpID0+IHtcbiAgICBpZiAoIXByZXZpZXcgfHwgIXByZXZpZXcubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgcHJldmlldy5tYXAoYXN5bmMgaXRlbSA9PiB7XG4gICAgICAgIGlmICghaXRlbS5pbWFnZSkge1xuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGltYWdlOiBhd2FpdCBsb2FkQXR0YWNobWVudERhdGEoaXRlbS5pbWFnZSksXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgbG9hZFN0aWNrZXJEYXRhID0gKFxuICBsb2FkQXR0YWNobWVudERhdGE6IExvYWRBdHRhY2htZW50VHlwZVxuKTogKChcbiAgc3RpY2tlcjogU3RpY2tlclR5cGUgfCB1bmRlZmluZWRcbikgPT4gUHJvbWlzZTxTdGlja2VyV2l0aEh5ZHJhdGVkRGF0YSB8IHVuZGVmaW5lZD4pID0+IHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxvYWRBdHRhY2htZW50RGF0YSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsb2FkU3RpY2tlckRhdGE6IGxvYWRBdHRhY2htZW50RGF0YSBpcyByZXF1aXJlZCcpO1xuICB9XG5cbiAgcmV0dXJuIGFzeW5jIChzdGlja2VyOiBTdGlja2VyVHlwZSB8IHVuZGVmaW5lZCkgPT4ge1xuICAgIGlmICghc3RpY2tlciB8fCAhc3RpY2tlci5kYXRhKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGlja2VyLFxuICAgICAgZGF0YTogYXdhaXQgbG9hZEF0dGFjaG1lbnREYXRhKHN0aWNrZXIuZGF0YSksXG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBkZWxldGVBbGxFeHRlcm5hbEZpbGVzID0gKHtcbiAgZGVsZXRlQXR0YWNobWVudERhdGEsXG4gIGRlbGV0ZU9uRGlzayxcbn06IHtcbiAgZGVsZXRlQXR0YWNobWVudERhdGE6IChhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlT25EaXNrOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufSk6ICgobWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiB7XG4gIGlmICghaXNGdW5jdGlvbihkZWxldGVBdHRhY2htZW50RGF0YSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ2RlbGV0ZUFsbEV4dGVybmFsRmlsZXM6IGRlbGV0ZUF0dGFjaG1lbnREYXRhIG11c3QgYmUgYSBmdW5jdGlvbidcbiAgICApO1xuICB9XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGRlbGV0ZU9uRGlzaykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ2RlbGV0ZUFsbEV4dGVybmFsRmlsZXM6IGRlbGV0ZU9uRGlzayBtdXN0IGJlIGEgZnVuY3Rpb24nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBhc3luYyAobWVzc2FnZTogTWVzc2FnZUF0dHJpYnV0ZXNUeXBlKSA9PiB7XG4gICAgY29uc3QgeyBhdHRhY2htZW50cywgcXVvdGUsIGNvbnRhY3QsIHByZXZpZXcsIHN0aWNrZXIgfSA9IG1lc3NhZ2U7XG5cbiAgICBpZiAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChhdHRhY2htZW50cy5tYXAoZGVsZXRlQXR0YWNobWVudERhdGEpKTtcbiAgICB9XG5cbiAgICBpZiAocXVvdGUgJiYgcXVvdGUuYXR0YWNobWVudHMgJiYgcXVvdGUuYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgcXVvdGUuYXR0YWNobWVudHMubWFwKGFzeW5jIGF0dGFjaG1lbnQgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuXG4gICAgICAgICAgLy8gVG8gcHJldmVudCBzcG9vZmluZywgd2UgY29weSB0aGUgb3JpZ2luYWwgaW1hZ2UgZnJvbSB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gICAgICAgICAgLy8gICBJZiBzbywgaXQgd2lsbCBoYXZlIGEgJ2NvcGllZCcgZmllbGQuIFdlIGRvbid0IHdhbnQgdG8gZGVsZXRlIGl0IGlmIGl0IGhhc1xuICAgICAgICAgIC8vICAgdGhhdCBmaWVsZCBzZXQgdG8gdHJ1ZS5cbiAgICAgICAgICBpZiAodGh1bWJuYWlsICYmIHRodW1ibmFpbC5wYXRoICYmICF0aHVtYm5haWwuY29waWVkKSB7XG4gICAgICAgICAgICBhd2FpdCBkZWxldGVPbkRpc2sodGh1bWJuYWlsLnBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRhY3QgJiYgY29udGFjdC5sZW5ndGgpIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBjb250YWN0Lm1hcChhc3luYyBpdGVtID0+IHtcbiAgICAgICAgICBjb25zdCB7IGF2YXRhciB9ID0gaXRlbTtcblxuICAgICAgICAgIGlmIChhdmF0YXIgJiYgYXZhdGFyLmF2YXRhciAmJiBhdmF0YXIuYXZhdGFyLnBhdGgpIHtcbiAgICAgICAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayhhdmF0YXIuYXZhdGFyLnBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZpZXcgJiYgcHJldmlldy5sZW5ndGgpIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBwcmV2aWV3Lm1hcChhc3luYyBpdGVtID0+IHtcbiAgICAgICAgICBjb25zdCB7IGltYWdlIH0gPSBpdGVtO1xuXG4gICAgICAgICAgaWYgKGltYWdlICYmIGltYWdlLnBhdGgpIHtcbiAgICAgICAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayhpbWFnZS5wYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzdGlja2VyICYmIHN0aWNrZXIuZGF0YSAmJiBzdGlja2VyLmRhdGEucGF0aCkge1xuICAgICAgYXdhaXQgZGVsZXRlT25EaXNrKHN0aWNrZXIuZGF0YS5wYXRoKTtcblxuICAgICAgaWYgKHN0aWNrZXIuZGF0YS50aHVtYm5haWwgJiYgc3RpY2tlci5kYXRhLnRodW1ibmFpbC5wYXRoKSB7XG4gICAgICAgIGF3YWl0IGRlbGV0ZU9uRGlzayhzdGlja2VyLmRhdGEudGh1bWJuYWlsLnBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cbi8vICAgICAgY3JlYXRlQXR0YWNobWVudERhdGFXcml0ZXIgOjogKFJlbGF0aXZlUGF0aCAtPiBJTyBVbml0KVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXNzYWdlIC0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElPIChQcm9taXNlIE1lc3NhZ2UpXG5leHBvcnQgY29uc3QgY3JlYXRlQXR0YWNobWVudERhdGFXcml0ZXIgPSAoe1xuICB3cml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGEsXG4gIGxvZ2dlcixcbn06IHtcbiAgd3JpdGVFeGlzdGluZ0F0dGFjaG1lbnREYXRhOiBXcml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGFUeXBlO1xuICBsb2dnZXI6IExvZ2dlclR5cGU7XG59KTogKChtZXNzYWdlOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUpID0+IFByb21pc2U8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPikgPT4ge1xuICBpZiAoIWlzRnVuY3Rpb24od3JpdGVFeGlzdGluZ0F0dGFjaG1lbnREYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnY3JlYXRlQXR0YWNobWVudERhdGFXcml0ZXI6IHdyaXRlRXhpc3RpbmdBdHRhY2htZW50RGF0YSBtdXN0IGJlIGEgZnVuY3Rpb24nXG4gICAgKTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KGxvZ2dlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjcmVhdGVBdHRhY2htZW50RGF0YVdyaXRlcjogbG9nZ2VyIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICByZXR1cm4gYXN5bmMgKFxuICAgIHJhd01lc3NhZ2U6IE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZVxuICApOiBQcm9taXNlPE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZT4gPT4ge1xuICAgIGlmICghaXNWYWxpZChyYXdNZXNzYWdlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidyYXdNZXNzYWdlJyBpcyBub3QgdmFsaWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IGluaXRpYWxpemVTY2hlbWFWZXJzaW9uKHtcbiAgICAgIG1lc3NhZ2U6IHJhd01lc3NhZ2UsXG4gICAgICBsb2dnZXIsXG4gICAgfSk7XG5cbiAgICBjb25zdCB7IGF0dGFjaG1lbnRzLCBxdW90ZSwgY29udGFjdCwgcHJldmlldyB9ID0gbWVzc2FnZTtcbiAgICBjb25zdCBoYXNGaWxlc1RvV3JpdGUgPVxuICAgICAgKHF1b3RlICYmIHF1b3RlLmF0dGFjaG1lbnRzICYmIHF1b3RlLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHx8XG4gICAgICAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoID4gMCkgfHxcbiAgICAgIChjb250YWN0ICYmIGNvbnRhY3QubGVuZ3RoID4gMCkgfHxcbiAgICAgIChwcmV2aWV3ICYmIHByZXZpZXcubGVuZ3RoID4gMCk7XG5cbiAgICBpZiAoIWhhc0ZpbGVzVG9Xcml0ZSkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdFZlcnNpb25XaXRoQXR0YWNobWVudERhdGFJbk1lbW9yeSA9IDI7XG4gICAgY29uc3Qgd2lsbEF0dGFjaG1lbnRzR29Ub0ZpbGVTeXN0ZW1PblVwZ3JhZGUgPVxuICAgICAgKG1lc3NhZ2Uuc2NoZW1hVmVyc2lvbiB8fCAwKSA8PSBsYXN0VmVyc2lvbldpdGhBdHRhY2htZW50RGF0YUluTWVtb3J5O1xuICAgIGlmICh3aWxsQXR0YWNobWVudHNHb1RvRmlsZVN5c3RlbU9uVXBncmFkZSkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgKGF0dGFjaG1lbnRzIHx8IFtdKS5mb3JFYWNoKGF0dGFjaG1lbnQgPT4ge1xuICAgICAgaWYgKCFoYXNEYXRhKGF0dGFjaG1lbnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCInYXR0YWNobWVudC5kYXRhJyBpcyByZXF1aXJlZCBkdXJpbmcgbWVzc2FnZSBpbXBvcnRcIlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzU3RyaW5nKGF0dGFjaG1lbnQucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIidhdHRhY2htZW50LnBhdGgnIGlzIHJlcXVpcmVkIGR1cmluZyBtZXNzYWdlIGltcG9ydFwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB3cml0ZVF1b3RlQXR0YWNobWVudCA9IGFzeW5jIChhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZSkgPT4ge1xuICAgICAgY29uc3QgeyB0aHVtYm5haWwgfSA9IGF0dGFjaG1lbnQ7XG4gICAgICBpZiAoIXRodW1ibmFpbCkge1xuICAgICAgICByZXR1cm4gYXR0YWNobWVudDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBkYXRhLCBwYXRoIH0gPSB0aHVtYm5haWw7XG5cbiAgICAgIC8vIHdlIHdhbnQgdG8gYmUgYnVsbGV0cHJvb2YgdG8gYXR0YWNobWVudHMgd2l0aG91dCBkYXRhXG4gICAgICBpZiAoIWRhdGEgfHwgIXBhdGgpIHtcbiAgICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgICAgJ3F1b3RlIGF0dGFjaG1lbnQgaGFkIG5laXRoZXIgZGF0YSBub3IgcGF0aC4nLFxuICAgICAgICAgICdpZDonLFxuICAgICAgICAgIG1lc3NhZ2UuaWQsXG4gICAgICAgICAgJ3NvdXJjZTonLFxuICAgICAgICAgIG1lc3NhZ2Uuc291cmNlXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBhdHRhY2htZW50O1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB3cml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGEodGh1bWJuYWlsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmF0dGFjaG1lbnQsXG4gICAgICAgIHRodW1ibmFpbDogb21pdCh0aHVtYm5haWwsIFsnZGF0YSddKSxcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IHdyaXRlQ29udGFjdEF2YXRhciA9IGFzeW5jIChcbiAgICAgIG1lc3NhZ2VDb250YWN0OiBFbWJlZGRlZENvbnRhY3RUeXBlXG4gICAgKTogUHJvbWlzZTxFbWJlZGRlZENvbnRhY3RUeXBlPiA9PiB7XG4gICAgICBjb25zdCB7IGF2YXRhciB9ID0gbWVzc2FnZUNvbnRhY3Q7XG4gICAgICBpZiAoIWF2YXRhcikge1xuICAgICAgICByZXR1cm4gbWVzc2FnZUNvbnRhY3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdmF0YXIgJiYgIWF2YXRhci5hdmF0YXIpIHtcbiAgICAgICAgcmV0dXJuIG9taXQobWVzc2FnZUNvbnRhY3QsIFsnYXZhdGFyJ10pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB3cml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGEoYXZhdGFyLmF2YXRhcik7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm1lc3NhZ2VDb250YWN0LFxuICAgICAgICBhdmF0YXI6IHsgLi4uYXZhdGFyLCBhdmF0YXI6IG9taXQoYXZhdGFyLmF2YXRhciwgWydkYXRhJ10pIH0sXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCB3cml0ZVByZXZpZXdJbWFnZSA9IGFzeW5jIChcbiAgICAgIGl0ZW06IExpbmtQcmV2aWV3VHlwZVxuICAgICk6IFByb21pc2U8TGlua1ByZXZpZXdUeXBlPiA9PiB7XG4gICAgICBjb25zdCB7IGltYWdlIH0gPSBpdGVtO1xuICAgICAgaWYgKCFpbWFnZSkge1xuICAgICAgICByZXR1cm4gb21pdChpdGVtLCBbJ2ltYWdlJ10pO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB3cml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGEoaW1hZ2UpO1xuXG4gICAgICByZXR1cm4geyAuLi5pdGVtLCBpbWFnZTogb21pdChpbWFnZSwgWydkYXRhJ10pIH07XG4gICAgfTtcblxuICAgIGNvbnN0IG1lc3NhZ2VXaXRob3V0QXR0YWNobWVudERhdGEgPSB7XG4gICAgICAuLi5tZXNzYWdlLFxuICAgICAgLi4uKHF1b3RlXG4gICAgICAgID8ge1xuICAgICAgICAgICAgcXVvdGU6IHtcbiAgICAgICAgICAgICAgLi4ucXVvdGUsXG4gICAgICAgICAgICAgIGF0dGFjaG1lbnRzOiBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAocXVvdGU/LmF0dGFjaG1lbnRzIHx8IFtdKS5tYXAod3JpdGVRdW90ZUF0dGFjaG1lbnQpXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWQpLFxuICAgICAgY29udGFjdDogYXdhaXQgUHJvbWlzZS5hbGwoKGNvbnRhY3QgfHwgW10pLm1hcCh3cml0ZUNvbnRhY3RBdmF0YXIpKSxcbiAgICAgIHByZXZpZXc6IGF3YWl0IFByb21pc2UuYWxsKChwcmV2aWV3IHx8IFtdKS5tYXAod3JpdGVQcmV2aWV3SW1hZ2UpKSxcbiAgICAgIGF0dGFjaG1lbnRzOiBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgKGF0dGFjaG1lbnRzIHx8IFtdKS5tYXAoYXN5bmMgYXR0YWNobWVudCA9PiB7XG4gICAgICAgICAgYXdhaXQgd3JpdGVFeGlzdGluZ0F0dGFjaG1lbnREYXRhKGF0dGFjaG1lbnQpO1xuXG4gICAgICAgICAgaWYgKGF0dGFjaG1lbnQuc2NyZWVuc2hvdCAmJiBhdHRhY2htZW50LnNjcmVlbnNob3QuZGF0YSkge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVFeGlzdGluZ0F0dGFjaG1lbnREYXRhKGF0dGFjaG1lbnQuc2NyZWVuc2hvdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhdHRhY2htZW50LnRodW1ibmFpbCAmJiBhdHRhY2htZW50LnRodW1ibmFpbC5kYXRhKSB7XG4gICAgICAgICAgICBhd2FpdCB3cml0ZUV4aXN0aW5nQXR0YWNobWVudERhdGEoYXR0YWNobWVudC50aHVtYm5haWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5vbWl0KGF0dGFjaG1lbnQsIFsnZGF0YSddKSxcbiAgICAgICAgICAgIC4uLihhdHRhY2htZW50LnRodW1ibmFpbFxuICAgICAgICAgICAgICA/IHsgdGh1bWJuYWlsOiBvbWl0KGF0dGFjaG1lbnQudGh1bWJuYWlsLCBbJ2RhdGEnXSkgfVxuICAgICAgICAgICAgICA6IG51bGwpLFxuICAgICAgICAgICAgLi4uKGF0dGFjaG1lbnQuc2NyZWVuc2hvdFxuICAgICAgICAgICAgICA/IHsgc2NyZWVuc2hvdDogb21pdChhdHRhY2htZW50LnNjcmVlbnNob3QsIFsnZGF0YSddKSB9XG4gICAgICAgICAgICAgIDogbnVsbCksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgfTtcblxuICAgIHJldHVybiBtZXNzYWdlV2l0aG91dEF0dGFjaG1lbnREYXRhO1xuICB9O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBcUQ7QUFFckQsY0FBeUI7QUFFekIsd0JBUU87QUFDUCxhQUF3QjtBQUN4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
