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
var moment = __toESM(require("moment"));
var import_uuid = require("uuid");
var import_MessageSendState = require("../../../messages/MessageSendState");
var import_message = require("../../../state/selectors/message");
describe("state/selectors/messages", () => {
  let ourConversationId;
  beforeEach(() => {
    ourConversationId = (0, import_uuid.v4)();
  });
  describe("cleanBodyForDirectionCheck", () => {
    it("drops emoji", () => {
      const body = "\u{1F62E}\u{1F62E}\u{1F62E}\u{1F62E} that's wild!";
      const expected = " that's wild!";
      const actual = (0, import_message.cleanBodyForDirectionCheck)(body);
      import_chai.assert.strictEqual(actual, expected);
    });
    it("drops mentions", () => {
      const body = "heyo, how's it going \uFFFC? And \uFFFC too!";
      const expected = "heyo, how's it going ? And  too!";
      const actual = (0, import_message.cleanBodyForDirectionCheck)(body);
      import_chai.assert.strictEqual(actual, expected);
    });
    it("drops links", () => {
      const body = "You should download it from https://signal.org/download. Then read something on https://signal.org/blog. Then donate at https://signal.org/donate.";
      const expected = "You should download it from . Then read something on . Then donate at .";
      const actual = (0, import_message.cleanBodyForDirectionCheck)(body);
      import_chai.assert.strictEqual(actual, expected);
    });
    it("drops all of them at the same time", () => {
      const body = "https://signal.org/download \u{1F62E} \uFFFC Did you really join Signal?";
      const expected = "   Did you really join Signal?";
      const actual = (0, import_message.cleanBodyForDirectionCheck)(body);
      import_chai.assert.strictEqual(actual, expected);
    });
  });
  describe("canDeleteForEveryone", () => {
    it("returns false for incoming messages", () => {
      const message = {
        type: "incoming",
        sent_at: Date.now() - 1e3
      };
      import_chai.assert.isFalse((0, import_message.canDeleteForEveryone)(message));
    });
    it("returns false for messages that were already deleted for everyone", () => {
      const message = {
        type: "outgoing",
        deletedForEveryone: true,
        sent_at: Date.now() - 1e3,
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Read,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Delivered,
            updatedAt: Date.now()
          }
        }
      };
      import_chai.assert.isFalse((0, import_message.canDeleteForEveryone)(message));
    });
    it("returns false for messages that were are too old to delete", () => {
      const message = {
        type: "outgoing",
        sent_at: Date.now() - moment.duration(4, "hours").asMilliseconds(),
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Read,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Delivered,
            updatedAt: Date.now()
          }
        }
      };
      import_chai.assert.isFalse((0, import_message.canDeleteForEveryone)(message));
    });
    it("returns false for messages that haven't been sent to anyone", () => {
      const message = {
        type: "outgoing",
        sent_at: Date.now() - 1e3,
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Failed,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      };
      import_chai.assert.isFalse((0, import_message.canDeleteForEveryone)(message));
    });
    it("returns true for messages that meet all criteria for deletion", () => {
      const message = {
        type: "outgoing",
        sent_at: Date.now() - 1e3,
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Delivered,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Failed,
            updatedAt: Date.now()
          }
        }
      };
      import_chai.assert.isTrue((0, import_message.canDeleteForEveryone)(message));
    });
  });
  describe("canReact", () => {
    const defaultConversation = {
      id: (0, import_uuid.v4)(),
      type: "direct",
      title: "Test conversation",
      isMe: false,
      sharedGroupNames: [],
      acceptedMessageRequest: true,
      badges: []
    };
    it("returns false for disabled v1 groups", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming"
      };
      const getConversationById = /* @__PURE__ */ __name(() => ({
        ...defaultConversation,
        type: "group",
        isGroupV1AndDisabled: true
      }), "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
    it("returns false if the message was deleted for everyone", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming",
        deletedForEveryone: true
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
    it("returns false for outgoing messages that have not been sent", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
    it("returns true for outgoing messages that are only sent to yourself", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
    it("returns true for outgoing messages that have been sent to at least one person", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => ({
        ...defaultConversation,
        type: "group"
      }), "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
    it("returns true for incoming messages", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming"
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReact)(message, ourConversationId, getConversationById));
    });
  });
  describe("canReply", () => {
    const defaultConversation = {
      id: (0, import_uuid.v4)(),
      type: "direct",
      title: "Test conversation",
      isMe: false,
      sharedGroupNames: [],
      acceptedMessageRequest: true,
      badges: []
    };
    it("returns false for disabled v1 groups", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming"
      };
      const getConversationById = /* @__PURE__ */ __name(() => ({
        ...defaultConversation,
        type: "group",
        isGroupV1AndDisabled: true
      }), "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
    it("returns false if the message was deleted for everyone", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming",
        deletedForEveryone: true
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
    it("returns false for outgoing messages that have not been sent", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isFalse((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
    it("returns true for outgoing messages that are only sent to yourself", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
    it("returns true for outgoing messages that have been sent to at least one person", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "outgoing",
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          }
        }
      };
      const getConversationById = /* @__PURE__ */ __name(() => ({
        ...defaultConversation,
        type: "group"
      }), "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
    it("returns true for incoming messages", () => {
      const message = {
        conversationId: "fake-conversation-id",
        type: "incoming"
      };
      const getConversationById = /* @__PURE__ */ __name(() => defaultConversation, "getConversationById");
      import_chai.assert.isTrue((0, import_message.canReply)(message, ourConversationId, getConversationById));
    });
  });
  describe("getMessagePropStatus", () => {
    const createMessage = /* @__PURE__ */ __name((overrides) => ({
      type: "outgoing",
      ...overrides
    }), "createMessage");
    it("returns undefined for incoming messages with no errors", () => {
      const message = createMessage({ type: "incoming" });
      import_chai.assert.isUndefined((0, import_message.getMessagePropStatus)(message, ourConversationId));
    });
    it('returns "error" for incoming messages with errors', () => {
      const message = createMessage({
        type: "incoming",
        errors: [new Error("something went wrong")]
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "error");
    });
    it('returns "paused" for messages with challenges', () => {
      const challengeError = Object.assign(new Error("a challenge"), {
        name: "SendMessageChallengeError",
        retryAfter: 123,
        data: {}
      });
      const message = createMessage({ errors: [challengeError] });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "paused");
    });
    it('returns "partial-sent" if the message has errors but was sent to at least one person', () => {
      const message = createMessage({
        errors: [new Error("whoopsie")],
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Delivered,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "partial-sent");
    });
    it('returns "error" if the message has errors and has not been sent', () => {
      const message = createMessage({
        errors: [new Error("whoopsie")],
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "error");
    });
    it('returns "viewed" if the message is just for you and has been sent', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "viewed");
    });
    it('returns "viewed" if the message was viewed by at least one person', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Viewed,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Read,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "viewed");
    });
    it('returns "read" if the message was read by at least one person', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Read,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "read");
    });
    it('returns "delivered" if the message was delivered to at least one person, but no "higher"', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Delivered,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "delivered");
    });
    it('returns "sent" if the message was sent to at least one person, but no "higher"', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "sent");
    });
    it('returns "sending" if the message has not been sent yet, even if it has been synced to yourself', () => {
      const message = createMessage({
        sendStateByConversationId: {
          [ourConversationId]: {
            status: import_MessageSendState.SendStatus.Sent,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          },
          [(0, import_uuid.v4)()]: {
            status: import_MessageSendState.SendStatus.Pending,
            updatedAt: Date.now()
          }
        }
      });
      import_chai.assert.strictEqual((0, import_message.getMessagePropStatus)(message, ourConversationId), "sending");
    });
  });
  describe("isEndSession", () => {
    it("checks if it is end of the session", () => {
      import_chai.assert.isFalse((0, import_message.isEndSession)({}));
      import_chai.assert.isFalse((0, import_message.isEndSession)({ flags: void 0 }));
      import_chai.assert.isFalse((0, import_message.isEndSession)({ flags: 0 }));
      import_chai.assert.isFalse((0, import_message.isEndSession)({ flags: 2 }));
      import_chai.assert.isFalse((0, import_message.isEndSession)({ flags: 4 }));
      import_chai.assert.isTrue((0, import_message.isEndSession)({ flags: 1 }));
    });
  });
  describe("isGroupUpdate", () => {
    it("checks if is group update", () => {
      import_chai.assert.isFalse((0, import_message.isGroupUpdate)({}));
      import_chai.assert.isFalse((0, import_message.isGroupUpdate)({ group_update: void 0 }));
      import_chai.assert.isTrue((0, import_message.isGroupUpdate)({ group_update: { left: "You" } }));
    });
  });
  describe("isIncoming", () => {
    it("checks if is incoming message", () => {
      import_chai.assert.isFalse((0, import_message.isIncoming)({ type: "outgoing" }));
      import_chai.assert.isFalse((0, import_message.isIncoming)({ type: "call-history" }));
      import_chai.assert.isTrue((0, import_message.isIncoming)({ type: "incoming" }));
    });
  });
  describe("isOutgoing", () => {
    it("checks if is outgoing message", () => {
      import_chai.assert.isFalse((0, import_message.isOutgoing)({ type: "incoming" }));
      import_chai.assert.isFalse((0, import_message.isOutgoing)({ type: "call-history" }));
      import_chai.assert.isTrue((0, import_message.isOutgoing)({ type: "outgoing" }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWVzc2FnZXNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgU2VuZFN0YXR1cyB9IGZyb20gJy4uLy4uLy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHR5cGUge1xuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gIFNoYWxsb3dDaGFsbGVuZ2VFcnJvcixcbn0gZnJvbSAnLi4vLi4vLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi8uLi8uLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcblxuaW1wb3J0IHtcbiAgY2FuRGVsZXRlRm9yRXZlcnlvbmUsXG4gIGNhblJlYWN0LFxuICBjYW5SZXBseSxcbiAgY2xlYW5Cb2R5Rm9yRGlyZWN0aW9uQ2hlY2ssXG4gIGdldE1lc3NhZ2VQcm9wU3RhdHVzLFxuICBpc0VuZFNlc3Npb24sXG4gIGlzR3JvdXBVcGRhdGUsXG4gIGlzSW5jb21pbmcsXG4gIGlzT3V0Z29pbmcsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL3NlbGVjdG9ycy9tZXNzYWdlJztcblxuZGVzY3JpYmUoJ3N0YXRlL3NlbGVjdG9ycy9tZXNzYWdlcycsICgpID0+IHtcbiAgbGV0IG91ckNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgb3VyQ29udmVyc2F0aW9uSWQgPSB1dWlkKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjbGVhbkJvZHlGb3JEaXJlY3Rpb25DaGVjaycsICgpID0+IHtcbiAgICBpdCgnZHJvcHMgZW1vamknLCAoKSA9PiB7XG4gICAgICBjb25zdCBib2R5ID0gXCJcdUQ4M0RcdURFMkVcdUQ4M0RcdURFMkVcdUQ4M0RcdURFMkVcdUQ4M0RcdURFMkUgdGhhdCdzIHdpbGQhXCI7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiIHRoYXQncyB3aWxkIVwiO1xuICAgICAgY29uc3QgYWN0dWFsID0gY2xlYW5Cb2R5Rm9yRGlyZWN0aW9uQ2hlY2soYm9keSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHJvcHMgbWVudGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBib2R5ID0gXCJoZXlvLCBob3cncyBpdCBnb2luZyBcXHVGRkZDPyBBbmQgXFx1RkZGQyB0b28hXCI7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiaGV5bywgaG93J3MgaXQgZ29pbmcgPyBBbmQgIHRvbyFcIjtcbiAgICAgIGNvbnN0IGFjdHVhbCA9IGNsZWFuQm9keUZvckRpcmVjdGlvbkNoZWNrKGJvZHkpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Ryb3BzIGxpbmtzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYm9keSA9XG4gICAgICAgICdZb3Ugc2hvdWxkIGRvd25sb2FkIGl0IGZyb20gaHR0cHM6Ly9zaWduYWwub3JnL2Rvd25sb2FkLiBUaGVuIHJlYWQgc29tZXRoaW5nIG9uIGh0dHBzOi8vc2lnbmFsLm9yZy9ibG9nLiBUaGVuIGRvbmF0ZSBhdCBodHRwczovL3NpZ25hbC5vcmcvZG9uYXRlLic7XG4gICAgICBjb25zdCBleHBlY3RlZCA9XG4gICAgICAgICdZb3Ugc2hvdWxkIGRvd25sb2FkIGl0IGZyb20gLiBUaGVuIHJlYWQgc29tZXRoaW5nIG9uIC4gVGhlbiBkb25hdGUgYXQgLic7XG4gICAgICBjb25zdCBhY3R1YWwgPSBjbGVhbkJvZHlGb3JEaXJlY3Rpb25DaGVjayhib2R5KTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdkcm9wcyBhbGwgb2YgdGhlbSBhdCB0aGUgc2FtZSB0aW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgYm9keSA9XG4gICAgICAgICdodHRwczovL3NpZ25hbC5vcmcvZG93bmxvYWQgXHVEODNEXHVERTJFIFxcdUZGRkMgRGlkIHlvdSByZWFsbHkgam9pbiBTaWduYWw/JztcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gJyAgIERpZCB5b3UgcmVhbGx5IGpvaW4gU2lnbmFsPyc7XG4gICAgICBjb25zdCBhY3R1YWwgPSBjbGVhbkJvZHlGb3JEaXJlY3Rpb25DaGVjayhib2R5KTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NhbkRlbGV0ZUZvckV2ZXJ5b25lJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBpbmNvbWluZyBtZXNzYWdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycgYXMgY29uc3QsXG4gICAgICAgIHNlbnRfYXQ6IERhdGUubm93KCkgLSAxMDAwLFxuICAgICAgfTtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UoY2FuRGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIG1lc3NhZ2VzIHRoYXQgd2VyZSBhbHJlYWR5IGRlbGV0ZWQgZm9yIGV2ZXJ5b25lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgICAgZGVsZXRlZEZvckV2ZXJ5b25lOiB0cnVlLFxuICAgICAgICBzZW50X2F0OiBEYXRlLm5vdygpIC0gMTAwMCxcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5SZWFkLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5EZWxpdmVyZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKGNhbkRlbGV0ZUZvckV2ZXJ5b25lKG1lc3NhZ2UpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBtZXNzYWdlcyB0aGF0IHdlcmUgYXJlIHRvbyBvbGQgdG8gZGVsZXRlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgICAgc2VudF9hdDogRGF0ZS5ub3coKSAtIG1vbWVudC5kdXJhdGlvbig0LCAnaG91cnMnKS5hc01pbGxpc2Vjb25kcygpLFxuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlJlYWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLkRlbGl2ZXJlZCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UoY2FuRGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZSkpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXR1cm5zIGZhbHNlIGZvciBtZXNzYWdlcyB0aGF0IGhhdmVuJ3QgYmVlbiBzZW50IHRvIGFueW9uZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICB0eXBlOiAnb3V0Z29pbmcnIGFzIGNvbnN0LFxuICAgICAgICBzZW50X2F0OiBEYXRlLm5vdygpIC0gMTAwMCxcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKGNhbkRlbGV0ZUZvckV2ZXJ5b25lKG1lc3NhZ2UpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIG1lc3NhZ2VzIHRoYXQgbWVldCBhbGwgY3JpdGVyaWEgZm9yIGRlbGV0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgICAgc2VudF9hdDogRGF0ZS5ub3coKSAtIDEwMDAsXG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuRGVsaXZlcmVkLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGFzc2VydC5pc1RydWUoY2FuRGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2FuUmVhY3QnLCAoKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uVHlwZSA9IHtcbiAgICAgIGlkOiB1dWlkKCksXG4gICAgICB0eXBlOiAnZGlyZWN0JyxcbiAgICAgIHRpdGxlOiAnVGVzdCBjb252ZXJzYXRpb24nLFxuICAgICAgaXNNZTogZmFsc2UsXG4gICAgICBzaGFyZWRHcm91cE5hbWVzOiBbXSxcbiAgICAgIGFjY2VwdGVkTWVzc2FnZVJlcXVlc3Q6IHRydWUsXG4gICAgICBiYWRnZXM6IFtdLFxuICAgIH07XG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZGlzYWJsZWQgdjEgZ3JvdXBzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycgYXMgY29uc3QsXG4gICAgICB9O1xuICAgICAgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlJZCA9ICgpID0+ICh7XG4gICAgICAgIC4uLmRlZmF1bHRDb252ZXJzYXRpb24sXG4gICAgICAgIHR5cGU6ICdncm91cCcgYXMgY29uc3QsXG4gICAgICAgIGlzR3JvdXBWMUFuZERpc2FibGVkOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKGNhblJlYWN0KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBnZXRDb252ZXJzYXRpb25CeUlkKSk7XG4gICAgfSk7XG5cbiAgICAvLyBOT1RFOiBUaGlzIGlzIG1pc3NpbmcgYSB0ZXN0IGZvciBtYW5kYXRvcnkgcHJvZmlsZSBzaGFyaW5nLlxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQgZm9yIGV2ZXJ5b25lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycgYXMgY29uc3QsXG4gICAgICAgIGRlbGV0ZWRGb3JFdmVyeW9uZTogdHJ1ZSxcbiAgICAgIH07XG4gICAgICBjb25zdCBnZXRDb252ZXJzYXRpb25CeUlkID0gKCkgPT4gZGVmYXVsdENvbnZlcnNhdGlvbjtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UoY2FuUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGdldENvbnZlcnNhdGlvbkJ5SWQpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBvdXRnb2luZyBtZXNzYWdlcyB0aGF0IGhhdmUgbm90IGJlZW4gc2VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnb3V0Z29pbmcnIGFzIGNvbnN0LFxuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBnZXRDb252ZXJzYXRpb25CeUlkID0gKCkgPT4gZGVmYXVsdENvbnZlcnNhdGlvbjtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UoY2FuUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGdldENvbnZlcnNhdGlvbkJ5SWQpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIG91dGdvaW5nIG1lc3NhZ2VzIHRoYXQgYXJlIG9ubHkgc2VudCB0byB5b3Vyc2VsZicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnb3V0Z29pbmcnIGFzIGNvbnN0LFxuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBnZXRDb252ZXJzYXRpb25CeUlkID0gKCkgPT4gZGVmYXVsdENvbnZlcnNhdGlvbjtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShjYW5SZWFjdChtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCwgZ2V0Q29udmVyc2F0aW9uQnlJZCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3Igb3V0Z29pbmcgbWVzc2FnZXMgdGhhdCBoYXZlIGJlZW4gc2VudCB0byBhdCBsZWFzdCBvbmUgcGVyc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgIHR5cGU6ICdvdXRnb2luZycgYXMgY29uc3QsXG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGdldENvbnZlcnNhdGlvbkJ5SWQgPSAoKSA9PiAoe1xuICAgICAgICAuLi5kZWZhdWx0Q29udmVyc2F0aW9uLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnIGFzIGNvbnN0LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUoY2FuUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGdldENvbnZlcnNhdGlvbkJ5SWQpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGluY29taW5nIG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmYWtlLWNvbnZlcnNhdGlvbi1pZCcsXG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycgYXMgY29uc3QsXG4gICAgICB9O1xuICAgICAgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlJZCA9ICgpID0+IGRlZmF1bHRDb252ZXJzYXRpb247XG5cbiAgICAgIGFzc2VydC5pc1RydWUoY2FuUmVhY3QobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGdldENvbnZlcnNhdGlvbkJ5SWQpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NhblJlcGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHRDb252ZXJzYXRpb246IENvbnZlcnNhdGlvblR5cGUgPSB7XG4gICAgICBpZDogdXVpZCgpLFxuICAgICAgdHlwZTogJ2RpcmVjdCcsXG4gICAgICB0aXRsZTogJ1Rlc3QgY29udmVyc2F0aW9uJyxcbiAgICAgIGlzTWU6IGZhbHNlLFxuICAgICAgc2hhcmVkR3JvdXBOYW1lczogW10sXG4gICAgICBhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0OiB0cnVlLFxuICAgICAgYmFkZ2VzOiBbXSxcbiAgICB9O1xuXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGRpc2FibGVkIHYxIGdyb3VwcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnaW5jb21pbmcnIGFzIGNvbnN0LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGdldENvbnZlcnNhdGlvbkJ5SWQgPSAoKSA9PiAoe1xuICAgICAgICAuLi5kZWZhdWx0Q29udmVyc2F0aW9uLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnIGFzIGNvbnN0LFxuICAgICAgICBpc0dyb3VwVjFBbmREaXNhYmxlZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNGYWxzZShjYW5SZXBseShtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCwgZ2V0Q29udmVyc2F0aW9uQnlJZCkpO1xuICAgIH0pO1xuXG4gICAgLy8gTk9URTogVGhpcyBpcyBtaXNzaW5nIGEgdGVzdCBmb3IgbWFuZGF0b3J5IHByb2ZpbGUgc2hhcmluZy5cblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZSBtZXNzYWdlIHdhcyBkZWxldGVkIGZvciBldmVyeW9uZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnaW5jb21pbmcnIGFzIGNvbnN0LFxuICAgICAgICBkZWxldGVkRm9yRXZlcnlvbmU6IHRydWUsXG4gICAgICB9O1xuICAgICAgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlJZCA9ICgpID0+IGRlZmF1bHRDb252ZXJzYXRpb247XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKGNhblJlcGx5KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBnZXRDb252ZXJzYXRpb25CeUlkKSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3Igb3V0Z29pbmcgbWVzc2FnZXMgdGhhdCBoYXZlIG5vdCBiZWVuIHNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlJZCA9ICgpID0+IGRlZmF1bHRDb252ZXJzYXRpb247XG5cbiAgICAgIGFzc2VydC5pc0ZhbHNlKGNhblJlcGx5KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBnZXRDb252ZXJzYXRpb25CeUlkKSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0cnVlIGZvciBvdXRnb2luZyBtZXNzYWdlcyB0aGF0IGFyZSBvbmx5IHNlbnQgdG8geW91cnNlbGYnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2Zha2UtY29udmVyc2F0aW9uLWlkJyxcbiAgICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgY29uc3QgZ2V0Q29udmVyc2F0aW9uQnlJZCA9ICgpID0+IGRlZmF1bHRDb252ZXJzYXRpb247XG5cbiAgICAgIGFzc2VydC5pc1RydWUoY2FuUmVwbHkobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQsIGdldENvbnZlcnNhdGlvbkJ5SWQpKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIG91dGdvaW5nIG1lc3NhZ2VzIHRoYXQgaGF2ZSBiZWVuIHNlbnQgdG8gYXQgbGVhc3Qgb25lIHBlcnNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnb3V0Z29pbmcnIGFzIGNvbnN0LFxuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlBlbmRpbmcsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBnZXRDb252ZXJzYXRpb25CeUlkID0gKCkgPT4gKHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnZlcnNhdGlvbixcbiAgICAgICAgdHlwZTogJ2dyb3VwJyBhcyBjb25zdCxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGNhblJlcGx5KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBnZXRDb252ZXJzYXRpb25CeUlkKSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0cnVlIGZvciBpbmNvbWluZyBtZXNzYWdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZmFrZS1jb252ZXJzYXRpb24taWQnLFxuICAgICAgICB0eXBlOiAnaW5jb21pbmcnIGFzIGNvbnN0LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGdldENvbnZlcnNhdGlvbkJ5SWQgPSAoKSA9PiBkZWZhdWx0Q29udmVyc2F0aW9uO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGNhblJlcGx5KG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkLCBnZXRDb252ZXJzYXRpb25CeUlkKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRNZXNzYWdlUHJvcFN0YXR1cycsICgpID0+IHtcbiAgICBjb25zdCBjcmVhdGVNZXNzYWdlID0gKG92ZXJyaWRlczogUGFydGlhbDxNZXNzYWdlQXR0cmlidXRlc1R5cGU+KSA9PiAoe1xuICAgICAgdHlwZTogJ291dGdvaW5nJyBhcyBjb25zdCxcbiAgICAgIC4uLm92ZXJyaWRlcyxcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHVuZGVmaW5lZCBmb3IgaW5jb21pbmcgbWVzc2FnZXMgd2l0aCBubyBlcnJvcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gY3JlYXRlTWVzc2FnZSh7IHR5cGU6ICdpbmNvbWluZycgfSk7XG5cbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChnZXRNZXNzYWdlUHJvcFN0YXR1cyhtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgXCJlcnJvclwiIGZvciBpbmNvbWluZyBtZXNzYWdlcyB3aXRoIGVycm9ycycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2luY29taW5nJyxcbiAgICAgICAgZXJyb3JzOiBbbmV3IEVycm9yKCdzb21ldGhpbmcgd2VudCB3cm9uZycpXSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGdldE1lc3NhZ2VQcm9wU3RhdHVzKG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkKSxcbiAgICAgICAgJ2Vycm9yJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIFwicGF1c2VkXCIgZm9yIG1lc3NhZ2VzIHdpdGggY2hhbGxlbmdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYWxsZW5nZUVycm9yOiBTaGFsbG93Q2hhbGxlbmdlRXJyb3IgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICBuZXcgRXJyb3IoJ2EgY2hhbGxlbmdlJyksXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvcicsXG4gICAgICAgICAgcmV0cnlBZnRlcjogMTIzLFxuICAgICAgICAgIGRhdGE6IHt9LFxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGNyZWF0ZU1lc3NhZ2UoeyBlcnJvcnM6IFtjaGFsbGVuZ2VFcnJvcl0gfSk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZ2V0TWVzc2FnZVByb3BTdGF0dXMobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQpLFxuICAgICAgICAncGF1c2VkJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIFwicGFydGlhbC1zZW50XCIgaWYgdGhlIG1lc3NhZ2UgaGFzIGVycm9ycyBidXQgd2FzIHNlbnQgdG8gYXQgbGVhc3Qgb25lIHBlcnNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgZXJyb3JzOiBbbmV3IEVycm9yKCd3aG9vcHNpZScpXSxcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5EZWxpdmVyZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGdldE1lc3NhZ2VQcm9wU3RhdHVzKG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkKSxcbiAgICAgICAgJ3BhcnRpYWwtc2VudCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBcImVycm9yXCIgaWYgdGhlIG1lc3NhZ2UgaGFzIGVycm9ycyBhbmQgaGFzIG5vdCBiZWVuIHNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gY3JlYXRlTWVzc2FnZSh7XG4gICAgICAgIGVycm9yczogW25ldyBFcnJvcignd2hvb3BzaWUnKV0sXG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZ2V0TWVzc2FnZVByb3BTdGF0dXMobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQpLFxuICAgICAgICAnZXJyb3InXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgXCJ2aWV3ZWRcIiBpZiB0aGUgbWVzc2FnZSBpcyBqdXN0IGZvciB5b3UgYW5kIGhhcyBiZWVuIHNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gY3JlYXRlTWVzc2FnZSh7XG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZ2V0TWVzc2FnZVByb3BTdGF0dXMobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQpLFxuICAgICAgICAndmlld2VkJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIFwidmlld2VkXCIgaWYgdGhlIG1lc3NhZ2Ugd2FzIHZpZXdlZCBieSBhdCBsZWFzdCBvbmUgcGVyc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlZpZXdlZCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUmVhZCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGdldE1lc3NhZ2VQcm9wU3RhdHVzKG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkKSxcbiAgICAgICAgJ3ZpZXdlZCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBcInJlYWRcIiBpZiB0aGUgbWVzc2FnZSB3YXMgcmVhZCBieSBhdCBsZWFzdCBvbmUgcGVyc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgICBzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkOiB7XG4gICAgICAgICAgW291ckNvbnZlcnNhdGlvbklkXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbdXVpZCgpXToge1xuICAgICAgICAgICAgc3RhdHVzOiBTZW5kU3RhdHVzLlJlYWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBnZXRNZXNzYWdlUHJvcFN0YXR1cyhtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCksXG4gICAgICAgICdyZWFkJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIFwiZGVsaXZlcmVkXCIgaWYgdGhlIG1lc3NhZ2Ugd2FzIGRlbGl2ZXJlZCB0byBhdCBsZWFzdCBvbmUgcGVyc29uLCBidXQgbm8gXCJoaWdoZXJcIicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5EZWxpdmVyZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGdldE1lc3NhZ2VQcm9wU3RhdHVzKG1lc3NhZ2UsIG91ckNvbnZlcnNhdGlvbklkKSxcbiAgICAgICAgJ2RlbGl2ZXJlZCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBcInNlbnRcIiBpZiB0aGUgbWVzc2FnZSB3YXMgc2VudCB0byBhdCBsZWFzdCBvbmUgcGVyc29uLCBidXQgbm8gXCJoaWdoZXJcIicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgc2VuZFN0YXRlQnlDb252ZXJzYXRpb25JZDoge1xuICAgICAgICAgIFtvdXJDb252ZXJzYXRpb25JZF06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW3V1aWQoKV06IHtcbiAgICAgICAgICAgIHN0YXR1czogU2VuZFN0YXR1cy5TZW50LFxuICAgICAgICAgICAgdXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBnZXRNZXNzYWdlUHJvcFN0YXR1cyhtZXNzYWdlLCBvdXJDb252ZXJzYXRpb25JZCksXG4gICAgICAgICdzZW50J1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIFwic2VuZGluZ1wiIGlmIHRoZSBtZXNzYWdlIGhhcyBub3QgYmVlbiBzZW50IHlldCwgZXZlbiBpZiBpdCBoYXMgYmVlbiBzeW5jZWQgdG8geW91cnNlbGYnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gY3JlYXRlTWVzc2FnZSh7XG4gICAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgICBbb3VyQ29udmVyc2F0aW9uSWRdOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFt1dWlkKCldOiB7XG4gICAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuUGVuZGluZyxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZ2V0TWVzc2FnZVByb3BTdGF0dXMobWVzc2FnZSwgb3VyQ29udmVyc2F0aW9uSWQpLFxuICAgICAgICAnc2VuZGluZydcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc0VuZFNlc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ2NoZWNrcyBpZiBpdCBpcyBlbmQgb2YgdGhlIHNlc3Npb24nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNGYWxzZShpc0VuZFNlc3Npb24oe30pKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKGlzRW5kU2Vzc2lvbih7IGZsYWdzOiB1bmRlZmluZWQgfSkpO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNFbmRTZXNzaW9uKHsgZmxhZ3M6IDAgfSkpO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNFbmRTZXNzaW9uKHsgZmxhZ3M6IDIgfSkpO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNFbmRTZXNzaW9uKHsgZmxhZ3M6IDQgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRW5kU2Vzc2lvbih7IGZsYWdzOiAxIH0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzR3JvdXBVcGRhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ2NoZWNrcyBpZiBpcyBncm91cCB1cGRhdGUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNGYWxzZShpc0dyb3VwVXBkYXRlKHt9KSk7XG4gICAgICBhc3NlcnQuaXNGYWxzZShpc0dyb3VwVXBkYXRlKHsgZ3JvdXBfdXBkYXRlOiB1bmRlZmluZWQgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGlzR3JvdXBVcGRhdGUoeyBncm91cF91cGRhdGU6IHsgbGVmdDogJ1lvdScgfSB9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc0luY29taW5nJywgKCkgPT4ge1xuICAgIGl0KCdjaGVja3MgaWYgaXMgaW5jb21pbmcgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKGlzSW5jb21pbmcoeyB0eXBlOiAnb3V0Z29pbmcnIH0pKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKGlzSW5jb21pbmcoeyB0eXBlOiAnY2FsbC1oaXN0b3J5JyB9KSk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUoaXNJbmNvbWluZyh7IHR5cGU6ICdpbmNvbWluZycgfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNPdXRnb2luZycsICgpID0+IHtcbiAgICBpdCgnY2hlY2tzIGlmIGlzIG91dGdvaW5nIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNGYWxzZShpc091dGdvaW5nKHsgdHlwZTogJ2luY29taW5nJyB9KSk7XG4gICAgICBhc3NlcnQuaXNGYWxzZShpc091dGdvaW5nKHsgdHlwZTogJ2NhbGwtaGlzdG9yeScgfSkpO1xuXG4gICAgICBhc3NlcnQuaXNUcnVlKGlzT3V0Z29pbmcoeyB0eXBlOiAnb3V0Z29pbmcnIH0pKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrQkFBdUI7QUFDdkIsYUFBd0I7QUFDeEIsa0JBQTJCO0FBQzNCLDhCQUEyQjtBQU8zQixxQkFVTztBQUVQLFNBQVMsNEJBQTRCLE1BQU07QUFDekMsTUFBSTtBQUVKLGFBQVcsTUFBTTtBQUNmLHdC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
