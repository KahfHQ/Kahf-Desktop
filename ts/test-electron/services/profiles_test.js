var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_util = require("../../util");
var import_durations = require("../../util/durations");
var import_profiles = require("../../services/profiles");
var import_UUID = require("../../types/UUID");
var import_Errors = require("../../textsecure/Errors");
describe("util/profiles", () => {
  const UUID_1 = import_UUID.UUID.generate().toString();
  const UUID_2 = import_UUID.UUID.generate().toString();
  const UUID_3 = import_UUID.UUID.generate().toString();
  const UUID_4 = import_UUID.UUID.generate().toString();
  const UUID_5 = import_UUID.UUID.generate().toString();
  beforeEach(async () => {
    await window.ConversationController.getOrCreateAndWait(UUID_1, "private");
    await window.ConversationController.getOrCreateAndWait(UUID_2, "private");
    await window.ConversationController.getOrCreateAndWait(UUID_3, "private");
    await window.ConversationController.getOrCreateAndWait(UUID_4, "private");
    await window.ConversationController.getOrCreateAndWait(UUID_5, "private");
  });
  describe("clearAll", () => {
    it("Cancels all in-flight requests", async () => {
      const getProfileWithLongDelay = /* @__PURE__ */ __name(async () => {
        await (0, import_util.sleep)(import_durations.MINUTE);
      }, "getProfileWithLongDelay");
      const service = new import_profiles.ProfileService(getProfileWithLongDelay);
      const promise1 = service.get(UUID_1);
      const promise2 = service.get(UUID_2);
      const promise3 = service.get(UUID_3);
      const promise4 = service.get(UUID_4);
      service.clearAll("testing");
      await import_chai.assert.isRejected(promise1, "job cancelled");
      await import_chai.assert.isRejected(promise2, "job cancelled");
      await import_chai.assert.isRejected(promise3, "job cancelled");
      await import_chai.assert.isRejected(promise4, "job cancelled");
    });
  });
  describe("pause", () => {
    it("pauses the queue", async () => {
      let runCount = 0;
      const getProfileWithIncrement = /* @__PURE__ */ __name(() => {
        runCount += 1;
        return Promise.resolve();
      }, "getProfileWithIncrement");
      const service = new import_profiles.ProfileService(getProfileWithIncrement);
      service.get(UUID_1);
      service.get(UUID_2);
      service.get(UUID_3);
      const lastPromise = service.get(UUID_4);
      const pausePromise = service.pause(5);
      import_chai.assert.strictEqual(runCount, 3, "as pause starts");
      await pausePromise;
      await lastPromise;
      import_chai.assert.strictEqual(runCount, 4, "after last promise");
    });
  });
  describe("get", () => {
    it("throws if we are currently paused", async () => {
      let runCount = 0;
      const getProfileWithIncrement = /* @__PURE__ */ __name(() => {
        runCount += 1;
        return Promise.resolve();
      }, "getProfileWithIncrement");
      const service = new import_profiles.ProfileService(getProfileWithIncrement);
      const pausePromise = service.pause(5);
      const promise1 = service.get(UUID_1);
      const promise2 = service.get(UUID_2);
      const promise3 = service.get(UUID_3);
      const promise4 = service.get(UUID_4);
      await import_chai.assert.isRejected(promise1, "paused queue");
      await import_chai.assert.isRejected(promise2, "paused queue");
      await import_chai.assert.isRejected(promise3, "paused queue");
      await import_chai.assert.isRejected(promise4, "paused queue");
      await pausePromise;
      import_chai.assert.strictEqual(runCount, 0);
    });
    it("clears all outstanding jobs if we get a 413, then pauses", async () => {
      let runCount = 0;
      const getProfileWhichThrows = /* @__PURE__ */ __name(async () => {
        runCount += 1;
        const error = new import_Errors.HTTPError("fake 413", {
          code: 413,
          headers: {
            "retry-after": "1"
          }
        });
        throw error;
      }, "getProfileWhichThrows");
      const service = new import_profiles.ProfileService(getProfileWhichThrows);
      const promise1 = service.get(UUID_1);
      const promise2 = service.get(UUID_2);
      const promise3 = service.get(UUID_3);
      const promise4 = service.get(UUID_4);
      import_chai.assert.strictEqual(runCount, 3, "before await");
      await import_chai.assert.isRejected(promise1, "fake 413");
      const promise5 = service.get(UUID_5);
      await import_chai.assert.isRejected(promise2, "job cancelled");
      await import_chai.assert.isRejected(promise3, "job cancelled");
      await import_chai.assert.isRejected(promise4, "job cancelled");
      await import_chai.assert.isRejected(promise5, "paused queue");
      import_chai.assert.strictEqual(runCount, 3, "after await");
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJvZmlsZXNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgeyBNSU5VVEUgfSBmcm9tICcuLi8uLi91dGlsL2R1cmF0aW9ucyc7XG5cbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcHJvZmlsZXMnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgSFRUUEVycm9yIH0gZnJvbSAnLi4vLi4vdGV4dHNlY3VyZS9FcnJvcnMnO1xuXG5kZXNjcmliZSgndXRpbC9wcm9maWxlcycsICgpID0+IHtcbiAgY29uc3QgVVVJRF8xID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IFVVSURfMiA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuICBjb25zdCBVVUlEXzMgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgY29uc3QgVVVJRF80ID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IFVVSURfNSA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlQW5kV2FpdChVVUlEXzEsICdwcml2YXRlJyk7XG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGVBbmRXYWl0KFVVSURfMiwgJ3ByaXZhdGUnKTtcbiAgICBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZUFuZFdhaXQoVVVJRF8zLCAncHJpdmF0ZScpO1xuICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE9yQ3JlYXRlQW5kV2FpdChVVUlEXzQsICdwcml2YXRlJyk7XG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGVBbmRXYWl0KFVVSURfNSwgJ3ByaXZhdGUnKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NsZWFyQWxsJywgKCkgPT4ge1xuICAgIGl0KCdDYW5jZWxzIGFsbCBpbi1mbGlnaHQgcmVxdWVzdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBnZXRQcm9maWxlV2l0aExvbmdEZWxheSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgc2xlZXAoTUlOVVRFKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IFByb2ZpbGVTZXJ2aWNlKGdldFByb2ZpbGVXaXRoTG9uZ0RlbGF5KTtcblxuICAgICAgY29uc3QgcHJvbWlzZTEgPSBzZXJ2aWNlLmdldChVVUlEXzEpO1xuICAgICAgY29uc3QgcHJvbWlzZTIgPSBzZXJ2aWNlLmdldChVVUlEXzIpO1xuICAgICAgY29uc3QgcHJvbWlzZTMgPSBzZXJ2aWNlLmdldChVVUlEXzMpO1xuICAgICAgY29uc3QgcHJvbWlzZTQgPSBzZXJ2aWNlLmdldChVVUlEXzQpO1xuXG4gICAgICBzZXJ2aWNlLmNsZWFyQWxsKCd0ZXN0aW5nJyk7XG5cbiAgICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb21pc2UxLCAnam9iIGNhbmNlbGxlZCcpO1xuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQocHJvbWlzZTIsICdqb2IgY2FuY2VsbGVkJyk7XG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChwcm9taXNlMywgJ2pvYiBjYW5jZWxsZWQnKTtcbiAgICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb21pc2U0LCAnam9iIGNhbmNlbGxlZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGF1c2UnLCAoKSA9PiB7XG4gICAgaXQoJ3BhdXNlcyB0aGUgcXVldWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgcnVuQ291bnQgPSAwO1xuICAgICAgY29uc3QgZ2V0UHJvZmlsZVdpdGhJbmNyZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIHJ1bkNvdW50ICs9IDE7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IFByb2ZpbGVTZXJ2aWNlKGdldFByb2ZpbGVXaXRoSW5jcmVtZW50KTtcblxuICAgICAgLy8gUXVldWVkIGFuZCBpbW1lZGlhdGVseSBzdGFydGVkIGR1ZSB0byBjb25jdXJyZW5jeSA9IDNcbiAgICAgIHNlcnZpY2UuZ2V0KFVVSURfMSk7XG4gICAgICBzZXJ2aWNlLmdldChVVUlEXzIpO1xuICAgICAgc2VydmljZS5nZXQoVVVJRF8zKTtcblxuICAgICAgLy8gUXVldWVkIGJ1dCBvbmx5IHJ1biBhZnRlciBwYXVzZWQgcXVldWUgcmVzdGFydHNcbiAgICAgIGNvbnN0IGxhc3RQcm9taXNlID0gc2VydmljZS5nZXQoVVVJRF80KTtcblxuICAgICAgY29uc3QgcGF1c2VQcm9taXNlID0gc2VydmljZS5wYXVzZSg1KTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJ1bkNvdW50LCAzLCAnYXMgcGF1c2Ugc3RhcnRzJyk7XG5cbiAgICAgIGF3YWl0IHBhdXNlUHJvbWlzZTtcbiAgICAgIGF3YWl0IGxhc3RQcm9taXNlO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocnVuQ291bnQsIDQsICdhZnRlciBsYXN0IHByb21pc2UnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldCcsICgpID0+IHtcbiAgICBpdCgndGhyb3dzIGlmIHdlIGFyZSBjdXJyZW50bHkgcGF1c2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJ1bkNvdW50ID0gMDtcbiAgICAgIGNvbnN0IGdldFByb2ZpbGVXaXRoSW5jcmVtZW50ID0gKCkgPT4ge1xuICAgICAgICBydW5Db3VudCArPSAxO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBQcm9maWxlU2VydmljZShnZXRQcm9maWxlV2l0aEluY3JlbWVudCk7XG5cbiAgICAgIGNvbnN0IHBhdXNlUHJvbWlzZSA9IHNlcnZpY2UucGF1c2UoNSk7XG5cbiAgICAgIC8vIE5vbmUgb2YgdGhlc2UgYXJlIGV2ZW4gcXVldWVkXG4gICAgICBjb25zdCBwcm9taXNlMSA9IHNlcnZpY2UuZ2V0KFVVSURfMSk7XG4gICAgICBjb25zdCBwcm9taXNlMiA9IHNlcnZpY2UuZ2V0KFVVSURfMik7XG4gICAgICBjb25zdCBwcm9taXNlMyA9IHNlcnZpY2UuZ2V0KFVVSURfMyk7XG4gICAgICBjb25zdCBwcm9taXNlNCA9IHNlcnZpY2UuZ2V0KFVVSURfNCk7XG5cbiAgICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb21pc2UxLCAncGF1c2VkIHF1ZXVlJyk7XG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChwcm9taXNlMiwgJ3BhdXNlZCBxdWV1ZScpO1xuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQocHJvbWlzZTMsICdwYXVzZWQgcXVldWUnKTtcbiAgICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb21pc2U0LCAncGF1c2VkIHF1ZXVlJyk7XG5cbiAgICAgIGF3YWl0IHBhdXNlUHJvbWlzZTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJ1bkNvdW50LCAwKTtcbiAgICB9KTtcblxuICAgIGl0KCdjbGVhcnMgYWxsIG91dHN0YW5kaW5nIGpvYnMgaWYgd2UgZ2V0IGEgNDEzLCB0aGVuIHBhdXNlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBydW5Db3VudCA9IDA7XG4gICAgICBjb25zdCBnZXRQcm9maWxlV2hpY2hUaHJvd3MgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHJ1bkNvdW50ICs9IDE7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEhUVFBFcnJvcignZmFrZSA0MTMnLCB7XG4gICAgICAgICAgY29kZTogNDEzLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdyZXRyeS1hZnRlcic6ICcxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBQcm9maWxlU2VydmljZShnZXRQcm9maWxlV2hpY2hUaHJvd3MpO1xuXG4gICAgICAvLyBRdWV1ZWQgYW5kIGltbWVkaWF0ZWx5IHN0YXJ0ZWQgZHVlIHRvIGNvbmN1cnJlbmN5ID0gM1xuICAgICAgY29uc3QgcHJvbWlzZTEgPSBzZXJ2aWNlLmdldChVVUlEXzEpO1xuICAgICAgY29uc3QgcHJvbWlzZTIgPSBzZXJ2aWNlLmdldChVVUlEXzIpO1xuICAgICAgY29uc3QgcHJvbWlzZTMgPSBzZXJ2aWNlLmdldChVVUlEXzMpO1xuXG4gICAgICAvLyBOZXZlciBzdGFydGVkLCBidXQgcXVldWVkXG4gICAgICBjb25zdCBwcm9taXNlNCA9IHNlcnZpY2UuZ2V0KFVVSURfNCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChydW5Db3VudCwgMywgJ2JlZm9yZSBhd2FpdCcpO1xuXG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChwcm9taXNlMSwgJ2Zha2UgNDEzJyk7XG5cbiAgICAgIC8vIE5ldmVyIHF1ZXVlZFxuICAgICAgY29uc3QgcHJvbWlzZTUgPSBzZXJ2aWNlLmdldChVVUlEXzUpO1xuXG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChwcm9taXNlMiwgJ2pvYiBjYW5jZWxsZWQnKTtcbiAgICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb21pc2UzLCAnam9iIGNhbmNlbGxlZCcpO1xuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQocHJvbWlzZTQsICdqb2IgY2FuY2VsbGVkJyk7XG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChwcm9taXNlNSwgJ3BhdXNlZCBxdWV1ZScpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocnVuQ291bnQsIDMsICdhZnRlciBhd2FpdCcpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFHQSxrQkFBdUI7QUFDdkIsa0JBQXNCO0FBQ3RCLHVCQUF1QjtBQUV2QixzQkFBK0I7QUFDL0Isa0JBQXFCO0FBQ3JCLG9CQUEwQjtBQUUxQixTQUFTLGlCQUFpQixNQUFNO0FBQzlCLFFBQU0sU0FBUyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUN4QyxRQUFNLFNBQVMsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFDeEMsUUFBTSxTQUFTLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQ3hDLFFBQU0sU0FBUyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUN4QyxRQUFNLFNBQVMsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFFeEMsYUFBVyxZQUFZO0FBQ3JCLFVBQU0sT0FBTyx1QkFBdUIsbUJBQW1CLFFBQVEsU0FBUztBQUN4RSxVQUFNLE9BQU8sdUJBQXVCLG1CQUFtQixRQUFRLFNBQVM7QUFDeEUsVUFBTSxPQUFPLHVCQUF1QixtQkFBbUIsUUFBUSxTQUFTO0FBQ3hFLFVBQU0sT0FBTyx1QkFBdUIsbUJBQW1CLFFBQVEsU0FBUztBQUN4RSxVQUFNLE9BQU8sdUJBQXVCLG1CQUFtQixRQUFRLFNBQVM7QUFBQSxFQUMxRSxDQUFDO0FBRUQsV0FBUyxZQUFZLE1BQU07QUFDekIsT0FBRyxrQ0FBa0MsWUFBWTtBQUMvQyxZQUFNLDBCQUEwQixtQ0FBWTtBQUMxQyxjQUFNLHVCQUFNLHVCQUFNO0FBQUEsTUFDcEIsR0FGZ0M7QUFHaEMs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
