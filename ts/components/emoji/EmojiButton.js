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
var EmojiButton_exports = {};
__export(EmojiButton_exports, {
  EmojiButton: () => EmojiButton
});
module.exports = __toCommonJS(EmojiButton_exports);
var React = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var import_react_popper = require("react-popper");
var import_react_dom = require("react-dom");
var import_Emoji = require("./Emoji");
var import_EmojiPicker = require("./EmojiPicker");
var import_useRefMerger = require("../../hooks/useRefMerger");
var KeyboardLayout = __toESM(require("../../services/keyboardLayout"));
const EmojiButton = React.memo(({
  className,
  closeOnPick,
  emoji,
  emojiButtonApi,
  i18n,
  doSend,
  onClose,
  onPickEmoji,
  skinTone,
  onSetSkinTone,
  recentEmojis
}) => {
  const [open, setOpen] = React.useState(false);
  const [popperRoot, setPopperRoot] = React.useState(null);
  const buttonRef = React.useRef(null);
  const refMerger = (0, import_useRefMerger.useRefMerger)();
  const handleClickButton = React.useCallback(() => {
    if (popperRoot) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [popperRoot, setOpen]);
  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [setOpen, onClose]);
  const api = React.useMemo(() => ({
    close: () => setOpen(false)
  }), [setOpen]);
  if (emojiButtonApi) {
    emojiButtonApi.current = api;
  }
  React.useEffect(() => {
    if (open) {
      const root = document.createElement("div");
      setPopperRoot(root);
      document.body.appendChild(root);
      const handleOutsideClick = /* @__PURE__ */ __name((event) => {
        if (!root.contains(event.target) && event.target !== buttonRef.current) {
          handleClose();
          event.stopPropagation();
          event.preventDefault();
        }
      }, "handleOutsideClick");
      document.addEventListener("click", handleOutsideClick);
      return () => {
        document.body.removeChild(root);
        document.removeEventListener("click", handleOutsideClick);
        setPopperRoot(null);
      };
    }
    return import_lodash.noop;
  }, [open, setOpen, setPopperRoot, handleClose]);
  React.useEffect(() => {
    const handleKeydown = /* @__PURE__ */ __name((event) => {
      const { ctrlKey, metaKey, shiftKey } = event;
      const commandKey = (0, import_lodash.get)(window, "platform") === "darwin" && metaKey;
      const controlKey = (0, import_lodash.get)(window, "platform") !== "darwin" && ctrlKey;
      const commandOrCtrl = commandKey || controlKey;
      const key = KeyboardLayout.lookup(event);
      const panels = document.querySelectorAll(".conversation .panel");
      if (panels && panels.length > 1) {
        return;
      }
      if (commandOrCtrl && shiftKey && (key === "j" || key === "J")) {
        event.stopPropagation();
        event.preventDefault();
        setOpen(!open);
      }
    }, "handleKeydown");
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open, setOpen]);
  return /* @__PURE__ */ React.createElement(import_react_popper.Manager, null, /* @__PURE__ */ React.createElement(import_react_popper.Reference, null, ({ ref }) => /* @__PURE__ */ React.createElement("button", {
    type: "button",
    ref: refMerger(buttonRef, ref),
    onClick: handleClickButton,
    className: (0, import_classnames.default)(className, {
      "module-emoji-button__button": true,
      "module-emoji-button__button--active": open,
      "module-emoji-button__button--has-emoji": Boolean(emoji)
    }),
    "aria-label": i18n("EmojiButton__label")
  }, emoji && /* @__PURE__ */ React.createElement(import_Emoji.Emoji, {
    emoji,
    size: 24
  }))), open && popperRoot ? (0, import_react_dom.createPortal)(/* @__PURE__ */ React.createElement(import_react_popper.Popper, {
    placement: "top-start",
    strategy: "fixed"
  }, ({ ref, style }) => /* @__PURE__ */ React.createElement(import_EmojiPicker.EmojiPicker, {
    ref,
    i18n,
    style,
    onPickEmoji: (ev) => {
      onPickEmoji(ev);
      if (closeOnPick) {
        handleClose();
      }
    },
    doSend,
    onClose: handleClose,
    skinTone,
    onSetSkinTone,
    recentEmojis
  })), popperRoot) : null);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmojiButton
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRW1vamlCdXR0b24udHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBNdXRhYmxlUmVmT2JqZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBnZXQsIG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgTWFuYWdlciwgUG9wcGVyLCBSZWZlcmVuY2UgfSBmcm9tICdyZWFjdC1wb3BwZXInO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IEVtb2ppIH0gZnJvbSAnLi9FbW9qaSc7XG5pbXBvcnQgdHlwZSB7IFByb3BzIGFzIEVtb2ppUGlja2VyUHJvcHMgfSBmcm9tICcuL0Vtb2ppUGlja2VyJztcbmltcG9ydCB7IEVtb2ppUGlja2VyIH0gZnJvbSAnLi9FbW9qaVBpY2tlcic7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB7IHVzZVJlZk1lcmdlciB9IGZyb20gJy4uLy4uL2hvb2tzL3VzZVJlZk1lcmdlcic7XG5pbXBvcnQgKiBhcyBLZXlib2FyZExheW91dCBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZExheW91dCc7XG5cbmV4cG9ydCB0eXBlIE93blByb3BzID0gUmVhZG9ubHk8e1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGNsb3NlT25QaWNrPzogYm9vbGVhbjtcbiAgZW1vamk/OiBzdHJpbmc7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIG9uQ2xvc2U/OiAoKSA9PiB1bmtub3duO1xuICBlbW9qaUJ1dHRvbkFwaT86IE11dGFibGVSZWZPYmplY3Q8RW1vamlCdXR0b25BUEkgfCB1bmRlZmluZWQ+O1xufT47XG5cbmV4cG9ydCB0eXBlIFByb3BzID0gT3duUHJvcHMgJlxuICBQaWNrPFxuICAgIEVtb2ppUGlja2VyUHJvcHMsXG4gICAgJ2RvU2VuZCcgfCAnb25QaWNrRW1vamknIHwgJ29uU2V0U2tpblRvbmUnIHwgJ3JlY2VudEVtb2ppcycgfCAnc2tpblRvbmUnXG4gID47XG5cbmV4cG9ydCB0eXBlIEVtb2ppQnV0dG9uQVBJID0gUmVhZG9ubHk8e1xuICBjbG9zZTogKCkgPT4gdm9pZDtcbn0+O1xuXG5leHBvcnQgY29uc3QgRW1vamlCdXR0b24gPSBSZWFjdC5tZW1vKFxuICAoe1xuICAgIGNsYXNzTmFtZSxcbiAgICBjbG9zZU9uUGljayxcbiAgICBlbW9qaSxcbiAgICBlbW9qaUJ1dHRvbkFwaSxcbiAgICBpMThuLFxuICAgIGRvU2VuZCxcbiAgICBvbkNsb3NlLFxuICAgIG9uUGlja0Vtb2ppLFxuICAgIHNraW5Ub25lLFxuICAgIG9uU2V0U2tpblRvbmUsXG4gICAgcmVjZW50RW1vamlzLFxuICB9OiBQcm9wcykgPT4ge1xuICAgIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbcG9wcGVyUm9vdCwgc2V0UG9wcGVyUm9vdF0gPSBSZWFjdC51c2VTdGF0ZTxIVE1MRWxlbWVudCB8IG51bGw+KFxuICAgICAgbnVsbFxuICAgICk7XG4gICAgY29uc3QgYnV0dG9uUmVmID0gUmVhY3QudXNlUmVmPEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3QgcmVmTWVyZ2VyID0gdXNlUmVmTWVyZ2VyKCk7XG5cbiAgICBjb25zdCBoYW5kbGVDbGlja0J1dHRvbiA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIGlmIChwb3BwZXJSb290KSB7XG4gICAgICAgIHNldE9wZW4oZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0T3Blbih0cnVlKTtcbiAgICAgIH1cbiAgICB9LCBbcG9wcGVyUm9vdCwgc2V0T3Blbl0pO1xuXG4gICAgY29uc3QgaGFuZGxlQ2xvc2UgPSBSZWFjdC51c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICBzZXRPcGVuKGZhbHNlKTtcbiAgICAgIGlmIChvbkNsb3NlKSB7XG4gICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LCBbc2V0T3Blbiwgb25DbG9zZV0pO1xuXG4gICAgY29uc3QgYXBpID0gUmVhY3QudXNlTWVtbyhcbiAgICAgICgpID0+ICh7XG4gICAgICAgIGNsb3NlOiAoKSA9PiBzZXRPcGVuKGZhbHNlKSxcbiAgICAgIH0pLFxuICAgICAgW3NldE9wZW5dXG4gICAgKTtcblxuICAgIGlmIChlbW9qaUJ1dHRvbkFwaSkge1xuICAgICAgLy8gVXNpbmcgYSBSZWFjdC5NdXRhYmxlUmVmT2JqZWN0LCBzbyB3ZSBuZWVkIHRvIHJlYXNzaWduIHRoaXMgcHJvcC5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgZW1vamlCdXR0b25BcGkuY3VycmVudCA9IGFwaTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgcG9wcGVyIHJvb3QgYW5kIGhhbmRsZSBvdXRzaWRlIGNsaWNrc1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAob3Blbikge1xuICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNldFBvcHBlclJvb3Qocm9vdCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocm9vdCk7XG4gICAgICAgIGNvbnN0IGhhbmRsZU91dHNpZGVDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFyb290LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBOb2RlKSAmJlxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0ICE9PSBidXR0b25SZWYuY3VycmVudFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlT3V0c2lkZUNsaWNrKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocm9vdCk7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgICAgICAgIHNldFBvcHBlclJvb3QobnVsbCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub29wO1xuICAgIH0sIFtvcGVuLCBzZXRPcGVuLCBzZXRQb3BwZXJSb290LCBoYW5kbGVDbG9zZV0pO1xuXG4gICAgLy8gSW5zdGFsbCBrZXlib2FyZCBzaG9ydGN1dCB0byBvcGVuIGVtb2ppIHBpY2tlclxuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3RybEtleSwgbWV0YUtleSwgc2hpZnRLZXkgfSA9IGV2ZW50O1xuICAgICAgICBjb25zdCBjb21tYW5kS2V5ID0gZ2V0KHdpbmRvdywgJ3BsYXRmb3JtJykgPT09ICdkYXJ3aW4nICYmIG1ldGFLZXk7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xLZXkgPSBnZXQod2luZG93LCAncGxhdGZvcm0nKSAhPT0gJ2RhcndpbicgJiYgY3RybEtleTtcbiAgICAgICAgY29uc3QgY29tbWFuZE9yQ3RybCA9IGNvbW1hbmRLZXkgfHwgY29udHJvbEtleTtcbiAgICAgICAgY29uc3Qga2V5ID0gS2V5Ym9hcmRMYXlvdXQubG9va3VwKGV2ZW50KTtcblxuICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIG9wZW4gdXAgaWYgdGhlIGNvbnZlcnNhdGlvbiBoYXMgYW55IHBhbmVscyBvcGVuXG4gICAgICAgIGNvbnN0IHBhbmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb252ZXJzYXRpb24gLnBhbmVsJyk7XG4gICAgICAgIGlmIChwYW5lbHMgJiYgcGFuZWxzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tbWFuZE9yQ3RybCAmJiBzaGlmdEtleSAmJiAoa2V5ID09PSAnaicgfHwga2V5ID09PSAnSicpKSB7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIHNldE9wZW4oIW9wZW4pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleWRvd24pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG4gICAgICB9O1xuICAgIH0sIFtvcGVuLCBzZXRPcGVuXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE1hbmFnZXI+XG4gICAgICAgIDxSZWZlcmVuY2U+XG4gICAgICAgICAgeyh7IHJlZiB9KSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICByZWY9e3JlZk1lcmdlcihidXR0b25SZWYsIHJlZil9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrQnV0dG9ufVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NOYW1lLCB7XG4gICAgICAgICAgICAgICAgJ21vZHVsZS1lbW9qaS1idXR0b25fX2J1dHRvbic6IHRydWUsXG4gICAgICAgICAgICAgICAgJ21vZHVsZS1lbW9qaS1idXR0b25fX2J1dHRvbi0tYWN0aXZlJzogb3BlbixcbiAgICAgICAgICAgICAgICAnbW9kdWxlLWVtb2ppLWJ1dHRvbl9fYnV0dG9uLS1oYXMtZW1vamknOiBCb29sZWFuKGVtb2ppKSxcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ0Vtb2ppQnV0dG9uX19sYWJlbCcpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZW1vamkgJiYgPEVtb2ppIGVtb2ppPXtlbW9qaX0gc2l6ZT17MjR9IC8+fVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9SZWZlcmVuY2U+XG4gICAgICAgIHtvcGVuICYmIHBvcHBlclJvb3RcbiAgICAgICAgICA/IGNyZWF0ZVBvcnRhbChcbiAgICAgICAgICAgICAgPFBvcHBlciBwbGFjZW1lbnQ9XCJ0b3Atc3RhcnRcIiBzdHJhdGVneT1cImZpeGVkXCI+XG4gICAgICAgICAgICAgICAgeyh7IHJlZiwgc3R5bGUgfSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPEVtb2ppUGlja2VyXG4gICAgICAgICAgICAgICAgICAgIHJlZj17cmVmfVxuICAgICAgICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAgICAgICAgIG9uUGlja0Vtb2ppPXtldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgb25QaWNrRW1vamkoZXYpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChjbG9zZU9uUGljaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGRvU2VuZD17ZG9TZW5kfVxuICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXtoYW5kbGVDbG9zZX1cbiAgICAgICAgICAgICAgICAgICAgc2tpblRvbmU9e3NraW5Ub25lfVxuICAgICAgICAgICAgICAgICAgICBvblNldFNraW5Ub25lPXtvblNldFNraW5Ub25lfVxuICAgICAgICAgICAgICAgICAgICByZWNlbnRFbW9qaXM9e3JlY2VudEVtb2ppc31cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9Qb3BwZXI+LFxuICAgICAgICAgICAgICBwb3BwZXJSb290XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBudWxsfVxuICAgICAgPC9NYW5hZ2VyPlxuICAgICk7XG4gIH1cbik7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsWUFBdUI7QUFFdkIsd0JBQXVCO0FBQ3ZCLG9CQUEwQjtBQUMxQiwwQkFBMkM7QUFDM0MsdUJBQTZCO0FBQzdCLG1CQUFzQjtBQUV0Qix5QkFBNEI7QUFFNUIsMEJBQTZCO0FBQzdCLHFCQUFnQztBQXFCekIsTUFBTSxjQUFjLE1BQU0sS0FDL0IsQ0FBQztBQUFBLEVBQ0M7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsTUFDVztBQUNYLFFBQU0sQ0FBQyxNQUFNLFdBQVcsTUFBTSxTQUFTLEtBQUs7QUFDNUMsUUFBTSxDQUFDLFlBQVksaUJBQWlCLE1BQU0sU0FDeEMsSUFD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
