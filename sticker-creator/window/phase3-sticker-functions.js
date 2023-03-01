var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_sharp = __toESM(require("sharp"));
var import_pify = __toESM(require("pify"));
var import_fs = require("fs");
var import_lodash = require("lodash");
var import_electron = require("electron");
var import_Crypto = require("../../ts/Crypto");
var Bytes = __toESM(require("../../ts/Bytes"));
var import_protobuf = require("../../ts/protobuf");
var import_WebAPI = require("../../ts/textsecure/WebAPI");
var import_context = require("../../ts/windows/context");
var import_getAnimatedPngDataIfExists = require("../../ts/util/getAnimatedPngDataIfExists");
const STICKER_SIZE = 512;
const MIN_STICKER_DIMENSION = 10;
const MAX_STICKER_DIMENSION = STICKER_SIZE;
const MAX_STICKER_BYTE_LENGTH = 300 * 1024;
const { config } = import_context.SignalContext;
const WebAPI = (0, import_WebAPI.initialize)({
  url: config.serverUrl,
  storageUrl: config.storageUrl,
  updatesUrl: config.updatesUrl,
  directoryConfig: config.directoryConfig,
  cdnUrlObject: {
    0: config.cdnUrl0,
    2: config.cdnUrl2
  },
  certificateAuthority: config.certificateAuthority,
  contentProxyUrl: config.contentProxyUrl,
  proxyUrl: config.proxyUrl,
  version: config.version
});
function processStickerError(message, i18nKey) {
  const result = new Error(message);
  result.errorMessageI18nKey = i18nKey;
  return result;
}
window.processStickerImage = async (path) => {
  if (!path) {
    throw new Error(`Path ${path} is not valid!`);
  }
  const imgBuffer = await (0, import_pify.default)(import_fs.readFile)(path);
  const sharpImg = (0, import_sharp.default)(imgBuffer);
  const meta = await sharpImg.metadata();
  const { width, height } = meta;
  if (!width || !height) {
    throw processStickerError("Sticker height or width were falsy", "StickerCreator--Toasts--errorProcessing");
  }
  let contentType;
  let processedBuffer;
  const animatedPngDataIfExists = (0, import_getAnimatedPngDataIfExists.getAnimatedPngDataIfExists)(imgBuffer);
  if (animatedPngDataIfExists) {
    if (imgBuffer.byteLength > MAX_STICKER_BYTE_LENGTH) {
      throw processStickerError("Sticker file was too large", "StickerCreator--Toasts--tooLarge");
    }
    if (width !== height) {
      throw processStickerError("Sticker must be square", "StickerCreator--Toasts--APNG--notSquare");
    }
    if (width > MAX_STICKER_DIMENSION) {
      throw processStickerError("Sticker dimensions are too large", "StickerCreator--Toasts--APNG--dimensionsTooLarge");
    }
    if (width < MIN_STICKER_DIMENSION) {
      throw processStickerError("Sticker dimensions are too small", "StickerCreator--Toasts--APNG--dimensionsTooSmall");
    }
    if (animatedPngDataIfExists.numPlays !== Infinity) {
      throw processStickerError("Animated stickers must loop forever", "StickerCreator--Toasts--mustLoopForever");
    }
    contentType = "image/png";
    processedBuffer = imgBuffer;
  } else {
    contentType = "image/webp";
    processedBuffer = await sharpImg.resize({
      width: STICKER_SIZE,
      height: STICKER_SIZE,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }).webp().toBuffer();
    if (processedBuffer.byteLength > MAX_STICKER_BYTE_LENGTH) {
      throw processStickerError("Sticker file was too large", "StickerCreator--Toasts--tooLarge");
    }
  }
  return {
    path,
    buffer: processedBuffer,
    src: `data:${contentType};base64,${processedBuffer.toString("base64")}`,
    meta
  };
};
window.encryptAndUpload = async (manifest, stickers, cover, onProgress = import_lodash.noop) => {
  const usernameItem = await window.Signal.Data.getItemById("uuid_id");
  const oldUsernameItem = await window.Signal.Data.getItemById("number_id");
  const passwordItem = await window.Signal.Data.getItemById("password");
  const username = usernameItem?.value || oldUsernameItem?.value;
  if (!username || !passwordItem?.value) {
    const { message } = window.localeMessages["StickerCreator--Authentication--error"];
    import_electron.ipcRenderer.send("show-message-box", {
      type: "warning",
      message
    });
    throw new Error(message);
  }
  const { value: password } = passwordItem;
  const packKey = (0, import_Crypto.getRandomBytes)(32);
  const encryptionKey = (0, import_Crypto.deriveStickerPackKey)(packKey);
  const iv = (0, import_Crypto.getRandomBytes)(16);
  const server = WebAPI.connect({
    username,
    password,
    useWebSocket: false
  });
  const uniqueStickers = (0, import_lodash.uniqBy)([...stickers, { imageData: cover }], "imageData");
  const manifestProto = new import_protobuf.SignalService.StickerPack();
  manifestProto.title = manifest.title;
  manifestProto.author = manifest.author;
  manifestProto.stickers = stickers.map(({ emoji }, id) => {
    const s = new import_protobuf.SignalService.StickerPack.Sticker();
    s.id = id;
    if (emoji) {
      s.emoji = emoji;
    }
    return s;
  });
  const coverStickerId = uniqueStickers.length === stickers.length ? 0 : uniqueStickers.length - 1;
  const coverStickerData = stickers[coverStickerId];
  const coverSticker = new import_protobuf.SignalService.StickerPack.Sticker();
  coverSticker.id = coverStickerId;
  if (coverStickerData.emoji) {
    coverSticker.emoji = coverStickerData.emoji;
  } else {
    coverSticker.emoji = "";
  }
  manifestProto.cover = coverSticker;
  const encryptedManifest = await encrypt(import_protobuf.SignalService.StickerPack.encode(manifestProto).finish(), encryptionKey, iv);
  const encryptedStickers = uniqueStickers.map(({ imageData }) => {
    if (!imageData?.buffer) {
      throw new Error("encryptStickers: Missing image data on sticker");
    }
    return encrypt(imageData.buffer, encryptionKey, iv);
  });
  const packId = await server.putStickers(encryptedManifest, encryptedStickers, onProgress);
  const hexKey = Bytes.toHex(packKey);
  import_electron.ipcRenderer.send("install-sticker-pack", packId, hexKey);
  return { packId, key: hexKey };
};
function encrypt(data, key, iv) {
  const { ciphertext } = (0, import_Crypto.encryptAttachment)(data, key, iv);
  return ciphertext;
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGhhc2UzLXN0aWNrZXItZnVuY3Rpb25zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBzaGFycCBmcm9tICdzaGFycCc7XG5pbXBvcnQgcGlmeSBmcm9tICdwaWZ5JztcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgbm9vcCwgdW5pcUJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGlwY1JlbmRlcmVyIGFzIGlwYyB9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHtcbiAgZGVyaXZlU3RpY2tlclBhY2tLZXksXG4gIGVuY3J5cHRBdHRhY2htZW50LFxuICBnZXRSYW5kb21CeXRlcyxcbn0gZnJvbSAnLi4vLi4vdHMvQ3J5cHRvJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uLy4uL3RzL0J5dGVzJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi8uLi90cy9wcm90b2J1Zic7XG5pbXBvcnQgeyBpbml0aWFsaXplIGFzIGluaXRpYWxpemVXZWJBUEkgfSBmcm9tICcuLi8uLi90cy90ZXh0c2VjdXJlL1dlYkFQSSc7XG5cbmltcG9ydCB7IFNpZ25hbENvbnRleHQgfSBmcm9tICcuLi8uLi90cy93aW5kb3dzL2NvbnRleHQnO1xuaW1wb3J0IHsgZ2V0QW5pbWF0ZWRQbmdEYXRhSWZFeGlzdHMgfSBmcm9tICcuLi8uLi90cy91dGlsL2dldEFuaW1hdGVkUG5nRGF0YUlmRXhpc3RzJztcblxuY29uc3QgU1RJQ0tFUl9TSVpFID0gNTEyO1xuY29uc3QgTUlOX1NUSUNLRVJfRElNRU5TSU9OID0gMTA7XG5jb25zdCBNQVhfU1RJQ0tFUl9ESU1FTlNJT04gPSBTVElDS0VSX1NJWkU7XG5jb25zdCBNQVhfU1RJQ0tFUl9CWVRFX0xFTkdUSCA9IDMwMCAqIDEwMjQ7XG5cbmNvbnN0IHsgY29uZmlnIH0gPSBTaWduYWxDb250ZXh0O1xuXG5jb25zdCBXZWJBUEkgPSBpbml0aWFsaXplV2ViQVBJKHtcbiAgdXJsOiBjb25maWcuc2VydmVyVXJsLFxuICBzdG9yYWdlVXJsOiBjb25maWcuc3RvcmFnZVVybCxcbiAgdXBkYXRlc1VybDogY29uZmlnLnVwZGF0ZXNVcmwsXG4gIGRpcmVjdG9yeUNvbmZpZzogY29uZmlnLmRpcmVjdG9yeUNvbmZpZyxcbiAgY2RuVXJsT2JqZWN0OiB7XG4gICAgMDogY29uZmlnLmNkblVybDAsXG4gICAgMjogY29uZmlnLmNkblVybDIsXG4gIH0sXG4gIGNlcnRpZmljYXRlQXV0aG9yaXR5OiBjb25maWcuY2VydGlmaWNhdGVBdXRob3JpdHksXG4gIGNvbnRlbnRQcm94eVVybDogY29uZmlnLmNvbnRlbnRQcm94eVVybCxcbiAgcHJveHlVcmw6IGNvbmZpZy5wcm94eVVybCxcbiAgdmVyc2lvbjogY29uZmlnLnZlcnNpb24sXG59KTtcblxuZnVuY3Rpb24gcHJvY2Vzc1N0aWNrZXJFcnJvcihtZXNzYWdlOiBzdHJpbmcsIGkxOG5LZXk6IHN0cmluZyk6IEVycm9yIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXN1bHQuZXJyb3JNZXNzYWdlSTE4bktleSA9IGkxOG5LZXk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbndpbmRvdy5wcm9jZXNzU3RpY2tlckltYWdlID0gYXN5bmMgKHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4ge1xuICBpZiAoIXBhdGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFBhdGggJHtwYXRofSBpcyBub3QgdmFsaWQhYCk7XG4gIH1cblxuICBjb25zdCBpbWdCdWZmZXIgPSBhd2FpdCBwaWZ5KHJlYWRGaWxlKShwYXRoKTtcbiAgY29uc3Qgc2hhcnBJbWcgPSBzaGFycChpbWdCdWZmZXIpO1xuICBjb25zdCBtZXRhID0gYXdhaXQgc2hhcnBJbWcubWV0YWRhdGEoKTtcblxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IG1ldGE7XG4gIGlmICghd2lkdGggfHwgIWhlaWdodCkge1xuICAgIHRocm93IHByb2Nlc3NTdGlja2VyRXJyb3IoXG4gICAgICAnU3RpY2tlciBoZWlnaHQgb3Igd2lkdGggd2VyZSBmYWxzeScsXG4gICAgICAnU3RpY2tlckNyZWF0b3ItLVRvYXN0cy0tZXJyb3JQcm9jZXNzaW5nJ1xuICAgICk7XG4gIH1cblxuICBsZXQgY29udGVudFR5cGU7XG4gIGxldCBwcm9jZXNzZWRCdWZmZXI7XG5cbiAgLy8gW1NoYXJwIGRvZXNuJ3Qgc3VwcG9ydCBBUE5HXVswXSwgc28gd2UgZG8gc29tZXRoaW5nIHNpbXBsZXI6IHZhbGlkYXRlIHRoZSBmaWxlIHNpemVcbiAgLy8gICBhbmQgZGltZW5zaW9ucyB3aXRob3V0IHJlc2l6aW5nLCBjcm9wcGluZywgb3IgY29udmVydGluZy4gSW4gYSBwZXJmZWN0IHdvcmxkLCB3ZSdkXG4gIC8vICAgcmVzaXplIGFuZCBjb252ZXJ0IGFueSBhbmltYXRlZCBpbWFnZSAoR0lGLCBhbmltYXRlZCBXZWJQKSB0byBBUE5HLlxuICAvLyBbMF06IGh0dHBzOi8vZ2l0aHViLmNvbS9sb3ZlbGwvc2hhcnAvaXNzdWVzLzIzNzVcbiAgY29uc3QgYW5pbWF0ZWRQbmdEYXRhSWZFeGlzdHMgPSBnZXRBbmltYXRlZFBuZ0RhdGFJZkV4aXN0cyhpbWdCdWZmZXIpO1xuICBpZiAoYW5pbWF0ZWRQbmdEYXRhSWZFeGlzdHMpIHtcbiAgICBpZiAoaW1nQnVmZmVyLmJ5dGVMZW5ndGggPiBNQVhfU1RJQ0tFUl9CWVRFX0xFTkdUSCkge1xuICAgICAgdGhyb3cgcHJvY2Vzc1N0aWNrZXJFcnJvcihcbiAgICAgICAgJ1N0aWNrZXIgZmlsZSB3YXMgdG9vIGxhcmdlJyxcbiAgICAgICAgJ1N0aWNrZXJDcmVhdG9yLS1Ub2FzdHMtLXRvb0xhcmdlJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHdpZHRoICE9PSBoZWlnaHQpIHtcbiAgICAgIHRocm93IHByb2Nlc3NTdGlja2VyRXJyb3IoXG4gICAgICAgICdTdGlja2VyIG11c3QgYmUgc3F1YXJlJyxcbiAgICAgICAgJ1N0aWNrZXJDcmVhdG9yLS1Ub2FzdHMtLUFQTkctLW5vdFNxdWFyZSdcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh3aWR0aCA+IE1BWF9TVElDS0VSX0RJTUVOU0lPTikge1xuICAgICAgdGhyb3cgcHJvY2Vzc1N0aWNrZXJFcnJvcihcbiAgICAgICAgJ1N0aWNrZXIgZGltZW5zaW9ucyBhcmUgdG9vIGxhcmdlJyxcbiAgICAgICAgJ1N0aWNrZXJDcmVhdG9yLS1Ub2FzdHMtLUFQTkctLWRpbWVuc2lvbnNUb29MYXJnZSdcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh3aWR0aCA8IE1JTl9TVElDS0VSX0RJTUVOU0lPTikge1xuICAgICAgdGhyb3cgcHJvY2Vzc1N0aWNrZXJFcnJvcihcbiAgICAgICAgJ1N0aWNrZXIgZGltZW5zaW9ucyBhcmUgdG9vIHNtYWxsJyxcbiAgICAgICAgJ1N0aWNrZXJDcmVhdG9yLS1Ub2FzdHMtLUFQTkctLWRpbWVuc2lvbnNUb29TbWFsbCdcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChhbmltYXRlZFBuZ0RhdGFJZkV4aXN0cy5udW1QbGF5cyAhPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IHByb2Nlc3NTdGlja2VyRXJyb3IoXG4gICAgICAgICdBbmltYXRlZCBzdGlja2VycyBtdXN0IGxvb3AgZm9yZXZlcicsXG4gICAgICAgICdTdGlja2VyQ3JlYXRvci0tVG9hc3RzLS1tdXN0TG9vcEZvcmV2ZXInXG4gICAgICApO1xuICAgIH1cbiAgICBjb250ZW50VHlwZSA9ICdpbWFnZS9wbmcnO1xuICAgIHByb2Nlc3NlZEJ1ZmZlciA9IGltZ0J1ZmZlcjtcbiAgfSBlbHNlIHtcbiAgICBjb250ZW50VHlwZSA9ICdpbWFnZS93ZWJwJztcbiAgICBwcm9jZXNzZWRCdWZmZXIgPSBhd2FpdCBzaGFycEltZ1xuICAgICAgLnJlc2l6ZSh7XG4gICAgICAgIHdpZHRoOiBTVElDS0VSX1NJWkUsXG4gICAgICAgIGhlaWdodDogU1RJQ0tFUl9TSVpFLFxuICAgICAgICBmaXQ6ICdjb250YWluJyxcbiAgICAgICAgYmFja2dyb3VuZDogeyByOiAwLCBnOiAwLCBiOiAwLCBhbHBoYTogMCB9LFxuICAgICAgfSlcbiAgICAgIC53ZWJwKClcbiAgICAgIC50b0J1ZmZlcigpO1xuICAgIGlmIChwcm9jZXNzZWRCdWZmZXIuYnl0ZUxlbmd0aCA+IE1BWF9TVElDS0VSX0JZVEVfTEVOR1RIKSB7XG4gICAgICB0aHJvdyBwcm9jZXNzU3RpY2tlckVycm9yKFxuICAgICAgICAnU3RpY2tlciBmaWxlIHdhcyB0b28gbGFyZ2UnLFxuICAgICAgICAnU3RpY2tlckNyZWF0b3ItLVRvYXN0cy0tdG9vTGFyZ2UnXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0aCxcbiAgICBidWZmZXI6IHByb2Nlc3NlZEJ1ZmZlcixcbiAgICBzcmM6IGBkYXRhOiR7Y29udGVudFR5cGV9O2Jhc2U2NCwke3Byb2Nlc3NlZEJ1ZmZlci50b1N0cmluZygnYmFzZTY0Jyl9YCxcbiAgICBtZXRhLFxuICB9O1xufTtcblxud2luZG93LmVuY3J5cHRBbmRVcGxvYWQgPSBhc3luYyAoXG4gIG1hbmlmZXN0LFxuICBzdGlja2VycyxcbiAgY292ZXIsXG4gIG9uUHJvZ3Jlc3MgPSBub29wXG4pID0+IHtcbiAgY29uc3QgdXNlcm5hbWVJdGVtID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldEl0ZW1CeUlkKCd1dWlkX2lkJyk7XG4gIGNvbnN0IG9sZFVzZXJuYW1lSXRlbSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJdGVtQnlJZCgnbnVtYmVyX2lkJyk7XG4gIGNvbnN0IHBhc3N3b3JkSXRlbSA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRJdGVtQnlJZCgncGFzc3dvcmQnKTtcblxuICBjb25zdCB1c2VybmFtZSA9IHVzZXJuYW1lSXRlbT8udmFsdWUgfHwgb2xkVXNlcm5hbWVJdGVtPy52YWx1ZTtcbiAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmRJdGVtPy52YWx1ZSkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSB9ID1cbiAgICAgIHdpbmRvdy5sb2NhbGVNZXNzYWdlc1snU3RpY2tlckNyZWF0b3ItLUF1dGhlbnRpY2F0aW9uLS1lcnJvciddO1xuXG4gICAgaXBjLnNlbmQoJ3Nob3ctbWVzc2FnZS1ib3gnLCB7XG4gICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICBtZXNzYWdlLFxuICAgIH0pO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG5cbiAgY29uc3QgeyB2YWx1ZTogcGFzc3dvcmQgfSA9IHBhc3N3b3JkSXRlbTtcblxuICBjb25zdCBwYWNrS2V5ID0gZ2V0UmFuZG9tQnl0ZXMoMzIpO1xuICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gZGVyaXZlU3RpY2tlclBhY2tLZXkocGFja0tleSk7XG4gIGNvbnN0IGl2ID0gZ2V0UmFuZG9tQnl0ZXMoMTYpO1xuXG4gIGNvbnN0IHNlcnZlciA9IFdlYkFQSS5jb25uZWN0KHtcbiAgICB1c2VybmFtZSxcbiAgICBwYXNzd29yZCxcbiAgICB1c2VXZWJTb2NrZXQ6IGZhbHNlLFxuICB9KTtcblxuICBjb25zdCB1bmlxdWVTdGlja2VycyA9IHVuaXFCeShcbiAgICBbLi4uc3RpY2tlcnMsIHsgaW1hZ2VEYXRhOiBjb3ZlciB9XSxcbiAgICAnaW1hZ2VEYXRhJ1xuICApO1xuXG4gIGNvbnN0IG1hbmlmZXN0UHJvdG8gPSBuZXcgUHJvdG8uU3RpY2tlclBhY2soKTtcbiAgbWFuaWZlc3RQcm90by50aXRsZSA9IG1hbmlmZXN0LnRpdGxlO1xuICBtYW5pZmVzdFByb3RvLmF1dGhvciA9IG1hbmlmZXN0LmF1dGhvcjtcbiAgbWFuaWZlc3RQcm90by5zdGlja2VycyA9IHN0aWNrZXJzLm1hcCgoeyBlbW9qaSB9LCBpZCkgPT4ge1xuICAgIGNvbnN0IHMgPSBuZXcgUHJvdG8uU3RpY2tlclBhY2suU3RpY2tlcigpO1xuICAgIHMuaWQgPSBpZDtcbiAgICBpZiAoZW1vamkpIHtcbiAgICAgIHMuZW1vamkgPSBlbW9qaTtcbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfSk7XG5cbiAgY29uc3QgY292ZXJTdGlja2VySWQgPVxuICAgIHVuaXF1ZVN0aWNrZXJzLmxlbmd0aCA9PT0gc3RpY2tlcnMubGVuZ3RoID8gMCA6IHVuaXF1ZVN0aWNrZXJzLmxlbmd0aCAtIDE7XG4gIGNvbnN0IGNvdmVyU3RpY2tlckRhdGEgPSBzdGlja2Vyc1tjb3ZlclN0aWNrZXJJZF07XG4gIGNvbnN0IGNvdmVyU3RpY2tlciA9IG5ldyBQcm90by5TdGlja2VyUGFjay5TdGlja2VyKCk7XG4gIGNvdmVyU3RpY2tlci5pZCA9IGNvdmVyU3RpY2tlcklkO1xuICBpZiAoY292ZXJTdGlja2VyRGF0YS5lbW9qaSkge1xuICAgIGNvdmVyU3RpY2tlci5lbW9qaSA9IGNvdmVyU3RpY2tlckRhdGEuZW1vamk7XG4gIH0gZWxzZSB7XG4gICAgY292ZXJTdGlja2VyLmVtb2ppID0gJyc7XG4gIH1cbiAgbWFuaWZlc3RQcm90by5jb3ZlciA9IGNvdmVyU3RpY2tlcjtcblxuICBjb25zdCBlbmNyeXB0ZWRNYW5pZmVzdCA9IGF3YWl0IGVuY3J5cHQoXG4gICAgUHJvdG8uU3RpY2tlclBhY2suZW5jb2RlKG1hbmlmZXN0UHJvdG8pLmZpbmlzaCgpLFxuICAgIGVuY3J5cHRpb25LZXksXG4gICAgaXZcbiAgKTtcbiAgY29uc3QgZW5jcnlwdGVkU3RpY2tlcnMgPSB1bmlxdWVTdGlja2Vycy5tYXAoKHsgaW1hZ2VEYXRhIH0pID0+IHtcbiAgICBpZiAoIWltYWdlRGF0YT8uYnVmZmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuY3J5cHRTdGlja2VyczogTWlzc2luZyBpbWFnZSBkYXRhIG9uIHN0aWNrZXInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW5jcnlwdChpbWFnZURhdGEuYnVmZmVyLCBlbmNyeXB0aW9uS2V5LCBpdik7XG4gIH0pO1xuXG4gIGNvbnN0IHBhY2tJZCA9IGF3YWl0IHNlcnZlci5wdXRTdGlja2VycyhcbiAgICBlbmNyeXB0ZWRNYW5pZmVzdCxcbiAgICBlbmNyeXB0ZWRTdGlja2VycyxcbiAgICBvblByb2dyZXNzXG4gICk7XG5cbiAgY29uc3QgaGV4S2V5ID0gQnl0ZXMudG9IZXgocGFja0tleSk7XG5cbiAgaXBjLnNlbmQoJ2luc3RhbGwtc3RpY2tlci1wYWNrJywgcGFja0lkLCBoZXhLZXkpO1xuXG4gIHJldHVybiB7IHBhY2tJZCwga2V5OiBoZXhLZXkgfTtcbn07XG5cbmZ1bmN0aW9uIGVuY3J5cHQoXG4gIGRhdGE6IFVpbnQ4QXJyYXksXG4gIGtleTogVWludDhBcnJheSxcbiAgaXY6IFVpbnQ4QXJyYXlcbik6IFVpbnQ4QXJyYXkge1xuICBjb25zdCB7IGNpcGhlcnRleHQgfSA9IGVuY3J5cHRBdHRhY2htZW50KGRhdGEsIGtleSwgaXYpO1xuXG4gIHJldHVybiBjaXBoZXJ0ZXh0O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLG1CQUFrQjtBQUNsQixrQkFBaUI7QUFDakIsZ0JBQXlCO0FBQ3pCLG9CQUE2QjtBQUM3QixzQkFBbUM7QUFFbkMsb0JBSU87QUFDUCxZQUF1QjtBQUN2QixzQkFBdUM7QUFDdkMsb0JBQStDO0FBRS9DLHFCQUE4QjtBQUM5Qix3Q0FBMkM7QUFFM0MsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sd0JBQXdCO0FBQzlCLE1BQU0sd0JBQXdCO0FBQzlCLE1BQU0sMEJBQTBCLE1BQU07QUFFdEMsTUFBTSxFQUFFLFdBQVc7QUFFbkIsTUFBTSxTQUFTLDhCQUFpQjtBQUFBLEVBQzlCLEtBQUssT0FBTztBQUFBLEVBQ1osWUFBWSxPQUFPO0FBQUEsRUFDbkIsWUFBWSxPQUFPO0FBQUEsRUFDbkIsaUJBQWlCLE9BQU87QUFBQSxFQUN4QixjQUFjO0FBQUEsSUFDWixH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QUFFNUIsUUFBTSxTQUFTLE9BQU8sUUFBUTtBQUFBLElBQzVCO0FBQUEsSUFDQTtBQUFBLElBQ0EsY0FBYztBQUFBLEVBQ2hCLENBQUM7QUFFRCxRQUFNLGlCQUFpQiwwQkFDckIsQ0FBQyxHQUFHLFVBQVUsRUFBRSxXQUFXLE1BQU0sQ0FBQyxHQUNsQyxXQUNGO0FBRUEsUUFBTSxnQkFBZ0IsSUFBSSw4QkFBTSxZQUFZO0FBQzVDLGdCQUFjLFFBQVEsU0FBUztBQUMvQixnQkFBYyxTQUFTLFNBQVM7QUFDaEMsZ0JBQWMsV0FBVyxTQUFTLElBQUksQ0FBQyxFQUFFLFNBQVMsT0FBTztBQUN2RCxVQUFNLElBQUksSUFBSSw4QkFBTSxZQUFZLFFBQVE7QUFDeEMsTUFBRSxLQUFLO0FBQ1AsUUFBSSxPQUFPO0FBQ1QsUUFBRSxRQUFRO0FBQUEsSUFDWjtBQUVBLFdBQU87QUFBQSxFQUNULENBQUM7QUFFRCxRQUFNLGlCQUNKLGVBQWUsV0FBVyxTQUFTLFNBQVMsSUFBSSxlQUFlLFNBQVM7QUFDMUUsUUFBTSxtQkFBbUIsU0FBUztBQUNsQyxRQUFNLGVBQWUsSUFBSSw4QkFBTSxZQUFZLFFBQVE7QUFDbkQsZUFBYSxLQUFLO0FBQ2xCLE1BQUksaUJBQWlCLE9BQU87QUFDMUIsaUJBQWEsUUFBUSxpQkFBaUI7QUFBQSxFQUN4QyxPQUFPO0FBQ0wsaUJBQWEsUUFBUTtBQUFBLEVBQ3ZCO0FBQ0EsZ0JBQWMsUUFBUTtBQUV0QixRQUFNLG9CQUFvQixNQUFNLFFBQzlCLDhCQUFNLFlBQVksT0FBTyxhQUFhLEVBQUUsT0FBTyxHQUMvQyxlQUNBLEVBQ0Y7QUFDQSxRQUFNLG9CQUFvQixlQUFlLElBQUksQ0FBQyxFQUFFLGdCQUFnQjtBQUM5RCxRQUFJLENBQUMsV0FBVyxRQUFRO0FBQ3RCLFlBQU0sSUFBSSxNQUFNLGdEQUFnRDtBQUFBLElBQ2xFO0FBRUEsV0FBTyxRQUFRLFVBQVUsUUFBUSxlQUFlLEVBQUU7QUFBQSxFQUNwRCxDQUFDO0FBRUQsUUFBTSxTQUFTLE1BQU0sT0FBTyxZQUMxQixtQkFDQSxtQkFDQSxVQUNGO0FBRUEsUUFBTSxTQUFTLE1BQU0sTUFBTSxPQUFPO0FBRWxDLDhCQUFJLEtBQUssd0JBQXdCLFFBQVEsTUFBTTtBQUUvQyxTQUFPLEVBQUUsUUFBUSxLQUFLLE9BQU87QUFDL0I7QUFFQSxpQkFDRSxNQUNBLEtBQ0EsSUFDWTtBQUNaLFFBQU0sRUFBRSxlQUFlLHFDQUFrQixNQUFNLEtBQUssRUFBRTtBQUV0RCxTQUFPO0FBQ1Q7QUFSUyIsCiAgIm5hbWVzIjogW10KfQo=