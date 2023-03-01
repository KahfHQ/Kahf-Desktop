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
var search_exports = {};
__export(search_exports, {
  actions: () => actions,
  getEmptyState: () => getEmptyState,
  reducer: () => reducer
});
module.exports = __toCommonJS(search_exports);
var import_lodash = require("lodash");
var import_cleanSearchTerm = require("../../util/cleanSearchTerm");
var import_filterAndSortConversations = require("../../util/filterAndSortConversations");
var import_Client = __toESM(require("../../sql/Client"));
var import_makeLookup = require("../../util/makeLookup");
var import_search = require("../selectors/search");
var import_conversations = require("../selectors/conversations");
var import_user = require("../selectors/user");
var import_assert = require("../../util/assert");
var import_conversations2 = require("./conversations");
const {
  searchMessages: dataSearchMessages,
  searchMessagesInConversation
} = import_Client.default;
const actions = {
  startSearch,
  clearSearch,
  clearConversationSearch,
  searchInConversation,
  updateSearchTerm
};
function startSearch() {
  return {
    type: "SEARCH_START",
    payload: null
  };
}
function clearSearch() {
  return {
    type: "SEARCH_CLEAR",
    payload: null
  };
}
function clearConversationSearch() {
  return {
    type: "CLEAR_CONVERSATION_SEARCH",
    payload: null
  };
}
function searchInConversation(searchConversationId) {
  return {
    type: "SEARCH_IN_CONVERSATION",
    payload: { searchConversationId }
  };
}
function updateSearchTerm(query) {
  return (dispatch, getState) => {
    dispatch({
      type: "SEARCH_UPDATE",
      payload: { query }
    });
    const state = getState();
    const ourConversationId = (0, import_user.getUserConversationId)(state);
    (0, import_assert.strictAssert)(ourConversationId, "updateSearchTerm our conversation is missing");
    doSearch({
      dispatch,
      allConversations: (0, import_conversations.getAllConversations)(state),
      regionCode: (0, import_user.getRegionCode)(state),
      noteToSelf: (0, import_user.getIntl)(state)("noteToSelf").toLowerCase(),
      ourConversationId,
      query: (0, import_search.getQuery)(state),
      searchConversationId: (0, import_search.getSearchConversation)(state)?.id
    });
  };
}
const doSearch = (0, import_lodash.debounce)(({
  dispatch,
  allConversations,
  regionCode,
  noteToSelf,
  ourConversationId,
  query,
  searchConversationId
}) => {
  if (!query) {
    return;
  }
  (async () => {
    dispatch({
      type: "SEARCH_MESSAGES_RESULTS_FULFILLED",
      payload: {
        messages: await queryMessages(query, searchConversationId),
        query
      }
    });
  })();
  if (!searchConversationId) {
    (async () => {
      const { conversationIds, contactIds } = await queryConversationsAndContacts(query, {
        ourConversationId,
        noteToSelf,
        regionCode,
        allConversations
      });
      dispatch({
        type: "SEARCH_DISCUSSIONS_RESULTS_FULFILLED",
        payload: {
          conversationIds,
          contactIds,
          query
        }
      });
    })();
  }
}, 200);
async function queryMessages(query, searchConversationId) {
  try {
    const normalized = (0, import_cleanSearchTerm.cleanSearchTerm)(query);
    if (normalized.length === 0) {
      return [];
    }
    if (searchConversationId) {
      return searchMessagesInConversation(normalized, searchConversationId);
    }
    return dataSearchMessages(normalized);
  } catch (e) {
    return [];
  }
}
async function queryConversationsAndContacts(query, options) {
  const { ourConversationId, noteToSelf, regionCode, allConversations } = options;
  const searchResults = (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(allConversations, query, regionCode);
  let conversationIds = [];
  let contactIds = [];
  const max = searchResults.length;
  for (let i = 0; i < max; i += 1) {
    const conversation = searchResults[i];
    if (conversation.type === "direct" && !conversation.lastMessage) {
      contactIds.push(conversation.id);
    } else {
      conversationIds.push(conversation.id);
    }
  }
  if (noteToSelf.indexOf(query.toLowerCase()) !== -1) {
    contactIds = contactIds.filter((id) => id !== ourConversationId);
    conversationIds = conversationIds.filter((id) => id !== ourConversationId);
    contactIds.unshift(ourConversationId);
  }
  return { conversationIds, contactIds };
}
function getEmptyState() {
  return {
    startSearchCounter: 0,
    query: "",
    messageIds: [],
    messageLookup: {},
    conversationIds: [],
    contactIds: [],
    discussionsLoading: false,
    messagesLoading: false
  };
}
function reducer(state = getEmptyState(), action) {
  if (action.type === "SHOW_ARCHIVED_CONVERSATIONS") {
    return getEmptyState();
  }
  if (action.type === "SEARCH_START") {
    return {
      ...state,
      searchConversationId: void 0,
      startSearchCounter: state.startSearchCounter + 1
    };
  }
  if (action.type === "SEARCH_CLEAR") {
    return getEmptyState();
  }
  if (action.type === "SEARCH_UPDATE") {
    const { payload } = action;
    const { query } = payload;
    const hasQuery = Boolean(query);
    const isWithinConversation = Boolean(state.searchConversationId);
    return {
      ...state,
      query,
      messagesLoading: hasQuery,
      ...hasQuery ? {
        messageIds: [],
        messageLookup: {},
        discussionsLoading: !isWithinConversation,
        contactIds: [],
        conversationIds: []
      } : {}
    };
  }
  if (action.type === "SEARCH_IN_CONVERSATION") {
    const { payload } = action;
    const { searchConversationId } = payload;
    if (searchConversationId === state.searchConversationId) {
      return {
        ...state,
        startSearchCounter: state.startSearchCounter + 1
      };
    }
    return {
      ...getEmptyState(),
      searchConversationId,
      startSearchCounter: state.startSearchCounter + 1
    };
  }
  if (action.type === "CLEAR_CONVERSATION_SEARCH") {
    const { searchConversationId } = state;
    return {
      ...getEmptyState(),
      searchConversationId
    };
  }
  if (action.type === "SEARCH_MESSAGES_RESULTS_FULFILLED") {
    const { payload } = action;
    const { messages, query } = payload;
    if (state.query !== query) {
      return state;
    }
    const messageIds = messages.map((message) => message.id);
    return {
      ...state,
      query,
      messageIds,
      messageLookup: (0, import_makeLookup.makeLookup)(messages, "id"),
      messagesLoading: false
    };
  }
  if (action.type === "SEARCH_DISCUSSIONS_RESULTS_FULFILLED") {
    const { payload } = action;
    const { contactIds, conversationIds, query } = payload;
    if (state.query !== query) {
      return state;
    }
    return {
      ...state,
      contactIds,
      conversationIds,
      discussionsLoading: false
    };
  }
  if (action.type === "CONVERSATIONS_REMOVE_ALL") {
    return getEmptyState();
  }
  if (action.type === import_conversations2.SELECTED_CONVERSATION_CHANGED) {
    const { payload } = action;
    const { id, messageId } = payload;
    const { searchConversationId } = state;
    if (searchConversationId && searchConversationId !== id) {
      return getEmptyState();
    }
    return {
      ...state,
      selectedMessage: messageId
    };
  }
  if (action.type === "CONVERSATION_UNLOADED") {
    const { payload } = action;
    const { id } = payload;
    const { searchConversationId } = state;
    if (searchConversationId && searchConversationId === id) {
      return getEmptyState();
    }
    return state;
  }
  if (action.type === "MESSAGE_DELETED") {
    const { messageIds, messageLookup } = state;
    if (!messageIds || messageIds.length < 1) {
      return state;
    }
    const { payload } = action;
    const { id } = payload;
    return {
      ...state,
      messageIds: (0, import_lodash.reject)(messageIds, (messageId) => id === messageId),
      messageLookup: (0, import_lodash.omit)(messageLookup, id)
    };
  }
  return state;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actions,
  getEmptyState,
  reducer
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VhcmNoLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxOS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHR5cGUgeyBUaHVua0FjdGlvbiwgVGh1bmtEaXNwYXRjaCB9IGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCB7IGRlYm91bmNlLCBvbWl0LCByZWplY3QgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlVHlwZSBhcyBSb290U3RhdGVUeXBlIH0gZnJvbSAnLi4vcmVkdWNlcic7XG5pbXBvcnQgeyBjbGVhblNlYXJjaFRlcm0gfSBmcm9tICcuLi8uLi91dGlsL2NsZWFuU2VhcmNoVGVybSc7XG5pbXBvcnQgeyBmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50IH0gZnJvbSAnLi4vLi4vdXRpbC9maWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9ucyc7XG5pbXBvcnQgdHlwZSB7XG4gIENsaWVudFNlYXJjaFJlc3VsdE1lc3NhZ2VUeXBlLFxuICBDbGllbnRJbnRlcmZhY2UsXG59IGZyb20gJy4uLy4uL3NxbC9JbnRlcmZhY2UnO1xuaW1wb3J0IGRhdGFJbnRlcmZhY2UgZnJvbSAnLi4vLi4vc3FsL0NsaWVudCc7XG5pbXBvcnQgeyBtYWtlTG9va3VwIH0gZnJvbSAnLi4vLi4vdXRpbC9tYWtlTG9va3VwJztcblxuaW1wb3J0IHR5cGUge1xuICBDb252ZXJzYXRpb25UeXBlLFxuICBDb252ZXJzYXRpb25VbmxvYWRlZEFjdGlvblR5cGUsXG4gIE1lc3NhZ2VEZWxldGVkQWN0aW9uVHlwZSxcbiAgTWVzc2FnZVR5cGUsXG4gIFJlbW92ZUFsbENvbnZlcnNhdGlvbnNBY3Rpb25UeXBlLFxuICBTZWxlY3RlZENvbnZlcnNhdGlvbkNoYW5nZWRBY3Rpb25UeXBlLFxuICBTaG93QXJjaGl2ZWRDb252ZXJzYXRpb25zQWN0aW9uVHlwZSxcbn0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldFF1ZXJ5LCBnZXRTZWFyY2hDb252ZXJzYXRpb24gfSBmcm9tICcuLi9zZWxlY3RvcnMvc2VhcmNoJztcbmltcG9ydCB7IGdldEFsbENvbnZlcnNhdGlvbnMgfSBmcm9tICcuLi9zZWxlY3RvcnMvY29udmVyc2F0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRJbnRsLFxuICBnZXRSZWdpb25Db2RlLFxuICBnZXRVc2VyQ29udmVyc2F0aW9uSWQsXG59IGZyb20gJy4uL3NlbGVjdG9ycy91c2VyJztcbmltcG9ydCB7IHN0cmljdEFzc2VydCB9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7IFNFTEVDVEVEX0NPTlZFUlNBVElPTl9DSEFOR0VEIH0gZnJvbSAnLi9jb252ZXJzYXRpb25zJztcblxuY29uc3Qge1xuICBzZWFyY2hNZXNzYWdlczogZGF0YVNlYXJjaE1lc3NhZ2VzLFxuICBzZWFyY2hNZXNzYWdlc0luQ29udmVyc2F0aW9uLFxufTogQ2xpZW50SW50ZXJmYWNlID0gZGF0YUludGVyZmFjZTtcblxuLy8gU3RhdGVcblxuZXhwb3J0IHR5cGUgTWVzc2FnZVNlYXJjaFJlc3VsdFR5cGUgPSBNZXNzYWdlVHlwZSAmIHtcbiAgc25pcHBldD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIE1lc3NhZ2VTZWFyY2hSZXN1bHRMb29rdXBUeXBlID0ge1xuICBbaWQ6IHN0cmluZ106IE1lc3NhZ2VTZWFyY2hSZXN1bHRUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgU2VhcmNoU3RhdGVUeXBlID0ge1xuICBzdGFydFNlYXJjaENvdW50ZXI6IG51bWJlcjtcbiAgc2VhcmNoQ29udmVyc2F0aW9uSWQ/OiBzdHJpbmc7XG4gIGNvbnRhY3RJZHM6IEFycmF5PHN0cmluZz47XG4gIGNvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPjtcbiAgcXVlcnk6IHN0cmluZztcbiAgbWVzc2FnZUlkczogQXJyYXk8c3RyaW5nPjtcbiAgLy8gV2UgZG8gc3RvcmUgbWVzc2FnZSBkYXRhIHRvIHBhc3MgdGhyb3VnaCB0aGUgc2VsZWN0b3JcbiAgbWVzc2FnZUxvb2t1cDogTWVzc2FnZVNlYXJjaFJlc3VsdExvb2t1cFR5cGU7XG4gIHNlbGVjdGVkTWVzc2FnZT86IHN0cmluZztcbiAgLy8gTG9hZGluZyBzdGF0ZVxuICBkaXNjdXNzaW9uc0xvYWRpbmc6IGJvb2xlYW47XG4gIG1lc3NhZ2VzTG9hZGluZzogYm9vbGVhbjtcbn07XG5cbi8vIEFjdGlvbnNcblxudHlwZSBTZWFyY2hNZXNzYWdlc1Jlc3VsdHNGdWxmaWxsZWRBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VBUkNIX01FU1NBR0VTX1JFU1VMVFNfRlVMRklMTEVEJztcbiAgcGF5bG9hZDoge1xuICAgIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlU2VhcmNoUmVzdWx0VHlwZT47XG4gICAgcXVlcnk6IHN0cmluZztcbiAgfTtcbn07XG50eXBlIFNlYXJjaERpc2N1c3Npb25zUmVzdWx0c0Z1bGZpbGxlZEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdTRUFSQ0hfRElTQ1VTU0lPTlNfUkVTVUxUU19GVUxGSUxMRUQnO1xuICBwYXlsb2FkOiB7XG4gICAgY29udmVyc2F0aW9uSWRzOiBBcnJheTxzdHJpbmc+O1xuICAgIGNvbnRhY3RJZHM6IEFycmF5PHN0cmluZz47XG4gICAgcXVlcnk6IHN0cmluZztcbiAgfTtcbn07XG50eXBlIFVwZGF0ZVNlYXJjaFRlcm1BY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VBUkNIX1VQREFURSc7XG4gIHBheWxvYWQ6IHtcbiAgICBxdWVyeTogc3RyaW5nO1xuICB9O1xufTtcbnR5cGUgU3RhcnRTZWFyY2hBY3Rpb25UeXBlID0ge1xuICB0eXBlOiAnU0VBUkNIX1NUQVJUJztcbiAgcGF5bG9hZDogbnVsbDtcbn07XG50eXBlIENsZWFyU2VhcmNoQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFQVJDSF9DTEVBUic7XG4gIHBheWxvYWQ6IG51bGw7XG59O1xudHlwZSBDbGVhckNvbnZlcnNhdGlvblNlYXJjaEFjdGlvblR5cGUgPSB7XG4gIHR5cGU6ICdDTEVBUl9DT05WRVJTQVRJT05fU0VBUkNIJztcbiAgcGF5bG9hZDogbnVsbDtcbn07XG50eXBlIFNlYXJjaEluQ29udmVyc2F0aW9uQWN0aW9uVHlwZSA9IHtcbiAgdHlwZTogJ1NFQVJDSF9JTl9DT05WRVJTQVRJT04nO1xuICBwYXlsb2FkOiB7IHNlYXJjaENvbnZlcnNhdGlvbklkOiBzdHJpbmcgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFNlYXJjaEFjdGlvblR5cGUgPVxuICB8IFNlYXJjaE1lc3NhZ2VzUmVzdWx0c0Z1bGZpbGxlZEFjdGlvblR5cGVcbiAgfCBTZWFyY2hEaXNjdXNzaW9uc1Jlc3VsdHNGdWxmaWxsZWRBY3Rpb25UeXBlXG4gIHwgVXBkYXRlU2VhcmNoVGVybUFjdGlvblR5cGVcbiAgfCBTdGFydFNlYXJjaEFjdGlvblR5cGVcbiAgfCBDbGVhclNlYXJjaEFjdGlvblR5cGVcbiAgfCBDbGVhckNvbnZlcnNhdGlvblNlYXJjaEFjdGlvblR5cGVcbiAgfCBTZWFyY2hJbkNvbnZlcnNhdGlvbkFjdGlvblR5cGVcbiAgfCBNZXNzYWdlRGVsZXRlZEFjdGlvblR5cGVcbiAgfCBSZW1vdmVBbGxDb252ZXJzYXRpb25zQWN0aW9uVHlwZVxuICB8IFNlbGVjdGVkQ29udmVyc2F0aW9uQ2hhbmdlZEFjdGlvblR5cGVcbiAgfCBTaG93QXJjaGl2ZWRDb252ZXJzYXRpb25zQWN0aW9uVHlwZVxuICB8IENvbnZlcnNhdGlvblVubG9hZGVkQWN0aW9uVHlwZTtcblxuLy8gQWN0aW9uIENyZWF0b3JzXG5cbmV4cG9ydCBjb25zdCBhY3Rpb25zID0ge1xuICBzdGFydFNlYXJjaCxcbiAgY2xlYXJTZWFyY2gsXG4gIGNsZWFyQ29udmVyc2F0aW9uU2VhcmNoLFxuICBzZWFyY2hJbkNvbnZlcnNhdGlvbixcbiAgdXBkYXRlU2VhcmNoVGVybSxcbn07XG5cbmZ1bmN0aW9uIHN0YXJ0U2VhcmNoKCk6IFN0YXJ0U2VhcmNoQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFQVJDSF9TVEFSVCcsXG4gICAgcGF5bG9hZDogbnVsbCxcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsZWFyU2VhcmNoKCk6IENsZWFyU2VhcmNoQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NFQVJDSF9DTEVBUicsXG4gICAgcGF5bG9hZDogbnVsbCxcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsZWFyQ29udmVyc2F0aW9uU2VhcmNoKCk6IENsZWFyQ29udmVyc2F0aW9uU2VhcmNoQWN0aW9uVHlwZSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0NMRUFSX0NPTlZFUlNBVElPTl9TRUFSQ0gnLFxuICAgIHBheWxvYWQ6IG51bGwsXG4gIH07XG59XG5mdW5jdGlvbiBzZWFyY2hJbkNvbnZlcnNhdGlvbihcbiAgc2VhcmNoQ29udmVyc2F0aW9uSWQ6IHN0cmluZ1xuKTogU2VhcmNoSW5Db252ZXJzYXRpb25BY3Rpb25UeXBlIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0VBUkNIX0lOX0NPTlZFUlNBVElPTicsXG4gICAgcGF5bG9hZDogeyBzZWFyY2hDb252ZXJzYXRpb25JZCB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTZWFyY2hUZXJtKFxuICBxdWVyeTogc3RyaW5nXG4pOiBUaHVua0FjdGlvbjx2b2lkLCBSb290U3RhdGVUeXBlLCB1bmtub3duLCBVcGRhdGVTZWFyY2hUZXJtQWN0aW9uVHlwZT4ge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdTRUFSQ0hfVVBEQVRFJyxcbiAgICAgIHBheWxvYWQ6IHsgcXVlcnkgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICBjb25zdCBvdXJDb252ZXJzYXRpb25JZCA9IGdldFVzZXJDb252ZXJzYXRpb25JZChzdGF0ZSk7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgb3VyQ29udmVyc2F0aW9uSWQsXG4gICAgICAndXBkYXRlU2VhcmNoVGVybSBvdXIgY29udmVyc2F0aW9uIGlzIG1pc3NpbmcnXG4gICAgKTtcblxuICAgIGRvU2VhcmNoKHtcbiAgICAgIGRpc3BhdGNoLFxuICAgICAgYWxsQ29udmVyc2F0aW9uczogZ2V0QWxsQ29udmVyc2F0aW9ucyhzdGF0ZSksXG4gICAgICByZWdpb25Db2RlOiBnZXRSZWdpb25Db2RlKHN0YXRlKSxcbiAgICAgIG5vdGVUb1NlbGY6IGdldEludGwoc3RhdGUpKCdub3RlVG9TZWxmJykudG9Mb3dlckNhc2UoKSxcbiAgICAgIG91ckNvbnZlcnNhdGlvbklkLFxuICAgICAgcXVlcnk6IGdldFF1ZXJ5KHN0YXRlKSxcbiAgICAgIHNlYXJjaENvbnZlcnNhdGlvbklkOiBnZXRTZWFyY2hDb252ZXJzYXRpb24oc3RhdGUpPy5pZCxcbiAgICB9KTtcbiAgfTtcbn1cblxuY29uc3QgZG9TZWFyY2ggPSBkZWJvdW5jZShcbiAgKHtcbiAgICBkaXNwYXRjaCxcbiAgICBhbGxDb252ZXJzYXRpb25zLFxuICAgIHJlZ2lvbkNvZGUsXG4gICAgbm90ZVRvU2VsZixcbiAgICBvdXJDb252ZXJzYXRpb25JZCxcbiAgICBxdWVyeSxcbiAgICBzZWFyY2hDb252ZXJzYXRpb25JZCxcbiAgfTogUmVhZG9ubHk8e1xuICAgIGRpc3BhdGNoOiBUaHVua0Rpc3BhdGNoPFxuICAgICAgUm9vdFN0YXRlVHlwZSxcbiAgICAgIHVua25vd24sXG4gICAgICB8IFNlYXJjaE1lc3NhZ2VzUmVzdWx0c0Z1bGZpbGxlZEFjdGlvblR5cGVcbiAgICAgIHwgU2VhcmNoRGlzY3Vzc2lvbnNSZXN1bHRzRnVsZmlsbGVkQWN0aW9uVHlwZVxuICAgID47XG4gICAgYWxsQ29udmVyc2F0aW9uczogUmVhZG9ubHlBcnJheTxDb252ZXJzYXRpb25UeXBlPjtcbiAgICBub3RlVG9TZWxmOiBzdHJpbmc7XG4gICAgcmVnaW9uQ29kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIG91ckNvbnZlcnNhdGlvbklkOiBzdHJpbmc7XG4gICAgcXVlcnk6IHN0cmluZztcbiAgICBzZWFyY2hDb252ZXJzYXRpb25JZDogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICB9PikgPT4ge1xuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU0VBUkNIX01FU1NBR0VTX1JFU1VMVFNfRlVMRklMTEVEJyxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIG1lc3NhZ2VzOiBhd2FpdCBxdWVyeU1lc3NhZ2VzKHF1ZXJ5LCBzZWFyY2hDb252ZXJzYXRpb25JZCksXG4gICAgICAgICAgcXVlcnksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KSgpO1xuXG4gICAgaWYgKCFzZWFyY2hDb252ZXJzYXRpb25JZCkge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjb252ZXJzYXRpb25JZHMsIGNvbnRhY3RJZHMgfSA9XG4gICAgICAgICAgYXdhaXQgcXVlcnlDb252ZXJzYXRpb25zQW5kQ29udGFjdHMocXVlcnksIHtcbiAgICAgICAgICAgIG91ckNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgbm90ZVRvU2VsZixcbiAgICAgICAgICAgIHJlZ2lvbkNvZGUsXG4gICAgICAgICAgICBhbGxDb252ZXJzYXRpb25zLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiAnU0VBUkNIX0RJU0NVU1NJT05TX1JFU1VMVFNfRlVMRklMTEVEJyxcbiAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICBjb252ZXJzYXRpb25JZHMsXG4gICAgICAgICAgICBjb250YWN0SWRzLFxuICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KSgpO1xuICAgIH1cbiAgfSxcbiAgMjAwXG4pO1xuXG5hc3luYyBmdW5jdGlvbiBxdWVyeU1lc3NhZ2VzKFxuICBxdWVyeTogc3RyaW5nLFxuICBzZWFyY2hDb252ZXJzYXRpb25JZD86IHN0cmluZ1xuKTogUHJvbWlzZTxBcnJheTxDbGllbnRTZWFyY2hSZXN1bHRNZXNzYWdlVHlwZT4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gY2xlYW5TZWFyY2hUZXJtKHF1ZXJ5KTtcbiAgICBpZiAobm9ybWFsaXplZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoQ29udmVyc2F0aW9uSWQpIHtcbiAgICAgIHJldHVybiBzZWFyY2hNZXNzYWdlc0luQ29udmVyc2F0aW9uKG5vcm1hbGl6ZWQsIHNlYXJjaENvbnZlcnNhdGlvbklkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVNlYXJjaE1lc3NhZ2VzKG5vcm1hbGl6ZWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHF1ZXJ5Q29udmVyc2F0aW9uc0FuZENvbnRhY3RzKFxuICBxdWVyeTogc3RyaW5nLFxuICBvcHRpb25zOiB7XG4gICAgb3VyQ29udmVyc2F0aW9uSWQ6IHN0cmluZztcbiAgICBub3RlVG9TZWxmOiBzdHJpbmc7XG4gICAgcmVnaW9uQ29kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGFsbENvbnZlcnNhdGlvbnM6IFJlYWRvbmx5QXJyYXk8Q29udmVyc2F0aW9uVHlwZT47XG4gIH1cbik6IFByb21pc2U8e1xuICBjb250YWN0SWRzOiBBcnJheTxzdHJpbmc+O1xuICBjb252ZXJzYXRpb25JZHM6IEFycmF5PHN0cmluZz47XG59PiB7XG4gIGNvbnN0IHsgb3VyQ29udmVyc2F0aW9uSWQsIG5vdGVUb1NlbGYsIHJlZ2lvbkNvZGUsIGFsbENvbnZlcnNhdGlvbnMgfSA9XG4gICAgb3B0aW9ucztcblxuICBjb25zdCBzZWFyY2hSZXN1bHRzOiBBcnJheTxDb252ZXJzYXRpb25UeXBlPiA9XG4gICAgZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNCeVJlY2VudChhbGxDb252ZXJzYXRpb25zLCBxdWVyeSwgcmVnaW9uQ29kZSk7XG5cbiAgLy8gU3BsaXQgaW50byB0d28gZ3JvdXBzIC0gYWN0aXZlIGNvbnZlcnNhdGlvbnMgYW5kIGl0ZW1zIGp1c3QgZnJvbSBhZGRyZXNzIGJvb2tcbiAgbGV0IGNvbnZlcnNhdGlvbklkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBsZXQgY29udGFjdElkczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdCBtYXggPSBzZWFyY2hSZXN1bHRzLmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHNlYXJjaFJlc3VsdHNbaV07XG5cbiAgICBpZiAoY29udmVyc2F0aW9uLnR5cGUgPT09ICdkaXJlY3QnICYmICFjb252ZXJzYXRpb24ubGFzdE1lc3NhZ2UpIHtcbiAgICAgIGNvbnRhY3RJZHMucHVzaChjb252ZXJzYXRpb24uaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb252ZXJzYXRpb25JZHMucHVzaChjb252ZXJzYXRpb24uaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluamVjdCBzeW50aGV0aWMgTm90ZSB0byBTZWxmIGVudHJ5IGlmIHF1ZXJ5IG1hdGNoZXMgbG9jYWxpemVkICdOb3RlIHRvIFNlbGYnXG4gIGlmIChub3RlVG9TZWxmLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSkgIT09IC0xKSB7XG4gICAgLy8gZW5zdXJlIHRoYXQgd2UgZG9uJ3QgaGF2ZSBkdXBsaWNhdGVzIGluIG91ciByZXN1bHRzXG4gICAgY29udGFjdElkcyA9IGNvbnRhY3RJZHMuZmlsdGVyKGlkID0+IGlkICE9PSBvdXJDb252ZXJzYXRpb25JZCk7XG4gICAgY29udmVyc2F0aW9uSWRzID0gY29udmVyc2F0aW9uSWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gb3VyQ29udmVyc2F0aW9uSWQpO1xuXG4gICAgY29udGFjdElkcy51bnNoaWZ0KG91ckNvbnZlcnNhdGlvbklkKTtcbiAgfVxuXG4gIHJldHVybiB7IGNvbnZlcnNhdGlvbklkcywgY29udGFjdElkcyB9O1xufVxuXG4vLyBSZWR1Y2VyXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbXB0eVN0YXRlKCk6IFNlYXJjaFN0YXRlVHlwZSB7XG4gIHJldHVybiB7XG4gICAgc3RhcnRTZWFyY2hDb3VudGVyOiAwLFxuICAgIHF1ZXJ5OiAnJyxcbiAgICBtZXNzYWdlSWRzOiBbXSxcbiAgICBtZXNzYWdlTG9va3VwOiB7fSxcbiAgICBjb252ZXJzYXRpb25JZHM6IFtdLFxuICAgIGNvbnRhY3RJZHM6IFtdLFxuICAgIGRpc2N1c3Npb25zTG9hZGluZzogZmFsc2UsXG4gICAgbWVzc2FnZXNMb2FkaW5nOiBmYWxzZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoXG4gIHN0YXRlOiBSZWFkb25seTxTZWFyY2hTdGF0ZVR5cGU+ID0gZ2V0RW1wdHlTdGF0ZSgpLFxuICBhY3Rpb246IFJlYWRvbmx5PFNlYXJjaEFjdGlvblR5cGU+XG4pOiBTZWFyY2hTdGF0ZVR5cGUge1xuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTSE9XX0FSQ0hJVkVEX0NPTlZFUlNBVElPTlMnKSB7XG4gICAgcmV0dXJuIGdldEVtcHR5U3RhdGUoKTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFQVJDSF9TVEFSVCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBzZWFyY2hDb252ZXJzYXRpb25JZDogdW5kZWZpbmVkLFxuICAgICAgc3RhcnRTZWFyY2hDb3VudGVyOiBzdGF0ZS5zdGFydFNlYXJjaENvdW50ZXIgKyAxLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRUFSQ0hfQ0xFQVInKSB7XG4gICAgcmV0dXJuIGdldEVtcHR5U3RhdGUoKTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ1NFQVJDSF9VUERBVEUnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBxdWVyeSB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IGhhc1F1ZXJ5ID0gQm9vbGVhbihxdWVyeSk7XG4gICAgY29uc3QgaXNXaXRoaW5Db252ZXJzYXRpb24gPSBCb29sZWFuKHN0YXRlLnNlYXJjaENvbnZlcnNhdGlvbklkKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHF1ZXJ5LFxuICAgICAgbWVzc2FnZXNMb2FkaW5nOiBoYXNRdWVyeSxcbiAgICAgIC4uLihoYXNRdWVyeVxuICAgICAgICA/IHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZHM6IFtdLFxuICAgICAgICAgICAgbWVzc2FnZUxvb2t1cDoge30sXG4gICAgICAgICAgICBkaXNjdXNzaW9uc0xvYWRpbmc6ICFpc1dpdGhpbkNvbnZlcnNhdGlvbixcbiAgICAgICAgICAgIGNvbnRhY3RJZHM6IFtdLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uSWRzOiBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIDoge30pLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRUFSQ0hfSU5fQ09OVkVSU0FUSU9OJykge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgc2VhcmNoQ29udmVyc2F0aW9uSWQgfSA9IHBheWxvYWQ7XG5cbiAgICBpZiAoc2VhcmNoQ29udmVyc2F0aW9uSWQgPT09IHN0YXRlLnNlYXJjaENvbnZlcnNhdGlvbklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3RhcnRTZWFyY2hDb3VudGVyOiBzdGF0ZS5zdGFydFNlYXJjaENvdW50ZXIgKyAxLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZ2V0RW1wdHlTdGF0ZSgpLFxuICAgICAgc2VhcmNoQ29udmVyc2F0aW9uSWQsXG4gICAgICBzdGFydFNlYXJjaENvdW50ZXI6IHN0YXRlLnN0YXJ0U2VhcmNoQ291bnRlciArIDEsXG4gICAgfTtcbiAgfVxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdDTEVBUl9DT05WRVJTQVRJT05fU0VBUkNIJykge1xuICAgIGNvbnN0IHsgc2VhcmNoQ29udmVyc2F0aW9uSWQgfSA9IHN0YXRlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmdldEVtcHR5U3RhdGUoKSxcbiAgICAgIHNlYXJjaENvbnZlcnNhdGlvbklkLFxuICAgIH07XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdTRUFSQ0hfTUVTU0FHRVNfUkVTVUxUU19GVUxGSUxMRUQnKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBtZXNzYWdlcywgcXVlcnkgfSA9IHBheWxvYWQ7XG5cbiAgICAvLyBSZWplY3QgaWYgdGhlIGFzc29jaWF0ZWQgcXVlcnkgaXMgbm90IHRoZSBtb3N0IHJlY2VudCB1c2VyLXByb3ZpZGVkIHF1ZXJ5XG4gICAgaWYgKHN0YXRlLnF1ZXJ5ICE9PSBxdWVyeSkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VJZHMgPSBtZXNzYWdlcy5tYXAobWVzc2FnZSA9PiBtZXNzYWdlLmlkKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHF1ZXJ5LFxuICAgICAgbWVzc2FnZUlkcyxcbiAgICAgIG1lc3NhZ2VMb29rdXA6IG1ha2VMb29rdXAobWVzc2FnZXMsICdpZCcpLFxuICAgICAgbWVzc2FnZXNMb2FkaW5nOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSAnU0VBUkNIX0RJU0NVU1NJT05TX1JFU1VMVFNfRlVMRklMTEVEJykge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgY29udGFjdElkcywgY29udmVyc2F0aW9uSWRzLCBxdWVyeSB9ID0gcGF5bG9hZDtcblxuICAgIC8vIFJlamVjdCBpZiB0aGUgYXNzb2NpYXRlZCBxdWVyeSBpcyBub3QgdGhlIG1vc3QgcmVjZW50IHVzZXItcHJvdmlkZWQgcXVlcnlcbiAgICBpZiAoc3RhdGUucXVlcnkgIT09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY29udGFjdElkcyxcbiAgICAgIGNvbnZlcnNhdGlvbklkcyxcbiAgICAgIGRpc2N1c3Npb25zTG9hZGluZzogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0NPTlZFUlNBVElPTlNfUkVNT1ZFX0FMTCcpIHtcbiAgICByZXR1cm4gZ2V0RW1wdHlTdGF0ZSgpO1xuICB9XG5cbiAgaWYgKGFjdGlvbi50eXBlID09PSBTRUxFQ1RFRF9DT05WRVJTQVRJT05fQ0hBTkdFRCkge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICAgIGNvbnN0IHsgaWQsIG1lc3NhZ2VJZCB9ID0gcGF5bG9hZDtcbiAgICBjb25zdCB7IHNlYXJjaENvbnZlcnNhdGlvbklkIH0gPSBzdGF0ZTtcblxuICAgIGlmIChzZWFyY2hDb252ZXJzYXRpb25JZCAmJiBzZWFyY2hDb252ZXJzYXRpb25JZCAhPT0gaWQpIHtcbiAgICAgIHJldHVybiBnZXRFbXB0eVN0YXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc2VsZWN0ZWRNZXNzYWdlOiBtZXNzYWdlSWQsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ0NPTlZFUlNBVElPTl9VTkxPQURFRCcpIHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGFjdGlvbjtcbiAgICBjb25zdCB7IGlkIH0gPSBwYXlsb2FkO1xuICAgIGNvbnN0IHsgc2VhcmNoQ29udmVyc2F0aW9uSWQgfSA9IHN0YXRlO1xuXG4gICAgaWYgKHNlYXJjaENvbnZlcnNhdGlvbklkICYmIHNlYXJjaENvbnZlcnNhdGlvbklkID09PSBpZCkge1xuICAgICAgcmV0dXJuIGdldEVtcHR5U3RhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBpZiAoYWN0aW9uLnR5cGUgPT09ICdNRVNTQUdFX0RFTEVURUQnKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlSWRzLCBtZXNzYWdlTG9va3VwIH0gPSBzdGF0ZTtcbiAgICBpZiAoIW1lc3NhZ2VJZHMgfHwgbWVzc2FnZUlkcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb247XG4gICAgY29uc3QgeyBpZCB9ID0gcGF5bG9hZDtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIG1lc3NhZ2VJZHM6IHJlamVjdChtZXNzYWdlSWRzLCBtZXNzYWdlSWQgPT4gaWQgPT09IG1lc3NhZ2VJZCksXG4gICAgICBtZXNzYWdlTG9va3VwOiBvbWl0KG1lc3NhZ2VMb29rdXAsIGlkKSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJQSxvQkFBdUM7QUFHdkMsNkJBQWdDO0FBQ2hDLHdDQUFtRDtBQUtuRCxvQkFBMEI7QUFDMUIsd0JBQTJCO0FBVzNCLG9CQUFnRDtBQUNoRCwyQkFBb0M7QUFDcEMsa0JBSU87QUFDUCxvQkFBNkI7QUFDN0IsNEJBQThDO0FBRTlDLE1BQU07QUFBQSxFQUNKLGdCQUFnQjtB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
