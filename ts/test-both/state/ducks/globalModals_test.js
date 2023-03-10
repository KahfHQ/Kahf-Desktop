var import_chai = require("chai");
var import_globalModals = require("../../../state/ducks/globalModals");
describe("both/state/ducks/globalModals", () => {
  describe("toggleProfileEditor", () => {
    const { toggleProfileEditor } = import_globalModals.actions;
    it("toggles isProfileEditorVisible", () => {
      const state = (0, import_globalModals.getEmptyState)();
      const nextState = (0, import_globalModals.reducer)(state, toggleProfileEditor());
      import_chai.assert.isTrue(nextState.isProfileEditorVisible);
      const nextNextState = (0, import_globalModals.reducer)(nextState, toggleProfileEditor());
      import_chai.assert.isFalse(nextNextState.isProfileEditorVisible);
    });
  });
  describe("showWhatsNewModal/hideWhatsNewModal", () => {
    const { showWhatsNewModal, hideWhatsNewModal } = import_globalModals.actions;
    it("toggles isWhatsNewVisible to true", () => {
      const state = (0, import_globalModals.getEmptyState)();
      const nextState = (0, import_globalModals.reducer)(state, showWhatsNewModal());
      import_chai.assert.isTrue(nextState.isWhatsNewVisible);
      const nextNextState = (0, import_globalModals.reducer)(nextState, hideWhatsNewModal());
      import_chai.assert.isFalse(nextNextState.isWhatsNewVisible);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2xvYmFsTW9kYWxzX3Rlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7XG4gIGFjdGlvbnMsXG4gIGdldEVtcHR5U3RhdGUsXG4gIHJlZHVjZXIsXG59IGZyb20gJy4uLy4uLy4uL3N0YXRlL2R1Y2tzL2dsb2JhbE1vZGFscyc7XG5cbmRlc2NyaWJlKCdib3RoL3N0YXRlL2R1Y2tzL2dsb2JhbE1vZGFscycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3RvZ2dsZVByb2ZpbGVFZGl0b3InLCAoKSA9PiB7XG4gICAgY29uc3QgeyB0b2dnbGVQcm9maWxlRWRpdG9yIH0gPSBhY3Rpb25zO1xuXG4gICAgaXQoJ3RvZ2dsZXMgaXNQcm9maWxlRWRpdG9yVmlzaWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gZ2V0RW1wdHlTdGF0ZSgpO1xuICAgICAgY29uc3QgbmV4dFN0YXRlID0gcmVkdWNlcihzdGF0ZSwgdG9nZ2xlUHJvZmlsZUVkaXRvcigpKTtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShuZXh0U3RhdGUuaXNQcm9maWxlRWRpdG9yVmlzaWJsZSk7XG5cbiAgICAgIGNvbnN0IG5leHROZXh0U3RhdGUgPSByZWR1Y2VyKG5leHRTdGF0ZSwgdG9nZ2xlUHJvZmlsZUVkaXRvcigpKTtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UobmV4dE5leHRTdGF0ZS5pc1Byb2ZpbGVFZGl0b3JWaXNpYmxlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Nob3dXaGF0c05ld01vZGFsL2hpZGVXaGF0c05ld01vZGFsJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgc2hvd1doYXRzTmV3TW9kYWwsIGhpZGVXaGF0c05ld01vZGFsIH0gPSBhY3Rpb25zO1xuXG4gICAgaXQoJ3RvZ2dsZXMgaXNXaGF0c05ld1Zpc2libGUgdG8gdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gZ2V0RW1wdHlTdGF0ZSgpO1xuICAgICAgY29uc3QgbmV4dFN0YXRlID0gcmVkdWNlcihzdGF0ZSwgc2hvd1doYXRzTmV3TW9kYWwoKSk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUobmV4dFN0YXRlLmlzV2hhdHNOZXdWaXNpYmxlKTtcblxuICAgICAgY29uc3QgbmV4dE5leHRTdGF0ZSA9IHJlZHVjZXIobmV4dFN0YXRlLCBoaWRlV2hhdHNOZXdNb2RhbCgpKTtcblxuICAgICAgYXNzZXJ0LmlzRmFsc2UobmV4dE5leHRTdGF0ZS5pc1doYXRzTmV3VmlzaWJsZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFHQSxrQkFBdUI7QUFFdkIsMEJBSU87QUFFUCxTQUFTLGlDQUFpQyxNQUFNO0FBQzlDLFdBQVMsdUJBQXVCLE1BQU07QUFDcEMsVUFBTSxFQUFFLHdCQUF3QjtBQUVoQyxPQUFHLGtDQUFrQyxNQUFNO0FBQ3pDLFlBQU0sUUFBUSx1Q0FBYztBQUM1QixZQUFNLFlBQVksaUNBQVEsT0FBTyxvQkFBb0IsQ0FBQztBQUV0RCx5QkFBTyxPQUFPLFVBQVUsc0JBQXNCO0FBRTlDLFlBQU0sZ0JBQWdCLGlDQUFRLFdBQVcsb0JBQW9CLENBQUM7QUFFOUQseUJBQU8sUUFBUSxjQUFjLHNCQUFzQjtBQUFBLElBQ3JELENBQUM7QUFBQSxFQUNILENBQUM7QUFFRCxXQUFTLHVDQUF1QyxNQUFNO0FBQ3BELFVBQU0sRUFBRSxtQkFBbUIsc0JBQXNCO0FBRWpELE9BQUcscUNBQXFDLE1BQU07QUFDNUMsWUFBTSxRQUFRLHVDQUFjO0FBQzVCLFlBQU0sWUFBWSxpQ0FBUSxPQUFPLGtCQUFrQixDQUFDO0FBRXBELHlCQUFPLE9BQU8sVUFBVSxpQkFBaUI7QUFFekMsWUFBTSxnQkFBZ0IsaUNBQVEsV0FBVyxrQkFBa0IsQ0FBQztBQUU1RCx5QkFBTyxRQUFRLGNBQWMsaUJBQWlCO0FBQUEsSUFDaEQsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
