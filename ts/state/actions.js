var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var actions_exports = {};
__export(actions_exports, {
  actionCreators: () => actionCreators,
  mapDispatchToProps: () => mapDispatchToProps
});
module.exports = __toCommonJS(actions_exports);
var import_accounts = require("./ducks/accounts");
var import_app = require("./ducks/app");
var import_audioPlayer = require("./ducks/audioPlayer");
var import_audioRecorder = require("./ducks/audioRecorder");
var import_badges = require("./ducks/badges");
var import_calling = require("./ducks/calling");
var import_composer = require("./ducks/composer");
var import_conversations = require("./ducks/conversations");
var import_crashReports = require("./ducks/crashReports");
var import_emojis = require("./ducks/emojis");
var import_expiration = require("./ducks/expiration");
var import_globalModals = require("./ducks/globalModals");
var import_items = require("./ducks/items");
var import_linkPreviews = require("./ducks/linkPreviews");
var import_network = require("./ducks/network");
var import_safetyNumber = require("./ducks/safetyNumber");
var import_search = require("./ducks/search");
var import_stickers = require("./ducks/stickers");
var import_stories = require("./ducks/stories");
var import_storyDistributionLists = require("./ducks/storyDistributionLists");
var import_toast = require("./ducks/toast");
var import_updates = require("./ducks/updates");
var import_user = require("./ducks/user");
const actionCreators = {
  accounts: import_accounts.actions,
  app: import_app.actions,
  audioPlayer: import_audioPlayer.actions,
  audioRecorder: import_audioRecorder.actions,
  badges: import_badges.actions,
  calling: import_calling.actions,
  composer: import_composer.actions,
  conversations: import_conversations.actions,
  crashReports: import_crashReports.actions,
  emojis: import_emojis.actions,
  expiration: import_expiration.actions,
  globalModals: import_globalModals.actions,
  items: import_items.actions,
  linkPreviews: import_linkPreviews.actions,
  network: import_network.actions,
  safetyNumber: import_safetyNumber.actions,
  search: import_search.actions,
  stickers: import_stickers.actions,
  stories: import_stories.actions,
  storyDistributionLists: import_storyDistributionLists.actions,
  toast: import_toast.actions,
  updates: import_updates.actions,
  user: import_user.actions
};
const mapDispatchToProps = {
  ...import_accounts.actions,
  ...import_app.actions,
  ...import_audioPlayer.actions,
  ...import_audioRecorder.actions,
  ...import_badges.actions,
  ...import_calling.actions,
  ...import_composer.actions,
  ...import_conversations.actions,
  ...import_crashReports.actions,
  ...import_emojis.actions,
  ...import_expiration.actions,
  ...import_globalModals.actions,
  ...import_items.actions,
  ...import_linkPreviews.actions,
  ...import_network.actions,
  ...import_safetyNumber.actions,
  ...import_search.actions,
  ...import_stickers.actions,
  ...import_stories.actions,
  ...import_storyDistributionLists.actions,
  ...import_toast.actions,
  ...import_updates.actions,
  ...import_user.actions
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actionCreators,
  mapDispatchToProps
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWN0aW9ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMTktMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFjdGlvbnMgYXMgYWNjb3VudHMgfSBmcm9tICcuL2R1Y2tzL2FjY291bnRzJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgYXBwIH0gZnJvbSAnLi9kdWNrcy9hcHAnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBhdWRpb1BsYXllciB9IGZyb20gJy4vZHVja3MvYXVkaW9QbGF5ZXInO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBhdWRpb1JlY29yZGVyIH0gZnJvbSAnLi9kdWNrcy9hdWRpb1JlY29yZGVyJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgYmFkZ2VzIH0gZnJvbSAnLi9kdWNrcy9iYWRnZXMnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBjYWxsaW5nIH0gZnJvbSAnLi9kdWNrcy9jYWxsaW5nJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgY29tcG9zZXIgfSBmcm9tICcuL2R1Y2tzL2NvbXBvc2VyJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgY29udmVyc2F0aW9ucyB9IGZyb20gJy4vZHVja3MvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBhY3Rpb25zIGFzIGNyYXNoUmVwb3J0cyB9IGZyb20gJy4vZHVja3MvY3Jhc2hSZXBvcnRzJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgZW1vamlzIH0gZnJvbSAnLi9kdWNrcy9lbW9qaXMnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBleHBpcmF0aW9uIH0gZnJvbSAnLi9kdWNrcy9leHBpcmF0aW9uJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgZ2xvYmFsTW9kYWxzIH0gZnJvbSAnLi9kdWNrcy9nbG9iYWxNb2RhbHMnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBpdGVtcyB9IGZyb20gJy4vZHVja3MvaXRlbXMnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBsaW5rUHJldmlld3MgfSBmcm9tICcuL2R1Y2tzL2xpbmtQcmV2aWV3cyc7XG5pbXBvcnQgeyBhY3Rpb25zIGFzIG5ldHdvcmsgfSBmcm9tICcuL2R1Y2tzL25ldHdvcmsnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyBzYWZldHlOdW1iZXIgfSBmcm9tICcuL2R1Y2tzL3NhZmV0eU51bWJlcic7XG5pbXBvcnQgeyBhY3Rpb25zIGFzIHNlYXJjaCB9IGZyb20gJy4vZHVja3Mvc2VhcmNoJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgc3RpY2tlcnMgfSBmcm9tICcuL2R1Y2tzL3N0aWNrZXJzJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgc3RvcmllcyB9IGZyb20gJy4vZHVja3Mvc3Rvcmllcyc7XG5pbXBvcnQgeyBhY3Rpb25zIGFzIHN0b3J5RGlzdHJpYnV0aW9uTGlzdHMgfSBmcm9tICcuL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyB0b2FzdCB9IGZyb20gJy4vZHVja3MvdG9hc3QnO1xuaW1wb3J0IHsgYWN0aW9ucyBhcyB1cGRhdGVzIH0gZnJvbSAnLi9kdWNrcy91cGRhdGVzJztcbmltcG9ydCB7IGFjdGlvbnMgYXMgdXNlciB9IGZyb20gJy4vZHVja3MvdXNlcic7XG5pbXBvcnQgdHlwZSB7IFJlZHV4QWN0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgYWN0aW9uQ3JlYXRvcnM6IFJlZHV4QWN0aW9ucyA9IHtcbiAgYWNjb3VudHMsXG4gIGFwcCxcbiAgYXVkaW9QbGF5ZXIsXG4gIGF1ZGlvUmVjb3JkZXIsXG4gIGJhZGdlcyxcbiAgY2FsbGluZyxcbiAgY29tcG9zZXIsXG4gIGNvbnZlcnNhdGlvbnMsXG4gIGNyYXNoUmVwb3J0cyxcbiAgZW1vamlzLFxuICBleHBpcmF0aW9uLFxuICBnbG9iYWxNb2RhbHMsXG4gIGl0ZW1zLFxuICBsaW5rUHJldmlld3MsXG4gIG5ldHdvcmssXG4gIHNhZmV0eU51bWJlcixcbiAgc2VhcmNoLFxuICBzdGlja2VycyxcbiAgc3RvcmllcyxcbiAgc3RvcnlEaXN0cmlidXRpb25MaXN0cyxcbiAgdG9hc3QsXG4gIHVwZGF0ZXMsXG4gIHVzZXIsXG59O1xuXG5leHBvcnQgY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0ge1xuICAuLi5hY2NvdW50cyxcbiAgLi4uYXBwLFxuICAuLi5hdWRpb1BsYXllcixcbiAgLi4uYXVkaW9SZWNvcmRlcixcbiAgLi4uYmFkZ2VzLFxuICAuLi5jYWxsaW5nLFxuICAuLi5jb21wb3NlcixcbiAgLi4uY29udmVyc2F0aW9ucyxcbiAgLi4uY3Jhc2hSZXBvcnRzLFxuICAuLi5lbW9qaXMsXG4gIC4uLmV4cGlyYXRpb24sXG4gIC4uLmdsb2JhbE1vZGFscyxcbiAgLi4uaXRlbXMsXG4gIC4uLmxpbmtQcmV2aWV3cyxcbiAgLi4ubmV0d29yayxcbiAgLi4uc2FmZXR5TnVtYmVyLFxuICAuLi5zZWFyY2gsXG4gIC4uLnN0aWNrZXJzLFxuICAuLi5zdG9yaWVzLFxuICAuLi5zdG9yeURpc3RyaWJ1dGlvbkxpc3RzLFxuICAuLi50b2FzdCxcbiAgLi4udXBkYXRlcyxcbiAgLi4udXNlcixcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHNCQUFvQztBQUNwQyxpQkFBK0I7QUFDL0IseUJBQXVDO0FBQ3ZDLDJCQUF5QztBQUN6QyxvQkFBa0M7QUFDbEMscUJBQW1DO0FBQ25DLHNCQUFvQztBQUNwQywyQkFBeUM7QUFDekMsMEJBQXdDO0FBQ3hDLG9CQUFrQztBQUNsQyx3QkFBc0M7QUFDdEMsMEJBQXdDO0FBQ3hDLG1CQUFpQztBQUNqQywwQkFBd0M7QUFDeEMscUJBQW1DO0FBQ25DLDBCQUF3QztBQUN4QyxvQkFBa0M7QUFDbEMsc0JBQW9DO0FBQ3BDLHFCQUFtQztBQUNuQyxvQ0FBa0Q7QUFDbEQsbUJBQWlDO0FBQ2pDLHFCQUFtQztBQUNuQyxrQkFBZ0M7QUFHekIsTUFBTSxpQkFBK0I7QUFBQSxFQUMxQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUVPLE1BQU0scUJBQXFCO0FBQUEsS0FDN0I7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQUEsS0FDQTtBQUFBLEtBQ0E7QUFBQSxLQUNBO0FBQ0w7IiwKICAibmFtZXMiOiBbXQp9Cg==
