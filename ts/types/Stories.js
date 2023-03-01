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
var Stories_exports = {};
__export(Stories_exports, {
  HasStories: () => HasStories,
  MY_STORIES_ID: () => MY_STORIES_ID,
  StoryViewDirectionType: () => StoryViewDirectionType,
  StoryViewModeType: () => StoryViewModeType,
  getStoryDistributionListName: () => getStoryDistributionListName
});
module.exports = __toCommonJS(Stories_exports);
const MY_STORIES_ID = "00000000-0000-0000-0000-000000000000";
var StoryViewDirectionType = /* @__PURE__ */ ((StoryViewDirectionType2) => {
  StoryViewDirectionType2["Next"] = "Next";
  StoryViewDirectionType2["Previous"] = "Previous";
  return StoryViewDirectionType2;
})(StoryViewDirectionType || {});
var StoryViewModeType = /* @__PURE__ */ ((StoryViewModeType2) => {
  StoryViewModeType2["Unread"] = "Unread";
  StoryViewModeType2["All"] = "All";
  StoryViewModeType2["Single"] = "Single";
  return StoryViewModeType2;
})(StoryViewModeType || {});
function getStoryDistributionListName(i18n, id, name) {
  return id === MY_STORIES_ID ? i18n("Stories__mine") : name;
}
var HasStories = /* @__PURE__ */ ((HasStories2) => {
  HasStories2["Read"] = "Read";
  HasStories2["Unread"] = "Unread";
  return HasStories2;
})(HasStories || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HasStories,
  MY_STORIES_ID,
  StoryViewDirectionType,
  StoryViewModeType,
  getStoryDistributionListName
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiU3Rvcmllcy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IEF0dGFjaG1lbnRUeXBlIH0gZnJvbSAnLi9BdHRhY2htZW50JztcbmltcG9ydCB0eXBlIHsgQ29udGFjdE5hbWVDb2xvclR5cGUgfSBmcm9tICcuL0NvbG9ycyc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvblR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB0eXBlIHsgTG9jYWxpemVyVHlwZSB9IGZyb20gJy4vVXRpbCc7XG5pbXBvcnQgdHlwZSB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgdHlwZSB7IFNlbmRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlU2VuZFN0YXRlJztcbmltcG9ydCB0eXBlIHsgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUgfSBmcm9tICcuLi9zdGF0ZS9kdWNrcy9zdG9yeURpc3RyaWJ1dGlvbkxpc3RzJztcblxuZXhwb3J0IHR5cGUgUmVwbHlUeXBlID0ge1xuICBhdXRob3I6IFBpY2s8XG4gICAgQ29udmVyc2F0aW9uVHlwZSxcbiAgICB8ICdhY2NlcHRlZE1lc3NhZ2VSZXF1ZXN0J1xuICAgIHwgJ2F2YXRhclBhdGgnXG4gICAgfCAnYmFkZ2VzJ1xuICAgIHwgJ2NvbG9yJ1xuICAgIHwgJ2lkJ1xuICAgIHwgJ2lzTWUnXG4gICAgfCAnbmFtZSdcbiAgICB8ICdwcm9maWxlTmFtZSdcbiAgICB8ICdzaGFyZWRHcm91cE5hbWVzJ1xuICAgIHwgJ3RpdGxlJ1xuICA+O1xuICBib2R5Pzogc3RyaW5nO1xuICBjb250YWN0TmFtZUNvbG9yPzogQ29udGFjdE5hbWVDb2xvclR5cGU7XG4gIGNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gIGRlbGV0ZWRGb3JFdmVyeW9uZT86IGJvb2xlYW47XG4gIGlkOiBzdHJpbmc7XG4gIHJlYWN0aW9uRW1vamk/OiBzdHJpbmc7XG4gIHJlYWRTdGF0dXM/OiBSZWFkU3RhdHVzO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJlcGx5U3RhdGVUeXBlID0ge1xuICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgcmVwbGllczogQXJyYXk8UmVwbHlUeXBlPjtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnZlcnNhdGlvblN0b3J5VHlwZSA9IHtcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgZ3JvdXA/OiBQaWNrPFxuICAgIENvbnZlcnNhdGlvblR5cGUsXG4gICAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgICB8ICdhdmF0YXJQYXRoJ1xuICAgIHwgJ2NvbG9yJ1xuICAgIHwgJ2lkJ1xuICAgIHwgJ25hbWUnXG4gICAgfCAncHJvZmlsZU5hbWUnXG4gICAgfCAnc2hhcmVkR3JvdXBOYW1lcydcbiAgICB8ICd0aXRsZSdcbiAgPjtcbiAgaXNIaWRkZW4/OiBib29sZWFuO1xuICBzZWFyY2hOYW1lcz86IHN0cmluZzsgLy8gVGhpcyBpcyBqdXN0IGhlcmUgdG8gc2F0aXNmeSBGdXNlJ3MgdHlwZXNcbiAgc3RvcnlWaWV3OiBTdG9yeVZpZXdUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgU3RvcnlTZW5kU3RhdGVUeXBlID0ge1xuICBpc0FsbG93ZWRUb1JlcGx5VG9TdG9yeT86IGJvb2xlYW47XG4gIHJlY2lwaWVudDogQ29udmVyc2F0aW9uVHlwZTtcbiAgc3RhdHVzOiBTZW5kU3RhdHVzO1xuICB1cGRhdGVkQXQ/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBTdG9yeVZpZXdUeXBlID0ge1xuICBhdHRhY2htZW50PzogQXR0YWNobWVudFR5cGU7XG4gIGNhblJlcGx5PzogYm9vbGVhbjtcbiAgaGFzUmVwbGllcz86IGJvb2xlYW47XG4gIGhhc1JlcGxpZXNGcm9tU2VsZj86IGJvb2xlYW47XG4gIGlzSGlkZGVuPzogYm9vbGVhbjtcbiAgaXNVbnJlYWQ/OiBib29sZWFuO1xuICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgc2VuZGVyOiBQaWNrPFxuICAgIENvbnZlcnNhdGlvblR5cGUsXG4gICAgfCAnYWNjZXB0ZWRNZXNzYWdlUmVxdWVzdCdcbiAgICB8ICdhdmF0YXJQYXRoJ1xuICAgIHwgJ2JhZGdlcydcbiAgICB8ICdjb2xvcidcbiAgICB8ICdmaXJzdE5hbWUnXG4gICAgfCAnaWQnXG4gICAgfCAnaXNNZSdcbiAgICB8ICduYW1lJ1xuICAgIHwgJ3Byb2ZpbGVOYW1lJ1xuICAgIHwgJ3NoYXJlZEdyb3VwTmFtZXMnXG4gICAgfCAndGl0bGUnXG4gID47XG4gIHNlbmRTdGF0ZT86IEFycmF5PFN0b3J5U2VuZFN0YXRlVHlwZT47XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICB2aWV3cz86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIE15U3RvcnlUeXBlID0ge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0b3JpZXM6IEFycmF5PFN0b3J5Vmlld1R5cGU+O1xufTtcblxuZXhwb3J0IGNvbnN0IE1ZX1NUT1JJRVNfSUQgPSAnMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwJztcblxuZXhwb3J0IGVudW0gU3RvcnlWaWV3RGlyZWN0aW9uVHlwZSB7XG4gIE5leHQgPSAnTmV4dCcsXG4gIFByZXZpb3VzID0gJ1ByZXZpb3VzJyxcbn1cblxuZXhwb3J0IGVudW0gU3RvcnlWaWV3TW9kZVR5cGUge1xuICBVbnJlYWQgPSAnVW5yZWFkJyxcbiAgQWxsID0gJ0FsbCcsXG4gIFNpbmdsZSA9ICdTaW5nbGUnLFxufVxuXG5leHBvcnQgdHlwZSBTdG9yeURpc3RyaWJ1dGlvbkxpc3RXaXRoTWVtYmVyc0RhdGFUeXBlID0gT21pdDxcbiAgU3RvcnlEaXN0cmlidXRpb25MaXN0RGF0YVR5cGUsXG4gICdtZW1iZXJVdWlkcydcbj4gJiB7XG4gIG1lbWJlcnM6IEFycmF5PENvbnZlcnNhdGlvblR5cGU+O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0b3J5RGlzdHJpYnV0aW9uTGlzdE5hbWUoXG4gIGkxOG46IExvY2FsaXplclR5cGUsXG4gIGlkOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZ1xuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlkID09PSBNWV9TVE9SSUVTX0lEID8gaTE4bignU3Rvcmllc19fbWluZScpIDogbmFtZTtcbn1cblxuZXhwb3J0IGVudW0gSGFzU3RvcmllcyB7XG4gIFJlYWQgPSAnUmVhZCcsXG4gIFVucmVhZCA9ICdVbnJlYWQnLFxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0dPLE1BQU0sZ0JBQWdCO0FBRXRCLElBQUsseUJBQUwsa0JBQUssNEJBQUw7QUFDTCxvQ0FBTztBQUNQLHdDQUFXO0FBRkQ7QUFBQTtBQUtMLElBQUssb0JBQUwsa0JBQUssdUJBQUw7QUFDTCxpQ0FBUztBQUNULDhCQUFNO0FBQ04saUNBQVM7QUFIQztBQUFBO0FBYUwsc0NBQ0wsTUFDQSxJQUNBLE1BQ1E7QUFDUixTQUFPLE9BQU8sZ0JBQWdCLEtBQUssZUFBZSxJQUFJO0FBQ3hEO0FBTmdCLEFBUVQsSUFBSyxhQUFMLGtCQUFLLGdCQUFMO0FBQ0wsd0JBQU87QUFDUCwwQkFBUztBQUZDO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
