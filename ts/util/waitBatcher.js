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
var waitBatcher_exports = {};
__export(waitBatcher_exports, {
  createWaitBatcher: () => createWaitBatcher
});
module.exports = __toCommonJS(waitBatcher_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_sleep = require("./sleep");
var log = __toESM(require("../logging/log"));
var Errors = __toESM(require("../types/errors"));
var import_clearTimeoutIfNecessary = require("./clearTimeoutIfNecessary");
var import_durations = require("./durations");
window.waitBatchers = [];
window.flushAllWaitBatchers = async () => {
  log.info("waitBatcher#flushAllWaitBatchers");
  try {
    await Promise.all(window.waitBatchers.map((item) => item.flushAndWait()));
  } catch (error) {
    log.error("flushAllWaitBatchers: Error flushing all", Errors.toLogFormat(error));
  }
};
window.waitForAllWaitBatchers = async () => {
  log.info("waitBatcher#waitForAllWaitBatchers");
  try {
    await Promise.all(window.waitBatchers.map((item) => item.onIdle()));
  } catch (error) {
    log.error("waitForAllWaitBatchers: Error waiting for all", Errors.toLogFormat(error));
  }
};
function createWaitBatcher(options) {
  let waitBatcher;
  let timeout;
  let items = [];
  const queue = new import_p_queue.default({
    concurrency: 1,
    timeout: import_durations.MINUTE * 30,
    throwOnTimeout: true
  });
  async function _kickBatchOff() {
    const itemsRef = items;
    items = [];
    await queue.add(async () => {
      try {
        await options.processBatch(itemsRef.map((item) => item.item));
        itemsRef.forEach((item) => {
          if (item.resolve) {
            item.resolve();
          }
        });
      } catch (error) {
        itemsRef.forEach((item) => {
          if (item.reject) {
            item.reject(error);
          }
        });
      }
    });
  }
  function _makeExplodedPromise() {
    let resolve;
    let reject;
    const promise = new Promise((resolveParam, rejectParam) => {
      resolve = resolveParam;
      reject = rejectParam;
    });
    return { promise, resolve, reject };
  }
  async function add(item) {
    const { promise, resolve, reject } = _makeExplodedPromise();
    items.push({
      resolve,
      reject,
      item
    });
    if (items.length === 1) {
      timeout = setTimeout(() => {
        timeout = null;
        _kickBatchOff();
      }, options.wait);
    }
    if (items.length >= options.maxSize) {
      (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
      timeout = null;
      _kickBatchOff();
    }
    await promise;
  }
  function anyPending() {
    return queue.size > 0 || queue.pending > 0 || items.length > 0;
  }
  async function onIdle() {
    while (anyPending()) {
      if (queue.size > 0 || queue.pending > 0) {
        await queue.onIdle();
      }
      if (items.length > 0) {
        await (0, import_sleep.sleep)(options.wait * 2);
      }
    }
  }
  function unregister() {
    window.waitBatchers = window.waitBatchers.filter((item) => item !== waitBatcher);
  }
  async function flushAndWait() {
    log.info(`Flushing start ${options.name} for waitBatcher items.length=${items.length}`);
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
    timeout = null;
    while (anyPending()) {
      await _kickBatchOff();
      if (queue.size > 0 || queue.pending > 0) {
        await queue.onIdle();
      }
    }
    log.info(`Flushing complete ${options.name} for waitBatcher`);
  }
  waitBatcher = {
    add,
    anyPending,
    onIdle,
    unregister,
    flushAndWait
  };
  window.waitBatchers.push(waitBatcher);
  return waitBatcher;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createWaitBatcher
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2FpdEJhdGNoZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUFF1ZXVlIGZyb20gJ3AtcXVldWUnO1xuXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4vc2xlZXAnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkgfSBmcm9tICcuL2NsZWFyVGltZW91dElmTmVjZXNzYXJ5JztcbmltcG9ydCB7IE1JTlVURSB9IGZyb20gJy4vZHVyYXRpb25zJztcblxuZGVjbGFyZSBnbG9iYWwge1xuICAvLyBXZSB3YW50IHRvIGV4dGVuZCBgd2luZG93YCdzIHByb3BlcnRpZXMsIHNvIHdlIG5lZWQgYW4gaW50ZXJmYWNlLlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICB3YWl0QmF0Y2hlcnM6IEFycmF5PEJhdGNoZXJUeXBlPGFueT4+O1xuICAgIHdhaXRGb3JBbGxXYWl0QmF0Y2hlcnM6ICgpID0+IFByb21pc2U8dW5rbm93bj47XG4gICAgZmx1c2hBbGxXYWl0QmF0Y2hlcnM6ICgpID0+IFByb21pc2U8dW5rbm93bj47XG4gIH1cbn1cblxud2luZG93LndhaXRCYXRjaGVycyA9IFtdO1xuXG53aW5kb3cuZmx1c2hBbGxXYWl0QmF0Y2hlcnMgPSBhc3luYyAoKSA9PiB7XG4gIGxvZy5pbmZvKCd3YWl0QmF0Y2hlciNmbHVzaEFsbFdhaXRCYXRjaGVycycpO1xuICB0cnkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHdpbmRvdy53YWl0QmF0Y2hlcnMubWFwKGl0ZW0gPT4gaXRlbS5mbHVzaEFuZFdhaXQoKSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZy5lcnJvcihcbiAgICAgICdmbHVzaEFsbFdhaXRCYXRjaGVyczogRXJyb3IgZmx1c2hpbmcgYWxsJyxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuICB9XG59O1xuXG53aW5kb3cud2FpdEZvckFsbFdhaXRCYXRjaGVycyA9IGFzeW5jICgpID0+IHtcbiAgbG9nLmluZm8oJ3dhaXRCYXRjaGVyI3dhaXRGb3JBbGxXYWl0QmF0Y2hlcnMnKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbCh3aW5kb3cud2FpdEJhdGNoZXJzLm1hcChpdGVtID0+IGl0ZW0ub25JZGxlKCkpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICAnd2FpdEZvckFsbFdhaXRCYXRjaGVyczogRXJyb3Igd2FpdGluZyBmb3IgYWxsJyxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuICB9XG59O1xuXG50eXBlIEl0ZW1Ib2xkZXJUeXBlPEl0ZW1UeXBlPiA9IHtcbiAgcmVzb2x2ZT86ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWQ7XG4gIHJlamVjdD86IChlcnJvcjogRXJyb3IpID0+IHZvaWQ7XG4gIGl0ZW06IEl0ZW1UeXBlO1xufTtcblxudHlwZSBFeHBsb2RlZFByb21pc2VUeXBlID0ge1xuICByZXNvbHZlPzogKHZhbHVlPzogdW5rbm93bikgPT4gdm9pZDtcbiAgcmVqZWN0PzogKGVycm9yOiBFcnJvcikgPT4gdm9pZDtcbiAgcHJvbWlzZTogUHJvbWlzZTx1bmtub3duPjtcbn07XG5cbnR5cGUgQmF0Y2hlck9wdGlvbnNUeXBlPEl0ZW1UeXBlPiA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICB3YWl0OiBudW1iZXI7XG4gIG1heFNpemU6IG51bWJlcjtcbiAgcHJvY2Vzc0JhdGNoOiAoaXRlbXM6IEFycmF5PEl0ZW1UeXBlPikgPT4gUHJvbWlzZTx2b2lkPjtcbn07XG5cbnR5cGUgQmF0Y2hlclR5cGU8SXRlbVR5cGU+ID0ge1xuICBhZGQ6IChpdGVtOiBJdGVtVHlwZSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgYW55UGVuZGluZzogKCkgPT4gYm9vbGVhbjtcbiAgb25JZGxlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICB1bnJlZ2lzdGVyOiAoKSA9PiB2b2lkO1xuICBmbHVzaEFuZFdhaXQ6ICgpID0+IHZvaWQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2FpdEJhdGNoZXI8SXRlbVR5cGU+KFxuICBvcHRpb25zOiBCYXRjaGVyT3B0aW9uc1R5cGU8SXRlbVR5cGU+XG4pOiBCYXRjaGVyVHlwZTxJdGVtVHlwZT4ge1xuICBsZXQgd2FpdEJhdGNoZXI6IEJhdGNoZXJUeXBlPEl0ZW1UeXBlPjtcbiAgbGV0IHRpbWVvdXQ6IE5vZGVKUy5UaW1lb3V0IHwgbnVsbDtcbiAgbGV0IGl0ZW1zOiBBcnJheTxJdGVtSG9sZGVyVHlwZTxJdGVtVHlwZT4+ID0gW107XG4gIGNvbnN0IHF1ZXVlID0gbmV3IFBRdWV1ZSh7XG4gICAgY29uY3VycmVuY3k6IDEsXG4gICAgdGltZW91dDogTUlOVVRFICogMzAsXG4gICAgdGhyb3dPblRpbWVvdXQ6IHRydWUsXG4gIH0pO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIF9raWNrQmF0Y2hPZmYoKSB7XG4gICAgY29uc3QgaXRlbXNSZWYgPSBpdGVtcztcbiAgICBpdGVtcyA9IFtdO1xuICAgIGF3YWl0IHF1ZXVlLmFkZChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBvcHRpb25zLnByb2Nlc3NCYXRjaChpdGVtc1JlZi5tYXAoaXRlbSA9PiBpdGVtLml0ZW0pKTtcbiAgICAgICAgaXRlbXNSZWYuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5yZXNvbHZlKSB7XG4gICAgICAgICAgICBpdGVtLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaXRlbXNSZWYuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5yZWplY3QpIHtcbiAgICAgICAgICAgIGl0ZW0ucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX21ha2VFeHBsb2RlZFByb21pc2UoKTogRXhwbG9kZWRQcm9taXNlVHlwZSB7XG4gICAgbGV0IHJlc29sdmU7XG4gICAgbGV0IHJlamVjdDtcblxuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZVBhcmFtLCByZWplY3RQYXJhbSkgPT4ge1xuICAgICAgcmVzb2x2ZSA9IHJlc29sdmVQYXJhbTtcbiAgICAgIHJlamVjdCA9IHJlamVjdFBhcmFtO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0IH07XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBhZGQoaXRlbTogSXRlbVR5cGUpIHtcbiAgICBjb25zdCB7IHByb21pc2UsIHJlc29sdmUsIHJlamVjdCB9ID0gX21ha2VFeHBsb2RlZFByb21pc2UoKTtcblxuICAgIGl0ZW1zLnB1c2goe1xuICAgICAgcmVzb2x2ZSxcbiAgICAgIHJlamVjdCxcbiAgICAgIGl0ZW0sXG4gICAgfSk7XG5cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBTZXQgdGltZW91dCBvbmNlIHdoZW4gd2UganVzdCBwdXNoZWQgdGhlIGZpcnN0IGl0ZW0gc28gdGhhdCB0aGUgd2FpdFxuICAgICAgLy8gdGltZSBpcyBib3VuZGVkIGJ5IGBvcHRpb25zLndhaXRgIGFuZCBub3QgZXh0ZW5kZWQgYnkgZnVydGhlciBwdXNoZXMuXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBfa2lja0JhdGNoT2ZmKCk7XG4gICAgICB9LCBvcHRpb25zLndhaXQpO1xuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID49IG9wdGlvbnMubWF4U2l6ZSkge1xuICAgICAgY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnkodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcblxuICAgICAgX2tpY2tCYXRjaE9mZigpO1xuICAgIH1cblxuICAgIGF3YWl0IHByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBhbnlQZW5kaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBxdWV1ZS5zaXplID4gMCB8fCBxdWV1ZS5wZW5kaW5nID4gMCB8fCBpdGVtcy5sZW5ndGggPiAwO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25JZGxlKCkge1xuICAgIHdoaWxlIChhbnlQZW5kaW5nKCkpIHtcbiAgICAgIGlmIChxdWV1ZS5zaXplID4gMCB8fCBxdWV1ZS5wZW5kaW5nID4gMCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBxdWV1ZS5vbklkbGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgc2xlZXAob3B0aW9ucy53YWl0ICogMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdW5yZWdpc3RlcigpIHtcbiAgICB3aW5kb3cud2FpdEJhdGNoZXJzID0gd2luZG93LndhaXRCYXRjaGVycy5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0gIT09IHdhaXRCYXRjaGVyXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZsdXNoQW5kV2FpdCgpIHtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGBGbHVzaGluZyBzdGFydCAke29wdGlvbnMubmFtZX0gZm9yIHdhaXRCYXRjaGVyIGAgK1xuICAgICAgICBgaXRlbXMubGVuZ3RoPSR7aXRlbXMubGVuZ3RofWBcbiAgICApO1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBudWxsO1xuXG4gICAgd2hpbGUgKGFueVBlbmRpbmcoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IF9raWNrQmF0Y2hPZmYoKTtcblxuICAgICAgaWYgKHF1ZXVlLnNpemUgPiAwIHx8IHF1ZXVlLnBlbmRpbmcgPiAwKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGF3YWl0IHF1ZXVlLm9uSWRsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxvZy5pbmZvKGBGbHVzaGluZyBjb21wbGV0ZSAke29wdGlvbnMubmFtZX0gZm9yIHdhaXRCYXRjaGVyYCk7XG4gIH1cblxuICB3YWl0QmF0Y2hlciA9IHtcbiAgICBhZGQsXG4gICAgYW55UGVuZGluZyxcbiAgICBvbklkbGUsXG4gICAgdW5yZWdpc3RlcixcbiAgICBmbHVzaEFuZFdhaXQsXG4gIH07XG5cbiAgd2luZG93LndhaXRCYXRjaGVycy5wdXNoKHdhaXRCYXRjaGVyKTtcblxuICByZXR1cm4gd2FpdEJhdGNoZXI7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EscUJBQW1CO0FBRW5CLG1CQUFzQjtBQUN0QixVQUFxQjtBQUNyQixhQUF3QjtBQUN4QixxQ0FBd0M7QUFDeEMsdUJBQXVCO0FBYXZC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
