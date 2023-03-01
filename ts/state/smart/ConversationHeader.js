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
var ConversationHeader_exports = {};
__export(ConversationHeader_exports, {
  SmartConversationHeader: () => SmartConversationHeader
});
module.exports = __toCommonJS(ConversationHeader_exports);
var import_react_redux = require("react-redux");
var import_lodash = require("lodash");
var import_ConversationHeader = require("../../components/conversation/ConversationHeader");
var import_badges = require("../selectors/badges");
var import_conversations = require("../selectors/conversations");
var import_Calling = require("../../types/Calling");
var import_calling = require("../ducks/calling");
var import_conversations2 = require("../ducks/conversations");
var import_stories = require("../selectors/stories");
var import_getOwn = require("../../util/getOwn");
var import_user = require("../selectors/user");
var import_isConversationSMSOnly = require("../../util/isConversationSMSOnly");
var import_actions = require("../actions");
var import_missingCaseError = require("../../util/missingCaseError");
var import_assert = require("../../util/assert");
const getOutgoingCallButtonStyle = /* @__PURE__ */ __name((conversation, state) => {
  const { calling } = state;
  const ourACI = (0, import_user.getUserACI)(state);
  (0, import_assert.strictAssert)(ourACI, "getOutgoingCallButtonStyle missing our uuid");
  if ((0, import_calling.getActiveCall)(calling)) {
    return import_ConversationHeader.OutgoingCallButtonStyle.None;
  }
  const conversationCallMode = (0, import_conversations2.getConversationCallMode)(conversation);
  switch (conversationCallMode) {
    case import_Calling.CallMode.None:
      return import_ConversationHeader.OutgoingCallButtonStyle.None;
    case import_Calling.CallMode.Direct:
      return import_ConversationHeader.OutgoingCallButtonStyle.Both;
    case import_Calling.CallMode.Group: {
      const call = (0, import_getOwn.getOwn)(calling.callsByConversation, conversation.id);
      if (call?.callMode === import_Calling.CallMode.Group && (0, import_calling.isAnybodyElseInGroupCall)(call.peekInfo, ourACI)) {
        return import_ConversationHeader.OutgoingCallButtonStyle.Join;
      }
      return import_ConversationHeader.OutgoingCallButtonStyle.JustVideo;
    }
    default:
      throw (0, import_missingCaseError.missingCaseError)(conversationCallMode);
  }
}, "getOutgoingCallButtonStyle");
const mapStateToProps = /* @__PURE__ */ __name((state, ownProps) => {
  const { id } = ownProps;
  const conversation = (0, import_conversations.getConversationSelector)(state)(id);
  if (!conversation) {
    throw new Error("Could not find conversation");
  }
  const hasStories = (0, import_stories.getHasStoriesSelector)(state)(id);
  return {
    ...(0, import_lodash.pick)(conversation, [
      "acceptedMessageRequest",
      "announcementsOnly",
      "areWeAdmin",
      "avatarPath",
      "canChangeTimer",
      "color",
      "expireTimer",
      "groupVersion",
      "isArchived",
      "isMe",
      "isPinned",
      "isVerified",
      "left",
      "markedUnread",
      "muteExpiresAt",
      "name",
      "phoneNumber",
      "profileName",
      "sharedGroupNames",
      "title",
      "type",
      "unblurredAvatarPath"
    ]),
    badge: (0, import_badges.getPreferredBadgeSelector)(state)(conversation.badges),
    conversationTitle: state.conversations.selectedConversationTitle,
    hasStories,
    isMissingMandatoryProfileSharing: (0, import_conversations.isMissingRequiredProfileSharing)(conversation),
    isSMSOnly: (0, import_isConversationSMSOnly.isConversationSMSOnly)(conversation),
    i18n: (0, import_user.getIntl)(state),
    showBackButton: state.conversations.selectedConversationPanelDepth > 0,
    outgoingCallButtonStyle: getOutgoingCallButtonStyle(conversation, state),
    theme: (0, import_user.getTheme)(state)
  };
}, "mapStateToProps");
const smart = (0, import_react_redux.connect)(mapStateToProps, import_actions.mapDispatchToProps);
const SmartConversationHeader = smart(import_ConversationHeader.ConversationHeader);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartConversationHeader
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ29udmVyc2F0aW9uSGVhZGVyLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAtMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBwaWNrIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB0eXBlIHsgQ29udmVyc2F0aW9uVHlwZSB9IGZyb20gJy4uL2R1Y2tzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBTdGF0ZVR5cGUgfSBmcm9tICcuLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIENvbnZlcnNhdGlvbkhlYWRlcixcbiAgT3V0Z29pbmdDYWxsQnV0dG9uU3R5bGUsXG59IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uL0NvbnZlcnNhdGlvbkhlYWRlcic7XG5pbXBvcnQgeyBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2JhZGdlcyc7XG5pbXBvcnQge1xuICBnZXRDb252ZXJzYXRpb25TZWxlY3RvcixcbiAgaXNNaXNzaW5nUmVxdWlyZWRQcm9maWxlU2hhcmluZyxcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHsgQ2FsbE1vZGUgfSBmcm9tICcuLi8uLi90eXBlcy9DYWxsaW5nJztcbmltcG9ydCB7IGdldEFjdGl2ZUNhbGwsIGlzQW55Ym9keUVsc2VJbkdyb3VwQ2FsbCB9IGZyb20gJy4uL2R1Y2tzL2NhbGxpbmcnO1xuaW1wb3J0IHsgZ2V0Q29udmVyc2F0aW9uQ2FsbE1vZGUgfSBmcm9tICcuLi9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldEhhc1N0b3JpZXNTZWxlY3RvciB9IGZyb20gJy4uL3NlbGVjdG9ycy9zdG9yaWVzJztcbmltcG9ydCB7IGdldE93biB9IGZyb20gJy4uLy4uL3V0aWwvZ2V0T3duJztcbmltcG9ydCB7IGdldFVzZXJBQ0ksIGdldEludGwsIGdldFRoZW1lIH0gZnJvbSAnLi4vc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgaXNDb252ZXJzYXRpb25TTVNPbmx5IH0gZnJvbSAnLi4vLi4vdXRpbC9pc0NvbnZlcnNhdGlvblNNU09ubHknO1xuaW1wb3J0IHsgbWFwRGlzcGF0Y2hUb1Byb3BzIH0gZnJvbSAnLi4vYWN0aW9ucyc7XG5pbXBvcnQgeyBtaXNzaW5nQ2FzZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9taXNzaW5nQ2FzZUVycm9yJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcblxuZXhwb3J0IHR5cGUgT3duUHJvcHMgPSB7XG4gIGlkOiBzdHJpbmc7XG5cbiAgb25BcmNoaXZlOiAoKSA9PiB2b2lkO1xuICBvbkRlbGV0ZU1lc3NhZ2VzOiAoKSA9PiB2b2lkO1xuICBvbkdvQmFjazogKCkgPT4gdm9pZDtcbiAgb25NYXJrVW5yZWFkOiAoKSA9PiB2b2lkO1xuICBvbk1vdmVUb0luYm94OiAoKSA9PiB2b2lkO1xuICBvbk91dGdvaW5nQXVkaW9DYWxsSW5Db252ZXJzYXRpb246ICgpID0+IHZvaWQ7XG4gIG9uT3V0Z29pbmdWaWRlb0NhbGxJbkNvbnZlcnNhdGlvbjogKCkgPT4gdm9pZDtcbiAgb25TZWFyY2hJbkNvbnZlcnNhdGlvbjogKCkgPT4gdm9pZDtcbiAgb25TZXREaXNhcHBlYXJpbmdNZXNzYWdlczogKHNlY29uZHM6IG51bWJlcikgPT4gdm9pZDtcbiAgb25TZXRNdXRlTm90aWZpY2F0aW9uczogKHNlY29uZHM6IG51bWJlcikgPT4gdm9pZDtcbiAgb25TZXRQaW46ICh2YWx1ZTogYm9vbGVhbikgPT4gdm9pZDtcbiAgb25TaG93QWxsTWVkaWE6ICgpID0+IHZvaWQ7XG4gIG9uU2hvd0NvbnZlcnNhdGlvbkRldGFpbHM6ICgpID0+IHZvaWQ7XG4gIG9uU2hvd0dyb3VwTWVtYmVyczogKCkgPT4gdm9pZDtcbn07XG5cbmNvbnN0IGdldE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlID0gKFxuICBjb252ZXJzYXRpb246IENvbnZlcnNhdGlvblR5cGUsXG4gIHN0YXRlOiBTdGF0ZVR5cGVcbik6IE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlID0+IHtcbiAgY29uc3QgeyBjYWxsaW5nIH0gPSBzdGF0ZTtcbiAgY29uc3Qgb3VyQUNJID0gZ2V0VXNlckFDSShzdGF0ZSk7XG4gIHN0cmljdEFzc2VydChvdXJBQ0ksICdnZXRPdXRnb2luZ0NhbGxCdXR0b25TdHlsZSBtaXNzaW5nIG91ciB1dWlkJyk7XG5cbiAgaWYgKGdldEFjdGl2ZUNhbGwoY2FsbGluZykpIHtcbiAgICByZXR1cm4gT3V0Z29pbmdDYWxsQnV0dG9uU3R5bGUuTm9uZTtcbiAgfVxuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbkNhbGxNb2RlID0gZ2V0Q29udmVyc2F0aW9uQ2FsbE1vZGUoY29udmVyc2F0aW9uKTtcbiAgc3dpdGNoIChjb252ZXJzYXRpb25DYWxsTW9kZSkge1xuICAgIGNhc2UgQ2FsbE1vZGUuTm9uZTpcbiAgICAgIHJldHVybiBPdXRnb2luZ0NhbGxCdXR0b25TdHlsZS5Ob25lO1xuICAgIGNhc2UgQ2FsbE1vZGUuRGlyZWN0OlxuICAgICAgcmV0dXJuIE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlLkJvdGg7XG4gICAgY2FzZSBDYWxsTW9kZS5Hcm91cDoge1xuICAgICAgY29uc3QgY2FsbCA9IGdldE93bihjYWxsaW5nLmNhbGxzQnlDb252ZXJzYXRpb24sIGNvbnZlcnNhdGlvbi5pZCk7XG4gICAgICBpZiAoXG4gICAgICAgIGNhbGw/LmNhbGxNb2RlID09PSBDYWxsTW9kZS5Hcm91cCAmJlxuICAgICAgICBpc0FueWJvZHlFbHNlSW5Hcm91cENhbGwoY2FsbC5wZWVrSW5mbywgb3VyQUNJKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBPdXRnb2luZ0NhbGxCdXR0b25TdHlsZS5Kb2luO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlLkp1c3RWaWRlbztcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG1pc3NpbmdDYXNlRXJyb3IoY29udmVyc2F0aW9uQ2FsbE1vZGUpO1xuICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGU6IFN0YXRlVHlwZSwgb3duUHJvcHM6IE93blByb3BzKSA9PiB7XG4gIGNvbnN0IHsgaWQgfSA9IG93blByb3BzO1xuXG4gIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGdldENvbnZlcnNhdGlvblNlbGVjdG9yKHN0YXRlKShpZCk7XG4gIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBjb252ZXJzYXRpb24nKTtcbiAgfVxuXG4gIGNvbnN0IGhhc1N0b3JpZXMgPSBnZXRIYXNTdG9yaWVzU2VsZWN0b3Ioc3RhdGUpKGlkKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnBpY2soY29udmVyc2F0aW9uLCBbXG4gICAgICAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCcsXG4gICAgICAnYW5ub3VuY2VtZW50c09ubHknLFxuICAgICAgJ2FyZVdlQWRtaW4nLFxuICAgICAgJ2F2YXRhclBhdGgnLFxuICAgICAgJ2NhbkNoYW5nZVRpbWVyJyxcbiAgICAgICdjb2xvcicsXG4gICAgICAnZXhwaXJlVGltZXInLFxuICAgICAgJ2dyb3VwVmVyc2lvbicsXG4gICAgICAnaXNBcmNoaXZlZCcsXG4gICAgICAnaXNNZScsXG4gICAgICAnaXNQaW5uZWQnLFxuICAgICAgJ2lzVmVyaWZpZWQnLFxuICAgICAgJ2xlZnQnLFxuICAgICAgJ21hcmtlZFVucmVhZCcsXG4gICAgICAnbXV0ZUV4cGlyZXNBdCcsXG4gICAgICAnbmFtZScsXG4gICAgICAncGhvbmVOdW1iZXInLFxuICAgICAgJ3Byb2ZpbGVOYW1lJyxcbiAgICAgICdzaGFyZWRHcm91cE5hbWVzJyxcbiAgICAgICd0aXRsZScsXG4gICAgICAndHlwZScsXG4gICAgICAndW5ibHVycmVkQXZhdGFyUGF0aCcsXG4gICAgXSksXG4gICAgYmFkZ2U6IGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3Ioc3RhdGUpKGNvbnZlcnNhdGlvbi5iYWRnZXMpLFxuICAgIGNvbnZlcnNhdGlvblRpdGxlOiBzdGF0ZS5jb252ZXJzYXRpb25zLnNlbGVjdGVkQ29udmVyc2F0aW9uVGl0bGUsXG4gICAgaGFzU3RvcmllcyxcbiAgICBpc01pc3NpbmdNYW5kYXRvcnlQcm9maWxlU2hhcmluZzpcbiAgICAgIGlzTWlzc2luZ1JlcXVpcmVkUHJvZmlsZVNoYXJpbmcoY29udmVyc2F0aW9uKSxcbiAgICBpc1NNU09ubHk6IGlzQ29udmVyc2F0aW9uU01TT25seShjb252ZXJzYXRpb24pLFxuICAgIGkxOG46IGdldEludGwoc3RhdGUpLFxuICAgIHNob3dCYWNrQnV0dG9uOiBzdGF0ZS5jb252ZXJzYXRpb25zLnNlbGVjdGVkQ29udmVyc2F0aW9uUGFuZWxEZXB0aCA+IDAsXG4gICAgb3V0Z29pbmdDYWxsQnV0dG9uU3R5bGU6IGdldE91dGdvaW5nQ2FsbEJ1dHRvblN0eWxlKGNvbnZlcnNhdGlvbiwgc3RhdGUpLFxuICAgIHRoZW1lOiBnZXRUaGVtZShzdGF0ZSksXG4gIH07XG59O1xuXG5jb25zdCBzbWFydCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpO1xuXG5leHBvcnQgY29uc3QgU21hcnRDb252ZXJzYXRpb25IZWFkZXIgPSBzbWFydChDb252ZXJzYXRpb25IZWFkZXIpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLHlCQUF3QjtBQUN4QixvQkFBcUI7QUFHckIsZ0NBR087QUFDUCxvQkFBMEM7QUFDMUMsMkJBR087QUFDUCxxQkFBeUI7QUFDekIscUJBQXdEO0FBQ3hELDRCQUF3QztBQUN4QyxxQkFBc0M7QUFDdEMsb0JBQXVCO0FBQ3ZCLGtCQUE4QztBQUM5QyxtQ0FBc0M7QUFDdEMscUJBQW1DO0FBQ25DLDhCQUFpQztBQUNqQyxvQkFBNkI7QUFxQjdCLE1BQU0sNkJBQTZCLHdCQUNqQyxjQUNBLFVBQzRCO0FBQzVCLFFBQU0sRUFBRSxZQUFZO0FBQ3BCLFFBQU0sU0FBUyw0QkFBVyxLQUFLO0FBQy9CLGtDQUFhLFFBQVEsNkNBQTZDO0FBRWxFLE1BQUksa0NBQWMsT0FBTyxHQUFHO0FBQzFCLFdBQU8sa0RBQXdCO0FBQUEsRUFDakM7QUFFQSxRQUFNLHVCQUF1QixtREFBd0IsWUFBWTtBQUNqRSxVQUFRO0FBQUEsU0FDRCx3QkFBUztBQUNaLGFBQU8sa0RBQXdCO0FBQUEsU0FDNUIsd0JBQVM7QUFDWixhQUFPLGtEQUF3QjtBQUFBLFNBQzVCLHdCQUFTLE9BQU87QUFDbkIsWUFBTSxPQUFPLDBCQUFPLFFBQVEscUJBQXFCLGFBQWEsRUFBRTtBQUNoRSxVQUNFLE1BQU0sYUFBYSx3QkFBUyxTQUM1Qiw2Q0FBeUIsS0FBSyxVQUFVLE1BQU0sR0FDOUM7QUFDQSxlQUFPLGtEQUF3QjtBQUFBLE1BQ2pDO0FBQ0EsYUFBTyxrREFBd0I7QUFBQSxJQUNqQztBQUFBO0FBRUUsWUFBTSw4Q0FBaUIsb0JBQW9CO0FBQUE7QUFFakQsR0EvQm1DO0FBaUNuQyxNQUFNLGtCQUFrQix3QkFBQyxPQUFrQixhQUF1QjtBQUNoRSxRQUFNLEVBQUUsT0FBTztBQUVmLFFBQU0sZUFBZSxrREFBd0IsS0FBSyxFQUFFLEVBQUU7QUFDdEQsTUFBSSxDQUFDLGNBQWM7QUFDakIsVUFBTSxJQUFJLE1BQU0sNkJBQTZCO0FBQUEsRUFDL0M7QUFFQSxRQUFNLGFBQWEsMENBQXNCLEtBQUssRUFBRSxFQUFFO0FBRWxELFNBQU87QUFBQSxPQUNGLHdCQUFLLGNBQWM7QUFBQSxNQUNwQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsT0FBTyw2Q0FBMEIsS0FBSyxFQUFFLGFBQWEsTUFBTTtBQUFBLElBQzNELG1CQUFtQixNQUFNLGNBQWM7QUFBQSxJQUN2QztBQUFBLElBQ0Esa0NBQ0UsMERBQWdDLFlBQVk7QUFBQSxJQUM5QyxXQUFXLHdEQUFzQixZQUFZO0FBQUEsSUFDN0MsTUFBTSx5QkFBUSxLQUFLO0FBQUEsSUFDbkIsZ0JBQWdCLE1BQU0sY0FBYyxpQ0FBaUM7QUFBQSxJQUNyRSx5QkFBeUIsMkJBQTJCLGNBQWMsS0FBSztBQUFBLElBQ3ZFLE9BQU8sMEJBQVMsS0FBSztBQUFBLEVBQ3ZCO0FBQ0YsR0E5Q3dCO0FBZ0R4QixNQUFNLFFBQVEsZ0NBQVEsaUJBQWlCLGlDQUFrQjtBQUVsRCxNQUFNLDBCQUEwQixNQUFNLDRDQUFrQjsiLAogICJuYW1lcyI6IFtdCn0K
