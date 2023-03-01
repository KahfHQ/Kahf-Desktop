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
var calling_exports = {};
__export(calling_exports, {
  actions: () => actions,
  getActiveCall: () => getActiveCall,
  getEmptyState: () => getEmptyState,
  getIncomingCall: () => getIncomingCall,
  isAnybodyElseInGroupCall: () => isAnybodyElseInGroupCall,
  reducer: () => reducer
});
module.exports = __toCommonJS(calling_exports);
var import_electron = require("electron");
var import_ringrtc = require("ringrtc");
var import_mac_screen_capture_permissions = require("mac-screen-capture-permissions");
var import_lodash = require("lodash");
var import_getOwn = require("../../util/getOwn");
var Errors = __toESM(require("../../types/errors"));
var import_user = require("../selectors/user");
var import_isConversationTooBigToRing = require("../../conversations/isConversationTooBigToRing");
var import_missingCaseError = require("../../util/missingCaseError");
var import_calling = require("../../services/calling");
var import_truncateAudioLevel = require("../../calling/truncateAudioLevel");
var import_Calling = require("../../types/Calling");
var import_callingTones = require("../../util/callingTones");
var import_callingPermissions = require("../../util/callingPermissions");
var import_isGroupCallOutboundRingEnabled = require("../../util/isGroupCallOutboundRingEnabled");
var import_sleep = require("../../util/sleep");
var import_LatestQueue = require("../../util/LatestQueue");
var import_conversations = require("./conversations");
var log = __toESM(require("../../logging/log"));
var import_assert = require("../../util/assert");
var import_waitForOnline = require("../../util/waitForOnline");
var mapUtil = __toESM(require("../../util/mapUtil"));
const getActiveCall = /* @__PURE__ */ __name(({
  activeCallState,
  callsByConversation
}) => activeCallState && (0, import_getOwn.getOwn)(callsByConversation, activeCallState.conversationId), "getActiveCall");
const getIncomingCall = /* @__PURE__ */ __name((callsByConversation, ourUuid) => Object.values(callsByConversation).find((call) => {
  switch (call.callMode) {
    case import_Calling.CallMode.Direct:
      return call.isIncoming && call.callState === import_Calling.CallState.Ringing;
    case import_Calling.CallMode.Group:
      return call.ringerUuid && call.connectionState === import_Calling.GroupCallConnectionState.NotConnected && isAnybodyElseInGroupCall(call.peekInfo, ourUuid);
    default:
      throw (0, import_missingCaseError.missingCaseError)(call);
  }
}), "getIncomingCall");
const isAnybodyElseInGroupCall = /* @__PURE__ */ __name((peekInfo, ourUuid) => Boolean(peekInfo?.uuids.some((id) => id !== ourUuid)), "isAnybodyElseInGroupCall");
const getGroupCallRingState = /* @__PURE__ */ __name((call) => call?.ringId === void 0 ? {} : { ringId: call.ringId, ringerUuid: call.ringerUuid }, "getGroupCallRingState");
const peekQueueByConversation = /* @__PURE__ */ new Map();
const doGroupCallPeek = /* @__PURE__ */ __name((conversationId, dispatch, getState) => {
  const conversation = (0, import_getOwn.getOwn)(getState().conversations.conversationLookup, conversationId);
  if (!conversation || (0, import_conversations.getConversationCallMode)(conversation) !== import_Calling.CallMode.Group) {
    return;
  }
  let queue = peekQueueByConversation.get(conversationId);
  if (!queue) {
    queue = new import_LatestQueue.LatestQueue();
    queue.onceEmpty(() => {
      peekQueueByConversation.delete(conversationId);
    });
    peekQueueByConversation.set(conversationId, queue);
  }
  queue.add(async () => {
    const state = getState();
    const existingCall = (0, import_getOwn.getOwn)(state.calling.callsByConversation, conversationId);
    if (existingCall?.callMode === import_Calling.CallMode.Group && existingCall.connectionState !== import_Calling.GroupCallConnectionState.NotConnected) {
      return;
    }
    await Promise.all([(0, import_sleep.sleep)(1e3), (0, import_waitForOnline.waitForOnline)(navigator, window)]);
    let peekInfo;
    try {
      peekInfo = await import_calling.calling.peekGroupCall(conversationId);
    } catch (err) {
      log.error("Group call peeking failed", Errors.toLogFormat(err));
      return;
    }
    if (!peekInfo) {
      return;
    }
    log.info(`doGroupCallPeek/groupv2(${conversation.groupId}): Found ${peekInfo.deviceCount} devices`);
    await import_calling.calling.updateCallHistoryForGroupCall(conversationId, peekInfo);
    const formattedPeekInfo = import_calling.calling.formatGroupCallPeekInfoForRedux(peekInfo);
    dispatch({
      type: PEEK_GROUP_CALL_FULFILLED,
      payload: {
        conversationId,
        peekInfo: formattedPeekInfo
      }
    });
  });
}, "doGroupCallPeek");
const ACCEPT_CALL_PENDING = "calling/ACCEPT_CALL_PENDING";
const CANCEL_CALL = "calling/CANCEL_CALL";
const CANCEL_INCOMING_GROUP_CALL_RING = "calling/CANCEL_INCOMING_GROUP_CALL_RING";
const START_CALLING_LOBBY = "calling/START_CALLING_LOBBY";
const CALL_STATE_CHANGE_FULFILLED = "calling/CALL_STATE_CHANGE_FULFILLED";
const CHANGE_IO_DEVICE_FULFILLED = "calling/CHANGE_IO_DEVICE_FULFILLED";
const CLOSE_NEED_PERMISSION_SCREEN = "calling/CLOSE_NEED_PERMISSION_SCREEN";
const DECLINE_DIRECT_CALL = "calling/DECLINE_DIRECT_CALL";
const GROUP_CALL_AUDIO_LEVELS_CHANGE = "calling/GROUP_CALL_AUDIO_LEVELS_CHANGE";
const GROUP_CALL_STATE_CHANGE = "calling/GROUP_CALL_STATE_CHANGE";
const HANG_UP = "calling/HANG_UP";
const INCOMING_DIRECT_CALL = "calling/INCOMING_DIRECT_CALL";
const INCOMING_GROUP_CALL = "calling/INCOMING_GROUP_CALL";
const MARK_CALL_TRUSTED = "calling/MARK_CALL_TRUSTED";
const MARK_CALL_UNTRUSTED = "calling/MARK_CALL_UNTRUSTED";
const OUTGOING_CALL = "calling/OUTGOING_CALL";
const PEEK_GROUP_CALL_FULFILLED = "calling/PEEK_GROUP_CALL_FULFILLED";
const REFRESH_IO_DEVICES = "calling/REFRESH_IO_DEVICES";
const REMOTE_SHARING_SCREEN_CHANGE = "calling/REMOTE_SHARING_SCREEN_CHANGE";
const REMOTE_VIDEO_CHANGE = "calling/REMOTE_VIDEO_CHANGE";
const RETURN_TO_ACTIVE_CALL = "calling/RETURN_TO_ACTIVE_CALL";
const SET_LOCAL_AUDIO_FULFILLED = "calling/SET_LOCAL_AUDIO_FULFILLED";
const SET_LOCAL_VIDEO_FULFILLED = "calling/SET_LOCAL_VIDEO_FULFILLED";
const SET_OUTGOING_RING = "calling/SET_OUTGOING_RING";
const SET_PRESENTING = "calling/SET_PRESENTING";
const SET_PRESENTING_SOURCES = "calling/SET_PRESENTING_SOURCES";
const TOGGLE_NEEDS_SCREEN_RECORDING_PERMISSIONS = "calling/TOGGLE_NEEDS_SCREEN_RECORDING_PERMISSIONS";
const START_DIRECT_CALL = "calling/START_DIRECT_CALL";
const TOGGLE_PARTICIPANTS = "calling/TOGGLE_PARTICIPANTS";
const TOGGLE_PIP = "calling/TOGGLE_PIP";
const TOGGLE_SETTINGS = "calling/TOGGLE_SETTINGS";
const TOGGLE_SPEAKER_VIEW = "calling/TOGGLE_SPEAKER_VIEW";
const SWITCH_TO_PRESENTATION_VIEW = "calling/SWITCH_TO_PRESENTATION_VIEW";
const SWITCH_FROM_PRESENTATION_VIEW = "calling/SWITCH_FROM_PRESENTATION_VIEW";
function acceptCall(payload) {
  return async (dispatch, getState) => {
    const { conversationId, asVideoCall } = payload;
    const call = (0, import_getOwn.getOwn)(getState().calling.callsByConversation, conversationId);
    if (!call) {
      log.error("Trying to accept a non-existent call");
      return;
    }
    switch (call.callMode) {
      case import_Calling.CallMode.Direct:
        await import_calling.calling.acceptDirectCall(conversationId, asVideoCall);
        break;
      case import_Calling.CallMode.Group:
        await import_calling.calling.joinGroupCall(conversationId, true, asVideoCall, false);
        break;
      default:
        throw (0, import_missingCaseError.missingCaseError)(call);
    }
    dispatch({
      type: ACCEPT_CALL_PENDING,
      payload
    });
  };
}
function callStateChange(payload) {
  return async (dispatch) => {
    const { callState } = payload;
    if (callState === import_Calling.CallState.Ended) {
      await import_callingTones.callingTones.playEndCall();
      import_electron.ipcRenderer.send("close-screen-share-controller");
    }
    dispatch({
      type: CALL_STATE_CHANGE_FULFILLED,
      payload
    });
  };
}
function changeIODevice(payload) {
  return async (dispatch) => {
    if (payload.type === import_Calling.CallingDeviceType.CAMERA) {
      await import_calling.calling.setPreferredCamera(payload.selectedDevice);
    } else if (payload.type === import_Calling.CallingDeviceType.MICROPHONE) {
      import_calling.calling.setPreferredMicrophone(payload.selectedDevice);
    } else if (payload.type === import_Calling.CallingDeviceType.SPEAKER) {
      import_calling.calling.setPreferredSpeaker(payload.selectedDevice);
    }
    dispatch({
      type: CHANGE_IO_DEVICE_FULFILLED,
      payload
    });
  };
}
function closeNeedPermissionScreen() {
  return {
    type: CLOSE_NEED_PERMISSION_SCREEN,
    payload: null
  };
}
function cancelCall(payload) {
  import_calling.calling.stopCallingLobby(payload.conversationId);
  return {
    type: CANCEL_CALL
  };
}
function cancelIncomingGroupCallRing(payload) {
  return {
    type: CANCEL_INCOMING_GROUP_CALL_RING,
    payload
  };
}
function declineCall(payload) {
  return (dispatch, getState) => {
    const { conversationId } = payload;
    const call = (0, import_getOwn.getOwn)(getState().calling.callsByConversation, conversationId);
    if (!call) {
      log.error("Trying to decline a non-existent call");
      return;
    }
    switch (call.callMode) {
      case import_Calling.CallMode.Direct:
        import_calling.calling.declineDirectCall(conversationId);
        dispatch({
          type: DECLINE_DIRECT_CALL,
          payload
        });
        break;
      case import_Calling.CallMode.Group: {
        const { ringId } = call;
        if (ringId === void 0) {
          log.error("Trying to decline a group call without a ring ID");
        } else {
          import_calling.calling.declineGroupCall(conversationId, ringId);
          dispatch({
            type: CANCEL_INCOMING_GROUP_CALL_RING,
            payload: { conversationId, ringId }
          });
        }
        break;
      }
      default:
        throw (0, import_missingCaseError.missingCaseError)(call);
    }
  };
}
function getPresentingSources() {
  return async (dispatch, getState) => {
    const platform = (0, import_user.getPlatform)(getState());
    const needsPermission = platform === "darwin" && !(0, import_mac_screen_capture_permissions.hasScreenCapturePermission)();
    const sources = await import_calling.calling.getPresentingSources();
    if (needsPermission) {
      dispatch({
        type: TOGGLE_NEEDS_SCREEN_RECORDING_PERMISSIONS
      });
      return;
    }
    dispatch({
      type: SET_PRESENTING_SOURCES,
      payload: sources
    });
  };
}
function groupCallAudioLevelsChange(payload) {
  return { type: GROUP_CALL_AUDIO_LEVELS_CHANGE, payload };
}
function groupCallStateChange(payload) {
  return async (dispatch, getState) => {
    let didSomeoneStartPresenting;
    const activeCall = getActiveCall(getState().calling);
    if (activeCall?.callMode === import_Calling.CallMode.Group) {
      const wasSomeonePresenting = activeCall.remoteParticipants.some((participant) => participant.presenting);
      const isSomeonePresenting = payload.remoteParticipants.some((participant) => participant.presenting);
      didSomeoneStartPresenting = !wasSomeonePresenting && isSomeonePresenting;
    } else {
      didSomeoneStartPresenting = false;
    }
    const { ourACI: ourUuid } = getState().user;
    (0, import_assert.strictAssert)(ourUuid, "groupCallStateChange failed to fetch our uuid");
    dispatch({
      type: GROUP_CALL_STATE_CHANGE,
      payload: {
        ...payload,
        ourUuid
      }
    });
    if (didSomeoneStartPresenting) {
      import_callingTones.callingTones.someonePresenting();
    }
    if (payload.connectionState === import_Calling.GroupCallConnectionState.NotConnected) {
      import_electron.ipcRenderer.send("close-screen-share-controller");
    }
  };
}
function hangUpActiveCall() {
  return async (dispatch, getState) => {
    const state = getState();
    const activeCall = getActiveCall(state.calling);
    if (!activeCall) {
      return;
    }
    const { conversationId } = activeCall;
    import_calling.calling.hangup(conversationId);
    dispatch({
      type: HANG_UP,
      payload: {
        conversationId
      }
    });
    if (activeCall.callMode === import_Calling.CallMode.Group) {
      await (0, import_sleep.sleep)(1e3);
      doGroupCallPeek(conversationId, dispatch, getState);
    }
  };
}
function keyChanged(payload) {
  return (dispatch, getState) => {
    const state = getState();
    const { activeCallState } = state.calling;
    const activeCall = getActiveCall(state.calling);
    if (!activeCall || !activeCallState) {
      return;
    }
    if (activeCall.callMode === import_Calling.CallMode.Group) {
      const uuidsChanged = new Set(activeCallState.safetyNumberChangedUuids);
      activeCall.remoteParticipants.forEach((participant) => {
        if (participant.uuid === payload.uuid) {
          uuidsChanged.add(participant.uuid);
        }
      });
      const safetyNumberChangedUuids = Array.from(uuidsChanged);
      if (safetyNumberChangedUuids.length) {
        dispatch({
          type: MARK_CALL_UNTRUSTED,
          payload: {
            safetyNumberChangedUuids
          }
        });
      }
    }
  };
}
function keyChangeOk(payload) {
  return (dispatch) => {
    import_calling.calling.resendGroupCallMediaKeys(payload.conversationId);
    dispatch({
      type: MARK_CALL_TRUSTED,
      payload: null
    });
  };
}
function receiveIncomingDirectCall(payload) {
  return {
    type: INCOMING_DIRECT_CALL,
    payload
  };
}
function receiveIncomingGroupCall(payload) {
  return {
    type: INCOMING_GROUP_CALL,
    payload
  };
}
function openSystemPreferencesAction() {
  return () => {
    (0, import_mac_screen_capture_permissions.openSystemPreferences)();
  };
}
function outgoingCall(payload) {
  return {
    type: OUTGOING_CALL,
    payload
  };
}
function peekGroupCallForTheFirstTime(conversationId) {
  return (dispatch, getState) => {
    const call = (0, import_getOwn.getOwn)(getState().calling.callsByConversation, conversationId);
    const shouldPeek = !call || call.callMode === import_Calling.CallMode.Group && !call.peekInfo;
    if (shouldPeek) {
      doGroupCallPeek(conversationId, dispatch, getState);
    }
  };
}
function peekGroupCallIfItHasMembers(conversationId) {
  return (dispatch, getState) => {
    const call = (0, import_getOwn.getOwn)(getState().calling.callsByConversation, conversationId);
    const shouldPeek = call && call.callMode === import_Calling.CallMode.Group && call.joinState === import_Calling.GroupCallJoinState.NotJoined && call.peekInfo && call.peekInfo.deviceCount > 0;
    if (shouldPeek) {
      doGroupCallPeek(conversationId, dispatch, getState);
    }
  };
}
function peekNotConnectedGroupCall(payload) {
  return (dispatch, getState) => {
    const { conversationId } = payload;
    doGroupCallPeek(conversationId, dispatch, getState);
  };
}
function refreshIODevices(payload) {
  return {
    type: REFRESH_IO_DEVICES,
    payload
  };
}
function remoteSharingScreenChange(payload) {
  return {
    type: REMOTE_SHARING_SCREEN_CHANGE,
    payload
  };
}
function remoteVideoChange(payload) {
  return {
    type: REMOTE_VIDEO_CHANGE,
    payload
  };
}
function returnToActiveCall() {
  return {
    type: RETURN_TO_ACTIVE_CALL
  };
}
function setIsCallActive(isCallActive) {
  return () => {
    window.SignalContext.setIsCallActive(isCallActive);
  };
}
function setLocalPreview(payload) {
  return () => {
    import_calling.calling.videoCapturer.setLocalPreview(payload.element);
  };
}
function setRendererCanvas(payload) {
  return () => {
    import_calling.calling.videoRenderer.setCanvas(payload.element);
  };
}
function setLocalAudio(payload) {
  return (dispatch, getState) => {
    const activeCall = getActiveCall(getState().calling);
    if (!activeCall) {
      log.warn("Trying to set local audio when no call is active");
      return;
    }
    import_calling.calling.setOutgoingAudio(activeCall.conversationId, payload.enabled);
    dispatch({
      type: SET_LOCAL_AUDIO_FULFILLED,
      payload
    });
  };
}
function setLocalVideo(payload) {
  return async (dispatch, getState) => {
    const activeCall = getActiveCall(getState().calling);
    if (!activeCall) {
      log.warn("Trying to set local video when no call is active");
      return;
    }
    let enabled;
    if (await (0, import_callingPermissions.requestCameraPermissions)()) {
      if (activeCall.callMode === import_Calling.CallMode.Group || activeCall.callMode === import_Calling.CallMode.Direct && activeCall.callState) {
        import_calling.calling.setOutgoingVideo(activeCall.conversationId, payload.enabled);
      } else if (payload.enabled) {
        import_calling.calling.enableLocalCamera();
      } else {
        import_calling.calling.disableLocalVideo();
      }
      ({ enabled } = payload);
    } else {
      enabled = false;
    }
    dispatch({
      type: SET_LOCAL_VIDEO_FULFILLED,
      payload: {
        ...payload,
        enabled
      }
    });
  };
}
function setGroupCallVideoRequest(payload) {
  return () => {
    import_calling.calling.setGroupCallVideoRequest(payload.conversationId, payload.resolutions.map((resolution) => ({
      ...resolution,
      framerate: void 0
    })));
  };
}
function setPresenting(sourceToPresent) {
  return async (dispatch, getState) => {
    const callingState = getState().calling;
    const { activeCallState } = callingState;
    const activeCall = getActiveCall(callingState);
    if (!activeCall || !activeCallState) {
      log.warn("Trying to present when no call is active");
      return;
    }
    import_calling.calling.setPresenting(activeCall.conversationId, activeCallState.hasLocalVideo, sourceToPresent);
    dispatch({
      type: SET_PRESENTING,
      payload: sourceToPresent
    });
    if (sourceToPresent) {
      await import_callingTones.callingTones.someonePresenting();
    }
  };
}
function setOutgoingRing(payload) {
  return {
    type: SET_OUTGOING_RING,
    payload
  };
}
function startCallingLobby({
  conversationId,
  isVideoCall
}) {
  return async (dispatch, getState) => {
    const state = getState();
    const conversation = (0, import_getOwn.getOwn)(state.conversations.conversationLookup, conversationId);
    (0, import_assert.strictAssert)(conversation, "startCallingLobby: can't start lobby without a conversation");
    (0, import_assert.strictAssert)(!state.calling.activeCallState, "startCallingLobby: can't start lobby if a call is active");
    const groupCall = getGroupCall(conversationId, state.calling);
    const groupCallDeviceCount = groupCall?.peekInfo?.deviceCount || groupCall?.remoteParticipants.length || 0;
    const callLobbyData = await import_calling.calling.startCallingLobby({
      conversation,
      hasLocalAudio: groupCallDeviceCount < 8,
      hasLocalVideo: isVideoCall
    });
    if (!callLobbyData) {
      return;
    }
    dispatch({
      type: START_CALLING_LOBBY,
      payload: {
        ...callLobbyData,
        conversationId,
        isConversationTooBigToRing: (0, import_isConversationTooBigToRing.isConversationTooBigToRing)(conversation)
      }
    });
  };
}
function startCall(payload) {
  return async (dispatch, getState) => {
    switch (payload.callMode) {
      case import_Calling.CallMode.Direct:
        await import_calling.calling.startOutgoingDirectCall(payload.conversationId, payload.hasLocalAudio, payload.hasLocalVideo);
        dispatch({
          type: START_DIRECT_CALL,
          payload
        });
        break;
      case import_Calling.CallMode.Group: {
        let outgoingRing;
        const state = getState();
        const { activeCallState } = state.calling;
        if ((0, import_isGroupCallOutboundRingEnabled.isGroupCallOutboundRingEnabled)() && activeCallState?.outgoingRing) {
          const conversation = (0, import_getOwn.getOwn)(state.conversations.conversationLookup, activeCallState.conversationId);
          outgoingRing = Boolean(conversation && !(0, import_isConversationTooBigToRing.isConversationTooBigToRing)(conversation));
        } else {
          outgoingRing = false;
        }
        await import_calling.calling.joinGroupCall(payload.conversationId, payload.hasLocalAudio, payload.hasLocalVideo, outgoingRing);
        break;
      }
      default:
        throw (0, import_missingCaseError.missingCaseError)(payload.callMode);
    }
  };
}
function toggleParticipants() {
  return {
    type: TOGGLE_PARTICIPANTS
  };
}
function togglePip() {
  return {
    type: TOGGLE_PIP
  };
}
function toggleScreenRecordingPermissionsDialog() {
  return {
    type: TOGGLE_NEEDS_SCREEN_RECORDING_PERMISSIONS
  };
}
function toggleSettings() {
  return {
    type: TOGGLE_SETTINGS
  };
}
function toggleSpeakerView() {
  return {
    type: TOGGLE_SPEAKER_VIEW
  };
}
function switchToPresentationView() {
  return {
    type: SWITCH_TO_PRESENTATION_VIEW
  };
}
function switchFromPresentationView() {
  return {
    type: SWITCH_FROM_PRESENTATION_VIEW
  };
}
const actions = {
  acceptCall,
  callStateChange,
  cancelCall,
  cancelIncomingGroupCallRing,
  changeIODevice,
  closeNeedPermissionScreen,
  declineCall,
  getPresentingSources,
  groupCallAudioLevelsChange,
  groupCallStateChange,
  hangUpActiveCall,
  keyChangeOk,
  keyChanged,
  openSystemPreferencesAction,
  outgoingCall,
  peekGroupCallForTheFirstTime,
  peekGroupCallIfItHasMembers,
  peekNotConnectedGroupCall,
  receiveIncomingDirectCall,
  receiveIncomingGroupCall,
  refreshIODevices,
  remoteSharingScreenChange,
  remoteVideoChange,
  returnToActiveCall,
  setGroupCallVideoRequest,
  setIsCallActive,
  setLocalAudio,
  setLocalPreview,
  setLocalVideo,
  setPresenting,
  setRendererCanvas,
  setOutgoingRing,
  startCall,
  startCallingLobby,
  switchToPresentationView,
  switchFromPresentationView,
  toggleParticipants,
  togglePip,
  toggleScreenRecordingPermissionsDialog,
  toggleSettings,
  toggleSpeakerView
};
function getEmptyState() {
  return {
    availableCameras: [],
    availableMicrophones: [],
    availableSpeakers: [],
    selectedCamera: void 0,
    selectedMicrophone: void 0,
    selectedSpeaker: void 0,
    callsByConversation: {},
    activeCallState: void 0
  };
}
function getGroupCall(conversationId, state) {
  const call = (0, import_getOwn.getOwn)(state.callsByConversation, conversationId);
  return call?.callMode === import_Calling.CallMode.Group ? call : void 0;
}
function removeConversationFromState(state, conversationId) {
  return {
    ...conversationId === state.activeCallState?.conversationId ? (0, import_lodash.omit)(state, "activeCallState") : state,
    callsByConversation: (0, import_lodash.omit)(state.callsByConversation, conversationId)
  };
}
function reducer(state = getEmptyState(), action) {
  const { callsByConversation } = state;
  if (action.type === START_CALLING_LOBBY) {
    const { conversationId } = action.payload;
    let call;
    let outgoingRing;
    switch (action.payload.callMode) {
      case import_Calling.CallMode.Direct:
        call = {
          callMode: import_Calling.CallMode.Direct,
          conversationId,
          isIncoming: false,
          isVideoCall: action.payload.hasLocalVideo
        };
        outgoingRing = true;
        break;
      case import_Calling.CallMode.Group: {
        const existingCall = getGroupCall(conversationId, state);
        const ringState = getGroupCallRingState(existingCall);
        call = {
          callMode: import_Calling.CallMode.Group,
          conversationId,
          connectionState: action.payload.connectionState,
          joinState: action.payload.joinState,
          peekInfo: action.payload.peekInfo || existingCall?.peekInfo || {
            uuids: action.payload.remoteParticipants.map(({ uuid }) => uuid),
            maxDevices: Infinity,
            deviceCount: action.payload.remoteParticipants.length
          },
          remoteParticipants: action.payload.remoteParticipants,
          ...ringState
        };
        outgoingRing = (0, import_isGroupCallOutboundRingEnabled.isGroupCallOutboundRingEnabled)() && !ringState.ringId && !call.peekInfo?.uuids.length && !call.remoteParticipants.length && !action.payload.isConversationTooBigToRing;
        break;
      }
      default:
        throw (0, import_missingCaseError.missingCaseError)(action.payload);
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [action.payload.conversationId]: call
      },
      activeCallState: {
        conversationId: action.payload.conversationId,
        hasLocalAudio: action.payload.hasLocalAudio,
        hasLocalVideo: action.payload.hasLocalVideo,
        localAudioLevel: 0,
        viewMode: import_Calling.CallViewMode.Grid,
        pip: false,
        safetyNumberChangedUuids: [],
        settingsDialogOpen: false,
        showParticipantsList: false,
        outgoingRing
      }
    };
  }
  if (action.type === START_DIRECT_CALL) {
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [action.payload.conversationId]: {
          callMode: import_Calling.CallMode.Direct,
          conversationId: action.payload.conversationId,
          callState: import_Calling.CallState.Prering,
          isIncoming: false,
          isVideoCall: action.payload.hasLocalVideo
        }
      },
      activeCallState: {
        conversationId: action.payload.conversationId,
        hasLocalAudio: action.payload.hasLocalAudio,
        hasLocalVideo: action.payload.hasLocalVideo,
        localAudioLevel: 0,
        viewMode: import_Calling.CallViewMode.Grid,
        pip: false,
        safetyNumberChangedUuids: [],
        settingsDialogOpen: false,
        showParticipantsList: false,
        outgoingRing: true
      }
    };
  }
  if (action.type === ACCEPT_CALL_PENDING) {
    if (!(0, import_lodash.has)(state.callsByConversation, action.payload.conversationId)) {
      log.warn("Unable to accept a non-existent call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        conversationId: action.payload.conversationId,
        hasLocalAudio: true,
        hasLocalVideo: action.payload.asVideoCall,
        localAudioLevel: 0,
        viewMode: import_Calling.CallViewMode.Grid,
        pip: false,
        safetyNumberChangedUuids: [],
        settingsDialogOpen: false,
        showParticipantsList: false,
        outgoingRing: false
      }
    };
  }
  if (action.type === CANCEL_CALL || action.type === HANG_UP || action.type === CLOSE_NEED_PERMISSION_SCREEN) {
    const activeCall = getActiveCall(state);
    if (!activeCall) {
      log.warn("No active call to remove");
      return state;
    }
    switch (activeCall.callMode) {
      case import_Calling.CallMode.Direct:
        return removeConversationFromState(state, activeCall.conversationId);
      case import_Calling.CallMode.Group:
        return (0, import_lodash.omit)(state, "activeCallState");
      default:
        throw (0, import_missingCaseError.missingCaseError)(activeCall);
    }
  }
  if (action.type === CANCEL_INCOMING_GROUP_CALL_RING) {
    const { conversationId, ringId } = action.payload;
    const groupCall = getGroupCall(conversationId, state);
    if (!groupCall || groupCall.ringId !== ringId) {
      return state;
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: (0, import_lodash.omit)(groupCall, ["ringId", "ringerUuid"])
      }
    };
  }
  if (action.type === "CONVERSATION_CHANGED") {
    const activeCall = getActiveCall(state);
    const { activeCallState } = state;
    if (!activeCallState?.outgoingRing || activeCallState.conversationId !== action.payload.id || activeCall?.callMode !== import_Calling.CallMode.Group || activeCall.joinState !== import_Calling.GroupCallJoinState.NotJoined || !(0, import_isConversationTooBigToRing.isConversationTooBigToRing)(action.payload.data)) {
      return state;
    }
    return {
      ...state,
      activeCallState: { ...activeCallState, outgoingRing: false }
    };
  }
  if (action.type === "CONVERSATION_REMOVED") {
    return removeConversationFromState(state, action.payload.id);
  }
  if (action.type === DECLINE_DIRECT_CALL) {
    return removeConversationFromState(state, action.payload.conversationId);
  }
  if (action.type === INCOMING_DIRECT_CALL) {
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [action.payload.conversationId]: {
          callMode: import_Calling.CallMode.Direct,
          conversationId: action.payload.conversationId,
          callState: import_Calling.CallState.Prering,
          isIncoming: true,
          isVideoCall: action.payload.isVideoCall
        }
      }
    };
  }
  if (action.type === INCOMING_GROUP_CALL) {
    const { conversationId, ringId, ringerUuid } = action.payload;
    let groupCall;
    const existingGroupCall = getGroupCall(conversationId, state);
    if (existingGroupCall) {
      if (existingGroupCall.ringerUuid) {
        log.info("Group call was already ringing");
        return state;
      }
      if (existingGroupCall.joinState !== import_Calling.GroupCallJoinState.NotJoined) {
        log.info("Got a ring for a call we're already in");
        return state;
      }
      groupCall = {
        ...existingGroupCall,
        ringId,
        ringerUuid
      };
    } else {
      groupCall = {
        callMode: import_Calling.CallMode.Group,
        conversationId,
        connectionState: import_Calling.GroupCallConnectionState.NotConnected,
        joinState: import_Calling.GroupCallJoinState.NotJoined,
        peekInfo: {
          uuids: [],
          maxDevices: Infinity,
          deviceCount: 0
        },
        remoteParticipants: [],
        ringId,
        ringerUuid
      };
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: groupCall
      }
    };
  }
  if (action.type === OUTGOING_CALL) {
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [action.payload.conversationId]: {
          callMode: import_Calling.CallMode.Direct,
          conversationId: action.payload.conversationId,
          callState: import_Calling.CallState.Prering,
          isIncoming: false,
          isVideoCall: action.payload.hasLocalVideo
        }
      },
      activeCallState: {
        conversationId: action.payload.conversationId,
        hasLocalAudio: action.payload.hasLocalAudio,
        hasLocalVideo: action.payload.hasLocalVideo,
        localAudioLevel: 0,
        viewMode: import_Calling.CallViewMode.Grid,
        pip: false,
        safetyNumberChangedUuids: [],
        settingsDialogOpen: false,
        showParticipantsList: false,
        outgoingRing: true
      }
    };
  }
  if (action.type === CALL_STATE_CHANGE_FULFILLED) {
    if (action.payload.callState === import_Calling.CallState.Ended && action.payload.callEndedReason !== import_ringrtc.CallEndedReason.RemoteHangupNeedPermission) {
      return removeConversationFromState(state, action.payload.conversationId);
    }
    const call = (0, import_getOwn.getOwn)(state.callsByConversation, action.payload.conversationId);
    if (call?.callMode !== import_Calling.CallMode.Direct) {
      log.warn("Cannot update state for a non-direct call");
      return state;
    }
    let activeCallState;
    if (state.activeCallState?.conversationId === action.payload.conversationId) {
      activeCallState = {
        ...state.activeCallState,
        joinedAt: action.payload.acceptedTime
      };
    } else {
      ({ activeCallState } = state);
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [action.payload.conversationId]: {
          ...call,
          callState: action.payload.callState,
          callEndedReason: action.payload.callEndedReason
        }
      },
      activeCallState
    };
  }
  if (action.type === GROUP_CALL_AUDIO_LEVELS_CHANGE) {
    const { conversationId, remoteDeviceStates } = action.payload;
    const { activeCallState } = state;
    const existingCall = getGroupCall(conversationId, state);
    if (!activeCallState || activeCallState.pip || !existingCall) {
      return state;
    }
    const localAudioLevel = (0, import_truncateAudioLevel.truncateAudioLevel)(action.payload.localAudioLevel);
    const remoteAudioLevels = /* @__PURE__ */ new Map();
    remoteDeviceStates.forEach(({ audioLevel, demuxId }) => {
      if (typeof audioLevel !== "number") {
        return;
      }
      const graded = (0, import_truncateAudioLevel.truncateAudioLevel)(audioLevel);
      if (graded > 0) {
        remoteAudioLevels.set(demuxId, graded);
      }
    });
    const oldLocalAudioLevel = activeCallState.localAudioLevel;
    const oldRemoteAudioLevels = existingCall.remoteAudioLevels;
    if (oldLocalAudioLevel === localAudioLevel && oldRemoteAudioLevels && mapUtil.isEqual(oldRemoteAudioLevels, remoteAudioLevels)) {
      return state;
    }
    return {
      ...state,
      activeCallState: { ...activeCallState, localAudioLevel },
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: { ...existingCall, remoteAudioLevels }
      }
    };
  }
  if (action.type === GROUP_CALL_STATE_CHANGE) {
    const {
      connectionState,
      conversationId,
      hasLocalAudio,
      hasLocalVideo,
      joinState,
      ourUuid,
      peekInfo,
      remoteParticipants
    } = action.payload;
    const existingCall = getGroupCall(conversationId, state);
    const existingRingState = getGroupCallRingState(existingCall);
    const newPeekInfo = peekInfo || existingCall?.peekInfo || {
      uuids: remoteParticipants.map(({ uuid }) => uuid),
      maxDevices: Infinity,
      deviceCount: remoteParticipants.length
    };
    let newActiveCallState;
    if (state.activeCallState?.conversationId === conversationId) {
      newActiveCallState = connectionState === import_Calling.GroupCallConnectionState.NotConnected ? void 0 : {
        ...state.activeCallState,
        hasLocalAudio,
        hasLocalVideo
      };
    } else {
      newActiveCallState = state.activeCallState;
    }
    if (newActiveCallState && newActiveCallState.outgoingRing && newActiveCallState.conversationId === conversationId && isAnybodyElseInGroupCall(newPeekInfo, ourUuid)) {
      newActiveCallState = {
        ...newActiveCallState,
        outgoingRing: false
      };
    }
    let newRingState;
    if (joinState === import_Calling.GroupCallJoinState.NotJoined) {
      newRingState = existingRingState;
    } else {
      newRingState = {};
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: {
          callMode: import_Calling.CallMode.Group,
          conversationId,
          connectionState,
          joinState,
          peekInfo: newPeekInfo,
          remoteParticipants,
          ...newRingState
        }
      },
      activeCallState: newActiveCallState
    };
  }
  if (action.type === PEEK_GROUP_CALL_FULFILLED) {
    const { conversationId, peekInfo } = action.payload;
    const existingCall = getGroupCall(conversationId, state) || {
      callMode: import_Calling.CallMode.Group,
      conversationId,
      connectionState: import_Calling.GroupCallConnectionState.NotConnected,
      joinState: import_Calling.GroupCallJoinState.NotJoined,
      peekInfo: {
        uuids: [],
        maxDevices: Infinity,
        deviceCount: 0
      },
      remoteParticipants: []
    };
    if (existingCall.connectionState !== import_Calling.GroupCallConnectionState.NotConnected) {
      return state;
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: {
          ...existingCall,
          peekInfo
        }
      }
    };
  }
  if (action.type === REMOTE_SHARING_SCREEN_CHANGE) {
    const { conversationId, isSharingScreen } = action.payload;
    const call = (0, import_getOwn.getOwn)(state.callsByConversation, conversationId);
    if (call?.callMode !== import_Calling.CallMode.Direct) {
      log.warn("Cannot update remote video for a non-direct call");
      return state;
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: {
          ...call,
          isSharingScreen
        }
      }
    };
  }
  if (action.type === REMOTE_VIDEO_CHANGE) {
    const { conversationId, hasVideo } = action.payload;
    const call = (0, import_getOwn.getOwn)(state.callsByConversation, conversationId);
    if (call?.callMode !== import_Calling.CallMode.Direct) {
      log.warn("Cannot update remote video for a non-direct call");
      return state;
    }
    return {
      ...state,
      callsByConversation: {
        ...callsByConversation,
        [conversationId]: {
          ...call,
          hasRemoteVideo: hasVideo
        }
      }
    };
  }
  if (action.type === RETURN_TO_ACTIVE_CALL) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot return to active call if there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        pip: false
      }
    };
  }
  if (action.type === SET_LOCAL_AUDIO_FULFILLED) {
    if (!state.activeCallState) {
      log.warn("Cannot set local audio with no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...state.activeCallState,
        hasLocalAudio: action.payload.enabled
      }
    };
  }
  if (action.type === SET_LOCAL_VIDEO_FULFILLED) {
    if (!state.activeCallState) {
      log.warn("Cannot set local video with no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...state.activeCallState,
        hasLocalVideo: action.payload.enabled
      }
    };
  }
  if (action.type === CHANGE_IO_DEVICE_FULFILLED) {
    const { selectedDevice } = action.payload;
    const nextState = /* @__PURE__ */ Object.create(null);
    if (action.payload.type === import_Calling.CallingDeviceType.CAMERA) {
      nextState.selectedCamera = selectedDevice;
    } else if (action.payload.type === import_Calling.CallingDeviceType.MICROPHONE) {
      nextState.selectedMicrophone = selectedDevice;
    } else if (action.payload.type === import_Calling.CallingDeviceType.SPEAKER) {
      nextState.selectedSpeaker = selectedDevice;
    }
    return {
      ...state,
      ...nextState
    };
  }
  if (action.type === REFRESH_IO_DEVICES) {
    const {
      availableMicrophones,
      selectedMicrophone,
      availableSpeakers,
      selectedSpeaker,
      availableCameras,
      selectedCamera
    } = action.payload;
    return {
      ...state,
      availableMicrophones,
      selectedMicrophone,
      availableSpeakers,
      selectedSpeaker,
      availableCameras,
      selectedCamera
    };
  }
  if (action.type === TOGGLE_SETTINGS) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot toggle settings when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        settingsDialogOpen: !activeCallState.settingsDialogOpen
      }
    };
  }
  if (action.type === TOGGLE_PARTICIPANTS) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot toggle participants list when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        showParticipantsList: !activeCallState.showParticipantsList
      }
    };
  }
  if (action.type === TOGGLE_PIP) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot toggle PiP when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        pip: !activeCallState.pip
      }
    };
  }
  if (action.type === SET_PRESENTING) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot toggle presenting when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        presentingSource: action.payload,
        presentingSourcesAvailable: void 0
      }
    };
  }
  if (action.type === SET_PRESENTING_SOURCES) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot set presenting sources when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        presentingSourcesAvailable: action.payload
      }
    };
  }
  if (action.type === SET_OUTGOING_RING) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot set outgoing ring when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        outgoingRing: action.payload
      }
    };
  }
  if (action.type === TOGGLE_NEEDS_SCREEN_RECORDING_PERMISSIONS) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot set presenting sources when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        showNeedsScreenRecordingPermissionsWarning: !activeCallState.showNeedsScreenRecordingPermissionsWarning
      }
    };
  }
  if (action.type === TOGGLE_SPEAKER_VIEW) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot toggle speaker view when there is no active call");
      return state;
    }
    let newViewMode;
    if (activeCallState.viewMode === import_Calling.CallViewMode.Grid) {
      newViewMode = import_Calling.CallViewMode.Speaker;
    } else {
      newViewMode = import_Calling.CallViewMode.Grid;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        viewMode: newViewMode
      }
    };
  }
  if (action.type === SWITCH_TO_PRESENTATION_VIEW) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot switch to speaker view when there is no active call");
      return state;
    }
    if (activeCallState.viewMode === import_Calling.CallViewMode.Speaker) {
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        viewMode: import_Calling.CallViewMode.Presentation
      }
    };
  }
  if (action.type === SWITCH_FROM_PRESENTATION_VIEW) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot switch to speaker view when there is no active call");
      return state;
    }
    if (activeCallState.viewMode !== import_Calling.CallViewMode.Presentation) {
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        viewMode: import_Calling.CallViewMode.Grid
      }
    };
  }
  if (action.type === MARK_CALL_UNTRUSTED) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot mark call as untrusted when there is no active call");
      return state;
    }
    const { safetyNumberChangedUuids } = action.payload;
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        pip: false,
        safetyNumberChangedUuids,
        settingsDialogOpen: false,
        showParticipantsList: false
      }
    };
  }
  if (action.type === MARK_CALL_TRUSTED) {
    const { activeCallState } = state;
    if (!activeCallState) {
      log.warn("Cannot mark call as trusted when there is no active call");
      return state;
    }
    return {
      ...state,
      activeCallState: {
        ...activeCallState,
        safetyNumberChangedUuids: []
      }
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actions,
  getActiveCall,
  getEmptyState,
  getIncomingCall,
  isAnybodyElseInGroupCall,
  reducer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FsbGluZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHR5cGUgeyBUaHVua0FjdGlvbiwgVGh1bmtEaXNwYXRjaCB9IGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCB7IENhbGxFbmRlZFJlYXNvbiB9IGZyb20gJ3JpbmdydGMnO1xuaW1wb3J0IHtcbiAgaGFzU2NyZWVuQ2FwdHVyZVBlcm1pc3Npb24sXG4gIG9wZW5TeXN0ZW1QcmVmZXJlbmNlcyxcbn0gZnJvbSAnbWFjLXNjcmVlbi1jYXB0dXJlLXBlcm1pc3Npb25zJztcbmltcG9ydCB7IGhhcywgb21pdCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBnZXRPd24gfSBmcm9tICcuLi8uLi91dGlsL2dldE93bic7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB7IGdldFBsYXRmb3JtIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25Ub29CaWdUb1JpbmcgfSBmcm9tICcuLi8uLi9jb252ZXJzYXRpb25zL2lzQ29udmVyc2F0aW9uVG9vQmlnVG9SaW5nJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL21pc3NpbmdDYXNlRXJyb3InO1xuaW1wb3J0IHsgY2FsbGluZyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhbGxpbmcnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBdWRpb0xldmVsIH0gZnJvbSAnLi4vLi4vY2FsbGluZy90cnVuY2F0ZUF1ZGlvTGV2ZWwnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgYXMgUm9vdFN0YXRlVHlwZSB9IGZyb20gJy4uL3JlZHVjZXInO1xuaW1wb3J0IHR5cGUge1xuICBDaGFuZ2VJT0RldmljZVBheWxvYWRUeXBlLFxuICBHcm91cENhbGxWaWRlb1JlcXVlc3QsXG4gIE1lZGlhRGV2aWNlU2V0dGluZ3MsXG4gIFByZXNlbnRlZFNvdXJjZSxcbiAgUHJlc2VudGFibGVTb3VyY2UsXG59IGZyb20gJy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ2FsbGluZ0RldmljZVR5cGUsXG4gIENhbGxNb2RlLFxuICBDYWxsVmlld01vZGUsXG4gIENhbGxTdGF0ZSxcbiAgR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLFxuICBHcm91cENhbGxKb2luU3RhdGUsXG59IGZyb20gJy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHsgY2FsbGluZ1RvbmVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jYWxsaW5nVG9uZXMnO1xuaW1wb3J0IHsgcmVxdWVzdENhbWVyYVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdXRpbC9jYWxsaW5nUGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgaXNHcm91cENhbGxPdXRib3VuZFJpbmdFbmFibGVkIH0gZnJvbSAnLi4vLi4vdXRpbC9pc0dyb3VwQ2FsbE91dGJvdW5kUmluZ0VuYWJsZWQnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuLi8uLi91dGlsL3NsZWVwJztcbmltcG9ydCB7IExhdGVzdFF1ZXVlIH0gZnJvbSAnLi4vLi4vdXRpbC9MYXRlc3RRdWV1ZSc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlLFxuICBDb252ZXJzYXRpb25SZW1vdmVkQWN0aW9uVHlwZSxcbn0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvbkNhbGxNb2RlIH0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi8uLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgeyB3YWl0Rm9yT25saW5lIH0gZnJvbSAnLi4vLi4vdXRpbC93YWl0Rm9yT25saW5lJztcbmltcG9ydCAqIGFzIG1hcFV0aWwgZnJvbSAnLi4vLi4vdXRpbC9tYXBVdGlsJztcblxuLy8gU3RhdGVcblxuZXhwb3J0IHR5cGUgR3JvdXBDYWxsUGVla0luZm9UeXBlID0ge1xuICB1dWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+O1xuICBjcmVhdG9yVXVpZD86IFVVSURTdHJpbmdUeXBlO1xuICBlcmFJZD86IHN0cmluZztcbiAgbWF4RGV2aWNlczogbnVtYmVyO1xuICBkZXZpY2VDb3VudDogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgR3JvdXBDYWxsUGFydGljaXBhbnRJbmZvVHlwZSA9IHtcbiAgdXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gIGRlbXV4SWQ6IG51bWJlcjtcbiAgaGFzUmVtb3RlQXVkaW86IGJvb2xlYW47XG4gIGhhc1JlbW90ZVZpZGVvOiBib29sZWFuO1xuICBwcmVzZW50aW5nOiBib29sZWFuO1xuICBzaGFyaW5nU2NyZWVuOiBib29sZWFuO1xuICBzcGVha2VyVGltZT86IG51bWJlcjtcbiAgdmlkZW9Bc3BlY3RSYXRpbzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRGlyZWN0Q2FsbFN0YXRlVHlwZSA9IHtcbiAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdDtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgY2FsbFN0YXRlPzogQ2FsbFN0YXRlO1xuICBjYWxsRW5kZWRSZWFzb24/OiBDYWxsRW5kZWRSZWFzb247XG4gIGlzSW5jb21pbmc6IGJvb2xlYW47XG4gIGlzU2hhcmluZ1NjcmVlbj86IGJvb2xlYW47XG4gIGlzVmlkZW9DYWxsOiBib29sZWFuO1xuICBoYXNSZW1vdGVWaWRlbz86IGJvb2xlYW47XG59O1xuXG50eXBlIEdyb3VwQ2FsbFJpbmdTdGF0ZVR5cGUgPVxuICB8IHtcbiAgICAgIHJpbmdJZD86IHVuZGVmaW5lZDtcbiAgICAgIHJpbmdlclV1aWQ/OiB1bmRlZmluZWQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHJpbmdJZDogYmlnaW50O1xuICAgICAgcmluZ2VyVXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgR3JvdXBDYWxsU3RhdGVUeXBlID0ge1xuICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXA7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlO1xuICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZTtcbiAgcGVla0luZm8/OiBHcm91cENhbGxQZWVrSW5mb1R5cGU7XG4gIHJlbW90ZVBhcnRpY2lwYW50czogQXJyYXk8R3JvdXBDYWxsUGFydGljaXBhbnRJbmZvVHlwZT47XG4gIHJlbW90ZUF1ZGlvTGV2ZWxzPzogTWFwPG51bWJlciwgbnVtYmVyPjtcbn0gJiBHcm91cENhbGxSaW5nU3RhdGVUeXBlO1xuXG5leHBvcnQgdHlwZSBBY3RpdmVDYWxsU3RhdGVUeXBlID0ge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBoYXNMb2NhbEF1ZGlvOiBib29sZWFuO1xuICBoYXNMb2NhbFZpZGVvOiBib29sZWFuO1xuICBsb2NhbEF1ZGlvTGV2ZWw6IG51bWJlcjtcbiAgdmlld01vZGU6IENhbGxWaWV3TW9kZTtcbiAgam9pbmVkQXQ/OiBudW1iZXI7XG4gIG91dGdvaW5nUmluZzogYm9vbGVhbjtcbiAgcGlwOiBib29sZWFuO1xuICBwcmVzZW50aW5nU291cmNlPzogUHJlc2VudGVkU291cmNlO1xuICBwcmVzZW50aW5nU291cmNlc0F2YWlsYWJsZT86IEFycmF5PFByZXNlbnRhYmxlU291cmNlPjtcbiAgc2FmZXR5TnVtYmVyQ2hhbmdlZFV1aWRzOiBBcnJheTxVVUlEU3RyaW5nVHlwZT47XG4gIHNldHRpbmdzRGlhbG9nT3BlbjogYm9vbGVhbjtcbiAgc2hvd05lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNXYXJuaW5nPzogYm9vbGVhbjtcbiAgc2hvd1BhcnRpY2lwYW50c0xpc3Q6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBDYWxsc0J5Q29udmVyc2F0aW9uVHlwZSA9IHtcbiAgW2NvbnZlcnNhdGlvbklkOiBzdHJpbmddOiBEaXJlY3RDYWxsU3RhdGVUeXBlIHwgR3JvdXBDYWxsU3RhdGVUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQ2FsbGluZ1N0YXRlVHlwZSA9IE1lZGlhRGV2aWNlU2V0dGluZ3MgJiB7XG4gIGNhbGxzQnlDb252ZXJzYXRpb246IENhbGxzQnlDb252ZXJzYXRpb25UeXBlO1xuICBhY3RpdmVDYWxsU3RhdGU/OiBBY3RpdmVDYWxsU3RhdGVUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQWNjZXB0Q2FsbFR5cGUgPSB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGFzVmlkZW9DYWxsOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgQ2FsbFN0YXRlQ2hhbmdlVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgYWNjZXB0ZWRUaW1lPzogbnVtYmVyO1xuICBjYWxsU3RhdGU6IENhbGxTdGF0ZTtcbiAgY2FsbEVuZGVkUmVhc29uPzogQ2FsbEVuZGVkUmVhc29uO1xuICBpc0luY29taW5nOiBib29sZWFuO1xuICBpc1ZpZGVvQ2FsbDogYm9vbGVhbjtcbiAgdGl0bGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIENhbmNlbENhbGxUeXBlID0ge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xufTtcblxudHlwZSBDYW5jZWxJbmNvbWluZ0dyb3VwQ2FsbFJpbmdUeXBlID0ge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICByaW5nSWQ6IGJpZ2ludDtcbn07XG5cbmV4cG9ydCB0eXBlIERlY2xpbmVDYWxsVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbn07XG5cbnR5cGUgR3JvdXBDYWxsU3RhdGVDaGFuZ2VBcmd1bWVudFR5cGUgPSB7XG4gIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlO1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBoYXNMb2NhbEF1ZGlvOiBib29sZWFuO1xuICBoYXNMb2NhbFZpZGVvOiBib29sZWFuO1xuICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZTtcbiAgcGVla0luZm8/OiBHcm91cENhbGxQZWVrSW5mb1R5cGU7XG4gIHJlbW90ZVBhcnRpY2lwYW50czogQXJyYXk8R3JvdXBDYWxsUGFydGljaXBhbnRJbmZvVHlwZT47XG59O1xuXG50eXBlIEdyb3VwQ2FsbFN0YXRlQ2hhbmdlQWN0aW9uUGF5bG9hZFR5cGUgPVxuICBHcm91cENhbGxTdGF0ZUNoYW5nZUFyZ3VtZW50VHlwZSAmIHtcbiAgICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgfTtcblxudHlwZSBIYW5nVXBBY3Rpb25QYXlsb2FkVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbn07XG5cbnR5cGUgS2V5Q2hhbmdlZFR5cGUgPSB7XG4gIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgS2V5Q2hhbmdlT2tUeXBlID0ge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgSW5jb21pbmdEaXJlY3RDYWxsVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNWaWRlb0NhbGw6IGJvb2xlYW47XG59O1xuXG50eXBlIEluY29taW5nR3JvdXBDYWxsVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgcmluZ0lkOiBiaWdpbnQ7XG4gIHJpbmdlclV1aWQ6IFVVSURTdHJpbmdUeXBlO1xufTtcblxudHlwZSBQZWVrTm90Q29ubmVjdGVkR3JvdXBDYWxsVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbn07XG5cbnR5cGUgU3RhcnREaXJlY3RDYWxsVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaGFzTG9jYWxBdWRpbzogYm9vbGVhbjtcbiAgaGFzTG9jYWxWaWRlbzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIFN0YXJ0Q2FsbFR5cGUgPSBTdGFydERpcmVjdENhbGxUeXBlICYge1xuICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0IHwgQ2FsbE1vZGUuR3JvdXA7XG59O1xuXG5leHBvcnQgdHlwZSBSZW1vdGVWaWRlb0NoYW5nZVR5cGUgPSB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGhhc1ZpZGVvOiBib29sZWFuO1xufTtcblxudHlwZSBSZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlVHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgaXNTaGFyaW5nU2NyZWVuOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgU2V0TG9jYWxBdWRpb1R5cGUgPSB7XG4gIGVuYWJsZWQ6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBTZXRMb2NhbFZpZGVvVHlwZSA9IHtcbiAgZW5hYmxlZDogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIFNldEdyb3VwQ2FsbFZpZGVvUmVxdWVzdFR5cGUgPSB7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIHJlc29sdXRpb25zOiBBcnJheTxHcm91cENhbGxWaWRlb1JlcXVlc3Q+O1xufTtcblxuZXhwb3J0IHR5cGUgU3RhcnRDYWxsaW5nTG9iYnlUeXBlID0ge1xuICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICBpc1ZpZGVvQ2FsbDogYm9vbGVhbjtcbn07XG5cbnR5cGUgU3RhcnRDYWxsaW5nTG9iYnlQYXlsb2FkVHlwZSA9XG4gIHwge1xuICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdDtcbiAgICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgICBoYXNMb2NhbEF1ZGlvOiBib29sZWFuO1xuICAgICAgaGFzTG9jYWxWaWRlbzogYm9vbGVhbjtcbiAgICB9XG4gIHwge1xuICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwO1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlO1xuICAgICAgam9pblN0YXRlOiBHcm91cENhbGxKb2luU3RhdGU7XG4gICAgICBoYXNMb2NhbEF1ZGlvOiBib29sZWFuO1xuICAgICAgaGFzTG9jYWxWaWRlbzogYm9vbGVhbjtcbiAgICAgIGlzQ29udmVyc2F0aW9uVG9vQmlnVG9SaW5nOiBib29sZWFuO1xuICAgICAgcGVla0luZm8/OiBHcm91cENhbGxQZWVrSW5mb1R5cGU7XG4gICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IEFycmF5PEdyb3VwQ2FsbFBhcnRpY2lwYW50SW5mb1R5cGU+O1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIFNldExvY2FsUHJldmlld1R5cGUgPSB7XG4gIGVsZW1lbnQ6IFJlYWN0LlJlZk9iamVjdDxIVE1MVmlkZW9FbGVtZW50PiB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCB0eXBlIFNldFJlbmRlcmVyQ2FudmFzVHlwZSA9IHtcbiAgZWxlbWVudDogUmVhY3QuUmVmT2JqZWN0PEhUTUxDYW52YXNFbGVtZW50PiB8IHVuZGVmaW5lZDtcbn07XG5cbi8vIEhlbHBlcnNcblxuZXhwb3J0IGNvbnN0IGdldEFjdGl2ZUNhbGwgPSAoe1xuICBhY3RpdmVDYWxsU3RhdGUsXG4gIGNhbGxzQnlDb252ZXJzYXRpb24sXG59OiBDYWxsaW5nU3RhdGVUeXBlKTogdW5kZWZpbmVkIHwgRGlyZWN0Q2FsbFN0YXRlVHlwZSB8IEdyb3VwQ2FsbFN0YXRlVHlwZSA9PlxuICBhY3RpdmVDYWxsU3RhdGUgJiZcbiAgZ2V0T3duKGNhbGxzQnlDb252ZXJzYXRpb24sIGFjdGl2ZUNhbGxTdGF0ZS5jb252ZXJzYXRpb25JZCk7XG5cbi8vIEluIHRoZW9yeSwgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgaW5jb21pbmcgY2FsbHMsIG9yIGFuIGluY29taW5nIGNhbGwgd2hpbGUgdGhlcmUnc1xuLy8gICBhbiBhY3RpdmUgY2FsbC4gSW4gcHJhY3RpY2UsIHRoZSBVSSBpcyBub3QgcmVhZHkgZm9yIHRoaXMsIGFuZCBSaW5nUlRDIGRvZXNuJ3Rcbi8vICAgc3VwcG9ydCBpdCBmb3IgZGlyZWN0IGNhbGxzLlxuZXhwb3J0IGNvbnN0IGdldEluY29taW5nQ2FsbCA9IChcbiAgY2FsbHNCeUNvbnZlcnNhdGlvbjogUmVhZG9ubHk8Q2FsbHNCeUNvbnZlcnNhdGlvblR5cGU+LFxuICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZVxuKTogdW5kZWZpbmVkIHwgRGlyZWN0Q2FsbFN0YXRlVHlwZSB8IEdyb3VwQ2FsbFN0YXRlVHlwZSA9PlxuICBPYmplY3QudmFsdWVzKGNhbGxzQnlDb252ZXJzYXRpb24pLmZpbmQoY2FsbCA9PiB7XG4gICAgc3dpdGNoIChjYWxsLmNhbGxNb2RlKSB7XG4gICAgICBjYXNlIENhbGxNb2RlLkRpcmVjdDpcbiAgICAgICAgcmV0dXJuIGNhbGwuaXNJbmNvbWluZyAmJiBjYWxsLmNhbGxTdGF0ZSA9PT0gQ2FsbFN0YXRlLlJpbmdpbmc7XG4gICAgICBjYXNlIENhbGxNb2RlLkdyb3VwOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGNhbGwucmluZ2VyVXVpZCAmJlxuICAgICAgICAgIGNhbGwuY29ubmVjdGlvblN0YXRlID09PSBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuTm90Q29ubmVjdGVkICYmXG4gICAgICAgICAgaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsKGNhbGwucGVla0luZm8sIG91clV1aWQpXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKGNhbGwpO1xuICAgIH1cbiAgfSk7XG5cbmV4cG9ydCBjb25zdCBpc0FueWJvZHlFbHNlSW5Hcm91cENhbGwgPSAoXG4gIHBlZWtJbmZvOiB1bmRlZmluZWQgfCBSZWFkb25seTxQaWNrPEdyb3VwQ2FsbFBlZWtJbmZvVHlwZSwgJ3V1aWRzJz4+LFxuICBvdXJVdWlkOiBVVUlEU3RyaW5nVHlwZVxuKTogYm9vbGVhbiA9PiBCb29sZWFuKHBlZWtJbmZvPy51dWlkcy5zb21lKGlkID0+IGlkICE9PSBvdXJVdWlkKSk7XG5cbmNvbnN0IGdldEdyb3VwQ2FsbFJpbmdTdGF0ZSA9IChcbiAgY2FsbDogUmVhZG9ubHk8dW5kZWZpbmVkIHwgR3JvdXBDYWxsU3RhdGVUeXBlPlxuKTogR3JvdXBDYWxsUmluZ1N0YXRlVHlwZSA9PlxuICBjYWxsPy5yaW5nSWQgPT09IHVuZGVmaW5lZFxuICAgID8ge31cbiAgICA6IHsgcmluZ0lkOiBjYWxsLnJpbmdJZCwgcmluZ2VyVXVpZDogY2FsbC5yaW5nZXJVdWlkIH07XG5cbi8vIFdlIG1pZ2h0IGNhbGwgdGhpcyBmdW5jdGlvbiBtYW55IHRpbWVzIGluIHJhcGlkIHN1Y2Nlc3Npb24gKGZvciBleGFtcGxlLCBpZiBsb3RzIG9mXG4vLyAgIHBlb3BsZSBhcmUgam9pbmluZyBhbmQgbGVhdmluZyBhdCBvbmNlKS4gV2Ugd2FudCB0byBtYWtlIHN1cmUgdG8gdXBkYXRlIGV2ZW50dWFsbHlcbi8vICAgKGlmIHBlb3BsZSBqb2luIGFuZCBsZWF2ZSBmb3IgYW4gaG91ciwgd2UgZG9uJ3Qgd2FudCB5b3UgdG8gaGF2ZSB0byB3YWl0IGFuIGhvdXIgdG9cbi8vICAgZ2V0IGFuIHVwZGF0ZSksIGFuZCB3ZSBhbHNvIGRvbid0IHdhbnQgdG8gdXBkYXRlIHRvbyBvZnRlbi4gVGhhdCdzIHdoeSB3ZSB1c2UgYVxuLy8gICBcImxhdGVzdCBxdWV1ZVwiLlxuY29uc3QgcGVla1F1ZXVlQnlDb252ZXJzYXRpb24gPSBuZXcgTWFwPHN0cmluZywgTGF0ZXN0UXVldWU+KCk7XG5jb25zdCBkb0dyb3VwQ2FsbFBlZWsgPSAoXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gIGRpc3BhdGNoOiBUaHVua0Rpc3BhdGNoPFxuICAgIFJvb3RTdGF0ZVR5cGUsXG4gICAgdW5rbm93bixcbiAgICBQZWVrR3JvdXBDYWxsRnVsZmlsbGVkQWN0aW9uVHlwZVxuICA+LFxuICBnZXRTdGF0ZTogKCkgPT4gUm9vdFN0YXRlVHlwZVxuKSA9PiB7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldE93bihcbiAgICBnZXRTdGF0ZSgpLmNvbnZlcnNhdGlvbnMuY29udmVyc2F0aW9uTG9va3VwLFxuICAgIGNvbnZlcnNhdGlvbklkXG4gICk7XG4gIGlmIChcbiAgICAhY29udmVyc2F0aW9uIHx8XG4gICAgZ2V0Q29udmVyc2F0aW9uQ2FsbE1vZGUoY29udmVyc2F0aW9uKSAhPT0gQ2FsbE1vZGUuR3JvdXBcbiAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHF1ZXVlID0gcGVla1F1ZXVlQnlDb252ZXJzYXRpb24uZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgaWYgKCFxdWV1ZSkge1xuICAgIHF1ZXVlID0gbmV3IExhdGVzdFF1ZXVlKCk7XG4gICAgcXVldWUub25jZUVtcHR5KCgpID0+IHtcbiAgICAgIHBlZWtRdWV1ZUJ5Q29udmVyc2F0aW9uLmRlbGV0ZShjb252ZXJzYXRpb25JZCk7XG4gICAgfSk7XG4gICAgcGVla1F1ZXVlQnlDb252ZXJzYXRpb24uc2V0KGNvbnZlcnNhdGlvbklkLCBxdWV1ZSk7XG4gIH1cblxuICBxdWV1ZS5hZGQoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKTtcblxuICAgIC8vIFdlIG1ha2Ugc3VyZSB3ZSdyZSBub3QgdHJ5aW5nIHRvIHBlZWsgYXQgYSBjb25uZWN0ZWQgKG9yIGNvbm5lY3RpbmcsIG9yXG4gICAgLy8gICByZWNvbm5lY3RpbmcpIGNhbGwuIEJlY2F1c2UgdGhpcyBpcyBhc3luY2hyb25vdXMsIGl0J3MgcG9zc2libGUgdGhhdCB0aGUgY2FsbFxuICAgIC8vICAgd2lsbCBjb25uZWN0IGJ5IHRoZSB0aW1lIHdlIGRpc3BhdGNoLCBzbyB3ZSBhbHNvIG5lZWQgdG8gZG8gYSBzaW1pbGFyIGNoZWNrIGluXG4gICAgLy8gICB0aGUgcmVkdWNlci5cbiAgICBjb25zdCBleGlzdGluZ0NhbGwgPSBnZXRPd24oXG4gICAgICBzdGF0ZS5jYWxsaW5nLmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICBjb252ZXJzYXRpb25JZFxuICAgICk7XG4gICAgaWYgKFxuICAgICAgZXhpc3RpbmdDYWxsPy5jYWxsTW9kZSA9PT0gQ2FsbE1vZGUuR3JvdXAgJiZcbiAgICAgIGV4aXN0aW5nQ2FsbC5jb25uZWN0aW9uU3RhdGUgIT09IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Ob3RDb25uZWN0ZWRcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBwZWVrIHJpZ2h0IGFmdGVyIHJlY2VpdmluZyB0aGUgbWVzc2FnZSwgd2UgbWF5IGdldCBvdXRkYXRlZCBpbmZvcm1hdGlvbi5cbiAgICAvLyAgIFRoaXMgaXMgbW9zdCBub3RpY2VhYmxlIHdoZW4gc29tZW9uZSBsZWF2ZXMuIFdlIGFkZCBhIGRlbGF5IGFuZCB0aGVuIG1ha2Ugc3VyZVxuICAgIC8vICAgdG8gb25seSBiZSBwZWVraW5nIG9uY2UuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW3NsZWVwKDEwMDApLCB3YWl0Rm9yT25saW5lKG5hdmlnYXRvciwgd2luZG93KV0pO1xuXG4gICAgbGV0IHBlZWtJbmZvO1xuICAgIHRyeSB7XG4gICAgICBwZWVrSW5mbyA9IGF3YWl0IGNhbGxpbmcucGVla0dyb3VwQ2FsbChjb252ZXJzYXRpb25JZCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2cuZXJyb3IoJ0dyb3VwIGNhbGwgcGVla2luZyBmYWlsZWQnLCBFcnJvcnMudG9Mb2dGb3JtYXQoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFwZWVrSW5mbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKFxuICAgICAgYGRvR3JvdXBDYWxsUGVlay9ncm91cHYyKCR7Y29udmVyc2F0aW9uLmdyb3VwSWR9KTogRm91bmQgJHtwZWVrSW5mby5kZXZpY2VDb3VudH0gZGV2aWNlc2BcbiAgICApO1xuXG4gICAgYXdhaXQgY2FsbGluZy51cGRhdGVDYWxsSGlzdG9yeUZvckdyb3VwQ2FsbChjb252ZXJzYXRpb25JZCwgcGVla0luZm8pO1xuXG4gICAgY29uc3QgZm9ybWF0dGVkUGVla0luZm8gPSBjYWxsaW5nLmZvcm1hdEdyb3VwQ2FsbFBlZWtJbmZvRm9yUmVkdXgocGVla0luZm8pO1xuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogUEVFS19HUk9VUF9DQUxMX0ZVTEZJTExFRCxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIHBlZWtJbmZvOiBmb3JtYXR0ZWRQZWVrSW5mbyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufTtcblxuLy8gQWN0aW9uc1xuXG5jb25zdCBBQ0NFUFRfQ0FMTF9QRU5ESU5HID0gJ2NhbGxpbmcvQUNDRVBUX0NBTExfUEVORElORyc7XG5jb25zdCBDQU5DRUxfQ0FMTCA9ICdjYWxsaW5nL0NBTkNFTF9DQUxMJztcbmNvbnN0IENBTkNFTF9JTkNPTUlOR19HUk9VUF9DQUxMX1JJTkcgPVxuICAnY2FsbGluZy9DQU5DRUxfSU5DT01JTkdfR1JPVVBfQ0FMTF9SSU5HJztcbmNvbnN0IFNUQVJUX0NBTExJTkdfTE9CQlkgPSAnY2FsbGluZy9TVEFSVF9DQUxMSU5HX0xPQkJZJztcbmNvbnN0IENBTExfU1RBVEVfQ0hBTkdFX0ZVTEZJTExFRCA9ICdjYWxsaW5nL0NBTExfU1RBVEVfQ0hBTkdFX0ZVTEZJTExFRCc7XG5jb25zdCBDSEFOR0VfSU9fREVWSUNFX0ZVTEZJTExFRCA9ICdjYWxsaW5nL0NIQU5HRV9JT19ERVZJQ0VfRlVMRklMTEVEJztcbmNvbnN0IENMT1NFX05FRURfUEVSTUlTU0lPTl9TQ1JFRU4gPSAnY2FsbGluZy9DTE9TRV9ORUVEX1BFUk1JU1NJT05fU0NSRUVOJztcbmNvbnN0IERFQ0xJTkVfRElSRUNUX0NBTEwgPSAnY2FsbGluZy9ERUNMSU5FX0RJUkVDVF9DQUxMJztcbmNvbnN0IEdST1VQX0NBTExfQVVESU9fTEVWRUxTX0NIQU5HRSA9ICdjYWxsaW5nL0dST1VQX0NBTExfQVVESU9fTEVWRUxTX0NIQU5HRSc7XG5jb25zdCBHUk9VUF9DQUxMX1NUQVRFX0NIQU5HRSA9ICdjYWxsaW5nL0dST1VQX0NBTExfU1RBVEVfQ0hBTkdFJztcbmNvbnN0IEhBTkdfVVAgPSAnY2FsbGluZy9IQU5HX1VQJztcbmNvbnN0IElOQ09NSU5HX0RJUkVDVF9DQUxMID0gJ2NhbGxpbmcvSU5DT01JTkdfRElSRUNUX0NBTEwnO1xuY29uc3QgSU5DT01JTkdfR1JPVVBfQ0FMTCA9ICdjYWxsaW5nL0lOQ09NSU5HX0dST1VQX0NBTEwnO1xuY29uc3QgTUFSS19DQUxMX1RSVVNURUQgPSAnY2FsbGluZy9NQVJLX0NBTExfVFJVU1RFRCc7XG5jb25zdCBNQVJLX0NBTExfVU5UUlVTVEVEID0gJ2NhbGxpbmcvTUFSS19DQUxMX1VOVFJVU1RFRCc7XG5jb25zdCBPVVRHT0lOR19DQUxMID0gJ2NhbGxpbmcvT1VUR09JTkdfQ0FMTCc7XG5jb25zdCBQRUVLX0dST1VQX0NBTExfRlVMRklMTEVEID0gJ2NhbGxpbmcvUEVFS19HUk9VUF9DQUxMX0ZVTEZJTExFRCc7XG5jb25zdCBSRUZSRVNIX0lPX0RFVklDRVMgPSAnY2FsbGluZy9SRUZSRVNIX0lPX0RFVklDRVMnO1xuY29uc3QgUkVNT1RFX1NIQVJJTkdfU0NSRUVOX0NIQU5HRSA9ICdjYWxsaW5nL1JFTU9URV9TSEFSSU5HX1NDUkVFTl9DSEFOR0UnO1xuY29uc3QgUkVNT1RFX1ZJREVPX0NIQU5HRSA9ICdjYWxsaW5nL1JFTU9URV9WSURFT19DSEFOR0UnO1xuY29uc3QgUkVUVVJOX1RPX0FDVElWRV9DQUxMID0gJ2NhbGxpbmcvUkVUVVJOX1RPX0FDVElWRV9DQUxMJztcbmNvbnN0IFNFVF9MT0NBTF9BVURJT19GVUxGSUxMRUQgPSAnY2FsbGluZy9TRVRfTE9DQUxfQVVESU9fRlVMRklMTEVEJztcbmNvbnN0IFNFVF9MT0NBTF9WSURFT19GVUxGSUxMRUQgPSAnY2FsbGluZy9TRVRfTE9DQUxfVklERU9fRlVMRklMTEVEJztcbmNvbnN0IFNFVF9PVVRHT0lOR19SSU5HID0gJ2NhbGxpbmcvU0VUX09VVEdPSU5HX1JJTkcnO1xuY29uc3QgU0VUX1BSRVNFTlRJTkcgPSAnY2FsbGluZy9TRVRfUFJFU0VOVElORyc7XG5jb25zdCBTRVRfUFJFU0VOVElOR19TT1VSQ0VTID0gJ2NhbGxpbmcvU0VUX1BSRVNFTlRJTkdfU09VUkNFUyc7XG5jb25zdCBUT0dHTEVfTkVFRFNfU0NSRUVOX1JFQ09SRElOR19QRVJNSVNTSU9OUyA9XG4gICdjYWxsaW5nL1RPR0dMRV9ORUVEU19TQ1JFRU5fUkVDT1JESU5HX1BFUk1JU1NJT05TJztcbmNvbnN0IFNUQVJUX0RJUkVDVF9DQUxMID0gJ2NhbGxpbmcvU1RBUlRfRElSRUNUX0NBTEwnO1xuY29uc3QgVE9HR0xFX1BBUlRJQ0lQQU5UUyA9ICdjYWxsaW5nL1RPR0dMRV9QQVJUSUNJUEFOVFMnO1xuY29uc3QgVE9HR0xFX1BJUCA9ICdjYWxsaW5nL1RPR0dMRV9QSVAnO1xuY29uc3QgVE9HR0xFX1NFVFRJTkdTID0gJ2NhbGxpbmcvVE9HR0xFX1NFVFRJTkdTJztcbmNvbnN0IFRPR0dMRV9TUEVBS0VSX1ZJRVcgPSAnY2FsbGluZy9UT0dHTEVfU1BFQUtFUl9WSUVXJztcbmNvbnN0IFNXSVRDSF9UT19QUkVTRU5UQVRJT05fVklFVyA9ICdjYWxsaW5nL1NXSVRDSF9UT19QUkVTRU5UQVRJT05fVklFVyc7XG5jb25zdCBTV0lUQ0hfRlJPTV9QUkVTRU5UQVRJT05fVklFVyA9ICdjYWxsaW5nL1NXSVRDSF9GUk9NX1BSRVNFTlRBVElPTl9WSUVXJztcblxudHlwZSBBY2NlcHRDYWxsUGVuZGluZ0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL0FDQ0VQVF9DQUxMX1BFTkRJTkcnO1xuICBwYXlsb2FkOiBBY2NlcHRDYWxsVHlwZTtcbn07XG5cbnR5cGUgQ2FuY2VsQ2FsbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL0NBTkNFTF9DQUxMJztcbn07XG5cbnR5cGUgQ2FuY2VsSW5jb21pbmdHcm91cENhbGxSaW5nQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvQ0FOQ0VMX0lOQ09NSU5HX0dST1VQX0NBTExfUklORyc7XG4gIHBheWxvYWQ6IENhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZ1R5cGU7XG59O1xuXG50eXBlIFN0YXJ0Q2FsbGluZ0xvYmJ5QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvU1RBUlRfQ0FMTElOR19MT0JCWSc7XG4gIHBheWxvYWQ6IFN0YXJ0Q2FsbGluZ0xvYmJ5UGF5bG9hZFR5cGU7XG59O1xuXG50eXBlIENhbGxTdGF0ZUNoYW5nZUZ1bGZpbGxlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL0NBTExfU1RBVEVfQ0hBTkdFX0ZVTEZJTExFRCc7XG4gIHBheWxvYWQ6IENhbGxTdGF0ZUNoYW5nZVR5cGU7XG59O1xuXG50eXBlIENoYW5nZUlPRGV2aWNlRnVsZmlsbGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvQ0hBTkdFX0lPX0RFVklDRV9GVUxGSUxMRUQnO1xuICBwYXlsb2FkOiBDaGFuZ2VJT0RldmljZVBheWxvYWRUeXBlO1xufTtcblxudHlwZSBDbG9zZU5lZWRQZXJtaXNzaW9uU2NyZWVuQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvQ0xPU0VfTkVFRF9QRVJNSVNTSU9OX1NDUkVFTic7XG4gIHBheWxvYWQ6IG51bGw7XG59O1xuXG50eXBlIERlY2xpbmVDYWxsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvREVDTElORV9ESVJFQ1RfQ0FMTCc7XG4gIHBheWxvYWQ6IERlY2xpbmVDYWxsVHlwZTtcbn07XG5cbnR5cGUgR3JvdXBDYWxsQXVkaW9MZXZlbHNDaGFuZ2VBY3Rpb25QYXlsb2FkVHlwZSA9IFJlYWRvbmx5PHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgbG9jYWxBdWRpb0xldmVsOiBudW1iZXI7XG4gIHJlbW90ZURldmljZVN0YXRlczogUmVhZG9ubHlBcnJheTx7IGF1ZGlvTGV2ZWw6IG51bWJlcjsgZGVtdXhJZDogbnVtYmVyIH0+O1xufT47XG5cbnR5cGUgR3JvdXBDYWxsQXVkaW9MZXZlbHNDaGFuZ2VBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9HUk9VUF9DQUxMX0FVRElPX0xFVkVMU19DSEFOR0UnO1xuICBwYXlsb2FkOiBHcm91cENhbGxBdWRpb0xldmVsc0NoYW5nZUFjdGlvblBheWxvYWRUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgR3JvdXBDYWxsU3RhdGVDaGFuZ2VBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9HUk9VUF9DQUxMX1NUQVRFX0NIQU5HRSc7XG4gIHBheWxvYWQ6IEdyb3VwQ2FsbFN0YXRlQ2hhbmdlQWN0aW9uUGF5bG9hZFR5cGU7XG59O1xuXG50eXBlIEhhbmdVcEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL0hBTkdfVVAnO1xuICBwYXlsb2FkOiBIYW5nVXBBY3Rpb25QYXlsb2FkVHlwZTtcbn07XG5cbnR5cGUgSW5jb21pbmdEaXJlY3RDYWxsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvSU5DT01JTkdfRElSRUNUX0NBTEwnO1xuICBwYXlsb2FkOiBJbmNvbWluZ0RpcmVjdENhbGxUeXBlO1xufTtcblxudHlwZSBJbmNvbWluZ0dyb3VwQ2FsbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL0lOQ09NSU5HX0dST1VQX0NBTEwnO1xuICBwYXlsb2FkOiBJbmNvbWluZ0dyb3VwQ2FsbFR5cGU7XG59O1xuXG50eXBlIEtleUNoYW5nZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9NQVJLX0NBTExfVU5UUlVTVEVEJztcbiAgcGF5bG9hZDoge1xuICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogQXJyYXk8VVVJRFN0cmluZ1R5cGU+O1xuICB9O1xufTtcblxudHlwZSBLZXlDaGFuZ2VPa0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL01BUktfQ0FMTF9UUlVTVEVEJztcbiAgcGF5bG9hZDogbnVsbDtcbn07XG5cbnR5cGUgT3V0Z29pbmdDYWxsQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvT1VUR09JTkdfQ0FMTCc7XG4gIHBheWxvYWQ6IFN0YXJ0RGlyZWN0Q2FsbFR5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBQZWVrR3JvdXBDYWxsRnVsZmlsbGVkQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvUEVFS19HUk9VUF9DQUxMX0ZVTEZJTExFRCc7XG4gIHBheWxvYWQ6IHtcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICAgIHBlZWtJbmZvOiBHcm91cENhbGxQZWVrSW5mb1R5cGU7XG4gIH07XG59O1xuXG50eXBlIFJlZnJlc2hJT0RldmljZXNBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9SRUZSRVNIX0lPX0RFVklDRVMnO1xuICBwYXlsb2FkOiBNZWRpYURldmljZVNldHRpbmdzO1xufTtcblxudHlwZSBSZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvUkVNT1RFX1NIQVJJTkdfU0NSRUVOX0NIQU5HRSc7XG4gIHBheWxvYWQ6IFJlbW90ZVNoYXJpbmdTY3JlZW5DaGFuZ2VUeXBlO1xufTtcblxudHlwZSBSZW1vdGVWaWRlb0NoYW5nZUFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1JFTU9URV9WSURFT19DSEFOR0UnO1xuICBwYXlsb2FkOiBSZW1vdGVWaWRlb0NoYW5nZVR5cGU7XG59O1xuXG50eXBlIFJldHVyblRvQWN0aXZlQ2FsbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1JFVFVSTl9UT19BQ1RJVkVfQ0FMTCc7XG59O1xuXG50eXBlIFNldExvY2FsQXVkaW9BY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9TRVRfTE9DQUxfQVVESU9fRlVMRklMTEVEJztcbiAgcGF5bG9hZDogU2V0TG9jYWxBdWRpb1R5cGU7XG59O1xuXG50eXBlIFNldExvY2FsVmlkZW9GdWxmaWxsZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9TRVRfTE9DQUxfVklERU9fRlVMRklMTEVEJztcbiAgcGF5bG9hZDogU2V0TG9jYWxWaWRlb1R5cGU7XG59O1xuXG50eXBlIFNldFByZXNlbnRpbmdGdWxmaWxsZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnY2FsbGluZy9TRVRfUFJFU0VOVElORyc7XG4gIHBheWxvYWQ/OiBQcmVzZW50ZWRTb3VyY2U7XG59O1xuXG50eXBlIFNldFByZXNlbnRpbmdTb3VyY2VzQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvU0VUX1BSRVNFTlRJTkdfU09VUkNFUyc7XG4gIHBheWxvYWQ6IEFycmF5PFByZXNlbnRhYmxlU291cmNlPjtcbn07XG5cbnR5cGUgU2V0T3V0Z29pbmdSaW5nQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvU0VUX09VVEdPSU5HX1JJTkcnO1xuICBwYXlsb2FkOiBib29sZWFuO1xufTtcblxudHlwZSBTaG93Q2FsbExvYmJ5QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvU1RBUlRfQ0FMTElOR19MT0JCWSc7XG4gIHBheWxvYWQ6IFN0YXJ0Q2FsbGluZ0xvYmJ5UGF5bG9hZFR5cGU7XG59O1xuXG50eXBlIFN0YXJ0RGlyZWN0Q2FsbEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1NUQVJUX0RJUkVDVF9DQUxMJztcbiAgcGF5bG9hZDogU3RhcnREaXJlY3RDYWxsVHlwZTtcbn07XG5cbnR5cGUgVG9nZ2xlTmVlZHNTY3JlZW5SZWNvcmRpbmdQZXJtaXNzaW9uc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1RPR0dMRV9ORUVEU19TQ1JFRU5fUkVDT1JESU5HX1BFUk1JU1NJT05TJztcbn07XG5cbnR5cGUgVG9nZ2xlUGFydGljaXBhbnRzQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvVE9HR0xFX1BBUlRJQ0lQQU5UUyc7XG59O1xuXG50eXBlIFRvZ2dsZVBpcEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1RPR0dMRV9QSVAnO1xufTtcblxudHlwZSBUb2dnbGVTZXR0aW5nc0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1RPR0dMRV9TRVRUSU5HUyc7XG59O1xuXG50eXBlIFRvZ2dsZVNwZWFrZXJWaWV3QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvVE9HR0xFX1NQRUFLRVJfVklFVyc7XG59O1xuXG50eXBlIFN3aXRjaFRvUHJlc2VudGF0aW9uVmlld0FjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdjYWxsaW5nL1NXSVRDSF9UT19QUkVTRU5UQVRJT05fVklFVyc7XG59O1xuXG50eXBlIFN3aXRjaEZyb21QcmVzZW50YXRpb25WaWV3QWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ2NhbGxpbmcvU1dJVENIX0ZST01fUFJFU0VOVEFUSU9OX1ZJRVcnO1xufTtcblxuZXhwb3J0IHR5cGUgQ2FsbGluZ0FjdGlvblR5cGUgPVxuICB8IEFjY2VwdENhbGxQZW5kaW5nQWN0aW9uVHlwZVxuICB8IENhbmNlbENhbGxBY3Rpb25UeXBlXG4gIHwgQ2FuY2VsSW5jb21pbmdHcm91cENhbGxSaW5nQWN0aW9uVHlwZVxuICB8IFN0YXJ0Q2FsbGluZ0xvYmJ5QWN0aW9uVHlwZVxuICB8IENhbGxTdGF0ZUNoYW5nZUZ1bGZpbGxlZEFjdGlvblR5cGVcbiAgfCBDaGFuZ2VJT0RldmljZUZ1bGZpbGxlZEFjdGlvblR5cGVcbiAgfCBDbG9zZU5lZWRQZXJtaXNzaW9uU2NyZWVuQWN0aW9uVHlwZVxuICB8IENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlXG4gIHwgQ29udmVyc2F0aW9uUmVtb3ZlZEFjdGlvblR5cGVcbiAgfCBEZWNsaW5lQ2FsbEFjdGlvblR5cGVcbiAgfCBHcm91cENhbGxBdWRpb0xldmVsc0NoYW5nZUFjdGlvblR5cGVcbiAgfCBHcm91cENhbGxTdGF0ZUNoYW5nZUFjdGlvblR5cGVcbiAgfCBIYW5nVXBBY3Rpb25UeXBlXG4gIHwgSW5jb21pbmdEaXJlY3RDYWxsQWN0aW9uVHlwZVxuICB8IEluY29taW5nR3JvdXBDYWxsQWN0aW9uVHlwZVxuICB8IEtleUNoYW5nZWRBY3Rpb25UeXBlXG4gIHwgS2V5Q2hhbmdlT2tBY3Rpb25UeXBlXG4gIHwgT3V0Z29pbmdDYWxsQWN0aW9uVHlwZVxuICB8IFBlZWtHcm91cENhbGxGdWxmaWxsZWRBY3Rpb25UeXBlXG4gIHwgUmVmcmVzaElPRGV2aWNlc0FjdGlvblR5cGVcbiAgfCBSZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlQWN0aW9uVHlwZVxuICB8IFJlbW90ZVZpZGVvQ2hhbmdlQWN0aW9uVHlwZVxuICB8IFJldHVyblRvQWN0aXZlQ2FsbEFjdGlvblR5cGVcbiAgfCBTZXRMb2NhbEF1ZGlvQWN0aW9uVHlwZVxuICB8IFNldExvY2FsVmlkZW9GdWxmaWxsZWRBY3Rpb25UeXBlXG4gIHwgU2V0UHJlc2VudGluZ1NvdXJjZXNBY3Rpb25UeXBlXG4gIHwgU2V0T3V0Z29pbmdSaW5nQWN0aW9uVHlwZVxuICB8IFNob3dDYWxsTG9iYnlBY3Rpb25UeXBlXG4gIHwgU3RhcnREaXJlY3RDYWxsQWN0aW9uVHlwZVxuICB8IFRvZ2dsZU5lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNBY3Rpb25UeXBlXG4gIHwgVG9nZ2xlUGFydGljaXBhbnRzQWN0aW9uVHlwZVxuICB8IFRvZ2dsZVBpcEFjdGlvblR5cGVcbiAgfCBTZXRQcmVzZW50aW5nRnVsZmlsbGVkQWN0aW9uVHlwZVxuICB8IFRvZ2dsZVNldHRpbmdzQWN0aW9uVHlwZVxuICB8IFRvZ2dsZVNwZWFrZXJWaWV3QWN0aW9uVHlwZVxuICB8IFN3aXRjaFRvUHJlc2VudGF0aW9uVmlld0FjdGlvblR5cGVcbiAgfCBTd2l0Y2hGcm9tUHJlc2VudGF0aW9uVmlld0FjdGlvblR5cGU7XG5cbi8vIEFjdGlvbiBDcmVhdG9yc1xuXG5mdW5jdGlvbiBhY2NlcHRDYWxsKFxuICBwYXlsb2FkOiBBY2NlcHRDYWxsVHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgQWNjZXB0Q2FsbFBlbmRpbmdBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgYXNWaWRlb0NhbGwgfSA9IHBheWxvYWQ7XG5cbiAgICBjb25zdCBjYWxsID0gZ2V0T3duKGdldFN0YXRlKCkuY2FsbGluZy5jYWxsc0J5Q29udmVyc2F0aW9uLCBjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjYWxsKSB7XG4gICAgICBsb2cuZXJyb3IoJ1RyeWluZyB0byBhY2NlcHQgYSBub24tZXhpc3RlbnQgY2FsbCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoY2FsbC5jYWxsTW9kZSkge1xuICAgICAgY2FzZSBDYWxsTW9kZS5EaXJlY3Q6XG4gICAgICAgIGF3YWl0IGNhbGxpbmcuYWNjZXB0RGlyZWN0Q2FsbChjb252ZXJzYXRpb25JZCwgYXNWaWRlb0NhbGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ2FsbE1vZGUuR3JvdXA6XG4gICAgICAgIGF3YWl0IGNhbGxpbmcuam9pbkdyb3VwQ2FsbChjb252ZXJzYXRpb25JZCwgdHJ1ZSwgYXNWaWRlb0NhbGwsIGZhbHNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKGNhbGwpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEFDQ0VQVF9DQUxMX1BFTkRJTkcsXG4gICAgICBwYXlsb2FkLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxsU3RhdGVDaGFuZ2UoXG4gIHBheWxvYWQ6IENhbGxTdGF0ZUNoYW5nZVR5cGVcbik6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICBDYWxsU3RhdGVDaGFuZ2VGdWxmaWxsZWRBY3Rpb25UeXBlXG4+IHtcbiAgcmV0dXJuIGFzeW5jIGRpc3BhdGNoID0+IHtcbiAgICBjb25zdCB7IGNhbGxTdGF0ZSB9ID0gcGF5bG9hZDtcbiAgICBpZiAoY2FsbFN0YXRlID09PSBDYWxsU3RhdGUuRW5kZWQpIHtcbiAgICAgIGF3YWl0IGNhbGxpbmdUb25lcy5wbGF5RW5kQ2FsbCgpO1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnY2xvc2Utc2NyZWVuLXNoYXJlLWNvbnRyb2xsZXInKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBDQUxMX1NUQVRFX0NIQU5HRV9GVUxGSUxMRUQsXG4gICAgICBwYXlsb2FkLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VJT0RldmljZShcbiAgcGF5bG9hZDogQ2hhbmdlSU9EZXZpY2VQYXlsb2FkVHlwZVxuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIENoYW5nZUlPRGV2aWNlRnVsZmlsbGVkQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyBkaXNwYXRjaCA9PiB7XG4gICAgLy8gT25seSBgc2V0UHJlZmVycmVkQ2FtZXJhYCByZXR1cm5zIGEgUHJvbWlzZS5cbiAgICBpZiAocGF5bG9hZC50eXBlID09PSBDYWxsaW5nRGV2aWNlVHlwZS5DQU1FUkEpIHtcbiAgICAgIGF3YWl0IGNhbGxpbmcuc2V0UHJlZmVycmVkQ2FtZXJhKHBheWxvYWQuc2VsZWN0ZWREZXZpY2UpO1xuICAgIH0gZWxzZSBpZiAocGF5bG9hZC50eXBlID09PSBDYWxsaW5nRGV2aWNlVHlwZS5NSUNST1BIT05FKSB7XG4gICAgICBjYWxsaW5nLnNldFByZWZlcnJlZE1pY3JvcGhvbmUocGF5bG9hZC5zZWxlY3RlZERldmljZSk7XG4gICAgfSBlbHNlIGlmIChwYXlsb2FkLnR5cGUgPT09IENhbGxpbmdEZXZpY2VUeXBlLlNQRUFLRVIpIHtcbiAgICAgIGNhbGxpbmcuc2V0UHJlZmVycmVkU3BlYWtlcihwYXlsb2FkLnNlbGVjdGVkRGV2aWNlKTtcbiAgICB9XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQ0hBTkdFX0lPX0RFVklDRV9GVUxGSUxMRUQsXG4gICAgICBwYXlsb2FkLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbG9zZU5lZWRQZXJtaXNzaW9uU2NyZWVuKCk6IENsb3NlTmVlZFBlcm1pc3Npb25TY3JlZW5BY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBDTE9TRV9ORUVEX1BFUk1JU1NJT05fU0NSRUVOLFxuICAgIHBheWxvYWQ6IG51bGwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhbmNlbENhbGwocGF5bG9hZDogQ2FuY2VsQ2FsbFR5cGUpOiBDYW5jZWxDYWxsQWN0aW9uVHlwZSB7XG4gIGNhbGxpbmcuc3RvcENhbGxpbmdMb2JieShwYXlsb2FkLmNvbnZlcnNhdGlvbklkKTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6IENBTkNFTF9DQUxMLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjYW5jZWxJbmNvbWluZ0dyb3VwQ2FsbFJpbmcoXG4gIHBheWxvYWQ6IENhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZ1R5cGVcbik6IENhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZ0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IENBTkNFTF9JTkNPTUlOR19HUk9VUF9DQUxMX1JJTkcsXG4gICAgcGF5bG9hZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVjbGluZUNhbGwoXG4gIHBheWxvYWQ6IERlY2xpbmVDYWxsVHlwZVxuKTogVGh1bmtBY3Rpb248XG4gIHZvaWQsXG4gIFJvb3RTdGF0ZVR5cGUsXG4gIHVua25vd24sXG4gIENhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZ0FjdGlvblR5cGUgfCBEZWNsaW5lQ2FsbEFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQgfSA9IHBheWxvYWQ7XG5cbiAgICBjb25zdCBjYWxsID0gZ2V0T3duKGdldFN0YXRlKCkuY2FsbGluZy5jYWxsc0J5Q29udmVyc2F0aW9uLCBjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjYWxsKSB7XG4gICAgICBsb2cuZXJyb3IoJ1RyeWluZyB0byBkZWNsaW5lIGEgbm9uLWV4aXN0ZW50IGNhbGwnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNhbGwuY2FsbE1vZGUpIHtcbiAgICAgIGNhc2UgQ2FsbE1vZGUuRGlyZWN0OlxuICAgICAgICBjYWxsaW5nLmRlY2xpbmVEaXJlY3RDYWxsKGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IERFQ0xJTkVfRElSRUNUX0NBTEwsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDYWxsTW9kZS5Hcm91cDoge1xuICAgICAgICBjb25zdCB7IHJpbmdJZCB9ID0gY2FsbDtcbiAgICAgICAgaWYgKHJpbmdJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbG9nLmVycm9yKCdUcnlpbmcgdG8gZGVjbGluZSBhIGdyb3VwIGNhbGwgd2l0aG91dCBhIHJpbmcgSUQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsaW5nLmRlY2xpbmVHcm91cENhbGwoY29udmVyc2F0aW9uSWQsIHJpbmdJZCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogQ0FOQ0VMX0lOQ09NSU5HX0dST1VQX0NBTExfUklORyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHsgY29udmVyc2F0aW9uSWQsIHJpbmdJZCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbWlzc2luZ0Nhc2VFcnJvcihjYWxsKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFByZXNlbnRpbmdTb3VyY2VzKCk6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICB8IFNldFByZXNlbnRpbmdTb3VyY2VzQWN0aW9uVHlwZVxuICB8IFRvZ2dsZU5lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNBY3Rpb25UeXBlXG4+IHtcbiAgcmV0dXJuIGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAvLyBXZSBjaGVjayBpZiB0aGUgdXNlciBoYXMgcGVybWlzc2lvbnMgZmlyc3QgYmVmb3JlIGNhbGxpbmcgZGVza3RvcENhcHR1cmVyXG4gICAgLy8gTmV4dCB3ZSBjYWxsIGdldFByZXNlbnRpbmdTb3VyY2VzIHNvIHRoYXQgb25lIGdldHMgdGhlIHByb21wdCBmb3IgcGVybWlzc2lvbnMsXG4gICAgLy8gaWYgbmVjZXNzYXJ5LlxuICAgIC8vIEZpbmFsbHksIHdlIGhhdmUgdGhlIGlmIHN0YXRlbWVudCB3aGljaCBzaG93cyB0aGUgbW9kYWwsIGlmIG5lZWRlZC5cbiAgICAvLyBJdCBpcyBpbiB0aGlzIGV4YWN0IG9yZGVyIHNvIHRoYXQgZHVyaW5nIGZpcnN0LXRpbWUtdXNlIG9uZSB3aWxsIGJlXG4gICAgLy8gcHJvbXB0ZWQgZm9yIHBlcm1pc3Npb25zIGFuZCBpZiB0aGV5IHNvIGhhcHBlbiB0byBkZW55IHdlIGNhbiBzdGlsbFxuICAgIC8vIGNhcHR1cmUgdGhhdCBzdGF0ZSBjb3JyZWN0bHkuXG4gICAgY29uc3QgcGxhdGZvcm0gPSBnZXRQbGF0Zm9ybShnZXRTdGF0ZSgpKTtcbiAgICBjb25zdCBuZWVkc1Blcm1pc3Npb24gPVxuICAgICAgcGxhdGZvcm0gPT09ICdkYXJ3aW4nICYmICFoYXNTY3JlZW5DYXB0dXJlUGVybWlzc2lvbigpO1xuXG4gICAgY29uc3Qgc291cmNlcyA9IGF3YWl0IGNhbGxpbmcuZ2V0UHJlc2VudGluZ1NvdXJjZXMoKTtcblxuICAgIGlmIChuZWVkc1Blcm1pc3Npb24pIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogVE9HR0xFX05FRURTX1NDUkVFTl9SRUNPUkRJTkdfUEVSTUlTU0lPTlMsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBTRVRfUFJFU0VOVElOR19TT1VSQ0VTLFxuICAgICAgcGF5bG9hZDogc291cmNlcyxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBDYWxsQXVkaW9MZXZlbHNDaGFuZ2UoXG4gIHBheWxvYWQ6IEdyb3VwQ2FsbEF1ZGlvTGV2ZWxzQ2hhbmdlQWN0aW9uUGF5bG9hZFR5cGVcbik6IEdyb3VwQ2FsbEF1ZGlvTGV2ZWxzQ2hhbmdlQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7IHR5cGU6IEdST1VQX0NBTExfQVVESU9fTEVWRUxTX0NIQU5HRSwgcGF5bG9hZCB9O1xufVxuXG5mdW5jdGlvbiBncm91cENhbGxTdGF0ZUNoYW5nZShcbiAgcGF5bG9hZDogR3JvdXBDYWxsU3RhdGVDaGFuZ2VBcmd1bWVudFR5cGVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIEdyb3VwQ2FsbFN0YXRlQ2hhbmdlQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGxldCBkaWRTb21lb25lU3RhcnRQcmVzZW50aW5nOiBib29sZWFuO1xuICAgIGNvbnN0IGFjdGl2ZUNhbGwgPSBnZXRBY3RpdmVDYWxsKGdldFN0YXRlKCkuY2FsbGluZyk7XG4gICAgaWYgKGFjdGl2ZUNhbGw/LmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCkge1xuICAgICAgY29uc3Qgd2FzU29tZW9uZVByZXNlbnRpbmcgPSBhY3RpdmVDYWxsLnJlbW90ZVBhcnRpY2lwYW50cy5zb21lKFxuICAgICAgICBwYXJ0aWNpcGFudCA9PiBwYXJ0aWNpcGFudC5wcmVzZW50aW5nXG4gICAgICApO1xuICAgICAgY29uc3QgaXNTb21lb25lUHJlc2VudGluZyA9IHBheWxvYWQucmVtb3RlUGFydGljaXBhbnRzLnNvbWUoXG4gICAgICAgIHBhcnRpY2lwYW50ID0+IHBhcnRpY2lwYW50LnByZXNlbnRpbmdcbiAgICAgICk7XG4gICAgICBkaWRTb21lb25lU3RhcnRQcmVzZW50aW5nID0gIXdhc1NvbWVvbmVQcmVzZW50aW5nICYmIGlzU29tZW9uZVByZXNlbnRpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpZFNvbWVvbmVTdGFydFByZXNlbnRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG91ckFDSTogb3VyVXVpZCB9ID0gZ2V0U3RhdGUoKS51c2VyO1xuICAgIHN0cmljdEFzc2VydChvdXJVdWlkLCAnZ3JvdXBDYWxsU3RhdGVDaGFuZ2UgZmFpbGVkIHRvIGZldGNoIG91ciB1dWlkJyk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBHUk9VUF9DQUxMX1NUQVRFX0NIQU5HRSxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgb3VyVXVpZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoZGlkU29tZW9uZVN0YXJ0UHJlc2VudGluZykge1xuICAgICAgY2FsbGluZ1RvbmVzLnNvbWVvbmVQcmVzZW50aW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHBheWxvYWQuY29ubmVjdGlvblN0YXRlID09PSBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuTm90Q29ubmVjdGVkKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdjbG9zZS1zY3JlZW4tc2hhcmUtY29udHJvbGxlcicpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZ1VwQWN0aXZlQ2FsbCgpOiBUaHVua0FjdGlvbjxcbiAgdm9pZCxcbiAgUm9vdFN0YXRlVHlwZSxcbiAgdW5rbm93bixcbiAgSGFuZ1VwQWN0aW9uVHlwZVxuPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuXG4gICAgY29uc3QgYWN0aXZlQ2FsbCA9IGdldEFjdGl2ZUNhbGwoc3RhdGUuY2FsbGluZyk7XG4gICAgaWYgKCFhY3RpdmVDYWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gYWN0aXZlQ2FsbDtcblxuICAgIGNhbGxpbmcuaGFuZ3VwKGNvbnZlcnNhdGlvbklkKTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEhBTkdfVVAsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmIChhY3RpdmVDYWxsLmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCkge1xuICAgICAgLy8gV2Ugd2FudCB0byBnaXZlIHRoZSBncm91cCBjYWxsIHRpbWUgdG8gZGlzY29ubmVjdC5cbiAgICAgIGF3YWl0IHNsZWVwKDEwMDApO1xuICAgICAgZG9Hcm91cENhbGxQZWVrKGNvbnZlcnNhdGlvbklkLCBkaXNwYXRjaCwgZ2V0U3RhdGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24ga2V5Q2hhbmdlZChcbiAgcGF5bG9hZDogS2V5Q2hhbmdlZFR5cGVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIEtleUNoYW5nZWRBY3Rpb25UeXBlPiB7XG4gIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZS5jYWxsaW5nO1xuXG4gICAgY29uc3QgYWN0aXZlQ2FsbCA9IGdldEFjdGl2ZUNhbGwoc3RhdGUuY2FsbGluZyk7XG4gICAgaWYgKCFhY3RpdmVDYWxsIHx8ICFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlQ2FsbC5jYWxsTW9kZSA9PT0gQ2FsbE1vZGUuR3JvdXApIHtcbiAgICAgIGNvbnN0IHV1aWRzQ2hhbmdlZCA9IG5ldyBTZXQoYWN0aXZlQ2FsbFN0YXRlLnNhZmV0eU51bWJlckNoYW5nZWRVdWlkcyk7XG5cbiAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIHBhcnRpY2lwYW50IHRvIGVuc3VyZSB0aGF0IHRoZSB1dWlkIHBhc3NlZCBpblxuICAgICAgLy8gbWF0Y2hlcyBvbmUgb2YgdGhlIHBhcnRpY2lwYW50cyBpbiB0aGUgZ3JvdXAgY2FsbC5cbiAgICAgIGFjdGl2ZUNhbGwucmVtb3RlUGFydGljaXBhbnRzLmZvckVhY2gocGFydGljaXBhbnQgPT4ge1xuICAgICAgICBpZiAocGFydGljaXBhbnQudXVpZCA9PT0gcGF5bG9hZC51dWlkKSB7XG4gICAgICAgICAgdXVpZHNDaGFuZ2VkLmFkZChwYXJ0aWNpcGFudC51dWlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNhZmV0eU51bWJlckNoYW5nZWRVdWlkcyA9IEFycmF5LmZyb20odXVpZHNDaGFuZ2VkKTtcblxuICAgICAgaWYgKHNhZmV0eU51bWJlckNoYW5nZWRVdWlkcy5sZW5ndGgpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IE1BUktfQ0FMTF9VTlRSVVNURUQsXG4gICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgc2FmZXR5TnVtYmVyQ2hhbmdlZFV1aWRzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24ga2V5Q2hhbmdlT2soXG4gIHBheWxvYWQ6IEtleUNoYW5nZU9rVHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgS2V5Q2hhbmdlT2tBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBkaXNwYXRjaCA9PiB7XG4gICAgY2FsbGluZy5yZXNlbmRHcm91cENhbGxNZWRpYUtleXMocGF5bG9hZC5jb252ZXJzYXRpb25JZCk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBNQVJLX0NBTExfVFJVU1RFRCxcbiAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVJbmNvbWluZ0RpcmVjdENhbGwoXG4gIHBheWxvYWQ6IEluY29taW5nRGlyZWN0Q2FsbFR5cGVcbik6IEluY29taW5nRGlyZWN0Q2FsbEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IElOQ09NSU5HX0RJUkVDVF9DQUxMLFxuICAgIHBheWxvYWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVJbmNvbWluZ0dyb3VwQ2FsbChcbiAgcGF5bG9hZDogSW5jb21pbmdHcm91cENhbGxUeXBlXG4pOiBJbmNvbWluZ0dyb3VwQ2FsbEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IElOQ09NSU5HX0dST1VQX0NBTEwsXG4gICAgcGF5bG9hZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gb3BlblN5c3RlbVByZWZlcmVuY2VzQWN0aW9uKCk6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICBuZXZlclxuPiB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgb3BlblN5c3RlbVByZWZlcmVuY2VzKCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG91dGdvaW5nQ2FsbChwYXlsb2FkOiBTdGFydERpcmVjdENhbGxUeXBlKTogT3V0Z29pbmdDYWxsQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogT1VUR09JTkdfQ0FMTCxcbiAgICBwYXlsb2FkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwZWVrR3JvdXBDYWxsRm9yVGhlRmlyc3RUaW1lKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBQZWVrR3JvdXBDYWxsRnVsZmlsbGVkQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGNhbGwgPSBnZXRPd24oZ2V0U3RhdGUoKS5jYWxsaW5nLmNhbGxzQnlDb252ZXJzYXRpb24sIGNvbnZlcnNhdGlvbklkKTtcbiAgICBjb25zdCBzaG91bGRQZWVrID1cbiAgICAgICFjYWxsIHx8IChjYWxsLmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCAmJiAhY2FsbC5wZWVrSW5mbyk7XG4gICAgaWYgKHNob3VsZFBlZWspIHtcbiAgICAgIGRvR3JvdXBDYWxsUGVlayhjb252ZXJzYXRpb25JZCwgZGlzcGF0Y2gsIGdldFN0YXRlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBlZWtHcm91cENhbGxJZkl0SGFzTWVtYmVycyhcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUGVla0dyb3VwQ2FsbEZ1bGZpbGxlZEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCBjYWxsID0gZ2V0T3duKGdldFN0YXRlKCkuY2FsbGluZy5jYWxsc0J5Q29udmVyc2F0aW9uLCBjb252ZXJzYXRpb25JZCk7XG4gICAgY29uc3Qgc2hvdWxkUGVlayA9XG4gICAgICBjYWxsICYmXG4gICAgICBjYWxsLmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCAmJlxuICAgICAgY2FsbC5qb2luU3RhdGUgPT09IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQgJiZcbiAgICAgIGNhbGwucGVla0luZm8gJiZcbiAgICAgIGNhbGwucGVla0luZm8uZGV2aWNlQ291bnQgPiAwO1xuICAgIGlmIChzaG91bGRQZWVrKSB7XG4gICAgICBkb0dyb3VwQ2FsbFBlZWsoY29udmVyc2F0aW9uSWQsIGRpc3BhdGNoLCBnZXRTdGF0ZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBwZWVrTm90Q29ubmVjdGVkR3JvdXBDYWxsKFxuICBwYXlsb2FkOiBQZWVrTm90Q29ubmVjdGVkR3JvdXBDYWxsVHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgUGVla0dyb3VwQ2FsbEZ1bGZpbGxlZEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCB7IGNvbnZlcnNhdGlvbklkIH0gPSBwYXlsb2FkO1xuICAgIGRvR3JvdXBDYWxsUGVlayhjb252ZXJzYXRpb25JZCwgZGlzcGF0Y2gsIGdldFN0YXRlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaElPRGV2aWNlcyhcbiAgcGF5bG9hZDogTWVkaWFEZXZpY2VTZXR0aW5nc1xuKTogUmVmcmVzaElPRGV2aWNlc0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFRlJFU0hfSU9fREVWSUNFUyxcbiAgICBwYXlsb2FkLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlKFxuICBwYXlsb2FkOiBSZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlVHlwZVxuKTogUmVtb3RlU2hhcmluZ1NjcmVlbkNoYW5nZUFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFTU9URV9TSEFSSU5HX1NDUkVFTl9DSEFOR0UsXG4gICAgcGF5bG9hZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVtb3RlVmlkZW9DaGFuZ2UoXG4gIHBheWxvYWQ6IFJlbW90ZVZpZGVvQ2hhbmdlVHlwZVxuKTogUmVtb3RlVmlkZW9DaGFuZ2VBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRU1PVEVfVklERU9fQ0hBTkdFLFxuICAgIHBheWxvYWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldHVyblRvQWN0aXZlQ2FsbCgpOiBSZXR1cm5Ub0FjdGl2ZUNhbGxBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRVRVUk5fVE9fQUNUSVZFX0NBTEwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldElzQ2FsbEFjdGl2ZShcbiAgaXNDYWxsQWN0aXZlOiBib29sZWFuXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBuZXZlcj4ge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHdpbmRvdy5TaWduYWxDb250ZXh0LnNldElzQ2FsbEFjdGl2ZShpc0NhbGxBY3RpdmUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRMb2NhbFByZXZpZXcoXG4gIHBheWxvYWQ6IFNldExvY2FsUHJldmlld1R5cGVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIG5ldmVyPiB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY2FsbGluZy52aWRlb0NhcHR1cmVyLnNldExvY2FsUHJldmlldyhwYXlsb2FkLmVsZW1lbnQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRSZW5kZXJlckNhbnZhcyhcbiAgcGF5bG9hZDogU2V0UmVuZGVyZXJDYW52YXNUeXBlXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBuZXZlcj4ge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGNhbGxpbmcudmlkZW9SZW5kZXJlci5zZXRDYW52YXMocGF5bG9hZC5lbGVtZW50KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0TG9jYWxBdWRpbyhcbiAgcGF5bG9hZDogU2V0TG9jYWxBdWRpb1R5cGVcbik6IFRodW5rQWN0aW9uPHZvaWQsIFJvb3RTdGF0ZVR5cGUsIHVua25vd24sIFNldExvY2FsQXVkaW9BY3Rpb25UeXBlPiB7XG4gIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgY29uc3QgYWN0aXZlQ2FsbCA9IGdldEFjdGl2ZUNhbGwoZ2V0U3RhdGUoKS5jYWxsaW5nKTtcbiAgICBpZiAoIWFjdGl2ZUNhbGwpIHtcbiAgICAgIGxvZy53YXJuKCdUcnlpbmcgdG8gc2V0IGxvY2FsIGF1ZGlvIHdoZW4gbm8gY2FsbCBpcyBhY3RpdmUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWxsaW5nLnNldE91dGdvaW5nQXVkaW8oYWN0aXZlQ2FsbC5jb252ZXJzYXRpb25JZCwgcGF5bG9hZC5lbmFibGVkKTtcblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFNFVF9MT0NBTF9BVURJT19GVUxGSUxMRUQsXG4gICAgICBwYXlsb2FkLFxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRMb2NhbFZpZGVvKFxuICBwYXlsb2FkOiBTZXRMb2NhbFZpZGVvVHlwZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgU2V0TG9jYWxWaWRlb0Z1bGZpbGxlZEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCBhY3RpdmVDYWxsID0gZ2V0QWN0aXZlQ2FsbChnZXRTdGF0ZSgpLmNhbGxpbmcpO1xuICAgIGlmICghYWN0aXZlQ2FsbCkge1xuICAgICAgbG9nLndhcm4oJ1RyeWluZyB0byBzZXQgbG9jYWwgdmlkZW8gd2hlbiBubyBjYWxsIGlzIGFjdGl2ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBlbmFibGVkOiBib29sZWFuO1xuICAgIGlmIChhd2FpdCByZXF1ZXN0Q2FtZXJhUGVybWlzc2lvbnMoKSkge1xuICAgICAgaWYgKFxuICAgICAgICBhY3RpdmVDYWxsLmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCB8fFxuICAgICAgICAoYWN0aXZlQ2FsbC5jYWxsTW9kZSA9PT0gQ2FsbE1vZGUuRGlyZWN0ICYmIGFjdGl2ZUNhbGwuY2FsbFN0YXRlKVxuICAgICAgKSB7XG4gICAgICAgIGNhbGxpbmcuc2V0T3V0Z29pbmdWaWRlbyhhY3RpdmVDYWxsLmNvbnZlcnNhdGlvbklkLCBwYXlsb2FkLmVuYWJsZWQpO1xuICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLmVuYWJsZWQpIHtcbiAgICAgICAgY2FsbGluZy5lbmFibGVMb2NhbENhbWVyYSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGluZy5kaXNhYmxlTG9jYWxWaWRlbygpO1xuICAgICAgfVxuICAgICAgKHsgZW5hYmxlZCB9ID0gcGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBTRVRfTE9DQUxfVklERU9fRlVMRklMTEVELFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICBlbmFibGVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0R3JvdXBDYWxsVmlkZW9SZXF1ZXN0KFxuICBwYXlsb2FkOiBTZXRHcm91cENhbGxWaWRlb1JlcXVlc3RUeXBlXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBuZXZlcj4ge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGNhbGxpbmcuc2V0R3JvdXBDYWxsVmlkZW9SZXF1ZXN0KFxuICAgICAgcGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgIHBheWxvYWQucmVzb2x1dGlvbnMubWFwKHJlc29sdXRpb24gPT4gKHtcbiAgICAgICAgLi4ucmVzb2x1dGlvbixcbiAgICAgICAgLy8gVGhlIGBmcmFtZXJhdGVgIHByb3BlcnR5IGluIFJpbmdSVEMgaGFzIHRvIGJlIHNldCwgZXZlbiBpZiBpdCdzIHNldCB0b1xuICAgICAgICAvLyAgIGB1bmRlZmluZWRgLlxuICAgICAgICBmcmFtZXJhdGU6IHVuZGVmaW5lZCxcbiAgICAgIH0pKVxuICAgICk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldFByZXNlbnRpbmcoXG4gIHNvdXJjZVRvUHJlc2VudD86IFByZXNlbnRlZFNvdXJjZVxuKTogVGh1bmtBY3Rpb248dm9pZCwgUm9vdFN0YXRlVHlwZSwgdW5rbm93biwgU2V0UHJlc2VudGluZ0Z1bGZpbGxlZEFjdGlvblR5cGU+IHtcbiAgcmV0dXJuIGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCBjYWxsaW5nU3RhdGUgPSBnZXRTdGF0ZSgpLmNhbGxpbmc7XG4gICAgY29uc3QgeyBhY3RpdmVDYWxsU3RhdGUgfSA9IGNhbGxpbmdTdGF0ZTtcbiAgICBjb25zdCBhY3RpdmVDYWxsID0gZ2V0QWN0aXZlQ2FsbChjYWxsaW5nU3RhdGUpO1xuICAgIGlmICghYWN0aXZlQ2FsbCB8fCAhYWN0aXZlQ2FsbFN0YXRlKSB7XG4gICAgICBsb2cud2FybignVHJ5aW5nIHRvIHByZXNlbnQgd2hlbiBubyBjYWxsIGlzIGFjdGl2ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhbGxpbmcuc2V0UHJlc2VudGluZyhcbiAgICAgIGFjdGl2ZUNhbGwuY29udmVyc2F0aW9uSWQsXG4gICAgICBhY3RpdmVDYWxsU3RhdGUuaGFzTG9jYWxWaWRlbyxcbiAgICAgIHNvdXJjZVRvUHJlc2VudFxuICAgICk7XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBTRVRfUFJFU0VOVElORyxcbiAgICAgIHBheWxvYWQ6IHNvdXJjZVRvUHJlc2VudCxcbiAgICB9KTtcblxuICAgIGlmIChzb3VyY2VUb1ByZXNlbnQpIHtcbiAgICAgIGF3YWl0IGNhbGxpbmdUb25lcy5zb21lb25lUHJlc2VudGluZygpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0T3V0Z29pbmdSaW5nKHBheWxvYWQ6IGJvb2xlYW4pOiBTZXRPdXRnb2luZ1JpbmdBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTRVRfT1VUR09JTkdfUklORyxcbiAgICBwYXlsb2FkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGFydENhbGxpbmdMb2JieSh7XG4gIGNvbnZlcnNhdGlvbklkLFxuICBpc1ZpZGVvQ2FsbCxcbn06IFN0YXJ0Q2FsbGluZ0xvYmJ5VHlwZSk6IFRodW5rQWN0aW9uPFxuICB2b2lkLFxuICBSb290U3RhdGVUeXBlLFxuICB1bmtub3duLFxuICBTdGFydENhbGxpbmdMb2JieUFjdGlvblR5cGVcbj4ge1xuICByZXR1cm4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRPd24oXG4gICAgICBzdGF0ZS5jb252ZXJzYXRpb25zLmNvbnZlcnNhdGlvbkxvb2t1cCxcbiAgICAgIGNvbnZlcnNhdGlvbklkXG4gICAgKTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBjb252ZXJzYXRpb24sXG4gICAgICBcInN0YXJ0Q2FsbGluZ0xvYmJ5OiBjYW4ndCBzdGFydCBsb2JieSB3aXRob3V0IGEgY29udmVyc2F0aW9uXCJcbiAgICApO1xuXG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgIXN0YXRlLmNhbGxpbmcuYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgXCJzdGFydENhbGxpbmdMb2JieTogY2FuJ3Qgc3RhcnQgbG9iYnkgaWYgYSBjYWxsIGlzIGFjdGl2ZVwiXG4gICAgKTtcblxuICAgIC8vIFRoZSBncm91cCBjYWxsIGRldmljZSBjb3VudCBpcyBjb25zaWRlcmVkIDAgZm9yIGEgZGlyZWN0IGNhbGwuXG4gICAgY29uc3QgZ3JvdXBDYWxsID0gZ2V0R3JvdXBDYWxsKGNvbnZlcnNhdGlvbklkLCBzdGF0ZS5jYWxsaW5nKTtcbiAgICBjb25zdCBncm91cENhbGxEZXZpY2VDb3VudCA9XG4gICAgICBncm91cENhbGw/LnBlZWtJbmZvPy5kZXZpY2VDb3VudCB8fFxuICAgICAgZ3JvdXBDYWxsPy5yZW1vdGVQYXJ0aWNpcGFudHMubGVuZ3RoIHx8XG4gICAgICAwO1xuXG4gICAgY29uc3QgY2FsbExvYmJ5RGF0YSA9IGF3YWl0IGNhbGxpbmcuc3RhcnRDYWxsaW5nTG9iYnkoe1xuICAgICAgY29udmVyc2F0aW9uLFxuICAgICAgaGFzTG9jYWxBdWRpbzogZ3JvdXBDYWxsRGV2aWNlQ291bnQgPCA4LFxuICAgICAgaGFzTG9jYWxWaWRlbzogaXNWaWRlb0NhbGwsXG4gICAgfSk7XG4gICAgaWYgKCFjYWxsTG9iYnlEYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogU1RBUlRfQ0FMTElOR19MT0JCWSxcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgLi4uY2FsbExvYmJ5RGF0YSxcbiAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIGlzQ29udmVyc2F0aW9uVG9vQmlnVG9SaW5nOiBpc0NvbnZlcnNhdGlvblRvb0JpZ1RvUmluZyhjb252ZXJzYXRpb24pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RhcnRDYWxsKFxuICBwYXlsb2FkOiBTdGFydENhbGxUeXBlXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBTdGFydERpcmVjdENhbGxBY3Rpb25UeXBlPiB7XG4gIHJldHVybiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XG4gICAgc3dpdGNoIChwYXlsb2FkLmNhbGxNb2RlKSB7XG4gICAgICBjYXNlIENhbGxNb2RlLkRpcmVjdDpcbiAgICAgICAgYXdhaXQgY2FsbGluZy5zdGFydE91dGdvaW5nRGlyZWN0Q2FsbChcbiAgICAgICAgICBwYXlsb2FkLmNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIHBheWxvYWQuaGFzTG9jYWxBdWRpbyxcbiAgICAgICAgICBwYXlsb2FkLmhhc0xvY2FsVmlkZW9cbiAgICAgICAgKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFNUQVJUX0RJUkVDVF9DQUxMLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ2FsbE1vZGUuR3JvdXA6IHtcbiAgICAgICAgbGV0IG91dGdvaW5nUmluZzogYm9vbGVhbjtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZS5jYWxsaW5nO1xuICAgICAgICBpZiAoaXNHcm91cENhbGxPdXRib3VuZFJpbmdFbmFibGVkKCkgJiYgYWN0aXZlQ2FsbFN0YXRlPy5vdXRnb2luZ1JpbmcpIHtcbiAgICAgICAgICBjb25zdCBjb252ZXJzYXRpb24gPSBnZXRPd24oXG4gICAgICAgICAgICBzdGF0ZS5jb252ZXJzYXRpb25zLmNvbnZlcnNhdGlvbkxvb2t1cCxcbiAgICAgICAgICAgIGFjdGl2ZUNhbGxTdGF0ZS5jb252ZXJzYXRpb25JZFxuICAgICAgICAgICk7XG4gICAgICAgICAgb3V0Z29pbmdSaW5nID0gQm9vbGVhbihcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbiAmJiAhaXNDb252ZXJzYXRpb25Ub29CaWdUb1JpbmcoY29udmVyc2F0aW9uKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0Z29pbmdSaW5nID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBjYWxsaW5nLmpvaW5Hcm91cENhbGwoXG4gICAgICAgICAgcGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgICBwYXlsb2FkLmhhc0xvY2FsQXVkaW8sXG4gICAgICAgICAgcGF5bG9hZC5oYXNMb2NhbFZpZGVvLFxuICAgICAgICAgIG91dGdvaW5nUmluZ1xuICAgICAgICApO1xuICAgICAgICAvLyBUaGUgY2FsbGluZyBzZXJ2aWNlIHNob3VsZCBhbHJlYWR5IGJlIHdpcmVkIHVwIHRvIFJlZHV4IHNvIHdlIGRvbid0IG5lZWQgdG9cbiAgICAgICAgLy8gICBkaXNwYXRjaCBhbnl0aGluZyBoZXJlLlxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IocGF5bG9hZC5jYWxsTW9kZSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVQYXJ0aWNpcGFudHMoKTogVG9nZ2xlUGFydGljaXBhbnRzQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVE9HR0xFX1BBUlRJQ0lQQU5UUyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlUGlwKCk6IFRvZ2dsZVBpcEFjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFRPR0dMRV9QSVAsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVNjcmVlblJlY29yZGluZ1Blcm1pc3Npb25zRGlhbG9nKCk6IFRvZ2dsZU5lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBUT0dHTEVfTkVFRFNfU0NSRUVOX1JFQ09SRElOR19QRVJNSVNTSU9OUyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlU2V0dGluZ3MoKTogVG9nZ2xlU2V0dGluZ3NBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBUT0dHTEVfU0VUVElOR1MsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVNwZWFrZXJWaWV3KCk6IFRvZ2dsZVNwZWFrZXJWaWV3QWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVE9HR0xFX1NQRUFLRVJfVklFVyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3dpdGNoVG9QcmVzZW50YXRpb25WaWV3KCk6IFN3aXRjaFRvUHJlc2VudGF0aW9uVmlld0FjdGlvblR5cGUge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNXSVRDSF9UT19QUkVTRU5UQVRJT05fVklFVyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3dpdGNoRnJvbVByZXNlbnRhdGlvblZpZXcoKTogU3dpdGNoRnJvbVByZXNlbnRhdGlvblZpZXdBY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTV0lUQ0hfRlJPTV9QUkVTRU5UQVRJT05fVklFVyxcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGFjdGlvbnMgPSB7XG4gIGFjY2VwdENhbGwsXG4gIGNhbGxTdGF0ZUNoYW5nZSxcbiAgY2FuY2VsQ2FsbCxcbiAgY2FuY2VsSW5jb21pbmdHcm91cENhbGxSaW5nLFxuICBjaGFuZ2VJT0RldmljZSxcbiAgY2xvc2VOZWVkUGVybWlzc2lvblNjcmVlbixcbiAgZGVjbGluZUNhbGwsXG4gIGdldFByZXNlbnRpbmdTb3VyY2VzLFxuICBncm91cENhbGxBdWRpb0xldmVsc0NoYW5nZSxcbiAgZ3JvdXBDYWxsU3RhdGVDaGFuZ2UsXG4gIGhhbmdVcEFjdGl2ZUNhbGwsXG4gIGtleUNoYW5nZU9rLFxuICBrZXlDaGFuZ2VkLFxuICBvcGVuU3lzdGVtUHJlZmVyZW5jZXNBY3Rpb24sXG4gIG91dGdvaW5nQ2FsbCxcbiAgcGVla0dyb3VwQ2FsbEZvclRoZUZpcnN0VGltZSxcbiAgcGVla0dyb3VwQ2FsbElmSXRIYXNNZW1iZXJzLFxuICBwZWVrTm90Q29ubmVjdGVkR3JvdXBDYWxsLFxuICByZWNlaXZlSW5jb21pbmdEaXJlY3RDYWxsLFxuICByZWNlaXZlSW5jb21pbmdHcm91cENhbGwsXG4gIHJlZnJlc2hJT0RldmljZXMsXG4gIHJlbW90ZVNoYXJpbmdTY3JlZW5DaGFuZ2UsXG4gIHJlbW90ZVZpZGVvQ2hhbmdlLFxuICByZXR1cm5Ub0FjdGl2ZUNhbGwsXG4gIHNldEdyb3VwQ2FsbFZpZGVvUmVxdWVzdCxcbiAgc2V0SXNDYWxsQWN0aXZlLFxuICBzZXRMb2NhbEF1ZGlvLFxuICBzZXRMb2NhbFByZXZpZXcsXG4gIHNldExvY2FsVmlkZW8sXG4gIHNldFByZXNlbnRpbmcsXG4gIHNldFJlbmRlcmVyQ2FudmFzLFxuICBzZXRPdXRnb2luZ1JpbmcsXG4gIHN0YXJ0Q2FsbCxcbiAgc3RhcnRDYWxsaW5nTG9iYnksXG4gIHN3aXRjaFRvUHJlc2VudGF0aW9uVmlldyxcbiAgc3dpdGNoRnJvbVByZXNlbnRhdGlvblZpZXcsXG4gIHRvZ2dsZVBhcnRpY2lwYW50cyxcbiAgdG9nZ2xlUGlwLFxuICB0b2dnbGVTY3JlZW5SZWNvcmRpbmdQZXJtaXNzaW9uc0RpYWxvZyxcbiAgdG9nZ2xlU2V0dGluZ3MsXG4gIHRvZ2dsZVNwZWFrZXJWaWV3LFxufTtcblxuZXhwb3J0IHR5cGUgQWN0aW9uc1R5cGUgPSB0eXBlb2YgYWN0aW9ucztcblxuLy8gUmVkdWNlclxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZSgpOiBDYWxsaW5nU3RhdGVUeXBlIHtcbiAgcmV0dXJuIHtcbiAgICBhdmFpbGFibGVDYW1lcmFzOiBbXSxcbiAgICBhdmFpbGFibGVNaWNyb3Bob25lczogW10sXG4gICAgYXZhaWxhYmxlU3BlYWtlcnM6IFtdLFxuICAgIHNlbGVjdGVkQ2FtZXJhOiB1bmRlZmluZWQsXG4gICAgc2VsZWN0ZWRNaWNyb3Bob25lOiB1bmRlZmluZWQsXG4gICAgc2VsZWN0ZWRTcGVha2VyOiB1bmRlZmluZWQsXG5cbiAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7fSxcbiAgICBhY3RpdmVDYWxsU3RhdGU6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0R3JvdXBDYWxsKFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuICBzdGF0ZTogUmVhZG9ubHk8Q2FsbGluZ1N0YXRlVHlwZT5cbik6IHVuZGVmaW5lZCB8IEdyb3VwQ2FsbFN0YXRlVHlwZSB7XG4gIGNvbnN0IGNhbGwgPSBnZXRPd24oc3RhdGUuY2FsbHNCeUNvbnZlcnNhdGlvbiwgY29udmVyc2F0aW9uSWQpO1xuICByZXR1cm4gY2FsbD8uY2FsbE1vZGUgPT09IENhbGxNb2RlLkdyb3VwID8gY2FsbCA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udmVyc2F0aW9uRnJvbVN0YXRlKFxuICBzdGF0ZTogUmVhZG9ubHk8Q2FsbGluZ1N0YXRlVHlwZT4sXG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmdcbik6IENhbGxpbmdTdGF0ZVR5cGUge1xuICByZXR1cm4ge1xuICAgIC4uLihjb252ZXJzYXRpb25JZCA9PT0gc3RhdGUuYWN0aXZlQ2FsbFN0YXRlPy5jb252ZXJzYXRpb25JZFxuICAgICAgPyBvbWl0KHN0YXRlLCAnYWN0aXZlQ2FsbFN0YXRlJylcbiAgICAgIDogc3RhdGUpLFxuICAgIGNhbGxzQnlDb252ZXJzYXRpb246IG9taXQoc3RhdGUuY2FsbHNCeUNvbnZlcnNhdGlvbiwgY29udmVyc2F0aW9uSWQpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihcbiAgc3RhdGU6IFJlYWRvbmx5PENhbGxpbmdTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PENhbGxpbmdBY3Rpb25UeXBlPlxuKTogQ2FsbGluZ1N0YXRlVHlwZSB7XG4gIGNvbnN0IHsgY2FsbHNCeUNvbnZlcnNhdGlvbiB9ID0gc3RhdGU7XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTVEFSVF9DQUxMSU5HX0xPQkJZKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBsZXQgY2FsbDogRGlyZWN0Q2FsbFN0YXRlVHlwZSB8IEdyb3VwQ2FsbFN0YXRlVHlwZTtcbiAgICBsZXQgb3V0Z29pbmdSaW5nOiBib29sZWFuO1xuICAgIHN3aXRjaCAoYWN0aW9uLnBheWxvYWQuY2FsbE1vZGUpIHtcbiAgICAgIGNhc2UgQ2FsbE1vZGUuRGlyZWN0OlxuICAgICAgICBjYWxsID0ge1xuICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgICAgaXNWaWRlb0NhbGw6IGFjdGlvbi5wYXlsb2FkLmhhc0xvY2FsVmlkZW8sXG4gICAgICAgIH07XG4gICAgICAgIG91dGdvaW5nUmluZyA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDYWxsTW9kZS5Hcm91cDoge1xuICAgICAgICAvLyBXZSBleHBlY3QgdG8gYmUgaW4gdGhpcyBzdGF0ZSBicmllZmx5LiBUaGUgQ2FsbGluZyBzZXJ2aWNlIHNob3VsZCB1cGRhdGUgdGhlXG4gICAgICAgIC8vICAgY2FsbCBzdGF0ZSBzaG9ydGx5LlxuICAgICAgICBjb25zdCBleGlzdGluZ0NhbGwgPSBnZXRHcm91cENhbGwoY29udmVyc2F0aW9uSWQsIHN0YXRlKTtcbiAgICAgICAgY29uc3QgcmluZ1N0YXRlID0gZ2V0R3JvdXBDYWxsUmluZ1N0YXRlKGV4aXN0aW5nQ2FsbCk7XG4gICAgICAgIGNhbGwgPSB7XG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogYWN0aW9uLnBheWxvYWQuY29ubmVjdGlvblN0YXRlLFxuICAgICAgICAgIGpvaW5TdGF0ZTogYWN0aW9uLnBheWxvYWQuam9pblN0YXRlLFxuICAgICAgICAgIHBlZWtJbmZvOiBhY3Rpb24ucGF5bG9hZC5wZWVrSW5mbyB8fFxuICAgICAgICAgICAgZXhpc3RpbmdDYWxsPy5wZWVrSW5mbyB8fCB7XG4gICAgICAgICAgICAgIHV1aWRzOiBhY3Rpb24ucGF5bG9hZC5yZW1vdGVQYXJ0aWNpcGFudHMubWFwKCh7IHV1aWQgfSkgPT4gdXVpZCksXG4gICAgICAgICAgICAgIG1heERldmljZXM6IEluZmluaXR5LFxuICAgICAgICAgICAgICBkZXZpY2VDb3VudDogYWN0aW9uLnBheWxvYWQucmVtb3RlUGFydGljaXBhbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgcmVtb3RlUGFydGljaXBhbnRzOiBhY3Rpb24ucGF5bG9hZC5yZW1vdGVQYXJ0aWNpcGFudHMsXG4gICAgICAgICAgLi4ucmluZ1N0YXRlLFxuICAgICAgICB9O1xuICAgICAgICBvdXRnb2luZ1JpbmcgPVxuICAgICAgICAgIGlzR3JvdXBDYWxsT3V0Ym91bmRSaW5nRW5hYmxlZCgpICYmXG4gICAgICAgICAgIXJpbmdTdGF0ZS5yaW5nSWQgJiZcbiAgICAgICAgICAhY2FsbC5wZWVrSW5mbz8udXVpZHMubGVuZ3RoICYmXG4gICAgICAgICAgIWNhbGwucmVtb3RlUGFydGljaXBhbnRzLmxlbmd0aCAmJlxuICAgICAgICAgICFhY3Rpb24ucGF5bG9hZC5pc0NvbnZlcnNhdGlvblRvb0JpZ1RvUmluZztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBtaXNzaW5nQ2FzZUVycm9yKGFjdGlvbi5wYXlsb2FkKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZF06IGNhbGwsXG4gICAgICB9LFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiBhY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgaGFzTG9jYWxBdWRpbzogYWN0aW9uLnBheWxvYWQuaGFzTG9jYWxBdWRpbyxcbiAgICAgICAgaGFzTG9jYWxWaWRlbzogYWN0aW9uLnBheWxvYWQuaGFzTG9jYWxWaWRlbyxcbiAgICAgICAgbG9jYWxBdWRpb0xldmVsOiAwLFxuICAgICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLkdyaWQsXG4gICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogW10sXG4gICAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogZmFsc2UsXG4gICAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgICAgb3V0Z29pbmdSaW5nLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTVEFSVF9ESVJFQ1RfQ0FMTCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLmNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGFjdGlvbi5wYXlsb2FkLmNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIGNhbGxTdGF0ZTogQ2FsbFN0YXRlLlByZXJpbmcsXG4gICAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgICAgaXNWaWRlb0NhbGw6IGFjdGlvbi5wYXlsb2FkLmhhc0xvY2FsVmlkZW8sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiBhY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgaGFzTG9jYWxBdWRpbzogYWN0aW9uLnBheWxvYWQuaGFzTG9jYWxBdWRpbyxcbiAgICAgICAgaGFzTG9jYWxWaWRlbzogYWN0aW9uLnBheWxvYWQuaGFzTG9jYWxWaWRlbyxcbiAgICAgICAgbG9jYWxBdWRpb0xldmVsOiAwLFxuICAgICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLkdyaWQsXG4gICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogW10sXG4gICAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogZmFsc2UsXG4gICAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgICAgb3V0Z29pbmdSaW5nOiB0cnVlLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBBQ0NFUFRfQ0FMTF9QRU5ESU5HKSB7XG4gICAgaWYgKCFoYXMoc3RhdGUuY2FsbHNCeUNvbnZlcnNhdGlvbiwgYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWQpKSB7XG4gICAgICBsb2cud2FybignVW5hYmxlIHRvIGFjY2VwdCBhIG5vbi1leGlzdGVudCBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiBhY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgaGFzTG9jYWxWaWRlbzogYWN0aW9uLnBheWxvYWQuYXNWaWRlb0NhbGwsXG4gICAgICAgIGxvY2FsQXVkaW9MZXZlbDogMCxcbiAgICAgICAgdmlld01vZGU6IENhbGxWaWV3TW9kZS5HcmlkLFxuICAgICAgICBwaXA6IGZhbHNlLFxuICAgICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHM6IFtdLFxuICAgICAgICBzZXR0aW5nc0RpYWxvZ09wZW46IGZhbHNlLFxuICAgICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogZmFsc2UsXG4gICAgICAgIG91dGdvaW5nUmluZzogZmFsc2UsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoXG4gICAgYWN0aW9uLnR5cGUgPT09IENBTkNFTF9DQUxMIHx8XG4gICAgYWN0aW9uLnR5cGUgPT09IEhBTkdfVVAgfHxcbiAgICBhY3Rpb24udHlwZSA9PT0gQ0xPU0VfTkVFRF9QRVJNSVNTSU9OX1NDUkVFTlxuICApIHtcbiAgICBjb25zdCBhY3RpdmVDYWxsID0gZ2V0QWN0aXZlQ2FsbChzdGF0ZSk7XG4gICAgaWYgKCFhY3RpdmVDYWxsKSB7XG4gICAgICBsb2cud2FybignTm8gYWN0aXZlIGNhbGwgdG8gcmVtb3ZlJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHN3aXRjaCAoYWN0aXZlQ2FsbC5jYWxsTW9kZSkge1xuICAgICAgY2FzZSBDYWxsTW9kZS5EaXJlY3Q6XG4gICAgICAgIHJldHVybiByZW1vdmVDb252ZXJzYXRpb25Gcm9tU3RhdGUoc3RhdGUsIGFjdGl2ZUNhbGwuY29udmVyc2F0aW9uSWQpO1xuICAgICAgY2FzZSBDYWxsTW9kZS5Hcm91cDpcbiAgICAgICAgcmV0dXJuIG9taXQoc3RhdGUsICdhY3RpdmVDYWxsU3RhdGUnKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoYWN0aXZlQ2FsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBDQU5DRUxfSU5DT01JTkdfR1JPVVBfQ0FMTF9SSU5HKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgcmluZ0lkIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgIGNvbnN0IGdyb3VwQ2FsbCA9IGdldEdyb3VwQ2FsbChjb252ZXJzYXRpb25JZCwgc3RhdGUpO1xuICAgIGlmICghZ3JvdXBDYWxsIHx8IGdyb3VwQ2FsbC5yaW5nSWQgIT09IHJpbmdJZCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXTogb21pdChncm91cENhbGwsIFsncmluZ0lkJywgJ3JpbmdlclV1aWQnXSksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDT05WRVJTQVRJT05fQ0hBTkdFRCcpIHtcbiAgICBjb25zdCBhY3RpdmVDYWxsID0gZ2V0QWN0aXZlQ2FsbChzdGF0ZSk7XG4gICAgY29uc3QgeyBhY3RpdmVDYWxsU3RhdGUgfSA9IHN0YXRlO1xuICAgIGlmIChcbiAgICAgICFhY3RpdmVDYWxsU3RhdGU/Lm91dGdvaW5nUmluZyB8fFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlLmNvbnZlcnNhdGlvbklkICE9PSBhY3Rpb24ucGF5bG9hZC5pZCB8fFxuICAgICAgYWN0aXZlQ2FsbD8uY2FsbE1vZGUgIT09IENhbGxNb2RlLkdyb3VwIHx8XG4gICAgICBhY3RpdmVDYWxsLmpvaW5TdGF0ZSAhPT0gR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCB8fFxuICAgICAgIWlzQ29udmVyc2F0aW9uVG9vQmlnVG9SaW5nKGFjdGlvbi5wYXlsb2FkLmRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7IC4uLmFjdGl2ZUNhbGxTdGF0ZSwgb3V0Z29pbmdSaW5nOiBmYWxzZSB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDT05WRVJTQVRJT05fUkVNT1ZFRCcpIHtcbiAgICByZXR1cm4gcmVtb3ZlQ29udmVyc2F0aW9uRnJvbVN0YXRlKHN0YXRlLCBhY3Rpb24ucGF5bG9hZC5pZCk7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IERFQ0xJTkVfRElSRUNUX0NBTEwpIHtcbiAgICByZXR1cm4gcmVtb3ZlQ29udmVyc2F0aW9uRnJvbVN0YXRlKHN0YXRlLCBhY3Rpb24ucGF5bG9hZC5jb252ZXJzYXRpb25JZCk7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IElOQ09NSU5HX0RJUkVDVF9DQUxMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgY2FsbFN0YXRlOiBDYWxsU3RhdGUuUHJlcmluZyxcbiAgICAgICAgICBpc0luY29taW5nOiB0cnVlLFxuICAgICAgICAgIGlzVmlkZW9DYWxsOiBhY3Rpb24ucGF5bG9hZC5pc1ZpZGVvQ2FsbCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gSU5DT01JTkdfR1JPVVBfQ0FMTCkge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQsIHJpbmdJZCwgcmluZ2VyVXVpZCB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBsZXQgZ3JvdXBDYWxsOiBHcm91cENhbGxTdGF0ZVR5cGU7XG4gICAgY29uc3QgZXhpc3RpbmdHcm91cENhbGwgPSBnZXRHcm91cENhbGwoY29udmVyc2F0aW9uSWQsIHN0YXRlKTtcbiAgICBpZiAoZXhpc3RpbmdHcm91cENhbGwpIHtcbiAgICAgIGlmIChleGlzdGluZ0dyb3VwQ2FsbC5yaW5nZXJVdWlkKSB7XG4gICAgICAgIGxvZy5pbmZvKCdHcm91cCBjYWxsIHdhcyBhbHJlYWR5IHJpbmdpbmcnKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgICAgaWYgKGV4aXN0aW5nR3JvdXBDYWxsLmpvaW5TdGF0ZSAhPT0gR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCkge1xuICAgICAgICBsb2cuaW5mbyhcIkdvdCBhIHJpbmcgZm9yIGEgY2FsbCB3ZSdyZSBhbHJlYWR5IGluXCIpO1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGdyb3VwQ2FsbCA9IHtcbiAgICAgICAgLi4uZXhpc3RpbmdHcm91cENhbGwsXG4gICAgICAgIHJpbmdJZCxcbiAgICAgICAgcmluZ2VyVXVpZCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyb3VwQ2FsbCA9IHtcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgY29ubmVjdGlvblN0YXRlOiBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuTm90Q29ubmVjdGVkLFxuICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgIHBlZWtJbmZvOiB7XG4gICAgICAgICAgdXVpZHM6IFtdLFxuICAgICAgICAgIG1heERldmljZXM6IEluZmluaXR5LFxuICAgICAgICAgIGRldmljZUNvdW50OiAwLFxuICAgICAgICB9LFxuICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICByaW5nSWQsXG4gICAgICAgIHJpbmdlclV1aWQsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXTogZ3JvdXBDYWxsLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBPVVRHT0lOR19DQUxMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgY2FsbFN0YXRlOiBDYWxsU3RhdGUuUHJlcmluZyxcbiAgICAgICAgICBpc0luY29taW5nOiBmYWxzZSxcbiAgICAgICAgICBpc1ZpZGVvQ2FsbDogYWN0aW9uLnBheWxvYWQuaGFzTG9jYWxWaWRlbyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6IGFjdGlvbi5wYXlsb2FkLmNvbnZlcnNhdGlvbklkLFxuICAgICAgICBoYXNMb2NhbEF1ZGlvOiBhY3Rpb24ucGF5bG9hZC5oYXNMb2NhbEF1ZGlvLFxuICAgICAgICBoYXNMb2NhbFZpZGVvOiBhY3Rpb24ucGF5bG9hZC5oYXNMb2NhbFZpZGVvLFxuICAgICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAsXG4gICAgICAgIHZpZXdNb2RlOiBDYWxsVmlld01vZGUuR3JpZCxcbiAgICAgICAgcGlwOiBmYWxzZSxcbiAgICAgICAgc2FmZXR5TnVtYmVyQ2hhbmdlZFV1aWRzOiBbXSxcbiAgICAgICAgc2V0dGluZ3NEaWFsb2dPcGVuOiBmYWxzZSxcbiAgICAgICAgc2hvd1BhcnRpY2lwYW50c0xpc3Q6IGZhbHNlLFxuICAgICAgICBvdXRnb2luZ1Jpbmc6IHRydWUsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IENBTExfU1RBVEVfQ0hBTkdFX0ZVTEZJTExFRCkge1xuICAgIC8vIFdlIHdhbnQgdG8ga2VlcCB0aGUgc3RhdGUgYXJvdW5kIGZvciBlbmRlZCBjYWxscyBpZiB0aGV5IHJlc3VsdGVkIGluIGEgbWVzc2FnZVxuICAgIC8vICAgcmVxdWVzdCBzbyB3ZSBjYW4gc2hvdyB0aGUgXCJuZWVkcyBwZXJtaXNzaW9uXCIgc2NyZWVuLlxuICAgIGlmIChcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmNhbGxTdGF0ZSA9PT0gQ2FsbFN0YXRlLkVuZGVkICYmXG4gICAgICBhY3Rpb24ucGF5bG9hZC5jYWxsRW5kZWRSZWFzb24gIT09XG4gICAgICAgIENhbGxFbmRlZFJlYXNvbi5SZW1vdGVIYW5ndXBOZWVkUGVybWlzc2lvblxuICAgICkge1xuICAgICAgcmV0dXJuIHJlbW92ZUNvbnZlcnNhdGlvbkZyb21TdGF0ZShzdGF0ZSwgYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWQpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGwgPSBnZXRPd24oXG4gICAgICBzdGF0ZS5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgYWN0aW9uLnBheWxvYWQuY29udmVyc2F0aW9uSWRcbiAgICApO1xuICAgIGlmIChjYWxsPy5jYWxsTW9kZSAhPT0gQ2FsbE1vZGUuRGlyZWN0KSB7XG4gICAgICBsb2cud2FybignQ2Fubm90IHVwZGF0ZSBzdGF0ZSBmb3IgYSBub24tZGlyZWN0IGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBsZXQgYWN0aXZlQ2FsbFN0YXRlOiB1bmRlZmluZWQgfCBBY3RpdmVDYWxsU3RhdGVUeXBlO1xuICAgIGlmIChcbiAgICAgIHN0YXRlLmFjdGl2ZUNhbGxTdGF0ZT8uY29udmVyc2F0aW9uSWQgPT09IGFjdGlvbi5wYXlsb2FkLmNvbnZlcnNhdGlvbklkXG4gICAgKSB7XG4gICAgICBhY3RpdmVDYWxsU3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgam9pbmVkQXQ6IGFjdGlvbi5wYXlsb2FkLmFjY2VwdGVkVGltZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICh7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLmNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIC4uLmNhbGwsXG4gICAgICAgICAgY2FsbFN0YXRlOiBhY3Rpb24ucGF5bG9hZC5jYWxsU3RhdGUsXG4gICAgICAgICAgY2FsbEVuZGVkUmVhc29uOiBhY3Rpb24ucGF5bG9hZC5jYWxsRW5kZWRSZWFzb24sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IEdST1VQX0NBTExfQVVESU9fTEVWRUxTX0NIQU5HRSkge1xuICAgIGNvbnN0IHsgY29udmVyc2F0aW9uSWQsIHJlbW90ZURldmljZVN0YXRlcyB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgY29uc3QgZXhpc3RpbmdDYWxsID0gZ2V0R3JvdXBDYWxsKGNvbnZlcnNhdGlvbklkLCBzdGF0ZSk7XG5cbiAgICAvLyBUaGUgUGlQIGNoZWNrIGlzIGFuIG9wdGltaXphdGlvbi4gV2UgZG9uJ3QgbmVlZCB0byB1cGRhdGUgYXVkaW8gbGV2ZWxzIGlmIHRoZSB1c2VyXG4gICAgLy8gICBjYW5ub3Qgc2VlIHRoZW0uXG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUgfHwgYWN0aXZlQ2FsbFN0YXRlLnBpcCB8fCAhZXhpc3RpbmdDYWxsKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxBdWRpb0xldmVsID0gdHJ1bmNhdGVBdWRpb0xldmVsKGFjdGlvbi5wYXlsb2FkLmxvY2FsQXVkaW9MZXZlbCk7XG5cbiAgICBjb25zdCByZW1vdGVBdWRpb0xldmVscyA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgcmVtb3RlRGV2aWNlU3RhdGVzLmZvckVhY2goKHsgYXVkaW9MZXZlbCwgZGVtdXhJZCB9KSA9PiB7XG4gICAgICAvLyBXZSBleHBlY3QgYGF1ZGlvTGV2ZWxgIHRvIGJlIGEgbnVtYmVyIGJ1dCBoYXZlIHRoaXMgY2hlY2sganVzdCBpbiBjYXNlLlxuICAgICAgaWYgKHR5cGVvZiBhdWRpb0xldmVsICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdyYWRlZCA9IHRydW5jYXRlQXVkaW9MZXZlbChhdWRpb0xldmVsKTtcbiAgICAgIGlmIChncmFkZWQgPiAwKSB7XG4gICAgICAgIHJlbW90ZUF1ZGlvTGV2ZWxzLnNldChkZW11eElkLCBncmFkZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBhY3Rpb24gaXMgZGlzcGF0Y2hlZCBmcmVxdWVudGx5LiBUaGlzIGVxdWFsaXR5IGNoZWNrIGhlbHBzIGF2b2lkIHJlLXJlbmRlcnMuXG4gICAgY29uc3Qgb2xkTG9jYWxBdWRpb0xldmVsID0gYWN0aXZlQ2FsbFN0YXRlLmxvY2FsQXVkaW9MZXZlbDtcbiAgICBjb25zdCBvbGRSZW1vdGVBdWRpb0xldmVscyA9IGV4aXN0aW5nQ2FsbC5yZW1vdGVBdWRpb0xldmVscztcbiAgICBpZiAoXG4gICAgICBvbGRMb2NhbEF1ZGlvTGV2ZWwgPT09IGxvY2FsQXVkaW9MZXZlbCAmJlxuICAgICAgb2xkUmVtb3RlQXVkaW9MZXZlbHMgJiZcbiAgICAgIG1hcFV0aWwuaXNFcXVhbChvbGRSZW1vdGVBdWRpb0xldmVscywgcmVtb3RlQXVkaW9MZXZlbHMpXG4gICAgKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7IC4uLmFjdGl2ZUNhbGxTdGF0ZSwgbG9jYWxBdWRpb0xldmVsIH0sXG4gICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHsgLi4uZXhpc3RpbmdDYWxsLCByZW1vdGVBdWRpb0xldmVscyB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBHUk9VUF9DQUxMX1NUQVRFX0NIQU5HRSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbm5lY3Rpb25TdGF0ZSxcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgaGFzTG9jYWxBdWRpbyxcbiAgICAgIGhhc0xvY2FsVmlkZW8sXG4gICAgICBqb2luU3RhdGUsXG4gICAgICBvdXJVdWlkLFxuICAgICAgcGVla0luZm8sXG4gICAgICByZW1vdGVQYXJ0aWNpcGFudHMsXG4gICAgfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgZXhpc3RpbmdDYWxsID0gZ2V0R3JvdXBDYWxsKGNvbnZlcnNhdGlvbklkLCBzdGF0ZSk7XG4gICAgY29uc3QgZXhpc3RpbmdSaW5nU3RhdGUgPSBnZXRHcm91cENhbGxSaW5nU3RhdGUoZXhpc3RpbmdDYWxsKTtcblxuICAgIGNvbnN0IG5ld1BlZWtJbmZvID0gcGVla0luZm8gfHxcbiAgICAgIGV4aXN0aW5nQ2FsbD8ucGVla0luZm8gfHwge1xuICAgICAgICB1dWlkczogcmVtb3RlUGFydGljaXBhbnRzLm1hcCgoeyB1dWlkIH0pID0+IHV1aWQpLFxuICAgICAgICBtYXhEZXZpY2VzOiBJbmZpbml0eSxcbiAgICAgICAgZGV2aWNlQ291bnQ6IHJlbW90ZVBhcnRpY2lwYW50cy5sZW5ndGgsXG4gICAgICB9O1xuXG4gICAgbGV0IG5ld0FjdGl2ZUNhbGxTdGF0ZTogQWN0aXZlQ2FsbFN0YXRlVHlwZSB8IHVuZGVmaW5lZDtcbiAgICBpZiAoc3RhdGUuYWN0aXZlQ2FsbFN0YXRlPy5jb252ZXJzYXRpb25JZCA9PT0gY29udmVyc2F0aW9uSWQpIHtcbiAgICAgIG5ld0FjdGl2ZUNhbGxTdGF0ZSA9XG4gICAgICAgIGNvbm5lY3Rpb25TdGF0ZSA9PT0gR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLk5vdENvbm5lY3RlZFxuICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAgIC4uLnN0YXRlLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgICAgICAgaGFzTG9jYWxBdWRpbyxcbiAgICAgICAgICAgICAgaGFzTG9jYWxWaWRlbyxcbiAgICAgICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0FjdGl2ZUNhbGxTdGF0ZSA9IHN0YXRlLmFjdGl2ZUNhbGxTdGF0ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBuZXdBY3RpdmVDYWxsU3RhdGUgJiZcbiAgICAgIG5ld0FjdGl2ZUNhbGxTdGF0ZS5vdXRnb2luZ1JpbmcgJiZcbiAgICAgIG5ld0FjdGl2ZUNhbGxTdGF0ZS5jb252ZXJzYXRpb25JZCA9PT0gY29udmVyc2F0aW9uSWQgJiZcbiAgICAgIGlzQW55Ym9keUVsc2VJbkdyb3VwQ2FsbChuZXdQZWVrSW5mbywgb3VyVXVpZClcbiAgICApIHtcbiAgICAgIG5ld0FjdGl2ZUNhbGxTdGF0ZSA9IHtcbiAgICAgICAgLi4ubmV3QWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBvdXRnb2luZ1Jpbmc6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgbmV3UmluZ1N0YXRlOiBHcm91cENhbGxSaW5nU3RhdGVUeXBlO1xuICAgIGlmIChqb2luU3RhdGUgPT09IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQpIHtcbiAgICAgIG5ld1JpbmdTdGF0ZSA9IGV4aXN0aW5nUmluZ1N0YXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdSaW5nU3RhdGUgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgIC4uLmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgIFtjb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgY29ubmVjdGlvblN0YXRlLFxuICAgICAgICAgIGpvaW5TdGF0ZSxcbiAgICAgICAgICBwZWVrSW5mbzogbmV3UGVla0luZm8sXG4gICAgICAgICAgcmVtb3RlUGFydGljaXBhbnRzLFxuICAgICAgICAgIC4uLm5ld1JpbmdTdGF0ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IG5ld0FjdGl2ZUNhbGxTdGF0ZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBQRUVLX0dST1VQX0NBTExfRlVMRklMTEVEKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgcGVla0luZm8gfSA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgY29uc3QgZXhpc3RpbmdDYWxsOiBHcm91cENhbGxTdGF0ZVR5cGUgPSBnZXRHcm91cENhbGwoXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIHN0YXRlXG4gICAgKSB8fCB7XG4gICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLk5vdENvbm5lY3RlZCxcbiAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCxcbiAgICAgIHBlZWtJbmZvOiB7XG4gICAgICAgIHV1aWRzOiBbXSxcbiAgICAgICAgbWF4RGV2aWNlczogSW5maW5pdHksXG4gICAgICAgIGRldmljZUNvdW50OiAwLFxuICAgICAgfSxcbiAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW10sXG4gICAgfTtcblxuICAgIC8vIFRoaXMgYWN0aW9uIHNob3VsZCBvbmx5IHVwZGF0ZSBub24tY29ubmVjdGVkIGdyb3VwIGNhbGxzLiBJdCdzIG5vdCBuZWNlc3NhcmlseSBhXG4gICAgLy8gICBtaXN0YWtlIGlmIHRoaXMgYWN0aW9uIGlzIGRpc3BhdGNoZWQgXCJvdmVyXCIgYSBjb25uZWN0ZWQgY2FsbC4gSGVyZSdzIGEgdmFsaWRcbiAgICAvLyAgIHNlcXVlbmNlIG9mIGV2ZW50czpcbiAgICAvL1xuICAgIC8vIDEuIFdlIGFzayBSaW5nUlRDIHRvIHBlZWssIGtpY2tpbmcgb2ZmIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uXG4gICAgLy8gMi4gVGhlIGFzc29jaWF0ZWQgZ3JvdXAgY2FsbCBpcyBqb2luZWQuXG4gICAgLy8gMy4gVGhlIHBlZWsgcHJvbWlzZSBmcm9tIHN0ZXAgMSByZXNvbHZlcy5cbiAgICBpZiAoXG4gICAgICBleGlzdGluZ0NhbGwuY29ubmVjdGlvblN0YXRlICE9PSBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuTm90Q29ubmVjdGVkXG4gICAgKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgLi4uZXhpc3RpbmdDYWxsLFxuICAgICAgICAgIHBlZWtJbmZvLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBSRU1PVEVfU0hBUklOR19TQ1JFRU5fQ0hBTkdFKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgaXNTaGFyaW5nU2NyZWVuIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBjYWxsID0gZ2V0T3duKHN0YXRlLmNhbGxzQnlDb252ZXJzYXRpb24sIGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoY2FsbD8uY2FsbE1vZGUgIT09IENhbGxNb2RlLkRpcmVjdCkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCB1cGRhdGUgcmVtb3RlIHZpZGVvIGZvciBhIG5vbi1kaXJlY3QgY2FsbCcpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgLi4uY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgW2NvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgIC4uLmNhbGwsXG4gICAgICAgICAgaXNTaGFyaW5nU2NyZWVuLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBSRU1PVEVfVklERU9fQ0hBTkdFKSB7XG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25JZCwgaGFzVmlkZW8gfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IGNhbGwgPSBnZXRPd24oc3RhdGUuY2FsbHNCeUNvbnZlcnNhdGlvbiwgY29udmVyc2F0aW9uSWQpO1xuICAgIGlmIChjYWxsPy5jYWxsTW9kZSAhPT0gQ2FsbE1vZGUuRGlyZWN0KSB7XG4gICAgICBsb2cud2FybignQ2Fubm90IHVwZGF0ZSByZW1vdGUgdmlkZW8gZm9yIGEgbm9uLWRpcmVjdCBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAuLi5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICBbY29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgLi4uY2FsbCxcbiAgICAgICAgICBoYXNSZW1vdGVWaWRlbzogaGFzVmlkZW8sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFJFVFVSTl9UT19BQ1RJVkVfQ0FMTCkge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCByZXR1cm4gdG8gYWN0aXZlIGNhbGwgaWYgdGhlcmUgaXMgbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBwaXA6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRVRfTE9DQUxfQVVESU9fRlVMRklMTEVEKSB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc2V0IGxvY2FsIGF1ZGlvIHdpdGggbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uc3RhdGUuYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBoYXNMb2NhbEF1ZGlvOiBhY3Rpb24ucGF5bG9hZC5lbmFibGVkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRVRfTE9DQUxfVklERU9fRlVMRklMTEVEKSB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc2V0IGxvY2FsIHZpZGVvIHdpdGggbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uc3RhdGUuYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBoYXNMb2NhbFZpZGVvOiBhY3Rpb24ucGF5bG9hZC5lbmFibGVkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBDSEFOR0VfSU9fREVWSUNFX0ZVTEZJTExFRCkge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWREZXZpY2UgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IG5leHRTdGF0ZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBpZiAoYWN0aW9uLnBheWxvYWQudHlwZSA9PT0gQ2FsbGluZ0RldmljZVR5cGUuQ0FNRVJBKSB7XG4gICAgICBuZXh0U3RhdGUuc2VsZWN0ZWRDYW1lcmEgPSBzZWxlY3RlZERldmljZTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbi5wYXlsb2FkLnR5cGUgPT09IENhbGxpbmdEZXZpY2VUeXBlLk1JQ1JPUEhPTkUpIHtcbiAgICAgIG5leHRTdGF0ZS5zZWxlY3RlZE1pY3JvcGhvbmUgPSBzZWxlY3RlZERldmljZTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbi5wYXlsb2FkLnR5cGUgPT09IENhbGxpbmdEZXZpY2VUeXBlLlNQRUFLRVIpIHtcbiAgICAgIG5leHRTdGF0ZS5zZWxlY3RlZFNwZWFrZXIgPSBzZWxlY3RlZERldmljZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICAuLi5uZXh0U3RhdGUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gUkVGUkVTSF9JT19ERVZJQ0VTKSB7XG4gICAgY29uc3Qge1xuICAgICAgYXZhaWxhYmxlTWljcm9waG9uZXMsXG4gICAgICBzZWxlY3RlZE1pY3JvcGhvbmUsXG4gICAgICBhdmFpbGFibGVTcGVha2VycyxcbiAgICAgIHNlbGVjdGVkU3BlYWtlcixcbiAgICAgIGF2YWlsYWJsZUNhbWVyYXMsXG4gICAgICBzZWxlY3RlZENhbWVyYSxcbiAgICB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhdmFpbGFibGVNaWNyb3Bob25lcyxcbiAgICAgIHNlbGVjdGVkTWljcm9waG9uZSxcbiAgICAgIGF2YWlsYWJsZVNwZWFrZXJzLFxuICAgICAgc2VsZWN0ZWRTcGVha2VyLFxuICAgICAgYXZhaWxhYmxlQ2FtZXJhcyxcbiAgICAgIHNlbGVjdGVkQ2FtZXJhLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9TRVRUSU5HUykge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCB0b2dnbGUgc2V0dGluZ3Mgd2hlbiB0aGVyZSBpcyBubyBhY3RpdmUgY2FsbCcpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgICAuLi5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogIWFjdGl2ZUNhbGxTdGF0ZS5zZXR0aW5nc0RpYWxvZ09wZW4sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFRPR0dMRV9QQVJUSUNJUEFOVFMpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3QgdG9nZ2xlIHBhcnRpY2lwYW50cyBsaXN0IHdoZW4gdGhlcmUgaXMgbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogIWFjdGl2ZUNhbGxTdGF0ZS5zaG93UGFydGljaXBhbnRzTGlzdCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gVE9HR0xFX1BJUCkge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCB0b2dnbGUgUGlQIHdoZW4gdGhlcmUgaXMgbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBwaXA6ICFhY3RpdmVDYWxsU3RhdGUucGlwLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRVRfUFJFU0VOVElORykge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCB0b2dnbGUgcHJlc2VudGluZyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIC4uLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgcHJlc2VudGluZ1NvdXJjZTogYWN0aW9uLnBheWxvYWQsXG4gICAgICAgIHByZXNlbnRpbmdTb3VyY2VzQXZhaWxhYmxlOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09IFNFVF9QUkVTRU5USU5HX1NPVVJDRVMpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc2V0IHByZXNlbnRpbmcgc291cmNlcyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIC4uLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgcHJlc2VudGluZ1NvdXJjZXNBdmFpbGFibGU6IGFjdGlvbi5wYXlsb2FkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRVRfT1VUR09JTkdfUklORykge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCBzZXQgb3V0Z29pbmcgcmluZyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIC4uLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgb3V0Z29pbmdSaW5nOiBhY3Rpb24ucGF5bG9hZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gVE9HR0xFX05FRURTX1NDUkVFTl9SRUNPUkRJTkdfUEVSTUlTU0lPTlMpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc2V0IHByZXNlbnRpbmcgc291cmNlcyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIC4uLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgc2hvd05lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNXYXJuaW5nOlxuICAgICAgICAgICFhY3RpdmVDYWxsU3RhdGUuc2hvd05lZWRzU2NyZWVuUmVjb3JkaW5nUGVybWlzc2lvbnNXYXJuaW5nLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBUT0dHTEVfU1BFQUtFUl9WSUVXKSB7XG4gICAgY29uc3QgeyBhY3RpdmVDYWxsU3RhdGUgfSA9IHN0YXRlO1xuICAgIGlmICghYWN0aXZlQ2FsbFN0YXRlKSB7XG4gICAgICBsb2cud2FybignQ2Fubm90IHRvZ2dsZSBzcGVha2VyIHZpZXcgd2hlbiB0aGVyZSBpcyBubyBhY3RpdmUgY2FsbCcpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGxldCBuZXdWaWV3TW9kZTogQ2FsbFZpZXdNb2RlO1xuICAgIGlmIChhY3RpdmVDYWxsU3RhdGUudmlld01vZGUgPT09IENhbGxWaWV3TW9kZS5HcmlkKSB7XG4gICAgICBuZXdWaWV3TW9kZSA9IENhbGxWaWV3TW9kZS5TcGVha2VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIHdpbGwgc3dpdGNoIHByZXNlbnRhdGlvbi9zcGVha2VyIHRvIGdyaWRcbiAgICAgIG5ld1ZpZXdNb2RlID0gQ2FsbFZpZXdNb2RlLkdyaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgIC4uLmFjdGl2ZUNhbGxTdGF0ZSxcbiAgICAgICAgdmlld01vZGU6IG5ld1ZpZXdNb2RlLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTV0lUQ0hfVE9fUFJFU0VOVEFUSU9OX1ZJRVcpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc3dpdGNoIHRvIHNwZWFrZXIgdmlldyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgLy8gXCJQcmVzZW50YXRpb25cIiBtb2RlIHJldmVydHMgdG8gXCJHcmlkXCIgd2hlbiB0aGUgY2FsbCBpcyBvdmVyIHNvIGRvbid0XG4gICAgLy8gc3dpdGNoIGl0IGlmIGl0IGlzIGluIFwiU3BlYWtlclwiIG1vZGUuXG4gICAgaWYgKGFjdGl2ZUNhbGxTdGF0ZS52aWV3TW9kZSA9PT0gQ2FsbFZpZXdNb2RlLlNwZWFrZXIpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gU1dJVENIX0ZST01fUFJFU0VOVEFUSU9OX1ZJRVcpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3Qgc3dpdGNoIHRvIHNwZWFrZXIgdmlldyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjYWxsJyk7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZUNhbGxTdGF0ZS52aWV3TW9kZSAhPT0gQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvbikge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgICAuLi5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICAgIHZpZXdNb2RlOiBDYWxsVmlld01vZGUuR3JpZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gTUFSS19DQUxMX1VOVFJVU1RFRCkge1xuICAgIGNvbnN0IHsgYWN0aXZlQ2FsbFN0YXRlIH0gPSBzdGF0ZTtcbiAgICBpZiAoIWFjdGl2ZUNhbGxTdGF0ZSkge1xuICAgICAgbG9nLndhcm4oJ0Nhbm5vdCBtYXJrIGNhbGwgYXMgdW50cnVzdGVkIHdoZW4gdGhlcmUgaXMgbm8gYWN0aXZlIGNhbGwnKTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNhZmV0eU51bWJlckNoYW5nZWRVdWlkcyB9ID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgLi4uYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICBwaXA6IGZhbHNlLFxuICAgICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHMsXG4gICAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogZmFsc2UsXG4gICAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gTUFSS19DQUxMX1RSVVNURUQpIHtcbiAgICBjb25zdCB7IGFjdGl2ZUNhbGxTdGF0ZSB9ID0gc3RhdGU7XG4gICAgaWYgKCFhY3RpdmVDYWxsU3RhdGUpIHtcbiAgICAgIGxvZy53YXJuKCdDYW5ub3QgbWFyayBjYWxsIGFzIHRydXN0ZWQgd2hlbiB0aGVyZSBpcyBubyBhY3RpdmUgY2FsbCcpO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgICAuLi5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogW10sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUE0QjtBQUU1QixxQkFBZ0M7QUFDaEMsNENBR087QUFDUCxvQkFBMEI7QUFDMUIsb0JBQXVCO0FBQ3ZCLGFBQXdCO0FBQ3hCLGtCQUE0QjtBQUM1Qix3Q0FBMkM7QUFDM0MsOEJBQWlDO0FBQ2pDLHFCQUF3QjtBQUN4QixnQ0FBbUM7QUFTbkMscUJBT087QUFDUCwwQkFBNkI7QUFDN0IsZ0NBQXlDO0FBQ3pDLDRDQUErQztBQUMvQyxtQkFBc0I7QUFDdEIseUJBQTRCO0FBTTVCLDJCQUF3QztBQUN4QyxVQUFxQjtBQUNyQixvQkFBNkI7QUFDN0IsMkJBQThCO0FBQzlCLGNBQXlCO0FBeU5sQixNQUFNLGdCQUFnQix3QkFBQztBQUFBLEVBQzVCO0FBQUEsRUFDQTtBQUFBLE1BRUEsbUJBQ0EsMEJBQU8scUJBQXFC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
