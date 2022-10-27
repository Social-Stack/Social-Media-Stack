require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const client = require("../.././db/client");
const jwt = require("jsonwebtoken");
const { createUser, getUserById } = require("../../db");
const { JWT_SECRET } = process.env;

const fakeUserData = {
  firstname: "Jane",
  lastname: "Smith",
  username: "JaneisAwesome",
  password: "jane1234",
  email: "jane@jsmith.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

const fakeUserData2 = {
  firstname: "Holly",
  lastname: "Bell",
  username: "hollybell123",
  password: "holly1234",
  email: "hollybell@gmail.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

describe("api/posts", () => {
  describe("POST /api/posts/new", () => {
    it("Makes a new post if a user is logged in", async () => {
      const user = await createUser(fakeUserData);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1w" });
      const newPost = {
        text: "This is my first post. Please upvote it!",
        time: new Date(),
        isPublic: true,
      };

      const newPost2 = {
        text: "This is my second post. Please upvote it!",
        time: new Date(),
        isPublic: true,
      };

      const newPost3 = {
        text: "I created three posts! Yay!",
        time: new Date(),
        isPublic: true,
      };

      const response = await request(app)
        .post("/api/posts/new")
        .send(newPost)
        .set({
          Authorization: `Bearer ${token}`,
        });

      const response2 = await request(app)
        .post("/api/posts/new")
        .send(newPost2)
        .set({
          Authorization: `Bearer ${token}`,
        });

      const response3 = await request(app)
        .post("/api/posts/new")
        .send(newPost3)
        .set({
          Authorization: `Bearer ${token}`,
        });

      await expect(response.body).toMatchObject({
        newPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      await expect(response2.body).toMatchObject({
        newPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      await expect(response3.body).toMatchObject({
        newPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      await expect(response.statusCode).toBe(200);
    });

    it("Returns an error if a user isn't logged in", async () => {
      const response = await request(app).post("/api/posts/new").send({
        text: "This shouldn't create a new post.",
        time: new Date(),
      });

      await expect(response.body).toMatchObject({
        message: expect.stringContaining("login"),
      });

      await expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/posts/public", () => {
    it("Gets all public posts", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData.username,
        password: fakeUserData.password,
      });
      const token = body.token;
      const response = await request(app)
        .get("/api/posts/public")
        .set({
          Authorization: `Bearer ${token}`,
        });

      await expect(response.statusCode).toBe(200);

      console.log("response.body", response.body);
    });

    it("Returns an error if a user isn't logged in", async () => {
      const response = await request(app).get("/api/posts/public");

      await expect(response.body).toMatchObject({
        message: expect.stringContaining("login"),
      });

      await expect(response.statusCode).toBe(401);
    });
  });

  describe("Get /api/posts/me", () => {
    it("Gets all posts by the logged in user", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData.username,
        password: fakeUserData.password,
      });
      const token = body.token;
      const response = await request(app)
        .get("/api/posts/me")
        .set({
          Authorization: `Bearer ${token}`,
        });

      await expect(response.body.length).toEqual(3);
      await expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        isActive: expect.any(Boolean),
        time: expect.any(String),
      });

      await expect(response.statusCode).toBe(200);
    });

    it("Returns an error if a user isn't logged in", async () => {
      const response = await request(app).get("/api/posts/me");

      await expect(response.body).toMatchObject({
        message: expect.stringContaining("login"),
      });

      await expect(response.statusCode).toBe(401);
    });
  });

  describe("PATCH /api/posts/update/:postId", () => {
    const editedPost1 = {
      isPublic: true,
      text: "Green tea is the best!",
    };

    const editedFred = {
      isPublic: false,
    };

    it("Edits the post if it belongs to the current logged in user", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData.username,
        password: fakeUserData.password,
      });
      const token = body.token;

      const postToEdit = await request(app)
        .patch("/api/posts/update/1")
        .send(editedPost1)
        .set({
          Authorization: `Bearer ${token}`,
        });

      await expect(postToEdit.body).toMatchObject({
        editedPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      await expect(postToEdit.statusCode).toBe(200);
    });

    it("Returns an error message if missing an update field", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData.username,
        password: fakeUserData.password,
      });
      const token = body.token;

      const postToEdit = await request(app)
        .patch("/api/posts/update/1")
        .send(editedFred)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(postToEdit.body).toMatchObject({
        name: "MissingData",
        message: "Send relevant fields",
      });
    });

    it("Returns an unauthorized user tries to edit a post that's not there's", async () => {
      const user2 = await createUser(fakeUserData2);
      const token = jwt.sign(user2, JWT_SECRET, { expiresIn: "1w" });

      const postToEdit = await request(app)
        .patch("/api/posts/update/1")
        .send(editedPost1)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(postToEdit.body).toMatchObject({
        name: "AuthorizationError",
        message: "You must be the original author of this post",
      });
    });
  });

  describe("DELETE /api/posts/:postId", () => {
    it("Deletes the post if it belongs to the current logged in user", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData.username,
        password: fakeUserData.password,
      });
      const token = body.token;

      const postToDelete = await request(app)
        .delete("/api/posts/3")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(postToDelete.body).toMatchObject({
        deletedPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      expect(postToDelete.statusCode).toBe(200);
    });

    it("Returns an error if a user other than the author or an admin tries to delete a post", async () => {
      const { body } = await request(app).post("/api/users/login").send({
        username: fakeUserData2.username,
        password: fakeUserData2.password,
      });
      const token = body.token;

      const postToDelete = await request(app)
        .delete("/api/posts/2")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(postToDelete.body).toMatchObject({
        name: "AuthorizationError",
        message: "You must be an Admin or the original author of this post",
      });
    });
  });
});
