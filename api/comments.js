const express = require("express");

const commentsRouter = express.Router();
const {
  getPostById,
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
  getCommentById,
} = require("../db");
const { requireUser } = require("./utils");

commentsRouter.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  let userId = 0;

  if (req.user) {
    userId = req.user.id;
  }

  try {
    const post = await getPostById(postId);

    if (!post) {
      next({
        error: "PostNotFound",
        message: `No post found by ID: ${postId}`,
      });
    } else {
      const comments = await getCommentsByPostId(postId, userId);
      res.send({
        comments,
        success: `Comments for post: ${postId}`,
        });      
      }
    } catch ({ error, message }) {
      next({ error, message });
    }
});

commentsRouter.post("/:postId", requireUser, async (req, res, next) => {
  try {
    const { id: authorId } = req.user;
    const { postId } = req.params;
    const { time, text } = req.body;
    const post = await getPostById(postId);

    if (!post) {
      next({
        error: "PostNotFound",
        message: `No post found by ID: ${postId}`,
      });
    } else {
      const newComment = await createComment({ authorId, postId, time, text });

      res.send({
        newComment,
        success: `Successfully created a new comment`,
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});


commentsRouter.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { id: userId, isAdmin } = req.user;

    const comment = await getCommentById(commentId);
    if (comment && (userId === comment.authorId || isAdmin)) {
      const deletedComment = await deleteComment(commentId);
      console.log("DEL COMM API", deletedComment)
      res.send({
        deletedComment,
        success: "Successfully deleted this comment",
      });
    } else if (!comment) {
      next({
        error: "CommentDoesNotExistError",
        message: "That comment does not exist",
      });
    } else {
      res.status(403);
      next({
        error: "Forbidden",
        message: "Unauthorized to delete this comment",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});


commentsRouter.patch("/:id", requireUser, async (req, res, next) => {
  const { id: commentId } = req.params;
  const { id: currentUserId } = req.user;
  const { time, text } = req.body;

  try {
    const comment = await getCommentById(commentId);

    if (!comment) {
      next({
        error: "CommentNotFound",
        message: `No comment found by ID: ${commentId}`,
      });
    } else if (currentUserId !== comment.authorId) {
      res.status(403);
      next({
        error: "Forbidden",
        message: "Unauthorized to update this comment",
      });
    } else {
      const updatedComment = await updateComment({
        commentId,
        time,
        text,
      });

      res.send({
        updatedComment,
        success: "Successfully updated this comment",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
});


module.exports = commentsRouter;
