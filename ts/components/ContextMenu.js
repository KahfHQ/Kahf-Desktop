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
var ContextMenu_exports = {};
__export(ContextMenu_exports, {
  ContextMenu: () => ContextMenu
});
module.exports = __toCommonJS(ContextMenu_exports);
var import_focus_trap_react = __toESM(require("focus-trap-react"));
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_react_popper = require("react-popper");
var import_lodash = require("lodash");
var import_getClassNamesFor = require("../util/getClassNamesFor");
var import_theme = require("../util/theme");
function ContextMenu({
  children,
  i18n,
  menuOptions,
  moduleClassName,
  onClick,
  onMenuShowingChanged,
  popperOptions,
  theme,
  title,
  value
}) {
  const [isMenuShowing, setIsMenuShowing] = (0, import_react.useState)(false);
  const [focusedIndex, setFocusedIndex] = (0, import_react.useState)(void 0);
  const [popperElement, setPopperElement] = (0, import_react.useState)(null);
  const [referenceElement, setReferenceElement] = (0, import_react.useState)(null);
  const { styles, attributes } = (0, import_react_popper.usePopper)(referenceElement, popperElement, {
    placement: "top-start",
    strategy: "fixed",
    ...popperOptions
  });
  (0, import_react.useEffect)(() => {
    if (onMenuShowingChanged) {
      onMenuShowingChanged(isMenuShowing);
    }
  }, [isMenuShowing, onMenuShowingChanged]);
  (0, import_react.useEffect)(() => {
    if (!isMenuShowing) {
      return import_lodash.noop;
    }
    const handleOutsideClick = /* @__PURE__ */ __name((event) => {
      if (!referenceElement?.contains(event.target)) {
        setIsMenuShowing(false);
        event.stopPropagation();
        event.preventDefault();
      }
    }, "handleOutsideClick");
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuShowing, referenceElement]);
  const handleKeyDown = /* @__PURE__ */ __name((ev) => {
    if (!isMenuShowing) {
      if (ev.key === "Enter") {
        setFocusedIndex(0);
      }
      return;
    }
    if (ev.key === "ArrowDown") {
      const currFocusedIndex = focusedIndex || 0;
      const nextFocusedIndex = currFocusedIndex >= menuOptions.length - 1 ? 0 : currFocusedIndex + 1;
      setFocusedIndex(nextFocusedIndex);
      ev.stopPropagation();
      ev.preventDefault();
    }
    if (ev.key === "ArrowUp") {
      const currFocusedIndex = focusedIndex || 0;
      const nextFocusedIndex = currFocusedIndex === 0 ? menuOptions.length - 1 : currFocusedIndex - 1;
      setFocusedIndex(nextFocusedIndex);
      ev.stopPropagation();
      ev.preventDefault();
    }
    if (ev.key === "Enter") {
      if (focusedIndex !== void 0) {
        const focusedOption = menuOptions[focusedIndex];
        focusedOption.onClick(focusedOption.value);
      }
      setIsMenuShowing(false);
      ev.stopPropagation();
      ev.preventDefault();
    }
  }, "handleKeyDown");
  const handleClick = /* @__PURE__ */ __name((ev) => {
    setIsMenuShowing(true);
    ev.stopPropagation();
    ev.preventDefault();
  }, "handleClick");
  const getClassName = (0, import_getClassNamesFor.getClassNamesFor)("ContextMenu", moduleClassName);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName("__container"), theme ? (0, import_theme.themeClassName)(theme) : void 0)
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("ContextMenu--button"),
    className: (0, import_classnames.default)(getClassName("__button"), isMenuShowing ? getClassName("__button--active") : void 0),
    onClick: onClick || handleClick,
    onContextMenu: handleClick,
    onKeyDown: handleKeyDown,
    ref: setReferenceElement,
    type: "button"
  }, children), isMenuShowing && /* @__PURE__ */ import_react.default.createElement(import_focus_trap_react.default, {
    focusTrapOptions: {
      allowOutsideClick: true
    }
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: theme ? (0, import_theme.themeClassName)(theme) : void 0
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName("__popper"), menuOptions.length === 1 ? getClassName("__popper--single-item") : void 0),
    ref: setPopperElement,
    style: styles.popper,
    ...attributes.popper
  }, title && /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__title")
  }, title), menuOptions.map((option, index) => /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": option.label,
    className: (0, import_classnames.default)(getClassName("__option"), focusedIndex === index ? getClassName("__option--focused") : void 0),
    key: option.label,
    type: "button",
    onClick: () => {
      option.onClick(option.value);
      setIsMenuShowing(false);
    }
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__option--container")
  }, option.icon && /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName("__option--icon"), option.icon)
  }), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__option--title")
  }, option.label), option.description && /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__option--description")
  }, option.description))), typeof value !== "undefined" && typeof option.value !== "undefined" && value === option.value ? /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__option--selected")
  }) : null))))));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ContextMenu
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udGV4dE1lbnUudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBLZXlib2FyZEV2ZW50LCBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5pbXBvcnQgRm9jdXNUcmFwIGZyb20gJ2ZvY3VzLXRyYXAtcmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IHVzZVBvcHBlciB9IGZyb20gJ3JlYWN0LXBvcHBlcic7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUgeyBUaGVtZSB9IGZyb20gJy4uL3V0aWwvdGhlbWUnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBnZXRDbGFzc05hbWVzRm9yIH0gZnJvbSAnLi4vdXRpbC9nZXRDbGFzc05hbWVzRm9yJztcbmltcG9ydCB7IHRoZW1lQ2xhc3NOYW1lIH0gZnJvbSAnLi4vdXRpbC90aGVtZSc7XG5cbmV4cG9ydCB0eXBlIENvbnRleHRNZW51T3B0aW9uVHlwZTxUPiA9IHtcbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGljb24/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGxhYmVsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IG9uQ2xpY2s6ICh2YWx1ZT86IFQpID0+IHVua25vd247XG4gIHJlYWRvbmx5IHZhbHVlPzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZTxUPiA9IHtcbiAgcmVhZG9ubHkgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIHJlYWRvbmx5IGkxOG46IExvY2FsaXplclR5cGU7XG4gIHJlYWRvbmx5IG1lbnVPcHRpb25zOiBSZWFkb25seUFycmF5PENvbnRleHRNZW51T3B0aW9uVHlwZTxUPj47XG4gIHJlYWRvbmx5IG1vZHVsZUNsYXNzTmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgb25DbGljaz86ICgpID0+IHVua25vd247XG4gIHJlYWRvbmx5IG9uTWVudVNob3dpbmdDaGFuZ2VkPzogKHZhbHVlOiBib29sZWFuKSA9PiB1bmtub3duO1xuICByZWFkb25seSBwb3BwZXJPcHRpb25zPzogUGljazxPcHRpb25zLCAncGxhY2VtZW50JyB8ICdzdHJhdGVneSc+O1xuICByZWFkb25seSB0aGVtZT86IFRoZW1lO1xuICByZWFkb25seSB0aXRsZT86IHN0cmluZztcbiAgcmVhZG9ubHkgdmFsdWU/OiBUO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbnRleHRNZW51PFQ+KHtcbiAgY2hpbGRyZW4sXG4gIGkxOG4sXG4gIG1lbnVPcHRpb25zLFxuICBtb2R1bGVDbGFzc05hbWUsXG4gIG9uQ2xpY2ssXG4gIG9uTWVudVNob3dpbmdDaGFuZ2VkLFxuICBwb3BwZXJPcHRpb25zLFxuICB0aGVtZSxcbiAgdGl0bGUsXG4gIHZhbHVlLFxufTogUHJvcHNUeXBlPFQ+KTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBbaXNNZW51U2hvd2luZywgc2V0SXNNZW51U2hvd2luZ10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IFtmb2N1c2VkSW5kZXgsIHNldEZvY3VzZWRJbmRleF0gPSB1c2VTdGF0ZTxudW1iZXIgfCB1bmRlZmluZWQ+KFxuICAgIHVuZGVmaW5lZFxuICApO1xuICBjb25zdCBbcG9wcGVyRWxlbWVudCwgc2V0UG9wcGVyRWxlbWVudF0gPSB1c2VTdGF0ZTxIVE1MRGl2RWxlbWVudCB8IG51bGw+KFxuICAgIG51bGxcbiAgKTtcbiAgY29uc3QgW3JlZmVyZW5jZUVsZW1lbnQsIHNldFJlZmVyZW5jZUVsZW1lbnRdID1cbiAgICB1c2VTdGF0ZTxIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw+KG51bGwpO1xuXG4gIGNvbnN0IHsgc3R5bGVzLCBhdHRyaWJ1dGVzIH0gPSB1c2VQb3BwZXIocmVmZXJlbmNlRWxlbWVudCwgcG9wcGVyRWxlbWVudCwge1xuICAgIHBsYWNlbWVudDogJ3RvcC1zdGFydCcsXG4gICAgc3RyYXRlZ3k6ICdmaXhlZCcsXG4gICAgLi4ucG9wcGVyT3B0aW9ucyxcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAob25NZW51U2hvd2luZ0NoYW5nZWQpIHtcbiAgICAgIG9uTWVudVNob3dpbmdDaGFuZ2VkKGlzTWVudVNob3dpbmcpO1xuICAgIH1cbiAgfSwgW2lzTWVudVNob3dpbmcsIG9uTWVudVNob3dpbmdDaGFuZ2VkXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzTWVudVNob3dpbmcpIHtcbiAgICAgIHJldHVybiBub29wO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZU91dHNpZGVDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgaWYgKCFyZWZlcmVuY2VFbGVtZW50Py5jb250YWlucyhldmVudC50YXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgICAgc2V0SXNNZW51U2hvd2luZyhmYWxzZSk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlT3V0c2lkZUNsaWNrKTtcbiAgICB9O1xuICB9LCBbaXNNZW51U2hvd2luZywgcmVmZXJlbmNlRWxlbWVudF0pO1xuXG4gIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIWlzTWVudVNob3dpbmcpIHtcbiAgICAgIGlmIChldi5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgc2V0Rm9jdXNlZEluZGV4KDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldi5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICBjb25zdCBjdXJyRm9jdXNlZEluZGV4ID0gZm9jdXNlZEluZGV4IHx8IDA7XG4gICAgICBjb25zdCBuZXh0Rm9jdXNlZEluZGV4ID1cbiAgICAgICAgY3VyckZvY3VzZWRJbmRleCA+PSBtZW51T3B0aW9ucy5sZW5ndGggLSAxID8gMCA6IGN1cnJGb2N1c2VkSW5kZXggKyAxO1xuICAgICAgc2V0Rm9jdXNlZEluZGV4KG5leHRGb2N1c2VkSW5kZXgpO1xuICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmIChldi5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgY29uc3QgY3VyckZvY3VzZWRJbmRleCA9IGZvY3VzZWRJbmRleCB8fCAwO1xuICAgICAgY29uc3QgbmV4dEZvY3VzZWRJbmRleCA9XG4gICAgICAgIGN1cnJGb2N1c2VkSW5kZXggPT09IDAgPyBtZW51T3B0aW9ucy5sZW5ndGggLSAxIDogY3VyckZvY3VzZWRJbmRleCAtIDE7XG4gICAgICBzZXRGb2N1c2VkSW5kZXgobmV4dEZvY3VzZWRJbmRleCk7XG4gICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKGV2LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgaWYgKGZvY3VzZWRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGZvY3VzZWRPcHRpb24gPSBtZW51T3B0aW9uc1tmb2N1c2VkSW5kZXhdO1xuICAgICAgICBmb2N1c2VkT3B0aW9uLm9uQ2xpY2soZm9jdXNlZE9wdGlvbi52YWx1ZSk7XG4gICAgICB9XG4gICAgICBzZXRJc01lbnVTaG93aW5nKGZhbHNlKTtcbiAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZXY6IEtleWJvYXJkRXZlbnQgfCBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgc2V0SXNNZW51U2hvd2luZyh0cnVlKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIGNvbnN0IGdldENsYXNzTmFtZSA9IGdldENsYXNzTmFtZXNGb3IoJ0NvbnRleHRNZW51JywgbW9kdWxlQ2xhc3NOYW1lKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgZ2V0Q2xhc3NOYW1lKCdfX2NvbnRhaW5lcicpLFxuICAgICAgICB0aGVtZSA/IHRoZW1lQ2xhc3NOYW1lKHRoZW1lKSA6IHVuZGVmaW5lZFxuICAgICAgKX1cbiAgICA+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ0NvbnRleHRNZW51LS1idXR0b24nKX1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgIGdldENsYXNzTmFtZSgnX19idXR0b24nKSxcbiAgICAgICAgICBpc01lbnVTaG93aW5nID8gZ2V0Q2xhc3NOYW1lKCdfX2J1dHRvbi0tYWN0aXZlJykgOiB1bmRlZmluZWRcbiAgICAgICAgKX1cbiAgICAgICAgb25DbGljaz17b25DbGljayB8fCBoYW5kbGVDbGlja31cbiAgICAgICAgb25Db250ZXh0TWVudT17aGFuZGxlQ2xpY2t9XG4gICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5RG93bn1cbiAgICAgICAgcmVmPXtzZXRSZWZlcmVuY2VFbGVtZW50fVxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9idXR0b24+XG4gICAgICB7aXNNZW51U2hvd2luZyAmJiAoXG4gICAgICAgIDxGb2N1c1RyYXBcbiAgICAgICAgICBmb2N1c1RyYXBPcHRpb25zPXt7XG4gICAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoZW1lID8gdGhlbWVDbGFzc05hbWUodGhlbWUpIDogdW5kZWZpbmVkfT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgIGdldENsYXNzTmFtZSgnX19wb3BwZXInKSxcbiAgICAgICAgICAgICAgICBtZW51T3B0aW9ucy5sZW5ndGggPT09IDFcbiAgICAgICAgICAgICAgICAgID8gZ2V0Q2xhc3NOYW1lKCdfX3BvcHBlci0tc2luZ2xlLWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgcmVmPXtzZXRQb3BwZXJFbGVtZW50fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLnBvcHBlcn1cbiAgICAgICAgICAgICAgey4uLmF0dHJpYnV0ZXMucG9wcGVyfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGl0bGUgJiYgPGRpdiBjbGFzc05hbWU9e2dldENsYXNzTmFtZSgnX190aXRsZScpfT57dGl0bGV9PC9kaXY+fVxuICAgICAgICAgICAgICB7bWVudU9wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17b3B0aW9uLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICBnZXRDbGFzc05hbWUoJ19fb3B0aW9uJyksXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzZWRJbmRleCA9PT0gaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICA/IGdldENsYXNzTmFtZSgnX19vcHRpb24tLWZvY3VzZWQnKVxuICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAga2V5PXtvcHRpb24ubGFiZWx9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLm9uQ2xpY2sob3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0SXNNZW51U2hvd2luZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19fb3B0aW9uLS1jb250YWluZXInKX0+XG4gICAgICAgICAgICAgICAgICAgIHtvcHRpb24uaWNvbiAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRDbGFzc05hbWUoJ19fb3B0aW9uLS1pY29uJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbi5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2dldENsYXNzTmFtZSgnX19vcHRpb24tLXRpdGxlJyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbi5sYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLmRlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19fb3B0aW9uLS1kZXNjcmlwdGlvbicpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICB7dHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbi52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgIHZhbHVlID09PSBvcHRpb24udmFsdWUgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19fb3B0aW9uLS1zZWxlY3RlZCcpfSAvPlxuICAgICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRm9jdXNUcmFwPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7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
