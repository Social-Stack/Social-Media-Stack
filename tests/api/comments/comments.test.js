require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const { testLoginUser } = require("../../helpers");
const { 
  createUser,
  createPost,
  createComment
} = require("../../../db");

describe("api/comments", () => {
  let user = {};
  let validUser = {};
  let post = {};
  let post2 = {};
  let comment = {};
  let comment2 = {};
  let token = "";

  const seedTestData = async() => {
    user = await createUser({
      firstname: "C API Tests",
      lastname: "C API Testerson",
      username: "TestPerson6",
      password: "supersecret12345",
      email: "C.API.123.User@gmail.com"
    })
    validUser = await createUser({
      firstname: "C API Tests2",
      lastname: "C API Testerson2",
      username: "Test_McGee",
      password: "supersecret1234",
      email: "C.API.123.User2@gmail.com"
    })
    post = await createPost({
      userId: user.id,
      text: "Postin' time!",
      time: new Date(),
      isPublic: true
    })
    post2 = await createPost({
      userId: user.id,
      text: "Postin' time again!",
      time: new Date(),
      isPublic: true
    })
    comment = await createComment({
      authorId: user.id,
      postId: post.id,
      time: new Date(),
      text: "Back to coding"
    })
    comment2 = await createComment({
      authorId: validUser.id,
      postId: post.id,
      time: new Date(),
      text: "Me too!"
    })
    const response = await testLoginUser({
      username: validUser.username,
      password: "supersecret1234"
    })
    token = await response.token
  }
  describe("GET /api/comments/:postId", () => {

    it("Returns an Array of all comments for the post", async () => {
      await seedTestData();
      const response = await request(app)
        .get(`/api/comments/${post.id}`);

      await expect(response.body.comments.length).toBeGreaterThanOrEqual(2);
      await expect(response.body.comments[0]).toMatchObject({
        id: expect.any(Number),
        authorId: expect.any(Number),
        time: expect.any(String),
        text: expect.any(String)
      });
    });

    it("Returns an empty array if post has no comments", async () => {
      const response = await request(app)
        .get(`/api/comments/${post2.id}`);

      await expect(response.body.comments).toEqual([])
    })

    it("Returns a specific error when received ID doesn't match a post", async () => {
      const response = await request(app)
        .get("/api/comments/0")
      
      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining("No post found")
      })
    })
  })

  describe("POST /api/comments/:postId", () => {

    it("Creates & returns the comment", async () => {

      const response = await request(app)
        .post(`/api/comments/${post.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: new Date(),
          text: "Check me out! I'm commenting!"
        });

      await expect(response.body.newComment).toMatchObject({
        id: expect.any(Number),
        authorId: expect.any(Number),
        postId: expect.any(Number),
        time: expect.any(String),
        text: expect.any(String)
      });
    })

    it("Returns a specific error when received ID doesn't match a post", async () => {
      const response = await request(app)  
        .post("/api/comments/0")
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: new Date(),
          text: "Check me out! I'm commenting!"
        });

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining("No post found")
      });
    });
  })

  describe("DELETE /api/comments/:id", () => {

    it("Hard deletes & returns the deleted comment", async() => {
      const response = await request(app)
        .delete(`/api/comments/${comment2.id}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.body).toMatchObject({
        deletedComment: expect.any(Object),
        success: expect.any(String)
      });

      const delCommentPostId = response.body.deletedComment.postId

      const { body } = await request(app)
        .get(`/api/comments/${delCommentPostId}`);

      body.comments.map(_comment => {
        expect(comment2.id).not.toBe(_comment.id)
      })
    })

    it("Returns appropriate error when provided a nonexistent comment ID", async () => {
      const response = await request(app)
        .delete('/api/comments/0')
        .set("Authorization", `Bearer ${token}`)
      
      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it("Only allows the original author to delete the comment", async() => {
      const response = await request(app)
        .delete(`/api/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)
      
      expect(response.body).toMatchObject({
        error: "Forbidden",
        message: expect.any(String)
      });
      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /api/comments/:id", () => {

    it("Updates & returns the comment", async () => {
      const comment3 = await createComment({
        authorId: validUser.id,
        postId: post.id,
        time: new Date(),
        text: "Hope I don't mak a typo"
      })

      const response = await request(app)
        .patch(`/api/comments/${comment3.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: new Date(),
          text: "Hope I don't make a typo"
        });
      
        expect(response.body).toMatchObject({
          updatedComment: expect.any(Object),
          success: expect.any(String)
        });
    });

    it("Returns appropriate error when provided a nonexistent comment ID", async () => {
      const response = await request(app)  
        .patch("/api/comments/0")
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: new Date(),
          text: "Check me out! I'm commenting!"
        });
      
      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

    it("Only allows the original author to update the comment", async () => {
      const response = await request(app)
        .patch(`/api/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: new Date(),
          text: "I'm such a hacker!!!"
        })
      
      expect(response.body).toMatchObject({
        error: "Forbidden",
        message: expect.any(String)
      });
      expect(response.status).toBe(403);
    });
  });
});