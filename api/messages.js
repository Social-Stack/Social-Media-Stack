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
    console.log("REQ.USER", loggedInUserId);
    const { friendUserId } = req.params;
    console.log("REQ.PARAMS", friendUserId);

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
    console.log("MESSAGE ID", messageId);
    const { id: userId, isAdmin } = req.user;
    console.log("userId", userId);

    const messageToDelete = await getMessageById(messageId);
    console.log("MESSAGE TO DELETE", messageToDelete);
    if (!messageToDelete[0]) {
      console.log("INSIDE ELSE IF");
      next({
        error: "MessageDoesNotExistError",
        message: "That message does not exist",
      });
    } else if (
      (messageToDelete && messageToDelete[0].id === userId) ||
      isAdmin
    ) {
      const deletedMessage = await deleteMessageById(messageId);
      console.log("DELETED MESSAGE INSIDE", deletedMessage);
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
