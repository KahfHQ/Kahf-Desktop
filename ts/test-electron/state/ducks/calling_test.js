var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_chai = require("chai");
var sinon = __toESM(require("sinon"));
var import_lodash = require("lodash");
var import_reducer = require("../../../state/reducer");
var import_noop = require("../../../state/ducks/noop");
var import_calling = require("../../../state/ducks/calling");
var import_truncateAudioLevel = require("../../../calling/truncateAudioLevel");
var import_calling2 = require("../../../services/calling");
var import_Calling = require("../../../types/Calling");
var import_UUID = require("../../../types/UUID");
var import_getDefaultConversation = require("../../../test-both/helpers/getDefaultConversation");
describe("calling duck", () => {
  const stateWithDirectCall = {
    ...(0, import_calling.getEmptyState)(),
    callsByConversation: {
      "fake-direct-call-conversation-id": {
        callMode: import_Calling.CallMode.Direct,
        conversationId: "fake-direct-call-conversation-id",
        callState: import_Calling.CallState.Accepted,
        isIncoming: false,
        isVideoCall: false,
        hasRemoteVideo: false
      }
    }
  };
  const stateWithActiveDirectCall = {
    ...stateWithDirectCall,
    activeCallState: {
      conversationId: "fake-direct-call-conversation-id",
      hasLocalAudio: true,
      hasLocalVideo: false,
      localAudioLevel: 0,
      viewMode: import_Calling.CallViewMode.Grid,
      showParticipantsList: false,
      safetyNumberChangedUuids: [],
      outgoingRing: true,
      pip: false,
      settingsDialogOpen: false
    }
  };
  const stateWithIncomingDirectCall = {
    ...(0, import_calling.getEmptyState)(),
    callsByConversation: {
      "fake-direct-call-conversation-id": {
        callMode: import_Calling.CallMode.Direct,
        conversationId: "fake-direct-call-conversation-id",
        callState: import_Calling.CallState.Ringing,
        isIncoming: true,
        isVideoCall: false,
        hasRemoteVideo: false
      }
    }
  };
  const creatorUuid = import_UUID.UUID.generate().toString();
  const differentCreatorUuid = import_UUID.UUID.generate().toString();
  const remoteUuid = import_UUID.UUID.generate().toString();
  const ringerUuid = import_UUID.UUID.generate().toString();
  const stateWithGroupCall = {
    ...(0, import_calling.getEmptyState)(),
    callsByConversation: {
      "fake-group-call-conversation-id": {
        callMode: import_Calling.CallMode.Group,
        conversationId: "fake-group-call-conversation-id",
        connectionState: import_Calling.GroupCallConnectionState.Connected,
        joinState: import_Calling.GroupCallJoinState.NotJoined,
        peekInfo: {
          uuids: [creatorUuid],
          creatorUuid,
          eraId: "xyz",
          maxDevices: 16,
          deviceCount: 1
        },
        remoteParticipants: [
          {
            uuid: remoteUuid,
            demuxId: 123,
            hasRemoteAudio: true,
            hasRemoteVideo: true,
            presenting: false,
            sharingScreen: false,
            videoAspectRatio: 4 / 3
          }
        ]
      }
    }
  };
  const stateWithIncomingGroupCall = {
    ...stateWithGroupCall,
    callsByConversation: {
      ...stateWithGroupCall.callsByConversation,
      "fake-group-call-conversation-id": {
        ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
        ringId: BigInt(123),
        ringerUuid: import_UUID.UUID.generate().toString()
      }
    }
  };
  const stateWithActiveGroupCall = {
    ...stateWithGroupCall,
    activeCallState: {
      conversationId: "fake-group-call-conversation-id",
      hasLocalAudio: true,
      hasLocalVideo: false,
      localAudioLevel: 0,
      viewMode: import_Calling.CallViewMode.Grid,
      showParticipantsList: false,
      safetyNumberChangedUuids: [],
      outgoingRing: false,
      pip: false,
      settingsDialogOpen: false
    }
  };
  const stateWithActivePresentationViewGroupCall = {
    ...stateWithGroupCall,
    activeCallState: {
      ...stateWithActiveGroupCall.activeCallState,
      viewMode: import_Calling.CallViewMode.Presentation
    }
  };
  const stateWithActiveSpeakerViewGroupCall = {
    ...stateWithGroupCall,
    activeCallState: {
      ...stateWithActiveGroupCall.activeCallState,
      viewMode: import_Calling.CallViewMode.Speaker
    }
  };
  const ourACI = import_UUID.UUID.generate().toString();
  const getEmptyRootState = /* @__PURE__ */ __name(() => {
    const rootState = (0, import_reducer.reducer)(void 0, (0, import_noop.noopAction)());
    return {
      ...rootState,
      user: {
        ...rootState.user,
        ourACI
      }
    };
  }, "getEmptyRootState");
  beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
    this.sandbox = sinon.createSandbox();
  }, "beforeEach"));
  afterEach(/* @__PURE__ */ __name(function afterEach2() {
    this.sandbox.restore();
  }, "afterEach"));
  describe("actions", () => {
    describe("getPresentingSources", () => {
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServiceGetPresentingSources = this.sandbox.stub(import_calling2.calling, "getPresentingSources").resolves([
          {
            id: "foo.bar",
            name: "Foo Bar",
            thumbnail: "xyz"
          }
        ]);
      }, "beforeEach"));
      it("retrieves sources from the calling service", async function test() {
        const { getPresentingSources } = import_calling.actions;
        const dispatch = sinon.spy();
        await getPresentingSources()(dispatch, getEmptyRootState, null);
        sinon.assert.calledOnce(this.callingServiceGetPresentingSources);
      });
      it("dispatches SET_PRESENTING_SOURCES", async function test() {
        const { getPresentingSources } = import_calling.actions;
        const dispatch = sinon.spy();
        await getPresentingSources()(dispatch, getEmptyRootState, null);
        sinon.assert.calledOnce(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: "calling/SET_PRESENTING_SOURCES",
          payload: [
            {
              id: "foo.bar",
              name: "Foo Bar",
              thumbnail: "xyz"
            }
          ]
        });
      });
    });
    describe("remoteSharingScreenChange", () => {
      it("updates whether someone's screen is being shared", () => {
        const { remoteSharingScreenChange } = import_calling.actions;
        const payload = {
          conversationId: "fake-direct-call-conversation-id",
          isSharingScreen: true
        };
        const state = {
          ...stateWithActiveDirectCall
        };
        const nextState = (0, import_calling.reducer)(state, remoteSharingScreenChange(payload));
        const expectedState = {
          ...stateWithActiveDirectCall,
          callsByConversation: {
            "fake-direct-call-conversation-id": {
              ...stateWithActiveDirectCall.callsByConversation["fake-direct-call-conversation-id"],
              isSharingScreen: true
            }
          }
        };
        import_chai.assert.deepEqual(nextState, expectedState);
      });
    });
    describe("setPresenting", () => {
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServiceSetPresenting = this.sandbox.stub(import_calling2.calling, "setPresenting");
      }, "beforeEach"));
      it("calls setPresenting on the calling service", function test() {
        const { setPresenting } = import_calling.actions;
        const dispatch = sinon.spy();
        const presentedSource = {
          id: "window:786",
          name: "Application"
        };
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: {
            ...stateWithActiveGroupCall
          }
        }), "getState");
        setPresenting(presentedSource)(dispatch, getState, null);
        sinon.assert.calledOnce(this.callingServiceSetPresenting);
        sinon.assert.calledWith(this.callingServiceSetPresenting, "fake-group-call-conversation-id", false, presentedSource);
      });
      it("dispatches SET_PRESENTING", () => {
        const { setPresenting } = import_calling.actions;
        const dispatch = sinon.spy();
        const presentedSource = {
          id: "window:786",
          name: "Application"
        };
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: {
            ...stateWithActiveGroupCall
          }
        }), "getState");
        setPresenting(presentedSource)(dispatch, getState, null);
        sinon.assert.calledOnce(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: "calling/SET_PRESENTING",
          payload: presentedSource
        });
      });
      it("turns off presenting when no value is passed in", () => {
        const dispatch = sinon.spy();
        const { setPresenting } = import_calling.actions;
        const presentedSource = {
          id: "window:786",
          name: "Application"
        };
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: {
            ...stateWithActiveGroupCall
          }
        }), "getState");
        setPresenting(presentedSource)(dispatch, getState, null);
        const action = dispatch.getCall(0).args[0];
        const nextState = (0, import_calling.reducer)(getState().calling, action);
        import_chai.assert.isDefined(nextState.activeCallState);
        import_chai.assert.equal(nextState.activeCallState?.presentingSource, presentedSource);
        import_chai.assert.isUndefined(nextState.activeCallState?.presentingSourcesAvailable);
      });
      it("sets the presenting value when one is passed in", () => {
        const dispatch = sinon.spy();
        const { setPresenting } = import_calling.actions;
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: {
            ...stateWithActiveGroupCall
          }
        }), "getState");
        setPresenting()(dispatch, getState, null);
        const action = dispatch.getCall(0).args[0];
        const nextState = (0, import_calling.reducer)(getState().calling, action);
        import_chai.assert.isDefined(nextState.activeCallState);
        import_chai.assert.isUndefined(nextState.activeCallState?.presentingSource);
        import_chai.assert.isUndefined(nextState.activeCallState?.presentingSourcesAvailable);
      });
    });
    describe("acceptCall", () => {
      const { acceptCall } = import_calling.actions;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServiceAccept = this.sandbox.stub(import_calling2.calling, "acceptDirectCall").resolves();
        this.callingServiceJoin = this.sandbox.stub(import_calling2.calling, "joinGroupCall").resolves();
      }, "beforeEach"));
      describe("accepting a direct call", () => {
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: stateWithIncomingDirectCall
        }), "getState");
        it("dispatches an ACCEPT_CALL_PENDING action", async () => {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-direct-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          sinon.assert.calledOnce(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/ACCEPT_CALL_PENDING",
            payload: {
              conversationId: "fake-direct-call-conversation-id",
              asVideoCall: true
            }
          });
          await acceptCall({
            conversationId: "fake-direct-call-conversation-id",
            asVideoCall: false
          })(dispatch, getState, null);
          sinon.assert.calledTwice(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/ACCEPT_CALL_PENDING",
            payload: {
              conversationId: "fake-direct-call-conversation-id",
              asVideoCall: false
            }
          });
        });
        it("asks the calling service to accept the call", async function test() {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-direct-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          sinon.assert.calledOnce(this.callingServiceAccept);
          sinon.assert.calledWith(this.callingServiceAccept, "fake-direct-call-conversation-id", true);
          await acceptCall({
            conversationId: "fake-direct-call-conversation-id",
            asVideoCall: false
          })(dispatch, getState, null);
          sinon.assert.calledTwice(this.callingServiceAccept);
          sinon.assert.calledWith(this.callingServiceAccept, "fake-direct-call-conversation-id", false);
        });
        it("updates the active call state with ACCEPT_CALL_PENDING", async () => {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-direct-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          const action = dispatch.getCall(0).args[0];
          const result = (0, import_calling.reducer)(stateWithIncomingDirectCall, action);
          import_chai.assert.deepEqual(result.activeCallState, {
            conversationId: "fake-direct-call-conversation-id",
            hasLocalAudio: true,
            hasLocalVideo: true,
            localAudioLevel: 0,
            viewMode: import_Calling.CallViewMode.Grid,
            showParticipantsList: false,
            safetyNumberChangedUuids: [],
            outgoingRing: false,
            pip: false,
            settingsDialogOpen: false
          });
        });
      });
      describe("accepting a group call", () => {
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: stateWithIncomingGroupCall
        }), "getState");
        it("dispatches an ACCEPT_CALL_PENDING action", async () => {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-group-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          sinon.assert.calledOnce(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/ACCEPT_CALL_PENDING",
            payload: {
              conversationId: "fake-group-call-conversation-id",
              asVideoCall: true
            }
          });
          await acceptCall({
            conversationId: "fake-group-call-conversation-id",
            asVideoCall: false
          })(dispatch, getState, null);
          sinon.assert.calledTwice(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/ACCEPT_CALL_PENDING",
            payload: {
              conversationId: "fake-group-call-conversation-id",
              asVideoCall: false
            }
          });
        });
        it("asks the calling service to join the call", async function test() {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-group-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          sinon.assert.calledOnce(this.callingServiceJoin);
          sinon.assert.calledWith(this.callingServiceJoin, "fake-group-call-conversation-id", true, true);
          await acceptCall({
            conversationId: "fake-group-call-conversation-id",
            asVideoCall: false
          })(dispatch, getState, null);
          sinon.assert.calledTwice(this.callingServiceJoin);
          sinon.assert.calledWith(this.callingServiceJoin, "fake-group-call-conversation-id", true, false);
        });
        it("updates the active call state with ACCEPT_CALL_PENDING", async () => {
          const dispatch = sinon.spy();
          await acceptCall({
            conversationId: "fake-group-call-conversation-id",
            asVideoCall: true
          })(dispatch, getState, null);
          const action = dispatch.getCall(0).args[0];
          const result = (0, import_calling.reducer)(stateWithIncomingGroupCall, action);
          import_chai.assert.deepEqual(result.activeCallState, {
            conversationId: "fake-group-call-conversation-id",
            hasLocalAudio: true,
            hasLocalVideo: true,
            localAudioLevel: 0,
            viewMode: import_Calling.CallViewMode.Grid,
            showParticipantsList: false,
            safetyNumberChangedUuids: [],
            outgoingRing: false,
            pip: false,
            settingsDialogOpen: false
          });
        });
      });
    });
    describe("cancelCall", () => {
      const { cancelCall } = import_calling.actions;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServiceStopCallingLobby = this.sandbox.stub(import_calling2.calling, "stopCallingLobby");
      }, "beforeEach"));
      it("stops the calling lobby for that conversation", function test() {
        cancelCall({ conversationId: "123" });
        sinon.assert.calledOnce(this.callingServiceStopCallingLobby);
        sinon.assert.calledWith(this.callingServiceStopCallingLobby, "123");
      });
      it("completely removes an active direct call from the state", () => {
        const result = (0, import_calling.reducer)(stateWithActiveDirectCall, cancelCall({ conversationId: "fake-direct-call-conversation-id" }));
        import_chai.assert.notProperty(result.callsByConversation, "fake-direct-call-conversation-id");
        import_chai.assert.isUndefined(result.activeCallState);
      });
      it("removes the active group call, but leaves it in the state", () => {
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, cancelCall({ conversationId: "fake-group-call-conversation-id" }));
        import_chai.assert.property(result.callsByConversation, "fake-group-call-conversation-id");
        import_chai.assert.isUndefined(result.activeCallState);
      });
    });
    describe("cancelIncomingGroupCallRing", () => {
      const { cancelIncomingGroupCallRing } = import_calling.actions;
      it("does nothing if there is no associated group call", () => {
        const state = (0, import_calling.getEmptyState)();
        const action = cancelIncomingGroupCallRing({
          conversationId: "garbage",
          ringId: BigInt(1)
        });
        const result = (0, import_calling.reducer)(state, action);
        import_chai.assert.strictEqual(result, state);
      });
      it("does nothing if the ring to cancel isn't the same one", () => {
        const action = cancelIncomingGroupCallRing({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(999)
        });
        const result = (0, import_calling.reducer)(stateWithIncomingGroupCall, action);
        import_chai.assert.strictEqual(result, stateWithIncomingGroupCall);
      });
      it("removes the ring state, but not the call", () => {
        const action = cancelIncomingGroupCallRing({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(123)
        });
        const result = (0, import_calling.reducer)(stateWithIncomingGroupCall, action);
        const call = result.callsByConversation["fake-group-call-conversation-id"];
        if (call?.callMode !== import_Calling.CallMode.Group) {
          throw new Error("Expected to find a group call");
        }
        import_chai.assert.isUndefined(call.ringId);
        import_chai.assert.isUndefined(call.ringerUuid);
      });
    });
    describe("declineCall", () => {
      const { declineCall } = import_calling.actions;
      let declineDirectCall;
      let declineGroupCall;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        declineDirectCall = this.sandbox.stub(import_calling2.calling, "declineDirectCall");
        declineGroupCall = this.sandbox.stub(import_calling2.calling, "declineGroupCall");
      }, "beforeEach"));
      describe("declining a direct call", () => {
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: stateWithIncomingDirectCall
        }), "getState");
        it("dispatches a DECLINE_DIRECT_CALL action", () => {
          const dispatch = sinon.spy();
          declineCall({ conversationId: "fake-direct-call-conversation-id" })(dispatch, getState, null);
          sinon.assert.calledOnce(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/DECLINE_DIRECT_CALL",
            payload: {
              conversationId: "fake-direct-call-conversation-id"
            }
          });
        });
        it("asks the calling service to decline the call", () => {
          const dispatch = sinon.spy();
          declineCall({ conversationId: "fake-direct-call-conversation-id" })(dispatch, getState, null);
          sinon.assert.calledOnce(declineDirectCall);
          sinon.assert.calledWith(declineDirectCall, "fake-direct-call-conversation-id");
        });
        it("removes the call from the state", () => {
          const dispatch = sinon.spy();
          declineCall({ conversationId: "fake-direct-call-conversation-id" })(dispatch, getState, null);
          const action = dispatch.getCall(0).args[0];
          const result = (0, import_calling.reducer)(stateWithIncomingGroupCall, action);
          import_chai.assert.notProperty(result.callsByConversation, "fake-direct-call-conversation-id");
        });
      });
      describe("declining a group call", () => {
        const getState = /* @__PURE__ */ __name(() => ({
          ...getEmptyRootState(),
          calling: stateWithIncomingGroupCall
        }), "getState");
        it("dispatches a CANCEL_INCOMING_GROUP_CALL_RING action", () => {
          const dispatch = sinon.spy();
          declineCall({ conversationId: "fake-group-call-conversation-id" })(dispatch, getState, null);
          sinon.assert.calledOnce(dispatch);
          sinon.assert.calledWith(dispatch, {
            type: "calling/CANCEL_INCOMING_GROUP_CALL_RING",
            payload: {
              conversationId: "fake-group-call-conversation-id",
              ringId: BigInt(123)
            }
          });
        });
        it("asks the calling service to decline the call", () => {
          const dispatch = sinon.spy();
          declineCall({ conversationId: "fake-group-call-conversation-id" })(dispatch, getState, null);
          sinon.assert.calledOnce(declineGroupCall);
          sinon.assert.calledWith(declineGroupCall, "fake-group-call-conversation-id", BigInt(123));
        });
      });
    });
    describe("groupCallAudioLevelsChange", () => {
      const { groupCallAudioLevelsChange } = import_calling.actions;
      const remoteDeviceStates = [
        { audioLevel: 0.3, demuxId: 1 },
        { audioLevel: 0.4, demuxId: 2 },
        { audioLevel: 0.5, demuxId: 3 },
        { audioLevel: 0.2, demuxId: 7 },
        { audioLevel: 0.1, demuxId: 8 },
        { audioLevel: 0, demuxId: 9 }
      ];
      const remoteAudioLevels = /* @__PURE__ */ new Map([
        [1, (0, import_truncateAudioLevel.truncateAudioLevel)(0.3)],
        [2, (0, import_truncateAudioLevel.truncateAudioLevel)(0.4)],
        [3, (0, import_truncateAudioLevel.truncateAudioLevel)(0.5)],
        [7, (0, import_truncateAudioLevel.truncateAudioLevel)(0.2)],
        [8, (0, import_truncateAudioLevel.truncateAudioLevel)(0.1)]
      ]);
      it("does nothing if there's no relevant call", () => {
        const action = groupCallAudioLevelsChange({
          conversationId: "garbage",
          localAudioLevel: 1,
          remoteDeviceStates
        });
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, action);
        import_chai.assert.strictEqual(result, stateWithActiveGroupCall);
      });
      it("does nothing if the state change would be a no-op", () => {
        const state = {
          ...stateWithActiveGroupCall,
          callsByConversation: {
            "fake-group-call-conversation-id": {
              ...stateWithActiveGroupCall.callsByConversation["fake-group-call-conversation-id"],
              remoteAudioLevels
            }
          }
        };
        const action = groupCallAudioLevelsChange({
          conversationId: "fake-group-call-conversation-id",
          localAudioLevel: 1e-3,
          remoteDeviceStates
        });
        const result = (0, import_calling.reducer)(state, action);
        import_chai.assert.strictEqual(result, state);
      });
      it("updates the set of speaking participants, including yourself", () => {
        const action = groupCallAudioLevelsChange({
          conversationId: "fake-group-call-conversation-id",
          localAudioLevel: 0.8,
          remoteDeviceStates
        });
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, action);
        import_chai.assert.strictEqual(result.activeCallState?.localAudioLevel, (0, import_truncateAudioLevel.truncateAudioLevel)(0.8));
        const call = result.callsByConversation["fake-group-call-conversation-id"];
        if (call?.callMode !== import_Calling.CallMode.Group) {
          throw new Error("Expected a group call to be found");
        }
        import_chai.assert.deepStrictEqual(call.remoteAudioLevels, remoteAudioLevels);
      });
    });
    describe("groupCallStateChange", () => {
      const { groupCallStateChange } = import_calling.actions;
      function getAction(...args) {
        const dispatch = sinon.spy();
        groupCallStateChange(...args)(dispatch, getEmptyRootState, null);
        return dispatch.getCall(0).args[0];
      }
      it("saves a new call to the map of conversations", () => {
        const result = (0, import_calling.reducer)((0, import_calling.getEmptyState)(), getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joining,
          hasLocalAudio: true,
          hasLocalVideo: false,
          peekInfo: {
            uuids: [creatorUuid],
            creatorUuid,
            eraId: "xyz",
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 123,
              hasRemoteAudio: true,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 4 / 3
            }
          ]
        }));
        import_chai.assert.deepEqual(result.callsByConversation["fake-group-call-conversation-id"], {
          callMode: import_Calling.CallMode.Group,
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joining,
          peekInfo: {
            uuids: [creatorUuid],
            creatorUuid,
            eraId: "xyz",
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 123,
              hasRemoteAudio: true,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 4 / 3
            }
          ]
        });
      });
      it("updates a call in the map of conversations", () => {
        const result = (0, import_calling.reducer)(stateWithGroupCall, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: false,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.deepEqual(result.callsByConversation["fake-group-call-conversation-id"], {
          callMode: import_Calling.CallMode.Group,
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        });
      });
      it("keeps the existing ring state if you haven't joined the call", () => {
        const state = {
          ...stateWithGroupCall,
          callsByConversation: {
            ...stateWithGroupCall.callsByConversation,
            "fake-group-call-conversation-id": {
              ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
              ringId: BigInt(456),
              ringerUuid
            }
          }
        };
        const result = (0, import_calling.reducer)(state, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.NotJoined,
          hasLocalAudio: true,
          hasLocalVideo: false,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.include(result.callsByConversation["fake-group-call-conversation-id"], {
          callMode: import_Calling.CallMode.Group,
          ringId: BigInt(456),
          ringerUuid
        });
      });
      it("removes the ring state if you've joined the call", () => {
        const state = {
          ...stateWithGroupCall,
          callsByConversation: {
            ...stateWithGroupCall.callsByConversation,
            "fake-group-call-conversation-id": {
              ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
              ringId: BigInt(456),
              ringerUuid
            }
          }
        };
        const result = (0, import_calling.reducer)(state, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: false,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.notProperty(result.callsByConversation["fake-group-call-conversation-id"], "ringId");
        import_chai.assert.notProperty(result.callsByConversation["fake-group-call-conversation-id"], "ringerUuid");
      });
      it("if no call is active, doesn't touch the active call state", () => {
        const result = (0, import_calling.reducer)(stateWithGroupCall, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: false,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.isUndefined(result.activeCallState);
      });
      it("if the call is not active, doesn't touch the active call state", () => {
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, getAction({
          conversationId: "another-fake-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: true,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.deepEqual(result.activeCallState, {
          conversationId: "fake-group-call-conversation-id",
          hasLocalAudio: true,
          hasLocalVideo: false,
          localAudioLevel: 0,
          viewMode: import_Calling.CallViewMode.Grid,
          showParticipantsList: false,
          safetyNumberChangedUuids: [],
          outgoingRing: false,
          pip: false,
          settingsDialogOpen: false
        });
      });
      it("if the call is active, updates the active call state", () => {
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: true,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: [
            {
              uuid: remoteUuid,
              demuxId: 456,
              hasRemoteAudio: false,
              hasRemoteVideo: true,
              presenting: false,
              sharingScreen: false,
              videoAspectRatio: 16 / 9
            }
          ]
        }));
        import_chai.assert.strictEqual(result.activeCallState?.conversationId, "fake-group-call-conversation-id");
        import_chai.assert.isTrue(result.activeCallState?.hasLocalAudio);
        import_chai.assert.isTrue(result.activeCallState?.hasLocalVideo);
      });
      it("doesn't stop ringing if nobody is in the call", () => {
        const state = {
          ...stateWithActiveGroupCall,
          activeCallState: {
            ...stateWithActiveGroupCall.activeCallState,
            outgoingRing: true
          }
        };
        const result = (0, import_calling.reducer)(state, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: true,
          peekInfo: {
            uuids: [],
            maxDevices: 16,
            deviceCount: 0
          },
          remoteParticipants: []
        }));
        import_chai.assert.isTrue(result.activeCallState?.outgoingRing);
      });
      it("stops ringing if someone enters the call", () => {
        const state = {
          ...stateWithActiveGroupCall,
          activeCallState: {
            ...stateWithActiveGroupCall.activeCallState,
            outgoingRing: true
          }
        };
        const result = (0, import_calling.reducer)(state, getAction({
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.Connected,
          joinState: import_Calling.GroupCallJoinState.Joined,
          hasLocalAudio: true,
          hasLocalVideo: true,
          peekInfo: {
            uuids: ["1b9e4d42-1f56-45c5-b6f4-d1be5a54fefa"],
            maxDevices: 16,
            deviceCount: 1
          },
          remoteParticipants: []
        }));
        import_chai.assert.isFalse(result.activeCallState?.outgoingRing);
      });
    });
    describe("peekNotConnectedGroupCall", () => {
      const { peekNotConnectedGroupCall } = import_calling.actions;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServicePeekGroupCall = this.sandbox.stub(import_calling2.calling, "peekGroupCall");
        this.callingServiceUpdateCallHistoryForGroupCall = this.sandbox.stub(import_calling2.calling, "updateCallHistoryForGroupCall");
        this.clock = this.sandbox.useFakeTimers();
      }, "beforeEach"));
      describe("thunk", () => {
        function noopTest(connectionState) {
          return async function test() {
            const dispatch = sinon.spy();
            await peekNotConnectedGroupCall({
              conversationId: "fake-group-call-conversation-id"
            })(dispatch, () => ({
              ...getEmptyRootState(),
              calling: {
                ...stateWithGroupCall,
                callsByConversation: {
                  "fake-group-call-conversation-id": {
                    ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
                    connectionState
                  }
                }
              }
            }), null);
            sinon.assert.notCalled(dispatch);
            sinon.assert.notCalled(this.callingServicePeekGroupCall);
          };
        }
        it("no-ops if trying to peek at a connecting group call", noopTest(import_Calling.GroupCallConnectionState.Connecting));
        it("no-ops if trying to peek at a connected group call", noopTest(import_Calling.GroupCallConnectionState.Connected));
        it("no-ops if trying to peek at a reconnecting group call", noopTest(import_Calling.GroupCallConnectionState.Reconnecting));
      });
    });
    describe("returnToActiveCall", () => {
      const { returnToActiveCall } = import_calling.actions;
      it("does nothing if not in PiP mode", () => {
        const result = (0, import_calling.reducer)(stateWithActiveDirectCall, returnToActiveCall());
        import_chai.assert.deepEqual(result, stateWithActiveDirectCall);
      });
      it("closes the PiP", () => {
        const state = {
          ...stateWithActiveDirectCall,
          activeCallState: {
            ...stateWithActiveDirectCall.activeCallState,
            pip: true
          }
        };
        const result = (0, import_calling.reducer)(state, returnToActiveCall());
        import_chai.assert.deepEqual(result, stateWithActiveDirectCall);
      });
    });
    describe("receiveIncomingGroupCall", () => {
      const { receiveIncomingGroupCall } = import_calling.actions;
      it("does nothing if the call was already ringing", () => {
        const action = receiveIncomingGroupCall({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(456),
          ringerUuid
        });
        const result = (0, import_calling.reducer)(stateWithIncomingGroupCall, action);
        import_chai.assert.strictEqual(result, stateWithIncomingGroupCall);
      });
      it("does nothing if the call was already joined", () => {
        const state = {
          ...stateWithGroupCall,
          callsByConversation: {
            ...stateWithGroupCall.callsByConversation,
            "fake-group-call-conversation-id": {
              ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
              joinState: import_Calling.GroupCallJoinState.Joined
            }
          }
        };
        const action = receiveIncomingGroupCall({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(456),
          ringerUuid
        });
        const result = (0, import_calling.reducer)(state, action);
        import_chai.assert.strictEqual(result, state);
      });
      it("creates a new group call if one did not exist", () => {
        const action = receiveIncomingGroupCall({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(456),
          ringerUuid
        });
        const result = (0, import_calling.reducer)((0, import_calling.getEmptyState)(), action);
        import_chai.assert.deepEqual(result.callsByConversation["fake-group-call-conversation-id"], {
          callMode: import_Calling.CallMode.Group,
          conversationId: "fake-group-call-conversation-id",
          connectionState: import_Calling.GroupCallConnectionState.NotConnected,
          joinState: import_Calling.GroupCallJoinState.NotJoined,
          peekInfo: {
            uuids: [],
            maxDevices: Infinity,
            deviceCount: 0
          },
          remoteParticipants: [],
          ringId: BigInt(456),
          ringerUuid
        });
      });
      it("attaches ring state to an existing call", () => {
        const action = receiveIncomingGroupCall({
          conversationId: "fake-group-call-conversation-id",
          ringId: BigInt(456),
          ringerUuid
        });
        const result = (0, import_calling.reducer)(stateWithGroupCall, action);
        import_chai.assert.include(result.callsByConversation["fake-group-call-conversation-id"], {
          ringId: BigInt(456),
          ringerUuid
        });
      });
    });
    describe("setLocalAudio", () => {
      const { setLocalAudio } = import_calling.actions;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingServiceSetOutgoingAudio = this.sandbox.stub(import_calling2.calling, "setOutgoingAudio");
      }, "beforeEach"));
      it("dispatches a SET_LOCAL_AUDIO_FULFILLED action", () => {
        const dispatch = sinon.spy();
        setLocalAudio({ enabled: true })(dispatch, () => ({
          ...getEmptyRootState(),
          calling: stateWithActiveDirectCall
        }), null);
        sinon.assert.calledOnce(dispatch);
        sinon.assert.calledWith(dispatch, {
          type: "calling/SET_LOCAL_AUDIO_FULFILLED",
          payload: { enabled: true }
        });
      });
      it("updates the outgoing audio for the active call", function test() {
        const dispatch = sinon.spy();
        setLocalAudio({ enabled: false })(dispatch, () => ({
          ...getEmptyRootState(),
          calling: stateWithActiveDirectCall
        }), null);
        sinon.assert.calledOnce(this.callingServiceSetOutgoingAudio);
        sinon.assert.calledWith(this.callingServiceSetOutgoingAudio, "fake-direct-call-conversation-id", false);
        setLocalAudio({ enabled: true })(dispatch, () => ({
          ...getEmptyRootState(),
          calling: stateWithActiveDirectCall
        }), null);
        sinon.assert.calledTwice(this.callingServiceSetOutgoingAudio);
        sinon.assert.calledWith(this.callingServiceSetOutgoingAudio, "fake-direct-call-conversation-id", true);
      });
      it("updates the local audio state with SET_LOCAL_AUDIO_FULFILLED", () => {
        const dispatch = sinon.spy();
        setLocalAudio({ enabled: false })(dispatch, () => ({
          ...getEmptyRootState(),
          calling: stateWithActiveDirectCall
        }), null);
        const action = dispatch.getCall(0).args[0];
        const result = (0, import_calling.reducer)(stateWithActiveDirectCall, action);
        import_chai.assert.isFalse(result.activeCallState?.hasLocalAudio);
      });
    });
    describe("setOutgoingRing", () => {
      const { setOutgoingRing } = import_calling.actions;
      it("enables a desire to ring", () => {
        const action = setOutgoingRing(true);
        const result = (0, import_calling.reducer)(stateWithActiveGroupCall, action);
        import_chai.assert.isTrue(result.activeCallState?.outgoingRing);
      });
      it("disables a desire to ring", () => {
        const action = setOutgoingRing(false);
        const result = (0, import_calling.reducer)(stateWithActiveDirectCall, action);
        import_chai.assert.isFalse(result.activeCallState?.outgoingRing);
      });
    });
    describe("startCallingLobby", () => {
      const { startCallingLobby } = import_calling.actions;
      let rootState;
      let startCallingLobbyStub;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        startCallingLobbyStub = this.sandbox.stub(import_calling2.calling, "startCallingLobby").resolves();
        const emptyRootState = getEmptyRootState();
        rootState = {
          ...emptyRootState,
          conversations: {
            ...emptyRootState.conversations,
            conversationLookup: {
              "fake-conversation-id": (0, import_getDefaultConversation.getDefaultConversation)()
            }
          }
        };
      }, "beforeEach"));
      describe("thunk", () => {
        it("asks the calling service to start the lobby", async () => {
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(import_lodash.noop, () => rootState, null);
          sinon.assert.calledOnce(startCallingLobbyStub);
        });
        it("requests audio by default", async () => {
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(import_lodash.noop, () => rootState, null);
          sinon.assert.calledWithMatch(startCallingLobbyStub, {
            hasLocalAudio: true
          });
        });
        it("doesn't request audio if the group call already has 8 devices", async () => {
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(import_lodash.noop, () => {
            const callingState = (0, import_lodash.cloneDeep)(stateWithGroupCall);
            callingState.callsByConversation["fake-group-call-conversation-id"].peekInfo.deviceCount = 8;
            return { ...rootState, calling: callingState };
          }, null);
          sinon.assert.calledWithMatch(startCallingLobbyStub, {
            hasLocalVideo: true
          });
        });
        it("requests video when starting a video call", async () => {
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(import_lodash.noop, () => rootState, null);
          sinon.assert.calledWithMatch(startCallingLobbyStub, {
            hasLocalVideo: true
          });
        });
        it("doesn't request video when not a video call", async () => {
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: false
          })(import_lodash.noop, () => rootState, null);
          sinon.assert.calledWithMatch(startCallingLobbyStub, {
            hasLocalVideo: false
          });
        });
        it("dispatches an action if the calling lobby returns something", async () => {
          startCallingLobbyStub.resolves({
            callMode: import_Calling.CallMode.Direct,
            hasLocalAudio: true,
            hasLocalVideo: true
          });
          const dispatch = sinon.stub();
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(dispatch, () => rootState, null);
          sinon.assert.calledOnce(dispatch);
        });
        it("doesn't dispatch an action if the calling lobby returns nothing", async () => {
          const dispatch = sinon.stub();
          await startCallingLobby({
            conversationId: "fake-conversation-id",
            isVideoCall: true
          })(dispatch, () => rootState, null);
          sinon.assert.notCalled(dispatch);
        });
      });
      describe("action", () => {
        const getState = /* @__PURE__ */ __name(async (callingState, callingServiceResult, conversationId = "fake-conversation-id") => {
          startCallingLobbyStub.resolves(callingServiceResult);
          const dispatch = sinon.stub();
          await startCallingLobby({
            conversationId,
            isVideoCall: true
          })(dispatch, () => ({ ...rootState, calling: callingState }), null);
          const action = dispatch.getCall(0).args[0];
          return (0, import_calling.reducer)(callingState, action);
        }, "getState");
        it("saves a direct call and makes it active", async () => {
          const result = await getState((0, import_calling.getEmptyState)(), {
            callMode: import_Calling.CallMode.Direct,
            hasLocalAudio: true,
            hasLocalVideo: true
          });
          import_chai.assert.deepEqual(result.callsByConversation["fake-conversation-id"], {
            callMode: import_Calling.CallMode.Direct,
            conversationId: "fake-conversation-id",
            isIncoming: false,
            isVideoCall: true
          });
          import_chai.assert.deepEqual(result.activeCallState, {
            conversationId: "fake-conversation-id",
            hasLocalAudio: true,
            hasLocalVideo: true,
            localAudioLevel: 0,
            viewMode: import_Calling.CallViewMode.Grid,
            showParticipantsList: false,
            safetyNumberChangedUuids: [],
            pip: false,
            settingsDialogOpen: false,
            outgoingRing: true
          });
        });
        it("saves a group call and makes it active", async () => {
          const result = await getState((0, import_calling.getEmptyState)(), {
            callMode: import_Calling.CallMode.Group,
            hasLocalAudio: true,
            hasLocalVideo: true,
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: {
              uuids: [creatorUuid],
              creatorUuid,
              eraId: "xyz",
              maxDevices: 16,
              deviceCount: 1
            },
            remoteParticipants: [
              {
                uuid: remoteUuid,
                demuxId: 123,
                hasRemoteAudio: true,
                hasRemoteVideo: true,
                presenting: false,
                sharingScreen: false,
                videoAspectRatio: 4 / 3
              }
            ]
          });
          import_chai.assert.deepEqual(result.callsByConversation["fake-conversation-id"], {
            callMode: import_Calling.CallMode.Group,
            conversationId: "fake-conversation-id",
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: {
              uuids: [creatorUuid],
              creatorUuid,
              eraId: "xyz",
              maxDevices: 16,
              deviceCount: 1
            },
            remoteParticipants: [
              {
                uuid: remoteUuid,
                demuxId: 123,
                hasRemoteAudio: true,
                hasRemoteVideo: true,
                presenting: false,
                sharingScreen: false,
                videoAspectRatio: 4 / 3
              }
            ]
          });
          import_chai.assert.deepEqual(result.activeCallState?.conversationId, "fake-conversation-id");
          import_chai.assert.isFalse(result.activeCallState?.outgoingRing);
        });
        it("chooses fallback peek info if none is sent and there is no existing call", async () => {
          const result = await getState((0, import_calling.getEmptyState)(), {
            callMode: import_Calling.CallMode.Group,
            hasLocalAudio: true,
            hasLocalVideo: true,
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: void 0,
            remoteParticipants: []
          });
          const call = result.callsByConversation["fake-conversation-id"];
          import_chai.assert.deepEqual(call?.callMode === import_Calling.CallMode.Group && call.peekInfo, {
            uuids: [],
            maxDevices: Infinity,
            deviceCount: 0
          });
        });
        it("doesn't overwrite an existing group call's peek info if none was sent", async () => {
          const result = await getState(stateWithGroupCall, {
            callMode: import_Calling.CallMode.Group,
            hasLocalAudio: true,
            hasLocalVideo: true,
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: void 0,
            remoteParticipants: [
              {
                uuid: remoteUuid,
                demuxId: 123,
                hasRemoteAudio: true,
                hasRemoteVideo: true,
                presenting: false,
                sharingScreen: false,
                videoAspectRatio: 4 / 3
              }
            ]
          });
          const call = result.callsByConversation["fake-group-call-conversation-id"];
          import_chai.assert.deepEqual(call?.callMode === import_Calling.CallMode.Group && call.peekInfo, {
            uuids: [creatorUuid],
            creatorUuid,
            eraId: "xyz",
            maxDevices: 16,
            deviceCount: 1
          });
        });
        it("can overwrite an existing group call's peek info", async () => {
          const state = {
            ...(0, import_calling.getEmptyState)(),
            callsByConversation: {
              "fake-conversation-id": {
                ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
                conversationId: "fake-conversation-id"
              }
            }
          };
          const result = await getState(state, {
            callMode: import_Calling.CallMode.Group,
            hasLocalAudio: true,
            hasLocalVideo: true,
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: {
              uuids: [differentCreatorUuid],
              creatorUuid: differentCreatorUuid,
              eraId: "abc",
              maxDevices: 5,
              deviceCount: 1
            },
            remoteParticipants: [
              {
                uuid: remoteUuid,
                demuxId: 123,
                hasRemoteAudio: true,
                hasRemoteVideo: true,
                presenting: false,
                sharingScreen: false,
                videoAspectRatio: 4 / 3
              }
            ]
          });
          const call = result.callsByConversation["fake-conversation-id"];
          import_chai.assert.deepEqual(call?.callMode === import_Calling.CallMode.Group && call.peekInfo, {
            uuids: [differentCreatorUuid],
            creatorUuid: differentCreatorUuid,
            eraId: "abc",
            maxDevices: 5,
            deviceCount: 1
          });
        });
        it("doesn't overwrite an existing group call's ring state if it was set previously", async () => {
          const result = await getState({
            ...stateWithGroupCall,
            callsByConversation: {
              "fake-group-call-conversation-id": {
                ...stateWithGroupCall.callsByConversation["fake-group-call-conversation-id"],
                ringId: BigInt(987),
                ringerUuid
              }
            }
          }, {
            callMode: import_Calling.CallMode.Group,
            hasLocalAudio: true,
            hasLocalVideo: true,
            connectionState: import_Calling.GroupCallConnectionState.Connected,
            joinState: import_Calling.GroupCallJoinState.NotJoined,
            peekInfo: void 0,
            remoteParticipants: [
              {
                uuid: remoteUuid,
                demuxId: 123,
                hasRemoteAudio: true,
                hasRemoteVideo: true,
                presenting: false,
                sharingScreen: false,
                videoAspectRatio: 4 / 3
              }
            ]
          });
          const call = result.callsByConversation["fake-group-call-conversation-id"];
          if (call?.callMode !== import_Calling.CallMode.Group) {
            throw new Error("Expected to find a group call");
          }
          import_chai.assert.strictEqual(call.ringId, BigInt(987));
          import_chai.assert.strictEqual(call.ringerUuid, ringerUuid);
        });
      });
    });
    describe("startCall", () => {
      const { startCall } = import_calling.actions;
      beforeEach(/* @__PURE__ */ __name(function beforeEach2() {
        this.callingStartOutgoingDirectCall = this.sandbox.stub(import_calling2.calling, "startOutgoingDirectCall");
        this.callingJoinGroupCall = this.sandbox.stub(import_calling2.calling, "joinGroupCall").resolves();
      }, "beforeEach"));
      it("asks the calling service to start an outgoing direct call", async function test() {
        const dispatch = sinon.spy();
        await startCall({
          callMode: import_Calling.CallMode.Direct,
          conversationId: "123",
          hasLocalAudio: true,
          hasLocalVideo: false
        })(dispatch, getEmptyRootState, null);
        sinon.assert.calledOnce(this.callingStartOutgoingDirectCall);
        sinon.assert.calledWith(this.callingStartOutgoingDirectCall, "123", true, false);
        sinon.assert.notCalled(this.callingJoinGroupCall);
      });
      it("asks the calling service to join a group call", async function test() {
        const dispatch = sinon.spy();
        await startCall({
          callMode: import_Calling.CallMode.Group,
          conversationId: "123",
          hasLocalAudio: true,
          hasLocalVideo: false
        })(dispatch, getEmptyRootState, null);
        sinon.assert.calledOnce(this.callingJoinGroupCall);
        sinon.assert.calledWith(this.callingJoinGroupCall, "123", true, false);
        sinon.assert.notCalled(this.callingStartOutgoingDirectCall);
      });
      it("saves direct calls and makes them active", async () => {
        const dispatch = sinon.spy();
        await startCall({
          callMode: import_Calling.CallMode.Direct,
          conversationId: "fake-conversation-id",
          hasLocalAudio: true,
          hasLocalVideo: false
        })(dispatch, getEmptyRootState, null);
        const action = dispatch.getCall(0).args[0];
        const result = (0, import_calling.reducer)((0, import_calling.getEmptyState)(), action);
        import_chai.assert.deepEqual(result.callsByConversation["fake-conversation-id"], {
          callMode: import_Calling.CallMode.Direct,
          conversationId: "fake-conversation-id",
          callState: import_Calling.CallState.Prering,
          isIncoming: false,
          isVideoCall: false
        });
        import_chai.assert.deepEqual(result.activeCallState, {
          conversationId: "fake-conversation-id",
          hasLocalAudio: true,
          hasLocalVideo: false,
          localAudioLevel: 0,
          viewMode: import_Calling.CallViewMode.Grid,
          showParticipantsList: false,
          safetyNumberChangedUuids: [],
          pip: false,
          settingsDialogOpen: false,
          outgoingRing: true
        });
      });
      it("doesn't dispatch any actions for group calls", () => {
        const dispatch = sinon.spy();
        startCall({
          callMode: import_Calling.CallMode.Group,
          conversationId: "123",
          hasLocalAudio: true,
          hasLocalVideo: false
        })(dispatch, getEmptyRootState, null);
        sinon.assert.notCalled(dispatch);
      });
    });
    describe("toggleSettings", () => {
      const { toggleSettings } = import_calling.actions;
      it("toggles the settings dialog", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveDirectCall, toggleSettings());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, toggleSettings());
        const afterThreeToggles = (0, import_calling.reducer)(afterTwoToggles, toggleSettings());
        import_chai.assert.isTrue(afterOneToggle.activeCallState?.settingsDialogOpen);
        import_chai.assert.isFalse(afterTwoToggles.activeCallState?.settingsDialogOpen);
        import_chai.assert.isTrue(afterThreeToggles.activeCallState?.settingsDialogOpen);
      });
    });
    describe("toggleParticipants", () => {
      const { toggleParticipants } = import_calling.actions;
      it("toggles the participants list", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveDirectCall, toggleParticipants());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, toggleParticipants());
        const afterThreeToggles = (0, import_calling.reducer)(afterTwoToggles, toggleParticipants());
        import_chai.assert.isTrue(afterOneToggle.activeCallState?.showParticipantsList);
        import_chai.assert.isFalse(afterTwoToggles.activeCallState?.showParticipantsList);
        import_chai.assert.isTrue(afterThreeToggles.activeCallState?.showParticipantsList);
      });
    });
    describe("togglePip", () => {
      const { togglePip } = import_calling.actions;
      it("toggles the PiP", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveDirectCall, togglePip());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, togglePip());
        const afterThreeToggles = (0, import_calling.reducer)(afterTwoToggles, togglePip());
        import_chai.assert.isTrue(afterOneToggle.activeCallState?.pip);
        import_chai.assert.isFalse(afterTwoToggles.activeCallState?.pip);
        import_chai.assert.isTrue(afterThreeToggles.activeCallState?.pip);
      });
    });
    describe("toggleSpeakerView", () => {
      const { toggleSpeakerView } = import_calling.actions;
      it("toggles speaker view from grid view", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveGroupCall, toggleSpeakerView());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, toggleSpeakerView());
        const afterThreeToggles = (0, import_calling.reducer)(afterTwoToggles, toggleSpeakerView());
        import_chai.assert.strictEqual(afterOneToggle.activeCallState?.viewMode, import_Calling.CallViewMode.Speaker);
        import_chai.assert.strictEqual(afterTwoToggles.activeCallState?.viewMode, import_Calling.CallViewMode.Grid);
        import_chai.assert.strictEqual(afterThreeToggles.activeCallState?.viewMode, import_Calling.CallViewMode.Speaker);
      });
      it("toggles speaker view from presentation view", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActivePresentationViewGroupCall, toggleSpeakerView());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, toggleSpeakerView());
        const afterThreeToggles = (0, import_calling.reducer)(afterTwoToggles, toggleSpeakerView());
        import_chai.assert.strictEqual(afterOneToggle.activeCallState?.viewMode, import_Calling.CallViewMode.Grid);
        import_chai.assert.strictEqual(afterTwoToggles.activeCallState?.viewMode, import_Calling.CallViewMode.Speaker);
        import_chai.assert.strictEqual(afterThreeToggles.activeCallState?.viewMode, import_Calling.CallViewMode.Grid);
      });
    });
    describe("switchToPresentationView", () => {
      const { switchToPresentationView, switchFromPresentationView } = import_calling.actions;
      it("toggles presentation view from grid view", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveGroupCall, switchToPresentationView());
        const afterTwoToggles = (0, import_calling.reducer)(afterOneToggle, switchToPresentationView());
        const finalState = (0, import_calling.reducer)(afterOneToggle, switchFromPresentationView());
        import_chai.assert.strictEqual(afterOneToggle.activeCallState?.viewMode, import_Calling.CallViewMode.Presentation);
        import_chai.assert.strictEqual(afterTwoToggles.activeCallState?.viewMode, import_Calling.CallViewMode.Presentation);
        import_chai.assert.strictEqual(finalState.activeCallState?.viewMode, import_Calling.CallViewMode.Grid);
      });
      it("does not toggle presentation view from speaker view", () => {
        const afterOneToggle = (0, import_calling.reducer)(stateWithActiveSpeakerViewGroupCall, switchToPresentationView());
        const finalState = (0, import_calling.reducer)(afterOneToggle, switchFromPresentationView());
        import_chai.assert.strictEqual(afterOneToggle.activeCallState?.viewMode, import_Calling.CallViewMode.Speaker);
        import_chai.assert.strictEqual(finalState.activeCallState?.viewMode, import_Calling.CallViewMode.Speaker);
      });
    });
  });
  describe("helpers", () => {
    describe("getActiveCall", () => {
      it("returns undefined if there are no calls", () => {
        import_chai.assert.isUndefined((0, import_calling.getActiveCall)((0, import_calling.getEmptyState)()));
      });
      it("returns undefined if there is no active call", () => {
        import_chai.assert.isUndefined((0, import_calling.getActiveCall)(stateWithDirectCall));
      });
      it("returns the active call", () => {
        import_chai.assert.deepEqual((0, import_calling.getActiveCall)(stateWithActiveDirectCall), {
          callMode: import_Calling.CallMode.Direct,
          conversationId: "fake-direct-call-conversation-id",
          callState: import_Calling.CallState.Accepted,
          isIncoming: false,
          isVideoCall: false,
          hasRemoteVideo: false
        });
      });
    });
    describe("isAnybodyElseInGroupCall", () => {
      it("returns false with no peek info", () => {
        import_chai.assert.isFalse((0, import_calling.isAnybodyElseInGroupCall)(void 0, remoteUuid));
      });
      it("returns false if the peek info has no participants", () => {
        import_chai.assert.isFalse((0, import_calling.isAnybodyElseInGroupCall)({ uuids: [] }, remoteUuid));
      });
      it("returns false if the peek info has one participant, you", () => {
        import_chai.assert.isFalse((0, import_calling.isAnybodyElseInGroupCall)({ uuids: [creatorUuid] }, creatorUuid));
      });
      it("returns true if the peek info has one participant, someone else", () => {
        import_chai.assert.isTrue((0, import_calling.isAnybodyElseInGroupCall)({ uuids: [creatorUuid] }, remoteUuid));
      });
      it("returns true if the peek info has two participants, you and someone else", () => {
        import_chai.assert.isTrue((0, import_calling.isAnybodyElseInGroupCall)({ uuids: [creatorUuid, remoteUuid] }, remoteUuid));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FsbGluZ190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBjbG9uZURlZXAsIG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgYXMgUm9vdFN0YXRlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL3JlZHVjZXInO1xuaW1wb3J0IHsgcmVkdWNlciBhcyByb290UmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL3JlZHVjZXInO1xuaW1wb3J0IHsgbm9vcEFjdGlvbiB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL25vb3AnO1xuaW1wb3J0IHR5cGUge1xuICBDYWxsaW5nU3RhdGVUeXBlLFxuICBHcm91cENhbGxTdGF0ZUNoYW5nZUFjdGlvblR5cGUsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2NhbGxpbmcnO1xuaW1wb3J0IHtcbiAgYWN0aW9ucyxcbiAgZ2V0QWN0aXZlQ2FsbCxcbiAgZ2V0RW1wdHlTdGF0ZSxcbiAgaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsLFxuICByZWR1Y2VyLFxufSBmcm9tICcuLi8uLi8uLi9zdGF0ZS9kdWNrcy9jYWxsaW5nJztcbmltcG9ydCB7IHRydW5jYXRlQXVkaW9MZXZlbCB9IGZyb20gJy4uLy4uLy4uL2NhbGxpbmcvdHJ1bmNhdGVBdWRpb0xldmVsJztcbmltcG9ydCB7IGNhbGxpbmcgYXMgY2FsbGluZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jYWxsaW5nJztcbmltcG9ydCB7XG4gIENhbGxNb2RlLFxuICBDYWxsU3RhdGUsXG4gIENhbGxWaWV3TW9kZSxcbiAgR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLFxuICBHcm91cENhbGxKb2luU3RhdGUsXG59IGZyb20gJy4uLy4uLy4uL3R5cGVzL0NhbGxpbmcnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL3Rlc3QtYm90aC9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuaW1wb3J0IHR5cGUgeyBVbndyYXBQcm9taXNlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvVXRpbCc7XG5cbmRlc2NyaWJlKCdjYWxsaW5nIGR1Y2snLCAoKSA9PiB7XG4gIGNvbnN0IHN0YXRlV2l0aERpcmVjdENhbGw6IENhbGxpbmdTdGF0ZVR5cGUgPSB7XG4gICAgLi4uZ2V0RW1wdHlTdGF0ZSgpLFxuICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCBhcyBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICBjYWxsU3RhdGU6IENhbGxTdGF0ZS5BY2NlcHRlZCxcbiAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgIGlzVmlkZW9DYWxsOiBmYWxzZSxcbiAgICAgICAgaGFzUmVtb3RlVmlkZW86IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwgPSB7XG4gICAgLi4uc3RhdGVXaXRoRGlyZWN0Q2FsbCxcbiAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgIGhhc0xvY2FsVmlkZW86IGZhbHNlLFxuICAgICAgbG9jYWxBdWRpb0xldmVsOiAwLFxuICAgICAgdmlld01vZGU6IENhbGxWaWV3TW9kZS5HcmlkLFxuICAgICAgc2hvd1BhcnRpY2lwYW50c0xpc3Q6IGZhbHNlLFxuICAgICAgc2FmZXR5TnVtYmVyQ2hhbmdlZFV1aWRzOiBbXSxcbiAgICAgIG91dGdvaW5nUmluZzogdHJ1ZSxcbiAgICAgIHBpcDogZmFsc2UsXG4gICAgICBzZXR0aW5nc0RpYWxvZ09wZW46IGZhbHNlLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgc3RhdGVXaXRoSW5jb21pbmdEaXJlY3RDYWxsID0ge1xuICAgIC4uLmdldEVtcHR5U3RhdGUoKSxcbiAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnOiB7XG4gICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QgYXMgQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgY2FsbFN0YXRlOiBDYWxsU3RhdGUuUmluZ2luZyxcbiAgICAgICAgaXNJbmNvbWluZzogdHJ1ZSxcbiAgICAgICAgaXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICBoYXNSZW1vdGVWaWRlbzogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY3JlYXRvclV1aWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgY29uc3QgZGlmZmVyZW50Q3JlYXRvclV1aWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgY29uc3QgcmVtb3RlVXVpZCA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuICBjb25zdCByaW5nZXJVdWlkID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG5cbiAgY29uc3Qgc3RhdGVXaXRoR3JvdXBDYWxsID0ge1xuICAgIC4uLmdldEVtcHR5U3RhdGUoKSxcbiAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwIGFzIENhbGxNb2RlLkdyb3VwLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCxcbiAgICAgICAgcGVla0luZm86IHtcbiAgICAgICAgICB1dWlkczogW2NyZWF0b3JVdWlkXSxcbiAgICAgICAgICBjcmVhdG9yVXVpZCxcbiAgICAgICAgICBlcmFJZDogJ3h5eicsXG4gICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHV1aWQ6IHJlbW90ZVV1aWQsXG4gICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICBoYXNSZW1vdGVBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICBzaGFyaW5nU2NyZWVuOiBmYWxzZSxcbiAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDQgLyAzLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgc3RhdGVXaXRoSW5jb21pbmdHcm91cENhbGwgPSB7XG4gICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLFxuICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbC5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnOiB7XG4gICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbC5jYWxsc0J5Q29udmVyc2F0aW9uW1xuICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICBdLFxuICAgICAgICByaW5nSWQ6IEJpZ0ludCgxMjMpLFxuICAgICAgICByaW5nZXJVdWlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBzdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwgPSB7XG4gICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLFxuICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgIGxvY2FsQXVkaW9MZXZlbDogMCxcbiAgICAgIHZpZXdNb2RlOiBDYWxsVmlld01vZGUuR3JpZCxcbiAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogW10sXG4gICAgICBvdXRnb2luZ1Jpbmc6IGZhbHNlLFxuICAgICAgcGlwOiBmYWxzZSxcbiAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogZmFsc2UsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBzdGF0ZVdpdGhBY3RpdmVQcmVzZW50YXRpb25WaWV3R3JvdXBDYWxsID0ge1xuICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbCxcbiAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbC5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvbixcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHN0YXRlV2l0aEFjdGl2ZVNwZWFrZXJWaWV3R3JvdXBDYWxsID0ge1xuICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbCxcbiAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbC5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLlNwZWFrZXIsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBvdXJBQ0kgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcblxuICBjb25zdCBnZXRFbXB0eVJvb3RTdGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCByb290U3RhdGUgPSByb290UmVkdWNlcih1bmRlZmluZWQsIG5vb3BBY3Rpb24oKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnJvb3RTdGF0ZSxcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgLi4ucm9vdFN0YXRlLnVzZXIsXG4gICAgICAgIG91ckFDSSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfTtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uIGJlZm9yZUVhY2goKSB7XG4gICAgdGhpcy5zYW5kYm94ID0gc2lub24uY3JlYXRlU2FuZGJveCgpO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24gYWZ0ZXJFYWNoKCkge1xuICAgIHRoaXMuc2FuZGJveC5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhY3Rpb25zJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdnZXRQcmVzZW50aW5nU291cmNlcycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZUdldFByZXNlbnRpbmdTb3VyY2VzID0gdGhpcy5zYW5kYm94XG4gICAgICAgICAgLnN0dWIoY2FsbGluZ1NlcnZpY2UsICdnZXRQcmVzZW50aW5nU291cmNlcycpXG4gICAgICAgICAgLnJlc29sdmVzKFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICdmb28uYmFyJyxcbiAgICAgICAgICAgICAgbmFtZTogJ0ZvbyBCYXInLFxuICAgICAgICAgICAgICB0aHVtYm5haWw6ICd4eXonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0cmlldmVzIHNvdXJjZXMgZnJvbSB0aGUgY2FsbGluZyBzZXJ2aWNlJywgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgICAgY29uc3QgeyBnZXRQcmVzZW50aW5nU291cmNlcyB9ID0gYWN0aW9ucztcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgICAgYXdhaXQgZ2V0UHJlc2VudGluZ1NvdXJjZXMoKShkaXNwYXRjaCwgZ2V0RW1wdHlSb290U3RhdGUsIG51bGwpO1xuXG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHRoaXMuY2FsbGluZ1NlcnZpY2VHZXRQcmVzZW50aW5nU291cmNlcyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2Rpc3BhdGNoZXMgU0VUX1BSRVNFTlRJTkdfU09VUkNFUycsIGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2V0UHJlc2VudGluZ1NvdXJjZXMgfSA9IGFjdGlvbnM7XG4gICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgIGF3YWl0IGdldFByZXNlbnRpbmdTb3VyY2VzKCkoZGlzcGF0Y2gsIGdldEVtcHR5Um9vdFN0YXRlLCBudWxsKTtcblxuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShkaXNwYXRjaCk7XG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGRpc3BhdGNoLCB7XG4gICAgICAgICAgdHlwZTogJ2NhbGxpbmcvU0VUX1BSRVNFTlRJTkdfU09VUkNFUycsXG4gICAgICAgICAgcGF5bG9hZDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJ2Zvby5iYXInLFxuICAgICAgICAgICAgICBuYW1lOiAnRm9vIEJhcicsXG4gICAgICAgICAgICAgIHRodW1ibmFpbDogJ3h5eicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmVtb3RlU2hhcmluZ1NjcmVlbkNoYW5nZScsICgpID0+IHtcbiAgICAgIGl0KFwidXBkYXRlcyB3aGV0aGVyIHNvbWVvbmUncyBzY3JlZW4gaXMgYmVpbmcgc2hhcmVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgeyByZW1vdGVTaGFyaW5nU2NyZWVuQ2hhbmdlIH0gPSBhY3Rpb25zO1xuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgaXNTaGFyaW5nU2NyZWVuOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIHJlbW90ZVNoYXJpbmdTY3JlZW5DaGFuZ2UocGF5bG9hZCkpO1xuXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkU3RhdGUgPSB7XG4gICAgICAgICAgLi4uc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCxcbiAgICAgICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnOiB7XG4gICAgICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwuY2FsbHNCeUNvbnZlcnNhdGlvbltcbiAgICAgICAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIGlzU2hhcmluZ1NjcmVlbjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG5leHRTdGF0ZSwgZXhwZWN0ZWRTdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZXRQcmVzZW50aW5nJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiBiZWZvcmVFYWNoKCkge1xuICAgICAgICB0aGlzLmNhbGxpbmdTZXJ2aWNlU2V0UHJlc2VudGluZyA9IHRoaXMuc2FuZGJveC5zdHViKFxuICAgICAgICAgIGNhbGxpbmdTZXJ2aWNlLFxuICAgICAgICAgICdzZXRQcmVzZW50aW5nJ1xuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdjYWxscyBzZXRQcmVzZW50aW5nIG9uIHRoZSBjYWxsaW5nIHNlcnZpY2UnLCBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgICBjb25zdCB7IHNldFByZXNlbnRpbmcgfSA9IGFjdGlvbnM7XG4gICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgIGNvbnN0IHByZXNlbnRlZFNvdXJjZSA9IHtcbiAgICAgICAgICBpZDogJ3dpbmRvdzo3ODYnLFxuICAgICAgICAgIG5hbWU6ICdBcHBsaWNhdGlvbicsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgIGNhbGxpbmc6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXRQcmVzZW50aW5nKHByZXNlbnRlZFNvdXJjZSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZSh0aGlzLmNhbGxpbmdTZXJ2aWNlU2V0UHJlc2VudGluZyk7XG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgICAgIHRoaXMuY2FsbGluZ1NlcnZpY2VTZXRQcmVzZW50aW5nLFxuICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICBwcmVzZW50ZWRTb3VyY2VcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZGlzcGF0Y2hlcyBTRVRfUFJFU0VOVElORycsICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBzZXRQcmVzZW50aW5nIH0gPSBhY3Rpb25zO1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgICBjb25zdCBwcmVzZW50ZWRTb3VyY2UgPSB7XG4gICAgICAgICAgaWQ6ICd3aW5kb3c6Nzg2JyxcbiAgICAgICAgICBuYW1lOiAnQXBwbGljYXRpb24nLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+ICh7XG4gICAgICAgICAgLi4uZ2V0RW1wdHlSb290U3RhdGUoKSxcbiAgICAgICAgICBjYWxsaW5nOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0UHJlc2VudGluZyhwcmVzZW50ZWRTb3VyY2UpKGRpc3BhdGNoLCBnZXRTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZGlzcGF0Y2gpO1xuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChkaXNwYXRjaCwge1xuICAgICAgICAgIHR5cGU6ICdjYWxsaW5nL1NFVF9QUkVTRU5USU5HJyxcbiAgICAgICAgICBwYXlsb2FkOiBwcmVzZW50ZWRTb3VyY2UsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCd0dXJucyBvZmYgcHJlc2VudGluZyB3aGVuIG5vIHZhbHVlIGlzIHBhc3NlZCBpbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgICAgY29uc3QgeyBzZXRQcmVzZW50aW5nIH0gPSBhY3Rpb25zO1xuICAgICAgICBjb25zdCBwcmVzZW50ZWRTb3VyY2UgPSB7XG4gICAgICAgICAgaWQ6ICd3aW5kb3c6Nzg2JyxcbiAgICAgICAgICBuYW1lOiAnQXBwbGljYXRpb24nLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgIGNhbGxpbmc6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXRQcmVzZW50aW5nKHByZXNlbnRlZFNvdXJjZSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBkaXNwYXRjaC5nZXRDYWxsKDApLmFyZ3NbMF07XG5cbiAgICAgICAgY29uc3QgbmV4dFN0YXRlID0gcmVkdWNlcihnZXRTdGF0ZSgpLmNhbGxpbmcsIGFjdGlvbik7XG5cbiAgICAgICAgYXNzZXJ0LmlzRGVmaW5lZChuZXh0U3RhdGUuYWN0aXZlQ2FsbFN0YXRlKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgIG5leHRTdGF0ZS5hY3RpdmVDYWxsU3RhdGU/LnByZXNlbnRpbmdTb3VyY2UsXG4gICAgICAgICAgcHJlc2VudGVkU291cmNlXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgICBuZXh0U3RhdGUuYWN0aXZlQ2FsbFN0YXRlPy5wcmVzZW50aW5nU291cmNlc0F2YWlsYWJsZVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzZXRzIHRoZSBwcmVzZW50aW5nIHZhbHVlIHdoZW4gb25lIGlzIHBhc3NlZCBpbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgICAgY29uc3QgeyBzZXRQcmVzZW50aW5nIH0gPSBhY3Rpb25zO1xuXG4gICAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgIGNhbGxpbmc6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXRQcmVzZW50aW5nKCkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBkaXNwYXRjaC5nZXRDYWxsKDApLmFyZ3NbMF07XG5cbiAgICAgICAgY29uc3QgbmV4dFN0YXRlID0gcmVkdWNlcihnZXRTdGF0ZSgpLmNhbGxpbmcsIGFjdGlvbik7XG5cbiAgICAgICAgYXNzZXJ0LmlzRGVmaW5lZChuZXh0U3RhdGUuYWN0aXZlQ2FsbFN0YXRlKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG5leHRTdGF0ZS5hY3RpdmVDYWxsU3RhdGU/LnByZXNlbnRpbmdTb3VyY2UpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoXG4gICAgICAgICAgbmV4dFN0YXRlLmFjdGl2ZUNhbGxTdGF0ZT8ucHJlc2VudGluZ1NvdXJjZXNBdmFpbGFibGVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FjY2VwdENhbGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGFjY2VwdENhbGwgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZUFjY2VwdCA9IHRoaXMuc2FuZGJveFxuICAgICAgICAgIC5zdHViKGNhbGxpbmdTZXJ2aWNlLCAnYWNjZXB0RGlyZWN0Q2FsbCcpXG4gICAgICAgICAgLnJlc29sdmVzKCk7XG4gICAgICAgIHRoaXMuY2FsbGluZ1NlcnZpY2VKb2luID0gdGhpcy5zYW5kYm94XG4gICAgICAgICAgLnN0dWIoY2FsbGluZ1NlcnZpY2UsICdqb2luR3JvdXBDYWxsJylcbiAgICAgICAgICAucmVzb2x2ZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnYWNjZXB0aW5nIGEgZGlyZWN0IGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgIGNhbGxpbmc6IHN0YXRlV2l0aEluY29taW5nRGlyZWN0Q2FsbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Rpc3BhdGNoZXMgYW4gQUNDRVBUX0NBTExfUEVORElORyBhY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcblxuICAgICAgICAgIGF3YWl0IGFjY2VwdENhbGwoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBhc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgICB9KShkaXNwYXRjaCwgZ2V0U3RhdGUsIG51bGwpO1xuXG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZGlzcGF0Y2gpO1xuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGRpc3BhdGNoLCB7XG4gICAgICAgICAgICB0eXBlOiAnY2FsbGluZy9BQ0NFUFRfQ0FMTF9QRU5ESU5HJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICAgIGFzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGF3YWl0IGFjY2VwdENhbGwoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBhc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRUd2ljZShkaXNwYXRjaCk7XG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoZGlzcGF0Y2gsIHtcbiAgICAgICAgICAgIHR5cGU6ICdjYWxsaW5nL0FDQ0VQVF9DQUxMX1BFTkRJTkcnLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgICAgYXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Fza3MgdGhlIGNhbGxpbmcgc2VydmljZSB0byBhY2NlcHQgdGhlIGNhbGwnLCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG5cbiAgICAgICAgICBhd2FpdCBhY2NlcHRDYWxsKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgYXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHRoaXMuY2FsbGluZ1NlcnZpY2VBY2NlcHQpO1xuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZUFjY2VwdCxcbiAgICAgICAgICAgICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGF3YWl0IGFjY2VwdENhbGwoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBhc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRUd2ljZSh0aGlzLmNhbGxpbmdTZXJ2aWNlQWNjZXB0KTtcbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRoaXMuY2FsbGluZ1NlcnZpY2VBY2NlcHQsXG4gICAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndXBkYXRlcyB0aGUgYWN0aXZlIGNhbGwgc3RhdGUgd2l0aCBBQ0NFUFRfQ0FMTF9QRU5ESU5HJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgICAgYXdhaXQgYWNjZXB0Q2FsbCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGFzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgIH0pKGRpc3BhdGNoLCBnZXRTdGF0ZSwgbnVsbCk7XG4gICAgICAgICAgY29uc3QgYWN0aW9uID0gZGlzcGF0Y2guZ2V0Q2FsbCgwKS5hcmdzWzBdO1xuXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihzdGF0ZVdpdGhJbmNvbWluZ0RpcmVjdENhbGwsIGFjdGlvbik7XG5cbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdC5hY3RpdmVDYWxsU3RhdGUsIHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAsXG4gICAgICAgICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLkdyaWQsXG4gICAgICAgICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogZmFsc2UsXG4gICAgICAgICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHM6IFtdLFxuICAgICAgICAgICAgb3V0Z29pbmdSaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgICAgICBzZXR0aW5nc0RpYWxvZ09wZW46IGZhbHNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnYWNjZXB0aW5nIGEgZ3JvdXAgY2FsbCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgZ2V0U3RhdGUgPSAoKSA9PiAoe1xuICAgICAgICAgIC4uLmdldEVtcHR5Um9vdFN0YXRlKCksXG4gICAgICAgICAgY2FsbGluZzogc3RhdGVXaXRoSW5jb21pbmdHcm91cENhbGwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNwYXRjaGVzIGFuIEFDQ0VQVF9DQUxMX1BFTkRJTkcgYWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG5cbiAgICAgICAgICBhd2FpdCBhY2NlcHRDYWxsKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBhc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgICB9KShkaXNwYXRjaCwgZ2V0U3RhdGUsIG51bGwpO1xuXG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZGlzcGF0Y2gpO1xuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGRpc3BhdGNoLCB7XG4gICAgICAgICAgICB0eXBlOiAnY2FsbGluZy9BQ0NFUFRfQ0FMTF9QRU5ESU5HJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgICAgYXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgYWNjZXB0Q2FsbCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgYXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICAgIH0pKGRpc3BhdGNoLCBnZXRTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkVHdpY2UoZGlzcGF0Y2gpO1xuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGRpc3BhdGNoLCB7XG4gICAgICAgICAgICB0eXBlOiAnY2FsbGluZy9BQ0NFUFRfQ0FMTF9QRU5ESU5HJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgICAgYXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Fza3MgdGhlIGNhbGxpbmcgc2VydmljZSB0byBqb2luIHRoZSBjYWxsJywgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuXG4gICAgICAgICAgYXdhaXQgYWNjZXB0Q2FsbCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgYXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHRoaXMuY2FsbGluZ1NlcnZpY2VKb2luKTtcbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRoaXMuY2FsbGluZ1NlcnZpY2VKb2luLFxuICAgICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgYXdhaXQgYWNjZXB0Q2FsbCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgYXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICAgIH0pKGRpc3BhdGNoLCBnZXRTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkVHdpY2UodGhpcy5jYWxsaW5nU2VydmljZUpvaW4pO1xuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZUpvaW4sXG4gICAgICAgICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndXBkYXRlcyB0aGUgYWN0aXZlIGNhbGwgc3RhdGUgd2l0aCBBQ0NFUFRfQ0FMTF9QRU5ESU5HJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgICAgYXdhaXQgYWNjZXB0Q2FsbCh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgYXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcbiAgICAgICAgICBjb25zdCBhY3Rpb24gPSBkaXNwYXRjaC5nZXRDYWxsKDApLmFyZ3NbMF07XG5cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQuYWN0aXZlQ2FsbFN0YXRlLCB7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAsXG4gICAgICAgICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLkdyaWQsXG4gICAgICAgICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogZmFsc2UsXG4gICAgICAgICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHM6IFtdLFxuICAgICAgICAgICAgb3V0Z29pbmdSaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgICAgICBzZXR0aW5nc0RpYWxvZ09wZW46IGZhbHNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NhbmNlbENhbGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNhbmNlbENhbGwgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZVN0b3BDYWxsaW5nTG9iYnkgPSB0aGlzLnNhbmRib3guc3R1YihcbiAgICAgICAgICBjYWxsaW5nU2VydmljZSxcbiAgICAgICAgICAnc3RvcENhbGxpbmdMb2JieSdcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc3RvcHMgdGhlIGNhbGxpbmcgbG9iYnkgZm9yIHRoYXQgY29udmVyc2F0aW9uJywgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgICAgY2FuY2VsQ2FsbCh7IGNvbnZlcnNhdGlvbklkOiAnMTIzJyB9KTtcblxuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZSh0aGlzLmNhbGxpbmdTZXJ2aWNlU3RvcENhbGxpbmdMb2JieSk7XG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKHRoaXMuY2FsbGluZ1NlcnZpY2VTdG9wQ2FsbGluZ0xvYmJ5LCAnMTIzJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2NvbXBsZXRlbHkgcmVtb3ZlcyBhbiBhY3RpdmUgZGlyZWN0IGNhbGwgZnJvbSB0aGUgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCxcbiAgICAgICAgICBjYW5jZWxDYWxsKHsgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQubm90UHJvcGVydHkoXG4gICAgICAgICAgcmVzdWx0LmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JlbW92ZXMgdGhlIGFjdGl2ZSBncm91cCBjYWxsLCBidXQgbGVhdmVzIGl0IGluIHRoZSBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwsXG4gICAgICAgICAgY2FuY2VsQ2FsbCh7IGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQucHJvcGVydHkoXG4gICAgICAgICAgcmVzdWx0LmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChyZXN1bHQuYWN0aXZlQ2FsbFN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY2FuY2VsSW5jb21pbmdHcm91cENhbGxSaW5nIH0gPSBhY3Rpb25zO1xuXG4gICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZXJlIGlzIG5vIGFzc29jaWF0ZWQgZ3JvdXAgY2FsbCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBnZXRFbXB0eVN0YXRlKCk7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGNhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZyh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdnYXJiYWdlJyxcbiAgICAgICAgICByaW5nSWQ6IEJpZ0ludCgxKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0LCBzdGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJkb2VzIG5vdGhpbmcgaWYgdGhlIHJpbmcgdG8gY2FuY2VsIGlzbid0IHRoZSBzYW1lIG9uZVwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGNhbmNlbEluY29taW5nR3JvdXBDYWxsUmluZyh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICByaW5nSWQ6IEJpZ0ludCg5OTkpLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQsIHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmVtb3ZlcyB0aGUgcmluZyBzdGF0ZSwgYnV0IG5vdCB0aGUgY2FsbCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gY2FuY2VsSW5jb21pbmdHcm91cENhbGxSaW5nKHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIHJpbmdJZDogQmlnSW50KDEyMyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoc3RhdGVXaXRoSW5jb21pbmdHcm91cENhbGwsIGFjdGlvbik7XG4gICAgICAgIGNvbnN0IGNhbGwgPVxuICAgICAgICAgIHJlc3VsdC5jYWxsc0J5Q29udmVyc2F0aW9uWydmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ107XG4gICAgICAgIC8vIEl0J2QgYmUgbmljZSB0byBkbyB0aGlzIHdpdGggYW4gYXNzZXJ0LCBidXQgQ2hhaSBkb2Vzbid0IHVuZGVyc3RhbmQgaXQuXG4gICAgICAgIGlmIChjYWxsPy5jYWxsTW9kZSAhPT0gQ2FsbE1vZGUuR3JvdXApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHRvIGZpbmQgYSBncm91cCBjYWxsJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoY2FsbC5yaW5nSWQpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoY2FsbC5yaW5nZXJVdWlkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2RlY2xpbmVDYWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBkZWNsaW5lQ2FsbCB9ID0gYWN0aW9ucztcblxuICAgICAgbGV0IGRlY2xpbmVEaXJlY3RDYWxsOiBzaW5vbi5TaW5vblN0dWI7XG4gICAgICBsZXQgZGVjbGluZUdyb3VwQ2FsbDogc2lub24uU2lub25TdHViO1xuXG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uIGJlZm9yZUVhY2goKSB7XG4gICAgICAgIGRlY2xpbmVEaXJlY3RDYWxsID0gdGhpcy5zYW5kYm94LnN0dWIoXG4gICAgICAgICAgY2FsbGluZ1NlcnZpY2UsXG4gICAgICAgICAgJ2RlY2xpbmVEaXJlY3RDYWxsJ1xuICAgICAgICApO1xuICAgICAgICBkZWNsaW5lR3JvdXBDYWxsID0gdGhpcy5zYW5kYm94LnN0dWIoXG4gICAgICAgICAgY2FsbGluZ1NlcnZpY2UsXG4gICAgICAgICAgJ2RlY2xpbmVHcm91cENhbGwnXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2RlY2xpbmluZyBhIGRpcmVjdCBjYWxsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+ICh7XG4gICAgICAgICAgLi4uZ2V0RW1wdHlSb290U3RhdGUoKSxcbiAgICAgICAgICBjYWxsaW5nOiBzdGF0ZVdpdGhJbmNvbWluZ0RpcmVjdENhbGwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNwYXRjaGVzIGEgREVDTElORV9ESVJFQ1RfQ0FMTCBhY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcblxuICAgICAgICAgIGRlY2xpbmVDYWxsKHsgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcgfSkoXG4gICAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICAgIGdldFN0YXRlLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShkaXNwYXRjaCk7XG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoZGlzcGF0Y2gsIHtcbiAgICAgICAgICAgIHR5cGU6ICdjYWxsaW5nL0RFQ0xJTkVfRElSRUNUX0NBTEwnLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhc2tzIHRoZSBjYWxsaW5nIHNlcnZpY2UgdG8gZGVjbGluZSB0aGUgY2FsbCcsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuXG4gICAgICAgICAgZGVjbGluZUNhbGwoeyBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyB9KShcbiAgICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICAgZ2V0U3RhdGUsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKGRlY2xpbmVEaXJlY3RDYWxsKTtcbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICAgIGRlY2xpbmVEaXJlY3RDYWxsLFxuICAgICAgICAgICAgJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIHRoZSBjYWxsIGZyb20gdGhlIHN0YXRlJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgICAgZGVjbGluZUNhbGwoeyBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyB9KShcbiAgICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICAgZ2V0U3RhdGUsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBhY3Rpb24gPSBkaXNwYXRjaC5nZXRDYWxsKDApLmFyZ3NbMF07XG5cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgICAgYXNzZXJ0Lm5vdFByb3BlcnR5KFxuICAgICAgICAgICAgcmVzdWx0LmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2RlY2xpbmluZyBhIGdyb3VwIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgIGNhbGxpbmc6IHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsLFxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZGlzcGF0Y2hlcyBhIENBTkNFTF9JTkNPTUlOR19HUk9VUF9DQUxMX1JJTkcgYWN0aW9uJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG5cbiAgICAgICAgICBkZWNsaW5lQ2FsbCh7IGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcgfSkoXG4gICAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICAgIGdldFN0YXRlLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShkaXNwYXRjaCk7XG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoZGlzcGF0Y2gsIHtcbiAgICAgICAgICAgIHR5cGU6ICdjYWxsaW5nL0NBTkNFTF9JTkNPTUlOR19HUk9VUF9DQUxMX1JJTkcnLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgICByaW5nSWQ6IEJpZ0ludCgxMjMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Fza3MgdGhlIGNhbGxpbmcgc2VydmljZSB0byBkZWNsaW5lIHRoZSBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG5cbiAgICAgICAgICBkZWNsaW5lQ2FsbCh7IGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcgfSkoXG4gICAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICAgIGdldFN0YXRlLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShkZWNsaW5lR3JvdXBDYWxsKTtcbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICAgIGRlY2xpbmVHcm91cENhbGwsXG4gICAgICAgICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBCaWdJbnQoMTIzKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5PVEU6IFRoZSBzdGF0ZSBlZmZlY3RzIG9mIHRoaXMgYWN0aW9uIGFyZSB0ZXN0ZWQgd2l0aFxuICAgICAgICAvLyAgIGBjYW5jZWxJbmNvbWluZ0dyb3VwQ2FsbFJpbmdgLlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ3JvdXBDYWxsQXVkaW9MZXZlbHNDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGdyb3VwQ2FsbEF1ZGlvTGV2ZWxzQ2hhbmdlIH0gPSBhY3Rpb25zO1xuXG4gICAgICBjb25zdCByZW1vdGVEZXZpY2VTdGF0ZXMgPSBbXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMC4zLCBkZW11eElkOiAxIH0sXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMC40LCBkZW11eElkOiAyIH0sXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMC41LCBkZW11eElkOiAzIH0sXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMC4yLCBkZW11eElkOiA3IH0sXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMC4xLCBkZW11eElkOiA4IH0sXG4gICAgICAgIHsgYXVkaW9MZXZlbDogMCwgZGVtdXhJZDogOSB9LFxuICAgICAgXTtcblxuICAgICAgY29uc3QgcmVtb3RlQXVkaW9MZXZlbHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPihbXG4gICAgICAgIFsxLCB0cnVuY2F0ZUF1ZGlvTGV2ZWwoMC4zKV0sXG4gICAgICAgIFsyLCB0cnVuY2F0ZUF1ZGlvTGV2ZWwoMC40KV0sXG4gICAgICAgIFszLCB0cnVuY2F0ZUF1ZGlvTGV2ZWwoMC41KV0sXG4gICAgICAgIFs3LCB0cnVuY2F0ZUF1ZGlvTGV2ZWwoMC4yKV0sXG4gICAgICAgIFs4LCB0cnVuY2F0ZUF1ZGlvTGV2ZWwoMC4xKV0sXG4gICAgICBdKTtcblxuICAgICAgaXQoXCJkb2VzIG5vdGhpbmcgaWYgdGhlcmUncyBubyByZWxldmFudCBjYWxsXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gZ3JvdXBDYWxsQXVkaW9MZXZlbHNDaGFuZ2Uoe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZ2FyYmFnZScsXG4gICAgICAgICAgbG9jYWxBdWRpb0xldmVsOiAxLFxuICAgICAgICAgIHJlbW90ZURldmljZVN0YXRlcyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihzdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwsIGFjdGlvbik7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdCwgc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSBzdGF0ZSBjaGFuZ2Ugd291bGQgYmUgYSBuby1vcCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgICAgLi4uc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsLFxuICAgICAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJzoge1xuICAgICAgICAgICAgICAuLi5zdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwuY2FsbHNCeUNvbnZlcnNhdGlvbltcbiAgICAgICAgICAgICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCdcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcmVtb3RlQXVkaW9MZXZlbHMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGdyb3VwQ2FsbEF1ZGlvTGV2ZWxzQ2hhbmdlKHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIGxvY2FsQXVkaW9MZXZlbDogMC4wMDEsXG4gICAgICAgICAgcmVtb3RlRGV2aWNlU3RhdGVzLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQsIHN0YXRlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgndXBkYXRlcyB0aGUgc2V0IG9mIHNwZWFraW5nIHBhcnRpY2lwYW50cywgaW5jbHVkaW5nIHlvdXJzZWxmJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBncm91cENhbGxBdWRpb0xldmVsc0NoYW5nZSh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAuOCxcbiAgICAgICAgICByZW1vdGVEZXZpY2VTdGF0ZXMsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbCwgYWN0aW9uKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgcmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8ubG9jYWxBdWRpb0xldmVsLFxuICAgICAgICAgIHRydW5jYXRlQXVkaW9MZXZlbCgwLjgpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY2FsbCA9XG4gICAgICAgICAgcmVzdWx0LmNhbGxzQnlDb252ZXJzYXRpb25bJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnXTtcbiAgICAgICAgaWYgKGNhbGw/LmNhbGxNb2RlICE9PSBDYWxsTW9kZS5Hcm91cCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBncm91cCBjYWxsIHRvIGJlIGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChjYWxsLnJlbW90ZUF1ZGlvTGV2ZWxzLCByZW1vdGVBdWRpb0xldmVscyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdncm91cENhbGxTdGF0ZUNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgZ3JvdXBDYWxsU3RhdGVDaGFuZ2UgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGZ1bmN0aW9uIGdldEFjdGlvbihcbiAgICAgICAgLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgZ3JvdXBDYWxsU3RhdGVDaGFuZ2U+XG4gICAgICApOiBHcm91cENhbGxTdGF0ZUNoYW5nZUFjdGlvblR5cGUge1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuXG4gICAgICAgIGdyb3VwQ2FsbFN0YXRlQ2hhbmdlKC4uLmFyZ3MpKGRpc3BhdGNoLCBnZXRFbXB0eVJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoLmdldENhbGwoMCkuYXJnc1swXTtcbiAgICAgIH1cblxuICAgICAgaXQoJ3NhdmVzIGEgbmV3IGNhbGwgdG8gdGhlIG1hcCBvZiBjb252ZXJzYXRpb25zJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKFxuICAgICAgICAgIGdldEVtcHR5U3RhdGUoKSxcbiAgICAgICAgICBnZXRBY3Rpb24oe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLkpvaW5pbmcsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW2NyZWF0b3JVdWlkXSxcbiAgICAgICAgICAgICAgY3JlYXRvclV1aWQsXG4gICAgICAgICAgICAgIGVyYUlkOiAneHl6JyxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogNCAvIDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Kb2luaW5nLFxuICAgICAgICAgICAgcGVla0luZm86IHtcbiAgICAgICAgICAgICAgdXVpZHM6IFtjcmVhdG9yVXVpZF0sXG4gICAgICAgICAgICAgIGNyZWF0b3JVdWlkLFxuICAgICAgICAgICAgICBlcmFJZDogJ3h5eicsXG4gICAgICAgICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICAgICAgICBkZXZpY2VDb3VudDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHV1aWQ6IHJlbW90ZVV1aWQsXG4gICAgICAgICAgICAgICAgZGVtdXhJZDogMTIzLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZUF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDQgLyAzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3VwZGF0ZXMgYSBjYWxsIGluIHRoZSBtYXAgb2YgY29udmVyc2F0aW9ucycsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZVdpdGhHcm91cENhbGwsXG4gICAgICAgICAgZ2V0QWN0aW9uKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Kb2luZWQsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogWycxYjllNGQ0Mi0xZjU2LTQ1YzUtYjZmNC1kMWJlNWE1NGZlZmEnXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiA0NTYsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICAgIHJlc3VsdC5jYWxsc0J5Q29udmVyc2F0aW9uWydmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ10sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLkpvaW5lZCxcbiAgICAgICAgICAgIHBlZWtJbmZvOiB7XG4gICAgICAgICAgICAgIHV1aWRzOiBbJzFiOWU0ZDQyLTFmNTYtNDVjNS1iNmY0LWQxYmU1YTU0ZmVmYSddLFxuICAgICAgICAgICAgICBtYXhEZXZpY2VzOiAxNixcbiAgICAgICAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3RlUGFydGljaXBhbnRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1dWlkOiByZW1vdGVVdWlkLFxuICAgICAgICAgICAgICAgIGRlbXV4SWQ6IDQ1NixcbiAgICAgICAgICAgICAgICBoYXNSZW1vdGVBdWRpbzogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogMTYgLyA5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJrZWVwcyB0aGUgZXhpc3RpbmcgcmluZyBzdGF0ZSBpZiB5b3UgaGF2ZW4ndCBqb2luZWQgdGhlIGNhbGxcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAuLi5zdGF0ZVdpdGhHcm91cENhbGwsXG4gICAgICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLmNhbGxzQnlDb252ZXJzYXRpb24sXG4gICAgICAgICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgICAgICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLmNhbGxzQnlDb252ZXJzYXRpb25bXG4gICAgICAgICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHJpbmdJZDogQmlnSW50KDQ1NiksXG4gICAgICAgICAgICAgIHJpbmdlclV1aWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgZ2V0QWN0aW9uKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogWycxYjllNGQ0Mi0xZjU2LTQ1YzUtYjZmNC1kMWJlNWE1NGZlZmEnXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiA0NTYsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuaW5jbHVkZShcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgICAgIHJpbmdJZDogQmlnSW50KDQ1NiksXG4gICAgICAgICAgICByaW5nZXJVdWlkLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdChcInJlbW92ZXMgdGhlIHJpbmcgc3RhdGUgaWYgeW91J3ZlIGpvaW5lZCB0aGUgY2FsbFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbCxcbiAgICAgICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZVdpdGhHcm91cENhbGwuY2FsbHNCeUNvbnZlcnNhdGlvbixcbiAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJzoge1xuICAgICAgICAgICAgICAuLi5zdGF0ZVdpdGhHcm91cENhbGwuY2FsbHNCeUNvbnZlcnNhdGlvbltcbiAgICAgICAgICAgICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCdcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcmluZ0lkOiBCaWdJbnQoNDU2KSxcbiAgICAgICAgICAgICAgcmluZ2VyVXVpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBnZXRBY3Rpb24oe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLkpvaW5lZCxcbiAgICAgICAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICAgICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgICAgICAgIHBlZWtJbmZvOiB7XG4gICAgICAgICAgICAgIHV1aWRzOiBbJzFiOWU0ZDQyLTFmNTYtNDVjNS1iNmY0LWQxYmU1YTU0ZmVmYSddLFxuICAgICAgICAgICAgICBtYXhEZXZpY2VzOiAxNixcbiAgICAgICAgICAgICAgZGV2aWNlQ291bnQ6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3RlUGFydGljaXBhbnRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1dWlkOiByZW1vdGVVdWlkLFxuICAgICAgICAgICAgICAgIGRlbXV4SWQ6IDQ1NixcbiAgICAgICAgICAgICAgICBoYXNSZW1vdGVBdWRpbzogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogMTYgLyA5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIGFzc2VydC5ub3RQcm9wZXJ0eShcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgICdyaW5nSWQnXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5ub3RQcm9wZXJ0eShcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgICdyaW5nZXJVdWlkJ1xuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KFwiaWYgbm8gY2FsbCBpcyBhY3RpdmUsIGRvZXNuJ3QgdG91Y2ggdGhlIGFjdGl2ZSBjYWxsIHN0YXRlXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZVdpdGhHcm91cENhbGwsXG4gICAgICAgICAgZ2V0QWN0aW9uKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Kb2luZWQsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogWycxYjllNGQ0Mi0xZjU2LTQ1YzUtYjZmNC1kMWJlNWE1NGZlZmEnXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiA0NTYsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJpZiB0aGUgY2FsbCBpcyBub3QgYWN0aXZlLCBkb2Vzbid0IHRvdWNoIHRoZSBhY3RpdmUgY2FsbCBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsLFxuICAgICAgICAgIGdldEFjdGlvbih7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Fub3RoZXItZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgY29ubmVjdGlvblN0YXRlOiBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkLFxuICAgICAgICAgICAgam9pblN0YXRlOiBHcm91cENhbGxKb2luU3RhdGUuSm9pbmVkLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogWycxYjllNGQ0Mi0xZjU2LTQ1YzUtYjZmNC1kMWJlNWE1NGZlZmEnXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiA0NTYsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdC5hY3RpdmVDYWxsU3RhdGUsIHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICAgICAgbG9jYWxBdWRpb0xldmVsOiAwLFxuICAgICAgICAgIHZpZXdNb2RlOiBDYWxsVmlld01vZGUuR3JpZCxcbiAgICAgICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogZmFsc2UsXG4gICAgICAgICAgc2FmZXR5TnVtYmVyQ2hhbmdlZFV1aWRzOiBbXSxcbiAgICAgICAgICBvdXRnb2luZ1Jpbmc6IGZhbHNlLFxuICAgICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgICAgc2V0dGluZ3NEaWFsb2dPcGVuOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2lmIHRoZSBjYWxsIGlzIGFjdGl2ZSwgdXBkYXRlcyB0aGUgYWN0aXZlIGNhbGwgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsLFxuICAgICAgICAgIGdldEFjdGlvbih7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgY29ubmVjdGlvblN0YXRlOiBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkLFxuICAgICAgICAgICAgam9pblN0YXRlOiBHcm91cENhbGxKb2luU3RhdGUuSm9pbmVkLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogWycxYjllNGQ0Mi0xZjU2LTQ1YzUtYjZmNC1kMWJlNWE1NGZlZmEnXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiA0NTYsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNoYXJpbmdTY3JlZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZGVvQXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgcmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8uY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8uaGFzTG9jYWxBdWRpbyk7XG4gICAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8uaGFzTG9jYWxWaWRlbyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJkb2Vzbid0IHN0b3AgcmluZ2luZyBpZiBub2JvZHkgaXMgaW4gdGhlIGNhbGxcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAuLi5zdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwsXG4gICAgICAgICAgYWN0aXZlQ2FsbFN0YXRlOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwuYWN0aXZlQ2FsbFN0YXRlLFxuICAgICAgICAgICAgb3V0Z29pbmdSaW5nOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgZ2V0QWN0aW9uKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Kb2luZWQsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogdHJ1ZSxcbiAgICAgICAgICAgIHBlZWtJbmZvOiB7XG4gICAgICAgICAgICAgIHV1aWRzOiBbXSxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW10sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdC5hY3RpdmVDYWxsU3RhdGU/Lm91dGdvaW5nUmluZyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3N0b3BzIHJpbmdpbmcgaWYgc29tZW9uZSBlbnRlcnMgdGhlIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbCxcbiAgICAgICAgICBhY3RpdmVDYWxsU3RhdGU6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlV2l0aEFjdGl2ZUdyb3VwQ2FsbC5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICAgICAgICBvdXRnb2luZ1Jpbmc6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBnZXRBY3Rpb24oe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLkpvaW5lZCxcbiAgICAgICAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICAgICAgICBoYXNMb2NhbFZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgcGVla0luZm86IHtcbiAgICAgICAgICAgICAgdXVpZHM6IFsnMWI5ZTRkNDItMWY1Ni00NWM1LWI2ZjQtZDFiZTVhNTRmZWZhJ10sXG4gICAgICAgICAgICAgIG1heERldmljZXM6IDE2LFxuICAgICAgICAgICAgICBkZXZpY2VDb3VudDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8ub3V0Z29pbmdSaW5nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3BlZWtOb3RDb25uZWN0ZWRHcm91cENhbGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHBlZWtOb3RDb25uZWN0ZWRHcm91cENhbGwgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZVBlZWtHcm91cENhbGwgPSB0aGlzLnNhbmRib3guc3R1YihcbiAgICAgICAgICBjYWxsaW5nU2VydmljZSxcbiAgICAgICAgICAncGVla0dyb3VwQ2FsbCdcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZVVwZGF0ZUNhbGxIaXN0b3J5Rm9yR3JvdXBDYWxsID0gdGhpcy5zYW5kYm94LnN0dWIoXG4gICAgICAgICAgY2FsbGluZ1NlcnZpY2UsXG4gICAgICAgICAgJ3VwZGF0ZUNhbGxIaXN0b3J5Rm9yR3JvdXBDYWxsJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmNsb2NrID0gdGhpcy5zYW5kYm94LnVzZUZha2VUaW1lcnMoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndGh1bmsnLCAoKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIG5vb3BUZXN0KGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHRlc3QodGhpczogTW9jaGEuQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcblxuICAgICAgICAgICAgYXdhaXQgcGVla05vdENvbm5lY3RlZEdyb3VwQ2FsbCh7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICB9KShcbiAgICAgICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgICAgICgpID0+ICh7XG4gICAgICAgICAgICAgICAgLi4uZ2V0RW1wdHlSb290U3RhdGUoKSxcbiAgICAgICAgICAgICAgICBjYWxsaW5nOiB7XG4gICAgICAgICAgICAgICAgICAuLi5zdGF0ZVdpdGhHcm91cENhbGwsXG4gICAgICAgICAgICAgICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJzoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbC5jYWxsc0J5Q29udmVyc2F0aW9uW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRpc3BhdGNoKTtcbiAgICAgICAgICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQodGhpcy5jYWxsaW5nU2VydmljZVBlZWtHcm91cENhbGwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpdChcbiAgICAgICAgICAnbm8tb3BzIGlmIHRyeWluZyB0byBwZWVrIGF0IGEgY29ubmVjdGluZyBncm91cCBjYWxsJyxcbiAgICAgICAgICBub29wVGVzdChHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGluZylcbiAgICAgICAgKTtcblxuICAgICAgICBpdChcbiAgICAgICAgICAnbm8tb3BzIGlmIHRyeWluZyB0byBwZWVrIGF0IGEgY29ubmVjdGVkIGdyb3VwIGNhbGwnLFxuICAgICAgICAgIG5vb3BUZXN0KEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQpXG4gICAgICAgICk7XG5cbiAgICAgICAgaXQoXG4gICAgICAgICAgJ25vLW9wcyBpZiB0cnlpbmcgdG8gcGVlayBhdCBhIHJlY29ubmVjdGluZyBncm91cCBjYWxsJyxcbiAgICAgICAgICBub29wVGVzdChHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuUmVjb25uZWN0aW5nKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFRoZXNlIHRlc3RzIGFyZSBpbmNvbXBsZXRlLlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmV0dXJuVG9BY3RpdmVDYWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXR1cm5Ub0FjdGl2ZUNhbGwgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgbm90IGluIFBpUCBtb2RlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwsIHJldHVyblRvQWN0aXZlQ2FsbCgpKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdCwgc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2Nsb3NlcyB0aGUgUGlQJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAuLi5zdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsLFxuICAgICAgICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgICAgICAgLi4uc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbC5hY3RpdmVDYWxsU3RhdGUsXG4gICAgICAgICAgICBwaXA6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihzdGF0ZSwgcmV0dXJuVG9BY3RpdmVDYWxsKCkpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LCBzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JlY2VpdmVJbmNvbWluZ0dyb3VwQ2FsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVjZWl2ZUluY29taW5nR3JvdXBDYWxsIH0gPSBhY3Rpb25zO1xuXG4gICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSBjYWxsIHdhcyBhbHJlYWR5IHJpbmdpbmcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHJlY2VpdmVJbmNvbWluZ0dyb3VwQ2FsbCh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICByaW5nSWQ6IEJpZ0ludCg0NTYpLFxuICAgICAgICAgIHJpbmdlclV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQsIHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSBjYWxsIHdhcyBhbHJlYWR5IGpvaW5lZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLFxuICAgICAgICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbC5jYWxsc0J5Q29udmVyc2F0aW9uLFxuICAgICAgICAgICAgJ2Zha2UtZ3JvdXAtY2FsbC1jb252ZXJzYXRpb24taWQnOiB7XG4gICAgICAgICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbC5jYWxsc0J5Q29udmVyc2F0aW9uW1xuICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Kb2luZWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHJlY2VpdmVJbmNvbWluZ0dyb3VwQ2FsbCh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICByaW5nSWQ6IEJpZ0ludCg0NTYpLFxuICAgICAgICAgIHJpbmdlclV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQsIHN0YXRlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY3JlYXRlcyBhIG5ldyBncm91cCBjYWxsIGlmIG9uZSBkaWQgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSByZWNlaXZlSW5jb21pbmdHcm91cENhbGwoe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgcmluZ0lkOiBCaWdJbnQoNDU2KSxcbiAgICAgICAgICByaW5nZXJVdWlkLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihnZXRFbXB0eVN0YXRlKCksIGFjdGlvbik7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Ob3RDb25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW10sXG4gICAgICAgICAgICAgIG1heERldmljZXM6IEluZmluaXR5LFxuICAgICAgICAgICAgICBkZXZpY2VDb3VudDogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICAgICAgcmluZ0lkOiBCaWdJbnQoNDU2KSxcbiAgICAgICAgICAgIHJpbmdlclV1aWQsXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhdHRhY2hlcyByaW5nIHN0YXRlIHRvIGFuIGV4aXN0aW5nIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHJlY2VpdmVJbmNvbWluZ0dyb3VwQ2FsbCh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICByaW5nSWQ6IEJpZ0ludCg0NTYpLFxuICAgICAgICAgIHJpbmdlclV1aWQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyKHN0YXRlV2l0aEdyb3VwQ2FsbCwgYWN0aW9uKTtcblxuICAgICAgICBhc3NlcnQuaW5jbHVkZShcbiAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJpbmdJZDogQmlnSW50KDQ1NiksXG4gICAgICAgICAgICByaW5nZXJVdWlkLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NldExvY2FsQXVkaW8nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHNldExvY2FsQXVkaW8gfSA9IGFjdGlvbnM7XG5cbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgdGhpcy5jYWxsaW5nU2VydmljZVNldE91dGdvaW5nQXVkaW8gPSB0aGlzLnNhbmRib3guc3R1YihcbiAgICAgICAgICBjYWxsaW5nU2VydmljZSxcbiAgICAgICAgICAnc2V0T3V0Z29pbmdBdWRpbydcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZGlzcGF0Y2hlcyBhIFNFVF9MT0NBTF9BVURJT19GVUxGSUxMRUQgYWN0aW9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuXG4gICAgICAgIHNldExvY2FsQXVkaW8oeyBlbmFibGVkOiB0cnVlIH0pKFxuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICgpID0+ICh7XG4gICAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgICAgY2FsbGluZzogc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG5cbiAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZGlzcGF0Y2gpO1xuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChkaXNwYXRjaCwge1xuICAgICAgICAgIHR5cGU6ICdjYWxsaW5nL1NFVF9MT0NBTF9BVURJT19GVUxGSUxMRUQnLFxuICAgICAgICAgIHBheWxvYWQ6IHsgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgndXBkYXRlcyB0aGUgb3V0Z29pbmcgYXVkaW8gZm9yIHRoZSBhY3RpdmUgY2FsbCcsIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG5cbiAgICAgICAgc2V0TG9jYWxBdWRpbyh7IGVuYWJsZWQ6IGZhbHNlIH0pKFxuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICgpID0+ICh7XG4gICAgICAgICAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgICAgICAgICAgY2FsbGluZzogc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG5cbiAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UodGhpcy5jYWxsaW5nU2VydmljZVNldE91dGdvaW5nQXVkaW8pO1xuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICB0aGlzLmNhbGxpbmdTZXJ2aWNlU2V0T3V0Z29pbmdBdWRpbyxcbiAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG5cbiAgICAgICAgc2V0TG9jYWxBdWRpbyh7IGVuYWJsZWQ6IHRydWUgfSkoXG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICAgIC4uLmdldEVtcHR5Um9vdFN0YXRlKCksXG4gICAgICAgICAgICBjYWxsaW5nOiBzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcblxuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkVHdpY2UodGhpcy5jYWxsaW5nU2VydmljZVNldE91dGdvaW5nQXVkaW8pO1xuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgICAgICB0aGlzLmNhbGxpbmdTZXJ2aWNlU2V0T3V0Z29pbmdBdWRpbyxcbiAgICAgICAgICAnZmFrZS1kaXJlY3QtY2FsbC1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgndXBkYXRlcyB0aGUgbG9jYWwgYXVkaW8gc3RhdGUgd2l0aCBTRVRfTE9DQUxfQVVESU9fRlVMRklMTEVEJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgICBzZXRMb2NhbEF1ZGlvKHsgZW5hYmxlZDogZmFsc2UgfSkoXG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICAgIC4uLmdldEVtcHR5Um9vdFN0YXRlKCksXG4gICAgICAgICAgICBjYWxsaW5nOiBzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gZGlzcGF0Y2guZ2V0Q2FsbCgwKS5hcmdzWzBdO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCwgYWN0aW9uKTtcblxuICAgICAgICBhc3NlcnQuaXNGYWxzZShyZXN1bHQuYWN0aXZlQ2FsbFN0YXRlPy5oYXNMb2NhbEF1ZGlvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NldE91dGdvaW5nUmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc2V0T3V0Z29pbmdSaW5nIH0gPSBhY3Rpb25zO1xuXG4gICAgICBpdCgnZW5hYmxlcyBhIGRlc2lyZSB0byByaW5nJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBzZXRPdXRnb2luZ1JpbmcodHJ1ZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZT8ub3V0Z29pbmdSaW5nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZGlzYWJsZXMgYSBkZXNpcmUgdG8gcmluZycsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gc2V0T3V0Z29pbmdSaW5nKGZhbHNlKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcihzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKHJlc3VsdC5hY3RpdmVDYWxsU3RhdGU/Lm91dGdvaW5nUmluZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzdGFydENhbGxpbmdMb2JieScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhcnRDYWxsaW5nTG9iYnkgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGxldCByb290U3RhdGU6IFJvb3RTdGF0ZVR5cGU7XG4gICAgICBsZXQgc3RhcnRDYWxsaW5nTG9iYnlTdHViOiBzaW5vbi5TaW5vblN0dWI7XG5cbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gYmVmb3JlRWFjaCgpIHtcbiAgICAgICAgc3RhcnRDYWxsaW5nTG9iYnlTdHViID0gdGhpcy5zYW5kYm94XG4gICAgICAgICAgLnN0dWIoY2FsbGluZ1NlcnZpY2UsICdzdGFydENhbGxpbmdMb2JieScpXG4gICAgICAgICAgLnJlc29sdmVzKCk7XG5cbiAgICAgICAgY29uc3QgZW1wdHlSb290U3RhdGUgPSBnZXRFbXB0eVJvb3RTdGF0ZSgpO1xuICAgICAgICByb290U3RhdGUgPSB7XG4gICAgICAgICAgLi4uZW1wdHlSb290U3RhdGUsXG4gICAgICAgICAgY29udmVyc2F0aW9uczoge1xuICAgICAgICAgICAgLi4uZW1wdHlSb290U3RhdGUuY29udmVyc2F0aW9ucyxcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbkxvb2t1cDoge1xuICAgICAgICAgICAgICAnZmFrZS1jb252ZXJzYXRpb24taWQnOiBnZXREZWZhdWx0Q29udmVyc2F0aW9uKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3RodW5rJywgKCkgPT4ge1xuICAgICAgICBpdCgnYXNrcyB0aGUgY2FsbGluZyBzZXJ2aWNlIHRvIHN0YXJ0IHRoZSBsb2JieScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdGFydENhbGxpbmdMb2JieSh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGlzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgIH0pKG5vb3AsICgpID0+IHJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShzdGFydENhbGxpbmdMb2JieVN0dWIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVxdWVzdHMgYXVkaW8gYnkgZGVmYXVsdCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdGFydENhbGxpbmdMb2JieSh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGlzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgIH0pKG5vb3AsICgpID0+IHJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aE1hdGNoKHN0YXJ0Q2FsbGluZ0xvYmJ5U3R1Yiwge1xuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJkb2Vzbid0IHJlcXVlc3QgYXVkaW8gaWYgdGhlIGdyb3VwIGNhbGwgYWxyZWFkeSBoYXMgOCBkZXZpY2VzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzdGFydENhbGxpbmdMb2JieSh7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGlzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgIH0pKFxuICAgICAgICAgICAgbm9vcCxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2FsbGluZ1N0YXRlID0gY2xvbmVEZWVwKHN0YXRlV2l0aEdyb3VwQ2FsbCk7XG4gICAgICAgICAgICAgIGNhbGxpbmdTdGF0ZS5jYWxsc0J5Q29udmVyc2F0aW9uW1xuICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICAgICAgICBdLnBlZWtJbmZvLmRldmljZUNvdW50ID0gODtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgLi4ucm9vdFN0YXRlLCBjYWxsaW5nOiBjYWxsaW5nU3RhdGUgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoTWF0Y2goc3RhcnRDYWxsaW5nTG9iYnlTdHViLCB7XG4gICAgICAgICAgICBoYXNMb2NhbFZpZGVvOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVxdWVzdHMgdmlkZW8gd2hlbiBzdGFydGluZyBhIHZpZGVvIGNhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgc3RhcnRDYWxsaW5nTG9iYnkoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBpc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgICB9KShub29wLCAoKSA9PiByb290U3RhdGUsIG51bGwpO1xuXG4gICAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhNYXRjaChzdGFydENhbGxpbmdMb2JieVN0dWIsIHtcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZG9lc24ndCByZXF1ZXN0IHZpZGVvIHdoZW4gbm90IGEgdmlkZW8gY2FsbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgc3RhcnRDYWxsaW5nTG9iYnkoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBpc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgICAgfSkobm9vcCwgKCkgPT4gcm9vdFN0YXRlLCBudWxsKTtcblxuICAgICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoTWF0Y2goc3RhcnRDYWxsaW5nTG9iYnlTdHViLCB7XG4gICAgICAgICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Rpc3BhdGNoZXMgYW4gYWN0aW9uIGlmIHRoZSBjYWxsaW5nIGxvYmJ5IHJldHVybnMgc29tZXRoaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHN0YXJ0Q2FsbGluZ0xvYmJ5U3R1Yi5yZXNvbHZlcyh7XG4gICAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnN0dWIoKTtcblxuICAgICAgICAgIGF3YWl0IHN0YXJ0Q2FsbGluZ0xvYmJ5KHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgaXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsICgpID0+IHJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShkaXNwYXRjaCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZG9lc24ndCBkaXNwYXRjaCBhbiBhY3Rpb24gaWYgdGhlIGNhbGxpbmcgbG9iYnkgcmV0dXJucyBub3RoaW5nXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnN0dWIoKTtcblxuICAgICAgICAgIGF3YWl0IHN0YXJ0Q2FsbGluZ0xvYmJ5KHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgICAgaXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICAgICAgfSkoZGlzcGF0Y2gsICgpID0+IHJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRpc3BhdGNoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2FjdGlvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgZ2V0U3RhdGUgPSBhc3luYyAoXG4gICAgICAgICAgY2FsbGluZ1N0YXRlOiBDYWxsaW5nU3RhdGVUeXBlLFxuICAgICAgICAgIGNhbGxpbmdTZXJ2aWNlUmVzdWx0OiBVbndyYXBQcm9taXNlPFxuICAgICAgICAgICAgUmV0dXJuVHlwZTx0eXBlb2YgY2FsbGluZ1NlcnZpY2Uuc3RhcnRDYWxsaW5nTG9iYnk+XG4gICAgICAgICAgPixcbiAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCdcbiAgICAgICAgKTogUHJvbWlzZTxDYWxsaW5nU3RhdGVUeXBlPiA9PiB7XG4gICAgICAgICAgc3RhcnRDYWxsaW5nTG9iYnlTdHViLnJlc29sdmVzKGNhbGxpbmdTZXJ2aWNlUmVzdWx0KTtcblxuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3R1YigpO1xuXG4gICAgICAgICAgYXdhaXQgc3RhcnRDYWxsaW5nTG9iYnkoe1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAgICBpc1ZpZGVvQ2FsbDogdHJ1ZSxcbiAgICAgICAgICB9KShkaXNwYXRjaCwgKCkgPT4gKHsgLi4ucm9vdFN0YXRlLCBjYWxsaW5nOiBjYWxsaW5nU3RhdGUgfSksIG51bGwpO1xuXG4gICAgICAgICAgY29uc3QgYWN0aW9uID0gZGlzcGF0Y2guZ2V0Q2FsbCgwKS5hcmdzWzBdO1xuXG4gICAgICAgICAgcmV0dXJuIHJlZHVjZXIoY2FsbGluZ1N0YXRlLCBhY3Rpb24pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzYXZlcyBhIGRpcmVjdCBjYWxsIGFuZCBtYWtlcyBpdCBhY3RpdmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0U3RhdGUoZ2V0RW1wdHlTdGF0ZSgpLCB7XG4gICAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0IGFzIGNvbnN0LFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdC5jYWxsc0J5Q29udmVyc2F0aW9uWydmYWtlLWNvbnZlcnNhdGlvbi1pZCddLCB7XG4gICAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBpc0luY29taW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGlzVmlkZW9DYWxsOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LmFjdGl2ZUNhbGxTdGF0ZSwge1xuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2FsQXVkaW9MZXZlbDogMCxcbiAgICAgICAgICAgIHZpZXdNb2RlOiBDYWxsVmlld01vZGUuR3JpZCxcbiAgICAgICAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgICAgICAgIHNhZmV0eU51bWJlckNoYW5nZWRVdWlkczogW10sXG4gICAgICAgICAgICBwaXA6IGZhbHNlLFxuICAgICAgICAgICAgc2V0dGluZ3NEaWFsb2dPcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIG91dGdvaW5nUmluZzogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3NhdmVzIGEgZ3JvdXAgY2FsbCBhbmQgbWFrZXMgaXQgYWN0aXZlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldFN0YXRlKGdldEVtcHR5U3RhdGUoKSwge1xuICAgICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW2NyZWF0b3JVdWlkXSxcbiAgICAgICAgICAgICAgY3JlYXRvclV1aWQsXG4gICAgICAgICAgICAgIGVyYUlkOiAneHl6JyxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogNCAvIDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1jb252ZXJzYXRpb24taWQnXSwge1xuICAgICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW2NyZWF0b3JVdWlkXSxcbiAgICAgICAgICAgICAgY3JlYXRvclV1aWQsXG4gICAgICAgICAgICAgIGVyYUlkOiAneHl6JyxcbiAgICAgICAgICAgICAgbWF4RGV2aWNlczogMTYsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogNCAvIDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgICAgICByZXN1bHQuYWN0aXZlQ2FsbFN0YXRlPy5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgICdmYWtlLWNvbnZlcnNhdGlvbi1pZCdcbiAgICAgICAgICApO1xuICAgICAgICAgIGFzc2VydC5pc0ZhbHNlKHJlc3VsdC5hY3RpdmVDYWxsU3RhdGU/Lm91dGdvaW5nUmluZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjaG9vc2VzIGZhbGxiYWNrIHBlZWsgaW5mbyBpZiBub25lIGlzIHNlbnQgYW5kIHRoZXJlIGlzIG5vIGV4aXN0aW5nIGNhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0U3RhdGUoZ2V0RW1wdHlTdGF0ZSgpLCB7XG4gICAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgICAgaGFzTG9jYWxWaWRlbzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCxcbiAgICAgICAgICAgIHBlZWtJbmZvOiB1bmRlZmluZWQsXG4gICAgICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgY2FsbCA9IHJlc3VsdC5jYWxsc0J5Q29udmVyc2F0aW9uWydmYWtlLWNvbnZlcnNhdGlvbi1pZCddO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoY2FsbD8uY2FsbE1vZGUgPT09IENhbGxNb2RlLkdyb3VwICYmIGNhbGwucGVla0luZm8sIHtcbiAgICAgICAgICAgIHV1aWRzOiBbXSxcbiAgICAgICAgICAgIG1heERldmljZXM6IEluZmluaXR5LFxuICAgICAgICAgICAgZGV2aWNlQ291bnQ6IDAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiZG9lc24ndCBvdmVyd3JpdGUgYW4gZXhpc3RpbmcgZ3JvdXAgY2FsbCdzIHBlZWsgaW5mbyBpZiBub25lIHdhcyBzZW50XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdGF0ZShzdGF0ZVdpdGhHcm91cENhbGwsIHtcbiAgICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICAgICAgICBoYXNMb2NhbFZpZGVvOiB0cnVlLFxuICAgICAgICAgICAgY29ubmVjdGlvblN0YXRlOiBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkLFxuICAgICAgICAgICAgam9pblN0YXRlOiBHcm91cENhbGxKb2luU3RhdGUuTm90Sm9pbmVkLFxuICAgICAgICAgICAgcGVla0luZm86IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogNCAvIDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgY2FsbCA9XG4gICAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoY2FsbD8uY2FsbE1vZGUgPT09IENhbGxNb2RlLkdyb3VwICYmIGNhbGwucGVla0luZm8sIHtcbiAgICAgICAgICAgIHV1aWRzOiBbY3JlYXRvclV1aWRdLFxuICAgICAgICAgICAgY3JlYXRvclV1aWQsXG4gICAgICAgICAgICBlcmFJZDogJ3h5eicsXG4gICAgICAgICAgICBtYXhEZXZpY2VzOiAxNixcbiAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBvdmVyd3JpdGUgYW4gZXhpc3RpbmcgZ3JvdXAgY2FsbCdzIHBlZWsgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgICAgICAuLi5nZXRFbXB0eVN0YXRlKCksXG4gICAgICAgICAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAgICAgICAgICdmYWtlLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgICAgICAgICAuLi5zdGF0ZVdpdGhHcm91cENhbGwuY2FsbHNCeUNvbnZlcnNhdGlvbltcbiAgICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdGF0ZShzdGF0ZSwge1xuICAgICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICBjb25uZWN0aW9uU3RhdGU6IEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQsXG4gICAgICAgICAgICBqb2luU3RhdGU6IEdyb3VwQ2FsbEpvaW5TdGF0ZS5Ob3RKb2luZWQsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW2RpZmZlcmVudENyZWF0b3JVdWlkXSxcbiAgICAgICAgICAgICAgY3JlYXRvclV1aWQ6IGRpZmZlcmVudENyZWF0b3JVdWlkLFxuICAgICAgICAgICAgICBlcmFJZDogJ2FiYycsXG4gICAgICAgICAgICAgIG1heERldmljZXM6IDUsXG4gICAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW90ZVBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXVpZDogcmVtb3RlVXVpZCxcbiAgICAgICAgICAgICAgICBkZW11eElkOiAxMjMsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgaGFzUmVtb3RlVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VudGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlkZW9Bc3BlY3RSYXRpbzogNCAvIDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgY2FsbCA9IHJlc3VsdC5jYWxsc0J5Q29udmVyc2F0aW9uWydmYWtlLWNvbnZlcnNhdGlvbi1pZCddO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoY2FsbD8uY2FsbE1vZGUgPT09IENhbGxNb2RlLkdyb3VwICYmIGNhbGwucGVla0luZm8sIHtcbiAgICAgICAgICAgIHV1aWRzOiBbZGlmZmVyZW50Q3JlYXRvclV1aWRdLFxuICAgICAgICAgICAgY3JlYXRvclV1aWQ6IGRpZmZlcmVudENyZWF0b3JVdWlkLFxuICAgICAgICAgICAgZXJhSWQ6ICdhYmMnLFxuICAgICAgICAgICAgbWF4RGV2aWNlczogNSxcbiAgICAgICAgICAgIGRldmljZUNvdW50OiAxLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImRvZXNuJ3Qgb3ZlcndyaXRlIGFuIGV4aXN0aW5nIGdyb3VwIGNhbGwncyByaW5nIHN0YXRlIGlmIGl0IHdhcyBzZXQgcHJldmlvdXNseVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0U3RhdGUoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC4uLnN0YXRlV2l0aEdyb3VwQ2FsbCxcbiAgICAgICAgICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJzoge1xuICAgICAgICAgICAgICAgICAgLi4uc3RhdGVXaXRoR3JvdXBDYWxsLmNhbGxzQnlDb252ZXJzYXRpb25bXG4gICAgICAgICAgICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIHJpbmdJZDogQmlnSW50KDk4NyksXG4gICAgICAgICAgICAgICAgICByaW5nZXJVdWlkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuR3JvdXAsXG4gICAgICAgICAgICAgIGhhc0xvY2FsQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgIGhhc0xvY2FsVmlkZW86IHRydWUsXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25TdGF0ZTogR3JvdXBDYWxsQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCxcbiAgICAgICAgICAgICAgam9pblN0YXRlOiBHcm91cENhbGxKb2luU3RhdGUuTm90Sm9pbmVkLFxuICAgICAgICAgICAgICBwZWVrSW5mbzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICByZW1vdGVQYXJ0aWNpcGFudHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB1dWlkOiByZW1vdGVVdWlkLFxuICAgICAgICAgICAgICAgICAgZGVtdXhJZDogMTIzLFxuICAgICAgICAgICAgICAgICAgaGFzUmVtb3RlQXVkaW86IHRydWUsXG4gICAgICAgICAgICAgICAgICBoYXNSZW1vdGVWaWRlbzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIHByZXNlbnRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgc2hhcmluZ1NjcmVlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICB2aWRlb0FzcGVjdFJhdGlvOiA0IC8gMyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgY2FsbCA9XG4gICAgICAgICAgICByZXN1bHQuY2FsbHNCeUNvbnZlcnNhdGlvblsnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCddO1xuICAgICAgICAgIC8vIEl0J2QgYmUgbmljZSB0byBkbyB0aGlzIHdpdGggYW4gYXNzZXJ0LCBidXQgQ2hhaSBkb2Vzbid0IHVuZGVyc3RhbmQgaXQuXG4gICAgICAgICAgaWYgKGNhbGw/LmNhbGxNb2RlICE9PSBDYWxsTW9kZS5Hcm91cCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0byBmaW5kIGEgZ3JvdXAgY2FsbCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChjYWxsLnJpbmdJZCwgQmlnSW50KDk4NykpO1xuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChjYWxsLnJpbmdlclV1aWQsIHJpbmdlclV1aWQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3N0YXJ0Q2FsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3RhcnRDYWxsIH0gPSBhY3Rpb25zO1xuXG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uIGJlZm9yZUVhY2goKSB7XG4gICAgICAgIHRoaXMuY2FsbGluZ1N0YXJ0T3V0Z29pbmdEaXJlY3RDYWxsID0gdGhpcy5zYW5kYm94LnN0dWIoXG4gICAgICAgICAgY2FsbGluZ1NlcnZpY2UsXG4gICAgICAgICAgJ3N0YXJ0T3V0Z29pbmdEaXJlY3RDYWxsJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmNhbGxpbmdKb2luR3JvdXBDYWxsID0gdGhpcy5zYW5kYm94XG4gICAgICAgICAgLnN0dWIoY2FsbGluZ1NlcnZpY2UsICdqb2luR3JvdXBDYWxsJylcbiAgICAgICAgICAucmVzb2x2ZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnYXNrcyB0aGUgY2FsbGluZyBzZXJ2aWNlIHRvIHN0YXJ0IGFuIG91dGdvaW5nIGRpcmVjdCBjYWxsJywgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgICAgYXdhaXQgc3RhcnRDYWxsKHtcbiAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnMTIzJyxcbiAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgIGhhc0xvY2FsVmlkZW86IGZhbHNlLFxuICAgICAgICB9KShkaXNwYXRjaCwgZ2V0RW1wdHlSb290U3RhdGUsIG51bGwpO1xuXG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHRoaXMuY2FsbGluZ1N0YXJ0T3V0Z29pbmdEaXJlY3RDYWxsKTtcbiAgICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoXG4gICAgICAgICAgdGhpcy5jYWxsaW5nU3RhcnRPdXRnb2luZ0RpcmVjdENhbGwsXG4gICAgICAgICAgJzEyMycsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQodGhpcy5jYWxsaW5nSm9pbkdyb3VwQ2FsbCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2Fza3MgdGhlIGNhbGxpbmcgc2VydmljZSB0byBqb2luIGEgZ3JvdXAgY2FsbCcsIGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICAgIGF3YWl0IHN0YXJ0Q2FsbCh7XG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnMTIzJyxcbiAgICAgICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgICAgIGhhc0xvY2FsVmlkZW86IGZhbHNlLFxuICAgICAgICB9KShkaXNwYXRjaCwgZ2V0RW1wdHlSb290U3RhdGUsIG51bGwpO1xuXG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHRoaXMuY2FsbGluZ0pvaW5Hcm91cENhbGwpO1xuICAgICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aCh0aGlzLmNhbGxpbmdKb2luR3JvdXBDYWxsLCAnMTIzJywgdHJ1ZSwgZmFsc2UpO1xuXG4gICAgICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQodGhpcy5jYWxsaW5nU3RhcnRPdXRnb2luZ0RpcmVjdENhbGwpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzYXZlcyBkaXJlY3QgY2FsbHMgYW5kIG1ha2VzIHRoZW0gYWN0aXZlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgICBhd2FpdCBzdGFydENhbGwoe1xuICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgICAgfSkoZGlzcGF0Y2gsIGdldEVtcHR5Um9vdFN0YXRlLCBudWxsKTtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gZGlzcGF0Y2guZ2V0Q2FsbCgwKS5hcmdzWzBdO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIoZ2V0RW1wdHlTdGF0ZSgpLCBhY3Rpb24pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LmNhbGxzQnlDb252ZXJzYXRpb25bJ2Zha2UtY29udmVyc2F0aW9uLWlkJ10sIHtcbiAgICAgICAgICBjYWxsTW9kZTogQ2FsbE1vZGUuRGlyZWN0LFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICAgIGNhbGxTdGF0ZTogQ2FsbFN0YXRlLlByZXJpbmcsXG4gICAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgICAgaXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQuYWN0aXZlQ2FsbFN0YXRlLCB7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAsXG4gICAgICAgICAgdmlld01vZGU6IENhbGxWaWV3TW9kZS5HcmlkLFxuICAgICAgICAgIHNob3dQYXJ0aWNpcGFudHNMaXN0OiBmYWxzZSxcbiAgICAgICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHM6IFtdLFxuICAgICAgICAgIHBpcDogZmFsc2UsXG4gICAgICAgICAgc2V0dGluZ3NEaWFsb2dPcGVuOiBmYWxzZSxcbiAgICAgICAgICBvdXRnb2luZ1Jpbmc6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KFwiZG9lc24ndCBkaXNwYXRjaCBhbnkgYWN0aW9ucyBmb3IgZ3JvdXAgY2FsbHNcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgICBzdGFydENhbGwoe1xuICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5Hcm91cCxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogJzEyMycsXG4gICAgICAgICAgaGFzTG9jYWxBdWRpbzogdHJ1ZSxcbiAgICAgICAgICBoYXNMb2NhbFZpZGVvOiBmYWxzZSxcbiAgICAgICAgfSkoZGlzcGF0Y2gsIGdldEVtcHR5Um9vdFN0YXRlLCBudWxsKTtcblxuICAgICAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRpc3BhdGNoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3RvZ2dsZVNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0b2dnbGVTZXR0aW5ncyB9ID0gYWN0aW9ucztcblxuICAgICAgaXQoJ3RvZ2dsZXMgdGhlIHNldHRpbmdzIGRpYWxvZycsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWZ0ZXJPbmVUb2dnbGUgPSByZWR1Y2VyKFxuICAgICAgICAgIHN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwsXG4gICAgICAgICAgdG9nZ2xlU2V0dGluZ3MoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhZnRlclR3b1RvZ2dsZXMgPSByZWR1Y2VyKGFmdGVyT25lVG9nZ2xlLCB0b2dnbGVTZXR0aW5ncygpKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJUaHJlZVRvZ2dsZXMgPSByZWR1Y2VyKGFmdGVyVHdvVG9nZ2xlcywgdG9nZ2xlU2V0dGluZ3MoKSk7XG5cbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShhZnRlck9uZVRvZ2dsZS5hY3RpdmVDYWxsU3RhdGU/LnNldHRpbmdzRGlhbG9nT3Blbik7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGFmdGVyVHdvVG9nZ2xlcy5hY3RpdmVDYWxsU3RhdGU/LnNldHRpbmdzRGlhbG9nT3Blbik7XG4gICAgICAgIGFzc2VydC5pc1RydWUoYWZ0ZXJUaHJlZVRvZ2dsZXMuYWN0aXZlQ2FsbFN0YXRlPy5zZXR0aW5nc0RpYWxvZ09wZW4pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndG9nZ2xlUGFydGljaXBhbnRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0b2dnbGVQYXJ0aWNpcGFudHMgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGl0KCd0b2dnbGVzIHRoZSBwYXJ0aWNpcGFudHMgbGlzdCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWZ0ZXJPbmVUb2dnbGUgPSByZWR1Y2VyKFxuICAgICAgICAgIHN0YXRlV2l0aEFjdGl2ZURpcmVjdENhbGwsXG4gICAgICAgICAgdG9nZ2xlUGFydGljaXBhbnRzKClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJUd29Ub2dnbGVzID0gcmVkdWNlcihhZnRlck9uZVRvZ2dsZSwgdG9nZ2xlUGFydGljaXBhbnRzKCkpO1xuICAgICAgICBjb25zdCBhZnRlclRocmVlVG9nZ2xlcyA9IHJlZHVjZXIoXG4gICAgICAgICAgYWZ0ZXJUd29Ub2dnbGVzLFxuICAgICAgICAgIHRvZ2dsZVBhcnRpY2lwYW50cygpXG4gICAgICAgICk7XG5cbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShhZnRlck9uZVRvZ2dsZS5hY3RpdmVDYWxsU3RhdGU/LnNob3dQYXJ0aWNpcGFudHNMaXN0KTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoYWZ0ZXJUd29Ub2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8uc2hvd1BhcnRpY2lwYW50c0xpc3QpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGFmdGVyVGhyZWVUb2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8uc2hvd1BhcnRpY2lwYW50c0xpc3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndG9nZ2xlUGlwJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0b2dnbGVQaXAgfSA9IGFjdGlvbnM7XG5cbiAgICAgIGl0KCd0b2dnbGVzIHRoZSBQaVAnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFmdGVyT25lVG9nZ2xlID0gcmVkdWNlcihzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsLCB0b2dnbGVQaXAoKSk7XG4gICAgICAgIGNvbnN0IGFmdGVyVHdvVG9nZ2xlcyA9IHJlZHVjZXIoYWZ0ZXJPbmVUb2dnbGUsIHRvZ2dsZVBpcCgpKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJUaHJlZVRvZ2dsZXMgPSByZWR1Y2VyKGFmdGVyVHdvVG9nZ2xlcywgdG9nZ2xlUGlwKCkpO1xuXG4gICAgICAgIGFzc2VydC5pc1RydWUoYWZ0ZXJPbmVUb2dnbGUuYWN0aXZlQ2FsbFN0YXRlPy5waXApO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShhZnRlclR3b1RvZ2dsZXMuYWN0aXZlQ2FsbFN0YXRlPy5waXApO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGFmdGVyVGhyZWVUb2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8ucGlwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3RvZ2dsZVNwZWFrZXJWaWV3JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0b2dnbGVTcGVha2VyVmlldyB9ID0gYWN0aW9ucztcblxuICAgICAgaXQoJ3RvZ2dsZXMgc3BlYWtlciB2aWV3IGZyb20gZ3JpZCB2aWV3JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhZnRlck9uZVRvZ2dsZSA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGVXaXRoQWN0aXZlR3JvdXBDYWxsLFxuICAgICAgICAgIHRvZ2dsZVNwZWFrZXJWaWV3KClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJUd29Ub2dnbGVzID0gcmVkdWNlcihhZnRlck9uZVRvZ2dsZSwgdG9nZ2xlU3BlYWtlclZpZXcoKSk7XG4gICAgICAgIGNvbnN0IGFmdGVyVGhyZWVUb2dnbGVzID0gcmVkdWNlcihhZnRlclR3b1RvZ2dsZXMsIHRvZ2dsZVNwZWFrZXJWaWV3KCkpO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICBhZnRlck9uZVRvZ2dsZS5hY3RpdmVDYWxsU3RhdGU/LnZpZXdNb2RlLFxuICAgICAgICAgIENhbGxWaWV3TW9kZS5TcGVha2VyXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICBhZnRlclR3b1RvZ2dsZXMuYWN0aXZlQ2FsbFN0YXRlPy52aWV3TW9kZSxcbiAgICAgICAgICBDYWxsVmlld01vZGUuR3JpZFxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWZ0ZXJUaHJlZVRvZ2dsZXMuYWN0aXZlQ2FsbFN0YXRlPy52aWV3TW9kZSxcbiAgICAgICAgICBDYWxsVmlld01vZGUuU3BlYWtlclxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCd0b2dnbGVzIHNwZWFrZXIgdmlldyBmcm9tIHByZXNlbnRhdGlvbiB2aWV3JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhZnRlck9uZVRvZ2dsZSA9IHJlZHVjZXIoXG4gICAgICAgICAgc3RhdGVXaXRoQWN0aXZlUHJlc2VudGF0aW9uVmlld0dyb3VwQ2FsbCxcbiAgICAgICAgICB0b2dnbGVTcGVha2VyVmlldygpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFmdGVyVHdvVG9nZ2xlcyA9IHJlZHVjZXIoYWZ0ZXJPbmVUb2dnbGUsIHRvZ2dsZVNwZWFrZXJWaWV3KCkpO1xuICAgICAgICBjb25zdCBhZnRlclRocmVlVG9nZ2xlcyA9IHJlZHVjZXIoYWZ0ZXJUd29Ub2dnbGVzLCB0b2dnbGVTcGVha2VyVmlldygpKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWZ0ZXJPbmVUb2dnbGUuYWN0aXZlQ2FsbFN0YXRlPy52aWV3TW9kZSxcbiAgICAgICAgICBDYWxsVmlld01vZGUuR3JpZFxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWZ0ZXJUd29Ub2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8udmlld01vZGUsXG4gICAgICAgICAgQ2FsbFZpZXdNb2RlLlNwZWFrZXJcbiAgICAgICAgKTtcbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICAgIGFmdGVyVGhyZWVUb2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8udmlld01vZGUsXG4gICAgICAgICAgQ2FsbFZpZXdNb2RlLkdyaWRcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3N3aXRjaFRvUHJlc2VudGF0aW9uVmlldycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc3dpdGNoVG9QcmVzZW50YXRpb25WaWV3LCBzd2l0Y2hGcm9tUHJlc2VudGF0aW9uVmlldyB9ID0gYWN0aW9ucztcblxuICAgICAgaXQoJ3RvZ2dsZXMgcHJlc2VudGF0aW9uIHZpZXcgZnJvbSBncmlkIHZpZXcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFmdGVyT25lVG9nZ2xlID0gcmVkdWNlcihcbiAgICAgICAgICBzdGF0ZVdpdGhBY3RpdmVHcm91cENhbGwsXG4gICAgICAgICAgc3dpdGNoVG9QcmVzZW50YXRpb25WaWV3KClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJUd29Ub2dnbGVzID0gcmVkdWNlcihcbiAgICAgICAgICBhZnRlck9uZVRvZ2dsZSxcbiAgICAgICAgICBzd2l0Y2hUb1ByZXNlbnRhdGlvblZpZXcoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBmaW5hbFN0YXRlID0gcmVkdWNlcihcbiAgICAgICAgICBhZnRlck9uZVRvZ2dsZSxcbiAgICAgICAgICBzd2l0Y2hGcm9tUHJlc2VudGF0aW9uVmlldygpXG4gICAgICAgICk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICAgIGFmdGVyT25lVG9nZ2xlLmFjdGl2ZUNhbGxTdGF0ZT8udmlld01vZGUsXG4gICAgICAgICAgQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWZ0ZXJUd29Ub2dnbGVzLmFjdGl2ZUNhbGxTdGF0ZT8udmlld01vZGUsXG4gICAgICAgICAgQ2FsbFZpZXdNb2RlLlByZXNlbnRhdGlvblxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgZmluYWxTdGF0ZS5hY3RpdmVDYWxsU3RhdGU/LnZpZXdNb2RlLFxuICAgICAgICAgIENhbGxWaWV3TW9kZS5HcmlkXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2RvZXMgbm90IHRvZ2dsZSBwcmVzZW50YXRpb24gdmlldyBmcm9tIHNwZWFrZXIgdmlldycsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWZ0ZXJPbmVUb2dnbGUgPSByZWR1Y2VyKFxuICAgICAgICAgIHN0YXRlV2l0aEFjdGl2ZVNwZWFrZXJWaWV3R3JvdXBDYWxsLFxuICAgICAgICAgIHN3aXRjaFRvUHJlc2VudGF0aW9uVmlldygpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGZpbmFsU3RhdGUgPSByZWR1Y2VyKFxuICAgICAgICAgIGFmdGVyT25lVG9nZ2xlLFxuICAgICAgICAgIHN3aXRjaEZyb21QcmVzZW50YXRpb25WaWV3KClcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWZ0ZXJPbmVUb2dnbGUuYWN0aXZlQ2FsbFN0YXRlPy52aWV3TW9kZSxcbiAgICAgICAgICBDYWxsVmlld01vZGUuU3BlYWtlclxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgZmluYWxTdGF0ZS5hY3RpdmVDYWxsU3RhdGU/LnZpZXdNb2RlLFxuICAgICAgICAgIENhbGxWaWV3TW9kZS5TcGVha2VyXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hlbHBlcnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2dldEFjdGl2ZUNhbGwnLCAoKSA9PiB7XG4gICAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG5vIGNhbGxzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoZ2V0QWN0aXZlQ2FsbChnZXRFbXB0eVN0YXRlKCkpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm8gYWN0aXZlIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChnZXRBY3RpdmVDYWxsKHN0YXRlV2l0aERpcmVjdENhbGwpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyB0aGUgYWN0aXZlIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0QWN0aXZlQ2FsbChzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsKSwge1xuICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgICAgY2FsbFN0YXRlOiBDYWxsU3RhdGUuQWNjZXB0ZWQsXG4gICAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgICAgaXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICAgIGhhc1JlbW90ZVZpZGVvOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc0FueWJvZHlFbHNlSW5Hcm91cENhbGwnLCAoKSA9PiB7XG4gICAgICBpdCgncmV0dXJucyBmYWxzZSB3aXRoIG5vIHBlZWsgaW5mbycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsKHVuZGVmaW5lZCwgcmVtb3RlVXVpZCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZSBwZWVrIGluZm8gaGFzIG5vIHBhcnRpY2lwYW50cycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsKHsgdXVpZHM6IFtdIH0sIHJlbW90ZVV1aWQpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGUgcGVlayBpbmZvIGhhcyBvbmUgcGFydGljaXBhbnQsIHlvdScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoXG4gICAgICAgICAgaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsKHsgdXVpZHM6IFtjcmVhdG9yVXVpZF0gfSwgY3JlYXRvclV1aWQpXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGUgcGVlayBpbmZvIGhhcyBvbmUgcGFydGljaXBhbnQsIHNvbWVvbmUgZWxzZScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgICBpc0FueWJvZHlFbHNlSW5Hcm91cENhbGwoeyB1dWlkczogW2NyZWF0b3JVdWlkXSB9LCByZW1vdGVVdWlkKVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlIHBlZWsgaW5mbyBoYXMgdHdvIHBhcnRpY2lwYW50cywgeW91IGFuZCBzb21lb25lIGVsc2UnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgICAgaXNBbnlib2R5RWxzZUluR3JvdXBDYWxsKFxuICAgICAgICAgICAgeyB1dWlkczogW2NyZWF0b3JVdWlkLCByZW1vdGVVdWlkXSB9LFxuICAgICAgICAgICAgcmVtb3RlVXVpZFxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtCQUF1QjtBQUN2QixZQUF1QjtBQUN2QixvQkFBZ0M7QUFFaEMscUJBQXVDO0FBQ3ZDLGtCQUEyQjtBQUszQixxQkFNTztBQUNQLGdDQUFtQztBQUNuQyxzQkFBMEM7QUFDMUMscUJBTU87QUFDUCxrQkFBcUI7QUFDckIsb0NBQXVDO0FBR3ZDLFNBQVMsZ0JBQWdCLE1BQU07QUFDN0IsUUFBTSxzQkFBd0M7QUFBQSxPQUN6QyxrQ0FBYztBQUFBLElBQ2pCLHFCQUFxQjtBQUFBLE1BQ25CLG9DQUFvQztBQUFBLFFBQ2xDLFVBQVUsd0JBQVM7QUFBQSxRQUNuQixnQkFBZ0I7QUFBQSxRQUNoQixXQUFXLHlCQUFVO0FBQUEsUUFDckIsWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFFBQU0sNEJBQTRCO0FBQUEsT0FDN0I7QUFBQSxJQUNILGlCQUFpQjtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUEsTUFDaEIsZUFBZTtBQUFBLE1BQ2YsZUFBZTtBQUFBLE1BQ2YsaUJBQWlCO0FBQUEsTUFDakIsVUFBVSw0QkFBYTtBQUFBLE1BQ3ZCLHNCQUFzQjtBQUFBLE1BQ3RCLDBCQUEwQixDQUFDO0FBQUEsTUFDM0IsY0FBYztBQUFBLE1BQ2QsS0FBSztBQUFBLE1BQ0wsb0JBQW9CO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBRUEsUUFBTSw4QkFBOEI7QUFBQSxPQUMvQixrQ0FBYztBQUFBLElBQ2pCLHFCQUFxQjtBQUFBLE1BQ25CLG9DQUFvQztBQUFBLFFBQ2xDLFVBQVUsd0JBQVM7QUFBQSxRQUNuQixnQkFBZ0I7QUFBQSxRQUNoQixXQUFXLHlCQUFVO0FBQUEsUUFDckIsWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFFBQU0sY0FBYyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUM3QyxRQUFNLHVCQUF1QixpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUN0RCxRQUFNLGFBQWEsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFDNUMsUUFBTSxhQUFhLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBRTVDLFFBQU0scUJBQXFCO0FBQUEsT0FDdEIsa0NBQWM7QUFBQSxJQUNqQixxQkFBcUI7QUFBQSxNQUNuQixtQ0FBbUM7QUFBQSxRQUNqQyxVQUFVLHdCQUFTO0FBQUEsUUFDbkIsZ0JBQWdCO0FBQUEsUUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFFBQzFDLFdBQVcsa0NBQW1CO0FBQUEsUUFDOUIsVUFBVTtBQUFBLFVBQ1IsT0FBTyxDQUFDLFdBQVc7QUFBQSxVQUNuQjtBQUFBLFVBQ0EsT0FBTztBQUFBLFVBQ1AsWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFFBQ2Y7QUFBQSxRQUNBLG9CQUFvQjtBQUFBLFVBQ2xCO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsWUFDVCxnQkFBZ0I7QUFBQSxZQUNoQixnQkFBZ0I7QUFBQSxZQUNoQixZQUFZO0FBQUEsWUFDWixlQUFlO0FBQUEsWUFDZixrQkFBa0IsSUFBSTtBQUFBLFVBQ3hCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFFBQU0sNkJBQTZCO0FBQUEsT0FDOUI7QUFBQSxJQUNILHFCQUFxQjtBQUFBLFNBQ2hCLG1CQUFtQjtBQUFBLE1BQ3RCLG1DQUFtQztBQUFBLFdBQzlCLG1CQUFtQixvQkFDcEI7QUFBQSxRQUVGLFFBQVEsT0FBTyxHQUFHO0FBQUEsUUFDbEIsWUFBWSxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUFBLE1BQ3ZDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxRQUFNLDJCQUEyQjtBQUFBLE9BQzVCO0FBQUEsSUFDSCxpQkFBaUI7QUFBQSxNQUNmLGdCQUFnQjtBQUFBLE1BQ2hCLGVBQWU7QUFBQSxNQUNmLGVBQWU7QUFBQSxNQUNmLGlCQUFpQjtBQUFBLE1BQ2pCLFVBQVUsNEJBQWE7QUFBQSxNQUN2QixzQkFBc0I7QUFBQSxNQUN0QiwwQkFBMEIsQ0FBQztBQUFBLE1BQzNCLGNBQWM7QUFBQSxNQUNkLEtBQUs7QUFBQSxNQUNMLG9CQUFvQjtBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUVBLFFBQU0sMkNBQTJDO0FBQUEsT0FDNUM7QUFBQSxJQUNILGlCQUFpQjtBQUFBLFNBQ1oseUJBQXlCO0FBQUEsTUFDNUIsVUFBVSw0QkFBYTtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUVBLFFBQU0sc0NBQXNDO0FBQUEsT0FDdkM7QUFBQSxJQUNILGlCQUFpQjtBQUFBLFNBQ1oseUJBQXlCO0FBQUEsTUFDNUIsVUFBVSw0QkFBYTtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUVBLFFBQU0sU0FBUyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUV4QyxRQUFNLG9CQUFvQiw2QkFBTTtBQUM5QixVQUFNLFlBQVksNEJBQVksUUFBVyw0QkFBVyxDQUFDO0FBQ3JELFdBQU87QUFBQSxTQUNGO0FBQUEsTUFDSCxNQUFNO0FBQUEsV0FDRCxVQUFVO0FBQUEsUUFDYjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRixHQVQwQjtBQVcxQixhQUFXLDhDQUFzQjtBQUMvQixTQUFLLFVBQVUsTUFBTSxjQUFjO0FBQUEsRUFDckMsR0FGVyxhQUVWO0FBRUQsWUFBVSw2Q0FBcUI7QUFDN0IsU0FBSyxRQUFRLFFBQVE7QUFBQSxFQUN2QixHQUZVLFlBRVQ7QUFFRCxXQUFTLFdBQVcsTUFBTTtBQUN4QixhQUFTLHdCQUF3QixNQUFNO0FBQ3JDLGlCQUFXLDhDQUFzQjtBQUMvQixhQUFLLHFDQUFxQyxLQUFLLFFBQzVDLEtBQUsseUJBQWdCLHNCQUFzQixFQUMzQyxTQUFTO0FBQUEsVUFDUjtBQUFBLFlBQ0UsSUFBSTtBQUFBLFlBQ0osTUFBTTtBQUFBLFlBQ04sV0FBVztBQUFBLFVBQ2I7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNMLEdBVlcsYUFVVjtBQUVELFNBQUcsOENBQThDLHNCQUFzQjtBQUNyRSxjQUFNLEVBQUUseUJBQXlCO0FBQ2pDLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxxQkFBcUIsRUFBRSxVQUFVLG1CQUFtQixJQUFJO0FBRTlELGNBQU0sT0FBTyxXQUFXLEtBQUssa0NBQWtDO0FBQUEsTUFDakUsQ0FBQztBQUVELFNBQUcscUNBQXFDLHNCQUFzQjtBQUM1RCxjQUFNLEVBQUUseUJBQXlCO0FBQ2pDLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxxQkFBcUIsRUFBRSxVQUFVLG1CQUFtQixJQUFJO0FBRTlELGNBQU0sT0FBTyxXQUFXLFFBQVE7QUFDaEMsY0FBTSxPQUFPLFdBQVcsVUFBVTtBQUFBLFVBQ2hDLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxJQUFJO0FBQUEsY0FDSixNQUFNO0FBQUEsY0FDTixXQUFXO0FBQUEsWUFDYjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxhQUFTLDZCQUE2QixNQUFNO0FBQzFDLFNBQUcsb0RBQW9ELE1BQU07QUFDM0QsY0FBTSxFQUFFLDhCQUE4QjtBQUV0QyxjQUFNLFVBQVU7QUFBQSxVQUNkLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQjtBQUFBLFFBQ25CO0FBRUEsY0FBTSxRQUFRO0FBQUEsYUFDVDtBQUFBLFFBQ0w7QUFDQSxjQUFNLFlBQVksNEJBQVEsT0FBTywwQkFBMEIsT0FBTyxDQUFDO0FBRW5FLGNBQU0sZ0JBQWdCO0FBQUEsYUFDakI7QUFBQSxVQUNILHFCQUFxQjtBQUFBLFlBQ25CLG9DQUFvQztBQUFBLGlCQUMvQiwwQkFBMEIsb0JBQzNCO0FBQUEsY0FFRixpQkFBaUI7QUFBQSxZQUNuQjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBRUEsMkJBQU8sVUFBVSxXQUFXLGFBQWE7QUFBQSxNQUMzQyxDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsYUFBUyxpQkFBaUIsTUFBTTtBQUM5QixpQkFBVyw4Q0FBc0I7QUFDL0IsYUFBSyw4QkFBOEIsS0FBSyxRQUFRLEtBQzlDLHlCQUNBLGVBQ0Y7QUFBQSxNQUNGLEdBTFcsYUFLVjtBQUVELFNBQUcsOENBQThDLGdCQUFnQjtBQUMvRCxjQUFNLEVBQUUsa0JBQWtCO0FBQzFCLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxrQkFBa0I7QUFBQSxVQUN0QixJQUFJO0FBQUEsVUFDSixNQUFNO0FBQUEsUUFDUjtBQUNBLGNBQU0sV0FBVyw2QkFBTztBQUFBLGFBQ25CLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxlQUNKO0FBQUEsVUFDTDtBQUFBLFFBQ0YsSUFMaUI7QUFPakIsc0JBQWMsZUFBZSxFQUFFLFVBQVUsVUFBVSxJQUFJO0FBRXZELGNBQU0sT0FBTyxXQUFXLEtBQUssMkJBQTJCO0FBQ3hELGNBQU0sT0FBTyxXQUNYLEtBQUssNkJBQ0wsbUNBQ0EsT0FDQSxlQUNGO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyw2QkFBNkIsTUFBTTtBQUNwQyxjQUFNLEVBQUUsa0JBQWtCO0FBQzFCLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxrQkFBa0I7QUFBQSxVQUN0QixJQUFJO0FBQUEsVUFDSixNQUFNO0FBQUEsUUFDUjtBQUNBLGNBQU0sV0FBVyw2QkFBTztBQUFBLGFBQ25CLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxlQUNKO0FBQUEsVUFDTDtBQUFBLFFBQ0YsSUFMaUI7QUFPakIsc0JBQWMsZUFBZSxFQUFFLFVBQVUsVUFBVSxJQUFJO0FBRXZELGNBQU0sT0FBTyxXQUFXLFFBQVE7QUFDaEMsY0FBTSxPQUFPLFdBQVcsVUFBVTtBQUFBLFVBQ2hDLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxRQUNYLENBQUM7QUFBQSxNQUNILENBQUM7QUFFRCxTQUFHLG1EQUFtRCxNQUFNO0FBQzFELGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxFQUFFLGtCQUFrQjtBQUMxQixjQUFNLGtCQUFrQjtBQUFBLFVBQ3RCLElBQUk7QUFBQSxVQUNKLE1BQU07QUFBQSxRQUNSO0FBRUEsY0FBTSxXQUFXLDZCQUFPO0FBQUEsYUFDbkIsa0JBQWtCO0FBQUEsVUFDckIsU0FBUztBQUFBLGVBQ0o7QUFBQSxVQUNMO0FBQUEsUUFDRixJQUxpQjtBQU9qQixzQkFBYyxlQUFlLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFFdkQsY0FBTSxTQUFTLFNBQVMsUUFBUSxDQUFDLEVBQUUsS0FBSztBQUV4QyxjQUFNLFlBQVksNEJBQVEsU0FBUyxFQUFFLFNBQVMsTUFBTTtBQUVwRCwyQkFBTyxVQUFVLFVBQVUsZUFBZTtBQUMxQywyQkFBTyxNQUNMLFVBQVUsaUJBQWlCLGtCQUMzQixlQUNGO0FBQ0EsMkJBQU8sWUFDTCxVQUFVLGlCQUFpQiwwQkFDN0I7QUFBQSxNQUNGLENBQUM7QUFFRCxTQUFHLG1EQUFtRCxNQUFNO0FBQzFELGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxFQUFFLGtCQUFrQjtBQUUxQixjQUFNLFdBQVcsNkJBQU87QUFBQSxhQUNuQixrQkFBa0I7QUFBQSxVQUNyQixTQUFTO0FBQUEsZUFDSjtBQUFBLFVBQ0w7QUFBQSxRQUNGLElBTGlCO0FBT2pCLHNCQUFjLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFFeEMsY0FBTSxTQUFTLFNBQVMsUUFBUSxDQUFDLEVBQUUsS0FBSztBQUV4QyxjQUFNLFlBQVksNEJBQVEsU0FBUyxFQUFFLFNBQVMsTUFBTTtBQUVwRCwyQkFBTyxVQUFVLFVBQVUsZUFBZTtBQUMxQywyQkFBTyxZQUFZLFVBQVUsaUJBQWlCLGdCQUFnQjtBQUM5RCwyQkFBTyxZQUNMLFVBQVUsaUJBQWlCLDBCQUM3QjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsY0FBYyxNQUFNO0FBQzNCLFlBQU0sRUFBRSxlQUFlO0FBRXZCLGlCQUFXLDhDQUFzQjtBQUMvQixhQUFLLHVCQUF1QixLQUFLLFFBQzlCLEtBQUsseUJBQWdCLGtCQUFrQixFQUN2QyxTQUFTO0FBQ1osYUFBSyxxQkFBcUIsS0FBSyxRQUM1QixLQUFLLHlCQUFnQixlQUFlLEVBQ3BDLFNBQVM7QUFBQSxNQUNkLEdBUFcsYUFPVjtBQUVELGVBQVMsMkJBQTJCLE1BQU07QUFDeEMsY0FBTSxXQUFXLDZCQUFPO0FBQUEsYUFDbkIsa0JBQWtCO0FBQUEsVUFDckIsU0FBUztBQUFBLFFBQ1gsSUFIaUI7QUFLakIsV0FBRyw0Q0FBNEMsWUFBWTtBQUN6RCxnQkFBTSxXQUFXLE1BQU0sSUFBSTtBQUUzQixnQkFBTSxXQUFXO0FBQUEsWUFDZixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFFM0IsZ0JBQU0sT0FBTyxXQUFXLFFBQVE7QUFDaEMsZ0JBQU0sT0FBTyxXQUFXLFVBQVU7QUFBQSxZQUNoQyxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsY0FDUCxnQkFBZ0I7QUFBQSxjQUNoQixhQUFhO0FBQUEsWUFDZjtBQUFBLFVBQ0YsQ0FBQztBQUVELGdCQUFNLFdBQVc7QUFBQSxZQUNmLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLFVBQVUsSUFBSTtBQUUzQixnQkFBTSxPQUFPLFlBQVksUUFBUTtBQUNqQyxnQkFBTSxPQUFPLFdBQVcsVUFBVTtBQUFBLFlBQ2hDLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxjQUNQLGdCQUFnQjtBQUFBLGNBQ2hCLGFBQWE7QUFBQSxZQUNmO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsV0FBRywrQ0FBK0Msc0JBQXNCO0FBQ3RFLGdCQUFNLFdBQVcsTUFBTSxJQUFJO0FBRTNCLGdCQUFNLFdBQVc7QUFBQSxZQUNmLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLFVBQVUsSUFBSTtBQUUzQixnQkFBTSxPQUFPLFdBQVcsS0FBSyxvQkFBb0I7QUFDakQsZ0JBQU0sT0FBTyxXQUNYLEtBQUssc0JBQ0wsb0NBQ0EsSUFDRjtBQUVBLGdCQUFNLFdBQVc7QUFBQSxZQUNmLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLFVBQVUsSUFBSTtBQUUzQixnQkFBTSxPQUFPLFlBQVksS0FBSyxvQkFBb0I7QUFDbEQsZ0JBQU0sT0FBTyxXQUNYLEtBQUssc0JBQ0wsb0NBQ0EsS0FDRjtBQUFBLFFBQ0YsQ0FBQztBQUVELFdBQUcsMERBQTBELFlBQVk7QUFDdkUsZ0JBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsZ0JBQU0sV0FBVztBQUFBLFlBQ2YsZ0JBQWdCO0FBQUEsWUFDaEIsYUFBYTtBQUFBLFVBQ2YsQ0FBQyxFQUFFLFVBQVUsVUFBVSxJQUFJO0FBQzNCLGdCQUFNLFNBQVMsU0FBUyxRQUFRLENBQUMsRUFBRSxLQUFLO0FBRXhDLGdCQUFNLFNBQVMsNEJBQVEsNkJBQTZCLE1BQU07QUFFMUQsNkJBQU8sVUFBVSxPQUFPLGlCQUFpQjtBQUFBLFlBQ3ZDLGdCQUFnQjtBQUFBLFlBQ2hCLGVBQWU7QUFBQSxZQUNmLGVBQWU7QUFBQSxZQUNmLGlCQUFpQjtBQUFBLFlBQ2pCLFVBQVUsNEJBQWE7QUFBQSxZQUN2QixzQkFBc0I7QUFBQSxZQUN0QiwwQkFBMEIsQ0FBQztBQUFBLFlBQzNCLGNBQWM7QUFBQSxZQUNkLEtBQUs7QUFBQSxZQUNMLG9CQUFvQjtBQUFBLFVBQ3RCLENBQUM7QUFBQSxRQUNILENBQUM7QUFBQSxNQUNILENBQUM7QUFFRCxlQUFTLDBCQUEwQixNQUFNO0FBQ3ZDLGNBQU0sV0FBVyw2QkFBTztBQUFBLGFBQ25CLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxRQUNYLElBSGlCO0FBS2pCLFdBQUcsNENBQTRDLFlBQVk7QUFDekQsZ0JBQU0sV0FBVyxNQUFNLElBQUk7QUFFM0IsZ0JBQU0sV0FBVztBQUFBLFlBQ2YsZ0JBQWdCO0FBQUEsWUFDaEIsYUFBYTtBQUFBLFVBQ2YsQ0FBQyxFQUFFLFVBQVUsVUFBVSxJQUFJO0FBRTNCLGdCQUFNLE9BQU8sV0FBVyxRQUFRO0FBQ2hDLGdCQUFNLE9BQU8sV0FBVyxVQUFVO0FBQUEsWUFDaEMsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLGNBQ1AsZ0JBQWdCO0FBQUEsY0FDaEIsYUFBYTtBQUFBLFlBQ2Y7QUFBQSxVQUNGLENBQUM7QUFFRCxnQkFBTSxXQUFXO0FBQUEsWUFDZixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFFM0IsZ0JBQU0sT0FBTyxZQUFZLFFBQVE7QUFDakMsZ0JBQU0sT0FBTyxXQUFXLFVBQVU7QUFBQSxZQUNoQyxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsY0FDUCxnQkFBZ0I7QUFBQSxjQUNoQixhQUFhO0FBQUEsWUFDZjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsNkNBQTZDLHNCQUFzQjtBQUNwRSxnQkFBTSxXQUFXLE1BQU0sSUFBSTtBQUUzQixnQkFBTSxXQUFXO0FBQUEsWUFDZixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFFM0IsZ0JBQU0sT0FBTyxXQUFXLEtBQUssa0JBQWtCO0FBQy9DLGdCQUFNLE9BQU8sV0FDWCxLQUFLLG9CQUNMLG1DQUNBLE1BQ0EsSUFDRjtBQUVBLGdCQUFNLFdBQVc7QUFBQSxZQUNmLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLFVBQVUsSUFBSTtBQUUzQixnQkFBTSxPQUFPLFlBQVksS0FBSyxrQkFBa0I7QUFDaEQsZ0JBQU0sT0FBTyxXQUNYLEtBQUssb0JBQ0wsbUNBQ0EsTUFDQSxLQUNGO0FBQUEsUUFDRixDQUFDO0FBRUQsV0FBRywwREFBMEQsWUFBWTtBQUN2RSxnQkFBTSxXQUFXLE1BQU0sSUFBSTtBQUMzQixnQkFBTSxXQUFXO0FBQUEsWUFDZixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsVUFBVSxVQUFVLElBQUk7QUFDM0IsZ0JBQU0sU0FBUyxTQUFTLFFBQVEsQ0FBQyxFQUFFLEtBQUs7QUFFeEMsZ0JBQU0sU0FBUyw0QkFBUSw0QkFBNEIsTUFBTTtBQUV6RCw2QkFBTyxVQUFVLE9BQU8saUJBQWlCO0FBQUEsWUFDdkMsZ0JBQWdCO0FBQUEsWUFDaEIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFlBQ2YsaUJBQWlCO0FBQUEsWUFDakIsVUFBVSw0QkFBYTtBQUFBLFlBQ3ZCLHNCQUFzQjtBQUFBLFlBQ3RCLDBCQUEwQixDQUFDO0FBQUEsWUFDM0IsY0FBYztBQUFBLFlBQ2QsS0FBSztBQUFBLFlBQ0wsb0JBQW9CO0FBQUEsVUFDdEIsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsY0FBYyxNQUFNO0FBQzNCLFlBQU0sRUFBRSxlQUFlO0FBRXZCLGlCQUFXLDhDQUFzQjtBQUMvQixhQUFLLGlDQUFpQyxLQUFLLFFBQVEsS0FDakQseUJBQ0Esa0JBQ0Y7QUFBQSxNQUNGLEdBTFcsYUFLVjtBQUVELFNBQUcsaURBQWlELGdCQUFnQjtBQUNsRSxtQkFBVyxFQUFFLGdCQUFnQixNQUFNLENBQUM7QUFFcEMsY0FBTSxPQUFPLFdBQVcsS0FBSyw4QkFBOEI7QUFDM0QsY0FBTSxPQUFPLFdBQVcsS0FBSyxnQ0FBZ0MsS0FBSztBQUFBLE1BQ3BFLENBQUM7QUFFRCxTQUFHLDJEQUEyRCxNQUFNO0FBQ2xFLGNBQU0sU0FBUyw0QkFDYiwyQkFDQSxXQUFXLEVBQUUsZ0JBQWdCLG1DQUFtQyxDQUFDLENBQ25FO0FBRUEsMkJBQU8sWUFDTCxPQUFPLHFCQUNQLGtDQUNGO0FBQ0EsMkJBQU8sWUFBWSxPQUFPLGVBQWU7QUFBQSxNQUMzQyxDQUFDO0FBRUQsU0FBRyw2REFBNkQsTUFBTTtBQUNwRSxjQUFNLFNBQVMsNEJBQ2IsMEJBQ0EsV0FBVyxFQUFFLGdCQUFnQixrQ0FBa0MsQ0FBQyxDQUNsRTtBQUVBLDJCQUFPLFNBQ0wsT0FBTyxxQkFDUCxpQ0FDRjtBQUNBLDJCQUFPLFlBQVksT0FBTyxlQUFlO0FBQUEsTUFDM0MsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsK0JBQStCLE1BQU07QUFDNUMsWUFBTSxFQUFFLGdDQUFnQztBQUV4QyxTQUFHLHFEQUFxRCxNQUFNO0FBQzVELGNBQU0sUUFBUSxrQ0FBYztBQUM1QixjQUFNLFNBQVMsNEJBQTRCO0FBQUEsVUFDekMsZ0JBQWdCO0FBQUEsVUFDaEIsUUFBUSxPQUFPLENBQUM7QUFBQSxRQUNsQixDQUFDO0FBRUQsY0FBTSxTQUFTLDRCQUFRLE9BQU8sTUFBTTtBQUVwQywyQkFBTyxZQUFZLFFBQVEsS0FBSztBQUFBLE1BQ2xDLENBQUM7QUFFRCxTQUFHLHlEQUF5RCxNQUFNO0FBQ2hFLGNBQU0sU0FBUyw0QkFBNEI7QUFBQSxVQUN6QyxnQkFBZ0I7QUFBQSxVQUNoQixRQUFRLE9BQU8sR0FBRztBQUFBLFFBQ3BCLENBQUM7QUFFRCxjQUFNLFNBQVMsNEJBQVEsNEJBQTRCLE1BQU07QUFFekQsMkJBQU8sWUFBWSxRQUFRLDBCQUEwQjtBQUFBLE1BQ3ZELENBQUM7QUFFRCxTQUFHLDRDQUE0QyxNQUFNO0FBQ25ELGNBQU0sU0FBUyw0QkFBNEI7QUFBQSxVQUN6QyxnQkFBZ0I7QUFBQSxVQUNoQixRQUFRLE9BQU8sR0FBRztBQUFBLFFBQ3BCLENBQUM7QUFFRCxjQUFNLFNBQVMsNEJBQVEsNEJBQTRCLE1BQU07QUFDekQsY0FBTSxPQUNKLE9BQU8sb0JBQW9CO0FBRTdCLFlBQUksTUFBTSxhQUFhLHdCQUFTLE9BQU87QUFDckMsZ0JBQU0sSUFBSSxNQUFNLCtCQUErQjtBQUFBLFFBQ2pEO0FBRUEsMkJBQU8sWUFBWSxLQUFLLE1BQU07QUFDOUIsMkJBQU8sWUFBWSxLQUFLLFVBQVU7QUFBQSxNQUNwQyxDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsYUFBUyxlQUFlLE1BQU07QUFDNUIsWUFBTSxFQUFFLGdCQUFnQjtBQUV4QixVQUFJO0FBQ0osVUFBSTtBQUVKLGlCQUFXLDhDQUFzQjtBQUMvQiw0QkFBb0IsS0FBSyxRQUFRLEtBQy9CLHlCQUNBLG1CQUNGO0FBQ0EsMkJBQW1CLEtBQUssUUFBUSxLQUM5Qix5QkFDQSxrQkFDRjtBQUFBLE1BQ0YsR0FUVyxhQVNWO0FBRUQsZUFBUywyQkFBMkIsTUFBTTtBQUN4QyxjQUFNLFdBQVcsNkJBQU87QUFBQSxhQUNuQixrQkFBa0I7QUFBQSxVQUNyQixTQUFTO0FBQUEsUUFDWCxJQUhpQjtBQUtqQixXQUFHLDJDQUEyQyxNQUFNO0FBQ2xELGdCQUFNLFdBQVcsTUFBTSxJQUFJO0FBRTNCLHNCQUFZLEVBQUUsZ0JBQWdCLG1DQUFtQyxDQUFDLEVBQ2hFLFVBQ0EsVUFDQSxJQUNGO0FBRUEsZ0JBQU0sT0FBTyxXQUFXLFFBQVE7QUFDaEMsZ0JBQU0sT0FBTyxXQUFXLFVBQVU7QUFBQSxZQUNoQyxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsY0FDUCxnQkFBZ0I7QUFBQSxZQUNsQjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsZ0RBQWdELE1BQU07QUFDdkQsZ0JBQU0sV0FBVyxNQUFNLElBQUk7QUFFM0Isc0JBQVksRUFBRSxnQkFBZ0IsbUNBQW1DLENBQUMsRUFDaEUsVUFDQSxVQUNBLElBQ0Y7QUFFQSxnQkFBTSxPQUFPLFdBQVcsaUJBQWlCO0FBQ3pDLGdCQUFNLE9BQU8sV0FDWCxtQkFDQSxrQ0FDRjtBQUFBLFFBQ0YsQ0FBQztBQUVELFdBQUcsbUNBQW1DLE1BQU07QUFDMUMsZ0JBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0Isc0JBQVksRUFBRSxnQkFBZ0IsbUNBQW1DLENBQUMsRUFDaEUsVUFDQSxVQUNBLElBQ0Y7QUFDQSxnQkFBTSxTQUFTLFNBQVMsUUFBUSxDQUFDLEVBQUUsS0FBSztBQUV4QyxnQkFBTSxTQUFTLDRCQUFRLDRCQUE0QixNQUFNO0FBRXpELDZCQUFPLFlBQ0wsT0FBTyxxQkFDUCxrQ0FDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUVELGVBQVMsMEJBQTBCLE1BQU07QUFDdkMsY0FBTSxXQUFXLDZCQUFPO0FBQUEsYUFDbkIsa0JBQWtCO0FBQUEsVUFDckIsU0FBUztBQUFBLFFBQ1gsSUFIaUI7QUFLakIsV0FBRyx1REFBdUQsTUFBTTtBQUM5RCxnQkFBTSxXQUFXLE1BQU0sSUFBSTtBQUUzQixzQkFBWSxFQUFFLGdCQUFnQixrQ0FBa0MsQ0FBQyxFQUMvRCxVQUNBLFVBQ0EsSUFDRjtBQUVBLGdCQUFNLE9BQU8sV0FBVyxRQUFRO0FBQ2hDLGdCQUFNLE9BQU8sV0FBVyxVQUFVO0FBQUEsWUFDaEMsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLGNBQ1AsZ0JBQWdCO0FBQUEsY0FDaEIsUUFBUSxPQUFPLEdBQUc7QUFBQSxZQUNwQjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsZ0RBQWdELE1BQU07QUFDdkQsZ0JBQU0sV0FBVyxNQUFNLElBQUk7QUFFM0Isc0JBQVksRUFBRSxnQkFBZ0Isa0NBQWtDLENBQUMsRUFDL0QsVUFDQSxVQUNBLElBQ0Y7QUFFQSxnQkFBTSxPQUFPLFdBQVcsZ0JBQWdCO0FBQ3hDLGdCQUFNLE9BQU8sV0FDWCxrQkFDQSxtQ0FDQSxPQUFPLEdBQUcsQ0FDWjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BSUgsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsOEJBQThCLE1BQU07QUFDM0MsWUFBTSxFQUFFLCtCQUErQjtBQUV2QyxZQUFNLHFCQUFxQjtBQUFBLFFBQ3pCLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFBRTtBQUFBLFFBQzlCLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFBRTtBQUFBLFFBQzlCLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFBRTtBQUFBLFFBQzlCLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFBRTtBQUFBLFFBQzlCLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFBRTtBQUFBLFFBQzlCLEVBQUUsWUFBWSxHQUFHLFNBQVMsRUFBRTtBQUFBLE1BQzlCO0FBRUEsWUFBTSxvQkFBb0Isb0JBQUksSUFBb0I7QUFBQSxRQUNoRCxDQUFDLEdBQUcsa0RBQW1CLEdBQUcsQ0FBQztBQUFBLFFBQzNCLENBQUMsR0FBRyxrREFBbUIsR0FBRyxDQUFDO0FBQUEsUUFDM0IsQ0FBQyxHQUFHLGtEQUFtQixHQUFHLENBQUM7QUFBQSxRQUMzQixDQUFDLEdBQUcsa0RBQW1CLEdBQUcsQ0FBQztBQUFBLFFBQzNCLENBQUMsR0FBRyxrREFBbUIsR0FBRyxDQUFDO0FBQUEsTUFDN0IsQ0FBQztBQUVELFNBQUcsNENBQTRDLE1BQU07QUFDbkQsY0FBTSxTQUFTLDJCQUEyQjtBQUFBLFVBQ3hDLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQjtBQUFBLFVBQ2pCO0FBQUEsUUFDRixDQUFDO0FBRUQsY0FBTSxTQUFTLDRCQUFRLDBCQUEwQixNQUFNO0FBRXZELDJCQUFPLFlBQVksUUFBUSx3QkFBd0I7QUFBQSxNQUNyRCxDQUFDO0FBRUQsU0FBRyxxREFBcUQsTUFBTTtBQUM1RCxjQUFNLFFBQVE7QUFBQSxhQUNUO0FBQUEsVUFDSCxxQkFBcUI7QUFBQSxZQUNuQixtQ0FBbUM7QUFBQSxpQkFDOUIseUJBQXlCLG9CQUMxQjtBQUFBLGNBRUY7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFDQSxjQUFNLFNBQVMsMkJBQTJCO0FBQUEsVUFDeEMsZ0JBQWdCO0FBQUEsVUFDaEIsaUJBQWlCO0FBQUEsVUFDakI7QUFBQSxRQUNGLENBQUM7QUFFRCxjQUFNLFNBQVMsNEJBQVEsT0FBTyxNQUFNO0FBRXBDLDJCQUFPLFlBQVksUUFBUSxLQUFLO0FBQUEsTUFDbEMsQ0FBQztBQUVELFNBQUcsZ0VBQWdFLE1BQU07QUFDdkUsY0FBTSxTQUFTLDJCQUEyQjtBQUFBLFVBQ3hDLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQjtBQUFBLFVBQ2pCO0FBQUEsUUFDRixDQUFDO0FBQ0QsY0FBTSxTQUFTLDRCQUFRLDBCQUEwQixNQUFNO0FBRXZELDJCQUFPLFlBQ0wsT0FBTyxpQkFBaUIsaUJBQ3hCLGtEQUFtQixHQUFHLENBQ3hCO0FBRUEsY0FBTSxPQUNKLE9BQU8sb0JBQW9CO0FBQzdCLFlBQUksTUFBTSxhQUFhLHdCQUFTLE9BQU87QUFDckMsZ0JBQU0sSUFBSSxNQUFNLG1DQUFtQztBQUFBLFFBQ3JEO0FBQ0EsMkJBQU8sZ0JBQWdCLEtBQUssbUJBQW1CLGlCQUFpQjtBQUFBLE1BQ2xFLENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxhQUFTLHdCQUF3QixNQUFNO0FBQ3JDLFlBQU0sRUFBRSx5QkFBeUI7QUFFakMsNEJBQ0ssTUFDNkI7QUFDaEMsY0FBTSxXQUFXLE1BQU0sSUFBSTtBQUUzQiw2QkFBcUIsR0FBRyxJQUFJLEVBQUUsVUFBVSxtQkFBbUIsSUFBSTtBQUUvRCxlQUFPLFNBQVMsUUFBUSxDQUFDLEVBQUUsS0FBSztBQUFBLE1BQ2xDO0FBUlMsQUFVVCxTQUFHLGdEQUFnRCxNQUFNO0FBQ3ZELGNBQU0sU0FBUyw0QkFDYixrQ0FBYyxHQUNkLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxXQUFXO0FBQUEsWUFDbkI7QUFBQSxZQUNBLE9BQU87QUFBQSxZQUNQLFlBQVk7QUFBQSxZQUNaLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQSxvQkFBb0I7QUFBQSxZQUNsQjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLGNBQ1QsZ0JBQWdCO0FBQUEsY0FDaEIsZ0JBQWdCO0FBQUEsY0FDaEIsWUFBWTtBQUFBLGNBQ1osZUFBZTtBQUFBLGNBQ2Ysa0JBQWtCLElBQUk7QUFBQSxZQUN4QjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUMsQ0FDSDtBQUVBLDJCQUFPLFVBQ0wsT0FBTyxvQkFBb0Isb0NBQzNCO0FBQUEsVUFDRSxVQUFVLHdCQUFTO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsVUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFVBQzFDLFdBQVcsa0NBQW1CO0FBQUEsVUFDOUIsVUFBVTtBQUFBLFlBQ1IsT0FBTyxDQUFDLFdBQVc7QUFBQSxZQUNuQjtBQUFBLFlBQ0EsT0FBTztBQUFBLFlBQ1AsWUFBWTtBQUFBLFlBQ1osYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBLG9CQUFvQjtBQUFBLFlBQ2xCO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixTQUFTO0FBQUEsY0FDVCxnQkFBZ0I7QUFBQSxjQUNoQixnQkFBZ0I7QUFBQSxjQUNoQixZQUFZO0FBQUEsY0FDWixlQUFlO0FBQUEsY0FDZixrQkFBa0IsSUFBSTtBQUFBLFlBQ3hCO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FDRjtBQUFBLE1BQ0YsQ0FBQztBQUVELFNBQUcsOENBQThDLE1BQU07QUFDckQsY0FBTSxTQUFTLDRCQUNiLG9CQUNBLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCLGdCQUFnQjtBQUFBLGNBQ2hCLFlBQVk7QUFBQSxjQUNaLGVBQWU7QUFBQSxjQUNmLGtCQUFrQixLQUFLO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFFQSwyQkFBTyxVQUNMLE9BQU8sb0JBQW9CLG9DQUMzQjtBQUFBLFVBQ0UsVUFBVSx3QkFBUztBQUFBLFVBQ25CLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCLGdCQUFnQjtBQUFBLGNBQ2hCLFlBQVk7QUFBQSxjQUNaLGVBQWU7QUFBQSxjQUNmLGtCQUFrQixLQUFLO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUNGO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyxnRUFBZ0UsTUFBTTtBQUN2RSxjQUFNLFFBQVE7QUFBQSxhQUNUO0FBQUEsVUFDSCxxQkFBcUI7QUFBQSxlQUNoQixtQkFBbUI7QUFBQSxZQUN0QixtQ0FBbUM7QUFBQSxpQkFDOUIsbUJBQW1CLG9CQUNwQjtBQUFBLGNBRUYsUUFBUSxPQUFPLEdBQUc7QUFBQSxjQUNsQjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUNBLGNBQU0sU0FBUyw0QkFDYixPQUNBLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCLGdCQUFnQjtBQUFBLGNBQ2hCLFlBQVk7QUFBQSxjQUNaLGVBQWU7QUFBQSxjQUNmLGtCQUFrQixLQUFLO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFFQSwyQkFBTyxRQUNMLE9BQU8sb0JBQW9CLG9DQUMzQjtBQUFBLFVBQ0UsVUFBVSx3QkFBUztBQUFBLFVBQ25CLFFBQVEsT0FBTyxHQUFHO0FBQUEsVUFDbEI7QUFBQSxRQUNGLENBQ0Y7QUFBQSxNQUNGLENBQUM7QUFFRCxTQUFHLG9EQUFvRCxNQUFNO0FBQzNELGNBQU0sUUFBUTtBQUFBLGFBQ1Q7QUFBQSxVQUNILHFCQUFxQjtBQUFBLGVBQ2hCLG1CQUFtQjtBQUFBLFlBQ3RCLG1DQUFtQztBQUFBLGlCQUM5QixtQkFBbUIsb0JBQ3BCO0FBQUEsY0FFRixRQUFRLE9BQU8sR0FBRztBQUFBLGNBQ2xCO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQ0EsY0FBTSxTQUFTLDRCQUNiLE9BQ0EsVUFBVTtBQUFBLFVBQ1IsZ0JBQWdCO0FBQUEsVUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFVBQzFDLFdBQVcsa0NBQW1CO0FBQUEsVUFDOUIsZUFBZTtBQUFBLFVBQ2YsZUFBZTtBQUFBLFVBQ2YsVUFBVTtBQUFBLFlBQ1IsT0FBTyxDQUFDLHNDQUFzQztBQUFBLFlBQzlDLFlBQVk7QUFBQSxZQUNaLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQSxvQkFBb0I7QUFBQSxZQUNsQjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLGNBQ1QsZ0JBQWdCO0FBQUEsY0FDaEIsZ0JBQWdCO0FBQUEsY0FDaEIsWUFBWTtBQUFBLGNBQ1osZUFBZTtBQUFBLGNBQ2Ysa0JBQWtCLEtBQUs7QUFBQSxZQUN6QjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUMsQ0FDSDtBQUVBLDJCQUFPLFlBQ0wsT0FBTyxvQkFBb0Isb0NBQzNCLFFBQ0Y7QUFDQSwyQkFBTyxZQUNMLE9BQU8sb0JBQW9CLG9DQUMzQixZQUNGO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyw2REFBNkQsTUFBTTtBQUNwRSxjQUFNLFNBQVMsNEJBQ2Isb0JBQ0EsVUFBVTtBQUFBLFVBQ1IsZ0JBQWdCO0FBQUEsVUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFVBQzFDLFdBQVcsa0NBQW1CO0FBQUEsVUFDOUIsZUFBZTtBQUFBLFVBQ2YsZUFBZTtBQUFBLFVBQ2YsVUFBVTtBQUFBLFlBQ1IsT0FBTyxDQUFDLHNDQUFzQztBQUFBLFlBQzlDLFlBQVk7QUFBQSxZQUNaLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQSxvQkFBb0I7QUFBQSxZQUNsQjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLGNBQ1QsZ0JBQWdCO0FBQUEsY0FDaEIsZ0JBQWdCO0FBQUEsY0FDaEIsWUFBWTtBQUFBLGNBQ1osZUFBZTtBQUFBLGNBQ2Ysa0JBQWtCLEtBQUs7QUFBQSxZQUN6QjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUMsQ0FDSDtBQUVBLDJCQUFPLFlBQVksT0FBTyxlQUFlO0FBQUEsTUFDM0MsQ0FBQztBQUVELFNBQUcsa0VBQWtFLE1BQU07QUFDekUsY0FBTSxTQUFTLDRCQUNiLDBCQUNBLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCLGdCQUFnQjtBQUFBLGNBQ2hCLFlBQVk7QUFBQSxjQUNaLGVBQWU7QUFBQSxjQUNmLGtCQUFrQixLQUFLO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFFQSwyQkFBTyxVQUFVLE9BQU8saUJBQWlCO0FBQUEsVUFDdkMsZ0JBQWdCO0FBQUEsVUFDaEIsZUFBZTtBQUFBLFVBQ2YsZUFBZTtBQUFBLFVBQ2YsaUJBQWlCO0FBQUEsVUFDakIsVUFBVSw0QkFBYTtBQUFBLFVBQ3ZCLHNCQUFzQjtBQUFBLFVBQ3RCLDBCQUEwQixDQUFDO0FBQUEsVUFDM0IsY0FBYztBQUFBLFVBQ2QsS0FBSztBQUFBLFVBQ0wsb0JBQW9CO0FBQUEsUUFDdEIsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUVELFNBQUcsd0RBQXdELE1BQU07QUFDL0QsY0FBTSxTQUFTLDRCQUNiLDBCQUNBLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCLGdCQUFnQjtBQUFBLGNBQ2hCLFlBQVk7QUFBQSxjQUNaLGVBQWU7QUFBQSxjQUNmLGtCQUFrQixLQUFLO0FBQUEsWUFDekI7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFFQSwyQkFBTyxZQUNMLE9BQU8saUJBQWlCLGdCQUN4QixpQ0FDRjtBQUNBLDJCQUFPLE9BQU8sT0FBTyxpQkFBaUIsYUFBYTtBQUNuRCwyQkFBTyxPQUFPLE9BQU8saUJBQWlCLGFBQWE7QUFBQSxNQUNyRCxDQUFDO0FBRUQsU0FBRyxpREFBaUQsTUFBTTtBQUN4RCxjQUFNLFFBQVE7QUFBQSxhQUNUO0FBQUEsVUFDSCxpQkFBaUI7QUFBQSxlQUNaLHlCQUF5QjtBQUFBLFlBQzVCLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFFBQ0Y7QUFDQSxjQUFNLFNBQVMsNEJBQ2IsT0FDQSxVQUFVO0FBQUEsVUFDUixnQkFBZ0I7QUFBQSxVQUNoQixpQkFBaUIsd0NBQXlCO0FBQUEsVUFDMUMsV0FBVyxrQ0FBbUI7QUFBQSxVQUM5QixlQUFlO0FBQUEsVUFDZixlQUFlO0FBQUEsVUFDZixVQUFVO0FBQUEsWUFDUixPQUFPLENBQUM7QUFBQSxZQUNSLFlBQVk7QUFBQSxZQUNaLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQSxvQkFBb0IsQ0FBQztBQUFBLFFBQ3ZCLENBQUMsQ0FDSDtBQUVBLDJCQUFPLE9BQU8sT0FBTyxpQkFBaUIsWUFBWTtBQUFBLE1BQ3BELENBQUM7QUFFRCxTQUFHLDRDQUE0QyxNQUFNO0FBQ25ELGNBQU0sUUFBUTtBQUFBLGFBQ1Q7QUFBQSxVQUNILGlCQUFpQjtBQUFBLGVBQ1oseUJBQXlCO0FBQUEsWUFDNUIsY0FBYztBQUFBLFVBQ2hCO0FBQUEsUUFDRjtBQUNBLGNBQU0sU0FBUyw0QkFDYixPQUNBLFVBQVU7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGlCQUFpQix3Q0FBeUI7QUFBQSxVQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFVBQzlCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLE9BQU8sQ0FBQyxzQ0FBc0M7QUFBQSxZQUM5QyxZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CLENBQUM7QUFBQSxRQUN2QixDQUFDLENBQ0g7QUFFQSwyQkFBTyxRQUFRLE9BQU8saUJBQWlCLFlBQVk7QUFBQSxNQUNyRCxDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsYUFBUyw2QkFBNkIsTUFBTTtBQUMxQyxZQUFNLEVBQUUsOEJBQThCO0FBRXRDLGlCQUFXLDhDQUFzQjtBQUMvQixhQUFLLDhCQUE4QixLQUFLLFFBQVEsS0FDOUMseUJBQ0EsZUFDRjtBQUNBLGFBQUssOENBQThDLEtBQUssUUFBUSxLQUM5RCx5QkFDQSwrQkFDRjtBQUNBLGFBQUssUUFBUSxLQUFLLFFBQVEsY0FBYztBQUFBLE1BQzFDLEdBVlcsYUFVVjtBQUVELGVBQVMsU0FBUyxNQUFNO0FBQ3RCLDBCQUFrQixpQkFBMkM7QUFDM0QsaUJBQU8sc0JBQXlDO0FBQzlDLGtCQUFNLFdBQVcsTUFBTSxJQUFJO0FBRTNCLGtCQUFNLDBCQUEwQjtBQUFBLGNBQzlCLGdCQUFnQjtBQUFBLFlBQ2xCLENBQUMsRUFDQyxVQUNBLE1BQU87QUFBQSxpQkFDRixrQkFBa0I7QUFBQSxjQUNyQixTQUFTO0FBQUEsbUJBQ0o7QUFBQSxnQkFDSCxxQkFBcUI7QUFBQSxrQkFDbkIsbUNBQW1DO0FBQUEsdUJBQzlCLG1CQUFtQixvQkFDcEI7QUFBQSxvQkFFRjtBQUFBLGtCQUNGO0FBQUEsZ0JBQ0Y7QUFBQSxjQUNGO0FBQUEsWUFDRixJQUNBLElBQ0Y7QUFFQSxrQkFBTSxPQUFPLFVBQVUsUUFBUTtBQUMvQixrQkFBTSxPQUFPLFVBQVUsS0FBSywyQkFBMkI7QUFBQSxVQUN6RDtBQUFBLFFBQ0Y7QUE1QlMsQUE4QlQsV0FDRSx1REFDQSxTQUFTLHdDQUF5QixVQUFVLENBQzlDO0FBRUEsV0FDRSxzREFDQSxTQUFTLHdDQUF5QixTQUFTLENBQzdDO0FBRUEsV0FDRSx5REFDQSxTQUFTLHdDQUF5QixZQUFZLENBQ2hEO0FBQUEsTUFHRixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsYUFBUyxzQkFBc0IsTUFBTTtBQUNuQyxZQUFNLEVBQUUsdUJBQXVCO0FBRS9CLFNBQUcsbUNBQW1DLE1BQU07QUFDMUMsY0FBTSxTQUFTLDRCQUFRLDJCQUEyQixtQkFBbUIsQ0FBQztBQUV0RSwyQkFBTyxVQUFVLFFBQVEseUJBQXlCO0FBQUEsTUFDcEQsQ0FBQztBQUVELFNBQUcsa0JBQWtCLE1BQU07QUFDekIsY0FBTSxRQUFRO0FBQUEsYUFDVDtBQUFBLFVBQ0gsaUJBQWlCO0FBQUEsZUFDWiwwQkFBMEI7QUFBQSxZQUM3QixLQUFLO0FBQUEsVUFDUDtBQUFBLFFBQ0Y7QUFDQSxjQUFNLFNBQVMsNEJBQVEsT0FBTyxtQkFBbUIsQ0FBQztBQUVsRCwyQkFBTyxVQUFVLFFBQVEseUJBQXlCO0FBQUEsTUFDcEQsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsNEJBQTRCLE1BQU07QUFDekMsWUFBTSxFQUFFLDZCQUE2QjtBQUVyQyxTQUFHLGdEQUFnRCxNQUFNO0FBQ3ZELGNBQU0sU0FBUyx5QkFBeUI7QUFBQSxVQUN0QyxnQkFBZ0I7QUFBQSxVQUNoQixRQUFRLE9BQU8sR0FBRztBQUFBLFVBQ2xCO0FBQUEsUUFDRixDQUFDO0FBQ0QsY0FBTSxTQUFTLDRCQUFRLDRCQUE0QixNQUFNO0FBRXpELDJCQUFPLFlBQVksUUFBUSwwQkFBMEI7QUFBQSxNQUN2RCxDQUFDO0FBRUQsU0FBRywrQ0FBK0MsTUFBTTtBQUN0RCxjQUFNLFFBQVE7QUFBQSxhQUNUO0FBQUEsVUFDSCxxQkFBcUI7QUFBQSxlQUNoQixtQkFBbUI7QUFBQSxZQUN0QixtQ0FBbUM7QUFBQSxpQkFDOUIsbUJBQW1CLG9CQUNwQjtBQUFBLGNBRUYsV0FBVyxrQ0FBbUI7QUFBQSxZQUNoQztBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQ0EsY0FBTSxTQUFTLHlCQUF5QjtBQUFBLFVBQ3RDLGdCQUFnQjtBQUFBLFVBQ2hCLFFBQVEsT0FBTyxHQUFHO0FBQUEsVUFDbEI7QUFBQSxRQUNGLENBQUM7QUFDRCxjQUFNLFNBQVMsNEJBQVEsT0FBTyxNQUFNO0FBRXBDLDJCQUFPLFlBQVksUUFBUSxLQUFLO0FBQUEsTUFDbEMsQ0FBQztBQUVELFNBQUcsaURBQWlELE1BQU07QUFDeEQsY0FBTSxTQUFTLHlCQUF5QjtBQUFBLFVBQ3RDLGdCQUFnQjtBQUFBLFVBQ2hCLFFBQVEsT0FBTyxHQUFHO0FBQUEsVUFDbEI7QUFBQSxRQUNGLENBQUM7QUFDRCxjQUFNLFNBQVMsNEJBQVEsa0NBQWMsR0FBRyxNQUFNO0FBRTlDLDJCQUFPLFVBQ0wsT0FBTyxvQkFBb0Isb0NBQzNCO0FBQUEsVUFDRSxVQUFVLHdCQUFTO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsVUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFVBQzFDLFdBQVcsa0NBQW1CO0FBQUEsVUFDOUIsVUFBVTtBQUFBLFlBQ1IsT0FBTyxDQUFDO0FBQUEsWUFDUixZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0Esb0JBQW9CLENBQUM7QUFBQSxVQUNyQixRQUFRLE9BQU8sR0FBRztBQUFBLFVBQ2xCO0FBQUEsUUFDRixDQUNGO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRywyQ0FBMkMsTUFBTTtBQUNsRCxjQUFNLFNBQVMseUJBQXlCO0FBQUEsVUFDdEMsZ0JBQWdCO0FBQUEsVUFDaEIsUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUNsQjtBQUFBLFFBQ0YsQ0FBQztBQUNELGNBQU0sU0FBUyw0QkFBUSxvQkFBb0IsTUFBTTtBQUVqRCwyQkFBTyxRQUNMLE9BQU8sb0JBQW9CLG9DQUMzQjtBQUFBLFVBQ0UsUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUNsQjtBQUFBLFFBQ0YsQ0FDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsaUJBQWlCLE1BQU07QUFDOUIsWUFBTSxFQUFFLGtCQUFrQjtBQUUxQixpQkFBVyw4Q0FBc0I7QUFDL0IsYUFBSyxpQ0FBaUMsS0FBSyxRQUFRLEtBQ2pELHlCQUNBLGtCQUNGO0FBQUEsTUFDRixHQUxXLGFBS1Y7QUFFRCxTQUFHLGlEQUFpRCxNQUFNO0FBQ3hELGNBQU0sV0FBVyxNQUFNLElBQUk7QUFFM0Isc0JBQWMsRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUM3QixVQUNBLE1BQU87QUFBQSxhQUNGLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxRQUNYLElBQ0EsSUFDRjtBQUVBLGNBQU0sT0FBTyxXQUFXLFFBQVE7QUFDaEMsY0FBTSxPQUFPLFdBQVcsVUFBVTtBQUFBLFVBQ2hDLE1BQU07QUFBQSxVQUNOLFNBQVMsRUFBRSxTQUFTLEtBQUs7QUFBQSxRQUMzQixDQUFDO0FBQUEsTUFDSCxDQUFDO0FBRUQsU0FBRyxrREFBa0QsZ0JBQWdCO0FBQ25FLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFFM0Isc0JBQWMsRUFBRSxTQUFTLE1BQU0sQ0FBQyxFQUM5QixVQUNBLE1BQU87QUFBQSxhQUNGLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxRQUNYLElBQ0EsSUFDRjtBQUVBLGNBQU0sT0FBTyxXQUFXLEtBQUssOEJBQThCO0FBQzNELGNBQU0sT0FBTyxXQUNYLEtBQUssZ0NBQ0wsb0NBQ0EsS0FDRjtBQUVBLHNCQUFjLEVBQUUsU0FBUyxLQUFLLENBQUMsRUFDN0IsVUFDQSxNQUFPO0FBQUEsYUFDRixrQkFBa0I7QUFBQSxVQUNyQixTQUFTO0FBQUEsUUFDWCxJQUNBLElBQ0Y7QUFFQSxjQUFNLE9BQU8sWUFBWSxLQUFLLDhCQUE4QjtBQUM1RCxjQUFNLE9BQU8sV0FDWCxLQUFLLGdDQUNMLG9DQUNBLElBQ0Y7QUFBQSxNQUNGLENBQUM7QUFFRCxTQUFHLGdFQUFnRSxNQUFNO0FBQ3ZFLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0Isc0JBQWMsRUFBRSxTQUFTLE1BQU0sQ0FBQyxFQUM5QixVQUNBLE1BQU87QUFBQSxhQUNGLGtCQUFrQjtBQUFBLFVBQ3JCLFNBQVM7QUFBQSxRQUNYLElBQ0EsSUFDRjtBQUNBLGNBQU0sU0FBUyxTQUFTLFFBQVEsQ0FBQyxFQUFFLEtBQUs7QUFFeEMsY0FBTSxTQUFTLDRCQUFRLDJCQUEyQixNQUFNO0FBRXhELDJCQUFPLFFBQVEsT0FBTyxpQkFBaUIsYUFBYTtBQUFBLE1BQ3RELENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxhQUFTLG1CQUFtQixNQUFNO0FBQ2hDLFlBQU0sRUFBRSxvQkFBb0I7QUFFNUIsU0FBRyw0QkFBNEIsTUFBTTtBQUNuQyxjQUFNLFNBQVMsZ0JBQWdCLElBQUk7QUFDbkMsY0FBTSxTQUFTLDRCQUFRLDBCQUEwQixNQUFNO0FBRXZELDJCQUFPLE9BQU8sT0FBTyxpQkFBaUIsWUFBWTtBQUFBLE1BQ3BELENBQUM7QUFFRCxTQUFHLDZCQUE2QixNQUFNO0FBQ3BDLGNBQU0sU0FBUyxnQkFBZ0IsS0FBSztBQUNwQyxjQUFNLFNBQVMsNEJBQVEsMkJBQTJCLE1BQU07QUFFeEQsMkJBQU8sUUFBUSxPQUFPLGlCQUFpQixZQUFZO0FBQUEsTUFDckQsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMscUJBQXFCLE1BQU07QUFDbEMsWUFBTSxFQUFFLHNCQUFzQjtBQUU5QixVQUFJO0FBQ0osVUFBSTtBQUVKLGlCQUFXLDhDQUFzQjtBQUMvQixnQ0FBd0IsS0FBSyxRQUMxQixLQUFLLHlCQUFnQixtQkFBbUIsRUFDeEMsU0FBUztBQUVaLGNBQU0saUJBQWlCLGtCQUFrQjtBQUN6QyxvQkFBWTtBQUFBLGFBQ1A7QUFBQSxVQUNILGVBQWU7QUFBQSxlQUNWLGVBQWU7QUFBQSxZQUNsQixvQkFBb0I7QUFBQSxjQUNsQix3QkFBd0IsMERBQXVCO0FBQUEsWUFDakQ7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsR0FmVyxhQWVWO0FBRUQsZUFBUyxTQUFTLE1BQU07QUFDdEIsV0FBRywrQ0FBK0MsWUFBWTtBQUM1RCxnQkFBTSxrQkFBa0I7QUFBQSxZQUN0QixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsb0JBQU0sTUFBTSxXQUFXLElBQUk7QUFFOUIsZ0JBQU0sT0FBTyxXQUFXLHFCQUFxQjtBQUFBLFFBQy9DLENBQUM7QUFFRCxXQUFHLDZCQUE2QixZQUFZO0FBQzFDLGdCQUFNLGtCQUFrQjtBQUFBLFlBQ3RCLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxvQkFBTSxNQUFNLFdBQVcsSUFBSTtBQUU5QixnQkFBTSxPQUFPLGdCQUFnQix1QkFBdUI7QUFBQSxZQUNsRCxlQUFlO0FBQUEsVUFDakIsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsaUVBQWlFLFlBQVk7QUFDOUUsZ0JBQU0sa0JBQWtCO0FBQUEsWUFDdEIsZ0JBQWdCO0FBQUEsWUFDaEIsYUFBYTtBQUFBLFVBQ2YsQ0FBQyxFQUNDLG9CQUNBLE1BQU07QUFDSixrQkFBTSxlQUFlLDZCQUFVLGtCQUFrQjtBQUNqRCx5QkFBYSxvQkFDWCxtQ0FDQSxTQUFTLGNBQWM7QUFDekIsbUJBQU8sS0FBSyxXQUFXLFNBQVMsYUFBYTtBQUFBLFVBQy9DLEdBQ0EsSUFDRjtBQUVBLGdCQUFNLE9BQU8sZ0JBQWdCLHVCQUF1QjtBQUFBLFlBQ2xELGVBQWU7QUFBQSxVQUNqQixDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsV0FBRyw2Q0FBNkMsWUFBWTtBQUMxRCxnQkFBTSxrQkFBa0I7QUFBQSxZQUN0QixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsb0JBQU0sTUFBTSxXQUFXLElBQUk7QUFFOUIsZ0JBQU0sT0FBTyxnQkFBZ0IsdUJBQXVCO0FBQUEsWUFDbEQsZUFBZTtBQUFBLFVBQ2pCLENBQUM7QUFBQSxRQUNILENBQUM7QUFFRCxXQUFHLCtDQUErQyxZQUFZO0FBQzVELGdCQUFNLGtCQUFrQjtBQUFBLFlBQ3RCLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxvQkFBTSxNQUFNLFdBQVcsSUFBSTtBQUU5QixnQkFBTSxPQUFPLGdCQUFnQix1QkFBdUI7QUFBQSxZQUNsRCxlQUFlO0FBQUEsVUFDakIsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsK0RBQStELFlBQVk7QUFDNUUsZ0NBQXNCLFNBQVM7QUFBQSxZQUM3QixVQUFVLHdCQUFTO0FBQUEsWUFDbkIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFVBQ2pCLENBQUM7QUFFRCxnQkFBTSxXQUFXLE1BQU0sS0FBSztBQUU1QixnQkFBTSxrQkFBa0I7QUFBQSxZQUN0QixnQkFBZ0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDZixDQUFDLEVBQUUsVUFBVSxNQUFNLFdBQVcsSUFBSTtBQUVsQyxnQkFBTSxPQUFPLFdBQVcsUUFBUTtBQUFBLFFBQ2xDLENBQUM7QUFFRCxXQUFHLG1FQUFtRSxZQUFZO0FBQ2hGLGdCQUFNLFdBQVcsTUFBTSxLQUFLO0FBRTVCLGdCQUFNLGtCQUFrQjtBQUFBLFlBQ3RCLGdCQUFnQjtBQUFBLFlBQ2hCLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLE1BQU0sV0FBVyxJQUFJO0FBRWxDLGdCQUFNLE9BQU8sVUFBVSxRQUFRO0FBQUEsUUFDakMsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUVELGVBQVMsVUFBVSxNQUFNO0FBQ3ZCLGNBQU0sV0FBVyw4QkFDZixjQUNBLHNCQUdBLGlCQUFpQiwyQkFDYTtBQUM5QixnQ0FBc0IsU0FBUyxvQkFBb0I7QUFFbkQsZ0JBQU0sV0FBVyxNQUFNLEtBQUs7QUFFNUIsZ0JBQU0sa0JBQWtCO0FBQUEsWUFDdEI7QUFBQSxZQUNBLGFBQWE7QUFBQSxVQUNmLENBQUMsRUFBRSxVQUFVLE1BQU8sTUFBSyxXQUFXLFNBQVMsYUFBYSxJQUFJLElBQUk7QUFFbEUsZ0JBQU0sU0FBUyxTQUFTLFFBQVEsQ0FBQyxFQUFFLEtBQUs7QUFFeEMsaUJBQU8sNEJBQVEsY0FBYyxNQUFNO0FBQUEsUUFDckMsR0FuQmlCO0FBcUJqQixXQUFHLDJDQUEyQyxZQUFZO0FBQ3hELGdCQUFNLFNBQVMsTUFBTSxTQUFTLGtDQUFjLEdBQUc7QUFBQSxZQUM3QyxVQUFVLHdCQUFTO0FBQUEsWUFDbkIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFVBQ2pCLENBQUM7QUFFRCw2QkFBTyxVQUFVLE9BQU8sb0JBQW9CLHlCQUF5QjtBQUFBLFlBQ25FLFVBQVUsd0JBQVM7QUFBQSxZQUNuQixnQkFBZ0I7QUFBQSxZQUNoQixZQUFZO0FBQUEsWUFDWixhQUFhO0FBQUEsVUFDZixDQUFDO0FBQ0QsNkJBQU8sVUFBVSxPQUFPLGlCQUFpQjtBQUFBLFlBQ3ZDLGdCQUFnQjtBQUFBLFlBQ2hCLGVBQWU7QUFBQSxZQUNmLGVBQWU7QUFBQSxZQUNmLGlCQUFpQjtBQUFBLFlBQ2pCLFVBQVUsNEJBQWE7QUFBQSxZQUN2QixzQkFBc0I7QUFBQSxZQUN0QiwwQkFBMEIsQ0FBQztBQUFBLFlBQzNCLEtBQUs7QUFBQSxZQUNMLG9CQUFvQjtBQUFBLFlBQ3BCLGNBQWM7QUFBQSxVQUNoQixDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsV0FBRywwQ0FBMEMsWUFBWTtBQUN2RCxnQkFBTSxTQUFTLE1BQU0sU0FBUyxrQ0FBYyxHQUFHO0FBQUEsWUFDN0MsVUFBVSx3QkFBUztBQUFBLFlBQ25CLGVBQWU7QUFBQSxZQUNmLGVBQWU7QUFBQSxZQUNmLGlCQUFpQix3Q0FBeUI7QUFBQSxZQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFlBQzlCLFVBQVU7QUFBQSxjQUNSLE9BQU8sQ0FBQyxXQUFXO0FBQUEsY0FDbkI7QUFBQSxjQUNBLE9BQU87QUFBQSxjQUNQLFlBQVk7QUFBQSxjQUNaLGFBQWE7QUFBQSxZQUNmO0FBQUEsWUFDQSxvQkFBb0I7QUFBQSxjQUNsQjtBQUFBLGdCQUNFLE1BQU07QUFBQSxnQkFDTixTQUFTO0FBQUEsZ0JBQ1QsZ0JBQWdCO0FBQUEsZ0JBQ2hCLGdCQUFnQjtBQUFBLGdCQUNoQixZQUFZO0FBQUEsZ0JBQ1osZUFBZTtBQUFBLGdCQUNmLGtCQUFrQixJQUFJO0FBQUEsY0FDeEI7QUFBQSxZQUNGO0FBQUEsVUFDRixDQUFDO0FBRUQsNkJBQU8sVUFBVSxPQUFPLG9CQUFvQix5QkFBeUI7QUFBQSxZQUNuRSxVQUFVLHdCQUFTO0FBQUEsWUFDbkIsZ0JBQWdCO0FBQUEsWUFDaEIsaUJBQWlCLHdDQUF5QjtBQUFBLFlBQzFDLFdBQVcsa0NBQW1CO0FBQUEsWUFDOUIsVUFBVTtBQUFBLGNBQ1IsT0FBTyxDQUFDLFdBQVc7QUFBQSxjQUNuQjtBQUFBLGNBQ0EsT0FBTztBQUFBLGNBQ1AsWUFBWTtBQUFBLGNBQ1osYUFBYTtBQUFBLFlBQ2Y7QUFBQSxZQUNBLG9CQUFvQjtBQUFBLGNBQ2xCO0FBQUEsZ0JBQ0UsTUFBTTtBQUFBLGdCQUNOLFNBQVM7QUFBQSxnQkFDVCxnQkFBZ0I7QUFBQSxnQkFDaEIsZ0JBQWdCO0FBQUEsZ0JBQ2hCLFlBQVk7QUFBQSxnQkFDWixlQUFlO0FBQUEsZ0JBQ2Ysa0JBQWtCLElBQUk7QUFBQSxjQUN4QjtBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFDRCw2QkFBTyxVQUNMLE9BQU8saUJBQWlCLGdCQUN4QixzQkFDRjtBQUNBLDZCQUFPLFFBQVEsT0FBTyxpQkFBaUIsWUFBWTtBQUFBLFFBQ3JELENBQUM7QUFFRCxXQUFHLDRFQUE0RSxZQUFZO0FBQ3pGLGdCQUFNLFNBQVMsTUFBTSxTQUFTLGtDQUFjLEdBQUc7QUFBQSxZQUM3QyxVQUFVLHdCQUFTO0FBQUEsWUFDbkIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFlBQ2YsaUJBQWlCLHdDQUF5QjtBQUFBLFlBQzFDLFdBQVcsa0NBQW1CO0FBQUEsWUFDOUIsVUFBVTtBQUFBLFlBQ1Ysb0JBQW9CLENBQUM7QUFBQSxVQUN2QixDQUFDO0FBRUQsZ0JBQU0sT0FBTyxPQUFPLG9CQUFvQjtBQUN4Qyw2QkFBTyxVQUFVLE1BQU0sYUFBYSx3QkFBUyxTQUFTLEtBQUssVUFBVTtBQUFBLFlBQ25FLE9BQU8sQ0FBQztBQUFBLFlBQ1IsWUFBWTtBQUFBLFlBQ1osYUFBYTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcseUVBQXlFLFlBQVk7QUFDdEYsZ0JBQU0sU0FBUyxNQUFNLFNBQVMsb0JBQW9CO0FBQUEsWUFDaEQsVUFBVSx3QkFBUztBQUFBLFlBQ25CLGVBQWU7QUFBQSxZQUNmLGVBQWU7QUFBQSxZQUNmLGlCQUFpQix3Q0FBeUI7QUFBQSxZQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFlBQzlCLFVBQVU7QUFBQSxZQUNWLG9CQUFvQjtBQUFBLGNBQ2xCO0FBQUEsZ0JBQ0UsTUFBTTtBQUFBLGdCQUNOLFNBQVM7QUFBQSxnQkFDVCxnQkFBZ0I7QUFBQSxnQkFDaEIsZ0JBQWdCO0FBQUEsZ0JBQ2hCLFlBQVk7QUFBQSxnQkFDWixlQUFlO0FBQUEsZ0JBQ2Ysa0JBQWtCLElBQUk7QUFBQSxjQUN4QjtBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFFRCxnQkFBTSxPQUNKLE9BQU8sb0JBQW9CO0FBQzdCLDZCQUFPLFVBQVUsTUFBTSxhQUFhLHdCQUFTLFNBQVMsS0FBSyxVQUFVO0FBQUEsWUFDbkUsT0FBTyxDQUFDLFdBQVc7QUFBQSxZQUNuQjtBQUFBLFlBQ0EsT0FBTztBQUFBLFlBQ1AsWUFBWTtBQUFBLFlBQ1osYUFBYTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsb0RBQW9ELFlBQVk7QUFDakUsZ0JBQU0sUUFBUTtBQUFBLGVBQ1Qsa0NBQWM7QUFBQSxZQUNqQixxQkFBcUI7QUFBQSxjQUNuQix3QkFBd0I7QUFBQSxtQkFDbkIsbUJBQW1CLG9CQUNwQjtBQUFBLGdCQUVGLGdCQUFnQjtBQUFBLGNBQ2xCO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFFQSxnQkFBTSxTQUFTLE1BQU0sU0FBUyxPQUFPO0FBQUEsWUFDbkMsVUFBVSx3QkFBUztBQUFBLFlBQ25CLGVBQWU7QUFBQSxZQUNmLGVBQWU7QUFBQSxZQUNmLGlCQUFpQix3Q0FBeUI7QUFBQSxZQUMxQyxXQUFXLGtDQUFtQjtBQUFBLFlBQzlCLFVBQVU7QUFBQSxjQUNSLE9BQU8sQ0FBQyxvQkFBb0I7QUFBQSxjQUM1QixhQUFhO0FBQUEsY0FDYixPQUFPO0FBQUEsY0FDUCxZQUFZO0FBQUEsY0FDWixhQUFhO0FBQUEsWUFDZjtBQUFBLFlBQ0Esb0JBQW9CO0FBQUEsY0FDbEI7QUFBQSxnQkFDRSxNQUFNO0FBQUEsZ0JBQ04sU0FBUztBQUFBLGdCQUNULGdCQUFnQjtBQUFBLGdCQUNoQixnQkFBZ0I7QUFBQSxnQkFDaEIsWUFBWTtBQUFBLGdCQUNaLGVBQWU7QUFBQSxnQkFDZixrQkFBa0IsSUFBSTtBQUFBLGNBQ3hCO0FBQUEsWUFDRjtBQUFBLFVBQ0YsQ0FBQztBQUVELGdCQUFNLE9BQU8sT0FBTyxvQkFBb0I7QUFDeEMsNkJBQU8sVUFBVSxNQUFNLGFBQWEsd0JBQVMsU0FBUyxLQUFLLFVBQVU7QUFBQSxZQUNuRSxPQUFPLENBQUMsb0JBQW9CO0FBQUEsWUFDNUIsYUFBYTtBQUFBLFlBQ2IsT0FBTztBQUFBLFlBQ1AsWUFBWTtBQUFBLFlBQ1osYUFBYTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFdBQUcsa0ZBQWtGLFlBQVk7QUFDL0YsZ0JBQU0sU0FBUyxNQUFNLFNBQ25CO0FBQUEsZUFDSztBQUFBLFlBQ0gscUJBQXFCO0FBQUEsY0FDbkIsbUNBQW1DO0FBQUEsbUJBQzlCLG1CQUFtQixvQkFDcEI7QUFBQSxnQkFFRixRQUFRLE9BQU8sR0FBRztBQUFBLGdCQUNsQjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRixHQUNBO0FBQUEsWUFDRSxVQUFVLHdCQUFTO0FBQUEsWUFDbkIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFlBQ2YsaUJBQWlCLHdDQUF5QjtBQUFBLFlBQzFDLFdBQVcsa0NBQW1CO0FBQUEsWUFDOUIsVUFBVTtBQUFBLFlBQ1Ysb0JBQW9CO0FBQUEsY0FDbEI7QUFBQSxnQkFDRSxNQUFNO0FBQUEsZ0JBQ04sU0FBUztBQUFBLGdCQUNULGdCQUFnQjtBQUFBLGdCQUNoQixnQkFBZ0I7QUFBQSxnQkFDaEIsWUFBWTtBQUFBLGdCQUNaLGVBQWU7QUFBQSxnQkFDZixrQkFBa0IsSUFBSTtBQUFBLGNBQ3hCO0FBQUEsWUFDRjtBQUFBLFVBQ0YsQ0FDRjtBQUNBLGdCQUFNLE9BQ0osT0FBTyxvQkFBb0I7QUFFN0IsY0FBSSxNQUFNLGFBQWEsd0JBQVMsT0FBTztBQUNyQyxrQkFBTSxJQUFJLE1BQU0sK0JBQStCO0FBQUEsVUFDakQ7QUFFQSw2QkFBTyxZQUFZLEtBQUssUUFBUSxPQUFPLEdBQUcsQ0FBQztBQUMzQyw2QkFBTyxZQUFZLEtBQUssWUFBWSxVQUFVO0FBQUEsUUFDaEQsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsYUFBYSxNQUFNO0FBQzFCLFlBQU0sRUFBRSxjQUFjO0FBRXRCLGlCQUFXLDhDQUFzQjtBQUMvQixhQUFLLGlDQUFpQyxLQUFLLFFBQVEsS0FDakQseUJBQ0EseUJBQ0Y7QUFDQSxhQUFLLHVCQUF1QixLQUFLLFFBQzlCLEtBQUsseUJBQWdCLGVBQWUsRUFDcEMsU0FBUztBQUFBLE1BQ2QsR0FSVyxhQVFWO0FBRUQsU0FBRyw2REFBNkQsc0JBQXNCO0FBQ3BGLGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0IsY0FBTSxVQUFVO0FBQUEsVUFDZCxVQUFVLHdCQUFTO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsVUFDaEIsZUFBZTtBQUFBLFVBQ2YsZUFBZTtBQUFBLFFBQ2pCLENBQUMsRUFBRSxVQUFVLG1CQUFtQixJQUFJO0FBRXBDLGNBQU0sT0FBTyxXQUFXLEtBQUssOEJBQThCO0FBQzNELGNBQU0sT0FBTyxXQUNYLEtBQUssZ0NBQ0wsT0FDQSxNQUNBLEtBQ0Y7QUFFQSxjQUFNLE9BQU8sVUFBVSxLQUFLLG9CQUFvQjtBQUFBLE1BQ2xELENBQUM7QUFFRCxTQUFHLGlEQUFpRCxzQkFBc0I7QUFDeEUsY0FBTSxXQUFXLE1BQU0sSUFBSTtBQUMzQixjQUFNLFVBQVU7QUFBQSxVQUNkLFVBQVUsd0JBQVM7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixlQUFlO0FBQUEsVUFDZixlQUFlO0FBQUEsUUFDakIsQ0FBQyxFQUFFLFVBQVUsbUJBQW1CLElBQUk7QUFFcEMsY0FBTSxPQUFPLFdBQVcsS0FBSyxvQkFBb0I7QUFDakQsY0FBTSxPQUFPLFdBQVcsS0FBSyxzQkFBc0IsT0FBTyxNQUFNLEtBQUs7QUFFckUsY0FBTSxPQUFPLFVBQVUsS0FBSyw4QkFBOEI7QUFBQSxNQUM1RCxDQUFDO0FBRUQsU0FBRyw0Q0FBNEMsWUFBWTtBQUN6RCxjQUFNLFdBQVcsTUFBTSxJQUFJO0FBQzNCLGNBQU0sVUFBVTtBQUFBLFVBQ2QsVUFBVSx3QkFBUztBQUFBLFVBQ25CLGdCQUFnQjtBQUFBLFVBQ2hCLGVBQWU7QUFBQSxVQUNmLGVBQWU7QUFBQSxRQUNqQixDQUFDLEVBQUUsVUFBVSxtQkFBbUIsSUFBSTtBQUNwQyxjQUFNLFNBQVMsU0FBUyxRQUFRLENBQUMsRUFBRSxLQUFLO0FBRXhDLGNBQU0sU0FBUyw0QkFBUSxrQ0FBYyxHQUFHLE1BQU07QUFFOUMsMkJBQU8sVUFBVSxPQUFPLG9CQUFvQix5QkFBeUI7QUFBQSxVQUNuRSxVQUFVLHdCQUFTO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsVUFDaEIsV0FBVyx5QkFBVTtBQUFBLFVBQ3JCLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxRQUNmLENBQUM7QUFDRCwyQkFBTyxVQUFVLE9BQU8saUJBQWlCO0FBQUEsVUFDdkMsZ0JBQWdCO0FBQUEsVUFDaEIsZUFBZTtBQUFBLFVBQ2YsZUFBZTtBQUFBLFVBQ2YsaUJBQWlCO0FBQUEsVUFDakIsVUFBVSw0QkFBYTtBQUFBLFVBQ3ZCLHNCQUFzQjtBQUFBLFVBQ3RCLDBCQUEwQixDQUFDO0FBQUEsVUFDM0IsS0FBSztBQUFBLFVBQ0wsb0JBQW9CO0FBQUEsVUFDcEIsY0FBYztBQUFBLFFBQ2hCLENBQUM7QUFBQSxNQUNILENBQUM7QUFFRCxTQUFHLGdEQUFnRCxNQUFNO0FBQ3ZELGNBQU0sV0FBVyxNQUFNLElBQUk7QUFDM0Isa0JBQVU7QUFBQSxVQUNSLFVBQVUsd0JBQVM7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixlQUFlO0FBQUEsVUFDZixlQUFlO0FBQUEsUUFDakIsQ0FBQyxFQUFFLFVBQVUsbUJBQW1CLElBQUk7QUFFcEMsY0FBTSxPQUFPLFVBQVUsUUFBUTtBQUFBLE1BQ2pDLENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxhQUFTLGtCQUFrQixNQUFNO0FBQy9CLFlBQU0sRUFBRSxtQkFBbUI7QUFFM0IsU0FBRywrQkFBK0IsTUFBTTtBQUN0QyxjQUFNLGlCQUFpQiw0QkFDckIsMkJBQ0EsZUFBZSxDQUNqQjtBQUNBLGNBQU0sa0JBQWtCLDRCQUFRLGdCQUFnQixlQUFlLENBQUM7QUFDaEUsY0FBTSxvQkFBb0IsNEJBQVEsaUJBQWlCLGVBQWUsQ0FBQztBQUVuRSwyQkFBTyxPQUFPLGVBQWUsaUJBQWlCLGtCQUFrQjtBQUNoRSwyQkFBTyxRQUFRLGdCQUFnQixpQkFBaUIsa0JBQWtCO0FBQ2xFLDJCQUFPLE9BQU8sa0JBQWtCLGlCQUFpQixrQkFBa0I7QUFBQSxNQUNyRSxDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsYUFBUyxzQkFBc0IsTUFBTTtBQUNuQyxZQUFNLEVBQUUsdUJBQXVCO0FBRS9CLFNBQUcsaUNBQWlDLE1BQU07QUFDeEMsY0FBTSxpQkFBaUIsNEJBQ3JCLDJCQUNBLG1CQUFtQixDQUNyQjtBQUNBLGNBQU0sa0JBQWtCLDRCQUFRLGdCQUFnQixtQkFBbUIsQ0FBQztBQUNwRSxjQUFNLG9CQUFvQiw0QkFDeEIsaUJBQ0EsbUJBQW1CLENBQ3JCO0FBRUEsMkJBQU8sT0FBTyxlQUFlLGlCQUFpQixvQkFBb0I7QUFDbEUsMkJBQU8sUUFBUSxnQkFBZ0IsaUJBQWlCLG9CQUFvQjtBQUNwRSwyQkFBTyxPQUFPLGtCQUFrQixpQkFBaUIsb0JBQW9CO0FBQUEsTUFDdkUsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsYUFBYSxNQUFNO0FBQzFCLFlBQU0sRUFBRSxjQUFjO0FBRXRCLFNBQUcsbUJBQW1CLE1BQU07QUFDMUIsY0FBTSxpQkFBaUIsNEJBQVEsMkJBQTJCLFVBQVUsQ0FBQztBQUNyRSxjQUFNLGtCQUFrQiw0QkFBUSxnQkFBZ0IsVUFBVSxDQUFDO0FBQzNELGNBQU0sb0JBQW9CLDRCQUFRLGlCQUFpQixVQUFVLENBQUM7QUFFOUQsMkJBQU8sT0FBTyxlQUFlLGlCQUFpQixHQUFHO0FBQ2pELDJCQUFPLFFBQVEsZ0JBQWdCLGlCQUFpQixHQUFHO0FBQ25ELDJCQUFPLE9BQU8sa0JBQWtCLGlCQUFpQixHQUFHO0FBQUEsTUFDdEQsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMscUJBQXFCLE1BQU07QUFDbEMsWUFBTSxFQUFFLHNCQUFzQjtBQUU5QixTQUFHLHVDQUF1QyxNQUFNO0FBQzlDLGNBQU0saUJBQWlCLDRCQUNyQiwwQkFDQSxrQkFBa0IsQ0FDcEI7QUFDQSxjQUFNLGtCQUFrQiw0QkFBUSxnQkFBZ0Isa0JBQWtCLENBQUM7QUFDbkUsY0FBTSxvQkFBb0IsNEJBQVEsaUJBQWlCLGtCQUFrQixDQUFDO0FBRXRFLDJCQUFPLFlBQ0wsZUFBZSxpQkFBaUIsVUFDaEMsNEJBQWEsT0FDZjtBQUNBLDJCQUFPLFlBQ0wsZ0JBQWdCLGlCQUFpQixVQUNqQyw0QkFBYSxJQUNmO0FBQ0EsMkJBQU8sWUFDTCxrQkFBa0IsaUJBQWlCLFVBQ25DLDRCQUFhLE9BQ2Y7QUFBQSxNQUNGLENBQUM7QUFFRCxTQUFHLCtDQUErQyxNQUFNO0FBQ3RELGNBQU0saUJBQWlCLDRCQUNyQiwwQ0FDQSxrQkFBa0IsQ0FDcEI7QUFDQSxjQUFNLGtCQUFrQiw0QkFBUSxnQkFBZ0Isa0JBQWtCLENBQUM7QUFDbkUsY0FBTSxvQkFBb0IsNEJBQVEsaUJBQWlCLGtCQUFrQixDQUFDO0FBRXRFLDJCQUFPLFlBQ0wsZUFBZSxpQkFBaUIsVUFDaEMsNEJBQWEsSUFDZjtBQUNBLDJCQUFPLFlBQ0wsZ0JBQWdCLGlCQUFpQixVQUNqQyw0QkFBYSxPQUNmO0FBQ0EsMkJBQU8sWUFDTCxrQkFBa0IsaUJBQWlCLFVBQ25DLDRCQUFhLElBQ2Y7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxhQUFTLDRCQUE0QixNQUFNO0FBQ3pDLFlBQU0sRUFBRSwwQkFBMEIsK0JBQStCO0FBRWpFLFNBQUcsNENBQTRDLE1BQU07QUFDbkQsY0FBTSxpQkFBaUIsNEJBQ3JCLDBCQUNBLHlCQUF5QixDQUMzQjtBQUNBLGNBQU0sa0JBQWtCLDRCQUN0QixnQkFDQSx5QkFBeUIsQ0FDM0I7QUFDQSxjQUFNLGFBQWEsNEJBQ2pCLGdCQUNBLDJCQUEyQixDQUM3QjtBQUVBLDJCQUFPLFlBQ0wsZUFBZSxpQkFBaUIsVUFDaEMsNEJBQWEsWUFDZjtBQUNBLDJCQUFPLFlBQ0wsZ0JBQWdCLGlCQUFpQixVQUNqQyw0QkFBYSxZQUNmO0FBQ0EsMkJBQU8sWUFDTCxXQUFXLGlCQUFpQixVQUM1Qiw0QkFBYSxJQUNmO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyx1REFBdUQsTUFBTTtBQUM5RCxjQUFNLGlCQUFpQiw0QkFDckIscUNBQ0EseUJBQXlCLENBQzNCO0FBQ0EsY0FBTSxhQUFhLDRCQUNqQixnQkFDQSwyQkFBMkIsQ0FDN0I7QUFFQSwyQkFBTyxZQUNMLGVBQWUsaUJBQWlCLFVBQ2hDLDRCQUFhLE9BQ2Y7QUFDQSwyQkFBTyxZQUNMLFdBQVcsaUJBQWlCLFVBQzVCLDRCQUFhLE9BQ2Y7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNILENBQUM7QUFFRCxXQUFTLFdBQVcsTUFBTTtBQUN4QixhQUFTLGlCQUFpQixNQUFNO0FBQzlCLFNBQUcsMkNBQTJDLE1BQU07QUFDbEQsMkJBQU8sWUFBWSxrQ0FBYyxrQ0FBYyxDQUFDLENBQUM7QUFBQSxNQUNuRCxDQUFDO0FBRUQsU0FBRyxnREFBZ0QsTUFBTTtBQUN2RCwyQkFBTyxZQUFZLGtDQUFjLG1CQUFtQixDQUFDO0FBQUEsTUFDdkQsQ0FBQztBQUVELFNBQUcsMkJBQTJCLE1BQU07QUFDbEMsMkJBQU8sVUFBVSxrQ0FBYyx5QkFBeUIsR0FBRztBQUFBLFVBQ3pELFVBQVUsd0JBQVM7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixXQUFXLHlCQUFVO0FBQUEsVUFDckIsWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2IsZ0JBQWdCO0FBQUEsUUFDbEIsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELGFBQVMsNEJBQTRCLE1BQU07QUFDekMsU0FBRyxtQ0FBbUMsTUFBTTtBQUMxQywyQkFBTyxRQUFRLDZDQUF5QixRQUFXLFVBQVUsQ0FBQztBQUFBLE1BQ2hFLENBQUM7QUFFRCxTQUFHLHNEQUFzRCxNQUFNO0FBQzdELDJCQUFPLFFBQVEsNkNBQXlCLEVBQUUsT0FBTyxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUM7QUFBQSxNQUNwRSxDQUFDO0FBRUQsU0FBRywyREFBMkQsTUFBTTtBQUNsRSwyQkFBTyxRQUNMLDZDQUF5QixFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxXQUFXLENBQ2hFO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyxtRUFBbUUsTUFBTTtBQUMxRSwyQkFBTyxPQUNMLDZDQUF5QixFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxVQUFVLENBQy9EO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyw0RUFBNEUsTUFBTTtBQUNuRiwyQkFBTyxPQUNMLDZDQUNFLEVBQUUsT0FBTyxDQUFDLGFBQWEsVUFBVSxFQUFFLEdBQ25DLFVBQ0YsQ0FDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
