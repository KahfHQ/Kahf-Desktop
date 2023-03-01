var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_uuid = require("uuid");
var import_long = __toESM(require("long"));
var import_MessageReceiver = __toESM(require("../textsecure/MessageReceiver"));
var import_WebsocketResources = require("../textsecure/WebsocketResources");
var import_protobuf = require("../protobuf");
var Crypto = __toESM(require("../Crypto"));
describe("MessageReceiver", () => {
  const uuid = "aaaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee";
  const deviceId = 1;
  let oldUuid;
  let oldDeviceId;
  beforeEach(async () => {
    oldUuid = window.storage.user.getUuid()?.toString();
    oldDeviceId = window.storage.user.getDeviceId();
    await window.storage.user.setUuidAndDeviceId((0, import_uuid.v4)(), 2);
    await window.storage.protocol.hydrateCaches();
  });
  afterEach(async () => {
    if (oldUuid !== void 0 && oldDeviceId !== void 0) {
      await window.storage.user.setUuidAndDeviceId(oldUuid, oldDeviceId);
    }
    await window.storage.protocol.removeAllUnprocessed();
  });
  describe("connecting", () => {
    it("generates decryption-error event when it cannot decrypt", async () => {
      const messageReceiver = new import_MessageReceiver.default({
        server: {},
        storage: window.storage,
        serverTrustRoot: "AAAAAAAA"
      });
      const body = import_protobuf.SignalService.Envelope.encode({
        type: import_protobuf.SignalService.Envelope.Type.CIPHERTEXT,
        sourceUuid: uuid,
        sourceDevice: deviceId,
        timestamp: import_long.default.fromNumber(Date.now()),
        content: Crypto.getRandomBytes(200)
      }).finish();
      messageReceiver.handleRequest(new import_WebsocketResources.IncomingWebSocketRequest({
        id: import_long.default.fromNumber(1),
        verb: "PUT",
        path: "/api/v1/message",
        body,
        headers: []
      }, (_) => {
      }));
      await new Promise((resolve) => {
        messageReceiver.addEventListener("decryption-error", (error) => {
          import_chai.assert.strictEqual(error.decryptionError.senderUuid, uuid);
          import_chai.assert.strictEqual(error.decryptionError.senderDevice, deviceId);
          resolve();
        });
      });
      await messageReceiver.drain();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZVJlY2VpdmVyX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE1LTIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyB2NCBhcyBnZXRHdWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgTG9uZyBmcm9tICdsb25nJztcblxuaW1wb3J0IE1lc3NhZ2VSZWNlaXZlciBmcm9tICcuLi90ZXh0c2VjdXJlL01lc3NhZ2VSZWNlaXZlcic7XG5pbXBvcnQgeyBJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1dlYnNvY2tldFJlc291cmNlcyc7XG5pbXBvcnQgdHlwZSB7IFdlYkFQSVR5cGUgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1dlYkFQSSc7XG5pbXBvcnQgdHlwZSB7IERlY3J5cHRpb25FcnJvckV2ZW50IH0gZnJvbSAnLi4vdGV4dHNlY3VyZS9tZXNzYWdlUmVjZWl2ZXJFdmVudHMnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uL3Byb3RvYnVmJztcbmltcG9ydCAqIGFzIENyeXB0byBmcm9tICcuLi9DcnlwdG8nO1xuXG5kZXNjcmliZSgnTWVzc2FnZVJlY2VpdmVyJywgKCkgPT4ge1xuICBjb25zdCB1dWlkID0gJ2FhYWFhYWFhLWJiYmItNGNjYy05ZGRkLWVlZWVlZWVlZWVlZSc7XG4gIGNvbnN0IGRldmljZUlkID0gMTtcblxuICBsZXQgb2xkVXVpZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBsZXQgb2xkRGV2aWNlSWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBvbGRVdWlkID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRVdWlkKCk/LnRvU3RyaW5nKCk7XG4gICAgb2xkRGV2aWNlSWQgPSB3aW5kb3cuc3RvcmFnZS51c2VyLmdldERldmljZUlkKCk7XG4gICAgYXdhaXQgd2luZG93LnN0b3JhZ2UudXNlci5zZXRVdWlkQW5kRGV2aWNlSWQoZ2V0R3VpZCgpLCAyKTtcbiAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS5wcm90b2NvbC5oeWRyYXRlQ2FjaGVzKCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgaWYgKG9sZFV1aWQgIT09IHVuZGVmaW5lZCAmJiBvbGREZXZpY2VJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuc3RvcmFnZS51c2VyLnNldFV1aWRBbmREZXZpY2VJZChvbGRVdWlkLCBvbGREZXZpY2VJZCk7XG4gICAgfVxuICAgIGF3YWl0IHdpbmRvdy5zdG9yYWdlLnByb3RvY29sLnJlbW92ZUFsbFVucHJvY2Vzc2VkKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjb25uZWN0aW5nJywgKCkgPT4ge1xuICAgIGl0KCdnZW5lcmF0ZXMgZGVjcnlwdGlvbi1lcnJvciBldmVudCB3aGVuIGl0IGNhbm5vdCBkZWNyeXB0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZVJlY2VpdmVyID0gbmV3IE1lc3NhZ2VSZWNlaXZlcih7XG4gICAgICAgIHNlcnZlcjoge30gYXMgV2ViQVBJVHlwZSxcbiAgICAgICAgc3RvcmFnZTogd2luZG93LnN0b3JhZ2UsXG4gICAgICAgIHNlcnZlclRydXN0Um9vdDogJ0FBQUFBQUFBJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBib2R5ID0gUHJvdG8uRW52ZWxvcGUuZW5jb2RlKHtcbiAgICAgICAgdHlwZTogUHJvdG8uRW52ZWxvcGUuVHlwZS5DSVBIRVJURVhULFxuICAgICAgICBzb3VyY2VVdWlkOiB1dWlkLFxuICAgICAgICBzb3VyY2VEZXZpY2U6IGRldmljZUlkLFxuICAgICAgICB0aW1lc3RhbXA6IExvbmcuZnJvbU51bWJlcihEYXRlLm5vdygpKSxcbiAgICAgICAgY29udGVudDogQ3J5cHRvLmdldFJhbmRvbUJ5dGVzKDIwMCksXG4gICAgICB9KS5maW5pc2goKTtcblxuICAgICAgbWVzc2FnZVJlY2VpdmVyLmhhbmRsZVJlcXVlc3QoXG4gICAgICAgIG5ldyBJbmNvbWluZ1dlYlNvY2tldFJlcXVlc3QoXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IExvbmcuZnJvbU51bWJlcigxKSxcbiAgICAgICAgICAgIHZlcmI6ICdQVVQnLFxuICAgICAgICAgICAgcGF0aDogJy9hcGkvdjEvbWVzc2FnZScsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgaGVhZGVyczogW10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoXzogQnVmZmVyKTogdm9pZCA9PiB7fVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgICAgbWVzc2FnZVJlY2VpdmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2RlY3J5cHRpb24tZXJyb3InLFxuICAgICAgICAgIChlcnJvcjogRGVjcnlwdGlvbkVycm9yRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlcnJvci5kZWNyeXB0aW9uRXJyb3Iuc2VuZGVyVXVpZCwgdXVpZCk7XG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZXJyb3IuZGVjcnlwdGlvbkVycm9yLnNlbmRlckRldmljZSwgZGV2aWNlSWQpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBtZXNzYWdlUmVjZWl2ZXIuZHJhaW4oKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7OztBQUtBLGtCQUF1QjtBQUN2QixrQkFBOEI7QUFDOUIsa0JBQWlCO0FBRWpCLDZCQUE0QjtBQUM1QixnQ0FBeUM7QUFHekMsc0JBQXVDO0FBQ3ZDLGFBQXdCO0FBRXhCLFNBQVMsbUJBQW1CLE1BQU07QUFDaEMsUUFBTSxPQUFPO0FBQ2IsUUFBTSxXQUFXO0FBRWpCLE1BQUk7QUFDSixNQUFJO0FBRUosYUFBVyxZQUFZO0FBQ3JCLGNBQVUsT0FBTyxRQUFRLEtBQUssUUFBUSxHQUFHLFNBQVM7QUFDbEQsa0JBQWMsT0FBTyxRQUFRLEtBQUssWUFBWTtBQUM5QyxVQUFNLE9BQU8sUUFBUSxLQUFLLG1CQUFtQixvQkFBUSxHQUFHLENBQUM7QUFDekQsVUFBTSxPQUFPLFFBQVEsU0FBUyxjQUFjO0FBQUEsRUFDOUMsQ0FBQztBQUVELFlBQVUsWUFBWTtBQUNwQixRQUFJLFlBQVksVUFBYSxnQkFBZ0IsUUFBVztBQUN0RCxZQUFNLE9BQU8sUUFBUSxLQUFLLG1CQUFtQixTQUFTLFdBQVc7QUFBQSxJQUNuRTtBQUNBLFVBQU0sT0FBTyxRQUFRLFNBQVMscUJBQXFCO0FBQUEsRUFDckQsQ0FBQztBQUVELFdBQVMsY0FBYyxNQUFNO0FBQzNCLE9BQUcsMkRBQTJELFlBQVk7QUFDeEUsWUFBTSxrQkFBa0IsSUFBSSwrQkFBZ0I7QUFBQSxRQUMxQyxRQUFRLENBQUM7QUFBQSxRQUNULFNBQVMsT0FBTztBQUFBLFFBQ2hCLGlCQUFpQjtBQUFBLE1BQ25CLENBQUM7QUFFRCxZQUFNLE9BQU8sOEJBQU0sU0FBUyxPQUFPO0FBQUEsUUFDakMsTUFBTSw4QkFBTSxTQUFTLEtBQUs7QUFBQSxRQUMxQixZQUFZO0FBQUEsUUFDWixjQUFjO0FBQUEsUUFDZCxXQUFXLG9CQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFBQSxRQUNyQyxTQUFTLE9BQU8sZUFBZSxHQUFHO0FBQUEsTUFDcEMsQ0FBQyxFQUFFLE9BQU87QUFFVixzQkFBZ0IsY0FDZCxJQUFJLG1EQUNGO0FBQUEsUUFDRSxJQUFJLG9CQUFLLFdBQVcsQ0FBQztBQUFBLFFBQ3JCLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQSxTQUFTLENBQUM7QUFBQSxNQUNaLEdBQ0EsQ0FBQyxNQUFvQjtBQUFBLE1BQUMsQ0FDeEIsQ0FDRjtBQUVBLFlBQU0sSUFBSSxRQUFjLGFBQVc7QUFDakMsd0JBQWdCLGlCQUNkLG9CQUNBLENBQUMsVUFBZ0M7QUFDL0IsNkJBQU8sWUFBWSxNQUFNLGdCQUFnQixZQUFZLElBQUk7QUFDekQsNkJBQU8sWUFBWSxNQUFNLGdCQUFnQixjQUFjLFFBQVE7QUFDL0Qsa0JBQVE7QUFBQSxRQUNWLENBQ0Y7QUFBQSxNQUNGLENBQUM7QUFFRCxZQUFNLGdCQUFnQixNQUFNO0FBQUEsSUFDOUIsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
