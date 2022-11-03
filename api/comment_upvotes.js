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

commentUpvotesRouter.get("/:commentId", requireUser, async(req, res, next) => {
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
    } else {
      res.send({
        commentId,
        userHasUpvoted,
        upvotes,
        upvoterIds,
        success: `This comment has ${upvotes} upvotes` 
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

commentUpvotesRouter.post("/add", requireUser, async(req, res, next) => {
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
      await addUpvoteToComment({
        commentId,
        userId
      });
      const { 
        upvotes, 
        upvoterIds 
      } = await getCommentUpvotesById(commentId);

      res.send({
        upvotes,
        upvoterIds,
        success: "Successfully upvoted this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

commentUpvotesRouter.delete("/remove", requireUser, async(req, res, next) => {
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