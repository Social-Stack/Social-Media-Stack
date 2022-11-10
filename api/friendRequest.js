const express = require("express");
const { requestFriend } = require("../db/friendRequests");
const { requireUser } = require("./utils");

const friendRequestsRouter = express.Router();

friendRequestsRouter.post("/new/:id", requireUser, async(req, res, next) => {
    try{
        const { id: actionFriendId } = req.user;
        const { id: requestedFriendId } = req.params;

        const request = await requestFriend(actionFriendId, requestedFriendId);
        req.send(request);
    } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = friendRequestsRouter;
