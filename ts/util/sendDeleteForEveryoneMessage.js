var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sendDeleteForEveryoneMessage_exports = {};
__export(sendDeleteForEveryoneMessage_exports, {
  sendDeleteForEveryoneMessage: () => sendDeleteForEveryoneMessage
});
module.exports = __toCommonJS(sendDeleteForEveryoneMessage_exports);
var Errors = __toESM(require("../types/errors"));
var durations = __toESM(require("./durations"));
var log = __toESM(require("../logging/log"));
var import_Deletes = require("../messageModifiers/Deletes");
var import_conversationJobQueue = require("../jobs/conversationJobQueue");
var import_deleteForEveryone = require("./deleteForEveryone");
var import_idForLogging = require("./idForLogging");
var import_getMessageById = require("../messages/getMessageById");
var import_getRecipientConversationIds = require("./getRecipientConversationIds");
var import_getRecipients = require("./getRecipients");
var import_iterables = require("./iterables");
const THREE_HOURS = durations.HOUR * 3;
async function sendDeleteForEveryoneMessage(conversationAttributes, options) {
  const {
    deleteForEveryoneDuration,
    timestamp: targetTimestamp,
    id: messageId
  } = options;
  const message = await (0, import_getMessageById.getMessageById)(messageId);
  if (!message) {
    throw new Error("sendDeleteForEveryoneMessage: Cannot find message!");
  }
  const messageModel = window.MessageController.register(messageId, message);
  const timestamp = Date.now();
  if (timestamp - targetTimestamp > (deleteForEveryoneDuration || THREE_HOURS)) {
    throw new Error("Cannot send DOE for a message older than three hours");
  }
  messageModel.set({
    deletedForEveryoneSendStatus: (0, import_iterables.zipObject)((0, import_getRecipientConversationIds.getRecipientConversationIds)(conversationAttributes), (0, import_iterables.repeat)(false))
  });
  try {
    const jobData = {
      type: import_conversationJobQueue.conversationQueueJobEnum.enum.DeleteForEveryone,
      conversationId: conversationAttributes.id,
      messageId,
      recipients: (0, import_getRecipients.getRecipients)(conversationAttributes),
      revision: conversationAttributes.revision,
      targetTimestamp
    };
    await import_conversationJobQueue.conversationJobQueue.add(jobData, async (jobToInsert) => {
      const idForLogging = (0, import_idForLogging.getConversationIdForLogging)(conversationAttributes);
      log.info(`sendDeleteForEveryoneMessage: saving message ${idForLogging} and job ${jobToInsert.id}`);
      await window.Signal.Data.saveMessage(messageModel.attributes, {
        jobToInsert,
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
      });
    });
  } catch (error) {
    log.error("sendDeleteForEveryoneMessage: Failed to queue delete for everyone", Errors.toLogFormat(error));
    throw error;
  }
  const deleteModel = new import_Deletes.DeleteModel({
    targetSentTimestamp: targetTimestamp,
    serverTimestamp: Date.now(),
    fromId: window.ConversationController.getOurConversationIdOrThrow()
  });
  await (0, import_deleteForEveryone.deleteForEveryone)(messageModel, deleteModel);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendDeleteForEveryoneMessage
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZERlbGV0ZUZvckV2ZXJ5b25lTWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbkF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblF1ZXVlSm9iRGF0YSB9IGZyb20gJy4uL2pvYnMvY29udmVyc2F0aW9uSm9iUXVldWUnO1xuaW1wb3J0ICogYXMgRXJyb3JzIGZyb20gJy4uL3R5cGVzL2Vycm9ycyc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi9kdXJhdGlvbnMnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IERlbGV0ZU1vZGVsIH0gZnJvbSAnLi4vbWVzc2FnZU1vZGlmaWVycy9EZWxldGVzJztcbmltcG9ydCB7XG4gIGNvbnZlcnNhdGlvbkpvYlF1ZXVlLFxuICBjb252ZXJzYXRpb25RdWV1ZUpvYkVudW0sXG59IGZyb20gJy4uL2pvYnMvY29udmVyc2F0aW9uSm9iUXVldWUnO1xuaW1wb3J0IHsgZGVsZXRlRm9yRXZlcnlvbmUgfSBmcm9tICcuL2RlbGV0ZUZvckV2ZXJ5b25lJztcbmltcG9ydCB7IGdldENvbnZlcnNhdGlvbklkRm9yTG9nZ2luZyB9IGZyb20gJy4vaWRGb3JMb2dnaW5nJztcbmltcG9ydCB7IGdldE1lc3NhZ2VCeUlkIH0gZnJvbSAnLi4vbWVzc2FnZXMvZ2V0TWVzc2FnZUJ5SWQnO1xuaW1wb3J0IHsgZ2V0UmVjaXBpZW50Q29udmVyc2F0aW9uSWRzIH0gZnJvbSAnLi9nZXRSZWNpcGllbnRDb252ZXJzYXRpb25JZHMnO1xuaW1wb3J0IHsgZ2V0UmVjaXBpZW50cyB9IGZyb20gJy4vZ2V0UmVjaXBpZW50cyc7XG5pbXBvcnQgeyByZXBlYXQsIHppcE9iamVjdCB9IGZyb20gJy4vaXRlcmFibGVzJztcblxuY29uc3QgVEhSRUVfSE9VUlMgPSBkdXJhdGlvbnMuSE9VUiAqIDM7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kRGVsZXRlRm9yRXZlcnlvbmVNZXNzYWdlKFxuICBjb252ZXJzYXRpb25BdHRyaWJ1dGVzOiBDb252ZXJzYXRpb25BdHRyaWJ1dGVzVHlwZSxcbiAgb3B0aW9uczoge1xuICAgIGRlbGV0ZUZvckV2ZXJ5b25lRHVyYXRpb24/OiBudW1iZXI7XG4gICAgaWQ6IHN0cmluZztcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgfVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHtcbiAgICBkZWxldGVGb3JFdmVyeW9uZUR1cmF0aW9uLFxuICAgIHRpbWVzdGFtcDogdGFyZ2V0VGltZXN0YW1wLFxuICAgIGlkOiBtZXNzYWdlSWQsXG4gIH0gPSBvcHRpb25zO1xuICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobWVzc2FnZUlkKTtcbiAgaWYgKCFtZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZW5kRGVsZXRlRm9yRXZlcnlvbmVNZXNzYWdlOiBDYW5ub3QgZmluZCBtZXNzYWdlIScpO1xuICB9XG4gIGNvbnN0IG1lc3NhZ2VNb2RlbCA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihtZXNzYWdlSWQsIG1lc3NhZ2UpO1xuXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gIGlmIChcbiAgICB0aW1lc3RhbXAgLSB0YXJnZXRUaW1lc3RhbXAgPlxuICAgIChkZWxldGVGb3JFdmVyeW9uZUR1cmF0aW9uIHx8IFRIUkVFX0hPVVJTKVxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZW5kIERPRSBmb3IgYSBtZXNzYWdlIG9sZGVyIHRoYW4gdGhyZWUgaG91cnMnKTtcbiAgfVxuXG4gIG1lc3NhZ2VNb2RlbC5zZXQoe1xuICAgIGRlbGV0ZWRGb3JFdmVyeW9uZVNlbmRTdGF0dXM6IHppcE9iamVjdChcbiAgICAgIGdldFJlY2lwaWVudENvbnZlcnNhdGlvbklkcyhjb252ZXJzYXRpb25BdHRyaWJ1dGVzKSxcbiAgICAgIHJlcGVhdChmYWxzZSlcbiAgICApLFxuICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IGpvYkRhdGE6IENvbnZlcnNhdGlvblF1ZXVlSm9iRGF0YSA9IHtcbiAgICAgIHR5cGU6IGNvbnZlcnNhdGlvblF1ZXVlSm9iRW51bS5lbnVtLkRlbGV0ZUZvckV2ZXJ5b25lLFxuICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbkF0dHJpYnV0ZXMuaWQsXG4gICAgICBtZXNzYWdlSWQsXG4gICAgICByZWNpcGllbnRzOiBnZXRSZWNpcGllbnRzKGNvbnZlcnNhdGlvbkF0dHJpYnV0ZXMpLFxuICAgICAgcmV2aXNpb246IGNvbnZlcnNhdGlvbkF0dHJpYnV0ZXMucmV2aXNpb24sXG4gICAgICB0YXJnZXRUaW1lc3RhbXAsXG4gICAgfTtcbiAgICBhd2FpdCBjb252ZXJzYXRpb25Kb2JRdWV1ZS5hZGQoam9iRGF0YSwgYXN5bmMgam9iVG9JbnNlcnQgPT4ge1xuICAgICAgY29uc3QgaWRGb3JMb2dnaW5nID0gZ2V0Q29udmVyc2F0aW9uSWRGb3JMb2dnaW5nKGNvbnZlcnNhdGlvbkF0dHJpYnV0ZXMpO1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBzZW5kRGVsZXRlRm9yRXZlcnlvbmVNZXNzYWdlOiBzYXZpbmcgbWVzc2FnZSAke2lkRm9yTG9nZ2luZ30gYW5kIGpvYiAke2pvYlRvSW5zZXJ0LmlkfWBcbiAgICAgICk7XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuc2F2ZU1lc3NhZ2UobWVzc2FnZU1vZGVsLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgam9iVG9JbnNlcnQsXG4gICAgICAgIG91clV1aWQ6IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpLnRvU3RyaW5nKCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICAnc2VuZERlbGV0ZUZvckV2ZXJ5b25lTWVzc2FnZTogRmFpbGVkIHRvIHF1ZXVlIGRlbGV0ZSBmb3IgZXZlcnlvbmUnLFxuICAgICAgRXJyb3JzLnRvTG9nRm9ybWF0KGVycm9yKVxuICAgICk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cblxuICBjb25zdCBkZWxldGVNb2RlbCA9IG5ldyBEZWxldGVNb2RlbCh7XG4gICAgdGFyZ2V0U2VudFRpbWVzdGFtcDogdGFyZ2V0VGltZXN0YW1wLFxuICAgIHNlcnZlclRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICBmcm9tSWQ6IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpLFxuICB9KTtcbiAgYXdhaXQgZGVsZXRlRm9yRXZlcnlvbmUobWVzc2FnZU1vZGVsLCBkZWxldGVNb2RlbCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0EsYUFBd0I7QUFDeEIsZ0JBQTJCO0FBQzNCLFVBQXFCO0FBQ3JCLHFCQUE0QjtBQUM1QixrQ0FHTztBQUNQLCtCQUFrQztBQUNsQywwQkFBNEM7QUFDNUMsNEJBQStCO0FBQy9CLHlDQUE0QztBQUM1QywyQkFBOEI7QUFDOUIsdUJBQWtDO0FBRWxDLE1BQU0sY0FBYyxVQUFVLE9BQU87QUFFckMsNENBQ0Usd0JBQ0EsU0FLZTtBQUNmLFFBQU07QUFBQSxJQUNKO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxJQUFJO0FBQUEsTUFDRjtBQUNKLFFBQU0sVUFBVSxNQUFNLDBDQUFlLFNBQVM7QUFDOUMsTUFBSSxDQUFDLFNBQVM7QUFDWixVQUFNLElBQUksTUFBTSxvREFBb0Q7QUFBQSxFQUN0RTtBQUNBLFFBQU0sZUFBZSxPQUFPLGtCQUFrQixTQUFTLFdBQVcsT0FBTztBQUV6RSxRQUFNLFlBQVksS0FBSyxJQUFJO0FBQzNCLE1BQ0UsWUFBWSxrQkFDWCw4QkFBNkIsY0FDOUI7QUFDQSxVQUFNLElBQUksTUFBTSxzREFBc0Q7QUFBQSxFQUN4RTtBQUVBLGVBQWEsSUFBSTtBQUFBLElBQ2YsOEJBQThCLGdDQUM1QixvRUFBNEIsc0JBQXNCLEdBQ2xELDZCQUFPLEtBQUssQ0FDZDtBQUFBLEVBQ0YsQ0FBQztBQUVELE1BQUk7QUFDRixVQUFNLFVBQW9DO0FBQUEsTUFDeEMsTUFBTSxxREFBeUIsS0FBSztBQUFBLE1BQ3BDLGdCQUFnQix1QkFBdUI7QUFBQSxNQUN2QztBQUFBLE1BQ0EsWUFBWSx3Q0FBYyxzQkFBc0I7QUFBQSxNQUNoRCxVQUFVLHVCQUF1QjtBQUFBLE1BQ2pDO0FBQUEsSUFDRjtBQUNBLFVBQU0saURBQXFCLElBQUksU0FBUyxPQUFNLGdCQUFlO0FBQzNELFlBQU0sZUFBZSxxREFBNEIsc0JBQXNCO0FBQ3ZFLFVBQUksS0FDRixnREFBZ0Qsd0JBQXdCLFlBQVksSUFDdEY7QUFDQSxZQUFNLE9BQU8sT0FBTyxLQUFLLFlBQVksYUFBYSxZQUFZO0FBQUEsUUFDNUQ7QUFBQSxRQUNBLFNBQVMsT0FBTyxXQUFXLFFBQVEsS0FBSyxlQUFlLEVBQUUsU0FBUztBQUFBLE1BQ3BFLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNILFNBQVMsT0FBUDtBQUNBLFFBQUksTUFDRixxRUFDQSxPQUFPLFlBQVksS0FBSyxDQUMxQjtBQUNBLFVBQU07QUFBQSxFQUNSO0FBRUEsUUFBTSxjQUFjLElBQUksMkJBQVk7QUFBQSxJQUNsQyxxQkFBcUI7QUFBQSxJQUNyQixpQkFBaUIsS0FBSyxJQUFJO0FBQUEsSUFDMUIsUUFBUSxPQUFPLHVCQUF1Qiw0QkFBNEI7QUFBQSxFQUNwRSxDQUFDO0FBQ0QsUUFBTSxnREFBa0IsY0FBYyxXQUFXO0FBQ25EO0FBbkVzQiIsCiAgIm5hbWVzIjogW10KfQo=
