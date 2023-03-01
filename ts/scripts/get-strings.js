var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_path = require("path");
var import_fs = require("fs");
var import_child_process = require("child_process");
var import_fs_extra = require("fs-extra");
var Errors = __toESM(require("../types/errors"));
console.log("Getting latest strings!");
let failed = false;
console.log();
console.log("Getting strings, allow for new ones over 80% translated");
try {
  (0, import_child_process.execSync)("tx pull --all --use-git-timestamps --minimum-perc=80", {
    stdio: [null, process.stdout, process.stderr]
  });
} catch (error) {
  failed = true;
  console.log("Failed first tx fetch, continuing...", Errors.toLogFormat(error));
}
console.log();
console.log("Getting strings, updating everything previously missed");
try {
  (0, import_child_process.execSync)("tx pull --use-git-timestamps", {
    stdio: [null, process.stdout, process.stderr]
  });
} catch (error) {
  failed = true;
  console.log("Failed second tx fetch, continuing...", Errors.toLogFormat(error));
}
const BASE_DIR = (0, import_path.join)(__dirname, "../../_locales");
const en = (0, import_fs_extra.readJsonSync)((0, import_path.join)(BASE_DIR, "/en/messages.json"));
const locales = (0, import_fs.readdirSync)((0, import_path.join)(BASE_DIR, ""));
console.log();
console.log("Re-adding placeholders to non-en locales");
locales.forEach((locale) => {
  if (locale === "en") {
    return;
  }
  const target = (0, import_path.resolve)((0, import_path.join)(BASE_DIR, locale, "messages.json"));
  if (!(0, import_fs.existsSync)(target)) {
    throw new Error(`File not found for ${locale}: ${target}`);
  }
  const messages = (0, import_fs_extra.readJsonSync)(target);
  Object.keys(messages).forEach((key) => {
    if (!en[key]) {
      return;
    }
    messages[key].placeholders = en[key].placeholders;
  });
  console.log(`Writing ${target}`);
  (0, import_fs.writeFileSync)(target, `${JSON.stringify(messages, null, 4)}
`);
});
if (failed) {
  process.exit(1);
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0LXN0cmluZ3MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZGRpclN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5pbXBvcnQgeyByZWFkSnNvblN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgdHlwZSB7IExvY2FsZU1lc3NhZ2VzVHlwZSB9IGZyb20gJy4uL3R5cGVzL0kxOE4nO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uL3R5cGVzL2Vycm9ycyc7XG5cbmNvbnNvbGUubG9nKCdHZXR0aW5nIGxhdGVzdCBzdHJpbmdzIScpO1xuXG4vLyBOb3RlOiB3ZSBjb250aW51ZSBhZnRlciB0eCBmYWlsdXJlcyBzbyB3ZSBhbHdheXMgcmVzdG9yZSBwbGFjZWhvbGRlcnMgb24ganNvbiBmaWxlc1xubGV0IGZhaWxlZCA9IGZhbHNlO1xuXG5jb25zb2xlLmxvZygpO1xuY29uc29sZS5sb2coJ0dldHRpbmcgc3RyaW5ncywgYWxsb3cgZm9yIG5ldyBvbmVzIG92ZXIgODAlIHRyYW5zbGF0ZWQnKTtcbnRyeSB7XG4gIGV4ZWNTeW5jKCd0eCBwdWxsIC0tYWxsIC0tdXNlLWdpdC10aW1lc3RhbXBzIC0tbWluaW11bS1wZXJjPTgwJywge1xuICAgIHN0ZGlvOiBbbnVsbCwgcHJvY2Vzcy5zdGRvdXQsIHByb2Nlc3Muc3RkZXJyXSxcbiAgfSk7XG59IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICBmYWlsZWQgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcbiAgICAnRmFpbGVkIGZpcnN0IHR4IGZldGNoLCBjb250aW51aW5nLi4uJyxcbiAgICBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpXG4gICk7XG59XG5cbmNvbnNvbGUubG9nKCk7XG5jb25zb2xlLmxvZygnR2V0dGluZyBzdHJpbmdzLCB1cGRhdGluZyBldmVyeXRoaW5nIHByZXZpb3VzbHkgbWlzc2VkJyk7XG50cnkge1xuICBleGVjU3luYygndHggcHVsbCAtLXVzZS1naXQtdGltZXN0YW1wcycsIHtcbiAgICBzdGRpbzogW251bGwsIHByb2Nlc3Muc3Rkb3V0LCBwcm9jZXNzLnN0ZGVycl0sXG4gIH0pO1xufSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgZmFpbGVkID0gdHJ1ZTtcbiAgY29uc29sZS5sb2coXG4gICAgJ0ZhaWxlZCBzZWNvbmQgdHggZmV0Y2gsIGNvbnRpbnVpbmcuLi4nLFxuICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgKTtcbn1cblxuY29uc3QgQkFTRV9ESVIgPSBqb2luKF9fZGlybmFtZSwgJy4uLy4uL19sb2NhbGVzJyk7XG5jb25zdCBlbjogTG9jYWxlTWVzc2FnZXNUeXBlID0gcmVhZEpzb25TeW5jKFxuICBqb2luKEJBU0VfRElSLCAnL2VuL21lc3NhZ2VzLmpzb24nKVxuKTtcbmNvbnN0IGxvY2FsZXMgPSByZWFkZGlyU3luYyhqb2luKEJBU0VfRElSLCAnJykpO1xuXG5jb25zb2xlLmxvZygpO1xuY29uc29sZS5sb2coJ1JlLWFkZGluZyBwbGFjZWhvbGRlcnMgdG8gbm9uLWVuIGxvY2FsZXMnKTtcbmxvY2FsZXMuZm9yRWFjaCgobG9jYWxlOiBzdHJpbmcpID0+IHtcbiAgaWYgKGxvY2FsZSA9PT0gJ2VuJykge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB0YXJnZXQgPSByZXNvbHZlKGpvaW4oQkFTRV9ESVIsIGxvY2FsZSwgJ21lc3NhZ2VzLmpzb24nKSk7XG4gIGlmICghZXhpc3RzU3luYyh0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlIG5vdCBmb3VuZCBmb3IgJHtsb2NhbGV9OiAke3RhcmdldH1gKTtcbiAgfVxuXG4gIGNvbnN0IG1lc3NhZ2VzOiBMb2NhbGVNZXNzYWdlc1R5cGUgPSByZWFkSnNvblN5bmModGFyZ2V0KTtcbiAgT2JqZWN0LmtleXMobWVzc2FnZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoIWVuW2tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZXNzYWdlc1trZXldLnBsYWNlaG9sZGVycyA9IGVuW2tleV0ucGxhY2Vob2xkZXJzO1xuICB9KTtcblxuICBjb25zb2xlLmxvZyhgV3JpdGluZyAke3RhcmdldH1gKTtcbiAgd3JpdGVGaWxlU3luYyh0YXJnZXQsIGAke0pTT04uc3RyaW5naWZ5KG1lc3NhZ2VzLCBudWxsLCA0KX1cXG5gKTtcbn0pO1xuXG5pZiAoZmFpbGVkKSB7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtCQUE4QjtBQUM5QixnQkFBdUQ7QUFDdkQsMkJBQXlCO0FBRXpCLHNCQUE2QjtBQUU3QixhQUF3QjtBQUV4QixRQUFRLElBQUkseUJBQXlCO0FBR3JDLElBQUksU0FBUztBQUViLFFBQVEsSUFBSTtBQUNaLFFBQVEsSUFBSSx5REFBeUQ7QUFDckUsSUFBSTtBQUNGLHFDQUFTLHdEQUF3RDtBQUFBLElBQy9ELE9BQU8sQ0FBQyxNQUFNLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxFQUM5QyxDQUFDO0FBQ0gsU0FBUyxPQUFQO0FBQ0EsV0FBUztBQUNULFVBQVEsSUFDTix3Q0FDQSxPQUFPLFlBQVksS0FBSyxDQUMxQjtBQUNGO0FBRUEsUUFBUSxJQUFJO0FBQ1osUUFBUSxJQUFJLHdEQUF3RDtBQUNwRSxJQUFJO0FBQ0YscUNBQVMsZ0NBQWdDO0FBQUEsSUFDdkMsT0FBTyxDQUFDLE1BQU0sUUFBUSxRQUFRLFFBQVEsTUFBTTtBQUFBLEVBQzlDLENBQUM7QUFDSCxTQUFTLE9BQVA7QUFDQSxXQUFTO0FBQ1QsVUFBUSxJQUNOLHlDQUNBLE9BQU8sWUFBWSxLQUFLLENBQzFCO0FBQ0Y7QUFFQSxNQUFNLFdBQVcsc0JBQUssV0FBVyxnQkFBZ0I7QUFDakQsTUFBTSxLQUF5QixrQ0FDN0Isc0JBQUssVUFBVSxtQkFBbUIsQ0FDcEM7QUFDQSxNQUFNLFVBQVUsMkJBQVksc0JBQUssVUFBVSxFQUFFLENBQUM7QUFFOUMsUUFBUSxJQUFJO0FBQ1osUUFBUSxJQUFJLDBDQUEwQztBQUN0RCxRQUFRLFFBQVEsQ0FBQyxXQUFtQjtBQUNsQyxNQUFJLFdBQVcsTUFBTTtBQUNuQjtBQUFBLEVBQ0Y7QUFDQSxRQUFNLFNBQVMseUJBQVEsc0JBQUssVUFBVSxRQUFRLGVBQWUsQ0FBQztBQUM5RCxNQUFJLENBQUMsMEJBQVcsTUFBTSxHQUFHO0FBQ3ZCLFVBQU0sSUFBSSxNQUFNLHNCQUFzQixXQUFXLFFBQVE7QUFBQSxFQUMzRDtBQUVBLFFBQU0sV0FBK0Isa0NBQWEsTUFBTTtBQUN4RCxTQUFPLEtBQUssUUFBUSxFQUFFLFFBQVEsU0FBTztBQUNuQyxRQUFJLENBQUMsR0FBRyxNQUFNO0FBQ1o7QUFBQSxJQUNGO0FBRUEsYUFBUyxLQUFLLGVBQWUsR0FBRyxLQUFLO0FBQUEsRUFDdkMsQ0FBQztBQUVELFVBQVEsSUFBSSxXQUFXLFFBQVE7QUFDL0IsK0JBQWMsUUFBUSxHQUFHLEtBQUssVUFBVSxVQUFVLE1BQU0sQ0FBQztBQUFBLENBQUs7QUFDaEUsQ0FBQztBQUVELElBQUksUUFBUTtBQUNWLFVBQVEsS0FBSyxDQUFDO0FBQ2hCOyIsCiAgIm5hbWVzIjogW10KfQo=
