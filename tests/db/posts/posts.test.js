const {
  createPost,
  getPostsByUserId,
  getPostById,
  getAllPublicPosts,
  editPostById,
  createUser,
  getUserById,
} = require("../../../db");

const fakeUserData = {
  firstname: "Jon",
  lastname: "Snow",
  username: "WardenOfTheNorth",
  password: "dragonRider",
  email: "J.Snow@gmail.com",
};

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
    const _user = await getUserById(4);
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
    const editedPost = await editPostById(3, "Hello I'm the cold weather man!");

    console.log("EDITED POST", editedPost);
  });
});
