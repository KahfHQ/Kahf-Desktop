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
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_uuid = require("uuid");
var import_migrations = require("../sql/migrations");
var import_consoleLogger = require("../util/consoleLogger");
var import_Server = require("../sql/Server");
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_MessageSeenStatus = require("../MessageSeenStatus");
const OUR_UUID = (0, import_uuid.v4)();
describe("SQL migrations test", () => {
  let db;
  const updateToVersion = /* @__PURE__ */ __name((version) => {
    const startVersion = db.pragma("user_version", { simple: true });
    for (const run of import_migrations.SCHEMA_VERSIONS) {
      run(startVersion, db, import_consoleLogger.consoleLogger);
      const currentVersion = db.pragma("user_version", { simple: true });
      if (currentVersion === version) {
        return;
      }
    }
    throw new Error(`Migration to ${version} not found`);
  }, "updateToVersion");
  const addOurUuid = /* @__PURE__ */ __name(() => {
    const value = {
      id: "uuid_id",
      value: `${OUR_UUID}.1`
    };
    db.exec(`
      INSERT INTO items (id, json) VALUES
        ('uuid_id', '${JSON.stringify(value)}');
      `);
  }, "addOurUuid");
  const parseItems = /* @__PURE__ */ __name((items) => {
    return items.map((item) => {
      return {
        ...item,
        json: JSON.parse(item.json)
      };
    });
  }, "parseItems");
  const insertSession = /* @__PURE__ */ __name((conversationId, deviceId, data = {}) => {
    const id = `${conversationId}.${deviceId}`;
    db.prepare(`
        INSERT INTO sessions (id, conversationId, json)
        VALUES ($id, $conversationId, $json)
      `).run({
      id,
      conversationId,
      json: JSON.stringify({
        ...data,
        id,
        conversationId
      })
    });
  }, "insertSession");
  beforeEach(() => {
    db = new import_better_sqlite3.default(":memory:");
  });
  afterEach(() => {
    db.close();
  });
  describe("updateToSchemaVersion41", () => {
    const THEIR_UUID = (0, import_uuid.v4)();
    const THEIR_CONVO = (0, import_uuid.v4)();
    const ANOTHER_CONVO = (0, import_uuid.v4)();
    const THIRD_CONVO = (0, import_uuid.v4)();
    it("clears sessions and keys if UUID is not available", () => {
      updateToVersion(40);
      db.exec(`
        INSERT INTO senderKeys
          (id, senderId, distributionId, data, lastUpdatedDate)
          VALUES
          ('1', '1', '1', '1', 1);
        INSERT INTO sessions (id, conversationId, json) VALUES
          ('1', '1', '{}');
        INSERT INTO signedPreKeys (id, json) VALUES
          ('1', '{}');
        INSERT INTO preKeys (id, json) VALUES
          ('1', '{}');
        INSERT INTO items (id, json) VALUES
          ('identityKey', '{}'),
          ('registrationId', '{}');
        `);
      const senderKeyCount = db.prepare("SELECT COUNT(*) FROM senderKeys").pluck();
      const sessionCount = db.prepare("SELECT COUNT(*) FROM sessions").pluck();
      const signedPreKeyCount = db.prepare("SELECT COUNT(*) FROM signedPreKeys").pluck();
      const preKeyCount = db.prepare("SELECT COUNT(*) FROM preKeys").pluck();
      const itemCount = db.prepare("SELECT COUNT(*) FROM items").pluck();
      import_chai.assert.strictEqual(senderKeyCount.get(), 1);
      import_chai.assert.strictEqual(sessionCount.get(), 1);
      import_chai.assert.strictEqual(signedPreKeyCount.get(), 1);
      import_chai.assert.strictEqual(preKeyCount.get(), 1);
      import_chai.assert.strictEqual(itemCount.get(), 2);
      updateToVersion(41);
      import_chai.assert.strictEqual(senderKeyCount.get(), 0);
      import_chai.assert.strictEqual(sessionCount.get(), 0);
      import_chai.assert.strictEqual(signedPreKeyCount.get(), 0);
      import_chai.assert.strictEqual(preKeyCount.get(), 0);
      import_chai.assert.strictEqual(itemCount.get(), 0);
    });
    it("adds prefix to preKeys/signedPreKeys", () => {
      updateToVersion(40);
      addOurUuid();
      const signedKeyItem = { id: 1 };
      const preKeyItem = { id: 2 };
      db.exec(`
        INSERT INTO signedPreKeys (id, json) VALUES
          (1, '${JSON.stringify(signedKeyItem)}');
        INSERT INTO preKeys (id, json) VALUES
          (2, '${JSON.stringify(preKeyItem)}');
        `);
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM signedPreKeys").all()), [
        {
          id: `${OUR_UUID}:1`,
          json: {
            id: `${OUR_UUID}:1`,
            keyId: 1,
            ourUuid: OUR_UUID
          }
        }
      ]);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM preKeys").all()), [
        {
          id: `${OUR_UUID}:2`,
          json: {
            id: `${OUR_UUID}:2`,
            keyId: 2,
            ourUuid: OUR_UUID
          }
        }
      ]);
    });
    it("migrates senderKeys", () => {
      updateToVersion(40);
      addOurUuid();
      db.exec(`
        INSERT INTO conversations (id, uuid) VALUES
          ('${THEIR_CONVO}', '${THEIR_UUID}');

        INSERT INTO senderKeys
          (id, senderId, distributionId, data, lastUpdatedDate)
          VALUES
          ('${THEIR_CONVO}.1--234', '${THEIR_CONVO}.1', '234', '1', 1);
        `);
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(db.prepare("SELECT * FROM senderKeys").all(), [
        {
          id: `${OUR_UUID}:${THEIR_UUID}.1--234`,
          distributionId: "234",
          data: "1",
          lastUpdatedDate: 1,
          senderId: `${THEIR_UUID}.1`
        }
      ]);
    });
    it("removes senderKeys that do not have conversation uuid", () => {
      updateToVersion(40);
      addOurUuid();
      db.exec(`
        INSERT INTO conversations (id) VALUES
          ('${THEIR_CONVO}');

        INSERT INTO senderKeys
          (id, senderId, distributionId, data, lastUpdatedDate)
          VALUES
          ('${THEIR_CONVO}.1--234', '${THEIR_CONVO}.1', '234', '1', 1),
          ('${ANOTHER_CONVO}.1--234', '${ANOTHER_CONVO}.1', '234', '1', 1);
        `);
      updateToVersion(41);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM senderKeys").pluck().get(), 0);
    });
    it("correctly merges senderKeys for conflicting conversations", () => {
      updateToVersion(40);
      addOurUuid();
      const fullA = (0, import_uuid.v4)();
      const fullB = (0, import_uuid.v4)();
      const fullC = (0, import_uuid.v4)();
      const partial = (0, import_uuid.v4)();
      db.exec(`
        INSERT INTO conversations (id, uuid, e164, active_at) VALUES
          ('${fullA}', '${THEIR_UUID}', '+12125555555', 1),
          ('${fullB}', '${THEIR_UUID}', '+12125555555', 2),
          ('${fullC}', '${THEIR_UUID}', '+12125555555', 3),
          ('${partial}', '${THEIR_UUID}', NULL, 3);

        INSERT INTO senderKeys
          (id, senderId, distributionId, data, lastUpdatedDate)
        VALUES
          ('${fullA}.1--234', '${fullA}.1', 'fullA', '1', 1),
          ('${fullC}.1--234', '${fullC}.1', 'fullC', '2', 2),
          ('${fullB}.1--234', '${fullB}.1', 'fullB', '3', 2),
          ('${partial}.1--234', '${partial}.1', 'partial', '4', 2);
        `);
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(db.prepare("SELECT * FROM senderKeys").all(), [
        {
          id: `${OUR_UUID}:${THEIR_UUID}.1--234`,
          senderId: `${THEIR_UUID}.1`,
          distributionId: "fullC",
          lastUpdatedDate: 2,
          data: "2"
        }
      ]);
    });
    it("migrates sessions", () => {
      updateToVersion(40);
      addOurUuid();
      db.exec(`
        INSERT INTO conversations (id, uuid) VALUES
          ('${THEIR_CONVO}', '${THEIR_UUID}');
        `);
      insertSession(THEIR_CONVO, 1);
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM sessions").all()), [
        {
          conversationId: THEIR_CONVO,
          id: `${OUR_UUID}:${THEIR_UUID}.1`,
          uuid: THEIR_UUID,
          ourUuid: OUR_UUID,
          json: {
            id: `${OUR_UUID}:${THEIR_UUID}.1`,
            conversationId: THEIR_CONVO,
            uuid: THEIR_UUID,
            ourUuid: OUR_UUID
          }
        }
      ]);
    });
    it("removes sessions that do not have conversation id", () => {
      updateToVersion(40);
      addOurUuid();
      insertSession(THEIR_CONVO, 1);
      updateToVersion(41);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM sessions").pluck().get(), 0);
    });
    it("removes sessions that do not have conversation uuid", () => {
      updateToVersion(40);
      addOurUuid();
      db.exec(`
        INSERT INTO conversations (id) VALUES ('${THEIR_CONVO}');
        `);
      insertSession(THEIR_CONVO, 1);
      updateToVersion(41);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM sessions").pluck().get(), 0);
    });
    it("correctly merges sessions for conflicting conversations", () => {
      updateToVersion(40);
      addOurUuid();
      const fullA = (0, import_uuid.v4)();
      const fullB = (0, import_uuid.v4)();
      const partial = (0, import_uuid.v4)();
      db.exec(`
        INSERT INTO conversations (id, uuid, e164, active_at) VALUES
          ('${fullA}', '${THEIR_UUID}', '+12125555555', 1),
          ('${fullB}', '${THEIR_UUID}', '+12125555555', 2),
          ('${partial}', '${THEIR_UUID}', NULL, 3);
        `);
      insertSession(fullA, 1, { name: "A" });
      insertSession(fullB, 1, { name: "B" });
      insertSession(partial, 1, { name: "C" });
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM sessions").all()), [
        {
          id: `${OUR_UUID}:${THEIR_UUID}.1`,
          conversationId: fullB,
          ourUuid: OUR_UUID,
          uuid: THEIR_UUID,
          json: {
            id: `${OUR_UUID}:${THEIR_UUID}.1`,
            conversationId: fullB,
            ourUuid: OUR_UUID,
            uuid: THEIR_UUID,
            name: "B"
          }
        }
      ]);
    });
    it("moves identity key and registration id into a map", () => {
      updateToVersion(40);
      addOurUuid();
      const items = [
        { id: "identityKey", value: "secret" },
        { id: "registrationId", value: 42 }
      ];
      for (const item of items) {
        db.prepare(`
          INSERT INTO items (id, json) VALUES ($id, $json);
          `).run({
          id: item.id,
          json: JSON.stringify(item)
        });
      }
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM items ORDER BY id").all()), [
        {
          id: "identityKeyMap",
          json: {
            id: "identityKeyMap",
            value: { [OUR_UUID]: "secret" }
          }
        },
        {
          id: "registrationIdMap",
          json: {
            id: "registrationIdMap",
            value: { [OUR_UUID]: 42 }
          }
        },
        {
          id: "uuid_id",
          json: {
            id: "uuid_id",
            value: `${OUR_UUID}.1`
          }
        }
      ]);
    });
    it("migrates other users' identity keys", () => {
      updateToVersion(40);
      addOurUuid();
      db.exec(`
        INSERT INTO conversations (id, uuid) VALUES
          ('${THEIR_CONVO}', '${THEIR_UUID}'),
          ('${ANOTHER_CONVO}', NULL);
        `);
      const identityKeys = [
        { id: THEIR_CONVO },
        { id: ANOTHER_CONVO },
        { id: THIRD_CONVO }
      ];
      for (const key of identityKeys) {
        db.prepare(`
            INSERT INTO identityKeys (id, json) VALUES ($id, $json);
          `).run({
          id: key.id,
          json: JSON.stringify(key)
        });
      }
      updateToVersion(41);
      import_chai.assert.deepStrictEqual(parseItems(db.prepare("SELECT * FROM identityKeys ORDER BY id").all()), [
        {
          id: THEIR_UUID,
          json: {
            id: THEIR_UUID
          }
        },
        {
          id: `conversation:${ANOTHER_CONVO}`,
          json: {
            id: `conversation:${ANOTHER_CONVO}`
          }
        },
        {
          id: `conversation:${THIRD_CONVO}`,
          json: {
            id: `conversation:${THIRD_CONVO}`
          }
        }
      ].sort((a, b) => {
        if (a.id === b.id) {
          return 0;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 1;
      }));
    });
  });
  describe("updateToSchemaVersion42", () => {
    const MESSAGE_ID_1 = (0, import_uuid.v4)();
    const MESSAGE_ID_2 = (0, import_uuid.v4)();
    const MESSAGE_ID_3 = (0, import_uuid.v4)();
    const MESSAGE_ID_4 = (0, import_uuid.v4)();
    const CONVERSATION_ID = (0, import_uuid.v4)();
    it("deletes orphaned reactions", () => {
      updateToVersion(41);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, body)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'message number 1'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'message number 2');
        INSERT INTO reactions (messageId, conversationId) VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}'),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}');
        `);
      const reactionCount = db.prepare("SELECT COUNT(*) FROM reactions;").pluck();
      const messageCount = db.prepare("SELECT COUNT(*) FROM messages;").pluck();
      import_chai.assert.strictEqual(reactionCount.get(), 4);
      import_chai.assert.strictEqual(messageCount.get(), 2);
      updateToVersion(42);
      import_chai.assert.strictEqual(reactionCount.get(), 2);
      import_chai.assert.strictEqual(messageCount.get(), 2);
      const reactionMessageIds = db.prepare("SELECT messageId FROM reactions;").pluck().all();
      import_chai.assert.sameDeepMembers(reactionMessageIds, [MESSAGE_ID_1, MESSAGE_ID_2]);
    });
    it("new message delete trigger deletes reactions as well", () => {
      updateToVersion(41);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, body)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'message number 1'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'message number 2'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'message number 3');
        INSERT INTO reactions (messageId, conversationId) VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}');
        `);
      const reactionCount = db.prepare("SELECT COUNT(*) FROM reactions;").pluck();
      const messageCount = db.prepare("SELECT COUNT(*) FROM messages;").pluck();
      import_chai.assert.strictEqual(reactionCount.get(), 3);
      import_chai.assert.strictEqual(messageCount.get(), 3);
      updateToVersion(42);
      import_chai.assert.strictEqual(reactionCount.get(), 3);
      import_chai.assert.strictEqual(messageCount.get(), 3);
      db.exec(`
        DELETE FROM messages WHERE id = '${MESSAGE_ID_1}';
        `);
      import_chai.assert.strictEqual(reactionCount.get(), 2);
      import_chai.assert.strictEqual(messageCount.get(), 2);
      const reactionMessageIds = db.prepare("SELECT messageId FROM reactions;").pluck().all();
      import_chai.assert.sameDeepMembers(reactionMessageIds, [MESSAGE_ID_2, MESSAGE_ID_3]);
    });
  });
  describe("updateToSchemaVersion43", () => {
    it("remaps conversation ids to UUIDs in groups and messages", () => {
      updateToVersion(42);
      const UUID_A = (0, import_uuid.v4)();
      const UUID_B = (0, import_uuid.v4)();
      const UUID_C = (0, import_uuid.v4)();
      const rawConvoA = { id: "a", groupId: "gv2a", uuid: UUID_A };
      const rawConvoB = { id: "b", groupId: "gv2b", uuid: UUID_B };
      const rawConvoC = {
        id: "c",
        groupId: "gv2c",
        uuid: UUID_C,
        membersV2: [
          { conversationId: "a", joinedAtVersion: 1 },
          { conversationId: "b", joinedAtVersion: 2 },
          { conversationId: "z", joinedAtVersion: 3 }
        ],
        pendingMembersV2: [
          { conversationId: "a", addedByUserId: "b", timestamp: 4 },
          { conversationId: "b", addedByUserId: UUID_A, timestamp: 5 },
          { conversationId: "z", timestamp: 6 }
        ],
        pendingAdminApprovalV2: [
          { conversationId: "a", timestamp: 6 },
          { conversationId: "b", timestamp: 7 },
          { conversationId: "z", timestamp: 8 }
        ]
      };
      const CHANGE_TYPES = [
        "member-add",
        "member-add-from-link",
        "member-add-from-admin-approval",
        "member-privilege",
        "member-remove",
        "pending-add-one",
        "admin-approval-add-one"
      ];
      const CHANGE_TYPES_WITH_INVITER = [
        "member-add-from-invite",
        "pending-remove-one",
        "pending-remove-many",
        "admin-approval-remove-one"
      ];
      db.exec(`
        INSERT INTO conversations
          (id, uuid, json)
          VALUES
          ('a', '${UUID_A}', '${JSON.stringify(rawConvoA)}'),
          ('b', '${UUID_B}', '${JSON.stringify(rawConvoB)}'),
          ('c', '${UUID_C}', '${JSON.stringify(rawConvoC)}');

        INSERT INTO messages
          (id, json)
          VALUES
          ('m', '${JSON.stringify({
        id: "m",
        groupV2Change: {
          from: "a",
          details: [
            ...CHANGE_TYPES.map((type) => ({ type, conversationId: "b" })),
            ...CHANGE_TYPES_WITH_INVITER.map((type) => {
              return { type, conversationId: "c", inviter: "a" };
            })
          ]
        },
        sourceUuid: "a",
        invitedGV2Members: [
          {
            conversationId: "b",
            addedByUserId: "c"
          }
        ]
      })}'),
          ('n', '${JSON.stringify({
        id: "n",
        groupV2Change: {
          from: "not-found",
          details: []
        },
        sourceUuid: "a"
      })}');
        `);
      updateToVersion(43);
      const { members, json: convoJSON } = db.prepare('SELECT members, json FROM conversations WHERE id = "c"').get();
      import_chai.assert.strictEqual(members, `${UUID_A} ${UUID_B}`);
      import_chai.assert.deepStrictEqual(JSON.parse(convoJSON), {
        id: "c",
        groupId: "gv2c",
        uuid: UUID_C,
        membersV2: [
          { uuid: UUID_A, joinedAtVersion: 1 },
          { uuid: UUID_B, joinedAtVersion: 2 }
        ],
        pendingMembersV2: [
          { uuid: UUID_A, addedByUserId: UUID_B, timestamp: 4 },
          { uuid: UUID_B, addedByUserId: UUID_A, timestamp: 5 }
        ],
        pendingAdminApprovalV2: [
          { uuid: UUID_A, timestamp: 6 },
          { uuid: UUID_B, timestamp: 7 }
        ]
      });
      const { json: messageMJSON } = db.prepare('SELECT  json FROM messages WHERE id = "m"').get();
      import_chai.assert.deepStrictEqual(JSON.parse(messageMJSON), {
        id: "m",
        groupV2Change: {
          from: UUID_A,
          details: [
            ...CHANGE_TYPES.map((type) => ({ type, uuid: UUID_B })),
            ...CHANGE_TYPES_WITH_INVITER.map((type) => {
              return {
                type,
                uuid: UUID_C,
                inviter: UUID_A
              };
            })
          ]
        },
        sourceUuid: UUID_A,
        invitedGV2Members: [
          {
            uuid: UUID_B,
            addedByUserId: UUID_C
          }
        ]
      });
      const { json: messageNJSON } = db.prepare('SELECT  json FROM messages WHERE id = "n"').get();
      import_chai.assert.deepStrictEqual(JSON.parse(messageNJSON), {
        id: "n",
        groupV2Change: {
          details: []
        },
        sourceUuid: UUID_A
      });
    });
    it("should not fail on invalid UUIDs", () => {
      updateToVersion(42);
      db.exec(`
        INSERT INTO messages
          (id, json)
          VALUES
          ('m', '${JSON.stringify({
        id: "m",
        sourceUuid: "ffffffff-ffff-ffff-ffff-ffffffffffff"
      })}');
        `);
      updateToVersion(43);
      const { json: messageMJSON } = db.prepare('SELECT json FROM messages WHERE id = "m"').get();
      import_chai.assert.deepStrictEqual(JSON.parse(messageMJSON), {
        id: "m",
        sourceUuid: "ffffffff-ffff-ffff-ffff-ffffffffffff"
      });
    });
  });
  describe("updateToSchemaVersion45", () => {
    it("creates new storyId field and delete trigger for storyReads", () => {
      const AUTHOR_ID = (0, import_uuid.v4)();
      const STORY_ID_1 = (0, import_uuid.v4)();
      const STORY_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const MESSAGE_ID_5 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(45);
      db.exec(`
        INSERT INTO messages
          (id, storyId, conversationId, type, body)
          VALUES
          ('${MESSAGE_ID_1}', '${STORY_ID_1}', '${CONVERSATION_ID}', 'story', 'story 1'),
          ('${MESSAGE_ID_2}', '${STORY_ID_2}', '${CONVERSATION_ID}', 'story', 'story 2'),
          ('${MESSAGE_ID_3}', '${STORY_ID_1}', '${CONVERSATION_ID}', 'outgoing', 'reply to story 1'),
          ('${MESSAGE_ID_4}', '${STORY_ID_1}', '${CONVERSATION_ID}', 'incoming', 'reply to story 1'),
          ('${MESSAGE_ID_5}', '${STORY_ID_2}', '${CONVERSATION_ID}', 'outgoing', 'reply to story 2');

        INSERT INTO storyReads (authorId, conversationId, storyId, storyReadDate) VALUES
          ('${AUTHOR_ID}', '${CONVERSATION_ID}', '${STORY_ID_1}', ${Date.now()}),
          ('${AUTHOR_ID}', '${CONVERSATION_ID}', '${STORY_ID_2}', ${Date.now()});     `);
      const storyReadCount = db.prepare("SELECT COUNT(*) FROM storyReads;").pluck();
      const messageCount = db.prepare("SELECT COUNT(*) FROM messages;").pluck();
      import_chai.assert.strictEqual(storyReadCount.get(), 2);
      import_chai.assert.strictEqual(messageCount.get(), 5);
      db.exec(`DELETE FROM messages WHERE id = '${MESSAGE_ID_1}';`);
      import_chai.assert.strictEqual(storyReadCount.get(), 1);
      import_chai.assert.strictEqual(messageCount.get(), 4);
      db.exec(`DELETE FROM messages WHERE storyId = '${STORY_ID_1}';`);
      import_chai.assert.strictEqual(storyReadCount.get(), 1);
      import_chai.assert.strictEqual(messageCount.get(), 2);
      const storyReadIds = db.prepare("SELECT storyId FROM storyReads;").pluck().all();
      import_chai.assert.sameDeepMembers(storyReadIds, [STORY_ID_2]);
    });
    it("creates new storyDistributions/Members with cascade delete", () => {
      const LIST_ID_1 = (0, import_uuid.v4)();
      const LIST_ID_2 = (0, import_uuid.v4)();
      const UUID_1 = (0, import_uuid.v4)();
      const UUID_2 = (0, import_uuid.v4)();
      const UUID_3 = (0, import_uuid.v4)();
      const UUID_4 = (0, import_uuid.v4)();
      updateToVersion(45);
      db.exec(`
        INSERT INTO storyDistributions
          (id, name)
          VALUES
          ('${LIST_ID_1}', 'distribution list 1'),
          ('${LIST_ID_2}', 'distrubution list 2');

        INSERT INTO storyDistributionMembers (listId, uuid) VALUES
          ('${LIST_ID_1}', '${UUID_1}'),
          ('${LIST_ID_1}', '${UUID_2}'),
          ('${LIST_ID_1}', '${UUID_3}'),
          ('${LIST_ID_1}', '${UUID_4}'),
          ('${LIST_ID_2}', '${UUID_1}'),
          ('${LIST_ID_2}', '${UUID_2}');
        `);
      const listCount = db.prepare("SELECT COUNT(*) FROM storyDistributions;").pluck();
      const memberCount = db.prepare("SELECT COUNT(*) FROM storyDistributionMembers;").pluck();
      import_chai.assert.strictEqual(listCount.get(), 2);
      import_chai.assert.strictEqual(memberCount.get(), 6);
      db.exec(`DELETE FROM storyDistributions WHERE id = '${LIST_ID_1}';`);
      import_chai.assert.strictEqual(listCount.get(), 1);
      import_chai.assert.strictEqual(memberCount.get(), 2);
      const members = db.prepare("SELECT uuid FROM storyDistributionMembers;").pluck().all();
      import_chai.assert.sameDeepMembers(members, [UUID_1, UUID_2]);
    });
  });
  describe("updateToSchemaVersion47", () => {
    it("creates and pre-populates new isChangeCreatedByUs field", () => {
      const OTHER_UUID = (0, import_uuid.v4)();
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(46);
      const uuidItem = JSON.stringify({
        value: `${OUR_UUID}.4`
      });
      const changeFromUs = JSON.stringify({
        groupV2Change: {
          from: OUR_UUID,
          details: [
            {
              type: "member-remove",
              uuid: OTHER_UUID
            }
          ]
        }
      });
      const changeFromOther = JSON.stringify({
        groupV2Change: {
          from: OTHER_UUID,
          details: [
            {
              type: "member-remove",
              uuid: OUR_UUID
            }
          ]
        }
      });
      db.exec(`
        INSERT INTO items (id, json) VALUES ('uuid_id', '${uuidItem}');
        INSERT INTO messages
          (id, conversationId, type, json)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'outgoing', '${changeFromUs}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'outgoing', '${changeFromOther}');
        `);
      updateToVersion(47);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 2);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isChangeCreatedByUs IS 0;").pluck().get(), 1, "zero");
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isChangeCreatedByUs IS 1;").pluck().get(), 1, "one");
    });
    it("creates new auto-generated isStory field", () => {
      const STORY_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(47);
      db.exec(`
        INSERT INTO messages
          (id, storyId, conversationId, type, body)
          VALUES
          ('${MESSAGE_ID_1}', '${STORY_ID_1}', '${CONVERSATION_ID}', 'story', 'story 1'),
          ('${MESSAGE_ID_2}', null, '${CONVERSATION_ID}', 'outgoing', 'reply to story 1'),
          ('${MESSAGE_ID_3}', null, '${CONVERSATION_ID}', null, 'null type!');
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 3);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isStory IS 0;").pluck().get(), 2);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isStory IS 1;").pluck().get(), 1);
    });
    it("creates new auto-generated shouldAffectActivity/shouldAffectPreview/isUserInitiatedMessage fields", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(47);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'story'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'keychange'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'outgoing'),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}', 'group-v2-change');
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 4);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE shouldAffectPreview IS 1;").pluck().get(), 3);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE shouldAffectActivity IS 1;").pluck().get(), 2);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isUserInitiatedMessage IS 1;").pluck().get(), 1);
    });
    it("creates new auto-generated isTimerChangeFromSync fields", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(47);
      const timerUpdate = JSON.stringify({
        expirationTimerUpdate: {
          expireTimer: 30,
          fromSync: false
        }
      });
      const timerUpdateFromSync = JSON.stringify({
        expirationTimerUpdate: {
          expireTimer: 30,
          fromSync: true
        }
      });
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, json)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'outgoing', '${timerUpdate}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'outgoing', '${timerUpdateFromSync}'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'outgoing', '{}');
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 3);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isTimerChangeFromSync IS 1;").pluck().get(), 1);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isTimerChangeFromSync IS 0;").pluck().get(), 2);
    });
    it("creates new auto-generated isGroupLeaveEvent fields", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const MESSAGE_ID_5 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      const FIRST_UUID = (0, import_uuid.v4)();
      const SECOND_UUID = (0, import_uuid.v4)();
      const THIRD_UUID = (0, import_uuid.v4)();
      updateToVersion(47);
      const memberRemoveByOther = JSON.stringify({
        groupV2Change: {
          from: FIRST_UUID,
          details: [
            {
              type: "member-remove",
              uuid: SECOND_UUID
            }
          ]
        }
      });
      const memberLeave = JSON.stringify({
        groupV2Change: {
          from: FIRST_UUID,
          details: [
            {
              type: "member-remove",
              uuid: FIRST_UUID
            }
          ]
        }
      });
      const multipleRemoves = JSON.stringify({
        groupV2Change: {
          from: FIRST_UUID,
          details: [
            {
              type: "member-remove",
              uuid: SECOND_UUID
            },
            {
              type: "member-remove",
              uuid: THIRD_UUID
            }
          ]
        }
      });
      const memberAdd = JSON.stringify({
        groupV2Change: {
          from: FIRST_UUID,
          details: [
            {
              type: "member-add",
              uuid: FIRST_UUID
            }
          ]
        }
      });
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, json)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'outgoing', '${memberLeave}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'group-v2-change', '${memberRemoveByOther}'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'group-v2-change', '${memberLeave}'),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}', 'group-v2-change', '${multipleRemoves}'),
          ('${MESSAGE_ID_5}', '${CONVERSATION_ID}', 'group-v2-change', '${memberAdd}');
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 5);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isGroupLeaveEvent IS 1;").pluck().get(), 1);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages WHERE isGroupLeaveEvent IS 0;").pluck().get(), 4);
    });
    it("ensures that index is used for getOlderMessagesByConversation", () => {
      updateToVersion(47);
      const { detail } = db.prepare(`
        EXPLAIN QUERY PLAN
        SELECT json FROM messages WHERE
          conversationId = 'd8b05bb1-36b3-4478-841b-600af62321eb' AND
          (NULL IS NULL OR id IS NOT NULL) AND
          isStory IS 0 AND
          storyId IS NULL AND
          (
            (received_at = 17976931348623157 AND sent_at < NULL) OR
            received_at < 17976931348623157
          )
        ORDER BY received_at DESC, sent_at DESC
        LIMIT 10;
        `).get();
      import_chai.assert.notInclude(detail, "B-TREE");
      import_chai.assert.notInclude(detail, "SCAN");
      import_chai.assert.include(detail, "SEARCH messages USING INDEX messages_conversation (conversationId=? AND isStory=? AND storyId=? AND received_at<?)");
    });
  });
  describe("updateToSchemaVersion48", () => {
    it("creates usable index for hasUserInitiatedMessages", () => {
      updateToVersion(48);
      const details = db.prepare(`
        EXPLAIN QUERY PLAN
        SELECT COUNT(*) as count FROM
          (
            SELECT 1 FROM messages
            WHERE
              conversationId = 'convo' AND
              isUserInitiatedMessage = 1
            LIMIT 1
          );
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(details, "SEARCH messages USING INDEX message_user_initiated (conversationId=? AND isUserInitiatedMessage=?)");
    });
  });
  describe("updateToSchemaVersion49", () => {
    it("creates usable index for messages preview", () => {
      updateToVersion(49);
      const details = db.prepare(`
        EXPLAIN QUERY PLAN
        SELECT json FROM messages
        WHERE
          conversationId = 'convo' AND
          shouldAffectPreview IS 1 AND
          isGroupLeaveEventFromOther IS 0 AND
          (
            expiresAt IS NULL
            OR
            expiresAt > 123
          )
        ORDER BY received_at DESC, sent_at DESC
        LIMIT 1;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(details, "USING INDEX messages_preview");
      import_chai.assert.notInclude(details, "TEMP B-TREE");
      import_chai.assert.notInclude(details, "SCAN");
    });
  });
  describe("updateToSchemaVersion50", () => {
    it("creates usable index for messages_unread", () => {
      updateToVersion(50);
      const details = db.prepare(`
          EXPLAIN QUERY PLAN
          SELECT * FROM messages WHERE
            conversationId = 'conversation' AND
            readStatus = 'something' AND
            isStory IS 0 AND
            storyId IS NULL
          ORDER BY received_at ASC, sent_at ASC
          LIMIT 1;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(details, "USING INDEX messages_unread");
      import_chai.assert.notInclude(details, "TEMP B-TREE");
      import_chai.assert.notInclude(details, "SCAN");
    });
  });
  describe("updateToSchemaVersion51", () => {
    it("moves reactions/normal send jobs over to conversation queue", () => {
      updateToVersion(50);
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const CONVERSATION_ID_1 = (0, import_uuid.v4)();
      db.exec(`
        INSERT INTO messages
        (id, json)
        VALUES ('${MESSAGE_ID_1}', '${JSON.stringify({
        conversationId: CONVERSATION_ID_1
      })}')
        `);
      db.exec(`
        INSERT INTO jobs
          (id, timestamp, queueType, data)
          VALUES
          ('id-1', 1, 'random job', '{}'),
          ('id-2', 2, 'normal send', '{}'),
          ('id-3', 3, 'reactions', '{"messageId":"${MESSAGE_ID_1}"}'),
          ('id-4', 4, 'conversation', '{}');
        `);
      const totalJobs = db.prepare("SELECT COUNT(*) FROM jobs;").pluck();
      const normalSendJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'normal send';").pluck();
      const conversationJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'conversation';").pluck();
      const reactionJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'reactions';").pluck();
      import_chai.assert.strictEqual(totalJobs.get(), 4, "before total");
      import_chai.assert.strictEqual(normalSendJobs.get(), 1, "before normal");
      import_chai.assert.strictEqual(conversationJobs.get(), 1, "before conversation");
      import_chai.assert.strictEqual(reactionJobs.get(), 1, "before reaction");
      updateToVersion(51);
      import_chai.assert.strictEqual(totalJobs.get(), 4, "after total");
      import_chai.assert.strictEqual(normalSendJobs.get(), 0, "after normal");
      import_chai.assert.strictEqual(conversationJobs.get(), 3, "after conversation");
      import_chai.assert.strictEqual(reactionJobs.get(), 0, "after reaction");
    });
    it("updates reactions jobs with their conversationId", () => {
      updateToVersion(50);
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const CONVERSATION_ID_1 = (0, import_uuid.v4)();
      const CONVERSATION_ID_2 = (0, import_uuid.v4)();
      (0, import_Server.insertJobSync)(db, {
        id: "id-1",
        timestamp: 1,
        queueType: "reactions",
        data: {
          messageId: MESSAGE_ID_1
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-2",
        timestamp: 2,
        queueType: "reactions",
        data: {
          messageId: MESSAGE_ID_2
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-3-missing-data",
        timestamp: 3,
        queueType: "reactions"
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-4-non-string-messageId",
        timestamp: 1,
        queueType: "reactions",
        data: {
          messageId: 4
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-5-missing-message",
        timestamp: 5,
        queueType: "reactions",
        data: {
          messageId: "missing"
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-6-missing-conversation",
        timestamp: 6,
        queueType: "reactions",
        data: {
          messageId: MESSAGE_ID_3
        }
      });
      const messageJson1 = JSON.stringify({
        conversationId: CONVERSATION_ID_1
      });
      const messageJson2 = JSON.stringify({
        conversationId: CONVERSATION_ID_2
      });
      db.exec(`
        INSERT INTO messages
          (id, conversationId, json)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID_1}', '${messageJson1}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID_2}', '${messageJson2}'),
          ('${MESSAGE_ID_3}', null, '{}');
        `);
      const totalJobs = db.prepare("SELECT COUNT(*) FROM jobs;").pluck();
      const reactionJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'reactions';").pluck();
      const conversationJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'conversation';").pluck();
      import_chai.assert.strictEqual(totalJobs.get(), 6, "total jobs before");
      import_chai.assert.strictEqual(reactionJobs.get(), 6, "reaction jobs before");
      import_chai.assert.strictEqual(conversationJobs.get(), 0, "conversation jobs before");
      updateToVersion(51);
      import_chai.assert.strictEqual(totalJobs.get(), 2, "total jobs after");
      import_chai.assert.strictEqual(reactionJobs.get(), 0, "reaction jobs after");
      import_chai.assert.strictEqual(conversationJobs.get(), 2, "conversation jobs after");
      const jobs = (0, import_Server.getJobsInQueueSync)(db, "conversation");
      import_chai.assert.deepEqual(jobs, [
        {
          id: "id-1",
          timestamp: 1,
          queueType: "conversation",
          data: {
            type: "Reaction",
            conversationId: CONVERSATION_ID_1,
            messageId: MESSAGE_ID_1
          }
        },
        {
          id: "id-2",
          timestamp: 2,
          queueType: "conversation",
          data: {
            type: "Reaction",
            conversationId: CONVERSATION_ID_2,
            messageId: MESSAGE_ID_2
          }
        }
      ]);
    });
    it("updates normal send jobs with their conversationId", () => {
      updateToVersion(50);
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const CONVERSATION_ID_1 = (0, import_uuid.v4)();
      const CONVERSATION_ID_2 = (0, import_uuid.v4)();
      (0, import_Server.insertJobSync)(db, {
        id: "id-1",
        timestamp: 1,
        queueType: "normal send",
        data: {
          conversationId: CONVERSATION_ID_1,
          messageId: MESSAGE_ID_1
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-2",
        timestamp: 2,
        queueType: "normal send",
        data: {
          conversationId: CONVERSATION_ID_2,
          messageId: MESSAGE_ID_2
        }
      });
      (0, import_Server.insertJobSync)(db, {
        id: "id-3-missing-data",
        timestamp: 3,
        queueType: "normal send"
      });
      const totalJobs = db.prepare("SELECT COUNT(*) FROM jobs;").pluck();
      const normalSend = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'normal send';").pluck();
      const conversationJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'conversation';").pluck();
      import_chai.assert.strictEqual(totalJobs.get(), 3, "total jobs before");
      import_chai.assert.strictEqual(normalSend.get(), 3, "normal send jobs before");
      import_chai.assert.strictEqual(conversationJobs.get(), 0, "conversation jobs before");
      updateToVersion(51);
      import_chai.assert.strictEqual(totalJobs.get(), 2, "total jobs after");
      import_chai.assert.strictEqual(normalSend.get(), 0, "normal send jobs after");
      import_chai.assert.strictEqual(conversationJobs.get(), 2, "conversation jobs after");
      const jobs = (0, import_Server.getJobsInQueueSync)(db, "conversation");
      import_chai.assert.deepEqual(jobs, [
        {
          id: "id-1",
          timestamp: 1,
          queueType: "conversation",
          data: {
            type: "NormalMessage",
            conversationId: CONVERSATION_ID_1,
            messageId: MESSAGE_ID_1
          }
        },
        {
          id: "id-2",
          timestamp: 2,
          queueType: "conversation",
          data: {
            type: "NormalMessage",
            conversationId: CONVERSATION_ID_2,
            messageId: MESSAGE_ID_2
          }
        }
      ]);
    });
  });
  describe("updateToSchemaVersion52", () => {
    const queries = [
      {
        query: `
          EXPLAIN QUERY PLAN
          SELECT * FROM messages WHERE
            conversationId = 'conversation' AND
            readStatus = 'something' AND
            isStory IS 0 AND
            :story_id_predicate:
          ORDER BY received_at ASC, sent_at ASC
          LIMIT 1;
        `,
        index: "messages_unread"
      },
      {
        query: `
          EXPLAIN QUERY PLAN
          SELECT json FROM messages WHERE
            conversationId = 'd8b05bb1-36b3-4478-841b-600af62321eb' AND
            (NULL IS NULL OR id IS NOT NULL) AND
            isStory IS 0 AND
            :story_id_predicate: AND
            (
              (received_at = 17976931348623157 AND sent_at < NULL) OR
              received_at < 17976931348623157
            )
          ORDER BY received_at DESC, sent_at DESC
          LIMIT 10;
        `,
        index: "messages_conversation"
      }
    ];
    function insertPredicate(query, storyId) {
      return query.replaceAll(":story_id_predicate:", (0, import_Server._storyIdPredicate)(storyId));
    }
    it("produces optimizable queries for present and absent storyId", () => {
      updateToVersion(52);
      for (const storyId of ["123", void 0]) {
        for (const { query, index } of queries) {
          const details = db.prepare(insertPredicate(query, storyId)).all({ storyId }).map(({ detail }) => detail).join("\n");
          const postfixedIndex = index + (storyId ? "" : "_no_story_id");
          import_chai.assert.include(details, `USING INDEX ${postfixedIndex} `);
          import_chai.assert.notInclude(details, "TEMP B-TREE");
          import_chai.assert.notInclude(details, "SCAN");
        }
      }
    });
  });
  describe("updateToSchemaVersion53", () => {
    it("remaps bannedMembersV2 to array of objects", () => {
      updateToVersion(52);
      const UUID_A = (0, import_uuid.v4)();
      const UUID_B = (0, import_uuid.v4)();
      const UUID_C = (0, import_uuid.v4)();
      const noMembers = { id: "a", groupId: "gv2a" };
      const emptyMembers = {
        id: "b",
        groupId: "gv2b",
        bannedMembersV2: []
      };
      const nonEmptyMembers = {
        id: "c",
        groupId: "gv2c",
        bannedMembersV2: [UUID_A, UUID_B]
      };
      db.exec(`
        INSERT INTO conversations
          (id, type, uuid, json)
          VALUES
          ('a', 'group', '${UUID_A}', '${JSON.stringify(noMembers)}'),
          ('b', 'group', '${UUID_B}', '${JSON.stringify(emptyMembers)}'),
          ('c', 'group', '${UUID_C}', '${JSON.stringify(nonEmptyMembers)}');
        `);
      updateToVersion(53);
      const entries = db.prepare("SELECT id, json FROM conversations ORDER BY id").all();
      import_chai.assert.deepStrictEqual(entries.map(({ id, json }) => ({ id, ...JSON.parse(json) })), [
        { id: "a", groupId: "gv2a" },
        { id: "b", groupId: "gv2b", bannedMembersV2: [] },
        {
          id: "c",
          groupId: "gv2c",
          bannedMembersV2: [
            { uuid: UUID_A, timestamp: 0 },
            { uuid: UUID_B, timestamp: 0 }
          ]
        }
      ]);
    });
  });
  describe("updateToSchemaVersion55", () => {
    it("moves existing report spam jobs to new schema", () => {
      updateToVersion(54);
      const E164_1 = "+12125550155";
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      db.exec(`
          INSERT INTO jobs
            (id, timestamp, queueType, data)
            VALUES
            ('id-1', 1, 'random job', '{}'),
            ('id-2', 2, 'report spam', '{"serverGuids": ["${MESSAGE_ID_1}"], "e164": "${E164_1}"}');
          `);
      const totalJobs = db.prepare("SELECT COUNT(*) FROM jobs;").pluck();
      const reportSpamJobs = db.prepare("SELECT COUNT(*) FROM jobs WHERE queueType = 'report spam';").pluck();
      import_chai.assert.strictEqual(totalJobs.get(), 2, "before total");
      import_chai.assert.strictEqual(reportSpamJobs.get(), 1, "before report spam");
      updateToVersion(55);
      import_chai.assert.strictEqual(totalJobs.get(), 2, "after total");
      import_chai.assert.strictEqual(reportSpamJobs.get(), 1, "after report spam");
      const jobs = (0, import_Server.getJobsInQueueSync)(db, "report spam");
      import_chai.assert.deepEqual(jobs, [
        {
          id: "id-2",
          queueType: "report spam",
          timestamp: 2,
          data: {
            serverGuids: [`${MESSAGE_ID_1}`],
            uuid: `${E164_1}`
          }
        }
      ]);
    });
  });
  describe("updateToSchemaVersion56", () => {
    it("updates unseenStatus for previously-unread messages", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const MESSAGE_ID_5 = (0, import_uuid.v4)();
      const MESSAGE_ID_6 = (0, import_uuid.v4)();
      const MESSAGE_ID_7 = (0, import_uuid.v4)();
      const MESSAGE_ID_8 = (0, import_uuid.v4)();
      const MESSAGE_ID_9 = (0, import_uuid.v4)();
      const MESSAGE_ID_10 = (0, import_uuid.v4)();
      const MESSAGE_ID_11 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(55);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, readStatus)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'call-history', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'change-number-notification', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'chat-session-refreshed', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}', 'delivery-issue', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_5}', '${CONVERSATION_ID}', 'group', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_6}', '${CONVERSATION_ID}', 'incoming', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_7}', '${CONVERSATION_ID}', 'keychange', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_8}', '${CONVERSATION_ID}', 'timer-notification', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_9}', '${CONVERSATION_ID}', 'verified-change', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_10}', '${CONVERSATION_ID}', NULL, ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_11}', '${CONVERSATION_ID}', 'other', ${import_MessageReadStatus.ReadStatus.Unread});
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 11, "starting total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 11, "starting unread count");
      updateToVersion(56);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 11, "ending total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 10, "ending unread count");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen};`).pluck().get(), 10, "ending unseen count");
      import_chai.assert.strictEqual(db.prepare("SELECT readStatus FROM messages WHERE type = 'other' LIMIT 1;").pluck().get(), import_MessageReadStatus.ReadStatus.Read, "checking read status for lone 'other' message");
    });
    it("creates usable index for getOldestUnseenMessageForConversation", () => {
      updateToVersion(56);
      const first = db.prepare(`
          EXPLAIN QUERY PLAN
          SELECT * FROM messages WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory IS 0 AND
            NULL IS NULL
          ORDER BY received_at ASC, sent_at ASC
          LIMIT 1;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(first, "USING INDEX messages_unseen_no_story", "first");
      import_chai.assert.notInclude(first, "TEMP B-TREE", "first");
      import_chai.assert.notInclude(first, "SCAN", "first");
      const second = db.prepare(`
          EXPLAIN QUERY PLAN
          SELECT * FROM messages WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory IS 0 AND
            storyId IS 'id-story-4'
          ORDER BY received_at ASC, sent_at ASC
          LIMIT 1;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(second, "USING INDEX messages_unseen_with_story", "second");
      import_chai.assert.notInclude(second, "TEMP B-TREE", "second");
      import_chai.assert.notInclude(second, "SCAN", "second");
    });
    it("creates usable index for getUnreadByConversationAndMarkRead", () => {
      updateToVersion(56);
      const first = db.prepare(`
          EXPLAIN QUERY PLAN
          UPDATE messages
          SET
            readStatus = ${import_MessageReadStatus.ReadStatus.Read},
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Seen},
            json = json_patch(json, '{ something: "one" }')
          WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory = 0 AND
            NULL IS NULL AND
            received_at <= 2343233;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(first, "USING INDEX messages_unseen_no_story", "first");
      import_chai.assert.notInclude(first, "TEMP B-TREE", "first");
      import_chai.assert.notInclude(first, "SCAN", "first");
      const second = db.prepare(`
          EXPLAIN QUERY PLAN
          UPDATE messages
          SET
            readStatus = ${import_MessageReadStatus.ReadStatus.Read},
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Seen},
            json = json_patch(json, '{ something: "one" }')
          WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory = 0 AND
            storyId IS 'id-story-4' AND
            received_at <= 2343233;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(second, "USING INDEX messages_unseen_with_story", "second");
      import_chai.assert.notInclude(second, "TEMP B-TREE", "second");
      import_chai.assert.notInclude(second, "SCAN", "second");
    });
    it("creates usable index for getTotalUnseenForConversationSync", () => {
      updateToVersion(56);
      const first = db.prepare(`
          EXPLAIN QUERY PLAN
          SELECT count(id)
          FROM messages
          WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory IS 0 AND
            NULL IS NULL;
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(first, "USING INDEX messages_unseen_with_story", "first");
      import_chai.assert.notInclude(first, "TEMP B-TREE", "first");
      import_chai.assert.notInclude(first, "SCAN", "first");
      const second = db.prepare(`
          EXPLAIN QUERY PLAN
          SELECT count(id)
          FROM messages
          WHERE
            conversationId = 'id-conversation-4' AND
            seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen} AND
            isStory IS 0 AND
            storyId IS 'id-story-4';
        `).all().map(({ detail }) => detail).join("\n");
      import_chai.assert.include(second, "USING INDEX messages_unseen_with_story", "second");
      import_chai.assert.notInclude(second, "TEMP B-TREE", "second");
      import_chai.assert.notInclude(second, "SCAN", "second");
    });
  });
  describe("updateToSchemaVersion58", () => {
    it("updates unseenStatus for previously-unread messages", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const MESSAGE_ID_5 = (0, import_uuid.v4)();
      const MESSAGE_ID_6 = (0, import_uuid.v4)();
      const MESSAGE_ID_7 = (0, import_uuid.v4)();
      const MESSAGE_ID_8 = (0, import_uuid.v4)();
      const MESSAGE_ID_9 = (0, import_uuid.v4)();
      const MESSAGE_ID_10 = (0, import_uuid.v4)();
      const MESSAGE_ID_11 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(55);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, readStatus)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'call-history', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'change-number-notification', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'chat-session-refreshed', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}', 'delivery-issue', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_5}', '${CONVERSATION_ID}', 'group', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_6}', '${CONVERSATION_ID}', 'incoming', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_7}', '${CONVERSATION_ID}', 'keychange', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_8}', '${CONVERSATION_ID}', 'timer-notification', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_9}', '${CONVERSATION_ID}', 'verified-change', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_10}', '${CONVERSATION_ID}', NULL, ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_11}', '${CONVERSATION_ID}', 'other', ${import_MessageReadStatus.ReadStatus.Unread});
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 11, "starting total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 11, "starting unread count");
      updateToVersion(56);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 11, "ending total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 10, "ending unread count");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE seenStatus = ${import_MessageSeenStatus.SeenStatus.Unseen};`).pluck().get(), 10, "ending unseen count");
      import_chai.assert.strictEqual(db.prepare("SELECT readStatus FROM messages WHERE type = 'other' LIMIT 1;").pluck().get(), import_MessageReadStatus.ReadStatus.Read, "checking read status for 'other' message");
    });
    it("Sets readStatus=Read for keychange and change-number-notification messages", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(57);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, readStatus)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'incoming', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'change-number-notification', ${import_MessageReadStatus.ReadStatus.Unread}),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'keychange', ${import_MessageReadStatus.ReadStatus.Unread});
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 3, "starting total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 3, "starting unread count");
      updateToVersion(58);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 3, "ending total");
      import_chai.assert.strictEqual(db.prepare(`SELECT COUNT(*) FROM messages WHERE readStatus = ${import_MessageReadStatus.ReadStatus.Unread};`).pluck().get(), 1, "ending unread count");
      import_chai.assert.strictEqual(db.prepare("SELECT readStatus FROM messages WHERE type = 'keychange' LIMIT 1;").pluck().get(), import_MessageReadStatus.ReadStatus.Read, "checking read status for 'keychange' message");
      import_chai.assert.strictEqual(db.prepare("SELECT seenStatus FROM messages WHERE type = 'keychange' LIMIT 1;").pluck().get(), import_MessageSeenStatus.SeenStatus.Unseen, "checking seen status for 'keychange' message");
    });
    it("updates readStatus/seenStatus for messages with unread: true/1 in JSON", () => {
      const MESSAGE_ID_1 = (0, import_uuid.v4)();
      const MESSAGE_ID_2 = (0, import_uuid.v4)();
      const MESSAGE_ID_3 = (0, import_uuid.v4)();
      const MESSAGE_ID_4 = (0, import_uuid.v4)();
      const CONVERSATION_ID = (0, import_uuid.v4)();
      updateToVersion(57);
      db.exec(`
        INSERT INTO messages
          (id, conversationId, type, readStatus, seenStatus, json)
          VALUES
          ('${MESSAGE_ID_1}', '${CONVERSATION_ID}', 'incoming', ${import_MessageReadStatus.ReadStatus.Unread}, NULL, '${JSON.stringify({ body: "message1" })}'),
          ('${MESSAGE_ID_2}', '${CONVERSATION_ID}', 'incoming', ${import_MessageReadStatus.ReadStatus.Read}, NULL, '${JSON.stringify({ body: "message2" })}'),
          ('${MESSAGE_ID_3}', '${CONVERSATION_ID}', 'incoming', NULL, ${import_MessageSeenStatus.SeenStatus.Unseen}, '${JSON.stringify({ body: "message3" })}'),
          ('${MESSAGE_ID_4}', '${CONVERSATION_ID}', 'incoming', NULL, ${import_MessageSeenStatus.SeenStatus.Seen}, '${JSON.stringify({ body: "message4" })}');
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM messages;").pluck().get(), 4, "starting total");
      updateToVersion(58);
      import_chai.assert.strictEqual(db.prepare(`SELECT json FROM messages WHERE id = '${MESSAGE_ID_1}' LIMIT 1;`).pluck().get(), JSON.stringify({
        body: "message1",
        readStatus: import_MessageReadStatus.ReadStatus.Unread,
        seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
      }), "checking JSON for message1");
      import_chai.assert.strictEqual(db.prepare(`SELECT json FROM messages WHERE id = '${MESSAGE_ID_2}' LIMIT 1;`).pluck().get(), JSON.stringify({ body: "message2", readStatus: import_MessageReadStatus.ReadStatus.Read }), "checking JSON for message2");
      import_chai.assert.strictEqual(db.prepare(`SELECT json FROM messages WHERE id = '${MESSAGE_ID_3}' LIMIT 1;`).pluck().get(), JSON.stringify({
        body: "message3",
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Unseen
      }), "checking JSON for message3");
      import_chai.assert.strictEqual(db.prepare(`SELECT json FROM messages WHERE id = '${MESSAGE_ID_4}' LIMIT 1;`).pluck().get(), JSON.stringify({
        body: "message4",
        readStatus: import_MessageReadStatus.ReadStatus.Read,
        seenStatus: import_MessageSeenStatus.SeenStatus.Seen
      }), "checking JSON for message4");
    });
  });
  describe("updateToSchemaVersion60", () => {
    it("updates index to make query efficient", () => {
      updateToVersion(60);
      const items = db.prepare(`
        EXPLAIN QUERY PLAN
        UPDATE messages
        INDEXED BY expiring_message_by_conversation_and_received_at
        SET
          expirationStartTimestamp = 342342,
          json = json_patch(json, '{ "something": true }')
        WHERE
          conversationId = 'conversationId' AND
          storyId IS NULL AND
          isStory IS 0 AND
          type IS 'incoming' AND
          (
            expirationStartTimestamp IS NULL OR
            expirationStartTimestamp > 23423423
          ) AND
          expireTimer > 0 AND
          received_at <= 234234;
        `).all();
      const detail = items.map((item) => item.detail).join("\n");
      import_chai.assert.notInclude(detail, "B-TREE");
      import_chai.assert.notInclude(detail, "SCAN");
      import_chai.assert.include(detail, "SEARCH messages USING INDEX expiring_message_by_conversation_and_received_at (conversationId=? AND storyId=?)");
    });
  });
  describe("updateToSchemaVersion62", () => {
    it("adds new urgent field to sendLogPayloads", () => {
      updateToVersion(62);
      const timestamp = Date.now();
      db.exec(`
        INSERT INTO sendLogPayloads
          (contentHint, timestamp, proto, urgent)
          VALUES
          (1, ${timestamp}, X'0123456789ABCDEF', 1);
        `);
      import_chai.assert.strictEqual(db.prepare("SELECT COUNT(*) FROM sendLogPayloads;").pluck().get(), 1, "starting total");
      const payload = db.prepare("SELECT * FROM sendLogPayloads LIMIT 1;").get();
      import_chai.assert.strictEqual(payload.contentHint, 1);
      import_chai.assert.strictEqual(payload.timestamp, timestamp);
      import_chai.assert.strictEqual(payload.proto.length, 8);
      import_chai.assert.strictEqual(payload.urgent, 1);
    });
  });
  describe("updateToSchemaVersion65", () => {
    it("initializes sticker pack positions", () => {
      updateToVersion(64);
      db.exec(`
        INSERT INTO sticker_packs
          (id, key, lastUsed)
          VALUES
          ("a", "key-1", 1),
          ("b", "key-2", 2),
          ("c", "key-3", 3);
        `);
      updateToVersion(65);
      import_chai.assert.deepStrictEqual(db.prepare("SELECT id, position FROM sticker_packs ORDER BY position DESC").all(), [
        { id: "a", position: 2 },
        { id: "b", position: 1 },
        { id: "c", position: 0 }
      ]);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3FsX21pZ3JhdGlvbnNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHR5cGUgeyBEYXRhYmFzZSB9IGZyb20gJ2JldHRlci1zcWxpdGUzJztcbmltcG9ydCBTUUwgZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuaW1wb3J0IHsgdjQgYXMgZ2VuZXJhdGVHdWlkIH0gZnJvbSAndXVpZCc7XG5cbmltcG9ydCB7IFNDSEVNQV9WRVJTSU9OUyB9IGZyb20gJy4uL3NxbC9taWdyYXRpb25zJztcbmltcG9ydCB7IGNvbnNvbGVMb2dnZXIgfSBmcm9tICcuLi91dGlsL2NvbnNvbGVMb2dnZXInO1xuaW1wb3J0IHtcbiAgZ2V0Sm9ic0luUXVldWVTeW5jLFxuICBpbnNlcnRKb2JTeW5jLFxuICBfc3RvcnlJZFByZWRpY2F0ZSxcbn0gZnJvbSAnLi4vc3FsL1NlcnZlcic7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi4vbWVzc2FnZXMvTWVzc2FnZVJlYWRTdGF0dXMnO1xuaW1wb3J0IHsgU2VlblN0YXR1cyB9IGZyb20gJy4uL01lc3NhZ2VTZWVuU3RhdHVzJztcblxuY29uc3QgT1VSX1VVSUQgPSBnZW5lcmF0ZUd1aWQoKTtcblxuZGVzY3JpYmUoJ1NRTCBtaWdyYXRpb25zIHRlc3QnLCAoKSA9PiB7XG4gIGxldCBkYjogRGF0YWJhc2U7XG5cbiAgY29uc3QgdXBkYXRlVG9WZXJzaW9uID0gKHZlcnNpb246IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHN0YXJ0VmVyc2lvbiA9IGRiLnByYWdtYSgndXNlcl92ZXJzaW9uJywgeyBzaW1wbGU6IHRydWUgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHJ1biBvZiBTQ0hFTUFfVkVSU0lPTlMpIHtcbiAgICAgIHJ1bihzdGFydFZlcnNpb24sIGRiLCBjb25zb2xlTG9nZ2VyKTtcblxuICAgICAgY29uc3QgY3VycmVudFZlcnNpb24gPSBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbicsIHsgc2ltcGxlOiB0cnVlIH0pO1xuXG4gICAgICBpZiAoY3VycmVudFZlcnNpb24gPT09IHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgTWlncmF0aW9uIHRvICR7dmVyc2lvbn0gbm90IGZvdW5kYCk7XG4gIH07XG5cbiAgY29uc3QgYWRkT3VyVXVpZCA9ICgpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgIGlkOiAndXVpZF9pZCcsXG4gICAgICB2YWx1ZTogYCR7T1VSX1VVSUR9LjFgLFxuICAgIH07XG4gICAgZGIuZXhlYyhcbiAgICAgIGBcbiAgICAgIElOU0VSVCBJTlRPIGl0ZW1zIChpZCwganNvbikgVkFMVUVTXG4gICAgICAgICgndXVpZF9pZCcsICcke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0nKTtcbiAgICAgIGBcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IHBhcnNlSXRlbXMgPSAoXG4gICAgaXRlbXM6IFJlYWRvbmx5QXJyYXk8eyBqc29uOiBzdHJpbmcgfT5cbiAgKTogQXJyYXk8dW5rbm93bj4gPT4ge1xuICAgIHJldHVybiBpdGVtcy5tYXAoaXRlbSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pdGVtLFxuICAgICAgICBqc29uOiBKU09OLnBhcnNlKGl0ZW0uanNvbiksXG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGluc2VydFNlc3Npb24gPSAoXG4gICAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgICBkZXZpY2VJZDogbnVtYmVyLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge31cbiAgKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaWQgPSBgJHtjb252ZXJzYXRpb25JZH0uJHtkZXZpY2VJZH1gO1xuICAgIGRiLnByZXBhcmUoXG4gICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIHNlc3Npb25zIChpZCwgY29udmVyc2F0aW9uSWQsIGpzb24pXG4gICAgICAgIFZBTFVFUyAoJGlkLCAkY29udmVyc2F0aW9uSWQsICRqc29uKVxuICAgICAgYFxuICAgICkucnVuKHtcbiAgICAgIGlkLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBqc29uOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGlkLFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGRiID0gbmV3IFNRTCgnOm1lbW9yeTonKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBkYi5jbG9zZSgpO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDEnLCAoKSA9PiB7XG4gICAgY29uc3QgVEhFSVJfVVVJRCA9IGdlbmVyYXRlR3VpZCgpO1xuICAgIGNvbnN0IFRIRUlSX0NPTlZPID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgY29uc3QgQU5PVEhFUl9DT05WTyA9IGdlbmVyYXRlR3VpZCgpO1xuICAgIGNvbnN0IFRISVJEX0NPTlZPID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICBpdCgnY2xlYXJzIHNlc3Npb25zIGFuZCBrZXlzIGlmIFVVSUQgaXMgbm90IGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0MCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gc2VuZGVyS2V5c1xuICAgICAgICAgIChpZCwgc2VuZGVySWQsIGRpc3RyaWJ1dGlvbklkLCBkYXRhLCBsYXN0VXBkYXRlZERhdGUpXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCcxJywgJzEnLCAnMScsICcxJywgMSk7XG4gICAgICAgIElOU0VSVCBJTlRPIHNlc3Npb25zIChpZCwgY29udmVyc2F0aW9uSWQsIGpzb24pIFZBTFVFU1xuICAgICAgICAgICgnMScsICcxJywgJ3t9Jyk7XG4gICAgICAgIElOU0VSVCBJTlRPIHNpZ25lZFByZUtleXMgKGlkLCBqc29uKSBWQUxVRVNcbiAgICAgICAgICAoJzEnLCAne30nKTtcbiAgICAgICAgSU5TRVJUIElOVE8gcHJlS2V5cyAoaWQsIGpzb24pIFZBTFVFU1xuICAgICAgICAgICgnMScsICd7fScpO1xuICAgICAgICBJTlNFUlQgSU5UTyBpdGVtcyAoaWQsIGpzb24pIFZBTFVFU1xuICAgICAgICAgICgnaWRlbnRpdHlLZXknLCAne30nKSxcbiAgICAgICAgICAoJ3JlZ2lzdHJhdGlvbklkJywgJ3t9Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHNlbmRlcktleUNvdW50ID0gZGJcbiAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHNlbmRlcktleXMnKVxuICAgICAgICAucGx1Y2soKTtcbiAgICAgIGNvbnN0IHNlc3Npb25Db3VudCA9IGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHNlc3Npb25zJykucGx1Y2soKTtcbiAgICAgIGNvbnN0IHNpZ25lZFByZUtleUNvdW50ID0gZGJcbiAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHNpZ25lZFByZUtleXMnKVxuICAgICAgICAucGx1Y2soKTtcbiAgICAgIGNvbnN0IHByZUtleUNvdW50ID0gZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gcHJlS2V5cycpLnBsdWNrKCk7XG4gICAgICBjb25zdCBpdGVtQ291bnQgPSBkYi5wcmVwYXJlKCdTRUxFQ1QgQ09VTlQoKikgRlJPTSBpdGVtcycpLnBsdWNrKCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzZW5kZXJLZXlDb3VudC5nZXQoKSwgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoc2Vzc2lvbkNvdW50LmdldCgpLCAxKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzaWduZWRQcmVLZXlDb3VudC5nZXQoKSwgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocHJlS2V5Q291bnQuZ2V0KCksIDEpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1Db3VudC5nZXQoKSwgMik7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0MSk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzZW5kZXJLZXlDb3VudC5nZXQoKSwgMCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoc2Vzc2lvbkNvdW50LmdldCgpLCAwKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzaWduZWRQcmVLZXlDb3VudC5nZXQoKSwgMCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocHJlS2V5Q291bnQuZ2V0KCksIDApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGl0ZW1Db3VudC5nZXQoKSwgMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnYWRkcyBwcmVmaXggdG8gcHJlS2V5cy9zaWduZWRQcmVLZXlzJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQwKTtcblxuICAgICAgYWRkT3VyVXVpZCgpO1xuXG4gICAgICBjb25zdCBzaWduZWRLZXlJdGVtID0geyBpZDogMSB9O1xuICAgICAgY29uc3QgcHJlS2V5SXRlbSA9IHsgaWQ6IDIgfTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBzaWduZWRQcmVLZXlzIChpZCwganNvbikgVkFMVUVTXG4gICAgICAgICAgKDEsICcke0pTT04uc3RyaW5naWZ5KHNpZ25lZEtleUl0ZW0pfScpO1xuICAgICAgICBJTlNFUlQgSU5UTyBwcmVLZXlzIChpZCwganNvbikgVkFMVUVTXG4gICAgICAgICAgKDIsICcke0pTT04uc3RyaW5naWZ5KHByZUtleUl0ZW0pfScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgICBwYXJzZUl0ZW1zKGRiLnByZXBhcmUoJ1NFTEVDVCAqIEZST00gc2lnbmVkUHJlS2V5cycpLmFsbCgpKSxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBgJHtPVVJfVVVJRH06MWAsXG4gICAgICAgICAgICBqc29uOiB7XG4gICAgICAgICAgICAgIGlkOiBgJHtPVVJfVVVJRH06MWAsXG4gICAgICAgICAgICAgIGtleUlkOiAxLFxuICAgICAgICAgICAgICBvdXJVdWlkOiBPVVJfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gICAgICAgIHBhcnNlSXRlbXMoZGIucHJlcGFyZSgnU0VMRUNUICogRlJPTSBwcmVLZXlzJykuYWxsKCkpLFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IGAke09VUl9VVUlEfToyYCxcbiAgICAgICAgICAgIGpzb246IHtcbiAgICAgICAgICAgICAgaWQ6IGAke09VUl9VVUlEfToyYCxcbiAgICAgICAgICAgICAga2V5SWQ6IDIsXG4gICAgICAgICAgICAgIG91clV1aWQ6IE9VUl9VVUlELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ21pZ3JhdGVzIHNlbmRlcktleXMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDApO1xuXG4gICAgICBhZGRPdXJVdWlkKCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gY29udmVyc2F0aW9ucyAoaWQsIHV1aWQpIFZBTFVFU1xuICAgICAgICAgICgnJHtUSEVJUl9DT05WT30nLCAnJHtUSEVJUl9VVUlEfScpO1xuXG4gICAgICAgIElOU0VSVCBJTlRPIHNlbmRlcktleXNcbiAgICAgICAgICAoaWQsIHNlbmRlcklkLCBkaXN0cmlidXRpb25JZCwgZGF0YSwgbGFzdFVwZGF0ZWREYXRlKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtUSEVJUl9DT05WT30uMS0tMjM0JywgJyR7VEhFSVJfQ09OVk99LjEnLCAnMjM0JywgJzEnLCAxKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQxKTtcblxuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChkYi5wcmVwYXJlKCdTRUxFQ1QgKiBGUk9NIHNlbmRlcktleXMnKS5hbGwoKSwgW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IGAke09VUl9VVUlEfToke1RIRUlSX1VVSUR9LjEtLTIzNGAsXG4gICAgICAgICAgZGlzdHJpYnV0aW9uSWQ6ICcyMzQnLFxuICAgICAgICAgIGRhdGE6ICcxJyxcbiAgICAgICAgICBsYXN0VXBkYXRlZERhdGU6IDEsXG4gICAgICAgICAgc2VuZGVySWQ6IGAke1RIRUlSX1VVSUR9LjFgLFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBzZW5kZXJLZXlzIHRoYXQgZG8gbm90IGhhdmUgY29udmVyc2F0aW9uIHV1aWQnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDApO1xuXG4gICAgICBhZGRPdXJVdWlkKCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gY29udmVyc2F0aW9ucyAoaWQpIFZBTFVFU1xuICAgICAgICAgICgnJHtUSEVJUl9DT05WT30nKTtcblxuICAgICAgICBJTlNFUlQgSU5UTyBzZW5kZXJLZXlzXG4gICAgICAgICAgKGlkLCBzZW5kZXJJZCwgZGlzdHJpYnV0aW9uSWQsIGRhdGEsIGxhc3RVcGRhdGVkRGF0ZSlcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7VEhFSVJfQ09OVk99LjEtLTIzNCcsICcke1RIRUlSX0NPTlZPfS4xJywgJzIzNCcsICcxJywgMSksXG4gICAgICAgICAgKCcke0FOT1RIRVJfQ09OVk99LjEtLTIzNCcsICcke0FOT1RIRVJfQ09OVk99LjEnLCAnMjM0JywgJzEnLCAxKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQxKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYi5wcmVwYXJlKCdTRUxFQ1QgQ09VTlQoKikgRlJPTSBzZW5kZXJLZXlzJykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIHNlbmRlcktleXMgZm9yIGNvbmZsaWN0aW5nIGNvbnZlcnNhdGlvbnMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDApO1xuXG4gICAgICBhZGRPdXJVdWlkKCk7XG5cbiAgICAgIGNvbnN0IGZ1bGxBID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBmdWxsQiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgZnVsbEMgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IHBhcnRpYWwgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgLy8gV2hlbiBtZXJnaW5nIHR3byBrZXlzIGZvciBkaWZmZXJlbnQgY29udmVyc2F0aW9ucyB3aXRoIHRoZSBzYW1lIHV1aWRcbiAgICAgIC8vIG9ubHkgdGhlIG1vc3QgcmVjZW50IGtleSB3b3VsZCBiZSBrZXB0IGluIHRoZSBkYXRhYmFzZS4gV2UgcHJlZmVyIGtleXNcbiAgICAgIC8vIHdpdGggZWl0aGVyOlxuICAgICAgLy9cbiAgICAgIC8vIDEuIG1vcmUgcmVjZW50IGxhc3RVcGRhdGVkRGF0ZSBjb2x1bW5cbiAgICAgIC8vIDIuIGNvbnZlcnNhdGlvbiB3aXRoIGJvdGggZTE2NCBhbmQgdXVpZFxuICAgICAgLy8gMy4gY29udmVyc2F0aW9uIHdpdGggbW9yZSByZWNlbnQgYWN0aXZlX2F0XG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGNvbnZlcnNhdGlvbnMgKGlkLCB1dWlkLCBlMTY0LCBhY3RpdmVfYXQpIFZBTFVFU1xuICAgICAgICAgICgnJHtmdWxsQX0nLCAnJHtUSEVJUl9VVUlEfScsICcrMTIxMjU1NTU1NTUnLCAxKSxcbiAgICAgICAgICAoJyR7ZnVsbEJ9JywgJyR7VEhFSVJfVVVJRH0nLCAnKzEyMTI1NTU1NTU1JywgMiksXG4gICAgICAgICAgKCcke2Z1bGxDfScsICcke1RIRUlSX1VVSUR9JywgJysxMjEyNTU1NTU1NScsIDMpLFxuICAgICAgICAgICgnJHtwYXJ0aWFsfScsICcke1RIRUlSX1VVSUR9JywgTlVMTCwgMyk7XG5cbiAgICAgICAgSU5TRVJUIElOVE8gc2VuZGVyS2V5c1xuICAgICAgICAgIChpZCwgc2VuZGVySWQsIGRpc3RyaWJ1dGlvbklkLCBkYXRhLCBsYXN0VXBkYXRlZERhdGUpXG4gICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtmdWxsQX0uMS0tMjM0JywgJyR7ZnVsbEF9LjEnLCAnZnVsbEEnLCAnMScsIDEpLFxuICAgICAgICAgICgnJHtmdWxsQ30uMS0tMjM0JywgJyR7ZnVsbEN9LjEnLCAnZnVsbEMnLCAnMicsIDIpLFxuICAgICAgICAgICgnJHtmdWxsQn0uMS0tMjM0JywgJyR7ZnVsbEJ9LjEnLCAnZnVsbEInLCAnMycsIDIpLFxuICAgICAgICAgICgnJHtwYXJ0aWFsfS4xLS0yMzQnLCAnJHtwYXJ0aWFsfS4xJywgJ3BhcnRpYWwnLCAnNCcsIDIpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKGRiLnByZXBhcmUoJ1NFTEVDVCAqIEZST00gc2VuZGVyS2V5cycpLmFsbCgpLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogYCR7T1VSX1VVSUR9OiR7VEhFSVJfVVVJRH0uMS0tMjM0YCxcbiAgICAgICAgICBzZW5kZXJJZDogYCR7VEhFSVJfVVVJRH0uMWAsXG4gICAgICAgICAgZGlzdHJpYnV0aW9uSWQ6ICdmdWxsQycsXG4gICAgICAgICAgbGFzdFVwZGF0ZWREYXRlOiAyLFxuICAgICAgICAgIGRhdGE6ICcyJyxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ21pZ3JhdGVzIHNlc3Npb25zJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQwKTtcblxuICAgICAgYWRkT3VyVXVpZCgpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGNvbnZlcnNhdGlvbnMgKGlkLCB1dWlkKSBWQUxVRVNcbiAgICAgICAgICAoJyR7VEhFSVJfQ09OVk99JywgJyR7VEhFSVJfVVVJRH0nKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgaW5zZXJ0U2Vzc2lvbihUSEVJUl9DT05WTywgMSk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0MSk7XG5cbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gICAgICAgIHBhcnNlSXRlbXMoZGIucHJlcGFyZSgnU0VMRUNUICogRlJPTSBzZXNzaW9ucycpLmFsbCgpKSxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBUSEVJUl9DT05WTyxcbiAgICAgICAgICAgIGlkOiBgJHtPVVJfVVVJRH06JHtUSEVJUl9VVUlEfS4xYCxcbiAgICAgICAgICAgIHV1aWQ6IFRIRUlSX1VVSUQsXG4gICAgICAgICAgICBvdXJVdWlkOiBPVVJfVVVJRCxcbiAgICAgICAgICAgIGpzb246IHtcbiAgICAgICAgICAgICAgaWQ6IGAke09VUl9VVUlEfToke1RIRUlSX1VVSUR9LjFgLFxuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogVEhFSVJfQ09OVk8sXG4gICAgICAgICAgICAgIHV1aWQ6IFRIRUlSX1VVSUQsXG4gICAgICAgICAgICAgIG91clV1aWQ6IE9VUl9VVUlELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZXMgc2Vzc2lvbnMgdGhhdCBkbyBub3QgaGF2ZSBjb252ZXJzYXRpb24gaWQnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDApO1xuXG4gICAgICBhZGRPdXJVdWlkKCk7XG5cbiAgICAgIGluc2VydFNlc3Npb24oVEhFSVJfQ09OVk8sIDEpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHNlc3Npb25zJykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIHNlc3Npb25zIHRoYXQgZG8gbm90IGhhdmUgY29udmVyc2F0aW9uIHV1aWQnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDApO1xuXG4gICAgICBhZGRPdXJVdWlkKCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gY29udmVyc2F0aW9ucyAoaWQpIFZBTFVFUyAoJyR7VEhFSVJfQ09OVk99Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGluc2VydFNlc3Npb24oVEhFSVJfQ09OVk8sIDEpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHNlc3Npb25zJykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIHNlc3Npb25zIGZvciBjb25mbGljdGluZyBjb252ZXJzYXRpb25zJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQwKTtcblxuICAgICAgYWRkT3VyVXVpZCgpO1xuXG4gICAgICBjb25zdCBmdWxsQSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgZnVsbEIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IHBhcnRpYWwgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgLy8gU2ltaWxhciBtZXJnaW5nIGxvZ2ljIHRvIHNlbmRlcmtleXMgYWJvdmUuIFdlIHByZWZlciBzZXNzaW9ucyB3aXRoXG4gICAgICAvLyBlaXRoZXI6XG4gICAgICAvL1xuICAgICAgLy8gMS4gY29udmVyc2F0aW9uIHdpdGggYm90aCBlMTY0IGFuZCB1dWlkXG4gICAgICAvLyAyLiBjb252ZXJzYXRpb24gd2l0aCBtb3JlIHJlY2VudCBhY3RpdmVfYXRcbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gY29udmVyc2F0aW9ucyAoaWQsIHV1aWQsIGUxNjQsIGFjdGl2ZV9hdCkgVkFMVUVTXG4gICAgICAgICAgKCcke2Z1bGxBfScsICcke1RIRUlSX1VVSUR9JywgJysxMjEyNTU1NTU1NScsIDEpLFxuICAgICAgICAgICgnJHtmdWxsQn0nLCAnJHtUSEVJUl9VVUlEfScsICcrMTIxMjU1NTU1NTUnLCAyKSxcbiAgICAgICAgICAoJyR7cGFydGlhbH0nLCAnJHtUSEVJUl9VVUlEfScsIE5VTEwsIDMpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBpbnNlcnRTZXNzaW9uKGZ1bGxBLCAxLCB7IG5hbWU6ICdBJyB9KTtcbiAgICAgIGluc2VydFNlc3Npb24oZnVsbEIsIDEsIHsgbmFtZTogJ0InIH0pO1xuICAgICAgaW5zZXJ0U2Vzc2lvbihwYXJ0aWFsLCAxLCB7IG5hbWU6ICdDJyB9KTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQxKTtcblxuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgICAgcGFyc2VJdGVtcyhkYi5wcmVwYXJlKCdTRUxFQ1QgKiBGUk9NIHNlc3Npb25zJykuYWxsKCkpLFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IGAke09VUl9VVUlEfToke1RIRUlSX1VVSUR9LjFgLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGZ1bGxCLFxuICAgICAgICAgICAgb3VyVXVpZDogT1VSX1VVSUQsXG4gICAgICAgICAgICB1dWlkOiBUSEVJUl9VVUlELFxuICAgICAgICAgICAganNvbjoge1xuICAgICAgICAgICAgICBpZDogYCR7T1VSX1VVSUR9OiR7VEhFSVJfVVVJRH0uMWAsXG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBmdWxsQixcbiAgICAgICAgICAgICAgb3VyVXVpZDogT1VSX1VVSUQsXG4gICAgICAgICAgICAgIHV1aWQ6IFRIRUlSX1VVSUQsXG4gICAgICAgICAgICAgIG5hbWU6ICdCJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdtb3ZlcyBpZGVudGl0eSBrZXkgYW5kIHJlZ2lzdHJhdGlvbiBpZCBpbnRvIGEgbWFwJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQwKTtcblxuICAgICAgYWRkT3VyVXVpZCgpO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgICAgeyBpZDogJ2lkZW50aXR5S2V5JywgdmFsdWU6ICdzZWNyZXQnIH0sXG4gICAgICAgIHsgaWQ6ICdyZWdpc3RyYXRpb25JZCcsIHZhbHVlOiA0MiB9LFxuICAgICAgXTtcblxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgIGRiLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICAgIElOU0VSVCBJTlRPIGl0ZW1zIChpZCwganNvbikgVkFMVUVTICgkaWQsICRqc29uKTtcbiAgICAgICAgICBgXG4gICAgICAgICkucnVuKHtcbiAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICBqc29uOiBKU09OLnN0cmluZ2lmeShpdGVtKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0MSk7XG5cbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gICAgICAgIHBhcnNlSXRlbXMoZGIucHJlcGFyZSgnU0VMRUNUICogRlJPTSBpdGVtcyBPUkRFUiBCWSBpZCcpLmFsbCgpKSxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaWRlbnRpdHlLZXlNYXAnLFxuICAgICAgICAgICAganNvbjoge1xuICAgICAgICAgICAgICBpZDogJ2lkZW50aXR5S2V5TWFwJyxcbiAgICAgICAgICAgICAgdmFsdWU6IHsgW09VUl9VVUlEXTogJ3NlY3JldCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3JlZ2lzdHJhdGlvbklkTWFwJyxcbiAgICAgICAgICAgIGpzb246IHtcbiAgICAgICAgICAgICAgaWQ6ICdyZWdpc3RyYXRpb25JZE1hcCcsXG4gICAgICAgICAgICAgIHZhbHVlOiB7IFtPVVJfVVVJRF06IDQyIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICd1dWlkX2lkJyxcbiAgICAgICAgICAgIGpzb246IHtcbiAgICAgICAgICAgICAgaWQ6ICd1dWlkX2lkJyxcbiAgICAgICAgICAgICAgdmFsdWU6IGAke09VUl9VVUlEfS4xYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KFwibWlncmF0ZXMgb3RoZXIgdXNlcnMnIGlkZW50aXR5IGtleXNcIiwgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQwKTtcblxuICAgICAgYWRkT3VyVXVpZCgpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGNvbnZlcnNhdGlvbnMgKGlkLCB1dWlkKSBWQUxVRVNcbiAgICAgICAgICAoJyR7VEhFSVJfQ09OVk99JywgJyR7VEhFSVJfVVVJRH0nKSxcbiAgICAgICAgICAoJyR7QU5PVEhFUl9DT05WT30nLCBOVUxMKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgY29uc3QgaWRlbnRpdHlLZXlzID0gW1xuICAgICAgICB7IGlkOiBUSEVJUl9DT05WTyB9LFxuICAgICAgICB7IGlkOiBBTk9USEVSX0NPTlZPIH0sXG4gICAgICAgIHsgaWQ6IFRISVJEX0NPTlZPIH0sXG4gICAgICBdO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgaWRlbnRpdHlLZXlzKSB7XG4gICAgICAgIGRiLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICAgICAgSU5TRVJUIElOVE8gaWRlbnRpdHlLZXlzIChpZCwganNvbikgVkFMVUVTICgkaWQsICRqc29uKTtcbiAgICAgICAgICBgXG4gICAgICAgICkucnVuKHtcbiAgICAgICAgICBpZDoga2V5LmlkLFxuICAgICAgICAgIGpzb246IEpTT04uc3RyaW5naWZ5KGtleSksXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgICBwYXJzZUl0ZW1zKGRiLnByZXBhcmUoJ1NFTEVDVCAqIEZST00gaWRlbnRpdHlLZXlzIE9SREVSIEJZIGlkJykuYWxsKCkpLFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IFRIRUlSX1VVSUQsXG4gICAgICAgICAgICBqc29uOiB7XG4gICAgICAgICAgICAgIGlkOiBUSEVJUl9VVUlELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBgY29udmVyc2F0aW9uOiR7QU5PVEhFUl9DT05WT31gLFxuICAgICAgICAgICAganNvbjoge1xuICAgICAgICAgICAgICBpZDogYGNvbnZlcnNhdGlvbjoke0FOT1RIRVJfQ09OVk99YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogYGNvbnZlcnNhdGlvbjoke1RISVJEX0NPTlZPfWAsXG4gICAgICAgICAgICBqc29uOiB7XG4gICAgICAgICAgICAgIGlkOiBgY29udmVyc2F0aW9uOiR7VEhJUkRfQ09OVk99YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgaWYgKGEuaWQgPT09IGIuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYS5pZCA8IGIuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDInLCAoKSA9PiB7XG4gICAgY29uc3QgTUVTU0FHRV9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgY29uc3QgTUVTU0FHRV9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgY29uc3QgTUVTU0FHRV9JRF8zID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgY29uc3QgTUVTU0FHRV9JRF80ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICBpdCgnZGVsZXRlcyBvcnBoYW5lZCByZWFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDEpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgYm9keSlcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnbWVzc2FnZSBudW1iZXIgMScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzJ9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdtZXNzYWdlIG51bWJlciAyJyk7XG4gICAgICAgIElOU0VSVCBJTlRPIHJlYWN0aW9ucyAobWVzc2FnZUlkLCBjb252ZXJzYXRpb25JZCkgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfM30nLCAnJHtDT05WRVJTQVRJT05fSUR9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNH0nLCAnJHtDT05WRVJTQVRJT05fSUR9Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlYWN0aW9uQ291bnQgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gcmVhY3Rpb25zOycpXG4gICAgICAgIC5wbHVjaygpO1xuICAgICAgY29uc3QgbWVzc2FnZUNvdW50ID0gZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlYWN0aW9uQ291bnQuZ2V0KCksIDQpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG1lc3NhZ2VDb3VudC5nZXQoKSwgMik7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Mik7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkNvdW50LmdldCgpLCAyKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZXNzYWdlQ291bnQuZ2V0KCksIDIpO1xuXG4gICAgICBjb25zdCByZWFjdGlvbk1lc3NhZ2VJZHMgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIG1lc3NhZ2VJZCBGUk9NIHJlYWN0aW9uczsnKVxuICAgICAgICAucGx1Y2soKVxuICAgICAgICAuYWxsKCk7XG5cbiAgICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMocmVhY3Rpb25NZXNzYWdlSWRzLCBbTUVTU0FHRV9JRF8xLCBNRVNTQUdFX0lEXzJdKTtcbiAgICB9KTtcblxuICAgIGl0KCduZXcgbWVzc2FnZSBkZWxldGUgdHJpZ2dlciBkZWxldGVzIHJlYWN0aW9ucyBhcyB3ZWxsJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQxKTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc1xuICAgICAgICAgIChpZCwgY29udmVyc2F0aW9uSWQsIGJvZHkpXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ21lc3NhZ2UgbnVtYmVyIDEnKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnbWVzc2FnZSBudW1iZXIgMicpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzN9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdtZXNzYWdlIG51bWJlciAzJyk7XG4gICAgICAgIElOU0VSVCBJTlRPIHJlYWN0aW9ucyAobWVzc2FnZUlkLCBjb252ZXJzYXRpb25JZCkgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfM30nLCAnJHtDT05WRVJTQVRJT05fSUR9Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJlYWN0aW9uQ291bnQgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gcmVhY3Rpb25zOycpXG4gICAgICAgIC5wbHVjaygpO1xuICAgICAgY29uc3QgbWVzc2FnZUNvdW50ID0gZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlYWN0aW9uQ291bnQuZ2V0KCksIDMpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG1lc3NhZ2VDb3VudC5nZXQoKSwgMyk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Mik7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkNvdW50LmdldCgpLCAzKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZXNzYWdlQ291bnQuZ2V0KCksIDMpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gJyR7TUVTU0FHRV9JRF8xfSc7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkNvdW50LmdldCgpLCAyKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZXNzYWdlQ291bnQuZ2V0KCksIDIpO1xuXG4gICAgICBjb25zdCByZWFjdGlvbk1lc3NhZ2VJZHMgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIG1lc3NhZ2VJZCBGUk9NIHJlYWN0aW9uczsnKVxuICAgICAgICAucGx1Y2soKVxuICAgICAgICAuYWxsKCk7XG5cbiAgICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMocmVhY3Rpb25NZXNzYWdlSWRzLCBbTUVTU0FHRV9JRF8yLCBNRVNTQUdFX0lEXzNdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjQzJywgKCkgPT4ge1xuICAgIGl0KCdyZW1hcHMgY29udmVyc2F0aW9uIGlkcyB0byBVVUlEcyBpbiBncm91cHMgYW5kIG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQyKTtcblxuICAgICAgY29uc3QgVVVJRF9BID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBVVUlEX0IgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFVVSURfQyA9IGdlbmVyYXRlR3VpZCgpO1xuXG4gICAgICBjb25zdCByYXdDb252b0EgPSB7IGlkOiAnYScsIGdyb3VwSWQ6ICdndjJhJywgdXVpZDogVVVJRF9BIH07XG4gICAgICBjb25zdCByYXdDb252b0IgPSB7IGlkOiAnYicsIGdyb3VwSWQ6ICdndjJiJywgdXVpZDogVVVJRF9CIH07XG5cbiAgICAgIGNvbnN0IHJhd0NvbnZvQyA9IHtcbiAgICAgICAgaWQ6ICdjJyxcbiAgICAgICAgZ3JvdXBJZDogJ2d2MmMnLFxuICAgICAgICB1dWlkOiBVVUlEX0MsXG4gICAgICAgIG1lbWJlcnNWMjogW1xuICAgICAgICAgIHsgY29udmVyc2F0aW9uSWQ6ICdhJywgam9pbmVkQXRWZXJzaW9uOiAxIH0sXG4gICAgICAgICAgeyBjb252ZXJzYXRpb25JZDogJ2InLCBqb2luZWRBdFZlcnNpb246IDIgfSxcbiAgICAgICAgICB7IGNvbnZlcnNhdGlvbklkOiAneicsIGpvaW5lZEF0VmVyc2lvbjogMyB9LFxuICAgICAgICBdLFxuICAgICAgICBwZW5kaW5nTWVtYmVyc1YyOiBbXG4gICAgICAgICAgeyBjb252ZXJzYXRpb25JZDogJ2EnLCBhZGRlZEJ5VXNlcklkOiAnYicsIHRpbWVzdGFtcDogNCB9LFxuICAgICAgICAgIHsgY29udmVyc2F0aW9uSWQ6ICdiJywgYWRkZWRCeVVzZXJJZDogVVVJRF9BLCB0aW1lc3RhbXA6IDUgfSxcbiAgICAgICAgICB7IGNvbnZlcnNhdGlvbklkOiAneicsIHRpbWVzdGFtcDogNiB9LFxuICAgICAgICBdLFxuICAgICAgICBwZW5kaW5nQWRtaW5BcHByb3ZhbFYyOiBbXG4gICAgICAgICAgeyBjb252ZXJzYXRpb25JZDogJ2EnLCB0aW1lc3RhbXA6IDYgfSxcbiAgICAgICAgICB7IGNvbnZlcnNhdGlvbklkOiAnYicsIHRpbWVzdGFtcDogNyB9LFxuICAgICAgICAgIHsgY29udmVyc2F0aW9uSWQ6ICd6JywgdGltZXN0YW1wOiA4IH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBDSEFOR0VfVFlQRVMgPSBbXG4gICAgICAgICdtZW1iZXItYWRkJyxcbiAgICAgICAgJ21lbWJlci1hZGQtZnJvbS1saW5rJyxcbiAgICAgICAgJ21lbWJlci1hZGQtZnJvbS1hZG1pbi1hcHByb3ZhbCcsXG4gICAgICAgICdtZW1iZXItcHJpdmlsZWdlJyxcbiAgICAgICAgJ21lbWJlci1yZW1vdmUnLFxuICAgICAgICAncGVuZGluZy1hZGQtb25lJyxcbiAgICAgICAgJ2FkbWluLWFwcHJvdmFsLWFkZC1vbmUnLFxuICAgICAgXTtcblxuICAgICAgY29uc3QgQ0hBTkdFX1RZUEVTX1dJVEhfSU5WSVRFUiA9IFtcbiAgICAgICAgJ21lbWJlci1hZGQtZnJvbS1pbnZpdGUnLFxuICAgICAgICAncGVuZGluZy1yZW1vdmUtb25lJyxcbiAgICAgICAgJ3BlbmRpbmctcmVtb3ZlLW1hbnknLFxuICAgICAgICAnYWRtaW4tYXBwcm92YWwtcmVtb3ZlLW9uZScsXG4gICAgICBdO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGNvbnZlcnNhdGlvbnNcbiAgICAgICAgICAoaWQsIHV1aWQsIGpzb24pXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCdhJywgJyR7VVVJRF9BfScsICcke0pTT04uc3RyaW5naWZ5KHJhd0NvbnZvQSl9JyksXG4gICAgICAgICAgKCdiJywgJyR7VVVJRF9CfScsICcke0pTT04uc3RyaW5naWZ5KHJhd0NvbnZvQil9JyksXG4gICAgICAgICAgKCdjJywgJyR7VVVJRF9DfScsICcke0pTT04uc3RyaW5naWZ5KHJhd0NvbnZvQyl9Jyk7XG5cbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNcbiAgICAgICAgICAoaWQsIGpzb24pXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCdtJywgJyR7SlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6ICdtJyxcbiAgICAgICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICAgICAgZnJvbTogJ2EnLFxuICAgICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgICAgLi4uQ0hBTkdFX1RZUEVTLm1hcCh0eXBlID0+ICh7IHR5cGUsIGNvbnZlcnNhdGlvbklkOiAnYicgfSkpLFxuICAgICAgICAgICAgICAgIC4uLkNIQU5HRV9UWVBFU19XSVRIX0lOVklURVIubWFwKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdHlwZSwgY29udmVyc2F0aW9uSWQ6ICdjJywgaW52aXRlcjogJ2EnIH07XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlVXVpZDogJ2EnLFxuICAgICAgICAgICAgaW52aXRlZEdWMk1lbWJlcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiAnYicsXG4gICAgICAgICAgICAgICAgYWRkZWRCeVVzZXJJZDogJ2MnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KX0nKSxcbiAgICAgICAgICAoJ24nLCAnJHtKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBpZDogJ24nLFxuICAgICAgICAgICAgZ3JvdXBWMkNoYW5nZToge1xuICAgICAgICAgICAgICBmcm9tOiAnbm90LWZvdW5kJyxcbiAgICAgICAgICAgICAgZGV0YWlsczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlVXVpZDogJ2EnLFxuICAgICAgICAgIH0pfScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDMpO1xuXG4gICAgICBjb25zdCB7IG1lbWJlcnMsIGpzb246IGNvbnZvSlNPTiB9ID0gZGJcbiAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCBtZW1iZXJzLCBqc29uIEZST00gY29udmVyc2F0aW9ucyBXSEVSRSBpZCA9IFwiY1wiJylcbiAgICAgICAgLmdldCgpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobWVtYmVycywgYCR7VVVJRF9BfSAke1VVSURfQn1gKTtcbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoSlNPTi5wYXJzZShjb252b0pTT04pLCB7XG4gICAgICAgIGlkOiAnYycsXG4gICAgICAgIGdyb3VwSWQ6ICdndjJjJyxcbiAgICAgICAgdXVpZDogVVVJRF9DLFxuICAgICAgICBtZW1iZXJzVjI6IFtcbiAgICAgICAgICB7IHV1aWQ6IFVVSURfQSwgam9pbmVkQXRWZXJzaW9uOiAxIH0sXG4gICAgICAgICAgeyB1dWlkOiBVVUlEX0IsIGpvaW5lZEF0VmVyc2lvbjogMiB9LFxuICAgICAgICBdLFxuICAgICAgICBwZW5kaW5nTWVtYmVyc1YyOiBbXG4gICAgICAgICAgeyB1dWlkOiBVVUlEX0EsIGFkZGVkQnlVc2VySWQ6IFVVSURfQiwgdGltZXN0YW1wOiA0IH0sXG4gICAgICAgICAgeyB1dWlkOiBVVUlEX0IsIGFkZGVkQnlVc2VySWQ6IFVVSURfQSwgdGltZXN0YW1wOiA1IH0sXG4gICAgICAgIF0sXG4gICAgICAgIHBlbmRpbmdBZG1pbkFwcHJvdmFsVjI6IFtcbiAgICAgICAgICB7IHV1aWQ6IFVVSURfQSwgdGltZXN0YW1wOiA2IH0sXG4gICAgICAgICAgeyB1dWlkOiBVVUlEX0IsIHRpbWVzdGFtcDogNyB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHsganNvbjogbWVzc2FnZU1KU09OIH0gPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUICBqc29uIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgPSBcIm1cIicpXG4gICAgICAgIC5nZXQoKTtcblxuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChKU09OLnBhcnNlKG1lc3NhZ2VNSlNPTiksIHtcbiAgICAgICAgaWQ6ICdtJyxcbiAgICAgICAgZ3JvdXBWMkNoYW5nZToge1xuICAgICAgICAgIGZyb206IFVVSURfQSxcbiAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAuLi5DSEFOR0VfVFlQRVMubWFwKHR5cGUgPT4gKHsgdHlwZSwgdXVpZDogVVVJRF9CIH0pKSxcbiAgICAgICAgICAgIC4uLkNIQU5HRV9UWVBFU19XSVRIX0lOVklURVIubWFwKHR5cGUgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgdXVpZDogVVVJRF9DLFxuICAgICAgICAgICAgICAgIGludml0ZXI6IFVVSURfQSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZVV1aWQ6IFVVSURfQSxcbiAgICAgICAgaW52aXRlZEdWMk1lbWJlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1dWlkOiBVVUlEX0IsXG4gICAgICAgICAgICBhZGRlZEJ5VXNlcklkOiBVVUlEX0MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB7IGpzb246IG1lc3NhZ2VOSlNPTiB9ID0gZGJcbiAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCAganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gXCJuXCInKVxuICAgICAgICAuZ2V0KCk7XG5cbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoSlNPTi5wYXJzZShtZXNzYWdlTkpTT04pLCB7XG4gICAgICAgIGlkOiAnbicsXG4gICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlVXVpZDogVVVJRF9BLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIG9uIGludmFsaWQgVVVJRHMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDIpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBqc29uKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnbScsICcke0pTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkOiAnbScsXG4gICAgICAgICAgICBzb3VyY2VVdWlkOiAnZmZmZmZmZmYtZmZmZi1mZmZmLWZmZmYtZmZmZmZmZmZmZmZmJyxcbiAgICAgICAgICB9KX0nKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQzKTtcblxuICAgICAgY29uc3QgeyBqc29uOiBtZXNzYWdlTUpTT04gfSA9IGRiXG4gICAgICAgIC5wcmVwYXJlKCdTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gXCJtXCInKVxuICAgICAgICAuZ2V0KCk7XG5cbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoSlNPTi5wYXJzZShtZXNzYWdlTUpTT04pLCB7XG4gICAgICAgIGlkOiAnbScsXG4gICAgICAgIHNvdXJjZVV1aWQ6ICdmZmZmZmZmZi1mZmZmLWZmZmYtZmZmZi1mZmZmZmZmZmZmZmYnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb240NScsICgpID0+IHtcbiAgICBpdCgnY3JlYXRlcyBuZXcgc3RvcnlJZCBmaWVsZCBhbmQgZGVsZXRlIHRyaWdnZXIgZm9yIHN0b3J5UmVhZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBBVVRIT1JfSUQgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFNUT1JZX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFNUT1JZX0lEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzMgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfNCA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF81ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBDT05WRVJTQVRJT05fSUQgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQ1KTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc1xuICAgICAgICAgIChpZCwgc3RvcnlJZCwgY29udmVyc2F0aW9uSWQsIHR5cGUsIGJvZHkpXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtTVE9SWV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnc3RvcnknLCAnc3RvcnkgMScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzJ9JywgJyR7U1RPUllfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ3N0b3J5JywgJ3N0b3J5IDInKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8zfScsICcke1NUT1JZX0lEXzF9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdvdXRnb2luZycsICdyZXBseSB0byBzdG9yeSAxJyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNH0nLCAnJHtTVE9SWV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnaW5jb21pbmcnLCAncmVwbHkgdG8gc3RvcnkgMScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzV9JywgJyR7U1RPUllfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ291dGdvaW5nJywgJ3JlcGx5IHRvIHN0b3J5IDInKTtcblxuICAgICAgICBJTlNFUlQgSU5UTyBzdG9yeVJlYWRzIChhdXRob3JJZCwgY29udmVyc2F0aW9uSWQsIHN0b3J5SWQsIHN0b3J5UmVhZERhdGUpIFZBTFVFU1xuICAgICAgICAgICgnJHtBVVRIT1JfSUR9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICcke1NUT1JZX0lEXzF9JywgJHtEYXRlLm5vdygpfSksXG4gICAgICAgICAgKCcke0FVVEhPUl9JRH0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJyR7U1RPUllfSURfMn0nLCAke0RhdGUubm93KCl9KTsgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHN0b3J5UmVhZENvdW50ID0gZGJcbiAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIHN0b3J5UmVhZHM7JylcbiAgICAgICAgLnBsdWNrKCk7XG4gICAgICBjb25zdCBtZXNzYWdlQ291bnQgPSBkYi5wcmVwYXJlKCdTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlczsnKS5wbHVjaygpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoc3RvcnlSZWFkQ291bnQuZ2V0KCksIDIpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG1lc3NhZ2VDb3VudC5nZXQoKSwgNSk7XG5cbiAgICAgIGRiLmV4ZWMoYERFTEVURSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gJyR7TUVTU0FHRV9JRF8xfSc7YCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzdG9yeVJlYWRDb3VudC5nZXQoKSwgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobWVzc2FnZUNvdW50LmdldCgpLCA0KTtcblxuICAgICAgZGIuZXhlYyhgREVMRVRFIEZST00gbWVzc2FnZXMgV0hFUkUgc3RvcnlJZCA9ICcke1NUT1JZX0lEXzF9JztgKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHN0b3J5UmVhZENvdW50LmdldCgpLCAxKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZXNzYWdlQ291bnQuZ2V0KCksIDIpO1xuXG4gICAgICBjb25zdCBzdG9yeVJlYWRJZHMgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIHN0b3J5SWQgRlJPTSBzdG9yeVJlYWRzOycpXG4gICAgICAgIC5wbHVjaygpXG4gICAgICAgIC5hbGwoKTtcbiAgICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoc3RvcnlSZWFkSWRzLCBbU1RPUllfSURfMl0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZXMgbmV3IHN0b3J5RGlzdHJpYnV0aW9ucy9NZW1iZXJzIHdpdGggY2FzY2FkZSBkZWxldGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBMSVNUX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IExJU1RfSURfMiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgVVVJRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBVVUlEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFVVSURfMyA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgVVVJRF80ID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0NSk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gc3RvcnlEaXN0cmlidXRpb25zXG4gICAgICAgICAgKGlkLCBuYW1lKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtMSVNUX0lEXzF9JywgJ2Rpc3RyaWJ1dGlvbiBsaXN0IDEnKSxcbiAgICAgICAgICAoJyR7TElTVF9JRF8yfScsICdkaXN0cnVidXRpb24gbGlzdCAyJyk7XG5cbiAgICAgICAgSU5TRVJUIElOVE8gc3RvcnlEaXN0cmlidXRpb25NZW1iZXJzIChsaXN0SWQsIHV1aWQpIFZBTFVFU1xuICAgICAgICAgICgnJHtMSVNUX0lEXzF9JywgJyR7VVVJRF8xfScpLFxuICAgICAgICAgICgnJHtMSVNUX0lEXzF9JywgJyR7VVVJRF8yfScpLFxuICAgICAgICAgICgnJHtMSVNUX0lEXzF9JywgJyR7VVVJRF8zfScpLFxuICAgICAgICAgICgnJHtMSVNUX0lEXzF9JywgJyR7VVVJRF80fScpLFxuICAgICAgICAgICgnJHtMSVNUX0lEXzJ9JywgJyR7VVVJRF8xfScpLFxuICAgICAgICAgICgnJHtMSVNUX0lEXzJ9JywgJyR7VVVJRF8yfScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBjb25zdCBsaXN0Q291bnQgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gc3RvcnlEaXN0cmlidXRpb25zOycpXG4gICAgICAgIC5wbHVjaygpO1xuICAgICAgY29uc3QgbWVtYmVyQ291bnQgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gc3RvcnlEaXN0cmlidXRpb25NZW1iZXJzOycpXG4gICAgICAgIC5wbHVjaygpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobGlzdENvdW50LmdldCgpLCAyKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZW1iZXJDb3VudC5nZXQoKSwgNik7XG5cbiAgICAgIGRiLmV4ZWMoYERFTEVURSBGUk9NIHN0b3J5RGlzdHJpYnV0aW9ucyBXSEVSRSBpZCA9ICcke0xJU1RfSURfMX0nO2ApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobGlzdENvdW50LmdldCgpLCAxKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChtZW1iZXJDb3VudC5nZXQoKSwgMik7XG5cbiAgICAgIGNvbnN0IG1lbWJlcnMgPSBkYlxuICAgICAgICAucHJlcGFyZSgnU0VMRUNUIHV1aWQgRlJPTSBzdG9yeURpc3RyaWJ1dGlvbk1lbWJlcnM7JylcbiAgICAgICAgLnBsdWNrKClcbiAgICAgICAgLmFsbCgpO1xuXG4gICAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKG1lbWJlcnMsIFtVVUlEXzEsIFVVSURfMl0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDcnLCAoKSA9PiB7XG4gICAgaXQoJ2NyZWF0ZXMgYW5kIHByZS1wb3B1bGF0ZXMgbmV3IGlzQ2hhbmdlQ3JlYXRlZEJ5VXMgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBPVEhFUl9VVUlEID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Nik7XG5cbiAgICAgIGNvbnN0IHV1aWRJdGVtID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB2YWx1ZTogYCR7T1VSX1VVSUR9LjRgLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjaGFuZ2VGcm9tVXMgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICBmcm9tOiBPVVJfVVVJRCxcbiAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXItcmVtb3ZlJyxcbiAgICAgICAgICAgICAgdXVpZDogT1RIRVJfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY2hhbmdlRnJvbU90aGVyID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICAgICAgZnJvbTogT1RIRVJfVVVJRCxcbiAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXItcmVtb3ZlJyxcbiAgICAgICAgICAgICAgdXVpZDogT1VSX1VVSUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBpdGVtcyAoaWQsIGpzb24pIFZBTFVFUyAoJ3V1aWRfaWQnLCAnJHt1dWlkSXRlbX0nKTtcbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNcbiAgICAgICAgICAoaWQsIGNvbnZlcnNhdGlvbklkLCB0eXBlLCBqc29uKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzF9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdvdXRnb2luZycsICcke2NoYW5nZUZyb21Vc30nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnb3V0Z29pbmcnLCAnJHtjaGFuZ2VGcm9tT3RoZXJ9Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Nyk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMlxuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgICdTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSBpc0NoYW5nZUNyZWF0ZWRCeVVzIElTIDA7J1xuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMSxcbiAgICAgICAgJ3plcm8nXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlzQ2hhbmdlQ3JlYXRlZEJ5VXMgSVMgMTsnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxLFxuICAgICAgICAnb25lJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGVzIG5ldyBhdXRvLWdlbmVyYXRlZCBpc1N0b3J5IGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgU1RPUllfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMyA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Nyk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNcbiAgICAgICAgICAoaWQsIHN0b3J5SWQsIGNvbnZlcnNhdGlvbklkLCB0eXBlLCBib2R5KVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzF9JywgJyR7U1RPUllfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ3N0b3J5JywgJ3N0b3J5IDEnKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsIG51bGwsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnb3V0Z29pbmcnLCAncmVwbHkgdG8gc3RvcnkgMScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzN9JywgbnVsbCwgJyR7Q09OVkVSU0FUSU9OX0lEfScsIG51bGwsICdudWxsIHR5cGUhJyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgM1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgaXNTdG9yeSBJUyAwOycpXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIDJcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlzU3RvcnkgSVMgMTsnKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZXMgbmV3IGF1dG8tZ2VuZXJhdGVkIHNob3VsZEFmZmVjdEFjdGl2aXR5L3Nob3VsZEFmZmVjdFByZXZpZXcvaXNVc2VySW5pdGlhdGVkTWVzc2FnZSBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8zID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzQgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IENPTlZFUlNBVElPTl9JRCA9IGdlbmVyYXRlR3VpZCgpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDcpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgdHlwZSlcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnc3RvcnknKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAna2V5Y2hhbmdlJyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfM30nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ291dGdvaW5nJyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNH0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2dyb3VwLXYyLWNoYW5nZScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzOycpLnBsdWNrKCkuZ2V0KCksXG4gICAgICAgIDRcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICAnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgc2hvdWxkQWZmZWN0UHJldmlldyBJUyAxOydcbiAgICAgICAgICApXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIDNcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICAnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgc2hvdWxkQWZmZWN0QWN0aXZpdHkgSVMgMTsnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAyXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlzVXNlckluaXRpYXRlZE1lc3NhZ2UgSVMgMTsnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZXMgbmV3IGF1dG8tZ2VuZXJhdGVkIGlzVGltZXJDaGFuZ2VGcm9tU3luYyBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8zID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBDT05WRVJTQVRJT05fSUQgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQ3KTtcblxuICAgICAgY29uc3QgdGltZXJVcGRhdGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGV4cGlyYXRpb25UaW1lclVwZGF0ZToge1xuICAgICAgICAgIGV4cGlyZVRpbWVyOiAzMCxcbiAgICAgICAgICBmcm9tU3luYzogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRpbWVyVXBkYXRlRnJvbVN5bmMgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGV4cGlyYXRpb25UaW1lclVwZGF0ZToge1xuICAgICAgICAgIGV4cGlyZVRpbWVyOiAzMCxcbiAgICAgICAgICBmcm9tU3luYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgdHlwZSwganNvbilcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnb3V0Z29pbmcnLCAnJHt0aW1lclVwZGF0ZX0nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnb3V0Z29pbmcnLCAnJHt0aW1lclVwZGF0ZUZyb21TeW5jfScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzN9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdvdXRnb2luZycsICd7fScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzOycpLnBsdWNrKCkuZ2V0KCksXG4gICAgICAgIDNcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICAnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgaXNUaW1lckNoYW5nZUZyb21TeW5jIElTIDE7J1xuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgICdTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSBpc1RpbWVyQ2hhbmdlRnJvbVN5bmMgSVMgMDsnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAyXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZXMgbmV3IGF1dG8tZ2VuZXJhdGVkIGlzR3JvdXBMZWF2ZUV2ZW50IGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzMgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfNCA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF81ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBDT05WRVJTQVRJT05fSUQgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IEZJUlNUX1VVSUQgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFNFQ09ORF9VVUlEID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBUSElSRF9VVUlEID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig0Nyk7XG5cbiAgICAgIGNvbnN0IG1lbWJlclJlbW92ZUJ5T3RoZXIgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICBmcm9tOiBGSVJTVF9VVUlELFxuICAgICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21lbWJlci1yZW1vdmUnLFxuICAgICAgICAgICAgICB1dWlkOiBTRUNPTkRfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWVtYmVyTGVhdmUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICBmcm9tOiBGSVJTVF9VVUlELFxuICAgICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21lbWJlci1yZW1vdmUnLFxuICAgICAgICAgICAgICB1dWlkOiBGSVJTVF9VVUlELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBtdWx0aXBsZVJlbW92ZXMgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdyb3VwVjJDaGFuZ2U6IHtcbiAgICAgICAgICBmcm9tOiBGSVJTVF9VVUlELFxuICAgICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21lbWJlci1yZW1vdmUnLFxuICAgICAgICAgICAgICB1dWlkOiBTRUNPTkRfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXItcmVtb3ZlJyxcbiAgICAgICAgICAgICAgdXVpZDogVEhJUkRfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWVtYmVyQWRkID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBncm91cFYyQ2hhbmdlOiB7XG4gICAgICAgICAgZnJvbTogRklSU1RfVVVJRCxcbiAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXItYWRkJyxcbiAgICAgICAgICAgICAgdXVpZDogRklSU1RfVVVJRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgdHlwZSwganNvbilcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnb3V0Z29pbmcnLCAnJHttZW1iZXJMZWF2ZX0nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnZ3JvdXAtdjItY2hhbmdlJywgJyR7bWVtYmVyUmVtb3ZlQnlPdGhlcn0nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8zfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnZ3JvdXAtdjItY2hhbmdlJywgJyR7bWVtYmVyTGVhdmV9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNH0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2dyb3VwLXYyLWNoYW5nZScsICcke211bHRpcGxlUmVtb3Zlc30nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF81fScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnZ3JvdXAtdjItY2hhbmdlJywgJyR7bWVtYmVyQWRkfScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzOycpLnBsdWNrKCkuZ2V0KCksXG4gICAgICAgIDVcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICAnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgaXNHcm91cExlYXZlRXZlbnQgSVMgMTsnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlzR3JvdXBMZWF2ZUV2ZW50IElTIDA7J1xuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgNFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdlbnN1cmVzIHRoYXQgaW5kZXggaXMgdXNlZCBmb3IgZ2V0T2xkZXJNZXNzYWdlc0J5Q29udmVyc2F0aW9uJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDQ3KTtcblxuICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IGRiXG4gICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgIGBcbiAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgIFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdkOGIwNWJiMS0zNmIzLTQ0NzgtODQxYi02MDBhZjYyMzIxZWInIEFORFxuICAgICAgICAgIChOVUxMIElTIE5VTEwgT1IgaWQgSVMgTk9UIE5VTEwpIEFORFxuICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICBzdG9yeUlkIElTIE5VTEwgQU5EXG4gICAgICAgICAgKFxuICAgICAgICAgICAgKHJlY2VpdmVkX2F0ID0gMTc5NzY5MzEzNDg2MjMxNTcgQU5EIHNlbnRfYXQgPCBOVUxMKSBPUlxuICAgICAgICAgICAgcmVjZWl2ZWRfYXQgPCAxNzk3NjkzMTM0ODYyMzE1N1xuICAgICAgICAgIClcbiAgICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgREVTQywgc2VudF9hdCBERVNDXG4gICAgICAgIExJTUlUIDEwO1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmdldCgpO1xuXG4gICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWwsICdCLVRSRUUnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGRldGFpbCwgJ1NDQU4nKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlKFxuICAgICAgICBkZXRhaWwsXG4gICAgICAgICdTRUFSQ0ggbWVzc2FnZXMgVVNJTkcgSU5ERVggbWVzc2FnZXNfY29udmVyc2F0aW9uIChjb252ZXJzYXRpb25JZD0/IEFORCBpc1N0b3J5PT8gQU5EIHN0b3J5SWQ9PyBBTkQgcmVjZWl2ZWRfYXQ8PyknXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDgnLCAoKSA9PiB7XG4gICAgaXQoJ2NyZWF0ZXMgdXNhYmxlIGluZGV4IGZvciBoYXNVc2VySW5pdGlhdGVkTWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDgpO1xuXG4gICAgICBjb25zdCBkZXRhaWxzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICBFWFBMQUlOIFFVRVJZIFBMQU5cbiAgICAgICAgU0VMRUNUIENPVU5UKCopIGFzIGNvdW50IEZST01cbiAgICAgICAgICAoXG4gICAgICAgICAgICBTRUxFQ1QgMSBGUk9NIG1lc3NhZ2VzXG4gICAgICAgICAgICBXSEVSRVxuICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdjb252bycgQU5EXG4gICAgICAgICAgICAgIGlzVXNlckluaXRpYXRlZE1lc3NhZ2UgPSAxXG4gICAgICAgICAgICBMSU1JVCAxXG4gICAgICAgICAgKTtcbiAgICAgICAgYFxuICAgICAgICApXG4gICAgICAgIC5hbGwoKVxuICAgICAgICAubWFwKCh7IGRldGFpbCB9KSA9PiBkZXRhaWwpXG4gICAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGUoXG4gICAgICAgIGRldGFpbHMsXG4gICAgICAgICdTRUFSQ0ggbWVzc2FnZXMgVVNJTkcgSU5ERVggbWVzc2FnZV91c2VyX2luaXRpYXRlZCAoY29udmVyc2F0aW9uSWQ9PyBBTkQgaXNVc2VySW5pdGlhdGVkTWVzc2FnZT0/KSdcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb240OScsICgpID0+IHtcbiAgICBpdCgnY3JlYXRlcyB1c2FibGUgaW5kZXggZm9yIG1lc3NhZ2VzIHByZXZpZXcnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNDkpO1xuXG4gICAgICBjb25zdCBkZXRhaWxzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICBFWFBMQUlOIFFVRVJZIFBMQU5cbiAgICAgICAgU0VMRUNUIGpzb24gRlJPTSBtZXNzYWdlc1xuICAgICAgICBXSEVSRVxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkID0gJ2NvbnZvJyBBTkRcbiAgICAgICAgICBzaG91bGRBZmZlY3RQcmV2aWV3IElTIDEgQU5EXG4gICAgICAgICAgaXNHcm91cExlYXZlRXZlbnRGcm9tT3RoZXIgSVMgMCBBTkRcbiAgICAgICAgICAoXG4gICAgICAgICAgICBleHBpcmVzQXQgSVMgTlVMTFxuICAgICAgICAgICAgT1JcbiAgICAgICAgICAgIGV4cGlyZXNBdCA+IDEyM1xuICAgICAgICAgIClcbiAgICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgREVTQywgc2VudF9hdCBERVNDXG4gICAgICAgIExJTUlUIDE7XG4gICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuYWxsKClcbiAgICAgICAgLm1hcCgoeyBkZXRhaWwgfSkgPT4gZGV0YWlsKVxuICAgICAgICAuam9pbignXFxuJyk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlKGRldGFpbHMsICdVU0lORyBJTkRFWCBtZXNzYWdlc19wcmV2aWV3Jyk7XG4gICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWxzLCAnVEVNUCBCLVRSRUUnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGRldGFpbHMsICdTQ0FOJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb241MCcsICgpID0+IHtcbiAgICBpdCgnY3JlYXRlcyB1c2FibGUgaW5kZXggZm9yIG1lc3NhZ2VzX3VucmVhZCcsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1MCk7XG5cbiAgICAgIGNvbnN0IGRldGFpbHMgPSBkYlxuICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICBgXG4gICAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgICAgU0VMRUNUICogRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQgPSAnY29udmVyc2F0aW9uJyBBTkRcbiAgICAgICAgICAgIHJlYWRTdGF0dXMgPSAnc29tZXRoaW5nJyBBTkRcbiAgICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICAgIHN0b3J5SWQgSVMgTlVMTFxuICAgICAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IEFTQywgc2VudF9hdCBBU0NcbiAgICAgICAgICBMSU1JVCAxO1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmFsbCgpXG4gICAgICAgIC5tYXAoKHsgZGV0YWlsIH0pID0+IGRldGFpbClcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZShkZXRhaWxzLCAnVVNJTkcgSU5ERVggbWVzc2FnZXNfdW5yZWFkJyk7XG4gICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWxzLCAnVEVNUCBCLVRSRUUnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGRldGFpbHMsICdTQ0FOJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb241MScsICgpID0+IHtcbiAgICBpdCgnbW92ZXMgcmVhY3Rpb25zL25vcm1hbCBzZW5kIGpvYnMgb3ZlciB0byBjb252ZXJzYXRpb24gcXVldWUnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTApO1xuXG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IENPTlZFUlNBVElPTl9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNcbiAgICAgICAgKGlkLCBqc29uKVxuICAgICAgICBWQUxVRVMgKCcke01FU1NBR0VfSURfMX0nLCAnJHtKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IENPTlZFUlNBVElPTl9JRF8xLFxuICAgICAgICB9KX0nKVxuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIGpvYnNcbiAgICAgICAgICAoaWQsIHRpbWVzdGFtcCwgcXVldWVUeXBlLCBkYXRhKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnaWQtMScsIDEsICdyYW5kb20gam9iJywgJ3t9JyksXG4gICAgICAgICAgKCdpZC0yJywgMiwgJ25vcm1hbCBzZW5kJywgJ3t9JyksXG4gICAgICAgICAgKCdpZC0zJywgMywgJ3JlYWN0aW9ucycsICd7XCJtZXNzYWdlSWRcIjpcIiR7TUVTU0FHRV9JRF8xfVwifScpLFxuICAgICAgICAgICgnaWQtNCcsIDQsICdjb252ZXJzYXRpb24nLCAne30nKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgY29uc3QgdG90YWxKb2JzID0gZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gam9iczsnKS5wbHVjaygpO1xuICAgICAgY29uc3Qgbm9ybWFsU2VuZEpvYnMgPSBkYlxuICAgICAgICAucHJlcGFyZShcIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGpvYnMgV0hFUkUgcXVldWVUeXBlID0gJ25vcm1hbCBzZW5kJztcIilcbiAgICAgICAgLnBsdWNrKCk7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25Kb2JzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBqb2JzIFdIRVJFIHF1ZXVlVHlwZSA9ICdjb252ZXJzYXRpb24nO1wiKVxuICAgICAgICAucGx1Y2soKTtcbiAgICAgIGNvbnN0IHJlYWN0aW9uSm9icyA9IGRiXG4gICAgICAgIC5wcmVwYXJlKFwiU0VMRUNUIENPVU5UKCopIEZST00gam9icyBXSEVSRSBxdWV1ZVR5cGUgPSAncmVhY3Rpb25zJztcIilcbiAgICAgICAgLnBsdWNrKCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh0b3RhbEpvYnMuZ2V0KCksIDQsICdiZWZvcmUgdG90YWwnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChub3JtYWxTZW5kSm9icy5nZXQoKSwgMSwgJ2JlZm9yZSBub3JtYWwnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChjb252ZXJzYXRpb25Kb2JzLmdldCgpLCAxLCAnYmVmb3JlIGNvbnZlcnNhdGlvbicpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlYWN0aW9uSm9icy5nZXQoKSwgMSwgJ2JlZm9yZSByZWFjdGlvbicpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTEpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodG90YWxKb2JzLmdldCgpLCA0LCAnYWZ0ZXIgdG90YWwnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChub3JtYWxTZW5kSm9icy5nZXQoKSwgMCwgJ2FmdGVyIG5vcm1hbCcpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGNvbnZlcnNhdGlvbkpvYnMuZ2V0KCksIDMsICdhZnRlciBjb252ZXJzYXRpb24nKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkpvYnMuZ2V0KCksIDAsICdhZnRlciByZWFjdGlvbicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VwZGF0ZXMgcmVhY3Rpb25zIGpvYnMgd2l0aCB0aGVpciBjb252ZXJzYXRpb25JZCcsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1MCk7XG5cbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzMgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IENPTlZFUlNBVElPTl9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0xJyxcbiAgICAgICAgdGltZXN0YW1wOiAxLFxuICAgICAgICBxdWV1ZVR5cGU6ICdyZWFjdGlvbnMnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZUlkOiBNRVNTQUdFX0lEXzEsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0yJyxcbiAgICAgICAgdGltZXN0YW1wOiAyLFxuICAgICAgICBxdWV1ZVR5cGU6ICdyZWFjdGlvbnMnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZUlkOiBNRVNTQUdFX0lEXzIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0zLW1pc3NpbmctZGF0YScsXG4gICAgICAgIHRpbWVzdGFtcDogMyxcbiAgICAgICAgcXVldWVUeXBlOiAncmVhY3Rpb25zJyxcbiAgICAgIH0pO1xuICAgICAgaW5zZXJ0Sm9iU3luYyhkYiwge1xuICAgICAgICBpZDogJ2lkLTQtbm9uLXN0cmluZy1tZXNzYWdlSWQnLFxuICAgICAgICB0aW1lc3RhbXA6IDEsXG4gICAgICAgIHF1ZXVlVHlwZTogJ3JlYWN0aW9ucycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlSWQ6IDQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC01LW1pc3NpbmctbWVzc2FnZScsXG4gICAgICAgIHRpbWVzdGFtcDogNSxcbiAgICAgICAgcXVldWVUeXBlOiAncmVhY3Rpb25zJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2VJZDogJ21pc3NpbmcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBpbnNlcnRKb2JTeW5jKGRiLCB7XG4gICAgICAgIGlkOiAnaWQtNi1taXNzaW5nLWNvbnZlcnNhdGlvbicsXG4gICAgICAgIHRpbWVzdGFtcDogNixcbiAgICAgICAgcXVldWVUeXBlOiAncmVhY3Rpb25zJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2VJZDogTUVTU0FHRV9JRF8zLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VKc29uMSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6IENPTlZFUlNBVElPTl9JRF8xLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBtZXNzYWdlSnNvbjIgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiBDT05WRVJTQVRJT05fSURfMixcbiAgICAgIH0pO1xuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc1xuICAgICAgICAgIChpZCwgY29udmVyc2F0aW9uSWQsIGpzb24pXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSURfMX0nLCAnJHttZXNzYWdlSnNvbjF9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSURfMn0nLCAnJHttZXNzYWdlSnNvbjJ9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfM30nLCBudWxsLCAne30nKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgY29uc3QgdG90YWxKb2JzID0gZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gam9iczsnKS5wbHVjaygpO1xuICAgICAgY29uc3QgcmVhY3Rpb25Kb2JzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBqb2JzIFdIRVJFIHF1ZXVlVHlwZSA9ICdyZWFjdGlvbnMnO1wiKVxuICAgICAgICAucGx1Y2soKTtcbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbkpvYnMgPSBkYlxuICAgICAgICAucHJlcGFyZShcIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGpvYnMgV0hFUkUgcXVldWVUeXBlID0gJ2NvbnZlcnNhdGlvbic7XCIpXG4gICAgICAgIC5wbHVjaygpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodG90YWxKb2JzLmdldCgpLCA2LCAndG90YWwgam9icyBiZWZvcmUnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkpvYnMuZ2V0KCksIDYsICdyZWFjdGlvbiBqb2JzIGJlZm9yZScpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGNvbnZlcnNhdGlvbkpvYnMuZ2V0KCksIDAsICdjb252ZXJzYXRpb24gam9icyBiZWZvcmUnKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDUxKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHRvdGFsSm9icy5nZXQoKSwgMiwgJ3RvdGFsIGpvYnMgYWZ0ZXInKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZWFjdGlvbkpvYnMuZ2V0KCksIDAsICdyZWFjdGlvbiBqb2JzIGFmdGVyJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY29udmVyc2F0aW9uSm9icy5nZXQoKSwgMiwgJ2NvbnZlcnNhdGlvbiBqb2JzIGFmdGVyJyk7XG5cbiAgICAgIGNvbnN0IGpvYnMgPSBnZXRKb2JzSW5RdWV1ZVN5bmMoZGIsICdjb252ZXJzYXRpb24nKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChqb2JzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2lkLTEnLFxuICAgICAgICAgIHRpbWVzdGFtcDogMSxcbiAgICAgICAgICBxdWV1ZVR5cGU6ICdjb252ZXJzYXRpb24nLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHR5cGU6ICdSZWFjdGlvbicsXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZDogQ09OVkVSU0FUSU9OX0lEXzEsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IE1FU1NBR0VfSURfMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdpZC0yJyxcbiAgICAgICAgICB0aW1lc3RhbXA6IDIsXG4gICAgICAgICAgcXVldWVUeXBlOiAnY29udmVyc2F0aW9uJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0eXBlOiAnUmVhY3Rpb24nLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IENPTlZFUlNBVElPTl9JRF8yLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiBNRVNTQUdFX0lEXzIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VwZGF0ZXMgbm9ybWFsIHNlbmQgam9icyB3aXRoIHRoZWlyIGNvbnZlcnNhdGlvbklkJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDUwKTtcblxuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IENPTlZFUlNBVElPTl9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0xJyxcbiAgICAgICAgdGltZXN0YW1wOiAxLFxuICAgICAgICBxdWV1ZVR5cGU6ICdub3JtYWwgc2VuZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogQ09OVkVSU0FUSU9OX0lEXzEsXG4gICAgICAgICAgbWVzc2FnZUlkOiBNRVNTQUdFX0lEXzEsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0yJyxcbiAgICAgICAgdGltZXN0YW1wOiAyLFxuICAgICAgICBxdWV1ZVR5cGU6ICdub3JtYWwgc2VuZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogQ09OVkVSU0FUSU9OX0lEXzIsXG4gICAgICAgICAgbWVzc2FnZUlkOiBNRVNTQUdFX0lEXzIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGluc2VydEpvYlN5bmMoZGIsIHtcbiAgICAgICAgaWQ6ICdpZC0zLW1pc3NpbmctZGF0YScsXG4gICAgICAgIHRpbWVzdGFtcDogMyxcbiAgICAgICAgcXVldWVUeXBlOiAnbm9ybWFsIHNlbmQnLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvdGFsSm9icyA9IGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIGpvYnM7JykucGx1Y2soKTtcbiAgICAgIGNvbnN0IG5vcm1hbFNlbmQgPSBkYlxuICAgICAgICAucHJlcGFyZShcIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGpvYnMgV0hFUkUgcXVldWVUeXBlID0gJ25vcm1hbCBzZW5kJztcIilcbiAgICAgICAgLnBsdWNrKCk7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25Kb2JzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBqb2JzIFdIRVJFIHF1ZXVlVHlwZSA9ICdjb252ZXJzYXRpb24nO1wiKVxuICAgICAgICAucGx1Y2soKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHRvdGFsSm9icy5nZXQoKSwgMywgJ3RvdGFsIGpvYnMgYmVmb3JlJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobm9ybWFsU2VuZC5nZXQoKSwgMywgJ25vcm1hbCBzZW5kIGpvYnMgYmVmb3JlJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY29udmVyc2F0aW9uSm9icy5nZXQoKSwgMCwgJ2NvbnZlcnNhdGlvbiBqb2JzIGJlZm9yZScpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTEpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodG90YWxKb2JzLmdldCgpLCAyLCAndG90YWwgam9icyBhZnRlcicpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG5vcm1hbFNlbmQuZ2V0KCksIDAsICdub3JtYWwgc2VuZCBqb2JzIGFmdGVyJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY29udmVyc2F0aW9uSm9icy5nZXQoKSwgMiwgJ2NvbnZlcnNhdGlvbiBqb2JzIGFmdGVyJyk7XG5cbiAgICAgIGNvbnN0IGpvYnMgPSBnZXRKb2JzSW5RdWV1ZVN5bmMoZGIsICdjb252ZXJzYXRpb24nKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChqb2JzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2lkLTEnLFxuICAgICAgICAgIHRpbWVzdGFtcDogMSxcbiAgICAgICAgICBxdWV1ZVR5cGU6ICdjb252ZXJzYXRpb24nLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHR5cGU6ICdOb3JtYWxNZXNzYWdlJyxcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBDT05WRVJTQVRJT05fSURfMSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogTUVTU0FHRV9JRF8xLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2lkLTInLFxuICAgICAgICAgIHRpbWVzdGFtcDogMixcbiAgICAgICAgICBxdWV1ZVR5cGU6ICdjb252ZXJzYXRpb24nLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHR5cGU6ICdOb3JtYWxNZXNzYWdlJyxcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiBDT05WRVJTQVRJT05fSURfMixcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogTUVTU0FHRV9JRF8yLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjUyJywgKCkgPT4ge1xuICAgIGNvbnN0IHF1ZXJpZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHF1ZXJ5OiBgXG4gICAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgICAgU0VMRUNUICogRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQgPSAnY29udmVyc2F0aW9uJyBBTkRcbiAgICAgICAgICAgIHJlYWRTdGF0dXMgPSAnc29tZXRoaW5nJyBBTkRcbiAgICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICAgIDpzdG9yeV9pZF9wcmVkaWNhdGU6XG4gICAgICAgICAgT1JERVIgQlkgcmVjZWl2ZWRfYXQgQVNDLCBzZW50X2F0IEFTQ1xuICAgICAgICAgIExJTUlUIDE7XG4gICAgICAgIGAsXG4gICAgICAgIGluZGV4OiAnbWVzc2FnZXNfdW5yZWFkJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHF1ZXJ5OiBgXG4gICAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgICAgU0VMRUNUIGpzb24gRlJPTSBtZXNzYWdlcyBXSEVSRVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQgPSAnZDhiMDViYjEtMzZiMy00NDc4LTg0MWItNjAwYWY2MjMyMWViJyBBTkRcbiAgICAgICAgICAgIChOVUxMIElTIE5VTEwgT1IgaWQgSVMgTk9UIE5VTEwpIEFORFxuICAgICAgICAgICAgaXNTdG9yeSBJUyAwIEFORFxuICAgICAgICAgICAgOnN0b3J5X2lkX3ByZWRpY2F0ZTogQU5EXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgIChyZWNlaXZlZF9hdCA9IDE3OTc2OTMxMzQ4NjIzMTU3IEFORCBzZW50X2F0IDwgTlVMTCkgT1JcbiAgICAgICAgICAgICAgcmVjZWl2ZWRfYXQgPCAxNzk3NjkzMTM0ODYyMzE1N1xuICAgICAgICAgICAgKVxuICAgICAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IERFU0MsIHNlbnRfYXQgREVTQ1xuICAgICAgICAgIExJTUlUIDEwO1xuICAgICAgICBgLFxuICAgICAgICBpbmRleDogJ21lc3NhZ2VzX2NvbnZlcnNhdGlvbicsXG4gICAgICB9LFxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBpbnNlcnRQcmVkaWNhdGUoXG4gICAgICBxdWVyeTogc3RyaW5nLFxuICAgICAgc3RvcnlJZDogc3RyaW5nIHwgdW5kZWZpbmVkXG4gICAgKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBxdWVyeS5yZXBsYWNlQWxsKFxuICAgICAgICAnOnN0b3J5X2lkX3ByZWRpY2F0ZTonLFxuICAgICAgICBfc3RvcnlJZFByZWRpY2F0ZShzdG9yeUlkKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpdCgncHJvZHVjZXMgb3B0aW1pemFibGUgcXVlcmllcyBmb3IgcHJlc2VudCBhbmQgYWJzZW50IHN0b3J5SWQnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTIpO1xuXG4gICAgICBmb3IgKGNvbnN0IHN0b3J5SWQgb2YgWycxMjMnLCB1bmRlZmluZWRdKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBxdWVyeSwgaW5kZXggfSBvZiBxdWVyaWVzKSB7XG4gICAgICAgICAgY29uc3QgZGV0YWlscyA9IGRiXG4gICAgICAgICAgICAucHJlcGFyZShpbnNlcnRQcmVkaWNhdGUocXVlcnksIHN0b3J5SWQpKVxuICAgICAgICAgICAgLmFsbCh7IHN0b3J5SWQgfSlcbiAgICAgICAgICAgIC5tYXAoKHsgZGV0YWlsIH0pID0+IGRldGFpbClcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgICAgICAgIGNvbnN0IHBvc3RmaXhlZEluZGV4ID0gaW5kZXggKyAoc3RvcnlJZCA/ICcnIDogJ19ub19zdG9yeV9pZCcpO1xuXG4gICAgICAgICAgLy8gSW50ZW50aW9uYWwgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgICAgICAgIGFzc2VydC5pbmNsdWRlKGRldGFpbHMsIGBVU0lORyBJTkRFWCAke3Bvc3RmaXhlZEluZGV4fSBgKTtcbiAgICAgICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWxzLCAnVEVNUCBCLVRSRUUnKTtcbiAgICAgICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWxzLCAnU0NBTicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb241MycsICgpID0+IHtcbiAgICBpdCgncmVtYXBzIGJhbm5lZE1lbWJlcnNWMiB0byBhcnJheSBvZiBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgdXBkYXRlVG9WZXJzaW9uKDUyKTtcblxuICAgICAgY29uc3QgVVVJRF9BID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBVVUlEX0IgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IFVVSURfQyA9IGdlbmVyYXRlR3VpZCgpO1xuXG4gICAgICBjb25zdCBub01lbWJlcnMgPSB7IGlkOiAnYScsIGdyb3VwSWQ6ICdndjJhJyB9O1xuICAgICAgY29uc3QgZW1wdHlNZW1iZXJzID0ge1xuICAgICAgICBpZDogJ2InLFxuICAgICAgICBncm91cElkOiAnZ3YyYicsXG4gICAgICAgIGJhbm5lZE1lbWJlcnNWMjogW10sXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBub25FbXB0eU1lbWJlcnMgPSB7XG4gICAgICAgIGlkOiAnYycsXG4gICAgICAgIGdyb3VwSWQ6ICdndjJjJyxcbiAgICAgICAgYmFubmVkTWVtYmVyc1YyOiBbVVVJRF9BLCBVVUlEX0JdLFxuICAgICAgfTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBjb252ZXJzYXRpb25zXG4gICAgICAgICAgKGlkLCB0eXBlLCB1dWlkLCBqc29uKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnYScsICdncm91cCcsICcke1VVSURfQX0nLCAnJHtKU09OLnN0cmluZ2lmeShub01lbWJlcnMpfScpLFxuICAgICAgICAgICgnYicsICdncm91cCcsICcke1VVSURfQn0nLCAnJHtKU09OLnN0cmluZ2lmeShlbXB0eU1lbWJlcnMpfScpLFxuICAgICAgICAgICgnYycsICdncm91cCcsICcke1VVSURfQ30nLCAnJHtKU09OLnN0cmluZ2lmeShub25FbXB0eU1lbWJlcnMpfScpO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTMpO1xuXG4gICAgICBjb25zdCBlbnRyaWVzOiBBcnJheTx7IGlkOiBzdHJpbmc7IGpzb246IHN0cmluZyB9PiA9IGRiXG4gICAgICAgIC5wcmVwYXJlKCdTRUxFQ1QgaWQsIGpzb24gRlJPTSBjb252ZXJzYXRpb25zIE9SREVSIEJZIGlkJylcbiAgICAgICAgLmFsbCgpO1xuXG4gICAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgICBlbnRyaWVzLm1hcCgoeyBpZCwganNvbiB9KSA9PiAoeyBpZCwgLi4uSlNPTi5wYXJzZShqc29uKSB9KSksXG4gICAgICAgIFtcbiAgICAgICAgICB7IGlkOiAnYScsIGdyb3VwSWQ6ICdndjJhJyB9LFxuICAgICAgICAgIHsgaWQ6ICdiJywgZ3JvdXBJZDogJ2d2MmInLCBiYW5uZWRNZW1iZXJzVjI6IFtdIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdjJyxcbiAgICAgICAgICAgIGdyb3VwSWQ6ICdndjJjJyxcbiAgICAgICAgICAgIGJhbm5lZE1lbWJlcnNWMjogW1xuICAgICAgICAgICAgICB7IHV1aWQ6IFVVSURfQSwgdGltZXN0YW1wOiAwIH0sXG4gICAgICAgICAgICAgIHsgdXVpZDogVVVJRF9CLCB0aW1lc3RhbXA6IDAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjU1JywgKCkgPT4ge1xuICAgIGl0KCdtb3ZlcyBleGlzdGluZyByZXBvcnQgc3BhbSBqb2JzIHRvIG5ldyBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTQpO1xuXG4gICAgICBjb25zdCBFMTY0XzEgPSAnKzEyMTI1NTUwMTU1JztcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgICAgSU5TRVJUIElOVE8gam9ic1xuICAgICAgICAgICAgKGlkLCB0aW1lc3RhbXAsIHF1ZXVlVHlwZSwgZGF0YSlcbiAgICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICAgKCdpZC0xJywgMSwgJ3JhbmRvbSBqb2InLCAne30nKSxcbiAgICAgICAgICAgICgnaWQtMicsIDIsICdyZXBvcnQgc3BhbScsICd7XCJzZXJ2ZXJHdWlkc1wiOiBbXCIke01FU1NBR0VfSURfMX1cIl0sIFwiZTE2NFwiOiBcIiR7RTE2NF8xfVwifScpO1xuICAgICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHRvdGFsSm9icyA9IGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIGpvYnM7JykucGx1Y2soKTtcbiAgICAgIGNvbnN0IHJlcG9ydFNwYW1Kb2JzID0gZGJcbiAgICAgICAgLnByZXBhcmUoXCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBqb2JzIFdIRVJFIHF1ZXVlVHlwZSA9ICdyZXBvcnQgc3BhbSc7XCIpXG4gICAgICAgIC5wbHVjaygpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodG90YWxKb2JzLmdldCgpLCAyLCAnYmVmb3JlIHRvdGFsJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVwb3J0U3BhbUpvYnMuZ2V0KCksIDEsICdiZWZvcmUgcmVwb3J0IHNwYW0nKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDU1KTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHRvdGFsSm9icy5nZXQoKSwgMiwgJ2FmdGVyIHRvdGFsJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVwb3J0U3BhbUpvYnMuZ2V0KCksIDEsICdhZnRlciByZXBvcnQgc3BhbScpO1xuXG4gICAgICBjb25zdCBqb2JzID0gZ2V0Sm9ic0luUXVldWVTeW5jKGRiLCAncmVwb3J0IHNwYW0nKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChqb2JzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2lkLTInLFxuICAgICAgICAgIHF1ZXVlVHlwZTogJ3JlcG9ydCBzcGFtJyxcbiAgICAgICAgICB0aW1lc3RhbXA6IDIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgc2VydmVyR3VpZHM6IFtgJHtNRVNTQUdFX0lEXzF9YF0sXG4gICAgICAgICAgICB1dWlkOiBgJHtFMTY0XzF9YCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb241NicsICgpID0+IHtcbiAgICBpdCgndXBkYXRlcyB1bnNlZW5TdGF0dXMgZm9yIHByZXZpb3VzbHktdW5yZWFkIG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMyA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF80ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzUgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfNiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF83ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzggPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfOSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xMCA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgQ09OVkVSU0FUSU9OX0lEID0gZ2VuZXJhdGVHdWlkKCk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1NSk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNcbiAgICAgICAgICAoaWQsIGNvbnZlcnNhdGlvbklkLCB0eXBlLCByZWFkU3RhdHVzKVxuICAgICAgICAgIFZBTFVFU1xuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzF9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdjYWxsLWhpc3RvcnknLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2NoYW5nZS1udW1iZXItbm90aWZpY2F0aW9uJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzN9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdjaGF0LXNlc3Npb24tcmVmcmVzaGVkJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzR9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdkZWxpdmVyeS1pc3N1ZScsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF81fScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnZ3JvdXAnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2luY29taW5nJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzd9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdrZXljaGFuZ2UnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfOH0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ3RpbWVyLW5vdGlmaWNhdGlvbicsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF85fScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAndmVyaWZpZWQtY2hhbmdlJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzEwfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCBOVUxMLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMTF9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdvdGhlcicsICR7UmVhZFN0YXR1cy5VbnJlYWR9KTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYi5wcmVwYXJlKCdTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlczsnKS5wbHVjaygpLmdldCgpLFxuICAgICAgICAxMSxcbiAgICAgICAgJ3N0YXJ0aW5nIHRvdGFsJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSByZWFkU3RhdHVzID0gJHtSZWFkU3RhdHVzLlVucmVhZH07YFxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMTEsXG4gICAgICAgICdzdGFydGluZyB1bnJlYWQgY291bnQnXG4gICAgICApO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTYpO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzOycpLnBsdWNrKCkuZ2V0KCksXG4gICAgICAgIDExLFxuICAgICAgICAnZW5kaW5nIHRvdGFsJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSByZWFkU3RhdHVzID0gJHtSZWFkU3RhdHVzLlVucmVhZH07YFxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMTAsXG4gICAgICAgICdlbmRpbmcgdW5yZWFkIGNvdW50J1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSBzZWVuU3RhdHVzID0gJHtTZWVuU3RhdHVzLlVuc2Vlbn07YFxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMTAsXG4gICAgICAgICdlbmRpbmcgdW5zZWVuIGNvdW50J1xuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgXCJTRUxFQ1QgcmVhZFN0YXR1cyBGUk9NIG1lc3NhZ2VzIFdIRVJFIHR5cGUgPSAnb3RoZXInIExJTUlUIDE7XCJcbiAgICAgICAgICApXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgICAgXCJjaGVja2luZyByZWFkIHN0YXR1cyBmb3IgbG9uZSAnb3RoZXInIG1lc3NhZ2VcIlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGVzIHVzYWJsZSBpbmRleCBmb3IgZ2V0T2xkZXN0VW5zZWVuTWVzc2FnZUZvckNvbnZlcnNhdGlvbicsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1Nik7XG5cbiAgICAgIGNvbnN0IGZpcnN0ID0gZGJcbiAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICAgIEVYUExBSU4gUVVFUlkgUExBTlxuICAgICAgICAgIFNFTEVDVCAqIEZST00gbWVzc2FnZXMgV0hFUkVcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkID0gJ2lkLWNvbnZlcnNhdGlvbi00JyBBTkRcbiAgICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufSBBTkRcbiAgICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICAgIE5VTEwgSVMgTlVMTFxuICAgICAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IEFTQywgc2VudF9hdCBBU0NcbiAgICAgICAgICBMSU1JVCAxO1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmFsbCgpXG4gICAgICAgIC5tYXAoKHsgZGV0YWlsIH0pID0+IGRldGFpbClcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZShmaXJzdCwgJ1VTSU5HIElOREVYIG1lc3NhZ2VzX3Vuc2Vlbl9ub19zdG9yeScsICdmaXJzdCcpO1xuICAgICAgYXNzZXJ0Lm5vdEluY2x1ZGUoZmlyc3QsICdURU1QIEItVFJFRScsICdmaXJzdCcpO1xuICAgICAgYXNzZXJ0Lm5vdEluY2x1ZGUoZmlyc3QsICdTQ0FOJywgJ2ZpcnN0Jyk7XG5cbiAgICAgIGNvbnN0IHNlY29uZCA9IGRiXG4gICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgIGBcbiAgICAgICAgICBFWFBMQUlOIFFVRVJZIFBMQU5cbiAgICAgICAgICBTRUxFQ1QgKiBGUk9NIG1lc3NhZ2VzIFdIRVJFXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdpZC1jb252ZXJzYXRpb24tNCcgQU5EXG4gICAgICAgICAgICBzZWVuU3RhdHVzID0gJHtTZWVuU3RhdHVzLlVuc2Vlbn0gQU5EXG4gICAgICAgICAgICBpc1N0b3J5IElTIDAgQU5EXG4gICAgICAgICAgICBzdG9yeUlkIElTICdpZC1zdG9yeS00J1xuICAgICAgICAgIE9SREVSIEJZIHJlY2VpdmVkX2F0IEFTQywgc2VudF9hdCBBU0NcbiAgICAgICAgICBMSU1JVCAxO1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmFsbCgpXG4gICAgICAgIC5tYXAoKHsgZGV0YWlsIH0pID0+IGRldGFpbClcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZShcbiAgICAgICAgc2Vjb25kLFxuICAgICAgICAnVVNJTkcgSU5ERVggbWVzc2FnZXNfdW5zZWVuX3dpdGhfc3RvcnknLFxuICAgICAgICAnc2Vjb25kJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKHNlY29uZCwgJ1RFTVAgQi1UUkVFJywgJ3NlY29uZCcpO1xuICAgICAgYXNzZXJ0Lm5vdEluY2x1ZGUoc2Vjb25kLCAnU0NBTicsICdzZWNvbmQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGVzIHVzYWJsZSBpbmRleCBmb3IgZ2V0VW5yZWFkQnlDb252ZXJzYXRpb25BbmRNYXJrUmVhZCcsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1Nik7XG5cbiAgICAgIGNvbnN0IGZpcnN0ID0gZGJcbiAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICAgIEVYUExBSU4gUVVFUlkgUExBTlxuICAgICAgICAgIFVQREFURSBtZXNzYWdlc1xuICAgICAgICAgIFNFVFxuICAgICAgICAgICAgcmVhZFN0YXR1cyA9ICR7UmVhZFN0YXR1cy5SZWFkfSxcbiAgICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuU2Vlbn0sXG4gICAgICAgICAgICBqc29uID0ganNvbl9wYXRjaChqc29uLCAneyBzb21ldGhpbmc6IFwib25lXCIgfScpXG4gICAgICAgICAgV0hFUkVcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkID0gJ2lkLWNvbnZlcnNhdGlvbi00JyBBTkRcbiAgICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufSBBTkRcbiAgICAgICAgICAgIGlzU3RvcnkgPSAwIEFORFxuICAgICAgICAgICAgTlVMTCBJUyBOVUxMIEFORFxuICAgICAgICAgICAgcmVjZWl2ZWRfYXQgPD0gMjM0MzIzMztcbiAgICAgICAgYFxuICAgICAgICApXG4gICAgICAgIC5hbGwoKVxuICAgICAgICAubWFwKCh7IGRldGFpbCB9KSA9PiBkZXRhaWwpXG4gICAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGUoZmlyc3QsICdVU0lORyBJTkRFWCBtZXNzYWdlc191bnNlZW5fbm9fc3RvcnknLCAnZmlyc3QnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGZpcnN0LCAnVEVNUCBCLVRSRUUnLCAnZmlyc3QnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGZpcnN0LCAnU0NBTicsICdmaXJzdCcpO1xuXG4gICAgICBjb25zdCBzZWNvbmQgPSBkYlxuICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICBgXG4gICAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgICAgVVBEQVRFIG1lc3NhZ2VzXG4gICAgICAgICAgU0VUXG4gICAgICAgICAgICByZWFkU3RhdHVzID0gJHtSZWFkU3RhdHVzLlJlYWR9LFxuICAgICAgICAgICAgc2VlblN0YXR1cyA9ICR7U2VlblN0YXR1cy5TZWVufSxcbiAgICAgICAgICAgIGpzb24gPSBqc29uX3BhdGNoKGpzb24sICd7IHNvbWV0aGluZzogXCJvbmVcIiB9JylcbiAgICAgICAgICBXSEVSRVxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWQgPSAnaWQtY29udmVyc2F0aW9uLTQnIEFORFxuICAgICAgICAgICAgc2VlblN0YXR1cyA9ICR7U2VlblN0YXR1cy5VbnNlZW59IEFORFxuICAgICAgICAgICAgaXNTdG9yeSA9IDAgQU5EXG4gICAgICAgICAgICBzdG9yeUlkIElTICdpZC1zdG9yeS00JyBBTkRcbiAgICAgICAgICAgIHJlY2VpdmVkX2F0IDw9IDIzNDMyMzM7XG4gICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuYWxsKClcbiAgICAgICAgLm1hcCgoeyBkZXRhaWwgfSkgPT4gZGV0YWlsKVxuICAgICAgICAuam9pbignXFxuJyk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlKFxuICAgICAgICBzZWNvbmQsXG4gICAgICAgICdVU0lORyBJTkRFWCBtZXNzYWdlc191bnNlZW5fd2l0aF9zdG9yeScsXG4gICAgICAgICdzZWNvbmQnXG4gICAgICApO1xuICAgICAgYXNzZXJ0Lm5vdEluY2x1ZGUoc2Vjb25kLCAnVEVNUCBCLVRSRUUnLCAnc2Vjb25kJyk7XG4gICAgICBhc3NlcnQubm90SW5jbHVkZShzZWNvbmQsICdTQ0FOJywgJ3NlY29uZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZXMgdXNhYmxlIGluZGV4IGZvciBnZXRUb3RhbFVuc2VlbkZvckNvbnZlcnNhdGlvblN5bmMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTYpO1xuXG4gICAgICBjb25zdCBmaXJzdCA9IGRiXG4gICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgIGBcbiAgICAgICAgICBFWFBMQUlOIFFVRVJZIFBMQU5cbiAgICAgICAgICBTRUxFQ1QgY291bnQoaWQpXG4gICAgICAgICAgRlJPTSBtZXNzYWdlc1xuICAgICAgICAgIFdIRVJFXG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdpZC1jb252ZXJzYXRpb24tNCcgQU5EXG4gICAgICAgICAgICBzZWVuU3RhdHVzID0gJHtTZWVuU3RhdHVzLlVuc2Vlbn0gQU5EXG4gICAgICAgICAgICBpc1N0b3J5IElTIDAgQU5EXG4gICAgICAgICAgICBOVUxMIElTIE5VTEw7XG4gICAgICAgIGBcbiAgICAgICAgKVxuICAgICAgICAuYWxsKClcbiAgICAgICAgLm1hcCgoeyBkZXRhaWwgfSkgPT4gZGV0YWlsKVxuICAgICAgICAuam9pbignXFxuJyk7XG5cbiAgICAgIC8vIFdlaXJkLCBidXQgd2UgZG9uJ3QgaW5jbHVkZWQgcmVjZWl2ZWRfYXQgc28gaXQgZG9lc24ndCByZWFsbHkgbWF0dGVyXG4gICAgICBhc3NlcnQuaW5jbHVkZShmaXJzdCwgJ1VTSU5HIElOREVYIG1lc3NhZ2VzX3Vuc2Vlbl93aXRoX3N0b3J5JywgJ2ZpcnN0Jyk7XG4gICAgICBhc3NlcnQubm90SW5jbHVkZShmaXJzdCwgJ1RFTVAgQi1UUkVFJywgJ2ZpcnN0Jyk7XG4gICAgICBhc3NlcnQubm90SW5jbHVkZShmaXJzdCwgJ1NDQU4nLCAnZmlyc3QnKTtcblxuICAgICAgY29uc3Qgc2Vjb25kID0gZGJcbiAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgYFxuICAgICAgICAgIEVYUExBSU4gUVVFUlkgUExBTlxuICAgICAgICAgIFNFTEVDVCBjb3VudChpZClcbiAgICAgICAgICBGUk9NIG1lc3NhZ2VzXG4gICAgICAgICAgV0hFUkVcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkID0gJ2lkLWNvbnZlcnNhdGlvbi00JyBBTkRcbiAgICAgICAgICAgIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufSBBTkRcbiAgICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICAgIHN0b3J5SWQgSVMgJ2lkLXN0b3J5LTQnO1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmFsbCgpXG4gICAgICAgIC5tYXAoKHsgZGV0YWlsIH0pID0+IGRldGFpbClcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZShcbiAgICAgICAgc2Vjb25kLFxuICAgICAgICAnVVNJTkcgSU5ERVggbWVzc2FnZXNfdW5zZWVuX3dpdGhfc3RvcnknLFxuICAgICAgICAnc2Vjb25kJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKHNlY29uZCwgJ1RFTVAgQi1UUkVFJywgJ3NlY29uZCcpO1xuICAgICAgYXNzZXJ0Lm5vdEluY2x1ZGUoc2Vjb25kLCAnU0NBTicsICdzZWNvbmQnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjU4JywgKCkgPT4ge1xuICAgIGl0KCd1cGRhdGVzIHVuc2VlblN0YXR1cyBmb3IgcHJldmlvdXNseS11bnJlYWQgbWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMiA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8zID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzQgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfNSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF82ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzcgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfOCA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF85ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzEwID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzExID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBDT05WRVJTQVRJT05fSUQgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDU1KTtcblxuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc1xuICAgICAgICAgIChpZCwgY29udmVyc2F0aW9uSWQsIHR5cGUsIHJlYWRTdGF0dXMpXG4gICAgICAgICAgVkFMVUVTXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2NhbGwtaGlzdG9yeScsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8yfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnY2hhbmdlLW51bWJlci1ub3RpZmljYXRpb24nLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfM30nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2NoYXQtc2Vzc2lvbi1yZWZyZXNoZWQnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfNH0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2RlbGl2ZXJ5LWlzc3VlJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzV9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdncm91cCcsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF82fScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnaW5jb21pbmcnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfN30nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2tleWNoYW5nZScsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF84fScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAndGltZXItbm90aWZpY2F0aW9uJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzl9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICd2ZXJpZmllZC1jaGFuZ2UnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMTB9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsIE5VTEwsICR7UmVhZFN0YXR1cy5VbnJlYWR9KSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xMX0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ290aGVyJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pO1xuICAgICAgICBgXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiLnByZXBhcmUoJ1NFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzOycpLnBsdWNrKCkuZ2V0KCksXG4gICAgICAgIDExLFxuICAgICAgICAnc3RhcnRpbmcgdG90YWwnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgYFNFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIHJlYWRTdGF0dXMgPSAke1JlYWRTdGF0dXMuVW5yZWFkfTtgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxMSxcbiAgICAgICAgJ3N0YXJ0aW5nIHVucmVhZCBjb3VudCdcbiAgICAgICk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1Nik7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMTEsXG4gICAgICAgICdlbmRpbmcgdG90YWwnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgYFNFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIHJlYWRTdGF0dXMgPSAke1JlYWRTdGF0dXMuVW5yZWFkfTtgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxMCxcbiAgICAgICAgJ2VuZGluZyB1bnJlYWQgY291bnQnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgYFNFTEVDVCBDT1VOVCgqKSBGUk9NIG1lc3NhZ2VzIFdIRVJFIHNlZW5TdGF0dXMgPSAke1NlZW5TdGF0dXMuVW5zZWVufTtgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICAxMCxcbiAgICAgICAgJ2VuZGluZyB1bnNlZW4gY291bnQnXG4gICAgICApO1xuXG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICBcIlNFTEVDVCByZWFkU3RhdHVzIEZST00gbWVzc2FnZXMgV0hFUkUgdHlwZSA9ICdvdGhlcicgTElNSVQgMTtcIlxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgUmVhZFN0YXR1cy5SZWFkLFxuICAgICAgICBcImNoZWNraW5nIHJlYWQgc3RhdHVzIGZvciAnb3RoZXInIG1lc3NhZ2VcIlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdTZXRzIHJlYWRTdGF0dXM9UmVhZCBmb3Iga2V5Y2hhbmdlIGFuZCBjaGFuZ2UtbnVtYmVyLW5vdGlmaWNhdGlvbiBtZXNzYWdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMSA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8yID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzMgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IENPTlZFUlNBVElPTl9JRCA9IGdlbmVyYXRlR3VpZCgpO1xuXG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNTcpO1xuXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgdHlwZSwgcmVhZFN0YXR1cylcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnaW5jb21pbmcnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2NoYW5nZS1udW1iZXItbm90aWZpY2F0aW9uJywgJHtSZWFkU3RhdHVzLlVucmVhZH0pLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzN9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdrZXljaGFuZ2UnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMyxcbiAgICAgICAgJ3N0YXJ0aW5nIHRvdGFsJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QgQ09VTlQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSByZWFkU3RhdHVzID0gJHtSZWFkU3RhdHVzLlVucmVhZH07YFxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgMyxcbiAgICAgICAgJ3N0YXJ0aW5nIHVucmVhZCBjb3VudCdcbiAgICAgICk7XG5cbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig1OCk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMyxcbiAgICAgICAgJ2VuZGluZyB0b3RhbCdcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGRiXG4gICAgICAgICAgLnByZXBhcmUoXG4gICAgICAgICAgICBgU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXMgV0hFUkUgcmVhZFN0YXR1cyA9ICR7UmVhZFN0YXR1cy5VbnJlYWR9O2BcbiAgICAgICAgICApXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIDEsXG4gICAgICAgICdlbmRpbmcgdW5yZWFkIGNvdW50J1xuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgXCJTRUxFQ1QgcmVhZFN0YXR1cyBGUk9NIG1lc3NhZ2VzIFdIRVJFIHR5cGUgPSAna2V5Y2hhbmdlJyBMSU1JVCAxO1wiXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgIFwiY2hlY2tpbmcgcmVhZCBzdGF0dXMgZm9yICdrZXljaGFuZ2UnIG1lc3NhZ2VcIlxuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIFwiU0VMRUNUIHNlZW5TdGF0dXMgRlJPTSBtZXNzYWdlcyBXSEVSRSB0eXBlID0gJ2tleWNoYW5nZScgTElNSVQgMTtcIlxuICAgICAgICAgIClcbiAgICAgICAgICAucGx1Y2soKVxuICAgICAgICAgIC5nZXQoKSxcbiAgICAgICAgU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICAgIFwiY2hlY2tpbmcgc2VlbiBzdGF0dXMgZm9yICdrZXljaGFuZ2UnIG1lc3NhZ2VcIlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd1cGRhdGVzIHJlYWRTdGF0dXMvc2VlblN0YXR1cyBmb3IgbWVzc2FnZXMgd2l0aCB1bnJlYWQ6IHRydWUvMSBpbiBKU09OJywgKCkgPT4ge1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF8xID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBNRVNTQUdFX0lEXzIgPSBnZW5lcmF0ZUd1aWQoKTtcbiAgICAgIGNvbnN0IE1FU1NBR0VfSURfMyA9IGdlbmVyYXRlR3VpZCgpO1xuICAgICAgY29uc3QgTUVTU0FHRV9JRF80ID0gZ2VuZXJhdGVHdWlkKCk7XG4gICAgICBjb25zdCBDT05WRVJTQVRJT05fSUQgPSBnZW5lcmF0ZUd1aWQoKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDU3KTtcblxuICAgICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBkYi5leGVjKFxuICAgICAgICBgXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzXG4gICAgICAgICAgKGlkLCBjb252ZXJzYXRpb25JZCwgdHlwZSwgcmVhZFN0YXR1cywgc2VlblN0YXR1cywganNvbilcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8xfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnaW5jb21pbmcnLCAke1JlYWRTdGF0dXMuVW5yZWFkfSwgTlVMTCwgJyR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICB7IGJvZHk6ICdtZXNzYWdlMScgfVxuICAgICAgICAgICl9JyksXG4gICAgICAgICAgKCcke01FU1NBR0VfSURfMn0nLCAnJHtDT05WRVJTQVRJT05fSUR9JywgJ2luY29taW5nJywgJHtSZWFkU3RhdHVzLlJlYWR9LCBOVUxMLCAnJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHsgYm9keTogJ21lc3NhZ2UyJyB9XG4gICAgICAgICAgKX0nKSxcbiAgICAgICAgICAoJyR7TUVTU0FHRV9JRF8zfScsICcke0NPTlZFUlNBVElPTl9JRH0nLCAnaW5jb21pbmcnLCBOVUxMLCAke1NlZW5TdGF0dXMuVW5zZWVufSwgJyR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICB7IGJvZHk6ICdtZXNzYWdlMycgfVxuICAgICAgICAgICApfScpLFxuICAgICAgICAgICgnJHtNRVNTQUdFX0lEXzR9JywgJyR7Q09OVkVSU0FUSU9OX0lEfScsICdpbmNvbWluZycsIE5VTEwsICR7U2VlblN0YXR1cy5TZWVufSwgJyR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICB7IGJvZHk6ICdtZXNzYWdlNCcgfVxuICAgICAgICAgICl9Jyk7XG4gICAgICAgIGBcbiAgICAgICk7XG5cbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGIucHJlcGFyZSgnU0VMRUNUIENPVU5UKCopIEZST00gbWVzc2FnZXM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgNCxcbiAgICAgICAgJ3N0YXJ0aW5nIHRvdGFsJ1xuICAgICAgKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDU4KTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgYFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgPSAnJHtNRVNTQUdFX0lEXzF9JyBMSU1JVCAxO2BcbiAgICAgICAgICApXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBib2R5OiAnbWVzc2FnZTEnLFxuICAgICAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuVW5yZWFkLFxuICAgICAgICAgIHNlZW5TdGF0dXM6IFNlZW5TdGF0dXMuVW5zZWVuLFxuICAgICAgICB9KSxcbiAgICAgICAgJ2NoZWNraW5nIEpTT04gZm9yIG1lc3NhZ2UxJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gJyR7TUVTU0FHRV9JRF8yfScgTElNSVQgMTtgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGJvZHk6ICdtZXNzYWdlMicsIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCB9KSxcbiAgICAgICAgJ2NoZWNraW5nIEpTT04gZm9yIG1lc3NhZ2UyJ1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgIGBTRUxFQ1QganNvbiBGUk9NIG1lc3NhZ2VzIFdIRVJFIGlkID0gJyR7TUVTU0FHRV9JRF8zfScgTElNSVQgMTtgXG4gICAgICAgICAgKVxuICAgICAgICAgIC5wbHVjaygpXG4gICAgICAgICAgLmdldCgpLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgYm9keTogJ21lc3NhZ2UzJyxcbiAgICAgICAgICByZWFkU3RhdHVzOiBSZWFkU3RhdHVzLlJlYWQsXG4gICAgICAgICAgc2VlblN0YXR1czogU2VlblN0YXR1cy5VbnNlZW4sXG4gICAgICAgIH0pLFxuICAgICAgICAnY2hlY2tpbmcgSlNPTiBmb3IgbWVzc2FnZTMnXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYlxuICAgICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgICAgYFNFTEVDVCBqc29uIEZST00gbWVzc2FnZXMgV0hFUkUgaWQgPSAnJHtNRVNTQUdFX0lEXzR9JyBMSU1JVCAxO2BcbiAgICAgICAgICApXG4gICAgICAgICAgLnBsdWNrKClcbiAgICAgICAgICAuZ2V0KCksXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBib2R5OiAnbWVzc2FnZTQnLFxuICAgICAgICAgIHJlYWRTdGF0dXM6IFJlYWRTdGF0dXMuUmVhZCxcbiAgICAgICAgICBzZWVuU3RhdHVzOiBTZWVuU3RhdHVzLlNlZW4sXG4gICAgICAgIH0pLFxuICAgICAgICAnY2hlY2tpbmcgSlNPTiBmb3IgbWVzc2FnZTQnXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjAnLCAoKSA9PiB7XG4gICAgaXQoJ3VwZGF0ZXMgaW5kZXggdG8gbWFrZSBxdWVyeSBlZmZpY2llbnQnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNjApO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGRiXG4gICAgICAgIC5wcmVwYXJlKFxuICAgICAgICAgIGBcbiAgICAgICAgRVhQTEFJTiBRVUVSWSBQTEFOXG4gICAgICAgIFVQREFURSBtZXNzYWdlc1xuICAgICAgICBJTkRFWEVEIEJZIGV4cGlyaW5nX21lc3NhZ2VfYnlfY29udmVyc2F0aW9uX2FuZF9yZWNlaXZlZF9hdFxuICAgICAgICBTRVRcbiAgICAgICAgICBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgPSAzNDIzNDIsXG4gICAgICAgICAganNvbiA9IGpzb25fcGF0Y2goanNvbiwgJ3sgXCJzb21ldGhpbmdcIjogdHJ1ZSB9JylcbiAgICAgICAgV0hFUkVcbiAgICAgICAgICBjb252ZXJzYXRpb25JZCA9ICdjb252ZXJzYXRpb25JZCcgQU5EXG4gICAgICAgICAgc3RvcnlJZCBJUyBOVUxMIEFORFxuICAgICAgICAgIGlzU3RvcnkgSVMgMCBBTkRcbiAgICAgICAgICB0eXBlIElTICdpbmNvbWluZycgQU5EXG4gICAgICAgICAgKFxuICAgICAgICAgICAgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wIElTIE5VTEwgT1JcbiAgICAgICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA+IDIzNDIzNDIzXG4gICAgICAgICAgKSBBTkRcbiAgICAgICAgICBleHBpcmVUaW1lciA+IDAgQU5EXG4gICAgICAgICAgcmVjZWl2ZWRfYXQgPD0gMjM0MjM0O1xuICAgICAgICBgXG4gICAgICAgIClcbiAgICAgICAgLmFsbCgpO1xuICAgICAgY29uc3QgZGV0YWlsID0gaXRlbXMubWFwKGl0ZW0gPT4gaXRlbS5kZXRhaWwpLmpvaW4oJ1xcbicpO1xuXG4gICAgICBhc3NlcnQubm90SW5jbHVkZShkZXRhaWwsICdCLVRSRUUnKTtcbiAgICAgIGFzc2VydC5ub3RJbmNsdWRlKGRldGFpbCwgJ1NDQU4nKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlKFxuICAgICAgICBkZXRhaWwsXG4gICAgICAgICdTRUFSQ0ggbWVzc2FnZXMgVVNJTkcgSU5ERVggJyArXG4gICAgICAgICAgJ2V4cGlyaW5nX21lc3NhZ2VfYnlfY29udmVyc2F0aW9uX2FuZF9yZWNlaXZlZF9hdCAnICtcbiAgICAgICAgICAnKGNvbnZlcnNhdGlvbklkPT8gQU5EIHN0b3J5SWQ9PyknXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjInLCAoKSA9PiB7XG4gICAgaXQoJ2FkZHMgbmV3IHVyZ2VudCBmaWVsZCB0byBzZW5kTG9nUGF5bG9hZHMnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUb1ZlcnNpb24oNjIpO1xuXG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgZGIuZXhlYyhcbiAgICAgICAgYFxuICAgICAgICBJTlNFUlQgSU5UTyBzZW5kTG9nUGF5bG9hZHNcbiAgICAgICAgICAoY29udGVudEhpbnQsIHRpbWVzdGFtcCwgcHJvdG8sIHVyZ2VudClcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoMSwgJHt0aW1lc3RhbXB9LCBYJzAxMjM0NTY3ODlBQkNERUYnLCAxKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBkYi5wcmVwYXJlKCdTRUxFQ1QgQ09VTlQoKikgRlJPTSBzZW5kTG9nUGF5bG9hZHM7JykucGx1Y2soKS5nZXQoKSxcbiAgICAgICAgMSxcbiAgICAgICAgJ3N0YXJ0aW5nIHRvdGFsJ1xuICAgICAgKTtcblxuICAgICAgY29uc3QgcGF5bG9hZCA9IGRiXG4gICAgICAgIC5wcmVwYXJlKCdTRUxFQ1QgKiBGUk9NIHNlbmRMb2dQYXlsb2FkcyBMSU1JVCAxOycpXG4gICAgICAgIC5nZXQoKTtcblxuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHBheWxvYWQuY29udGVudEhpbnQsIDEpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHBheWxvYWQudGltZXN0YW1wLCB0aW1lc3RhbXApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHBheWxvYWQucHJvdG8ubGVuZ3RoLCA4KTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChwYXlsb2FkLnVyZ2VudCwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd1cGRhdGVUb1NjaGVtYVZlcnNpb242NScsICgpID0+IHtcbiAgICBpdCgnaW5pdGlhbGl6ZXMgc3RpY2tlciBwYWNrIHBvc2l0aW9ucycsICgpID0+IHtcbiAgICAgIHVwZGF0ZVRvVmVyc2lvbig2NCk7XG5cbiAgICAgIGRiLmV4ZWMoXG4gICAgICAgIGBcbiAgICAgICAgSU5TRVJUIElOVE8gc3RpY2tlcl9wYWNrc1xuICAgICAgICAgIChpZCwga2V5LCBsYXN0VXNlZClcbiAgICAgICAgICBWQUxVRVNcbiAgICAgICAgICAoXCJhXCIsIFwia2V5LTFcIiwgMSksXG4gICAgICAgICAgKFwiYlwiLCBcImtleS0yXCIsIDIpLFxuICAgICAgICAgIChcImNcIiwgXCJrZXktM1wiLCAzKTtcbiAgICAgICAgYFxuICAgICAgKTtcblxuICAgICAgdXBkYXRlVG9WZXJzaW9uKDY1KTtcblxuICAgICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgICAgZGJcbiAgICAgICAgICAucHJlcGFyZShcbiAgICAgICAgICAgICdTRUxFQ1QgaWQsIHBvc2l0aW9uIEZST00gc3RpY2tlcl9wYWNrcyBPUkRFUiBCWSBwb3NpdGlvbiBERVNDJ1xuICAgICAgICAgIClcbiAgICAgICAgICAuYWxsKCksXG4gICAgICAgIFtcbiAgICAgICAgICB7IGlkOiAnYScsIHBvc2l0aW9uOiAyIH0sXG4gICAgICAgICAgeyBpZDogJ2InLCBwb3NpdGlvbjogMSB9LFxuICAgICAgICAgIHsgaWQ6ICdjJywgcG9zaXRpb246IDAgfSxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrQkFBdUI7QUFFdkIsNEJBQWdCO0FBQ2hCLGtCQUFtQztBQUVuQyx3QkFBZ0M7QUFDaEMsMkJBQThCO0FBQzlCLG9CQUlPO0FBQ1AsK0JBQTJCO0FBQzNCLCtCQUEyQjtBQUUzQixNQUFNLFdBQVcsb0JBQWE7QUFFOUIsU0FBUyx1QkFBdUIsTUFBTTtBQUNwQyxNQUFJO0FBRUosUUFBTSxrQkFBa0Isd0JBQUMsWUFBb0I7QUFDM0MsVUFBTSxlQUFlLEdBQUcsT0FBTyxnQkFBZ0IsRUFBRSxRQUFRLEtBQUssQ0FBQztBQUUvRCxlQUFXLE9BQU8sbUNBQWlCO0FBQ2pDLFVBQUksY0FBYyxJQUFJLGtDQUFhO0FBRW5DLFlBQU0saUJBQWlCLEdBQUcsT0FBTyxnQkFBZ0IsRUFBRSxRQUFRLEtBQUssQ0FBQztBQUVqRSxVQUFJLG1CQUFtQixTQUFTO0FBQzlCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxVQUFNLElBQUksTUFBTSxnQkFBZ0IsbUJBQW1CO0FBQUEsRUFDckQsR0Fkd0I7QUFnQnhCLFFBQU0sYUFBYSw2QkFBTTtBQUN2QixVQUFNLFFBQVE7QUFBQSxNQUNaLElBQUk7QUFBQSxNQUNKLE9BQU8sR0FBRztBQUFBLElBQ1o7QUFDQSxPQUFHLEtBQ0Q7QUFBQTtBQUFBLHVCQUVpQixLQUFLLFVBQVUsS0FBSztBQUFBLE9BRXZDO0FBQUEsRUFDRixHQVhtQjtBQWFuQixRQUFNLGFBQWEsd0JBQ2pCLFVBQ21CO0FBQ25CLFdBQU8sTUFBTSxJQUFJLFVBQVE7QUFDdkIsYUFBTztBQUFBLFdBQ0Y7QUFBQSxRQUNILE1BQU0sS0FBSyxNQUFNLEtBQUssSUFBSTtBQUFBLE1B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
