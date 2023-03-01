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
var sinon = __toESM(require("sinon"));
var import_path = __toESM(require("path"));
var import_chai = require("chai");
var import_uuid = require("uuid");
var import_MIME = require("../../../types/MIME");
var import_stories = require("../../../state/ducks/stories");
var import_noop = require("../../../state/ducks/noop");
var import_reducer = require("../../../state/reducer");
describe("both/state/ducks/stories", () => {
  const getEmptyRootState = /* @__PURE__ */ __name(() => ({
    ...(0, import_reducer.reducer)(void 0, (0, import_noop.noopAction)()),
    stories: (0, import_stories.getEmptyState)()
  }), "getEmptyRootState");
  function getStoryMessage(id) {
    const now = Date.now();
    return {
      conversationId: (0, import_uuid.v4)(),
      id,
      received_at: now,
      sent_at: now,
      timestamp: now,
      type: "story"
    };
  }
  describe("queueStoryDownload", () => {
    const { queueStoryDownload } = import_stories.actions;
    it("no attachment, no dispatch", async function test() {
      const storyId = (0, import_uuid.v4)();
      const messageAttributes = getStoryMessage(storyId);
      window.MessageController.register(storyId, messageAttributes);
      const dispatch = sinon.spy();
      await queueStoryDownload(storyId)(dispatch, getEmptyRootState, null);
      sinon.assert.notCalled(dispatch);
    });
    it("downloading, no dispatch", async function test() {
      const storyId = (0, import_uuid.v4)();
      const messageAttributes = {
        ...getStoryMessage(storyId),
        attachments: [
          {
            contentType: import_MIME.IMAGE_JPEG,
            downloadJobId: (0, import_uuid.v4)(),
            pending: true,
            size: 0
          }
        ]
      };
      window.MessageController.register(storyId, messageAttributes);
      const dispatch = sinon.spy();
      await queueStoryDownload(storyId)(dispatch, getEmptyRootState, null);
      sinon.assert.notCalled(dispatch);
    });
    it("downloaded, no dispatch", async function test() {
      const storyId = (0, import_uuid.v4)();
      const messageAttributes = {
        ...getStoryMessage(storyId),
        attachments: [
          {
            contentType: import_MIME.IMAGE_JPEG,
            path: "image.jpg",
            url: "/path/to/image.jpg",
            size: 0
          }
        ]
      };
      window.MessageController.register(storyId, messageAttributes);
      const dispatch = sinon.spy();
      await queueStoryDownload(storyId)(dispatch, getEmptyRootState, null);
      sinon.assert.notCalled(dispatch);
    });
    it("downloaded, but unresolved, we should resolve the path", async function test() {
      const storyId = (0, import_uuid.v4)();
      const attachment = {
        contentType: import_MIME.IMAGE_JPEG,
        path: "image.jpg",
        size: 0
      };
      const messageAttributes = {
        ...getStoryMessage(storyId),
        attachments: [attachment]
      };
      const rootState = getEmptyRootState();
      const getState = /* @__PURE__ */ __name(() => ({
        ...rootState,
        stories: {
          ...rootState.stories,
          stories: [
            {
              ...messageAttributes,
              attachment: messageAttributes.attachments[0],
              messageId: messageAttributes.id
            }
          ]
        }
      }), "getState");
      window.MessageController.register(storyId, messageAttributes);
      const dispatch = sinon.spy();
      await queueStoryDownload(storyId)(dispatch, getState, null);
      const action = dispatch.getCall(0).args[0];
      sinon.assert.calledWith(dispatch, {
        type: import_stories.RESOLVE_ATTACHMENT_URL,
        payload: {
          messageId: storyId,
          attachmentUrl: action.payload.attachmentUrl
        }
      });
      import_chai.assert.equal(attachment.path, import_path.default.basename(action.payload.attachmentUrl));
      const stateWithStory = {
        ...getEmptyRootState().stories,
        stories: [
          {
            ...messageAttributes,
            messageId: storyId,
            attachment
          }
        ]
      };
      const nextState = (0, import_stories.reducer)(stateWithStory, action);
      import_chai.assert.isDefined(nextState.stories);
      import_chai.assert.equal(nextState.stories[0].attachment?.url, action.payload.attachmentUrl);
      const state = getEmptyRootState().stories;
      const sameState = (0, import_stories.reducer)(state, action);
      import_chai.assert.isDefined(sameState.stories);
      import_chai.assert.equal(sameState, state);
    });
    it("not downloaded, queued for download", async function test() {
      const storyId = (0, import_uuid.v4)();
      const messageAttributes = {
        ...getStoryMessage(storyId),
        attachments: [
          {
            contentType: import_MIME.IMAGE_JPEG,
            size: 0
          }
        ]
      };
      const rootState = getEmptyRootState();
      const getState = /* @__PURE__ */ __name(() => ({
        ...rootState,
        stories: {
          ...rootState.stories,
          stories: [
            {
              ...messageAttributes,
              attachment: messageAttributes.attachments[0],
              messageId: messageAttributes.id
            }
          ]
        }
      }), "getState");
      window.MessageController.register(storyId, messageAttributes);
      const dispatch = sinon.spy();
      await queueStoryDownload(storyId)(dispatch, getState, null);
      sinon.assert.calledWith(dispatch, {
        type: "NOOP",
        payload: null
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3Rvcmllc190ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCAqIGFzIHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5cbmltcG9ydCB0eXBlIHsgU3Rvcmllc1N0YXRlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL3N0b3JpZXMnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlQXR0cmlidXRlc1R5cGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC10eXBlcy5kJztcbmltcG9ydCB7IElNQUdFX0pQRUcgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9NSU1FJztcbmltcG9ydCB7XG4gIGFjdGlvbnMsXG4gIGdldEVtcHR5U3RhdGUsXG4gIHJlZHVjZXIsXG4gIFJFU09MVkVfQVRUQUNITUVOVF9VUkwsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL3N0b3JpZXMnO1xuaW1wb3J0IHsgbm9vcEFjdGlvbiB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL25vb3AnO1xuaW1wb3J0IHsgcmVkdWNlciBhcyByb290UmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL3N0YXRlL3JlZHVjZXInO1xuXG5kZXNjcmliZSgnYm90aC9zdGF0ZS9kdWNrcy9zdG9yaWVzJywgKCkgPT4ge1xuICBjb25zdCBnZXRFbXB0eVJvb3RTdGF0ZSA9ICgpID0+ICh7XG4gICAgLi4ucm9vdFJlZHVjZXIodW5kZWZpbmVkLCBub29wQWN0aW9uKCkpLFxuICAgIHN0b3JpZXM6IGdldEVtcHR5U3RhdGUoKSxcbiAgfSk7XG5cbiAgZnVuY3Rpb24gZ2V0U3RvcnlNZXNzYWdlKGlkOiBzdHJpbmcpOiBNZXNzYWdlQXR0cmlidXRlc1R5cGUge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udmVyc2F0aW9uSWQ6IHV1aWQoKSxcbiAgICAgIGlkLFxuICAgICAgcmVjZWl2ZWRfYXQ6IG5vdyxcbiAgICAgIHNlbnRfYXQ6IG5vdyxcbiAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgdHlwZTogJ3N0b3J5JyxcbiAgICB9O1xuICB9XG5cbiAgZGVzY3JpYmUoJ3F1ZXVlU3RvcnlEb3dubG9hZCcsICgpID0+IHtcbiAgICBjb25zdCB7IHF1ZXVlU3RvcnlEb3dubG9hZCB9ID0gYWN0aW9ucztcblxuICAgIGl0KCdubyBhdHRhY2htZW50LCBubyBkaXNwYXRjaCcsIGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICBjb25zdCBzdG9yeUlkID0gdXVpZCgpO1xuICAgICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSBnZXRTdG9yeU1lc3NhZ2Uoc3RvcnlJZCk7XG5cbiAgICAgIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihzdG9yeUlkLCBtZXNzYWdlQXR0cmlidXRlcyk7XG5cbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBhd2FpdCBxdWV1ZVN0b3J5RG93bmxvYWQoc3RvcnlJZCkoZGlzcGF0Y2gsIGdldEVtcHR5Um9vdFN0YXRlLCBudWxsKTtcblxuICAgICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkaXNwYXRjaCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG93bmxvYWRpbmcsIG5vIGRpc3BhdGNoJywgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgIGNvbnN0IHN0b3J5SWQgPSB1dWlkKCk7XG4gICAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHtcbiAgICAgICAgLi4uZ2V0U3RvcnlNZXNzYWdlKHN0b3J5SWQpLFxuICAgICAgICBhdHRhY2htZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBJTUFHRV9KUEVHLFxuICAgICAgICAgICAgZG93bmxvYWRKb2JJZDogdXVpZCgpLFxuICAgICAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNpemU6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG5cbiAgICAgIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihzdG9yeUlkLCBtZXNzYWdlQXR0cmlidXRlcyk7XG5cbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBhd2FpdCBxdWV1ZVN0b3J5RG93bmxvYWQoc3RvcnlJZCkoZGlzcGF0Y2gsIGdldEVtcHR5Um9vdFN0YXRlLCBudWxsKTtcblxuICAgICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkaXNwYXRjaCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG93bmxvYWRlZCwgbm8gZGlzcGF0Y2gnLCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgY29uc3Qgc3RvcnlJZCA9IHV1aWQoKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0ge1xuICAgICAgICAuLi5nZXRTdG9yeU1lc3NhZ2Uoc3RvcnlJZCksXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgICAgICBwYXRoOiAnaW1hZ2UuanBnJyxcbiAgICAgICAgICAgIHVybDogJy9wYXRoL3RvL2ltYWdlLmpwZycsXG4gICAgICAgICAgICBzaXplOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoc3RvcnlJZCwgbWVzc2FnZUF0dHJpYnV0ZXMpO1xuXG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgYXdhaXQgcXVldWVTdG9yeURvd25sb2FkKHN0b3J5SWQpKGRpc3BhdGNoLCBnZXRFbXB0eVJvb3RTdGF0ZSwgbnVsbCk7XG5cbiAgICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZGlzcGF0Y2gpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Rvd25sb2FkZWQsIGJ1dCB1bnJlc29sdmVkLCB3ZSBzaG91bGQgcmVzb2x2ZSB0aGUgcGF0aCcsIGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICBjb25zdCBzdG9yeUlkID0gdXVpZCgpO1xuICAgICAgY29uc3QgYXR0YWNobWVudCA9IHtcbiAgICAgICAgY29udGVudFR5cGU6IElNQUdFX0pQRUcsXG4gICAgICAgIHBhdGg6ICdpbWFnZS5qcGcnLFxuICAgICAgICBzaXplOiAwLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0ge1xuICAgICAgICAuLi5nZXRTdG9yeU1lc3NhZ2Uoc3RvcnlJZCksXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbYXR0YWNobWVudF0sXG4gICAgICB9O1xuXG4gICAgICBjb25zdCByb290U3RhdGUgPSBnZXRFbXB0eVJvb3RTdGF0ZSgpO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+ICh7XG4gICAgICAgIC4uLnJvb3RTdGF0ZSxcbiAgICAgICAgc3Rvcmllczoge1xuICAgICAgICAgIC4uLnJvb3RTdGF0ZS5zdG9yaWVzLFxuICAgICAgICAgIHN0b3JpZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4ubWVzc2FnZUF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IG1lc3NhZ2VBdHRyaWJ1dGVzLmF0dGFjaG1lbnRzWzBdLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VBdHRyaWJ1dGVzLmlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihzdG9yeUlkLCBtZXNzYWdlQXR0cmlidXRlcyk7XG5cbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBhd2FpdCBxdWV1ZVN0b3J5RG93bmxvYWQoc3RvcnlJZCkoZGlzcGF0Y2gsIGdldFN0YXRlLCBudWxsKTtcblxuICAgICAgY29uc3QgYWN0aW9uID0gZGlzcGF0Y2guZ2V0Q2FsbCgwKS5hcmdzWzBdO1xuXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChkaXNwYXRjaCwge1xuICAgICAgICB0eXBlOiBSRVNPTFZFX0FUVEFDSE1FTlRfVVJMLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgbWVzc2FnZUlkOiBzdG9yeUlkLFxuICAgICAgICAgIGF0dGFjaG1lbnRVcmw6IGFjdGlvbi5wYXlsb2FkLmF0dGFjaG1lbnRVcmwsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChcbiAgICAgICAgYXR0YWNobWVudC5wYXRoLFxuICAgICAgICBwYXRoLmJhc2VuYW1lKGFjdGlvbi5wYXlsb2FkLmF0dGFjaG1lbnRVcmwpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBzdGF0ZVdpdGhTdG9yeTogU3Rvcmllc1N0YXRlVHlwZSA9IHtcbiAgICAgICAgLi4uZ2V0RW1wdHlSb290U3RhdGUoKS5zdG9yaWVzLFxuICAgICAgICBzdG9yaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLi4ubWVzc2FnZUF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IHN0b3J5SWQsXG4gICAgICAgICAgICBhdHRhY2htZW50LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSByZWR1Y2VyKHN0YXRlV2l0aFN0b3J5LCBhY3Rpb24pO1xuICAgICAgYXNzZXJ0LmlzRGVmaW5lZChuZXh0U3RhdGUuc3Rvcmllcyk7XG4gICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgIG5leHRTdGF0ZS5zdG9yaWVzWzBdLmF0dGFjaG1lbnQ/LnVybCxcbiAgICAgICAgYWN0aW9uLnBheWxvYWQuYXR0YWNobWVudFVybFxuICAgICAgKTtcblxuICAgICAgY29uc3Qgc3RhdGUgPSBnZXRFbXB0eVJvb3RTdGF0ZSgpLnN0b3JpZXM7XG5cbiAgICAgIGNvbnN0IHNhbWVTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gICAgICBhc3NlcnQuaXNEZWZpbmVkKHNhbWVTdGF0ZS5zdG9yaWVzKTtcbiAgICAgIGFzc2VydC5lcXVhbChzYW1lU3RhdGUsIHN0YXRlKTtcbiAgICB9KTtcblxuICAgIGl0KCdub3QgZG93bmxvYWRlZCwgcXVldWVkIGZvciBkb3dubG9hZCcsIGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICBjb25zdCBzdG9yeUlkID0gdXVpZCgpO1xuICAgICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIC4uLmdldFN0b3J5TWVzc2FnZShzdG9yeUlkKSxcbiAgICAgICAgYXR0YWNobWVudHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250ZW50VHlwZTogSU1BR0VfSlBFRyxcbiAgICAgICAgICAgIHNpemU6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJvb3RTdGF0ZSA9IGdldEVtcHR5Um9vdFN0YXRlKCk7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlID0gKCkgPT4gKHtcbiAgICAgICAgLi4ucm9vdFN0YXRlLFxuICAgICAgICBzdG9yaWVzOiB7XG4gICAgICAgICAgLi4ucm9vdFN0YXRlLnN0b3JpZXMsXG4gICAgICAgICAgc3RvcmllczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5tZXNzYWdlQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgYXR0YWNobWVudDogbWVzc2FnZUF0dHJpYnV0ZXMuYXR0YWNobWVudHNbMF0sXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUF0dHJpYnV0ZXMuaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKHN0b3J5SWQsIG1lc3NhZ2VBdHRyaWJ1dGVzKTtcblxuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgIGF3YWl0IHF1ZXVlU3RvcnlEb3dubG9hZChzdG9yeUlkKShkaXNwYXRjaCwgZ2V0U3RhdGUsIG51bGwpO1xuXG4gICAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aChkaXNwYXRjaCwge1xuICAgICAgICB0eXBlOiAnTk9PUCcsXG4gICAgICAgIHBheWxvYWQ6IG51bGwsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxZQUF1QjtBQUN2QixrQkFBaUI7QUFDakIsa0JBQXVCO0FBQ3ZCLGtCQUEyQjtBQUkzQixrQkFBMkI7QUFDM0IscUJBS087QUFDUCxrQkFBMkI7QUFDM0IscUJBQXVDO0FBRXZDLFNBQVMsNEJBQTRCLE1BQU07QUFDekMsUUFBTSxvQkFBb0IsNkJBQU87QUFBQSxPQUM1Qiw0QkFBWSxRQUFXLDRCQUFXLENBQUM7QUFBQSxJQUN0QyxTQUFTLGtDQUFjO0FBQUEsRUFDekIsSUFIMEI7QUFLMUIsMkJBQXlCLElBQW1DO0FBQzFELFVBQU0sTUFBTSxLQUFLLElBQUk7QUFFckIsV0FBTztBQUFBLE1BQ0wsZ0JBQWdCLG9CQUFLO0FBQUEsTUFDckI7QUFBQSxNQUNBLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQVhTLEFBYVQsV0FBUyxzQkFBc0IsTUFBTTtBQUNuQyxVQUFNLEVB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
