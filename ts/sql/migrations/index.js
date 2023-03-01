var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var migrations_exports = {};
__export(migrations_exports, {
  SCHEMA_VERSIONS: () => SCHEMA_VERSIONS,
  updateSchema: () => updateSchema
});
module.exports = __toCommonJS(migrations_exports);
var import_lodash = require("lodash");
var import_UUID = require("../../types/UUID");
var import_util = require("../util");
var import_uuid_keys = __toESM(require("./41-uuid-keys"));
var import_stale_reactions = __toESM(require("./42-stale-reactions"));
var import_gv2_uuid = __toESM(require("./43-gv2-uuid"));
var import_badges = __toESM(require("./44-badges"));
var import_stories = __toESM(require("./45-stories"));
var import_optimize_stories = __toESM(require("./46-optimize-stories"));
var import_further_optimize = __toESM(require("./47-further-optimize"));
var import_fix_user_initiated_index = __toESM(require("./48-fix-user-initiated-index"));
var import_fix_preview_index = __toESM(require("./49-fix-preview-index"));
var import_fix_messages_unread_index = __toESM(require("./50-fix-messages-unread-index"));
var import_centralize_conversation_jobs = __toESM(require("./51-centralize-conversation-jobs"));
var import_optimize_stories2 = __toESM(require("./52-optimize-stories"));
var import_gv2_banned_members = __toESM(require("./53-gv2-banned-members"));
var import_unprocessed_received_at_counter = __toESM(require("./54-unprocessed-received-at-counter"));
var import_report_message_aci = __toESM(require("./55-report-message-aci"));
var import_add_unseen_to_message = __toESM(require("./56-add-unseen-to-message"));
var import_rm_message_history_unsynced = __toESM(require("./57-rm-message-history-unsynced"));
var import_update_unread = __toESM(require("./58-update-unread"));
var import_unprocessed_received_at_counter_index = __toESM(require("./59-unprocessed-received-at-counter-index"));
var import_update_expiring_index = __toESM(require("./60-update-expiring-index"));
var import_distribution_list_storage = __toESM(require("./61-distribution-list-storage"));
var import_add_urgent_to_send_log = __toESM(require("./62-add-urgent-to-send-log"));
var import_add_urgent_to_unprocessed = __toESM(require("./63-add-urgent-to-unprocessed"));
var import_uuid_column_for_pre_keys = __toESM(require("./64-uuid-column-for-pre-keys"));
var import_add_storage_id_to_stickers = __toESM(require("./65-add-storage-id-to-stickers"));
function updateToSchemaVersion1(currentVersion, db, logger) {
  if (currentVersion >= 1) {
    return;
  }
  logger.info("updateToSchemaVersion1: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE messages(
        id STRING PRIMARY KEY ASC,
        json TEXT,

        unread INTEGER,
        expires_at INTEGER,
        sent_at INTEGER,
        schemaVersion INTEGER,
        conversationId STRING,
        received_at INTEGER,
        source STRING,
        sourceDevice STRING,
        hasAttachments INTEGER,
        hasFileAttachments INTEGER,
        hasVisualMediaAttachments INTEGER
      );
      CREATE INDEX messages_unread ON messages (
        unread
      );
      CREATE INDEX messages_expires_at ON messages (
        expires_at
      );
      CREATE INDEX messages_receipt ON messages (
        sent_at
      );
      CREATE INDEX messages_schemaVersion ON messages (
        schemaVersion
      );
      CREATE INDEX messages_conversation ON messages (
        conversationId,
        received_at
      );
      CREATE INDEX messages_duplicate_check ON messages (
        source,
        sourceDevice,
        sent_at
      );
      CREATE INDEX messages_hasAttachments ON messages (
        conversationId,
        hasAttachments,
        received_at
      );
      CREATE INDEX messages_hasFileAttachments ON messages (
        conversationId,
        hasFileAttachments,
        received_at
      );
      CREATE INDEX messages_hasVisualMediaAttachments ON messages (
        conversationId,
        hasVisualMediaAttachments,
        received_at
      );
      CREATE TABLE unprocessed(
        id STRING,
        timestamp INTEGER,
        json TEXT
      );
      CREATE INDEX unprocessed_id ON unprocessed (
        id
      );
      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );
    `);
    db.pragma("user_version = 1");
  })();
  logger.info("updateToSchemaVersion1: success!");
}
function updateToSchemaVersion2(currentVersion, db, logger) {
  if (currentVersion >= 2) {
    return;
  }
  logger.info("updateToSchemaVersion2: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
        ADD COLUMN expireTimer INTEGER;

      ALTER TABLE messages
        ADD COLUMN expirationStartTimestamp INTEGER;

      ALTER TABLE messages
        ADD COLUMN type STRING;

      CREATE INDEX messages_expiring ON messages (
        expireTimer,
        expirationStartTimestamp,
        expires_at
      );

      UPDATE messages SET
        expirationStartTimestamp = json_extract(json, '$.expirationStartTimestamp'),
        expireTimer = json_extract(json, '$.expireTimer'),
        type = json_extract(json, '$.type');
    `);
    db.pragma("user_version = 2");
  })();
  logger.info("updateToSchemaVersion2: success!");
}
function updateToSchemaVersion3(currentVersion, db, logger) {
  if (currentVersion >= 3) {
    return;
  }
  logger.info("updateToSchemaVersion3: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX messages_expiring;
      DROP INDEX messages_unread;

      CREATE INDEX messages_without_timer ON messages (
        expireTimer,
        expires_at,
        type
      ) WHERE expires_at IS NULL AND expireTimer IS NOT NULL;

      CREATE INDEX messages_unread ON messages (
        conversationId,
        unread
      ) WHERE unread IS NOT NULL;

      ANALYZE;
    `);
    db.pragma("user_version = 3");
  })();
  logger.info("updateToSchemaVersion3: success!");
}
function updateToSchemaVersion4(currentVersion, db, logger) {
  if (currentVersion >= 4) {
    return;
  }
  logger.info("updateToSchemaVersion4: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE conversations(
        id STRING PRIMARY KEY ASC,
        json TEXT,

        active_at INTEGER,
        type STRING,
        members TEXT,
        name TEXT,
        profileName TEXT
      );
      CREATE INDEX conversations_active ON conversations (
        active_at
      ) WHERE active_at IS NOT NULL;

      CREATE INDEX conversations_type ON conversations (
        type
      ) WHERE type IS NOT NULL;
    `);
    db.pragma("user_version = 4");
  })();
  logger.info("updateToSchemaVersion4: success!");
}
function updateToSchemaVersion6(currentVersion, db, logger) {
  if (currentVersion >= 6) {
    return;
  }
  logger.info("updateToSchemaVersion6: starting...");
  db.transaction(() => {
    db.exec(`
      -- key-value, ids are strings, one extra column
      CREATE TABLE sessions(
        id STRING PRIMARY KEY ASC,
        number STRING,
        json TEXT
      );
      CREATE INDEX sessions_number ON sessions (
        number
      ) WHERE number IS NOT NULL;
      -- key-value, ids are strings
      CREATE TABLE groups(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE identityKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE items(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      -- key-value, ids are integers
      CREATE TABLE preKeys(
        id INTEGER PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE signedPreKeys(
        id INTEGER PRIMARY KEY ASC,
        json TEXT
      );
    `);
    db.pragma("user_version = 6");
  })();
  logger.info("updateToSchemaVersion6: success!");
}
function updateToSchemaVersion7(currentVersion, db, logger) {
  if (currentVersion >= 7) {
    return;
  }
  logger.info("updateToSchemaVersion7: starting...");
  db.transaction(() => {
    db.exec(`
      -- SQLite has been coercing our STRINGs into numbers, so we force it with TEXT
      -- We create a new table then copy the data into it, since we can't modify columns
      DROP INDEX sessions_number;
      ALTER TABLE sessions RENAME TO sessions_old;

      CREATE TABLE sessions(
        id TEXT PRIMARY KEY,
        number TEXT,
        json TEXT
      );
      CREATE INDEX sessions_number ON sessions (
        number
      ) WHERE number IS NOT NULL;
      INSERT INTO sessions(id, number, json)
        SELECT "+" || id, number, json FROM sessions_old;
      DROP TABLE sessions_old;
    `);
    db.pragma("user_version = 7");
  })();
  logger.info("updateToSchemaVersion7: success!");
}
function updateToSchemaVersion8(currentVersion, db, logger) {
  if (currentVersion >= 8) {
    return;
  }
  logger.info("updateToSchemaVersion8: starting...");
  db.transaction(() => {
    db.exec(`
      -- First, we pull a new body field out of the message table's json blob
      ALTER TABLE messages
        ADD COLUMN body TEXT;
      UPDATE messages SET body = json_extract(json, '$.body');

      -- Then we create our full-text search table and populate it
      CREATE VIRTUAL TABLE messages_fts
        USING fts5(id UNINDEXED, body);

      INSERT INTO messages_fts(id, body)
        SELECT id, body FROM messages;

      -- Then we set up triggers to keep the full-text search table up to date
      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 8");
  })();
  logger.info("updateToSchemaVersion8: success!");
}
function updateToSchemaVersion9(currentVersion, db, logger) {
  if (currentVersion >= 9) {
    return;
  }
  logger.info("updateToSchemaVersion9: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE attachment_downloads(
        id STRING primary key,
        timestamp INTEGER,
        pending INTEGER,
        json TEXT
      );

      CREATE INDEX attachment_downloads_timestamp
        ON attachment_downloads (
          timestamp
      ) WHERE pending = 0;
      CREATE INDEX attachment_downloads_pending
        ON attachment_downloads (
          pending
      ) WHERE pending != 0;
    `);
    db.pragma("user_version = 9");
  })();
  logger.info("updateToSchemaVersion9: success!");
}
function updateToSchemaVersion10(currentVersion, db, logger) {
  if (currentVersion >= 10) {
    return;
  }
  logger.info("updateToSchemaVersion10: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX unprocessed_id;
      DROP INDEX unprocessed_timestamp;
      ALTER TABLE unprocessed RENAME TO unprocessed_old;

      CREATE TABLE unprocessed(
        id STRING,
        timestamp INTEGER,
        version INTEGER,
        attempts INTEGER,
        envelope TEXT,
        decrypted TEXT,
        source TEXT,
        sourceDevice TEXT,
        serverTimestamp INTEGER
      );

      CREATE INDEX unprocessed_id ON unprocessed (
        id
      );
      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );

      INSERT INTO unprocessed (
        id,
        timestamp,
        version,
        attempts,
        envelope,
        decrypted,
        source,
        sourceDevice,
        serverTimestamp
      ) SELECT
        id,
        timestamp,
        json_extract(json, '$.version'),
        json_extract(json, '$.attempts'),
        json_extract(json, '$.envelope'),
        json_extract(json, '$.decrypted'),
        json_extract(json, '$.source'),
        json_extract(json, '$.sourceDevice'),
        json_extract(json, '$.serverTimestamp')
      FROM unprocessed_old;

      DROP TABLE unprocessed_old;
    `);
    db.pragma("user_version = 10");
  })();
  logger.info("updateToSchemaVersion10: success!");
}
function updateToSchemaVersion11(currentVersion, db, logger) {
  if (currentVersion >= 11) {
    return;
  }
  logger.info("updateToSchemaVersion11: starting...");
  db.transaction(() => {
    db.exec(`
      DROP TABLE groups;
    `);
    db.pragma("user_version = 11");
  })();
  logger.info("updateToSchemaVersion11: success!");
}
function updateToSchemaVersion12(currentVersion, db, logger) {
  if (currentVersion >= 12) {
    return;
  }
  logger.info("updateToSchemaVersion12: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE sticker_packs(
        id TEXT PRIMARY KEY,
        key TEXT NOT NULL,

        author STRING,
        coverStickerId INTEGER,
        createdAt INTEGER,
        downloadAttempts INTEGER,
        installedAt INTEGER,
        lastUsed INTEGER,
        status STRING,
        stickerCount INTEGER,
        title STRING
      );

      CREATE TABLE stickers(
        id INTEGER NOT NULL,
        packId TEXT NOT NULL,

        emoji STRING,
        height INTEGER,
        isCoverOnly INTEGER,
        lastUsed INTEGER,
        path STRING,
        width INTEGER,

        PRIMARY KEY (id, packId),
        CONSTRAINT stickers_fk
          FOREIGN KEY (packId)
          REFERENCES sticker_packs(id)
          ON DELETE CASCADE
      );

      CREATE INDEX stickers_recents
        ON stickers (
          lastUsed
      ) WHERE lastUsed IS NOT NULL;

      CREATE TABLE sticker_references(
        messageId STRING,
        packId TEXT,
        CONSTRAINT sticker_references_fk
          FOREIGN KEY(packId)
          REFERENCES sticker_packs(id)
          ON DELETE CASCADE
      );
    `);
    db.pragma("user_version = 12");
  })();
  logger.info("updateToSchemaVersion12: success!");
}
function updateToSchemaVersion13(currentVersion, db, logger) {
  if (currentVersion >= 13) {
    return;
  }
  logger.info("updateToSchemaVersion13: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE sticker_packs ADD COLUMN attemptedStatus STRING;
    `);
    db.pragma("user_version = 13");
  })();
  logger.info("updateToSchemaVersion13: success!");
}
function updateToSchemaVersion14(currentVersion, db, logger) {
  if (currentVersion >= 14) {
    return;
  }
  logger.info("updateToSchemaVersion14: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE emojis(
        shortName STRING PRIMARY KEY,
        lastUsage INTEGER
      );

      CREATE INDEX emojis_lastUsage
        ON emojis (
          lastUsage
      );
    `);
    db.pragma("user_version = 14");
  })();
  logger.info("updateToSchemaVersion14: success!");
}
function updateToSchemaVersion15(currentVersion, db, logger) {
  if (currentVersion >= 15) {
    return;
  }
  logger.info("updateToSchemaVersion15: starting...");
  db.transaction(() => {
    db.exec(`
      -- SQLite has again coerced our STRINGs into numbers, so we force it with TEXT
      -- We create a new table then copy the data into it, since we can't modify columns

      DROP INDEX emojis_lastUsage;
      ALTER TABLE emojis RENAME TO emojis_old;

      CREATE TABLE emojis(
        shortName TEXT PRIMARY KEY,
        lastUsage INTEGER
      );
      CREATE INDEX emojis_lastUsage
        ON emojis (
          lastUsage
      );

      DELETE FROM emojis WHERE shortName = 1;
      INSERT INTO emojis(shortName, lastUsage)
        SELECT shortName, lastUsage FROM emojis_old;

      DROP TABLE emojis_old;
    `);
    db.pragma("user_version = 15");
  })();
  logger.info("updateToSchemaVersion15: success!");
}
function updateToSchemaVersion16(currentVersion, db, logger) {
  if (currentVersion >= 16) {
    return;
  }
  logger.info("updateToSchemaVersion16: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      ADD COLUMN messageTimer INTEGER;
      ALTER TABLE messages
      ADD COLUMN messageTimerStart INTEGER;
      ALTER TABLE messages
      ADD COLUMN messageTimerExpiresAt INTEGER;
      ALTER TABLE messages
      ADD COLUMN isErased INTEGER;

      CREATE INDEX messages_message_timer ON messages (
        messageTimer,
        messageTimerStart,
        messageTimerExpiresAt,
        isErased
      ) WHERE messageTimer IS NOT NULL;

      -- Updating full-text triggers to avoid anything with a messageTimer set

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_delete;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.messageTimer IS NULL
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.messageTimer IS NULL
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 16");
  })();
  logger.info("updateToSchemaVersion16: success!");
}
function updateToSchemaVersion17(currentVersion, db, logger) {
  if (currentVersion >= 17) {
    return;
  }
  logger.info("updateToSchemaVersion17: starting...");
  db.transaction(() => {
    try {
      db.exec(`
        ALTER TABLE messages
        ADD COLUMN isViewOnce INTEGER;

        DROP INDEX messages_message_timer;
      `);
    } catch (error) {
      logger.info("updateToSchemaVersion17: Message table already had isViewOnce column");
    }
    try {
      db.exec("DROP INDEX messages_view_once;");
    } catch (error) {
      logger.info("updateToSchemaVersion17: Index messages_view_once did not already exist");
    }
    db.exec(`
      CREATE INDEX messages_view_once ON messages (
        isErased
      ) WHERE isViewOnce = 1;

      -- Updating full-text triggers to avoid anything with isViewOnce = 1

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 17");
  })();
  logger.info("updateToSchemaVersion17: success!");
}
function updateToSchemaVersion18(currentVersion, db, logger) {
  if (currentVersion >= 18) {
    return;
  }
  logger.info("updateToSchemaVersion18: starting...");
  db.transaction(() => {
    db.exec(`
      -- Delete and rebuild full-text search index to capture everything

      DELETE FROM messages_fts;
      INSERT INTO messages_fts(messages_fts) VALUES('rebuild');

      INSERT INTO messages_fts(id, body)
      SELECT id, body FROM messages WHERE isViewOnce IS NULL OR isViewOnce != 1;

      -- Fixing full-text triggers

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 18");
  })();
  logger.info("updateToSchemaVersion18: success!");
}
function updateToSchemaVersion19(currentVersion, db, logger) {
  if (currentVersion >= 19) {
    return;
  }
  logger.info("updateToSchemaVersion19: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE conversations
      ADD COLUMN profileFamilyName TEXT;
      ALTER TABLE conversations
      ADD COLUMN profileFullName TEXT;

      -- Preload new field with the profileName we already have
      UPDATE conversations SET profileFullName = profileName;
    `);
    db.pragma("user_version = 19");
  })();
  logger.info("updateToSchemaVersion19: success!");
}
function updateToSchemaVersion20(currentVersion, db, logger) {
  if (currentVersion >= 20) {
    return;
  }
  logger.info("updateToSchemaVersion20: starting...");
  db.transaction(() => {
    const triggers = db.prepare('SELECT * FROM sqlite_master WHERE type = "trigger" AND tbl_name = "messages"').all();
    for (const trigger of triggers) {
      db.exec(`DROP TRIGGER ${trigger.name}`);
    }
    db.exec(`
      ALTER TABLE conversations ADD COLUMN e164 TEXT;
      ALTER TABLE conversations ADD COLUMN uuid TEXT;
      ALTER TABLE conversations ADD COLUMN groupId TEXT;
      ALTER TABLE messages ADD COLUMN sourceUuid TEXT;
      ALTER TABLE sessions RENAME COLUMN number TO conversationId;
      CREATE INDEX conversations_e164 ON conversations(e164);
      CREATE INDEX conversations_uuid ON conversations(uuid);
      CREATE INDEX conversations_groupId ON conversations(groupId);
      CREATE INDEX messages_sourceUuid on messages(sourceUuid);

      -- Migrate existing IDs
      UPDATE conversations SET e164 = '+' || id WHERE type = 'private';
      UPDATE conversations SET groupId = id WHERE type = 'group';
    `);
    const maybeInvalidGroups = db.prepare("SELECT * FROM conversations WHERE type = 'group' AND members IS NULL;").all();
    for (const group of maybeInvalidGroups) {
      const json = JSON.parse(group.json);
      if (!json.members || !json.members.length) {
        db.prepare("DELETE FROM conversations WHERE id = $id;").run({
          id: json.id
        });
        db.prepare("DELETE FROM messages WHERE conversationId = $id;").run({ id: json.id });
      }
    }
    const allConversations = db.prepare("SELECT * FROM conversations;").all();
    const allConversationsByOldId = (0, import_lodash.keyBy)(allConversations, "id");
    for (const row of allConversations) {
      const oldId = row.id;
      const newId = import_UUID.UUID.generate().toString();
      allConversationsByOldId[oldId].id = newId;
      const patchObj = {
        id: newId
      };
      if (row.type === "private") {
        patchObj.e164 = `+${oldId}`;
      } else if (row.type === "group") {
        patchObj.groupId = oldId;
      }
      const patch = JSON.stringify(patchObj);
      db.prepare(`
        UPDATE conversations
        SET id = $newId, json = JSON_PATCH(json, $patch)
        WHERE id = $oldId
        `).run({
        newId,
        oldId,
        patch
      });
      const messagePatch = JSON.stringify({ conversationId: newId });
      db.prepare(`
        UPDATE messages
        SET conversationId = $newId, json = JSON_PATCH(json, $patch)
        WHERE conversationId = $oldId
        `).run({ newId, oldId, patch: messagePatch });
    }
    const groupConversations = db.prepare(`
        SELECT id, members, json FROM conversations WHERE type = 'group';
        `).all();
    groupConversations.forEach((groupRow) => {
      const members = groupRow.members.split(/\s?\+/).filter(Boolean);
      const newMembers = [];
      for (const m of members) {
        const memberRow = allConversationsByOldId[m];
        if (memberRow) {
          newMembers.push(memberRow.id);
        } else {
          const id = import_UUID.UUID.generate().toString();
          const updatedConversation = {
            id,
            e164: m,
            type: "private",
            version: 2,
            unreadCount: 0,
            verified: 0,
            inbox_position: 0,
            isPinned: false,
            lastMessageDeletedForEveryone: false,
            markedUnread: false,
            messageCount: 0,
            sentMessageCount: 0,
            profileSharing: false
          };
          db.prepare(`
            UPDATE conversations
            SET
              json = $json,
              e164 = $e164,
              type = $type,
            WHERE
              id = $id;
            `).run({
            id: updatedConversation.id,
            json: (0, import_util.objectToJSON)(updatedConversation),
            e164: updatedConversation.e164,
            type: updatedConversation.type
          });
          newMembers.push(id);
        }
      }
      const json = {
        ...(0, import_util.jsonToObject)(groupRow.json),
        members: newMembers
      };
      const newMembersValue = newMembers.join(" ");
      db.prepare(`
        UPDATE conversations
        SET members = $newMembersValue, json = $newJsonValue
        WHERE id = $id
        `).run({
        id: groupRow.id,
        newMembersValue,
        newJsonValue: (0, import_util.objectToJSON)(json)
      });
    });
    const allSessions = db.prepare("SELECT * FROM sessions;").all();
    for (const session of allSessions) {
      const newJson = JSON.parse(session.json);
      const conversation = allConversationsByOldId[newJson.number.substr(1)];
      if (conversation) {
        newJson.conversationId = conversation.id;
        newJson.id = `${newJson.conversationId}.${newJson.deviceId}`;
      }
      delete newJson.number;
      db.prepare(`
        UPDATE sessions
        SET id = $newId, json = $newJson, conversationId = $newConversationId
        WHERE id = $oldId
        `).run({
        newId: newJson.id,
        newJson: (0, import_util.objectToJSON)(newJson),
        oldId: session.id,
        newConversationId: newJson.conversationId
      });
    }
    const allIdentityKeys = db.prepare("SELECT * FROM identityKeys;").all();
    for (const identityKey of allIdentityKeys) {
      const newJson = JSON.parse(identityKey.json);
      newJson.id = allConversationsByOldId[newJson.id];
      db.prepare(`
        UPDATE identityKeys
        SET id = $newId, json = $newJson
        WHERE id = $oldId
        `).run({
        newId: newJson.id,
        newJson: (0, import_util.objectToJSON)(newJson),
        oldId: identityKey.id
      });
    }
    for (const trigger of triggers) {
      db.exec(trigger.sql);
    }
    db.pragma("user_version = 20");
  })();
  logger.info("updateToSchemaVersion20: success!");
}
function updateToSchemaVersion21(currentVersion, db, logger) {
  if (currentVersion >= 21) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      UPDATE conversations
      SET json = json_set(
        json,
        '$.messageCount',
        (SELECT count(*) FROM messages WHERE messages.conversationId = conversations.id)
      );
      UPDATE conversations
      SET json = json_set(
        json,
        '$.sentMessageCount',
        (SELECT count(*) FROM messages WHERE messages.conversationId = conversations.id AND messages.type = 'outgoing')
      );
    `);
    db.pragma("user_version = 21");
  })();
  logger.info("updateToSchemaVersion21: success!");
}
function updateToSchemaVersion22(currentVersion, db, logger) {
  if (currentVersion >= 22) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE unprocessed
        ADD COLUMN sourceUuid STRING;
    `);
    db.pragma("user_version = 22");
  })();
  logger.info("updateToSchemaVersion22: success!");
}
function updateToSchemaVersion23(currentVersion, db, logger) {
  if (currentVersion >= 23) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- Remove triggers which keep full-text search up to date
      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;
      DROP TRIGGER messages_on_delete;
    `);
    db.pragma("user_version = 23");
  })();
  logger.info("updateToSchemaVersion23: success!");
}
function updateToSchemaVersion24(currentVersion, db, logger) {
  if (currentVersion >= 24) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE conversations
      ADD COLUMN profileLastFetchedAt INTEGER;
    `);
    db.pragma("user_version = 24");
  })();
  logger.info("updateToSchemaVersion24: success!");
}
function updateToSchemaVersion25(currentVersion, db, logger) {
  if (currentVersion >= 25) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      RENAME TO old_messages
    `);
    const indicesToDrop = [
      "messages_expires_at",
      "messages_receipt",
      "messages_schemaVersion",
      "messages_conversation",
      "messages_duplicate_check",
      "messages_hasAttachments",
      "messages_hasFileAttachments",
      "messages_hasVisualMediaAttachments",
      "messages_without_timer",
      "messages_unread",
      "messages_view_once",
      "messages_sourceUuid"
    ];
    for (const index of indicesToDrop) {
      db.exec(`DROP INDEX IF EXISTS ${index};`);
    }
    db.exec(`
      --
      -- Create a new table with a different primary key
      --

      CREATE TABLE messages(
        rowid INTEGER PRIMARY KEY ASC,
        id STRING UNIQUE,
        json TEXT,
        unread INTEGER,
        expires_at INTEGER,
        sent_at INTEGER,
        schemaVersion INTEGER,
        conversationId STRING,
        received_at INTEGER,
        source STRING,
        sourceDevice STRING,
        hasAttachments INTEGER,
        hasFileAttachments INTEGER,
        hasVisualMediaAttachments INTEGER,
        expireTimer INTEGER,
        expirationStartTimestamp INTEGER,
        type STRING,
        body TEXT,
        messageTimer INTEGER,
        messageTimerStart INTEGER,
        messageTimerExpiresAt INTEGER,
        isErased INTEGER,
        isViewOnce INTEGER,
        sourceUuid TEXT);

      -- Create index in lieu of old PRIMARY KEY
      CREATE INDEX messages_id ON messages (id ASC);

      --
      -- Recreate indices
      --

      CREATE INDEX messages_expires_at ON messages (expires_at);

      CREATE INDEX messages_receipt ON messages (sent_at);

      CREATE INDEX messages_schemaVersion ON messages (schemaVersion);

      CREATE INDEX messages_conversation ON messages
        (conversationId, received_at);

      CREATE INDEX messages_duplicate_check ON messages
        (source, sourceDevice, sent_at);

      CREATE INDEX messages_hasAttachments ON messages
        (conversationId, hasAttachments, received_at);

      CREATE INDEX messages_hasFileAttachments ON messages
        (conversationId, hasFileAttachments, received_at);

      CREATE INDEX messages_hasVisualMediaAttachments ON messages
        (conversationId, hasVisualMediaAttachments, received_at);

      CREATE INDEX messages_without_timer ON messages
        (expireTimer, expires_at, type)
        WHERE expires_at IS NULL AND expireTimer IS NOT NULL;

      CREATE INDEX messages_unread ON messages
        (conversationId, unread) WHERE unread IS NOT NULL;

      CREATE INDEX messages_view_once ON messages
        (isErased) WHERE isViewOnce = 1;

      CREATE INDEX messages_sourceUuid on messages(sourceUuid);

      -- New index for searchMessages
      CREATE INDEX messages_searchOrder on messages(received_at, sent_at);

      --
      -- Re-create messages_fts and add triggers
      --

      DROP TABLE messages_fts;

      CREATE VIRTUAL TABLE messages_fts USING fts5(body);

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
      END;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      --
      -- Copy data over
      --

      INSERT INTO messages
      (
        id, json, unread, expires_at, sent_at, schemaVersion, conversationId,
        received_at, source, sourceDevice, hasAttachments, hasFileAttachments,
        hasVisualMediaAttachments, expireTimer, expirationStartTimestamp, type,
        body, messageTimer, messageTimerStart, messageTimerExpiresAt, isErased,
        isViewOnce, sourceUuid
      )
      SELECT
        id, json, unread, expires_at, sent_at, schemaVersion, conversationId,
        received_at, source, sourceDevice, hasAttachments, hasFileAttachments,
        hasVisualMediaAttachments, expireTimer, expirationStartTimestamp, type,
        body, messageTimer, messageTimerStart, messageTimerExpiresAt, isErased,
        isViewOnce, sourceUuid
      FROM old_messages;

      -- Drop old database
      DROP TABLE old_messages;
    `);
    db.pragma("user_version = 25");
  })();
  logger.info("updateToSchemaVersion25: success!");
}
function updateToSchemaVersion26(currentVersion, db, logger) {
  if (currentVersion >= 26) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.body != old.body AND
        (new.isViewOnce IS NULL OR new.isViewOnce != 1)
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;
    `);
    db.pragma("user_version = 26");
  })();
  logger.info("updateToSchemaVersion26: success!");
}
function updateToSchemaVersion27(currentVersion, db, logger) {
  if (currentVersion >= 27) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DELETE FROM messages_fts WHERE rowid IN
        (SELECT rowid FROM messages WHERE body IS NULL);

      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN
        new.body IS NULL OR
        ((old.body IS NULL OR new.body != old.body) AND
         (new.isViewOnce IS NULL OR new.isViewOnce != 1))
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_view_once_update AFTER UPDATE ON messages
      WHEN
        new.body IS NOT NULL AND new.isViewOnce = 1
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
      END;
    `);
    db.pragma("user_version = 27");
  })();
  logger.info("updateToSchemaVersion27: success!");
}
function updateToSchemaVersion28(currentVersion, db, logger) {
  if (currentVersion >= 28) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE jobs(
        id TEXT PRIMARY KEY,
        queueType TEXT STRING NOT NULL,
        timestamp INTEGER NOT NULL,
        data STRING TEXT
      );

      CREATE INDEX jobs_timestamp ON jobs (timestamp);
    `);
    db.pragma("user_version = 28");
  })();
  logger.info("updateToSchemaVersion28: success!");
}
function updateToSchemaVersion29(currentVersion, db, logger) {
  if (currentVersion >= 29) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE reactions(
        conversationId STRING,
        emoji STRING,
        fromId STRING,
        messageReceivedAt INTEGER,
        targetAuthorUuid STRING,
        targetTimestamp INTEGER,
        unread INTEGER
      );

      CREATE INDEX reactions_unread ON reactions (
        unread,
        conversationId
      );

      CREATE INDEX reaction_identifier ON reactions (
        emoji,
        targetAuthorUuid,
        targetTimestamp
      );
    `);
    db.pragma("user_version = 29");
  })();
  logger.info("updateToSchemaVersion29: success!");
}
function updateToSchemaVersion30(currentVersion, db, logger) {
  if (currentVersion >= 30) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE senderKeys(
        id TEXT PRIMARY KEY NOT NULL,
        senderId TEXT NOT NULL,
        distributionId TEXT NOT NULL,
        data BLOB NOT NULL,
        lastUpdatedDate NUMBER NOT NULL
      );
    `);
    db.pragma("user_version = 30");
  })();
  logger.info("updateToSchemaVersion30: success!");
}
function updateToSchemaVersion31(currentVersion, db, logger) {
  if (currentVersion >= 31) {
    return;
  }
  logger.info("updateToSchemaVersion31: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX unprocessed_id;
      DROP INDEX unprocessed_timestamp;
      ALTER TABLE unprocessed RENAME TO unprocessed_old;

      CREATE TABLE unprocessed(
        id STRING PRIMARY KEY ASC,
        timestamp INTEGER,
        version INTEGER,
        attempts INTEGER,
        envelope TEXT,
        decrypted TEXT,
        source TEXT,
        sourceDevice TEXT,
        serverTimestamp INTEGER,
        sourceUuid STRING
      );

      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );

      INSERT OR REPLACE INTO unprocessed
        (id, timestamp, version, attempts, envelope, decrypted, source,
         sourceDevice, serverTimestamp, sourceUuid)
      SELECT
        id, timestamp, version, attempts, envelope, decrypted, source,
         sourceDevice, serverTimestamp, sourceUuid
      FROM unprocessed_old;

      DROP TABLE unprocessed_old;
    `);
    db.pragma("user_version = 31");
  })();
  logger.info("updateToSchemaVersion31: success!");
}
function updateToSchemaVersion32(currentVersion, db, logger) {
  if (currentVersion >= 32) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      ADD COLUMN serverGuid STRING NULL;

      ALTER TABLE unprocessed
      ADD COLUMN serverGuid STRING NULL;
    `);
    db.pragma("user_version = 32");
  })();
  logger.info("updateToSchemaVersion32: success!");
}
function updateToSchemaVersion33(currentVersion, db, logger) {
  if (currentVersion >= 33) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- These indexes should exist, but we add "IF EXISTS" for safety.
      DROP INDEX IF EXISTS messages_expires_at;
      DROP INDEX IF EXISTS messages_without_timer;

      ALTER TABLE messages
      ADD COLUMN
      expiresAt INT
      GENERATED ALWAYS
      AS (expirationStartTimestamp + (expireTimer * 1000));

      CREATE INDEX message_expires_at ON messages (
        expiresAt
      );

      CREATE INDEX outgoing_messages_without_expiration_start_timestamp ON messages (
        expireTimer, expirationStartTimestamp, type
      )
      WHERE expireTimer IS NOT NULL AND expirationStartTimestamp IS NULL;
    `);
    db.pragma("user_version = 33");
  })();
  logger.info("updateToSchemaVersion33: success!");
}
function updateToSchemaVersion34(currentVersion, db, logger) {
  if (currentVersion >= 34) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- This index should exist, but we add "IF EXISTS" for safety.
      DROP INDEX IF EXISTS outgoing_messages_without_expiration_start_timestamp;

      CREATE INDEX messages_unexpectedly_missing_expiration_start_timestamp ON messages (
        expireTimer, expirationStartTimestamp, type
      )
      WHERE expireTimer IS NOT NULL AND expirationStartTimestamp IS NULL;
    `);
    db.pragma("user_version = 34");
  })();
  logger.info("updateToSchemaVersion34: success!");
}
function updateToSchemaVersion35(currentVersion, db, logger) {
  if (currentVersion >= 35) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE INDEX expiring_message_by_conversation_and_received_at
      ON messages
      (
        expirationStartTimestamp,
        expireTimer,
        conversationId,
        received_at
      );
    `);
    db.pragma("user_version = 35");
  })();
  logger.info("updateToSchemaVersion35: success!");
}
function updateToSchemaVersion36(currentVersion, db, logger) {
  if (currentVersion >= 36) {
    return;
  }
  db.pragma("user_version = 36");
  logger.info("updateToSchemaVersion36: success!");
}
function updateToSchemaVersion37(currentVersion, db, logger) {
  if (currentVersion >= 37) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- Create send log primary table

      CREATE TABLE sendLogPayloads(
        id INTEGER PRIMARY KEY ASC,

        timestamp INTEGER NOT NULL,
        contentHint INTEGER NOT NULL,
        proto BLOB NOT NULL
      );

      CREATE INDEX sendLogPayloadsByTimestamp ON sendLogPayloads (timestamp);

      -- Create send log recipients table with foreign key relationship to payloads

      CREATE TABLE sendLogRecipients(
        payloadId INTEGER NOT NULL,

        recipientUuid STRING NOT NULL,
        deviceId INTEGER NOT NULL,

        PRIMARY KEY (payloadId, recipientUuid, deviceId),

        CONSTRAINT sendLogRecipientsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );

      CREATE INDEX sendLogRecipientsByRecipient
        ON sendLogRecipients (recipientUuid, deviceId);

      -- Create send log messages table with foreign key relationship to payloads

      CREATE TABLE sendLogMessageIds(
        payloadId INTEGER NOT NULL,

        messageId STRING NOT NULL,

        PRIMARY KEY (payloadId, messageId),

        CONSTRAINT sendLogMessageIdsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );

      CREATE INDEX sendLogMessageIdsByMessage
        ON sendLogMessageIds (messageId);

      -- Recreate messages table delete trigger with send log support

      DROP TRIGGER messages_on_delete;

      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        DELETE FROM sendLogPayloads WHERE id IN (
          SELECT payloadId FROM sendLogMessageIds
          WHERE messageId = old.id
        );
      END;

      --- Add messageId column to reactions table to properly track proto associations

      ALTER TABLE reactions ADD column messageId STRING;
    `);
    db.pragma("user_version = 37");
  })();
  logger.info("updateToSchemaVersion37: success!");
}
function updateToSchemaVersion38(currentVersion, db, logger) {
  if (currentVersion >= 38) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX IF EXISTS messages_duplicate_check;

      ALTER TABLE messages
        RENAME COLUMN sourceDevice TO deprecatedSourceDevice;
      ALTER TABLE messages
        ADD COLUMN sourceDevice INTEGER;

      UPDATE messages
      SET
        sourceDevice = CAST(deprecatedSourceDevice AS INTEGER),
        deprecatedSourceDevice = NULL;

      ALTER TABLE unprocessed
        RENAME COLUMN sourceDevice TO deprecatedSourceDevice;
      ALTER TABLE unprocessed
        ADD COLUMN sourceDevice INTEGER;

      UPDATE unprocessed
      SET
        sourceDevice = CAST(deprecatedSourceDevice AS INTEGER),
        deprecatedSourceDevice = NULL;
    `);
    db.pragma("user_version = 38");
  })();
  logger.info("updateToSchemaVersion38: success!");
}
function updateToSchemaVersion39(currentVersion, db, logger) {
  if (currentVersion >= 39) {
    return;
  }
  db.transaction(() => {
    db.exec("ALTER TABLE messages RENAME COLUMN unread TO readStatus;");
    db.pragma("user_version = 39");
  })();
  logger.info("updateToSchemaVersion39: success!");
}
function updateToSchemaVersion40(currentVersion, db, logger) {
  if (currentVersion >= 40) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE groupCallRings(
        ringId INTEGER PRIMARY KEY,
        isActive INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
      );
      `);
    db.pragma("user_version = 40");
  })();
  logger.info("updateToSchemaVersion40: success!");
}
const SCHEMA_VERSIONS = [
  updateToSchemaVersion1,
  updateToSchemaVersion2,
  updateToSchemaVersion3,
  updateToSchemaVersion4,
  (_v, _i, _l) => void 0,
  updateToSchemaVersion6,
  updateToSchemaVersion7,
  updateToSchemaVersion8,
  updateToSchemaVersion9,
  updateToSchemaVersion10,
  updateToSchemaVersion11,
  updateToSchemaVersion12,
  updateToSchemaVersion13,
  updateToSchemaVersion14,
  updateToSchemaVersion15,
  updateToSchemaVersion16,
  updateToSchemaVersion17,
  updateToSchemaVersion18,
  updateToSchemaVersion19,
  updateToSchemaVersion20,
  updateToSchemaVersion21,
  updateToSchemaVersion22,
  updateToSchemaVersion23,
  updateToSchemaVersion24,
  updateToSchemaVersion25,
  updateToSchemaVersion26,
  updateToSchemaVersion27,
  updateToSchemaVersion28,
  updateToSchemaVersion29,
  updateToSchemaVersion30,
  updateToSchemaVersion31,
  updateToSchemaVersion32,
  updateToSchemaVersion33,
  updateToSchemaVersion34,
  updateToSchemaVersion35,
  updateToSchemaVersion36,
  updateToSchemaVersion37,
  updateToSchemaVersion38,
  updateToSchemaVersion39,
  updateToSchemaVersion40,
  import_uuid_keys.default,
  import_stale_reactions.default,
  import_gv2_uuid.default,
  import_badges.default,
  import_stories.default,
  import_optimize_stories.default,
  import_further_optimize.default,
  import_fix_user_initiated_index.default,
  import_fix_preview_index.default,
  import_fix_messages_unread_index.default,
  import_centralize_conversation_jobs.default,
  import_optimize_stories2.default,
  import_gv2_banned_members.default,
  import_unprocessed_received_at_counter.default,
  import_report_message_aci.default,
  import_add_unseen_to_message.default,
  import_rm_message_history_unsynced.default,
  import_update_unread.default,
  import_unprocessed_received_at_counter_index.default,
  import_update_expiring_index.default,
  import_distribution_list_storage.default,
  import_add_urgent_to_send_log.default,
  import_add_urgent_to_unprocessed.default,
  import_uuid_column_for_pre_keys.default,
  import_add_storage_id_to_stickers.default
];
function updateSchema(db, logger) {
  const sqliteVersion = (0, import_util.getSQLiteVersion)(db);
  const sqlcipherVersion = (0, import_util.getSQLCipherVersion)(db);
  const userVersion = (0, import_util.getUserVersion)(db);
  const maxUserVersion = SCHEMA_VERSIONS.length;
  const schemaVersion = (0, import_util.getSchemaVersion)(db);
  logger.info("updateSchema:\n", ` Current user_version: ${userVersion};
`, ` Most recent db schema: ${maxUserVersion};
`, ` SQLite version: ${sqliteVersion};
`, ` SQLCipher version: ${sqlcipherVersion};
`, ` (deprecated) schema_version: ${schemaVersion};
`);
  if (userVersion > maxUserVersion) {
    throw new Error(`SQL: User version is ${userVersion} but the expected maximum version is ${maxUserVersion}. Did you try to start an old version of Signal?`);
  }
  for (let index = 0; index < maxUserVersion; index += 1) {
    const runSchemaUpdate = SCHEMA_VERSIONS[index];
    runSchemaUpdate(userVersion, db, logger);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SCHEMA_VERSIONS,
  updateSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlIH0gZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuaW1wb3J0IHsga2V5QnkgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgdHlwZSB7IExvZ2dlclR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9Mb2dnaW5nJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcbmltcG9ydCB7XG4gIGdldFNjaGVtYVZlcnNpb24sXG4gIGdldFVzZXJWZXJzaW9uLFxuICBnZXRTUUxDaXBoZXJWZXJzaW9uLFxuICBnZXRTUUxpdGVWZXJzaW9uLFxuICBvYmplY3RUb0pTT04sXG4gIGpzb25Ub09iamVjdCxcbn0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgdHlwZSB7IFF1ZXJ5LCBFbXB0eVF1ZXJ5IH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb240MSBmcm9tICcuLzQxLXV1aWQta2V5cyc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDIgZnJvbSAnLi80Mi1zdGFsZS1yZWFjdGlvbnMnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQzIGZyb20gJy4vNDMtZ3YyLXV1aWQnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQ0IGZyb20gJy4vNDQtYmFkZ2VzJztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb240NSBmcm9tICcuLzQ1LXN0b3JpZXMnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQ2IGZyb20gJy4vNDYtb3B0aW1pemUtc3Rvcmllcyc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDcgZnJvbSAnLi80Ny1mdXJ0aGVyLW9wdGltaXplJztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb240OCBmcm9tICcuLzQ4LWZpeC11c2VyLWluaXRpYXRlZC1pbmRleCc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDkgZnJvbSAnLi80OS1maXgtcHJldmlldy1pbmRleCc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTAgZnJvbSAnLi81MC1maXgtbWVzc2FnZXMtdW5yZWFkLWluZGV4JztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb241MSBmcm9tICcuLzUxLWNlbnRyYWxpemUtY29udmVyc2F0aW9uLWpvYnMnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjUyIGZyb20gJy4vNTItb3B0aW1pemUtc3Rvcmllcyc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTMgZnJvbSAnLi81My1ndjItYmFubmVkLW1lbWJlcnMnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjU0IGZyb20gJy4vNTQtdW5wcm9jZXNzZWQtcmVjZWl2ZWQtYXQtY291bnRlcic7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTUgZnJvbSAnLi81NS1yZXBvcnQtbWVzc2FnZS1hY2knO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjU2IGZyb20gJy4vNTYtYWRkLXVuc2Vlbi10by1tZXNzYWdlJztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb241NyBmcm9tICcuLzU3LXJtLW1lc3NhZ2UtaGlzdG9yeS11bnN5bmNlZCc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTggZnJvbSAnLi81OC11cGRhdGUtdW5yZWFkJztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb241OSBmcm9tICcuLzU5LXVucHJvY2Vzc2VkLXJlY2VpdmVkLWF0LWNvdW50ZXItaW5kZXgnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjYwIGZyb20gJy4vNjAtdXBkYXRlLWV4cGlyaW5nLWluZGV4JztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb242MSBmcm9tICcuLzYxLWRpc3RyaWJ1dGlvbi1saXN0LXN0b3JhZ2UnO1xuaW1wb3J0IHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjYyIGZyb20gJy4vNjItYWRkLXVyZ2VudC10by1zZW5kLWxvZyc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjMgZnJvbSAnLi82My1hZGQtdXJnZW50LXRvLXVucHJvY2Vzc2VkJztcbmltcG9ydCB1cGRhdGVUb1NjaGVtYVZlcnNpb242NCBmcm9tICcuLzY0LXV1aWQtY29sdW1uLWZvci1wcmUta2V5cyc7XG5pbXBvcnQgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjUgZnJvbSAnLi82NS1hZGQtc3RvcmFnZS1pZC10by1zdGlja2Vycyc7XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjEoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTogc3RhcnRpbmcuLi4nKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICBDUkVBVEUgVEFCTEUgbWVzc2FnZXMoXG4gICAgICAgIGlkIFNUUklORyBQUklNQVJZIEtFWSBBU0MsXG4gICAgICAgIGpzb24gVEVYVCxcblxuICAgICAgICB1bnJlYWQgSU5URUdFUixcbiAgICAgICAgZXhwaXJlc19hdCBJTlRFR0VSLFxuICAgICAgICBzZW50X2F0IElOVEVHRVIsXG4gICAgICAgIHNjaGVtYVZlcnNpb24gSU5URUdFUixcbiAgICAgICAgY29udmVyc2F0aW9uSWQgU1RSSU5HLFxuICAgICAgICByZWNlaXZlZF9hdCBJTlRFR0VSLFxuICAgICAgICBzb3VyY2UgU1RSSU5HLFxuICAgICAgICBzb3VyY2VEZXZpY2UgU1RSSU5HLFxuICAgICAgICBoYXNBdHRhY2htZW50cyBJTlRFR0VSLFxuICAgICAgICBoYXNGaWxlQXR0YWNobWVudHMgSU5URUdFUixcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cyBJTlRFR0VSXG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3VucmVhZCBPTiBtZXNzYWdlcyAoXG4gICAgICAgIHVucmVhZFxuICAgICAgKTtcbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19leHBpcmVzX2F0IE9OIG1lc3NhZ2VzIChcbiAgICAgICAgZXhwaXJlc19hdFxuICAgICAgKTtcbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19yZWNlaXB0IE9OIG1lc3NhZ2VzIChcbiAgICAgICAgc2VudF9hdFxuICAgICAgKTtcbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19zY2hlbWFWZXJzaW9uIE9OIG1lc3NhZ2VzIChcbiAgICAgICAgc2NoZW1hVmVyc2lvblxuICAgICAgKTtcbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19jb252ZXJzYXRpb24gT04gbWVzc2FnZXMgKFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgcmVjZWl2ZWRfYXRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfZHVwbGljYXRlX2NoZWNrIE9OIG1lc3NhZ2VzIChcbiAgICAgICAgc291cmNlLFxuICAgICAgICBzb3VyY2VEZXZpY2UsXG4gICAgICAgIHNlbnRfYXRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfaGFzQXR0YWNobWVudHMgT04gbWVzc2FnZXMgKFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgaGFzQXR0YWNobWVudHMsXG4gICAgICAgIHJlY2VpdmVkX2F0XG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX2hhc0ZpbGVBdHRhY2htZW50cyBPTiBtZXNzYWdlcyAoXG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICBoYXNGaWxlQXR0YWNobWVudHMsXG4gICAgICAgIHJlY2VpdmVkX2F0XG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX2hhc1Zpc3VhbE1lZGlhQXR0YWNobWVudHMgT04gbWVzc2FnZXMgKFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cyxcbiAgICAgICAgcmVjZWl2ZWRfYXRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgVEFCTEUgdW5wcm9jZXNzZWQoXG4gICAgICAgIGlkIFNUUklORyxcbiAgICAgICAgdGltZXN0YW1wIElOVEVHRVIsXG4gICAgICAgIGpzb24gVEVYVFxuICAgICAgKTtcbiAgICAgIENSRUFURSBJTkRFWCB1bnByb2Nlc3NlZF9pZCBPTiB1bnByb2Nlc3NlZCAoXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIHVucHJvY2Vzc2VkX3RpbWVzdGFtcCBPTiB1bnByb2Nlc3NlZCAoXG4gICAgICAgIHRpbWVzdGFtcFxuICAgICAgKTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMScpO1xuICB9KSgpO1xuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24xOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24yKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAyKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjI6IHN0YXJ0aW5nLi4uJyk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQUxURVIgVEFCTEUgbWVzc2FnZXNcbiAgICAgICAgQUREIENPTFVNTiBleHBpcmVUaW1lciBJTlRFR0VSO1xuXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgICBBREQgQ09MVU1OIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCBJTlRFR0VSO1xuXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgICBBREQgQ09MVU1OIHR5cGUgU1RSSU5HO1xuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfZXhwaXJpbmcgT04gbWVzc2FnZXMgKFxuICAgICAgICBleHBpcmVUaW1lcixcbiAgICAgICAgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wLFxuICAgICAgICBleHBpcmVzX2F0XG4gICAgICApO1xuXG4gICAgICBVUERBVEUgbWVzc2FnZXMgU0VUXG4gICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCA9IGpzb25fZXh0cmFjdChqc29uLCAnJC5leHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAnKSxcbiAgICAgICAgZXhwaXJlVGltZXIgPSBqc29uX2V4dHJhY3QoanNvbiwgJyQuZXhwaXJlVGltZXInKSxcbiAgICAgICAgdHlwZSA9IGpzb25fZXh0cmFjdChqc29uLCAnJC50eXBlJyk7XG4gICAgYCk7XG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAyJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24zKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjM6IHN0YXJ0aW5nLi4uJyk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgRFJPUCBJTkRFWCBtZXNzYWdlc19leHBpcmluZztcbiAgICAgIERST1AgSU5ERVggbWVzc2FnZXNfdW5yZWFkO1xuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfd2l0aG91dF90aW1lciBPTiBtZXNzYWdlcyAoXG4gICAgICAgIGV4cGlyZVRpbWVyLFxuICAgICAgICBleHBpcmVzX2F0LFxuICAgICAgICB0eXBlXG4gICAgICApIFdIRVJFIGV4cGlyZXNfYXQgSVMgTlVMTCBBTkQgZXhwaXJlVGltZXIgSVMgTk9UIE5VTEw7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc191bnJlYWQgT04gbWVzc2FnZXMgKFxuICAgICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgdW5yZWFkXG4gICAgICApIFdIRVJFIHVucmVhZCBJUyBOT1QgTlVMTDtcblxuICAgICAgQU5BTFlaRTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMycpO1xuICB9KSgpO1xuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb240KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSA0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjQ6IHN0YXJ0aW5nLi4uJyk7XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQ1JFQVRFIFRBQkxFIGNvbnZlcnNhdGlvbnMoXG4gICAgICAgIGlkIFNUUklORyBQUklNQVJZIEtFWSBBU0MsXG4gICAgICAgIGpzb24gVEVYVCxcblxuICAgICAgICBhY3RpdmVfYXQgSU5URUdFUixcbiAgICAgICAgdHlwZSBTVFJJTkcsXG4gICAgICAgIG1lbWJlcnMgVEVYVCxcbiAgICAgICAgbmFtZSBURVhULFxuICAgICAgICBwcm9maWxlTmFtZSBURVhUXG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIGNvbnZlcnNhdGlvbnNfYWN0aXZlIE9OIGNvbnZlcnNhdGlvbnMgKFxuICAgICAgICBhY3RpdmVfYXRcbiAgICAgICkgV0hFUkUgYWN0aXZlX2F0IElTIE5PVCBOVUxMO1xuXG4gICAgICBDUkVBVEUgSU5ERVggY29udmVyc2F0aW9uc190eXBlIE9OIGNvbnZlcnNhdGlvbnMgKFxuICAgICAgICB0eXBlXG4gICAgICApIFdIRVJFIHR5cGUgSVMgTk9UIE5VTEw7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDQnKTtcbiAgfSkoKTtcblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uNihcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gNikge1xuICAgIHJldHVybjtcbiAgfVxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNjogc3RhcnRpbmcuLi4nKTtcblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICAtLSBrZXktdmFsdWUsIGlkcyBhcmUgc3RyaW5ncywgb25lIGV4dHJhIGNvbHVtblxuICAgICAgQ1JFQVRFIFRBQkxFIHNlc3Npb25zKFxuICAgICAgICBpZCBTVFJJTkcgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICBudW1iZXIgU1RSSU5HLFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgSU5ERVggc2Vzc2lvbnNfbnVtYmVyIE9OIHNlc3Npb25zIChcbiAgICAgICAgbnVtYmVyXG4gICAgICApIFdIRVJFIG51bWJlciBJUyBOT1QgTlVMTDtcbiAgICAgIC0tIGtleS12YWx1ZSwgaWRzIGFyZSBzdHJpbmdzXG4gICAgICBDUkVBVEUgVEFCTEUgZ3JvdXBzKFxuICAgICAgICBpZCBTVFJJTkcgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgVEFCTEUgaWRlbnRpdHlLZXlzKFxuICAgICAgICBpZCBTVFJJTkcgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgVEFCTEUgaXRlbXMoXG4gICAgICAgIGlkIFNUUklORyBQUklNQVJZIEtFWSBBU0MsXG4gICAgICAgIGpzb24gVEVYVFxuICAgICAgKTtcbiAgICAgIC0tIGtleS12YWx1ZSwgaWRzIGFyZSBpbnRlZ2Vyc1xuICAgICAgQ1JFQVRFIFRBQkxFIHByZUtleXMoXG4gICAgICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgVEFCTEUgc2lnbmVkUHJlS2V5cyhcbiAgICAgICAgaWQgSU5URUdFUiBQUklNQVJZIEtFWSBBU0MsXG4gICAgICAgIGpzb24gVEVYVFxuICAgICAgKTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gNicpO1xuICB9KSgpO1xuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb242OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb243KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSA3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb243OiBzdGFydGluZy4uLicpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIC0tIFNRTGl0ZSBoYXMgYmVlbiBjb2VyY2luZyBvdXIgU1RSSU5HcyBpbnRvIG51bWJlcnMsIHNvIHdlIGZvcmNlIGl0IHdpdGggVEVYVFxuICAgICAgLS0gV2UgY3JlYXRlIGEgbmV3IHRhYmxlIHRoZW4gY29weSB0aGUgZGF0YSBpbnRvIGl0LCBzaW5jZSB3ZSBjYW4ndCBtb2RpZnkgY29sdW1uc1xuICAgICAgRFJPUCBJTkRFWCBzZXNzaW9uc19udW1iZXI7XG4gICAgICBBTFRFUiBUQUJMRSBzZXNzaW9ucyBSRU5BTUUgVE8gc2Vzc2lvbnNfb2xkO1xuXG4gICAgICBDUkVBVEUgVEFCTEUgc2Vzc2lvbnMoXG4gICAgICAgIGlkIFRFWFQgUFJJTUFSWSBLRVksXG4gICAgICAgIG51bWJlciBURVhULFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG4gICAgICBDUkVBVEUgSU5ERVggc2Vzc2lvbnNfbnVtYmVyIE9OIHNlc3Npb25zIChcbiAgICAgICAgbnVtYmVyXG4gICAgICApIFdIRVJFIG51bWJlciBJUyBOT1QgTlVMTDtcbiAgICAgIElOU0VSVCBJTlRPIHNlc3Npb25zKGlkLCBudW1iZXIsIGpzb24pXG4gICAgICAgIFNFTEVDVCBcIitcIiB8fCBpZCwgbnVtYmVyLCBqc29uIEZST00gc2Vzc2lvbnNfb2xkO1xuICAgICAgRFJPUCBUQUJMRSBzZXNzaW9uc19vbGQ7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDcnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjc6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjgoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDgpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjg6IHN0YXJ0aW5nLi4uJyk7XG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIC0tIEZpcnN0LCB3ZSBwdWxsIGEgbmV3IGJvZHkgZmllbGQgb3V0IG9mIHRoZSBtZXNzYWdlIHRhYmxlJ3MganNvbiBibG9iXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgICBBREQgQ09MVU1OIGJvZHkgVEVYVDtcbiAgICAgIFVQREFURSBtZXNzYWdlcyBTRVQgYm9keSA9IGpzb25fZXh0cmFjdChqc29uLCAnJC5ib2R5Jyk7XG5cbiAgICAgIC0tIFRoZW4gd2UgY3JlYXRlIG91ciBmdWxsLXRleHQgc2VhcmNoIHRhYmxlIGFuZCBwb3B1bGF0ZSBpdFxuICAgICAgQ1JFQVRFIFZJUlRVQUwgVEFCTEUgbWVzc2FnZXNfZnRzXG4gICAgICAgIFVTSU5HIGZ0czUoaWQgVU5JTkRFWEVELCBib2R5KTtcblxuICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNfZnRzKGlkLCBib2R5KVxuICAgICAgICBTRUxFQ1QgaWQsIGJvZHkgRlJPTSBtZXNzYWdlcztcblxuICAgICAgLS0gVGhlbiB3ZSBzZXQgdXAgdHJpZ2dlcnMgdG8ga2VlcCB0aGUgZnVsbC10ZXh0IHNlYXJjaCB0YWJsZSB1cCB0byBkYXRlXG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl9pbnNlcnQgQUZURVIgSU5TRVJUIE9OIG1lc3NhZ2VzIEJFR0lOXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0cyAoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYm9keVxuICAgICAgICApIFZBTFVFUyAoXG4gICAgICAgICAgbmV3LmlkLFxuICAgICAgICAgIG5ldy5ib2R5XG4gICAgICAgICk7XG4gICAgICBFTkQ7XG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl9kZWxldGUgQUZURVIgREVMRVRFIE9OIG1lc3NhZ2VzIEJFR0lOXG4gICAgICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzX2Z0cyBXSEVSRSBpZCA9IG9sZC5pZDtcbiAgICAgIEVORDtcbiAgICAgIENSRUFURSBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZSBBRlRFUiBVUERBVEUgT04gbWVzc2FnZXMgQkVHSU5cbiAgICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzIFdIRVJFIGlkID0gb2xkLmlkO1xuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHMoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYm9keVxuICAgICAgICApIFZBTFVFUyAoXG4gICAgICAgICAgbmV3LmlkLFxuICAgICAgICAgIG5ldy5ib2R5XG4gICAgICAgICk7XG4gICAgICBFTkQ7XG4gICAgYCk7XG5cbiAgICAvLyBGb3IgZm9ybWF0dGluZyBzZWFyY2ggcmVzdWx0czpcbiAgICAvLyAgIGh0dHBzOi8vc3FsaXRlLm9yZy9mdHM1Lmh0bWwjdGhlX2hpZ2hsaWdodF9mdW5jdGlvblxuICAgIC8vICAgaHR0cHM6Ly9zcWxpdGUub3JnL2Z0czUuaHRtbCN0aGVfc25pcHBldF9mdW5jdGlvblxuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSA4Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb244OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb245KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSA5KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb245OiBzdGFydGluZy4uLicpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIENSRUFURSBUQUJMRSBhdHRhY2htZW50X2Rvd25sb2FkcyhcbiAgICAgICAgaWQgU1RSSU5HIHByaW1hcnkga2V5LFxuICAgICAgICB0aW1lc3RhbXAgSU5URUdFUixcbiAgICAgICAgcGVuZGluZyBJTlRFR0VSLFxuICAgICAgICBqc29uIFRFWFRcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBhdHRhY2htZW50X2Rvd25sb2Fkc190aW1lc3RhbXBcbiAgICAgICAgT04gYXR0YWNobWVudF9kb3dubG9hZHMgKFxuICAgICAgICAgIHRpbWVzdGFtcFxuICAgICAgKSBXSEVSRSBwZW5kaW5nID0gMDtcbiAgICAgIENSRUFURSBJTkRFWCBhdHRhY2htZW50X2Rvd25sb2Fkc19wZW5kaW5nXG4gICAgICAgIE9OIGF0dGFjaG1lbnRfZG93bmxvYWRzIChcbiAgICAgICAgICBwZW5kaW5nXG4gICAgICApIFdIRVJFIHBlbmRpbmcgIT0gMDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gOScpO1xuICB9KSgpO1xuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb245OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xMChcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjEwOiBzdGFydGluZy4uLicpO1xuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICBEUk9QIElOREVYIHVucHJvY2Vzc2VkX2lkO1xuICAgICAgRFJPUCBJTkRFWCB1bnByb2Nlc3NlZF90aW1lc3RhbXA7XG4gICAgICBBTFRFUiBUQUJMRSB1bnByb2Nlc3NlZCBSRU5BTUUgVE8gdW5wcm9jZXNzZWRfb2xkO1xuXG4gICAgICBDUkVBVEUgVEFCTEUgdW5wcm9jZXNzZWQoXG4gICAgICAgIGlkIFNUUklORyxcbiAgICAgICAgdGltZXN0YW1wIElOVEVHRVIsXG4gICAgICAgIHZlcnNpb24gSU5URUdFUixcbiAgICAgICAgYXR0ZW1wdHMgSU5URUdFUixcbiAgICAgICAgZW52ZWxvcGUgVEVYVCxcbiAgICAgICAgZGVjcnlwdGVkIFRFWFQsXG4gICAgICAgIHNvdXJjZSBURVhULFxuICAgICAgICBzb3VyY2VEZXZpY2UgVEVYVCxcbiAgICAgICAgc2VydmVyVGltZXN0YW1wIElOVEVHRVJcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCB1bnByb2Nlc3NlZF9pZCBPTiB1bnByb2Nlc3NlZCAoXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgQ1JFQVRFIElOREVYIHVucHJvY2Vzc2VkX3RpbWVzdGFtcCBPTiB1bnByb2Nlc3NlZCAoXG4gICAgICAgIHRpbWVzdGFtcFxuICAgICAgKTtcblxuICAgICAgSU5TRVJUIElOVE8gdW5wcm9jZXNzZWQgKFxuICAgICAgICBpZCxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBhdHRlbXB0cyxcbiAgICAgICAgZW52ZWxvcGUsXG4gICAgICAgIGRlY3J5cHRlZCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICBzb3VyY2VEZXZpY2UsXG4gICAgICAgIHNlcnZlclRpbWVzdGFtcFxuICAgICAgKSBTRUxFQ1RcbiAgICAgICAgaWQsXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAganNvbl9leHRyYWN0KGpzb24sICckLnZlcnNpb24nKSxcbiAgICAgICAganNvbl9leHRyYWN0KGpzb24sICckLmF0dGVtcHRzJyksXG4gICAgICAgIGpzb25fZXh0cmFjdChqc29uLCAnJC5lbnZlbG9wZScpLFxuICAgICAgICBqc29uX2V4dHJhY3QoanNvbiwgJyQuZGVjcnlwdGVkJyksXG4gICAgICAgIGpzb25fZXh0cmFjdChqc29uLCAnJC5zb3VyY2UnKSxcbiAgICAgICAganNvbl9leHRyYWN0KGpzb24sICckLnNvdXJjZURldmljZScpLFxuICAgICAgICBqc29uX2V4dHJhY3QoanNvbiwgJyQuc2VydmVyVGltZXN0YW1wJylcbiAgICAgIEZST00gdW5wcm9jZXNzZWRfb2xkO1xuXG4gICAgICBEUk9QIFRBQkxFIHVucHJvY2Vzc2VkX29sZDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTAnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjEwOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xMShcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjExOiBzdGFydGluZy4uLicpO1xuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIERST1AgVEFCTEUgZ3JvdXBzO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAxMScpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTE6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjEyKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAxMikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24xMjogc3RhcnRpbmcuLi4nKTtcbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQ1JFQVRFIFRBQkxFIHN0aWNrZXJfcGFja3MoXG4gICAgICAgIGlkIFRFWFQgUFJJTUFSWSBLRVksXG4gICAgICAgIGtleSBURVhUIE5PVCBOVUxMLFxuXG4gICAgICAgIGF1dGhvciBTVFJJTkcsXG4gICAgICAgIGNvdmVyU3RpY2tlcklkIElOVEVHRVIsXG4gICAgICAgIGNyZWF0ZWRBdCBJTlRFR0VSLFxuICAgICAgICBkb3dubG9hZEF0dGVtcHRzIElOVEVHRVIsXG4gICAgICAgIGluc3RhbGxlZEF0IElOVEVHRVIsXG4gICAgICAgIGxhc3RVc2VkIElOVEVHRVIsXG4gICAgICAgIHN0YXR1cyBTVFJJTkcsXG4gICAgICAgIHN0aWNrZXJDb3VudCBJTlRFR0VSLFxuICAgICAgICB0aXRsZSBTVFJJTkdcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBUQUJMRSBzdGlja2VycyhcbiAgICAgICAgaWQgSU5URUdFUiBOT1QgTlVMTCxcbiAgICAgICAgcGFja0lkIFRFWFQgTk9UIE5VTEwsXG5cbiAgICAgICAgZW1vamkgU1RSSU5HLFxuICAgICAgICBoZWlnaHQgSU5URUdFUixcbiAgICAgICAgaXNDb3Zlck9ubHkgSU5URUdFUixcbiAgICAgICAgbGFzdFVzZWQgSU5URUdFUixcbiAgICAgICAgcGF0aCBTVFJJTkcsXG4gICAgICAgIHdpZHRoIElOVEVHRVIsXG5cbiAgICAgICAgUFJJTUFSWSBLRVkgKGlkLCBwYWNrSWQpLFxuICAgICAgICBDT05TVFJBSU5UIHN0aWNrZXJzX2ZrXG4gICAgICAgICAgRk9SRUlHTiBLRVkgKHBhY2tJZClcbiAgICAgICAgICBSRUZFUkVOQ0VTIHN0aWNrZXJfcGFja3MoaWQpXG4gICAgICAgICAgT04gREVMRVRFIENBU0NBREVcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBzdGlja2Vyc19yZWNlbnRzXG4gICAgICAgIE9OIHN0aWNrZXJzIChcbiAgICAgICAgICBsYXN0VXNlZFxuICAgICAgKSBXSEVSRSBsYXN0VXNlZCBJUyBOT1QgTlVMTDtcblxuICAgICAgQ1JFQVRFIFRBQkxFIHN0aWNrZXJfcmVmZXJlbmNlcyhcbiAgICAgICAgbWVzc2FnZUlkIFNUUklORyxcbiAgICAgICAgcGFja0lkIFRFWFQsXG4gICAgICAgIENPTlNUUkFJTlQgc3RpY2tlcl9yZWZlcmVuY2VzX2ZrXG4gICAgICAgICAgRk9SRUlHTiBLRVkocGFja0lkKVxuICAgICAgICAgIFJFRkVSRU5DRVMgc3RpY2tlcl9wYWNrcyhpZClcbiAgICAgICAgICBPTiBERUxFVEUgQ0FTQ0FERVxuICAgICAgKTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTInKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjEyOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xMyhcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTM6IHN0YXJ0aW5nLi4uJyk7XG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIEFMVEVSIFRBQkxFIHN0aWNrZXJfcGFja3MgQUREIENPTFVNTiBhdHRlbXB0ZWRTdGF0dXMgU1RSSU5HO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAxMycpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTM6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjE0KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAxNCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24xNDogc3RhcnRpbmcuLi4nKTtcbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQ1JFQVRFIFRBQkxFIGVtb2ppcyhcbiAgICAgICAgc2hvcnROYW1lIFNUUklORyBQUklNQVJZIEtFWSxcbiAgICAgICAgbGFzdFVzYWdlIElOVEVHRVJcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBlbW9qaXNfbGFzdFVzYWdlXG4gICAgICAgIE9OIGVtb2ppcyAoXG4gICAgICAgICAgbGFzdFVzYWdlXG4gICAgICApO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAxNCcpO1xuICB9KSgpO1xuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24xNDogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMTUoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDE1KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE1OiBzdGFydGluZy4uLicpO1xuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICAtLSBTUUxpdGUgaGFzIGFnYWluIGNvZXJjZWQgb3VyIFNUUklOR3MgaW50byBudW1iZXJzLCBzbyB3ZSBmb3JjZSBpdCB3aXRoIFRFWFRcbiAgICAgIC0tIFdlIGNyZWF0ZSBhIG5ldyB0YWJsZSB0aGVuIGNvcHkgdGhlIGRhdGEgaW50byBpdCwgc2luY2Ugd2UgY2FuJ3QgbW9kaWZ5IGNvbHVtbnNcblxuICAgICAgRFJPUCBJTkRFWCBlbW9qaXNfbGFzdFVzYWdlO1xuICAgICAgQUxURVIgVEFCTEUgZW1vamlzIFJFTkFNRSBUTyBlbW9qaXNfb2xkO1xuXG4gICAgICBDUkVBVEUgVEFCTEUgZW1vamlzKFxuICAgICAgICBzaG9ydE5hbWUgVEVYVCBQUklNQVJZIEtFWSxcbiAgICAgICAgbGFzdFVzYWdlIElOVEVHRVJcbiAgICAgICk7XG4gICAgICBDUkVBVEUgSU5ERVggZW1vamlzX2xhc3RVc2FnZVxuICAgICAgICBPTiBlbW9qaXMgKFxuICAgICAgICAgIGxhc3RVc2FnZVxuICAgICAgKTtcblxuICAgICAgREVMRVRFIEZST00gZW1vamlzIFdIRVJFIHNob3J0TmFtZSA9IDE7XG4gICAgICBJTlNFUlQgSU5UTyBlbW9qaXMoc2hvcnROYW1lLCBsYXN0VXNhZ2UpXG4gICAgICAgIFNFTEVDVCBzaG9ydE5hbWUsIGxhc3RVc2FnZSBGUk9NIGVtb2ppc19vbGQ7XG5cbiAgICAgIERST1AgVEFCTEUgZW1vamlzX29sZDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTUnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE1OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xNihcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTY6IHN0YXJ0aW5nLi4uJyk7XG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIEFMVEVSIFRBQkxFIG1lc3NhZ2VzXG4gICAgICBBREQgQ09MVU1OIG1lc3NhZ2VUaW1lciBJTlRFR0VSO1xuICAgICAgQUxURVIgVEFCTEUgbWVzc2FnZXNcbiAgICAgIEFERCBDT0xVTU4gbWVzc2FnZVRpbWVyU3RhcnQgSU5URUdFUjtcbiAgICAgIEFMVEVSIFRBQkxFIG1lc3NhZ2VzXG4gICAgICBBREQgQ09MVU1OIG1lc3NhZ2VUaW1lckV4cGlyZXNBdCBJTlRFR0VSO1xuICAgICAgQUxURVIgVEFCTEUgbWVzc2FnZXNcbiAgICAgIEFERCBDT0xVTU4gaXNFcmFzZWQgSU5URUdFUjtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX21lc3NhZ2VfdGltZXIgT04gbWVzc2FnZXMgKFxuICAgICAgICBtZXNzYWdlVGltZXIsXG4gICAgICAgIG1lc3NhZ2VUaW1lclN0YXJ0LFxuICAgICAgICBtZXNzYWdlVGltZXJFeHBpcmVzQXQsXG4gICAgICAgIGlzRXJhc2VkXG4gICAgICApIFdIRVJFIG1lc3NhZ2VUaW1lciBJUyBOT1QgTlVMTDtcblxuICAgICAgLS0gVXBkYXRpbmcgZnVsbC10ZXh0IHRyaWdnZXJzIHRvIGF2b2lkIGFueXRoaW5nIHdpdGggYSBtZXNzYWdlVGltZXIgc2V0XG5cbiAgICAgIERST1AgVFJJR0dFUiBtZXNzYWdlc19vbl9pbnNlcnQ7XG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25fZGVsZXRlO1xuICAgICAgRFJPUCBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZTtcblxuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0IEFGVEVSIElOU0VSVCBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcubWVzc2FnZVRpbWVyIElTIE5VTExcbiAgICAgIEJFR0lOXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0cyAoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYm9keVxuICAgICAgICApIFZBTFVFUyAoXG4gICAgICAgICAgbmV3LmlkLFxuICAgICAgICAgIG5ldy5ib2R5XG4gICAgICAgICk7XG4gICAgICBFTkQ7XG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl9kZWxldGUgQUZURVIgREVMRVRFIE9OIG1lc3NhZ2VzIEJFR0lOXG4gICAgICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzX2Z0cyBXSEVSRSBpZCA9IG9sZC5pZDtcbiAgICAgIEVORDtcbiAgICAgIENSRUFURSBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZSBBRlRFUiBVUERBVEUgT04gbWVzc2FnZXNcbiAgICAgIFdIRU4gbmV3Lm1lc3NhZ2VUaW1lciBJUyBOVUxMXG4gICAgICBCRUdJTlxuICAgICAgICBERUxFVEUgRlJPTSBtZXNzYWdlc19mdHMgV0hFUkUgaWQgPSBvbGQuaWQ7XG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0cyhcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBib2R5XG4gICAgICAgICkgVkFMVUVTIChcbiAgICAgICAgICBuZXcuaWQsXG4gICAgICAgICAgbmV3LmJvZHlcbiAgICAgICAgKTtcbiAgICAgIEVORDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTYnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE2OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xNyhcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTc6IHN0YXJ0aW5nLi4uJyk7XG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgZGIuZXhlYyhgXG4gICAgICAgIEFMVEVSIFRBQkxFIG1lc3NhZ2VzXG4gICAgICAgIEFERCBDT0xVTU4gaXNWaWV3T25jZSBJTlRFR0VSO1xuXG4gICAgICAgIERST1AgSU5ERVggbWVzc2FnZXNfbWVzc2FnZV90aW1lcjtcbiAgICAgIGApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE3OiBNZXNzYWdlIHRhYmxlIGFscmVhZHkgaGFkIGlzVmlld09uY2UgY29sdW1uJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZGIuZXhlYygnRFJPUCBJTkRFWCBtZXNzYWdlc192aWV3X29uY2U7Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTc6IEluZGV4IG1lc3NhZ2VzX3ZpZXdfb25jZSBkaWQgbm90IGFscmVhZHkgZXhpc3QnXG4gICAgICApO1xuICAgIH1cblxuICAgIGRiLmV4ZWMoYFxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3ZpZXdfb25jZSBPTiBtZXNzYWdlcyAoXG4gICAgICAgIGlzRXJhc2VkXG4gICAgICApIFdIRVJFIGlzVmlld09uY2UgPSAxO1xuXG4gICAgICAtLSBVcGRhdGluZyBmdWxsLXRleHQgdHJpZ2dlcnMgdG8gYXZvaWQgYW55dGhpbmcgd2l0aCBpc1ZpZXdPbmNlID0gMVxuXG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0O1xuICAgICAgRFJPUCBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZTtcblxuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0IEFGVEVSIElOU0VSVCBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcuaXNWaWV3T25jZSAhPSAxXG4gICAgICBCRUdJTlxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHMgKFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIGJvZHlcbiAgICAgICAgKSBWQUxVRVMgKFxuICAgICAgICAgIG5ldy5pZCxcbiAgICAgICAgICBuZXcuYm9keVxuICAgICAgICApO1xuICAgICAgRU5EO1xuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25fdXBkYXRlIEFGVEVSIFVQREFURSBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcuaXNWaWV3T25jZSAhPSAxXG4gICAgICBCRUdJTlxuICAgICAgICBERUxFVEUgRlJPTSBtZXNzYWdlc19mdHMgV0hFUkUgaWQgPSBvbGQuaWQ7XG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0cyhcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBib2R5XG4gICAgICAgICkgVkFMVUVTIChcbiAgICAgICAgICBuZXcuaWQsXG4gICAgICAgICAgbmV3LmJvZHlcbiAgICAgICAgKTtcbiAgICAgIEVORDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTcnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE3OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24xOChcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMTgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTg6IHN0YXJ0aW5nLi4uJyk7XG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIC0tIERlbGV0ZSBhbmQgcmVidWlsZCBmdWxsLXRleHQgc2VhcmNoIGluZGV4IHRvIGNhcHR1cmUgZXZlcnl0aGluZ1xuXG4gICAgICBERUxFVEUgRlJPTSBtZXNzYWdlc19mdHM7XG4gICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHMobWVzc2FnZXNfZnRzKSBWQUxVRVMoJ3JlYnVpbGQnKTtcblxuICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNfZnRzKGlkLCBib2R5KVxuICAgICAgU0VMRUNUIGlkLCBib2R5IEZST00gbWVzc2FnZXMgV0hFUkUgaXNWaWV3T25jZSBJUyBOVUxMIE9SIGlzVmlld09uY2UgIT0gMTtcblxuICAgICAgLS0gRml4aW5nIGZ1bGwtdGV4dCB0cmlnZ2Vyc1xuXG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0O1xuICAgICAgRFJPUCBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZTtcblxuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0IEFGVEVSIElOU0VSVCBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcuaXNWaWV3T25jZSBJUyBOVUxMIE9SIG5ldy5pc1ZpZXdPbmNlICE9IDFcbiAgICAgIEJFR0lOXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0cyAoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYm9keVxuICAgICAgICApIFZBTFVFUyAoXG4gICAgICAgICAgbmV3LmlkLFxuICAgICAgICAgIG5ldy5ib2R5XG4gICAgICAgICk7XG4gICAgICBFTkQ7XG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl91cGRhdGUgQUZURVIgVVBEQVRFIE9OIG1lc3NhZ2VzXG4gICAgICBXSEVOIG5ldy5pc1ZpZXdPbmNlIElTIE5VTEwgT1IgbmV3LmlzVmlld09uY2UgIT0gMVxuICAgICAgQkVHSU5cbiAgICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzIFdIRVJFIGlkID0gb2xkLmlkO1xuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHMoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYm9keVxuICAgICAgICApIFZBTFVFUyAoXG4gICAgICAgICAgbmV3LmlkLFxuICAgICAgICAgIG5ldy5ib2R5XG4gICAgICAgICk7XG4gICAgICBFTkQ7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDE4Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24xODogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMTkoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDE5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjE5OiBzdGFydGluZy4uLicpO1xuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICBBTFRFUiBUQUJMRSBjb252ZXJzYXRpb25zXG4gICAgICBBREQgQ09MVU1OIHByb2ZpbGVGYW1pbHlOYW1lIFRFWFQ7XG4gICAgICBBTFRFUiBUQUJMRSBjb252ZXJzYXRpb25zXG4gICAgICBBREQgQ09MVU1OIHByb2ZpbGVGdWxsTmFtZSBURVhUO1xuXG4gICAgICAtLSBQcmVsb2FkIG5ldyBmaWVsZCB3aXRoIHRoZSBwcm9maWxlTmFtZSB3ZSBhbHJlYWR5IGhhdmVcbiAgICAgIFVQREFURSBjb252ZXJzYXRpb25zIFNFVCBwcm9maWxlRnVsbE5hbWUgPSBwcm9maWxlTmFtZTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMTknKTtcbiAgfSkoKTtcblxuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMTk6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjIwKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAyMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yMDogc3RhcnRpbmcuLi4nKTtcbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIC8vIFRoZSB0cmlnZ2VycyBvbiB0aGUgbWVzc2FnZXMgdGFibGUgc2xvdyBkb3duIHRoaXMgbWlncmF0aW9uXG4gICAgLy8gc2lnbmlmaWNhbnRseSwgc28gd2UgZHJvcCB0aGVtIGFuZCByZWNyZWF0ZSB0aGVtIGxhdGVyLlxuICAgIC8vIERyb3AgdHJpZ2dlcnNcbiAgICBjb25zdCB0cmlnZ2VycyA9IGRiXG4gICAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgICAgJ1NFTEVDVCAqIEZST00gc3FsaXRlX21hc3RlciBXSEVSRSB0eXBlID0gXCJ0cmlnZ2VyXCIgQU5EIHRibF9uYW1lID0gXCJtZXNzYWdlc1wiJ1xuICAgICAgKVxuICAgICAgLmFsbCgpO1xuXG4gICAgZm9yIChjb25zdCB0cmlnZ2VyIG9mIHRyaWdnZXJzKSB7XG4gICAgICBkYi5leGVjKGBEUk9QIFRSSUdHRVIgJHt0cmlnZ2VyLm5hbWV9YCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG5ldyBjb2x1bW5zIGFuZCBpbmRpY2VzXG4gICAgZGIuZXhlYyhgXG4gICAgICBBTFRFUiBUQUJMRSBjb252ZXJzYXRpb25zIEFERCBDT0xVTU4gZTE2NCBURVhUO1xuICAgICAgQUxURVIgVEFCTEUgY29udmVyc2F0aW9ucyBBREQgQ09MVU1OIHV1aWQgVEVYVDtcbiAgICAgIEFMVEVSIFRBQkxFIGNvbnZlcnNhdGlvbnMgQUREIENPTFVNTiBncm91cElkIFRFWFQ7XG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlcyBBREQgQ09MVU1OIHNvdXJjZVV1aWQgVEVYVDtcbiAgICAgIEFMVEVSIFRBQkxFIHNlc3Npb25zIFJFTkFNRSBDT0xVTU4gbnVtYmVyIFRPIGNvbnZlcnNhdGlvbklkO1xuICAgICAgQ1JFQVRFIElOREVYIGNvbnZlcnNhdGlvbnNfZTE2NCBPTiBjb252ZXJzYXRpb25zKGUxNjQpO1xuICAgICAgQ1JFQVRFIElOREVYIGNvbnZlcnNhdGlvbnNfdXVpZCBPTiBjb252ZXJzYXRpb25zKHV1aWQpO1xuICAgICAgQ1JFQVRFIElOREVYIGNvbnZlcnNhdGlvbnNfZ3JvdXBJZCBPTiBjb252ZXJzYXRpb25zKGdyb3VwSWQpO1xuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3NvdXJjZVV1aWQgb24gbWVzc2FnZXMoc291cmNlVXVpZCk7XG5cbiAgICAgIC0tIE1pZ3JhdGUgZXhpc3RpbmcgSURzXG4gICAgICBVUERBVEUgY29udmVyc2F0aW9ucyBTRVQgZTE2NCA9ICcrJyB8fCBpZCBXSEVSRSB0eXBlID0gJ3ByaXZhdGUnO1xuICAgICAgVVBEQVRFIGNvbnZlcnNhdGlvbnMgU0VUIGdyb3VwSWQgPSBpZCBXSEVSRSB0eXBlID0gJ2dyb3VwJztcbiAgICBgKTtcblxuICAgIC8vIERyb3AgaW52YWxpZCBncm91cHMgYW5kIGFueSBhc3NvY2lhdGVkIG1lc3NhZ2VzXG4gICAgY29uc3QgbWF5YmVJbnZhbGlkR3JvdXBzID0gZGJcbiAgICAgIC5wcmVwYXJlPEVtcHR5UXVlcnk+KFxuICAgICAgICBcIlNFTEVDVCAqIEZST00gY29udmVyc2F0aW9ucyBXSEVSRSB0eXBlID0gJ2dyb3VwJyBBTkQgbWVtYmVycyBJUyBOVUxMO1wiXG4gICAgICApXG4gICAgICAuYWxsKCk7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBtYXliZUludmFsaWRHcm91cHMpIHtcbiAgICAgIGNvbnN0IGpzb246IHsgaWQ6IHN0cmluZzsgbWVtYmVyczogQXJyYXk8dW5rbm93bj4gfSA9IEpTT04ucGFyc2UoXG4gICAgICAgIGdyb3VwLmpzb25cbiAgICAgICk7XG4gICAgICBpZiAoIWpzb24ubWVtYmVycyB8fCAhanNvbi5tZW1iZXJzLmxlbmd0aCkge1xuICAgICAgICBkYi5wcmVwYXJlPFF1ZXJ5PignREVMRVRFIEZST00gY29udmVyc2F0aW9ucyBXSEVSRSBpZCA9ICRpZDsnKS5ydW4oe1xuICAgICAgICAgIGlkOiBqc29uLmlkLFxuICAgICAgICB9KTtcbiAgICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgICAgJ0RFTEVURSBGUk9NIG1lc3NhZ2VzIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJGlkOydcbiAgICAgICAgKS5ydW4oeyBpZDoganNvbi5pZCB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBuZXcgSURzIGFuZCBhbHRlciBkYXRhXG4gICAgY29uc3QgYWxsQ29udmVyc2F0aW9ucyA9IGRiXG4gICAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PignU0VMRUNUICogRlJPTSBjb252ZXJzYXRpb25zOycpXG4gICAgICAuYWxsKCk7XG4gICAgY29uc3QgYWxsQ29udmVyc2F0aW9uc0J5T2xkSWQgPSBrZXlCeShhbGxDb252ZXJzYXRpb25zLCAnaWQnKTtcblxuICAgIGZvciAoY29uc3Qgcm93IG9mIGFsbENvbnZlcnNhdGlvbnMpIHtcbiAgICAgIGNvbnN0IG9sZElkID0gcm93LmlkO1xuICAgICAgY29uc3QgbmV3SWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgIGFsbENvbnZlcnNhdGlvbnNCeU9sZElkW29sZElkXS5pZCA9IG5ld0lkO1xuICAgICAgY29uc3QgcGF0Y2hPYmo6IHsgaWQ6IHN0cmluZzsgZTE2ND86IHN0cmluZzsgZ3JvdXBJZD86IHN0cmluZyB9ID0ge1xuICAgICAgICBpZDogbmV3SWQsXG4gICAgICB9O1xuICAgICAgaWYgKHJvdy50eXBlID09PSAncHJpdmF0ZScpIHtcbiAgICAgICAgcGF0Y2hPYmouZTE2NCA9IGArJHtvbGRJZH1gO1xuICAgICAgfSBlbHNlIGlmIChyb3cudHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICBwYXRjaE9iai5ncm91cElkID0gb2xkSWQ7XG4gICAgICB9XG4gICAgICBjb25zdCBwYXRjaCA9IEpTT04uc3RyaW5naWZ5KHBhdGNoT2JqKTtcblxuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgVVBEQVRFIGNvbnZlcnNhdGlvbnNcbiAgICAgICAgU0VUIGlkID0gJG5ld0lkLCBqc29uID0gSlNPTl9QQVRDSChqc29uLCAkcGF0Y2gpXG4gICAgICAgIFdIRVJFIGlkID0gJG9sZElkXG4gICAgICAgIGBcbiAgICAgICkucnVuKHtcbiAgICAgICAgbmV3SWQsXG4gICAgICAgIG9sZElkLFxuICAgICAgICBwYXRjaCxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWVzc2FnZVBhdGNoID0gSlNPTi5zdHJpbmdpZnkoeyBjb252ZXJzYXRpb25JZDogbmV3SWQgfSk7XG4gICAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBVUERBVEUgbWVzc2FnZXNcbiAgICAgICAgU0VUIGNvbnZlcnNhdGlvbklkID0gJG5ld0lkLCBqc29uID0gSlNPTl9QQVRDSChqc29uLCAkcGF0Y2gpXG4gICAgICAgIFdIRVJFIGNvbnZlcnNhdGlvbklkID0gJG9sZElkXG4gICAgICAgIGBcbiAgICAgICkucnVuKHsgbmV3SWQsIG9sZElkLCBwYXRjaDogbWVzc2FnZVBhdGNoIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VwQ29udmVyc2F0aW9uczogQXJyYXk8e1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIG1lbWJlcnM6IHN0cmluZztcbiAgICAgIGpzb246IHN0cmluZztcbiAgICB9PiA9IGRiXG4gICAgICAucHJlcGFyZTxFbXB0eVF1ZXJ5PihcbiAgICAgICAgYFxuICAgICAgICBTRUxFQ1QgaWQsIG1lbWJlcnMsIGpzb24gRlJPTSBjb252ZXJzYXRpb25zIFdIRVJFIHR5cGUgPSAnZ3JvdXAnO1xuICAgICAgICBgXG4gICAgICApXG4gICAgICAuYWxsKCk7XG5cbiAgICAvLyBVcGRhdGUgZ3JvdXAgY29udmVyc2F0aW9ucywgcG9pbnQgbWVtYmVycyBhdCBuZXcgY29udmVyc2F0aW9uIGlkc1xuICAgIGdyb3VwQ29udmVyc2F0aW9ucy5mb3JFYWNoKGdyb3VwUm93ID0+IHtcbiAgICAgIGNvbnN0IG1lbWJlcnMgPSBncm91cFJvdy5tZW1iZXJzLnNwbGl0KC9cXHM/XFwrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgY29uc3QgbmV3TWVtYmVycyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93ID0gYWxsQ29udmVyc2F0aW9uc0J5T2xkSWRbbV07XG5cbiAgICAgICAgaWYgKG1lbWJlclJvdykge1xuICAgICAgICAgIG5ld01lbWJlcnMucHVzaChtZW1iZXJSb3cuaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFdlIGRpZG4ndCBwcmV2aW91c2x5IGhhdmUgYSBwcml2YXRlIGNvbnZlcnNhdGlvbiBmb3IgdGhpcyBtZW1iZXIsXG4gICAgICAgICAgLy8gd2UgbmVlZCB0byBjcmVhdGUgb25lXG4gICAgICAgICAgY29uc3QgaWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkQ29udmVyc2F0aW9uID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBlMTY0OiBtLFxuICAgICAgICAgICAgdHlwZTogJ3ByaXZhdGUnLFxuICAgICAgICAgICAgdmVyc2lvbjogMixcbiAgICAgICAgICAgIHVucmVhZENvdW50OiAwLFxuICAgICAgICAgICAgdmVyaWZpZWQ6IDAsXG5cbiAgICAgICAgICAgIC8vIE5vdCBkaXJlY3RseSB1c2VkIGJ5IHNhdmVDb252ZXJzYXRpb24sIGJ1dCBhcmUgbmVjZXNzYXJ5XG4gICAgICAgICAgICAvLyBmb3IgY29udmVyc2F0aW9uIG1vZGVsXG4gICAgICAgICAgICBpbmJveF9wb3NpdGlvbjogMCxcbiAgICAgICAgICAgIGlzUGlubmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlRGVsZXRlZEZvckV2ZXJ5b25lOiBmYWxzZSxcbiAgICAgICAgICAgIG1hcmtlZFVucmVhZDogZmFsc2UsXG4gICAgICAgICAgICBtZXNzYWdlQ291bnQ6IDAsXG4gICAgICAgICAgICBzZW50TWVzc2FnZUNvdW50OiAwLFxuICAgICAgICAgICAgcHJvZmlsZVNoYXJpbmc6IGZhbHNlLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBkYi5wcmVwYXJlPFF1ZXJ5PihcbiAgICAgICAgICAgIGBcbiAgICAgICAgICAgIFVQREFURSBjb252ZXJzYXRpb25zXG4gICAgICAgICAgICBTRVRcbiAgICAgICAgICAgICAganNvbiA9ICRqc29uLFxuICAgICAgICAgICAgICBlMTY0ID0gJGUxNjQsXG4gICAgICAgICAgICAgIHR5cGUgPSAkdHlwZSxcbiAgICAgICAgICAgIFdIRVJFXG4gICAgICAgICAgICAgIGlkID0gJGlkO1xuICAgICAgICAgICAgYFxuICAgICAgICAgICkucnVuKHtcbiAgICAgICAgICAgIGlkOiB1cGRhdGVkQ29udmVyc2F0aW9uLmlkLFxuICAgICAgICAgICAganNvbjogb2JqZWN0VG9KU09OKHVwZGF0ZWRDb252ZXJzYXRpb24pLFxuICAgICAgICAgICAgZTE2NDogdXBkYXRlZENvbnZlcnNhdGlvbi5lMTY0LFxuICAgICAgICAgICAgdHlwZTogdXBkYXRlZENvbnZlcnNhdGlvbi50eXBlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbmV3TWVtYmVycy5wdXNoKGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgLi4uanNvblRvT2JqZWN0PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihncm91cFJvdy5qc29uKSxcbiAgICAgICAgbWVtYmVyczogbmV3TWVtYmVycyxcbiAgICAgIH07XG4gICAgICBjb25zdCBuZXdNZW1iZXJzVmFsdWUgPSBuZXdNZW1iZXJzLmpvaW4oJyAnKTtcbiAgICAgIGRiLnByZXBhcmU8UXVlcnk+KFxuICAgICAgICBgXG4gICAgICAgIFVQREFURSBjb252ZXJzYXRpb25zXG4gICAgICAgIFNFVCBtZW1iZXJzID0gJG5ld01lbWJlcnNWYWx1ZSwganNvbiA9ICRuZXdKc29uVmFsdWVcbiAgICAgICAgV0hFUkUgaWQgPSAkaWRcbiAgICAgICAgYFxuICAgICAgKS5ydW4oe1xuICAgICAgICBpZDogZ3JvdXBSb3cuaWQsXG4gICAgICAgIG5ld01lbWJlcnNWYWx1ZSxcbiAgICAgICAgbmV3SnNvblZhbHVlOiBvYmplY3RUb0pTT04oanNvbiksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzZXNzaW9ucyB0byBzdGFibGUgSURzXG4gICAgY29uc3QgYWxsU2Vzc2lvbnMgPSBkYi5wcmVwYXJlPEVtcHR5UXVlcnk+KCdTRUxFQ1QgKiBGUk9NIHNlc3Npb25zOycpLmFsbCgpO1xuICAgIGZvciAoY29uc3Qgc2Vzc2lvbiBvZiBhbGxTZXNzaW9ucykge1xuICAgICAgLy8gTm90IHVzaW5nIHBhdGNoIGhlcmUgc28gd2UgY2FuIGV4cGxpY2l0bHkgZGVsZXRlIGEgcHJvcGVydHkgcmF0aGVyIHRoYW5cbiAgICAgIC8vIGltcGxpY2l0bHkgZGVsZXRlIHZpYSBudWxsXG4gICAgICBjb25zdCBuZXdKc29uID0gSlNPTi5wYXJzZShzZXNzaW9uLmpzb24pO1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gYWxsQ29udmVyc2F0aW9uc0J5T2xkSWRbbmV3SnNvbi5udW1iZXIuc3Vic3RyKDEpXTtcbiAgICAgIGlmIChjb252ZXJzYXRpb24pIHtcbiAgICAgICAgbmV3SnNvbi5jb252ZXJzYXRpb25JZCA9IGNvbnZlcnNhdGlvbi5pZDtcbiAgICAgICAgbmV3SnNvbi5pZCA9IGAke25ld0pzb24uY29udmVyc2F0aW9uSWR9LiR7bmV3SnNvbi5kZXZpY2VJZH1gO1xuICAgICAgfVxuICAgICAgZGVsZXRlIG5ld0pzb24ubnVtYmVyO1xuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgVVBEQVRFIHNlc3Npb25zXG4gICAgICAgIFNFVCBpZCA9ICRuZXdJZCwganNvbiA9ICRuZXdKc29uLCBjb252ZXJzYXRpb25JZCA9ICRuZXdDb252ZXJzYXRpb25JZFxuICAgICAgICBXSEVSRSBpZCA9ICRvbGRJZFxuICAgICAgICBgXG4gICAgICApLnJ1bih7XG4gICAgICAgIG5ld0lkOiBuZXdKc29uLmlkLFxuICAgICAgICBuZXdKc29uOiBvYmplY3RUb0pTT04obmV3SnNvbiksXG4gICAgICAgIG9sZElkOiBzZXNzaW9uLmlkLFxuICAgICAgICBuZXdDb252ZXJzYXRpb25JZDogbmV3SnNvbi5jb252ZXJzYXRpb25JZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBpZGVudGl0eSBrZXlzIHRvIHN0YWJsZSBJRHNcbiAgICBjb25zdCBhbGxJZGVudGl0eUtleXMgPSBkYlxuICAgICAgLnByZXBhcmU8RW1wdHlRdWVyeT4oJ1NFTEVDVCAqIEZST00gaWRlbnRpdHlLZXlzOycpXG4gICAgICAuYWxsKCk7XG4gICAgZm9yIChjb25zdCBpZGVudGl0eUtleSBvZiBhbGxJZGVudGl0eUtleXMpIHtcbiAgICAgIGNvbnN0IG5ld0pzb24gPSBKU09OLnBhcnNlKGlkZW50aXR5S2V5Lmpzb24pO1xuICAgICAgbmV3SnNvbi5pZCA9IGFsbENvbnZlcnNhdGlvbnNCeU9sZElkW25ld0pzb24uaWRdO1xuICAgICAgZGIucHJlcGFyZTxRdWVyeT4oXG4gICAgICAgIGBcbiAgICAgICAgVVBEQVRFIGlkZW50aXR5S2V5c1xuICAgICAgICBTRVQgaWQgPSAkbmV3SWQsIGpzb24gPSAkbmV3SnNvblxuICAgICAgICBXSEVSRSBpZCA9ICRvbGRJZFxuICAgICAgICBgXG4gICAgICApLnJ1bih7XG4gICAgICAgIG5ld0lkOiBuZXdKc29uLmlkLFxuICAgICAgICBuZXdKc29uOiBvYmplY3RUb0pTT04obmV3SnNvbiksXG4gICAgICAgIG9sZElkOiBpZGVudGl0eUtleS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJlY3JlYXRlIHRyaWdnZXJzXG4gICAgZm9yIChjb25zdCB0cmlnZ2VyIG9mIHRyaWdnZXJzKSB7XG4gICAgICBkYi5leGVjKHRyaWdnZXIuc3FsKTtcbiAgICB9XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDIwJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yMDogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjEoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDIxKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgVVBEQVRFIGNvbnZlcnNhdGlvbnNcbiAgICAgIFNFVCBqc29uID0ganNvbl9zZXQoXG4gICAgICAgIGpzb24sXG4gICAgICAgICckLm1lc3NhZ2VDb3VudCcsXG4gICAgICAgIChTRUxFQ1QgY291bnQoKikgRlJPTSBtZXNzYWdlcyBXSEVSRSBtZXNzYWdlcy5jb252ZXJzYXRpb25JZCA9IGNvbnZlcnNhdGlvbnMuaWQpXG4gICAgICApO1xuICAgICAgVVBEQVRFIGNvbnZlcnNhdGlvbnNcbiAgICAgIFNFVCBqc29uID0ganNvbl9zZXQoXG4gICAgICAgIGpzb24sXG4gICAgICAgICckLnNlbnRNZXNzYWdlQ291bnQnLFxuICAgICAgICAoU0VMRUNUIGNvdW50KCopIEZST00gbWVzc2FnZXMgV0hFUkUgbWVzc2FnZXMuY29udmVyc2F0aW9uSWQgPSBjb252ZXJzYXRpb25zLmlkIEFORCBtZXNzYWdlcy50eXBlID0gJ291dGdvaW5nJylcbiAgICAgICk7XG4gICAgYCk7XG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAyMScpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMjE6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjIyKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAyMikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIEFMVEVSIFRBQkxFIHVucHJvY2Vzc2VkXG4gICAgICAgIEFERCBDT0xVTU4gc291cmNlVXVpZCBTVFJJTkc7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDIyJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yMjogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjMoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDIzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgLS0gUmVtb3ZlIHRyaWdnZXJzIHdoaWNoIGtlZXAgZnVsbC10ZXh0IHNlYXJjaCB1cCB0byBkYXRlXG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0O1xuICAgICAgRFJPUCBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZTtcbiAgICAgIERST1AgVFJJR0dFUiBtZXNzYWdlc19vbl9kZWxldGU7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDIzJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yMzogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjQoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDI0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQUxURVIgVEFCTEUgY29udmVyc2F0aW9uc1xuICAgICAgQUREIENPTFVNTiBwcm9maWxlTGFzdEZldGNoZWRBdCBJTlRFR0VSO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAyNCcpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMjQ6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjI1KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAyNSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIEFMVEVSIFRBQkxFIG1lc3NhZ2VzXG4gICAgICBSRU5BTUUgVE8gb2xkX21lc3NhZ2VzXG4gICAgYCk7XG5cbiAgICBjb25zdCBpbmRpY2VzVG9Ecm9wID0gW1xuICAgICAgJ21lc3NhZ2VzX2V4cGlyZXNfYXQnLFxuICAgICAgJ21lc3NhZ2VzX3JlY2VpcHQnLFxuICAgICAgJ21lc3NhZ2VzX3NjaGVtYVZlcnNpb24nLFxuICAgICAgJ21lc3NhZ2VzX2NvbnZlcnNhdGlvbicsXG4gICAgICAnbWVzc2FnZXNfZHVwbGljYXRlX2NoZWNrJyxcbiAgICAgICdtZXNzYWdlc19oYXNBdHRhY2htZW50cycsXG4gICAgICAnbWVzc2FnZXNfaGFzRmlsZUF0dGFjaG1lbnRzJyxcbiAgICAgICdtZXNzYWdlc19oYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzJyxcbiAgICAgICdtZXNzYWdlc193aXRob3V0X3RpbWVyJyxcbiAgICAgICdtZXNzYWdlc191bnJlYWQnLFxuICAgICAgJ21lc3NhZ2VzX3ZpZXdfb25jZScsXG4gICAgICAnbWVzc2FnZXNfc291cmNlVXVpZCcsXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IGluZGV4IG9mIGluZGljZXNUb0Ryb3ApIHtcbiAgICAgIGRiLmV4ZWMoYERST1AgSU5ERVggSUYgRVhJU1RTICR7aW5kZXh9O2ApO1xuICAgIH1cblxuICAgIGRiLmV4ZWMoYFxuICAgICAgLS1cbiAgICAgIC0tIENyZWF0ZSBhIG5ldyB0YWJsZSB3aXRoIGEgZGlmZmVyZW50IHByaW1hcnkga2V5XG4gICAgICAtLVxuXG4gICAgICBDUkVBVEUgVEFCTEUgbWVzc2FnZXMoXG4gICAgICAgIHJvd2lkIElOVEVHRVIgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICBpZCBTVFJJTkcgVU5JUVVFLFxuICAgICAgICBqc29uIFRFWFQsXG4gICAgICAgIHVucmVhZCBJTlRFR0VSLFxuICAgICAgICBleHBpcmVzX2F0IElOVEVHRVIsXG4gICAgICAgIHNlbnRfYXQgSU5URUdFUixcbiAgICAgICAgc2NoZW1hVmVyc2lvbiBJTlRFR0VSLFxuICAgICAgICBjb252ZXJzYXRpb25JZCBTVFJJTkcsXG4gICAgICAgIHJlY2VpdmVkX2F0IElOVEVHRVIsXG4gICAgICAgIHNvdXJjZSBTVFJJTkcsXG4gICAgICAgIHNvdXJjZURldmljZSBTVFJJTkcsXG4gICAgICAgIGhhc0F0dGFjaG1lbnRzIElOVEVHRVIsXG4gICAgICAgIGhhc0ZpbGVBdHRhY2htZW50cyBJTlRFR0VSLFxuICAgICAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzIElOVEVHRVIsXG4gICAgICAgIGV4cGlyZVRpbWVyIElOVEVHRVIsXG4gICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCBJTlRFR0VSLFxuICAgICAgICB0eXBlIFNUUklORyxcbiAgICAgICAgYm9keSBURVhULFxuICAgICAgICBtZXNzYWdlVGltZXIgSU5URUdFUixcbiAgICAgICAgbWVzc2FnZVRpbWVyU3RhcnQgSU5URUdFUixcbiAgICAgICAgbWVzc2FnZVRpbWVyRXhwaXJlc0F0IElOVEVHRVIsXG4gICAgICAgIGlzRXJhc2VkIElOVEVHRVIsXG4gICAgICAgIGlzVmlld09uY2UgSU5URUdFUixcbiAgICAgICAgc291cmNlVXVpZCBURVhUKTtcblxuICAgICAgLS0gQ3JlYXRlIGluZGV4IGluIGxpZXUgb2Ygb2xkIFBSSU1BUlkgS0VZXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfaWQgT04gbWVzc2FnZXMgKGlkIEFTQyk7XG5cbiAgICAgIC0tXG4gICAgICAtLSBSZWNyZWF0ZSBpbmRpY2VzXG4gICAgICAtLVxuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfZXhwaXJlc19hdCBPTiBtZXNzYWdlcyAoZXhwaXJlc19hdCk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19yZWNlaXB0IE9OIG1lc3NhZ2VzIChzZW50X2F0KTtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3NjaGVtYVZlcnNpb24gT04gbWVzc2FnZXMgKHNjaGVtYVZlcnNpb24pO1xuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfY29udmVyc2F0aW9uIE9OIG1lc3NhZ2VzXG4gICAgICAgIChjb252ZXJzYXRpb25JZCwgcmVjZWl2ZWRfYXQpO1xuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfZHVwbGljYXRlX2NoZWNrIE9OIG1lc3NhZ2VzXG4gICAgICAgIChzb3VyY2UsIHNvdXJjZURldmljZSwgc2VudF9hdCk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19oYXNBdHRhY2htZW50cyBPTiBtZXNzYWdlc1xuICAgICAgICAoY29udmVyc2F0aW9uSWQsIGhhc0F0dGFjaG1lbnRzLCByZWNlaXZlZF9hdCk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19oYXNGaWxlQXR0YWNobWVudHMgT04gbWVzc2FnZXNcbiAgICAgICAgKGNvbnZlcnNhdGlvbklkLCBoYXNGaWxlQXR0YWNobWVudHMsIHJlY2VpdmVkX2F0KTtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX2hhc1Zpc3VhbE1lZGlhQXR0YWNobWVudHMgT04gbWVzc2FnZXNcbiAgICAgICAgKGNvbnZlcnNhdGlvbklkLCBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLCByZWNlaXZlZF9hdCk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc193aXRob3V0X3RpbWVyIE9OIG1lc3NhZ2VzXG4gICAgICAgIChleHBpcmVUaW1lciwgZXhwaXJlc19hdCwgdHlwZSlcbiAgICAgICAgV0hFUkUgZXhwaXJlc19hdCBJUyBOVUxMIEFORCBleHBpcmVUaW1lciBJUyBOT1QgTlVMTDtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3VucmVhZCBPTiBtZXNzYWdlc1xuICAgICAgICAoY29udmVyc2F0aW9uSWQsIHVucmVhZCkgV0hFUkUgdW5yZWFkIElTIE5PVCBOVUxMO1xuXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfdmlld19vbmNlIE9OIG1lc3NhZ2VzXG4gICAgICAgIChpc0VyYXNlZCkgV0hFUkUgaXNWaWV3T25jZSA9IDE7XG5cbiAgICAgIENSRUFURSBJTkRFWCBtZXNzYWdlc19zb3VyY2VVdWlkIG9uIG1lc3NhZ2VzKHNvdXJjZVV1aWQpO1xuXG4gICAgICAtLSBOZXcgaW5kZXggZm9yIHNlYXJjaE1lc3NhZ2VzXG4gICAgICBDUkVBVEUgSU5ERVggbWVzc2FnZXNfc2VhcmNoT3JkZXIgb24gbWVzc2FnZXMocmVjZWl2ZWRfYXQsIHNlbnRfYXQpO1xuXG4gICAgICAtLVxuICAgICAgLS0gUmUtY3JlYXRlIG1lc3NhZ2VzX2Z0cyBhbmQgYWRkIHRyaWdnZXJzXG4gICAgICAtLVxuXG4gICAgICBEUk9QIFRBQkxFIG1lc3NhZ2VzX2Z0cztcblxuICAgICAgQ1JFQVRFIFZJUlRVQUwgVEFCTEUgbWVzc2FnZXNfZnRzIFVTSU5HIGZ0czUoYm9keSk7XG5cbiAgICAgIENSRUFURSBUUklHR0VSIG1lc3NhZ2VzX29uX2luc2VydCBBRlRFUiBJTlNFUlQgT04gbWVzc2FnZXNcbiAgICAgIFdIRU4gbmV3LmlzVmlld09uY2UgSVMgTlVMTCBPUiBuZXcuaXNWaWV3T25jZSAhPSAxXG4gICAgICBCRUdJTlxuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHNcbiAgICAgICAgKHJvd2lkLCBib2R5KVxuICAgICAgICBWQUxVRVNcbiAgICAgICAgKG5ldy5yb3dpZCwgbmV3LmJvZHkpO1xuICAgICAgRU5EO1xuXG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl9kZWxldGUgQUZURVIgREVMRVRFIE9OIG1lc3NhZ2VzIEJFR0lOXG4gICAgICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzX2Z0cyBXSEVSRSByb3dpZCA9IG9sZC5yb3dpZDtcbiAgICAgIEVORDtcblxuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25fdXBkYXRlIEFGVEVSIFVQREFURSBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcuaXNWaWV3T25jZSBJUyBOVUxMIE9SIG5ldy5pc1ZpZXdPbmNlICE9IDFcbiAgICAgIEJFR0lOXG4gICAgICAgIERFTEVURSBGUk9NIG1lc3NhZ2VzX2Z0cyBXSEVSRSByb3dpZCA9IG9sZC5yb3dpZDtcbiAgICAgICAgSU5TRVJUIElOVE8gbWVzc2FnZXNfZnRzXG4gICAgICAgIChyb3dpZCwgYm9keSlcbiAgICAgICAgVkFMVUVTXG4gICAgICAgIChuZXcucm93aWQsIG5ldy5ib2R5KTtcbiAgICAgIEVORDtcblxuICAgICAgLS1cbiAgICAgIC0tIENvcHkgZGF0YSBvdmVyXG4gICAgICAtLVxuXG4gICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc1xuICAgICAgKFxuICAgICAgICBpZCwganNvbiwgdW5yZWFkLCBleHBpcmVzX2F0LCBzZW50X2F0LCBzY2hlbWFWZXJzaW9uLCBjb252ZXJzYXRpb25JZCxcbiAgICAgICAgcmVjZWl2ZWRfYXQsIHNvdXJjZSwgc291cmNlRGV2aWNlLCBoYXNBdHRhY2htZW50cywgaGFzRmlsZUF0dGFjaG1lbnRzLFxuICAgICAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzLCBleHBpcmVUaW1lciwgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wLCB0eXBlLFxuICAgICAgICBib2R5LCBtZXNzYWdlVGltZXIsIG1lc3NhZ2VUaW1lclN0YXJ0LCBtZXNzYWdlVGltZXJFeHBpcmVzQXQsIGlzRXJhc2VkLFxuICAgICAgICBpc1ZpZXdPbmNlLCBzb3VyY2VVdWlkXG4gICAgICApXG4gICAgICBTRUxFQ1RcbiAgICAgICAgaWQsIGpzb24sIHVucmVhZCwgZXhwaXJlc19hdCwgc2VudF9hdCwgc2NoZW1hVmVyc2lvbiwgY29udmVyc2F0aW9uSWQsXG4gICAgICAgIHJlY2VpdmVkX2F0LCBzb3VyY2UsIHNvdXJjZURldmljZSwgaGFzQXR0YWNobWVudHMsIGhhc0ZpbGVBdHRhY2htZW50cyxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50cywgZXhwaXJlVGltZXIsIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCwgdHlwZSxcbiAgICAgICAgYm9keSwgbWVzc2FnZVRpbWVyLCBtZXNzYWdlVGltZXJTdGFydCwgbWVzc2FnZVRpbWVyRXhwaXJlc0F0LCBpc0VyYXNlZCxcbiAgICAgICAgaXNWaWV3T25jZSwgc291cmNlVXVpZFxuICAgICAgRlJPTSBvbGRfbWVzc2FnZXM7XG5cbiAgICAgIC0tIERyb3Agb2xkIGRhdGFiYXNlXG4gICAgICBEUk9QIFRBQkxFIG9sZF9tZXNzYWdlcztcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMjUnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjI1OiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24yNihcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMjYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0O1xuICAgICAgRFJPUCBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZTtcblxuICAgICAgQ1JFQVRFIFRSSUdHRVIgbWVzc2FnZXNfb25faW5zZXJ0IEFGVEVSIElOU0VSVCBPTiBtZXNzYWdlc1xuICAgICAgV0hFTiBuZXcuaXNWaWV3T25jZSBJUyBOVUxMIE9SIG5ldy5pc1ZpZXdPbmNlICE9IDFcbiAgICAgIEJFR0lOXG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0c1xuICAgICAgICAocm93aWQsIGJvZHkpXG4gICAgICAgIFZBTFVFU1xuICAgICAgICAobmV3LnJvd2lkLCBuZXcuYm9keSk7XG4gICAgICBFTkQ7XG5cbiAgICAgIENSRUFURSBUUklHR0VSIG1lc3NhZ2VzX29uX3VwZGF0ZSBBRlRFUiBVUERBVEUgT04gbWVzc2FnZXNcbiAgICAgIFdIRU4gbmV3LmJvZHkgIT0gb2xkLmJvZHkgQU5EXG4gICAgICAgIChuZXcuaXNWaWV3T25jZSBJUyBOVUxMIE9SIG5ldy5pc1ZpZXdPbmNlICE9IDEpXG4gICAgICBCRUdJTlxuICAgICAgICBERUxFVEUgRlJPTSBtZXNzYWdlc19mdHMgV0hFUkUgcm93aWQgPSBvbGQucm93aWQ7XG4gICAgICAgIElOU0VSVCBJTlRPIG1lc3NhZ2VzX2Z0c1xuICAgICAgICAocm93aWQsIGJvZHkpXG4gICAgICAgIFZBTFVFU1xuICAgICAgICAobmV3LnJvd2lkLCBuZXcuYm9keSk7XG4gICAgICBFTkQ7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDI2Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yNjogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjcoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDI3KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzIFdIRVJFIHJvd2lkIElOXG4gICAgICAgIChTRUxFQ1Qgcm93aWQgRlJPTSBtZXNzYWdlcyBXSEVSRSBib2R5IElTIE5VTEwpO1xuXG4gICAgICBEUk9QIFRSSUdHRVIgbWVzc2FnZXNfb25fdXBkYXRlO1xuXG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl91cGRhdGUgQUZURVIgVVBEQVRFIE9OIG1lc3NhZ2VzXG4gICAgICBXSEVOXG4gICAgICAgIG5ldy5ib2R5IElTIE5VTEwgT1JcbiAgICAgICAgKChvbGQuYm9keSBJUyBOVUxMIE9SIG5ldy5ib2R5ICE9IG9sZC5ib2R5KSBBTkRcbiAgICAgICAgIChuZXcuaXNWaWV3T25jZSBJUyBOVUxMIE9SIG5ldy5pc1ZpZXdPbmNlICE9IDEpKVxuICAgICAgQkVHSU5cbiAgICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzIFdIRVJFIHJvd2lkID0gb2xkLnJvd2lkO1xuICAgICAgICBJTlNFUlQgSU5UTyBtZXNzYWdlc19mdHNcbiAgICAgICAgKHJvd2lkLCBib2R5KVxuICAgICAgICBWQUxVRVNcbiAgICAgICAgKG5ldy5yb3dpZCwgbmV3LmJvZHkpO1xuICAgICAgRU5EO1xuXG4gICAgICBDUkVBVEUgVFJJR0dFUiBtZXNzYWdlc19vbl92aWV3X29uY2VfdXBkYXRlIEFGVEVSIFVQREFURSBPTiBtZXNzYWdlc1xuICAgICAgV0hFTlxuICAgICAgICBuZXcuYm9keSBJUyBOT1QgTlVMTCBBTkQgbmV3LmlzVmlld09uY2UgPSAxXG4gICAgICBCRUdJTlxuICAgICAgICBERUxFVEUgRlJPTSBtZXNzYWdlc19mdHMgV0hFUkUgcm93aWQgPSBvbGQucm93aWQ7XG4gICAgICBFTkQ7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDI3Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24yNzogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjgoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDI4KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgQ1JFQVRFIFRBQkxFIGpvYnMoXG4gICAgICAgIGlkIFRFWFQgUFJJTUFSWSBLRVksXG4gICAgICAgIHF1ZXVlVHlwZSBURVhUIFNUUklORyBOT1QgTlVMTCxcbiAgICAgICAgdGltZXN0YW1wIElOVEVHRVIgTk9UIE5VTEwsXG4gICAgICAgIGRhdGEgU1RSSU5HIFRFWFRcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBqb2JzX3RpbWVzdGFtcCBPTiBqb2JzICh0aW1lc3RhbXApO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAyOCcpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMjg6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjI5KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAyOSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIENSRUFURSBUQUJMRSByZWFjdGlvbnMoXG4gICAgICAgIGNvbnZlcnNhdGlvbklkIFNUUklORyxcbiAgICAgICAgZW1vamkgU1RSSU5HLFxuICAgICAgICBmcm9tSWQgU1RSSU5HLFxuICAgICAgICBtZXNzYWdlUmVjZWl2ZWRBdCBJTlRFR0VSLFxuICAgICAgICB0YXJnZXRBdXRob3JVdWlkIFNUUklORyxcbiAgICAgICAgdGFyZ2V0VGltZXN0YW1wIElOVEVHRVIsXG4gICAgICAgIHVucmVhZCBJTlRFR0VSXG4gICAgICApO1xuXG4gICAgICBDUkVBVEUgSU5ERVggcmVhY3Rpb25zX3VucmVhZCBPTiByZWFjdGlvbnMgKFxuICAgICAgICB1bnJlYWQsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkXG4gICAgICApO1xuXG4gICAgICBDUkVBVEUgSU5ERVggcmVhY3Rpb25faWRlbnRpZmllciBPTiByZWFjdGlvbnMgKFxuICAgICAgICBlbW9qaSxcbiAgICAgICAgdGFyZ2V0QXV0aG9yVXVpZCxcbiAgICAgICAgdGFyZ2V0VGltZXN0YW1wXG4gICAgICApO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAyOScpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMjk6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjMwKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIENSRUFURSBUQUJMRSBzZW5kZXJLZXlzKFxuICAgICAgICBpZCBURVhUIFBSSU1BUlkgS0VZIE5PVCBOVUxMLFxuICAgICAgICBzZW5kZXJJZCBURVhUIE5PVCBOVUxMLFxuICAgICAgICBkaXN0cmlidXRpb25JZCBURVhUIE5PVCBOVUxMLFxuICAgICAgICBkYXRhIEJMT0IgTk9UIE5VTEwsXG4gICAgICAgIGxhc3RVcGRhdGVkRGF0ZSBOVU1CRVIgTk9UIE5VTExcbiAgICAgICk7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDMwJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zMDogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzEoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDMxKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zMTogc3RhcnRpbmcuLi4nKTtcbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgRFJPUCBJTkRFWCB1bnByb2Nlc3NlZF9pZDtcbiAgICAgIERST1AgSU5ERVggdW5wcm9jZXNzZWRfdGltZXN0YW1wO1xuICAgICAgQUxURVIgVEFCTEUgdW5wcm9jZXNzZWQgUkVOQU1FIFRPIHVucHJvY2Vzc2VkX29sZDtcblxuICAgICAgQ1JFQVRFIFRBQkxFIHVucHJvY2Vzc2VkKFxuICAgICAgICBpZCBTVFJJTkcgUFJJTUFSWSBLRVkgQVNDLFxuICAgICAgICB0aW1lc3RhbXAgSU5URUdFUixcbiAgICAgICAgdmVyc2lvbiBJTlRFR0VSLFxuICAgICAgICBhdHRlbXB0cyBJTlRFR0VSLFxuICAgICAgICBlbnZlbG9wZSBURVhULFxuICAgICAgICBkZWNyeXB0ZWQgVEVYVCxcbiAgICAgICAgc291cmNlIFRFWFQsXG4gICAgICAgIHNvdXJjZURldmljZSBURVhULFxuICAgICAgICBzZXJ2ZXJUaW1lc3RhbXAgSU5URUdFUixcbiAgICAgICAgc291cmNlVXVpZCBTVFJJTkdcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCB1bnByb2Nlc3NlZF90aW1lc3RhbXAgT04gdW5wcm9jZXNzZWQgKFxuICAgICAgICB0aW1lc3RhbXBcbiAgICAgICk7XG5cbiAgICAgIElOU0VSVCBPUiBSRVBMQUNFIElOVE8gdW5wcm9jZXNzZWRcbiAgICAgICAgKGlkLCB0aW1lc3RhbXAsIHZlcnNpb24sIGF0dGVtcHRzLCBlbnZlbG9wZSwgZGVjcnlwdGVkLCBzb3VyY2UsXG4gICAgICAgICBzb3VyY2VEZXZpY2UsIHNlcnZlclRpbWVzdGFtcCwgc291cmNlVXVpZClcbiAgICAgIFNFTEVDVFxuICAgICAgICBpZCwgdGltZXN0YW1wLCB2ZXJzaW9uLCBhdHRlbXB0cywgZW52ZWxvcGUsIGRlY3J5cHRlZCwgc291cmNlLFxuICAgICAgICAgc291cmNlRGV2aWNlLCBzZXJ2ZXJUaW1lc3RhbXAsIHNvdXJjZVV1aWRcbiAgICAgIEZST00gdW5wcm9jZXNzZWRfb2xkO1xuXG4gICAgICBEUk9QIFRBQkxFIHVucHJvY2Vzc2VkX29sZDtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMzEnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjMxOiBzdWNjZXNzIScpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUb1NjaGVtYVZlcnNpb24zMihcbiAgY3VycmVudFZlcnNpb246IG51bWJlcixcbiAgZGI6IERhdGFiYXNlLFxuICBsb2dnZXI6IExvZ2dlclR5cGVcbik6IHZvaWQge1xuICBpZiAoY3VycmVudFZlcnNpb24gPj0gMzIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkYi50cmFuc2FjdGlvbigoKSA9PiB7XG4gICAgZGIuZXhlYyhgXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgQUREIENPTFVNTiBzZXJ2ZXJHdWlkIFNUUklORyBOVUxMO1xuXG4gICAgICBBTFRFUiBUQUJMRSB1bnByb2Nlc3NlZFxuICAgICAgQUREIENPTFVNTiBzZXJ2ZXJHdWlkIFNUUklORyBOVUxMO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAzMicpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMzI6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjMzKFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzMykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIC0tIFRoZXNlIGluZGV4ZXMgc2hvdWxkIGV4aXN0LCBidXQgd2UgYWRkIFwiSUYgRVhJU1RTXCIgZm9yIHNhZmV0eS5cbiAgICAgIERST1AgSU5ERVggSUYgRVhJU1RTIG1lc3NhZ2VzX2V4cGlyZXNfYXQ7XG4gICAgICBEUk9QIElOREVYIElGIEVYSVNUUyBtZXNzYWdlc193aXRob3V0X3RpbWVyO1xuXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgQUREIENPTFVNTlxuICAgICAgZXhwaXJlc0F0IElOVFxuICAgICAgR0VORVJBVEVEIEFMV0FZU1xuICAgICAgQVMgKGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCArIChleHBpcmVUaW1lciAqIDEwMDApKTtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VfZXhwaXJlc19hdCBPTiBtZXNzYWdlcyAoXG4gICAgICAgIGV4cGlyZXNBdFxuICAgICAgKTtcblxuICAgICAgQ1JFQVRFIElOREVYIG91dGdvaW5nX21lc3NhZ2VzX3dpdGhvdXRfZXhwaXJhdGlvbl9zdGFydF90aW1lc3RhbXAgT04gbWVzc2FnZXMgKFxuICAgICAgICBleHBpcmVUaW1lciwgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wLCB0eXBlXG4gICAgICApXG4gICAgICBXSEVSRSBleHBpcmVUaW1lciBJUyBOT1QgTlVMTCBBTkQgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wIElTIE5VTEw7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDMzJyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zMzogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzQoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDM0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoYFxuICAgICAgLS0gVGhpcyBpbmRleCBzaG91bGQgZXhpc3QsIGJ1dCB3ZSBhZGQgXCJJRiBFWElTVFNcIiBmb3Igc2FmZXR5LlxuICAgICAgRFJPUCBJTkRFWCBJRiBFWElTVFMgb3V0Z29pbmdfbWVzc2FnZXNfd2l0aG91dF9leHBpcmF0aW9uX3N0YXJ0X3RpbWVzdGFtcDtcblxuICAgICAgQ1JFQVRFIElOREVYIG1lc3NhZ2VzX3VuZXhwZWN0ZWRseV9taXNzaW5nX2V4cGlyYXRpb25fc3RhcnRfdGltZXN0YW1wIE9OIG1lc3NhZ2VzIChcbiAgICAgICAgZXhwaXJlVGltZXIsIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCwgdHlwZVxuICAgICAgKVxuICAgICAgV0hFUkUgZXhwaXJlVGltZXIgSVMgTk9UIE5VTEwgQU5EIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCBJUyBOVUxMO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAzNCcpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMzQ6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjM1KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzNSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIENSRUFURSBJTkRFWCBleHBpcmluZ19tZXNzYWdlX2J5X2NvbnZlcnNhdGlvbl9hbmRfcmVjZWl2ZWRfYXRcbiAgICAgIE9OIG1lc3NhZ2VzXG4gICAgICAoXG4gICAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcCxcbiAgICAgICAgZXhwaXJlVGltZXIsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICByZWNlaXZlZF9hdFxuICAgICAgKTtcbiAgICBgKTtcblxuICAgIGRiLnByYWdtYSgndXNlcl92ZXJzaW9uID0gMzUnKTtcbiAgfSkoKTtcbiAgbG9nZ2VyLmluZm8oJ3VwZGF0ZVRvU2NoZW1hVmVyc2lvbjM1OiBzdWNjZXNzIScpO1xufVxuXG4vLyBSZXZlcnRlZFxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzYoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDM2KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAzNicpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMzY6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjM3KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzNykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICBkYi5leGVjKGBcbiAgICAgIC0tIENyZWF0ZSBzZW5kIGxvZyBwcmltYXJ5IHRhYmxlXG5cbiAgICAgIENSRUFURSBUQUJMRSBzZW5kTG9nUGF5bG9hZHMoXG4gICAgICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVkgQVNDLFxuXG4gICAgICAgIHRpbWVzdGFtcCBJTlRFR0VSIE5PVCBOVUxMLFxuICAgICAgICBjb250ZW50SGludCBJTlRFR0VSIE5PVCBOVUxMLFxuICAgICAgICBwcm90byBCTE9CIE5PVCBOVUxMXG4gICAgICApO1xuXG4gICAgICBDUkVBVEUgSU5ERVggc2VuZExvZ1BheWxvYWRzQnlUaW1lc3RhbXAgT04gc2VuZExvZ1BheWxvYWRzICh0aW1lc3RhbXApO1xuXG4gICAgICAtLSBDcmVhdGUgc2VuZCBsb2cgcmVjaXBpZW50cyB0YWJsZSB3aXRoIGZvcmVpZ24ga2V5IHJlbGF0aW9uc2hpcCB0byBwYXlsb2Fkc1xuXG4gICAgICBDUkVBVEUgVEFCTEUgc2VuZExvZ1JlY2lwaWVudHMoXG4gICAgICAgIHBheWxvYWRJZCBJTlRFR0VSIE5PVCBOVUxMLFxuXG4gICAgICAgIHJlY2lwaWVudFV1aWQgU1RSSU5HIE5PVCBOVUxMLFxuICAgICAgICBkZXZpY2VJZCBJTlRFR0VSIE5PVCBOVUxMLFxuXG4gICAgICAgIFBSSU1BUlkgS0VZIChwYXlsb2FkSWQsIHJlY2lwaWVudFV1aWQsIGRldmljZUlkKSxcblxuICAgICAgICBDT05TVFJBSU5UIHNlbmRMb2dSZWNpcGllbnRzRm9yZWlnbktleVxuICAgICAgICAgIEZPUkVJR04gS0VZIChwYXlsb2FkSWQpXG4gICAgICAgICAgUkVGRVJFTkNFUyBzZW5kTG9nUGF5bG9hZHMoaWQpXG4gICAgICAgICAgT04gREVMRVRFIENBU0NBREVcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBzZW5kTG9nUmVjaXBpZW50c0J5UmVjaXBpZW50XG4gICAgICAgIE9OIHNlbmRMb2dSZWNpcGllbnRzIChyZWNpcGllbnRVdWlkLCBkZXZpY2VJZCk7XG5cbiAgICAgIC0tIENyZWF0ZSBzZW5kIGxvZyBtZXNzYWdlcyB0YWJsZSB3aXRoIGZvcmVpZ24ga2V5IHJlbGF0aW9uc2hpcCB0byBwYXlsb2Fkc1xuXG4gICAgICBDUkVBVEUgVEFCTEUgc2VuZExvZ01lc3NhZ2VJZHMoXG4gICAgICAgIHBheWxvYWRJZCBJTlRFR0VSIE5PVCBOVUxMLFxuXG4gICAgICAgIG1lc3NhZ2VJZCBTVFJJTkcgTk9UIE5VTEwsXG5cbiAgICAgICAgUFJJTUFSWSBLRVkgKHBheWxvYWRJZCwgbWVzc2FnZUlkKSxcblxuICAgICAgICBDT05TVFJBSU5UIHNlbmRMb2dNZXNzYWdlSWRzRm9yZWlnbktleVxuICAgICAgICAgIEZPUkVJR04gS0VZIChwYXlsb2FkSWQpXG4gICAgICAgICAgUkVGRVJFTkNFUyBzZW5kTG9nUGF5bG9hZHMoaWQpXG4gICAgICAgICAgT04gREVMRVRFIENBU0NBREVcbiAgICAgICk7XG5cbiAgICAgIENSRUFURSBJTkRFWCBzZW5kTG9nTWVzc2FnZUlkc0J5TWVzc2FnZVxuICAgICAgICBPTiBzZW5kTG9nTWVzc2FnZUlkcyAobWVzc2FnZUlkKTtcblxuICAgICAgLS0gUmVjcmVhdGUgbWVzc2FnZXMgdGFibGUgZGVsZXRlIHRyaWdnZXIgd2l0aCBzZW5kIGxvZyBzdXBwb3J0XG5cbiAgICAgIERST1AgVFJJR0dFUiBtZXNzYWdlc19vbl9kZWxldGU7XG5cbiAgICAgIENSRUFURSBUUklHR0VSIG1lc3NhZ2VzX29uX2RlbGV0ZSBBRlRFUiBERUxFVEUgT04gbWVzc2FnZXMgQkVHSU5cbiAgICAgICAgREVMRVRFIEZST00gbWVzc2FnZXNfZnRzIFdIRVJFIHJvd2lkID0gb2xkLnJvd2lkO1xuICAgICAgICBERUxFVEUgRlJPTSBzZW5kTG9nUGF5bG9hZHMgV0hFUkUgaWQgSU4gKFxuICAgICAgICAgIFNFTEVDVCBwYXlsb2FkSWQgRlJPTSBzZW5kTG9nTWVzc2FnZUlkc1xuICAgICAgICAgIFdIRVJFIG1lc3NhZ2VJZCA9IG9sZC5pZFxuICAgICAgICApO1xuICAgICAgRU5EO1xuXG4gICAgICAtLS0gQWRkIG1lc3NhZ2VJZCBjb2x1bW4gdG8gcmVhY3Rpb25zIHRhYmxlIHRvIHByb3Blcmx5IHRyYWNrIHByb3RvIGFzc29jaWF0aW9uc1xuXG4gICAgICBBTFRFUiBUQUJMRSByZWFjdGlvbnMgQUREIGNvbHVtbiBtZXNzYWdlSWQgU1RSSU5HO1xuICAgIGApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSAzNycpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uMzc6IHN1Y2Nlc3MhJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjM4KFxuICBjdXJyZW50VmVyc2lvbjogbnVtYmVyLFxuICBkYjogRGF0YWJhc2UsXG4gIGxvZ2dlcjogTG9nZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGlmIChjdXJyZW50VmVyc2lvbiA+PSAzOCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRiLnRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICAvLyBUT0RPOiBSZW1vdmUgZGVwcmVjYXRlZCBjb2x1bW5zIG9uY2Ugc3FsY2lwaGVyIGlzIHVwZGF0ZWQgdG8gc3VwcG9ydCBpdFxuICAgIGRiLmV4ZWMoYFxuICAgICAgRFJPUCBJTkRFWCBJRiBFWElTVFMgbWVzc2FnZXNfZHVwbGljYXRlX2NoZWNrO1xuXG4gICAgICBBTFRFUiBUQUJMRSBtZXNzYWdlc1xuICAgICAgICBSRU5BTUUgQ09MVU1OIHNvdXJjZURldmljZSBUTyBkZXByZWNhdGVkU291cmNlRGV2aWNlO1xuICAgICAgQUxURVIgVEFCTEUgbWVzc2FnZXNcbiAgICAgICAgQUREIENPTFVNTiBzb3VyY2VEZXZpY2UgSU5URUdFUjtcblxuICAgICAgVVBEQVRFIG1lc3NhZ2VzXG4gICAgICBTRVRcbiAgICAgICAgc291cmNlRGV2aWNlID0gQ0FTVChkZXByZWNhdGVkU291cmNlRGV2aWNlIEFTIElOVEVHRVIpLFxuICAgICAgICBkZXByZWNhdGVkU291cmNlRGV2aWNlID0gTlVMTDtcblxuICAgICAgQUxURVIgVEFCTEUgdW5wcm9jZXNzZWRcbiAgICAgICAgUkVOQU1FIENPTFVNTiBzb3VyY2VEZXZpY2UgVE8gZGVwcmVjYXRlZFNvdXJjZURldmljZTtcbiAgICAgIEFMVEVSIFRBQkxFIHVucHJvY2Vzc2VkXG4gICAgICAgIEFERCBDT0xVTU4gc291cmNlRGV2aWNlIElOVEVHRVI7XG5cbiAgICAgIFVQREFURSB1bnByb2Nlc3NlZFxuICAgICAgU0VUXG4gICAgICAgIHNvdXJjZURldmljZSA9IENBU1QoZGVwcmVjYXRlZFNvdXJjZURldmljZSBBUyBJTlRFR0VSKSxcbiAgICAgICAgZGVwcmVjYXRlZFNvdXJjZURldmljZSA9IE5VTEw7XG4gICAgYCk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDM4Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zODogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzkoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDM5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoJ0FMVEVSIFRBQkxFIG1lc3NhZ2VzIFJFTkFNRSBDT0xVTU4gdW5yZWFkIFRPIHJlYWRTdGF0dXM7Jyk7XG5cbiAgICBkYi5wcmFnbWEoJ3VzZXJfdmVyc2lvbiA9IDM5Jyk7XG4gIH0pKCk7XG4gIGxvZ2dlci5pbmZvKCd1cGRhdGVUb1NjaGVtYVZlcnNpb24zOTogc3VjY2VzcyEnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDAoXG4gIGN1cnJlbnRWZXJzaW9uOiBudW1iZXIsXG4gIGRiOiBEYXRhYmFzZSxcbiAgbG9nZ2VyOiBMb2dnZXJUeXBlXG4pOiB2b2lkIHtcbiAgaWYgKGN1cnJlbnRWZXJzaW9uID49IDQwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGIudHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgIGRiLmV4ZWMoXG4gICAgICBgXG4gICAgICBDUkVBVEUgVEFCTEUgZ3JvdXBDYWxsUmluZ3MoXG4gICAgICAgIHJpbmdJZCBJTlRFR0VSIFBSSU1BUlkgS0VZLFxuICAgICAgICBpc0FjdGl2ZSBJTlRFR0VSIE5PVCBOVUxMLFxuICAgICAgICBjcmVhdGVkQXQgSU5URUdFUiBOT1QgTlVMTFxuICAgICAgKTtcbiAgICAgIGBcbiAgICApO1xuXG4gICAgZGIucHJhZ21hKCd1c2VyX3ZlcnNpb24gPSA0MCcpO1xuICB9KSgpO1xuICBsb2dnZXIuaW5mbygndXBkYXRlVG9TY2hlbWFWZXJzaW9uNDA6IHN1Y2Nlc3MhJyk7XG59XG5cbmV4cG9ydCBjb25zdCBTQ0hFTUFfVkVSU0lPTlMgPSBbXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjEsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjIsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjMsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQsXG4gIChfdjogbnVtYmVyLCBfaTogRGF0YWJhc2UsIF9sOiBMb2dnZXJUeXBlKTogdm9pZCA9PiB1bmRlZmluZWQsIC8vIHZlcnNpb24gNSB3YXMgZHJvcHBlZFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb242LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb243LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb244LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb245LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24xMCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMTEsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjEyLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24xMyxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMTQsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjE1LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24xNixcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMTcsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjE4LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24xOSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjAsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjIxLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24yMixcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjMsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjI0LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24yNSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjYsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjI3LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24yOCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMjksXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjMwLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24zMSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzIsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjMzLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24zNCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzUsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjM2LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb24zNyxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uMzgsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjM5LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb240MCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDEsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQyLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb240MyxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDQsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQ1LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb240NixcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNDcsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjQ4LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb240OSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTAsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjUxLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb241MixcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTMsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjU0LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb241NSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTYsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjU3LFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb241OCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNTksXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjYwLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb242MSxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjIsXG4gIHVwZGF0ZVRvU2NoZW1hVmVyc2lvbjYzLFxuICB1cGRhdGVUb1NjaGVtYVZlcnNpb242NCxcbiAgdXBkYXRlVG9TY2hlbWFWZXJzaW9uNjUsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU2NoZW1hKGRiOiBEYXRhYmFzZSwgbG9nZ2VyOiBMb2dnZXJUeXBlKTogdm9pZCB7XG4gIGNvbnN0IHNxbGl0ZVZlcnNpb24gPSBnZXRTUUxpdGVWZXJzaW9uKGRiKTtcbiAgY29uc3Qgc3FsY2lwaGVyVmVyc2lvbiA9IGdldFNRTENpcGhlclZlcnNpb24oZGIpO1xuICBjb25zdCB1c2VyVmVyc2lvbiA9IGdldFVzZXJWZXJzaW9uKGRiKTtcbiAgY29uc3QgbWF4VXNlclZlcnNpb24gPSBTQ0hFTUFfVkVSU0lPTlMubGVuZ3RoO1xuICBjb25zdCBzY2hlbWFWZXJzaW9uID0gZ2V0U2NoZW1hVmVyc2lvbihkYik7XG5cbiAgbG9nZ2VyLmluZm8oXG4gICAgJ3VwZGF0ZVNjaGVtYTpcXG4nLFxuICAgIGAgQ3VycmVudCB1c2VyX3ZlcnNpb246ICR7dXNlclZlcnNpb259O1xcbmAsXG4gICAgYCBNb3N0IHJlY2VudCBkYiBzY2hlbWE6ICR7bWF4VXNlclZlcnNpb259O1xcbmAsXG4gICAgYCBTUUxpdGUgdmVyc2lvbjogJHtzcWxpdGVWZXJzaW9ufTtcXG5gLFxuICAgIGAgU1FMQ2lwaGVyIHZlcnNpb246ICR7c3FsY2lwaGVyVmVyc2lvbn07XFxuYCxcbiAgICBgIChkZXByZWNhdGVkKSBzY2hlbWFfdmVyc2lvbjogJHtzY2hlbWFWZXJzaW9ufTtcXG5gXG4gICk7XG5cbiAgaWYgKHVzZXJWZXJzaW9uID4gbWF4VXNlclZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgU1FMOiBVc2VyIHZlcnNpb24gaXMgJHt1c2VyVmVyc2lvbn0gYnV0IHRoZSBleHBlY3RlZCBtYXhpbXVtIHZlcnNpb24gYCArXG4gICAgICAgIGBpcyAke21heFVzZXJWZXJzaW9ufS4gRGlkIHlvdSB0cnkgdG8gc3RhcnQgYW4gb2xkIHZlcnNpb24gb2YgU2lnbmFsP2BcbiAgICApO1xuICB9XG5cbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG1heFVzZXJWZXJzaW9uOyBpbmRleCArPSAxKSB7XG4gICAgY29uc3QgcnVuU2NoZW1hVXBkYXRlID0gU0NIRU1BX1ZFUlNJT05TW2luZGV4XTtcblxuICAgIHJ1blNjaGVtYVVwZGF0ZSh1c2VyVmVyc2lvbiwgZGIsIGxvZ2dlcik7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBLG9CQUFzQjtBQUd0QixrQkFBcUI7QUFDckIsa0JBT087QUFHUCx1QkFBb0M7QUFDcEMsNkJBQW9DO0FBQ3BDLHNCQUFvQztBQUNwQyxvQkFBb0M7QUFDcEMscUJBQW9DO0FBQ3BDLDhCQUFvQztBQUNwQyw4QkFBb0M7QUFDcEMsc0NBQW9DO0FBQ3BDLCtCQUFvQztBQUNwQyx1Q0FBb0M7QUFDcEMsMENBQW9DO0FBQ3BDLCtCQUFvQztBQUNwQyxnQ0FBb0M7QUFDcEMsNkNBQW9DO0FBQ3BDLGdDQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMseUNBQW9DO0FBQ3BDLDJCQUFvQztBQUNwQyxtREFBb0M7QUFDcEMsbUNBQW9DO0FBQ3BDLHVDQUFvQztBQUNwQyxvQ0FBb0M7QUFDcEMsdUNBQW9DO0FBQ3BDLHNDQUFvQztBQUNwQyx3Q0FBb0M7QUFFcEMsZ0NBQ0UsZ0JBQ0EsSUFDQSxRQUNNO0FBQ04sTUFBSSxrQkFBa0IsR0FBRztBQUN2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
