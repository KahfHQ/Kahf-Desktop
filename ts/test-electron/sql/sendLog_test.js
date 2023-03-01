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
var import_Client = __toESM(require("../../sql/Client"));
var import_UUID = require("../../types/UUID");
var import_Crypto = require("../../Crypto");
function getUuid() {
  return import_UUID.UUID.generate().toString();
}
const {
  _getAllSentProtoMessageIds,
  _getAllSentProtoRecipients,
  deleteSentProtoByMessageId,
  deleteSentProtoRecipient,
  deleteSentProtosOlderThan,
  getAllSentProtos,
  getSentProtoByRecipient,
  insertProtoRecipients,
  insertSentProto,
  removeAllSentProtos,
  removeMessage,
  saveMessage
} = import_Client.default;
describe("sql/sendLog", () => {
  beforeEach(async () => {
    await removeAllSentProtos();
  });
  it("roundtrips with insertSentProto/getAllSentProtos", async () => {
    const bytes = (0, import_Crypto.getRandomBytes)(128);
    const timestamp = Date.now();
    const proto = {
      contentHint: 1,
      proto: bytes,
      timestamp,
      urgent: false
    };
    await insertSentProto(proto, {
      messageIds: [getUuid()],
      recipients: {
        [getUuid()]: [1, 2]
      }
    });
    const allProtos = await getAllSentProtos();
    import_chai.assert.lengthOf(allProtos, 1);
    const actual = allProtos[0];
    import_chai.assert.strictEqual(actual.contentHint, proto.contentHint);
    import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual.proto, proto.proto));
    import_chai.assert.strictEqual(actual.timestamp, proto.timestamp);
    import_chai.assert.strictEqual(actual.urgent, proto.urgent);
    await removeAllSentProtos();
    import_chai.assert.lengthOf(await getAllSentProtos(), 0);
  });
  it("cascades deletes into both tables with foreign keys", async () => {
    import_chai.assert.lengthOf(await getAllSentProtos(), 0);
    import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
    import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
    const bytes = (0, import_Crypto.getRandomBytes)(128);
    const timestamp = Date.now();
    const proto = {
      contentHint: 1,
      proto: bytes,
      timestamp,
      urgent: true
    };
    await insertSentProto(proto, {
      messageIds: [getUuid(), getUuid()],
      recipients: {
        [getUuid()]: [1, 2],
        [getUuid()]: [1]
      }
    });
    const allProtos = await getAllSentProtos();
    import_chai.assert.lengthOf(allProtos, 1);
    const actual = allProtos[0];
    import_chai.assert.strictEqual(actual.contentHint, proto.contentHint);
    import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual.proto, proto.proto));
    import_chai.assert.strictEqual(actual.timestamp, proto.timestamp);
    import_chai.assert.strictEqual(actual.urgent, proto.urgent);
    import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 2);
    import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 3);
    await removeAllSentProtos();
    import_chai.assert.lengthOf(await getAllSentProtos(), 0);
    import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
    import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
  });
  it("trigger deletes payload when referenced message is deleted", async () => {
    const id = getUuid();
    const timestamp = Date.now();
    const ourUuid = getUuid();
    await saveMessage({
      id,
      body: "some text",
      conversationId: getUuid(),
      received_at: timestamp,
      sent_at: timestamp,
      timestamp,
      type: "outgoing"
    }, { forceSave: true, ourUuid });
    const bytes = (0, import_Crypto.getRandomBytes)(128);
    const proto = {
      contentHint: 1,
      proto: bytes,
      timestamp,
      urgent: false
    };
    await insertSentProto(proto, {
      messageIds: [id],
      recipients: {
        [getUuid()]: [1, 2]
      }
    });
    const allProtos = await getAllSentProtos();
    import_chai.assert.lengthOf(allProtos, 1);
    const actual = allProtos[0];
    import_chai.assert.strictEqual(actual.timestamp, proto.timestamp);
    await removeMessage(id);
    import_chai.assert.lengthOf(await getAllSentProtos(), 0);
  });
  describe("#insertSentProto", () => {
    it("supports adding duplicates", async () => {
      const timestamp = Date.now();
      const messageIds = [getUuid()];
      const recipients = {
        [getUuid()]: [1]
      };
      const proto1 = {
        contentHint: 7,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      const proto2 = {
        contentHint: 9,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: false
      };
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
      await insertSentProto(proto1, { messageIds, recipients });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 1);
      await insertSentProto(proto2, { messageIds, recipients });
      import_chai.assert.lengthOf(await getAllSentProtos(), 2);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 2);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
    });
  });
  describe("#insertProtoRecipients", () => {
    it("handles duplicates, adding new recipients if needed", async () => {
      const timestamp = Date.now();
      const messageIds = [getUuid()];
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
      const id = await insertSentProto(proto, {
        messageIds,
        recipients: {
          [getUuid()]: [1]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 1);
      const recipientUuid = getUuid();
      await insertProtoRecipients({
        id,
        recipientUuid,
        deviceIds: [1, 2]
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 3);
    });
  });
  describe("#deleteSentProtosOlderThan", () => {
    it("deletes all older timestamps", async () => {
      const timestamp = Date.now();
      const proto1 = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp: timestamp + 10,
        urgent: true
      };
      const proto2 = {
        contentHint: 2,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      const proto3 = {
        contentHint: 0,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp: timestamp - 15,
        urgent: true
      };
      await insertSentProto(proto1, {
        messageIds: [getUuid()],
        recipients: {
          [getUuid()]: [1]
        }
      });
      await insertSentProto(proto2, {
        messageIds: [getUuid()],
        recipients: {
          [getUuid()]: [1, 2]
        }
      });
      await insertSentProto(proto3, {
        messageIds: [getUuid()],
        recipients: {
          [getUuid()]: [1, 2, 3]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 3);
      await deleteSentProtosOlderThan(timestamp);
      const allProtos = await getAllSentProtos();
      import_chai.assert.lengthOf(allProtos, 2);
      const actual1 = allProtos[0];
      import_chai.assert.strictEqual(actual1.contentHint, proto1.contentHint);
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual1.proto, proto1.proto));
      import_chai.assert.strictEqual(actual1.timestamp, proto1.timestamp);
      const actual2 = allProtos[1];
      import_chai.assert.strictEqual(actual2.contentHint, proto2.contentHint);
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual2.proto, proto2.proto));
      import_chai.assert.strictEqual(actual2.timestamp, proto2.timestamp);
    });
  });
  describe("#deleteSentProtoByMessageId", () => {
    it("deletes all records related to that messageId", async () => {
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
      const messageId = getUuid();
      const timestamp = Date.now();
      const proto1 = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      const proto2 = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp: timestamp - 10,
        urgent: true
      };
      const proto3 = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp: timestamp - 20,
        urgent: true
      };
      await insertSentProto(proto1, {
        messageIds: [messageId, getUuid()],
        recipients: {
          [getUuid()]: [1, 2],
          [getUuid()]: [1]
        }
      });
      await insertSentProto(proto2, {
        messageIds: [messageId],
        recipients: {
          [getUuid()]: [1]
        }
      });
      await insertSentProto(proto3, {
        messageIds: [getUuid()],
        recipients: {
          [getUuid()]: [1]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 3);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 4);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 5);
      await deleteSentProtoByMessageId(messageId);
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 1);
    });
  });
  describe("#deleteSentProtoRecipient", () => {
    it("does not delete payload if recipient remains", async () => {
      const timestamp = Date.now();
      const recipientUuid1 = getUuid();
      const recipientUuid2 = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid1]: [1, 2],
          [recipientUuid2]: [1]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 3);
      await deleteSentProtoRecipient({
        timestamp,
        recipientUuid: recipientUuid1,
        deviceId: 1
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
    });
    it("deletes payload if no recipients remain", async () => {
      const timestamp = Date.now();
      const recipientUuid1 = getUuid();
      const recipientUuid2 = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid1]: [1, 2],
          [recipientUuid2]: [1]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 3);
      await deleteSentProtoRecipient({
        timestamp,
        recipientUuid: recipientUuid1,
        deviceId: 1
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      await deleteSentProtoRecipient({
        timestamp,
        recipientUuid: recipientUuid1,
        deviceId: 2
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 1);
      await deleteSentProtoRecipient({
        timestamp,
        recipientUuid: recipientUuid2,
        deviceId: 1
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
    });
    it("deletes multiple recipients in a single transaction", async () => {
      const timestamp = Date.now();
      const recipientUuid1 = getUuid();
      const recipientUuid2 = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid1]: [1, 2],
          [recipientUuid2]: [1]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 3);
      await deleteSentProtoRecipient([
        {
          timestamp,
          recipientUuid: recipientUuid1,
          deviceId: 1
        },
        {
          timestamp,
          recipientUuid: recipientUuid1,
          deviceId: 2
        },
        {
          timestamp,
          recipientUuid: recipientUuid2,
          deviceId: 1
        }
      ]);
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
    });
  });
  describe("#getSentProtoByRecipient", () => {
    it("returns matching payload", async () => {
      const timestamp = Date.now();
      const recipientUuid = getUuid();
      const messageIds = [getUuid(), getUuid()];
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds,
        recipients: {
          [recipientUuid]: [1, 2]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 2);
      const actual = await getSentProtoByRecipient({
        now: timestamp,
        timestamp,
        recipientUuid
      });
      if (!actual) {
        throw new Error("Failed to fetch proto!");
      }
      import_chai.assert.strictEqual(actual.contentHint, proto.contentHint);
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual.proto, proto.proto));
      import_chai.assert.strictEqual(actual.timestamp, proto.timestamp);
      import_chai.assert.sameMembers(actual.messageIds, messageIds);
    });
    it("returns matching payload with no messageIds", async () => {
      const timestamp = Date.now();
      const recipientUuid = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [],
        recipients: {
          [recipientUuid]: [1, 2]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      import_chai.assert.lengthOf(await _getAllSentProtoMessageIds(), 0);
      const actual = await getSentProtoByRecipient({
        now: timestamp,
        timestamp,
        recipientUuid
      });
      if (!actual) {
        throw new Error("Failed to fetch proto!");
      }
      import_chai.assert.strictEqual(actual.contentHint, proto.contentHint);
      import_chai.assert.isTrue((0, import_Crypto.constantTimeEqual)(actual.proto, proto.proto));
      import_chai.assert.strictEqual(actual.timestamp, proto.timestamp);
      import_chai.assert.deepEqual(actual.messageIds, []);
    });
    it("returns nothing if payload does not have recipient", async () => {
      const timestamp = Date.now();
      const recipientUuid = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid]: [1, 2]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      const actual = await getSentProtoByRecipient({
        now: timestamp,
        timestamp,
        recipientUuid: getUuid()
      });
      import_chai.assert.isUndefined(actual);
    });
    it("returns nothing if timestamp does not match", async () => {
      const timestamp = Date.now();
      const recipientUuid = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid]: [1, 2]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      const actual = await getSentProtoByRecipient({
        now: timestamp,
        timestamp: timestamp + 1,
        recipientUuid
      });
      import_chai.assert.isUndefined(actual);
    });
    it("returns nothing if timestamp proto is too old", async () => {
      const TWO_DAYS = 2 * 24 * 60 * 60 * 1e3;
      const timestamp = Date.now();
      const recipientUuid = getUuid();
      const proto = {
        contentHint: 1,
        proto: (0, import_Crypto.getRandomBytes)(128),
        timestamp,
        urgent: true
      };
      await insertSentProto(proto, {
        messageIds: [getUuid()],
        recipients: {
          [recipientUuid]: [1, 2]
        }
      });
      import_chai.assert.lengthOf(await getAllSentProtos(), 1);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 2);
      const actual = await getSentProtoByRecipient({
        now: timestamp + TWO_DAYS,
        timestamp,
        recipientUuid
      });
      import_chai.assert.isUndefined(actual);
      import_chai.assert.lengthOf(await getAllSentProtos(), 0);
      import_chai.assert.lengthOf(await _getAllSentProtoRecipients(), 0);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZExvZ190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgZGF0YUludGVyZmFjZSBmcm9tICcuLi8uLi9zcWwvQ2xpZW50JztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB0eXBlIHsgVVVJRFN0cmluZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7IGNvbnN0YW50VGltZUVxdWFsLCBnZXRSYW5kb21CeXRlcyB9IGZyb20gJy4uLy4uL0NyeXB0byc7XG5cbmZ1bmN0aW9uIGdldFV1aWQoKTogVVVJRFN0cmluZ1R5cGUge1xuICByZXR1cm4gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG59XG5cbmNvbnN0IHtcbiAgX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMsXG4gIF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzLFxuICBkZWxldGVTZW50UHJvdG9CeU1lc3NhZ2VJZCxcbiAgZGVsZXRlU2VudFByb3RvUmVjaXBpZW50LFxuICBkZWxldGVTZW50UHJvdG9zT2xkZXJUaGFuLFxuICBnZXRBbGxTZW50UHJvdG9zLFxuICBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCxcbiAgaW5zZXJ0UHJvdG9SZWNpcGllbnRzLFxuICBpbnNlcnRTZW50UHJvdG8sXG4gIHJlbW92ZUFsbFNlbnRQcm90b3MsXG4gIHJlbW92ZU1lc3NhZ2UsXG4gIHNhdmVNZXNzYWdlLFxufSA9IGRhdGFJbnRlcmZhY2U7XG5cbmRlc2NyaWJlKCdzcWwvc2VuZExvZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgcmVtb3ZlQWxsU2VudFByb3RvcygpO1xuICB9KTtcblxuICBpdCgncm91bmR0cmlwcyB3aXRoIGluc2VydFNlbnRQcm90by9nZXRBbGxTZW50UHJvdG9zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJ5dGVzID0gZ2V0UmFuZG9tQnl0ZXMoMTI4KTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICBwcm90bzogYnl0ZXMsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvLCB7XG4gICAgICBtZXNzYWdlSWRzOiBbZ2V0VXVpZCgpXSxcbiAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgW2dldFV1aWQoKV06IFsxLCAyXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgYWxsUHJvdG9zID0gYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGFsbFByb3RvcywgMSk7XG4gICAgY29uc3QgYWN0dWFsID0gYWxsUHJvdG9zWzBdO1xuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbC5jb250ZW50SGludCwgcHJvdG8uY29udGVudEhpbnQpO1xuICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoYWN0dWFsLnByb3RvLCBwcm90by5wcm90bykpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwudGltZXN0YW1wLCBwcm90by50aW1lc3RhbXApO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwudXJnZW50LCBwcm90by51cmdlbnQpO1xuXG4gICAgYXdhaXQgcmVtb3ZlQWxsU2VudFByb3RvcygpO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMCk7XG4gIH0pO1xuXG4gIGl0KCdjYXNjYWRlcyBkZWxldGVzIGludG8gYm90aCB0YWJsZXMgd2l0aCBmb3JlaWduIGtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMCk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDApO1xuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAwKTtcblxuICAgIGNvbnN0IGJ5dGVzID0gZ2V0UmFuZG9tQnl0ZXMoMTI4KTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICBwcm90bzogYnl0ZXMsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB1cmdlbnQ6IHRydWUsXG4gICAgfTtcbiAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8sIHtcbiAgICAgIG1lc3NhZ2VJZHM6IFtnZXRVdWlkKCksIGdldFV1aWQoKV0sXG4gICAgICByZWNpcGllbnRzOiB7XG4gICAgICAgIFtnZXRVdWlkKCldOiBbMSwgMl0sXG4gICAgICAgIFtnZXRVdWlkKCldOiBbMV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxsUHJvdG9zID0gYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpO1xuICAgIGFzc2VydC5sZW5ndGhPZihhbGxQcm90b3MsIDEpO1xuICAgIGNvbnN0IGFjdHVhbCA9IGFsbFByb3Rvc1swXTtcblxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwuY29udGVudEhpbnQsIHByb3RvLmNvbnRlbnRIaW50KTtcbiAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGFjdHVhbC5wcm90bywgcHJvdG8ucHJvdG8pKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLnRpbWVzdGFtcCwgcHJvdG8udGltZXN0YW1wKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLnVyZ2VudCwgcHJvdG8udXJnZW50KTtcblxuICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpLCAyKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKSwgMyk7XG5cbiAgICBhd2FpdCByZW1vdmVBbGxTZW50UHJvdG9zKCk7XG5cbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAwKTtcbiAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMoKSwgMCk7XG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDApO1xuICB9KTtcblxuICBpdCgndHJpZ2dlciBkZWxldGVzIHBheWxvYWQgd2hlbiByZWZlcmVuY2VkIG1lc3NhZ2UgaXMgZGVsZXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpZCA9IGdldFV1aWQoKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IG91clV1aWQgPSBnZXRVdWlkKCk7XG5cbiAgICBhd2FpdCBzYXZlTWVzc2FnZShcbiAgICAgIHtcbiAgICAgICAgaWQsXG5cbiAgICAgICAgYm9keTogJ3NvbWUgdGV4dCcsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiBnZXRVdWlkKCksXG4gICAgICAgIHJlY2VpdmVkX2F0OiB0aW1lc3RhbXAsXG4gICAgICAgIHNlbnRfYXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB0eXBlOiAnb3V0Z29pbmcnLFxuICAgICAgfSxcbiAgICAgIHsgZm9yY2VTYXZlOiB0cnVlLCBvdXJVdWlkIH1cbiAgICApO1xuXG4gICAgY29uc3QgYnl0ZXMgPSBnZXRSYW5kb21CeXRlcygxMjgpO1xuICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICBwcm90bzogYnl0ZXMsXG4gICAgICB0aW1lc3RhbXAsXG4gICAgICB1cmdlbnQ6IGZhbHNlLFxuICAgIH07XG4gICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvLCB7XG4gICAgICBtZXNzYWdlSWRzOiBbaWRdLFxuICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICBbZ2V0VXVpZCgpXTogWzEsIDJdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBhbGxQcm90b3MgPSBhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCk7XG5cbiAgICBhc3NlcnQubGVuZ3RoT2YoYWxsUHJvdG9zLCAxKTtcbiAgICBjb25zdCBhY3R1YWwgPSBhbGxQcm90b3NbMF07XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLnRpbWVzdGFtcCwgcHJvdG8udGltZXN0YW1wKTtcblxuICAgIGF3YWl0IHJlbW92ZU1lc3NhZ2UoaWQpO1xuXG4gICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjaW5zZXJ0U2VudFByb3RvJywgKCkgPT4ge1xuICAgIGl0KCdzdXBwb3J0cyBhZGRpbmcgZHVwbGljYXRlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VJZHMgPSBbZ2V0VXVpZCgpXTtcbiAgICAgIGNvbnN0IHJlY2lwaWVudHMgPSB7XG4gICAgICAgIFtnZXRVdWlkKCldOiBbMV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgcHJvdG8xID0ge1xuICAgICAgICBjb250ZW50SGludDogNyxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHByb3RvMiA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDksXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogZmFsc2UsXG4gICAgICB9O1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAwKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpLCAwKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAwKTtcblxuICAgICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvMSwgeyBtZXNzYWdlSWRzLCByZWNpcGllbnRzIH0pO1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAxKTtcblxuICAgICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvMiwgeyBtZXNzYWdlSWRzLCByZWNpcGllbnRzIH0pO1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAyKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpLCAyKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNpbnNlcnRQcm90b1JlY2lwaWVudHMnLCAoKSA9PiB7XG4gICAgaXQoJ2hhbmRsZXMgZHVwbGljYXRlcywgYWRkaW5nIG5ldyByZWNpcGllbnRzIGlmIG5lZWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VJZHMgPSBbZ2V0VXVpZCgpXTtcbiAgICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMCk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMoKSwgMCk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKSwgMCk7XG5cbiAgICAgIGNvbnN0IGlkID0gYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvLCB7XG4gICAgICAgIG1lc3NhZ2VJZHMsXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbZ2V0VXVpZCgpXTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDEpO1xuXG4gICAgICBjb25zdCByZWNpcGllbnRVdWlkID0gZ2V0VXVpZCgpO1xuICAgICAgYXdhaXQgaW5zZXJ0UHJvdG9SZWNpcGllbnRzKHtcbiAgICAgICAgaWQsXG4gICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICAgIGRldmljZUlkczogWzEsIDJdLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDMpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2RlbGV0ZVNlbnRQcm90b3NPbGRlclRoYW4nLCAoKSA9PiB7XG4gICAgaXQoJ2RlbGV0ZXMgYWxsIG9sZGVyIHRpbWVzdGFtcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgICBjb25zdCBwcm90bzEgPSB7XG4gICAgICAgIGNvbnRlbnRIaW50OiAxLFxuICAgICAgICBwcm90bzogZ2V0UmFuZG9tQnl0ZXMoMTI4KSxcbiAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAgKyAxMCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHByb3RvMiA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDIsXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBjb25zdCBwcm90bzMgPSB7XG4gICAgICAgIGNvbnRlbnRIaW50OiAwLFxuICAgICAgICBwcm90bzogZ2V0UmFuZG9tQnl0ZXMoMTI4KSxcbiAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAgLSAxNSxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bzEsIHtcbiAgICAgICAgbWVzc2FnZUlkczogW2dldFV1aWQoKV0sXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbZ2V0VXVpZCgpXTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8yLCB7XG4gICAgICAgIG1lc3NhZ2VJZHM6IFtnZXRVdWlkKCldLFxuICAgICAgICByZWNpcGllbnRzOiB7XG4gICAgICAgICAgW2dldFV1aWQoKV06IFsxLCAyXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvMywge1xuICAgICAgICBtZXNzYWdlSWRzOiBbZ2V0VXVpZCgpXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtnZXRVdWlkKCldOiBbMSwgMiwgM10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMyk7XG5cbiAgICAgIGF3YWl0IGRlbGV0ZVNlbnRQcm90b3NPbGRlclRoYW4odGltZXN0YW1wKTtcblxuICAgICAgY29uc3QgYWxsUHJvdG9zID0gYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGFsbFByb3RvcywgMik7XG5cbiAgICAgIGNvbnN0IGFjdHVhbDEgPSBhbGxQcm90b3NbMF07XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsMS5jb250ZW50SGludCwgcHJvdG8xLmNvbnRlbnRIaW50KTtcbiAgICAgIGFzc2VydC5pc1RydWUoY29uc3RhbnRUaW1lRXF1YWwoYWN0dWFsMS5wcm90bywgcHJvdG8xLnByb3RvKSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsMS50aW1lc3RhbXAsIHByb3RvMS50aW1lc3RhbXApO1xuXG4gICAgICBjb25zdCBhY3R1YWwyID0gYWxsUHJvdG9zWzFdO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbDIuY29udGVudEhpbnQsIHByb3RvMi5jb250ZW50SGludCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGFjdHVhbDIucHJvdG8sIHByb3RvMi5wcm90bykpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbDIudGltZXN0YW1wLCBwcm90bzIudGltZXN0YW1wKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkZWxldGVTZW50UHJvdG9CeU1lc3NhZ2VJZCcsICgpID0+IHtcbiAgICBpdCgnZGVsZXRlcyBhbGwgcmVjb3JkcyByZWxhdGVkIHRvIHRoYXQgbWVzc2FnZUlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMCk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b01lc3NhZ2VJZHMoKSwgMCk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKSwgMCk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VJZCA9IGdldFV1aWQoKTtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgICBjb25zdCBwcm90bzEgPSB7XG4gICAgICAgIGNvbnRlbnRIaW50OiAxLFxuICAgICAgICBwcm90bzogZ2V0UmFuZG9tQnl0ZXMoMTI4KSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB1cmdlbnQ6IHRydWUsXG4gICAgICB9O1xuICAgICAgY29uc3QgcHJvdG8yID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wIC0gMTAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBjb25zdCBwcm90bzMgPSB7XG4gICAgICAgIGNvbnRlbnRIaW50OiAxLFxuICAgICAgICBwcm90bzogZ2V0UmFuZG9tQnl0ZXMoMTI4KSxcbiAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAgLSAyMCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bzEsIHtcbiAgICAgICAgbWVzc2FnZUlkczogW21lc3NhZ2VJZCwgZ2V0VXVpZCgpXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtnZXRVdWlkKCldOiBbMSwgMl0sXG4gICAgICAgICAgW2dldFV1aWQoKV06IFsxXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgaW5zZXJ0U2VudFByb3RvKHByb3RvMiwge1xuICAgICAgICBtZXNzYWdlSWRzOiBbbWVzc2FnZUlkXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtnZXRVdWlkKCldOiBbMV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bzMsIHtcbiAgICAgICAgbWVzc2FnZUlkczogW2dldFV1aWQoKV0sXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbZ2V0VXVpZCgpXTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDMpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDQpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDUpO1xuXG4gICAgICBhd2FpdCBkZWxldGVTZW50UHJvdG9CeU1lc3NhZ2VJZChtZXNzYWdlSWQpO1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvTWVzc2FnZUlkcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkZWxldGVTZW50UHJvdG9SZWNpcGllbnQnLCAoKSA9PiB7XG4gICAgaXQoJ2RvZXMgbm90IGRlbGV0ZSBwYXlsb2FkIGlmIHJlY2lwaWVudCByZW1haW5zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZDEgPSBnZXRVdWlkKCk7XG4gICAgICBjb25zdCByZWNpcGllbnRVdWlkMiA9IGdldFV1aWQoKTtcbiAgICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bywge1xuICAgICAgICBtZXNzYWdlSWRzOiBbZ2V0VXVpZCgpXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtyZWNpcGllbnRVdWlkMV06IFsxLCAyXSxcbiAgICAgICAgICBbcmVjaXBpZW50VXVpZDJdOiBbMV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMSk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKSwgMyk7XG5cbiAgICAgIGF3YWl0IGRlbGV0ZVNlbnRQcm90b1JlY2lwaWVudCh7XG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgcmVjaXBpZW50VXVpZDogcmVjaXBpZW50VXVpZDEsXG4gICAgICAgIGRldmljZUlkOiAxLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RlbGV0ZXMgcGF5bG9hZCBpZiBubyByZWNpcGllbnRzIHJlbWFpbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudFV1aWQxID0gZ2V0VXVpZCgpO1xuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZDIgPSBnZXRVdWlkKCk7XG4gICAgICBjb25zdCBwcm90byA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8sIHtcbiAgICAgICAgbWVzc2FnZUlkczogW2dldFV1aWQoKV0sXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbcmVjaXBpZW50VXVpZDFdOiBbMSwgMl0sXG4gICAgICAgICAgW3JlY2lwaWVudFV1aWQyXTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDMpO1xuXG4gICAgICBhd2FpdCBkZWxldGVTZW50UHJvdG9SZWNpcGllbnQoe1xuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHJlY2lwaWVudFV1aWQ6IHJlY2lwaWVudFV1aWQxLFxuICAgICAgICBkZXZpY2VJZDogMSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAyKTtcblxuICAgICAgYXdhaXQgZGVsZXRlU2VudFByb3RvUmVjaXBpZW50KHtcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICByZWNpcGllbnRVdWlkOiByZWNpcGllbnRVdWlkMSxcbiAgICAgICAgZGV2aWNlSWQ6IDIsXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IGdldEFsbFNlbnRQcm90b3MoKSwgMSk7XG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgX2dldEFsbFNlbnRQcm90b1JlY2lwaWVudHMoKSwgMSk7XG5cbiAgICAgIGF3YWl0IGRlbGV0ZVNlbnRQcm90b1JlY2lwaWVudCh7XG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgcmVjaXBpZW50VXVpZDogcmVjaXBpZW50VXVpZDIsXG4gICAgICAgIGRldmljZUlkOiAxLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDApO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RlbGV0ZXMgbXVsdGlwbGUgcmVjaXBpZW50cyBpbiBhIHNpbmdsZSB0cmFuc2FjdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudFV1aWQxID0gZ2V0VXVpZCgpO1xuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZDIgPSBnZXRVdWlkKCk7XG4gICAgICBjb25zdCBwcm90byA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8sIHtcbiAgICAgICAgbWVzc2FnZUlkczogW2dldFV1aWQoKV0sXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbcmVjaXBpZW50VXVpZDFdOiBbMSwgMl0sXG4gICAgICAgICAgW3JlY2lwaWVudFV1aWQyXTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDMpO1xuXG4gICAgICBhd2FpdCBkZWxldGVTZW50UHJvdG9SZWNpcGllbnQoW1xuICAgICAgICB7XG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIHJlY2lwaWVudFV1aWQ6IHJlY2lwaWVudFV1aWQxLFxuICAgICAgICAgIGRldmljZUlkOiAxLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIHJlY2lwaWVudFV1aWQ6IHJlY2lwaWVudFV1aWQxLFxuICAgICAgICAgIGRldmljZUlkOiAyLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIHJlY2lwaWVudFV1aWQ6IHJlY2lwaWVudFV1aWQyLFxuICAgICAgICAgIGRldmljZUlkOiAxLFxuICAgICAgICB9LFxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDApO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2dldFNlbnRQcm90b0J5UmVjaXBpZW50JywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIG1hdGNoaW5nIHBheWxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgICBjb25zdCByZWNpcGllbnRVdWlkID0gZ2V0VXVpZCgpO1xuICAgICAgY29uc3QgbWVzc2FnZUlkcyA9IFtnZXRVdWlkKCksIGdldFV1aWQoKV07XG4gICAgICBjb25zdCBwcm90byA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8sIHtcbiAgICAgICAgbWVzc2FnZUlkcyxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtyZWNpcGllbnRVdWlkXTogWzEsIDJdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDIpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDIpO1xuXG4gICAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCh7XG4gICAgICAgIG5vdzogdGltZXN0YW1wLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFhY3R1YWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggcHJvdG8hJyk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLmNvbnRlbnRIaW50LCBwcm90by5jb250ZW50SGludCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGFjdHVhbC5wcm90bywgcHJvdG8ucHJvdG8pKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwudGltZXN0YW1wLCBwcm90by50aW1lc3RhbXApO1xuICAgICAgYXNzZXJ0LnNhbWVNZW1iZXJzKGFjdHVhbC5tZXNzYWdlSWRzLCBtZXNzYWdlSWRzKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIG1hdGNoaW5nIHBheWxvYWQgd2l0aCBubyBtZXNzYWdlSWRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZCA9IGdldFV1aWQoKTtcbiAgICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bywge1xuICAgICAgICBtZXNzYWdlSWRzOiBbXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtyZWNpcGllbnRVdWlkXTogWzEsIDJdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDIpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9NZXNzYWdlSWRzKCksIDApO1xuXG4gICAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCh7XG4gICAgICAgIG5vdzogdGltZXN0YW1wLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFhY3R1YWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggcHJvdG8hJyk7XG4gICAgICB9XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLmNvbnRlbnRIaW50LCBwcm90by5jb250ZW50SGludCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGNvbnN0YW50VGltZUVxdWFsKGFjdHVhbC5wcm90bywgcHJvdG8ucHJvdG8pKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwudGltZXN0YW1wLCBwcm90by50aW1lc3RhbXApO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwubWVzc2FnZUlkcywgW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgbm90aGluZyBpZiBwYXlsb2FkIGRvZXMgbm90IGhhdmUgcmVjaXBpZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZCA9IGdldFV1aWQoKTtcbiAgICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bywge1xuICAgICAgICBtZXNzYWdlSWRzOiBbZ2V0VXVpZCgpXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtyZWNpcGllbnRVdWlkXTogWzEsIDJdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDIpO1xuXG4gICAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCh7XG4gICAgICAgIG5vdzogdGltZXN0YW1wLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHJlY2lwaWVudFV1aWQ6IGdldFV1aWQoKSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYWN0dWFsKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIG5vdGhpbmcgaWYgdGltZXN0YW1wIGRvZXMgbm90IG1hdGNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgcmVjaXBpZW50VXVpZCA9IGdldFV1aWQoKTtcbiAgICAgIGNvbnN0IHByb3RvID0ge1xuICAgICAgICBjb250ZW50SGludDogMSxcbiAgICAgICAgcHJvdG86IGdldFJhbmRvbUJ5dGVzKDEyOCksXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgdXJnZW50OiB0cnVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGluc2VydFNlbnRQcm90byhwcm90bywge1xuICAgICAgICBtZXNzYWdlSWRzOiBbZ2V0VXVpZCgpXSxcbiAgICAgICAgcmVjaXBpZW50czoge1xuICAgICAgICAgIFtyZWNpcGllbnRVdWlkXTogWzEsIDJdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDEpO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDIpO1xuXG4gICAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBnZXRTZW50UHJvdG9CeVJlY2lwaWVudCh7XG4gICAgICAgIG5vdzogdGltZXN0YW1wLFxuICAgICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcCArIDEsXG4gICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGFjdHVhbCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBub3RoaW5nIGlmIHRpbWVzdGFtcCBwcm90byBpcyB0b28gb2xkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgVFdPX0RBWVMgPSAyICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cbiAgICAgIGNvbnN0IHJlY2lwaWVudFV1aWQgPSBnZXRVdWlkKCk7XG4gICAgICBjb25zdCBwcm90byA9IHtcbiAgICAgICAgY29udGVudEhpbnQ6IDEsXG4gICAgICAgIHByb3RvOiBnZXRSYW5kb21CeXRlcygxMjgpLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHVyZ2VudDogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBhd2FpdCBpbnNlcnRTZW50UHJvdG8ocHJvdG8sIHtcbiAgICAgICAgbWVzc2FnZUlkczogW2dldFV1aWQoKV0sXG4gICAgICAgIHJlY2lwaWVudHM6IHtcbiAgICAgICAgICBbcmVjaXBpZW50VXVpZF06IFsxLCAyXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQubGVuZ3RoT2YoYXdhaXQgZ2V0QWxsU2VudFByb3RvcygpLCAxKTtcbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBfZ2V0QWxsU2VudFByb3RvUmVjaXBpZW50cygpLCAyKTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgZ2V0U2VudFByb3RvQnlSZWNpcGllbnQoe1xuICAgICAgICBub3c6IHRpbWVzdGFtcCArIFRXT19EQVlTLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGFjdHVhbCk7XG5cbiAgICAgIGFzc2VydC5sZW5ndGhPZihhd2FpdCBnZXRBbGxTZW50UHJvdG9zKCksIDApO1xuICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGF3YWl0IF9nZXRBbGxTZW50UHJvdG9SZWNpcGllbnRzKCksIDApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtCQUF1QjtBQUV2QixvQkFBMEI7QUFDMUIsa0JBQXFCO0FBRXJCLG9CQUFrRDtBQUVsRCxtQkFBbUM7QUFDakMsU0FBTyxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUNsQztBQUZTLEFBSVQsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLElBQ0U7QUFFSixTQUFTLGVBQWUsTUFBTTtBQUM1QixhQUFXLFlBQVk7QUFDckIsVUFBTSxvQkFBb0I7QUFBQSxFQUM1QixDQUFDO0FBRUQsS0FBRyxvREFBb0QsWUFBWTtBQUNqRSxVQUFNLFFBQVEsa0NBQWUsR0FBRztBQUNoQyxVQUFNLFlBQVksS0FBSyxJQUFJO0FBQzNCLFVBQU0sUUFBUTtBQUFBLE1BQ1osYUFBYTtBQUFBLE1BQ2IsT0FBTztBQUFBLE1BQ1A7QUFBQSxNQUNBLFFBQVE7QUFBQSxJQUNWO0FBQ0EsVUFBTSxnQkFBZ0IsT0FBTztBQUFBLE1BQzNCLFlBQVksQ0FBQyxRQUFRLENBQUM7QUFBQSxNQUN0QixZQUFZO0FBQUEsU0FDVCxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUM7QUFBQSxNQUNwQjtBQUFBLElBQ0YsQ0FBQztB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
