// Needed Resources
const express = require("express");
const router = new express.Router();

const messageController = require("../controllers/messageController");
const messageValidation = require("../utilities/message-validation");
const utilities = require("../utilities");

// Route to build the main inbox view
router.get("/", utilities.checkLogin, utilities.handleErrors(messageController.buildInbox));

// Route to build message view view
router.get(
  "/view/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildMessageView)
);

// Route to build compose messages view
router.get(
  "/compose",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildCompose)
);
router.get(
  "/compose/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildCompose)
);
router.post(
  "/send",
  utilities.checkLogin,
  messageValidation.sendMessageRules(),
  messageValidation.checkMessageData,
  utilities.handleErrors(messageController.sendMessage)
);

// Rout to build archived messages view
router.get(
  "/archive",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildArchive)
);

// Route to build delete message confirmation view
router.get(
  "/view/:messageId/delete",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildDelete)
);
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(messageController.deleteMessage)
);

//API calls
router.post(
  "/view/:messageId/toggle-read",
  utilities.checkLogin,
  utilities.handleErrors(messageController.toggleRead)
);
router.post(
  "/view/:messageId/toggle-archived",
  utilities.checkLogin,
  utilities.handleErrors(messageController.toggleArchived)
);

module.exports = router;