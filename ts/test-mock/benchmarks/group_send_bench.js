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
  const { contacts, phone } = bootstrap;
  const members = [...contacts].slice(0, import_fixtures.GROUP_SIZE);
  const group = await phone.createGroup({
    title: "Mock Group",
    members: [phone, ...members]
  });
  await phone.setStorageState(import_mock_server.StorageState.getEmpty().addGroup(group, { whitelisted: true }).pinGroup(group));
  let app;
  try {
    app = await bootstrap.link();
    const { server, desktop } = bootstrap;
    const [first] = members;
    const messages = new Array();
    (0, import_fixtures.debug)("encrypting");
    for (const contact of members.slice().reverse()) {
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
    for (let i = 0; i < CONVERSATION_SIZE; i += 1) {
      const contact = members[i % members.length];
      const messageTimestamp = bootstrap.getTimestamp();
      const isLast = i === CONVERSATION_SIZE - 1;
      messages.push(await contact.encryptText(desktop, isLast ? LAST_MESSAGE : `#${i} from: ${contact.profileName}`, {
        timestamp: messageTimestamp,
        sealed: true,
        group
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
    (0, import_fixtures.debug)("encrypted");
    await Promise.all(messages.map((message) => server.send(desktop, message)));
    const window = await app.getWindow();
    (0, import_fixtures.debug)("opening conversation");
    {
      const leftPane = window.locator(".left-pane-wrapper");
      const item = leftPane.locator(`_react=BaseConversationListItem[title = ${JSON.stringify(group.title)}]>> ${JSON.stringify(LAST_MESSAGE)}`);
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
      const { body, source, envelopeType } = await first.waitForMessage();
      import_assert.default.strictEqual(body, `my message ${runId}`);
      import_assert.default.strictEqual(source, desktop);
      import_assert.default.strictEqual(envelopeType, import_mock_server.EnvelopeType.SenderKey);
      (0, import_fixtures.debug)("waiting for timing from the app");
      const { timestamp, delta } = await app.waitForMessageSend();
      (0, import_fixtures.debug)("sending delivery receipts");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ3JvdXBfc2VuZF9iZW5jaC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjIgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuLyogZXNsaW50LWRpc2FibGUgbm8tYXdhaXQtaW4tbG9vcCwgbm8tY29uc29sZSAqL1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2VTdGF0ZSxcbiAgRW52ZWxvcGVUeXBlLFxuICBSZWNlaXB0VHlwZSxcbn0gZnJvbSAnQHNpZ25hbGFwcC9tb2NrLXNlcnZlcic7XG5cbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5pbXBvcnQge1xuICBCb290c3RyYXAsXG4gIGRlYnVnLFxuICBzdGF0cyxcbiAgUlVOX0NPVU5ULFxuICBHUk9VUF9TSVpFLFxuICBESVNDQVJEX0NPVU5ULFxufSBmcm9tICcuL2ZpeHR1cmVzJztcblxuY29uc3QgQ09OVkVSU0FUSU9OX1NJWkUgPSA1MDA7IC8vIG1lc3NhZ2VzXG5jb25zdCBMQVNUX01FU1NBR0UgPSAnc3RhcnQgc2VuZGluZyBtZXNzYWdlcyBub3cnO1xuXG4oYXN5bmMgKCkgPT4ge1xuICBjb25zdCBib290c3RyYXAgPSBuZXcgQm9vdHN0cmFwKHtcbiAgICBiZW5jaG1hcms6IHRydWUsXG4gIH0pO1xuXG4gIGF3YWl0IGJvb3RzdHJhcC5pbml0KCk7XG5cbiAgY29uc3QgeyBjb250YWN0cywgcGhvbmUgfSA9IGJvb3RzdHJhcDtcblxuICBjb25zdCBtZW1iZXJzID0gWy4uLmNvbnRhY3RzXS5zbGljZSgwLCBHUk9VUF9TSVpFKTtcblxuICBjb25zdCBncm91cCA9IGF3YWl0IHBob25lLmNyZWF0ZUdyb3VwKHtcbiAgICB0aXRsZTogJ01vY2sgR3JvdXAnLFxuICAgIG1lbWJlcnM6IFtwaG9uZSwgLi4ubWVtYmVyc10sXG4gIH0pO1xuXG4gIGF3YWl0IHBob25lLnNldFN0b3JhZ2VTdGF0ZShcbiAgICBTdG9yYWdlU3RhdGUuZ2V0RW1wdHkoKVxuICAgICAgLmFkZEdyb3VwKGdyb3VwLCB7IHdoaXRlbGlzdGVkOiB0cnVlIH0pXG4gICAgICAucGluR3JvdXAoZ3JvdXApXG4gICk7XG5cbiAgbGV0IGFwcDogQXBwIHwgdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgYXBwID0gYXdhaXQgYm9vdHN0cmFwLmxpbmsoKTtcblxuICAgIGNvbnN0IHsgc2VydmVyLCBkZXNrdG9wIH0gPSBib290c3RyYXA7XG4gICAgY29uc3QgW2ZpcnN0XSA9IG1lbWJlcnM7XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBBcnJheTxCdWZmZXI+KCk7XG4gICAgZGVidWcoJ2VuY3J5cHRpbmcnKTtcbiAgICAvLyBGaWxsIGxlZnQgcGFuZVxuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBtZW1iZXJzLnNsaWNlKCkucmV2ZXJzZSgpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlVGltZXN0YW1wID0gYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpO1xuXG4gICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICBhd2FpdCBjb250YWN0LmVuY3J5cHRUZXh0KFxuICAgICAgICAgIGRlc2t0b3AsXG4gICAgICAgICAgYGhlbGxvIGZyb206ICR7Y29udGFjdC5wcm9maWxlTmFtZX1gLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZVRpbWVzdGFtcCxcbiAgICAgICAgICAgIHNlYWxlZDogdHJ1ZSxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICBhd2FpdCBwaG9uZS5lbmNyeXB0U3luY1JlYWQoZGVza3RvcCwge1xuICAgICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbmRlclVVSUQ6IGNvbnRhY3QuZGV2aWNlLnV1aWQsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZVRpbWVzdGFtcCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRmlsbCBncm91cFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQ09OVkVSU0FUSU9OX1NJWkU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY29udGFjdCA9IG1lbWJlcnNbaSAlIG1lbWJlcnMubGVuZ3RoXTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VUaW1lc3RhbXAgPSBib290c3RyYXAuZ2V0VGltZXN0YW1wKCk7XG5cbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IENPTlZFUlNBVElPTl9TSVpFIC0gMTtcblxuICAgICAgbWVzc2FnZXMucHVzaChcbiAgICAgICAgYXdhaXQgY29udGFjdC5lbmNyeXB0VGV4dChcbiAgICAgICAgICBkZXNrdG9wLFxuICAgICAgICAgIGlzTGFzdCA/IExBU1RfTUVTU0FHRSA6IGAjJHtpfSBmcm9tOiAke2NvbnRhY3QucHJvZmlsZU5hbWV9YCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aW1lc3RhbXA6IG1lc3NhZ2VUaW1lc3RhbXAsXG4gICAgICAgICAgICBzZWFsZWQ6IHRydWUsXG4gICAgICAgICAgICBncm91cCxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBtZXNzYWdlcy5wdXNoKFxuICAgICAgICBhd2FpdCBwaG9uZS5lbmNyeXB0U3luY1JlYWQoZGVza3RvcCwge1xuICAgICAgICAgIHRpbWVzdGFtcDogYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpLFxuICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbmRlclVVSUQ6IGNvbnRhY3QuZGV2aWNlLnV1aWQsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZVRpbWVzdGFtcCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICAgIGRlYnVnKCdlbmNyeXB0ZWQnKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+IHNlcnZlci5zZW5kKGRlc2t0b3AsIG1lc3NhZ2UpKSk7XG5cbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBhcHAuZ2V0V2luZG93KCk7XG5cbiAgICBkZWJ1Zygnb3BlbmluZyBjb252ZXJzYXRpb24nKTtcbiAgICB7XG4gICAgICBjb25zdCBsZWZ0UGFuZSA9IHdpbmRvdy5sb2NhdG9yKCcubGVmdC1wYW5lLXdyYXBwZXInKTtcblxuICAgICAgY29uc3QgaXRlbSA9IGxlZnRQYW5lLmxvY2F0b3IoXG4gICAgICAgICdfcmVhY3Q9QmFzZUNvbnZlcnNhdGlvbkxpc3RJdGVtJyArXG4gICAgICAgICAgYFt0aXRsZSA9ICR7SlNPTi5zdHJpbmdpZnkoZ3JvdXAudGl0bGUpfV1gICtcbiAgICAgICAgICBgPj4gJHtKU09OLnN0cmluZ2lmeShMQVNUX01FU1NBR0UpfWBcbiAgICAgICk7XG4gICAgICBhd2FpdCBpdGVtLmNsaWNrKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGltZWxpbmUgPSB3aW5kb3cubG9jYXRvcihcbiAgICAgICcudGltZWxpbmUtd3JhcHBlciwgLkNvbnZlcnNhdGlvblZpZXdfX3RlbXBsYXRlIC5yZWFjdC13cmFwcGVyJ1xuICAgICk7XG5cbiAgICBjb25zdCBkZWx0YUxpc3QgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgIGZvciAobGV0IHJ1bklkID0gMDsgcnVuSWQgPCBSVU5fQ09VTlQgKyBESVNDQVJEX0NPVU5UOyBydW5JZCArPSAxKSB7XG4gICAgICBkZWJ1ZygnZmluZGluZyBjb21wb3NpdGlvbiBpbnB1dCBhbmQgY2xpY2tpbmcgaXQnKTtcbiAgICAgIGNvbnN0IGNvbXBvc2VBcmVhID0gd2luZG93LmxvY2F0b3IoXG4gICAgICAgICcuY29tcG9zaXRpb24tYXJlYS13cmFwcGVyLCAnICtcbiAgICAgICAgICAnLkNvbnZlcnNhdGlvblZpZXdfX3RlbXBsYXRlIC5yZWFjdC13cmFwcGVyJ1xuICAgICAgKTtcblxuICAgICAgY29uc3QgaW5wdXQgPSBjb21wb3NlQXJlYS5sb2NhdG9yKCdfcmVhY3Q9Q29tcG9zaXRpb25JbnB1dCcpO1xuXG4gICAgICBkZWJ1ZygnZW50ZXJpbmcgbWVzc2FnZSB0ZXh0Jyk7XG4gICAgICBhd2FpdCBpbnB1dC50eXBlKGBteSBtZXNzYWdlICR7cnVuSWR9YCk7XG4gICAgICBhd2FpdCBpbnB1dC5wcmVzcygnRW50ZXInKTtcblxuICAgICAgZGVidWcoJ3dhaXRpbmcgZm9yIG1lc3NhZ2Ugb24gc2VydmVyIHNpZGUnKTtcbiAgICAgIGNvbnN0IHsgYm9keSwgc291cmNlLCBlbnZlbG9wZVR5cGUgfSA9IGF3YWl0IGZpcnN0LndhaXRGb3JNZXNzYWdlKCk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYm9keSwgYG15IG1lc3NhZ2UgJHtydW5JZH1gKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChzb3VyY2UsIGRlc2t0b3ApO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVudmVsb3BlVHlwZSwgRW52ZWxvcGVUeXBlLlNlbmRlcktleSk7XG5cbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciB0aW1pbmcgZnJvbSB0aGUgYXBwJyk7XG4gICAgICBjb25zdCB7IHRpbWVzdGFtcCwgZGVsdGEgfSA9IGF3YWl0IGFwcC53YWl0Rm9yTWVzc2FnZVNlbmQoKTtcblxuICAgICAgZGVidWcoJ3NlbmRpbmcgZGVsaXZlcnkgcmVjZWlwdHMnKTtcbiAgICAgIGNvbnN0IGRlbGl2ZXJ5ID0gYXdhaXQgZmlyc3QuZW5jcnlwdFJlY2VpcHQoZGVza3RvcCwge1xuICAgICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcCArIDEsXG4gICAgICAgIG1lc3NhZ2VUaW1lc3RhbXBzOiBbdGltZXN0YW1wXSxcbiAgICAgICAgdHlwZTogUmVjZWlwdFR5cGUuRGVsaXZlcnksXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgc2VydmVyLnNlbmQoZGVza3RvcCwgZGVsaXZlcnkpO1xuXG4gICAgICBkZWJ1Zygnd2FpdGluZyBmb3IgbWVzc2FnZSBzdGF0ZSBjaGFuZ2UnKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aW1lbGluZS5sb2NhdG9yKFxuICAgICAgICBgX3JlYWN0PU1lc3NhZ2VbdGltZXN0YW1wID0gJHt0aW1lc3RhbXB9XVtzdGF0dXMgPSBcImRlbGl2ZXJlZFwiXWBcbiAgICAgICk7XG4gICAgICBhd2FpdCBtZXNzYWdlLndhaXRGb3IoKTtcblxuICAgICAgaWYgKHJ1bklkID49IERJU0NBUkRfQ09VTlQpIHtcbiAgICAgICAgZGVsdGFMaXN0LnB1c2goZGVsdGEpO1xuICAgICAgICBjb25zb2xlLmxvZygncnVuPSVkIGluZm89JWonLCBydW5JZCAtIERJU0NBUkRfQ09VTlQsIHsgZGVsdGEgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnZGlzY2FyZGVkPSVkIGluZm89JWonLCBydW5JZCwgeyBkZWx0YSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnc3RhdHMgaW5mbz0laicsIHsgZGVsdGE6IHN0YXRzKGRlbHRhTGlzdCwgWzk5LCA5OS44XSkgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXdhaXQgYm9vdHN0cmFwLnNhdmVMb2dzKCk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgYXBwPy5jbG9zZSgpO1xuICAgIGF3YWl0IGJvb3RzdHJhcC50ZWFyZG93bigpO1xuICB9XG59KSgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsb0JBQW1CO0FBRW5CLHlCQUlPO0FBR1Asc0JBT087QUFFUCxNQUFN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
