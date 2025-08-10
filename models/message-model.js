const pool = require("../database/");

/**
 * Get all messages sent to a specific account ID.
 * @param {number} accountId - The ID of the account receiving the messages.
 * @param {boolean} [archived=false] - Flag to filter by archived status.
 * @returns {Promise<Array|Error>} A promise that resolves to an array of message objects.
 */
async function getMessagesToId(accountId, archived = false) {
  const sqlQuery = `
    SELECT 
        message_id, 
        message_subject, 
        message_body, 
        message_created, 
        message_to, 
        message_from, 
        message_read, 
        message_archived, 
        account_firstname, 
        account_lastname, 
        account_type
    FROM public.message JOIN public.account ON public.message.message_from = public.account.account_id
    WHERE message_to = $1 AND (message_archived = $2 OR ($2 = false AND message_archived IS NULL))
    ORDER BY message_created DESC`;

  try {
    return (await pool.query(sqlQuery, [accountId, archived])).rows;
  } catch (error) {
    console.error("getMessagesToId error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Get a single message by its ID.
 * @param {number} messageId - The ID of the message to retrieve.
 * @returns {Promise<object|null|Error>} A promise that resolves to a single message object, or null if not found.
 */
async function getMessageById(messageId) {
  const sqlQuery = `
        SELECT 
            message_id, 
            message_subject, 
            message_body, 
            message_created, 
            message_to, 
            message_from, 
            message_read,
            message_archived,
            account_id,
            account_firstname,
            account_lastname,
            account_type
        FROM public.message JOIN public.account
        ON public.message.message_from = public.account.account_id
        WHERE message_id = $1`;

  try {
    const result = await pool.query(sqlQuery, [messageId]);
    return result.rows[0];
  } catch (error) {
    console.error("getMessageById error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Inserts a new message into the database.
 * @param {object} messageData - The message data to insert.
 * @returns {Promise<object|Error>} A promise that resolves to the result of the query.
 */
async function sendMessage(messageData) {
  const sqlQuery = `
    INSERT INTO public.message (message_subject, message_body, message_to, message_from)
    VALUES ($1, $2, $3, $4);  
  `;
  try {
    const result = await pool.query(sqlQuery, [
      messageData.message_subject,
      messageData.message_body,
      messageData.message_to,
      messageData.message_from,
    ]);
    return result;
  } catch (error) {
    console.error("sendMessage error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Counts messages for a specific account.
 * @param {number} accountId - The ID of the account.
 * @param {boolean} [archived=false] - Flag to filter by archived status.
 * @returns {Promise<number|Error>} A promise that resolves to the count of messages.
 */
async function getMessageCountById(accountId, archived = false) {
  const sqlQuery = `
          SELECT COUNT(*) 
          FROM public.message
          WHERE message_to = $1 AND message_archived = $2`;
  try {
    return (await pool.query(sqlQuery, [accountId, archived])).rows[0].count;
  } catch (error) {
    console.error("getMessageCountById error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Gets the count of unread messages for an account.
 * @param {number} accountId - The ID of the account.
 * @returns {Promise<number|Error>} A promise that resolves to the count of unread messages.
 */
async function getUnreadMessageCount(accountId) {
  const sqlQuery = `
    SELECT COUNT(*) 
    FROM public.message
    WHERE message_to = $1 AND message_read = false AND message_archived = false`;
  try {
    const result = await pool.query(sqlQuery, [accountId]);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error("getUnreadMessageCount error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Marks a message as read.
 * @param {number} messageId - The ID of the message.
 * @returns {Promise<number|Error>} A promise that resolves to the number of affected rows.
 */
async function markMessageAsRead(messageId) {
  const sqlQuery = "UPDATE public.message SET message_read = true WHERE message_id = $1 AND message_read = false RETURNING message_id";
  try {
    const result = await pool.query(sqlQuery, [messageId]);
    return result.rowCount;
  } catch (error) {
    console.error("markMessageAsRead error: " + error);
    throw new Error("Database query failed");
  }
}

/**
 * Toggles the 'read' status of a message.
 * @param {number} messageId - The ID of the message.
 * @returns {Promise<boolean|Error>} A promise that resolves to the new 'read' status.
 */
async function toggleRead(messageId) {
  const sqlQuery =
    "UPDATE public.message SET message_read = NOT message_read WHERE message_id = $1 RETURNING message_read";
  const result = await pool.query(sqlQuery, [messageId]);
  return result.rows[0].message_read;
}

/**
 * Toggles the 'archived' status of a message.
 * @param {number} messageId - The ID of the message.
 * @returns {Promise<boolean|Error>} A promise that resolves to the new 'archived' status.
 */
async function toggleArchived(messageId) {
  const sqlQuery =
    "UPDATE public.message SET message_archived = NOT message_archived WHERE message_id = $1 RETURNING message_archived";
  const result = await pool.query(sqlQuery, [messageId]);
  return result.rows[0].message_archived;
}

/**
 * Deletes a message from the database.
 * @param {number} messageId - The ID of the message to delete.
 * @returns {Promise<object|Error>} A promise that resolves to the query result.
 */
async function deleteMessage(messageId) {
  const sqlQuery = "DELETE FROM public.message WHERE message_id = $1";
  try {
    const result = await pool.query(sqlQuery, [messageId]);
    return result;
  } catch (error) {
    console.error("deleteMessage error: " + error);
    throw new Error("Database query failed");
  }
}

module.exports = {
  getMessagesToId,
  getMessageById,
  sendMessage,
  getMessageCountById,
  getUnreadMessageCount,
  markMessageAsRead,
  toggleRead,
  toggleArchived,
  deleteMessage,
};
