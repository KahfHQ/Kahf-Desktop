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
var GroupV2Change_exports = {};
__export(GroupV2Change_exports, {
  GroupV2Change: () => GroupV2Change
});
module.exports = __toCommonJS(GroupV2Change_exports);
var import_react = __toESM(require("react"));
var import_lodash = require("lodash");
var log = __toESM(require("../../logging/log"));
var import_Intl = require("../Intl");
var import_GroupDescriptionText = require("../GroupDescriptionText");
var import_Button = require("../Button");
var import_SystemMessage = require("./SystemMessage");
var import_groupChange = require("../../groupChange");
var import_Modal = require("../Modal");
var import_ConfirmationDialog = require("../ConfirmationDialog");
function renderStringToIntl(id, i18n, components) {
  return /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
    id,
    i18n,
    components
  });
}
var ModalState = /* @__PURE__ */ ((ModalState2) => {
  ModalState2["None"] = "None";
  ModalState2["ViewingGroupDescription"] = "ViewingGroupDescription";
  ModalState2["ConfirmingblockGroupLinkRequests"] = "ConfirmingblockGroupLinkRequests";
  return ModalState2;
})(ModalState || {});
const changeToIconMap = /* @__PURE__ */ new Map([
  ["access-attributes", "group-access"],
  ["access-invite-link", "group-access"],
  ["access-members", "group-access"],
  ["admin-approval-add-one", "group-add"],
  ["admin-approval-remove-one", "group-decline"],
  ["admin-approval-bounce", "group-decline"],
  ["announcements-only", "group-access"],
  ["avatar", "group-avatar"],
  ["description", "group-edit"],
  ["group-link-add", "group-access"],
  ["group-link-remove", "group-access"],
  ["group-link-reset", "group-access"],
  ["member-add", "group-add"],
  ["member-add-from-admin-approval", "group-approved"],
  ["member-add-from-invite", "group-add"],
  ["member-add-from-link", "group-add"],
  ["member-privilege", "group-access"],
  ["member-remove", "group-remove"],
  ["pending-add-many", "group-add"],
  ["pending-add-one", "group-add"],
  ["pending-remove-many", "group-decline"],
  ["pending-remove-one", "group-decline"],
  ["title", "group-edit"]
]);
function getIcon(detail, isLastText = true, fromId) {
  const changeType = detail.type;
  let possibleIcon = changeToIconMap.get(changeType);
  const isSameId = fromId === (0, import_lodash.get)(detail, "uuid", null);
  if (isSameId) {
    if (changeType === "member-remove") {
      possibleIcon = "group-leave";
    }
    if (changeType === "member-add-from-invite") {
      possibleIcon = "group-approved";
    }
  }
  if (changeType === "admin-approval-bounce" && isLastText) {
    possibleIcon = void 0;
  }
  return possibleIcon || "group";
}
function GroupV2Detail({
  areWeAdmin,
  blockGroupLinkRequests,
  detail,
  isLastText,
  fromId,
  groupMemberships,
  groupBannedMemberships,
  groupName,
  i18n,
  ourACI,
  ourPNI,
  renderContact,
  text
}) {
  const icon = getIcon(detail, isLastText, fromId);
  let buttonNode;
  const [modalState, setModalState] = (0, import_react.useState)("None" /* None */);
  let modalNode;
  switch (modalState) {
    case "None" /* None */:
      modalNode = void 0;
      break;
    case "ViewingGroupDescription" /* ViewingGroupDescription */:
      if (detail.type !== "description" || !detail.description) {
        log.warn("GroupV2Detail: ViewingGroupDescription but missing description or wrong change type");
        modalNode = void 0;
        break;
      }
      modalNode = /* @__PURE__ */ import_react.default.createElement(import_Modal.Modal, {
        hasXButton: true,
        i18n,
        title: groupName,
        onClose: () => setModalState("None" /* None */)
      }, /* @__PURE__ */ import_react.default.createElement(import_GroupDescriptionText.GroupDescriptionText, {
        text: detail.description
      }));
      break;
    case "ConfirmingblockGroupLinkRequests" /* ConfirmingblockGroupLinkRequests */:
      if (!isLastText || detail.type !== "admin-approval-bounce" || !detail.uuid) {
        log.warn("GroupV2Detail: ConfirmingblockGroupLinkRequests but missing uuid or wrong change type");
        modalNode = void 0;
        break;
      }
      modalNode = /* @__PURE__ */ import_react.default.createElement(import_ConfirmationDialog.ConfirmationDialog, {
        title: i18n("PendingRequests--block--title"),
        actions: [
          {
            action: () => blockGroupLinkRequests(detail.uuid),
            text: i18n("PendingRequests--block--confirm"),
            style: "affirmative"
          }
        ],
        i18n,
        onClose: () => setModalState("None" /* None */)
      }, /* @__PURE__ */ import_react.default.createElement(import_Intl.Intl, {
        id: "PendingRequests--block--contents",
        i18n,
        components: {
          name: renderContact(detail.uuid)
        }
      }));
      break;
    default: {
      const state = modalState;
      log.warn(`GroupV2Detail: unexpected modal state ${state}`);
      modalNode = void 0;
      break;
    }
  }
  if (detail.type === "description" && detail.description) {
    buttonNode = /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: () => setModalState("ViewingGroupDescription" /* ViewingGroupDescription */),
      size: import_Button.ButtonSize.Small,
      variant: import_Button.ButtonVariant.SystemMessage
    }, i18n("view"));
  } else if (isLastText && detail.type === "admin-approval-bounce" && areWeAdmin && detail.uuid && detail.uuid !== ourACI && detail.uuid !== ourPNI && (!fromId || fromId === detail.uuid) && !groupMemberships?.some((item) => item.uuid === detail.uuid) && !groupBannedMemberships?.some((uuid) => uuid === detail.uuid)) {
    buttonNode = /* @__PURE__ */ import_react.default.createElement(import_Button.Button, {
      onClick: () => setModalState("ConfirmingblockGroupLinkRequests" /* ConfirmingblockGroupLinkRequests */),
      size: import_Button.ButtonSize.Small,
      variant: import_Button.ButtonVariant.SystemMessage
    }, i18n("PendingRequests--block--button"));
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_SystemMessage.SystemMessage, {
    icon,
    contents: text,
    button: buttonNode
  }), modalNode);
}
function GroupV2Change(props) {
  const {
    areWeAdmin,
    blockGroupLinkRequests,
    change,
    groupBannedMemberships,
    groupMemberships,
    groupName,
    i18n,
    ourACI,
    ourPNI,
    renderContact
  } = props;
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, (0, import_groupChange.renderChange)(change, {
    i18n,
    ourACI,
    ourPNI,
    renderContact,
    renderString: renderStringToIntl
  }).map(({ detail, isLastText, text }, index) => {
    return /* @__PURE__ */ import_react.default.createElement(GroupV2Detail, {
      areWeAdmin,
      blockGroupLinkRequests,
      detail,
      isLastText,
      fromId: change.from,
      groupBannedMemberships,
      groupMemberships,
      groupName,
      i18n,
      key: index,
      ourACI,
      ourPNI,
      renderContact,
      text
    });
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GroupV2Change
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiR3JvdXBWMkNoYW5nZS50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IFJlYWN0RWxlbWVudCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB0eXBlIHsgUmVwbGFjZW1lbnRWYWx1ZXNUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvSTE4Tic7XG5pbXBvcnQgdHlwZSB7IEZ1bGxKU1hUeXBlIH0gZnJvbSAnLi4vSW50bCc7XG5pbXBvcnQgeyBJbnRsIH0gZnJvbSAnLi4vSW50bCc7XG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VdGlsJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IEdyb3VwRGVzY3JpcHRpb25UZXh0IH0gZnJvbSAnLi4vR3JvdXBEZXNjcmlwdGlvblRleHQnO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25TaXplLCBCdXR0b25WYXJpYW50IH0gZnJvbSAnLi4vQnV0dG9uJztcbmltcG9ydCB7IFN5c3RlbU1lc3NhZ2UgfSBmcm9tICcuL1N5c3RlbU1lc3NhZ2UnO1xuXG5pbXBvcnQgdHlwZSB7IEdyb3VwVjJDaGFuZ2VUeXBlLCBHcm91cFYyQ2hhbmdlRGV0YWlsVHlwZSB9IGZyb20gJy4uLy4uL2dyb3Vwcyc7XG5cbmltcG9ydCB0eXBlIHsgU21hcnRDb250YWN0UmVuZGVyZXJUeXBlIH0gZnJvbSAnLi4vLi4vZ3JvdXBDaGFuZ2UnO1xuaW1wb3J0IHsgcmVuZGVyQ2hhbmdlIH0gZnJvbSAnLi4vLi4vZ3JvdXBDaGFuZ2UnO1xuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICcuLi9Nb2RhbCc7XG5pbXBvcnQgeyBDb25maXJtYXRpb25EaWFsb2cgfSBmcm9tICcuLi9Db25maXJtYXRpb25EaWFsb2cnO1xuXG5leHBvcnQgdHlwZSBQcm9wc0RhdGFUeXBlID0ge1xuICBhcmVXZUFkbWluOiBib29sZWFuO1xuICBncm91cE1lbWJlcnNoaXBzPzogQXJyYXk8e1xuICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICAgIGlzQWRtaW46IGJvb2xlYW47XG4gIH0+O1xuICBncm91cEJhbm5lZE1lbWJlcnNoaXBzPzogQXJyYXk8VVVJRFN0cmluZ1R5cGU+O1xuICBncm91cE5hbWU/OiBzdHJpbmc7XG4gIG91ckFDST86IFVVSURTdHJpbmdUeXBlO1xuICBvdXJQTkk/OiBVVUlEU3RyaW5nVHlwZTtcbiAgY2hhbmdlOiBHcm91cFYyQ2hhbmdlVHlwZTtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzQWN0aW9uc1R5cGUgPSB7XG4gIGJsb2NrR3JvdXBMaW5rUmVxdWVzdHM6ICh1dWlkOiBVVUlEU3RyaW5nVHlwZSkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzSG91c2VrZWVwaW5nVHlwZSA9IHtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgcmVuZGVyQ29udGFjdDogU21hcnRDb250YWN0UmVuZGVyZXJUeXBlPEZ1bGxKU1hUeXBlPjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3BzVHlwZSA9IFByb3BzRGF0YVR5cGUgJlxuICBQcm9wc0FjdGlvbnNUeXBlICZcbiAgUHJvcHNIb3VzZWtlZXBpbmdUeXBlO1xuXG5mdW5jdGlvbiByZW5kZXJTdHJpbmdUb0ludGwoXG4gIGlkOiBzdHJpbmcsXG4gIGkxOG46IExvY2FsaXplclR5cGUsXG4gIGNvbXBvbmVudHM/OiBBcnJheTxGdWxsSlNYVHlwZT4gfCBSZXBsYWNlbWVudFZhbHVlc1R5cGU8RnVsbEpTWFR5cGU+XG4pOiBGdWxsSlNYVHlwZSB7XG4gIHJldHVybiA8SW50bCBpZD17aWR9IGkxOG49e2kxOG59IGNvbXBvbmVudHM9e2NvbXBvbmVudHN9IC8+O1xufVxuXG5lbnVtIE1vZGFsU3RhdGUge1xuICBOb25lID0gJ05vbmUnLFxuICBWaWV3aW5nR3JvdXBEZXNjcmlwdGlvbiA9ICdWaWV3aW5nR3JvdXBEZXNjcmlwdGlvbicsXG4gIENvbmZpcm1pbmdibG9ja0dyb3VwTGlua1JlcXVlc3RzID0gJ0NvbmZpcm1pbmdibG9ja0dyb3VwTGlua1JlcXVlc3RzJyxcbn1cblxudHlwZSBHcm91cEljb25UeXBlID1cbiAgfCAnZ3JvdXAnXG4gIHwgJ2dyb3VwLWFjY2VzcydcbiAgfCAnZ3JvdXAtYWRkJ1xuICB8ICdncm91cC1hcHByb3ZlZCdcbiAgfCAnZ3JvdXAtYXZhdGFyJ1xuICB8ICdncm91cC1kZWNsaW5lJ1xuICB8ICdncm91cC1lZGl0J1xuICB8ICdncm91cC1sZWF2ZSdcbiAgfCAnZ3JvdXAtcmVtb3ZlJztcblxuY29uc3QgY2hhbmdlVG9JY29uTWFwID0gbmV3IE1hcDxzdHJpbmcsIEdyb3VwSWNvblR5cGU+KFtcbiAgWydhY2Nlc3MtYXR0cmlidXRlcycsICdncm91cC1hY2Nlc3MnXSxcbiAgWydhY2Nlc3MtaW52aXRlLWxpbmsnLCAnZ3JvdXAtYWNjZXNzJ10sXG4gIFsnYWNjZXNzLW1lbWJlcnMnLCAnZ3JvdXAtYWNjZXNzJ10sXG4gIFsnYWRtaW4tYXBwcm92YWwtYWRkLW9uZScsICdncm91cC1hZGQnXSxcbiAgWydhZG1pbi1hcHByb3ZhbC1yZW1vdmUtb25lJywgJ2dyb3VwLWRlY2xpbmUnXSxcbiAgWydhZG1pbi1hcHByb3ZhbC1ib3VuY2UnLCAnZ3JvdXAtZGVjbGluZSddLFxuICBbJ2Fubm91bmNlbWVudHMtb25seScsICdncm91cC1hY2Nlc3MnXSxcbiAgWydhdmF0YXInLCAnZ3JvdXAtYXZhdGFyJ10sXG4gIFsnZGVzY3JpcHRpb24nLCAnZ3JvdXAtZWRpdCddLFxuICBbJ2dyb3VwLWxpbmstYWRkJywgJ2dyb3VwLWFjY2VzcyddLFxuICBbJ2dyb3VwLWxpbmstcmVtb3ZlJywgJ2dyb3VwLWFjY2VzcyddLFxuICBbJ2dyb3VwLWxpbmstcmVzZXQnLCAnZ3JvdXAtYWNjZXNzJ10sXG4gIFsnbWVtYmVyLWFkZCcsICdncm91cC1hZGQnXSxcbiAgWydtZW1iZXItYWRkLWZyb20tYWRtaW4tYXBwcm92YWwnLCAnZ3JvdXAtYXBwcm92ZWQnXSxcbiAgWydtZW1iZXItYWRkLWZyb20taW52aXRlJywgJ2dyb3VwLWFkZCddLFxuICBbJ21lbWJlci1hZGQtZnJvbS1saW5rJywgJ2dyb3VwLWFkZCddLFxuICBbJ21lbWJlci1wcml2aWxlZ2UnLCAnZ3JvdXAtYWNjZXNzJ10sXG4gIFsnbWVtYmVyLXJlbW92ZScsICdncm91cC1yZW1vdmUnXSxcbiAgWydwZW5kaW5nLWFkZC1tYW55JywgJ2dyb3VwLWFkZCddLFxuICBbJ3BlbmRpbmctYWRkLW9uZScsICdncm91cC1hZGQnXSxcbiAgWydwZW5kaW5nLXJlbW92ZS1tYW55JywgJ2dyb3VwLWRlY2xpbmUnXSxcbiAgWydwZW5kaW5nLXJlbW92ZS1vbmUnLCAnZ3JvdXAtZGVjbGluZSddLFxuICBbJ3RpdGxlJywgJ2dyb3VwLWVkaXQnXSxcbl0pO1xuXG5mdW5jdGlvbiBnZXRJY29uKFxuICBkZXRhaWw6IEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlLFxuICBpc0xhc3RUZXh0ID0gdHJ1ZSxcbiAgZnJvbUlkPzogVVVJRFN0cmluZ1R5cGVcbik6IEdyb3VwSWNvblR5cGUge1xuICBjb25zdCBjaGFuZ2VUeXBlID0gZGV0YWlsLnR5cGU7XG4gIGxldCBwb3NzaWJsZUljb24gPSBjaGFuZ2VUb0ljb25NYXAuZ2V0KGNoYW5nZVR5cGUpO1xuICBjb25zdCBpc1NhbWVJZCA9IGZyb21JZCA9PT0gZ2V0KGRldGFpbCwgJ3V1aWQnLCBudWxsKTtcbiAgaWYgKGlzU2FtZUlkKSB7XG4gICAgaWYgKGNoYW5nZVR5cGUgPT09ICdtZW1iZXItcmVtb3ZlJykge1xuICAgICAgcG9zc2libGVJY29uID0gJ2dyb3VwLWxlYXZlJztcbiAgICB9XG4gICAgaWYgKGNoYW5nZVR5cGUgPT09ICdtZW1iZXItYWRkLWZyb20taW52aXRlJykge1xuICAgICAgcG9zc2libGVJY29uID0gJ2dyb3VwLWFwcHJvdmVkJztcbiAgICB9XG4gIH1cbiAgLy8gVXNlIGRlZmF1bHQgaWNvbiBmb3IgXCIuLi4gcmVxdWVzdGVkIHRvIGpvaW4gdmlhIGdyb3VwIGxpbmtcIiBhZGRlZCB0b1xuICAvLyBib3VuY2Ugbm90aWZpY2F0aW9uLlxuICBpZiAoY2hhbmdlVHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWJvdW5jZScgJiYgaXNMYXN0VGV4dCkge1xuICAgIHBvc3NpYmxlSWNvbiA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcG9zc2libGVJY29uIHx8ICdncm91cCc7XG59XG5cbmZ1bmN0aW9uIEdyb3VwVjJEZXRhaWwoe1xuICBhcmVXZUFkbWluLFxuICBibG9ja0dyb3VwTGlua1JlcXVlc3RzLFxuICBkZXRhaWwsXG4gIGlzTGFzdFRleHQsXG4gIGZyb21JZCxcbiAgZ3JvdXBNZW1iZXJzaGlwcyxcbiAgZ3JvdXBCYW5uZWRNZW1iZXJzaGlwcyxcbiAgZ3JvdXBOYW1lLFxuICBpMThuLFxuICBvdXJBQ0ksXG4gIG91clBOSSxcbiAgcmVuZGVyQ29udGFjdCxcbiAgdGV4dCxcbn06IHtcbiAgYXJlV2VBZG1pbjogYm9vbGVhbjtcbiAgYmxvY2tHcm91cExpbmtSZXF1ZXN0czogKHV1aWQ6IFVVSURTdHJpbmdUeXBlKSA9PiB1bmtub3duO1xuICBkZXRhaWw6IEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlO1xuICBpc0xhc3RUZXh0OiBib29sZWFuO1xuICBncm91cE1lbWJlcnNoaXBzPzogQXJyYXk8e1xuICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICAgIGlzQWRtaW46IGJvb2xlYW47XG4gIH0+O1xuICBncm91cEJhbm5lZE1lbWJlcnNoaXBzPzogQXJyYXk8VVVJRFN0cmluZ1R5cGU+O1xuICBncm91cE5hbWU/OiBzdHJpbmc7XG4gIGkxOG46IExvY2FsaXplclR5cGU7XG4gIGZyb21JZD86IFVVSURTdHJpbmdUeXBlO1xuICBvdXJBQ0k/OiBVVUlEU3RyaW5nVHlwZTtcbiAgb3VyUE5JPzogVVVJRFN0cmluZ1R5cGU7XG4gIHJlbmRlckNvbnRhY3Q6IFNtYXJ0Q29udGFjdFJlbmRlcmVyVHlwZTxGdWxsSlNYVHlwZT47XG4gIHRleHQ6IEZ1bGxKU1hUeXBlO1xufSk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgaWNvbiA9IGdldEljb24oZGV0YWlsLCBpc0xhc3RUZXh0LCBmcm9tSWQpO1xuICBsZXQgYnV0dG9uTm9kZTogUmVhY3ROb2RlO1xuXG4gIGNvbnN0IFttb2RhbFN0YXRlLCBzZXRNb2RhbFN0YXRlXSA9IHVzZVN0YXRlPE1vZGFsU3RhdGU+KE1vZGFsU3RhdGUuTm9uZSk7XG4gIGxldCBtb2RhbE5vZGU6IFJlYWN0Tm9kZTtcblxuICBzd2l0Y2ggKG1vZGFsU3RhdGUpIHtcbiAgICBjYXNlIE1vZGFsU3RhdGUuTm9uZTpcbiAgICAgIG1vZGFsTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTW9kYWxTdGF0ZS5WaWV3aW5nR3JvdXBEZXNjcmlwdGlvbjpcbiAgICAgIGlmIChkZXRhaWwudHlwZSAhPT0gJ2Rlc2NyaXB0aW9uJyB8fCAhZGV0YWlsLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICdHcm91cFYyRGV0YWlsOiBWaWV3aW5nR3JvdXBEZXNjcmlwdGlvbiBidXQgbWlzc2luZyBkZXNjcmlwdGlvbiBvciB3cm9uZyBjaGFuZ2UgdHlwZSdcbiAgICAgICAgKTtcbiAgICAgICAgbW9kYWxOb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbW9kYWxOb2RlID0gKFxuICAgICAgICA8TW9kYWxcbiAgICAgICAgICBoYXNYQnV0dG9uXG4gICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICB0aXRsZT17Z3JvdXBOYW1lfVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsU3RhdGUoTW9kYWxTdGF0ZS5Ob25lKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxHcm91cERlc2NyaXB0aW9uVGV4dCB0ZXh0PXtkZXRhaWwuZGVzY3JpcHRpb259IC8+XG4gICAgICAgIDwvTW9kYWw+XG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBNb2RhbFN0YXRlLkNvbmZpcm1pbmdibG9ja0dyb3VwTGlua1JlcXVlc3RzOlxuICAgICAgaWYgKFxuICAgICAgICAhaXNMYXN0VGV4dCB8fFxuICAgICAgICBkZXRhaWwudHlwZSAhPT0gJ2FkbWluLWFwcHJvdmFsLWJvdW5jZScgfHxcbiAgICAgICAgIWRldGFpbC51dWlkXG4gICAgICApIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgJ0dyb3VwVjJEZXRhaWw6IENvbmZpcm1pbmdibG9ja0dyb3VwTGlua1JlcXVlc3RzIGJ1dCBtaXNzaW5nIHV1aWQgb3Igd3JvbmcgY2hhbmdlIHR5cGUnXG4gICAgICAgICk7XG4gICAgICAgIG1vZGFsTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIG1vZGFsTm9kZSA9IChcbiAgICAgICAgPENvbmZpcm1hdGlvbkRpYWxvZ1xuICAgICAgICAgIHRpdGxlPXtpMThuKCdQZW5kaW5nUmVxdWVzdHMtLWJsb2NrLS10aXRsZScpfVxuICAgICAgICAgIGFjdGlvbnM9e1tcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiBibG9ja0dyb3VwTGlua1JlcXVlc3RzKGRldGFpbC51dWlkKSxcbiAgICAgICAgICAgICAgdGV4dDogaTE4bignUGVuZGluZ1JlcXVlc3RzLS1ibG9jay0tY29uZmlybScpLFxuICAgICAgICAgICAgICBzdHlsZTogJ2FmZmlybWF0aXZlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsU3RhdGUoTW9kYWxTdGF0ZS5Ob25lKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJbnRsXG4gICAgICAgICAgICBpZD1cIlBlbmRpbmdSZXF1ZXN0cy0tYmxvY2stLWNvbnRlbnRzXCJcbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgIG5hbWU6IHJlbmRlckNvbnRhY3QoZGV0YWlsLnV1aWQpLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbmZpcm1hdGlvbkRpYWxvZz5cbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zdCBzdGF0ZTogbmV2ZXIgPSBtb2RhbFN0YXRlO1xuICAgICAgbG9nLndhcm4oYEdyb3VwVjJEZXRhaWw6IHVuZXhwZWN0ZWQgbW9kYWwgc3RhdGUgJHtzdGF0ZX1gKTtcbiAgICAgIG1vZGFsTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJyAmJiBkZXRhaWwuZGVzY3JpcHRpb24pIHtcbiAgICBidXR0b25Ob2RlID0gKFxuICAgICAgPEJ1dHRvblxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2RhbFN0YXRlKE1vZGFsU3RhdGUuVmlld2luZ0dyb3VwRGVzY3JpcHRpb24pfVxuICAgICAgICBzaXplPXtCdXR0b25TaXplLlNtYWxsfVxuICAgICAgICB2YXJpYW50PXtCdXR0b25WYXJpYW50LlN5c3RlbU1lc3NhZ2V9XG4gICAgICA+XG4gICAgICAgIHtpMThuKCd2aWV3Jyl9XG4gICAgICA8L0J1dHRvbj5cbiAgICApO1xuICB9IGVsc2UgaWYgKFxuICAgIGlzTGFzdFRleHQgJiZcbiAgICBkZXRhaWwudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWJvdW5jZScgJiZcbiAgICBhcmVXZUFkbWluICYmXG4gICAgZGV0YWlsLnV1aWQgJiZcbiAgICBkZXRhaWwudXVpZCAhPT0gb3VyQUNJICYmXG4gICAgZGV0YWlsLnV1aWQgIT09IG91clBOSSAmJlxuICAgICghZnJvbUlkIHx8IGZyb21JZCA9PT0gZGV0YWlsLnV1aWQpICYmXG4gICAgIWdyb3VwTWVtYmVyc2hpcHM/LnNvbWUoaXRlbSA9PiBpdGVtLnV1aWQgPT09IGRldGFpbC51dWlkKSAmJlxuICAgICFncm91cEJhbm5lZE1lbWJlcnNoaXBzPy5zb21lKHV1aWQgPT4gdXVpZCA9PT0gZGV0YWlsLnV1aWQpXG4gICkge1xuICAgIGJ1dHRvbk5vZGUgPSAoXG4gICAgICA8QnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgc2V0TW9kYWxTdGF0ZShNb2RhbFN0YXRlLkNvbmZpcm1pbmdibG9ja0dyb3VwTGlua1JlcXVlc3RzKVxuICAgICAgICB9XG4gICAgICAgIHNpemU9e0J1dHRvblNpemUuU21hbGx9XG4gICAgICAgIHZhcmlhbnQ9e0J1dHRvblZhcmlhbnQuU3lzdGVtTWVzc2FnZX1cbiAgICAgID5cbiAgICAgICAge2kxOG4oJ1BlbmRpbmdSZXF1ZXN0cy0tYmxvY2stLWJ1dHRvbicpfVxuICAgICAgPC9CdXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTeXN0ZW1NZXNzYWdlIGljb249e2ljb259IGNvbnRlbnRzPXt0ZXh0fSBidXR0b249e2J1dHRvbk5vZGV9IC8+XG4gICAgICB7bW9kYWxOb2RlfVxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gR3JvdXBWMkNoYW5nZShwcm9wczogUHJvcHNUeXBlKTogUmVhY3RFbGVtZW50IHtcbiAgY29uc3Qge1xuICAgIGFyZVdlQWRtaW4sXG4gICAgYmxvY2tHcm91cExpbmtSZXF1ZXN0cyxcbiAgICBjaGFuZ2UsXG4gICAgZ3JvdXBCYW5uZWRNZW1iZXJzaGlwcyxcbiAgICBncm91cE1lbWJlcnNoaXBzLFxuICAgIGdyb3VwTmFtZSxcbiAgICBpMThuLFxuICAgIG91ckFDSSxcbiAgICBvdXJQTkksXG4gICAgcmVuZGVyQ29udGFjdCxcbiAgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtyZW5kZXJDaGFuZ2U8RnVsbEpTWFR5cGU+KGNoYW5nZSwge1xuICAgICAgICBpMThuLFxuICAgICAgICBvdXJBQ0ksXG4gICAgICAgIG91clBOSSxcbiAgICAgICAgcmVuZGVyQ29udGFjdCxcbiAgICAgICAgcmVuZGVyU3RyaW5nOiByZW5kZXJTdHJpbmdUb0ludGwsXG4gICAgICB9KS5tYXAoKHsgZGV0YWlsLCBpc0xhc3RUZXh0LCB0ZXh0IH0sIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEdyb3VwVjJEZXRhaWxcbiAgICAgICAgICAgIGFyZVdlQWRtaW49e2FyZVdlQWRtaW59XG4gICAgICAgICAgICBibG9ja0dyb3VwTGlua1JlcXVlc3RzPXtibG9ja0dyb3VwTGlua1JlcXVlc3RzfVxuICAgICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgICBpc0xhc3RUZXh0PXtpc0xhc3RUZXh0fVxuICAgICAgICAgICAgZnJvbUlkPXtjaGFuZ2UuZnJvbX1cbiAgICAgICAgICAgIGdyb3VwQmFubmVkTWVtYmVyc2hpcHM9e2dyb3VwQmFubmVkTWVtYmVyc2hpcHN9XG4gICAgICAgICAgICBncm91cE1lbWJlcnNoaXBzPXtncm91cE1lbWJlcnNoaXBzfVxuICAgICAgICAgICAgZ3JvdXBOYW1lPXtncm91cE5hbWV9XG4gICAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgICAgLy8gRGlmZmljdWx0IHRvIGZpbmQgYSB1bmlxdWUga2V5IGZvciB0aGlzIHR5cGVcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcbiAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICBvdXJBQ0k9e291ckFDSX1cbiAgICAgICAgICAgIG91clBOST17b3VyUE5JfVxuICAgICAgICAgICAgcmVuZGVyQ29udGFjdD17cmVuZGVyQ29udGFjdH1cbiAgICAgICAgICAgIHRleHQ9e3RleHR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvPlxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG1CQUFnQztBQUNoQyxvQkFBb0I7QUFFcEIsVUFBcUI7QUFHckIsa0JBQXFCO0FBR3JCLGtDQUFxQztBQUNyQyxvQkFBa0Q7QUFDbEQsMkJBQThCO0FBSzlCLHlCQUE2QjtBQUM3QixtQkFBc0I7QUFDdEIsZ0NBQW1DO0FBNEJuQyw0QkFDRSxJQUNBLE1BQ0EsWUFDYTtBQUNiLFNBQU8sbURBQUM7QUFBQSxJQUFLO0FBQUEsSUFBUTtBQUFBLElBQVk7QUFBQSxHQUF3QjtBQUMzRDtBQU5TLEFBUVQsSUFBSyxhQUFMLGtCQUFLLGdCQUFMO0FBQ0Usd0JBQU87QUFDUCwyQ0FBMEI7QUFDMUIsb0RBQW1DO0FBSGhDO0FBQUE7QUFpQkwsTUFBTSxrQkFBa0Isb0JBQUksSUFBMkI7QUFBQSxFQUNyRCxDQUFDLHFCQUFxQixjQUFjO0FBQUEsRUFDcEMsQ0FBQyxzQkFBc0IsY0FBYztBQUFBLEVBQ3JDLENBQUMsa0JBQWtCLGNBQWM7QUFBQSxFQUNqQyxDQUFDLDBCQUEwQixXQUFXO0FBQUEsRUFDdEMsQ0FBQyw2QkFBNkIsZUFBZTtBQUFBLEVBQzdDLENBQUMseUJBQXlCLGVBQWU7QUFBQSxFQUN6QyxDQUFDLHNCQUFzQixjQUFjO0FBQUEsRUFDckMsQ0FBQyxVQUFVLGNBQWM7QUFBQSxFQUN6QixDQUFDLGVBQWUsWUFBWTtB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aUJBQWlCLE9BQU8sYUFBYTtBQUN2RCxpQkFDRSxtREFBQztBQUFBLE1BQ0MsU0FBUyxNQUFNLGNBQWMsdURBQWtDO0FBQUEsTUFDL0QsTUFBTSx5QkFBVztBQUFBLE1BQ2pCLFNBQVMsNEJBQWM7QUFBQSxPQUV0QixLQUFLLE1BQU0sQ0FDZDtBQUFBLEVBRUosV0FDRSxjQUNBLE9BQU8sU0FBUywyQkFDaEIsY0FDQSxPQUFPLFFBQ1AsT0FBTyxTQUFTLFVBQ2hCLE9BQU8sU0FBUyxVQUNmLEVBQUMsVUFBVSxXQUFXLE9BQU8sU0FDOUIsQ0FBQyxrQkFBa0IsS0FBSyxVQUFRLEtBQUssU0FBUyxPQUFPLElBQUksS0FDekQsQ0FBQyx3QkFBd0IsS0FBSyxVQUFRLFNBQVMsT0FBTyxJQUFJLEdBQzFEO0FBQ0EsaUJBQ0UsbURBQUM7QUFBQSxNQUNDLFNBQVMsTUFDUCxjQUFjLHlFQUEyQztBQUFBLE1BRTNELE1BQU0seUJBQVc7QUFBQSxNQUNqQixTQUFTLDRCQUFjO0FBQUEsT0FFdEIsS0FBSyxnQ0FBZ0MsQ0FDeEM7QUFBQSxFQUVKO0FBRUEsU0FDRSx3RkFDRSxtREFBQztBQUFBLElBQWM7QUFBQSxJQUFZLFVBQVU7QUFBQSxJQUFNLFFBQVE7QUFBQSxHQUFZLEdBQzlELFNBQ0g7QUFFSjtBQWxKUyxBQW9KRix1QkFBdUIsT0FBZ0M7QUFDNUQsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxNQUNFO0FBRUosU0FDRSx3RkFDRyxxQ0FBMEIsUUFBUTtBQUFBLElBQ2pDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxjQUFjO0FBQUEsRUFDaEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLFFBQVEsWUFBWSxRQUFRLFVBQVU7QUFDOUMsV0FDRSxtREFBQztBQUFBLE1BQ0M7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFFBQVEsT0FBTztBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUdBLEtBQUs7QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsS0FDRjtBQUFBLEVBRUosQ0FBQyxDQUNIO0FBRUo7QUE5Q2dCIiwKICAibmFtZXMiOiBbXQp9Cg==
