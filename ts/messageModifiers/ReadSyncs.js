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
var ReadSyncs_exports = {};
__export(ReadSyncs_exports, {
  ReadSyncs: () => ReadSyncs
});
module.exports = __toCommonJS(ReadSyncs_exports);
var import_backbone = require("backbone");
var import_message = require("../state/selectors/message");
var import_isMessageUnread = require("../util/isMessageUnread");
var import_notifications = require("../services/notifications");
var log = __toESM(require("../logging/log"));
class ReadSyncModel extends import_backbone.Model {
}
let singleton;
async function maybeItIsAReactionReadSync(sync) {
  const readReaction = await window.Signal.Data.markReactionAsRead(sync.get("senderUuid"), Number(sync.get("timestamp")));
  if (!readReaction) {
    log.info("Nothing found for read sync", sync.get("senderId"), sync.get("sender"), sync.get("senderUuid"), sync.get("timestamp"));
    return;
  }
  import_notifications.notificationService.removeBy({
    conversationId: readReaction.conversationId,
    emoji: readReaction.emoji,
    targetAuthorUuid: readReaction.targetAuthorUuid,
    targetTimestamp: readReaction.targetTimestamp
  });
}
class ReadSyncs extends import_backbone.Collection {
  static getSingleton() {
    if (!singleton) {
      singleton = new ReadSyncs();
    }
    return singleton;
  }
  forMessage(message) {
    const sender = window.ConversationController.lookupOrCreate({
      e164: message.get("source"),
      uuid: message.get("sourceUuid")
    });
    const sync = this.find((item) => {
      return item.get("senderId") === sender?.id && item.get("timestamp") === message.get("sent_at");
    });
    if (sync) {
      log.info(`Found early read sync for message ${sync.get("timestamp")}`);
      this.remove(sync);
      return sync;
    }
    return null;
  }
  async onSync(sync) {
    try {
      const messages = await window.Signal.Data.getMessagesBySentAt(sync.get("timestamp"));
      const found = messages.find((item) => {
        const sender = window.ConversationController.lookupOrCreate({
          e164: item.source,
          uuid: item.sourceUuid
        });
        return (0, import_message.isIncoming)(item) && sender?.id === sync.get("senderId");
      });
      if (!found) {
        await maybeItIsAReactionReadSync(sync);
        return;
      }
      import_notifications.notificationService.removeBy({ messageId: found.id });
      const message = window.MessageController.register(found.id, found);
      const readAt = Math.min(sync.get("readAt"), Date.now());
      if ((0, import_isMessageUnread.isMessageUnread)(message.attributes)) {
        message.markRead(readAt, { skipSave: true });
        const updateConversation = /* @__PURE__ */ __name(() => {
          message.getConversation()?.onReadMessage(message, readAt);
        }, "updateConversation");
        if (window.startupProcessingQueue) {
          const conversation = message.getConversation();
          if (conversation) {
            window.startupProcessingQueue.add(conversation.get("id"), message.get("sent_at"), updateConversation);
          }
        } else {
          updateConversation();
        }
      } else {
        const now = Date.now();
        const existingTimestamp = message.get("expirationStartTimestamp");
        const expirationStartTimestamp = Math.min(now, Math.min(existingTimestamp || now, readAt || now));
        message.set({ expirationStartTimestamp });
      }
      window.Signal.Util.queueUpdateMessage(message.attributes);
      this.remove(sync);
    } catch (error) {
      log.error("ReadSyncs.onSync error:", error && error.stack ? error.stack : error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReadSyncs
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUmVhZFN5bmNzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNy0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cblxuaW1wb3J0IHsgQ29sbGVjdGlvbiwgTW9kZWwgfSBmcm9tICdiYWNrYm9uZSc7XG5cbmltcG9ydCB0eXBlIHsgTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL21lc3NhZ2VzJztcbmltcG9ydCB7IGlzSW5jb21pbmcgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgeyBpc01lc3NhZ2VVbnJlYWQgfSBmcm9tICcuLi91dGlsL2lzTWVzc2FnZVVucmVhZCc7XG5pbXBvcnQgeyBub3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuXG5leHBvcnQgdHlwZSBSZWFkU3luY0F0dHJpYnV0ZXNUeXBlID0ge1xuICBzZW5kZXJJZDogc3RyaW5nO1xuICBzZW5kZXI/OiBzdHJpbmc7XG4gIHNlbmRlclV1aWQ6IHN0cmluZztcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIHJlYWRBdDogbnVtYmVyO1xufTtcblxuY2xhc3MgUmVhZFN5bmNNb2RlbCBleHRlbmRzIE1vZGVsPFJlYWRTeW5jQXR0cmlidXRlc1R5cGU+IHt9XG5cbmxldCBzaW5nbGV0b246IFJlYWRTeW5jcyB8IHVuZGVmaW5lZDtcblxuYXN5bmMgZnVuY3Rpb24gbWF5YmVJdElzQVJlYWN0aW9uUmVhZFN5bmMoc3luYzogUmVhZFN5bmNNb2RlbCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZWFkUmVhY3Rpb24gPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEubWFya1JlYWN0aW9uQXNSZWFkKFxuICAgIHN5bmMuZ2V0KCdzZW5kZXJVdWlkJyksXG4gICAgTnVtYmVyKHN5bmMuZ2V0KCd0aW1lc3RhbXAnKSlcbiAgKTtcblxuICBpZiAoIXJlYWRSZWFjdGlvbikge1xuICAgIGxvZy5pbmZvKFxuICAgICAgJ05vdGhpbmcgZm91bmQgZm9yIHJlYWQgc3luYycsXG4gICAgICBzeW5jLmdldCgnc2VuZGVySWQnKSxcbiAgICAgIHN5bmMuZ2V0KCdzZW5kZXInKSxcbiAgICAgIHN5bmMuZ2V0KCdzZW5kZXJVdWlkJyksXG4gICAgICBzeW5jLmdldCgndGltZXN0YW1wJylcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG5vdGlmaWNhdGlvblNlcnZpY2UucmVtb3ZlQnkoe1xuICAgIGNvbnZlcnNhdGlvbklkOiByZWFkUmVhY3Rpb24uY29udmVyc2F0aW9uSWQsXG4gICAgZW1vamk6IHJlYWRSZWFjdGlvbi5lbW9qaSxcbiAgICB0YXJnZXRBdXRob3JVdWlkOiByZWFkUmVhY3Rpb24udGFyZ2V0QXV0aG9yVXVpZCxcbiAgICB0YXJnZXRUaW1lc3RhbXA6IHJlYWRSZWFjdGlvbi50YXJnZXRUaW1lc3RhbXAsXG4gIH0pO1xufVxuXG5leHBvcnQgY2xhc3MgUmVhZFN5bmNzIGV4dGVuZHMgQ29sbGVjdGlvbiB7XG4gIHN0YXRpYyBnZXRTaW5nbGV0b24oKTogUmVhZFN5bmNzIHtcbiAgICBpZiAoIXNpbmdsZXRvbikge1xuICAgICAgc2luZ2xldG9uID0gbmV3IFJlYWRTeW5jcygpO1xuICAgIH1cblxuICAgIHJldHVybiBzaW5nbGV0b247XG4gIH1cblxuICBmb3JNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCk6IFJlYWRTeW5jTW9kZWwgfCBudWxsIHtcbiAgICBjb25zdCBzZW5kZXIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICBlMTY0OiBtZXNzYWdlLmdldCgnc291cmNlJyksXG4gICAgICB1dWlkOiBtZXNzYWdlLmdldCgnc291cmNlVXVpZCcpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN5bmMgPSB0aGlzLmZpbmQoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBpdGVtLmdldCgnc2VuZGVySWQnKSA9PT0gc2VuZGVyPy5pZCAmJlxuICAgICAgICBpdGVtLmdldCgndGltZXN0YW1wJykgPT09IG1lc3NhZ2UuZ2V0KCdzZW50X2F0JylcbiAgICAgICk7XG4gICAgfSk7XG4gICAgaWYgKHN5bmMpIHtcbiAgICAgIGxvZy5pbmZvKGBGb3VuZCBlYXJseSByZWFkIHN5bmMgZm9yIG1lc3NhZ2UgJHtzeW5jLmdldCgndGltZXN0YW1wJyl9YCk7XG4gICAgICB0aGlzLnJlbW92ZShzeW5jKTtcbiAgICAgIHJldHVybiBzeW5jO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgb25TeW5jKHN5bmM6IFJlYWRTeW5jTW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0TWVzc2FnZXNCeVNlbnRBdChcbiAgICAgICAgc3luYy5nZXQoJ3RpbWVzdGFtcCcpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBmb3VuZCA9IG1lc3NhZ2VzLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbmRlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgICBlMTY0OiBpdGVtLnNvdXJjZSxcbiAgICAgICAgICB1dWlkOiBpdGVtLnNvdXJjZVV1aWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBpc0luY29taW5nKGl0ZW0pICYmIHNlbmRlcj8uaWQgPT09IHN5bmMuZ2V0KCdzZW5kZXJJZCcpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgYXdhaXQgbWF5YmVJdElzQVJlYWN0aW9uUmVhZFN5bmMoc3luYyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbm90aWZpY2F0aW9uU2VydmljZS5yZW1vdmVCeSh7IG1lc3NhZ2VJZDogZm91bmQuaWQgfSk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoZm91bmQuaWQsIGZvdW5kKTtcbiAgICAgIGNvbnN0IHJlYWRBdCA9IE1hdGgubWluKHN5bmMuZ2V0KCdyZWFkQXQnKSwgRGF0ZS5ub3coKSk7XG5cbiAgICAgIC8vIElmIG1lc3NhZ2UgaXMgdW5yZWFkLCB3ZSBtYXJrIGl0IHJlYWQuIE90aGVyd2lzZSwgd2UgdXBkYXRlIHRoZSBleHBpcmF0aW9uXG4gICAgICAvLyAgIHRpbWVyIHRvIHRoZSB0aW1lIHNwZWNpZmllZCBieSB0aGUgcmVhZCBzeW5jIGlmIGl0J3MgZWFybGllciB0aGFuXG4gICAgICAvLyAgIHRoZSBwcmV2aW91cyByZWFkIHRpbWUuXG4gICAgICBpZiAoaXNNZXNzYWdlVW5yZWFkKG1lc3NhZ2UuYXR0cmlidXRlcykpIHtcbiAgICAgICAgLy8gVE9ETyBERVNLVE9QLTE1MDk6IHVzZSBNZXNzYWdlVXBkYXRlci5tYXJrUmVhZCBvbmNlIHRoaXMgaXMgVFNcbiAgICAgICAgbWVzc2FnZS5tYXJrUmVhZChyZWFkQXQsIHsgc2tpcFNhdmU6IHRydWUgfSk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlQ29udmVyc2F0aW9uID0gKCkgPT4ge1xuICAgICAgICAgIC8vIG9uUmVhZE1lc3NhZ2UgbWF5IHJlc3VsdCBpbiBtZXNzYWdlcyBvbGRlciB0aGFuIHRoaXMgb25lIGJlaW5nXG4gICAgICAgICAgLy8gICBtYXJrZWQgcmVhZC4gV2Ugd2FudCB0aG9zZSBtZXNzYWdlcyB0byBoYXZlIHRoZSBzYW1lIGV4cGlyZSB0aW1lclxuICAgICAgICAgIC8vICAgc3RhcnQgdGltZSBhcyB0aGlzIG9uZSwgc28gd2UgcGFzcyB0aGUgcmVhZEF0IHZhbHVlIHRocm91Z2guXG4gICAgICAgICAgbWVzc2FnZS5nZXRDb252ZXJzYXRpb24oKT8ub25SZWFkTWVzc2FnZShtZXNzYWdlLCByZWFkQXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh3aW5kb3cuc3RhcnR1cFByb2Nlc3NpbmdRdWV1ZSkge1xuICAgICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IG1lc3NhZ2UuZ2V0Q29udmVyc2F0aW9uKCk7XG4gICAgICAgICAgaWYgKGNvbnZlcnNhdGlvbikge1xuICAgICAgICAgICAgd2luZG93LnN0YXJ0dXBQcm9jZXNzaW5nUXVldWUuYWRkKFxuICAgICAgICAgICAgICBjb252ZXJzYXRpb24uZ2V0KCdpZCcpLFxuICAgICAgICAgICAgICBtZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgICAgICAgICB1cGRhdGVDb252ZXJzYXRpb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVwZGF0ZUNvbnZlcnNhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBleGlzdGluZ1RpbWVzdGFtcCA9IG1lc3NhZ2UuZ2V0KCdleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAnKTtcbiAgICAgICAgY29uc3QgZXhwaXJhdGlvblN0YXJ0VGltZXN0YW1wID0gTWF0aC5taW4oXG4gICAgICAgICAgbm93LFxuICAgICAgICAgIE1hdGgubWluKGV4aXN0aW5nVGltZXN0YW1wIHx8IG5vdywgcmVhZEF0IHx8IG5vdylcbiAgICAgICAgKTtcbiAgICAgICAgbWVzc2FnZS5zZXQoeyBleHBpcmF0aW9uU3RhcnRUaW1lc3RhbXAgfSk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5TaWduYWwuVXRpbC5xdWV1ZVVwZGF0ZU1lc3NhZ2UobWVzc2FnZS5hdHRyaWJ1dGVzKTtcblxuICAgICAgdGhpcy5yZW1vdmUoc3luYyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ1JlYWRTeW5jcy5vblN5bmMgZXJyb3I6JyxcbiAgICAgICAgZXJyb3IgJiYgZXJyb3Iuc3RhY2sgPyBlcnJvci5zdGFjayA6IGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBLHNCQUFrQztBQUdsQyxxQkFBMkI7QUFDM0IsNkJBQWdDO0FBQ2hDLDJCQUFvQztBQUNwQyxVQUFxQjtBQVVyQixNQUFNLHNCQUFzQixzQkFBOEI7QUFBQztBQUEzRCxBQUVBLElBQUk7QUFFSiwwQ0FBMEMsTUFBb0M7QUFDNUUsUUFBTSxlQUFlLE1BQU0sT0FBTyxPQUFPLEtBQUssbUJBQzVDLEtBQUssSUFBSSxZQUFZLEdBQ3JCLE9BQU8sS0FBSyxJQUFJLFdBQVcsQ0FBQyxDQUM5QjtBQUVBLE1BQUksQ0FBQyxjQUFjO0FBQ2pCLFFBQUksS0FDRiwrQkFDQSxLQUFLLElBQUksVUFBVSxHQUNuQixLQUFLLElBQUksUUFBUSxHQUNqQixLQUFLLElBQUksWUFBWSxHQUNyQixLQUFLLElBQUksV0FBVyxDQUN0QjtBQUNBO0FBQUEsRUFDRjtBQUVBLDJDQUFvQixTQUFTO0FBQUEsSUFDM0IsZ0JBQWdCLGFBQWE7QUFBQSxJQUM3QixPQUFPLGFBQWE7QUFBQSxJQUNwQixrQkFBa0IsYUFBYTtBQUFBLElBQy9CLGlCQUFpQixhQUFhO0FBQUEsRUFDaEMsQ0FBQztBQUNIO0FBdkJlLEFBeUJSLE1BQU0sa0JBQWtCLDJCQUFXO0FBQUEsU0FDakMsZUFBMEI7QUFDL0IsUUFBSSxDQUFDLFdBQVc7QUFDZCxrQkFBWSxJQUFJLFVBQVU7QUFBQSxJQUM1QjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxXQUFXLFNBQTZDO0FBQ3RELFVBQU0s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
