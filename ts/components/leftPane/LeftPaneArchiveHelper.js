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
var LeftPaneArchiveHelper_exports = {};
__export(LeftPaneArchiveHelper_exports, {
  LeftPaneArchiveHelper: () => LeftPaneArchiveHelper
});
module.exports = __toCommonJS(LeftPaneArchiveHelper_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_LeftPaneHelper = require("./LeftPaneHelper");
var import_getConversationInDirection = require("./getConversationInDirection");
var import_ConversationList = require("../ConversationList");
var import_LeftPaneSearchInput = require("../LeftPaneSearchInput");
var import_LeftPaneSearchHelper = require("./LeftPaneSearchHelper");
var KeyboardLayout = __toESM(require("../../services/keyboardLayout"));
class LeftPaneArchiveHelper extends import_LeftPaneHelper.LeftPaneHelper {
  constructor(props) {
    super();
    this.archivedConversations = props.archivedConversations;
    this.searchConversation = props.searchConversation;
    this.searchTerm = props.searchTerm;
    this.startSearchCounter = props.startSearchCounter;
    if ("conversationResults" in props) {
      this.searchHelper = new import_LeftPaneSearchHelper.LeftPaneSearchHelper(props);
    }
  }
  getHeaderContents({
    i18n,
    showInbox
  }) {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-left-pane__header__contents"
    }, /* @__PURE__ */ import_react.default.createElement("button", {
      onClick: this.getBackAction({ showInbox }),
      className: "module-left-pane__header__contents__back-button",
      title: i18n("backToInbox"),
      "aria-label": i18n("backToInbox"),
      type: "button"
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-left-pane__header__contents__text"
    }, i18n("archivedConversations")));
  }
  getSearchInput({
    clearConversationSearch,
    clearSearch,
    i18n,
    updateSearchTerm,
    showConversation
  }) {
    if (!this.searchConversation) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement(import_LeftPaneSearchInput.LeftPaneSearchInput, {
      clearConversationSearch,
      clearSearch,
      i18n,
      searchConversation: this.searchConversation,
      searchTerm: this.searchTerm,
      showConversation,
      startSearchCounter: this.startSearchCounter,
      updateSearchTerm
    });
  }
  getBackAction({ showInbox }) {
    return showInbox;
  }
  getPreRowsNode({
    i18n
  }) {
    if (this.searchHelper) {
      return this.searchHelper.getPreRowsNode({ i18n });
    }
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-left-pane__archive-helper-text"
    }, this.getRowCount() > 0 ? i18n("archiveHelperText") : i18n("noArchivedConversations"));
  }
  getRowCount() {
    return this.searchHelper?.getRowCount() ?? this.archivedConversations.length;
  }
  getRow(rowIndex) {
    if (this.searchHelper) {
      return this.searchHelper.getRow(rowIndex);
    }
    const conversation = this.archivedConversations[rowIndex];
    return conversation ? {
      type: import_ConversationList.RowType.Conversation,
      conversation
    } : void 0;
  }
  getRowIndexToScrollTo(selectedConversationId) {
    if (this.searchHelper) {
      return this.searchHelper.getRowIndexToScrollTo(selectedConversationId);
    }
    if (!selectedConversationId) {
      return void 0;
    }
    const result = this.archivedConversations.findIndex((conversation) => conversation.id === selectedConversationId);
    return result === -1 ? void 0 : result;
  }
  getConversationAndMessageAtIndex(conversationIndex) {
    const { archivedConversations, searchHelper } = this;
    if (searchHelper) {
      return searchHelper.getConversationAndMessageAtIndex(conversationIndex);
    }
    const conversation = archivedConversations[conversationIndex] || (0, import_lodash.last)(archivedConversations);
    return conversation ? { conversationId: conversation.id } : void 0;
  }
  getConversationAndMessageInDirection(toFind, selectedConversationId, selectedMessageId) {
    if (this.searchHelper) {
      return this.searchHelper.getConversationAndMessageInDirection(toFind, selectedConversationId, selectedMessageId);
    }
    return (0, import_getConversationInDirection.getConversationInDirection)(this.archivedConversations, toFind, selectedConversationId);
  }
  shouldRecomputeRowHeights(old) {
    const hasSearchingChanged = "conversationResults" in old !== Boolean(this.searchHelper);
    if (hasSearchingChanged) {
      return true;
    }
    if ("conversationResults" in old && this.searchHelper) {
      return this.searchHelper.shouldRecomputeRowHeights(old);
    }
    return false;
  }
  onKeyDown(event, {
    searchInConversation,
    selectedConversationId
  }) {
    if (!selectedConversationId) {
      return;
    }
    const { ctrlKey, metaKey, shiftKey } = event;
    const commandKey = window.platform === "darwin" && metaKey;
    const controlKey = window.platform !== "darwin" && ctrlKey;
    const commandOrCtrl = commandKey || controlKey;
    const commandAndCtrl = commandKey && ctrlKey;
    const key = KeyboardLayout.lookup(event);
    if (commandOrCtrl && !commandAndCtrl && shiftKey && (key === "f" || key === "F") && this.archivedConversations.some(({ id }) => id === selectedConversationId)) {
      searchInConversation(selectedConversationId);
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LeftPaneArchiveHelper
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTGVmdFBhbmVBcmNoaXZlSGVscGVyLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHsgUmVhY3RDaGlsZCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsYXN0IH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUgeyBUb0ZpbmRUeXBlIH0gZnJvbSAnLi9MZWZ0UGFuZUhlbHBlcic7XG5pbXBvcnQgeyBMZWZ0UGFuZUhlbHBlciB9IGZyb20gJy4vTGVmdFBhbmVIZWxwZXInO1xuaW1wb3J0IHsgZ2V0Q29udmVyc2F0aW9uSW5EaXJlY3Rpb24gfSBmcm9tICcuL2dldENvbnZlcnNhdGlvbkluRGlyZWN0aW9uJztcbmltcG9ydCB0eXBlIHsgUm93IH0gZnJvbSAnLi4vQ29udmVyc2F0aW9uTGlzdCc7XG5pbXBvcnQgeyBSb3dUeXBlIH0gZnJvbSAnLi4vQ29udmVyc2F0aW9uTGlzdCc7XG5pbXBvcnQgdHlwZSB7IFByb3BzRGF0YSBhcyBDb252ZXJzYXRpb25MaXN0SXRlbVByb3BzVHlwZSB9IGZyb20gJy4uL2NvbnZlcnNhdGlvbkxpc3QvQ29udmVyc2F0aW9uTGlzdEl0ZW0nO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvblR5cGUsXG4gIFNob3dDb252ZXJzYXRpb25UeXBlLFxufSBmcm9tICcuLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IExlZnRQYW5lU2VhcmNoSW5wdXQgfSBmcm9tICcuLi9MZWZ0UGFuZVNlYXJjaElucHV0JztcbmltcG9ydCB0eXBlIHsgTGVmdFBhbmVTZWFyY2hQcm9wc1R5cGUgfSBmcm9tICcuL0xlZnRQYW5lU2VhcmNoSGVscGVyJztcbmltcG9ydCB7IExlZnRQYW5lU2VhcmNoSGVscGVyIH0gZnJvbSAnLi9MZWZ0UGFuZVNlYXJjaEhlbHBlcic7XG5pbXBvcnQgKiBhcyBLZXlib2FyZExheW91dCBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZExheW91dCc7XG5cbnR5cGUgTGVmdFBhbmVBcmNoaXZlQmFzZVByb3BzVHlwZSA9IHtcbiAgYXJjaGl2ZWRDb252ZXJzYXRpb25zOiBSZWFkb25seUFycmF5PENvbnZlcnNhdGlvbkxpc3RJdGVtUHJvcHNUeXBlPjtcbiAgc2VhcmNoQ29udmVyc2F0aW9uOiB1bmRlZmluZWQgfCBDb252ZXJzYXRpb25UeXBlO1xuICBzZWFyY2hUZXJtOiBzdHJpbmc7XG4gIHN0YXJ0U2VhcmNoQ291bnRlcjogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgTGVmdFBhbmVBcmNoaXZlUHJvcHNUeXBlID1cbiAgfCBMZWZ0UGFuZUFyY2hpdmVCYXNlUHJvcHNUeXBlXG4gIHwgKExlZnRQYW5lQXJjaGl2ZUJhc2VQcm9wc1R5cGUgJiBMZWZ0UGFuZVNlYXJjaFByb3BzVHlwZSk7XG5cbmV4cG9ydCBjbGFzcyBMZWZ0UGFuZUFyY2hpdmVIZWxwZXIgZXh0ZW5kcyBMZWZ0UGFuZUhlbHBlcjxMZWZ0UGFuZUFyY2hpdmVQcm9wc1R5cGU+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBhcmNoaXZlZENvbnZlcnNhdGlvbnM6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uTGlzdEl0ZW1Qcm9wc1R5cGU+O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VhcmNoQ29udmVyc2F0aW9uOiB1bmRlZmluZWQgfCBDb252ZXJzYXRpb25UeXBlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VhcmNoVGVybTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VhcmNoSGVscGVyOiB1bmRlZmluZWQgfCBMZWZ0UGFuZVNlYXJjaEhlbHBlcjtcblxuICBwcml2YXRlIHJlYWRvbmx5IHN0YXJ0U2VhcmNoQ291bnRlcjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBSZWFkb25seTxMZWZ0UGFuZUFyY2hpdmVQcm9wc1R5cGU+KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYXJjaGl2ZWRDb252ZXJzYXRpb25zID0gcHJvcHMuYXJjaGl2ZWRDb252ZXJzYXRpb25zO1xuICAgIHRoaXMuc2VhcmNoQ29udmVyc2F0aW9uID0gcHJvcHMuc2VhcmNoQ29udmVyc2F0aW9uO1xuICAgIHRoaXMuc2VhcmNoVGVybSA9IHByb3BzLnNlYXJjaFRlcm07XG4gICAgdGhpcy5zdGFydFNlYXJjaENvdW50ZXIgPSBwcm9wcy5zdGFydFNlYXJjaENvdW50ZXI7XG5cbiAgICBpZiAoJ2NvbnZlcnNhdGlvblJlc3VsdHMnIGluIHByb3BzKSB7XG4gICAgICB0aGlzLnNlYXJjaEhlbHBlciA9IG5ldyBMZWZ0UGFuZVNlYXJjaEhlbHBlcihwcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0SGVhZGVyQ29udGVudHMoe1xuICAgIGkxOG4sXG4gICAgc2hvd0luYm94LFxuICB9OiBSZWFkb25seTx7XG4gICAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgICBzaG93SW5ib3g6ICgpID0+IHZvaWQ7XG4gIH0+KTogUmVhY3RDaGlsZCB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWxlZnQtcGFuZV9faGVhZGVyX19jb250ZW50c1wiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5nZXRCYWNrQWN0aW9uKHsgc2hvd0luYm94IH0pfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1sZWZ0LXBhbmVfX2hlYWRlcl9fY29udGVudHNfX2JhY2stYnV0dG9uXCJcbiAgICAgICAgICB0aXRsZT17aTE4bignYmFja1RvSW5ib3gnKX1cbiAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCdiYWNrVG9JbmJveCcpfVxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1sZWZ0LXBhbmVfX2hlYWRlcl9fY29udGVudHNfX3RleHRcIj5cbiAgICAgICAgICB7aTE4bignYXJjaGl2ZWRDb252ZXJzYXRpb25zJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldFNlYXJjaElucHV0KHtcbiAgICBjbGVhckNvbnZlcnNhdGlvblNlYXJjaCxcbiAgICBjbGVhclNlYXJjaCxcbiAgICBpMThuLFxuICAgIHVwZGF0ZVNlYXJjaFRlcm0sXG4gICAgc2hvd0NvbnZlcnNhdGlvbixcbiAgfTogUmVhZG9ubHk8e1xuICAgIGNsZWFyQ29udmVyc2F0aW9uU2VhcmNoOiAoKSA9PiB1bmtub3duO1xuICAgIGNsZWFyU2VhcmNoOiAoKSA9PiB1bmtub3duO1xuICAgIGkxOG46IExvY2FsaXplclR5cGU7XG4gICAgdXBkYXRlU2VhcmNoVGVybTogKHNlYXJjaFRlcm06IHN0cmluZykgPT4gdW5rbm93bjtcbiAgICBzaG93Q29udmVyc2F0aW9uOiBTaG93Q29udmVyc2F0aW9uVHlwZTtcbiAgfT4pOiBSZWFjdENoaWxkIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLnNlYXJjaENvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxMZWZ0UGFuZVNlYXJjaElucHV0XG4gICAgICAgIGNsZWFyQ29udmVyc2F0aW9uU2VhcmNoPXtjbGVhckNvbnZlcnNhdGlvblNlYXJjaH1cbiAgICAgICAgY2xlYXJTZWFyY2g9e2NsZWFyU2VhcmNofVxuICAgICAgICBpMThuPXtpMThufVxuICAgICAgICBzZWFyY2hDb252ZXJzYXRpb249e3RoaXMuc2VhcmNoQ29udmVyc2F0aW9ufVxuICAgICAgICBzZWFyY2hUZXJtPXt0aGlzLnNlYXJjaFRlcm19XG4gICAgICAgIHNob3dDb252ZXJzYXRpb249e3Nob3dDb252ZXJzYXRpb259XG4gICAgICAgIHN0YXJ0U2VhcmNoQ291bnRlcj17dGhpcy5zdGFydFNlYXJjaENvdW50ZXJ9XG4gICAgICAgIHVwZGF0ZVNlYXJjaFRlcm09e3VwZGF0ZVNlYXJjaFRlcm19XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBvdmVycmlkZSBnZXRCYWNrQWN0aW9uKHsgc2hvd0luYm94IH06IHsgc2hvd0luYm94OiAoKSA9PiB2b2lkIH0pOiAoKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gc2hvd0luYm94O1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0UHJlUm93c05vZGUoe1xuICAgIGkxOG4sXG4gIH06IFJlYWRvbmx5PHsgaTE4bjogTG9jYWxpemVyVHlwZSB9Pik6IFJlYWN0Q2hpbGQgfCBudWxsIHtcbiAgICBpZiAodGhpcy5zZWFyY2hIZWxwZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaEhlbHBlci5nZXRQcmVSb3dzTm9kZSh7IGkxOG4gfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWxlZnQtcGFuZV9fYXJjaGl2ZS1oZWxwZXItdGV4dFwiPlxuICAgICAgICB7dGhpcy5nZXRSb3dDb3VudCgpID4gMFxuICAgICAgICAgID8gaTE4bignYXJjaGl2ZUhlbHBlclRleHQnKVxuICAgICAgICAgIDogaTE4bignbm9BcmNoaXZlZENvbnZlcnNhdGlvbnMnKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBnZXRSb3dDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnNlYXJjaEhlbHBlcj8uZ2V0Um93Q291bnQoKSA/PyB0aGlzLmFyY2hpdmVkQ29udmVyc2F0aW9ucy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgZ2V0Um93KHJvd0luZGV4OiBudW1iZXIpOiB1bmRlZmluZWQgfCBSb3cge1xuICAgIGlmICh0aGlzLnNlYXJjaEhlbHBlcikge1xuICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoSGVscGVyLmdldFJvdyhyb3dJbmRleCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gdGhpcy5hcmNoaXZlZENvbnZlcnNhdGlvbnNbcm93SW5kZXhdO1xuICAgIHJldHVybiBjb252ZXJzYXRpb25cbiAgICAgID8ge1xuICAgICAgICAgIHR5cGU6IFJvd1R5cGUuQ29udmVyc2F0aW9uLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBvdmVycmlkZSBnZXRSb3dJbmRleFRvU2Nyb2xsVG8oXG4gICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZDogdW5kZWZpbmVkIHwgc3RyaW5nXG4gICk6IHVuZGVmaW5lZCB8IG51bWJlciB7XG4gICAgaWYgKHRoaXMuc2VhcmNoSGVscGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hIZWxwZXIuZ2V0Um93SW5kZXhUb1Njcm9sbFRvKHNlbGVjdGVkQ29udmVyc2F0aW9uSWQpO1xuICAgIH1cblxuICAgIGlmICghc2VsZWN0ZWRDb252ZXJzYXRpb25JZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcmNoaXZlZENvbnZlcnNhdGlvbnMuZmluZEluZGV4KFxuICAgICAgY29udmVyc2F0aW9uID0+IGNvbnZlcnNhdGlvbi5pZCA9PT0gc2VsZWN0ZWRDb252ZXJzYXRpb25JZFxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gLTEgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cblxuICBnZXRDb252ZXJzYXRpb25BbmRNZXNzYWdlQXRJbmRleChcbiAgICBjb252ZXJzYXRpb25JbmRleDogbnVtYmVyXG4gICk6IHVuZGVmaW5lZCB8IHsgY29udmVyc2F0aW9uSWQ6IHN0cmluZyB9IHtcbiAgICBjb25zdCB7IGFyY2hpdmVkQ29udmVyc2F0aW9ucywgc2VhcmNoSGVscGVyIH0gPSB0aGlzO1xuXG4gICAgaWYgKHNlYXJjaEhlbHBlcikge1xuICAgICAgcmV0dXJuIHNlYXJjaEhlbHBlci5nZXRDb252ZXJzYXRpb25BbmRNZXNzYWdlQXRJbmRleChjb252ZXJzYXRpb25JbmRleCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID1cbiAgICAgIGFyY2hpdmVkQ29udmVyc2F0aW9uc1tjb252ZXJzYXRpb25JbmRleF0gfHwgbGFzdChhcmNoaXZlZENvbnZlcnNhdGlvbnMpO1xuICAgIHJldHVybiBjb252ZXJzYXRpb24gPyB7IGNvbnZlcnNhdGlvbklkOiBjb252ZXJzYXRpb24uaWQgfSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldENvbnZlcnNhdGlvbkFuZE1lc3NhZ2VJbkRpcmVjdGlvbihcbiAgICB0b0ZpbmQ6IFJlYWRvbmx5PFRvRmluZFR5cGU+LFxuICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQ6IHVuZGVmaW5lZCB8IHN0cmluZyxcbiAgICBzZWxlY3RlZE1lc3NhZ2VJZDogdW5rbm93blxuICApOiB1bmRlZmluZWQgfCB7IGNvbnZlcnNhdGlvbklkOiBzdHJpbmcgfSB7XG4gICAgaWYgKHRoaXMuc2VhcmNoSGVscGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hIZWxwZXIuZ2V0Q29udmVyc2F0aW9uQW5kTWVzc2FnZUluRGlyZWN0aW9uKFxuICAgICAgICB0b0ZpbmQsXG4gICAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQsXG4gICAgICAgIHNlbGVjdGVkTWVzc2FnZUlkXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRDb252ZXJzYXRpb25JbkRpcmVjdGlvbihcbiAgICAgIHRoaXMuYXJjaGl2ZWRDb252ZXJzYXRpb25zLFxuICAgICAgdG9GaW5kLFxuICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZFxuICAgICk7XG4gIH1cblxuICBzaG91bGRSZWNvbXB1dGVSb3dIZWlnaHRzKG9sZDogUmVhZG9ubHk8TGVmdFBhbmVBcmNoaXZlUHJvcHNUeXBlPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGhhc1NlYXJjaGluZ0NoYW5nZWQgPVxuICAgICAgJ2NvbnZlcnNhdGlvblJlc3VsdHMnIGluIG9sZCAhPT0gQm9vbGVhbih0aGlzLnNlYXJjaEhlbHBlcik7XG4gICAgaWYgKGhhc1NlYXJjaGluZ0NoYW5nZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICgnY29udmVyc2F0aW9uUmVzdWx0cycgaW4gb2xkICYmIHRoaXMuc2VhcmNoSGVscGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hIZWxwZXIuc2hvdWxkUmVjb21wdXRlUm93SGVpZ2h0cyhvbGQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIG9uS2V5RG93bihcbiAgICBldmVudDogS2V5Ym9hcmRFdmVudCxcbiAgICB7XG4gICAgICBzZWFyY2hJbkNvbnZlcnNhdGlvbixcbiAgICAgIHNlbGVjdGVkQ29udmVyc2F0aW9uSWQsXG4gICAgfTogUmVhZG9ubHk8e1xuICAgICAgc2VhcmNoSW5Db252ZXJzYXRpb246IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICAgICAgc2VsZWN0ZWRDb252ZXJzYXRpb25JZDogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICAgIH0+XG4gICk6IHZvaWQge1xuICAgIGlmICghc2VsZWN0ZWRDb252ZXJzYXRpb25JZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgY3RybEtleSwgbWV0YUtleSwgc2hpZnRLZXkgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGNvbW1hbmRLZXkgPSB3aW5kb3cucGxhdGZvcm0gPT09ICdkYXJ3aW4nICYmIG1ldGFLZXk7XG4gICAgY29uc3QgY29udHJvbEtleSA9IHdpbmRvdy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicgJiYgY3RybEtleTtcbiAgICBjb25zdCBjb21tYW5kT3JDdHJsID0gY29tbWFuZEtleSB8fCBjb250cm9sS2V5O1xuICAgIGNvbnN0IGNvbW1hbmRBbmRDdHJsID0gY29tbWFuZEtleSAmJiBjdHJsS2V5O1xuICAgIGNvbnN0IGtleSA9IEtleWJvYXJkTGF5b3V0Lmxvb2t1cChldmVudCk7XG5cbiAgICBpZiAoXG4gICAgICBjb21tYW5kT3JDdHJsICYmXG4gICAgICAhY29tbWFuZEFuZEN0cmwgJiZcbiAgICAgIHNoaWZ0S2V5ICYmXG4gICAgICAoa2V5ID09PSAnZicgfHwga2V5ID09PSAnRicpICYmXG4gICAgICB0aGlzLmFyY2hpdmVkQ29udmVyc2F0aW9ucy5zb21lKCh7IGlkIH0pID0+IGlkID09PSBzZWxlY3RlZENvbnZlcnNhdGlvbklkKVxuICAgICkge1xuICAgICAgc2VhcmNoSW5Db252ZXJzYXRpb24oc2VsZWN0ZWRDb252ZXJzYXRpb25JZCk7XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxtQkFBa0I7QUFDbEIsb0JBQXFCO0FBR3JCLDRCQUErQjtBQUMvQix3Q0FBMkM7QUFFM0MsOEJBQXdCO0FBT3hCLGlDQUFvQztBQUVwQyxrQ0FBcUM7QUFDckMscUJBQWdDO0FBYXpCLE1BQU0sOEJBQThCLHFDQUF5QztBQUFBLEVBV2xGLFlBQVksT0FBMkM7QUFDckQsVUFBTTtBQUVOLFNBQUssd0JBQXdCLE1BQU07QUFDbkMsU0FBSyxxQkFBcUIsTUFBTTtBQUNoQyxTQUFLLGFBQWEsTUFBTTtBQUN4QixTQUFLLHFCQUFxQixNQUFNO0FBRWhDLFFBQUkseUJBQXlCLE9BQU87QUFDbEMsV0FBSyxlQUFlLElBQUksaURBQXFCLEtBQUs7QUFBQSxJQUNw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
