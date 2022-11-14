const express = require("express");
const { getNotisByUserId, getUnseenNotisByUserId, seenAllByUserId } = require("../db/notifications");
const { requireUser } = require("./utils");
const notificationsRouter = express.Router();

notificationsRouter.get("/me", requireUser, async (req, res, next) => {
    try {
      const { id } = req.user;
      const notifications = await getNotisByUserId(id);
      res.send(notifications);
    } catch ({ error, message }) {
    next({ error, message });
  }
});

notificationsRouter.get("/unseen", requireUser, async (req, res, next) => {
  try {
    console.log('running api /unseen')
    const { id } = req.user;
    const unseenNotification = await getUnseenNotisByUserId(id);
    console.log('returning', unseenNotification)
    res.send(unseenNotification);
  } catch ({ error, message }) {
  next({ error, message });
}
});

notificationsRouter.post("/seen/:id", requireUser, async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await seenByNotiId(id);
      res.send(notification);
    } catch ({ error, message }) {
    next({ error, message });
  }
});

notificationsRouter.post("/seeall", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const notification = await seenAllByUserId(id);
    res.send(notification);
  } catch ({ error, message }) {
  next({ error, message });
}
});

module.exports = notificationsRouter;
