const express = require("express");
const { getFriendsByUserId, getUserByUsername } = require("../db");
const { requestFriend, denyFriend } = require("../db/friendRequests");
const { removeNotiById, getNotiByFriendRequest } = require("../db/notifications");
const { requireUser } = require("./utils");

const friendRequestsRouter = express.Router();

friendRequestsRouter.post("/new/:username", requireUser, async(req, res, next) => {
    try{
        const { id: actionFriendId } = req.user;
        const { username: requestedFriendUsername } = req.params;
        const { id: requestedFriendId } = await getUserByUsername(requestedFriendUsername)

        const request = await requestFriend(actionFriendId, requestedFriendId);
        res.send(request);
    } catch ({ error, message }) {
    next({ error, message });
  }
});

friendRequestsRouter.delete("/remove", requireUser, async(req, res, next) => {
  try{
      const { id: userId} = req.user;
      let { requestedFriendId } = req.body;
      const isId = Number(requestedFriendId);
      if(!isId){
        const {id:newId} = await getUserByUsername(requestedFriendId);
        requestedFriendId = newId;
      }

      const { id: notiId } = await getNotiByFriendRequest(userId, requestedFriendId);

      const request = await denyFriend(requestedFriendId, userId);
      if(request){
        await removeNotiById(notiId);
      }
      res.send(request);
  } catch ({ error, message }) {
  next({ error, message });
}
});


module.exports = friendRequestsRouter;
