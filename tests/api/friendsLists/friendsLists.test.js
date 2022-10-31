require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const client = require("../../../db/client");
const jwt = require("jsonwebtoken");
const { createUser } = require("../../../db");
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
  describe("POST api/friendsLists/:friendId", () => {
    it("adds a friend to the logged in user's friend list", async () => {
      const user1 = await createUser(fakeUserData);
      const token1 = jwt.sign(user1, JWT_SECRET, { expiresIn: "1w" });

      const user2 = await createUser(fakeUserData2);
      const token2 = jwt.sign(user2, JWT_SECRET, { expiresIn: "1w" });

      const response = await request(app)
        .post(`/api/friendsLists/${user2.id}`)
        .set({
          Authorization: `Bearer ${token1}`,
        });

      console.log("response", response.body);
    });
  });
});
