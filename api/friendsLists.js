const express = require("express");
const friendsRouter = express.Router();

const {
  addFriends,
  removeFriend,
  getFriendsByUserId,
  getPostsByUserId,
  getUserById,
} = require("../db");

const { requireUser } = require("./utils");

friendsRouter.post("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const { id: userId } = req.user;
    const validFriend = await getUserById(friendId);

    if (validFriend) {
      const newFriend = await addFriends(userId, friendId);
      if (newFriend) {
        res.send({
          validFriend,
          success: "You've successfully added a friend",
        });
      } else {
        next({
          error: "AlreadyFriendsError",
          message: "You're already friends!",
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

friendsRouter.delete("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const { id: userId } = req.user;
    const validFriendId = await getUserById(friendId);

    if (validFriendId) {
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
      // Not sure if I can use the key "friends" here but I think it will be fine
      // since it is not used as the variable from above. If it does cause an error
      // blame CJ & change const to let
      next({
        friends: [],
        success: "You currently have no friends. Please add some.",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

friendsRouter.get("/:friendId", requireUser, async (req, res, next) => {
  try {
    const { friendId } = req.params;

    const validFriendId = await getUserById(friendId);

    if (validFriendId) {
      const friendsPosts = await getPostsByUserId(friendId);

      if (friendsPosts) {
        res.send({
          friendsPosts,
          success: "Your friend's posts were successfully retrieved!",
        });
      } else {
        // Not sure if I can use the key "friendsPosts" here but I think it will be fine
        // since it is not used the same as the variable from above. If it does cause an error
        // blame CJ & change const to let
        next({
          friendsPosts: [],
          success: "This friend doesn't have any posts currently",
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
