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
var ActiveWindowService_exports = {};
__export(ActiveWindowService_exports, {
  ActiveWindowService: () => ActiveWindowService
});
module.exports = __toCommonJS(ActiveWindowService_exports);
var import_lodash = require("lodash");
const ACTIVE_TIMEOUT = 15 * 1e3;
const LISTENER_THROTTLE_TIME = 5 * 1e3;
const ACTIVE_EVENTS = [
  "click",
  "keydown",
  "mousedown",
  "mousemove",
  "touchstart",
  "wheel"
];
class ActiveWindowService {
  constructor() {
    this.isInitialized = false;
    this.isFocused = false;
    this.activeCallbacks = [];
    this.changeCallbacks = [];
    this.lastActiveEventAt = -Infinity;
    this.callActiveCallbacks = (0, import_lodash.throttle)(() => {
      this.activeCallbacks.forEach((callback) => callback());
    }, LISTENER_THROTTLE_TIME);
  }
  initialize(document, ipc) {
    if (this.isInitialized) {
      throw new Error("Active window service should not be initialized multiple times");
    }
    this.isInitialized = true;
    this.lastActiveEventAt = Date.now();
    const onActiveEvent = this.onActiveEvent.bind(this);
    ACTIVE_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, onActiveEvent, true);
    });
    ipc.on("set-window-focus", (_event, isFocused) => {
      this.setWindowFocus(Boolean(isFocused));
    });
  }
  isActive() {
    return this.isFocused && Date.now() < this.lastActiveEventAt + ACTIVE_TIMEOUT;
  }
  registerForActive(callback) {
    this.activeCallbacks.push(callback);
  }
  unregisterForActive(callback) {
    this.activeCallbacks = this.activeCallbacks.filter((item) => item !== callback);
  }
  registerForChange(callback) {
    this.changeCallbacks.push(callback);
  }
  unregisterForChange(callback) {
    this.changeCallbacks = this.changeCallbacks.filter((item) => item !== callback);
  }
  onActiveEvent() {
    this.updateState(() => {
      this.lastActiveEventAt = Date.now();
    });
  }
  setWindowFocus(isFocused) {
    this.updateState(() => {
      this.isFocused = isFocused;
    });
  }
  updateState(fn) {
    const wasActiveBefore = this.isActive();
    fn();
    const isActiveNow = this.isActive();
    if (!wasActiveBefore && isActiveNow) {
      this.callActiveCallbacks();
    }
    if (wasActiveBefore !== isActiveNow) {
      for (const callback of this.changeCallbacks) {
        callback(isActiveNow);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActiveWindowService
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQWN0aXZlV2luZG93U2VydmljZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vIElkbGUgdGltZXIgLSB5b3UncmUgYWN0aXZlIGZvciBBQ1RJVkVfVElNRU9VVCBhZnRlciBvbmUgb2YgdGhlc2UgZXZlbnRzXG5jb25zdCBBQ1RJVkVfVElNRU9VVCA9IDE1ICogMTAwMDtcbmNvbnN0IExJU1RFTkVSX1RIUk9UVExFX1RJTUUgPSA1ICogMTAwMDtcbmNvbnN0IEFDVElWRV9FVkVOVFMgPSBbXG4gICdjbGljaycsXG4gICdrZXlkb3duJyxcbiAgJ21vdXNlZG93bicsXG4gICdtb3VzZW1vdmUnLFxuICAvLyAnc2Nyb2xsJywgLy8gdGhpcyBpcyB0cmlnZ2VyZWQgYnkgVGltZWxpbmUgcmUtcmVuZGVycywgY2FuJ3QgdXNlXG4gICd0b3VjaHN0YXJ0JyxcbiAgJ3doZWVsJyxcbl07XG5cbmV4cG9ydCBjbGFzcyBBY3RpdmVXaW5kb3dTZXJ2aWNlIHtcbiAgLy8gVGhpcyBzdGFydGluZyB2YWx1ZSBtaWdodCBiZSB3cm9uZyBidXQgd2Ugc2hvdWxkIGdldCBhbiB1cGRhdGUgZnJvbSB0aGUgbWFpbiBwcm9jZXNzXG4gIC8vICBzb29uLiBXZSdkIHJhdGhlciByZXBvcnQgdGhhdCB0aGUgd2luZG93IGlzIGluYWN0aXZlIHNvIHdlIGNhbiBzaG93IG5vdGlmaWNhdGlvbnMuXG4gIHByaXZhdGUgaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgaXNGb2N1c2VkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBhY3RpdmVDYWxsYmFja3M6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbiAgcHJpdmF0ZSBjaGFuZ2VDYWxsYmFja3M6IEFycmF5PChpc0FjdGl2ZTogYm9vbGVhbikgPT4gdm9pZD4gPSBbXTtcblxuICBwcml2YXRlIGxhc3RBY3RpdmVFdmVudEF0ID0gLUluZmluaXR5O1xuXG4gIHByaXZhdGUgY2FsbEFjdGl2ZUNhbGxiYWNrczogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNhbGxBY3RpdmVDYWxsYmFja3MgPSB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKCkpO1xuICAgIH0sIExJU1RFTkVSX1RIUk9UVExFX1RJTUUpO1xuICB9XG5cbiAgLy8gVGhlc2UgdHlwZXMgYXJlbid0IHBlcmZlY3RseSBhY2N1cmF0ZSwgYnV0IHRoZXkgbWFrZSB0aGlzIGNsYXNzIGVhc2llciB0byB0ZXN0LlxuICBpbml0aWFsaXplKGRvY3VtZW50OiBFdmVudFRhcmdldCwgaXBjOiBOb2RlSlMuRXZlbnRFbWl0dGVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQWN0aXZlIHdpbmRvdyBzZXJ2aWNlIHNob3VsZCBub3QgYmUgaW5pdGlhbGl6ZWQgbXVsdGlwbGUgdGltZXMnXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5sYXN0QWN0aXZlRXZlbnRBdCA9IERhdGUubm93KCk7XG5cbiAgICBjb25zdCBvbkFjdGl2ZUV2ZW50ID0gdGhpcy5vbkFjdGl2ZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgQUNUSVZFX0VWRU5UUy5mb3JFYWNoKChldmVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9uQWN0aXZlRXZlbnQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgLy8gV2UgZG9uJ3Qga25vdyBmb3Igc3VyZSB0aGF0IHdlJ2xsIGdldCB0aGUgcmlnaHQgZGF0YSBvdmVyIElQQyBzbyB3ZSB1c2UgYHVua25vd25gLlxuICAgIGlwYy5vbignc2V0LXdpbmRvdy1mb2N1cycsIChfZXZlbnQ6IHVua25vd24sIGlzRm9jdXNlZDogdW5rbm93bikgPT4ge1xuICAgICAgdGhpcy5zZXRXaW5kb3dGb2N1cyhCb29sZWFuKGlzRm9jdXNlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuaXNGb2N1c2VkICYmIERhdGUubm93KCkgPCB0aGlzLmxhc3RBY3RpdmVFdmVudEF0ICsgQUNUSVZFX1RJTUVPVVRcbiAgICApO1xuICB9XG5cbiAgcmVnaXN0ZXJGb3JBY3RpdmUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJGb3JBY3RpdmUoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZUNhbGxiYWNrcyA9IHRoaXMuYWN0aXZlQ2FsbGJhY2tzLmZpbHRlcihcbiAgICAgIGl0ZW0gPT4gaXRlbSAhPT0gY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgcmVnaXN0ZXJGb3JDaGFuZ2UoY2FsbGJhY2s6IChpc0FjdGl2ZTogYm9vbGVhbikgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuY2hhbmdlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgdW5yZWdpc3RlckZvckNoYW5nZShjYWxsYmFjazogKGlzQWN0aXZlOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2VDYWxsYmFja3MgPSB0aGlzLmNoYW5nZUNhbGxiYWNrcy5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0gIT09IGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgb25BY3RpdmVFdmVudCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlKCgpID0+IHtcbiAgICAgIHRoaXMubGFzdEFjdGl2ZUV2ZW50QXQgPSBEYXRlLm5vdygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRXaW5kb3dGb2N1cyhpc0ZvY3VzZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlKCgpID0+IHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gaXNGb2N1c2VkO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTdGF0ZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHdhc0FjdGl2ZUJlZm9yZSA9IHRoaXMuaXNBY3RpdmUoKTtcbiAgICBmbigpO1xuICAgIGNvbnN0IGlzQWN0aXZlTm93ID0gdGhpcy5pc0FjdGl2ZSgpO1xuXG4gICAgaWYgKCF3YXNBY3RpdmVCZWZvcmUgJiYgaXNBY3RpdmVOb3cpIHtcbiAgICAgIHRoaXMuY2FsbEFjdGl2ZUNhbGxiYWNrcygpO1xuICAgIH1cblxuICAgIGlmICh3YXNBY3RpdmVCZWZvcmUgIT09IGlzQWN0aXZlTm93KSB7XG4gICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuY2hhbmdlQ2FsbGJhY2tzKSB7XG4gICAgICAgIGNhbGxiYWNrKGlzQWN0aXZlTm93KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBeUI7QUFHekIsTUFBTSxpQkFBaUIsS0FBSztBQUM1QixNQUFNLHlCQUF5QixJQUFJO0FBQ25DLE1BQU0sZ0JBQWdCO0FBQUEsRUFDcEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUNGO0FBRU8sTUFBTSxvQkFBb0I7QUFBQSxFQWUvQixjQUFjO0FBWk4seUJBQWdCO0FBRWhCLHFCQUFZO0FBRVosMkJBQXFDLENBQUM7QUFFdEMsMkJBQXNELENBQUM7QUFFdkQsNkJBQW9CO0FBSzFCLFNBQUssc0JBQXNCLDRCQUFTLE1BQU07QUFDeEMsV0FBSyxnQkFBZ0IsUUFBUSxjQUFZLFNBQVMsQ0FBQztBQUFBLElBQ3JELEdBQUcsc0JBQXNCO0FBQUEsRUFDM0I7QUFBQSxFQUdBLFdBQVcsVUFBdUIsS0FBZ0M7QUFDaEUsUUFBSSxLQUFLLGVBQWU7QUFDdEIsWUFBTSxJQUFJLE1BQ1IsZ0VBQ0Y7QUFBQSxJQUNGO0FBQ0EsU0FBSyxnQkFBZ0I7QUFFckIsU0FBSyxvQkFBb0IsS0FBSyxJQUFJO0FBRWxDLFVBQU0sZ0JBQWdCLEtBQUssY0FBYyxLQUFLLElBQUk7QUFDbEQsa0JBQWMsUUFBUSxDQUFDLGNBQXNCO0FBQzNDLGVBQVMsaUJBQWlCLFdBQVcsZUFBZSxJQUFJO0FBQUEsSUFDMUQsQ0FBQztBQUdELFFBQUksR0FBRyxvQkFBb0IsQ0FBQyxRQUFpQixjQUF1QjtBQUNsRSxXQUFLLGVBQWUsUUFBUSxTQUFTLENBQUM7QUFBQSxJQUN4QyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsV0FBb0I7QUFDbEIsV0FDRSxLQUFLLGFBQWEsS0FBSyxJQUFJLElBQUksS0FBSyxvQkFBb0I7QUFBQSxFQUU1RDtBQUFBLEVBRUEsa0JBQWtCLFVBQTRCO0FBQzVDLFNBQUssZ0JBQWdCLEtBQUssUUFBUTtBQUFBLEVBQ3BDO0FBQUEsRUFFQSxvQkFBb0IsVUFBNEI7QUFDOUMsU0FBSyxrQkFBa0IsS0FBSyxnQkFBZ0IsT0FDMUMsVUFBUSxTQUFTLFFBQ25CO0FBQUEsRUFDRjtBQUFBLEVBRUEsa0JBQWtCLFVBQTZDO0FBQzdELFNBQUssZ0JBQWdCLEtBQUssUUFBUTtBQUFBLEVBQ3BDO0FBQUEsRUFFQSxvQkFBb0IsVUFBNkM7QUFDL0QsU0FBSyxrQkFBa0IsS0FBSyxnQkFBZ0IsT0FDMUMsVUFBUSxTQUFTLFFBQ25CO0FBQUEsRUFDRjtBQUFBLEVBRVEsZ0JBQXNCO0FBQzVCLFNBQUssWUFBWSxNQUFNO0FBQ3JCLFdBQUssb0JBQW9CLEtBQUssSUFBSTtBQUFBLElBQ3BDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFUSxlQUFlLFdBQTBCO0FBQy9DLFNBQUssWUFBWSxNQUFNO0FBQ3JCLFdBQUssWUFBWTtBQUFBLElBQ25CLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFUSxZQUFZLElBQXNCO0FBQ3hDLFVBQU0sa0JBQWtCLEtBQUssU0FBUztBQUN0QyxPQUFHO0FBQ0gsVUFBTSxjQUFjLEtBQUssU0FBUztBQUVsQyxRQUFJLENBQUMsbUJBQW1CLGFBQWE7QUFDbkMsV0FBSyxvQkFBb0I7QUFBQSxJQUMzQjtBQUVBLFFBQUksb0JBQW9CLGFBQWE7QUFDbkMsaUJBQVcsWUFBWSxLQUFLLGlCQUFpQjtBQUMzQyxpQkFBUyxXQUFXO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBaEdPIiwKICAibmFtZXMiOiBbXQp9Cg==
