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
    const { rows } = await client.query(
      `
    SELECT messages.*, users.username AS sendingUsername, users.firstname AS sendingFirstname, users.lastname AS sendingLastname
    FROM messages
    JOIN users
      ON messages."sendingUserId" = users.id
    WHERE "recipientUserId" = $1;
    `,
      [userId]
    );

    return rows;
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
