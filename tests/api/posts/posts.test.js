require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const client = require("../../../db/client");
const jwt = require("jsonwebtoken");
const { createUser, getUserById } = require("../../../db");
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

describe("api/posts", () => {
  describe("POST /api/posts/new", () => {
    it("Makes a new post if a user is logged in", async () => {
      const user = await createUser(fakeUserData);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1w" });
      const newPost = {
        text: "This is my first post. Please like it!",
        time: new Date(),
        isPublic: true,
      };

      const response = await request(app)
        .post("/api/posts/new")
        .send(newPost)
        .set({
          Authorization: `Bearer ${token}`,
        });
        
      expect(response.body).toMatchObject({
        newPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      expect(response.statusCode).toBe(200);

      console.log("response.body", response.body);
    });

    it("Returns an error if a user isn't logged in", async () => {
      const response = await request(app)
        .post("/api/posts/new")
        .send({
          text: "This shouldn't create a new post.",
          time: new Date(),
        })
        .set({
          Authorization: "Bearer ",
        });

      expect(response.body).toMatchObject({
        message: expect.stringContaining("must"),
      });

      expect(response.statusCode).toBe(401);

      console.log("response.body", response.body);
    });
  });

  describe("GET /api/posts/public", () => {
    it("Gets all public posts", async () => {
      const response = await request(app).get("/api/posts/public");

      expect(response.statusCode).toBe(200);

      console.log("response.body", response.body);
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

      console.log("response.body", response.body);
    });
  });
});
