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
var Modal_exports = {};
__export(Modal_exports, {
  Modal: () => Modal,
  ModalWindow: () => ModalWindow
});
module.exports = __toCommonJS(Modal_exports);
var import_react = __toESM(require("react"));
var import_react_measure = __toESM(require("react-measure"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var import_web = require("@react-spring/web");
var import_ModalHost = require("./ModalHost");
var import_getClassNamesFor = require("../util/getClassNamesFor");
var import_useAnimated = require("../hooks/useAnimated");
var import_useHasWrapped = require("../hooks/useHasWrapped");
var import_useRefMerger = require("../hooks/useRefMerger");
const BASE_CLASS_NAME = "module-Modal";
function Modal({
  children,
  hasStickyButtons,
  hasXButton,
  i18n,
  modalFooter,
  moduleClassName,
  noMouseClose,
  onBackButtonClick,
  onClose = import_lodash.noop,
  theme,
  title,
  useFocusTrap
}) {
  const { close, modalStyles, overlayStyles } = (0, import_useAnimated.useAnimated)(onClose, {
    getFrom: () => ({ opacity: 0, transform: "translateY(48px)" }),
    getTo: (isOpen) => isOpen ? { opacity: 1, transform: "translateY(0px)" } : { opacity: 0, transform: "translateY(48px)" }
  });
  return /* @__PURE__ */ import_react.default.createElement(import_ModalHost.ModalHost, {
    moduleClassName,
    noMouseClose,
    onClose: close,
    overlayStyles,
    theme,
    useFocusTrap
  }, /* @__PURE__ */ import_react.default.createElement(import_web.animated.div, {
    style: modalStyles
  }, /* @__PURE__ */ import_react.default.createElement(ModalWindow, {
    hasStickyButtons,
    hasXButton,
    i18n,
    modalFooter,
    moduleClassName,
    onBackButtonClick,
    onClose: close,
    title
  }, children)));
}
function ModalWindow({
  children,
  hasStickyButtons,
  hasXButton,
  i18n,
  modalFooter,
  moduleClassName,
  onBackButtonClick,
  onClose = import_lodash.noop,
  title
}) {
  const modalRef = (0, import_react.useRef)(null);
  const refMerger = (0, import_useRefMerger.useRefMerger)();
  const bodyRef = (0, import_react.useRef)(null);
  const [scrolled, setScrolled] = (0, import_react.useState)(false);
  const [hasOverflow, setHasOverflow] = (0, import_react.useState)(false);
  const hasHeader = Boolean(hasXButton || title || onBackButtonClick);
  const getClassName = (0, import_getClassNamesFor.getClassNamesFor)(BASE_CLASS_NAME, moduleClassName);
  function handleResize({ scroll }) {
    const modalNode = modalRef?.current;
    if (!modalNode) {
      return;
    }
    if (scroll) {
      setHasOverflow(scroll.height > modalNode.clientHeight);
    }
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName(""), getClassName(hasHeader ? "--has-header" : "--no-header"), hasStickyButtons && getClassName("--sticky-buttons")),
    ref: modalRef,
    onClick: (event) => {
      event.stopPropagation();
    }
  }, hasHeader && /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName("__header"), onBackButtonClick ? getClassName("__header--with-back-button") : null)
  }, onBackButtonClick && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("back"),
    className: getClassName("__back-button"),
    onClick: onBackButtonClick,
    tabIndex: 0,
    type: "button"
  }), title && /* @__PURE__ */ import_react.default.createElement("h1", {
    className: (0, import_classnames.default)(getClassName("__title"), hasXButton ? getClassName("__title--with-x-button") : null)
  }, title), hasXButton && !title && /* @__PURE__ */ import_react.default.createElement("div", {
    className: getClassName("__title")
  }), hasXButton && /* @__PURE__ */ import_react.default.createElement("button", {
    "aria-label": i18n("close"),
    className: getClassName("__close-button"),
    onClick: onClose,
    tabIndex: 0,
    type: "button"
  })), /* @__PURE__ */ import_react.default.createElement(import_react_measure.default, {
    scroll: true,
    onResize: handleResize
  }, ({ measureRef }) => /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(getClassName("__body"), scrolled ? getClassName("__body--scrolled") : null, hasOverflow || scrolled ? getClassName("__body--overflow") : null),
    onScroll: () => {
      const scrollTop = bodyRef.current?.scrollTop || 0;
      setScrolled(scrollTop > 2);
    },
    ref: refMerger(measureRef, bodyRef)
  }, children)), modalFooter));
}
Modal.ButtonFooter = function ButtonFooter({
  children,
  moduleClassName
}) {
  const [ref, hasWrapped] = (0, import_useHasWrapped.useHasWrapped)();
  const className = (0, import_getClassNamesFor.getClassNamesFor)(BASE_CLASS_NAME, moduleClassName)("__button-footer");
  return /* @__PURE__ */ import_react.default.createElement("div", {
    className: (0, import_classnames.default)(className, hasWrapped ? `${className}--one-button-per-line` : void 0),
    ref
  }, children);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Modal,
  ModalWindow
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBSZWFjdEVsZW1lbnQsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBDb250ZW50UmVjdCwgTWVhc3VyZWRDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0LW1lYXN1cmUnO1xuaW1wb3J0IE1lYXN1cmUgZnJvbSAncmVhY3QtbWVhc3VyZSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgYW5pbWF0ZWQgfSBmcm9tICdAcmVhY3Qtc3ByaW5nL3dlYic7XG5cbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHsgTW9kYWxIb3N0IH0gZnJvbSAnLi9Nb2RhbEhvc3QnO1xuaW1wb3J0IHR5cGUgeyBUaGVtZSB9IGZyb20gJy4uL3V0aWwvdGhlbWUnO1xuaW1wb3J0IHsgZ2V0Q2xhc3NOYW1lc0ZvciB9IGZyb20gJy4uL3V0aWwvZ2V0Q2xhc3NOYW1lc0Zvcic7XG5pbXBvcnQgeyB1c2VBbmltYXRlZCB9IGZyb20gJy4uL2hvb2tzL3VzZUFuaW1hdGVkJztcbmltcG9ydCB7IHVzZUhhc1dyYXBwZWQgfSBmcm9tICcuLi9ob29rcy91c2VIYXNXcmFwcGVkJztcbmltcG9ydCB7IHVzZVJlZk1lcmdlciB9IGZyb20gJy4uL2hvb2tzL3VzZVJlZk1lcmdlcic7XG5cbnR5cGUgUHJvcHNUeXBlID0ge1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuICBoYXNTdGlja3lCdXR0b25zPzogYm9vbGVhbjtcbiAgaGFzWEJ1dHRvbj86IGJvb2xlYW47XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIG1vZGFsRm9vdGVyPzogSlNYLkVsZW1lbnQ7XG4gIG1vZHVsZUNsYXNzTmFtZT86IHN0cmluZztcbiAgb25CYWNrQnV0dG9uQ2xpY2s/OiAoKSA9PiB1bmtub3duO1xuICBvbkNsb3NlPzogKCkgPT4gdm9pZDtcbiAgdGl0bGU/OiBSZWFjdE5vZGU7XG4gIHVzZUZvY3VzVHJhcD86IGJvb2xlYW47XG59O1xuXG50eXBlIE1vZGFsUHJvcHNUeXBlID0gUHJvcHNUeXBlICYge1xuICBub01vdXNlQ2xvc2U/OiBib29sZWFuO1xuICB0aGVtZT86IFRoZW1lO1xufTtcblxuY29uc3QgQkFTRV9DTEFTU19OQU1FID0gJ21vZHVsZS1Nb2RhbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBNb2RhbCh7XG4gIGNoaWxkcmVuLFxuICBoYXNTdGlja3lCdXR0b25zLFxuICBoYXNYQnV0dG9uLFxuICBpMThuLFxuICBtb2RhbEZvb3RlcixcbiAgbW9kdWxlQ2xhc3NOYW1lLFxuICBub01vdXNlQ2xvc2UsXG4gIG9uQmFja0J1dHRvbkNsaWNrLFxuICBvbkNsb3NlID0gbm9vcCxcbiAgdGhlbWUsXG4gIHRpdGxlLFxuICB1c2VGb2N1c1RyYXAsXG59OiBSZWFkb25seTxNb2RhbFByb3BzVHlwZT4pOiBSZWFjdEVsZW1lbnQge1xuICBjb25zdCB7IGNsb3NlLCBtb2RhbFN0eWxlcywgb3ZlcmxheVN0eWxlcyB9ID0gdXNlQW5pbWF0ZWQob25DbG9zZSwge1xuICAgIGdldEZyb206ICgpID0+ICh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoNDhweCknIH0pLFxuICAgIGdldFRvOiBpc09wZW4gPT5cbiAgICAgIGlzT3BlblxuICAgICAgICA/IHsgb3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwcHgpJyB9XG4gICAgICAgIDogeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDQ4cHgpJyB9LFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxNb2RhbEhvc3RcbiAgICAgIG1vZHVsZUNsYXNzTmFtZT17bW9kdWxlQ2xhc3NOYW1lfVxuICAgICAgbm9Nb3VzZUNsb3NlPXtub01vdXNlQ2xvc2V9XG4gICAgICBvbkNsb3NlPXtjbG9zZX1cbiAgICAgIG92ZXJsYXlTdHlsZXM9e292ZXJsYXlTdHlsZXN9XG4gICAgICB0aGVtZT17dGhlbWV9XG4gICAgICB1c2VGb2N1c1RyYXA9e3VzZUZvY3VzVHJhcH1cbiAgICA+XG4gICAgICA8YW5pbWF0ZWQuZGl2IHN0eWxlPXttb2RhbFN0eWxlc30+XG4gICAgICAgIDxNb2RhbFdpbmRvd1xuICAgICAgICAgIGhhc1N0aWNreUJ1dHRvbnM9e2hhc1N0aWNreUJ1dHRvbnN9XG4gICAgICAgICAgaGFzWEJ1dHRvbj17aGFzWEJ1dHRvbn1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG1vZGFsRm9vdGVyPXttb2RhbEZvb3Rlcn1cbiAgICAgICAgICBtb2R1bGVDbGFzc05hbWU9e21vZHVsZUNsYXNzTmFtZX1cbiAgICAgICAgICBvbkJhY2tCdXR0b25DbGljaz17b25CYWNrQnV0dG9uQ2xpY2t9XG4gICAgICAgICAgb25DbG9zZT17Y2xvc2V9XG4gICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICA+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L01vZGFsV2luZG93PlxuICAgICAgPC9hbmltYXRlZC5kaXY+XG4gICAgPC9Nb2RhbEhvc3Q+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNb2RhbFdpbmRvdyh7XG4gIGNoaWxkcmVuLFxuICBoYXNTdGlja3lCdXR0b25zLFxuICBoYXNYQnV0dG9uLFxuICBpMThuLFxuICBtb2RhbEZvb3RlcixcbiAgbW9kdWxlQ2xhc3NOYW1lLFxuICBvbkJhY2tCdXR0b25DbGljayxcbiAgb25DbG9zZSA9IG5vb3AsXG4gIHRpdGxlLFxufTogUmVhZG9ubHk8UHJvcHNUeXBlPik6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgbW9kYWxSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcblxuICBjb25zdCByZWZNZXJnZXIgPSB1c2VSZWZNZXJnZXIoKTtcblxuICBjb25zdCBib2R5UmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtzY3JvbGxlZCwgc2V0U2Nyb2xsZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaGFzT3ZlcmZsb3csIHNldEhhc092ZXJmbG93XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBoYXNIZWFkZXIgPSBCb29sZWFuKGhhc1hCdXR0b24gfHwgdGl0bGUgfHwgb25CYWNrQnV0dG9uQ2xpY2spO1xuICBjb25zdCBnZXRDbGFzc05hbWUgPSBnZXRDbGFzc05hbWVzRm9yKEJBU0VfQ0xBU1NfTkFNRSwgbW9kdWxlQ2xhc3NOYW1lKTtcblxuICBmdW5jdGlvbiBoYW5kbGVSZXNpemUoeyBzY3JvbGwgfTogQ29udGVudFJlY3QpIHtcbiAgICBjb25zdCBtb2RhbE5vZGUgPSBtb2RhbFJlZj8uY3VycmVudDtcbiAgICBpZiAoIW1vZGFsTm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICBzZXRIYXNPdmVyZmxvdyhzY3JvbGwuaGVpZ2h0ID4gbW9kYWxOb2RlLmNsaWVudEhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgey8qIFdlIGRvbid0IHdhbnQgdGhlIGNsaWNrIGV2ZW50IHRvIHByb3BhZ2F0ZSB0byBpdHMgY29udGFpbmVyIG5vZGUuICovfVxuICAgICAgey8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuICovfVxuICAgICAgey8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc3gtYTExeS9uby1zdGF0aWMtZWxlbWVudC1pbnRlcmFjdGlvbnMsIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgKi99XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICBnZXRDbGFzc05hbWUoJycpLFxuICAgICAgICAgIGdldENsYXNzTmFtZShoYXNIZWFkZXIgPyAnLS1oYXMtaGVhZGVyJyA6ICctLW5vLWhlYWRlcicpLFxuICAgICAgICAgIGhhc1N0aWNreUJ1dHRvbnMgJiYgZ2V0Q2xhc3NOYW1lKCctLXN0aWNreS1idXR0b25zJylcbiAgICAgICAgKX1cbiAgICAgICAgcmVmPXttb2RhbFJlZn1cbiAgICAgICAgb25DbGljaz17ZXZlbnQgPT4ge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7aGFzSGVhZGVyICYmIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgIGdldENsYXNzTmFtZSgnX19oZWFkZXInKSxcbiAgICAgICAgICAgICAgb25CYWNrQnV0dG9uQ2xpY2tcbiAgICAgICAgICAgICAgICA/IGdldENsYXNzTmFtZSgnX19oZWFkZXItLXdpdGgtYmFjay1idXR0b24nKVxuICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7b25CYWNrQnV0dG9uQ2xpY2sgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignYmFjaycpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Z2V0Q2xhc3NOYW1lKCdfX2JhY2stYnV0dG9uJyl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17b25CYWNrQnV0dG9uQ2xpY2t9XG4gICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3RpdGxlICYmIChcbiAgICAgICAgICAgICAgPGgxXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3NOYW1lKCdfX3RpdGxlJyksXG4gICAgICAgICAgICAgICAgICBoYXNYQnV0dG9uID8gZ2V0Q2xhc3NOYW1lKCdfX3RpdGxlLS13aXRoLXgtYnV0dG9uJykgOiBudWxsXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aGFzWEJ1dHRvbiAmJiAhdGl0bGUgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Z2V0Q2xhc3NOYW1lKCdfX3RpdGxlJyl9IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2hhc1hCdXR0b24gJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignY2xvc2UnKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2dldENsYXNzTmFtZSgnX19jbG9zZS1idXR0b24nKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPE1lYXN1cmUgc2Nyb2xsIG9uUmVzaXplPXtoYW5kbGVSZXNpemV9PlxuICAgICAgICAgIHsoeyBtZWFzdXJlUmVmIH06IE1lYXN1cmVkQ29tcG9uZW50UHJvcHMpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgIGdldENsYXNzTmFtZSgnX19ib2R5JyksXG4gICAgICAgICAgICAgICAgc2Nyb2xsZWQgPyBnZXRDbGFzc05hbWUoJ19fYm9keS0tc2Nyb2xsZWQnKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgaGFzT3ZlcmZsb3cgfHwgc2Nyb2xsZWRcbiAgICAgICAgICAgICAgICAgID8gZ2V0Q2xhc3NOYW1lKCdfX2JvZHktLW92ZXJmbG93JylcbiAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICBvblNjcm9sbD17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IGJvZHlSZWYuY3VycmVudD8uc2Nyb2xsVG9wIHx8IDA7XG4gICAgICAgICAgICAgICAgc2V0U2Nyb2xsZWQoc2Nyb2xsVG9wID4gMik7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHJlZj17cmVmTWVyZ2VyKG1lYXN1cmVSZWYsIGJvZHlSZWYpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L01lYXN1cmU+XG4gICAgICAgIHttb2RhbEZvb3Rlcn1cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApO1xufVxuXG5Nb2RhbC5CdXR0b25Gb290ZXIgPSBmdW5jdGlvbiBCdXR0b25Gb290ZXIoe1xuICBjaGlsZHJlbixcbiAgbW9kdWxlQ2xhc3NOYW1lLFxufTogUmVhZG9ubHk8e1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuICBtb2R1bGVDbGFzc05hbWU/OiBzdHJpbmc7XG59Pik6IFJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IFtyZWYsIGhhc1dyYXBwZWRdID0gdXNlSGFzV3JhcHBlZDxIVE1MRGl2RWxlbWVudD4oKTtcblxuICBjb25zdCBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWVzRm9yKFxuICAgIEJBU0VfQ0xBU1NfTkFNRSxcbiAgICBtb2R1bGVDbGFzc05hbWVcbiAgKSgnX19idXR0b24tZm9vdGVyJyk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgaGFzV3JhcHBlZCA/IGAke2NsYXNzTmFtZX0tLW9uZS1idXR0b24tcGVyLWxpbmVgIDogdW5kZWZpbmVkXG4gICAgICApfVxuICAgICAgcmVmPXtyZWZ9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUF3QztBQUV4QywyQkFBb0I7QUFDcEIsd0JBQXVCO0FBQ3ZCLG9CQUFxQjtBQUNyQixpQkFBeUI7QUFHekIsdUJBQTBCO0FBRTFCLDhCQUFpQztBQUNqQyx5QkFBNEI7QUFDNUIsMkJBQThCO0FBQzlCLDBCQUE2QjtBQW9CN0IsTUFBTSxrQkFBa0I7QUFFakIsZUFBZTtBQUFBLEVBQ3BCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0EsVUFBVTtBQUFBLEVBQ1Y7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBQ3lDO0FBQ3pDLFFBQU0sRUFBRSxPQUFPLGFBQWEsa0JBQWtCLG9DQUFZLFNBQVM7QUFBQSxJQUNqRSxTQUFTLE1BQU8sR0FBRSxTQUFTLEdBQUcsV0FBVyxtQkFBbUI7QUFBQSxJQUM1RCxPQUFPLFlBQ0wsU0FDSSxFQUFFLFNBQVMsR0FBRyxXQUFXLGtCQUFrQixJQUMzQyxFQUFFLFNBQVMsR0FBRyxXQUFXLG1CQUFtQjtB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
