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
var CompositionInput_exports = {};
__export(CompositionInput_exports, {
  CompositionInput: () => CompositionInput
});
module.exports = __toCommonJS(CompositionInput_exports);
var React = __toESM(require("react"));
var import_quill_delta = __toESM(require("quill-delta"));
var import_react_quill = __toESM(require("react-quill"));
var import_classnames = __toESM(require("classnames"));
var import_react_popper = require("react-popper");
var import_quill = __toESM(require("quill"));
var import_completion = require("../quill/mentions/completion");
var import_emoji = require("../quill/emoji");
var import_lib = require("./emoji/lib");
var import_UUID = require("../types/UUID");
var import_blot = require("../quill/mentions/blot");
var import_matchers = require("../quill/emoji/matchers");
var import_matchers2 = require("../quill/mentions/matchers");
var import_memberRepository = require("../quill/memberRepository");
var import_util = require("../quill/util");
var import_signal_clipboard = require("../quill/signal-clipboard");
var import_blot2 = require("../quill/block/blot");
var import_getClassNamesFor = require("../util/getClassNamesFor");
var log = __toESM(require("../logging/log"));
import_quill.default.register("formats/emoji", import_emoji.EmojiBlot);
import_quill.default.register("formats/mention", import_blot.MentionBlot);
import_quill.default.register("formats/block", import_blot2.DirectionalBlot);
import_quill.default.register("modules/emojiCompletion", import_emoji.EmojiCompletion);
import_quill.default.register("modules/mentionCompletion", import_completion.MentionCompletion);
import_quill.default.register("modules/signalClipboard", import_signal_clipboard.SignalClipboard);
const MAX_LENGTH = 64 * 1024;
const BASE_CLASS_NAME = "module-composition-input";
function CompositionInput(props) {
  const {
    children,
    i18n,
    disabled,
    large,
    inputApi,
    moduleClassName,
    onPickEmoji,
    onSubmit,
    placeholder,
    skinTone,
    draftText,
    draftBodyRanges,
    getPreferredBadge,
    getQuotedMessage,
    clearQuotedMessage,
    sortedGroupMembers,
    theme
  } = props;
  const [emojiCompletionElement, setEmojiCompletionElement] = React.useState();
  const [lastSelectionRange, setLastSelectionRange] = React.useState(null);
  const [mentionCompletionElement, setMentionCompletionElement] = React.useState();
  const emojiCompletionRef = React.useRef();
  const mentionCompletionRef = React.useRef();
  const quillRef = React.useRef();
  const scrollerRef = React.useRef(null);
  const propsRef = React.useRef(props);
  const canSendRef = React.useRef(false);
  const memberRepositoryRef = React.useRef(new import_memberRepository.MemberRepository());
  const generateDelta = /* @__PURE__ */ __name((text, bodyRanges) => {
    const initialOps = [{ insert: text }];
    const opsWithMentions = (0, import_util.insertMentionOps)(initialOps, bodyRanges);
    const opsWithEmojis = (0, import_util.insertEmojiOps)(opsWithMentions);
    return new import_quill_delta.default(opsWithEmojis);
  }, "generateDelta");
  const getTextAndMentions = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return ["", []];
    }
    const contents = quill.getContents();
    if (contents === void 0) {
      return ["", []];
    }
    const { ops } = contents;
    if (ops === void 0) {
      return ["", []];
    }
    return (0, import_util.getTextAndMentionsFromOps)(ops);
  }, "getTextAndMentions");
  const focus = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    quill.focus();
  }, "focus");
  const insertEmoji = /* @__PURE__ */ __name((e) => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    const range = quill.getSelection();
    const insertionRange = range || lastSelectionRange;
    if (insertionRange === null) {
      return;
    }
    const emoji = (0, import_lib.convertShortName)(e.shortName, e.skinTone);
    const delta = new import_quill_delta.default().retain(insertionRange.index).delete(insertionRange.length).insert({ emoji });
    quill.updateContents(delta, "user");
    quill.setSelection(insertionRange.index + 1, 0, "user");
  }, "insertEmoji");
  const reset = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    canSendRef.current = true;
    quill.setText("");
    const historyModule = quill.getModule("history");
    if (historyModule === void 0) {
      return;
    }
    historyModule.clear();
  }, "reset");
  const resetEmojiResults = /* @__PURE__ */ __name(() => {
    const emojiCompletion = emojiCompletionRef.current;
    if (emojiCompletion === void 0) {
      return;
    }
    emojiCompletion.reset();
  }, "resetEmojiResults");
  const submit = /* @__PURE__ */ __name(() => {
    const timestamp = Date.now();
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    if (!canSendRef.current) {
      log.warn("CompositionInput: Not submitting message - cannot send right now");
      return;
    }
    const [text, mentions] = getTextAndMentions();
    log.info(`CompositionInput: Submitting message ${timestamp} with ${mentions.length} mentions`);
    canSendRef.current = false;
    onSubmit(text, mentions, timestamp);
  }, "submit");
  if (inputApi) {
    inputApi.current = {
      focus,
      insertEmoji,
      reset,
      resetEmojiResults,
      submit
    };
  }
  React.useEffect(() => {
    propsRef.current = props;
  }, [props]);
  React.useEffect(() => {
    canSendRef.current = !disabled;
  }, [disabled]);
  const onShortKeyEnter = /* @__PURE__ */ __name(() => {
    submit();
    return false;
  }, "onShortKeyEnter");
  const onEnter = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    const emojiCompletion = emojiCompletionRef.current;
    const mentionCompletion = mentionCompletionRef.current;
    if (quill === void 0) {
      return false;
    }
    if (emojiCompletion === void 0 || mentionCompletion === void 0) {
      return false;
    }
    if (emojiCompletion.results.length) {
      emojiCompletion.completeEmoji();
      return false;
    }
    if (mentionCompletion.results.length) {
      mentionCompletion.completeMention();
      return false;
    }
    if (propsRef.current.large) {
      return true;
    }
    submit();
    return false;
  }, "onEnter");
  const onTab = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    const emojiCompletion = emojiCompletionRef.current;
    const mentionCompletion = mentionCompletionRef.current;
    if (quill === void 0) {
      return false;
    }
    if (emojiCompletion === void 0 || mentionCompletion === void 0) {
      return false;
    }
    if (emojiCompletion.results.length) {
      emojiCompletion.completeEmoji();
      return false;
    }
    if (mentionCompletion.results.length) {
      mentionCompletion.completeMention();
      return false;
    }
    return true;
  }, "onTab");
  const onEscape = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return false;
    }
    const emojiCompletion = emojiCompletionRef.current;
    const mentionCompletion = mentionCompletionRef.current;
    if (emojiCompletion) {
      if (emojiCompletion.results.length) {
        emojiCompletion.reset();
        return false;
      }
    }
    if (mentionCompletion) {
      if (mentionCompletion.results.length) {
        mentionCompletion.clearResults();
        return false;
      }
    }
    if (getQuotedMessage?.()) {
      clearQuotedMessage?.();
      return false;
    }
    return true;
  }, "onEscape");
  const onBackspace = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return true;
    }
    const selection = quill.getSelection();
    if (!selection || selection.length > 0) {
      return true;
    }
    const [blotToDelete] = quill.getLeaf(selection.index);
    if (!(0, import_util.isMentionBlot)(blotToDelete)) {
      return true;
    }
    const contents = quill.getContents(0, selection.index - 1);
    const restartDelta = (0, import_util.getDeltaToRestartMention)(contents.ops);
    quill.updateContents(restartDelta);
    quill.setSelection(selection.index, 0);
    return false;
  }, "onBackspace");
  const onChange = /* @__PURE__ */ __name(() => {
    const quill = quillRef.current;
    const [text, mentions] = getTextAndMentions();
    if (quill !== void 0) {
      const historyModule = quill.getModule("history");
      if (text.length > MAX_LENGTH) {
        historyModule.undo();
        propsRef.current.onTextTooLong();
        return;
      }
      const { onEditorStateChange } = propsRef.current;
      if (onEditorStateChange) {
        setTimeout(() => {
          const selection = quill.getSelection();
          onEditorStateChange(text, mentions, selection ? selection.index : void 0);
        }, 0);
      }
    }
    if (propsRef.current.onDirtyChange) {
      propsRef.current.onDirtyChange(text.length > 0);
    }
  }, "onChange");
  React.useEffect(() => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    quill.enable(!disabled);
    quill.focus();
  }, [disabled]);
  React.useEffect(() => {
    const emojiCompletion = emojiCompletionRef.current;
    if (emojiCompletion === void 0 || skinTone === void 0) {
      return;
    }
    emojiCompletion.options.skinTone = skinTone;
  }, [skinTone]);
  React.useEffect(() => () => {
    const emojiCompletion = emojiCompletionRef.current;
    const mentionCompletion = mentionCompletionRef.current;
    if (emojiCompletion !== void 0) {
      emojiCompletion.destroy();
    }
    if (mentionCompletion !== void 0) {
      mentionCompletion.destroy();
    }
  }, []);
  const removeStaleMentions = /* @__PURE__ */ __name((currentMembers) => {
    const quill = quillRef.current;
    if (quill === void 0) {
      return;
    }
    const { ops } = quill.getContents();
    if (ops === void 0) {
      return;
    }
    const currentMemberUuids = currentMembers.map((m) => m.uuid).filter(import_UUID.isValidUuid);
    const newDelta = (0, import_util.getDeltaToRemoveStaleMentions)(ops, currentMemberUuids);
    quill.updateContents(newDelta);
  }, "removeStaleMentions");
  const memberIds = sortedGroupMembers ? sortedGroupMembers.map((m) => m.id) : [];
  React.useEffect(() => {
    memberRepositoryRef.current.updateMembers(sortedGroupMembers || []);
    removeStaleMentions(sortedGroupMembers || []);
  }, [JSON.stringify(memberIds)]);
  const unstaleCallbacks = {
    onBackspace,
    onChange,
    onEnter,
    onEscape,
    onPickEmoji,
    onShortKeyEnter,
    onTab
  };
  const callbacksRef = React.useRef(unstaleCallbacks);
  callbacksRef.current = unstaleCallbacks;
  const reactQuill = React.useMemo(() => {
    const delta = generateDelta(draftText || "", draftBodyRanges || []);
    return /* @__PURE__ */ React.createElement(import_react_quill.default, {
      className: `${BASE_CLASS_NAME}__quill`,
      onChange: () => callbacksRef.current.onChange(),
      defaultValue: delta,
      modules: {
        toolbar: false,
        signalClipboard: true,
        clipboard: {
          matchers: [
            ["IMG", import_matchers.matchEmojiImage],
            ["IMG", import_matchers.matchEmojiBlot],
            ["SPAN", import_matchers.matchReactEmoji],
            [Node.TEXT_NODE, import_matchers.matchEmojiText],
            ["SPAN", (0, import_matchers2.matchMention)(memberRepositoryRef)]
          ]
        },
        keyboard: {
          bindings: {
            onEnter: {
              key: 13,
              handler: () => callbacksRef.current.onEnter()
            },
            onShortKeyEnter: {
              key: 13,
              shortKey: true,
              handler: () => callbacksRef.current.onShortKeyEnter()
            },
            onEscape: {
              key: 27,
              handler: () => callbacksRef.current.onEscape()
            },
            onBackspace: {
              key: 8,
              handler: () => callbacksRef.current.onBackspace()
            }
          }
        },
        emojiCompletion: {
          setEmojiPickerElement: setEmojiCompletionElement,
          onPickEmoji: (emoji) => callbacksRef.current.onPickEmoji(emoji),
          skinTone
        },
        mentionCompletion: {
          getPreferredBadge,
          me: sortedGroupMembers ? sortedGroupMembers.find((foo) => foo.isMe) : void 0,
          memberRepositoryRef,
          setMentionPickerElement: setMentionCompletionElement,
          i18n,
          theme
        }
      },
      formats: ["emoji", "mention"],
      placeholder: placeholder || i18n("sendMessage"),
      readOnly: disabled,
      ref: (element) => {
        if (element) {
          const quill = element.getEditor();
          const keyboard = quill.getModule("keyboard");
          keyboard.bindings[9].unshift({
            key: 9,
            handler: () => callbacksRef.current.onTab()
          });
          keyboard.bindings[9].pop();
          quill.once("editor-change", () => {
            const scroller = scrollerRef.current;
            if (scroller !== null) {
              quill.scrollingContainer = scroller;
            }
            setTimeout(() => {
              quill.setSelection(quill.getLength(), 0);
              quill.root.classList.add("ql-editor--loaded");
            }, 0);
          });
          quill.on("selection-change", (newRange, oldRange) => {
            if (newRange === null) {
              setLastSelectionRange(oldRange);
            }
          });
          quillRef.current = quill;
          emojiCompletionRef.current = quill.getModule("emojiCompletion");
          mentionCompletionRef.current = quill.getModule("mentionCompletion");
        }
      }
    });
  }, []);
  const getClassName = (0, import_getClassNamesFor.getClassNamesFor)(BASE_CLASS_NAME, moduleClassName);
  return /* @__PURE__ */ React.createElement(import_react_popper.Manager, null, /* @__PURE__ */ React.createElement(import_react_popper.Reference, null, ({ ref }) => /* @__PURE__ */ React.createElement("div", {
    className: getClassName("__input"),
    ref
  }, /* @__PURE__ */ React.createElement("div", {
    ref: scrollerRef,
    onClick: focus,
    className: (0, import_classnames.default)(getClassName("__input__scroller"), large ? getClassName("__input__scroller--large") : null, children ? getClassName("__input--with-children") : null)
  }, children, reactQuill, emojiCompletionElement, mentionCompletionElement))));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompositionInput
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29tcG9zaXRpb25JbnB1dC50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBEZWx0YSBmcm9tICdxdWlsbC1kZWx0YSc7XG5pbXBvcnQgUmVhY3RRdWlsbCBmcm9tICdyZWFjdC1xdWlsbCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IE1hbmFnZXIsIFJlZmVyZW5jZSB9IGZyb20gJ3JlYWN0LXBvcHBlcic7XG5pbXBvcnQgdHlwZSB7IEtleWJvYXJkU3RhdGljLCBSYW5nZVN0YXRpYyB9IGZyb20gJ3F1aWxsJztcbmltcG9ydCBRdWlsbCBmcm9tICdxdWlsbCc7XG5cbmltcG9ydCB7IE1lbnRpb25Db21wbGV0aW9uIH0gZnJvbSAnLi4vcXVpbGwvbWVudGlvbnMvY29tcGxldGlvbic7XG5pbXBvcnQgeyBFbW9qaUJsb3QsIEVtb2ppQ29tcGxldGlvbiB9IGZyb20gJy4uL3F1aWxsL2Vtb2ppJztcbmltcG9ydCB0eXBlIHsgRW1vamlQaWNrRGF0YVR5cGUgfSBmcm9tICcuL2Vtb2ppL0Vtb2ppUGlja2VyJztcbmltcG9ydCB7IGNvbnZlcnRTaG9ydE5hbWUgfSBmcm9tICcuL2Vtb2ppL2xpYic7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIEJvZHlSYW5nZVR5cGUsIFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlIH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQgeyBpc1ZhbGlkVXVpZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgTWVudGlvbkJsb3QgfSBmcm9tICcuLi9xdWlsbC9tZW50aW9ucy9ibG90JztcbmltcG9ydCB7XG4gIG1hdGNoRW1vamlJbWFnZSxcbiAgbWF0Y2hFbW9qaUJsb3QsXG4gIG1hdGNoUmVhY3RFbW9qaSxcbiAgbWF0Y2hFbW9qaVRleHQsXG59IGZyb20gJy4uL3F1aWxsL2Vtb2ppL21hdGNoZXJzJztcbmltcG9ydCB7IG1hdGNoTWVudGlvbiB9IGZyb20gJy4uL3F1aWxsL21lbnRpb25zL21hdGNoZXJzJztcbmltcG9ydCB7IE1lbWJlclJlcG9zaXRvcnkgfSBmcm9tICcuLi9xdWlsbC9tZW1iZXJSZXBvc2l0b3J5JztcbmltcG9ydCB7XG4gIGdldERlbHRhVG9SZW1vdmVTdGFsZU1lbnRpb25zLFxuICBnZXRUZXh0QW5kTWVudGlvbnNGcm9tT3BzLFxuICBpc01lbnRpb25CbG90LFxuICBnZXREZWx0YVRvUmVzdGFydE1lbnRpb24sXG4gIGluc2VydE1lbnRpb25PcHMsXG4gIGluc2VydEVtb2ppT3BzLFxufSBmcm9tICcuLi9xdWlsbC91dGlsJztcbmltcG9ydCB7IFNpZ25hbENsaXBib2FyZCB9IGZyb20gJy4uL3F1aWxsL3NpZ25hbC1jbGlwYm9hcmQnO1xuaW1wb3J0IHsgRGlyZWN0aW9uYWxCbG90IH0gZnJvbSAnLi4vcXVpbGwvYmxvY2svYmxvdCc7XG5pbXBvcnQgeyBnZXRDbGFzc05hbWVzRm9yIH0gZnJvbSAnLi4vdXRpbC9nZXRDbGFzc05hbWVzRm9yJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5cblF1aWxsLnJlZ2lzdGVyKCdmb3JtYXRzL2Vtb2ppJywgRW1vamlCbG90KTtcblF1aWxsLnJlZ2lzdGVyKCdmb3JtYXRzL21lbnRpb24nLCBNZW50aW9uQmxvdCk7XG5RdWlsbC5yZWdpc3RlcignZm9ybWF0cy9ibG9jaycsIERpcmVjdGlvbmFsQmxvdCk7XG5RdWlsbC5yZWdpc3RlcignbW9kdWxlcy9lbW9qaUNvbXBsZXRpb24nLCBFbW9qaUNvbXBsZXRpb24pO1xuUXVpbGwucmVnaXN0ZXIoJ21vZHVsZXMvbWVudGlvbkNvbXBsZXRpb24nLCBNZW50aW9uQ29tcGxldGlvbik7XG5RdWlsbC5yZWdpc3RlcignbW9kdWxlcy9zaWduYWxDbGlwYm9hcmQnLCBTaWduYWxDbGlwYm9hcmQpO1xuXG50eXBlIEhpc3RvcnlTdGF0aWMgPSB7XG4gIHVuZG8oKTogdm9pZDtcbiAgY2xlYXIoKTogdm9pZDtcbn07XG5cbmV4cG9ydCB0eXBlIElucHV0QXBpID0ge1xuICBmb2N1czogKCkgPT4gdm9pZDtcbiAgaW5zZXJ0RW1vamk6IChlOiBFbW9qaVBpY2tEYXRhVHlwZSkgPT4gdm9pZDtcbiAgcmVzZXQ6ICgpID0+IHZvaWQ7XG4gIHJlc2V0RW1vamlSZXN1bHRzOiAoKSA9PiB2b2lkO1xuICBzdWJtaXQ6ICgpID0+IHZvaWQ7XG59O1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IHtcbiAgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGU7XG4gIHJlYWRvbmx5IGkxOG46IExvY2FsaXplclR5cGU7XG4gIHJlYWRvbmx5IGRpc2FibGVkPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgZ2V0UHJlZmVycmVkQmFkZ2U6IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlO1xuICByZWFkb25seSBsYXJnZT86IGJvb2xlYW47XG4gIHJlYWRvbmx5IGlucHV0QXBpPzogUmVhY3QuTXV0YWJsZVJlZk9iamVjdDxJbnB1dEFwaSB8IHVuZGVmaW5lZD47XG4gIHJlYWRvbmx5IHNraW5Ub25lPzogRW1vamlQaWNrRGF0YVR5cGVbJ3NraW5Ub25lJ107XG4gIHJlYWRvbmx5IGRyYWZ0VGV4dD86IHN0cmluZztcbiAgcmVhZG9ubHkgZHJhZnRCb2R5UmFuZ2VzPzogQXJyYXk8Qm9keVJhbmdlVHlwZT47XG4gIHJlYWRvbmx5IG1vZHVsZUNsYXNzTmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgdGhlbWU6IFRoZW1lVHlwZTtcbiAgcmVhZG9ubHkgcGxhY2Vob2xkZXI/OiBzdHJpbmc7XG4gIHNvcnRlZEdyb3VwTWVtYmVycz86IEFycmF5PENvbnZlcnNhdGlvblR5cGU+O1xuICBvbkRpcnR5Q2hhbmdlPyhkaXJ0eTogYm9vbGVhbik6IHVua25vd247XG4gIG9uRWRpdG9yU3RhdGVDaGFuZ2U/KFxuICAgIG1lc3NhZ2VUZXh0OiBzdHJpbmcsXG4gICAgYm9keVJhbmdlczogQXJyYXk8Qm9keVJhbmdlVHlwZT4sXG4gICAgY2FyZXRMb2NhdGlvbj86IG51bWJlclxuICApOiB1bmtub3duO1xuICBvblRleHRUb29Mb25nKCk6IHVua25vd247XG4gIG9uUGlja0Vtb2ppKG86IEVtb2ppUGlja0RhdGFUeXBlKTogdW5rbm93bjtcbiAgb25TdWJtaXQoXG4gICAgbWVzc2FnZTogc3RyaW5nLFxuICAgIG1lbnRpb25zOiBBcnJheTxCb2R5UmFuZ2VUeXBlPixcbiAgICB0aW1lc3RhbXA6IG51bWJlclxuICApOiB1bmtub3duO1xuICBnZXRRdW90ZWRNZXNzYWdlPygpOiB1bmtub3duO1xuICBjbGVhclF1b3RlZE1lc3NhZ2U/KCk6IHVua25vd247XG59O1xuXG5jb25zdCBNQVhfTEVOR1RIID0gNjQgKiAxMDI0O1xuY29uc3QgQkFTRV9DTEFTU19OQU1FID0gJ21vZHVsZS1jb21wb3NpdGlvbi1pbnB1dCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21wb3NpdGlvbklucHV0KHByb3BzOiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IHtcbiAgICBjaGlsZHJlbixcbiAgICBpMThuLFxuICAgIGRpc2FibGVkLFxuICAgIGxhcmdlLFxuICAgIGlucHV0QXBpLFxuICAgIG1vZHVsZUNsYXNzTmFtZSxcbiAgICBvblBpY2tFbW9qaSxcbiAgICBvblN1Ym1pdCxcbiAgICBwbGFjZWhvbGRlcixcbiAgICBza2luVG9uZSxcbiAgICBkcmFmdFRleHQsXG4gICAgZHJhZnRCb2R5UmFuZ2VzLFxuICAgIGdldFByZWZlcnJlZEJhZGdlLFxuICAgIGdldFF1b3RlZE1lc3NhZ2UsXG4gICAgY2xlYXJRdW90ZWRNZXNzYWdlLFxuICAgIHNvcnRlZEdyb3VwTWVtYmVycyxcbiAgICB0aGVtZSxcbiAgfSA9IHByb3BzO1xuXG4gIGNvbnN0IFtlbW9qaUNvbXBsZXRpb25FbGVtZW50LCBzZXRFbW9qaUNvbXBsZXRpb25FbGVtZW50XSA9XG4gICAgUmVhY3QudXNlU3RhdGU8SlNYLkVsZW1lbnQ+KCk7XG4gIGNvbnN0IFtsYXN0U2VsZWN0aW9uUmFuZ2UsIHNldExhc3RTZWxlY3Rpb25SYW5nZV0gPVxuICAgIFJlYWN0LnVzZVN0YXRlPFJhbmdlU3RhdGljIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFttZW50aW9uQ29tcGxldGlvbkVsZW1lbnQsIHNldE1lbnRpb25Db21wbGV0aW9uRWxlbWVudF0gPVxuICAgIFJlYWN0LnVzZVN0YXRlPEpTWC5FbGVtZW50PigpO1xuXG4gIGNvbnN0IGVtb2ppQ29tcGxldGlvblJlZiA9IFJlYWN0LnVzZVJlZjxFbW9qaUNvbXBsZXRpb24+KCk7XG4gIGNvbnN0IG1lbnRpb25Db21wbGV0aW9uUmVmID0gUmVhY3QudXNlUmVmPE1lbnRpb25Db21wbGV0aW9uPigpO1xuICBjb25zdCBxdWlsbFJlZiA9IFJlYWN0LnVzZVJlZjxRdWlsbD4oKTtcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSBSZWFjdC51c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBwcm9wc1JlZiA9IFJlYWN0LnVzZVJlZjxQcm9wcz4ocHJvcHMpO1xuICBjb25zdCBjYW5TZW5kUmVmID0gUmVhY3QudXNlUmVmPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgbWVtYmVyUmVwb3NpdG9yeVJlZiA9IFJlYWN0LnVzZVJlZjxNZW1iZXJSZXBvc2l0b3J5PihcbiAgICBuZXcgTWVtYmVyUmVwb3NpdG9yeSgpXG4gICk7XG5cbiAgY29uc3QgZ2VuZXJhdGVEZWx0YSA9IChcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgYm9keVJhbmdlczogQXJyYXk8Qm9keVJhbmdlVHlwZT5cbiAgKTogRGVsdGEgPT4ge1xuICAgIGNvbnN0IGluaXRpYWxPcHMgPSBbeyBpbnNlcnQ6IHRleHQgfV07XG4gICAgY29uc3Qgb3BzV2l0aE1lbnRpb25zID0gaW5zZXJ0TWVudGlvbk9wcyhpbml0aWFsT3BzLCBib2R5UmFuZ2VzKTtcbiAgICBjb25zdCBvcHNXaXRoRW1vamlzID0gaW5zZXJ0RW1vamlPcHMob3BzV2l0aE1lbnRpb25zKTtcblxuICAgIHJldHVybiBuZXcgRGVsdGEob3BzV2l0aEVtb2ppcyk7XG4gIH07XG5cbiAgY29uc3QgZ2V0VGV4dEFuZE1lbnRpb25zID0gKCk6IFtzdHJpbmcsIEFycmF5PEJvZHlSYW5nZVR5cGU+XSA9PiB7XG4gICAgY29uc3QgcXVpbGwgPSBxdWlsbFJlZi5jdXJyZW50O1xuXG4gICAgaWYgKHF1aWxsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBbJycsIFtdXTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50cyA9IHF1aWxsLmdldENvbnRlbnRzKCk7XG5cbiAgICBpZiAoY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFsnJywgW11dO1xuICAgIH1cblxuICAgIGNvbnN0IHsgb3BzIH0gPSBjb250ZW50cztcblxuICAgIGlmIChvcHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFsnJywgW11dO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRUZXh0QW5kTWVudGlvbnNGcm9tT3BzKG9wcyk7XG4gIH07XG5cbiAgY29uc3QgZm9jdXMgPSAoKSA9PiB7XG4gICAgY29uc3QgcXVpbGwgPSBxdWlsbFJlZi5jdXJyZW50O1xuXG4gICAgaWYgKHF1aWxsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBxdWlsbC5mb2N1cygpO1xuICB9O1xuXG4gIGNvbnN0IGluc2VydEVtb2ppID0gKGU6IEVtb2ppUGlja0RhdGFUeXBlKSA9PiB7XG4gICAgY29uc3QgcXVpbGwgPSBxdWlsbFJlZi5jdXJyZW50O1xuXG4gICAgaWYgKHF1aWxsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByYW5nZSA9IHF1aWxsLmdldFNlbGVjdGlvbigpO1xuXG4gICAgY29uc3QgaW5zZXJ0aW9uUmFuZ2UgPSByYW5nZSB8fCBsYXN0U2VsZWN0aW9uUmFuZ2U7XG4gICAgaWYgKGluc2VydGlvblJhbmdlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZW1vamkgPSBjb252ZXJ0U2hvcnROYW1lKGUuc2hvcnROYW1lLCBlLnNraW5Ub25lKTtcblxuICAgIGNvbnN0IGRlbHRhID0gbmV3IERlbHRhKClcbiAgICAgIC5yZXRhaW4oaW5zZXJ0aW9uUmFuZ2UuaW5kZXgpXG4gICAgICAuZGVsZXRlKGluc2VydGlvblJhbmdlLmxlbmd0aClcbiAgICAgIC5pbnNlcnQoeyBlbW9qaSB9KTtcblxuICAgIHF1aWxsLnVwZGF0ZUNvbnRlbnRzKGRlbHRhLCAndXNlcicpO1xuICAgIHF1aWxsLnNldFNlbGVjdGlvbihpbnNlcnRpb25SYW5nZS5pbmRleCArIDEsIDAsICd1c2VyJyk7XG4gIH07XG5cbiAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgY29uc3QgcXVpbGwgPSBxdWlsbFJlZi5jdXJyZW50O1xuXG4gICAgaWYgKHF1aWxsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYW5TZW5kUmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIHF1aWxsLnNldFRleHQoJycpO1xuXG4gICAgY29uc3QgaGlzdG9yeU1vZHVsZSA9IHF1aWxsLmdldE1vZHVsZSgnaGlzdG9yeScpO1xuXG4gICAgaWYgKGhpc3RvcnlNb2R1bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhpc3RvcnlNb2R1bGUuY2xlYXIoKTtcbiAgfTtcblxuICBjb25zdCByZXNldEVtb2ppUmVzdWx0cyA9ICgpID0+IHtcbiAgICBjb25zdCBlbW9qaUNvbXBsZXRpb24gPSBlbW9qaUNvbXBsZXRpb25SZWYuY3VycmVudDtcblxuICAgIGlmIChlbW9qaUNvbXBsZXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVtb2ppQ29tcGxldGlvbi5yZXNldCgpO1xuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdCA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFjYW5TZW5kUmVmLmN1cnJlbnQpIHtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICAnQ29tcG9zaXRpb25JbnB1dDogTm90IHN1Ym1pdHRpbmcgbWVzc2FnZSAtIGNhbm5vdCBzZW5kIHJpZ2h0IG5vdydcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgW3RleHQsIG1lbnRpb25zXSA9IGdldFRleHRBbmRNZW50aW9ucygpO1xuXG4gICAgbG9nLmluZm8oXG4gICAgICBgQ29tcG9zaXRpb25JbnB1dDogU3VibWl0dGluZyBtZXNzYWdlICR7dGltZXN0YW1wfSB3aXRoICR7bWVudGlvbnMubGVuZ3RofSBtZW50aW9uc2BcbiAgICApO1xuICAgIGNhblNlbmRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIG9uU3VibWl0KHRleHQsIG1lbnRpb25zLCB0aW1lc3RhbXApO1xuICB9O1xuXG4gIGlmIChpbnB1dEFwaSkge1xuICAgIGlucHV0QXBpLmN1cnJlbnQgPSB7XG4gICAgICBmb2N1cyxcbiAgICAgIGluc2VydEVtb2ppLFxuICAgICAgcmVzZXQsXG4gICAgICByZXNldEVtb2ppUmVzdWx0cyxcbiAgICAgIHN1Ym1pdCxcbiAgICB9O1xuICB9XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBwcm9wc1JlZi5jdXJyZW50ID0gcHJvcHM7XG4gIH0sIFtwcm9wc10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY2FuU2VuZFJlZi5jdXJyZW50ID0gIWRpc2FibGVkO1xuICB9LCBbZGlzYWJsZWRdKTtcblxuICBjb25zdCBvblNob3J0S2V5RW50ZXIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgc3VibWl0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IG9uRW50ZXIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgcXVpbGwgPSBxdWlsbFJlZi5jdXJyZW50O1xuICAgIGNvbnN0IGVtb2ppQ29tcGxldGlvbiA9IGVtb2ppQ29tcGxldGlvblJlZi5jdXJyZW50O1xuICAgIGNvbnN0IG1lbnRpb25Db21wbGV0aW9uID0gbWVudGlvbkNvbXBsZXRpb25SZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGVtb2ppQ29tcGxldGlvbiA9PT0gdW5kZWZpbmVkIHx8IG1lbnRpb25Db21wbGV0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZW1vamlDb21wbGV0aW9uLnJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICBlbW9qaUNvbXBsZXRpb24uY29tcGxldGVFbW9qaSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChtZW50aW9uQ29tcGxldGlvbi5yZXN1bHRzLmxlbmd0aCkge1xuICAgICAgbWVudGlvbkNvbXBsZXRpb24uY29tcGxldGVNZW50aW9uKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzUmVmLmN1cnJlbnQubGFyZ2UpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IG9uVGFiID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcbiAgICBjb25zdCBlbW9qaUNvbXBsZXRpb24gPSBlbW9qaUNvbXBsZXRpb25SZWYuY3VycmVudDtcbiAgICBjb25zdCBtZW50aW9uQ29tcGxldGlvbiA9IG1lbnRpb25Db21wbGV0aW9uUmVmLmN1cnJlbnQ7XG5cbiAgICBpZiAocXVpbGwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChlbW9qaUNvbXBsZXRpb24gPT09IHVuZGVmaW5lZCB8fCBtZW50aW9uQ29tcGxldGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGVtb2ppQ29tcGxldGlvbi5yZXN1bHRzLmxlbmd0aCkge1xuICAgICAgZW1vamlDb21wbGV0aW9uLmNvbXBsZXRlRW1vamkoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobWVudGlvbkNvbXBsZXRpb24ucmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgIG1lbnRpb25Db21wbGV0aW9uLmNvbXBsZXRlTWVudGlvbigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IG9uRXNjYXBlID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZW1vamlDb21wbGV0aW9uID0gZW1vamlDb21wbGV0aW9uUmVmLmN1cnJlbnQ7XG4gICAgY29uc3QgbWVudGlvbkNvbXBsZXRpb24gPSBtZW50aW9uQ29tcGxldGlvblJlZi5jdXJyZW50O1xuXG4gICAgaWYgKGVtb2ppQ29tcGxldGlvbikge1xuICAgICAgaWYgKGVtb2ppQ29tcGxldGlvbi5yZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICBlbW9qaUNvbXBsZXRpb24ucmVzZXQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtZW50aW9uQ29tcGxldGlvbikge1xuICAgICAgaWYgKG1lbnRpb25Db21wbGV0aW9uLnJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnRpb25Db21wbGV0aW9uLmNsZWFyUmVzdWx0cygpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGdldFF1b3RlZE1lc3NhZ2U/LigpKSB7XG4gICAgICBjbGVhclF1b3RlZE1lc3NhZ2U/LigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IG9uQmFja3NwYWNlID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSBxdWlsbC5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoIXNlbGVjdGlvbiB8fCBzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgW2Jsb3RUb0RlbGV0ZV0gPSBxdWlsbC5nZXRMZWFmKHNlbGVjdGlvbi5pbmRleCk7XG4gICAgaWYgKCFpc01lbnRpb25CbG90KGJsb3RUb0RlbGV0ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRlbnRzID0gcXVpbGwuZ2V0Q29udGVudHMoMCwgc2VsZWN0aW9uLmluZGV4IC0gMSk7XG4gICAgY29uc3QgcmVzdGFydERlbHRhID0gZ2V0RGVsdGFUb1Jlc3RhcnRNZW50aW9uKGNvbnRlbnRzLm9wcyk7XG5cbiAgICBxdWlsbC51cGRhdGVDb250ZW50cyhyZXN0YXJ0RGVsdGEpO1xuICAgIHF1aWxsLnNldFNlbGVjdGlvbihzZWxlY3Rpb24uaW5kZXgsIDApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2hhbmdlID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGNvbnN0IFt0ZXh0LCBtZW50aW9uc10gPSBnZXRUZXh0QW5kTWVudGlvbnMoKTtcblxuICAgIGlmIChxdWlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBoaXN0b3J5TW9kdWxlOiBIaXN0b3J5U3RhdGljID0gcXVpbGwuZ2V0TW9kdWxlKCdoaXN0b3J5Jyk7XG5cbiAgICAgIGlmICh0ZXh0Lmxlbmd0aCA+IE1BWF9MRU5HVEgpIHtcbiAgICAgICAgaGlzdG9yeU1vZHVsZS51bmRvKCk7XG4gICAgICAgIHByb3BzUmVmLmN1cnJlbnQub25UZXh0VG9vTG9uZygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgb25FZGl0b3JTdGF0ZUNoYW5nZSB9ID0gcHJvcHNSZWYuY3VycmVudDtcblxuICAgICAgaWYgKG9uRWRpdG9yU3RhdGVDaGFuZ2UpIHtcbiAgICAgICAgLy8gYGdldFNlbGVjdGlvbmAgaW5zaWRlIHRoZSBgb25DaGFuZ2VgIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSB0aGVcbiAgICAgICAgLy8gc2VsZWN0aW9uIHZhbHVlIF9iZWZvcmVfIHRoZSBjaGFuZ2Ugb2NjdXJzLiBgc2V0VGltZW91dGAgMCBoZXJlIHdpbGxcbiAgICAgICAgLy8gbGV0IGBnZXRTZWxlY3Rpb25gIHJldHVybiB0aGUgc2VsZWN0aW9uIGFmdGVyIHRoZSBjaGFuZ2UgdGFrZXMgcGxhY2UuXG4gICAgICAgIC8vIHRoaXMgaXMgbmVjZXNzYXJ5IGZvciBgbWF5YmVHcmFiTGlua1ByZXZpZXdgIGFzIGl0IG5lZWRzIHRoZSBjb3JyZWN0XG4gICAgICAgIC8vIGBjYXJldExvY2F0aW9uYCBmcm9tIHRoZSBwb3N0LWNoYW5nZSBzZWxlY3Rpb24gaW5kZXggdmFsdWUuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHF1aWxsLmdldFNlbGVjdGlvbigpO1xuXG4gICAgICAgICAgb25FZGl0b3JTdGF0ZUNoYW5nZShcbiAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICBtZW50aW9ucyxcbiAgICAgICAgICAgIHNlbGVjdGlvbiA/IHNlbGVjdGlvbi5pbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICAgICk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wc1JlZi5jdXJyZW50Lm9uRGlydHlDaGFuZ2UpIHtcbiAgICAgIHByb3BzUmVmLmN1cnJlbnQub25EaXJ0eUNoYW5nZSh0ZXh0Lmxlbmd0aCA+IDApO1xuICAgIH1cbiAgfTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcXVpbGwuZW5hYmxlKCFkaXNhYmxlZCk7XG4gICAgcXVpbGwuZm9jdXMoKTtcbiAgfSwgW2Rpc2FibGVkXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBlbW9qaUNvbXBsZXRpb24gPSBlbW9qaUNvbXBsZXRpb25SZWYuY3VycmVudDtcblxuICAgIGlmIChlbW9qaUNvbXBsZXRpb24gPT09IHVuZGVmaW5lZCB8fCBza2luVG9uZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZW1vamlDb21wbGV0aW9uLm9wdGlvbnMuc2tpblRvbmUgPSBza2luVG9uZTtcbiAgfSwgW3NraW5Ub25lXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KFxuICAgICgpID0+ICgpID0+IHtcbiAgICAgIGNvbnN0IGVtb2ppQ29tcGxldGlvbiA9IGVtb2ppQ29tcGxldGlvblJlZi5jdXJyZW50O1xuICAgICAgY29uc3QgbWVudGlvbkNvbXBsZXRpb24gPSBtZW50aW9uQ29tcGxldGlvblJlZi5jdXJyZW50O1xuXG4gICAgICBpZiAoZW1vamlDb21wbGV0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZW1vamlDb21wbGV0aW9uLmRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lbnRpb25Db21wbGV0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWVudGlvbkNvbXBsZXRpb24uZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW11cbiAgKTtcblxuICBjb25zdCByZW1vdmVTdGFsZU1lbnRpb25zID0gKGN1cnJlbnRNZW1iZXJzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPikgPT4ge1xuICAgIGNvbnN0IHF1aWxsID0gcXVpbGxSZWYuY3VycmVudDtcblxuICAgIGlmIChxdWlsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBvcHMgfSA9IHF1aWxsLmdldENvbnRlbnRzKCk7XG4gICAgaWYgKG9wcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudE1lbWJlclV1aWRzID0gY3VycmVudE1lbWJlcnNcbiAgICAgIC5tYXAobSA9PiBtLnV1aWQpXG4gICAgICAuZmlsdGVyKGlzVmFsaWRVdWlkKTtcblxuICAgIGNvbnN0IG5ld0RlbHRhID0gZ2V0RGVsdGFUb1JlbW92ZVN0YWxlTWVudGlvbnMob3BzLCBjdXJyZW50TWVtYmVyVXVpZHMpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBxdWlsbC51cGRhdGVDb250ZW50cyhuZXdEZWx0YSBhcyBhbnkpO1xuICB9O1xuXG4gIGNvbnN0IG1lbWJlcklkcyA9IHNvcnRlZEdyb3VwTWVtYmVycyA/IHNvcnRlZEdyb3VwTWVtYmVycy5tYXAobSA9PiBtLmlkKSA6IFtdO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbWVtYmVyUmVwb3NpdG9yeVJlZi5jdXJyZW50LnVwZGF0ZU1lbWJlcnMoc29ydGVkR3JvdXBNZW1iZXJzIHx8IFtdKTtcbiAgICByZW1vdmVTdGFsZU1lbnRpb25zKHNvcnRlZEdyb3VwTWVtYmVycyB8fCBbXSk7XG4gICAgLy8gV2UgYXJlIHN0aWxsIGRlcGVuZGluZyBvbiBtZW1iZXJzLCBidXQgRVNMaW50IGNhbid0IHRlbGxcbiAgICAvLyBDb21wYXJpbmcgdGhlIGFjdHVhbCBtZW1iZXJzIGxpc3QgZG9lcyBub3Qgd29yayBmb3IgYSBjb3VwbGUgcmVhc29uczpcbiAgICAvLyAgICAqIEFycmF5cyB3aXRoIHRoZSBzYW1lIG9iamVjdHMgYXJlIG5vdCBcImVxdWFsXCIgdG8gUmVhY3RcbiAgICAvLyAgICAqIFdlIG9ubHkgY2FyZSBhYm91dCBhZGRlZC9yZW1vdmVkIG1lbWJlcnMsIGlnbm9yaW5nIG90aGVyIGF0dHJpYnV0ZXNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtKU09OLnN0cmluZ2lmeShtZW1iZXJJZHMpXSk7XG5cbiAgLy8gUGxhY2luZyBhbGwgb2YgdGhlc2UgY2FsbGJhY2tzIGluc2lkZSBvZiBhIHJlZiBzaW5jZSBRdWlsbCBpcyBub3QgYWJsZVxuICAvLyB0byByZS1yZW5kZXIuIFdlIHdhbnQgdG8gbWFrZSBzdXJlIHRoYXQgYWxsIHRoZXNlIGNhbGxiYWNrcyBhcmUgZnJlc2hcbiAgLy8gc28gdGhhdCB0aGUgY29uc3VtZXJzIG9mIHRoaXMgY29tcG9uZW50IHdvbid0IGRlYWwgd2l0aCBzdGFsZSBwcm9wcyBvclxuICAvLyBzdGFsZSBzdGF0ZSBhcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlbS5cbiAgY29uc3QgdW5zdGFsZUNhbGxiYWNrcyA9IHtcbiAgICBvbkJhY2tzcGFjZSxcbiAgICBvbkNoYW5nZSxcbiAgICBvbkVudGVyLFxuICAgIG9uRXNjYXBlLFxuICAgIG9uUGlja0Vtb2ppLFxuICAgIG9uU2hvcnRLZXlFbnRlcixcbiAgICBvblRhYixcbiAgfTtcbiAgY29uc3QgY2FsbGJhY2tzUmVmID0gUmVhY3QudXNlUmVmKHVuc3RhbGVDYWxsYmFja3MpO1xuICBjYWxsYmFja3NSZWYuY3VycmVudCA9IHVuc3RhbGVDYWxsYmFja3M7XG5cbiAgY29uc3QgcmVhY3RRdWlsbCA9IFJlYWN0LnVzZU1lbW8oXG4gICAgKCkgPT4ge1xuICAgICAgY29uc3QgZGVsdGEgPSBnZW5lcmF0ZURlbHRhKGRyYWZ0VGV4dCB8fCAnJywgZHJhZnRCb2R5UmFuZ2VzIHx8IFtdKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJlYWN0UXVpbGxcbiAgICAgICAgICBjbGFzc05hbWU9e2Ake0JBU0VfQ0xBU1NfTkFNRX1fX3F1aWxsYH1cbiAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gY2FsbGJhY2tzUmVmLmN1cnJlbnQub25DaGFuZ2UoKX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e2RlbHRhfVxuICAgICAgICAgIG1vZHVsZXM9e3tcbiAgICAgICAgICAgIHRvb2xiYXI6IGZhbHNlLFxuICAgICAgICAgICAgc2lnbmFsQ2xpcGJvYXJkOiB0cnVlLFxuICAgICAgICAgICAgY2xpcGJvYXJkOiB7XG4gICAgICAgICAgICAgIG1hdGNoZXJzOiBbXG4gICAgICAgICAgICAgICAgWydJTUcnLCBtYXRjaEVtb2ppSW1hZ2VdLFxuICAgICAgICAgICAgICAgIFsnSU1HJywgbWF0Y2hFbW9qaUJsb3RdLFxuICAgICAgICAgICAgICAgIFsnU1BBTicsIG1hdGNoUmVhY3RFbW9qaV0sXG4gICAgICAgICAgICAgICAgW05vZGUuVEVYVF9OT0RFLCBtYXRjaEVtb2ppVGV4dF0sXG4gICAgICAgICAgICAgICAgWydTUEFOJywgbWF0Y2hNZW50aW9uKG1lbWJlclJlcG9zaXRvcnlSZWYpXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBrZXlib2FyZDoge1xuICAgICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIG9uRW50ZXI6IHtcbiAgICAgICAgICAgICAgICAgIGtleTogMTMsXG4gICAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiBjYWxsYmFja3NSZWYuY3VycmVudC5vbkVudGVyKCksXG4gICAgICAgICAgICAgICAgfSwgLy8gMTMgPSBFbnRlclxuICAgICAgICAgICAgICAgIG9uU2hvcnRLZXlFbnRlcjoge1xuICAgICAgICAgICAgICAgICAga2V5OiAxMywgLy8gMTMgPSBFbnRlclxuICAgICAgICAgICAgICAgICAgc2hvcnRLZXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiBjYWxsYmFja3NSZWYuY3VycmVudC5vblNob3J0S2V5RW50ZXIoKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uRXNjYXBlOiB7XG4gICAgICAgICAgICAgICAgICBrZXk6IDI3LFxuICAgICAgICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4gY2FsbGJhY2tzUmVmLmN1cnJlbnQub25Fc2NhcGUoKSxcbiAgICAgICAgICAgICAgICB9LCAvLyAyNyA9IEVzY2FwZVxuICAgICAgICAgICAgICAgIG9uQmFja3NwYWNlOiB7XG4gICAgICAgICAgICAgICAgICBrZXk6IDgsXG4gICAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiBjYWxsYmFja3NSZWYuY3VycmVudC5vbkJhY2tzcGFjZSgpLFxuICAgICAgICAgICAgICAgIH0sIC8vIDggPSBCYWNrc3BhY2VcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbW9qaUNvbXBsZXRpb246IHtcbiAgICAgICAgICAgICAgc2V0RW1vamlQaWNrZXJFbGVtZW50OiBzZXRFbW9qaUNvbXBsZXRpb25FbGVtZW50LFxuICAgICAgICAgICAgICBvblBpY2tFbW9qaTogKGVtb2ppOiBFbW9qaVBpY2tEYXRhVHlwZSkgPT5cbiAgICAgICAgICAgICAgICBjYWxsYmFja3NSZWYuY3VycmVudC5vblBpY2tFbW9qaShlbW9qaSksXG4gICAgICAgICAgICAgIHNraW5Ub25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbnRpb25Db21wbGV0aW9uOiB7XG4gICAgICAgICAgICAgIGdldFByZWZlcnJlZEJhZGdlLFxuICAgICAgICAgICAgICBtZTogc29ydGVkR3JvdXBNZW1iZXJzXG4gICAgICAgICAgICAgICAgPyBzb3J0ZWRHcm91cE1lbWJlcnMuZmluZChmb28gPT4gZm9vLmlzTWUpXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIG1lbWJlclJlcG9zaXRvcnlSZWYsXG4gICAgICAgICAgICAgIHNldE1lbnRpb25QaWNrZXJFbGVtZW50OiBzZXRNZW50aW9uQ29tcGxldGlvbkVsZW1lbnQsXG4gICAgICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgICAgIHRoZW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIGZvcm1hdHM9e1snZW1vamknLCAnbWVudGlvbiddfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlciB8fCBpMThuKCdzZW5kTWVzc2FnZScpfVxuICAgICAgICAgIHJlYWRPbmx5PXtkaXNhYmxlZH1cbiAgICAgICAgICByZWY9e2VsZW1lbnQgPT4ge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgcXVpbGwgPSBlbGVtZW50LmdldEVkaXRvcigpO1xuICAgICAgICAgICAgICBjb25zdCBrZXlib2FyZCA9IHF1aWxsLmdldE1vZHVsZSgna2V5Ym9hcmQnKSBhcyBLZXlib2FyZFN0YXRpYztcblxuICAgICAgICAgICAgICAvLyBmb3JjZSB0aGUgdGFiIGhhbmRsZXIgdG8gYmUgcHJlcGVuZGVkLCBvdGhlcndpc2UgaXQgd29uJ3QgYmVcbiAgICAgICAgICAgICAgLy8gZXhlY3V0ZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlsbGpzL3F1aWxsL2lzc3Vlcy8xOTY3XG4gICAgICAgICAgICAgIGtleWJvYXJkLmJpbmRpbmdzWzldLnVuc2hpZnQoe1xuICAgICAgICAgICAgICAgIGtleTogOSxcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiAoKSA9PiBjYWxsYmFja3NSZWYuY3VycmVudC5vblRhYigpLFxuICAgICAgICAgICAgICB9KTsgLy8gOSA9IFRhYlxuICAgICAgICAgICAgICAvLyBhbHNvLCByZW1vdmUgdGhlIGRlZmF1bHQgXFx0IGluc2VydGlvbiBiaW5kaW5nXG4gICAgICAgICAgICAgIGtleWJvYXJkLmJpbmRpbmdzWzldLnBvcCgpO1xuXG4gICAgICAgICAgICAgIC8vIFdoZW4gbG9hZGluZyBhIG11bHRpLWxpbmUgbWVzc2FnZSBvdXQgb2YgYSBkcmFmdCwgdGhlIGN1cnNvclxuICAgICAgICAgICAgICAvLyBwb3NpdGlvbiBuZWVkcyB0byBiZSBwdXNoZWQgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgbWFudWFsbHkuXG4gICAgICAgICAgICAgIHF1aWxsLm9uY2UoJ2VkaXRvci1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2Nyb2xsZXIgPSBzY3JvbGxlclJlZi5jdXJyZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBxdWlsbC5zY3JvbGxpbmdDb250YWluZXIgPSBzY3JvbGxlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHF1aWxsLnNldFNlbGVjdGlvbihxdWlsbC5nZXRMZW5ndGgoKSwgMCk7XG4gICAgICAgICAgICAgICAgICBxdWlsbC5yb290LmNsYXNzTGlzdC5hZGQoJ3FsLWVkaXRvci0tbG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHF1aWxsLm9uKFxuICAgICAgICAgICAgICAgICdzZWxlY3Rpb24tY2hhbmdlJyxcbiAgICAgICAgICAgICAgICAobmV3UmFuZ2U6IFJhbmdlU3RhdGljLCBvbGRSYW5nZTogUmFuZ2VTdGF0aWMpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGxvc2UgZm9jdXMsIHN0b3JlIHRoZSBsYXN0IGVkaXQgcG9pbnQgZm9yIGVtb2ppIGluc2VydGlvblxuICAgICAgICAgICAgICAgICAgaWYgKG5ld1JhbmdlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldExhc3RTZWxlY3Rpb25SYW5nZShvbGRSYW5nZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBxdWlsbFJlZi5jdXJyZW50ID0gcXVpbGw7XG4gICAgICAgICAgICAgIGVtb2ppQ29tcGxldGlvblJlZi5jdXJyZW50ID0gcXVpbGwuZ2V0TW9kdWxlKCdlbW9qaUNvbXBsZXRpb24nKTtcbiAgICAgICAgICAgICAgbWVudGlvbkNvbXBsZXRpb25SZWYuY3VycmVudCA9XG4gICAgICAgICAgICAgICAgcXVpbGwuZ2V0TW9kdWxlKCdtZW50aW9uQ29tcGxldGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sXG4gICAgLy8gcXVpbGwgc2hvdWxkbid0IHJlLXJlbmRlciwgYWxsIGNoYW5nZXMgc2hvdWxkIHRha2UgcGxhY2UgZXhjbHVzaXZlbHlcbiAgICAvLyB0aHJvdWdoIG11dGF0aW5nIHRoZSBxdWlsbCBzdGF0ZSBkaXJlY3RseSBpbnN0ZWFkIG9mIHRocm91Z2ggcHJvcHNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgW11cbiAgKTtcblxuICAvLyBUaGUgb25DbGljayBoYW5kbGVyIGJlbG93IGlzIG9ubHkgdG8gbWFrZSBpdCBlYXNpZXIgZm9yIG1vdXNlIHVzZXJzIHRvIGZvY3VzIHRoZVxuICAvLyAgIG1lc3NhZ2UgYm94LiBJbiAnbGFyZ2UnIG1vZGUsIHRoZSBhY3R1YWwgUXVpbGwgdGV4dCBib3ggY2FuIGJlIG9uZSBsaW5lIHdoaWxlIHRoZVxuICAvLyAgIHZpc3VhbCB0ZXh0IGJveCBpcyBtdWNoIGxhcmdlci4gQ2xpY2tpbmcgdGhhdCBzaG91bGQgYWxsb3cgeW91IHRvIHN0YXJ0IHR5cGluZyxcbiAgLy8gICBoZW5jZSB0aGUgY2xpY2sgaGFuZGxlci5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgLyogZXNsaW50LWRpc2FibGUganN4LWExMXkvY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cywganN4LWExMXkvbm8tc3RhdGljLWVsZW1lbnQtaW50ZXJhY3Rpb25zICovXG5cbiAgY29uc3QgZ2V0Q2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lc0ZvcihCQVNFX0NMQVNTX05BTUUsIG1vZHVsZUNsYXNzTmFtZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TWFuYWdlcj5cbiAgICAgIDxSZWZlcmVuY2U+XG4gICAgICAgIHsoeyByZWYgfSkgPT4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtnZXRDbGFzc05hbWUoJ19faW5wdXQnKX0gcmVmPXtyZWZ9PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICByZWY9e3Njcm9sbGVyUmVmfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtmb2N1c31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgIGdldENsYXNzTmFtZSgnX19pbnB1dF9fc2Nyb2xsZXInKSxcbiAgICAgICAgICAgICAgICBsYXJnZSA/IGdldENsYXNzTmFtZSgnX19pbnB1dF9fc2Nyb2xsZXItLWxhcmdlJykgOiBudWxsLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID8gZ2V0Q2xhc3NOYW1lKCdfX2lucHV0LS13aXRoLWNoaWxkcmVuJykgOiBudWxsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAge3JlYWN0UXVpbGx9XG4gICAgICAgICAgICAgIHtlbW9qaUNvbXBsZXRpb25FbGVtZW50fVxuICAgICAgICAgICAgICB7bWVudGlvbkNvbXBsZXRpb25FbGVtZW50fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L1JlZmVyZW5jZT5cbiAgICA8L01hbmFnZXI+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsWUFBdUI7QUFFdkIseUJBQWtCO0FBQ2xCLHlCQUF1QjtBQUN2Qix3QkFBdUI7QUFDdkIsMEJBQW1DO0FBRW5DLG1CQUFrQjtBQUVsQix3QkFBa0M7QUFDbEMsbUJBQTJDO0FBRTNDLGlCQUFpQztBQUlqQyxrQkFBNEI7QUFDNUIsa0JBQTRCO0FBQzVCLHNCQUtPO0FBQ1AsdUJBQTZCO0FBQzdCLDhCQUFpQztBQUNqQyxrQkFPTztBQUNQLDhCQUFnQztBQUNoQyxtQkFBZ0M7QUFDaEMs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
