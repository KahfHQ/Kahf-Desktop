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
var joinViaLink_exports = {};
__export(joinViaLink_exports, {
  joinViaLink: () => joinViaLink
});
module.exports = __toCommonJS(joinViaLink_exports);
var React = __toESM(require("react"));
var import_groups = require("../groups");
var Errors = __toESM(require("../types/errors"));
var import_UUID = require("../types/UUID");
var Bytes = __toESM(require("../Bytes"));
var import_longRunningTaskWrapper = require("../util/longRunningTaskWrapper");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_explodePromise = require("../util/explodePromise");
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var import_showToast = require("../util/showToast");
var import_ReactWrapperView = require("../views/ReactWrapperView");
var import_ErrorModal = require("../components/ErrorModal");
var import_ToastAlreadyGroupMember = require("../components/ToastAlreadyGroupMember");
var import_ToastAlreadyRequestedToJoin = require("../components/ToastAlreadyRequestedToJoin");
var import_Errors = require("../textsecure/Errors");
var import_util = require("./util");
var import_sleep = require("../util/sleep");
async function joinViaLink(hash) {
  let inviteLinkPassword;
  let masterKey;
  try {
    ({ inviteLinkPassword, masterKey } = (0, import_groups.parseGroupLink)(hash));
  } catch (error) {
    const errorString = Errors.toLogFormat(error);
    log.error(`joinViaLink: Failed to parse group link ${errorString}`);
    if (error instanceof Error && error.name === import_groups.LINK_VERSION_ERROR) {
      showErrorDialog(window.i18n("GroupV2--join--unknown-link-version"), window.i18n("GroupV2--join--unknown-link-version--title"));
    } else {
      showErrorDialog(window.i18n("GroupV2--join--invalid-link"), window.i18n("GroupV2--join--invalid-link--title"));
    }
    return;
  }
  const data = (0, import_groups.deriveGroupFields)(Bytes.fromBase64(masterKey));
  const id = Bytes.toBase64(data.id);
  const logId = `groupv2(${id})`;
  const secretParams = Bytes.toBase64(data.secretParams);
  const publicParams = Bytes.toBase64(data.publicParams);
  const existingConversation = window.ConversationController.get(id) || window.ConversationController.getByDerivedGroupV2Id(id);
  const ourUuid = window.textsecure.storage.user.getCheckedUuid(import_UUID.UUIDKind.ACI);
  if (existingConversation && existingConversation.hasMember(ourUuid)) {
    log.warn(`joinViaLink/${logId}: Already a member of group, opening conversation`);
    window.reduxActions.conversations.showConversation({
      conversationId: existingConversation.id
    });
    (0, import_showToast.showToast)(import_ToastAlreadyGroupMember.ToastAlreadyGroupMember);
    return;
  }
  let result;
  try {
    result = await (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
      name: "getPreJoinGroupInfo",
      idForLogging: (0, import_groups.idForLogging)(id),
      suppressErrorDialog: true,
      task: () => (0, import_groups.getPreJoinGroupInfo)(inviteLinkPassword, masterKey)
    });
  } catch (error) {
    const errorString = Errors.toLogFormat(error);
    log.error(`joinViaLink/${logId}: Failed to fetch group info - ${errorString}`);
    if (error instanceof import_Errors.HTTPError && error.responseHeaders["x-signal-forbidden-reason"]) {
      showErrorDialog(window.i18n("GroupV2--join--link-forbidden"), window.i18n("GroupV2--join--link-forbidden--title"));
    } else if (error instanceof import_Errors.HTTPError && error.code === 403) {
      showErrorDialog(window.i18n("GroupV2--join--link-revoked"), window.i18n("GroupV2--join--link-revoked--title"));
    } else {
      showErrorDialog(window.i18n("GroupV2--join--general-join-failure"), window.i18n("GroupV2--join--general-join-failure--title"));
    }
    return;
  }
  if (!(0, import_util.isAccessControlEnabled)(result.addFromInviteLink)) {
    log.error(`joinViaLink/${logId}: addFromInviteLink value of ${result.addFromInviteLink} is invalid`);
    showErrorDialog(window.i18n("GroupV2--join--link-revoked"), window.i18n("GroupV2--join--link-revoked--title"));
    return;
  }
  let localAvatar = result.avatar ? { loading: true } : void 0;
  const memberCount = result.memberCount || 1;
  const approvalRequired = result.addFromInviteLink === import_protobuf.SignalService.AccessControl.AccessRequired.ADMINISTRATOR;
  const title = (0, import_groups.decryptGroupTitle)(result.title, secretParams) || window.i18n("unknownGroup");
  const groupDescription = (0, import_groups.decryptGroupDescription)(result.descriptionBytes, secretParams);
  if (approvalRequired && existingConversation && existingConversation.isMemberAwaitingApproval(ourUuid)) {
    log.warn(`joinViaLink/${logId}: Already awaiting approval, opening conversation`);
    const timestamp = existingConversation.get("timestamp") || Date.now();
    const active_at = existingConversation.get("active_at") || Date.now();
    existingConversation.set({ active_at, timestamp });
    window.Signal.Data.updateConversation(existingConversation.attributes);
    await (0, import_sleep.sleep)(200);
    window.reduxActions.conversations.showConversation({
      conversationId: existingConversation.id
    });
    (0, import_showToast.showToast)(import_ToastAlreadyRequestedToJoin.ToastAlreadyRequestedToJoin);
    return;
  }
  const getPreJoinConversation = /* @__PURE__ */ __name(() => {
    let avatar;
    if (!localAvatar) {
      avatar = void 0;
    } else if (localAvatar && localAvatar.loading) {
      avatar = {
        loading: true
      };
    } else if (localAvatar && localAvatar.path) {
      avatar = {
        url: window.Signal.Migrations.getAbsoluteAttachmentPath(localAvatar.path)
      };
    }
    return {
      approvalRequired,
      avatar,
      groupDescription,
      memberCount,
      title
    };
  }, "getPreJoinConversation");
  const { promise, resolve, reject } = (0, import_explodePromise.explodePromise)();
  const closeDialog = /* @__PURE__ */ __name(async () => {
    try {
      if (groupV2InfoDialog) {
        groupV2InfoDialog.remove();
        groupV2InfoDialog = void 0;
      }
      window.reduxActions.conversations.setPreJoinConversation(void 0);
      if (localAvatar && localAvatar.path) {
        await window.Signal.Migrations.deleteAttachmentData(localAvatar.path);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  }, "closeDialog");
  const join = /* @__PURE__ */ __name(async () => {
    try {
      if (groupV2InfoDialog) {
        groupV2InfoDialog.remove();
        groupV2InfoDialog = void 0;
      }
      window.reduxActions.conversations.setPreJoinConversation(void 0);
      await (0, import_longRunningTaskWrapper.longRunningTaskWrapper)({
        name: "joinViaLink",
        idForLogging: (0, import_groups.idForLogging)(id),
        suppressErrorDialog: true,
        task: async () => {
          let targetConversation = existingConversation || window.ConversationController.get(id) || window.ConversationController.getByDerivedGroupV2Id(id);
          let tempConversation;
          if (targetConversation && (targetConversation.hasMember(ourUuid) || approvalRequired && targetConversation.isMemberAwaitingApproval(ourUuid))) {
            log.warn(`joinViaLink/${logId}: User is part of group on second check, opening conversation`);
            window.reduxActions.conversations.showConversation({
              conversationId: targetConversation.id
            });
            return;
          }
          try {
            if (!targetConversation) {
              tempConversation = window.ConversationController.getOrCreate(id, "group", {
                isTemporary: true,
                active_at: Date.now(),
                timestamp: Date.now(),
                groupVersion: 2,
                masterKey,
                secretParams,
                publicParams,
                left: true,
                revision: result.version,
                avatar: localAvatar && localAvatar.path && result.avatar ? {
                  url: result.avatar,
                  path: localAvatar.path
                } : void 0,
                description: groupDescription,
                groupInviteLinkPassword: inviteLinkPassword,
                name: title,
                temporaryMemberCount: memberCount
              });
              targetConversation = tempConversation;
            } else {
              const timestamp = targetConversation.get("timestamp") || Date.now();
              const active_at = targetConversation.get("active_at") || Date.now();
              targetConversation.set({
                active_at,
                avatar: localAvatar && localAvatar.path && result.avatar ? {
                  url: result.avatar,
                  path: localAvatar.path
                } : void 0,
                description: groupDescription,
                groupInviteLinkPassword: inviteLinkPassword,
                name: title,
                revision: result.version,
                temporaryMemberCount: memberCount,
                timestamp
              });
              window.Signal.Data.updateConversation(targetConversation.attributes);
            }
            if ((0, import_whatTypeOfConversation.isGroupV1)(targetConversation.attributes)) {
              await targetConversation.joinGroupV2ViaLinkAndMigrate({
                approvalRequired,
                inviteLinkPassword,
                revision: result.version || 0
              });
            } else {
              await targetConversation.joinGroupV2ViaLink({
                inviteLinkPassword,
                approvalRequired
              });
            }
            if (tempConversation) {
              tempConversation.set({
                isTemporary: void 0
              });
              window.Signal.Data.updateConversation(tempConversation.attributes);
            }
            window.reduxActions.conversations.showConversation({
              conversationId: targetConversation.id
            });
          } catch (error) {
            if (tempConversation) {
              window.ConversationController.dangerouslyRemoveById(tempConversation.id);
              await window.Signal.Data.removeConversation(tempConversation.id);
            }
            throw error;
          }
        }
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  }, "join");
  window.reduxActions.conversations.setPreJoinConversation(getPreJoinConversation());
  log.info(`joinViaLink/${logId}: Showing modal`);
  let groupV2InfoDialog = new import_ReactWrapperView.ReactWrapperView({
    className: "group-v2-join-dialog-wrapper",
    JSX: window.Signal.State.Roots.createGroupV2JoinModal(window.reduxStore, {
      join,
      onClose: closeDialog
    })
  });
  const fetchAvatar = /* @__PURE__ */ __name(async () => {
    if (result.avatar) {
      localAvatar = {
        loading: true
      };
      const attributes = {
        avatar: null,
        secretParams
      };
      await (0, import_groups.applyNewAvatar)(result.avatar, attributes, logId);
      if (attributes.avatar && attributes.avatar.path) {
        localAvatar = {
          path: attributes.avatar.path
        };
        if (!groupV2InfoDialog) {
          await window.Signal.Migrations.deleteAttachmentData(attributes.avatar.path);
          return;
        }
      } else {
        localAvatar = void 0;
      }
      window.reduxActions.conversations.setPreJoinConversation(getPreJoinConversation());
    }
  }, "fetchAvatar");
  fetchAvatar();
  await promise;
}
function showErrorDialog(description, title) {
  const errorView = new import_ReactWrapperView.ReactWrapperView({
    className: "error-modal-wrapper",
    JSX: /* @__PURE__ */ React.createElement(import_ErrorModal.ErrorModal, {
      i18n: window.i18n,
      title,
      description,
      onClose: () => {
        errorView.remove();
      }
    })
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  joinViaLink
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiam9pblZpYUxpbmsudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgYXBwbHlOZXdBdmF0YXIsXG4gIGRlY3J5cHRHcm91cERlc2NyaXB0aW9uLFxuICBkZWNyeXB0R3JvdXBUaXRsZSxcbiAgZGVyaXZlR3JvdXBGaWVsZHMsXG4gIGdldFByZUpvaW5Hcm91cEluZm8sXG4gIGlkRm9yTG9nZ2luZyxcbiAgTElOS19WRVJTSU9OX0VSUk9SLFxuICBwYXJzZUdyb3VwTGluayxcbn0gZnJvbSAnLi4vZ3JvdXBzJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgVVVJREtpbmQgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCAqIGFzIEJ5dGVzIGZyb20gJy4uL0J5dGVzJztcbmltcG9ydCB7IGxvbmdSdW5uaW5nVGFza1dyYXBwZXIgfSBmcm9tICcuLi91dGlsL2xvbmdSdW5uaW5nVGFza1dyYXBwZXInO1xuaW1wb3J0IHsgaXNHcm91cFYxIH0gZnJvbSAnLi4vdXRpbC93aGF0VHlwZU9mQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IGV4cGxvZGVQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9leHBsb2RlUHJvbWlzZSc7XG5cbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFByZUpvaW5Db252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL3V0aWwvc2hvd1RvYXN0JztcbmltcG9ydCB7IFJlYWN0V3JhcHBlclZpZXcgfSBmcm9tICcuLi92aWV3cy9SZWFjdFdyYXBwZXJWaWV3JztcbmltcG9ydCB7IEVycm9yTW9kYWwgfSBmcm9tICcuLi9jb21wb25lbnRzL0Vycm9yTW9kYWwnO1xuaW1wb3J0IHsgVG9hc3RBbHJlYWR5R3JvdXBNZW1iZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0QWxyZWFkeUdyb3VwTWVtYmVyJztcbmltcG9ydCB7IFRvYXN0QWxyZWFkeVJlcXVlc3RlZFRvSm9pbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3RBbHJlYWR5UmVxdWVzdGVkVG9Kb2luJztcbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4uL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCB7IGlzQWNjZXNzQ29udHJvbEVuYWJsZWQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuLi91dGlsL3NsZWVwJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGpvaW5WaWFMaW5rKGhhc2g6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgaW52aXRlTGlua1Bhc3N3b3JkOiBzdHJpbmc7XG4gIGxldCBtYXN0ZXJLZXk6IHN0cmluZztcbiAgdHJ5IHtcbiAgICAoeyBpbnZpdGVMaW5rUGFzc3dvcmQsIG1hc3RlcktleSB9ID0gcGFyc2VHcm91cExpbmsoaGFzaCkpO1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnN0IGVycm9yU3RyaW5nID0gRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKTtcbiAgICBsb2cuZXJyb3IoYGpvaW5WaWFMaW5rOiBGYWlsZWQgdG8gcGFyc2UgZ3JvdXAgbGluayAke2Vycm9yU3RyaW5nfWApO1xuXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubmFtZSA9PT0gTElOS19WRVJTSU9OX0VSUk9SKSB7XG4gICAgICBzaG93RXJyb3JEaWFsb2coXG4gICAgICAgIHdpbmRvdy5pMThuKCdHcm91cFYyLS1qb2luLS11bmtub3duLWxpbmstdmVyc2lvbicpLFxuICAgICAgICB3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0tdW5rbm93bi1saW5rLXZlcnNpb24tLXRpdGxlJylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dFcnJvckRpYWxvZyhcbiAgICAgICAgd2luZG93LmkxOG4oJ0dyb3VwVjItLWpvaW4tLWludmFsaWQtbGluaycpLFxuICAgICAgICB3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0taW52YWxpZC1saW5rLS10aXRsZScpXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBkYXRhID0gZGVyaXZlR3JvdXBGaWVsZHMoQnl0ZXMuZnJvbUJhc2U2NChtYXN0ZXJLZXkpKTtcbiAgY29uc3QgaWQgPSBCeXRlcy50b0Jhc2U2NChkYXRhLmlkKTtcbiAgY29uc3QgbG9nSWQgPSBgZ3JvdXB2Migke2lkfSlgO1xuICBjb25zdCBzZWNyZXRQYXJhbXMgPSBCeXRlcy50b0Jhc2U2NChkYXRhLnNlY3JldFBhcmFtcyk7XG4gIGNvbnN0IHB1YmxpY1BhcmFtcyA9IEJ5dGVzLnRvQmFzZTY0KGRhdGEucHVibGljUGFyYW1zKTtcblxuICBjb25zdCBleGlzdGluZ0NvbnZlcnNhdGlvbiA9XG4gICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKSB8fFxuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldEJ5RGVyaXZlZEdyb3VwVjJJZChpZCk7XG4gIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoVVVJREtpbmQuQUNJKTtcblxuICBpZiAoZXhpc3RpbmdDb252ZXJzYXRpb24gJiYgZXhpc3RpbmdDb252ZXJzYXRpb24uaGFzTWVtYmVyKG91clV1aWQpKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgam9pblZpYUxpbmsvJHtsb2dJZH06IEFscmVhZHkgYSBtZW1iZXIgb2YgZ3JvdXAsIG9wZW5pbmcgY29udmVyc2F0aW9uYFxuICAgICk7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNob3dDb252ZXJzYXRpb24oe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IGV4aXN0aW5nQ29udmVyc2F0aW9uLmlkLFxuICAgIH0pO1xuICAgIHNob3dUb2FzdChUb2FzdEFscmVhZHlHcm91cE1lbWJlcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHJlc3VsdDogUHJvdG8uR3JvdXBKb2luSW5mbztcblxuICB0cnkge1xuICAgIHJlc3VsdCA9IGF3YWl0IGxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgbmFtZTogJ2dldFByZUpvaW5Hcm91cEluZm8nLFxuICAgICAgaWRGb3JMb2dnaW5nOiBpZEZvckxvZ2dpbmcoaWQpLFxuICAgICAgLy8gSWYgYW4gZXJyb3IgaGFwcGVucyBoZXJlLCB3ZSB3b24ndCBzaG93IGEgZGlhbG9nLiBXZSdsbCByZWx5IG9uIHRoZSBjYXRjaCBhIGZld1xuICAgICAgLy8gICBsaW5lcyBiZWxvdy5cbiAgICAgIHN1cHByZXNzRXJyb3JEaWFsb2c6IHRydWUsXG4gICAgICB0YXNrOiAoKSA9PiBnZXRQcmVKb2luR3JvdXBJbmZvKGludml0ZUxpbmtQYXNzd29yZCwgbWFzdGVyS2V5KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICBjb25zdCBlcnJvclN0cmluZyA9IEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcik7XG4gICAgbG9nLmVycm9yKFxuICAgICAgYGpvaW5WaWFMaW5rLyR7bG9nSWR9OiBGYWlsZWQgdG8gZmV0Y2ggZ3JvdXAgaW5mbyAtICR7ZXJyb3JTdHJpbmd9YFxuICAgICk7XG5cbiAgICBpZiAoXG4gICAgICBlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvciAmJlxuICAgICAgZXJyb3IucmVzcG9uc2VIZWFkZXJzWyd4LXNpZ25hbC1mb3JiaWRkZW4tcmVhc29uJ11cbiAgICApIHtcbiAgICAgIHNob3dFcnJvckRpYWxvZyhcbiAgICAgICAgd2luZG93LmkxOG4oJ0dyb3VwVjItLWpvaW4tLWxpbmstZm9yYmlkZGVuJyksXG4gICAgICAgIHdpbmRvdy5pMThuKCdHcm91cFYyLS1qb2luLS1saW5rLWZvcmJpZGRlbi0tdGl0bGUnKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgSFRUUEVycm9yICYmIGVycm9yLmNvZGUgPT09IDQwMykge1xuICAgICAgc2hvd0Vycm9yRGlhbG9nKFxuICAgICAgICB3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0tbGluay1yZXZva2VkJyksXG4gICAgICAgIHdpbmRvdy5pMThuKCdHcm91cFYyLS1qb2luLS1saW5rLXJldm9rZWQtLXRpdGxlJylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dFcnJvckRpYWxvZyhcbiAgICAgICAgd2luZG93LmkxOG4oJ0dyb3VwVjItLWpvaW4tLWdlbmVyYWwtam9pbi1mYWlsdXJlJyksXG4gICAgICAgIHdpbmRvdy5pMThuKCdHcm91cFYyLS1qb2luLS1nZW5lcmFsLWpvaW4tZmFpbHVyZS0tdGl0bGUnKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFpc0FjY2Vzc0NvbnRyb2xFbmFibGVkKHJlc3VsdC5hZGRGcm9tSW52aXRlTGluaykpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgam9pblZpYUxpbmsvJHtsb2dJZH06IGFkZEZyb21JbnZpdGVMaW5rIHZhbHVlIG9mICR7cmVzdWx0LmFkZEZyb21JbnZpdGVMaW5rfSBpcyBpbnZhbGlkYFxuICAgICk7XG4gICAgc2hvd0Vycm9yRGlhbG9nKFxuICAgICAgd2luZG93LmkxOG4oJ0dyb3VwVjItLWpvaW4tLWxpbmstcmV2b2tlZCcpLFxuICAgICAgd2luZG93LmkxOG4oJ0dyb3VwVjItLWpvaW4tLWxpbmstcmV2b2tlZC0tdGl0bGUnKVxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGxvY2FsQXZhdGFyOlxuICAgIHwge1xuICAgICAgICBsb2FkaW5nPzogYm9vbGVhbjtcbiAgICAgICAgcGF0aD86IHN0cmluZztcbiAgICAgIH1cbiAgICB8IHVuZGVmaW5lZCA9IHJlc3VsdC5hdmF0YXIgPyB7IGxvYWRpbmc6IHRydWUgfSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgbWVtYmVyQ291bnQgPSByZXN1bHQubWVtYmVyQ291bnQgfHwgMTtcbiAgY29uc3QgYXBwcm92YWxSZXF1aXJlZCA9XG4gICAgcmVzdWx0LmFkZEZyb21JbnZpdGVMaW5rID09PVxuICAgIFByb3RvLkFjY2Vzc0NvbnRyb2wuQWNjZXNzUmVxdWlyZWQuQURNSU5JU1RSQVRPUjtcbiAgY29uc3QgdGl0bGUgPVxuICAgIGRlY3J5cHRHcm91cFRpdGxlKHJlc3VsdC50aXRsZSwgc2VjcmV0UGFyYW1zKSB8fFxuICAgIHdpbmRvdy5pMThuKCd1bmtub3duR3JvdXAnKTtcbiAgY29uc3QgZ3JvdXBEZXNjcmlwdGlvbiA9IGRlY3J5cHRHcm91cERlc2NyaXB0aW9uKFxuICAgIHJlc3VsdC5kZXNjcmlwdGlvbkJ5dGVzLFxuICAgIHNlY3JldFBhcmFtc1xuICApO1xuXG4gIGlmIChcbiAgICBhcHByb3ZhbFJlcXVpcmVkICYmXG4gICAgZXhpc3RpbmdDb252ZXJzYXRpb24gJiZcbiAgICBleGlzdGluZ0NvbnZlcnNhdGlvbi5pc01lbWJlckF3YWl0aW5nQXBwcm92YWwob3VyVXVpZClcbiAgKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgam9pblZpYUxpbmsvJHtsb2dJZH06IEFscmVhZHkgYXdhaXRpbmcgYXBwcm92YWwsIG9wZW5pbmcgY29udmVyc2F0aW9uYFxuICAgICk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gZXhpc3RpbmdDb252ZXJzYXRpb24uZ2V0KCd0aW1lc3RhbXAnKSB8fCBEYXRlLm5vdygpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcbiAgICBjb25zdCBhY3RpdmVfYXQgPSBleGlzdGluZ0NvbnZlcnNhdGlvbi5nZXQoJ2FjdGl2ZV9hdCcpIHx8IERhdGUubm93KCk7XG4gICAgZXhpc3RpbmdDb252ZXJzYXRpb24uc2V0KHsgYWN0aXZlX2F0LCB0aW1lc3RhbXAgfSk7XG4gICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihleGlzdGluZ0NvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcblxuICAgIC8vIFdlJ3JlIHdhaXRpbmcgZm9yIHRoZSBsZWZ0IHBhbmUgdG8gcmUtc29ydCBiZWZvcmUgd2UgbmF2aWdhdGUgdG8gdGhhdCBjb252ZXJzYXRpb25cbiAgICBhd2FpdCBzbGVlcCgyMDApO1xuXG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNob3dDb252ZXJzYXRpb24oe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IGV4aXN0aW5nQ29udmVyc2F0aW9uLmlkLFxuICAgIH0pO1xuXG4gICAgc2hvd1RvYXN0KFRvYXN0QWxyZWFkeVJlcXVlc3RlZFRvSm9pbik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZ2V0UHJlSm9pbkNvbnZlcnNhdGlvbiA9ICgpOiBQcmVKb2luQ29udmVyc2F0aW9uVHlwZSA9PiB7XG4gICAgbGV0IGF2YXRhcjtcbiAgICBpZiAoIWxvY2FsQXZhdGFyKSB7XG4gICAgICBhdmF0YXIgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChsb2NhbEF2YXRhciAmJiBsb2NhbEF2YXRhci5sb2FkaW5nKSB7XG4gICAgICBhdmF0YXIgPSB7XG4gICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobG9jYWxBdmF0YXIgJiYgbG9jYWxBdmF0YXIucGF0aCkge1xuICAgICAgYXZhdGFyID0ge1xuICAgICAgICB1cmw6IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5nZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKFxuICAgICAgICAgIGxvY2FsQXZhdGFyLnBhdGhcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFwcHJvdmFsUmVxdWlyZWQsXG4gICAgICBhdmF0YXIsXG4gICAgICBncm91cERlc2NyaXB0aW9uLFxuICAgICAgbWVtYmVyQ291bnQsXG4gICAgICB0aXRsZSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIEV4cGxvZGUgYSBwcm9taXNlIHNvIHdlIGtub3cgd2hlbiB0aGlzIHdob2xlIGpvaW4gcHJvY2VzcyBpcyBjb21wbGV0ZVxuICBjb25zdCB7IHByb21pc2UsIHJlc29sdmUsIHJlamVjdCB9ID0gZXhwbG9kZVByb21pc2U8dm9pZD4oKTtcblxuICBjb25zdCBjbG9zZURpYWxvZyA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGdyb3VwVjJJbmZvRGlhbG9nKSB7XG4gICAgICAgIGdyb3VwVjJJbmZvRGlhbG9nLnJlbW92ZSgpO1xuICAgICAgICBncm91cFYySW5mb0RpYWxvZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNldFByZUpvaW5Db252ZXJzYXRpb24odW5kZWZpbmVkKTtcblxuICAgICAgaWYgKGxvY2FsQXZhdGFyICYmIGxvY2FsQXZhdGFyLnBhdGgpIHtcbiAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5NaWdyYXRpb25zLmRlbGV0ZUF0dGFjaG1lbnREYXRhKGxvY2FsQXZhdGFyLnBhdGgpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBqb2luID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZ3JvdXBWMkluZm9EaWFsb2cpIHtcbiAgICAgICAgZ3JvdXBWMkluZm9EaWFsb2cucmVtb3ZlKCk7XG4gICAgICAgIGdyb3VwVjJJbmZvRGlhbG9nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuc2V0UHJlSm9pbkNvbnZlcnNhdGlvbih1bmRlZmluZWQpO1xuXG4gICAgICBhd2FpdCBsb25nUnVubmluZ1Rhc2tXcmFwcGVyKHtcbiAgICAgICAgbmFtZTogJ2pvaW5WaWFMaW5rJyxcbiAgICAgICAgaWRGb3JMb2dnaW5nOiBpZEZvckxvZ2dpbmcoaWQpLFxuICAgICAgICAvLyBJZiBhbiBlcnJvciBoYXBwZW5zIGhlcmUsIHdlIHdvbid0IHNob3cgYSBkaWFsb2cuIFdlJ2xsIHJlbHkgb24gYSB0b3AtbGV2ZWxcbiAgICAgICAgLy8gICBlcnJvciBkaWFsb2cgcHJvdmlkZWQgYnkgdGhlIGNhbGxlciBvZiB0aGlzIGZ1bmN0aW9uLlxuICAgICAgICBzdXBwcmVzc0Vycm9yRGlhbG9nOiB0cnVlLFxuICAgICAgICB0YXNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IHRhcmdldENvbnZlcnNhdGlvbiA9XG4gICAgICAgICAgICBleGlzdGluZ0NvbnZlcnNhdGlvbiB8fFxuICAgICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKSB8fFxuICAgICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0QnlEZXJpdmVkR3JvdXBWMklkKGlkKTtcbiAgICAgICAgICBsZXQgdGVtcENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAvLyBDaGVjayBhZ2FpbiB0byBlbnN1cmUgdGhhdCB3ZSBoYXZlbid0IGFscmVhZHkgam9pbmVkIG9yIHJlcXVlc3RlZCB0byBqb2luXG4gICAgICAgICAgLy8gICB2aWEgc29tZSBvdGhlciBwcm9jZXNzLiBJZiBzbywganVzdCBvcGVuIHRoYXQgY29udmVyc2F0aW9uLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRhcmdldENvbnZlcnNhdGlvbiAmJlxuICAgICAgICAgICAgKHRhcmdldENvbnZlcnNhdGlvbi5oYXNNZW1iZXIob3VyVXVpZCkgfHxcbiAgICAgICAgICAgICAgKGFwcHJvdmFsUmVxdWlyZWQgJiZcbiAgICAgICAgICAgICAgICB0YXJnZXRDb252ZXJzYXRpb24uaXNNZW1iZXJBd2FpdGluZ0FwcHJvdmFsKG91clV1aWQpKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgICBgam9pblZpYUxpbmsvJHtsb2dJZH06IFVzZXIgaXMgcGFydCBvZiBncm91cCBvbiBzZWNvbmQgY2hlY2ssIG9wZW5pbmcgY29udmVyc2F0aW9uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5zaG93Q29udmVyc2F0aW9uKHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IHRhcmdldENvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIXRhcmdldENvbnZlcnNhdGlvbikge1xuICAgICAgICAgICAgICAvLyBOb3RlOiB3ZSBzYXZlIHRoaXMgdGVtcCBjb252ZXJzYXRpb24gaW4gdGhlIGRhdGFiYXNlLCBzbyB3ZSdsbCBuZWVkIHRvXG4gICAgICAgICAgICAgIC8vICAgY2xlYW4gaXQgdXAgaWYgc29tZXRoaW5nIGdvZXMgd3JvbmdcbiAgICAgICAgICAgICAgdGVtcENvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlKFxuICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICdncm91cCcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIGNhdXNlIHRoaXMgY29udmVyc2F0aW9uIHRvIGJlIGRlbGV0ZWQgYXQgbmV4dCBzdGFydHVwXG4gICAgICAgICAgICAgICAgICBpc1RlbXBvcmFyeTogdHJ1ZSxcblxuICAgICAgICAgICAgICAgICAgYWN0aXZlX2F0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXG4gICAgICAgICAgICAgICAgICBncm91cFZlcnNpb246IDIsXG4gICAgICAgICAgICAgICAgICBtYXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgICBzZWNyZXRQYXJhbXMsXG4gICAgICAgICAgICAgICAgICBwdWJsaWNQYXJhbXMsXG5cbiAgICAgICAgICAgICAgICAgIGxlZnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICByZXZpc2lvbjogcmVzdWx0LnZlcnNpb24sXG5cbiAgICAgICAgICAgICAgICAgIGF2YXRhcjpcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxBdmF0YXIgJiYgbG9jYWxBdmF0YXIucGF0aCAmJiByZXN1bHQuYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVzdWx0LmF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogbG9jYWxBdmF0YXIucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBncm91cERlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgZ3JvdXBJbnZpdGVMaW5rUGFzc3dvcmQ6IGludml0ZUxpbmtQYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgdGVtcG9yYXJ5TWVtYmVyQ291bnQ6IG1lbWJlckNvdW50LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uID0gdGVtcENvbnZlcnNhdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgZ3JvdXAgbWFpbnRhaW5zIHRoZSB0aXRsZSBhbmQgYXZhdGFyIHlvdSBzYXcgd2hlbiBhdHRlbXB0aW5nXG4gICAgICAgICAgICAgIC8vICAgdG8gam9pbiBpdC5cbiAgICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wID1cbiAgICAgICAgICAgICAgICB0YXJnZXRDb252ZXJzYXRpb24uZ2V0KCd0aW1lc3RhbXAnKSB8fCBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZV9hdCA9XG4gICAgICAgICAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uLmdldCgnYWN0aXZlX2F0JykgfHwgRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgICAgICAgYWN0aXZlX2F0LFxuICAgICAgICAgICAgICAgIGF2YXRhcjpcbiAgICAgICAgICAgICAgICAgIGxvY2FsQXZhdGFyICYmIGxvY2FsQXZhdGFyLnBhdGggJiYgcmVzdWx0LmF2YXRhclxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVzdWx0LmF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGxvY2FsQXZhdGFyLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZ3JvdXBEZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBncm91cEludml0ZUxpbmtQYXNzd29yZDogaW52aXRlTGlua1Bhc3N3b3JkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgIHJldmlzaW9uOiByZXN1bHQudmVyc2lvbixcbiAgICAgICAgICAgICAgICB0ZW1wb3JhcnlNZW1iZXJDb3VudDogbWVtYmVyQ291bnQsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihcbiAgICAgICAgICAgICAgICB0YXJnZXRDb252ZXJzYXRpb24uYXR0cmlidXRlc1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNHcm91cFYxKHRhcmdldENvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgICBhd2FpdCB0YXJnZXRDb252ZXJzYXRpb24uam9pbkdyb3VwVjJWaWFMaW5rQW5kTWlncmF0ZSh7XG4gICAgICAgICAgICAgICAgYXBwcm92YWxSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBpbnZpdGVMaW5rUGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgcmV2aXNpb246IHJlc3VsdC52ZXJzaW9uIHx8IDAsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXdhaXQgdGFyZ2V0Q29udmVyc2F0aW9uLmpvaW5Hcm91cFYyVmlhTGluayh7XG4gICAgICAgICAgICAgICAgaW52aXRlTGlua1Bhc3N3b3JkLFxuICAgICAgICAgICAgICAgIGFwcHJvdmFsUmVxdWlyZWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGVtcENvbnZlcnNhdGlvbikge1xuICAgICAgICAgICAgICB0ZW1wQ29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgICAgICAgLy8gV2Ugd2FudCB0byBrZWVwIHRoaXMgY29udmVyc2F0aW9uIGFyb3VuZCwgc2luY2UgdGhlIGpvaW4gc3VjY2VlZGVkXG4gICAgICAgICAgICAgICAgaXNUZW1wb3Jhcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24oXG4gICAgICAgICAgICAgICAgdGVtcENvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5zaG93Q29udmVyc2F0aW9uKHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IHRhcmdldENvbnZlcnNhdGlvbi5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBEZWxldGUgbmV3bHktY3JlYXRlZCBjb252ZXJzYXRpb24gaWYgd2UgZW5jb3VudGVyZWQgYW55IGVycm9yc1xuICAgICAgICAgICAgaWYgKHRlbXBDb252ZXJzYXRpb24pIHtcbiAgICAgICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZGFuZ2Vyb3VzbHlSZW1vdmVCeUlkKFxuICAgICAgICAgICAgICAgIHRlbXBDb252ZXJzYXRpb24uaWRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnJlbW92ZUNvbnZlcnNhdGlvbih0ZW1wQ29udmVyc2F0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEluaXRpYWwgYWRkIHRvIHJlZHV4LCB3aXRoIGJhc2ljIGdyb3VwIGluZm9ybWF0aW9uXG4gIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5zZXRQcmVKb2luQ29udmVyc2F0aW9uKFxuICAgIGdldFByZUpvaW5Db252ZXJzYXRpb24oKVxuICApO1xuXG4gIGxvZy5pbmZvKGBqb2luVmlhTGluay8ke2xvZ0lkfTogU2hvd2luZyBtb2RhbGApO1xuXG4gIGxldCBncm91cFYySW5mb0RpYWxvZzogQmFja2JvbmUuVmlldyB8IHVuZGVmaW5lZCA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICBjbGFzc05hbWU6ICdncm91cC12Mi1qb2luLWRpYWxvZy13cmFwcGVyJyxcbiAgICBKU1g6IHdpbmRvdy5TaWduYWwuU3RhdGUuUm9vdHMuY3JlYXRlR3JvdXBWMkpvaW5Nb2RhbCh3aW5kb3cucmVkdXhTdG9yZSwge1xuICAgICAgam9pbixcbiAgICAgIG9uQ2xvc2U6IGNsb3NlRGlhbG9nLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBXZSBkZWNsYXJlIGEgbmV3IGZ1bmN0aW9uIGhlcmUgc28gd2UgY2FuIGF3YWl0IGJ1dCBub3QgYmxvY2tcbiAgY29uc3QgZmV0Y2hBdmF0YXIgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHJlc3VsdC5hdmF0YXIpIHtcbiAgICAgIGxvY2FsQXZhdGFyID0ge1xuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgYXR0cmlidXRlczogUGljazxcbiAgICAgICAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gICAgICAgICdhdmF0YXInIHwgJ3NlY3JldFBhcmFtcydcbiAgICAgID4gPSB7XG4gICAgICAgIGF2YXRhcjogbnVsbCxcbiAgICAgICAgc2VjcmV0UGFyYW1zLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGFwcGx5TmV3QXZhdGFyKHJlc3VsdC5hdmF0YXIsIGF0dHJpYnV0ZXMsIGxvZ0lkKTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZXMuYXZhdGFyICYmIGF0dHJpYnV0ZXMuYXZhdGFyLnBhdGgpIHtcbiAgICAgICAgbG9jYWxBdmF0YXIgPSB7XG4gICAgICAgICAgcGF0aDogYXR0cmlidXRlcy5hdmF0YXIucGF0aCxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBEaWFsb2cgaGFzIGJlZW4gZGlzbWlzc2VkOyB3ZSdsbCBkZWxldGUgdGhlIHVubmVlZWRlZCBhdmF0YXJcbiAgICAgICAgaWYgKCFncm91cFYySW5mb0RpYWxvZykge1xuICAgICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuTWlncmF0aW9ucy5kZWxldGVBdHRhY2htZW50RGF0YShcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuYXZhdGFyLnBhdGhcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxBdmF0YXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSBqb2luIGRpYWxvZyB3aXRoIG5ld2x5LWRvd25sb2FkZWQgYXZhdGFyXG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuc2V0UHJlSm9pbkNvbnZlcnNhdGlvbihcbiAgICAgICAgZ2V0UHJlSm9pbkNvbnZlcnNhdGlvbigpXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmZXRjaEF2YXRhcigpO1xuXG4gIGF3YWl0IHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIHNob3dFcnJvckRpYWxvZyhkZXNjcmlwdGlvbjogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XG4gIGNvbnN0IGVycm9yVmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICBjbGFzc05hbWU6ICdlcnJvci1tb2RhbC13cmFwcGVyJyxcbiAgICBKU1g6IChcbiAgICAgIDxFcnJvck1vZGFsXG4gICAgICAgIGkxOG49e3dpbmRvdy5pMThufVxuICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIGVycm9yVmlldy5yZW1vdmUoKTtcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKSxcbiAgfSk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsWUFBdUI7QUFDdkIsb0JBU087QUFDUCxhQUF3QjtBQUN4QixrQkFBeUI7QUFDekIsWUFBdUI7QUFDdkIsb0NBQXVDO0FBQ3ZDLG9DQUEwQjtBQUMxQiw0QkFBK0I7QUFLL0Isc0JBQXVDO0FBQ3ZDLFVBQXFCO0FBQ3JCLHVCQUEwQjtBQUMxQiw4QkFBaUM7QUFDakMsd0JBQTJCO0FBQzNCLHFDQUF3QztBQUN4Qyx5Q0FBNEM7QUFDNUMsb0JBQTBCO0FBQzFCLGtCQUF1QztBQUN2QyxtQkFBc0I7QUFFdEIsMkJBQWtDLE1BQTZCO0FBQzdELE1BQUk7QUFDSixNQUFJO0FBQ0osTUFBSTtBQUNGLElBQUMsR0FBRSxvQkFBb0IsVUFBVSxJQUFJLGtDQUFlLElBQUk7QUFBQSxFQUMxRCxTQUFTLE9BQVA7QUFDQSxVQUFNLGNBQWMsT0FBTyxZQUFZLEtBQUs7QUFDNUMsUUFBSSxNQUFNLDJDQUEyQyxhQUFhO0FBRWxFLFFBQUksaUJBQWlCLFNBQVMsTUFBTSxTQUFTLGtDQUFvQjtBQUMvRCxzQkFDRSxPQUFPLEtBQUsscUNBQXFDLEdBQ2pELE9BQU8sS0FBSyw0Q0FBNEMsQ0FDMUQ7QUFBQSxJQUNGLE9BQU87QUFD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
