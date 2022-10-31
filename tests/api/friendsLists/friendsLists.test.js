require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const client = require("../../../db/client");
const jwt = require("jsonwebtoken");
const { createUser, getUserById } = require("../../../db");
const { testLoginUser } = require("../../helpers");
const { JWT_SECRET } = process.env;

const fakeUserData = {
  firstname: "Samantha",
  lastname: "Holly",
  username: "hollycandy",
  password: "holly1234",
  email: "sholly@test.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

const fakeUserData2 = {
  firstname: "Edit",
  lastname: "Josh",
  username: "editjosh",
  password: "josh1234",
  email: "joshua01@gmail.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

describe("api/friendsLists", () => {
  let user1 = {};
  let user2 = {};
  let token = "";
  const seedDataTests = async () => {
    const _user1 = await createUser(fakeUserData);

    const _user2 = await createUser(fakeUserData2);

    user1 = await _user1;
    const validUser = await testLoginUser({
      username: fakeUserData.username,
      password: fakeUserData.password,
    });
    token = await validUser.token;
    user2 = await _user2;
  };
  describe("POST api/friendsLists/:friendId", () => {
    it("adds a friend to the logged in user's friend list", async () => {
      await seedDataTests();
      const response = await request(app)
        .post(`/api/friendsLists/${user2.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(response.body).toMatchObject({
        validFriend: {
          id: expect.any(Number),
          firstname: expect.any(String),
          lastname: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          picUrl: expect.any(String),
          isAdmin: expect.any(Boolean),
        },
        success: expect.stringContaining("success"),
      });
      await expect(response.statusCode).toBe(200);
    });

    it("sends back an error if the logged in user is already friends with that person", async () => {
      const response = await request(app)
        .post(`/api/friendsLists/${user2.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(response.body).toMatchObject({
        error: "AlreadyFriendsError",
        message: "You're already friends!",
      });
    });

    it("sends back an error if the user is not logged in", async () => {
      const response = await request(app).post(`/api/friendsLists/${user2.id}`);

      expect(response.body).toMatchObject({
        error: "401",
        message: expect.stringContaining("login"),
      });
      await expect(response.statusCode).toBe(401);
    });
  });

  describe("GET api/friendsLists", () => {
    it("sends back the current logged in user's friends", async () => {
      const response = await request(app)
        .get("/api/friendsLists")
        .set({
          Authorization: `Bearer ${token}`,
        });

      console.log("response", response.body);
      expect(response.body).toMatchObject({
        friendsList: [
          {
            id: expect.any(Number),
            firstname: expect.any(String),
            lastname: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            picUrl: expect.any(String),
            isAdmin: expect.any(Boolean),
          },
        ],
        success: expect.stringContaining("success"),
      });
    });
  });
});
