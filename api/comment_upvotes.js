const express = require("express");
const commentUpvotesRouter = express.Router();
const { 
  addUpvoteToComment,
  removeUpvoteFromComment,
  checkIfUpvoted,
  getCommentUpvotesById,
  getCommentById
} = require("../db");
const { requireUser } = require("./utils")

commentUpvotesRouter.get("/:commentId", async(req, res, next) => {
  const { commentId } = req.params;
  
  try {
    const comment = await getCommentById(commentId);
    const { upvotes, upvoterIds } = await getCommentUpvotesById(commentId);
    let userHasUpvoted = false;

    // User is not required to view comment but if they are logged in we can check if they upvoted this comment already
    if (req.user) {
      const { id: userId } = req.user;
      userHasUpvoted = await checkIfUpvoted({ commentId, userId });
    }

    if (!comment) {
      next({
        error: "CommentNotFound",
        message: `No comment found by ID: ${commentId}`
      });
    } else if (!upvotes) {
      // Since no upvotes is not an error, still handling as a success
      res.send({
        upvotes,
        success: "This comment has no upvotes yet"
      })
    } else {
      res.send({
        userHasUpvoted,
        upvotes,
        upvoterIds,
        success: `This comment has ${upvoteCount} upvotes` 
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

commentUpvotesRouter.post("/addvote", requireUser, async(req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.body;

  try {
    const comment = await getCommentById(commentId);
    const alreadyUpvoted = await checkIfUpvoted({
      commentId,
      userId
    })
    if (!comment) {
      next({
        error: "CommentNotFound",
        message: `No comment found by ID: ${commentId}`
      });
    } else if (alreadyUpvoted) {
      res.status(409);
      next({
        error: "Conflict",
        message: "You have already upvoted this comment"
      });
    } else {
      const upvote = await addUpvoteToComment({
        commentId,
        userId
      });
      res.send({
        upvote,
        success: "Successfully upvoted this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

commentUpvotesRouter.delete("/removevote", requireUser, async(req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.body;

  try {
    const comment = await getCommentById(commentId);
    const alreadyUpvoted = await checkIfUpvoted({
      commentId,
      userId
    })
    if (!comment) {
      next({
        error: "CommentNotFound",
        message: `No comment found by ID: ${commentId}`
      });
    } else if (alreadyUpvoted) {
      const removedUpvote = await removeUpvoteFromComment({
        commentId,
        userId
      })
      res.send({
        removedUpvote,
        success: "Successfully removed upvote from this comment"
      })
    } else {
      res.status(409);
      next({
        error: "Conflict",
        message: "You have not previously upvoted this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

module.exports = commentUpvotesRouter;