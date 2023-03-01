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
var scaleImageToLevel_exports = {};
__export(scaleImageToLevel_exports, {
  scaleImageToLevel: () => scaleImageToLevel
});
module.exports = __toCommonJS(scaleImageToLevel_exports);
var import_blueimp_load_image = __toESM(require("blueimp-load-image"));
var import_MIME = require("../types/MIME");
var import_canvasToBlob = require("./canvasToBlob");
var import_RemoteConfig = require("../RemoteConfig");
var import_libphonenumberUtil = require("./libphonenumberUtil");
var import_isRecord = require("./isRecord");
var MediaQualityLevels = /* @__PURE__ */ ((MediaQualityLevels2) => {
  MediaQualityLevels2[MediaQualityLevels2["One"] = 1] = "One";
  MediaQualityLevels2[MediaQualityLevels2["Two"] = 2] = "Two";
  MediaQualityLevels2[MediaQualityLevels2["Three"] = 3] = "Three";
  return MediaQualityLevels2;
})(MediaQualityLevels || {});
const DEFAULT_LEVEL = 1 /* One */;
const MiB = 1024 * 1024;
const DEFAULT_LEVEL_DATA = {
  maxDimensions: 1600,
  quality: 0.7,
  size: MiB,
  thresholdSize: 0.2 * MiB
};
const MEDIA_QUALITY_LEVEL_DATA = /* @__PURE__ */ new Map([
  [1 /* One */, DEFAULT_LEVEL_DATA],
  [
    2 /* Two */,
    {
      maxDimensions: 2048,
      quality: 0.75,
      size: MiB * 1.5,
      thresholdSize: 0.3 * MiB
    }
  ],
  [
    3 /* Three */,
    {
      maxDimensions: 4096,
      quality: 0.75,
      size: MiB * 3,
      thresholdSize: 0.4 * MiB
    }
  ]
]);
const SCALABLE_DIMENSIONS = [3072, 2048, 1600, 1024, 768];
const MIN_DIMENSIONS = 512;
function parseCountryValues(values) {
  const map = /* @__PURE__ */ new Map();
  values.split(",").forEach((value) => {
    const [countryCode, level] = value.split(":");
    map.set(countryCode, Number(level) === 2 ? 2 /* Two */ : 1 /* One */);
  });
  return map;
}
function getMediaQualityLevel() {
  const values = (0, import_RemoteConfig.getValue)("desktop.mediaQuality.levels");
  if (!values) {
    return DEFAULT_LEVEL;
  }
  const e164 = window.textsecure.storage.user.getNumber();
  if (!e164) {
    return DEFAULT_LEVEL;
  }
  const parsedPhoneNumber = (0, import_libphonenumberUtil.parseNumber)(e164);
  if (!parsedPhoneNumber.isValidNumber) {
    return DEFAULT_LEVEL;
  }
  const countryValues = parseCountryValues(values);
  const level = parsedPhoneNumber.countryCode ? countryValues.get(parsedPhoneNumber.countryCode) : void 0;
  if (level) {
    return level;
  }
  return countryValues.get("*") || DEFAULT_LEVEL;
}
async function getCanvasBlobAsJPEG(image, dimensions, quality) {
  const canvas = import_blueimp_load_image.default.scale(image, {
    canvas: true,
    maxHeight: dimensions,
    maxWidth: dimensions
  });
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("image not a canvas");
  }
  return (0, import_canvasToBlob.canvasToBlob)(canvas, import_MIME.IMAGE_JPEG, quality);
}
async function scaleImageToLevel(fileOrBlobOrURL, contentType, sendAsHighQuality) {
  let image;
  try {
    const data = await (0, import_blueimp_load_image.default)(fileOrBlobOrURL, {
      canvas: true,
      orientation: true
    });
    if (!(data.image instanceof HTMLCanvasElement)) {
      throw new Error("image not a canvas");
    }
    ({ image } = data);
  } catch (err) {
    const errorString = (0, import_isRecord.isRecord)(err) && "stack" in err ? err.stack : err;
    const error = new Error("scaleImageToLevel: Failed to process image", errorString);
    error.originalError = err;
    throw error;
  }
  const level = sendAsHighQuality ? 3 /* Three */ : getMediaQualityLevel();
  const { maxDimensions, quality, size, thresholdSize } = MEDIA_QUALITY_LEVEL_DATA.get(level) || DEFAULT_LEVEL_DATA;
  if (fileOrBlobOrURL.size <= thresholdSize) {
    const blob2 = await (0, import_canvasToBlob.canvasToBlob)(image, contentType);
    return {
      blob: blob2,
      contentType
    };
  }
  for (let i = 0; i < SCALABLE_DIMENSIONS.length; i += 1) {
    const scalableDimensions = SCALABLE_DIMENSIONS[i];
    if (maxDimensions < scalableDimensions) {
      continue;
    }
    const blob2 = await getCanvasBlobAsJPEG(image, scalableDimensions, quality);
    if (blob2.size <= size) {
      return {
        blob: blob2,
        contentType: import_MIME.IMAGE_JPEG
      };
    }
  }
  const blob = await getCanvasBlobAsJPEG(image, MIN_DIMENSIONS, quality);
  return {
    blob,
    contentType: import_MIME.IMAGE_JPEG
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  scaleImageToLevel
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NhbGVJbWFnZVRvTGV2ZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgbG9hZEltYWdlIGZyb20gJ2JsdWVpbXAtbG9hZC1pbWFnZSc7XG5cbmltcG9ydCB0eXBlIHsgTUlNRVR5cGUgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IElNQUdFX0pQRUcgfSBmcm9tICcuLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IGNhbnZhc1RvQmxvYiB9IGZyb20gJy4vY2FudmFzVG9CbG9iJztcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi4vUmVtb3RlQ29uZmlnJztcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSAnLi9saWJwaG9uZW51bWJlclV0aWwnO1xuaW1wb3J0IHsgaXNSZWNvcmQgfSBmcm9tICcuL2lzUmVjb3JkJztcblxuZW51bSBNZWRpYVF1YWxpdHlMZXZlbHMge1xuICBPbmUgPSAxLFxuICBUd28gPSAyLFxuICBUaHJlZSA9IDMsXG59XG5cbmNvbnN0IERFRkFVTFRfTEVWRUwgPSBNZWRpYVF1YWxpdHlMZXZlbHMuT25lO1xuXG5jb25zdCBNaUIgPSAxMDI0ICogMTAyNDtcblxuY29uc3QgREVGQVVMVF9MRVZFTF9EQVRBID0ge1xuICBtYXhEaW1lbnNpb25zOiAxNjAwLFxuICBxdWFsaXR5OiAwLjcsXG4gIHNpemU6IE1pQixcbiAgdGhyZXNob2xkU2l6ZTogMC4yICogTWlCLFxufTtcblxuY29uc3QgTUVESUFfUVVBTElUWV9MRVZFTF9EQVRBID0gbmV3IE1hcChbXG4gIFtNZWRpYVF1YWxpdHlMZXZlbHMuT25lLCBERUZBVUxUX0xFVkVMX0RBVEFdLFxuICBbXG4gICAgTWVkaWFRdWFsaXR5TGV2ZWxzLlR3byxcbiAgICB7XG4gICAgICBtYXhEaW1lbnNpb25zOiAyMDQ4LFxuICAgICAgcXVhbGl0eTogMC43NSxcbiAgICAgIHNpemU6IE1pQiAqIDEuNSxcbiAgICAgIHRocmVzaG9sZFNpemU6IDAuMyAqIE1pQixcbiAgICB9LFxuICBdLFxuICBbXG4gICAgTWVkaWFRdWFsaXR5TGV2ZWxzLlRocmVlLFxuICAgIHtcbiAgICAgIG1heERpbWVuc2lvbnM6IDQwOTYsXG4gICAgICBxdWFsaXR5OiAwLjc1LFxuICAgICAgc2l6ZTogTWlCICogMyxcbiAgICAgIHRocmVzaG9sZFNpemU6IDAuNCAqIE1pQixcbiAgICB9LFxuICBdLFxuXSk7XG5cbmNvbnN0IFNDQUxBQkxFX0RJTUVOU0lPTlMgPSBbMzA3MiwgMjA0OCwgMTYwMCwgMTAyNCwgNzY4XTtcbmNvbnN0IE1JTl9ESU1FTlNJT05TID0gNTEyO1xuXG5mdW5jdGlvbiBwYXJzZUNvdW50cnlWYWx1ZXModmFsdWVzOiBzdHJpbmcpOiBNYXA8c3RyaW5nLCBNZWRpYVF1YWxpdHlMZXZlbHM+IHtcbiAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIE1lZGlhUXVhbGl0eUxldmVscz4oKTtcbiAgdmFsdWVzLnNwbGl0KCcsJykuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgY29uc3QgW2NvdW50cnlDb2RlLCBsZXZlbF0gPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgIG1hcC5zZXQoXG4gICAgICBjb3VudHJ5Q29kZSxcbiAgICAgIE51bWJlcihsZXZlbCkgPT09IDIgPyBNZWRpYVF1YWxpdHlMZXZlbHMuVHdvIDogTWVkaWFRdWFsaXR5TGV2ZWxzLk9uZVxuICAgICk7XG4gIH0pO1xuICByZXR1cm4gbWFwO1xufVxuXG5mdW5jdGlvbiBnZXRNZWRpYVF1YWxpdHlMZXZlbCgpOiBNZWRpYVF1YWxpdHlMZXZlbHMge1xuICBjb25zdCB2YWx1ZXMgPSBnZXRWYWx1ZSgnZGVza3RvcC5tZWRpYVF1YWxpdHkubGV2ZWxzJyk7XG4gIGlmICghdmFsdWVzKSB7XG4gICAgcmV0dXJuIERFRkFVTFRfTEVWRUw7XG4gIH1cblxuICBjb25zdCBlMTY0ID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICBpZiAoIWUxNjQpIHtcbiAgICByZXR1cm4gREVGQVVMVF9MRVZFTDtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlZFBob25lTnVtYmVyID0gcGFyc2VOdW1iZXIoZTE2NCk7XG4gIGlmICghcGFyc2VkUGhvbmVOdW1iZXIuaXNWYWxpZE51bWJlcikge1xuICAgIHJldHVybiBERUZBVUxUX0xFVkVMO1xuICB9XG5cbiAgY29uc3QgY291bnRyeVZhbHVlcyA9IHBhcnNlQ291bnRyeVZhbHVlcyh2YWx1ZXMpO1xuXG4gIGNvbnN0IGxldmVsID0gcGFyc2VkUGhvbmVOdW1iZXIuY291bnRyeUNvZGVcbiAgICA/IGNvdW50cnlWYWx1ZXMuZ2V0KHBhcnNlZFBob25lTnVtYmVyLmNvdW50cnlDb2RlKVxuICAgIDogdW5kZWZpbmVkO1xuICBpZiAobGV2ZWwpIHtcbiAgICByZXR1cm4gbGV2ZWw7XG4gIH1cblxuICByZXR1cm4gY291bnRyeVZhbHVlcy5nZXQoJyonKSB8fCBERUZBVUxUX0xFVkVMO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDYW52YXNCbG9iQXNKUEVHKFxuICBpbWFnZTogSFRNTENhbnZhc0VsZW1lbnQsXG4gIGRpbWVuc2lvbnM6IG51bWJlcixcbiAgcXVhbGl0eTogbnVtYmVyXG4pOiBQcm9taXNlPEJsb2I+IHtcbiAgY29uc3QgY2FudmFzID0gbG9hZEltYWdlLnNjYWxlKGltYWdlLCB7XG4gICAgY2FudmFzOiB0cnVlLFxuICAgIG1heEhlaWdodDogZGltZW5zaW9ucyxcbiAgICBtYXhXaWR0aDogZGltZW5zaW9ucyxcbiAgfSk7XG4gIGlmICghKGNhbnZhcyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW1hZ2Ugbm90IGEgY2FudmFzJyk7XG4gIH1cbiAgcmV0dXJuIGNhbnZhc1RvQmxvYihjYW52YXMsIElNQUdFX0pQRUcsIHF1YWxpdHkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2NhbGVJbWFnZVRvTGV2ZWwoXG4gIGZpbGVPckJsb2JPclVSTDogRmlsZSB8IEJsb2IsXG4gIGNvbnRlbnRUeXBlOiBNSU1FVHlwZSxcbiAgc2VuZEFzSGlnaFF1YWxpdHk/OiBib29sZWFuXG4pOiBQcm9taXNlPHtcbiAgYmxvYjogQmxvYjtcbiAgY29udGVudFR5cGU6IE1JTUVUeXBlO1xufT4ge1xuICBsZXQgaW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50O1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBsb2FkSW1hZ2UoZmlsZU9yQmxvYk9yVVJMLCB7XG4gICAgICBjYW52YXM6IHRydWUsXG4gICAgICBvcmllbnRhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgICBpZiAoIShkYXRhLmltYWdlIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ltYWdlIG5vdCBhIGNhbnZhcycpO1xuICAgIH1cbiAgICAoeyBpbWFnZSB9ID0gZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IGVycm9yU3RyaW5nID0gaXNSZWNvcmQoZXJyKSAmJiAnc3RhY2snIGluIGVyciA/IGVyci5zdGFjayA6IGVycjtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICdzY2FsZUltYWdlVG9MZXZlbDogRmFpbGVkIHRvIHByb2Nlc3MgaW1hZ2UnLFxuICAgICAgZXJyb3JTdHJpbmdcbiAgICApO1xuICAgIGVycm9yLm9yaWdpbmFsRXJyb3IgPSBlcnI7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cblxuICBjb25zdCBsZXZlbCA9IHNlbmRBc0hpZ2hRdWFsaXR5XG4gICAgPyBNZWRpYVF1YWxpdHlMZXZlbHMuVGhyZWVcbiAgICA6IGdldE1lZGlhUXVhbGl0eUxldmVsKCk7XG4gIGNvbnN0IHsgbWF4RGltZW5zaW9ucywgcXVhbGl0eSwgc2l6ZSwgdGhyZXNob2xkU2l6ZSB9ID1cbiAgICBNRURJQV9RVUFMSVRZX0xFVkVMX0RBVEEuZ2V0KGxldmVsKSB8fCBERUZBVUxUX0xFVkVMX0RBVEE7XG5cbiAgaWYgKGZpbGVPckJsb2JPclVSTC5zaXplIDw9IHRocmVzaG9sZFNpemUpIHtcbiAgICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzVG9CbG9iKGltYWdlLCBjb250ZW50VHlwZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2IsXG4gICAgICBjb250ZW50VHlwZSxcbiAgICB9O1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBTQ0FMQUJMRV9ESU1FTlNJT05TLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgc2NhbGFibGVEaW1lbnNpb25zID0gU0NBTEFCTEVfRElNRU5TSU9OU1tpXTtcbiAgICBpZiAobWF4RGltZW5zaW9ucyA8IHNjYWxhYmxlRGltZW5zaW9ucykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0aGVzZSBvcGVyYXRpb25zIHRvIGJlIGluIHNlcmlhbFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgY29uc3QgYmxvYiA9IGF3YWl0IGdldENhbnZhc0Jsb2JBc0pQRUcoaW1hZ2UsIHNjYWxhYmxlRGltZW5zaW9ucywgcXVhbGl0eSk7XG4gICAgaWYgKGJsb2Iuc2l6ZSA8PSBzaXplKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBibG9iLFxuICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYmxvYiA9IGF3YWl0IGdldENhbnZhc0Jsb2JBc0pQRUcoaW1hZ2UsIE1JTl9ESU1FTlNJT05TLCBxdWFsaXR5KTtcbiAgcmV0dXJuIHtcbiAgICBibG9iLFxuICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9KUEVHLFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLGdDQUFzQjtBQUd0QixrQkFBMkI7QUFDM0IsMEJBQTZCO0FBQzdCLDBCQUF5QjtBQUN6QixnQ0FBNEI7QUFDNUIsc0JBQXlCO0FBRXpCLElBQUsscUJBQUwsa0JBQUssd0JBQUw7QUFDRSxtREFBTSxLQUFOO0FBQ0EsbURBQU0sS0FBTjtBQUNBLHFEQUFRLEtBQVI7QUFIRztBQUFBO0FBTUwsTUFBTSxnQkFBZ0I7QUFFdEIsTUFBTSxNQUFNLE9BQU87QUFFbkIsTUFBTSxxQkFBcUI7QUFBQSxFQUN6QixlQUFlO0FBQUEsRUFDZixTQUFTO0FBQUEsRUFDVCxNQUFNO0FBQUEsRUFDTixlQUFlLE1BQU07QUFDdkI7QUFFQSxNQUFNLDJCQUEyQixvQkFBSSxJQUFJO0FBQUEsRUFDdkMsQ0FBQyxhQUF3QixrQkFBa0I7QUFBQSxFQUMzQztBQUFBLElBQ0U7QUFBQSxJQUNBO0FBQUEsTUFDRSxlQUFlO0FBQUEsTUFDZixTQUFTO0FBQUEsTUFDVCxNQUFNLE1BQU07QUFBQSxNQUNaLGVBQWUsTUFBTTtBQUFBLElBQ3ZCO0FBQUEsRUFDRjtBQUFBLEVBQ0E7QUFBQSxJQUNFO0FBQUEsSUFDQTtBQUFBLE1BQ0UsZUFBZTtBQUFBLE1BQ2YsU0FBUztBQUFBLE1BQ1QsTUFBTSxNQUFNO0FBQUEsTUFDWixlQUFlLE1BQU07QUFBQSxJQUN2QjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsTUFBTSxzQkFBc0IsQ0FBQyxNQUFNLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFDeEQsTUFBTSxpQkFBaUI7QUFFdkIsNEJBQTRCLFFBQWlEO0FBQzNFLFFBQU0sTUFBTSxvQkFBSSxJQUFnQztBQUNoRCxTQUFPLE1BQU0sR0FBRyxFQUFFLFFBQVEsV0FBUztBQUNqQyxVQUFNLENBQUMsYUFBYSxTQUFTLE1BQU0sTUFBTSxHQUFHO0FBQzVDLFFBQUksSUFDRixhQUNBLE9BQU8sS0FBSyxNQUFNLElBQUksY0FBeUIsV0FDakQ7QUFBQSxFQUNGLENBQUM7QUFDRCxTQUFPO0FBQ1Q7QUFWUyxBQVlULGdDQUFvRDtBQUNsRCxRQUFNLFNBQVMsa0NBQVMsNkJBQTZCO0FBQ3JELE1BQUksQ0FBQyxRQUFRO0FBQ1gsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLE9BQU8sT0FBTyxXQUFXLFFBQVEsS0FBSyxVQUFVO0FBQ3RELE1BQUksQ0FBQyxNQUFNO0FBQ1QsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLG9CQUFvQiwyQ0FBWSxJQUFJO0FBQzFDLE1BQUksQ0FBQyxrQkFBa0IsZUFBZTtBQUNwQyxXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sZ0JBQWdCLG1CQUFtQixNQUFNO0FBRS9DLFFBQU0sUUFBUSxrQkFBa0IsY0FDNUIsY0FBYyxJQUFJLGtCQUFrQixXQUFXLElBQy9DO0FBQ0osTUFBSSxPQUFPO0FBQ1QsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPLGNBQWMsSUFBSSxHQUFHLEtBQUs7QUFDbkM7QUExQlMsQUE0QlQsbUNBQ0UsT0FDQSxZQUNBLFNBQ2U7QUFDZixRQUFNLFNBQVMsa0NBQVUsTUFBTSxPQUFPO0FBQUEsSUFDcEMsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLEVBQ1osQ0FBQztBQUNELE1BQUksQ0FBRSxtQkFBa0Isb0JBQW9CO0FBQzFDLFVBQU0sSUFBSSxNQUFNLG9CQUFvQjtBQUFBLEVBQ3RDO0FBQ0EsU0FBTyxzQ0FBYSxRQUFRLHdCQUFZLE9BQU87QUFDakQ7QUFkZSxBQWdCZixpQ0FDRSxpQkFDQSxhQUNBLG1CQUlDO0FBQ0QsTUFBSTtBQUNKLE1BQUk7QUFDRixVQUFNLE9BQU8sTUFBTSx1Q0FBVSxpQkFBaUI7QUFBQSxNQUM1QyxRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQ0QsUUFBSSxDQUFFLE1BQUssaUJBQWlCLG9CQUFvQjtBQUM5QyxZQUFNLElBQUksTUFBTSxvQkFBb0I7QUFBQSxJQUN0QztBQUNBLElBQUMsR0FBRSxNQUFNLElBQUk7QUFBQSxFQUNmLFNBQVMsS0FBUDtBQUNBLFVBQU0sY0FBYyw4QkFBUyxHQUFHLEtBQUssV0FBVyxNQUFNLElBQUksUUFBUTtBQUNsRSxVQUFNLFFBQVEsSUFBSSxNQUNoQiw4Q0FDQSxXQUNGO0FBQ0EsVUFBTSxnQkFBZ0I7QUFDdEIsVUFBTTtBQUFBLEVBQ1I7QUFFQSxRQUFNLFFBQVEsb0JBQ1YsZ0JBQ0EscUJBQXFCO0FBQ3pCLFFBQU0sRUFBRSxlQUFlLFNBQVMsTUFBTSxrQkFDcEMseUJBQXlCLElBQUksS0FBSyxLQUFLO0FBRXpDLE1BQUksZ0JBQWdCLFFBQVEsZUFBZTtBQUN6QyxVQUFNLFFBQU8sTUFBTSxzQ0FBYSxPQUFPLFdBQVc7QUFDbEQsV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxXQUFTLElBQUksR0FBRyxJQUFJLG9CQUFvQixRQUFRLEtBQUssR0FBRztBQUN0RCxVQUFNLHFCQUFxQixvQkFBb0I7QUFDL0MsUUFBSSxnQkFBZ0Isb0JBQW9CO0FBQ3RDO0FBQUEsSUFDRjtBQUlBLFVBQU0sUUFBTyxNQUFNLG9CQUFvQixPQUFPLG9CQUFvQixPQUFPO0FBQ3pFLFFBQUksTUFBSyxRQUFRLE1BQU07QUFDckIsYUFBTztBQUFBLFFBQ0w7QUFBQSxRQUNBLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxRQUFNLE9BQU8sTUFBTSxvQkFBb0IsT0FBTyxnQkFBZ0IsT0FBTztBQUNyRSxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsYUFBYTtBQUFBLEVBQ2Y7QUFDRjtBQWhFc0IiLAogICJuYW1lcyI6IFtdCn0K
