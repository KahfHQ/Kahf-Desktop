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
var MessageReceipts_exports = {};
__export(MessageReceipts_exports, {
  MessageReceiptType: () => MessageReceiptType,
  MessageReceipts: () => MessageReceipts
});
module.exports = __toCommonJS(MessageReceipts_exports);
var import_lodash = require("lodash");
var import_backbone = require("backbone");
var import_message = require("../state/selectors/message");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_getOwn = require("../util/getOwn");
var import_missingCaseError = require("../util/missingCaseError");
var import_waitBatcher = require("../util/waitBatcher");
var import_MessageSendState = require("../messages/MessageSendState");
var import_Client = __toESM(require("../sql/Client"));
var log = __toESM(require("../logging/log"));
const { deleteSentProtoRecipient } = import_Client.default;
var MessageReceiptType = /* @__PURE__ */ ((MessageReceiptType2) => {
  MessageReceiptType2["Delivery"] = "Delivery";
  MessageReceiptType2["Read"] = "Read";
  MessageReceiptType2["View"] = "View";
  return MessageReceiptType2;
})(MessageReceiptType || {});
class MessageReceiptModel extends import_backbone.Model {
}
let singleton;
const deleteSentProtoBatcher = (0, import_waitBatcher.createWaitBatcher)({
  name: "deleteSentProtoBatcher",
  wait: 250,
  maxSize: 30,
  async processBatch(items) {
    log.info(`MessageReceipts: Batching ${items.length} sent proto recipients deletes`);
    await deleteSentProtoRecipient(items);
  }
});
async function getTargetMessage(sourceId, sourceUuid, messages) {
  if (messages.length === 0) {
    return null;
  }
  const message = messages.find((item) => ((0, import_message.isOutgoing)(item) || (0, import_message.isStory)(item)) && sourceId === item.conversationId);
  if (message) {
    return window.MessageController.register(message.id, message);
  }
  const groups = await window.Signal.Data.getAllGroupsInvolvingUuid(sourceUuid);
  const ids = groups.map((item) => item.id);
  ids.push(sourceId);
  const target = messages.find((item) => ((0, import_message.isOutgoing)(item) || (0, import_message.isStory)(item)) && ids.includes(item.conversationId));
  if (!target) {
    return null;
  }
  return window.MessageController.register(target.id, target);
}
const wasDeliveredWithSealedSender = /* @__PURE__ */ __name((conversationId, message) => (message.get("unidentifiedDeliveries") || []).some((identifier) => window.ConversationController.getConversationId(identifier) === conversationId), "wasDeliveredWithSealedSender");
class MessageReceipts extends import_backbone.Collection {
  static getSingleton() {
    if (!singleton) {
      singleton = new MessageReceipts();
    }
    return singleton;
  }
  forMessage(conversation, message) {
    if (!(0, import_message.isOutgoing)(message.attributes)) {
      return [];
    }
    let ids;
    if ((0, import_whatTypeOfConversation.isDirectConversation)(conversation.attributes)) {
      ids = [conversation.id];
    } else {
      ids = conversation.getMemberIds();
    }
    const receipts = this.filter((receipt) => receipt.get("messageSentAt") === message.get("sent_at") && ids.includes(receipt.get("sourceConversationId")));
    if (receipts.length) {
      log.info("Found early receipts for message");
      this.remove(receipts);
    }
    return receipts;
  }
  async updateMessageSendState(receipt, message) {
    const messageSentAt = receipt.get("messageSentAt");
    const receiptTimestamp = receipt.get("receiptTimestamp");
    const sourceConversationId = receipt.get("sourceConversationId");
    const type = receipt.get("type");
    const oldSendStateByConversationId = message.get("sendStateByConversationId") || {};
    const oldSendState = (0, import_getOwn.getOwn)(oldSendStateByConversationId, sourceConversationId) ?? { status: import_MessageSendState.SendStatus.Sent, updatedAt: void 0 };
    let sendActionType;
    switch (type) {
      case "Delivery" /* Delivery */:
        sendActionType = import_MessageSendState.SendActionType.GotDeliveryReceipt;
        break;
      case "Read" /* Read */:
        sendActionType = import_MessageSendState.SendActionType.GotReadReceipt;
        break;
      case "View" /* View */:
        sendActionType = import_MessageSendState.SendActionType.GotViewedReceipt;
        break;
      default:
        throw (0, import_missingCaseError.missingCaseError)(type);
    }
    const newSendState = (0, import_MessageSendState.sendStateReducer)(oldSendState, {
      type: sendActionType,
      updatedAt: receiptTimestamp
    });
    if (!(0, import_lodash.isEqual)(oldSendState, newSendState)) {
      message.set("sendStateByConversationId", {
        ...oldSendStateByConversationId,
        [sourceConversationId]: newSendState
      });
      window.Signal.Util.queueUpdateMessage(message.attributes);
      const conversation = window.ConversationController.get(message.get("conversationId"));
      const updateLeftPane = conversation ? conversation.debouncedUpdateLastMessage : void 0;
      if (updateLeftPane) {
        updateLeftPane();
      }
    }
    if (type === "Delivery" /* Delivery */ && wasDeliveredWithSealedSender(sourceConversationId, message) || type === "Read" /* Read */) {
      const recipient = window.ConversationController.get(sourceConversationId);
      const recipientUuid = recipient?.get("uuid");
      const deviceId = receipt.get("sourceDevice");
      if (recipientUuid && deviceId) {
        await deleteSentProtoBatcher.add({
          timestamp: messageSentAt,
          recipientUuid,
          deviceId
        });
      } else {
        log.warn(`MessageReceipts.onReceipt: Missing uuid or deviceId for deliveredTo ${sourceConversationId}`);
      }
    }
  }
  async onReceipt(receipt) {
    const messageSentAt = receipt.get("messageSentAt");
    const sourceConversationId = receipt.get("sourceConversationId");
    const sourceUuid = receipt.get("sourceUuid");
    const type = receipt.get("type");
    try {
      const messages = await window.Signal.Data.getMessagesBySentAt(messageSentAt);
      const message = await getTargetMessage(sourceConversationId, sourceUuid, messages);
      if (message) {
        await this.updateMessageSendState(receipt, message);
      } else {
        const targetMessages = messages.filter((item) => item.storyDistributionListId && item.sendStateByConversationId && !item.deletedForEveryone && Boolean(item.sendStateByConversationId[sourceConversationId]));
        if (!targetMessages.length) {
          log.info("No message for receipt", type, sourceConversationId, messageSentAt);
          return;
        }
        await Promise.all(targetMessages.map((msg) => {
          const model = window.MessageController.register(msg.id, msg);
          return this.updateMessageSendState(receipt, model);
        }));
      }
      this.remove(receipt);
    } catch (error) {
      log.error("MessageReceipts.onReceipt error:", error && error.stack ? error.stack : error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageReceiptType,
  MessageReceipts
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWVzc2FnZVJlY2VpcHRzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNi0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cblxuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBDb2xsZWN0aW9uLCBNb2RlbCB9IGZyb20gJ2JhY2tib25lJztcblxuaW1wb3J0IHR5cGUgeyBDb252ZXJzYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL21lc3NhZ2VzJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlIH0gZnJvbSAnLi4vbW9kZWwtdHlwZXMuZCc7XG5pbXBvcnQgeyBpc091dGdvaW5nLCBpc1N0b3J5IH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL21lc3NhZ2UnO1xuaW1wb3J0IHsgaXNEaXJlY3RDb252ZXJzYXRpb24gfSBmcm9tICcuLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgZ2V0T3duIH0gZnJvbSAnLi4vdXRpbC9nZXRPd24nO1xuaW1wb3J0IHsgbWlzc2luZ0Nhc2VFcnJvciB9IGZyb20gJy4uL3V0aWwvbWlzc2luZ0Nhc2VFcnJvcic7XG5pbXBvcnQgeyBjcmVhdGVXYWl0QmF0Y2hlciB9IGZyb20gJy4uL3V0aWwvd2FpdEJhdGNoZXInO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHtcbiAgU2VuZEFjdGlvblR5cGUsXG4gIFNlbmRTdGF0dXMsXG4gIHNlbmRTdGF0ZVJlZHVjZXIsXG59IGZyb20gJy4uL21lc3NhZ2VzL01lc3NhZ2VTZW5kU3RhdGUnO1xuaW1wb3J0IHR5cGUgeyBEZWxldGVTZW50UHJvdG9SZWNpcGllbnRPcHRpb25zVHlwZSB9IGZyb20gJy4uL3NxbC9JbnRlcmZhY2UnO1xuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuXG5jb25zdCB7IGRlbGV0ZVNlbnRQcm90b1JlY2lwaWVudCB9ID0gZGF0YUludGVyZmFjZTtcblxuZXhwb3J0IGVudW0gTWVzc2FnZVJlY2VpcHRUeXBlIHtcbiAgRGVsaXZlcnkgPSAnRGVsaXZlcnknLFxuICBSZWFkID0gJ1JlYWQnLFxuICBWaWV3ID0gJ1ZpZXcnLFxufVxuXG5leHBvcnQgdHlwZSBNZXNzYWdlUmVjZWlwdEF0dHJpYnV0ZXNUeXBlID0ge1xuICBtZXNzYWdlU2VudEF0OiBudW1iZXI7XG4gIHJlY2VpcHRUaW1lc3RhbXA6IG51bWJlcjtcbiAgc291cmNlVXVpZDogVVVJRFN0cmluZ1R5cGU7XG4gIHNvdXJjZUNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIHNvdXJjZURldmljZTogbnVtYmVyO1xuICB0eXBlOiBNZXNzYWdlUmVjZWlwdFR5cGU7XG59O1xuXG5jbGFzcyBNZXNzYWdlUmVjZWlwdE1vZGVsIGV4dGVuZHMgTW9kZWw8TWVzc2FnZVJlY2VpcHRBdHRyaWJ1dGVzVHlwZT4ge31cblxubGV0IHNpbmdsZXRvbjogTWVzc2FnZVJlY2VpcHRzIHwgdW5kZWZpbmVkO1xuXG5jb25zdCBkZWxldGVTZW50UHJvdG9CYXRjaGVyID0gY3JlYXRlV2FpdEJhdGNoZXIoe1xuICBuYW1lOiAnZGVsZXRlU2VudFByb3RvQmF0Y2hlcicsXG4gIHdhaXQ6IDI1MCxcbiAgbWF4U2l6ZTogMzAsXG4gIGFzeW5jIHByb2Nlc3NCYXRjaChpdGVtczogQXJyYXk8RGVsZXRlU2VudFByb3RvUmVjaXBpZW50T3B0aW9uc1R5cGU+KSB7XG4gICAgbG9nLmluZm8oXG4gICAgICBgTWVzc2FnZVJlY2VpcHRzOiBCYXRjaGluZyAke2l0ZW1zLmxlbmd0aH0gc2VudCBwcm90byByZWNpcGllbnRzIGRlbGV0ZXNgXG4gICAgKTtcbiAgICBhd2FpdCBkZWxldGVTZW50UHJvdG9SZWNpcGllbnQoaXRlbXMpO1xuICB9LFxufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFRhcmdldE1lc3NhZ2UoXG4gIHNvdXJjZUlkOiBzdHJpbmcsXG4gIHNvdXJjZVV1aWQ6IFVVSURTdHJpbmdUeXBlLFxuICBtZXNzYWdlczogUmVhZG9ubHlBcnJheTxNZXNzYWdlQXR0cmlidXRlc1R5cGU+XG4pOiBQcm9taXNlPE1lc3NhZ2VNb2RlbCB8IG51bGw+IHtcbiAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlcy5maW5kKFxuICAgIGl0ZW0gPT5cbiAgICAgIChpc091dGdvaW5nKGl0ZW0pIHx8IGlzU3RvcnkoaXRlbSkpICYmIHNvdXJjZUlkID09PSBpdGVtLmNvbnZlcnNhdGlvbklkXG4gICk7XG4gIGlmIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihtZXNzYWdlLmlkLCBtZXNzYWdlKTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwcyA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRBbGxHcm91cHNJbnZvbHZpbmdVdWlkKHNvdXJjZVV1aWQpO1xuXG4gIGNvbnN0IGlkcyA9IGdyb3Vwcy5tYXAoaXRlbSA9PiBpdGVtLmlkKTtcbiAgaWRzLnB1c2goc291cmNlSWQpO1xuXG4gIGNvbnN0IHRhcmdldCA9IG1lc3NhZ2VzLmZpbmQoXG4gICAgaXRlbSA9PlxuICAgICAgKGlzT3V0Z29pbmcoaXRlbSkgfHwgaXNTdG9yeShpdGVtKSkgJiYgaWRzLmluY2x1ZGVzKGl0ZW0uY29udmVyc2F0aW9uSWQpXG4gICk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKHRhcmdldC5pZCwgdGFyZ2V0KTtcbn1cblxuY29uc3Qgd2FzRGVsaXZlcmVkV2l0aFNlYWxlZFNlbmRlciA9IChcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgbWVzc2FnZTogTWVzc2FnZU1vZGVsXG4pOiBib29sZWFuID0+XG4gIChtZXNzYWdlLmdldCgndW5pZGVudGlmaWVkRGVsaXZlcmllcycpIHx8IFtdKS5zb21lKFxuICAgIGlkZW50aWZpZXIgPT5cbiAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldENvbnZlcnNhdGlvbklkKGlkZW50aWZpZXIpID09PVxuICAgICAgY29udmVyc2F0aW9uSWRcbiAgKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VSZWNlaXB0cyBleHRlbmRzIENvbGxlY3Rpb248TWVzc2FnZVJlY2VpcHRNb2RlbD4ge1xuICBzdGF0aWMgZ2V0U2luZ2xldG9uKCk6IE1lc3NhZ2VSZWNlaXB0cyB7XG4gICAgaWYgKCFzaW5nbGV0b24pIHtcbiAgICAgIHNpbmdsZXRvbiA9IG5ldyBNZXNzYWdlUmVjZWlwdHMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2luZ2xldG9uO1xuICB9XG5cbiAgZm9yTWVzc2FnZShcbiAgICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsLFxuICAgIG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbFxuICApOiBBcnJheTxNZXNzYWdlUmVjZWlwdE1vZGVsPiB7XG4gICAgaWYgKCFpc091dGdvaW5nKG1lc3NhZ2UuYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbGV0IGlkczogQXJyYXk8c3RyaW5nPjtcbiAgICBpZiAoaXNEaXJlY3RDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZHMgPSBbY29udmVyc2F0aW9uLmlkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRzID0gY29udmVyc2F0aW9uLmdldE1lbWJlcklkcygpO1xuICAgIH1cbiAgICBjb25zdCByZWNlaXB0cyA9IHRoaXMuZmlsdGVyKFxuICAgICAgcmVjZWlwdCA9PlxuICAgICAgICByZWNlaXB0LmdldCgnbWVzc2FnZVNlbnRBdCcpID09PSBtZXNzYWdlLmdldCgnc2VudF9hdCcpICYmXG4gICAgICAgIGlkcy5pbmNsdWRlcyhyZWNlaXB0LmdldCgnc291cmNlQ29udmVyc2F0aW9uSWQnKSlcbiAgICApO1xuICAgIGlmIChyZWNlaXB0cy5sZW5ndGgpIHtcbiAgICAgIGxvZy5pbmZvKCdGb3VuZCBlYXJseSByZWNlaXB0cyBmb3IgbWVzc2FnZScpO1xuICAgICAgdGhpcy5yZW1vdmUocmVjZWlwdHMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVjZWlwdHM7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZU1lc3NhZ2VTZW5kU3RhdGUoXG4gICAgcmVjZWlwdDogTWVzc2FnZVJlY2VpcHRNb2RlbCxcbiAgICBtZXNzYWdlOiBNZXNzYWdlTW9kZWxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbWVzc2FnZVNlbnRBdCA9IHJlY2VpcHQuZ2V0KCdtZXNzYWdlU2VudEF0Jyk7XG4gICAgY29uc3QgcmVjZWlwdFRpbWVzdGFtcCA9IHJlY2VpcHQuZ2V0KCdyZWNlaXB0VGltZXN0YW1wJyk7XG4gICAgY29uc3Qgc291cmNlQ29udmVyc2F0aW9uSWQgPSByZWNlaXB0LmdldCgnc291cmNlQ29udmVyc2F0aW9uSWQnKTtcbiAgICBjb25zdCB0eXBlID0gcmVjZWlwdC5nZXQoJ3R5cGUnKTtcblxuICAgIGNvbnN0IG9sZFNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgPVxuICAgICAgbWVzc2FnZS5nZXQoJ3NlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQnKSB8fCB7fTtcbiAgICBjb25zdCBvbGRTZW5kU3RhdGUgPSBnZXRPd24oXG4gICAgICBvbGRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgc291cmNlQ29udmVyc2F0aW9uSWRcbiAgICApID8/IHsgc3RhdHVzOiBTZW5kU3RhdHVzLlNlbnQsIHVwZGF0ZWRBdDogdW5kZWZpbmVkIH07XG5cbiAgICBsZXQgc2VuZEFjdGlvblR5cGU6IFNlbmRBY3Rpb25UeXBlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBNZXNzYWdlUmVjZWlwdFR5cGUuRGVsaXZlcnk6XG4gICAgICAgIHNlbmRBY3Rpb25UeXBlID0gU2VuZEFjdGlvblR5cGUuR290RGVsaXZlcnlSZWNlaXB0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTWVzc2FnZVJlY2VpcHRUeXBlLlJlYWQ6XG4gICAgICAgIHNlbmRBY3Rpb25UeXBlID0gU2VuZEFjdGlvblR5cGUuR290UmVhZFJlY2VpcHQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNZXNzYWdlUmVjZWlwdFR5cGUuVmlldzpcbiAgICAgICAgc2VuZEFjdGlvblR5cGUgPSBTZW5kQWN0aW9uVHlwZS5Hb3RWaWV3ZWRSZWNlaXB0O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IodHlwZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3U2VuZFN0YXRlID0gc2VuZFN0YXRlUmVkdWNlcihvbGRTZW5kU3RhdGUsIHtcbiAgICAgIHR5cGU6IHNlbmRBY3Rpb25UeXBlLFxuICAgICAgdXBkYXRlZEF0OiByZWNlaXB0VGltZXN0YW1wLFxuICAgIH0pO1xuXG4gICAgLy8gVGhlIHNlbmQgc3RhdGUgbWF5IG5vdCBjaGFuZ2UuIEZvciBleGFtcGxlLCB0aGlzIGNhbiBoYXBwZW4gaWYgd2UgZ2V0IGEgcmVhZFxuICAgIC8vICAgcmVjZWlwdCBiZWZvcmUgYSBkZWxpdmVyeSByZWNlaXB0LlxuICAgIGlmICghaXNFcXVhbChvbGRTZW5kU3RhdGUsIG5ld1NlbmRTdGF0ZSkpIHtcbiAgICAgIG1lc3NhZ2Uuc2V0KCdzZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkJywge1xuICAgICAgICAuLi5vbGRTZW5kU3RhdGVCeUNvbnZlcnNhdGlvbklkLFxuICAgICAgICBbc291cmNlQ29udmVyc2F0aW9uSWRdOiBuZXdTZW5kU3RhdGUsXG4gICAgICB9KTtcblxuICAgICAgd2luZG93LlNpZ25hbC5VdGlsLnF1ZXVlVXBkYXRlTWVzc2FnZShtZXNzYWdlLmF0dHJpYnV0ZXMpO1xuXG4gICAgICAvLyBub3RpZnkgZnJvbnRlbmQgbGlzdGVuZXJzXG4gICAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoXG4gICAgICAgIG1lc3NhZ2UuZ2V0KCdjb252ZXJzYXRpb25JZCcpXG4gICAgICApO1xuICAgICAgY29uc3QgdXBkYXRlTGVmdFBhbmUgPSBjb252ZXJzYXRpb25cbiAgICAgICAgPyBjb252ZXJzYXRpb24uZGVib3VuY2VkVXBkYXRlTGFzdE1lc3NhZ2VcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAodXBkYXRlTGVmdFBhbmUpIHtcbiAgICAgICAgdXBkYXRlTGVmdFBhbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAodHlwZSA9PT0gTWVzc2FnZVJlY2VpcHRUeXBlLkRlbGl2ZXJ5ICYmXG4gICAgICAgIHdhc0RlbGl2ZXJlZFdpdGhTZWFsZWRTZW5kZXIoc291cmNlQ29udmVyc2F0aW9uSWQsIG1lc3NhZ2UpKSB8fFxuICAgICAgdHlwZSA9PT0gTWVzc2FnZVJlY2VpcHRUeXBlLlJlYWRcbiAgICApIHtcbiAgICAgIGNvbnN0IHJlY2lwaWVudCA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChzb3VyY2VDb252ZXJzYXRpb25JZCk7XG4gICAgICBjb25zdCByZWNpcGllbnRVdWlkID0gcmVjaXBpZW50Py5nZXQoJ3V1aWQnKTtcbiAgICAgIGNvbnN0IGRldmljZUlkID0gcmVjZWlwdC5nZXQoJ3NvdXJjZURldmljZScpO1xuXG4gICAgICBpZiAocmVjaXBpZW50VXVpZCAmJiBkZXZpY2VJZCkge1xuICAgICAgICBhd2FpdCBkZWxldGVTZW50UHJvdG9CYXRjaGVyLmFkZCh7XG4gICAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlU2VudEF0LFxuICAgICAgICAgIHJlY2lwaWVudFV1aWQsXG4gICAgICAgICAgZGV2aWNlSWQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYE1lc3NhZ2VSZWNlaXB0cy5vblJlY2VpcHQ6IE1pc3NpbmcgdXVpZCBvciBkZXZpY2VJZCBmb3IgZGVsaXZlcmVkVG8gJHtzb3VyY2VDb252ZXJzYXRpb25JZH1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb25SZWNlaXB0KHJlY2VpcHQ6IE1lc3NhZ2VSZWNlaXB0TW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXNzYWdlU2VudEF0ID0gcmVjZWlwdC5nZXQoJ21lc3NhZ2VTZW50QXQnKTtcbiAgICBjb25zdCBzb3VyY2VDb252ZXJzYXRpb25JZCA9IHJlY2VpcHQuZ2V0KCdzb3VyY2VDb252ZXJzYXRpb25JZCcpO1xuICAgIGNvbnN0IHNvdXJjZVV1aWQgPSByZWNlaXB0LmdldCgnc291cmNlVXVpZCcpO1xuICAgIGNvbnN0IHR5cGUgPSByZWNlaXB0LmdldCgndHlwZScpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLmdldE1lc3NhZ2VzQnlTZW50QXQoXG4gICAgICAgIG1lc3NhZ2VTZW50QXRcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBnZXRUYXJnZXRNZXNzYWdlKFxuICAgICAgICBzb3VyY2VDb252ZXJzYXRpb25JZCxcbiAgICAgICAgc291cmNlVXVpZCxcbiAgICAgICAgbWVzc2FnZXNcbiAgICAgICk7XG5cbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudXBkYXRlTWVzc2FnZVNlbmRTdGF0ZShyZWNlaXB0LCBtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGRpZG4ndCBmaW5kIGFueSBtZXNzYWdlcyBidXQgbWF5YmUgaXQncyBhIHN0b3J5IHNlbnQgbWVzc2FnZVxuICAgICAgICBjb25zdCB0YXJnZXRNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihcbiAgICAgICAgICBpdGVtID0+XG4gICAgICAgICAgICBpdGVtLnN0b3J5RGlzdHJpYnV0aW9uTGlzdElkICYmXG4gICAgICAgICAgICBpdGVtLnNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWQgJiZcbiAgICAgICAgICAgICFpdGVtLmRlbGV0ZWRGb3JFdmVyeW9uZSAmJlxuICAgICAgICAgICAgQm9vbGVhbihpdGVtLnNlbmRTdGF0ZUJ5Q29udmVyc2F0aW9uSWRbc291cmNlQ29udmVyc2F0aW9uSWRdKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIE5vcGUsIG5vIHRhcmdldCBtZXNzYWdlIHdhcyBmb3VuZFxuICAgICAgICBpZiAoIXRhcmdldE1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICAgJ05vIG1lc3NhZ2UgZm9yIHJlY2VpcHQnLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIHNvdXJjZUNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgbWVzc2FnZVNlbnRBdFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgdGFyZ2V0TWVzc2FnZXMubWFwKG1zZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3Rlcihtc2cuaWQsIG1zZyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVNZXNzYWdlU2VuZFN0YXRlKHJlY2VpcHQsIG1vZGVsKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZShyZWNlaXB0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnTWVzc2FnZVJlY2VpcHRzLm9uUmVjZWlwdCBlcnJvcjonLFxuICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxvQkFBd0I7QUFDeEIsc0JBQWtDO0FBS2xDLHFCQUFvQztBQUNwQyxvQ0FBcUM7QUFDckMsb0JBQXVCO0FBQ3ZCLDhCQUFpQztBQUNqQyx5QkFBa0M7QUFFbEMsOEJBSU87QUFFUCxvQkFBMEI7QUFDMUIsVUFBcUI7QUFFckIsTUFBTSxFQUFFLDZCQUE2QjtBQUU5QixJQUFLLHFCQUFMLGtCQUFLLHdCQUFMO0FBQ0wsb0NBQVc7QUFDWCxnQ0FBTztBQUNQLGdDQUFPO0FBSEc7QUFBQTtBQWVaLE1BQU0sNEJBQTRCLHNCQUFvQztBQUFDO0FBQXZFLEFBRUEsSUFBSTtBQUVKLE1BQU0seUJBQXlCLDBDQUFrQjtBQUFBLEVBQy9DLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxRQUNILGFBQWEsT0FBbUQ7QUFDcEUsUUFBSSxLQUNGLDZCQUE2QixNQUFNLHNDQUNyQztBQUNBLFVBQU0seUJBQXlCLEtBQUs7QUFBQSxFQUN0QztBQUNGLENBQUM7QUFFRCxnQ0FDRSxVQUNBLFlBQ0EsVUFDOEI7QUFDOUIsTUFBSSxTQUFTLFdBQVcsR0FBRztBQUN6QixXQUFPO0FBQUEsRUFDVDtBQUNBLFFBQU0sVUFBVSxTQUFT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YjtBQUNKLFVBQUksZ0JBQWdCO0FBQ2xCLHVCQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBRUEsUUFDRyxTQUFTLDZCQUNSLDZCQUE2QixzQkFBc0IsT0FBTyxLQUM1RCxTQUFTLG1CQUNUO0FBQ0EsWUFBTSxZQUFZLE9BQU8sdUJBQXVCLElBQUksb0JBQW9CO0FBQ3hFLFlBQU0sZ0JBQWdCLFdBQVcsSUFBSSxNQUFNO0FBQzNDLFlBQU0sV0FBVyxRQUFRLElBQUksY0FBYztBQUUzQyxVQUFJLGlCQUFpQixVQUFVO0FBQzdCLGNBQU0sdUJBQXVCLElBQUk7QUFBQSxVQUMvQixXQUFXO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILE9BQU87QUFDTCxZQUFJLEtBQ0YsdUVBQXVFLHNCQUN6RTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLFFBRU0sVUFBVSxTQUE2QztBQUMzRCxVQUFNLGdCQUFnQixRQUFRLElBQUksZUFBZTtBQUNqRCxVQUFNLHVCQUF1QixRQUFRLElBQUksc0JBQXNCO0FBQy9ELFVBQU0sYUFBYSxRQUFRLElBQUksWUFBWTtBQUMzQyxVQUFNLE9BQU8sUUFBUSxJQUFJLE1BQU07QUFFL0IsUUFBSTtBQUNGLFlBQU0sV0FBVyxNQUFNLE9BQU8sT0FBTyxLQUFLLG9CQUN4QyxhQUNGO0FBRUEsWUFBTSxVQUFVLE1BQU0saUJBQ3BCLHNCQUNBLFlBQ0EsUUFDRjtBQUVBLFVBQUksU0FBUztBQUNYLGNBQU0sS0FBSyx1QkFBdUIsU0FBUyxPQUFPO0FBQUEsTUFDcEQsT0FBTztBQUVMLGNBQU0saUJBQWlCLFNBQVMsT0FDOUIsVUFDRSxLQUFLLDJCQUNMLEtBQUssNkJBQ0wsQ0FBQyxLQUFLLHNCQUNOLFFBQVEsS0FBSywwQkFBMEIscUJBQXFCLENBQ2hFO0FBR0EsWUFBSSxDQUFDLGVBQWUsUUFBUTtBQUMxQixjQUFJLEtBQ0YsMEJBQ0EsTUFDQSxzQkFDQSxhQUNGO0FBQ0E7QUFBQSxRQUNGO0FBRUEsY0FBTSxRQUFRLElBQ1osZUFBZSxJQUFJLFNBQU87QUFDeEIsZ0JBQU0sUUFBUSxPQUFPLGtCQUFrQixTQUFTLElBQUksSUFBSSxHQUFHO0FBQzNELGlCQUFPLEtBQUssdUJBQXVCLFNBQVMsS0FBSztBQUFBLFFBQ25ELENBQUMsQ0FDSDtBQUFBLE1BQ0Y7QUFFQSxXQUFLLE9BQU8sT0FBTztBQUFBLElBQ3JCLFNBQVMsT0FBUDtBQUNBLFVBQUksTUFDRixvQ0FDQSxTQUFTLE1BQU0sUUFBUSxNQUFNLFFBQVEsS0FDdkM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBM0tPIiwKICAibmFtZXMiOiBbXQp9Cg==
