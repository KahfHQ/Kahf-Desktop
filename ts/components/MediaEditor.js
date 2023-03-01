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
var MediaEditor_exports = {};
__export(MediaEditor_exports, {
  MediaEditor: () => MediaEditor
});
module.exports = __toCommonJS(MediaEditor_exports);
var import_react_measure = __toESM(require("react-measure"));
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_react_dom = require("react-dom");
var import_fabric = require("fabric");
var import_lodash = require("lodash");
var log = __toESM(require("../logging/log"));
var import_Button = require("./Button");
var import_ContextMenu = require("./ContextMenu");
var import_Slider = require("./Slider");
var import_StickerButton = require("./stickers/StickerButton");
var import_theme = require("../util/theme");
var import_canvasToBytes = require("../util/canvasToBytes");
var import_useFabricHistory = require("../mediaEditor/useFabricHistory");
var import_usePortal = require("../hooks/usePortal");
var import_useUniqueId = require("../hooks/useUniqueId");
var import_MediaEditorFabricPencilBrush = require("../mediaEditor/MediaEditorFabricPencilBrush");
var import_MediaEditorFabricCropRect = require("../mediaEditor/MediaEditorFabricCropRect");
var import_MediaEditorFabricIText = require("../mediaEditor/MediaEditorFabricIText");
var import_MediaEditorFabricSticker = require("../mediaEditor/MediaEditorFabricSticker");
var import_fabricEffectListener = require("../mediaEditor/fabricEffectListener");
var import_color = require("../mediaEditor/util/color");
var import_getTextStyleAttributes = require("../mediaEditor/util/getTextStyleAttributes");
const INITIAL_IMAGE_STATE = {
  angle: 0,
  cropX: 0,
  cropY: 0,
  flipX: false,
  flipY: false,
  height: 0,
  width: 0
};
var EditMode = /* @__PURE__ */ ((EditMode2) => {
  EditMode2["Crop"] = "Crop";
  EditMode2["Draw"] = "Draw";
  EditMode2["Text"] = "Text";
  return EditMode2;
})(EditMode || {});
var DrawWidth = /* @__PURE__ */ ((DrawWidth2) => {
  DrawWidth2[DrawWidth2["Thin"] = 2] = "Thin";
  DrawWidth2[DrawWidth2["Regular"] = 4] = "Regular";
  DrawWidth2[DrawWidth2["Medium"] = 12] = "Medium";
  DrawWidth2[DrawWidth2["Heavy"] = 24] = "Heavy";
  return DrawWidth2;
})(DrawWidth || {});
var DrawTool = /* @__PURE__ */ ((DrawTool2) => {
  DrawTool2["Pen"] = "Pen";
  DrawTool2["Highlighter"] = "Highlighter";
  return DrawTool2;
})(DrawTool || {});
function isCmdOrCtrl(ev) {
  const { ctrlKey, metaKey } = ev;
  const commandKey = (0, import_lodash.get)(window, "platform") === "darwin" && metaKey;
  const controlKey = (0, import_lodash.get)(window, "platform") !== "darwin" && ctrlKey;
  return commandKey || controlKey;
}
const MediaEditor = /* @__PURE__ */ __name(({
  doneButtonLabel,
  i18n,
  imageSrc,
  onClose,
  onDone,
  installedPacks,
  recentStickers
}) => {
  const [fabricCanvas, setFabricCanvas] = (0, import_react.useState)();
  const [image, setImage] = (0, import_react.useState)(new Image());
  const canvasId = (0, import_useUniqueId.useUniqueId)();
  const [imageState, setImageState] = (0, import_react.useState)(INITIAL_IMAGE_STATE);
  const { canRedo, canUndo, redoIfPossible, takeSnapshot, undoIfPossible } = (0, import_useFabricHistory.useFabricHistory)({
    fabricCanvas,
    imageState,
    setImageState
  });
  (0, import_react.useEffect)(() => {
    if (fabricCanvas) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImage(img);
      const canvas = new import_fabric.fabric.Canvas(canvasId);
      canvas.selection = false;
      setFabricCanvas(canvas);
      const newImageState = {
        ...INITIAL_IMAGE_STATE,
        height: img.height,
        width: img.width
      };
      setImageState(newImageState);
      takeSnapshot("initial state", newImageState, canvas);
    };
    img.onerror = () => {
      log.error("<MediaEditor>: image failed to load. Closing");
      onClose();
    };
    img.src = imageSrc;
    return () => {
      img.onload = import_lodash.noop;
      img.onerror = import_lodash.noop;
    };
  }, [canvasId, fabricCanvas, imageSrc, onClose, takeSnapshot]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return import_lodash.noop;
    }
    const globalShortcuts = [
      [
        (ev) => isCmdOrCtrl(ev) && ev.key === "c",
        () => setEditMode("Crop" /* Crop */)
      ],
      [
        (ev) => isCmdOrCtrl(ev) && ev.key === "d",
        () => setEditMode("Draw" /* Draw */)
      ],
      [
        (ev) => isCmdOrCtrl(ev) && ev.key === "t",
        () => setEditMode("Text" /* Text */)
      ],
      [(ev) => isCmdOrCtrl(ev) && ev.key === "z", undoIfPossible],
      [(ev) => isCmdOrCtrl(ev) && ev.shiftKey && ev.key === "z", redoIfPossible],
      [
        (ev) => ev.key === "Escape",
        () => {
          setEditMode(void 0);
          if (fabricCanvas.getActiveObject()) {
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
          }
        }
      ]
    ];
    const objectShortcuts = [
      [
        (ev) => ev.key === "Delete",
        (obj) => {
          fabricCanvas.remove(obj);
          setEditMode(void 0);
        }
      ],
      [
        (ev) => ev.key === "ArrowUp",
        (obj, ev) => {
          const px = ev.shiftKey ? 20 : 1;
          if (ev.altKey) {
            obj.set("angle", (obj.angle || 0) - px);
          } else {
            const { x, y } = obj.getCenterPoint();
            obj.setPositionByOrigin(new import_fabric.fabric.Point(x, y - px), "center", "center");
          }
          obj.setCoords();
          fabricCanvas.requestRenderAll();
        }
      ],
      [
        (ev) => ev.key === "ArrowLeft",
        (obj, ev) => {
          const px = ev.shiftKey ? 20 : 1;
          if (ev.altKey) {
            obj.set("angle", (obj.angle || 0) - px);
          } else {
            const { x, y } = obj.getCenterPoint();
            obj.setPositionByOrigin(new import_fabric.fabric.Point(x - px, y), "center", "center");
          }
          obj.setCoords();
          fabricCanvas.requestRenderAll();
        }
      ],
      [
        (ev) => ev.key === "ArrowDown",
        (obj, ev) => {
          const px = ev.shiftKey ? 20 : 1;
          if (ev.altKey) {
            obj.set("angle", (obj.angle || 0) + px);
          } else {
            const { x, y } = obj.getCenterPoint();
            obj.setPositionByOrigin(new import_fabric.fabric.Point(x, y + px), "center", "center");
          }
          obj.setCoords();
          fabricCanvas.requestRenderAll();
        }
      ],
      [
        (ev) => ev.key === "ArrowRight",
        (obj, ev) => {
          const px = ev.shiftKey ? 20 : 1;
          if (ev.altKey) {
            obj.set("angle", (obj.angle || 0) + px);
          } else {
            const { x, y } = obj.getCenterPoint();
            obj.setPositionByOrigin(new import_fabric.fabric.Point(x + px, y), "center", "center");
          }
          obj.setCoords();
          fabricCanvas.requestRenderAll();
        }
      ]
    ];
    function handleKeydown(ev) {
      if (!fabricCanvas) {
        return;
      }
      globalShortcuts.forEach(([conditional, runShortcut]) => {
        if (conditional(ev)) {
          runShortcut();
          ev.preventDefault();
          ev.stopPropagation();
        }
      });
      const obj = fabricCanvas.getActiveObject();
      if (!obj || obj.excludeFromExport || obj instanceof import_MediaEditorFabricIText.MediaEditorFabricIText && obj.isEditing) {
        return;
      }
      objectShortcuts.forEach(([conditional, runShortcut]) => {
        if (conditional(ev)) {
          runShortcut(obj, ev);
          ev.preventDefault();
          ev.stopPropagation();
        }
      });
    }
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [fabricCanvas, redoIfPossible, undoIfPossible]);
  const [containerWidth, setContainerWidth] = (0, import_react.useState)(0);
  const [containerHeight, setContainerHeight] = (0, import_react.useState)(0);
  const zoom = Math.min(containerWidth / imageState.width, containerHeight / imageState.height) || 1;
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas || !imageState.width || !imageState.height) {
      return;
    }
    fabricCanvas.setDimensions({
      width: imageState.width * zoom,
      height: imageState.height * zoom
    });
    fabricCanvas.setZoom(zoom);
  }, [
    containerHeight,
    containerWidth,
    fabricCanvas,
    imageState.height,
    imageState.width,
    zoom
  ]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    drawFabricBackgroundImage({ fabricCanvas, image, imageState });
  }, [fabricCanvas, image, imageState]);
  const [canCrop, setCanCrop] = (0, import_react.useState)(false);
  const [cropAspectRatioLock, setCropAspectRatioLock] = (0, import_react.useState)(false);
  const [drawTool, setDrawTool] = (0, import_react.useState)("Pen" /* Pen */);
  const [drawWidth, setDrawWidth] = (0, import_react.useState)(4 /* Regular */);
  const [editMode, setEditMode] = (0, import_react.useState)();
  const [sliderValue, setSliderValue] = (0, import_react.useState)(0);
  const [textStyle, setTextStyle] = (0, import_react.useState)(import_getTextStyleAttributes.TextStyle.Regular);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    return (0, import_fabricEffectListener.fabricEffectListener)(fabricCanvas, ["selection:created", "selection:updated", "selection:cleared"], () => {
      if (fabricCanvas?.getActiveObject() instanceof import_MediaEditorFabricIText.MediaEditorFabricIText) {
        setEditMode("Text" /* Text */);
      } else if (editMode === "Text" /* Text */) {
        setEditMode(void 0);
      }
    });
  }, [editMode, fabricCanvas]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    if (editMode === "Crop" /* Crop */) {
      fabricCanvas.uniformScaling = cropAspectRatioLock;
    } else {
      fabricCanvas.uniformScaling = true;
    }
  }, [cropAspectRatioLock, editMode, fabricCanvas]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    if (editMode !== "Text" /* Text */) {
      const obj = fabricCanvas.getActiveObject();
      if (obj && (0, import_lodash.has)(obj, "text") && (0, import_lodash.get)(obj, "text") === "") {
        fabricCanvas.remove(obj);
      }
    }
  }, [editMode, fabricCanvas]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    if (editMode !== "Draw" /* Draw */) {
      fabricCanvas.isDrawingMode = false;
      return;
    }
    fabricCanvas.discardActiveObject();
    fabricCanvas.isDrawingMode = true;
    const freeDrawingBrush = new import_MediaEditorFabricPencilBrush.MediaEditorFabricPencilBrush(fabricCanvas);
    if (drawTool === "Highlighter" /* Highlighter */) {
      freeDrawingBrush.color = (0, import_color.getRGBA)(sliderValue, 0.5);
      freeDrawingBrush.strokeLineCap = "square";
      freeDrawingBrush.strokeLineJoin = "miter";
      freeDrawingBrush.width = drawWidth / zoom * 2;
    } else {
      freeDrawingBrush.color = (0, import_color.getHSL)(sliderValue);
      freeDrawingBrush.strokeLineCap = "round";
      freeDrawingBrush.strokeLineJoin = "bevel";
      freeDrawingBrush.width = drawWidth / zoom;
    }
    fabricCanvas.freeDrawingBrush = freeDrawingBrush;
    fabricCanvas.requestRenderAll();
  }, [drawTool, drawWidth, editMode, fabricCanvas, sliderValue, zoom]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    const obj = fabricCanvas.getActiveObject();
    if (!obj || !(obj instanceof import_MediaEditorFabricIText.MediaEditorFabricIText)) {
      return;
    }
    const { isEditing } = obj;
    obj.exitEditing();
    obj.set((0, import_getTextStyleAttributes.getTextStyleAttributes)(textStyle, sliderValue));
    fabricCanvas.requestRenderAll();
    if (isEditing) {
      obj.enterEditing();
    }
  }, [fabricCanvas, sliderValue, textStyle]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    if (editMode === "Crop" /* Crop */) {
      const PADDING = import_MediaEditorFabricCropRect.MediaEditorFabricCropRect.PADDING / zoom;
      const height = imageState.height - PADDING * Math.max(440 / imageState.height, 2);
      const width = imageState.width - PADDING * Math.max(440 / imageState.width, 2);
      let rect;
      const obj = fabricCanvas.getActiveObject();
      if (obj instanceof import_MediaEditorFabricCropRect.MediaEditorFabricCropRect) {
        rect = obj;
        rect.set({ height, width, scaleX: 1, scaleY: 1 });
      } else {
        rect = new import_MediaEditorFabricCropRect.MediaEditorFabricCropRect({
          height,
          width
        });
        rect.on("modified", () => {
          const { height: currHeight, width: currWidth } = rect.getBoundingRect(true);
          setCanCrop(currHeight < height || currWidth < width);
        });
        rect.on("deselected", () => {
          setEditMode(void 0);
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
      }
      fabricCanvas.viewportCenterObject(rect);
      rect.setCoords();
    } else {
      fabricCanvas.getObjects().forEach((obj) => {
        if (obj instanceof import_MediaEditorFabricCropRect.MediaEditorFabricCropRect) {
          fabricCanvas.remove(obj);
        }
      });
    }
    setCanCrop(false);
  }, [editMode, fabricCanvas, imageState.height, imageState.width, zoom]);
  (0, import_react.useEffect)(() => {
    if (!fabricCanvas) {
      return;
    }
    if (editMode !== "Text" /* Text */) {
      return;
    }
    const obj = fabricCanvas.getActiveObject();
    if (obj instanceof import_MediaEditorFabricIText.MediaEditorFabricIText) {
      return;
    }
    const FONT_SIZE_RELATIVE_TO_CANVAS = 10;
    const fontSize = Math.min(imageState.width, imageState.height) / FONT_SIZE_RELATIVE_TO_CANVAS;
    const text = new import_MediaEditorFabricIText.MediaEditorFabricIText("", {
      ...(0, import_getTextStyleAttributes.getTextStyleAttributes)(textStyle, sliderValue),
      fontSize
    });
    text.setPositionByOrigin(new import_fabric.fabric.Point(imageState.width / 2, imageState.height / 2), "center", "center");
    text.setCoords();
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
  }, [
    editMode,
    fabricCanvas,
    imageState.height,
    imageState.width,
    sliderValue,
    textStyle
  ]);
  const [isSaving, setIsSaving] = (0, import_react.useState)(false);
  const portal = (0, import_usePortal.usePortal)();
  if (!portal) {
    return null;
  }
  let tooling;
  if (editMode === "Text" /* Text */) {
    tooling = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Slider.Slider, {
      handleStyle: { backgroundColor: (0, import_color.getHSL)(sliderValue) },
      label: i18n("CustomColorEditor__hue"),
      moduleClassName: "HueSlider MediaEditor__tools__tool",
      onChange: setSliderValue,
      value: sliderValue
    }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      i18n,
      menuOptions: [
        {
          icon: "MediaEditor__icon--text-regular",
          label: i18n("MediaEditor__text--regular"),
          onClick: () => setTextStyle(import_getTextStyleAttributes.TextStyle.Regular),
          value: import_getTextStyleAttributes.TextStyle.Regular
        },
        {
          icon: "MediaEditor__icon--text-highlight",
          label: i18n("MediaEditor__text--highlight"),
          onClick: () => setTextStyle(import_getTextStyleAttributes.TextStyle.Highlight),
          value: import_getTextStyleAttributes.TextStyle.Highlight
        },
        {
          icon: "MediaEditor__icon--text-outline",
          label: i18n("MediaEditor__text--outline"),
          onClick: () => setTextStyle(import_getTextStyleAttributes.TextStyle.Outline),
          value: import_getTextStyleAttributes.TextStyle.Outline
        }
      ],
      moduleClassName: (0, import_classnames.default)("MediaEditor__tools__tool", {
        "MediaEditor__tools__button--text-regular": textStyle === import_getTextStyleAttributes.TextStyle.Regular,
        "MediaEditor__tools__button--text-highlight": textStyle === import_getTextStyleAttributes.TextStyle.Highlight,
        "MediaEditor__tools__button--text-outline": textStyle === import_getTextStyleAttributes.TextStyle.Outline
      }),
      theme: import_theme.Theme.Dark,
      value: textStyle
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--words",
      onClick: () => {
        setEditMode(void 0);
        const activeObject = fabricCanvas?.getActiveObject();
        if (activeObject instanceof import_MediaEditorFabricIText.MediaEditorFabricIText) {
          activeObject.exitEditing();
        }
      },
      type: "button"
    }, i18n("done")));
  } else if (editMode === "Draw" /* Draw */) {
    tooling = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Slider.Slider, {
      handleStyle: { backgroundColor: (0, import_color.getHSL)(sliderValue) },
      label: i18n("CustomColorEditor__hue"),
      moduleClassName: "HueSlider MediaEditor__tools__tool",
      onChange: setSliderValue,
      value: sliderValue
    }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      i18n,
      menuOptions: [
        {
          icon: "MediaEditor__icon--draw-pen",
          label: i18n("MediaEditor__draw--pen"),
          onClick: () => setDrawTool("Pen" /* Pen */),
          value: "Pen" /* Pen */
        },
        {
          icon: "MediaEditor__icon--draw-highlighter",
          label: i18n("MediaEditor__draw--highlighter"),
          onClick: () => setDrawTool("Highlighter" /* Highlighter */),
          value: "Highlighter" /* Highlighter */
        }
      ],
      moduleClassName: (0, import_classnames.default)("MediaEditor__tools__tool", {
        "MediaEditor__tools__button--draw-pen": drawTool === "Pen" /* Pen */,
        "MediaEditor__tools__button--draw-highlighter": drawTool === "Highlighter" /* Highlighter */
      }),
      theme: import_theme.Theme.Dark,
      value: drawTool
    }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      i18n,
      menuOptions: [
        {
          icon: "MediaEditor__icon--width-thin",
          label: i18n("MediaEditor__draw--thin"),
          onClick: () => setDrawWidth(2 /* Thin */),
          value: 2 /* Thin */
        },
        {
          icon: "MediaEditor__icon--width-regular",
          label: i18n("MediaEditor__draw--regular"),
          onClick: () => setDrawWidth(4 /* Regular */),
          value: 4 /* Regular */
        },
        {
          icon: "MediaEditor__icon--width-medium",
          label: i18n("MediaEditor__draw--medium"),
          onClick: () => setDrawWidth(12 /* Medium */),
          value: 12 /* Medium */
        },
        {
          icon: "MediaEditor__icon--width-heavy",
          label: i18n("MediaEditor__draw--heavy"),
          onClick: () => setDrawWidth(24 /* Heavy */),
          value: 24 /* Heavy */
        }
      ],
      moduleClassName: (0, import_classnames.default)("MediaEditor__tools__tool", {
        "MediaEditor__tools__button--width-thin": drawWidth === 2 /* Thin */,
        "MediaEditor__tools__button--width-regular": drawWidth === 4 /* Regular */,
        "MediaEditor__tools__button--width-medium": drawWidth === 12 /* Medium */,
        "MediaEditor__tools__button--width-heavy": drawWidth === 24 /* Heavy */
      }),
      theme: import_theme.Theme.Dark,
      value: drawWidth
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--words",
      onClick: () => setEditMode(void 0),
      type: "button"
    }, i18n("done")));
  } else if (editMode === "Crop" /* Crop */) {
    const canReset = imageState.cropX !== 0 || imageState.cropY !== 0 || imageState.flipX || imageState.flipY || imageState.angle !== 0;
    tooling = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", {
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--words",
      disabled: !canReset,
      onClick: async () => {
        if (!fabricCanvas) {
          return;
        }
        const newImageState = {
          ...INITIAL_IMAGE_STATE,
          height: image.height,
          width: image.width
        };
        setImageState(newImageState);
        moveFabricObjectsForReset(fabricCanvas, imageState);
        takeSnapshot("reset", newImageState);
      },
      type: "button"
    }, i18n("MediaEditor__crop--reset")), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("MediaEditor__crop--rotate"),
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--rotate",
      onClick: () => {
        if (!fabricCanvas) {
          return;
        }
        fabricCanvas.getObjects().forEach((obj) => {
          if (obj instanceof import_MediaEditorFabricCropRect.MediaEditorFabricCropRect) {
            return;
          }
          const center = obj.getCenterPoint();
          obj.set("angle", ((obj.angle || 0) + 270) % 360);
          obj.setPositionByOrigin(new import_fabric.fabric.Point(center.y, imageState.width - center.x), "center", "center");
          obj.setCoords();
        });
        const newImageState = {
          ...imageState,
          angle: (imageState.angle + 270) % 360,
          height: imageState.width,
          width: imageState.height
        };
        setImageState(newImageState);
        takeSnapshot("rotate", newImageState);
      },
      type: "button"
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("MediaEditor__crop--flip"),
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--flip",
      onClick: () => {
        if (!fabricCanvas) {
          return;
        }
        const newImageState = {
          ...imageState,
          ...imageState.angle % 180 ? { flipY: !imageState.flipY } : { flipX: !imageState.flipX }
        };
        setImageState(newImageState);
        takeSnapshot("flip", newImageState);
      },
      type: "button"
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("MediaEditor__crop--lock"),
      className: (0, import_classnames.default)("MediaEditor__tools__button", `MediaEditor__tools__button--crop-${cropAspectRatioLock ? "" : "un"}locked`),
      onClick: () => {
        if (fabricCanvas) {
          fabricCanvas.uniformScaling = !cropAspectRatioLock;
        }
        setCropAspectRatioLock(!cropAspectRatioLock);
      },
      type: "button"
    }), /* @__PURE__ */ import_react.default.createElement("button", {
      className: "MediaEditor__tools__tool MediaEditor__tools__button MediaEditor__tools__button--words",
      disabled: !canCrop,
      onClick: () => {
        if (!fabricCanvas) {
          return;
        }
        const pendingCrop = getPendingCrop(fabricCanvas);
        if (!pendingCrop) {
          return;
        }
        const newImageState = getNewImageStateFromCrop(imageState, pendingCrop);
        setImageState(newImageState);
        moveFabricObjectsForCrop(fabricCanvas, pendingCrop);
        takeSnapshot("crop", newImageState);
        setEditMode(void 0);
      },
      type: "button"
    }, i18n("done")));
  }
  return (0, import_react_dom.createPortal)(/* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__container"
  }, /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
    bounds: true,
    onResize: ({ bounds }) => {
      if (!bounds) {
        log.error("We should be measuring the bounds");
        return;
      }
      setContainerWidth(bounds.width);
      setContainerHeight(bounds.height);
    }
  }, ({ measureRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__media",
    ref: measureRef
  }, image && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("canvas", {
    className: (0, import_classnames.default)("MediaEditor__media--canvas", {
      "MediaEditor__media--canvas--cropping": editMode === "Crop" /* Crop */
    }),
    id: canvasId
  }))))), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__toolbar"
  }, tooling ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__tools"
  }, tooling) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__toolbar--space"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__toolbar--buttons"
  }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    onClick: onClose,
    theme: import_theme.Theme.Dark,
    variant: import_Button.ButtonVariant.Secondary
  }, i18n("discard")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "MediaEditor__controls"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MediaEditor__control--draw"),
    className: (0, import_classnames.default)({
      MediaEditor__control: true,
      "MediaEditor__control--pen": true,
      "MediaEditor__control--selected": editMode === "Draw" /* Draw */
    }),
    onClick: () => {
      setEditMode(editMode === "Draw" /* Draw */ ? void 0 : "Draw" /* Draw */);
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MediaEditor__control--text"),
    className: (0, import_classnames.default)({
      MediaEditor__control: true,
      "MediaEditor__control--text": true,
      "MediaEditor__control--selected": editMode === "Text" /* Text */
    }),
    onClick: () => {
      if (editMode === "Text" /* Text */) {
        setEditMode(void 0);
        const obj = fabricCanvas?.getActiveObject();
        if (obj instanceof import_MediaEditorFabricIText.MediaEditorFabricIText) {
          obj.exitEditing();
        }
      } else {
        setEditMode("Text" /* Text */);
      }
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement(import_StickerButton.StickerButton, {
    blessedPacks: [],
    className: (0, import_classnames.default)({
      MediaEditor__control: true,
      "MediaEditor__control--sticker": true
    }),
    clearInstalledStickerPack: import_lodash.noop,
    clearShowIntroduction: () => {
      fabricCanvas?.discardActiveObject();
      setEditMode(void 0);
    },
    clearShowPickerHint: import_lodash.noop,
    i18n,
    installedPacks,
    knownPacks: [],
    onPickSticker: (_packId, _stickerId, src) => {
      if (!fabricCanvas) {
        return;
      }
      const STICKER_SIZE_RELATIVE_TO_CANVAS = 4;
      const size = Math.min(imageState.width, imageState.height) / STICKER_SIZE_RELATIVE_TO_CANVAS;
      const sticker = new import_MediaEditorFabricSticker.MediaEditorFabricSticker(src);
      sticker.scaleToHeight(size);
      sticker.setPositionByOrigin(new import_fabric.fabric.Point(imageState.width / 2, imageState.height / 2), "center", "center");
      sticker.setCoords();
      fabricCanvas.add(sticker);
      fabricCanvas.setActiveObject(sticker);
      setEditMode(void 0);
    },
    receivedPacks: [],
    recentStickers,
    showPickerHint: false,
    theme: import_theme.Theme.Dark
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MediaEditor__control--crop"),
    className: (0, import_classnames.default)({
      MediaEditor__control: true,
      "MediaEditor__control--crop": true,
      "MediaEditor__control--selected": editMode === "Crop" /* Crop */
    }),
    onClick: () => {
      if (!fabricCanvas) {
        return;
      }
      if (editMode === "Crop" /* Crop */) {
        const obj = fabricCanvas.getActiveObject();
        if (obj instanceof import_MediaEditorFabricCropRect.MediaEditorFabricCropRect) {
          fabricCanvas.remove(obj);
        }
        setEditMode(void 0);
      } else {
        setEditMode("Crop" /* Crop */);
      }
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MediaEditor__control--undo"),
    className: "MediaEditor__control MediaEditor__control--undo",
    disabled: !canUndo,
    onClick: () => {
      if (editMode === "Crop" /* Crop */) {
        setEditMode(void 0);
      }
      undoIfPossible();
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("MediaEditor__control--redo"),
    className: "MediaEditor__control MediaEditor__control--redo",
    disabled: !canRedo,
    onClick: () => {
      if (editMode === "Crop" /* Crop */) {
        setEditMode(void 0);
      }
      redoIfPossible();
    },
    type: "button"
  })), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    disabled: !image || isSaving,
    onClick: async () => {
      if (!fabricCanvas) {
        return;
      }
      setEditMode(void 0);
      setIsSaving(true);
      let data;
      try {
        const renderFabricCanvas = await cloneFabricCanvas(fabricCanvas);
        renderFabricCanvas.remove(...renderFabricCanvas.getObjects().filter((obj) => obj.excludeFromExport));
        let finalImageState;
        const pendingCrop = getPendingCrop(fabricCanvas);
        if (pendingCrop) {
          finalImageState = getNewImageStateFromCrop(imageState, pendingCrop);
          moveFabricObjectsForCrop(renderFabricCanvas, pendingCrop);
          drawFabricBackgroundImage({
            fabricCanvas: renderFabricCanvas,
            image,
            imageState: finalImageState
          });
        } else {
          finalImageState = imageState;
        }
        renderFabricCanvas.setDimensions({
          width: finalImageState.width,
          height: finalImageState.height
        });
        renderFabricCanvas.setZoom(1);
        const renderedCanvas = renderFabricCanvas.toCanvasElement();
        data = await (0, import_canvasToBytes.canvasToBytes)(renderedCanvas);
      } catch (err) {
        onClose();
        throw err;
      } finally {
        setIsSaving(false);
      }
      onDone(data);
    },
    theme: import_theme.Theme.Dark,
    variant: import_Button.ButtonVariant.Primary
  }, doneButtonLabel || i18n("save"))))), portal);
}, "MediaEditor");
function getPendingCrop(fabricCanvas) {
  const activeObject = fabricCanvas.getActiveObject();
  return activeObject instanceof import_MediaEditorFabricCropRect.MediaEditorFabricCropRect ? activeObject.getBoundingRect(true) : void 0;
}
function getNewImageStateFromCrop(state, { left, height, top, width }) {
  let cropX;
  let cropY;
  switch (state.angle) {
    case 0:
      cropX = state.cropX + left;
      cropY = state.cropY + top;
      break;
    case 90:
      cropX = state.cropX + top;
      cropY = state.cropY + (state.width - (left + width));
      break;
    case 180:
      cropX = state.cropX + (state.width - (left + width));
      cropY = state.cropY + (state.height - (top + height));
      break;
    case 270:
      cropX = state.cropX + (state.height - (top + height));
      cropY = state.cropY + left;
      break;
    default:
      throw new Error("Unexpected angle");
  }
  return {
    ...state,
    cropX,
    cropY,
    height,
    width
  };
}
function cloneFabricCanvas(original) {
  return new Promise((resolve) => {
    original.clone(resolve);
  });
}
function moveFabricObjectsForCrop(fabricCanvas, { left, top }) {
  fabricCanvas.getObjects().forEach((obj) => {
    const { x, y } = obj.getCenterPoint();
    const translatedCenter = new import_fabric.fabric.Point(x - left, y - top);
    obj.setPositionByOrigin(translatedCenter, "center", "center");
    obj.setCoords();
  });
}
function moveFabricObjectsForReset(fabricCanvas, oldImageState) {
  fabricCanvas.getObjects().forEach((obj) => {
    if (obj.excludeFromExport) {
      return;
    }
    let newCenterX;
    let newCenterY;
    const oldCenter = obj.getCenterPoint();
    const distanceFromRightEdge = oldImageState.width - oldCenter.x;
    const distanceFromBottomEdge = oldImageState.height - oldCenter.y;
    switch (oldImageState.angle % 360) {
      case 0:
        newCenterX = oldCenter.x;
        newCenterY = oldCenter.y;
        break;
      case 90:
        newCenterX = oldCenter.y;
        newCenterY = distanceFromRightEdge;
        break;
      case 180:
        newCenterX = distanceFromRightEdge;
        newCenterY = distanceFromBottomEdge;
        break;
      case 270:
        newCenterX = distanceFromBottomEdge;
        newCenterY = oldCenter.x;
        break;
      default:
        throw new Error("Unexpected angle");
    }
    newCenterX += oldImageState.cropX;
    newCenterY += oldImageState.cropY;
    obj.set("angle", (obj.angle || 0) - oldImageState.angle);
    obj.setPositionByOrigin(new import_fabric.fabric.Point(newCenterX, newCenterY), "center", "center");
    obj.setCoords();
  });
}
function drawFabricBackgroundImage({
  fabricCanvas,
  image,
  imageState
}) {
  const backgroundImage = new import_fabric.fabric.Image(image, {
    canvas: fabricCanvas,
    height: imageState.height || image.height,
    width: imageState.width || image.width
  });
  let left;
  let top;
  switch (imageState.angle) {
    case 0:
      left = 0;
      top = 0;
      break;
    case 90:
      left = imageState.width;
      top = 0;
      break;
    case 180:
      left = imageState.width;
      top = imageState.height;
      break;
    case 270:
      left = 0;
      top = imageState.height;
      break;
    default:
      throw new Error("Unexpected angle");
  }
  let { height, width } = imageState;
  if (imageState.angle % 180) {
    [width, height] = [height, width];
  }
  fabricCanvas.setBackgroundImage(backgroundImage, fabricCanvas.requestRenderAll.bind(fabricCanvas), {
    angle: imageState.angle,
    cropX: imageState.cropX,
    cropY: imageState.cropY,
    flipX: imageState.flipX,
    flipY: imageState.flipY,
    left,
    top,
    originX: "left",
    originY: "top",
    width,
    height
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MediaEditor
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVkaWFFZGl0b3IudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IE1lYXN1cmUgZnJvbSAncmVhY3QtbWVhc3VyZSc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGZhYnJpYyB9IGZyb20gJ2ZhYnJpYyc7XG5pbXBvcnQgeyBnZXQsIGhhcywgbm9vcCB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBTdGlja2VyQnV0dG9uUHJvcHMgfSBmcm9tICcuL3N0aWNrZXJzL1N0aWNrZXJCdXR0b24nO1xuaW1wb3J0IHR5cGUgeyBJbWFnZVN0YXRlVHlwZSB9IGZyb20gJy4uL21lZGlhRWRpdG9yL0ltYWdlU3RhdGVUeXBlJztcblxuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uVmFyaWFudCB9IGZyb20gJy4vQnV0dG9uJztcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSAnLi9Db250ZXh0TWVudSc7XG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tICcuL1NsaWRlcic7XG5pbXBvcnQgeyBTdGlja2VyQnV0dG9uIH0gZnJvbSAnLi9zdGlja2Vycy9TdGlja2VyQnV0dG9uJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5pbXBvcnQgeyBjYW52YXNUb0J5dGVzIH0gZnJvbSAnLi4vdXRpbC9jYW52YXNUb0J5dGVzJztcbmltcG9ydCB7IHVzZUZhYnJpY0hpc3RvcnkgfSBmcm9tICcuLi9tZWRpYUVkaXRvci91c2VGYWJyaWNIaXN0b3J5JztcbmltcG9ydCB7IHVzZVBvcnRhbCB9IGZyb20gJy4uL2hvb2tzL3VzZVBvcnRhbCc7XG5pbXBvcnQgeyB1c2VVbmlxdWVJZCB9IGZyb20gJy4uL2hvb2tzL3VzZVVuaXF1ZUlkJztcblxuaW1wb3J0IHsgTWVkaWFFZGl0b3JGYWJyaWNQZW5jaWxCcnVzaCB9IGZyb20gJy4uL21lZGlhRWRpdG9yL01lZGlhRWRpdG9yRmFicmljUGVuY2lsQnJ1c2gnO1xuaW1wb3J0IHsgTWVkaWFFZGl0b3JGYWJyaWNDcm9wUmVjdCB9IGZyb20gJy4uL21lZGlhRWRpdG9yL01lZGlhRWRpdG9yRmFicmljQ3JvcFJlY3QnO1xuaW1wb3J0IHsgTWVkaWFFZGl0b3JGYWJyaWNJVGV4dCB9IGZyb20gJy4uL21lZGlhRWRpdG9yL01lZGlhRWRpdG9yRmFicmljSVRleHQnO1xuaW1wb3J0IHsgTWVkaWFFZGl0b3JGYWJyaWNTdGlja2VyIH0gZnJvbSAnLi4vbWVkaWFFZGl0b3IvTWVkaWFFZGl0b3JGYWJyaWNTdGlja2VyJztcbmltcG9ydCB7IGZhYnJpY0VmZmVjdExpc3RlbmVyIH0gZnJvbSAnLi4vbWVkaWFFZGl0b3IvZmFicmljRWZmZWN0TGlzdGVuZXInO1xuaW1wb3J0IHsgZ2V0UkdCQSwgZ2V0SFNMIH0gZnJvbSAnLi4vbWVkaWFFZGl0b3IvdXRpbC9jb2xvcic7XG5pbXBvcnQge1xuICBUZXh0U3R5bGUsXG4gIGdldFRleHRTdHlsZUF0dHJpYnV0ZXMsXG59IGZyb20gJy4uL21lZGlhRWRpdG9yL3V0aWwvZ2V0VGV4dFN0eWxlQXR0cmlidXRlcyc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgZG9uZUJ1dHRvbkxhYmVsPzogc3RyaW5nO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBpbWFnZVNyYzogc3RyaW5nO1xuICBvbkNsb3NlOiAoKSA9PiB1bmtub3duO1xuICBvbkRvbmU6IChkYXRhOiBVaW50OEFycmF5KSA9PiB1bmtub3duO1xufSAmIFBpY2s8U3RpY2tlckJ1dHRvblByb3BzLCAnaW5zdGFsbGVkUGFja3MnIHwgJ3JlY2VudFN0aWNrZXJzJz47XG5cbmNvbnN0IElOSVRJQUxfSU1BR0VfU1RBVEU6IEltYWdlU3RhdGVUeXBlID0ge1xuICBhbmdsZTogMCxcbiAgY3JvcFg6IDAsXG4gIGNyb3BZOiAwLFxuICBmbGlwWDogZmFsc2UsXG4gIGZsaXBZOiBmYWxzZSxcbiAgaGVpZ2h0OiAwLFxuICB3aWR0aDogMCxcbn07XG5cbmVudW0gRWRpdE1vZGUge1xuICBDcm9wID0gJ0Nyb3AnLFxuICBEcmF3ID0gJ0RyYXcnLFxuICBUZXh0ID0gJ1RleHQnLFxufVxuXG5lbnVtIERyYXdXaWR0aCB7XG4gIFRoaW4gPSAyLFxuICBSZWd1bGFyID0gNCxcbiAgTWVkaXVtID0gMTIsXG4gIEhlYXZ5ID0gMjQsXG59XG5cbmVudW0gRHJhd1Rvb2wge1xuICBQZW4gPSAnUGVuJyxcbiAgSGlnaGxpZ2h0ZXIgPSAnSGlnaGxpZ2h0ZXInLFxufVxuXG50eXBlIFBlbmRpbmdDcm9wVHlwZSA9IHtcbiAgbGVmdDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59O1xuXG5mdW5jdGlvbiBpc0NtZE9yQ3RybChldjogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IGN0cmxLZXksIG1ldGFLZXkgfSA9IGV2O1xuICBjb25zdCBjb21tYW5kS2V5ID0gZ2V0KHdpbmRvdywgJ3BsYXRmb3JtJykgPT09ICdkYXJ3aW4nICYmIG1ldGFLZXk7XG4gIGNvbnN0IGNvbnRyb2xLZXkgPSBnZXQod2luZG93LCAncGxhdGZvcm0nKSAhPT0gJ2RhcndpbicgJiYgY3RybEtleTtcbiAgcmV0dXJuIGNvbW1hbmRLZXkgfHwgY29udHJvbEtleTtcbn1cblxuZXhwb3J0IGNvbnN0IE1lZGlhRWRpdG9yID0gKHtcbiAgZG9uZUJ1dHRvbkxhYmVsLFxuICBpMThuLFxuICBpbWFnZVNyYyxcbiAgb25DbG9zZSxcbiAgb25Eb25lLFxuXG4gIC8vIFN0aWNrZXJCdXR0b25Qcm9wc1xuICBpbnN0YWxsZWRQYWNrcyxcbiAgcmVjZW50U3RpY2tlcnMsXG59OiBQcm9wc1R5cGUpOiBKU1guRWxlbWVudCB8IG51bGwgPT4ge1xuICBjb25zdCBbZmFicmljQ2FudmFzLCBzZXRGYWJyaWNDYW52YXNdID0gdXNlU3RhdGU8ZmFicmljLkNhbnZhcyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgW2ltYWdlLCBzZXRJbWFnZV0gPSB1c2VTdGF0ZTxIVE1MSW1hZ2VFbGVtZW50PihuZXcgSW1hZ2UoKSk7XG5cbiAgY29uc3QgY2FudmFzSWQgPSB1c2VVbmlxdWVJZCgpO1xuXG4gIGNvbnN0IFtpbWFnZVN0YXRlLCBzZXRJbWFnZVN0YXRlXSA9XG4gICAgdXNlU3RhdGU8SW1hZ2VTdGF0ZVR5cGU+KElOSVRJQUxfSU1BR0VfU1RBVEUpO1xuXG4gIC8vIEhpc3Rvcnkgc3RhdGVcbiAgY29uc3QgeyBjYW5SZWRvLCBjYW5VbmRvLCByZWRvSWZQb3NzaWJsZSwgdGFrZVNuYXBzaG90LCB1bmRvSWZQb3NzaWJsZSB9ID1cbiAgICB1c2VGYWJyaWNIaXN0b3J5KHtcbiAgICAgIGZhYnJpY0NhbnZhcyxcbiAgICAgIGltYWdlU3RhdGUsXG4gICAgICBzZXRJbWFnZVN0YXRlLFxuICAgIH0pO1xuXG4gIC8vIEluaXRpYWwgaW1hZ2UgbG9hZCBhbmQgRmFicmljIGNhbnZhcyBzZXR1cFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50LiBXZSBjYW4ndCByZS1ydW4gdGhpcyBmdW5jdGlvbiBpZiB3ZSd2ZSBhbHJlYWR5IHNldHVwXG4gICAgLy8gICAgYSBjYW52YXMgc2luY2UgRmFicmljIGRvZXNuJ3QgbGlrZSB0aGF0LlxuICAgIGlmIChmYWJyaWNDYW52YXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgc2V0SW1hZ2UoaW1nKTtcblxuICAgICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoY2FudmFzSWQpO1xuICAgICAgY2FudmFzLnNlbGVjdGlvbiA9IGZhbHNlO1xuICAgICAgc2V0RmFicmljQ2FudmFzKGNhbnZhcyk7XG5cbiAgICAgIGNvbnN0IG5ld0ltYWdlU3RhdGUgPSB7XG4gICAgICAgIC4uLklOSVRJQUxfSU1BR0VfU1RBVEUsXG4gICAgICAgIGhlaWdodDogaW1nLmhlaWdodCxcbiAgICAgICAgd2lkdGg6IGltZy53aWR0aCxcbiAgICAgIH07XG4gICAgICBzZXRJbWFnZVN0YXRlKG5ld0ltYWdlU3RhdGUpO1xuICAgICAgdGFrZVNuYXBzaG90KCdpbml0aWFsIHN0YXRlJywgbmV3SW1hZ2VTdGF0ZSwgY2FudmFzKTtcbiAgICB9O1xuICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgLy8gVGhpcyBpcyBhIGJhZCBleHBlcmllbmNlLCBidXQgaXQgc2hvdWxkIGJlIGltcG9zc2libGUuXG4gICAgICBsb2cuZXJyb3IoJzxNZWRpYUVkaXRvcj46IGltYWdlIGZhaWxlZCB0byBsb2FkLiBDbG9zaW5nJyk7XG4gICAgICBvbkNsb3NlKCk7XG4gICAgfTtcbiAgICBpbWcuc3JjID0gaW1hZ2VTcmM7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGltZy5vbmxvYWQgPSBub29wO1xuICAgICAgaW1nLm9uZXJyb3IgPSBub29wO1xuICAgIH07XG4gIH0sIFtjYW52YXNJZCwgZmFicmljQ2FudmFzLCBpbWFnZVNyYywgb25DbG9zZSwgdGFrZVNuYXBzaG90XSk7XG5cbiAgLy8gS2V5Ym9hcmQgc3VwcG9ydFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG5cbiAgICBjb25zdCBnbG9iYWxTaG9ydGN1dHM6IEFycmF5PFxuICAgICAgWyhldjogS2V5Ym9hcmRFdmVudCkgPT4gYm9vbGVhbiwgKCkgPT4gdW5rbm93bl1cbiAgICA+ID0gW1xuICAgICAgW1xuICAgICAgICBldiA9PiBpc0NtZE9yQ3RybChldikgJiYgZXYua2V5ID09PSAnYycsXG4gICAgICAgICgpID0+IHNldEVkaXRNb2RlKEVkaXRNb2RlLkNyb3ApLFxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgZXYgPT4gaXNDbWRPckN0cmwoZXYpICYmIGV2LmtleSA9PT0gJ2QnLFxuICAgICAgICAoKSA9PiBzZXRFZGl0TW9kZShFZGl0TW9kZS5EcmF3KSxcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIGV2ID0+IGlzQ21kT3JDdHJsKGV2KSAmJiBldi5rZXkgPT09ICd0JyxcbiAgICAgICAgKCkgPT4gc2V0RWRpdE1vZGUoRWRpdE1vZGUuVGV4dCksXG4gICAgICBdLFxuICAgICAgW2V2ID0+IGlzQ21kT3JDdHJsKGV2KSAmJiBldi5rZXkgPT09ICd6JywgdW5kb0lmUG9zc2libGVdLFxuICAgICAgW2V2ID0+IGlzQ21kT3JDdHJsKGV2KSAmJiBldi5zaGlmdEtleSAmJiBldi5rZXkgPT09ICd6JywgcmVkb0lmUG9zc2libGVdLFxuICAgICAgW1xuICAgICAgICBldiA9PiBldi5rZXkgPT09ICdFc2NhcGUnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgc2V0RWRpdE1vZGUodW5kZWZpbmVkKTtcblxuICAgICAgICAgIGlmIChmYWJyaWNDYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCkpIHtcbiAgICAgICAgICAgIGZhYnJpY0NhbnZhcy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XG4gICAgICAgICAgICBmYWJyaWNDYW52YXMucmVxdWVzdFJlbmRlckFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgXTtcblxuICAgIGNvbnN0IG9iamVjdFNob3J0Y3V0czogQXJyYXk8XG4gICAgICBbXG4gICAgICAgIChldjogS2V5Ym9hcmRFdmVudCkgPT4gYm9vbGVhbixcbiAgICAgICAgKG9iajogZmFicmljLk9iamVjdCwgZXY6IEtleWJvYXJkRXZlbnQpID0+IHVua25vd25cbiAgICAgIF1cbiAgICA+ID0gW1xuICAgICAgW1xuICAgICAgICBldiA9PiBldi5rZXkgPT09ICdEZWxldGUnLFxuICAgICAgICBvYmogPT4ge1xuICAgICAgICAgIGZhYnJpY0NhbnZhcy5yZW1vdmUob2JqKTtcbiAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgZXYgPT4gZXYua2V5ID09PSAnQXJyb3dVcCcsXG4gICAgICAgIChvYmosIGV2KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHggPSBldi5zaGlmdEtleSA/IDIwIDogMTtcbiAgICAgICAgICBpZiAoZXYuYWx0S2V5KSB7XG4gICAgICAgICAgICBvYmouc2V0KCdhbmdsZScsIChvYmouYW5nbGUgfHwgMCkgLSBweCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gb2JqLmdldENlbnRlclBvaW50KCk7XG4gICAgICAgICAgICBvYmouc2V0UG9zaXRpb25CeU9yaWdpbihcbiAgICAgICAgICAgICAgbmV3IGZhYnJpYy5Qb2ludCh4LCB5IC0gcHgpLFxuICAgICAgICAgICAgICAnY2VudGVyJyxcbiAgICAgICAgICAgICAgJ2NlbnRlcidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9iai5zZXRDb29yZHMoKTtcbiAgICAgICAgICBmYWJyaWNDYW52YXMucmVxdWVzdFJlbmRlckFsbCgpO1xuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgZXYgPT4gZXYua2V5ID09PSAnQXJyb3dMZWZ0JyxcbiAgICAgICAgKG9iaiwgZXYpID0+IHtcbiAgICAgICAgICBjb25zdCBweCA9IGV2LnNoaWZ0S2V5ID8gMjAgOiAxO1xuICAgICAgICAgIGlmIChldi5hbHRLZXkpIHtcbiAgICAgICAgICAgIG9iai5zZXQoJ2FuZ2xlJywgKG9iai5hbmdsZSB8fCAwKSAtIHB4KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBvYmouZ2V0Q2VudGVyUG9pbnQoKTtcbiAgICAgICAgICAgIG9iai5zZXRQb3NpdGlvbkJ5T3JpZ2luKFxuICAgICAgICAgICAgICBuZXcgZmFicmljLlBvaW50KHggLSBweCwgeSksXG4gICAgICAgICAgICAgICdjZW50ZXInLFxuICAgICAgICAgICAgICAnY2VudGVyJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqLnNldENvb3JkcygpO1xuICAgICAgICAgIGZhYnJpY0NhbnZhcy5yZXF1ZXN0UmVuZGVyQWxsKCk7XG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBldiA9PiBldi5rZXkgPT09ICdBcnJvd0Rvd24nLFxuICAgICAgICAob2JqLCBldikgPT4ge1xuICAgICAgICAgIGNvbnN0IHB4ID0gZXYuc2hpZnRLZXkgPyAyMCA6IDE7XG4gICAgICAgICAgaWYgKGV2LmFsdEtleSkge1xuICAgICAgICAgICAgb2JqLnNldCgnYW5nbGUnLCAob2JqLmFuZ2xlIHx8IDApICsgcHgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7IHgsIHkgfSA9IG9iai5nZXRDZW50ZXJQb2ludCgpO1xuICAgICAgICAgICAgb2JqLnNldFBvc2l0aW9uQnlPcmlnaW4oXG4gICAgICAgICAgICAgIG5ldyBmYWJyaWMuUG9pbnQoeCwgeSArIHB4KSxcbiAgICAgICAgICAgICAgJ2NlbnRlcicsXG4gICAgICAgICAgICAgICdjZW50ZXInXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmouc2V0Q29vcmRzKCk7XG4gICAgICAgICAgZmFicmljQ2FudmFzLnJlcXVlc3RSZW5kZXJBbGwoKTtcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIGV2ID0+IGV2LmtleSA9PT0gJ0Fycm93UmlnaHQnLFxuICAgICAgICAob2JqLCBldikgPT4ge1xuICAgICAgICAgIGNvbnN0IHB4ID0gZXYuc2hpZnRLZXkgPyAyMCA6IDE7XG4gICAgICAgICAgaWYgKGV2LmFsdEtleSkge1xuICAgICAgICAgICAgb2JqLnNldCgnYW5nbGUnLCAob2JqLmFuZ2xlIHx8IDApICsgcHgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7IHgsIHkgfSA9IG9iai5nZXRDZW50ZXJQb2ludCgpO1xuICAgICAgICAgICAgb2JqLnNldFBvc2l0aW9uQnlPcmlnaW4oXG4gICAgICAgICAgICAgIG5ldyBmYWJyaWMuUG9pbnQoeCArIHB4LCB5KSxcbiAgICAgICAgICAgICAgJ2NlbnRlcicsXG4gICAgICAgICAgICAgICdjZW50ZXInXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmouc2V0Q29vcmRzKCk7XG4gICAgICAgICAgZmFicmljQ2FudmFzLnJlcXVlc3RSZW5kZXJBbGwoKTtcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZXY6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZ2xvYmFsU2hvcnRjdXRzLmZvckVhY2goKFtjb25kaXRpb25hbCwgcnVuU2hvcnRjdXRdKSA9PiB7XG4gICAgICAgIGlmIChjb25kaXRpb25hbChldikpIHtcbiAgICAgICAgICBydW5TaG9ydGN1dCgpO1xuICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBvYmogPSBmYWJyaWNDYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIW9iaiB8fFxuICAgICAgICBvYmouZXhjbHVkZUZyb21FeHBvcnQgfHxcbiAgICAgICAgKG9iaiBpbnN0YW5jZW9mIE1lZGlhRWRpdG9yRmFicmljSVRleHQgJiYgb2JqLmlzRWRpdGluZylcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9iamVjdFNob3J0Y3V0cy5mb3JFYWNoKChbY29uZGl0aW9uYWwsIHJ1blNob3J0Y3V0XSkgPT4ge1xuICAgICAgICBpZiAoY29uZGl0aW9uYWwoZXYpKSB7XG4gICAgICAgICAgcnVuU2hvcnRjdXQob2JqLCBldik7XG4gICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleWRvd24pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlkb3duKTtcbiAgICB9O1xuICB9LCBbZmFicmljQ2FudmFzLCByZWRvSWZQb3NzaWJsZSwgdW5kb0lmUG9zc2libGVdKTtcblxuICBjb25zdCBbY29udGFpbmVyV2lkdGgsIHNldENvbnRhaW5lcldpZHRoXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbY29udGFpbmVySGVpZ2h0LCBzZXRDb250YWluZXJIZWlnaHRdID0gdXNlU3RhdGUoMCk7XG5cbiAgY29uc3Qgem9vbSA9XG4gICAgTWF0aC5taW4oXG4gICAgICBjb250YWluZXJXaWR0aCAvIGltYWdlU3RhdGUud2lkdGgsXG4gICAgICBjb250YWluZXJIZWlnaHQgLyBpbWFnZVN0YXRlLmhlaWdodFxuICAgICkgfHwgMTtcblxuICAvLyBVcGRhdGUgdGhlIGNhbnZhcyBkaW1lbnNpb25zIChhbmQgdGhlcmVmb3JlIHpvb20pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFmYWJyaWNDYW52YXMgfHwgIWltYWdlU3RhdGUud2lkdGggfHwgIWltYWdlU3RhdGUuaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZhYnJpY0NhbnZhcy5zZXREaW1lbnNpb25zKHtcbiAgICAgIHdpZHRoOiBpbWFnZVN0YXRlLndpZHRoICogem9vbSxcbiAgICAgIGhlaWdodDogaW1hZ2VTdGF0ZS5oZWlnaHQgKiB6b29tLFxuICAgIH0pO1xuICAgIGZhYnJpY0NhbnZhcy5zZXRab29tKHpvb20pO1xuICB9LCBbXG4gICAgY29udGFpbmVySGVpZ2h0LFxuICAgIGNvbnRhaW5lcldpZHRoLFxuICAgIGZhYnJpY0NhbnZhcyxcbiAgICBpbWFnZVN0YXRlLmhlaWdodCxcbiAgICBpbWFnZVN0YXRlLndpZHRoLFxuICAgIHpvb20sXG4gIF0pO1xuXG4gIC8vIFJlZnJlc2ggdGhlIGJhY2tncm91bmQgaW1hZ2UgYWNjb3JkaW5nIHRvIGltYWdlU3RhdGUgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYXdGYWJyaWNCYWNrZ3JvdW5kSW1hZ2UoeyBmYWJyaWNDYW52YXMsIGltYWdlLCBpbWFnZVN0YXRlIH0pO1xuICB9LCBbZmFicmljQ2FudmFzLCBpbWFnZSwgaW1hZ2VTdGF0ZV0pO1xuXG4gIGNvbnN0IFtjYW5Dcm9wLCBzZXRDYW5Dcm9wXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Nyb3BBc3BlY3RSYXRpb0xvY2ssIHNldENyb3BBc3BlY3RSYXRpb0xvY2tdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZHJhd1Rvb2wsIHNldERyYXdUb29sXSA9IHVzZVN0YXRlPERyYXdUb29sPihEcmF3VG9vbC5QZW4pO1xuICBjb25zdCBbZHJhd1dpZHRoLCBzZXREcmF3V2lkdGhdID0gdXNlU3RhdGU8RHJhd1dpZHRoPihEcmF3V2lkdGguUmVndWxhcik7XG4gIGNvbnN0IFtlZGl0TW9kZSwgc2V0RWRpdE1vZGVdID0gdXNlU3RhdGU8RWRpdE1vZGUgfCB1bmRlZmluZWQ+KCk7XG4gIGNvbnN0IFtzbGlkZXJWYWx1ZSwgc2V0U2xpZGVyVmFsdWVdID0gdXNlU3RhdGU8bnVtYmVyPigwKTtcbiAgY29uc3QgW3RleHRTdHlsZSwgc2V0VGV4dFN0eWxlXSA9IHVzZVN0YXRlPFRleHRTdHlsZT4oVGV4dFN0eWxlLlJlZ3VsYXIpO1xuXG4gIC8vIElmIHlvdSBzZWxlY3QgYSB0ZXh0IHBhdGggYXV0byBlbnRlciBlZGl0IG1vZGVcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWZhYnJpY0NhbnZhcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gZmFicmljRWZmZWN0TGlzdGVuZXIoXG4gICAgICBmYWJyaWNDYW52YXMsXG4gICAgICBbJ3NlbGVjdGlvbjpjcmVhdGVkJywgJ3NlbGVjdGlvbjp1cGRhdGVkJywgJ3NlbGVjdGlvbjpjbGVhcmVkJ10sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGlmIChmYWJyaWNDYW52YXM/LmdldEFjdGl2ZU9iamVjdCgpIGluc3RhbmNlb2YgTWVkaWFFZGl0b3JGYWJyaWNJVGV4dCkge1xuICAgICAgICAgIHNldEVkaXRNb2RlKEVkaXRNb2RlLlRleHQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5UZXh0KSB7XG4gICAgICAgICAgc2V0RWRpdE1vZGUodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sIFtlZGl0TW9kZSwgZmFicmljQ2FudmFzXSk7XG5cbiAgLy8gRW5zdXJlIHNjYWxpbmcgaXMgaW4gbG9ja2VkfHVubG9ja2VkIHN0YXRlIG9ubHkgd2hlbiBjcm9wcGluZ1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5Dcm9wKSB7XG4gICAgICBmYWJyaWNDYW52YXMudW5pZm9ybVNjYWxpbmcgPSBjcm9wQXNwZWN0UmF0aW9Mb2NrO1xuICAgIH0gZWxzZSB7XG4gICAgICBmYWJyaWNDYW52YXMudW5pZm9ybVNjYWxpbmcgPSB0cnVlO1xuICAgIH1cbiAgfSwgW2Nyb3BBc3BlY3RSYXRpb0xvY2ssIGVkaXRNb2RlLCBmYWJyaWNDYW52YXNdKTtcblxuICAvLyBSZW1vdmUgYW55IGJsYW5rIHRleHQgd2hlbiBlZGl0IG1vZGUgY2hhbmdlcyBvZmYgb2YgdGV4dFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVkaXRNb2RlICE9PSBFZGl0TW9kZS5UZXh0KSB7XG4gICAgICBjb25zdCBvYmogPSBmYWJyaWNDYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCk7XG4gICAgICBpZiAob2JqICYmIGhhcyhvYmosICd0ZXh0JykgJiYgZ2V0KG9iaiwgJ3RleHQnKSA9PT0gJycpIHtcbiAgICAgICAgZmFicmljQ2FudmFzLnJlbW92ZShvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2VkaXRNb2RlLCBmYWJyaWNDYW52YXNdKTtcblxuICAvLyBUb2dnbGUgZHJhdyBtb2RlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFmYWJyaWNDYW52YXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWRpdE1vZGUgIT09IEVkaXRNb2RlLkRyYXcpIHtcbiAgICAgIGZhYnJpY0NhbnZhcy5pc0RyYXdpbmdNb2RlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmFicmljQ2FudmFzLmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcbiAgICBmYWJyaWNDYW52YXMuaXNEcmF3aW5nTW9kZSA9IHRydWU7XG5cbiAgICBjb25zdCBmcmVlRHJhd2luZ0JydXNoID0gbmV3IE1lZGlhRWRpdG9yRmFicmljUGVuY2lsQnJ1c2goZmFicmljQ2FudmFzKTtcbiAgICBpZiAoZHJhd1Rvb2wgPT09IERyYXdUb29sLkhpZ2hsaWdodGVyKSB7XG4gICAgICBmcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gZ2V0UkdCQShzbGlkZXJWYWx1ZSwgMC41KTtcbiAgICAgIGZyZWVEcmF3aW5nQnJ1c2guc3Ryb2tlTGluZUNhcCA9ICdzcXVhcmUnO1xuICAgICAgZnJlZURyYXdpbmdCcnVzaC5zdHJva2VMaW5lSm9pbiA9ICdtaXRlcic7XG4gICAgICBmcmVlRHJhd2luZ0JydXNoLndpZHRoID0gKGRyYXdXaWR0aCAvIHpvb20pICogMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9IGdldEhTTChzbGlkZXJWYWx1ZSk7XG4gICAgICBmcmVlRHJhd2luZ0JydXNoLnN0cm9rZUxpbmVDYXAgPSAncm91bmQnO1xuICAgICAgZnJlZURyYXdpbmdCcnVzaC5zdHJva2VMaW5lSm9pbiA9ICdiZXZlbCc7XG4gICAgICBmcmVlRHJhd2luZ0JydXNoLndpZHRoID0gZHJhd1dpZHRoIC8gem9vbTtcbiAgICB9XG4gICAgZmFicmljQ2FudmFzLmZyZWVEcmF3aW5nQnJ1c2ggPSBmcmVlRHJhd2luZ0JydXNoO1xuXG4gICAgZmFicmljQ2FudmFzLnJlcXVlc3RSZW5kZXJBbGwoKTtcbiAgfSwgW2RyYXdUb29sLCBkcmF3V2lkdGgsIGVkaXRNb2RlLCBmYWJyaWNDYW52YXMsIHNsaWRlclZhbHVlLCB6b29tXSk7XG5cbiAgLy8gQ2hhbmdlIHRleHQgc3R5bGVcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWZhYnJpY0NhbnZhcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9iaiA9IGZhYnJpY0NhbnZhcy5nZXRBY3RpdmVPYmplY3QoKTtcblxuICAgIGlmICghb2JqIHx8ICEob2JqIGluc3RhbmNlb2YgTWVkaWFFZGl0b3JGYWJyaWNJVGV4dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGlzRWRpdGluZyB9ID0gb2JqO1xuICAgIG9iai5leGl0RWRpdGluZygpO1xuICAgIG9iai5zZXQoZ2V0VGV4dFN0eWxlQXR0cmlidXRlcyh0ZXh0U3R5bGUsIHNsaWRlclZhbHVlKSk7XG4gICAgZmFicmljQ2FudmFzLnJlcXVlc3RSZW5kZXJBbGwoKTtcbiAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICBvYmouZW50ZXJFZGl0aW5nKCk7XG4gICAgfVxuICB9LCBbZmFicmljQ2FudmFzLCBzbGlkZXJWYWx1ZSwgdGV4dFN0eWxlXSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBDcm9wcGluZ1JlY3RcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWZhYnJpY0NhbnZhcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlZGl0TW9kZSA9PT0gRWRpdE1vZGUuQ3JvcCkge1xuICAgICAgY29uc3QgUEFERElORyA9IE1lZGlhRWRpdG9yRmFicmljQ3JvcFJlY3QuUEFERElORyAvIHpvb207XG4gICAgICAvLyBGb3IgcmVhc29ucyB3ZSBkb24ndCB1bmRlcnN0YW5kLCBoZWlnaHQgYW5kIHdpZHRoIG9uIHNtYWxsIGltYWdlcyBkb2Vzbid0IHdvcmtcbiAgICAgIC8vICAgcmlnaHQgKGl0IGJsZWVkcyBvdXQpIHNvIHdlIGRlY3JlYXNlIHRoZW0gZm9yIHNtYWxsIGltYWdlcy5cbiAgICAgIGNvbnN0IGhlaWdodCA9XG4gICAgICAgIGltYWdlU3RhdGUuaGVpZ2h0IC0gUEFERElORyAqIE1hdGgubWF4KDQ0MCAvIGltYWdlU3RhdGUuaGVpZ2h0LCAyKTtcbiAgICAgIGNvbnN0IHdpZHRoID1cbiAgICAgICAgaW1hZ2VTdGF0ZS53aWR0aCAtIFBBRERJTkcgKiBNYXRoLm1heCg0NDAgLyBpbWFnZVN0YXRlLndpZHRoLCAyKTtcblxuICAgICAgbGV0IHJlY3Q6IE1lZGlhRWRpdG9yRmFicmljQ3JvcFJlY3Q7XG4gICAgICBjb25zdCBvYmogPSBmYWJyaWNDYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCk7XG5cbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNZWRpYUVkaXRvckZhYnJpY0Nyb3BSZWN0KSB7XG4gICAgICAgIHJlY3QgPSBvYmo7XG4gICAgICAgIHJlY3Quc2V0KHsgaGVpZ2h0LCB3aWR0aCwgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWN0ID0gbmV3IE1lZGlhRWRpdG9yRmFicmljQ3JvcFJlY3Qoe1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVjdC5vbignbW9kaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBoZWlnaHQ6IGN1cnJIZWlnaHQsIHdpZHRoOiBjdXJyV2lkdGggfSA9XG4gICAgICAgICAgICByZWN0LmdldEJvdW5kaW5nUmVjdCh0cnVlKTtcblxuICAgICAgICAgIHNldENhbkNyb3AoY3VyckhlaWdodCA8IGhlaWdodCB8fCBjdXJyV2lkdGggPCB3aWR0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlY3Qub24oJ2Rlc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgc2V0RWRpdE1vZGUodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmFicmljQ2FudmFzLmFkZChyZWN0KTtcbiAgICAgICAgZmFicmljQ2FudmFzLnNldEFjdGl2ZU9iamVjdChyZWN0KTtcbiAgICAgIH1cblxuICAgICAgZmFicmljQ2FudmFzLnZpZXdwb3J0Q2VudGVyT2JqZWN0KHJlY3QpO1xuICAgICAgcmVjdC5zZXRDb29yZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmFicmljQ2FudmFzLmdldE9iamVjdHMoKS5mb3JFYWNoKG9iaiA9PiB7XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNZWRpYUVkaXRvckZhYnJpY0Nyb3BSZWN0KSB7XG4gICAgICAgICAgZmFicmljQ2FudmFzLnJlbW92ZShvYmopO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRDYW5Dcm9wKGZhbHNlKTtcbiAgfSwgW2VkaXRNb2RlLCBmYWJyaWNDYW52YXMsIGltYWdlU3RhdGUuaGVpZ2h0LCBpbWFnZVN0YXRlLndpZHRoLCB6b29tXSk7XG5cbiAgLy8gQ3JlYXRlIGFuIElUZXh0IG5vZGUgd2hlbiBlZGl0IG1vZGUgY2hhbmdlcyB0byBUZXh0XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFmYWJyaWNDYW52YXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWRpdE1vZGUgIT09IEVkaXRNb2RlLlRleHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmogPSBmYWJyaWNDYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCk7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIE1lZGlhRWRpdG9yRmFicmljSVRleHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBGT05UX1NJWkVfUkVMQVRJVkVfVE9fQ0FOVkFTID0gMTA7XG4gICAgY29uc3QgZm9udFNpemUgPVxuICAgICAgTWF0aC5taW4oaW1hZ2VTdGF0ZS53aWR0aCwgaW1hZ2VTdGF0ZS5oZWlnaHQpIC9cbiAgICAgIEZPTlRfU0laRV9SRUxBVElWRV9UT19DQU5WQVM7XG4gICAgY29uc3QgdGV4dCA9IG5ldyBNZWRpYUVkaXRvckZhYnJpY0lUZXh0KCcnLCB7XG4gICAgICAuLi5nZXRUZXh0U3R5bGVBdHRyaWJ1dGVzKHRleHRTdHlsZSwgc2xpZGVyVmFsdWUpLFxuICAgICAgZm9udFNpemUsXG4gICAgfSk7XG4gICAgdGV4dC5zZXRQb3NpdGlvbkJ5T3JpZ2luKFxuICAgICAgbmV3IGZhYnJpYy5Qb2ludChpbWFnZVN0YXRlLndpZHRoIC8gMiwgaW1hZ2VTdGF0ZS5oZWlnaHQgLyAyKSxcbiAgICAgICdjZW50ZXInLFxuICAgICAgJ2NlbnRlcidcbiAgICApO1xuICAgIHRleHQuc2V0Q29vcmRzKCk7XG4gICAgZmFicmljQ2FudmFzLmFkZCh0ZXh0KTtcbiAgICBmYWJyaWNDYW52YXMuc2V0QWN0aXZlT2JqZWN0KHRleHQpO1xuXG4gICAgdGV4dC5lbnRlckVkaXRpbmcoKTtcbiAgfSwgW1xuICAgIGVkaXRNb2RlLFxuICAgIGZhYnJpY0NhbnZhcyxcbiAgICBpbWFnZVN0YXRlLmhlaWdodCxcbiAgICBpbWFnZVN0YXRlLndpZHRoLFxuICAgIHNsaWRlclZhbHVlLFxuICAgIHRleHRTdHlsZSxcbiAgXSk7XG5cbiAgY29uc3QgW2lzU2F2aW5nLCBzZXRJc1NhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgLy8gSW4gYW4gaWRlYWwgd29ybGQgd2UnZCB1c2UgPE1vZGFsSG9zdCAvPiB0byBnZXQgdGhlIG5pY2UgYW5pbWF0aW9uIGJlbmVmaXRzXG4gIC8vIGJ1dCBiZWNhdXNlIG9mIHRoZSB3YXkgSVRleHQgaXMgaW1wbGVtZW50ZWQgLS0gd2l0aCBhIGhpZGRlbiB0ZXh0YXJlYSAtLSB0b1xuICAvLyBjYXB0dXJlIGtleWJvYXJkIGV2ZW50cywgd2UgY2FuJ3QgdXNlIE1vZGFsSG9zdCBzaW5jZSB0aGF0IHRyYXBzIGZvY3VzLCBhbmRcbiAgLy8gZm9jdXMgdHJhcHBpbmcgZG9lc24ndCBwbGF5IG5pY2Ugd2l0aCBmYWJyaWMncyBJVGV4dC5cbiAgY29uc3QgcG9ydGFsID0gdXNlUG9ydGFsKCk7XG5cbiAgaWYgKCFwb3J0YWwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCB0b29saW5nOiBKU1guRWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5UZXh0KSB7XG4gICAgdG9vbGluZyA9IChcbiAgICAgIDw+XG4gICAgICAgIDxTbGlkZXJcbiAgICAgICAgICBoYW5kbGVTdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IGdldEhTTChzbGlkZXJWYWx1ZSkgfX1cbiAgICAgICAgICBsYWJlbD17aTE4bignQ3VzdG9tQ29sb3JFZGl0b3JfX2h1ZScpfVxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT1cIkh1ZVNsaWRlciBNZWRpYUVkaXRvcl9fdG9vbHNfX3Rvb2xcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRTbGlkZXJWYWx1ZX1cbiAgICAgICAgICB2YWx1ZT17c2xpZGVyVmFsdWV9XG4gICAgICAgIC8+XG4gICAgICAgIDxDb250ZXh0TWVudVxuICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgbWVudU9wdGlvbnM9e1tcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWNvbjogJ01lZGlhRWRpdG9yX19pY29uLS10ZXh0LXJlZ3VsYXInLFxuICAgICAgICAgICAgICBsYWJlbDogaTE4bignTWVkaWFFZGl0b3JfX3RleHQtLXJlZ3VsYXInKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0VGV4dFN0eWxlKFRleHRTdHlsZS5SZWd1bGFyKSxcbiAgICAgICAgICAgICAgdmFsdWU6IFRleHRTdHlsZS5SZWd1bGFyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWNvbjogJ01lZGlhRWRpdG9yX19pY29uLS10ZXh0LWhpZ2hsaWdodCcsXG4gICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdNZWRpYUVkaXRvcl9fdGV4dC0taGlnaGxpZ2h0JyksXG4gICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFRleHRTdHlsZShUZXh0U3R5bGUuSGlnaGxpZ2h0KSxcbiAgICAgICAgICAgICAgdmFsdWU6IFRleHRTdHlsZS5IaWdobGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpY29uOiAnTWVkaWFFZGl0b3JfX2ljb24tLXRleHQtb3V0bGluZScsXG4gICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdNZWRpYUVkaXRvcl9fdGV4dC0tb3V0bGluZScpLFxuICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRUZXh0U3R5bGUoVGV4dFN0eWxlLk91dGxpbmUpLFxuICAgICAgICAgICAgICB2YWx1ZTogVGV4dFN0eWxlLk91dGxpbmUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF19XG4gICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPXtjbGFzc05hbWVzKCdNZWRpYUVkaXRvcl9fdG9vbHNfX3Rvb2wnLCB7XG4gICAgICAgICAgICAnTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24tLXRleHQtcmVndWxhcic6XG4gICAgICAgICAgICAgIHRleHRTdHlsZSA9PT0gVGV4dFN0eWxlLlJlZ3VsYXIsXG4gICAgICAgICAgICAnTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24tLXRleHQtaGlnaGxpZ2h0JzpcbiAgICAgICAgICAgICAgdGV4dFN0eWxlID09PSBUZXh0U3R5bGUuSGlnaGxpZ2h0LFxuICAgICAgICAgICAgJ01lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS10ZXh0LW91dGxpbmUnOlxuICAgICAgICAgICAgICB0ZXh0U3R5bGUgPT09IFRleHRTdHlsZS5PdXRsaW5lLFxuICAgICAgICAgIH0pfVxuICAgICAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgICAgICAgIHZhbHVlPXt0ZXh0U3R5bGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJNZWRpYUVkaXRvcl9fdG9vbHNfX3Rvb2wgTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24gTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24tLXdvcmRzXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVPYmplY3QgPSBmYWJyaWNDYW52YXM/LmdldEFjdGl2ZU9iamVjdCgpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZU9iamVjdCBpbnN0YW5jZW9mIE1lZGlhRWRpdG9yRmFicmljSVRleHQpIHtcbiAgICAgICAgICAgICAgYWN0aXZlT2JqZWN0LmV4aXRFZGl0aW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdkb25lJyl9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChlZGl0TW9kZSA9PT0gRWRpdE1vZGUuRHJhdykge1xuICAgIHRvb2xpbmcgPSAoXG4gICAgICA8PlxuICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgaGFuZGxlU3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBnZXRIU0woc2xpZGVyVmFsdWUpIH19XG4gICAgICAgICAgbGFiZWw9e2kxOG4oJ0N1c3RvbUNvbG9yRWRpdG9yX19odWUnKX1cbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJIdWVTbGlkZXIgTWVkaWFFZGl0b3JfX3Rvb2xzX190b29sXCJcbiAgICAgICAgICBvbkNoYW5nZT17c2V0U2xpZGVyVmFsdWV9XG4gICAgICAgICAgdmFsdWU9e3NsaWRlclZhbHVlfVxuICAgICAgICAvPlxuICAgICAgICA8Q29udGV4dE1lbnVcbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG1lbnVPcHRpb25zPXtbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGljb246ICdNZWRpYUVkaXRvcl9faWNvbi0tZHJhdy1wZW4nLFxuICAgICAgICAgICAgICBsYWJlbDogaTE4bignTWVkaWFFZGl0b3JfX2RyYXctLXBlbicpLFxuICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREcmF3VG9vbChEcmF3VG9vbC5QZW4pLFxuICAgICAgICAgICAgICB2YWx1ZTogRHJhd1Rvb2wuUGVuLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWNvbjogJ01lZGlhRWRpdG9yX19pY29uLS1kcmF3LWhpZ2hsaWdodGVyJyxcbiAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ01lZGlhRWRpdG9yX19kcmF3LS1oaWdobGlnaHRlcicpLFxuICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREcmF3VG9vbChEcmF3VG9vbC5IaWdobGlnaHRlciksXG4gICAgICAgICAgICAgIHZhbHVlOiBEcmF3VG9vbC5IaWdobGlnaHRlcixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9e2NsYXNzTmFtZXMoJ01lZGlhRWRpdG9yX190b29sc19fdG9vbCcsIHtcbiAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbi0tZHJhdy1wZW4nOiBkcmF3VG9vbCA9PT0gRHJhd1Rvb2wuUGVuLFxuICAgICAgICAgICAgJ01lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS1kcmF3LWhpZ2hsaWdodGVyJzpcbiAgICAgICAgICAgICAgZHJhd1Rvb2wgPT09IERyYXdUb29sLkhpZ2hsaWdodGVyLFxuICAgICAgICAgIH0pfVxuICAgICAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgICAgICAgIHZhbHVlPXtkcmF3VG9vbH1cbiAgICAgICAgLz5cbiAgICAgICAgPENvbnRleHRNZW51XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpY29uOiAnTWVkaWFFZGl0b3JfX2ljb24tLXdpZHRoLXRoaW4nLFxuICAgICAgICAgICAgICBsYWJlbDogaTE4bignTWVkaWFFZGl0b3JfX2RyYXctLXRoaW4nKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RHJhd1dpZHRoKERyYXdXaWR0aC5UaGluKSxcbiAgICAgICAgICAgICAgdmFsdWU6IERyYXdXaWR0aC5UaGluLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWNvbjogJ01lZGlhRWRpdG9yX19pY29uLS13aWR0aC1yZWd1bGFyJyxcbiAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ01lZGlhRWRpdG9yX19kcmF3LS1yZWd1bGFyJyksXG4gICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldERyYXdXaWR0aChEcmF3V2lkdGguUmVndWxhciksXG4gICAgICAgICAgICAgIHZhbHVlOiBEcmF3V2lkdGguUmVndWxhcixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGljb246ICdNZWRpYUVkaXRvcl9faWNvbi0td2lkdGgtbWVkaXVtJyxcbiAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ01lZGlhRWRpdG9yX19kcmF3LS1tZWRpdW0nKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RHJhd1dpZHRoKERyYXdXaWR0aC5NZWRpdW0pLFxuICAgICAgICAgICAgICB2YWx1ZTogRHJhd1dpZHRoLk1lZGl1bSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGljb246ICdNZWRpYUVkaXRvcl9faWNvbi0td2lkdGgtaGVhdnknLFxuICAgICAgICAgICAgICBsYWJlbDogaTE4bignTWVkaWFFZGl0b3JfX2RyYXctLWhlYXZ5JyksXG4gICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldERyYXdXaWR0aChEcmF3V2lkdGguSGVhdnkpLFxuICAgICAgICAgICAgICB2YWx1ZTogRHJhd1dpZHRoLkhlYXZ5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdfVxuICAgICAgICAgIG1vZHVsZUNsYXNzTmFtZT17Y2xhc3NOYW1lcygnTWVkaWFFZGl0b3JfX3Rvb2xzX190b29sJywge1xuICAgICAgICAgICAgJ01lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS13aWR0aC10aGluJzpcbiAgICAgICAgICAgICAgZHJhd1dpZHRoID09PSBEcmF3V2lkdGguVGhpbixcbiAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbi0td2lkdGgtcmVndWxhcic6XG4gICAgICAgICAgICAgIGRyYXdXaWR0aCA9PT0gRHJhd1dpZHRoLlJlZ3VsYXIsXG4gICAgICAgICAgICAnTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24tLXdpZHRoLW1lZGl1bSc6XG4gICAgICAgICAgICAgIGRyYXdXaWR0aCA9PT0gRHJhd1dpZHRoLk1lZGl1bSxcbiAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbi0td2lkdGgtaGVhdnknOlxuICAgICAgICAgICAgICBkcmF3V2lkdGggPT09IERyYXdXaWR0aC5IZWF2eSxcbiAgICAgICAgICB9KX1cbiAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgICB2YWx1ZT17ZHJhd1dpZHRofVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiTWVkaWFFZGl0b3JfX3Rvb2xzX190b29sIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS13b3Jkc1wiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RWRpdE1vZGUodW5kZWZpbmVkKX1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdkb25lJyl9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChlZGl0TW9kZSA9PT0gRWRpdE1vZGUuQ3JvcCkge1xuICAgIGNvbnN0IGNhblJlc2V0ID1cbiAgICAgIGltYWdlU3RhdGUuY3JvcFggIT09IDAgfHxcbiAgICAgIGltYWdlU3RhdGUuY3JvcFkgIT09IDAgfHxcbiAgICAgIGltYWdlU3RhdGUuZmxpcFggfHxcbiAgICAgIGltYWdlU3RhdGUuZmxpcFkgfHxcbiAgICAgIGltYWdlU3RhdGUuYW5nbGUgIT09IDA7XG5cbiAgICB0b29saW5nID0gKFxuICAgICAgPD5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX190b29sc19fdG9vbCBNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbiBNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbi0td29yZHNcIlxuICAgICAgICAgIGRpc2FibGVkPXshY2FuUmVzZXR9XG4gICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFmYWJyaWNDYW52YXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdJbWFnZVN0YXRlID0ge1xuICAgICAgICAgICAgICAuLi5JTklUSUFMX0lNQUdFX1NUQVRFLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IGltYWdlLndpZHRoLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNldEltYWdlU3RhdGUobmV3SW1hZ2VTdGF0ZSk7XG4gICAgICAgICAgICBtb3ZlRmFicmljT2JqZWN0c0ZvclJlc2V0KGZhYnJpY0NhbnZhcywgaW1hZ2VTdGF0ZSk7XG4gICAgICAgICAgICB0YWtlU25hcHNob3QoJ3Jlc2V0JywgbmV3SW1hZ2VTdGF0ZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtpMThuKCdNZWRpYUVkaXRvcl9fY3JvcC0tcmVzZXQnKX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNZWRpYUVkaXRvcl9fY3JvcC0tcm90YXRlJyl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiTWVkaWFFZGl0b3JfX3Rvb2xzX190b29sIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS1yb3RhdGVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmFicmljQ2FudmFzLmdldE9iamVjdHMoKS5mb3JFYWNoKG9iaiA9PiB7XG4gICAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNZWRpYUVkaXRvckZhYnJpY0Nyb3BSZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgY2VudGVyID0gb2JqLmdldENlbnRlclBvaW50KCk7XG5cbiAgICAgICAgICAgICAgb2JqLnNldCgnYW5nbGUnLCAoKG9iai5hbmdsZSB8fCAwKSArIDI3MCkgJSAzNjApO1xuXG4gICAgICAgICAgICAgIG9iai5zZXRQb3NpdGlvbkJ5T3JpZ2luKFxuICAgICAgICAgICAgICAgIG5ldyBmYWJyaWMuUG9pbnQoY2VudGVyLnksIGltYWdlU3RhdGUud2lkdGggLSBjZW50ZXIueCksXG4gICAgICAgICAgICAgICAgJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgJ2NlbnRlcidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgb2JqLnNldENvb3JkcygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld0ltYWdlU3RhdGUgPSB7XG4gICAgICAgICAgICAgIC4uLmltYWdlU3RhdGUsXG4gICAgICAgICAgICAgIGFuZ2xlOiAoaW1hZ2VTdGF0ZS5hbmdsZSArIDI3MCkgJSAzNjAsXG4gICAgICAgICAgICAgIGhlaWdodDogaW1hZ2VTdGF0ZS53aWR0aCxcbiAgICAgICAgICAgICAgd2lkdGg6IGltYWdlU3RhdGUuaGVpZ2h0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNldEltYWdlU3RhdGUobmV3SW1hZ2VTdGF0ZSk7XG4gICAgICAgICAgICB0YWtlU25hcHNob3QoJ3JvdGF0ZScsIG5ld0ltYWdlU3RhdGUpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNZWRpYUVkaXRvcl9fY3JvcC0tZmxpcCcpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX190b29sc19fdG9vbCBNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbiBNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbi0tZmxpcFwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFmYWJyaWNDYW52YXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdJbWFnZVN0YXRlID0ge1xuICAgICAgICAgICAgICAuLi5pbWFnZVN0YXRlLFxuICAgICAgICAgICAgICAuLi4oaW1hZ2VTdGF0ZS5hbmdsZSAlIDE4MFxuICAgICAgICAgICAgICAgID8geyBmbGlwWTogIWltYWdlU3RhdGUuZmxpcFkgfVxuICAgICAgICAgICAgICAgIDogeyBmbGlwWDogIWltYWdlU3RhdGUuZmxpcFggfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2V0SW1hZ2VTdGF0ZShuZXdJbWFnZVN0YXRlKTtcbiAgICAgICAgICAgIHRha2VTbmFwc2hvdCgnZmxpcCcsIG5ld0ltYWdlU3RhdGUpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNZWRpYUVkaXRvcl9fY3JvcC0tbG9jaycpfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fdG9vbHNfX2J1dHRvbicsXG4gICAgICAgICAgICBgTWVkaWFFZGl0b3JfX3Rvb2xzX19idXR0b24tLWNyb3AtJHtcbiAgICAgICAgICAgICAgY3JvcEFzcGVjdFJhdGlvTG9jayA/ICcnIDogJ3VuJ1xuICAgICAgICAgICAgfWxvY2tlZGBcbiAgICAgICAgICApfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGlmIChmYWJyaWNDYW52YXMpIHtcbiAgICAgICAgICAgICAgZmFicmljQ2FudmFzLnVuaWZvcm1TY2FsaW5nID0gIWNyb3BBc3BlY3RSYXRpb0xvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDcm9wQXNwZWN0UmF0aW9Mb2NrKCFjcm9wQXNwZWN0UmF0aW9Mb2NrKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiTWVkaWFFZGl0b3JfX3Rvb2xzX190b29sIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uIE1lZGlhRWRpdG9yX190b29sc19fYnV0dG9uLS13b3Jkc1wiXG4gICAgICAgICAgZGlzYWJsZWQ9eyFjYW5Dcm9wfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcGVuZGluZ0Nyb3AgPSBnZXRQZW5kaW5nQ3JvcChmYWJyaWNDYW52YXMpO1xuICAgICAgICAgICAgaWYgKCFwZW5kaW5nQ3JvcCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld0ltYWdlU3RhdGUgPSBnZXROZXdJbWFnZVN0YXRlRnJvbUNyb3AoXG4gICAgICAgICAgICAgIGltYWdlU3RhdGUsXG4gICAgICAgICAgICAgIHBlbmRpbmdDcm9wXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2V0SW1hZ2VTdGF0ZShuZXdJbWFnZVN0YXRlKTtcbiAgICAgICAgICAgIG1vdmVGYWJyaWNPYmplY3RzRm9yQ3JvcChmYWJyaWNDYW52YXMsIHBlbmRpbmdDcm9wKTtcbiAgICAgICAgICAgIHRha2VTbmFwc2hvdCgnY3JvcCcsIG5ld0ltYWdlU3RhdGUpO1xuICAgICAgICAgICAgc2V0RWRpdE1vZGUodW5kZWZpbmVkKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAge2kxOG4oJ2RvbmUnKX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8Lz5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZVBvcnRhbChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX19jb250YWluZXJcIj5cbiAgICAgICAgPE1lYXN1cmVcbiAgICAgICAgICBib3VuZHNcbiAgICAgICAgICBvblJlc2l6ZT17KHsgYm91bmRzIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghYm91bmRzKSB7XG4gICAgICAgICAgICAgIGxvZy5lcnJvcignV2Ugc2hvdWxkIGJlIG1lYXN1cmluZyB0aGUgYm91bmRzJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldENvbnRhaW5lcldpZHRoKGJvdW5kcy53aWR0aCk7XG4gICAgICAgICAgICBzZXRDb250YWluZXJIZWlnaHQoYm91bmRzLmhlaWdodCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHsoeyBtZWFzdXJlUmVmIH0pID0+IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTWVkaWFFZGl0b3JfX21lZGlhXCIgcmVmPXttZWFzdXJlUmVmfT5cbiAgICAgICAgICAgICAge2ltYWdlICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ01lZGlhRWRpdG9yX19tZWRpYS0tY2FudmFzJywge1xuICAgICAgICAgICAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fbWVkaWEtLWNhbnZhcy0tY3JvcHBpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdE1vZGUgPT09IEVkaXRNb2RlLkNyb3AsXG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICBpZD17Y2FudmFzSWR9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9NZWFzdXJlPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX190b29sYmFyXCI+XG4gICAgICAgIHt0b29saW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTWVkaWFFZGl0b3JfX3Rvb2xzXCI+e3Rvb2xpbmd9PC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNZWRpYUVkaXRvcl9fdG9vbGJhci0tc3BhY2VcIiAvPlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX190b29sYmFyLS1idXR0b25zXCI+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5TZWNvbmRhcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2kxOG4oJ2Rpc2NhcmQnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX19jb250cm9sc1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNZWRpYUVkaXRvcl9fY29udHJvbC0tZHJhdycpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoe1xuICAgICAgICAgICAgICAgIE1lZGlhRWRpdG9yX19jb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fY29udHJvbC0tcGVuJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnTWVkaWFFZGl0b3JfX2NvbnRyb2wtLXNlbGVjdGVkJzogZWRpdE1vZGUgPT09IEVkaXRNb2RlLkRyYXcsXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0RWRpdE1vZGUoXG4gICAgICAgICAgICAgICAgICBlZGl0TW9kZSA9PT0gRWRpdE1vZGUuRHJhdyA/IHVuZGVmaW5lZCA6IEVkaXRNb2RlLkRyYXdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ01lZGlhRWRpdG9yX19jb250cm9sLS10ZXh0Jyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgTWVkaWFFZGl0b3JfX2NvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgJ01lZGlhRWRpdG9yX19jb250cm9sLS10ZXh0JzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnTWVkaWFFZGl0b3JfX2NvbnRyb2wtLXNlbGVjdGVkJzogZWRpdE1vZGUgPT09IEVkaXRNb2RlLlRleHQsXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5UZXh0KSB7XG4gICAgICAgICAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gZmFicmljQ2FudmFzPy5nZXRBY3RpdmVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNZWRpYUVkaXRvckZhYnJpY0lUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5leGl0RWRpdGluZygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzZXRFZGl0TW9kZShFZGl0TW9kZS5UZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTdGlja2VyQnV0dG9uXG4gICAgICAgICAgICAgIGJsZXNzZWRQYWNrcz17W119XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgTWVkaWFFZGl0b3JfX2NvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgJ01lZGlhRWRpdG9yX19jb250cm9sLS1zdGlja2VyJzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIGNsZWFySW5zdGFsbGVkU3RpY2tlclBhY2s9e25vb3B9XG4gICAgICAgICAgICAgIGNsZWFyU2hvd0ludHJvZHVjdGlvbj17KCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIHVzaW5nIHRoaXMgYXMgYSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgc3RpY2tlciBidXR0b25cbiAgICAgICAgICAgICAgICAvLyBpcyBwcmVzc2VkLlxuICAgICAgICAgICAgICAgIGZhYnJpY0NhbnZhcz8uZGlzY2FyZEFjdGl2ZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgIHNldEVkaXRNb2RlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGNsZWFyU2hvd1BpY2tlckhpbnQ9e25vb3B9XG4gICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgIGluc3RhbGxlZFBhY2tzPXtpbnN0YWxsZWRQYWNrc31cbiAgICAgICAgICAgICAga25vd25QYWNrcz17W119XG4gICAgICAgICAgICAgIG9uUGlja1N0aWNrZXI9eyhfcGFja0lkLCBfc3RpY2tlcklkLCBzcmM6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgU1RJQ0tFUl9TSVpFX1JFTEFUSVZFX1RPX0NBTlZBUyA9IDQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9XG4gICAgICAgICAgICAgICAgICBNYXRoLm1pbihpbWFnZVN0YXRlLndpZHRoLCBpbWFnZVN0YXRlLmhlaWdodCkgL1xuICAgICAgICAgICAgICAgICAgU1RJQ0tFUl9TSVpFX1JFTEFUSVZFX1RPX0NBTlZBUztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN0aWNrZXIgPSBuZXcgTWVkaWFFZGl0b3JGYWJyaWNTdGlja2VyKHNyYyk7XG4gICAgICAgICAgICAgICAgc3RpY2tlci5zY2FsZVRvSGVpZ2h0KHNpemUpO1xuICAgICAgICAgICAgICAgIHN0aWNrZXIuc2V0UG9zaXRpb25CeU9yaWdpbihcbiAgICAgICAgICAgICAgICAgIG5ldyBmYWJyaWMuUG9pbnQoaW1hZ2VTdGF0ZS53aWR0aCAvIDIsIGltYWdlU3RhdGUuaGVpZ2h0IC8gMiksXG4gICAgICAgICAgICAgICAgICAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICdjZW50ZXInXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBzdGlja2VyLnNldENvb3JkcygpO1xuXG4gICAgICAgICAgICAgICAgZmFicmljQ2FudmFzLmFkZChzdGlja2VyKTtcbiAgICAgICAgICAgICAgICBmYWJyaWNDYW52YXMuc2V0QWN0aXZlT2JqZWN0KHN0aWNrZXIpO1xuICAgICAgICAgICAgICAgIHNldEVkaXRNb2RlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHJlY2VpdmVkUGFja3M9e1tdfVxuICAgICAgICAgICAgICByZWNlbnRTdGlja2Vycz17cmVjZW50U3RpY2tlcnN9XG4gICAgICAgICAgICAgIHNob3dQaWNrZXJIaW50PXtmYWxzZX1cbiAgICAgICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdNZWRpYUVkaXRvcl9fY29udHJvbC0tY3JvcCcpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoe1xuICAgICAgICAgICAgICAgIE1lZGlhRWRpdG9yX19jb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgICdNZWRpYUVkaXRvcl9fY29udHJvbC0tY3JvcCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ01lZGlhRWRpdG9yX19jb250cm9sLS1zZWxlY3RlZCc6IGVkaXRNb2RlID09PSBFZGl0TW9kZS5Dcm9wLFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZmFicmljQ2FudmFzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlZGl0TW9kZSA9PT0gRWRpdE1vZGUuQ3JvcCkge1xuICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gZmFicmljQ2FudmFzLmdldEFjdGl2ZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIE1lZGlhRWRpdG9yRmFicmljQ3JvcFJlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFicmljQ2FudmFzLnJlbW92ZShvYmopO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgc2V0RWRpdE1vZGUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2V0RWRpdE1vZGUoRWRpdE1vZGUuQ3JvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ01lZGlhRWRpdG9yX19jb250cm9sLS11bmRvJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX19jb250cm9sIE1lZGlhRWRpdG9yX19jb250cm9sLS11bmRvXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5VbmRvfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5Dcm9wKSB7XG4gICAgICAgICAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bmRvSWZQb3NzaWJsZSgpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ01lZGlhRWRpdG9yX19jb250cm9sLS1yZWRvJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIk1lZGlhRWRpdG9yX19jb250cm9sIE1lZGlhRWRpdG9yX19jb250cm9sLS1yZWRvXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5SZWRvfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRNb2RlID09PSBFZGl0TW9kZS5Dcm9wKSB7XG4gICAgICAgICAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWRvSWZQb3NzaWJsZSgpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFpbWFnZSB8fCBpc1NhdmluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFmYWJyaWNDYW52YXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZXRFZGl0TW9kZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICBzZXRJc1NhdmluZyh0cnVlKTtcblxuICAgICAgICAgICAgICBsZXQgZGF0YTogVWludDhBcnJheTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJGYWJyaWNDYW52YXMgPSBhd2FpdCBjbG9uZUZhYnJpY0NhbnZhcyhcbiAgICAgICAgICAgICAgICAgIGZhYnJpY0NhbnZhc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZW5kZXJGYWJyaWNDYW52YXMucmVtb3ZlKFxuICAgICAgICAgICAgICAgICAgLi4ucmVuZGVyRmFicmljQ2FudmFzXG4gICAgICAgICAgICAgICAgICAgIC5nZXRPYmplY3RzKClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihvYmogPT4gb2JqLmV4Y2x1ZGVGcm9tRXhwb3J0KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmluYWxJbWFnZVN0YXRlOiBJbWFnZVN0YXRlVHlwZTtcbiAgICAgICAgICAgICAgICBjb25zdCBwZW5kaW5nQ3JvcCA9IGdldFBlbmRpbmdDcm9wKGZhYnJpY0NhbnZhcyk7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdDcm9wKSB7XG4gICAgICAgICAgICAgICAgICBmaW5hbEltYWdlU3RhdGUgPSBnZXROZXdJbWFnZVN0YXRlRnJvbUNyb3AoXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdDcm9wXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgbW92ZUZhYnJpY09iamVjdHNGb3JDcm9wKHJlbmRlckZhYnJpY0NhbnZhcywgcGVuZGluZ0Nyb3ApO1xuICAgICAgICAgICAgICAgICAgZHJhd0ZhYnJpY0JhY2tncm91bmRJbWFnZSh7XG4gICAgICAgICAgICAgICAgICAgIGZhYnJpY0NhbnZhczogcmVuZGVyRmFicmljQ2FudmFzLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTdGF0ZTogZmluYWxJbWFnZVN0YXRlLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZpbmFsSW1hZ2VTdGF0ZSA9IGltYWdlU3RhdGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVuZGVyRmFicmljQ2FudmFzLnNldERpbWVuc2lvbnMoe1xuICAgICAgICAgICAgICAgICAgd2lkdGg6IGZpbmFsSW1hZ2VTdGF0ZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogZmluYWxJbWFnZVN0YXRlLmhlaWdodCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZW5kZXJGYWJyaWNDYW52YXMuc2V0Wm9vbSgxKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJlZENhbnZhcyA9IHJlbmRlckZhYnJpY0NhbnZhcy50b0NhbnZhc0VsZW1lbnQoKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCBjYW52YXNUb0J5dGVzKHJlbmRlcmVkQ2FudmFzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBzZXRJc1NhdmluZyhmYWxzZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBvbkRvbmUoZGF0YSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlByaW1hcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2RvbmVCdXR0b25MYWJlbCB8fCBpMThuKCdzYXZlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+LFxuICAgIHBvcnRhbFxuICApO1xufTtcblxuZnVuY3Rpb24gZ2V0UGVuZGluZ0Nyb3AoXG4gIGZhYnJpY0NhbnZhczogZmFicmljLkNhbnZhc1xuKTogdW5kZWZpbmVkIHwgUGVuZGluZ0Nyb3BUeXBlIHtcbiAgY29uc3QgYWN0aXZlT2JqZWN0ID0gZmFicmljQ2FudmFzLmdldEFjdGl2ZU9iamVjdCgpO1xuICByZXR1cm4gYWN0aXZlT2JqZWN0IGluc3RhbmNlb2YgTWVkaWFFZGl0b3JGYWJyaWNDcm9wUmVjdFxuICAgID8gYWN0aXZlT2JqZWN0LmdldEJvdW5kaW5nUmVjdCh0cnVlKVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXROZXdJbWFnZVN0YXRlRnJvbUNyb3AoXG4gIHN0YXRlOiBSZWFkb25seTxJbWFnZVN0YXRlVHlwZT4sXG4gIHsgbGVmdCwgaGVpZ2h0LCB0b3AsIHdpZHRoIH06IFJlYWRvbmx5PFBlbmRpbmdDcm9wVHlwZT5cbik6IEltYWdlU3RhdGVUeXBlIHtcbiAgbGV0IGNyb3BYOiBudW1iZXI7XG4gIGxldCBjcm9wWTogbnVtYmVyO1xuICBzd2l0Y2ggKHN0YXRlLmFuZ2xlKSB7XG4gICAgY2FzZSAwOlxuICAgICAgY3JvcFggPSBzdGF0ZS5jcm9wWCArIGxlZnQ7XG4gICAgICBjcm9wWSA9IHN0YXRlLmNyb3BZICsgdG9wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSA5MDpcbiAgICAgIGNyb3BYID0gc3RhdGUuY3JvcFggKyB0b3A7XG4gICAgICBjcm9wWSA9IHN0YXRlLmNyb3BZICsgKHN0YXRlLndpZHRoIC0gKGxlZnQgKyB3aWR0aCkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxODA6XG4gICAgICBjcm9wWCA9IHN0YXRlLmNyb3BYICsgKHN0YXRlLndpZHRoIC0gKGxlZnQgKyB3aWR0aCkpO1xuICAgICAgY3JvcFkgPSBzdGF0ZS5jcm9wWSArIChzdGF0ZS5oZWlnaHQgLSAodG9wICsgaGVpZ2h0KSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI3MDpcbiAgICAgIGNyb3BYID0gc3RhdGUuY3JvcFggKyAoc3RhdGUuaGVpZ2h0IC0gKHRvcCArIGhlaWdodCkpO1xuICAgICAgY3JvcFkgPSBzdGF0ZS5jcm9wWSArIGxlZnQ7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGFuZ2xlJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGNyb3BYLFxuICAgIGNyb3BZLFxuICAgIGhlaWdodCxcbiAgICB3aWR0aCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xvbmVGYWJyaWNDYW52YXMob3JpZ2luYWw6IGZhYnJpYy5DYW52YXMpOiBQcm9taXNlPGZhYnJpYy5DYW52YXM+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIG9yaWdpbmFsLmNsb25lKHJlc29sdmUpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbW92ZUZhYnJpY09iamVjdHNGb3JDcm9wKFxuICBmYWJyaWNDYW52YXM6IGZhYnJpYy5DYW52YXMsXG4gIHsgbGVmdCwgdG9wIH06IFJlYWRvbmx5PFBlbmRpbmdDcm9wVHlwZT5cbik6IHZvaWQge1xuICBmYWJyaWNDYW52YXMuZ2V0T2JqZWN0cygpLmZvckVhY2gob2JqID0+IHtcbiAgICBjb25zdCB7IHgsIHkgfSA9IG9iai5nZXRDZW50ZXJQb2ludCgpO1xuXG4gICAgY29uc3QgdHJhbnNsYXRlZENlbnRlciA9IG5ldyBmYWJyaWMuUG9pbnQoeCAtIGxlZnQsIHkgLSB0b3ApO1xuICAgIG9iai5zZXRQb3NpdGlvbkJ5T3JpZ2luKHRyYW5zbGF0ZWRDZW50ZXIsICdjZW50ZXInLCAnY2VudGVyJyk7XG4gICAgb2JqLnNldENvb3JkcygpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbW92ZUZhYnJpY09iamVjdHNGb3JSZXNldChcbiAgZmFicmljQ2FudmFzOiBmYWJyaWMuQ2FudmFzLFxuICBvbGRJbWFnZVN0YXRlOiBSZWFkb25seTxJbWFnZVN0YXRlVHlwZT5cbik6IHZvaWQge1xuICBmYWJyaWNDYW52YXMuZ2V0T2JqZWN0cygpLmZvckVhY2gob2JqID0+IHtcbiAgICBpZiAob2JqLmV4Y2x1ZGVGcm9tRXhwb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG5ld0NlbnRlclg6IG51bWJlcjtcbiAgICBsZXQgbmV3Q2VudGVyWTogbnVtYmVyO1xuXG4gICAgLy8gRmlyc3QsIHJlc2V0IHBvc2l0aW9uIGNoYW5nZXMgY2F1c2VkIGJ5IGltYWdlIHJvdGF0aW9uOlxuICAgIGNvbnN0IG9sZENlbnRlciA9IG9iai5nZXRDZW50ZXJQb2ludCgpO1xuICAgIGNvbnN0IGRpc3RhbmNlRnJvbVJpZ2h0RWRnZSA9IG9sZEltYWdlU3RhdGUud2lkdGggLSBvbGRDZW50ZXIueDtcbiAgICBjb25zdCBkaXN0YW5jZUZyb21Cb3R0b21FZGdlID0gb2xkSW1hZ2VTdGF0ZS5oZWlnaHQgLSBvbGRDZW50ZXIueTtcbiAgICBzd2l0Y2ggKG9sZEltYWdlU3RhdGUuYW5nbGUgJSAzNjApIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgbmV3Q2VudGVyWCA9IG9sZENlbnRlci54O1xuICAgICAgICBuZXdDZW50ZXJZID0gb2xkQ2VudGVyLnk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5MDpcbiAgICAgICAgbmV3Q2VudGVyWCA9IG9sZENlbnRlci55O1xuICAgICAgICBuZXdDZW50ZXJZID0gZGlzdGFuY2VGcm9tUmlnaHRFZGdlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTgwOlxuICAgICAgICBuZXdDZW50ZXJYID0gZGlzdGFuY2VGcm9tUmlnaHRFZGdlO1xuICAgICAgICBuZXdDZW50ZXJZID0gZGlzdGFuY2VGcm9tQm90dG9tRWRnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI3MDpcbiAgICAgICAgbmV3Q2VudGVyWCA9IGRpc3RhbmNlRnJvbUJvdHRvbUVkZ2U7XG4gICAgICAgIG5ld0NlbnRlclkgPSBvbGRDZW50ZXIueDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgYW5nbGUnKTtcbiAgICB9XG5cbiAgICAvLyBOZXh0LCByZXNldCBwb3NpdGlvbiBjaGFuZ2VzIGNhdXNlZCBieSBjcm9wOlxuICAgIG5ld0NlbnRlclggKz0gb2xkSW1hZ2VTdGF0ZS5jcm9wWDtcbiAgICBuZXdDZW50ZXJZICs9IG9sZEltYWdlU3RhdGUuY3JvcFk7XG5cbiAgICAvLyBJdCdzIGltcG9ydGFudCB0byBzZXQgdGhlIGFuZ2xlICpiZWZvcmUqIHNldHRpbmcgdGhlIHBvc2l0aW9uLCBiZWNhdXNlXG4gICAgLy8gICBGYWJyaWMncyBwb3NpdGlvbmluZyBpcyBhZmZlY3RlZCBieSBvYmplY3QgYW5nbGUuXG4gICAgb2JqLnNldCgnYW5nbGUnLCAob2JqLmFuZ2xlIHx8IDApIC0gb2xkSW1hZ2VTdGF0ZS5hbmdsZSk7XG4gICAgb2JqLnNldFBvc2l0aW9uQnlPcmlnaW4oXG4gICAgICBuZXcgZmFicmljLlBvaW50KG5ld0NlbnRlclgsIG5ld0NlbnRlclkpLFxuICAgICAgJ2NlbnRlcicsXG4gICAgICAnY2VudGVyJ1xuICAgICk7XG5cbiAgICBvYmouc2V0Q29vcmRzKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkcmF3RmFicmljQmFja2dyb3VuZEltYWdlKHtcbiAgZmFicmljQ2FudmFzLFxuICBpbWFnZSxcbiAgaW1hZ2VTdGF0ZSxcbn06IFJlYWRvbmx5PHtcbiAgZmFicmljQ2FudmFzOiBmYWJyaWMuQ2FudmFzO1xuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcbiAgaW1hZ2VTdGF0ZTogUmVhZG9ubHk8SW1hZ2VTdGF0ZVR5cGU+O1xufT4pOiB2b2lkIHtcbiAgY29uc3QgYmFja2dyb3VuZEltYWdlID0gbmV3IGZhYnJpYy5JbWFnZShpbWFnZSwge1xuICAgIGNhbnZhczogZmFicmljQ2FudmFzLFxuICAgIGhlaWdodDogaW1hZ2VTdGF0ZS5oZWlnaHQgfHwgaW1hZ2UuaGVpZ2h0LFxuICAgIHdpZHRoOiBpbWFnZVN0YXRlLndpZHRoIHx8IGltYWdlLndpZHRoLFxuICB9KTtcblxuICBsZXQgbGVmdDogbnVtYmVyO1xuICBsZXQgdG9wOiBudW1iZXI7XG4gIHN3aXRjaCAoaW1hZ2VTdGF0ZS5hbmdsZSkge1xuICAgIGNhc2UgMDpcbiAgICAgIGxlZnQgPSAwO1xuICAgICAgdG9wID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgOTA6XG4gICAgICBsZWZ0ID0gaW1hZ2VTdGF0ZS53aWR0aDtcbiAgICAgIHRvcCA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE4MDpcbiAgICAgIGxlZnQgPSBpbWFnZVN0YXRlLndpZHRoO1xuICAgICAgdG9wID0gaW1hZ2VTdGF0ZS5oZWlnaHQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI3MDpcbiAgICAgIGxlZnQgPSAwO1xuICAgICAgdG9wID0gaW1hZ2VTdGF0ZS5oZWlnaHQ7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGFuZ2xlJyk7XG4gIH1cblxuICBsZXQgeyBoZWlnaHQsIHdpZHRoIH0gPSBpbWFnZVN0YXRlO1xuICBpZiAoaW1hZ2VTdGF0ZS5hbmdsZSAlIDE4MCkge1xuICAgIFt3aWR0aCwgaGVpZ2h0XSA9IFtoZWlnaHQsIHdpZHRoXTtcbiAgfVxuXG4gIGZhYnJpY0NhbnZhcy5zZXRCYWNrZ3JvdW5kSW1hZ2UoXG4gICAgYmFja2dyb3VuZEltYWdlLFxuICAgIGZhYnJpY0NhbnZhcy5yZXF1ZXN0UmVuZGVyQWxsLmJpbmQoZmFicmljQ2FudmFzKSxcbiAgICB7XG4gICAgICBhbmdsZTogaW1hZ2VTdGF0ZS5hbmdsZSxcbiAgICAgIGNyb3BYOiBpbWFnZVN0YXRlLmNyb3BYLFxuICAgICAgY3JvcFk6IGltYWdlU3RhdGUuY3JvcFksXG4gICAgICBmbGlwWDogaW1hZ2VTdGF0ZS5mbGlwWCxcbiAgICAgIGZsaXBZOiBpbWFnZVN0YXRlLmZsaXBZLFxuICAgICAgbGVmdCxcbiAgICAgIHRvcCxcbiAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfVxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLDJCQUFvQjtBQUNwQixtQkFBMkM7QUFDM0Msd0JBQXVCO0FBQ3ZCLHVCQUE2QjtBQUM3QixvQkFBdUI7QUFDdkIsb0JBQStCO0FBTS9CLFVBQXFCO0FBQ3JCLG9CQUFzQztBQUN0Qyx5QkFBNEI7QUFDNUIsb0JBQXVCO0FBQ3ZCLDJCQUE4QjtBQUM5QixtQkFBc0I7QUFDdEIsMkJBQThCO0FBQzlCLDhCQUFpQztBQUNqQyx1QkFBMEI7QUFDMUIseUJBQTRCO0FBRTVCLDBDQUE2QztBQUM3Qyx1Q0FBMEM7QUFDMUMsb0NBQXVDO0FBQ3ZDLHNDQUF5QztBQUN6QyxrQ0FBcUM7QUFDckMsbUJBQWdDO0FBQ2hDLG9DQUdPO0FBVVAsTUFBTSxzQkFBc0M7QUFBQSxFQUMxQyxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUixPQUFPO0FBQ1Q7QUFFQSxJQUFLLFdBQUwsa0JBQUssY0FBTDtBQUNFLHNCQUFPO0FBQ1Asc0JBQU87QUFDUCxzQkFBTztBQUhKO0FBQUE7QUFNTCxJQUFLLFlBQUwsa0JBQUssZUFBTDtBQUNFLGtDQUFPLEtBQVA7QUFDQSxxQ0FBVSxLQUFWO0FBQ0Esb0NBQVMsTUFBVDtBQUNBLG1DQUFRLE1BQVI7QUFKRztBQUFBO0FBT0wsSUFBSyxXQUFMLGtCQUFLLGNBQUw7QUFDRSxxQkFBTTtBQUNOLDZCQUFjO0FBRlg7QUFBQTtBQVlMLHFCQUFxQixJQUE0QjtBQUMvQyxRQUFNLEVBQUUsU0FBUyxZQUFZO0FBQzdCLFFBQU0sYUFBYSx1QkFBSSxRQUFRLFVB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
