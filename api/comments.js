const express = require("express");
const { getCommentsByPostId, createComment, getCommentById, deleteComment } = require("../db/comments");
const router = express.Router();



router.get("/:postId", async (req, res, next) => {
    try {
      const { postId } = req.params;

      const comments = await getCommentsByPostId(postId);
      res.send(comments);      
    } catch ({ error, message }) {
      next({ error, message });
    }
  });

router.post("/:postId", async(req, res, next) => {
  try{
    const { id: authorId} =req.user;
    const { postId } = req.params;
    const { time, text } = req.body;

    const newComment = await createComment({authorId, postId, time, text});
    res.send(newComment);
  } catch ({ error, message }) {
    next({ error, message });
  }
})
router.delete("/:id", async(req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const { id: authorId, isAdmin } = req.user;

    const comment = await getCommentById(commentId);
    if(comment && (authorId === comment.authorId || isAdmin)){
      await deleteComment(commentId);
      req.send(comment)
    }else if (!comment) {
      next({
        error: "CommentDoesNotExistError",
        message: "That comment does not exist",
      });
    } else if (!isAdmin || authorId !== userId) {
      next({
        error: "AuthorizationError",
        message: "You must be an Admin or the original author of this comment",
      });
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})
  
  module.exports = router;
  