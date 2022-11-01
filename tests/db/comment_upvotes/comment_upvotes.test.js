const { 
  createUser,
  createComment,
  updateComment,
  deleteComment,
  createPost,
  getUserByUsername,
  getPostsByUserId,
  addUpvoteToComment,
  checkIfUpvoted,
  removeUpvoteFromComment,
  getCommentUpvotesById,
} = require("../../../db");
const client = require("../../../db/client");

describe("DB comment_upvotes", () => {
  let user = {};
  let user2 = {};
  let post = {};
  let comment = {};

  const seedTestData = async() => {
    const _user = await createUser({
      firstname: "CU Tests",
      lastname: "CU Testerson",
      username: "IDKwhatToPickStill",
      password: "supersecret12345",
      email: "CU.123.User@gmail.com"
    })
    const _user2 = await createUser({
      firstname: "CU Tests2",
      lastname: "CU Testerson2",
      username: "IDKwhatToPickStill2",
      password: "supersecret1234",
      email: "CU2.123.User@gmail.com"
    })
    const _post = await createPost({
      userId: _user.id,
      text: "Postin' time!",
      time: new Date(),
      isPublic: true
    })
    const _comment = await createComment({
      authorId: _user.id,
      postId: _post.id,
      time: new Date(),
      text: "Back to coding"
    })
    user = await _user;
    user2 = await _user2;
    post = await _post;
    comment = await _comment;
  }
  describe("addUpvoteToComment", () => {

    it("Adds one comment upvote & returns it", async() => {
      await seedTestData();

      const commentUpvote = await addUpvoteToComment({
        commentId: comment.id,
        userId: user.id
      })

      await expect(commentUpvote).toEqual(expect.any(Object));
    })

    it("Does not allow a duplicate entry", async() => {
      const duplicateCommentUpvote = await addUpvoteToComment({
        commentId: comment.id,
        userId: user.id
      })

      const { rows: uniqueUpvotes } = await client.query(`
        SELECT *
        FROM comment_upvotes
        WHERE "commentId" = ${comment.id}
        AND "userId" = ${user.id};
      `)

      await expect(duplicateCommentUpvote).toBe(undefined);
      await expect(uniqueUpvotes.length).toBe(1);
    })
  })

  describe("checkIfUpvoted", () => {

    it("Returns true if the current user has already upvoted the comment", async() => {
      const alreadyUpvoted = await checkIfUpvoted({
        commentId: comment.id,
        userId: user.id
      });
      await expect(alreadyUpvoted).toStrictEqual(true);
    });

    it("Returns false if the current user has not yet upvoted the comment", async() => {
      const alreadyUpvoted = await checkIfUpvoted({
        commentId: comment.id,
        userId: user2.id
      });

      await expect(alreadyUpvoted).toStrictEqual(false);
    })
  });

  describe("removeUpvoteFromComment", () => {

    it("Removes & returns the upvote", async() => {
      const removedUpvote = await removeUpvoteFromComment({
        commentId: comment.id,
        userId: user.id
      })
      const alreadyUpvoted = await checkIfUpvoted({
        commentId: comment.id,
        userId: user.id
      });

      await expect(removedUpvote).toEqual(expect.any(Object));
      await expect(alreadyUpvoted).toStrictEqual(false);
    })
    it("Does nothing if the upvote did not exist", async() => {
      const removedUpvote = await removeUpvoteFromComment({
        commentId: comment.id,
        userId: user.id
      })

      await expect(removedUpvote).toBe(undefined);
    })
  })

  describe("getCommentUpvotesById", () => {

    it("Returns the number of Upvotes & array of upvoter userIds", async() => {
      const upvotes = await getCommentUpvotesById(comment.id);

      await expect(upvotes.upvotes).toBe(0);
      await expect(upvotes.upvoterIds.length).toBe(0);
      console.log(upvotes);

      await addUpvoteToComment({
        commentId: comment.id,
        userId: user.id
      });
      const _upvotes = await getCommentUpvotesById(comment.id);

      await expect(_upvotes.upvotes).toBe(1);
      await expect(_upvotes.upvoterIds.length).toBe(1);

      await removeUpvoteFromComment({
        commentId: comment.id,
        userId: user.id
      })
    })

    it("Returns userIds in ascending order", async() => {
      await addUpvoteToComment({
        commentId: comment.id,
        userId: user2.id
      });
      await addUpvoteToComment({
        commentId: comment.id,
        userId: user.id
      });
      const upvotes = await getCommentUpvotesById(comment.id);

      await expect(upvotes.upvoterIds[0].userId).toBeLessThan(upvotes.upvoterIds[1].userId)
    })

    it("Still returns an object with 0 upvotes and an empty array when given a bad commentId", async () => {
      const upvotes = await getCommentUpvotesById(0);

      expect(upvotes).toMatchObject({
        upvotes: 0,
        upvoterIds: []
      })
    })
  })
});