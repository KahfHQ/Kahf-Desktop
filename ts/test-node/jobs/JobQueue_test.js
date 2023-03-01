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
var import_events = __toESM(require("events"));
var import_zod = require("zod");
var import_lodash = require("lodash");
var import_uuid = require("uuid");
var import_p_queue = __toESM(require("p-queue"));
var import_JobError = require("../../jobs/JobError");
var import_TestJobQueueStore = require("./TestJobQueueStore");
var import_missingCaseError = require("../../util/missingCaseError");
var import_JobQueue = require("../../jobs/JobQueue");
var import_util = require("../../util");
describe("JobQueue", () => {
  describe("end-to-end tests", () => {
    it("writes jobs to the database, processes them, and then deletes them", async () => {
      const testJobSchema = import_zod.z.object({
        a: import_zod.z.number(),
        b: import_zod.z.number()
      });
      const results = /* @__PURE__ */ new Set();
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class Queue extends import_JobQueue.JobQueue {
        parseData(data) {
          return testJobSchema.parse(data);
        }
        async run({ data }) {
          results.add(data.a + data.b);
        }
      }
      const addQueue = new Queue({
        store,
        queueType: "test add queue",
        maxAttempts: 1
      });
      import_chai.assert.deepEqual(results, /* @__PURE__ */ new Set());
      import_chai.assert.isEmpty(store.storedJobs);
      addQueue.streamJobs();
      store.pauseStream("test add queue");
      const job1 = await addQueue.add({ a: 1, b: 2 });
      const job2 = await addQueue.add({ a: 3, b: 4 });
      import_chai.assert.deepEqual(results, /* @__PURE__ */ new Set());
      import_chai.assert.lengthOf(store.storedJobs, 2);
      store.resumeStream("test add queue");
      await job1.completion;
      await job2.completion;
      import_chai.assert.deepEqual(results, /* @__PURE__ */ new Set([3, 7]));
      import_chai.assert.isEmpty(store.storedJobs);
    });
    it("by default, kicks off one job at a time", async () => {
      let maxActive = 0;
      let activeJobCount = 0;
      const updateActiveJobCount = /* @__PURE__ */ __name((incrementBy) => {
        activeJobCount += incrementBy;
        maxActive = Math.max(activeJobCount, maxActive);
      }, "updateActiveJobCount");
      class Queue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.number().parse(data);
        }
        async run() {
          try {
            updateActiveJobCount(1);
            (0, import_util.sleep)(1);
          } finally {
            updateActiveJobCount(-1);
          }
        }
      }
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      const queue = new Queue({
        store,
        queueType: "test queue",
        maxAttempts: 100
      });
      queue.streamJobs();
      const createPromise1 = queue.add(1);
      const createPromise2 = queue.add(2);
      const createPromise3 = queue.add(3);
      const createPromise4 = queue.add(4);
      const { completion: promise1 } = await createPromise1;
      const { completion: promise2 } = await createPromise2;
      const { completion: promise3 } = await createPromise3;
      const { completion: promise4 } = await createPromise4;
      await promise1;
      await promise2;
      await promise3;
      await promise4;
      import_chai.assert.strictEqual(1, maxActive);
    });
    it("can override the in-memory queue", async () => {
      let jobsAdded = 0;
      const testQueue = new import_p_queue.default();
      testQueue.on("add", () => {
        jobsAdded += 1;
      });
      class Queue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.number().parse(data);
        }
        getInMemoryQueue(parsedJob) {
          (0, import_chai.assert)((/* @__PURE__ */ new Set([1, 2, 3, 4])).has(parsedJob.data), "Bad data passed to `getInMemoryQueue`");
          return testQueue;
        }
        run() {
          return Promise.resolve();
        }
      }
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      const queue = new Queue({
        store,
        queueType: "test queue",
        maxAttempts: 100
      });
      queue.streamJobs();
      const jobs = await Promise.all([
        queue.add(1),
        queue.add(2),
        queue.add(3),
        queue.add(4)
      ]);
      await Promise.all(jobs.map((job) => job.completion));
      import_chai.assert.strictEqual(jobsAdded, 4);
    });
    it("writes jobs to the database correctly", async () => {
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.string().parse(data);
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue1 = new TestQueue({
        store,
        queueType: "test 1",
        maxAttempts: 1
      });
      const queue2 = new TestQueue({
        store,
        queueType: "test 2",
        maxAttempts: 1
      });
      store.pauseStream("test 1");
      store.pauseStream("test 2");
      queue1.streamJobs();
      queue2.streamJobs();
      await queue1.add("one");
      await queue2.add("A");
      await queue1.add("two");
      await queue2.add("B");
      await queue1.add("three");
      import_chai.assert.lengthOf(store.storedJobs, 5);
      const ids = store.storedJobs.map((job) => job.id);
      import_chai.assert.lengthOf(store.storedJobs, new Set(ids).size, "Expected every job to have a unique ID");
      const timestamps = store.storedJobs.map((job) => job.timestamp);
      timestamps.forEach((timestamp) => {
        import_chai.assert.approximately(timestamp, Date.now(), 3e3, "Expected the timestamp to be ~now");
      });
      const datas = store.storedJobs.map((job) => job.data);
      import_chai.assert.sameMembers(datas, ["three", "two", "one", "A", "B"], "Expected every job's data to be stored");
      const queueTypes = (0, import_lodash.groupBy)(store.storedJobs, "queueType");
      import_chai.assert.hasAllKeys(queueTypes, ["test 1", "test 2"]);
      import_chai.assert.lengthOf(queueTypes["test 1"], 3);
      import_chai.assert.lengthOf(queueTypes["test 2"], 2);
    });
    it("can override the insertion logic, skipping storage persistence", async () => {
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.string().parse(data);
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 1
      });
      queue.streamJobs();
      const insert = sinon.stub().resolves();
      await queue.add("foo bar", insert);
      import_chai.assert.lengthOf(store.storedJobs, 0);
      sinon.assert.calledOnce(insert);
      sinon.assert.calledWith(insert, sinon.match({
        id: sinon.match.string,
        timestamp: sinon.match.number,
        queueType: "test queue",
        data: "foo bar"
      }));
    });
    it("retries jobs, running them up to maxAttempts times", async () => {
      let fooAttempts = 0;
      let barAttempts = 0;
      let fooSucceeded = false;
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class RetryQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          if (data !== "foo" && data !== "bar") {
            throw new Error("Invalid data");
          }
          return data;
        }
        async run({ data }) {
          switch (data) {
            case "foo":
              fooAttempts += 1;
              if (fooAttempts < 3) {
                throw new Error("foo job should fail the first and second time");
              }
              fooSucceeded = true;
              break;
            case "bar":
              barAttempts += 1;
              throw new Error("bar job always fails in this test");
              break;
            default:
              throw (0, import_missingCaseError.missingCaseError)(data);
          }
        }
      }
      const retryQueue = new RetryQueue({
        store,
        queueType: "test retry queue",
        maxAttempts: 5
      });
      retryQueue.streamJobs();
      await (await retryQueue.add("foo")).completion;
      let booErr;
      try {
        await (await retryQueue.add("bar")).completion;
      } catch (err) {
        booErr = err;
      }
      import_chai.assert.strictEqual(fooAttempts, 3);
      import_chai.assert.isTrue(fooSucceeded);
      import_chai.assert.strictEqual(barAttempts, 5);
      if (!(booErr instanceof import_JobError.JobError)) {
        import_chai.assert.fail("Expected error to be a JobError");
        return;
      }
      import_chai.assert.include(booErr.message, "bar job always fails in this test");
      import_chai.assert.isEmpty(store.storedJobs);
    });
    it("passes the attempt number to the run function", async () => {
      const attempts = [];
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.string().parse(data);
        }
        async run(_, { attempt }) {
          attempts.push(attempt);
          throw new Error("this job always fails");
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test",
        maxAttempts: 6
      });
      queue.streamJobs();
      try {
        await (await queue.add("foo")).completion;
      } catch (err) {
      }
      import_chai.assert.deepStrictEqual(attempts, [1, 2, 3, 4, 5, 6]);
    });
    it("passes a logger to the run function", async () => {
      const uniqueString = (0, import_uuid.v4)();
      const fakeLogger = {
        fatal: sinon.fake(),
        error: sinon.fake(),
        warn: sinon.fake(),
        info: sinon.fake(),
        debug: sinon.fake(),
        trace: sinon.fake()
      };
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.number().parse(data);
        }
        async run(_, { log }) {
          log.info(uniqueString);
          log.warn(uniqueString);
          log.error(uniqueString);
        }
      }
      const queue = new TestQueue({
        store: new import_TestJobQueueStore.TestJobQueueStore(),
        queueType: "test queue 123",
        maxAttempts: 6,
        logger: fakeLogger
      });
      queue.streamJobs();
      const job = await queue.add(1);
      await job.completion;
      [fakeLogger.info, fakeLogger.warn, fakeLogger.error].forEach((logFn) => {
        sinon.assert.calledWith(logFn, sinon.match((arg) => typeof arg === "string" && arg.includes(job.id) && arg.includes("test queue 123")), sinon.match((arg) => typeof arg === "string" && arg.includes(uniqueString)));
      });
    });
    it("makes job.completion reject if parseData throws", async () => {
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          if (data === "valid") {
            return data;
          }
          throw new Error("uh oh");
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue = new TestQueue({
        store: new import_TestJobQueueStore.TestJobQueueStore(),
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      const job = await queue.add("this will fail to parse");
      let jobError;
      try {
        await job.completion;
      } catch (err) {
        jobError = err;
      }
      if (!(jobError instanceof import_JobError.JobError)) {
        import_chai.assert.fail("Expected error to be a JobError");
        return;
      }
      import_chai.assert.include(jobError.message, "Failed to parse job data. Was unexpected data loaded from the database?");
    });
    it("doesn't run the job if parseData throws", async () => {
      const run = sinon.stub().resolves();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          if (data === "valid") {
            return data;
          }
          throw new Error("invalid data!");
        }
        run(job) {
          return run(job);
        }
      }
      const queue = new TestQueue({
        store: new import_TestJobQueueStore.TestJobQueueStore(),
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      (await queue.add("invalid")).completion.catch(import_lodash.noop);
      (await queue.add("invalid")).completion.catch(import_lodash.noop);
      await queue.add("valid");
      (await queue.add("invalid")).completion.catch(import_lodash.noop);
      (await queue.add("invalid")).completion.catch(import_lodash.noop);
      sinon.assert.calledOnce(run);
      sinon.assert.calledWithMatch(run, { data: "valid" });
    });
    it("deletes jobs from storage if parseData throws", async () => {
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          if (data === "valid") {
            return data;
          }
          throw new Error("invalid data!");
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      await (await queue.add("invalid 1")).completion.catch(import_lodash.noop);
      await (await queue.add("invalid 2")).completion.catch(import_lodash.noop);
      await queue.add("valid");
      const datas = store.storedJobs.map((job) => job.data);
      import_chai.assert.sameMembers(datas, ["valid"]);
    });
    it("adding the job resolves AFTER inserting the job into the database", async () => {
      let inserted = false;
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      store.events.on("insert", () => {
        inserted = true;
      });
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(_) {
          return void 0;
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      const addPromise = queue.add(void 0);
      import_chai.assert.isFalse(inserted);
      await addPromise;
      import_chai.assert.isTrue(inserted);
    });
    it("starts the job AFTER inserting the job into the database", async () => {
      const events = [];
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      store.events.on("insert", () => {
        events.push("insert");
      });
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          events.push("parsing data");
          return data;
        }
        async run() {
          events.push("running");
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      await (await queue.add(123)).completion;
      import_chai.assert.deepEqual(events, ["insert", "parsing data", "running"]);
    });
    it("resolves job.completion AFTER deleting the job from the database", async () => {
      const events = [];
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      store.events.on("delete", () => {
        events.push("delete");
      });
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(_) {
          return void 0;
        }
        async run() {
          return Promise.resolve();
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 999
      });
      queue.streamJobs();
      store.pauseStream("test queue");
      const job = await queue.add(void 0);
      const jobCompletionPromise = job.completion.then(() => {
        events.push("resolved");
      });
      import_chai.assert.lengthOf(store.storedJobs, 1);
      store.resumeStream("test queue");
      await jobCompletionPromise;
      import_chai.assert.deepEqual(events, ["delete", "resolved"]);
    });
    it("if the job fails after every attempt, rejects job.completion AFTER deleting the job from the database", async () => {
      const events = [];
      const store = new import_TestJobQueueStore.TestJobQueueStore();
      store.events.on("delete", () => {
        events.push("delete");
      });
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(_) {
          return void 0;
        }
        async run() {
          events.push("running");
          throw new Error("uh oh");
        }
      }
      const queue = new TestQueue({
        store,
        queueType: "test queue",
        maxAttempts: 5
      });
      queue.streamJobs();
      store.pauseStream("test queue");
      const job = await queue.add(void 0);
      const jobCompletionPromise = job.completion.catch(() => {
        events.push("rejected");
      });
      import_chai.assert.lengthOf(store.storedJobs, 1);
      store.resumeStream("test queue");
      await jobCompletionPromise;
      import_chai.assert.deepEqual(events, [
        "running",
        "running",
        "running",
        "running",
        "running",
        "delete",
        "rejected"
      ]);
    });
  });
  describe("streamJobs", () => {
    const storedJobSchema = import_zod.z.object({
      id: import_zod.z.string(),
      timestamp: import_zod.z.number(),
      queueType: import_zod.z.string(),
      data: import_zod.z.unknown()
    });
    class FakeStream {
      constructor() {
        this.eventEmitter = new import_events.default();
      }
      async *[Symbol.asyncIterator]() {
        while (true) {
          const [job] = await (0, import_events.once)(this.eventEmitter, "drip");
          yield storedJobSchema.parse(job);
        }
      }
      drip(job) {
        this.eventEmitter.emit("drip", job);
      }
    }
    let fakeStream;
    let fakeStore;
    beforeEach(() => {
      fakeStream = new FakeStream();
      fakeStore = {
        insert: sinon.stub().resolves(),
        delete: sinon.stub().resolves(),
        stream: sinon.stub().returns(fakeStream)
      };
    });
    it("starts streaming jobs from the store", async () => {
      const eventEmitter = new import_events.default();
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return import_zod.z.number().parse(data);
        }
        async run({ data }) {
          eventEmitter.emit("run", data);
        }
      }
      const noopQueue = new TestQueue({
        store: fakeStore,
        queueType: "test noop queue",
        maxAttempts: 99
      });
      sinon.assert.notCalled(fakeStore.stream);
      noopQueue.streamJobs();
      sinon.assert.calledOnce(fakeStore.stream);
      fakeStream.drip({
        id: (0, import_uuid.v4)(),
        timestamp: Date.now(),
        queueType: "test noop queue",
        data: 123
      });
      const [firstRunData] = await (0, import_events.once)(eventEmitter, "run");
      fakeStream.drip({
        id: (0, import_uuid.v4)(),
        timestamp: Date.now(),
        queueType: "test noop queue",
        data: 456
      });
      const [secondRunData] = await (0, import_events.once)(eventEmitter, "run");
      import_chai.assert.strictEqual(firstRunData, 123);
      import_chai.assert.strictEqual(secondRunData, 456);
    });
    it("rejects when called more than once", async () => {
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(data) {
          return data;
        }
        async run() {
          return Promise.resolve();
        }
      }
      const noopQueue = new TestQueue({
        store: fakeStore,
        queueType: "test noop queue",
        maxAttempts: 99
      });
      noopQueue.streamJobs();
      await import_chai.assert.isRejected(noopQueue.streamJobs());
      await import_chai.assert.isRejected(noopQueue.streamJobs());
      sinon.assert.calledOnce(fakeStore.stream);
    });
  });
  describe("add", () => {
    it("rejects if the job queue has not started streaming", async () => {
      const fakeStore = {
        insert: sinon.stub().resolves(),
        delete: sinon.stub().resolves(),
        stream: sinon.stub()
      };
      class TestQueue extends import_JobQueue.JobQueue {
        parseData(_) {
          return void 0;
        }
        async run() {
          return Promise.resolve();
        }
      }
      const noopQueue = new TestQueue({
        store: fakeStore,
        queueType: "test noop queue",
        maxAttempts: 99
      });
      await import_chai.assert.isRejected(noopQueue.add(void 0));
      sinon.assert.notCalled(fakeStore.stream);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiSm9iUXVldWVfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCBFdmVudEVtaXR0ZXIsIHsgb25jZSB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB7IG5vb3AsIGdyb3VwQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IFBRdWV1ZSBmcm9tICdwLXF1ZXVlJztcbmltcG9ydCB7IEpvYkVycm9yIH0gZnJvbSAnLi4vLi4vam9icy9Kb2JFcnJvcic7XG5pbXBvcnQgeyBUZXN0Sm9iUXVldWVTdG9yZSB9IGZyb20gJy4vVGVzdEpvYlF1ZXVlU3RvcmUnO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9Mb2dnaW5nJztcblxuaW1wb3J0IHsgSm9iUXVldWUgfSBmcm9tICcuLi8uLi9qb2JzL0pvYlF1ZXVlJztcbmltcG9ydCB0eXBlIHsgUGFyc2VkSm9iLCBTdG9yZWRKb2IsIEpvYlF1ZXVlU3RvcmUgfSBmcm9tICcuLi8uLi9qb2JzL3R5cGVzJztcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdKb2JRdWV1ZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2VuZC10by1lbmQgdGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ3dyaXRlcyBqb2JzIHRvIHRoZSBkYXRhYmFzZSwgcHJvY2Vzc2VzIHRoZW0sIGFuZCB0aGVuIGRlbGV0ZXMgdGhlbScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3RKb2JTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgICAgIGE6IHoubnVtYmVyKCksXG4gICAgICAgIGI6IHoubnVtYmVyKCksXG4gICAgICB9KTtcblxuICAgICAgdHlwZSBUZXN0Sm9iRGF0YSA9IHouaW5mZXI8dHlwZW9mIHRlc3RKb2JTY2hlbWE+O1xuXG4gICAgICBjb25zdCByZXN1bHRzID0gbmV3IFNldDx1bmtub3duPigpO1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKTtcblxuICAgICAgY2xhc3MgUXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxUZXN0Sm9iRGF0YT4ge1xuICAgICAgICBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IFRlc3RKb2JEYXRhIHtcbiAgICAgICAgICByZXR1cm4gdGVzdEpvYlNjaGVtYS5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bih7IGRhdGEgfTogUGFyc2VkSm9iPFRlc3RKb2JEYXRhPik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgIHJlc3VsdHMuYWRkKGRhdGEuYSArIGRhdGEuYik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYWRkUXVldWUgPSBuZXcgUXVldWUoe1xuICAgICAgICBzdG9yZSxcbiAgICAgICAgcXVldWVUeXBlOiAndGVzdCBhZGQgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogMSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc3VsdHMsIG5ldyBTZXQoKSk7XG4gICAgICBhc3NlcnQuaXNFbXB0eShzdG9yZS5zdG9yZWRKb2JzKTtcblxuICAgICAgYWRkUXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICBzdG9yZS5wYXVzZVN0cmVhbSgndGVzdCBhZGQgcXVldWUnKTtcbiAgICAgIGNvbnN0IGpvYjEgPSBhd2FpdCBhZGRRdWV1ZS5hZGQoeyBhOiAxLCBiOiAyIH0pO1xuICAgICAgY29uc3Qgam9iMiA9IGF3YWl0IGFkZFF1ZXVlLmFkZCh7IGE6IDMsIGI6IDQgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0cywgbmV3IFNldCgpKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihzdG9yZS5zdG9yZWRKb2JzLCAyKTtcblxuICAgICAgc3RvcmUucmVzdW1lU3RyZWFtKCd0ZXN0IGFkZCBxdWV1ZScpO1xuXG4gICAgICBhd2FpdCBqb2IxLmNvbXBsZXRpb247XG4gICAgICBhd2FpdCBqb2IyLmNvbXBsZXRpb247XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0cywgbmV3IFNldChbMywgN10pKTtcbiAgICAgIGFzc2VydC5pc0VtcHR5KHN0b3JlLnN0b3JlZEpvYnMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J5IGRlZmF1bHQsIGtpY2tzIG9mZiBvbmUgam9iIGF0IGEgdGltZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBtYXhBY3RpdmUgPSAwO1xuICAgICAgbGV0IGFjdGl2ZUpvYkNvdW50ID0gMDtcbiAgICAgIGNvbnN0IHVwZGF0ZUFjdGl2ZUpvYkNvdW50ID0gKGluY3JlbWVudEJ5OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgICAgYWN0aXZlSm9iQ291bnQgKz0gaW5jcmVtZW50Qnk7XG4gICAgICAgIG1heEFjdGl2ZSA9IE1hdGgubWF4KGFjdGl2ZUpvYkNvdW50LCBtYXhBY3RpdmUpO1xuICAgICAgfTtcblxuICAgICAgY2xhc3MgUXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxudW1iZXI+IHtcbiAgICAgICAgcGFyc2VEYXRhKGRhdGE6IHVua25vd24pOiBudW1iZXIge1xuICAgICAgICAgIHJldHVybiB6Lm51bWJlcigpLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB1cGRhdGVBY3RpdmVKb2JDb3VudCgxKTtcbiAgICAgICAgICAgIHNsZWVwKDEpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB1cGRhdGVBY3RpdmVKb2JDb3VudCgtMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCk7XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKHtcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3QgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogMTAwLFxuICAgICAgfSk7XG4gICAgICBxdWV1ZS5zdHJlYW1Kb2JzKCk7XG5cbiAgICAgIGNvbnN0IGNyZWF0ZVByb21pc2UxID0gcXVldWUuYWRkKDEpO1xuICAgICAgY29uc3QgY3JlYXRlUHJvbWlzZTIgPSBxdWV1ZS5hZGQoMik7XG4gICAgICBjb25zdCBjcmVhdGVQcm9taXNlMyA9IHF1ZXVlLmFkZCgzKTtcbiAgICAgIGNvbnN0IGNyZWF0ZVByb21pc2U0ID0gcXVldWUuYWRkKDQpO1xuXG4gICAgICBjb25zdCB7IGNvbXBsZXRpb246IHByb21pc2UxIH0gPSBhd2FpdCBjcmVhdGVQcm9taXNlMTtcbiAgICAgIGNvbnN0IHsgY29tcGxldGlvbjogcHJvbWlzZTIgfSA9IGF3YWl0IGNyZWF0ZVByb21pc2UyO1xuICAgICAgY29uc3QgeyBjb21wbGV0aW9uOiBwcm9taXNlMyB9ID0gYXdhaXQgY3JlYXRlUHJvbWlzZTM7XG4gICAgICBjb25zdCB7IGNvbXBsZXRpb246IHByb21pc2U0IH0gPSBhd2FpdCBjcmVhdGVQcm9taXNlNDtcblxuICAgICAgYXdhaXQgcHJvbWlzZTE7XG4gICAgICBhd2FpdCBwcm9taXNlMjtcbiAgICAgIGF3YWl0IHByb21pc2UzO1xuICAgICAgYXdhaXQgcHJvbWlzZTQ7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCgxLCBtYXhBY3RpdmUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbiBvdmVycmlkZSB0aGUgaW4tbWVtb3J5IHF1ZXVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGpvYnNBZGRlZCA9IDA7XG4gICAgICBjb25zdCB0ZXN0UXVldWUgPSBuZXcgUFF1ZXVlKCk7XG4gICAgICB0ZXN0UXVldWUub24oJ2FkZCcsICgpID0+IHtcbiAgICAgICAgam9ic0FkZGVkICs9IDE7XG4gICAgICB9KTtcblxuICAgICAgY2xhc3MgUXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxudW1iZXI+IHtcbiAgICAgICAgcGFyc2VEYXRhKGRhdGE6IHVua25vd24pOiBudW1iZXIge1xuICAgICAgICAgIHJldHVybiB6Lm51bWJlcigpLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldEluTWVtb3J5UXVldWUoXG4gICAgICAgICAgcGFyc2VkSm9iOiBQYXJzZWRKb2I8bnVtYmVyPlxuICAgICAgICApOiBQUXVldWUge1xuICAgICAgICAgIGFzc2VydChcbiAgICAgICAgICAgIG5ldyBTZXQoWzEsIDIsIDMsIDRdKS5oYXMocGFyc2VkSm9iLmRhdGEpLFxuICAgICAgICAgICAgJ0JhZCBkYXRhIHBhc3NlZCB0byBgZ2V0SW5NZW1vcnlRdWV1ZWAnXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gdGVzdFF1ZXVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBUZXN0Sm9iUXVldWVTdG9yZSgpO1xuXG4gICAgICBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IHF1ZXVlJyxcbiAgICAgICAgbWF4QXR0ZW1wdHM6IDEwMCxcbiAgICAgIH0pO1xuICAgICAgcXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICBjb25zdCBqb2JzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBxdWV1ZS5hZGQoMSksXG4gICAgICAgIHF1ZXVlLmFkZCgyKSxcbiAgICAgICAgcXVldWUuYWRkKDMpLFxuICAgICAgICBxdWV1ZS5hZGQoNCksXG4gICAgICBdKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGpvYnMubWFwKGpvYiA9PiBqb2IuY29tcGxldGlvbikpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoam9ic0FkZGVkLCA0KTtcbiAgICB9KTtcblxuICAgIGl0KCd3cml0ZXMgam9icyB0byB0aGUgZGF0YWJhc2UgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKTtcblxuICAgICAgY2xhc3MgVGVzdFF1ZXVlIGV4dGVuZHMgSm9iUXVldWU8c3RyaW5nPiB7XG4gICAgICAgIHBhcnNlRGF0YShkYXRhOiB1bmtub3duKTogc3RyaW5nIHtcbiAgICAgICAgICByZXR1cm4gei5zdHJpbmcoKS5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVldWUxID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IDEnLFxuICAgICAgICBtYXhBdHRlbXB0czogMSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcXVldWUyID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IDInLFxuICAgICAgICBtYXhBdHRlbXB0czogMSxcbiAgICAgIH0pO1xuXG4gICAgICBzdG9yZS5wYXVzZVN0cmVhbSgndGVzdCAxJyk7XG4gICAgICBzdG9yZS5wYXVzZVN0cmVhbSgndGVzdCAyJyk7XG5cbiAgICAgIHF1ZXVlMS5zdHJlYW1Kb2JzKCk7XG4gICAgICBxdWV1ZTIuc3RyZWFtSm9icygpO1xuXG4gICAgICBhd2FpdCBxdWV1ZTEuYWRkKCdvbmUnKTtcbiAgICAgIGF3YWl0IHF1ZXVlMi5hZGQoJ0EnKTtcbiAgICAgIGF3YWl0IHF1ZXVlMS5hZGQoJ3R3bycpO1xuICAgICAgYXdhaXQgcXVldWUyLmFkZCgnQicpO1xuICAgICAgYXdhaXQgcXVldWUxLmFkZCgndGhyZWUnKTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLnN0b3JlZEpvYnMsIDUpO1xuXG4gICAgICBjb25zdCBpZHMgPSBzdG9yZS5zdG9yZWRKb2JzLm1hcChqb2IgPT4gam9iLmlkKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihcbiAgICAgICAgc3RvcmUuc3RvcmVkSm9icyxcbiAgICAgICAgbmV3IFNldChpZHMpLnNpemUsXG4gICAgICAgICdFeHBlY3RlZCBldmVyeSBqb2IgdG8gaGF2ZSBhIHVuaXF1ZSBJRCdcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHRpbWVzdGFtcHMgPSBzdG9yZS5zdG9yZWRKb2JzLm1hcChqb2IgPT4gam9iLnRpbWVzdGFtcCk7XG4gICAgICB0aW1lc3RhbXBzLmZvckVhY2godGltZXN0YW1wID0+IHtcbiAgICAgICAgYXNzZXJ0LmFwcHJveGltYXRlbHkoXG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIERhdGUubm93KCksXG4gICAgICAgICAgMzAwMCxcbiAgICAgICAgICAnRXhwZWN0ZWQgdGhlIHRpbWVzdGFtcCB0byBiZSB+bm93J1xuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRhdGFzID0gc3RvcmUuc3RvcmVkSm9icy5tYXAoam9iID0+IGpvYi5kYXRhKTtcbiAgICAgIGFzc2VydC5zYW1lTWVtYmVycyhcbiAgICAgICAgZGF0YXMsXG4gICAgICAgIFsndGhyZWUnLCAndHdvJywgJ29uZScsICdBJywgJ0InXSxcbiAgICAgICAgXCJFeHBlY3RlZCBldmVyeSBqb2IncyBkYXRhIHRvIGJlIHN0b3JlZFwiXG4gICAgICApO1xuXG4gICAgICBjb25zdCBxdWV1ZVR5cGVzID0gZ3JvdXBCeShzdG9yZS5zdG9yZWRKb2JzLCAncXVldWVUeXBlJyk7XG4gICAgICBhc3NlcnQuaGFzQWxsS2V5cyhxdWV1ZVR5cGVzLCBbJ3Rlc3QgMScsICd0ZXN0IDInXSk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YocXVldWVUeXBlc1sndGVzdCAxJ10sIDMpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHF1ZXVlVHlwZXNbJ3Rlc3QgMiddLCAyKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gb3ZlcnJpZGUgdGhlIGluc2VydGlvbiBsb2dpYywgc2tpcHBpbmcgc3RvcmFnZSBwZXJzaXN0ZW5jZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCk7XG5cbiAgICAgIGNsYXNzIFRlc3RRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPHN0cmluZz4ge1xuICAgICAgICBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IHN0cmluZyB7XG4gICAgICAgICAgcmV0dXJuIHouc3RyaW5nKCkucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IHF1ZXVlJyxcbiAgICAgICAgbWF4QXR0ZW1wdHM6IDEsXG4gICAgICB9KTtcblxuICAgICAgcXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICBjb25zdCBpbnNlcnQgPSBzaW5vbi5zdHViKCkucmVzb2x2ZXMoKTtcblxuICAgICAgYXdhaXQgcXVldWUuYWRkKCdmb28gYmFyJywgaW5zZXJ0KTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLnN0b3JlZEpvYnMsIDApO1xuXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZShpbnNlcnQpO1xuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgoXG4gICAgICAgIGluc2VydCxcbiAgICAgICAgc2lub24ubWF0Y2goe1xuICAgICAgICAgIGlkOiBzaW5vbi5tYXRjaC5zdHJpbmcsXG4gICAgICAgICAgdGltZXN0YW1wOiBzaW5vbi5tYXRjaC5udW1iZXIsXG4gICAgICAgICAgcXVldWVUeXBlOiAndGVzdCBxdWV1ZScsXG4gICAgICAgICAgZGF0YTogJ2ZvbyBiYXInLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXRyaWVzIGpvYnMsIHJ1bm5pbmcgdGhlbSB1cCB0byBtYXhBdHRlbXB0cyB0aW1lcycsIGFzeW5jICgpID0+IHtcbiAgICAgIHR5cGUgVGVzdEpvYkRhdGEgPSAnZm9vJyB8ICdiYXInO1xuXG4gICAgICBsZXQgZm9vQXR0ZW1wdHMgPSAwO1xuICAgICAgbGV0IGJhckF0dGVtcHRzID0gMDtcbiAgICAgIGxldCBmb29TdWNjZWVkZWQgPSBmYWxzZTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKTtcblxuICAgICAgY2xhc3MgUmV0cnlRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPFRlc3RKb2JEYXRhPiB7XG4gICAgICAgIHBhcnNlRGF0YShkYXRhOiB1bmtub3duKTogVGVzdEpvYkRhdGEge1xuICAgICAgICAgIGlmIChkYXRhICE9PSAnZm9vJyAmJiBkYXRhICE9PSAnYmFyJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRhdGEnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oeyBkYXRhIH06IFBhcnNlZEpvYjxUZXN0Sm9iRGF0YT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICBzd2l0Y2ggKGRhdGEpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Zvbyc6XG4gICAgICAgICAgICAgIGZvb0F0dGVtcHRzICs9IDE7XG4gICAgICAgICAgICAgIGlmIChmb29BdHRlbXB0cyA8IDMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAnZm9vIGpvYiBzaG91bGQgZmFpbCB0aGUgZmlyc3QgYW5kIHNlY29uZCB0aW1lJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9vU3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdiYXInOlxuICAgICAgICAgICAgICBiYXJBdHRlbXB0cyArPSAxO1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhciBqb2IgYWx3YXlzIGZhaWxzIGluIHRoaXMgdGVzdCcpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJldHJ5UXVldWUgPSBuZXcgUmV0cnlRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IHJldHJ5IHF1ZXVlJyxcbiAgICAgICAgbWF4QXR0ZW1wdHM6IDUsXG4gICAgICB9KTtcblxuICAgICAgcmV0cnlRdWV1ZS5zdHJlYW1Kb2JzKCk7XG5cbiAgICAgIGF3YWl0IChcbiAgICAgICAgYXdhaXQgcmV0cnlRdWV1ZS5hZGQoJ2ZvbycpXG4gICAgICApLmNvbXBsZXRpb247XG5cbiAgICAgIGxldCBib29FcnI6IHVua25vd247XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCAoXG4gICAgICAgICAgYXdhaXQgcmV0cnlRdWV1ZS5hZGQoJ2JhcicpXG4gICAgICAgICkuY29tcGxldGlvbjtcbiAgICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xuICAgICAgICBib29FcnIgPSBlcnI7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChmb29BdHRlbXB0cywgMyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGZvb1N1Y2NlZWRlZCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChiYXJBdHRlbXB0cywgNSk7XG5cbiAgICAgIC8vIENoYWkncyBgYXNzZXJ0Lmluc3RhbmNlT2ZgIGRvZXNuJ3QgdGVsbCBUeXBlU2NyaXB0IGFueXRoaW5nLCBzbyB3ZSBkbyBpdCBoZXJlLlxuICAgICAgaWYgKCEoYm9vRXJyIGluc3RhbmNlb2YgSm9iRXJyb3IpKSB7XG4gICAgICAgIGFzc2VydC5mYWlsKCdFeHBlY3RlZCBlcnJvciB0byBiZSBhIEpvYkVycm9yJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFzc2VydC5pbmNsdWRlKGJvb0Vyci5tZXNzYWdlLCAnYmFyIGpvYiBhbHdheXMgZmFpbHMgaW4gdGhpcyB0ZXN0Jyk7XG5cbiAgICAgIGFzc2VydC5pc0VtcHR5KHN0b3JlLnN0b3JlZEpvYnMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Bhc3NlcyB0aGUgYXR0ZW1wdCBudW1iZXIgdG8gdGhlIHJ1biBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGF0dGVtcHRzOiBBcnJheTxudW1iZXI+ID0gW107XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCk7XG5cbiAgICAgIGNsYXNzIFRlc3RRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPHN0cmluZz4ge1xuICAgICAgICBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IHN0cmluZyB7XG4gICAgICAgICAgcmV0dXJuIHouc3RyaW5nKCkucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oXG4gICAgICAgICAgXzogdW5rbm93bixcbiAgICAgICAgICB7IGF0dGVtcHQgfTogUmVhZG9ubHk8eyBhdHRlbXB0OiBudW1iZXIgfT5cbiAgICAgICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoaXMgam9iIGFsd2F5cyBmYWlscycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0JyxcbiAgICAgICAgbWF4QXR0ZW1wdHM6IDYsXG4gICAgICB9KTtcblxuICAgICAgcXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCAoXG4gICAgICAgICAgYXdhaXQgcXVldWUuYWRkKCdmb28nKVxuICAgICAgICApLmNvbXBsZXRpb247XG4gICAgICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcbiAgICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdG8gZmFpbC5cbiAgICAgIH1cblxuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChhdHRlbXB0cywgWzEsIDIsIDMsIDQsIDUsIDZdKTtcbiAgICB9KTtcblxuICAgIGl0KCdwYXNzZXMgYSBsb2dnZXIgdG8gdGhlIHJ1biBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVuaXF1ZVN0cmluZyA9IHV1aWQoKTtcblxuICAgICAgY29uc3QgZmFrZUxvZ2dlciA9IHtcbiAgICAgICAgZmF0YWw6IHNpbm9uLmZha2UoKSxcbiAgICAgICAgZXJyb3I6IHNpbm9uLmZha2UoKSxcbiAgICAgICAgd2Fybjogc2lub24uZmFrZSgpLFxuICAgICAgICBpbmZvOiBzaW5vbi5mYWtlKCksXG4gICAgICAgIGRlYnVnOiBzaW5vbi5mYWtlKCksXG4gICAgICAgIHRyYWNlOiBzaW5vbi5mYWtlKCksXG4gICAgICB9O1xuXG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxudW1iZXI+IHtcbiAgICAgICAgcGFyc2VEYXRhKGRhdGE6IHVua25vd24pOiBudW1iZXIge1xuICAgICAgICAgIHJldHVybiB6Lm51bWJlcigpLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgcnVuKFxuICAgICAgICAgIF86IHVua25vd24sXG4gICAgICAgICAgeyBsb2cgfTogUmVhZG9ubHk8eyBsb2c6IExvZ2dlclR5cGUgfT5cbiAgICAgICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgbG9nLmluZm8odW5pcXVlU3RyaW5nKTtcbiAgICAgICAgICBsb2cud2Fybih1bmlxdWVTdHJpbmcpO1xuICAgICAgICAgIGxvZy5lcnJvcih1bmlxdWVTdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlOiBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKSxcbiAgICAgICAgcXVldWVUeXBlOiAndGVzdCBxdWV1ZSAxMjMnLFxuICAgICAgICBtYXhBdHRlbXB0czogNixcbiAgICAgICAgbG9nZ2VyOiBmYWtlTG9nZ2VyLFxuICAgICAgfSk7XG5cbiAgICAgIHF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgY29uc3Qgam9iID0gYXdhaXQgcXVldWUuYWRkKDEpO1xuICAgICAgYXdhaXQgam9iLmNvbXBsZXRpb247XG5cbiAgICAgIFtmYWtlTG9nZ2VyLmluZm8sIGZha2VMb2dnZXIud2FybiwgZmFrZUxvZ2dlci5lcnJvcl0uZm9yRWFjaChsb2dGbiA9PiB7XG4gICAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKFxuICAgICAgICAgIGxvZ0ZuLFxuICAgICAgICAgIHNpbm9uLm1hdGNoKFxuICAgICAgICAgICAgKGFyZzogdW5rbm93bikgPT5cbiAgICAgICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgICAgYXJnLmluY2x1ZGVzKGpvYi5pZCkgJiZcbiAgICAgICAgICAgICAgYXJnLmluY2x1ZGVzKCd0ZXN0IHF1ZXVlIDEyMycpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBzaW5vbi5tYXRjaChcbiAgICAgICAgICAgIChhcmc6IHVua25vd24pID0+XG4gICAgICAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnICYmIGFyZy5pbmNsdWRlcyh1bmlxdWVTdHJpbmcpXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbWFrZXMgam9iLmNvbXBsZXRpb24gcmVqZWN0IGlmIHBhcnNlRGF0YSB0aHJvd3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxzdHJpbmc+IHtcbiAgICAgICAgcGFyc2VEYXRhKGRhdGE6IHVua25vd24pOiBzdHJpbmcge1xuICAgICAgICAgIGlmIChkYXRhID09PSAndmFsaWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1aCBvaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWV1ZSA9IG5ldyBUZXN0UXVldWUoe1xuICAgICAgICBzdG9yZTogbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCksXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3QgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogOTk5LFxuICAgICAgfSk7XG5cbiAgICAgIHF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgY29uc3Qgam9iID0gYXdhaXQgcXVldWUuYWRkKCd0aGlzIHdpbGwgZmFpbCB0byBwYXJzZScpO1xuXG4gICAgICBsZXQgam9iRXJyb3I6IHVua25vd247XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBqb2IuY29tcGxldGlvbjtcbiAgICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xuICAgICAgICBqb2JFcnJvciA9IGVycjtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hhaSdzIGBhc3NlcnQuaW5zdGFuY2VPZmAgZG9lc24ndCB0ZWxsIFR5cGVTY3JpcHQgYW55dGhpbmcsIHNvIHdlIGRvIGl0IGhlcmUuXG4gICAgICBpZiAoIShqb2JFcnJvciBpbnN0YW5jZW9mIEpvYkVycm9yKSkge1xuICAgICAgICBhc3NlcnQuZmFpbCgnRXhwZWN0ZWQgZXJyb3IgdG8gYmUgYSBKb2JFcnJvcicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhc3NlcnQuaW5jbHVkZShcbiAgICAgICAgam9iRXJyb3IubWVzc2FnZSxcbiAgICAgICAgJ0ZhaWxlZCB0byBwYXJzZSBqb2IgZGF0YS4gV2FzIHVuZXhwZWN0ZWQgZGF0YSBsb2FkZWQgZnJvbSB0aGUgZGF0YWJhc2U/J1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KFwiZG9lc24ndCBydW4gdGhlIGpvYiBpZiBwYXJzZURhdGEgdGhyb3dzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJ1biA9IHNpbm9uLnN0dWIoKS5yZXNvbHZlcygpO1xuXG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTxzdHJpbmc+IHtcbiAgICAgICAgcGFyc2VEYXRhKGRhdGE6IHVua25vd24pOiBzdHJpbmcge1xuICAgICAgICAgIGlmIChkYXRhID09PSAndmFsaWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBydW4oam9iOiB7IGRhdGE6IHN0cmluZyB9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgcmV0dXJuIHJ1bihqb2IpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlOiBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKSxcbiAgICAgICAgcXVldWVUeXBlOiAndGVzdCBxdWV1ZScsXG4gICAgICAgIG1heEF0dGVtcHRzOiA5OTksXG4gICAgICB9KTtcblxuICAgICAgcXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICAoYXdhaXQgcXVldWUuYWRkKCdpbnZhbGlkJykpLmNvbXBsZXRpb24uY2F0Y2gobm9vcCk7XG4gICAgICAoYXdhaXQgcXVldWUuYWRkKCdpbnZhbGlkJykpLmNvbXBsZXRpb24uY2F0Y2gobm9vcCk7XG4gICAgICBhd2FpdCBxdWV1ZS5hZGQoJ3ZhbGlkJyk7XG4gICAgICAoYXdhaXQgcXVldWUuYWRkKCdpbnZhbGlkJykpLmNvbXBsZXRpb24uY2F0Y2gobm9vcCk7XG4gICAgICAoYXdhaXQgcXVldWUuYWRkKCdpbnZhbGlkJykpLmNvbXBsZXRpb24uY2F0Y2gobm9vcCk7XG5cbiAgICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlKHJ1bik7XG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aE1hdGNoKHJ1biwgeyBkYXRhOiAndmFsaWQnIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RlbGV0ZXMgam9icyBmcm9tIHN0b3JhZ2UgaWYgcGFyc2VEYXRhIHRocm93cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCk7XG5cbiAgICAgIGNsYXNzIFRlc3RRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPHN0cmluZz4ge1xuICAgICAgICBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IHN0cmluZyB7XG4gICAgICAgICAgaWYgKGRhdGEgPT09ICd2YWxpZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVldWUgPSBuZXcgVGVzdFF1ZXVlKHtcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3QgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogOTk5LFxuICAgICAgfSk7XG5cbiAgICAgIHF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgYXdhaXQgKGF3YWl0IHF1ZXVlLmFkZCgnaW52YWxpZCAxJykpLmNvbXBsZXRpb24uY2F0Y2gobm9vcCk7XG4gICAgICBhd2FpdCAoYXdhaXQgcXVldWUuYWRkKCdpbnZhbGlkIDInKSkuY29tcGxldGlvbi5jYXRjaChub29wKTtcbiAgICAgIGF3YWl0IHF1ZXVlLmFkZCgndmFsaWQnKTtcblxuICAgICAgY29uc3QgZGF0YXMgPSBzdG9yZS5zdG9yZWRKb2JzLm1hcChqb2IgPT4gam9iLmRhdGEpO1xuICAgICAgYXNzZXJ0LnNhbWVNZW1iZXJzKGRhdGFzLCBbJ3ZhbGlkJ10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZGluZyB0aGUgam9iIHJlc29sdmVzIEFGVEVSIGluc2VydGluZyB0aGUgam9iIGludG8gdGhlIGRhdGFiYXNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGluc2VydGVkID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFRlc3RKb2JRdWV1ZVN0b3JlKCk7XG4gICAgICBzdG9yZS5ldmVudHMub24oJ2luc2VydCcsICgpID0+IHtcbiAgICAgICAgaW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIGNsYXNzIFRlc3RRdWV1ZSBleHRlbmRzIEpvYlF1ZXVlPHVuZGVmaW5lZD4ge1xuICAgICAgICBwYXJzZURhdGEoXzogdW5rbm93bik6IHVuZGVmaW5lZCB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVldWUgPSBuZXcgVGVzdFF1ZXVlKHtcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3QgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogOTk5LFxuICAgICAgfSk7XG5cbiAgICAgIHF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgY29uc3QgYWRkUHJvbWlzZSA9IHF1ZXVlLmFkZCh1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoaW5zZXJ0ZWQpO1xuXG4gICAgICBhd2FpdCBhZGRQcm9taXNlO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpbnNlcnRlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RhcnRzIHRoZSBqb2IgQUZURVIgaW5zZXJ0aW5nIHRoZSBqb2IgaW50byB0aGUgZGF0YWJhc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudHM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKTtcbiAgICAgIHN0b3JlLmV2ZW50cy5vbignaW5zZXJ0JywgKCkgPT4ge1xuICAgICAgICBldmVudHMucHVzaCgnaW5zZXJ0Jyk7XG4gICAgICB9KTtcblxuICAgICAgY2xhc3MgVGVzdFF1ZXVlIGV4dGVuZHMgSm9iUXVldWU8dW5rbm93bj4ge1xuICAgICAgICBwYXJzZURhdGEoZGF0YTogdW5rbm93bik6IHVua25vd24ge1xuICAgICAgICAgIGV2ZW50cy5wdXNoKCdwYXJzaW5nIGRhdGEnKTtcbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICBldmVudHMucHVzaCgncnVubmluZycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IHF1ZXVlJyxcbiAgICAgICAgbWF4QXR0ZW1wdHM6IDk5OSxcbiAgICAgIH0pO1xuXG4gICAgICBxdWV1ZS5zdHJlYW1Kb2JzKCk7XG5cbiAgICAgIGF3YWl0IChcbiAgICAgICAgYXdhaXQgcXVldWUuYWRkKDEyMylcbiAgICAgICkuY29tcGxldGlvbjtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChldmVudHMsIFsnaW5zZXJ0JywgJ3BhcnNpbmcgZGF0YScsICdydW5uaW5nJ10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Jlc29sdmVzIGpvYi5jb21wbGV0aW9uIEFGVEVSIGRlbGV0aW5nIHRoZSBqb2IgZnJvbSB0aGUgZGF0YWJhc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudHM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgVGVzdEpvYlF1ZXVlU3RvcmUoKTtcbiAgICAgIHN0b3JlLmV2ZW50cy5vbignZGVsZXRlJywgKCkgPT4ge1xuICAgICAgICBldmVudHMucHVzaCgnZGVsZXRlJyk7XG4gICAgICB9KTtcblxuICAgICAgY2xhc3MgVGVzdFF1ZXVlIGV4dGVuZHMgSm9iUXVldWU8dW5kZWZpbmVkPiB7XG4gICAgICAgIHBhcnNlRGF0YShfOiB1bmtub3duKTogdW5kZWZpbmVkIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWV1ZSA9IG5ldyBUZXN0UXVldWUoe1xuICAgICAgICBzdG9yZSxcbiAgICAgICAgcXVldWVUeXBlOiAndGVzdCBxdWV1ZScsXG4gICAgICAgIG1heEF0dGVtcHRzOiA5OTksXG4gICAgICB9KTtcblxuICAgICAgcXVldWUuc3RyZWFtSm9icygpO1xuXG4gICAgICBzdG9yZS5wYXVzZVN0cmVhbSgndGVzdCBxdWV1ZScpO1xuICAgICAgY29uc3Qgam9iID0gYXdhaXQgcXVldWUuYWRkKHVuZGVmaW5lZCk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbW9yZS9uby10aGVuXG4gICAgICBjb25zdCBqb2JDb21wbGV0aW9uUHJvbWlzZSA9IGpvYi5jb21wbGV0aW9uLnRoZW4oKCkgPT4ge1xuICAgICAgICBldmVudHMucHVzaCgncmVzb2x2ZWQnKTtcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLnN0b3JlZEpvYnMsIDEpO1xuXG4gICAgICBzdG9yZS5yZXN1bWVTdHJlYW0oJ3Rlc3QgcXVldWUnKTtcblxuICAgICAgYXdhaXQgam9iQ29tcGxldGlvblByb21pc2U7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZXZlbnRzLCBbJ2RlbGV0ZScsICdyZXNvbHZlZCddKTtcbiAgICB9KTtcblxuICAgIGl0KCdpZiB0aGUgam9iIGZhaWxzIGFmdGVyIGV2ZXJ5IGF0dGVtcHQsIHJlamVjdHMgam9iLmNvbXBsZXRpb24gQUZURVIgZGVsZXRpbmcgdGhlIGpvYiBmcm9tIHRoZSBkYXRhYmFzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50czogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBUZXN0Sm9iUXVldWVTdG9yZSgpO1xuICAgICAgc3RvcmUuZXZlbnRzLm9uKCdkZWxldGUnLCAoKSA9PiB7XG4gICAgICAgIGV2ZW50cy5wdXNoKCdkZWxldGUnKTtcbiAgICAgIH0pO1xuXG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTx1bmRlZmluZWQ+IHtcbiAgICAgICAgcGFyc2VEYXRhKF86IHVua25vd24pOiB1bmRlZmluZWQge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgZXZlbnRzLnB1c2goJ3J1bm5pbmcnKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VoIG9oJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVldWUgPSBuZXcgVGVzdFF1ZXVlKHtcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3QgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogNSxcbiAgICAgIH0pO1xuXG4gICAgICBxdWV1ZS5zdHJlYW1Kb2JzKCk7XG5cbiAgICAgIHN0b3JlLnBhdXNlU3RyZWFtKCd0ZXN0IHF1ZXVlJyk7XG4gICAgICBjb25zdCBqb2IgPSBhd2FpdCBxdWV1ZS5hZGQodW5kZWZpbmVkKTtcbiAgICAgIGNvbnN0IGpvYkNvbXBsZXRpb25Qcm9taXNlID0gam9iLmNvbXBsZXRpb24uY2F0Y2goKCkgPT4ge1xuICAgICAgICBldmVudHMucHVzaCgncmVqZWN0ZWQnKTtcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLnN0b3JlZEpvYnMsIDEpO1xuXG4gICAgICBzdG9yZS5yZXN1bWVTdHJlYW0oJ3Rlc3QgcXVldWUnKTtcblxuICAgICAgYXdhaXQgam9iQ29tcGxldGlvblByb21pc2U7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZXZlbnRzLCBbXG4gICAgICAgICdydW5uaW5nJyxcbiAgICAgICAgJ3J1bm5pbmcnLFxuICAgICAgICAncnVubmluZycsXG4gICAgICAgICdydW5uaW5nJyxcbiAgICAgICAgJ3J1bm5pbmcnLFxuICAgICAgICAnZGVsZXRlJyxcbiAgICAgICAgJ3JlamVjdGVkJyxcbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3RyZWFtSm9icycsICgpID0+IHtcbiAgICBjb25zdCBzdG9yZWRKb2JTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgICBpZDogei5zdHJpbmcoKSxcbiAgICAgIHRpbWVzdGFtcDogei5udW1iZXIoKSxcbiAgICAgIHF1ZXVlVHlwZTogei5zdHJpbmcoKSxcbiAgICAgIGRhdGE6IHoudW5rbm93bigpLFxuICAgIH0pO1xuXG4gICAgY2xhc3MgRmFrZVN0cmVhbSBpbXBsZW1lbnRzIEFzeW5jSXRlcmFibGU8U3RvcmVkSm9iPiB7XG4gICAgICBwcml2YXRlIGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgICAgYXN5bmMgKltTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKSB7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICBjb25zdCBbam9iXSA9IGF3YWl0IG9uY2UodGhpcy5ldmVudEVtaXR0ZXIsICdkcmlwJyk7XG4gICAgICAgICAgeWllbGQgc3RvcmVkSm9iU2NoZW1hLnBhcnNlKGpvYik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZHJpcChqb2I6IFJlYWRvbmx5PFN0b3JlZEpvYj4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgnZHJpcCcsIGpvYik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGZha2VTdHJlYW06IEZha2VTdHJlYW07XG4gICAgbGV0IGZha2VTdG9yZTogSm9iUXVldWVTdG9yZTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZmFrZVN0cmVhbSA9IG5ldyBGYWtlU3RyZWFtKCk7XG4gICAgICBmYWtlU3RvcmUgPSB7XG4gICAgICAgIGluc2VydDogc2lub24uc3R1YigpLnJlc29sdmVzKCksXG4gICAgICAgIGRlbGV0ZTogc2lub24uc3R1YigpLnJlc29sdmVzKCksXG4gICAgICAgIHN0cmVhbTogc2lub24uc3R1YigpLnJldHVybnMoZmFrZVN0cmVhbSksXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0YXJ0cyBzdHJlYW1pbmcgam9icyBmcm9tIHRoZSBzdG9yZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgICAgY2xhc3MgVGVzdFF1ZXVlIGV4dGVuZHMgSm9iUXVldWU8bnVtYmVyPiB7XG4gICAgICAgIHBhcnNlRGF0YShkYXRhOiB1bmtub3duKTogbnVtYmVyIHtcbiAgICAgICAgICByZXR1cm4gei5udW1iZXIoKS5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIHJ1bih7IGRhdGEgfTogUmVhZG9ubHk8eyBkYXRhOiBudW1iZXIgfT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICBldmVudEVtaXR0ZXIuZW1pdCgncnVuJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9vcFF1ZXVlID0gbmV3IFRlc3RRdWV1ZSh7XG4gICAgICAgIHN0b3JlOiBmYWtlU3RvcmUsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3Qgbm9vcCBxdWV1ZScsXG4gICAgICAgIG1heEF0dGVtcHRzOiA5OSxcbiAgICAgIH0pO1xuXG4gICAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGZha2VTdG9yZS5zdHJlYW0gYXMgc2lub24uU2lub25TdHViKTtcblxuICAgICAgbm9vcFF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZmFrZVN0b3JlLnN0cmVhbSBhcyBzaW5vbi5TaW5vblN0dWIpO1xuXG4gICAgICBmYWtlU3RyZWFtLmRyaXAoe1xuICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3Qgbm9vcCBxdWV1ZScsXG4gICAgICAgIGRhdGE6IDEyMyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgW2ZpcnN0UnVuRGF0YV0gPSBhd2FpdCBvbmNlKGV2ZW50RW1pdHRlciwgJ3J1bicpO1xuXG4gICAgICBmYWtlU3RyZWFtLmRyaXAoe1xuICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIHF1ZXVlVHlwZTogJ3Rlc3Qgbm9vcCBxdWV1ZScsXG4gICAgICAgIGRhdGE6IDQ1NixcbiAgICAgIH0pO1xuICAgICAgY29uc3QgW3NlY29uZFJ1bkRhdGFdID0gYXdhaXQgb25jZShldmVudEVtaXR0ZXIsICdydW4nKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGZpcnN0UnVuRGF0YSwgMTIzKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzZWNvbmRSdW5EYXRhLCA0NTYpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlamVjdHMgd2hlbiBjYWxsZWQgbW9yZSB0aGFuIG9uY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTx1bmtub3duPiB7XG4gICAgICAgIHBhcnNlRGF0YShkYXRhOiB1bmtub3duKTogdW5rbm93biB7XG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vb3BRdWV1ZSA9IG5ldyBUZXN0UXVldWUoe1xuICAgICAgICBzdG9yZTogZmFrZVN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IG5vb3AgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogOTksXG4gICAgICB9KTtcblxuICAgICAgbm9vcFF1ZXVlLnN0cmVhbUpvYnMoKTtcblxuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQobm9vcFF1ZXVlLnN0cmVhbUpvYnMoKSk7XG4gICAgICBhd2FpdCBhc3NlcnQuaXNSZWplY3RlZChub29wUXVldWUuc3RyZWFtSm9icygpKTtcblxuICAgICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2UoZmFrZVN0b3JlLnN0cmVhbSBhcyBzaW5vbi5TaW5vblN0dWIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYWRkJywgKCkgPT4ge1xuICAgIGl0KCdyZWplY3RzIGlmIHRoZSBqb2IgcXVldWUgaGFzIG5vdCBzdGFydGVkIHN0cmVhbWluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZha2VTdG9yZSA9IHtcbiAgICAgICAgaW5zZXJ0OiBzaW5vbi5zdHViKCkucmVzb2x2ZXMoKSxcbiAgICAgICAgZGVsZXRlOiBzaW5vbi5zdHViKCkucmVzb2x2ZXMoKSxcbiAgICAgICAgc3RyZWFtOiBzaW5vbi5zdHViKCksXG4gICAgICB9O1xuXG4gICAgICBjbGFzcyBUZXN0UXVldWUgZXh0ZW5kcyBKb2JRdWV1ZTx1bmRlZmluZWQ+IHtcbiAgICAgICAgcGFyc2VEYXRhKF86IHVua25vd24pOiB1bmRlZmluZWQge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vb3BRdWV1ZSA9IG5ldyBUZXN0UXVldWUoe1xuICAgICAgICBzdG9yZTogZmFrZVN0b3JlLFxuICAgICAgICBxdWV1ZVR5cGU6ICd0ZXN0IG5vb3AgcXVldWUnLFxuICAgICAgICBtYXhBdHRlbXB0czogOTksXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgYXNzZXJ0LmlzUmVqZWN0ZWQobm9vcFF1ZXVlLmFkZCh1bmRlZmluZWQpKTtcblxuICAgICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChmYWtlU3RvcmUuc3RyZWFtIGFzIHNpbm9uLlNpbm9uU3R1Yik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBS0Esa0JBQXVCO0FBQ3ZCLFlBQXVCO0FBQ3ZCLG9CQUFtQztBQUNuQyxpQkFBa0I7QUFDbEIsb0JBQThCO0FBQzlCLGtCQUEyQjtBQUMzQixxQkFBbUI7QUFDbkIsc0JBQXlCO0FBQ3pCLCtCQUFrQztBQUNsQyw4QkFBaUM7QUFHakMsc0JBQXlCO0FBRXpCLGtCQUFzQjtBQUV0QixTQUFTLFlBQVksTUFBTTtBQUN6QixXQUFTLG9CQUFvQixNQUFNO0FBQ2pDLE9BQUcsc0VBQXNFLFlBQVk7QUFDbkYsWUFBTSxnQkFBZ0IsYUFBRSxPQUFPO0FBQUEsUUFDN0IsR0FBRyxhQUFFLE9BQU87QUFBQSxRQUNaLEdBQUcsYUFBRSxPQUFPO0FBQUEsTUFDZCxDQUFDO0FBSUQsWUFBTSxVQUFVLG9CQUFJLElBQWE7QUFDakMsWUFBTSxRQUFRLElBQUksMkNBQWtCO0FBRXBDLFlBQU0sY0FBYyx5QkFBc0I7QUFBQSxRQUN4QyxVQUFVLE1BQTRCO0FBQ3BDLGlCQUFPLGNBQWMsTUFBTSxJQUFJO0FBQUEsUUFDakM7QUFBQSxjQUVNLElBQUksRUFBRSxRQUErQztBQUN6RCxrQkFBUSxJQUFJ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
