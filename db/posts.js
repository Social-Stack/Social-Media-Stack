const client = require("./client");

const createPost = async ({ userId, text, time, isPublic = false }) => {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
        INSERT INTO posts ("userId", text, time, "isPublic")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
      [userId, text, time, isPublic]
    );
    console.log(post);
    return post;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getPostsByUserId = async (id) => {
  try {
    const { rows: posts } = await client.query(`
    SELECT *
    FROM posts
    WHERE "userId" = ${id};
    `);
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getPostById = async (id) => {
  try {
    const {
      rows: [post],
    } = await client.query(`
    SELECT *
    FROM posts
    WHERE "id" = ${id};
    `);
    return post;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getAllPublicPosts = async () => {
  try {
    const { rows: posts } = await client.query(`
    SELECT *
    FROM posts
    WHERE "isPublic" = true;
    `);
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const editPostById = async (id, text) => {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
    UPDATE posts
    SET text = $1
    WHERE id = $2
    RETURNING *;
    `,
      [text, id]
    );
    return post;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
  getAllPublicPosts,
  editPostById,
};
