require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const client = require("../../../db/client");
const jwt = require("jsonwebtoken");
const { createUser, getMessagesBetweenUsers } = require("../../../db");
const { JWT_SECRET = "NoTelling" } = process.env;

const fakeUserData1 = {
  firstname: "Name",
  lastname: "Nameson",
  username: "TestUser",
  password: "TestPassword",
  email: "test123@gmail.com",
};

const fakeUserData2 = {
  firstname: "Random",
  lastname: "Ransom",
  username: "RandomUser",
  password: "RandomPassword",
  email: "test1234@gmail.com",
};

describe("DB messages", () => {
  describe("createMessage", () => {
    it("Creates a new message and returns a success message", async () => {
      const _user1 = await createUser(fakeUserData1);
      // console.log("USER1", _user1);
      const _user2 = await createUser(fakeUserData2);
      // console.log("USER2", _user2);

      const token = jwt.sign(_user1, JWT_SECRET, { expiresIn: "1w" });
      const newMessage = {
        sendingUserId: _user1.id,
        recipientUserId: _user2.id,
        time: new Date(),
        text: "Sup",
      };

      const response = await request(app)
        .post("/api/messages/new")
        .send(newMessage)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(response.body).toMatchObject({
        newMessage: expect.any(Object),
        success: expect.any(String),
      });

      expect(response.statusCode).toBe(200);

      console.log("response.body", response.body);
    });

    it("Returns an error if a user isn't logged in", async () => {
      //   console.log("FAKE2", fakeUserData2);
      //   const _user2 = await createUser(fakeUserData2);
      //   console.log("USER2", _user2);

      const response = await request(app).post("/api/messages/new").send({
        // recipientUserId: _user2.id,
        text: "This shouldn't work",
        time: new Date(),
      });
      // .set({
      //   Authorization: "Bearer",
      // });

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });

      expect(response.statusCode).toBe(401);

      console.log("response.body", response.body);
    });
  });
  describe("GET /api/messages/chatlist", () => {
    it("Gets all users messages", async () => {
      const _user1 = await createUser(fakeUserData1);
      console.log("USER1", _user1);
      const _user2 = await createUser(fakeUserData2);
      console.log("USER2", _user2);

      const token = jwt.sign(_user1, JWT_SECRET, { expiresIn: "1w" });
      const newMessage1 = {
        sendingUserId: _user1.id,
        recipientUserId: _user2.id,
        time: new Date(),
        text: "Sup",
      };

      const newMessage2 = {
        sendingUserId: _user2.id,
        recipientUserId: _user1.id,
        time: new Date(),
        text: "Hi!",
      };
      const chat = getMessagesBetweenUsers(_user1.id, _user2.id);
      // const response = await request(app).get("/api/messages/chatlist");
      const response = await request(app)
        .get("/api/messages/chatlist")
        .send(chat)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(response.statusCode).toBe(200);

      console.log("response body, response.body");
    });
  });
});
