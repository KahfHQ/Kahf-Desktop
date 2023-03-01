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
var userLanguages_exports = {};
__export(userLanguages_exports, {
  formatAcceptLanguageHeader: () => formatAcceptLanguageHeader,
  getUserLanguages: () => getUserLanguages
});
module.exports = __toCommonJS(userLanguages_exports);
const MAX_LANGUAGES_TO_FORMAT = 28;
function formatAcceptLanguageHeader(languages) {
  if (languages.length === 0) {
    return "*";
  }
  const result = [];
  const length = Math.min(languages.length, MAX_LANGUAGES_TO_FORMAT);
  for (let i = 0; i < length; i += 1) {
    const language = languages[i];
    if (i === 0) {
      result.push(language);
      continue;
    }
    const magnitude = 1 / 10 ** (Math.ceil(i / 9) - 1);
    const subtractor = ((i - 1) % 9 + 1) * (magnitude / 10);
    const q = magnitude - subtractor;
    const formattedQ = q.toFixed(3).replace(/0+$/, "");
    result.push(`${language};q=${formattedQ}`);
  }
  return result.join(", ");
}
function getUserLanguages(defaults, fallback) {
  const result = defaults || [];
  return result.length ? result : [fallback];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatAcceptLanguageHeader,
  getUserLanguages
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidXNlckxhbmd1YWdlcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8vIFdlIFtcIk1VU1QgTk9UIGdlbmVyYXRlIG1vcmUgdGhhbiB0aHJlZSBkaWdpdHMgYWZ0ZXIgdGhlIGRlY2ltYWwgcG9pbnRcIl1bMF0uIFdlIHVzZSBhXG4vLyAgIHNwYWNlLWVmZmljaWVudCBhbGdvcml0aG0gdGhhdCBydW5zIG91dCBvZiBkaWdpdHMgYWZ0ZXIgMjggbGFuZ3VhZ2VzLiBUaGlzIHNob3VsZCBiZVxuLy8gICBmaW5lIGZvciBtb3N0IHVzZXJzIGFuZCBbdGhlIHNlcnZlciBkb2Vzbid0IHBhcnNlIG1vcmUgdGhhbiAxNSBsYW5ndWFnZXMsIGF0IGxlYXN0XG4vLyAgIGluIHNvbWUgY2FzZXNdWzFdLlxuLy9cbi8vIFswXTogaHR0cHM6Ly9odHRwd2cub3JnL3NwZWNzL3JmYzcyMzEuaHRtbCNxdWFsaXR5LnZhbHVlc1xuLy8gWzFdOiBodHRwczovL2dpdGh1Yi5jb20vc2lnbmFsYXBwL1NpZ25hbC1TZXJ2ZXIvYmxvYi9iZjZkM2FhMzI0MDdmZjUyYjU1NDdlZDZjZTJlN2EyZjJiYmIwZjAzL3NlcnZpY2Uvc3JjL21haW4vamF2YS9vcmcvc2lnbmFsL2kxOG4vSGVhZGVyQ29udHJvbGxlZFJlc291cmNlQnVuZGxlTG9va3VwLmphdmEjTDE5XG5jb25zdCBNQVhfTEFOR1VBR0VTX1RPX0ZPUk1BVCA9IDI4O1xuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0QWNjZXB0TGFuZ3VhZ2VIZWFkZXIoXG4gIGxhbmd1YWdlczogUmVhZG9ubHlBcnJheTxzdHJpbmc+XG4pOiBzdHJpbmcge1xuICBpZiAobGFuZ3VhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAnKic7XG4gIH1cblxuICBjb25zdCByZXN1bHQ6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBjb25zdCBsZW5ndGggPSBNYXRoLm1pbihsYW5ndWFnZXMubGVuZ3RoLCBNQVhfTEFOR1VBR0VTX1RPX0ZPUk1BVCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGxhbmd1YWdlc1tpXTtcblxuICAgIC8vIFtcIklmIG5vICdxJyBwYXJhbWV0ZXIgaXMgcHJlc2VudCwgdGhlIGRlZmF1bHQgd2VpZ2h0IGlzIDEuXCJdWzFdXG4gICAgLy9cbiAgICAvLyBbMV06IGh0dHBzOi8vaHR0cHdnLm9yZy9zcGVjcy9yZmM3MjMxLmh0bWwjcXVhbGl0eS52YWx1ZXNcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmVzdWx0LnB1c2gobGFuZ3VhZ2UpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gVGhlc2UgdmFsdWVzIGNvbXB1dGUgYSBkZXNjZW5kaW5nIHNlcXVlbmNlIHdpdGggbWluaW1hbCBieXRlcy4gU2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAvLyAgIGV4YW1wbGVzLlxuICAgIGNvbnN0IG1hZ25pdHVkZSA9IDEgLyAxMCAqKiAoTWF0aC5jZWlsKGkgLyA5KSAtIDEpO1xuICAgIGNvbnN0IHN1YnRyYWN0b3IgPSAoKChpIC0gMSkgJSA5KSArIDEpICogKG1hZ25pdHVkZSAvIDEwKTtcbiAgICBjb25zdCBxID0gbWFnbml0dWRlIC0gc3VidHJhY3RvcjtcbiAgICBjb25zdCBmb3JtYXR0ZWRRID0gcS50b0ZpeGVkKDMpLnJlcGxhY2UoLzArJC8sICcnKTtcblxuICAgIHJlc3VsdC5wdXNoKGAke2xhbmd1YWdlfTtxPSR7Zm9ybWF0dGVkUX1gKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQuam9pbignLCAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJMYW5ndWFnZXMoXG4gIGRlZmF1bHRzOiB1bmRlZmluZWQgfCBSZWFkb25seUFycmF5PHN0cmluZz4sXG4gIGZhbGxiYWNrOiBzdHJpbmdcbik6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGRlZmF1bHRzIHx8IFtdO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA/IHJlc3VsdCA6IFtmYWxsYmFja107XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVQSxNQUFNLDBCQUEwQjtBQUV6QixvQ0FDTCxXQUNRO0FBQ1IsTUFBSSxVQUFVLFdBQVcsR0FBRztBQUMxQixXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sU0FBd0IsQ0FBQztBQUUvQixRQUFNLFNBQVMsS0FBSyxJQUFJLFVBQVUsUUFBUSx1QkFBdUI7QUFDakUsV0FBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLEtBQUssR0FBRztBQUNsQyxVQUFNLFdBQVcsVUFBVTtBQUszQixRQUFJLE1BQU0sR0FBRztBQUNYLGFBQU8sS0FBSyxRQUFRO0FBQ3BCO0FBQUEsSUFDRjtBQUlBLFVBQU0sWUFBWSxJQUFJLE1BQU8sTUFBSyxLQUFLLElBQUksQ0FBQyxJQUFJO0FBQ2hELFVBQU0sYUFBZ0IsTUFBSSxLQUFLLElBQUssS0FBTSxhQUFZO0FBQ3RELFVBQU0sSUFBSSxZQUFZO0FBQ3RCLFVBQU0sYUFBYSxFQUFFLFFBQVEsQ0FBQyxFQUFFLFFBQVEsT0FBTyxFQUFFO0FBRWpELFdBQU8sS0FBSyxHQUFHLGNBQWMsWUFBWTtBQUFBLEVBQzNDO0FBRUEsU0FBTyxPQUFPLEtBQUssSUFBSTtBQUN6QjtBQWhDZ0IsQUFrQ1QsMEJBQ0wsVUFDQSxVQUN1QjtBQUN2QixRQUFNLFNBQVMsWUFBWSxDQUFDO0FBQzVCLFNBQU8sT0FBTyxTQUFTLFNBQVMsQ0FBQyxRQUFRO0FBQzNDO0FBTmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
