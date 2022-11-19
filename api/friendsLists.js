const express = require("express");
const friendsRouter = express.Router();

const {
  addFriends,
  removeFriend,
  getFriendsByUserId,
  getPostsByUserId,
  getUserById,
  isMyFriend,
  getUserByUsername,
} = require("../db");
const { myPendingRequestByUsername, amIPending } = require("../db/friendRequests");
const { removeNotiById, getNotiByFriendRequest } = require("../db/notifications");

const { requireUser } = require("./utils");


friendsRouter.get("/status/:username", requireUser, async (req, res, next) => {
  try {
    const user  = req.user;
    const {username: friendUserName} = req.params;
    const friendbool = await isMyFriend(user.id, friendUserName)

    if(user.username === friendUserName){
      res.send({status:"you"});
    }else if(await isMyFriend(user.id, friendUserName)){
      res.send({status:'friend'});
    }else if( await myPendingRequestByUsername(user.id, friendUserName)){
      res.send({status:'awaiting response'});
    }else if(await amIPending(user.id, friendUserName)){
      res.send({status:'awaiting You'});
    }else{
      res.send({status:'request'});
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

friendsRouter.post("/:friendId", requireUser, async (req, res, next) => {
  try {
    let { friendId } = req.params;
    const isId = Number(friendId);
    if(!isId){
      const {id:newId} = await getUserByUsername(friendId);
      friendId = newId;
    }

    const { id: userId } = req.user;
    const { id: notiId } = await getNotiByFriendRequest(userId, friendId);
    const validFriend = await getUserById(friendId);
    
    if (validFriend) {
      const newFriend = await addFriends(userId, friendId);
      await removeNotiById(notiId);

      if (typeof newFriend === "number") {
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
    const validFriend = await getUserById(friendId);

    if (validFriend) {
      const deletedFriend = await removeFriend(userId, friendId);

      if (deletedFriend[0]) {
        res.send({
          validFriend,
          success: "You've successfully removed a friend",
        });
      } else {
        next({
          error: "FriendAlreadyRemovedError",
          message: "A friend by that id has already been removed",
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

friendsRouter.get("/:userId", requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const friendsLists = await getFriendsByUserId(userId);
    if (friendsLists[0]) {
      res.send({
        friendsLists,
        success: "Your friends were successfully retrieved!",
      });
    } else {
      // Not sure if I can use the key "friends" here but I think it will be fine
      // since it is not used as the variable from above. If it does cause an error
      // blame CJ & change const to let
      res.send({
        friendsLists,
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

    const validFriend = await getUserById(friendId);

    if (validFriend) {
      const friendsPosts = await getPostsByUserId(friendId);

      if (friendsPosts[0]) {
        res.send({
          friendsPosts,
          success: "Your friend's posts were successfully retrieved!",
        });
      } else {
        // Not sure if I can use the key "friendsPosts" here but I think it will be fine
        // since it is not used the same as the variable from above. If it does cause an error
        // blame CJ & change const to let
        res.send({
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
