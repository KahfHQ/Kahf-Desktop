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
var groupChange_exports = {};
__export(groupChange_exports, {
  renderChange: () => renderChange,
  renderChangeDetail: () => renderChangeDetail
});
module.exports = __toCommonJS(groupChange_exports);
var import_missingCaseError = require("./util/missingCaseError");
var import_protobuf = require("./protobuf");
var log = __toESM(require("./logging/log"));
const AccessControlEnum = import_protobuf.SignalService.AccessControl.AccessRequired;
const RoleEnum = import_protobuf.SignalService.Member.Role;
function renderChange(change, options) {
  const { details, from } = change;
  return details.flatMap((detail) => {
    const texts = renderChangeDetail(detail, {
      ...options,
      from
    });
    if (!Array.isArray(texts)) {
      return { detail, isLastText: true, text: texts };
    }
    return texts.map((text, index) => {
      const isLastText = index === texts.length - 1;
      return { detail, isLastText, text };
    });
  });
}
function renderChangeDetail(detail, options) {
  const { from, i18n, ourACI, ourPNI, renderContact, renderString } = options;
  const isOurUuid = /* @__PURE__ */ __name((uuid) => {
    if (!uuid) {
      return false;
    }
    return Boolean(ourACI && uuid === ourACI || ourPNI && uuid === ourPNI);
  }, "isOurUuid");
  const fromYou = isOurUuid(from);
  if (detail.type === "create") {
    if (fromYou) {
      return renderString("GroupV2--create--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--create--other", i18n, {
        memberName: renderContact(from)
      });
    }
    return renderString("GroupV2--create--unknown", i18n);
  }
  if (detail.type === "title") {
    const { newTitle } = detail;
    if (newTitle) {
      if (fromYou) {
        return renderString("GroupV2--title--change--you", i18n, [newTitle]);
      }
      if (from) {
        return renderString("GroupV2--title--change--other", i18n, {
          memberName: renderContact(from),
          newTitle
        });
      }
      return renderString("GroupV2--title--change--unknown", i18n, [newTitle]);
    }
    if (fromYou) {
      return renderString("GroupV2--title--remove--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--title--remove--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--title--remove--unknown", i18n);
  }
  if (detail.type === "avatar") {
    if (detail.removed) {
      if (fromYou) {
        return renderString("GroupV2--avatar--remove--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--avatar--remove--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--avatar--remove--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--avatar--change--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--avatar--change--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--avatar--change--unknown", i18n);
  }
  if (detail.type === "access-attributes") {
    const { newPrivilege } = detail;
    if (newPrivilege === AccessControlEnum.ADMINISTRATOR) {
      if (fromYou) {
        return renderString("GroupV2--access-attributes--admins--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-attributes--admins--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--access-attributes--admins--unknown", i18n);
    }
    if (newPrivilege === AccessControlEnum.MEMBER) {
      if (fromYou) {
        return renderString("GroupV2--access-attributes--all--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-attributes--all--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--access-attributes--all--unknown", i18n);
    }
    log.warn(`access-attributes change type, privilege ${newPrivilege} is unknown`);
    return "";
  }
  if (detail.type === "access-members") {
    const { newPrivilege } = detail;
    if (newPrivilege === AccessControlEnum.ADMINISTRATOR) {
      if (fromYou) {
        return renderString("GroupV2--access-members--admins--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-members--admins--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--access-members--admins--unknown", i18n);
    }
    if (newPrivilege === AccessControlEnum.MEMBER) {
      if (fromYou) {
        return renderString("GroupV2--access-members--all--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-members--all--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--access-members--all--unknown", i18n);
    }
    log.warn(`access-members change type, privilege ${newPrivilege} is unknown`);
    return "";
  }
  if (detail.type === "access-invite-link") {
    const { newPrivilege } = detail;
    if (newPrivilege === AccessControlEnum.ADMINISTRATOR) {
      if (fromYou) {
        return renderString("GroupV2--access-invite-link--enabled--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-invite-link--enabled--other", i18n, [renderContact(from)]);
      }
      return renderString("GroupV2--access-invite-link--enabled--unknown", i18n);
    }
    if (newPrivilege === AccessControlEnum.ANY) {
      if (fromYou) {
        return renderString("GroupV2--access-invite-link--disabled--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--access-invite-link--disabled--other", i18n, [renderContact(from)]);
      }
      return renderString("GroupV2--access-invite-link--disabled--unknown", i18n);
    }
    log.warn(`access-invite-link change type, privilege ${newPrivilege} is unknown`);
    return "";
  }
  if (detail.type === "member-add") {
    const { uuid } = detail;
    const weAreJoiner = isOurUuid(uuid);
    if (weAreJoiner) {
      if (fromYou) {
        return renderString("GroupV2--member-add--you--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--member-add--you--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--member-add--you--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--member-add--other--you", i18n, [
        renderContact(uuid)
      ]);
    }
    if (from) {
      return renderString("GroupV2--member-add--other--other", i18n, {
        adderName: renderContact(from),
        addeeName: renderContact(uuid)
      });
    }
    return renderString("GroupV2--member-add--other--unknown", i18n, [
      renderContact(uuid)
    ]);
  }
  if (detail.type === "member-add-from-invite") {
    const { uuid, inviter } = detail;
    const weAreJoiner = isOurUuid(uuid);
    const weAreInviter = isOurUuid(inviter);
    const pniPromotedToACI = weAreJoiner && from === ourPNI;
    if (!from || from !== uuid && !pniPromotedToACI) {
      if (weAreJoiner) {
        if (from) {
          return renderString("GroupV2--member-add--you--other", i18n, [
            renderContact(from)
          ]);
        }
        return renderString("GroupV2--member-add--you--unknown", i18n);
      }
      if (fromYou) {
        return renderString("GroupV2--member-add--invited--you", i18n, {
          inviteeName: renderContact(uuid)
        });
      }
      if (from) {
        return renderString("GroupV2--member-add--invited--other", i18n, {
          memberName: renderContact(from),
          inviteeName: renderContact(uuid)
        });
      }
      return renderString("GroupV2--member-add--invited--unknown", i18n, {
        inviteeName: renderContact(uuid)
      });
    }
    if (weAreJoiner) {
      if (inviter) {
        return renderString("GroupV2--member-add--from-invite--you", i18n, [
          renderContact(inviter)
        ]);
      }
      return renderString("GroupV2--member-add--from-invite--you-no-from", i18n);
    }
    if (weAreInviter) {
      return renderString("GroupV2--member-add--from-invite--from-you", i18n, [
        renderContact(uuid)
      ]);
    }
    if (inviter) {
      return renderString("GroupV2--member-add--from-invite--other", i18n, {
        inviteeName: renderContact(uuid),
        inviterName: renderContact(inviter)
      });
    }
    return renderString("GroupV2--member-add--from-invite--other-no-from", i18n, {
      inviteeName: renderContact(uuid)
    });
  }
  if (detail.type === "member-add-from-link") {
    const { uuid } = detail;
    if (fromYou && isOurUuid(uuid)) {
      return renderString("GroupV2--member-add-from-link--you--you", i18n);
    }
    if (from && uuid === from) {
      return renderString("GroupV2--member-add-from-link--other", i18n, [
        renderContact(from)
      ]);
    }
    log.warn("member-add-from-link change type; we have no from!");
    return renderString("GroupV2--member-add--other--unknown", i18n, [
      renderContact(uuid)
    ]);
  }
  if (detail.type === "member-add-from-admin-approval") {
    const { uuid } = detail;
    const weAreJoiner = isOurUuid(uuid);
    if (weAreJoiner) {
      if (from) {
        return renderString("GroupV2--member-add-from-admin-approval--you--other", i18n, [renderContact(from)]);
      }
      log.warn("member-add-from-admin-approval change type; we have no from, and we are joiner!");
      return renderString("GroupV2--member-add-from-admin-approval--you--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--member-add-from-admin-approval--other--you", i18n, [renderContact(uuid)]);
    }
    if (from) {
      return renderString("GroupV2--member-add-from-admin-approval--other--other", i18n, {
        adminName: renderContact(from),
        joinerName: renderContact(uuid)
      });
    }
    log.warn("member-add-from-admin-approval change type; we have no from");
    return renderString("GroupV2--member-add-from-admin-approval--other--unknown", i18n, [renderContact(uuid)]);
  }
  if (detail.type === "member-remove") {
    const { uuid } = detail;
    const weAreLeaver = isOurUuid(uuid);
    if (weAreLeaver) {
      if (fromYou) {
        return renderString("GroupV2--member-remove--you--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--member-remove--you--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--member-remove--you--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--member-remove--other--you", i18n, [
        renderContact(uuid)
      ]);
    }
    if (from && from === uuid) {
      return renderString("GroupV2--member-remove--other--self", i18n, [
        renderContact(from)
      ]);
    }
    if (from) {
      return renderString("GroupV2--member-remove--other--other", i18n, {
        adminName: renderContact(from),
        memberName: renderContact(uuid)
      });
    }
    return renderString("GroupV2--member-remove--other--unknown", i18n, [
      renderContact(uuid)
    ]);
  }
  if (detail.type === "member-privilege") {
    const { uuid, newPrivilege } = detail;
    const weAreMember = isOurUuid(uuid);
    if (newPrivilege === RoleEnum.ADMINISTRATOR) {
      if (weAreMember) {
        if (from) {
          return renderString("GroupV2--member-privilege--promote--you--other", i18n, [renderContact(from)]);
        }
        return renderString("GroupV2--member-privilege--promote--you--unknown", i18n);
      }
      if (fromYou) {
        return renderString("GroupV2--member-privilege--promote--other--you", i18n, [renderContact(uuid)]);
      }
      if (from) {
        return renderString("GroupV2--member-privilege--promote--other--other", i18n, {
          adminName: renderContact(from),
          memberName: renderContact(uuid)
        });
      }
      return renderString("GroupV2--member-privilege--promote--other--unknown", i18n, [renderContact(uuid)]);
    }
    if (newPrivilege === RoleEnum.DEFAULT) {
      if (weAreMember) {
        if (from) {
          return renderString("GroupV2--member-privilege--demote--you--other", i18n, [renderContact(from)]);
        }
        return renderString("GroupV2--member-privilege--demote--you--unknown", i18n);
      }
      if (fromYou) {
        return renderString("GroupV2--member-privilege--demote--other--you", i18n, [renderContact(uuid)]);
      }
      if (from) {
        return renderString("GroupV2--member-privilege--demote--other--other", i18n, {
          adminName: renderContact(from),
          memberName: renderContact(uuid)
        });
      }
      return renderString("GroupV2--member-privilege--demote--other--unknown", i18n, [renderContact(uuid)]);
    }
    log.warn(`member-privilege change type, privilege ${newPrivilege} is unknown`);
    return "";
  }
  if (detail.type === "pending-add-one") {
    const { uuid } = detail;
    const weAreInvited = isOurUuid(uuid);
    if (weAreInvited) {
      if (from) {
        return renderString("GroupV2--pending-add--one--you--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--pending-add--one--you--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--pending-add--one--other--you", i18n, [
        renderContact(uuid)
      ]);
    }
    if (from) {
      return renderString("GroupV2--pending-add--one--other--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--pending-add--one--other--unknown", i18n);
  }
  if (detail.type === "pending-add-many") {
    const { count } = detail;
    if (fromYou) {
      return renderString("GroupV2--pending-add--many--you", i18n, [
        count.toString()
      ]);
    }
    if (from) {
      return renderString("GroupV2--pending-add--many--other", i18n, {
        memberName: renderContact(from),
        count: count.toString()
      });
    }
    return renderString("GroupV2--pending-add--many--unknown", i18n, [
      count.toString()
    ]);
  }
  if (detail.type === "pending-remove-one") {
    const { inviter, uuid } = detail;
    const weAreInviter = isOurUuid(inviter);
    const weAreInvited = isOurUuid(uuid);
    const sentByInvited = Boolean(from && from === uuid);
    const sentByInviter = Boolean(from && inviter && from === inviter);
    if (weAreInviter) {
      if (sentByInvited) {
        return renderString("GroupV2--pending-remove--decline--you", i18n, [
          renderContact(uuid)
        ]);
      }
      if (fromYou) {
        return renderString("GroupV2--pending-remove--revoke-invite-from-you--one--you", i18n, [renderContact(uuid)]);
      }
      if (from) {
        return renderString("GroupV2--pending-remove--revoke-invite-from-you--one--other", i18n, {
          adminName: renderContact(from),
          inviteeName: renderContact(uuid)
        });
      }
      return renderString("GroupV2--pending-remove--revoke-invite-from-you--one--unknown", i18n, [renderContact(uuid)]);
    }
    if (sentByInvited) {
      if (fromYou) {
        return renderString("GroupV2--pending-remove--decline--from-you", i18n);
      }
      if (inviter) {
        return renderString("GroupV2--pending-remove--decline--other", i18n, [
          renderContact(inviter)
        ]);
      }
      return renderString("GroupV2--pending-remove--decline--unknown", i18n);
    }
    if (inviter && sentByInviter) {
      if (weAreInvited) {
        return renderString("GroupV2--pending-remove--revoke-own--to-you", i18n, [renderContact(inviter)]);
      }
      return renderString("GroupV2--pending-remove--revoke-own--unknown", i18n, [renderContact(inviter)]);
    }
    if (inviter) {
      if (fromYou) {
        return renderString("GroupV2--pending-remove--revoke-invite-from--one--you", i18n, [renderContact(inviter)]);
      }
      if (from) {
        return renderString("GroupV2--pending-remove--revoke-invite-from--one--other", i18n, {
          adminName: renderContact(from),
          memberName: renderContact(inviter)
        });
      }
      return renderString("GroupV2--pending-remove--revoke-invite-from--one--unknown", i18n, [renderContact(inviter)]);
    }
    if (fromYou) {
      return renderString("GroupV2--pending-remove--revoke--one--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--pending-remove--revoke--one--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--pending-remove--revoke--one--unknown", i18n);
  }
  if (detail.type === "pending-remove-many") {
    const { count, inviter } = detail;
    const weAreInviter = isOurUuid(inviter);
    if (weAreInviter) {
      if (fromYou) {
        return renderString("GroupV2--pending-remove--revoke-invite-from-you--many--you", i18n, [count.toString()]);
      }
      if (from) {
        return renderString("GroupV2--pending-remove--revoke-invite-from-you--many--other", i18n, {
          adminName: renderContact(from),
          count: count.toString()
        });
      }
      return renderString("GroupV2--pending-remove--revoke-invite-from-you--many--unknown", i18n, [count.toString()]);
    }
    if (inviter) {
      if (fromYou) {
        return renderString("GroupV2--pending-remove--revoke-invite-from--many--you", i18n, {
          count: count.toString(),
          memberName: renderContact(inviter)
        });
      }
      if (from) {
        return renderString("GroupV2--pending-remove--revoke-invite-from--many--other", i18n, {
          adminName: renderContact(from),
          count: count.toString(),
          memberName: renderContact(inviter)
        });
      }
      return renderString("GroupV2--pending-remove--revoke-invite-from--many--unknown", i18n, {
        count: count.toString(),
        memberName: renderContact(inviter)
      });
    }
    if (fromYou) {
      return renderString("GroupV2--pending-remove--revoke--many--you", i18n, [
        count.toString()
      ]);
    }
    if (from) {
      return renderString("GroupV2--pending-remove--revoke--many--other", i18n, {
        memberName: renderContact(from),
        count: count.toString()
      });
    }
    return renderString("GroupV2--pending-remove--revoke--many--unknown", i18n, [count.toString()]);
  }
  if (detail.type === "admin-approval-add-one") {
    const { uuid } = detail;
    const weAreJoiner = isOurUuid(uuid);
    if (weAreJoiner) {
      return renderString("GroupV2--admin-approval-add-one--you", i18n);
    }
    return renderString("GroupV2--admin-approval-add-one--other", i18n, [
      renderContact(uuid)
    ]);
  }
  if (detail.type === "admin-approval-remove-one") {
    const { uuid } = detail;
    const weAreJoiner = isOurUuid(uuid);
    if (weAreJoiner) {
      if (fromYou) {
        return renderString("GroupV2--admin-approval-remove-one--you--you", i18n);
      }
      return renderString("GroupV2--admin-approval-remove-one--you--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--admin-approval-remove-one--other--you", i18n, [renderContact(uuid)]);
    }
    if (from && from === uuid) {
      return renderString("GroupV2--admin-approval-remove-one--other--own", i18n, [renderContact(uuid)]);
    }
    if (from) {
      return renderString("GroupV2--admin-approval-remove-one--other--other", i18n, {
        adminName: renderContact(from),
        joinerName: renderContact(uuid)
      });
    }
    return renderString("GroupV2--admin-approval-remove-one--other--own", i18n, [renderContact(uuid)]);
  }
  if (detail.type === "admin-approval-bounce") {
    const { uuid, times, isApprovalPending } = detail;
    let firstMessage;
    if (times === 1) {
      firstMessage = renderString("GroupV2--admin-approval-bounce--one", i18n, {
        joinerName: renderContact(uuid)
      });
    } else {
      firstMessage = renderString("GroupV2--admin-approval-bounce", i18n, {
        joinerName: renderContact(uuid),
        numberOfRequests: String(times)
      });
    }
    if (!isApprovalPending) {
      return firstMessage;
    }
    const secondMessage = renderChangeDetail({
      type: "admin-approval-add-one",
      uuid
    }, options);
    return [
      firstMessage,
      ...Array.isArray(secondMessage) ? secondMessage : [secondMessage]
    ];
  }
  if (detail.type === "group-link-add") {
    const { privilege } = detail;
    if (privilege === AccessControlEnum.ADMINISTRATOR) {
      if (fromYou) {
        return renderString("GroupV2--group-link-add--enabled--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--group-link-add--enabled--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--group-link-add--enabled--unknown", i18n);
    }
    if (privilege === AccessControlEnum.ANY) {
      if (fromYou) {
        return renderString("GroupV2--group-link-add--disabled--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--group-link-add--disabled--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--group-link-add--disabled--unknown", i18n);
    }
    log.warn(`group-link-add change type, privilege ${privilege} is unknown`);
    return "";
  }
  if (detail.type === "group-link-reset") {
    if (fromYou) {
      return renderString("GroupV2--group-link-reset--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--group-link-reset--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--group-link-reset--unknown", i18n);
  }
  if (detail.type === "group-link-remove") {
    if (fromYou) {
      return renderString("GroupV2--group-link-remove--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--group-link-remove--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--group-link-remove--unknown", i18n);
  }
  if (detail.type === "description") {
    if (detail.removed) {
      if (fromYou) {
        return renderString("GroupV2--description--remove--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--description--remove--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--description--remove--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--description--change--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--description--change--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--description--change--unknown", i18n);
  }
  if (detail.type === "announcements-only") {
    if (detail.announcementsOnly) {
      if (fromYou) {
        return renderString("GroupV2--announcements--admin--you", i18n);
      }
      if (from) {
        return renderString("GroupV2--announcements--admin--other", i18n, [
          renderContact(from)
        ]);
      }
      return renderString("GroupV2--announcements--admin--unknown", i18n);
    }
    if (fromYou) {
      return renderString("GroupV2--announcements--member--you", i18n);
    }
    if (from) {
      return renderString("GroupV2--announcements--member--other", i18n, [
        renderContact(from)
      ]);
    }
    return renderString("GroupV2--announcements--member--unknown", i18n);
  }
  throw (0, import_missingCaseError.missingCaseError)(detail);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  renderChange,
  renderChangeDetail
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ3JvdXBDaGFuZ2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IExvY2FsaXplclR5cGUgfSBmcm9tICcuL3R5cGVzL1V0aWwnO1xuaW1wb3J0IHR5cGUgeyBSZXBsYWNlbWVudFZhbHVlc1R5cGUgfSBmcm9tICcuL3R5cGVzL0kxOE4nO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuXG5pbXBvcnQgdHlwZSB7IEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlLCBHcm91cFYyQ2hhbmdlVHlwZSB9IGZyb20gJy4vZ3JvdXBzJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuL3Byb3RvYnVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuL2xvZ2dpbmcvbG9nJztcblxuZXhwb3J0IHR5cGUgU21hcnRDb250YWN0UmVuZGVyZXJUeXBlPFQ+ID0gKHV1aWQ6IFVVSURTdHJpbmdUeXBlKSA9PiBUIHwgc3RyaW5nO1xuZXhwb3J0IHR5cGUgU3RyaW5nUmVuZGVyZXJUeXBlPFQ+ID0gKFxuICBpZDogc3RyaW5nLFxuICBpMThuOiBMb2NhbGl6ZXJUeXBlLFxuICBjb21wb25lbnRzPzogQXJyYXk8VCB8IHN0cmluZz4gfCBSZXBsYWNlbWVudFZhbHVlc1R5cGU8VCB8IHN0cmluZz5cbikgPT4gVCB8IHN0cmluZztcblxuZXhwb3J0IHR5cGUgUmVuZGVyT3B0aW9uc1R5cGU8VD4gPSB7XG4gIGZyb20/OiBVVUlEU3RyaW5nVHlwZTtcbiAgaTE4bjogTG9jYWxpemVyVHlwZTtcbiAgb3VyQUNJPzogVVVJRFN0cmluZ1R5cGU7XG4gIG91clBOST86IFVVSURTdHJpbmdUeXBlO1xuICByZW5kZXJDb250YWN0OiBTbWFydENvbnRhY3RSZW5kZXJlclR5cGU8VD47XG4gIHJlbmRlclN0cmluZzogU3RyaW5nUmVuZGVyZXJUeXBlPFQ+O1xufTtcblxuY29uc3QgQWNjZXNzQ29udHJvbEVudW0gPSBQcm90by5BY2Nlc3NDb250cm9sLkFjY2Vzc1JlcXVpcmVkO1xuY29uc3QgUm9sZUVudW0gPSBQcm90by5NZW1iZXIuUm9sZTtcblxuZXhwb3J0IHR5cGUgUmVuZGVyQ2hhbmdlUmVzdWx0VHlwZTxUPiA9IFJlYWRvbmx5QXJyYXk8XG4gIFJlYWRvbmx5PHtcbiAgICBkZXRhaWw6IEdyb3VwVjJDaGFuZ2VEZXRhaWxUeXBlO1xuICAgIHRleHQ6IFQgfCBzdHJpbmc7XG5cbiAgICAvLyBVc2VkIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlbiB0aGUgbXVsdGlwbGUgdGV4dHMgcHJvZHVjZWQgYnlcbiAgICAvLyAnYWRtaW4tYXBwcm92YWwtYm91bmNlJ1xuICAgIGlzTGFzdFRleHQ6IGJvb2xlYW47XG4gIH0+XG4+O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hhbmdlPFQ+KFxuICBjaGFuZ2U6IEdyb3VwVjJDaGFuZ2VUeXBlLFxuICBvcHRpb25zOiBSZW5kZXJPcHRpb25zVHlwZTxUPlxuKTogUmVuZGVyQ2hhbmdlUmVzdWx0VHlwZTxUPiB7XG4gIGNvbnN0IHsgZGV0YWlscywgZnJvbSB9ID0gY2hhbmdlO1xuXG4gIHJldHVybiBkZXRhaWxzLmZsYXRNYXAoKGRldGFpbDogR3JvdXBWMkNoYW5nZURldGFpbFR5cGUpID0+IHtcbiAgICBjb25zdCB0ZXh0cyA9IHJlbmRlckNoYW5nZURldGFpbDxUPihkZXRhaWwsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBmcm9tLFxuICAgIH0pO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRleHRzKSkge1xuICAgICAgcmV0dXJuIHsgZGV0YWlsLCBpc0xhc3RUZXh0OiB0cnVlLCB0ZXh0OiB0ZXh0cyB9O1xuICAgIH1cblxuICAgIHJldHVybiB0ZXh0cy5tYXAoKHRleHQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc0xhc3RUZXh0ID0gaW5kZXggPT09IHRleHRzLmxlbmd0aCAtIDE7XG4gICAgICByZXR1cm4geyBkZXRhaWwsIGlzTGFzdFRleHQsIHRleHQgfTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJDaGFuZ2VEZXRhaWw8VD4oXG4gIGRldGFpbDogR3JvdXBWMkNoYW5nZURldGFpbFR5cGUsXG4gIG9wdGlvbnM6IFJlbmRlck9wdGlvbnNUeXBlPFQ+XG4pOiBUIHwgc3RyaW5nIHwgUmVhZG9ubHlBcnJheTxUIHwgc3RyaW5nPiB7XG4gIGNvbnN0IHsgZnJvbSwgaTE4biwgb3VyQUNJLCBvdXJQTkksIHJlbmRlckNvbnRhY3QsIHJlbmRlclN0cmluZyB9ID0gb3B0aW9ucztcblxuICBjb25zdCBpc091clV1aWQgPSAodXVpZD86IFVVSURTdHJpbmdUeXBlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCF1dWlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBCb29sZWFuKChvdXJBQ0kgJiYgdXVpZCA9PT0gb3VyQUNJKSB8fCAob3VyUE5JICYmIHV1aWQgPT09IG91clBOSSkpO1xuICB9O1xuICBjb25zdCBmcm9tWW91ID0gaXNPdXJVdWlkKGZyb20pO1xuXG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2NyZWF0ZScpIHtcbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tY3JlYXRlLS15b3UnLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb20pIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWNyZWF0ZS0tb3RoZXInLCBpMThuLCB7XG4gICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tY3JlYXRlLS11bmtub3duJywgaTE4bik7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAndGl0bGUnKSB7XG4gICAgY29uc3QgeyBuZXdUaXRsZSB9ID0gZGV0YWlsO1xuXG4gICAgaWYgKG5ld1RpdGxlKSB7XG4gICAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS10aXRsZS0tY2hhbmdlLS15b3UnLCBpMThuLCBbbmV3VGl0bGVdKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXRpdGxlLS1jaGFuZ2UtLW90aGVyJywgaTE4biwge1xuICAgICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgbmV3VGl0bGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tdGl0bGUtLWNoYW5nZS0tdW5rbm93bicsIGkxOG4sIFtuZXdUaXRsZV0pO1xuICAgIH1cbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tdGl0bGUtLXJlbW92ZS0teW91JywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS10aXRsZS0tcmVtb3ZlLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS10aXRsZS0tcmVtb3ZlLS11bmtub3duJywgaTE4bik7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnYXZhdGFyJykge1xuICAgIGlmIChkZXRhaWwucmVtb3ZlZCkge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYXZhdGFyLS1yZW1vdmUtLXlvdScsIGkxOG4pO1xuICAgICAgfVxuICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYXZhdGFyLS1yZW1vdmUtLW90aGVyJywgaTE4biwgW1xuICAgICAgICAgIHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYXZhdGFyLS1yZW1vdmUtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWF2YXRhci0tY2hhbmdlLS15b3UnLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb20pIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWF2YXRhci0tY2hhbmdlLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hdmF0YXItLWNoYW5nZS0tdW5rbm93bicsIGkxOG4pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2FjY2Vzcy1hdHRyaWJ1dGVzJykge1xuICAgIGNvbnN0IHsgbmV3UHJpdmlsZWdlIH0gPSBkZXRhaWw7XG5cbiAgICBpZiAobmV3UHJpdmlsZWdlID09PSBBY2Nlc3NDb250cm9sRW51bS5BRE1JTklTVFJBVE9SKSB7XG4gICAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hY2Nlc3MtYXR0cmlidXRlcy0tYWRtaW5zLS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFjY2Vzcy1hdHRyaWJ1dGVzLS1hZG1pbnMtLW90aGVyJywgaTE4biwgW1xuICAgICAgICAgIHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWNjZXNzLWF0dHJpYnV0ZXMtLWFkbWlucy0tdW5rbm93bicsIGkxOG4pO1xuICAgIH1cbiAgICBpZiAobmV3UHJpdmlsZWdlID09PSBBY2Nlc3NDb250cm9sRW51bS5NRU1CRVIpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFjY2Vzcy1hdHRyaWJ1dGVzLS1hbGwtLXlvdScsIGkxOG4pO1xuICAgICAgfVxuICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWNjZXNzLWF0dHJpYnV0ZXMtLWFsbC0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hY2Nlc3MtYXR0cmlidXRlcy0tYWxsLS11bmtub3duJywgaTE4bik7XG4gICAgfVxuICAgIGxvZy53YXJuKFxuICAgICAgYGFjY2Vzcy1hdHRyaWJ1dGVzIGNoYW5nZSB0eXBlLCBwcml2aWxlZ2UgJHtuZXdQcml2aWxlZ2V9IGlzIHVua25vd25gXG4gICAgKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnYWNjZXNzLW1lbWJlcnMnKSB7XG4gICAgY29uc3QgeyBuZXdQcml2aWxlZ2UgfSA9IGRldGFpbDtcblxuICAgIGlmIChuZXdQcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLkFETUlOSVNUUkFUT1IpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFjY2Vzcy1tZW1iZXJzLS1hZG1pbnMtLXlvdScsIGkxOG4pO1xuICAgICAgfVxuICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWNjZXNzLW1lbWJlcnMtLWFkbWlucy0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hY2Nlc3MtbWVtYmVycy0tYWRtaW5zLS11bmtub3duJywgaTE4bik7XG4gICAgfVxuICAgIGlmIChuZXdQcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLk1FTUJFUikge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWNjZXNzLW1lbWJlcnMtLWFsbC0teW91JywgaTE4bik7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hY2Nlc3MtbWVtYmVycy0tYWxsLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFjY2Vzcy1tZW1iZXJzLS1hbGwtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG4gICAgbG9nLndhcm4oXG4gICAgICBgYWNjZXNzLW1lbWJlcnMgY2hhbmdlIHR5cGUsIHByaXZpbGVnZSAke25ld1ByaXZpbGVnZX0gaXMgdW5rbm93bmBcbiAgICApO1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAoZGV0YWlsLnR5cGUgPT09ICdhY2Nlc3MtaW52aXRlLWxpbmsnKSB7XG4gICAgY29uc3QgeyBuZXdQcml2aWxlZ2UgfSA9IGRldGFpbDtcblxuICAgIGlmIChuZXdQcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLkFETUlOSVNUUkFUT1IpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFjY2Vzcy1pbnZpdGUtbGluay0tZW5hYmxlZC0teW91JywgaTE4bik7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1hY2Nlc3MtaW52aXRlLWxpbmstLWVuYWJsZWQtLW90aGVyJyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIFtyZW5kZXJDb250YWN0KGZyb20pXVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLWFjY2Vzcy1pbnZpdGUtbGluay0tZW5hYmxlZC0tdW5rbm93bicsXG4gICAgICAgIGkxOG5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChuZXdQcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLkFOWSkge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWNjZXNzLWludml0ZS1saW5rLS1kaXNhYmxlZC0teW91JywgaTE4bik7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1hY2Nlc3MtaW52aXRlLWxpbmstLWRpc2FibGVkLS1vdGhlcicsXG4gICAgICAgICAgaTE4bixcbiAgICAgICAgICBbcmVuZGVyQ29udGFjdChmcm9tKV1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICdHcm91cFYyLS1hY2Nlc3MtaW52aXRlLWxpbmstLWRpc2FibGVkLS11bmtub3duJyxcbiAgICAgICAgaTE4blxuICAgICAgKTtcbiAgICB9XG4gICAgbG9nLndhcm4oXG4gICAgICBgYWNjZXNzLWludml0ZS1saW5rIGNoYW5nZSB0eXBlLCBwcml2aWxlZ2UgJHtuZXdQcml2aWxlZ2V9IGlzIHVua25vd25gXG4gICAgKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnbWVtYmVyLWFkZCcpIHtcbiAgICBjb25zdCB7IHV1aWQgfSA9IGRldGFpbDtcbiAgICBjb25zdCB3ZUFyZUpvaW5lciA9IGlzT3VyVXVpZCh1dWlkKTtcblxuICAgIGlmICh3ZUFyZUpvaW5lcikge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC0teW91LS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLXlvdS0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItYWRkLS15b3UtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLW90aGVyLS15b3UnLCBpMThuLCBbXG4gICAgICAgIHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICBdKTtcbiAgICB9XG4gICAgaWYgKGZyb20pIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLW90aGVyLS1vdGhlcicsIGkxOG4sIHtcbiAgICAgICAgYWRkZXJOYW1lOiByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICBhZGRlZU5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC0tb3RoZXItLXVua25vd24nLCBpMThuLCBbXG4gICAgICByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgIF0pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ21lbWJlci1hZGQtZnJvbS1pbnZpdGUnKSB7XG4gICAgY29uc3QgeyB1dWlkLCBpbnZpdGVyIH0gPSBkZXRhaWw7XG4gICAgY29uc3Qgd2VBcmVKb2luZXIgPSBpc091clV1aWQodXVpZCk7XG4gICAgY29uc3Qgd2VBcmVJbnZpdGVyID0gaXNPdXJVdWlkKGludml0ZXIpO1xuICAgIGNvbnN0IHBuaVByb21vdGVkVG9BQ0kgPSB3ZUFyZUpvaW5lciAmJiBmcm9tID09PSBvdXJQTkk7XG5cbiAgICBpZiAoIWZyb20gfHwgKGZyb20gIT09IHV1aWQgJiYgIXBuaVByb21vdGVkVG9BQ0kpKSB7XG4gICAgICBpZiAod2VBcmVKb2luZXIpIHtcbiAgICAgICAgLy8gVGhleSBjYW4ndCBiZSB0aGUgc2FtZSwgbm8gZnJvbVlvdSBjaGVjayBoZXJlXG4gICAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC0teW91LS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgICAgIHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC0teW91LS11bmtub3duJywgaTE4bik7XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLWludml0ZWQtLXlvdScsIGkxOG4sIHtcbiAgICAgICAgICBpbnZpdGVlTmFtZTogcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItYWRkLS1pbnZpdGVkLS1vdGhlcicsIGkxOG4sIHtcbiAgICAgICAgICBtZW1iZXJOYW1lOiByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICAgIGludml0ZWVOYW1lOiByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLWludml0ZWQtLXVua25vd24nLCBpMThuLCB7XG4gICAgICAgIGludml0ZWVOYW1lOiByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHdlQXJlSm9pbmVyKSB7XG4gICAgICBpZiAoaW52aXRlcikge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItYWRkLS1mcm9tLWludml0ZS0teW91JywgaTE4biwgW1xuICAgICAgICAgIHJlbmRlckNvbnRhY3QoaW52aXRlciksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLW1lbWJlci1hZGQtLWZyb20taW52aXRlLS15b3Utbm8tZnJvbScsXG4gICAgICAgIGkxOG5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh3ZUFyZUludml0ZXIpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLWZyb20taW52aXRlLS1mcm9tLXlvdScsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBpZiAoaW52aXRlcikge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC0tZnJvbS1pbnZpdGUtLW90aGVyJywgaTE4biwge1xuICAgICAgICBpbnZpdGVlTmFtZTogcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgICAgaW52aXRlck5hbWU6IHJlbmRlckNvbnRhY3QoaW52aXRlciksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICdHcm91cFYyLS1tZW1iZXItYWRkLS1mcm9tLWludml0ZS0tb3RoZXItbm8tZnJvbScsXG4gICAgICBpMThuLFxuICAgICAge1xuICAgICAgICBpbnZpdGVlTmFtZTogcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ21lbWJlci1hZGQtZnJvbS1saW5rJykge1xuICAgIGNvbnN0IHsgdXVpZCB9ID0gZGV0YWlsO1xuXG4gICAgaWYgKGZyb21Zb3UgJiYgaXNPdXJVdWlkKHV1aWQpKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItYWRkLWZyb20tbGluay0teW91LS15b3UnLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb20gJiYgdXVpZCA9PT0gZnJvbSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLWFkZC1mcm9tLWxpbmstLW90aGVyJywgaTE4biwgW1xuICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCBiZWNhdXNlIHdlIG9ubHkgY2FwdHVyZSAnYWRkLWZyb20tbGluaycgc3RhdHVzXG4gICAgLy8gICBmcm9tIGdyb3VwIGNoYW5nZSBldmVudHMsIHdoaWNoIGFsd2F5cyBoYXZlIGEgc2VuZGVyLlxuICAgIGxvZy53YXJuKCdtZW1iZXItYWRkLWZyb20tbGluayBjaGFuZ2UgdHlwZTsgd2UgaGF2ZSBubyBmcm9tIScpO1xuICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1hZGQtLW90aGVyLS11bmtub3duJywgaTE4biwgW1xuICAgICAgcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICBdKTtcbiAgfVxuICBpZiAoZGV0YWlsLnR5cGUgPT09ICdtZW1iZXItYWRkLWZyb20tYWRtaW4tYXBwcm92YWwnKSB7XG4gICAgY29uc3QgeyB1dWlkIH0gPSBkZXRhaWw7XG4gICAgY29uc3Qgd2VBcmVKb2luZXIgPSBpc091clV1aWQodXVpZCk7XG5cbiAgICBpZiAod2VBcmVKb2luZXIpIHtcbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICAgJ0dyb3VwVjItLW1lbWJlci1hZGQtZnJvbS1hZG1pbi1hcHByb3ZhbC0teW91LS1vdGhlcicsXG4gICAgICAgICAgaTE4bixcbiAgICAgICAgICBbcmVuZGVyQ29udGFjdChmcm9tKV1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90ZTogdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCBiZWNhdXNlIHdlIG9ubHkgY2FwdHVyZSAnYWRkLWZyb20tYWRtaW4tYXBwcm92YWwnXG4gICAgICAvLyAgIHN0YXR1cyBmcm9tIGdyb3VwIGNoYW5nZSBldmVudHMsIHdoaWNoIGFsd2F5cyBoYXZlIGEgc2VuZGVyLlxuICAgICAgbG9nLndhcm4oXG4gICAgICAgICdtZW1iZXItYWRkLWZyb20tYWRtaW4tYXBwcm92YWwgY2hhbmdlIHR5cGU7IHdlIGhhdmUgbm8gZnJvbSwgYW5kIHdlIGFyZSBqb2luZXIhJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICdHcm91cFYyLS1tZW1iZXItYWRkLWZyb20tYWRtaW4tYXBwcm92YWwtLXlvdS0tdW5rbm93bicsXG4gICAgICAgIGkxOG5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICdHcm91cFYyLS1tZW1iZXItYWRkLWZyb20tYWRtaW4tYXBwcm92YWwtLW90aGVyLS15b3UnLFxuICAgICAgICBpMThuLFxuICAgICAgICBbcmVuZGVyQ29udGFjdCh1dWlkKV1cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAnR3JvdXBWMi0tbWVtYmVyLWFkZC1mcm9tLWFkbWluLWFwcHJvdmFsLS1vdGhlci0tb3RoZXInLFxuICAgICAgICBpMThuLFxuICAgICAgICB7XG4gICAgICAgICAgYWRtaW5OYW1lOiByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICAgIGpvaW5lck5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCBiZWNhdXNlIHdlIG9ubHkgY2FwdHVyZSAnYWRkLWZyb20tYWRtaW4tYXBwcm92YWwnXG4gICAgLy8gICBzdGF0dXMgZnJvbSBncm91cCBjaGFuZ2UgZXZlbnRzLCB3aGljaCBhbHdheXMgaGF2ZSBhIHNlbmRlci5cbiAgICBsb2cud2FybignbWVtYmVyLWFkZC1mcm9tLWFkbWluLWFwcHJvdmFsIGNoYW5nZSB0eXBlOyB3ZSBoYXZlIG5vIGZyb20nKTtcbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgJ0dyb3VwVjItLW1lbWJlci1hZGQtZnJvbS1hZG1pbi1hcHByb3ZhbC0tb3RoZXItLXVua25vd24nLFxuICAgICAgaTE4bixcbiAgICAgIFtyZW5kZXJDb250YWN0KHV1aWQpXVxuICAgICk7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnbWVtYmVyLXJlbW92ZScpIHtcbiAgICBjb25zdCB7IHV1aWQgfSA9IGRldGFpbDtcbiAgICBjb25zdCB3ZUFyZUxlYXZlciA9IGlzT3VyVXVpZCh1dWlkKTtcblxuICAgIGlmICh3ZUFyZUxlYXZlcikge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLXJlbW92ZS0teW91LS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLW1lbWJlci1yZW1vdmUtLXlvdS0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItcmVtb3ZlLS15b3UtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLXJlbW92ZS0tb3RoZXItLXlvdScsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBpZiAoZnJvbSAmJiBmcm9tID09PSB1dWlkKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1tZW1iZXItcmVtb3ZlLS1vdGhlci0tc2VsZicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBpZiAoZnJvbSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLXJlbW92ZS0tb3RoZXItLW90aGVyJywgaTE4biwge1xuICAgICAgICBhZG1pbk5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tbWVtYmVyLXJlbW92ZS0tb3RoZXItLXVua25vd24nLCBpMThuLCBbXG4gICAgICByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgIF0pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ21lbWJlci1wcml2aWxlZ2UnKSB7XG4gICAgY29uc3QgeyB1dWlkLCBuZXdQcml2aWxlZ2UgfSA9IGRldGFpbDtcbiAgICBjb25zdCB3ZUFyZU1lbWJlciA9IGlzT3VyVXVpZCh1dWlkKTtcblxuICAgIGlmIChuZXdQcml2aWxlZ2UgPT09IFJvbGVFbnVtLkFETUlOSVNUUkFUT1IpIHtcbiAgICAgIGlmICh3ZUFyZU1lbWJlcikge1xuICAgICAgICBpZiAoZnJvbSkge1xuICAgICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICAgICAnR3JvdXBWMi0tbWVtYmVyLXByaXZpbGVnZS0tcHJvbW90ZS0teW91LS1vdGhlcicsXG4gICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgW3JlbmRlckNvbnRhY3QoZnJvbSldXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICAgJ0dyb3VwVjItLW1lbWJlci1wcml2aWxlZ2UtLXByb21vdGUtLXlvdS0tdW5rbm93bicsXG4gICAgICAgICAgaTE4blxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1tZW1iZXItcHJpdmlsZWdlLS1wcm9tb3RlLS1vdGhlci0teW91JyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIFtyZW5kZXJDb250YWN0KHV1aWQpXVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgICAnR3JvdXBWMi0tbWVtYmVyLXByaXZpbGVnZS0tcHJvbW90ZS0tb3RoZXItLW90aGVyJyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFkbWluTmFtZTogcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLW1lbWJlci1wcml2aWxlZ2UtLXByb21vdGUtLW90aGVyLS11bmtub3duJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAgW3JlbmRlckNvbnRhY3QodXVpZCldXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAobmV3UHJpdmlsZWdlID09PSBSb2xlRW51bS5ERUZBVUxUKSB7XG4gICAgICBpZiAod2VBcmVNZW1iZXIpIHtcbiAgICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICAgJ0dyb3VwVjItLW1lbWJlci1wcml2aWxlZ2UtLWRlbW90ZS0teW91LS1vdGhlcicsXG4gICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgW3JlbmRlckNvbnRhY3QoZnJvbSldXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1tZW1iZXItcHJpdmlsZWdlLS1kZW1vdGUtLXlvdS0tdW5rbm93bicsXG4gICAgICAgICAgaTE4blxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1tZW1iZXItcHJpdmlsZWdlLS1kZW1vdGUtLW90aGVyLS15b3UnLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgW3JlbmRlckNvbnRhY3QodXVpZCldXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1tZW1iZXItcHJpdmlsZWdlLS1kZW1vdGUtLW90aGVyLS1vdGhlcicsXG4gICAgICAgICAgaTE4bixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhZG1pbk5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgICBtZW1iZXJOYW1lOiByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICdHcm91cFYyLS1tZW1iZXItcHJpdmlsZWdlLS1kZW1vdGUtLW90aGVyLS11bmtub3duJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAgW3JlbmRlckNvbnRhY3QodXVpZCldXG4gICAgICApO1xuICAgIH1cbiAgICBsb2cud2FybihcbiAgICAgIGBtZW1iZXItcHJpdmlsZWdlIGNoYW5nZSB0eXBlLCBwcml2aWxlZ2UgJHtuZXdQcml2aWxlZ2V9IGlzIHVua25vd25gXG4gICAgKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAncGVuZGluZy1hZGQtb25lJykge1xuICAgIGNvbnN0IHsgdXVpZCB9ID0gZGV0YWlsO1xuICAgIGNvbnN0IHdlQXJlSW52aXRlZCA9IGlzT3VyVXVpZCh1dWlkKTtcbiAgICBpZiAod2VBcmVJbnZpdGVkKSB7XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLWFkZC0tb25lLS15b3UtLW90aGVyJywgaTE4biwgW1xuICAgICAgICAgIHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tcGVuZGluZy1hZGQtLW9uZS0teW91LS11bmtub3duJywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tWW91KSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLWFkZC0tb25lLS1vdGhlci0teW91JywgaTE4biwgW1xuICAgICAgICByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLWFkZC0tb25lLS1vdGhlci0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgIHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tcGVuZGluZy1hZGQtLW9uZS0tb3RoZXItLXVua25vd24nLCBpMThuKTtcbiAgfVxuICBpZiAoZGV0YWlsLnR5cGUgPT09ICdwZW5kaW5nLWFkZC1tYW55Jykge1xuICAgIGNvbnN0IHsgY291bnQgfSA9IGRldGFpbDtcblxuICAgIGlmIChmcm9tWW91KSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLWFkZC0tbWFueS0teW91JywgaTE4biwgW1xuICAgICAgICBjb3VudC50b1N0cmluZygpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLWFkZC0tbWFueS0tb3RoZXInLCBpMThuLCB7XG4gICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgIGNvdW50OiBjb3VudC50b1N0cmluZygpLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctYWRkLS1tYW55LS11bmtub3duJywgaTE4biwgW1xuICAgICAgY291bnQudG9TdHJpbmcoKSxcbiAgICBdKTtcbiAgfVxuICBpZiAoZGV0YWlsLnR5cGUgPT09ICdwZW5kaW5nLXJlbW92ZS1vbmUnKSB7XG4gICAgY29uc3QgeyBpbnZpdGVyLCB1dWlkIH0gPSBkZXRhaWw7XG4gICAgY29uc3Qgd2VBcmVJbnZpdGVyID0gaXNPdXJVdWlkKGludml0ZXIpO1xuICAgIGNvbnN0IHdlQXJlSW52aXRlZCA9IGlzT3VyVXVpZCh1dWlkKTtcbiAgICBjb25zdCBzZW50QnlJbnZpdGVkID0gQm9vbGVhbihmcm9tICYmIGZyb20gPT09IHV1aWQpO1xuICAgIGNvbnN0IHNlbnRCeUludml0ZXIgPSBCb29sZWFuKGZyb20gJiYgaW52aXRlciAmJiBmcm9tID09PSBpbnZpdGVyKTtcblxuICAgIGlmICh3ZUFyZUludml0ZXIpIHtcbiAgICAgIGlmIChzZW50QnlJbnZpdGVkKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1kZWNsaW5lLS15b3UnLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLWludml0ZS1mcm9tLXlvdS0tb25lLS15b3UnLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgW3JlbmRlckNvbnRhY3QodXVpZCldXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLWludml0ZS1mcm9tLXlvdS0tb25lLS1vdGhlcicsXG4gICAgICAgICAgaTE4bixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhZG1pbk5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgICBpbnZpdGVlTmFtZTogcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLXJldm9rZS1pbnZpdGUtZnJvbS15b3UtLW9uZS0tdW5rbm93bicsXG4gICAgICAgIGkxOG4sXG4gICAgICAgIFtyZW5kZXJDb250YWN0KHV1aWQpXVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHNlbnRCeUludml0ZWQpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1kZWNsaW5lLS1mcm9tLXlvdScsIGkxOG4pO1xuICAgICAgfVxuICAgICAgaWYgKGludml0ZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLWRlY2xpbmUtLW90aGVyJywgaTE4biwgW1xuICAgICAgICAgIHJlbmRlckNvbnRhY3QoaW52aXRlciksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLWRlY2xpbmUtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGludml0ZXIgJiYgc2VudEJ5SW52aXRlcikge1xuICAgICAgaWYgKHdlQXJlSW52aXRlZCkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLW93bi0tdG8teW91JyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIFtyZW5kZXJDb250YWN0KGludml0ZXIpXVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2Utb3duLS11bmtub3duJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAgW3JlbmRlckNvbnRhY3QoaW52aXRlcildXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoaW52aXRlcikge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgICAnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLXJldm9rZS1pbnZpdGUtZnJvbS0tb25lLS15b3UnLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgW3JlbmRlckNvbnRhY3QoaW52aXRlcildXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLWludml0ZS1mcm9tLS1vbmUtLW90aGVyJyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFkbWluTmFtZTogcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoaW52aXRlciksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtaW52aXRlLWZyb20tLW9uZS0tdW5rbm93bicsXG4gICAgICAgIGkxOG4sXG4gICAgICAgIFtyZW5kZXJDb250YWN0KGludml0ZXIpXVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtLW9uZS0teW91JywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLS1vbmUtLW90aGVyJywgaTE4biwgW1xuICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgXSk7XG4gICAgfVxuICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtLW9uZS0tdW5rbm93bicsIGkxOG4pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ3BlbmRpbmctcmVtb3ZlLW1hbnknKSB7XG4gICAgY29uc3QgeyBjb3VudCwgaW52aXRlciB9ID0gZGV0YWlsO1xuICAgIGNvbnN0IHdlQXJlSW52aXRlciA9IGlzT3VyVXVpZChpbnZpdGVyKTtcblxuICAgIGlmICh3ZUFyZUludml0ZXIpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtaW52aXRlLWZyb20teW91LS1tYW55LS15b3UnLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgW2NvdW50LnRvU3RyaW5nKCldXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLWludml0ZS1mcm9tLXlvdS0tbWFueS0tb3RoZXInLFxuICAgICAgICAgIGkxOG4sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWRtaW5OYW1lOiByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICAgICAgY291bnQ6IGNvdW50LnRvU3RyaW5nKCksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtaW52aXRlLWZyb20teW91LS1tYW55LS11bmtub3duJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAgW2NvdW50LnRvU3RyaW5nKCldXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoaW52aXRlcikge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgICAnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLXJldm9rZS1pbnZpdGUtZnJvbS0tbWFueS0teW91JyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvdW50OiBjb3VudC50b1N0cmluZygpLFxuICAgICAgICAgICAgbWVtYmVyTmFtZTogcmVuZGVyQ29udGFjdChpbnZpdGVyKSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAgICdHcm91cFYyLS1wZW5kaW5nLXJlbW92ZS0tcmV2b2tlLWludml0ZS1mcm9tLS1tYW55LS1vdGhlcicsXG4gICAgICAgICAgaTE4bixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhZG1pbk5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgICBjb3VudDogY291bnQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoaW52aXRlciksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtaW52aXRlLWZyb20tLW1hbnktLXVua25vd24nLFxuICAgICAgICBpMThuLFxuICAgICAgICB7XG4gICAgICAgICAgY291bnQ6IGNvdW50LnRvU3RyaW5nKCksXG4gICAgICAgICAgbWVtYmVyTmFtZTogcmVuZGVyQ29udGFjdChpbnZpdGVyKSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtLW1hbnktLXlvdScsIGkxOG4sIFtcbiAgICAgICAgY291bnQudG9TdHJpbmcoKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBpZiAoZnJvbSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLXBlbmRpbmctcmVtb3ZlLS1yZXZva2UtLW1hbnktLW90aGVyJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAge1xuICAgICAgICAgIG1lbWJlck5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgY291bnQ6IGNvdW50LnRvU3RyaW5nKCksXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAnR3JvdXBWMi0tcGVuZGluZy1yZW1vdmUtLXJldm9rZS0tbWFueS0tdW5rbm93bicsXG4gICAgICBpMThuLFxuICAgICAgW2NvdW50LnRvU3RyaW5nKCldXG4gICAgKTtcbiAgfVxuICBpZiAoZGV0YWlsLnR5cGUgPT09ICdhZG1pbi1hcHByb3ZhbC1hZGQtb25lJykge1xuICAgIGNvbnN0IHsgdXVpZCB9ID0gZGV0YWlsO1xuICAgIGNvbnN0IHdlQXJlSm9pbmVyID0gaXNPdXJVdWlkKHV1aWQpO1xuXG4gICAgaWYgKHdlQXJlSm9pbmVyKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hZG1pbi1hcHByb3ZhbC1hZGQtb25lLS15b3UnLCBpMThuKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWRtaW4tYXBwcm92YWwtYWRkLW9uZS0tb3RoZXInLCBpMThuLCBbXG4gICAgICByZW5kZXJDb250YWN0KHV1aWQpLFxuICAgIF0pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLXJlbW92ZS1vbmUnKSB7XG4gICAgY29uc3QgeyB1dWlkIH0gPSBkZXRhaWw7XG4gICAgY29uc3Qgd2VBcmVKb2luZXIgPSBpc091clV1aWQodXVpZCk7XG5cbiAgICBpZiAod2VBcmVKb2luZXIpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICAgJ0dyb3VwVjItLWFkbWluLWFwcHJvdmFsLXJlbW92ZS1vbmUtLXlvdS0teW91JyxcbiAgICAgICAgICBpMThuXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKFxuICAgICAgICAnR3JvdXBWMi0tYWRtaW4tYXBwcm92YWwtcmVtb3ZlLW9uZS0teW91LS11bmtub3duJyxcbiAgICAgICAgaTE4blxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLWFkbWluLWFwcHJvdmFsLXJlbW92ZS1vbmUtLW90aGVyLS15b3UnLFxuICAgICAgICBpMThuLFxuICAgICAgICBbcmVuZGVyQ29udGFjdCh1dWlkKV1cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChmcm9tICYmIGZyb20gPT09IHV1aWQpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoXG4gICAgICAgICdHcm91cFYyLS1hZG1pbi1hcHByb3ZhbC1yZW1vdmUtb25lLS1vdGhlci0tb3duJyxcbiAgICAgICAgaTE4bixcbiAgICAgICAgW3JlbmRlckNvbnRhY3QodXVpZCldXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoZnJvbSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICAgJ0dyb3VwVjItLWFkbWluLWFwcHJvdmFsLXJlbW92ZS1vbmUtLW90aGVyLS1vdGhlcicsXG4gICAgICAgIGkxOG4sXG4gICAgICAgIHtcbiAgICAgICAgICBhZG1pbk5hbWU6IHJlbmRlckNvbnRhY3QoZnJvbSksXG4gICAgICAgICAgam9pbmVyTmFtZTogcmVuZGVyQ29udGFjdCh1dWlkKSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBXZSBkZWZhdWx0IHRvIHRoZSB1c2VyIGNhbmNlbGluZyB0aGVpciByZXF1ZXN0LCBiZWNhdXNlIGl0IGlzIGZhciBtb3JlIGxpa2VseSB0aGF0XG4gICAgLy8gICBpZiBhbiBhZG1pbiBkb2VzIHRoZSBkZW5pYWwsIHdlJ2xsIGdldCBhIGNoYW5nZSBldmVudCBmcm9tIHRoZW0uXG4gICAgcmV0dXJuIHJlbmRlclN0cmluZyhcbiAgICAgICdHcm91cFYyLS1hZG1pbi1hcHByb3ZhbC1yZW1vdmUtb25lLS1vdGhlci0tb3duJyxcbiAgICAgIGkxOG4sXG4gICAgICBbcmVuZGVyQ29udGFjdCh1dWlkKV1cbiAgICApO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2FkbWluLWFwcHJvdmFsLWJvdW5jZScpIHtcbiAgICBjb25zdCB7IHV1aWQsIHRpbWVzLCBpc0FwcHJvdmFsUGVuZGluZyB9ID0gZGV0YWlsO1xuXG4gICAgbGV0IGZpcnN0TWVzc2FnZTogVCB8IHN0cmluZztcbiAgICBpZiAodGltZXMgPT09IDEpIHtcbiAgICAgIGZpcnN0TWVzc2FnZSA9IHJlbmRlclN0cmluZygnR3JvdXBWMi0tYWRtaW4tYXBwcm92YWwtYm91bmNlLS1vbmUnLCBpMThuLCB7XG4gICAgICAgIGpvaW5lck5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyc3RNZXNzYWdlID0gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hZG1pbi1hcHByb3ZhbC1ib3VuY2UnLCBpMThuLCB7XG4gICAgICAgIGpvaW5lck5hbWU6IHJlbmRlckNvbnRhY3QodXVpZCksXG4gICAgICAgIG51bWJlck9mUmVxdWVzdHM6IFN0cmluZyh0aW1lcyksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWlzQXBwcm92YWxQZW5kaW5nKSB7XG4gICAgICByZXR1cm4gZmlyc3RNZXNzYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IHNlY29uZE1lc3NhZ2UgPSByZW5kZXJDaGFuZ2VEZXRhaWwoXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdhZG1pbi1hcHByb3ZhbC1hZGQtb25lJyxcbiAgICAgICAgdXVpZCxcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcblxuICAgIHJldHVybiBbXG4gICAgICBmaXJzdE1lc3NhZ2UsXG4gICAgICAuLi4oQXJyYXkuaXNBcnJheShzZWNvbmRNZXNzYWdlKSA/IHNlY29uZE1lc3NhZ2UgOiBbc2Vjb25kTWVzc2FnZV0pLFxuICAgIF07XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnZ3JvdXAtbGluay1hZGQnKSB7XG4gICAgY29uc3QgeyBwcml2aWxlZ2UgfSA9IGRldGFpbDtcblxuICAgIGlmIChwcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLkFETUlOSVNUUkFUT1IpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstYWRkLS1lbmFibGVkLS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstYWRkLS1lbmFibGVkLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstYWRkLS1lbmFibGVkLS11bmtub3duJywgaTE4bik7XG4gICAgfVxuICAgIGlmIChwcml2aWxlZ2UgPT09IEFjY2Vzc0NvbnRyb2xFbnVtLkFOWSkge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tZ3JvdXAtbGluay1hZGQtLWRpc2FibGVkLS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstYWRkLS1kaXNhYmxlZC0tb3RoZXInLCBpMThuLCBbXG4gICAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1ncm91cC1saW5rLWFkZC0tZGlzYWJsZWQtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG4gICAgbG9nLndhcm4oYGdyb3VwLWxpbmstYWRkIGNoYW5nZSB0eXBlLCBwcml2aWxlZ2UgJHtwcml2aWxlZ2V9IGlzIHVua25vd25gKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnZ3JvdXAtbGluay1yZXNldCcpIHtcbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tZ3JvdXAtbGluay1yZXNldC0teW91JywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1ncm91cC1saW5rLXJlc2V0LS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1ncm91cC1saW5rLXJlc2V0LS11bmtub3duJywgaTE4bik7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnZ3JvdXAtbGluay1yZW1vdmUnKSB7XG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstcmVtb3ZlLS15b3UnLCBpMThuKTtcbiAgICB9XG4gICAgaWYgKGZyb20pIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWdyb3VwLWxpbmstcmVtb3ZlLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1ncm91cC1saW5rLXJlbW92ZS0tdW5rbm93bicsIGkxOG4pO1xuICB9XG4gIGlmIChkZXRhaWwudHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJykge1xuICAgIGlmIChkZXRhaWwucmVtb3ZlZCkge1xuICAgICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tZGVzY3JpcHRpb24tLXJlbW92ZS0teW91JywgaTE4bik7XG4gICAgICB9XG4gICAgICBpZiAoZnJvbSkge1xuICAgICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1kZXNjcmlwdGlvbi0tcmVtb3ZlLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWRlc2NyaXB0aW9uLS1yZW1vdmUtLXVua25vd24nLCBpMThuKTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbVlvdSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0cmluZygnR3JvdXBWMi0tZGVzY3JpcHRpb24tLWNoYW5nZS0teW91JywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1kZXNjcmlwdGlvbi0tY2hhbmdlLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgcmVuZGVyQ29udGFjdChmcm9tKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1kZXNjcmlwdGlvbi0tY2hhbmdlLS11bmtub3duJywgaTE4bik7XG4gIH1cbiAgaWYgKGRldGFpbC50eXBlID09PSAnYW5ub3VuY2VtZW50cy1vbmx5Jykge1xuICAgIGlmIChkZXRhaWwuYW5ub3VuY2VtZW50c09ubHkpIHtcbiAgICAgIGlmIChmcm9tWW91KSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFubm91bmNlbWVudHMtLWFkbWluLS15b3UnLCBpMThuKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFubm91bmNlbWVudHMtLWFkbWluLS1vdGhlcicsIGkxOG4sIFtcbiAgICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFubm91bmNlbWVudHMtLWFkbWluLS11bmtub3duJywgaTE4bik7XG4gICAgfVxuXG4gICAgaWYgKGZyb21Zb3UpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFubm91bmNlbWVudHMtLW1lbWJlci0teW91JywgaTE4bik7XG4gICAgfVxuICAgIGlmIChmcm9tKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RyaW5nKCdHcm91cFYyLS1hbm5vdW5jZW1lbnRzLS1tZW1iZXItLW90aGVyJywgaTE4biwgW1xuICAgICAgICByZW5kZXJDb250YWN0KGZyb20pLFxuICAgICAgXSk7XG4gICAgfVxuICAgIHJldHVybiByZW5kZXJTdHJpbmcoJ0dyb3VwVjItLWFubm91bmNlbWVudHMtLW1lbWJlci0tdW5rbm93bicsIGkxOG4pO1xuICB9XG5cbiAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihkZXRhaWwpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7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
