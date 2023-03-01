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
var Reactions_exports = {};
__export(Reactions_exports, {
  ReactionModel: () => ReactionModel,
  Reactions: () => Reactions
});
module.exports = __toCommonJS(Reactions_exports);
var import_backbone = require("backbone");
var log = __toESM(require("../logging/log"));
var import_helpers = require("../messages/helpers");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_message = require("../state/selectors/message");
class ReactionModel extends import_backbone.Model {
}
let singleton;
class Reactions extends import_backbone.Collection {
  static getSingleton() {
    if (!singleton) {
      singleton = new Reactions();
    }
    return singleton;
  }
  forMessage(message) {
    if ((0, import_message.isOutgoing)(message.attributes)) {
      const outgoingReactions = this.filter((item) => item.get("targetTimestamp") === message.get("sent_at"));
      if (outgoingReactions.length > 0) {
        log.info("Found early reaction for outgoing message");
        this.remove(outgoingReactions);
        return outgoingReactions;
      }
    }
    const senderId = (0, import_helpers.getContactId)(message.attributes);
    const sentAt = message.get("sent_at");
    const reactionsBySource = this.filter((re) => {
      const targetSender = window.ConversationController.lookupOrCreate({
        uuid: re.get("targetAuthorUuid")
      });
      const targetTimestamp = re.get("targetTimestamp");
      return targetSender?.id === senderId && targetTimestamp === sentAt;
    });
    if (reactionsBySource.length > 0) {
      log.info("Found early reaction for message");
      this.remove(reactionsBySource);
      return reactionsBySource;
    }
    return [];
  }
  async findMessage(targetTimestamp, targetConversationId) {
    const messages = await window.Signal.Data.getMessagesBySentAt(targetTimestamp);
    return messages.find((m) => {
      const contact = (0, import_helpers.getContact)(m);
      if (!contact) {
        return false;
      }
      const mcid = contact.get("id");
      return mcid === targetConversationId;
    });
  }
  async onReaction(reaction, generatedMessage) {
    try {
      const targetAuthorConversation = window.ConversationController.lookupOrCreate({
        uuid: reaction.get("targetAuthorUuid")
      });
      const targetConversationId = targetAuthorConversation?.id;
      if (!targetConversationId) {
        throw new Error("onReaction: No conversationId returned from lookupOrCreate!");
      }
      const fromConversation = window.ConversationController.get(generatedMessage.get("conversationId"));
      let targetConversation;
      const targetMessageCheck = await this.findMessage(reaction.get("targetTimestamp"), targetConversationId);
      if (!targetMessageCheck) {
        log.info("No message for reaction", reaction.get("targetAuthorUuid"), reaction.get("targetTimestamp"));
        return;
      }
      if (fromConversation && (0, import_message.isStory)(targetMessageCheck) && (0, import_whatTypeOfConversation.isDirectConversation)(fromConversation.attributes) && !(0, import_whatTypeOfConversation.isMe)(fromConversation.attributes)) {
        targetConversation = fromConversation;
      } else {
        targetConversation = await window.ConversationController.getConversationForTargetMessage(targetConversationId, reaction.get("targetTimestamp"));
      }
      if (!targetConversation) {
        log.info("No target conversation for reaction", reaction.get("targetAuthorUuid"), reaction.get("targetTimestamp"));
        return void 0;
      }
      await targetConversation.queueJob("Reactions.onReaction", async () => {
        log.info("Handling reaction for", reaction.get("targetTimestamp"));
        if (!targetConversation) {
          return;
        }
        const targetMessage = await this.findMessage(reaction.get("targetTimestamp"), targetConversationId);
        if (!targetMessage) {
          return;
        }
        const message = window.MessageController.register(targetMessage.id, targetMessage);
        if ((0, import_message.isStory)(targetMessage) && (0, import_whatTypeOfConversation.isDirectConversation)(targetConversation.attributes)) {
          generatedMessage.set({
            storyId: targetMessage.id,
            storyReactionEmoji: reaction.get("emoji")
          });
          const [generatedMessageId] = await Promise.all([
            window.Signal.Data.saveMessage(generatedMessage.attributes, {
              ourUuid: window.textsecure.storage.user.getCheckedUuid().toString()
            }),
            generatedMessage.hydrateStoryContext(message)
          ]);
          generatedMessage.set({ id: generatedMessageId });
          const messageToAdd = window.MessageController.register(generatedMessageId, generatedMessage);
          targetConversation.addSingleMessage(messageToAdd);
        }
        await message.handleReaction(reaction);
        this.remove(reaction);
      });
    } catch (error) {
      log.error("Reactions.onReaction error:", error && error.stack ? error.stack : error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReactionModel,
  Reactions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiUmVhY3Rpb25zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cblxuaW1wb3J0IHsgQ29sbGVjdGlvbiwgTW9kZWwgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvbWVzc2FnZXMnO1xuaW1wb3J0IHR5cGUge1xuICBNZXNzYWdlQXR0cmlidXRlc1R5cGUsXG4gIFJlYWN0aW9uQXR0cmlidXRlc1R5cGUsXG59IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB7IGdldENvbnRhY3RJZCwgZ2V0Q29udGFjdCB9IGZyb20gJy4uL21lc3NhZ2VzL2hlbHBlcnMnO1xuaW1wb3J0IHsgaXNEaXJlY3RDb252ZXJzYXRpb24sIGlzTWUgfSBmcm9tICcuLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgaXNPdXRnb2luZywgaXNTdG9yeSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9tZXNzYWdlJztcblxuZXhwb3J0IGNsYXNzIFJlYWN0aW9uTW9kZWwgZXh0ZW5kcyBNb2RlbDxSZWFjdGlvbkF0dHJpYnV0ZXNUeXBlPiB7fVxuXG5sZXQgc2luZ2xldG9uOiBSZWFjdGlvbnMgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjbGFzcyBSZWFjdGlvbnMgZXh0ZW5kcyBDb2xsZWN0aW9uPFJlYWN0aW9uTW9kZWw+IHtcbiAgc3RhdGljIGdldFNpbmdsZXRvbigpOiBSZWFjdGlvbnMge1xuICAgIGlmICghc2luZ2xldG9uKSB7XG4gICAgICBzaW5nbGV0b24gPSBuZXcgUmVhY3Rpb25zKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpbmdsZXRvbjtcbiAgfVxuXG4gIGZvck1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZU1vZGVsKTogQXJyYXk8UmVhY3Rpb25Nb2RlbD4ge1xuICAgIGlmIChpc091dGdvaW5nKG1lc3NhZ2UuYXR0cmlidXRlcykpIHtcbiAgICAgIGNvbnN0IG91dGdvaW5nUmVhY3Rpb25zID0gdGhpcy5maWx0ZXIoXG4gICAgICAgIGl0ZW0gPT4gaXRlbS5nZXQoJ3RhcmdldFRpbWVzdGFtcCcpID09PSBtZXNzYWdlLmdldCgnc2VudF9hdCcpXG4gICAgICApO1xuXG4gICAgICBpZiAob3V0Z29pbmdSZWFjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBsb2cuaW5mbygnRm91bmQgZWFybHkgcmVhY3Rpb24gZm9yIG91dGdvaW5nIG1lc3NhZ2UnKTtcbiAgICAgICAgdGhpcy5yZW1vdmUob3V0Z29pbmdSZWFjdGlvbnMpO1xuICAgICAgICByZXR1cm4gb3V0Z29pbmdSZWFjdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2VuZGVySWQgPSBnZXRDb250YWN0SWQobWVzc2FnZS5hdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBzZW50QXQgPSBtZXNzYWdlLmdldCgnc2VudF9hdCcpO1xuICAgIGNvbnN0IHJlYWN0aW9uc0J5U291cmNlID0gdGhpcy5maWx0ZXIocmUgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0U2VuZGVyID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgICB1dWlkOiByZS5nZXQoJ3RhcmdldEF1dGhvclV1aWQnKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGFyZ2V0VGltZXN0YW1wID0gcmUuZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKTtcbiAgICAgIHJldHVybiB0YXJnZXRTZW5kZXI/LmlkID09PSBzZW5kZXJJZCAmJiB0YXJnZXRUaW1lc3RhbXAgPT09IHNlbnRBdDtcbiAgICB9KTtcblxuICAgIGlmIChyZWFjdGlvbnNCeVNvdXJjZS5sZW5ndGggPiAwKSB7XG4gICAgICBsb2cuaW5mbygnRm91bmQgZWFybHkgcmVhY3Rpb24gZm9yIG1lc3NhZ2UnKTtcbiAgICAgIHRoaXMucmVtb3ZlKHJlYWN0aW9uc0J5U291cmNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbnNCeVNvdXJjZTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZpbmRNZXNzYWdlKFxuICAgIHRhcmdldFRpbWVzdGFtcDogbnVtYmVyLFxuICAgIHRhcmdldENvbnZlcnNhdGlvbklkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxNZXNzYWdlQXR0cmlidXRlc1R5cGUgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRNZXNzYWdlc0J5U2VudEF0KFxuICAgICAgdGFyZ2V0VGltZXN0YW1wXG4gICAgKTtcblxuICAgIHJldHVybiBtZXNzYWdlcy5maW5kKG0gPT4ge1xuICAgICAgY29uc3QgY29udGFjdCA9IGdldENvbnRhY3QobSk7XG5cbiAgICAgIGlmICghY29udGFjdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1jaWQgPSBjb250YWN0LmdldCgnaWQnKTtcbiAgICAgIHJldHVybiBtY2lkID09PSB0YXJnZXRDb252ZXJzYXRpb25JZDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIG9uUmVhY3Rpb24oXG4gICAgcmVhY3Rpb246IFJlYWN0aW9uTW9kZWwsXG4gICAgZ2VuZXJhdGVkTWVzc2FnZTogTWVzc2FnZU1vZGVsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBUaGUgY29udmVyc2F0aW9uIHRoZSB0YXJnZXQgbWVzc2FnZSB3YXMgaW47IHdlIGhhdmUgdG8gZmluZCBpdCBpbiB0aGUgZGF0YWJhc2VcbiAgICAgIC8vICAgdG8gdG8gZmlndXJlIHRoYXQgb3V0LlxuICAgICAgY29uc3QgdGFyZ2V0QXV0aG9yQ29udmVyc2F0aW9uID1cbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubG9va3VwT3JDcmVhdGUoe1xuICAgICAgICAgIHV1aWQ6IHJlYWN0aW9uLmdldCgndGFyZ2V0QXV0aG9yVXVpZCcpLFxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IHRhcmdldENvbnZlcnNhdGlvbklkID0gdGFyZ2V0QXV0aG9yQ29udmVyc2F0aW9uPy5pZDtcbiAgICAgIGlmICghdGFyZ2V0Q29udmVyc2F0aW9uSWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdvblJlYWN0aW9uOiBObyBjb252ZXJzYXRpb25JZCByZXR1cm5lZCBmcm9tIGxvb2t1cE9yQ3JlYXRlISdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZnJvbUNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChcbiAgICAgICAgZ2VuZXJhdGVkTWVzc2FnZS5nZXQoJ2NvbnZlcnNhdGlvbklkJylcbiAgICAgICk7XG5cbiAgICAgIGxldCB0YXJnZXRDb252ZXJzYXRpb246IENvbnZlcnNhdGlvbk1vZGVsIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZUNoZWNrID0gYXdhaXQgdGhpcy5maW5kTWVzc2FnZShcbiAgICAgICAgcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKSxcbiAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uSWRcbiAgICAgICk7XG4gICAgICBpZiAoIXRhcmdldE1lc3NhZ2VDaGVjaykge1xuICAgICAgICBsb2cuaW5mbyhcbiAgICAgICAgICAnTm8gbWVzc2FnZSBmb3IgcmVhY3Rpb24nLFxuICAgICAgICAgIHJlYWN0aW9uLmdldCgndGFyZ2V0QXV0aG9yVXVpZCcpLFxuICAgICAgICAgIHJlYWN0aW9uLmdldCgndGFyZ2V0VGltZXN0YW1wJylcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgZnJvbUNvbnZlcnNhdGlvbiAmJlxuICAgICAgICBpc1N0b3J5KHRhcmdldE1lc3NhZ2VDaGVjaykgJiZcbiAgICAgICAgaXNEaXJlY3RDb252ZXJzYXRpb24oZnJvbUNvbnZlcnNhdGlvbi5hdHRyaWJ1dGVzKSAmJlxuICAgICAgICAhaXNNZShmcm9tQ29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpXG4gICAgICApIHtcbiAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uID0gZnJvbUNvbnZlcnNhdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldENvbnZlcnNhdGlvbiA9XG4gICAgICAgICAgYXdhaXQgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0Q29udmVyc2F0aW9uRm9yVGFyZ2V0TWVzc2FnZShcbiAgICAgICAgICAgIHRhcmdldENvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKVxuICAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0Q29udmVyc2F0aW9uKSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdObyB0YXJnZXQgY29udmVyc2F0aW9uIGZvciByZWFjdGlvbicsXG4gICAgICAgICAgcmVhY3Rpb24uZ2V0KCd0YXJnZXRBdXRob3JVdWlkJyksXG4gICAgICAgICAgcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICAvLyBhd2FpdGluZyBpcyBzYWZlIHNpbmNlIGBvblJlYWN0aW9uYCBpcyBuZXZlciBjYWxsZWQgZnJvbSBpbnNpZGUgdGhlIHF1ZXVlXG4gICAgICBhd2FpdCB0YXJnZXRDb252ZXJzYXRpb24ucXVldWVKb2IoJ1JlYWN0aW9ucy5vblJlYWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBsb2cuaW5mbygnSGFuZGxpbmcgcmVhY3Rpb24gZm9yJywgcmVhY3Rpb24uZ2V0KCd0YXJnZXRUaW1lc3RhbXAnKSk7XG5cbiAgICAgICAgLy8gVGhhbmtzIFRTLlxuICAgICAgICBpZiAoIXRhcmdldENvbnZlcnNhdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1lc3NhZ2UgaXMgZmV0Y2hlZCBpbnNpZGUgdGhlIGNvbnZlcnNhdGlvbiBxdWV1ZSBzbyB3ZSBoYXZlIHRoZVxuICAgICAgICAvLyBtb3N0IHJlY2VudCBkYXRhXG4gICAgICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBhd2FpdCB0aGlzLmZpbmRNZXNzYWdlKFxuICAgICAgICAgIHJlYWN0aW9uLmdldCgndGFyZ2V0VGltZXN0YW1wJyksXG4gICAgICAgICAgdGFyZ2V0Q29udmVyc2F0aW9uSWRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIXRhcmdldE1lc3NhZ2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLnJlZ2lzdGVyKFxuICAgICAgICAgIHRhcmdldE1lc3NhZ2UuaWQsXG4gICAgICAgICAgdGFyZ2V0TWVzc2FnZVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFVzZSB0aGUgZ2VuZXJhdGVkIG1lc3NhZ2UgaW4gdHMvYmFja2dyb3VuZC50cyB0byBjcmVhdGUgYSBtZXNzYWdlXG4gICAgICAgIC8vIGlmIHRoZSByZWFjdGlvbiBpcyB0YXJnZXR0ZWQgYXQgYSBzdG9yeSBvbiBhIDE6MSBjb252ZXJzYXRpb24uXG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc1N0b3J5KHRhcmdldE1lc3NhZ2UpICYmXG4gICAgICAgICAgaXNEaXJlY3RDb252ZXJzYXRpb24odGFyZ2V0Q29udmVyc2F0aW9uLmF0dHJpYnV0ZXMpXG4gICAgICAgICkge1xuICAgICAgICAgIGdlbmVyYXRlZE1lc3NhZ2Uuc2V0KHtcbiAgICAgICAgICAgIHN0b3J5SWQ6IHRhcmdldE1lc3NhZ2UuaWQsXG4gICAgICAgICAgICBzdG9yeVJlYWN0aW9uRW1vamk6IHJlYWN0aW9uLmdldCgnZW1vamknKSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IFtnZW5lcmF0ZWRNZXNzYWdlSWRdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKGdlbmVyYXRlZE1lc3NhZ2UuYXR0cmlidXRlcywge1xuICAgICAgICAgICAgICBvdXJVdWlkOiB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAgICAgICAgICAgICAuZ2V0Q2hlY2tlZFV1aWQoKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBnZW5lcmF0ZWRNZXNzYWdlLmh5ZHJhdGVTdG9yeUNvbnRleHQobWVzc2FnZSksXG4gICAgICAgICAgXSk7XG5cbiAgICAgICAgICBnZW5lcmF0ZWRNZXNzYWdlLnNldCh7IGlkOiBnZW5lcmF0ZWRNZXNzYWdlSWQgfSk7XG5cbiAgICAgICAgICBjb25zdCBtZXNzYWdlVG9BZGQgPSB3aW5kb3cuTWVzc2FnZUNvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICAgICAgICBnZW5lcmF0ZWRNZXNzYWdlSWQsXG4gICAgICAgICAgICBnZW5lcmF0ZWRNZXNzYWdlXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0YXJnZXRDb252ZXJzYXRpb24uYWRkU2luZ2xlTWVzc2FnZShtZXNzYWdlVG9BZGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgbWVzc2FnZS5oYW5kbGVSZWFjdGlvbihyZWFjdGlvbik7XG5cbiAgICAgICAgdGhpcy5yZW1vdmUocmVhY3Rpb24pO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ1JlYWN0aW9ucy5vblJlYWN0aW9uIGVycm9yOicsXG4gICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBLHNCQUFrQztBQU9sQyxVQUFxQjtBQUNyQixxQkFBeUM7QUFDekMsb0NBQTJDO0FBQzNDLHFCQUFvQztBQUU3QixNQUFNLHNCQUFzQixzQkFBOEI7QUFBQztBQUEzRCxBQUVQLElBQUk7QUFFRyxNQUFNLGtCQUFrQiwyQkFBMEI7QUFBQSxTQUNoRCxlQUEwQjtBQUMvQixRQUFJLENBQUMsV0FBVztBQUNkLGtCQUFZLElBQUksVUFBVTtBQUFBLElBQzVCO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFdBQVcsU0FBNkM7QUFDdEQsUUFBSSwrQkFBVyxRQUFRLFVBQVUsR0FBRztBQUNsQyxZQUFNLG9CQUFvQixLQUFLLE9BQzdCLFVBQVEsS0FBSyxJQUFJLGlCQUFpQixNQUFNLFFBQVEsSUFBSSxTQUFTLENBQy9EO0FBRUEsVUFBSSxrQkFBa0IsU0FBUyxHQUFHO0FBQ2hDLFlBQUksS0FBSywyQ0FBMkM7QUFDcEQsYUFBSyxPQUFPLGlCQUFpQjtBQUM3QixlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFFQSxVQUFNLFdBQVcsaUNBQWEsUUFBUSxVQUFVO0FBQ2hELFVBQU0sU0FBUyxRQUFRLElBQUksU0FBUztBQUNwQyxVQUFNLG9CQUFvQixLQUFLLE9BQU8sUUFBTTtBQUMxQyxZQUFNLGVBQWUsT0FBTyx1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
