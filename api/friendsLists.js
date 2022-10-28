const express = require("express");
const friendsRouter = express.Router();

const {
  addFriends,
  getUserByUsername,
  removeFriend,
  getFriendsByUserId,
} = require("../db");

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

      const deletedFriend = await removeFriend(userId, friendsId);
      res.send({
        deletedFriend,
        success: "You've successfully removed a friend",
      });
    } catch ({ error, message }) {
      next({ error, message });
    }
  }
);

friendsRouter.get("/friends", requireUser, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const friends = await getFriendsByUserId(userId);
    if (friends) {
      res.send({
        friends,
        success: "Your friends were successfully retrieved!",
      });
    } else {
      next({
        error: "YouHaveNoFriendsError",
        message: "You currently have no friends. Please add some.",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = friendsRouter;
