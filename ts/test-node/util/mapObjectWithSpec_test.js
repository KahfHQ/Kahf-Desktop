var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_chai = require("chai");
var import_mapObjectWithSpec = require("../../util/mapObjectWithSpec");
describe("mapObjectWithSpec", () => {
  const increment = /* @__PURE__ */ __name((value) => value + 1, "increment");
  it("maps a single key/value pair", () => {
    import_chai.assert.deepStrictEqual((0, import_mapObjectWithSpec.mapObjectWithSpec)("a", { a: 1 }, increment), {
      a: 2
    });
  });
  it("maps a multiple key/value pairs", () => {
    import_chai.assert.deepStrictEqual((0, import_mapObjectWithSpec.mapObjectWithSpec)(["a", "b"], { a: 1, b: 2 }, increment), { a: 2, b: 3 });
  });
  it("maps a key with a value spec", () => {
    import_chai.assert.deepStrictEqual((0, import_mapObjectWithSpec.mapObjectWithSpec)({
      key: "a",
      valueSpec: ["b", "c"]
    }, { a: { b: 1, c: 2 } }, increment), { a: { b: 2, c: 3 } });
  });
  it("maps a map with a value spec", () => {
    import_chai.assert.deepStrictEqual((0, import_mapObjectWithSpec.mapObjectWithSpec)({
      isMap: true,
      valueSpec: ["b", "c"]
    }, {
      key1: { b: 1, c: 2 },
      key2: { b: 3, c: 4 }
    }, increment), {
      key1: { b: 2, c: 3 },
      key2: { b: 4, c: 5 }
    });
  });
  it("map undefined to undefined", () => {
    import_chai.assert.deepStrictEqual((0, import_mapObjectWithSpec.mapObjectWithSpec)("a", void 0, increment), void 0);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFwT2JqZWN0V2l0aFNwZWNfdGVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHsgbWFwT2JqZWN0V2l0aFNwZWMgfSBmcm9tICcuLi8uLi91dGlsL21hcE9iamVjdFdpdGhTcGVjJztcblxuZGVzY3JpYmUoJ21hcE9iamVjdFdpdGhTcGVjJywgKCkgPT4ge1xuICBjb25zdCBpbmNyZW1lbnQgPSAodmFsdWU6IG51bWJlcikgPT4gdmFsdWUgKyAxO1xuXG4gIGl0KCdtYXBzIGEgc2luZ2xlIGtleS92YWx1ZSBwYWlyJywgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwobWFwT2JqZWN0V2l0aFNwZWMoJ2EnLCB7IGE6IDEgfSwgaW5jcmVtZW50KSwge1xuICAgICAgYTogMixcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ21hcHMgYSBtdWx0aXBsZSBrZXkvdmFsdWUgcGFpcnMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgIG1hcE9iamVjdFdpdGhTcGVjKFsnYScsICdiJ10sIHsgYTogMSwgYjogMiB9LCBpbmNyZW1lbnQpLFxuICAgICAgeyBhOiAyLCBiOiAzIH1cbiAgICApO1xuICB9KTtcblxuICBpdCgnbWFwcyBhIGtleSB3aXRoIGEgdmFsdWUgc3BlYycsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgbWFwT2JqZWN0V2l0aFNwZWMoXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdhJyxcbiAgICAgICAgICB2YWx1ZVNwZWM6IFsnYicsICdjJ10sXG4gICAgICAgIH0sXG4gICAgICAgIHsgYTogeyBiOiAxLCBjOiAyIH0gfSxcbiAgICAgICAgaW5jcmVtZW50XG4gICAgICApLFxuICAgICAgeyBhOiB7IGI6IDIsIGM6IDMgfSB9XG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoJ21hcHMgYSBtYXAgd2l0aCBhIHZhbHVlIHNwZWMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgIG1hcE9iamVjdFdpdGhTcGVjKFxuICAgICAgICB7XG4gICAgICAgICAgaXNNYXA6IHRydWUsXG4gICAgICAgICAgdmFsdWVTcGVjOiBbJ2InLCAnYyddLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5MTogeyBiOiAxLCBjOiAyIH0sXG4gICAgICAgICAga2V5MjogeyBiOiAzLCBjOiA0IH0sXG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlbWVudFxuICAgICAgKSxcbiAgICAgIHtcbiAgICAgICAga2V5MTogeyBiOiAyLCBjOiAzIH0sXG4gICAgICAgIGtleTI6IHsgYjogNCwgYzogNSB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdtYXAgdW5kZWZpbmVkIHRvIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICAgICAgbWFwT2JqZWN0V2l0aFNwZWMoJ2EnLCB1bmRlZmluZWQsIGluY3JlbWVudCksXG4gICAgICB1bmRlZmluZWRcbiAgICApO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFHQSxrQkFBdUI7QUFFdkIsK0JBQWtDO0FBRWxDLFNBQVMscUJBQXFCLE1BQU07QUFDbEMsUUFBTSxZQUFZLHdCQUFDLFVBQWtCLFFBQVEsR0FBM0I7QUFFbEIsS0FBRyxnQ0FBZ0MsTUFBTTtBQUN2Qyx1QkFBTyxnQkFBZ0IsZ0RBQWtCLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEdBQUc7QUFBQSxNQUNsRSxHQUFHO0FBQUEsSUFDTCxDQUFDO0FBQUEsRUFDSCxDQUFDO0FBRUQsS0FBRyxtQ0FBbUMsTUFBTTtBQUMxQyx1QkFBTyxnQkFDTCxnREFBa0IsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxTQUFTLEdBQ3ZELEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUNmO0FBQUEsRUFDRixDQUFDO0FBRUQsS0FBRyxnQ0FBZ0MsTUFBTTtBQUN2Qyx1QkFBTyxnQkFDTCxnREFDRTtBQUFBLE1BQ0UsS0FBSztBQUFBLE1BQ0wsV0FBVyxDQUFDLEtBQUssR0FBRztBQUFBLElBQ3RCLEdBQ0EsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQ3BCLFNBQ0YsR0FDQSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FDdEI7QUFBQSxFQUNGLENBQUM7QUFFRCxLQUFHLGdDQUFnQyxNQUFNO0FBQ3ZDLHVCQUFPLGdCQUNMLGdEQUNFO0FBQUEsTUFDRSxPQUFPO0FBQUEsTUFDUCxXQUFXLENBQUMsS0FBSyxHQUFHO0FBQUEsSUFDdEIsR0FDQTtBQUFBLE1BQ0UsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFBQSxNQUNuQixNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUFBLElBQ3JCLEdBQ0EsU0FDRixHQUNBO0FBQUEsTUFDRSxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUFBLE1BQ25CLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFO0FBQUEsSUFDckIsQ0FDRjtBQUFBLEVBQ0YsQ0FBQztBQUVELEtBQUcsOEJBQThCLE1BQU07QUFDckMsdUJBQU8sZ0JBQ0wsZ0RBQWtCLEtBQUssUUFBVyxTQUFTLEdBQzNDLE1BQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
