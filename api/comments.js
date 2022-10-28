const express = require("express");
const { getCommentsByPostId } = require("../db/comments");
const router = express.Router();



router.get("/:postId", async (req, res, next) => {
    console.log("running here incomments")
    try {
      const { postId } = req.params;

      const comments = await getCommentsByPostId(postId);
      console.log("COMMENTS RETURNING", comments)
      res.send(comments);      
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  
  module.exports = router;
  