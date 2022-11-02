const express = require("express");
const postUpvotesRouter = express.Router();
const {
  getPostById,
  addUpvoteToPost,
  checkIfUpvotedPost,
  removeUpvoteFromPost,
  getPostUpvotesById,
} = require("../db");

const { requireUser } = require("./utils");

postUpvotesRouter.get("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await getPostById(postId);
    const { upvotes, upvoterIds } = await getPostUpvotesById(postId);
    let userHasUpvoted = false;
    const { userId } = req.user;
    userHasUpvoted = await checkIfUpvotedPost({ postId, userId });

    if (!post) {
      next({
        error: "PostNotFoundError",
        message: `No post with the id ${postId} has been found`,
      });
    } else {
      res.send({
        userHasUpvoted,
        postUpvotes,
        upvoterIds,
        success: `This post has ${upvotes} upvotes`,
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

postUpvotesRouter.post("/add", requireUser, async (req, res, next) => {
  const { userId } = req.user;
  const { id: postId } = req.body;

  try {
    const post = await getPostById(postId);
    const alreadyUpvoted = await checkIfUpvotedPost({ postId, userId });

    if (!post) {
      next({
        error: "PostNotFoundError",
        message: `No post with the id ${postId} has been found`,
      });
    } else if (alreadyUpvoted) {
      res.status(409);
      next({
        error: "AlreadyUpvotedError",
        message: "You've already upvoted this post",
      });
    } else {
      await addUpvoteToPost({
        postId,
        userId,
      });
      const { upvotes, upvoterIds } = await getPostUpvotesById(postId);

      res.send({
        upvotes,
        upvoterIds,
        success: "You've successfully upvoted this post",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

postUpvotesRouter.delete("/remove", requireUser, async (req, res, next) => {
  const { userId } = req.user;
  const { postId } = req.body;

  try {
    const post = await getPostById(postId);
    const alreadyUpvoted = await checkIfUpvotedPost({ postId, userId });

    if (!post) {
      next({
        error: "NoPostFoundError",
        message: `No post with the id ${postId} has been found`,
      });
    } else if (alreadyUpvoted) {
      const removedUpvote = await removeUpvoteFromPost({ postId, userId });
      res.send({
        removedUpvote,
        success: "You've successfully removed your upvote from this post",
      });
    } else {
      res.status(409);
      next({
        error: "NotUpvotedError",
        message: "You can't remove an upvote on a post you haven't upvoted",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});

module.exports = postUpvotesRouter;
