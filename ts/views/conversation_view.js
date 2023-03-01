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
var conversation_view_exports = {};
__export(conversation_view_exports, {
  ConversationView: () => ConversationView
});
module.exports = __toCommonJS(conversation_view_exports);
var React = __toESM(require("react"));
var import_lodash = require("lodash");
var import_mustache = require("mustache");
var import_Attachment = require("../types/Attachment");
var Stickers = __toESM(require("../types/Stickers"));
var import_getMessageById = require("../messages/getMessageById");
var import_helpers = require("../messages/helpers");
var import_assert = require("../util/assert");
var import_enqueueReactionForSend = require("../reactions/enqueueReactionForSend");
var import_addReportSpamJob = require("../jobs/helpers/addReportSpamJob");
var import_reportSpamJobQueue = require("../jobs/reportSpamJobQueue");
var import_whatTypeOfConversation = require("../util/whatTypeOfConversation");
var import_findAndFormatContact = require("../util/findAndFormatContact");
var import_badges = require("../state/selectors/badges");
var import_message = require("../state/selectors/message");
var import_conversations = require("../state/selectors/conversations");
var import_calling = require("../state/selectors/calling");
var import_user = require("../state/selectors/user");
var import_ReactWrapperView = require("./ReactWrapperView");
var import_ConversationDetailsMembershipList = require("../components/conversation/conversation-details/ConversationDetailsMembershipList");
var import_showSafetyNumberChangeDialog = require("../shims/showSafetyNumberChangeDialog");
var log = __toESM(require("../logging/log"));
var import_createConversationView = require("../state/roots/createConversationView");
var import_AttachmentToastType = require("../types/AttachmentToastType");
var import_MessageReadStatus = require("../messages/MessageReadStatus");
var import_protobuf = require("../protobuf");
var import_ToastBlocked = require("../components/ToastBlocked");
var import_ToastBlockedGroup = require("../components/ToastBlockedGroup");
var import_ToastCannotMixImageAndNonImageAttachments = require("../components/ToastCannotMixImageAndNonImageAttachments");
var import_ToastCannotStartGroupCall = require("../components/ToastCannotStartGroupCall");
var import_ToastConversationArchived = require("../components/ToastConversationArchived");
var import_ToastConversationMarkedUnread = require("../components/ToastConversationMarkedUnread");
var import_ToastConversationUnarchived = require("../components/ToastConversationUnarchived");
var import_ToastDangerousFileType = require("../components/ToastDangerousFileType");
var import_ToastDeleteForEveryoneFailed = require("../components/ToastDeleteForEveryoneFailed");
var import_ToastExpired = require("../components/ToastExpired");
var import_ToastFileSize = require("../components/ToastFileSize");
var import_ToastInvalidConversation = require("../components/ToastInvalidConversation");
var import_ToastLeftGroup = require("../components/ToastLeftGroup");
var import_ToastMaxAttachments = require("../components/ToastMaxAttachments");
var import_ToastMessageBodyTooLong = require("../components/ToastMessageBodyTooLong");
var import_ToastOneNonImageAtATime = require("../components/ToastOneNonImageAtATime");
var import_ToastOriginalMessageNotFound = require("../components/ToastOriginalMessageNotFound");
var import_ToastPinnedConversationsFull = require("../components/ToastPinnedConversationsFull");
var import_ToastReactionFailed = require("../components/ToastReactionFailed");
var import_ToastReportedSpamAndBlocked = require("../components/ToastReportedSpamAndBlocked");
var import_ToastTapToViewExpiredIncoming = require("../components/ToastTapToViewExpiredIncoming");
var import_ToastTapToViewExpiredOutgoing = require("../components/ToastTapToViewExpiredOutgoing");
var import_ToastUnableToLoadAttachment = require("../components/ToastUnableToLoadAttachment");
var import_ToastCannotOpenGiftBadge = require("../components/ToastCannotOpenGiftBadge");
var import_deleteDraftAttachment = require("../util/deleteDraftAttachment");
var import_markAllAsApproved = require("../util/markAllAsApproved");
var import_markAllAsVerifiedDefault = require("../util/markAllAsVerifiedDefault");
var import_retryMessageSend = require("../util/retryMessageSend");
var import_isNotNil = require("../util/isNotNil");
var import_MessageUpdater = require("../services/MessageUpdater");
var import_openLinkInWebBrowser = require("../util/openLinkInWebBrowser");
var import_resolveAttachmentDraftData = require("../util/resolveAttachmentDraftData");
var import_showToast = require("../util/showToast");
var import_viewSyncJobQueue = require("../jobs/viewSyncJobQueue");
var import_viewedReceiptsJobQueue = require("../jobs/viewedReceiptsJobQueue");
var import_audioRecorder = require("../state/ducks/audioRecorder");
var import_UUID = require("../types/UUID");
var import_retryDeleteForEveryone = require("../util/retryDeleteForEveryone");
var import_ContactDetail = require("../components/conversation/ContactDetail");
var import_MediaGallery = require("../components/conversation/media-gallery/MediaGallery");
var import_LinkPreview = require("../services/LinkPreview");
var import_LinkPreview2 = require("../types/LinkPreview");
var import_showLightbox = require("../util/showLightbox");
var import_saveAttachment = require("../util/saveAttachment");
var import_sendDeleteForEveryoneMessage = require("../util/sendDeleteForEveryoneMessage");
var import_durations = require("../util/durations");
const FIVE_MINUTES = 1e3 * 60 * 5;
const { Message } = window.Signal.Types;
const {
  copyIntoTempDirectory,
  deleteTempFile,
  getAbsoluteAttachmentPath,
  getAbsoluteTempPath,
  upgradeMessageSchema
} = window.Signal.Migrations;
const { getMessagesBySentAt } = window.Signal.Data;
const MAX_MESSAGE_BODY_LENGTH = 64 * 1024;
class ConversationView extends window.Backbone.View {
  constructor(...args) {
    super(...args);
    this.compositionApi = { current: void 0 };
    this.panels = [];
    this.lazyUpdateVerified = (0, import_lodash.debounce)(this.model.updateVerified.bind(this.model), 1e3);
    this.model.throttledGetProfiles = this.model.throttledGetProfiles || (0, import_lodash.throttle)(this.model.getProfiles.bind(this.model), FIVE_MINUTES);
    this.debouncedSaveDraft = (0, import_lodash.debounce)(this.saveDraft.bind(this), 200);
    this.listenTo(this.model, "destroy", this.stopListening);
    this.listenTo(this.model, "newmessage", this.lazyUpdateVerified);
    this.listenTo(this.model, "opened", this.onOpened);
    this.listenTo(this.model, "scroll-to-message", this.scrollToMessage);
    this.listenTo(this.model, "unload", (reason) => this.unload(`model trigger - ${reason}`));
    this.listenTo(this.model, "focus-composer", this.focusMessageField);
    this.listenTo(this.model, "open-all-media", this.showAllMedia);
    this.listenTo(this.model, "escape-pressed", this.resetPanel);
    this.listenTo(this.model, "show-message-details", this.showMessageDetail);
    this.listenTo(this.model, "show-contact-modal", this.showContactModal);
    this.listenTo(this.model, "toggle-reply", (messageId) => {
      const target = this.quote || !messageId ? null : messageId;
      this.setQuoteMessage(target);
    });
    this.listenTo(this.model, "save-attachment", this.downloadAttachmentWrapper);
    this.listenTo(this.model, "delete-message", this.deleteMessage);
    this.listenTo(this.model, "remove-link-review", import_LinkPreview.removeLinkPreview);
    this.listenTo(this.model, "remove-all-draft-attachments", this.clearAttachments);
    this.render();
    this.setupConversationView();
    this.updateAttachmentsView();
  }
  events() {
    return {
      drop: "onDrop",
      paste: "onPaste"
    };
  }
  className() {
    return "conversation";
  }
  id() {
    return `conversation-${this.model.cid}`;
  }
  render() {
    const template = $("#conversation").html();
    this.$el.html((0, import_mustache.render)(template, {}));
    return this;
  }
  setMuteExpiration(ms = 0) {
    this.model.setMuteExpiration(ms >= Number.MAX_SAFE_INTEGER ? ms : Date.now() + ms);
  }
  setPin(value) {
    if (value) {
      const pinnedConversationIds = window.storage.get("pinnedConversationIds", new Array());
      if (pinnedConversationIds.length >= 4) {
        (0, import_showToast.showToast)(import_ToastPinnedConversationsFull.ToastPinnedConversationsFull);
        return;
      }
      this.model.pin();
    } else {
      this.model.unpin();
    }
  }
  setupConversationView() {
    const conversationHeaderProps = {
      id: this.model.id,
      onSetDisappearingMessages: (seconds) => this.setDisappearingMessages(seconds),
      onDeleteMessages: () => this.destroyMessages(),
      onSearchInConversation: () => {
        const { searchInConversation } = window.reduxActions.search;
        searchInConversation(this.model.id);
      },
      onSetMuteNotifications: this.setMuteExpiration.bind(this),
      onSetPin: this.setPin.bind(this),
      onOutgoingAudioCallInConversation: this.onOutgoingAudioCallInConversation.bind(this),
      onOutgoingVideoCallInConversation: this.onOutgoingVideoCallInConversation.bind(this),
      onShowConversationDetails: () => {
        this.showConversationDetails();
      },
      onShowAllMedia: () => {
        this.showAllMedia();
      },
      onShowGroupMembers: () => {
        this.showGV1Members();
      },
      onGoBack: () => {
        this.resetPanel();
      },
      onArchive: () => {
        this.model.setArchived(true);
        this.model.trigger("unload", "archive");
        (0, import_showToast.showToast)(import_ToastConversationArchived.ToastConversationArchived, {
          undo: () => {
            this.model.setArchived(false);
            this.openConversation(this.model.get("id"));
          }
        });
      },
      onMarkUnread: () => {
        this.model.setMarkedUnread(true);
        (0, import_showToast.showToast)(import_ToastConversationMarkedUnread.ToastConversationMarkedUnread);
      },
      onMoveToInbox: () => {
        this.model.setArchived(false);
        (0, import_showToast.showToast)(import_ToastConversationUnarchived.ToastConversationUnarchived);
      }
    };
    window.reduxActions.conversations.setSelectedConversationHeaderTitle();
    const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
    const contactSupport = /* @__PURE__ */ __name(() => {
      const baseUrl = "https://support.signal.org/hc/LOCALE/requests/new?desktop&chat_refreshed";
      const locale = window.getLocale();
      const supportLocale = window.Signal.Util.mapToSupportLocale(locale);
      const url = baseUrl.replace("LOCALE", supportLocale);
      (0, import_openLinkInWebBrowser.openLinkInWebBrowser)(url);
    }, "contactSupport");
    const learnMoreAboutDeliveryIssue = /* @__PURE__ */ __name(() => {
      (0, import_openLinkInWebBrowser.openLinkInWebBrowser)("https://support.signal.org/hc/articles/4404859745690");
    }, "learnMoreAboutDeliveryIssue");
    const scrollToQuotedMessage = /* @__PURE__ */ __name(async (options) => {
      const { authorId, sentAt } = options;
      const conversationId = this.model.id;
      const messages = await getMessagesBySentAt(sentAt);
      const message = messages.find((item) => Boolean(item.conversationId === conversationId && authorId && (0, import_helpers.getContactId)(item) === authorId));
      if (!message) {
        (0, import_showToast.showToast)(import_ToastOriginalMessageNotFound.ToastOriginalMessageNotFound);
        return;
      }
      this.scrollToMessage(message.id);
    }, "scrollToQuotedMessage");
    const markMessageRead = /* @__PURE__ */ __name(async (messageId) => {
      if (!window.SignalContext.activeWindowService.isActive()) {
        return;
      }
      const activeCall = (0, import_calling.getActiveCallState)(window.reduxStore.getState());
      if (activeCall && !activeCall.pip) {
        return;
      }
      const message = await (0, import_getMessageById.getMessageById)(messageId);
      if (!message) {
        throw new Error(`markMessageRead: failed to load message ${messageId}`);
      }
      await this.model.markRead(message.get("received_at"), {
        newestSentAt: message.get("sent_at"),
        sendReadReceipts: true
      });
    }, "markMessageRead");
    const createMessageRequestResponseHandler = /* @__PURE__ */ __name((name, enumValue) => (conversationId) => {
      const conversation = window.ConversationController.get(conversationId);
      if (!conversation) {
        log.error(`createMessageRequestResponseHandler: Expected a conversation to be found in ${name}. Doing nothing`);
        return;
      }
      this.syncMessageRequestResponse(name, conversation, enumValue);
    }, "createMessageRequestResponseHandler");
    const timelineProps = {
      id: this.model.id,
      ...this.getMessageActions(),
      acknowledgeGroupMemberNameCollisions: (groupNameCollisions) => {
        this.model.acknowledgeGroupMemberNameCollisions(groupNameCollisions);
      },
      blockGroupLinkRequests: (uuid) => {
        this.model.blockGroupLinkRequests(uuid);
      },
      contactSupport,
      learnMoreAboutDeliveryIssue,
      loadNewerMessages: this.model.loadNewerMessages.bind(this.model),
      loadNewestMessages: this.model.loadNewestMessages.bind(this.model),
      loadOlderMessages: this.model.loadOlderMessages.bind(this.model),
      markMessageRead,
      onBlock: createMessageRequestResponseHandler("onBlock", messageRequestEnum.BLOCK),
      onBlockAndReportSpam: (conversationId) => {
        const conversation = window.ConversationController.get(conversationId);
        if (!conversation) {
          log.error(`onBlockAndReportSpam: Expected a conversation to be found for ${conversationId}. Doing nothing.`);
          return;
        }
        this.blockAndReportSpam(conversation);
      },
      onDelete: createMessageRequestResponseHandler("onDelete", messageRequestEnum.DELETE),
      onUnblock: createMessageRequestResponseHandler("onUnblock", messageRequestEnum.ACCEPT),
      removeMember: (conversationId) => {
        this.longRunningTaskWrapper({
          name: "removeMember",
          task: () => this.model.removeFromGroupV2(conversationId)
        });
      },
      scrollToQuotedMessage,
      unblurAvatar: () => {
        this.model.unblurAvatar();
      },
      updateSharedGroups: () => this.model.throttledUpdateSharedGroups?.()
    };
    window.reduxActions.composer.resetComposer();
    const compositionAreaProps = {
      id: this.model.id,
      compositionApi: this.compositionApi,
      onClickAddPack: () => this.showStickerManager(),
      onPickSticker: (packId, stickerId) => this.sendStickerMessage({ packId, stickerId }),
      onEditorStateChange: (msg, bodyRanges, caretLocation) => this.onEditorStateChange(msg, bodyRanges, caretLocation),
      onTextTooLong: () => (0, import_showToast.showToast)(import_ToastMessageBodyTooLong.ToastMessageBodyTooLong),
      getQuotedMessage: () => this.model.get("quotedMessageId"),
      clearQuotedMessage: () => this.setQuoteMessage(null),
      onAccept: () => {
        this.syncMessageRequestResponse("onAccept", this.model, messageRequestEnum.ACCEPT);
      },
      onBlock: () => {
        this.syncMessageRequestResponse("onBlock", this.model, messageRequestEnum.BLOCK);
      },
      onUnblock: () => {
        this.syncMessageRequestResponse("onUnblock", this.model, messageRequestEnum.ACCEPT);
      },
      onDelete: () => {
        this.syncMessageRequestResponse("onDelete", this.model, messageRequestEnum.DELETE);
      },
      onBlockAndReportSpam: () => {
        this.blockAndReportSpam(this.model);
      },
      onStartGroupMigration: () => this.startMigrationToGV2(),
      onCancelJoinRequest: async () => {
        await window.showConfirmationDialog({
          message: window.i18n("GroupV2--join--cancel-request-to-join--confirmation"),
          okText: window.i18n("GroupV2--join--cancel-request-to-join--yes"),
          cancelText: window.i18n("GroupV2--join--cancel-request-to-join--no"),
          resolve: () => {
            this.longRunningTaskWrapper({
              name: "onCancelJoinRequest",
              task: async () => this.model.cancelJoinRequest()
            });
          }
        });
      },
      onClearAttachments: this.clearAttachments.bind(this),
      onSelectMediaQuality: (isHQ) => {
        window.reduxActions.composer.setMediaQualitySetting(isHQ);
      },
      handleClickQuotedMessage: (id) => this.scrollToMessage(id),
      onCloseLinkPreview: () => {
        (0, import_LinkPreview.suspendLinkPreviews)();
        (0, import_LinkPreview.removeLinkPreview)();
      },
      openConversation: this.openConversation.bind(this),
      onSendMessage: ({
        draftAttachments,
        mentions = [],
        message = "",
        timestamp,
        voiceNoteAttachment
      }) => {
        this.sendMessage(message, mentions, {
          draftAttachments,
          timestamp,
          voiceNoteAttachment
        });
      }
    };
    const JSX = (0, import_createConversationView.createConversationView)(window.reduxStore, {
      compositionAreaProps,
      conversationHeaderProps,
      timelineProps
    });
    this.conversationView = new import_ReactWrapperView.ReactWrapperView({ JSX });
    this.$(".ConversationView__template").append(this.conversationView.el);
  }
  async onOutgoingVideoCallInConversation() {
    log.info("onOutgoingVideoCallInConversation: about to start a video call");
    if (this.model.get("announcementsOnly") && !this.model.areWeAdmin()) {
      (0, import_showToast.showToast)(import_ToastCannotStartGroupCall.ToastCannotStartGroupCall);
      return;
    }
    if (await this.isCallSafe()) {
      log.info('onOutgoingVideoCallInConversation: call is deemed "safe". Making call');
      window.reduxActions.calling.startCallingLobby({
        conversationId: this.model.id,
        isVideoCall: true
      });
      log.info("onOutgoingVideoCallInConversation: started the call");
    } else {
      log.info('onOutgoingVideoCallInConversation: call is deemed "unsafe". Stopping');
    }
  }
  async onOutgoingAudioCallInConversation() {
    log.info("onOutgoingAudioCallInConversation: about to start an audio call");
    if (await this.isCallSafe()) {
      log.info('onOutgoingAudioCallInConversation: call is deemed "safe". Making call');
      window.reduxActions.calling.startCallingLobby({
        conversationId: this.model.id,
        isVideoCall: false
      });
      log.info("onOutgoingAudioCallInConversation: started the call");
    } else {
      log.info('onOutgoingAudioCallInConversation: call is deemed "unsafe". Stopping');
    }
  }
  async longRunningTaskWrapper({
    name,
    task
  }) {
    const idForLogging = this.model.idForLogging();
    return window.Signal.Util.longRunningTaskWrapper({
      name,
      idForLogging,
      task
    });
  }
  getMessageActions() {
    const reactToMessage = /* @__PURE__ */ __name(async (messageId, reaction) => {
      const { emoji, remove } = reaction;
      try {
        await (0, import_enqueueReactionForSend.enqueueReactionForSend)({
          messageId,
          emoji,
          remove
        });
      } catch (error) {
        log.error("Error sending reaction", error, messageId, reaction);
        (0, import_showToast.showToast)(import_ToastReactionFailed.ToastReactionFailed);
      }
    }, "reactToMessage");
    const replyToMessage = /* @__PURE__ */ __name((messageId) => {
      this.setQuoteMessage(messageId);
    }, "replyToMessage");
    const retrySend = import_retryMessageSend.retryMessageSend;
    const deleteMessage = /* @__PURE__ */ __name((messageId) => {
      this.deleteMessage(messageId);
    }, "deleteMessage");
    const deleteMessageForEveryone = /* @__PURE__ */ __name((messageId) => {
      this.deleteMessageForEveryone(messageId);
    }, "deleteMessageForEveryone");
    const showMessageDetail = /* @__PURE__ */ __name((messageId) => {
      this.showMessageDetail(messageId);
    }, "showMessageDetail");
    const showContactModal = /* @__PURE__ */ __name((contactId) => {
      this.showContactModal(contactId);
    }, "showContactModal");
    const openConversation = /* @__PURE__ */ __name((conversationId, messageId) => {
      this.openConversation(conversationId, messageId);
    }, "openConversation");
    const showContactDetail = /* @__PURE__ */ __name((options) => {
      this.showContactDetail(options);
    }, "showContactDetail");
    const kickOffAttachmentDownload = /* @__PURE__ */ __name(async (options) => {
      const message = window.MessageController.getById(options.messageId);
      if (!message) {
        throw new Error(`kickOffAttachmentDownload: Message ${options.messageId} missing!`);
      }
      await message.queueAttachmentDownloads();
    }, "kickOffAttachmentDownload");
    const markAttachmentAsCorrupted = /* @__PURE__ */ __name((options) => {
      const message = window.MessageController.getById(options.messageId);
      if (!message) {
        throw new Error(`markAttachmentAsCorrupted: Message ${options.messageId} missing!`);
      }
      message.markAttachmentAsCorrupted(options.attachment);
    }, "markAttachmentAsCorrupted");
    const onMarkViewed = /* @__PURE__ */ __name((messageId) => {
      const message = window.MessageController.getById(messageId);
      if (!message) {
        throw new Error(`onMarkViewed: Message ${messageId} missing!`);
      }
      if (message.get("readStatus") === import_MessageReadStatus.ReadStatus.Viewed) {
        return;
      }
      const senderE164 = message.get("source");
      const senderUuid = message.get("sourceUuid");
      const timestamp = message.get("sent_at");
      message.set((0, import_MessageUpdater.markViewed)(message.attributes, Date.now()));
      if ((0, import_message.isIncoming)(message.attributes)) {
        import_viewedReceiptsJobQueue.viewedReceiptsJobQueue.add({
          viewedReceipt: {
            messageId,
            senderE164,
            senderUuid,
            timestamp
          }
        });
      }
      import_viewSyncJobQueue.viewSyncJobQueue.add({
        viewSyncs: [
          {
            messageId,
            senderE164,
            senderUuid,
            timestamp
          }
        ]
      });
    }, "onMarkViewed");
    const showVisualAttachment = /* @__PURE__ */ __name((options) => {
      this.showLightbox(options);
    }, "showVisualAttachment");
    const downloadAttachment = /* @__PURE__ */ __name((options) => {
      this.downloadAttachment(options);
    }, "downloadAttachment");
    const displayTapToViewMessage = /* @__PURE__ */ __name((messageId) => this.displayTapToViewMessage(messageId), "displayTapToViewMessage");
    const showIdentity = /* @__PURE__ */ __name((conversationId) => {
      this.showSafetyNumber(conversationId);
    }, "showIdentity");
    const openGiftBadge = /* @__PURE__ */ __name((messageId) => {
      const message = window.MessageController.getById(messageId);
      if (!message) {
        throw new Error(`openGiftBadge: Message ${messageId} missing!`);
      }
      (0, import_showToast.showToast)(import_ToastCannotOpenGiftBadge.ToastCannotOpenGiftBadge, {
        isIncoming: (0, import_message.isIncoming)(message.attributes)
      });
    }, "openGiftBadge");
    const openLink = import_openLinkInWebBrowser.openLinkInWebBrowser;
    const downloadNewVersion = /* @__PURE__ */ __name(() => {
      (0, import_openLinkInWebBrowser.openLinkInWebBrowser)("https://signal.org/download");
    }, "downloadNewVersion");
    const showSafetyNumber = /* @__PURE__ */ __name((contactId) => {
      this.showSafetyNumber(contactId);
    }, "showSafetyNumber");
    const showExpiredIncomingTapToViewToast = /* @__PURE__ */ __name(() => {
      log.info("Showing expired tap-to-view toast for an incoming message");
      (0, import_showToast.showToast)(import_ToastTapToViewExpiredIncoming.ToastTapToViewExpiredIncoming);
    }, "showExpiredIncomingTapToViewToast");
    const showExpiredOutgoingTapToViewToast = /* @__PURE__ */ __name(() => {
      log.info("Showing expired tap-to-view toast for an outgoing message");
      (0, import_showToast.showToast)(import_ToastTapToViewExpiredOutgoing.ToastTapToViewExpiredOutgoing);
    }, "showExpiredOutgoingTapToViewToast");
    const showForwardMessageModal = this.showForwardMessageModal.bind(this);
    const startConversation = this.startConversation.bind(this);
    return {
      deleteMessage,
      deleteMessageForEveryone,
      displayTapToViewMessage,
      downloadAttachment,
      downloadNewVersion,
      kickOffAttachmentDownload,
      markAttachmentAsCorrupted,
      markViewed: onMarkViewed,
      openConversation,
      openGiftBadge,
      openLink,
      reactToMessage,
      replyToMessage,
      retrySend,
      retryDeleteForEveryone: import_retryDeleteForEveryone.retryDeleteForEveryone,
      showContactDetail,
      showContactModal,
      showSafetyNumber,
      showExpiredIncomingTapToViewToast,
      showExpiredOutgoingTapToViewToast,
      showForwardMessageModal,
      showIdentity,
      showMessageDetail,
      showVisualAttachment,
      startConversation
    };
  }
  async scrollToMessage(messageId) {
    const message = await (0, import_getMessageById.getMessageById)(messageId);
    if (!message) {
      throw new Error(`scrollToMessage: failed to load message ${messageId}`);
    }
    const state = window.reduxStore.getState();
    let isInMemory = true;
    if (!window.MessageController.getById(messageId)) {
      isInMemory = false;
    }
    const messagesByConversation = (0, import_conversations.getMessagesByConversation)(state)[this.model.id];
    if (!messagesByConversation?.messageIds.includes(messageId)) {
      isInMemory = false;
    }
    if (isInMemory) {
      const { scrollToMessage } = window.reduxActions.conversations;
      scrollToMessage(this.model.id, messageId);
      return;
    }
    this.model.loadAndScroll(messageId);
  }
  async startMigrationToGV2() {
    const logId = this.model.idForLogging();
    if (!(0, import_whatTypeOfConversation.isGroupV1)(this.model.attributes)) {
      throw new Error(`startMigrationToGV2/${logId}: Cannot start, not a GroupV1 group`);
    }
    const onClose = /* @__PURE__ */ __name(() => {
      if (this.migrationDialog) {
        this.migrationDialog.remove();
        this.migrationDialog = void 0;
      }
    }, "onClose");
    onClose();
    const migrate = /* @__PURE__ */ __name(() => {
      onClose();
      this.longRunningTaskWrapper({
        name: "initiateMigrationToGroupV2",
        task: () => window.Signal.Groups.initiateMigrationToGroupV2(this.model)
      });
    }, "migrate");
    const { droppedGV2MemberIds, pendingMembersV2 } = await this.longRunningTaskWrapper({
      name: "getGroupMigrationMembers",
      task: () => window.Signal.Groups.getGroupMigrationMembers(this.model)
    });
    const invitedMemberIds = pendingMembersV2.map((item) => item.uuid);
    this.migrationDialog = new import_ReactWrapperView.ReactWrapperView({
      className: "group-v1-migration-wrapper",
      JSX: window.Signal.State.Roots.createGroupV1MigrationModal(window.reduxStore, {
        areWeInvited: false,
        droppedMemberIds: droppedGV2MemberIds,
        hasMigrated: false,
        invitedMemberIds,
        migrate,
        onClose
      })
    });
  }
  async processAttachments(files) {
    const state = window.reduxStore.getState();
    const isRecording = state.audioRecorder.recordingState === import_audioRecorder.RecordingState.Recording;
    if ((0, import_LinkPreview.hasLinkPreviewLoaded)() || isRecording) {
      return;
    }
    const {
      addAttachment,
      addPendingAttachment,
      processAttachments,
      removeAttachment
    } = window.reduxActions.composer;
    await processAttachments({
      addAttachment,
      addPendingAttachment,
      conversationId: this.model.id,
      draftAttachments: this.model.get("draftAttachments") || [],
      files,
      onShowToast: (toastType) => {
        if (toastType === import_AttachmentToastType.AttachmentToastType.ToastFileSize) {
          (0, import_showToast.showToast)(import_ToastFileSize.ToastFileSize, {
            limit: 100,
            units: "MB"
          });
        } else if (toastType === import_AttachmentToastType.AttachmentToastType.ToastDangerousFileType) {
          (0, import_showToast.showToast)(import_ToastDangerousFileType.ToastDangerousFileType);
        } else if (toastType === import_AttachmentToastType.AttachmentToastType.ToastMaxAttachments) {
          (0, import_showToast.showToast)(import_ToastMaxAttachments.ToastMaxAttachments);
        } else if (toastType === import_AttachmentToastType.AttachmentToastType.ToastOneNonImageAtATime) {
          (0, import_showToast.showToast)(import_ToastOneNonImageAtATime.ToastOneNonImageAtATime);
        } else if (toastType === import_AttachmentToastType.AttachmentToastType.ToastCannotMixImageAndNonImageAttachments) {
          (0, import_showToast.showToast)(import_ToastCannotMixImageAndNonImageAttachments.ToastCannotMixImageAndNonImageAttachments);
        } else if (toastType === import_AttachmentToastType.AttachmentToastType.ToastUnableToLoadAttachment) {
          (0, import_showToast.showToast)(import_ToastUnableToLoadAttachment.ToastUnableToLoadAttachment);
        }
      },
      removeAttachment
    });
  }
  unload(reason) {
    log.info("unloading conversation", this.model.idForLogging(), "due to:", reason);
    const { conversationUnloaded } = window.reduxActions.conversations;
    if (conversationUnloaded) {
      conversationUnloaded(this.model.id);
    }
    if (this.model.get("draftChanged")) {
      if (this.model.hasDraft()) {
        const now = Date.now();
        const active_at = this.model.get("active_at") || now;
        this.model.set({
          active_at,
          draftChanged: false,
          draftTimestamp: now,
          timestamp: now
        });
      } else {
        this.model.set({
          draftChanged: false,
          draftTimestamp: null
        });
      }
      this.saveModel();
      this.model.updateLastMessage();
    }
    this.conversationView?.remove();
    if (this.contactModalView) {
      this.contactModalView.remove();
    }
    if (this.stickerPreviewModalView) {
      this.stickerPreviewModalView.remove();
    }
    if (this.lightboxView) {
      this.lightboxView.remove();
    }
    if (this.panels && this.panels.length) {
      for (let i = 0, max = this.panels.length; i < max; i += 1) {
        const panel = this.panels[i];
        panel.view.remove();
      }
      window.reduxActions.conversations.setSelectedConversationPanelDepth(0);
    }
    (0, import_LinkPreview.removeLinkPreview)();
    (0, import_LinkPreview.suspendLinkPreviews)();
    this.remove();
  }
  async onDrop(e) {
    if (!e.originalEvent) {
      return;
    }
    const event = e.originalEvent;
    if (!event.dataTransfer) {
      return;
    }
    if (event.dataTransfer.types[0] !== "Files") {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const { files } = event.dataTransfer;
    this.processAttachments(Array.from(files));
  }
  onPaste(e) {
    if (!e.originalEvent) {
      return;
    }
    const event = e.originalEvent;
    if (!event.clipboardData) {
      return;
    }
    const { items } = event.clipboardData;
    const anyImages = [...items].some((item) => item.type.split("/")[0] === "image");
    if (!anyImages) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const files = [];
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].type.split("/")[0] === "image") {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    this.processAttachments(files);
  }
  syncMessageRequestResponse(name, model, messageRequestType) {
    return this.longRunningTaskWrapper({
      name,
      task: model.syncMessageRequestResponse.bind(model, messageRequestType)
    });
  }
  blockAndReportSpam(model) {
    const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
    return this.longRunningTaskWrapper({
      name: "blockAndReportSpam",
      task: async () => {
        await Promise.all([
          model.syncMessageRequestResponse(messageRequestEnum.BLOCK),
          (0, import_addReportSpamJob.addReportSpamJob)({
            conversation: model.format(),
            getMessageServerGuidsForSpam: window.Signal.Data.getMessageServerGuidsForSpam,
            jobQueue: import_reportSpamJobQueue.reportSpamJobQueue
          })
        ]);
        (0, import_showToast.showToast)(import_ToastReportedSpamAndBlocked.ToastReportedSpamAndBlocked);
      }
    });
  }
  async saveModel() {
    window.Signal.Data.updateConversation(this.model.attributes);
  }
  async clearAttachments() {
    const draftAttachments = this.model.get("draftAttachments") || [];
    this.model.set({
      draftAttachments: [],
      draftChanged: true
    });
    this.updateAttachmentsView();
    await Promise.all([
      this.saveModel(),
      Promise.all(draftAttachments.map((attachment) => (0, import_deleteDraftAttachment.deleteDraftAttachment)(attachment)))
    ]);
  }
  hasFiles(options) {
    const draftAttachments = this.model.get("draftAttachments") || [];
    if (options.includePending) {
      return draftAttachments.length > 0;
    }
    return draftAttachments.some((item) => !item.pending);
  }
  updateAttachmentsView() {
    const draftAttachments = this.model.get("draftAttachments") || [];
    window.reduxActions.composer.replaceAttachments(this.model.get("id"), draftAttachments);
    if (this.hasFiles({ includePending: true })) {
      (0, import_LinkPreview.removeLinkPreview)();
    }
  }
  async onOpened(messageId) {
    this.model.onOpenStart();
    if (messageId) {
      const message = await (0, import_getMessageById.getMessageById)(messageId);
      if (message) {
        this.model.loadAndScroll(messageId);
        return;
      }
      log.warn(`onOpened: Did not find message ${messageId}`);
    }
    const { retryPlaceholders } = window.Signal.Services;
    if (retryPlaceholders) {
      await retryPlaceholders.findByConversationAndMarkOpened(this.model.id);
    }
    const loadAndUpdate = /* @__PURE__ */ __name(async () => {
      Promise.all([
        this.model.loadNewestMessages(void 0, void 0),
        this.model.updateLastMessage(),
        this.model.updateUnread()
      ]);
    }, "loadAndUpdate");
    loadAndUpdate();
    this.focusMessageField();
    const quotedMessageId = this.model.get("quotedMessageId");
    if (quotedMessageId) {
      this.setQuoteMessage(quotedMessageId);
    }
    this.model.fetchLatestGroupV2Data();
    (0, import_assert.strictAssert)(this.model.throttledMaybeMigrateV1Group !== void 0, "Conversation model should be initialized");
    this.model.throttledMaybeMigrateV1Group();
    (0, import_assert.strictAssert)(this.model.throttledFetchSMSOnlyUUID !== void 0, "Conversation model should be initialized");
    this.model.throttledFetchSMSOnlyUUID();
    const ourUuid = window.textsecure.storage.user.getUuid(import_UUID.UUIDKind.ACI);
    if (!(0, import_whatTypeOfConversation.isGroup)(this.model.attributes) || ourUuid && this.model.hasMember(ourUuid)) {
      (0, import_assert.strictAssert)(this.model.throttledGetProfiles !== void 0, "Conversation model should be initialized");
      await this.model.throttledGetProfiles();
    }
    this.model.updateVerified();
  }
  async showForwardMessageModal(messageId) {
    window.reduxActions.globalModals.toggleForwardMessageModal(messageId);
  }
  showAllMedia() {
    if (document.querySelectorAll(".module-media-gallery").length) {
      return;
    }
    const DEFAULT_MEDIA_FETCH_COUNT = 50;
    const DEFAULT_DOCUMENTS_FETCH_COUNT = 150;
    const conversationId = this.model.get("id");
    const ourUuid = window.textsecure.storage.user.getCheckedUuid().toString();
    const getProps = /* @__PURE__ */ __name(async () => {
      const rawMedia = await window.Signal.Data.getMessagesWithVisualMediaAttachments(conversationId, {
        limit: DEFAULT_MEDIA_FETCH_COUNT
      });
      const rawDocuments = await window.Signal.Data.getMessagesWithFileAttachments(conversationId, {
        limit: DEFAULT_DOCUMENTS_FETCH_COUNT
      });
      for (let max = rawMedia.length, i = 0; i < max; i += 1) {
        const message = rawMedia[i];
        const { schemaVersion } = message;
        if (schemaVersion && schemaVersion < Message.VERSION_NEEDED_FOR_DISPLAY) {
          rawMedia[i] = await upgradeMessageSchema(message);
          await window.Signal.Data.saveMessage(rawMedia[i], { ourUuid });
        }
      }
      const media = (0, import_lodash.flatten)(rawMedia.map((message) => {
        return (message.attachments || []).map((attachment, index) => {
          if (!attachment.path || !attachment.thumbnail || attachment.pending || attachment.error) {
            return;
          }
          const { thumbnail } = attachment;
          return {
            path: attachment.path,
            objectURL: getAbsoluteAttachmentPath(attachment.path),
            thumbnailObjectUrl: thumbnail?.path ? getAbsoluteAttachmentPath(thumbnail.path) : void 0,
            contentType: attachment.contentType,
            index,
            attachment,
            message: {
              attachments: message.attachments || [],
              conversationId: window.ConversationController.lookupOrCreate({
                uuid: message.sourceUuid,
                e164: message.source
              })?.id || message.conversationId,
              id: message.id,
              received_at: message.received_at,
              received_at_ms: Number(message.received_at_ms),
              sent_at: message.sent_at
            }
          };
        });
      })).filter(import_isNotNil.isNotNil);
      const documents = [];
      rawDocuments.forEach((message) => {
        const attachments = message.attachments || [];
        const attachment = attachments[0];
        if (!attachment) {
          return;
        }
        documents.push({
          contentType: attachment.contentType,
          index: 0,
          attachment,
          message
        });
      });
      const onItemClick = /* @__PURE__ */ __name(async ({
        message,
        attachment,
        type
      }) => {
        switch (type) {
          case "documents": {
            (0, import_saveAttachment.saveAttachment)(attachment, message.sent_at);
            break;
          }
          case "media": {
            const selectedMedia = media.find((item) => attachment.path === item.path) || media[0];
            this.showLightboxForMedia(selectedMedia, media);
            break;
          }
          default:
            throw new TypeError(`Unknown attachment type: '${type}'`);
        }
      }, "onItemClick");
      return {
        documents,
        media,
        onItemClick
      };
    }, "getProps");
    function getMessageIds() {
      const state = window.reduxStore.getState();
      const byConversation = state?.conversations?.messagesByConversation;
      const messages = byConversation && byConversation[conversationId];
      if (!messages || !messages.messageIds) {
        return void 0;
      }
      return messages.messageIds;
    }
    let previousMessageList;
    previousMessageList = getMessageIds();
    const unsubscribe = window.reduxStore.subscribe(() => {
      const currentMessageList = getMessageIds();
      if (currentMessageList !== previousMessageList) {
        update();
        previousMessageList = currentMessageList;
      }
    });
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: /* @__PURE__ */ React.createElement(React.Fragment, null),
      onClose: () => {
        unsubscribe();
      }
    });
    const headerTitle = window.i18n("allMedia");
    const update = /* @__PURE__ */ __name(async () => {
      const props = await getProps();
      view.update(/* @__PURE__ */ React.createElement(import_MediaGallery.MediaGallery, {
        i18n: window.i18n,
        ...props
      }));
    }, "update");
    this.addPanel({ view, headerTitle });
    update();
  }
  focusMessageField() {
    if (this.panels && this.panels.length) {
      return;
    }
    this.compositionApi.current?.focusInput();
  }
  disableMessageField() {
    this.compositionApi.current?.setDisabled(true);
  }
  enableMessageField() {
    this.compositionApi.current?.setDisabled(false);
  }
  resetEmojiResults() {
    this.compositionApi.current?.resetEmojiResults();
  }
  showGV1Members() {
    const { contactCollection, id } = this.model;
    const memberships = contactCollection?.map((conversation) => {
      return {
        isAdmin: false,
        member: conversation.format()
      };
    }) || [];
    const reduxState = window.reduxStore.getState();
    const getPreferredBadge = (0, import_badges.getPreferredBadgeSelector)(reduxState);
    const theme = (0, import_user.getTheme)(reduxState);
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "group-member-list panel",
      JSX: /* @__PURE__ */ React.createElement(import_ConversationDetailsMembershipList.ConversationDetailsMembershipList, {
        canAddNewMembers: false,
        conversationId: id,
        i18n: window.i18n,
        getPreferredBadge,
        maxShownMemberCount: 32,
        memberships,
        showContactModal: (contactId) => {
          this.showContactModal(contactId);
        },
        theme
      })
    });
    this.addPanel({ view });
    view.render();
  }
  showSafetyNumber(id) {
    let conversation;
    if (!id && (0, import_whatTypeOfConversation.isDirectConversation)(this.model.attributes)) {
      conversation = this.model;
    } else {
      conversation = window.ConversationController.get(id);
    }
    if (conversation) {
      window.reduxActions.globalModals.toggleSafetyNumberModal(conversation.get("id"));
    }
  }
  downloadAttachmentWrapper(messageId, providedAttachment) {
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`downloadAttachmentWrapper: Message ${messageId} missing!`);
    }
    const { attachments, sent_at: timestamp } = message.attributes;
    if (!attachments || attachments.length < 1) {
      return;
    }
    const attachment = providedAttachment && attachments.includes(providedAttachment) ? providedAttachment : attachments[0];
    const { fileName } = attachment;
    const isDangerous = window.Signal.Util.isFileDangerous(fileName || "");
    this.downloadAttachment({ attachment, timestamp, isDangerous });
  }
  async downloadAttachment({
    attachment,
    timestamp,
    isDangerous
  }) {
    if (isDangerous) {
      (0, import_showToast.showToast)(import_ToastDangerousFileType.ToastDangerousFileType);
      return;
    }
    return (0, import_saveAttachment.saveAttachment)(attachment, timestamp);
  }
  async displayTapToViewMessage(messageId) {
    log.info("displayTapToViewMessage: attempting to display message");
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`displayTapToViewMessage: Message ${messageId} missing!`);
    }
    if (!(0, import_message.isTapToView)(message.attributes)) {
      throw new Error(`displayTapToViewMessage: Message ${message.idForLogging()} is not a tap to view message`);
    }
    if (message.isErased()) {
      throw new Error(`displayTapToViewMessage: Message ${message.idForLogging()} is already erased`);
    }
    const firstAttachment = (message.get("attachments") || [])[0];
    if (!firstAttachment || !firstAttachment.path) {
      throw new Error(`displayTapToViewMessage: Message ${message.idForLogging()} had no first attachment with path`);
    }
    const absolutePath = getAbsoluteAttachmentPath(firstAttachment.path);
    const { path: tempPath } = await copyIntoTempDirectory(absolutePath);
    const tempAttachment = {
      ...firstAttachment,
      path: tempPath
    };
    await message.markViewOnceMessageViewed();
    const close = /* @__PURE__ */ __name(() => {
      try {
        this.stopListening(message);
        (0, import_showLightbox.closeLightbox)();
      } finally {
        deleteTempFile(tempPath);
      }
    }, "close");
    this.listenTo(message, "expired", close);
    this.listenTo(message, "change", () => {
      (0, import_showLightbox.showLightbox)(getProps());
    });
    const getProps = /* @__PURE__ */ __name(() => {
      const { path, contentType } = tempAttachment;
      return {
        close,
        i18n: window.i18n,
        media: [
          {
            attachment: tempAttachment,
            objectURL: getAbsoluteTempPath(path),
            contentType,
            index: 0,
            message: {
              attachments: message.get("attachments") || [],
              id: message.get("id"),
              conversationId: message.get("conversationId"),
              received_at: message.get("received_at"),
              received_at_ms: Number(message.get("received_at_ms")),
              sent_at: message.get("sent_at")
            }
          }
        ],
        isViewOnce: true
      };
    }, "getProps");
    (0, import_showLightbox.showLightbox)(getProps());
    log.info("displayTapToViewMessage: showed lightbox");
  }
  deleteMessage(messageId) {
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`deleteMessage: Message ${messageId} missing!`);
    }
    window.showConfirmationDialog({
      confirmStyle: "negative",
      message: window.i18n("deleteWarning"),
      okText: window.i18n("delete"),
      resolve: () => {
        window.Signal.Data.removeMessage(message.id);
        if ((0, import_message.isOutgoing)(message.attributes)) {
          this.model.decrementSentMessageCount();
        } else {
          this.model.decrementMessageCount();
        }
        this.resetPanel();
      }
    });
  }
  deleteMessageForEveryone(messageId) {
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`deleteMessageForEveryone: Message ${messageId} missing!`);
    }
    window.showConfirmationDialog({
      confirmStyle: "negative",
      message: window.i18n("deleteForEveryoneWarning"),
      okText: window.i18n("delete"),
      resolve: async () => {
        try {
          await (0, import_sendDeleteForEveryoneMessage.sendDeleteForEveryoneMessage)(this.model.attributes, {
            id: message.id,
            timestamp: message.get("sent_at")
          });
        } catch (error) {
          log.error("Error sending delete-for-everyone", error && error.stack, messageId);
          (0, import_showToast.showToast)(import_ToastDeleteForEveryoneFailed.ToastDeleteForEveryoneFailed);
        }
        this.resetPanel();
      }
    });
  }
  showStickerPackPreview(packId, packKey) {
    Stickers.downloadEphemeralPack(packId, packKey);
    const props = {
      packId,
      onClose: async () => {
        if (this.stickerPreviewModalView) {
          this.stickerPreviewModalView.remove();
          this.stickerPreviewModalView = void 0;
        }
        await Stickers.removeEphemeralPack(packId);
      }
    };
    this.stickerPreviewModalView = new import_ReactWrapperView.ReactWrapperView({
      className: "sticker-preview-modal-wrapper",
      JSX: window.Signal.State.Roots.createStickerPreviewModal(window.reduxStore, props)
    });
  }
  showLightboxForMedia(selectedMediaItem, media = []) {
    const onSave = /* @__PURE__ */ __name(async ({
      attachment,
      message,
      index
    }) => {
      return (0, import_saveAttachment.saveAttachment)(attachment, message.sent_at, index + 1);
    }, "onSave");
    const selectedIndex = media.findIndex((mediaItem) => mediaItem.attachment.path === selectedMediaItem.attachment.path);
    (0, import_showLightbox.showLightbox)({
      close: import_showLightbox.closeLightbox,
      i18n: window.i18n,
      getConversation: (0, import_conversations.getConversationSelector)(window.reduxStore.getState()),
      media,
      onForward: (messageId) => {
        this.showForwardMessageModal(messageId);
      },
      onSave,
      selectedIndex: selectedIndex >= 0 ? selectedIndex : 0
    });
  }
  showLightbox({
    attachment,
    messageId
  }) {
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`showLightbox: Message ${messageId} missing!`);
    }
    const sticker = message.get("sticker");
    if (sticker) {
      const { packId, packKey } = sticker;
      this.showStickerPackPreview(packId, packKey);
      return;
    }
    const { contentType } = attachment;
    if (!window.Signal.Util.GoogleChrome.isImageTypeSupported(contentType) && !window.Signal.Util.GoogleChrome.isVideoTypeSupported(contentType)) {
      this.downloadAttachmentWrapper(messageId, attachment);
      return;
    }
    const attachments = message.get("attachments") || [];
    const loop = (0, import_Attachment.isGIF)(attachments);
    const media = attachments.filter((item) => item.thumbnail && !item.pending && !item.error).map((item, index) => ({
      objectURL: getAbsoluteAttachmentPath(item.path ?? ""),
      path: item.path,
      contentType: item.contentType,
      loop,
      index,
      message: {
        attachments: message.get("attachments") || [],
        id: message.get("id"),
        conversationId: window.ConversationController.lookupOrCreate({
          uuid: message.get("sourceUuid"),
          e164: message.get("source")
        })?.id || message.get("conversationId"),
        received_at: message.get("received_at"),
        received_at_ms: Number(message.get("received_at_ms")),
        sent_at: message.get("sent_at")
      },
      attachment: item,
      thumbnailObjectUrl: item.thumbnail?.objectUrl || getAbsoluteAttachmentPath(item.thumbnail?.path ?? "")
    }));
    if (!media.length) {
      log.error("showLightbox: unable to load attachment", attachments.map((x) => ({
        contentType: x.contentType,
        error: x.error,
        flags: x.flags,
        path: x.path,
        size: x.size
      })));
      (0, import_showToast.showToast)(import_ToastUnableToLoadAttachment.ToastUnableToLoadAttachment);
      return;
    }
    const selectedMedia = media.find((item) => attachment.path === item.path) || media[0];
    this.showLightboxForMedia(selectedMedia, media);
  }
  showContactModal(contactId) {
    window.reduxActions.globalModals.showContactModal(contactId, this.model.id);
  }
  showGroupLinkManagement() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: window.Signal.State.Roots.createGroupLinkManagement(window.reduxStore, {
        conversationId: this.model.id
      })
    });
    const headerTitle = window.i18n("ConversationDetails--group-link");
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showGroupV2Permissions() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: window.Signal.State.Roots.createGroupV2Permissions(window.reduxStore, {
        conversationId: this.model.id,
        setAccessControlAttributesSetting: this.setAccessControlAttributesSetting.bind(this),
        setAccessControlMembersSetting: this.setAccessControlMembersSetting.bind(this),
        setAnnouncementsOnly: this.setAnnouncementsOnly.bind(this)
      })
    });
    const headerTitle = window.i18n("permissions");
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showPendingInvites() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: window.Signal.State.Roots.createPendingInvites(window.reduxStore, {
        conversationId: this.model.id,
        ourUuid: window.textsecure.storage.user.getCheckedUuid().toString(),
        approvePendingMembership: (conversationId) => {
          this.model.approvePendingMembershipFromGroupV2(conversationId);
        },
        revokePendingMemberships: (conversationIds) => {
          this.model.revokePendingMembershipsFromGroupV2(conversationIds);
        }
      })
    });
    const headerTitle = window.i18n("ConversationDetails--requests-and-invites");
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showConversationNotificationsSettings() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: window.Signal.State.Roots.createConversationNotificationsSettings(window.reduxStore, {
        conversationId: this.model.id,
        setDontNotifyForMentionsIfMuted: this.model.setDontNotifyForMentionsIfMuted.bind(this.model),
        setMuteExpiration: this.setMuteExpiration.bind(this)
      })
    });
    const headerTitle = window.i18n("ConversationDetails--notifications");
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showChatColorEditor() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel",
      JSX: window.Signal.State.Roots.createChatColorPicker(window.reduxStore, {
        conversationId: this.model.get("id")
      })
    });
    const headerTitle = window.i18n("ChatColorPicker__menu-title");
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showConversationDetails() {
    if (this.model.throttledGetProfiles) {
      this.model.throttledGetProfiles();
    }
    const messageRequestEnum = import_protobuf.SignalService.SyncMessage.MessageRequestResponse.Type;
    const onLeave = /* @__PURE__ */ __name(() => {
      this.longRunningTaskWrapper({
        name: "onLeave",
        task: () => this.model.leaveGroupV2()
      });
    }, "onLeave");
    const onBlock = /* @__PURE__ */ __name(() => {
      this.syncMessageRequestResponse("onBlock", this.model, messageRequestEnum.BLOCK);
    }, "onBlock");
    const props = {
      addMembers: this.model.addMembersV2.bind(this.model),
      conversationId: this.model.get("id"),
      loadRecentMediaItems: this.loadRecentMediaItems.bind(this),
      setDisappearingMessages: this.setDisappearingMessages.bind(this),
      showAllMedia: this.showAllMedia.bind(this),
      showContactModal: this.showContactModal.bind(this),
      showChatColorEditor: this.showChatColorEditor.bind(this),
      showGroupLinkManagement: this.showGroupLinkManagement.bind(this),
      showGroupV2Permissions: this.showGroupV2Permissions.bind(this),
      showConversationNotificationsSettings: this.showConversationNotificationsSettings.bind(this),
      showPendingInvites: this.showPendingInvites.bind(this),
      showLightboxForMedia: this.showLightboxForMedia.bind(this),
      updateGroupAttributes: this.model.updateGroupAttributesV2.bind(this.model),
      onLeave,
      onBlock,
      onUnblock: () => {
        this.syncMessageRequestResponse("onUnblock", this.model, messageRequestEnum.ACCEPT);
      },
      setMuteExpiration: this.setMuteExpiration.bind(this),
      onOutgoingAudioCallInConversation: this.onOutgoingAudioCallInConversation.bind(this),
      onOutgoingVideoCallInConversation: this.onOutgoingVideoCallInConversation.bind(this)
    };
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "conversation-details-pane panel",
      JSX: window.Signal.State.Roots.createConversationDetails(window.reduxStore, props)
    });
    const headerTitle = "";
    this.addPanel({ view, headerTitle });
    view.render();
  }
  showMessageDetail(messageId) {
    const message = window.MessageController.getById(messageId);
    if (!message) {
      throw new Error(`showMessageDetail: Message ${messageId} missing!`);
    }
    if (!message.isNormalBubble()) {
      return;
    }
    const getProps = /* @__PURE__ */ __name(() => ({
      ...message.getPropsForMessageDetail(window.ConversationController.getOurConversationIdOrThrow()),
      ...this.getMessageActions()
    }), "getProps");
    const onClose = /* @__PURE__ */ __name(() => {
      this.stopListening(message, "change", update);
      this.resetPanel();
    }, "onClose");
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "panel message-detail-wrapper",
      JSX: window.Signal.State.Roots.createMessageDetail(window.reduxStore, getProps()),
      onClose
    });
    const update = /* @__PURE__ */ __name(() => view.update(window.Signal.State.Roots.createMessageDetail(window.reduxStore, getProps())), "update");
    this.listenTo(message, "change", update);
    this.listenTo(message, "expired", onClose);
    this.addPanel({ view });
    view.render();
  }
  showStickerManager() {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: ["sticker-manager-wrapper", "panel"].join(" "),
      JSX: window.Signal.State.Roots.createStickerManager(window.reduxStore),
      onClose: () => {
        this.resetPanel();
      }
    });
    this.addPanel({ view });
    view.render();
  }
  showContactDetail({
    contact,
    signalAccount
  }) {
    const view = new import_ReactWrapperView.ReactWrapperView({
      className: "contact-detail-pane panel",
      JSX: /* @__PURE__ */ React.createElement(import_ContactDetail.ContactDetail, {
        i18n: window.i18n,
        contact,
        hasSignalAccount: Boolean(signalAccount),
        onSendMessage: () => {
          if (signalAccount) {
            this.startConversation(signalAccount.phoneNumber, signalAccount.uuid);
          }
        }
      }),
      onClose: () => {
        this.resetPanel();
      }
    });
    this.addPanel({ view });
  }
  startConversation(e164, uuid) {
    const conversation = window.ConversationController.lookupOrCreate({
      e164,
      uuid
    });
    (0, import_assert.strictAssert)(conversation, `startConversation failed given ${e164}/${uuid} combination`);
    this.openConversation(conversation.id);
  }
  async openConversation(conversationId, messageId) {
    window.Whisper.events.trigger("showConversation", conversationId, messageId);
  }
  addPanel(panel) {
    this.panels = this.panels || [];
    if (this.panels.length === 0) {
      this.previousFocus = document.activeElement;
    }
    this.panels.unshift(panel);
    panel.view.$el.insertAfter(this.$(".panel").last());
    panel.view.$el.one("animationend", () => {
      panel.view.$el.addClass("panel--static");
    });
    window.reduxActions.conversations.setSelectedConversationPanelDepth(this.panels.length);
    window.reduxActions.conversations.setSelectedConversationHeaderTitle(panel.headerTitle);
  }
  resetPanel() {
    if (!this.panels || !this.panels.length) {
      return;
    }
    const panel = this.panels.shift();
    if (this.panels.length === 0 && this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
      this.previousFocus = void 0;
    }
    if (this.panels.length > 0) {
      this.panels[0].view.$el.fadeIn(250);
    }
    if (panel) {
      let timeout;
      const removePanel = /* @__PURE__ */ __name(() => {
        if (!timeout) {
          return;
        }
        clearTimeout(timeout);
        timeout = void 0;
        panel.view.remove();
        if (this.panels.length === 0) {
          window.dispatchEvent(new Event("resize"));
        }
      }, "removePanel");
      panel.view.$el.addClass("panel--remove").one("transitionend", removePanel);
      timeout = setTimeout(removePanel, import_durations.SECOND);
    }
    window.reduxActions.conversations.setSelectedConversationPanelDepth(this.panels.length);
    window.reduxActions.conversations.setSelectedConversationHeaderTitle(this.panels[0]?.headerTitle);
  }
  async loadRecentMediaItems(limit) {
    const { model } = this;
    const messages = await window.Signal.Data.getMessagesWithVisualMediaAttachments(model.id, {
      limit
    });
    const loadedRecentMediaItems = messages.filter((message) => message.attachments !== void 0).reduce((acc, message) => [
      ...acc,
      ...(message.attachments || []).map((attachment, index) => {
        const { thumbnail } = attachment;
        return {
          objectURL: getAbsoluteAttachmentPath(attachment.path || ""),
          thumbnailObjectUrl: thumbnail?.path ? getAbsoluteAttachmentPath(thumbnail.path) : "",
          contentType: attachment.contentType,
          index,
          attachment,
          message: {
            attachments: message.attachments || [],
            conversationId: window.ConversationController.get(message.sourceUuid)?.id || message.conversationId,
            id: message.id,
            received_at: message.received_at,
            received_at_ms: Number(message.received_at_ms),
            sent_at: message.sent_at
          }
        };
      })
    ], []);
    window.reduxActions.conversations.setRecentMediaItems(model.id, loadedRecentMediaItems);
  }
  async setDisappearingMessages(seconds) {
    const { model } = this;
    const valueToSet = seconds > 0 ? seconds : void 0;
    await this.longRunningTaskWrapper({
      name: "updateExpirationTimer",
      task: async () => model.updateExpirationTimer(valueToSet, {
        reason: "setDisappearingMessages"
      })
    });
  }
  async setAccessControlAttributesSetting(value) {
    const { model } = this;
    await this.longRunningTaskWrapper({
      name: "updateAccessControlAttributes",
      task: async () => model.updateAccessControlAttributes(value)
    });
  }
  async setAccessControlMembersSetting(value) {
    const { model } = this;
    await this.longRunningTaskWrapper({
      name: "updateAccessControlMembers",
      task: async () => model.updateAccessControlMembers(value)
    });
  }
  async setAnnouncementsOnly(value) {
    const { model } = this;
    await this.longRunningTaskWrapper({
      name: "updateAnnouncementsOnly",
      task: async () => model.updateAnnouncementsOnly(value)
    });
  }
  async destroyMessages() {
    const { model } = this;
    window.showConfirmationDialog({
      confirmStyle: "negative",
      message: window.i18n("deleteConversationConfirmation"),
      okText: window.i18n("delete"),
      resolve: () => {
        this.longRunningTaskWrapper({
          name: "destroymessages",
          task: async () => {
            model.trigger("unload", "delete messages");
            await model.destroyMessages();
            model.updateLastMessage();
          }
        });
      },
      reject: () => {
        log.info("destroyMessages: User canceled delete");
      }
    });
  }
  async isCallSafe() {
    const contacts = await this.getUntrustedContacts();
    if (contacts.length) {
      const callAnyway = await this.showSendAnywayDialog(contacts, window.i18n("callAnyway"));
      if (!callAnyway) {
        log.info("Safety number change dialog not accepted, new call not allowed.");
        return false;
      }
    }
    return true;
  }
  showSendAnywayDialog(contacts, confirmText) {
    return new Promise((resolve) => {
      (0, import_showSafetyNumberChangeDialog.showSafetyNumberChangeDialog)({
        confirmText,
        contacts,
        reject: () => {
          resolve(false);
        },
        resolve: () => {
          resolve(true);
        }
      });
    });
  }
  async sendStickerMessage(options) {
    const { model } = this;
    try {
      const contacts = await this.getUntrustedContacts(options);
      if (contacts.length) {
        const sendAnyway = await this.showSendAnywayDialog(contacts);
        if (sendAnyway) {
          this.sendStickerMessage({ ...options, force: true });
        }
        return;
      }
      if (this.showInvalidMessageToast()) {
        return;
      }
      const { packId, stickerId } = options;
      model.sendStickerMessage(packId, stickerId);
    } catch (error) {
      log.error("clickSend error:", error && error.stack ? error.stack : error);
    }
  }
  async getUntrustedContacts(options = {}) {
    const { model } = this;
    await model.updateVerified();
    const unverifiedContacts = model.getUnverified();
    if (options.force) {
      if (unverifiedContacts.length) {
        await (0, import_markAllAsVerifiedDefault.markAllAsVerifiedDefault)(unverifiedContacts);
        options.force = false;
      }
    } else if (unverifiedContacts.length) {
      return unverifiedContacts;
    }
    const untrustedContacts = model.getUntrusted();
    if (options.force) {
      if (untrustedContacts.length) {
        await (0, import_markAllAsApproved.markAllAsApproved)(untrustedContacts);
      }
    } else if (untrustedContacts.length) {
      return untrustedContacts;
    }
    return [];
  }
  async setQuoteMessage(messageId) {
    const { model } = this;
    const message = messageId ? await (0, import_getMessageById.getMessageById)(messageId) : void 0;
    if (message && !(0, import_message.canReply)(message.attributes, window.ConversationController.getOurConversationIdOrThrow(), import_findAndFormatContact.findAndFormatContact)) {
      return;
    }
    if (message && !message.isNormalBubble()) {
      return;
    }
    this.quote = void 0;
    this.quotedMessage = void 0;
    const existing = model.get("quotedMessageId");
    if (existing !== messageId) {
      const now = Date.now();
      let active_at = this.model.get("active_at");
      let timestamp = this.model.get("timestamp");
      if (!active_at && messageId) {
        active_at = now;
        timestamp = now;
      }
      this.model.set({
        active_at,
        draftChanged: true,
        quotedMessageId: messageId,
        timestamp
      });
      await this.saveModel();
    }
    if (message) {
      this.quotedMessage = message;
      this.quote = await model.makeQuote(this.quotedMessage);
      this.enableMessageField();
      this.focusMessageField();
    }
    this.renderQuotedMessage();
  }
  renderQuotedMessage() {
    const { model } = this;
    if (!this.quotedMessage) {
      window.reduxActions.composer.setQuotedMessage(void 0);
      return;
    }
    window.reduxActions.composer.setQuotedMessage({
      conversationId: model.id,
      quote: this.quote
    });
  }
  showInvalidMessageToast(messageText) {
    const { model } = this;
    let toastView;
    if (window.reduxStore.getState().expiration.hasExpired) {
      toastView = import_ToastExpired.ToastExpired;
    }
    if (!model.isValid()) {
      toastView = import_ToastInvalidConversation.ToastInvalidConversation;
    }
    const e164 = this.model.get("e164");
    const uuid = this.model.get("uuid");
    if ((0, import_whatTypeOfConversation.isDirectConversation)(this.model.attributes) && (e164 && window.storage.blocked.isBlocked(e164) || uuid && window.storage.blocked.isUuidBlocked(uuid))) {
      toastView = import_ToastBlocked.ToastBlocked;
    }
    const groupId = this.model.get("groupId");
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(this.model.attributes) && groupId && window.storage.blocked.isGroupBlocked(groupId)) {
      toastView = import_ToastBlockedGroup.ToastBlockedGroup;
    }
    if (!(0, import_whatTypeOfConversation.isDirectConversation)(model.attributes) && model.get("left")) {
      toastView = import_ToastLeftGroup.ToastLeftGroup;
    }
    if (messageText && messageText.length > MAX_MESSAGE_BODY_LENGTH) {
      toastView = import_ToastMessageBodyTooLong.ToastMessageBodyTooLong;
    }
    if (toastView) {
      (0, import_showToast.showToast)(toastView);
      return true;
    }
    return false;
  }
  async sendMessage(message = "", mentions = [], options = {}) {
    const { model } = this;
    const timestamp = options.timestamp || Date.now();
    this.sendStart = Date.now();
    try {
      this.disableMessageField();
      const contacts = await this.getUntrustedContacts(options);
      if (contacts.length) {
        const sendAnyway = await this.showSendAnywayDialog(contacts);
        if (sendAnyway) {
          this.sendMessage(message, mentions, { force: true, timestamp });
          return;
        }
        this.enableMessageField();
        return;
      }
    } catch (error) {
      this.enableMessageField();
      log.error("sendMessage error:", error && error.stack ? error.stack : error);
      return;
    }
    model.clearTypingTimers();
    if (this.showInvalidMessageToast(message)) {
      this.enableMessageField();
      return;
    }
    try {
      if (!message.length && !this.hasFiles({ includePending: false }) && !options.voiceNoteAttachment) {
        return;
      }
      let attachments = [];
      if (options.voiceNoteAttachment) {
        attachments = [options.voiceNoteAttachment];
      } else if (options.draftAttachments) {
        attachments = (await Promise.all(options.draftAttachments.map(import_resolveAttachmentDraftData.resolveAttachmentDraftData))).filter(import_isNotNil.isNotNil);
      }
      const sendHQImages = window.reduxStore && window.reduxStore.getState().composer.shouldSendHighQualityAttachments;
      const sendDelta = Date.now() - this.sendStart;
      log.info("Send pre-checks took", sendDelta, "milliseconds");
      await model.enqueueMessageForSend({
        body: message,
        attachments,
        quote: this.quote,
        preview: (0, import_LinkPreview.getLinkPreviewForSend)(message),
        mentions
      }, {
        sendHQImages,
        timestamp,
        extraReduxActions: () => {
          this.compositionApi.current?.reset();
          model.setMarkedUnread(false);
          this.setQuoteMessage(null);
          (0, import_LinkPreview.resetLinkPreview)();
          this.clearAttachments();
          window.reduxActions.composer.resetComposer();
        }
      });
    } catch (error) {
      log.error("Error pulling attached files before send", error && error.stack ? error.stack : error);
    } finally {
      this.enableMessageField();
    }
  }
  onEditorStateChange(messageText, bodyRanges, caretLocation) {
    this.maybeBumpTyping(messageText);
    this.debouncedSaveDraft(messageText, bodyRanges);
    if (!this.hasFiles({ includePending: true })) {
      (0, import_LinkPreview.maybeGrabLinkPreview)(messageText, import_LinkPreview2.LinkPreviewSourceType.Composer, caretLocation);
    }
  }
  async saveDraft(messageText, bodyRanges) {
    const { model } = this;
    const trimmed = messageText && messageText.length > 0 ? messageText.trim() : "";
    if (model.get("draft") && (!messageText || trimmed.length === 0)) {
      this.model.set({
        draft: null,
        draftChanged: true,
        draftBodyRanges: []
      });
      await this.saveModel();
      return;
    }
    if (messageText !== model.get("draft")) {
      const now = Date.now();
      let active_at = this.model.get("active_at");
      let timestamp = this.model.get("timestamp");
      if (!active_at) {
        active_at = now;
        timestamp = now;
      }
      this.model.set({
        active_at,
        draft: messageText,
        draftBodyRanges: bodyRanges,
        draftChanged: true,
        timestamp
      });
      await this.saveModel();
    }
  }
  maybeBumpTyping(messageText) {
    if (messageText.length && this.model.throttledBumpTyping) {
      this.model.throttledBumpTyping();
    }
  }
}
window.Whisper.ConversationView = ConversationView;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationView
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udmVyc2F0aW9uX3ZpZXcudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMC0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5cbmltcG9ydCB0eXBlICogYXMgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHR5cGUgeyBDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGRlYm91bmNlLCBmbGF0dGVuLCB0aHJvdHRsZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdtdXN0YWNoZSc7XG5cbmltcG9ydCB0eXBlIHsgQXR0YWNobWVudFR5cGUgfSBmcm9tICcuLi90eXBlcy9BdHRhY2htZW50JztcbmltcG9ydCB7IGlzR0lGIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudCc7XG5pbXBvcnQgKiBhcyBTdGlja2VycyBmcm9tICcuLi90eXBlcy9TdGlja2Vycyc7XG5pbXBvcnQgdHlwZSB7IEJvZHlSYW5nZVR5cGUsIEJvZHlSYW5nZXNUeXBlIH0gZnJvbSAnLi4vdHlwZXMvVXRpbCc7XG5pbXBvcnQgdHlwZSB7IE1JTUVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvTUlNRSc7XG5pbXBvcnQgdHlwZSB7IENvbnZlcnNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbnMnO1xuaW1wb3J0IHR5cGUge1xuICBHcm91cFYyUGVuZGluZ01lbWJlclR5cGUsXG4gIE1lc3NhZ2VBdHRyaWJ1dGVzVHlwZSxcbiAgUXVvdGVkTWVzc2FnZVR5cGUsXG59IGZyb20gJy4uL21vZGVsLXR5cGVzLmQnO1xuaW1wb3J0IHR5cGUgeyBNZWRpYUl0ZW1UeXBlLCBNZWRpYUl0ZW1NZXNzYWdlVHlwZSB9IGZyb20gJy4uL3R5cGVzL01lZGlhSXRlbSc7XG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VNb2RlbCB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlcyc7XG5pbXBvcnQgeyBnZXRNZXNzYWdlQnlJZCB9IGZyb20gJy4uL21lc3NhZ2VzL2dldE1lc3NhZ2VCeUlkJztcbmltcG9ydCB7IGdldENvbnRhY3RJZCB9IGZyb20gJy4uL21lc3NhZ2VzL2hlbHBlcnMnO1xuaW1wb3J0IHsgc3RyaWN0QXNzZXJ0IH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHsgZW5xdWV1ZVJlYWN0aW9uRm9yU2VuZCB9IGZyb20gJy4uL3JlYWN0aW9ucy9lbnF1ZXVlUmVhY3Rpb25Gb3JTZW5kJztcbmltcG9ydCB7IGFkZFJlcG9ydFNwYW1Kb2IgfSBmcm9tICcuLi9qb2JzL2hlbHBlcnMvYWRkUmVwb3J0U3BhbUpvYic7XG5pbXBvcnQgeyByZXBvcnRTcGFtSm9iUXVldWUgfSBmcm9tICcuLi9qb2JzL3JlcG9ydFNwYW1Kb2JRdWV1ZSc7XG5pbXBvcnQgdHlwZSB7IEdyb3VwTmFtZUNvbGxpc2lvbnNXaXRoSWRzQnlUaXRsZSB9IGZyb20gJy4uL3V0aWwvZ3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9ucyc7XG5pbXBvcnQge1xuICBpc0RpcmVjdENvbnZlcnNhdGlvbixcbiAgaXNHcm91cCxcbiAgaXNHcm91cFYxLFxufSBmcm9tICcuLi91dGlsL3doYXRUeXBlT2ZDb252ZXJzYXRpb24nO1xuaW1wb3J0IHsgZmluZEFuZEZvcm1hdENvbnRhY3QgfSBmcm9tICcuLi91dGlsL2ZpbmRBbmRGb3JtYXRDb250YWN0JztcbmltcG9ydCB7IGdldFByZWZlcnJlZEJhZGdlU2VsZWN0b3IgfSBmcm9tICcuLi9zdGF0ZS9zZWxlY3RvcnMvYmFkZ2VzJztcbmltcG9ydCB7XG4gIGNhblJlcGx5LFxuICBpc0luY29taW5nLFxuICBpc091dGdvaW5nLFxuICBpc1RhcFRvVmlldyxcbn0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL21lc3NhZ2UnO1xuaW1wb3J0IHtcbiAgZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3IsXG4gIGdldE1lc3NhZ2VzQnlDb252ZXJzYXRpb24sXG59IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9jb252ZXJzYXRpb25zJztcbmltcG9ydCB7IGdldEFjdGl2ZUNhbGxTdGF0ZSB9IGZyb20gJy4uL3N0YXRlL3NlbGVjdG9ycy9jYWxsaW5nJztcbmltcG9ydCB7IGdldFRoZW1lIH0gZnJvbSAnLi4vc3RhdGUvc2VsZWN0b3JzL3VzZXInO1xuaW1wb3J0IHsgUmVhY3RXcmFwcGVyVmlldyB9IGZyb20gJy4vUmVhY3RXcmFwcGVyVmlldyc7XG5pbXBvcnQgdHlwZSB7IExpZ2h0Ym94IH0gZnJvbSAnLi4vY29tcG9uZW50cy9MaWdodGJveCc7XG5pbXBvcnQgeyBDb252ZXJzYXRpb25EZXRhaWxzTWVtYmVyc2hpcExpc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi9jb252ZXJzYXRpb24tZGV0YWlscy9Db252ZXJzYXRpb25EZXRhaWxzTWVtYmVyc2hpcExpc3QnO1xuaW1wb3J0IHsgc2hvd1NhZmV0eU51bWJlckNoYW5nZURpYWxvZyB9IGZyb20gJy4uL3NoaW1zL3Nob3dTYWZldHlOdW1iZXJDaGFuZ2VEaWFsb2cnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZ2dpbmcvbG9nJztcbmltcG9ydCB0eXBlIHsgRW1iZWRkZWRDb250YWN0VHlwZSB9IGZyb20gJy4uL3R5cGVzL0VtYmVkZGVkQ29udGFjdCc7XG5pbXBvcnQgeyBjcmVhdGVDb252ZXJzYXRpb25WaWV3IH0gZnJvbSAnLi4vc3RhdGUvcm9vdHMvY3JlYXRlQ29udmVyc2F0aW9uVmlldyc7XG5pbXBvcnQgeyBBdHRhY2htZW50VG9hc3RUeXBlIH0gZnJvbSAnLi4vdHlwZXMvQXR0YWNobWVudFRvYXN0VHlwZSc7XG5pbXBvcnQgdHlwZSB7IENvbXBvc2l0aW9uQVBJVHlwZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvQ29tcG9zaXRpb25BcmVhJztcbmltcG9ydCB7IFJlYWRTdGF0dXMgfSBmcm9tICcuLi9tZXNzYWdlcy9NZXNzYWdlUmVhZFN0YXR1cyc7XG5pbXBvcnQgeyBTaWduYWxTZXJ2aWNlIGFzIFByb3RvIH0gZnJvbSAnLi4vcHJvdG9idWYnO1xuaW1wb3J0IHsgVG9hc3RCbG9ja2VkIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdEJsb2NrZWQnO1xuaW1wb3J0IHsgVG9hc3RCbG9ja2VkR3JvdXAgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0QmxvY2tlZEdyb3VwJztcbmltcG9ydCB7IFRvYXN0Q2Fubm90TWl4SW1hZ2VBbmROb25JbWFnZUF0dGFjaG1lbnRzIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdENhbm5vdE1peEltYWdlQW5kTm9uSW1hZ2VBdHRhY2htZW50cyc7XG5pbXBvcnQgeyBUb2FzdENhbm5vdFN0YXJ0R3JvdXBDYWxsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdENhbm5vdFN0YXJ0R3JvdXBDYWxsJztcbmltcG9ydCB7IFRvYXN0Q29udmVyc2F0aW9uQXJjaGl2ZWQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0Q29udmVyc2F0aW9uQXJjaGl2ZWQnO1xuaW1wb3J0IHsgVG9hc3RDb252ZXJzYXRpb25NYXJrZWRVbnJlYWQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0Q29udmVyc2F0aW9uTWFya2VkVW5yZWFkJztcbmltcG9ydCB7IFRvYXN0Q29udmVyc2F0aW9uVW5hcmNoaXZlZCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3RDb252ZXJzYXRpb25VbmFyY2hpdmVkJztcbmltcG9ydCB7IFRvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0RGFuZ2Vyb3VzRmlsZVR5cGUnO1xuaW1wb3J0IHsgVG9hc3REZWxldGVGb3JFdmVyeW9uZUZhaWxlZCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3REZWxldGVGb3JFdmVyeW9uZUZhaWxlZCc7XG5pbXBvcnQgeyBUb2FzdEV4cGlyZWQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0RXhwaXJlZCc7XG5pbXBvcnQgeyBUb2FzdEZpbGVTaXplIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdEZpbGVTaXplJztcbmltcG9ydCB7IFRvYXN0SW52YWxpZENvbnZlcnNhdGlvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3RJbnZhbGlkQ29udmVyc2F0aW9uJztcbmltcG9ydCB7IFRvYXN0TGVmdEdyb3VwIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdExlZnRHcm91cCc7XG5pbXBvcnQgeyBUb2FzdE1heEF0dGFjaG1lbnRzIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdE1heEF0dGFjaG1lbnRzJztcbmltcG9ydCB7IFRvYXN0TWVzc2FnZUJvZHlUb29Mb25nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdE1lc3NhZ2VCb2R5VG9vTG9uZyc7XG5pbXBvcnQgeyBUb2FzdE9uZU5vbkltYWdlQXRBVGltZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3RPbmVOb25JbWFnZUF0QVRpbWUnO1xuaW1wb3J0IHsgVG9hc3RPcmlnaW5hbE1lc3NhZ2VOb3RGb3VuZCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3RPcmlnaW5hbE1lc3NhZ2VOb3RGb3VuZCc7XG5pbXBvcnQgeyBUb2FzdFBpbm5lZENvbnZlcnNhdGlvbnNGdWxsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdFBpbm5lZENvbnZlcnNhdGlvbnNGdWxsJztcbmltcG9ydCB7IFRvYXN0UmVhY3Rpb25GYWlsZWQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0UmVhY3Rpb25GYWlsZWQnO1xuaW1wb3J0IHsgVG9hc3RSZXBvcnRlZFNwYW1BbmRCbG9ja2VkIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdFJlcG9ydGVkU3BhbUFuZEJsb2NrZWQnO1xuaW1wb3J0IHsgVG9hc3RUYXBUb1ZpZXdFeHBpcmVkSW5jb21pbmcgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0VGFwVG9WaWV3RXhwaXJlZEluY29taW5nJztcbmltcG9ydCB7IFRvYXN0VGFwVG9WaWV3RXhwaXJlZE91dGdvaW5nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdFRhcFRvVmlld0V4cGlyZWRPdXRnb2luZyc7XG5pbXBvcnQgeyBUb2FzdFVuYWJsZVRvTG9hZEF0dGFjaG1lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0VW5hYmxlVG9Mb2FkQXR0YWNobWVudCc7XG5pbXBvcnQgeyBUb2FzdENhbm5vdE9wZW5HaWZ0QmFkZ2UgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0Q2Fubm90T3BlbkdpZnRCYWRnZSc7XG5pbXBvcnQgeyBkZWxldGVEcmFmdEF0dGFjaG1lbnQgfSBmcm9tICcuLi91dGlsL2RlbGV0ZURyYWZ0QXR0YWNobWVudCc7XG5pbXBvcnQgeyBtYXJrQWxsQXNBcHByb3ZlZCB9IGZyb20gJy4uL3V0aWwvbWFya0FsbEFzQXBwcm92ZWQnO1xuaW1wb3J0IHsgbWFya0FsbEFzVmVyaWZpZWREZWZhdWx0IH0gZnJvbSAnLi4vdXRpbC9tYXJrQWxsQXNWZXJpZmllZERlZmF1bHQnO1xuaW1wb3J0IHsgcmV0cnlNZXNzYWdlU2VuZCB9IGZyb20gJy4uL3V0aWwvcmV0cnlNZXNzYWdlU2VuZCc7XG5pbXBvcnQgeyBpc05vdE5pbCB9IGZyb20gJy4uL3V0aWwvaXNOb3ROaWwnO1xuaW1wb3J0IHsgbWFya1ZpZXdlZCB9IGZyb20gJy4uL3NlcnZpY2VzL01lc3NhZ2VVcGRhdGVyJztcbmltcG9ydCB7IG9wZW5MaW5rSW5XZWJCcm93c2VyIH0gZnJvbSAnLi4vdXRpbC9vcGVuTGlua0luV2ViQnJvd3Nlcic7XG5pbXBvcnQgeyByZXNvbHZlQXR0YWNobWVudERyYWZ0RGF0YSB9IGZyb20gJy4uL3V0aWwvcmVzb2x2ZUF0dGFjaG1lbnREcmFmdERhdGEnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vdXRpbC9zaG93VG9hc3QnO1xuaW1wb3J0IHsgdmlld1N5bmNKb2JRdWV1ZSB9IGZyb20gJy4uL2pvYnMvdmlld1N5bmNKb2JRdWV1ZSc7XG5pbXBvcnQgeyB2aWV3ZWRSZWNlaXB0c0pvYlF1ZXVlIH0gZnJvbSAnLi4vam9icy92aWV3ZWRSZWNlaXB0c0pvYlF1ZXVlJztcbmltcG9ydCB7IFJlY29yZGluZ1N0YXRlIH0gZnJvbSAnLi4vc3RhdGUvZHVja3MvYXVkaW9SZWNvcmRlcic7XG5pbXBvcnQgeyBVVUlES2luZCB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHR5cGUgeyBVVUlEU3RyaW5nVHlwZSB9IGZyb20gJy4uL3R5cGVzL1VVSUQnO1xuaW1wb3J0IHsgcmV0cnlEZWxldGVGb3JFdmVyeW9uZSB9IGZyb20gJy4uL3V0aWwvcmV0cnlEZWxldGVGb3JFdmVyeW9uZSc7XG5pbXBvcnQgeyBDb250YWN0RGV0YWlsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vQ29udGFjdERldGFpbCc7XG5pbXBvcnQgeyBNZWRpYUdhbGxlcnkgfSBmcm9tICcuLi9jb21wb25lbnRzL2NvbnZlcnNhdGlvbi9tZWRpYS1nYWxsZXJ5L01lZGlhR2FsbGVyeSc7XG5pbXBvcnQgdHlwZSB7IEl0ZW1DbGlja0V2ZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24vbWVkaWEtZ2FsbGVyeS90eXBlcy9JdGVtQ2xpY2tFdmVudCc7XG5pbXBvcnQge1xuICBnZXRMaW5rUHJldmlld0ZvclNlbmQsXG4gIGhhc0xpbmtQcmV2aWV3TG9hZGVkLFxuICBtYXliZUdyYWJMaW5rUHJldmlldyxcbiAgcmVtb3ZlTGlua1ByZXZpZXcsXG4gIHJlc2V0TGlua1ByZXZpZXcsXG4gIHN1c3BlbmRMaW5rUHJldmlld3MsXG59IGZyb20gJy4uL3NlcnZpY2VzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB7IExpbmtQcmV2aWV3U291cmNlVHlwZSB9IGZyb20gJy4uL3R5cGVzL0xpbmtQcmV2aWV3JztcbmltcG9ydCB7IGNsb3NlTGlnaHRib3gsIHNob3dMaWdodGJveCB9IGZyb20gJy4uL3V0aWwvc2hvd0xpZ2h0Ym94JztcbmltcG9ydCB7IHNhdmVBdHRhY2htZW50IH0gZnJvbSAnLi4vdXRpbC9zYXZlQXR0YWNobWVudCc7XG5pbXBvcnQgeyBzZW5kRGVsZXRlRm9yRXZlcnlvbmVNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbC9zZW5kRGVsZXRlRm9yRXZlcnlvbmVNZXNzYWdlJztcbmltcG9ydCB7IFNFQ09ORCB9IGZyb20gJy4uL3V0aWwvZHVyYXRpb25zJztcblxudHlwZSBBdHRhY2htZW50T3B0aW9ucyA9IHtcbiAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xufTtcblxudHlwZSBQYW5lbFR5cGUgPSB7IHZpZXc6IEJhY2tib25lLlZpZXc7IGhlYWRlclRpdGxlPzogc3RyaW5nIH07XG5cbmNvbnN0IEZJVkVfTUlOVVRFUyA9IDEwMDAgKiA2MCAqIDU7XG5cbmNvbnN0IHsgTWVzc2FnZSB9ID0gd2luZG93LlNpZ25hbC5UeXBlcztcblxuY29uc3Qge1xuICBjb3B5SW50b1RlbXBEaXJlY3RvcnksXG4gIGRlbGV0ZVRlbXBGaWxlLFxuICBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoLFxuICBnZXRBYnNvbHV0ZVRlbXBQYXRoLFxuICB1cGdyYWRlTWVzc2FnZVNjaGVtYSxcbn0gPSB3aW5kb3cuU2lnbmFsLk1pZ3JhdGlvbnM7XG5cbmNvbnN0IHsgZ2V0TWVzc2FnZXNCeVNlbnRBdCB9ID0gd2luZG93LlNpZ25hbC5EYXRhO1xuXG50eXBlIE1lc3NhZ2VBY3Rpb25zVHlwZSA9IHtcbiAgZGVsZXRlTWVzc2FnZTogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmU6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgZG93bmxvYWRBdHRhY2htZW50OiAob3B0aW9uczoge1xuICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIGlzRGFuZ2Vyb3VzOiBib29sZWFuO1xuICB9KSA9PiB1bmtub3duO1xuICBkb3dubG9hZE5ld1ZlcnNpb246ICgpID0+IHVua25vd247XG4gIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQ6IChcbiAgICBvcHRpb25zOiBSZWFkb25seTx7IG1lc3NhZ2VJZDogc3RyaW5nIH0+XG4gICkgPT4gdW5rbm93bjtcbiAgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogKG9wdGlvbnM6IEF0dGFjaG1lbnRPcHRpb25zKSA9PiB1bmtub3duO1xuICBtYXJrVmlld2VkOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIG9wZW5Db252ZXJzYXRpb246IChjb252ZXJzYXRpb25JZDogc3RyaW5nLCBtZXNzYWdlSWQ/OiBzdHJpbmcpID0+IHVua25vd247XG4gIG9wZW5HaWZ0QmFkZ2U6IChtZXNzYWdlSWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgb3Blbkxpbms6ICh1cmw6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgcmVhY3RUb01lc3NhZ2U6IChcbiAgICBtZXNzYWdlSWQ6IHN0cmluZyxcbiAgICByZWFjdGlvbjogeyBlbW9qaTogc3RyaW5nOyByZW1vdmU6IGJvb2xlYW4gfVxuICApID0+IHVua25vd247XG4gIHJlcGx5VG9NZXNzYWdlOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHJldHJ5U2VuZDogKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB1bmtub3duO1xuICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHNob3dDb250YWN0RGV0YWlsOiAob3B0aW9uczoge1xuICAgIGNvbnRhY3Q6IEVtYmVkZGVkQ29udGFjdFR5cGU7XG4gICAgc2lnbmFsQWNjb3VudD86IHtcbiAgICAgIHBob25lTnVtYmVyOiBzdHJpbmc7XG4gICAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgICB9O1xuICB9KSA9PiB1bmtub3duO1xuICBzaG93Q29udGFjdE1vZGFsOiAoY29udGFjdElkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHNob3dTYWZldHlOdW1iZXI6IChjb250YWN0SWQ6IHN0cmluZykgPT4gdW5rbm93bjtcbiAgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0OiAoKSA9PiB1bmtub3duO1xuICBzaG93RXhwaXJlZE91dGdvaW5nVGFwVG9WaWV3VG9hc3Q6ICgpID0+IHVua25vd247XG4gIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHNob3dJZGVudGl0eTogKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHNob3dNZXNzYWdlRGV0YWlsOiAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHVua25vd247XG4gIHNob3dWaXN1YWxBdHRhY2htZW50OiAob3B0aW9uczoge1xuICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIHNob3dTaW5nbGU/OiBib29sZWFuO1xuICB9KSA9PiB1bmtub3duO1xuICBzdGFydENvbnZlcnNhdGlvbjogKGUxNjQ6IHN0cmluZywgdXVpZDogVVVJRFN0cmluZ1R5cGUpID0+IHVua25vd247XG59O1xuXG50eXBlIE1lZGlhVHlwZSA9IHtcbiAgcGF0aDogc3RyaW5nO1xuICBvYmplY3RVUkw6IHN0cmluZztcbiAgdGh1bWJuYWlsT2JqZWN0VXJsPzogc3RyaW5nO1xuICBjb250ZW50VHlwZTogTUlNRVR5cGU7XG4gIGluZGV4OiBudW1iZXI7XG4gIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICBtZXNzYWdlOiB7XG4gICAgYXR0YWNobWVudHM6IEFycmF5PEF0dGFjaG1lbnRUeXBlPjtcbiAgICBjb252ZXJzYXRpb25JZDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcmVjZWl2ZWRfYXQ6IG51bWJlcjtcbiAgICByZWNlaXZlZF9hdF9tczogbnVtYmVyO1xuICAgIHNlbnRfYXQ6IG51bWJlcjtcbiAgfTtcbn07XG5cbmNvbnN0IE1BWF9NRVNTQUdFX0JPRFlfTEVOR1RIID0gNjQgKiAxMDI0O1xuXG5leHBvcnQgY2xhc3MgQ29udmVyc2F0aW9uVmlldyBleHRlbmRzIHdpbmRvdy5CYWNrYm9uZS5WaWV3PENvbnZlcnNhdGlvbk1vZGVsPiB7XG4gIHByaXZhdGUgZGVib3VuY2VkU2F2ZURyYWZ0OiAoXG4gICAgbWVzc2FnZVRleHQ6IHN0cmluZyxcbiAgICBib2R5UmFuZ2VzOiBBcnJheTxCb2R5UmFuZ2VUeXBlPlxuICApID0+IFByb21pc2U8dm9pZD47XG4gIHByaXZhdGUgbGF6eVVwZGF0ZVZlcmlmaWVkOiAoKSA9PiB2b2lkO1xuXG4gIC8vIENvbXBvc2luZyBtZXNzYWdlc1xuICBwcml2YXRlIGNvbXBvc2l0aW9uQXBpOiB7XG4gICAgY3VycmVudDogQ29tcG9zaXRpb25BUElUeXBlO1xuICB9ID0geyBjdXJyZW50OiB1bmRlZmluZWQgfTtcbiAgcHJpdmF0ZSBzZW5kU3RhcnQ/OiBudW1iZXI7XG5cbiAgLy8gUXVvdGVzXG4gIHByaXZhdGUgcXVvdGU/OiBRdW90ZWRNZXNzYWdlVHlwZTtcbiAgcHJpdmF0ZSBxdW90ZWRNZXNzYWdlPzogTWVzc2FnZU1vZGVsO1xuXG4gIC8vIFN1Yi12aWV3c1xuICBwcml2YXRlIGNvbnRhY3RNb2RhbFZpZXc/OiBCYWNrYm9uZS5WaWV3O1xuICBwcml2YXRlIGNvbnZlcnNhdGlvblZpZXc/OiBCYWNrYm9uZS5WaWV3O1xuICBwcml2YXRlIGxpZ2h0Ym94Vmlldz86IFJlYWN0V3JhcHBlclZpZXc7XG4gIHByaXZhdGUgbWlncmF0aW9uRGlhbG9nPzogQmFja2JvbmUuVmlldztcbiAgcHJpdmF0ZSBzdGlja2VyUHJldmlld01vZGFsVmlldz86IEJhY2tib25lLlZpZXc7XG5cbiAgLy8gUGFuZWwgc3VwcG9ydFxuICBwcml2YXRlIHBhbmVsczogQXJyYXk8UGFuZWxUeXBlPiA9IFtdO1xuICBwcml2YXRlIHByZXZpb3VzRm9jdXM/OiBIVE1MRWxlbWVudDtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBjb25zdHJ1Y3RvciguLi5hcmdzOiBBcnJheTxhbnk+KSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICB0aGlzLmxhenlVcGRhdGVWZXJpZmllZCA9IGRlYm91bmNlKFxuICAgICAgdGhpcy5tb2RlbC51cGRhdGVWZXJpZmllZC5iaW5kKHRoaXMubW9kZWwpLFxuICAgICAgMTAwMCAvLyBvbmUgc2Vjb25kXG4gICAgKTtcbiAgICB0aGlzLm1vZGVsLnRocm90dGxlZEdldFByb2ZpbGVzID1cbiAgICAgIHRoaXMubW9kZWwudGhyb3R0bGVkR2V0UHJvZmlsZXMgfHxcbiAgICAgIHRocm90dGxlKHRoaXMubW9kZWwuZ2V0UHJvZmlsZXMuYmluZCh0aGlzLm1vZGVsKSwgRklWRV9NSU5VVEVTKTtcblxuICAgIHRoaXMuZGVib3VuY2VkU2F2ZURyYWZ0ID0gZGVib3VuY2UodGhpcy5zYXZlRHJhZnQuYmluZCh0aGlzKSwgMjAwKTtcblxuICAgIC8vIEV2ZW50cyBvbiBDb252ZXJzYXRpb24gbW9kZWxcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdkZXN0cm95JywgdGhpcy5zdG9wTGlzdGVuaW5nKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICduZXdtZXNzYWdlJywgdGhpcy5sYXp5VXBkYXRlVmVyaWZpZWQpO1xuXG4gICAgLy8gVGhlc2UgYXJlIHRyaWdnZXJlZCBieSBJbmJveFZpZXdcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdvcGVuZWQnLCB0aGlzLm9uT3BlbmVkKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdzY3JvbGwtdG8tbWVzc2FnZScsIHRoaXMuc2Nyb2xsVG9NZXNzYWdlKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICd1bmxvYWQnLCAocmVhc29uOiBzdHJpbmcpID0+XG4gICAgICB0aGlzLnVubG9hZChgbW9kZWwgdHJpZ2dlciAtICR7cmVhc29ufWApXG4gICAgKTtcblxuICAgIC8vIFRoZXNlIGFyZSB0cmlnZ2VyZWQgYnkgYmFja2dyb3VuZC50cyBmb3Iga2V5Ym9hcmQgaGFuZGxpbmdcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdmb2N1cy1jb21wb3NlcicsIHRoaXMuZm9jdXNNZXNzYWdlRmllbGQpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ29wZW4tYWxsLW1lZGlhJywgdGhpcy5zaG93QWxsTWVkaWEpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2VzY2FwZS1wcmVzc2VkJywgdGhpcy5yZXNldFBhbmVsKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdzaG93LW1lc3NhZ2UtZGV0YWlscycsIHRoaXMuc2hvd01lc3NhZ2VEZXRhaWwpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ3Nob3ctY29udGFjdC1tb2RhbCcsIHRoaXMuc2hvd0NvbnRhY3RNb2RhbCk7XG4gICAgdGhpcy5saXN0ZW5UbyhcbiAgICAgIHRoaXMubW9kZWwsXG4gICAgICAndG9nZ2xlLXJlcGx5JyxcbiAgICAgIChtZXNzYWdlSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnF1b3RlIHx8ICFtZXNzYWdlSWQgPyBudWxsIDogbWVzc2FnZUlkO1xuICAgICAgICB0aGlzLnNldFF1b3RlTWVzc2FnZSh0YXJnZXQpO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5saXN0ZW5UbyhcbiAgICAgIHRoaXMubW9kZWwsXG4gICAgICAnc2F2ZS1hdHRhY2htZW50JyxcbiAgICAgIHRoaXMuZG93bmxvYWRBdHRhY2htZW50V3JhcHBlclxuICAgICk7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnZGVsZXRlLW1lc3NhZ2UnLCB0aGlzLmRlbGV0ZU1lc3NhZ2UpO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ3JlbW92ZS1saW5rLXJldmlldycsIHJlbW92ZUxpbmtQcmV2aWV3KTtcbiAgICB0aGlzLmxpc3RlblRvKFxuICAgICAgdGhpcy5tb2RlbCxcbiAgICAgICdyZW1vdmUtYWxsLWRyYWZ0LWF0dGFjaG1lbnRzJyxcbiAgICAgIHRoaXMuY2xlYXJBdHRhY2htZW50c1xuICAgICk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgdGhpcy5zZXR1cENvbnZlcnNhdGlvblZpZXcoKTtcbiAgICB0aGlzLnVwZGF0ZUF0dGFjaG1lbnRzVmlldygpO1xuICB9XG5cbiAgb3ZlcnJpZGUgZXZlbnRzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiB7XG4gICAgICBkcm9wOiAnb25Ecm9wJyxcbiAgICAgIHBhc3RlOiAnb25QYXN0ZScsXG4gICAgfTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhpcyBpZ25vcmUgYmVjYXVzZSB0aGUgYmFja2JvbmUgdHlwZXMgcmVhbGx5IHdhbnQgdGhpcyB0byBiZSBhIHN0cmluZ1xuICAvLyAgIHByb3BlcnR5LCBidXQgdGhlIHByb3BlcnR5IGlzbid0IHNldCB1bnRpbCBhZnRlciBzdXBlcigpIGlzIHJ1biwgbWVhbmluZyB0aGF0IHRoaXNcbiAgLy8gICBjbGFzc25hbWUgd291bGRuJ3QgYmUgYXBwbGllZCB3aGVuIEJhY2tib25lIGNyZWF0ZXMgb3VyIGVsLlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gIC8vIEB0cy1pZ25vcmVcbiAgY2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdjb252ZXJzYXRpb24nO1xuICB9XG5cbiAgLy8gU2FtZSBzaXR1YXRpb24gYXMgY2xhc3NOYW1lKCkuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgLy8gQHRzLWlnbm9yZVxuICBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgY29udmVyc2F0aW9uLSR7dGhpcy5tb2RlbC5jaWR9YDtcbiAgfVxuXG4gIC8vIEJhY2tib25lLlZpZXc8Q29udmVyc2F0aW9uTW9kZWw+IGlzIGRlbWFuZGVkIGFzIHRoZSByZXR1cm4gdHlwZSBoZXJlLCBhbmQgd2UgY2FuJ3RcbiAgLy8gICBzYXRpc2Z5IGl0IGJlY2F1c2Ugb2YgdGhlIGFib3ZlIGRpZmZlcmVuY2UgaW4gc2lnbmF0dXJlOiBjbGFzc05hbWUgaXMgYSBmdW5jdGlvblxuICAvLyAgIHdoZW4gaXQgc2hvdWxkIGJlIGEgcGxhaW4gc3RyaW5nIHByb3BlcnR5LlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gIC8vIEB0cy1pZ25vcmVcbiAgcmVuZGVyKCk6IENvbnZlcnNhdGlvblZpZXcge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gJCgnI2NvbnZlcnNhdGlvbicpLmh0bWwoKTtcbiAgICB0aGlzLiRlbC5odG1sKHJlbmRlcih0ZW1wbGF0ZSwge30pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldE11dGVFeHBpcmF0aW9uKG1zID0gMCk6IHZvaWQge1xuICAgIHRoaXMubW9kZWwuc2V0TXV0ZUV4cGlyYXRpb24oXG4gICAgICBtcyA+PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiA/IG1zIDogRGF0ZS5ub3coKSArIG1zXG4gICAgKTtcbiAgfVxuXG4gIHNldFBpbih2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY29uc3QgcGlubmVkQ29udmVyc2F0aW9uSWRzID0gd2luZG93LnN0b3JhZ2UuZ2V0KFxuICAgICAgICAncGlubmVkQ29udmVyc2F0aW9uSWRzJyxcbiAgICAgICAgbmV3IEFycmF5PHN0cmluZz4oKVxuICAgICAgKTtcblxuICAgICAgaWYgKHBpbm5lZENvbnZlcnNhdGlvbklkcy5sZW5ndGggPj0gNCkge1xuICAgICAgICBzaG93VG9hc3QoVG9hc3RQaW5uZWRDb252ZXJzYXRpb25zRnVsbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMubW9kZWwucGluKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW9kZWwudW5waW4oKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cENvbnZlcnNhdGlvblZpZXcoKTogdm9pZCB7XG4gICAgLy8gc2V0dXBIZWFkZXJcbiAgICBjb25zdCBjb252ZXJzYXRpb25IZWFkZXJQcm9wcyA9IHtcbiAgICAgIGlkOiB0aGlzLm1vZGVsLmlkLFxuXG4gICAgICBvblNldERpc2FwcGVhcmluZ01lc3NhZ2VzOiAoc2Vjb25kczogbnVtYmVyKSA9PlxuICAgICAgICB0aGlzLnNldERpc2FwcGVhcmluZ01lc3NhZ2VzKHNlY29uZHMpLFxuICAgICAgb25EZWxldGVNZXNzYWdlczogKCkgPT4gdGhpcy5kZXN0cm95TWVzc2FnZXMoKSxcbiAgICAgIG9uU2VhcmNoSW5Db252ZXJzYXRpb246ICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBzZWFyY2hJbkNvbnZlcnNhdGlvbiB9ID0gd2luZG93LnJlZHV4QWN0aW9ucy5zZWFyY2g7XG4gICAgICAgIHNlYXJjaEluQ29udmVyc2F0aW9uKHRoaXMubW9kZWwuaWQpO1xuICAgICAgfSxcbiAgICAgIG9uU2V0TXV0ZU5vdGlmaWNhdGlvbnM6IHRoaXMuc2V0TXV0ZUV4cGlyYXRpb24uYmluZCh0aGlzKSxcbiAgICAgIG9uU2V0UGluOiB0aGlzLnNldFBpbi5iaW5kKHRoaXMpLFxuICAgICAgLy8gVGhlc2UgYXJlIHZpZXcgb25seSBhbmQgZG9uJ3QgdXBkYXRlIHRoZSBDb252ZXJzYXRpb24gbW9kZWwsIHNvIHRoZXlcbiAgICAgIC8vICAgbmVlZCBhIG1hbnVhbCB1cGRhdGUgY2FsbC5cbiAgICAgIG9uT3V0Z29pbmdBdWRpb0NhbGxJbkNvbnZlcnNhdGlvbjpcbiAgICAgICAgdGhpcy5vbk91dGdvaW5nQXVkaW9DYWxsSW5Db252ZXJzYXRpb24uYmluZCh0aGlzKSxcbiAgICAgIG9uT3V0Z29pbmdWaWRlb0NhbGxJbkNvbnZlcnNhdGlvbjpcbiAgICAgICAgdGhpcy5vbk91dGdvaW5nVmlkZW9DYWxsSW5Db252ZXJzYXRpb24uYmluZCh0aGlzKSxcblxuICAgICAgb25TaG93Q29udmVyc2F0aW9uRGV0YWlsczogKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3dDb252ZXJzYXRpb25EZXRhaWxzKCk7XG4gICAgICB9LFxuICAgICAgb25TaG93QWxsTWVkaWE6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zaG93QWxsTWVkaWEoKTtcbiAgICAgIH0sXG4gICAgICBvblNob3dHcm91cE1lbWJlcnM6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zaG93R1YxTWVtYmVycygpO1xuICAgICAgfSxcbiAgICAgIG9uR29CYWNrOiAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzZXRQYW5lbCgpO1xuICAgICAgfSxcblxuICAgICAgb25BcmNoaXZlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0QXJjaGl2ZWQodHJ1ZSk7XG4gICAgICAgIHRoaXMubW9kZWwudHJpZ2dlcigndW5sb2FkJywgJ2FyY2hpdmUnKTtcblxuICAgICAgICBzaG93VG9hc3QoVG9hc3RDb252ZXJzYXRpb25BcmNoaXZlZCwge1xuICAgICAgICAgIHVuZG86ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0QXJjaGl2ZWQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5vcGVuQ29udmVyc2F0aW9uKHRoaXMubW9kZWwuZ2V0KCdpZCcpKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBvbk1hcmtVbnJlYWQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy5tb2RlbC5zZXRNYXJrZWRVbnJlYWQodHJ1ZSk7XG5cbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0Q29udmVyc2F0aW9uTWFya2VkVW5yZWFkKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVUb0luYm94OiAoKSA9PiB7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0QXJjaGl2ZWQoZmFsc2UpO1xuXG4gICAgICAgIHNob3dUb2FzdChUb2FzdENvbnZlcnNhdGlvblVuYXJjaGl2ZWQpO1xuICAgICAgfSxcbiAgICB9O1xuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5zZXRTZWxlY3RlZENvbnZlcnNhdGlvbkhlYWRlclRpdGxlKCk7XG5cbiAgICAvLyBzZXR1cFRpbWVsaW5lXG4gICAgY29uc3QgbWVzc2FnZVJlcXVlc3RFbnVtID0gUHJvdG8uU3luY01lc3NhZ2UuTWVzc2FnZVJlcXVlc3RSZXNwb25zZS5UeXBlO1xuXG4gICAgY29uc3QgY29udGFjdFN1cHBvcnQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBiYXNlVXJsID1cbiAgICAgICAgJ2h0dHBzOi8vc3VwcG9ydC5zaWduYWwub3JnL2hjL0xPQ0FMRS9yZXF1ZXN0cy9uZXc/ZGVza3RvcCZjaGF0X3JlZnJlc2hlZCc7XG4gICAgICBjb25zdCBsb2NhbGUgPSB3aW5kb3cuZ2V0TG9jYWxlKCk7XG4gICAgICBjb25zdCBzdXBwb3J0TG9jYWxlID0gd2luZG93LlNpZ25hbC5VdGlsLm1hcFRvU3VwcG9ydExvY2FsZShsb2NhbGUpO1xuICAgICAgY29uc3QgdXJsID0gYmFzZVVybC5yZXBsYWNlKCdMT0NBTEUnLCBzdXBwb3J0TG9jYWxlKTtcblxuICAgICAgb3BlbkxpbmtJbldlYkJyb3dzZXIodXJsKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbGVhcm5Nb3JlQWJvdXREZWxpdmVyeUlzc3VlID0gKCkgPT4ge1xuICAgICAgb3BlbkxpbmtJbldlYkJyb3dzZXIoXG4gICAgICAgICdodHRwczovL3N1cHBvcnQuc2lnbmFsLm9yZy9oYy9hcnRpY2xlcy80NDA0ODU5NzQ1NjkwJ1xuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2Nyb2xsVG9RdW90ZWRNZXNzYWdlID0gYXN5bmMgKFxuICAgICAgb3B0aW9uczogUmVhZG9ubHk8e1xuICAgICAgICBhdXRob3JJZDogc3RyaW5nO1xuICAgICAgICBzZW50QXQ6IG51bWJlcjtcbiAgICAgIH0+XG4gICAgKSA9PiB7XG4gICAgICBjb25zdCB7IGF1dGhvcklkLCBzZW50QXQgfSA9IG9wdGlvbnM7XG5cbiAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbklkID0gdGhpcy5tb2RlbC5pZDtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgZ2V0TWVzc2FnZXNCeVNlbnRBdChzZW50QXQpO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzLmZpbmQoaXRlbSA9PlxuICAgICAgICBCb29sZWFuKFxuICAgICAgICAgIGl0ZW0uY29udmVyc2F0aW9uSWQgPT09IGNvbnZlcnNhdGlvbklkICYmXG4gICAgICAgICAgICBhdXRob3JJZCAmJlxuICAgICAgICAgICAgZ2V0Q29udGFjdElkKGl0ZW0pID09PSBhdXRob3JJZFxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0T3JpZ2luYWxNZXNzYWdlTm90Rm91bmQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2Nyb2xsVG9NZXNzYWdlKG1lc3NhZ2UuaWQpO1xuICAgIH07XG5cbiAgICBjb25zdCBtYXJrTWVzc2FnZVJlYWQgPSBhc3luYyAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghd2luZG93LlNpZ25hbENvbnRleHQuYWN0aXZlV2luZG93U2VydmljZS5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWN0aXZlQ2FsbCA9IGdldEFjdGl2ZUNhbGxTdGF0ZSh3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpKTtcbiAgICAgIGlmIChhY3RpdmVDYWxsICYmICFhY3RpdmVDYWxsLnBpcCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBnZXRNZXNzYWdlQnlJZChtZXNzYWdlSWQpO1xuICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbWFya01lc3NhZ2VSZWFkOiBmYWlsZWQgdG8gbG9hZCBtZXNzYWdlICR7bWVzc2FnZUlkfWApO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLm1vZGVsLm1hcmtSZWFkKG1lc3NhZ2UuZ2V0KCdyZWNlaXZlZF9hdCcpLCB7XG4gICAgICAgIG5ld2VzdFNlbnRBdDogbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgICAgc2VuZFJlYWRSZWNlaXB0czogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVNZXNzYWdlUmVxdWVzdFJlc3BvbnNlSGFuZGxlciA9XG4gICAgICAobmFtZTogc3RyaW5nLCBlbnVtVmFsdWU6IG51bWJlcik6ICgoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4gdm9pZCkgPT5cbiAgICAgIGNvbnZlcnNhdGlvbklkID0+IHtcbiAgICAgICAgY29uc3QgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGNvbnZlcnNhdGlvbklkKTtcbiAgICAgICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICBgY3JlYXRlTWVzc2FnZVJlcXVlc3RSZXNwb25zZUhhbmRsZXI6IEV4cGVjdGVkIGEgY29udmVyc2F0aW9uIHRvIGJlIGZvdW5kIGluICR7bmFtZX0uIERvaW5nIG5vdGhpbmdgXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShuYW1lLCBjb252ZXJzYXRpb24sIGVudW1WYWx1ZSk7XG4gICAgICB9O1xuXG4gICAgY29uc3QgdGltZWxpbmVQcm9wcyA9IHtcbiAgICAgIGlkOiB0aGlzLm1vZGVsLmlkLFxuXG4gICAgICAuLi50aGlzLmdldE1lc3NhZ2VBY3Rpb25zKCksXG5cbiAgICAgIGFja25vd2xlZGdlR3JvdXBNZW1iZXJOYW1lQ29sbGlzaW9uczogKFxuICAgICAgICBncm91cE5hbWVDb2xsaXNpb25zOiBSZWFkb25seTxHcm91cE5hbWVDb2xsaXNpb25zV2l0aElkc0J5VGl0bGU+XG4gICAgICApOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5tb2RlbC5hY2tub3dsZWRnZUdyb3VwTWVtYmVyTmFtZUNvbGxpc2lvbnMoZ3JvdXBOYW1lQ29sbGlzaW9ucyk7XG4gICAgICB9LFxuICAgICAgYmxvY2tHcm91cExpbmtSZXF1ZXN0czogKHV1aWQ6IFVVSURTdHJpbmdUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMubW9kZWwuYmxvY2tHcm91cExpbmtSZXF1ZXN0cyh1dWlkKTtcbiAgICAgIH0sXG4gICAgICBjb250YWN0U3VwcG9ydCxcbiAgICAgIGxlYXJuTW9yZUFib3V0RGVsaXZlcnlJc3N1ZSxcbiAgICAgIGxvYWROZXdlck1lc3NhZ2VzOiB0aGlzLm1vZGVsLmxvYWROZXdlck1lc3NhZ2VzLmJpbmQodGhpcy5tb2RlbCksXG4gICAgICBsb2FkTmV3ZXN0TWVzc2FnZXM6IHRoaXMubW9kZWwubG9hZE5ld2VzdE1lc3NhZ2VzLmJpbmQodGhpcy5tb2RlbCksXG4gICAgICBsb2FkT2xkZXJNZXNzYWdlczogdGhpcy5tb2RlbC5sb2FkT2xkZXJNZXNzYWdlcy5iaW5kKHRoaXMubW9kZWwpLFxuICAgICAgbWFya01lc3NhZ2VSZWFkLFxuICAgICAgb25CbG9jazogY3JlYXRlTWVzc2FnZVJlcXVlc3RSZXNwb25zZUhhbmRsZXIoXG4gICAgICAgICdvbkJsb2NrJyxcbiAgICAgICAgbWVzc2FnZVJlcXVlc3RFbnVtLkJMT0NLXG4gICAgICApLFxuICAgICAgb25CbG9ja0FuZFJlcG9ydFNwYW06IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldChjb252ZXJzYXRpb25JZCk7XG4gICAgICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICAgICAgbG9nLmVycm9yKFxuICAgICAgICAgICAgYG9uQmxvY2tBbmRSZXBvcnRTcGFtOiBFeHBlY3RlZCBhIGNvbnZlcnNhdGlvbiB0byBiZSBmb3VuZCBmb3IgJHtjb252ZXJzYXRpb25JZH0uIERvaW5nIG5vdGhpbmcuYFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmxvY2tBbmRSZXBvcnRTcGFtKGNvbnZlcnNhdGlvbik7XG4gICAgICB9LFxuICAgICAgb25EZWxldGU6IGNyZWF0ZU1lc3NhZ2VSZXF1ZXN0UmVzcG9uc2VIYW5kbGVyKFxuICAgICAgICAnb25EZWxldGUnLFxuICAgICAgICBtZXNzYWdlUmVxdWVzdEVudW0uREVMRVRFXG4gICAgICApLFxuICAgICAgb25VbmJsb2NrOiBjcmVhdGVNZXNzYWdlUmVxdWVzdFJlc3BvbnNlSGFuZGxlcihcbiAgICAgICAgJ29uVW5ibG9jaycsXG4gICAgICAgIG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFRcbiAgICAgICksXG4gICAgICByZW1vdmVNZW1iZXI6IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICAgICAgbmFtZTogJ3JlbW92ZU1lbWJlcicsXG4gICAgICAgICAgdGFzazogKCkgPT4gdGhpcy5tb2RlbC5yZW1vdmVGcm9tR3JvdXBWMihjb252ZXJzYXRpb25JZCksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHNjcm9sbFRvUXVvdGVkTWVzc2FnZSxcbiAgICAgIHVuYmx1ckF2YXRhcjogKCkgPT4ge1xuICAgICAgICB0aGlzLm1vZGVsLnVuYmx1ckF2YXRhcigpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVNoYXJlZEdyb3VwczogKCkgPT4gdGhpcy5tb2RlbC50aHJvdHRsZWRVcGRhdGVTaGFyZWRHcm91cHM/LigpLFxuICAgIH07XG5cbiAgICAvLyBzZXR1cENvbXBvc2l0aW9uQXJlYVxuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29tcG9zZXIucmVzZXRDb21wb3NlcigpO1xuXG4gICAgY29uc3QgY29tcG9zaXRpb25BcmVhUHJvcHMgPSB7XG4gICAgICBpZDogdGhpcy5tb2RlbC5pZCxcbiAgICAgIGNvbXBvc2l0aW9uQXBpOiB0aGlzLmNvbXBvc2l0aW9uQXBpLFxuICAgICAgb25DbGlja0FkZFBhY2s6ICgpID0+IHRoaXMuc2hvd1N0aWNrZXJNYW5hZ2VyKCksXG4gICAgICBvblBpY2tTdGlja2VyOiAocGFja0lkOiBzdHJpbmcsIHN0aWNrZXJJZDogbnVtYmVyKSA9PlxuICAgICAgICB0aGlzLnNlbmRTdGlja2VyTWVzc2FnZSh7IHBhY2tJZCwgc3RpY2tlcklkIH0pLFxuICAgICAgb25FZGl0b3JTdGF0ZUNoYW5nZTogKFxuICAgICAgICBtc2c6IHN0cmluZyxcbiAgICAgICAgYm9keVJhbmdlczogQXJyYXk8Qm9keVJhbmdlVHlwZT4sXG4gICAgICAgIGNhcmV0TG9jYXRpb24/OiBudW1iZXJcbiAgICAgICkgPT4gdGhpcy5vbkVkaXRvclN0YXRlQ2hhbmdlKG1zZywgYm9keVJhbmdlcywgY2FyZXRMb2NhdGlvbiksXG4gICAgICBvblRleHRUb29Mb25nOiAoKSA9PiBzaG93VG9hc3QoVG9hc3RNZXNzYWdlQm9keVRvb0xvbmcpLFxuICAgICAgZ2V0UXVvdGVkTWVzc2FnZTogKCkgPT4gdGhpcy5tb2RlbC5nZXQoJ3F1b3RlZE1lc3NhZ2VJZCcpLFxuICAgICAgY2xlYXJRdW90ZWRNZXNzYWdlOiAoKSA9PiB0aGlzLnNldFF1b3RlTWVzc2FnZShudWxsKSxcbiAgICAgIG9uQWNjZXB0OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY01lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoXG4gICAgICAgICAgJ29uQWNjZXB0JyxcbiAgICAgICAgICB0aGlzLm1vZGVsLFxuICAgICAgICAgIG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFRcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBvbkJsb2NrOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY01lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoXG4gICAgICAgICAgJ29uQmxvY2snLFxuICAgICAgICAgIHRoaXMubW9kZWwsXG4gICAgICAgICAgbWVzc2FnZVJlcXVlc3RFbnVtLkJMT0NLXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgb25VbmJsb2NrOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY01lc3NhZ2VSZXF1ZXN0UmVzcG9uc2UoXG4gICAgICAgICAgJ29uVW5ibG9jaycsXG4gICAgICAgICAgdGhpcy5tb2RlbCxcbiAgICAgICAgICBtZXNzYWdlUmVxdWVzdEVudW0uQUNDRVBUXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgb25EZWxldGU6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShcbiAgICAgICAgICAnb25EZWxldGUnLFxuICAgICAgICAgIHRoaXMubW9kZWwsXG4gICAgICAgICAgbWVzc2FnZVJlcXVlc3RFbnVtLkRFTEVURVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIG9uQmxvY2tBbmRSZXBvcnRTcGFtOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuYmxvY2tBbmRSZXBvcnRTcGFtKHRoaXMubW9kZWwpO1xuICAgICAgfSxcbiAgICAgIG9uU3RhcnRHcm91cE1pZ3JhdGlvbjogKCkgPT4gdGhpcy5zdGFydE1pZ3JhdGlvblRvR1YyKCksXG4gICAgICBvbkNhbmNlbEpvaW5SZXF1ZXN0OiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5zaG93Q29uZmlybWF0aW9uRGlhbG9nKHtcbiAgICAgICAgICBtZXNzYWdlOiB3aW5kb3cuaTE4bihcbiAgICAgICAgICAgICdHcm91cFYyLS1qb2luLS1jYW5jZWwtcmVxdWVzdC10by1qb2luLS1jb25maXJtYXRpb24nXG4gICAgICAgICAgKSxcbiAgICAgICAgICBva1RleHQ6IHdpbmRvdy5pMThuKCdHcm91cFYyLS1qb2luLS1jYW5jZWwtcmVxdWVzdC10by1qb2luLS15ZXMnKSxcbiAgICAgICAgICBjYW5jZWxUZXh0OiB3aW5kb3cuaTE4bignR3JvdXBWMi0tam9pbi0tY2FuY2VsLXJlcXVlc3QtdG8tam9pbi0tbm8nKSxcbiAgICAgICAgICByZXNvbHZlOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgICAgICAgICBuYW1lOiAnb25DYW5jZWxKb2luUmVxdWVzdCcsXG4gICAgICAgICAgICAgIHRhc2s6IGFzeW5jICgpID0+IHRoaXMubW9kZWwuY2FuY2VsSm9pblJlcXVlc3QoKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgb25DbGVhckF0dGFjaG1lbnRzOiB0aGlzLmNsZWFyQXR0YWNobWVudHMuYmluZCh0aGlzKSxcbiAgICAgIG9uU2VsZWN0TWVkaWFRdWFsaXR5OiAoaXNIUTogYm9vbGVhbikgPT4ge1xuICAgICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbXBvc2VyLnNldE1lZGlhUXVhbGl0eVNldHRpbmcoaXNIUSk7XG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVDbGlja1F1b3RlZE1lc3NhZ2U6IChpZDogc3RyaW5nKSA9PiB0aGlzLnNjcm9sbFRvTWVzc2FnZShpZCksXG5cbiAgICAgIG9uQ2xvc2VMaW5rUHJldmlldzogKCkgPT4ge1xuICAgICAgICBzdXNwZW5kTGlua1ByZXZpZXdzKCk7XG4gICAgICAgIHJlbW92ZUxpbmtQcmV2aWV3KCk7XG4gICAgICB9LFxuXG4gICAgICBvcGVuQ29udmVyc2F0aW9uOiB0aGlzLm9wZW5Db252ZXJzYXRpb24uYmluZCh0aGlzKSxcblxuICAgICAgb25TZW5kTWVzc2FnZTogKHtcbiAgICAgICAgZHJhZnRBdHRhY2htZW50cyxcbiAgICAgICAgbWVudGlvbnMgPSBbXSxcbiAgICAgICAgbWVzc2FnZSA9ICcnLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgIHZvaWNlTm90ZUF0dGFjaG1lbnQsXG4gICAgICB9OiB7XG4gICAgICAgIGRyYWZ0QXR0YWNobWVudHM/OiBSZWFkb25seUFycmF5PEF0dGFjaG1lbnRUeXBlPjtcbiAgICAgICAgbWVudGlvbnM/OiBCb2R5UmFuZ2VzVHlwZTtcbiAgICAgICAgbWVzc2FnZT86IHN0cmluZztcbiAgICAgICAgdGltZXN0YW1wPzogbnVtYmVyO1xuICAgICAgICB2b2ljZU5vdGVBdHRhY2htZW50PzogQXR0YWNobWVudFR5cGU7XG4gICAgICB9KTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobWVzc2FnZSwgbWVudGlvbnMsIHtcbiAgICAgICAgICBkcmFmdEF0dGFjaG1lbnRzLFxuICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB2b2ljZU5vdGVBdHRhY2htZW50LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZUNvbnZlcnNhdGlvblZpZXcgcm9vdFxuXG4gICAgY29uc3QgSlNYID0gY3JlYXRlQ29udmVyc2F0aW9uVmlldyh3aW5kb3cucmVkdXhTdG9yZSwge1xuICAgICAgY29tcG9zaXRpb25BcmVhUHJvcHMsXG4gICAgICBjb252ZXJzYXRpb25IZWFkZXJQcm9wcyxcbiAgICAgIHRpbWVsaW5lUHJvcHMsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbnZlcnNhdGlvblZpZXcgPSBuZXcgUmVhY3RXcmFwcGVyVmlldyh7IEpTWCB9KTtcbiAgICB0aGlzLiQoJy5Db252ZXJzYXRpb25WaWV3X190ZW1wbGF0ZScpLmFwcGVuZCh0aGlzLmNvbnZlcnNhdGlvblZpZXcuZWwpO1xuICB9XG5cbiAgYXN5bmMgb25PdXRnb2luZ1ZpZGVvQ2FsbEluQ29udmVyc2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZy5pbmZvKCdvbk91dGdvaW5nVmlkZW9DYWxsSW5Db252ZXJzYXRpb246IGFib3V0IHRvIHN0YXJ0IGEgdmlkZW8gY2FsbCcpO1xuXG4gICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdhbm5vdW5jZW1lbnRzT25seScpICYmICF0aGlzLm1vZGVsLmFyZVdlQWRtaW4oKSkge1xuICAgICAgc2hvd1RvYXN0KFRvYXN0Q2Fubm90U3RhcnRHcm91cENhbGwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2FsbFNhZmUoKSkge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdvbk91dGdvaW5nVmlkZW9DYWxsSW5Db252ZXJzYXRpb246IGNhbGwgaXMgZGVlbWVkIFwic2FmZVwiLiBNYWtpbmcgY2FsbCdcbiAgICAgICk7XG4gICAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNhbGxpbmcuc3RhcnRDYWxsaW5nTG9iYnkoe1xuICAgICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5tb2RlbC5pZCxcbiAgICAgICAgaXNWaWRlb0NhbGw6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGxvZy5pbmZvKCdvbk91dGdvaW5nVmlkZW9DYWxsSW5Db252ZXJzYXRpb246IHN0YXJ0ZWQgdGhlIGNhbGwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdvbk91dGdvaW5nVmlkZW9DYWxsSW5Db252ZXJzYXRpb246IGNhbGwgaXMgZGVlbWVkIFwidW5zYWZlXCIuIFN0b3BwaW5nJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvbk91dGdvaW5nQXVkaW9DYWxsSW5Db252ZXJzYXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ29uT3V0Z29pbmdBdWRpb0NhbGxJbkNvbnZlcnNhdGlvbjogYWJvdXQgdG8gc3RhcnQgYW4gYXVkaW8gY2FsbCcpO1xuXG4gICAgaWYgKGF3YWl0IHRoaXMuaXNDYWxsU2FmZSgpKSB7XG4gICAgICBsb2cuaW5mbyhcbiAgICAgICAgJ29uT3V0Z29pbmdBdWRpb0NhbGxJbkNvbnZlcnNhdGlvbjogY2FsbCBpcyBkZWVtZWQgXCJzYWZlXCIuIE1ha2luZyBjYWxsJ1xuICAgICAgKTtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY2FsbGluZy5zdGFydENhbGxpbmdMb2JieSh7XG4gICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLm1vZGVsLmlkLFxuICAgICAgICBpc1ZpZGVvQ2FsbDogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGxvZy5pbmZvKCdvbk91dGdvaW5nQXVkaW9DYWxsSW5Db252ZXJzYXRpb246IHN0YXJ0ZWQgdGhlIGNhbGwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmluZm8oXG4gICAgICAgICdvbk91dGdvaW5nQXVkaW9DYWxsSW5Db252ZXJzYXRpb246IGNhbGwgaXMgZGVlbWVkIFwidW5zYWZlXCIuIFN0b3BwaW5nJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb25nUnVubmluZ1Rhc2tXcmFwcGVyPFQ+KHtcbiAgICBuYW1lLFxuICAgIHRhc2ssXG4gIH06IHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdGFzazogKCkgPT4gUHJvbWlzZTxUPjtcbiAgfSk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGlkRm9yTG9nZ2luZyA9IHRoaXMubW9kZWwuaWRGb3JMb2dnaW5nKCk7XG4gICAgcmV0dXJuIHdpbmRvdy5TaWduYWwuVXRpbC5sb25nUnVubmluZ1Rhc2tXcmFwcGVyKHtcbiAgICAgIG5hbWUsXG4gICAgICBpZEZvckxvZ2dpbmcsXG4gICAgICB0YXNrLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWVzc2FnZUFjdGlvbnMoKTogTWVzc2FnZUFjdGlvbnNUeXBlIHtcbiAgICBjb25zdCByZWFjdFRvTWVzc2FnZSA9IGFzeW5jIChcbiAgICAgIG1lc3NhZ2VJZDogc3RyaW5nLFxuICAgICAgcmVhY3Rpb246IHsgZW1vamk6IHN0cmluZzsgcmVtb3ZlOiBib29sZWFuIH1cbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHsgZW1vamksIHJlbW92ZSB9ID0gcmVhY3Rpb247XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBlbnF1ZXVlUmVhY3Rpb25Gb3JTZW5kKHtcbiAgICAgICAgICBtZXNzYWdlSWQsXG4gICAgICAgICAgZW1vamksXG4gICAgICAgICAgcmVtb3ZlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxvZy5lcnJvcignRXJyb3Igc2VuZGluZyByZWFjdGlvbicsIGVycm9yLCBtZXNzYWdlSWQsIHJlYWN0aW9uKTtcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0UmVhY3Rpb25GYWlsZWQpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcmVwbHlUb01lc3NhZ2UgPSAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuc2V0UXVvdGVNZXNzYWdlKG1lc3NhZ2VJZCk7XG4gICAgfTtcbiAgICBjb25zdCByZXRyeVNlbmQgPSByZXRyeU1lc3NhZ2VTZW5kO1xuICAgIGNvbnN0IGRlbGV0ZU1lc3NhZ2UgPSAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuZGVsZXRlTWVzc2FnZShtZXNzYWdlSWQpO1xuICAgIH07XG4gICAgY29uc3QgZGVsZXRlTWVzc2FnZUZvckV2ZXJ5b25lID0gKG1lc3NhZ2VJZDogc3RyaW5nKSA9PiB7XG4gICAgICB0aGlzLmRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZShtZXNzYWdlSWQpO1xuICAgIH07XG4gICAgY29uc3Qgc2hvd01lc3NhZ2VEZXRhaWwgPSAobWVzc2FnZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuc2hvd01lc3NhZ2VEZXRhaWwobWVzc2FnZUlkKTtcbiAgICB9O1xuICAgIGNvbnN0IHNob3dDb250YWN0TW9kYWwgPSAoY29udGFjdElkOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuc2hvd0NvbnRhY3RNb2RhbChjb250YWN0SWQpO1xuICAgIH07XG4gICAgY29uc3Qgb3BlbkNvbnZlcnNhdGlvbiA9IChjb252ZXJzYXRpb25JZDogc3RyaW5nLCBtZXNzYWdlSWQ/OiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMub3BlbkNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCwgbWVzc2FnZUlkKTtcbiAgICB9O1xuICAgIGNvbnN0IHNob3dDb250YWN0RGV0YWlsID0gKG9wdGlvbnM6IHtcbiAgICAgIGNvbnRhY3Q6IEVtYmVkZGVkQ29udGFjdFR5cGU7XG4gICAgICBzaWduYWxBY2NvdW50Pzoge1xuICAgICAgICBwaG9uZU51bWJlcjogc3RyaW5nO1xuICAgICAgICB1dWlkOiBVVUlEU3RyaW5nVHlwZTtcbiAgICAgIH07XG4gICAgfSkgPT4ge1xuICAgICAgdGhpcy5zaG93Q29udGFjdERldGFpbChvcHRpb25zKTtcbiAgICB9O1xuICAgIGNvbnN0IGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQgPSBhc3luYyAoXG4gICAgICBvcHRpb25zOiBSZWFkb25seTx7IG1lc3NhZ2VJZDogc3RyaW5nIH0+XG4gICAgKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQob3B0aW9ucy5tZXNzYWdlSWQpO1xuICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBga2lja09mZkF0dGFjaG1lbnREb3dubG9hZDogTWVzc2FnZSAke29wdGlvbnMubWVzc2FnZUlkfSBtaXNzaW5nIWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IG1lc3NhZ2UucXVldWVBdHRhY2htZW50RG93bmxvYWRzKCk7XG4gICAgfTtcbiAgICBjb25zdCBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkID0gKG9wdGlvbnM6IEF0dGFjaG1lbnRPcHRpb25zKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQob3B0aW9ucy5tZXNzYWdlSWQpO1xuICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgbWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZDogTWVzc2FnZSAke29wdGlvbnMubWVzc2FnZUlkfSBtaXNzaW5nIWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2UubWFya0F0dGFjaG1lbnRBc0NvcnJ1cHRlZChvcHRpb25zLmF0dGFjaG1lbnQpO1xuICAgIH07XG4gICAgY29uc3Qgb25NYXJrVmlld2VkID0gKG1lc3NhZ2VJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobWVzc2FnZUlkKTtcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG9uTWFya1ZpZXdlZDogTWVzc2FnZSAke21lc3NhZ2VJZH0gbWlzc2luZyFgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lc3NhZ2UuZ2V0KCdyZWFkU3RhdHVzJykgPT09IFJlYWRTdGF0dXMuVmlld2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VuZGVyRTE2NCA9IG1lc3NhZ2UuZ2V0KCdzb3VyY2UnKTtcbiAgICAgIGNvbnN0IHNlbmRlclV1aWQgPSBtZXNzYWdlLmdldCgnc291cmNlVXVpZCcpO1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKTtcblxuICAgICAgbWVzc2FnZS5zZXQobWFya1ZpZXdlZChtZXNzYWdlLmF0dHJpYnV0ZXMsIERhdGUubm93KCkpKTtcblxuICAgICAgaWYgKGlzSW5jb21pbmcobWVzc2FnZS5hdHRyaWJ1dGVzKSkge1xuICAgICAgICB2aWV3ZWRSZWNlaXB0c0pvYlF1ZXVlLmFkZCh7XG4gICAgICAgICAgdmlld2VkUmVjZWlwdDoge1xuICAgICAgICAgICAgbWVzc2FnZUlkLFxuICAgICAgICAgICAgc2VuZGVyRTE2NCxcbiAgICAgICAgICAgIHNlbmRlclV1aWQsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZpZXdTeW5jSm9iUXVldWUuYWRkKHtcbiAgICAgICAgdmlld1N5bmNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWVzc2FnZUlkLFxuICAgICAgICAgICAgc2VuZGVyRTE2NCxcbiAgICAgICAgICAgIHNlbmRlclV1aWQsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3Qgc2hvd1Zpc3VhbEF0dGFjaG1lbnQgPSAob3B0aW9uczoge1xuICAgICAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGU7XG4gICAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgICAgIHNob3dTaW5nbGU/OiBib29sZWFuO1xuICAgIH0pID0+IHtcbiAgICAgIHRoaXMuc2hvd0xpZ2h0Ym94KG9wdGlvbnMpO1xuICAgIH07XG4gICAgY29uc3QgZG93bmxvYWRBdHRhY2htZW50ID0gKG9wdGlvbnM6IHtcbiAgICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICAgICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgICBpc0Rhbmdlcm91czogYm9vbGVhbjtcbiAgICB9KSA9PiB7XG4gICAgICB0aGlzLmRvd25sb2FkQXR0YWNobWVudChvcHRpb25zKTtcbiAgICB9O1xuICAgIGNvbnN0IGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlID0gKG1lc3NhZ2VJZDogc3RyaW5nKSA9PlxuICAgICAgdGhpcy5kaXNwbGF5VGFwVG9WaWV3TWVzc2FnZShtZXNzYWdlSWQpO1xuICAgIGNvbnN0IHNob3dJZGVudGl0eSA9IChjb252ZXJzYXRpb25JZDogc3RyaW5nKSA9PiB7XG4gICAgICB0aGlzLnNob3dTYWZldHlOdW1iZXIoY29udmVyc2F0aW9uSWQpO1xuICAgIH07XG4gICAgY29uc3Qgb3BlbkdpZnRCYWRnZSA9IChtZXNzYWdlSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5nZXRCeUlkKG1lc3NhZ2VJZCk7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBvcGVuR2lmdEJhZGdlOiBNZXNzYWdlICR7bWVzc2FnZUlkfSBtaXNzaW5nIWApO1xuICAgICAgfVxuXG4gICAgICBzaG93VG9hc3QoVG9hc3RDYW5ub3RPcGVuR2lmdEJhZGdlLCB7XG4gICAgICAgIGlzSW5jb21pbmc6IGlzSW5jb21pbmcobWVzc2FnZS5hdHRyaWJ1dGVzKSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBvcGVuTGluayA9IG9wZW5MaW5rSW5XZWJCcm93c2VyO1xuICAgIGNvbnN0IGRvd25sb2FkTmV3VmVyc2lvbiA9ICgpID0+IHtcbiAgICAgIG9wZW5MaW5rSW5XZWJCcm93c2VyKCdodHRwczovL3NpZ25hbC5vcmcvZG93bmxvYWQnKTtcbiAgICB9O1xuICAgIGNvbnN0IHNob3dTYWZldHlOdW1iZXIgPSAoY29udGFjdElkOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuc2hvd1NhZmV0eU51bWJlcihjb250YWN0SWQpO1xuICAgIH07XG4gICAgY29uc3Qgc2hvd0V4cGlyZWRJbmNvbWluZ1RhcFRvVmlld1RvYXN0ID0gKCkgPT4ge1xuICAgICAgbG9nLmluZm8oJ1Nob3dpbmcgZXhwaXJlZCB0YXAtdG8tdmlldyB0b2FzdCBmb3IgYW4gaW5jb21pbmcgbWVzc2FnZScpO1xuICAgICAgc2hvd1RvYXN0KFRvYXN0VGFwVG9WaWV3RXhwaXJlZEluY29taW5nKTtcbiAgICB9O1xuICAgIGNvbnN0IHNob3dFeHBpcmVkT3V0Z29pbmdUYXBUb1ZpZXdUb2FzdCA9ICgpID0+IHtcbiAgICAgIGxvZy5pbmZvKCdTaG93aW5nIGV4cGlyZWQgdGFwLXRvLXZpZXcgdG9hc3QgZm9yIGFuIG91dGdvaW5nIG1lc3NhZ2UnKTtcbiAgICAgIHNob3dUb2FzdChUb2FzdFRhcFRvVmlld0V4cGlyZWRPdXRnb2luZyk7XG4gICAgfTtcblxuICAgIGNvbnN0IHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsID0gdGhpcy5zaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbC5iaW5kKHRoaXMpO1xuICAgIGNvbnN0IHN0YXJ0Q29udmVyc2F0aW9uID0gdGhpcy5zdGFydENvbnZlcnNhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRlbGV0ZU1lc3NhZ2UsXG4gICAgICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUsXG4gICAgICBkaXNwbGF5VGFwVG9WaWV3TWVzc2FnZSxcbiAgICAgIGRvd25sb2FkQXR0YWNobWVudCxcbiAgICAgIGRvd25sb2FkTmV3VmVyc2lvbixcbiAgICAgIGtpY2tPZmZBdHRhY2htZW50RG93bmxvYWQsXG4gICAgICBtYXJrQXR0YWNobWVudEFzQ29ycnVwdGVkLFxuICAgICAgbWFya1ZpZXdlZDogb25NYXJrVmlld2VkLFxuICAgICAgb3BlbkNvbnZlcnNhdGlvbixcbiAgICAgIG9wZW5HaWZ0QmFkZ2UsXG4gICAgICBvcGVuTGluayxcbiAgICAgIHJlYWN0VG9NZXNzYWdlLFxuICAgICAgcmVwbHlUb01lc3NhZ2UsXG4gICAgICByZXRyeVNlbmQsXG4gICAgICByZXRyeURlbGV0ZUZvckV2ZXJ5b25lLFxuICAgICAgc2hvd0NvbnRhY3REZXRhaWwsXG4gICAgICBzaG93Q29udGFjdE1vZGFsLFxuICAgICAgc2hvd1NhZmV0eU51bWJlcixcbiAgICAgIHNob3dFeHBpcmVkSW5jb21pbmdUYXBUb1ZpZXdUb2FzdCxcbiAgICAgIHNob3dFeHBpcmVkT3V0Z29pbmdUYXBUb1ZpZXdUb2FzdCxcbiAgICAgIHNob3dGb3J3YXJkTWVzc2FnZU1vZGFsLFxuICAgICAgc2hvd0lkZW50aXR5LFxuICAgICAgc2hvd01lc3NhZ2VEZXRhaWwsXG4gICAgICBzaG93VmlzdWFsQXR0YWNobWVudCxcbiAgICAgIHN0YXJ0Q29udmVyc2F0aW9uLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBzY3JvbGxUb01lc3NhZ2UobWVzc2FnZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0TWVzc2FnZUJ5SWQobWVzc2FnZUlkKTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2Nyb2xsVG9NZXNzYWdlOiBmYWlsZWQgdG8gbG9hZCBtZXNzYWdlICR7bWVzc2FnZUlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gd2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgIGxldCBpc0luTWVtb3J5ID0gdHJ1ZTtcblxuICAgIGlmICghd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobWVzc2FnZUlkKSkge1xuICAgICAgaXNJbk1lbW9yeSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1lc3NhZ2UgbWlnaHQgYmUgaW4gbWVtb3J5LCBidXQgbm90IGluIHRoZSByZWR1eCBhbnltb3JlIGJlY2F1c2VcbiAgICAvLyB3ZSBjYWxsIGBtZXNzYWdlUmVzZXQoKWAgaW4gYGxvYWRBbmRTY3JvbGwoKWAuXG4gICAgY29uc3QgbWVzc2FnZXNCeUNvbnZlcnNhdGlvbiA9XG4gICAgICBnZXRNZXNzYWdlc0J5Q29udmVyc2F0aW9uKHN0YXRlKVt0aGlzLm1vZGVsLmlkXTtcbiAgICBpZiAoIW1lc3NhZ2VzQnlDb252ZXJzYXRpb24/Lm1lc3NhZ2VJZHMuaW5jbHVkZXMobWVzc2FnZUlkKSkge1xuICAgICAgaXNJbk1lbW9yeSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0luTWVtb3J5KSB7XG4gICAgICBjb25zdCB7IHNjcm9sbFRvTWVzc2FnZSB9ID0gd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zO1xuICAgICAgc2Nyb2xsVG9NZXNzYWdlKHRoaXMubW9kZWwuaWQsIG1lc3NhZ2VJZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlbC5sb2FkQW5kU2Nyb2xsKG1lc3NhZ2VJZCk7XG4gIH1cblxuICBhc3luYyBzdGFydE1pZ3JhdGlvblRvR1YyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxvZ0lkID0gdGhpcy5tb2RlbC5pZEZvckxvZ2dpbmcoKTtcblxuICAgIGlmICghaXNHcm91cFYxKHRoaXMubW9kZWwuYXR0cmlidXRlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYHN0YXJ0TWlncmF0aW9uVG9HVjIvJHtsb2dJZH06IENhbm5vdCBzdGFydCwgbm90IGEgR3JvdXBWMSBncm91cGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm1pZ3JhdGlvbkRpYWxvZykge1xuICAgICAgICB0aGlzLm1pZ3JhdGlvbkRpYWxvZy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5taWdyYXRpb25EaWFsb2cgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfTtcbiAgICBvbkNsb3NlKCk7XG5cbiAgICBjb25zdCBtaWdyYXRlID0gKCkgPT4ge1xuICAgICAgb25DbG9zZSgpO1xuXG4gICAgICB0aGlzLmxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgICBuYW1lOiAnaW5pdGlhdGVNaWdyYXRpb25Ub0dyb3VwVjInLFxuICAgICAgICB0YXNrOiAoKSA9PiB3aW5kb3cuU2lnbmFsLkdyb3Vwcy5pbml0aWF0ZU1pZ3JhdGlvblRvR3JvdXBWMih0aGlzLm1vZGVsKSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBOb3RlOiB0aGlzIGNhbGwgd2lsbCB0aHJvdyBpZiwgYWZ0ZXIgZ2VuZXJhdGluZyBtZW1iZXIgbGlzdHMsIHdlIGFyZSBubyBsb25nZXIgYVxuICAgIC8vICAgbWVtYmVyIG9yIGFyZSBpbiB0aGUgcGVuZGluZyBtZW1iZXIgbGlzdC5cbiAgICBjb25zdCB7IGRyb3BwZWRHVjJNZW1iZXJJZHMsIHBlbmRpbmdNZW1iZXJzVjIgfSA9XG4gICAgICBhd2FpdCB0aGlzLmxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgICBuYW1lOiAnZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzJyxcbiAgICAgICAgdGFzazogKCkgPT4gd2luZG93LlNpZ25hbC5Hcm91cHMuZ2V0R3JvdXBNaWdyYXRpb25NZW1iZXJzKHRoaXMubW9kZWwpLFxuICAgICAgfSk7XG5cbiAgICBjb25zdCBpbnZpdGVkTWVtYmVySWRzID0gcGVuZGluZ01lbWJlcnNWMi5tYXAoXG4gICAgICAoaXRlbTogR3JvdXBWMlBlbmRpbmdNZW1iZXJUeXBlKSA9PiBpdGVtLnV1aWRcbiAgICApO1xuXG4gICAgdGhpcy5taWdyYXRpb25EaWFsb2cgPSBuZXcgUmVhY3RXcmFwcGVyVmlldyh7XG4gICAgICBjbGFzc05hbWU6ICdncm91cC12MS1taWdyYXRpb24td3JhcHBlcicsXG4gICAgICBKU1g6IHdpbmRvdy5TaWduYWwuU3RhdGUuUm9vdHMuY3JlYXRlR3JvdXBWMU1pZ3JhdGlvbk1vZGFsKFxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAge1xuICAgICAgICAgIGFyZVdlSW52aXRlZDogZmFsc2UsXG4gICAgICAgICAgZHJvcHBlZE1lbWJlcklkczogZHJvcHBlZEdWMk1lbWJlcklkcyxcbiAgICAgICAgICBoYXNNaWdyYXRlZDogZmFsc2UsXG4gICAgICAgICAgaW52aXRlZE1lbWJlcklkcyxcbiAgICAgICAgICBtaWdyYXRlLFxuICAgICAgICAgIG9uQ2xvc2UsXG4gICAgICAgIH1cbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICAvLyBUT0RPIERFU0tUT1AtMjQyNlxuICBhc3luYyBwcm9jZXNzQXR0YWNobWVudHMoZmlsZXM6IEFycmF5PEZpbGU+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpO1xuXG4gICAgY29uc3QgaXNSZWNvcmRpbmcgPVxuICAgICAgc3RhdGUuYXVkaW9SZWNvcmRlci5yZWNvcmRpbmdTdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdGUuUmVjb3JkaW5nO1xuXG4gICAgaWYgKGhhc0xpbmtQcmV2aWV3TG9hZGVkKCkgfHwgaXNSZWNvcmRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBhZGRBdHRhY2htZW50LFxuICAgICAgYWRkUGVuZGluZ0F0dGFjaG1lbnQsXG4gICAgICBwcm9jZXNzQXR0YWNobWVudHMsXG4gICAgICByZW1vdmVBdHRhY2htZW50LFxuICAgIH0gPSB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbXBvc2VyO1xuXG4gICAgYXdhaXQgcHJvY2Vzc0F0dGFjaG1lbnRzKHtcbiAgICAgIGFkZEF0dGFjaG1lbnQsXG4gICAgICBhZGRQZW5kaW5nQXR0YWNobWVudCxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLm1vZGVsLmlkLFxuICAgICAgZHJhZnRBdHRhY2htZW50czogdGhpcy5tb2RlbC5nZXQoJ2RyYWZ0QXR0YWNobWVudHMnKSB8fCBbXSxcbiAgICAgIGZpbGVzLFxuICAgICAgb25TaG93VG9hc3Q6ICh0b2FzdFR5cGU6IEF0dGFjaG1lbnRUb2FzdFR5cGUpID0+IHtcbiAgICAgICAgaWYgKHRvYXN0VHlwZSA9PT0gQXR0YWNobWVudFRvYXN0VHlwZS5Ub2FzdEZpbGVTaXplKSB7XG4gICAgICAgICAgc2hvd1RvYXN0KFRvYXN0RmlsZVNpemUsIHtcbiAgICAgICAgICAgIGxpbWl0OiAxMDAsXG4gICAgICAgICAgICB1bml0czogJ01CJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09IEF0dGFjaG1lbnRUb2FzdFR5cGUuVG9hc3REYW5nZXJvdXNGaWxlVHlwZSkge1xuICAgICAgICAgIHNob3dUb2FzdChUb2FzdERhbmdlcm91c0ZpbGVUeXBlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09IEF0dGFjaG1lbnRUb2FzdFR5cGUuVG9hc3RNYXhBdHRhY2htZW50cykge1xuICAgICAgICAgIHNob3dUb2FzdChUb2FzdE1heEF0dGFjaG1lbnRzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09IEF0dGFjaG1lbnRUb2FzdFR5cGUuVG9hc3RPbmVOb25JbWFnZUF0QVRpbWUpIHtcbiAgICAgICAgICBzaG93VG9hc3QoVG9hc3RPbmVOb25JbWFnZUF0QVRpbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRvYXN0VHlwZSA9PT1cbiAgICAgICAgICBBdHRhY2htZW50VG9hc3RUeXBlLlRvYXN0Q2Fubm90TWl4SW1hZ2VBbmROb25JbWFnZUF0dGFjaG1lbnRzXG4gICAgICAgICkge1xuICAgICAgICAgIHNob3dUb2FzdChUb2FzdENhbm5vdE1peEltYWdlQW5kTm9uSW1hZ2VBdHRhY2htZW50cyk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdG9hc3RUeXBlID09PSBBdHRhY2htZW50VG9hc3RUeXBlLlRvYXN0VW5hYmxlVG9Mb2FkQXR0YWNobWVudFxuICAgICAgICApIHtcbiAgICAgICAgICBzaG93VG9hc3QoVG9hc3RVbmFibGVUb0xvYWRBdHRhY2htZW50KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbW92ZUF0dGFjaG1lbnQsXG4gICAgfSk7XG4gIH1cblxuICB1bmxvYWQocmVhc29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsb2cuaW5mbyhcbiAgICAgICd1bmxvYWRpbmcgY29udmVyc2F0aW9uJyxcbiAgICAgIHRoaXMubW9kZWwuaWRGb3JMb2dnaW5nKCksXG4gICAgICAnZHVlIHRvOicsXG4gICAgICByZWFzb25cbiAgICApO1xuXG4gICAgY29uc3QgeyBjb252ZXJzYXRpb25VbmxvYWRlZCB9ID0gd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zO1xuICAgIGlmIChjb252ZXJzYXRpb25VbmxvYWRlZCkge1xuICAgICAgY29udmVyc2F0aW9uVW5sb2FkZWQodGhpcy5tb2RlbC5pZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdkcmFmdENoYW5nZWQnKSkge1xuICAgICAgaWYgKHRoaXMubW9kZWwuaGFzRHJhZnQoKSkge1xuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBhY3RpdmVfYXQgPSB0aGlzLm1vZGVsLmdldCgnYWN0aXZlX2F0JykgfHwgbm93O1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICBhY3RpdmVfYXQsXG4gICAgICAgICAgZHJhZnRDaGFuZ2VkOiBmYWxzZSxcbiAgICAgICAgICBkcmFmdFRpbWVzdGFtcDogbm93LFxuICAgICAgICAgIHRpbWVzdGFtcDogbm93LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICBkcmFmdENoYW5nZWQ6IGZhbHNlLFxuICAgICAgICAgIGRyYWZ0VGltZXN0YW1wOiBudWxsLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FpdCBoZXJlOyB3ZSBuZWVkIHRvIHRha2UgZG93biB0aGUgdmlld1xuICAgICAgdGhpcy5zYXZlTW9kZWwoKTtcblxuICAgICAgdGhpcy5tb2RlbC51cGRhdGVMYXN0TWVzc2FnZSgpO1xuICAgIH1cblxuICAgIHRoaXMuY29udmVyc2F0aW9uVmlldz8ucmVtb3ZlKCk7XG5cbiAgICBpZiAodGhpcy5jb250YWN0TW9kYWxWaWV3KSB7XG4gICAgICB0aGlzLmNvbnRhY3RNb2RhbFZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN0aWNrZXJQcmV2aWV3TW9kYWxWaWV3KSB7XG4gICAgICB0aGlzLnN0aWNrZXJQcmV2aWV3TW9kYWxWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5saWdodGJveFZpZXcpIHtcbiAgICAgIHRoaXMubGlnaHRib3hWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYW5lbHMgJiYgdGhpcy5wYW5lbHMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gdGhpcy5wYW5lbHMubGVuZ3RoOyBpIDwgbWF4OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgcGFuZWwgPSB0aGlzLnBhbmVsc1tpXTtcbiAgICAgICAgcGFuZWwudmlldy5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29udmVyc2F0aW9ucy5zZXRTZWxlY3RlZENvbnZlcnNhdGlvblBhbmVsRGVwdGgoMCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGlua1ByZXZpZXcoKTtcbiAgICBzdXNwZW5kTGlua1ByZXZpZXdzKCk7XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG5cbiAgYXN5bmMgb25Ecm9wKGU6IEpRdWVyeS5UcmlnZ2VyZWRFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghZS5vcmlnaW5hbEV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50ID0gZS5vcmlnaW5hbEV2ZW50IGFzIERyYWdFdmVudDtcbiAgICBpZiAoIWV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIudHlwZXNbMF0gIT09ICdGaWxlcycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IGV2ZW50LmRhdGFUcmFuc2ZlcjtcbiAgICB0aGlzLnByb2Nlc3NBdHRhY2htZW50cyhBcnJheS5mcm9tKGZpbGVzKSk7XG4gIH1cblxuICBvblBhc3RlKGU6IEpRdWVyeS5UcmlnZ2VyZWRFdmVudCk6IHZvaWQge1xuICAgIGlmICghZS5vcmlnaW5hbEV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50ID0gZS5vcmlnaW5hbEV2ZW50IGFzIENsaXBib2FyZEV2ZW50O1xuICAgIGlmICghZXZlbnQuY2xpcGJvYXJkRGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IGl0ZW1zIH0gPSBldmVudC5jbGlwYm9hcmREYXRhO1xuXG4gICAgY29uc3QgYW55SW1hZ2VzID0gWy4uLml0ZW1zXS5zb21lKFxuICAgICAgaXRlbSA9PiBpdGVtLnR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJ1xuICAgICk7XG4gICAgaWYgKCFhbnlJbWFnZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGZpbGVzOiBBcnJheTxGaWxlPiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChpdGVtc1tpXS50eXBlLnNwbGl0KCcvJylbMF0gPT09ICdpbWFnZScpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IGl0ZW1zW2ldLmdldEFzRmlsZSgpO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3NBdHRhY2htZW50cyhmaWxlcyk7XG4gIH1cblxuICBzeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsLFxuICAgIG1lc3NhZ2VSZXF1ZXN0VHlwZTogbnVtYmVyXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgbmFtZSxcbiAgICAgIHRhc2s6IG1vZGVsLnN5bmNNZXNzYWdlUmVxdWVzdFJlc3BvbnNlLmJpbmQobW9kZWwsIG1lc3NhZ2VSZXF1ZXN0VHlwZSksXG4gICAgfSk7XG4gIH1cblxuICBibG9ja0FuZFJlcG9ydFNwYW0obW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbWVzc2FnZVJlcXVlc3RFbnVtID0gUHJvdG8uU3luY01lc3NhZ2UuTWVzc2FnZVJlcXVlc3RSZXNwb25zZS5UeXBlO1xuXG4gICAgcmV0dXJuIHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICBuYW1lOiAnYmxvY2tBbmRSZXBvcnRTcGFtJyxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIG1vZGVsLnN5bmNNZXNzYWdlUmVxdWVzdFJlc3BvbnNlKG1lc3NhZ2VSZXF1ZXN0RW51bS5CTE9DSyksXG4gICAgICAgICAgYWRkUmVwb3J0U3BhbUpvYih7XG4gICAgICAgICAgICBjb252ZXJzYXRpb246IG1vZGVsLmZvcm1hdCgpLFxuICAgICAgICAgICAgZ2V0TWVzc2FnZVNlcnZlckd1aWRzRm9yU3BhbTpcbiAgICAgICAgICAgICAgd2luZG93LlNpZ25hbC5EYXRhLmdldE1lc3NhZ2VTZXJ2ZXJHdWlkc0ZvclNwYW0sXG4gICAgICAgICAgICBqb2JRdWV1ZTogcmVwb3J0U3BhbUpvYlF1ZXVlLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgc2hvd1RvYXN0KFRvYXN0UmVwb3J0ZWRTcGFtQW5kQmxvY2tlZCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZU1vZGVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHdpbmRvdy5TaWduYWwuRGF0YS51cGRhdGVDb252ZXJzYXRpb24odGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGFzeW5jIGNsZWFyQXR0YWNobWVudHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZHJhZnRBdHRhY2htZW50cyA9IHRoaXMubW9kZWwuZ2V0KCdkcmFmdEF0dGFjaG1lbnRzJykgfHwgW107XG4gICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgZHJhZnRBdHRhY2htZW50czogW10sXG4gICAgICBkcmFmdENoYW5nZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUF0dGFjaG1lbnRzVmlldygpO1xuXG4gICAgLy8gV2UncmUgZmluZSBkb2luZyB0aGlzIGFsbCBhdCBvbmNlOyBhdCBtb3N0IGl0IHNob3VsZCBiZSAzMiBhdHRhY2htZW50c1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuc2F2ZU1vZGVsKCksXG4gICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgZHJhZnRBdHRhY2htZW50cy5tYXAoYXR0YWNobWVudCA9PiBkZWxldGVEcmFmdEF0dGFjaG1lbnQoYXR0YWNobWVudCkpXG4gICAgICApLFxuICAgIF0pO1xuICB9XG5cbiAgaGFzRmlsZXMob3B0aW9uczogeyBpbmNsdWRlUGVuZGluZzogYm9vbGVhbiB9KTogYm9vbGVhbiB7XG4gICAgY29uc3QgZHJhZnRBdHRhY2htZW50cyA9IHRoaXMubW9kZWwuZ2V0KCdkcmFmdEF0dGFjaG1lbnRzJykgfHwgW107XG4gICAgaWYgKG9wdGlvbnMuaW5jbHVkZVBlbmRpbmcpIHtcbiAgICAgIHJldHVybiBkcmFmdEF0dGFjaG1lbnRzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRyYWZ0QXR0YWNobWVudHMuc29tZShpdGVtID0+ICFpdGVtLnBlbmRpbmcpO1xuICB9XG5cbiAgdXBkYXRlQXR0YWNobWVudHNWaWV3KCk6IHZvaWQge1xuICAgIGNvbnN0IGRyYWZ0QXR0YWNobWVudHMgPSB0aGlzLm1vZGVsLmdldCgnZHJhZnRBdHRhY2htZW50cycpIHx8IFtdO1xuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29tcG9zZXIucmVwbGFjZUF0dGFjaG1lbnRzKFxuICAgICAgdGhpcy5tb2RlbC5nZXQoJ2lkJyksXG4gICAgICBkcmFmdEF0dGFjaG1lbnRzXG4gICAgKTtcbiAgICBpZiAodGhpcy5oYXNGaWxlcyh7IGluY2x1ZGVQZW5kaW5nOiB0cnVlIH0pKSB7XG4gICAgICByZW1vdmVMaW5rUHJldmlldygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9uT3BlbmVkKG1lc3NhZ2VJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5tb2RlbC5vbk9wZW5TdGFydCgpO1xuXG4gICAgaWYgKG1lc3NhZ2VJZCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG5cbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubW9kZWwubG9hZEFuZFNjcm9sbChtZXNzYWdlSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvZy53YXJuKGBvbk9wZW5lZDogRGlkIG5vdCBmaW5kIG1lc3NhZ2UgJHttZXNzYWdlSWR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyByZXRyeVBsYWNlaG9sZGVycyB9ID0gd2luZG93LlNpZ25hbC5TZXJ2aWNlcztcbiAgICBpZiAocmV0cnlQbGFjZWhvbGRlcnMpIHtcbiAgICAgIGF3YWl0IHJldHJ5UGxhY2Vob2xkZXJzLmZpbmRCeUNvbnZlcnNhdGlvbkFuZE1hcmtPcGVuZWQodGhpcy5tb2RlbC5pZCk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9hZEFuZFVwZGF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgdGhpcy5tb2RlbC5sb2FkTmV3ZXN0TWVzc2FnZXModW5kZWZpbmVkLCB1bmRlZmluZWQpLFxuICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZUxhc3RNZXNzYWdlKCksXG4gICAgICAgIHRoaXMubW9kZWwudXBkYXRlVW5yZWFkKCksXG4gICAgICBdKTtcbiAgICB9O1xuXG4gICAgbG9hZEFuZFVwZGF0ZSgpO1xuXG4gICAgdGhpcy5mb2N1c01lc3NhZ2VGaWVsZCgpO1xuXG4gICAgY29uc3QgcXVvdGVkTWVzc2FnZUlkID0gdGhpcy5tb2RlbC5nZXQoJ3F1b3RlZE1lc3NhZ2VJZCcpO1xuICAgIGlmIChxdW90ZWRNZXNzYWdlSWQpIHtcbiAgICAgIHRoaXMuc2V0UXVvdGVNZXNzYWdlKHF1b3RlZE1lc3NhZ2VJZCk7XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlbC5mZXRjaExhdGVzdEdyb3VwVjJEYXRhKCk7XG4gICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgdGhpcy5tb2RlbC50aHJvdHRsZWRNYXliZU1pZ3JhdGVWMUdyb3VwICE9PSB1bmRlZmluZWQsXG4gICAgICAnQ29udmVyc2F0aW9uIG1vZGVsIHNob3VsZCBiZSBpbml0aWFsaXplZCdcbiAgICApO1xuICAgIHRoaXMubW9kZWwudGhyb3R0bGVkTWF5YmVNaWdyYXRlVjFHcm91cCgpO1xuICAgIHN0cmljdEFzc2VydChcbiAgICAgIHRoaXMubW9kZWwudGhyb3R0bGVkRmV0Y2hTTVNPbmx5VVVJRCAhPT0gdW5kZWZpbmVkLFxuICAgICAgJ0NvbnZlcnNhdGlvbiBtb2RlbCBzaG91bGQgYmUgaW5pdGlhbGl6ZWQnXG4gICAgKTtcbiAgICB0aGlzLm1vZGVsLnRocm90dGxlZEZldGNoU01TT25seVVVSUQoKTtcblxuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0VXVpZChVVUlES2luZC5BQ0kpO1xuICAgIGlmIChcbiAgICAgICFpc0dyb3VwKHRoaXMubW9kZWwuYXR0cmlidXRlcykgfHxcbiAgICAgIChvdXJVdWlkICYmIHRoaXMubW9kZWwuaGFzTWVtYmVyKG91clV1aWQpKVxuICAgICkge1xuICAgICAgc3RyaWN0QXNzZXJ0KFxuICAgICAgICB0aGlzLm1vZGVsLnRocm90dGxlZEdldFByb2ZpbGVzICE9PSB1bmRlZmluZWQsXG4gICAgICAgICdDb252ZXJzYXRpb24gbW9kZWwgc2hvdWxkIGJlIGluaXRpYWxpemVkJ1xuICAgICAgKTtcbiAgICAgIGF3YWl0IHRoaXMubW9kZWwudGhyb3R0bGVkR2V0UHJvZmlsZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGVsLnVwZGF0ZVZlcmlmaWVkKCk7XG4gIH1cblxuICBhc3luYyBzaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbChtZXNzYWdlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuZ2xvYmFsTW9kYWxzLnRvZ2dsZUZvcndhcmRNZXNzYWdlTW9kYWwobWVzc2FnZUlkKTtcbiAgfVxuXG4gIHNob3dBbGxNZWRpYSgpOiB2b2lkIHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZHVsZS1tZWRpYS1nYWxsZXJ5JykubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgZmV0Y2ggbW9yZSBkb2N1bWVudHMgdGhhbiBtZWRpYSBhcyB0aGV5IGRvblx1MjAxOXQgcmVxdWlyZSB0byBiZSBsb2FkZWRcbiAgICAvLyBpbnRvIG1lbW9yeSByaWdodCBhd2F5LiBSZXZpc2l0IHRoaXMgb25jZSB3ZSBoYXZlIGluZmluaXRlIHNjcm9sbGluZzpcbiAgICBjb25zdCBERUZBVUxUX01FRElBX0ZFVENIX0NPVU5UID0gNTA7XG4gICAgY29uc3QgREVGQVVMVF9ET0NVTUVOVFNfRkVUQ0hfQ09VTlQgPSAxNTA7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb25JZCA9IHRoaXMubW9kZWwuZ2V0KCdpZCcpO1xuICAgIGNvbnN0IG91clV1aWQgPSB3aW5kb3cudGV4dHNlY3VyZS5zdG9yYWdlLnVzZXIuZ2V0Q2hlY2tlZFV1aWQoKS50b1N0cmluZygpO1xuXG4gICAgY29uc3QgZ2V0UHJvcHMgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByYXdNZWRpYSA9XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRNZXNzYWdlc1dpdGhWaXN1YWxNZWRpYUF0dGFjaG1lbnRzKFxuICAgICAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxpbWl0OiBERUZBVUxUX01FRElBX0ZFVENIX0NPVU5ULFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIGNvbnN0IHJhd0RvY3VtZW50cyA9XG4gICAgICAgIGF3YWl0IHdpbmRvdy5TaWduYWwuRGF0YS5nZXRNZXNzYWdlc1dpdGhGaWxlQXR0YWNobWVudHMoXG4gICAgICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGltaXQ6IERFRkFVTFRfRE9DVU1FTlRTX0ZFVENIX0NPVU5ULFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgLy8gRmlyc3Qgd2UgdXBncmFkZSB0aGVzZSBtZXNzYWdlcyB0byBlbnN1cmUgdGhhdCB0aGV5IGhhdmUgdGh1bWJuYWlsc1xuICAgICAgZm9yIChsZXQgbWF4ID0gcmF3TWVkaWEubGVuZ3RoLCBpID0gMDsgaSA8IG1heDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByYXdNZWRpYVtpXTtcbiAgICAgICAgY29uc3QgeyBzY2hlbWFWZXJzaW9uIH0gPSBtZXNzYWdlO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBzY2hlbWFWZXJzaW9uICYmXG4gICAgICAgICAgc2NoZW1hVmVyc2lvbiA8IE1lc3NhZ2UuVkVSU0lPTl9ORUVERURfRk9SX0RJU1BMQVlcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gWWVwLCB3ZSByZWFsbHkgZG8gd2FudCB0byB3YWl0IGZvciBlYWNoIG9mIHRoZXNlXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgICByYXdNZWRpYVtpXSA9IGF3YWl0IHVwZ3JhZGVNZXNzYWdlU2NoZW1hKG1lc3NhZ2UpO1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgICAgYXdhaXQgd2luZG93LlNpZ25hbC5EYXRhLnNhdmVNZXNzYWdlKHJhd01lZGlhW2ldLCB7IG91clV1aWQgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWE6IEFycmF5PE1lZGlhVHlwZT4gPSBmbGF0dGVuKFxuICAgICAgICByYXdNZWRpYS5tYXAobWVzc2FnZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChtZXNzYWdlLmF0dGFjaG1lbnRzIHx8IFtdKS5tYXAoXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLFxuICAgICAgICAgICAgICBpbmRleDogbnVtYmVyXG4gICAgICAgICAgICApOiBNZWRpYVR5cGUgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIWF0dGFjaG1lbnQucGF0aCB8fFxuICAgICAgICAgICAgICAgICFhdHRhY2htZW50LnRodW1ibmFpbCB8fFxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQucGVuZGluZyB8fFxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuZXJyb3JcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgeyB0aHVtYm5haWwgfSA9IGF0dGFjaG1lbnQ7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGF0aDogYXR0YWNobWVudC5wYXRoLFxuICAgICAgICAgICAgICAgIG9iamVjdFVSTDogZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aChhdHRhY2htZW50LnBhdGgpLFxuICAgICAgICAgICAgICAgIHRodW1ibmFpbE9iamVjdFVybDogdGh1bWJuYWlsPy5wYXRoXG4gICAgICAgICAgICAgICAgICA/IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgodGh1bWJuYWlsLnBhdGgpXG4gICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogYXR0YWNobWVudC5jb250ZW50VHlwZSxcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzOiBtZXNzYWdlLmF0dGFjaG1lbnRzIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBtZXNzYWdlLnNvdXJjZVV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgZTE2NDogbWVzc2FnZS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIH0pPy5pZCB8fCBtZXNzYWdlLmNvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgaWQ6IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgICAgICAgICByZWNlaXZlZF9hdDogbWVzc2FnZS5yZWNlaXZlZF9hdCxcbiAgICAgICAgICAgICAgICAgIHJlY2VpdmVkX2F0X21zOiBOdW1iZXIobWVzc2FnZS5yZWNlaXZlZF9hdF9tcyksXG4gICAgICAgICAgICAgICAgICBzZW50X2F0OiBtZXNzYWdlLnNlbnRfYXQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKS5maWx0ZXIoaXNOb3ROaWwpO1xuXG4gICAgICAvLyBVbmxpa2UgdmlzdWFsIG1lZGlhLCBvbmx5IG9uZSBub24taW1hZ2UgYXR0YWNobWVudCBpcyBzdXBwb3J0ZWRcbiAgICAgIGNvbnN0IGRvY3VtZW50czogQXJyYXk8TWVkaWFJdGVtVHlwZT4gPSBbXTtcbiAgICAgIHJhd0RvY3VtZW50cy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICBjb25zdCBhdHRhY2htZW50cyA9IG1lc3NhZ2UuYXR0YWNobWVudHMgfHwgW107XG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBhdHRhY2htZW50c1swXTtcbiAgICAgICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnRzLnB1c2goe1xuICAgICAgICAgIGNvbnRlbnRUeXBlOiBhdHRhY2htZW50LmNvbnRlbnRUeXBlLFxuICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgIGF0dGFjaG1lbnQsXG4gICAgICAgICAgLy8gV2UgZG8gdGhpcyBjYXN0IGJlY2F1c2Ugd2Uga25vdyB0aGVyZSBhdHRhY2htZW50cyAoc2VlIHRoZSBjaGVja3MgYWJvdmUpLlxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgYXMgTWVzc2FnZUF0dHJpYnV0ZXNUeXBlICYge1xuICAgICAgICAgICAgYXR0YWNobWVudHM6IEFycmF5PEF0dGFjaG1lbnRUeXBlPjtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBvbkl0ZW1DbGljayA9IGFzeW5jICh7XG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGF0dGFjaG1lbnQsXG4gICAgICAgIHR5cGUsXG4gICAgICB9OiBJdGVtQ2xpY2tFdmVudCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlICdkb2N1bWVudHMnOiB7XG4gICAgICAgICAgICBzYXZlQXR0YWNobWVudChhdHRhY2htZW50LCBtZXNzYWdlLnNlbnRfYXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnbWVkaWEnOiB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZE1lZGlhID1cbiAgICAgICAgICAgICAgbWVkaWEuZmluZChpdGVtID0+IGF0dGFjaG1lbnQucGF0aCA9PT0gaXRlbS5wYXRoKSB8fCBtZWRpYVswXTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0xpZ2h0Ym94Rm9yTWVkaWEoc2VsZWN0ZWRNZWRpYSwgbWVkaWEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gYXR0YWNobWVudCB0eXBlOiAnJHt0eXBlfSdgKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9jdW1lbnRzLFxuICAgICAgICBtZWRpYSxcbiAgICAgICAgb25JdGVtQ2xpY2ssXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNZXNzYWdlSWRzKCk6IEFycmF5PHN0cmluZyB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQge1xuICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgY29uc3QgYnlDb252ZXJzYXRpb24gPSBzdGF0ZT8uY29udmVyc2F0aW9ucz8ubWVzc2FnZXNCeUNvbnZlcnNhdGlvbjtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYnlDb252ZXJzYXRpb24gJiYgYnlDb252ZXJzYXRpb25bY29udmVyc2F0aW9uSWRdO1xuICAgICAgaWYgKCFtZXNzYWdlcyB8fCAhbWVzc2FnZXMubWVzc2FnZUlkcykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVzc2FnZXMubWVzc2FnZUlkcztcbiAgICB9XG5cbiAgICAvLyBEZXRlY3QgbWVzc2FnZSBjaGFuZ2VzIGluIHRoZSBjdXJyZW50IGNvbnZlcnNhdGlvblxuICAgIGxldCBwcmV2aW91c01lc3NhZ2VMaXN0OiBBcnJheTxzdHJpbmcgfCB1bmRlZmluZWQ+IHwgdW5kZWZpbmVkO1xuICAgIHByZXZpb3VzTWVzc2FnZUxpc3QgPSBnZXRNZXNzYWdlSWRzKCk7XG5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IHdpbmRvdy5yZWR1eFN0b3JlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50TWVzc2FnZUxpc3QgPSBnZXRNZXNzYWdlSWRzKCk7XG4gICAgICBpZiAoY3VycmVudE1lc3NhZ2VMaXN0ICE9PSBwcmV2aW91c01lc3NhZ2VMaXN0KSB7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICBwcmV2aW91c01lc3NhZ2VMaXN0ID0gY3VycmVudE1lc3NhZ2VMaXN0O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogJ3BhbmVsJyxcbiAgICAgIC8vIFdlIHByZXNlbnQgYW4gZW1wdHkgcGFuZWwgYnJpZWZseSwgd2hpbGUgd2Ugd2FpdCBmb3IgcHJvcHMgdG8gbG9hZC5cbiAgICAgIEpTWDogPD48Lz4sXG4gICAgICBvbkNsb3NlOiAoKSA9PiB7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlclRpdGxlID0gd2luZG93LmkxOG4oJ2FsbE1lZGlhJyk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGF3YWl0IGdldFByb3BzKCk7XG4gICAgICB2aWV3LnVwZGF0ZSg8TWVkaWFHYWxsZXJ5IGkxOG49e3dpbmRvdy5pMThufSB7Li4ucHJvcHN9IC8+KTtcbiAgICB9O1xuXG4gICAgdGhpcy5hZGRQYW5lbCh7IHZpZXcsIGhlYWRlclRpdGxlIH0pO1xuXG4gICAgdXBkYXRlKCk7XG4gIH1cblxuICBmb2N1c01lc3NhZ2VGaWVsZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYW5lbHMgJiYgdGhpcy5wYW5lbHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb21wb3NpdGlvbkFwaS5jdXJyZW50Py5mb2N1c0lucHV0KCk7XG4gIH1cblxuICBkaXNhYmxlTWVzc2FnZUZpZWxkKCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9zaXRpb25BcGkuY3VycmVudD8uc2V0RGlzYWJsZWQodHJ1ZSk7XG4gIH1cblxuICBlbmFibGVNZXNzYWdlRmllbGQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb3NpdGlvbkFwaS5jdXJyZW50Py5zZXREaXNhYmxlZChmYWxzZSk7XG4gIH1cblxuICByZXNldEVtb2ppUmVzdWx0cygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvc2l0aW9uQXBpLmN1cnJlbnQ/LnJlc2V0RW1vamlSZXN1bHRzKCk7XG4gIH1cblxuICBzaG93R1YxTWVtYmVycygpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhY3RDb2xsZWN0aW9uLCBpZCB9ID0gdGhpcy5tb2RlbDtcblxuICAgIGNvbnN0IG1lbWJlcnNoaXBzID1cbiAgICAgIGNvbnRhY3RDb2xsZWN0aW9uPy5tYXAoKGNvbnZlcnNhdGlvbjogQ29udmVyc2F0aW9uTW9kZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc0FkbWluOiBmYWxzZSxcbiAgICAgICAgICBtZW1iZXI6IGNvbnZlcnNhdGlvbi5mb3JtYXQoKSxcbiAgICAgICAgfTtcbiAgICAgIH0pIHx8IFtdO1xuXG4gICAgY29uc3QgcmVkdXhTdGF0ZSA9IHdpbmRvdy5yZWR1eFN0b3JlLmdldFN0YXRlKCk7XG4gICAgY29uc3QgZ2V0UHJlZmVycmVkQmFkZ2UgPSBnZXRQcmVmZXJyZWRCYWRnZVNlbGVjdG9yKHJlZHV4U3RhdGUpO1xuICAgIGNvbnN0IHRoZW1lID0gZ2V0VGhlbWUocmVkdXhTdGF0ZSk7XG5cbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAnZ3JvdXAtbWVtYmVyLWxpc3QgcGFuZWwnLFxuICAgICAgSlNYOiAoXG4gICAgICAgIDxDb252ZXJzYXRpb25EZXRhaWxzTWVtYmVyc2hpcExpc3RcbiAgICAgICAgICBjYW5BZGROZXdNZW1iZXJzPXtmYWxzZX1cbiAgICAgICAgICBjb252ZXJzYXRpb25JZD17aWR9XG4gICAgICAgICAgaTE4bj17d2luZG93LmkxOG59XG4gICAgICAgICAgZ2V0UHJlZmVycmVkQmFkZ2U9e2dldFByZWZlcnJlZEJhZGdlfVxuICAgICAgICAgIG1heFNob3duTWVtYmVyQ291bnQ9ezMyfVxuICAgICAgICAgIG1lbWJlcnNoaXBzPXttZW1iZXJzaGlwc31cbiAgICAgICAgICBzaG93Q29udGFjdE1vZGFsPXtjb250YWN0SWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zaG93Q29udGFjdE1vZGFsKGNvbnRhY3RJZCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0aGVtZT17dGhlbWV9XG4gICAgICAgIC8+XG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRQYW5lbCh7IHZpZXcgfSk7XG4gICAgdmlldy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNob3dTYWZldHlOdW1iZXIoaWQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgY29udmVyc2F0aW9uOiB1bmRlZmluZWQgfCBDb252ZXJzYXRpb25Nb2RlbDtcblxuICAgIGlmICghaWQgJiYgaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5tb2RlbC5hdHRyaWJ1dGVzKSkge1xuICAgICAgY29udmVyc2F0aW9uID0gdGhpcy5tb2RlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udmVyc2F0aW9uID0gd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0KGlkKTtcbiAgICB9XG4gICAgaWYgKGNvbnZlcnNhdGlvbikge1xuICAgICAgd2luZG93LnJlZHV4QWN0aW9ucy5nbG9iYWxNb2RhbHMudG9nZ2xlU2FmZXR5TnVtYmVyTW9kYWwoXG4gICAgICAgIGNvbnZlcnNhdGlvbi5nZXQoJ2lkJylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZG93bmxvYWRBdHRhY2htZW50V3JhcHBlcihcbiAgICBtZXNzYWdlSWQ6IHN0cmluZyxcbiAgICBwcm92aWRlZEF0dGFjaG1lbnQ/OiBBdHRhY2htZW50VHlwZVxuICApOiB2b2lkIHtcbiAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobWVzc2FnZUlkKTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGRvd25sb2FkQXR0YWNobWVudFdyYXBwZXI6IE1lc3NhZ2UgJHttZXNzYWdlSWR9IG1pc3NpbmchYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGF0dGFjaG1lbnRzLCBzZW50X2F0OiB0aW1lc3RhbXAgfSA9IG1lc3NhZ2UuYXR0cmlidXRlcztcbiAgICBpZiAoIWF0dGFjaG1lbnRzIHx8IGF0dGFjaG1lbnRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2htZW50ID1cbiAgICAgIHByb3ZpZGVkQXR0YWNobWVudCAmJiBhdHRhY2htZW50cy5pbmNsdWRlcyhwcm92aWRlZEF0dGFjaG1lbnQpXG4gICAgICAgID8gcHJvdmlkZWRBdHRhY2htZW50XG4gICAgICAgIDogYXR0YWNobWVudHNbMF07XG4gICAgY29uc3QgeyBmaWxlTmFtZSB9ID0gYXR0YWNobWVudDtcblxuICAgIGNvbnN0IGlzRGFuZ2Vyb3VzID0gd2luZG93LlNpZ25hbC5VdGlsLmlzRmlsZURhbmdlcm91cyhmaWxlTmFtZSB8fCAnJyk7XG5cbiAgICB0aGlzLmRvd25sb2FkQXR0YWNobWVudCh7IGF0dGFjaG1lbnQsIHRpbWVzdGFtcCwgaXNEYW5nZXJvdXMgfSk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZEF0dGFjaG1lbnQoe1xuICAgIGF0dGFjaG1lbnQsXG4gICAgdGltZXN0YW1wLFxuICAgIGlzRGFuZ2Vyb3VzLFxuICB9OiB7XG4gICAgYXR0YWNobWVudDogQXR0YWNobWVudFR5cGU7XG4gICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgaXNEYW5nZXJvdXM6IGJvb2xlYW47XG4gIH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoaXNEYW5nZXJvdXMpIHtcbiAgICAgIHNob3dUb2FzdChUb2FzdERhbmdlcm91c0ZpbGVUeXBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gc2F2ZUF0dGFjaG1lbnQoYXR0YWNobWVudCwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGFzeW5jIGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlKG1lc3NhZ2VJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nLmluZm8oJ2Rpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlOiBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgbWVzc2FnZScpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5nZXRCeUlkKG1lc3NhZ2VJZCk7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGRpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlOiBNZXNzYWdlICR7bWVzc2FnZUlkfSBtaXNzaW5nIWApO1xuICAgIH1cblxuICAgIGlmICghaXNUYXBUb1ZpZXcobWVzc2FnZS5hdHRyaWJ1dGVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IE1lc3NhZ2UgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfSBpcyBub3QgYSB0YXAgdG8gdmlldyBtZXNzYWdlYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5pc0VyYXNlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBkaXNwbGF5VGFwVG9WaWV3TWVzc2FnZTogTWVzc2FnZSAke21lc3NhZ2UuaWRGb3JMb2dnaW5nKCl9IGlzIGFscmVhZHkgZXJhc2VkYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdEF0dGFjaG1lbnQgPSAobWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW10pWzBdO1xuICAgIGlmICghZmlyc3RBdHRhY2htZW50IHx8ICFmaXJzdEF0dGFjaG1lbnQucGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZGlzcGxheVRhcFRvVmlld01lc3NhZ2U6IE1lc3NhZ2UgJHttZXNzYWdlLmlkRm9yTG9nZ2luZygpfSBoYWQgbm8gZmlyc3QgYXR0YWNobWVudCB3aXRoIHBhdGhgXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IGdldEFic29sdXRlQXR0YWNobWVudFBhdGgoZmlyc3RBdHRhY2htZW50LnBhdGgpO1xuICAgIGNvbnN0IHsgcGF0aDogdGVtcFBhdGggfSA9IGF3YWl0IGNvcHlJbnRvVGVtcERpcmVjdG9yeShhYnNvbHV0ZVBhdGgpO1xuICAgIGNvbnN0IHRlbXBBdHRhY2htZW50ID0ge1xuICAgICAgLi4uZmlyc3RBdHRhY2htZW50LFxuICAgICAgcGF0aDogdGVtcFBhdGgsXG4gICAgfTtcblxuICAgIGF3YWl0IG1lc3NhZ2UubWFya1ZpZXdPbmNlTWVzc2FnZVZpZXdlZCgpO1xuXG4gICAgY29uc3QgY2xvc2UgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcobWVzc2FnZSk7XG4gICAgICAgIGNsb3NlTGlnaHRib3goKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGRlbGV0ZVRlbXBGaWxlKHRlbXBQYXRoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5saXN0ZW5UbyhtZXNzYWdlLCAnZXhwaXJlZCcsIGNsb3NlKTtcbiAgICB0aGlzLmxpc3RlblRvKG1lc3NhZ2UsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBzaG93TGlnaHRib3goZ2V0UHJvcHMoKSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRQcm9wcyA9ICgpOiBDb21wb25lbnRQcm9wczx0eXBlb2YgTGlnaHRib3g+ID0+IHtcbiAgICAgIGNvbnN0IHsgcGF0aCwgY29udGVudFR5cGUgfSA9IHRlbXBBdHRhY2htZW50O1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjbG9zZSxcbiAgICAgICAgaTE4bjogd2luZG93LmkxOG4sXG4gICAgICAgIG1lZGlhOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXR0YWNobWVudDogdGVtcEF0dGFjaG1lbnQsXG4gICAgICAgICAgICBvYmplY3RVUkw6IGdldEFic29sdXRlVGVtcFBhdGgocGF0aCksXG4gICAgICAgICAgICBjb250ZW50VHlwZSxcbiAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICBhdHRhY2htZW50czogbWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW10sXG4gICAgICAgICAgICAgIGlkOiBtZXNzYWdlLmdldCgnaWQnKSxcbiAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IG1lc3NhZ2UuZ2V0KCdjb252ZXJzYXRpb25JZCcpLFxuICAgICAgICAgICAgICByZWNlaXZlZF9hdDogbWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0JyksXG4gICAgICAgICAgICAgIHJlY2VpdmVkX2F0X21zOiBOdW1iZXIobWVzc2FnZS5nZXQoJ3JlY2VpdmVkX2F0X21zJykpLFxuICAgICAgICAgICAgICBzZW50X2F0OiBtZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpc1ZpZXdPbmNlOiB0cnVlLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgc2hvd0xpZ2h0Ym94KGdldFByb3BzKCkpO1xuXG4gICAgbG9nLmluZm8oJ2Rpc3BsYXlUYXBUb1ZpZXdNZXNzYWdlOiBzaG93ZWQgbGlnaHRib3gnKTtcbiAgfVxuXG4gIGRlbGV0ZU1lc3NhZ2UobWVzc2FnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobWVzc2FnZUlkKTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZGVsZXRlTWVzc2FnZTogTWVzc2FnZSAke21lc3NhZ2VJZH0gbWlzc2luZyFgKTtcbiAgICB9XG5cbiAgICB3aW5kb3cuc2hvd0NvbmZpcm1hdGlvbkRpYWxvZyh7XG4gICAgICBjb25maXJtU3R5bGU6ICduZWdhdGl2ZScsXG4gICAgICBtZXNzYWdlOiB3aW5kb3cuaTE4bignZGVsZXRlV2FybmluZycpLFxuICAgICAgb2tUZXh0OiB3aW5kb3cuaTE4bignZGVsZXRlJyksXG4gICAgICByZXNvbHZlOiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5TaWduYWwuRGF0YS5yZW1vdmVNZXNzYWdlKG1lc3NhZ2UuaWQpO1xuICAgICAgICBpZiAoaXNPdXRnb2luZyhtZXNzYWdlLmF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5kZWNyZW1lbnRTZW50TWVzc2FnZUNvdW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5kZWNyZW1lbnRNZXNzYWdlQ291bnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0UGFuZWwoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBkZWxldGVNZXNzYWdlRm9yRXZlcnlvbmUobWVzc2FnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtZXNzYWdlID0gd2luZG93Lk1lc3NhZ2VDb250cm9sbGVyLmdldEJ5SWQobWVzc2FnZUlkKTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGRlbGV0ZU1lc3NhZ2VGb3JFdmVyeW9uZTogTWVzc2FnZSAke21lc3NhZ2VJZH0gbWlzc2luZyFgXG4gICAgICApO1xuICAgIH1cblxuICAgIHdpbmRvdy5zaG93Q29uZmlybWF0aW9uRGlhbG9nKHtcbiAgICAgIGNvbmZpcm1TdHlsZTogJ25lZ2F0aXZlJyxcbiAgICAgIG1lc3NhZ2U6IHdpbmRvdy5pMThuKCdkZWxldGVGb3JFdmVyeW9uZVdhcm5pbmcnKSxcbiAgICAgIG9rVGV4dDogd2luZG93LmkxOG4oJ2RlbGV0ZScpLFxuICAgICAgcmVzb2x2ZTogYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHNlbmREZWxldGVGb3JFdmVyeW9uZU1lc3NhZ2UodGhpcy5tb2RlbC5hdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICBpZDogbWVzc2FnZS5pZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbWVzc2FnZS5nZXQoJ3NlbnRfYXQnKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAnRXJyb3Igc2VuZGluZyBkZWxldGUtZm9yLWV2ZXJ5b25lJyxcbiAgICAgICAgICAgIGVycm9yICYmIGVycm9yLnN0YWNrLFxuICAgICAgICAgICAgbWVzc2FnZUlkXG4gICAgICAgICAgKTtcbiAgICAgICAgICBzaG93VG9hc3QoVG9hc3REZWxldGVGb3JFdmVyeW9uZUZhaWxlZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldFBhbmVsKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc2hvd1N0aWNrZXJQYWNrUHJldmlldyhwYWNrSWQ6IHN0cmluZywgcGFja0tleTogc3RyaW5nKTogdm9pZCB7XG4gICAgU3RpY2tlcnMuZG93bmxvYWRFcGhlbWVyYWxQYWNrKHBhY2tJZCwgcGFja0tleSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIHBhY2tJZCxcbiAgICAgIG9uQ2xvc2U6IGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RpY2tlclByZXZpZXdNb2RhbFZpZXcpIHtcbiAgICAgICAgICB0aGlzLnN0aWNrZXJQcmV2aWV3TW9kYWxWaWV3LnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuc3RpY2tlclByZXZpZXdNb2RhbFZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgU3RpY2tlcnMucmVtb3ZlRXBoZW1lcmFsUGFjayhwYWNrSWQpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgdGhpcy5zdGlja2VyUHJldmlld01vZGFsVmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0aWNrZXItcHJldmlldy1tb2RhbC13cmFwcGVyJyxcbiAgICAgIEpTWDogd2luZG93LlNpZ25hbC5TdGF0ZS5Sb290cy5jcmVhdGVTdGlja2VyUHJldmlld01vZGFsKFxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAgcHJvcHNcbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBzaG93TGlnaHRib3hGb3JNZWRpYShcbiAgICBzZWxlY3RlZE1lZGlhSXRlbTogTWVkaWFJdGVtVHlwZSxcbiAgICBtZWRpYTogQXJyYXk8TWVkaWFJdGVtVHlwZT4gPSBbXVxuICApOiB2b2lkIHtcbiAgICBjb25zdCBvblNhdmUgPSBhc3luYyAoe1xuICAgICAgYXR0YWNobWVudCxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBpbmRleCxcbiAgICB9OiB7XG4gICAgICBhdHRhY2htZW50OiBBdHRhY2htZW50VHlwZTtcbiAgICAgIG1lc3NhZ2U6IE1lZGlhSXRlbU1lc3NhZ2VUeXBlO1xuICAgICAgaW5kZXg6IG51bWJlcjtcbiAgICB9KSA9PiB7XG4gICAgICByZXR1cm4gc2F2ZUF0dGFjaG1lbnQoYXR0YWNobWVudCwgbWVzc2FnZS5zZW50X2F0LCBpbmRleCArIDEpO1xuICAgIH07XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gbWVkaWEuZmluZEluZGV4KFxuICAgICAgbWVkaWFJdGVtID0+XG4gICAgICAgIG1lZGlhSXRlbS5hdHRhY2htZW50LnBhdGggPT09IHNlbGVjdGVkTWVkaWFJdGVtLmF0dGFjaG1lbnQucGF0aFxuICAgICk7XG5cbiAgICBzaG93TGlnaHRib3goe1xuICAgICAgY2xvc2U6IGNsb3NlTGlnaHRib3gsXG4gICAgICBpMThuOiB3aW5kb3cuaTE4bixcbiAgICAgIGdldENvbnZlcnNhdGlvbjogZ2V0Q29udmVyc2F0aW9uU2VsZWN0b3Iod2luZG93LnJlZHV4U3RvcmUuZ2V0U3RhdGUoKSksXG4gICAgICBtZWRpYSxcbiAgICAgIG9uRm9yd2FyZDogbWVzc2FnZUlkID0+IHtcbiAgICAgICAgdGhpcy5zaG93Rm9yd2FyZE1lc3NhZ2VNb2RhbChtZXNzYWdlSWQpO1xuICAgICAgfSxcbiAgICAgIG9uU2F2ZSxcbiAgICAgIHNlbGVjdGVkSW5kZXg6IHNlbGVjdGVkSW5kZXggPj0gMCA/IHNlbGVjdGVkSW5kZXggOiAwLFxuICAgIH0pO1xuICB9XG5cbiAgc2hvd0xpZ2h0Ym94KHtcbiAgICBhdHRhY2htZW50LFxuICAgIG1lc3NhZ2VJZCxcbiAgfToge1xuICAgIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlO1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIHNob3dTaW5nbGU/OiBib29sZWFuO1xuICB9KTogdm9pZCB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5nZXRCeUlkKG1lc3NhZ2VJZCk7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNob3dMaWdodGJveDogTWVzc2FnZSAke21lc3NhZ2VJZH0gbWlzc2luZyFgKTtcbiAgICB9XG4gICAgY29uc3Qgc3RpY2tlciA9IG1lc3NhZ2UuZ2V0KCdzdGlja2VyJyk7XG4gICAgaWYgKHN0aWNrZXIpIHtcbiAgICAgIGNvbnN0IHsgcGFja0lkLCBwYWNrS2V5IH0gPSBzdGlja2VyO1xuICAgICAgdGhpcy5zaG93U3RpY2tlclBhY2tQcmV2aWV3KHBhY2tJZCwgcGFja0tleSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb250ZW50VHlwZSB9ID0gYXR0YWNobWVudDtcblxuICAgIGlmIChcbiAgICAgICF3aW5kb3cuU2lnbmFsLlV0aWwuR29vZ2xlQ2hyb21lLmlzSW1hZ2VUeXBlU3VwcG9ydGVkKGNvbnRlbnRUeXBlKSAmJlxuICAgICAgIXdpbmRvdy5TaWduYWwuVXRpbC5Hb29nbGVDaHJvbWUuaXNWaWRlb1R5cGVTdXBwb3J0ZWQoY29udGVudFR5cGUpXG4gICAgKSB7XG4gICAgICB0aGlzLmRvd25sb2FkQXR0YWNobWVudFdyYXBwZXIobWVzc2FnZUlkLCBhdHRhY2htZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2htZW50czogQXJyYXk8QXR0YWNobWVudFR5cGU+ID0gbWVzc2FnZS5nZXQoJ2F0dGFjaG1lbnRzJykgfHwgW107XG5cbiAgICBjb25zdCBsb29wID0gaXNHSUYoYXR0YWNobWVudHMpO1xuXG4gICAgY29uc3QgbWVkaWEgPSBhdHRhY2htZW50c1xuICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0udGh1bWJuYWlsICYmICFpdGVtLnBlbmRpbmcgJiYgIWl0ZW0uZXJyb3IpXG4gICAgICAubWFwKChpdGVtLCBpbmRleCkgPT4gKHtcbiAgICAgICAgb2JqZWN0VVJMOiBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKGl0ZW0ucGF0aCA/PyAnJyksXG4gICAgICAgIHBhdGg6IGl0ZW0ucGF0aCxcbiAgICAgICAgY29udGVudFR5cGU6IGl0ZW0uY29udGVudFR5cGUsXG4gICAgICAgIGxvb3AsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IG1lc3NhZ2UuZ2V0KCdhdHRhY2htZW50cycpIHx8IFtdLFxuICAgICAgICAgIGlkOiBtZXNzYWdlLmdldCgnaWQnKSxcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDpcbiAgICAgICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmxvb2t1cE9yQ3JlYXRlKHtcbiAgICAgICAgICAgICAgdXVpZDogbWVzc2FnZS5nZXQoJ3NvdXJjZVV1aWQnKSxcbiAgICAgICAgICAgICAgZTE2NDogbWVzc2FnZS5nZXQoJ3NvdXJjZScpLFxuICAgICAgICAgICAgfSk/LmlkIHx8IG1lc3NhZ2UuZ2V0KCdjb252ZXJzYXRpb25JZCcpLFxuICAgICAgICAgIHJlY2VpdmVkX2F0OiBtZXNzYWdlLmdldCgncmVjZWl2ZWRfYXQnKSxcbiAgICAgICAgICByZWNlaXZlZF9hdF9tczogTnVtYmVyKG1lc3NhZ2UuZ2V0KCdyZWNlaXZlZF9hdF9tcycpKSxcbiAgICAgICAgICBzZW50X2F0OiBtZXNzYWdlLmdldCgnc2VudF9hdCcpLFxuICAgICAgICB9LFxuICAgICAgICBhdHRhY2htZW50OiBpdGVtLFxuICAgICAgICB0aHVtYm5haWxPYmplY3RVcmw6XG4gICAgICAgICAgaXRlbS50aHVtYm5haWw/Lm9iamVjdFVybCB8fFxuICAgICAgICAgIGdldEFic29sdXRlQXR0YWNobWVudFBhdGgoaXRlbS50aHVtYm5haWw/LnBhdGggPz8gJycpLFxuICAgICAgfSkpO1xuXG4gICAgaWYgKCFtZWRpYS5sZW5ndGgpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ3Nob3dMaWdodGJveDogdW5hYmxlIHRvIGxvYWQgYXR0YWNobWVudCcsXG4gICAgICAgIGF0dGFjaG1lbnRzLm1hcCh4ID0+ICh7XG4gICAgICAgICAgY29udGVudFR5cGU6IHguY29udGVudFR5cGUsXG4gICAgICAgICAgZXJyb3I6IHguZXJyb3IsXG4gICAgICAgICAgZmxhZ3M6IHguZmxhZ3MsXG4gICAgICAgICAgcGF0aDogeC5wYXRoLFxuICAgICAgICAgIHNpemU6IHguc2l6ZSxcbiAgICAgICAgfSkpXG4gICAgICApO1xuICAgICAgc2hvd1RvYXN0KFRvYXN0VW5hYmxlVG9Mb2FkQXR0YWNobWVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRNZWRpYSA9XG4gICAgICBtZWRpYS5maW5kKGl0ZW0gPT4gYXR0YWNobWVudC5wYXRoID09PSBpdGVtLnBhdGgpIHx8IG1lZGlhWzBdO1xuXG4gICAgdGhpcy5zaG93TGlnaHRib3hGb3JNZWRpYShzZWxlY3RlZE1lZGlhLCBtZWRpYSk7XG4gIH1cblxuICBzaG93Q29udGFjdE1vZGFsKGNvbnRhY3RJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5nbG9iYWxNb2RhbHMuc2hvd0NvbnRhY3RNb2RhbChjb250YWN0SWQsIHRoaXMubW9kZWwuaWQpO1xuICB9XG5cbiAgc2hvd0dyb3VwTGlua01hbmFnZW1lbnQoKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogJ3BhbmVsJyxcbiAgICAgIEpTWDogd2luZG93LlNpZ25hbC5TdGF0ZS5Sb290cy5jcmVhdGVHcm91cExpbmtNYW5hZ2VtZW50KFxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLm1vZGVsLmlkLFxuICAgICAgICB9XG4gICAgICApLFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlclRpdGxlID0gd2luZG93LmkxOG4oJ0NvbnZlcnNhdGlvbkRldGFpbHMtLWdyb3VwLWxpbmsnKTtcblxuICAgIHRoaXMuYWRkUGFuZWwoeyB2aWV3LCBoZWFkZXJUaXRsZSB9KTtcbiAgICB2aWV3LnJlbmRlcigpO1xuICB9XG5cbiAgc2hvd0dyb3VwVjJQZXJtaXNzaW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAncGFuZWwnLFxuICAgICAgSlNYOiB3aW5kb3cuU2lnbmFsLlN0YXRlLlJvb3RzLmNyZWF0ZUdyb3VwVjJQZXJtaXNzaW9ucyhcbiAgICAgICAgd2luZG93LnJlZHV4U3RvcmUsXG4gICAgICAgIHtcbiAgICAgICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5tb2RlbC5pZCxcbiAgICAgICAgICBzZXRBY2Nlc3NDb250cm9sQXR0cmlidXRlc1NldHRpbmc6XG4gICAgICAgICAgICB0aGlzLnNldEFjY2Vzc0NvbnRyb2xBdHRyaWJ1dGVzU2V0dGluZy5iaW5kKHRoaXMpLFxuICAgICAgICAgIHNldEFjY2Vzc0NvbnRyb2xNZW1iZXJzU2V0dGluZzpcbiAgICAgICAgICAgIHRoaXMuc2V0QWNjZXNzQ29udHJvbE1lbWJlcnNTZXR0aW5nLmJpbmQodGhpcyksXG4gICAgICAgICAgc2V0QW5ub3VuY2VtZW50c09ubHk6IHRoaXMuc2V0QW5ub3VuY2VtZW50c09ubHkuYmluZCh0aGlzKSxcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICB9KTtcbiAgICBjb25zdCBoZWFkZXJUaXRsZSA9IHdpbmRvdy5pMThuKCdwZXJtaXNzaW9ucycpO1xuXG4gICAgdGhpcy5hZGRQYW5lbCh7IHZpZXcsIGhlYWRlclRpdGxlIH0pO1xuICAgIHZpZXcucmVuZGVyKCk7XG4gIH1cblxuICBzaG93UGVuZGluZ0ludml0ZXMoKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogJ3BhbmVsJyxcbiAgICAgIEpTWDogd2luZG93LlNpZ25hbC5TdGF0ZS5Sb290cy5jcmVhdGVQZW5kaW5nSW52aXRlcyh3aW5kb3cucmVkdXhTdG9yZSwge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5tb2RlbC5pZCxcbiAgICAgICAgb3VyVXVpZDogd2luZG93LnRleHRzZWN1cmUuc3RvcmFnZS51c2VyLmdldENoZWNrZWRVdWlkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgYXBwcm92ZVBlbmRpbmdNZW1iZXJzaGlwOiAoY29udmVyc2F0aW9uSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMubW9kZWwuYXBwcm92ZVBlbmRpbmdNZW1iZXJzaGlwRnJvbUdyb3VwVjIoY29udmVyc2F0aW9uSWQpO1xuICAgICAgICB9LFxuICAgICAgICByZXZva2VQZW5kaW5nTWVtYmVyc2hpcHM6IGNvbnZlcnNhdGlvbklkcyA9PiB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5yZXZva2VQZW5kaW5nTWVtYmVyc2hpcHNGcm9tR3JvdXBWMihjb252ZXJzYXRpb25JZHMpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgY29uc3QgaGVhZGVyVGl0bGUgPSB3aW5kb3cuaTE4bihcbiAgICAgICdDb252ZXJzYXRpb25EZXRhaWxzLS1yZXF1ZXN0cy1hbmQtaW52aXRlcydcbiAgICApO1xuXG4gICAgdGhpcy5hZGRQYW5lbCh7IHZpZXcsIGhlYWRlclRpdGxlIH0pO1xuICAgIHZpZXcucmVuZGVyKCk7XG4gIH1cblxuICBzaG93Q29udmVyc2F0aW9uTm90aWZpY2F0aW9uc1NldHRpbmdzKCk6IHZvaWQge1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgUmVhY3RXcmFwcGVyVmlldyh7XG4gICAgICBjbGFzc05hbWU6ICdwYW5lbCcsXG4gICAgICBKU1g6IHdpbmRvdy5TaWduYWwuU3RhdGUuUm9vdHMuY3JlYXRlQ29udmVyc2F0aW9uTm90aWZpY2F0aW9uc1NldHRpbmdzKFxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLm1vZGVsLmlkLFxuICAgICAgICAgIHNldERvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWQ6XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldERvbnROb3RpZnlGb3JNZW50aW9uc0lmTXV0ZWQuYmluZCh0aGlzLm1vZGVsKSxcbiAgICAgICAgICBzZXRNdXRlRXhwaXJhdGlvbjogdGhpcy5zZXRNdXRlRXhwaXJhdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgICB9XG4gICAgICApLFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlclRpdGxlID0gd2luZG93LmkxOG4oJ0NvbnZlcnNhdGlvbkRldGFpbHMtLW5vdGlmaWNhdGlvbnMnKTtcblxuICAgIHRoaXMuYWRkUGFuZWwoeyB2aWV3LCBoZWFkZXJUaXRsZSB9KTtcbiAgICB2aWV3LnJlbmRlcigpO1xuICB9XG5cbiAgc2hvd0NoYXRDb2xvckVkaXRvcigpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAncGFuZWwnLFxuICAgICAgSlNYOiB3aW5kb3cuU2lnbmFsLlN0YXRlLlJvb3RzLmNyZWF0ZUNoYXRDb2xvclBpY2tlcih3aW5kb3cucmVkdXhTdG9yZSwge1xuICAgICAgICBjb252ZXJzYXRpb25JZDogdGhpcy5tb2RlbC5nZXQoJ2lkJyksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBjb25zdCBoZWFkZXJUaXRsZSA9IHdpbmRvdy5pMThuKCdDaGF0Q29sb3JQaWNrZXJfX21lbnUtdGl0bGUnKTtcblxuICAgIHRoaXMuYWRkUGFuZWwoeyB2aWV3LCBoZWFkZXJUaXRsZSB9KTtcbiAgICB2aWV3LnJlbmRlcigpO1xuICB9XG5cbiAgc2hvd0NvbnZlcnNhdGlvbkRldGFpbHMoKTogdm9pZCB7XG4gICAgLy8gUnVuIGEgZ2V0UHJvZmlsZXMgaW4gY2FzZSBtZW1iZXIncyBjYXBhYmlsaXRpZXMgaGF2ZSBjaGFuZ2VkXG4gICAgLy8gUmVkdXggc2hvdWxkIGNvdmVyIHVzIG9uIHRoZSByZXR1cm4gaGVyZSBzbyBubyBuZWVkIHRvIGF3YWl0IHRoaXMuXG4gICAgaWYgKHRoaXMubW9kZWwudGhyb3R0bGVkR2V0UHJvZmlsZXMpIHtcbiAgICAgIHRoaXMubW9kZWwudGhyb3R0bGVkR2V0UHJvZmlsZXMoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlUmVxdWVzdEVudW0gPSBQcm90by5TeW5jTWVzc2FnZS5NZXNzYWdlUmVxdWVzdFJlc3BvbnNlLlR5cGU7XG5cbiAgICAvLyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkIGluIG1vcmUgdGhhbiBvbmUgcGxhY2UgYW5kIHNob3VsZCBwcm9iYWJseSBiZVxuICAgIC8vIGRyaWVkIHVwIGFuZCBob2lzdGVkIHRvIG1ldGhvZHMgb24gQ29udmVyc2F0aW9uVmlld1xuXG4gICAgY29uc3Qgb25MZWF2ZSA9ICgpID0+IHtcbiAgICAgIHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICAgIG5hbWU6ICdvbkxlYXZlJyxcbiAgICAgICAgdGFzazogKCkgPT4gdGhpcy5tb2RlbC5sZWF2ZUdyb3VwVjIoKSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkJsb2NrID0gKCkgPT4ge1xuICAgICAgdGhpcy5zeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShcbiAgICAgICAgJ29uQmxvY2snLFxuICAgICAgICB0aGlzLm1vZGVsLFxuICAgICAgICBtZXNzYWdlUmVxdWVzdEVudW0uQkxPQ0tcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgYWRkTWVtYmVyczogdGhpcy5tb2RlbC5hZGRNZW1iZXJzVjIuYmluZCh0aGlzLm1vZGVsKSxcbiAgICAgIGNvbnZlcnNhdGlvbklkOiB0aGlzLm1vZGVsLmdldCgnaWQnKSxcbiAgICAgIGxvYWRSZWNlbnRNZWRpYUl0ZW1zOiB0aGlzLmxvYWRSZWNlbnRNZWRpYUl0ZW1zLmJpbmQodGhpcyksXG4gICAgICBzZXREaXNhcHBlYXJpbmdNZXNzYWdlczogdGhpcy5zZXREaXNhcHBlYXJpbmdNZXNzYWdlcy5iaW5kKHRoaXMpLFxuICAgICAgc2hvd0FsbE1lZGlhOiB0aGlzLnNob3dBbGxNZWRpYS5iaW5kKHRoaXMpLFxuICAgICAgc2hvd0NvbnRhY3RNb2RhbDogdGhpcy5zaG93Q29udGFjdE1vZGFsLmJpbmQodGhpcyksXG4gICAgICBzaG93Q2hhdENvbG9yRWRpdG9yOiB0aGlzLnNob3dDaGF0Q29sb3JFZGl0b3IuYmluZCh0aGlzKSxcbiAgICAgIHNob3dHcm91cExpbmtNYW5hZ2VtZW50OiB0aGlzLnNob3dHcm91cExpbmtNYW5hZ2VtZW50LmJpbmQodGhpcyksXG4gICAgICBzaG93R3JvdXBWMlBlcm1pc3Npb25zOiB0aGlzLnNob3dHcm91cFYyUGVybWlzc2lvbnMuYmluZCh0aGlzKSxcbiAgICAgIHNob3dDb252ZXJzYXRpb25Ob3RpZmljYXRpb25zU2V0dGluZ3M6XG4gICAgICAgIHRoaXMuc2hvd0NvbnZlcnNhdGlvbk5vdGlmaWNhdGlvbnNTZXR0aW5ncy5iaW5kKHRoaXMpLFxuICAgICAgc2hvd1BlbmRpbmdJbnZpdGVzOiB0aGlzLnNob3dQZW5kaW5nSW52aXRlcy5iaW5kKHRoaXMpLFxuICAgICAgc2hvd0xpZ2h0Ym94Rm9yTWVkaWE6IHRoaXMuc2hvd0xpZ2h0Ym94Rm9yTWVkaWEuYmluZCh0aGlzKSxcbiAgICAgIHVwZGF0ZUdyb3VwQXR0cmlidXRlczogdGhpcy5tb2RlbC51cGRhdGVHcm91cEF0dHJpYnV0ZXNWMi5iaW5kKFxuICAgICAgICB0aGlzLm1vZGVsXG4gICAgICApLFxuICAgICAgb25MZWF2ZSxcbiAgICAgIG9uQmxvY2ssXG4gICAgICBvblVuYmxvY2s6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zeW5jTWVzc2FnZVJlcXVlc3RSZXNwb25zZShcbiAgICAgICAgICAnb25VbmJsb2NrJyxcbiAgICAgICAgICB0aGlzLm1vZGVsLFxuICAgICAgICAgIG1lc3NhZ2VSZXF1ZXN0RW51bS5BQ0NFUFRcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBzZXRNdXRlRXhwaXJhdGlvbjogdGhpcy5zZXRNdXRlRXhwaXJhdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgb25PdXRnb2luZ0F1ZGlvQ2FsbEluQ29udmVyc2F0aW9uOlxuICAgICAgICB0aGlzLm9uT3V0Z29pbmdBdWRpb0NhbGxJbkNvbnZlcnNhdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgb25PdXRnb2luZ1ZpZGVvQ2FsbEluQ29udmVyc2F0aW9uOlxuICAgICAgICB0aGlzLm9uT3V0Z29pbmdWaWRlb0NhbGxJbkNvbnZlcnNhdGlvbi5iaW5kKHRoaXMpLFxuICAgIH07XG5cbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAnY29udmVyc2F0aW9uLWRldGFpbHMtcGFuZSBwYW5lbCcsXG4gICAgICBKU1g6IHdpbmRvdy5TaWduYWwuU3RhdGUuUm9vdHMuY3JlYXRlQ29udmVyc2F0aW9uRGV0YWlscyhcbiAgICAgICAgd2luZG93LnJlZHV4U3RvcmUsXG4gICAgICAgIHByb3BzXG4gICAgICApLFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlclRpdGxlID0gJyc7XG5cbiAgICB0aGlzLmFkZFBhbmVsKHsgdmlldywgaGVhZGVyVGl0bGUgfSk7XG4gICAgdmlldy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNob3dNZXNzYWdlRGV0YWlsKG1lc3NhZ2VJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHdpbmRvdy5NZXNzYWdlQ29udHJvbGxlci5nZXRCeUlkKG1lc3NhZ2VJZCk7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNob3dNZXNzYWdlRGV0YWlsOiBNZXNzYWdlICR7bWVzc2FnZUlkfSBtaXNzaW5nIWApO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5pc05vcm1hbEJ1YmJsZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UHJvcHMgPSAoKSA9PiAoe1xuICAgICAgLi4ubWVzc2FnZS5nZXRQcm9wc0Zvck1lc3NhZ2VEZXRhaWwoXG4gICAgICAgIHdpbmRvdy5Db252ZXJzYXRpb25Db250cm9sbGVyLmdldE91ckNvbnZlcnNhdGlvbklkT3JUaHJvdygpXG4gICAgICApLFxuICAgICAgLi4udGhpcy5nZXRNZXNzYWdlQWN0aW9ucygpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuc3RvcExpc3RlbmluZyhtZXNzYWdlLCAnY2hhbmdlJywgdXBkYXRlKTtcbiAgICAgIHRoaXMucmVzZXRQYW5lbCgpO1xuICAgIH07XG5cbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAncGFuZWwgbWVzc2FnZS1kZXRhaWwtd3JhcHBlcicsXG4gICAgICBKU1g6IHdpbmRvdy5TaWduYWwuU3RhdGUuUm9vdHMuY3JlYXRlTWVzc2FnZURldGFpbChcbiAgICAgICAgd2luZG93LnJlZHV4U3RvcmUsXG4gICAgICAgIGdldFByb3BzKClcbiAgICAgICksXG4gICAgICBvbkNsb3NlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT5cbiAgICAgIHZpZXcudXBkYXRlKFxuICAgICAgICB3aW5kb3cuU2lnbmFsLlN0YXRlLlJvb3RzLmNyZWF0ZU1lc3NhZ2VEZXRhaWwoXG4gICAgICAgICAgd2luZG93LnJlZHV4U3RvcmUsXG4gICAgICAgICAgZ2V0UHJvcHMoKVxuICAgICAgICApXG4gICAgICApO1xuICAgIHRoaXMubGlzdGVuVG8obWVzc2FnZSwgJ2NoYW5nZScsIHVwZGF0ZSk7XG4gICAgdGhpcy5saXN0ZW5UbyhtZXNzYWdlLCAnZXhwaXJlZCcsIG9uQ2xvc2UpO1xuICAgIC8vIFdlIGNvdWxkIGxpc3RlbiB0byBhbGwgaW52b2x2ZWQgY29udGFjdHMsIGJ1dCB3ZSdsbCBjYWxsIHRoYXQgb3ZlcmtpbGxcblxuICAgIHRoaXMuYWRkUGFuZWwoeyB2aWV3IH0pO1xuICAgIHZpZXcucmVuZGVyKCk7XG4gIH1cblxuICBzaG93U3RpY2tlck1hbmFnZXIoKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IG5ldyBSZWFjdFdyYXBwZXJWaWV3KHtcbiAgICAgIGNsYXNzTmFtZTogWydzdGlja2VyLW1hbmFnZXItd3JhcHBlcicsICdwYW5lbCddLmpvaW4oJyAnKSxcbiAgICAgIEpTWDogd2luZG93LlNpZ25hbC5TdGF0ZS5Sb290cy5jcmVhdGVTdGlja2VyTWFuYWdlcih3aW5kb3cucmVkdXhTdG9yZSksXG4gICAgICBvbkNsb3NlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzZXRQYW5lbCgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkUGFuZWwoeyB2aWV3IH0pO1xuICAgIHZpZXcucmVuZGVyKCk7XG4gIH1cblxuICBzaG93Q29udGFjdERldGFpbCh7XG4gICAgY29udGFjdCxcbiAgICBzaWduYWxBY2NvdW50LFxuICB9OiB7XG4gICAgY29udGFjdDogRW1iZWRkZWRDb250YWN0VHlwZTtcbiAgICBzaWduYWxBY2NvdW50Pzoge1xuICAgICAgcGhvbmVOdW1iZXI6IHN0cmluZztcbiAgICAgIHV1aWQ6IFVVSURTdHJpbmdUeXBlO1xuICAgIH07XG4gIH0pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlYWN0V3JhcHBlclZpZXcoe1xuICAgICAgY2xhc3NOYW1lOiAnY29udGFjdC1kZXRhaWwtcGFuZSBwYW5lbCcsXG4gICAgICBKU1g6IChcbiAgICAgICAgPENvbnRhY3REZXRhaWxcbiAgICAgICAgICBpMThuPXt3aW5kb3cuaTE4bn1cbiAgICAgICAgICBjb250YWN0PXtjb250YWN0fVxuICAgICAgICAgIGhhc1NpZ25hbEFjY291bnQ9e0Jvb2xlYW4oc2lnbmFsQWNjb3VudCl9XG4gICAgICAgICAgb25TZW5kTWVzc2FnZT17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNpZ25hbEFjY291bnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydENvbnZlcnNhdGlvbihcbiAgICAgICAgICAgICAgICBzaWduYWxBY2NvdW50LnBob25lTnVtYmVyLFxuICAgICAgICAgICAgICAgIHNpZ25hbEFjY291bnQudXVpZFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApLFxuICAgICAgb25DbG9zZTogKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0UGFuZWwoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZFBhbmVsKHsgdmlldyB9KTtcbiAgfVxuXG4gIHN0YXJ0Q29udmVyc2F0aW9uKGUxNjQ6IHN0cmluZywgdXVpZDogVVVJRFN0cmluZ1R5cGUpOiB2b2lkIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5sb29rdXBPckNyZWF0ZSh7XG4gICAgICBlMTY0LFxuICAgICAgdXVpZCxcbiAgICB9KTtcbiAgICBzdHJpY3RBc3NlcnQoXG4gICAgICBjb252ZXJzYXRpb24sXG4gICAgICBgc3RhcnRDb252ZXJzYXRpb24gZmFpbGVkIGdpdmVuICR7ZTE2NH0vJHt1dWlkfSBjb21iaW5hdGlvbmBcbiAgICApO1xuXG4gICAgdGhpcy5vcGVuQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5pZCk7XG4gIH1cblxuICBhc3luYyBvcGVuQ29udmVyc2F0aW9uKFxuICAgIGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsXG4gICAgbWVzc2FnZUlkPzogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHdpbmRvdy5XaGlzcGVyLmV2ZW50cy50cmlnZ2VyKFxuICAgICAgJ3Nob3dDb252ZXJzYXRpb24nLFxuICAgICAgY29udmVyc2F0aW9uSWQsXG4gICAgICBtZXNzYWdlSWRcbiAgICApO1xuICB9XG5cbiAgYWRkUGFuZWwocGFuZWw6IFBhbmVsVHlwZSk6IHZvaWQge1xuICAgIHRoaXMucGFuZWxzID0gdGhpcy5wYW5lbHMgfHwgW107XG5cbiAgICBpZiAodGhpcy5wYW5lbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnByZXZpb3VzRm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIHRoaXMucGFuZWxzLnVuc2hpZnQocGFuZWwpO1xuICAgIHBhbmVsLnZpZXcuJGVsLmluc2VydEFmdGVyKHRoaXMuJCgnLnBhbmVsJykubGFzdCgpKTtcbiAgICBwYW5lbC52aWV3LiRlbC5vbmUoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHBhbmVsLnZpZXcuJGVsLmFkZENsYXNzKCdwYW5lbC0tc3RhdGljJyk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuc2V0U2VsZWN0ZWRDb252ZXJzYXRpb25QYW5lbERlcHRoKFxuICAgICAgdGhpcy5wYW5lbHMubGVuZ3RoXG4gICAgKTtcbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuc2V0U2VsZWN0ZWRDb252ZXJzYXRpb25IZWFkZXJUaXRsZShcbiAgICAgIHBhbmVsLmhlYWRlclRpdGxlXG4gICAgKTtcbiAgfVxuICByZXNldFBhbmVsKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wYW5lbHMgfHwgIXRoaXMucGFuZWxzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhbmVsID0gdGhpcy5wYW5lbHMuc2hpZnQoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMucGFuZWxzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgdGhpcy5wcmV2aW91c0ZvY3VzICYmXG4gICAgICB0aGlzLnByZXZpb3VzRm9jdXMuZm9jdXNcbiAgICApIHtcbiAgICAgIHRoaXMucHJldmlvdXNGb2N1cy5mb2N1cygpO1xuICAgICAgdGhpcy5wcmV2aW91c0ZvY3VzID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbmVscy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhbmVsc1swXS52aWV3LiRlbC5mYWRlSW4oMjUwKTtcbiAgICB9XG5cbiAgICBpZiAocGFuZWwpIHtcbiAgICAgIGxldCB0aW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHJlbW92ZVBhbmVsID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcGFuZWwudmlldy5yZW1vdmUoKTtcblxuICAgICAgICBpZiAodGhpcy5wYW5lbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHBvcHBlcnMgYXJlIHBvc2l0aW9uZWQgcHJvcGVybHlcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHBhbmVsLnZpZXcuJGVsXG4gICAgICAgIC5hZGRDbGFzcygncGFuZWwtLXJlbW92ZScpXG4gICAgICAgIC5vbmUoJ3RyYW5zaXRpb25lbmQnLCByZW1vdmVQYW5lbCk7XG5cbiAgICAgIC8vIEJhY2t1cCwgaW4gY2FzZSB0aGluZ3MgZ28gd3Jvbmcgd2l0aCB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQocmVtb3ZlUGFuZWwsIFNFQ09ORCk7XG4gICAgfVxuXG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNldFNlbGVjdGVkQ29udmVyc2F0aW9uUGFuZWxEZXB0aChcbiAgICAgIHRoaXMucGFuZWxzLmxlbmd0aFxuICAgICk7XG4gICAgd2luZG93LnJlZHV4QWN0aW9ucy5jb252ZXJzYXRpb25zLnNldFNlbGVjdGVkQ29udmVyc2F0aW9uSGVhZGVyVGl0bGUoXG4gICAgICB0aGlzLnBhbmVsc1swXT8uaGVhZGVyVGl0bGVcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgbG9hZFJlY2VudE1lZGlhSXRlbXMobGltaXQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbW9kZWwgfTogeyBtb2RlbDogQ29udmVyc2F0aW9uTW9kZWwgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBtZXNzYWdlczogQXJyYXk8TWVzc2FnZUF0dHJpYnV0ZXNUeXBlPiA9XG4gICAgICBhd2FpdCB3aW5kb3cuU2lnbmFsLkRhdGEuZ2V0TWVzc2FnZXNXaXRoVmlzdWFsTWVkaWFBdHRhY2htZW50cyhtb2RlbC5pZCwge1xuICAgICAgICBsaW1pdCxcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgbG9hZGVkUmVjZW50TWVkaWFJdGVtcyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKG1lc3NhZ2UgPT4gbWVzc2FnZS5hdHRhY2htZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgICAgLnJlZHVjZShcbiAgICAgICAgKGFjYywgbWVzc2FnZSkgPT4gW1xuICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICAuLi4obWVzc2FnZS5hdHRhY2htZW50cyB8fCBbXSkubWFwKFxuICAgICAgICAgICAgKGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnRUeXBlLCBpbmRleDogbnVtYmVyKTogTWVkaWFJdGVtVHlwZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBhdHRhY2htZW50O1xuXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0VVJMOiBnZXRBYnNvbHV0ZUF0dGFjaG1lbnRQYXRoKGF0dGFjaG1lbnQucGF0aCB8fCAnJyksXG4gICAgICAgICAgICAgICAgdGh1bWJuYWlsT2JqZWN0VXJsOiB0aHVtYm5haWw/LnBhdGhcbiAgICAgICAgICAgICAgICAgID8gZ2V0QWJzb2x1dGVBdHRhY2htZW50UGF0aCh0aHVtYm5haWwucGF0aClcbiAgICAgICAgICAgICAgICAgIDogJycsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGF0dGFjaG1lbnQuY29udGVudFR5cGUsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgYXR0YWNobWVudCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAgICAgICBhdHRhY2htZW50czogbWVzc2FnZS5hdHRhY2htZW50cyB8fCBbXSxcbiAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29udmVyc2F0aW9uQ29udHJvbGxlci5nZXQobWVzc2FnZS5zb3VyY2VVdWlkKT8uaWQgfHxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5jb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgICAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgICAgICAgICAgICAgcmVjZWl2ZWRfYXQ6IG1lc3NhZ2UucmVjZWl2ZWRfYXQsXG4gICAgICAgICAgICAgICAgICByZWNlaXZlZF9hdF9tczogTnVtYmVyKG1lc3NhZ2UucmVjZWl2ZWRfYXRfbXMpLFxuICAgICAgICAgICAgICAgICAgc2VudF9hdDogbWVzc2FnZS5zZW50X2F0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKSxcbiAgICAgICAgXSxcbiAgICAgICAgW10gYXMgQXJyYXk8TWVkaWFJdGVtVHlwZT5cbiAgICAgICk7XG5cbiAgICB3aW5kb3cucmVkdXhBY3Rpb25zLmNvbnZlcnNhdGlvbnMuc2V0UmVjZW50TWVkaWFJdGVtcyhcbiAgICAgIG1vZGVsLmlkLFxuICAgICAgbG9hZGVkUmVjZW50TWVkaWFJdGVtc1xuICAgICk7XG4gIH1cblxuICBhc3luYyBzZXREaXNhcHBlYXJpbmdNZXNzYWdlcyhzZWNvbmRzOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1vZGVsIH06IHsgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgdmFsdWVUb1NldCA9IHNlY29uZHMgPiAwID8gc2Vjb25kcyA6IHVuZGVmaW5lZDtcblxuICAgIGF3YWl0IHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICBuYW1lOiAndXBkYXRlRXhwaXJhdGlvblRpbWVyJyxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+XG4gICAgICAgIG1vZGVsLnVwZGF0ZUV4cGlyYXRpb25UaW1lcih2YWx1ZVRvU2V0LCB7XG4gICAgICAgICAgcmVhc29uOiAnc2V0RGlzYXBwZWFyaW5nTWVzc2FnZXMnLFxuICAgICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNldEFjY2Vzc0NvbnRyb2xBdHRyaWJ1dGVzU2V0dGluZyh2YWx1ZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtb2RlbCB9OiB7IG1vZGVsOiBDb252ZXJzYXRpb25Nb2RlbCB9ID0gdGhpcztcblxuICAgIGF3YWl0IHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICBuYW1lOiAndXBkYXRlQWNjZXNzQ29udHJvbEF0dHJpYnV0ZXMnLFxuICAgICAgdGFzazogYXN5bmMgKCkgPT4gbW9kZWwudXBkYXRlQWNjZXNzQ29udHJvbEF0dHJpYnV0ZXModmFsdWUpLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2V0QWNjZXNzQ29udHJvbE1lbWJlcnNTZXR0aW5nKHZhbHVlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1vZGVsIH06IHsgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsIH0gPSB0aGlzO1xuXG4gICAgYXdhaXQgdGhpcy5sb25nUnVubmluZ1Rhc2tXcmFwcGVyKHtcbiAgICAgIG5hbWU6ICd1cGRhdGVBY2Nlc3NDb250cm9sTWVtYmVycycsXG4gICAgICB0YXNrOiBhc3luYyAoKSA9PiBtb2RlbC51cGRhdGVBY2Nlc3NDb250cm9sTWVtYmVycyh2YWx1ZSksXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZXRBbm5vdW5jZW1lbnRzT25seSh2YWx1ZTogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbW9kZWwgfTogeyBtb2RlbDogQ29udmVyc2F0aW9uTW9kZWwgfSA9IHRoaXM7XG5cbiAgICBhd2FpdCB0aGlzLmxvbmdSdW5uaW5nVGFza1dyYXBwZXIoe1xuICAgICAgbmFtZTogJ3VwZGF0ZUFubm91bmNlbWVudHNPbmx5JyxcbiAgICAgIHRhc2s6IGFzeW5jICgpID0+IG1vZGVsLnVwZGF0ZUFubm91bmNlbWVudHNPbmx5KHZhbHVlKSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3lNZXNzYWdlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1vZGVsIH06IHsgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsIH0gPSB0aGlzO1xuXG4gICAgd2luZG93LnNob3dDb25maXJtYXRpb25EaWFsb2coe1xuICAgICAgY29uZmlybVN0eWxlOiAnbmVnYXRpdmUnLFxuICAgICAgbWVzc2FnZTogd2luZG93LmkxOG4oJ2RlbGV0ZUNvbnZlcnNhdGlvbkNvbmZpcm1hdGlvbicpLFxuICAgICAgb2tUZXh0OiB3aW5kb3cuaTE4bignZGVsZXRlJyksXG4gICAgICByZXNvbHZlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9uZ1J1bm5pbmdUYXNrV3JhcHBlcih7XG4gICAgICAgICAgbmFtZTogJ2Rlc3Ryb3ltZXNzYWdlcycsXG4gICAgICAgICAgdGFzazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbW9kZWwudHJpZ2dlcigndW5sb2FkJywgJ2RlbGV0ZSBtZXNzYWdlcycpO1xuICAgICAgICAgICAgYXdhaXQgbW9kZWwuZGVzdHJveU1lc3NhZ2VzKCk7XG4gICAgICAgICAgICBtb2RlbC51cGRhdGVMYXN0TWVzc2FnZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHJlamVjdDogKCkgPT4ge1xuICAgICAgICBsb2cuaW5mbygnZGVzdHJveU1lc3NhZ2VzOiBVc2VyIGNhbmNlbGVkIGRlbGV0ZScpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGlzQ2FsbFNhZmUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY29udGFjdHMgPSBhd2FpdCB0aGlzLmdldFVudHJ1c3RlZENvbnRhY3RzKCk7XG4gICAgaWYgKGNvbnRhY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2FsbEFueXdheSA9IGF3YWl0IHRoaXMuc2hvd1NlbmRBbnl3YXlEaWFsb2coXG4gICAgICAgIGNvbnRhY3RzLFxuICAgICAgICB3aW5kb3cuaTE4bignY2FsbEFueXdheScpXG4gICAgICApO1xuICAgICAgaWYgKCFjYWxsQW55d2F5KSB7XG4gICAgICAgIGxvZy5pbmZvKFxuICAgICAgICAgICdTYWZldHkgbnVtYmVyIGNoYW5nZSBkaWFsb2cgbm90IGFjY2VwdGVkLCBuZXcgY2FsbCBub3QgYWxsb3dlZC4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNob3dTZW5kQW55d2F5RGlhbG9nKFxuICAgIGNvbnRhY3RzOiBBcnJheTxDb252ZXJzYXRpb25Nb2RlbD4sXG4gICAgY29uZmlybVRleHQ/OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2hvd1NhZmV0eU51bWJlckNoYW5nZURpYWxvZyh7XG4gICAgICAgIGNvbmZpcm1UZXh0LFxuICAgICAgICBjb250YWN0cyxcbiAgICAgICAgcmVqZWN0OiAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6ICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZW5kU3RpY2tlck1lc3NhZ2Uob3B0aW9uczoge1xuICAgIHBhY2tJZDogc3RyaW5nO1xuICAgIHN0aWNrZXJJZDogbnVtYmVyO1xuICAgIGZvcmNlPzogYm9vbGVhbjtcbiAgfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbW9kZWwgfTogeyBtb2RlbDogQ29udmVyc2F0aW9uTW9kZWwgfSA9IHRoaXM7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGFjdHMgPSBhd2FpdCB0aGlzLmdldFVudHJ1c3RlZENvbnRhY3RzKG9wdGlvbnMpO1xuXG4gICAgICBpZiAoY29udGFjdHMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHNlbmRBbnl3YXkgPSBhd2FpdCB0aGlzLnNob3dTZW5kQW55d2F5RGlhbG9nKGNvbnRhY3RzKTtcbiAgICAgICAgaWYgKHNlbmRBbnl3YXkpIHtcbiAgICAgICAgICB0aGlzLnNlbmRTdGlja2VyTWVzc2FnZSh7IC4uLm9wdGlvbnMsIGZvcmNlOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zaG93SW52YWxpZE1lc3NhZ2VUb2FzdCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBwYWNrSWQsIHN0aWNrZXJJZCB9ID0gb3B0aW9ucztcbiAgICAgIG1vZGVsLnNlbmRTdGlja2VyTWVzc2FnZShwYWNrSWQsIHN0aWNrZXJJZCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcignY2xpY2tTZW5kIGVycm9yOicsIGVycm9yICYmIGVycm9yLnN0YWNrID8gZXJyb3Iuc3RhY2sgOiBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0VW50cnVzdGVkQ29udGFjdHMoXG4gICAgb3B0aW9uczogeyBmb3JjZT86IGJvb2xlYW4gfSA9IHt9XG4gICk6IFByb21pc2U8QXJyYXk8Q29udmVyc2F0aW9uTW9kZWw+PiB7XG4gICAgY29uc3QgeyBtb2RlbCB9OiB7IG1vZGVsOiBDb252ZXJzYXRpb25Nb2RlbCB9ID0gdGhpcztcblxuICAgIC8vIFRoaXMgd2lsbCBnbyB0byB0aGUgdHJ1c3Qgc3RvcmUgZm9yIHRoZSBsYXRlc3QgaWRlbnRpdHkga2V5IGluZm9ybWF0aW9uLFxuICAgIC8vICAgYW5kIG1heSByZXN1bHQgaW4gdGhlIGRpc3BsYXkgb2YgYSBuZXcgYmFubmVyIGZvciB0aGlzIGNvbnZlcnNhdGlvbi5cbiAgICBhd2FpdCBtb2RlbC51cGRhdGVWZXJpZmllZCgpO1xuICAgIGNvbnN0IHVudmVyaWZpZWRDb250YWN0cyA9IG1vZGVsLmdldFVudmVyaWZpZWQoKTtcblxuICAgIGlmIChvcHRpb25zLmZvcmNlKSB7XG4gICAgICBpZiAodW52ZXJpZmllZENvbnRhY3RzLmxlbmd0aCkge1xuICAgICAgICBhd2FpdCBtYXJrQWxsQXNWZXJpZmllZERlZmF1bHQodW52ZXJpZmllZENvbnRhY3RzKTtcbiAgICAgICAgLy8gV2Ugb25seSB3YW50IGZvcmNlIHRvIGJyZWFrIHVzIHRocm91Z2ggb25lIGxheWVyIG9mIGNoZWNrc1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgb3B0aW9ucy5mb3JjZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodW52ZXJpZmllZENvbnRhY3RzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVudmVyaWZpZWRDb250YWN0cztcbiAgICB9XG5cbiAgICBjb25zdCB1bnRydXN0ZWRDb250YWN0cyA9IG1vZGVsLmdldFVudHJ1c3RlZCgpO1xuXG4gICAgaWYgKG9wdGlvbnMuZm9yY2UpIHtcbiAgICAgIGlmICh1bnRydXN0ZWRDb250YWN0cy5sZW5ndGgpIHtcbiAgICAgICAgYXdhaXQgbWFya0FsbEFzQXBwcm92ZWQodW50cnVzdGVkQ29udGFjdHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodW50cnVzdGVkQ29udGFjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW50cnVzdGVkQ29udGFjdHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYXN5bmMgc2V0UXVvdGVNZXNzYWdlKG1lc3NhZ2VJZDogbnVsbCB8IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgbW9kZWwgfSA9IHRoaXM7XG4gICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VJZCA/IGF3YWl0IGdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCkgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoXG4gICAgICBtZXNzYWdlICYmXG4gICAgICAhY2FuUmVwbHkoXG4gICAgICAgIG1lc3NhZ2UuYXR0cmlidXRlcyxcbiAgICAgICAgd2luZG93LkNvbnZlcnNhdGlvbkNvbnRyb2xsZXIuZ2V0T3VyQ29udmVyc2F0aW9uSWRPclRocm93KCksXG4gICAgICAgIGZpbmRBbmRGb3JtYXRDb250YWN0XG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UgJiYgIW1lc3NhZ2UuaXNOb3JtYWxCdWJibGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucXVvdGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5xdW90ZWRNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBtb2RlbC5nZXQoJ3F1b3RlZE1lc3NhZ2VJZCcpO1xuICAgIGlmIChleGlzdGluZyAhPT0gbWVzc2FnZUlkKSB7XG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgbGV0IGFjdGl2ZV9hdCA9IHRoaXMubW9kZWwuZ2V0KCdhY3RpdmVfYXQnKTtcbiAgICAgIGxldCB0aW1lc3RhbXAgPSB0aGlzLm1vZGVsLmdldCgndGltZXN0YW1wJyk7XG5cbiAgICAgIGlmICghYWN0aXZlX2F0ICYmIG1lc3NhZ2VJZCkge1xuICAgICAgICBhY3RpdmVfYXQgPSBub3c7XG4gICAgICAgIHRpbWVzdGFtcCA9IG5vdztcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICBhY3RpdmVfYXQsXG4gICAgICAgIGRyYWZ0Q2hhbmdlZDogdHJ1ZSxcbiAgICAgICAgcXVvdGVkTWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCB0aGlzLnNhdmVNb2RlbCgpO1xuICAgIH1cblxuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLnF1b3RlZE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgdGhpcy5xdW90ZSA9IGF3YWl0IG1vZGVsLm1ha2VRdW90ZSh0aGlzLnF1b3RlZE1lc3NhZ2UpO1xuXG4gICAgICB0aGlzLmVuYWJsZU1lc3NhZ2VGaWVsZCgpO1xuICAgICAgdGhpcy5mb2N1c01lc3NhZ2VGaWVsZCgpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyUXVvdGVkTWVzc2FnZSgpO1xuICB9XG5cbiAgcmVuZGVyUXVvdGVkTWVzc2FnZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IG1vZGVsIH06IHsgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsIH0gPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLnF1b3RlZE1lc3NhZ2UpIHtcbiAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29tcG9zZXIuc2V0UXVvdGVkTWVzc2FnZSh1bmRlZmluZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29tcG9zZXIuc2V0UXVvdGVkTWVzc2FnZSh7XG4gICAgICBjb252ZXJzYXRpb25JZDogbW9kZWwuaWQsXG4gICAgICBxdW90ZTogdGhpcy5xdW90ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dJbnZhbGlkTWVzc2FnZVRvYXN0KG1lc3NhZ2VUZXh0Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBtb2RlbCB9OiB7IG1vZGVsOiBDb252ZXJzYXRpb25Nb2RlbCB9ID0gdGhpcztcblxuICAgIGxldCB0b2FzdFZpZXc6XG4gICAgICB8IHVuZGVmaW5lZFxuICAgICAgfCB0eXBlb2YgVG9hc3RCbG9ja2VkXG4gICAgICB8IHR5cGVvZiBUb2FzdEJsb2NrZWRHcm91cFxuICAgICAgfCB0eXBlb2YgVG9hc3RFeHBpcmVkXG4gICAgICB8IHR5cGVvZiBUb2FzdEludmFsaWRDb252ZXJzYXRpb25cbiAgICAgIHwgdHlwZW9mIFRvYXN0TGVmdEdyb3VwXG4gICAgICB8IHR5cGVvZiBUb2FzdE1lc3NhZ2VCb2R5VG9vTG9uZztcblxuICAgIGlmICh3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpLmV4cGlyYXRpb24uaGFzRXhwaXJlZCkge1xuICAgICAgdG9hc3RWaWV3ID0gVG9hc3RFeHBpcmVkO1xuICAgIH1cbiAgICBpZiAoIW1vZGVsLmlzVmFsaWQoKSkge1xuICAgICAgdG9hc3RWaWV3ID0gVG9hc3RJbnZhbGlkQ29udmVyc2F0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGUxNjQgPSB0aGlzLm1vZGVsLmdldCgnZTE2NCcpO1xuICAgIGNvbnN0IHV1aWQgPSB0aGlzLm1vZGVsLmdldCgndXVpZCcpO1xuICAgIGlmIChcbiAgICAgIGlzRGlyZWN0Q29udmVyc2F0aW9uKHRoaXMubW9kZWwuYXR0cmlidXRlcykgJiZcbiAgICAgICgoZTE2NCAmJiB3aW5kb3cuc3RvcmFnZS5ibG9ja2VkLmlzQmxvY2tlZChlMTY0KSkgfHxcbiAgICAgICAgKHV1aWQgJiYgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5pc1V1aWRCbG9ja2VkKHV1aWQpKSlcbiAgICApIHtcbiAgICAgIHRvYXN0VmlldyA9IFRvYXN0QmxvY2tlZDtcbiAgICB9XG5cbiAgICBjb25zdCBncm91cElkID0gdGhpcy5tb2RlbC5nZXQoJ2dyb3VwSWQnKTtcbiAgICBpZiAoXG4gICAgICAhaXNEaXJlY3RDb252ZXJzYXRpb24odGhpcy5tb2RlbC5hdHRyaWJ1dGVzKSAmJlxuICAgICAgZ3JvdXBJZCAmJlxuICAgICAgd2luZG93LnN0b3JhZ2UuYmxvY2tlZC5pc0dyb3VwQmxvY2tlZChncm91cElkKVxuICAgICkge1xuICAgICAgdG9hc3RWaWV3ID0gVG9hc3RCbG9ja2VkR3JvdXA7XG4gICAgfVxuXG4gICAgaWYgKCFpc0RpcmVjdENvbnZlcnNhdGlvbihtb2RlbC5hdHRyaWJ1dGVzKSAmJiBtb2RlbC5nZXQoJ2xlZnQnKSkge1xuICAgICAgdG9hc3RWaWV3ID0gVG9hc3RMZWZ0R3JvdXA7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlVGV4dCAmJiBtZXNzYWdlVGV4dC5sZW5ndGggPiBNQVhfTUVTU0FHRV9CT0RZX0xFTkdUSCkge1xuICAgICAgdG9hc3RWaWV3ID0gVG9hc3RNZXNzYWdlQm9keVRvb0xvbmc7XG4gICAgfVxuXG4gICAgaWYgKHRvYXN0Vmlldykge1xuICAgICAgc2hvd1RvYXN0KHRvYXN0Vmlldyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBzZW5kTWVzc2FnZShcbiAgICBtZXNzYWdlID0gJycsXG4gICAgbWVudGlvbnM6IEJvZHlSYW5nZXNUeXBlID0gW10sXG4gICAgb3B0aW9uczoge1xuICAgICAgZHJhZnRBdHRhY2htZW50cz86IFJlYWRvbmx5QXJyYXk8QXR0YWNobWVudFR5cGU+O1xuICAgICAgZm9yY2U/OiBib29sZWFuO1xuICAgICAgdGltZXN0YW1wPzogbnVtYmVyO1xuICAgICAgdm9pY2VOb3RlQXR0YWNobWVudD86IEF0dGFjaG1lbnRUeXBlO1xuICAgIH0gPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1vZGVsIH06IHsgbW9kZWw6IENvbnZlcnNhdGlvbk1vZGVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wIHx8IERhdGUubm93KCk7XG5cbiAgICB0aGlzLnNlbmRTdGFydCA9IERhdGUubm93KCk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5kaXNhYmxlTWVzc2FnZUZpZWxkKCk7XG4gICAgICBjb25zdCBjb250YWN0cyA9IGF3YWl0IHRoaXMuZ2V0VW50cnVzdGVkQ29udGFjdHMob3B0aW9ucyk7XG5cbiAgICAgIGlmIChjb250YWN0cy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2VuZEFueXdheSA9IGF3YWl0IHRoaXMuc2hvd1NlbmRBbnl3YXlEaWFsb2coY29udGFjdHMpO1xuICAgICAgICBpZiAoc2VuZEFueXdheSkge1xuICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobWVzc2FnZSwgbWVudGlvbnMsIHsgZm9yY2U6IHRydWUsIHRpbWVzdGFtcCB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVuYWJsZU1lc3NhZ2VGaWVsZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZW5hYmxlTWVzc2FnZUZpZWxkKCk7XG4gICAgICBsb2cuZXJyb3IoXG4gICAgICAgICdzZW5kTWVzc2FnZSBlcnJvcjonLFxuICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbW9kZWwuY2xlYXJUeXBpbmdUaW1lcnMoKTtcblxuICAgIGlmICh0aGlzLnNob3dJbnZhbGlkTWVzc2FnZVRvYXN0KG1lc3NhZ2UpKSB7XG4gICAgICB0aGlzLmVuYWJsZU1lc3NhZ2VGaWVsZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoXG4gICAgICAgICFtZXNzYWdlLmxlbmd0aCAmJlxuICAgICAgICAhdGhpcy5oYXNGaWxlcyh7IGluY2x1ZGVQZW5kaW5nOiBmYWxzZSB9KSAmJlxuICAgICAgICAhb3B0aW9ucy52b2ljZU5vdGVBdHRhY2htZW50XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgYXR0YWNobWVudHM6IEFycmF5PEF0dGFjaG1lbnRUeXBlPiA9IFtdO1xuICAgICAgaWYgKG9wdGlvbnMudm9pY2VOb3RlQXR0YWNobWVudCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IFtvcHRpb25zLnZvaWNlTm90ZUF0dGFjaG1lbnRdO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmRyYWZ0QXR0YWNobWVudHMpIHtcbiAgICAgICAgYXR0YWNobWVudHMgPSAoXG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBvcHRpb25zLmRyYWZ0QXR0YWNobWVudHMubWFwKHJlc29sdmVBdHRhY2htZW50RHJhZnREYXRhKVxuICAgICAgICAgIClcbiAgICAgICAgKS5maWx0ZXIoaXNOb3ROaWwpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZW5kSFFJbWFnZXMgPVxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZSAmJlxuICAgICAgICB3aW5kb3cucmVkdXhTdG9yZS5nZXRTdGF0ZSgpLmNvbXBvc2VyLnNob3VsZFNlbmRIaWdoUXVhbGl0eUF0dGFjaG1lbnRzO1xuICAgICAgY29uc3Qgc2VuZERlbHRhID0gRGF0ZS5ub3coKSAtIHRoaXMuc2VuZFN0YXJ0O1xuXG4gICAgICBsb2cuaW5mbygnU2VuZCBwcmUtY2hlY2tzIHRvb2snLCBzZW5kRGVsdGEsICdtaWxsaXNlY29uZHMnKTtcblxuICAgICAgYXdhaXQgbW9kZWwuZW5xdWV1ZU1lc3NhZ2VGb3JTZW5kKFxuICAgICAgICB7XG4gICAgICAgICAgYm9keTogbWVzc2FnZSxcbiAgICAgICAgICBhdHRhY2htZW50cyxcbiAgICAgICAgICBxdW90ZTogdGhpcy5xdW90ZSxcbiAgICAgICAgICBwcmV2aWV3OiBnZXRMaW5rUHJldmlld0ZvclNlbmQobWVzc2FnZSksXG4gICAgICAgICAgbWVudGlvbnMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZW5kSFFJbWFnZXMsXG4gICAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICAgIGV4dHJhUmVkdXhBY3Rpb25zOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvc2l0aW9uQXBpLmN1cnJlbnQ/LnJlc2V0KCk7XG4gICAgICAgICAgICBtb2RlbC5zZXRNYXJrZWRVbnJlYWQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zZXRRdW90ZU1lc3NhZ2UobnVsbCk7XG4gICAgICAgICAgICByZXNldExpbmtQcmV2aWV3KCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQXR0YWNobWVudHMoKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZWR1eEFjdGlvbnMuY29tcG9zZXIucmVzZXRDb21wb3NlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgJ0Vycm9yIHB1bGxpbmcgYXR0YWNoZWQgZmlsZXMgYmVmb3JlIHNlbmQnLFxuICAgICAgICBlcnJvciAmJiBlcnJvci5zdGFjayA/IGVycm9yLnN0YWNrIDogZXJyb3JcbiAgICAgICk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuZW5hYmxlTWVzc2FnZUZpZWxkKCk7XG4gICAgfVxuICB9XG5cbiAgb25FZGl0b3JTdGF0ZUNoYW5nZShcbiAgICBtZXNzYWdlVGV4dDogc3RyaW5nLFxuICAgIGJvZHlSYW5nZXM6IEFycmF5PEJvZHlSYW5nZVR5cGU+LFxuICAgIGNhcmV0TG9jYXRpb24/OiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5tYXliZUJ1bXBUeXBpbmcobWVzc2FnZVRleHQpO1xuICAgIHRoaXMuZGVib3VuY2VkU2F2ZURyYWZ0KG1lc3NhZ2VUZXh0LCBib2R5UmFuZ2VzKTtcblxuICAgIC8vIElmIHdlIGhhdmUgYXR0YWNobWVudHMsIGRvbid0IGFkZCBsaW5rIHByZXZpZXdcbiAgICBpZiAoIXRoaXMuaGFzRmlsZXMoeyBpbmNsdWRlUGVuZGluZzogdHJ1ZSB9KSkge1xuICAgICAgbWF5YmVHcmFiTGlua1ByZXZpZXcoXG4gICAgICAgIG1lc3NhZ2VUZXh0LFxuICAgICAgICBMaW5rUHJldmlld1NvdXJjZVR5cGUuQ29tcG9zZXIsXG4gICAgICAgIGNhcmV0TG9jYXRpb25cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2F2ZURyYWZ0KFxuICAgIG1lc3NhZ2VUZXh0OiBzdHJpbmcsXG4gICAgYm9keVJhbmdlczogQXJyYXk8Qm9keVJhbmdlVHlwZT5cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtb2RlbCB9OiB7IG1vZGVsOiBDb252ZXJzYXRpb25Nb2RlbCB9ID0gdGhpcztcblxuICAgIGNvbnN0IHRyaW1tZWQgPVxuICAgICAgbWVzc2FnZVRleHQgJiYgbWVzc2FnZVRleHQubGVuZ3RoID4gMCA/IG1lc3NhZ2VUZXh0LnRyaW0oKSA6ICcnO1xuXG4gICAgaWYgKG1vZGVsLmdldCgnZHJhZnQnKSAmJiAoIW1lc3NhZ2VUZXh0IHx8IHRyaW1tZWQubGVuZ3RoID09PSAwKSkge1xuICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICBkcmFmdDogbnVsbCxcbiAgICAgICAgZHJhZnRDaGFuZ2VkOiB0cnVlLFxuICAgICAgICBkcmFmdEJvZHlSYW5nZXM6IFtdLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCB0aGlzLnNhdmVNb2RlbCgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2VUZXh0ICE9PSBtb2RlbC5nZXQoJ2RyYWZ0JykpIHtcbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICBsZXQgYWN0aXZlX2F0ID0gdGhpcy5tb2RlbC5nZXQoJ2FjdGl2ZV9hdCcpO1xuICAgICAgbGV0IHRpbWVzdGFtcCA9IHRoaXMubW9kZWwuZ2V0KCd0aW1lc3RhbXAnKTtcblxuICAgICAgaWYgKCFhY3RpdmVfYXQpIHtcbiAgICAgICAgYWN0aXZlX2F0ID0gbm93O1xuICAgICAgICB0aW1lc3RhbXAgPSBub3c7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgYWN0aXZlX2F0LFxuICAgICAgICBkcmFmdDogbWVzc2FnZVRleHQsXG4gICAgICAgIGRyYWZ0Qm9keVJhbmdlczogYm9keVJhbmdlcyxcbiAgICAgICAgZHJhZnRDaGFuZ2VkOiB0cnVlLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZU1vZGVsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIHdoZW5ldmVyIHRoZSB1c2VyIGNoYW5nZXMgdGhlIG1lc3NhZ2UgY29tcG9zaXRpb24gZmllbGQuIEJ1dCBvbmx5XG4gIC8vICAgZmlyZXMgaWYgdGhlcmUncyBjb250ZW50IGluIHRoZSBtZXNzYWdlIGZpZWxkIGFmdGVyIHRoZSBjaGFuZ2UuXG4gIG1heWJlQnVtcFR5cGluZyhtZXNzYWdlVGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKG1lc3NhZ2VUZXh0Lmxlbmd0aCAmJiB0aGlzLm1vZGVsLnRocm90dGxlZEJ1bXBUeXBpbmcpIHtcbiAgICAgIHRoaXMubW9kZWwudGhyb3R0bGVkQnVtcFR5cGluZygpO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuV2hpc3Blci5Db252ZXJzYXRpb25WaWV3ID0gQ29udmVyc2F0aW9uVmlldztcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQSxZQUF1QjtBQUN2QixvQkFBNEM7QUFDNUMsc0JBQXVCO0FBR3ZCLHdCQUFzQjtBQUN0QixlQUEwQjtBQVcxQiw0QkFBK0I7QUFDL0IscUJBQTZCO0FBQzdCLG9CQUE2QjtBQUM3QixvQ0FBdUM7QUFDdkMsOEJBQWlDO0FBQ2pDLGdDQUFtQztBQUVuQyxvQ0FJTztBQUNQLGtDQUFxQztBQUNyQyxvQkFBMEM7QUFDMUMscUJBS087QUFDUCwyQkFHTztBQUNQLHFCQUFtQztBQUNuQyxrQkFBeUI7QUFDekIsOEJBQWlDO0FBRWpDLCtDQUFrRDtBQUNsRCwwQ0FBNkM7QUFDN0MsVUFBcUI7QUFFckIsb0NBQXVDO0FBQ3ZDLGlDQUFvQztBQUVwQywrQkFBMkI7QUFDM0Isc0JBQXVDO0FBQ3ZDLDBCQUE2QjtBQUM3QiwrQkFBa0M7QUFDbEMsdURBQTBEO0FBQzFELHVDQUEwQztBQUMxQyx1Q0FBMEM7QUFDMUMsMkNBQThDO0FBQzlDLHlDQUE0QztBQUM1QyxvQ0FBdUM7QUFDdkMsMENBQTZDO0FBQzdDLDBCQUE2QjtBQUM3QiwyQkFBOEI7QUFDOUIsc0NBQXlDO0FBQ3pDLDRCQUErQjtBQUMvQixpQ0FBb0M7QUFDcEMscUNBQXdDO0FBQ3hDLHFDQUF3QztBQUN4QywwQ0FBNkM7QUFDN0MsMENBQTZDO0FBQzdDLGlDQUFvQztBQUNwQyx5Q0FBNEM7QUFDNUMsMkNBQThDO0FBQzlDLDJDQUE4QztBQUM5Qyx5Q0FBNEM7QUFDNUMsc0NBQXlDO0FBQ3pDLG1DQUFzQztBQUN0QywrQkFBa0M7QUFDbEMsc0NBQXlDO0FBQ3pDLDhCQUFpQztBQUNqQyxzQkFBeUI7QUFDekIsNEJBQTJCO0FBQzNCLGtDQUFxQztB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
