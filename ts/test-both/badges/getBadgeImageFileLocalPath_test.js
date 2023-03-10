var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_BadgeCategory = require("../../badges/BadgeCategory");
var import_BadgeImageTheme = require("../../badges/BadgeImageTheme");
var import_getBadgeImageFileLocalPath = require("../../badges/getBadgeImageFileLocalPath");
describe("getBadgeImageFileLocalPath", () => {
  const image = /* @__PURE__ */ __name((localPath) => ({
    localPath,
    url: "https://example.com/ignored.svg"
  }), "image");
  const badge = {
    category: import_BadgeCategory.BadgeCategory.Donor,
    descriptionTemplate: "foo bar",
    id: "foo",
    images: [
      ...["small", "medium", "large"].map((size) => ({
        [import_BadgeImageTheme.BadgeImageTheme.Dark]: image(`/${size}-dark.svg`),
        [import_BadgeImageTheme.BadgeImageTheme.Light]: image(void 0)
      })),
      { [import_BadgeImageTheme.BadgeImageTheme.Transparent]: image("/huge-trns.svg") }
    ],
    name: "Test Badge"
  };
  it("returns undefined if passed no badge", () => {
    import_chai.assert.isUndefined((0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(void 0, 123, import_BadgeImageTheme.BadgeImageTheme.Dark));
    import_chai.assert.isUndefined((0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(void 0, 123, import_BadgeImageTheme.BadgeImageTheme.Transparent));
  });
  describe("dark/light themes", () => {
    it("returns the first matching image if passed a small size", () => {
      const darkResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 10, import_BadgeImageTheme.BadgeImageTheme.Dark);
      import_chai.assert.strictEqual(darkResult, "/small-dark.svg");
      const lightResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 11, import_BadgeImageTheme.BadgeImageTheme.Light);
      import_chai.assert.isUndefined(lightResult);
    });
    it("returns the second matching image if passed a size between 24 and 36", () => {
      const darkResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 24, import_BadgeImageTheme.BadgeImageTheme.Dark);
      import_chai.assert.strictEqual(darkResult, "/medium-dark.svg");
      const lightResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 30, import_BadgeImageTheme.BadgeImageTheme.Light);
      import_chai.assert.isUndefined(lightResult);
    });
    it("returns the third matching image if passed a size between 36 and 160", () => {
      const darkResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 36, import_BadgeImageTheme.BadgeImageTheme.Dark);
      import_chai.assert.strictEqual(darkResult, "/large-dark.svg");
      const lightResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 100, import_BadgeImageTheme.BadgeImageTheme.Light);
      import_chai.assert.isUndefined(lightResult);
    });
    it("returns the last matching image if passed a size above 159", () => {
      const darkResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 160, import_BadgeImageTheme.BadgeImageTheme.Dark);
      import_chai.assert.strictEqual(darkResult, "/large-dark.svg");
      const lightResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, 200, import_BadgeImageTheme.BadgeImageTheme.Light);
      import_chai.assert.isUndefined(lightResult);
    });
  });
  describe("transparent themes", () => {
    it("returns the transparent image, no matter the size", () => {
      [1, 12, 28, 50, 200, 999].forEach((size) => {
        const transparentResult = (0, import_getBadgeImageFileLocalPath.getBadgeImageFileLocalPath)(badge, size, import_BadgeImageTheme.BadgeImageTheme.Transparent);
        import_chai.assert.strictEqual(transparentResult, "/huge-trns.svg");
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGhfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCB7IEJhZGdlQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi9iYWRnZXMvQmFkZ2VDYXRlZ29yeSc7XG5pbXBvcnQgeyBCYWRnZUltYWdlVGhlbWUgfSBmcm9tICcuLi8uLi9iYWRnZXMvQmFkZ2VJbWFnZVRoZW1lJztcblxuaW1wb3J0IHsgZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGggfSBmcm9tICcuLi8uLi9iYWRnZXMvZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgnO1xuXG5kZXNjcmliZSgnZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgnLCAoKSA9PiB7XG4gIGNvbnN0IGltYWdlID0gKGxvY2FsUGF0aD86IHN0cmluZykgPT4gKHtcbiAgICBsb2NhbFBhdGgsXG4gICAgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pZ25vcmVkLnN2ZycsXG4gIH0pO1xuXG4gIGNvbnN0IGJhZGdlID0ge1xuICAgIGNhdGVnb3J5OiBCYWRnZUNhdGVnb3J5LkRvbm9yLFxuICAgIGRlc2NyaXB0aW9uVGVtcGxhdGU6ICdmb28gYmFyJyxcbiAgICBpZDogJ2ZvbycsXG4gICAgaW1hZ2VzOiBbXG4gICAgICAuLi5bJ3NtYWxsJywgJ21lZGl1bScsICdsYXJnZSddLm1hcChzaXplID0+ICh7XG4gICAgICAgIFtCYWRnZUltYWdlVGhlbWUuRGFya106IGltYWdlKGAvJHtzaXplfS1kYXJrLnN2Z2ApLFxuICAgICAgICBbQmFkZ2VJbWFnZVRoZW1lLkxpZ2h0XTogaW1hZ2UodW5kZWZpbmVkKSxcbiAgICAgIH0pKSxcbiAgICAgIHsgW0JhZGdlSW1hZ2VUaGVtZS5UcmFuc3BhcmVudF06IGltYWdlKCcvaHVnZS10cm5zLnN2ZycpIH0sXG4gICAgXSxcbiAgICBuYW1lOiAnVGVzdCBCYWRnZScsXG4gIH07XG5cbiAgaXQoJ3JldHVybnMgdW5kZWZpbmVkIGlmIHBhc3NlZCBubyBiYWRnZScsICgpID0+IHtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoXG4gICAgICBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCh1bmRlZmluZWQsIDEyMywgQmFkZ2VJbWFnZVRoZW1lLkRhcmspXG4gICAgKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoXG4gICAgICBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aCh1bmRlZmluZWQsIDEyMywgQmFkZ2VJbWFnZVRoZW1lLlRyYW5zcGFyZW50KVxuICAgICk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkYXJrL2xpZ2h0IHRoZW1lcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgaW1hZ2UgaWYgcGFzc2VkIGEgc21hbGwgc2l6ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhcmtSZXN1bHQgPSBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aChcbiAgICAgICAgYmFkZ2UsXG4gICAgICAgIDEwLFxuICAgICAgICBCYWRnZUltYWdlVGhlbWUuRGFya1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChkYXJrUmVzdWx0LCAnL3NtYWxsLWRhcmsuc3ZnJyk7XG5cbiAgICAgIGNvbnN0IGxpZ2h0UmVzdWx0ID0gZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgoXG4gICAgICAgIGJhZGdlLFxuICAgICAgICAxMSxcbiAgICAgICAgQmFkZ2VJbWFnZVRoZW1lLkxpZ2h0XG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxpZ2h0UmVzdWx0KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHRoZSBzZWNvbmQgbWF0Y2hpbmcgaW1hZ2UgaWYgcGFzc2VkIGEgc2l6ZSBiZXR3ZWVuIDI0IGFuZCAzNicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhcmtSZXN1bHQgPSBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aChcbiAgICAgICAgYmFkZ2UsXG4gICAgICAgIDI0LFxuICAgICAgICBCYWRnZUltYWdlVGhlbWUuRGFya1xuICAgICAgKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChkYXJrUmVzdWx0LCAnL21lZGl1bS1kYXJrLnN2ZycpO1xuXG4gICAgICBjb25zdCBsaWdodFJlc3VsdCA9IGdldEJhZGdlSW1hZ2VGaWxlTG9jYWxQYXRoKFxuICAgICAgICBiYWRnZSxcbiAgICAgICAgMzAsXG4gICAgICAgIEJhZGdlSW1hZ2VUaGVtZS5MaWdodFxuICAgICAgKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChsaWdodFJlc3VsdCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgdGhpcmQgbWF0Y2hpbmcgaW1hZ2UgaWYgcGFzc2VkIGEgc2l6ZSBiZXR3ZWVuIDM2IGFuZCAxNjAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXJrUmVzdWx0ID0gZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgoXG4gICAgICAgIGJhZGdlLFxuICAgICAgICAzNixcbiAgICAgICAgQmFkZ2VJbWFnZVRoZW1lLkRhcmtcbiAgICAgICk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZGFya1Jlc3VsdCwgJy9sYXJnZS1kYXJrLnN2ZycpO1xuXG4gICAgICBjb25zdCBsaWdodFJlc3VsdCA9IGdldEJhZGdlSW1hZ2VGaWxlTG9jYWxQYXRoKFxuICAgICAgICBiYWRnZSxcbiAgICAgICAgMTAwLFxuICAgICAgICBCYWRnZUltYWdlVGhlbWUuTGlnaHRcbiAgICAgICk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobGlnaHRSZXN1bHQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdGhlIGxhc3QgbWF0Y2hpbmcgaW1hZ2UgaWYgcGFzc2VkIGEgc2l6ZSBhYm92ZSAxNTknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXJrUmVzdWx0ID0gZ2V0QmFkZ2VJbWFnZUZpbGVMb2NhbFBhdGgoXG4gICAgICAgIGJhZGdlLFxuICAgICAgICAxNjAsXG4gICAgICAgIEJhZGdlSW1hZ2VUaGVtZS5EYXJrXG4gICAgICApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGRhcmtSZXN1bHQsICcvbGFyZ2UtZGFyay5zdmcnKTtcblxuICAgICAgY29uc3QgbGlnaHRSZXN1bHQgPSBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aChcbiAgICAgICAgYmFkZ2UsXG4gICAgICAgIDIwMCxcbiAgICAgICAgQmFkZ2VJbWFnZVRoZW1lLkxpZ2h0XG4gICAgICApO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxpZ2h0UmVzdWx0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RyYW5zcGFyZW50IHRoZW1lcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgdHJhbnNwYXJlbnQgaW1hZ2UsIG5vIG1hdHRlciB0aGUgc2l6ZScsICgpID0+IHtcbiAgICAgIFsxLCAxMiwgMjgsIDUwLCAyMDAsIDk5OV0uZm9yRWFjaChzaXplID0+IHtcbiAgICAgICAgY29uc3QgdHJhbnNwYXJlbnRSZXN1bHQgPSBnZXRCYWRnZUltYWdlRmlsZUxvY2FsUGF0aChcbiAgICAgICAgICBiYWRnZSxcbiAgICAgICAgICBzaXplLFxuICAgICAgICAgIEJhZGdlSW1hZ2VUaGVtZS5UcmFuc3BhcmVudFxuICAgICAgICApO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHJhbnNwYXJlbnRSZXN1bHQsICcvaHVnZS10cm5zLnN2ZycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUdBLGtCQUF1QjtBQUN2QiwyQkFBOEI7QUFDOUIsNkJBQWdDO0FBRWhDLHdDQUEyQztBQUUzQyxTQUFTLDhCQUE4QixNQUFN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
