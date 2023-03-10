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
var sniffImageMimeType_exports = {};
__export(sniffImageMimeType_exports, {
  sniffImageMimeType: () => sniffImageMimeType
});
module.exports = __toCommonJS(sniffImageMimeType_exports);
var import_MIME = require("../types/MIME");
function sniffImageMimeType(bytes) {
  for (let i = 0; i < TYPES.length; i += 1) {
    const type = TYPES[i];
    if (matchesType(bytes, type)) {
      return type.mimeType;
    }
  }
  return void 0;
}
const TYPES = [
  {
    mimeType: import_MIME.IMAGE_ICO,
    bytePattern: new Uint8Array([0, 0, 1, 0])
  },
  {
    mimeType: import_MIME.IMAGE_ICO,
    bytePattern: new Uint8Array([0, 0, 2, 0])
  },
  {
    mimeType: import_MIME.IMAGE_BMP,
    bytePattern: new Uint8Array([66, 77])
  },
  {
    mimeType: import_MIME.IMAGE_GIF,
    bytePattern: new Uint8Array([71, 73, 70, 56, 55, 97])
  },
  {
    mimeType: import_MIME.IMAGE_GIF,
    bytePattern: new Uint8Array([71, 73, 70, 56, 57, 97])
  },
  {
    mimeType: import_MIME.IMAGE_WEBP,
    bytePattern: new Uint8Array([
      82,
      73,
      70,
      70,
      0,
      0,
      0,
      0,
      87,
      69,
      66,
      80,
      86,
      80
    ]),
    patternMask: new Uint8Array([
      255,
      255,
      255,
      255,
      0,
      0,
      0,
      0,
      255,
      255,
      255,
      255,
      255,
      255
    ])
  },
  {
    mimeType: import_MIME.IMAGE_PNG,
    bytePattern: new Uint8Array([
      137,
      80,
      78,
      71,
      13,
      10,
      26,
      10
    ])
  },
  {
    mimeType: import_MIME.IMAGE_JPEG,
    bytePattern: new Uint8Array([255, 216, 255])
  }
];
function matchesType(input, type) {
  if (input.byteLength < type.bytePattern.byteLength) {
    return false;
  }
  for (let p = 0; p < type.bytePattern.length; p += 1) {
    const mask = type.patternMask ? type.patternMask[p] : 255;
    const maskedData = input[p] & mask;
    if (maskedData !== type.bytePattern[p]) {
      return false;
    }
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sniffImageMimeType
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic25pZmZJbWFnZU1pbWVUeXBlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBNSU1FVHlwZSB9IGZyb20gJy4uL3R5cGVzL01JTUUnO1xuaW1wb3J0IHtcbiAgSU1BR0VfQk1QLFxuICBJTUFHRV9HSUYsXG4gIElNQUdFX0lDTyxcbiAgSU1BR0VfSlBFRyxcbiAgSU1BR0VfUE5HLFxuICBJTUFHRV9XRUJQLFxufSBmcm9tICcuLi90eXBlcy9NSU1FJztcblxuLyoqXG4gKiBUaGlzIGZvbGxvd3MgdGhlIFtNSU1FIFNuaWZmaW5nIFN0YW5kYXJkIGZvciBpbWFnZXNdWzBdLlxuICpcbiAqIFswXTogaHR0cHM6Ly9taW1lc25pZmYuc3BlYy53aGF0d2cub3JnLyNtYXRjaGluZy1hbi1pbWFnZS10eXBlLXBhdHRlcm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNuaWZmSW1hZ2VNaW1lVHlwZShieXRlczogVWludDhBcnJheSk6IHVuZGVmaW5lZCB8IE1JTUVUeXBlIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBUWVBFUy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IHR5cGUgPSBUWVBFU1tpXTtcbiAgICBpZiAobWF0Y2hlc1R5cGUoYnl0ZXMsIHR5cGUpKSB7XG4gICAgICByZXR1cm4gdHlwZS5taW1lVHlwZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxudHlwZSBUeXBlID0ge1xuICBtaW1lVHlwZTogTUlNRVR5cGU7XG4gIGJ5dGVQYXR0ZXJuOiBVaW50OEFycmF5O1xuICBwYXR0ZXJuTWFzaz86IFVpbnQ4QXJyYXk7XG59O1xuY29uc3QgVFlQRVM6IEFycmF5PFR5cGU+ID0gW1xuICB7XG4gICAgbWltZVR5cGU6IElNQUdFX0lDTyxcbiAgICBieXRlUGF0dGVybjogbmV3IFVpbnQ4QXJyYXkoWzB4MDAsIDB4MDAsIDB4MDEsIDB4MDBdKSxcbiAgfSxcbiAge1xuICAgIG1pbWVUeXBlOiBJTUFHRV9JQ08sXG4gICAgYnl0ZVBhdHRlcm46IG5ldyBVaW50OEFycmF5KFsweDAwLCAweDAwLCAweDAyLCAweDAwXSksXG4gIH0sXG4gIHtcbiAgICBtaW1lVHlwZTogSU1BR0VfQk1QLFxuICAgIGJ5dGVQYXR0ZXJuOiBuZXcgVWludDhBcnJheShbMHg0MiwgMHg0ZF0pLFxuICB9LFxuICB7XG4gICAgbWltZVR5cGU6IElNQUdFX0dJRixcbiAgICBieXRlUGF0dGVybjogbmV3IFVpbnQ4QXJyYXkoWzB4NDcsIDB4NDksIDB4NDYsIDB4MzgsIDB4MzcsIDB4NjFdKSxcbiAgfSxcbiAge1xuICAgIG1pbWVUeXBlOiBJTUFHRV9HSUYsXG4gICAgYnl0ZVBhdHRlcm46IG5ldyBVaW50OEFycmF5KFsweDQ3LCAweDQ5LCAweDQ2LCAweDM4LCAweDM5LCAweDYxXSksXG4gIH0sXG4gIHtcbiAgICBtaW1lVHlwZTogSU1BR0VfV0VCUCxcbiAgICBieXRlUGF0dGVybjogbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMHg1MiwgMHg0OSwgMHg0NiwgMHg0NiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHg1NywgMHg0NSwgMHg0MiwgMHg1MCxcbiAgICAgIDB4NTYsIDB4NTAsXG4gICAgXSksXG4gICAgcGF0dGVybk1hc2s6IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIDB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmYsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmYsXG4gICAgICAweGZmLCAweGZmLFxuICAgIF0pLFxuICB9LFxuICB7XG4gICAgbWltZVR5cGU6IElNQUdFX1BORyxcbiAgICBieXRlUGF0dGVybjogbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMHg4OSwgMHg1MCwgMHg0ZSwgMHg0NywgMHgwZCwgMHgwYSwgMHgxYSwgMHgwYSxcbiAgICBdKSxcbiAgfSxcbiAge1xuICAgIG1pbWVUeXBlOiBJTUFHRV9KUEVHLFxuICAgIGJ5dGVQYXR0ZXJuOiBuZXcgVWludDhBcnJheShbMHhmZiwgMHhkOCwgMHhmZl0pLFxuICB9LFxuXTtcblxuLy8gVGhpcyBmb2xsb3dzIHRoZSBbcGF0dGVybiBtYXRjaGluZyBhbGdvcml0aG0gaW4gdGhlIHNwZWNdWzFdLlxuLy8gWzFdOiBodHRwczovL21pbWVzbmlmZi5zcGVjLndoYXR3Zy5vcmcvI3BhdHRlcm4tbWF0Y2hpbmctYWxnb3JpdGhtXG5mdW5jdGlvbiBtYXRjaGVzVHlwZShpbnB1dDogVWludDhBcnJheSwgdHlwZTogVHlwZSk6IGJvb2xlYW4ge1xuICBpZiAoaW5wdXQuYnl0ZUxlbmd0aCA8IHR5cGUuYnl0ZVBhdHRlcm4uYnl0ZUxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAobGV0IHAgPSAwOyBwIDwgdHlwZS5ieXRlUGF0dGVybi5sZW5ndGg7IHAgKz0gMSkge1xuICAgIGNvbnN0IG1hc2sgPSB0eXBlLnBhdHRlcm5NYXNrID8gdHlwZS5wYXR0ZXJuTWFza1twXSA6IDB4ZmY7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYSBiaXR3aXNlIG9wZXJhdG9yIGhlcmUsIHBlciB0aGUgc3BlYy5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIGNvbnN0IG1hc2tlZERhdGEgPSBpbnB1dFtwXSAmIG1hc2s7XG4gICAgaWYgKG1hc2tlZERhdGEgIT09IHR5cGUuYnl0ZVBhdHRlcm5bcF0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxrQkFPTztBQU9BLDRCQUE0QixPQUF5QztBQUMxRSxXQUFTLElBQUksR0FBRyxJ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
