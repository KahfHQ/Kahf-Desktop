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
var Deletes_exports = {};
__export(Deletes_exports, {
  DeleteModel: () => DeleteModel,
  Deletes: () => Deletes
});
module.exports = __toCommonJS(Deletes_exports);
var import_backbone = require("backbone");
var import_helpers = require("../messages/helpers");
var log = __toESM(require("../logging/log"));
var import_deleteForEveryone = require("../util/deleteForEveryone");
class DeleteModel extends import_backbone.Model {
}
let singleton;
class Deletes extends import_backbone.Collection {
  static getSingleton() {
    if (!singleton) {
      singleton = new Deletes();
    }
    return singleton;
  }
  forMessage(message) {
    const matchingDeletes = this.filter((item) => {
      return item.get("targetSentTimestamp") === message.get("sent_at") && item.get("fromId") === (0, import_helpers.getContactId)(message.attributes);
    });
    if (matchingDeletes.length > 0) {
      log.info("Found early DOE for message");
      this.remove(matchingDeletes);
      return matchingDeletes;
    }
    return [];
  }
  async onDelete(del) {
    try {
      const targetConversation = await window.ConversationController.getConversationForTargetMessage(del.get("fromId"), del.get("targetSentTimestamp"));
      if (!targetConversation) {
        log.info("No target conversation for DOE", del.get("fromId"), del.get("targetSentTimestamp"));
        return;
      }
      targetConversation.queueJob("Deletes.onDelete", async () => {
        log.info("Handling DOE for", del.get("targetSentTimestamp"));
        const messages = await window.Signal.Data.getMessagesBySentAt(del.get("targetSentTimestamp"));
        const targetMessage = messages.find((m) => del.get("fromId") === (0, import_helpers.getContactId)(m) && !m.deletedForEveryone);
        if (!targetMessage) {
          log.info("No message for DOE", del.get("fromId"), del.get("targetSentTimestamp"));
          return;
        }
        const message = window.MessageController.register(targetMessage.id, targetMessage);
        await (0, import_deleteForEveryone.deleteForEveryone)(message, del);
        this.remove(del);
      });
    } catch (error) {
      log.error("Deletes.onDelete error:", error && error.stack ? error.stack : error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteModel,
  Deletes
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiRGVsZXRlcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMSBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1jbGFzc2VzLXBlci1maWxlICovXG5cbmltcG9ydCB7IENvbGxlY3Rpb24sIE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvbWVzc2FnZXMnO1xuaW1wb3J0IHsgZ2V0Q29udGFjdElkIH0gZnJvbSAnLi4vbWVzc2FnZXMvaGVscGVycyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuaW1wb3J0IHsgZGVsZXRlRm9yRXZlcnlvbmUgfSBmcm9tICcuLi91dGlsL2RlbGV0ZUZvckV2ZXJ5b25lJztcblxuZXhwb3J0IHR5cGUgRGVsZXRlQXR0cmlidXRlc1R5cGUgPSB7XG4gIHRhcmdldFNlbnRUaW1lc3RhbXA6IG51bWJlcjtcbiAgc2VydmVyVGltZXN0YW1wOiBudW1iZXI7XG4gIGZyb21JZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZU1vZGVsIGV4dGVuZHMgTW9kZWw8RGVsZXRlQXR0cmlidXRlc1R5cGU+IHt9XG5cbmxldCBzaW5nbGV0b246IERlbGV0ZXMgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVzIGV4dGVuZHMgQ29sbGVjdGlvbjxEZWxldGVNb2RlbD4ge1xuICBzdGF0aWMgZ2V0U2luZ2xldG9uKCk6IERlbGV0ZXMge1xuICAgIGlmICghc2luZ2xldG9uKSB7XG4gICAgICBzaW5nbGV0b24gPSBuZXcgRGVsZXRlcygpO1xuICAgIH1cblxuICAgIHJldHVybiBzaW5nbGV0b247XG4gIH1cblxuICBmb3JNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2VNb2RlbCk6IEFycmF5PERlbGV0ZU1vZGVsPiB7XG4gICAgY29uc3QgbWF0Y2hpbmdEZWxldGVzID0gdGhpcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBpdGVtLmdldCgndGFyZ2V0U2VudFRpbWVzdGFtcCcpID09PSBtZXNzYWdlLmdldCgnc2VudF9hdCcpICYmXG4gICAgICAgIGl0ZW0uZ2V0KCdmcm9tSWQnKSA9PT0gZ2V0Q29udGFjdElkKG1lc3NhZ2UuYXR0cmlidXRlcylcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpZiAobWF0Y2hpbmdEZWxldGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxvZy5pbmZvKCdGb3VuZCBlYXJseSBET0UgZm9yIG1lc3NhZ2UnKTtcbiAgICAgIHRoaXMucmVtb3ZlKG1hdGNoaW5nRGVsZXRlcyk7XG4gICAgICByZXR1cm4gbWF0Y2hpbmdEZWxldGVzO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFzeW5jIG9uRGVsZXRlKGRlbDogRGVsZXRlTW9kZWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgLy8gVGhlIGNvbnZlcnNhdGlvbiB0aGUgZGVsZXRlZCBtZXNzYWdlIHdhcyBpbjsgd2UgaGF2ZSB0byBmaW5kIGl0IGluIHRoZSBkYXRhYmFzZVxuICAgICAgLy8gICB0byB0byBmaWd1cmUgdGhhdCBvdXQuXG4gICAgICBjb25zdCB0YXJnZXRDb252ZXJzYXRpb24gPVxuICAgICAgICBhd2FpdCB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRDb252ZXJzYXRpb25Gb3JUYXJnZXRNZXNzYWdlKFxuICAgICAgICAgIGRlbC5nZXQoJ2Zyb21JZCcpLFxuICAgICAgICAgIGRlbC5nZXQoJ3RhcmdldFNlbnRUaW1lc3RhbXAnKVxuICAgICAgICApO1xuXG4gICAgICBpZiAoIXRhcmdldENvbnZlcnNhdGlvbikge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAnTm8gdGFyZ2V0IGNvbnZlcnNhdGlvbiBmb3IgRE9FJyxcbiAgICAgICAgICBkZWwuZ2V0KCdmcm9tSWQnKSxcbiAgICAgICAgICBkZWwuZ2V0KCd0YXJnZXRTZW50VGltZXN0YW1wJylcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIERvIG5vdCBhd2FpdCwgc2luY2UgdGhpcyBjYW4gZGVhZGxvY2sgdGhlIHF1ZXVlXG4gICAgICB0YXJnZXRDb252ZXJzYXRpb24ucXVldWVKb2IoJ0RlbGV0ZXMub25EZWxldGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxvZy5pbmZvKCdIYW5kbGluZyBET0UgZm9yJywgZGVsLmdldCgndGFyZ2V0U2VudFRpbWVzdGFtcCcpKTtcblxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRNZXNzYWdlc0J5U2VudEF0KFxuICAgICAgICAgIGRlbC5nZXQoJ3RhcmdldFNlbnRUaW1lc3RhbXAnKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgIG0gPT4gZGVsLmdldCgnZnJvbUlkJykgPT09IGdldENvbnRhY3RJZChtKSAmJiAhbS5kZWxldGVkRm9yRXZlcnlvbmVcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIXRhcmdldE1lc3NhZ2UpIHtcbiAgICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAgICdObyBtZXNzYWdlIGZvciBET0UnLFxuICAgICAgICAgICAgZGVsLmdldCgnZnJvbUlkJyksXG4gICAgICAgICAgICBkZWwuZ2V0KCd0YXJnZXRTZW50VGltZXN0YW1wJylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgICAgICB0YXJnZXRNZXNzYWdlLmlkLFxuICAgICAgICAgIHRhcmdldE1lc3NhZ2VcbiAgICAgICAgKTtcblxuICAgICAgICBhd2FpdCBkZWxldGVGb3JFdmVyeW9uZShtZXNzYWdlLCBkZWwpO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlKGRlbCk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKFxuICAgICAgICAnRGVsZXRlcy5vbkRlbGV0ZSBlcnJvcjonLFxuICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxzQkFBa0M7QUFFbEMscUJBQTZCO0FBQzdCLFVBQXFCO0FBQ3JCLCtCQUFrQztBQVEzQixNQUFNLG9CQUFvQixzQkFBNEI7QUFBQztBQUF2RCxBQUVQLElBQUk7QUFFRyxNQUFNLGdCQUFnQiwyQkFBd0I7QUFBQSxTQUM1QyxlQUF3QjtBQUM3QixRQUFJLENBQUMsV0FBVztBQUNkLGtCQUFZLElBQUksUUFBUTtBQUFBLElBQzFCO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFdBQVcsU0FBMkM7QUFDcEQsVUFBTSxrQkFBa0IsS0FBSyxPQUFPLFVBQVE7QUFDMUMsYUFDRSxLQUFLLElBQUkscUJBQXFCLE1BQU0sUUFBUSxJQUFJLFNBQVMsS0FDekQsS0FBSyxJQUFJLFFBQVEsTUFBTSxpQ0FBYSxRQUFRLFVBQVU7QUFBQSxJQUUxRCxDQUFDO0FBRUQsUUFBSSxnQkFBZ0IsU0FBUyxHQUFHO0FBQzlCLFVBQUksS0FBSyw2QkFBNkI7QUFDdEMsV0FBSyxPQUFPLGVBQWU7QUFDM0IsYUFBTztBQUFBLElBQ1Q7QUFFQSxXQUFPLENBQUM7QUFBQSxFQUNWO0FBQUEsUUFFTSxTQUFTLEtBQWlDO0FBQzlDLFFBQUk7QUFHRixZQUFNLHFCQUNKLE1BQU0sT0FBTyx1QkFBdUIsZ0NBQ2xDLElBQUksSUFBSSxRQUFRLEdBQ2hCLElBQUksSUFBSSxxQkFBcUIsQ0FDL0I7QUFFRixVQUFJLENBQUMsb0JBQW9CO0FBQ3ZCLFlBQUksS0FDRixrQ0FDQSxJQUFJLElBQUksUUFBUSxHQUNoQixJQUFJLElBQUkscUJBQXFCLENBQy9CO0FBRUE7QUFBQSxNQUNGO0FBR0EseUJBQW1CLFNBQVMsb0JBQW9CLFlBQVk7QUFDMUQsWUFBSSxLQUFLLG9CQUFvQixJQUFJLElBQUkscUJBQXFCLENBQUM7QUFFM0QsY0FBTSxXQUFXLE1BQU0sT0FBTyxPQUFPLEtBQUssb0JBQ3hDLElBQUksSUFBSSxxQkFBcUIsQ0FDL0I7QUFFQSxjQUFNLGdCQUFnQixTQUFTLEtBQzdCLE9BQUssSUFBSSxJQUFJLFFBQVEsTUFBTSxpQ0FBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLGtCQUNuRDtBQUVBLFlBQUksQ0FBQyxlQUFlO0FBQ2xCLGNBQUksS0FDRixzQkFDQSxJQUFJLElBQUksUUFBUSxHQUNoQixJQUFJLElBQUkscUJBQXFCLENBQy9CO0FBRUE7QUFBQSxRQUNGO0FBRUEsY0FBTSxVQUFVLE9BQU8sa0JBQWtCLFNBQ3ZDLGNBQWMsSUFDZCxhQUNGO0FBRUEsY0FBTSxnREFBa0IsU0FBUyxHQUFHO0FBRXBDLGFBQUssT0FBTyxHQUFHO0FBQUEsTUFDakIsQ0FBQztBQUFBLElBQ0gsU0FBUyxPQUFQO0FBQ0EsVUFBSSxNQUNGLDJCQUNBLFNBQVMsTUFBTSxRQUFRLE1BQU0sUUFBUSxLQUN2QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFwRk8iLAogICJuYW1lcyI6IFtdCn0K
