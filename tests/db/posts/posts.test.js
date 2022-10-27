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

      const post2 = await createPost({
        userId: _user.id,
        text: "My hands are starting to freeze!",
        isPublic: true,
        time: "10/26/2022 10:56:00+00:00",
      });

      const post3 = await createPost({
        userId: _user.id,
        text: "Testing private post",
        time: "10/26/2022 10:56:00+00:00",
      });

      console.log("POST1", post1);
      console.log("POST2", post2);
    });
  });

  describe("getPostsByUserId", () => {
    it("Gets all posts by that user's id and returns them", async () => {
      const _user = await getUserById(1);
      const posts = await getPostsByUserId(_user.id);

      console.log("POSTS", posts);
    });
  });

  describe("getPostById", () => {
    it("Gets a post with a certain id and returns it", async () => {
      const post = await getPostById(2);

      console.log("POST WITH ID 2", post);
    });
  });

  describe("getAllPublicPosts", () => {
    it("Only returns all of the public posts", async () => {
      const publicPosts = await getAllPublicPosts();

      console.log("PUBLIC POSTS", publicPosts);
    });
  });

  describe("editPostById", () => {
    it("Only edits the post with that id", async () => {
      const editedPost = await editPostById({
        id: 3,
        text: "Please hire me!",
      });

      console.log("EDITED POST", editedPost);
    });

    it("Changes the status of isPublic to true", async () => {
      const changeStatusPost = await editPostById({
        id: 3,
        isPublic: true,
      });

      const getPublicPosts = await getAllPublicPosts();

      console.log("CHANGED POST STATUS", changeStatusPost);
      console.log("PUBLIC POSTS", getPublicPosts);
    });
  });

  describe("removePostsById", () => {
    it("Removes the post with that id and returns it", async () => {
      const removedPost = await removePostById(2);
      const allPublicPost = await getAllPublicPosts();

      console.log("DELETED POST", removedPost);
      console.log("PUBLIC POSTS AFTER DELETE", allPublicPost);
    });
  });
});
