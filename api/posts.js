const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPublicPosts,
  getPostsByUserId,
  getPostById,
  editPostById,
  removePostById,
  getFriendsByUserId,
} = require("../db");

const { requireUser } = require("./utils");

router.post("/new", requireUser, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { text, time, isPublic } = req.body;

    const newPost = await createPost({ userId, text, time, isPublic });
    res.send({
      newPost,
      success: "You've successfully created a new post!",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.get("/public", requireUser, async (req, res, next) => {
  try {
    const allPublicPosts = await getAllPublicPosts();
    res.send(allPublicPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/myfriends", async (req, res, next) => {
  //simply this whole function
  try {
    const { id } = req.user;
    const allFriendsPosts = [];
    const friends = await getFriendsByUserId(id);
    for (let i = 0; i < friends.length; i++) {
      const { friendId } = friends[i];
      const friendPosts = await getPostsByUserId(friendId);
      allFriendsPosts.push(...friendPosts);
    }
    res.send(allFriendsPosts);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.get("/me", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const allMyPosts = await getPostsByUserId(id);
    res.send(allMyPosts);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.patch("/update/:postId", requireUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;
    const { text, isPublic } = req.body;
    const { userId: originalUserId } = await getPostById(postId);

    if (isPublic === undefined || text === undefined) {
      throw new Error({
        name: "MissingData",
        message: "Send relevant fields",
      });
    } else if (userId !== originalUserId) {
      throw new Error({
        name: "AuthorizationError",
        message: "You must be the original author of this post",
      });
    } else {
      const editedPost = await editPostById({ id: postId, text, isPublic });
      console.log("About to send editedPost", editedPost);
      res.send({
        editedPost,
        success: "You've successfully edited a post!",
      });
    }
    console.log(
      "IF YOU'RE SEEING THIS...there's a problem with the editPost patch request in api/posts (blame Fred)"
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.delete("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { id: userId, isAdmin } = req.user;
    const { userId: authorId } = await getPostById(postId);
    if (isAdmin || authorId === userId) {
      await removePostById(postId);
      res.send({ message: "Post Removed" });
    } else {
      throw {
        name: "AuthorizationError",
        message: "You must be an Admin or the original author of this post",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = router;
