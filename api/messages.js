const express = require("express");
const messagesRouter = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers,
  deleteMessageById,
  getAllMessages,
  getUserById,
  getMessageById,
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

messagesRouter.get(
  "/chat/:friendUserId",
  requireUser,
  async (req, res, next) => {
    const { id: loggedInUserId } = req.user;
    const { friendUserId } = req.params;

    const user = await getUserById(loggedInUserId);
    const friend = await getUserById(friendUserId);
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
  }
);

messagesRouter.delete("/:messageId", requireUser, async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { id: userId, isAdmin } = req.user;

    const messageToDelete = await getMessageById(messageId);
    if (!messageToDelete[0]) {
      next({
        error: "MessageDoesNotExistError",
        message: "That message does not exist",
      });
    } else if (
      (messageToDelete && messageToDelete[0].sendingUserId === userId) ||
      isAdmin
    ) {
      const deletedMessage = await deleteMessageById(messageId);
      res.send({
        deletedMessage,
        success: "Message deleted!",
      });
    } else {
      res.status(403);
      next({
        error: "Forbidden",
        message: "Unauthorized to delete this message",
      });
    }
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
