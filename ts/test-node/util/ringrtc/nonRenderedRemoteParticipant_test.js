var import_chai = require("chai");
var import_nonRenderedRemoteParticipant = require("../../../util/ringrtc/nonRenderedRemoteParticipant");
describe("nonRenderedRemoteParticipant", () => {
  it("returns a video request object a width and height of 0", () => {
    import_chai.assert.deepEqual((0, import_nonRenderedRemoteParticipant.nonRenderedRemoteParticipant)({ demuxId: 123 }), {
      demuxId: 123,
      width: 0,
      height: 0
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9uUmVuZGVyZWRSZW1vdGVQYXJ0aWNpcGFudF90ZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMCBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgeyBub25SZW5kZXJlZFJlbW90ZVBhcnRpY2lwYW50IH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9yaW5ncnRjL25vblJlbmRlcmVkUmVtb3RlUGFydGljaXBhbnQnO1xuXG5kZXNjcmliZSgnbm9uUmVuZGVyZWRSZW1vdGVQYXJ0aWNpcGFudCcsICgpID0+IHtcbiAgaXQoJ3JldHVybnMgYSB2aWRlbyByZXF1ZXN0IG9iamVjdCBhIHdpZHRoIGFuZCBoZWlnaHQgb2YgMCcsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKG5vblJlbmRlcmVkUmVtb3RlUGFydGljaXBhbnQoeyBkZW11eElkOiAxMjMgfSksIHtcbiAgICAgIGRlbXV4SWQ6IDEyMyxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0Esa0JBQXVCO0FBRXZCLDBDQUE2QztBQUU3QyxTQUFTLGdDQUFnQyxNQUFNO0FBQzdDLEtBQUcsMERBQTBELE1BQU07QUFDakUsdUJBQU8sVUFBVSxzRUFBNkIsRUFBRSxTQUFTLElBQUksQ0FBQyxHQUFHO0FBQUEsTUFDL0QsU0FBUztBQUFBLE1BQ1QsT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==