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
var StoryDetailsModal_exports = {};
__export(StoryDetailsModal_exports, {
  StoryDetailsModal: () => StoryDetailsModal
});
module.exports = __toCommonJS(StoryDetailsModal_exports);
var import_react = __toESM(require("react"));
var import_filesize = __toESM(require("filesize"));
var import_Avatar = require("./Avatar");
var import_ContactName = require("./conversation/ContactName");
var import_ContextMenu = require("./ContextMenu");
var import_Intl = require("./Intl");
var import_Modal = require("./Modal");
var import_MessageSendState = require("../messages/MessageSendState");
var import_theme = require("../util/theme");
var import_Util = require("../types/Util");
var import_Time = require("./Time");
var import_timestamp = require("../util/timestamp");
var import_mapUtil = require("../util/mapUtil");
const contactSortCollator = new window.Intl.Collator();
function getI18nKey(sendStatus) {
  if (sendStatus === import_MessageSendState.SendStatus.Failed) {
    return "MessageDetailsHeader--Failed";
  }
  if (sendStatus === import_MessageSendState.SendStatus.Viewed) {
    return "MessageDetailsHeader--Viewed";
  }
  if (sendStatus === import_MessageSendState.SendStatus.Read) {
    return "MessageDetailsHeader--Read";
  }
  if (sendStatus === import_MessageSendState.SendStatus.Delivered) {
    return "MessageDetailsHeader--Delivered";
  }
  if (sendStatus === import_MessageSendState.SendStatus.Sent) {
    return "MessageDetailsHeader--Sent";
  }
  if (sendStatus === import_MessageSendState.SendStatus.Pending) {
    return "MessageDetailsHeader--Pending";
  }
  return "from";
}
const StoryDetailsModal = /* @__PURE__ */ __name(({
  getPreferredBadge,
  i18n,
  onClose,
  sender,
  sendState,
  size,
  timestamp
}) => {
  const contactsBySendStatus = sendState ? (0, import_mapUtil.groupBy)(sendState, (contact) => contact.status) : void 0;
  let content;
  if (contactsBySendStatus) {
    content = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact-container"
    }, [
      import_MessageSendState.SendStatus.Failed,
      import_MessageSendState.SendStatus.Viewed,
      import_MessageSendState.SendStatus.Read,
      import_MessageSendState.SendStatus.Delivered,
      import_MessageSendState.SendStatus.Sent,
      import_MessageSendState.SendStatus.Pending
    ].map((sendStatus) => {
      const contacts = contactsBySendStatus.get(sendStatus);
      if (!contacts) {
        return null;
      }
      const i18nKey = getI18nKey(sendStatus);
      const sortedContacts = [...contacts].sort((a, b) => contactSortCollator.compare(a.recipient.title, b.recipient.title));
      return /* @__PURE__ */ import_react.default.createElement("div", {
        key: i18nKey,
        className: "StoryDetailsModal__contact-group"
      }, /* @__PURE__ */ import_react.default.createElement("div", {
        className: "StoryDetailsModal__contact-group__header"
      }, i18n(i18nKey)), sortedContacts.map((status) => {
        const contact = status.recipient;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          key: contact.id,
          className: "StoryDetailsModal__contact"
        }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
          acceptedMessageRequest: contact.acceptedMessageRequest,
          avatarPath: contact.avatarPath,
          badge: getPreferredBadge(contact.badges),
          color: contact.color,
          conversationType: "direct",
          i18n,
          isMe: contact.isMe,
          name: contact.profileName,
          phoneNumber: contact.phoneNumber,
          profileName: contact.profileName,
          sharedGroupNames: contact.sharedGroupNames,
          size: import_Avatar.AvatarSize.THIRTY_SIX,
          theme: import_Util.ThemeType.dark,
          title: contact.title,
          unblurredAvatarPath: contact.unblurredAvatarPath
        }), /* @__PURE__ */ import_react.default.createElement("div", {
          className: "StoryDetailsModal__contact__text"
        }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
          title: contact.title
        })), status.updatedAt && /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
          className: "StoryDetailsModal__status-timestamp",
          timestamp: status.updatedAt
        }, (0, import_timestamp.formatDateTimeLong)(i18n, status.updatedAt)));
      }));
    }));
  } else {
    content = /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact-container"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact-group"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact-group__header"
    }, i18n("sent")), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact"
    }, /* @__PURE__ */ import_react.default.createElement(import_Avatar.Avatar, {
      acceptedMessageRequest: sender.acceptedMessageRequest,
      avatarPath: sender.avatarPath,
      badge: getPreferredBadge(sender.badges),
      color: sender.color,
      conversationType: "direct",
      i18n,
      isMe: sender.isMe,
      name: sender.profileName,
      profileName: sender.profileName,
      sharedGroupNames: sender.sharedGroupNames,
      size: import_Avatar.AvatarSize.THIRTY_SIX,
      theme: import_Util.ThemeType.dark,
      title: sender.title
    }), /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact__text"
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      className: "StoryDetailsModal__contact__name"
    }, /* @__PURE__ */ import_react.default.createElement(import_ContactName.ContactName, {
      title: sender.title
    }))), /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
      className: "StoryDetailsModal__status-timestamp",
      timestamp
    }, (0, import_timestamp.formatDateTimeLong)(i18n, timestamp)))));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
    hasXButton: true,
    i18n,
    moduleClassName: "StoryDetailsModal",
    onClose,
    useFocusTrap: false,
    theme: import_theme.Theme.Dark,
    title: /* @__PURE__ */ import_react.default.createElement(import_ContextMenu.ContextMenu, {
      i18n,
      menuOptions: [
        {
          icon: "StoryDetailsModal__copy-icon",
          label: i18n("StoryDetailsModal__copy-timestamp"),
          onClick: () => {
            window.navigator.clipboard.writeText(String(timestamp));
          }
        }
      ],
      moduleClassName: "StoryDetailsModal__debugger",
      popperOptions: {
        placement: "bottom",
        strategy: "absolute"
      },
      theme: import_theme.Theme.Dark
    }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
      i18n,
      id: "StoryDetailsModal__sent-time",
      components: [
        /* @__PURE__ */ import_react.default.createElement(import_Time.Time, {
          className: "StoryDetailsModal__debugger__button__text",
          timestamp
        }, (0, import_timestamp.formatDateTimeLong)(i18n, timestamp))
      ]
    })), size && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
      i18n,
      id: "StoryDetailsModal__file-size",
      components: [
        /* @__PURE__ */ import_react.default.createElement("span", {
          className: "StoryDetailsModal__debugger__button__text"
        }, (0, import_filesize.default)(size))
      ]
    })))
  }, content);
}, "StoryDetailsModal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryDetailsModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RvcnlEZXRhaWxzTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZm9ybWF0RmlsZVNpemUgZnJvbSAnZmlsZXNpemUnO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IFByZWZlcnJlZEJhZGdlU2VsZWN0b3JUeXBlIH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQgdHlwZSB7IFN0b3J5U2VuZFN0YXRlVHlwZSwgU3RvcnlWaWV3VHlwZSB9IGZyb20gJy4uL3R5cGVzL1N0b3JpZXMnO1xuaW1wb3J0IHsgQXZhdGFyLCBBdmF0YXJTaXplIH0gZnJvbSAnLi9BdmF0YXInO1xuaW1wb3J0IHsgQ29udGFjdE5hbWUgfSBmcm9tICcuL2NvbnZlcnNhdGlvbi9Db250YWN0TmFtZSc7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gJy4vQ29udGV4dE1lbnUnO1xuaW1wb3J0IHsgSW50bCB9IGZyb20gJy4vSW50bCc7XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJy4vTW9kYWwnO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICcuLi91dGlsL3RoZW1lJztcbmltcG9ydCB7IFRoZW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4vVGltZSc7XG5pbXBvcnQgeyBmb3JtYXREYXRlVGltZUxvbmcgfSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBncm91cEJ5IH0gZnJvbSAnLi4vdXRpbC9tYXBVdGlsJztcblxuZXhwb3J0IHR5cGUgUHJvcHNUeXBlID0ge1xuICBnZXRQcmVmZXJyZWRCYWRnZTogUHJlZmVycmVkQmFkZ2VTZWxlY3RvclR5cGU7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIG9uQ2xvc2U6ICgpID0+IHVua25vd247XG4gIHNlbmRlcjogU3RvcnlWaWV3VHlwZVsnc2VuZGVyJ107XG4gIHNlbmRTdGF0ZT86IEFycmF5PFN0b3J5U2VuZFN0YXRlVHlwZT47XG4gIHNpemU/OiBudW1iZXI7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufTtcblxuY29uc3QgY29udGFjdFNvcnRDb2xsYXRvciA9IG5ldyB3aW5kb3cuSW50bC5Db2xsYXRvcigpO1xuXG5mdW5jdGlvbiBnZXRJMThuS2V5KHNlbmRTdGF0dXM6IFNlbmRTdGF0dXMgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoc2VuZFN0YXR1cyA9PT0gU2VuZFN0YXR1cy5GYWlsZWQpIHtcbiAgICByZXR1cm4gJ01lc3NhZ2VEZXRhaWxzSGVhZGVyLS1GYWlsZWQnO1xuICB9XG5cbiAgaWYgKHNlbmRTdGF0dXMgPT09IFNlbmRTdGF0dXMuVmlld2VkKSB7XG4gICAgcmV0dXJuICdNZXNzYWdlRGV0YWlsc0hlYWRlci0tVmlld2VkJztcbiAgfVxuXG4gIGlmIChzZW5kU3RhdHVzID09PSBTZW5kU3RhdHVzLlJlYWQpIHtcbiAgICByZXR1cm4gJ01lc3NhZ2VEZXRhaWxzSGVhZGVyLS1SZWFkJztcbiAgfVxuXG4gIGlmIChzZW5kU3RhdHVzID09PSBTZW5kU3RhdHVzLkRlbGl2ZXJlZCkge1xuICAgIHJldHVybiAnTWVzc2FnZURldGFpbHNIZWFkZXItLURlbGl2ZXJlZCc7XG4gIH1cblxuICBpZiAoc2VuZFN0YXR1cyA9PT0gU2VuZFN0YXR1cy5TZW50KSB7XG4gICAgcmV0dXJuICdNZXNzYWdlRGV0YWlsc0hlYWRlci0tU2VudCc7XG4gIH1cblxuICBpZiAoc2VuZFN0YXR1cyA9PT0gU2VuZFN0YXR1cy5QZW5kaW5nKSB7XG4gICAgcmV0dXJuICdNZXNzYWdlRGV0YWlsc0hlYWRlci0tUGVuZGluZyc7XG4gIH1cblxuICByZXR1cm4gJ2Zyb20nO1xufVxuXG5leHBvcnQgY29uc3QgU3RvcnlEZXRhaWxzTW9kYWwgPSAoe1xuICBnZXRQcmVmZXJyZWRCYWRnZSxcbiAgaTE4bixcbiAgb25DbG9zZSxcbiAgc2VuZGVyLFxuICBzZW5kU3RhdGUsXG4gIHNpemUsXG4gIHRpbWVzdGFtcCxcbn06IFByb3BzVHlwZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgY29udGFjdHNCeVNlbmRTdGF0dXMgPSBzZW5kU3RhdGVcbiAgICA/IGdyb3VwQnkoc2VuZFN0YXRlLCBjb250YWN0ID0+IGNvbnRhY3Quc3RhdHVzKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIGxldCBjb250ZW50OiBKU1guRWxlbWVudDtcbiAgaWYgKGNvbnRhY3RzQnlTZW5kU3RhdHVzKSB7XG4gICAgY29udGVudCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxfX2NvbnRhY3QtY29udGFpbmVyXCI+XG4gICAgICAgIHtbXG4gICAgICAgICAgU2VuZFN0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgU2VuZFN0YXR1cy5WaWV3ZWQsXG4gICAgICAgICAgU2VuZFN0YXR1cy5SZWFkLFxuICAgICAgICAgIFNlbmRTdGF0dXMuRGVsaXZlcmVkLFxuICAgICAgICAgIFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgIF0ubWFwKHNlbmRTdGF0dXMgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnRhY3RzID0gY29udGFjdHNCeVNlbmRTdGF0dXMuZ2V0KHNlbmRTdGF0dXMpO1xuXG4gICAgICAgICAgaWYgKCFjb250YWN0cykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgaTE4bktleSA9IGdldEkxOG5LZXkoc2VuZFN0YXR1cyk7XG5cbiAgICAgICAgICBjb25zdCBzb3J0ZWRDb250YWN0cyA9IFsuLi5jb250YWN0c10uc29ydCgoYSwgYikgPT5cbiAgICAgICAgICAgIGNvbnRhY3RTb3J0Q29sbGF0b3IuY29tcGFyZShhLnJlY2lwaWVudC50aXRsZSwgYi5yZWNpcGllbnQudGl0bGUpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aTE4bktleX0gY2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxfX2NvbnRhY3QtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeURldGFpbHNNb2RhbF9fY29udGFjdC1ncm91cF9faGVhZGVyXCI+XG4gICAgICAgICAgICAgICAge2kxOG4oaTE4bktleSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7c29ydGVkQ29udGFjdHMubWFwKHN0YXR1cyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IHN0YXR1cy5yZWNpcGllbnQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2NvbnRhY3QuaWR9IGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19jb250YWN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0PXtjb250YWN0LmFjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICAgICAgICAgICAgYXZhdGFyUGF0aD17Y29udGFjdC5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICAgICAgICAgIGJhZGdlPXtnZXRQcmVmZXJyZWRCYWRnZShjb250YWN0LmJhZGdlcyl9XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I9e2NvbnRhY3QuY29sb3J9XG4gICAgICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uVHlwZT1cImRpcmVjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgICAgICAgICAgICBpc01lPXtjb250YWN0LmlzTWV9XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZT17Y29udGFjdC5wcm9maWxlTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwaG9uZU51bWJlcj17Y29udGFjdC5waG9uZU51bWJlcn1cbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlTmFtZT17Y29udGFjdC5wcm9maWxlTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtjb250YWN0LnNoYXJlZEdyb3VwTmFtZXN9XG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPXtUaGVtZVR5cGUuZGFya31cbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17Y29udGFjdC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICB1bmJsdXJyZWRBdmF0YXJQYXRoPXtjb250YWN0LnVuYmx1cnJlZEF2YXRhclBhdGh9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxfX2NvbnRhY3RfX3RleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8Q29udGFjdE5hbWUgdGl0bGU9e2NvbnRhY3QudGl0bGV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzLnVwZGF0ZWRBdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19zdGF0dXMtdGltZXN0YW1wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcD17c3RhdHVzLnVwZGF0ZWRBdH1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZVRpbWVMb25nKGkxOG4sIHN0YXR1cy51cGRhdGVkQXQpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvVGltZT5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnRlbnQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19jb250YWN0LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19jb250YWN0LWdyb3VwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeURldGFpbHNNb2RhbF9fY29udGFjdC1ncm91cF9faGVhZGVyXCI+XG4gICAgICAgICAgICB7aTE4bignc2VudCcpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxfX2NvbnRhY3RcIj5cbiAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdD17c2VuZGVyLmFjY2VwdGVkTWVzc2FnZVJlcXVlc3R9XG4gICAgICAgICAgICAgIGF2YXRhclBhdGg9e3NlbmRlci5hdmF0YXJQYXRofVxuICAgICAgICAgICAgICBiYWRnZT17Z2V0UHJlZmVycmVkQmFkZ2Uoc2VuZGVyLmJhZGdlcyl9XG4gICAgICAgICAgICAgIGNvbG9yPXtzZW5kZXIuY29sb3J9XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvblR5cGU9XCJkaXJlY3RcIlxuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICBpc01lPXtzZW5kZXIuaXNNZX1cbiAgICAgICAgICAgICAgbmFtZT17c2VuZGVyLnByb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICBwcm9maWxlTmFtZT17c2VuZGVyLnByb2ZpbGVOYW1lfVxuICAgICAgICAgICAgICBzaGFyZWRHcm91cE5hbWVzPXtzZW5kZXIuc2hhcmVkR3JvdXBOYW1lc31cbiAgICAgICAgICAgICAgc2l6ZT17QXZhdGFyU2l6ZS5USElSVFlfU0lYfVxuICAgICAgICAgICAgICB0aGVtZT17VGhlbWVUeXBlLmRhcmt9XG4gICAgICAgICAgICAgIHRpdGxlPXtzZW5kZXIudGl0bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJTdG9yeURldGFpbHNNb2RhbF9fY29udGFjdF9fdGV4dFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19jb250YWN0X19uYW1lXCI+XG4gICAgICAgICAgICAgICAgPENvbnRhY3ROYW1lIHRpdGxlPXtzZW5kZXIudGl0bGV9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8VGltZVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJTdG9yeURldGFpbHNNb2RhbF9fc3RhdHVzLXRpbWVzdGFtcFwiXG4gICAgICAgICAgICAgIHRpbWVzdGFtcD17dGltZXN0YW1wfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZVRpbWVMb25nKGkxOG4sIHRpbWVzdGFtcCl9XG4gICAgICAgICAgICA8L1RpbWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICBoYXNYQnV0dG9uXG4gICAgICBpMThuPXtpMThufVxuICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxcIlxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIHVzZUZvY3VzVHJhcD17ZmFsc2V9XG4gICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgIHRpdGxlPXtcbiAgICAgICAgPENvbnRleHRNZW51XG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICBtZW51T3B0aW9ucz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpY29uOiAnU3RvcnlEZXRhaWxzTW9kYWxfX2NvcHktaWNvbicsXG4gICAgICAgICAgICAgIGxhYmVsOiBpMThuKCdTdG9yeURldGFpbHNNb2RhbF9fY29weS10aW1lc3RhbXAnKSxcbiAgICAgICAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChTdHJpbmcodGltZXN0YW1wKSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF19XG4gICAgICAgICAgbW9kdWxlQ2xhc3NOYW1lPVwiU3RvcnlEZXRhaWxzTW9kYWxfX2RlYnVnZ2VyXCJcbiAgICAgICAgICBwb3BwZXJPcHRpb25zPXt7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgfX1cbiAgICAgICAgICB0aGVtZT17VGhlbWUuRGFya31cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8SW50bFxuICAgICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgICBpZD1cIlN0b3J5RGV0YWlsc01vZGFsX19zZW50LXRpbWVcIlxuICAgICAgICAgICAgICBjb21wb25lbnRzPXtbXG4gICAgICAgICAgICAgICAgPFRpbWVcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIlN0b3J5RGV0YWlsc01vZGFsX19kZWJ1Z2dlcl9fYnV0dG9uX190ZXh0XCJcbiAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcD17dGltZXN0YW1wfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlVGltZUxvbmcoaTE4biwgdGltZXN0YW1wKX1cbiAgICAgICAgICAgICAgICA8L1RpbWU+LFxuICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7c2l6ZSAmJiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SW50bFxuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgaWQ9XCJTdG9yeURldGFpbHNNb2RhbF9fZmlsZS1zaXplXCJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzPXtbXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJTdG9yeURldGFpbHNNb2RhbF9fZGVidWdnZXJfX2J1dHRvbl9fdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RmlsZVNpemUoc2l6ZSl9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+LFxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L0NvbnRleHRNZW51PlxuICAgICAgfVxuICAgID5cbiAgICAgIHtjb250ZW50fVxuICAgIDwvTW9kYWw+XG4gICk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQjtBQUNsQixzQkFBMkI7QUFJM0Isb0JBQW1DO0FBQ25DLHlC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
