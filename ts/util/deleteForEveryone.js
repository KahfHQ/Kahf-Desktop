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
var deleteForEveryone_exports = {};
__export(deleteForEveryone_exports, {
  deleteForEveryone: () => deleteForEveryone
});
module.exports = __toCommonJS(deleteForEveryone_exports);
var log = __toESM(require("../logging/log"));
var import_durations = require("./durations");
var import_helpers = require("../messages/helpers");
async function deleteForEveryone(message, doe, shouldPersist = true) {
  if (isDeletionByMe(message, doe)) {
    await message.handleDeleteForEveryone(doe, shouldPersist);
    return;
  }
  if (isDeletionTooOld(message, doe)) {
    log.warn("Received late DOE. Dropping.", {
      fromId: doe.get("fromId"),
      targetSentTimestamp: doe.get("targetSentTimestamp"),
      messageServerTimestamp: message.get("serverTimestamp"),
      messageSentAt: message.get("sent_at"),
      deleteServerTimestamp: doe.get("serverTimestamp")
    });
    return;
  }
  await message.handleDeleteForEveryone(doe, shouldPersist);
}
function isDeletionByMe(message, doe) {
  const ourConversationId = window.ConversationController.getOurConversationIdOrThrow();
  return (0, import_helpers.getContactId)(message.attributes) === ourConversationId && doe.get("fromId") === ourConversationId;
}
function isDeletionTooOld(message, doe) {
  const messageTimestamp = message.get("serverTimestamp") || message.get("sent_at") || 0;
  const delta = Math.abs(doe.get("serverTimestamp") - messageTimestamp);
  return delta > import_durations.DAY;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteForEveryone
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGVsZXRlRm9yRXZlcnlvbmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IERlbGV0ZU1vZGVsIH0gZnJvbSAnLi4vbWVzc2FnZU1vZGlmaWVycy9EZWxldGVzJztcbmltcG9ydCB0eXBlIHsgTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL21lc3NhZ2VzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBEQVkgfSBmcm9tICcuL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBnZXRDb250YWN0SWQgfSBmcm9tICcuLi9tZXNzYWdlcy9oZWxwZXJzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUZvckV2ZXJ5b25lKFxuICBtZXNzYWdlOiBNZXNzYWdlTW9kZWwsXG4gIGRvZTogRGVsZXRlTW9kZWwsXG4gIHNob3VsZFBlcnNpc3QgPSB0cnVlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGlzRGVsZXRpb25CeU1lKG1lc3NhZ2UsIGRvZSkpIHtcbiAgICBhd2FpdCBtZXNzYWdlLmhhbmRsZURlbGV0ZUZvckV2ZXJ5b25lKGRvZSwgc2hvdWxkUGVyc2lzdCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVsZXRpb25Ub29PbGQobWVzc2FnZSwgZG9lKSkge1xuICAgIGxvZy53YXJuKCdSZWNlaXZlZCBsYXRlIERPRS4gRHJvcHBpbmcuJywge1xuICAgICAgZnJvbUlkOiBkb2UuZ2V0KCdmcm9tSWQnKSxcbiAgICAgIHRhcmdldFNlbnRUaW1lc3RhbXA6IGRvZS5nZXQoJ3RhcmdldFNlbnRUaW1lc3RhbXAnKSxcbiAgICAgIG1lc3NhZ2VTZXJ2ZXJUaW1lc3RhbXA6IG1lc3NhZ2UuZ2V0KCdzZXJ2ZXJUaW1lc3RhbXAnKSxcbiAgICAgIG1lc3NhZ2VTZW50QXQ6IG1lc3NhZ2UuZ2V0KCdzZW50X2F0JyksXG4gICAgICBkZWxldGVTZXJ2ZXJUaW1lc3RhbXA6IGRvZS5nZXQoJ3NlcnZlclRpbWVzdGFtcCcpLFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IG1lc3NhZ2UuaGFuZGxlRGVsZXRlRm9yRXZlcnlvbmUoZG9lLCBzaG91bGRQZXJzaXN0KTtcbn1cblxuZnVuY3Rpb24gaXNEZWxldGlvbkJ5TWUoXG4gIG1lc3NhZ2U6IFJlYWRvbmx5PE1lc3NhZ2VNb2RlbD4sXG4gIGRvZTogUmVhZG9ubHk8RGVsZXRlTW9kZWw+XG4pOiBib29sZWFuIHtcbiAgY29uc3Qgb3VyQ29udmVyc2F0aW9uSWQgPVxuICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpO1xuICByZXR1cm4gKFxuICAgIGdldENvbnRhY3RJZChtZXNzYWdlLmF0dHJpYnV0ZXMpID09PSBvdXJDb252ZXJzYXRpb25JZCAmJlxuICAgIGRvZS5nZXQoJ2Zyb21JZCcpID09PSBvdXJDb252ZXJzYXRpb25JZFxuICApO1xufVxuXG5mdW5jdGlvbiBpc0RlbGV0aW9uVG9vT2xkKFxuICBtZXNzYWdlOiBSZWFkb25seTxNZXNzYWdlTW9kZWw+LFxuICBkb2U6IFJlYWRvbmx5PERlbGV0ZU1vZGVsPlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1lc3NhZ2VUaW1lc3RhbXAgPVxuICAgIG1lc3NhZ2UuZ2V0KCdzZXJ2ZXJUaW1lc3RhbXAnKSB8fCBtZXNzYWdlLmdldCgnc2VudF9hdCcpIHx8IDA7XG4gIGNvbnN0IGRlbHRhID0gTWF0aC5hYnMoZG9lLmdldCgnc2VydmVyVGltZXN0YW1wJykgLSBtZXNzYWdlVGltZXN0YW1wKTtcbiAgcmV0dXJuIGRlbHRhID4gREFZO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBLFVBQXFCO0FBQ3JCLHVCQUFvQjtBQUNwQixxQkFBNkI7QUFFN0IsaUNBQ0UsU0FDQSxLQUNBLGdCQUFnQixNQUNEO0FBQ2YsTUFBSSxlQUFlLFNBQVMsR0FBRyxHQUFHO0FBQ2hDLFVBQU0sUUFBUSx3QkFBd0IsS0FBSyxhQUFhO0FBQ3hEO0FBQUEsRUFDRjtBQUVBLE1BQUksaUJBQWlCLFNBQVMsR0FBRyxHQUFHO0FBQ2xDLFFBQUksS0FBSyxnQ0FBZ0M7QUFBQSxNQUN2QyxRQUFRLElBQUksSUFBSSxRQUFRO0FBQUEsTUFDeEIscUJBQXFCLElBQUksSUFBSSxxQkFBcUI7QUFBQSxNQUNsRCx3QkFBd0IsUUFBUSxJQUFJLGlCQUFpQjtBQUFBLE1BQ3JELGVBQWUsUUFBUSxJQUFJLFNBQVM7QUFBQSxNQUNwQyx1QkFBdUIsSUFBSSxJQUFJLGlCQUFpQjtBQUFBLElBQ2xELENBQUM7QUFDRDtBQUFBLEVBQ0Y7QUFFQSxRQUFNLFFBQVEsd0JBQXdCLEtBQUssYUFBYTtBQUMxRDtBQXRCc0IsQUF3QnRCLHdCQUNFLFNBQ0EsS0FDUztBQUNULFFBQU0sb0JBQ0osT0FBTyx1QkFBdUIsNEJBQTRCO0FBQzVELFNBQ0UsaUNBQWEsUUFBUSxVQUFVLE1BQU0scUJBQ3JDLElBQUksSUFBSSxRQUFRLE1BQU07QUFFMUI7QUFWUyxBQVlULDBCQUNFLFNBQ0EsS0FDUztBQUNULFFBQU0sbUJBQ0osUUFBUSxJQUFJLGlCQUFpQixLQUFLLFFBQVEsSUFBSSxTQUFTLEtBQUs7QUFDOUQsUUFBTSxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksaUJBQWlCLElBQUksZ0JBQWdCO0FBQ3BFLFNBQU8sUUFBUTtBQUNqQjtBQVJTIiwKICAibmFtZXMiOiBbXQp9Cg==
