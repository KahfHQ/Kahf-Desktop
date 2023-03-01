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
var Avatar_exports = {};
__export(Avatar_exports, {
  Avatar: () => Avatar,
  AvatarBlur: () => AvatarBlur,
  AvatarSize: () => AvatarSize,
  _getBadgePlacement: () => _getBadgePlacement,
  _getBadgeSize: () => _getBadgeSize
});
module.exports = __toCommonJS(Avatar_exports);
var import_react = __toESM(require("react"));
var import_classnames = __toESM(require("classnames"));
var import_lodash = require("lodash");
var log = __toESM(require("../logging/log"));
var import_BadgeImageTheme = require("../badges/BadgeImageTheme");
var import_Stories = require("../types/Stories");
var import_Spinner = require("./Spinner");
var import_Util = require("../types/Util");
var import_assert = require("../util/assert");
var import_getBadgeImageFileLocalPath = require("../badges/getBadgeImageFileLocalPath");
var import_getInitials = require("../util/getInitials");
var import_isBadgeVisible = require("../badges/isBadgeVisible");
var import_shouldBlurAvatar = require("../util/shouldBlurAvatar");
var import_shouldShowBadges = require("../badges/shouldShowBadges");
var AvatarBlur = /* @__PURE__ */ ((AvatarBlur2) => {
  AvatarBlur2[AvatarBlur2["NoBlur"] = 0] = "NoBlur";
  AvatarBlur2[AvatarBlur2["BlurPicture"] = 1] = "BlurPicture";
  AvatarBlur2[AvatarBlur2["BlurPictureWithClickToView"] = 2] = "BlurPictureWithClickToView";
  return AvatarBlur2;
})(AvatarBlur || {});
var AvatarSize = /* @__PURE__ */ ((AvatarSize2) => {
  AvatarSize2[AvatarSize2["SIXTEEN"] = 16] = "SIXTEEN";
  AvatarSize2[AvatarSize2["TWENTY_EIGHT"] = 28] = "TWENTY_EIGHT";
  AvatarSize2[AvatarSize2["THIRTY_TWO"] = 32] = "THIRTY_TWO";
  AvatarSize2[AvatarSize2["THIRTY_SIX"] = 36] = "THIRTY_SIX";
  AvatarSize2[AvatarSize2["FORTY_EIGHT"] = 48] = "FORTY_EIGHT";
  AvatarSize2[AvatarSize2["FIFTY_TWO"] = 52] = "FIFTY_TWO";
  AvatarSize2[AvatarSize2["EIGHTY"] = 80] = "EIGHTY";
  AvatarSize2[AvatarSize2["NINETY_SIX"] = 96] = "NINETY_SIX";
  AvatarSize2[AvatarSize2["ONE_HUNDRED_TWELVE"] = 112] = "ONE_HUNDRED_TWELVE";
  return AvatarSize2;
})(AvatarSize || {});
const BADGE_PLACEMENT_BY_SIZE = /* @__PURE__ */ new Map([
  [28, { bottom: -4, right: -2 }],
  [32, { bottom: -4, right: -2 }],
  [36, { bottom: -3, right: 0 }],
  [40, { bottom: -6, right: -4 }],
  [48, { bottom: -6, right: -4 }],
  [52, { bottom: -6, right: -2 }],
  [56, { bottom: -6, right: 0 }],
  [64, { bottom: -6, right: 0 }],
  [80, { bottom: -8, right: 0 }],
  [88, { bottom: -4, right: 3 }],
  [112, { bottom: -4, right: 3 }]
]);
const getDefaultBlur = /* @__PURE__ */ __name((...args) => (0, import_shouldBlurAvatar.shouldBlurAvatar)(...args) ? 1 /* BlurPicture */ : 0 /* NoBlur */, "getDefaultBlur");
const Avatar = /* @__PURE__ */ __name(({
  acceptedMessageRequest,
  avatarPath,
  badge,
  className,
  color = "A200",
  conversationType,
  i18n,
  isMe,
  innerRef,
  loading,
  noteToSelf,
  onClick,
  onClickBadge,
  sharedGroupNames,
  size,
  theme,
  title,
  unblurredAvatarPath,
  searchResult,
  storyRing,
  blur = getDefaultBlur({
    acceptedMessageRequest,
    avatarPath,
    isMe,
    sharedGroupNames,
    unblurredAvatarPath
  })
}) => {
  const [imageBroken, setImageBroken] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setImageBroken(false);
  }, [avatarPath]);
  (0, import_react.useEffect)(() => {
    if (!avatarPath) {
      return import_lodash.noop;
    }
    const image = new Image();
    image.src = avatarPath;
    image.onerror = () => {
      log.warn("Avatar: Image failed to load; failing over to placeholder");
      setImageBroken(true);
    };
    return () => {
      image.onerror = import_lodash.noop;
    };
  }, [avatarPath]);
  const initials = (0, import_getInitials.getInitials)(title);
  const hasImage = !noteToSelf && avatarPath && !imageBroken;
  const shouldUseInitials = !hasImage && conversationType === "direct" && Boolean(initials);
  let contentsChildren;
  if (loading) {
    const svgSize = size < 40 ? "small" : "normal";
    contentsChildren = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-Avatar__spinner-container"
    }, /* @__PURE__ */ import_react.default.createElement(import_Spinner.Spinner, {
      size: `${size - 8}px`,
      svgSize,
      direction: "on-avatar"
    }));
  } else if (hasImage) {
    (0, import_assert.assert)(avatarPath, "avatarPath should be defined here");
    (0, import_assert.assert)(blur !== 2 /* BlurPictureWithClickToView */ || size >= 100, 'Rendering "click to view" for a small avatar. This may not render correctly');
    const isBlurred = blur === 1 /* BlurPicture */ || blur === 2 /* BlurPictureWithClickToView */;
    contentsChildren = /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-Avatar__image",
      style: {
        backgroundImage: `url('${encodeURI(avatarPath)}')`,
        ...isBlurred ? { filter: `blur(${Math.ceil(size / 2)}px)` } : {}
      }
    }), blur === 2 /* BlurPictureWithClickToView */ && /* @__PURE__ */ import_react.default.createElement("div", {
      className: "module-Avatar__click-to-view"
    }, i18n("view")));
  } else if (searchResult) {
    contentsChildren = /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-Avatar__icon", "module-Avatar__icon--search-result")
    });
  } else if (noteToSelf) {
    contentsChildren = /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-Avatar__icon", "module-Avatar__icon--note-to-self")
    });
  } else if (shouldUseInitials) {
    contentsChildren = /* @__PURE__ */ import_react.default.createElement("div", {
      "aria-hidden": "true",
      className: "module-Avatar__label",
      style: { fontSize: Math.ceil(size * 0.45) }
    }, initials);
  } else {
    contentsChildren = /* @__PURE__ */ import_react.default.createElement("div", {
      className: (0, import_classnames.default)("module-Avatar__icon", `module-Avatar__icon--${conversationType}`)
    });
  }
  let contents;
  const contentsClassName = (0, import_classnames.default)("module-Avatar__contents", `module-Avatar__contents--${color}`);
  if (onClick) {
    contents = /* @__PURE__ */ import_react.default.createElement("button", {
      className: contentsClassName,
      type: "button",
      onClick
    }, contentsChildren);
  } else {
    contents = /* @__PURE__ */ import_react.default.createElement("div", {
      className: contentsClassName
    }, contentsChildren);
  }
  let badgeNode;
  const badgeSize = _getBadgeSize(size);
  if (badge && theme && !noteToSelf && badgeSize && (0, import_isBadgeVisible.isBadgeVisible)(badge) && (0, import_shouldShowBadges.shouldShowBadges)()) {
    const badgePlacement = _getBadgePlacement(size);
    const badgeTheme = theme === import_Util.ThemeType.light ? import_BadgeImageTheme.BadgeImageTheme.Light : import_BadgeImageTheme.BadgeImageTheme.Dark;
    const badgeImagePath = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, badgeSize, badgeTheme);
    if (badgeImagePath) {
      const positionStyles = {
        width: badgeSize,
        height: badgeSize,
        ...badgePlacement
      };
      if (onClickBadge) {
        badgeNode = /* @__PURE__ */ import_react.default.createElement("button", {
          "aria-label": badge.name,
          className: "module-Avatar__badge module-Avatar__badge--button",
          onClick: onClickBadge,
          style: {
            backgroundImage: `url('${encodeURI(badgeImagePath)}')`,
            ...positionStyles
          },
          type: "button"
        });
      } else {
        badgeNode = /* @__PURE__ */ import_react.default.createElement("img", {
          alt: badge.name,
          className: "module-Avatar__badge module-Avatar__badge--static",
          src: badgeImagePath,
          style: positionStyles
        });
      }
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("div", {
    "aria-label": i18n("contactAvatarAlt", [title]),
    className: (0, import_classnames.default)("module-Avatar", hasImage ? "module-Avatar--with-image" : "module-Avatar--no-image", Boolean(storyRing) && "module-Avatar--with-story", storyRing === import_Stories.HasStories.Unread && "module-Avatar--with-story--unread", className),
    style: {
      minWidth: size,
      width: size,
      height: size
    },
    ref: innerRef
  }, contents, badgeNode);
}, "Avatar");
function _getBadgeSize(avatarSize) {
  if (avatarSize < 24) {
    return void 0;
  }
  if (avatarSize <= 36) {
    return 16;
  }
  if (avatarSize <= 64) {
    return 24;
  }
  if (avatarSize <= 112) {
    return 36;
  }
  return Math.round(avatarSize * 0.4);
}
function _getBadgePlacement(avatarSize) {
  return BADGE_PLACEMENT_BY_SIZE.get(avatarSize) || { bottom: 0, right: 0 };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Avatar,
  AvatarBlur,
  AvatarSize,
  _getBadgePlacement,
  _getBadgeSize
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQXZhdGFyLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB0eXBlIHtcbiAgQ1NTUHJvcGVydGllcyxcbiAgRnVuY3Rpb25Db21wb25lbnQsXG4gIE1vdXNlRXZlbnQsXG4gIFJlYWN0Q2hpbGQsXG4gIFJlYWN0Tm9kZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgdHlwZSB7IEF2YXRhckNvbG9yVHlwZSB9IGZyb20gJy4uL3R5cGVzL0NvbG9ycyc7XG5pbXBvcnQgdHlwZSB7IEJhZGdlVHlwZSB9IGZyb20gJy4uL2JhZGdlcy90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi90eXBlcy9VdGlsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBCYWRnZUltYWdlVGhlbWUgfSBmcm9tICcuLi9iYWRnZXMvQmFkZ2VJbWFnZVRoZW1lJztcbmltcG9ydCB7IEhhc1N0b3JpZXMgfSBmcm9tICcuLi90eXBlcy9TdG9yaWVzJztcbmltcG9ydCB7IFNwaW5uZXIgfSBmcm9tICcuL1NwaW5uZXInO1xuaW1wb3J0IHsgVGhlbWVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCB9IGZyb20gJy4uL2JhZGdlcy9nZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCc7XG5pbXBvcnQgeyBnZXRJbml0aWFscyB9IGZyb20gJy4uL3V0aWwvZ2V0SW5pdGlhbHMnO1xuaW1wb3J0IHsgaXNCYWRnZVZpc2libGUgfSBmcm9tICcuLi9iYWRnZXMvaXNCYWRnZVZpc2libGUnO1xuaW1wb3J0IHsgc2hvdWxkQmx1ckF2YXRhciB9IGZyb20gJy4uL3V0aWwvc2hvdWxkQmx1ckF2YXRhcic7XG5pbXBvcnQgeyBzaG91bGRTaG93QmFkZ2VzIH0gZnJvbSAnLi4vYmFkZ2VzL3Nob3VsZFNob3dCYWRnZXMnO1xuXG5leHBvcnQgZW51bSBBdmF0YXJCbHVyIHtcbiAgTm9CbHVyLFxuICBCbHVyUGljdHVyZSxcbiAgQmx1clBpY3R1cmVXaXRoQ2xpY2tUb1ZpZXcsXG59XG5cbmV4cG9ydCBlbnVtIEF2YXRhclNpemUge1xuICBTSVhURUVOID0gMTYsXG4gIFRXRU5UWV9FSUdIVCA9IDI4LFxuICBUSElSVFlfVFdPID0gMzIsXG4gIFRISVJUWV9TSVggPSAzNixcbiAgRk9SVFlfRUlHSFQgPSA0OCxcbiAgRklGVFlfVFdPID0gNTIsXG4gIEVJR0hUWSA9IDgwLFxuICBOSU5FVFlfU0lYID0gOTYsXG4gIE9ORV9IVU5EUkVEX1RXRUxWRSA9IDExMixcbn1cblxudHlwZSBCYWRnZVBsYWNlbWVudFR5cGUgPSB7IGJvdHRvbTogbnVtYmVyOyByaWdodDogbnVtYmVyIH07XG5cbmV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBhdmF0YXJQYXRoPzogc3RyaW5nO1xuICBibHVyPzogQXZhdGFyQmx1cjtcbiAgY29sb3I/OiBBdmF0YXJDb2xvclR5cGU7XG4gIGxvYWRpbmc/OiBib29sZWFuO1xuXG4gIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IGJvb2xlYW47XG4gIGNvbnZlcnNhdGlvblR5cGU6ICdncm91cCcgfCAnZGlyZWN0JztcbiAgaXNNZTogYm9vbGVhbjtcbiAgbmFtZT86IHN0cmluZztcbiAgbm90ZVRvU2VsZj86IGJvb2xlYW47XG4gIHBob25lTnVtYmVyPzogc3RyaW5nO1xuICBwcm9maWxlTmFtZT86IHN0cmluZztcbiAgc2hhcmVkR3JvdXBOYW1lczogQXJyYXk8c3RyaW5nPjtcbiAgc2l6ZTogQXZhdGFyU2l6ZTtcbiAgdGl0bGU6IHN0cmluZztcbiAgdW5ibHVycmVkQXZhdGFyUGF0aD86IHN0cmluZztcbiAgc2VhcmNoUmVzdWx0PzogYm9vbGVhbjtcbiAgc3RvcnlSaW5nPzogSGFzU3RvcmllcztcblxuICBvbkNsaWNrPzogKGV2ZW50OiBNb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4gdW5rbm93bjtcbiAgb25DbGlja0JhZGdlPzogKGV2ZW50OiBNb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4gdW5rbm93bjtcblxuICAvLyBNYXRjaGVzIFBvcHBlcidzIFJlZkhhbmRsZXIgdHlwZVxuICBpbm5lclJlZj86IFJlYWN0LlJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbn0gJiAoXG4gIHwgeyBiYWRnZTogdW5kZWZpbmVkOyB0aGVtZT86IFRoZW1lVHlwZSB9XG4gIHwgeyBiYWRnZTogQmFkZ2VUeXBlOyB0aGVtZTogVGhlbWVUeXBlIH1cbikgJlxuICBQaWNrPFJlYWN0LkhUTUxQcm9wczxIVE1MRGl2RWxlbWVudD4sICdjbGFzc05hbWUnPjtcblxuY29uc3QgQkFER0VfUExBQ0VNRU5UX0JZX1NJWkUgPSBuZXcgTWFwPG51bWJlciwgQmFkZ2VQbGFjZW1lbnRUeXBlPihbXG4gIFsyOCwgeyBib3R0b206IC00LCByaWdodDogLTIgfV0sXG4gIFszMiwgeyBib3R0b206IC00LCByaWdodDogLTIgfV0sXG4gIFszNiwgeyBib3R0b206IC0zLCByaWdodDogMCB9XSxcbiAgWzQwLCB7IGJvdHRvbTogLTYsIHJpZ2h0OiAtNCB9XSxcbiAgWzQ4LCB7IGJvdHRvbTogLTYsIHJpZ2h0OiAtNCB9XSxcbiAgWzUyLCB7IGJvdHRvbTogLTYsIHJpZ2h0OiAtMiB9XSxcbiAgWzU2LCB7IGJvdHRvbTogLTYsIHJpZ2h0OiAwIH1dLFxuICBbNjQsIHsgYm90dG9tOiAtNiwgcmlnaHQ6IDAgfV0sXG4gIFs4MCwgeyBib3R0b206IC04LCByaWdodDogMCB9XSxcbiAgWzg4LCB7IGJvdHRvbTogLTQsIHJpZ2h0OiAzIH1dLFxuICBbMTEyLCB7IGJvdHRvbTogLTQsIHJpZ2h0OiAzIH1dLFxuXSk7XG5cbmNvbnN0IGdldERlZmF1bHRCbHVyID0gKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBzaG91bGRCbHVyQXZhdGFyPlxuKTogQXZhdGFyQmx1ciA9PlxuICBzaG91bGRCbHVyQXZhdGFyKC4uLmFyZ3MpID8gQXZhdGFyQmx1ci5CbHVyUGljdHVyZSA6IEF2YXRhckJsdXIuTm9CbHVyO1xuXG5leHBvcnQgY29uc3QgQXZhdGFyOiBGdW5jdGlvbkNvbXBvbmVudDxQcm9wcz4gPSAoe1xuICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0LFxuICBhdmF0YXJQYXRoLFxuICBiYWRnZSxcbiAgY2xhc3NOYW1lLFxuICBjb2xvciA9ICdBMjAwJyxcbiAgY29udmVyc2F0aW9uVHlwZSxcbiAgaTE4bixcbiAgaXNNZSxcbiAgaW5uZXJSZWYsXG4gIGxvYWRpbmcsXG4gIG5vdGVUb1NlbGYsXG4gIG9uQ2xpY2ssXG4gIG9uQ2xpY2tCYWRnZSxcbiAgc2hhcmVkR3JvdXBOYW1lcyxcbiAgc2l6ZSxcbiAgdGhlbWUsXG4gIHRpdGxlLFxuICB1bmJsdXJyZWRBdmF0YXJQYXRoLFxuICBzZWFyY2hSZXN1bHQsXG4gIHN0b3J5UmluZyxcbiAgYmx1ciA9IGdldERlZmF1bHRCbHVyKHtcbiAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0LFxuICAgIGF2YXRhclBhdGgsXG4gICAgaXNNZSxcbiAgICBzaGFyZWRHcm91cE5hbWVzLFxuICAgIHVuYmx1cnJlZEF2YXRhclBhdGgsXG4gIH0pLFxufSkgPT4ge1xuICBjb25zdCBbaW1hZ2VCcm9rZW4sIHNldEltYWdlQnJva2VuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEltYWdlQnJva2VuKGZhbHNlKTtcbiAgfSwgW2F2YXRhclBhdGhdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghYXZhdGFyUGF0aCkge1xuICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWFnZS5zcmMgPSBhdmF0YXJQYXRoO1xuICAgIGltYWdlLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICBsb2cud2FybignQXZhdGFyOiBJbWFnZSBmYWlsZWQgdG8gbG9hZDsgZmFpbGluZyBvdmVyIHRvIHBsYWNlaG9sZGVyJyk7XG4gICAgICBzZXRJbWFnZUJyb2tlbih0cnVlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGltYWdlLm9uZXJyb3IgPSBub29wO1xuICAgIH07XG4gIH0sIFthdmF0YXJQYXRoXSk7XG5cbiAgY29uc3QgaW5pdGlhbHMgPSBnZXRJbml0aWFscyh0aXRsZSk7XG4gIGNvbnN0IGhhc0ltYWdlID0gIW5vdGVUb1NlbGYgJiYgYXZhdGFyUGF0aCAmJiAhaW1hZ2VCcm9rZW47XG4gIGNvbnN0IHNob3VsZFVzZUluaXRpYWxzID1cbiAgICAhaGFzSW1hZ2UgJiYgY29udmVyc2F0aW9uVHlwZSA9PT0gJ2RpcmVjdCcgJiYgQm9vbGVhbihpbml0aWFscyk7XG5cbiAgbGV0IGNvbnRlbnRzQ2hpbGRyZW46IFJlYWN0Tm9kZTtcbiAgaWYgKGxvYWRpbmcpIHtcbiAgICBjb25zdCBzdmdTaXplID0gc2l6ZSA8IDQwID8gJ3NtYWxsJyA6ICdub3JtYWwnO1xuICAgIGNvbnRlbnRzQ2hpbGRyZW4gPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1BdmF0YXJfX3NwaW5uZXItY29udGFpbmVyXCI+XG4gICAgICAgIDxTcGlubmVyXG4gICAgICAgICAgc2l6ZT17YCR7c2l6ZSAtIDh9cHhgfVxuICAgICAgICAgIHN2Z1NpemU9e3N2Z1NpemV9XG4gICAgICAgICAgZGlyZWN0aW9uPVwib24tYXZhdGFyXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSBpZiAoaGFzSW1hZ2UpIHtcbiAgICBhc3NlcnQoYXZhdGFyUGF0aCwgJ2F2YXRhclBhdGggc2hvdWxkIGJlIGRlZmluZWQgaGVyZScpO1xuXG4gICAgYXNzZXJ0KFxuICAgICAgYmx1ciAhPT0gQXZhdGFyQmx1ci5CbHVyUGljdHVyZVdpdGhDbGlja1RvVmlldyB8fCBzaXplID49IDEwMCxcbiAgICAgICdSZW5kZXJpbmcgXCJjbGljayB0byB2aWV3XCIgZm9yIGEgc21hbGwgYXZhdGFyLiBUaGlzIG1heSBub3QgcmVuZGVyIGNvcnJlY3RseSdcbiAgICApO1xuXG4gICAgY29uc3QgaXNCbHVycmVkID1cbiAgICAgIGJsdXIgPT09IEF2YXRhckJsdXIuQmx1clBpY3R1cmUgfHxcbiAgICAgIGJsdXIgPT09IEF2YXRhckJsdXIuQmx1clBpY3R1cmVXaXRoQ2xpY2tUb1ZpZXc7XG4gICAgY29udGVudHNDaGlsZHJlbiA9IChcbiAgICAgIDw+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtQXZhdGFyX19pbWFnZVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgnJHtlbmNvZGVVUkkoYXZhdGFyUGF0aCl9JylgLFxuICAgICAgICAgICAgLi4uKGlzQmx1cnJlZCA/IHsgZmlsdGVyOiBgYmx1cigke01hdGguY2VpbChzaXplIC8gMil9cHgpYCB9IDoge30pLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIHtibHVyID09PSBBdmF0YXJCbHVyLkJsdXJQaWN0dXJlV2l0aENsaWNrVG9WaWV3ICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZHVsZS1BdmF0YXJfX2NsaWNrLXRvLXZpZXdcIj57aTE4bigndmlldycpfTwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChzZWFyY2hSZXN1bHQpIHtcbiAgICBjb250ZW50c0NoaWxkcmVuID0gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgJ21vZHVsZS1BdmF0YXJfX2ljb24nLFxuICAgICAgICAgICdtb2R1bGUtQXZhdGFyX19pY29uLS1zZWFyY2gtcmVzdWx0J1xuICAgICAgICApfVxuICAgICAgLz5cbiAgICApO1xuICB9IGVsc2UgaWYgKG5vdGVUb1NlbGYpIHtcbiAgICBjb250ZW50c0NoaWxkcmVuID0gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgJ21vZHVsZS1BdmF0YXJfX2ljb24nLFxuICAgICAgICAgICdtb2R1bGUtQXZhdGFyX19pY29uLS1ub3RlLXRvLXNlbGYnXG4gICAgICAgICl9XG4gICAgICAvPlxuICAgICk7XG4gIH0gZWxzZSBpZiAoc2hvdWxkVXNlSW5pdGlhbHMpIHtcbiAgICBjb250ZW50c0NoaWxkcmVuID0gKFxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBjbGFzc05hbWU9XCJtb2R1bGUtQXZhdGFyX19sYWJlbFwiXG4gICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBNYXRoLmNlaWwoc2l6ZSAqIDAuNDUpIH19XG4gICAgICA+XG4gICAgICAgIHtpbml0aWFsc31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29udGVudHNDaGlsZHJlbiA9IChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICdtb2R1bGUtQXZhdGFyX19pY29uJyxcbiAgICAgICAgICBgbW9kdWxlLUF2YXRhcl9faWNvbi0tJHtjb252ZXJzYXRpb25UeXBlfWBcbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb250ZW50czogUmVhY3RDaGlsZDtcbiAgY29uc3QgY29udGVudHNDbGFzc05hbWUgPSBjbGFzc05hbWVzKFxuICAgICdtb2R1bGUtQXZhdGFyX19jb250ZW50cycsXG4gICAgYG1vZHVsZS1BdmF0YXJfX2NvbnRlbnRzLS0ke2NvbG9yfWBcbiAgKTtcbiAgaWYgKG9uQ2xpY2spIHtcbiAgICBjb250ZW50cyA9IChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtjb250ZW50c0NsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICB7Y29udGVudHNDaGlsZHJlbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29udGVudHMgPSA8ZGl2IGNsYXNzTmFtZT17Y29udGVudHNDbGFzc05hbWV9Pntjb250ZW50c0NoaWxkcmVufTwvZGl2PjtcbiAgfVxuXG4gIGxldCBiYWRnZU5vZGU6IFJlYWN0Tm9kZTtcbiAgY29uc3QgYmFkZ2VTaXplID0gX2dldEJhZGdlU2l6ZShzaXplKTtcbiAgaWYgKFxuICAgIGJhZGdlICYmXG4gICAgdGhlbWUgJiZcbiAgICAhbm90ZVRvU2VsZiAmJlxuICAgIGJhZGdlU2l6ZSAmJlxuICAgIGlzQmFkZ2VWaXNpYmxlKGJhZGdlKSAmJlxuICAgIHNob3VsZFNob3dCYWRnZXMoKVxuICApIHtcbiAgICBjb25zdCBiYWRnZVBsYWNlbWVudCA9IF9nZXRCYWRnZVBsYWNlbWVudChzaXplKTtcbiAgICBjb25zdCBiYWRnZVRoZW1lID1cbiAgICAgIHRoZW1lID09PSBUaGVtZVR5cGUubGlnaHQgPyBCYWRnZUltYWdlVGhlbWUuTGlnaHQgOiBCYWRnZUltYWdlVGhlbWUuRGFyaztcbiAgICBjb25zdCBiYWRnZUltYWdlUGF0aCA9IGdldEJhZGdlSW1hZ2VGaWxlTG9jYWxQYXRoKFxuICAgICAgYmFkZ2UsXG4gICAgICBiYWRnZVNpemUsXG4gICAgICBiYWRnZVRoZW1lXG4gICAgKTtcbiAgICBpZiAoYmFkZ2VJbWFnZVBhdGgpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uU3R5bGVzOiBDU1NQcm9wZXJ0aWVzID0ge1xuICAgICAgICB3aWR0aDogYmFkZ2VTaXplLFxuICAgICAgICBoZWlnaHQ6IGJhZGdlU2l6ZSxcbiAgICAgICAgLi4uYmFkZ2VQbGFjZW1lbnQsXG4gICAgICB9O1xuICAgICAgaWYgKG9uQ2xpY2tCYWRnZSkge1xuICAgICAgICBiYWRnZU5vZGUgPSAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgYXJpYS1sYWJlbD17YmFkZ2UubmFtZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1BdmF0YXJfX2JhZGdlIG1vZHVsZS1BdmF0YXJfX2JhZGdlLS1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17b25DbGlja0JhZGdlfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCcke2VuY29kZVVSSShiYWRnZUltYWdlUGF0aCl9JylgLFxuICAgICAgICAgICAgICAuLi5wb3NpdGlvblN0eWxlcyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFkZ2VOb2RlID0gKFxuICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgIGFsdD17YmFkZ2UubmFtZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZHVsZS1BdmF0YXJfX2JhZGdlIG1vZHVsZS1BdmF0YXJfX2JhZGdlLS1zdGF0aWNcIlxuICAgICAgICAgICAgc3JjPXtiYWRnZUltYWdlUGF0aH1cbiAgICAgICAgICAgIHN0eWxlPXtwb3NpdGlvblN0eWxlc31cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgYXJpYS1sYWJlbD17aTE4bignY29udGFjdEF2YXRhckFsdCcsIFt0aXRsZV0pfVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAnbW9kdWxlLUF2YXRhcicsXG4gICAgICAgIGhhc0ltYWdlID8gJ21vZHVsZS1BdmF0YXItLXdpdGgtaW1hZ2UnIDogJ21vZHVsZS1BdmF0YXItLW5vLWltYWdlJyxcbiAgICAgICAgQm9vbGVhbihzdG9yeVJpbmcpICYmICdtb2R1bGUtQXZhdGFyLS13aXRoLXN0b3J5JyxcbiAgICAgICAgc3RvcnlSaW5nID09PSBIYXNTdG9yaWVzLlVucmVhZCAmJiAnbW9kdWxlLUF2YXRhci0td2l0aC1zdG9yeS0tdW5yZWFkJyxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgbWluV2lkdGg6IHNpemUsXG4gICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICB9fVxuICAgICAgcmVmPXtpbm5lclJlZn1cbiAgICA+XG4gICAgICB7Y29udGVudHN9XG4gICAgICB7YmFkZ2VOb2RlfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gVGhpcyBpcyBvbmx5IGV4cG9ydGVkIGZvciB0ZXN0aW5nLlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRCYWRnZVNpemUoYXZhdGFyU2l6ZTogbnVtYmVyKTogdW5kZWZpbmVkIHwgbnVtYmVyIHtcbiAgaWYgKGF2YXRhclNpemUgPCAyNCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGF2YXRhclNpemUgPD0gMzYpIHtcbiAgICByZXR1cm4gMTY7XG4gIH1cbiAgaWYgKGF2YXRhclNpemUgPD0gNjQpIHtcbiAgICByZXR1cm4gMjQ7XG4gIH1cbiAgaWYgKGF2YXRhclNpemUgPD0gMTEyKSB7XG4gICAgcmV0dXJuIDM2O1xuICB9XG4gIHJldHVybiBNYXRoLnJvdW5kKGF2YXRhclNpemUgKiAwLjQpO1xufVxuXG4vLyBUaGlzIGlzIG9ubHkgZXhwb3J0ZWQgZm9yIHRlc3RpbmcuXG5leHBvcnQgZnVuY3Rpb24gX2dldEJhZGdlUGxhY2VtZW50KFxuICBhdmF0YXJTaXplOiBudW1iZXJcbik6IFJlYWRvbmx5PEJhZGdlUGxhY2VtZW50VHlwZT4ge1xuICByZXR1cm4gQkFER0VfUExBQ0VNRU5UX0JZX1NJWkUuZ2V0KGF2YXRhclNpemUpIHx8IHsgYm90dG9tOiAwLCByaWdodDogMCB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUEsbUJBQTJDO0FBQzNDLHdCQUF1QjtBQUN2QixvQkFBcUI7QUFLckIsVUFBcUI7QUFDckIsNkJBQWdDO0FBQ2hDLHFCQUEyQjtBQUMzQixxQkFBd0I7QUFDeEIsa0JBQTBCO0FBQzFCLG9CQUF1QjtBQUN2Qix3Q0FBMkM7QUFDM0MseUJBQTRCO0FBQzVCLDRCQUErQjtBQUMvQiw4QkFBaUM7QUFDakMsOEJBQWlDO0FBRTFCLElBQUssYUFBTCxrQkFBSyxnQkFBTDtBQUNMO0FBQ0E7QUFDQTtBQUhVO0FBQUE7QUFNTCxJQUFLLGFBQUwsa0JBQUssZ0JBQUw7QUFDTCx1Q0FBVSxNQUFWO0FBQ0EsNENBQWUsTUFBZjtBQUNBLDBDQUFhLE1BQWI7QUFDQSwwQ0FBYSxNQUFiO0FBQ0EsMkNBQWMsTUFBZDtBQUNBLHlDQUFZLE1BQVo7QUFDQSxzQ0FBUyxNQUFUO0FBQ0EsMENBQWEsTUFBYjtBQUNBLGtEQUFxQixPQUFyQjtBQVRVO0FBQUE7QUErQ1osTUFBTSwwQkFBMEIsb0JBQUksSUFBZ0M7QUFBQSxFQUNsRSxDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUM7QUFBQSxFQUM5QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUM7QUFBQSxFQUM5QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFBQSxFQUM3QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUM7QUFBQSxFQUM5QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUM7QUFBQSxFQUM5QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUM7QUFBQSxFQUM5QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFBQSxFQUM3QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFBQSxFQUM3QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFBQSxFQUM3QixDQUFDLElBQUksRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFBQSxFQUM3QixDQUFDLEtBQUssRUFBRSxRQUFRLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsQ0FBQztBQUVELE1BQU0saUJBQWlCLDJCQUNsQixTQUVILDhDQUFpQixHQUFHLElBQUksSUFBSSxzQkFBeUIsZ0JBSGhDO0FBS2hCLE1BQU0sU0FBbUMsd0JBQUM7QUFBQSxFQUMvQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0EsUUFBUTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0EsT0FBTyxlQUFlO0FBQUEsSUFDcEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDO0FBQUEsTUFDRztBQUNKLFFBQU0sQ0FBQyxhQUFhLGtCQUFrQiwyQkFBUyxLQUFLO0FBRXBELDhCQUFVLE1BQU07QUFDZCxtQkFBZSxLQUFLO0FBQUEsRUFDdEIsR0FBRyxDQUFDLFVBQVUsQ0FBQztBQUVmLDhCQUFVLE1BQU07QUFDZCxRQUFJLENBQUMsWUFBWTtBQUNmLGFBQU87QUFBQSxJQUNUO0FBRUEsVUFBTSxRQUFRLElBQUksTUFBTTtBQUN4QixVQUFNLE1BQU07QUFDWixVQUFNLFVBQVUsTUFBTTtBQUNwQixVQUFJLEtBQUssMkRBQTJEO0FBQ3BFLHFCQUFlLElBQUk7QUFBQSxJQUNyQjtBQUVBLFdBQU8sTUFBTTtBQUNYLFlBQU0sVUFBVTtBQUFBLElBQ2xCO0FBQUEsRUFDRixHQUFHLENBQUMsVUFBVSxDQUFDO0FBRWYsUUFBTSxXQUFXLG9DQUFZLEtBQUs7QUFDbEMsUUFBTSxXQUFXLENBQUMsY0FBYyxjQUFjLENBQUM7QUFDL0MsUUFBTSxvQkFDSixDQUFDLFlBQVkscUJBQXFCLFlBQVksUUFBUSxRQUFRO0FBRWhFLE1BQUk7QUFDSixNQUFJLFNBQVM7QUFDWCxVQUFNLFVBQVUsT0FBTyxLQUFLLFVBQVU7QUFDdEMsdUJBQ0UsbURBQUM7QUFBQSxNQUFJLFdBQVU7QUFBQSxPQUNiLG1EQUFDO0FBQUEsTUFDQyxNQUFNLEdBQUcsT0FBTztBQUFBLE1BQ2hCO0FBQUEsTUFDQSxXQUFVO0FBQUEsS0FDWixDQUNGO0FBQUEsRUFFSixXQUFXLFVBQVU7QUFDbkIsOEJBQU8sWUFBWSxtQ0FBbUM7QUFFdEQsOEJBQ0UsU0FBUyxzQ0FBeUMsUUFBUSxLQUMxRCw2RUFDRjtBQUVBLFVBQU0sWUFDSixTQUFTLHVCQUNULFNBQVM7QUFDWCx1QkFDRSx3RkFDRSxtREFBQztBQUFBLE1BQ0MsV0FBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLFFBQ0wsaUJBQWlCLFFBQVEsVUFBVSxVQUFVO0FBQUEsV0FDekMsWUFBWSxFQUFFLFFBQVEsUUFBUSxLQUFLLEtBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDO0FBQUEsTUFDbEU7QUFBQSxLQUNGLEdBQ0MsU0FBUyxzQ0FDUixtREFBQztBQUFBLE1BQUksV0FBVTtBQUFBLE9BQWdDLEtBQUssTUFBTSxDQUFFLENBRWhFO0FBQUEsRUFFSixXQUFXLGNBQWM7QUFDdkIsdUJBQ0UsbURBQUM7QUFBQSxNQUNDLFdBQVcsK0JBQ1QsdUJBQ0Esb0NBQ0Y7QUFBQSxLQUNGO0FBQUEsRUFFSixXQUFXLFlBQVk7QUFDckIsdUJBQ0UsbURBQUM7QUFBQSxNQUNDLFdBQVcsK0JBQ1QsdUJBQ0EsbUNBQ0Y7QUFBQSxLQUNGO0FBQUEsRUFFSixXQUFXLG1CQUFtQjtBQUM1Qix1QkFDRSxtREFBQztBQUFBLE1BQ0MsZUFBWTtBQUFBLE1BQ1osV0FBVTtBQUFBLE1BQ1YsT0FBTyxFQUFFLFVBQVUsS0FBSyxLQUFLLE9BQU8sSUFBSSxFQUFFO0FBQUEsT0FFekMsUUFDSDtBQUFBLEVBRUosT0FBTztBQUNMLHVCQUNFLG1EQUFDO0FBQUEsTUFDQyxXQUFXLCtCQUNULHVCQUNBLHdCQUF3QixrQkFDMUI7QUFBQSxLQUNGO0FBQUEsRUFFSjtBQUVBLE1BQUk7QUFDSixRQUFNLG9CQUFvQiwrQkFDeEIsMkJBQ0EsNEJBQTRCLE9BQzlCO0FBQ0EsTUFBSSxTQUFTO0FBQ1gsZUFDRSxtREFBQztBQUFBLE1BQU8sV0FBVztBQUFBLE1BQW1CLE1BQUs7QUFBQSxNQUFTO0FBQUEsT0FDakQsZ0JBQ0g7QUFBQSxFQUVKLE9BQU87QUFDTCxlQUFXLG1EQUFDO0FBQUEsTUFBSSxXQUFXO0FBQUEsT0FBb0IsZ0JBQWlCO0FBQUEsRUFDbEU7QUFFQSxNQUFJO0FBQ0osUUFBTSxZQUFZLGNBQWMsSUFBSTtBQUNwQyxNQUNFLFNBQ0EsU0FDQSxDQUFDLGNBQ0QsYUFDQSwwQ0FBZSxLQUFLLEtBQ3BCLDhDQUFpQixHQUNqQjtBQUNBLFVBQU0saUJBQWlCLG1CQUFtQixJQUFJO0FBQzlDLFVBQU0sYUFDSixVQUFVLHNCQUFVLFFBQVEsdUNBQWdCLFFBQVEsdUNBQWdCO0FBQ3RFLFVBQU0saUJBQWlCLGtFQUNyQixPQUNBLFdBQ0EsVUFDRjtBQUNBLFFBQUksZ0JBQWdCO0FBQ2xCLFlBQU0saUJBQWdDO0FBQUEsUUFDcEMsT0FBTztBQUFBLFFBQ1AsUUFBUTtBQUFBLFdBQ0w7QUFBQSxNQUNMO0FBQ0EsVUFBSSxjQUFjO0FBQ2hCLG9CQUNFLG1EQUFDO0FBQUEsVUFDQyxjQUFZLE1BQU07QUFBQSxVQUNsQixXQUFVO0FBQUEsVUFDVixTQUFTO0FBQUEsVUFDVCxPQUFPO0FBQUEsWUFDTCxpQkFBaUIsUUFBUSxVQUFVLGNBQWM7QUFBQSxlQUM5QztBQUFBLFVBQ0w7QUFBQSxVQUNBLE1BQUs7QUFBQSxTQUNQO0FBQUEsTUFFSixPQUFPO0FBQ0wsb0JBQ0UsbURBQUM7QUFBQSxVQUNDLEtBQUssTUFBTTtBQUFBLFVBQ1gsV0FBVTtBQUFBLFVBQ1YsS0FBSztBQUFBLFVBQ0wsT0FBTztBQUFBLFNBQ1Q7QUFBQSxNQUVKO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUNFLG1EQUFDO0FBQUEsSUFDQyxjQUFZLEtBQUssb0JBQW9CLENBQUMsS0FBSyxDQUFDO0FBQUEsSUFDNUMsV0FBVywrQkFDVCxpQkFDQSxXQUFXLDhCQUE4QiwyQkFDekMsUUFBUSxTQUFTLEtBQUssNkJBQ3RCLGNBQWMsMEJBQVcsVUFBVSxxQ0FDbkMsU0FDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsVUFBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxLQUVKLFVBQ0EsU0FDSDtBQUVKLEdBM05nRDtBQThOekMsdUJBQXVCLFlBQXdDO0FBQ3BFLE1BQUksYUFBYSxJQUFJO0FBQ25CLFdBQU87QUFBQSxFQUNUO0FBQ0EsTUFBSSxjQUFjLElBQUk7QUFDcEIsV0FBTztBQUFBLEVBQ1Q7QUFDQSxNQUFJLGNBQWMsSUFBSTtBQUNwQixXQUFPO0FBQUEsRUFDVDtBQUNBLE1BQUksY0FBYyxLQUFLO0FBQ3JCLFdBQU87QUFBQSxFQUNUO0FBQ0EsU0FBTyxLQUFLLE1BQU0sYUFBYSxHQUFHO0FBQ3BDO0FBZGdCLEFBaUJULDRCQUNMLFlBQzhCO0FBQzlCLFNBQU8sd0JBQXdCLElBQUksVUFBVSxLQUFLLEVBQUUsUUFBUSxHQUFHLE9BQU8sRUFBRTtBQUMxRTtBQUpnQiIsCiAgIm5hbWVzIjogW10KfQo=
