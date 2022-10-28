const router = require("../app");
const { 
  addUpvoteToComment,
  removeUpvoteFromComment,
  checkIfUpvoted,
  getCommentUpvotesById
} = require("../db");
const { requireUser } = require("./utils")

router.get("/:commentId", async(req, res, next) => {
  const { commentId } = req.params;
  
  try {
    const upvoteObj = await getCommentUpvotesById(commentId);
    const { upvoteCount, upvotesArr: upvoters } = upvoteObj;

    // Since no upvotes is not an error, still handling as a success
    if (!upvoteObj) {
      res.send({
        upvoteCount: 0,
        success: "This comment has no upvotes yet"
      })
    } else {
      res.send({
        upvoteCount,
        upvoters,
        success: `This comment has ${upvoteCount} upvotes` 
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

router.post("/addvote", requireUser, async(req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.body;

  try {
    const alreadyUpvoted = await checkIfUpvoted({
      commentId,
      userId
    })
    if (alreadyUpvoted) {
      res.status(409);
      next({
        error: "Conflict",
        message: "You have already upvoted this comment"
      })
    } else {
      const upvote = await addUpvoteToComment({
        commentId,
        userId
      })
      res.send({
        upvote,
        success: "Successfully upvoted this comment"
      })
    }
  } catch ({ error, message }) {
    next({ error, message });
  }
})

router.delete("/removevote", requireUser, async(req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.body;

  try {
    const alreadyUpvoted = await checkIfUpvoted({
      commentId,
      userId
    })
    if (alreadyUpvoted) {
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

module.exports = router;