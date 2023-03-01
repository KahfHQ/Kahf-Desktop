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
var StoriesSettingsModal_exports = {};
__export(StoriesSettingsModal_exports, {
  SmartStoriesSettingsModal: () => SmartStoriesSettingsModal
});
module.exports = __toCommonJS(StoriesSettingsModal_exports);
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_StoriesSettingsModal = require("../../components/StoriesSettingsModal");
var import_conversations = require("../selectors/conversations");
var import_storyDistributionLists = require("../selectors/storyDistributionLists");
var import_user = require("../selectors/user");
var import_badges = require("../selectors/badges");
var import_globalModals = require("../ducks/globalModals");
var import_storyDistributionLists2 = require("../ducks/storyDistributionLists");
function SmartStoriesSettingsModal() {
  const { hideStoriesSettings, toggleSignalConnectionsModal } = (0, import_globalModals.useGlobalModalActions)();
  const {
    allowsRepliesChanged,
    createDistributionList,
    deleteDistributionList,
    hideMyStoriesFrom,
    removeMemberFromDistributionList,
    setMyStoriesToAllSignalConnections,
    updateStoryViewers
  } = (0, import_storyDistributionLists2.useStoryDistributionListsActions)();
  const getPreferredBadge = (0, import_react_redux.useSelector)(import_badges.getPreferredBadgeSelector);
  const i18n = (0, import_react_redux.useSelector)(import_user.getIntl);
  const me = (0, import_react_redux.useSelector)(import_conversations.getMe);
  const candidateConversations = (0, import_react_redux.useSelector)(import_conversations.getCandidateContactsForNewGroup);
  const distributionLists = (0, import_react_redux.useSelector)(import_storyDistributionLists.getDistributionListsWithMembers);
  return /* @__PURE__ */ import_react.default.createElement(import_StoriesSettingsModal.StoriesSettingsModal, {
    candidateConversations,
    distributionLists,
    hideStoriesSettings,
    getPreferredBadge,
    i18n,
    me,
    onDeleteList: deleteDistributionList,
    onDistributionListCreated: createDistributionList,
    onHideMyStoriesFrom: hideMyStoriesFrom,
    onRemoveMember: removeMemberFromDistributionList,
    onRepliesNReactionsChanged: allowsRepliesChanged,
    onViewersUpdated: updateStoryViewers,
    setMyStoriesToAllSignalConnections,
    toggleSignalConnectionsModal
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartStoriesSettingsModal
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllc1NldHRpbmdzTW9kYWwudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTZWxlY3RvciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuaW1wb3J0IHR5cGUgeyBMb2NhbGl6ZXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSB9IGZyb20gJy4uL3JlZHVjZXInO1xuaW1wb3J0IHsgU3Rvcmllc1NldHRpbmdzTW9kYWwgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1N0b3JpZXNTZXR0aW5nc01vZGFsJztcbmltcG9ydCB7XG4gIGdldENhbmRpZGF0ZUNvbnRhY3RzRm9yTmV3R3JvdXAsXG4gIGdldE1lLFxufSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQgeyBnZXREaXN0cmlidXRpb25MaXN0c1dpdGhNZW1iZXJzIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuaW1wb3J0IHsgZ2V0SW50bCB9IGZyb20gJy4uL3NlbGVjdG9ycy91c2VyJztcbmltcG9ydCB7IGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3IgfSBmcm9tICcuLi9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB7IHVzZUdsb2JhbE1vZGFsQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL2dsb2JhbE1vZGFscyc7XG5pbXBvcnQgeyB1c2VTdG9yeURpc3RyaWJ1dGlvbkxpc3RzQWN0aW9ucyB9IGZyb20gJy4uL2R1Y2tzL3N0b3J5RGlzdHJpYnV0aW9uTGlzdHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gU21hcnRTdG9yaWVzU2V0dGluZ3NNb2RhbCgpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCB7IGhpZGVTdG9yaWVzU2V0dGluZ3MsIHRvZ2dsZVNpZ25hbENvbm5lY3Rpb25zTW9kYWwgfSA9XG4gICAgdXNlR2xvYmFsTW9kYWxBY3Rpb25zKCk7XG4gIGNvbnN0IHtcbiAgICBhbGxvd3NSZXBsaWVzQ2hhbmdlZCxcbiAgICBjcmVhdGVEaXN0cmlidXRpb25MaXN0LFxuICAgIGRlbGV0ZURpc3RyaWJ1dGlvbkxpc3QsXG4gICAgaGlkZU15U3Rvcmllc0Zyb20sXG4gICAgcmVtb3ZlTWVtYmVyRnJvbURpc3RyaWJ1dGlvbkxpc3QsXG4gICAgc2V0TXlTdG9yaWVzVG9BbGxTaWduYWxDb25uZWN0aW9ucyxcbiAgICB1cGRhdGVTdG9yeVZpZXdlcnMsXG4gIH0gPSB1c2VTdG9yeURpc3RyaWJ1dGlvbkxpc3RzQWN0aW9ucygpO1xuXG4gIGNvbnN0IGdldFByZWZlcnJlZEJhZGdlID0gdXNlU2VsZWN0b3IoZ2V0UHJlZmVycmVkQmFkZ2VTZWxlY3Rvcik7XG4gIGNvbnN0IGkxOG4gPSB1c2VTZWxlY3RvcjxTdGF0ZVR5cGUsIExvY2FsaXplclR5cGU+KGdldEludGwpO1xuICBjb25zdCBtZSA9IHVzZVNlbGVjdG9yKGdldE1lKTtcblxuICBjb25zdCBjYW5kaWRhdGVDb252ZXJzYXRpb25zID0gdXNlU2VsZWN0b3IoZ2V0Q2FuZGlkYXRlQ29udGFjdHNGb3JOZXdHcm91cCk7XG4gIGNvbnN0IGRpc3RyaWJ1dGlvbkxpc3RzID0gdXNlU2VsZWN0b3IoZ2V0RGlzdHJpYnV0aW9uTGlzdHNXaXRoTWVtYmVycyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3Rvcmllc1NldHRpbmdzTW9kYWxcbiAgICAgIGNhbmRpZGF0ZUNvbnZlcnNhdGlvbnM9e2NhbmRpZGF0ZUNvbnZlcnNhdGlvbnN9XG4gICAgICBkaXN0cmlidXRpb25MaXN0cz17ZGlzdHJpYnV0aW9uTGlzdHN9XG4gICAgICBoaWRlU3Rvcmllc1NldHRpbmdzPXtoaWRlU3Rvcmllc1NldHRpbmdzfVxuICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgaTE4bj17aTE4bn1cbiAgICAgIG1lPXttZX1cbiAgICAgIG9uRGVsZXRlTGlzdD17ZGVsZXRlRGlzdHJpYnV0aW9uTGlzdH1cbiAgICAgIG9uRGlzdHJpYnV0aW9uTGlzdENyZWF0ZWQ9e2NyZWF0ZURpc3RyaWJ1dGlvbkxpc3R9XG4gICAgICBvbkhpZGVNeVN0b3JpZXNGcm9tPXtoaWRlTXlTdG9yaWVzRnJvbX1cbiAgICAgIG9uUmVtb3ZlTWVtYmVyPXtyZW1vdmVNZW1iZXJGcm9tRGlzdHJpYnV0aW9uTGlzdH1cbiAgICAgIG9uUmVwbGllc05SZWFjdGlvbnNDaGFuZ2VkPXthbGxvd3NSZXBsaWVzQ2hhbmdlZH1cbiAgICAgIG9uVmlld2Vyc1VwZGF0ZWQ9e3VwZGF0ZVN0b3J5Vmlld2Vyc31cbiAgICAgIHNldE15U3Rvcmllc1RvQWxsU2lnbmFsQ29ubmVjdGlvbnM9e3NldE15U3Rvcmllc1RvQWxsU2lnbmFsQ29ubmVjdGlvbnN9XG4gICAgICB0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsPXt0b2dnbGVTaWduYWxDb25uZWN0aW9uc01vZGFsfVxuICAgIC8+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQWtCO0FBQ2xCLHlCQUE0QjtBQUk1QixrQ0FBcUM7QUFDckMsMkJBR087QUFDUCxvQ0FBZ0Q7QUFDaEQsa0JBQXdCO0FBQ3hCLG9CQUEwQztBQUMxQywwQkFBc0M7QUFDdEMscUNBQWlEO0FBRTFDLHFDQUF5RDtBQUM5RCxRQUFNLEVBQUUscUJBQXFCLGlDQUMzQiwrQ0FBc0I7QUFDeEIsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxNQUNFLHFFQUFpQztBQUVyQyxRQUFNLG9CQUFvQixvQ0FBWSx1Q0FBeUI7QUFDL0QsUUFBTSxPQUFPLG9DQUFzQyxtQkFBTztBQUMxRCxRQUFNLEtBQUssb0NBQVksMEJBQUs7QUFFNUIsUUFBTSx5QkFBeUIsb0NBQVksb0RBQStCO0FBQzFFLFFBQU0sb0JBQW9CLG9DQUFZLDZEQUErQjtBQUVyRSxTQUNFLG1EQUFDO0FBQUEsSUFDQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxjQUFjO0FBQUEsSUFDZCwyQkFBMkI7QUFBQSxJQUMzQixxQkFBcUI7QUFBQSxJQUNyQixnQkFBZ0I7QUFBQSxJQUNoQiw0QkFBNEI7QUFBQSxJQUM1QixrQkFBa0I7QUFBQSxJQUNsQjtBQUFBLElBQ0E7QUFBQSxHQUNGO0FBRUo7QUF0Q2dCIiwKICAibmFtZXMiOiBbXQp9Cg==
