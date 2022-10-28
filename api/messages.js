const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers,
  deleteMessageById,
  getAllMessages,
  getUserById,
} = require("../db");

router.post("/new", async (req, res, next) => {
  try {
    const { id: sendingUserId } = req.user;
    const { id: recipientUserId, time, text } = req.body;

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

router.get("/chat", async (req, res, next) => {
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

router.delete("/:messageId", async (req, res, next) => {
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

router.get("/chatlist", async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = getUserById(loggedInUserId);
    const allMyMessages = getAllMessages(userId);
    res.send({
      allMyMessages,
      success: `Chat history for ${user}`,
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});
module.exports = router;
