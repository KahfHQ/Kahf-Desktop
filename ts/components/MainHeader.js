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
var MainHeader_exports = {};
__export(MainHeader_exports, {
  MainHeader: () => MainHeader
});
module.exports = __toCommonJS(MainHeader_exports);
var import_react = __toESM(require("react"));
var import_react_popper = require("react-popper");
var import_react_dom = require("react-dom");
var import_Whisper = require("../shims/Whisper");
var import_Avatar = require("./Avatar");
var import_AvatarPopup = require("./AvatarPopup");
class MainHeader extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.containerRef = import_react.default.createRef();
    this.handleOutsideClick = /* @__PURE__ */ __name(({ target }) => {
      const { popperRoot, showingAvatarPopup } = this.state;
      if (showingAvatarPopup && popperRoot && !popperRoot.contains(target) && !this.containerRef.current?.contains(target)) {
        this.hideAvatarPopup();
      }
    }, "handleOutsideClick");
    this.showAvatarPopup = /* @__PURE__ */ __name(() => {
      const popperRoot = document.createElement("div");
      document.body.appendChild(popperRoot);
      this.setState({
        showingAvatarPopup: true,
        popperRoot
      });
      document.addEventListener("click", this.handleOutsideClick);
    }, "showAvatarPopup");
    this.hideAvatarPopup = /* @__PURE__ */ __name(() => {
      const { popperRoot } = this.state;
      document.removeEventListener("click", this.handleOutsideClick);
      this.setState({
        showingAvatarPopup: false,
        popperRoot: null
      });
      if (popperRoot && document.body.contains(popperRoot)) {
        document.body.removeChild(popperRoot);
      }
    }, "hideAvatarPopup");
    this.handleGlobalKeyDown = /* @__PURE__ */ __name((event) => {
      const { showingAvatarPopup } = this.state;
      const { key } = event;
      if (showingAvatarPopup && key === "Escape") {
        this.hideAvatarPopup();
      }
    }, "handleGlobalKeyDown");
    this.state = {
      showingAvatarPopup: false,
      popperRoot: null
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleGlobalKeyDown);
  }
  componentWillUnmount() {
    const { popperRoot } = this.state;
    document.removeEventListener("click", this.handleOutsideClick);
    document.removeEventListener("keydown", this.handleGlobalKeyDown);
    if (popperRoot && document.body.contains(popperRoot)) {
      document.body.removeChild(popperRoot);
    }
  }
  render() {
    const {
      areStoriesEnabled,
      avatarPath,
      badge,
      color,
      hasPendingUpdate,
      i18n,
      name,
      phoneNumber,
      profileName,
      showArchivedConversations,
      startComposing,
      startUpdate,
      theme,
      title,
      toggleProfileEditor,
      toggleStoriesView,
      unreadStoriesCount
    } = this.props;
    const { showingAvatarPopup, popperRoot } = this.state;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-main-header"
    }, /* @__PURE__ */ import_react.default.createElement(import_react_popper.Manager, null, /* @__PURE__ */ import_react.default.createElement(import_react_popper.Reference, null, ({ ref }) => /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-main-header__avatar--container",
      ref: this.containerRef
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: true,
      avatarPath,
      badge,
      className: "module-main-header__avatar",
      color,
      conversationType: "direct",
      i18n,
      isMe: true,
      name,
      phoneNumber,
      profileName,
      theme,
      title,
      sharedGroupNames: [],
      size: 28,
      innerRef: ref,
      onClick: this.showAvatarPopup
    }), hasPendingUpdate && /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-main-header__avatar--badged"
    }))), showingAvatarPopup && popperRoot ? (0, import_react_dom.createPortal)(/* @__PURE__ */ import_react.default.createElement(import_react_popper.Popper, {
      placement: "bottom-end"
    }, ({ ref, style }) => /* @__PURE__ */ import_react.default.createElement(import_AvatarPopup.AvatarPopup, {
      acceptedMessageRequest: true,
      badge,
      innerRef: ref,
      i18n,
      isMe: true,
      style: { ...style, zIndex: 10 },
      color,
      conversationType: "direct",
      name,
      phoneNumber,
      profileName,
      theme,
      title,
      avatarPath,
      size: 28,
      hasPendingUpdate,
      startUpdate,
      sharedGroupNames: [],
      onEditProfile: () => {
        toggleProfileEditor();
        this.hideAvatarPopup();
      },
      onViewPreferences: () => {
        (0, import_Whisper.showSettings)();
        this.hideAvatarPopup();
      },
      onViewArchive: () => {
        showArchivedConversations();
        this.hideAvatarPopup();
      }
    })), popperRoot) : null), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-main-header__icon-container"
    }, areStoriesEnabled && /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("stories"),
      className: "module-main-header__stories-icon",
      onClick: toggleStoriesView,
      title: i18n("stories"),
      type: "button"
    }, unreadStoriesCount ? /* @__PURE__ */ import_react.default.createElement("span", {
      className: "module-main-header__stories-badge"
    }, unreadStoriesCount) : void 0), /* @__PURE__ */ import_react.default.createElement("button", {
      "aria-label": i18n("newConversation"),
      className: "module-main-header__compose-icon",
      onClick: startComposing,
      title: i18n("newConversation"),
      type: "button"
    })));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MainHeader
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWFpbkhlYWRlci50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgTWFuYWdlciwgUG9wcGVyLCBSZWZlcmVuY2UgfSBmcm9tICdyZWFjdC1wb3BwZXInO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IHsgc2hvd1NldHRpbmdzIH0gZnJvbSAnLi4vc2hpbXMvV2hpc3Blcic7XG5pbXBvcnQgeyBBdmF0YXIgfSBmcm9tICcuL0F2YXRhcic7XG5pbXBvcnQgeyBBdmF0YXJQb3B1cCB9IGZyb20gJy4vQXZhdGFyUG9wdXAnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlLCBUaGVtZVR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgQXZhdGFyQ29sb3JUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQ29sb3JzJztcbmltcG9ydCB0eXBlIHsgQmFkZ2VUeXBlIH0gZnJvbSAnLi4vYmFkZ2VzL3R5cGVzJztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBhcmVTdG9yaWVzRW5hYmxlZDogYm9vbGVhbjtcbiAgYXZhdGFyUGF0aD86IHN0cmluZztcbiAgYmFkZ2U/OiBCYWRnZVR5cGU7XG4gIGNvbG9yPzogQXZhdGFyQ29sb3JUeXBlO1xuICBoYXNQZW5kaW5nVXBkYXRlOiBib29sZWFuO1xuICBpMThuOiBMb2NhbGl6ZXJUeXBlO1xuICBpc01lPzogYm9vbGVhbjtcbiAgaXNWZXJpZmllZD86IGJvb2xlYW47XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHBob25lTnVtYmVyPzogc3RyaW5nO1xuICBwcm9maWxlTmFtZT86IHN0cmluZztcbiAgdGhlbWU6IFRoZW1lVHlwZTtcbiAgdGl0bGU6IHN0cmluZztcbiAgdW5yZWFkU3Rvcmllc0NvdW50OiBudW1iZXI7XG5cbiAgc2hvd0FyY2hpdmVkQ29udmVyc2F0aW9uczogKCkgPT4gdm9pZDtcbiAgc3RhcnRDb21wb3Npbmc6ICgpID0+IHZvaWQ7XG4gIHN0YXJ0VXBkYXRlOiAoKSA9PiB1bmtub3duO1xuICB0b2dnbGVQcm9maWxlRWRpdG9yOiAoKSA9PiB2b2lkO1xuICB0b2dnbGVTdG9yaWVzVmlldzogKCkgPT4gdW5rbm93bjtcbn07XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICBzaG93aW5nQXZhdGFyUG9wdXA6IGJvb2xlYW47XG4gIHBvcHBlclJvb3Q6IEhUTUxEaXZFbGVtZW50IHwgbnVsbDtcbn07XG5cbmV4cG9ydCBjbGFzcyBNYWluSGVhZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XG4gIHB1YmxpYyBjb250YWluZXJSZWY6IFJlYWN0LlJlZk9iamVjdDxIVE1MRGl2RWxlbWVudD4gPSBSZWFjdC5jcmVhdGVSZWYoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNob3dpbmdBdmF0YXJQb3B1cDogZmFsc2UsXG4gICAgICBwb3BwZXJSb290OiBudWxsLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlT3V0c2lkZUNsaWNrID0gKHsgdGFyZ2V0IH06IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IHBvcHBlclJvb3QsIHNob3dpbmdBdmF0YXJQb3B1cCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChcbiAgICAgIHNob3dpbmdBdmF0YXJQb3B1cCAmJlxuICAgICAgcG9wcGVyUm9vdCAmJlxuICAgICAgIXBvcHBlclJvb3QuY29udGFpbnModGFyZ2V0IGFzIE5vZGUpICYmXG4gICAgICAhdGhpcy5jb250YWluZXJSZWYuY3VycmVudD8uY29udGFpbnModGFyZ2V0IGFzIE5vZGUpXG4gICAgKSB7XG4gICAgICB0aGlzLmhpZGVBdmF0YXJQb3B1cCgpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgc2hvd0F2YXRhclBvcHVwID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHBvcHBlclJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHBlclJvb3QpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93aW5nQXZhdGFyUG9wdXA6IHRydWUsXG4gICAgICBwb3BwZXJSb290LFxuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2spO1xuICB9O1xuXG4gIHB1YmxpYyBoaWRlQXZhdGFyUG9wdXAgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgeyBwb3BwZXJSb290IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljayk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNob3dpbmdBdmF0YXJQb3B1cDogZmFsc2UsXG4gICAgICBwb3BwZXJSb290OiBudWxsLFxuICAgIH0pO1xuXG4gICAgaWYgKHBvcHBlclJvb3QgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhwb3BwZXJSb290KSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwb3BwZXJSb290KTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG92ZXJyaWRlIGNvbXBvbmVudERpZE1vdW50KCk6IHZvaWQge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUdsb2JhbEtleURvd24pO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGNvbXBvbmVudFdpbGxVbm1vdW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgcG9wcGVyUm9vdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2spO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUdsb2JhbEtleURvd24pO1xuXG4gICAgaWYgKHBvcHBlclJvb3QgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhwb3BwZXJSb290KSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwb3BwZXJSb290KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlR2xvYmFsS2V5RG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgc2hvd2luZ0F2YXRhclBvcHVwIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsga2V5IH0gPSBldmVudDtcblxuICAgIGlmIChzaG93aW5nQXZhdGFyUG9wdXAgJiYga2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdGhpcy5oaWRlQXZhdGFyUG9wdXAoKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG92ZXJyaWRlIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XG4gICAgY29uc3Qge1xuICAgICAgYXJlU3Rvcmllc0VuYWJsZWQsXG4gICAgICBhdmF0YXJQYXRoLFxuICAgICAgYmFkZ2UsXG4gICAgICBjb2xvcixcbiAgICAgIGhhc1BlbmRpbmdVcGRhdGUsXG4gICAgICBpMThuLFxuICAgICAgbmFtZSxcbiAgICAgIHBob25lTnVtYmVyLFxuICAgICAgcHJvZmlsZU5hbWUsXG4gICAgICBzaG93QXJjaGl2ZWRDb252ZXJzYXRpb25zLFxuICAgICAgc3RhcnRDb21wb3NpbmcsXG4gICAgICBzdGFydFVwZGF0ZSxcbiAgICAgIHRoZW1lLFxuICAgICAgdGl0bGUsXG4gICAgICB0b2dnbGVQcm9maWxlRWRpdG9yLFxuICAgICAgdG9nZ2xlU3Rvcmllc1ZpZXcsXG4gICAgICB1bnJlYWRTdG9yaWVzQ291bnQsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBzaG93aW5nQXZhdGFyUG9wdXAsIHBvcHBlclJvb3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWFpbi1oZWFkZXJcIj5cbiAgICAgICAgPE1hbmFnZXI+XG4gICAgICAgICAgPFJlZmVyZW5jZT5cbiAgICAgICAgICAgIHsoeyByZWYgfSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLW1haW4taGVhZGVyX19hdmF0YXItLWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgcmVmPXt0aGlzLmNvbnRhaW5lclJlZn1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3RcbiAgICAgICAgICAgICAgICAgIGF2YXRhclBhdGg9e2F2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgICBiYWRnZT17YmFkZ2V9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtbWFpbi1oZWFkZXJfX2F2YXRhclwiXG4gICAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25UeXBlPVwiZGlyZWN0XCJcbiAgICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI9e3Bob25lTnVtYmVyfVxuICAgICAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgdGhlbWU9e3RoZW1lfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICAgICAgICAgICAgLy8gYHNoYXJlZEdyb3VwTmFtZXNgIG1ha2VzIG5vIHNlbnNlIGZvciB5b3Vyc2VsZiwgYnV0XG4gICAgICAgICAgICAgICAgICAvLyBgPEF2YXRhcj5gIG5lZWRzIGl0IHRvIGRldGVybWluZSBibHVycmluZy5cbiAgICAgICAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e1tdfVxuICAgICAgICAgICAgICAgICAgc2l6ZT17Mjh9XG4gICAgICAgICAgICAgICAgICBpbm5lclJlZj17cmVmfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zaG93QXZhdGFyUG9wdXB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7aGFzUGVuZGluZ1VwZGF0ZSAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1tYWluLWhlYWRlcl9fYXZhdGFyLS1iYWRnZWRcIiAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1JlZmVyZW5jZT5cbiAgICAgICAgICB7c2hvd2luZ0F2YXRhclBvcHVwICYmIHBvcHBlclJvb3RcbiAgICAgICAgICAgID8gY3JlYXRlUG9ydGFsKFxuICAgICAgICAgICAgICAgIDxQb3BwZXIgcGxhY2VtZW50PVwiYm90dG9tLWVuZFwiPlxuICAgICAgICAgICAgICAgICAgeyh7IHJlZiwgc3R5bGUgfSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8QXZhdGFyUG9wdXBcbiAgICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgYmFkZ2U9e2JhZGdlfVxuICAgICAgICAgICAgICAgICAgICAgIGlubmVyUmVmPXtyZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICBpc01lXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIHpJbmRleDogMTAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uVHlwZT1cImRpcmVjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwaG9uZU51bWJlcj17cGhvbmVOdW1iZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZU5hbWU9e3Byb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPXt0aGVtZX1cbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgYXZhdGFyUGF0aD17YXZhdGFyUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgICBzaXplPXsyOH1cbiAgICAgICAgICAgICAgICAgICAgICBoYXNQZW5kaW5nVXBkYXRlPXtoYXNQZW5kaW5nVXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VXBkYXRlPXtzdGFydFVwZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgYWJvdmUgYWJvdXQgYHNoYXJlZEdyb3VwTmFtZXNgLlxuICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZEdyb3VwTmFtZXM9e1tdfVxuICAgICAgICAgICAgICAgICAgICAgIG9uRWRpdFByb2ZpbGU9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVByb2ZpbGVFZGl0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUF2YXRhclBvcHVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBvblZpZXdQcmVmZXJlbmNlcz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVBdmF0YXJQb3B1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgb25WaWV3QXJjaGl2ZT17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FyY2hpdmVkQ29udmVyc2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlQXZhdGFyUG9wdXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1BvcHBlcj4sXG4gICAgICAgICAgICAgICAgcG9wcGVyUm9vdFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IG51bGx9XG4gICAgICAgIDwvTWFuYWdlcj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtbWFpbi1oZWFkZXJfX2ljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAge2FyZVN0b3JpZXNFbmFibGVkICYmIChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD17aTE4bignc3RvcmllcycpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtbWFpbi1oZWFkZXJfX3N0b3JpZXMtaWNvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZVN0b3JpZXNWaWV3fVxuICAgICAgICAgICAgICB0aXRsZT17aTE4bignc3RvcmllcycpfVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3VucmVhZFN0b3JpZXNDb3VudCA/IChcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb2R1bGUtbWFpbi1oZWFkZXJfX3N0b3JpZXMtYmFkZ2VcIj5cbiAgICAgICAgICAgICAgICAgIHt1bnJlYWRTdG9yaWVzQ291bnR9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICApIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtpMThuKCduZXdDb252ZXJzYXRpb24nKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1tYWluLWhlYWRlcl9fY29tcG9zZS1pY29uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3N0YXJ0Q29tcG9zaW5nfVxuICAgICAgICAgICAgdGl0bGU9e2kxOG4oJ25ld0NvbnZlcnNhdGlvbicpfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLDBCQUEyQztBQUMzQyx1QkFBNkI7QUFFN0IscUJBQTZCO0FBQzdCLG9CQUF1QjtBQUN2Qix5QkFBNEI7QUFpQ3JCLE1BQU0sbUJBQW1CLHFCQUFNLFVBQWdDO0FBQUEsRUFHcEUsWUFBWSxPQUFrQjtBQUM1QixVQUFNLEtBQUs7QUFITix3QkFBZ0QscUJBQU0sVUFBVTtBQVdoRSw4QkFBcUIsd0JBQUMsRUFBRSxhQUErQjtBQUM1RCxZQUFNLEVBQUUsWUFBWSx1QkFBdUIsS0FBSztBQUVoRCxVQUNFLHNCQUNBLGNBQ0EsQ0FBQyxXQUFXLFNBQVMsTUFBYyxLQUNuQyxDQUFDLEtBQUssYUFBYSxTQUFTLFNBQVMsTUFBYyxHQUNuRDtBQUNBLGFBQUssZ0JB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
