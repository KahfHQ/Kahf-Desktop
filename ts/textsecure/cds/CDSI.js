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
var CDSI_exports = {};
__export(CDSI_exports, {
  CDSI: () => CDSI
});
module.exports = __toCommonJS(CDSI_exports);
var Bytes = __toESM(require("../../Bytes"));
var import_CDSISocket = require("./CDSISocket");
var import_CDSSocketManagerBase = require("./CDSSocketManagerBase");
class CDSI extends import_CDSSocketManagerBase.CDSSocketManagerBase {
  constructor(options) {
    super(options);
    this.mrenclave = Buffer.from(Bytes.fromHex(options.mrenclave));
  }
  getSocketUrl() {
    const { mrenclave } = this.options;
    return `${this.options.url}/v1/${mrenclave}/discovery`;
  }
  createSocket(socket) {
    return new import_CDSISocket.CDSISocket({
      logger: this.logger,
      socket,
      mrenclave: this.mrenclave
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CDSI
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ0RTSS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgdHlwZSB7IGNvbm5lY3Rpb24gYXMgV2ViU29ja2V0IH0gZnJvbSAnd2Vic29ja2V0JztcblxuaW1wb3J0ICogYXMgQnl0ZXMgZnJvbSAnLi4vLi4vQnl0ZXMnO1xuaW1wb3J0IHsgQ0RTSVNvY2tldCB9IGZyb20gJy4vQ0RTSVNvY2tldCc7XG5pbXBvcnQgdHlwZSB7IENEU1NvY2tldE1hbmFnZXJCYXNlT3B0aW9uc1R5cGUgfSBmcm9tICcuL0NEU1NvY2tldE1hbmFnZXJCYXNlJztcbmltcG9ydCB7IENEU1NvY2tldE1hbmFnZXJCYXNlIH0gZnJvbSAnLi9DRFNTb2NrZXRNYW5hZ2VyQmFzZSc7XG5cbmV4cG9ydCB0eXBlIENEU0lPcHRpb25zVHlwZSA9IFJlYWRvbmx5PHtcbiAgbXJlbmNsYXZlOiBzdHJpbmc7XG59PiAmXG4gIENEU1NvY2tldE1hbmFnZXJCYXNlT3B0aW9uc1R5cGU7XG5cbmV4cG9ydCBjbGFzcyBDRFNJIGV4dGVuZHMgQ0RTU29ja2V0TWFuYWdlckJhc2U8Q0RTSVNvY2tldCwgQ0RTSU9wdGlvbnNUeXBlPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbXJlbmNsYXZlOiBCdWZmZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQ0RTSU9wdGlvbnNUeXBlKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLm1yZW5jbGF2ZSA9IEJ1ZmZlci5mcm9tKEJ5dGVzLmZyb21IZXgob3B0aW9ucy5tcmVuY2xhdmUpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRTb2NrZXRVcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IG1yZW5jbGF2ZSB9ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgcmV0dXJuIGAke3RoaXMub3B0aW9ucy51cmx9L3YxLyR7bXJlbmNsYXZlfS9kaXNjb3ZlcnlgO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGNyZWF0ZVNvY2tldChzb2NrZXQ6IFdlYlNvY2tldCk6IENEU0lTb2NrZXQge1xuICAgIHJldHVybiBuZXcgQ0RTSVNvY2tldCh7XG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgICAgc29ja2V0LFxuICAgICAgbXJlbmNsYXZlOiB0aGlzLm1yZW5jbGF2ZSxcbiAgICB9KTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBLFlBQXVCO0FBQ3ZCLHdCQUEyQjtBQUUzQixrQ0FBcUM7QUFPOUIsTUFBTSxhQUFhLGlEQUFrRDtBQUFBLEVBRzFFLFlBQVksU0FBMEI7QUFDcEMsVUFBTSxPQUFPO0FBRWIsU0FBSyxZQUFZLE9BQU8sS0FBSyxNQUFNLFFBQVEsUUFBUSxTQUFTLENBQUM7QUFBQSxFQUMvRDtBQUFBLEVBRW1CLGVBQXVCO0FBQ3hDLFVBQU0sRUFBRSxjQUFjLEtBQUs7QUFFM0IsV0FBTyxHQUFHLEtBQUssUUFBUSxVQUFVO0FBQUEsRUFDbkM7QUFBQSxFQUVtQixhQUFhLFFBQStCO0FBQzdELFdBQU8sSUFBSSw2QkFBVztBQUFBLE1BQ3BCLFFBQVEsS0FBSztBQUFBLE1BQ2I7QUFBQSxNQUNBLFdBQVcsS0FBSztBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNIO0FBQ0Y7QUF0Qk8iLAogICJuYW1lcyI6IFtdCn0K
