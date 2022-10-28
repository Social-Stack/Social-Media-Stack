const express = require("express");
const router = express.Router();



router.get("/:postId", async (req, res, next) => {
    try {
      const { postId } = req.params;
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  
  module.exports = router;
  