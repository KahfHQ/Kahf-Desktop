var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var StickerGrid_exports = {};
__export(StickerGrid_exports, {
  StickerGrid: () => StickerGrid
});
module.exports = __toCommonJS(StickerGrid_exports);
var React = __toESM(require("react"));
var import_p_queue = __toESM(require("p-queue"));
var import_react_sortable_hoc = require("react-sortable-hoc");
var styles = __toESM(require("./StickerGrid.scss"));
var import_StickerFrame = require("./StickerFrame");
var import_store = require("../store");
var import_DropZone = require("../elements/DropZone");
var import_preload = require("../util/preload");
var import_i18n = require("../util/i18n");
var import_durations = require("../../ts/util/durations");
const queue = new import_p_queue.default({ concurrency: 3, timeout: import_durations.MINUTE * 30 });
const SmartStickerFrame = (0, import_react_sortable_hoc.SortableElement)(({ id, showGuide, mode }) => {
  const data = import_store.stickersDuck.useStickerData(id);
  const actions = import_store.stickersDuck.useStickerActions();
  const image = data.imageData ? data.imageData.src : void 0;
  return /* @__PURE__ */ React.createElement(import_StickerFrame.StickerFrame, {
    id,
    showGuide,
    mode,
    image,
    onRemove: actions.removeSticker,
    onPickEmoji: actions.setEmoji,
    emojiData: data.emoji
  });
});
const InnerGrid = (0, import_react_sortable_hoc.SortableContainer)(({ ids, mode, showGuide }) => {
  const i18n = (0, import_i18n.useI18n)();
  const containerClassName = ids.length > 0 ? styles.grid : styles.drop;
  const frameMode = mode === "add" ? "removable" : "pick-emoji";
  const actions = import_store.stickersDuck.useStickerActions();
  const handleDrop = React.useCallback(async (paths) => {
    actions.initializeStickers(paths);
    paths.forEach((path) => {
      queue.add(async () => {
        try {
          const stickerImage = await (0, import_preload.processStickerImage)(path);
          actions.addImageData(stickerImage);
        } catch (e) {
          window.SignalContext.log.error("Error processing image:", e?.stack ? e.stack : String(e));
          actions.removeSticker(path);
          actions.addToast({
            key: (e || {}).errorMessageI18nKey || "StickerCreator--Toasts--errorProcessing"
          });
        }
      });
    });
  }, [actions]);
  return /* @__PURE__ */ React.createElement("div", {
    className: containerClassName
  }, ids.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, ids.map((p, i) => /* @__PURE__ */ React.createElement(SmartStickerFrame, {
    key: p,
    index: i,
    id: p,
    showGuide,
    mode: frameMode
  })), mode === "add" && ids.length < import_store.stickersDuck.maxStickers ? /* @__PURE__ */ React.createElement(import_StickerFrame.StickerFrame, {
    showGuide,
    mode: "add",
    onDrop: handleDrop
  }) : null) : /* @__PURE__ */ React.createElement(import_DropZone.DropZone, {
    label: i18n("StickerCreator--DropStage--dragDrop"),
    onDrop: handleDrop
  }));
});
const StickerGrid = (0, import_react_sortable_hoc.SortableContainer)((props) => {
  const ids = import_store.stickersDuck.useStickerOrder();
  const actions = import_store.stickersDuck.useStickerActions();
  const handleSortEnd = React.useCallback((sortEnd) => {
    actions.moveSticker(sortEnd);
  }, [actions]);
  return /* @__PURE__ */ React.createElement(InnerGrid, {
    ...props,
    ids,
    axis: "xy",
    onSortEnd: handleSortEnd,
    useDragHandle: true
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StickerGrid
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RpY2tlckdyaWQudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIwIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCB0eXBlIHsgU29ydEVuZEhhbmRsZXIgfSBmcm9tICdyZWFjdC1zb3J0YWJsZS1ob2MnO1xuaW1wb3J0IHsgU29ydGFibGVDb250YWluZXIsIFNvcnRhYmxlRWxlbWVudCB9IGZyb20gJ3JlYWN0LXNvcnRhYmxlLWhvYyc7XG5pbXBvcnQgKiBhcyBzdHlsZXMgZnJvbSAnLi9TdGlja2VyR3JpZC5zY3NzJztcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgU3RpY2tlckZyYW1lUHJvcHMgfSBmcm9tICcuL1N0aWNrZXJGcmFtZSc7XG5pbXBvcnQgeyBTdGlja2VyRnJhbWUgfSBmcm9tICcuL1N0aWNrZXJGcmFtZSc7XG5pbXBvcnQgeyBzdGlja2Vyc0R1Y2sgfSBmcm9tICcuLi9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IFByb3BzIGFzIERyb3Bab25lUHJvcHMgfSBmcm9tICcuLi9lbGVtZW50cy9Ecm9wWm9uZSc7XG5pbXBvcnQgeyBEcm9wWm9uZSB9IGZyb20gJy4uL2VsZW1lbnRzL0Ryb3Bab25lJztcbmltcG9ydCB7IHByb2Nlc3NTdGlja2VySW1hZ2UgfSBmcm9tICcuLi91dGlsL3ByZWxvYWQnO1xuaW1wb3J0IHsgdXNlSTE4biB9IGZyb20gJy4uL3V0aWwvaTE4bic7XG5pbXBvcnQgeyBNSU5VVEUgfSBmcm9tICcuLi8uLi90cy91dGlsL2R1cmF0aW9ucyc7XG5cbmNvbnN0IHF1ZXVlID0gbmV3IFBRdWV1ZSh7IGNvbmN1cnJlbmN5OiAzLCB0aW1lb3V0OiBNSU5VVEUgKiAzMCB9KTtcblxudHlwZSBTbWFydFN0aWNrZXJGcmFtZVByb3BzID0gT21pdDxTdGlja2VyRnJhbWVQcm9wcywgJ2lkJz4gJiB7IGlkOiBzdHJpbmcgfTtcblxuY29uc3QgU21hcnRTdGlja2VyRnJhbWUgPSBTb3J0YWJsZUVsZW1lbnQoXG4gICh7IGlkLCBzaG93R3VpZGUsIG1vZGUgfTogU21hcnRTdGlja2VyRnJhbWVQcm9wcykgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBzdGlja2Vyc0R1Y2sudXNlU3RpY2tlckRhdGEoaWQpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBzdGlja2Vyc0R1Y2sudXNlU3RpY2tlckFjdGlvbnMoKTtcbiAgICBjb25zdCBpbWFnZSA9IGRhdGEuaW1hZ2VEYXRhID8gZGF0YS5pbWFnZURhdGEuc3JjIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGlja2VyRnJhbWVcbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBzaG93R3VpZGU9e3Nob3dHdWlkZX1cbiAgICAgICAgbW9kZT17bW9kZX1cbiAgICAgICAgaW1hZ2U9e2ltYWdlfVxuICAgICAgICBvblJlbW92ZT17YWN0aW9ucy5yZW1vdmVTdGlja2VyfVxuICAgICAgICBvblBpY2tFbW9qaT17YWN0aW9ucy5zZXRFbW9qaX1cbiAgICAgICAgZW1vamlEYXRhPXtkYXRhLmVtb2ppfVxuICAgICAgLz5cbiAgICApO1xuICB9XG4pO1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IFBpY2s8U3RpY2tlckZyYW1lUHJvcHMsICdzaG93R3VpZGUnIHwgJ21vZGUnPjtcblxuZXhwb3J0IHR5cGUgSW5uZXJHcmlkUHJvcHMgPSBQcm9wcyAmIHtcbiAgaWRzOiBBcnJheTxzdHJpbmc+O1xufTtcblxuY29uc3QgSW5uZXJHcmlkID0gU29ydGFibGVDb250YWluZXIoXG4gICh7IGlkcywgbW9kZSwgc2hvd0d1aWRlIH06IElubmVyR3JpZFByb3BzKSA9PiB7XG4gICAgY29uc3QgaTE4biA9IHVzZUkxOG4oKTtcbiAgICBjb25zdCBjb250YWluZXJDbGFzc05hbWUgPSBpZHMubGVuZ3RoID4gMCA/IHN0eWxlcy5ncmlkIDogc3R5bGVzLmRyb3A7XG4gICAgY29uc3QgZnJhbWVNb2RlID0gbW9kZSA9PT0gJ2FkZCcgPyAncmVtb3ZhYmxlJyA6ICdwaWNrLWVtb2ppJztcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBzdGlja2Vyc0R1Y2sudXNlU3RpY2tlckFjdGlvbnMoKTtcblxuICAgIGNvbnN0IGhhbmRsZURyb3AgPSBSZWFjdC51c2VDYWxsYmFjazxEcm9wWm9uZVByb3BzWydvbkRyb3AnXT4oXG4gICAgICBhc3luYyBwYXRocyA9PiB7XG4gICAgICAgIGFjdGlvbnMuaW5pdGlhbGl6ZVN0aWNrZXJzKHBhdGhzKTtcbiAgICAgICAgcGF0aHMuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgICAgICBxdWV1ZS5hZGQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3Qgc3RpY2tlckltYWdlID0gYXdhaXQgcHJvY2Vzc1N0aWNrZXJJbWFnZShwYXRoKTtcbiAgICAgICAgICAgICAgYWN0aW9ucy5hZGRJbWFnZURhdGEoc3RpY2tlckltYWdlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgd2luZG93LlNpZ25hbENvbnRleHQubG9nLmVycm9yKFxuICAgICAgICAgICAgICAgICdFcnJvciBwcm9jZXNzaW5nIGltYWdlOicsXG4gICAgICAgICAgICAgICAgZT8uc3RhY2sgPyBlLnN0YWNrIDogU3RyaW5nKGUpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFjdGlvbnMucmVtb3ZlU3RpY2tlcihwYXRoKTtcbiAgICAgICAgICAgICAgYWN0aW9ucy5hZGRUb2FzdCh7XG4gICAgICAgICAgICAgICAga2V5OlxuICAgICAgICAgICAgICAgICAgKGUgfHwge30pLmVycm9yTWVzc2FnZUkxOG5LZXkgfHxcbiAgICAgICAgICAgICAgICAgICdTdGlja2VyQ3JlYXRvci0tVG9hc3RzLS1lcnJvclByb2Nlc3NpbmcnLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgW2FjdGlvbnNdXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y29udGFpbmVyQ2xhc3NOYW1lfT5cbiAgICAgICAge2lkcy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICB7aWRzLm1hcCgocCwgaSkgPT4gKFxuICAgICAgICAgICAgICA8U21hcnRTdGlja2VyRnJhbWVcbiAgICAgICAgICAgICAgICBrZXk9e3B9XG4gICAgICAgICAgICAgICAgaW5kZXg9e2l9XG4gICAgICAgICAgICAgICAgaWQ9e3B9XG4gICAgICAgICAgICAgICAgc2hvd0d1aWRlPXtzaG93R3VpZGV9XG4gICAgICAgICAgICAgICAgbW9kZT17ZnJhbWVNb2RlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICB7bW9kZSA9PT0gJ2FkZCcgJiYgaWRzLmxlbmd0aCA8IHN0aWNrZXJzRHVjay5tYXhTdGlja2VycyA/IChcbiAgICAgICAgICAgICAgPFN0aWNrZXJGcmFtZVxuICAgICAgICAgICAgICAgIHNob3dHdWlkZT17c2hvd0d1aWRlfVxuICAgICAgICAgICAgICAgIG1vZGU9XCJhZGRcIlxuICAgICAgICAgICAgICAgIG9uRHJvcD17aGFuZGxlRHJvcH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxEcm9wWm9uZVxuICAgICAgICAgICAgbGFiZWw9e2kxOG4oJ1N0aWNrZXJDcmVhdG9yLS1Ecm9wU3RhZ2UtLWRyYWdEcm9wJyl9XG4gICAgICAgICAgICBvbkRyb3A9e2hhbmRsZURyb3B9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBTdGlja2VyR3JpZCA9IFNvcnRhYmxlQ29udGFpbmVyKChwcm9wczogUHJvcHMpID0+IHtcbiAgY29uc3QgaWRzID0gc3RpY2tlcnNEdWNrLnVzZVN0aWNrZXJPcmRlcigpO1xuICBjb25zdCBhY3Rpb25zID0gc3RpY2tlcnNEdWNrLnVzZVN0aWNrZXJBY3Rpb25zKCk7XG4gIGNvbnN0IGhhbmRsZVNvcnRFbmQgPSBSZWFjdC51c2VDYWxsYmFjazxTb3J0RW5kSGFuZGxlcj4oXG4gICAgc29ydEVuZCA9PiB7XG4gICAgICBhY3Rpb25zLm1vdmVTdGlja2VyKHNvcnRFbmQpO1xuICAgIH0sXG4gICAgW2FjdGlvbnNdXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8SW5uZXJHcmlkXG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBpZHM9e2lkc31cbiAgICAgIGF4aXM9XCJ4eVwiXG4gICAgICBvblNvcnRFbmQ9e2hhbmRsZVNvcnRFbmR9XG4gICAgICB1c2VEcmFnSGFuZGxlXG4gICAgLz5cbiAgKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsWUFBdUI7QUFDdkIscUJBQW1CO0FBRW5CLGdDQUFtRDtBQUNuRCxhQUF3QjtBQUV4QiwwQkFBNkI7QUFDN0IsbUJBQTZCO0FBRTdCLHNCQUF5QjtBQUN6QixxQkFBb0M7QUFDcEMsa0JBQXdCO0FBQ3hCLHVCQUF1QjtBQUV2QixNQUFNLFFBQVEsSUFBSSx1QkFBTyxFQUFFLGFBQWEsR0FBRyxTQUFTLDBCQUFTLEdBQUcsQ0FBQztBQUlqRSxNQUFNLG9CQUFvQiwrQ0FDeEIsQ0FBQyxFQUFFLElBQUksV0FBVyxXQUFtQztBQUNuRCxRQUFNLE9BQU8sMEJBQWEsZUFBZSxFQUFFO0FBQzNDLFFBQU0sVUFBVSwwQkFBYSxrQkFBa0I7QUFDL0MsUUFBTSxRQUFRLEtBQUssWUFBWSxLQUFLLFVBQVUsTUFBTTtBQUVwRCxTQUNFLG9DQUFDO0FBQUEsSUFDQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsVUFBVSxRQUFRO0FBQUEsSUFDbEIsYUFBYSxRQUFRO0FBQUEsSUFDckIsV0FBVyxLQUFLO0FBQUEsR0FDbEI7QUFFSixDQUNGO0FBUUEsTUFBTSxZQUFZLGlEQUNoQixDQUFDLEVBQUUsS0FBSyxNQUFNLGdCQUFnQztBQUM1QyxRQUFNLE9BQU8seUJBQVE7QUFDckIsUUFBTSxxQkFBcUIsSUFBSSxTQUFTLElBQUksT0FBTyxPQUFPLE9BQU87QUFDakUsUUFBTSxZQUFZLFNBQVMsUUFBUSxjQUFjO0FBRWpELFFBQU0sVUFBVSwwQkFBYSxrQkFBa0I7QUFFL0MsUUFBTSxhQUFhLE1BQU0sWUFDdkIsT0FBTSxVQUFTO0FBQ2IsWUFBUSxtQkFBbUIsS0FBSztBQUNoQyxVQUFNLFFBQVEsVUFBUTtBQUNwQixZQUFNLElBQUksWUFBWTtBQUNwQixZQUFJO0FBQ0YsZ0JBQU0sZUFBZSxNQUFNLHdDQUFvQixJQUFJO0FBQ25ELGtCQUFRLGFBQWEsWUFBWTtBQUFBLFFBQ25DLFNBQVMsR0FBUDtBQUNBLGlCQUFPLGNBQWMsSUFBSSxNQUN2QiwyQkFDQSxHQUFHLFFBQVEsRUFBRSxRQUFRLE9BQU8sQ0FBQyxDQUMvQjtBQUNBLGtCQUFRLGNBQWMsSUFBSTtBQUMxQixrQkFBUSxTQUFTO0FBQUEsWUFDZixLQUNHLE1BQUssQ0FBQyxHQUFHLHVCQUNWO0FBQUEsVUFDSixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0gsR0FDQSxDQUFDLE9BQU8sQ0FDVjtBQUVBLFNBQ0Usb0NBQUM7QUFBQSxJQUFJLFdBQVc7QUFBQSxLQUNiLElBQUksU0FBUyxJQUNaLDBEQUNHLElBQUksSUFBSSxDQUFDLEdBQUcsTUFDWCxvQ0FBQztBQUFBLElBQ0MsS0FBSztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0o7QUFBQSxJQUNBLE1BQU07QUFBQSxHQUNSLENBQ0QsR0FDQSxTQUFTLFNBQVMsSUFBSSxTQUFTLDBCQUFhLGNBQzNDLG9DQUFDO0FBQUEsSUFDQztBQUFBLElBQ0EsTUFBSztBQUFBLElBQ0wsUUFBUTtBQUFBLEdBQ1YsSUFDRSxJQUNOLElBRUEsb0NBQUM7QUFBQSxJQUNDLE9BQU8sS0FBSyxxQ0FBcUM7QUFBQSxJQUNqRCxRQUFRO0FBQUEsR0FDVixDQUVKO0FBRUosQ0FDRjtBQUVPLE1BQU0sY0FBYyxpREFBa0IsQ0FBQyxVQUFpQjtBQUM3RCxRQUFNLE1BQU0sMEJBQWEsZ0JBQWdCO0FBQ3pDLFFBQU0sVUFBVSwwQkFBYSxrQkFBa0I7QUFDL0MsUUFBTSxnQkFBZ0IsTUFBTSxZQUMxQixhQUFXO0FBQ1QsWUFBUSxZQUFZLE9BQU87QUFBQSxFQUM3QixHQUNBLENBQUMsT0FBTyxDQUNWO0FBRUEsU0FDRSxvQ0FBQztBQUFBLE9BQ0s7QUFBQSxJQUNKO0FBQUEsSUFDQSxNQUFLO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxlQUFhO0FBQUEsR0FDZjtBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
