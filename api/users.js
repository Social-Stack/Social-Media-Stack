const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  updateUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  authenticateUser,
  getFriendsByUserId,
  getPostsByUsername,
  isMyFriend,
} = require("../db");
const { requireUser } = require("./utils");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

//LOGIN
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await authenticateUser({ username, password });

  if (!username || !password) {
    next({
      error: "MissingCredentials",
      message: "Please provide both a username and password",
    });
  }

  try {
    if (user) {
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1w" });

      res.send({
        user,
        message: "Login successful.",
        token,
      });
    } else {
      next({
        error: "Invalid Credentials",
        message: "Incorrect username or password.",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

// REGISTER
usersRouter.post("/register", async (req, res, next) => {
  const {
    username,
    password,
    confirmPassword,
    firstname,
    lastname,
    email,
    picUrl,
  } = req.body;

  try {
    const _user = await getUserByUsername(username);
    const _email = await getUserByEmail(email);
    if (_user) {
      next({
        error: "Username Exists",
        message: `${username} is already taken.`,
      });
    } else if (_email) {
      next({
        error: "E-mail Exists",
        message: `${email} is already taken.`,
      });
    } else if (password.length < 8) {
      next({
        error: "Password Too Short",
        message: "Minimum password length is 8 characters",
      });
    } else if (password !== confirmPassword) {
      next({
        error: "Passwords do not match",
        message: "Passwords do not match",
      });
    } else {
      await createUser({
        username,
        password,
        firstname,
        lastname,
        email,
        picUrl,
      });

      const userData = await authenticateUser({
        username,
        password,
      });

      const token = jwt.sign(userData, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({
        user: userData,
        success: "Thanks for signing up!",
        token,
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

// PATCH
usersRouter.patch("/:username/edit", requireUser, async (req, res, next) => {
  const { id, username: _username } = req.user;
  const { username } = req.params;

  const userInputs = ({
    firstname,
    lastname,
    password,
    confirmPassword,
    email,
    picUrl,
  } = req.body);
  userInputs.id = id;

  Object.keys(userInputs).forEach((key) => {
    if (userInputs[key] === "") {
      delete userInputs[key];
    }
  });

  if (password && password !== confirmPassword) {
    next({
      error: "Passwords do not match",
      message: "Passwords do not match",
    });
  } else if (password && password.length < 8) {
    next({
      error: "Password Too Short",
      message: "Minimum password length is 8 characters",
    });
  } else if (Object.keys(userInputs).length <= 1) {
    next({
      error: "No Fields Submitted",
      message: "You must update at least one field before submission",
    });
  } else {
    try {
      const _email = await getUserByEmail(email);

      if (username !== _username) {
        res.status(403).send({
          error: "Unauthorized User",
          message: `${_username} cannot update ${username}'s information.`,
        });
      } else if (_email) {
        next({
          error: "E-mail Exists",
          message: `${email} is already taken.`,
        });
      } else {
        if (userInputs.confirmPassword) {
          delete userInputs.confirmPassword;
        }
        await updateUser(userInputs);
        delete userInputs.id;
        res.send({
          userInputs,
          success: `Successfully updated ${username}'s profile!`,
        });
      }
    } catch ({ error, message }) {
      next({ error, message });
    }
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  const { username } = req.user;
  try {
    const user = await getUserByUsername(username);
    res.send(user);
  } catch ({ error, message }) {
    next({ error, message });
  }
});

usersRouter.get("/:friendId", requireUser, async (req, res, next) => {
  const { friendId: id } = req.params;
  try {
    const user = await getUserById(id);
    res.send(user);
  } catch ({ error, message }) {
    next({ error, message });
  }
});

usersRouter.get("/profile/:username", requireUser, async (req, res, next) => {
  const { username } = req.params;
  const { id } = req.user;
  try {
    const user = await getUserByUsername(username);
    const friendList = await getFriendsByUserId(user.id);
    const posts = await getPostsByUsername(username);
    if (user.username === username) {
      res.send({ user, friendList, posts });
    } else if (await isMyFriend(id, username)) {
      res.send({ user, friendList, posts });
    } else {
      next({
        error: "UnauthorizedError",
        message: "You are not authorized to perform this function!",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = usersRouter;
