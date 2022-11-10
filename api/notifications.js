const express = require("express");
const { getNotisByUserId } = require("../db/notifications");
const { requireUser } = require("./utils");
const notificationsRouter = express.Router();

notificationsRouter.get("/me", requireUser, async (req, res, next) => {
    try {
        const { id } = req.user;
        const notifications = await getNotisByUserId(id);
        return notifications;
    } catch ({ error, message }) {
    next({ error, message });
  }
});

notificationsRouter.post("/seen/:id", requireUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await seenByNotiId(id);
        return notification;
    } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = notificationsRouter;
