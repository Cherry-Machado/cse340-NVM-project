const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const messageModel = require("../models/message-model");

/**
 * Deliver inbox view get
 */

async function buildInbox(req, res, next) {
  let nav = await utilities.getNav();
  let messages = await messageModel.getMessagesToId(
    res.locals.accountData.account_id
  );
  const archivedMessages = await messageModel.getMessageCountById(
    res.locals.accountData.account_id,
    true
  );

  res.render("message/inbox", {
    title: `${res.locals.accountData.account_firstname} Inbox`,
    nav,
    errors: null,
    messageList: messages,
    archived: false,
    archivedMessages,
  });
}

/**
 * Deliver archive view get
 */
async function buildArchive(req, res, next) {
  let nav = await utilities.getNav();
  let messages = await messageModel.getMessagesToId(
    res.locals.accountData.account_id,
    true
  );
  const unarchivedMessages = await messageModel.getMessageCountById(
    res.locals.accountData.account_id,
    false
  );

  res.render("message/archive", {
    title: `${res.locals.accountData.account_firstname} Inbox: Archived Messages`,
    nav,
    errors: null,
    messageList: messages,
    archived: true,
    unarchivedMessages,
  });
}

/**
 * Deliver message view get
 */
async function buildMessageView(req, res, next) {
  const message_id= req.params.messageId;
  const message = await messageModel.getMessageById(message_id);

  if (!message) {
    req.flash("notice", "Message not found.");
    return res.redirect("/message");
  }

  // Authorization check
  if (message.message_to == res.locals.accountData.account_id) {
    // If the message has not been read, mark it as read
    if (!message.message_read) {
      await messageModel.markMessageAsRead(message_id);
    }

    const nav = await utilities.getNav();
    res.render("message/message-view", {
      title: "Message: " + message.message_subject,
      nav,
      errors: null,
      message: message,
    });
  } else {
    req.flash("notice", "You aren't authorized to view that message.");
    res.redirect("/message");
  }
}

/**
 * Deliver compose view get
 */
async function buildCompose(req, res, next) {
  const nav = await utilities.getNav();
  const recipientData = await accountModel.getAccountList();
  let title = "Compose New Message";
  let recipientList;
  let subject = "";
  let body = "";

  if (req.params.messageId) {
    // Reply path
    const replyTo = await messageModel.getMessageById(req.params.messageId);
    subject = replyTo.message_subject.startsWith("Re: ")
      ? replyTo.message_subject
      : "Re: " + replyTo.message_subject;
    const formattedDate = new Date(replyTo.message_created).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    title = `Reply to ${replyTo.account_firstname} ${replyTo.account_lastname}`;
    body = `\n\n\n---- Original Message ----\nOn ${formattedDate}, ${
      replyTo.account_firstname
    } ${replyTo.account_lastname} wrote:\n\n${replyTo.message_body}`;
    recipientList = utilities.buildRecipientList(
      recipientData,
      replyTo.account_id
    );
  } else {
    // Compose new path
    recipientList = utilities.buildRecipientList(recipientData);
  }

  res.render("message/compose", {
    title,
    nav,
    errors: null,
    recipientList,
    message_subject: subject,
    message_body: body,
  });
}

/**
 * Process send message post
 */
async function sendMessage(req, res, next) {
  const result = await messageModel.sendMessage({
    message_from: res.locals.accountData.account_id,
    message_to: req.body.message_to,
    message_subject: req.body.message_subject,
    message_body: req.body.message_body,
  });

  req.flash("success", "Message sent successfully!");
  res.redirect("/message/");
}

/**
 * Deliver delete confirmation view get
 */
async function buildDelete(req, res, next) {
  let nav = await utilities.getNav();
  const message_id = parseInt(req.params.messageId);
  const message = await messageModel.getMessageById(message_id);

  if (!message) {
    req.flash("notice", "Message not found.");
    return res.redirect("/message");
  }

  // Authorization check
  if (message.message_to !== res.locals.accountData.account_id) {
    req.flash("notice", "You are not authorized to delete that message.");
    return res.redirect("/message");
  }

  res.render("message/delete", {
    title: "Confirm Deletion",
    nav,
    errors: null,
    message: message,
  });
}

/**
 * Process delete post
 */
async function deleteMessage(req, res, next) {
  const message_id = parseInt(req.body.message_id);
  const message = await messageModel.getMessageById(message_id);

  if (!message) {
    req.flash("notice", "Message not found.");
    return res.redirect("/message");
  }

  // Authorization check
  if (message.message_to !== res.locals.accountData.account_id) {
    req.flash("notice", "You are not authorized to delete that message.");
    return res.redirect("/message");
  }

  await messageModel.deleteMessage(message_id);
  req.flash("success", "Message deleted successfully.");
  res.redirect("/message/");
}

/**
 * Toggle a messages read flag
 */
async function toggleRead(req, res, next) {
  const messageId = parseInt(req.params.messageId);
  const message = await messageModel.getMessageById(messageId);

  if (!message) {
    return res.status(404).json({ status: "error", message: "Message not found" });
  }

  // Authorization check
  if (message.message_to !== res.locals.accountData.account_id) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }

  const message_read = await messageModel.toggleRead(messageId);
  return res.json({ status: "ok", read: message_read });
}

/**
 *  Toggle a messages archived flag
 */
async function toggleArchived(req, res, next) {
  const messageId = parseInt(req.params.messageId);
  const message = await messageModel.getMessageById(messageId);

  if (!message) {
    return res.status(404).json({ status: "error", message: "Message not found" });
  }

  // Authorization check
  if (message.message_to !== res.locals.accountData.account_id) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }

  const isArchived = await messageModel.toggleArchived(messageId);
  const flashMessage = isArchived
    ? "Message archived successfully."
    : "Message moved to inbox.";

  req.flash("success", flashMessage);
  return res.json({ status: "ok", archived: isArchived, redirect: "/message" });
}

module.exports = {
  buildInbox,
  buildMessageView,
  buildCompose,
  sendMessage,
  buildArchive,
  buildDelete,
  deleteMessage,
  toggleRead,
  toggleArchived,
};
