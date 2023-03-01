var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_mock_server = require("@signalapp/mock-server");
var import_fixtures = require("./fixtures");
const MESSAGE_BATCH_SIZE = 1e3;
const ENABLE_RECEIPTS = Boolean(process.env.ENABLE_RECEIPTS);
(async () => {
  const bootstrap = new import_fixtures.Bootstrap({
    benchmark: true
  });
  await bootstrap.init();
  await bootstrap.linkAndClose();
  try {
    const { server, contacts, phone, desktop } = bootstrap;
    const messagesPerSec = new Array();
    for (let runId = 0; runId < import_fixtures.RUN_COUNT; runId += 1) {
      const messagePromises = new Array();
      (0, import_fixtures.debug)("started generating messages");
      for (let i = 0; i < MESSAGE_BATCH_SIZE; i += 1) {
        const contact = contacts[Math.floor(i / 2) % contacts.length];
        const direction = i % 2 ? "message" : "reply";
        const messageTimestamp = bootstrap.getTimestamp();
        if (direction === "message") {
          messagePromises.push(contact.encryptText(desktop, `Ping from mock server ${i + 1} / ${MESSAGE_BATCH_SIZE}`, {
            timestamp: messageTimestamp,
            sealed: true
          }));
          if (ENABLE_RECEIPTS) {
            messagePromises.push(phone.encryptSyncRead(desktop, {
              timestamp: bootstrap.getTimestamp(),
              messages: [
                {
                  senderUUID: contact.device.uuid,
                  timestamp: messageTimestamp
                }
              ]
            }));
          }
          continue;
        }
        messagePromises.push(phone.encryptSyncSent(desktop, `Pong from mock server ${i + 1} / ${MESSAGE_BATCH_SIZE}`, {
          timestamp: messageTimestamp,
          destinationUUID: contact.device.uuid
        }));
        if (ENABLE_RECEIPTS) {
          messagePromises.push(contact.encryptReceipt(desktop, {
            timestamp: bootstrap.getTimestamp(),
            messageTimestamps: [messageTimestamp],
            type: import_mock_server.ReceiptType.Delivery
          }));
          messagePromises.push(contact.encryptReceipt(desktop, {
            timestamp: bootstrap.getTimestamp(),
            messageTimestamps: [messageTimestamp],
            type: import_mock_server.ReceiptType.Read
          }));
        }
      }
      (0, import_fixtures.debug)("ended generating messages");
      const messages = await Promise.all(messagePromises);
      {
        (0, import_fixtures.debug)("got synced, sending messages");
        const queue = /* @__PURE__ */ __name(async () => {
          await Promise.all(messages.map((message) => {
            return server.send(desktop, message);
          }));
        }, "queue");
        const run = /* @__PURE__ */ __name(async () => {
          const app = await bootstrap.startApp();
          const appLoadedInfo = await app.waitUntilLoaded();
          console.log("run=%d info=%j", runId, appLoadedInfo);
          messagesPerSec.push(appLoadedInfo.messagesPerSec);
          await app.close();
        }, "run");
        await Promise.all([queue(), run()]);
      }
    }
    if (messagesPerSec.length !== 0) {
      console.log("stats info=%j", { messagesPerSec: (0, import_fixtures.stats)(messagesPerSec) });
    }
  } catch (error) {
    await bootstrap.saveLogs();
    throw error;
  } finally {
    await bootstrap.teardown();
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RhcnR1cF9iZW5jaC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuLyogZXNsaW50LWRpc2FibGUgbm8tYXdhaXQtaW4tbG9vcCwgbm8tY29uc29sZSAqL1xuXG5pbXBvcnQgeyBSZWNlaXB0VHlwZSB9IGZyb20gJ0BzaWduYWxhcHAvbW9jay1zZXJ2ZXInO1xuXG5pbXBvcnQgeyBkZWJ1ZywgQm9vdHN0cmFwLCBzdGF0cywgUlVOX0NPVU5UIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5cbmNvbnN0IE1FU1NBR0VfQkFUQ0hfU0laRSA9IDEwMDA7IC8vIG1lc3NhZ2VzXG5cbmNvbnN0IEVOQUJMRV9SRUNFSVBUUyA9IEJvb2xlYW4ocHJvY2Vzcy5lbnYuRU5BQkxFX1JFQ0VJUFRTKTtcblxuKGFzeW5jICgpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwID0gbmV3IEJvb3RzdHJhcCh7XG4gICAgYmVuY2htYXJrOiB0cnVlLFxuICB9KTtcblxuICBhd2FpdCBib290c3RyYXAuaW5pdCgpO1xuICBhd2FpdCBib290c3RyYXAubGlua0FuZENsb3NlKCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IHNlcnZlciwgY29udGFjdHMsIHBob25lLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG5cbiAgICBjb25zdCBtZXNzYWdlc1BlclNlYyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cbiAgICBmb3IgKGxldCBydW5JZCA9IDA7IHJ1bklkIDwgUlVOX0NPVU5UOyBydW5JZCArPSAxKSB7XG4gICAgICAvLyBHZW5lcmF0ZSBtZXNzYWdlc1xuICAgICAgY29uc3QgbWVzc2FnZVByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8QnVmZmVyPj4oKTtcbiAgICAgIGRlYnVnKCdzdGFydGVkIGdlbmVyYXRpbmcgbWVzc2FnZXMnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNRVNTQUdFX0JBVENIX1NJWkU7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjb250YWN0ID0gY29udGFjdHNbTWF0aC5mbG9vcihpIC8gMikgJSBjb250YWN0cy5sZW5ndGhdO1xuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBpICUgMiA/ICdtZXNzYWdlJyA6ICdyZXBseSc7XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZVRpbWVzdGFtcCA9IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbWVzc2FnZScpIHtcbiAgICAgICAgICBtZXNzYWdlUHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgIGNvbnRhY3QuZW5jcnlwdFRleHQoXG4gICAgICAgICAgICAgIGRlc2t0b3AsXG4gICAgICAgICAgICAgIGBQaW5nIGZyb20gbW9jayBzZXJ2ZXIgJHtpICsgMX0gLyAke01FU1NBR0VfQkFUQ0hfU0laRX1gLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlVGltZXN0YW1wLFxuICAgICAgICAgICAgICAgIHNlYWxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoRU5BQkxFX1JFQ0VJUFRTKSB7XG4gICAgICAgICAgICBtZXNzYWdlUHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgcGhvbmUuZW5jcnlwdFN5bmNSZWFkKGRlc2t0b3AsIHtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZW5kZXJVVUlEOiBjb250YWN0LmRldmljZS51dWlkLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1lc3NhZ2VQcm9taXNlcy5wdXNoKFxuICAgICAgICAgIHBob25lLmVuY3J5cHRTeW5jU2VudChcbiAgICAgICAgICAgIGRlc2t0b3AsXG4gICAgICAgICAgICBgUG9uZyBmcm9tIG1vY2sgc2VydmVyICR7aSArIDF9IC8gJHtNRVNTQUdFX0JBVENIX1NJWkV9YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlVGltZXN0YW1wLFxuICAgICAgICAgICAgICBkZXN0aW5hdGlvblVVSUQ6IGNvbnRhY3QuZGV2aWNlLnV1aWQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChFTkFCTEVfUkVDRUlQVFMpIHtcbiAgICAgICAgICBtZXNzYWdlUHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgIGNvbnRhY3QuZW5jcnlwdFJlY2VpcHQoZGVza3RvcCwge1xuICAgICAgICAgICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgICAgICAgICAgbWVzc2FnZVRpbWVzdGFtcHM6IFttZXNzYWdlVGltZXN0YW1wXSxcbiAgICAgICAgICAgICAgdHlwZTogUmVjZWlwdFR5cGUuRGVsaXZlcnksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgICAgbWVzc2FnZVByb21pc2VzLnB1c2goXG4gICAgICAgICAgICBjb250YWN0LmVuY3J5cHRSZWNlaXB0KGRlc2t0b3AsIHtcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICAgICAgICAgIG1lc3NhZ2VUaW1lc3RhbXBzOiBbbWVzc2FnZVRpbWVzdGFtcF0sXG4gICAgICAgICAgICAgIHR5cGU6IFJlY2VpcHRUeXBlLlJlYWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGVidWcoJ2VuZGVkIGdlbmVyYXRpbmcgbWVzc2FnZXMnKTtcblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBQcm9taXNlLmFsbChtZXNzYWdlUHJvbWlzZXMpO1xuXG4gICAgICAvLyBPcGVuIHRoZSBmbG9vZCBnYXRlc1xuICAgICAge1xuICAgICAgICBkZWJ1ZygnZ290IHN5bmNlZCwgc2VuZGluZyBtZXNzYWdlcycpO1xuXG4gICAgICAgIC8vIFF1ZXVlIGFsbCBtZXNzYWdlc1xuICAgICAgICBjb25zdCBxdWV1ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlcnZlci5zZW5kKGRlc2t0b3AsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJ1biA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgICBjb25zdCBhcHAgPSBhd2FpdCBib290c3RyYXAuc3RhcnRBcHAoKTtcbiAgICAgICAgICBjb25zdCBhcHBMb2FkZWRJbmZvID0gYXdhaXQgYXBwLndhaXRVbnRpbExvYWRlZCgpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coJ3J1bj0lZCBpbmZvPSVqJywgcnVuSWQsIGFwcExvYWRlZEluZm8pO1xuXG4gICAgICAgICAgbWVzc2FnZXNQZXJTZWMucHVzaChhcHBMb2FkZWRJbmZvLm1lc3NhZ2VzUGVyU2VjKTtcblxuICAgICAgICAgIGF3YWl0IGFwcC5jbG9zZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtxdWV1ZSgpLCBydW4oKV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbXB1dGUgaHVtYW4tcmVhZGFibGUgc3RhdGlzdGljc1xuICAgIGlmIChtZXNzYWdlc1BlclNlYy5sZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdGF0cyBpbmZvPSVqJywgeyBtZXNzYWdlc1BlclNlYzogc3RhdHMobWVzc2FnZXNQZXJTZWMpIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhd2FpdCBib290c3RyYXAuc2F2ZUxvZ3MoKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBib290c3RyYXAudGVhcmRvd24oKTtcbiAgfVxufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBSUEseUJBQTRCO0FBRTVCLHNCQUFtRDtBQUVuRCxNQUFNLHFCQUFxQjtBQUUzQixNQUFNLGtCQUFrQixRQUFRLFFBQVEsSUFBSSxlQUFlO0FBRTNELEFBQUMsYUFBWTtBQUNYLFFBQU0sWUFBWSxJQUFJLDBCQUFVO0FBQUEsSUFDOUIsV0FBVztBQUFBLEVBQ2IsQ0FBQztBQUVELFFBQU0sVUFBVSxLQUFLO0FBQ3JCLFFBQU0sVUFBVSxhQUFhO0FBRTdCLE1BQUk7QUFDRixVQUFNLEVBQUUsUUFBUSxVQUFVLE9BQU8sWUFBWTtBQUU3QyxVQUFNLGlCQUFpQixJQUFJLE1BQWM7QUFFekMsYUFBUyxRQUFRLEdBQUcsUUFBUSwyQkFBVyxTQUFTLEdBQUc7QUFFakQsWUFBTSxrQkFBa0IsSUFBSSxNQUF1QjtBQUNuRCxpQ0FBTSw2QkFBNkI7QUFFbkMsZUFBUyxJQUFJLEdBQUcsSUFBSSxvQkFBb0IsS0FBSyxHQUFHO0FBQzlDLGNBQU0sVUFBVSxTQUFTLEtBQUssTUFBTSxJQUFJLENBQUMsSUFBSSxTQUFTO0FBQ3RELGNBQU0sWUFBWSxJQUFJLElBQUksWUFBWTtBQUV0QyxjQUFNLG1CQUFtQixVQUFVLGFBQWE7QUFFaEQsWUFBSSxjQUFjLFdBQVc7QUFDM0IsMEJBQWdCLEtBQ2QsUUFBUSxZQUNOLFNBQ0EseUJBQXlCLElBQUksT0FBTyxzQkFDcEM7QUFBQSxZQUNFLFdBQVc7QUFBQSxZQUNYLFFBQVE7QUFBQSxVQUNWLENBQ0YsQ0FDRjtBQUVBLGNBQUksaUJBQWlCO0FBQ25CLDRCQUFnQixLQUNkLE1BQU0sZ0JBQWdCLFNBQVM7QUFBQSxjQUM3QixXQUFXLFVBQVUsYUFBYTtBQUFBLGNBQ2xDLFVBQVU7QUFBQSxnQkFDUjtBQUFBLGtCQUNFLFlBQVksUUFBUSxPQUFPO0FBQUEsa0JBQzNCLFdBQVc7QUFBQSxnQkFDYjtBQUFBLGNBQ0Y7QUFBQSxZQUNGLENBQUMsQ0FDSDtBQUFBLFVBQ0Y7QUFDQTtBQUFBLFFBQ0Y7QUFFQSx3QkFBZ0IsS0FDZCxNQUFNLGdCQUNKLFNBQ0EseUJBQXlCLElBQUksT0FBTyxzQkFDcEM7QUFBQSxVQUNFLFdBQVc7QUFBQSxVQUNYLGlCQUFpQixRQUFRLE9BQU87QUFBQSxRQUNsQyxDQUNGLENBQ0Y7QUFFQSxZQUFJLGlCQUFpQjtBQUNuQiwwQkFBZ0IsS0FDZCxRQUFRLGVBQWUsU0FBUztBQUFBLFlBQzlCLFdBQVcsVUFBVSxhQUFhO0FBQUEsWUFDbEMsbUJBQW1CLENBQUMsZ0JBQWdCO0FBQUEsWUFDcEMsTUFBTSwrQkFBWTtBQUFBLFVBQ3BCLENBQUMsQ0FDSDtBQUNBLDBCQUFnQixLQUNkLFFBQVEsZUFBZSxTQUFTO0FBQUEsWUFDOUIsV0FBVyxVQUFVLGFBQWE7QUFBQSxZQUNsQyxtQkFBbUIsQ0FBQyxnQkFBZ0I7QUFBQSxZQUNwQyxNQUFNLCtCQUFZO0FBQUEsVUFDcEIsQ0FBQyxDQUNIO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFQSxpQ0FBTSwyQkFBMkI7QUFFakMsWUFBTSxXQUFXLE1BQU0sUUFBUSxJQUFJLGVBQWU7QUFHbEQ7QUFDRSxtQ0FBTSw4QkFBOEI7QUFHcEMsY0FBTSxRQUFRLG1DQUEyQjtBQUN2QyxnQkFBTSxRQUFRLElBQ1osU0FBUyxJQUFJLGFBQVc7QUFDdEIsbUJBQU8sT0FBTyxLQUFLLFNBQVMsT0FBTztBQUFBLFVBQ3JDLENBQUMsQ0FDSDtBQUFBLFFBQ0YsR0FOYztBQVFkLGNBQU0sTUFBTSxtQ0FBMkI7QUFDckMsZ0JBQU0sTUFBTSxNQUFNLFVBQVUsU0FBUztBQUNyQyxnQkFBTSxnQkFBZ0IsTUFBTSxJQUFJLGdCQUFnQjtBQUVoRCxrQkFBUSxJQUFJLGtCQUFrQixPQUFPLGFBQWE7QUFFbEQseUJBQWUsS0FBSyxjQUFjLGNBQWM7QUFFaEQsZ0JBQU0sSUFBSSxNQUFNO0FBQUEsUUFDbEIsR0FUWTtBQVdaLGNBQU0sUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBR0EsUUFBSSxlQUFlLFdBQVcsR0FBRztBQUMvQixjQUFRLElBQUksaUJBQWlCLEVBQUUsZ0JBQWdCLDJCQUFNLGNBQWMsRUFBRSxDQUFDO0FBQUEsSUFDeEU7QUFBQSxFQUNGLFNBQVMsT0FBUDtBQUNBLFVBQU0sVUFBVSxTQUFTO0FBQ3pCLFVBQU07QUFBQSxFQUNSLFVBQUU7QUFDQSxVQUFNLFVBQVUsU0FBUztBQUFBLEVBQzNCO0FBQ0YsR0FBRzsiLAogICJuYW1lcyI6IFtdCn0K
