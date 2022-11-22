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
        SELECT messages.*, users.firstname AS sendingfirstname
        FROM messages
        JOIN users
          ON messages."sendingUserId" = users.id
        WHERE "sendingUserId" = $1 AND "recipientUserId" = $2 OR
        "sendingUserId" = $2 AND "recipientUserId" = $1;
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
    SELECT messages.*, users.username AS sendingUsername, users.firstname AS sendingFirstname, users.lastname AS sendingLastname, users."picUrl" AS sendingProfilePic, users."lastActive" AS active
    FROM messages
    JOIN users
      ON messages."sendingUserId" = users.id
    WHERE "recipientUserId" = $1
    union
    SELECT messages.*, users.username AS sendingUsername, users.firstname AS sendingFirstname, users.lastname AS sendingLastname, users."picUrl" AS sendingProfilePic, users."lastActive" AS active
    FROM messages
    JOIN users
      ON messages."recipientUserId" = users.id
    WHERE "sendingUserId" = $1
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getMessageById = async (messageId) => {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM messages
      WHERE messages.id = ${messageId};
      `
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
  getMessageById,
};
