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
var showLightbox_exports = {};
__export(showLightbox_exports, {
  closeLightbox: () => closeLightbox,
  showLightbox: () => showLightbox
});
module.exports = __toCommonJS(showLightbox_exports);
var import_react = __toESM(require("react"));
var import_react_dom = require("react-dom");
var import_Lightbox = require("../components/Lightbox");
let lightboxMountNode;
function closeLightbox() {
  if (!lightboxMountNode) {
    return;
  }
  window.ReactDOM.unmountComponentAtNode(lightboxMountNode);
  document.body.removeChild(lightboxMountNode);
  lightboxMountNode = void 0;
}
function showLightbox(props) {
  if (lightboxMountNode) {
    closeLightbox();
  }
  lightboxMountNode = document.createElement("div");
  lightboxMountNode.setAttribute("data-id", "lightbox");
  document.body.appendChild(lightboxMountNode);
  (0, import_react_dom.render)(/* @__PURE__ */ import_react.default.createElement(import_Lightbox.Lightbox, {
    ...props
  }), lightboxMountNode);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeLightbox,
  showLightbox
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2hvd0xpZ2h0Ym94LnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB0eXBlIHsgUHJvcHNUeXBlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9MaWdodGJveCc7XG5pbXBvcnQgeyBMaWdodGJveCB9IGZyb20gJy4uL2NvbXBvbmVudHMvTGlnaHRib3gnO1xuXG4vLyBOT1RFOiBUaGlzIGZpbGUgaXMgdGVtcG9yYXJpbHkgaGVyZSBmb3IgY29udmVuaWNlbmNlIG9mIHVzZSBieVxuLy8gY29udmVyc2F0aW9uX3ZpZXcgd2hpbGUgaXQgaXMgdHJhbnNpdGlvbmluZyBmcm9tIEJhY2tib25lIGludG8gcHVyZSBSZWFjdC5cbi8vIFBsZWFzZSB1c2UgPExpZ2h0Ym94IC8+IGRpcmVjdGx5IGFuZCBETyBOT1QgVVNFIFRIRVNFIEZVTkNUSU9OUy5cblxubGV0IGxpZ2h0Ym94TW91bnROb2RlOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlTGlnaHRib3goKTogdm9pZCB7XG4gIGlmICghbGlnaHRib3hNb3VudE5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3aW5kb3cuUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShsaWdodGJveE1vdW50Tm9kZSk7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGlnaHRib3hNb3VudE5vZGUpO1xuICBsaWdodGJveE1vdW50Tm9kZSA9IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dMaWdodGJveChwcm9wczogUHJvcHNUeXBlKTogdm9pZCB7XG4gIGlmIChsaWdodGJveE1vdW50Tm9kZSkge1xuICAgIGNsb3NlTGlnaHRib3goKTtcbiAgfVxuXG4gIGxpZ2h0Ym94TW91bnROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxpZ2h0Ym94TW91bnROb2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsICdsaWdodGJveCcpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpZ2h0Ym94TW91bnROb2RlKTtcblxuICByZW5kZXIoPExpZ2h0Ym94IHsuLi5wcm9wc30gLz4sIGxpZ2h0Ym94TW91bnROb2RlKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQjtBQUNsQix1QkFBdUI7QUFFdkIsc0JBQXlCO0FBTXpCLElBQUk7QUFFRyx5QkFBK0I7QUFDcEMsTUFBSSxDQUFDLG1CQUFtQjtBQUN0QjtBQUFBLEVBQ0Y7QUFFQSxTQUFPLFNBQVMsdUJBQXVCLGlCQUFpQjtBQUN4RCxXQUFTLEtBQUssWUFBWSxpQkFBaUI7QUFDM0Msc0JBQW9CO0FBQ3RCO0FBUmdCLEFBVVQsc0JBQXNCLE9BQXdCO0FBQ25ELE1BQUksbUJBQW1CO0FBQ3JCLGtCQUFjO0FBQUEsRUFDaEI7QUFFQSxzQkFBb0IsU0FBUyxjQUFjLEtBQUs7QUFDaEQsb0JBQWtCLGFBQWEsV0FBVyxVQUFVO0FBQ3BELFdBQVMsS0FBSyxZQUFZLGlCQUFpQjtBQUUzQywrQkFBTyxtREFBQztBQUFBLE9BQWE7QUFBQSxHQUFPLEdBQUksaUJBQWlCO0FBQ25EO0FBVmdCIiwKICAibmFtZXMiOiBbXQp9Cg==
