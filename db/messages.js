const client = require("./client");

const createMessage = async ({
  sendingUserId,
  recipientUserId,
  time,
  text,
}) => {
  try {
    const {
      rows: [message],
    } = await client.query(
      `
        INSERT INTO messages ("sendingUserId", "recipientUserId", time, text)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
      [sendingUserId, recipientUserId, time, text]
    );
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getMessagesBetweenUsers = async (loggedInUserId, friendUserId) => {
  try {
    const { rows: messages } = await client.query(
      `
        SELECT *
        FROM messages
        WHERE "sendingUserId" = $1 AND "recipientUserId" = $2 OR
        "sendingUserId" = $2 AND "recipientUserId" = $1
        RETURNING *;
        `,
      [loggedInUserId, friendUserId]
    );
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const deleteMessageById = async (messageId) => {
  try {
    const {
      rows: [deletedMessage],
    } = await client.query(`
        DELETE FROM messages
        WHERE id = ${messageId}
        RETURNING *;
        `);
    return deletedMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllMessages = async (userId) => {
  try {
    const {
      rows: [allMessages],
    } = await client.query(
      `
    SELECT * 
    FROM messages
    WHERE "recipientUserId" = $1
    RETURNING *;
    `,
      [userId]
    );
    return allMessages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createMessage,
  getMessagesBetweenUsers,
  deleteMessageById,
  getAllMessages,
};
