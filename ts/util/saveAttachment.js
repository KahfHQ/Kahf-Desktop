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
var saveAttachment_exports = {};
__export(saveAttachment_exports, {
  saveAttachment: () => saveAttachment
});
module.exports = __toCommonJS(saveAttachment_exports);
var Attachment = __toESM(require("../types/Attachment"));
var import_showToast = require("./showToast");
var import_ToastFileSaved = require("../components/ToastFileSaved");
async function saveAttachment(attachment, timestamp = Date.now(), index = 0) {
  const { openFileInFolder, readAttachmentData, saveAttachmentToDisk } = window.Signal.Migrations;
  const fullPath = await Attachment.save({
    attachment,
    index: index + 1,
    readAttachmentData,
    saveAttachmentToDisk,
    timestamp
  });
  if (fullPath) {
    (0, import_showToast.showToast)(import_ToastFileSaved.ToastFileSaved, {
      onOpenFile: () => {
        openFileInFolder(fullPath);
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  saveAttachment
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2F2ZUF0dGFjaG1lbnQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuaW1wb3J0ICogYXMgQXR0YWNobWVudCBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4vc2hvd1RvYXN0JztcbmltcG9ydCB7IFRvYXN0RmlsZVNhdmVkIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdEZpbGVTYXZlZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlQXR0YWNobWVudChcbiAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGUsXG4gIHRpbWVzdGFtcCA9IERhdGUubm93KCksXG4gIGluZGV4ID0gMFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgb3BlbkZpbGVJbkZvbGRlciwgcmVhZEF0dGFjaG1lbnREYXRhLCBzYXZlQXR0YWNobWVudFRvRGlzayB9ID1cbiAgICB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnM7XG5cbiAgY29uc3QgZnVsbFBhdGggPSBhd2FpdCBBdHRhY2htZW50LnNhdmUoe1xuICAgIGF0dGFjaG1lbnQsXG4gICAgaW5kZXg6IGluZGV4ICsgMSxcbiAgICByZWFkQXR0YWNobWVudERhdGEsXG4gICAgc2F2ZUF0dGFjaG1lbnRUb0Rpc2ssXG4gICAgdGltZXN0YW1wLFxuICB9KTtcblxuICBpZiAoZnVsbFBhdGgpIHtcbiAgICBzaG93VG9hc3QoVG9hc3RGaWxlU2F2ZWQsIHtcbiAgICAgIG9uT3BlbkZpbGU6ICgpID0+IHtcbiAgICAgICAgb3BlbkZpbGVJbkZvbGRlcihmdWxsUGF0aCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsaUJBQTRCO0FBQzVCLHVCQUEwQjtBQUMxQiw0QkFBK0I7QUFFL0IsOEJBQ0UsWUFDQSxZQUFZLEtBQUssSUFBSSxHQUNyQixRQUFRLEdBQ087QUFDZixRQUFNLEVBQUUsa0JBQWtCLG9CQUFvQix5QkFDNUMsT0FBTyxPQUFPO0FBRWhCLFFBQU0sV0FBVyxNQUFNLFdBQVcsS0FBSztBQUFBLElBQ3JDO0FBQUEsSUFDQSxPQUFPLFFBQVE7QUFBQSxJQUNmO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLENBQUM7QUFFRCxNQUFJLFVBQVU7QUFDWixvQ0FBVSxzQ0FBZ0I7QUFBQSxNQUN4QixZQUFZLE1BQU07QUFDaEIseUJBQWlCLFFBQVE7QUFBQSxNQUMzQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQXZCc0IiLAogICJuYW1lcyI6IFtdCn0K
