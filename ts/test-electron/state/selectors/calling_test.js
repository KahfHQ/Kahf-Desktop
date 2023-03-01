var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_reducer = require("../../../state/reducer");
var import_noop = require("../../../state/ducks/noop");
var import_user = require("../../../state/ducks/user");
var import_Calling = require("../../../types/Calling");
var import_calling = require("../../../state/selectors/calling");
var import_calling2 = require("../../../state/ducks/calling");
describe("state/selectors/calling", () => {
  const getEmptyRootState = /* @__PURE__ */ __name(() => {
    const initial = (0, import_reducer.reducer)(void 0, (0, import_noop.noopAction)());
    return (0, import_reducer.reducer)(initial, import_user.actions.userChanged({
      ourACI: "00000000-0000-4000-8000-000000000000"
    }));
  }, "getEmptyRootState");
  const getCallingState = /* @__PURE__ */ __name((calling) => ({
    ...getEmptyRootState(),
    calling
  }), "getCallingState");
  const stateWithDirectCall = {
    ...(0, import_calling2.getEmptyState)(),
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
  const incomingDirectCall = {
    callMode: import_Calling.CallMode.Direct,
    conversationId: "fake-direct-call-conversation-id",
    callState: import_Calling.CallState.Ringing,
    isIncoming: true,
    isVideoCall: false,
    hasRemoteVideo: false
  };
  const stateWithIncomingDirectCall = {
    ...(0, import_calling2.getEmptyState)(),
    callsByConversation: {
      "fake-direct-call-conversation-id": incomingDirectCall
    }
  };
  const incomingGroupCall = {
    callMode: import_Calling.CallMode.Group,
    conversationId: "fake-group-call-conversation-id",
    connectionState: import_Calling.GroupCallConnectionState.NotConnected,
    joinState: import_Calling.GroupCallJoinState.NotJoined,
    peekInfo: {
      uuids: ["c75b51da-d484-4674-9b2c-cc11de00e227"],
      creatorUuid: "c75b51da-d484-4674-9b2c-cc11de00e227",
      maxDevices: Infinity,
      deviceCount: 1
    },
    remoteParticipants: [],
    ringId: BigInt(123),
    ringerUuid: "c75b51da-d484-4674-9b2c-cc11de00e227"
  };
  const stateWithIncomingGroupCall = {
    ...(0, import_calling2.getEmptyState)(),
    callsByConversation: {
      "fake-group-call-conversation-id": incomingGroupCall
    }
  };
  describe("getCallsByConversation", () => {
    it("returns state.calling.callsByConversation", () => {
      import_chai.assert.deepEqual((0, import_calling.getCallsByConversation)(getEmptyRootState()), {});
      import_chai.assert.deepEqual((0, import_calling.getCallsByConversation)(getCallingState(stateWithDirectCall)), {
        "fake-direct-call-conversation-id": {
          callMode: import_Calling.CallMode.Direct,
          conversationId: "fake-direct-call-conversation-id",
          callState: import_Calling.CallState.Accepted,
          isIncoming: false,
          isVideoCall: false,
          hasRemoteVideo: false
        }
      });
    });
  });
  describe("getCallSelector", () => {
    it("returns a selector that returns undefined if selecting a conversation with no call", () => {
      import_chai.assert.isUndefined((0, import_calling.getCallSelector)(getEmptyRootState())("conversation-id"));
    });
    it("returns a selector that returns a conversation's call", () => {
      import_chai.assert.deepEqual((0, import_calling.getCallSelector)(getCallingState(stateWithDirectCall))("fake-direct-call-conversation-id"), {
        callMode: import_Calling.CallMode.Direct,
        conversationId: "fake-direct-call-conversation-id",
        callState: import_Calling.CallState.Accepted,
        isIncoming: false,
        isVideoCall: false,
        hasRemoteVideo: false
      });
    });
  });
  describe("getIncomingCall", () => {
    it("returns undefined if there are no calls", () => {
      import_chai.assert.isUndefined((0, import_calling.getIncomingCall)(getEmptyRootState()));
    });
    it("returns undefined if there is no incoming call", () => {
      import_chai.assert.isUndefined((0, import_calling.getIncomingCall)(getCallingState(stateWithDirectCall)));
      import_chai.assert.isUndefined((0, import_calling.getIncomingCall)(getCallingState(stateWithActiveDirectCall)));
    });
    it("returns undefined if there is a group call with no peeked participants", () => {
      const state = {
        ...stateWithIncomingGroupCall,
        callsByConversation: {
          "fake-group-call-conversation-id": {
            ...incomingGroupCall,
            peekInfo: {
              uuids: [],
              maxDevices: Infinity,
              deviceCount: 1
            }
          }
        }
      };
      import_chai.assert.isUndefined((0, import_calling.getIncomingCall)(getCallingState(state)));
    });
    it("returns an incoming direct call", () => {
      import_chai.assert.deepEqual((0, import_calling.getIncomingCall)(getCallingState(stateWithIncomingDirectCall)), incomingDirectCall);
    });
    it("returns an incoming group call", () => {
      import_chai.assert.deepEqual((0, import_calling.getIncomingCall)(getCallingState(stateWithIncomingGroupCall)), incomingGroupCall);
    });
  });
  describe("isInCall", () => {
    it("returns should be false if we are not in a call", () => {
      import_chai.assert.isFalse((0, import_calling.isInCall)(getEmptyRootState()));
    });
    it("should be true if we are in a call", () => {
      import_chai.assert.isTrue((0, import_calling.isInCall)(getCallingState(stateWithActiveDirectCall)));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FsbGluZ190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyByZWR1Y2VyIGFzIHJvb3RSZWR1Y2VyIH0gZnJvbSAnLi4vLi4vLi4vc3RhdGUvcmVkdWNlcic7XG5pbXBvcnQgeyBub29wQWN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vc3RhdGUvZHVja3Mvbm9vcCc7XG5pbXBvcnQgeyBhY3Rpb25zIGFzIHVzZXJBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vc3RhdGUvZHVja3MvdXNlcic7XG5pbXBvcnQge1xuICBDYWxsTW9kZSxcbiAgQ2FsbFN0YXRlLFxuICBDYWxsVmlld01vZGUsXG4gIEdyb3VwQ2FsbENvbm5lY3Rpb25TdGF0ZSxcbiAgR3JvdXBDYWxsSm9pblN0YXRlLFxufSBmcm9tICcuLi8uLi8uLi90eXBlcy9DYWxsaW5nJztcbmltcG9ydCB7XG4gIGdldENhbGxzQnlDb252ZXJzYXRpb24sXG4gIGdldENhbGxTZWxlY3RvcixcbiAgZ2V0SW5jb21pbmdDYWxsLFxuICBpc0luQ2FsbCxcbn0gZnJvbSAnLi4vLi4vLi4vc3RhdGUvc2VsZWN0b3JzL2NhbGxpbmcnO1xuaW1wb3J0IHR5cGUge1xuICBDYWxsaW5nU3RhdGVUeXBlLFxuICBEaXJlY3RDYWxsU3RhdGVUeXBlLFxuICBHcm91cENhbGxTdGF0ZVR5cGUsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2NhbGxpbmcnO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2NhbGxpbmcnO1xuXG5kZXNjcmliZSgnc3RhdGUvc2VsZWN0b3JzL2NhbGxpbmcnLCAoKSA9PiB7XG4gIGNvbnN0IGdldEVtcHR5Um9vdFN0YXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IGluaXRpYWwgPSByb290UmVkdWNlcih1bmRlZmluZWQsIG5vb3BBY3Rpb24oKSk7XG4gICAgcmV0dXJuIHJvb3RSZWR1Y2VyKFxuICAgICAgaW5pdGlhbCxcbiAgICAgIHVzZXJBY3Rpb25zLnVzZXJDaGFuZ2VkKHtcbiAgICAgICAgb3VyQUNJOiAnMDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAwJyxcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBnZXRDYWxsaW5nU3RhdGUgPSAoY2FsbGluZzogQ2FsbGluZ1N0YXRlVHlwZSkgPT4gKHtcbiAgICAuLi5nZXRFbXB0eVJvb3RTdGF0ZSgpLFxuICAgIGNhbGxpbmcsXG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlV2l0aERpcmVjdENhbGw6IENhbGxpbmdTdGF0ZVR5cGUgPSB7XG4gICAgLi4uZ2V0RW1wdHlTdGF0ZSgpLFxuICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgIGNhbGxTdGF0ZTogQ2FsbFN0YXRlLkFjY2VwdGVkLFxuICAgICAgICBpc0luY29taW5nOiBmYWxzZSxcbiAgICAgICAgaXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgICAgICBoYXNSZW1vdGVWaWRlbzogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbDogQ2FsbGluZ1N0YXRlVHlwZSA9IHtcbiAgICAuLi5zdGF0ZVdpdGhEaXJlY3RDYWxsLFxuICAgIGFjdGl2ZUNhbGxTdGF0ZToge1xuICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICBoYXNMb2NhbEF1ZGlvOiB0cnVlLFxuICAgICAgaGFzTG9jYWxWaWRlbzogZmFsc2UsXG4gICAgICBsb2NhbEF1ZGlvTGV2ZWw6IDAsXG4gICAgICB2aWV3TW9kZTogQ2FsbFZpZXdNb2RlLkdyaWQsXG4gICAgICBzaG93UGFydGljaXBhbnRzTGlzdDogZmFsc2UsXG4gICAgICBzYWZldHlOdW1iZXJDaGFuZ2VkVXVpZHM6IFtdLFxuICAgICAgb3V0Z29pbmdSaW5nOiB0cnVlLFxuICAgICAgcGlwOiBmYWxzZSxcbiAgICAgIHNldHRpbmdzRGlhbG9nT3BlbjogZmFsc2UsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBpbmNvbWluZ0RpcmVjdENhbGw6IERpcmVjdENhbGxTdGF0ZVR5cGUgPSB7XG4gICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICBjYWxsU3RhdGU6IENhbGxTdGF0ZS5SaW5naW5nLFxuICAgIGlzSW5jb21pbmc6IHRydWUsXG4gICAgaXNWaWRlb0NhbGw6IGZhbHNlLFxuICAgIGhhc1JlbW90ZVZpZGVvOiBmYWxzZSxcbiAgfTtcblxuICBjb25zdCBzdGF0ZVdpdGhJbmNvbWluZ0RpcmVjdENhbGw6IENhbGxpbmdTdGF0ZVR5cGUgPSB7XG4gICAgLi4uZ2V0RW1wdHlTdGF0ZSgpLFxuICAgIGNhbGxzQnlDb252ZXJzYXRpb246IHtcbiAgICAgICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IGluY29taW5nRGlyZWN0Q2FsbCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGluY29taW5nR3JvdXBDYWxsOiBHcm91cENhbGxTdGF0ZVR5cGUgPSB7XG4gICAgY2FsbE1vZGU6IENhbGxNb2RlLkdyb3VwLFxuICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgY29ubmVjdGlvblN0YXRlOiBHcm91cENhbGxDb25uZWN0aW9uU3RhdGUuTm90Q29ubmVjdGVkLFxuICAgIGpvaW5TdGF0ZTogR3JvdXBDYWxsSm9pblN0YXRlLk5vdEpvaW5lZCxcbiAgICBwZWVrSW5mbzoge1xuICAgICAgdXVpZHM6IFsnYzc1YjUxZGEtZDQ4NC00Njc0LTliMmMtY2MxMWRlMDBlMjI3J10sXG4gICAgICBjcmVhdG9yVXVpZDogJ2M3NWI1MWRhLWQ0ODQtNDY3NC05YjJjLWNjMTFkZTAwZTIyNycsXG4gICAgICBtYXhEZXZpY2VzOiBJbmZpbml0eSxcbiAgICAgIGRldmljZUNvdW50OiAxLFxuICAgIH0sXG4gICAgcmVtb3RlUGFydGljaXBhbnRzOiBbXSxcbiAgICByaW5nSWQ6IEJpZ0ludCgxMjMpLFxuICAgIHJpbmdlclV1aWQ6ICdjNzViNTFkYS1kNDg0LTQ2NzQtOWIyYy1jYzExZGUwMGUyMjcnLFxuICB9O1xuXG4gIGNvbnN0IHN0YXRlV2l0aEluY29taW5nR3JvdXBDYWxsOiBDYWxsaW5nU3RhdGVUeXBlID0ge1xuICAgIC4uLmdldEVtcHR5U3RhdGUoKSxcbiAgICBjYWxsc0J5Q29udmVyc2F0aW9uOiB7XG4gICAgICAnZmFrZS1ncm91cC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IGluY29taW5nR3JvdXBDYWxsLFxuICAgIH0sXG4gIH07XG5cbiAgZGVzY3JpYmUoJ2dldENhbGxzQnlDb252ZXJzYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgc3RhdGUuY2FsbGluZy5jYWxsc0J5Q29udmVyc2F0aW9uJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRDYWxsc0J5Q29udmVyc2F0aW9uKGdldEVtcHR5Um9vdFN0YXRlKCkpLCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGdldENhbGxzQnlDb252ZXJzYXRpb24oZ2V0Q2FsbGluZ1N0YXRlKHN0YXRlV2l0aERpcmVjdENhbGwpKSxcbiAgICAgICAge1xuICAgICAgICAgICdmYWtlLWRpcmVjdC1jYWxsLWNvbnZlcnNhdGlvbi1pZCc6IHtcbiAgICAgICAgICAgIGNhbGxNb2RlOiBDYWxsTW9kZS5EaXJlY3QsXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICAgIGNhbGxTdGF0ZTogQ2FsbFN0YXRlLkFjY2VwdGVkLFxuICAgICAgICAgICAgaXNJbmNvbWluZzogZmFsc2UsXG4gICAgICAgICAgICBpc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgICAgICBoYXNSZW1vdGVWaWRlbzogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldENhbGxTZWxlY3RvcicsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBhIHNlbGVjdG9yIHRoYXQgcmV0dXJucyB1bmRlZmluZWQgaWYgc2VsZWN0aW5nIGEgY29udmVyc2F0aW9uIHdpdGggbm8gY2FsbCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgZ2V0Q2FsbFNlbGVjdG9yKGdldEVtcHR5Um9vdFN0YXRlKCkpKCdjb252ZXJzYXRpb24taWQnKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmV0dXJucyBhIHNlbGVjdG9yIHRoYXQgcmV0dXJucyBhIGNvbnZlcnNhdGlvbidzIGNhbGxcIiwgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgZ2V0Q2FsbFNlbGVjdG9yKGdldENhbGxpbmdTdGF0ZShzdGF0ZVdpdGhEaXJlY3RDYWxsKSkoXG4gICAgICAgICAgJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJ1xuICAgICAgICApLFxuICAgICAgICB7XG4gICAgICAgICAgY2FsbE1vZGU6IENhbGxNb2RlLkRpcmVjdCxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtZGlyZWN0LWNhbGwtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgICBjYWxsU3RhdGU6IENhbGxTdGF0ZS5BY2NlcHRlZCxcbiAgICAgICAgICBpc0luY29taW5nOiBmYWxzZSxcbiAgICAgICAgICBpc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICAgICAgaGFzUmVtb3RlVmlkZW86IGZhbHNlLFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0SW5jb21pbmdDYWxsJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbm8gY2FsbHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoZ2V0SW5jb21pbmdDYWxsKGdldEVtcHR5Um9vdFN0YXRlKCkpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBpbmNvbWluZyBjYWxsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGdldEluY29taW5nQ2FsbChnZXRDYWxsaW5nU3RhdGUoc3RhdGVXaXRoRGlyZWN0Q2FsbCkpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgZ2V0SW5jb21pbmdDYWxsKGdldENhbGxpbmdTdGF0ZShzdGF0ZVdpdGhBY3RpdmVEaXJlY3RDYWxsKSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGhlcmUgaXMgYSBncm91cCBjYWxsIHdpdGggbm8gcGVla2VkIHBhcnRpY2lwYW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZVdpdGhJbmNvbWluZ0dyb3VwQ2FsbCxcbiAgICAgICAgY2FsbHNCeUNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgICdmYWtlLWdyb3VwLWNhbGwtY29udmVyc2F0aW9uLWlkJzoge1xuICAgICAgICAgICAgLi4uaW5jb21pbmdHcm91cENhbGwsXG4gICAgICAgICAgICBwZWVrSW5mbzoge1xuICAgICAgICAgICAgICB1dWlkczogW10sXG4gICAgICAgICAgICAgIG1heERldmljZXM6IEluZmluaXR5LFxuICAgICAgICAgICAgICBkZXZpY2VDb3VudDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChnZXRJbmNvbWluZ0NhbGwoZ2V0Q2FsbGluZ1N0YXRlKHN0YXRlKSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgYW4gaW5jb21pbmcgZGlyZWN0IGNhbGwnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBnZXRJbmNvbWluZ0NhbGwoZ2V0Q2FsbGluZ1N0YXRlKHN0YXRlV2l0aEluY29taW5nRGlyZWN0Q2FsbCkpLFxuICAgICAgICBpbmNvbWluZ0RpcmVjdENhbGxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBhbiBpbmNvbWluZyBncm91cCBjYWxsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgZ2V0SW5jb21pbmdDYWxsKGdldENhbGxpbmdTdGF0ZShzdGF0ZVdpdGhJbmNvbWluZ0dyb3VwQ2FsbCkpLFxuICAgICAgICBpbmNvbWluZ0dyb3VwQ2FsbFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzSW5DYWxsJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHNob3VsZCBiZSBmYWxzZSBpZiB3ZSBhcmUgbm90IGluIGEgY2FsbCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKGlzSW5DYWxsKGdldEVtcHR5Um9vdFN0YXRlKCkpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgdHJ1ZSBpZiB3ZSBhcmUgaW4gYSBjYWxsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0luQ2FsbChnZXRDYWxsaW5nU3RhdGUoc3RhdGVXaXRoQWN0aXZlRGlyZWN0Q2FsbCkpKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBR0Esa0JBQXVCO0FBQ3ZCLHFCQUF1QztBQUN2QyxrQkFBMkI7QUFDM0Isa0JBQXVDO0FBQ3ZDLHFCQU1PO0FBQ1AscUJBS087QUFNUCxzQkFBOEI7QUFFOUIsU0FBUywyQkFBMkIsTUFBTTtBQUN4QyxRQUFNLG9CQUFvQiw2QkFBTTtBQUM5QixVQUFNLFVBQVUsNEJBQVksUUFBVyw0QkFBVyxDQUFDO0FBQ25ELFdBQU8sNEJBQ0wsU0FDQSxvQkFBWSxZQUFZO0FBQUEsTUFDdEIsUUFBUTtBQUFBLElBQ1YsQ0FBQyxDQUNIO0FBQUEsRUFDRixHQVIwQjtBQVUxQixRQUFNLGtCQUFrQix3QkFBQyxZQUErQjtBQUFBLE9BQ25ELGtCQUFrQjtBQUFBLElBQ3JCO0FBQUEsRUFDRixJQUh3QjtBQUt4QixRQUFNLHNCQUF3QztBQUFBLE9BQ3pDLG1DQUFjO0FBQUEsSUFDakIscUJBQXFCO0FBQUEsTUFDbkIsb0NBQW9DO0FBQUEsUUFDbEMsVUFBVSx3QkFBUztBQUFBLFFBQ25CLGdCQUFnQjtBQUFBLFFBQ2hCLFdBQVcseUJBQVU7QUFBQSxRQUNyQixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsUUFBTSw0QkFBOEM7QUFBQSxPQUMvQztBQUFBLElBQ0gsaUJBQWlCO0FBQUEsTUFDZixnQkFBZ0I7QUFBQSxNQUNoQixlQUFlO0FBQUEsTUFDZixlQUFlO0FBQUEsTUFDZixpQkFBaUI7QUFBQSxNQUNqQixVQUFVLDRCQUFhO0FBQUEsTUFDdkIsc0JBQXNCO0FBQUEsTUFDdEIsMEJBQTBCLENBQUM7QUFBQSxNQUMzQixjQUFjO0FBQUEsTUFDZCxLQUFLO0FBQUEsTUFDTCxvQkFBb0I7QUFBQSxJQUN0QjtBQUFBLEVB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
