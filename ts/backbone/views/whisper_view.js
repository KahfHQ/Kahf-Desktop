(function() {
  window.Whisper = window.Whisper || {};
  window.Whisper.View = Backbone.View.extend({
    constructor(...params) {
      window.Backbone.View.call(this, ...params);
      window.Mustache.parse(_.result(this, "template"));
    },
    render_attributes() {
      return _.result(this.model, "attributes", {});
    },
    render() {
      const attrs = window._.result(this, "render_attributes", {});
      const template = window._.result(this, "template", "");
      this.$el.html(window.Mustache.render(template, attrs));
      return this;
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2hpc3Blcl92aWV3LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAxNS0yMDIxIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLypcbiAqIERlZmluZXMgYSBkZWZhdWx0IGRlZmluaXRpb24gZm9yIHJlbmRlcigpIHdoaWNoIGFsbG93cyBzdWItY2xhc3Nlc1xuICogdG8gc2ltcGx5IHNwZWNpZnkgYSB0ZW1wbGF0ZSBwcm9wZXJ0eSBhbmQgcmVuZGVyQXR0cmlidXRlcyB3aGljaCBhcmUgcGx1Z2dlZFxuICogaW50byBNdXN0YWNoZS5yZW5kZXJcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuKGZ1bmN0aW9uICgpIHtcbiAgd2luZG93LldoaXNwZXIgPSB3aW5kb3cuV2hpc3BlciB8fCB7fTtcblxuICB3aW5kb3cuV2hpc3Blci5WaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zOiBBcnJheTxhbnk+KSB7XG4gICAgICB3aW5kb3cuQmFja2JvbmUuVmlldy5jYWxsKHRoaXMsIC4uLnBhcmFtcyk7XG5cbiAgICAgIC8vIENoZWNrcyBmb3Igc3ludGF4IGVycm9yc1xuICAgICAgd2luZG93Lk11c3RhY2hlLnBhcnNlKF8ucmVzdWx0KHRoaXMsICd0ZW1wbGF0ZScpKTtcbiAgICB9LFxuICAgIHJlbmRlcl9hdHRyaWJ1dGVzKCkge1xuICAgICAgcmV0dXJuIF8ucmVzdWx0KHRoaXMubW9kZWwsICdhdHRyaWJ1dGVzJywge30pO1xuICAgIH0sXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgYXR0cnMgPSB3aW5kb3cuXy5yZXN1bHQodGhpcywgJ3JlbmRlcl9hdHRyaWJ1dGVzJywge30pO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSB3aW5kb3cuXy5yZXN1bHQodGhpcywgJ3RlbXBsYXRlJywgJycpO1xuICAgICAgdGhpcy4kZWwuaHRtbCh3aW5kb3cuTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBhdHRycykpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgfSk7XG59KSgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBVUEsQUFBQyxZQUFZO0FBQ1gsU0FBTyxVQUFVLE9BQU8sV0FBVyxDQUFDO0FBRXBDLFNBQU8sUUFBUSxPQUFPLFNBQVMsS0FBSyxPQUFPO0FBQUEsSUFFekMsZUFBZSxRQUFvQjtBQUNqQyxhQUFPLFNBQVMsS0FBSyxLQUFLLE1BQU0sR0FBRyxNQUFNO0FBR3pDLGFBQU8sU0FBUyxNQUFNLEVBQUUsT0FBTyxNQUFNLFVBQVUsQ0FBQztBQUFBLElBQ2xEO0FBQUEsSUFDQSxvQkFBb0I7QUFDbEIsYUFBTyxFQUFFLE9BQU8sS0FBSyxPQUFPLGNBQWMsQ0FBQyxDQUFDO0FBQUEsSUFDOUM7QUFBQSxJQUNBLFNBQVM7QUFDUCxZQUFNLFFBQVEsT0FBTyxFQUFFLE9BQU8sTUFBTSxxQkFBcUIsQ0FBQyxDQUFDO0FBQzNELFlBQU0sV0FBVyxPQUFPLEVBQUUsT0FBTyxNQUFNLFlBQVksRUFBRTtBQUNyRCxXQUFLLElBQUksS0FBSyxPQUFPLFNBQVMsT0FBTyxVQUFVLEtBQUssQ0FBQztBQUNyRCxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUNILEdBQUc7IiwKICAibmFtZXMiOiBbXQp9Cg==
