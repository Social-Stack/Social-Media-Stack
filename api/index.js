const express = require("express");
const apiRouter = express.Router();
const chalk = require("chalk");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { getUserById } = require("../db");

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(401);
    next({
      name: "AuthoriztionHeaderError",
      message: 'Authorization must start with "Bearer "',
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const postsRouter = require("./posts");
apiRouter.use("/posts", postsRouter);

const messagesRouter = require("./messages");
apiRouter.use("/messages", messagesRouter);

const friendsListsRouter = require("./friendsLists");
apiRouter.use("/friendsLists", friendsListsRouter);

// const upvotesRouter = require("./upvotes");
// apiRouter.use("/upvotes", upvotesRouter);

const commentsRouter = require("./comments");
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
