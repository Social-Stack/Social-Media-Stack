const express = require("express");

const router = express.Router();
const {
  getCommentsByPostId,
  getPostById,
  createComment,
  getCommentById,
  deleteComment,
  updateComment,
} = require("../db");
const { requireUser } = require("./utils");

router.get("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await getCommentsByPostId(postId);
    res.send(comments);
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.post("/:postId", requireUser, async (req, res, next) => {
  try {
    const { id: authorId } = req.user;
    const { postId } = req.params;
    const { time, text } = req.body;

    const newComment = await createComment({ authorId, postId, time, text });
    res.send(newComment);
    const post = await getPostById(postId);
    res.send({
      post,
      success: `Successfully created a new comment`,
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { id: userId, isAdmin } = req.user;

    const comment = await getCommentById(commentId);
    if (comment && (userId === comment.authorId || isAdmin)) {
      const deletedComment = await deleteComment(commentId);

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

router.patch("/edit", requireUser, async (req, res, next) => {
  const { id: currentUserId } = req.user;
  const { id: commentId, time: newTime, text } = req.body;

  try {
    if (currentUserId !== authorId) {
      res.status(403);
      next({
        error: "Forbidden",
        message: "Unauthorized to update this comment",
      });
    } else {
      const updatedComment = await updateComment({
        commentId,
        newTime,
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

module.exports = router;
