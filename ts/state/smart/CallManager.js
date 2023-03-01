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
var CallManager_exports = {};
__export(CallManager_exports, {
  SmartCallManager: () => SmartCallManager
});
module.exports = __toCommonJS(CallManager_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_lodash = require("lodash");
var import_actions = require("../actions");
var import_CallManager = require("../../components/CallManager");
var import_calling = require("../../services/calling");
var import_user = require("../selectors/user");
var import_conversations = require("../selectors/conversations");
var import_calling2 = require("../ducks/calling");
var import_calling3 = require("../selectors/calling");
var import_isGroupCallOutboundRingEnabled = require("../../util/isGroupCallOutboundRingEnabled");
var import_Calling = require("../../types/Calling");
var import_missingCaseError = require("../../util/missingCaseError");
var import_CallingDeviceSelection = require("./CallingDeviceSelection");
var import_SafetyNumberViewer = require("./SafetyNumberViewer");
var import_callingTones = require("../../util/callingTones");
var import_bounceAppIcon = require("../../shims/bounceAppIcon");
var import_notifications = require("../../services/notifications");
var log = __toESM(require("../../logging/log"));
var import_badges = require("../selectors/badges");
function renderDeviceSelection() {
  return /* @__PURE__ */ import_react.default.createElement(import_CallingDeviceSelection.SmartCallingDeviceSelection, null);
}
function renderSafetyNumberViewer(props) {
  return /* @__PURE__ */ import_react.default.createElement(import_SafetyNumberViewer.SmartSafetyNumberViewer, {
    ...props
  });
}
const getGroupCallVideoFrameSource = import_calling.calling.getGroupCallVideoFrameSource.bind(import_calling.calling);
async function notifyForCall(title, isVideoCall) {
  const shouldNotify = !window.SignalContext.activeWindowService.isActive() && window.Events.getCallSystemNotification();
  if (!shouldNotify) {
    return;
  }
  let notificationTitle;
  const notificationSetting = import_notifications.notificationService.getNotificationSetting();
  switch (notificationSetting) {
    case import_notifications.NotificationSetting.Off:
    case import_notifications.NotificationSetting.NoNameOrMessage:
      notificationTitle = import_notifications.FALLBACK_NOTIFICATION_TITLE;
      break;
    case import_notifications.NotificationSetting.NameOnly:
    case import_notifications.NotificationSetting.NameAndMessage:
      notificationTitle = title;
      break;
    default:
      log.error((0, import_missingCaseError.missingCaseError)(notificationSetting));
      notificationTitle = import_notifications.FALLBACK_NOTIFICATION_TITLE;
      break;
  }
  import_notifications.notificationService.notify({
    title: notificationTitle,
    icon: isVideoCall ? "images/icons/v2/video-solid-24.svg" : "images/icons/v2/phone-right-solid-24.svg",
    message: window.i18n(isVideoCall ? "incomingVideoCall" : "incomingAudioCall"),
    onNotificationClick: () => {
      window.showWindow();
    },
    silent: false
  });
}
const playRingtone = import_callingTones.callingTones.playRingtone.bind(import_callingTones.callingTones);
const stopRingtone = import_callingTones.callingTones.stopRingtone.bind(import_callingTones.callingTones);
const mapStateToActiveCallProp = /* @__PURE__ */ __name((state) => {
  const { calling } = state;
  const { activeCallState } = calling;
  if (!activeCallState) {
    return void 0;
  }
  const call = (0, import_calling2.getActiveCall)(calling);
  if (!call) {
    log.error("There was an active call state but no corresponding call");
    return void 0;
  }
  const conversationSelector = (0, import_conversations.getConversationSelector)(state);
  const conversation = conversationSelector(activeCallState.conversationId);
  if (!conversation) {
    log.error("The active call has no corresponding conversation");
    return void 0;
  }
  const conversationSelectorByUuid = (0, import_lodash.memoize)((uuid) => {
    const convoForUuid = window.ConversationController.lookupOrCreate({
      uuid
    });
    return convoForUuid ? conversationSelector(convoForUuid.id) : void 0;
  });
  const baseResult = {
    conversation,
    hasLocalAudio: activeCallState.hasLocalAudio,
    hasLocalVideo: activeCallState.hasLocalVideo,
    localAudioLevel: activeCallState.localAudioLevel,
    viewMode: activeCallState.viewMode,
    joinedAt: activeCallState.joinedAt,
    outgoingRing: activeCallState.outgoingRing,
    pip: activeCallState.pip,
    presentingSource: activeCallState.presentingSource,
    presentingSourcesAvailable: activeCallState.presentingSourcesAvailable,
    settingsDialogOpen: activeCallState.settingsDialogOpen,
    showNeedsScreenRecordingPermissionsWarning: Boolean(activeCallState.showNeedsScreenRecordingPermissionsWarning),
    showParticipantsList: activeCallState.showParticipantsList
  };
  switch (call.callMode) {
    case import_Calling.CallMode.Direct:
      if (call.isIncoming && (call.callState === import_Calling.CallState.Prering || call.callState === import_Calling.CallState.Ringing)) {
        return;
      }
      return {
        ...baseResult,
        callEndedReason: call.callEndedReason,
        callMode: import_Calling.CallMode.Direct,
        callState: call.callState,
        peekedParticipants: [],
        remoteParticipants: [
          {
            hasRemoteVideo: Boolean(call.hasRemoteVideo),
            presenting: Boolean(call.isSharingScreen),
            title: conversation.title,
            uuid: conversation.uuid
          }
        ]
      };
    case import_Calling.CallMode.Group: {
      const conversationsWithSafetyNumberChanges = [];
      const groupMembers = [];
      const remoteParticipants = [];
      const peekedParticipants = [];
      const { memberships = [] } = conversation;
      const {
        peekInfo = {
          deviceCount: 0,
          maxDevices: Infinity,
          uuids: []
        }
      } = call;
      for (let i = 0; i < memberships.length; i += 1) {
        const { uuid } = memberships[i];
        const member = conversationSelector(uuid);
        if (!member) {
          log.error("Group member has no corresponding conversation");
          continue;
        }
        groupMembers.push(member);
      }
      for (let i = 0; i < call.remoteParticipants.length; i += 1) {
        const remoteParticipant = call.remoteParticipants[i];
        const remoteConversation = conversationSelectorByUuid(remoteParticipant.uuid);
        if (!remoteConversation) {
          log.error("Remote participant has no corresponding conversation");
          continue;
        }
        remoteParticipants.push({
          ...remoteConversation,
          demuxId: remoteParticipant.demuxId,
          hasRemoteAudio: remoteParticipant.hasRemoteAudio,
          hasRemoteVideo: remoteParticipant.hasRemoteVideo,
          presenting: remoteParticipant.presenting,
          sharingScreen: remoteParticipant.sharingScreen,
          speakerTime: remoteParticipant.speakerTime,
          videoAspectRatio: remoteParticipant.videoAspectRatio
        });
      }
      for (let i = 0; i < activeCallState.safetyNumberChangedUuids.length; i += 1) {
        const uuid = activeCallState.safetyNumberChangedUuids[i];
        const remoteConversation = conversationSelectorByUuid(uuid);
        if (!remoteConversation) {
          log.error("Remote participant has no corresponding conversation");
          continue;
        }
        conversationsWithSafetyNumberChanges.push(remoteConversation);
      }
      for (let i = 0; i < peekInfo.uuids.length; i += 1) {
        const peekedParticipantUuid = peekInfo.uuids[i];
        const peekedConversation = conversationSelectorByUuid(peekedParticipantUuid);
        if (!peekedConversation) {
          log.error("Remote participant has no corresponding conversation");
          continue;
        }
        peekedParticipants.push(peekedConversation);
      }
      return {
        ...baseResult,
        callMode: import_Calling.CallMode.Group,
        connectionState: call.connectionState,
        conversationsWithSafetyNumberChanges,
        deviceCount: peekInfo.deviceCount,
        groupMembers,
        joinState: call.joinState,
        maxDevices: peekInfo.maxDevices,
        peekedParticipants,
        remoteParticipants,
        remoteAudioLevels: call.remoteAudioLevels || /* @__PURE__ */ new Map()
      };
    }
    default:
      throw (0, import_missingCaseError.missingCaseError)(call);
  }
}, "mapStateToActiveCallProp");
const mapStateToIncomingCallProp = /* @__PURE__ */ __name((state) => {
  const call = (0, import_calling3.getIncomingCall)(state);
  if (!call) {
    return void 0;
  }
  const conversation = (0, import_conversations.getConversationSelector)(state)(call.conversationId);
  if (!conversation) {
    log.error("The incoming call has no corresponding conversation");
    return void 0;
  }
  switch (call.callMode) {
    case import_Calling.CallMode.Direct:
      return {
        callMode: import_Calling.CallMode.Direct,
        conversation,
        isVideoCall: call.isVideoCall
      };
    case import_Calling.CallMode.Group: {
      if (!call.ringerUuid) {
        log.error("The incoming group call has no ring state");
        return void 0;
      }
      const conversationSelector = (0, import_conversations.getConversationSelector)(state);
      const ringer = conversationSelector(call.ringerUuid);
      const otherMembersRung = (conversation.sortedGroupMembers ?? []).filter((c) => c.id !== ringer.id && !c.isMe);
      return {
        callMode: import_Calling.CallMode.Group,
        conversation,
        otherMembersRung,
        ringer
      };
    }
    default:
      throw (0, import_missingCaseError.missingCaseError)(call);
  }
}, "mapStateToIncomingCallProp");
const mapStateToProps = /* @__PURE__ */ __name((state) => ({
  activeCall: mapStateToActiveCallProp(state),
  bounceAppIconStart: import_bounceAppIcon.bounceAppIconStart,
  bounceAppIconStop: import_bounceAppIcon.bounceAppIconStop,
  availableCameras: state.calling.availableCameras,
  getGroupCallVideoFrameSource,
  getPreferredBadge: (0, import_badges.getPreferredBadgeSelector)(state),
  i18n: (0, import_user.getIntl)(state),
  isGroupCallOutboundRingEnabled: (0, import_isGroupCallOutboundRingEnabled.isGroupCallOutboundRingEnabled)(),
  incomingCall: mapStateToIncomingCallProp(state),
  me: (0, import_conversations.getMe)(state),
  notifyForCall,
  playRingtone,
  stopRingtone,
  renderDeviceSelection,
  renderSafetyNumberViewer,
  theme: (0, import_user.getTheme)(state)
}), "mapStateToProps");
const smart = (0, import_react_redux.connect)(mapStateToProps, import_actions.mapDispatchToProps);
const SmartCallManager = smart(import_CallManager.CallManager);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartCallManager
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ2FsbE1hbmFnZXIudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBtZW1vaXplIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG1hcERpc3BhdGNoVG9Qcm9wcyB9IGZyb20gJy4uL2FjdGlvbnMnO1xuaW1wb3J0IHsgQ2FsbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0NhbGxNYW5hZ2VyJztcbmltcG9ydCB7IGNhbGxpbmcgYXMgY2FsbGluZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYWxsaW5nJztcbmltcG9ydCB7IGdldEludGwsIGdldFRoZW1lIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgZ2V0TWUsIGdldENvbnZlcnNhdGlvblNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgZ2V0QWN0aXZlQ2FsbCB9IGZyb20gJy4uL2R1Y2tzL2NhbGxpbmcnO1xuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25UeXBlIH0gZnJvbSAnLi4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRJbmNvbWluZ0NhbGwgfSBmcm9tICcuLi9zZWxlY3RvcnMvY2FsbGluZyc7XG5pbXBvcnQgeyBpc0dyb3VwQ2FsbE91dGJvdW5kUmluZ0VuYWJsZWQgfSBmcm9tICcuLi8uLi91dGlsL2lzR3JvdXBDYWxsT3V0Ym91bmRSaW5nRW5hYmxlZCc7XG5pbXBvcnQgdHlwZSB7XG4gIEFjdGl2ZUNhbGxUeXBlLFxuICBHcm91cENhbGxSZW1vdGVQYXJ0aWNpcGFudFR5cGUsXG59IGZyb20gJy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgQ2FsbE1vZGUsIENhbGxTdGF0ZSB9IGZyb20gJy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgU21hcnRDYWxsaW5nRGV2aWNlU2VsZWN0aW9uIH0gZnJvbSAnLi9DYWxsaW5nRGV2aWNlU2VsZWN0aW9uJztcbmltcG9ydCB0eXBlIHsgU2FmZXR5TnVtYmVyUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1NhZmV0eU51bWJlckNoYW5nZURpYWxvZyc7XG5pbXBvcnQgeyBTbWFydFNhZmV0eU51bWJlclZpZXdlciB9IGZyb20gJy4vU2FmZXR5TnVtYmVyVmlld2VyJztcbmltcG9ydCB7IGNhbGxpbmdUb25lcyB9IGZyb20gJy4uLy4uL3V0aWwvY2FsbGluZ1RvbmVzJztcbmltcG9ydCB7XG4gIGJvdW5jZUFwcEljb25TdGFydCxcbiAgYm91bmNlQXBwSWNvblN0b3AsXG59IGZyb20gJy4uLy4uL3NoaW1zL2JvdW5jZUFwcEljb24nO1xuaW1wb3J0IHtcbiAgRkFMTEJBQ0tfTk9USUZJQ0FUSU9OX1RJVExFLFxuICBOb3RpZmljYXRpb25TZXR0aW5nLFxuICBub3RpZmljYXRpb25TZXJ2aWNlLFxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub3RpZmljYXRpb25zJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2JhZGdlcyc7XG5cbmZ1bmN0aW9uIHJlbmRlckRldmljZVNlbGVjdGlvbigpOiBKU1guRWxlbWVudCB7XG4gIHJldHVybiA8U21hcnRDYWxsaW5nRGV2aWNlU2VsZWN0aW9uIC8+O1xufVxuXG5mdW5jdGlvbiByZW5kZXJTYWZldHlOdW1iZXJWaWV3ZXIocHJvcHM6IFNhZmV0eU51bWJlclByb3BzKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gPFNtYXJ0U2FmZXR5TnVtYmVyVmlld2VyIHsuLi5wcm9wc30gLz47XG59XG5cbmNvbnN0IGdldEdyb3VwQ2FsbFZpZGVvRnJhbWVTb3VyY2UgPVxuICBjYWxsaW5nU2VydmljZS5nZXRHcm91cENhbGxWaWRlb0ZyYW1lU291cmNlLmJpbmQoY2FsbGluZ1NlcnZpY2UpO1xuXG5hc3luYyBmdW5jdGlvbiBub3RpZnlGb3JDYWxsKFxuICB0aXRsZTogc3RyaW5nLFxuICBpc1ZpZGVvQ2FsbDogYm9vbGVhblxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNob3VsZE5vdGlmeSA9XG4gICAgIXdpbmRvdy5TaWduYWxDb250ZXh0LmFjdGl2ZVdpbmRvd1NlcnZpY2UuaXNBY3RpdmUoKSAmJlxuICAgIHdpbmRvdy5FdmVudHMuZ2V0Q2FsbFN5c3RlbU5vdGlmaWNhdGlvbigpO1xuICBpZiAoIXNob3VsZE5vdGlmeSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBub3RpZmljYXRpb25UaXRsZTogc3RyaW5nO1xuXG4gIGNvbnN0IG5vdGlmaWNhdGlvblNldHRpbmcgPSBub3RpZmljYXRpb25TZXJ2aWNlLmdldE5vdGlmaWNhdGlvblNldHRpbmcoKTtcbiAgc3dpdGNoIChub3RpZmljYXRpb25TZXR0aW5nKSB7XG4gICAgY2FzZSBOb3RpZmljYXRpb25TZXR0aW5nLk9mZjpcbiAgICBjYXNlIE5vdGlmaWNhdGlvblNldHRpbmcuTm9OYW1lT3JNZXNzYWdlOlxuICAgICAgbm90aWZpY2F0aW9uVGl0bGUgPSBGQUxMQkFDS19OT1RJRklDQVRJT05fVElUTEU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE5vdGlmaWNhdGlvblNldHRpbmcuTmFtZU9ubHk6XG4gICAgY2FzZSBOb3RpZmljYXRpb25TZXR0aW5nLk5hbWVBbmRNZXNzYWdlOlxuICAgICAgbm90aWZpY2F0aW9uVGl0bGUgPSB0aXRsZTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBsb2cuZXJyb3IobWlzc2luZ0Nhc2VFcnJvcihub3RpZmljYXRpb25TZXR0aW5nKSk7XG4gICAgICBub3RpZmljYXRpb25UaXRsZSA9IEZBTExCQUNLX05PVElGSUNBVElPTl9USVRMRTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgbm90aWZpY2F0aW9uU2VydmljZS5ub3RpZnkoe1xuICAgIHRpdGxlOiBub3RpZmljYXRpb25UaXRsZSxcbiAgICBpY29uOiBpc1ZpZGVvQ2FsbFxuICAgICAgPyAnaW1hZ2VzL2ljb25zL3YyL3ZpZGVvLXNvbGlkLTI0LnN2ZydcbiAgICAgIDogJ2ltYWdlcy9pY29ucy92Mi9waG9uZS1yaWdodC1zb2xpZC0yNC5zdmcnLFxuICAgIG1lc3NhZ2U6IHdpbmRvdy5pMThuKFxuICAgICAgaXNWaWRlb0NhbGwgPyAnaW5jb21pbmdWaWRlb0NhbGwnIDogJ2luY29taW5nQXVkaW9DYWxsJ1xuICAgICksXG4gICAgb25Ob3RpZmljYXRpb25DbGljazogKCkgPT4ge1xuICAgICAgd2luZG93LnNob3dXaW5kb3coKTtcbiAgICB9LFxuICAgIHNpbGVudDogZmFsc2UsXG4gIH0pO1xufVxuXG5jb25zdCBwbGF5UmluZ3RvbmUgPSBjYWxsaW5nVG9uZXMucGxheVJpbmd0b25lLmJpbmQoY2FsbGluZ1RvbmVzKTtcbmNvbnN0IHN0b3BSaW5ndG9uZSA9IGNhbGxpbmdUb25lcy5zdG9wUmluZ3RvbmUuYmluZChjYWxsaW5nVG9uZXMpO1xuXG5jb25zdCBtYXBTdGF0ZVRvQWN0aXZlQ2FsbFByb3AgPSAoXG4gIHN0YXRlOiBTdGF0ZVR5cGVcbik6IHVuZGVmaW5lZCB8IEFjdGl2ZUNhbGxUeXBlID0+IHtcbiAgY29uc3QgeyBjYWxsaW5nIH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBhY3RpdmVDYWxsU3RhdGUgfSA9IGNhbGxpbmc7XG5cbiAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgY2FsbCA9IGdldEFjdGl2ZUNhbGwoY2FsbGluZyk7XG4gIGlmICghY2FsbCkge1xuICAgIGxvZy5lcnJvcignVGhlcmUgd2FzIGFuIGFjdGl2ZSBjYWxsIHN0YXRlIGJ1dCBubyBjb3JyZXNwb25kaW5nIGNhbGwnKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgY29udmVyc2F0aW9uU2VsZWN0b3IgPSBnZXRDb252ZXJzYXRpb25TZWxlY3RvcihzdGF0ZSk7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGNvbnZlcnNhdGlvblNlbGVjdG9yKGFjdGl2ZUNhbGxTdGF0ZS5jb252ZXJzYXRpb25JZCk7XG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgbG9nLmVycm9yKCdUaGUgYWN0aXZlIGNhbGwgaGFzIG5vIGNvcnJlc3BvbmRpbmcgY29udmVyc2F0aW9uJyk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvblNlbGVjdG9yQnlVdWlkID0gbWVtb2l6ZTxcbiAgICAodXVpZDogVVVJRFN0cmluZ1R5cGUpID0+IHVuZGVmaW5lZCB8IENvbnZlcnNhdGlvblR5cGVcbiAgPih1dWlkID0+IHtcbiAgICBjb25zdCBjb252b0ZvclV1aWQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICB1dWlkLFxuICAgIH0pO1xuICAgIHJldHVybiBjb252b0ZvclV1aWQgPyBjb252ZXJzYXRpb25TZWxlY3Rvcihjb252b0ZvclV1aWQuaWQpIDogdW5kZWZpbmVkO1xuICB9KTtcblxuICBjb25zdCBiYXNlUmVzdWx0ID0ge1xuICAgIGNvbnZlcnNhdGlvbixcbiAgICBoYXNMb2NhbEF1ZGlvOiBhY3RpdmVDYWxsU3RhdGUuaGFzTG9jYWxBdWRpbyxcbiAgICBoYXNMb2NhbFZpZGVvOiBhY3RpdmVDYWxsU3RhdGUuaGFzTG9jYWxWaWRlbyxcbiAgICBsb2NhbEF1ZGlvTGV2ZWw6IGFjdGl2ZUNhbGxTdGF0ZS5sb2NhbEF1ZGlvTGV2ZWwsXG4gICAgdmlld01vZGU6IGFjdGl2ZUNhbGxTdGF0ZS52aWV3TW9kZSxcbiAgICBqb2luZWRBdDogYWN0aXZlQ2FsbFN0YXRlLmpvaW5lZEF0LFxuICAgIG91dGdvaW5nUmluZzogYWN0aXZlQ2FsbFN0YXRlLm91dGdvaW5nUmluZyxcbiAgICBwaXA6IGFjdGl2ZUNhbGxTdGF0ZS5waXAsXG4gICAgcHJlc2VudGluZ1NvdXJjZTogYWN0aXZlQ2FsbFN0YXRlLnByZXNlbnRpbmdTb3VyY2UsXG4gICAgcHJlc2VudGluZ1NvdXJjZXNBdmFpbGFibGU6IGFjdGl2ZUNhbGxTdGF0ZS5wcmVzZW50aW5nU291cmNlc0F2YWlsYWJsZSxcbiAgICBzZXR0aW5nc0RpYWxvZ09wZW46IGFjdGl2ZUNhbGxTdGF0ZS5zZXR0aW5nc0RpYWxvZ09wZW4sXG4gICAgc2hvd05lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNXYXJuaW5nOiBCb29sZWFuKFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlLnNob3dOZWVkc1NjcmVlblJlY29yZGluZ1Blcm1pc3Npb25zV2FybmluZ1xuICAgICksXG4gICAgc2hvd1BhcnRpY2lwYW50c0xpc3Q6IGFjdGl2ZUNhbGxTdGF0ZS5zaG93UGFydGljaXBhbnRzTGlzdCxcbiAgfTtcblxuICBzd2l0Y2ggKGNhbGwuY2FsbE1vZGUpIHtcbiAgICBjYXNlIENhbGxNb2RlLkRpcmVjdDpcbiAgICAgIGlmIChcbiAgICAgICAgY2FsbC5pc0luY29taW5nICYmXG4gICAgICAgIChjYWxsLmNhbGxTdGF0ZSA9PT0gQ2FsbFN0YXRlLlByZXJpbmcgfHxcbiAgICAgICAgICBjYWxsLmNhbGxTdGF0ZSA9PT0gQ2FsbFN0YXRlLlJpbmdpbmcpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlUmVzdWx0LFxuICAgICAgICBjYWxsRW5kZWRSZWFzb246IGNhbGwuY2FsbEVuZGVkUmVhc29uLFxuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICBjYWxsU3RhdGU6IGNhbGwuY2FsbFN0YXRlLFxuICAgICAgICBwZWVrZWRQYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBoYXNSZW1vdGVWaWRlbzogQm9vbGVhbihjYWxsLmhhc1JlbW90ZVZpZGVvKSxcbiAgICAgICAgICAgIHByZXNlbnRpbmc6IEJvb2xlYW4oY2FsbC5pc1NoYXJpbmdTY3JlZW4pLFxuICAgICAgICAgICAgdGl0bGU6IGNvbnZlcnNhdGlvbi50aXRsZSxcbiAgICAgICAgICAgIHV1aWQ6IGNvbnZlcnNhdGlvbi51dWlkLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgIGNhc2UgQ2FsbE1vZGUuR3JvdXA6IHtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbnNXaXRoU2FmZXR5TnVtYmVyQ2hhbmdlczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVyczogQXJyYXk8Q29udmVyc2F0aW9uVHlwZT4gPSBbXTtcbiAgICAgIGNvbnN0IHJlbW90ZVBhcnRpY2lwYW50czogQXJyYXk8R3JvdXBDYWxsUmVtb3RlUGFydGljaXBhbnRUeXBlPiA9IFtdO1xuICAgICAgY29uc3QgcGVla2VkUGFydGljaXBhbnRzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9IFtdO1xuXG4gICAgICBjb25zdCB7IG1lbWJlcnNoaXBzID0gW10gfSA9IGNvbnZlcnNhdGlvbjtcblxuICAgICAgLy8gQWN0aXZlIGNhbGxzIHNob3VsZCBoYXZlIHBlZWsgaW5mbywgYnV0IFR5cGVTY3JpcHQgZG9lc24ndCBrbm93IHRoYXQgc28gd2UgaGF2ZSBhXG4gICAgICAvLyAgIGZhbGxiYWNrLlxuICAgICAgY29uc3Qge1xuICAgICAgICBwZWVrSW5mbyA9IHtcbiAgICAgICAgICBkZXZpY2VDb3VudDogMCxcbiAgICAgICAgICBtYXhEZXZpY2VzOiBJbmZpbml0eSxcbiAgICAgICAgICB1dWlkczogW10sXG4gICAgICAgIH0sXG4gICAgICB9ID0gY2FsbDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW1iZXJzaGlwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCB7IHV1aWQgfSA9IG1lbWJlcnNoaXBzW2ldO1xuXG4gICAgICAgIGNvbnN0IG1lbWJlciA9IGNvbnZlcnNhdGlvblNlbGVjdG9yKHV1aWQpO1xuICAgICAgICBpZiAoIW1lbWJlcikge1xuICAgICAgICAgIGxvZy5lcnJvcignR3JvdXAgbWVtYmVyIGhhcyBubyBjb3JyZXNwb25kaW5nIGNvbnZlcnNhdGlvbicpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBNZW1iZXJzLnB1c2gobWVtYmVyKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWxsLnJlbW90ZVBhcnRpY2lwYW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCByZW1vdGVQYXJ0aWNpcGFudCA9IGNhbGwucmVtb3RlUGFydGljaXBhbnRzW2ldO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZUNvbnZlcnNhdGlvbiA9IGNvbnZlcnNhdGlvblNlbGVjdG9yQnlVdWlkKFxuICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50LnV1aWRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFyZW1vdGVDb252ZXJzYXRpb24pIHtcbiAgICAgICAgICBsb2cuZXJyb3IoJ1JlbW90ZSBwYXJ0aWNpcGFudCBoYXMgbm8gY29ycmVzcG9uZGluZyBjb252ZXJzYXRpb24nKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW90ZVBhcnRpY2lwYW50cy5wdXNoKHtcbiAgICAgICAgICAuLi5yZW1vdGVDb252ZXJzYXRpb24sXG4gICAgICAgICAgZGVtdXhJZDogcmVtb3RlUGFydGljaXBhbnQuZGVtdXhJZCxcbiAgICAgICAgICBoYXNSZW1vdGVBdWRpbzogcmVtb3RlUGFydGljaXBhbnQuaGFzUmVtb3RlQXVkaW8sXG4gICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHJlbW90ZVBhcnRpY2lwYW50Lmhhc1JlbW90ZVZpZGVvLFxuICAgICAgICAgIHByZXNlbnRpbmc6IHJlbW90ZVBhcnRpY2lwYW50LnByZXNlbnRpbmcsXG4gICAgICAgICAgc2hhcmluZ1NjcmVlbjogcmVtb3RlUGFydGljaXBhbnQuc2hhcmluZ1NjcmVlbixcbiAgICAgICAgICBzcGVha2VyVGltZTogcmVtb3RlUGFydGljaXBhbnQuc3BlYWtlclRpbWUsXG4gICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogcmVtb3RlUGFydGljaXBhbnQudmlkZW9Bc3BlY3RSYXRpbyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgaSA8IGFjdGl2ZUNhbGxTdGF0ZS5zYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHMubGVuZ3RoO1xuICAgICAgICBpICs9IDFcbiAgICAgICkge1xuICAgICAgICBjb25zdCB1dWlkID0gYWN0aXZlQ2FsbFN0YXRlLnNhZmV0eU51bWJlckNoYW5nZWRVdWlkc1tpXTtcblxuICAgICAgICBjb25zdCByZW1vdGVDb252ZXJzYXRpb24gPSBjb252ZXJzYXRpb25TZWxlY3RvckJ5VXVpZCh1dWlkKTtcbiAgICAgICAgaWYgKCFyZW1vdGVDb252ZXJzYXRpb24pIHtcbiAgICAgICAgICBsb2cuZXJyb3IoJ1JlbW90ZSBwYXJ0aWNpcGFudCBoYXMgbm8gY29ycmVzcG9uZGluZyBjb252ZXJzYXRpb24nKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnZlcnNhdGlvbnNXaXRoU2FmZXR5TnVtYmVyQ2hhbmdlcy5wdXNoKHJlbW90ZUNvbnZlcnNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVla0luZm8udXVpZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgcGVla2VkUGFydGljaXBhbnRVdWlkID0gcGVla0luZm8udXVpZHNbaV07XG5cbiAgICAgICAgY29uc3QgcGVla2VkQ29udmVyc2F0aW9uID0gY29udmVyc2F0aW9uU2VsZWN0b3JCeVV1aWQoXG4gICAgICAgICAgcGVla2VkUGFydGljaXBhbnRVdWlkXG4gICAgICAgICk7XG4gICAgICAgIGlmICghcGVla2VkQ29udmVyc2F0aW9uKSB7XG4gICAgICAgICAgbG9nLmVycm9yKCdSZW1vdGUgcGFydGljaXBhbnQgaGFzIG5vIGNvcnJlc3BvbmRpbmcgY29udmVyc2F0aW9uJyk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBwZWVrZWRQYXJ0aWNpcGFudHMucHVzaChwZWVrZWRDb252ZXJzYXRpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlUmVzdWx0LFxuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogY2FsbC5jb25uZWN0aW9uU3RhdGUsXG4gICAgICAgIGNvbnZlcnNhdGlvbnNXaXRoU2FmZXR5TnVtYmVyQ2hhbmdlcyxcbiAgICAgICAgZGV2aWNlQ291bnQ6IHBlZWtJbmZvLmRldmljZUNvdW50LFxuICAgICAgICBncm91cE1lbWJlcnMsXG4gICAgICAgIGpvaW5TdGF0ZTogY2FsbC5qb2luU3RhdGUsXG4gICAgICAgIG1heERldmljZXM6IHBlZWtJbmZvLm1heERldmljZXMsXG4gICAgICAgIHBlZWtlZFBhcnRpY2lwYW50cyxcbiAgICAgICAgcmVtb3RlUGFydGljaXBhbnRzLFxuICAgICAgICByZW1vdGVBdWRpb0xldmVsczogY2FsbC5yZW1vdGVBdWRpb0xldmVscyB8fCBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpLFxuICAgICAgfTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoY2FsbCk7XG4gIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9JbmNvbWluZ0NhbGxQcm9wID0gKHN0YXRlOiBTdGF0ZVR5cGUpID0+IHtcbiAgY29uc3QgY2FsbCA9IGdldEluY29taW5nQ2FsbChzdGF0ZSk7XG4gIGlmICghY2FsbCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRDb252ZXJzYXRpb25TZWxlY3RvcihzdGF0ZSkoY2FsbC5jb252ZXJzYXRpb25JZCk7XG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgbG9nLmVycm9yKCdUaGUgaW5jb21pbmcgY2FsbCBoYXMgbm8gY29ycmVzcG9uZGluZyBjb252ZXJzYXRpb24nKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3dpdGNoIChjYWxsLmNhbGxNb2RlKSB7XG4gICAgY2FzZSBDYWxsTW9kZS5EaXJlY3Q6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0IGFzIGNvbnN0LFxuICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgIGlzVmlkZW9DYWxsOiBjYWxsLmlzVmlkZW9DYWxsLFxuICAgICAgfTtcbiAgICBjYXNlIENhbGxNb2RlLkdyb3VwOiB7XG4gICAgICBpZiAoIWNhbGwucmluZ2VyVXVpZCkge1xuICAgICAgICBsb2cuZXJyb3IoJ1RoZSBpbmNvbWluZyBncm91cCBjYWxsIGhhcyBubyByaW5nIHN0YXRlJyk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvblNlbGVjdG9yID0gZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3Ioc3RhdGUpO1xuICAgICAgY29uc3QgcmluZ2VyID0gY29udmVyc2F0aW9uU2VsZWN0b3IoY2FsbC5yaW5nZXJVdWlkKTtcbiAgICAgIGNvbnN0IG90aGVyTWVtYmVyc1J1bmcgPSAoY29udmVyc2F0aW9uLnNvcnRlZEdyb3VwTWVtYmVycyA/PyBbXSkuZmlsdGVyKFxuICAgICAgICBjID0+IGMuaWQgIT09IHJpbmdlci5pZCAmJiAhYy5pc01lXG4gICAgICApO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAgYXMgY29uc3QsXG4gICAgICAgIGNvbnZlcnNhdGlvbixcbiAgICAgICAgb3RoZXJNZW1iZXJzUnVuZyxcbiAgICAgICAgcmluZ2VyLFxuICAgICAgfTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoY2FsbCk7XG4gIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZTogU3RhdGVUeXBlKSA9PiAoe1xuICBhY3RpdmVDYWxsOiBtYXBTdGF0ZVRvQWN0aXZlQ2FsbFByb3Aoc3RhdGUpLFxuICBib3VuY2VBcHBJY29uU3RhcnQsXG4gIGJvdW5jZUFwcEljb25TdG9wLFxuICBhdmFpbGFibGVDYW1lcmFzOiBzdGF0ZS5jYWxsaW5nLmF2YWlsYWJsZUNhbWVyYXMsXG4gIGdldEdyb3VwQ2FsbFZpZGVvRnJhbWVTb3VyY2UsXG4gIGdldFByZWZlcnJlZEJhZGdlOiBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yKHN0YXRlKSxcbiAgaTE4bjogZ2V0SW50bChzdGF0ZSksXG4gIGlzR3JvdXBDYWxsT3V0Ym91bmRSaW5nRW5hYmxlZDogaXNHcm91cENhbGxPdXRib3VuZFJpbmdFbmFibGVkKCksXG4gIGluY29taW5nQ2FsbDogbWFwU3RhdGVUb0luY29taW5nQ2FsbFByb3Aoc3RhdGUpLFxuICBtZTogZ2V0TWUoc3RhdGUpLFxuICBub3RpZnlGb3JDYWxsLFxuICBwbGF5UmluZ3RvbmUsXG4gIHN0b3BSaW5ndG9uZSxcbiAgcmVuZGVyRGV2aWNlU2VsZWN0aW9uLFxuICByZW5kZXJTYWZldHlOdW1iZXJWaWV3ZXIsXG4gIHRoZW1lOiBnZXRUaGVtZShzdGF0ZSksXG59KTtcblxuY29uc3Qgc21hcnQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKTtcblxuZXhwb3J0IGNvbnN0IFNtYXJ0Q2FsbE1hbmFnZXIgPSBzbWFydChDYWxsTWFuYWdlcik7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUF3QjtBQUN4QixvQkFBd0I7QUFDeEIscUJBQW1DO0FBQ25DLHlCQUE0QjtBQUM1QixxQkFBMEM7QUFDMUMsa0JBQWtDO0FBQ2xDLDJCQUErQztBQUMvQyxzQkFBOEI7QUFFOUIsc0JBQWdDO0FBQ2hDLDRDQUErQztBQU0vQyxxQkFBb0M7QUFFcEMsOEJBQWlDO0FBQ2pDLG9DQUE0QztBQUU1QyxnQ0FBd0M7QUFDeEMsMEJBQTZCO0FBQzdCLDJCQUdPO0FBQ1AsMkJBSU87QUFDUCxVQUFxQjtBQUNyQixvQkFBMEM7QUFFMUMsaUNBQThDO0FBQzVDLFNBQU8sbURBQUMsK0RBQTRCO0FBQ3RDO0FBRlMsQUFJVCxrQ0FBa0MsT0FBdUM7QUFDdkUsU0FBTyxtREFBQztBQUFBLE9BQTRCO0FBQUEsR0FBTztBQUM3QztBQUZTLEFBSVQsTUFBTSwrQkFDSix1QkFBZSw2QkFBNkIsS0FBSyxzQkFBYztBQUVqRSw2QkFDRSxPQUNBLGFBQ2U7QUFDZixRQUFNLGVBQ0osQ0FBQyxPQUFPLGNBQWMsb0JBQW9CLFNBQVMsS0FDbkQsT0FBTyxPQUFPLDBCQUEwQjtBQUMxQyxNQUFJLENBQUMsY0FBYztBQUNqQjtBQUFBLEVBQ0Y7QUFF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
