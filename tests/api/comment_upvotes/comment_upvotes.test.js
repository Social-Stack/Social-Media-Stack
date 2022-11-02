require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const { testLoginUser } = require("../../helpers");
const { 
  createUser,
  createPost,
  createComment,
  addUpvoteToComment,
  removeUpvoteFromComment,
  getCommentUpvotesById,
  checkIfUpvoted
} = require("../../../db");

describe("api/comment_upvotes", () => {
  let user = {};
  let validUser = {};
  let post = {};
  let post2 = {};
  let comment = {};
  let comment2 = {};
  let comment3 = {};
  let upvote1 = {};
  let upvote2 = {};
  let upvote3 = {};
  let token = "";

  const seedTestData = async() => {
    user = await createUser({
      firstname: "CU API Tests",
      lastname: "CU API Testerson",
      username: "TestPerson62",
      password: "supersecret12345",
      email: "CU.API.123.User@gmail.com"
    })
    validUser = await createUser({
      firstname: "CU API Tests2",
      lastname: "CU API Testerson2",
      username: "Test_McGee333",
      password: "supersecret1234",
      email: "CU.API.123.User2@gmail.com"
    })
    post = await createPost({
      userId: user.id,
      text: "Posting time!",
      time: new Date(),
      isPublic: true
    })
    post2 = await createPost({
      userId: user.id,
      text: "Posting Time, Somewhere",
      time: new Date(),
      isPublic: true
    })
    comment = await createComment({
      authorId: user.id,
      postId: post.id,
      time: new Date(),
      text: "Always Be Coding"
    })
    comment2 = await createComment({
      authorId: validUser.id,
      postId: post.id,
      time: new Date(),
      text: "ALWAYS?"
    })
    comment3 = await createComment({
      authorId: validUser.id,
      postId: post.id,
      time: new Date(),
      text: "ALWAYS?"
    })
    upvote1 = await addUpvoteToComment({
      commentId: comment.id,
      userId: user.id,
    })
    upvote2 = await addUpvoteToComment({
      commentId: comment2.id,
      userId: user.id,
    })
    upvote3 = await addUpvoteToComment({
      commentId: comment.id,
      userId: validUser.id,
    })
    const response = await testLoginUser({
      username: validUser.username,
      password: "supersecret1234"
    })
    token = await response.token
  }

  describe("GET /api/comment_upvotes/:commentId" , () => {

    it("Returns an object containing all relevant information", async () => {
      await seedTestData();

      const response = await request(app)
        .get(`/api/comment_upvotes/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)

      await expect(response.body).toMatchObject({
        userHasUpvoted: expect.any(Boolean),
        upvotes: expect.any(Number),
        upvoterIds: expect.any(Array),
        success: expect.any(String)
      });
    })

    it("Returns a specific error when no comment is found by the provided ID", async () => {
      const response = await request(app)
        .get(`/api/comment_upvotes/0`)

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
    })

    it("Returns true if current user has already upvoted", async () => {
      const response = await request(app)
        .get(`/api/comment_upvotes/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)

      await expect(response.body).toMatchObject({
        userHasUpvoted: true,
        upvotes: expect.any(Number),
        upvoterIds: expect.any(Array),
        success: expect.any(String)
      });
    })
    it("Returns false if current user has not upvoted the comment", async() => {
      const response = await request(app)
        .get(`/api/comment_upvotes/${comment2.id}`)
        .set("Authorization", `Bearer ${token}`)

      await expect(response.body).toMatchObject({
        userHasUpvoted: false,
        upvotes: expect.any(Number),
        upvoterIds: expect.any(Array),
        success: expect.any(String)
      });
    })

    it("Returns Upvoter IDs in ascending order", async () => {
      const { body } = await request(app)
        .get(`/api/comment_upvotes/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)

      await expect(body.upvoterIds[0].userId)
        .toBeLessThan(body.upvoterIds[1].userId);
    })

    it("Defaults upvote status to false if no authorization is provided", async () => {
      const response = await request(app)
        .get(`/api/comment_upvotes/${comment.id}`)
      
      await expect(response.body).toMatchObject({
        userHasUpvoted: false,
        upvotes: expect.any(Number),
        upvoterIds: expect.any(Array),
        success: expect.any(String)
      });
    });
  });

  describe("POST /api/comment_upvotes/add", () => {

    it("Adds one upvote & returns the new upvote data", async () => {
      const { body: preQuery } = await request(app)
        .get(`/api/comment_upvotes/${comment2.id}`)

      const prevVotes = preQuery.upvotes;

      const response = await request(app)
        .post(`/api/comment_upvotes/add`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: comment2.id
        });
      
      await expect(response.body).toMatchObject({
        upvotes: expect.any(Number),
        upvoterIds: expect.arrayContaining([{ userId: validUser.id }]),
        success: expect.any(String)
      })
      await expect(response.body.upvotes).toEqual(prevVotes + 1)
    });

    it("Returns a specific error when no comment is found by the provided ID", async () => {
      const response = await request(app)
        .post(`/api/comment_upvotes/add`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: 0
        });

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
    })

    it("Returns a specific error when user has already upvoted the comment", async () => {
      const response = await request(app)
        .post(`/api/comment_upvotes/add`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: comment2.id
        });

      await expect(response.status).toBe(409)
      await expect(response.body).toMatchObject({
        error: expect.stringContaining("Conflict"),
        message: expect.stringContaining("already upvoted")
      });
    });
  });
  describe("DELETE /api/comment_upvotes/remove", () => {

    it("Deletes & returns the prior upvote", async () => {
      const response = await request(app)
        .delete(`/api/comment_upvotes/remove`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: comment2.id
        });

      await expect(response.body).toMatchObject({
        removedUpvote: expect.any(Object),
        success: expect.any(String)
      });
    });

    it("Returns a specific error when user has no upvote to remove", async () => {
      const response = await request(app)
        .delete(`/api/comment_upvotes/remove`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: comment2.id
        });
      
      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
      await expect(response.status).toEqual(409);
    })

    it("Returns a specific error when no comment is found by the given ID", async () => {
      const response = await request(app)
        .delete(`/api/comment_upvotes/remove`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: 0
        });
      
      await expect(response.body).toMatchObject({
        error: "CommentNotFound",
        message: expect.any(String)
      });
    });
  });
});