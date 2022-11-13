const express = require("express");
const { requestFriend, denyFriend } = require("../db/friendRequests");
const { removeNotiById } = require("../db/notifications");
const { requireUser } = require("./utils");

const friendRequestsRouter = express.Router();

friendRequestsRouter.post("/new/:id", requireUser, async(req, res, next) => {
    try{
        const { id: actionFriendId } = req.user;
        const { id: requestedFriendId } = req.params;

        const request = await requestFriend(actionFriendId, requestedFriendId);
        res.send(request);
    } catch ({ error, message }) {
    next({ error, message });
  }
});

friendRequestsRouter.delete("/remove", requireUser, async(req, res, next) => {
  try{
      const { id: userId} = req.user;
      const { requestedFriendId, notiId } = req.body;
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
