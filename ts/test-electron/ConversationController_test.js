var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_UUID = require("../types/UUID");
var import_assert = require("../util/assert");
const ACI_1 = import_UUID.UUID.generate().toString();
const ACI_2 = import_UUID.UUID.generate().toString();
const E164_1 = "+14155550111";
const E164_2 = "+14155550112";
const PNI_1 = import_UUID.UUID.generate().toString();
const PNI_2 = import_UUID.UUID.generate().toString();
const reason = "test";
describe("ConversationController", () => {
  describe("maybeMergeContacts", () => {
    let mergeOldAndNew;
    beforeEach(async () => {
      await window.Signal.Data._removeAllConversations();
      window.ConversationController.reset();
      await window.ConversationController.load();
      mergeOldAndNew = /* @__PURE__ */ __name(() => {
        throw new Error("mergeOldAndNew: Should not be called!");
      }, "mergeOldAndNew");
    });
    it("throws when provided no data", () => {
      import_chai.assert.throws(() => {
        window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          reason
        });
      }, "Need to provide at least one");
    });
    function create(name, { uuid, aci, e164, pni }) {
      const identifier = aci || uuid || e164 || pni;
      const serviceId = aci || uuid || pni;
      (0, import_assert.strictAssert)(identifier, "create needs aci, e164, pni, or uuid");
      const conversation = window.ConversationController.getOrCreate(identifier, "private", { uuid: serviceId, e164, pni });
      expectLookups(conversation, name, { uuid, aci, e164, pni });
      return conversation;
    }
    function expectLookups(conversation, name, { uuid, aci, e164, pni }) {
      import_chai.assert.exists(conversation, `${name} conversation exists`);
      import_chai.assert.strictEqual(window.ConversationController.get(conversation?.id)?.id, conversation?.id, `${name} vs. lookup by id`);
      if (uuid) {
        import_chai.assert.strictEqual(window.ConversationController.get(uuid)?.id, conversation?.id, `${name} vs. lookup by uuid`);
      }
      if (aci) {
        import_chai.assert.strictEqual(window.ConversationController.get(aci)?.id, conversation?.id, `${name} vs. lookup by aci`);
      }
      if (e164) {
        import_chai.assert.strictEqual(window.ConversationController.get(e164)?.id, conversation?.id, `${name} vs. lookup by e164`);
      }
      if (pni) {
        import_chai.assert.strictEqual(window.ConversationController.get(pni)?.id, conversation?.id, `${name} vs. lookup by pni`);
      }
    }
    function expectPropsAndLookups(conversation, name, { uuid, aci, e164, pni }) {
      import_chai.assert.exists(conversation, `${name} conversation exists`);
      import_chai.assert.strictEqual(conversation?.get("uuid"), aci || uuid, `${name} uuid matches`);
      import_chai.assert.strictEqual(conversation?.get("e164"), e164, `${name} e164 matches`);
      import_chai.assert.strictEqual(conversation?.get("pni"), pni, `${name} pni matches`);
      expectLookups(conversation, name, { uuid, e164, pni });
    }
    function expectDeleted(conversation, name) {
      import_chai.assert.isUndefined(window.ConversationController.get(conversation.id), `${name} has been deleted`);
    }
    describe("non-destructive updates", () => {
      it("creates a new conversation with just ACI if no matches", () => {
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1
        });
        const second = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          reason
        });
        expectPropsAndLookups(second, "second", {
          aci: ACI_1
        });
        import_chai.assert.strictEqual(result?.id, second?.id, "result and second match");
      });
      it("creates a new conversation with just e164 if no matches", () => {
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          e164: E164_1
        });
        const second = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          reason
        });
        expectPropsAndLookups(second, "second", {
          e164: E164_1
        });
        import_chai.assert.strictEqual(result?.id, second?.id, "result and second match");
      });
      it("creates a new conversation with all data if no matches", () => {
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const second = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(second, "second", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(result?.id, second?.id, "result and second match");
      });
      it("fetches all-data conversation with ACI-only query", () => {
        const initial = create("initial", {
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("fetches all-data conversation with e164+PNI query", () => {
        const initial = create("initial", {
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("adds ACI to conversation with e164+PNI", () => {
        const initial = create("initial", {
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("adds ACI (via ACI+PNI) to conversation with e164+PNI", () => {
        const initial = create("initial", {
          uuid: PNI_1,
          e164: E164_1
        });
        expectPropsAndLookups(initial, "initial", {
          uuid: PNI_1,
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("adds e164+PNI to conversation with just ACI", () => {
        const initial = create("initial", {
          uuid: ACI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("adds e164 to conversation with ACI+PNI", () => {
        const initial = create("initial", {
          aci: ACI_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("adds PNI to conversation with ACI+e164", () => {
        const initial = create("initial", {
          aci: ACI_1,
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("adds PNI to conversation with just e164", () => {
        const initial = create("initial", {
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("adds PNI+ACI to conversation with just e164", () => {
        const initial = create("initial", {
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("adds ACI+e164 to conversation with just PNI", () => {
        const initial = create("initial", {
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
      it("promotes PNI used as generic UUID to be in the PNI field as well", () => {
        const initial = create("initial", {
          aci: PNI_1,
          e164: E164_1
        });
        expectPropsAndLookups(initial, "initial", {
          uuid: PNI_1,
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_1,
          pni: PNI_1
        });
        import_chai.assert.strictEqual(initial?.id, result?.id, "result and initial match");
      });
    });
    describe("with destructive updates", () => {
      it("replaces e164+PNI in conversation with matching ACI", () => {
        const initial = create("initial", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_2,
          pni: PNI_2,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_2,
          pni: PNI_2
        });
        import_chai.assert.isUndefined(window.ConversationController.get(E164_1), "old e164 no longer found");
        import_chai.assert.isUndefined(window.ConversationController.get(PNI_1), "old pni no longer found");
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("replaces PNI in conversation with e164+PNI", () => {
        const initial = create("initial", {
          pni: PNI_1,
          e164: E164_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          pni: PNI_2,
          e164: E164_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_2,
          e164: E164_1,
          pni: PNI_2
        });
        import_chai.assert.isUndefined(window.ConversationController.get(PNI_1), "old pni no longer found");
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("replaces PNI in conversation with all data", () => {
        const initial = create("initial", {
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_2,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_2
        });
        import_chai.assert.isUndefined(window.ConversationController.get(PNI_1), "old pni no longer found");
        import_chai.assert.strictEqual(result?.id, initial?.id, "result and initial match");
      });
      it("removes e164+PNI from previous conversation with an ACI, adds all data to new conversation", () => {
        const initial = create("initial", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_2,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_2,
          e164: E164_1,
          pni: PNI_1
        });
        expectPropsAndLookups(initial, "initial", { uuid: ACI_1 });
        import_chai.assert.notStrictEqual(initial?.id, result?.id, "result and initial should not match");
      });
      it("removes e164+PNI from previous conversation with an ACI, adds to ACI match", () => {
        const initial = create("initial", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        const aciOnly = create("aciOnly", {
          uuid: ACI_2
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_2,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(aciOnly, "aciOnly", {
          uuid: ACI_2,
          e164: E164_1,
          pni: PNI_1
        });
        expectPropsAndLookups(initial, "initial", { uuid: ACI_1 });
        import_chai.assert.strictEqual(aciOnly?.id, result?.id, "result and aciOnly should match");
      });
      it("removes PNI from previous conversation, adds it to e164-only match", () => {
        const withE164 = create("withE164", {
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          e164: E164_2,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectPropsAndLookups(withPNI, "withPNI", { e164: E164_2 });
        import_chai.assert.strictEqual(withE164?.id, result?.id, "result and initial should match");
      });
      it("removes PNI from previous conversation, adds it new e164+PNI conversation", () => {
        const initial = create("initial", {
          e164: E164_1,
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_2,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_2,
          pni: PNI_1
        });
        expectPropsAndLookups(initial, "initial", { e164: E164_1 });
        import_chai.assert.notStrictEqual(initial?.id, result?.id, "result and initial should not match");
      });
      it("deletes PNI-only previous conversation, adds it to e164 match", () => {
        mergeOldAndNew = /* @__PURE__ */ __name(({ oldConversation }) => {
          window.ConversationController.dangerouslyRemoveById(oldConversation.id);
          return Promise.resolve();
        }, "mergeOldAndNew");
        const withE164 = create("withE164", {
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectDeleted(withPNI, "withPNI");
        import_chai.assert.strictEqual(withE164?.id, result?.id, "result and initial should match");
      });
      it("deletes previous conversation with PNI as UUID only, adds it to e164 match", () => {
        mergeOldAndNew = /* @__PURE__ */ __name(({ oldConversation }) => {
          window.ConversationController.dangerouslyRemoveById(oldConversation.id);
          return Promise.resolve();
        }, "mergeOldAndNew");
        const withE164 = create("withE164", {
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          uuid: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: PNI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectDeleted(withPNI, "withPNI");
        import_chai.assert.strictEqual(withE164?.id, result?.id, "result and initial should match");
      });
      it("deletes e164+PNI previous conversation, adds data to ACI match", () => {
        mergeOldAndNew = /* @__PURE__ */ __name(({ oldConversation }) => {
          window.ConversationController.dangerouslyRemoveById(oldConversation.id);
          return Promise.resolve();
        }, "mergeOldAndNew");
        const withE164 = create("withE164", {
          e164: E164_1,
          pni: PNI_1
        });
        const withACI = create("withPNI", {
          aci: ACI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectDeleted(withE164, "withE164");
        import_chai.assert.strictEqual(withACI?.id, result?.id, "result and initial should match");
      });
      it("handles three matching conversations: ACI-only, with E164, and with PNI", () => {
        const withACI = create("withACI", {
          aci: ACI_1
        });
        const withE164 = create("withE164", {
          aci: ACI_2,
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          pni: PNI_1,
          e164: E164_2
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectPropsAndLookups(withE164, "withE164", { aci: ACI_2 });
        expectPropsAndLookups(withPNI, "withPNI", { e164: E164_2 });
        import_chai.assert.strictEqual(result?.id, withACI?.id, "result and withACI match");
      });
      it("handles three matching conversations: ACI-only, E164-only (deleted), and with PNI", () => {
        mergeOldAndNew = /* @__PURE__ */ __name(({ oldConversation }) => {
          window.ConversationController.dangerouslyRemoveById(oldConversation.id);
          return Promise.resolve();
        }, "mergeOldAndNew");
        const withACI = create("withACI", {
          aci: ACI_1
        });
        const withE164 = create("withE164", {
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          pni: PNI_1,
          e164: E164_2
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectPropsAndLookups(withPNI, "withPNI", { e164: E164_2 });
        expectDeleted(withE164, "withE164");
        import_chai.assert.strictEqual(result?.id, withACI?.id, "result and withACI match");
      });
      it("merges three matching conversations: ACI-only, E164-only (deleted), PNI-only (deleted)", () => {
        mergeOldAndNew = /* @__PURE__ */ __name(({ oldConversation }) => {
          window.ConversationController.dangerouslyRemoveById(oldConversation.id);
          return Promise.resolve();
        }, "mergeOldAndNew");
        const withACI = create("withACI", {
          aci: ACI_1
        });
        const withE164 = create("withE164", {
          e164: E164_1
        });
        const withPNI = create("withPNI", {
          pni: PNI_1
        });
        const result = window.ConversationController.maybeMergeContacts({
          mergeOldAndNew,
          aci: ACI_1,
          e164: E164_1,
          pni: PNI_1,
          reason
        });
        expectPropsAndLookups(result, "result", {
          uuid: ACI_1,
          e164: E164_1,
          pni: PNI_1
        });
        expectDeleted(withPNI, "withPNI");
        expectDeleted(withE164, "withE164");
        import_chai.assert.strictEqual(result?.id, withACI?.id, "result and withACI match");
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uQ29udHJvbGxlcl90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5cbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5cbmNvbnN0IEFDSV8xID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG5jb25zdCBBQ0lfMiA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuY29uc3QgRTE2NF8xID0gJysxNDE1NTU1MDExMSc7XG5jb25zdCBFMTY0XzIgPSAnKzE0MTU1NTUwMTEyJztcbmNvbnN0IFBOSV8xID0gVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCk7XG5jb25zdCBQTklfMiA9IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpO1xuY29uc3QgcmVhc29uID0gJ3Rlc3QnO1xuXG50eXBlIFBhcmFtc1R5cGUgPSB7XG4gIHV1aWQ/OiBVVUlEU3RyaW5nVHlwZTtcbiAgYWNpPzogVVVJRFN0cmluZ1R5cGU7XG4gIGUxNjQ/OiBzdHJpbmc7XG4gIHBuaT86IFVVSURTdHJpbmdUeXBlO1xufTtcblxuZGVzY3JpYmUoJ0NvbnZlcnNhdGlvbkNvbnRyb2xsZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdtYXliZU1lcmdlQ29udGFjdHMnLCAoKSA9PiB7XG4gICAgbGV0IG1lcmdlT2xkQW5kTmV3OiAob3B0aW9uczoge1xuICAgICAgbG9nSWQ6IHN0cmluZztcbiAgICAgIG9sZENvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWw7XG4gICAgICBuZXdDb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsO1xuICAgIH0pID0+IFByb21pc2U8dm9pZD47XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5fcmVtb3ZlQWxsQ29udmVyc2F0aW9ucygpO1xuXG4gICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5yZXNldCgpO1xuICAgICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9hZCgpO1xuXG4gICAgICBtZXJnZU9sZEFuZE5ldyA9ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXJnZU9sZEFuZE5ldzogU2hvdWxkIG5vdCBiZSBjYWxsZWQhJyk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgaXQoJ3Rocm93cyB3aGVuIHByb3ZpZGVkIG5vIGRhdGEnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgJ05lZWQgdG8gcHJvdmlkZSBhdCBsZWFzdCBvbmUnKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZShcbiAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgIHsgdXVpZCwgYWNpLCBlMTY0LCBwbmkgfTogUGFyYW1zVHlwZVxuICAgICk6IENvbnZlcnNhdGlvbk1vZGVsIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBhY2kgfHwgdXVpZCB8fCBlMTY0IHx8IHBuaTtcbiAgICAgIGNvbnN0IHNlcnZpY2VJZCA9IGFjaSB8fCB1dWlkIHx8IHBuaTtcblxuICAgICAgc3RyaWN0QXNzZXJ0KGlkZW50aWZpZXIsICdjcmVhdGUgbmVlZHMgYWNpLCBlMTY0LCBwbmksIG9yIHV1aWQnKTtcblxuICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3JDcmVhdGUoXG4gICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICdwcml2YXRlJyxcbiAgICAgICAgeyB1dWlkOiBzZXJ2aWNlSWQsIGUxNjQsIHBuaSB9XG4gICAgICApO1xuICAgICAgZXhwZWN0TG9va3Vwcyhjb252ZXJzYXRpb24sIG5hbWUsIHsgdXVpZCwgYWNpLCBlMTY0LCBwbmkgfSk7XG5cbiAgICAgIHJldHVybiBjb252ZXJzYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwZWN0TG9va3VwcyhcbiAgICAgIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQsXG4gICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICB7IHV1aWQsIGFjaSwgZTE2NCwgcG5pIH06IFBhcmFtc1R5cGVcbiAgICApIHtcbiAgICAgIGFzc2VydC5leGlzdHMoY29udmVyc2F0aW9uLCBgJHtuYW1lfSBjb252ZXJzYXRpb24gZXhpc3RzYCk7XG5cbiAgICAgIC8vIFZlcmlmeSB0aGF0IHRoaXMgY29udmVyc2F0aW9uIGhhc24ndCBiZWVuIGRlbGV0ZWRcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbj8uaWQpPy5pZCxcbiAgICAgICAgY29udmVyc2F0aW9uPy5pZCxcbiAgICAgICAgYCR7bmFtZX0gdnMuIGxvb2t1cCBieSBpZGBcbiAgICAgICk7XG5cbiAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQodXVpZCk/LmlkLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbj8uaWQsXG4gICAgICAgICAgYCR7bmFtZX0gdnMuIGxvb2t1cCBieSB1dWlkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGFjaSkge1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGFjaSk/LmlkLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbj8uaWQsXG4gICAgICAgICAgYCR7bmFtZX0gdnMuIGxvb2t1cCBieSBhY2lgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZTE2NCkge1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGUxNjQpPy5pZCxcbiAgICAgICAgICBjb252ZXJzYXRpb24/LmlkLFxuICAgICAgICAgIGAke25hbWV9IHZzLiBsb29rdXAgYnkgZTE2NGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChwbmkpIHtcbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChwbmkpPy5pZCxcbiAgICAgICAgICBjb252ZXJzYXRpb24/LmlkLFxuICAgICAgICAgIGAke25hbWV9IHZzLiBsb29rdXAgYnkgcG5pYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGVjdFByb3BzQW5kTG9va3VwcyhcbiAgICAgIGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwgfCB1bmRlZmluZWQsXG4gICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICB7IHV1aWQsIGFjaSwgZTE2NCwgcG5pIH06IFBhcmFtc1R5cGVcbiAgICApIHtcbiAgICAgIGFzc2VydC5leGlzdHMoY29udmVyc2F0aW9uLCBgJHtuYW1lfSBjb252ZXJzYXRpb24gZXhpc3RzYCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIGNvbnZlcnNhdGlvbj8uZ2V0KCd1dWlkJyksXG4gICAgICAgIGFjaSB8fCB1dWlkLFxuICAgICAgICBgJHtuYW1lfSB1dWlkIG1hdGNoZXNgXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICBjb252ZXJzYXRpb24/LmdldCgnZTE2NCcpLFxuICAgICAgICBlMTY0LFxuICAgICAgICBgJHtuYW1lfSBlMTY0IG1hdGNoZXNgXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGNvbnZlcnNhdGlvbj8uZ2V0KCdwbmknKSwgcG5pLCBgJHtuYW1lfSBwbmkgbWF0Y2hlc2ApO1xuXG4gICAgICBleHBlY3RMb29rdXBzKGNvbnZlcnNhdGlvbiwgbmFtZSwgeyB1dWlkLCBlMTY0LCBwbmkgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwZWN0RGVsZXRlZChjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbi5pZCksXG4gICAgICAgIGAke25hbWV9IGhhcyBiZWVuIGRlbGV0ZWRgXG4gICAgICApO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdub24tZGVzdHJ1Y3RpdmUgdXBkYXRlcycsICgpID0+IHtcbiAgICAgIGl0KCdjcmVhdGVzIGEgbmV3IGNvbnZlcnNhdGlvbiB3aXRoIGp1c3QgQUNJIGlmIG5vIG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlY29uZCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhzZWNvbmQsICdzZWNvbmQnLCB7XG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIHNlY29uZD8uaWQsICdyZXN1bHQgYW5kIHNlY29uZCBtYXRjaCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnY3JlYXRlcyBhIG5ldyBjb252ZXJzYXRpb24gd2l0aCBqdXN0IGUxNjQgaWYgbm8gbWF0Y2hlcycsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2Vjb25kID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMoc2Vjb25kLCAnc2Vjb25kJywge1xuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIHNlY29uZD8uaWQsICdyZXN1bHQgYW5kIHNlY29uZCBtYXRjaCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnY3JlYXRlcyBhIG5ldyBjb252ZXJzYXRpb24gd2l0aCBhbGwgZGF0YSBpZiBubyBtYXRjaGVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzZWNvbmQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMoc2Vjb25kLCAnc2Vjb25kJywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0Py5pZCwgc2Vjb25kPy5pZCwgJ3Jlc3VsdCBhbmQgc2Vjb25kIG1hdGNoJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2ZldGNoZXMgYWxsLWRhdGEgY29udmVyc2F0aW9uIHdpdGggQUNJLW9ubHkgcXVlcnknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWwgPSBjcmVhdGUoJ2luaXRpYWwnLCB7XG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIGluaXRpYWw/LmlkLCAncmVzdWx0IGFuZCBpbml0aWFsIG1hdGNoJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2ZldGNoZXMgYWxsLWRhdGEgY29udmVyc2F0aW9uIHdpdGggZTE2NCtQTkkgcXVlcnknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWwgPSBjcmVhdGUoJ2luaXRpYWwnLCB7XG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQ/LmlkLCBpbml0aWFsPy5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhZGRzIEFDSSB0byBjb252ZXJzYXRpb24gd2l0aCBlMTY0K1BOSScsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpbml0aWFsPy5pZCwgcmVzdWx0Py5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnYWRkcyBBQ0kgKHZpYSBBQ0krUE5JKSB0byBjb252ZXJzYXRpb24gd2l0aCBlMTY0K1BOSScsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICB1dWlkOiBQTklfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3Vwcyhpbml0aWFsLCAnaW5pdGlhbCcsIHtcbiAgICAgICAgICB1dWlkOiBQTklfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpbml0aWFsPy5pZCwgcmVzdWx0Py5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhZGRzIGUxNjQrUE5JIHRvIGNvbnZlcnNhdGlvbiB3aXRoIGp1c3QgQUNJJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIGluaXRpYWw/LmlkLCAncmVzdWx0IGFuZCBpbml0aWFsIG1hdGNoJyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdhZGRzIGUxNjQgdG8gY29udmVyc2F0aW9uIHdpdGggQUNJK1BOSScsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0Py5pZCwgaW5pdGlhbD8uaWQsICdyZXN1bHQgYW5kIGluaXRpYWwgbWF0Y2gnKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2FkZHMgUE5JIHRvIGNvbnZlcnNhdGlvbiB3aXRoIEFDSStlMTY0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGluaXRpYWw/LmlkLCByZXN1bHQ/LmlkLCAncmVzdWx0IGFuZCBpbml0aWFsIG1hdGNoJyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdhZGRzIFBOSSB0byBjb252ZXJzYXRpb24gd2l0aCBqdXN0IGUxNjQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWwgPSBjcmVhdGUoJ2luaXRpYWwnLCB7XG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogUE5JXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpbml0aWFsPy5pZCwgcmVzdWx0Py5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnYWRkcyBQTkkrQUNJIHRvIGNvbnZlcnNhdGlvbiB3aXRoIGp1c3QgZTE2NCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChpbml0aWFsPy5pZCwgcmVzdWx0Py5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnYWRkcyBBQ0krZTE2NCB0byBjb252ZXJzYXRpb24gd2l0aCBqdXN0IFBOSScsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoaW5pdGlhbD8uaWQsIHJlc3VsdD8uaWQsICdyZXN1bHQgYW5kIGluaXRpYWwgbWF0Y2gnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncHJvbW90ZXMgUE5JIHVzZWQgYXMgZ2VuZXJpYyBVVUlEIHRvIGJlIGluIHRoZSBQTkkgZmllbGQgYXMgd2VsbCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBhY2k6IFBOSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3Vwcyhpbml0aWFsLCAnaW5pdGlhbCcsIHtcbiAgICAgICAgICB1dWlkOiBQTklfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBQTklfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGluaXRpYWw/LmlkLCByZXN1bHQ/LmlkLCAncmVzdWx0IGFuZCBpbml0aWFsIG1hdGNoJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGRlc3RydWN0aXZlIHVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgICBpdCgncmVwbGFjZXMgZTE2NCtQTkkgaW4gY29udmVyc2F0aW9uIHdpdGggbWF0Y2hpbmcgQUNJJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8yLFxuICAgICAgICAgIHBuaTogUE5JXzIsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzIsXG4gICAgICAgICAgcG5pOiBQTklfMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChFMTY0XzEpLFxuICAgICAgICAgICdvbGQgZTE2NCBubyBsb25nZXIgZm91bmQnXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoUE5JXzEpLFxuICAgICAgICAgICdvbGQgcG5pIG5vIGxvbmdlciBmb3VuZCdcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0Py5pZCwgaW5pdGlhbD8uaWQsICdyZXN1bHQgYW5kIGluaXRpYWwgbWF0Y2gnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmVwbGFjZXMgUE5JIGluIGNvbnZlcnNhdGlvbiB3aXRoIGUxNjQrUE5JJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIHBuaTogUE5JXzIsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogUE5JXzIsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoUE5JXzEpLFxuICAgICAgICAgICdvbGQgcG5pIG5vIGxvbmdlciBmb3VuZCdcbiAgICAgICAgKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0Py5pZCwgaW5pdGlhbD8uaWQsICdyZXN1bHQgYW5kIGluaXRpYWwgbWF0Y2gnKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlcGxhY2VzIFBOSSBpbiBjb252ZXJzYXRpb24gd2l0aCBhbGwgZGF0YScsICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbCA9IGNyZWF0ZSgnaW5pdGlhbCcsIHtcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzIsXG4gICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHJlc3VsdCwgJ3Jlc3VsdCcsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMSxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChQTklfMSksXG4gICAgICAgICAgJ29sZCBwbmkgbm8gbG9uZ2VyIGZvdW5kJ1xuICAgICAgICApO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChyZXN1bHQ/LmlkLCBpbml0aWFsPy5pZCwgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBtYXRjaCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZW1vdmVzIGUxNjQrUE5JIGZyb20gcHJldmlvdXMgY29udmVyc2F0aW9uIHdpdGggYW4gQUNJLCBhZGRzIGFsbCBkYXRhIHRvIG5ldyBjb252ZXJzYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWwgPSBjcmVhdGUoJ2luaXRpYWwnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLm1heWJlTWVyZ2VDb250YWN0cyh7XG4gICAgICAgICAgbWVyZ2VPbGRBbmROZXcsXG4gICAgICAgICAgYWNpOiBBQ0lfMixcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8yLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMoaW5pdGlhbCwgJ2luaXRpYWwnLCB7IHV1aWQ6IEFDSV8xIH0pO1xuXG4gICAgICAgIGFzc2VydC5ub3RTdHJpY3RFcXVhbChcbiAgICAgICAgICBpbml0aWFsPy5pZCxcbiAgICAgICAgICByZXN1bHQ/LmlkLFxuICAgICAgICAgICdyZXN1bHQgYW5kIGluaXRpYWwgc2hvdWxkIG5vdCBtYXRjaCdcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlbW92ZXMgZTE2NCtQTkkgZnJvbSBwcmV2aW91cyBjb252ZXJzYXRpb24gd2l0aCBhbiBBQ0ksIGFkZHMgdG8gQUNJIG1hdGNoJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIHV1aWQ6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYWNpT25seSA9IGNyZWF0ZSgnYWNpT25seScsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8yLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhhY2lPbmx5LCAnYWNpT25seScsIHtcbiAgICAgICAgICB1dWlkOiBBQ0lfMixcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKGluaXRpYWwsICdpbml0aWFsJywgeyB1dWlkOiBBQ0lfMSB9KTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgYWNpT25seT8uaWQsXG4gICAgICAgICAgcmVzdWx0Py5pZCxcbiAgICAgICAgICAncmVzdWx0IGFuZCBhY2lPbmx5IHNob3VsZCBtYXRjaCdcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmVtb3ZlcyBQTkkgZnJvbSBwcmV2aW91cyBjb252ZXJzYXRpb24sIGFkZHMgaXQgdG8gZTE2NC1vbmx5IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB3aXRoRTE2NCA9IGNyZWF0ZSgnd2l0aEUxNjQnLCB7XG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aFBOSSA9IGNyZWF0ZSgnd2l0aFBOSScsIHtcbiAgICAgICAgICBlMTY0OiBFMTY0XzIsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgICByZWFzb24sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMocmVzdWx0LCAncmVzdWx0Jywge1xuICAgICAgICAgIHV1aWQ6IFBOSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMod2l0aFBOSSwgJ3dpdGhQTkknLCB7IGUxNjQ6IEUxNjRfMiB9KTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgd2l0aEUxNjQ/LmlkLFxuICAgICAgICAgIHJlc3VsdD8uaWQsXG4gICAgICAgICAgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBzaG91bGQgbWF0Y2gnXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZW1vdmVzIFBOSSBmcm9tIHByZXZpb3VzIGNvbnZlcnNhdGlvbiwgYWRkcyBpdCBuZXcgZTE2NCtQTkkgY29udmVyc2F0aW9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBpbml0aWFsID0gY3JlYXRlKCdpbml0aWFsJywge1xuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMixcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogUE5JXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8yLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3Vwcyhpbml0aWFsLCAnaW5pdGlhbCcsIHsgZTE2NDogRTE2NF8xIH0pO1xuXG4gICAgICAgIGFzc2VydC5ub3RTdHJpY3RFcXVhbChcbiAgICAgICAgICBpbml0aWFsPy5pZCxcbiAgICAgICAgICByZXN1bHQ/LmlkLFxuICAgICAgICAgICdyZXN1bHQgYW5kIGluaXRpYWwgc2hvdWxkIG5vdCBtYXRjaCdcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2RlbGV0ZXMgUE5JLW9ubHkgcHJldmlvdXMgY29udmVyc2F0aW9uLCBhZGRzIGl0IHRvIGUxNjQgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICAgIG1lcmdlT2xkQW5kTmV3ID0gKHsgb2xkQ29udmVyc2F0aW9uIH0pID0+IHtcbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5kYW5nZXJvdXNseVJlbW92ZUJ5SWQoXG4gICAgICAgICAgICBvbGRDb252ZXJzYXRpb24uaWRcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB3aXRoRTE2NCA9IGNyZWF0ZSgnd2l0aEUxNjQnLCB7XG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aFBOSSA9IGNyZWF0ZSgnd2l0aFBOSScsIHtcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogUE5JXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdERlbGV0ZWQod2l0aFBOSSwgJ3dpdGhQTkknKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgd2l0aEUxNjQ/LmlkLFxuICAgICAgICAgIHJlc3VsdD8uaWQsXG4gICAgICAgICAgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBzaG91bGQgbWF0Y2gnXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdkZWxldGVzIHByZXZpb3VzIGNvbnZlcnNhdGlvbiB3aXRoIFBOSSBhcyBVVUlEIG9ubHksIGFkZHMgaXQgdG8gZTE2NCBtYXRjaCcsICgpID0+IHtcbiAgICAgICAgbWVyZ2VPbGRBbmROZXcgPSAoeyBvbGRDb252ZXJzYXRpb24gfSkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmRhbmdlcm91c2x5UmVtb3ZlQnlJZChcbiAgICAgICAgICAgIG9sZENvbnZlcnNhdGlvbi5pZFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHdpdGhFMTY0ID0gY3JlYXRlKCd3aXRoRTE2NCcsIHtcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB3aXRoUE5JID0gY3JlYXRlKCd3aXRoUE5JJywge1xuICAgICAgICAgIHV1aWQ6IFBOSV8xLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5tYXliZU1lcmdlQ29udGFjdHMoe1xuICAgICAgICAgIG1lcmdlT2xkQW5kTmV3LFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogUE5JXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdERlbGV0ZWQod2l0aFBOSSwgJ3dpdGhQTkknKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgICAgd2l0aEUxNjQ/LmlkLFxuICAgICAgICAgIHJlc3VsdD8uaWQsXG4gICAgICAgICAgJ3Jlc3VsdCBhbmQgaW5pdGlhbCBzaG91bGQgbWF0Y2gnXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdkZWxldGVzIGUxNjQrUE5JIHByZXZpb3VzIGNvbnZlcnNhdGlvbiwgYWRkcyBkYXRhIHRvIEFDSSBtYXRjaCcsICgpID0+IHtcbiAgICAgICAgbWVyZ2VPbGRBbmROZXcgPSAoeyBvbGRDb252ZXJzYXRpb24gfSkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmRhbmdlcm91c2x5UmVtb3ZlQnlJZChcbiAgICAgICAgICAgIG9sZENvbnZlcnNhdGlvbi5pZFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHdpdGhFMTY0ID0gY3JlYXRlKCd3aXRoRTE2NCcsIHtcbiAgICAgICAgICBlMTY0OiBFMTY0XzEsXG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHdpdGhBQ0kgPSBjcmVhdGUoJ3dpdGhQTkknLCB7XG4gICAgICAgICAgYWNpOiBBQ0lfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdERlbGV0ZWQod2l0aEUxNjQsICd3aXRoRTE2NCcpO1xuXG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgICB3aXRoQUNJPy5pZCxcbiAgICAgICAgICByZXN1bHQ/LmlkLFxuICAgICAgICAgICdyZXN1bHQgYW5kIGluaXRpYWwgc2hvdWxkIG1hdGNoJ1xuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdoYW5kbGVzIHRocmVlIG1hdGNoaW5nIGNvbnZlcnNhdGlvbnM6IEFDSS1vbmx5LCB3aXRoIEUxNjQsIGFuZCB3aXRoIFBOSScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2l0aEFDSSA9IGNyZWF0ZSgnd2l0aEFDSScsIHtcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aEUxNjQgPSBjcmVhdGUoJ3dpdGhFMTY0Jywge1xuICAgICAgICAgIGFjaTogQUNJXzIsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aFBOSSA9IGNyZWF0ZSgnd2l0aFBOSScsIHtcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMod2l0aEUxNjQsICd3aXRoRTE2NCcsIHsgYWNpOiBBQ0lfMiB9KTtcbiAgICAgICAgZXhwZWN0UHJvcHNBbmRMb29rdXBzKHdpdGhQTkksICd3aXRoUE5JJywgeyBlMTY0OiBFMTY0XzIgfSk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIHdpdGhBQ0k/LmlkLCAncmVzdWx0IGFuZCB3aXRoQUNJIG1hdGNoJyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdoYW5kbGVzIHRocmVlIG1hdGNoaW5nIGNvbnZlcnNhdGlvbnM6IEFDSS1vbmx5LCBFMTY0LW9ubHkgKGRlbGV0ZWQpLCBhbmQgd2l0aCBQTkknLCAoKSA9PiB7XG4gICAgICAgIG1lcmdlT2xkQW5kTmV3ID0gKHsgb2xkQ29udmVyc2F0aW9uIH0pID0+IHtcbiAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5kYW5nZXJvdXNseVJlbW92ZUJ5SWQoXG4gICAgICAgICAgICBvbGRDb252ZXJzYXRpb24uaWRcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB3aXRoQUNJID0gY3JlYXRlKCd3aXRoQUNJJywge1xuICAgICAgICAgIGFjaTogQUNJXzEsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB3aXRoRTE2NCA9IGNyZWF0ZSgnd2l0aEUxNjQnLCB7XG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aFBOSSA9IGNyZWF0ZSgnd2l0aFBOSScsIHtcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3RQcm9wc0FuZExvb2t1cHMod2l0aFBOSSwgJ3dpdGhQTkknLCB7IGUxNjQ6IEUxNjRfMiB9KTtcblxuICAgICAgICBleHBlY3REZWxldGVkKHdpdGhFMTY0LCAnd2l0aEUxNjQnKTtcblxuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwocmVzdWx0Py5pZCwgd2l0aEFDST8uaWQsICdyZXN1bHQgYW5kIHdpdGhBQ0kgbWF0Y2gnKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ21lcmdlcyB0aHJlZSBtYXRjaGluZyBjb252ZXJzYXRpb25zOiBBQ0ktb25seSwgRTE2NC1vbmx5IChkZWxldGVkKSwgUE5JLW9ubHkgKGRlbGV0ZWQpJywgKCkgPT4ge1xuICAgICAgICBtZXJnZU9sZEFuZE5ldyA9ICh7IG9sZENvbnZlcnNhdGlvbiB9KSA9PiB7XG4gICAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZGFuZ2Vyb3VzbHlSZW1vdmVCeUlkKFxuICAgICAgICAgICAgb2xkQ29udmVyc2F0aW9uLmlkXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgd2l0aEFDSSA9IGNyZWF0ZSgnd2l0aEFDSScsIHtcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd2l0aEUxNjQgPSBjcmVhdGUoJ3dpdGhFMTY0Jywge1xuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHdpdGhQTkkgPSBjcmVhdGUoJ3dpdGhQTkknLCB7XG4gICAgICAgICAgcG5pOiBQTklfMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBtZXJnZU9sZEFuZE5ldyxcbiAgICAgICAgICBhY2k6IEFDSV8xLFxuICAgICAgICAgIGUxNjQ6IEUxNjRfMSxcbiAgICAgICAgICBwbmk6IFBOSV8xLFxuICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdFByb3BzQW5kTG9va3VwcyhyZXN1bHQsICdyZXN1bHQnLCB7XG4gICAgICAgICAgdXVpZDogQUNJXzEsXG4gICAgICAgICAgZTE2NDogRTE2NF8xLFxuICAgICAgICAgIHBuaTogUE5JXzEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdERlbGV0ZWQod2l0aFBOSSwgJ3dpdGhQTkknKTtcbiAgICAgICAgZXhwZWN0RGVsZXRlZCh3aXRoRTE2NCwgJ3dpdGhFMTY0Jyk7XG5cbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdD8uaWQsIHdpdGhBQ0k/LmlkLCAncmVzdWx0IGFuZCB3aXRoQUNJIG1hdGNoJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59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
