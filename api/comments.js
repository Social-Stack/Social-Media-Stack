const express = require("express");
const { getCommentsByPostId } = require("../db/comments");
const router = express.Router();



router.get("/:postId", async (req, res, next) => {
    try {
      const { postId } = req.params;

      const comments = await getCommentsByPostId(postId);
      res.send(comments);      
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  
  module.exports = router;
  