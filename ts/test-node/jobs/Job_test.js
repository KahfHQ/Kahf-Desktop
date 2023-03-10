var import_chai = require("chai");
var import_Job = require("../../jobs/Job");
describe("Job", () => {
  it("stores its arguments", () => {
    const id = "abc123";
    const timestamp = Date.now();
    const queueType = "test queue";
    const data = { foo: "bar" };
    const completion = Promise.resolve();
    const job = new import_Job.Job(id, timestamp, queueType, data, completion);
    import_chai.assert.strictEqual(job.id, id);
    import_chai.assert.strictEqual(job.timestamp, timestamp);
    import_chai.assert.strictEqual(job.queueType, queueType);
    import_chai.assert.strictEqual(job.data, data);
    import_chai.assert.strictEqual(job.completion, completion);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiSm9iX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7IEpvYiB9IGZyb20gJy4uLy4uL2pvYnMvSm9iJztcblxuZGVzY3JpYmUoJ0pvYicsICgpID0+IHtcbiAgaXQoJ3N0b3JlcyBpdHMgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGlkID0gJ2FiYzEyMyc7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBxdWV1ZVR5cGUgPSAndGVzdCBxdWV1ZSc7XG4gICAgY29uc3QgZGF0YSA9IHsgZm9vOiAnYmFyJyB9O1xuICAgIGNvbnN0IGNvbXBsZXRpb24gPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoaWQsIHRpbWVzdGFtcCwgcXVldWVUeXBlLCBkYXRhLCBjb21wbGV0aW9uKTtcblxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChqb2IuaWQsIGlkKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoam9iLnRpbWVzdGFtcCwgdGltZXN0YW1wKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoam9iLnF1ZXVlVHlwZSwgcXVldWVUeXBlKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoam9iLmRhdGEsIGRhdGEpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChqb2IuY29tcGxldGlvbiwgY29tcGxldGlvbik7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFHQSxrQkFBdUI7QUFFdkIsaUJBQW9CO0FBRXBCLFNBQVMsT0FBTyxNQUFNO0FBQ3BCLEtBQUcsd0JBQXdCLE1BQU07QUFDL0IsVUFBTSxLQUFLO0FBQ1gsVUFBTSxZQUFZLEtBQUssSUFBSTtBQUMzQixVQUFNLFlBQVk7QUFDbEIsVUFBTSxPQUFPLEVBQUUsS0FBSyxNQUFNO0FBQzFCLFVBQU0sYUFBYSxRQUFRLFFBQVE7QUFFbkMsVUFBTSxNQUFNLElBQUksZUFBSSxJQUFJLFdBQVcsV0FBVyxNQUFNLFVBQVU7QUFFOUQsdUJBQU8sWUFBWSxJQUFJLElBQUksRUFBRTtBQUM3Qix1QkFBTyxZQUFZLElBQUksV0FBVyxTQUFTO0FBQzNDLHVCQUFPLFlBQVksSUFBSSxXQUFXLFNBQVM7QUFDM0MsdUJBQU8sWUFBWSxJQUFJLE1BQU0sSUFBSTtBQUNqQyx1QkFBTyxZQUFZLElBQUksWUFBWSxVQUFVO0FBQUEsRUFDL0MsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
