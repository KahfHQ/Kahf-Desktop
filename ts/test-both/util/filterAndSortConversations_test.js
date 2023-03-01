var import_chai = require("chai");
var import_getDefaultConversation = require("../helpers/getDefaultConversation");
var import_filterAndSortConversations = require("../../util/filterAndSortConversations");
describe("filterAndSortConversationsByRecent", () => {
  const conversations = [
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "+16505551234",
      activeAt: 1
    }),
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "Abraham Lincoln",
      activeAt: 4
    }),
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "Boxing Club",
      activeAt: 3
    }),
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "Not recent"
    }),
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "George Washington",
      e164: "+16505559876",
      activeAt: 2
    }),
    (0, import_getDefaultConversation.getDefaultConversation)({
      title: "A long title ending with burrito"
    })
  ];
  it("sorts by recency when no search term is provided", () => {
    const titles = (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(conversations, "", "US").map((contact) => contact.title);
    import_chai.assert.sameMembers(titles, [
      "+16505551234",
      "George Washington",
      "Boxing Club",
      "Abraham Lincoln",
      "Not recent",
      "A long title ending with burrito"
    ]);
  });
  it("finds a conversation when the search term is at the end of a long title", () => {
    const titles = (0, import_filterAndSortConversations.filterAndSortConversationsByRecent)(conversations, "burrito", "US").map((convo) => convo.title);
    import_chai.assert.deepEqual(titles, ["A long title ending with burrito"]);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZmlsdGVyQW5kU29ydENvbnZlcnNhdGlvbnNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjEgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCB7IGdldERlZmF1bHRDb252ZXJzYXRpb24gfSBmcm9tICcuLi9oZWxwZXJzL2dldERlZmF1bHRDb252ZXJzYXRpb24nO1xuXG5pbXBvcnQgeyBmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50IH0gZnJvbSAnLi4vLi4vdXRpbC9maWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9ucyc7XG5cbmRlc2NyaWJlKCdmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50JywgKCkgPT4ge1xuICBjb25zdCBjb252ZXJzYXRpb25zID0gW1xuICAgIGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgdGl0bGU6ICcrMTY1MDU1NTEyMzQnLFxuICAgICAgYWN0aXZlQXQ6IDEsXG4gICAgfSksXG4gICAgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICB0aXRsZTogJ0FicmFoYW0gTGluY29sbicsXG4gICAgICBhY3RpdmVBdDogNCxcbiAgICB9KSxcbiAgICBnZXREZWZhdWx0Q29udmVyc2F0aW9uKHtcbiAgICAgIHRpdGxlOiAnQm94aW5nIENsdWInLFxuICAgICAgYWN0aXZlQXQ6IDMsXG4gICAgfSksXG4gICAgZ2V0RGVmYXVsdENvbnZlcnNhdGlvbih7XG4gICAgICB0aXRsZTogJ05vdCByZWNlbnQnLFxuICAgIH0pLFxuICAgIGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgdGl0bGU6ICdHZW9yZ2UgV2FzaGluZ3RvbicsXG4gICAgICBlMTY0OiAnKzE2NTA1NTU5ODc2JyxcbiAgICAgIGFjdGl2ZUF0OiAyLFxuICAgIH0pLFxuICAgIGdldERlZmF1bHRDb252ZXJzYXRpb24oe1xuICAgICAgdGl0bGU6ICdBIGxvbmcgdGl0bGUgZW5kaW5nIHdpdGggYnVycml0bycsXG4gICAgfSksXG4gIF07XG5cbiAgaXQoJ3NvcnRzIGJ5IHJlY2VuY3kgd2hlbiBubyBzZWFyY2ggdGVybSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICBjb25zdCB0aXRsZXMgPSBmaWx0ZXJBbmRTb3J0Q29udmVyc2F0aW9uc0J5UmVjZW50KFxuICAgICAgY29udmVyc2F0aW9ucyxcbiAgICAgICcnLFxuICAgICAgJ1VTJ1xuICAgICkubWFwKGNvbnRhY3QgPT4gY29udGFjdC50aXRsZSk7XG4gICAgYXNzZXJ0LnNhbWVNZW1iZXJzKHRpdGxlcywgW1xuICAgICAgJysxNjUwNTU1MTIzNCcsXG4gICAgICAnR2VvcmdlIFdhc2hpbmd0b24nLFxuICAgICAgJ0JveGluZyBDbHViJyxcbiAgICAgICdBYnJhaGFtIExpbmNvbG4nLFxuICAgICAgJ05vdCByZWNlbnQnLFxuICAgICAgJ0EgbG9uZyB0aXRsZSBlbmRpbmcgd2l0aCBidXJyaXRvJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmRzIGEgY29udmVyc2F0aW9uIHdoZW4gdGhlIHNlYXJjaCB0ZXJtIGlzIGF0IHRoZSBlbmQgb2YgYSBsb25nIHRpdGxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlcyA9IGZpbHRlckFuZFNvcnRDb252ZXJzYXRpb25zQnlSZWNlbnQoXG4gICAgICBjb252ZXJzYXRpb25zLFxuICAgICAgJ2J1cnJpdG8nLFxuICAgICAgJ1VTJ1xuICAgICkubWFwKGNvbnZvID0+IGNvbnZvLnRpdGxlKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHRpdGxlcywgWydBIGxvbmcgdGl0bGUgZW5kaW5nIHdpdGggYnVycml0byddKTtcbiAgfSk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQUdBLGtCQUF1QjtBQUN2QixvQ0FBdUM7QUFFdkMsd0NBQW1EO0FBRW5ELFNBQVMsc0NBQXNDLE1BQU07QUFDbkQsUUFBTSxnQkFBZ0I7QUFBQSxJQUNwQiwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFDRCwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFDRCwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFDRCwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsSUFDVCxDQUFDO0FBQUEsSUFDRCwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFDRCwwREFBdUI7QUFBQSxNQUNyQixPQUFPO0FBQUEsSUFDVCxDQUFDO0FBQUEsRUFDSDtBQUVBLEtBQUcsb0RBQW9ELE1BQU07QUFDM0QsVUFBTSxTQUFTLDBFQUNiLGVBQ0EsSUFDQSxJQUNGLEVBQUUsSUFBSSxhQUFXLFFBQVEsS0FBSztBQUM5Qix1QkFBTyxZQUFZLFFBQVE7QUFBQSxNQUN6QjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBRUQsS0FBRywyRUFBMkUsTUFBTTtBQUNsRixVQUFNLFNBQVMsMEVBQ2IsZUFDQSxXQUNBLElBQ0YsRUFBRSxJQUFJLFdBQVMsTUFBTSxLQUFLO0FBQzFCLHVCQUFPLFVBQVUsUUFBUSxDQUFDLGtDQUFrQyxDQUFDO0FBQUEsRUFDL0QsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
