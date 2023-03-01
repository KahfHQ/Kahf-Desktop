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
var getInitialState_exports = {};
__export(getInitialState_exports, {
  getInitialState: () => getInitialState
});
module.exports = __toCommonJS(getInitialState_exports);
var import_accounts = require("./ducks/accounts");
var import_app = require("./ducks/app");
var import_audioPlayer = require("./ducks/audioPlayer");
var import_audioRecorder = require("./ducks/audioRecorder");
var import_calling = require("./ducks/calling");
var import_composer = require("./ducks/composer");
var import_conversations = require("./ducks/conversations");
var import_crashReports = require("./ducks/crashReports");
var import_expiration = require("./ducks/expiration");
var import_globalModals = require("./ducks/globalModals");
var import_linkPreviews = require("./ducks/linkPreviews");
var import_network = require("./ducks/network");
var import_preferredReactions = require("./ducks/preferredReactions");
var import_safetyNumber = require("./ducks/safetyNumber");
var import_search = require("./ducks/search");
var import_stories = require("./ducks/stories");
var import_storyDistributionLists = require("./ducks/storyDistributionLists");
var import_toast = require("./ducks/toast");
var import_updates = require("./ducks/updates");
var import_user = require("./ducks/user");
var import_Stickers = require("../types/Stickers");
var import_UUID = require("../types/UUID");
var import_loadRecentEmojis = require("../util/loadRecentEmojis");
var import_getThemeType = require("../util/getThemeType");
function getInitialState({
  badges,
  stories,
  storyDistributionLists,
  mainWindowStats,
  menuOptions
}) {
  const items = window.storage.getItemsState();
  const convoCollection = window.getConversations();
  const formattedConversations = convoCollection.map((conversation) => conversation.format());
  const ourNumber = window.textsecure.storage.user.getNumber();
  const ourACI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI)?.toString();
  const ourPNI = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.PNI)?.toString();
  const ourConversationId = window.ConversationController.getOurConversationId();
  const ourDeviceId = window.textsecure.storage.user.getDeviceId();
  const theme = (0, import_getThemeType.getThemeType)();
  return {
    accounts: (0, import_accounts.getEmptyState)(),
    app: (0, import_app.getEmptyState)(),
    audioPlayer: (0, import_audioPlayer.getEmptyState)(),
    audioRecorder: (0, import_audioRecorder.getEmptyState)(),
    badges,
    calling: (0, import_calling.getEmptyState)(),
    composer: (0, import_composer.getEmptyState)(),
    conversations: {
      ...(0, import_conversations.getEmptyState)(),
      conversationLookup: window.Signal.Util.makeLookup(formattedConversations, "id"),
      conversationsByE164: window.Signal.Util.makeLookup(formattedConversations, "e164"),
      conversationsByUuid: window.Signal.Util.makeLookup(formattedConversations, "uuid"),
      conversationsByGroupId: window.Signal.Util.makeLookup(formattedConversations, "groupId"),
      conversationsByUsername: window.Signal.Util.makeLookup(formattedConversations, "username")
    },
    crashReports: (0, import_crashReports.getEmptyState)(),
    emojis: (0, import_loadRecentEmojis.getEmojiReducerState)(),
    expiration: (0, import_expiration.getEmptyState)(),
    globalModals: (0, import_globalModals.getEmptyState)(),
    items,
    linkPreviews: (0, import_linkPreviews.getEmptyState)(),
    network: (0, import_network.getEmptyState)(),
    preferredReactions: (0, import_preferredReactions.getEmptyState)(),
    safetyNumber: (0, import_safetyNumber.getEmptyState)(),
    search: (0, import_search.getEmptyState)(),
    stickers: (0, import_Stickers.getInitialState)(),
    stories: {
      ...(0, import_stories.getEmptyState)(),
      stories
    },
    storyDistributionLists: {
      ...(0, import_storyDistributionLists.getEmptyState)(),
      distributionLists: storyDistributionLists || []
    },
    toast: (0, import_toast.getEmptyState)(),
    updates: (0, import_updates.getEmptyState)(),
    user: {
      ...(0, import_user.getEmptyState)(),
      attachmentsPath: window.baseAttachmentsPath,
      stickersPath: window.baseStickersPath,
      tempPath: window.baseTempPath,
      regionCode: window.storage.get("regionCode"),
      ourConversationId,
      ourDeviceId,
      ourNumber,
      ourACI,
      ourPNI,
      platform: window.platform,
      i18n: window.i18n,
      localeMessages: window.SignalContext.localeMessages,
      interactionMode: window.getInteractionMode(),
      theme,
      version: window.getVersion(),
      isMainWindowMaximized: mainWindowStats.isMaximized,
      isMainWindowFullScreen: mainWindowStats.isFullScreen,
      menuOptions
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInitialState
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0SW5pdGlhbFN0YXRlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgYWNjb3VudHMgfSBmcm9tICcuL2R1Y2tzL2FjY291bnRzJztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgYXBwIH0gZnJvbSAnLi9kdWNrcy9hcHAnO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBhdWRpb1BsYXllciB9IGZyb20gJy4vZHVja3MvYXVkaW9QbGF5ZXInO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBhdWRpb1JlY29yZGVyIH0gZnJvbSAnLi9kdWNrcy9hdWRpb1JlY29yZGVyJztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgY2FsbGluZyB9IGZyb20gJy4vZHVja3MvY2FsbGluZyc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIGNvbXBvc2VyIH0gZnJvbSAnLi9kdWNrcy9jb21wb3Nlcic7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIGNvbnZlcnNhdGlvbnMgfSBmcm9tICcuL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBjcmFzaFJlcG9ydHMgfSBmcm9tICcuL2R1Y2tzL2NyYXNoUmVwb3J0cyc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIGV4cGlyYXRpb24gfSBmcm9tICcuL2R1Y2tzL2V4cGlyYXRpb24nO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBnbG9iYWxNb2RhbHMgfSBmcm9tICcuL2R1Y2tzL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIGxpbmtQcmV2aWV3cyB9IGZyb20gJy4vZHVja3MvbGlua1ByZXZpZXdzJztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgbmV0d29yayB9IGZyb20gJy4vZHVja3MvbmV0d29yayc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIHByZWZlcnJlZFJlYWN0aW9ucyB9IGZyb20gJy4vZHVja3MvcHJlZmVycmVkUmVhY3Rpb25zJztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgc2FmZXR5TnVtYmVyIH0gZnJvbSAnLi9kdWNrcy9zYWZldHlOdW1iZXInO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBzZWFyY2ggfSBmcm9tICcuL2R1Y2tzL3NlYXJjaCc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIGdldFN0b3JpZXNFbXB0eVN0YXRlIH0gZnJvbSAnLi9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgZ2V0U3RvcnlEaXN0cmlidXRpb25MaXN0c0VtcHR5U3RhdGUgfSBmcm9tICcuL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgZ2V0RW1wdHlTdGF0ZSBhcyBnZXRUb2FzdEVtcHR5U3RhdGUgfSBmcm9tICcuL2R1Y2tzL3RvYXN0JztcbmltcG9ydCB7IGdldEVtcHR5U3RhdGUgYXMgdXBkYXRlcyB9IGZyb20gJy4vZHVja3MvdXBkYXRlcyc7XG5pbXBvcnQgeyBnZXRFbXB0eVN0YXRlIGFzIHVzZXIgfSBmcm9tICcuL2R1Y2tzL3VzZXInO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSB9IGZyb20gJy4vcmVkdWNlcic7XG5cbmltcG9ydCB0eXBlIHsgQmFkZ2VzU3RhdGVUeXBlIH0gZnJvbSAnLi9kdWNrcy9iYWRnZXMnO1xuaW1wb3J0IHR5cGUgeyBTdG9yeURhdGFUeXBlIH0gZnJvbSAnLi9kdWNrcy9zdG9yaWVzJztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUgfSBmcm9tICcuL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgZ2V0SW5pdGlhbFN0YXRlIGFzIHN0aWNrZXJzIH0gZnJvbSAnLi4vdHlwZXMvU3RpY2tlcnMnO1xuaW1wb3J0IHR5cGUgeyBNZW51T3B0aW9uc1R5cGUgfSBmcm9tICcuLi90eXBlcy9tZW51JztcbmltcG9ydCB7IFVVSURLaW5kIH0gZnJvbSAnLi4vdHlwZXMvVVVJRCc7XG5pbXBvcnQgeyBnZXRFbW9qaVJlZHVjZXJTdGF0ZSBhcyBlbW9qaXMgfSBmcm9tICcuLi91dGlsL2xvYWRSZWNlbnRFbW9qaXMnO1xuaW1wb3J0IHR5cGUgeyBNYWluV2luZG93U3RhdHNUeXBlIH0gZnJvbSAnLi4vd2luZG93cy9jb250ZXh0JztcbmltcG9ydCB7IGdldFRoZW1lVHlwZSB9IGZyb20gJy4uL3V0aWwvZ2V0VGhlbWVUeXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSh7XG4gIGJhZGdlcyxcbiAgc3RvcmllcyxcbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0cyxcbiAgbWFpbldpbmRvd1N0YXRzLFxuICBtZW51T3B0aW9ucyxcbn06IHtcbiAgYmFkZ2VzOiBCYWRnZXNTdGF0ZVR5cGU7XG4gIHN0b3JpZXM6IEFycmF5PFN0b3J5RGF0YVR5cGU+O1xuICBzdG9yeURpc3RyaWJ1dGlvbkxpc3RzOiBBcnJheTxTdG9yeURpc3RyaWJ1dGlvbkxpc3REYXRhVHlwZT47XG4gIG1haW5XaW5kb3dTdGF0czogTWFpbldpbmRvd1N0YXRzVHlwZTtcbiAgbWVudU9wdGlvbnM6IE1lbnVPcHRpb25zVHlwZTtcbn0pOiBTdGF0ZVR5cGUge1xuICBjb25zdCBpdGVtcyA9IHdpbmRvdy5zdG9yYWdlLmdldEl0ZW1zU3RhdGUoKTtcblxuICBjb25zdCBjb252b0NvbGxlY3Rpb24gPSB3aW5kb3cuZ2V0Q29udmVyc2F0aW9ucygpO1xuICBjb25zdCBmb3JtYXR0ZWRDb252ZXJzYXRpb25zID0gY29udm9Db2xsZWN0aW9uLm1hcChjb252ZXJzYXRpb24gPT5cbiAgICBjb252ZXJzYXRpb24uZm9ybWF0KClcbiAgKTtcbiAgY29uc3Qgb3VyTnVtYmVyID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICBjb25zdCBvdXJBQ0kgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAuZ2V0VXVpZChVVUlES2luZC5BQ0kpXG4gICAgPy50b1N0cmluZygpO1xuICBjb25zdCBvdXJQTkkgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXJcbiAgICAuZ2V0VXVpZChVVUlES2luZC5QTkkpXG4gICAgPy50b1N0cmluZygpO1xuICBjb25zdCBvdXJDb252ZXJzYXRpb25JZCA9XG4gICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWQoKTtcbiAgY29uc3Qgb3VyRGV2aWNlSWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0RGV2aWNlSWQoKTtcblxuICBjb25zdCB0aGVtZSA9IGdldFRoZW1lVHlwZSgpO1xuXG4gIHJldHVybiB7XG4gICAgYWNjb3VudHM6IGFjY291bnRzKCksXG4gICAgYXBwOiBhcHAoKSxcbiAgICBhdWRpb1BsYXllcjogYXVkaW9QbGF5ZXIoKSxcbiAgICBhdWRpb1JlY29yZGVyOiBhdWRpb1JlY29yZGVyKCksXG4gICAgYmFkZ2VzLFxuICAgIGNhbGxpbmc6IGNhbGxpbmcoKSxcbiAgICBjb21wb3NlcjogY29tcG9zZXIoKSxcbiAgICBjb252ZXJzYXRpb25zOiB7XG4gICAgICAuLi5jb252ZXJzYXRpb25zKCksXG4gICAgICBjb252ZXJzYXRpb25Mb29rdXA6IHdpbmRvdy5TaWduYWwuVXRpbC5tYWtlTG9va3VwKFxuICAgICAgICBmb3JtYXR0ZWRDb252ZXJzYXRpb25zLFxuICAgICAgICAnaWQnXG4gICAgICApLFxuICAgICAgY29udmVyc2F0aW9uc0J5RTE2NDogd2luZG93LlNpZ25hbC5VdGlsLm1ha2VMb29rdXAoXG4gICAgICAgIGZvcm1hdHRlZENvbnZlcnNhdGlvbnMsXG4gICAgICAgICdlMTY0J1xuICAgICAgKSxcbiAgICAgIGNvbnZlcnNhdGlvbnNCeVV1aWQ6IHdpbmRvdy5TaWduYWwuVXRpbC5tYWtlTG9va3VwKFxuICAgICAgICBmb3JtYXR0ZWRDb252ZXJzYXRpb25zLFxuICAgICAgICAndXVpZCdcbiAgICAgICksXG4gICAgICBjb252ZXJzYXRpb25zQnlHcm91cElkOiB3aW5kb3cuU2lnbmFsLlV0aWwubWFrZUxvb2t1cChcbiAgICAgICAgZm9ybWF0dGVkQ29udmVyc2F0aW9ucyxcbiAgICAgICAgJ2dyb3VwSWQnXG4gICAgICApLFxuICAgICAgY29udmVyc2F0aW9uc0J5VXNlcm5hbWU6IHdpbmRvdy5TaWduYWwuVXRpbC5tYWtlTG9va3VwKFxuICAgICAgICBmb3JtYXR0ZWRDb252ZXJzYXRpb25zLFxuICAgICAgICAndXNlcm5hbWUnXG4gICAgICApLFxuICAgIH0sXG4gICAgY3Jhc2hSZXBvcnRzOiBjcmFzaFJlcG9ydHMoKSxcbiAgICBlbW9qaXM6IGVtb2ppcygpLFxuICAgIGV4cGlyYXRpb246IGV4cGlyYXRpb24oKSxcbiAgICBnbG9iYWxNb2RhbHM6IGdsb2JhbE1vZGFscygpLFxuICAgIGl0ZW1zLFxuICAgIGxpbmtQcmV2aWV3czogbGlua1ByZXZpZXdzKCksXG4gICAgbmV0d29yazogbmV0d29yaygpLFxuICAgIHByZWZlcnJlZFJlYWN0aW9uczogcHJlZmVycmVkUmVhY3Rpb25zKCksXG4gICAgc2FmZXR5TnVtYmVyOiBzYWZldHlOdW1iZXIoKSxcbiAgICBzZWFyY2g6IHNlYXJjaCgpLFxuICAgIHN0aWNrZXJzOiBzdGlja2VycygpLFxuICAgIHN0b3JpZXM6IHtcbiAgICAgIC4uLmdldFN0b3JpZXNFbXB0eVN0YXRlKCksXG4gICAgICBzdG9yaWVzLFxuICAgIH0sXG4gICAgc3RvcnlEaXN0cmlidXRpb25MaXN0czoge1xuICAgICAgLi4uZ2V0U3RvcnlEaXN0cmlidXRpb25MaXN0c0VtcHR5U3RhdGUoKSxcbiAgICAgIGRpc3RyaWJ1dGlvbkxpc3RzOiBzdG9yeURpc3RyaWJ1dGlvbkxpc3RzIHx8IFtdLFxuICAgIH0sXG4gICAgdG9hc3Q6IGdldFRvYXN0RW1wdHlTdGF0ZSgpLFxuICAgIHVwZGF0ZXM6IHVwZGF0ZXMoKSxcbiAgICB1c2VyOiB7XG4gICAgICAuLi51c2VyKCksXG4gICAgICBhdHRhY2htZW50c1BhdGg6IHdpbmRvdy5iYXNlQXR0YWNobWVudHNQYXRoLFxuICAgICAgc3RpY2tlcnNQYXRoOiB3aW5kb3cuYmFzZVN0aWNrZXJzUGF0aCxcbiAgICAgIHRlbXBQYXRoOiB3aW5kb3cuYmFzZVRlbXBQYXRoLFxuICAgICAgcmVnaW9uQ29kZTogd2luZG93LnN0b3JhZ2UuZ2V0KCdyZWdpb25Db2RlJyksXG4gICAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICAgIG91ckRldmljZUlkLFxuICAgICAgb3VyTnVtYmVyLFxuICAgICAgb3VyQUNJLFxuICAgICAgb3VyUE5JLFxuICAgICAgcGxhdGZvcm06IHdpbmRvdy5wbGF0Zm9ybSxcbiAgICAgIGkxOG46IHdpbmRvdy5pMThuLFxuICAgICAgbG9jYWxlTWVzc2FnZXM6IHdpbmRvdy5TaWduYWxDb250ZXh0LmxvY2FsZU1lc3NhZ2VzLFxuICAgICAgaW50ZXJhY3Rpb25Nb2RlOiB3aW5kb3cuZ2V0SW50ZXJhY3Rpb25Nb2RlKCksXG4gICAgICB0aGVtZSxcbiAgICAgIHZlcnNpb246IHdpbmRvdy5nZXRWZXJzaW9uKCksXG4gICAgICBpc01haW5XaW5kb3dNYXhpbWl6ZWQ6IG1haW5XaW5kb3dTdGF0cy5pc01heGltaXplZCxcbiAgICAgIGlzTWFpbldpbmRvd0Z1bGxTY3JlZW46IG1haW5XaW5kb3dTdGF0cy5pc0Z1bGxTY3JlZW4sXG4gICAgICBtZW51T3B0aW9ucyxcbiAgICB9LFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUEwQztBQUMxQyxpQkFBcUM7QUFDckMseUJBQTZDO0FBQzdDLDJCQUErQztBQUMvQyxxQkFBeUM7QUFDekMsc0JBQTBDO0FBQzFDLDJCQUErQztBQUMvQywwQkFBOEM7QUFDOUMsd0JBQTRDO0FBQzVDLDBCQUE4QztBQUM5QywwQkFBOEM7QUFDOUMscUJBQXlDO0FBQ3pDLGdDQUFvRDtBQUNwRCwwQkFBOEM7QUFDOUMsb0JBQXdDO0FBQ3hDLHFCQUFzRDtBQUN0RCxvQ0FBcUU7QUFDckUsbUJBQW9EO0FBQ3BELHFCQUF5QztBQUN6QyxrQkFBc0M7QUFPdEMsc0JBQTRDO0FBRTVDLGtCQUF5QjtBQUN6Qiw4QkFBK0M7QUFFL0MsMEJBQTZCO0FBRXRCLHlCQUF5QjtBQUFBLEVBQzlCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBT1k7QUFDWixRQUFNLFFBQVEsT0FBTyxRQUFRLGNBQWM7QUFFM0MsUUFBTSxrQkFBa0IsT0FBTyxpQkFBaUI7QUFDaEQsUUFBTSx5QkFBeUIsZ0JBQWdCLElBQUksa0JBQ2pELGFBQWEsT0FBTyxDQUN0QjtBQUNBLFFBQU0sWUFBWSxPQUFPLFdBQVcsUUFBUSxLQUFLLFVBQVU7QUFDM0QsUUFBTSxTQUFTLE9BQU8sV0FBVyxRQUFRLEtBQ3RDLFFBQVEscUJBQVMsR0FBRyxHQUNuQixTQUFTO0FBQ2IsUUFBTSxTQUFTLE9BQU8sV0FBVyxRQUFRLEtBQ3RDLFFBQVEscUJBQVMsR0FBRyxHQUNuQixTQUFTO0FBQ2IsUUFBTSxvQkFDSixPQUFPLHVCQUF1QixxQkFBcUI7QUFDckQsUUFBTSxjQUFjLE9BQU8sV0FBVyxRQUFRLEtBQUssWUFBWTtBQUUvRCxRQUFNLFFBQVEsc0NBQWE7QUFFM0IsU0FBTztBQUFBLElBQ0wsVUFBVSxtQ0FBUztBQUFBLElBQ25CLEtBQUssOEJBQUk7QUFBQSxJQUNULGFBQWEsc0NBQVk7QUFBQSxJQUN6QixlQUFlLHdDQUFjO0FBQUEsSUFDN0I7QUFBQSxJQUNBLFNBQVMsa0NBQVE7QUFBQSxJQUNqQixVQUFVLG1DQUFTO0FBQUEsSUFDbkIsZUFBZTtBQUFBLFNBQ1Ysd0NBQWM7QUFBQSxNQUNqQixvQkFBb0IsT0FBTyxPQUFPLEtBQUssV0FDckMsd0JBQ0EsSUFDRjtBQUFBLE1BQ0EscUJBQXFCLE9BQU8sT0FBTyxLQUFLLFdBQ3RDLHdCQUNBLE1BQ0Y7QUFBQSxNQUNBLHFCQUFxQixPQUFPLE9BQU8sS0FBSyxXQUN0Qyx3QkFDQSxNQUNGO0FBQUEsTUFDQSx3QkFBd0IsT0FBTyxPQUFPLEtBQUssV0FDekMsd0JBQ0EsU0FDRjtBQUFBLE1BQ0EseUJBQXlCLE9BQU8sT0FBTyxLQUFLLFdBQzFDLHdCQUNBLFVBQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxjQUFjLHVDQUFhO0FBQUEsSUFDM0IsUUFBUSxrREFBTztBQUFBLElBQ2YsWUFBWSxxQ0FBVztBQUFBLElBQ3ZCLGNBQWMsdUNBQWE7QUFBQSxJQUMzQjtBQUFBLElBQ0EsY0FBYyx1Q0FBYTtBQUFBLElBQzNCLFNBQVMsa0NBQVE7QUFBQSxJQUNqQixvQkFBb0IsNkNBQW1CO0FBQUEsSUFDdkMsY0FBYyx1Q0FBYTtBQUFBLElBQzNCLFFBQVEsaUNBQU87QUFBQSxJQUNmLFVBQVUscUNBQVM7QUFBQSxJQUNuQixTQUFTO0FBQUEsU0FDSixrQ0FBcUI7QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHdCQUF3QjtBQUFBLFNBQ25CLGlEQUFvQztBQUFBLE1BQ3ZDLG1CQUFtQiwwQkFBMEIsQ0FBQztBQUFBLElBQ2hEO0FBQUEsSUFDQSxPQUFPLGdDQUFtQjtBQUFBLElBQzFCLFNBQVMsa0NBQVE7QUFBQSxJQUNqQixNQUFNO0FBQUEsU0FDRCwrQkFBSztBQUFBLE1BQ1IsaUJBQWlCLE9BQU87QUFBQSxNQUN4QixjQUFjLE9BQU87QUFBQSxNQUNyQixVQUFVLE9BQU87QUFBQSxNQUNqQixZQUFZLE9BQU8sUUFBUSxJQUFJLFlBQVk7QUFBQSxNQUMzQztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVUsT0FBTztBQUFBLE1BQ2pCLE1BQU0sT0FBTztBQUFBLE1BQ2IsZ0JBQWdCLE9BQU8sY0FBYztBQUFBLE1BQ3JDLGlCQUFpQixPQUFPLG1CQUFtQjtBQUFBLE1BQzNDO0FBQUEsTUFDQSxTQUFTLE9BQU8sV0FBVztBQUFBLE1BQzNCLHVCQUF1QixnQkFBZ0I7QUFBQSxNQUN2Qyx3QkFBd0IsZ0JBQWdCO0FBQUEsTUFDeEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBMUdnQiIsCiAgIm5hbWVzIjogW10KfQo=
