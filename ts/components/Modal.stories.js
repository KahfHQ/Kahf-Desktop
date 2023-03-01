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
var Modal_stories_exports = {};
__export(Modal_stories_exports, {
  BareBonesLong: () => BareBonesLong,
  BareBonesLongWithButton: () => BareBonesLongWithButton,
  BareBonesShort: () => BareBonesShort,
  LongBodyWithLongTitleAndXButton: () => LongBodyWithLongTitleAndXButton,
  LongBodyWithTitle: () => LongBodyWithTitle,
  LongBodyWithTitleAndButton: () => LongBodyWithTitleAndButton,
  LotsOfButtonsInTheFooter: () => LotsOfButtonsInTheFooter,
  StickyFooterLotsOfButtons: () => StickyFooterLotsOfButtons,
  TitleXButtonBodyAndButtonFooter: () => TitleXButtonBodyAndButtonFooter,
  WithBackButton: () => WithBackButton,
  WithStickyButtonsLongBody: () => WithStickyButtonsLongBody,
  WithStickyButtonsShortBody: () => WithStickyButtonsShortBody,
  default: () => Modal_stories_default
});
module.exports = __toCommonJS(Modal_stories_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var import_addon_actions = require("@storybook/addon-actions");
var import_setupI18n = require("../util/setupI18n");
var import_messages = __toESM(require("../../_locales/en/messages.json"));
var import_Button = require("./Button");
var import_Modal = require("./Modal");
const i18n = (0, import_setupI18n.setupI18n)("en", import_messages.default);
var Modal_stories_default = {
  title: "Components/Modal"
};
const onClose = (0, import_addon_actions.action)("onClose");
const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.";
const BareBonesShort = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  useFocusTrap: false
}, "Hello world!"), "BareBonesShort");
BareBonesShort.story = {
  name: "Bare bones, short"
};
const BareBonesLong = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  useFocusTrap: false
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM)), "BareBonesLong");
BareBonesLong.story = {
  name: "Bare bones, long"
};
const BareBonesLongWithButton = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "BareBonesLongWithButton");
BareBonesLongWithButton.story = {
  name: "Bare bones, long, with button"
};
const TitleXButtonBodyAndButtonFooter = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  title: "Hello world",
  onClose,
  hasXButton: true
}, LOREM_IPSUM, /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "TitleXButtonBodyAndButtonFooter");
TitleXButtonBodyAndButtonFooter.story = {
  name: "Title, X button, body, and button footer"
};
const LotsOfButtonsInTheFooter = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  onClose
}, "Hello world!", /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "This is a button with a fairly large amount of text"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "This is a button with a fairly large amount of text"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "LotsOfButtonsInTheFooter");
LotsOfButtonsInTheFooter.story = {
  name: "Lots of buttons in the footer"
};
const LongBodyWithTitle = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  title: "Hello world",
  onClose,
  useFocusTrap: false
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM)), "LongBodyWithTitle");
LongBodyWithTitle.story = {
  name: "Long body with title"
};
const LongBodyWithTitleAndButton = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  title: "Hello world",
  onClose
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "LongBodyWithTitleAndButton");
LongBodyWithTitleAndButton.story = {
  name: "Long body with title and button"
};
const LongBodyWithLongTitleAndXButton = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  i18n,
  title: LOREM_IPSUM.slice(0, 104),
  hasXButton: true,
  onClose
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM)), "LongBodyWithLongTitleAndXButton");
LongBodyWithLongTitleAndXButton.story = {
  name: "Long body with long title and X button"
};
const WithStickyButtonsLongBody = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  hasStickyButtons: true,
  hasXButton: true,
  i18n,
  onClose
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "WithStickyButtonsLongBody");
WithStickyButtonsLongBody.story = {
  name: "With sticky buttons long body"
};
const WithStickyButtonsShortBody = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  hasStickyButtons: true,
  hasXButton: true,
  i18n,
  onClose
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM.slice(0, 140)), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "WithStickyButtonsShortBody");
WithStickyButtonsShortBody.story = {
  name: "With sticky buttons short body"
};
const StickyFooterLotsOfButtons = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  hasStickyButtons: true,
  i18n,
  onClose,
  title: "OK"
}, /* @__PURE__ */ import_react.default.createElement("p", null, LOREM_IPSUM), /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal.ButtonFooter, null, /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "This is a button with a fairly large amount of text"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "This is a button with a fairly large amount of text"), /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
  onClick: import_lodash.noop
}, "Okay"))), "StickyFooterLotsOfButtons");
StickyFooterLotsOfButtons.story = {
  name: "Sticky footer, Lots of buttons"
};
const WithBackButton = /* @__PURE__ */ __name(() => /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
  hasXButton: true,
  i18n,
  onBackButtonClick: import_lodash.noop,
  useFocusTrap: false,
  title: "The Modal Title"
}, "Hello world!"), "WithBackButton");
WithBackButton.story = {
  name: "Back Button"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BareBonesLong,
  BareBonesLongWithButton,
  BareBonesShort,
  LongBodyWithLongTitleAndXButton,
  LongBodyWithTitle,
  LongBodyWithTitleAndButton,
  LotsOfButtonsInTheFooter,
  StickyFooterLotsOfButtons,
  TitleXButtonBodyAndButtonFooter,
  WithBackButton,
  WithStickyButtonsLongBody,
  WithStickyButtonsShortBody
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTW9kYWwuc3Rvcmllcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnMnO1xuXG5pbXBvcnQgeyBzZXR1cEkxOG4gfSBmcm9tICcuLi91dGlsL3NldHVwSTE4bic7XG5pbXBvcnQgZW5NZXNzYWdlcyBmcm9tICcuLi8uLi9fbG9jYWxlcy9lbi9tZXNzYWdlcy5qc29uJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vQnV0dG9uJztcbmltcG9ydCB7IE1vZGFsIH0gZnJvbSAnLi9Nb2RhbCc7XG5cbmNvbnN0IGkxOG4gPSBzZXR1cEkxOG4oJ2VuJywgZW5NZXNzYWdlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGl0bGU6ICdDb21wb25lbnRzL01vZGFsJyxcbn07XG5cbmNvbnN0IG9uQ2xvc2UgPSBhY3Rpb24oJ29uQ2xvc2UnKTtcblxuY29uc3QgTE9SRU1fSVBTVU0gPVxuICAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gRG9uZWMgYSBkaWFtIGxlY3R1cy4gU2VkIHNpdCBhbWV0IGlwc3VtIG1hdXJpcy4gTWFlY2VuYXMgY29uZ3VlIGxpZ3VsYSBhYyBxdWFtIHZpdmVycmEgbmVjIGNvbnNlY3RldHVyIGFudGUgaGVuZHJlcml0LiBEb25lYyBldCBtb2xsaXMgZG9sb3IuIFByYWVzZW50IGV0IGRpYW0gZWdldCBsaWJlcm8gZWdlc3RhcyBtYXR0aXMgc2l0IGFtZXQgdml0YWUgYXVndWUuIE5hbSB0aW5jaWR1bnQgY29uZ3VlIGVuaW0sIHV0IHBvcnRhIGxvcmVtIGxhY2luaWEgY29uc2VjdGV0dXIuIERvbmVjIHV0IGxpYmVybyBzZWQgYXJjdSB2ZWhpY3VsYSB1bHRyaWNpZXMgYSBub24gdG9ydG9yLiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBBZW5lYW4gdXQgZ3JhdmlkYSBsb3JlbS4gVXQgdHVycGlzIGZlbGlzLCBwdWx2aW5hciBhIHNlbXBlciBzZWQsIGFkaXBpc2NpbmcgaWQgZG9sb3IuIFBlbGxlbnRlc3F1ZSBhdWN0b3IgbmlzaSBpZCBtYWduYSBjb25zZXF1YXQgc2FnaXR0aXMuIEN1cmFiaXR1ciBkYXBpYnVzIGVuaW0gc2l0IGFtZXQgZWxpdCBwaGFyZXRyYSB0aW5jaWR1bnQgZmV1Z2lhdCBuaXNsIGltcGVyZGlldC4gVXQgY29udmFsbGlzIGxpYmVybyBpbiB1cm5hIHVsdHJpY2VzIGFjY3Vtc2FuLiBEb25lYyBzZWQgb2RpbyBlcm9zLiBEb25lYyB2aXZlcnJhIG1pIHF1aXMgcXVhbSBwdWx2aW5hciBhdCBtYWxlc3VhZGEgYXJjdSByaG9uY3VzLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIEluIHJ1dHJ1bSBhY2N1bXNhbiB1bHRyaWNpZXMuIE1hdXJpcyB2aXRhZSBuaXNpIGF0IHNlbSBmYWNpbGlzaXMgc2VtcGVyIGFjIGluIGVzdC4nO1xuXG5leHBvcnQgY29uc3QgQmFyZUJvbmVzU2hvcnQgPSAoKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8TW9kYWwgaTE4bj17aTE4bn0gdXNlRm9jdXNUcmFwPXtmYWxzZX0+XG4gICAgSGVsbG8gd29ybGQhXG4gIDwvTW9kYWw+XG4pO1xuXG5CYXJlQm9uZXNTaG9ydC5zdG9yeSA9IHtcbiAgbmFtZTogJ0JhcmUgYm9uZXMsIHNob3J0Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBCYXJlQm9uZXNMb25nID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPE1vZGFsIGkxOG49e2kxOG59IHVzZUZvY3VzVHJhcD17ZmFsc2V9PlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gIDwvTW9kYWw+XG4pO1xuXG5CYXJlQm9uZXNMb25nLnN0b3J5ID0ge1xuICBuYW1lOiAnQmFyZSBib25lcywgbG9uZycsXG59O1xuXG5leHBvcnQgY29uc3QgQmFyZUJvbmVzTG9uZ1dpdGhCdXR0b24gPSAoKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8TW9kYWwgaTE4bj17aTE4bn0+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gIDwvTW9kYWw+XG4pO1xuXG5CYXJlQm9uZXNMb25nV2l0aEJ1dHRvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0JhcmUgYm9uZXMsIGxvbmcsIHdpdGggYnV0dG9uJyxcbn07XG5cbmV4cG9ydCBjb25zdCBUaXRsZVhCdXR0b25Cb2R5QW5kQnV0dG9uRm9vdGVyID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPE1vZGFsIGkxOG49e2kxOG59IHRpdGxlPVwiSGVsbG8gd29ybGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBoYXNYQnV0dG9uPlxuICAgIHtMT1JFTV9JUFNVTX1cbiAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gIDwvTW9kYWw+XG4pO1xuXG5UaXRsZVhCdXR0b25Cb2R5QW5kQnV0dG9uRm9vdGVyLnN0b3J5ID0ge1xuICBuYW1lOiAnVGl0bGUsIFggYnV0dG9uLCBib2R5LCBhbmQgYnV0dG9uIGZvb3RlcicsXG59O1xuXG5leHBvcnQgY29uc3QgTG90c09mQnV0dG9uc0luVGhlRm9vdGVyID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPE1vZGFsIGkxOG49e2kxOG59IG9uQ2xvc2U9e29uQ2xvc2V9PlxuICAgIEhlbGxvIHdvcmxkIVxuICAgIDxNb2RhbC5CdXR0b25Gb290ZXI+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICAgIDxCdXR0b24gb25DbGljaz17bm9vcH0+T2theTwvQnV0dG9uPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9PlxuICAgICAgICBUaGlzIGlzIGEgYnV0dG9uIHdpdGggYSBmYWlybHkgbGFyZ2UgYW1vdW50IG9mIHRleHRcbiAgICAgIDwvQnV0dG9uPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9PlxuICAgICAgICBUaGlzIGlzIGEgYnV0dG9uIHdpdGggYSBmYWlybHkgbGFyZ2UgYW1vdW50IG9mIHRleHRcbiAgICAgIDwvQnV0dG9uPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gIDwvTW9kYWw+XG4pO1xuXG5Mb3RzT2ZCdXR0b25zSW5UaGVGb290ZXIuc3RvcnkgPSB7XG4gIG5hbWU6ICdMb3RzIG9mIGJ1dHRvbnMgaW4gdGhlIGZvb3RlcicsXG59O1xuXG5leHBvcnQgY29uc3QgTG9uZ0JvZHlXaXRoVGl0bGUgPSAoKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8TW9kYWwgaTE4bj17aTE4bn0gdGl0bGU9XCJIZWxsbyB3b3JsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IHVzZUZvY3VzVHJhcD17ZmFsc2V9PlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gIDwvTW9kYWw+XG4pO1xuXG5Mb25nQm9keVdpdGhUaXRsZS5zdG9yeSA9IHtcbiAgbmFtZTogJ0xvbmcgYm9keSB3aXRoIHRpdGxlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMb25nQm9keVdpdGhUaXRsZUFuZEJ1dHRvbiA9ICgpOiBKU1guRWxlbWVudCA9PiAoXG4gIDxNb2RhbCBpMThuPXtpMThufSB0aXRsZT1cIkhlbGxvIHdvcmxkXCIgb25DbG9zZT17b25DbG9zZX0+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgPC9Nb2RhbC5CdXR0b25Gb290ZXI+XG4gIDwvTW9kYWw+XG4pO1xuXG5Mb25nQm9keVdpdGhUaXRsZUFuZEJ1dHRvbi5zdG9yeSA9IHtcbiAgbmFtZTogJ0xvbmcgYm9keSB3aXRoIHRpdGxlIGFuZCBidXR0b24nLFxufTtcblxuZXhwb3J0IGNvbnN0IExvbmdCb2R5V2l0aExvbmdUaXRsZUFuZFhCdXR0b24gPSAoKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8TW9kYWxcbiAgICBpMThuPXtpMThufVxuICAgIHRpdGxlPXtMT1JFTV9JUFNVTS5zbGljZSgwLCAxMDQpfVxuICAgIGhhc1hCdXR0b25cbiAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICA+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgPC9Nb2RhbD5cbik7XG5cbkxvbmdCb2R5V2l0aExvbmdUaXRsZUFuZFhCdXR0b24uc3RvcnkgPSB7XG4gIG5hbWU6ICdMb25nIGJvZHkgd2l0aCBsb25nIHRpdGxlIGFuZCBYIGJ1dHRvbicsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aFN0aWNreUJ1dHRvbnNMb25nQm9keSA9ICgpOiBKU1guRWxlbWVudCA9PiAoXG4gIDxNb2RhbCBoYXNTdGlja3lCdXR0b25zIGhhc1hCdXR0b24gaTE4bj17aTE4bn0gb25DbG9zZT17b25DbG9zZX0+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8cD57TE9SRU1fSVBTVU19PC9wPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPHA+e0xPUkVNX0lQU1VNfTwvcD5cbiAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICA8L01vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgPC9Nb2RhbD5cbik7XG5cbldpdGhTdGlja3lCdXR0b25zTG9uZ0JvZHkuc3RvcnkgPSB7XG4gIG5hbWU6ICdXaXRoIHN0aWNreSBidXR0b25zIGxvbmcgYm9keScsXG59O1xuXG5leHBvcnQgY29uc3QgV2l0aFN0aWNreUJ1dHRvbnNTaG9ydEJvZHkgPSAoKTogSlNYLkVsZW1lbnQgPT4gKFxuICA8TW9kYWwgaGFzU3RpY2t5QnV0dG9ucyBoYXNYQnV0dG9uIGkxOG49e2kxOG59IG9uQ2xvc2U9e29uQ2xvc2V9PlxuICAgIDxwPntMT1JFTV9JUFNVTS5zbGljZSgwLCAxNDApfTwvcD5cbiAgICA8TW9kYWwuQnV0dG9uRm9vdGVyPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICA8L01vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgPC9Nb2RhbD5cbik7XG5cbldpdGhTdGlja3lCdXR0b25zU2hvcnRCb2R5LnN0b3J5ID0ge1xuICBuYW1lOiAnV2l0aCBzdGlja3kgYnV0dG9ucyBzaG9ydCBib2R5Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBTdGlja3lGb290ZXJMb3RzT2ZCdXR0b25zID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPE1vZGFsIGhhc1N0aWNreUJ1dHRvbnMgaTE4bj17aTE4bn0gb25DbG9zZT17b25DbG9zZX0gdGl0bGU9XCJPS1wiPlxuICAgIDxwPntMT1JFTV9JUFNVTX08L3A+XG4gICAgPE1vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgICAgIDxCdXR0b24gb25DbGljaz17bm9vcH0+T2theTwvQnV0dG9uPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtub29wfT5Pa2F5PC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICAgIDxCdXR0b24gb25DbGljaz17bm9vcH0+XG4gICAgICAgIFRoaXMgaXMgYSBidXR0b24gd2l0aCBhIGZhaXJseSBsYXJnZSBhbW91bnQgb2YgdGV4dFxuICAgICAgPC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICAgIDxCdXR0b24gb25DbGljaz17bm9vcH0+XG4gICAgICAgIFRoaXMgaXMgYSBidXR0b24gd2l0aCBhIGZhaXJseSBsYXJnZSBhbW91bnQgb2YgdGV4dFxuICAgICAgPC9CdXR0b24+XG4gICAgICA8QnV0dG9uIG9uQ2xpY2s9e25vb3B9Pk9rYXk8L0J1dHRvbj5cbiAgICA8L01vZGFsLkJ1dHRvbkZvb3Rlcj5cbiAgPC9Nb2RhbD5cbik7XG5cblN0aWNreUZvb3RlckxvdHNPZkJ1dHRvbnMuc3RvcnkgPSB7XG4gIG5hbWU6ICdTdGlja3kgZm9vdGVyLCBMb3RzIG9mIGJ1dHRvbnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IFdpdGhCYWNrQnV0dG9uID0gKCk6IEpTWC5FbGVtZW50ID0+IChcbiAgPE1vZGFsXG4gICAgaGFzWEJ1dHRvblxuICAgIGkxOG49e2kxOG59XG4gICAgb25CYWNrQnV0dG9uQ2xpY2s9e25vb3B9XG4gICAgdXNlRm9jdXNUcmFwPXtmYWxzZX1cbiAgICB0aXRsZT1cIlRoZSBNb2RhbCBUaXRsZVwiXG4gID5cbiAgICBIZWxsbyB3b3JsZCFcbiAgPC9Nb2RhbD5cbik7XG5cbldpdGhCYWNrQnV0dG9uLnN0b3J5ID0ge1xuICBuYW1lOiAnQmFjayBCdXR0b24nLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBa0I7QUFDbEIsb0JBQXFCO0FBRXJCLDJCQUF1QjtBQUV2Qix1QkFBMEI7QUFDMUIsc0JBQXVCO0FBQ3ZCLG9CQUF1QjtBQUN2QixtQkFBc0I7QUFFdEIsTUFBTSxPQUFPLGdDQUFVLE1BQU0sdUJBQVU7QUFFdkMsSUFBTyx3QkFBUTtBQUFBLEVBQ2IsT0FBTztBQUNUO0FBRUEsTUFBTSxVQUFVLGlDQUFPLFNBQVM7QUFFaEMsTUFBTSxjQUNKO0FBRUssTUFBTSxpQkFBaUIsNkJBQzVCLG1EQUFDO0FBQUEsRUFBTTtBQUFBLEVBQVksY0FBYztBQUFBLEdBQU8sY0FFeEMsR0FINEI7QUFNOUIsZUFBZSxRQUFRO0FBQUEsRUFDckIsTUFBTTtBQUNSO0FBRU8sTUFBTSxnQkFBZ0IsNkJBQzNCLG1EQUFDO0FBQUEsRUFBTTtBQUFBLEVBQVksY0FBYztBQUFBLEdBQy9CLG1EQUFDLFdBQUcsV0FBWSxHQUNoQixtREFBQyxXQUFHLFdBQVksR0FDaEIsbURBQUMsV0FBRyxXQUFZLEdB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
