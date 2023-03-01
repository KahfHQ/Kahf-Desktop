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
var locale_exports = {};
__export(locale_exports, {
  load: () => load
});
module.exports = __toCommonJS(locale_exports);
var import_path = require("path");
var import_fs = require("fs");
var import_lodash = require("lodash");
var import_setupI18n = require("../ts/util/setupI18n");
function removeRegion(locale) {
  const match = /^([^-]+)(-.+)$/.exec(locale);
  if (match) {
    return match[1];
  }
  return locale;
}
function getLocaleMessages(locale) {
  const onDiskLocale = locale.replace("-", "_");
  const targetFile = (0, import_path.join)(__dirname, "..", "_locales", onDiskLocale, "messages.json");
  return JSON.parse((0, import_fs.readFileSync)(targetFile, "utf-8"));
}
function finalize(messages, backupMessages, localeName) {
  const finalMessages = (0, import_lodash.merge)(backupMessages, messages);
  const i18n = (0, import_setupI18n.setupI18n)(localeName, finalMessages);
  return {
    i18n,
    name: localeName,
    messages: finalMessages
  };
}
function load({
  appLocale,
  logger
}) {
  if (!appLocale) {
    throw new TypeError("`appLocale` is required");
  }
  if (!logger || !logger.error) {
    throw new TypeError("`logger.error` is required");
  }
  if (!logger.warn) {
    throw new TypeError("`logger.warn` is required");
  }
  const english = getLocaleMessages("en");
  const normalized = removeRegion(appLocale);
  try {
    return finalize(getLocaleMessages(appLocale), english, appLocale);
  } catch (e) {
    logger.warn(`Problem loading messages for locale ${appLocale}`);
  }
  try {
    logger.warn(`Falling back to parent language: '${normalized}'`);
    return finalize(getLocaleMessages(normalized), english, appLocale);
  } catch (e) {
    logger.error(`Problem loading messages for locale ${normalized}`);
    logger.warn("Falling back to 'en' locale");
    return finalize(english, english, "en");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  load
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibG9jYWxlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNy0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgc2V0dXBJMThuIH0gZnJvbSAnLi4vdHMvdXRpbC9zZXR1cEkxOG4nO1xuXG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi90cy90eXBlcy9Mb2dnaW5nJztcbmltcG9ydCB0eXBlIHsgTG9jYWxlTWVzc2FnZXNUeXBlIH0gZnJvbSAnLi4vdHMvdHlwZXMvSTE4Tic7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90cy90eXBlcy9VdGlsJztcblxuZnVuY3Rpb24gcmVtb3ZlUmVnaW9uKGxvY2FsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgbWF0Y2ggPSAvXihbXi1dKykoLS4rKSQvLmV4ZWMobG9jYWxlKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoWzFdO1xuICB9XG5cbiAgcmV0dXJuIGxvY2FsZTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYWxlTWVzc2FnZXMobG9jYWxlOiBzdHJpbmcpOiBMb2NhbGVNZXNzYWdlc1R5cGUge1xuICBjb25zdCBvbkRpc2tMb2NhbGUgPSBsb2NhbGUucmVwbGFjZSgnLScsICdfJyk7XG5cbiAgY29uc3QgdGFyZ2V0RmlsZSA9IGpvaW4oXG4gICAgX19kaXJuYW1lLFxuICAgICcuLicsXG4gICAgJ19sb2NhbGVzJyxcbiAgICBvbkRpc2tMb2NhbGUsXG4gICAgJ21lc3NhZ2VzLmpzb24nXG4gICk7XG5cbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHRhcmdldEZpbGUsICd1dGYtOCcpKTtcbn1cblxuZXhwb3J0IHR5cGUgTG9jYWxlVHlwZSA9IHtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgbmFtZTogc3RyaW5nO1xuICBtZXNzYWdlczogTG9jYWxlTWVzc2FnZXNUeXBlO1xufTtcblxuZnVuY3Rpb24gZmluYWxpemUoXG4gIG1lc3NhZ2VzOiBMb2NhbGVNZXNzYWdlc1R5cGUsXG4gIGJhY2t1cE1lc3NhZ2VzOiBMb2NhbGVNZXNzYWdlc1R5cGUsXG4gIGxvY2FsZU5hbWU6IHN0cmluZ1xuKSB7XG4gIC8vIFdlIHN0YXJ0IHdpdGggZW5nbGlzaCwgdGhlbiBvdmVyd3JpdGUgdGhhdCB3aXRoIGFueXRoaW5nIHByZXNlbnQgaW4gbG9jYWxlXG4gIGNvbnN0IGZpbmFsTWVzc2FnZXMgPSBtZXJnZShiYWNrdXBNZXNzYWdlcywgbWVzc2FnZXMpO1xuXG4gIGNvbnN0IGkxOG4gPSBzZXR1cEkxOG4obG9jYWxlTmFtZSwgZmluYWxNZXNzYWdlcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBpMThuLFxuICAgIG5hbWU6IGxvY2FsZU5hbWUsXG4gICAgbWVzc2FnZXM6IGZpbmFsTWVzc2FnZXMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKHtcbiAgYXBwTG9jYWxlLFxuICBsb2dnZXIsXG59OiB7XG4gIGFwcExvY2FsZTogc3RyaW5nO1xuICBsb2dnZXI6IFBpY2s8TG9nZ2VyVHlwZSwgJ2Vycm9yJyB8ICd3YXJuJz47XG59KTogTG9jYWxlVHlwZSB7XG4gIGlmICghYXBwTG9jYWxlKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYGFwcExvY2FsZWAgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGlmICghbG9nZ2VyIHx8ICFsb2dnZXIuZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgbG9nZ2VyLmVycm9yYCBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGlmICghbG9nZ2VyLndhcm4pIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgbG9nZ2VyLndhcm5gIGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCBlbmdsaXNoID0gZ2V0TG9jYWxlTWVzc2FnZXMoJ2VuJyk7XG5cbiAgLy8gTG9hZCBsb2NhbGUgLSBpZiB3ZSBjYW4ndCBsb2FkIG1lc3NhZ2VzIGZvciB0aGUgY3VycmVudCBsb2NhbGUsIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2VuJ1xuICAvL1xuICAvLyBwb3NzaWJsZSBsb2NhbGVzOlxuICAvLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFpbjp1aS9iYXNlL2wxMG4vbDEwbl91dGlsLmNjXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSByZW1vdmVSZWdpb24oYXBwTG9jYWxlKTtcblxuICB0cnkge1xuICAgIHJldHVybiBmaW5hbGl6ZShnZXRMb2NhbGVNZXNzYWdlcyhhcHBMb2NhbGUpLCBlbmdsaXNoLCBhcHBMb2NhbGUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLndhcm4oYFByb2JsZW0gbG9hZGluZyBtZXNzYWdlcyBmb3IgbG9jYWxlICR7YXBwTG9jYWxlfWApO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBsb2dnZXIud2FybihgRmFsbGluZyBiYWNrIHRvIHBhcmVudCBsYW5ndWFnZTogJyR7bm9ybWFsaXplZH0nYCk7XG4gICAgLy8gTm90ZTogbWVzc2FnZXMgYXJlIGZyb20gcGFyZW50IGxhbmd1YWdlLCBidXQgd2Ugc3RpbGwga2VlcCB0aGUgcmVnaW9uXG4gICAgcmV0dXJuIGZpbmFsaXplKGdldExvY2FsZU1lc3NhZ2VzKG5vcm1hbGl6ZWQpLCBlbmdsaXNoLCBhcHBMb2NhbGUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKGBQcm9ibGVtIGxvYWRpbmcgbWVzc2FnZXMgZm9yIGxvY2FsZSAke25vcm1hbGl6ZWR9YCk7XG5cbiAgICBsb2dnZXIud2FybihcIkZhbGxpbmcgYmFjayB0byAnZW4nIGxvY2FsZVwiKTtcbiAgICByZXR1cm4gZmluYWxpemUoZW5nbGlzaCwgZW5nbGlzaCwgJ2VuJyk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxrQkFBcUI7QUFDckIsZ0JBQTZCO0FBQzdCLG9CQUFzQjtBQUN0Qix1QkFBMEI7QUFNMUIsc0JBQXNCLFFBQXdCO0FBQzVDLFFBQU0sUUFBUSxpQkFBaUIsS0FBSyxNQUFNO0FBQzFDLE1BQUksT0FBTztBQUNULFdBQU8sTUFBTTtBQUFBLEVBQ2Y7QUFFQSxTQUFPO0FBQ1Q7QUFQUyxBQVNULDJCQUEyQixRQUFvQztBQUM3RCxRQUFNLGVBQWUsT0FBTyxRQUFRLEtBQUssR0FBRztBQUU1QyxRQUFNLGFBQWEsc0JBQ2pCLFdBQ0EsTUFDQSxZQUNBLGNBQ0EsZUFDRjtBQUVBLFNBQU8sS0FBSyxNQUFNLDRCQUFhLFlBQVksT0FBTyxDQUFDO0FBQ3JEO0FBWlMsQUFvQlQsa0JBQ0UsVUFDQSxnQkFDQSxZQUNBO0FBRUEsUUFBTSxnQkFBZ0IseUJBQU0sZ0JBQWdCLFFBQVE7QUFFcEQsUUFBTSxPQUFPLGdDQUFVLFlBQVksYUFBYTtBQUVoRCxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLEVBQ1o7QUFDRjtBQWZTLEFBaUJGLGNBQWM7QUFBQSxFQUNuQjtBQUFBLEVBQ0E7QUFBQSxHQUlhO0FBQ2IsTUFBSSxDQUFDLFdBQVc7QUFDZCxVQUFNLElBQUksVUFBVSx5QkFBeUI7QUFBQSxFQUMvQztBQUVBLE1BQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxPQUFPO0FBQzVCLFVBQU0sSUFBSSxVQUFVLDRCQUE0QjtBQUFBLEVBQ2xEO0FBQ0EsTUFBSSxDQUFDLE9BQU8sTUFBTTtBQUNoQixVQUFNLElBQUksVUFBVSwyQkFBMkI7QUFBQSxFQUNqRDtBQUVBLFFBQU0sVUFBVSxrQkFBa0IsSUFBSTtBQU90QyxRQUFNLGFBQWEsYUFBYSxTQUFTO0FBRXpDLE1BQUk7QUFDRixXQUFPLFNBQVMsa0JBQWtCLFNBQVMsR0FBRyxTQUFTLFNBQVM7QUFBQSxFQUNsRSxTQUFTLEdBQVA7QUFDQSxXQUFPLEtBQUssdUNBQXVDLFdBQVc7QUFBQSxFQUNoRTtBQUVBLE1BQUk7QUFDRixXQUFPLEtBQUsscUNBQXFDLGFBQWE7QUFFOUQsV0FBTyxTQUFTLGtCQUFrQixVQUFVLEdBQUcsU0FBUyxTQUFTO0FBQUEsRUFDbkUsU0FBUyxHQUFQO0FBQ0EsV0FBTyxNQUFNLHVDQUF1QyxZQUFZO0FBRWhFLFdBQU8sS0FBSyw2QkFBNkI7QUFDekMsV0FBTyxTQUFTLFNBQVMsU0FBUyxJQUFJO0FBQUEsRUFDeEM7QUFDRjtBQTNDZ0IiLAogICJuYW1lcyI6IFtdCn0K
