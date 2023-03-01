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
var ViewSyncs_exports = {};
__export(ViewSyncs_exports, {
  ViewSyncs: () => ViewSyncs
});
module.exports = __toCommonJS(ViewSyncs_exports);
var import_backbone = require("backbone");
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_MessageUpdater = require("../services/MessageUpdater");
var import_message = require("../state/selectors/message");
var import_notifications = require("../services/notifications");
var log = __toESM(require("../logging/log"));
var import_Message = require("../components/conversation/Message");
class ViewSyncModel extends import_backbone.Model {
}
let singleton;
class ViewSyncs extends import_backbone.Collection {
  static getSingleton() {
    if (!singleton) {
      singleton = new ViewSyncs();
    }
    return singleton;
  }
  forMessage(message) {
    const sender = window.ConversationController.lookupOrCreate({
      e164: message.get("source"),
      uuid: message.get("sourceUuid")
    });
    const syncs = this.filter((item) => {
      return item.get("senderId") === sender?.id && item.get("timestamp") === message.get("sent_at");
    });
    if (syncs.length) {
      log.info(`Found ${syncs.length} early view sync(s) for message ${message.get("sent_at")}`);
      this.remove(syncs);
    }
    return syncs;
  }
  async onSync(sync) {
    try {
      const messages = await window.Signal.Data.getMessagesBySentAt(sync.get("timestamp"));
      const found = messages.find((item) => {
        const sender = window.ConversationController.lookupOrCreate({
          e164: item.source,
          uuid: item.sourceUuid
        });
        return sender?.id === sync.get("senderId");
      });
      if (!found) {
        log.info("Nothing found for view sync", sync.get("senderId"), sync.get("senderE164"), sync.get("senderUuid"), sync.get("timestamp"));
        return;
      }
      import_notifications.notificationService.removeBy({ messageId: found.id });
      const message = window.MessageController.register(found.id, found);
      if (message.get("readStatus") !== import_MessageReadStatus.ReadStatus.Viewed) {
        message.set((0, import_MessageUpdater.markViewed)(message.attributes, sync.get("viewedAt")));
      }
      const giftBadge = message.get("giftBadge");
      if (giftBadge) {
        message.set({
          giftBadge: {
            ...giftBadge,
            state: (0, import_message.isIncoming)(message.attributes) ? import_Message.GiftBadgeStates.Redeemed : import_Message.GiftBadgeStates.Opened
          }
        });
      }
      this.remove(sync);
    } catch (error) {
      log.error("ViewSyncs.onSync error:", error && error.stack ? error.stack : error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ViewSyncs
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiVmlld1N5bmNzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1jbGFzc2VzLXBlci1maWxlICovXG5cbmltcG9ydCB7IENvbGxlY3Rpb24sIE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlcyc7XG5pbXBvcnQgeyBSZWFkU3RhdHVzIH0gZnJvbSAnLi4vbWVzc2FnZXMvTWVzc2FnZVJlYWRTdGF0dXMnO1xuaW1wb3J0IHsgbWFya1ZpZXdlZCB9IGZyb20gJy4uL3NlcnZpY2VzL01lc3NhZ2VVcGRhdGVyJztcbmltcG9ydCB7IGlzSW5jb21pbmcgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvbWVzc2FnZSc7XG5pbXBvcnQgeyBub3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgR2lmdEJhZGdlU3RhdGVzIH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vTWVzc2FnZSc7XG5cbmV4cG9ydCB0eXBlIFZpZXdTeW5jQXR0cmlidXRlc1R5cGUgPSB7XG4gIHNlbmRlcklkOiBzdHJpbmc7XG4gIHNlbmRlckUxNjQ/OiBzdHJpbmc7XG4gIHNlbmRlclV1aWQ6IHN0cmluZztcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIHZpZXdlZEF0OiBudW1iZXI7XG59O1xuXG5jbGFzcyBWaWV3U3luY01vZGVsIGV4dGVuZHMgTW9kZWw8Vmlld1N5bmNBdHRyaWJ1dGVzVHlwZT4ge31cblxubGV0IHNpbmdsZXRvbjogVmlld1N5bmNzIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgY2xhc3MgVmlld1N5bmNzIGV4dGVuZHMgQ29sbGVjdGlvbiB7XG4gIHN0YXRpYyBnZXRTaW5nbGV0b24oKTogVmlld1N5bmNzIHtcbiAgICBpZiAoIXNpbmdsZXRvbikge1xuICAgICAgc2luZ2xldG9uID0gbmV3IFZpZXdTeW5jcygpO1xuICAgIH1cblxuICAgIHJldHVybiBzaW5nbGV0b247XG4gIH1cblxuICBmb3JNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCk6IEFycmF5PFZpZXdTeW5jTW9kZWw+IHtcbiAgICBjb25zdCBzZW5kZXIgPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICBlMTY0OiBtZXNzYWdlLmdldCgnc291cmNlJyksXG4gICAgICB1dWlkOiBtZXNzYWdlLmdldCgnc291cmNlVXVpZCcpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN5bmNzID0gdGhpcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBpdGVtLmdldCgnc2VuZGVySWQnKSA9PT0gc2VuZGVyPy5pZCAmJlxuICAgICAgICBpdGVtLmdldCgndGltZXN0YW1wJykgPT09IG1lc3NhZ2UuZ2V0KCdzZW50X2F0JylcbiAgICAgICk7XG4gICAgfSk7XG4gICAgaWYgKHN5bmNzLmxlbmd0aCkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBGb3VuZCAke3N5bmNzLmxlbmd0aH0gZWFybHkgdmlldyBzeW5jKHMpIGZvciBtZXNzYWdlICR7bWVzc2FnZS5nZXQoXG4gICAgICAgICAgJ3NlbnRfYXQnXG4gICAgICAgICl9YFxuICAgICAgKTtcbiAgICAgIHRoaXMucmVtb3ZlKHN5bmNzKTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bmNzO1xuICB9XG5cbiAgYXN5bmMgb25TeW5jKHN5bmM6IFZpZXdTeW5jTW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0TWVzc2FnZXNCeVNlbnRBdChcbiAgICAgICAgc3luYy5nZXQoJ3RpbWVzdGFtcCcpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBmb3VuZCA9IG1lc3NhZ2VzLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbmRlciA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgICBlMTY0OiBpdGVtLnNvdXJjZSxcbiAgICAgICAgICB1dWlkOiBpdGVtLnNvdXJjZVV1aWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzZW5kZXI/LmlkID09PSBzeW5jLmdldCgnc2VuZGVySWQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdOb3RoaW5nIGZvdW5kIGZvciB2aWV3IHN5bmMnLFxuICAgICAgICAgIHN5bmMuZ2V0KCdzZW5kZXJJZCcpLFxuICAgICAgICAgIHN5bmMuZ2V0KCdzZW5kZXJFMTY0JyksXG4gICAgICAgICAgc3luYy5nZXQoJ3NlbmRlclV1aWQnKSxcbiAgICAgICAgICBzeW5jLmdldCgndGltZXN0YW1wJylcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBub3RpZmljYXRpb25TZXJ2aWNlLnJlbW92ZUJ5KHsgbWVzc2FnZUlkOiBmb3VuZC5pZCB9KTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3Rlcihmb3VuZC5pZCwgZm91bmQpO1xuXG4gICAgICBpZiAobWVzc2FnZS5nZXQoJ3JlYWRTdGF0dXMnKSAhPT0gUmVhZFN0YXR1cy5WaWV3ZWQpIHtcbiAgICAgICAgbWVzc2FnZS5zZXQobWFya1ZpZXdlZChtZXNzYWdlLmF0dHJpYnV0ZXMsIHN5bmMuZ2V0KCd2aWV3ZWRBdCcpKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdpZnRCYWRnZSA9IG1lc3NhZ2UuZ2V0KCdnaWZ0QmFkZ2UnKTtcbiAgICAgIGlmIChnaWZ0QmFkZ2UpIHtcbiAgICAgICAgbWVzc2FnZS5zZXQoe1xuICAgICAgICAgIGdpZnRCYWRnZToge1xuICAgICAgICAgICAgLi4uZ2lmdEJhZGdlLFxuICAgICAgICAgICAgc3RhdGU6IGlzSW5jb21pbmcobWVzc2FnZS5hdHRyaWJ1dGVzKVxuICAgICAgICAgICAgICA/IEdpZnRCYWRnZVN0YXRlcy5SZWRlZW1lZFxuICAgICAgICAgICAgICA6IEdpZnRCYWRnZVN0YXRlcy5PcGVuZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtb3ZlKHN5bmMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdWaWV3U3luY3Mub25TeW5jIGVycm9yOicsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxzQkFBa0M7QUFHbEMsK0JBQTJCO0FBQzNCLDRCQUEyQjtBQUMzQixxQkFBMkI7QUFDM0IsMkJBQW9DO0FBQ3BDLFVBQXFCO0FBQ3JCLHFCQUFnQztBQVVoQyxNQUFNLHNCQUFzQixzQkFBOEI7QUFBQztBQUEzRCxBQUVBLElBQUk7QUFFRyxNQUFNLGtCQUFrQiwyQkFBVztBQUFBLFNBQ2pDLGVBQTBCO0FBQy9CLFFBQUksQ0FBQyxXQUFXO0FBQ2Qsa0JBQVksSUFBSSxVQUFVO0FBQUEsSUFDNUI7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsV0FBVyxTQUE2QztBQUN0RCxVQUFNLFNBQVMsT0FBTyx1QkFBdUIsZUFBZTtBQUFBLE1BQzFELE1BQU0sUUFBUSxJQUFJLFFBQVE7QUFBQSxNQUMxQixNQUFNLFFBQVEsSUFBSSxZQUFZO0FBQUEsSUFDaEMsQ0FBQztBQUNELFVBQU0sUUFBUSxLQUFLLE9BQU8sVUFBUTtBQUNoQyxhQUNFLEtBQUssSUFBSSxVQUFVLE1BQU0sUUFBUSxNQUNqQyxLQUFLLElBQUksV0FBVyxNQUFNLFFBQVEsSUFBSSxTQUFTO0FBQUEsSUFFbkQsQ0FBQztBQUNELFFBQUksTUFBTSxRQUFRO0FBQ2hCLFVBQUksS0FDRixTQUFTLE1BQU0seUNBQXlDLFFBQVEsSUFDOUQsU0FDRixHQUNGO0FBQ0EsV0FBSyxPQUFPLEtBQUs7QUFBQSxJQUNuQjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsUUFFTSxPQUFPLE1BQW9DO0FBQy9DLFFBQUk7QUFDRixZQUFNLFdBQVcsTUFBTSxPQUFPLE9BQU8sS0FBSyxvQkFDeEMsS0FBSyxJQUFJLFdBQVcsQ0FDdEI7QUFFQSxZQUFNLFFBQVEsU0FBUyxLQUFLLFVBQVE7QUFDbEMsY0FBTSxTQUFTLE9BQU8sdUJBQXVCLGVBQWU7QUFBQSxVQUMxRCxNQUFNLEtBQUs7QUFBQSxVQUNYLE1BQU0sS0FBSztBQUFBLFFBQ2IsQ0FBQztBQUVELGVBQU8sUUFBUSxPQUFPLEtBQUssSUFBSSxVQUFVO0FBQUEsTUFDM0MsQ0FBQztBQUVELFVBQUksQ0FBQyxPQUFPO0FBQ1YsWUFBSSxLQUNGLCtCQUNBLEtBQUssSUFBSSxVQUFVLEdBQ25CLEtBQUssSUFBSSxZQUFZLEdBQ3JCLEtBQUssSUFBSSxZQUFZLEdBQ3JCLEtBQUssSUFBSSxXQUFXLENBQ3RCO0FBQ0E7QUFBQSxNQUNGO0FBRUEsK0NBQW9CLFNBQVMsRUFBRSxXQUFXLE1BQU0sR0FBRyxDQUFDO0FBRXBELFlBQU0sVUFBVSxPQUFPLGtCQUFrQixTQUFTLE1BQU0sSUFBSSxLQUFLO0FBRWpFLFVBQUksUUFBUSxJQUFJLFlBQVksTUFBTSxvQ0FBVyxRQUFRO0FBQ25ELGdCQUFRLElBQUksc0NBQVcsUUFBUSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsQ0FBQztBQUFBLE1BQ2xFO0FBRUEsWUFBTSxZQUFZLFFBQVEsSUFBSSxXQUFXO0FBQ3pDLFVBQUksV0FBVztBQUNiLGdCQUFRLElBQUk7QUFBQSxVQUNWLFdBQVc7QUFBQSxlQUNOO0FBQUEsWUFDSCxPQUFPLCtCQUFXLFFBQVEsVUFBVSxJQUNoQywrQkFBZ0IsV0FDaEIsK0JBQWdCO0FBQUEsVUFDdEI7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBRUEsV0FBSyxPQUFPLElBQUk7QUFBQSxJQUNsQixTQUFTLE9BQVA7QUFDQSxVQUFJLE1BQ0YsMkJBQ0EsU0FBUyxNQUFNLFFBQVEsTUFBTSxRQUFRLEtBQ3ZDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQXJGTyIsCiAgIm5hbWVzIjogW10KfQo=
