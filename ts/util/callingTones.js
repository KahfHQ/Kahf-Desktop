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
var callingTones_exports = {};
__export(callingTones_exports, {
  callingTones: () => callingTones
});
module.exports = __toCommonJS(callingTones_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_durations = require("./durations");
var import_Sound = require("./Sound");
const ringtoneEventQueue = new import_p_queue.default({
  concurrency: 1,
  timeout: import_durations.MINUTE * 30,
  throwOnTimeout: true
});
class CallingTones {
  async playEndCall() {
    const canPlayTone = window.Events.getCallRingtoneNotification();
    if (!canPlayTone) {
      return;
    }
    const tone = new import_Sound.Sound({
      src: "sounds/navigation-cancel.ogg"
    });
    await tone.play();
  }
  async playRingtone() {
    await ringtoneEventQueue.add(async () => {
      if (this.ringtone) {
        this.ringtone.stop();
        this.ringtone = void 0;
      }
      const canPlayTone = window.Events.getCallRingtoneNotification();
      if (!canPlayTone) {
        return;
      }
      this.ringtone = new import_Sound.Sound({
        loop: true,
        src: "sounds/ringtone_minimal.ogg"
      });
      await this.ringtone.play();
    });
  }
  async stopRingtone() {
    await ringtoneEventQueue.add(async () => {
      if (this.ringtone) {
        this.ringtone.stop();
        this.ringtone = void 0;
      }
    });
  }
  async someonePresenting() {
    const canPlayTone = window.Events.getCallRingtoneNotification();
    if (!canPlayTone) {
      return;
    }
    const tone = new import_Sound.Sound({
      src: "sounds/navigation_selection-complete-celebration.ogg"
    });
    await tone.play();
  }
}
const callingTones = new CallingTones();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  callingTones
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FsbGluZ1RvbmVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4vZHVyYXRpb25zJztcbmltcG9ydCB7IFNvdW5kIH0gZnJvbSAnLi9Tb3VuZCc7XG5cbmNvbnN0IHJpbmd0b25lRXZlbnRRdWV1ZSA9IG5ldyBQUXVldWUoe1xuICBjb25jdXJyZW5jeTogMSxcbiAgdGltZW91dDogTUlOVVRFICogMzAsXG4gIHRocm93T25UaW1lb3V0OiB0cnVlLFxufSk7XG5cbmNsYXNzIENhbGxpbmdUb25lcyB7XG4gIHByaXZhdGUgcmluZ3RvbmU/OiBTb3VuZDtcblxuICBhc3luYyBwbGF5RW5kQ2FsbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW5QbGF5VG9uZSA9IHdpbmRvdy5FdmVudHMuZ2V0Q2FsbFJpbmd0b25lTm90aWZpY2F0aW9uKCk7XG4gICAgaWYgKCFjYW5QbGF5VG9uZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRvbmUgPSBuZXcgU291bmQoe1xuICAgICAgc3JjOiAnc291bmRzL25hdmlnYXRpb24tY2FuY2VsLm9nZycsXG4gICAgfSk7XG4gICAgYXdhaXQgdG9uZS5wbGF5KCk7XG4gIH1cblxuICBhc3luYyBwbGF5UmluZ3RvbmUoKSB7XG4gICAgYXdhaXQgcmluZ3RvbmVFdmVudFF1ZXVlLmFkZChhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5yaW5ndG9uZSkge1xuICAgICAgICB0aGlzLnJpbmd0b25lLnN0b3AoKTtcbiAgICAgICAgdGhpcy5yaW5ndG9uZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2FuUGxheVRvbmUgPSB3aW5kb3cuRXZlbnRzLmdldENhbGxSaW5ndG9uZU5vdGlmaWNhdGlvbigpO1xuICAgICAgaWYgKCFjYW5QbGF5VG9uZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmluZ3RvbmUgPSBuZXcgU291bmQoe1xuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBzcmM6ICdzb3VuZHMvcmluZ3RvbmVfbWluaW1hbC5vZ2cnLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IHRoaXMucmluZ3RvbmUucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc3RvcFJpbmd0b25lKCkge1xuICAgIGF3YWl0IHJpbmd0b25lRXZlbnRRdWV1ZS5hZGQoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucmluZ3RvbmUpIHtcbiAgICAgICAgdGhpcy5yaW5ndG9uZS5zdG9wKCk7XG4gICAgICAgIHRoaXMucmluZ3RvbmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzb21lb25lUHJlc2VudGluZygpIHtcbiAgICBjb25zdCBjYW5QbGF5VG9uZSA9IHdpbmRvdy5FdmVudHMuZ2V0Q2FsbFJpbmd0b25lTm90aWZpY2F0aW9uKCk7XG4gICAgaWYgKCFjYW5QbGF5VG9uZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRvbmUgPSBuZXcgU291bmQoe1xuICAgICAgc3JjOiAnc291bmRzL25hdmlnYXRpb25fc2VsZWN0aW9uLWNvbXBsZXRlLWNlbGVicmF0aW9uLm9nZycsXG4gICAgfSk7XG5cbiAgICBhd2FpdCB0b25lLnBsYXkoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY2FsbGluZ1RvbmVzID0gbmV3IENhbGxpbmdUb25lcygpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHFCQUFtQjtBQUNuQix1QkFBdUI7QUFDdkIsbUJBQXNCO0FBRXRCLE1BQU0scUJBQXFCLElBQUksdUJBQU87QUFBQSxFQUNwQyxhQUFhO0FBQUEsRUFDYixTQUFTLDBCQUFTO0FBQUEsRUFDbEIsZ0JBQWdCO0FBQ2xCLENBQUM7QUFFRCxNQUFNLGFBQWE7QUFBQSxRQUdYLGNBQTZCO0FBQ2pDLFVBQU0sY0FBYyxPQUFPLE9BQU8sNEJBQTRCO0FBQzlELFFBQUksQ0FBQyxhQUFhO0FBQ2hCO0FBQUEsSUFDRjtBQUVBLFVBQU0sT0FBTyxJQUFJLG1CQUFNO0FBQUEsTUFDckIsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUNELFVBQU0sS0FBSyxLQUFLO0FBQUEsRUFDbEI7QUFBQSxRQUVNLGVBQWU7QUFDbkIsVUFBTSxtQkFBbUIsSUFBSSxZQUFZO0FBQ3ZDLFVBQUksS0FBSyxVQUFVO0FBQ2pCLGFBQUssU0FBUyxLQUFLO0FBQ25CLGFBQUssV0FBVztBQUFBLE1BQ2xCO0FBRUEsWUFBTSxjQUFjLE9BQU8sT0FBTyw0QkFBNEI7QUFDOUQsVUFBSSxDQUFDLGFBQWE7QUFDaEI7QUFBQSxNQUNGO0FBRUEsV0FBSyxXQUFXLElBQUksbUJBQU07QUFBQSxRQUN4QixNQUFNO0FBQUEsUUFDTixLQUFLO0FBQUEsTUFDUCxDQUFDO0FBRUQsWUFBTSxLQUFLLFNBQVMsS0FBSztBQUFBLElBQzNCLENBQUM7QUFBQSxFQUNIO0FBQUEsUUFFTSxlQUFlO0FBQ25CLFVBQU0sbUJBQW1CLElBQUksWUFBWTtBQUN2QyxVQUFJLEtBQUssVUFBVTtBQUNqQixhQUFLLFNBQVMsS0FBSztBQUNuQixhQUFLLFdBQVc7QUFBQSxNQUNsQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxRQUVNLG9CQUFvQjtBQUN4QixVQUFNLGNBQWMsT0FBTyxPQUFPLDRCQUE0QjtBQUM5RCxRQUFJLENBQUMsYUFBYTtBQUNoQjtBQUFBLElBQ0Y7QUFFQSxVQUFNLE9BQU8sSUFBSSxtQkFBTTtBQUFBLE1BQ3JCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFFRCxVQUFNLEtBQUssS0FBSztBQUFBLEVBQ2xCO0FBQ0Y7QUF6REEsQUEyRE8sTUFBTSxlQUFlLElBQUksYUFBYTsiLAogICJuYW1lcyI6IFtdCn0K
