var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_assert = __toESM(require("assert"));
var import_fixtures = require("./fixtures");
const CONVERSATION_SIZE = 1e3;
const DELAY = 50;
(async () => {
  const bootstrap = new import_fixtures.Bootstrap({
    benchmark: true
  });
  await bootstrap.init();
  let app;
  try {
    app = await bootstrap.link();
    const { server, contacts, phone, desktop } = bootstrap;
    const [first, second] = contacts;
    const messages = new Array();
    (0, import_fixtures.debug)("encrypting");
    for (const contact of [second, first]) {
      for (let i = 0; i < CONVERSATION_SIZE; i += 1) {
        const messageTimestamp = bootstrap.getTimestamp();
        messages.push(await contact.encryptText(desktop, `hello from: ${contact.profileName}`, {
          timestamp: messageTimestamp,
          sealed: true
        }));
        messages.push(await phone.encryptSyncRead(desktop, {
          timestamp: bootstrap.getTimestamp(),
          messages: [
            {
              senderUUID: contact.device.uuid,
              timestamp: messageTimestamp
            }
          ]
        }));
      }
    }
    const sendQueue = /* @__PURE__ */ __name(async () => {
      await Promise.all(messages.map((message) => server.send(desktop, message)));
    }, "sendQueue");
    const measure = /* @__PURE__ */ __name(async () => {
      (0, import_assert.default)(app);
      const window = await app.getWindow();
      const leftPane = window.locator(".left-pane-wrapper");
      const openConvo = /* @__PURE__ */ __name(async (contact) => {
        (0, import_fixtures.debug)("opening conversation", contact.profileName);
        const item = leftPane.locator(`_react=BaseConversationListItem[title = ${JSON.stringify(contact.profileName)}]`);
        await item.click();
      }, "openConvo");
      const deltaList = new Array();
      for (let runId = 0; runId < import_fixtures.RUN_COUNT + import_fixtures.DISCARD_COUNT; runId += 1) {
        await openConvo(runId % 2 === 0 ? first : second);
        (0, import_fixtures.debug)("waiting for timing from the app");
        const { delta } = await app.waitForConversationOpen();
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        if (runId >= import_fixtures.DISCARD_COUNT) {
          deltaList.push(delta);
          console.log("run=%d info=%j", runId - import_fixtures.DISCARD_COUNT, { delta });
        } else {
          console.log("discarded=%d info=%j", runId, { delta });
        }
      }
      console.log("stats info=%j", { delta: (0, import_fixtures.stats)(deltaList, [99, 99.8]) });
    }, "measure");
    await Promise.all([sendQueue(), measure()]);
  } catch (error) {
    await bootstrap.saveLogs();
    throw error;
  } finally {
    await app?.close();
    await bootstrap.teardown();
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udm9fb3Blbl9iZW5jaC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuLyogZXNsaW50LWRpc2FibGUgbm8tYXdhaXQtaW4tbG9vcCwgbm8tY29uc29sZSAqL1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgdHlwZSB7IFByaW1hcnlEZXZpY2UgfSBmcm9tICdAc2lnbmFsYXBwL21vY2stc2VydmVyJztcblxuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICcuL2ZpeHR1cmVzJztcbmltcG9ydCB7IEJvb3RzdHJhcCwgZGVidWcsIHN0YXRzLCBSVU5fQ09VTlQsIERJU0NBUkRfQ09VTlQgfSBmcm9tICcuL2ZpeHR1cmVzJztcblxuY29uc3QgQ09OVkVSU0FUSU9OX1NJWkUgPSAxMDAwOyAvLyBtZXNzYWdlc1xuY29uc3QgREVMQVkgPSA1MDsgLy8gbWlsbGlzZWNvbmRzXG5cbihhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcCA9IG5ldyBCb290c3RyYXAoe1xuICAgIGJlbmNobWFyazogdHJ1ZSxcbiAgfSk7XG5cbiAgYXdhaXQgYm9vdHN0cmFwLmluaXQoKTtcblxuICBsZXQgYXBwOiBBcHAgfCB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgYXBwID0gYXdhaXQgYm9vdHN0cmFwLmxpbmsoKTtcbiAgICBjb25zdCB7IHNlcnZlciwgY29udGFjdHMsIHBob25lLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG5cbiAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBjb250YWN0cztcblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gbmV3IEFycmF5PEJ1ZmZlcj4oKTtcbiAgICBkZWJ1ZygnZW5jcnlwdGluZycpO1xuICAgIC8vIFNlbmQgbWVzc2FnZXMgZnJvbSBqdXN0IHR3byBjb250YWN0c1xuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBbc2Vjb25kLCBmaXJzdF0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQ09OVkVSU0FUSU9OX1NJWkU7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlVGltZXN0YW1wID0gYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpO1xuICAgICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICAgIGF3YWl0IGNvbnRhY3QuZW5jcnlwdFRleHQoXG4gICAgICAgICAgICBkZXNrdG9wLFxuICAgICAgICAgICAgYGhlbGxvIGZyb206ICR7Y29udGFjdC5wcm9maWxlTmFtZX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICAgICAgICAgIHNlYWxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgICAgbWVzc2FnZXMucHVzaChcbiAgICAgICAgICBhd2FpdCBwaG9uZS5lbmNyeXB0U3luY1JlYWQoZGVza3RvcCwge1xuICAgICAgICAgICAgdGltZXN0YW1wOiBib290c3RyYXAuZ2V0VGltZXN0YW1wKCksXG4gICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VuZGVyVVVJRDogY29udGFjdC5kZXZpY2UudXVpZCxcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2VuZFF1ZXVlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwobWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4gc2VydmVyLnNlbmQoZGVza3RvcCwgbWVzc2FnZSkpKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbWVhc3VyZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGFzc2VydChhcHApO1xuICAgICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgICBjb25zdCBsZWZ0UGFuZSA9IHdpbmRvdy5sb2NhdG9yKCcubGVmdC1wYW5lLXdyYXBwZXInKTtcblxuICAgICAgY29uc3Qgb3BlbkNvbnZvID0gYXN5bmMgKGNvbnRhY3Q6IFByaW1hcnlEZXZpY2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgZGVidWcoJ29wZW5pbmcgY29udmVyc2F0aW9uJywgY29udGFjdC5wcm9maWxlTmFtZSk7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBsZWZ0UGFuZS5sb2NhdG9yKFxuICAgICAgICAgICdfcmVhY3Q9QmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShjb250YWN0LnByb2ZpbGVOYW1lKX1dYFxuICAgICAgICApO1xuXG4gICAgICAgIGF3YWl0IGl0ZW0uY2xpY2soKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGRlbHRhTGlzdCA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgICBmb3IgKGxldCBydW5JZCA9IDA7IHJ1bklkIDwgUlVOX0NPVU5UICsgRElTQ0FSRF9DT1VOVDsgcnVuSWQgKz0gMSkge1xuICAgICAgICBhd2FpdCBvcGVuQ29udm8ocnVuSWQgJSAyID09PSAwID8gZmlyc3QgOiBzZWNvbmQpO1xuXG4gICAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciB0aW1pbmcgZnJvbSB0aGUgYXBwJyk7XG4gICAgICAgIGNvbnN0IHsgZGVsdGEgfSA9IGF3YWl0IGFwcC53YWl0Rm9yQ29udmVyc2F0aW9uT3BlbigpO1xuXG4gICAgICAgIC8vIExldCByZW5kZXIgY29tcGxldGVcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIERFTEFZKSk7XG5cbiAgICAgICAgaWYgKHJ1bklkID49IERJU0NBUkRfQ09VTlQpIHtcbiAgICAgICAgICBkZWx0YUxpc3QucHVzaChkZWx0YSk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3J1bj0lZCBpbmZvPSVqJywgcnVuSWQgLSBESVNDQVJEX0NPVU5ULCB7IGRlbHRhIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXNjYXJkZWQ9JWQgaW5mbz0laicsIHJ1bklkLCB7IGRlbHRhIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdzdGF0cyBpbmZvPSVqJywgeyBkZWx0YTogc3RhdHMoZGVsdGFMaXN0LCBbOTksIDk5LjhdKSB9KTtcbiAgICB9O1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW3NlbmRRdWV1ZSgpLCBtZWFzdXJlKCldKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhd2FpdCBib290c3RyYXAuc2F2ZUxvZ3MoKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBhcHA/LmNsb3NlKCk7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnRlYXJkb3duKCk7XG4gIH1cbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsb0JBQW1CO0FBSW5CLHNCQUFrRTtBQUVsRSxNQUFNLG9CQUFvQjtBQUMxQixNQUFNLFFBQVE7QUFFZCxBQUFDLGFBQVk7QUFDWCxRQUFNLFlBQVksSUFBSSwwQkFBVTtBQUFBLElBQzlCLFdBQVc7QUFBQSxFQUNiLENBQUM7QUFFRCxRQUFNLFVBQVUsS0FBSztBQUVyQixNQUFJO0FBQ0osTUFBSTtBQUNGLFVBQU0sTUFBTSxVQUFVLEtBQUs7QUFDM0IsVUFBTSxFQUFFLFFBQVEsVUFBVSxPQUFPLFlBQVk7QUFFN0MsVUFBTSxDQUFDLE9BQU8sVUFBVTtBQUV4QixVQUFNLFdBQVcsSUFBSSxNQUFjO0FBQ25DLCtCQUFNLFlBQVk7QUFFbEIsZUFBVyxXQUFXLENBQUMsUUFBUSxLQUFLLEdBQUc7QUFDckMsZUFBUyxJQUFJLEdBQUcsSUFBSSxtQkFBbUIsS0FBSyxHQUFHO0FBQzdDLGNBQU0sbUJBQW1CLFVBQVUsYUFBYTtBQUNoRCxpQkFBUyxLQUNQLE1BQU0sUUFBUSxZQUNaLFNBQ0EsZUFBZSxRQUFRLGVBQ3ZCO0FBQUEsVUFDRSxXQUFXO0FBQUEsVUFDWCxRQUFRO0FBQUEsUUFDVixDQUNGLENBQ0Y7QUFFQSxpQkFBUyxLQUNQLE1BQU0sTUFBTSxnQkFBZ0IsU0FBUztBQUFBLFVBQ25DLFdBQVcsVUFBVSxhQUFhO0FBQUEsVUFDbEMsVUFBVTtBQUFBLFlBQ1I7QUFBQSxjQUNFLFlBQVksUUFBUSxPQUFPO0FBQUEsY0FDM0IsV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLFVBQU0sWUFBWSxtQ0FBMkI7QUFDM0MsWUFBTSxRQUFRLElBQUksU0FBUyxJQUFJLGFBQVcsT0FBTyxLQUFLLFNBQVMsT0FBTyxDQUFDLENBQUM7QUFBQSxJQUMxRSxHQUZrQjtBQUlsQixVQUFNLFVBQVUsbUNBQTJCO0FBQ3pDLGlDQUFPLEdBQUc7QUFDVixZQUFNLFNBQVMsTUFBTSxJQUFJLFVBQVU7QUFFbkMsWUFBTSxXQUFXLE9BQU8sUUFBUSxvQkFBb0I7QUFFcEQsWUFBTSxZQUFZLDhCQUFPLFlBQTBDO0FBQ2pFLG1DQUFNLHdCQUF3QixRQUFRLFdBQVc7QUFDakQsY0FBTSxPQUFPLFNBQVMsUUFDcEIsMkNBQ2MsS0FBSyxVQUFVLFFBQVEsV0FBVyxJQUNsRDtBQUVBLGNBQU0sS0FBSyxNQUFNO0FBQUEsTUFDbkIsR0FSa0I7QUFVbEIsWUFBTSxZQUFZLElBQUksTUFBYztBQUNwQyxlQUFTLFFBQVEsR0FBRyxRQUFRLDRCQUFZLCtCQUFlLFNBQVMsR0FBRztBQUNqRSxjQUFNLFVBQVUsUUFBUSxNQUFNLElBQUksUUFBUSxNQUFNO0FBRWhELG1DQUFNLGlDQUFpQztBQUN2QyxjQUFNLEVBQUUsVUFBVSxNQUFNLElBQUksd0JBQXdCO0FBR3BELGNBQU0sSUFBSSxRQUFRLGFBQVcsV0FBVyxTQUFTLEtBQUssQ0FBQztBQUV2RCxZQUFJLFNBQVMsK0JBQWU7QUFDMUIsb0JBQVUsS0FBSyxLQUFLO0FBQ3BCLGtCQUFRLElBQUksa0JBQWtCLFFBQVEsK0JBQWUsRUFBRSxNQUFNLENBQUM7QUFBQSxRQUNoRSxPQUFPO0FBQ0wsa0JBQVEsSUFBSSx3QkFBd0IsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUFBLFFBQ3REO0FBQUEsTUFDRjtBQUVBLGNBQVEsSUFBSSxpQkFBaUIsRUFBRSxPQUFPLDJCQUFNLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUN0RSxHQW5DZ0I7QUFxQ2hCLFVBQU0sUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQUEsRUFDNUMsU0FBUyxPQUFQO0FBQ0EsVUFBTSxVQUFVLFNBQVM7QUFDekIsVUFBTTtBQUFBLEVBQ1IsVUFBRTtBQUNBLFVBQU0sS0FBSyxNQUFNO0FBQ2pCLFVBQU0sVUFBVSxTQUFTO0FBQUEsRUFDM0I7QUFDRixHQUFHOyIsCiAgIm5hbWVzIjogW10KfQo=
