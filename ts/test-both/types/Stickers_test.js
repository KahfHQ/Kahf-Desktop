var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var Stickers = __toESM(require("../../types/Stickers"));
describe("Stickers", () => {
  describe("getDataFromLink", () => {
    it("returns undefined for invalid URLs", () => {
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://"));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("signal.art/addstickers/"));
    });
    it("returns undefined for URLs that don't have a hash", () => {
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/"));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#"));
    });
    it("returns undefined when no key or pack ID is found", () => {
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a"));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key="));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_id="));
    });
    it("returns undefined when the pack ID is invalid", () => {
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=garbage&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"));
    });
    it("returns undefined if the ID or key are passed as arrays", () => {
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id[]=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"));
      import_chai.assert.isUndefined(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key[]=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"));
    });
    it("parses the ID and key from the hash", () => {
      import_chai.assert.deepEqual(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"), {
        id: "c8c83285b547872ac4c589d64a6edd6a",
        key: "59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"
      });
    });
    it("ignores additional hash parameters", () => {
      import_chai.assert.deepEqual(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_foo=bar"), {
        id: "c8c83285b547872ac4c589d64a6edd6a",
        key: "59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"
      });
    });
    it("only parses the first ID and key from the hash if more than one is supplied", () => {
      import_chai.assert.deepEqual(Stickers.getDataFromLink("https://signal.art/addstickers/#pack_id=c8c83285b547872ac4c589d64a6edd6a&pack_key=59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e&pack_id=extra&pack_key=extra"), {
        id: "c8c83285b547872ac4c589d64a6edd6a",
        key: "59bb3a8860f0e6a5a83a5337a015c8d55ecd2193f82d77202f3b8112a845636e"
      });
    });
  });
  describe("isPackIdValid", () => {
    it("returns false for non-strings", () => {
      import_chai.assert.isFalse(Stickers.isPackIdValid(void 0));
      import_chai.assert.isFalse(Stickers.isPackIdValid(null));
      import_chai.assert.isFalse(Stickers.isPackIdValid(123));
      import_chai.assert.isFalse(Stickers.isPackIdValid(123));
      import_chai.assert.isFalse(Stickers.isPackIdValid(["b9439fa5fdc8b9873fe64f01b88b8ccf"]));
      import_chai.assert.isFalse(Stickers.isPackIdValid(new String("b9439fa5fdc8b9873fe64f01b88b8ccf")));
    });
    it("returns false for invalid pack IDs", () => {
      import_chai.assert.isFalse(Stickers.isPackIdValid(""));
      import_chai.assert.isFalse(Stickers.isPackIdValid("x9439fa5fdc8b9873fe64f01b88b8ccf"));
      import_chai.assert.isFalse(Stickers.isPackIdValid("b9439fa5fdc8b9873fe64f01b88b8cc"));
      import_chai.assert.isFalse(Stickers.isPackIdValid("b9439fa5fdc8b9873fe64f01b88b8ccfa"));
    });
    it("returns true for valid pack IDs", () => {
      import_chai.assert.isTrue(Stickers.isPackIdValid("b9439fa5fdc8b9873fe64f01b88b8ccf"));
      import_chai.assert.isTrue(Stickers.isPackIdValid("3eff225a1036a58a7530b312dd92f8d8"));
      import_chai.assert.isTrue(Stickers.isPackIdValid("DDFD48B8097DA7A4E928192B10963F6A"));
    });
  });
  describe("redactPackId", () => {
    it("redacts pack IDs", () => {
      import_chai.assert.strictEqual(Stickers.redactPackId("b9439fa5fdc8b9873fe64f01b88b8ccf"), "[REDACTED]ccf");
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3RpY2tlcnNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgU3RpY2tlcnMgZnJvbSAnLi4vLi4vdHlwZXMvU3RpY2tlcnMnO1xuXG5kZXNjcmliZSgnU3RpY2tlcnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZXREYXRhRnJvbUxpbmsnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdW5kZWZpbmVkIGZvciBpbnZhbGlkIFVSTHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKCdodHRwczovLycpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoJ3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvJykpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXR1cm5zIHVuZGVmaW5lZCBmb3IgVVJMcyB0aGF0IGRvbid0IGhhdmUgYSBoYXNoXCIsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKCdodHRwczovL3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvJylcbiAgICAgICk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoXG4gICAgICAgIFN0aWNrZXJzLmdldERhdGFGcm9tTGluaygnaHR0cHM6Ly9zaWduYWwuYXJ0L2FkZHN0aWNrZXJzLyMnKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHVuZGVmaW5lZCB3aGVuIG5vIGtleSBvciBwYWNrIElEIGlzIGZvdW5kJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICBTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoXG4gICAgICAgICAgJ2h0dHBzOi8vc2lnbmFsLmFydC9hZGRzdGlja2Vycy8jcGFja19pZD1jOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKFxuICAgICAgICAgICdodHRwczovL3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvI3BhY2tfaWQ9YzhjODMyODViNTQ3ODcyYWM0YzU4OWQ2NGE2ZWRkNmEmcGFja19rZXk9J1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICBTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoXG4gICAgICAgICAgJ2h0dHBzOi8vc2lnbmFsLmFydC9hZGRzdGlja2Vycy8jcGFja19rZXk9NTliYjNhODg2MGYwZTZhNWE4M2E1MzM3YTAxNWM4ZDU1ZWNkMjE5M2Y4MmQ3NzIwMmYzYjgxMTJhODQ1NjM2ZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKFxuICAgICAgICAgICdodHRwczovL3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvI3BhY2tfa2V5PTU5YmIzYTg4NjBmMGU2YTVhODNhNTMzN2EwMTVjOGQ1NWVjZDIxOTNmODJkNzcyMDJmM2I4MTEyYTg0NTYzNmUmcGFja19pZD0nXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgd2hlbiB0aGUgcGFjayBJRCBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICBTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoXG4gICAgICAgICAgJ2h0dHBzOi8vc2lnbmFsLmFydC9hZGRzdGlja2Vycy8jcGFja19pZD1nYXJiYWdlJnBhY2tfa2V5PTU5YmIzYTg4NjBmMGU2YTVhODNhNTMzN2EwMTVjOGQ1NWVjZDIxOTNmODJkNzcyMDJmM2I4MTEyYTg0NTYzNmUnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGhlIElEIG9yIGtleSBhcmUgcGFzc2VkIGFzIGFycmF5cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChcbiAgICAgICAgU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKFxuICAgICAgICAgICdodHRwczovL3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvI3BhY2tfaWRbXT1jOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YSZwYWNrX2tleT01OWJiM2E4ODYwZjBlNmE1YTgzYTUzMzdhMDE1YzhkNTVlY2QyMTkzZjgyZDc3MjAyZjNiODExMmE4NDU2MzZlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKFxuICAgICAgICBTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoXG4gICAgICAgICAgJ2h0dHBzOi8vc2lnbmFsLmFydC9hZGRzdGlja2Vycy8jcGFja19pZD1jOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YSZwYWNrX2tleVtdPTU5YmIzYTg4NjBmMGU2YTVhODNhNTMzN2EwMTVjOGQ1NWVjZDIxOTNmODJkNzcyMDJmM2I4MTEyYTg0NTYzNmUnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncGFyc2VzIHRoZSBJRCBhbmQga2V5IGZyb20gdGhlIGhhc2gnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBTdGlja2Vycy5nZXREYXRhRnJvbUxpbmsoXG4gICAgICAgICAgJ2h0dHBzOi8vc2lnbmFsLmFydC9hZGRzdGlja2Vycy8jcGFja19pZD1jOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YSZwYWNrX2tleT01OWJiM2E4ODYwZjBlNmE1YTgzYTUzMzdhMDE1YzhkNTVlY2QyMTkzZjgyZDc3MjAyZjNiODExMmE4NDU2MzZlJ1xuICAgICAgICApLFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YScsXG4gICAgICAgICAga2V5OiAnNTliYjNhODg2MGYwZTZhNWE4M2E1MzM3YTAxNWM4ZDU1ZWNkMjE5M2Y4MmQ3NzIwMmYzYjgxMTJhODQ1NjM2ZScsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBhZGRpdGlvbmFsIGhhc2ggcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIFN0aWNrZXJzLmdldERhdGFGcm9tTGluayhcbiAgICAgICAgICAnaHR0cHM6Ly9zaWduYWwuYXJ0L2FkZHN0aWNrZXJzLyNwYWNrX2lkPWM4YzgzMjg1YjU0Nzg3MmFjNGM1ODlkNjRhNmVkZDZhJnBhY2tfa2V5PTU5YmIzYTg4NjBmMGU2YTVhODNhNTMzN2EwMTVjOGQ1NWVjZDIxOTNmODJkNzcyMDJmM2I4MTEyYTg0NTYzNmUmcGFja19mb289YmFyJ1xuICAgICAgICApLFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YScsXG4gICAgICAgICAga2V5OiAnNTliYjNhODg2MGYwZTZhNWE4M2E1MzM3YTAxNWM4ZDU1ZWNkMjE5M2Y4MmQ3NzIwMmYzYjgxMTJhODQ1NjM2ZScsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnb25seSBwYXJzZXMgdGhlIGZpcnN0IElEIGFuZCBrZXkgZnJvbSB0aGUgaGFzaCBpZiBtb3JlIHRoYW4gb25lIGlzIHN1cHBsaWVkJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgU3RpY2tlcnMuZ2V0RGF0YUZyb21MaW5rKFxuICAgICAgICAgICdodHRwczovL3NpZ25hbC5hcnQvYWRkc3RpY2tlcnMvI3BhY2tfaWQ9YzhjODMyODViNTQ3ODcyYWM0YzU4OWQ2NGE2ZWRkNmEmcGFja19rZXk9NTliYjNhODg2MGYwZTZhNWE4M2E1MzM3YTAxNWM4ZDU1ZWNkMjE5M2Y4MmQ3NzIwMmYzYjgxMTJhODQ1NjM2ZSZwYWNrX2lkPWV4dHJhJnBhY2tfa2V5PWV4dHJhJ1xuICAgICAgICApLFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdjOGM4MzI4NWI1NDc4NzJhYzRjNTg5ZDY0YTZlZGQ2YScsXG4gICAgICAgICAga2V5OiAnNTliYjNhODg2MGYwZTZhNWE4M2E1MzM3YTAxNWM4ZDU1ZWNkMjE5M2Y4MmQ3NzIwMmYzYjgxMTJhODQ1NjM2ZScsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpc1BhY2tJZFZhbGlkJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBub24tc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFN0aWNrZXJzLmlzUGFja0lkVmFsaWQodW5kZWZpbmVkKSk7XG4gICAgICBhc3NlcnQuaXNGYWxzZShTdGlja2Vycy5pc1BhY2tJZFZhbGlkKG51bGwpKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoMTIzKSk7XG4gICAgICBhc3NlcnQuaXNGYWxzZShTdGlja2Vycy5pc1BhY2tJZFZhbGlkKDEyMykpO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoXG4gICAgICAgIFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoWydiOTQzOWZhNWZkYzhiOTg3M2ZlNjRmMDFiODhiOGNjZiddKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LXdyYXBwZXJzXG4gICAgICAgIFN0aWNrZXJzLmlzUGFja0lkVmFsaWQobmV3IFN0cmluZygnYjk0MzlmYTVmZGM4Yjk4NzNmZTY0ZjAxYjg4YjhjY2YnKSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgaW52YWxpZCBwYWNrIElEcycsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoJycpKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFxuICAgICAgICBTdGlja2Vycy5pc1BhY2tJZFZhbGlkKCd4OTQzOWZhNWZkYzhiOTg3M2ZlNjRmMDFiODhiOGNjZicpXG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzRmFsc2UoXG4gICAgICAgIC8vIFRoaXMgaXMgb25lIGNoYXJhY3RlciB0b28gc2hvcnQuXG4gICAgICAgIFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoJ2I5NDM5ZmE1ZmRjOGI5ODczZmU2NGYwMWI4OGI4Y2MnKVxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc0ZhbHNlKFxuICAgICAgICAvLyBUaGlzIGlzIG9uZSBjaGFyYWN0ZXIgdG9vIGxvbmcuXG4gICAgICAgIFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoJ2I5NDM5ZmE1ZmRjOGI5ODczZmU2NGYwMWI4OGI4Y2NmYScpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgdmFsaWQgcGFjayBJRHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKFN0aWNrZXJzLmlzUGFja0lkVmFsaWQoJ2I5NDM5ZmE1ZmRjOGI5ODczZmU2NGYwMWI4OGI4Y2NmJykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShTdGlja2Vycy5pc1BhY2tJZFZhbGlkKCczZWZmMjI1YTEwMzZhNThhNzUzMGIzMTJkZDkyZjhkOCcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoU3RpY2tlcnMuaXNQYWNrSWRWYWxpZCgnRERGRDQ4QjgwOTdEQTdBNEU5MjgxOTJCMTA5NjNGNkEnKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyZWRhY3RQYWNrSWQnLCAoKSA9PiB7XG4gICAgaXQoJ3JlZGFjdHMgcGFjayBJRHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgICAgIFN0aWNrZXJzLnJlZGFjdFBhY2tJZCgnYjk0MzlmYTVmZGM4Yjk4NzNmZTY0ZjAxYjg4YjhjY2YnKSxcbiAgICAgICAgJ1tSRURBQ1RFRF1jY2YnXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esa0JBQXVCO0FBQ3ZCLGVBQTBCO0FBRTFCLFNBQVMsWUFBWSxNQUFNO0FBQ3pCLFdBQVMsbUJBQW1CLE1BQU07QUFDaEMsT0FBRyxzQ0FBc0MsTUFBTTtBQUM3Qyx5QkFBTyxZQUFZLFNBQVMsZ0JBQWdCLFVBQVUsQ0FBQztBQUN2RCx5QkFBTyxZQUFZLFNBQVMsZ0JBQWdCLHlCQUF5QixDQUFDO0FBQUEsSUFDeEUsQ0FBQztBQUVELE9BQUcscURBQXFELE1BQU07QUFDNUQseUJBQU8sWUFDTCxTQUFTLGdCQUFnQixpQ0FBaUMsQ0FDNUQ7QUFDQSx5QkFBTyxZQUNMLFNBQVMsZ0JBQWdCLGtDQUFrQyxDQUM3RDtBQUFBLElBQ0YsQ0FBQztBQUVELE9BQUcscURBQXFELE1BQU07QUFDNUQseUJBQU8sWUFDTCxTQUFTLGdCQUNQLDBFQUNGLENBQ0Y7QUFDQSx5QkFBTyxZQUNMLFNBQVMsZ0JBQ1Asb0ZBQ0YsQ0FDRjtBQUNBLHlCQUFPLFlBQ0wsU0FBUyxnQkFDUCwyR0FDRixDQUNGO0FBQ0EseUJBQU8sWUFDTCxTQUFTLGdCQUNQLG9IQUNGLENBQ0Y7QUFBQSxJQUNGLENBQUM7QUFFRCxPQUFHLGlEQUFpRCxNQUFNO0FBQ3hELHlCQUFPLFlBQ0wsU0FBUyxnQkFDUCwySEFDRixDQUNGO0FBQUEsSUFDRixDQUFDO0FBRUQsT0FBRywyREFBMkQsTUFBTTtBQUNsRSx5QkFBTyxZQUNMLFNBQVMsZ0JBQ1Asc0pBQ0YsQ0FDRjtBQUNBLHlCQUFPLFlBQ0wsU0FBUyxnQkFDUCxzSkFDRixDQUNGO0FBQUEsSUFDRixDQUFDO0FBRUQsT0FBRyx1Q0FBdUMsTUFBTTtBQUM5Qyx5QkFBTyxVQUNMLFNBQVMsZ0JBQ1Asb0pBQ0YsR0FDQTtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osS0FBSztBQUFBLE1BQ1AsQ0FDRjtBQUFBLElBQ0YsQ0FBQztBQUVELE9BQUcsc0NBQXNDLE1BQU07QUFDN0MseUJBQU8sVUFDTCxTQUFTLGdCQUNQLGlLQUNGLEdBQ0E7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLEtBQUs7QUFBQSxNQUNQLENBQ0Y7QUFBQSxJQUNGLENBQUM7QUFFRCxPQUFHLCtFQUErRSxNQUFNO0FBQ3RGLHlCQUFPLFVBQ0wsU0FBUyxnQkFDUCxpTEFDRixHQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUCxDQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBRUQsV0FBUyxpQkFBaUIsTUFBTTtBQUM5QixPQUFHLGlDQUFpQyxNQUFNO0FBQ3hDLHlCQUFPLFFBQVEsU0FBUyxjQUFjLE1BQVMsQ0FBQztBQUNoRCx5QkFBTyxRQUFRLFNBQVMsY0FBYyxJQUFJLENBQUM7QUFDM0MseUJBQU8sUUFBUSxTQUFTLGNBQWMsR0FBRyxDQUFDO0FBQzFDLHlCQUFPLFFBQVEsU0FBUyxjQUFjLEdBQUcsQ0FBQztBQUMxQyx5QkFBTyxRQUNMLFNBQVMsY0FBYyxDQUFDLGtDQUFrQyxDQUFDLENBQzdEO0FBQ0EseUJBQU8sUUFFTCxTQUFTLGNBQWMsSUFBSSxPQUFPLGtDQUFrQyxDQUFDLENBQ3ZFO0FBQUEsSUFDRixDQUFDO0FBRUQsT0FBRyxzQ0FBc0MsTUFBTTtBQUM3Qyx5QkFBTyxRQUFRLFNBQVMsY0FBYyxFQUFFLENBQUM7QUFDekMseUJBQU8sUUFDTCxTQUFTLGNBQWMsa0NBQWtDLENBQzNEO0FBQ0EseUJBQU8sUUFFTCxTQUFTLGNBQWMsaUNBQWlDLENBQzFEO0FBQ0EseUJBQU8sUUFFTCxTQUFTLGNBQWMsbUNBQW1DLENBQzVEO0FBQUEsSUFDRixDQUFDO0FBRUQsT0FBRyxtQ0FBbUMsTUFBTTtBQUMxQyx5QkFBTyxPQUFPLFNBQVMsY0FBYyxrQ0FBa0MsQ0FBQztBQUN4RSx5QkFBTyxPQUFPLFNBQVMsY0FBYyxrQ0FBa0MsQ0FBQztBQUN4RSx5QkFBTyxPQUFPLFNBQVMsY0FBYyxrQ0FBa0MsQ0FBQztBQUFBLElBQzFFLENBQUM7QUFBQSxFQUNILENBQUM7QUFFRCxXQUFTLGdCQUFnQixNQUFNO0FBQzdCLE9BQUcsb0JBQW9CLE1BQU07QUFDM0IseUJBQU8sWUFDTCxTQUFTLGFBQWEsa0NBQWtDLEdBQ3hELGVBQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNILENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
