const express = require("express");
const { createPost, getAllPublicPosts, getPostsByUserId } = require("../db");
const router = express.Router();

router.post("/new", async(req, res, next) => {
    try{
        const { id: userId } = req.user;
        const { text, time, isPublic } = req.body;

        const newPost = await createPost({ userId, text, time, isPublic });
        req.send(newPost);
    } catch (error) {
        console.error(error);
        throw error;
    }
})

router.get("/public", async(req, res, next) => {
    try {
         const allPublicPosts = await getAllPublicPosts();
         res.send(allPublicPosts)
    } catch (error) {
        console.error(error);
        throw error; 
    }
})

router.get("/me", async(req, res, next) => {
    try {
        const { id } = req.user;
        const allMyPosts = await getPostsByUserId(id);
        res.send(allMyPosts)
    } catch (error) {
        console.error(error);
        throw error; 
    }
})

router.patch("/update/:postId", async(req, res, next) => {
    const { postId } = req.params;
    const { id: userId } = req.user;
    const { text } = req.body;
})

router.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message,
    })
})

module.exports = router;