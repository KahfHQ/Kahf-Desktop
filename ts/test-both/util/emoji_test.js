var import_chai = require("chai");
var import_emoji = require("../../util/emoji");
describe("emoji", () => {
  describe("replaceEmojiWithSpaces", () => {
    it("replaces emoji and pictograms with a single space", () => {
      import_chai.assert.strictEqual((0, import_emoji.replaceEmojiWithSpaces)("hello\u{1F300}\u{1F400}\u{1F500}\u{1F600}world"), "hello    world");
    });
    it("leaves regular text as it is", () => {
      import_chai.assert.strictEqual((0, import_emoji.replaceEmojiWithSpaces)("\u041F\u0440\u0438\u0432\u0435\u0442 \u563F \u0570\u0565\u0575 \u05D4\u05E2\u05DC\u05D0 \u0645\u0631\u062D\u0628\u0627 "), "\u041F\u0440\u0438\u0432\u0435\u0442 \u563F \u0570\u0565\u0575 \u05D4\u05E2\u05DC\u05D0 \u0645\u0631\u062D\u0628\u0627 ");
    });
  });
  describe("splitByEmoji", () => {
    it("replaces emoji and pictograms with a single space", () => {
      import_chai.assert.deepStrictEqual((0, import_emoji.splitByEmoji)("hello\u{1F61B}world\u{1F60E}\u{1F61B}!"), [
        { type: "text", value: "hello" },
        { type: "emoji", value: "\u{1F61B}" },
        { type: "text", value: "world" },
        { type: "emoji", value: "\u{1F60E}" },
        { type: "emoji", value: "\u{1F61B}" },
        { type: "text", value: "!" }
      ]);
    });
    it("returns emojis as text after 5,000 emojis are found", () => {
      import_chai.assert.deepStrictEqual((0, import_emoji.splitByEmoji)("\u{1F4AC}".repeat(5002)), [
        ...Array(5e3).fill({ type: "emoji", value: "\u{1F4AC}" }),
        { type: "text", value: "\u{1F4AC}\u{1F4AC}" }
      ]);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZW1vamlfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7IHJlcGxhY2VFbW9qaVdpdGhTcGFjZXMsIHNwbGl0QnlFbW9qaSB9IGZyb20gJy4uLy4uL3V0aWwvZW1vamknO1xuXG5kZXNjcmliZSgnZW1vamknLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdyZXBsYWNlRW1vamlXaXRoU3BhY2VzJywgKCkgPT4ge1xuICAgIGl0KCdyZXBsYWNlcyBlbW9qaSBhbmQgcGljdG9ncmFtcyB3aXRoIGEgc2luZ2xlIHNwYWNlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgICAgICByZXBsYWNlRW1vamlXaXRoU3BhY2VzKCdoZWxsb1x1RDgzQ1x1REYwMFx1RDgzRFx1REMwMFx1RDgzRFx1REQwMFx1RDgzRFx1REUwMHdvcmxkJyksXG4gICAgICAgICdoZWxsbyAgICB3b3JsZCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnbGVhdmVzIHJlZ3VsYXIgdGV4dCBhcyBpdCBpcycsICgpID0+IHtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChcbiAgICAgICAgcmVwbGFjZUVtb2ppV2l0aFNwYWNlcygnXHUwNDFGXHUwNDQwXHUwNDM4XHUwNDMyXHUwNDM1XHUwNDQyIFx1NTYzRiBcdTA1NzBcdTA1NjVcdTA1NzUgXHUwNUQ0XHUwNUUyXHUwNURDXHUwNUQwIFx1MDY0NVx1MDYzMVx1MDYyRFx1MDYyOFx1MDYyNyAnKSxcbiAgICAgICAgJ1x1MDQxRlx1MDQ0MFx1MDQzOFx1MDQzMlx1MDQzNVx1MDQ0MiBcdTU2M0YgXHUwNTcwXHUwNTY1XHUwNTc1IFx1MDVENFx1MDVFMlx1MDVEQ1x1MDVEMCBcdTA2NDVcdTA2MzFcdTA2MkRcdTA2MjhcdTA2MjcgJ1xuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NwbGl0QnlFbW9qaScsICgpID0+IHtcbiAgICBpdCgncmVwbGFjZXMgZW1vamkgYW5kIHBpY3RvZ3JhbXMgd2l0aCBhIHNpbmdsZSBzcGFjZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoc3BsaXRCeUVtb2ppKCdoZWxsb1x1RDgzRFx1REUxQndvcmxkXHVEODNEXHVERTBFXHVEODNEXHVERTFCIScpLCBbXG4gICAgICAgIHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogJ2hlbGxvJyB9LFxuICAgICAgICB7IHR5cGU6ICdlbW9qaScsIHZhbHVlOiAnXHVEODNEXHVERTFCJyB9LFxuICAgICAgICB7IHR5cGU6ICd0ZXh0JywgdmFsdWU6ICd3b3JsZCcgfSxcbiAgICAgICAgeyB0eXBlOiAnZW1vamknLCB2YWx1ZTogJ1x1RDgzRFx1REUwRScgfSxcbiAgICAgICAgeyB0eXBlOiAnZW1vamknLCB2YWx1ZTogJ1x1RDgzRFx1REUxQicgfSxcbiAgICAgICAgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAnIScgfSxcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgZW1vamlzIGFzIHRleHQgYWZ0ZXIgNSwwMDAgZW1vamlzIGFyZSBmb3VuZCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoc3BsaXRCeUVtb2ppKCdcdUQ4M0RcdURDQUMnLnJlcGVhdCg1MDAyKSksIFtcbiAgICAgICAgLi4uQXJyYXkoNTAwMCkuZmlsbCh7IHR5cGU6ICdlbW9qaScsIHZhbHVlOiAnXHVEODNEXHVEQ0FDJyB9KSxcbiAgICAgICAgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAnXHVEODNEXHVEQ0FDXHVEODNEXHVEQ0FDJyB9LFxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFFQSxrQkFBdUI7QUFFdkIsbUJBQXFEO0FBRXJELFNBQVMsU0FBUyxNQUFNO0FBQ3RCLFdBQVMsMEJBQTBCLE1BQU07QUFDdkMsT0FBRyxxREFBcUQsTUFBTTtBQUM1RCx5QkFBTyxZQUNMLHlDQUF1QixnREFBb0IsR0FDM0MsZ0JBQ0Y7QUFBQSxJQUNGLENBQUM7QUFFRCxPQUFHLGdDQUFnQyxNQUFNO0FBQ3ZDLHlCQUFPLFlBQ0wseUNBQXVCLHlIQUEwQixHQUNqRCx5SEFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUVELFdBQVMsZ0JBQWdCLE1BQU07QUFDN0IsT0FBRyxxREFBcUQsTUFBTTtBQUM1RCx5QkFBTyxnQkFBZ0IsK0JBQWEsd0NBQW1CLEdBQUc7QUFBQSxRQUN4RCxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVE7QUFBQSxRQUMvQixFQUFFLE1BQU0sU0FBUyxPQUFPLFlBQUs7QUFBQSxRQUM3QixFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVE7QUFBQSxRQUMvQixFQUFFLE1BQU0sU0FBUyxPQUFPLFlBQUs7QUFBQSxRQUM3QixFQUFFLE1BQU0sU0FBUyxPQUFPLFlBQUs7QUFBQSxRQUM3QixFQUFFLE1BQU0sUUFBUSxPQUFPLElBQUk7QUFBQSxNQUM3QixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUQsT0FBRyx1REFBdUQsTUFBTTtBQUM5RCx5QkFBTyxnQkFBZ0IsK0JBQWEsWUFBSyxPQUFPLElBQUksQ0FBQyxHQUFHO0FBQUEsUUFDdEQsR0FBRyxNQUFNLEdBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLE9BQU8sWUFBSyxDQUFDO0FBQUEsUUFDbEQsRUFBRSxNQUFNLFFBQVEsT0FBTyxxQkFBTztBQUFBLE1BQ2hDLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNILENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
