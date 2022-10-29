const express = require("express");
const friendsRouter = express.Router();

const {
  addFriends,
  removeFriend,
  getFriendsByUserId,
  getPostsByUserId,
} = require("../db");

const { requireUser } = require("./utils");

friendsRouter.post("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const { id: userId } = req.user;

    if (friendId) {
      const addFriend = await addFriends(userId, friendId);
      res.send({
        addFriend,
        success: "You've successfully added a friend",
      });
    } else {
      next({
        error: "FriendIdDoesNotExistError",
        message: "A friend with that id doesn't exist",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

friendsRouter.delete("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const { id: userId } = req.user;

    if (friendId) {
      const deletedFriend = await removeFriend(userId, friendId);
      res.send({
        deletedFriend,
        success: "You've successfully removed a friend",
      });
    } else {
      next({
        error: "FriendIdDoesNotExistError",
        message: "A friend with that id doesn't exist",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

friendsRouter.get("/", requireUser, async (req, res, next) => {
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

friendsRouter.get("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;
    if (friendId) {
      const friendsPosts = await getPostsByUserId(friendId);

      if (friendsPosts) {
        res.send({
          friendsPosts,
          success: "Your friend's posts were successfully retrieved!",
        });
      } else {
        next({
          error: "FriendHasNoPostsError",
          message: "This friend doesn't have any posts currently",
        });
      }
    } else {
      next({
        error: "FriendIdDoesNotExistError",
        message: "A friend with that id doesn't exist",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = friendsRouter;
