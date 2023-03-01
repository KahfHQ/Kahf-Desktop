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
var AvatarPopup_exports = {};
__export(AvatarPopup_exports, {
  AvatarPopup: () => AvatarPopup
});
module.exports = __toCommonJS(AvatarPopup_exports);
var React = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_Avatar = require("./Avatar");
var import_useRestoreFocus = require("../hooks/useRestoreFocus");
var import_Emojify = require("./conversation/Emojify");
const AvatarPopup = /* @__PURE__ */ __name((props) => {
  const {
    hasPendingUpdate,
    i18n,
    name,
    onEditProfile,
    onViewArchive,
    onViewPreferences,
    phoneNumber,
    profileName,
    startUpdate,
    style,
    title
  } = props;
  const shouldShowNumber = Boolean(name || profileName);
  const [focusRef] = (0, import_useRestoreFocus.useRestoreFocus)();
  return /* @__PURE__ */ React.createElement("div", {
    style,
    className: "module-avatar-popup"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "module-avatar-popup__profile",
    onClick: onEditProfile,
    ref: focusRef,
    type: "button"
  }, /* @__PURE__ */ React.createElement(import_Avatar.Avatar, {
    ...props,
    size: 52
  }), /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__profile__text"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__profile__name"
  }, /* @__PURE__ */ React.createElement(import_Emojify.Emojify, {
    text: profileName || title
  })), shouldShowNumber ? /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__profile__number"
  }, phoneNumber) : null)), /* @__PURE__ */ React.createElement("hr", {
    className: "module-avatar-popup__divider"
  }), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "module-avatar-popup__item",
    onClick: onViewPreferences
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames.default)("module-avatar-popup__item__icon", "module-avatar-popup__item__icon-settings")
  }), /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__item__text"
  }, i18n("mainMenuSettings"))), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "module-avatar-popup__item",
    onClick: onViewArchive
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames.default)("module-avatar-popup__item__icon", "module-avatar-popup__item__icon-archive")
  }), /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__item__text"
  }, i18n("avatarMenuViewArchive"))), hasPendingUpdate && /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "module-avatar-popup__item",
    onClick: startUpdate
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames.default)("module-avatar-popup__item__icon", "module-avatar-popup__item__icon--update")
  }), /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__item__text"
  }, i18n("avatarMenuUpdateAvailable")), /* @__PURE__ */ React.createElement("div", {
    className: "module-avatar-popup__item--badge"
  })));
}, "AvatarPopup");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvatarPopup
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXZhdGFyUG9wdXAudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgQXZhdGFyUHJvcHMgfSBmcm9tICcuL0F2YXRhcic7XG5pbXBvcnQgeyBBdmF0YXIgfSBmcm9tICcuL0F2YXRhcic7XG5pbXBvcnQgeyB1c2VSZXN0b3JlRm9jdXMgfSBmcm9tICcuLi9ob29rcy91c2VSZXN0b3JlRm9jdXMnO1xuXG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUsIFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHsgRW1vamlmeSB9IGZyb20gJy4vY29udmVyc2F0aW9uL0Vtb2ppZnknO1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IHtcbiAgcmVhZG9ubHkgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgcmVhZG9ubHkgdGhlbWU6IFRoZW1lVHlwZTtcblxuICBoYXNQZW5kaW5nVXBkYXRlOiBib29sZWFuO1xuICBzdGFydFVwZGF0ZTogKCkgPT4gdW5rbm93bjtcblxuICBvbkVkaXRQcm9maWxlOiAoKSA9PiB1bmtub3duO1xuICBvblZpZXdQcmVmZXJlbmNlczogKCkgPT4gdW5rbm93bjtcbiAgb25WaWV3QXJjaGl2ZTogKCkgPT4gdW5rbm93bjtcblxuICAvLyBNYXRjaGVzIFBvcHBlcidzIFJlZkhhbmRsZXIgdHlwZVxuICBpbm5lclJlZj86IFJlYWN0LlJlZjxIVE1MRGl2RWxlbWVudD47XG4gIHN0eWxlOiBSZWFjdC5DU1NQcm9wZXJ0aWVzO1xufSAmIE9taXQ8QXZhdGFyUHJvcHMsICdvbkNsaWNrJz47XG5cbmV4cG9ydCBjb25zdCBBdmF0YXJQb3B1cCA9IChwcm9wczogUHJvcHMpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IHtcbiAgICBoYXNQZW5kaW5nVXBkYXRlLFxuICAgIGkxOG4sXG4gICAgbmFtZSxcbiAgICBvbkVkaXRQcm9maWxlLFxuICAgIG9uVmlld0FyY2hpdmUsXG4gICAgb25WaWV3UHJlZmVyZW5jZXMsXG4gICAgcGhvbmVOdW1iZXIsXG4gICAgcHJvZmlsZU5hbWUsXG4gICAgc3RhcnRVcGRhdGUsXG4gICAgc3R5bGUsXG4gICAgdGl0bGUsXG4gIH0gPSBwcm9wcztcblxuICBjb25zdCBzaG91bGRTaG93TnVtYmVyID0gQm9vbGVhbihuYW1lIHx8IHByb2ZpbGVOYW1lKTtcblxuICAvLyBOb3RlOiBtZWNoYW5pc21zIHRvIGRpc21pc3MgdGhpcyB2aWV3IGFyZSBhbGwgaW4gaXRzIGhvc3QsIE1haW5IZWFkZXJcblxuICAvLyBGb2N1cyBmaXJzdCBidXR0b24gYWZ0ZXIgaW5pdGlhbCByZW5kZXIsIHJlc3RvcmUgZm9jdXMgb24gdGVhcmRvd25cbiAgY29uc3QgW2ZvY3VzUmVmXSA9IHVzZVJlc3RvcmVGb2N1cygpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17c3R5bGV9IGNsYXNzTmFtZT1cIm1vZHVsZS1hdmF0YXItcG9wdXBcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLWF2YXRhci1wb3B1cF9fcHJvZmlsZVwiXG4gICAgICAgIG9uQ2xpY2s9e29uRWRpdFByb2ZpbGV9XG4gICAgICAgIHJlZj17Zm9jdXNSZWZ9XG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgPlxuICAgICAgICA8QXZhdGFyIHsuLi5wcm9wc30gc2l6ZT17NTJ9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWF2YXRhci1wb3B1cF9fcHJvZmlsZV9fdGV4dFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWF2YXRhci1wb3B1cF9fcHJvZmlsZV9fbmFtZVwiPlxuICAgICAgICAgICAgPEVtb2ppZnkgdGV4dD17cHJvZmlsZU5hbWUgfHwgdGl0bGV9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3Nob3VsZFNob3dOdW1iZXIgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1hdmF0YXItcG9wdXBfX3Byb2ZpbGVfX251bWJlclwiPlxuICAgICAgICAgICAgICB7cGhvbmVOdW1iZXJ9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxociBjbGFzc05hbWU9XCJtb2R1bGUtYXZhdGFyLXBvcHVwX19kaXZpZGVyXCIgLz5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1hdmF0YXItcG9wdXBfX2l0ZW1cIlxuICAgICAgICBvbkNsaWNrPXtvblZpZXdQcmVmZXJlbmNlc31cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX19pY29uJyxcbiAgICAgICAgICAgICdtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX19pY29uLXNldHRpbmdzJ1xuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kdWxlLWF2YXRhci1wb3B1cF9faXRlbV9fdGV4dFwiPlxuICAgICAgICAgIHtpMThuKCdtYWluTWVudVNldHRpbmdzJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtXCJcbiAgICAgICAgb25DbGljaz17b25WaWV3QXJjaGl2ZX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICdtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX19pY29uJyxcbiAgICAgICAgICAgICdtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX19pY29uLWFyY2hpdmUnXG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX190ZXh0XCI+XG4gICAgICAgICAge2kxOG4oJ2F2YXRhck1lbnVWaWV3QXJjaGl2ZScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge2hhc1BlbmRpbmdVcGRhdGUgJiYgKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwibW9kdWxlLWF2YXRhci1wb3B1cF9faXRlbVwiXG4gICAgICAgICAgb25DbGljaz17c3RhcnRVcGRhdGV9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICdtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtX19pY29uJyxcbiAgICAgICAgICAgICAgJ21vZHVsZS1hdmF0YXItcG9wdXBfX2l0ZW1fX2ljb24tLXVwZGF0ZSdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1hdmF0YXItcG9wdXBfX2l0ZW1fX3RleHRcIj5cbiAgICAgICAgICAgIHtpMThuKCdhdmF0YXJNZW51VXBkYXRlQXZhaWxhYmxlJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2R1bGUtYXZhdGFyLXBvcHVwX19pdGVtLS1iYWRnZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsWUFBdUI7QUFDdkIsd0JBQXVCO0FBR3ZCLG9CQUF1QjtBQUN2Qiw2QkFBZ0M7QUFHaEMscUJBQXdCO0FBa0JqQixNQUFNLGNBQWMsd0JBQUMsVUFBOEI7QUFDeEQsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsTUFDRTtBQUVKLFFBQU0sbUJBQW1CLFFBQVEsUUFBUSxXQUFXO0FBS3BELFFBQU0sQ0FBQyxZQUFZLDRDQUFnQjtBQUVuQyxTQUNFLG9DQUFDO0FBQUEsSUFBSTtBQUFBLElBQWMsV0FBVTtBQUFBLEtBQzNCLG9DQUFDO0FBQUEsSUFDQyxXQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxLQUFLO0FBQUEsSUFDTCxNQUFLO0FBQUEsS0FFTCxvQ0FBQztBQUFBLE9BQVc7QUFBQSxJQUFPLE1BQU07QUFBQSxHQUFJLEdBQzdCLG9DQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDYixvQ0FBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ2Isb0NBQUM7QUFBQSxJQUFRLE1BQU0sZUFBZTtBQUFBLEdBQU8sQ0FDdkMsR0FDQyxtQkFDQyxvQ0FBQztBQUFBLElBQUksV0FBVTtBQUFBLEtBQ1osV0FDSCxJQUNFLElBQ04sQ0FDRixHQUNBLG9DQUFDO0FBQUEsSUFBRyxXQUFVO0FBQUEsR0FBK0IsR0FDN0Msb0NBQUM7QUFBQSxJQUNDLE1BQUs7QUFBQSxJQUNMLFdBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxLQUVULG9DQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULG1DQUNBLDBDQUNGO0FBQUEsR0FDRixHQUNBLG9DQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDWixLQUFLLGtCQUFrQixDQUMxQixDQUNGLEdBQ0Esb0NBQUM7QUFBQSxJQUNDLE1BQUs7QUFBQSxJQUNMLFdBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxLQUVULG9DQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULG1DQUNBLHlDQUNGO0FBQUEsR0FDRixHQUNBLG9DQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDWixLQUFLLHVCQUF1QixDQUMvQixDQUNGLEdBQ0Msb0JBQ0Msb0NBQUM7QUFBQSxJQUNDLE1BQUs7QUFBQSxJQUNMLFdBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxLQUVULG9DQUFDO0FBQUEsSUFDQyxXQUFXLCtCQUNULG1DQUNBLHlDQUNGO0FBQUEsR0FDRixHQUNBLG9DQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDWixLQUFLLDJCQUEyQixDQUNuQyxHQUNBLG9DQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsR0FBbUMsQ0FDcEQsQ0FFSjtBQUVKLEdBN0YyQjsiLAogICJuYW1lcyI6IFtdCn0K
