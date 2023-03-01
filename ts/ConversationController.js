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
var ConversationController_exports = {};
__export(ConversationController_exports, {
  ConversationController: () => ConversationController,
  start: () => start
});
module.exports = __toCommonJS(ConversationController_exports);
var import_lodash = require("lodash");
var import_p_queue = __toESM(require("p-queue"));
var import_Client = __toESM(require("./sql/Client"));
var log = __toESM(require("./logging/log"));
var Errors = __toESM(require("./types/errors"));
var import_helpers = require("./messages/helpers");
var import_groups = require("./groups");
var import_assert = require("./util/assert");
var import_whatTypeOfConversation = require("./util/whatTypeOfConversation");
var import_getConversationUnreadCountForAppBadge = require("./util/getConversationUnreadCountForAppBadge");
var import_UUID = require("./types/UUID");
var import_Address = require("./types/Address");
var import_QualifiedAddress = require("./types/QualifiedAddress");
var import_sleep = require("./util/sleep");
var import_isNotNil = require("./util/isNotNil");
var import_durations = require("./util/durations");
const { hasOwnProperty } = Object.prototype;
function applyChangeToConversation(conversation, suggestedChange) {
  const change = { ...suggestedChange };
  if (hasOwnProperty.call(change, "e164") && !change.pni) {
    change.pni = void 0;
  }
  if (change.pni && !change.uuid && (!conversation.get("uuid") || conversation.get("uuid") === conversation.get("pni"))) {
    change.uuid = change.pni;
  }
  if (!change.uuid && hasOwnProperty.call(change, "pni") && !change.pni && conversation.get("uuid") === conversation.get("pni")) {
    change.uuid = void 0;
  }
  if (hasOwnProperty.call(change, "uuid")) {
    conversation.updateUuid(change.uuid);
  }
  if (hasOwnProperty.call(change, "e164")) {
    conversation.updateE164(change.e164);
  }
  if (hasOwnProperty.call(change, "pni")) {
    conversation.updatePni(change.pni);
  }
}
async function safeCombineConversations({
  logId,
  oldConversation,
  newConversation
}) {
  try {
    await window.ConversationController.combineConversations(newConversation, oldConversation);
  } catch (error) {
    log.warn(`${logId}: error combining contacts: ${Errors.toLogFormat(error)}`);
  }
}
const MAX_MESSAGE_BODY_LENGTH = 64 * 1024;
const {
  getAllConversations,
  getAllGroupsInvolvingUuid,
  getMessagesBySentAt,
  migrateConversationMessages,
  removeConversation,
  saveConversation,
  updateConversation
} = import_Client.default;
function start() {
  const conversations = new window.Whisper.ConversationCollection();
  window.getConversations = () => conversations;
  window.ConversationController = new ConversationController(conversations);
}
class ConversationController {
  constructor(_conversations) {
    this._conversations = _conversations;
    this._initialFetchComplete = false;
    this._conversationOpenStart = /* @__PURE__ */ new Map();
    this._hasQueueEmptied = false;
    this._combineConversationsQueue = new import_p_queue.default({ concurrency: 1 });
    const debouncedUpdateUnreadCount = (0, import_lodash.debounce)(this.updateUnreadCount.bind(this), import_durations.SECOND, {
      leading: true,
      maxWait: import_durations.SECOND,
      trailing: true
    });
    window.Whisper.events.on("updateUnreadCount", debouncedUpdateUnreadCount);
    this._conversations.on("add remove change:active_at change:unreadCount change:markedUnread change:isArchived change:muteExpiresAt", debouncedUpdateUnreadCount);
    this._conversations.on("add", (model) => {
      model.startMuteTimer();
    });
  }
  updateUnreadCount() {
    if (!this._hasQueueEmptied) {
      return;
    }
    const canCountMutedConversations = window.storage.get("badge-count-muted-conversations") || false;
    const newUnreadCount = this._conversations.reduce((result, conversation) => result + (0, import_getConversationUnreadCountForAppBadge.getConversationUnreadCountForAppBadge)(conversation.attributes, canCountMutedConversations), 0);
    window.storage.put("unreadCount", newUnreadCount);
    if (newUnreadCount > 0) {
      window.setBadgeCount(newUnreadCount);
      window.document.title = `${window.getTitle()} (${newUnreadCount})`;
    } else {
      window.setBadgeCount(0);
      window.document.title = window.getTitle();
    }
    window.updateTrayIcon(newUnreadCount);
  }
  onEmpty() {
    this._hasQueueEmptied = true;
    this.updateUnreadCount();
  }
  get(id) {
    if (!this._initialFetchComplete) {
      throw new Error("ConversationController.get() needs complete initial fetch");
    }
    return this._conversations.get(id);
  }
  getAll() {
    return this._conversations.models;
  }
  dangerouslyCreateAndAdd(attributes) {
    return this._conversations.add(attributes);
  }
  dangerouslyRemoveById(id) {
    this._conversations.remove(id);
    this._conversations.resetLookups();
  }
  getOrCreate(identifier, type, additionalInitialProps = {}) {
    if (typeof identifier !== "string") {
      throw new TypeError("'id' must be a string");
    }
    if (type !== "private" && type !== "group") {
      throw new TypeError(`'type' must be 'private' or 'group'; got: '${type}'`);
    }
    if (!this._initialFetchComplete) {
      throw new Error("ConversationController.get() needs complete initial fetch");
    }
    let conversation = this._conversations.get(identifier);
    if (conversation) {
      return conversation;
    }
    const id = import_UUID.UUID.generate().toString();
    if (type === "group") {
      conversation = this._conversations.add({
        id,
        uuid: void 0,
        e164: void 0,
        groupId: identifier,
        type,
        version: 2,
        ...additionalInitialProps
      });
    } else if ((0, import_UUID.isValidUuid)(identifier)) {
      conversation = this._conversations.add({
        id,
        uuid: identifier,
        e164: void 0,
        groupId: void 0,
        type,
        version: 2,
        ...additionalInitialProps
      });
    } else {
      conversation = this._conversations.add({
        id,
        uuid: void 0,
        e164: identifier,
        groupId: void 0,
        type,
        version: 2,
        ...additionalInitialProps
      });
    }
    const create = /* @__PURE__ */ __name(async () => {
      if (!conversation.isValid()) {
        const validationError = conversation.validationError || {};
        log.error("Contact is not valid. Not saving, but adding to collection:", conversation.idForLogging(), validationError.stack);
        return conversation;
      }
      try {
        if ((0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
          (0, import_groups.maybeDeriveGroupV2Id)(conversation);
        }
        await saveConversation(conversation.attributes);
      } catch (error) {
        log.error("Conversation save failed! ", identifier, type, "Error:", error && error.stack ? error.stack : error);
        throw error;
      }
      return conversation;
    }, "create");
    conversation.initialPromise = create();
    return conversation;
  }
  async getOrCreateAndWait(id, type, additionalInitialProps = {}) {
    await this.load();
    const conversation = this.getOrCreate(id, type, additionalInitialProps);
    if (conversation) {
      await conversation.initialPromise;
      return conversation;
    }
    throw new Error("getOrCreateAndWait: did not get conversation");
  }
  getConversationId(address) {
    if (!address) {
      return null;
    }
    const [id] = window.textsecure.utils.unencodeNumber(address);
    const conv = this.get(id);
    if (conv) {
      return conv.get("id");
    }
    return null;
  }
  getOurConversationId() {
    const e164 = window.textsecure.storage.user.getNumber();
    const aci = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI)?.toString();
    const pni = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI)?.toString();
    if (!e164 && !aci && !pni) {
      return void 0;
    }
    const conversation = this.maybeMergeContacts({
      aci,
      e164,
      pni,
      reason: "getOurConversationId"
    });
    return conversation?.id;
  }
  getOurConversationIdOrThrow() {
    const conversationId = this.getOurConversationId();
    if (!conversationId) {
      throw new Error("getOurConversationIdOrThrow: Failed to fetch ourConversationId");
    }
    return conversationId;
  }
  getOurConversation() {
    const conversationId = this.getOurConversationId();
    return conversationId ? this.get(conversationId) : void 0;
  }
  getOurConversationOrThrow() {
    const conversation = this.getOurConversation();
    if (!conversation) {
      throw new Error("getOurConversationOrThrow: Failed to fetch our own conversation");
    }
    return conversation;
  }
  areWePrimaryDevice() {
    const ourDeviceId = window.textsecure.storage.user.getDeviceId();
    return ourDeviceId === 1;
  }
  maybeMergeContacts({
    aci: providedAci,
    e164,
    pni: providedPni,
    reason,
    mergeOldAndNew = safeCombineConversations
  }) {
    const dataProvided = [];
    if (providedAci) {
      dataProvided.push("aci");
    }
    if (e164) {
      dataProvided.push("e164");
    }
    if (providedPni) {
      dataProvided.push("pni");
    }
    const logId = `maybeMergeContacts/${reason}/${dataProvided.join("+")}`;
    const aci = providedAci ? import_UUID.UUID.cast(providedAci) : void 0;
    const pni = providedPni ? import_UUID.UUID.cast(providedPni) : void 0;
    if (!aci && !e164 && !pni) {
      throw new Error(`${logId}: Need to provide at least one of: aci, e164, pni`);
    }
    const identifier = aci || e164 || pni;
    (0, import_assert.strictAssert)(identifier, `${logId}: identifier must be truthy!`);
    const matches = [
      {
        key: "uuid",
        value: aci,
        match: window.ConversationController.get(aci)
      },
      {
        key: "e164",
        value: e164,
        match: window.ConversationController.get(e164)
      },
      { key: "pni", value: pni, match: window.ConversationController.get(pni) }
    ];
    let unusedMatches = [];
    let targetConversation;
    let matchCount = 0;
    matches.forEach((item) => {
      const { key, value, match } = item;
      if (!value) {
        return;
      }
      if (!match) {
        if (targetConversation) {
          log.info(`${logId}: No match for ${key}, applying to target conversation`);
          applyChangeToConversation(targetConversation, {
            [key]: value
          });
        } else {
          unusedMatches.push(item);
        }
        return;
      }
      matchCount += 1;
      unusedMatches.forEach((unused) => {
        (0, import_assert.strictAssert)(unused.value, "An unused value should always be truthy");
        if (!targetConversation && (!match.get(unused.key) || unused.key === "uuid" && match.get(unused.key) === pni)) {
          log.info(`${logId}: Match on ${key} does not have ${unused.key}, so it will be our target conversation - ${match.idForLogging()}`);
          targetConversation = match;
        }
        if (!targetConversation) {
          targetConversation = this.getOrCreate(unused.value, "private");
          log.info(`${logId}: Match on ${key} already had ${unused.key}, so created new target conversation - ${targetConversation.idForLogging()}`);
        }
        log.info(`${logId}: Applying new value for ${unused.key} to target conversation`);
        applyChangeToConversation(targetConversation, {
          [unused.key]: unused.value
        });
      });
      unusedMatches = [];
      if (targetConversation && targetConversation !== match) {
        log.info(`${logId}: Clearing ${key} on match, and adding it to target conversation`);
        const change = {
          [key]: void 0
        };
        if (key === "pni" && match.get("uuid") === pni) {
          change.uuid = void 0;
        }
        applyChangeToConversation(match, change);
        applyChangeToConversation(targetConversation, {
          [key]: value
        });
        if (!match.get("uuid") && !match.get("e164") && !match.get("pni")) {
          log.warn(`${logId}: Removing old conversation which matched on ${key}. Merging with target conversation.`);
          mergeOldAndNew({
            logId,
            oldConversation: match,
            newConversation: targetConversation
          });
        }
      } else if (targetConversation && !targetConversation?.get(key)) {
        log.debug(`${logId}: Re-adding ${key} on target conversation`);
        applyChangeToConversation(targetConversation, {
          [key]: value
        });
      }
      if (!targetConversation) {
        targetConversation = match;
      }
    });
    if (targetConversation) {
      return targetConversation;
    }
    (0, import_assert.strictAssert)(matchCount === 0, `${logId}: should be no matches if no targetConversation`);
    log.info(`${logId}: Creating a new conversation with all inputs`);
    return this.getOrCreate(identifier, "private", { e164, pni });
  }
  lookupOrCreate({
    e164,
    uuid
  }) {
    const normalizedUuid = uuid ? uuid.toLowerCase() : void 0;
    const identifier = normalizedUuid || e164;
    if (!e164 && !uuid || !identifier) {
      log.warn("lookupOrCreate: Called with neither e164 nor uuid!");
      return void 0;
    }
    const convoE164 = this.get(e164);
    const convoUuid = this.get(normalizedUuid);
    if (!convoE164 && !convoUuid) {
      log.info("lookupOrCreate: Creating new contact, no matches found");
      const newConvo = this.getOrCreate(identifier, "private");
      if (normalizedUuid && e164) {
        newConvo.updateE164(e164);
      }
      return newConvo;
    }
    if (!convoE164 && convoUuid) {
      return convoUuid;
    }
    if (convoE164 && !convoUuid) {
      return convoE164;
    }
    if (!convoE164 || !convoUuid) {
      throw new Error("lookupOrCreate: convoE164 or convoUuid are falsey but should both be true!");
    }
    if (convoE164 === convoUuid) {
      return convoUuid;
    }
    log.warn(`lookupOrCreate: Found a split contact - UUID ${normalizedUuid} and E164 ${e164}. Returning UUID match.`);
    return convoUuid;
  }
  async checkForConflicts() {
    log.info("checkForConflicts: starting...");
    const byUuid = /* @__PURE__ */ Object.create(null);
    const byE164 = /* @__PURE__ */ Object.create(null);
    const byGroupV2Id = /* @__PURE__ */ Object.create(null);
    const { models } = this._conversations;
    for (let i = models.length - 1; i >= 0; i -= 1) {
      const conversation = models[i];
      (0, import_assert.assert)(conversation, "Expected conversation to be found in array during iteration");
      const uuid = conversation.get("uuid");
      const pni = conversation.get("pni");
      const e164 = conversation.get("e164");
      if (uuid) {
        const existing = byUuid[uuid];
        if (!existing) {
          byUuid[uuid] = conversation;
        } else {
          log.warn(`checkForConflicts: Found conflict with uuid ${uuid}`);
          if (conversation.get("e164")) {
            await this.combineConversations(conversation, existing);
            byUuid[uuid] = conversation;
          } else {
            await this.combineConversations(existing, conversation);
          }
        }
      }
      if (pni) {
        const existing = byUuid[pni];
        if (!existing) {
          byUuid[pni] = conversation;
        } else {
          log.warn(`checkForConflicts: Found conflict with pni ${pni}`);
          if (conversation.get("e164") || conversation.get("pni")) {
            await this.combineConversations(conversation, existing);
            byUuid[pni] = conversation;
          } else {
            await this.combineConversations(existing, conversation);
          }
        }
      }
      if (e164) {
        const existing = byE164[e164];
        if (!existing) {
          byE164[e164] = conversation;
        } else {
          if (conversation.get("uuid") && existing.get("uuid") && conversation.get("uuid") !== existing.get("uuid")) {
            log.warn(`checkForConflicts: Found two matches on e164 ${e164} with different truthy UUIDs. Dropping e164 on older.`);
            existing.set({ e164: void 0 });
            updateConversation(existing.attributes);
            byE164[e164] = conversation;
            continue;
          }
          log.warn(`checkForConflicts: Found conflict with e164 ${e164}`);
          if (conversation.get("uuid")) {
            await this.combineConversations(conversation, existing);
            byE164[e164] = conversation;
          } else {
            await this.combineConversations(existing, conversation);
          }
        }
      }
      let groupV2Id;
      if ((0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes)) {
        (0, import_groups.maybeDeriveGroupV2Id)(conversation);
        groupV2Id = conversation.get("derivedGroupV2Id");
        (0, import_assert.assert)(groupV2Id, "checkForConflicts: expected the group V2 ID to have been derived, but it was falsy");
      } else if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes)) {
        groupV2Id = conversation.get("groupId");
      }
      if (groupV2Id) {
        const existing = byGroupV2Id[groupV2Id];
        if (!existing) {
          byGroupV2Id[groupV2Id] = conversation;
        } else {
          const logParenthetical = (0, import_whatTypeOfConversation.isGroupV1)(conversation.attributes) ? " (derived from a GV1 group ID)" : "";
          log.warn(`checkForConflicts: Found conflict with group V2 ID ${groupV2Id}${logParenthetical}`);
          if ((0, import_whatTypeOfConversation.isGroupV2)(conversation.attributes) && !(0, import_whatTypeOfConversation.isGroupV2)(existing.attributes)) {
            await this.combineConversations(conversation, existing);
            byGroupV2Id[groupV2Id] = conversation;
          } else {
            await this.combineConversations(existing, conversation);
          }
        }
      }
    }
    log.info("checkForConflicts: complete!");
  }
  async combineConversations(current, obsolete) {
    const logId = `combineConversations/${obsolete.id}->${current.id}`;
    return this._combineConversationsQueue.add(async () => {
      const conversationType = current.get("type");
      if (!this.get(obsolete.id)) {
        log.warn(`${logId}: Already combined obsolete conversation`);
      }
      if (obsolete.get("type") !== conversationType) {
        (0, import_assert.assert)(false, `${logId}: cannot combine a private and group conversation. Doing nothing`);
        return;
      }
      const dataToCopy = (0, import_lodash.pick)(obsolete.attributes, [
        "conversationColor",
        "customColor",
        "customColorId",
        "draftAttachments",
        "draftBodyRanges",
        "draftTimestamp",
        "messageCount",
        "messageRequestResponseType",
        "quotedMessageId",
        "sentMessageCount"
      ]);
      const keys = Object.keys(dataToCopy);
      keys.forEach((key) => {
        if (current.get(key) === void 0) {
          current.set(key, dataToCopy[key]);
          if (key === "draftAttachments") {
            obsolete.set(key, void 0);
          }
        }
      });
      if (obsolete.get("isPinned")) {
        obsolete.unpin();
        if (!current.get("isPinned")) {
          current.pin();
        }
      }
      const obsoleteId = obsolete.get("id");
      const obsoleteUuid = obsolete.getUuid();
      const currentId = current.get("id");
      log.warn(`${logId}: Combining two conversations -`, `old: ${obsolete.idForLogging()} -> new: ${current.idForLogging()}`);
      if (conversationType === "private" && obsoleteUuid) {
        if (!current.get("profileKey") && obsolete.get("profileKey")) {
          log.warn(`${logId}: Copying profile key from old to new contact`);
          const profileKey = obsolete.get("profileKey");
          if (profileKey) {
            await current.setProfileKey(profileKey);
          }
        }
        log.warn(`${logId}: Delete all sessions tied to old conversationId`);
        const ourACI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI);
        const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI);
        await Promise.all([ourACI, ourPNI].map(async (ourUuid) => {
          if (!ourUuid) {
            return;
          }
          const deviceIds = await window.textsecure.storage.protocol.getDeviceIds({
            ourUuid,
            identifier: obsoleteUuid.toString()
          });
          await Promise.all(deviceIds.map(async (deviceId) => {
            const addr = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(obsoleteUuid, deviceId));
            await window.textsecure.storage.protocol.removeSession(addr);
          }));
        }));
        log.warn(`${logId}: Delete all identity information tied to old conversationId`);
        if (obsoleteUuid) {
          await window.textsecure.storage.protocol.removeIdentityKey(obsoleteUuid);
        }
        log.warn(`${logId}: Ensure that all V1 groups have new conversationId instead of old`);
        const groups = await this.getAllGroupsInvolvingUuid(obsoleteUuid);
        groups.forEach((group) => {
          const members = group.get("members");
          const withoutObsolete = (0, import_lodash.without)(members, obsoleteId);
          const currentAdded = (0, import_lodash.uniq)([...withoutObsolete, currentId]);
          group.set({
            members: currentAdded
          });
          updateConversation(group.attributes);
        });
      }
      log.warn(`${logId}: Delete the obsolete conversation from the database`);
      await removeConversation(obsoleteId);
      log.warn(`${logId}: Update cached messages in MessageController`);
      window.MessageController.update((message) => {
        if (message.get("conversationId") === obsoleteId) {
          message.set({ conversationId: currentId });
        }
      });
      log.warn(`${logId}: Update messages table`);
      await migrateConversationMessages(obsoleteId, currentId);
      log.warn(`${logId}: Emit refreshConversation event to close old/open new`);
      window.Whisper.events.trigger("refreshConversation", {
        newId: currentId,
        oldId: obsoleteId
      });
      log.warn(`${logId}: Eliminate old conversation from ConversationController lookups`);
      this._conversations.remove(obsolete);
      this._conversations.resetLookups();
      current.captureChange("combineConversations");
      log.warn(`${logId}: Complete!`);
    });
  }
  ensureGroup(groupId, additionalInitProps = {}) {
    return this.getOrCreate(groupId, "group", additionalInitProps).get("id");
  }
  async getConversationForTargetMessage(targetFromId, targetTimestamp) {
    const messages = await getMessagesBySentAt(targetTimestamp);
    const targetMessage = messages.find((m) => (0, import_helpers.getContactId)(m) === targetFromId);
    if (targetMessage) {
      return this.get(targetMessage.conversationId);
    }
    return null;
  }
  async getAllGroupsInvolvingUuid(uuid) {
    const groups = await getAllGroupsInvolvingUuid(uuid.toString());
    return groups.map((group) => {
      const existing = this.get(group.id);
      if (existing) {
        return existing;
      }
      return this._conversations.add(group);
    });
  }
  getByDerivedGroupV2Id(groupId) {
    return this._conversations.find((item) => item.get("derivedGroupV2Id") === groupId);
  }
  reset() {
    delete this._initialPromise;
    this._initialFetchComplete = false;
    this._conversations.reset([]);
  }
  load() {
    this._initialPromise || (this._initialPromise = this.doLoad());
    return this._initialPromise;
  }
  async forceRerender(identifiers) {
    let count = 0;
    const conversations = identifiers ? identifiers.map((identifier) => this.get(identifier)).filter(import_isNotNil.isNotNil) : this._conversations.models.slice();
    log.info(`forceRerender: Starting to loop through ${conversations.length} conversations`);
    for (let i = 0, max = conversations.length; i < max; i += 1) {
      const conversation = conversations[i];
      if (conversation.cachedProps) {
        conversation.oldCachedProps = conversation.cachedProps;
        conversation.cachedProps = null;
        conversation.trigger("props-change", conversation, false);
        count += 1;
      }
      if (count % 10 === 0) {
        await (0, import_sleep.sleep)(300);
      }
    }
    log.info(`forceRerender: Updated ${count} conversations`);
  }
  onConvoOpenStart(conversationId) {
    this._conversationOpenStart.set(conversationId, Date.now());
  }
  onConvoMessageMount(conversationId) {
    const loadStart = this._conversationOpenStart.get(conversationId);
    if (loadStart === void 0) {
      return;
    }
    this._conversationOpenStart.delete(conversationId);
    this.get(conversationId)?.onOpenComplete(loadStart);
  }
  repairPinnedConversations() {
    const pinnedIds = window.storage.get("pinnedConversationIds", []);
    for (const id of pinnedIds) {
      const convo = this.get(id);
      if (!convo || convo.get("isPinned")) {
        continue;
      }
      log.warn(`ConversationController: Repairing ${convo.idForLogging()}'s isPinned`);
      convo.set("isPinned", true);
      window.Signal.Data.updateConversation(convo.attributes);
    }
  }
  async doLoad() {
    log.info("ConversationController: starting initial fetch");
    if (this._conversations.length) {
      throw new Error("ConversationController: Already loaded!");
    }
    try {
      const collection = await getAllConversations();
      const temporaryConversations = collection.filter((conversation) => Boolean(conversation.isTemporary));
      if (temporaryConversations.length) {
        log.warn(`ConversationController: Removing ${temporaryConversations.length} temporary conversations`);
      }
      const queue = new import_p_queue.default({
        concurrency: 3,
        timeout: import_durations.MINUTE * 30,
        throwOnTimeout: true
      });
      queue.addAll(temporaryConversations.map((item) => async () => {
        await removeConversation(item.id);
      }));
      await queue.onIdle();
      this._conversations.add(collection.filter((conversation) => !conversation.isTemporary));
      this._initialFetchComplete = true;
      await Promise.all(this._conversations.map(async (conversation) => {
        try {
          conversation.fetchContacts();
          const isChanged = (0, import_groups.maybeDeriveGroupV2Id)(conversation);
          if (isChanged) {
            updateConversation(conversation.attributes);
          }
          const draft = conversation.get("draft");
          if (draft && draft.length > MAX_MESSAGE_BODY_LENGTH) {
            conversation.set({
              draft: draft.slice(0, MAX_MESSAGE_BODY_LENGTH)
            });
            updateConversation(conversation.attributes);
          }
          const e164 = conversation.get("e164");
          const uuid = conversation.get("uuid");
          if ((0, import_UUID.isValidUuid)(e164) && uuid) {
            conversation.set({ e164: void 0 });
            updateConversation(conversation.attributes);
            log.info(`Cleaning up conversation(${uuid}) with invalid e164`);
          }
        } catch (error) {
          log.error("ConversationController.load/map: Failed to prepare a conversation", error && error.stack ? error.stack : error);
        }
      }));
      log.info("ConversationController: done with initial fetch");
    } catch (error) {
      log.error("ConversationController: initial fetch failed", error && error.stack ? error.stack : error);
      throw error;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationController,
  start
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uQ29udHJvbGxlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGRlYm91bmNlLCBwaWNrLCB1bmlxLCB3aXRob3V0IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQUXVldWUgZnJvbSAncC1xdWV1ZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQ29udmVyc2F0aW9uTW9kZWxDb2xsZWN0aW9uVHlwZSxcbiAgQ29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGUsXG4gIENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlVHlwZSxcbn0gZnJvbSAnLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uTW9kZWwgfSBmcm9tICcuL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi9tb2RlbHMvbWVzc2FnZXMnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5cbmltcG9ydCBkYXRhSW50ZXJmYWNlIGZyb20gJy4vc3FsL0NsaWVudCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi90eXBlcy9lcnJvcnMnO1xuaW1wb3J0IHsgZ2V0Q29udGFjdElkIH0gZnJvbSAnLi9tZXNzYWdlcy9oZWxwZXJzJztcbmltcG9ydCB7IG1heWJlRGVyaXZlR3JvdXBWMklkIH0gZnJvbSAnLi9ncm91cHMnO1xuaW1wb3J0IHsgYXNzZXJ0LCBzdHJpY3RBc3NlcnQgfSBmcm9tICcuL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IGlzR3JvdXBWMSwgaXNHcm91cFYyIH0gZnJvbSAnLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgZ2V0Q29udmVyc2F0aW9uVW5yZWFkQ291bnRGb3JBcHBCYWRnZSB9IGZyb20gJy4vdXRpbC9nZXRDb252ZXJzYXRpb25VbnJlYWRDb3VudEZvckFwcEJhZGdlJztcbmltcG9ydCB7IFVVSUQsIGlzVmFsaWRVdWlkLCBVVUlES2luZCB9IGZyb20gJy4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSAnLi90eXBlcy9BZGRyZXNzJztcbmltcG9ydCB7IFF1YWxpZmllZEFkZHJlc3MgfSBmcm9tICcuL3R5cGVzL1F1YWxpZmllZEFkZHJlc3MnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuL3V0aWwvc2xlZXAnO1xuaW1wb3J0IHsgaXNOb3ROaWwgfSBmcm9tICcuL3V0aWwvaXNOb3ROaWwnO1xuaW1wb3J0IHsgTUlOVVRFLCBTRUNPTkQgfSBmcm9tICcuL3V0aWwvZHVyYXRpb25zJztcblxudHlwZSBDb252b01hdGNoVHlwZSA9XG4gIHwge1xuICAgICAga2V5OiAndXVpZCcgfCAncG5pJztcbiAgICAgIHZhbHVlOiBVVUlEU3RyaW5nVHlwZSB8IHVuZGVmaW5lZDtcbiAgICAgIG1hdGNoOiBDb252ZXJzYXRpb25Nb2RlbCB8IHVuZGVmaW5lZDtcbiAgICB9XG4gIHwge1xuICAgICAga2V5OiAnZTE2NCc7XG4gICAgICB2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgbWF0Y2g6IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkO1xuICAgIH07XG5cbmNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIGFwcGx5Q2hhbmdlVG9Db252ZXJzYXRpb24oXG4gIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwsXG4gIHN1Z2dlc3RlZENoYW5nZTogUGFydGlhbDxcbiAgICBQaWNrPENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlLCAndXVpZCcgfCAnZTE2NCcgfCAncG5pJz5cbiAgPlxuKSB7XG4gIGNvbnN0IGNoYW5nZSA9IHsgLi4uc3VnZ2VzdGVkQ2hhbmdlIH07XG5cbiAgLy8gQ2xlYXIgUE5JIGlmIGNoYW5naW5nIGUxNjQgd2l0aG91dCBhc3NvY2lhdGVkIFBOSVxuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2UsICdlMTY0JykgJiYgIWNoYW5nZS5wbmkpIHtcbiAgICBjaGFuZ2UucG5pID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gSWYgd2UgaGF2ZSBhIFBOSSBidXQgbm90IGFuIEFDSSwgdGhlbiB0aGUgUE5JIHdpbGwgZ28gaW4gdGhlIFVVSUQgZmllbGRcbiAgLy8gICBUcmlja3k6IFdlIG5lZWQgYSBzcGVjaWFsIGNoZWNrIGhlcmUsIGJlY2F1c2UgdGhlIFBOSSBjYW4gYmUgaW4gdGhlIHV1aWQgc2xvdFxuICBpZiAoXG4gICAgY2hhbmdlLnBuaSAmJlxuICAgICFjaGFuZ2UudXVpZCAmJlxuICAgICghY29udmVyc2F0aW9uLmdldCgndXVpZCcpIHx8XG4gICAgICBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJykgPT09IGNvbnZlcnNhdGlvbi5nZXQoJ3BuaScpKVxuICApIHtcbiAgICBjaGFuZ2UudXVpZCA9IGNoYW5nZS5wbmk7XG4gIH1cblxuICAvLyBJZiB3ZSdyZSBjbGVhcmluZyBhIFBOSSwgYnV0IHdlIGRpZG4ndCBoYXZlIGFuIEFDSSAtIHdlIG5lZWQgdG8gY2xlYXIgVVVJRCBmaWVsZFxuICBpZiAoXG4gICAgIWNoYW5nZS51dWlkICYmXG4gICAgaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2UsICdwbmknKSAmJlxuICAgICFjaGFuZ2UucG5pICYmXG4gICAgY29udmVyc2F0aW9uLmdldCgndXVpZCcpID09PSBjb252ZXJzYXRpb24uZ2V0KCdwbmknKVxuICApIHtcbiAgICBjaGFuZ2UudXVpZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNoYW5nZSwgJ3V1aWQnKSkge1xuICAgIGNvbnZlcnNhdGlvbi51cGRhdGVVdWlkKGNoYW5nZS51dWlkKTtcbiAgfVxuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2UsICdlMTY0JykpIHtcbiAgICBjb252ZXJzYXRpb24udXBkYXRlRTE2NChjaGFuZ2UuZTE2NCk7XG4gIH1cbiAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlLCAncG5pJykpIHtcbiAgICBjb252ZXJzYXRpb24udXBkYXRlUG5pKGNoYW5nZS5wbmkpO1xuICB9XG5cbiAgLy8gTm90ZTogd2UgZG9uJ3QgZG8gYSBjb252ZXJzYXRpb24uc2V0IGhlcmUsIGJlY2F1c2UgY2hhbmdlIGlzIGxpbWl0ZWQgdG8gdGhlc2UgZmllbGRzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhZmVDb21iaW5lQ29udmVyc2F0aW9ucyh7XG4gIGxvZ0lkLFxuICBvbGRDb252ZXJzYXRpb24sXG4gIG5ld0NvbnZlcnNhdGlvbixcbn06IHtcbiAgbG9nSWQ6IHN0cmluZztcbiAgb2xkQ29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbDtcbiAgbmV3Q29udmVyc2F0aW9uOiBDb252ZXJzYXRpb25Nb2RlbDtcbn0pIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5jb21iaW5lQ29udmVyc2F0aW9ucyhcbiAgICAgIG5ld0NvbnZlcnNhdGlvbixcbiAgICAgIG9sZENvbnZlcnNhdGlvblxuICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nLndhcm4oXG4gICAgICBgJHtsb2dJZH06IGVycm9yIGNvbWJpbmluZyBjb250YWN0czogJHtFcnJvcnMudG9Mb2dGb3JtYXQoZXJyb3IpfWBcbiAgICApO1xuICB9XG59XG5cbmNvbnN0IE1BWF9NRVNTQUdFX0JPRFlfTEVOR1RIID0gNjQgKiAxMDI0O1xuXG5jb25zdCB7XG4gIGdldEFsbENvbnZlcnNhdGlvbnMsXG4gIGdldEFsbEdyb3Vwc0ludm9sdmluZ1V1aWQsXG4gIGdldE1lc3NhZ2VzQnlTZW50QXQsXG4gIG1pZ3JhdGVDb252ZXJzYXRpb25NZXNzYWdlcyxcbiAgcmVtb3ZlQ29udmVyc2F0aW9uLFxuICBzYXZlQ29udmVyc2F0aW9uLFxuICB1cGRhdGVDb252ZXJzYXRpb24sXG59ID0gZGF0YUludGVyZmFjZTtcblxuLy8gV2UgaGF2ZSB0byBydW4gdGhpcyBpbiBiYWNrZ3JvdW5kLmpzLCBhZnRlciBhbGwgYmFja2JvbmUgbW9kZWxzIGFuZCBjb2xsZWN0aW9ucyBvblxuLy8gICBXaGlzcGVyLiogaGF2ZSBiZWVuIGNyZWF0ZWQuIE9uY2UgdGhvc2UgYXJlIGluIHR5cGVzY3JpcHQgd2UgY2FuIHVzZSBtb3JlIHJlYXNvbmFibGVcbi8vICAgcmVxdWlyZSBzdGF0ZW1lbnRzIGZvciByZWZlcmVuY2luZyB0aGVzZSB0aGluZ3MsIGdpdmluZyB1cyBtb3JlIGZsZXhpYmlsaXR5IGhlcmUuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoKTogdm9pZCB7XG4gIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSBuZXcgd2luZG93LldoaXNwZXIuQ29udmVyc2F0aW9uQ29sbGVjdGlvbigpO1xuXG4gIHdpbmRvdy5nZXRDb252ZXJzYXRpb25zID0gKCkgPT4gY29udmVyc2F0aW9ucztcbiAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIgPSBuZXcgQ29udmVyc2F0aW9uQ29udHJvbGxlcihjb252ZXJzYXRpb25zKTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnZlcnNhdGlvbkNvbnRyb2xsZXIge1xuICBwcml2YXRlIF9pbml0aWFsRmV0Y2hDb21wbGV0ZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2luaXRpYWxQcm9taXNlOiB1bmRlZmluZWQgfCBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgX2NvbnZlcnNhdGlvbk9wZW5TdGFydCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG5cbiAgcHJpdmF0ZSBfaGFzUXVldWVFbXB0aWVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfY29tYmluZUNvbnZlcnNhdGlvbnNRdWV1ZSA9IG5ldyBQUXVldWUoeyBjb25jdXJyZW5jeTogMSB9KTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb252ZXJzYXRpb25zOiBDb252ZXJzYXRpb25Nb2RlbENvbGxlY3Rpb25UeXBlKSB7XG4gICAgY29uc3QgZGVib3VuY2VkVXBkYXRlVW5yZWFkQ291bnQgPSBkZWJvdW5jZShcbiAgICAgIHRoaXMudXBkYXRlVW5yZWFkQ291bnQuYmluZCh0aGlzKSxcbiAgICAgIFNFQ09ORCxcbiAgICAgIHtcbiAgICAgICAgbGVhZGluZzogdHJ1ZSxcbiAgICAgICAgbWF4V2FpdDogU0VDT05ELFxuICAgICAgICB0cmFpbGluZzogdHJ1ZSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gQSBmZXcgdGhpbmdzIGNhbiBjYXVzZSB1cyB0byB1cGRhdGUgdGhlIGFwcC1sZXZlbCB1bnJlYWQgY291bnRcbiAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMub24oJ3VwZGF0ZVVucmVhZENvdW50JywgZGVib3VuY2VkVXBkYXRlVW5yZWFkQ291bnQpO1xuICAgIHRoaXMuX2NvbnZlcnNhdGlvbnMub24oXG4gICAgICAnYWRkIHJlbW92ZSBjaGFuZ2U6YWN0aXZlX2F0IGNoYW5nZTp1bnJlYWRDb3VudCBjaGFuZ2U6bWFya2VkVW5yZWFkIGNoYW5nZTppc0FyY2hpdmVkIGNoYW5nZTptdXRlRXhwaXJlc0F0JyxcbiAgICAgIGRlYm91bmNlZFVwZGF0ZVVucmVhZENvdW50XG4gICAgKTtcblxuICAgIC8vIElmIHRoZSBjb252ZXJzYXRpb24gaXMgbXV0ZWQgd2Ugc2V0IGEgdGltZW91dCBzbyB3aGVuIHRoZSBtdXRlIGV4cGlyZXNcbiAgICAvLyB3ZSBjYW4gcmVzZXQgdGhlIG11dGUgc3RhdGUgb24gdGhlIG1vZGVsLiBJZiB0aGUgbXV0ZSBoYXMgYWxyZWFkeSBleHBpcmVkXG4gICAgLy8gdGhlbiB3ZSByZXNldCB0aGUgc3RhdGUgcmlnaHQgYXdheS5cbiAgICB0aGlzLl9jb252ZXJzYXRpb25zLm9uKCdhZGQnLCAobW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsKTogdm9pZCA9PiB7XG4gICAgICBtb2RlbC5zdGFydE11dGVUaW1lcigpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlVW5yZWFkQ291bnQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9oYXNRdWV1ZUVtcHRpZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjYW5Db3VudE11dGVkQ29udmVyc2F0aW9ucyA9XG4gICAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ2JhZGdlLWNvdW50LW11dGVkLWNvbnZlcnNhdGlvbnMnKSB8fCBmYWxzZTtcblxuICAgIGNvbnN0IG5ld1VucmVhZENvdW50ID0gdGhpcy5fY29udmVyc2F0aW9ucy5yZWR1Y2UoXG4gICAgICAocmVzdWx0OiBudW1iZXIsIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwpID0+XG4gICAgICAgIHJlc3VsdCArXG4gICAgICAgIGdldENvbnZlcnNhdGlvblVucmVhZENvdW50Rm9yQXBwQmFkZ2UoXG4gICAgICAgICAgY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgY2FuQ291bnRNdXRlZENvbnZlcnNhdGlvbnNcbiAgICAgICAgKSxcbiAgICAgIDBcbiAgICApO1xuICAgIHdpbmRvdy5zdG9yYWdlLnB1dCgndW5yZWFkQ291bnQnLCBuZXdVbnJlYWRDb3VudCk7XG5cbiAgICBpZiAobmV3VW5yZWFkQ291bnQgPiAwKSB7XG4gICAgICB3aW5kb3cuc2V0QmFkZ2VDb3VudChuZXdVbnJlYWRDb3VudCk7XG4gICAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSBgJHt3aW5kb3cuZ2V0VGl0bGUoKX0gKCR7bmV3VW5yZWFkQ291bnR9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5zZXRCYWRnZUNvdW50KDApO1xuICAgICAgd2luZG93LmRvY3VtZW50LnRpdGxlID0gd2luZG93LmdldFRpdGxlKCk7XG4gICAgfVxuICAgIHdpbmRvdy51cGRhdGVUcmF5SWNvbihuZXdVbnJlYWRDb3VudCk7XG4gIH1cblxuICBvbkVtcHR5KCk6IHZvaWQge1xuICAgIHRoaXMuX2hhc1F1ZXVlRW1wdGllZCA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVVbnJlYWRDb3VudCgpO1xuICB9XG5cbiAgZ2V0KGlkPzogc3RyaW5nIHwgbnVsbCk6IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX2luaXRpYWxGZXRjaENvbXBsZXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDb252ZXJzYXRpb25Db250cm9sbGVyLmdldCgpIG5lZWRzIGNvbXBsZXRlIGluaXRpYWwgZmV0Y2gnXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gdGFrZXMgbnVsbCBqdXN0IGZpbmUuIEJhY2tib25lIHR5cGluZ3MgYXJlIHRvbyByZXN0cmljdGl2ZS5cbiAgICByZXR1cm4gdGhpcy5fY29udmVyc2F0aW9ucy5nZXQoaWQgYXMgc3RyaW5nKTtcbiAgfVxuXG4gIGdldEFsbCgpOiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4ge1xuICAgIHJldHVybiB0aGlzLl9jb252ZXJzYXRpb25zLm1vZGVscztcbiAgfVxuXG4gIGRhbmdlcm91c2x5Q3JlYXRlQW5kQWRkKFxuICAgIGF0dHJpYnV0ZXM6IFBhcnRpYWw8Q29udmVyc2F0aW9uQXR0cmlidXRlc1R5cGU+XG4gICk6IENvbnZlcnNhdGlvbk1vZGVsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udmVyc2F0aW9ucy5hZGQoYXR0cmlidXRlcyk7XG4gIH1cblxuICBkYW5nZXJvdXNseVJlbW92ZUJ5SWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnZlcnNhdGlvbnMucmVtb3ZlKGlkKTtcbiAgICB0aGlzLl9jb252ZXJzYXRpb25zLnJlc2V0TG9va3VwcygpO1xuICB9XG5cbiAgZ2V0T3JDcmVhdGUoXG4gICAgaWRlbnRpZmllcjogc3RyaW5nIHwgbnVsbCxcbiAgICB0eXBlOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVR5cGUsXG4gICAgYWRkaXRpb25hbEluaXRpYWxQcm9wcyA9IHt9XG4gICk6IENvbnZlcnNhdGlvbk1vZGVsIHtcbiAgICBpZiAodHlwZW9mIGlkZW50aWZpZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ2lkJyBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlICE9PSAncHJpdmF0ZScgJiYgdHlwZSAhPT0gJ2dyb3VwJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYCd0eXBlJyBtdXN0IGJlICdwcml2YXRlJyBvciAnZ3JvdXAnOyBnb3Q6ICcke3R5cGV9J2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9pbml0aWFsRmV0Y2hDb21wbGV0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoKSBuZWVkcyBjb21wbGV0ZSBpbml0aWFsIGZldGNoJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgY29udmVyc2F0aW9uID0gdGhpcy5fY29udmVyc2F0aW9ucy5nZXQoaWRlbnRpZmllcik7XG4gICAgaWYgKGNvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIGNvbnZlcnNhdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuXG4gICAgaWYgKHR5cGUgPT09ICdncm91cCcpIHtcbiAgICAgIGNvbnZlcnNhdGlvbiA9IHRoaXMuX2NvbnZlcnNhdGlvbnMuYWRkKHtcbiAgICAgICAgaWQsXG4gICAgICAgIHV1aWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZTE2NDogdW5kZWZpbmVkLFxuICAgICAgICBncm91cElkOiBpZGVudGlmaWVyLFxuICAgICAgICB0eXBlLFxuICAgICAgICB2ZXJzaW9uOiAyLFxuICAgICAgICAuLi5hZGRpdGlvbmFsSW5pdGlhbFByb3BzLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc1ZhbGlkVXVpZChpZGVudGlmaWVyKSkge1xuICAgICAgY29udmVyc2F0aW9uID0gdGhpcy5fY29udmVyc2F0aW9ucy5hZGQoe1xuICAgICAgICBpZCxcbiAgICAgICAgdXVpZDogaWRlbnRpZmllcixcbiAgICAgICAgZTE2NDogdW5kZWZpbmVkLFxuICAgICAgICBncm91cElkOiB1bmRlZmluZWQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZlcnNpb246IDIsXG4gICAgICAgIC4uLmFkZGl0aW9uYWxJbml0aWFsUHJvcHMsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udmVyc2F0aW9uID0gdGhpcy5fY29udmVyc2F0aW9ucy5hZGQoe1xuICAgICAgICBpZCxcbiAgICAgICAgdXVpZDogdW5kZWZpbmVkLFxuICAgICAgICBlMTY0OiBpZGVudGlmaWVyLFxuICAgICAgICBncm91cElkOiB1bmRlZmluZWQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZlcnNpb246IDIsXG4gICAgICAgIC4uLmFkZGl0aW9uYWxJbml0aWFsUHJvcHMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWNvbnZlcnNhdGlvbi5pc1ZhbGlkKCkpIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbkVycm9yID0gY29udmVyc2F0aW9uLnZhbGlkYXRpb25FcnJvciB8fCB7fTtcbiAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICdDb250YWN0IGlzIG5vdCB2YWxpZC4gTm90IHNhdmluZywgYnV0IGFkZGluZyB0byBjb2xsZWN0aW9uOicsXG4gICAgICAgICAgY29udmVyc2F0aW9uLmlkRm9yTG9nZ2luZygpLFxuICAgICAgICAgIHZhbGlkYXRpb25FcnJvci5zdGFja1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0dyb3VwVjEoY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgbWF5YmVEZXJpdmVHcm91cFYySWQoY29udmVyc2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBzYXZlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAnQ29udmVyc2F0aW9uIHNhdmUgZmFpbGVkISAnLFxuICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICAnRXJyb3I6JyxcbiAgICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gICAgfTtcblxuICAgIGNvbnZlcnNhdGlvbi5pbml0aWFsUHJvbWlzZSA9IGNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbjtcbiAgfVxuXG4gIGFzeW5jIGdldE9yQ3JlYXRlQW5kV2FpdChcbiAgICBpZDogc3RyaW5nIHwgbnVsbCxcbiAgICB0eXBlOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVR5cGUsXG4gICAgYWRkaXRpb25hbEluaXRpYWxQcm9wcyA9IHt9XG4gICk6IFByb21pc2U8Q29udmVyc2F0aW9uTW9kZWw+IHtcbiAgICBhd2FpdCB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB0aGlzLmdldE9yQ3JlYXRlKGlkLCB0eXBlLCBhZGRpdGlvbmFsSW5pdGlhbFByb3BzKTtcblxuICAgIGlmIChjb252ZXJzYXRpb24pIHtcbiAgICAgIGF3YWl0IGNvbnZlcnNhdGlvbi5pbml0aWFsUHJvbWlzZTtcbiAgICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdnZXRPckNyZWF0ZUFuZFdhaXQ6IGRpZCBub3QgZ2V0IGNvbnZlcnNhdGlvbicpO1xuICB9XG5cbiAgZ2V0Q29udmVyc2F0aW9uSWQoYWRkcmVzczogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICghYWRkcmVzcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgW2lkXSA9IHdpbmRvdy50ZXh0c2VjdXJlLnV0aWxzLnVuZW5jb2RlTnVtYmVyKGFkZHJlc3MpO1xuICAgIGNvbnN0IGNvbnYgPSB0aGlzLmdldChpZCk7XG5cbiAgICBpZiAoY29udikge1xuICAgICAgcmV0dXJuIGNvbnYuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBlMTY0ID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IGFjaSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlclxuICAgICAgLmdldFV1aWQoVVVJREtpbmQuQUNJKVxuICAgICAgPy50b1N0cmluZygpO1xuICAgIGNvbnN0IHBuaSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlclxuICAgICAgLmdldFV1aWQoVVVJREtpbmQuUE5JKVxuICAgICAgPy50b1N0cmluZygpO1xuXG4gICAgaWYgKCFlMTY0ICYmICFhY2kgJiYgIXBuaSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB0aGlzLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICBhY2ksXG4gICAgICBlMTY0LFxuICAgICAgcG5pLFxuICAgICAgcmVhc29uOiAnZ2V0T3VyQ29udmVyc2F0aW9uSWQnLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbj8uaWQ7XG4gIH1cblxuICBnZXRPdXJDb252ZXJzYXRpb25JZE9yVGhyb3coKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHRoaXMuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdnZXRPdXJDb252ZXJzYXRpb25JZE9yVGhyb3c6IEZhaWxlZCB0byBmZXRjaCBvdXJDb252ZXJzYXRpb25JZCdcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjb252ZXJzYXRpb25JZDtcbiAgfVxuXG4gIGdldE91ckNvbnZlcnNhdGlvbigpOiBDb252ZXJzYXRpb25Nb2RlbCB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uSWQgPSB0aGlzLmdldE91ckNvbnZlcnNhdGlvbklkKCk7XG4gICAgcmV0dXJuIGNvbnZlcnNhdGlvbklkID8gdGhpcy5nZXQoY29udmVyc2F0aW9uSWQpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0T3VyQ29udmVyc2F0aW9uT3JUaHJvdygpOiBDb252ZXJzYXRpb25Nb2RlbCB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gdGhpcy5nZXRPdXJDb252ZXJzYXRpb24oKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnZ2V0T3VyQ29udmVyc2F0aW9uT3JUaHJvdzogRmFpbGVkIHRvIGZldGNoIG91ciBvd24gY29udmVyc2F0aW9uJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVyc2F0aW9uO1xuICB9XG5cbiAgYXJlV2VQcmltYXJ5RGV2aWNlKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG91ckRldmljZUlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldERldmljZUlkKCk7XG5cbiAgICByZXR1cm4gb3VyRGV2aWNlSWQgPT09IDE7XG4gIH1cblxuICAvLyBOb3RlOiBJZiB5b3UgZG9uJ3Qga25vdyB3aGF0IGtpbmQgb2YgVVVJRCBpdCBpcywgcHV0IGl0IGluIHRoZSAnYWNpJyBwYXJhbS5cbiAgbWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICBhY2k6IHByb3ZpZGVkQWNpLFxuICAgIGUxNjQsXG4gICAgcG5pOiBwcm92aWRlZFBuaSxcbiAgICByZWFzb24sXG4gICAgbWVyZ2VPbGRBbmROZXcgPSBzYWZlQ29tYmluZUNvbnZlcnNhdGlvbnMsXG4gIH06IHtcbiAgICBhY2k/OiBzdHJpbmc7XG4gICAgZTE2ND86IHN0cmluZztcbiAgICBwbmk/OiBzdHJpbmc7XG4gICAgcmVhc29uOiBzdHJpbmc7XG4gICAgcmVjdXJzaW9uQ291bnQ/OiBudW1iZXI7XG4gICAgbWVyZ2VPbGRBbmROZXc/OiAob3B0aW9uczoge1xuICAgICAgbG9nSWQ6IHN0cmluZztcbiAgICAgIG9sZENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWw7XG4gICAgICBuZXdDb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsO1xuICAgIH0pID0+IFByb21pc2U8dm9pZD47XG4gIH0pOiBDb252ZXJzYXRpb25Nb2RlbCB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZGF0YVByb3ZpZGVkID0gW107XG4gICAgaWYgKHByb3ZpZGVkQWNpKSB7XG4gICAgICBkYXRhUHJvdmlkZWQucHVzaCgnYWNpJyk7XG4gICAgfVxuICAgIGlmIChlMTY0KSB7XG4gICAgICBkYXRhUHJvdmlkZWQucHVzaCgnZTE2NCcpO1xuICAgIH1cbiAgICBpZiAocHJvdmlkZWRQbmkpIHtcbiAgICAgIGRhdGFQcm92aWRlZC5wdXNoKCdwbmknKTtcbiAgICB9XG4gICAgY29uc3QgbG9nSWQgPSBgbWF5YmVNZXJnZUNvbnRhY3RzLyR7cmVhc29ufS8ke2RhdGFQcm92aWRlZC5qb2luKCcrJyl9YDtcblxuICAgIGNvbnN0IGFjaSA9IHByb3ZpZGVkQWNpID8gVVVJRC5jYXN0KHByb3ZpZGVkQWNpKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwbmkgPSBwcm92aWRlZFBuaSA/IFVVSUQuY2FzdChwcm92aWRlZFBuaSkgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWFjaSAmJiAhZTE2NCAmJiAhcG5pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke2xvZ0lkfTogTmVlZCB0byBwcm92aWRlIGF0IGxlYXN0IG9uZSBvZjogYWNpLCBlMTY0LCBwbmlgXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBhY2kgfHwgZTE2NCB8fCBwbmk7XG4gICAgc3RyaWN0QXNzZXJ0KGlkZW50aWZpZXIsIGAke2xvZ0lkfTogaWRlbnRpZmllciBtdXN0IGJlIHRydXRoeSFgKTtcblxuICAgIGNvbnN0IG1hdGNoZXM6IEFycmF5PENvbnZvTWF0Y2hUeXBlPiA9IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiAndXVpZCcsXG4gICAgICAgIHZhbHVlOiBhY2ksXG4gICAgICAgIG1hdGNoOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoYWNpKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2UxNjQnLFxuICAgICAgICB2YWx1ZTogZTE2NCxcbiAgICAgICAgbWF0Y2g6IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChlMTY0KSxcbiAgICAgIH0sXG4gICAgICB7IGtleTogJ3BuaScsIHZhbHVlOiBwbmksIG1hdGNoOiB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQocG5pKSB9LFxuICAgIF07XG4gICAgbGV0IHVudXNlZE1hdGNoZXM6IEFycmF5PENvbnZvTWF0Y2hUeXBlPiA9IFtdO1xuXG4gICAgbGV0IHRhcmdldENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQ7XG4gICAgbGV0IG1hdGNoQ291bnQgPSAwO1xuICAgIG1hdGNoZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgbWF0Y2ggfSA9IGl0ZW07XG5cbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIGlmICh0YXJnZXRDb252ZXJzYXRpb24pIHtcbiAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgIGAke2xvZ0lkfTogTm8gbWF0Y2ggZm9yICR7a2V5fSwgYXBwbHlpbmcgdG8gdGFyZ2V0IGNvbnZlcnNhdGlvbmBcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIE5vdGU6IFRoaXMgbGluZSBtaWdodCBlcmFzZSBhIGtub3duIGUxNjQgb3IgUE5JXG4gICAgICAgICAgYXBwbHlDaGFuZ2VUb0NvbnZlcnNhdGlvbih0YXJnZXRDb252ZXJzYXRpb24sIHtcbiAgICAgICAgICAgIFtrZXldOiB2YWx1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bnVzZWRNYXRjaGVzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtYXRjaENvdW50ICs9IDE7XG4gICAgICB1bnVzZWRNYXRjaGVzLmZvckVhY2godW51c2VkID0+IHtcbiAgICAgICAgc3RyaWN0QXNzZXJ0KHVudXNlZC52YWx1ZSwgJ0FuIHVudXNlZCB2YWx1ZSBzaG91bGQgYWx3YXlzIGJlIHRydXRoeScpO1xuXG4gICAgICAgIC8vIEV4YW1wbGU6IElmIHdlIGZpbmQgdGhhdCBvdXIgUE5JIG1hdGNoIGhhcyBubyBBQ0ksIHRoZW4gaXQgd2lsbCBiZSBvdXIgdGFyZ2V0LlxuICAgICAgICAvLyAgIFRyaWNreTogUE5JIGNhbiBlbmQgdXAgaW4gVVVJRCBzbG90LCBzbyB3ZSBuZWVkIHRvIHNwZWNpYWwtY2FzZSBpdFxuICAgICAgICBpZiAoXG4gICAgICAgICAgIXRhcmdldENvbnZlcnNhdGlvbiAmJlxuICAgICAgICAgICghbWF0Y2guZ2V0KHVudXNlZC5rZXkpIHx8XG4gICAgICAgICAgICAodW51c2VkLmtleSA9PT0gJ3V1aWQnICYmIG1hdGNoLmdldCh1bnVzZWQua2V5KSA9PT0gcG5pKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgICBgJHtsb2dJZH06IE1hdGNoIG9uICR7a2V5fSBkb2VzIG5vdCBoYXZlICR7dW51c2VkLmtleX0sIGAgK1xuICAgICAgICAgICAgICBgc28gaXQgd2lsbCBiZSBvdXIgdGFyZ2V0IGNvbnZlcnNhdGlvbiAtICR7bWF0Y2guaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uID0gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBQTkkgbWF0Y2ggYWxyZWFkeSBoYXMgYW4gQUNJLCB0aGVuIHdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICBpZiAoIXRhcmdldENvbnZlcnNhdGlvbikge1xuICAgICAgICAgIHRhcmdldENvbnZlcnNhdGlvbiA9IHRoaXMuZ2V0T3JDcmVhdGUodW51c2VkLnZhbHVlLCAncHJpdmF0ZScpO1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgYCR7bG9nSWR9OiBNYXRjaCBvbiAke2tleX0gYWxyZWFkeSBoYWQgJHt1bnVzZWQua2V5fSwgYCArXG4gICAgICAgICAgICAgIGBzbyBjcmVhdGVkIG5ldyB0YXJnZXQgY29udmVyc2F0aW9uIC0gJHt0YXJnZXRDb252ZXJzYXRpb24uaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgJHtsb2dJZH06IEFwcGx5aW5nIG5ldyB2YWx1ZSBmb3IgJHt1bnVzZWQua2V5fSB0byB0YXJnZXQgY29udmVyc2F0aW9uYFxuICAgICAgICApO1xuICAgICAgICBhcHBseUNoYW5nZVRvQ29udmVyc2F0aW9uKHRhcmdldENvbnZlcnNhdGlvbiwge1xuICAgICAgICAgIFt1bnVzZWQua2V5XTogdW51c2VkLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB1bnVzZWRNYXRjaGVzID0gW107XG5cbiAgICAgIGlmICh0YXJnZXRDb252ZXJzYXRpb24gJiYgdGFyZ2V0Q29udmVyc2F0aW9uICE9PSBtYXRjaCkge1xuICAgICAgICAvLyBDbGVhciB0aGUgdmFsdWUgb24gdGhlIGN1cnJlbnQgbWF0Y2gsIHNpbmNlIGl0IGJlbG9uZ3Mgb24gdGFyZ2V0Q29udmVyc2F0aW9uIVxuICAgICAgICAvLyAgIE5vdGU6IHdlIG5lZWQgdG8gZG8gdGhlIHJlbW92ZSBmaXJzdCwgYmVjYXVzZSBpdCB3aWxsIGNsZWFyIHRoZSBsb29rdXAhXG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGAke2xvZ0lkfTogQ2xlYXJpbmcgJHtrZXl9IG9uIG1hdGNoLCBhbmQgYWRkaW5nIGl0IHRvIHRhcmdldCBjb252ZXJzYXRpb25gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNoYW5nZTogUGljazxcbiAgICAgICAgICBQYXJ0aWFsPENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlPixcbiAgICAgICAgICAndXVpZCcgfCAnZTE2NCcgfCAncG5pJ1xuICAgICAgICA+ID0ge1xuICAgICAgICAgIFtrZXldOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgICAgIC8vIFdoZW4gdGhlIFBOSSBpcyBiZWluZyB1c2VkIGluIHRoZSB1dWlkIGZpZWxkIGFsb25lLCB3ZSBuZWVkIHRvIGNsZWFyIGl0XG4gICAgICAgIGlmIChrZXkgPT09ICdwbmknICYmIG1hdGNoLmdldCgndXVpZCcpID09PSBwbmkpIHtcbiAgICAgICAgICBjaGFuZ2UudXVpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBhcHBseUNoYW5nZVRvQ29udmVyc2F0aW9uKG1hdGNoLCBjaGFuZ2UpO1xuXG4gICAgICAgIGFwcGx5Q2hhbmdlVG9Db252ZXJzYXRpb24odGFyZ2V0Q29udmVyc2F0aW9uLCB7XG4gICAgICAgICAgW2tleV06IHZhbHVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOb3RlOiBUaGUgUE5JIGNoZWNrIGhlcmUgaXMganVzdCB0byBiZSBidWxsZXRwcm9vZjsgaWYgd2Uga25vdyBhIFVVSUQgaXMgYSBQTkksXG4gICAgICAgIC8vICAgdGhlbiB0aGF0IHNob3VsZCBiZSBwdXQgaW4gdGhlIFVVSUQgZmllbGQgYXMgd2VsbCFcbiAgICAgICAgaWYgKCFtYXRjaC5nZXQoJ3V1aWQnKSAmJiAhbWF0Y2guZ2V0KCdlMTY0JykgJiYgIW1hdGNoLmdldCgncG5pJykpIHtcbiAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgIGAke2xvZ0lkfTogUmVtb3Zpbmcgb2xkIGNvbnZlcnNhdGlvbiB3aGljaCBtYXRjaGVkIG9uICR7a2V5fS4gYCArXG4gICAgICAgICAgICAgICdNZXJnaW5nIHdpdGggdGFyZ2V0IGNvbnZlcnNhdGlvbi4nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyh7XG4gICAgICAgICAgICBsb2dJZCxcbiAgICAgICAgICAgIG9sZENvbnZlcnNhdGlvbjogbWF0Y2gsXG4gICAgICAgICAgICBuZXdDb252ZXJzYXRpb246IHRhcmdldENvbnZlcnNhdGlvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0YXJnZXRDb252ZXJzYXRpb24gJiYgIXRhcmdldENvbnZlcnNhdGlvbj8uZ2V0KGtleSkpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBtb3N0bHkgZm9yIHRoZSBzaXR1YXRpb24gd2hlcmUgUE5JIHdhcyBlcmFzZWQgd2hlbiB1cGRhdGluZyBlMTY0XG4gICAgICAgIGxvZy5kZWJ1ZyhgJHtsb2dJZH06IFJlLWFkZGluZyAke2tleX0gb24gdGFyZ2V0IGNvbnZlcnNhdGlvbmApO1xuICAgICAgICBhcHBseUNoYW5nZVRvQ29udmVyc2F0aW9uKHRhcmdldENvbnZlcnNhdGlvbiwge1xuICAgICAgICAgIFtrZXldOiB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0Q29udmVyc2F0aW9uKSB7XG4gICAgICAgIC8vIGxvZy5kZWJ1ZyhcbiAgICAgICAgLy8gICBgJHtsb2dJZH06IE1hdGNoIG9uICR7a2V5fSBpcyB0YXJnZXQgY29udmVyc2F0aW9uIC0gJHttYXRjaC5pZEZvckxvZ2dpbmcoKX1gXG4gICAgICAgIC8vICk7XG4gICAgICAgIHRhcmdldENvbnZlcnNhdGlvbiA9IG1hdGNoO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRhcmdldENvbnZlcnNhdGlvbikge1xuICAgICAgcmV0dXJuIHRhcmdldENvbnZlcnNhdGlvbjtcbiAgICB9XG5cbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBtYXRjaENvdW50ID09PSAwLFxuICAgICAgYCR7bG9nSWR9OiBzaG91bGQgYmUgbm8gbWF0Y2hlcyBpZiBubyB0YXJnZXRDb252ZXJzYXRpb25gXG4gICAgKTtcblxuICAgIGxvZy5pbmZvKGAke2xvZ0lkfTogQ3JlYXRpbmcgYSBuZXcgY29udmVyc2F0aW9uIHdpdGggYWxsIGlucHV0c2ApO1xuICAgIHJldHVybiB0aGlzLmdldE9yQ3JlYXRlKGlkZW50aWZpZXIsICdwcml2YXRlJywgeyBlMTY0LCBwbmkgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBVVUlEIGFuZC9vciBhbiBFMTY0LCByZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgbG9jYWxcbiAgICogZGF0YWJhc2UgaWQgb2YgdGhlIGdpdmVuIGNvbnRhY3QuIFdpbGwgY3JlYXRlIGEgbmV3IGNvbnZlcnNhdGlvbiBpZiBub25lIGV4aXN0cztcbiAgICogb3RoZXJ3aXNlIHdpbGwgcmV0dXJuIHdoYXRldmVyIGlzIGZvdW5kLlxuICAgKi9cbiAgbG9va3VwT3JDcmVhdGUoe1xuICAgIGUxNjQsXG4gICAgdXVpZCxcbiAgfToge1xuICAgIGUxNjQ/OiBzdHJpbmcgfCBudWxsO1xuICAgIHV1aWQ/OiBzdHJpbmcgfCBudWxsO1xuICB9KTogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRVdWlkID0gdXVpZCA/IHV1aWQudG9Mb3dlckNhc2UoKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBpZGVudGlmaWVyID0gbm9ybWFsaXplZFV1aWQgfHwgZTE2NDtcblxuICAgIGlmICgoIWUxNjQgJiYgIXV1aWQpIHx8ICFpZGVudGlmaWVyKSB7XG4gICAgICBsb2cud2FybignbG9va3VwT3JDcmVhdGU6IENhbGxlZCB3aXRoIG5laXRoZXIgZTE2NCBub3IgdXVpZCEnKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29udm9FMTY0ID0gdGhpcy5nZXQoZTE2NCk7XG4gICAgY29uc3QgY29udm9VdWlkID0gdGhpcy5nZXQobm9ybWFsaXplZFV1aWQpO1xuXG4gICAgLy8gMS4gSGFuZGxlIG5vIG1hdGNoIGF0IGFsbFxuICAgIGlmICghY29udm9FMTY0ICYmICFjb252b1V1aWQpIHtcbiAgICAgIGxvZy5pbmZvKCdsb29rdXBPckNyZWF0ZTogQ3JlYXRpbmcgbmV3IGNvbnRhY3QsIG5vIG1hdGNoZXMgZm91bmQnKTtcbiAgICAgIGNvbnN0IG5ld0NvbnZvID0gdGhpcy5nZXRPckNyZWF0ZShpZGVudGlmaWVyLCAncHJpdmF0ZScpO1xuXG4gICAgICAvLyBgaWRlbnRpZmllcmAgd291bGQgcmVzb2x2ZSB0byB1dWlkIGlmIHdlIGhhZCBib3RoLCBzbyBmaXggdXAgZTE2NFxuICAgICAgaWYgKG5vcm1hbGl6ZWRVdWlkICYmIGUxNjQpIHtcbiAgICAgICAgbmV3Q29udm8udXBkYXRlRTE2NChlMTY0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld0NvbnZvO1xuICAgIH1cblxuICAgIC8vIDIuIEhhbmRsZSBtYXRjaCBvbiBvbmx5IFVVSURcbiAgICBpZiAoIWNvbnZvRTE2NCAmJiBjb252b1V1aWQpIHtcbiAgICAgIHJldHVybiBjb252b1V1aWQ7XG4gICAgfVxuXG4gICAgLy8gMy4gSGFuZGxlIG1hdGNoIG9uIG9ubHkgRTE2NFxuICAgIGlmIChjb252b0UxNjQgJiYgIWNvbnZvVXVpZCkge1xuICAgICAgcmV0dXJuIGNvbnZvRTE2NDtcbiAgICB9XG5cbiAgICAvLyBGb3Igc29tZSByZWFzb24sIFR5cGVTY3JpcHQgZG9lc24ndCBiZWxpZXZlIHRoYXQgd2UgY2FuIHRydXN0IHRoYXQgdGhlc2UgdHdvIHZhbHVlc1xuICAgIC8vICAgYXJlIHRydXRoeSBieSB0aGlzIHBvaW50LiBTbyB3ZSdsbCB0aHJvdyBpZiB0aGF0IGlzbid0IHRoZSBjYXNlLlxuICAgIGlmICghY29udm9FMTY0IHx8ICFjb252b1V1aWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2xvb2t1cE9yQ3JlYXRlOiBjb252b0UxNjQgb3IgY29udm9VdWlkIGFyZSBmYWxzZXkgYnV0IHNob3VsZCBib3RoIGJlIHRydWUhJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyA0LiBJZiB0aGUgdHdvIGxvb2t1cHMgYWdyZWUsIHJldHVybiB0aGF0IGNvbnZlcnNhdGlvblxuICAgIGlmIChjb252b0UxNjQgPT09IGNvbnZvVXVpZCkge1xuICAgICAgcmV0dXJuIGNvbnZvVXVpZDtcbiAgICB9XG5cbiAgICAvLyA1LiBJZiB0aGUgdHdvIGxvb2t1cHMgZGlzYWdyZWUsIGxvZyBhbmQgcmV0dXJuIHRoZSBVVUlEIG1hdGNoXG4gICAgbG9nLndhcm4oXG4gICAgICBgbG9va3VwT3JDcmVhdGU6IEZvdW5kIGEgc3BsaXQgY29udGFjdCAtIFVVSUQgJHtub3JtYWxpemVkVXVpZH0gYW5kIEUxNjQgJHtlMTY0fS4gUmV0dXJuaW5nIFVVSUQgbWF0Y2guYFxuICAgICk7XG4gICAgcmV0dXJuIGNvbnZvVXVpZDtcbiAgfVxuXG4gIGFzeW5jIGNoZWNrRm9yQ29uZmxpY3RzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdjaGVja0ZvckNvbmZsaWN0czogc3RhcnRpbmcuLi4nKTtcbiAgICBjb25zdCBieVV1aWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0IGJ5RTE2NCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgY29uc3QgYnlHcm91cFYySWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIC8vIFdlIGFsc28gd2FudCB0byBmaW5kIGR1cGxpY2F0ZSBHVjEgSURzLiBZb3UgbWlnaHQgZXhwZWN0IHRvIHNlZSBhIFwiYnlHcm91cFYxSWRcIiBtYXBcbiAgICAvLyAgIGhlcmUuIEluc3RlYWQsIHdlIGNoZWNrIGZvciBkdXBsaWNhdGVzIG9uIHRoZSBkZXJpdmVkIEdWMiBJRC5cblxuICAgIGNvbnN0IHsgbW9kZWxzIH0gPSB0aGlzLl9jb252ZXJzYXRpb25zO1xuXG4gICAgLy8gV2UgaXRlcmF0ZSBmcm9tIHRoZSBvbGRlc3QgY29udmVyc2F0aW9ucyB0byB0aGUgbmV3ZXN0LiBUaGlzIGFsbG93cyB1cywgaW4gYVxuICAgIC8vICAgY29uZmxpY3QgY2FzZSwgdG8ga2VlcCB0aGUgb25lIHdpdGggYWN0aXZpdHkgdGhlIG1vc3QgcmVjZW50bHkuXG4gICAgZm9yIChsZXQgaSA9IG1vZGVscy5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gbW9kZWxzW2ldO1xuICAgICAgYXNzZXJ0KFxuICAgICAgICBjb252ZXJzYXRpb24sXG4gICAgICAgICdFeHBlY3RlZCBjb252ZXJzYXRpb24gdG8gYmUgZm91bmQgaW4gYXJyYXkgZHVyaW5nIGl0ZXJhdGlvbidcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHV1aWQgPSBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJyk7XG4gICAgICBjb25zdCBwbmkgPSBjb252ZXJzYXRpb24uZ2V0KCdwbmknKTtcbiAgICAgIGNvbnN0IGUxNjQgPSBjb252ZXJzYXRpb24uZ2V0KCdlMTY0Jyk7XG5cbiAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYnlVdWlkW3V1aWRdO1xuICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgYnlVdWlkW3V1aWRdID0gY29udmVyc2F0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy53YXJuKGBjaGVja0ZvckNvbmZsaWN0czogRm91bmQgY29uZmxpY3Qgd2l0aCB1dWlkICR7dXVpZH1gKTtcblxuICAgICAgICAgIC8vIEtlZXAgdGhlIG5ld2VyIG9uZSBpZiBpdCBoYXMgYW4gZTE2NCwgb3RoZXJ3aXNlIGtlZXAgZXhpc3RpbmdcbiAgICAgICAgICBpZiAoY29udmVyc2F0aW9uLmdldCgnZTE2NCcpKSB7XG4gICAgICAgICAgICAvLyBLZWVwIG5ldyBvbmVcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbWJpbmVDb252ZXJzYXRpb25zKGNvbnZlcnNhdGlvbiwgZXhpc3RpbmcpO1xuICAgICAgICAgICAgYnlVdWlkW3V1aWRdID0gY29udmVyc2F0aW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBLZWVwIGV4aXN0aW5nIC0gbm90ZSB0aGF0IHRoaXMgYXBwbGllcyBpZiBuZWl0aGVyIGhhZCBhbiBlMTY0XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb21iaW5lQ29udmVyc2F0aW9ucyhleGlzdGluZywgY29udmVyc2F0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBuaSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGJ5VXVpZFtwbmldO1xuICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgYnlVdWlkW3BuaV0gPSBjb252ZXJzYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLndhcm4oYGNoZWNrRm9yQ29uZmxpY3RzOiBGb3VuZCBjb25mbGljdCB3aXRoIHBuaSAke3BuaX1gKTtcblxuICAgICAgICAgIC8vIEtlZXAgdGhlIG5ld2VyIG9uZSBpZiBpdCBoYXMgYWRkaXRpb25hbCBkYXRhLCBvdGhlcndpc2Uga2VlcCBleGlzdGluZ1xuICAgICAgICAgIGlmIChjb252ZXJzYXRpb24uZ2V0KCdlMTY0JykgfHwgY29udmVyc2F0aW9uLmdldCgncG5pJykpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgbmV3IG9uZVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29tYmluZUNvbnZlcnNhdGlvbnMoY29udmVyc2F0aW9uLCBleGlzdGluZyk7XG4gICAgICAgICAgICBieVV1aWRbcG5pXSA9IGNvbnZlcnNhdGlvbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gS2VlcCBleGlzdGluZyAtIG5vdGUgdGhhdCB0aGlzIGFwcGxpZXMgaWYgbmVpdGhlciBoYWQgYW4gZTE2NFxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29tYmluZUNvbnZlcnNhdGlvbnMoZXhpc3RpbmcsIGNvbnZlcnNhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlMTY0KSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYnlFMTY0W2UxNjRdO1xuICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgYnlFMTY0W2UxNjRdID0gY29udmVyc2F0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHdlIGhhdmUgdHdvIGNvbnRhY3RzIHdpdGggdGhlIHNhbWUgZTE2NCBidXQgZGlmZmVyZW50IHRydXRoeSBVVUlEcywgdGhlblxuICAgICAgICAgIC8vICAgd2UnbGwgZGVsZXRlIHRoZSBlMTY0IG9uIHRoZSBvbGRlciBvbmVcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJykgJiZcbiAgICAgICAgICAgIGV4aXN0aW5nLmdldCgndXVpZCcpICYmXG4gICAgICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCd1dWlkJykgIT09IGV4aXN0aW5nLmdldCgndXVpZCcpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgICAgYGNoZWNrRm9yQ29uZmxpY3RzOiBGb3VuZCB0d28gbWF0Y2hlcyBvbiBlMTY0ICR7ZTE2NH0gd2l0aCBkaWZmZXJlbnQgdHJ1dGh5IFVVSURzLiBEcm9wcGluZyBlMTY0IG9uIG9sZGVyLmBcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGV4aXN0aW5nLnNldCh7IGUxNjQ6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbihleGlzdGluZy5hdHRyaWJ1dGVzKTtcblxuICAgICAgICAgICAgYnlFMTY0W2UxNjRdID0gY29udmVyc2F0aW9uO1xuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsb2cud2FybihgY2hlY2tGb3JDb25mbGljdHM6IEZvdW5kIGNvbmZsaWN0IHdpdGggZTE2NCAke2UxNjR9YCk7XG5cbiAgICAgICAgICAvLyBLZWVwIHRoZSBuZXdlciBvbmUgaWYgaXQgaGFzIGEgVVVJRCwgb3RoZXJ3aXNlIGtlZXAgZXhpc3RpbmdcbiAgICAgICAgICBpZiAoY29udmVyc2F0aW9uLmdldCgndXVpZCcpKSB7XG4gICAgICAgICAgICAvLyBLZWVwIG5ldyBvbmVcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbWJpbmVDb252ZXJzYXRpb25zKGNvbnZlcnNhdGlvbiwgZXhpc3RpbmcpO1xuICAgICAgICAgICAgYnlFMTY0W2UxNjRdID0gY29udmVyc2F0aW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBLZWVwIGV4aXN0aW5nIC0gbm90ZSB0aGF0IHRoaXMgYXBwbGllcyBpZiBuZWl0aGVyIGhhZCBhIFVVSURcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbWJpbmVDb252ZXJzYXRpb25zKGV4aXN0aW5nLCBjb252ZXJzYXRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZ3JvdXBWMklkOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gICAgICBpZiAoaXNHcm91cFYxKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSkge1xuICAgICAgICBtYXliZURlcml2ZUdyb3VwVjJJZChjb252ZXJzYXRpb24pO1xuICAgICAgICBncm91cFYySWQgPSBjb252ZXJzYXRpb24uZ2V0KCdkZXJpdmVkR3JvdXBWMklkJyk7XG4gICAgICAgIGFzc2VydChcbiAgICAgICAgICBncm91cFYySWQsXG4gICAgICAgICAgJ2NoZWNrRm9yQ29uZmxpY3RzOiBleHBlY3RlZCB0aGUgZ3JvdXAgVjIgSUQgdG8gaGF2ZSBiZWVuIGRlcml2ZWQsIGJ1dCBpdCB3YXMgZmFsc3knXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGlzR3JvdXBWMihjb252ZXJzYXRpb24uYXR0cmlidXRlcykpIHtcbiAgICAgICAgZ3JvdXBWMklkID0gY29udmVyc2F0aW9uLmdldCgnZ3JvdXBJZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZ3JvdXBWMklkKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYnlHcm91cFYySWRbZ3JvdXBWMklkXTtcbiAgICAgICAgaWYgKCFleGlzdGluZykge1xuICAgICAgICAgIGJ5R3JvdXBWMklkW2dyb3VwVjJJZF0gPSBjb252ZXJzYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgbG9nUGFyZW50aGV0aWNhbCA9IGlzR3JvdXBWMShjb252ZXJzYXRpb24uYXR0cmlidXRlcylcbiAgICAgICAgICAgID8gJyAoZGVyaXZlZCBmcm9tIGEgR1YxIGdyb3VwIElEKSdcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgICBgY2hlY2tGb3JDb25mbGljdHM6IEZvdW5kIGNvbmZsaWN0IHdpdGggZ3JvdXAgVjIgSUQgJHtncm91cFYySWR9JHtsb2dQYXJlbnRoZXRpY2FsfWBcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gUHJlZmVyIHRoZSBHVjIgZ3JvdXAuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXNHcm91cFYyKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICAgICAgIWlzR3JvdXBWMihleGlzdGluZy5hdHRyaWJ1dGVzKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29tYmluZUNvbnZlcnNhdGlvbnMoY29udmVyc2F0aW9uLCBleGlzdGluZyk7XG4gICAgICAgICAgICBieUdyb3VwVjJJZFtncm91cFYySWRdID0gY29udmVyc2F0aW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb21iaW5lQ29udmVyc2F0aW9ucyhleGlzdGluZywgY29udmVyc2F0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2cuaW5mbygnY2hlY2tGb3JDb25mbGljdHM6IGNvbXBsZXRlIScpO1xuICB9XG5cbiAgYXN5bmMgY29tYmluZUNvbnZlcnNhdGlvbnMoXG4gICAgY3VycmVudDogQ29udmVyc2F0aW9uTW9kZWwsXG4gICAgb2Jzb2xldGU6IENvbnZlcnNhdGlvbk1vZGVsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxvZ0lkID0gYGNvbWJpbmVDb252ZXJzYXRpb25zLyR7b2Jzb2xldGUuaWR9LT4ke2N1cnJlbnQuaWR9YDtcblxuICAgIHJldHVybiB0aGlzLl9jb21iaW5lQ29udmVyc2F0aW9uc1F1ZXVlLmFkZChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb252ZXJzYXRpb25UeXBlID0gY3VycmVudC5nZXQoJ3R5cGUnKTtcblxuICAgICAgaWYgKCF0aGlzLmdldChvYnNvbGV0ZS5pZCkpIHtcbiAgICAgICAgbG9nLndhcm4oYCR7bG9nSWR9OiBBbHJlYWR5IGNvbWJpbmVkIG9ic29sZXRlIGNvbnZlcnNhdGlvbmApO1xuICAgICAgfVxuXG4gICAgICBpZiAob2Jzb2xldGUuZ2V0KCd0eXBlJykgIT09IGNvbnZlcnNhdGlvblR5cGUpIHtcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIGAke2xvZ0lkfTogY2Fubm90IGNvbWJpbmUgYSBwcml2YXRlIGFuZCBncm91cCBjb252ZXJzYXRpb24uIERvaW5nIG5vdGhpbmdgXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvQ29weTogUGFydGlhbDxDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZT4gPSBwaWNrKFxuICAgICAgICBvYnNvbGV0ZS5hdHRyaWJ1dGVzLFxuICAgICAgICBbXG4gICAgICAgICAgJ2NvbnZlcnNhdGlvbkNvbG9yJyxcbiAgICAgICAgICAnY3VzdG9tQ29sb3InLFxuICAgICAgICAgICdjdXN0b21Db2xvcklkJyxcbiAgICAgICAgICAnZHJhZnRBdHRhY2htZW50cycsXG4gICAgICAgICAgJ2RyYWZ0Qm9keVJhbmdlcycsXG4gICAgICAgICAgJ2RyYWZ0VGltZXN0YW1wJyxcbiAgICAgICAgICAnbWVzc2FnZUNvdW50JyxcbiAgICAgICAgICAnbWVzc2FnZVJlcXVlc3RSZXNwb25zZVR5cGUnLFxuICAgICAgICAgICdxdW90ZWRNZXNzYWdlSWQnLFxuICAgICAgICAgICdzZW50TWVzc2FnZUNvdW50JyxcbiAgICAgICAgXVxuICAgICAgKTtcblxuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGFUb0NvcHkpIGFzIEFycmF5PFxuICAgICAgICBrZXlvZiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZVxuICAgICAgPjtcbiAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudC5nZXQoa2V5KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY3VycmVudC5zZXQoa2V5LCBkYXRhVG9Db3B5W2tleV0pO1xuXG4gICAgICAgICAgLy8gVG8gZW5zdXJlIHRoYXQgYW55IGZpbGVzIG9uIGRpc2sgZG9uJ3QgZ2V0IGRlbGV0ZWQgb3V0IGZyb20gdW5kZXIgdXNcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZHJhZnRBdHRhY2htZW50cycpIHtcbiAgICAgICAgICAgIG9ic29sZXRlLnNldChrZXksIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKG9ic29sZXRlLmdldCgnaXNQaW5uZWQnKSkge1xuICAgICAgICBvYnNvbGV0ZS51bnBpbigpO1xuXG4gICAgICAgIGlmICghY3VycmVudC5nZXQoJ2lzUGlubmVkJykpIHtcbiAgICAgICAgICBjdXJyZW50LnBpbigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9ic29sZXRlSWQgPSBvYnNvbGV0ZS5nZXQoJ2lkJyk7XG4gICAgICBjb25zdCBvYnNvbGV0ZVV1aWQgPSBvYnNvbGV0ZS5nZXRVdWlkKCk7XG4gICAgICBjb25zdCBjdXJyZW50SWQgPSBjdXJyZW50LmdldCgnaWQnKTtcbiAgICAgIGxvZy53YXJuKFxuICAgICAgICBgJHtsb2dJZH06IENvbWJpbmluZyB0d28gY29udmVyc2F0aW9ucyAtYCxcbiAgICAgICAgYG9sZDogJHtvYnNvbGV0ZS5pZEZvckxvZ2dpbmcoKX0gLT4gbmV3OiAke2N1cnJlbnQuaWRGb3JMb2dnaW5nKCl9YFxuICAgICAgKTtcblxuICAgICAgaWYgKGNvbnZlcnNhdGlvblR5cGUgPT09ICdwcml2YXRlJyAmJiBvYnNvbGV0ZVV1aWQpIHtcbiAgICAgICAgaWYgKCFjdXJyZW50LmdldCgncHJvZmlsZUtleScpICYmIG9ic29sZXRlLmdldCgncHJvZmlsZUtleScpKSB7XG4gICAgICAgICAgbG9nLndhcm4oYCR7bG9nSWR9OiBDb3B5aW5nIHByb2ZpbGUga2V5IGZyb20gb2xkIHRvIG5ldyBjb250YWN0YCk7XG5cbiAgICAgICAgICBjb25zdCBwcm9maWxlS2V5ID0gb2Jzb2xldGUuZ2V0KCdwcm9maWxlS2V5Jyk7XG5cbiAgICAgICAgICBpZiAocHJvZmlsZUtleSkge1xuICAgICAgICAgICAgYXdhaXQgY3VycmVudC5zZXRQcm9maWxlS2V5KHByb2ZpbGVLZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy53YXJuKGAke2xvZ0lkfTogRGVsZXRlIGFsbCBzZXNzaW9ucyB0aWVkIHRvIG9sZCBjb252ZXJzYXRpb25JZGApO1xuICAgICAgICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5BQ0kpO1xuICAgICAgICBjb25zdCBvdXJQTkkgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5QTkkpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICBbb3VyQUNJLCBvdXJQTkldLm1hcChhc3luYyBvdXJVdWlkID0+IHtcbiAgICAgICAgICAgIGlmICghb3VyVXVpZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkZXZpY2VJZHMgPVxuICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmdldERldmljZUlkcyh7XG4gICAgICAgICAgICAgICAgb3VyVXVpZCxcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBvYnNvbGV0ZVV1aWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgZGV2aWNlSWRzLm1hcChhc3luYyBkZXZpY2VJZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWRkciA9IG5ldyBRdWFsaWZpZWRBZGRyZXNzKFxuICAgICAgICAgICAgICAgICAgb3VyVXVpZCxcbiAgICAgICAgICAgICAgICAgIG5ldyBBZGRyZXNzKG9ic29sZXRlVXVpZCwgZGV2aWNlSWQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLnJlbW92ZVNlc3Npb24oYWRkcik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYCR7bG9nSWR9OiBEZWxldGUgYWxsIGlkZW50aXR5IGluZm9ybWF0aW9uIHRpZWQgdG8gb2xkIGNvbnZlcnNhdGlvbklkYFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChvYnNvbGV0ZVV1aWQpIHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLnJlbW92ZUlkZW50aXR5S2V5KFxuICAgICAgICAgICAgb2Jzb2xldGVVdWlkXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGAke2xvZ0lkfTogRW5zdXJlIHRoYXQgYWxsIFYxIGdyb3VwcyBoYXZlIG5ldyBjb252ZXJzYXRpb25JZCBpbnN0ZWFkIG9mIG9sZGBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKG9ic29sZXRlVXVpZCk7XG4gICAgICAgIGdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICBjb25zdCBtZW1iZXJzID0gZ3JvdXAuZ2V0KCdtZW1iZXJzJyk7XG4gICAgICAgICAgY29uc3Qgd2l0aG91dE9ic29sZXRlID0gd2l0aG91dChtZW1iZXJzLCBvYnNvbGV0ZUlkKTtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QWRkZWQgPSB1bmlxKFsuLi53aXRob3V0T2Jzb2xldGUsIGN1cnJlbnRJZF0pO1xuXG4gICAgICAgICAgZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIG1lbWJlcnM6IGN1cnJlbnRBZGRlZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB1cGRhdGVDb252ZXJzYXRpb24oZ3JvdXAuYXR0cmlidXRlcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RlOiB3ZSBleHBsaWNpdGx5IGRvbid0IHdhbnQgdG8gdXBkYXRlIFYyIGdyb3Vwc1xuXG4gICAgICBsb2cud2FybihgJHtsb2dJZH06IERlbGV0ZSB0aGUgb2Jzb2xldGUgY29udmVyc2F0aW9uIGZyb20gdGhlIGRhdGFiYXNlYCk7XG4gICAgICBhd2FpdCByZW1vdmVDb252ZXJzYXRpb24ob2Jzb2xldGVJZCk7XG5cbiAgICAgIGxvZy53YXJuKGAke2xvZ0lkfTogVXBkYXRlIGNhY2hlZCBtZXNzYWdlcyBpbiBNZXNzYWdlQ29udHJvbGxlcmApO1xuICAgICAgd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnVwZGF0ZSgobWVzc2FnZTogTWVzc2FnZU1vZGVsKSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlLmdldCgnY29udmVyc2F0aW9uSWQnKSA9PT0gb2Jzb2xldGVJZCkge1xuICAgICAgICAgIG1lc3NhZ2Uuc2V0KHsgY29udmVyc2F0aW9uSWQ6IGN1cnJlbnRJZCB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGxvZy53YXJuKGAke2xvZ0lkfTogVXBkYXRlIG1lc3NhZ2VzIHRhYmxlYCk7XG4gICAgICBhd2FpdCBtaWdyYXRlQ29udmVyc2F0aW9uTWVzc2FnZXMob2Jzb2xldGVJZCwgY3VycmVudElkKTtcblxuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGAke2xvZ0lkfTogRW1pdCByZWZyZXNoQ29udmVyc2F0aW9uIGV2ZW50IHRvIGNsb3NlIG9sZC9vcGVuIG5ld2BcbiAgICAgICk7XG4gICAgICB3aW5kb3cuV2hpc3Blci5ldmVudHMudHJpZ2dlcigncmVmcmVzaENvbnZlcnNhdGlvbicsIHtcbiAgICAgICAgbmV3SWQ6IGN1cnJlbnRJZCxcbiAgICAgICAgb2xkSWQ6IG9ic29sZXRlSWQsXG4gICAgICB9KTtcblxuICAgICAgbG9nLndhcm4oXG4gICAgICAgIGAke2xvZ0lkfTogRWxpbWluYXRlIG9sZCBjb252ZXJzYXRpb24gZnJvbSBDb252ZXJzYXRpb25Db250cm9sbGVyIGxvb2t1cHNgXG4gICAgICApO1xuICAgICAgdGhpcy5fY29udmVyc2F0aW9ucy5yZW1vdmUob2Jzb2xldGUpO1xuICAgICAgdGhpcy5fY29udmVyc2F0aW9ucy5yZXNldExvb2t1cHMoKTtcblxuICAgICAgY3VycmVudC5jYXB0dXJlQ2hhbmdlKCdjb21iaW5lQ29udmVyc2F0aW9ucycpO1xuXG4gICAgICBsb2cud2FybihgJHtsb2dJZH06IENvbXBsZXRlIWApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgZ3JvdXBJZCBhbmQgb3B0aW9uYWwgYWRkaXRpb25hbCBpbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzLFxuICAgKiBlbnN1cmVzIHRoZSBleGlzdGVuY2Ugb2YgYSBncm91cCBjb252ZXJzYXRpb24gYW5kIHJldHVybnMgYSBzdHJpbmdcbiAgICogcmVwcmVzZW50aW5nIHRoZSBsb2NhbCBkYXRhYmFzZSBJRCBvZiB0aGUgZ3JvdXAgY29udmVyc2F0aW9uLlxuICAgKi9cbiAgZW5zdXJlR3JvdXAoZ3JvdXBJZDogc3RyaW5nLCBhZGRpdGlvbmFsSW5pdFByb3BzID0ge30pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldE9yQ3JlYXRlKGdyb3VwSWQsICdncm91cCcsIGFkZGl0aW9uYWxJbml0UHJvcHMpLmdldCgnaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBjZXJ0YWluIG1ldGFkYXRhIGFib3V0IGEgbWVzc2FnZSAoYW4gaWRlbnRpZmllciBvZiB3aG8gd3JvdGUgdGhlXG4gICAqIG1lc3NhZ2UgYW5kIHRoZSBzZW50X2F0IHRpbWVzdGFtcCBvZiB0aGUgbWVzc2FnZSkgcmV0dXJucyB0aGVcbiAgICogY29udmVyc2F0aW9uIHRoZSBtZXNzYWdlIGJlbG9uZ3MgdG8gT1IgbnVsbCBpZiBhIGNvbnZlcnNhdGlvbiBpc24ndFxuICAgKiBmb3VuZC5cbiAgICovXG4gIGFzeW5jIGdldENvbnZlcnNhdGlvbkZvclRhcmdldE1lc3NhZ2UoXG4gICAgdGFyZ2V0RnJvbUlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0VGltZXN0YW1wOiBudW1iZXJcbiAgKTogUHJvbWlzZTxDb252ZXJzYXRpb25Nb2RlbCB8IG51bGwgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGdldE1lc3NhZ2VzQnlTZW50QXQodGFyZ2V0VGltZXN0YW1wKTtcbiAgICBjb25zdCB0YXJnZXRNZXNzYWdlID0gbWVzc2FnZXMuZmluZChtID0+IGdldENvbnRhY3RJZChtKSA9PT0gdGFyZ2V0RnJvbUlkKTtcblxuICAgIGlmICh0YXJnZXRNZXNzYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGFyZ2V0TWVzc2FnZS5jb252ZXJzYXRpb25JZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyBnZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKFxuICAgIHV1aWQ6IFVVSURcbiAgKTogUHJvbWlzZTxBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4+IHtcbiAgICBjb25zdCBncm91cHMgPSBhd2FpdCBnZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKHV1aWQudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIGdyb3Vwcy5tYXAoZ3JvdXAgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmdldChncm91cC5pZCk7XG4gICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0aW5nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fY29udmVyc2F0aW9ucy5hZGQoZ3JvdXApO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0QnlEZXJpdmVkR3JvdXBWMklkKGdyb3VwSWQ6IHN0cmluZyk6IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fY29udmVyc2F0aW9ucy5maW5kKFxuICAgICAgaXRlbSA9PiBpdGVtLmdldCgnZGVyaXZlZEdyb3VwVjJJZCcpID09PSBncm91cElkXG4gICAgKTtcbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIGRlbGV0ZSB0aGlzLl9pbml0aWFsUHJvbWlzZTtcbiAgICB0aGlzLl9pbml0aWFsRmV0Y2hDb21wbGV0ZSA9IGZhbHNlO1xuICAgIHRoaXMuX2NvbnZlcnNhdGlvbnMucmVzZXQoW10pO1xuICB9XG5cbiAgbG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLl9pbml0aWFsUHJvbWlzZSB8fD0gdGhpcy5kb0xvYWQoKTtcbiAgICByZXR1cm4gdGhpcy5faW5pdGlhbFByb21pc2U7XG4gIH1cblxuICAvLyBBIG51bWJlciBvZiB0aGluZ3Mgb3V0c2lkZSBjb252ZXJzYXRpb24uYXR0cmlidXRlcyBhZmZlY3QgY29udmVyc2F0aW9uIHJlLXJlbmRlcmluZy5cbiAgLy8gICBJZiBpdCdzIHNjb3BlZCB0byBhIGdpdmVuIGNvbnZlcnNhdGlvbiwgaXQncyBlYXN5IHRvIHRyaWdnZXIoJ2NoYW5nZScpLiBUaGVyZSBhcmVcbiAgLy8gICBpbXBvcnRhbnQgdmFsdWVzIGluIHN0b3JhZ2UgYW5kIHRoZSBzdG9yYWdlIHNlcnZpY2Ugd2hpY2ggY2hhbmdlIHJlbmRlcmluZyBwcmV0dHlcbiAgLy8gICByYWRpY2FsbHksIHNvIHRoaXMgZnVuY3Rpb24gaXMgbmVjZXNzYXJ5IHRvIGZvcmNlIHJlZ2VuZXJhdGlvbiBvZiBwcm9wcy5cbiAgYXN5bmMgZm9yY2VSZXJlbmRlcihpZGVudGlmaWVycz86IEFycmF5PHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSBpZGVudGlmaWVyc1xuICAgICAgPyBpZGVudGlmaWVycy5tYXAoaWRlbnRpZmllciA9PiB0aGlzLmdldChpZGVudGlmaWVyKSkuZmlsdGVyKGlzTm90TmlsKVxuICAgICAgOiB0aGlzLl9jb252ZXJzYXRpb25zLm1vZGVscy5zbGljZSgpO1xuICAgIGxvZy5pbmZvKFxuICAgICAgYGZvcmNlUmVyZW5kZXI6IFN0YXJ0aW5nIHRvIGxvb3AgdGhyb3VnaCAke2NvbnZlcnNhdGlvbnMubGVuZ3RofSBjb252ZXJzYXRpb25zYFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gY29udmVyc2F0aW9ucy5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gY29udmVyc2F0aW9uc1tpXTtcblxuICAgICAgaWYgKGNvbnZlcnNhdGlvbi5jYWNoZWRQcm9wcykge1xuICAgICAgICBjb252ZXJzYXRpb24ub2xkQ2FjaGVkUHJvcHMgPSBjb252ZXJzYXRpb24uY2FjaGVkUHJvcHM7XG4gICAgICAgIGNvbnZlcnNhdGlvbi5jYWNoZWRQcm9wcyA9IG51bGw7XG5cbiAgICAgICAgY29udmVyc2F0aW9uLnRyaWdnZXIoJ3Byb3BzLWNoYW5nZScsIGNvbnZlcnNhdGlvbiwgZmFsc2UpO1xuICAgICAgICBjb3VudCArPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoY291bnQgJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBzbGVlcCgzMDApO1xuICAgICAgfVxuICAgIH1cbiAgICBsb2cuaW5mbyhgZm9yY2VSZXJlbmRlcjogVXBkYXRlZCAke2NvdW50fSBjb252ZXJzYXRpb25zYCk7XG4gIH1cblxuICBvbkNvbnZvT3BlblN0YXJ0KGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9jb252ZXJzYXRpb25PcGVuU3RhcnQuc2V0KGNvbnZlcnNhdGlvbklkLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIG9uQ29udm9NZXNzYWdlTW91bnQoY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGxvYWRTdGFydCA9IHRoaXMuX2NvbnZlcnNhdGlvbk9wZW5TdGFydC5nZXQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmIChsb2FkU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnZlcnNhdGlvbk9wZW5TdGFydC5kZWxldGUoY29udmVyc2F0aW9uSWQpO1xuICAgIHRoaXMuZ2V0KGNvbnZlcnNhdGlvbklkKT8ub25PcGVuQ29tcGxldGUobG9hZFN0YXJ0KTtcbiAgfVxuXG4gIHJlcGFpclBpbm5lZENvbnZlcnNhdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgcGlubmVkSWRzID0gd2luZG93LnN0b3JhZ2UuZ2V0KCdwaW5uZWRDb252ZXJzYXRpb25JZHMnLCBbXSk7XG5cbiAgICBmb3IgKGNvbnN0IGlkIG9mIHBpbm5lZElkcykge1xuICAgICAgY29uc3QgY29udm8gPSB0aGlzLmdldChpZCk7XG5cbiAgICAgIGlmICghY29udm8gfHwgY29udm8uZ2V0KCdpc1Bpbm5lZCcpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsb2cud2FybihcbiAgICAgICAgYENvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IFJlcGFpcmluZyAke2NvbnZvLmlkRm9yTG9nZ2luZygpfSdzIGlzUGlubmVkYFxuICAgICAgKTtcbiAgICAgIGNvbnZvLnNldCgnaXNQaW5uZWQnLCB0cnVlKTtcblxuICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnVwZGF0ZUNvbnZlcnNhdGlvbihjb252by5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRvTG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsb2cuaW5mbygnQ29udmVyc2F0aW9uQ29udHJvbGxlcjogc3RhcnRpbmcgaW5pdGlhbCBmZXRjaCcpO1xuXG4gICAgaWYgKHRoaXMuX2NvbnZlcnNhdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IEFscmVhZHkgbG9hZGVkIScpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gYXdhaXQgZ2V0QWxsQ29udmVyc2F0aW9ucygpO1xuXG4gICAgICAvLyBHZXQgcmlkIG9mIHRlbXBvcmFyeSBjb252ZXJzYXRpb25zXG4gICAgICBjb25zdCB0ZW1wb3JhcnlDb252ZXJzYXRpb25zID0gY29sbGVjdGlvbi5maWx0ZXIoY29udmVyc2F0aW9uID0+XG4gICAgICAgIEJvb2xlYW4oY29udmVyc2F0aW9uLmlzVGVtcG9yYXJ5KVxuICAgICAgKTtcblxuICAgICAgaWYgKHRlbXBvcmFyeUNvbnZlcnNhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgIGBDb252ZXJzYXRpb25Db250cm9sbGVyOiBSZW1vdmluZyAke3RlbXBvcmFyeUNvbnZlcnNhdGlvbnMubGVuZ3RofSB0ZW1wb3JhcnkgY29udmVyc2F0aW9uc2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFBRdWV1ZSh7XG4gICAgICAgIGNvbmN1cnJlbmN5OiAzLFxuICAgICAgICB0aW1lb3V0OiBNSU5VVEUgKiAzMCxcbiAgICAgICAgdGhyb3dPblRpbWVvdXQ6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHF1ZXVlLmFkZEFsbChcbiAgICAgICAgdGVtcG9yYXJ5Q29udmVyc2F0aW9ucy5tYXAoaXRlbSA9PiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgcmVtb3ZlQ29udmVyc2F0aW9uKGl0ZW0uaWQpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICAgIGF3YWl0IHF1ZXVlLm9uSWRsZSgpO1xuXG4gICAgICAvLyBIeWRyYXRlIHRoZSBmaW5hbCBzZXQgb2YgY29udmVyc2F0aW9uc1xuICAgICAgdGhpcy5fY29udmVyc2F0aW9ucy5hZGQoXG4gICAgICAgIGNvbGxlY3Rpb24uZmlsdGVyKGNvbnZlcnNhdGlvbiA9PiAhY29udmVyc2F0aW9uLmlzVGVtcG9yYXJ5KVxuICAgICAgKTtcblxuICAgICAgdGhpcy5faW5pdGlhbEZldGNoQ29tcGxldGUgPSB0cnVlO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgdGhpcy5fY29udmVyc2F0aW9ucy5tYXAoYXN5bmMgY29udmVyc2F0aW9uID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gSHlkcmF0ZSBjb250YWN0Q29sbGVjdGlvbiwgbm93IHRoYXQgaW5pdGlhbCBmZXRjaCBpcyBjb21wbGV0ZVxuICAgICAgICAgICAgY29udmVyc2F0aW9uLmZldGNoQ29udGFjdHMoKTtcblxuICAgICAgICAgICAgY29uc3QgaXNDaGFuZ2VkID0gbWF5YmVEZXJpdmVHcm91cFYySWQoY29udmVyc2F0aW9uKTtcbiAgICAgICAgICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgdXBkYXRlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW4gY2FzZSBhIHRvby1sYXJnZSBkcmFmdCB3YXMgc2F2ZWQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICBjb25zdCBkcmFmdCA9IGNvbnZlcnNhdGlvbi5nZXQoJ2RyYWZ0Jyk7XG4gICAgICAgICAgICBpZiAoZHJhZnQgJiYgZHJhZnQubGVuZ3RoID4gTUFYX01FU1NBR0VfQk9EWV9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uLnNldCh7XG4gICAgICAgICAgICAgICAgZHJhZnQ6IGRyYWZ0LnNsaWNlKDAsIE1BWF9NRVNTQUdFX0JPRFlfTEVOR1RIKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENsZWFuIHVwIHRoZSBjb252ZXJzYXRpb25zIHRoYXQgaGF2ZSBVVUlEIGFzIHRoZWlyIGUxNjQuXG4gICAgICAgICAgICBjb25zdCBlMTY0ID0gY29udmVyc2F0aW9uLmdldCgnZTE2NCcpO1xuICAgICAgICAgICAgY29uc3QgdXVpZCA9IGNvbnZlcnNhdGlvbi5nZXQoJ3V1aWQnKTtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkVXVpZChlMTY0KSAmJiB1dWlkKSB7XG4gICAgICAgICAgICAgIGNvbnZlcnNhdGlvbi5zZXQoeyBlMTY0OiB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb24uYXR0cmlidXRlcyk7XG5cbiAgICAgICAgICAgICAgbG9nLmluZm8oYENsZWFuaW5nIHVwIGNvbnZlcnNhdGlvbigke3V1aWR9KSB3aXRoIGludmFsaWQgZTE2NGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAgICdDb252ZXJzYXRpb25Db250cm9sbGVyLmxvYWQvbWFwOiBGYWlsZWQgdG8gcHJlcGFyZSBhIGNvbnZlcnNhdGlvbicsXG4gICAgICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgbG9nLmluZm8oJ0NvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IGRvbmUgd2l0aCBpbml0aWFsIGZldGNoJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ0NvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IGluaXRpYWwgZmV0Y2ggZmFpbGVkJyxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSxvQkFBOEM7QUFDOUMscUJBQW1CO0FBV25CLG9CQUEwQjtBQUMxQixVQUFxQjtBQUNyQixhQUF3QjtBQUN4QixxQkFBNkI7QUFDN0Isb0JBQXFDO0FBQ3JDLG9CQUFxQztB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
