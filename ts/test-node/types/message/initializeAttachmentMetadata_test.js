var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var Message = __toESM(require("../../../types/message/initializeAttachmentMetadata"));
var import_protobuf = require("../../../protobuf");
var MIME = __toESM(require("../../../types/MIME"));
var Bytes = __toESM(require("../../../Bytes"));
function getDefaultMessage(props) {
  return {
    id: "some-id",
    type: "incoming",
    sent_at: 45,
    received_at: 45,
    timestamp: 45,
    conversationId: "some-conversation-id",
    ...props
  };
}
describe("Message", () => {
  describe("initializeAttachmentMetadata", () => {
    it("should classify visual media attachments", async () => {
      const input = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.IMAGE_JPEG,
            data: Bytes.fromString("foo"),
            fileName: "foo.jpg",
            size: 1111
          }
        ]
      });
      const expected = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.IMAGE_JPEG,
            data: Bytes.fromString("foo"),
            fileName: "foo.jpg",
            size: 1111
          }
        ],
        hasAttachments: 1,
        hasVisualMediaAttachments: 1,
        hasFileAttachments: void 0
      });
      const actual = await Message.initializeAttachmentMetadata(input);
      import_chai.assert.deepEqual(actual, expected);
    });
    it("should classify file attachments", async () => {
      const input = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.APPLICATION_OCTET_STREAM,
            data: Bytes.fromString("foo"),
            fileName: "foo.bin",
            size: 1111
          }
        ]
      });
      const expected = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.APPLICATION_OCTET_STREAM,
            data: Bytes.fromString("foo"),
            fileName: "foo.bin",
            size: 1111
          }
        ],
        hasAttachments: 1,
        hasVisualMediaAttachments: void 0,
        hasFileAttachments: 1
      });
      const actual = await Message.initializeAttachmentMetadata(input);
      import_chai.assert.deepEqual(actual, expected);
    });
    it("should classify voice message attachments", async () => {
      const input = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.AUDIO_AAC,
            flags: import_protobuf.SignalService.AttachmentPointer.Flags.VOICE_MESSAGE,
            data: Bytes.fromString("foo"),
            fileName: "Voice Message.aac",
            size: 1111
          }
        ]
      });
      const expected = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.AUDIO_AAC,
            flags: import_protobuf.SignalService.AttachmentPointer.Flags.VOICE_MESSAGE,
            data: Bytes.fromString("foo"),
            fileName: "Voice Message.aac",
            size: 1111
          }
        ],
        hasAttachments: 1,
        hasVisualMediaAttachments: void 0,
        hasFileAttachments: void 0
      });
      const actual = await Message.initializeAttachmentMetadata(input);
      import_chai.assert.deepEqual(actual, expected);
    });
    it("does not include long message attachments", async () => {
      const input = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.LONG_MESSAGE,
            data: Bytes.fromString("foo"),
            fileName: "message.txt",
            size: 1111
          }
        ]
      });
      const expected = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [
          {
            contentType: MIME.LONG_MESSAGE,
            data: Bytes.fromString("foo"),
            fileName: "message.txt",
            size: 1111
          }
        ],
        hasAttachments: 0,
        hasVisualMediaAttachments: void 0,
        hasFileAttachments: void 0
      });
      const actual = await Message.initializeAttachmentMetadata(input);
      import_chai.assert.deepEqual(actual, expected);
    });
    it("handles not attachments", async () => {
      const input = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: []
      });
      const expected = getDefaultMessage({
        type: "incoming",
        conversationId: "foo",
        id: "11111111-1111-1111-1111-111111111111",
        timestamp: 1523317140899,
        received_at: 1523317140899,
        sent_at: 1523317140800,
        attachments: [],
        hasAttachments: 0,
        hasVisualMediaAttachments: void 0,
        hasFileAttachments: void 0
      });
      const actual = await Message.initializeAttachmentMetadata(input);
      import_chai.assert.deepEqual(actual, expected);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5pdGlhbGl6ZUF0dGFjaG1lbnRNZXRhZGF0YV90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIwIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIE1lc3NhZ2UgZnJvbSAnLi4vLi4vLi4vdHlwZXMvbWVzc2FnZS9pbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBNSU1FIGZyb20gJy4uLy4uLy4uL3R5cGVzL01JTUUnO1xuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vLi4vLi4vQnl0ZXMnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC10eXBlcy5kJztcblxuZnVuY3Rpb24gZ2V0RGVmYXVsdE1lc3NhZ2UoXG4gIHByb3BzPzogUGFydGlhbDxNZXNzYWdlQXR0cmlidXRlc1R5cGU+XG4pOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUge1xuICByZXR1cm4ge1xuICAgIGlkOiAnc29tZS1pZCcsXG4gICAgdHlwZTogJ2luY29taW5nJyxcbiAgICBzZW50X2F0OiA0NSxcbiAgICByZWNlaXZlZF9hdDogNDUsXG4gICAgdGltZXN0YW1wOiA0NSxcbiAgICBjb252ZXJzYXRpb25JZDogJ3NvbWUtY29udmVyc2F0aW9uLWlkJyxcbiAgICAuLi5wcm9wcyxcbiAgfTtcbn1cblxuZGVzY3JpYmUoJ01lc3NhZ2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdpbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2xhc3NpZnkgdmlzdWFsIG1lZGlhIGF0dGFjaG1lbnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBnZXREZWZhdWx0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZm9vJyxcbiAgICAgICAgaWQ6ICcxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEnLFxuICAgICAgICB0aW1lc3RhbXA6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHJlY2VpdmVkX2F0OiAxNTIzMzE3MTQwODk5LFxuICAgICAgICBzZW50X2F0OiAxNTIzMzE3MTQwODAwLFxuICAgICAgICBhdHRhY2htZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBNSU1FLklNQUdFX0pQRUcsXG4gICAgICAgICAgICBkYXRhOiBCeXRlcy5mcm9tU3RyaW5nKCdmb28nKSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiAnZm9vLmpwZycsXG4gICAgICAgICAgICBzaXplOiAxMTExLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gZ2V0RGVmYXVsdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnaW5jb21pbmcnLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2ZvbycsXG4gICAgICAgIGlkOiAnMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExJyxcbiAgICAgICAgdGltZXN0YW1wOiAxNTIzMzE3MTQwODk5LFxuICAgICAgICByZWNlaXZlZF9hdDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgc2VudF9hdDogMTUyMzMxNzE0MDgwMCxcbiAgICAgICAgYXR0YWNobWVudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogTUlNRS5JTUFHRV9KUEVHLFxuICAgICAgICAgICAgZGF0YTogQnl0ZXMuZnJvbVN0cmluZygnZm9vJyksXG4gICAgICAgICAgICBmaWxlTmFtZTogJ2Zvby5qcGcnLFxuICAgICAgICAgICAgc2l6ZTogMTExMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBoYXNBdHRhY2htZW50czogMSxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50czogMSxcbiAgICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzOiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgTWVzc2FnZS5pbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhKGlucHV0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNsYXNzaWZ5IGZpbGUgYXR0YWNobWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGdldERlZmF1bHRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2luY29taW5nJyxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmb28nLFxuICAgICAgICBpZDogJzExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMScsXG4gICAgICAgIHRpbWVzdGFtcDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgcmVjZWl2ZWRfYXQ6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHNlbnRfYXQ6IDE1MjMzMTcxNDA4MDAsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudFR5cGU6IE1JTUUuQVBQTElDQVRJT05fT0NURVRfU1RSRUFNLFxuICAgICAgICAgICAgZGF0YTogQnl0ZXMuZnJvbVN0cmluZygnZm9vJyksXG4gICAgICAgICAgICBmaWxlTmFtZTogJ2Zvby5iaW4nLFxuICAgICAgICAgICAgc2l6ZTogMTExMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IGdldERlZmF1bHRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2luY29taW5nJyxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmb28nLFxuICAgICAgICBpZDogJzExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMScsXG4gICAgICAgIHRpbWVzdGFtcDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgcmVjZWl2ZWRfYXQ6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHNlbnRfYXQ6IDE1MjMzMTcxNDA4MDAsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudFR5cGU6IE1JTUUuQVBQTElDQVRJT05fT0NURVRfU1RSRUFNLFxuICAgICAgICAgICAgZGF0YTogQnl0ZXMuZnJvbVN0cmluZygnZm9vJyksXG4gICAgICAgICAgICBmaWxlTmFtZTogJ2Zvby5iaW4nLFxuICAgICAgICAgICAgc2l6ZTogMTExMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBoYXNBdHRhY2htZW50czogMSxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50czogdW5kZWZpbmVkLFxuICAgICAgICBoYXNGaWxlQXR0YWNobWVudHM6IDEsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgTWVzc2FnZS5pbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhKGlucHV0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNsYXNzaWZ5IHZvaWNlIG1lc3NhZ2UgYXR0YWNobWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGdldERlZmF1bHRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2luY29taW5nJyxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmb28nLFxuICAgICAgICBpZDogJzExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMScsXG4gICAgICAgIHRpbWVzdGFtcDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgcmVjZWl2ZWRfYXQ6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHNlbnRfYXQ6IDE1MjMzMTcxNDA4MDAsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudFR5cGU6IE1JTUUuQVVESU9fQUFDLFxuICAgICAgICAgICAgZmxhZ3M6IFNpZ25hbFNlcnZpY2UuQXR0YWNobWVudFBvaW50ZXIuRmxhZ3MuVk9JQ0VfTUVTU0FHRSxcbiAgICAgICAgICAgIGRhdGE6IEJ5dGVzLmZyb21TdHJpbmcoJ2ZvbycpLFxuICAgICAgICAgICAgZmlsZU5hbWU6ICdWb2ljZSBNZXNzYWdlLmFhYycsXG4gICAgICAgICAgICBzaXplOiAxMTExLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gZ2V0RGVmYXVsdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnaW5jb21pbmcnLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2ZvbycsXG4gICAgICAgIGlkOiAnMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExJyxcbiAgICAgICAgdGltZXN0YW1wOiAxNTIzMzE3MTQwODk5LFxuICAgICAgICByZWNlaXZlZF9hdDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgc2VudF9hdDogMTUyMzMxNzE0MDgwMCxcbiAgICAgICAgYXR0YWNobWVudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogTUlNRS5BVURJT19BQUMsXG4gICAgICAgICAgICBmbGFnczogU2lnbmFsU2VydmljZS5BdHRhY2htZW50UG9pbnRlci5GbGFncy5WT0lDRV9NRVNTQUdFLFxuICAgICAgICAgICAgZGF0YTogQnl0ZXMuZnJvbVN0cmluZygnZm9vJyksXG4gICAgICAgICAgICBmaWxlTmFtZTogJ1ZvaWNlIE1lc3NhZ2UuYWFjJyxcbiAgICAgICAgICAgIHNpemU6IDExMTEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaGFzQXR0YWNobWVudHM6IDEsXG4gICAgICAgIGhhc1Zpc3VhbE1lZGlhQXR0YWNobWVudHM6IHVuZGVmaW5lZCxcbiAgICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzOiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgTWVzc2FnZS5pbml0aWFsaXplQXR0YWNobWVudE1ldGFkYXRhKGlucHV0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lcyBub3QgaW5jbHVkZSBsb25nIG1lc3NhZ2UgYXR0YWNobWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGdldERlZmF1bHRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2luY29taW5nJyxcbiAgICAgICAgY29udmVyc2F0aW9uSWQ6ICdmb28nLFxuICAgICAgICBpZDogJzExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMScsXG4gICAgICAgIHRpbWVzdGFtcDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgcmVjZWl2ZWRfYXQ6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHNlbnRfYXQ6IDE1MjMzMTcxNDA4MDAsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudFR5cGU6IE1JTUUuTE9OR19NRVNTQUdFLFxuICAgICAgICAgICAgZGF0YTogQnl0ZXMuZnJvbVN0cmluZygnZm9vJyksXG4gICAgICAgICAgICBmaWxlTmFtZTogJ21lc3NhZ2UudHh0JyxcbiAgICAgICAgICAgIHNpemU6IDExMTEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBnZXREZWZhdWx0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZm9vJyxcbiAgICAgICAgaWQ6ICcxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEnLFxuICAgICAgICB0aW1lc3RhbXA6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHJlY2VpdmVkX2F0OiAxNTIzMzE3MTQwODk5LFxuICAgICAgICBzZW50X2F0OiAxNTIzMzE3MTQwODAwLFxuICAgICAgICBhdHRhY2htZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBNSU1FLkxPTkdfTUVTU0FHRSxcbiAgICAgICAgICAgIGRhdGE6IEJ5dGVzLmZyb21TdHJpbmcoJ2ZvbycpLFxuICAgICAgICAgICAgZmlsZU5hbWU6ICdtZXNzYWdlLnR4dCcsXG4gICAgICAgICAgICBzaXplOiAxMTExLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGhhc0F0dGFjaG1lbnRzOiAwLFxuICAgICAgICBoYXNWaXN1YWxNZWRpYUF0dGFjaG1lbnRzOiB1bmRlZmluZWQsXG4gICAgICAgIGhhc0ZpbGVBdHRhY2htZW50czogdW5kZWZpbmVkLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFjdHVhbCA9IGF3YWl0IE1lc3NhZ2UuaW5pdGlhbGl6ZUF0dGFjaG1lbnRNZXRhZGF0YShpbnB1dCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhbmRsZXMgbm90IGF0dGFjaG1lbnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBnZXREZWZhdWx0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdpbmNvbWluZycsXG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiAnZm9vJyxcbiAgICAgICAgaWQ6ICcxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEnLFxuICAgICAgICB0aW1lc3RhbXA6IDE1MjMzMTcxNDA4OTksXG4gICAgICAgIHJlY2VpdmVkX2F0OiAxNTIzMzE3MTQwODk5LFxuICAgICAgICBzZW50X2F0OiAxNTIzMzE3MTQwODAwLFxuICAgICAgICBhdHRhY2htZW50czogW10sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gZ2V0RGVmYXVsdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnaW5jb21pbmcnLFxuICAgICAgICBjb252ZXJzYXRpb25JZDogJ2ZvbycsXG4gICAgICAgIGlkOiAnMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExJyxcbiAgICAgICAgdGltZXN0YW1wOiAxNTIzMzE3MTQwODk5LFxuICAgICAgICByZWNlaXZlZF9hdDogMTUyMzMxNzE0MDg5OSxcbiAgICAgICAgc2VudF9hdDogMTUyMzMxNzE0MDgwMCxcbiAgICAgICAgYXR0YWNobWVudHM6IFtdLFxuICAgICAgICBoYXNBdHRhY2htZW50czogMCxcbiAgICAgICAgaGFzVmlzdWFsTWVkaWFBdHRhY2htZW50czogdW5kZWZpbmVkLFxuICAgICAgICBoYXNGaWxlQXR0YWNobWVudHM6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBNZXNzYWdlLmluaXRpYWxpemVBdHRhY2htZW50TWV0YWRhdGEoaW5wdXQpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxrQkFBdUI7QUFFdkIsY0FBeUI7QUFDekIsc0JBQThCO0FBQzlCLFdBQXNCO0FBQ3RCLFlBQXVCO0FBR3ZCLDJCQUNFLE9BQ3VCO0FBQ3ZCLFNBQU87QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNB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
