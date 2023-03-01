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
var groupCredentialFetcher_exports = {};
__export(groupCredentialFetcher_exports, {
  GROUP_CREDENTIALS_KEY: () => GROUP_CREDENTIALS_KEY,
  getCheckedCredentialsForToday: () => getCheckedCredentialsForToday,
  getDatesForRequest: () => getDatesForRequest,
  initializeGroupCredentialFetcher: () => initializeGroupCredentialFetcher,
  maybeFetchNewCredentials: () => maybeFetchNewCredentials,
  runWithRetry: () => runWithRetry,
  sortCredentials: () => sortCredentials
});
module.exports = __toCommonJS(groupCredentialFetcher_exports);
var import_lodash = require("lodash");
var import_zkgroup = require("@signalapp/libsignal-client/zkgroup");
var import_zkgroup2 = require("../util/zkgroup");
var import_assert = require("../util/assert");
var durations = __toESM(require("../util/durations"));
var import_BackOff = require("../util/BackOff");
var import_sleep = require("../util/sleep");
var import_timestamp = require("../util/timestamp");
var import_UUID = require("../types/UUID");
var log = __toESM(require("../logging/log"));
const GROUP_CREDENTIALS_KEY = "groupCredentials";
let started = false;
function getCheckedCredentials(reason) {
  const result = window.storage.get("groupCredentials");
  (0, import_assert.strictAssert)(result !== void 0, `getCheckedCredentials: no credentials found, ${reason}`);
  return result;
}
async function initializeGroupCredentialFetcher() {
  if (started) {
    return;
  }
  log.info("initializeGroupCredentialFetcher: starting...");
  started = true;
  await runWithRetry(maybeFetchNewCredentials, {
    scheduleAnother: 4 * durations.HOUR
  });
}
const BACKOFF_TIMEOUTS = [
  durations.SECOND,
  5 * durations.SECOND,
  30 * durations.SECOND,
  2 * durations.MINUTE,
  5 * durations.MINUTE
];
async function runWithRetry(fn, options = {}) {
  const backOff = new import_BackOff.BackOff(BACKOFF_TIMEOUTS);
  while (true) {
    try {
      await fn();
      return;
    } catch (error) {
      const wait = backOff.getAndIncrement();
      log.info(`runWithRetry: ${fn.name} failed. Waiting ${wait}ms for retry. Error: ${error.stack}`);
      await (0, import_sleep.sleep)(wait);
    }
  }
  const duration = options.scheduleAnother;
  if (duration) {
    log.info(`runWithRetry: scheduling another run with a setTimeout duration of ${duration}ms`);
    setTimeout(async () => runWithRetry(fn, options), duration);
  }
}
function getCheckedCredentialsForToday(reason) {
  const data = getCheckedCredentials(reason);
  const today = (0, import_timestamp.toDayMillis)(Date.now());
  const todayIndex = data.findIndex((item) => item.redemptionTime === today);
  if (todayIndex < 0) {
    throw new Error("getCredentialsForToday: Cannot find credentials for today");
  }
  return {
    today: data[todayIndex],
    tomorrow: data[todayIndex + 1]
  };
}
async function maybeFetchNewCredentials() {
  const logId = "maybeFetchNewCredentials";
  const aci = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI)?.toString();
  if (!aci) {
    log.info(`${logId}: no ACI, returning early`);
    return;
  }
  const previous = window.storage.get("groupCredentials");
  const requestDates = getDatesForRequest(previous);
  if (!requestDates) {
    log.info(`${logId}: no new credentials needed`);
    return;
  }
  const { server } = window.textsecure;
  if (!server) {
    log.error(`${logId}: unable to get server`);
    return;
  }
  const { startDayInMs, endDayInMs } = requestDates;
  log.info(`${logId}: fetching credentials for ${startDayInMs} through ${endDayInMs}`);
  const serverPublicParamsBase64 = window.getServerPublicParams();
  const clientZKAuthOperations = (0, import_zkgroup2.getClientZkAuthOperations)(serverPublicParamsBase64);
  const { pni, credentials: rawCredentials } = await server.getGroupCredentials({ startDayInMs, endDayInMs });
  (0, import_assert.strictAssert)(pni, "Server must give pni along with group credentials");
  const localPni = window.storage.user.getUuid(import_UUID.UUIDKind.PNI);
  if (pni !== localPni?.toString()) {
    log.error(`${logId}: local PNI ${localPni}, does not match remote ${pni}`);
  }
  const newCredentials = sortCredentials(rawCredentials).map((item) => {
    const authCredential = clientZKAuthOperations.receiveAuthCredentialWithPni(aci, pni, item.redemptionTime, new import_zkgroup.AuthCredentialWithPniResponse(Buffer.from(item.credential, "base64")));
    const credential = authCredential.serialize().toString("base64");
    return {
      redemptionTime: item.redemptionTime * durations.SECOND,
      credential
    };
  });
  const today = (0, import_timestamp.toDayMillis)(Date.now());
  const previousCleaned = previous ? previous.filter((item) => item.redemptionTime >= today) : [];
  const finalCredentials = [...previousCleaned, ...newCredentials];
  log.info(`${logId}: Saving new credentials...`);
  window.storage.put("groupCredentials", finalCredentials);
  log.info(`${logId}: Save complete.`);
}
function getDatesForRequest(data) {
  const today = (0, import_timestamp.toDayMillis)(Date.now());
  const sixDaysOut = today + 6 * durations.DAY;
  const lastCredential = (0, import_lodash.last)(data);
  if (!lastCredential || lastCredential.redemptionTime < today) {
    return {
      startDayInMs: today,
      endDayInMs: sixDaysOut
    };
  }
  if (lastCredential.redemptionTime >= sixDaysOut) {
    return void 0;
  }
  return {
    startDayInMs: lastCredential.redemptionTime + durations.DAY,
    endDayInMs: sixDaysOut
  };
}
function sortCredentials(data) {
  return (0, import_lodash.sortBy)(data, (item) => item.redemptionTime);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GROUP_CREDENTIALS_KEY,
  getCheckedCredentialsForToday,
  getDatesForRequest,
  initializeGroupCredentialFetcher,
  maybeFetchNewCredentials,
  runWithRetry,
  sortCredentials
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ3JvdXBDcmVkZW50aWFsRmV0Y2hlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gQ29weXJpZ2h0IDIwMjAgU2lnbmFsIE1lc3NlbmdlciwgTExDXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb25seVxuXG5pbXBvcnQgeyBsYXN0LCBzb3J0QnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXV0aENyZWRlbnRpYWxXaXRoUG5pUmVzcG9uc2UgfSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQvemtncm91cCc7XG5cbmltcG9ydCB7IGdldENsaWVudFprQXV0aE9wZXJhdGlvbnMgfSBmcm9tICcuLi91dGlsL3prZ3JvdXAnO1xuXG5pbXBvcnQgdHlwZSB7IEdyb3VwQ3JlZGVudGlhbFR5cGUgfSBmcm9tICcuLi90ZXh0c2VjdXJlL1dlYkFQSSc7XG5pbXBvcnQgeyBzdHJpY3RBc3NlcnQgfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBkdXJhdGlvbnMgZnJvbSAnLi4vdXRpbC9kdXJhdGlvbnMnO1xuaW1wb3J0IHsgQmFja09mZiB9IGZyb20gJy4uL3V0aWwvQmFja09mZic7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJy4uL3V0aWwvc2xlZXAnO1xuaW1wb3J0IHsgdG9EYXlNaWxsaXMgfSBmcm9tICcuLi91dGlsL3RpbWVzdGFtcCc7XG5pbXBvcnQgeyBVVUlES2luZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcblxuZXhwb3J0IGNvbnN0IEdST1VQX0NSRURFTlRJQUxTX0tFWSA9ICdncm91cENyZWRlbnRpYWxzJztcblxudHlwZSBDcmVkZW50aWFsc0RhdGFUeXBlID0gUmVhZG9ubHlBcnJheTxHcm91cENyZWRlbnRpYWxUeXBlPjtcbnR5cGUgUmVxdWVzdERhdGVzVHlwZSA9IHtcbiAgc3RhcnREYXlJbk1zOiBudW1iZXI7XG4gIGVuZERheUluTXM6IG51bWJlcjtcbn07XG50eXBlIE5leHRDcmVkZW50aWFsc1R5cGUgPSB7XG4gIHRvZGF5OiBHcm91cENyZWRlbnRpYWxUeXBlO1xuICB0b21vcnJvdzogR3JvdXBDcmVkZW50aWFsVHlwZTtcbn07XG5cbmxldCBzdGFydGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGdldENoZWNrZWRDcmVkZW50aWFscyhyZWFzb246IHN0cmluZyk6IENyZWRlbnRpYWxzRGF0YVR5cGUge1xuICBjb25zdCByZXN1bHQgPSB3aW5kb3cuc3RvcmFnZS5nZXQoJ2dyb3VwQ3JlZGVudGlhbHMnKTtcbiAgc3RyaWN0QXNzZXJ0KFxuICAgIHJlc3VsdCAhPT0gdW5kZWZpbmVkLFxuICAgIGBnZXRDaGVja2VkQ3JlZGVudGlhbHM6IG5vIGNyZWRlbnRpYWxzIGZvdW5kLCAke3JlYXNvbn1gXG4gICk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplR3JvdXBDcmVkZW50aWFsRmV0Y2hlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKHN0YXJ0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2cuaW5mbygnaW5pdGlhbGl6ZUdyb3VwQ3JlZGVudGlhbEZldGNoZXI6IHN0YXJ0aW5nLi4uJyk7XG4gIHN0YXJ0ZWQgPSB0cnVlO1xuXG4gIC8vIEJlY2F1c2Ugd2UgZmV0Y2ggZWlnaHQgZGF5cyBvZiBjcmVkZW50aWFscyBhdCBhIHRpbWUsIHdlIHJlYWxseSBvbmx5IG5lZWQgdG8gcnVuXG4gIC8vICAgdGhpcyBhYm91dCBvbmNlIGEgd2Vlay4gQnV0IHRoZXJlJ3Mgbm8gcHJvYmxlbSBydW5uaW5nIGl0IG1vcmUgb2Z0ZW47IGl0IHdpbGwgZG9cbiAgLy8gICBub3RoaW5nIGlmIG5vIG5ldyBjcmVkZW50aWFscyBhcmUgbmVlZGVkLCBhbmQgd2lsbCBvbmx5IHJlcXVlc3QgbmVlZGVkIGNyZWRlbnRpYWxzLlxuICBhd2FpdCBydW5XaXRoUmV0cnkobWF5YmVGZXRjaE5ld0NyZWRlbnRpYWxzLCB7XG4gICAgc2NoZWR1bGVBbm90aGVyOiA0ICogZHVyYXRpb25zLkhPVVIsXG4gIH0pO1xufVxuXG5jb25zdCBCQUNLT0ZGX1RJTUVPVVRTID0gW1xuICBkdXJhdGlvbnMuU0VDT05ELFxuICA1ICogZHVyYXRpb25zLlNFQ09ORCxcbiAgMzAgKiBkdXJhdGlvbnMuU0VDT05ELFxuICAyICogZHVyYXRpb25zLk1JTlVURSxcbiAgNSAqIGR1cmF0aW9ucy5NSU5VVEUsXG5dO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuV2l0aFJldHJ5KFxuICBmbjogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgb3B0aW9uczogeyBzY2hlZHVsZUFub3RoZXI/OiBudW1iZXIgfSA9IHt9XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYmFja09mZiA9IG5ldyBCYWNrT2ZmKEJBQ0tPRkZfVElNRU9VVFMpO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IGZuKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IHdhaXQgPSBiYWNrT2ZmLmdldEFuZEluY3JlbWVudCgpO1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgIGBydW5XaXRoUmV0cnk6ICR7Zm4ubmFtZX0gZmFpbGVkLiBXYWl0aW5nICR7d2FpdH1tcyBmb3IgcmV0cnkuIEVycm9yOiAke2Vycm9yLnN0YWNrfWBcbiAgICAgICk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgc2xlZXAod2FpdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gSXQncyBpbXBvcnRhbnQgdG8gc2NoZWR1bGUgb3VyIG5leHQgcnVuIGhlcmUgaW5zdGVhZCBvZiB0aGUgbGV2ZWwgYWJvdmU7IG90aGVyd2lzZSB3ZVxuICAvLyAgIGNvdWxkIGVuZCB1cCB3aXRoIG11bHRpcGxlIGVuZGxlc3NseS1yZXRyeWluZyBydW5zLlxuICBjb25zdCBkdXJhdGlvbiA9IG9wdGlvbnMuc2NoZWR1bGVBbm90aGVyO1xuICBpZiAoZHVyYXRpb24pIHtcbiAgICBsb2cuaW5mbyhcbiAgICAgIGBydW5XaXRoUmV0cnk6IHNjaGVkdWxpbmcgYW5vdGhlciBydW4gd2l0aCBhIHNldFRpbWVvdXQgZHVyYXRpb24gb2YgJHtkdXJhdGlvbn1tc2BcbiAgICApO1xuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4gcnVuV2l0aFJldHJ5KGZuLCBvcHRpb25zKSwgZHVyYXRpb24pO1xuICB9XG59XG5cbi8vIEluIGNhc2VzIHdoZXJlIHdlIGFyZSBhdCBhIGRheSBib3VuZGFyeSwgd2UgbWlnaHQgbmVlZCB0byB1c2UgdG9tb3Jyb3cgaW4gYSByZXRyeVxuZXhwb3J0IGZ1bmN0aW9uIGdldENoZWNrZWRDcmVkZW50aWFsc0ZvclRvZGF5KFxuICByZWFzb246IHN0cmluZ1xuKTogTmV4dENyZWRlbnRpYWxzVHlwZSB7XG4gIGNvbnN0IGRhdGEgPSBnZXRDaGVja2VkQ3JlZGVudGlhbHMocmVhc29uKTtcblxuICBjb25zdCB0b2RheSA9IHRvRGF5TWlsbGlzKERhdGUubm93KCkpO1xuICBjb25zdCB0b2RheUluZGV4ID0gZGF0YS5maW5kSW5kZXgoXG4gICAgKGl0ZW06IEdyb3VwQ3JlZGVudGlhbFR5cGUpID0+IGl0ZW0ucmVkZW1wdGlvblRpbWUgPT09IHRvZGF5XG4gICk7XG4gIGlmICh0b2RheUluZGV4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdnZXRDcmVkZW50aWFsc0ZvclRvZGF5OiBDYW5ub3QgZmluZCBjcmVkZW50aWFscyBmb3IgdG9kYXknXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9kYXk6IGRhdGFbdG9kYXlJbmRleF0sXG4gICAgdG9tb3Jyb3c6IGRhdGFbdG9kYXlJbmRleCArIDFdLFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWF5YmVGZXRjaE5ld0NyZWRlbnRpYWxzKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBsb2dJZCA9ICdtYXliZUZldGNoTmV3Q3JlZGVudGlhbHMnO1xuXG4gIGNvbnN0IGFjaSA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLkFDSSk/LnRvU3RyaW5nKCk7XG4gIGlmICghYWNpKSB7XG4gICAgbG9nLmluZm8oYCR7bG9nSWR9OiBubyBBQ0ksIHJldHVybmluZyBlYXJseWApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHByZXZpb3VzOiBDcmVkZW50aWFsc0RhdGFUeXBlIHwgdW5kZWZpbmVkID1cbiAgICB3aW5kb3cuc3RvcmFnZS5nZXQoJ2dyb3VwQ3JlZGVudGlhbHMnKTtcbiAgY29uc3QgcmVxdWVzdERhdGVzID0gZ2V0RGF0ZXNGb3JSZXF1ZXN0KHByZXZpb3VzKTtcbiAgaWYgKCFyZXF1ZXN0RGF0ZXMpIHtcbiAgICBsb2cuaW5mbyhgJHtsb2dJZH06IG5vIG5ldyBjcmVkZW50aWFscyBuZWVkZWRgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IHNlcnZlciB9ID0gd2luZG93LnRleHRzZWN1cmU7XG4gIGlmICghc2VydmVyKSB7XG4gICAgbG9nLmVycm9yKGAke2xvZ0lkfTogdW5hYmxlIHRvIGdldCBzZXJ2ZXJgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IHN0YXJ0RGF5SW5NcywgZW5kRGF5SW5NcyB9ID0gcmVxdWVzdERhdGVzO1xuICBsb2cuaW5mbyhcbiAgICBgJHtsb2dJZH06IGZldGNoaW5nIGNyZWRlbnRpYWxzIGZvciAke3N0YXJ0RGF5SW5Nc30gdGhyb3VnaCAke2VuZERheUluTXN9YFxuICApO1xuXG4gIGNvbnN0IHNlcnZlclB1YmxpY1BhcmFtc0Jhc2U2NCA9IHdpbmRvdy5nZXRTZXJ2ZXJQdWJsaWNQYXJhbXMoKTtcbiAgY29uc3QgY2xpZW50WktBdXRoT3BlcmF0aW9ucyA9IGdldENsaWVudFprQXV0aE9wZXJhdGlvbnMoXG4gICAgc2VydmVyUHVibGljUGFyYW1zQmFzZTY0XG4gICk7XG5cbiAgY29uc3QgeyBwbmksIGNyZWRlbnRpYWxzOiByYXdDcmVkZW50aWFscyB9ID0gYXdhaXQgc2VydmVyLmdldEdyb3VwQ3JlZGVudGlhbHMoXG4gICAgeyBzdGFydERheUluTXMsIGVuZERheUluTXMgfVxuICApO1xuICBzdHJpY3RBc3NlcnQocG5pLCAnU2VydmVyIG11c3QgZ2l2ZSBwbmkgYWxvbmcgd2l0aCBncm91cCBjcmVkZW50aWFscycpO1xuXG4gIGNvbnN0IGxvY2FsUG5pID0gd2luZG93LnN0b3JhZ2UudXNlci5nZXRVdWlkKFVVSURLaW5kLlBOSSk7XG4gIGlmIChwbmkgIT09IGxvY2FsUG5pPy50b1N0cmluZygpKSB7XG4gICAgbG9nLmVycm9yKGAke2xvZ0lkfTogbG9jYWwgUE5JICR7bG9jYWxQbml9LCBkb2VzIG5vdCBtYXRjaCByZW1vdGUgJHtwbml9YCk7XG4gIH1cblxuICBjb25zdCBuZXdDcmVkZW50aWFscyA9IHNvcnRDcmVkZW50aWFscyhyYXdDcmVkZW50aWFscykubWFwKFxuICAgIChpdGVtOiBHcm91cENyZWRlbnRpYWxUeXBlKSA9PiB7XG4gICAgICBjb25zdCBhdXRoQ3JlZGVudGlhbCA9XG4gICAgICAgIGNsaWVudFpLQXV0aE9wZXJhdGlvbnMucmVjZWl2ZUF1dGhDcmVkZW50aWFsV2l0aFBuaShcbiAgICAgICAgICBhY2ksXG4gICAgICAgICAgcG5pLFxuICAgICAgICAgIGl0ZW0ucmVkZW1wdGlvblRpbWUsXG4gICAgICAgICAgbmV3IEF1dGhDcmVkZW50aWFsV2l0aFBuaVJlc3BvbnNlKFxuICAgICAgICAgICAgQnVmZmVyLmZyb20oaXRlbS5jcmVkZW50aWFsLCAnYmFzZTY0JylcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gYXV0aENyZWRlbnRpYWwuc2VyaWFsaXplKCkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRlbXB0aW9uVGltZTogaXRlbS5yZWRlbXB0aW9uVGltZSAqIGR1cmF0aW9ucy5TRUNPTkQsXG4gICAgICAgIGNyZWRlbnRpYWwsXG4gICAgICB9O1xuICAgIH1cbiAgKTtcblxuICBjb25zdCB0b2RheSA9IHRvRGF5TWlsbGlzKERhdGUubm93KCkpO1xuICBjb25zdCBwcmV2aW91c0NsZWFuZWQgPSBwcmV2aW91c1xuICAgID8gcHJldmlvdXMuZmlsdGVyKFxuICAgICAgICAoaXRlbTogR3JvdXBDcmVkZW50aWFsVHlwZSkgPT4gaXRlbS5yZWRlbXB0aW9uVGltZSA+PSB0b2RheVxuICAgICAgKVxuICAgIDogW107XG4gIGNvbnN0IGZpbmFsQ3JlZGVudGlhbHMgPSBbLi4ucHJldmlvdXNDbGVhbmVkLCAuLi5uZXdDcmVkZW50aWFsc107XG5cbiAgbG9nLmluZm8oYCR7bG9nSWR9OiBTYXZpbmcgbmV3IGNyZWRlbnRpYWxzLi4uYCk7XG4gIC8vIE5vdGU6IHdlIGRvbid0IHdhaXQgZm9yIHRoaXMgdG8gZmluaXNoXG4gIHdpbmRvdy5zdG9yYWdlLnB1dCgnZ3JvdXBDcmVkZW50aWFscycsIGZpbmFsQ3JlZGVudGlhbHMpO1xuICBsb2cuaW5mbyhgJHtsb2dJZH06IFNhdmUgY29tcGxldGUuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRlc0ZvclJlcXVlc3QoXG4gIGRhdGE/OiBDcmVkZW50aWFsc0RhdGFUeXBlXG4pOiBSZXF1ZXN0RGF0ZXNUeXBlIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgdG9kYXkgPSB0b0RheU1pbGxpcyhEYXRlLm5vdygpKTtcbiAgY29uc3Qgc2l4RGF5c091dCA9IHRvZGF5ICsgNiAqIGR1cmF0aW9ucy5EQVk7XG5cbiAgY29uc3QgbGFzdENyZWRlbnRpYWwgPSBsYXN0KGRhdGEpO1xuICBpZiAoIWxhc3RDcmVkZW50aWFsIHx8IGxhc3RDcmVkZW50aWFsLnJlZGVtcHRpb25UaW1lIDwgdG9kYXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnREYXlJbk1zOiB0b2RheSxcbiAgICAgIGVuZERheUluTXM6IHNpeERheXNPdXQsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChsYXN0Q3JlZGVudGlhbC5yZWRlbXB0aW9uVGltZSA+PSBzaXhEYXlzT3V0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnREYXlJbk1zOiBsYXN0Q3JlZGVudGlhbC5yZWRlbXB0aW9uVGltZSArIGR1cmF0aW9ucy5EQVksXG4gICAgZW5kRGF5SW5Nczogc2l4RGF5c091dCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRDcmVkZW50aWFscyhcbiAgZGF0YTogQ3JlZGVudGlhbHNEYXRhVHlwZVxuKTogQ3JlZGVudGlhbHNEYXRhVHlwZSB7XG4gIHJldHVybiBzb3J0QnkoZGF0YSwgKGl0ZW06IEdyb3VwQ3JlZGVudGlhbFR5cGUpID0+IGl0ZW0ucmVkZW1wdGlvblRpbWUpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG9CQUE2QjtBQUM3QixxQkFBOEM7QUFFOUMsc0JBQTBDO0FBRzFDLG9CQUE2QjtBQUM3QixnQkFBMkI7QUFDM0IscUJBQXdCO0FBQ3hCLG1CQUFzQjtBQUN0Qix1QkFBNEI7QUFDNUIsa0JBQXlCO0FBQ3pCLFVBQXFCO0FBRWQsTUFBTSx3QkFBd0I7QUFZckMsSUFBSSxVQUFVO0FBRWQsK0JBQStCLFFBQXFDO0FBQ2xFLFFBQU0sU0FBUyxPQUFPLFFBQVEsSUFBSSxrQkFBa0I7QUFDcEQsa0NBQ0UsV0FBVyxRQUNYLGdEQUFnRCxRQUNsRDtBQUNBLFNBQU87QUFDVDtBQVBTLEFBU1Qsa0RBQXdFO0FBQ3RFLE1BQUksU0FBUztBQUNYO0FBQUEsRUFDRjtBQUVBLE1BQUksS0FBSywrQ0FBK0M7QUFDeEQsWUFBVTtBQUtWLFFBQU0sYUFBYSwwQkFBMEI7QUFBQSxJQUMzQyxpQkFBaUIsSUFBSSxVQUFVO0FBQUEsRUFDakMsQ0FBQztBQUNIO0FBZHNCLEFBZ0J0QixNQUFNLG1CQUFtQjtBQUFBLEVBQ3ZCLFVBQVU7QUFBQSxFQUNWLElBQUksVUFBVTtBQUFBLEVBQ2QsS0FBSyxVQUFVO0FBQUEsRUFDZixJQUFJLFVBQVU7QUFBQSxFQUNkLElBQUksVUFBVTtBQUNoQjtBQUVBLDRCQUNFLElBQ0EsVUFBd0MsQ0FBQyxHQUMxQjtBQUNmLFFBQU0sVUFBVSxJQUFJLHVCQUFRLGdCQUFnQjtBQUc1QyxTQUFPLE1BQU07QUFDWCxRQUFJO0FBRUYsWUFBTSxHQUFHO0FBQ1Q7QUFBQSxJQUNGLFNBQVMsT0FBUDtBQUNBLFlBQU0sT0FBTyxRQUFRLGdCQUFnQjtBQUNyQyxVQUFJLEtBQ0YsaUJBQWlCLEdBQUcsd0JBQXdCLDRCQUE0QixNQUFNLE9BQ2hGO0FBRUEsWUFBTSx3QkFBTSxJQUFJO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBSUEsUUFBTSxXQUFXLFFBQVE7QUFDekIsTUFBSSxVQUFVO0FBQ1osUUFBSSxLQUNGLHNFQUFzRSxZQUN4RTtBQUNBLGVBQVcsWUFBWSxhQUFhLElBQUksT0FBTyxHQUFHLFFBQVE7QUFBQSxFQUM1RDtBQUNGO0FBL0JzQixBQWtDZix1Q0FDTCxRQUNxQjtBQUNyQixRQUFNLE9BQU8sc0JBQXNCLE1BQU07QUFFekMsUUFBTSxRQUFRLGtDQUFZLEtBQUssSUFBSSxDQUFDO0FBQ3BDLFFBQU0sYUFBYSxLQUFLLFVBQ3RCLENBQUMsU0FBOEIsS0FBSyxtQkFBbUIsS0FDekQ7QUFDQSxNQUFJLGFBQWEsR0FBRztBQUNsQixVQUFNLElBQUksTUFDUiwyREFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTCxPQUFPLEtBQUs7QUFBQSxJQUNaLFVBQVUsS0FBSyxhQUFhO0FBQUEsRUFDOUI7QUFDRjtBQW5CZ0IsQUFxQmhCLDBDQUFnRTtBQUM5RCxRQUFNLFFBQVE7QUFFZCxRQUFNLE1BQU0sT0FBTyxXQUFXLFFBQVEsS0FBSyxRQUFRLHFCQUFTLEdBQUcsR0FBRyxTQUFTO0FBQzNFLE1BQUksQ0FBQyxLQUFLO0FBQ1IsUUFBSSxLQUFLLEdBQUcsZ0NBQWdDO0FBQzVDO0FBQUEsRUFDRjtBQUVBLFFBQU0sV0FDSixPQUFPLFFBQVEsSUFBSSxrQkFBa0I7QUFDdkMsUUFBTSxlQUFlLG1CQUFtQixRQUFRO0FBQ2hELE1BQUksQ0FBQyxjQUFjO0FBQ2pCLFFBQUksS0FBSyxHQUFHLGtDQUFrQztBQUM5QztBQUFBLEVBQ0Y7QUFFQSxRQUFNLEVBQUUsV0FBVyxPQUFPO0FBQzFCLE1BQUksQ0FBQyxRQUFRO0FBQ1gsUUFBSSxNQUFNLEdBQUcsNkJBQTZCO0FBQzFDO0FBQUEsRUFDRjtBQUVBLFFBQU0sRUFBRSxjQUFjLGVBQWU7QUFDckMsTUFBSSxLQUNGLEdBQUcsbUNBQW1DLHdCQUF3QixZQUNoRTtBQUVBLFFBQU0sMkJBQTJCLE9BQU8sc0JBQXNCO0FBQzlELFFBQU0seUJBQXlCLCtDQUM3Qix3QkFDRjtBQUVBLFFBQU0sRUFBRSxLQUFLLGFBQWEsbUJBQW1CLE1BQU0sT0FBTyxvQkFDeEQsRUFBRSxjQUFjLFdBQVcsQ0FDN0I7QUFDQSxrQ0FBYSxLQUFLLG1EQUFtRDtBQUVyRSxRQUFNLFdBQVcsT0FBTyxRQUFRLEtBQUssUUFBUSxxQkFBUyxHQUFHO0FBQ3pELE1BQUksUUFBUSxVQUFVLFNBQVMsR0FBRztBQUNoQyxRQUFJLE1BQU0sR0FBRyxvQkFBb0IsbUNBQW1DLEtBQUs7QUFBQSxFQUMzRTtBQUVBLFFBQU0saUJBQWlCLGdCQUFnQixjQUFjLEVBQUUsSUFDckQsQ0FBQyxTQUE4QjtBQUM3QixVQUFNLGlCQUNKLHVCQUF1Qiw2QkFDckIsS0FDQSxLQUNBLEtBQUssZ0JBQ0wsSUFBSSw2Q0FDRixPQUFPLEtBQUssS0FBSyxZQUFZLFFBQVEsQ0FDdkMsQ0FDRjtBQUNGLFVBQU0sYUFBYSxlQUFlLFVBQVUsRUFBRSxTQUFTLFFBQVE7QUFFL0QsV0FBTztBQUFBLE1BQ0wsZ0JBQWdCLEtBQUssaUJBQWlCLFVBQVU7QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQ0Y7QUFFQSxRQUFNLFFBQVEsa0NBQVksS0FBSyxJQUFJLENBQUM7QUFDcEMsUUFBTSxrQkFBa0IsV0FDcEIsU0FBUyxPQUNQLENBQUMsU0FBOEIsS0FBSyxrQkFBa0IsS0FDeEQsSUFDQSxDQUFDO0FBQ0wsUUFBTSxtQkFBbUIsQ0FBQyxHQUFHLGlCQUFpQixHQUFHLGNBQWM7QUFFL0QsTUFBSSxLQUFLLEdBQUcsa0NBQWtDO0FBRTlDLFNBQU8sUUFBUSxJQUFJLG9CQUFvQixnQkFBZ0I7QUFDdkQsTUFBSSxLQUFLLEdBQUcsdUJBQXVCO0FBQ3JDO0FBM0VzQixBQTZFZiw0QkFDTCxNQUM4QjtBQUM5QixRQUFNLFFBQVEsa0NBQVksS0FBSyxJQUFJLENBQUM7QUFDcEMsUUFBTSxhQUFhLFFBQVEsSUFBSSxVQUFVO0FBRXpDLFFBQU0saUJBQWlCLHdCQUFLLElBQUk7QUFDaEMsTUFBSSxDQUFDLGtCQUFrQixlQUFlLGlCQUFpQixPQUFPO0FBQzVELFdBQU87QUFBQSxNQUNMLGNBQWM7QUFBQSxNQUNkLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUVBLE1BQUksZUFBZSxrQkFBa0IsWUFBWTtBQUMvQyxXQUFPO0FBQUEsRUFDVDtBQUVBLFNBQU87QUFBQSxJQUNMLGNBQWMsZUFBZSxpQkFBaUIsVUFBVTtBQUFBLElBQ3hELFlBQVk7QUFBQSxFQUNkO0FBQ0Y7QUF0QmdCLEFBd0JULHlCQUNMLE1BQ3FCO0FBQ3JCLFNBQU8sMEJBQU8sTUFBTSxDQUFDLFNBQThCLEtBQUssY0FBYztBQUN4RTtBQUpnQiIsCiAgIm5hbWVzIjogW10KfQo=
