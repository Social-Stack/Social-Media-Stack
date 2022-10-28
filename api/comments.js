const express = require("express");
const { 
  getPostById, 
  createComment, 
  deleteComment,
  updateComment
} = require("../db");
const { requireUser } = require("./utils")
const router = express.Router();

router.get("/:postId", async (req, res, next) => {
    try {
      const { postId } = req.params;

      const post = await getPostById(postId);
      res.send({
        post,
        success: `Sent post ${postId}`
      });      
    } catch (error) {
      console.error(error);
      throw error;
    }
});

router.post("/:postId/new", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { id: authorId } = req.user;
  const { time, text } = req.body;

  try {
    const newComment = await createComment({
      authorId,
      postId,
      time,
      text
    })
    res.send({
      newComment,
      success: `Successfully created a new comment`
    })
  } catch ({ error, message }) {
    next({ error, message });
  }
})

router.patch("/edit", requireUser, async(req, res, next) => {
  const { id: currentUserId } = req.user;
  const { id: commentId, time: newTime, text } = req.body;

  try {
    if (currentUserId !== authorId) {
      res.status(403)
      next({
        error: "Forbidden",
        message: "Unauthorized to update this comment"
      });
    } else {
      const updatedComment = await updateComment({
        commentId,
        newTime,
        text
      })

      res.send({
        updatedComment,
        success: "Successfully updated this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

router.delete("/remove", requireUser, async(req, res, next) => {
  const { id: currentUserId } = req.user;
  const { id: commentId, authorId } = req.body;

  try {
    if (currentUserId !== authorId) {
      res.status(403)
      next({
        error: "Forbidden",
        message: "Unauthorized to delete this comment"
      });
    } else {
      const deletedComment = await deleteComment(commentId);

      res.send({
        deletedComment,
        success: "Successfully deleted this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

module.exports = router;
  