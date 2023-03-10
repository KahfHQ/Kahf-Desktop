var import_chai = require("chai");
var import_lodash = require("lodash");
var import_AbortableProcess = require("../../util/AbortableProcess");
describe("AbortableProcess", () => {
  it("resolves the result normally", async () => {
    const process = new import_AbortableProcess.AbortableProcess("process", { abort: import_lodash.noop }, Promise.resolve(42));
    import_chai.assert.strictEqual(await process.getResult(), 42);
  });
  it("rejects normally", async () => {
    const process = new import_AbortableProcess.AbortableProcess("process", { abort: import_lodash.noop }, Promise.reject(new Error("rejected")));
    await import_chai.assert.isRejected(process.getResult(), "rejected");
  });
  it("rejects on abort", async () => {
    let calledAbort = false;
    const process = new import_AbortableProcess.AbortableProcess("A", {
      abort() {
        calledAbort = true;
      }
    }, new Promise(import_lodash.noop));
    process.abort();
    await import_chai.assert.isRejected(process.getResult(), 'Process "A" was aborted');
    import_chai.assert.isTrue(calledAbort);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQWJvcnRhYmxlUHJvY2Vzc190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IEFib3J0YWJsZVByb2Nlc3MgfSBmcm9tICcuLi8uLi91dGlsL0Fib3J0YWJsZVByb2Nlc3MnO1xuXG5kZXNjcmliZSgnQWJvcnRhYmxlUHJvY2VzcycsICgpID0+IHtcbiAgaXQoJ3Jlc29sdmVzIHRoZSByZXN1bHQgbm9ybWFsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJvY2VzcyA9IG5ldyBBYm9ydGFibGVQcm9jZXNzKFxuICAgICAgJ3Byb2Nlc3MnLFxuICAgICAgeyBhYm9ydDogbm9vcCB9LFxuICAgICAgUHJvbWlzZS5yZXNvbHZlKDQyKVxuICAgICk7XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYXdhaXQgcHJvY2Vzcy5nZXRSZXN1bHQoKSwgNDIpO1xuICB9KTtcblxuICBpdCgncmVqZWN0cyBub3JtYWxseScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwcm9jZXNzID0gbmV3IEFib3J0YWJsZVByb2Nlc3MoXG4gICAgICAncHJvY2VzcycsXG4gICAgICB7IGFib3J0OiBub29wIH0sXG4gICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ3JlamVjdGVkJykpXG4gICAgKTtcblxuICAgIGF3YWl0IGFzc2VydC5pc1JlamVjdGVkKHByb2Nlc3MuZ2V0UmVzdWx0KCksICdyZWplY3RlZCcpO1xuICB9KTtcblxuICBpdCgncmVqZWN0cyBvbiBhYm9ydCcsIGFzeW5jICgpID0+IHtcbiAgICBsZXQgY2FsbGVkQWJvcnQgPSBmYWxzZTtcbiAgICBjb25zdCBwcm9jZXNzID0gbmV3IEFib3J0YWJsZVByb2Nlc3MoXG4gICAgICAnQScsXG4gICAgICB7XG4gICAgICAgIGFib3J0KCkge1xuICAgICAgICAgIGNhbGxlZEFib3J0ID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBuZXcgUHJvbWlzZShub29wKVxuICAgICk7XG5cbiAgICBwcm9jZXNzLmFib3J0KCk7XG4gICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQocHJvY2Vzcy5nZXRSZXN1bHQoKSwgJ1Byb2Nlc3MgXCJBXCIgd2FzIGFib3J0ZWQnKTtcbiAgICBhc3NlcnQuaXNUcnVlKGNhbGxlZEFib3J0KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQUdBLGtCQUF1QjtBQUN2QixvQkFBcUI7QUFFckIsOEJBQWlDO0FBRWpDLFNBQVMsb0JBQW9CLE1BQU07QUFDakMsS0FBRyxnQ0FBZ0MsWUFBWTtBQUM3QyxVQUFNLFVBQVUsSUFBSSx5Q0FDbEIsV0FDQSxFQUFFLE9BQU8sbUJBQUssR0FDZCxRQUFRLFFBQVEsRUFBRSxDQUNwQjtBQUVBLHVCQUFPLFlBQVksTUFBTSxRQUFRLFVBQVUsR0FBRyxFQUFFO0FBQUEsRUFDbEQsQ0FBQztBQUVELEtBQUcsb0JBQW9CLFlBQVk7QUFDakMsVUFBTSxVQUFVLElBQUkseUNBQ2xCLFdBQ0EsRUFBRSxPQUFPLG1CQUFLLEdBQ2QsUUFBUSxPQUFPLElBQUksTUFBTSxVQUFVLENBQUMsQ0FDdEM7QUFFQSxVQUFNLG1CQUFPLFdBQVcsUUFBUSxVQUFVLEdBQUcsVUFBVTtBQUFBLEVBQ3pELENBQUM7QUFFRCxLQUFHLG9CQUFvQixZQUFZO0FBQ2pDLFFBQUksY0FBYztBQUNsQixVQUFNLFVBQVUsSUFBSSx5Q0FDbEIsS0FDQTtBQUFBLE1BQ0UsUUFBUTtBQUNOLHNCQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGLEdBQ0EsSUFBSSxRQUFRLGtCQUFJLENBQ2xCO0FBRUEsWUFBUSxNQUFNO0FBQ2QsVUFBTSxtQkFBTyxXQUFXLFFBQVEsVUFBVSxHQUFHLHlCQUF5QjtBQUN0RSx1QkFBTyxPQUFPLFdBQVc7QUFBQSxFQUMzQixDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
