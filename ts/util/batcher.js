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
var batcher_exports = {};
__export(batcher_exports, {
  createBatcher: () => createBatcher
});
module.exports = __toCommonJS(batcher_exports);
var import_p_queue = __toESM(require("p-queue"));
var import_sleep = require("./sleep");
var log = __toESM(require("../logging/log"));
var Errors = __toESM(require("../types/errors"));
var import_clearTimeoutIfNecessary = require("./clearTimeoutIfNecessary");
var import_durations = require("./durations");
window.batchers = [];
window.waitForAllBatchers = async () => {
  log.info("batcher#waitForAllBatchers");
  try {
    await Promise.all(window.batchers.map((item) => item.flushAndWait()));
  } catch (error) {
    log.error("waitForAllBatchers: error flushing all", Errors.toLogFormat(error));
  }
};
function createBatcher(options) {
  let batcher;
  let timeout;
  let items = [];
  const queue = new import_p_queue.default({
    concurrency: 1,
    timeout: import_durations.MINUTE * 30,
    throwOnTimeout: true
  });
  function _kickBatchOff() {
    (0, import_clearTimeoutIfNecessary.clearTimeoutIfNecessary)(timeout);
    timeout = null;
    const itemsRef = items;
    items = [];
    queue.add(async () => {
      await options.processBatch(itemsRef);
    });
  }
  function add(item) {
    items.push(item);
    if (items.length === 1) {
      timeout = setTimeout(_kickBatchOff, options.wait);
    } else if (items.length >= options.maxSize) {
      _kickBatchOff();
    }
  }
  function removeAll(needle) {
    items = items.filter((item) => item !== needle);
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
    window.batchers = window.batchers.filter((item) => item !== batcher);
  }
  async function flushAndWait() {
    log.info(`Flushing ${options.name} batcher items.length=${items.length}`);
    while (anyPending()) {
      _kickBatchOff();
      if (queue.size > 0 || queue.pending > 0) {
        await queue.onIdle();
      }
    }
    log.info(`Flushing complete ${options.name} for batcher`);
  }
  batcher = {
    add,
    removeAll,
    anyPending,
    onIdle,
    flushAndWait,
    unregister
  };
  window.batchers.push(batcher);
  return batcher;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createBatcher
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYmF0Y2hlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5cbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi9zbGVlcCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgeyBjbGVhclRpbWVvdXRJZk5lY2Vzc2FyeSB9IGZyb20gJy4vY2xlYXJUaW1lb3V0SWZOZWNlc3NhcnknO1xuaW1wb3J0IHsgTUlOVVRFIH0gZnJvbSAnLi9kdXJhdGlvbnMnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIC8vIFdlIHdhbnQgdG8gZXh0ZW5kIGB3aW5kb3dgJ3MgcHJvcGVydGllcywgc28gd2UgbmVlZCBhbiBpbnRlcmZhY2UuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGJhdGNoZXJzOiBBcnJheTxCYXRjaGVyVHlwZTxhbnk+PjtcbiAgICB3YWl0Rm9yQWxsQmF0Y2hlcnM6ICgpID0+IFByb21pc2U8dW5rbm93bj47XG4gIH1cbn1cblxud2luZG93LmJhdGNoZXJzID0gW107XG5cbndpbmRvdy53YWl0Rm9yQWxsQmF0Y2hlcnMgPSBhc3luYyAoKSA9PiB7XG4gIGxvZy5pbmZvKCdiYXRjaGVyI3dhaXRGb3JBbGxCYXRjaGVycycpO1xuICB0cnkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHdpbmRvdy5iYXRjaGVycy5tYXAoaXRlbSA9PiBpdGVtLmZsdXNoQW5kV2FpdCgpKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLmVycm9yKFxuICAgICAgJ3dhaXRGb3JBbGxCYXRjaGVyczogZXJyb3IgZmx1c2hpbmcgYWxsJyxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgdHlwZSBCYXRjaGVyT3B0aW9uc1R5cGU8SXRlbVR5cGU+ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHdhaXQ6IG51bWJlcjtcbiAgbWF4U2l6ZTogbnVtYmVyO1xuICBwcm9jZXNzQmF0Y2g6IChpdGVtczogQXJyYXk8SXRlbVR5cGU+KSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcbn07XG5cbmV4cG9ydCB0eXBlIEJhdGNoZXJUeXBlPEl0ZW1UeXBlPiA9IHtcbiAgYWRkOiAoaXRlbTogSXRlbVR5cGUpID0+IHZvaWQ7XG4gIHJlbW92ZUFsbDogKG5lZWRsZTogSXRlbVR5cGUpID0+IHZvaWQ7XG4gIGFueVBlbmRpbmc6ICgpID0+IGJvb2xlYW47XG4gIG9uSWRsZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZmx1c2hBbmRXYWl0OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICB1bnJlZ2lzdGVyOiAoKSA9PiB2b2lkO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhdGNoZXI8SXRlbVR5cGU+KFxuICBvcHRpb25zOiBCYXRjaGVyT3B0aW9uc1R5cGU8SXRlbVR5cGU+XG4pOiBCYXRjaGVyVHlwZTxJdGVtVHlwZT4ge1xuICBsZXQgYmF0Y2hlcjogQmF0Y2hlclR5cGU8SXRlbVR5cGU+O1xuICBsZXQgdGltZW91dDogTm9kZUpTLlRpbWVvdXQgfCBudWxsO1xuICBsZXQgaXRlbXM6IEFycmF5PEl0ZW1UeXBlPiA9IFtdO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBQUXVldWUoe1xuICAgIGNvbmN1cnJlbmN5OiAxLFxuICAgIHRpbWVvdXQ6IE1JTlVURSAqIDMwLFxuICAgIHRocm93T25UaW1lb3V0OiB0cnVlLFxuICB9KTtcblxuICBmdW5jdGlvbiBfa2lja0JhdGNoT2ZmKCkge1xuICAgIGNsZWFyVGltZW91dElmTmVjZXNzYXJ5KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBudWxsO1xuXG4gICAgY29uc3QgaXRlbXNSZWYgPSBpdGVtcztcbiAgICBpdGVtcyA9IFtdO1xuICAgIHF1ZXVlLmFkZChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBvcHRpb25zLnByb2Nlc3NCYXRjaChpdGVtc1JlZik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGQoaXRlbTogSXRlbVR5cGUpIHtcbiAgICBpdGVtcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gU2V0IHRpbWVvdXQgb25jZSB3aGVuIHdlIGp1c3QgcHVzaGVkIHRoZSBmaXJzdCBpdGVtIHNvIHRoYXQgdGhlIHdhaXRcbiAgICAgIC8vIHRpbWUgaXMgYm91bmRlZCBieSBgb3B0aW9ucy53YWl0YCBhbmQgbm90IGV4dGVuZGVkIGJ5IGZ1cnRoZXIgcHVzaGVzLlxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoX2tpY2tCYXRjaE9mZiwgb3B0aW9ucy53YWl0KTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1zLmxlbmd0aCA+PSBvcHRpb25zLm1heFNpemUpIHtcbiAgICAgIF9raWNrQmF0Y2hPZmYoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVBbGwobmVlZGxlOiBJdGVtVHlwZSkge1xuICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbSAhPT0gbmVlZGxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFueVBlbmRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHF1ZXVlLnNpemUgPiAwIHx8IHF1ZXVlLnBlbmRpbmcgPiAwIHx8IGl0ZW1zLmxlbmd0aCA+IDA7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBvbklkbGUoKSB7XG4gICAgd2hpbGUgKGFueVBlbmRpbmcoKSkge1xuICAgICAgaWYgKHF1ZXVlLnNpemUgPiAwIHx8IHF1ZXVlLnBlbmRpbmcgPiAwKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGF3YWl0IHF1ZXVlLm9uSWRsZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBzbGVlcChvcHRpb25zLndhaXQgKiAyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1bnJlZ2lzdGVyKCkge1xuICAgIHdpbmRvdy5iYXRjaGVycyA9IHdpbmRvdy5iYXRjaGVycy5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSBiYXRjaGVyKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZsdXNoQW5kV2FpdCgpIHtcbiAgICBsb2cuaW5mbyhgRmx1c2hpbmcgJHtvcHRpb25zLm5hbWV9IGJhdGNoZXIgaXRlbXMubGVuZ3RoPSR7aXRlbXMubGVuZ3RofWApO1xuXG4gICAgd2hpbGUgKGFueVBlbmRpbmcoKSkge1xuICAgICAgX2tpY2tCYXRjaE9mZigpO1xuXG4gICAgICBpZiAocXVldWUuc2l6ZSA+IDAgfHwgcXVldWUucGVuZGluZyA+IDApIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgYXdhaXQgcXVldWUub25JZGxlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGxvZy5pbmZvKGBGbHVzaGluZyBjb21wbGV0ZSAke29wdGlvbnMubmFtZX0gZm9yIGJhdGNoZXJgKTtcbiAgfVxuXG4gIGJhdGNoZXIgPSB7XG4gICAgYWRkLFxuICAgIHJlbW92ZUFsbCxcbiAgICBhbnlQZW5kaW5nLFxuICAgIG9uSWRsZSxcbiAgICBmbHVzaEFuZFdhaXQsXG4gICAgdW5yZWdpc3RlcixcbiAgfTtcblxuICB3aW5kb3cuYmF0Y2hlcnMucHVzaChiYXRjaGVyKTtcblxuICByZXR1cm4gYmF0Y2hlcjtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxxQkFBbUI7QUFFbkIsbUJBQXNCO0FBQ3RCLFVBQXFCO0FBQ3JCLGFBQXdCO0FBQ3hCLHFDQUF3QztBQUN4Qyx1QkFBdUI7QUFZdkIsT0FBTyxXQUFXLENBQUM7QUFFbkIsT0FBTyxxQkFBcUIsWUFBWTtBQUN0QyxNQUFJLEtBQUssNEJBQTRCO0FBQ3JDLE1BQUk7QUFDRixVQUFNLFFBQVEsSUFBSSxPQUFPLFNBQVMsSUFBSSxVQUFRLEtBQUssYUFBYSxDQUFDLENBQUM7QUFBQSxFQUNwRSxTQUFTLE9BQVA7QUFDQSxRQUFJLE1BQ0YsMENBQ0EsT0FBTyxZQUFZLEtBQUssQ0FDMUI7QUFBQSxFQUNGO0FBQ0Y7QUFrQk8sdUJBQ0wsU0FDdUI7QUFDdkIsTUFBSTtBQUNKLE1BQUk7QUFDSixNQUFJLFFBQXlCLENBQUM7QUFDOUIsUUFBTSxRQUFRLElBQUksdUJBQU87QUFBQSxJQUN2QixhQUFhO0FBQUEsSUFDYixTQUFTLDBCQUFTO0FBQUEsSUFDbEIsZ0JBQWdCO0FBQUEsRUFDbEIsQ0FBQztBQUVELDJCQUF5QjtBQUN2QixnRUFBd0IsT0FBTztBQUMvQixjQUFVO0FBRVYsVUFBTSxXQUFXO0FBQ2pCLFlBQVEsQ0FBQztBQUNULFVBQU0sSUFBSSxZQUFZO0FBQ3BCLFlBQU0sUUFBUSxhQUFhLFFBQVE7QUFBQSxJQUNyQyxDQUFDO0FBQUEsRUFDSDtBQVRTLEFBV1QsZUFBYSxNQUFnQjtBQUMzQixVQUFNLEtBQUssSUFBSTtBQUVmLFFBQUksTUFBTSxXQUFXLEdBQUc7QUFHdEIsZ0JBQVUsV0FBVyxlQUFlLFFBQVEsSUFBSTtBQUFBLElBQ2xELFdBQVcsTUFBTSxVQUFVLFFBQVEsU0FBUztBQUMxQyxvQkFBYztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQVZTLEFBWVQscUJBQW1CLFFBQWtCO0FBQ25DLFlBQVEsTUFBTSxPQUFPLFVBQVEsU0FBUyxNQUFNO0FBQUEsRUFDOUM7QUFGUyxBQUlULHdCQUErQjtBQUM3QixXQUFPLE1BQU0sT0FBTyxLQUFLLE1BQU0sVUFBVSxLQUFLLE1BQU0sU0FBUztBQUFBLEVBQy9EO0FBRlMsQUFJVCwwQkFBd0I7QUFDdEIsV0FBTyxXQUFXLEdBQUc7QUFDbkIsVUFBSSxNQUFNLE9BQU8sS0FBSyxNQUFNLFVBQVUsR0FBRztBQUV2QyxjQUFNLE1BQU0sT0FBTztBQUFBLE1BQ3JCO0FBRUEsVUFBSSxNQUFNLFNBQVMsR0FBRztBQUVwQixjQUFNLHdCQUFNLFFBQVEsT0FBTyxDQUFDO0FBQUEsTUFDOUI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQVplLEFBY2Ysd0JBQXNCO0FBQ3BCLFdBQU8sV0FBVyxPQUFPLFNBQVMsT0FBTyxVQUFRLFNBQVMsT0FBTztBQUFBLEVBQ25FO0FBRlMsQUFJVCxnQ0FBOEI7QUFDNUIsUUFBSSxLQUFLLFlBQVksUUFBUSw2QkFBNkIsTUFBTSxRQUFRO0FBRXhFLFdBQU8sV0FBVyxHQUFHO0FBQ25CLG9CQUFjO0FBRWQsVUFBSSxNQUFNLE9BQU8sS0FBSyxNQUFNLFVBQVUsR0FBRztBQUV2QyxjQUFNLE1BQU0sT0FBTztBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUNBLFFBQUksS0FBSyxxQkFBcUIsUUFBUSxrQkFBa0I7QUFBQSxFQUMxRDtBQVplLEFBY2YsWUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxTQUFPLFNBQVMsS0FBSyxPQUFPO0FBRTVCLFNBQU87QUFDVDtBQXZGZ0IiLAogICJuYW1lcyI6IFtdCn0K
