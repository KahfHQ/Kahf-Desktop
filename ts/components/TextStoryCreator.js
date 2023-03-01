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
var TextStoryCreator_exports = {};
__export(TextStoryCreator_exports, {
  TextStoryCreator: () => TextStoryCreator
});
module.exports = __toCommonJS(TextStoryCreator_exports);
var import_focus_trap_react = __toESM(require("focus-trap-react"));
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var import_react_popper = require("react-popper");
var import_Button = require("./Button");
var import_ContextMenu = require("./ContextMenu");
var import_LinkPreview = require("../types/LinkPreview");
var import_Input = require("./Input");
var import_Slider = require("./Slider");
var import_StagedLinkPreview = require("./conversation/StagedLinkPreview");
var import_TextAttachment = require("./TextAttachment");
var import_theme = require("../util/theme");
var import_color = require("../mediaEditor/util/color");
var import_getStoryBackground = require("../util/getStoryBackground");
var import_objectMap = require("../util/objectMap");
var TextStyle = /* @__PURE__ */ ((TextStyle2) => {
  TextStyle2[TextStyle2["Default"] = 0] = "Default";
  TextStyle2[TextStyle2["Regular"] = 1] = "Regular";
  TextStyle2[TextStyle2["Bold"] = 2] = "Bold";
  TextStyle2[TextStyle2["Serif"] = 3] = "Serif";
  TextStyle2[TextStyle2["Script"] = 4] = "Script";
  TextStyle2[TextStyle2["Condensed"] = 5] = "Condensed";
  return TextStyle2;
})(TextStyle || {});
var TextBackground = /* @__PURE__ */ ((TextBackground2) => {
  TextBackground2[TextBackground2["None"] = 0] = "None";
  TextBackground2[TextBackground2["Background"] = 1] = "Background";
  TextBackground2[TextBackground2["Inverse"] = 2] = "Inverse";
  return TextBackground2;
})(TextBackground || {});
const BackgroundStyle = {
  BG1099: { angle: 191, endColor: 4282529679, startColor: 4294260804 },
  BG1098: { startColor: 4293938406, endColor: 4279119837, angle: 192 },
  BG1031: { startColor: 4294950980, endColor: 4294859832, angle: 175 },
  BG1101: { startColor: 4278227945, endColor: 4286632135, angle: 180 },
  BG1100: { startColor: 4284861868, endColor: 4278884698, angle: 180 },
  BG1070: { color: 4294951251 },
  BG1080: { color: 4291607859 },
  BG1079: { color: 4286869806 },
  BG1083: { color: 4278825851 },
  BG1095: { color: 4287335417 },
  BG1088: { color: 4283519478 },
  BG1077: { color: 4294405742 },
  BG1094: { color: 4291315265 },
  BG1097: { color: 4291216549 },
  BG1074: { color: 4288976277 },
  BG1092: { color: 4280887593 }
};
function getBackground(bgStyle) {
  if ((0, import_lodash.has)(bgStyle, "color")) {
    return { color: (0, import_lodash.get)(bgStyle, "color") };
  }
  const angle = (0, import_lodash.get)(bgStyle, "angle");
  const startColor = (0, import_lodash.get)(bgStyle, "startColor");
  const endColor = (0, import_lodash.get)(bgStyle, "endColor");
  return {
    gradient: { angle, startColor, endColor }
  };
}
function getBgButtonAriaLabel(i18n, textBackground) {
  if (textBackground === 1 /* Background */) {
    return i18n("StoryCreator__text-bg--background");
  }
  if (textBackground === 2 /* Inverse */) {
    return i18n("StoryCreator__text-bg--inverse");
  }
  return i18n("StoryCreator__text-bg--none");
}
const TextStoryCreator = /* @__PURE__ */ __name(({
  debouncedMaybeGrabLinkPreview,
  i18n,
  linkPreview,
  onClose,
  onDone
}) => {
  const [isEditingText, setIsEditingText] = (0, import_react.useState)(false);
  const [selectedBackground, setSelectedBackground] = (0, import_react.useState)(BackgroundStyle.BG1099);
  const [textStyle, setTextStyle] = (0, import_react.useState)(1 /* Regular */);
  const [textBackground, setTextBackground] = (0, import_react.useState)(0 /* None */);
  const [sliderValue, setSliderValue] = (0, import_react.useState)(100);
  const [text, setText] = (0, import_react.useState)("");
  const textEditorRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (isEditingText) {
      textEditorRef.current?.focus();
    } else {
      textEditorRef.current?.blur();
    }
  }, [isEditingText]);
  const [isColorPickerShowing, setIsColorPickerShowing] = (0, import_react.useState)(false);
  const [colorPickerPopperButtonRef, setColorPickerPopperButtonRef] = (0, import_react.useState)(null);
  const [colorPickerPopperRef, setColorPickerPopperRef] = (0, import_react.useState)(null);
  const colorPickerPopper = (0, import_react_popper.usePopper)(colorPickerPopperButtonRef, colorPickerPopperRef, {
    modifiers: [
      {
        name: "arrow"
      }
    ],
    placement: "top",
    strategy: "fixed"
  });
  const [hasLinkPreviewApplied, setHasLinkPreviewApplied] = (0, import_react.useState)(false);
  const [linkPreviewInputValue, setLinkPreviewInputValue] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    if (!linkPreviewInputValue) {
      return;
    }
    debouncedMaybeGrabLinkPreview(linkPreviewInputValue, import_LinkPreview.LinkPreviewSourceType.StoryCreator);
  }, [debouncedMaybeGrabLinkPreview, linkPreviewInputValue]);
  (0, import_react.useEffect)(() => {
    if (!text) {
      return;
    }
    debouncedMaybeGrabLinkPreview(text, import_LinkPreview.LinkPreviewSourceType.StoryCreator);
  }, [debouncedMaybeGrabLinkPreview, text]);
  (0, import_react.useEffect)(() => {
    if (!linkPreview || !text) {
      return;
    }
    const links = (0, import_LinkPreview.findLinks)(text);
    const shouldApplyLinkPreview = links.includes(linkPreview.url);
    setHasLinkPreviewApplied(shouldApplyLinkPreview);
  }, [linkPreview, text]);
  const [isLinkPreviewInputShowing, setIsLinkPreviewInputShowing] = (0, import_react.useState)(false);
  const [linkPreviewInputPopperButtonRef, setLinkPreviewInputPopperButtonRef] = (0, import_react.useState)(null);
  const [linkPreviewInputPopperRef, setLinkPreviewInputPopperRef] = (0, import_react.useState)(null);
  const linkPreviewInputPopper = (0, import_react_popper.usePopper)(linkPreviewInputPopperButtonRef, linkPreviewInputPopperRef, {
    modifiers: [
      {
        name: "arrow"
      }
    ],
    placement: "top",
    strategy: "fixed"
  });
  (0, import_react.useEffect)(() => {
    const handleOutsideClick = /* @__PURE__ */ __name((event) => {
      if (!colorPickerPopperButtonRef?.contains(event.target)) {
        setIsColorPickerShowing(false);
        event.stopPropagation();
        event.preventDefault();
      }
    }, "handleOutsideClick");
    const handleEscape = /* @__PURE__ */ __name((event) => {
      if (event.key === "Escape") {
        setIsColorPickerShowing(false);
        event.preventDefault();
        event.stopPropagation();
      }
    }, "handleEscape");
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isColorPickerShowing, colorPickerPopperButtonRef]);
  const sliderColorNumber = (0, import_color.getRGBANumber)(sliderValue);
  let textForegroundColor = sliderColorNumber;
  let textBackgroundColor;
  if (textBackground === 1 /* Background */) {
    textBackgroundColor = import_getStoryBackground.COLOR_WHITE_INT;
    textForegroundColor = sliderValue >= 95 ? import_getStoryBackground.COLOR_BLACK_INT : sliderColorNumber;
  } else if (textBackground === 2 /* Inverse */) {
    textBackgroundColor = sliderValue >= 95 ? import_getStoryBackground.COLOR_BLACK_INT : sliderColorNumber;
    textForegroundColor = import_getStoryBackground.COLOR_WHITE_INT;
  }
  const textAttachment = {
    ...getBackground(selectedBackground),
    text,
    textStyle,
    textForegroundColor,
    textBackgroundColor,
    preview: hasLinkPreviewApplied ? linkPreview : void 0
  };
  const hasChanges = Boolean(text || hasLinkPreviewApplied);
  return /* @__PURE__ */ import_react.default.createElement(import_focus_trap_react.default, {
    focusTrapOptions: { allowOutsideClick: true }
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__container"
  }, /* @__PURE__ */ import_react.default.createElement(import_TextAttachment.TextAttachment, {
    disableLinkPreviewPopup: true,
    i18n,
    isEditingText,
    onChange: setText,
    onClick: () => {
      if (!isEditingText) {
        setIsEditingText(true);
      }
    },
    onRemoveLinkPreview: () => {
      setHasLinkPreviewApplied(false);
    },
    textAttachment
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__toolbar"
  }, isEditingText ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__tools"
  }, /* @__PURE__ */ import_react.default.createElement(import_Slider.Slider, {
    handleStyle: { backgroundColor: (0, import_color.getRGBA)(sliderValue) },
    label: (0, import_color.getRGBA)(sliderValue),
    moduleClassName: "HueSlider StoryCreator__tools__tool",
    onChange: setSliderValue,
    value: sliderValue
  }), /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
    i18n,
    menuOptions: [
      {
        icon: "StoryCreator__icon--font-regular",
        label: i18n("StoryCreator__text--regular"),
        onClick: () => setTextStyle(1 /* Regular */),
        value: 1 /* Regular */
      },
      {
        icon: "StoryCreator__icon--font-bold",
        label: i18n("StoryCreator__text--bold"),
        onClick: () => setTextStyle(2 /* Bold */),
        value: 2 /* Bold */
      },
      {
        icon: "StoryCreator__icon--font-serif",
        label: i18n("StoryCreator__text--serif"),
        onClick: () => setTextStyle(3 /* Serif */),
        value: 3 /* Serif */
      },
      {
        icon: "StoryCreator__icon--font-script",
        label: i18n("StoryCreator__text--script"),
        onClick: () => setTextStyle(4 /* Script */),
        value: 4 /* Script */
      },
      {
        icon: "StoryCreator__icon--font-condensed",
        label: i18n("StoryCreator__text--condensed"),
        onClick: () => setTextStyle(5 /* Condensed */),
        value: 5 /* Condensed */
      }
    ],
    moduleClassName: (0, import_classnames.default)("StoryCreator__tools__tool", {
      "StoryCreator__tools__button--font-regular": textStyle === 1 /* Regular */,
      "StoryCreator__tools__button--font-bold": textStyle === 2 /* Bold */,
      "StoryCreator__tools__button--font-serif": textStyle === 3 /* Serif */,
      "StoryCreator__tools__button--font-script": textStyle === 4 /* Script */,
      "StoryCreator__tools__button--font-condensed": textStyle === 5 /* Condensed */
    }),
    theme: import_theme.Theme.Dark,
    value: textStyle
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": getBgButtonAriaLabel(i18n, textBackground),
    className: (0, import_classnames.default)("StoryCreator__tools__tool", {
      "StoryCreator__tools__button--bg-none": textBackground === 0 /* None */,
      "StoryCreator__tools__button--bg": textBackground === 1 /* Background */,
      "StoryCreator__tools__button--bg-inverse": textBackground === 2 /* Inverse */
    }),
    onClick: () => {
      if (textBackground === 0 /* None */) {
        setTextBackground(1 /* Background */);
      } else if (textBackground === 1 /* Background */) {
        setTextBackground(2 /* Inverse */);
      } else {
        setTextBackground(0 /* None */);
      }
    },
    type: "button"
  })) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__toolbar--space"
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__toolbar--buttons"
  }, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    onClick: onClose,
    theme: import_theme.Theme.Dark,
    variant: import_Button.ButtonVariant.Secondary
  }, i18n("discard")), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__controls"
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("StoryCreator__story-bg"),
    className: (0, import_classnames.default)({
      StoryCreator__control: true,
      "StoryCreator__control--bg": true,
      "StoryCreator__control--bg--selected": isColorPickerShowing
    }),
    onClick: () => setIsColorPickerShowing(!isColorPickerShowing),
    ref: setColorPickerPopperButtonRef,
    style: {
      background: (0, import_getStoryBackground.getBackgroundColor)(getBackground(selectedBackground))
    },
    type: "button"
  }), isColorPickerShowing && /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__popper",
    ref: setColorPickerPopperRef,
    style: colorPickerPopper.styles.popper,
    ...colorPickerPopper.attributes.popper
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    "data-popper-arrow": true,
    className: "StoryCreator__popper__arrow"
  }), (0, import_objectMap.objectMap)(BackgroundStyle, (bg, backgroundValue) => /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("StoryCreator__story-bg"),
    className: (0, import_classnames.default)({
      StoryCreator__bg: true,
      "StoryCreator__bg--selected": selectedBackground === backgroundValue
    }),
    key: String(bg),
    onClick: () => {
      setSelectedBackground(backgroundValue);
      setIsColorPickerShowing(false);
    },
    type: "button",
    style: {
      background: (0, import_getStoryBackground.getBackgroundColor)(getBackground(backgroundValue))
    }
  }))), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("StoryCreator__control--text"),
    className: (0, import_classnames.default)({
      StoryCreator__control: true,
      "StoryCreator__control--text": true,
      "StoryCreator__control--selected": isEditingText
    }),
    onClick: () => {
      setIsEditingText(!isEditingText);
    },
    type: "button"
  }), /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("StoryCreator__control--link"),
    className: "StoryCreator__control StoryCreator__control--link",
    onClick: () => setIsLinkPreviewInputShowing(!isLinkPreviewInputShowing),
    ref: setLinkPreviewInputPopperButtonRef,
    type: "button"
  }), isLinkPreviewInputShowing && /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)("StoryCreator__popper StoryCreator__link-preview-input-popper", (0, import_theme.themeClassName)(import_theme.Theme.Dark)),
    ref: setLinkPreviewInputPopperRef,
    style: linkPreviewInputPopper.styles.popper,
    ...linkPreviewInputPopper.attributes.popper
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    "data-popper-arrow": true,
    className: "StoryCreator__popper__arrow"
  }), /* @__PURE__ */ import_react.default.createElement(import_Input.Input, {
    disableSpellcheck: true,
    i18n,
    moduleClassName: "StoryCreator__link-preview-input",
    onChange: setLinkPreviewInputValue,
    placeholder: i18n("StoryCreator__link-preview-placeholder"),
    ref: (el) => el?.focus(),
    value: linkPreviewInputValue
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__link-preview-container"
  }, linkPreview ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_StagedLinkPreview.StagedLinkPreview, {
    domain: linkPreview.domain,
    i18n,
    image: linkPreview.image,
    moduleClassName: "StoryCreator__link-preview",
    title: linkPreview.title,
    url: linkPreview.url
  }), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    className: "StoryCreator__link-preview-button",
    onClick: () => {
      setHasLinkPreviewApplied(true);
      setIsLinkPreviewInputShowing(false);
    },
    theme: import_theme.Theme.Dark,
    variant: import_Button.ButtonVariant.Primary
  }, i18n("StoryCreator__add-link"))) : /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__link-preview-empty"
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "StoryCreator__link-preview-empty__icon"
  }), i18n("StoryCreator__link-preview-empty"))))), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
    disabled: !hasChanges,
    onClick: () => onDone(textAttachment),
    theme: import_theme.Theme.Dark,
    variant: import_Button.ButtonVariant.Primary
  }, i18n("StoryCreator__next"))))));
}, "TextStoryCreator");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextStoryCreator
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVGV4dFN0b3J5Q3JlYXRvci50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IEZvY3VzVHJhcCBmcm9tICdmb2N1cy10cmFwLXJlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IGdldCwgaGFzIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHVzZVBvcHBlciB9IGZyb20gJ3JlYWN0LXBvcHBlcic7XG5cbmltcG9ydCB0eXBlIHsgTGlua1ByZXZpZXdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvbWVzc2FnZS9MaW5rUHJldmlld3MnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IFRleHRBdHRhY2htZW50VHlwZSB9IGZyb20gJy4uL3R5cGVzL0F0dGFjaG1lbnQnO1xuXG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblZhcmlhbnQgfSBmcm9tICcuL0J1dHRvbic7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gJy4vQ29udGV4dE1lbnUnO1xuaW1wb3J0IHsgTGlua1ByZXZpZXdTb3VyY2VUeXBlLCBmaW5kTGlua3MgfSBmcm9tICcuLi90eXBlcy9MaW5rUHJldmlldyc7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4vSW5wdXQnO1xuaW1wb3J0IHsgU2xpZGVyIH0gZnJvbSAnLi9TbGlkZXInO1xuaW1wb3J0IHsgU3RhZ2VkTGlua1ByZXZpZXcgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9TdGFnZWRMaW5rUHJldmlldyc7XG5pbXBvcnQgeyBUZXh0QXR0YWNobWVudCB9IGZyb20gJy4vVGV4dEF0dGFjaG1lbnQnO1xuaW1wb3J0IHsgVGhlbWUsIHRoZW1lQ2xhc3NOYW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5pbXBvcnQgeyBnZXRSR0JBLCBnZXRSR0JBTnVtYmVyIH0gZnJvbSAnLi4vbWVkaWFFZGl0b3IvdXRpbC9jb2xvcic7XG5pbXBvcnQge1xuICBDT0xPUl9CTEFDS19JTlQsXG4gIENPTE9SX1dISVRFX0lOVCxcbiAgZ2V0QmFja2dyb3VuZENvbG9yLFxufSBmcm9tICcuLi91dGlsL2dldFN0b3J5QmFja2dyb3VuZCc7XG5pbXBvcnQgeyBvYmplY3RNYXAgfSBmcm9tICcuLi91dGlsL29iamVjdE1hcCc7XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IHtcbiAgZGVib3VuY2VkTWF5YmVHcmFiTGlua1ByZXZpZXc6IChcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgc291cmNlOiBMaW5rUHJldmlld1NvdXJjZVR5cGVcbiAgKSA9PiB1bmtub3duO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBsaW5rUHJldmlldz86IExpbmtQcmV2aWV3VHlwZTtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbiAgb25Eb25lOiAodGV4dEF0dGFjaG1lbnQ6IFRleHRBdHRhY2htZW50VHlwZSkgPT4gdW5rbm93bjtcbn07XG5cbmVudW0gVGV4dFN0eWxlIHtcbiAgRGVmYXVsdCxcbiAgUmVndWxhcixcbiAgQm9sZCxcbiAgU2VyaWYsXG4gIFNjcmlwdCxcbiAgQ29uZGVuc2VkLFxufVxuXG5lbnVtIFRleHRCYWNrZ3JvdW5kIHtcbiAgTm9uZSxcbiAgQmFja2dyb3VuZCxcbiAgSW52ZXJzZSxcbn1cblxuY29uc3QgQmFja2dyb3VuZFN0eWxlID0ge1xuICBCRzEwOTk6IHsgYW5nbGU6IDE5MSwgZW5kQ29sb3I6IDQyODI1Mjk2NzksIHN0YXJ0Q29sb3I6IDQyOTQyNjA4MDQgfSxcbiAgQkcxMDk4OiB7IHN0YXJ0Q29sb3I6IDQyOTM5Mzg0MDYsIGVuZENvbG9yOiA0Mjc5MTE5ODM3LCBhbmdsZTogMTkyIH0sXG4gIEJHMTAzMTogeyBzdGFydENvbG9yOiA0Mjk0OTUwOTgwLCBlbmRDb2xvcjogNDI5NDg1OTgzMiwgYW5nbGU6IDE3NSB9LFxuICBCRzExMDE6IHsgc3RhcnRDb2xvcjogNDI3ODIyNzk0NSwgZW5kQ29sb3I6IDQyODY2MzIxMzUsIGFuZ2xlOiAxODAgfSxcbiAgQkcxMTAwOiB7IHN0YXJ0Q29sb3I6IDQyODQ4NjE4NjgsIGVuZENvbG9yOiA0Mjc4ODg0Njk4LCBhbmdsZTogMTgwIH0sXG4gIEJHMTA3MDogeyBjb2xvcjogNDI5NDk1MTI1MSB9LFxuICBCRzEwODA6IHsgY29sb3I6IDQyOTE2MDc4NTkgfSxcbiAgQkcxMDc5OiB7IGNvbG9yOiA0Mjg2ODY5ODA2IH0sXG4gIEJHMTA4MzogeyBjb2xvcjogNDI3ODgyNTg1MSB9LFxuICBCRzEwOTU6IHsgY29sb3I6IDQyODczMzU0MTcgfSxcbiAgQkcxMDg4OiB7IGNvbG9yOiA0MjgzNTE5NDc4IH0sXG4gIEJHMTA3NzogeyBjb2xvcjogNDI5NDQwNTc0MiB9LFxuICBCRzEwOTQ6IHsgY29sb3I6IDQyOTEzMTUyNjUgfSxcbiAgQkcxMDk3OiB7IGNvbG9yOiA0MjkxMjE2NTQ5IH0sXG4gIEJHMTA3NDogeyBjb2xvcjogNDI4ODk3NjI3NyB9LFxuICBCRzEwOTI6IHsgY29sb3I6IDQyODA4ODc1OTMgfSxcbn07XG5cbnR5cGUgQmFja2dyb3VuZFN0eWxlVHlwZSA9IHR5cGVvZiBCYWNrZ3JvdW5kU3R5bGVba2V5b2YgdHlwZW9mIEJhY2tncm91bmRTdHlsZV07XG5cbmZ1bmN0aW9uIGdldEJhY2tncm91bmQoXG4gIGJnU3R5bGU6IEJhY2tncm91bmRTdHlsZVR5cGVcbik6IFBpY2s8VGV4dEF0dGFjaG1lbnRUeXBlLCAnY29sb3InIHwgJ2dyYWRpZW50Jz4ge1xuICBpZiAoaGFzKGJnU3R5bGUsICdjb2xvcicpKSB7XG4gICAgcmV0dXJuIHsgY29sb3I6IGdldChiZ1N0eWxlLCAnY29sb3InKSB9O1xuICB9XG5cbiAgY29uc3QgYW5nbGUgPSBnZXQoYmdTdHlsZSwgJ2FuZ2xlJyk7XG4gIGNvbnN0IHN0YXJ0Q29sb3IgPSBnZXQoYmdTdHlsZSwgJ3N0YXJ0Q29sb3InKTtcbiAgY29uc3QgZW5kQ29sb3IgPSBnZXQoYmdTdHlsZSwgJ2VuZENvbG9yJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBncmFkaWVudDogeyBhbmdsZSwgc3RhcnRDb2xvciwgZW5kQ29sb3IgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0QmdCdXR0b25BcmlhTGFiZWwoXG4gIGkxOG46IExvY2FsaXplclR5cGUsXG4gIHRleHRCYWNrZ3JvdW5kOiBUZXh0QmFja2dyb3VuZFxuKTogc3RyaW5nIHtcbiAgaWYgKHRleHRCYWNrZ3JvdW5kID09PSBUZXh0QmFja2dyb3VuZC5CYWNrZ3JvdW5kKSB7XG4gICAgcmV0dXJuIGkxOG4oJ1N0b3J5Q3JlYXRvcl9fdGV4dC1iZy0tYmFja2dyb3VuZCcpO1xuICB9XG5cbiAgaWYgKHRleHRCYWNrZ3JvdW5kID09PSBUZXh0QmFja2dyb3VuZC5JbnZlcnNlKSB7XG4gICAgcmV0dXJuIGkxOG4oJ1N0b3J5Q3JlYXRvcl9fdGV4dC1iZy0taW52ZXJzZScpO1xuICB9XG5cbiAgcmV0dXJuIGkxOG4oJ1N0b3J5Q3JlYXRvcl9fdGV4dC1iZy0tbm9uZScpO1xufVxuXG5leHBvcnQgY29uc3QgVGV4dFN0b3J5Q3JlYXRvciA9ICh7XG4gIGRlYm91bmNlZE1heWJlR3JhYkxpbmtQcmV2aWV3LFxuICBpMThuLFxuICBsaW5rUHJldmlldyxcbiAgb25DbG9zZSxcbiAgb25Eb25lLFxufTogUHJvcHNUeXBlKTogSlNYLkVsZW1lbnQgPT4ge1xuICBjb25zdCBbaXNFZGl0aW5nVGV4dCwgc2V0SXNFZGl0aW5nVGV4dF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzZWxlY3RlZEJhY2tncm91bmQsIHNldFNlbGVjdGVkQmFja2dyb3VuZF0gPVxuICAgIHVzZVN0YXRlPEJhY2tncm91bmRTdHlsZVR5cGU+KEJhY2tncm91bmRTdHlsZS5CRzEwOTkpO1xuICBjb25zdCBbdGV4dFN0eWxlLCBzZXRUZXh0U3R5bGVdID0gdXNlU3RhdGU8VGV4dFN0eWxlPihUZXh0U3R5bGUuUmVndWxhcik7XG4gIGNvbnN0IFt0ZXh0QmFja2dyb3VuZCwgc2V0VGV4dEJhY2tncm91bmRdID0gdXNlU3RhdGU8VGV4dEJhY2tncm91bmQ+KFxuICAgIFRleHRCYWNrZ3JvdW5kLk5vbmVcbiAgKTtcbiAgY29uc3QgW3NsaWRlclZhbHVlLCBzZXRTbGlkZXJWYWx1ZV0gPSB1c2VTdGF0ZTxudW1iZXI+KDEwMCk7XG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG4gIGNvbnN0IHRleHRFZGl0b3JSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudCB8IG51bGw+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzRWRpdGluZ1RleHQpIHtcbiAgICAgIHRleHRFZGl0b3JSZWYuY3VycmVudD8uZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dEVkaXRvclJlZi5jdXJyZW50Py5ibHVyKCk7XG4gICAgfVxuICB9LCBbaXNFZGl0aW5nVGV4dF0pO1xuXG4gIGNvbnN0IFtpc0NvbG9yUGlja2VyU2hvd2luZywgc2V0SXNDb2xvclBpY2tlclNob3dpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY29sb3JQaWNrZXJQb3BwZXJCdXR0b25SZWYsIHNldENvbG9yUGlja2VyUG9wcGVyQnV0dG9uUmVmXSA9XG4gICAgdXNlU3RhdGU8SFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2NvbG9yUGlja2VyUG9wcGVyUmVmLCBzZXRDb2xvclBpY2tlclBvcHBlclJlZl0gPVxuICAgIHVzZVN0YXRlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3QgY29sb3JQaWNrZXJQb3BwZXIgPSB1c2VQb3BwZXIoXG4gICAgY29sb3JQaWNrZXJQb3BwZXJCdXR0b25SZWYsXG4gICAgY29sb3JQaWNrZXJQb3BwZXJSZWYsXG4gICAge1xuICAgICAgbW9kaWZpZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICBzdHJhdGVneTogJ2ZpeGVkJyxcbiAgICB9XG4gICk7XG5cbiAgY29uc3QgW2hhc0xpbmtQcmV2aWV3QXBwbGllZCwgc2V0SGFzTGlua1ByZXZpZXdBcHBsaWVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2xpbmtQcmV2aWV3SW5wdXRWYWx1ZSwgc2V0TGlua1ByZXZpZXdJbnB1dFZhbHVlXSA9IHVzZVN0YXRlKCcnKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbGlua1ByZXZpZXdJbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRlYm91bmNlZE1heWJlR3JhYkxpbmtQcmV2aWV3KFxuICAgICAgbGlua1ByZXZpZXdJbnB1dFZhbHVlLFxuICAgICAgTGlua1ByZXZpZXdTb3VyY2VUeXBlLlN0b3J5Q3JlYXRvclxuICAgICk7XG4gIH0sIFtkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldywgbGlua1ByZXZpZXdJbnB1dFZhbHVlXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGVib3VuY2VkTWF5YmVHcmFiTGlua1ByZXZpZXcodGV4dCwgTGlua1ByZXZpZXdTb3VyY2VUeXBlLlN0b3J5Q3JlYXRvcik7XG4gIH0sIFtkZWJvdW5jZWRNYXliZUdyYWJMaW5rUHJldmlldywgdGV4dF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFsaW5rUHJldmlldyB8fCAhdGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmtzID0gZmluZExpbmtzKHRleHQpO1xuXG4gICAgY29uc3Qgc2hvdWxkQXBwbHlMaW5rUHJldmlldyA9IGxpbmtzLmluY2x1ZGVzKGxpbmtQcmV2aWV3LnVybCk7XG4gICAgc2V0SGFzTGlua1ByZXZpZXdBcHBsaWVkKHNob3VsZEFwcGx5TGlua1ByZXZpZXcpO1xuICB9LCBbbGlua1ByZXZpZXcsIHRleHRdKTtcblxuICBjb25zdCBbaXNMaW5rUHJldmlld0lucHV0U2hvd2luZywgc2V0SXNMaW5rUHJldmlld0lucHV0U2hvd2luZ10gPVxuICAgIHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2xpbmtQcmV2aWV3SW5wdXRQb3BwZXJCdXR0b25SZWYsIHNldExpbmtQcmV2aWV3SW5wdXRQb3BwZXJCdXR0b25SZWZdID1cbiAgICB1c2VTdGF0ZTxIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbbGlua1ByZXZpZXdJbnB1dFBvcHBlclJlZiwgc2V0TGlua1ByZXZpZXdJbnB1dFBvcHBlclJlZl0gPVxuICAgIHVzZVN0YXRlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3QgbGlua1ByZXZpZXdJbnB1dFBvcHBlciA9IHVzZVBvcHBlcihcbiAgICBsaW5rUHJldmlld0lucHV0UG9wcGVyQnV0dG9uUmVmLFxuICAgIGxpbmtQcmV2aWV3SW5wdXRQb3BwZXJSZWYsXG4gICAge1xuICAgICAgbW9kaWZpZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICBzdHJhdGVneTogJ2ZpeGVkJyxcbiAgICB9XG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVPdXRzaWRlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGlmICghY29sb3JQaWNrZXJQb3BwZXJCdXR0b25SZWY/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBOb2RlKSkge1xuICAgICAgICBzZXRJc0NvbG9yUGlja2VyU2hvd2luZyhmYWxzZSk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgaGFuZGxlRXNjYXBlID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBzZXRJc0NvbG9yUGlja2VyU2hvd2luZyhmYWxzZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZU91dHNpZGVDbGljayk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY2FwZSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY2FwZSk7XG4gICAgfTtcbiAgfSwgW2lzQ29sb3JQaWNrZXJTaG93aW5nLCBjb2xvclBpY2tlclBvcHBlckJ1dHRvblJlZl0pO1xuXG4gIGNvbnN0IHNsaWRlckNvbG9yTnVtYmVyID0gZ2V0UkdCQU51bWJlcihzbGlkZXJWYWx1ZSk7XG5cbiAgbGV0IHRleHRGb3JlZ3JvdW5kQ29sb3IgPSBzbGlkZXJDb2xvck51bWJlcjtcbiAgbGV0IHRleHRCYWNrZ3JvdW5kQ29sb3I6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICBpZiAodGV4dEJhY2tncm91bmQgPT09IFRleHRCYWNrZ3JvdW5kLkJhY2tncm91bmQpIHtcbiAgICB0ZXh0QmFja2dyb3VuZENvbG9yID0gQ09MT1JfV0hJVEVfSU5UO1xuICAgIHRleHRGb3JlZ3JvdW5kQ29sb3IgPVxuICAgICAgc2xpZGVyVmFsdWUgPj0gOTUgPyBDT0xPUl9CTEFDS19JTlQgOiBzbGlkZXJDb2xvck51bWJlcjtcbiAgfSBlbHNlIGlmICh0ZXh0QmFja2dyb3VuZCA9PT0gVGV4dEJhY2tncm91bmQuSW52ZXJzZSkge1xuICAgIHRleHRCYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgc2xpZGVyVmFsdWUgPj0gOTUgPyBDT0xPUl9CTEFDS19JTlQgOiBzbGlkZXJDb2xvck51bWJlcjtcbiAgICB0ZXh0Rm9yZWdyb3VuZENvbG9yID0gQ09MT1JfV0hJVEVfSU5UO1xuICB9XG5cbiAgY29uc3QgdGV4dEF0dGFjaG1lbnQ6IFRleHRBdHRhY2htZW50VHlwZSA9IHtcbiAgICAuLi5nZXRCYWNrZ3JvdW5kKHNlbGVjdGVkQmFja2dyb3VuZCksXG4gICAgdGV4dCxcbiAgICB0ZXh0U3R5bGUsXG4gICAgdGV4dEZvcmVncm91bmRDb2xvcixcbiAgICB0ZXh0QmFja2dyb3VuZENvbG9yLFxuICAgIHByZXZpZXc6IGhhc0xpbmtQcmV2aWV3QXBwbGllZCA/IGxpbmtQcmV2aWV3IDogdW5kZWZpbmVkLFxuICB9O1xuXG4gIGNvbnN0IGhhc0NoYW5nZXMgPSBCb29sZWFuKHRleHQgfHwgaGFzTGlua1ByZXZpZXdBcHBsaWVkKTtcblxuICByZXR1cm4gKFxuICAgIDxGb2N1c1RyYXAgZm9jdXNUcmFwT3B0aW9ucz17eyBhbGxvd091dHNpZGVDbGljazogdHJ1ZSB9fT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yX19jb250YWluZXJcIj5cbiAgICAgICAgICA8VGV4dEF0dGFjaG1lbnRcbiAgICAgICAgICAgIGRpc2FibGVMaW5rUHJldmlld1BvcHVwXG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgaXNFZGl0aW5nVGV4dD17aXNFZGl0aW5nVGV4dH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRUZXh0fVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWlzRWRpdGluZ1RleHQpIHtcbiAgICAgICAgICAgICAgICBzZXRJc0VkaXRpbmdUZXh0KHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25SZW1vdmVMaW5rUHJldmlldz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRIYXNMaW5rUHJldmlld0FwcGxpZWQoZmFsc2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHRleHRBdHRhY2htZW50PXt0ZXh0QXR0YWNobWVudH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX3Rvb2xiYXJcIj5cbiAgICAgICAgICB7aXNFZGl0aW5nVGV4dCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yX190b29sc1wiPlxuICAgICAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICAgICAgaGFuZGxlU3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBnZXRSR0JBKHNsaWRlclZhbHVlKSB9fVxuICAgICAgICAgICAgICAgIGxhYmVsPXtnZXRSR0JBKHNsaWRlclZhbHVlKX1cbiAgICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJIdWVTbGlkZXIgU3RvcnlDcmVhdG9yX190b29sc19fdG9vbFwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNsaWRlclZhbHVlfVxuICAgICAgICAgICAgICAgIHZhbHVlPXtzbGlkZXJWYWx1ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPENvbnRleHRNZW51XG4gICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnU3RvcnlDcmVhdG9yX19pY29uLS1mb250LXJlZ3VsYXInLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogaTE4bignU3RvcnlDcmVhdG9yX190ZXh0LS1yZWd1bGFyJyksXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFRleHRTdHlsZShUZXh0U3R5bGUuUmVndWxhciksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBUZXh0U3R5bGUuUmVndWxhcixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICdTdG9yeUNyZWF0b3JfX2ljb24tLWZvbnQtYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeUNyZWF0b3JfX3RleHQtLWJvbGQnKSxcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0VGV4dFN0eWxlKFRleHRTdHlsZS5Cb2xkKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFRleHRTdHlsZS5Cb2xkLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ1N0b3J5Q3JlYXRvcl9faWNvbi0tZm9udC1zZXJpZicsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeUNyZWF0b3JfX3RleHQtLXNlcmlmJyksXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFRleHRTdHlsZShUZXh0U3R5bGUuU2VyaWYpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogVGV4dFN0eWxlLlNlcmlmLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ1N0b3J5Q3JlYXRvcl9faWNvbi0tZm9udC1zY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogaTE4bignU3RvcnlDcmVhdG9yX190ZXh0LS1zY3JpcHQnKSxcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0VGV4dFN0eWxlKFRleHRTdHlsZS5TY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogVGV4dFN0eWxlLlNjcmlwdCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICdTdG9yeUNyZWF0b3JfX2ljb24tLWZvbnQtY29uZGVuc2VkJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGkxOG4oJ1N0b3J5Q3JlYXRvcl9fdGV4dC0tY29uZGVuc2VkJyksXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFRleHRTdHlsZShUZXh0U3R5bGUuQ29uZGVuc2VkKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFRleHRTdHlsZS5Db25kZW5zZWQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPXtjbGFzc05hbWVzKCdTdG9yeUNyZWF0b3JfX3Rvb2xzX190b29sJywge1xuICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fdG9vbHNfX2J1dHRvbi0tZm9udC1yZWd1bGFyJzpcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlID09PSBUZXh0U3R5bGUuUmVndWxhcixcbiAgICAgICAgICAgICAgICAgICdTdG9yeUNyZWF0b3JfX3Rvb2xzX19idXR0b24tLWZvbnQtYm9sZCc6XG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZSA9PT0gVGV4dFN0eWxlLkJvbGQsXG4gICAgICAgICAgICAgICAgICAnU3RvcnlDcmVhdG9yX190b29sc19fYnV0dG9uLS1mb250LXNlcmlmJzpcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlID09PSBUZXh0U3R5bGUuU2VyaWYsXG4gICAgICAgICAgICAgICAgICAnU3RvcnlDcmVhdG9yX190b29sc19fYnV0dG9uLS1mb250LXNjcmlwdCc6XG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZSA9PT0gVGV4dFN0eWxlLlNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICdTdG9yeUNyZWF0b3JfX3Rvb2xzX19idXR0b24tLWZvbnQtY29uZGVuc2VkJzpcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlID09PSBUZXh0U3R5bGUuQ29uZGVuc2VkLFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHRoZW1lPXtUaGVtZS5EYXJrfVxuICAgICAgICAgICAgICAgIHZhbHVlPXt0ZXh0U3R5bGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtnZXRCZ0J1dHRvbkFyaWFMYWJlbChpMThuLCB0ZXh0QmFja2dyb3VuZCl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdTdG9yeUNyZWF0b3JfX3Rvb2xzX190b29sJywge1xuICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fdG9vbHNfX2J1dHRvbi0tYmctbm9uZSc6XG4gICAgICAgICAgICAgICAgICAgIHRleHRCYWNrZ3JvdW5kID09PSBUZXh0QmFja2dyb3VuZC5Ob25lLFxuICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fdG9vbHNfX2J1dHRvbi0tYmcnOlxuICAgICAgICAgICAgICAgICAgICB0ZXh0QmFja2dyb3VuZCA9PT0gVGV4dEJhY2tncm91bmQuQmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgICAgICdTdG9yeUNyZWF0b3JfX3Rvb2xzX19idXR0b24tLWJnLWludmVyc2UnOlxuICAgICAgICAgICAgICAgICAgICB0ZXh0QmFja2dyb3VuZCA9PT0gVGV4dEJhY2tncm91bmQuSW52ZXJzZSxcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodGV4dEJhY2tncm91bmQgPT09IFRleHRCYWNrZ3JvdW5kLk5vbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGV4dEJhY2tncm91bmQoVGV4dEJhY2tncm91bmQuQmFja2dyb3VuZCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCYWNrZ3JvdW5kID09PSBUZXh0QmFja2dyb3VuZC5CYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRleHRCYWNrZ3JvdW5kKFRleHRCYWNrZ3JvdW5kLkludmVyc2UpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGV4dEJhY2tncm91bmQoVGV4dEJhY2tncm91bmQuTm9uZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Q3JlYXRvcl9fdG9vbGJhci0tc3BhY2VcIiAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX3Rvb2xiYXItLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgICAgICAgIHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU2Vjb25kYXJ5fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aTE4bignZGlzY2FyZCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Q3JlYXRvcl9fY29udHJvbHNcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3J5Q3JlYXRvcl9fc3RvcnktYmcnKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoe1xuICAgICAgICAgICAgICAgICAgU3RvcnlDcmVhdG9yX19jb250cm9sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fY29udHJvbC0tYmcnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fY29udHJvbC0tYmctLXNlbGVjdGVkJzogaXNDb2xvclBpY2tlclNob3dpbmcsXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNDb2xvclBpY2tlclNob3dpbmcoIWlzQ29sb3JQaWNrZXJTaG93aW5nKX1cbiAgICAgICAgICAgICAgICByZWY9e3NldENvbG9yUGlja2VyUG9wcGVyQnV0dG9uUmVmfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBnZXRCYWNrZ3JvdW5kQ29sb3IoXG4gICAgICAgICAgICAgICAgICAgIGdldEJhY2tncm91bmQoc2VsZWN0ZWRCYWNrZ3JvdW5kKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICB7aXNDb2xvclBpY2tlclNob3dpbmcgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5Q3JlYXRvcl9fcG9wcGVyXCJcbiAgICAgICAgICAgICAgICAgIHJlZj17c2V0Q29sb3JQaWNrZXJQb3BwZXJSZWZ9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17Y29sb3JQaWNrZXJQb3BwZXIuc3R5bGVzLnBvcHBlcn1cbiAgICAgICAgICAgICAgICAgIHsuLi5jb2xvclBpY2tlclBvcHBlci5hdHRyaWJ1dGVzLnBvcHBlcn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtcG9wcGVyLWFycm93XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5Q3JlYXRvcl9fcG9wcGVyX19hcnJvd1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAge29iamVjdE1hcDxCYWNrZ3JvdW5kU3R5bGVUeXBlPihcbiAgICAgICAgICAgICAgICAgICAgQmFja2dyb3VuZFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAoYmcsIGJhY2tncm91bmRWYWx1ZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3J5Q3JlYXRvcl9fc3RvcnktYmcnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFN0b3J5Q3JlYXRvcl9fYmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdTdG9yeUNyZWF0b3JfX2JnLS1zZWxlY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRCYWNrZ3JvdW5kID09PSBiYWNrZ3JvdW5kVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17U3RyaW5nKGJnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRCYWNrZ3JvdW5kKGJhY2tncm91bmRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzQ29sb3JQaWNrZXJTaG93aW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGdldEJhY2tncm91bmRDb2xvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRCYWNrZ3JvdW5kKGJhY2tncm91bmRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ1N0b3J5Q3JlYXRvcl9fY29udHJvbC0tdGV4dCcpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICAgICAgICBTdG9yeUNyZWF0b3JfX2NvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAnU3RvcnlDcmVhdG9yX19jb250cm9sLS10ZXh0JzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICdTdG9yeUNyZWF0b3JfX2NvbnRyb2wtLXNlbGVjdGVkJzogaXNFZGl0aW5nVGV4dCxcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRJc0VkaXRpbmdUZXh0KCFpc0VkaXRpbmdUZXh0KTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignU3RvcnlDcmVhdG9yX19jb250cm9sLS1saW5rJyl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yX19jb250cm9sIFN0b3J5Q3JlYXRvcl9fY29udHJvbC0tbGlua1wiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgIHNldElzTGlua1ByZXZpZXdJbnB1dFNob3dpbmcoIWlzTGlua1ByZXZpZXdJbnB1dFNob3dpbmcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlZj17c2V0TGlua1ByZXZpZXdJbnB1dFBvcHBlckJ1dHRvblJlZn1cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAge2lzTGlua1ByZXZpZXdJbnB1dFNob3dpbmcgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgJ1N0b3J5Q3JlYXRvcl9fcG9wcGVyIFN0b3J5Q3JlYXRvcl9fbGluay1wcmV2aWV3LWlucHV0LXBvcHBlcicsXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lQ2xhc3NOYW1lKFRoZW1lLkRhcmspXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgcmVmPXtzZXRMaW5rUHJldmlld0lucHV0UG9wcGVyUmVmfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2xpbmtQcmV2aWV3SW5wdXRQb3BwZXIuc3R5bGVzLnBvcHBlcn1cbiAgICAgICAgICAgICAgICAgIHsuLi5saW5rUHJldmlld0lucHV0UG9wcGVyLmF0dHJpYnV0ZXMucG9wcGVyfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1wb3BwZXItYXJyb3dcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yX19wb3BwZXJfX2Fycm93XCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVNwZWxsY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlDcmVhdG9yX19saW5rLXByZXZpZXctaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0TGlua1ByZXZpZXdJbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17aTE4bignU3RvcnlDcmVhdG9yX19saW5rLXByZXZpZXctcGxhY2Vob2xkZXInKX1cbiAgICAgICAgICAgICAgICAgICAgcmVmPXtlbCA9PiBlbD8uZm9jdXMoKX1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xpbmtQcmV2aWV3SW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5Q3JlYXRvcl9fbGluay1wcmV2aWV3LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICB7bGlua1ByZXZpZXcgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxTdGFnZWRMaW5rUHJldmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkb21haW49e2xpbmtQcmV2aWV3LmRvbWFpbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U9e2xpbmtQcmV2aWV3LmltYWdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX2xpbmstcHJldmlld1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtsaW5rUHJldmlldy50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsPXtsaW5rUHJldmlldy51cmx9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX2xpbmstcHJldmlldy1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGFzTGlua1ByZXZpZXdBcHBsaWVkKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzTGlua1ByZXZpZXdJbnB1dFNob3dpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD17QnV0dG9uVmFyaWFudC5QcmltYXJ5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aTE4bignU3RvcnlDcmVhdG9yX19hZGQtbGluaycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX2xpbmstcHJldmlldy1lbXB0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeUNyZWF0b3JfX2xpbmstcHJldmlldy1lbXB0eV9faWNvblwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aTE4bignU3RvcnlDcmVhdG9yX19saW5rLXByZXZpZXctZW1wdHknKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGRpc2FibGVkPXshaGFzQ2hhbmdlc31cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25Eb25lKHRleHRBdHRhY2htZW50KX1cbiAgICAgICAgICAgICAgdGhlbWU9e1RoZW1lLkRhcmt9XG4gICAgICAgICAgICAgIHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuUHJpbWFyeX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2kxOG4oJ1N0b3J5Q3JlYXRvcl9fbmV4dCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9Gb2N1c1RyYXA+XG4gICk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLDhCQUFzQjtBQUN0QixtQkFBbUQ7QUFDbkQsd0JBQXVCO0FBQ3ZCLG9CQUF5QjtB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
