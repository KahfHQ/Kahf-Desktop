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
var TaskWithTimeout_exports = {};
__export(TaskWithTimeout_exports, {
  default: () => createTaskWithTimeout,
  resumeTasksWithTimeout: () => resumeTasksWithTimeout,
  suspendTasksWithTimeout: () => suspendTasksWithTimeout
});
module.exports = __toCommonJS(TaskWithTimeout_exports);
var durations = __toESM(require("../util/durations"));
var import_clearTimeoutIfNecessary = require("../util/clearTimeoutIfNecessary");
var import_explodePromise = require("../util/explodePromise");
var import_errors = require("../types/errors");
var log = __toESM(require("../logging/log"));
const tasks = /* @__PURE__ */ new Set();
let shouldStartTimers = true;
function suspendTasksWithTimeout() {
  log.info(`TaskWithTimeout: suspending ${tasks.size} tasks`);
  shouldStartTimers = false;
  for (const task of tasks) {
    task.suspend();
  }
}
function resumeTasksWithTimeout() {
  log.info(`TaskWithTimeout: resuming ${tasks.size} tasks`);
  shouldStartTimers = true;
  for (const task of tasks) {
    task.resume();
  }
}
function createTaskWithTimeout(task, id, options = {}) {
  const timeout = options.timeout || 30 * durations.MINUTE;
  const timeoutError = new Error(`${id || ""} task did not complete in time.`);
  return async (...args) => {
    let complete = false;
    let timer;
    const { promise: timerPromise, reject } = (0, import_explodePromise.explodePromise)();
    const startTimer = /* @__PURE__ */ __name(() => {
      stopTimer();
      if (complete) {
        return;
      }
      timer = setTimeout(() => {
        if (complete) {
          return;
        }
        complete = true;
        tasks.delete(entry);
        log.error((0, import_errors.toLogFormat)(timeoutError));
        reject(timeoutError);
      }, timeout);
    }, "startTimer");
    const stopTimer = /* @__PURE__ */ __name(() => {
      (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timer);
      timer = void 0;
    }, "stopTimer");
    const entry = {
      suspend: stopTimer,
      resume: startTimer
    };
    tasks.add(entry);
    if (shouldStartTimers) {
      startTimer();
    }
    let result;
    const run = /* @__PURE__ */ __name(async () => {
      result = await task(...args);
    }, "run");
    try {
      await Promise.race([run(), timerPromise]);
      return result;
    } finally {
      complete = true;
      tasks.delete(entry);
      stopTimer();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resumeTasksWithTimeout,
  suspendTasksWithTimeout
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGFza1dpdGhUaW1lb3V0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgZHVyYXRpb25zIGZyb20gJy4uL3V0aWwvZHVyYXRpb25zJztcbmltcG9ydCB7IGNsZWFyVGltZW91dElmTmVjZXNzYXJ5IH0gZnJvbSAnLi4vdXRpbC9jbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSc7XG5pbXBvcnQgeyBleHBsb2RlUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvZXhwbG9kZVByb21pc2UnO1xuaW1wb3J0IHsgdG9Mb2dGb3JtYXQgfSBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcblxudHlwZSBUYXNrVHlwZSA9IHtcbiAgc3VzcGVuZCgpOiB2b2lkO1xuICByZXN1bWUoKTogdm9pZDtcbn07XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldDxUYXNrVHlwZT4oKTtcbmxldCBzaG91bGRTdGFydFRpbWVycyA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdXNwZW5kVGFza3NXaXRoVGltZW91dCgpOiB2b2lkIHtcbiAgbG9nLmluZm8oYFRhc2tXaXRoVGltZW91dDogc3VzcGVuZGluZyAke3Rhc2tzLnNpemV9IHRhc2tzYCk7XG4gIHNob3VsZFN0YXJ0VGltZXJzID0gZmFsc2U7XG4gIGZvciAoY29uc3QgdGFzayBvZiB0YXNrcykge1xuICAgIHRhc2suc3VzcGVuZCgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXN1bWVUYXNrc1dpdGhUaW1lb3V0KCk6IHZvaWQge1xuICBsb2cuaW5mbyhgVGFza1dpdGhUaW1lb3V0OiByZXN1bWluZyAke3Rhc2tzLnNpemV9IHRhc2tzYCk7XG4gIHNob3VsZFN0YXJ0VGltZXJzID0gdHJ1ZTtcbiAgZm9yIChjb25zdCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgdGFzay5yZXN1bWUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUYXNrV2l0aFRpbWVvdXQ8VCwgQXJncyBleHRlbmRzIEFycmF5PHVua25vd24+PihcbiAgdGFzazogKC4uLmFyZ3M6IEFyZ3MpID0+IFByb21pc2U8VD4sXG4gIGlkOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgdGltZW91dD86IG51bWJlciB9ID0ge31cbik6ICguLi5hcmdzOiBBcmdzKSA9PiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAzMCAqIGR1cmF0aW9ucy5NSU5VVEU7XG5cbiAgY29uc3QgdGltZW91dEVycm9yID0gbmV3IEVycm9yKGAke2lkIHx8ICcnfSB0YXNrIGRpZCBub3QgY29tcGxldGUgaW4gdGltZS5gKTtcblxuICByZXR1cm4gYXN5bmMgKC4uLmFyZ3M6IEFyZ3MpID0+IHtcbiAgICBsZXQgY29tcGxldGUgPSBmYWxzZTtcblxuICAgIGxldCB0aW1lcjogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHRpbWVyUHJvbWlzZSwgcmVqZWN0IH0gPSBleHBsb2RlUHJvbWlzZTxuZXZlcj4oKTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZXIgPSAoKSA9PiB7XG4gICAgICBzdG9wVGltZXIoKTtcblxuICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgdGFza3MuZGVsZXRlKGVudHJ5KTtcblxuICAgICAgICBsb2cuZXJyb3IodG9Mb2dGb3JtYXQodGltZW91dEVycm9yKSk7XG4gICAgICAgIHJlamVjdCh0aW1lb3V0RXJyb3IpO1xuICAgICAgfSwgdGltZW91dCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHN0b3BUaW1lciA9ICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRpbWVyKTtcbiAgICAgIHRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBjb25zdCBlbnRyeTogVGFza1R5cGUgPSB7XG4gICAgICBzdXNwZW5kOiBzdG9wVGltZXIsXG4gICAgICByZXN1bWU6IHN0YXJ0VGltZXIsXG4gICAgfTtcblxuICAgIHRhc2tzLmFkZChlbnRyeSk7XG4gICAgaWYgKHNob3VsZFN0YXJ0VGltZXJzKSB7XG4gICAgICBzdGFydFRpbWVyKCk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogdW5rbm93bjtcblxuICAgIGNvbnN0IHJ1biA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHJlc3VsdCA9IGF3YWl0IHRhc2soLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBQcm9taXNlLnJhY2UoW3J1bigpLCB0aW1lclByb21pc2VdKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdCBhcyBUO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICB0YXNrcy5kZWxldGUoZW50cnkpO1xuICAgICAgc3RvcFRpbWVyKCk7XG4gICAgfVxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxnQkFBMkI7QUFDM0IscUNBQXdDO0FBQ3hDLDRCQUErQjtBQUMvQixvQkFBNEI7QUFDNUIsVUFBcUI7QUFPckIsTUFBTSxRQUFRLG9CQUFJLElBQWM7QUFDaEMsSUFBSSxvQkFBb0I7QUFFakIsbUNBQXlDO0FBQzlDLE1BQUksS0FBSywrQkFBK0IsTUFBTSxZQUFZO0FBQzFELHNCQUFvQjtBQUNwQixhQUFXLFFBQVEsT0FBTztBQUN4QixTQUFLLFFBQVE7QUFBQSxFQUNmO0FBQ0Y7QUFOZ0IsQUFRVCxrQ0FBd0M7QUFDN0MsTUFBSSxLQUFLLDZCQUE2QixNQUFNLFlBQVk7QUFDeEQsc0JBQW9CO0FBQ3BCLGFBQVcsUUFBUSxPQUFPO0FBQ3hCLFNBQUssT0FBTztBQUFBLEVBQ2Q7QUFDRjtBQU5nQixBQVFELCtCQUNiLE1BQ0EsSUFDQSxVQUFnQyxDQUFDLEdBQ0Y7QUFDL0IsUUFBTSxVQUFVLFFBQVEsV0FBVyxLQUFLLFVBQVU7QUFFbEQsUUFBTSxlQUFlLElBQUksTUFBTSxHQUFHLE1BQU0sbUNBQW1DO0FBRTNFLFNBQU8sVUFBVSxTQUFlO0FBQzlCLFFBQUksV0FBVztBQUVmLFFBQUk7QUFFSixVQUFNLEVBQUUsU0FBUyxjQUFjLFdBQVcsMENBQXNCO0FBRWhFLFVBQU0sYUFBYSw2QkFBTTtBQUN2QixnQkFBVTtBQUVWLFVBQUksVUFBVTtBQUNaO0FBQUEsTUFDRjtBQUVBLGNBQVEsV0FBVyxNQUFNO0FBQ3ZCLFlBQUksVUFBVTtBQUNaO0FBQUEsUUFDRjtBQUNBLG1CQUFXO0FBQ1gsY0FBTSxPQUFPLEtBQUs7QUFFbEIsWUFBSSxNQUFNLCtCQUFZLFlBQVksQ0FBQztBQUNuQyxlQUFPLFlBQVk7QUFBQSxNQUNyQixHQUFHLE9BQU87QUFBQSxJQUNaLEdBakJtQjtBQW1CbkIsVUFBTSxZQUFZLDZCQUFNO0FBQ3RCLGtFQUF3QixLQUFLO0FBQzdCLGNBQVE7QUFBQSxJQUNWLEdBSGtCO0FBS2xCLFVBQU0sUUFBa0I7QUFBQSxNQUN0QixTQUFTO0FBQUEsTUFDVCxRQUFRO0FBQUEsSUFDVjtBQUVBLFVBQU0sSUFBSSxLQUFLO0FBQ2YsUUFBSSxtQkFBbUI7QUFDckIsaUJBQVc7QUFBQSxJQUNiO0FBRUEsUUFBSTtBQUVKLFVBQU0sTUFBTSxtQ0FBMkI7QUFDckMsZUFBUyxNQUFNLEtBQUssR0FBRyxJQUFJO0FBQUEsSUFDN0IsR0FGWTtBQUlaLFFBQUk7QUFDRixZQUFNLFFBQVEsS0FBSyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7QUFFeEMsYUFBTztBQUFBLElBQ1QsVUFBRTtBQUNBLGlCQUFXO0FBQ1gsWUFBTSxPQUFPLEtBQUs7QUFDbEIsZ0JBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGO0FBbEV3QiIsCiAgIm5hbWVzIjogW10KfQo=
