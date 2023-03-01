var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var MIME_exports = {};
__export(MIME_exports, {
  APPLICATION_JSON: () => APPLICATION_JSON,
  APPLICATION_OCTET_STREAM: () => APPLICATION_OCTET_STREAM,
  AUDIO_AAC: () => AUDIO_AAC,
  AUDIO_MP3: () => AUDIO_MP3,
  IMAGE_BMP: () => IMAGE_BMP,
  IMAGE_GIF: () => IMAGE_GIF,
  IMAGE_ICO: () => IMAGE_ICO,
  IMAGE_JPEG: () => IMAGE_JPEG,
  IMAGE_PNG: () => IMAGE_PNG,
  IMAGE_WEBP: () => IMAGE_WEBP,
  LONG_MESSAGE: () => LONG_MESSAGE,
  MIMETypeToString: () => MIMETypeToString,
  TEXT_ATTACHMENT: () => TEXT_ATTACHMENT,
  VIDEO_MP4: () => VIDEO_MP4,
  VIDEO_QUICKTIME: () => VIDEO_QUICKTIME,
  isAudio: () => isAudio,
  isGif: () => isGif,
  isHeic: () => isHeic,
  isImage: () => isImage,
  isJPEG: () => isJPEG,
  isLongMessage: () => isLongMessage,
  isVideo: () => isVideo,
  stringToMIMEType: () => stringToMIMEType
});
module.exports = __toCommonJS(MIME_exports);
const stringToMIMEType = /* @__PURE__ */ __name((value) => {
  return value;
}, "stringToMIMEType");
const MIMETypeToString = /* @__PURE__ */ __name((value) => {
  return value;
}, "MIMETypeToString");
const APPLICATION_OCTET_STREAM = stringToMIMEType("application/octet-stream");
const APPLICATION_JSON = stringToMIMEType("application/json");
const AUDIO_AAC = stringToMIMEType("audio/aac");
const AUDIO_MP3 = stringToMIMEType("audio/mp3");
const IMAGE_GIF = stringToMIMEType("image/gif");
const IMAGE_JPEG = stringToMIMEType("image/jpeg");
const IMAGE_PNG = stringToMIMEType("image/png");
const IMAGE_WEBP = stringToMIMEType("image/webp");
const IMAGE_ICO = stringToMIMEType("image/x-icon");
const IMAGE_BMP = stringToMIMEType("image/bmp");
const VIDEO_MP4 = stringToMIMEType("video/mp4");
const VIDEO_QUICKTIME = stringToMIMEType("video/quicktime");
const LONG_MESSAGE = stringToMIMEType("text/x-signal-plain");
const TEXT_ATTACHMENT = stringToMIMEType("text/x-signal-story");
const isHeic = /* @__PURE__ */ __name((value, fileName) => value === "image/heic" || value === "image/heif" || fileName.endsWith(".heic") || fileName.endsWith(".heif"), "isHeic");
const isGif = /* @__PURE__ */ __name((value) => value === "image/gif", "isGif");
const isJPEG = /* @__PURE__ */ __name((value) => value === "image/jpeg", "isJPEG");
const isImage = /* @__PURE__ */ __name((value) => Boolean(value) && value.startsWith("image/"), "isImage");
const isVideo = /* @__PURE__ */ __name((value) => Boolean(value) && value.startsWith("video/"), "isVideo");
const isAudio = /* @__PURE__ */ __name((value) => Boolean(value) && value.startsWith("audio/") && !value.endsWith("aiff"), "isAudio");
const isLongMessage = /* @__PURE__ */ __name((value) => value === LONG_MESSAGE, "isLongMessage");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APPLICATION_JSON,
  APPLICATION_OCTET_STREAM,
  AUDIO_AAC,
  AUDIO_MP3,
  IMAGE_BMP,
  IMAGE_GIF,
  IMAGE_ICO,
  IMAGE_JPEG,
  IMAGE_PNG,
  IMAGE_WEBP,
  LONG_MESSAGE,
  MIMETypeToString,
  TEXT_ATTACHMENT,
  VIDEO_MP4,
  VIDEO_QUICKTIME,
  isAudio,
  isGif,
  isHeic,
  isImage,
  isJPEG,
  isLongMessage,
  isVideo,
  stringToMIMEType
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTUlNRS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmV4cG9ydCB0eXBlIE1JTUVUeXBlID0gc3RyaW5nICYgeyBfbWltZVR5cGVCcmFuZDogbmV2ZXIgfTtcblxuZXhwb3J0IGNvbnN0IHN0cmluZ1RvTUlNRVR5cGUgPSAodmFsdWU6IHN0cmluZyk6IE1JTUVUeXBlID0+IHtcbiAgcmV0dXJuIHZhbHVlIGFzIE1JTUVUeXBlO1xufTtcbmV4cG9ydCBjb25zdCBNSU1FVHlwZVRvU3RyaW5nID0gKHZhbHVlOiBNSU1FVHlwZSk6IHN0cmluZyA9PiB7XG4gIHJldHVybiB2YWx1ZSBhcyBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgQVBQTElDQVRJT05fT0NURVRfU1RSRUFNID0gc3RyaW5nVG9NSU1FVHlwZShcbiAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbik7XG5leHBvcnQgY29uc3QgQVBQTElDQVRJT05fSlNPTiA9IHN0cmluZ1RvTUlNRVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbmV4cG9ydCBjb25zdCBBVURJT19BQUMgPSBzdHJpbmdUb01JTUVUeXBlKCdhdWRpby9hYWMnKTtcbmV4cG9ydCBjb25zdCBBVURJT19NUDMgPSBzdHJpbmdUb01JTUVUeXBlKCdhdWRpby9tcDMnKTtcbmV4cG9ydCBjb25zdCBJTUFHRV9HSUYgPSBzdHJpbmdUb01JTUVUeXBlKCdpbWFnZS9naWYnKTtcbmV4cG9ydCBjb25zdCBJTUFHRV9KUEVHID0gc3RyaW5nVG9NSU1FVHlwZSgnaW1hZ2UvanBlZycpO1xuZXhwb3J0IGNvbnN0IElNQUdFX1BORyA9IHN0cmluZ1RvTUlNRVR5cGUoJ2ltYWdlL3BuZycpO1xuZXhwb3J0IGNvbnN0IElNQUdFX1dFQlAgPSBzdHJpbmdUb01JTUVUeXBlKCdpbWFnZS93ZWJwJyk7XG5leHBvcnQgY29uc3QgSU1BR0VfSUNPID0gc3RyaW5nVG9NSU1FVHlwZSgnaW1hZ2UveC1pY29uJyk7XG5leHBvcnQgY29uc3QgSU1BR0VfQk1QID0gc3RyaW5nVG9NSU1FVHlwZSgnaW1hZ2UvYm1wJyk7XG5leHBvcnQgY29uc3QgVklERU9fTVA0ID0gc3RyaW5nVG9NSU1FVHlwZSgndmlkZW8vbXA0Jyk7XG5leHBvcnQgY29uc3QgVklERU9fUVVJQ0tUSU1FID0gc3RyaW5nVG9NSU1FVHlwZSgndmlkZW8vcXVpY2t0aW1lJyk7XG5leHBvcnQgY29uc3QgTE9OR19NRVNTQUdFID0gc3RyaW5nVG9NSU1FVHlwZSgndGV4dC94LXNpZ25hbC1wbGFpbicpO1xuZXhwb3J0IGNvbnN0IFRFWFRfQVRUQUNITUVOVCA9IHN0cmluZ1RvTUlNRVR5cGUoJ3RleHQveC1zaWduYWwtc3RvcnknKTtcblxuZXhwb3J0IGNvbnN0IGlzSGVpYyA9ICh2YWx1ZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PlxuICB2YWx1ZSA9PT0gJ2ltYWdlL2hlaWMnIHx8XG4gIHZhbHVlID09PSAnaW1hZ2UvaGVpZicgfHxcbiAgZmlsZU5hbWUuZW5kc1dpdGgoJy5oZWljJykgfHxcbiAgZmlsZU5hbWUuZW5kc1dpdGgoJy5oZWlmJyk7XG5leHBvcnQgY29uc3QgaXNHaWYgPSAodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIE1JTUVUeXBlID0+XG4gIHZhbHVlID09PSAnaW1hZ2UvZ2lmJztcbmV4cG9ydCBjb25zdCBpc0pQRUcgPSAodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIE1JTUVUeXBlID0+XG4gIHZhbHVlID09PSAnaW1hZ2UvanBlZyc7XG5leHBvcnQgY29uc3QgaXNJbWFnZSA9ICh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgTUlNRVR5cGUgPT5cbiAgQm9vbGVhbih2YWx1ZSkgJiYgdmFsdWUuc3RhcnRzV2l0aCgnaW1hZ2UvJyk7XG5leHBvcnQgY29uc3QgaXNWaWRlbyA9ICh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgTUlNRVR5cGUgPT5cbiAgQm9vbGVhbih2YWx1ZSkgJiYgdmFsdWUuc3RhcnRzV2l0aCgndmlkZW8vJyk7XG4vLyBBcyBvZiAyMDIwLTA0LTE2IGFpZiBmaWxlcyBkbyBub3QgcGxheSBpbiBFbGVjdHJvbiBub3IgQ2hyb21lLiBXZSBzaG91bGQgb25seVxuLy8gcmVjb2duaXplIHRoZW0gYXMgZmlsZSBhdHRhY2htZW50cy5cbmV4cG9ydCBjb25zdCBpc0F1ZGlvID0gKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBNSU1FVHlwZSA9PlxuICBCb29sZWFuKHZhbHVlKSAmJiB2YWx1ZS5zdGFydHNXaXRoKCdhdWRpby8nKSAmJiAhdmFsdWUuZW5kc1dpdGgoJ2FpZmYnKTtcbmV4cG9ydCBjb25zdCBpc0xvbmdNZXNzYWdlID0gKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTUlNRVR5cGUgPT5cbiAgdmFsdWUgPT09IExPTkdfTUVTU0FHRTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtPLE1BQU0sbUJBQW1CLHdCQUFDLFVBQTRCO0FBQzNELFNBQU87QUFDVCxHQUZnQztBQUd6QixNQUFNLG1CQUFtQix3QkFBQyxVQUE0QjtBQUMzRCxTQUFPO0FBQ1QsR0FGZ0M7QUFJekIsTUFBTSwyQkFBMkIsaUJBQ3RDLDBCQUNGO0FBQ08sTUFBTSxtQkFBbUIsaUJBQWlCLGtCQUFrQjtBQUM1RCxNQUFNLFlBQVksaUJBQWlCLFdBQVc7QUFDOUMsTUFBTSxZQUFZLGlCQUFpQixXQUFXO0FBQzlDLE1BQU0sWUFBWSxpQkFBaUIsV0FBVztBQUM5QyxNQUFNLGFBQWEsaUJBQWlCLFlBQVk7QUFDaEQsTUFBTSxZQUFZLGlCQUFpQixXQUFXO0FBQzlDLE1BQU0sYUFBYSxpQkFBaUIsWUFBWTtBQUNoRCxNQUFNLFlBQVksaUJBQWlCLGNBQWM7QUFDakQsTUFBTSxZQUFZLGlCQUFpQixXQUFXO0FBQzlDLE1BQU0sWUFBWSxpQkFBaUIsV0FBVztBQUM5QyxNQUFNLGtCQUFrQixpQkFBaUIsaUJBQWlCO0FBQzFELE1BQU0sZUFBZSxpQkFBaUIscUJBQXFCO0FBQzNELE1BQU0sa0JBQWtCLGlCQUFpQixxQkFBcUI7QUFFOUQsTUFBTSxTQUFTLHdCQUFDLE9BQWUsYUFDcEMsVUFBVSxnQkFDVixVQUFVLGdCQUNWLFNBQVMsU0FBUyxPQUFPLEtBQ3pCLFNBQVMsU0FBUyxPQUFPLEdBSkw7QUFLZixNQUFNLFFBQVEsd0JBQUMsVUFDcEIsVUFBVSxhQURTO0FBRWQsTUFBTSxTQUFTLHdCQUFDLFVBQ3JCLFVBQVUsY0FEVTtBQUVmLE1BQU0sVUFBVSx3QkFBQyxVQUN0QixRQUFRLEtBQUssS0FBSyxNQUFNLFdBQVcsUUFBUSxHQUR0QjtBQUVoQixNQUFNLFVBQVUsd0JBQUMsVUFDdEIsUUFBUSxLQUFLLEtBQUssTUFBTSxXQUFXLFFBQVEsR0FEdEI7QUFJaEIsTUFBTSxVQUFVLHdCQUFDLFVBQ3RCLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxRQUFRLEtBQUssQ0FBQyxNQUFNLFNBQVMsTUFBTSxHQURqRDtBQUVoQixNQUFNLGdCQUFnQix3QkFBQyxVQUM1QixVQUFVLGNBRGlCOyIsCiAgIm5hbWVzIjogW10KfQo=
