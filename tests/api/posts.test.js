require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const client = require("../.././db/client");
const jwt = require("jsonwebtoken");
const { createUser } = require("../../db");
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
  describe("POST api/posts/new", () => {
    it("Returns an error if a user isn't logged in", async () => {
      const user = await createUser(fakeUserData);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1w" });
    });
    it("Makes a new post if a user is logged in", async () => {
      const user = await createUser(fakeUserData);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1w" });

      const response = await request(app)
        .post("/api/posts/new")
        .send({
          text: "This is my first post. Please like it!",
          time: new Date(),
          isPublic: true,
        })
        .set({
          Authorization: `Bearer ${token}`,
        });
        
      expect(response.body).toMatchObject({
        newPost: expect.any(Object),
        success: expect.stringContaining("success"),
      });

      expect(response.status).toEqual(200);
    });
  });
});
