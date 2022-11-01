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
        .get(`/api/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.body).toMatchObject({
        
      })
    })
  })
})