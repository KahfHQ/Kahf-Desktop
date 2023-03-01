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
var import_backbone = __toESM(require("backbone"));
var import_google_libphonenumber = require("google-libphonenumber");
var React = __toESM(require("react"));
var ReactDOM = __toESM(require("react-dom"));
var moment = __toESM(require("moment"));
var import_locales = require("moment/min/locales.min");
var import_p_queue = __toESM(require("p-queue"));
var import_textsecure = require("../../textsecure");
var import_imageToBlurHash = require("../../util/imageToBlurHash");
var Attachments = __toESM(require("../attachments"));
var import_signal = require("../../signal");
var import_privacy = require("../../util/privacy");
var log = __toESM(require("../../logging/log"));
var import_context = require("../context");
window.nodeSetImmediate = setImmediate;
window.Backbone = import_backbone.default;
window.textsecure = import_textsecure.textsecure;
const { config } = window.SignalContext;
window.WebAPI = window.textsecure.WebAPI.initialize({
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
window.imageToBlurHash = import_imageToBlurHash.imageToBlurHash;
window.libphonenumberInstance = import_google_libphonenumber.PhoneNumberUtil.getInstance();
window.libphonenumberFormat = import_google_libphonenumber.PhoneNumberFormat;
window.React = React;
window.ReactDOM = ReactDOM;
window.PQueue = import_p_queue.default;
const { locale } = config;
moment.updateLocale(locale, {
  relativeTime: {
    s: window.i18n("timestamp_s"),
    m: window.i18n("timestamp_m"),
    h: window.i18n("timestamp_h")
  }
});
moment.locale(locale);
const userDataPath = import_context.SignalContext.getPath("userData");
window.baseAttachmentsPath = Attachments.getPath(userDataPath);
window.baseStickersPath = Attachments.getStickersPath(userDataPath);
window.baseTempPath = Attachments.getTempPath(userDataPath);
window.baseDraftPath = Attachments.getDraftPath(userDataPath);
(0, import_privacy.addSensitivePath)(window.baseAttachmentsPath);
if (config.crashDumpsPath) {
  (0, import_privacy.addSensitivePath)(config.crashDumpsPath);
}
window.Signal = (0, import_signal.setup)({
  Attachments,
  getRegionCode: () => window.storage.get("regionCode"),
  logger: log,
  userDataPath
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGhhc2UyLWRlcGVuZGVuY2llcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHsgUGhvbmVOdW1iZXJVdGlsLCBQaG9uZU51bWJlckZvcm1hdCB9IGZyb20gJ2dvb2dsZS1saWJwaG9uZW51bWJlcic7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgJ21vbWVudC9taW4vbG9jYWxlcy5taW4nO1xuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcblxuaW1wb3J0IHsgdGV4dHNlY3VyZSB9IGZyb20gJy4uLy4uL3RleHRzZWN1cmUnO1xuaW1wb3J0IHsgaW1hZ2VUb0JsdXJIYXNoIH0gZnJvbSAnLi4vLi4vdXRpbC9pbWFnZVRvQmx1ckhhc2gnO1xuaW1wb3J0ICogYXMgQXR0YWNobWVudHMgZnJvbSAnLi4vYXR0YWNobWVudHMnO1xuaW1wb3J0IHsgc2V0dXAgfSBmcm9tICcuLi8uLi9zaWduYWwnO1xuaW1wb3J0IHsgYWRkU2Vuc2l0aXZlUGF0aCB9IGZyb20gJy4uLy4uL3V0aWwvcHJpdmFjeSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgU2lnbmFsQ29udGV4dCB9IGZyb20gJy4uL2NvbnRleHQnO1xuXG53aW5kb3cubm9kZVNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbndpbmRvdy5CYWNrYm9uZSA9IEJhY2tib25lO1xud2luZG93LnRleHRzZWN1cmUgPSB0ZXh0c2VjdXJlO1xuXG5jb25zdCB7IGNvbmZpZyB9ID0gd2luZG93LlNpZ25hbENvbnRleHQ7XG5cbndpbmRvdy5XZWJBUEkgPSB3aW5kb3cudGV4dHNlY3VyZS5XZWJBUEkuaW5pdGlhbGl6ZSh7XG4gIHVybDogY29uZmlnLnNlcnZlclVybCxcbiAgc3RvcmFnZVVybDogY29uZmlnLnN0b3JhZ2VVcmwsXG4gIHVwZGF0ZXNVcmw6IGNvbmZpZy51cGRhdGVzVXJsLFxuICBkaXJlY3RvcnlDb25maWc6IGNvbmZpZy5kaXJlY3RvcnlDb25maWcsXG4gIGNkblVybE9iamVjdDoge1xuICAgIDA6IGNvbmZpZy5jZG5VcmwwLFxuICAgIDI6IGNvbmZpZy5jZG5VcmwyLFxuICB9LFxuICBjZXJ0aWZpY2F0ZUF1dGhvcml0eTogY29uZmlnLmNlcnRpZmljYXRlQXV0aG9yaXR5LFxuICBjb250ZW50UHJveHlVcmw6IGNvbmZpZy5jb250ZW50UHJveHlVcmwsXG4gIHByb3h5VXJsOiBjb25maWcucHJveHlVcmwsXG4gIHZlcnNpb246IGNvbmZpZy52ZXJzaW9uLFxufSk7XG5cbndpbmRvdy5pbWFnZVRvQmx1ckhhc2ggPSBpbWFnZVRvQmx1ckhhc2g7XG53aW5kb3cubGlicGhvbmVudW1iZXJJbnN0YW5jZSA9IFBob25lTnVtYmVyVXRpbC5nZXRJbnN0YW5jZSgpO1xud2luZG93LmxpYnBob25lbnVtYmVyRm9ybWF0ID0gUGhvbmVOdW1iZXJGb3JtYXQ7XG5cbndpbmRvdy5SZWFjdCA9IFJlYWN0O1xud2luZG93LlJlYWN0RE9NID0gUmVhY3RET007XG53aW5kb3cuUFF1ZXVlID0gUFF1ZXVlO1xuXG5jb25zdCB7IGxvY2FsZSB9ID0gY29uZmlnO1xubW9tZW50LnVwZGF0ZUxvY2FsZShsb2NhbGUsIHtcbiAgcmVsYXRpdmVUaW1lOiB7XG4gICAgczogd2luZG93LmkxOG4oJ3RpbWVzdGFtcF9zJyksXG4gICAgbTogd2luZG93LmkxOG4oJ3RpbWVzdGFtcF9tJyksXG4gICAgaDogd2luZG93LmkxOG4oJ3RpbWVzdGFtcF9oJyksXG4gIH0sXG59KTtcbm1vbWVudC5sb2NhbGUobG9jYWxlKTtcblxuY29uc3QgdXNlckRhdGFQYXRoID0gU2lnbmFsQ29udGV4dC5nZXRQYXRoKCd1c2VyRGF0YScpO1xud2luZG93LmJhc2VBdHRhY2htZW50c1BhdGggPSBBdHRhY2htZW50cy5nZXRQYXRoKHVzZXJEYXRhUGF0aCk7XG53aW5kb3cuYmFzZVN0aWNrZXJzUGF0aCA9IEF0dGFjaG1lbnRzLmdldFN0aWNrZXJzUGF0aCh1c2VyRGF0YVBhdGgpO1xud2luZG93LmJhc2VUZW1wUGF0aCA9IEF0dGFjaG1lbnRzLmdldFRlbXBQYXRoKHVzZXJEYXRhUGF0aCk7XG53aW5kb3cuYmFzZURyYWZ0UGF0aCA9IEF0dGFjaG1lbnRzLmdldERyYWZ0UGF0aCh1c2VyRGF0YVBhdGgpO1xuXG5hZGRTZW5zaXRpdmVQYXRoKHdpbmRvdy5iYXNlQXR0YWNobWVudHNQYXRoKTtcbmlmIChjb25maWcuY3Jhc2hEdW1wc1BhdGgpIHtcbiAgYWRkU2Vuc2l0aXZlUGF0aChjb25maWcuY3Jhc2hEdW1wc1BhdGgpO1xufVxuXG53aW5kb3cuU2lnbmFsID0gc2V0dXAoe1xuICBBdHRhY2htZW50cyxcbiAgZ2V0UmVnaW9uQ29kZTogKCkgPT4gd2luZG93LnN0b3JhZ2UuZ2V0KCdyZWdpb25Db2RlJyksXG4gIGxvZ2dlcjogbG9nLFxuICB1c2VyRGF0YVBhdGgsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNCQUFxQjtBQUNyQixtQ0FBbUQ7QUFDbkQsWUFBdUI7QUFDdkIsZUFBMEI7QUFDMUIsYUFBd0I7QUFDeEIscUJBQU87QUFDUCxxQkFBbUI7QUFFbkIsd0JBQTJCO0FBQzNCLDZCQUFnQztBQUNoQyxrQkFBNkI7QUFDN0Isb0JBQXNCO0FBQ3RCLHFCQUFpQztBQUNqQyxVQUFxQjtBQUNyQixxQkFBOEI7QUFFOUIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUVwQixNQUFNLEVBQUUsV0FBVyxPQUFPO0FBRTFCLE9BQU8sU0FBUyxPQUFPLFdBQVcsT0FBTyxXQUFXO0FBQUEsRUFDbEQsS0FBSyxPQUFPO0FBQUEsRUFDWixZQUFZLE9BQU87QUFBQSxFQUNuQixZQUFZLE9BQU87QUFBQSxFQUNuQixpQkFBaUIsT0FBTztBQUFBLEVBQ3hCLGNBQWM7QUFBQSxJQUNaLEdBQUcsT0FBTztBQUFBLElBQ1YsR0FBRyxPQUFPO0FBQUEsRUFDWjtBQUFBLEVBQ0Esc0JBQXNCLE9BQU87QUFBQSxFQUM3QixpQkFBaUIsT0FBTztBQUFBLEVBQ3hCLFVBQVUsT0FBTztBQUFBLEVBQ2pCLFNBQVMsT0FBTztBQUNsQixDQUFDO0FBRUQsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyx5QkFBeUIsNkNBQWdCLFlBQVk7QUFDNUQsT0FBTyx1QkFBdUI7QUFFOUIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUVoQixNQUFNLEVBQUUsV0FBVztBQUNuQixPQUFPLGFBQWEsUUFBUTtBQUFBLEVBQzFCLGNBQWM7QUFBQSxJQUNaLEdBQUcsT0FBTyxLQUFLLGFBQWE7QUFBQSxJQUM1QixHQUFHLE9BQU8sS0FBSyxhQUFhO0FBQUEsSUFDNUIsR0FBRyxPQUFPLEtBQUssYUFBYTtBQUFBLEVBQzlCO0FBQ0YsQ0FBQztBQUNELE9BQU8sT0FBTyxNQUFNO0FBRXBCLE1BQU0sZUFBZSw2QkFBYyxRQUFRLFVBQVU7QUFDckQsT0FBTyxzQkFBc0IsWUFBWSxRQUFRLFlBQVk7QUFDN0QsT0FBTyxtQkFBbUIsWUFBWSxnQkFBZ0IsWUFBWTtBQUNsRSxPQUFPLGVBQWUsWUFBWSxZQUFZLFlBQVk7QUFDMUQsT0FBTyxnQkFBZ0IsWUFBWSxhQUFhLFlBQVk7QUFFNUQscUNBQWlCLE9BQU8sbUJBQW1CO0FBQzNDLElBQUksT0FBTyxnQkFBZ0I7QUFDekIsdUNBQWlCLE9BQU8sY0FBYztBQUN4QztBQUVBLE9BQU8sU0FBUyx5QkFBTTtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxlQUFlLE1BQU0sT0FBTyxRQUFRLElBQUksWUFBWTtBQUFBLEVBQ3BELFFBQVE7QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
