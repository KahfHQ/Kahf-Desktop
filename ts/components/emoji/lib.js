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
var lib_exports = {};
__export(lib_exports, {
  convertShortName: () => convertShortName,
  convertShortNameToData: () => convertShortNameToData,
  dataByCategory: () => dataByCategory,
  emojiToData: () => emojiToData,
  emojiToImage: () => emojiToImage,
  getEmojiCount: () => getEmojiCount,
  getEmojiData: () => getEmojiData,
  getImagePath: () => getImagePath,
  getSizeClass: () => getSizeClass,
  isShortName: () => isShortName,
  preloadImages: () => preloadImages,
  search: () => search,
  skinTones: () => skinTones,
  unifiedToEmoji: () => unifiedToEmoji
});
module.exports = __toCommonJS(lib_exports);
var import_emoji_datasource = __toESM(require("emoji-datasource"));
var import_emoji_regex = __toESM(require("emoji-regex"));
var import_lodash = require("lodash");
var import_fuse = __toESM(require("fuse.js"));
var import_p_queue = __toESM(require("p-queue"));
var import_is = __toESM(require("@sindresorhus/is"));
var import_getOwn = require("../../util/getOwn");
var log = __toESM(require("../../logging/log"));
var import_durations = require("../../util/durations");
const skinTones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"];
const data = import_emoji_datasource.default.filter((emoji) => emoji.has_img_apple).map((emoji) => emoji.category === "People & Body" ? { ...emoji, sort_order: emoji.sort_order + 1e3 } : emoji);
const ROOT_PATH = (0, import_lodash.get)(typeof window !== "undefined" ? window : null, "ROOT_PATH", "");
const makeImagePath = /* @__PURE__ */ __name((src) => {
  return `${ROOT_PATH}node_modules/emoji-datasource-apple/img/apple/64/${src}`;
}, "makeImagePath");
const imageQueue = new import_p_queue.default({
  concurrency: 10,
  timeout: import_durations.MINUTE * 30,
  throwOnTimeout: true
});
const images = /* @__PURE__ */ new Set();
const preloadImages = /* @__PURE__ */ __name(async () => {
  const preload = /* @__PURE__ */ __name(async (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
    images.add(img);
    setTimeout(reject, 5e3);
  }), "preload");
  log.info("Preloading emoji images");
  const start = Date.now();
  data.forEach((emoji) => {
    imageQueue.add(() => preload(makeImagePath(emoji.image)));
    if (emoji.skin_variations) {
      Object.values(emoji.skin_variations).forEach((variation) => {
        imageQueue.add(() => preload(makeImagePath(variation.image)));
      });
    }
  });
  await imageQueue.onEmpty();
  const end = Date.now();
  log.info(`Done preloading emoji images in ${end - start}ms`);
}, "preloadImages");
const dataByShortName = (0, import_lodash.keyBy)(data, "short_name");
const imageByEmoji = {};
const dataByEmoji = {};
const dataByCategory = (0, import_lodash.mapValues)((0, import_lodash.groupBy)(data, ({ category }) => {
  if (category === "Activities") {
    return "activity";
  }
  if (category === "Animals & Nature") {
    return "animal";
  }
  if (category === "Flags") {
    return "flag";
  }
  if (category === "Food & Drink") {
    return "food";
  }
  if (category === "Objects") {
    return "object";
  }
  if (category === "Travel & Places") {
    return "travel";
  }
  if (category === "Smileys & Emotion") {
    return "emoji";
  }
  if (category === "People & Body") {
    return "emoji";
  }
  if (category === "Symbols") {
    return "symbol";
  }
  return "misc";
}), (arr) => (0, import_lodash.sortBy)(arr, "sort_order"));
function getEmojiData(shortName, skinTone) {
  const base = dataByShortName[shortName];
  if (skinTone && base.skin_variations) {
    const variation = (0, import_lodash.isNumber)(skinTone) ? skinTones[skinTone - 1] : skinTone;
    if (base.skin_variations[variation]) {
      return base.skin_variations[variation];
    }
    return base.skin_variations[`${variation}-${variation}`];
  }
  return base;
}
function getImagePath(shortName, skinTone) {
  const emojiData = getEmojiData(shortName, skinTone);
  return makeImagePath(emojiData.image);
}
const fuse = new import_fuse.default(data, {
  shouldSort: true,
  threshold: 0.2,
  minMatchCharLength: 1,
  keys: ["short_name", "name"]
});
function search(query, count = 0) {
  const results = fuse.search(query.substr(0, 32)).map((result) => result.item);
  if (count) {
    return (0, import_lodash.take)(results, count);
  }
  return results;
}
const shortNames = /* @__PURE__ */ new Set([
  ...(0, import_lodash.map)(data, "short_name"),
  ...(0, import_lodash.compact)((0, import_lodash.flatMap)(data, "short_names"))
]);
function isShortName(name) {
  return shortNames.has(name);
}
function unifiedToEmoji(unified) {
  return unified.split("-").map((c) => String.fromCodePoint(parseInt(c, 16))).join("");
}
function convertShortNameToData(shortName, skinTone = 0) {
  const base = dataByShortName[shortName];
  if (!base) {
    return void 0;
  }
  const toneKey = import_is.default.number(skinTone) ? skinTones[skinTone - 1] : skinTone;
  if (skinTone && base.skin_variations) {
    const variation = base.skin_variations[toneKey];
    if (variation) {
      return {
        ...base,
        ...variation
      };
    }
  }
  return base;
}
function convertShortName(shortName, skinTone = 0) {
  const emojiData = convertShortNameToData(shortName, skinTone);
  if (!emojiData) {
    return "";
  }
  return unifiedToEmoji(emojiData.unified);
}
function emojiToImage(emoji) {
  return (0, import_getOwn.getOwn)(imageByEmoji, emoji);
}
function emojiToData(emoji) {
  return (0, import_getOwn.getOwn)(dataByEmoji, emoji);
}
function getEmojiCount(str) {
  const regex = (0, import_emoji_regex.default)();
  let match = regex.exec(str);
  let count = 0;
  if (!regex.global) {
    return match ? 1 : 0;
  }
  while (match) {
    count += 1;
    match = regex.exec(str);
  }
  return count;
}
function getSizeClass(str) {
  if (str.replace((0, import_emoji_regex.default)(), "").trim().length > 0) {
    return "";
  }
  const emojiCount = getEmojiCount(str);
  if (emojiCount === 1) {
    return "max";
  }
  if (emojiCount === 2) {
    return "extra-large";
  }
  if (emojiCount === 3) {
    return "large";
  }
  if (emojiCount === 4) {
    return "medium";
  }
  if (emojiCount === 5) {
    return "small";
  }
  return "";
}
data.forEach((emoji) => {
  const { short_name, short_names, skin_variations, image } = emoji;
  if (short_names) {
    short_names.forEach((name) => {
      dataByShortName[name] = emoji;
    });
  }
  imageByEmoji[convertShortName(short_name)] = makeImagePath(image);
  dataByEmoji[convertShortName(short_name)] = emoji;
  if (skin_variations) {
    Object.entries(skin_variations).forEach(([tone, variation]) => {
      imageByEmoji[convertShortName(short_name, tone)] = makeImagePath(variation.image);
      dataByEmoji[convertShortName(short_name, tone)] = emoji;
    });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertShortName,
  convertShortNameToData,
  dataByCategory,
  emojiToData,
  emojiToImage,
  getEmojiCount,
  getEmojiData,
  getImagePath,
  getSizeClass,
  isShortName,
  preloadImages,
  search,
  skinTones,
  unifiedToEmoji
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGliLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLy8gQ2FtZWxjYXNlIGRpc2FibGVkIGR1ZSB0byBlbW9qaS1kYXRhc291cmNlIHVzaW5nIHNuYWtlX2Nhc2Vcbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuaW1wb3J0IHVudHlwZWREYXRhIGZyb20gJ2Vtb2ppLWRhdGFzb3VyY2UnO1xuaW1wb3J0IGVtb2ppUmVnZXggZnJvbSAnZW1vamktcmVnZXgnO1xuaW1wb3J0IHtcbiAgY29tcGFjdCxcbiAgZmxhdE1hcCxcbiAgZ2V0LFxuICBncm91cEJ5LFxuICBpc051bWJlcixcbiAga2V5QnksXG4gIG1hcCxcbiAgbWFwVmFsdWVzLFxuICBzb3J0QnksXG4gIHRha2UsXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgRnVzZSBmcm9tICdmdXNlLmpzJztcbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5pbXBvcnQgaXMgZnJvbSAnQHNpbmRyZXNvcmh1cy9pcyc7XG5pbXBvcnQgeyBnZXRPd24gfSBmcm9tICcuLi8uLi91dGlsL2dldE93bic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgTUlOVVRFIH0gZnJvbSAnLi4vLi4vdXRpbC9kdXJhdGlvbnMnO1xuXG5leHBvcnQgY29uc3Qgc2tpblRvbmVzID0gWycxRjNGQicsICcxRjNGQycsICcxRjNGRCcsICcxRjNGRScsICcxRjNGRiddO1xuXG5leHBvcnQgdHlwZSBTa2luVG9uZUtleSA9ICcxRjNGQicgfCAnMUYzRkMnIHwgJzFGM0ZEJyB8ICcxRjNGRScgfCAnMUYzRkYnO1xuZXhwb3J0IHR5cGUgU2l6ZUNsYXNzVHlwZSA9XG4gIHwgJydcbiAgfCAnc21hbGwnXG4gIHwgJ21lZGl1bSdcbiAgfCAnbGFyZ2UnXG4gIHwgJ2V4dHJhLWxhcmdlJ1xuICB8ICdtYXgnO1xuXG5leHBvcnQgdHlwZSBFbW9qaVNraW5WYXJpYXRpb24gPSB7XG4gIHVuaWZpZWQ6IHN0cmluZztcbiAgbm9uX3F1YWxpZmllZDogbnVsbDtcbiAgaW1hZ2U6IHN0cmluZztcbiAgc2hlZXRfeDogbnVtYmVyO1xuICBzaGVldF95OiBudW1iZXI7XG4gIGFkZGVkX2luOiBzdHJpbmc7XG4gIGhhc19pbWdfYXBwbGU6IGJvb2xlYW47XG4gIGhhc19pbWdfZ29vZ2xlOiBib29sZWFuO1xuICBoYXNfaW1nX3R3aXR0ZXI6IGJvb2xlYW47XG4gIGhhc19pbWdfZW1vamlvbmU6IGJvb2xlYW47XG4gIGhhc19pbWdfZmFjZWJvb2s6IGJvb2xlYW47XG4gIGhhc19pbWdfbWVzc2VuZ2VyOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgRW1vamlEYXRhID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHVuaWZpZWQ6IHN0cmluZztcbiAgbm9uX3F1YWxpZmllZDogc3RyaW5nIHwgbnVsbDtcbiAgZG9jb21vOiBzdHJpbmcgfCBudWxsO1xuICBhdTogc3RyaW5nIHwgbnVsbDtcbiAgc29mdGJhbms6IHN0cmluZyB8IG51bGw7XG4gIGdvb2dsZTogc3RyaW5nIHwgbnVsbDtcbiAgaW1hZ2U6IHN0cmluZztcbiAgc2hlZXRfeDogbnVtYmVyO1xuICBzaGVldF95OiBudW1iZXI7XG4gIHNob3J0X25hbWU6IHN0cmluZztcbiAgc2hvcnRfbmFtZXM6IEFycmF5PHN0cmluZz47XG4gIHRleHQ6IHN0cmluZyB8IG51bGw7XG4gIHRleHRzOiBBcnJheTxzdHJpbmc+IHwgbnVsbDtcbiAgY2F0ZWdvcnk6IHN0cmluZztcbiAgc29ydF9vcmRlcjogbnVtYmVyO1xuICBhZGRlZF9pbjogc3RyaW5nO1xuICBoYXNfaW1nX2FwcGxlOiBib29sZWFuO1xuICBoYXNfaW1nX2dvb2dsZTogYm9vbGVhbjtcbiAgaGFzX2ltZ190d2l0dGVyOiBib29sZWFuO1xuICBoYXNfaW1nX2ZhY2Vib29rOiBib29sZWFuO1xuICBza2luX3ZhcmlhdGlvbnM/OiB7XG4gICAgW2tleTogc3RyaW5nXTogRW1vamlTa2luVmFyaWF0aW9uO1xuICB9O1xufTtcblxuY29uc3QgZGF0YSA9ICh1bnR5cGVkRGF0YSBhcyBBcnJheTxFbW9qaURhdGE+KVxuICAuZmlsdGVyKGVtb2ppID0+IGVtb2ppLmhhc19pbWdfYXBwbGUpXG4gIC5tYXAoZW1vamkgPT5cbiAgICAvLyBXaHkgdGhpcyB3ZWlyZCBtYXA/XG4gICAgLy8gdGhlIGVtb2ppIGRhdGFzZXQgaGFzIHR3byBzZXBhcmF0ZSBjYXRlZ29yaWVzIGZvciBFbW90aW9ucyBhbmQgUGVvcGxlXG4gICAgLy8geWV0IGluIG91ciBVSSB3ZSBkaXNwbGF5IHRoZXNlIGFzIGEgc2luZ2xlIG1lcmdlZCBjYXRlZ29yeS4gSW4gb3JkZXJcbiAgICAvLyBmb3IgdGhlIGVtb2ppcyB0byBiZSBzb3J0ZWQgcHJvcGVybHkgd2UncmUgbWFudWFsbHkgaW5jcmVtZW50aW5nIHRoZVxuICAgIC8vIHNvcnRfb3JkZXIgZm9yIHRoZSBQZW9wbGUgJiBCb2R5IGVtb2ppcyBzbyB0aGF0IHRoZXkgZmFsbCBiZWxvdyB0aGVcbiAgICAvLyBTbWlsZXkgJiBFbW90aW9ucyBjYXRlZ29yeS5cbiAgICBlbW9qaS5jYXRlZ29yeSA9PT0gJ1Blb3BsZSAmIEJvZHknXG4gICAgICA/IHsgLi4uZW1vamksIHNvcnRfb3JkZXI6IGVtb2ppLnNvcnRfb3JkZXIgKyAxMDAwIH1cbiAgICAgIDogZW1vamlcbiAgKTtcblxuY29uc3QgUk9PVF9QQVRIID0gZ2V0KFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IG51bGwsXG4gICdST09UX1BBVEgnLFxuICAnJ1xuKTtcblxuY29uc3QgbWFrZUltYWdlUGF0aCA9IChzcmM6IHN0cmluZykgPT4ge1xuICByZXR1cm4gYCR7Uk9PVF9QQVRIfW5vZGVfbW9kdWxlcy9lbW9qaS1kYXRhc291cmNlLWFwcGxlL2ltZy9hcHBsZS82NC8ke3NyY31gO1xufTtcblxuY29uc3QgaW1hZ2VRdWV1ZSA9IG5ldyBQUXVldWUoe1xuICBjb25jdXJyZW5jeTogMTAsXG4gIHRpbWVvdXQ6IE1JTlVURSAqIDMwLFxuICB0aHJvd09uVGltZW91dDogdHJ1ZSxcbn0pO1xuY29uc3QgaW1hZ2VzID0gbmV3IFNldCgpO1xuXG5leHBvcnQgY29uc3QgcHJlbG9hZEltYWdlcyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgLy8gUHJlbG9hZCBpbWFnZXNcbiAgY29uc3QgcHJlbG9hZCA9IGFzeW5jIChzcmM6IHN0cmluZykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5vbmxvYWQgPSByZXNvbHZlO1xuICAgICAgaW1nLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgaW1hZ2VzLmFkZChpbWcpO1xuICAgICAgc2V0VGltZW91dChyZWplY3QsIDUwMDApO1xuICAgIH0pO1xuXG4gIGxvZy5pbmZvKCdQcmVsb2FkaW5nIGVtb2ppIGltYWdlcycpO1xuICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG5cbiAgZGF0YS5mb3JFYWNoKGVtb2ppID0+IHtcbiAgICBpbWFnZVF1ZXVlLmFkZCgoKSA9PiBwcmVsb2FkKG1ha2VJbWFnZVBhdGgoZW1vamkuaW1hZ2UpKSk7XG5cbiAgICBpZiAoZW1vamkuc2tpbl92YXJpYXRpb25zKSB7XG4gICAgICBPYmplY3QudmFsdWVzKGVtb2ppLnNraW5fdmFyaWF0aW9ucykuZm9yRWFjaCh2YXJpYXRpb24gPT4ge1xuICAgICAgICBpbWFnZVF1ZXVlLmFkZCgoKSA9PiBwcmVsb2FkKG1ha2VJbWFnZVBhdGgodmFyaWF0aW9uLmltYWdlKSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBhd2FpdCBpbWFnZVF1ZXVlLm9uRW1wdHkoKTtcblxuICBjb25zdCBlbmQgPSBEYXRlLm5vdygpO1xuICBsb2cuaW5mbyhgRG9uZSBwcmVsb2FkaW5nIGVtb2ppIGltYWdlcyBpbiAke2VuZCAtIHN0YXJ0fW1zYCk7XG59O1xuXG5jb25zdCBkYXRhQnlTaG9ydE5hbWUgPSBrZXlCeShkYXRhLCAnc2hvcnRfbmFtZScpO1xuY29uc3QgaW1hZ2VCeUVtb2ppOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5jb25zdCBkYXRhQnlFbW9qaTogeyBba2V5OiBzdHJpbmddOiBFbW9qaURhdGEgfSA9IHt9O1xuXG5leHBvcnQgY29uc3QgZGF0YUJ5Q2F0ZWdvcnkgPSBtYXBWYWx1ZXMoXG4gIGdyb3VwQnkoZGF0YSwgKHsgY2F0ZWdvcnkgfSkgPT4ge1xuICAgIGlmIChjYXRlZ29yeSA9PT0gJ0FjdGl2aXRpZXMnKSB7XG4gICAgICByZXR1cm4gJ2FjdGl2aXR5JztcbiAgICB9XG5cbiAgICBpZiAoY2F0ZWdvcnkgPT09ICdBbmltYWxzICYgTmF0dXJlJykge1xuICAgICAgcmV0dXJuICdhbmltYWwnO1xuICAgIH1cblxuICAgIGlmIChjYXRlZ29yeSA9PT0gJ0ZsYWdzJykge1xuICAgICAgcmV0dXJuICdmbGFnJztcbiAgICB9XG5cbiAgICBpZiAoY2F0ZWdvcnkgPT09ICdGb29kICYgRHJpbmsnKSB7XG4gICAgICByZXR1cm4gJ2Zvb2QnO1xuICAgIH1cblxuICAgIGlmIChjYXRlZ29yeSA9PT0gJ09iamVjdHMnKSB7XG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuXG4gICAgaWYgKGNhdGVnb3J5ID09PSAnVHJhdmVsICYgUGxhY2VzJykge1xuICAgICAgcmV0dXJuICd0cmF2ZWwnO1xuICAgIH1cblxuICAgIGlmIChjYXRlZ29yeSA9PT0gJ1NtaWxleXMgJiBFbW90aW9uJykge1xuICAgICAgcmV0dXJuICdlbW9qaSc7XG4gICAgfVxuXG4gICAgaWYgKGNhdGVnb3J5ID09PSAnUGVvcGxlICYgQm9keScpIHtcbiAgICAgIHJldHVybiAnZW1vamknO1xuICAgIH1cblxuICAgIGlmIChjYXRlZ29yeSA9PT0gJ1N5bWJvbHMnKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdtaXNjJztcbiAgfSksXG4gIGFyciA9PiBzb3J0QnkoYXJyLCAnc29ydF9vcmRlcicpXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1vamlEYXRhKFxuICBzaG9ydE5hbWU6IGtleW9mIHR5cGVvZiBkYXRhQnlTaG9ydE5hbWUsXG4gIHNraW5Ub25lPzogU2tpblRvbmVLZXkgfCBudW1iZXJcbik6IEVtb2ppRGF0YSB8IEVtb2ppU2tpblZhcmlhdGlvbiB7XG4gIGNvbnN0IGJhc2UgPSBkYXRhQnlTaG9ydE5hbWVbc2hvcnROYW1lXTtcblxuICBpZiAoc2tpblRvbmUgJiYgYmFzZS5za2luX3ZhcmlhdGlvbnMpIHtcbiAgICBjb25zdCB2YXJpYXRpb24gPSBpc051bWJlcihza2luVG9uZSkgPyBza2luVG9uZXNbc2tpblRvbmUgLSAxXSA6IHNraW5Ub25lO1xuXG4gICAgaWYgKGJhc2Uuc2tpbl92YXJpYXRpb25zW3ZhcmlhdGlvbl0pIHtcbiAgICAgIHJldHVybiBiYXNlLnNraW5fdmFyaWF0aW9uc1t2YXJpYXRpb25dO1xuICAgIH1cblxuICAgIC8vIEZvciBlbW9qaXMgdGhhdCBoYXZlIHR3byBwZW9wbGUgaW4gdGhlbSB3aGljaCBjYW4gaGF2ZSBkaWZmIHNraW4gdG9uZXNcbiAgICAvLyB0aGUgTWFwIGlzIG9mIFNraW5Ub25lLVNraW5Ub25lLiBJZiB3ZSBkb24ndCBmaW5kIHRoZSBjb3JyZWN0IHNraW4gdG9uZVxuICAgIC8vIGluIHRoZSBsaXN0IG9mIHZhcmlhdGlvbnMgdGhlbiB3ZSBhc3N1bWUgaXQgaXMgb25lIG9mIHRob3NlIGRvdWJsZSBza2luXG4gICAgLy8gZW1vamlzIGFuZCB3ZSBkZWZhdWx0IHRvIGJvdGggcGVvcGxlIGhhdmluZyBzYW1lIHNraW4uXG4gICAgcmV0dXJuIGJhc2Uuc2tpbl92YXJpYXRpb25zW2Ake3ZhcmlhdGlvbn0tJHt2YXJpYXRpb259YF07XG4gIH1cblxuICByZXR1cm4gYmFzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEltYWdlUGF0aChcbiAgc2hvcnROYW1lOiBrZXlvZiB0eXBlb2YgZGF0YUJ5U2hvcnROYW1lLFxuICBza2luVG9uZT86IFNraW5Ub25lS2V5IHwgbnVtYmVyXG4pOiBzdHJpbmcge1xuICBjb25zdCBlbW9qaURhdGEgPSBnZXRFbW9qaURhdGEoc2hvcnROYW1lLCBza2luVG9uZSk7XG5cbiAgcmV0dXJuIG1ha2VJbWFnZVBhdGgoZW1vamlEYXRhLmltYWdlKTtcbn1cblxuY29uc3QgZnVzZSA9IG5ldyBGdXNlKGRhdGEsIHtcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgdGhyZXNob2xkOiAwLjIsXG4gIG1pbk1hdGNoQ2hhckxlbmd0aDogMSxcbiAga2V5czogWydzaG9ydF9uYW1lJywgJ25hbWUnXSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoKHF1ZXJ5OiBzdHJpbmcsIGNvdW50ID0gMCk6IEFycmF5PEVtb2ppRGF0YT4ge1xuICBjb25zdCByZXN1bHRzID0gZnVzZS5zZWFyY2gocXVlcnkuc3Vic3RyKDAsIDMyKSkubWFwKHJlc3VsdCA9PiByZXN1bHQuaXRlbSk7XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgcmV0dXJuIHRha2UocmVzdWx0cywgY291bnQpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IHNob3J0TmFtZXMgPSBuZXcgU2V0KFtcbiAgLi4ubWFwKGRhdGEsICdzaG9ydF9uYW1lJyksXG4gIC4uLmNvbXBhY3Q8c3RyaW5nPihmbGF0TWFwKGRhdGEsICdzaG9ydF9uYW1lcycpKSxcbl0pO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTaG9ydE5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBzaG9ydE5hbWVzLmhhcyhuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaWZpZWRUb0Vtb2ppKHVuaWZpZWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB1bmlmaWVkXG4gICAgLnNwbGl0KCctJylcbiAgICAubWFwKGMgPT4gU3RyaW5nLmZyb21Db2RlUG9pbnQocGFyc2VJbnQoYywgMTYpKSlcbiAgICAuam9pbignJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U2hvcnROYW1lVG9EYXRhKFxuICBzaG9ydE5hbWU6IHN0cmluZyxcbiAgc2tpblRvbmU6IG51bWJlciB8IFNraW5Ub25lS2V5ID0gMFxuKTogRW1vamlEYXRhIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgYmFzZSA9IGRhdGFCeVNob3J0TmFtZVtzaG9ydE5hbWVdO1xuXG4gIGlmICghYmFzZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCB0b25lS2V5ID0gaXMubnVtYmVyKHNraW5Ub25lKSA/IHNraW5Ub25lc1tza2luVG9uZSAtIDFdIDogc2tpblRvbmU7XG5cbiAgaWYgKHNraW5Ub25lICYmIGJhc2Uuc2tpbl92YXJpYXRpb25zKSB7XG4gICAgY29uc3QgdmFyaWF0aW9uID0gYmFzZS5za2luX3ZhcmlhdGlvbnNbdG9uZUtleV07XG4gICAgaWYgKHZhcmlhdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgLi4udmFyaWF0aW9uLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYmFzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTaG9ydE5hbWUoXG4gIHNob3J0TmFtZTogc3RyaW5nLFxuICBza2luVG9uZTogbnVtYmVyIHwgU2tpblRvbmVLZXkgPSAwXG4pOiBzdHJpbmcge1xuICBjb25zdCBlbW9qaURhdGEgPSBjb252ZXJ0U2hvcnROYW1lVG9EYXRhKHNob3J0TmFtZSwgc2tpblRvbmUpO1xuXG4gIGlmICghZW1vamlEYXRhKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHVuaWZpZWRUb0Vtb2ppKGVtb2ppRGF0YS51bmlmaWVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtb2ppVG9JbWFnZShlbW9qaTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGdldE93bihpbWFnZUJ5RW1vamksIGVtb2ppKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtb2ppVG9EYXRhKGVtb2ppOiBzdHJpbmcpOiBFbW9qaURhdGEgfCB1bmRlZmluZWQge1xuICByZXR1cm4gZ2V0T3duKGRhdGFCeUVtb2ppLCBlbW9qaSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbW9qaUNvdW50KHN0cjogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgcmVnZXggPSBlbW9qaVJlZ2V4KCk7XG5cbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHIpO1xuICBsZXQgY291bnQgPSAwO1xuXG4gIGlmICghcmVnZXguZ2xvYmFsKSB7XG4gICAgcmV0dXJuIG1hdGNoID8gMSA6IDA7XG4gIH1cblxuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb3VudCArPSAxO1xuICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHIpO1xuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2l6ZUNsYXNzKHN0cjogc3RyaW5nKTogU2l6ZUNsYXNzVHlwZSB7XG4gIC8vIERvIHdlIGhhdmUgbm9uLWVtb2ppIGNoYXJhY3RlcnM/XG4gIGlmIChzdHIucmVwbGFjZShlbW9qaVJlZ2V4KCksICcnKS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGNvbnN0IGVtb2ppQ291bnQgPSBnZXRFbW9qaUNvdW50KHN0cik7XG5cbiAgaWYgKGVtb2ppQ291bnQgPT09IDEpIHtcbiAgICByZXR1cm4gJ21heCc7XG4gIH1cbiAgaWYgKGVtb2ppQ291bnQgPT09IDIpIHtcbiAgICByZXR1cm4gJ2V4dHJhLWxhcmdlJztcbiAgfVxuICBpZiAoZW1vamlDb3VudCA9PT0gMykge1xuICAgIHJldHVybiAnbGFyZ2UnO1xuICB9XG4gIGlmIChlbW9qaUNvdW50ID09PSA0KSB7XG4gICAgcmV0dXJuICdtZWRpdW0nO1xuICB9XG4gIGlmIChlbW9qaUNvdW50ID09PSA1KSB7XG4gICAgcmV0dXJuICdzbWFsbCc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5kYXRhLmZvckVhY2goZW1vamkgPT4ge1xuICBjb25zdCB7IHNob3J0X25hbWUsIHNob3J0X25hbWVzLCBza2luX3ZhcmlhdGlvbnMsIGltYWdlIH0gPSBlbW9qaTtcblxuICBpZiAoc2hvcnRfbmFtZXMpIHtcbiAgICBzaG9ydF9uYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgZGF0YUJ5U2hvcnROYW1lW25hbWVdID0gZW1vamk7XG4gICAgfSk7XG4gIH1cblxuICBpbWFnZUJ5RW1vamlbY29udmVydFNob3J0TmFtZShzaG9ydF9uYW1lKV0gPSBtYWtlSW1hZ2VQYXRoKGltYWdlKTtcbiAgZGF0YUJ5RW1vamlbY29udmVydFNob3J0TmFtZShzaG9ydF9uYW1lKV0gPSBlbW9qaTtcblxuICBpZiAoc2tpbl92YXJpYXRpb25zKSB7XG4gICAgT2JqZWN0LmVudHJpZXMoc2tpbl92YXJpYXRpb25zKS5mb3JFYWNoKChbdG9uZSwgdmFyaWF0aW9uXSkgPT4ge1xuICAgICAgaW1hZ2VCeUVtb2ppW2NvbnZlcnRTaG9ydE5hbWUoc2hvcnRfbmFtZSwgdG9uZSBhcyBTa2luVG9uZUtleSldID1cbiAgICAgICAgbWFrZUltYWdlUGF0aCh2YXJpYXRpb24uaW1hZ2UpO1xuICAgICAgZGF0YUJ5RW1vamlbY29udmVydFNob3J0TmFtZShzaG9ydF9uYW1lLCB0b25lIGFzIFNraW5Ub25lS2V5KV0gPSBlbW9qaTtcbiAgICB9KTtcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFB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
