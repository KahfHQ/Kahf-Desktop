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
var import_sendToGroup = require("../../util/sendToGroup");
var import_UUID = require("../../types/UUID");
var import_Errors = require("../../textsecure/Errors");
describe("sendToGroup", () => {
  const uuidOne = import_UUID.UUID.generate().toString();
  const uuidTwo = import_UUID.UUID.generate().toString();
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const stub = sandbox.stub(import_UUID.UUID, "lookup");
    stub.withArgs(uuidOne).returns(new import_UUID.UUID(uuidOne));
    stub.withArgs(uuidTwo).returns(new import_UUID.UUID(uuidTwo));
    stub.returns(void 0);
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe("#_analyzeSenderKeyDevices", () => {
    function getDefaultDeviceList() {
      return [
        {
          identifier: uuidOne,
          id: 1,
          registrationId: 11
        },
        {
          identifier: uuidOne,
          id: 2,
          registrationId: 22
        },
        {
          identifier: uuidTwo,
          id: 2,
          registrationId: 33
        }
      ];
    }
    it("returns nothing if new and previous lists are the same", () => {
      const memberDevices = getDefaultDeviceList();
      const devicesForSend = getDefaultDeviceList();
      const {
        newToMemberDevices,
        newToMemberUuids,
        removedFromMemberDevices,
        removedFromMemberUuids
      } = (0, import_sendToGroup._analyzeSenderKeyDevices)(memberDevices, devicesForSend);
      import_chai.assert.isEmpty(newToMemberDevices);
      import_chai.assert.isEmpty(newToMemberUuids);
      import_chai.assert.isEmpty(removedFromMemberDevices);
      import_chai.assert.isEmpty(removedFromMemberUuids);
    });
    it("returns set of new devices", () => {
      const memberDevices = getDefaultDeviceList();
      const devicesForSend = getDefaultDeviceList();
      memberDevices.pop();
      memberDevices.pop();
      const {
        newToMemberDevices,
        newToMemberUuids,
        removedFromMemberDevices,
        removedFromMemberUuids
      } = (0, import_sendToGroup._analyzeSenderKeyDevices)(memberDevices, devicesForSend);
      import_chai.assert.deepEqual(newToMemberDevices, [
        {
          identifier: uuidOne,
          id: 2,
          registrationId: 22
        },
        {
          identifier: uuidTwo,
          id: 2,
          registrationId: 33
        }
      ]);
      import_chai.assert.deepEqual(newToMemberUuids, [uuidOne, uuidTwo]);
      import_chai.assert.isEmpty(removedFromMemberDevices);
      import_chai.assert.isEmpty(removedFromMemberUuids);
    });
    it("returns set of removed devices", () => {
      const memberDevices = getDefaultDeviceList();
      const devicesForSend = getDefaultDeviceList();
      devicesForSend.pop();
      devicesForSend.pop();
      const {
        newToMemberDevices,
        newToMemberUuids,
        removedFromMemberDevices,
        removedFromMemberUuids
      } = (0, import_sendToGroup._analyzeSenderKeyDevices)(memberDevices, devicesForSend);
      import_chai.assert.isEmpty(newToMemberDevices);
      import_chai.assert.isEmpty(newToMemberUuids);
      import_chai.assert.deepEqual(removedFromMemberDevices, [
        {
          identifier: uuidOne,
          id: 2,
          registrationId: 22
        },
        {
          identifier: uuidTwo,
          id: 2,
          registrationId: 33
        }
      ]);
      import_chai.assert.deepEqual(removedFromMemberUuids, [uuidOne, uuidTwo]);
    });
    it("returns empty removals if partial send", () => {
      const memberDevices = getDefaultDeviceList();
      const devicesForSend = getDefaultDeviceList();
      devicesForSend.pop();
      devicesForSend.pop();
      const isPartialSend = true;
      const {
        newToMemberDevices,
        newToMemberUuids,
        removedFromMemberDevices,
        removedFromMemberUuids
      } = (0, import_sendToGroup._analyzeSenderKeyDevices)(memberDevices, devicesForSend, isPartialSend);
      import_chai.assert.isEmpty(newToMemberDevices);
      import_chai.assert.isEmpty(newToMemberUuids);
      import_chai.assert.isEmpty(removedFromMemberDevices);
      import_chai.assert.isEmpty(removedFromMemberUuids);
    });
  });
  describe("#_waitForAll", () => {
    it("returns result of provided tasks", async () => {
      const task1 = /* @__PURE__ */ __name(() => Promise.resolve(1), "task1");
      const task2 = /* @__PURE__ */ __name(() => Promise.resolve(2), "task2");
      const task3 = /* @__PURE__ */ __name(() => Promise.resolve(3), "task3");
      const result = await (0, import_sendToGroup._waitForAll)({
        tasks: [task1, task2, task3],
        maxConcurrency: 1
      });
      import_chai.assert.deepEqual(result, [1, 2, 3]);
    });
  });
  describe("#_shouldFailSend", () => {
    it("returns false for a generic error", async () => {
      const error = new Error("generic");
      import_chai.assert.isFalse((0, import_sendToGroup._shouldFailSend)(error, "testing generic"));
    });
    it("returns true for any error with 'untrusted' identity", async () => {
      const error = new Error("This was an untrusted identity.");
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(error, "logId"));
    });
    it("returns true for certain types of error subclasses", async () => {
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.OutgoingIdentityKeyError("something"), "testing OutgoingIdentityKeyError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.UnregisteredUserError("something", new import_Errors.HTTPError("something", {
        code: 400,
        headers: {}
      })), "testing UnregisteredUserError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.ConnectTimeoutError("something"), "testing ConnectTimeoutError"));
    });
    it("returns false for unspecified error codes", () => {
      const error = new Error("generic");
      error.code = 422;
      import_chai.assert.isFalse((0, import_sendToGroup._shouldFailSend)(error, "testing generic 422"));
      error.code = 204;
      import_chai.assert.isFalse((0, import_sendToGroup._shouldFailSend)(error, "testing generic 204"));
    });
    it("returns true for a specified error codes", () => {
      const error = new Error("generic");
      error.code = 401;
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(error, "testing generic"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.HTTPError("something", {
        code: 404,
        headers: {}
      }), "testing HTTPError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.OutgoingMessageError("something", null, null, new import_Errors.HTTPError("something", {
        code: 413,
        headers: {}
      })), "testing OutgoingMessageError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.OutgoingMessageError("something", null, null, new import_Errors.HTTPError("something", {
        code: 429,
        headers: {}
      })), "testing OutgoingMessageError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.SendMessageNetworkError("something", null, new import_Errors.HTTPError("something", {
        code: 428,
        headers: {}
      })), "testing SendMessageNetworkError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.SendMessageChallengeError("something", new import_Errors.HTTPError("something", {
        code: 500,
        headers: {}
      })), "testing SendMessageChallengeError"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.MessageError("something", new import_Errors.HTTPError("something", {
        code: 508,
        headers: {}
      })), "testing MessageError"));
    });
    it("returns true for errors inside of SendMessageProtoError", () => {
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.SendMessageProtoError({}), "testing missing errors list"));
      const error = new Error("generic");
      error.code = 401;
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.SendMessageProtoError({ errors: [error] }), "testing one error with code"));
      import_chai.assert.isTrue((0, import_sendToGroup._shouldFailSend)(new import_Errors.SendMessageProtoError({
        errors: [
          new Error("something"),
          new import_Errors.ConnectTimeoutError("something")
        ]
      }), "testing ConnectTimeoutError"));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZFRvR3JvdXBfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIHNpbm9uIGZyb20gJ3Npbm9uJztcblxuaW1wb3J0IHtcbiAgX2FuYWx5emVTZW5kZXJLZXlEZXZpY2VzLFxuICBfd2FpdEZvckFsbCxcbiAgX3Nob3VsZEZhaWxTZW5kLFxufSBmcm9tICcuLi8uLi91dGlsL3NlbmRUb0dyb3VwJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcblxuaW1wb3J0IHR5cGUgeyBEZXZpY2VUeXBlIH0gZnJvbSAnLi4vLi4vdGV4dHNlY3VyZS9UeXBlcy5kJztcbmltcG9ydCB7XG4gIENvbm5lY3RUaW1lb3V0RXJyb3IsXG4gIEhUVFBFcnJvcixcbiAgTWVzc2FnZUVycm9yLFxuICBPdXRnb2luZ0lkZW50aXR5S2V5RXJyb3IsXG4gIE91dGdvaW5nTWVzc2FnZUVycm9yLFxuICBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yLFxuICBTZW5kTWVzc2FnZU5ldHdvcmtFcnJvcixcbiAgU2VuZE1lc3NhZ2VQcm90b0Vycm9yLFxuICBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IsXG59IGZyb20gJy4uLy4uL3RleHRzZWN1cmUvRXJyb3JzJztcblxuZGVzY3JpYmUoJ3NlbmRUb0dyb3VwJywgKCkgPT4ge1xuICBjb25zdCB1dWlkT25lID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHV1aWRUd28gPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcblxuICBsZXQgc2FuZGJveDogc2lub24uU2lub25TYW5kYm94O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHNhbmRib3ggPSBzaW5vbi5jcmVhdGVTYW5kYm94KCk7XG5cbiAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKFVVSUQsICdsb29rdXAnKTtcbiAgICBzdHViLndpdGhBcmdzKHV1aWRPbmUpLnJldHVybnMobmV3IFVVSUQodXVpZE9uZSkpO1xuICAgIHN0dWIud2l0aEFyZ3ModXVpZFR3bykucmV0dXJucyhuZXcgVVVJRCh1dWlkVHdvKSk7XG4gICAgc3R1Yi5yZXR1cm5zKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjX2FuYWx5emVTZW5kZXJLZXlEZXZpY2VzJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIGdldERlZmF1bHREZXZpY2VMaXN0KCk6IEFycmF5PERldmljZVR5cGU+IHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZGVudGlmaWVyOiB1dWlkT25lLFxuICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgIHJlZ2lzdHJhdGlvbklkOiAxMSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkZW50aWZpZXI6IHV1aWRPbmUsXG4gICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDIyLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWRlbnRpZmllcjogdXVpZFR3byxcbiAgICAgICAgICBpZDogMixcbiAgICAgICAgICByZWdpc3RyYXRpb25JZDogMzMsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cblxuICAgIGl0KCdyZXR1cm5zIG5vdGhpbmcgaWYgbmV3IGFuZCBwcmV2aW91cyBsaXN0cyBhcmUgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZW1iZXJEZXZpY2VzID0gZ2V0RGVmYXVsdERldmljZUxpc3QoKTtcbiAgICAgIGNvbnN0IGRldmljZXNGb3JTZW5kID0gZ2V0RGVmYXVsdERldmljZUxpc3QoKTtcblxuICAgICAgY29uc3Qge1xuICAgICAgICBuZXdUb01lbWJlckRldmljZXMsXG4gICAgICAgIG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgICAgIHJlbW92ZWRGcm9tTWVtYmVyRGV2aWNlcyxcbiAgICAgICAgcmVtb3ZlZEZyb21NZW1iZXJVdWlkcyxcbiAgICAgIH0gPSBfYW5hbHl6ZVNlbmRlcktleURldmljZXMobWVtYmVyRGV2aWNlcywgZGV2aWNlc0ZvclNlbmQpO1xuXG4gICAgICBhc3NlcnQuaXNFbXB0eShuZXdUb01lbWJlckRldmljZXMpO1xuICAgICAgYXNzZXJ0LmlzRW1wdHkobmV3VG9NZW1iZXJVdWlkcyk7XG4gICAgICBhc3NlcnQuaXNFbXB0eShyZW1vdmVkRnJvbU1lbWJlckRldmljZXMpO1xuICAgICAgYXNzZXJ0LmlzRW1wdHkocmVtb3ZlZEZyb21NZW1iZXJVdWlkcyk7XG4gICAgfSk7XG4gICAgaXQoJ3JldHVybnMgc2V0IG9mIG5ldyBkZXZpY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVtYmVyRGV2aWNlcyA9IGdldERlZmF1bHREZXZpY2VMaXN0KCk7XG4gICAgICBjb25zdCBkZXZpY2VzRm9yU2VuZCA9IGdldERlZmF1bHREZXZpY2VMaXN0KCk7XG5cbiAgICAgIG1lbWJlckRldmljZXMucG9wKCk7XG4gICAgICBtZW1iZXJEZXZpY2VzLnBvcCgpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIG5ld1RvTWVtYmVyRGV2aWNlcyxcbiAgICAgICAgbmV3VG9NZW1iZXJVdWlkcyxcbiAgICAgICAgcmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLFxuICAgICAgICByZW1vdmVkRnJvbU1lbWJlclV1aWRzLFxuICAgICAgfSA9IF9hbmFseXplU2VuZGVyS2V5RGV2aWNlcyhtZW1iZXJEZXZpY2VzLCBkZXZpY2VzRm9yU2VuZCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobmV3VG9NZW1iZXJEZXZpY2VzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZGVudGlmaWVyOiB1dWlkT25lLFxuICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgIHJlZ2lzdHJhdGlvbklkOiAyMixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkZW50aWZpZXI6IHV1aWRUd28sXG4gICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDMzLFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5ld1RvTWVtYmVyVXVpZHMsIFt1dWlkT25lLCB1dWlkVHdvXSk7XG4gICAgICBhc3NlcnQuaXNFbXB0eShyZW1vdmVkRnJvbU1lbWJlckRldmljZXMpO1xuICAgICAgYXNzZXJ0LmlzRW1wdHkocmVtb3ZlZEZyb21NZW1iZXJVdWlkcyk7XG4gICAgfSk7XG4gICAgaXQoJ3JldHVybnMgc2V0IG9mIHJlbW92ZWQgZGV2aWNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lbWJlckRldmljZXMgPSBnZXREZWZhdWx0RGV2aWNlTGlzdCgpO1xuICAgICAgY29uc3QgZGV2aWNlc0ZvclNlbmQgPSBnZXREZWZhdWx0RGV2aWNlTGlzdCgpO1xuXG4gICAgICBkZXZpY2VzRm9yU2VuZC5wb3AoKTtcbiAgICAgIGRldmljZXNGb3JTZW5kLnBvcCgpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIG5ld1RvTWVtYmVyRGV2aWNlcyxcbiAgICAgICAgbmV3VG9NZW1iZXJVdWlkcyxcbiAgICAgICAgcmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLFxuICAgICAgICByZW1vdmVkRnJvbU1lbWJlclV1aWRzLFxuICAgICAgfSA9IF9hbmFseXplU2VuZGVyS2V5RGV2aWNlcyhtZW1iZXJEZXZpY2VzLCBkZXZpY2VzRm9yU2VuZCk7XG5cbiAgICAgIGFzc2VydC5pc0VtcHR5KG5ld1RvTWVtYmVyRGV2aWNlcyk7XG4gICAgICBhc3NlcnQuaXNFbXB0eShuZXdUb01lbWJlclV1aWRzKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVtb3ZlZEZyb21NZW1iZXJEZXZpY2VzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZGVudGlmaWVyOiB1dWlkT25lLFxuICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgIHJlZ2lzdHJhdGlvbklkOiAyMixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkZW50aWZpZXI6IHV1aWRUd28sXG4gICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgcmVnaXN0cmF0aW9uSWQ6IDMzLFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlbW92ZWRGcm9tTWVtYmVyVXVpZHMsIFt1dWlkT25lLCB1dWlkVHdvXSk7XG4gICAgfSk7XG4gICAgaXQoJ3JldHVybnMgZW1wdHkgcmVtb3ZhbHMgaWYgcGFydGlhbCBzZW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVtYmVyRGV2aWNlcyA9IGdldERlZmF1bHREZXZpY2VMaXN0KCk7XG4gICAgICBjb25zdCBkZXZpY2VzRm9yU2VuZCA9IGdldERlZmF1bHREZXZpY2VMaXN0KCk7XG5cbiAgICAgIGRldmljZXNGb3JTZW5kLnBvcCgpO1xuICAgICAgZGV2aWNlc0ZvclNlbmQucG9wKCk7XG5cbiAgICAgIGNvbnN0IGlzUGFydGlhbFNlbmQgPSB0cnVlO1xuICAgICAgY29uc3Qge1xuICAgICAgICBuZXdUb01lbWJlckRldmljZXMsXG4gICAgICAgIG5ld1RvTWVtYmVyVXVpZHMsXG4gICAgICAgIHJlbW92ZWRGcm9tTWVtYmVyRGV2aWNlcyxcbiAgICAgICAgcmVtb3ZlZEZyb21NZW1iZXJVdWlkcyxcbiAgICAgIH0gPSBfYW5hbHl6ZVNlbmRlcktleURldmljZXMoXG4gICAgICAgIG1lbWJlckRldmljZXMsXG4gICAgICAgIGRldmljZXNGb3JTZW5kLFxuICAgICAgICBpc1BhcnRpYWxTZW5kXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuaXNFbXB0eShuZXdUb01lbWJlckRldmljZXMpO1xuICAgICAgYXNzZXJ0LmlzRW1wdHkobmV3VG9NZW1iZXJVdWlkcyk7XG4gICAgICBhc3NlcnQuaXNFbXB0eShyZW1vdmVkRnJvbU1lbWJlckRldmljZXMpO1xuICAgICAgYXNzZXJ0LmlzRW1wdHkocmVtb3ZlZEZyb21NZW1iZXJVdWlkcyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjX3dhaXRGb3JBbGwnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgcmVzdWx0IG9mIHByb3ZpZGVkIHRhc2tzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGFzazEgPSAoKSA9PiBQcm9taXNlLnJlc29sdmUoMSk7XG4gICAgICBjb25zdCB0YXNrMiA9ICgpID0+IFByb21pc2UucmVzb2x2ZSgyKTtcbiAgICAgIGNvbnN0IHRhc2szID0gKCkgPT4gUHJvbWlzZS5yZXNvbHZlKDMpO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBfd2FpdEZvckFsbCh7XG4gICAgICAgIHRhc2tzOiBbdGFzazEsIHRhc2syLCB0YXNrM10sXG4gICAgICAgIG1heENvbmN1cnJlbmN5OiAxLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LCBbMSwgMiwgM10pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI19zaG91bGRGYWlsU2VuZCcsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBnZW5lcmljIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ2dlbmVyaWMnKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKF9zaG91bGRGYWlsU2VuZChlcnJvciwgJ3Rlc3RpbmcgZ2VuZXJpYycpKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmV0dXJucyB0cnVlIGZvciBhbnkgZXJyb3Igd2l0aCAndW50cnVzdGVkJyBpZGVudGl0eVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVGhpcyB3YXMgYW4gdW50cnVzdGVkIGlkZW50aXR5LicpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShfc2hvdWxkRmFpbFNlbmQoZXJyb3IsICdsb2dJZCcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGNlcnRhaW4gdHlwZXMgb2YgZXJyb3Igc3ViY2xhc3NlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIF9zaG91bGRGYWlsU2VuZChcbiAgICAgICAgICBuZXcgT3V0Z29pbmdJZGVudGl0eUtleUVycm9yKCdzb21ldGhpbmcnKSxcbiAgICAgICAgICAndGVzdGluZyBPdXRnb2luZ0lkZW50aXR5S2V5RXJyb3InXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBfc2hvdWxkRmFpbFNlbmQoXG4gICAgICAgICAgbmV3IFVucmVnaXN0ZXJlZFVzZXJFcnJvcihcbiAgICAgICAgICAgICdzb21ldGhpbmcnLFxuICAgICAgICAgICAgbmV3IEhUVFBFcnJvcignc29tZXRoaW5nJywge1xuICAgICAgICAgICAgICBjb2RlOiA0MDAsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgICd0ZXN0aW5nIFVucmVnaXN0ZXJlZFVzZXJFcnJvcidcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIF9zaG91bGRGYWlsU2VuZChcbiAgICAgICAgICBuZXcgQ29ubmVjdFRpbWVvdXRFcnJvcignc29tZXRoaW5nJyksXG4gICAgICAgICAgJ3Rlc3RpbmcgQ29ubmVjdFRpbWVvdXRFcnJvcidcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciB1bnNwZWNpZmllZCBlcnJvciBjb2RlcycsICgpID0+IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICBjb25zdCBlcnJvcjogYW55ID0gbmV3IEVycm9yKCdnZW5lcmljJyk7XG5cbiAgICAgIGVycm9yLmNvZGUgPSA0MjI7XG4gICAgICBhc3NlcnQuaXNGYWxzZShfc2hvdWxkRmFpbFNlbmQoZXJyb3IsICd0ZXN0aW5nIGdlbmVyaWMgNDIyJykpO1xuXG4gICAgICBlcnJvci5jb2RlID0gMjA0O1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoX3Nob3VsZEZhaWxTZW5kKGVycm9yLCAndGVzdGluZyBnZW5lcmljIDIwNCcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGEgc3BlY2lmaWVkIGVycm9yIGNvZGVzJywgKCkgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgIGNvbnN0IGVycm9yOiBhbnkgPSBuZXcgRXJyb3IoJ2dlbmVyaWMnKTtcbiAgICAgIGVycm9yLmNvZGUgPSA0MDE7XG5cbiAgICAgIGFzc2VydC5pc1RydWUoX3Nob3VsZEZhaWxTZW5kKGVycm9yLCAndGVzdGluZyBnZW5lcmljJykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgX3Nob3VsZEZhaWxTZW5kKFxuICAgICAgICAgIG5ldyBIVFRQRXJyb3IoJ3NvbWV0aGluZycsIHtcbiAgICAgICAgICAgIGNvZGU6IDQwNCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgIH0pLFxuICAgICAgICAgICd0ZXN0aW5nIEhUVFBFcnJvcidcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIF9zaG91bGRGYWlsU2VuZChcbiAgICAgICAgICBuZXcgT3V0Z29pbmdNZXNzYWdlRXJyb3IoXG4gICAgICAgICAgICAnc29tZXRoaW5nJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgbmV3IEhUVFBFcnJvcignc29tZXRoaW5nJywge1xuICAgICAgICAgICAgICBjb2RlOiA0MTMsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgICd0ZXN0aW5nIE91dGdvaW5nTWVzc2FnZUVycm9yJ1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgX3Nob3VsZEZhaWxTZW5kKFxuICAgICAgICAgIG5ldyBPdXRnb2luZ01lc3NhZ2VFcnJvcihcbiAgICAgICAgICAgICdzb21ldGhpbmcnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBuZXcgSFRUUEVycm9yKCdzb21ldGhpbmcnLCB7XG4gICAgICAgICAgICAgIGNvZGU6IDQyOSxcbiAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgJ3Rlc3RpbmcgT3V0Z29pbmdNZXNzYWdlRXJyb3InXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBfc2hvdWxkRmFpbFNlbmQoXG4gICAgICAgICAgbmV3IFNlbmRNZXNzYWdlTmV0d29ya0Vycm9yKFxuICAgICAgICAgICAgJ3NvbWV0aGluZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgbmV3IEhUVFBFcnJvcignc29tZXRoaW5nJywge1xuICAgICAgICAgICAgICBjb2RlOiA0MjgsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgICd0ZXN0aW5nIFNlbmRNZXNzYWdlTmV0d29ya0Vycm9yJ1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgX3Nob3VsZEZhaWxTZW5kKFxuICAgICAgICAgIG5ldyBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yKFxuICAgICAgICAgICAgJ3NvbWV0aGluZycsXG4gICAgICAgICAgICBuZXcgSFRUUEVycm9yKCdzb21ldGhpbmcnLCB7XG4gICAgICAgICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgJ3Rlc3RpbmcgU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvcidcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1RydWUoXG4gICAgICAgIF9zaG91bGRGYWlsU2VuZChcbiAgICAgICAgICBuZXcgTWVzc2FnZUVycm9yKFxuICAgICAgICAgICAgJ3NvbWV0aGluZycsXG4gICAgICAgICAgICBuZXcgSFRUUEVycm9yKCdzb21ldGhpbmcnLCB7XG4gICAgICAgICAgICAgIGNvZGU6IDUwOCxcbiAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgJ3Rlc3RpbmcgTWVzc2FnZUVycm9yJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGVycm9ycyBpbnNpZGUgb2YgU2VuZE1lc3NhZ2VQcm90b0Vycm9yJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShcbiAgICAgICAgX3Nob3VsZEZhaWxTZW5kKFxuICAgICAgICAgIG5ldyBTZW5kTWVzc2FnZVByb3RvRXJyb3Ioe30pLFxuICAgICAgICAgICd0ZXN0aW5nIG1pc3NpbmcgZXJyb3JzIGxpc3QnXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICBjb25zdCBlcnJvcjogYW55ID0gbmV3IEVycm9yKCdnZW5lcmljJyk7XG4gICAgICBlcnJvci5jb2RlID0gNDAxO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBfc2hvdWxkRmFpbFNlbmQoXG4gICAgICAgICAgbmV3IFNlbmRNZXNzYWdlUHJvdG9FcnJvcih7IGVycm9yczogW2Vycm9yXSB9KSxcbiAgICAgICAgICAndGVzdGluZyBvbmUgZXJyb3Igd2l0aCBjb2RlJ1xuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKFxuICAgICAgICBfc2hvdWxkRmFpbFNlbmQoXG4gICAgICAgICAgbmV3IFNlbmRNZXNzYWdlUHJvdG9FcnJvcih7XG4gICAgICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICAgICAgbmV3IEVycm9yKCdzb21ldGhpbmcnKSxcbiAgICAgICAgICAgICAgbmV3IENvbm5lY3RUaW1lb3V0RXJyb3IoJ3NvbWV0aGluZycpLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAndGVzdGluZyBDb25uZWN0VGltZW91dEVycm9yJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtCQUF1QjtBQUN2QixZQUF1QjtBQUV2Qix5QkFJTztBQUNQLGtCQUFxQjtBQUdyQixvQkFVTztBQUVQLFNBQVMsZUFBZSxNQUFNO0FBQzVCLFFBQU0sVUFBVSxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUN6QyxRQUFNLFVBQVUsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFFekMsTUFBSTtBQUVKLGFBQVcsTUFBTTtBQUNmLGNBQVUsTUFBTSxjQUFjO0FBRTlCLFVBQU0sT0FBTyxRQUFRLEtBQUssa0JBQU0sUUFBUTtBQUN4QyxTQUFLLFNBQVMsT0FBTyxFQUFFLFFBQVEsSUFBSSxpQkFBSyxPQUFPLENBQUM7QUFDaEQsU0FBSyxTQUFTLE9B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
