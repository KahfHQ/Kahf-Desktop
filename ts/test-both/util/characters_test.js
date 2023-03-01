var import_chai = require("chai");
var import_characters = require("../../util/characters");
describe("character utilities", () => {
  describe("count", () => {
    it("returns the number of characters in a string (not necessarily the length)", () => {
      import_chai.assert.strictEqual((0, import_characters.count)(""), 0);
      import_chai.assert.strictEqual((0, import_characters.count)("hello"), 5);
      import_chai.assert.strictEqual((0, import_characters.count)("Bokm\xE5l"), 6);
      import_chai.assert.strictEqual((0, import_characters.count)("\u{1F4A9}\u{1F4A9}\u{1F4A9}"), 3);
      import_chai.assert.strictEqual((0, import_characters.count)("\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F469}"), 6);
      import_chai.assert.strictEqual((0, import_characters.count)("Z\u0351\u036B\u0343\u036A\u0302\u036B\u033D\u034F\u0334\u0319\u0324\u031E\u0349\u035A\u032F\u031E\u0320\u034DA\u036B\u0357\u0334\u0362\u0335\u031C\u0330\u0354L\u0368\u0367\u0369\u0358\u0320G\u0311\u0357\u030E\u0305\u035B\u0341\u0334\u033B\u0348\u034D\u0354\u0339O\u0342\u030C\u030C\u0358\u0328\u0335\u0339\u033B\u031D\u0333"), 58);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2hhcmFjdGVyc190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgeyBjb3VudCB9IGZyb20gJy4uLy4uL3V0aWwvY2hhcmFjdGVycyc7XG5cbmRlc2NyaWJlKCdjaGFyYWN0ZXIgdXRpbGl0aWVzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY291bnQnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nIChub3QgbmVjZXNzYXJpbHkgdGhlIGxlbmd0aCknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY291bnQoJycpLCAwKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChjb3VudCgnaGVsbG8nKSwgNSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY291bnQoJ0Jva21cdTAwRTVsJyksIDYpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGNvdW50KCdcdUQ4M0RcdURDQTlcdUQ4M0RcdURDQTlcdUQ4M0RcdURDQTknKSwgMyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY291bnQoJ1x1RDgzRFx1REM2OVx1MjAwRFx1Mjc2NFx1RkUwRlx1MjAwRFx1RDgzRFx1REM2OScpLCA2KTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChjb3VudCgnWlx1MDM1MVx1MDM2Qlx1MDM0M1x1MDM2QVx1MDMwMlx1MDM2Qlx1MDMzRFx1MDM0Rlx1MDMzNFx1MDMxOVx1MDMyNFx1MDMxRVx1MDM0OVx1MDM1QVx1MDMyRlx1MDMxRVx1MDMyMFx1MDM0REFcdTAzNkJcdTAzNTdcdTAzMzRcdTAzNjJcdTAzMzVcdTAzMUNcdTAzMzBcdTAzNTRMXHUwMzY4XHUwMzY3XHUwMzY5XHUwMzU4XHUwMzIwR1x1MDMxMVx1MDM1N1x1MDMwRVx1MDMwNVx1MDM1Qlx1MDM0MVx1MDMzNFx1MDMzQlx1MDM0OFx1MDM0RFx1MDM1NFx1MDMzOU9cdTAzNDJcdTAzMENcdTAzMENcdTAzNThcdTAzMjhcdTAzMzVcdTAzMzlcdTAzM0JcdTAzMURcdTAzMzMnKSwgNTgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0Esa0JBQXVCO0FBRXZCLHdCQUFzQjtBQUV0QixTQUFTLHVCQUF1QixNQUFNO0FBQ3BDLFdBQVMsU0FBUyxNQUFNO0FBQ3RCLE9BQUcsNkVBQTZFLE1BQU07QUFDcEYseUJBQU8sWUFBWSw2QkFBTSxFQUFFLEdBQUcsQ0FBQztBQUMvQix5QkFBTyxZQUFZLDZCQUFNLE9BQU8sR0FBRyxDQUFDO0FBQ3BDLHlCQUFPLFlBQVksNkJBQU0sV0FBUSxHQUFHLENBQUM7QUFDckMseUJBQU8sWUFBWSw2QkFBTSw2QkFBUSxHQUFHLENBQUM7QUFDckMseUJBQU8sWUFBWSw2QkFBTSw0Q0FBVSxHQUFHLENBQUM7QUFDdkMseUJBQU8sWUFBWSw2QkFBTSxxVUFBNEQsR0FBRyxFQUFFO0FBQUEsSUFDNUYsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
