var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_mock_server = require("@signalapp/mock-server");
var import_fixtures = require("./fixtures");
const CONVERSATION_SIZE = 500;
const LAST_MESSAGE = "start sending messages now";
(async () => {
  const bootstrap = new import_fixtures.Bootstrap({
    benchmark: true
  });
  await bootstrap.init();
  let app;
  try {
    app = await bootstrap.link();
    const { server, contacts, phone, desktop } = bootstrap;
    const [first] = contacts;
    const messages = new Array();
    (0, import_fixtures.debug)("encrypting");
    for (const contact of contacts.slice().reverse()) {
      let count = 1;
      if (contact === first) {
        count = CONVERSATION_SIZE;
      }
      for (let i = 0; i < count; i += 1) {
        const messageTimestamp = bootstrap.getTimestamp();
        const isLast = i === count - 1;
        messages.push(await contact.encryptText(desktop, isLast ? LAST_MESSAGE : `#${i} from: ${contact.profileName}`, {
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
    await Promise.all(messages.map((message) => server.send(desktop, message)));
    const window = await app.getWindow();
    (0, import_fixtures.debug)("opening conversation");
    {
      const leftPane = window.locator(".left-pane-wrapper");
      const item = leftPane.locator(`_react=BaseConversationListItem[title = ${JSON.stringify(first.profileName)}]>> ${JSON.stringify(LAST_MESSAGE)}`);
      await item.click();
    }
    const timeline = window.locator(".timeline-wrapper, .ConversationView__template .react-wrapper");
    const deltaList = new Array();
    for (let runId = 0; runId < import_fixtures.RUN_COUNT + import_fixtures.DISCARD_COUNT; runId += 1) {
      (0, import_fixtures.debug)("finding composition input and clicking it");
      const composeArea = window.locator(".composition-area-wrapper, .ConversationView__template .react-wrapper");
      const input = composeArea.locator("_react=CompositionInput");
      (0, import_fixtures.debug)("entering message text");
      await input.type(`my message ${runId}`);
      await input.press("Enter");
      (0, import_fixtures.debug)("waiting for message on server side");
      const { body, source } = await first.waitForMessage();
      import_assert.default.strictEqual(body, `my message ${runId}`);
      import_assert.default.strictEqual(source, desktop);
      (0, import_fixtures.debug)("waiting for timing from the app");
      const { timestamp, delta } = await app.waitForMessageSend();
      (0, import_fixtures.debug)("sending delivery receipt");
      const delivery = await first.encryptReceipt(desktop, {
        timestamp: timestamp + 1,
        messageTimestamps: [timestamp],
        type: import_mock_server.ReceiptType.Delivery
      });
      await server.send(desktop, delivery);
      (0, import_fixtures.debug)("waiting for message state change");
      const message = timeline.locator(`_react=Message[timestamp = ${timestamp}][status = "delivered"]`);
      await message.waitFor();
      if (runId >= import_fixtures.DISCARD_COUNT) {
        deltaList.push(delta);
        console.log("run=%d info=%j", runId - import_fixtures.DISCARD_COUNT, { delta });
      } else {
        console.log("discarded=%d info=%j", runId, { delta });
      }
    }
    console.log("stats info=%j", { delta: (0, import_fixtures.stats)(deltaList, [99, 99.8]) });
  } catch (error) {
    await bootstrap.saveLogs();
    throw error;
  } finally {
    await app?.close();
    await bootstrap.teardown();
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VuZF9iZW5jaC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuLyogZXNsaW50LWRpc2FibGUgbm8tYXdhaXQtaW4tbG9vcCwgbm8tY29uc29sZSAqL1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmltcG9ydCB7IFJlY2VpcHRUeXBlIH0gZnJvbSAnQHNpZ25hbGFwcC9tb2NrLXNlcnZlcic7XG5cbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5pbXBvcnQgeyBCb290c3RyYXAsIGRlYnVnLCBzdGF0cywgUlVOX0NPVU5ULCBESVNDQVJEX0NPVU5UIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5cbmNvbnN0IENPTlZFUlNBVElPTl9TSVpFID0gNTAwOyAvLyBtZXNzYWdlc1xuXG5jb25zdCBMQVNUX01FU1NBR0UgPSAnc3RhcnQgc2VuZGluZyBtZXNzYWdlcyBub3cnO1xuXG4oYXN5bmMgKCkgPT4ge1xuICBjb25zdCBib290c3RyYXAgPSBuZXcgQm9vdHN0cmFwKHtcbiAgICBiZW5jaG1hcms6IHRydWUsXG4gIH0pO1xuXG4gIGF3YWl0IGJvb3RzdHJhcC5pbml0KCk7XG4gIGxldCBhcHA6IEFwcCB8IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGFwcCA9IGF3YWl0IGJvb3RzdHJhcC5saW5rKCk7XG5cbiAgICBjb25zdCB7IHNlcnZlciwgY29udGFjdHMsIHBob25lLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG5cbiAgICBjb25zdCBbZmlyc3RdID0gY29udGFjdHM7XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBBcnJheTxCdWZmZXI+KCk7XG4gICAgZGVidWcoJ2VuY3J5cHRpbmcnKTtcbiAgICAvLyBOb3RlOiBtYWtlIGl0IHNvIHRoYXQgd2UgcmVjZWl2ZSB0aGUgbGF0ZXN0IG1lc3NhZ2UgZnJvbSB0aGUgZmlyc3RcbiAgICAvLyBjb250YWN0LlxuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBjb250YWN0cy5zbGljZSgpLnJldmVyc2UoKSkge1xuICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgIGlmIChjb250YWN0ID09PSBmaXJzdCkge1xuICAgICAgICBjb3VudCA9IENPTlZFUlNBVElPTl9TSVpFO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZVRpbWVzdGFtcCA9IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKTtcblxuICAgICAgICBjb25zdCBpc0xhc3QgPSBpID09PSBjb3VudCAtIDE7XG5cbiAgICAgICAgbWVzc2FnZXMucHVzaChcbiAgICAgICAgICBhd2FpdCBjb250YWN0LmVuY3J5cHRUZXh0KFxuICAgICAgICAgICAgZGVza3RvcCxcbiAgICAgICAgICAgIGlzTGFzdCA/IExBU1RfTUVTU0FHRSA6IGAjJHtpfSBmcm9tOiAke2NvbnRhY3QucHJvZmlsZU5hbWV9YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGltZXN0YW1wOiBtZXNzYWdlVGltZXN0YW1wLFxuICAgICAgICAgICAgICBzZWFsZWQ6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICAgIGF3YWl0IHBob25lLmVuY3J5cHRTeW5jUmVhZChkZXNrdG9wLCB7XG4gICAgICAgICAgICB0aW1lc3RhbXA6IGJvb3RzdHJhcC5nZXRUaW1lc3RhbXAoKSxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZW5kZXJVVUlEOiBjb250YWN0LmRldmljZS51dWlkLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZVRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChtZXNzYWdlcy5tYXAobWVzc2FnZSA9PiBzZXJ2ZXIuc2VuZChkZXNrdG9wLCBtZXNzYWdlKSkpO1xuXG4gICAgY29uc3Qgd2luZG93ID0gYXdhaXQgYXBwLmdldFdpbmRvdygpO1xuXG4gICAgZGVidWcoJ29wZW5pbmcgY29udmVyc2F0aW9uJyk7XG4gICAge1xuICAgICAgY29uc3QgbGVmdFBhbmUgPSB3aW5kb3cubG9jYXRvcignLmxlZnQtcGFuZS13cmFwcGVyJyk7XG4gICAgICBjb25zdCBpdGVtID0gbGVmdFBhbmUubG9jYXRvcihcbiAgICAgICAgJ19yZWFjdD1CYXNlQ29udmVyc2F0aW9uTGlzdEl0ZW0nICtcbiAgICAgICAgICBgW3RpdGxlID0gJHtKU09OLnN0cmluZ2lmeShmaXJzdC5wcm9maWxlTmFtZSl9XWAgK1xuICAgICAgICAgIGA+PiAke0pTT04uc3RyaW5naWZ5KExBU1RfTUVTU0FHRSl9YFxuICAgICAgKTtcbiAgICAgIGF3YWl0IGl0ZW0uY2xpY2soKTtcbiAgICB9XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHdpbmRvdy5sb2NhdG9yKFxuICAgICAgJy50aW1lbGluZS13cmFwcGVyLCAuQ29udmVyc2F0aW9uVmlld19fdGVtcGxhdGUgLnJlYWN0LXdyYXBwZXInXG4gICAgKTtcblxuICAgIGNvbnN0IGRlbHRhTGlzdCA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgZm9yIChsZXQgcnVuSWQgPSAwOyBydW5JZCA8IFJVTl9DT1VOVCArIERJU0NBUkRfQ09VTlQ7IHJ1bklkICs9IDEpIHtcbiAgICAgIGRlYnVnKCdmaW5kaW5nIGNvbXBvc2l0aW9uIGlucHV0IGFuZCBjbGlja2luZyBpdCcpO1xuICAgICAgY29uc3QgY29tcG9zZUFyZWEgPSB3aW5kb3cubG9jYXRvcihcbiAgICAgICAgJy5jb21wb3NpdGlvbi1hcmVhLXdyYXBwZXIsICcgK1xuICAgICAgICAgICcuQ29udmVyc2F0aW9uVmlld19fdGVtcGxhdGUgLnJlYWN0LXdyYXBwZXInXG4gICAgICApO1xuICAgICAgY29uc3QgaW5wdXQgPSBjb21wb3NlQXJlYS5sb2NhdG9yKCdfcmVhY3Q9Q29tcG9zaXRpb25JbnB1dCcpO1xuXG4gICAgICBkZWJ1ZygnZW50ZXJpbmcgbWVzc2FnZSB0ZXh0Jyk7XG4gICAgICBhd2FpdCBpbnB1dC50eXBlKGBteSBtZXNzYWdlICR7cnVuSWR9YCk7XG4gICAgICBhd2FpdCBpbnB1dC5wcmVzcygnRW50ZXInKTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIG1lc3NhZ2Ugb24gc2VydmVyIHNpZGUnKTtcbiAgICAgIGNvbnN0IHsgYm9keSwgc291cmNlIH0gPSBhd2FpdCBmaXJzdC53YWl0Rm9yTWVzc2FnZSgpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGJvZHksIGBteSBtZXNzYWdlICR7cnVuSWR9YCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoc291cmNlLCBkZXNrdG9wKTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIHRpbWluZyBmcm9tIHRoZSBhcHAnKTtcbiAgICAgIGNvbnN0IHsgdGltZXN0YW1wLCBkZWx0YSB9ID0gYXdhaXQgYXBwLndhaXRGb3JNZXNzYWdlU2VuZCgpO1xuXG4gICAgICBkZWJ1Zygnc2VuZGluZyBkZWxpdmVyeSByZWNlaXB0Jyk7XG4gICAgICBjb25zdCBkZWxpdmVyeSA9IGF3YWl0IGZpcnN0LmVuY3J5cHRSZWNlaXB0KGRlc2t0b3AsIHtcbiAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAgKyAxLFxuICAgICAgICBtZXNzYWdlVGltZXN0YW1wczogW3RpbWVzdGFtcF0sXG4gICAgICAgIHR5cGU6IFJlY2VpcHRUeXBlLkRlbGl2ZXJ5LFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IHNlcnZlci5zZW5kKGRlc2t0b3AsIGRlbGl2ZXJ5KTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIG1lc3NhZ2Ugc3RhdGUgY2hhbmdlJyk7XG4gICAgICBjb25zdCBtZXNzYWdlID0gdGltZWxpbmUubG9jYXRvcihcbiAgICAgICAgYF9yZWFjdD1NZXNzYWdlW3RpbWVzdGFtcCA9ICR7dGltZXN0YW1wfV1bc3RhdHVzID0gXCJkZWxpdmVyZWRcIl1gXG4gICAgICApO1xuICAgICAgYXdhaXQgbWVzc2FnZS53YWl0Rm9yKCk7XG5cbiAgICAgIGlmIChydW5JZCA+PSBESVNDQVJEX0NPVU5UKSB7XG4gICAgICAgIGRlbHRhTGlzdC5wdXNoKGRlbHRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3J1bj0lZCBpbmZvPSVqJywgcnVuSWQgLSBESVNDQVJEX0NPVU5ULCB7IGRlbHRhIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Rpc2NhcmRlZD0lZCBpbmZvPSVqJywgcnVuSWQsIHsgZGVsdGEgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ3N0YXRzIGluZm89JWonLCB7IGRlbHRhOiBzdGF0cyhkZWx0YUxpc3QsIFs5OSwgOTkuOF0pIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGF3YWl0IGJvb3RzdHJhcC5zYXZlTG9ncygpO1xuICAgIHRocm93IGVycm9yO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IGFwcD8uY2xvc2UoKTtcbiAgICBhd2FpdCBib290c3RyYXAudGVhcmRvd24oKTtcbiAgfVxufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7OztBQUlBLG9CQUFtQjtBQUVuQix5QkFBNEI7QUFHNUIsc0JBQWtFO0FBRWxFLE1BQU0sb0JBQW9CO0FBRTFCLE1BQU0sZUFBZTtBQUVyQixBQUFDLGFBQVk7QUFDWCxRQUFNLFlBQVksSUFBSSwwQkFBVTtBQUFBLElBQzlCLFdBQVc7QUFBQSxFQUNiLENBQUM7QUFFRCxRQUFNLFVBQVUsS0FBSztBQUNyQixNQUFJO0FBRUosTUFBSTtBQUNGLFVBQU0sTUFBTSxVQUFVLEtBQUs7QUFFM0IsVUFBTSxFQUFFLFFBQVEsVUFBVSxPQUFPLFlBQVk7QUFFN0MsVUFBTSxDQUFDLFNBQVM7QUFFaEIsVUFBTSxXQUFXLElBQUksTUFBYztBQUNuQywrQkFBTSxZQUFZO0FBR2xCLGVBQVcsV0FBVyxTQUFTLE1BQU0sRUFBRSxRQUFRLEdBQUc7QUFDaEQsVUFBSSxRQUFRO0FBQ1osVUFBSSxZQUFZLE9BQU87QUFDckIsZ0JBQVE7QUFBQSxNQUNWO0FBRUEsZUFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRztBQUNqQyxjQUFNLG1CQUFtQixVQUFVLGFBQWE7QUFFaEQsY0FBTSxTQUFTLE1BQU0sUUFBUTtBQUU3QixpQkFBUyxLQUNQLE1BQU0sUUFBUSxZQUNaLFNBQ0EsU0FBUyxlQUFlLElBQUksV0FBVyxRQUFRLGVBQy9DO0FBQUEsVUFDRSxXQUFXO0FBQUEsVUFDWCxRQUFRO0FBQUEsUUFDVixDQUNGLENBQ0Y7QUFDQSxpQkFBUyxLQUNQLE1BQU0sTUFBTSxnQkFBZ0IsU0FBUztBQUFBLFVBQ25DLFdBQVcsVUFBVSxhQUFhO0FBQUEsVUFDbEMsVUFBVTtBQUFBLFlBQ1I7QUFBQSxjQUNFLFlBQVksUUFBUSxPQUFPO0FBQUEsY0FDM0IsV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLENBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLFVBQU0sUUFBUSxJQUFJLFNBQVMsSUFBSSxhQUFXLE9BQU8sS0FBSyxTQUFTLE9BQU8sQ0FBQyxDQUFDO0FBRXhFLFVBQU0sU0FBUyxNQUFNLElBQUksVUFBVTtBQUVuQywrQkFBTSxzQkFBc0I7QUFDNUI7QUFDRSxZQUFNLFdBQVcsT0FBTyxRQUFRLG9CQUFvQjtBQUNwRCxZQUFNLE9BQU8sU0FBUyxRQUNwQiwyQ0FDYyxLQUFLLFVBQVUsTUFBTSxXQUFXLFFBQ3RDLEtBQUssVUFBVSxZQUFZLEdBQ3JDO0FBQ0EsWUFBTSxLQUFLLE1BQU07QUFBQSxJQUNuQjtBQUVBLFVBQU0sV0FBVyxPQUFPLFFBQ3RCLCtEQUNGO0FBRUEsVUFBTSxZQUFZLElBQUksTUFBYztBQUNwQyxhQUFTLFFBQVEsR0FBRyxRQUFRLDRCQUFZLCtCQUFlLFNBQVMsR0FBRztBQUNqRSxpQ0FBTSwyQ0FBMkM7QUFDakQsWUFBTSxjQUFjLE9BQU8sUUFDekIsdUVBRUY7QUFDQSxZQUFNLFFBQVEsWUFBWSxRQUFRLHlCQUF5QjtBQUUzRCxpQ0FBTSx1QkFBdUI7QUFDN0IsWUFBTSxNQUFNLEtBQUssY0FBYyxPQUFPO0FBQ3RDLFlBQU0sTUFBTSxNQUFNLE9BQU87QUFFekIsaUNBQU0sb0NBQW9DO0FBQzFDLFlBQU0sRUFBRSxNQUFNLFdBQVcsTUFBTSxNQUFNLGVBQWU7QUFDcEQsNEJBQU8sWUFBWSxNQUFNLGNBQWMsT0FBTztBQUM5Qyw0QkFBTyxZQUFZLFFBQVEsT0FBTztBQUVsQyxpQ0FBTSxpQ0FBaUM7QUFDdkMsWUFBTSxFQUFFLFdBQVcsVUFBVSxNQUFNLElBQUksbUJBQW1CO0FBRTFELGlDQUFNLDBCQUEwQjtBQUNoQyxZQUFNLFdBQVcsTUFBTSxNQUFNLGVBQWUsU0FBUztBQUFBLFFBQ25ELFdBQVcsWUFBWTtBQUFBLFFBQ3ZCLG1CQUFtQixDQUFDLFNBQVM7QUFBQSxRQUM3QixNQUFNLCtCQUFZO0FBQUEsTUFDcEIsQ0FBQztBQUVELFlBQU0sT0FBTyxLQUFLLFNBQVMsUUFBUTtBQUVuQyxpQ0FBTSxrQ0FBa0M7QUFDeEMsWUFBTSxVQUFVLFNBQVMsUUFDdkIsOEJBQThCLGtDQUNoQztBQUNBLFlBQU0sUUFBUSxRQUFRO0FBRXRCLFVBQUksU0FBUywrQkFBZTtBQUMxQixrQkFBVSxLQUFLLEtBQUs7QUFDcEIsZ0JBQVEsSUFBSSxrQkFBa0IsUUFBUSwrQkFBZSxFQUFFLE1BQU0sQ0FBQztBQUFBLE1BQ2hFLE9BQU87QUFDTCxnQkFBUSxJQUFJLHdCQUF3QixPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBRUEsWUFBUSxJQUFJLGlCQUFpQixFQUFFLE9BQU8sMkJBQU0sV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUFBLEVBQ3RFLFNBQVMsT0FBUDtBQUNBLFVBQU0sVUFBVSxTQUFTO0FBQ3pCLFVBQU07QUFBQSxFQUNSLFVBQUU7QUFDQSxVQUFNLEtBQUssTUFBTTtBQUNqQixVQUFNLFVBQVUsU0FBUztBQUFBLEVBQzNCO0FBQ0YsR0FBRzsiLAogICJuYW1lcyI6IFtdCn0K
