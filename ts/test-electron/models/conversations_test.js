var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_MessageSendState = require("../../messages/MessageSendState");
var import_MIME = require("../../types/MIME");
var import_UUID = require("../../types/UUID");
describe("Conversations", () => {
  async function resetConversationController() {
    window.ConversationController.reset();
    await window.ConversationController.load();
  }
  beforeEach(resetConversationController);
  afterEach(resetConversationController);
  it("updates lastMessage even in race conditions with db", async () => {
    const ourNumber = "+15550000000";
    const ourUuid = import_UUID.UUID.generate().toString();
    const ourPni = import_UUID.UUID.generate().toString();
    const conversation = new window.Whisper.Conversation({
      avatars: [],
      id: import_UUID.UUID.generate().toString(),
      e164: "+15551234567",
      uuid: import_UUID.UUID.generate().toString(),
      type: "private",
      inbox_position: 0,
      isPinned: false,
      markedUnread: false,
      lastMessageDeletedForEveryone: false,
      messageCount: 0,
      sentMessageCount: 0,
      profileSharing: true,
      version: 0
    });
    await window.textsecure.storage.user.setCredentials({
      number: ourNumber,
      uuid: ourUuid,
      pni: ourPni,
      deviceId: 2,
      deviceName: "my device",
      password: "password"
    });
    await window.ConversationController.load();
    await window.Signal.Data.saveConversation(conversation.attributes);
    const now = Date.now();
    let message = new window.Whisper.Message({
      attachments: [],
      body: "bananas",
      conversationId: conversation.id,
      expirationStartTimestamp: now,
      hasAttachments: false,
      hasFileAttachments: false,
      hasVisualMediaAttachments: false,
      id: import_UUID.UUID.generate().toString(),
      received_at: now,
      sent_at: now,
      timestamp: now,
      type: "outgoing",
      sendStateByConversationId: {
        [conversation.id]: {
          status: import_MessageSendState.SendStatus.Sent,
          updatedAt: now
        }
      }
    });
    await window.Signal.Data.saveMessage(message.attributes, {
      forceSave: true,
      ourUuid
    });
    message = window.MessageController.register(message.id, message);
    await window.Signal.Data.updateConversation(conversation.attributes);
    await conversation.updateLastMessage();
    import_chai.assert.strictEqual(conversation.get("lastMessage"), "bananas");
    message.set({
      isErased: true,
      body: "",
      bodyRanges: void 0,
      attachments: [],
      quote: void 0,
      contact: [],
      sticker: void 0,
      preview: []
    });
    await conversation.updateLastMessage();
    import_chai.assert.strictEqual(conversation.get("lastMessage"), "");
  });
  it("only produces attachments on a quote with an image", async () => {
    const conversation = new window.Whisper.Conversation({
      avatars: [],
      id: import_UUID.UUID.generate().toString(),
      e164: "+15551234567",
      uuid: import_UUID.UUID.generate().toString(),
      type: "private",
      inbox_position: 0,
      isPinned: false,
      markedUnread: false,
      lastMessageDeletedForEveryone: false,
      messageCount: 0,
      sentMessageCount: 0,
      profileSharing: true,
      version: 0
    });
    const resultNoImage = await conversation.getQuoteAttachment([], [
      {
        url: "https://sometest.signal.org/"
      }
    ]);
    import_chai.assert.deepEqual(resultNoImage, []);
    const [resultWithImage] = await conversation.getQuoteAttachment([], [
      {
        url: "https://sometest.signal.org/",
        image: {
          contentType: import_MIME.IMAGE_PNG,
          size: 100,
          data: new Uint8Array()
        }
      }
    ]);
    import_chai.assert.equal(resultWithImage.contentType, "image/png");
    import_chai.assert.equal(resultWithImage.fileName, null);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9uc190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyBTZW5kU3RhdHVzIH0gZnJvbSAnLi4vLi4vbWVzc2FnZXMvTWVzc2FnZVNlbmRTdGF0ZSc7XG5pbXBvcnQgeyBJTUFHRV9QTkcgfSBmcm9tICcuLi8uLi90eXBlcy9NSU1FJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi8uLi90eXBlcy9VVUlEJztcblxuZGVzY3JpYmUoJ0NvbnZlcnNhdGlvbnMnLCAoKSA9PiB7XG4gIGFzeW5jIGZ1bmN0aW9uIHJlc2V0Q29udmVyc2F0aW9uQ29udHJvbGxlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5yZXNldCgpO1xuICAgIGF3YWl0IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvYWQoKTtcbiAgfVxuXG4gIGJlZm9yZUVhY2gocmVzZXRDb252ZXJzYXRpb25Db250cm9sbGVyKTtcblxuICBhZnRlckVhY2gocmVzZXRDb252ZXJzYXRpb25Db250cm9sbGVyKTtcblxuICBpdCgndXBkYXRlcyBsYXN0TWVzc2FnZSBldmVuIGluIHJhY2UgY29uZGl0aW9ucyB3aXRoIGRiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG91ck51bWJlciA9ICcrMTU1NTAwMDAwMDAnO1xuICAgIGNvbnN0IG91clV1aWQgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICBjb25zdCBvdXJQbmkgPSBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKTtcblxuICAgIC8vIENyZWF0aW5nIGEgZmFrZSBjb252ZXJzYXRpb25cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBuZXcgd2luZG93LldoaXNwZXIuQ29udmVyc2F0aW9uKHtcbiAgICAgIGF2YXRhcnM6IFtdLFxuICAgICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgZTE2NDogJysxNTU1MTIzNDU2NycsXG4gICAgICB1dWlkOiBVVUlELmdlbmVyYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgIHR5cGU6ICdwcml2YXRlJyxcbiAgICAgIGluYm94X3Bvc2l0aW9uOiAwLFxuICAgICAgaXNQaW5uZWQ6IGZhbHNlLFxuICAgICAgbWFya2VkVW5yZWFkOiBmYWxzZSxcbiAgICAgIGxhc3RNZXNzYWdlRGVsZXRlZEZvckV2ZXJ5b25lOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2VDb3VudDogMCxcbiAgICAgIHNlbnRNZXNzYWdlQ291bnQ6IDAsXG4gICAgICBwcm9maWxlU2hhcmluZzogdHJ1ZSxcbiAgICAgIHZlcnNpb246IDAsXG4gICAgfSk7XG5cbiAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuc2V0Q3JlZGVudGlhbHMoe1xuICAgICAgbnVtYmVyOiBvdXJOdW1iZXIsXG4gICAgICB1dWlkOiBvdXJVdWlkLFxuICAgICAgcG5pOiBvdXJQbmksXG4gICAgICBkZXZpY2VJZDogMixcbiAgICAgIGRldmljZU5hbWU6ICdteSBkZXZpY2UnLFxuICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCcsXG4gICAgfSk7XG4gICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9hZCgpO1xuXG4gICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpO1xuXG4gICAgLy8gQ3JlYXRpbmcgYSBmYWtlIG1lc3NhZ2VcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBtZXNzYWdlID0gbmV3IHdpbmRvdy5XaGlzcGVyLk1lc3NhZ2Uoe1xuICAgICAgYXR0YWNobWVudHM6IFtdLFxuICAgICAgYm9keTogJ2JhbmFuYXMnLFxuICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgIGV4cGlyYXRpb25TdGFydFRpbWVzdGFtcDogbm93LFxuICAgICAgaGFzQXR0YWNobWVudHM6IGZhbHNlLFxuICAgICAgaGFzRmlsZUF0dGFjaG1lbnRzOiBmYWxzZSxcbiAgICAgIGhhc1Zpc3VhbE1lZGlhQXR0YWNobWVudHM6IGZhbHNlLFxuICAgICAgaWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgcmVjZWl2ZWRfYXQ6IG5vdyxcbiAgICAgIHNlbnRfYXQ6IG5vdyxcbiAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgdHlwZTogJ291dGdvaW5nJyxcbiAgICAgIHNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQ6IHtcbiAgICAgICAgW2NvbnZlcnNhdGlvbi5pZF06IHtcbiAgICAgICAgICBzdGF0dXM6IFNlbmRTdGF0dXMuU2VudCxcbiAgICAgICAgICB1cGRhdGVkQXQ6IG5vdyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBTYXZpbmcgdG8gZGIgYW5kIHVwZGF0aW5nIHRoZSBjb252bydzIGxhc3QgbWVzc2FnZVxuICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5zYXZlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMsIHtcbiAgICAgIGZvcmNlU2F2ZTogdHJ1ZSxcbiAgICAgIG91clV1aWQsXG4gICAgfSk7XG4gICAgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihtZXNzYWdlLmlkLCBtZXNzYWdlKTtcbiAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEudXBkYXRlQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKTtcbiAgICBhd2FpdCBjb252ZXJzYXRpb24udXBkYXRlTGFzdE1lc3NhZ2UoKTtcblxuICAgIC8vIFNob3VsZCBiZSBzZXQgdG8gYmFuYW5hcyBiZWNhdXNlIHRoYXQncyB0aGUgbGFzdCBtZXNzYWdlIHNlbnQuXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGNvbnZlcnNhdGlvbi5nZXQoJ2xhc3RNZXNzYWdlJyksICdiYW5hbmFzJyk7XG5cbiAgICAvLyBFcmFzaW5nIG1lc3NhZ2UgY29udGVudHMgKERPRSlcbiAgICBtZXNzYWdlLnNldCh7XG4gICAgICBpc0VyYXNlZDogdHJ1ZSxcbiAgICAgIGJvZHk6ICcnLFxuICAgICAgYm9keVJhbmdlczogdW5kZWZpbmVkLFxuICAgICAgYXR0YWNobWVudHM6IFtdLFxuICAgICAgcXVvdGU6IHVuZGVmaW5lZCxcbiAgICAgIGNvbnRhY3Q6IFtdLFxuICAgICAgc3RpY2tlcjogdW5kZWZpbmVkLFxuICAgICAgcHJldmlldzogW10sXG4gICAgfSk7XG5cbiAgICAvLyBOb3Qgc2F2aW5nIHRoZSBtZXNzYWdlIHRvIGRiIG9uIHB1cnBvc2VcbiAgICAvLyB0byBzaW11bGF0ZSB0aGF0IGEgc2F2ZSBoYXNuJ3QgdGFrZW4gcGxhY2UgeWV0LlxuXG4gICAgLy8gVXBkYXRpbmcgY29udm8ncyBsYXN0IG1lc3NhZ2UsIHNob3VsZCBwaWNrIGl0IHVwIGZyb20gbWVtb3J5XG4gICAgYXdhaXQgY29udmVyc2F0aW9uLnVwZGF0ZUxhc3RNZXNzYWdlKCk7XG5cbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY29udmVyc2F0aW9uLmdldCgnbGFzdE1lc3NhZ2UnKSwgJycpO1xuICB9KTtcblxuICBpdCgnb25seSBwcm9kdWNlcyBhdHRhY2htZW50cyBvbiBhIHF1b3RlIHdpdGggYW4gaW1hZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQ3JlYXRpbmcgYSBmYWtlIGNvbnZlcnNhdGlvblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IG5ldyB3aW5kb3cuV2hpc3Blci5Db252ZXJzYXRpb24oe1xuICAgICAgYXZhdGFyczogW10sXG4gICAgICBpZDogVVVJRC5nZW5lcmF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICBlMTY0OiAnKzE1NTUxMjM0NTY3JyxcbiAgICAgIHV1aWQ6IFVVSUQuZ2VuZXJhdGUoKS50b1N0cmluZygpLFxuICAgICAgdHlwZTogJ3ByaXZhdGUnLFxuICAgICAgaW5ib3hfcG9zaXRpb246IDAsXG4gICAgICBpc1Bpbm5lZDogZmFsc2UsXG4gICAgICBtYXJrZWRVbnJlYWQ6IGZhbHNlLFxuICAgICAgbGFzdE1lc3NhZ2VEZWxldGVkRm9yRXZlcnlvbmU6IGZhbHNlLFxuICAgICAgbWVzc2FnZUNvdW50OiAwLFxuICAgICAgc2VudE1lc3NhZ2VDb3VudDogMCxcbiAgICAgIHByb2ZpbGVTaGFyaW5nOiB0cnVlLFxuICAgICAgdmVyc2lvbjogMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3VsdE5vSW1hZ2UgPSBhd2FpdCBjb252ZXJzYXRpb24uZ2V0UXVvdGVBdHRhY2htZW50KFxuICAgICAgW10sXG4gICAgICBbXG4gICAgICAgIHtcbiAgICAgICAgICB1cmw6ICdodHRwczovL3NvbWV0ZXN0LnNpZ25hbC5vcmcvJyxcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICApO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHROb0ltYWdlLCBbXSk7XG5cbiAgICBjb25zdCBbcmVzdWx0V2l0aEltYWdlXSA9IGF3YWl0IGNvbnZlcnNhdGlvbi5nZXRRdW90ZUF0dGFjaG1lbnQoXG4gICAgICBbXSxcbiAgICAgIFtcbiAgICAgICAge1xuICAgICAgICAgIHVybDogJ2h0dHBzOi8vc29tZXRlc3Quc2lnbmFsLm9yZy8nLFxuICAgICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfUE5HLFxuICAgICAgICAgICAgc2l6ZTogMTAwLFxuICAgICAgICAgICAgZGF0YTogbmV3IFVpbnQ4QXJyYXkoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICk7XG5cbiAgICBhc3NlcnQuZXF1YWwocmVzdWx0V2l0aEltYWdlLmNvbnRlbnRUeXBlLCAnaW1hZ2UvcG5nJyk7XG4gICAgYXNzZXJ0LmVxdWFsKHJlc3VsdFdpdGhJbWFnZS5maWxlTmFtZSwgbnVsbCk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUdBLGtCQUF1QjtBQUN2Qiw4QkFBMkI7QUFDM0Isa0JBQTBCO0FBQzFCLGtCQUFxQjtBQUVyQixTQUFTLGlCQUFpQixNQUFNO0FBQzlCLCtDQUE0RDtBQUMxRCxXQUFPLHVCQUF1QixNQUFNO0FBQ3BDLFVBQU0sT0FBTyx1QkFBdUIsS0FBSztBQUFBLEVBQzNDO0FBSGUsQUFLZixhQUFXLDJCQUEyQjtBQUV0QyxZQUFVLDJCQUEyQjtBQUVyQyxLQUFHLHVEQUF1RCxZQUFZO0FBQ3BFLFVBQU0sWUFBWTtBQUNsQixVQUFNLFVBQVUsaUJBQUssU0FBUyxFQUFFLFNBQVM7QUFDekMsVUFBTSxTQUFTLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBR3hDLFVBQU0sZUFBZSxJQUFJLE9BQU8sUUFBUSxhQUFhO0FBQUEsTUFDbkQsU0FBUyxDQUFDO0FBQUEsTUFDVixJQUFJLGlCQUFLLFNBQVMsRUFBRSxTQUFTO0FBQUEsTUFDN0IsTUFBTTtBQUFBLE1BQ04sTUFBTSxpQkFBSyxTQUFTLEVBQUUsU0FBUztBQUFBLE1BQy9CLE1BQU07QUFBQSxNQUNOLGdCQUFnQjtBQUFBLE1BQ2hCLFVBQVU7QUFBQSxNQUNWLGNBQWM7QUFBQSxNQUNkLCtCQUErQjtBQUFBLE1BQy9CLGNBQWM7QUFBQSxNQUNkLGtCQUFrQjtBQUFBLE1BQ2xCLGdCQUFnQjtBQUFBLE1BQ2hCLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFFRCxVQUFNLE9BQU8sV0FBVyxRQUFRLEtBQUssZUFBZTtBQUFBLE1BQ2xELFFBQVE7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxNQUNaLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFDRCxVQUFNLE9BQU8sdUJBQXVCLEtBQUs7QUFFekMsVUFB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
