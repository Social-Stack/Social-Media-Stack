const { 
  createUser,
  createComment,
  updateComment,
  deleteComment,
  createPost,
  getUserByUsername,
  getPostsByUserId,
} = require("../../../db");
const client = require("../../../db/client");

describe("DB comments", () => {
  const seedTestData = async() => {
    const user = await createUser({
      firstname: "Testson",
      lastname: "Userson",
      username: "IDKwhatToPick",
      password: "supersecret123",
      email: "T.123.User@gmail.com"
    })
    const post = await createPost({
      userId: user.id,
      text: "First post!",
      time: new Date(),
      isPublic: true
    })
    return { user, post }
  }
  
  describe("createComment", () => {
    it("Creates & returns a comment", async() => {
      await seedTestData()
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);

      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Wowee, my first post is so cool! I MADE THIS!!"
      })

      await expect(comment.authorId).toBe(user.id);
      await expect(comment.postId).toBe(posts[0].id);
      await expect(comment.text).toBe("Wowee, my first post is so cool! I MADE THIS!!");
    })

    it("Requires all fields", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);

      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date()
      })
      
      await expect(comment).toBe(undefined);
    })

    it("Allows multiple comments from same author on a single post", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);

      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Wowee, my first post is so cool! I MADE THIS!!"
      })

      await expect(comment.authorId).toBe(user.id);
      await expect(comment.postId).toBe(posts[0].id);
      await expect(comment.text).toBe("Wowee, my first post is so cool! I MADE THIS!!");
    })
  })

  describe("updateComment", () => {

    it("Updates & returns a comment", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);
      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Can't stop, won't stop"
      }) 

      const updatedComment = await updateComment({
        commentId: comment.id,
        time: "10/29/2022 10:33:00+00:00",
        text: "Won't stop, can't stop. help"
      })

      await expect(updatedComment.id).toBe(comment.id);
      await expect(updatedComment.time.valueOf()).toBeLessThan(comment.time.valueOf());
      await expect(updatedComment.text).toBe("Won't stop, can't stop. help");
    })

    it("Requires commentId, time, & text or does not return anything", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);
      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Can't stop, won't stop"
      }) 

      const attemptUpdatedComment1 = await updateComment({
        time: "10/29/2022 10:33:00+00:00",
        text: "Won't stop, can't stop. help"
      })

      const attemptUpdatedComment2 = await updateComment({
        commentId: comment.id,
        time: "10/29/2022 10:33:00+00:00"
      })

      const attemptUpdatedComment3 = await updateComment({
        commentId: comment.id,
        text: "Won't stop, can't stop. help"
      })

      expect(attemptUpdatedComment1).toBe(undefined);
      expect(attemptUpdatedComment2).toBe(undefined);
      expect(attemptUpdatedComment3).toBe(undefined);
    })
  })

  describe("deleteComment", () => {

    it("Deletes a comment & returns it", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);
      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Can't stop, won't stop"
      })

      const deletedComment = await deleteComment(comment.id);

      expect(deletedComment).toEqual(expect.objectContaining({
        authorId: user.id,
        postId: posts[0].id,
        time: expect.any(Object),
        text: "Can't stop, won't stop"
      }));
    })
    it("Hard deletes the row from the table", async() => {
      const user = await getUserByUsername("IDKwhatToPick");
      const posts = await getPostsByUserId(user.id);
      const comment = await createComment({
        authorId: user.id,
        postId: posts[0].id,
        time: new Date(),
        text: "Can't stop, won't stop"
      })
      await deleteComment(comment.id);
      const {rows: [nonexistentComment] } = await client.query(`
        SELECT *
        FROM comments
        WHERE id = ${comment.id};
      `);

      expect(nonexistentComment).toBe(undefined);
    })
  })
})