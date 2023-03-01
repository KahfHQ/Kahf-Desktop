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
var OutgoingMessage_exports = {};
__export(OutgoingMessage_exports, {
  SenderCertificateMode: () => SenderCertificateMode,
  default: () => OutgoingMessage,
  padMessage: () => padMessage,
  serializedCertificateSchema: () => serializedCertificateSchema
});
module.exports = __toCommonJS(OutgoingMessage_exports);
var import_lodash = require("lodash");
var import_zod = require("zod");
var import_libsignal_client = require("@signalapp/libsignal-client");
var import_Errors = require("./Errors");
var import_PhoneNumber = require("../types/PhoneNumber");
var import_Address = require("../types/Address");
var import_QualifiedAddress = require("../types/QualifiedAddress");
var import_UUID = require("../types/UUID");
var import_LibSignalStores = require("../LibSignalStores");
var import_updateConversationsWithUuidLookup = require("../updateConversationsWithUuidLookup");
var import_getKeysForIdentifier = require("./getKeysForIdentifier");
var import_protobuf = require("../protobuf");
var log = __toESM(require("../logging/log"));
var SenderCertificateMode = /* @__PURE__ */ ((SenderCertificateMode2) => {
  SenderCertificateMode2[SenderCertificateMode2["WithE164"] = 0] = "WithE164";
  SenderCertificateMode2[SenderCertificateMode2["WithoutE164"] = 1] = "WithoutE164";
  return SenderCertificateMode2;
})(SenderCertificateMode || {});
const serializedCertificateSchema = import_zod.z.object({
  expires: import_zod.z.number().optional(),
  serialized: import_zod.z.instanceof(Uint8Array)
});
function ciphertextMessageTypeToEnvelopeType(type) {
  if (type === import_libsignal_client.CiphertextMessageType.PreKey) {
    return import_protobuf.SignalService.Envelope.Type.PREKEY_BUNDLE;
  }
  if (type === import_libsignal_client.CiphertextMessageType.Whisper) {
    return import_protobuf.SignalService.Envelope.Type.CIPHERTEXT;
  }
  if (type === import_libsignal_client.CiphertextMessageType.Plaintext) {
    return import_protobuf.SignalService.Envelope.Type.PLAINTEXT_CONTENT;
  }
  throw new Error(`ciphertextMessageTypeToEnvelopeType: Unrecognized type ${type}`);
}
function getPaddedMessageLength(messageLength) {
  const messageLengthWithTerminator = messageLength + 1;
  let messagePartCount = Math.floor(messageLengthWithTerminator / 160);
  if (messageLengthWithTerminator % 160 !== 0) {
    messagePartCount += 1;
  }
  return messagePartCount * 160;
}
function padMessage(messageBuffer) {
  const plaintext = new Uint8Array(getPaddedMessageLength(messageBuffer.byteLength + 1) - 1);
  plaintext.set(messageBuffer);
  plaintext[messageBuffer.byteLength] = 128;
  return plaintext;
}
class OutgoingMessage {
  constructor({
    callback,
    contentHint,
    groupId,
    identifiers,
    message,
    options,
    sendLogCallback,
    server,
    timestamp,
    urgent
  }) {
    if (message instanceof import_protobuf.SignalService.DataMessage) {
      const content = new import_protobuf.SignalService.Content();
      content.dataMessage = message;
      this.message = content;
    } else {
      this.message = message;
    }
    this.server = server;
    this.timestamp = timestamp;
    this.identifiers = identifiers;
    this.contentHint = contentHint;
    this.groupId = groupId;
    this.callback = callback;
    this.urgent = urgent;
    this.identifiersCompleted = 0;
    this.errors = [];
    this.successfulIdentifiers = [];
    this.failoverIdentifiers = [];
    this.unidentifiedDeliveries = [];
    this.recipients = {};
    this.sendLogCallback = sendLogCallback;
    this.sendMetadata = options?.sendMetadata;
    this.online = options?.online;
  }
  numberCompleted() {
    this.identifiersCompleted += 1;
    if (this.identifiersCompleted >= this.identifiers.length) {
      const proto = this.message;
      const contentProto = this.getContentProtoBytes();
      const { timestamp, contentHint, recipients, urgent } = this;
      let dataMessage;
      if (proto instanceof import_protobuf.SignalService.Content && proto.dataMessage) {
        dataMessage = import_protobuf.SignalService.DataMessage.encode(proto.dataMessage).finish();
      } else if (proto instanceof import_protobuf.SignalService.DataMessage) {
        dataMessage = import_protobuf.SignalService.DataMessage.encode(proto).finish();
      }
      this.callback({
        successfulIdentifiers: this.successfulIdentifiers,
        failoverIdentifiers: this.failoverIdentifiers,
        errors: this.errors,
        unidentifiedDeliveries: this.unidentifiedDeliveries,
        contentHint,
        dataMessage,
        recipients,
        contentProto,
        timestamp,
        urgent
      });
    }
  }
  registerError(identifier, reason, providedError) {
    let error = providedError;
    if (!error || error instanceof import_Errors.HTTPError && error.code !== 404) {
      if (error && error.code === 428) {
        error = new import_Errors.SendMessageChallengeError(identifier, error);
      } else {
        error = new import_Errors.OutgoingMessageError(identifier, null, null, error);
      }
    }
    error.reason = reason;
    error.stackForLog = providedError ? providedError.stack : void 0;
    this.errors[this.errors.length] = error;
    this.numberCompleted();
  }
  reloadDevicesAndSend(identifier, recurse) {
    return async () => {
      const ourUuid = window.textsecure.storage.user.getCheckedUuid();
      const deviceIds = await window.textsecure.storage.protocol.getDeviceIds({
        ourUuid,
        identifier
      });
      if (deviceIds.length === 0) {
        this.registerError(identifier, "reloadDevicesAndSend: Got empty device list when loading device keys", void 0);
        return void 0;
      }
      return this.doSendMessage(identifier, deviceIds, recurse);
    };
  }
  async getKeysForIdentifier(identifier, updateDevices) {
    const { sendMetadata } = this;
    const info = sendMetadata && sendMetadata[identifier] ? sendMetadata[identifier] : { accessKey: void 0 };
    const { accessKey } = info;
    try {
      const { accessKeyFailed } = await (0, import_getKeysForIdentifier.getKeysForIdentifier)(identifier, this.server, updateDevices, accessKey);
      if (accessKeyFailed && !this.failoverIdentifiers.includes(identifier)) {
        this.failoverIdentifiers.push(identifier);
      }
    } catch (error) {
      if (error?.message?.includes("untrusted identity for address")) {
        error.timestamp = this.timestamp;
      }
      throw error;
    }
  }
  async transmitMessage(identifier, jsonData, timestamp, { accessKey } = {}) {
    let promise;
    if (accessKey) {
      promise = this.server.sendMessagesUnauth(identifier, jsonData, timestamp, { accessKey, online: this.online, urgent: this.urgent });
    } else {
      promise = this.server.sendMessages(identifier, jsonData, timestamp, {
        online: this.online,
        urgent: this.urgent
      });
    }
    return promise.catch((e) => {
      if (e instanceof import_Errors.HTTPError && e.code !== 409 && e.code !== 410) {
        if (e.code === 404) {
          throw new import_Errors.UnregisteredUserError(identifier, e);
        }
        if (e.code === 428) {
          throw new import_Errors.SendMessageChallengeError(identifier, e);
        }
        throw new import_Errors.SendMessageNetworkError(identifier, jsonData, e);
      }
      throw e;
    });
  }
  getPlaintext() {
    if (!this.plaintext) {
      const { message } = this;
      if (message instanceof import_protobuf.SignalService.Content) {
        this.plaintext = padMessage(import_protobuf.SignalService.Content.encode(message).finish());
      } else {
        this.plaintext = message.serialize();
      }
    }
    return this.plaintext;
  }
  getContentProtoBytes() {
    if (this.message instanceof import_protobuf.SignalService.Content) {
      return new Uint8Array(import_protobuf.SignalService.Content.encode(this.message).finish());
    }
    return void 0;
  }
  async getCiphertextMessage({
    identityKeyStore,
    protocolAddress,
    sessionStore
  }) {
    const { message } = this;
    if (message instanceof import_protobuf.SignalService.Content) {
      return (0, import_libsignal_client.signalEncrypt)(Buffer.from(this.getPlaintext()), protocolAddress, sessionStore, identityKeyStore);
    }
    return message.asCiphertextMessage();
  }
  async doSendMessage(identifier, deviceIds, recurse) {
    const { sendMetadata } = this;
    const { accessKey, senderCertificate } = sendMetadata?.[identifier] || {};
    if (accessKey && !senderCertificate) {
      log.warn("OutgoingMessage.doSendMessage: accessKey was provided, but senderCertificate was not");
    }
    const sealedSender = Boolean(accessKey && senderCertificate);
    const ourNumber = window.textsecure.storage.user.getNumber();
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const ourDeviceId = window.textsecure.storage.user.getDeviceId();
    if ((identifier === ourNumber || identifier === ourUuid.toString()) && !sealedSender) {
      deviceIds = (0, import_lodash.reject)(deviceIds, (deviceId) => deviceId === ourDeviceId || typeof ourDeviceId === "string" && deviceId === parseInt(ourDeviceId, 10));
    }
    const sessionStore = new import_LibSignalStores.Sessions({ ourUuid });
    const identityKeyStore = new import_LibSignalStores.IdentityKeys({ ourUuid });
    return Promise.all(deviceIds.map(async (destinationDeviceId) => {
      const theirUuid = import_UUID.UUID.checkedLookup(identifier);
      const address = new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, destinationDeviceId));
      return window.textsecure.storage.protocol.enqueueSessionJob(address, async () => {
        const protocolAddress = import_libsignal_client.ProtocolAddress.new(theirUuid.toString(), destinationDeviceId);
        const activeSession = await sessionStore.getSession(protocolAddress);
        if (!activeSession) {
          throw new Error("OutgoingMessage.doSendMessage: No active session!");
        }
        const destinationRegistrationId = activeSession.remoteRegistrationId();
        if (sealedSender && senderCertificate) {
          const ciphertextMessage2 = await this.getCiphertextMessage({
            identityKeyStore,
            protocolAddress,
            sessionStore
          });
          const certificate = import_libsignal_client.SenderCertificate.deserialize(Buffer.from(senderCertificate.serialized));
          const groupIdBuffer = this.groupId ? Buffer.from(this.groupId, "base64") : null;
          const content2 = import_libsignal_client.UnidentifiedSenderMessageContent.new(ciphertextMessage2, certificate, this.contentHint, groupIdBuffer);
          const buffer = await (0, import_libsignal_client.sealedSenderEncrypt)(content2, protocolAddress, identityKeyStore);
          return {
            type: import_protobuf.SignalService.Envelope.Type.UNIDENTIFIED_SENDER,
            destinationDeviceId,
            destinationRegistrationId,
            content: buffer.toString("base64")
          };
        }
        const ciphertextMessage = await this.getCiphertextMessage({
          identityKeyStore,
          protocolAddress,
          sessionStore
        });
        const type = ciphertextMessageTypeToEnvelopeType(ciphertextMessage.type());
        const content = ciphertextMessage.serialize().toString("base64");
        return {
          type,
          destinationDeviceId,
          destinationRegistrationId,
          content
        };
      });
    })).then(async (jsonData) => {
      if (sealedSender) {
        return this.transmitMessage(identifier, jsonData, this.timestamp, {
          accessKey
        }).then(() => {
          this.recipients[identifier] = deviceIds;
          this.unidentifiedDeliveries.push(identifier);
          this.successfulIdentifiers.push(identifier);
          this.numberCompleted();
          if (this.sendLogCallback) {
            this.sendLogCallback({
              identifier,
              deviceIds
            });
          } else if (this.successfulIdentifiers.length > 1) {
            log.warn(`OutgoingMessage.doSendMessage: no sendLogCallback provided for message ${this.timestamp}, but multiple recipients`);
          }
        }, async (error) => {
          if (error instanceof import_Errors.HTTPError && (error.code === 401 || error.code === 403)) {
            if (this.failoverIdentifiers.indexOf(identifier) === -1) {
              this.failoverIdentifiers.push(identifier);
            }
            if (sendMetadata) {
              delete sendMetadata[identifier];
            }
            return this.doSendMessage(identifier, deviceIds, recurse);
          }
          throw error;
        });
      }
      return this.transmitMessage(identifier, jsonData, this.timestamp).then(() => {
        this.successfulIdentifiers.push(identifier);
        this.recipients[identifier] = deviceIds;
        this.numberCompleted();
        if (this.sendLogCallback) {
          this.sendLogCallback({
            identifier,
            deviceIds
          });
        } else if (this.successfulIdentifiers.length > 1) {
          log.warn(`OutgoingMessage.doSendMessage: no sendLogCallback provided for message ${this.timestamp}, but multiple recipients`);
        }
      });
    }).catch(async (error) => {
      if (error instanceof import_Errors.HTTPError && (error.code === 410 || error.code === 409)) {
        if (!recurse) {
          this.registerError(identifier, "Hit retry limit attempting to reload device list", error);
          return void 0;
        }
        const response = error.response;
        let p = Promise.resolve();
        if (error.code === 409) {
          p = this.removeDeviceIdsForIdentifier(identifier, response.extraDevices || []);
        } else {
          p = Promise.all((response.staleDevices || []).map(async (deviceId) => {
            await window.textsecure.storage.protocol.archiveSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(import_UUID.UUID.checkedLookup(identifier), deviceId)));
          }));
        }
        return p.then(async () => {
          const resetDevices = error.code === 410 ? response.staleDevices : response.missingDevices;
          return this.getKeysForIdentifier(identifier, resetDevices).then(this.reloadDevicesAndSend(identifier, error.code === 409));
        });
      }
      if (error?.message?.includes("untrusted identity for address")) {
        error.timestamp = this.timestamp;
        log.error('Got "key changed" error from encrypt - no identityKey for application layer', identifier, deviceIds);
        log.info("closing all sessions for", identifier);
        window.textsecure.storage.protocol.archiveAllSessions(import_UUID.UUID.checkedLookup(identifier)).then(() => {
          throw error;
        }, (innerError) => {
          log.error(`doSendMessage: Error closing sessions: ${innerError.stack}`);
          throw error;
        });
      }
      this.registerError(identifier, "Failed to create or send message", error);
      return void 0;
    });
  }
  async removeDeviceIdsForIdentifier(identifier, deviceIdsToRemove) {
    const ourUuid = window.textsecure.storage.user.getCheckedUuid();
    const theirUuid = import_UUID.UUID.checkedLookup(identifier);
    await Promise.all(deviceIdsToRemove.map(async (deviceId) => {
      await window.textsecure.storage.protocol.archiveSession(new import_QualifiedAddress.QualifiedAddress(ourUuid, new import_Address.Address(theirUuid, deviceId)));
    }));
  }
  async sendToIdentifier(providedIdentifier) {
    let identifier = providedIdentifier;
    try {
      if ((0, import_UUID.isValidUuid)(identifier)) {
      } else if ((0, import_PhoneNumber.isValidNumber)(identifier)) {
        if (!window.textsecure.messaging) {
          throw new Error("sendToIdentifier: window.textsecure.messaging is not available!");
        }
        try {
          await (0, import_updateConversationsWithUuidLookup.updateConversationsWithUuidLookup)({
            conversationController: window.ConversationController,
            conversations: [
              window.ConversationController.getOrCreate(identifier, "private")
            ],
            messaging: window.textsecure.messaging
          });
          const uuid = window.ConversationController.get(identifier)?.get("uuid");
          if (!uuid) {
            throw new import_Errors.UnregisteredUserError(identifier, new import_Errors.HTTPError("User is not registered", {
              code: -1,
              headers: {}
            }));
          }
          identifier = uuid;
        } catch (error) {
          log.error(`sendToIdentifier: Failed to fetch UUID for identifier ${identifier}`, error && error.stack ? error.stack : error);
        }
      } else {
        throw new Error(`sendToIdentifier: identifier ${identifier} was neither a UUID or E164`);
      }
      const ourUuid = window.textsecure.storage.user.getCheckedUuid();
      const deviceIds = await window.textsecure.storage.protocol.getDeviceIds({
        ourUuid,
        identifier
      });
      if (deviceIds.length === 0) {
        await this.getKeysForIdentifier(identifier);
      }
      await this.reloadDevicesAndSend(identifier, true)();
    } catch (error) {
      if (error?.message?.includes("untrusted identity for address")) {
        const newError = new import_Errors.OutgoingIdentityKeyError(identifier);
        this.registerError(identifier, "Untrusted identity", newError);
      } else {
        this.registerError(identifier, `Failed to retrieve new device keys for identifier ${identifier}`, error);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SenderCertificateMode,
  padMessage,
  serializedCertificateSchema
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiT3V0Z29pbmdNZXNzYWdlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuLyogZXNsaW50LWRpc2FibGUgbW9yZS9uby10aGVuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuXG5pbXBvcnQgeyByZWplY3QgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB0eXBlIHtcbiAgQ2lwaGVydGV4dE1lc3NhZ2UsXG4gIFBsYWludGV4dENvbnRlbnQsXG59IGZyb20gJ0BzaWduYWxhcHAvbGlic2lnbmFsLWNsaWVudCc7XG5pbXBvcnQge1xuICBDaXBoZXJ0ZXh0TWVzc2FnZVR5cGUsXG4gIFByb3RvY29sQWRkcmVzcyxcbiAgc2VhbGVkU2VuZGVyRW5jcnlwdCxcbiAgU2VuZGVyQ2VydGlmaWNhdGUsXG4gIHNpZ25hbEVuY3J5cHQsXG4gIFVuaWRlbnRpZmllZFNlbmRlck1lc3NhZ2VDb250ZW50LFxufSBmcm9tICdAc2lnbmFsYXBwL2xpYnNpZ25hbC1jbGllbnQnO1xuXG5pbXBvcnQgdHlwZSB7IFdlYkFQSVR5cGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi9XZWJBUEknO1xuaW1wb3J0IHR5cGUgeyBTZW5kTWV0YWRhdGFUeXBlLCBTZW5kT3B0aW9uc1R5cGUgfSBmcm9tICcuL1NlbmRNZXNzYWdlJztcbmltcG9ydCB7XG4gIE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvcixcbiAgT3V0Z29pbmdNZXNzYWdlRXJyb3IsXG4gIFNlbmRNZXNzYWdlTmV0d29ya0Vycm9yLFxuICBTZW5kTWVzc2FnZUNoYWxsZW5nZUVycm9yLFxuICBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IsXG4gIEhUVFBFcnJvcixcbn0gZnJvbSAnLi9FcnJvcnMnO1xuaW1wb3J0IHR5cGUgeyBDYWxsYmFja1Jlc3VsdFR5cGUsIEN1c3RvbUVycm9yIH0gZnJvbSAnLi9UeXBlcy5kJztcbmltcG9ydCB7IGlzVmFsaWROdW1iZXIgfSBmcm9tICcuLi90eXBlcy9QaG9uZU51bWJlcic7XG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvQWRkcmVzcyc7XG5pbXBvcnQgeyBRdWFsaWZpZWRBZGRyZXNzIH0gZnJvbSAnLi4vdHlwZXMvUXVhbGlmaWVkQWRkcmVzcyc7XG5pbXBvcnQgeyBVVUlELCBpc1ZhbGlkVXVpZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgU2Vzc2lvbnMsIElkZW50aXR5S2V5cyB9IGZyb20gJy4uL0xpYlNpZ25hbFN0b3Jlcyc7XG5pbXBvcnQgeyB1cGRhdGVDb252ZXJzYXRpb25zV2l0aFV1aWRMb29rdXAgfSBmcm9tICcuLi91cGRhdGVDb252ZXJzYXRpb25zV2l0aFV1aWRMb29rdXAnO1xuaW1wb3J0IHsgZ2V0S2V5c0ZvcklkZW50aWZpZXIgfSBmcm9tICcuL2dldEtleXNGb3JJZGVudGlmaWVyJztcbmltcG9ydCB7IFNpZ25hbFNlcnZpY2UgYXMgUHJvdG8gfSBmcm9tICcuLi9wcm90b2J1Zic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nZ2luZy9sb2cnO1xuXG5leHBvcnQgY29uc3QgZW51bSBTZW5kZXJDZXJ0aWZpY2F0ZU1vZGUge1xuICBXaXRoRTE2NCxcbiAgV2l0aG91dEUxNjQsXG59XG5cbmV4cG9ydCB0eXBlIFNlbmRMb2dDYWxsYmFja1R5cGUgPSAob3B0aW9uczoge1xuICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gIGRldmljZUlkczogQXJyYXk8bnVtYmVyPjtcbn0pID0+IFByb21pc2U8dm9pZD47XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVkQ2VydGlmaWNhdGVTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGV4cGlyZXM6IHoubnVtYmVyKCkub3B0aW9uYWwoKSxcbiAgc2VyaWFsaXplZDogei5pbnN0YW5jZW9mKFVpbnQ4QXJyYXkpLFxufSk7XG5cbmV4cG9ydCB0eXBlIFNlcmlhbGl6ZWRDZXJ0aWZpY2F0ZVR5cGUgPSB6LmluZmVyPFxuICB0eXBlb2Ygc2VyaWFsaXplZENlcnRpZmljYXRlU2NoZW1hXG4+O1xuXG50eXBlIE91dGdvaW5nTWVzc2FnZU9wdGlvbnNUeXBlID0gU2VuZE9wdGlvbnNUeXBlICYge1xuICBvbmxpbmU/OiBib29sZWFuO1xufTtcblxuZnVuY3Rpb24gY2lwaGVydGV4dE1lc3NhZ2VUeXBlVG9FbnZlbG9wZVR5cGUodHlwZTogbnVtYmVyKSB7XG4gIGlmICh0eXBlID09PSBDaXBoZXJ0ZXh0TWVzc2FnZVR5cGUuUHJlS2V5KSB7XG4gICAgcmV0dXJuIFByb3RvLkVudmVsb3BlLlR5cGUuUFJFS0VZX0JVTkRMRTtcbiAgfVxuICBpZiAodHlwZSA9PT0gQ2lwaGVydGV4dE1lc3NhZ2VUeXBlLldoaXNwZXIpIHtcbiAgICByZXR1cm4gUHJvdG8uRW52ZWxvcGUuVHlwZS5DSVBIRVJURVhUO1xuICB9XG4gIGlmICh0eXBlID09PSBDaXBoZXJ0ZXh0TWVzc2FnZVR5cGUuUGxhaW50ZXh0KSB7XG4gICAgcmV0dXJuIFByb3RvLkVudmVsb3BlLlR5cGUuUExBSU5URVhUX0NPTlRFTlQ7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGBjaXBoZXJ0ZXh0TWVzc2FnZVR5cGVUb0VudmVsb3BlVHlwZTogVW5yZWNvZ25pemVkIHR5cGUgJHt0eXBlfWBcbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFkZGVkTWVzc2FnZUxlbmd0aChtZXNzYWdlTGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBtZXNzYWdlTGVuZ3RoV2l0aFRlcm1pbmF0b3IgPSBtZXNzYWdlTGVuZ3RoICsgMTtcbiAgbGV0IG1lc3NhZ2VQYXJ0Q291bnQgPSBNYXRoLmZsb29yKG1lc3NhZ2VMZW5ndGhXaXRoVGVybWluYXRvciAvIDE2MCk7XG5cbiAgaWYgKG1lc3NhZ2VMZW5ndGhXaXRoVGVybWluYXRvciAlIDE2MCAhPT0gMCkge1xuICAgIG1lc3NhZ2VQYXJ0Q291bnQgKz0gMTtcbiAgfVxuXG4gIHJldHVybiBtZXNzYWdlUGFydENvdW50ICogMTYwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkTWVzc2FnZShtZXNzYWdlQnVmZmVyOiBVaW50OEFycmF5KTogVWludDhBcnJheSB7XG4gIGNvbnN0IHBsYWludGV4dCA9IG5ldyBVaW50OEFycmF5KFxuICAgIGdldFBhZGRlZE1lc3NhZ2VMZW5ndGgobWVzc2FnZUJ1ZmZlci5ieXRlTGVuZ3RoICsgMSkgLSAxXG4gICk7XG4gIHBsYWludGV4dC5zZXQobWVzc2FnZUJ1ZmZlcik7XG4gIHBsYWludGV4dFttZXNzYWdlQnVmZmVyLmJ5dGVMZW5ndGhdID0gMHg4MDtcblxuICByZXR1cm4gcGxhaW50ZXh0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRnb2luZ01lc3NhZ2Uge1xuICBzZXJ2ZXI6IFdlYkFQSVR5cGU7XG5cbiAgdGltZXN0YW1wOiBudW1iZXI7XG5cbiAgaWRlbnRpZmllcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcblxuICBtZXNzYWdlOiBQcm90by5Db250ZW50IHwgUGxhaW50ZXh0Q29udGVudDtcblxuICBjYWxsYmFjazogKHJlc3VsdDogQ2FsbGJhY2tSZXN1bHRUeXBlKSA9PiB2b2lkO1xuXG4gIHBsYWludGV4dD86IFVpbnQ4QXJyYXk7XG5cbiAgaWRlbnRpZmllcnNDb21wbGV0ZWQ6IG51bWJlcjtcblxuICBlcnJvcnM6IEFycmF5PEN1c3RvbUVycm9yPjtcblxuICBzdWNjZXNzZnVsSWRlbnRpZmllcnM6IEFycmF5PHN0cmluZz47XG5cbiAgZmFpbG92ZXJJZGVudGlmaWVyczogQXJyYXk8c3RyaW5nPjtcblxuICB1bmlkZW50aWZpZWREZWxpdmVyaWVzOiBBcnJheTxzdHJpbmc+O1xuXG4gIHNlbmRNZXRhZGF0YT86IFNlbmRNZXRhZGF0YVR5cGU7XG5cbiAgb25saW5lPzogYm9vbGVhbjtcblxuICBncm91cElkPzogc3RyaW5nO1xuXG4gIGNvbnRlbnRIaW50OiBudW1iZXI7XG5cbiAgdXJnZW50OiBib29sZWFuO1xuXG4gIHJlY2lwaWVudHM6IFJlY29yZDxzdHJpbmcsIEFycmF5PG51bWJlcj4+O1xuXG4gIHNlbmRMb2dDYWxsYmFjaz86IFNlbmRMb2dDYWxsYmFja1R5cGU7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGNhbGxiYWNrLFxuICAgIGNvbnRlbnRIaW50LFxuICAgIGdyb3VwSWQsXG4gICAgaWRlbnRpZmllcnMsXG4gICAgbWVzc2FnZSxcbiAgICBvcHRpb25zLFxuICAgIHNlbmRMb2dDYWxsYmFjayxcbiAgICBzZXJ2ZXIsXG4gICAgdGltZXN0YW1wLFxuICAgIHVyZ2VudCxcbiAgfToge1xuICAgIGNhbGxiYWNrOiAocmVzdWx0OiBDYWxsYmFja1Jlc3VsdFR5cGUpID0+IHZvaWQ7XG4gICAgY29udGVudEhpbnQ6IG51bWJlcjtcbiAgICBncm91cElkOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgaWRlbnRpZmllcnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgICBtZXNzYWdlOiBQcm90by5Db250ZW50IHwgUHJvdG8uRGF0YU1lc3NhZ2UgfCBQbGFpbnRleHRDb250ZW50O1xuICAgIG9wdGlvbnM/OiBPdXRnb2luZ01lc3NhZ2VPcHRpb25zVHlwZTtcbiAgICBzZW5kTG9nQ2FsbGJhY2s/OiBTZW5kTG9nQ2FsbGJhY2tUeXBlO1xuICAgIHNlcnZlcjogV2ViQVBJVHlwZTtcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgICB1cmdlbnQ6IGJvb2xlYW47XG4gIH0pIHtcbiAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFByb3RvLkRhdGFNZXNzYWdlKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gbmV3IFByb3RvLkNvbnRlbnQoKTtcbiAgICAgIGNvbnRlbnQuZGF0YU1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgdGhpcy5tZXNzYWdlID0gY29udGVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLmlkZW50aWZpZXJzID0gaWRlbnRpZmllcnM7XG4gICAgdGhpcy5jb250ZW50SGludCA9IGNvbnRlbnRIaW50O1xuICAgIHRoaXMuZ3JvdXBJZCA9IGdyb3VwSWQ7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMudXJnZW50ID0gdXJnZW50O1xuXG4gICAgdGhpcy5pZGVudGlmaWVyc0NvbXBsZXRlZCA9IDA7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICB0aGlzLnN1Y2Nlc3NmdWxJZGVudGlmaWVycyA9IFtdO1xuICAgIHRoaXMuZmFpbG92ZXJJZGVudGlmaWVycyA9IFtdO1xuICAgIHRoaXMudW5pZGVudGlmaWVkRGVsaXZlcmllcyA9IFtdO1xuICAgIHRoaXMucmVjaXBpZW50cyA9IHt9O1xuICAgIHRoaXMuc2VuZExvZ0NhbGxiYWNrID0gc2VuZExvZ0NhbGxiYWNrO1xuXG4gICAgdGhpcy5zZW5kTWV0YWRhdGEgPSBvcHRpb25zPy5zZW5kTWV0YWRhdGE7XG4gICAgdGhpcy5vbmxpbmUgPSBvcHRpb25zPy5vbmxpbmU7XG4gIH1cblxuICBudW1iZXJDb21wbGV0ZWQoKTogdm9pZCB7XG4gICAgdGhpcy5pZGVudGlmaWVyc0NvbXBsZXRlZCArPSAxO1xuICAgIGlmICh0aGlzLmlkZW50aWZpZXJzQ29tcGxldGVkID49IHRoaXMuaWRlbnRpZmllcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwcm90byA9IHRoaXMubWVzc2FnZTtcbiAgICAgIGNvbnN0IGNvbnRlbnRQcm90byA9IHRoaXMuZ2V0Q29udGVudFByb3RvQnl0ZXMoKTtcbiAgICAgIGNvbnN0IHsgdGltZXN0YW1wLCBjb250ZW50SGludCwgcmVjaXBpZW50cywgdXJnZW50IH0gPSB0aGlzO1xuICAgICAgbGV0IGRhdGFNZXNzYWdlOiBVaW50OEFycmF5IHwgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBQcm90by5Db250ZW50ICYmIHByb3RvLmRhdGFNZXNzYWdlKSB7XG4gICAgICAgIGRhdGFNZXNzYWdlID0gUHJvdG8uRGF0YU1lc3NhZ2UuZW5jb2RlKHByb3RvLmRhdGFNZXNzYWdlKS5maW5pc2goKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvdG8gaW5zdGFuY2VvZiBQcm90by5EYXRhTWVzc2FnZSkge1xuICAgICAgICBkYXRhTWVzc2FnZSA9IFByb3RvLkRhdGFNZXNzYWdlLmVuY29kZShwcm90bykuZmluaXNoKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FsbGJhY2soe1xuICAgICAgICBzdWNjZXNzZnVsSWRlbnRpZmllcnM6IHRoaXMuc3VjY2Vzc2Z1bElkZW50aWZpZXJzLFxuICAgICAgICBmYWlsb3ZlcklkZW50aWZpZXJzOiB0aGlzLmZhaWxvdmVySWRlbnRpZmllcnMsXG4gICAgICAgIGVycm9yczogdGhpcy5lcnJvcnMsXG4gICAgICAgIHVuaWRlbnRpZmllZERlbGl2ZXJpZXM6IHRoaXMudW5pZGVudGlmaWVkRGVsaXZlcmllcyxcblxuICAgICAgICBjb250ZW50SGludCxcbiAgICAgICAgZGF0YU1lc3NhZ2UsXG4gICAgICAgIHJlY2lwaWVudHMsXG4gICAgICAgIGNvbnRlbnRQcm90byxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB1cmdlbnQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckVycm9yKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICByZWFzb246IHN0cmluZyxcbiAgICBwcm92aWRlZEVycm9yPzogRXJyb3JcbiAgKTogdm9pZCB7XG4gICAgbGV0IGVycm9yID0gcHJvdmlkZWRFcnJvcjtcblxuICAgIGlmICghZXJyb3IgfHwgKGVycm9yIGluc3RhbmNlb2YgSFRUUEVycm9yICYmIGVycm9yLmNvZGUgIT09IDQwNCkpIHtcbiAgICAgIGlmIChlcnJvciAmJiBlcnJvci5jb2RlID09PSA0MjgpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvcihpZGVudGlmaWVyLCBlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IG5ldyBPdXRnb2luZ01lc3NhZ2VFcnJvcihpZGVudGlmaWVyLCBudWxsLCBudWxsLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IucmVhc29uID0gcmVhc29uO1xuICAgIGVycm9yLnN0YWNrRm9yTG9nID0gcHJvdmlkZWRFcnJvciA/IHByb3ZpZGVkRXJyb3Iuc3RhY2sgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmVycm9yc1t0aGlzLmVycm9ycy5sZW5ndGhdID0gZXJyb3I7XG4gICAgdGhpcy5udW1iZXJDb21wbGV0ZWQoKTtcbiAgfVxuXG4gIHJlbG9hZERldmljZXNBbmRTZW5kKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICByZWN1cnNlPzogYm9vbGVhblxuICApOiAoKSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb3VyVXVpZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXRDaGVja2VkVXVpZCgpO1xuICAgICAgY29uc3QgZGV2aWNlSWRzID0gYXdhaXQgd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS5wcm90b2NvbC5nZXREZXZpY2VJZHMoe1xuICAgICAgICBvdXJVdWlkLFxuICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgfSk7XG4gICAgICBpZiAoZGV2aWNlSWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3IoXG4gICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAncmVsb2FkRGV2aWNlc0FuZFNlbmQ6IEdvdCBlbXB0eSBkZXZpY2UgbGlzdCB3aGVuIGxvYWRpbmcgZGV2aWNlIGtleXMnLFxuICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZG9TZW5kTWVzc2FnZShpZGVudGlmaWVyLCBkZXZpY2VJZHMsIHJlY3Vyc2UpO1xuICAgIH07XG4gIH1cblxuICBhc3luYyBnZXRLZXlzRm9ySWRlbnRpZmllcihcbiAgICBpZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgdXBkYXRlRGV2aWNlcz86IEFycmF5PG51bWJlcj5cbiAgKTogUHJvbWlzZTx2b2lkIHwgQXJyYXk8dm9pZCB8IG51bGw+PiB7XG4gICAgY29uc3QgeyBzZW5kTWV0YWRhdGEgfSA9IHRoaXM7XG4gICAgY29uc3QgaW5mbyA9XG4gICAgICBzZW5kTWV0YWRhdGEgJiYgc2VuZE1ldGFkYXRhW2lkZW50aWZpZXJdXG4gICAgICAgID8gc2VuZE1ldGFkYXRhW2lkZW50aWZpZXJdXG4gICAgICAgIDogeyBhY2Nlc3NLZXk6IHVuZGVmaW5lZCB9O1xuICAgIGNvbnN0IHsgYWNjZXNzS2V5IH0gPSBpbmZvO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgYWNjZXNzS2V5RmFpbGVkIH0gPSBhd2FpdCBnZXRLZXlzRm9ySWRlbnRpZmllcihcbiAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgdGhpcy5zZXJ2ZXIsXG4gICAgICAgIHVwZGF0ZURldmljZXMsXG4gICAgICAgIGFjY2Vzc0tleVxuICAgICAgKTtcbiAgICAgIGlmIChhY2Nlc3NLZXlGYWlsZWQgJiYgIXRoaXMuZmFpbG92ZXJJZGVudGlmaWVycy5pbmNsdWRlcyhpZGVudGlmaWVyKSkge1xuICAgICAgICB0aGlzLmZhaWxvdmVySWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yPy5tZXNzYWdlPy5pbmNsdWRlcygndW50cnVzdGVkIGlkZW50aXR5IGZvciBhZGRyZXNzJykpIHtcbiAgICAgICAgZXJyb3IudGltZXN0YW1wID0gdGhpcy50aW1lc3RhbXA7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBhc3luYyB0cmFuc21pdE1lc3NhZ2UoXG4gICAgaWRlbnRpZmllcjogc3RyaW5nLFxuICAgIGpzb25EYXRhOiBSZWFkb25seUFycmF5PE1lc3NhZ2VUeXBlPixcbiAgICB0aW1lc3RhbXA6IG51bWJlcixcbiAgICB7IGFjY2Vzc0tleSB9OiB7IGFjY2Vzc0tleT86IHN0cmluZyB9ID0ge31cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IHByb21pc2U7XG5cbiAgICBpZiAoYWNjZXNzS2V5KSB7XG4gICAgICBwcm9taXNlID0gdGhpcy5zZXJ2ZXIuc2VuZE1lc3NhZ2VzVW5hdXRoKFxuICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICBqc29uRGF0YSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICB7IGFjY2Vzc0tleSwgb25saW5lOiB0aGlzLm9ubGluZSwgdXJnZW50OiB0aGlzLnVyZ2VudCB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlID0gdGhpcy5zZXJ2ZXIuc2VuZE1lc3NhZ2VzKGlkZW50aWZpZXIsIGpzb25EYXRhLCB0aW1lc3RhbXAsIHtcbiAgICAgICAgb25saW5lOiB0aGlzLm9ubGluZSxcbiAgICAgICAgdXJnZW50OiB0aGlzLnVyZ2VudCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlLmNhdGNoKGUgPT4ge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBIVFRQRXJyb3IgJiYgZS5jb2RlICE9PSA0MDkgJiYgZS5jb2RlICE9PSA0MTApIHtcbiAgICAgICAgLy8gNDA5IGFuZCA0MTAgc2hvdWxkIGJ1YmJsZSBhbmQgYmUgaGFuZGxlZCBieSBkb1NlbmRNZXNzYWdlXG4gICAgICAgIC8vIDQwNCBzaG91bGQgdGhyb3cgVW5yZWdpc3RlcmVkVXNlckVycm9yXG4gICAgICAgIC8vIDQyOCBzaG91bGQgdGhyb3cgU2VuZE1lc3NhZ2VDaGFsbGVuZ2VFcnJvclxuICAgICAgICAvLyBhbGwgb3RoZXIgbmV0d29yayBlcnJvcnMgY2FuIGJlIHJldHJpZWQgbGF0ZXIuXG4gICAgICAgIGlmIChlLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgIHRocm93IG5ldyBVbnJlZ2lzdGVyZWRVc2VyRXJyb3IoaWRlbnRpZmllciwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuY29kZSA9PT0gNDI4KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFNlbmRNZXNzYWdlQ2hhbGxlbmdlRXJyb3IoaWRlbnRpZmllciwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFNlbmRNZXNzYWdlTmV0d29ya0Vycm9yKGlkZW50aWZpZXIsIGpzb25EYXRhLCBlKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQbGFpbnRleHQoKTogVWludDhBcnJheSB7XG4gICAgaWYgKCF0aGlzLnBsYWludGV4dCkge1xuICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSB0aGlzO1xuXG4gICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFByb3RvLkNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5wbGFpbnRleHQgPSBwYWRNZXNzYWdlKFByb3RvLkNvbnRlbnQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGxhaW50ZXh0ID0gbWVzc2FnZS5zZXJpYWxpemUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGxhaW50ZXh0O1xuICB9XG5cbiAgZ2V0Q29udGVudFByb3RvQnl0ZXMoKTogVWludDhBcnJheSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMubWVzc2FnZSBpbnN0YW5jZW9mIFByb3RvLkNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShQcm90by5Db250ZW50LmVuY29kZSh0aGlzLm1lc3NhZ2UpLmZpbmlzaCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2lwaGVydGV4dE1lc3NhZ2Uoe1xuICAgIGlkZW50aXR5S2V5U3RvcmUsXG4gICAgcHJvdG9jb2xBZGRyZXNzLFxuICAgIHNlc3Npb25TdG9yZSxcbiAgfToge1xuICAgIGlkZW50aXR5S2V5U3RvcmU6IElkZW50aXR5S2V5cztcbiAgICBwcm90b2NvbEFkZHJlc3M6IFByb3RvY29sQWRkcmVzcztcbiAgICBzZXNzaW9uU3RvcmU6IFNlc3Npb25zO1xuICB9KTogUHJvbWlzZTxDaXBoZXJ0ZXh0TWVzc2FnZT4ge1xuICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gdGhpcztcblxuICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgUHJvdG8uQ29udGVudCkge1xuICAgICAgcmV0dXJuIHNpZ25hbEVuY3J5cHQoXG4gICAgICAgIEJ1ZmZlci5mcm9tKHRoaXMuZ2V0UGxhaW50ZXh0KCkpLFxuICAgICAgICBwcm90b2NvbEFkZHJlc3MsXG4gICAgICAgIHNlc3Npb25TdG9yZSxcbiAgICAgICAgaWRlbnRpdHlLZXlTdG9yZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZS5hc0NpcGhlcnRleHRNZXNzYWdlKCk7XG4gIH1cblxuICBhc3luYyBkb1NlbmRNZXNzYWdlKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBkZXZpY2VJZHM6IEFycmF5PG51bWJlcj4sXG4gICAgcmVjdXJzZT86IGJvb2xlYW5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBzZW5kTWV0YWRhdGEgfSA9IHRoaXM7XG4gICAgY29uc3QgeyBhY2Nlc3NLZXksIHNlbmRlckNlcnRpZmljYXRlIH0gPSBzZW5kTWV0YWRhdGE/LltpZGVudGlmaWVyXSB8fCB7fTtcblxuICAgIGlmIChhY2Nlc3NLZXkgJiYgIXNlbmRlckNlcnRpZmljYXRlKSB7XG4gICAgICBsb2cud2FybihcbiAgICAgICAgJ091dGdvaW5nTWVzc2FnZS5kb1NlbmRNZXNzYWdlOiBhY2Nlc3NLZXkgd2FzIHByb3ZpZGVkLCBidXQgc2VuZGVyQ2VydGlmaWNhdGUgd2FzIG5vdCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VhbGVkU2VuZGVyID0gQm9vbGVhbihhY2Nlc3NLZXkgJiYgc2VuZGVyQ2VydGlmaWNhdGUpO1xuXG4gICAgLy8gV2UgZG9uJ3Qgc2VuZCB0byBvdXJzZWx2ZXMgdW5sZXNzIHNlYWxlZFNlbmRlciBpcyBlbmFibGVkXG4gICAgY29uc3Qgb3VyTnVtYmVyID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldE51bWJlcigpO1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKTtcbiAgICBjb25zdCBvdXJEZXZpY2VJZCA9IHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UudXNlci5nZXREZXZpY2VJZCgpO1xuICAgIGlmIChcbiAgICAgIChpZGVudGlmaWVyID09PSBvdXJOdW1iZXIgfHwgaWRlbnRpZmllciA9PT0gb3VyVXVpZC50b1N0cmluZygpKSAmJlxuICAgICAgIXNlYWxlZFNlbmRlclxuICAgICkge1xuICAgICAgZGV2aWNlSWRzID0gcmVqZWN0KFxuICAgICAgICBkZXZpY2VJZHMsXG4gICAgICAgIGRldmljZUlkID0+XG4gICAgICAgICAgLy8gYmVjYXVzZSB3ZSBzdG9yZSBvdXIgb3duIGRldmljZSBJRCBhcyBhIHN0cmluZyBhdCBsZWFzdCBzb21ldGltZXNcbiAgICAgICAgICBkZXZpY2VJZCA9PT0gb3VyRGV2aWNlSWQgfHxcbiAgICAgICAgICAodHlwZW9mIG91ckRldmljZUlkID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgZGV2aWNlSWQgPT09IHBhcnNlSW50KG91ckRldmljZUlkLCAxMCkpXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb25TdG9yZSA9IG5ldyBTZXNzaW9ucyh7IG91clV1aWQgfSk7XG4gICAgY29uc3QgaWRlbnRpdHlLZXlTdG9yZSA9IG5ldyBJZGVudGl0eUtleXMoeyBvdXJVdWlkIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgZGV2aWNlSWRzLm1hcChhc3luYyBkZXN0aW5hdGlvbkRldmljZUlkID0+IHtcbiAgICAgICAgY29uc3QgdGhlaXJVdWlkID0gVVVJRC5jaGVja2VkTG9va3VwKGlkZW50aWZpZXIpO1xuICAgICAgICBjb25zdCBhZGRyZXNzID0gbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICAgICAgb3VyVXVpZCxcbiAgICAgICAgICBuZXcgQWRkcmVzcyh0aGVpclV1aWQsIGRlc3RpbmF0aW9uRGV2aWNlSWQpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2wuZW5xdWV1ZVNlc3Npb25Kb2I8TWVzc2FnZVR5cGU+KFxuICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvdG9jb2xBZGRyZXNzID0gUHJvdG9jb2xBZGRyZXNzLm5ldyhcbiAgICAgICAgICAgICAgdGhlaXJVdWlkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uRGV2aWNlSWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVNlc3Npb24gPSBhd2FpdCBzZXNzaW9uU3RvcmUuZ2V0U2Vzc2lvbihcbiAgICAgICAgICAgICAgcHJvdG9jb2xBZGRyZXNzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmVTZXNzaW9uKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnT3V0Z29pbmdNZXNzYWdlLmRvU2VuZE1lc3NhZ2U6IE5vIGFjdGl2ZSBzZXNzaW9uISdcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb25SZWdpc3RyYXRpb25JZCA9XG4gICAgICAgICAgICAgIGFjdGl2ZVNlc3Npb24ucmVtb3RlUmVnaXN0cmF0aW9uSWQoKTtcblxuICAgICAgICAgICAgaWYgKHNlYWxlZFNlbmRlciAmJiBzZW5kZXJDZXJ0aWZpY2F0ZSkge1xuICAgICAgICAgICAgICBjb25zdCBjaXBoZXJ0ZXh0TWVzc2FnZSA9IGF3YWl0IHRoaXMuZ2V0Q2lwaGVydGV4dE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGlkZW50aXR5S2V5U3RvcmUsXG4gICAgICAgICAgICAgICAgcHJvdG9jb2xBZGRyZXNzLFxuICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yZSxcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgY29uc3QgY2VydGlmaWNhdGUgPSBTZW5kZXJDZXJ0aWZpY2F0ZS5kZXNlcmlhbGl6ZShcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbShzZW5kZXJDZXJ0aWZpY2F0ZS5zZXJpYWxpemVkKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjb25zdCBncm91cElkQnVmZmVyID0gdGhpcy5ncm91cElkXG4gICAgICAgICAgICAgICAgPyBCdWZmZXIuZnJvbSh0aGlzLmdyb3VwSWQsICdiYXNlNjQnKVxuICAgICAgICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gVW5pZGVudGlmaWVkU2VuZGVyTWVzc2FnZUNvbnRlbnQubmV3KFxuICAgICAgICAgICAgICAgIGNpcGhlcnRleHRNZXNzYWdlLFxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRlLFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEhpbnQsXG4gICAgICAgICAgICAgICAgZ3JvdXBJZEJ1ZmZlclxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IHNlYWxlZFNlbmRlckVuY3J5cHQoXG4gICAgICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgICAgICBwcm90b2NvbEFkZHJlc3MsXG4gICAgICAgICAgICAgICAgaWRlbnRpdHlLZXlTdG9yZVxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogUHJvdG8uRW52ZWxvcGUuVHlwZS5VTklERU5USUZJRURfU0VOREVSLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uRGV2aWNlSWQsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25SZWdpc3RyYXRpb25JZCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjaXBoZXJ0ZXh0TWVzc2FnZSA9IGF3YWl0IHRoaXMuZ2V0Q2lwaGVydGV4dE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICBpZGVudGl0eUtleVN0b3JlLFxuICAgICAgICAgICAgICBwcm90b2NvbEFkZHJlc3MsXG4gICAgICAgICAgICAgIHNlc3Npb25TdG9yZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGNpcGhlcnRleHRNZXNzYWdlVHlwZVRvRW52ZWxvcGVUeXBlKFxuICAgICAgICAgICAgICBjaXBoZXJ0ZXh0TWVzc2FnZS50eXBlKClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBjaXBoZXJ0ZXh0TWVzc2FnZS5zZXJpYWxpemUoKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uRGV2aWNlSWQsXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uUmVnaXN0cmF0aW9uSWQsXG4gICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKVxuICAgICAgLnRoZW4oYXN5bmMgKGpzb25EYXRhOiBBcnJheTxNZXNzYWdlVHlwZT4pID0+IHtcbiAgICAgICAgaWYgKHNlYWxlZFNlbmRlcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbWl0TWVzc2FnZShpZGVudGlmaWVyLCBqc29uRGF0YSwgdGhpcy50aW1lc3RhbXAsIHtcbiAgICAgICAgICAgIGFjY2Vzc0tleSxcbiAgICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlY2lwaWVudHNbaWRlbnRpZmllcl0gPSBkZXZpY2VJZHM7XG4gICAgICAgICAgICAgIHRoaXMudW5pZGVudGlmaWVkRGVsaXZlcmllcy5wdXNoKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICB0aGlzLnN1Y2Nlc3NmdWxJZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICB0aGlzLm51bWJlckNvbXBsZXRlZCgpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnNlbmRMb2dDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZExvZ0NhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgICBkZXZpY2VJZHMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdWNjZXNzZnVsSWRlbnRpZmllcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGxvZy53YXJuKFxuICAgICAgICAgICAgICAgICAgYE91dGdvaW5nTWVzc2FnZS5kb1NlbmRNZXNzYWdlOiBubyBzZW5kTG9nQ2FsbGJhY2sgcHJvdmlkZWQgZm9yIG1lc3NhZ2UgJHt0aGlzLnRpbWVzdGFtcH0sIGJ1dCBtdWx0aXBsZSByZWNpcGllbnRzYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3luYyAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvciAmJlxuICAgICAgICAgICAgICAgIChlcnJvci5jb2RlID09PSA0MDEgfHwgZXJyb3IuY29kZSA9PT0gNDAzKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mYWlsb3ZlcklkZW50aWZpZXJzLmluZGV4T2YoaWRlbnRpZmllcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmZhaWxvdmVySWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBkb24ndCBoaXQgdGhpcyBjb2RlcGF0aCB0aGUgbmV4dCB0aW1lIHRocm91Z2hcbiAgICAgICAgICAgICAgICBpZiAoc2VuZE1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgc2VuZE1ldGFkYXRhW2lkZW50aWZpZXJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRvU2VuZE1lc3NhZ2UoaWRlbnRpZmllciwgZGV2aWNlSWRzLCByZWN1cnNlKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc21pdE1lc3NhZ2UoaWRlbnRpZmllciwganNvbkRhdGEsIHRoaXMudGltZXN0YW1wKS50aGVuKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc2Z1bElkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gICAgICAgICAgICB0aGlzLnJlY2lwaWVudHNbaWRlbnRpZmllcl0gPSBkZXZpY2VJZHM7XG4gICAgICAgICAgICB0aGlzLm51bWJlckNvbXBsZXRlZCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZW5kTG9nQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgdGhpcy5zZW5kTG9nQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgZGV2aWNlSWRzLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdWNjZXNzZnVsSWRlbnRpZmllcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBsb2cud2FybihcbiAgICAgICAgICAgICAgICBgT3V0Z29pbmdNZXNzYWdlLmRvU2VuZE1lc3NhZ2U6IG5vIHNlbmRMb2dDYWxsYmFjayBwcm92aWRlZCBmb3IgbWVzc2FnZSAke3RoaXMudGltZXN0YW1wfSwgYnV0IG11bHRpcGxlIHJlY2lwaWVudHNgXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChhc3luYyBlcnJvciA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEhUVFBFcnJvciAmJlxuICAgICAgICAgIChlcnJvci5jb2RlID09PSA0MTAgfHwgZXJyb3IuY29kZSA9PT0gNDA5KVxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoIXJlY3Vyc2UpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvcihcbiAgICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgJ0hpdCByZXRyeSBsaW1pdCBhdHRlbXB0aW5nIHRvIHJlbG9hZCBkZXZpY2UgbGlzdCcsXG4gICAgICAgICAgICAgIGVycm9yXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGVycm9yLnJlc3BvbnNlIGFzIHtcbiAgICAgICAgICAgIGV4dHJhRGV2aWNlcz86IEFycmF5PG51bWJlcj47XG4gICAgICAgICAgICBzdGFsZURldmljZXM/OiBBcnJheTxudW1iZXI+O1xuICAgICAgICAgICAgbWlzc2luZ0RldmljZXM/OiBBcnJheTxudW1iZXI+O1xuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IHA6IFByb21pc2U8YW55PiA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0MDkpIHtcbiAgICAgICAgICAgIHAgPSB0aGlzLnJlbW92ZURldmljZUlkc0ZvcklkZW50aWZpZXIoXG4gICAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmV4dHJhRGV2aWNlcyB8fCBbXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcCA9IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAocmVzcG9uc2Uuc3RhbGVEZXZpY2VzIHx8IFtdKS5tYXAoYXN5bmMgKGRldmljZUlkOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVTZXNzaW9uKFxuICAgICAgICAgICAgICAgICAgbmV3IFF1YWxpZmllZEFkZHJlc3MoXG4gICAgICAgICAgICAgICAgICAgIG91clV1aWQsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBBZGRyZXNzKFVVSUQuY2hlY2tlZExvb2t1cChpZGVudGlmaWVyKSwgZGV2aWNlSWQpXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNldERldmljZXMgPVxuICAgICAgICAgICAgICBlcnJvci5jb2RlID09PSA0MTBcbiAgICAgICAgICAgICAgICA/IHJlc3BvbnNlLnN0YWxlRGV2aWNlc1xuICAgICAgICAgICAgICAgIDogcmVzcG9uc2UubWlzc2luZ0RldmljZXM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRLZXlzRm9ySWRlbnRpZmllcihpZGVudGlmaWVyLCByZXNldERldmljZXMpLnRoZW4oXG4gICAgICAgICAgICAgIC8vIFdlIGNvbnRpbnVlIHRvIHJldHJ5IGFzIGxvbmcgYXMgdGhlIGVycm9yIGNvZGUgd2FzIDQwOTsgdGhlIGFzc3VtcHRpb24gaXNcbiAgICAgICAgICAgICAgLy8gICB0aGF0IHdlJ2xsIHJlcXVlc3QgbmV3IGRldmljZSBpbmZvIGFuZCB0aGUgbmV4dCByZXF1ZXN0IHdpbGwgc3VjY2VlZC5cbiAgICAgICAgICAgICAgdGhpcy5yZWxvYWREZXZpY2VzQW5kU2VuZChpZGVudGlmaWVyLCBlcnJvci5jb2RlID09PSA0MDkpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvcj8ubWVzc2FnZT8uaW5jbHVkZXMoJ3VudHJ1c3RlZCBpZGVudGl0eSBmb3IgYWRkcmVzcycpKSB7XG4gICAgICAgICAgZXJyb3IudGltZXN0YW1wID0gdGhpcy50aW1lc3RhbXA7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgJ0dvdCBcImtleSBjaGFuZ2VkXCIgZXJyb3IgZnJvbSBlbmNyeXB0IC0gbm8gaWRlbnRpdHlLZXkgZm9yIGFwcGxpY2F0aW9uIGxheWVyJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBkZXZpY2VJZHNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbG9nLmluZm8oJ2Nsb3NpbmcgYWxsIHNlc3Npb25zIGZvcicsIGlkZW50aWZpZXIpO1xuICAgICAgICAgIHdpbmRvdy50ZXh0c2VjdXJlLnN0b3JhZ2UucHJvdG9jb2xcbiAgICAgICAgICAgIC5hcmNoaXZlQWxsU2Vzc2lvbnMoVVVJRC5jaGVja2VkTG9va3VwKGlkZW50aWZpZXIpKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5uZXJFcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgICAgICAgYGRvU2VuZE1lc3NhZ2U6IEVycm9yIGNsb3Npbmcgc2Vzc2lvbnM6ICR7aW5uZXJFcnJvci5zdGFja31gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvcihcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgICdGYWlsZWQgdG8gY3JlYXRlIG9yIHNlbmQgbWVzc2FnZScsXG4gICAgICAgICAgZXJyb3JcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSk7XG4gIH1cblxuICBhc3luYyByZW1vdmVEZXZpY2VJZHNGb3JJZGVudGlmaWVyKFxuICAgIGlkZW50aWZpZXI6IHN0cmluZyxcbiAgICBkZXZpY2VJZHNUb1JlbW92ZTogQXJyYXk8bnVtYmVyPlxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgY29uc3QgdGhlaXJVdWlkID0gVVVJRC5jaGVja2VkTG9va3VwKGlkZW50aWZpZXIpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBkZXZpY2VJZHNUb1JlbW92ZS5tYXAoYXN5bmMgZGV2aWNlSWQgPT4ge1xuICAgICAgICBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmFyY2hpdmVTZXNzaW9uKFxuICAgICAgICAgIG5ldyBRdWFsaWZpZWRBZGRyZXNzKG91clV1aWQsIG5ldyBBZGRyZXNzKHRoZWlyVXVpZCwgZGV2aWNlSWQpKVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc2VuZFRvSWRlbnRpZmllcihwcm92aWRlZElkZW50aWZpZXI6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBpZGVudGlmaWVyID0gcHJvdmlkZWRJZGVudGlmaWVyO1xuICAgIHRyeSB7XG4gICAgICBpZiAoaXNWYWxpZFV1aWQoaWRlbnRpZmllcikpIHtcbiAgICAgICAgLy8gV2UncmUgZ29vZCFcbiAgICAgIH0gZWxzZSBpZiAoaXNWYWxpZE51bWJlcihpZGVudGlmaWVyKSkge1xuICAgICAgICBpZiAoIXdpbmRvdy50ZXh0c2VjdXJlLm1lc3NhZ2luZykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdzZW5kVG9JZGVudGlmaWVyOiB3aW5kb3cudGV4dHNlY3VyZS5tZXNzYWdpbmcgaXMgbm90IGF2YWlsYWJsZSEnXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgdXBkYXRlQ29udmVyc2F0aW9uc1dpdGhVdWlkTG9va3VwKHtcbiAgICAgICAgICAgIGNvbnZlcnNhdGlvbkNvbnRyb2xsZXI6IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLFxuICAgICAgICAgICAgY29udmVyc2F0aW9uczogW1xuICAgICAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXRPckNyZWF0ZShpZGVudGlmaWVyLCAncHJpdmF0ZScpLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG1lc3NhZ2luZzogd2luZG93LnRleHRzZWN1cmUubWVzc2FnaW5nLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgdXVpZCA9XG4gICAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQoaWRlbnRpZmllcik/LmdldCgndXVpZCcpO1xuICAgICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFVucmVnaXN0ZXJlZFVzZXJFcnJvcihcbiAgICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgbmV3IEhUVFBFcnJvcignVXNlciBpcyBub3QgcmVnaXN0ZXJlZCcsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiAtMSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlkZW50aWZpZXIgPSB1dWlkO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgIGBzZW5kVG9JZGVudGlmaWVyOiBGYWlsZWQgdG8gZmV0Y2ggVVVJRCBmb3IgaWRlbnRpZmllciAke2lkZW50aWZpZXJ9YCxcbiAgICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvclxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgc2VuZFRvSWRlbnRpZmllcjogaWRlbnRpZmllciAke2lkZW50aWZpZXJ9IHdhcyBuZWl0aGVyIGEgVVVJRCBvciBFMTY0YFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXJVdWlkID0gd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCk7XG4gICAgICBjb25zdCBkZXZpY2VJZHMgPSBhd2FpdCB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnByb3RvY29sLmdldERldmljZUlkcyh7XG4gICAgICAgIG91clV1aWQsXG4gICAgICAgIGlkZW50aWZpZXIsXG4gICAgICB9KTtcbiAgICAgIGlmIChkZXZpY2VJZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0S2V5c0ZvcklkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLnJlbG9hZERldmljZXNBbmRTZW5kKGlkZW50aWZpZXIsIHRydWUpKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvcj8ubWVzc2FnZT8uaW5jbHVkZXMoJ3VudHJ1c3RlZCBpZGVudGl0eSBmb3IgYWRkcmVzcycpKSB7XG4gICAgICAgIGNvbnN0IG5ld0Vycm9yID0gbmV3IE91dGdvaW5nSWRlbnRpdHlLZXlFcnJvcihpZGVudGlmaWVyKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yKGlkZW50aWZpZXIsICdVbnRydXN0ZWQgaWRlbnRpdHknLCBuZXdFcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3IoXG4gICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICBgRmFpbGVkIHRvIHJldHJpZXZlIG5ldyBkZXZpY2Uga2V5cyBmb3IgaWRlbnRpZmllciAke2lkZW50aWZpZXJ9YCxcbiAgICAgICAgICBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BLG9CQUF1QjtBQUV2QixpQkFBa0I7QUFLbEIsOEJBT087QUFJUCxvQkFPTztBQUVQLHlCQUE4QjtBQUM5QixxQkFBd0I7QUFDeEIsOEJBQWlDO0FBQ2pDLGtCQUFrQztBQUNsQyw2QkFBdUM7QUFDdkMsK0NBQWtEO0FBQ2xELGtDQUFxQztBQUNyQyxzQkFBdUM7QUFDdkMsVUFBcUI7QUFFZCxJQUFXLHdCQUFYLGtCQUFXLDJCQUFYO0FBQ0w7QUFDQTtBQUZnQjtBQUFBO0FBVVgsTUFBTSw4QkFBOEIsYUFBRSxPQUFPO0FBQUEsRUFDbEQsU0FBUyxhQUFFLE9BQU8sRUFBRSxTQUFTO0FBQUEsRUFDN0IsWUFBWSxhQUFFLFdBQVcsVUFBVTtBQUNyQyxDQUFDO0FBVUQsNkNBQTZDLE1BQWM7QUFDekQsTUFBSSxTQUFTLDhDQUFzQixRQUFRO0FBQ3pDLFdBQU8sOEJBQU0sU0FBUyxLQUFLO0FBQUEsRUFDN0I7QUFDQSxNQUFJLFNBQVMsOENBQXNCLFNBQVM7QUFDMUMsV0FBTyw4QkFBTSxTQUFTLEtBQUs7QUFBQSxFQUM3QjtBQUNBLE1BQUksU0FBUyw4Q0FBc0IsV0FBVztBQUM1QyxXQUFPLDhCQUFNLFNBQVMsS0FBSztBQUFBLEVBQzdCO0FBQ0EsUUFBTSxJQUFJLE1BQ1IsMERBQTBELE1BQzVEO0FBQ0Y7QUFiUyxBQWVULGdDQUFnQyxlQUErQjtBQUM3RCxRQUFNLDhCQUE4QixnQkFBZ0I7QUFDcEQsTUFBSSxtQkFBbUIsS0FBSyxNQUFNLDhCQUE4QixHQUFHO0FBRW5FLE1BQUksOEJBQThCLFFBQVEsR0FBRztBQUMzQyx3QkFBb0I7QUFBQSxFQUN0QjtBQUVBLFNBQU8sbUJBQW1CO0FBQzVCO0FBVFMsQUFXRixvQkFBb0IsZUFBdUM7QUFDaEUsUUFBTSxZQUFZLElBQUksV0FDcEIsdUJBQXVCLGNBQWMsYUFBYSxDQUFDLElBQUksQ0FDekQ7QUFDQSxZQUFVLElBQUksYUFBYTtBQUMzQixZQUFVLGNBQWMsY0FBYztBQUV0QyxTQUFPO0FBQ1Q7QUFSZ0IsQUFVaEIsTUFBTyxnQkFBOEI7QUFBQSxFQXFDbkMsWUFBWTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxLQVlDO0FBQ0QsUUFBSSxtQkFBbUIsOEJBQU0sYUFBYTtBQUN4QyxZQUFNLFVBQVUsSUFBSSw4QkFBTSxRQUFRO0FBQ2xDLGNBQVEsY0FBYztBQUN0QixXQUFLLFVBQVU7QUFBQSxJQUNqQixPQUFPO0FBQ0wsV0FBSyxVQUFVO0FBQUEsSUFDakI7QUFFQSxTQUFLLFNBQVM7QUFDZCxTQUFLLFlBQVk7QUFDakIsU0FBSyxjQUFjO0FBQ25CLFNBQUssY0FBYztBQUNuQixTQUFLLFVBQVU7QUFDZixTQUFLLFdBQVc7QUFDaEIsU0FBSyxTQUFTO0FBRWQsU0FBSyx1QkFBdUI7QUFDNUIsU0FBSyxTQUFTLENBQUM7QUFDZixTQUFLLHdCQUF3QixDQUFDO0FBQzlCLFNBQUssc0JBQXNCLENBQUM7QUFDNUIsU0FBSyx5QkFBeUIsQ0FBQztBQUMvQixTQUFLLGFBQWEsQ0FBQztBQUNuQixTQUFLLGtCQUFrQjtBQUV2QixTQUFLLGVBQWUsU0FBUztBQUM3QixTQUFLLFNBQVMsU0FBUztBQUFBLEVBQ3pCO0FBQUEsRUFFQSxrQkFBd0I7QUFDdEIsU0FBSyx3QkFBd0I7QUFDN0IsUUFBSSxLQUFLLHdCQUF3QixLQUFLLFlBQVksUUFBUTtBQUN4RCxZQUFNLFFBQVEsS0FBSztBQUNuQixZQUFNLGVBQWUsS0FBSyxxQkFBcUI7QUFDL0MsWUFBTSxFQUFFLFdBQVcsYUFBYSxZQUFZLFdBQVc7QUFDdkQsVUFBSTtBQUVKLFVBQUksaUJBQWlCLDhCQUFNLFdBQVcsTUFBTSxhQUFhO0FBQ3ZELHNCQUFjLDhCQUFNLFlBQVksT0FBTyxNQUFNLFdBQVcsRUFBRSxPQUFPO0FBQUEsTUFDbkUsV0FBVyxpQkFBaUIsOEJBQU0sYUFBYTtBQUM3QyxzQkFBYyw4QkFBTSxZQUFZLE9BQU8sS0FBSyxFQUFFLE9BQU87QUFBQSxNQUN2RDtBQUVBLFdBQUssU0FBUztBQUFBLFFBQ1osdUJBQXVCLEtBQUs7QUFBQSxRQUM1QixxQkFBcUIsS0FBSztBQUFBLFFBQzFCLFFBQVEsS0FBSztBQUFBLFFBQ2Isd0JBQXdCLEtBQUs7QUFBQSxRQUU3QjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLGNBQ0UsWUFDQSxRQUNBLGVBQ007QUFDTixRQUFJLFFBQVE7QUFFWixRQUFJLENBQUMsU0FBVSxpQkFBaUIsMkJBQWEsTUFBTSxTQUFTLEtBQU07QUFDaEUsVUFBSSxTQUFTLE1BQU0sU0FBUyxLQUFLO0FBQy9CLGdCQUFRLElBQUksd0NBQTBCLFlBQVksS0FBSztBQUFBLE1BQ3pELE9BQU87QUFDTCxnQkFBUSxJQUFJLG1DQUFxQixZQUFZLE1BQU0sTUFBTSxLQUFLO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBRUEsVUFBTSxTQUFTO0FBQ2YsVUFBTSxjQUFjLGdCQUFnQixjQUFjLFFBQVE7QUFFMUQsU0FBSyxPQUFPLEtBQUssT0FBTyxVQUFVO0FBQ2xDLFNBQUssZ0JBQWdCO0FBQUEsRUFDdkI7QUFBQSxFQUVBLHFCQUNFLFlBQ0EsU0FDcUI7QUFDckIsV0FBTyxZQUFZO0FBQ2pCLFlBQU0sVUFBVSxPQUFPLFdBQVcsUUFBUSxLQUFLLGVBQWU7QUFDOUQsWUFBTSxZQUFZLE1BQU0sT0FBTyxXQUFXLFFBQVEsU0FBUyxhQUFhO0FBQUEsUUFDdEU7QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQ0QsVUFBSSxVQUFVLFdBQVcsR0FBRztBQUMxQixhQUFLLGNBQ0gsWUFDQSx3RUFDQSxNQUNGO0FBQ0EsZUFBTztBQUFBLE1BQ1Q7QUFDQSxhQUFPLEtBQUssY0FBYyxZQUFZLFdBQVcsT0FBTztBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUFBLFFBRU0scUJBQ0osWUFDQSxlQUNvQztBQUNwQyxVQUFNLEVBQUUsaUJBQWlCO0FBQ3pCLFVBQU0sT0FDSixnQkFBZ0IsYUFBYSxjQUN6QixhQUFhLGNBQ2IsRUFBRSxXQUFXLE9BQVU7QUFDN0IsVUFBTSxFQUFFLGNBQWM7QUFFdEIsUUFBSTtBQUNGLFlBQU0sRUFBRSxvQkFBb0IsTUFBTSxzREFDaEMsWUFDQSxLQUFLLFFBQ0wsZUFDQSxTQUNGO0FBQ0EsVUFBSSxtQkFBbUIsQ0FBQyxLQUFLLG9CQUFvQixTQUFTLFVBQVUsR0FBRztBQUNyRSxhQUFLLG9CQUFvQixLQUFLLFVBQVU7QUFBQSxNQUMxQztBQUFBLElBQ0YsU0FBUyxPQUFQO0FBQ0EsVUFBSSxPQUFPLFNBQVMsU0FBUyxnQ0FBZ0MsR0FBRztBQUM5RCxjQUFNLFlBQVksS0FBSztBQUFBLE1BQ3pCO0FBQ0EsWUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsUUFFTSxnQkFDSixZQUNBLFVBQ0EsV0FDQSxFQUFFLGNBQXNDLENBQUMsR0FDMUI7QUFDZixRQUFJO0FBRUosUUFBSSxXQUFXO0FBQ2IsZ0JBQVUsS0FBSyxPQUFPLG1CQUNwQixZQUNBLFVBQ0EsV0FDQSxFQUFFLFdBQVcsUUFBUSxLQUFLLFFBQVEsUUFBUSxLQUFLLE9BQU8sQ0FDeEQ7QUFBQSxJQUNGLE9BQU87QUFDTCxnQkFBVSxLQUFLLE9BQU8sYUFBYSxZQUFZLFVBQVUsV0FBVztBQUFBLFFBQ2xFLFFBQVEsS0FBSztBQUFBLFFBQ2IsUUFBUSxLQUFLO0FBQUEsTUFDZixDQUFDO0FBQUEsSUFDSDtBQUVBLFdBQU8sUUFBUSxNQUFNLE9BQUs7QUFDeEIsVUFBSSxhQUFhLDJCQUFhLEVBQUUsU0FBUyxPQUFPLEVBQUUsU0FBUyxLQUFLO0FBSzlELFlBQUksRUFBRSxTQUFTLEtBQUs7QUFDbEIsZ0JBQU0sSUFBSSxvQ0FBc0IsWUFBWSxDQUFDO0FBQUEsUUFDL0M7QUFDQSxZQUFJLEVBQUUsU0FBUyxLQUFLO0FBQ2xCLGdCQUFNLElBQUksd0NBQTBCLFlBQVksQ0FBQztBQUFBLFFBQ25EO0FBQ0EsY0FBTSxJQUFJLHNDQUF3QixZQUFZLFVBQVUsQ0FBQztBQUFBLE1BQzNEO0FBQ0EsWUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLGVBQTJCO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLFdBQVc7QUFDbkIsWUFBTSxFQUFFLFlBQVk7QUFFcEIsVUFBSSxtQkFBbUIsOEJBQU0sU0FBUztBQUNwQyxhQUFLLFlBQVksV0FBVyw4QkFBTSxRQUFRLE9BQU8sT0FBTyxFQUFFLE9BQU8sQ0FBQztBQUFBLE1BQ3BFLE9BQU87QUFDTCxhQUFLLFlBQVksUUFBUSxVQUFVO0FBQUEsTUFDckM7QUFBQSxJQUNGO0FBQ0EsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUFBLEVBRUEsdUJBQStDO0FBQzdDLFFBQUksS0FBSyxtQkFBbUIsOEJBQU0sU0FBUztBQUN6QyxhQUFPLElBQUksV0FBVyw4QkFBTSxRQUFRLE9BQU8sS0FBSyxPQUFPLEVBQUUsT0FBTyxDQUFDO0FBQUEsSUFDbkU7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBLFFBRU0scUJBQXFCO0FBQUEsSUFDekI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEtBSzZCO0FBQzdCLFVBQU0sRUFBRSxZQUFZO0FBRXBCLFFBQUksbUJBQW1CLDhCQUFNLFNBQVM7QUFDcEMsYUFBTywyQ0FDTCxPQUFPLEtBQUssS0FBSyxhQUFhLENBQUMsR0FDL0IsaUJBQ0EsY0FDQSxnQkFDRjtBQUFBLElBQ0Y7QUFFQSxXQUFPLFFBQVEsb0JBQW9CO0FBQUEsRUFDckM7QUFBQSxRQUVNLGNBQ0osWUFDQSxXQUNBLFNBQ2U7QUFDZixVQUFNLEVBQUUsaUJBQWlCO0FBQ3pCLFVBQU0sRUFBRSxXQUFXLHNCQUFzQixlQUFlLGVBQWUsQ0FBQztBQUV4RSxRQUFJLGFBQWEsQ0FBQyxtQkFBbUI7QUFDbkMsVUFBSSxLQUNGLHNGQUNGO0FBQUEsSUFDRjtBQUVBLFVBQU0sZUFBZSxRQUFRLGFBQWEsaUJBQWlCO0FBRzNELFVBQU0sWUFBWSxPQUFPLFdBQVcsUUFBUSxLQUFLLFVBQVU7QUFDM0QsVUFBTSxVQUFVLE9BQU8sV0FBVyxRQUFRLEtBQUssZUFBZTtBQUM5RCxVQUFNLGNBQWMsT0FBTyxXQUFXLFFBQVEsS0FBSyxZQUFZO0FBQy9ELFFBQ0csZ0JBQWUsYUFBYSxlQUFlLFFBQVEsU0FBUyxNQUM3RCxDQUFDLGNBQ0Q7QUFDQSxrQkFBWSwwQkFDVixXQUNBLGNBRUUsYUFBYSxlQUNaLE9BQU8sZ0JBQWdCLFlBQ3RCLGFBQWEsU0FBUyxhQUFhLEVBQUUsQ0FDM0M7QUFBQSxJQUNGO0FBRUEsVUFBTSxlQUFlLElBQUksZ0NBQVMsRUFBRSxRQUFRLENBQUM7QUFDN0MsVUFBTSxtQkFBbUIsSUFBSSxvQ0FBYSxFQUFFLFFBQVEsQ0FBQztBQUVyRCxXQUFPLFFBQVEsSUFDYixVQUFVLElBQUksT0FBTSx3QkFBdUI7QUFDekMsWUFBTSxZQUFZLGlCQUFLLGNBQWMsVUFBVTtBQUMvQyxZQUFNLFVBQVUsSUFBSSx5Q0FDbEIsU0FDQSxJQUFJLHVCQUFRLFdBQVcsbUJBQW1CLENBQzVDO0FBRUEsYUFBTyxPQUFPLFdBQVcsUUFBUSxTQUFTLGtCQUN4QyxTQUNBLFlBQVk7QUFDVixjQUFNLGtCQUFrQix3Q0FBZ0IsSUFDdEMsVUFBVSxTQUFTLEdBQ25CLG1CQUNGO0FBRUEsY0FBTSxnQkFBZ0IsTUFBTSxhQUFhLFdBQ3ZDLGVBQ0Y7QUFDQSxZQUFJLENBQUMsZUFBZTtBQUNsQixnQkFBTSxJQUFJLE1BQ1IsbURBQ0Y7QUFBQSxRQUNGO0FBRUEsY0FBTSw0QkFDSixjQUFjLHFCQUFxQjtBQUVyQyxZQUFJLGdCQUFnQixtQkFBbUI7QUFDckMsZ0JBQU0scUJBQW9CLE1BQU0sS0FBSyxxQkFBcUI7QUFBQSxZQUN4RDtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRixDQUFDO0FBRUQsZ0JBQU0sY0FBYywwQ0FBa0IsWUFDcEMsT0FBTyxLQUFLLGtCQUFrQixVQUFVLENBQzFDO0FBQ0EsZ0JBQU0sZ0JBQWdCLEtBQUssVUFDdkIsT0FBTyxLQUFLLEtBQUssU0FBUyxRQUFRLElBQ2xDO0FBRUosZ0JBQU0sV0FBVSx5REFBaUMsSUFDL0Msb0JBQ0EsYUFDQSxLQUFLLGFBQ0wsYUFDRjtBQUVBLGdCQUFNLFNBQVMsTUFBTSxpREFDbkIsVUFDQSxpQkFDQSxnQkFDRjtBQUVBLGlCQUFPO0FBQUEsWUFDTCxNQUFNLDhCQUFNLFNBQVMsS0FBSztBQUFBLFlBQzFCO0FBQUEsWUFDQTtBQUFBLFlBQ0EsU0FBUyxPQUFPLFNBQVMsUUFBUTtBQUFBLFVBQ25DO0FBQUEsUUFDRjtBQUVBLGNBQU0sb0JBQW9CLE1BQU0sS0FBSyxxQkFBcUI7QUFBQSxVQUN4RDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRixDQUFDO0FBQ0QsY0FBTSxPQUFPLG9DQUNYLGtCQUFrQixLQUFLLENBQ3pCO0FBRUEsY0FBTSxVQUFVLGtCQUFrQixVQUFVLEVBQUUsU0FBUyxRQUFRO0FBRS9ELGVBQU87QUFBQSxVQUNMO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FDRjtBQUFBLElBQ0YsQ0FBQyxDQUNILEVBQ0csS0FBSyxPQUFPLGFBQWlDO0FBQzVDLFVBQUksY0FBYztBQUNoQixlQUFPLEtBQUssZ0JBQWdCLFlBQVksVUFBVSxLQUFLLFdBQVc7QUFBQSxVQUNoRTtBQUFBLFFBQ0YsQ0FBQyxFQUFFLEtBQ0QsTUFBTTtBQUNKLGVBQUssV0FBVyxjQUFjO0FBQzlCLGVBQUssdUJBQXVCLEtBQUssVUFBVTtBQUMzQyxlQUFLLHNCQUFzQixLQUFLLFVBQVU7QUFDMUMsZUFBSyxnQkFBZ0I7QUFFckIsY0FBSSxLQUFLLGlCQUFpQjtBQUN4QixpQkFBSyxnQkFBZ0I7QUFBQSxjQUNuQjtBQUFBLGNBQ0E7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNILFdBQVcsS0FBSyxzQkFBc0IsU0FBUyxHQUFHO0FBQ2hELGdCQUFJLEtBQ0YsMEVBQTBFLEtBQUssb0NBQ2pGO0FBQUEsVUFDRjtBQUFBLFFBQ0YsR0FDQSxPQUFPLFVBQWlCO0FBQ3RCLGNBQ0UsaUJBQWlCLDJCQUNoQixPQUFNLFNBQVMsT0FBTyxNQUFNLFNBQVMsTUFDdEM7QUFDQSxnQkFBSSxLQUFLLG9CQUFvQixRQUFRLFVBQVUsTUFBTSxJQUFJO0FBQ3ZELG1CQUFLLG9CQUFvQixLQUFLLFVBQVU7QUFBQSxZQUMxQztBQUdBLGdCQUFJLGNBQWM7QUFDaEIscUJBQU8sYUFBYTtBQUFBLFlBQ3RCO0FBRUEsbUJBQU8sS0FBSyxjQUFjLFlBQVksV0FBVyxPQUFPO0FBQUEsVUFDMUQ7QUFFQSxnQkFBTTtBQUFBLFFBQ1IsQ0FDRjtBQUFBLE1BQ0Y7QUFFQSxhQUFPLEtBQUssZ0JBQWdCLFlBQVksVUFBVSxLQUFLLFNBQVMsRUFBRSxLQUNoRSxNQUFNO0FBQ0osYUFBSyxzQkFBc0IsS0FBSyxVQUFVO0FBQzFDLGFBQUssV0FBVyxjQUFjO0FBQzlCLGFBQUssZ0JBQWdCO0FBRXJCLFlBQUksS0FBSyxpQkFBaUI7QUFDeEIsZUFBSyxnQkFBZ0I7QUFBQSxZQUNuQjtBQUFBLFlBQ0E7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNILFdBQVcsS0FBSyxzQkFBc0IsU0FBUyxHQUFHO0FBQ2hELGNBQUksS0FDRiwwRUFBMEUsS0FBSyxvQ0FDakY7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUNGO0FBQUEsSUFDRixDQUFDLEVBQ0EsTUFBTSxPQUFNLFVBQVM7QUFDcEIsVUFDRSxpQkFBaUIsMkJBQ2hCLE9BQU0sU0FBUyxPQUFPLE1BQU0sU0FBUyxNQUN0QztBQUNBLFlBQUksQ0FBQyxTQUFTO0FBQ1osZUFBSyxjQUNILFlBQ0Esb0RBQ0EsS0FDRjtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGNBQU0sV0FBVyxNQUFNO0FBS3ZCLFlBQUksSUFBa0IsUUFBUSxRQUFRO0FBQ3RDLFlBQUksTUFBTSxTQUFTLEtBQUs7QUFDdEIsY0FBSSxLQUFLLDZCQUNQLFlBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxDQUM1QjtBQUFBLFFBQ0YsT0FBTztBQUNMLGNBQUksUUFBUSxJQUNULFVBQVMsZ0JBQWdCLENBQUMsR0FBRyxJQUFJLE9BQU8sYUFBcUI7QUFDNUQsa0JBQU0sT0FBTyxXQUFXLFFBQVEsU0FBUyxlQUN2QyxJQUFJLHlDQUNGLFNBQ0EsSUFBSSx1QkFBUSxpQkFBSyxjQUFjLFVBQVUsR0FBRyxRQUFRLENBQ3RELENBQ0Y7QUFBQSxVQUNGLENBQUMsQ0FDSDtBQUFBLFFBQ0Y7QUFFQSxlQUFPLEVBQUUsS0FBSyxZQUFZO0FBQ3hCLGdCQUFNLGVBQ0osTUFBTSxTQUFTLE1BQ1gsU0FBUyxlQUNULFNBQVM7QUFDZixpQkFBTyxLQUFLLHFCQUFxQixZQUFZLFlBQVksRUFBRSxLQUd6RCxLQUFLLHFCQUFxQixZQUFZLE1BQU0sU0FBUyxHQUFHLENBQzFEO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUNBLFVBQUksT0FBTyxTQUFTLFNBQVMsZ0NBQWdDLEdBQUc7QUFDOUQsY0FBTSxZQUFZLEtBQUs7QUFDdkIsWUFBSSxNQUNGLCtFQUNBLFlBQ0EsU0FDRjtBQUVBLFlBQUksS0FBSyw0QkFBNEIsVUFBVTtBQUMvQyxlQUFPLFdBQVcsUUFBUSxTQUN2QixtQkFBbUIsaUJBQUssY0FBYyxVQUFVLENBQUMsRUFDakQsS0FDQyxNQUFNO0FBQ0osZ0JBQU07QUFBQSxRQUNSLEdBQ0EsZ0JBQWM7QUFDWixjQUFJLE1BQ0YsMENBQTBDLFdBQVcsT0FDdkQ7QUFDQSxnQkFBTTtBQUFBLFFBQ1IsQ0FDRjtBQUFBLE1BQ0o7QUFFQSxXQUFLLGNBQ0gsWUFDQSxvQ0FDQSxLQUNGO0FBRUEsYUFBTztBQUFBLElBQ1QsQ0FBQztBQUFBLEVBQ0w7QUFBQSxRQUVNLDZCQUNKLFlBQ0EsbUJBQ2U7QUFDZixVQUFNLFVBQVUsT0FBTyxXQUFXLFFBQVEsS0FBSyxlQUFlO0FBQzlELFVBQU0sWUFBWSxpQkFBSyxjQUFjLFVBQVU7QUFFL0MsVUFBTSxRQUFRLElBQ1osa0JBQWtCLElBQUksT0FBTSxhQUFZO0FBQ3RDLFlBQU0sT0FBTyxXQUFXLFFBQVEsU0FBUyxlQUN2QyxJQUFJLHlDQUFpQixTQUFTLElBQUksdUJBQVEsV0FBVyxRQUFRLENBQUMsQ0FDaEU7QUFBQSxJQUNGLENBQUMsQ0FDSDtBQUFBLEVBQ0Y7QUFBQSxRQUVNLGlCQUFpQixvQkFBMkM7QUFDaEUsUUFBSSxhQUFhO0FBQ2pCLFFBQUk7QUFDRixVQUFJLDZCQUFZLFVBQVUsR0FBRztBQUFBLE1BRTdCLFdBQVcsc0NBQWMsVUFBVSxHQUFHO0FBQ3BDLFlBQUksQ0FBQyxPQUFPLFdBQVcsV0FBVztBQUNoQyxnQkFBTSxJQUFJLE1BQ1IsaUVBQ0Y7QUFBQSxRQUNGO0FBRUEsWUFBSTtBQUNGLGdCQUFNLGdGQUFrQztBQUFBLFlBQ3RDLHdCQUF3QixPQUFPO0FBQUEsWUFDL0IsZUFBZTtBQUFBLGNBQ2IsT0FBTyx1QkFBdUIsWUFBWSxZQUFZLFNBQVM7QUFBQSxZQUNqRTtBQUFBLFlBQ0EsV0FBVyxPQUFPLFdBQVc7QUFBQSxVQUMvQixDQUFDO0FBRUQsZ0JBQU0sT0FDSixPQUFPLHVCQUF1QixJQUFJLFVBQVUsR0FBRyxJQUFJLE1BQU07QUFDM0QsY0FBSSxDQUFDLE1BQU07QUFDVCxrQkFBTSxJQUFJLG9DQUNSLFlBQ0EsSUFBSSx3QkFBVSwwQkFBMEI7QUFBQSxjQUN0QyxNQUFNO0FBQUEsY0FDTixTQUFTLENBQUM7QUFBQSxZQUNaLENBQUMsQ0FDSDtBQUFBLFVBQ0Y7QUFDQSx1QkFBYTtBQUFBLFFBQ2YsU0FBUyxPQUFQO0FBQ0EsY0FBSSxNQUNGLHlEQUF5RCxjQUN6RCxTQUFTLE1BQU0sUUFBUSxNQUFNLFFBQVEsS0FDdkM7QUFBQSxRQUNGO0FBQUEsTUFDRixPQUFPO0FBQ0wsY0FBTSxJQUFJLE1BQ1IsZ0NBQWdDLHVDQUNsQztBQUFBLE1BQ0Y7QUFFQSxZQUFNLFVBQVUsT0FBTyxXQUFXLFFBQVEsS0FBSyxlQUFlO0FBQzlELFlBQU0sWUFBWSxNQUFNLE9BQU8sV0FBVyxRQUFRLFNBQVMsYUFBYTtBQUFBLFFBQ3RFO0FBQUEsUUFDQTtBQUFBLE1BQ0YsQ0FBQztBQUNELFVBQUksVUFBVSxXQUFXLEdBQUc7QUFDMUIsY0FBTSxLQUFLLHFCQUFxQixVQUFVO0FBQUEsTUFDNUM7QUFDQSxZQUFNLEtBQUsscUJBQXFCLFlBQVksSUFBSSxFQUFFO0FBQUEsSUFDcEQsU0FBUyxPQUFQO0FBQ0EsVUFBSSxPQUFPLFNBQVMsU0FBUyxnQ0FBZ0MsR0FBRztBQUM5RCxjQUFNLFdBQVcsSUFBSSx1Q0FBeUIsVUFBVTtBQUN4RCxhQUFLLGNBQWMsWUFBWSxzQkFBc0IsUUFBUTtBQUFBLE1BQy9ELE9BQU87QUFDTCxhQUFLLGNBQ0gsWUFDQSxxREFBcUQsY0FDckQsS0FDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBbG5CQSIsCiAgIm5hbWVzIjogW10KfQo=
