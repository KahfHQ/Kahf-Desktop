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
var CDSISocket_exports = {};
__export(CDSISocket_exports, {
  CDSISocket: () => CDSISocket
});
module.exports = __toCommonJS(CDSISocket_exports);
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_assert = require("../../util/assert");
var import_protobuf = require("../../protobuf");
var import_CDSSocketBase = require("./CDSSocketBase");
class CDSISocket extends import_CDSSocketBase.CDSSocketBase {
  async handshake() {
    (0, import_assert.strictAssert)(this.state === import_CDSSocketBase.CDSSocketState.Open, "CDSI handshake called twice");
    this.state = import_CDSSocketBase.CDSSocketState.Handshake;
    {
      const { done, value: attestationMessage } = await this.socketIterator.next();
      (0, import_assert.strictAssert)(!done, "CDSI socket closed before handshake");
      const earliestValidTimestamp = new Date();
      (0, import_assert.strictAssert)(this.privCdsClient === void 0, "CDSI handshake called twice");
      this.privCdsClient = import_libsignal_client.Cds2Client.new(this.options.mrenclave, attestationMessage, earliestValidTimestamp);
    }
    this.socket.sendBytes(this.cdsClient.initialRequest());
    {
      const { done, value: message } = await this.socketIterator.next();
      (0, import_assert.strictAssert)(!done, "CDSI socket expected handshake data");
      this.cdsClient.completeHandshake(message);
    }
    this.state = import_CDSSocketBase.CDSSocketState.Established;
  }
  async sendRequest(_version, request) {
    this.socket.sendBytes(this.cdsClient.establishedSend(request));
    const { done, value: ciphertext } = await this.socketIterator.next();
    (0, import_assert.strictAssert)(!done, "CDSISocket.sendRequest(): expected token message");
    const message = await this.decryptResponse(ciphertext);
    this.logger.info("CDSISocket.sendRequest(): processing token message");
    const { token } = import_protobuf.SignalService.CDSClientResponse.decode(message);
    (0, import_assert.strictAssert)(token, "CDSISocket.sendRequest(): expected token");
    this.socket.sendBytes(this.cdsClient.establishedSend(Buffer.from(import_protobuf.SignalService.CDSClientRequest.encode({
      tokenAck: true
    }).finish())));
  }
  async decryptResponse(ciphertext) {
    return this.cdsClient.establishedRecv(ciphertext);
  }
  get cdsClient() {
    (0, import_assert.strictAssert)(this.privCdsClient, "CDSISocket did not start handshake");
    return this.privCdsClient;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CDSISocket
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQ0RTSVNvY2tldC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBDZHMyQ2xpZW50IH0gZnJvbSAnQHNpZ25hbGFwcC9saWJzaWduYWwtY2xpZW50JztcblxuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgU2lnbmFsU2VydmljZSBhcyBQcm90byB9IGZyb20gJy4uLy4uL3Byb3RvYnVmJztcbmltcG9ydCB7IENEU1NvY2tldEJhc2UsIENEU1NvY2tldFN0YXRlIH0gZnJvbSAnLi9DRFNTb2NrZXRCYXNlJztcbmltcG9ydCB0eXBlIHsgQ0RTU29ja2V0QmFzZU9wdGlvbnNUeXBlIH0gZnJvbSAnLi9DRFNTb2NrZXRCYXNlJztcblxuZXhwb3J0IHR5cGUgQ0RTSVNvY2tldE9wdGlvbnNUeXBlID0gUmVhZG9ubHk8e1xuICBtcmVuY2xhdmU6IEJ1ZmZlcjtcbn0+ICZcbiAgQ0RTU29ja2V0QmFzZU9wdGlvbnNUeXBlO1xuXG5leHBvcnQgY2xhc3MgQ0RTSVNvY2tldCBleHRlbmRzIENEU1NvY2tldEJhc2U8Q0RTSVNvY2tldE9wdGlvbnNUeXBlPiB7XG4gIHByaXZhdGUgcHJpdkNkc0NsaWVudDogQ2RzMkNsaWVudCB8IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgaGFuZHNoYWtlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIHRoaXMuc3RhdGUgPT09IENEU1NvY2tldFN0YXRlLk9wZW4sXG4gICAgICAnQ0RTSSBoYW5kc2hha2UgY2FsbGVkIHR3aWNlJ1xuICAgICk7XG4gICAgdGhpcy5zdGF0ZSA9IENEU1NvY2tldFN0YXRlLkhhbmRzaGFrZTtcblxuICAgIHtcbiAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWU6IGF0dGVzdGF0aW9uTWVzc2FnZSB9ID1cbiAgICAgICAgYXdhaXQgdGhpcy5zb2NrZXRJdGVyYXRvci5uZXh0KCk7XG4gICAgICBzdHJpY3RBc3NlcnQoIWRvbmUsICdDRFNJIHNvY2tldCBjbG9zZWQgYmVmb3JlIGhhbmRzaGFrZScpO1xuXG4gICAgICBjb25zdCBlYXJsaWVzdFZhbGlkVGltZXN0YW1wID0gbmV3IERhdGUoKTtcblxuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICB0aGlzLnByaXZDZHNDbGllbnQgPT09IHVuZGVmaW5lZCxcbiAgICAgICAgJ0NEU0kgaGFuZHNoYWtlIGNhbGxlZCB0d2ljZSdcbiAgICAgICk7XG4gICAgICB0aGlzLnByaXZDZHNDbGllbnQgPSBDZHMyQ2xpZW50Lm5ldyhcbiAgICAgICAgdGhpcy5vcHRpb25zLm1yZW5jbGF2ZSxcbiAgICAgICAgYXR0ZXN0YXRpb25NZXNzYWdlLFxuICAgICAgICBlYXJsaWVzdFZhbGlkVGltZXN0YW1wXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc29ja2V0LnNlbmRCeXRlcyh0aGlzLmNkc0NsaWVudC5pbml0aWFsUmVxdWVzdCgpKTtcblxuICAgIHtcbiAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWU6IG1lc3NhZ2UgfSA9IGF3YWl0IHRoaXMuc29ja2V0SXRlcmF0b3IubmV4dCgpO1xuICAgICAgc3RyaWN0QXNzZXJ0KCFkb25lLCAnQ0RTSSBzb2NrZXQgZXhwZWN0ZWQgaGFuZHNoYWtlIGRhdGEnKTtcblxuICAgICAgdGhpcy5jZHNDbGllbnQuY29tcGxldGVIYW5kc2hha2UobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZSA9IENEU1NvY2tldFN0YXRlLkVzdGFibGlzaGVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGFzeW5jIHNlbmRSZXF1ZXN0KFxuICAgIF92ZXJzaW9uOiBudW1iZXIsXG4gICAgcmVxdWVzdDogQnVmZmVyXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc29ja2V0LnNlbmRCeXRlcyh0aGlzLmNkc0NsaWVudC5lc3RhYmxpc2hlZFNlbmQocmVxdWVzdCkpO1xuXG4gICAgY29uc3QgeyBkb25lLCB2YWx1ZTogY2lwaGVydGV4dCB9ID0gYXdhaXQgdGhpcy5zb2NrZXRJdGVyYXRvci5uZXh0KCk7XG4gICAgc3RyaWN0QXNzZXJ0KCFkb25lLCAnQ0RTSVNvY2tldC5zZW5kUmVxdWVzdCgpOiBleHBlY3RlZCB0b2tlbiBtZXNzYWdlJyk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgdGhpcy5kZWNyeXB0UmVzcG9uc2UoY2lwaGVydGV4dCk7XG5cbiAgICB0aGlzLmxvZ2dlci5pbmZvKCdDRFNJU29ja2V0LnNlbmRSZXF1ZXN0KCk6IHByb2Nlc3NpbmcgdG9rZW4gbWVzc2FnZScpO1xuXG4gICAgY29uc3QgeyB0b2tlbiB9ID0gUHJvdG8uQ0RTQ2xpZW50UmVzcG9uc2UuZGVjb2RlKG1lc3NhZ2UpO1xuICAgIHN0cmljdEFzc2VydCh0b2tlbiwgJ0NEU0lTb2NrZXQuc2VuZFJlcXVlc3QoKTogZXhwZWN0ZWQgdG9rZW4nKTtcblxuICAgIHRoaXMuc29ja2V0LnNlbmRCeXRlcyhcbiAgICAgIHRoaXMuY2RzQ2xpZW50LmVzdGFibGlzaGVkU2VuZChcbiAgICAgICAgQnVmZmVyLmZyb20oXG4gICAgICAgICAgUHJvdG8uQ0RTQ2xpZW50UmVxdWVzdC5lbmNvZGUoe1xuICAgICAgICAgICAgdG9rZW5BY2s6IHRydWUsXG4gICAgICAgICAgfSkuZmluaXNoKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgYXN5bmMgZGVjcnlwdFJlc3BvbnNlKFxuICAgIGNpcGhlcnRleHQ6IEJ1ZmZlclxuICApOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICAgIHJldHVybiB0aGlzLmNkc0NsaWVudC5lc3RhYmxpc2hlZFJlY3YoY2lwaGVydGV4dCk7XG4gIH1cblxuICAvL1xuICAvLyBQcml2YXRlXG4gIC8vXG5cbiAgcHJpdmF0ZSBnZXQgY2RzQ2xpZW50KCk6IENkczJDbGllbnQge1xuICAgIHN0cmljdEFzc2VydCh0aGlzLnByaXZDZHNDbGllbnQsICdDRFNJU29ja2V0IGRpZCBub3Qgc3RhcnQgaGFuZHNoYWtlJyk7XG4gICAgcmV0dXJuIHRoaXMucHJpdkNkc0NsaWVudDtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLDhCQUEyQjtBQUUzQixvQkFBNkI7QUFDN0Isc0JBQXVDO0FBQ3ZDLDJCQUE4QztBQVF2QyxNQUFNLG1CQUFtQixtQ0FBcUM7QUFBQSxRQUc3QyxZQUEyQjtBQUMvQyxvQ0FDRSxLQUFLLFVBQVUsb0NBQWUsTUFDOUIsNkJBQ0Y7QUFDQSxTQUFLLFFBQVEsb0NBQWU7QUFFNUI7QUFDRSxZQUFNLEVBQUUsTUFBTSxPQUFPLHVCQUNuQixNQUFNLEtBQUssZUFBZSxLQUFLO0FBQ2pDLHNDQUFhLENBQUMsTUFBTSxxQ0FBcUM7QUFFekQsWUFBTSx5QkFBeUIsSUFBSSxLQUFLO0FBRXhDLHNDQUNFLEtBQUssa0JBQWtCLFFBQ3ZCLDZCQUNGO0FBQ0EsV0FBSyxnQkFBZ0IsbUNBQVcsSUFDOUIsS0FBSyxRQUFRLFdBQ2Isb0JBQ0Esc0JBQ0Y7QUFBQSxJQUNGO0FBRUEsU0FBSyxPQUFPLFVBQVUsS0FBSyxVQUFVLGVBQWUsQ0FBQztBQUVyRDtBQUNFLFlBQU0sRUFBRSxNQUFNLE9BQU8sWUFBWSxNQUFNLEtBQUssZUFBZSxLQUFLO0FBQ2hFLHNDQUFhLENBQUMsTUFBTSxxQ0FBcUM7QUFFekQsV0FBSyxVQUFVLGtCQUFrQixPQUFPO0FBQUEsSUFDMUM7QUFFQSxTQUFLLFFBQVEsb0NBQWU7QUFBQSxFQUM5QjtBQUFBLFFBRXlCLFlBQ3ZCLFVBQ0EsU0FDZTtBQUNmLFNBQUssT0FBTyxVQUFVLEtBQUssVUFBVSxnQkFBZ0IsT0FBTyxDQUFDO0FBRTdELFVBQU0sRUFBRSxNQUFNLE9BQU8sZUFBZSxNQUFNLEtBQUssZUFBZSxLQUFLO0FBQ25FLG9DQUFhLENBQUMsTUFBTSxrREFBa0Q7QUFFdEUsVUFBTSxVQUFVLE1BQU0sS0FBSyxnQkFBZ0IsVUFBVTtBQUVyRCxTQUFLLE9BQU8sS0FBSyxvREFBb0Q7QUFFckUsVUFBTSxFQUFFLFVBQVUsOEJBQU0sa0JBQWtCLE9BQU8sT0FBTztBQUN4RCxvQ0FBYSxPQUFPLDBDQUEwQztBQUU5RCxTQUFLLE9BQU8sVUFDVixLQUFLLFVBQVUsZ0JBQ2IsT0FBTyxLQUNMLDhCQUFNLGlCQUFpQixPQUFPO0FBQUEsTUFDNUIsVUFBVTtBQUFBLElBQ1osQ0FBQyxFQUFFLE9BQU8sQ0FDWixDQUNGLENBQ0Y7QUFBQSxFQUNGO0FBQUEsUUFFeUIsZ0JBQ3ZCLFlBQ2lCO0FBQ2pCLFdBQU8sS0FBSyxVQUFVLGdCQUFnQixVQUFVO0FBQUEsRUFDbEQ7QUFBQSxNQU1ZLFlBQXdCO0FBQ2xDLG9DQUFhLEtBQUssZUFBZSxvQ0FBb0M7QUFDckUsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUNGO0FBakZPIiwKICAibmFtZXMiOiBbXQp9Cg==
