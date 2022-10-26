const express = require("express");
const apiRouter = express.Router();
const chalk = require("chalk");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
