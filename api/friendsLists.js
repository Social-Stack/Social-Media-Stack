const express = require("express");
const friendsRouter = express.Router();

const {
  addFriends,
  getUserByUsername,
  removeFriend,
  getFriendsByUserId,
  getPostsByUserId,
} = require("../db");

const { requireUser } = require("./utils");

friendsRouter.post("/:friendUsername", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const { id: userId } = req.user;
    const result = await getUserByUsername(username);

    let friendsId;

    if (result) {
      friendsId = result.id;
    }

    if (friendsId) {
      const addFriend = await addFriends(userId, friendsId);
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

friendsRouter.delete(
  "/:friendUsername",
  requireUser,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const { id: userId } = req.user;
      const result = await getUserByUsername(username);

      let friendsId;

      if (result) {
        friendsId = result.id;
      }

      if (friendsId) {
        const deletedFriend = await removeFriend(userId, friendsId);
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
  }
);

// would this just be a / as the endpoint?
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

friendsRouter.get("/:friendUsername", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const { id: friendId } = await getUserByUsername(username);

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
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = friendsRouter;
