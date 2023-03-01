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
var StorageUIKeys_exports = {};
__export(StorageUIKeys_exports, {
  STORAGE_UI_KEYS: () => STORAGE_UI_KEYS,
  themeSettingSchema: () => themeSettingSchema
});
module.exports = __toCommonJS(StorageUIKeys_exports);
var import_zod = require("zod");
const themeSettingSchema = import_zod.z.enum(["system", "light", "dark"]);
const STORAGE_UI_KEYS = [
  "always-relay-calls",
  "audio-notification",
  "auto-download-update",
  "badge-count-muted-conversations",
  "call-ringtone-notification",
  "call-system-notification",
  "customColors",
  "defaultConversationColor",
  "hasAllStoriesMuted",
  "hide-menu-bar",
  "incoming-call-notification",
  "notification-draw-attention",
  "notification-setting",
  "pinnedConversationIds",
  "preferred-audio-input-device",
  "preferred-audio-output-device",
  "preferred-video-input-device",
  "preferredLeftPaneWidth",
  "preferredReactionEmoji",
  "previousAudioDeviceModule",
  "showStickerPickerHint",
  "showStickersIntroduction",
  "skinTone",
  "spell-check",
  "system-tray-setting",
  "theme-setting",
  "zoomFactor"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  STORAGE_UI_KEYS,
  themeSettingSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcmFnZVVJS2V5cy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB0eXBlIHsgU3RvcmFnZUFjY2Vzc1R5cGUgfSBmcm9tICcuL1N0b3JhZ2UuZCc7XG5cbmV4cG9ydCBjb25zdCB0aGVtZVNldHRpbmdTY2hlbWEgPSB6LmVudW0oWydzeXN0ZW0nLCAnbGlnaHQnLCAnZGFyayddKTtcbmV4cG9ydCB0eXBlIFRoZW1lU2V0dGluZ1R5cGUgPSB6LmluZmVyPHR5cGVvZiB0aGVtZVNldHRpbmdTY2hlbWE+O1xuXG4vLyBDb25maWd1cmF0aW9uIGtleXMgdGhhdCBvbmx5IGFmZmVjdCBVSVxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfVUlfS0VZUzogUmVhZG9ubHlBcnJheTxrZXlvZiBTdG9yYWdlQWNjZXNzVHlwZT4gPSBbXG4gICdhbHdheXMtcmVsYXktY2FsbHMnLFxuICAnYXVkaW8tbm90aWZpY2F0aW9uJyxcbiAgJ2F1dG8tZG93bmxvYWQtdXBkYXRlJyxcbiAgJ2JhZGdlLWNvdW50LW11dGVkLWNvbnZlcnNhdGlvbnMnLFxuICAnY2FsbC1yaW5ndG9uZS1ub3RpZmljYXRpb24nLFxuICAnY2FsbC1zeXN0ZW0tbm90aWZpY2F0aW9uJyxcbiAgJ2N1c3RvbUNvbG9ycycsXG4gICdkZWZhdWx0Q29udmVyc2F0aW9uQ29sb3InLFxuICAnaGFzQWxsU3Rvcmllc011dGVkJyxcbiAgJ2hpZGUtbWVudS1iYXInLFxuICAnaW5jb21pbmctY2FsbC1ub3RpZmljYXRpb24nLFxuICAnbm90aWZpY2F0aW9uLWRyYXctYXR0ZW50aW9uJyxcbiAgJ25vdGlmaWNhdGlvbi1zZXR0aW5nJyxcbiAgJ3Bpbm5lZENvbnZlcnNhdGlvbklkcycsXG4gICdwcmVmZXJyZWQtYXVkaW8taW5wdXQtZGV2aWNlJyxcbiAgJ3ByZWZlcnJlZC1hdWRpby1vdXRwdXQtZGV2aWNlJyxcbiAgJ3ByZWZlcnJlZC12aWRlby1pbnB1dC1kZXZpY2UnLFxuICAncHJlZmVycmVkTGVmdFBhbmVXaWR0aCcsXG4gICdwcmVmZXJyZWRSZWFjdGlvbkVtb2ppJyxcbiAgJ3ByZXZpb3VzQXVkaW9EZXZpY2VNb2R1bGUnLFxuICAnc2hvd1N0aWNrZXJQaWNrZXJIaW50JyxcbiAgJ3Nob3dTdGlja2Vyc0ludHJvZHVjdGlvbicsXG4gICdza2luVG9uZScsXG4gICdzcGVsbC1jaGVjaycsXG4gICdzeXN0ZW0tdHJheS1zZXR0aW5nJyxcbiAgJ3RoZW1lLXNldHRpbmcnLFxuICAnem9vbUZhY3RvcicsXG5dO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxpQkFBa0I7QUFHWCxNQUFNLHFCQUFxQixhQUFFLEtBQUssQ0FBQyxVQUFVLFNBQVMsTUFBTSxDQUFDO0FBSTdELE1BQU0sa0JBQTBEO0FBQUEsRUFDckU7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
