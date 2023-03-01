var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var config_exports = {};
__export(config_exports, {
  default: () => config_default
});
module.exports = __toCommonJS(config_exports);
var import_path = require("path");
var import_electron = require("electron");
var import_environment = require("../ts/environment");
if (import_electron.app.isPackaged) {
  (0, import_environment.setEnvironment)(import_environment.Environment.Production);
} else {
  (0, import_environment.setEnvironment)((0, import_environment.parseEnvironment)(process.env.NODE_ENV || "development"));
}
process.env.NODE_ENV = (0, import_environment.getEnvironment)();
process.env.NODE_CONFIG_DIR = (0, import_path.join)(__dirname, "..", "config");
if ((0, import_environment.getEnvironment)() === import_environment.Environment.Production) {
  process.env.NODE_CONFIG = "";
  process.env.NODE_CONFIG_STRICT_MODE = "";
  process.env.HOSTNAME = "";
  process.env.NODE_APP_INSTANCE = "";
  process.env.ALLOW_CONFIG_MUTATIONS = "";
  process.env.SUPPRESS_NO_CONFIG_WARNING = "";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "";
  process.env.SIGNAL_ENABLE_HTTP = "";
  process.env.CUSTOM_TITLEBAR = "";
}
const config = require("config");
[
  "NODE_ENV",
  "NODE_CONFIG_DIR",
  "NODE_CONFIG",
  "ALLOW_CONFIG_MUTATIONS",
  "HOSTNAME",
  "NODE_APP_INSTANCE",
  "SUPPRESS_NO_CONFIG_WARNING",
  "SIGNAL_ENABLE_HTTP"
].forEach((s) => {
  console.log(`${s} ${config.util.getEnv(s)}`);
});
var config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNy0yMDIwIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgdHlwZSB7IElDb25maWcgfSBmcm9tICdjb25maWcnO1xuXG5pbXBvcnQge1xuICBFbnZpcm9ubWVudCxcbiAgZ2V0RW52aXJvbm1lbnQsXG4gIHNldEVudmlyb25tZW50LFxuICBwYXJzZUVudmlyb25tZW50LFxufSBmcm9tICcuLi90cy9lbnZpcm9ubWVudCc7XG5cbi8vIEluIHByb2R1Y3Rpb24gbW9kZSwgTk9ERV9FTlYgY2Fubm90IGJlIGN1c3RvbWl6ZWQgYnkgdGhlIHVzZXJcbmlmIChhcHAuaXNQYWNrYWdlZCkge1xuICBzZXRFbnZpcm9ubWVudChFbnZpcm9ubWVudC5Qcm9kdWN0aW9uKTtcbn0gZWxzZSB7XG4gIHNldEVudmlyb25tZW50KHBhcnNlRW52aXJvbm1lbnQocHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JykpO1xufVxuXG4vLyBTZXQgZW52aXJvbm1lbnQgdmFycyB0byBjb25maWd1cmUgbm9kZS1jb25maWcgYmVmb3JlIHJlcXVpcmluZyBpdFxucHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBnZXRFbnZpcm9ubWVudCgpO1xucHJvY2Vzcy5lbnYuTk9ERV9DT05GSUdfRElSID0gam9pbihfX2Rpcm5hbWUsICcuLicsICdjb25maWcnKTtcblxuaWYgKGdldEVudmlyb25tZW50KCkgPT09IEVudmlyb25tZW50LlByb2R1Y3Rpb24pIHtcbiAgLy8gaGFyZGVuIHByb2R1Y3Rpb24gY29uZmlnIGFnYWluc3QgdGhlIGxvY2FsIGVudlxuICBwcm9jZXNzLmVudi5OT0RFX0NPTkZJRyA9ICcnO1xuICBwcm9jZXNzLmVudi5OT0RFX0NPTkZJR19TVFJJQ1RfTU9ERSA9ICcnO1xuICBwcm9jZXNzLmVudi5IT1NUTkFNRSA9ICcnO1xuICBwcm9jZXNzLmVudi5OT0RFX0FQUF9JTlNUQU5DRSA9ICcnO1xuICBwcm9jZXNzLmVudi5BTExPV19DT05GSUdfTVVUQVRJT05TID0gJyc7XG4gIHByb2Nlc3MuZW52LlNVUFBSRVNTX05PX0NPTkZJR19XQVJOSU5HID0gJyc7XG4gIHByb2Nlc3MuZW52Lk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQgPSAnJztcbiAgcHJvY2Vzcy5lbnYuU0lHTkFMX0VOQUJMRV9IVFRQID0gJyc7XG4gIHByb2Nlc3MuZW52LkNVU1RPTV9USVRMRUJBUiA9ICcnO1xufVxuXG4vLyBXZSBsb2FkIGNvbmZpZyBhZnRlciB3ZSd2ZSBtYWRlIG91ciBtb2RpZmljYXRpb25zIHRvIE5PREVfRU5WXG4vLyBOb3RlOiB3ZSB1c2UgYHJlcXVpcmUoKWAgYmVjYXVzZSBlc2J1aWxkIG1vdmVzIHRoZSBpbXBvcnRzIHRvIHRoZSB0b3Agb2Zcbi8vIHRoZSBtb2R1bGUgcmVnYXJkbGVzcyBvZiB0aGVpciBhY3R1YWwgcGxhY2VtZW50IGluIHRoZSBmaWxlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZXZhbncvZXNidWlsZC9pc3N1ZXMvMjAxMVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbmNvbnN0IGNvbmZpZzogSUNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuXG4vLyBMb2cgcmVzdWx0aW5nIGVudiB2YXJzIGluIHVzZSBieSBjb25maWdcbltcbiAgJ05PREVfRU5WJyxcbiAgJ05PREVfQ09ORklHX0RJUicsXG4gICdOT0RFX0NPTkZJRycsXG4gICdBTExPV19DT05GSUdfTVVUQVRJT05TJyxcbiAgJ0hPU1ROQU1FJyxcbiAgJ05PREVfQVBQX0lOU1RBTkNFJyxcbiAgJ1NVUFBSRVNTX05PX0NPTkZJR19XQVJOSU5HJyxcbiAgJ1NJR05BTF9FTkFCTEVfSFRUUCcsXG5dLmZvckVhY2gocyA9PiB7XG4gIGNvbnNvbGUubG9nKGAke3N9ICR7Y29uZmlnLnV0aWwuZ2V0RW52KHMpfWApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbmV4cG9ydCB0eXBlIHsgSUNvbmZpZyBhcyBDb25maWdUeXBlIH07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxrQkFBcUI7QUFDckIsc0JBQW9CO0FBSXBCLHlCQUtPO0FBR1AsSUFBSSxvQkFBSSxZQUFZO0FBQ2xCLHlDQUFlLCtCQUFZLFVBQVU7QUFDdkMsT0FBTztBQUNMLHlDQUFlLHlDQUFpQixRQUFRLElBQUksWUFBWSxhQUFhLENBQUM7QUFDeEU7QUFHQSxRQUFRLElBQUksV0FBVyx1Q0FBZTtBQUN0QyxRQUFRLElBQUksa0JBQWtCLHNCQUFLLFdBQVcsTUFBTSxRQUFRO0FBRTVELElBQUksdUNBQWUsTUFBTSwrQkFBWSxZQUFZO0FBRS9DLFVBQVEsSUFBSSxjQUFjO0FBQzFCLFVBQVEsSUFBSSwwQkFBMEI7QUFDdEMsVUFBUSxJQUFJLFdBQVc7QUFDdkIsVUFBUSxJQUFJLG9CQUFvQjtBQUNoQyxVQUFRLElBQUkseUJBQXlCO0FBQ3JDLFVBQVEsSUFBSSw2QkFBNkI7QUFDekMsVUFBUSxJQUFJLCtCQUErQjtBQUMzQyxVQUFRLElBQUkscUJBQXFCO0FBQ2pDLFVBQVEsSUFBSSxrQkFBa0I7QUFDaEM7QUFPQSxNQUFNLFNBQWtCLFFBQVEsUUFBUTtBQUd4QztBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsRUFBRSxRQUFRLE9BQUs7QUFDYixVQUFRLElBQUksR0FBRyxLQUFLLE9BQU8sS0FBSyxPQUFPLENBQUMsR0FBRztBQUM3QyxDQUFDO0FBRUQsSUFBTyxpQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
