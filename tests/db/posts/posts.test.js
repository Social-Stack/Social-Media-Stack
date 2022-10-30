const {
  createPost,
  getPostsByUserId,
  getPostById,
  getAllPublicPosts,
  editPostById,
  createUser,
  getUserById,
  removePostById,
} = require("../../../db");

const fakeUserData = {
  firstname: "Name",
  lastname: "Nameson",
  username: "TestUser",
  password: "TestPassword",
  email: "test123@gmail.com",
};

describe("DB Posts", () => {
  describe("createPost", () => {
    it("Creates a new post and returns", async () => {
      const _user = await createUser(fakeUserData);
      const post1 = await createPost({
        userId: _user.id,
        text: "I'm coding in the cold weather",
        isPublic: true,
        time: "10/26/2022 10:33:00+00:00",
      });

      expect(post1).toMatchObject({
        userId: _user.id,
        text: "I'm coding in the cold weather",
        isPublic: true,
        time: expect.any(Object),
      });

      const post2 = await createPost({
        userId: _user.id,
        text: "My hands are starting to freeze!",
        isPublic: true,
        time: "10/26/2022 10:56:00+00:00",
      });

      expect(post2).toMatchObject({
        userId: _user.id,
        text: "My hands are starting to freeze!",
        isPublic: true,
        time: expect.any(Object),
      });

      const post3 = await createPost({
        userId: _user.id,
        text: "Testing private post",
        time: "10/26/2022 10:56:00+00:00",
      });

      expect(post3).toMatchObject({
        userId: _user.id,
        text: "Testing private post",
        time: expect.any(Object),
      });
    });
  });

  describe("getPostsByUserId", () => {
    it("Gets all posts by that user's id and returns them", async () => {
      const posts = await getPostsByUserId(1);

      expect(posts.length).toEqual(expect.any(Number));
      expect(posts[0]).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
    });
  });

  describe("getPostById", () => {
    it("Gets a post with a certain id and returns it", async () => {
      const post = await getPostById(2);

      expect(post).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
    });
  });

  describe("getAllPublicPosts", () => {
    it("Only returns all of the public posts", async () => {
      const publicPosts = await getAllPublicPosts();

      expect(publicPosts.length).toBeGreaterThanOrEqual(2);
      expect(publicPosts[0]).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
    });
  });

  describe("editPostById", () => {
    it("Only edits the post with that id", async () => {
      const editedPost = await editPostById({
        id: 3,
        text: "Please hire me!",
      });

      expect(editedPost).toMatchObject({
        id: 3,
        text: "Please hire me!",
      });
    });

    it("Changes the status of isPublic to true", async () => {
      const changeStatusPost = await editPostById({
        id: 3,
        isPublic: true,
      });

      expect(changeStatusPost).toMatchObject({
        id: 3,
        isPublic: true,
      });
      const getPublicPosts = await getAllPublicPosts();

      await expect(getPublicPosts.length).toBeGreaterThanOrEqual(3);
      await expect(getPublicPosts[0]).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
    });
  });

  describe("removePostsById", () => {
    it("Removes the post with that id and returns it", async () => {
      const removedPost = await removePostById(2);
      const allPublicPosts = await getAllPublicPosts();

      expect(removedPost).toMatchObject({
        id: 2,
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
      expect(allPublicPosts.length).toEqual(2);
      expect(allPublicPosts[0]).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        text: expect.any(String),
        isPublic: expect.any(Boolean),
        time: expect.any(Object),
      });
    });
  });
});
