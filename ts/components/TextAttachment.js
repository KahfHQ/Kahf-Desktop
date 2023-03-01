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
var TextAttachment_exports = {};
__export(TextAttachment_exports, {
  TextAttachment: () => TextAttachment
});
module.exports = __toCommonJS(TextAttachment_exports);
var import_react_measure = __toESM(require("react-measure"));
var import_react = __toESM(require("react"));
var import_react_textarea_autosize = __toESM(require("react-textarea-autosize"));
var import_classnames = __toESM(require("classnames"));
var import_AddNewLines = require("./conversation/AddNewLines");
var import_Emojify = require("./conversation/Emojify");
var import_StagedLinkPreview = require("./conversation/StagedLinkPreview");
var import_Attachment = require("../types/Attachment");
var import_grapheme = require("../util/grapheme");
var import_LinkPreview = require("../types/LinkPreview");
var import_getFontNameByTextScript = require("../util/getFontNameByTextScript");
var import_getStoryBackground = require("../util/getStoryBackground");
const renderNewLines = /* @__PURE__ */ __name(({
  text: textWithNewLines,
  key
}) => {
  return /* @__PURE__ */ import_react.default.createElement(import_AddNewLines.AddNewLines, {
    key,
    text: textWithNewLines
  });
}, "renderNewLines");
const CHAR_LIMIT_TEXT_LARGE = 50;
const CHAR_LIMIT_TEXT_MEDIUM = 200;
const FONT_SIZE_LARGE = 64;
const FONT_SIZE_MEDIUM = 42;
const FONT_SIZE_SMALL = 32;
var TextSize = /* @__PURE__ */ ((TextSize2) => {
  TextSize2[TextSize2["Small"] = 0] = "Small";
  TextSize2[TextSize2["Medium"] = 1] = "Medium";
  TextSize2[TextSize2["Large"] = 2] = "Large";
  return TextSize2;
})(TextSize || {});
function getTextSize(text) {
  const length = (0, import_grapheme.count)(text);
  if (length < CHAR_LIMIT_TEXT_LARGE) {
    return 2 /* Large */;
  }
  if (length < CHAR_LIMIT_TEXT_MEDIUM) {
    return 1 /* Medium */;
  }
  return 0 /* Small */;
}
function getFont(text, textSize, textStyle, i18n) {
  const textStyleIndex = Number(textStyle) || 0;
  const fontName = (0, import_getFontNameByTextScript.getFontNameByTextScript)(text, textStyleIndex, i18n);
  let fontSize = FONT_SIZE_SMALL;
  switch (textSize) {
    case 2 /* Large */:
      fontSize = FONT_SIZE_LARGE;
      break;
    case 1 /* Medium */:
      fontSize = FONT_SIZE_MEDIUM;
      break;
    default:
      fontSize = FONT_SIZE_SMALL;
  }
  const fontWeight = textStyle === import_Attachment.TextAttachmentStyleType.BOLD ? "bold " : "";
  return `${fontWeight}${fontSize}pt ${fontName}`;
}
function getTextStyles(textContent, textForegroundColor, textStyle, i18n) {
  return {
    color: (0, import_getStoryBackground.getHexFromNumber)(textForegroundColor || import_getStoryBackground.COLOR_WHITE_INT),
    font: getFont(textContent, getTextSize(textContent), textStyle, i18n),
    textAlign: getTextSize(textContent) === 0 /* Small */ ? "left" : "center"
  };
}
const TextAttachment = /* @__PURE__ */ __name(({
  disableLinkPreviewPopup,
  i18n,
  isEditingText,
  isThumbnail,
  onChange,
  onClick,
  onRemoveLinkPreview,
  textAttachment
}) => {
  const linkPreview = (0, import_react.useRef)(null);
  const [linkPreviewOffsetTop, setLinkPreviewOffsetTop] = (0, import_react.useState)();
  const textContent = textAttachment.text || "";
  const textEditorRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const node = textEditorRef.current;
    if (!node) {
      return;
    }
    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
  }, [isEditingText]);
  return /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
    bounds: true
  }, ({ contentRect, measureRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment",
    onClick: () => {
      if (linkPreviewOffsetTop) {
        setLinkPreviewOffsetTop(void 0);
      }
      onClick?.();
    },
    onKeyUp: (ev) => {
      if (ev.key === "Escape" && linkPreviewOffsetTop) {
        setLinkPreviewOffsetTop(void 0);
      }
    },
    ref: measureRef
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__story",
    style: {
      background: (0, import_getStoryBackground.getBackgroundColor)(textAttachment),
      transform: `scale(${(contentRect.bounds?.height || 1) / 1280})`
    }
  }, (textContent || onChange) && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__text",
    style: {
      backgroundColor: textAttachment.textBackgroundColor ? (0, import_getStoryBackground.getHexFromNumber)(textAttachment.textBackgroundColor) : "transparent"
    }
  }, onChange ? /* @__PURE__ */ import_react.default.createElement(import_react_textarea_autosize.default, {
    className: "TextAttachment__text__container TextAttachment__text__textarea",
    disabled: !isEditingText,
    onChange: (ev) => onChange(ev.currentTarget.value),
    placeholder: i18n("TextAttachment__placeholder"),
    ref: textEditorRef,
    style: getTextStyles(textContent, textAttachment.textForegroundColor, textAttachment.textStyle, i18n),
    value: textContent
  }) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__text__container",
    style: getTextStyles(textContent, textAttachment.textForegroundColor, textAttachment.textStyle, i18n)
  }, /* @__PURE__ */ import_react.default.createElement(import_Emojify.Emojify, {
    text: textContent,
    renderNonEmoji: renderNewLines
  }))), textAttachment.preview && textAttachment.preview.url && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, linkPreviewOffsetTop && !isThumbnail && /* @__PURE__ */ import_react.default.createElement("a", {
    className: "TextAttachment__preview__tooltip",
    href: textAttachment.preview.url,
    rel: "noreferrer",
    style: {
      top: linkPreviewOffsetTop - 150
    },
    target: "_blank"
  }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", null, i18n("TextAttachment__preview__link")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__preview__tooltip__url"
  }, textAttachment.preview.url)), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__preview__tooltip__arrow"
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("TextAttachment__preview-container", {
      "TextAttachment__preview-container--large": Boolean(textAttachment.preview.title)
    }),
    ref: linkPreview,
    onFocus: () => {
      if (!disableLinkPreviewPopup) {
        setLinkPreviewOffsetTop(linkPreview?.current?.offsetTop);
      }
    },
    onMouseOver: () => {
      if (!disableLinkPreviewPopup) {
        setLinkPreviewOffsetTop(linkPreview?.current?.offsetTop);
      }
    }
  }, onRemoveLinkPreview && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "TextAttachment__preview__remove"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("Keyboard--remove-draft-link-preview"),
    type: "button",
    onClick: onRemoveLinkPreview
  })), /* @__PURE__ */ import_react.default.createElement(import_StagedLinkPreview.StagedLinkPreview, {
    domain: (0, import_LinkPreview.getDomain)(String(textAttachment.preview.url)),
    i18n,
    image: textAttachment.preview.image,
    imageSize: textAttachment.preview.title ? 144 : 72,
    moduleClassName: "TextAttachment__preview",
    title: textAttachment.preview.title || void 0,
    url: textAttachment.preview.url
  }))))));
}, "TextAttachment");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextAttachment
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGV4dEF0dGFjaG1lbnQudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBNZWFzdXJlIGZyb20gJ3JlYWN0LW1lYXN1cmUnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUZXh0YXJlYUF1dG9zaXplIGZyb20gJ3JlYWN0LXRleHRhcmVhLWF1dG9zaXplJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIFJlbmRlclRleHRDYWxsYmFja1R5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgVGV4dEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBBZGROZXdMaW5lcyB9IGZyb20gJy4vY29udmVyc2F0aW9uL0FkZE5ld0xpbmVzJztcbmltcG9ydCB7IEVtb2ppZnkgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9FbW9qaWZ5JztcbmltcG9ydCB7IFN0YWdlZExpbmtQcmV2aWV3IH0gZnJvbSAnLi9jb252ZXJzYXRpb24vU3RhZ2VkTGlua1ByZXZpZXcnO1xuaW1wb3J0IHsgVGV4dEF0dGFjaG1lbnRTdHlsZVR5cGUgfSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGNvdW50IH0gZnJvbSAnLi4vdXRpbC9ncmFwaGVtZSc7XG5pbXBvcnQgeyBnZXREb21haW4gfSBmcm9tICcuLi90eXBlcy9MaW5rUHJldmlldyc7XG5pbXBvcnQgeyBnZXRGb250TmFtZUJ5VGV4dFNjcmlwdCB9IGZyb20gJy4uL3V0aWwvZ2V0Rm9udE5hbWVCeVRleHRTY3JpcHQnO1xuaW1wb3J0IHtcbiAgQ09MT1JfV0hJVEVfSU5ULFxuICBnZXRIZXhGcm9tTnVtYmVyLFxuICBnZXRCYWNrZ3JvdW5kQ29sb3IsXG59IGZyb20gJy4uL3V0aWwvZ2V0U3RvcnlCYWNrZ3JvdW5kJztcblxuY29uc3QgcmVuZGVyTmV3TGluZXM6IFJlbmRlclRleHRDYWxsYmFja1R5cGUgPSAoe1xuICB0ZXh0OiB0ZXh0V2l0aE5ld0xpbmVzLFxuICBrZXksXG59KSA9PiB7XG4gIHJldHVybiA8QWRkTmV3TGluZXMga2V5PXtrZXl9IHRleHQ9e3RleHRXaXRoTmV3TGluZXN9IC8+O1xufTtcblxuY29uc3QgQ0hBUl9MSU1JVF9URVhUX0xBUkdFID0gNTA7XG5jb25zdCBDSEFSX0xJTUlUX1RFWFRfTUVESVVNID0gMjAwO1xuY29uc3QgRk9OVF9TSVpFX0xBUkdFID0gNjQ7XG5jb25zdCBGT05UX1NJWkVfTUVESVVNID0gNDI7XG5jb25zdCBGT05UX1NJWkVfU01BTEwgPSAzMjtcblxuZW51bSBUZXh0U2l6ZSB7XG4gIFNtYWxsLFxuICBNZWRpdW0sXG4gIExhcmdlLFxufVxuXG5leHBvcnQgdHlwZSBQcm9wc1R5cGUgPSB7XG4gIGRpc2FibGVMaW5rUHJldmlld1BvcHVwPzogYm9vbGVhbjtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgaXNFZGl0aW5nVGV4dD86IGJvb2xlYW47XG4gIGlzVGh1bWJuYWlsPzogYm9vbGVhbjtcbiAgb25DaGFuZ2U/OiAodGV4dDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBvbkNsaWNrPzogKCkgPT4gdW5rbm93bjtcbiAgb25SZW1vdmVMaW5rUHJldmlldz86ICgpID0+IHVua25vd247XG4gIHRleHRBdHRhY2htZW50OiBUZXh0QXR0YWNobWVudFR5cGU7XG59O1xuXG5mdW5jdGlvbiBnZXRUZXh0U2l6ZSh0ZXh0OiBzdHJpbmcpOiBUZXh0U2l6ZSB7XG4gIGNvbnN0IGxlbmd0aCA9IGNvdW50KHRleHQpO1xuXG4gIGlmIChsZW5ndGggPCBDSEFSX0xJTUlUX1RFWFRfTEFSR0UpIHtcbiAgICByZXR1cm4gVGV4dFNpemUuTGFyZ2U7XG4gIH1cblxuICBpZiAobGVuZ3RoIDwgQ0hBUl9MSU1JVF9URVhUX01FRElVTSkge1xuICAgIHJldHVybiBUZXh0U2l6ZS5NZWRpdW07XG4gIH1cblxuICByZXR1cm4gVGV4dFNpemUuU21hbGw7XG59XG5cbmZ1bmN0aW9uIGdldEZvbnQoXG4gIHRleHQ6IHN0cmluZyxcbiAgdGV4dFNpemU6IFRleHRTaXplLFxuICB0ZXh0U3R5bGU/OiBUZXh0QXR0YWNobWVudFN0eWxlVHlwZSB8IG51bGwsXG4gIGkxOG4/OiBMb2NhbGl6ZXJUeXBlXG4pOiBzdHJpbmcge1xuICBjb25zdCB0ZXh0U3R5bGVJbmRleCA9IE51bWJlcih0ZXh0U3R5bGUpIHx8IDA7XG4gIGNvbnN0IGZvbnROYW1lID0gZ2V0Rm9udE5hbWVCeVRleHRTY3JpcHQodGV4dCwgdGV4dFN0eWxlSW5kZXgsIGkxOG4pO1xuXG4gIGxldCBmb250U2l6ZSA9IEZPTlRfU0laRV9TTUFMTDtcbiAgc3dpdGNoICh0ZXh0U2l6ZSkge1xuICAgIGNhc2UgVGV4dFNpemUuTGFyZ2U6XG4gICAgICBmb250U2l6ZSA9IEZPTlRfU0laRV9MQVJHRTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVGV4dFNpemUuTWVkaXVtOlxuICAgICAgZm9udFNpemUgPSBGT05UX1NJWkVfTUVESVVNO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGZvbnRTaXplID0gRk9OVF9TSVpFX1NNQUxMO1xuICB9XG5cbiAgY29uc3QgZm9udFdlaWdodCA9IHRleHRTdHlsZSA9PT0gVGV4dEF0dGFjaG1lbnRTdHlsZVR5cGUuQk9MRCA/ICdib2xkICcgOiAnJztcblxuICByZXR1cm4gYCR7Zm9udFdlaWdodH0ke2ZvbnRTaXplfXB0ICR7Zm9udE5hbWV9YDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFN0eWxlcyhcbiAgdGV4dENvbnRlbnQ6IHN0cmluZyxcbiAgdGV4dEZvcmVncm91bmRDb2xvcj86IG51bWJlciB8IG51bGwsXG4gIHRleHRTdHlsZT86IFRleHRBdHRhY2htZW50U3R5bGVUeXBlIHwgbnVsbCxcbiAgaTE4bj86IExvY2FsaXplclR5cGVcbik6IHsgY29sb3I6IHN0cmluZzsgZm9udDogc3RyaW5nOyB0ZXh0QWxpZ246ICdsZWZ0JyB8ICdjZW50ZXInIH0ge1xuICByZXR1cm4ge1xuICAgIGNvbG9yOiBnZXRIZXhGcm9tTnVtYmVyKHRleHRGb3JlZ3JvdW5kQ29sb3IgfHwgQ09MT1JfV0hJVEVfSU5UKSxcbiAgICBmb250OiBnZXRGb250KHRleHRDb250ZW50LCBnZXRUZXh0U2l6ZSh0ZXh0Q29udGVudCksIHRleHRTdHlsZSwgaTE4biksXG4gICAgdGV4dEFsaWduOiBnZXRUZXh0U2l6ZSh0ZXh0Q29udGVudCkgPT09IFRleHRTaXplLlNtYWxsID8gJ2xlZnQnIDogJ2NlbnRlcicsXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBUZXh0QXR0YWNobWVudCA9ICh7XG4gIGRpc2FibGVMaW5rUHJldmlld1BvcHVwLFxuICBpMThuLFxuICBpc0VkaXRpbmdUZXh0LFxuICBpc1RodW1ibmFpbCxcbiAgb25DaGFuZ2UsXG4gIG9uQ2xpY2ssXG4gIG9uUmVtb3ZlTGlua1ByZXZpZXcsXG4gIHRleHRBdHRhY2htZW50LFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgfCBudWxsID0+IHtcbiAgY29uc3QgbGlua1ByZXZpZXcgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2xpbmtQcmV2aWV3T2Zmc2V0VG9wLCBzZXRMaW5rUHJldmlld09mZnNldFRvcF0gPSB1c2VTdGF0ZTxcbiAgICBudW1iZXIgfCB1bmRlZmluZWRcbiAgPigpO1xuXG4gIGNvbnN0IHRleHRDb250ZW50ID0gdGV4dEF0dGFjaG1lbnQudGV4dCB8fCAnJztcblxuICBjb25zdCB0ZXh0RWRpdG9yUmVmID0gdXNlUmVmPEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSB0ZXh0RWRpdG9yUmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5mb2N1cygpO1xuICAgIG5vZGUuc2V0U2VsZWN0aW9uUmFuZ2Uobm9kZS52YWx1ZS5sZW5ndGgsIG5vZGUudmFsdWUubGVuZ3RoKTtcbiAgfSwgW2lzRWRpdGluZ1RleHRdKTtcblxuICByZXR1cm4gKFxuICAgIDxNZWFzdXJlIGJvdW5kcz5cbiAgICAgIHsoeyBjb250ZW50UmVjdCwgbWVhc3VyZVJlZiB9KSA9PiAoXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc3gtYTExeS9uby1zdGF0aWMtZWxlbWVudC1pbnRlcmFjdGlvbnNcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIlRleHRBdHRhY2htZW50XCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAobGlua1ByZXZpZXdPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgc2V0TGlua1ByZXZpZXdPZmZzZXRUb3AodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQ2xpY2s/LigpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25LZXlVcD17ZXYgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LmtleSA9PT0gJ0VzY2FwZScgJiYgbGlua1ByZXZpZXdPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgc2V0TGlua1ByZXZpZXdPZmZzZXRUb3AodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlZj17bWVhc3VyZVJlZn1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlRleHRBdHRhY2htZW50X19zdG9yeVwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBnZXRCYWNrZ3JvdW5kQ29sb3IodGV4dEF0dGFjaG1lbnQpLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZSgkeyhjb250ZW50UmVjdC5ib3VuZHM/LmhlaWdodCB8fCAxKSAvIDEyODB9KWAsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsodGV4dENvbnRlbnQgfHwgb25DaGFuZ2UpICYmIChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlRleHRBdHRhY2htZW50X190ZXh0XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QXR0YWNobWVudC50ZXh0QmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgID8gZ2V0SGV4RnJvbU51bWJlcih0ZXh0QXR0YWNobWVudC50ZXh0QmFja2dyb3VuZENvbG9yKVxuICAgICAgICAgICAgICAgICAgICA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtvbkNoYW5nZSA/IChcbiAgICAgICAgICAgICAgICAgIDxUZXh0YXJlYUF1dG9zaXplXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlRleHRBdHRhY2htZW50X190ZXh0X19jb250YWluZXIgVGV4dEF0dGFjaG1lbnRfX3RleHRfX3RleHRhcmVhXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFpc0VkaXRpbmdUZXh0fVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZXYgPT4gb25DaGFuZ2UoZXYuY3VycmVudFRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpMThuKCdUZXh0QXR0YWNobWVudF9fcGxhY2Vob2xkZXInKX1cbiAgICAgICAgICAgICAgICAgICAgcmVmPXt0ZXh0RWRpdG9yUmVmfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17Z2V0VGV4dFN0eWxlcyhcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QXR0YWNobWVudC50ZXh0Rm9yZWdyb3VuZENvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBdHRhY2htZW50LnRleHRTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICBpMThuXG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZXh0Q29udGVudH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiVGV4dEF0dGFjaG1lbnRfX3RleHRfX2NvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtnZXRUZXh0U3R5bGVzKFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBdHRhY2htZW50LnRleHRGb3JlZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEF0dGFjaG1lbnQudGV4dFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgIGkxOG5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPEVtb2ppZnlcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXt0ZXh0Q29udGVudH1cbiAgICAgICAgICAgICAgICAgICAgICByZW5kZXJOb25FbW9qaT17cmVuZGVyTmV3TGluZXN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dGV4dEF0dGFjaG1lbnQucHJldmlldyAmJiB0ZXh0QXR0YWNobWVudC5wcmV2aWV3LnVybCAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAge2xpbmtQcmV2aWV3T2Zmc2V0VG9wICYmICFpc1RodW1ibmFpbCAmJiAoXG4gICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJUZXh0QXR0YWNobWVudF9fcHJldmlld19fdG9vbHRpcFwiXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9e3RleHRBdHRhY2htZW50LnByZXZpZXcudXJsfVxuICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICB0b3A6IGxpbmtQcmV2aWV3T2Zmc2V0VG9wIC0gMTUwLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXY+e2kxOG4oJ1RleHRBdHRhY2htZW50X19wcmV2aWV3X19saW5rJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJUZXh0QXR0YWNobWVudF9fcHJldmlld19fdG9vbHRpcF9fdXJsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGV4dEF0dGFjaG1lbnQucHJldmlldy51cmx9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlRleHRBdHRhY2htZW50X19wcmV2aWV3X190b29sdGlwX19hcnJvd1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ1RleHRBdHRhY2htZW50X19wcmV2aWV3LWNvbnRhaW5lcicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ1RleHRBdHRhY2htZW50X19wcmV2aWV3LWNvbnRhaW5lci0tbGFyZ2UnOiBCb29sZWFuKFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBdHRhY2htZW50LnByZXZpZXcudGl0bGVcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgcmVmPXtsaW5rUHJldmlld31cbiAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXNhYmxlTGlua1ByZXZpZXdQb3B1cCkge1xuICAgICAgICAgICAgICAgICAgICAgIHNldExpbmtQcmV2aWV3T2Zmc2V0VG9wKGxpbmtQcmV2aWV3Py5jdXJyZW50Py5vZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXNhYmxlTGlua1ByZXZpZXdQb3B1cCkge1xuICAgICAgICAgICAgICAgICAgICAgIHNldExpbmtQcmV2aWV3T2Zmc2V0VG9wKGxpbmtQcmV2aWV3Py5jdXJyZW50Py5vZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtvblJlbW92ZUxpbmtQcmV2aWV3ICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJUZXh0QXR0YWNobWVudF9fcHJldmlld19fcmVtb3ZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignS2V5Ym9hcmQtLXJlbW92ZS1kcmFmdC1saW5rLXByZXZpZXcnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25SZW1vdmVMaW5rUHJldmlld31cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8U3RhZ2VkTGlua1ByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluPXtnZXREb21haW4oU3RyaW5nKHRleHRBdHRhY2htZW50LnByZXZpZXcudXJsKSl9XG4gICAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICAgIGltYWdlPXt0ZXh0QXR0YWNobWVudC5wcmV2aWV3LmltYWdlfVxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNpemU9e3RleHRBdHRhY2htZW50LnByZXZpZXcudGl0bGUgPyAxNDQgOiA3Mn1cbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiVGV4dEF0dGFjaG1lbnRfX3ByZXZpZXdcIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGV4dEF0dGFjaG1lbnQucHJldmlldy50aXRsZSB8fCB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgIHVybD17dGV4dEF0dGFjaG1lbnQucHJldmlldy51cmx9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L01lYXN1cmU+XG4gICk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLDJCQUFvQjtBQUNwQixtQkFBbUQ7QUFDbkQscUNBQTZCO0FBQzdCLHdCQUF1QjtBQUl2Qix5QkFBNEI7QUFDNUIscUJBQXdCO0FBQ3hCLCtCQUFrQztBQUNsQyx3QkFBd0M7QUFDeEMsc0JBQXNCO0FBQ3RCLHlCQUEwQjtBQUMxQixxQ0FBd0M7QUFDeEMsZ0NBSU87QUFFUCxNQUFNLGlCQUF5Qyx3QkFBQztBQUFBLEVBQzlDLE1BQU07QUFBQSxFQUNOO0FBQUEsTUFDSTtBQUNKLFNBQU8sbURBQUM7QUFBQSxJQUFZO0FBQUEsSUFBVSxNQUFNO0FBQUEsR0FBa0I7QUFDeEQsR0FMK0M7QUFPL0MsTUFBTSx3QkFBd0I7QUFDOUIsTUFBTSx5QkFBeUI7QUFDL0IsTUFBTSxrQkFBa0I7QUFDeEIsTUFBTSxtQkFBbUI7QUFDekIsTUFBTSxrQkFBa0I7QUFFeEIsSUFBSyxXQUFMLGtCQUFLLGNBQUw7QUFDRTtBQUNBO0FBQ0E7QUFIRztBQUFBO0FBaUJMLHFCQUFxQixNQUF3QjtBQUMzQyxRQUFNLFNBQVMsMkJBQU0sSUFBSTtBQUV6QixNQUFJLFNBQVMsdUJBQXVCO0FBQ2xDLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBSSxTQUFTLHdCQUF3QjtBQUNuQyxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFDVDtBQVpTLEFBY1QsaUJBQ0UsTUFDQSxVQUNBLFdBQ0EsTUFDUTtBQUNSLFFBQU0saUJBQWlCLE9BQU8sU0FBUyxLQUFLO0FBQzVDLFFBQU0sV0FBVyw0REFBd0IsTUFBTSxnQkFBZ0IsSUFBSTtBQUVuRSxNQUFJLFdBQVc7QUFDZixVQUFRO0FBQUEsU0FDRDtBQUNILGlCQUFXO0FBQ1g7QUFBQSxTQUNHO0FBQ0gsaUJBQVc7QUFDWDtBQUFBO0FBRUEs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
