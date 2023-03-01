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
var lookupConversationWithoutUuid_exports = {};
__export(lookupConversationWithoutUuid_exports, {
  lookupConversationWithoutUuid: () => lookupConversationWithoutUuid
});
module.exports = __toCommonJS(lookupConversationWithoutUuid_exports);
var import_ToastFailedToFetchUsername = require("../components/ToastFailedToFetchUsername");
var import_ToastFailedToFetchPhoneNumber = require("../components/ToastFailedToFetchPhoneNumber");
var log = __toESM(require("../logging/log"));
var import_UUID = require("../types/UUID");
var import_Username = require("../types/Username");
var Errors = __toESM(require("../types/errors"));
var import_Errors = require("../textsecure/Errors");
var import_showToast = require("./showToast");
var import_assert = require("./assert");
async function lookupConversationWithoutUuid(options) {
  const knownConversation = window.ConversationController.get(options.type === "e164" ? options.e164 : options.username);
  if (knownConversation && knownConversation.get("uuid")) {
    return knownConversation.id;
  }
  const identifier = options.type === "e164" ? `e164:${options.e164}` : `username:${options.username}`;
  const { showUserNotFoundModal, setIsFetchingUUID } = options;
  setIsFetchingUUID(identifier, true);
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error("messaging is not available!");
  }
  try {
    let conversationId;
    if (options.type === "e164") {
      const serverLookup = await messaging.getUuidsForE164s([options.e164]);
      if (serverLookup[options.e164]) {
        const convo = window.ConversationController.maybeMergeContacts({
          aci: serverLookup[options.e164] || void 0,
          e164: options.e164,
          reason: "startNewConversationWithoutUuid(e164)"
        });
        conversationId = convo?.id;
      }
    } else {
      const foundUsername = await checkForUsername(options.username);
      if (foundUsername) {
        const convo = window.ConversationController.lookupOrCreate({
          uuid: foundUsername.uuid
        });
        (0, import_assert.strictAssert)(convo, "We just ensured conversation existence");
        conversationId = convo.id;
        convo.set({ username: foundUsername.username });
      }
    }
    if (!conversationId) {
      showUserNotFoundModal(options.type === "username" ? options : {
        type: "phoneNumber",
        phoneNumber: options.phoneNumber
      });
      return void 0;
    }
    return conversationId;
  } catch (error) {
    log.error("startNewConversationWithoutUuid: Something went wrong fetching:", Errors.toLogFormat(error));
    if (options.type === "e164") {
      (0, import_showToast.showToast)(import_ToastFailedToFetchPhoneNumber.ToastFailedToFetchPhoneNumber);
    } else {
      (0, import_showToast.showToast)(import_ToastFailedToFetchUsername.ToastFailedToFetchUsername);
    }
    return void 0;
  } finally {
    setIsFetchingUUID(identifier, false);
  }
}
async function checkForUsername(username) {
  if (!(0, import_Username.isValidUsername)(username)) {
    return void 0;
  }
  const { messaging } = window.textsecure;
  if (!messaging) {
    throw new Error("messaging is not available!");
  }
  try {
    const profile = await messaging.getProfileForUsername(username);
    if (!profile.uuid) {
      log.error("checkForUsername: Returned profile didn't include a uuid");
      return;
    }
    return {
      uuid: import_UUID.UUID.cast(profile.uuid),
      username
    };
  } catch (error) {
    if (!(error instanceof import_Errors.HTTPError)) {
      throw error;
    }
    if (error.code === 404) {
      return void 0;
    }
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lookupConversationWithoutUuid
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgVG9hc3RGYWlsZWRUb0ZldGNoVXNlcm5hbWUgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0RmFpbGVkVG9GZXRjaFVzZXJuYW1lJztcbmltcG9ydCB7IFRvYXN0RmFpbGVkVG9GZXRjaFBob25lTnVtYmVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdEZhaWxlZFRvRmV0Y2hQaG9uZU51bWJlcic7XG5pbXBvcnQgdHlwZSB7IFVzZXJOb3RGb3VuZE1vZGFsU3RhdGVUeXBlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvZ2xvYmFsTW9kYWxzJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2dnaW5nL2xvZyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgdHlwZSB7IFVVSURTdHJpbmdUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBpc1ZhbGlkVXNlcm5hbWUgfSBmcm9tICcuLi90eXBlcy9Vc2VybmFtZSc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vdHlwZXMvZXJyb3JzJztcbmltcG9ydCB7IEhUVFBFcnJvciB9IGZyb20gJy4uL3RleHRzZWN1cmUvRXJyb3JzJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4vc2hvd1RvYXN0JztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4vYXNzZXJ0JztcbmltcG9ydCB0eXBlIHsgVVVJREZldGNoU3RhdGVLZXlUeXBlIH0gZnJvbSAnLi91dWlkRmV0Y2hTdGF0ZSc7XG5cbmV4cG9ydCB0eXBlIExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGUgPSBSZWFkb25seTx7XG4gIGxvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkOiB0eXBlb2YgbG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWQ7XG4gIHNob3dVc2VyTm90Rm91bmRNb2RhbDogKHN0YXRlOiBVc2VyTm90Rm91bmRNb2RhbFN0YXRlVHlwZSkgPT4gdm9pZDtcbiAgc2V0SXNGZXRjaGluZ1VVSUQ6IChcbiAgICBpZGVudGlmaWVyOiBVVUlERmV0Y2hTdGF0ZUtleVR5cGUsXG4gICAgaXNGZXRjaGluZzogYm9vbGVhblxuICApID0+IHZvaWQ7XG59PjtcblxuZXhwb3J0IHR5cGUgTG9va3VwQ29udmVyc2F0aW9uV2l0aG91dFV1aWRPcHRpb25zVHlwZSA9IE9taXQ8XG4gIExvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkQWN0aW9uc1R5cGUsXG4gICdsb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZCdcbj4gJlxuICBSZWFkb25seTxcbiAgICB8IHtcbiAgICAgICAgdHlwZTogJ2UxNjQnO1xuICAgICAgICBlMTY0OiBzdHJpbmc7XG4gICAgICAgIHBob25lTnVtYmVyOiBzdHJpbmc7XG4gICAgICB9XG4gICAgfCB7XG4gICAgICAgIHR5cGU6ICd1c2VybmFtZSc7XG4gICAgICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgICB9XG4gID47XG5cbnR5cGUgRm91bmRVc2VybmFtZVR5cGUgPSB7XG4gIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICB1c2VybmFtZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvb2t1cENvbnZlcnNhdGlvbldpdGhvdXRVdWlkKFxuICBvcHRpb25zOiBMb29rdXBDb252ZXJzYXRpb25XaXRob3V0VXVpZE9wdGlvbnNUeXBlXG4pOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCBrbm93bkNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChcbiAgICBvcHRpb25zLnR5cGUgPT09ICdlMTY0JyA/IG9wdGlvbnMuZTE2NCA6IG9wdGlvbnMudXNlcm5hbWVcbiAgKTtcbiAgaWYgKGtub3duQ29udmVyc2F0aW9uICYmIGtub3duQ29udmVyc2F0aW9uLmdldCgndXVpZCcpKSB7XG4gICAgcmV0dXJuIGtub3duQ29udmVyc2F0aW9uLmlkO1xuICB9XG5cbiAgY29uc3QgaWRlbnRpZmllcjogVVVJREZldGNoU3RhdGVLZXlUeXBlID1cbiAgICBvcHRpb25zLnR5cGUgPT09ICdlMTY0J1xuICAgICAgPyBgZTE2NDoke29wdGlvbnMuZTE2NH1gXG4gICAgICA6IGB1c2VybmFtZToke29wdGlvbnMudXNlcm5hbWV9YDtcblxuICBjb25zdCB7IHNob3dVc2VyTm90Rm91bmRNb2RhbCwgc2V0SXNGZXRjaGluZ1VVSUQgfSA9IG9wdGlvbnM7XG4gIHNldElzRmV0Y2hpbmdVVUlEKGlkZW50aWZpZXIsIHRydWUpO1xuXG4gIGNvbnN0IHsgbWVzc2FnaW5nIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgaWYgKCFtZXNzYWdpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlIScpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBsZXQgY29udmVyc2F0aW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAob3B0aW9ucy50eXBlID09PSAnZTE2NCcpIHtcbiAgICAgIGNvbnN0IHNlcnZlckxvb2t1cCA9IGF3YWl0IG1lc3NhZ2luZy5nZXRVdWlkc0ZvckUxNjRzKFtvcHRpb25zLmUxNjRdKTtcblxuICAgICAgaWYgKHNlcnZlckxvb2t1cFtvcHRpb25zLmUxNjRdKSB7XG4gICAgICAgIGNvbnN0IGNvbnZvID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIubWF5YmVNZXJnZUNvbnRhY3RzKHtcbiAgICAgICAgICBhY2k6IHNlcnZlckxvb2t1cFtvcHRpb25zLmUxNjRdIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICBlMTY0OiBvcHRpb25zLmUxNjQsXG4gICAgICAgICAgcmVhc29uOiAnc3RhcnROZXdDb252ZXJzYXRpb25XaXRob3V0VXVpZChlMTY0KScsXG4gICAgICAgIH0pO1xuICAgICAgICBjb252ZXJzYXRpb25JZCA9IGNvbnZvPy5pZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZm91bmRVc2VybmFtZSA9IGF3YWl0IGNoZWNrRm9yVXNlcm5hbWUob3B0aW9ucy51c2VybmFtZSk7XG4gICAgICBpZiAoZm91bmRVc2VybmFtZSkge1xuICAgICAgICBjb25zdCBjb252byA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgICB1dWlkOiBmb3VuZFVzZXJuYW1lLnV1aWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0cmljdEFzc2VydChjb252bywgJ1dlIGp1c3QgZW5zdXJlZCBjb252ZXJzYXRpb24gZXhpc3RlbmNlJyk7XG5cbiAgICAgICAgY29udmVyc2F0aW9uSWQgPSBjb252by5pZDtcblxuICAgICAgICBjb252by5zZXQoeyB1c2VybmFtZTogZm91bmRVc2VybmFtZS51c2VybmFtZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNvbnZlcnNhdGlvbklkKSB7XG4gICAgICBzaG93VXNlck5vdEZvdW5kTW9kYWwoXG4gICAgICAgIG9wdGlvbnMudHlwZSA9PT0gJ3VzZXJuYW1lJ1xuICAgICAgICAgID8gb3B0aW9uc1xuICAgICAgICAgIDoge1xuICAgICAgICAgICAgICB0eXBlOiAncGhvbmVOdW1iZXInLFxuICAgICAgICAgICAgICBwaG9uZU51bWJlcjogb3B0aW9ucy5waG9uZU51bWJlcixcbiAgICAgICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJzYXRpb25JZDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICAnc3RhcnROZXdDb252ZXJzYXRpb25XaXRob3V0VXVpZDogU29tZXRoaW5nIHdlbnQgd3JvbmcgZmV0Y2hpbmc6JyxcbiAgICAgIEVycm9ycy50b0xvZ0Zvcm1hdChlcnJvcilcbiAgICApO1xuXG4gICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ2UxNjQnKSB7XG4gICAgICBzaG93VG9hc3QoVG9hc3RGYWlsZWRUb0ZldGNoUGhvbmVOdW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93VG9hc3QoVG9hc3RGYWlsZWRUb0ZldGNoVXNlcm5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0gZmluYWxseSB7XG4gICAgc2V0SXNGZXRjaGluZ1VVSUQoaWRlbnRpZmllciwgZmFsc2UpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrRm9yVXNlcm5hbWUoXG4gIHVzZXJuYW1lOiBzdHJpbmdcbik6IFByb21pc2U8Rm91bmRVc2VybmFtZVR5cGUgfCB1bmRlZmluZWQ+IHtcbiAgaWYgKCFpc1ZhbGlkVXNlcm5hbWUodXNlcm5hbWUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHsgbWVzc2FnaW5nIH0gPSB3aW5kb3cudGV4dHNlY3VyZTtcbiAgaWYgKCFtZXNzYWdpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2luZyBpcyBub3QgYXZhaWxhYmxlIScpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgbWVzc2FnaW5nLmdldFByb2ZpbGVGb3JVc2VybmFtZSh1c2VybmFtZSk7XG5cbiAgICBpZiAoIXByb2ZpbGUudXVpZCkge1xuICAgICAgbG9nLmVycm9yKFwiY2hlY2tGb3JVc2VybmFtZTogUmV0dXJuZWQgcHJvZmlsZSBkaWRuJ3QgaW5jbHVkZSBhIHV1aWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHV1aWQ6IFVVSUQuY2FzdChwcm9maWxlLnV1aWQpLFxuICAgICAgdXNlcm5hbWUsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvcikpIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIGlmIChlcnJvci5jb2RlID09PSA0MDQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQSx3Q0FBMkM7QUFDM0MsMkNBQThDO0FBRTlDLFVBQXFCO0FBQ3JCLGtCQUFxQjtBQUVyQixzQkFBZ0M7QUFDaEMsYUFBd0I7QUFDeEIsb0JBQTBCO0FBQzFCLHVCQUEwQjtBQUMxQixvQkFBNkI7QUFpQzdCLDZDQUNFLFNBQzZCO0FBQzdCLFFBQU0sb0JBQW9CLE9BQU8sdUJBQXVCLElBQ3RELFFBQVEsU0FBUyxTQUFTLFFBQVEsT0FBTyxRQUFRLFFBQ25EO0FBQ0EsTUFBSSxxQkFBcUIsa0JBQWtCLElBQUksTUFBTSxHQUFHO0FBQ3RELFdBQU8sa0JBQWtCO0FBQUEsRUFDM0I7QUFFQSxRQUFNLGFBQ0osUUFBUSxTQUFTLFNBQ2IsUUFBUSxRQUFRLFNBQ2hCLFlBQVksUUFBUTtBQUUxQixRQUFNLEVBQUUsdUJBQXVCLHNCQUFzQjtBQUNyRCxvQkFBa0IsWUFBWSxJQUFJO0FBRWxDLFFBQU0sRUFBRSxjQUFjLE9BQU87QUFDN0IsTUFBSSxDQUFDLFdBQVc7QUFDZCxVQUFNLElBQUksTUFBTSw2QkFBNkI7QUFBQSxFQUMvQztBQUVBLE1BQUk7QUFDRixRQUFJO0FBQ0osUUFBSSxRQUFRLFNBQVMsUUFBUTtBQUMzQixZQUFNLGVBQWUsTUFBTSxVQUFVLGlCQUFpQixDQUFDLFFBQVEsSUFBSSxDQUFDO0FBRXBFLFVBQUksYUFBYSxRQUFRLE9BQU87QUFDOUIsY0FBTSxRQUFRLE9BQU8sdUJBQXVCLG1CQUFtQjtBQUFBLFVBQzdELEtBQUssYUFBYSxRQUFRLFNBQVM7QUFBQSxVQUNuQyxNQUFNLFFBQVE7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWLENBQUM7QUFDRCx5QkFBaUIsT0FBTztBQUFBLE1BQzFCO0FBQUEsSUFDRixPQUFPO0FBQ0wsWUFBTSxnQkFBZ0IsTUFBTSxpQkFBaUIsUUFBUSxRQUFRO0FBQzdELFVBQUksZUFBZTtBQUNqQixjQUFNLFFBQVEsT0FBTyx1QkFBdUIsZUFBZTtBQUFBLFVBQ3pELE1BQU0sY0FBYztBQUFBLFFBQ3RCLENBQUM7QUFFRCx3Q0FBYSxPQUFPLHdDQUF3QztBQUU1RCx5QkFBaUIsTUFBTTtBQUV2QixjQUFNLElBQUksRUFBRSxVQUFVLGNBQWMsU0FBUyxDQUFDO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBRUEsUUFBSSxDQUFDLGdCQUFnQjtBQUNuQiw0QkFDRSxRQUFRLFNBQVMsYUFDYixVQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLFFBQVE7QUFBQSxNQUN2QixDQUNOO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFFQSxXQUFPO0FBQUEsRUFDVCxTQUFTLE9BQVA7QUFDQSxRQUFJLE1BQ0YsbUVBQ0EsT0FBTyxZQUFZLEtBQUssQ0FDMUI7QUFFQSxRQUFJLFFBQVEsU0FBUyxRQUFRO0FBQzNCLHNDQUFVLGtFQUE2QjtBQUFBLElBQ3pDLE9BQU87QUFDTCxzQ0FBVSw0REFBMEI7QUFBQSxJQUN0QztBQUVBLFdBQU87QUFBQSxFQUNULFVBQUU7QUFDQSxzQkFBa0IsWUFBWSxLQUFLO0FBQUEsRUFDckM7QUFDRjtBQWhGc0IsQUFrRnRCLGdDQUNFLFVBQ3dDO0FBQ3hDLE1BQUksQ0FBQyxxQ0FBZ0IsUUFBUSxHQUFHO0FBQzlCLFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxFQUFFLGNBQWMsT0FBTztBQUM3QixNQUFJLENBQUMsV0FBVztBQUNkLFVBQU0sSUFBSSxNQUFNLDZCQUE2QjtBQUFBLEVBQy9DO0FBRUEsTUFBSTtBQUNGLFVBQU0sVUFBVSxNQUFNLFVBQVUsc0JBQXNCLFFBQVE7QUFFOUQsUUFBSSxDQUFDLFFBQVEsTUFBTTtBQUNqQixVQUFJLE1BQU0sMERBQTBEO0FBQ3BFO0FBQUEsSUFDRjtBQUVBLFdBQU87QUFBQSxNQUNMLE1BQU0saUJBQUssS0FBSyxRQUFRLElBQUk7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGLFNBQVMsT0FBUDtBQUNBLFFBQUksQ0FBRSxrQkFBaUIsMEJBQVk7QUFDakMsWUFBTTtBQUFBLElBQ1I7QUFFQSxRQUFJLE1BQU0sU0FBUyxLQUFLO0FBQ3RCLGFBQU87QUFBQSxJQUNUO0FBRUEsVUFBTTtBQUFBLEVBQ1I7QUFDRjtBQW5DZSIsCiAgIm5hbWVzIjogW10KfQo=
