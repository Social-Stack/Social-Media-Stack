const { 
  createUser,
  createPost,
  checkIfUpvotedPost,
  removeUpvoteFromPost,
  getPostUpvotesById,
  addUpvoteToPost,
} = require("../../../db");
const client = require("../../../db/client");

describe("DB post_upvotes", () => {
  let user = {};
  let user2 = {};
  let post = {};

  const seedTestData = async() => {
    user = await createUser({
      firstname: "PU Tests",
      lastname: "PU Testerson",
      username: "AnotherDayAnotherName",
      password: "supersecret12345",
      email: "PU.123.User@gmail.com"
    })
    user2 = await createUser({
      firstname: "PU Tests2",
      lastname: "PU Testerson2",
      username: "SoAmIStillPicking",
      password: "supersecret1234",
      email: "PU2.123.User@gmail.com"
    })
    post = await createPost({
      userId: user.id,
      text: "Postin' time, round 10!",
      time: new Date(),
      isPublic: true
    })
  }
  describe("addUpvoteToPost", () => {

    it("Adds one post upvote & returns it", async() => {
      await seedTestData();

      const postUpvote = await addUpvoteToPost({
        postId: post.id,
        userId: user.id
      })

      await expect(postUpvote).toEqual(expect.any(Object));
    })

    it("Does not allow a duplicate entry", async() => {
      const duplicatePostUpvote = await addUpvoteToPost({
        postId: post.id,
        userId: user.id
      })

      const { rows: uniqueUpvotes } = await client.query(`
        SELECT *
        FROM post_upvotes
        WHERE "postId" = ${post.id}
        AND "userId" = ${user.id};
      `)

      await expect(duplicatePostUpvote).toBe(undefined);
      await expect(uniqueUpvotes.length).toBe(1);
    })
  })

  describe("checkIfUpvotedPost", () => {

    it("Returns true if the current user has already upvoted the post", async() => {
      const alreadyUpvoted = await checkIfUpvotedPost({
        postId: post.id,
        userId: user.id
      });
      await expect(alreadyUpvoted).toStrictEqual(true);
    });

    it("Returns false if the current user has not yet upvoted the post", async() => {
      const alreadyUpvoted = await checkIfUpvotedPost({
        postId: post.id,
        userId: user2.id
      });

      await expect(alreadyUpvoted).toStrictEqual(false);
    })
  });

  describe("removeUpvoteFromPost", () => {

    it("Removes & returns the upvote", async() => {
      const removedUpvote = await removeUpvoteFromPost({
        postId: post.id,
        userId: user.id
      })
      const alreadyUpvoted = await checkIfUpvotedPost({
        postId: post.id,
        userId: user.id
      });

      await expect(removedUpvote).toEqual(expect.any(Object));
      await expect(alreadyUpvoted).toStrictEqual(false);
    })
    it("Does nothing if the upvote did not exist", async() => {
      const removedUpvote = await removeUpvoteFromPost({
        postId: post.id,
        userId: user.id
      })

      await expect(removedUpvote).toBe(undefined);
    })
  })

  describe("getPostUpvotesById", () => {

    it("Returns the number of Upvotes & array of upvoter userIds", async() => {
      const upvotes = await getPostUpvotesById(post.id);

      await expect(upvotes.upvotes).toBe(0);
      await expect(upvotes.upvoterIds.length).toBe(0);

      await addUpvoteToPost({
        postId: post.id,
        userId: user.id
      });
      const _upvotes = await getPostUpvotesById(post.id);

      await expect(_upvotes.upvotes).toBe(1);
      await expect(_upvotes.upvoterIds.length).toBe(1);

      await removeUpvoteFromPost({
        postId: post.id,
        userId: user.id
      })
    })

    it("Returns userIds in ascending order", async() => {
      await addUpvoteToPost({
        postId: post.id,
        userId: user2.id
      });
      await addUpvoteToPost({
        postId: post.id,
        userId: user.id
      });
      const upvotes = await getPostUpvotesById(post.id);

      await expect(upvotes.upvoterIds[0].userId).toBeLessThan(upvotes.upvoterIds[1].userId)
    })

    it("Still returns an object with 0 upvotes and an empty array when given a bad postId", async () => {
      const upvotes = await getPostUpvotesById(0);

      expect(upvotes).toMatchObject({
        upvotes: 0,
        upvoterIds: []
      })
    })
  })
});