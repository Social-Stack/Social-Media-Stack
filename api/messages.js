const express = require("express");
const messagesRouter = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers,
  deleteMessageById,
  getAllMessages,
  getUserById,
} = require("../db");
const { requireUser } = require("./utils");

messagesRouter.post("/new", requireUser, async (req, res, next) => {
  try {
    const { id: sendingUserId } = req.user;
    const { recipientUserId, time, text } = req.body;

    const newMessage = await createMessage({
      sendingUserId,
      recipientUserId,
      time,
      text,
    });
    res.send({
      newMessage,
      success: "New message sent!",
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

messagesRouter.get("/chat", requireUser, async (req, res, next) => {
  const { id: loggedInUserId } = req.user;
  const { id: friendUserId } = req.body;

  const user = getUserById(loggedInUserId);
  const friend = getUserById(friendUserId);
  try {
    const messagesBetweenUsers = await getMessagesBetweenUsers(
      loggedInUserId,
      friendUserId
    );
    res.send({
      messagesBetweenUsers,
      success: `Chat history between ${user} and ${friend}`,
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

messagesRouter.delete("/:messageId", requireUser, async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = deleteMessageById(messageId);
    res.send({
      deletedMessage,
      success: "Message deleted!",
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

messagesRouter.get("/chatlist", requireUser, async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await getUserById(userId);
    const allMyMessages = await getAllMessages(userId);

    res.send({
      allMyMessages,
      success: `Chat history for ${user.username}`,
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});
module.exports = messagesRouter;
