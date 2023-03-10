var import_chai = require("chai");
var import_Client = require("../../sql/Client");
var import_MIME = require("../../types/MIME");
describe("_cleanMessageData", () => {
  it("throws if message is missing received_at", () => {
    import_chai.assert.throws(() => {
      (0, import_Client._cleanMessageData)({});
    }, "received_at");
  });
  it("removes `data` field in attachment if it is not a typed array", () => {
    const data = new Uint8Array([1, 2, 3]);
    const message = {
      id: "something",
      type: "incoming",
      sent_at: Date.now(),
      conversationId: "conversation-id",
      received_at: Date.now(),
      timestamp: Date.now(),
      attachments: [
        {
          contentType: import_MIME.IMAGE_GIF,
          size: 4,
          data: 1
        },
        {
          contentType: import_MIME.IMAGE_GIF,
          size: 4,
          data: {}
        },
        {
          size: 4,
          contentType: import_MIME.IMAGE_GIF,
          data
        }
      ]
    };
    const actual = (0, import_Client._cleanMessageData)(message);
    import_chai.assert.isUndefined(actual.attachments?.[0].data);
    import_chai.assert.isUndefined(actual.attachments?.[1].data);
    import_chai.assert.strictEqual(actual.attachments?.[2].data, data);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2xlYW5NZXNzYWdlRGF0YV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgeyBfY2xlYW5NZXNzYWdlRGF0YSB9IGZyb20gJy4uLy4uL3NxbC9DbGllbnQnO1xuaW1wb3J0IHsgSU1BR0VfR0lGIH0gZnJvbSAnLi4vLi4vdHlwZXMvTUlNRSc7XG5cbmRlc2NyaWJlKCdfY2xlYW5NZXNzYWdlRGF0YScsICgpID0+IHtcbiAgaXQoJ3Rocm93cyBpZiBtZXNzYWdlIGlzIG1pc3NpbmcgcmVjZWl2ZWRfYXQnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgX2NsZWFuTWVzc2FnZURhdGEoe30gYXMgYW55KTtcbiAgICB9LCAncmVjZWl2ZWRfYXQnKTtcbiAgfSk7XG5cbiAgaXQoJ3JlbW92ZXMgYGRhdGFgIGZpZWxkIGluIGF0dGFjaG1lbnQgaWYgaXQgaXMgbm90IGEgdHlwZWQgYXJyYXknLCAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KFsxLCAyLCAzXSk7XG4gICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgIGlkOiAnc29tZXRoaW5nJyxcbiAgICAgIHR5cGU6ICdpbmNvbWluZycgYXMgY29uc3QsXG4gICAgICBzZW50X2F0OiBEYXRlLm5vdygpLFxuICAgICAgY29udmVyc2F0aW9uSWQ6ICdjb252ZXJzYXRpb24taWQnLFxuICAgICAgcmVjZWl2ZWRfYXQ6IERhdGUubm93KCksXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBhdHRhY2htZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0dJRixcbiAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgZGF0YTogMSBhcyBhbnksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfR0lGLFxuICAgICAgICAgIHNpemU6IDQsXG4gICAgICAgICAgZGF0YToge30sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9HSUYsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgICBjb25zdCBhY3R1YWwgPSBfY2xlYW5NZXNzYWdlRGF0YShtZXNzYWdlKTtcblxuICAgIGFzc2VydC5pc1VuZGVmaW5lZChhY3R1YWwuYXR0YWNobWVudHM/LlswXS5kYXRhKTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoYWN0dWFsLmF0dGFjaG1lbnRzPy5bMV0uZGF0YSk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbC5hdHRhY2htZW50cz8uWzJdLmRhdGEsIGRhdGEpO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0Esa0JBQXVCO0FBRXZCLG9CQUFrQztBQUNsQyxrQkFBMEI7QUFFMUIsU0FBUyxxQkFBcUIsTUFBTTtBQUNsQyxLQUFHLDRDQUE0QyxNQUFNO0FBQ25ELHVCQUFPLE9BQU8sTUFBTTtBQUVsQiwyQ0FBa0IsQ0FBQyxDQUFRO0FBQUEsSUFDN0IsR0FBRyxhQUFhO0FBQUEsRUFDbEIsQ0FBQztBQUVELEtBQUcsaUVBQWlFLE1BQU07QUFDeEUsVUFBTSxPQUFPLElBQUksV0FBVyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBTSxVQUFVO0FBQUEsTUFDZCxJQUFJO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixTQUFTLEtBQUssSUFBSTtBQUFBLE1BQ2xCLGdCQUFnQjtBQUFBLE1BQ2hCLGFBQWEsS0FBSyxJQUFJO0FBQUEsTUFDdEIsV0FBVyxLQUFLLElBQUk7QUFBQSxNQUNwQixhQUFhO0FBQUEsUUFDWDtBQUFBLFVBQ0UsYUFBYTtBQUFBLFVBQ2IsTUFBTTtBQUFBLFVBRU4sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxhQUFhO0FBQUEsVUFDYixNQUFNO0FBQUEsVUFDTixNQUFNLENBQUM7QUFBQSxRQUNUO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxVQUFNLFNBQVMscUNBQWtCLE9BQU87QUFFeEMsdUJBQU8sWUFBWSxPQUFPLGNBQWMsR0FBRyxJQUFJO0FBQy9DLHVCQUFPLFlBQVksT0FBTyxjQUFjLEdBQUcsSUFBSTtBQUMvQyx1QkFBTyxZQUFZLE9BQU8sY0FBYyxHQUFHLE1BQU0sSUFBSTtBQUFBLEVBQ3ZELENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
