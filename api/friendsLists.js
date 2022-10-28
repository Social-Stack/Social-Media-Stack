//friendsLists file - delete this if you're writing this file
const express = require("express");
const friendsRouter = express.Router();

const { addFriends, getUserByUsername, removeFriend } = require("../db");

const { requireUser } = require("./utils");

friendsRouter.post(
  "/friends/:friendId",
  requireUser,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const { id: userId } = req.user;
      const { id: friendsId } = await getUserByUsername(username);

      const addFriend = await addFriends(userId, friendsId);
      res.send({
        addFriend,
        success: "You've successfully added a friend",
      });
    } catch ({ error, message }) {
      next({ error, message });
    }
  }
);

friendsRouter.delete(
  "/friends/:friendId",
  requireUser,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const { id: userId } = req.user;
      const { id: friendsId } = await getUserByUsername(username);

      const removeFriend = await removeFriend(userId, friendsId);
      res.send({
        removeFriend,
        success: "You've successfully removed a friend",
      });
    } catch ({ error, message }) {
      next({ error, message });
    }
  }
);

friendsRouter.get("/friends/:friendId", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const { id: userId } = req.user;
    const { id: friendId } = await getUserByUsername(username);
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = friendsRouter;
