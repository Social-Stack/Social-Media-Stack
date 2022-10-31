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

const fakeUserData3 = {
  firstname: "test",
  lastname: "person2",
  username: "testing2",
  password: "testing234",
  email: "test2@gmail.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

const fakeUserData4 = {
  firstname: "Violet",
  lastname: "Test",
  username: "violettest",
  password: "violet1234",
  email: "violet@gmail.com",
  picUrl:
    "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346",
};

describe("api/friendsLists", () => {
  let user1 = {};
  let user2 = {};
  let user3 = {};
  let user4 = {};
  let token = "";
  let token2 = "";
  let token3 = "";

  const seedDataTests = async () => {
    const _user1 = await createUser(fakeUserData);
    const _user2 = await createUser(fakeUserData2);
    const _user3 = await createUser(fakeUserData3);
    const _user4 = await createUser(fakeUserData4);

    user1 = await _user1;
    const validUser = await testLoginUser({
      username: fakeUserData.username,
      password: fakeUserData.password,
    });
    token = await validUser.token;
    user2 = await _user2;
    const validUser2 = await testLoginUser({
      username: fakeUserData2.username,
      password: fakeUserData2.password,
    });
    token3 = await validUser2.token;
    user3 = await _user3;
    const validUser3 = await testLoginUser({
      username: fakeUserData3.username,
      password: fakeUserData3.password,
    });
    token2 = await validUser3.token;

    user4 = await _user4;

    const post1 = {
      text: "This is Edit Josh's first post. Please upvote it!",
      time: new Date(),
      isPublic: true,
    };

    const postResponse = await request(app)
      .post("/api/posts/new")
      .send(post1)
      .set({
        Authorization: `Bearer ${token3}`,
      });
  };

  describe("POST api/friendsLists/:friendId", () => {
    it("adds a friend to the logged in user's friend list", async () => {
      await seedDataTests();
      const response = await request(app)
        .post(`/api/friendsLists/${user2.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      const response2 = await request(app)
        .post(`/api/friendsLists/${user4.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      console.log("response2", response2.body);

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
      expect(response.statusCode).toBe(200);
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
      expect(response.statusCode).toBe(401);
    });
  });

  //   describe("DELETE api/friendsLists/:friendId", () => {
  //     it("removes a friend from your friend list", async () => {
  //       const response = await request(app)
  //         .delete(`/api/friendsLists/${user4.id}`)
  //         .set({
  //           Authorization: `Bearer ${token}`,
  //         });

  //       console.log("response", response.body);
  //     });
  //   });

  describe("GET api/friendsLists", () => {
    it("sends back the current logged in user's friends", async () => {
      const response = await request(app)
        .get("/api/friendsLists")
        .set({
          Authorization: `Bearer ${token}`,
        });

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
      expect(response.statusCode).toBe(200);
    });

    it("sends back an empty array if the current logged in user has no friends", async () => {
      const response = await request(app)
        .get("/api/friendsLists")
        .set({
          Authorization: `Bearer ${token2}`,
        });

      expect(response.body).toMatchObject({
        friendsLists: [],
        success: "You currently have no friends. Please add some.",
      });
      expect(response.statusCode).toBe(200);
    });

    it("sends back an error if the user is not logged in", async () => {
      const response = await request(app).get("/api/friendsLists");

      expect(response.body).toMatchObject({
        error: "401",
        message: expect.stringContaining("login"),
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET api/friendsLists/:friendId", () => {
    it("sends back all the posts for that friend", async () => {
      const response = await request(app)
        .get(`/api/friendsLists/${user2.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(response.body).toMatchObject({
        friendsPosts: [
          {
            id: expect.any(Number),
            userId: expect.any(Number),
            text: expect.any(String),
            isPublic: expect.any(Boolean),
            time: expect.any(String),
          },
        ],
        success: expect.stringContaining("success"),
      });
      expect(response.statusCode).toBe(200);
    });

    it("sends back an empty array if that friend has no posts", async () => {
      const response = await request(app)
        .get(`/api/friendsLists/${user1.id}`)
        .set({
          Authorization: `Bearer ${token3}`,
        });

      expect(response.body).toMatchObject({
        friendsPosts: [],
        success: "This friend doesn't have any posts currently",
      });
      expect(response.statusCode).toBe(200);
    });

    it("sends back an error if the current user is not logged in", async () => {
      const response = await request(app).get(`/api/friendsLists/${user1.id}`);

      expect(response.body).toMatchObject({
        error: "401",
        message: expect.stringContaining("login"),
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
