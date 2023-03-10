var import_chai = require("chai");
var import_UUID = require("../../types/UUID");
describe("isValidUuid", () => {
  const LOWERCASE_V4_UUID = "9cb737ce-2bb3-4c21-9fe0-d286caa0ca68";
  it("returns false for non-strings", () => {
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(void 0));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(null));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(1234));
  });
  it("returns false for non-UUID strings", () => {
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(""));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)("hello world"));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(` ${LOWERCASE_V4_UUID}`));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)(`${LOWERCASE_V4_UUID} `));
  });
  it("returns false for UUIDs that aren't version 4", () => {
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)("a200a6e0-d2d9-11eb-bda7-dd5936a30ddf"));
    import_chai.assert.isFalse((0, import_UUID.isValidUuid)("2adb8b83-4f2c-55ca-a481-7f98b716e615"));
  });
  it("returns true for v4 UUIDs", () => {
    import_chai.assert.isTrue((0, import_UUID.isValidUuid)(LOWERCASE_V4_UUID));
    import_chai.assert.isTrue((0, import_UUID.isValidUuid)(LOWERCASE_V4_UUID.toUpperCase()));
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVVVJRF90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgeyBpc1ZhbGlkVXVpZCB9IGZyb20gJy4uLy4uL3R5cGVzL1VVSUQnO1xuXG5kZXNjcmliZSgnaXNWYWxpZFV1aWQnLCAoKSA9PiB7XG4gIGNvbnN0IExPV0VSQ0FTRV9WNF9VVUlEID0gJzljYjczN2NlLTJiYjMtNGMyMS05ZmUwLWQyODZjYWEwY2E2OCc7XG5cbiAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIG5vbi1zdHJpbmdzJywgKCkgPT4ge1xuICAgIGFzc2VydC5pc0ZhbHNlKGlzVmFsaWRVdWlkKHVuZGVmaW5lZCkpO1xuICAgIGFzc2VydC5pc0ZhbHNlKGlzVmFsaWRVdWlkKG51bGwpKTtcbiAgICBhc3NlcnQuaXNGYWxzZShpc1ZhbGlkVXVpZCgxMjM0KSk7XG4gIH0pO1xuXG4gIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBub24tVVVJRCBzdHJpbmdzJywgKCkgPT4ge1xuICAgIGFzc2VydC5pc0ZhbHNlKGlzVmFsaWRVdWlkKCcnKSk7XG4gICAgYXNzZXJ0LmlzRmFsc2UoaXNWYWxpZFV1aWQoJ2hlbGxvIHdvcmxkJykpO1xuICAgIGFzc2VydC5pc0ZhbHNlKGlzVmFsaWRVdWlkKGAgJHtMT1dFUkNBU0VfVjRfVVVJRH1gKSk7XG4gICAgYXNzZXJ0LmlzRmFsc2UoaXNWYWxpZFV1aWQoYCR7TE9XRVJDQVNFX1Y0X1VVSUR9IGApKTtcbiAgfSk7XG5cbiAgaXQoXCJyZXR1cm5zIGZhbHNlIGZvciBVVUlEcyB0aGF0IGFyZW4ndCB2ZXJzaW9uIDRcIiwgKCkgPT4ge1xuICAgIGFzc2VydC5pc0ZhbHNlKGlzVmFsaWRVdWlkKCdhMjAwYTZlMC1kMmQ5LTExZWItYmRhNy1kZDU5MzZhMzBkZGYnKSk7XG4gICAgYXNzZXJ0LmlzRmFsc2UoaXNWYWxpZFV1aWQoJzJhZGI4YjgzLTRmMmMtNTVjYS1hNDgxLTdmOThiNzE2ZTYxNScpKTtcbiAgfSk7XG5cbiAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgdjQgVVVJRHMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmlzVHJ1ZShpc1ZhbGlkVXVpZChMT1dFUkNBU0VfVjRfVVVJRCkpO1xuICAgIGFzc2VydC5pc1RydWUoaXNWYWxpZFV1aWQoTE9XRVJDQVNFX1Y0X1VVSUQudG9VcHBlckNhc2UoKSkpO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0Esa0JBQXVCO0FBRXZCLGtCQUE0QjtBQUU1QixTQUFTLGVBQWUsTUFBTTtBQUM1QixRQUFNLG9CQUFvQjtBQUUxQixLQUFHLGlDQUFpQyxNQUFNO0FBQ3hDLHVCQUFPLFFBQVEsNkJBQVksTUFBUyxDQUFDO0FBQ3JDLHVCQUFPLFFBQVEsNkJBQVksSUFBSSxDQUFDO0FBQ2hDLHVCQUFPLFFBQVEsNkJBQVksSUFBSSxDQUFDO0FBQUEsRUFDbEMsQ0FBQztBQUVELEtBQUcsc0NBQXNDLE1BQU07QUFDN0MsdUJBQU8sUUFBUSw2QkFBWSxFQUFFLENBQUM7QUFDOUIsdUJBQU8sUUFBUSw2QkFBWSxhQUFhLENBQUM7QUFDekMsdUJBQU8sUUFBUSw2QkFBWSxJQUFJLG1CQUFtQixDQUFDO0FBQ25ELHVCQUFPLFFBQVEsNkJBQVksR0FBRyxvQkFBb0IsQ0FBQztBQUFBLEVBQ3JELENBQUM7QUFFRCxLQUFHLGlEQUFpRCxNQUFNO0FBQ3hELHVCQUFPLFFBQVEsNkJBQVksc0NBQXNDLENBQUM7QUFDbEUsdUJBQU8sUUFBUSw2QkFBWSxzQ0FBc0MsQ0FBQztBQUFBLEVBQ3BFLENBQUM7QUFFRCxLQUFHLDZCQUE2QixNQUFNO0FBQ3BDLHVCQUFPLE9BQU8sNkJBQVksaUJBQWlCLENBQUM7QUFDNUMsdUJBQU8sT0FBTyw2QkFBWSxrQkFBa0IsWUFBWSxDQUFDLENBQUM7QUFBQSxFQUM1RCxDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
