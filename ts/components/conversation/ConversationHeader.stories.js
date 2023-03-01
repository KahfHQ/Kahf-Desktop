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
var ConversationHeader_stories_exports = {};
__export(ConversationHeader_stories_exports, {
  Group: () => Group,
  PrivateConvo: () => PrivateConvo,
  default: () => ConversationHeader_stories_default
});
module.exports = __toCommonJS(ConversationHeader_stories_exports);
var import_react = __toESM(require("react"));
var import_addon_actions = require("@storybook/addon-actions");
var import_getDefaultConversation = require("../../test-both/helpers/getDefaultConversation");
var import_getRandomColor = require("../../test-both/helpers/getRandomColor");
var import_setupI18n = require("../../util/setupI18n");
var import_messages = __toESM(require("../../../_locales/en/messages.json"));
var import_StorybookThemeContext = require("../../../.storybook/StorybookThemeContext");
var import_ConversationHeader = require("./ConversationHeader");
var import_Fixtures = require("../../storybook/Fixtures");
var ConversationHeader_stories_default = {
  title: "Components/Conversation/ConversationHeader"
};
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
const commonProps = {
  ...(0, import_getDefaultConversation.getDefaultConversation)(),
  showBackButton: false,
  outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.Both,
  i18n,
  onShowConversationDetails: (0, import_addon_actions.action)("onShowConversationDetails"),
  onSetDisappearingMessages: (0, import_addon_actions.action)("onSetDisappearingMessages"),
  onDeleteMessages: (0, import_addon_actions.action)("onDeleteMessages"),
  onSearchInConversation: (0, import_addon_actions.action)("onSearchInConversation"),
  onSetMuteNotifications: (0, import_addon_actions.action)("onSetMuteNotifications"),
  onOutgoingAudioCallInConversation: (0, import_addon_actions.action)("onOutgoingAudioCallInConversation"),
  onOutgoingVideoCallInConversation: (0, import_addon_actions.action)("onOutgoingVideoCallInConversation"),
  onShowAllMedia: (0, import_addon_actions.action)("onShowAllMedia"),
  onShowGroupMembers: (0, import_addon_actions.action)("onShowGroupMembers"),
  onGoBack: (0, import_addon_actions.action)("onGoBack"),
  onArchive: (0, import_addon_actions.action)("onArchive"),
  onMarkUnread: (0, import_addon_actions.action)("onMarkUnread"),
  onMoveToInbox: (0, import_addon_actions.action)("onMoveToInbox"),
  onSetPin: (0, import_addon_actions.action)("onSetPin"),
  viewUserStories: (0, import_addon_actions.action)("viewUserStories")
};
const PrivateConvo = /* @__PURE__ */ __name(() => {
  const items = [
    {
      title: "With name and profile, verified",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        isVerified: true,
        avatarPath: import_Fixtures.gifUrl,
        title: "Someone \u{1F525} Somewhere",
        name: "Someone \u{1F525} Somewhere",
        phoneNumber: "(202) 555-0001",
        type: "direct",
        id: "1",
        profileName: "\u{1F525}Flames\u{1F525}",
        acceptedMessageRequest: true
      }
    },
    {
      title: "With name, not verified, no avatar",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        isVerified: false,
        title: "Someone \u{1F525} Somewhere",
        name: "Someone \u{1F525} Somewhere",
        phoneNumber: "(202) 555-0002",
        type: "direct",
        id: "2",
        acceptedMessageRequest: true
      }
    },
    {
      title: "With name, not verified, descenders",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        isVerified: false,
        title: "Joyrey \u{1F525} Leppey",
        name: "Joyrey \u{1F525} Leppey",
        phoneNumber: "(202) 555-0002",
        type: "direct",
        id: "3",
        acceptedMessageRequest: true
      }
    },
    {
      title: "Profile, no name",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        isVerified: false,
        phoneNumber: "(202) 555-0003",
        type: "direct",
        id: "4",
        title: "\u{1F525}Flames\u{1F525}",
        profileName: "\u{1F525}Flames\u{1F525}",
        acceptedMessageRequest: true
      }
    },
    {
      title: "No name, no profile, no color",
      props: {
        ...commonProps,
        title: "(202) 555-0011",
        phoneNumber: "(202) 555-0011",
        type: "direct",
        id: "5",
        acceptedMessageRequest: true
      }
    },
    {
      title: "With back button",
      props: {
        ...commonProps,
        showBackButton: true,
        color: (0, import_getRandomColor.getRandomColor)(),
        phoneNumber: "(202) 555-0004",
        title: "(202) 555-0004",
        type: "direct",
        id: "6",
        acceptedMessageRequest: true
      }
    },
    {
      title: "Disappearing messages set",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0005",
        phoneNumber: "(202) 555-0005",
        type: "direct",
        id: "7",
        expireTimer: 10,
        acceptedMessageRequest: true
      }
    },
    {
      title: "Disappearing messages + verified",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0005",
        phoneNumber: "(202) 555-0005",
        type: "direct",
        id: "8",
        expireTimer: 300,
        acceptedMessageRequest: true,
        isVerified: true,
        canChangeTimer: true
      }
    },
    {
      title: "Muting Conversation",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0006",
        phoneNumber: "(202) 555-0006",
        type: "direct",
        id: "9",
        acceptedMessageRequest: true,
        muteExpiresAt: new Date("3000-10-18T11:11:11Z").valueOf()
      }
    },
    {
      title: "SMS-only conversation",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0006",
        phoneNumber: "(202) 555-0006",
        type: "direct",
        id: "10",
        acceptedMessageRequest: true,
        isSMSOnly: true
      }
    }
  ];
  const theme = (0, import_react.useContext)(import_StorybookThemeContext.StorybookThemeContext);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, items.map(({ title: subtitle, props }, i) => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: i
    }, subtitle ? /* @__PURE__ */ import_react.default.createElement("h3", null, subtitle) : null, /* @__PURE__ */ import_react.default.createElement(import_ConversationHeader.ConversationHeader, {
      ...props,
      theme
    }));
  }));
}, "PrivateConvo");
PrivateConvo.story = {
  name: "1:1 conversation"
};
const Group = /* @__PURE__ */ __name(() => {
  const items = [
    {
      title: "Basic",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "Typescript support group",
        name: "Typescript support group",
        phoneNumber: "",
        id: "11",
        type: "group",
        expireTimer: 10,
        acceptedMessageRequest: true,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.JustVideo
      }
    },
    {
      title: "In a group you left - no disappearing messages",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "Typescript support group",
        name: "Typescript support group",
        phoneNumber: "",
        id: "12",
        type: "group",
        left: true,
        expireTimer: 10,
        acceptedMessageRequest: true,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.JustVideo
      }
    },
    {
      title: "In a group with an active group call",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "Typescript support group",
        name: "Typescript support group",
        phoneNumber: "",
        id: "13",
        type: "group",
        expireTimer: 10,
        acceptedMessageRequest: true,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.Join
      }
    },
    {
      title: "In a forever muted group",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "Way too many messages",
        name: "Way too many messages",
        phoneNumber: "",
        id: "14",
        type: "group",
        expireTimer: 10,
        acceptedMessageRequest: true,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.JustVideo,
        muteExpiresAt: Infinity
      }
    }
  ];
  const theme = (0, import_react.useContext)(import_StorybookThemeContext.StorybookThemeContext);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, items.map(({ title: subtitle, props }, i) => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: i
    }, subtitle ? /* @__PURE__ */ import_react.default.createElement("h3", null, subtitle) : null, /* @__PURE__ */ import_react.default.createElement(import_ConversationHeader.ConversationHeader, {
      ...props,
      theme
    }));
  }));
}, "Group");
Group.story = {
  name: "In a group"
};
const NoteToSelf = /* @__PURE__ */ __name(() => {
  const items = [
    {
      title: "In chat with yourself",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0007",
        phoneNumber: "(202) 555-0007",
        id: "15",
        type: "direct",
        isMe: true,
        acceptedMessageRequest: true,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.None
      }
    }
  ];
  const theme = (0, import_react.useContext)(import_StorybookThemeContext.StorybookThemeContext);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, items.map(({ title: subtitle, props }, i) => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: i
    }, subtitle ? /* @__PURE__ */ import_react.default.createElement("h3", null, subtitle) : null, /* @__PURE__ */ import_react.default.createElement(import_ConversationHeader.ConversationHeader, {
      ...props,
      theme
    }));
  }));
}, "NoteToSelf");
NoteToSelf.story = {
  name: "Note to Self"
};
const Unaccepted = /* @__PURE__ */ __name(() => {
  const items = [
    {
      title: "1:1 conversation",
      props: {
        ...commonProps,
        color: (0, import_getRandomColor.getRandomColor)(),
        title: "(202) 555-0007",
        phoneNumber: "(202) 555-0007",
        id: "16",
        type: "direct",
        isMe: false,
        acceptedMessageRequest: false,
        outgoingCallButtonStyle: import_ConversationHeader.OutgoingCallButtonStyle.None
      }
    }
  ];
  const theme = (0, import_react.useContext)(import_StorybookThemeContext.StorybookThemeContext);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, items.map(({ title: subtitle, props }, i) => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      key: i
    }, subtitle ? /* @__PURE__ */ import_react.default.createElement("h3", null, subtitle) : null, /* @__PURE__ */ import_react.default.createElement(import_ConversationHeader.ConversationHeader, {
      ...props,
      theme
    }));
  }));
}, "Unaccepted");
Unaccepted.story = {
  name: "Unaccepted"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Group,
  PrivateConvo
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uSGVhZGVyLnN0b3JpZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnMnO1xuXG5pbXBvcnQgeyBnZXREZWZhdWx0Q29udmVyc2F0aW9uIH0gZnJvbSAnLi4vLi4vdGVzdC1ib3RoL2hlbHBlcnMvZ2V0RGVmYXVsdENvbnZlcnNhdGlvbic7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uLy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldFJhbmRvbUNvbG9yJztcbmltcG9ydCB7IHNldHVwSTE4biB9IGZyb20gJy4uLy4uL3V0aWwvc2V0dXBJMThuJztcbmltcG9ydCBlbk1lc3NhZ2VzIGZyb20gJy4uLy4uLy4uL19sb2NhbGVzL2VuL21lc3NhZ2VzLmpzb24nO1xuaW1wb3J0IHsgU3Rvcnlib29rVGhlbWVDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vLnN0b3J5Ym9vay9TdG9yeWJvb2tUaGVtZUNvbnRleHQnO1xuaW1wb3J0IHtcbiAgQ29udmVyc2F0aW9uSGVhZGVyLFxuICBPdXRnb2luZ0NhbGxCdXR0b25TdHlsZSxcbn0gZnJvbSAnLi9Db252ZXJzYXRpb25IZWFkZXInO1xuaW1wb3J0IHsgZ2lmVXJsIH0gZnJvbSAnLi4vLi4vc3Rvcnlib29rL0ZpeHR1cmVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0aXRsZTogJ0NvbXBvbmVudHMvQ29udmVyc2F0aW9uL0NvbnZlcnNhdGlvbkhlYWRlcicsXG59O1xuXG5jb25zdCBpMThuID0gc2V0dXBJMThuKCdlbicsIGVuTWVzc2FnZXMpO1xuXG50eXBlIEl0ZW1zVHlwZSA9IEFycmF5PHtcbiAgdGl0bGU6IHN0cmluZztcbiAgcHJvcHM6IE9taXQ8Q29tcG9uZW50UHJvcHM8dHlwZW9mIENvbnZlcnNhdGlvbkhlYWRlcj4sICd0aGVtZSc+O1xufT47XG5cbmNvbnN0IGNvbW1vblByb3BzID0ge1xuICAuLi5nZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG5cbiAgc2hvd0JhY2tCdXR0b246IGZhbHNlLFxuICBvdXRnb2luZ0NhbGxCdXR0b25TdHlsZTogT3V0Z29pbmdDYWxsQnV0dG9uU3R5bGUuQm90aCxcblxuICBpMThuLFxuXG4gIG9uU2hvd0NvbnZlcnNhdGlvbkRldGFpbHM6IGFjdGlvbignb25TaG93Q29udmVyc2F0aW9uRGV0YWlscycpLFxuICBvblNldERpc2FwcGVhcmluZ01lc3NhZ2VzOiBhY3Rpb24oJ29uU2V0RGlzYXBwZWFyaW5nTWVzc2FnZXMnKSxcbiAgb25EZWxldGVNZXNzYWdlczogYWN0aW9uKCdvbkRlbGV0ZU1lc3NhZ2VzJyksXG4gIG9uU2VhcmNoSW5Db252ZXJzYXRpb246IGFjdGlvbignb25TZWFyY2hJbkNvbnZlcnNhdGlvbicpLFxuICBvblNldE11dGVOb3RpZmljYXRpb25zOiBhY3Rpb24oJ29uU2V0TXV0ZU5vdGlmaWNhdGlvbnMnKSxcbiAgb25PdXRnb2luZ0F1ZGlvQ2FsbEluQ29udmVyc2F0aW9uOiBhY3Rpb24oXG4gICAgJ29uT3V0Z29pbmdBdWRpb0NhbGxJbkNvbnZlcnNhdGlvbidcbiAgKSxcbiAgb25PdXRnb2luZ1ZpZGVvQ2FsbEluQ29udmVyc2F0aW9uOiBhY3Rpb24oXG4gICAgJ29uT3V0Z29pbmdWaWRlb0NhbGxJbkNvbnZlcnNhdGlvbidcbiAgKSxcblxuICBvblNob3dBbGxNZWRpYTogYWN0aW9uKCdvblNob3dBbGxNZWRpYScpLFxuICBvblNob3dHcm91cE1lbWJlcnM6IGFjdGlvbignb25TaG93R3JvdXBNZW1iZXJzJyksXG4gIG9uR29CYWNrOiBhY3Rpb24oJ29uR29CYWNrJyksXG5cbiAgb25BcmNoaXZlOiBhY3Rpb24oJ29uQXJjaGl2ZScpLFxuICBvbk1hcmtVbnJlYWQ6IGFjdGlvbignb25NYXJrVW5yZWFkJyksXG4gIG9uTW92ZVRvSW5ib3g6IGFjdGlvbignb25Nb3ZlVG9JbmJveCcpLFxuICBvblNldFBpbjogYWN0aW9uKCdvblNldFBpbicpLFxuICB2aWV3VXNlclN0b3JpZXM6IGFjdGlvbigndmlld1VzZXJTdG9yaWVzJyksXG59O1xuXG5leHBvcnQgY29uc3QgUHJpdmF0ZUNvbnZvID0gKCk6IEpTWC5FbGVtZW50ID0+IHtcbiAgY29uc3QgaXRlbXM6IEl0ZW1zVHlwZSA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ1dpdGggbmFtZSBhbmQgcHJvZmlsZSwgdmVyaWZpZWQnLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICBpc1ZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBhdmF0YXJQYXRoOiBnaWZVcmwsXG4gICAgICAgIHRpdGxlOiAnU29tZW9uZSBcdUQ4M0RcdUREMjUgU29tZXdoZXJlJyxcbiAgICAgICAgbmFtZTogJ1NvbWVvbmUgXHVEODNEXHVERDI1IFNvbWV3aGVyZScsXG4gICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDEnLFxuICAgICAgICB0eXBlOiAnZGlyZWN0JyxcbiAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgcHJvZmlsZU5hbWU6ICdcdUQ4M0RcdUREMjVGbGFtZXNcdUQ4M0RcdUREMjUnLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnV2l0aCBuYW1lLCBub3QgdmVyaWZpZWQsIG5vIGF2YXRhcicsXG4gICAgICBwcm9wczoge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgIGlzVmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICB0aXRsZTogJ1NvbWVvbmUgXHVEODNEXHVERDI1IFNvbWV3aGVyZScsXG4gICAgICAgIG5hbWU6ICdTb21lb25lIFx1RDgzRFx1REQyNSBTb21ld2hlcmUnLFxuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0wMDAyJyxcbiAgICAgICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgICAgIGlkOiAnMicsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdXaXRoIG5hbWUsIG5vdCB2ZXJpZmllZCwgZGVzY2VuZGVycycsXG4gICAgICBwcm9wczoge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgIGlzVmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICB0aXRsZTogJ0pveXJleSBcdUQ4M0RcdUREMjUgTGVwcGV5JyxcbiAgICAgICAgbmFtZTogJ0pveXJleSBcdUQ4M0RcdUREMjUgTGVwcGV5JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwMicsXG4gICAgICAgIHR5cGU6ICdkaXJlY3QnLFxuICAgICAgICBpZDogJzMnLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUHJvZmlsZSwgbm8gbmFtZScsXG4gICAgICBwcm9wczoge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgIGlzVmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0wMDAzJyxcbiAgICAgICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgICAgIGlkOiAnNCcsXG4gICAgICAgIHRpdGxlOiAnXHVEODNEXHVERDI1RmxhbWVzXHVEODNEXHVERDI1JyxcbiAgICAgICAgcHJvZmlsZU5hbWU6ICdcdUQ4M0RcdUREMjVGbGFtZXNcdUQ4M0RcdUREMjUnLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnTm8gbmFtZSwgbm8gcHJvZmlsZSwgbm8gY29sb3InLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIHRpdGxlOiAnKDIwMikgNTU1LTAwMTEnLFxuICAgICAgICBwaG9uZU51bWJlcjogJygyMDIpIDU1NS0wMDExJyxcbiAgICAgICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgICAgIGlkOiAnNScsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdXaXRoIGJhY2sgYnV0dG9uJyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBzaG93QmFja0J1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDQnLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA0JyxcbiAgICAgICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgICAgIGlkOiAnNicsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdEaXNhcHBlYXJpbmcgbWVzc2FnZXMgc2V0JyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBjb2xvcjogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICAgICAgdGl0bGU6ICcoMjAyKSA1NTUtMDAwNScsXG4gICAgICAgIHBob25lTnVtYmVyOiAnKDIwMikgNTU1LTAwMDUnLFxuICAgICAgICB0eXBlOiAnZGlyZWN0JyxcbiAgICAgICAgaWQ6ICc3JyxcbiAgICAgICAgZXhwaXJlVGltZXI6IDEwLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnRGlzYXBwZWFyaW5nIG1lc3NhZ2VzICsgdmVyaWZpZWQnLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA1JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwNScsXG4gICAgICAgIHR5cGU6ICdkaXJlY3QnLFxuICAgICAgICBpZDogJzgnLFxuICAgICAgICBleHBpcmVUaW1lcjogMzAwLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgICBpc1ZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBjYW5DaGFuZ2VUaW1lcjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ011dGluZyBDb252ZXJzYXRpb24nLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA2JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwNicsXG4gICAgICAgIHR5cGU6ICdkaXJlY3QnLFxuICAgICAgICBpZDogJzknLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgICBtdXRlRXhwaXJlc0F0OiBuZXcgRGF0ZSgnMzAwMC0xMC0xOFQxMToxMToxMVonKS52YWx1ZU9mKCksXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdTTVMtb25seSBjb252ZXJzYXRpb24nLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA2JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwNicsXG4gICAgICAgIHR5cGU6ICdkaXJlY3QnLFxuICAgICAgICBpZDogJzEwJyxcbiAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogdHJ1ZSxcbiAgICAgICAgaXNTTVNPbmx5OiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IHRoZW1lID0gdXNlQ29udGV4dChTdG9yeWJvb2tUaGVtZUNvbnRleHQpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtpdGVtcy5tYXAoKHsgdGl0bGU6IHN1YnRpdGxlLCBwcm9wcyB9LCBpKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2l9PlxuICAgICAgICAgICAge3N1YnRpdGxlID8gPGgzPntzdWJ0aXRsZX08L2gzPiA6IG51bGx9XG4gICAgICAgICAgICA8Q29udmVyc2F0aW9uSGVhZGVyIHsuLi5wcm9wc30gdGhlbWU9e3RoZW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgPC8+XG4gICk7XG59O1xuXG5Qcml2YXRlQ29udm8uc3RvcnkgPSB7XG4gIG5hbWU6ICcxOjEgY29udmVyc2F0aW9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBHcm91cCA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IGl0ZW1zOiBJdGVtc1R5cGUgPSBbXG4gICAge1xuICAgICAgdGl0bGU6ICdCYXNpYycsXG4gICAgICBwcm9wczoge1xuICAgICAgICAuLi5jb21tb25Qcm9wcyxcbiAgICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgIHRpdGxlOiAnVHlwZXNjcmlwdCBzdXBwb3J0IGdyb3VwJyxcbiAgICAgICAgbmFtZTogJ1R5cGVzY3JpcHQgc3VwcG9ydCBncm91cCcsXG4gICAgICAgIHBob25lTnVtYmVyOiAnJyxcbiAgICAgICAgaWQ6ICcxMScsXG4gICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgIGV4cGlyZVRpbWVyOiAxMCxcbiAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogdHJ1ZSxcbiAgICAgICAgb3V0Z29pbmdDYWxsQnV0dG9uU3R5bGU6IE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlLkp1c3RWaWRlbyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0luIGEgZ3JvdXAgeW91IGxlZnQgLSBubyBkaXNhcHBlYXJpbmcgbWVzc2FnZXMnLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJ1R5cGVzY3JpcHQgc3VwcG9ydCBncm91cCcsXG4gICAgICAgIG5hbWU6ICdUeXBlc2NyaXB0IHN1cHBvcnQgZ3JvdXAnLFxuICAgICAgICBwaG9uZU51bWJlcjogJycsXG4gICAgICAgIGlkOiAnMTInLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICBsZWZ0OiB0cnVlLFxuICAgICAgICBleHBpcmVUaW1lcjogMTAsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICAgIG91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlOiBPdXRnb2luZ0NhbGxCdXR0b25TdHlsZS5KdXN0VmlkZW8sXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdJbiBhIGdyb3VwIHdpdGggYW4gYWN0aXZlIGdyb3VwIGNhbGwnLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJ1R5cGVzY3JpcHQgc3VwcG9ydCBncm91cCcsXG4gICAgICAgIG5hbWU6ICdUeXBlc2NyaXB0IHN1cHBvcnQgZ3JvdXAnLFxuICAgICAgICBwaG9uZU51bWJlcjogJycsXG4gICAgICAgIGlkOiAnMTMnLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICBleHBpcmVUaW1lcjogMTAsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICAgIG91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlOiBPdXRnb2luZ0NhbGxCdXR0b25TdHlsZS5Kb2luLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnSW4gYSBmb3JldmVyIG11dGVkIGdyb3VwJyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIC4uLmNvbW1vblByb3BzLFxuICAgICAgICBjb2xvcjogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICAgICAgdGl0bGU6ICdXYXkgdG9vIG1hbnkgbWVzc2FnZXMnLFxuICAgICAgICBuYW1lOiAnV2F5IHRvbyBtYW55IG1lc3NhZ2VzJyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcnLFxuICAgICAgICBpZDogJzE0JyxcbiAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgZXhwaXJlVGltZXI6IDEwLFxuICAgICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgICBvdXRnb2luZ0NhbGxCdXR0b25TdHlsZTogT3V0Z29pbmdDYWxsQnV0dG9uU3R5bGUuSnVzdFZpZGVvLFxuICAgICAgICBtdXRlRXhwaXJlc0F0OiBJbmZpbml0eSxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcblxuICBjb25zdCB0aGVtZSA9IHVzZUNvbnRleHQoU3Rvcnlib29rVGhlbWVDb250ZXh0KTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7aXRlbXMubWFwKCh7IHRpdGxlOiBzdWJ0aXRsZSwgcHJvcHMgfSwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpfT5cbiAgICAgICAgICAgIHtzdWJ0aXRsZSA/IDxoMz57c3VidGl0bGV9PC9oMz4gOiBudWxsfVxuICAgICAgICAgICAgPENvbnZlcnNhdGlvbkhlYWRlciB7Li4ucHJvcHN9IHRoZW1lPXt0aGVtZX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvPlxuICApO1xufTtcblxuR3JvdXAuc3RvcnkgPSB7XG4gIG5hbWU6ICdJbiBhIGdyb3VwJyxcbn07XG5cbmNvbnN0IE5vdGVUb1NlbGYgPSAoKSA9PiB7XG4gIGNvbnN0IGl0ZW1zOiBJdGVtc1R5cGUgPSBbXG4gICAge1xuICAgICAgdGl0bGU6ICdJbiBjaGF0IHdpdGggeW91cnNlbGYnLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA3JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwNycsXG4gICAgICAgIGlkOiAnMTUnLFxuICAgICAgICB0eXBlOiAnZGlyZWN0JyxcbiAgICAgICAgaXNNZTogdHJ1ZSxcbiAgICAgICAgYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdDogdHJ1ZSxcbiAgICAgICAgb3V0Z29pbmdDYWxsQnV0dG9uU3R5bGU6IE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlLk5vbmUsXG4gICAgICB9LFxuICAgIH0sXG4gIF07XG5cbiAgY29uc3QgdGhlbWUgPSB1c2VDb250ZXh0KFN0b3J5Ym9va1RoZW1lQ29udGV4dCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2l0ZW1zLm1hcCgoeyB0aXRsZTogc3VidGl0bGUsIHByb3BzIH0sIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGtleT17aX0+XG4gICAgICAgICAgICB7c3VidGl0bGUgPyA8aDM+e3N1YnRpdGxlfTwvaDM+IDogbnVsbH1cbiAgICAgICAgICAgIDxDb252ZXJzYXRpb25IZWFkZXIgey4uLnByb3BzfSB0aGVtZT17dGhlbWV9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8Lz5cbiAgKTtcbn07XG5cbk5vdGVUb1NlbGYuc3RvcnkgPSB7XG4gIG5hbWU6ICdOb3RlIHRvIFNlbGYnLFxufTtcblxuY29uc3QgVW5hY2NlcHRlZCA9ICgpID0+IHtcbiAgY29uc3QgaXRlbXM6IEl0ZW1zVHlwZSA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJzE6MSBjb252ZXJzYXRpb24nLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4uY29tbW9uUHJvcHMsXG4gICAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgICAgICB0aXRsZTogJygyMDIpIDU1NS0wMDA3JyxcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcoMjAyKSA1NTUtMDAwNycsXG4gICAgICAgIGlkOiAnMTYnLFxuICAgICAgICB0eXBlOiAnZGlyZWN0JyxcbiAgICAgICAgaXNNZTogZmFsc2UsXG4gICAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IGZhbHNlLFxuICAgICAgICBvdXRnb2luZ0NhbGxCdXR0b25TdHlsZTogT3V0Z29pbmdDYWxsQnV0dG9uU3R5bGUuTm9uZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcblxuICBjb25zdCB0aGVtZSA9IHVzZUNvbnRleHQoU3Rvcnlib29rVGhlbWVDb250ZXh0KTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7aXRlbXMubWFwKCh7IHRpdGxlOiBzdWJ0aXRsZSwgcHJvcHMgfSwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpfT5cbiAgICAgICAgICAgIHtzdWJ0aXRsZSA/IDxoMz57c3VidGl0bGV9PC9oMz4gOiBudWxsfVxuICAgICAgICAgICAgPENvbnZlcnNhdGlvbkhlYWRlciB7Li4ucHJvcHN9IHRoZW1lPXt0aGVtZX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvPlxuICApO1xufTtcblxuVW5hY2NlcHRlZC5zdG9yeSA9IHtcbiAgbmFtZTogJ1VuYWNjZXB0ZWQnLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsbUJBQWtDO0FBRWxDLDJCQUF1QjtBQUV2QixvQ0FBdUM7QUFDdkMsNEJBQStCO0FBQy9CLHVCQUEwQjtBQUMxQixzQkFBdUI7QUFDdkIsbUNBQXNDO0FBQ3RDLGdDQUdPO0FBQ1Asc0JBQXVCO0FBRXZCLElBQU8scUNBQVE7QUFBQSxFQUNiLE9BQU87QUFDVDtBQUVBLE1BQU0sT0FBTyxnQ0FBVSxNQUFNLHVCQUFVO0FBT3ZDLE1BQU0sY0FBYztBQUFBLEtBQ2YsMERBQXVCO0FBQUEsRUFFMUIsZ0JBQWdCO0FBQUEsRUFDaEIseUJBQXlCLGtEQUF3QjtBQUFBLEVBRWpEO0FBQUEsRUFFQSwyQkFBMkIsaUNBQU8sMkJBQTJCO0FBQUEsRUFDN0QsMkJBQTJCLGlDQUFPLDJCQUEyQjtBQUFBLEVBQzdELGtCQUFrQixpQ0FBTyxrQkFBa0I7QUFBQSxFQUMzQyx3QkFBd0IsaUNBQU8sd0JBQXdCO0FBQUEsRUFDdkQsd0JBQXdCLGlDQUFPLHdCQUF3QjtBQUFBLEVBQ3ZELG1DQUFtQyxpQ0FDakMsbUNBQ0Y7QUFBQSxFQUNBLG1DQUFtQyxpQ0FDakMsbUNBQ0Y7QUFBQSxFQUVBLGdCQUFnQixpQ0FBTyxnQkFBZ0I7QUFBQSxFQUN2QyxvQkFBb0IsaUNBQU8sb0JBQW9CO0FBQUEsRUFDL0MsVUFB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
