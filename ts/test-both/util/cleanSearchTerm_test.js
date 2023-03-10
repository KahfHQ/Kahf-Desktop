var import_chai = require("chai");
var import_cleanSearchTerm = require("../../util/cleanSearchTerm");
describe("cleanSearchTerm", () => {
  it("should remove \\ from a search term", () => {
    const searchTerm = "\\search\\term";
    const sanitizedSearchTerm = (0, import_cleanSearchTerm.cleanSearchTerm)(searchTerm);
    import_chai.assert.strictEqual(sanitizedSearchTerm, "search* term*");
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2xlYW5TZWFyY2hUZXJtX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyBjbGVhblNlYXJjaFRlcm0gfSBmcm9tICcuLi8uLi91dGlsL2NsZWFuU2VhcmNoVGVybSc7XG5cbmRlc2NyaWJlKCdjbGVhblNlYXJjaFRlcm0nLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmVtb3ZlIFxcXFwgZnJvbSBhIHNlYXJjaCB0ZXJtJywgKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFRlcm0gPSAnXFxcXHNlYXJjaFxcXFx0ZXJtJztcbiAgICBjb25zdCBzYW5pdGl6ZWRTZWFyY2hUZXJtID0gY2xlYW5TZWFyY2hUZXJtKHNlYXJjaFRlcm0pO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChzYW5pdGl6ZWRTZWFyY2hUZXJtLCAnc2VhcmNoKiB0ZXJtKicpO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0Esa0JBQXVCO0FBQ3ZCLDZCQUFnQztBQUVoQyxTQUFTLG1CQUFtQixNQUFNO0FBQ2hDLEtBQUcsdUNBQXVDLE1BQU07QUFDOUMsVUFBTSxhQUFhO0FBQ25CLFVBQU0sc0JBQXNCLDRDQUFnQixVQUFVO0FBQ3RELHVCQUFPLFlBQVkscUJBQXFCLGVBQWU7QUFBQSxFQUN6RCxDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
