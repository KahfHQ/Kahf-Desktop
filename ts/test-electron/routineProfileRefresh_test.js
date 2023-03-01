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
var sinon = __toESM(require("sinon"));
var import_lodash = require("lodash");
var import_conversations = require("../models/conversations");
var import_UUID = require("../types/UUID");
var import_durations = require("../util/durations");
var import_routineProfileRefresh = require("../routineProfileRefresh");
describe("routineProfileRefresh", () => {
  let sinonSandbox;
  let getProfileFn;
  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
    getProfileFn = sinon.stub();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });
  function makeConversation(overrideAttributes = {}) {
    const result = new import_conversations.ConversationModel({
      accessKey: import_UUID.UUID.generate().toString(),
      active_at: Date.now(),
      draftAttachments: [],
      draftBodyRanges: [],
      draftTimestamp: null,
      id: import_UUID.UUID.generate().toString(),
      inbox_position: 0,
      isPinned: false,
      lastMessageDeletedForEveryone: false,
      lastMessageStatus: "sent",
      left: false,
      markedUnread: false,
      messageCount: 2,
      messageCountBeforeMessageRequests: 0,
      messageRequestResponseType: 0,
      muteExpiresAt: 0,
      profileAvatar: void 0,
      profileKeyCredential: import_UUID.UUID.generate().toString(),
      profileKeyCredentialExpiration: Date.now() + 2 * import_durations.DAY,
      profileSharing: true,
      quotedMessageId: null,
      sealedSender: 1,
      sentMessageCount: 1,
      sharedGroupNames: [],
      timestamp: Date.now(),
      type: "private",
      uuid: import_UUID.UUID.generate().toString(),
      version: 2,
      ...overrideAttributes
    });
    return result;
  }
  function makeGroup(groupMembers) {
    const result = makeConversation({ type: "group" });
    sinonSandbox.stub(result, "getMembers").returns(groupMembers);
    return result;
  }
  function makeStorage(lastAttemptAt) {
    return {
      get: sinonSandbox.stub().withArgs("lastAttemptedToRefreshProfilesAt").returns(lastAttemptAt),
      put: sinonSandbox.stub().resolves(void 0)
    };
  }
  it("does nothing when the last refresh time is less than 12 hours ago", async () => {
    const conversation1 = makeConversation();
    const conversation2 = makeConversation();
    const storage = makeStorage(Date.now() - 1234);
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [conversation1, conversation2],
      ourConversationId: import_UUID.UUID.generate().toString(),
      storage,
      getProfileFn,
      id: 1
    });
    sinon.assert.notCalled(getProfileFn);
    sinon.assert.notCalled(storage.put);
  });
  it("asks conversations to get their profiles", async () => {
    const conversation1 = makeConversation();
    const conversation2 = makeConversation();
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [conversation1, conversation2],
      ourConversationId: import_UUID.UUID.generate().toString(),
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    sinon.assert.calledWith(getProfileFn, conversation1.get("uuid"), conversation1.get("e164"));
    sinon.assert.calledWith(getProfileFn, conversation2.get("uuid"), conversation2.get("e164"));
  });
  it("skips conversations that haven't been active in 30 days", async () => {
    const recentlyActive = makeConversation();
    const inactive = makeConversation({
      active_at: Date.now() - 31 * 24 * 60 * 60 * 1e3
    });
    const neverActive = makeConversation({ active_at: void 0 });
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [recentlyActive, inactive, neverActive],
      ourConversationId: import_UUID.UUID.generate().toString(),
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    sinon.assert.calledOnce(getProfileFn);
    sinon.assert.calledWith(getProfileFn, recentlyActive.get("uuid"), recentlyActive.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, inactive.get("uuid"), inactive.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, neverActive.get("uuid"), neverActive.get("e164"));
  });
  it("skips your own conversation", async () => {
    const notMe = makeConversation();
    const me = makeConversation();
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [notMe, me],
      ourConversationId: me.id,
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    sinon.assert.calledWith(getProfileFn, notMe.get("uuid"), notMe.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, me.get("uuid"), me.get("e164"));
  });
  it("skips conversations that were refreshed in the last hour", async () => {
    const neverRefreshed = makeConversation();
    const recentlyFetched = makeConversation({
      profileLastFetchedAt: Date.now() - 59 * 60 * 1e3
    });
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [neverRefreshed, recentlyFetched],
      ourConversationId: import_UUID.UUID.generate().toString(),
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    sinon.assert.calledOnce(getProfileFn);
    sinon.assert.calledWith(getProfileFn, neverRefreshed.get("uuid"), neverRefreshed.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, recentlyFetched.get("uuid"), recentlyFetched.get("e164"));
  });
  it('"digs into" the members of an active group', async () => {
    const privateConversation = makeConversation();
    const recentlyActiveGroupMember = makeConversation();
    const inactiveGroupMember = makeConversation({
      active_at: Date.now() - 31 * 24 * 60 * 60 * 1e3
    });
    const memberWhoHasRecentlyRefreshed = makeConversation({
      profileLastFetchedAt: Date.now() - 59 * 60 * 1e3
    });
    const groupConversation = makeGroup([
      recentlyActiveGroupMember,
      inactiveGroupMember,
      memberWhoHasRecentlyRefreshed
    ]);
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [
        privateConversation,
        recentlyActiveGroupMember,
        inactiveGroupMember,
        memberWhoHasRecentlyRefreshed,
        groupConversation
      ],
      ourConversationId: import_UUID.UUID.generate().toString(),
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    sinon.assert.calledWith(getProfileFn, privateConversation.get("uuid"), privateConversation.get("e164"));
    sinon.assert.calledWith(getProfileFn, recentlyActiveGroupMember.get("uuid"), recentlyActiveGroupMember.get("e164"));
    sinon.assert.calledWith(getProfileFn, inactiveGroupMember.get("uuid"), inactiveGroupMember.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, memberWhoHasRecentlyRefreshed.get("uuid"), memberWhoHasRecentlyRefreshed.get("e164"));
    sinon.assert.neverCalledWith(getProfileFn, groupConversation.get("uuid"), groupConversation.get("e164"));
  });
  it("only refreshes profiles for the 50 most recently active direct conversations", async () => {
    const me = makeConversation();
    const activeConversations = (0, import_lodash.times)(40, () => makeConversation());
    const inactiveGroupMembers = (0, import_lodash.times)(10, () => makeConversation({
      active_at: Date.now() - 999 * 24 * 60 * 60 * 1e3
    }));
    const recentlyActiveGroup = makeGroup(inactiveGroupMembers);
    const shouldNotBeIncluded = [
      makeGroup([]),
      makeGroup([me]),
      ...(0, import_lodash.times)(3, () => makeConversation({
        active_at: Date.now() - 365 * 24 * 60 * 60 * 1e3
      })),
      ...(0, import_lodash.times)(3, () => makeGroup(inactiveGroupMembers))
    ];
    await (0, import_routineProfileRefresh.routineProfileRefresh)({
      allConversations: [
        me,
        ...activeConversations,
        recentlyActiveGroup,
        ...inactiveGroupMembers,
        ...shouldNotBeIncluded
      ],
      ourConversationId: me.id,
      storage: makeStorage(),
      getProfileFn,
      id: 1
    });
    [...activeConversations, ...inactiveGroupMembers].forEach((conversation) => {
      sinon.assert.calledWith(getProfileFn, conversation.get("uuid"), conversation.get("e164"));
    });
    [me, ...shouldNotBeIncluded].forEach((conversation) => {
      sinon.assert.neverCalledWith(getProfileFn, conversation.get("uuid"), conversation.get("e164"));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicm91dGluZVByb2ZpbGVSZWZyZXNoX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgKiBhcyBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyB0aW1lcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IERBWSB9IGZyb20gJy4uL3V0aWwvZHVyYXRpb25zJztcblxuaW1wb3J0IHsgcm91dGluZVByb2ZpbGVSZWZyZXNoIH0gZnJvbSAnLi4vcm91dGluZVByb2ZpbGVSZWZyZXNoJztcblxuZGVzY3JpYmUoJ3JvdXRpbmVQcm9maWxlUmVmcmVzaCcsICgpID0+IHtcbiAgbGV0IHNpbm9uU2FuZGJveDogc2lub24uU2lub25TYW5kYm94O1xuICBsZXQgZ2V0UHJvZmlsZUZuOiBzaW5vbi5TaW5vblN0dWI7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc2lub25TYW5kYm94ID0gc2lub24uY3JlYXRlU2FuZGJveCgpO1xuICAgIGdldFByb2ZpbGVGbiA9IHNpbm9uLnN0dWIoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBzaW5vblNhbmRib3gucmVzdG9yZSgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBtYWtlQ29udmVyc2F0aW9uKFxuICAgIG92ZXJyaWRlQXR0cmlidXRlczogUGFydGlhbDxDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZT4gPSB7fVxuICApOiBDb252ZXJzYXRpb25Nb2RlbCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbnZlcnNhdGlvbk1vZGVsKHtcbiAgICAgIGFjY2Vzc0tleTogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBhY3RpdmVfYXQ6IERhdGUubm93KCksXG4gICAgICBkcmFmdEF0dGFjaG1lbnRzOiBbXSxcbiAgICAgIGRyYWZ0Qm9keVJhbmdlczogW10sXG4gICAgICBkcmFmdFRpbWVzdGFtcDogbnVsbCxcbiAgICAgIGlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIGluYm94X3Bvc2l0aW9uOiAwLFxuICAgICAgaXNQaW5uZWQ6IGZhbHNlLFxuICAgICAgbGFzdE1lc3NhZ2VEZWxldGVkRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgbGFzdE1lc3NhZ2VTdGF0dXM6ICdzZW50JyxcbiAgICAgIGxlZnQ6IGZhbHNlLFxuICAgICAgbWFya2VkVW5yZWFkOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2VDb3VudDogMixcbiAgICAgIG1lc3NhZ2VDb3VudEJlZm9yZU1lc3NhZ2VSZXF1ZXN0czogMCxcbiAgICAgIG1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VUeXBlOiAwLFxuICAgICAgbXV0ZUV4cGlyZXNBdDogMCxcbiAgICAgIHByb2ZpbGVBdmF0YXI6IHVuZGVmaW5lZCxcbiAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHByb2ZpbGVLZXlDcmVkZW50aWFsRXhwaXJhdGlvbjogRGF0ZS5ub3coKSArIDIgKiBEQVksXG4gICAgICBwcm9maWxlU2hhcmluZzogdHJ1ZSxcbiAgICAgIHF1b3RlZE1lc3NhZ2VJZDogbnVsbCxcbiAgICAgIHNlYWxlZFNlbmRlcjogMSxcbiAgICAgIHNlbnRNZXNzYWdlQ291bnQ6IDEsXG4gICAgICBzaGFyZWRHcm91cE5hbWVzOiBbXSxcbiAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIHR5cGU6ICdwcml2YXRlJyxcbiAgICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgdmVyc2lvbjogMixcbiAgICAgIC4uLm92ZXJyaWRlQXR0cmlidXRlcyxcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUdyb3VwKFxuICAgIGdyb3VwTWVtYmVyczogQXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+XG4gICk6IENvbnZlcnNhdGlvbk1vZGVsIHtcbiAgICBjb25zdCByZXN1bHQgPSBtYWtlQ29udmVyc2F0aW9uKHsgdHlwZTogJ2dyb3VwJyB9KTtcbiAgICAvLyBUaGlzIGlzIGVhc2llciB0aGFuIHNldHRpbmcgdXAgYWxsIG9mIHRoZSBzY2FmZm9sZGluZyBmb3IgYGdldE1lbWJlcnNgLlxuICAgIHNpbm9uU2FuZGJveC5zdHViKHJlc3VsdCwgJ2dldE1lbWJlcnMnKS5yZXR1cm5zKGdyb3VwTWVtYmVycyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VTdG9yYWdlKGxhc3RBdHRlbXB0QXQ/OiBudW1iZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiBzaW5vblNhbmRib3hcbiAgICAgICAgLnN0dWIoKVxuICAgICAgICAud2l0aEFyZ3MoJ2xhc3RBdHRlbXB0ZWRUb1JlZnJlc2hQcm9maWxlc0F0JylcbiAgICAgICAgLnJldHVybnMobGFzdEF0dGVtcHRBdCksXG4gICAgICBwdXQ6IHNpbm9uU2FuZGJveC5zdHViKCkucmVzb2x2ZXModW5kZWZpbmVkKSxcbiAgICB9O1xuICB9XG5cbiAgaXQoJ2RvZXMgbm90aGluZyB3aGVuIHRoZSBsYXN0IHJlZnJlc2ggdGltZSBpcyBsZXNzIHRoYW4gMTIgaG91cnMgYWdvJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbjEgPSBtYWtlQ29udmVyc2F0aW9uKCk7XG4gICAgY29uc3QgY29udmVyc2F0aW9uMiA9IG1ha2VDb252ZXJzYXRpb24oKTtcbiAgICBjb25zdCBzdG9yYWdlID0gbWFrZVN0b3JhZ2UoRGF0ZS5ub3coKSAtIDEyMzQpO1xuXG4gICAgYXdhaXQgcm91dGluZVByb2ZpbGVSZWZyZXNoKHtcbiAgICAgIGFsbENvbnZlcnNhdGlvbnM6IFtjb252ZXJzYXRpb24xLCBjb252ZXJzYXRpb24yXSxcbiAgICAgIG91ckNvbnZlcnNhdGlvbklkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHN0b3JhZ2UsXG4gICAgICBnZXRQcm9maWxlRm4sXG4gICAgICBpZDogMSxcbiAgICB9KTtcblxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZ2V0UHJvZmlsZUZuKTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKHN0b3JhZ2UucHV0KTtcbiAgfSk7XG5cbiAgaXQoJ2Fza3MgY29udmVyc2F0aW9ucyB0byBnZXQgdGhlaXIgcHJvZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uMSA9IG1ha2VDb252ZXJzYXRpb24oKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb24yID0gbWFrZUNvbnZlcnNhdGlvbigpO1xuXG4gICAgYXdhaXQgcm91dGluZVByb2ZpbGVSZWZyZXNoKHtcbiAgICAgIGFsbENvbnZlcnNhdGlvbnM6IFtjb252ZXJzYXRpb24xLCBjb252ZXJzYXRpb24yXSxcbiAgICAgIG91ckNvbnZlcnNhdGlvbklkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHN0b3JhZ2U6IG1ha2VTdG9yYWdlKCksXG4gICAgICBnZXRQcm9maWxlRm4sXG4gICAgICBpZDogMSxcbiAgICB9KTtcblxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgY29udmVyc2F0aW9uMS5nZXQoJ3V1aWQnKSxcbiAgICAgIGNvbnZlcnNhdGlvbjEuZ2V0KCdlMTY0JylcbiAgICApO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgY29udmVyc2F0aW9uMi5nZXQoJ3V1aWQnKSxcbiAgICAgIGNvbnZlcnNhdGlvbjIuZ2V0KCdlMTY0JylcbiAgICApO1xuICB9KTtcblxuICBpdChcInNraXBzIGNvbnZlcnNhdGlvbnMgdGhhdCBoYXZlbid0IGJlZW4gYWN0aXZlIGluIDMwIGRheXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlY2VudGx5QWN0aXZlID0gbWFrZUNvbnZlcnNhdGlvbigpO1xuICAgIGNvbnN0IGluYWN0aXZlID0gbWFrZUNvbnZlcnNhdGlvbih7XG4gICAgICBhY3RpdmVfYXQ6IERhdGUubm93KCkgLSAzMSAqIDI0ICogNjAgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG4gICAgY29uc3QgbmV2ZXJBY3RpdmUgPSBtYWtlQ29udmVyc2F0aW9uKHsgYWN0aXZlX2F0OiB1bmRlZmluZWQgfSk7XG5cbiAgICBhd2FpdCByb3V0aW5lUHJvZmlsZVJlZnJlc2goe1xuICAgICAgYWxsQ29udmVyc2F0aW9uczogW3JlY2VudGx5QWN0aXZlLCBpbmFjdGl2ZSwgbmV2ZXJBY3RpdmVdLFxuICAgICAgb3VyQ29udmVyc2F0aW9uSWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgc3RvcmFnZTogbWFrZVN0b3JhZ2UoKSxcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIGlkOiAxLFxuICAgIH0pO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZ2V0UHJvZmlsZUZuKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIHJlY2VudGx5QWN0aXZlLmdldCgndXVpZCcpLFxuICAgICAgcmVjZW50bHlBY3RpdmUuZ2V0KCdlMTY0JylcbiAgICApO1xuICAgIHNpbm9uLmFzc2VydC5uZXZlckNhbGxlZFdpdGgoXG4gICAgICBnZXRQcm9maWxlRm4sXG4gICAgICBpbmFjdGl2ZS5nZXQoJ3V1aWQnKSxcbiAgICAgIGluYWN0aXZlLmdldCgnZTE2NCcpXG4gICAgKTtcbiAgICBzaW5vbi5hc3NlcnQubmV2ZXJDYWxsZWRXaXRoKFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgbmV2ZXJBY3RpdmUuZ2V0KCd1dWlkJyksXG4gICAgICBuZXZlckFjdGl2ZS5nZXQoJ2UxNjQnKVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdza2lwcyB5b3VyIG93biBjb252ZXJzYXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgbm90TWUgPSBtYWtlQ29udmVyc2F0aW9uKCk7XG4gICAgY29uc3QgbWUgPSBtYWtlQ29udmVyc2F0aW9uKCk7XG5cbiAgICBhd2FpdCByb3V0aW5lUHJvZmlsZVJlZnJlc2goe1xuICAgICAgYWxsQ29udmVyc2F0aW9uczogW25vdE1lLCBtZV0sXG4gICAgICBvdXJDb252ZXJzYXRpb25JZDogbWUuaWQsXG4gICAgICBzdG9yYWdlOiBtYWtlU3RvcmFnZSgpLFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgaWQ6IDEsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChnZXRQcm9maWxlRm4sIG5vdE1lLmdldCgndXVpZCcpLCBub3RNZS5nZXQoJ2UxNjQnKSk7XG4gICAgc2lub24uYXNzZXJ0Lm5ldmVyQ2FsbGVkV2l0aChnZXRQcm9maWxlRm4sIG1lLmdldCgndXVpZCcpLCBtZS5nZXQoJ2UxNjQnKSk7XG4gIH0pO1xuXG4gIGl0KCdza2lwcyBjb252ZXJzYXRpb25zIHRoYXQgd2VyZSByZWZyZXNoZWQgaW4gdGhlIGxhc3QgaG91cicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBuZXZlclJlZnJlc2hlZCA9IG1ha2VDb252ZXJzYXRpb24oKTtcbiAgICBjb25zdCByZWNlbnRseUZldGNoZWQgPSBtYWtlQ29udmVyc2F0aW9uKHtcbiAgICAgIHByb2ZpbGVMYXN0RmV0Y2hlZEF0OiBEYXRlLm5vdygpIC0gNTkgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG5cbiAgICBhd2FpdCByb3V0aW5lUHJvZmlsZVJlZnJlc2goe1xuICAgICAgYWxsQ29udmVyc2F0aW9uczogW25ldmVyUmVmcmVzaGVkLCByZWNlbnRseUZldGNoZWRdLFxuICAgICAgb3VyQ29udmVyc2F0aW9uSWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgc3RvcmFnZTogbWFrZVN0b3JhZ2UoKSxcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIGlkOiAxLFxuICAgIH0pO1xuXG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZ2V0UHJvZmlsZUZuKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIG5ldmVyUmVmcmVzaGVkLmdldCgndXVpZCcpLFxuICAgICAgbmV2ZXJSZWZyZXNoZWQuZ2V0KCdlMTY0JylcbiAgICApO1xuICAgIHNpbm9uLmFzc2VydC5uZXZlckNhbGxlZFdpdGgoXG4gICAgICBnZXRQcm9maWxlRm4sXG4gICAgICByZWNlbnRseUZldGNoZWQuZ2V0KCd1dWlkJyksXG4gICAgICByZWNlbnRseUZldGNoZWQuZ2V0KCdlMTY0JylcbiAgICApO1xuICB9KTtcblxuICBpdCgnXCJkaWdzIGludG9cIiB0aGUgbWVtYmVycyBvZiBhbiBhY3RpdmUgZ3JvdXAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJpdmF0ZUNvbnZlcnNhdGlvbiA9IG1ha2VDb252ZXJzYXRpb24oKTtcblxuICAgIGNvbnN0IHJlY2VudGx5QWN0aXZlR3JvdXBNZW1iZXIgPSBtYWtlQ29udmVyc2F0aW9uKCk7XG4gICAgY29uc3QgaW5hY3RpdmVHcm91cE1lbWJlciA9IG1ha2VDb252ZXJzYXRpb24oe1xuICAgICAgYWN0aXZlX2F0OiBEYXRlLm5vdygpIC0gMzEgKiAyNCAqIDYwICogNjAgKiAxMDAwLFxuICAgIH0pO1xuICAgIGNvbnN0IG1lbWJlcldob0hhc1JlY2VudGx5UmVmcmVzaGVkID0gbWFrZUNvbnZlcnNhdGlvbih7XG4gICAgICBwcm9maWxlTGFzdEZldGNoZWRBdDogRGF0ZS5ub3coKSAtIDU5ICogNjAgKiAxMDAwLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JvdXBDb252ZXJzYXRpb24gPSBtYWtlR3JvdXAoW1xuICAgICAgcmVjZW50bHlBY3RpdmVHcm91cE1lbWJlcixcbiAgICAgIGluYWN0aXZlR3JvdXBNZW1iZXIsXG4gICAgICBtZW1iZXJXaG9IYXNSZWNlbnRseVJlZnJlc2hlZCxcbiAgICBdKTtcblxuICAgIGF3YWl0IHJvdXRpbmVQcm9maWxlUmVmcmVzaCh7XG4gICAgICBhbGxDb252ZXJzYXRpb25zOiBbXG4gICAgICAgIHByaXZhdGVDb252ZXJzYXRpb24sXG4gICAgICAgIHJlY2VudGx5QWN0aXZlR3JvdXBNZW1iZXIsXG4gICAgICAgIGluYWN0aXZlR3JvdXBNZW1iZXIsXG4gICAgICAgIG1lbWJlcldob0hhc1JlY2VudGx5UmVmcmVzaGVkLFxuICAgICAgICBncm91cENvbnZlcnNhdGlvbixcbiAgICAgIF0sXG4gICAgICBvdXJDb252ZXJzYXRpb25JZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBzdG9yYWdlOiBtYWtlU3RvcmFnZSgpLFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgaWQ6IDEsXG4gICAgfSk7XG5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIHByaXZhdGVDb252ZXJzYXRpb24uZ2V0KCd1dWlkJyksXG4gICAgICBwcml2YXRlQ29udmVyc2F0aW9uLmdldCgnZTE2NCcpXG4gICAgKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIHJlY2VudGx5QWN0aXZlR3JvdXBNZW1iZXIuZ2V0KCd1dWlkJyksXG4gICAgICByZWNlbnRseUFjdGl2ZUdyb3VwTWVtYmVyLmdldCgnZTE2NCcpXG4gICAgKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIGluYWN0aXZlR3JvdXBNZW1iZXIuZ2V0KCd1dWlkJyksXG4gICAgICBpbmFjdGl2ZUdyb3VwTWVtYmVyLmdldCgnZTE2NCcpXG4gICAgKTtcbiAgICBzaW5vbi5hc3NlcnQubmV2ZXJDYWxsZWRXaXRoKFxuICAgICAgZ2V0UHJvZmlsZUZuLFxuICAgICAgbWVtYmVyV2hvSGFzUmVjZW50bHlSZWZyZXNoZWQuZ2V0KCd1dWlkJyksXG4gICAgICBtZW1iZXJXaG9IYXNSZWNlbnRseVJlZnJlc2hlZC5nZXQoJ2UxNjQnKVxuICAgICk7XG4gICAgc2lub24uYXNzZXJ0Lm5ldmVyQ2FsbGVkV2l0aChcbiAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgIGdyb3VwQ29udmVyc2F0aW9uLmdldCgndXVpZCcpLFxuICAgICAgZ3JvdXBDb252ZXJzYXRpb24uZ2V0KCdlMTY0JylcbiAgICApO1xuICB9KTtcblxuICBpdCgnb25seSByZWZyZXNoZXMgcHJvZmlsZXMgZm9yIHRoZSA1MCBtb3N0IHJlY2VudGx5IGFjdGl2ZSBkaXJlY3QgY29udmVyc2F0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtZSA9IG1ha2VDb252ZXJzYXRpb24oKTtcblxuICAgIGNvbnN0IGFjdGl2ZUNvbnZlcnNhdGlvbnMgPSB0aW1lcyg0MCwgKCkgPT4gbWFrZUNvbnZlcnNhdGlvbigpKTtcblxuICAgIGNvbnN0IGluYWN0aXZlR3JvdXBNZW1iZXJzID0gdGltZXMoMTAsICgpID0+XG4gICAgICBtYWtlQ29udmVyc2F0aW9uKHtcbiAgICAgICAgYWN0aXZlX2F0OiBEYXRlLm5vdygpIC0gOTk5ICogMjQgKiA2MCAqIDYwICogMTAwMCxcbiAgICAgIH0pXG4gICAgKTtcbiAgICBjb25zdCByZWNlbnRseUFjdGl2ZUdyb3VwID0gbWFrZUdyb3VwKGluYWN0aXZlR3JvdXBNZW1iZXJzKTtcblxuICAgIGNvbnN0IHNob3VsZE5vdEJlSW5jbHVkZWQgPSBbXG4gICAgICAvLyBSZWNlbnRseS1hY3RpdmUgZ3JvdXBzIHdpdGggbm8gb3RoZXIgbWVtYmVyc1xuICAgICAgbWFrZUdyb3VwKFtdKSxcbiAgICAgIG1ha2VHcm91cChbbWVdKSxcbiAgICAgIC8vIE9sZCBkaXJlY3QgY29udmVyc2F0aW9uc1xuICAgICAgLi4udGltZXMoMywgKCkgPT5cbiAgICAgICAgbWFrZUNvbnZlcnNhdGlvbih7XG4gICAgICAgICAgYWN0aXZlX2F0OiBEYXRlLm5vdygpIC0gMzY1ICogMjQgKiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgICAvLyBPbGQgZ3JvdXBzXG4gICAgICAuLi50aW1lcygzLCAoKSA9PiBtYWtlR3JvdXAoaW5hY3RpdmVHcm91cE1lbWJlcnMpKSxcbiAgICBdO1xuXG4gICAgYXdhaXQgcm91dGluZVByb2ZpbGVSZWZyZXNoKHtcbiAgICAgIGFsbENvbnZlcnNhdGlvbnM6IFtcbiAgICAgICAgbWUsXG5cbiAgICAgICAgLi4uYWN0aXZlQ29udmVyc2F0aW9ucyxcblxuICAgICAgICByZWNlbnRseUFjdGl2ZUdyb3VwLFxuICAgICAgICAuLi5pbmFjdGl2ZUdyb3VwTWVtYmVycyxcblxuICAgICAgICAuLi5zaG91bGROb3RCZUluY2x1ZGVkLFxuICAgICAgXSxcbiAgICAgIG91ckNvbnZlcnNhdGlvbklkOiBtZS5pZCxcbiAgICAgIHN0b3JhZ2U6IG1ha2VTdG9yYWdlKCksXG4gICAgICBnZXRQcm9maWxlRm4sXG4gICAgICBpZDogMSxcbiAgICB9KTtcblxuICAgIFsuLi5hY3RpdmVDb252ZXJzYXRpb25zLCAuLi5pbmFjdGl2ZUdyb3VwTWVtYmVyc10uZm9yRWFjaChjb252ZXJzYXRpb24gPT4ge1xuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoXG4gICAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgICAgY29udmVyc2F0aW9uLmdldCgndXVpZCcpLFxuICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCdlMTY0JylcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBbbWUsIC4uLnNob3VsZE5vdEJlSW5jbHVkZWRdLmZvckVhY2goY29udmVyc2F0aW9uID0+IHtcbiAgICAgIHNpbm9uLmFzc2VydC5uZXZlckNhbGxlZFdpdGgoXG4gICAgICAgIGdldFByb2ZpbGVGbixcbiAgICAgICAgY29udmVyc2F0aW9uLmdldCgndXVpZCcpLFxuICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCdlMTY0JylcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsWUFBdUI7QUFDdkIsb0JBQXNCO0FBQ3RCLDJCQUFrQztBQUVsQyxrQkFBcUI7QUFDckIsdUJBQW9CO0FBRXBCLG1DQUFzQztBQUV0QyxTQUFTLHlCQUF5QixNQUFNO0FBQ3RDLE1BQUk7QUFDSixNQUFJO0FBRUosYUFBVyxNQUFNO0FBQ2YsbUJBQWUsTUFBTSxjQUFjO0FBQ25DLG1CQUFlLE1BQU0sS0FBSztBQUFBLEVBQzVCLENBQUM7QUFFRCxZQUFVLE1BQU07QUFDZCxpQkFBYSxRQUFRO0FBQUEsRUFDdkIsQ0FBQztBQUVELDRCQUNFLHFCQUEwRCxDQUFDLEdBQ3hDO0FBQ25CLFVBQU0sU0FBUyxJQUFJLHVDQUFrQjtBQUFBLE1BQ25DLFdBQVcsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFBQSxNQUNwQyxXQUFXLEtBQUssSUFBSTtBQUFBLE1BQ3BCLGtCQUFrQixDQUFDO0FBQUEsTUFDbkIsaUJBQWlCLENBQUM7QUFBQSxNQUNsQixnQkFBZ0I7QUFBQSxNQUNoQixJQUFJLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsTUFDN0IsZ0JBQWdCO0FBQUEsTUFDaEIsVUFBVTtBQUFBLE1BQ1YsK0JBQStCO0FBQUEsTUFDL0IsbUJBQW1CO0FBQUEsTUFDbkIsTUFBTTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsY0FBYztBQUFBLE1BQ2QsbUNBQW1D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
