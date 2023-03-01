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
var spell_check_exports = {};
__export(spell_check_exports, {
  getLanguages: () => getLanguages,
  setup: () => setup
});
module.exports = __toCommonJS(spell_check_exports);
var import_electron = require("electron");
var import_lodash = require("lodash");
var import_url = require("url");
var import_url2 = require("../ts/util/url");
function getLanguages(userLocale, availableLocales) {
  const candidateLocales = (0, import_lodash.uniq)([userLocale, userLocale]).filter((l) => availableLocales.includes(l));
  if (candidateLocales.length > 0) {
    return candidateLocales;
  }
  const baseLocale = userLocale.split("-")[0];
  return (0, import_lodash.uniq)(availableLocales.filter((l) => l.startsWith(baseLocale)));
}
const setup = /* @__PURE__ */ __name((browserWindow, { name: userLocale, messages }) => {
  const { session } = browserWindow.webContents;
  const availableLocales = session.availableSpellCheckerLanguages;
  const languages = getLanguages(userLocale, availableLocales);
  console.log(`spellcheck: user locale: ${userLocale}`);
  console.log("spellcheck: available spellchecker languages: ", availableLocales);
  console.log("spellcheck: setting languages to: ", languages);
  session.setSpellCheckerLanguages(languages);
  browserWindow.webContents.on("context-menu", (_event, params) => {
    const { editFlags } = params;
    const isMisspelled = Boolean(params.misspelledWord);
    const isLink = Boolean(params.linkURL);
    const isImage = params.mediaType === "image" && params.hasImageContents && params.srcURL;
    const showMenu = params.isEditable || editFlags.canCopy || isLink || isImage;
    if (showMenu) {
      const template = [];
      if (isMisspelled) {
        if (params.dictionarySuggestions.length > 0) {
          template.push(...params.dictionarySuggestions.map((label) => ({
            label,
            click: () => {
              browserWindow.webContents.replaceMisspelling(label);
            }
          })));
        } else {
          template.push({
            label: messages.contextMenuNoSuggestions.message,
            enabled: false
          });
        }
        template.push({ type: "separator" });
      }
      if (params.isEditable) {
        if (editFlags.canUndo) {
          template.push({ label: messages.editMenuUndo.message, role: "undo" });
        }
        if (editFlags.canRedo) {
          template.push({ label: messages.editMenuRedo.message, role: "redo" });
        }
        if (editFlags.canUndo || editFlags.canRedo) {
          template.push({ type: "separator" });
        }
        if (editFlags.canCut) {
          template.push({ label: messages.editMenuCut.message, role: "cut" });
        }
      }
      if (editFlags.canCopy || isLink || isImage) {
        let click;
        let label;
        if (isLink) {
          click = /* @__PURE__ */ __name(() => {
            import_electron.clipboard.writeText(params.linkURL);
          }, "click");
          label = messages.contextMenuCopyLink.message;
        } else if (isImage) {
          click = /* @__PURE__ */ __name(() => {
            const parsedSrcUrl = (0, import_url2.maybeParseUrl)(params.srcURL);
            if (!parsedSrcUrl || parsedSrcUrl.protocol !== "file:") {
              return;
            }
            const image = import_electron.nativeImage.createFromPath((0, import_url.fileURLToPath)(params.srcURL));
            import_electron.clipboard.writeImage(image);
          }, "click");
          label = messages.contextMenuCopyImage.message;
        } else {
          label = messages.editMenuCopy.message;
        }
        template.push({
          label,
          role: isLink || isImage ? void 0 : "copy",
          click
        });
      }
      if (editFlags.canPaste && !isImage) {
        template.push({ label: messages.editMenuPaste.message, role: "paste" });
      }
      if (editFlags.canPaste && !isImage) {
        template.push({
          label: messages.editMenuPasteAndMatchStyle.message,
          role: "pasteAndMatchStyle"
        });
      }
      if (editFlags.canSelectAll && params.isEditable) {
        template.push({
          label: messages.editMenuSelectAll.message,
          role: "selectAll"
        });
      }
      const menu = import_electron.Menu.buildFromTemplate(template);
      menu.popup({
        window: browserWindow
      });
    }
  });
}, "setup");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getLanguages,
  setup
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3BlbGxfY2hlY2sudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAyMDIwLTIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBNZW51LCBjbGlwYm9hcmQsIG5hdGl2ZUltYWdlIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcblxuaW1wb3J0IHsgbWF5YmVQYXJzZVVybCB9IGZyb20gJy4uL3RzL3V0aWwvdXJsJztcbmltcG9ydCB0eXBlIHsgTG9jYWxlVHlwZSB9IGZyb20gJy4vbG9jYWxlJztcblxuaW1wb3J0IHR5cGUgeyBNZW51TGlzdFR5cGUgfSBmcm9tICcuLi90cy90eXBlcy9tZW51JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhbmd1YWdlcyhcbiAgdXNlckxvY2FsZTogc3RyaW5nLFxuICBhdmFpbGFibGVMb2NhbGVzOiBSZWFkb25seUFycmF5PHN0cmluZz5cbik6IEFycmF5PHN0cmluZz4ge1xuICAvLyBGaXJzdCBhdHRlbXB0IHRvIGZpbmQgdGhlIGV4YWN0IGxvY2FsZVxuICBjb25zdCBjYW5kaWRhdGVMb2NhbGVzID0gdW5pcShbdXNlckxvY2FsZSwgdXNlckxvY2FsZV0pLmZpbHRlcihsID0+XG4gICAgYXZhaWxhYmxlTG9jYWxlcy5pbmNsdWRlcyhsKVxuICApO1xuICBpZiAoY2FuZGlkYXRlTG9jYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZUxvY2FsZXM7XG4gIH1cblxuICAvLyBJZiBubyBsYW5ndWFnZXMgd2VyZSBmb3VuZCB0aGVuIHJldHVybiBhbGwgbG9jYWxlcyB0aGF0IHN0YXJ0IHdpdGggdGhlIGJhc2VcbiAgY29uc3QgYmFzZUxvY2FsZSA9IHVzZXJMb2NhbGUuc3BsaXQoJy0nKVswXTtcbiAgcmV0dXJuIHVuaXEoYXZhaWxhYmxlTG9jYWxlcy5maWx0ZXIobCA9PiBsLnN0YXJ0c1dpdGgoYmFzZUxvY2FsZSkpKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNldHVwID0gKFxuICBicm93c2VyV2luZG93OiBCcm93c2VyV2luZG93LFxuICB7IG5hbWU6IHVzZXJMb2NhbGUsIG1lc3NhZ2VzIH06IExvY2FsZVR5cGVcbik6IHZvaWQgPT4ge1xuICBjb25zdCB7IHNlc3Npb24gfSA9IGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHM7XG4gIGNvbnN0IGF2YWlsYWJsZUxvY2FsZXMgPSBzZXNzaW9uLmF2YWlsYWJsZVNwZWxsQ2hlY2tlckxhbmd1YWdlcztcbiAgY29uc3QgbGFuZ3VhZ2VzID0gZ2V0TGFuZ3VhZ2VzKHVzZXJMb2NhbGUsIGF2YWlsYWJsZUxvY2FsZXMpO1xuICBjb25zb2xlLmxvZyhgc3BlbGxjaGVjazogdXNlciBsb2NhbGU6ICR7dXNlckxvY2FsZX1gKTtcbiAgY29uc29sZS5sb2coXG4gICAgJ3NwZWxsY2hlY2s6IGF2YWlsYWJsZSBzcGVsbGNoZWNrZXIgbGFuZ3VhZ2VzOiAnLFxuICAgIGF2YWlsYWJsZUxvY2FsZXNcbiAgKTtcbiAgY29uc29sZS5sb2coJ3NwZWxsY2hlY2s6IHNldHRpbmcgbGFuZ3VhZ2VzIHRvOiAnLCBsYW5ndWFnZXMpO1xuICBzZXNzaW9uLnNldFNwZWxsQ2hlY2tlckxhbmd1YWdlcyhsYW5ndWFnZXMpO1xuXG4gIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMub24oJ2NvbnRleHQtbWVudScsIChfZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHsgZWRpdEZsYWdzIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgaXNNaXNzcGVsbGVkID0gQm9vbGVhbihwYXJhbXMubWlzc3BlbGxlZFdvcmQpO1xuICAgIGNvbnN0IGlzTGluayA9IEJvb2xlYW4ocGFyYW1zLmxpbmtVUkwpO1xuICAgIGNvbnN0IGlzSW1hZ2UgPVxuICAgICAgcGFyYW1zLm1lZGlhVHlwZSA9PT0gJ2ltYWdlJyAmJiBwYXJhbXMuaGFzSW1hZ2VDb250ZW50cyAmJiBwYXJhbXMuc3JjVVJMO1xuICAgIGNvbnN0IHNob3dNZW51ID1cbiAgICAgIHBhcmFtcy5pc0VkaXRhYmxlIHx8IGVkaXRGbGFncy5jYW5Db3B5IHx8IGlzTGluayB8fCBpc0ltYWdlO1xuXG4gICAgLy8gUG9wdXAgZWRpdG9yIG1lbnVcbiAgICBpZiAoc2hvd01lbnUpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlOiBNZW51TGlzdFR5cGUgPSBbXTtcblxuICAgICAgaWYgKGlzTWlzc3BlbGxlZCkge1xuICAgICAgICBpZiAocGFyYW1zLmRpY3Rpb25hcnlTdWdnZXN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGVtcGxhdGUucHVzaChcbiAgICAgICAgICAgIC4uLnBhcmFtcy5kaWN0aW9uYXJ5U3VnZ2VzdGlvbnMubWFwKGxhYmVsID0+ICh7XG4gICAgICAgICAgICAgIGxhYmVsLFxuICAgICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMucmVwbGFjZU1pc3NwZWxsaW5nKGxhYmVsKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGVtcGxhdGUucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbWVzc2FnZXMuY29udGV4dE1lbnVOb1N1Z2dlc3Rpb25zLm1lc3NhZ2UsXG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZS5wdXNoKHsgdHlwZTogJ3NlcGFyYXRvcicgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbXMuaXNFZGl0YWJsZSkge1xuICAgICAgICBpZiAoZWRpdEZsYWdzLmNhblVuZG8pIHtcbiAgICAgICAgICB0ZW1wbGF0ZS5wdXNoKHsgbGFiZWw6IG1lc3NhZ2VzLmVkaXRNZW51VW5kby5tZXNzYWdlLCByb2xlOiAndW5kbycgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyBvbmx5IGV2ZXIgYHRydWVgIGlmIHVuZG8gd2FzIHRyaWdnZXJlZCB2aWEgdGhlIGNvbnRleHQgbWVudVxuICAgICAgICAvLyAobm90IGN0cmwvY21kK3opXG4gICAgICAgIGlmIChlZGl0RmxhZ3MuY2FuUmVkbykge1xuICAgICAgICAgIHRlbXBsYXRlLnB1c2goeyBsYWJlbDogbWVzc2FnZXMuZWRpdE1lbnVSZWRvLm1lc3NhZ2UsIHJvbGU6ICdyZWRvJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWRpdEZsYWdzLmNhblVuZG8gfHwgZWRpdEZsYWdzLmNhblJlZG8pIHtcbiAgICAgICAgICB0ZW1wbGF0ZS5wdXNoKHsgdHlwZTogJ3NlcGFyYXRvcicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVkaXRGbGFncy5jYW5DdXQpIHtcbiAgICAgICAgICB0ZW1wbGF0ZS5wdXNoKHsgbGFiZWw6IG1lc3NhZ2VzLmVkaXRNZW51Q3V0Lm1lc3NhZ2UsIHJvbGU6ICdjdXQnIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlZGl0RmxhZ3MuY2FuQ29weSB8fCBpc0xpbmsgfHwgaXNJbWFnZSkge1xuICAgICAgICBsZXQgY2xpY2s7XG4gICAgICAgIGxldCBsYWJlbDtcblxuICAgICAgICBpZiAoaXNMaW5rKSB7XG4gICAgICAgICAgY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGlwYm9hcmQud3JpdGVUZXh0KHBhcmFtcy5saW5rVVJMKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxhYmVsID0gbWVzc2FnZXMuY29udGV4dE1lbnVDb3B5TGluay5tZXNzYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSW1hZ2UpIHtcbiAgICAgICAgICBjbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFNyY1VybCA9IG1heWJlUGFyc2VVcmwocGFyYW1zLnNyY1VSTCk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlZFNyY1VybCB8fCBwYXJzZWRTcmNVcmwucHJvdG9jb2wgIT09ICdmaWxlOicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbWFnZSA9IG5hdGl2ZUltYWdlLmNyZWF0ZUZyb21QYXRoKFxuICAgICAgICAgICAgICBmaWxlVVJMVG9QYXRoKHBhcmFtcy5zcmNVUkwpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY2xpcGJvYXJkLndyaXRlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgbGFiZWwgPSBtZXNzYWdlcy5jb250ZXh0TWVudUNvcHlJbWFnZS5tZXNzYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhYmVsID0gbWVzc2FnZXMuZWRpdE1lbnVDb3B5Lm1lc3NhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICB0ZW1wbGF0ZS5wdXNoKHtcbiAgICAgICAgICBsYWJlbCxcbiAgICAgICAgICByb2xlOiBpc0xpbmsgfHwgaXNJbWFnZSA/IHVuZGVmaW5lZCA6ICdjb3B5JyxcbiAgICAgICAgICBjbGljayxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlZGl0RmxhZ3MuY2FuUGFzdGUgJiYgIWlzSW1hZ2UpIHtcbiAgICAgICAgdGVtcGxhdGUucHVzaCh7IGxhYmVsOiBtZXNzYWdlcy5lZGl0TWVudVBhc3RlLm1lc3NhZ2UsIHJvbGU6ICdwYXN0ZScgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlZGl0RmxhZ3MuY2FuUGFzdGUgJiYgIWlzSW1hZ2UpIHtcbiAgICAgICAgdGVtcGxhdGUucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IG1lc3NhZ2VzLmVkaXRNZW51UGFzdGVBbmRNYXRjaFN0eWxlLm1lc3NhZ2UsXG4gICAgICAgICAgcm9sZTogJ3Bhc3RlQW5kTWF0Y2hTdHlsZScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IGVuYWJsZSBzZWxlY3QgYWxsIGluIGVkaXRvcnMgYmVjYXVzZSBzZWxlY3QgYWxsIGluIG5vbi1lZGl0b3JzXG4gICAgICAvLyByZXN1bHRzIGluIGFsbCB0aGUgVUkgYmVpbmcgc2VsZWN0ZWRcbiAgICAgIGlmIChlZGl0RmxhZ3MuY2FuU2VsZWN0QWxsICYmIHBhcmFtcy5pc0VkaXRhYmxlKSB7XG4gICAgICAgIHRlbXBsYXRlLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiBtZXNzYWdlcy5lZGl0TWVudVNlbGVjdEFsbC5tZXNzYWdlLFxuICAgICAgICAgIHJvbGU6ICdzZWxlY3RBbGwnLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgICAgbWVudS5wb3B1cCh7XG4gICAgICAgIHdpbmRvdzogYnJvd3NlcldpbmRvdyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUEsc0JBQTZDO0FBQzdDLG9CQUFxQjtBQUNyQixpQkFBOEI7QUFFOUIsa0JBQThCO0FBS3ZCLHNCQUNMLFlBQ0Esa0JBQ2U7QUFFZixRQUFNLG1CQUFtQix3QkFBSyxDQUFDLFlBQVksVUFBVSxDQUFDLEVBQUUsT0FBTyxPQUM3RCxpQkFBaUIsU0FBUyxDQUFDLENBQzdCO0FBQ0EsTUFBSSxpQkFBaUIsU0FBUyxHQUFHO0FBQy9CLFdBQU87QUFBQSxFQUNUO0FBR0EsUUFBTSxhQUFhLFdBQVcsTUFBTSxHQUFHLEVBQUU7QUFDekMsU0FBTyx3QkFBSyxpQkFBaUIsT0FBTyxPQUFLLEVB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
