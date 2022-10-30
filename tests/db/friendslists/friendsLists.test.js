const {
  addFriends,
  removeFriend,
  getFriendsByUserId,
  createUser,
} = require("../../../db");

const fakeUserData = {
  firstname: "Polly",
  lastname: "Smithson",
  username: "pollygamer",
  password: "polly1234",
  email: "polly@gmail.com",
};

const fakeUserData2 = {
  firstname: "Emily",
  lastname: "Smithton",
  username: "emilysmith",
  password: "emily1234",
  email: "emily@gmail.com",
};

describe("DB FriendsLists", () => {
  describe("addFriends Function", () => {
    it("adds a friend to the user's friend list", async () => {
      const _user1 = await createUser(fakeUserData);
      const _user2 = await createUser(fakeUserData2);

      const addFriend1 = await addFriends(_user1.id, _user2.id);

      expect(addFriend1.length).toEqual(2);
      expect(addFriend1[0]).toMatchObject({
        userId: expect.any(Number),
        friendId: expect.any(Number),
      });
    });
  });

  describe("getFriendsByUserId", () => {
    it("gets all the friends of that user and returns them", async () => {
      const friends = await getFriendsByUserId(1);

      expect(friends.length).toEqual(1);
      expect(friends[0]).toMatchObject({
        userId: expect.any(Number),
        friendId: expect.any(Number),
      });
    });
  });

  describe("removeFriend", () => {
    it("Removes a friend from the user's friend list", async () => {
      const removedFriend1 = await removeFriend(1, 2);

      expect(removedFriend1.length).toEqual(2);
      expect(removedFriend1[0]).toMatchObject({
        userId: expect.any(Number),
        friendId: expect.any(Number),
      });
    });
  });
});
