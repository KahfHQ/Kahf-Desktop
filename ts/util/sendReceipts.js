var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sendReceipts_exports = {};
__export(sendReceipts_exports, {
  sendReceipts: () => sendReceipts
});
module.exports = __toCommonJS(sendReceipts_exports);
var import_lodash = require("lodash");
var import_Receipt = require("../types/Receipt");
var import_getSendOptions = require("./getSendOptions");
var import_handleMessageSend = require("./handleMessageSend");
var import_isConversationAccepted = require("./isConversationAccepted");
var import_isConversationUnregistered = require("./isConversationUnregistered");
var import_iterables = require("./iterables");
var import_missingCaseError = require("./missingCaseError");
const CHUNK_SIZE = 100;
async function sendReceipts({
  log,
  receipts,
  type
}) {
  let requiresUserSetting;
  let methodName;
  switch (type) {
    case import_Receipt.ReceiptType.Delivery:
      requiresUserSetting = false;
      methodName = "sendDeliveryReceipt";
      break;
    case import_Receipt.ReceiptType.Read:
      requiresUserSetting = true;
      methodName = "sendReadReceipt";
      break;
    case import_Receipt.ReceiptType.Viewed:
      requiresUserSetting = true;
      methodName = "sendViewedReceipt";
      break;
    default:
      throw (0, import_missingCaseError.missingCaseError)(type);
  }
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error("messaging is not available!");
  }
  if (requiresUserSetting && !window.storage.get("read-receipt-setting")) {
    log.info("requires user setting. Not sending these receipts");
    return;
  }
  const receiptsBySenderId = receipts.reduce((result, receipt) => {
    const { senderE164, senderUuid } = receipt;
    if (!senderE164 && !senderUuid) {
      log.error("no sender E164 or UUID. Skipping this receipt");
      return result;
    }
    const sender = window.ConversationController.lookupOrCreate({
      e164: senderE164,
      uuid: senderUuid
    });
    if (!sender) {
      throw new Error("no conversation found with that E164/UUID. Cannot send this receipt");
    }
    const existingGroup = result.get(sender.id);
    if (existingGroup) {
      existingGroup.push(receipt);
    } else {
      result.set(sender.id, [receipt]);
    }
    return result;
  }, /* @__PURE__ */ new Map());
  await window.ConversationController.load();
  await Promise.all((0, import_iterables.map)(receiptsBySenderId, async ([senderId, receiptsForSender]) => {
    const sender = window.ConversationController.get(senderId);
    if (!sender) {
      throw new Error("despite having a conversation ID, no conversation was found");
    }
    if (!(0, import_isConversationAccepted.isConversationAccepted)(sender.attributes)) {
      log.info(`conversation ${sender.idForLogging()} is not accepted; refusing to send`);
      return;
    }
    if ((0, import_isConversationUnregistered.isConversationUnregistered)(sender.attributes)) {
      log.info(`conversation ${sender.idForLogging()} is unregistered; refusing to send`);
      return;
    }
    if (sender.isBlocked()) {
      log.info(`conversation ${sender.idForLogging()} is blocked; refusing to send`);
      return;
    }
    const sendOptions = await (0, import_getSendOptions.getSendOptions)(sender.attributes);
    const batches = (0, import_lodash.chunk)(receiptsForSender, CHUNK_SIZE);
    await Promise.all((0, import_iterables.map)(batches, async (batch) => {
      const timestamps = batch.map((receipt) => receipt.timestamp);
      const messageIds = batch.map((receipt) => receipt.messageId);
      await (0, import_handleMessageSend.handleMessageSend)(messaging[methodName]({
        senderE164: sender.get("e164"),
        senderUuid: sender.get("uuid"),
        timestamps,
        options: sendOptions
      }), { messageIds, sendType: type });
    }));
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendReceipts
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZFJlY2VpcHRzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgY2h1bmsgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHR5cGUgeyBMb2dnZXJUeXBlIH0gZnJvbSAnLi4vdHlwZXMvTG9nZ2luZyc7XG5pbXBvcnQgdHlwZSB7IFJlY2VpcHQgfSBmcm9tICcuLi90eXBlcy9SZWNlaXB0JztcbmltcG9ydCB7IFJlY2VpcHRUeXBlIH0gZnJvbSAnLi4vdHlwZXMvUmVjZWlwdCc7XG5pbXBvcnQgeyBnZXRTZW5kT3B0aW9ucyB9IGZyb20gJy4vZ2V0U2VuZE9wdGlvbnMnO1xuaW1wb3J0IHsgaGFuZGxlTWVzc2FnZVNlbmQgfSBmcm9tICcuL2hhbmRsZU1lc3NhZ2VTZW5kJztcbmltcG9ydCB7IGlzQ29udmVyc2F0aW9uQWNjZXB0ZWQgfSBmcm9tICcuL2lzQ29udmVyc2F0aW9uQWNjZXB0ZWQnO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25VbnJlZ2lzdGVyZWQgfSBmcm9tICcuL2lzQ29udmVyc2F0aW9uVW5yZWdpc3RlcmVkJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vaXRlcmFibGVzJztcbmltcG9ydCB7IG1pc3NpbmdDYXNlRXJyb3IgfSBmcm9tICcuL21pc3NpbmdDYXNlRXJyb3InO1xuXG5jb25zdCBDSFVOS19TSVpFID0gMTAwO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFJlY2VpcHRzKHtcbiAgbG9nLFxuICByZWNlaXB0cyxcbiAgdHlwZSxcbn06IFJlYWRvbmx5PHtcbiAgbG9nOiBMb2dnZXJUeXBlO1xuICByZWNlaXB0czogUmVhZG9ubHlBcnJheTxSZWNlaXB0PjtcbiAgdHlwZTogUmVjZWlwdFR5cGU7XG59Pik6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgcmVxdWlyZXNVc2VyU2V0dGluZzogYm9vbGVhbjtcbiAgbGV0IG1ldGhvZE5hbWU6XG4gICAgfCAnc2VuZERlbGl2ZXJ5UmVjZWlwdCdcbiAgICB8ICdzZW5kUmVhZFJlY2VpcHQnXG4gICAgfCAnc2VuZFZpZXdlZFJlY2VpcHQnO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJlY2VpcHRUeXBlLkRlbGl2ZXJ5OlxuICAgICAgcmVxdWlyZXNVc2VyU2V0dGluZyA9IGZhbHNlO1xuICAgICAgbWV0aG9kTmFtZSA9ICdzZW5kRGVsaXZlcnlSZWNlaXB0JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUmVjZWlwdFR5cGUuUmVhZDpcbiAgICAgIHJlcXVpcmVzVXNlclNldHRpbmcgPSB0cnVlO1xuICAgICAgbWV0aG9kTmFtZSA9ICdzZW5kUmVhZFJlY2VpcHQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBSZWNlaXB0VHlwZS5WaWV3ZWQ6XG4gICAgICByZXF1aXJlc1VzZXJTZXR0aW5nID0gdHJ1ZTtcbiAgICAgIG1ldGhvZE5hbWUgPSAnc2VuZFZpZXdlZFJlY2VpcHQnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IodHlwZSk7XG4gIH1cblxuICBjb25zdCB7IG1lc3NhZ2luZyB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gIGlmICghbWVzc2FnaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZSEnKTtcbiAgfVxuXG4gIGlmIChyZXF1aXJlc1VzZXJTZXR0aW5nICYmICF3aW5kb3cuc3RvcmFnZS5nZXQoJ3JlYWQtcmVjZWlwdC1zZXR0aW5nJykpIHtcbiAgICBsb2cuaW5mbygncmVxdWlyZXMgdXNlciBzZXR0aW5nLiBOb3Qgc2VuZGluZyB0aGVzZSByZWNlaXB0cycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY2VpcHRzQnlTZW5kZXJJZDogTWFwPHN0cmluZywgQXJyYXk8UmVjZWlwdD4+ID0gcmVjZWlwdHMucmVkdWNlKFxuICAgIChyZXN1bHQsIHJlY2VpcHQpID0+IHtcbiAgICAgIGNvbnN0IHsgc2VuZGVyRTE2NCwgc2VuZGVyVXVpZCB9ID0gcmVjZWlwdDtcbiAgICAgIGlmICghc2VuZGVyRTE2NCAmJiAhc2VuZGVyVXVpZCkge1xuICAgICAgICBsb2cuZXJyb3IoJ25vIHNlbmRlciBFMTY0IG9yIFVVSUQuIFNraXBwaW5nIHRoaXMgcmVjZWlwdCcpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZW5kZXIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICAgIGUxNjQ6IHNlbmRlckUxNjQsXG4gICAgICAgIHV1aWQ6IHNlbmRlclV1aWQsXG4gICAgICB9KTtcbiAgICAgIGlmICghc2VuZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnbm8gY29udmVyc2F0aW9uIGZvdW5kIHdpdGggdGhhdCBFMTY0L1VVSUQuIENhbm5vdCBzZW5kIHRoaXMgcmVjZWlwdCdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhpc3RpbmdHcm91cCA9IHJlc3VsdC5nZXQoc2VuZGVyLmlkKTtcbiAgICAgIGlmIChleGlzdGluZ0dyb3VwKSB7XG4gICAgICAgIGV4aXN0aW5nR3JvdXAucHVzaChyZWNlaXB0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5zZXQoc2VuZGVyLmlkLCBbcmVjZWlwdF0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgbmV3IE1hcCgpXG4gICk7XG5cbiAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9hZCgpO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIG1hcChyZWNlaXB0c0J5U2VuZGVySWQsIGFzeW5jIChbc2VuZGVySWQsIHJlY2VpcHRzRm9yU2VuZGVyXSkgPT4ge1xuICAgICAgY29uc3Qgc2VuZGVyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KHNlbmRlcklkKTtcbiAgICAgIGlmICghc2VuZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnZGVzcGl0ZSBoYXZpbmcgYSBjb252ZXJzYXRpb24gSUQsIG5vIGNvbnZlcnNhdGlvbiB3YXMgZm91bmQnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDb252ZXJzYXRpb25BY2NlcHRlZChzZW5kZXIuYXR0cmlidXRlcykpIHtcbiAgICAgICAgbG9nLmluZm8oXG4gICAgICAgICAgYGNvbnZlcnNhdGlvbiAke3NlbmRlci5pZEZvckxvZ2dpbmcoKX0gaXMgbm90IGFjY2VwdGVkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNDb252ZXJzYXRpb25VbnJlZ2lzdGVyZWQoc2VuZGVyLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgIGBjb252ZXJzYXRpb24gJHtzZW5kZXIuaWRGb3JMb2dnaW5nKCl9IGlzIHVucmVnaXN0ZXJlZDsgcmVmdXNpbmcgdG8gc2VuZGBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHNlbmRlci5pc0Jsb2NrZWQoKSkge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICBgY29udmVyc2F0aW9uICR7c2VuZGVyLmlkRm9yTG9nZ2luZygpfSBpcyBibG9ja2VkOyByZWZ1c2luZyB0byBzZW5kYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbmRPcHRpb25zID0gYXdhaXQgZ2V0U2VuZE9wdGlvbnMoc2VuZGVyLmF0dHJpYnV0ZXMpO1xuXG4gICAgICBjb25zdCBiYXRjaGVzID0gY2h1bmsocmVjZWlwdHNGb3JTZW5kZXIsIENIVU5LX1NJWkUpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIG1hcChiYXRjaGVzLCBhc3luYyBiYXRjaCA9PiB7XG4gICAgICAgICAgY29uc3QgdGltZXN0YW1wcyA9IGJhdGNoLm1hcChyZWNlaXB0ID0+IHJlY2VpcHQudGltZXN0YW1wKTtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlSWRzID0gYmF0Y2gubWFwKHJlY2VpcHQgPT4gcmVjZWlwdC5tZXNzYWdlSWQpO1xuXG4gICAgICAgICAgYXdhaXQgaGFuZGxlTWVzc2FnZVNlbmQoXG4gICAgICAgICAgICBtZXNzYWdpbmdbbWV0aG9kTmFtZV0oe1xuICAgICAgICAgICAgICBzZW5kZXJFMTY0OiBzZW5kZXIuZ2V0KCdlMTY0JyksXG4gICAgICAgICAgICAgIHNlbmRlclV1aWQ6IHNlbmRlci5nZXQoJ3V1aWQnKSxcbiAgICAgICAgICAgICAgdGltZXN0YW1wcyxcbiAgICAgICAgICAgICAgb3B0aW9uczogc2VuZE9wdGlvbnMsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHsgbWVzc2FnZUlkcywgc2VuZFR5cGU6IHR5cGUgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pXG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JBQXNCO0FBR3RCLHFCQUE0QjtBQUM1Qiw0QkFBK0I7QUFDL0IsK0JBQWtDO0FBQ2xDLG9DQUF1QztBQUN2Qyx3Q0FBMkM7QUFDM0MsdUJBQW9CO0FBQ3BCLDhCQUFpQztBQUVqQyxNQUFNLGFBQWE7QUFFbkIsNEJBQW1DO0FBQUEsRUFDakM7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBS2lCO0FBQ2pCLE1BQUk7QUFDSixNQUFJO0FBSUosVUFBUTtBQUFBLFNBQ0QsMkJBQVk7QUFD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
