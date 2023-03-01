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
var MainHeader_exports = {};
__export(MainHeader_exports, {
  SmartMainHeader: () => SmartMainHeader
});
module.exports = __toCommonJS(MainHeader_exports);
var import_react_redux = require("react-redux");
var import_actions = require("../actions");
var import_MainHeader = require("../../components/MainHeader");
var import_badges = require("../selectors/badges");
var import_user = require("../selectors/user");
var import_conversations = require("../selectors/conversations");
var import_items = require("../selectors/items");
var import_stories = require("../selectors/stories");
const mapStateToProps = /* @__PURE__ */ __name((state) => {
  const me = (0, import_conversations.getMe)(state);
  return {
    areStoriesEnabled: (0, import_items.getStoriesEnabled)(state),
    hasPendingUpdate: Boolean(state.updates.didSnooze),
    regionCode: (0, import_user.getRegionCode)(state),
    ourConversationId: (0, import_user.getUserConversationId)(state),
    ourNumber: (0, import_user.getUserNumber)(state),
    ...me,
    badge: (0, import_badges.getPreferredBadgeSelector)(state)(me.badges),
    theme: (0, import_user.getTheme)(state),
    i18n: (0, import_user.getIntl)(state),
    unreadStoriesCount: (0, import_stories.getUnreadStorySenderCount)(state)
  };
}, "mapStateToProps");
const smart = (0, import_react_redux.connect)(mapStateToProps, import_actions.mapDispatchToProps);
const SmartMainHeader = smart(import_MainHeader.MainHeader);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartMainHeader
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiTWFpbkhlYWRlci50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDE5LTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgbWFwRGlzcGF0Y2hUb1Byb3BzIH0gZnJvbSAnLi4vYWN0aW9ucyc7XG5cbmltcG9ydCB7IE1haW5IZWFkZXIgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL01haW5IZWFkZXInO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcblxuaW1wb3J0IHsgZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9iYWRnZXMnO1xuaW1wb3J0IHtcbiAgZ2V0SW50bCxcbiAgZ2V0UmVnaW9uQ29kZSxcbiAgZ2V0VGhlbWUsXG4gIGdldFVzZXJDb252ZXJzYXRpb25JZCxcbiAgZ2V0VXNlck51bWJlcixcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgZ2V0TWUgfSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRTdG9yaWVzRW5hYmxlZCB9IGZyb20gJy4uL3NlbGVjdG9ycy9pdGVtcyc7XG5pbXBvcnQgeyBnZXRVbnJlYWRTdG9yeVNlbmRlckNvdW50IH0gZnJvbSAnLi4vc2VsZWN0b3JzL3N0b3JpZXMnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGU6IFN0YXRlVHlwZSkgPT4ge1xuICBjb25zdCBtZSA9IGdldE1lKHN0YXRlKTtcblxuICByZXR1cm4ge1xuICAgIGFyZVN0b3JpZXNFbmFibGVkOiBnZXRTdG9yaWVzRW5hYmxlZChzdGF0ZSksXG4gICAgaGFzUGVuZGluZ1VwZGF0ZTogQm9vbGVhbihzdGF0ZS51cGRhdGVzLmRpZFNub296ZSksXG4gICAgcmVnaW9uQ29kZTogZ2V0UmVnaW9uQ29kZShzdGF0ZSksXG4gICAgb3VyQ29udmVyc2F0aW9uSWQ6IGdldFVzZXJDb252ZXJzYXRpb25JZChzdGF0ZSksXG4gICAgb3VyTnVtYmVyOiBnZXRVc2VyTnVtYmVyKHN0YXRlKSxcbiAgICAuLi5tZSxcbiAgICBiYWRnZTogZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3RvcihzdGF0ZSkobWUuYmFkZ2VzKSxcbiAgICB0aGVtZTogZ2V0VGhlbWUoc3RhdGUpLFxuICAgIGkxOG46IGdldEludGwoc3RhdGUpLFxuICAgIHVucmVhZFN0b3JpZXNDb3VudDogZ2V0VW5yZWFkU3RvcnlTZW5kZXJDb3VudChzdGF0ZSksXG4gIH07XG59O1xuXG5jb25zdCBzbWFydCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpO1xuXG5leHBvcnQgY29uc3QgU21hcnRNYWluSGVhZGVyID0gc21hcnQoTWFpbkhlYWRlcik7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EseUJBQXdCO0FBQ3hCLHFCQUFtQztBQUVuQyx3QkFBMkI7QUFHM0Isb0JBQTBDO0FBQzFDLGtCQU1PO0FBQ1AsMkJBQXNCO0FBQ3RCLG1CQUFrQztBQUNsQyxxQkFBMEM7QUFFMUMsTUFBTSxrQkFBa0Isd0JBQUMsVUFBcUI7QUFDNUMsUUFBTSxLQUFLLGdDQUFNLEtBQUs7QUFFdEIsU0FBTztBQUFBLElBQ0wsbUJBQW1CLG9DQUFrQixLQUFLO0FBQUEsSUFDMUMsa0JBQWtCLFFBQVEsTUFBTSxRQUFRLFNBQVM7QUFBQSxJQUNqRCxZQUFZLCtCQUFjLEtBQUs7QUFBQSxJQUMvQixtQkFBbUIsdUNBQXNCLEtBQUs7QUFBQSxJQUM5QyxXQUFXLCtCQUFjLEtBQUs7QUFBQSxPQUMzQjtBQUFBLElBQ0gsT0FBTyw2Q0FBMEIsS0FBSyxFQUFFLEdBQUcsTUFBTTtBQUFBLElBQ2pELE9BQU8sMEJBQVMsS0FBSztBQUFBLElBQ3JCLE1BQU0seUJBQVEsS0FBSztBQUFBLElBQ25CLG9CQUFvQiw4Q0FBMEIsS0FBSztBQUFBLEVBQ3JEO0FBQ0YsR0Fmd0I7QUFpQnhCLE1BQU0sUUFBUSxnQ0FBUSxpQkFBaUIsaUNBQWtCO0FBRWxELE1BQU0sa0JBQWtCLE1BQU0sNEJBQVU7IiwKICAibmFtZXMiOiBbXQp9Cg==
