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
var bootstrap_exports = {};
__export(bootstrap_exports, {
  App: () => import_playwright.App,
  Bootstrap: () => Bootstrap
});
module.exports = __toCommonJS(bootstrap_exports);
var import_assert = __toESM(require("assert"));
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var import_os = __toESM(require("os"));
var import_debug = __toESM(require("debug"));
var import_mock_server = require("@signalapp/mock-server");
var import_storageConstants = require("../services/storageConstants");
var durations = __toESM(require("../util/durations"));
var import_playwright = require("./playwright");
const debug = (0, import_debug.default)("mock:bootstrap");
const ELECTRON = import_path.default.join(__dirname, "..", "..", "node_modules", ".bin", "electron");
const CI_SCRIPT = import_path.default.join(__dirname, "..", "..", "ci.js");
const CLOSE_TIMEOUT = 10 * 1e3;
const CONTACT_FIRST_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Paul",
  "Steve",
  "William"
];
const CONTACT_LAST_NAMES = [
  "Smith",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Lopez",
  "Gonazales"
];
const CONTACT_NAMES = new Array();
for (const firstName of CONTACT_FIRST_NAMES) {
  for (const lastName of CONTACT_LAST_NAMES) {
    CONTACT_NAMES.push(`${firstName} ${lastName}`);
  }
}
const MAX_CONTACTS = CONTACT_NAMES.length;
class Bootstrap {
  constructor(options = {}) {
    this.timestamp = Date.now() - durations.MONTH;
    this.server = new import_mock_server.Server({
      maxStorageReadKeys: import_storageConstants.MAX_READ_KEYS
    });
    this.options = {
      linkedDevices: 5,
      contactCount: MAX_CONTACTS,
      contactNames: CONTACT_NAMES,
      benchmark: false,
      ...options
    };
    (0, import_assert.default)(this.options.contactCount <= this.options.contactNames.length);
  }
  async init() {
    debug("initializing");
    await this.server.listen(0);
    const { port } = this.server.address();
    debug("started server on port=%d", port);
    const contactNames = this.options.contactNames.slice(0, this.options.contactCount);
    this.privContacts = await Promise.all(contactNames.map(async (profileName) => {
      const primary = await this.server.createPrimaryDevice({
        profileName
      });
      for (let i = 0; i < this.options.linkedDevices; i += 1) {
        await this.server.createSecondaryDevice(primary);
      }
      return primary;
    }));
    this.privPhone = await this.server.createPrimaryDevice({
      profileName: "Myself",
      contacts: this.contacts
    });
    this.storagePath = await import_promises.default.mkdtemp(import_path.default.join(import_os.default.tmpdir(), "mock-signal-"));
    debug("setting storage path=%j", this.storagePath);
  }
  get logsDir() {
    (0, import_assert.default)(this.storagePath !== void 0, "Bootstrap has to be initialized first, see: bootstrap.init()");
    return import_path.default.join(this.storagePath, "logs");
  }
  async teardown() {
    debug("tearing down");
    await Promise.race([
      this.storagePath ? import_promises.default.rm(this.storagePath, { recursive: true }) : Promise.resolve(),
      this.server.close(),
      new Promise((resolve) => setTimeout(resolve, CLOSE_TIMEOUT).unref())
    ]);
  }
  async link() {
    debug("linking");
    const app = await this.startApp();
    const provision = await this.server.waitForProvision();
    const provisionURL = await app.waitForProvisionURL();
    this.privDesktop = await provision.complete({
      provisionURL,
      primaryDevice: this.phone
    });
    debug("new desktop device %j", this.desktop.debugId);
    const desktopKey = await this.desktop.popSingleUseKey();
    await this.phone.addSingleUseKey(this.desktop, desktopKey);
    for (const contact of this.contacts) {
      for (const uuidKind of [import_mock_server.UUIDKind.ACI, import_mock_server.UUIDKind.PNI]) {
        const contactKey = await this.desktop.popSingleUseKey(uuidKind);
        await contact.addSingleUseKey(this.desktop, contactKey, uuidKind);
      }
    }
    await this.phone.waitForSync(this.desktop);
    this.phone.resetSyncState(this.desktop);
    debug("synced with %j", this.desktop.debugId);
    return app;
  }
  async linkAndClose() {
    const app = await this.link();
    debug("closing the app after link");
    await app.close();
  }
  async startApp() {
    (0, import_assert.default)(this.storagePath !== void 0, "Bootstrap has to be initialized first, see: bootstrap.init()");
    debug("starting the app");
    const { port } = this.server.address();
    const app = new import_playwright.App({
      main: ELECTRON,
      args: [CI_SCRIPT],
      config: await this.generateConfig(port)
    });
    await app.start();
    return app;
  }
  getTimestamp() {
    const result = this.timestamp;
    this.timestamp += 1;
    return result;
  }
  async saveLogs() {
    const { ARTIFACTS_DIR } = process.env;
    if (!ARTIFACTS_DIR) {
      console.error("Not saving logs. Please set ARTIFACTS_DIR env variable");
      return;
    }
    await import_promises.default.mkdir(ARTIFACTS_DIR, { recursive: true });
    const outDir = await import_promises.default.mkdtemp(import_path.default.join(ARTIFACTS_DIR, "logs-"));
    console.error(`Saving logs to ${outDir}`);
    const { logsDir } = this;
    await import_promises.default.rename(logsDir, import_path.default.join(outDir));
  }
  get phone() {
    (0, import_assert.default)(this.privPhone, "Bootstrap has to be initialized first, see: bootstrap.init()");
    return this.privPhone;
  }
  get desktop() {
    (0, import_assert.default)(this.privDesktop, "Bootstrap has to be linked first, see: bootstrap.link()");
    return this.privDesktop;
  }
  get contacts() {
    (0, import_assert.default)(this.privContacts, "Bootstrap has to be initialized first, see: bootstrap.init()");
    return this.privContacts;
  }
  async generateConfig(port) {
    const url = `https://127.0.0.1:${port}`;
    return JSON.stringify({
      ...await (0, import_mock_server.loadCertificates)(),
      forcePreloadBundle: this.options.benchmark,
      enableCI: true,
      buildExpiration: Date.now() + durations.MONTH,
      storagePath: this.storagePath,
      storageProfile: "mock",
      serverUrl: url,
      storageUrl: url,
      cdn: {
        "0": url,
        "2": url
      },
      updatesEnabled: false,
      directoryVersion: 3,
      directoryV3Url: url,
      directoryV3MRENCLAVE: "51133fecb3fa18aaf0c8f64cb763656d3272d9faaacdb26ae7df082e414fb142",
      ...this.options.extraConfig
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App,
  Bootstrap
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYm9vdHN0cmFwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMiBTaWduYWwgTWVzc2VuZ2VyLCBMTENcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vbmx5XG5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuXG5pbXBvcnQgdHlwZSB7IERldmljZSwgUHJpbWFyeURldmljZSB9IGZyb20gJ0BzaWduYWxhcHAvbW9jay1zZXJ2ZXInO1xuaW1wb3J0IHsgU2VydmVyLCBVVUlES2luZCwgbG9hZENlcnRpZmljYXRlcyB9IGZyb20gJ0BzaWduYWxhcHAvbW9jay1zZXJ2ZXInO1xuaW1wb3J0IHsgTUFYX1JFQURfS0VZUyBhcyBNQVhfU1RPUkFHRV9SRUFEX0tFWVMgfSBmcm9tICcuLi9zZXJ2aWNlcy9zdG9yYWdlQ29uc3RhbnRzJztcbmltcG9ydCAqIGFzIGR1cmF0aW9ucyBmcm9tICcuLi91dGlsL2R1cmF0aW9ucyc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL3BsYXl3cmlnaHQnO1xuXG5leHBvcnQgeyBBcHAgfTtcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbW9jazpib290c3RyYXAnKTtcblxuY29uc3QgRUxFQ1RST04gPSBwYXRoLmpvaW4oXG4gIF9fZGlybmFtZSxcbiAgJy4uJyxcbiAgJy4uJyxcbiAgJ25vZGVfbW9kdWxlcycsXG4gICcuYmluJyxcbiAgJ2VsZWN0cm9uJ1xuKTtcbmNvbnN0IENJX1NDUklQVCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICdjaS5qcycpO1xuXG5jb25zdCBDTE9TRV9USU1FT1VUID0gMTAgKiAxMDAwO1xuXG5jb25zdCBDT05UQUNUX0ZJUlNUX05BTUVTID0gW1xuICAnQWxpY2UnLFxuICAnQm9iJyxcbiAgJ0NoYXJsaWUnLFxuICAnUGF1bCcsXG4gICdTdGV2ZScsXG4gICdXaWxsaWFtJyxcbl07XG5jb25zdCBDT05UQUNUX0xBU1RfTkFNRVMgPSBbXG4gICdTbWl0aCcsXG4gICdCcm93bicsXG4gICdKb25lcycsXG4gICdNaWxsZXInLFxuICAnRGF2aXMnLFxuICAnTG9wZXonLFxuICAnR29uYXphbGVzJyxcbl07XG5cbmNvbnN0IENPTlRBQ1RfTkFNRVMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuZm9yIChjb25zdCBmaXJzdE5hbWUgb2YgQ09OVEFDVF9GSVJTVF9OQU1FUykge1xuICBmb3IgKGNvbnN0IGxhc3ROYW1lIG9mIENPTlRBQ1RfTEFTVF9OQU1FUykge1xuICAgIENPTlRBQ1RfTkFNRVMucHVzaChgJHtmaXJzdE5hbWV9ICR7bGFzdE5hbWV9YCk7XG4gIH1cbn1cblxuY29uc3QgTUFYX0NPTlRBQ1RTID0gQ09OVEFDVF9OQU1FUy5sZW5ndGg7XG5cbmV4cG9ydCB0eXBlIEJvb3RzdHJhcE9wdGlvbnMgPSBSZWFkb25seTx7XG4gIGV4dHJhQ29uZmlnPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGJlbmNobWFyaz86IGJvb2xlYW47XG5cbiAgbGlua2VkRGV2aWNlcz86IG51bWJlcjtcbiAgY29udGFjdENvdW50PzogbnVtYmVyO1xuICBjb250YWN0TmFtZXM/OiBSZWFkb25seUFycmF5PHN0cmluZz47XG4gIGNvbnRhY3RQcmVLZXlDb3VudD86IG51bWJlcjtcbn0+O1xuXG50eXBlIEJvb3RzdHJhcEludGVybmFsT3B0aW9ucyA9IFBpY2s8Qm9vdHN0cmFwT3B0aW9ucywgJ2V4dHJhQ29uZmlnJz4gJlxuICBSZWFkb25seTx7XG4gICAgYmVuY2htYXJrOiBib29sZWFuO1xuICAgIGxpbmtlZERldmljZXM6IG51bWJlcjtcbiAgICBjb250YWN0Q291bnQ6IG51bWJlcjtcbiAgICBjb250YWN0TmFtZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgfT47XG5cbi8vXG4vLyBCb290c3RyYXAgaXMgYSBjbGFzcyB0aGF0IHByZXBhcmVzIG1vY2sgc2VydmVyIGFuZCBkZXNrdG9wIGZvciBydW5uaW5nXG4vLyB0ZXN0cy9iZW5jaG1hcmtzLlxuLy9cbi8vIEluIGdlbmVyYWwsIHRoZSB1c2FnZSBwYXR0ZXJuIGlzOlxuLy9cbi8vICAgY29uc3QgYm9vdHN0cmFwID0gbmV3IEJvb3RzdHJhcCgpO1xuLy8gICBhd2FpdCBib290c3RyYXAuaW5pdCgpO1xuLy8gICBjb25zdCBhcHAgPSBhd2FpdCBib290c3RyYXAubGluaygpO1xuLy8gICBhd2FpdCBib290c3RyYXAudGVhcmRvd24oKTtcbi8vXG4vLyBPbmNlIGluaXRpYWxpemVkIGBib290c3RyYXBgIHZhcmlhYmxlIHdpbGwgaGF2ZSBmb2xsb3dpbmcgdXNlZnVsIHByb3BlcnRpZXM6XG4vL1xuLy8gLSBgc2VydmVyYCAtIGEgbW9jayBzZXJ2ZXIgaW5zdGFuY2Vcbi8vIC0gYGRlc2t0b3BgIC0gYSBsaW5rZWQgZGV2aWNlIHJlcHJlc2VudGluZyBjdXJyZW50bHkgcnVubmluZyBkZXNrdG9wIGluc3RhbmNlXG4vLyAtIGBwaG9uZWAgLSBhIHByaW1hcnkgZGV2aWNlIHJlcHJlc2VudGluZyBkZXNrdG9wJ3MgcHJpbWFyeVxuLy8gLSBgY29udGFjdHNgIC0gYSBsaXN0IG9mIHByaW1hcnkgZGV2aWNlcyBmb3IgY29udGFjdHMgdGhhdCBhcmUgc3luY2VkIG92ZXJcbi8vICAgdGhyb3VnaCBjb250YWN0IHN5bmNcbi8vXG4vLyBgYm9vdHN0cmFwLmdldFRpbWVzdGFtcCgpYCBjb3VsZCBiZSB1c2VkIHRvIGdlbmVyYXRlIGNvbnNlY3V0aXZlIHRpbWVzdGFtcFxuLy8gZm9yIHNlbmRpbmcgbWVzc2FnZXMuXG4vL1xuLy8gQWxsIHBob25lIG51bWJlcnMgYW5kIHV1aWRzIGZvciBhbGwgY29udGFjdHMgYW5kIG91cnNlbHZlcyBhcmUgcmFuZG9tIGFuZCBub3Rcbi8vIHRoZSBzYW1lIGJldHdlZW4gZGlmZmVyZW50IHRlc3QgcnVucy5cbi8vXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwIHtcbiAgcHVibGljIHJlYWRvbmx5IHNlcnZlcjogU2VydmVyO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogQm9vdHN0cmFwSW50ZXJuYWxPcHRpb25zO1xuICBwcml2YXRlIHByaXZDb250YWN0cz86IFJlYWRvbmx5QXJyYXk8UHJpbWFyeURldmljZT47XG4gIHByaXZhdGUgcHJpdlBob25lPzogUHJpbWFyeURldmljZTtcbiAgcHJpdmF0ZSBwcml2RGVza3RvcD86IERldmljZTtcbiAgcHJpdmF0ZSBzdG9yYWdlUGF0aD86IHN0cmluZztcbiAgcHJpdmF0ZSB0aW1lc3RhbXA6IG51bWJlciA9IERhdGUubm93KCkgLSBkdXJhdGlvbnMuTU9OVEg7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQm9vdHN0cmFwT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgU2VydmVyKHtcbiAgICAgIC8vIExpbWl0IG51bWJlciBvZiBzdG9yYWdlIHJlYWQga2V5cyBmb3IgZWFzaWVyIHRlc3RpbmdcbiAgICAgIG1heFN0b3JhZ2VSZWFkS2V5czogTUFYX1NUT1JBR0VfUkVBRF9LRVlTLFxuICAgIH0pO1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbGlua2VkRGV2aWNlczogNSxcbiAgICAgIGNvbnRhY3RDb3VudDogTUFYX0NPTlRBQ1RTLFxuICAgICAgY29udGFjdE5hbWVzOiBDT05UQUNUX05BTUVTLFxuICAgICAgYmVuY2htYXJrOiBmYWxzZSxcblxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgYXNzZXJ0KHRoaXMub3B0aW9ucy5jb250YWN0Q291bnQgPD0gdGhpcy5vcHRpb25zLmNvbnRhY3ROYW1lcy5sZW5ndGgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgZGVidWcoJ2luaXRpYWxpemluZycpO1xuXG4gICAgYXdhaXQgdGhpcy5zZXJ2ZXIubGlzdGVuKDApO1xuXG4gICAgY29uc3QgeyBwb3J0IH0gPSB0aGlzLnNlcnZlci5hZGRyZXNzKCk7XG4gICAgZGVidWcoJ3N0YXJ0ZWQgc2VydmVyIG9uIHBvcnQ9JWQnLCBwb3J0KTtcblxuICAgIGNvbnN0IGNvbnRhY3ROYW1lcyA9IHRoaXMub3B0aW9ucy5jb250YWN0TmFtZXMuc2xpY2UoXG4gICAgICAwLFxuICAgICAgdGhpcy5vcHRpb25zLmNvbnRhY3RDb3VudFxuICAgICk7XG5cbiAgICB0aGlzLnByaXZDb250YWN0cyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgY29udGFjdE5hbWVzLm1hcChhc3luYyBwcm9maWxlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IHByaW1hcnkgPSBhd2FpdCB0aGlzLnNlcnZlci5jcmVhdGVQcmltYXJ5RGV2aWNlKHtcbiAgICAgICAgICBwcm9maWxlTmFtZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubGlua2VkRGV2aWNlczsgaSArPSAxKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlci5jcmVhdGVTZWNvbmRhcnlEZXZpY2UocHJpbWFyeSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJpbWFyeTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMucHJpdlBob25lID0gYXdhaXQgdGhpcy5zZXJ2ZXIuY3JlYXRlUHJpbWFyeURldmljZSh7XG4gICAgICBwcm9maWxlTmFtZTogJ015c2VsZicsXG4gICAgICBjb250YWN0czogdGhpcy5jb250YWN0cyxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RvcmFnZVBhdGggPSBhd2FpdCBmcy5ta2R0ZW1wKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ21vY2stc2lnbmFsLScpKTtcblxuICAgIGRlYnVnKCdzZXR0aW5nIHN0b3JhZ2UgcGF0aD0laicsIHRoaXMuc3RvcmFnZVBhdGgpO1xuICB9XG5cbiAgcHVibGljIGdldCBsb2dzRGlyKCk6IHN0cmluZyB7XG4gICAgYXNzZXJ0KFxuICAgICAgdGhpcy5zdG9yYWdlUGF0aCAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ0Jvb3RzdHJhcCBoYXMgdG8gYmUgaW5pdGlhbGl6ZWQgZmlyc3QsIHNlZTogYm9vdHN0cmFwLmluaXQoKSdcbiAgICApO1xuXG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLnN0b3JhZ2VQYXRoLCAnbG9ncycpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHRlYXJkb3duKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGRlYnVnKCd0ZWFyaW5nIGRvd24nKTtcblxuICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICB0aGlzLnN0b3JhZ2VQYXRoXG4gICAgICAgID8gZnMucm0odGhpcy5zdG9yYWdlUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgIHRoaXMuc2VydmVyLmNsb3NlKCksXG4gICAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgQ0xPU0VfVElNRU9VVCkudW5yZWYoKSksXG4gICAgXSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbGluaygpOiBQcm9taXNlPEFwcD4ge1xuICAgIGRlYnVnKCdsaW5raW5nJyk7XG5cbiAgICBjb25zdCBhcHAgPSBhd2FpdCB0aGlzLnN0YXJ0QXBwKCk7XG5cbiAgICBjb25zdCBwcm92aXNpb24gPSBhd2FpdCB0aGlzLnNlcnZlci53YWl0Rm9yUHJvdmlzaW9uKCk7XG5cbiAgICBjb25zdCBwcm92aXNpb25VUkwgPSBhd2FpdCBhcHAud2FpdEZvclByb3Zpc2lvblVSTCgpO1xuXG4gICAgdGhpcy5wcml2RGVza3RvcCA9IGF3YWl0IHByb3Zpc2lvbi5jb21wbGV0ZSh7XG4gICAgICBwcm92aXNpb25VUkwsXG4gICAgICBwcmltYXJ5RGV2aWNlOiB0aGlzLnBob25lLFxuICAgIH0pO1xuXG4gICAgZGVidWcoJ25ldyBkZXNrdG9wIGRldmljZSAlaicsIHRoaXMuZGVza3RvcC5kZWJ1Z0lkKTtcblxuICAgIGNvbnN0IGRlc2t0b3BLZXkgPSBhd2FpdCB0aGlzLmRlc2t0b3AucG9wU2luZ2xlVXNlS2V5KCk7XG4gICAgYXdhaXQgdGhpcy5waG9uZS5hZGRTaW5nbGVVc2VLZXkodGhpcy5kZXNrdG9wLCBkZXNrdG9wS2V5KTtcblxuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiB0aGlzLmNvbnRhY3RzKSB7XG4gICAgICBmb3IgKGNvbnN0IHV1aWRLaW5kIG9mIFtVVUlES2luZC5BQ0ksIFVVSURLaW5kLlBOSV0pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgY29uc3QgY29udGFjdEtleSA9IGF3YWl0IHRoaXMuZGVza3RvcC5wb3BTaW5nbGVVc2VLZXkodXVpZEtpbmQpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBhd2FpdCBjb250YWN0LmFkZFNpbmdsZVVzZUtleSh0aGlzLmRlc2t0b3AsIGNvbnRhY3RLZXksIHV1aWRLaW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnBob25lLndhaXRGb3JTeW5jKHRoaXMuZGVza3RvcCk7XG4gICAgdGhpcy5waG9uZS5yZXNldFN5bmNTdGF0ZSh0aGlzLmRlc2t0b3ApO1xuXG4gICAgZGVidWcoJ3N5bmNlZCB3aXRoICVqJywgdGhpcy5kZXNrdG9wLmRlYnVnSWQpO1xuXG4gICAgcmV0dXJuIGFwcDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBsaW5rQW5kQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYXBwID0gYXdhaXQgdGhpcy5saW5rKCk7XG5cbiAgICBkZWJ1ZygnY2xvc2luZyB0aGUgYXBwIGFmdGVyIGxpbmsnKTtcbiAgICBhd2FpdCBhcHAuY2xvc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydEFwcCgpOiBQcm9taXNlPEFwcD4ge1xuICAgIGFzc2VydChcbiAgICAgIHRoaXMuc3RvcmFnZVBhdGggIT09IHVuZGVmaW5lZCxcbiAgICAgICdCb290c3RyYXAgaGFzIHRvIGJlIGluaXRpYWxpemVkIGZpcnN0LCBzZWU6IGJvb3RzdHJhcC5pbml0KCknXG4gICAgKTtcblxuICAgIGRlYnVnKCdzdGFydGluZyB0aGUgYXBwJyk7XG5cbiAgICBjb25zdCB7IHBvcnQgfSA9IHRoaXMuc2VydmVyLmFkZHJlc3MoKTtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgbWFpbjogRUxFQ1RST04sXG4gICAgICBhcmdzOiBbQ0lfU0NSSVBUXSxcbiAgICAgIGNvbmZpZzogYXdhaXQgdGhpcy5nZW5lcmF0ZUNvbmZpZyhwb3J0KSxcbiAgICB9KTtcblxuICAgIGF3YWl0IGFwcC5zdGFydCgpO1xuXG4gICAgcmV0dXJuIGFwcDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRUaW1lc3RhbXAoKTogbnVtYmVyIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRpbWVzdGFtcDtcbiAgICB0aGlzLnRpbWVzdGFtcCArPSAxO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2F2ZUxvZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBBUlRJRkFDVFNfRElSIH0gPSBwcm9jZXNzLmVudjtcbiAgICBpZiAoIUFSVElGQUNUU19ESVIpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKCdOb3Qgc2F2aW5nIGxvZ3MuIFBsZWFzZSBzZXQgQVJUSUZBQ1RTX0RJUiBlbnYgdmFyaWFibGUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBmcy5ta2RpcihBUlRJRkFDVFNfRElSLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IG91dERpciA9IGF3YWl0IGZzLm1rZHRlbXAocGF0aC5qb2luKEFSVElGQUNUU19ESVIsICdsb2dzLScpKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihgU2F2aW5nIGxvZ3MgdG8gJHtvdXREaXJ9YCk7XG5cbiAgICBjb25zdCB7IGxvZ3NEaXIgfSA9IHRoaXM7XG4gICAgYXdhaXQgZnMucmVuYW1lKGxvZ3NEaXIsIHBhdGguam9pbihvdXREaXIpKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEdldHRlcnNcbiAgLy9cblxuICBwdWJsaWMgZ2V0IHBob25lKCk6IFByaW1hcnlEZXZpY2Uge1xuICAgIGFzc2VydChcbiAgICAgIHRoaXMucHJpdlBob25lLFxuICAgICAgJ0Jvb3RzdHJhcCBoYXMgdG8gYmUgaW5pdGlhbGl6ZWQgZmlyc3QsIHNlZTogYm9vdHN0cmFwLmluaXQoKSdcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnByaXZQaG9uZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZGVza3RvcCgpOiBEZXZpY2Uge1xuICAgIGFzc2VydChcbiAgICAgIHRoaXMucHJpdkRlc2t0b3AsXG4gICAgICAnQm9vdHN0cmFwIGhhcyB0byBiZSBsaW5rZWQgZmlyc3QsIHNlZTogYm9vdHN0cmFwLmxpbmsoKSdcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnByaXZEZXNrdG9wO1xuICB9XG5cbiAgcHVibGljIGdldCBjb250YWN0cygpOiBSZWFkb25seUFycmF5PFByaW1hcnlEZXZpY2U+IHtcbiAgICBhc3NlcnQoXG4gICAgICB0aGlzLnByaXZDb250YWN0cyxcbiAgICAgICdCb290c3RyYXAgaGFzIHRvIGJlIGluaXRpYWxpemVkIGZpcnN0LCBzZWU6IGJvb3RzdHJhcC5pbml0KCknXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5wcml2Q29udGFjdHM7XG4gIH1cblxuICAvL1xuICAvLyBQcml2YXRlXG4gIC8vXG5cbiAgcHJpdmF0ZSBhc3luYyBnZW5lcmF0ZUNvbmZpZyhwb3J0OiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHVybCA9IGBodHRwczovLzEyNy4wLjAuMToke3BvcnR9YDtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgLi4uKGF3YWl0IGxvYWRDZXJ0aWZpY2F0ZXMoKSksXG5cbiAgICAgIGZvcmNlUHJlbG9hZEJ1bmRsZTogdGhpcy5vcHRpb25zLmJlbmNobWFyayxcbiAgICAgIGVuYWJsZUNJOiB0cnVlLFxuXG4gICAgICBidWlsZEV4cGlyYXRpb246IERhdGUubm93KCkgKyBkdXJhdGlvbnMuTU9OVEgsXG4gICAgICBzdG9yYWdlUGF0aDogdGhpcy5zdG9yYWdlUGF0aCxcbiAgICAgIHN0b3JhZ2VQcm9maWxlOiAnbW9jaycsXG4gICAgICBzZXJ2ZXJVcmw6IHVybCxcbiAgICAgIHN0b3JhZ2VVcmw6IHVybCxcbiAgICAgIGNkbjoge1xuICAgICAgICAnMCc6IHVybCxcbiAgICAgICAgJzInOiB1cmwsXG4gICAgICB9LFxuICAgICAgdXBkYXRlc0VuYWJsZWQ6IGZhbHNlLFxuXG4gICAgICBkaXJlY3RvcnlWZXJzaW9uOiAzLFxuICAgICAgZGlyZWN0b3J5VjNVcmw6IHVybCxcbiAgICAgIGRpcmVjdG9yeVYzTVJFTkNMQVZFOlxuICAgICAgICAnNTExMzNmZWNiM2ZhMThhYWYwYzhmNjRjYjc2MzY1NmQzMjcyZDlmYWFhY2RiMjZhZTdkZjA4MmU0MTRmYjE0MicsXG5cbiAgICAgIC4uLnRoaXMub3B0aW9ucy5leHRyYUNvbmZpZyxcbiAgICB9KTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0Esb0JB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QUFBQSxNQUNOLE1BQU0sQ0FBQyxTQUFTO0FBQUEsTUFDaEIsUUFBUSxNQUFNLEtBQUssZUFBZSxJQUFJO0FBQUEsSUFDeEMsQ0FBQztBQUVELFVBQU0sSUFBSSxNQUFNO0FBRWhCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFTyxlQUF1QjtBQUM1QixVQUFNLFNBQVMsS0FBSztBQUNwQixTQUFLLGFBQWE7QUFDbEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxRQUVhLFdBQTBCO0FBQ3JDLFVBQU0sRUFBRSxrQkFBa0IsUUFBUTtBQUNsQyxRQUFJLENBQUMsZUFBZTtBQUVsQixjQUFRLE1BQU0sd0RBQXdEO0FBQ3RFO0FBQUEsSUFDRjtBQUVBLFVBQU0sd0JBQUcsTUFBTSxlQUFlLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFFakQsVUFBTSxTQUFTLE1BQU0sd0JBQUcsUUFBUSxvQkFBSyxLQUFLLGVBQWUsT0FBTyxDQUFDO0FBR2pFLFlBQVEsTUFBTSxrQkFBa0IsUUFBUTtBQUV4QyxVQUFNLEVBQUUsWUFBWTtBQUNwQixVQUFNLHdCQUFHLE9BQU8sU0FBUyxvQkFBSyxLQUFLLE1BQU0sQ0FBQztBQUFBLEVBQzVDO0FBQUEsTUFNVyxRQUF1QjtBQUNoQywrQkFDRSxLQUFLLFdBQ0wsOERBQ0Y7QUFDQSxXQUFPLEtBQUs7QUFBQSxFQUNkO0FBQUEsTUFFVyxVQUFrQjtBQUMzQiwrQkFDRSxLQUFLLGFBQ0wseURBQ0Y7QUFDQSxXQUFPLEtBQUs7QUFBQSxFQUNkO0FBQUEsTUFFVyxXQUF5QztBQUNsRCwrQkFDRSxLQUFLLGNBQ0wsOERBQ0Y7QUFDQSxXQUFPLEtBQUs7QUFBQSxFQUNkO0FBQUEsUUFNYyxlQUFlLE1BQStCO0FBQzFELFVBQU0sTUFBTSxxQkFBcUI7QUFDakMsV0FBTyxLQUFLLFVBQVU7QUFBQSxTQUNoQixNQUFNLHlDQUFpQjtBQUFBLE1BRTNCLG9CQUFvQixLQUFLLFFBQVE7QUFBQSxNQUNqQyxVQUFVO0FBQUEsTUFFVixpQkFBaUIsS0FBSyxJQUFJLElBQUksVUFBVTtBQUFBLE1BQ3hDLGFBQWEsS0FBSztBQUFBLE1BQ2xCLGdCQUFnQjtBQUFBLE1BQ2hCLFdBQVc7QUFBQSxNQUNYLFlBQVk7QUFBQSxNQUNaLEtBQUs7QUFBQSxRQUNILEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNQO0FBQUEsTUFDQSxnQkFBZ0I7QUFBQSxNQUVoQixrQkFBa0I7QUFBQSxNQUNsQixnQkFBZ0I7QUFBQSxNQUNoQixzQkFDRTtBQUFBLFNBRUMsS0FBSyxRQUFRO0FBQUEsSUFDbEIsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQTNPTyIsCiAgIm5hbWVzIjogW10KfQo=
