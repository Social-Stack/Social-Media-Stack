const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPublicPosts,
  getPostsByUserId,
  getPostById,
  editPostById,
  removePostById,
  getFriendsByUserId,
} = require("../db");

const { requireUser } = require("./utils");

router.post("/new", requireUser, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const userInputs = ({ text, time, isPublic } = req.body);

    if (Object.keys(userInputs).length === 3) {
      const newPost = await createPost({ userId, text, time, isPublic });
      res.send({
        newPost,
        success: "You've successfully created a new post!",
      });
    } else {
      next({
        error: "MissingPostFieldError",
        message: "Please supply all required fields",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.get("/public", requireUser, async (req, res, next) => {
  try {
    const allPublicPosts = await getAllPublicPosts();
    if (allPublicPosts) {
      res.send(allPublicPosts);
    } else {
      next({
        error: "NoPostsExistError",
        message: "No posts to display",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.get("/myfriends", async (req, res, next) => {
  //simply this whole function
  try {
    const { id: userId } = req.user;
    const allFriendsPosts = [];
    const friends = await getFriendsByUserId(userId);
    if (friends) {
      for (let i = 0; i < friends.length; i++) {
        const { friendId } = friends[i];
        const friendPosts = await getPostsByUserId(friendId);
        allFriendsPosts.push(...friendPosts);
      }
      res.send(allFriendsPosts);
    } else {
      next({
        error: "SorryYouHaveNoFriendsError",
        message:
          "You have no friends so therefore there isn't any posts to display",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.get("/me", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const allMyPosts = await getPostsByUserId(id);
    if (allMyPosts[0]) {
      res.send(allMyPosts);
    } else {
      next({
        error: "PostDoesNotExistError",
        message: "That post does not exist",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.patch("/update/:postId", requireUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;
    const { text, isPublic } = req.body;
    const post = await getPostById(postId);

    if (!post) {
      next({
        error: "NoPostFound",
        message: `No Post found by ID: ${postId}`,
      });
    } else if (isPublic === undefined || text === undefined) {
      next({
        error: "MissingData",
        message: "Send relevant fields",
      });
    } else if (userId !== post.userId) {
      next({
        error: "AuthorizationError",
        message: "You must be the original author of this post",
      });
    } else {
      const editedPost = await editPostById({ id: postId, text, isPublic, updateTime: new Date() });
      res.send({
        editedPost,
        success: "You've successfully edited a post!",
      });
    }
    // console.log(
    //   "IF YOU'RE SEEING THIS...there's a problem with the editPost patch request in api/posts (blame Fred)"
    // );
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.delete("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: userId, isAdmin } = req.user;
    const result = await getPostById(postId);
    let authorId;

    if (result) {
      authorId = result.userId;
    }

    if (isAdmin || authorId === userId) {
      const deletedPost = await removePostById(postId);
      res.send({
        deletedPost,
        success: "You've successfully removed this post!",
      });
    } else if (!result) {
      next({
        error: "PostDoesNotExistError",
        message: "That post does not exist",
      });
    } else if (!isAdmin || authorId !== userId) {
      next({
        error: "AuthorizationError",
        message: "You must be an Admin or the original author of this post",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = router;
