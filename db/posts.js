const client = require('./client');

const createPost = async ({ userId, text, time, isPublic = false }) => {
  try {
    const {
      rows: [post]
    } = await client.query(
      `
        INSERT INTO posts ("userId", text, time, "isPublic")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
      [userId, text, time, isPublic]
    );
    return post;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const getPostsByUserId = async (id) => {
  try {
    const { rows: posts } = await client.query(`
    SELECT posts.*, U.firstname, U.lastname, U.username, U."picUrl" as "profilePic"
    FROM posts
    INNER JOIN users U
    ON U.id = posts."userId"
    WHERE "userId" = ${id};
    `);
    return posts;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const getPostsByUsername = async (username) => {
  //optimize this later
  try {
    const {
      rows: [{ id }]
    } = await client.query(`
    SELECT *
    FROM users
    WHERE username = '${username}';
    `);
    const { rows: posts } = await client.query(`
    SELECT posts.*, U.firstname, U.lastname, U.username, U."picUrl" as "profilePic"
    FROM posts
    INNER JOIN users U
    ON U.id = posts."userId"
    WHERE "userId" = ${id};
    `);
    return posts;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const getPostById = async (id) => {
  try {
    const {
      rows: [post]
    } = await client.query(`
    SELECT posts.*, U.firstname, U.lastname, U.username, U."picUrl" as "profilePic"
    FROM posts
    INNER JOIN users U
    ON U.id = posts."userId"
    WHERE posts.id = ${id};
    `);
    return post;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const getAllPublicPosts = async () => {
  try {
    const { rows: posts } = await client.query(`
    SELECT posts.*, U.firstname, U.lastname, U.username, U."picUrl" as "profilePic"
    FROM posts
    INNER JOIN users U
    ON U.id = posts."userId"
    WHERE "isPublic" = true;
    `);
    return posts;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const editPostById = async ({ id, ...fields }) => {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}" = $${idx + 1}`)
      .join(', ');

    const {
      rows: [post]
    } = await client.query(
      `
    UPDATE posts
    SET ${setString}
    WHERE id = ${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    return post;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const removePostById = async (id) => {
  try {
    const {
      rows: [post]
    } = await client.query(`
      DELETE FROM posts
      WHERE id = ${id}
      RETURNING *;
    `);
    return post;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostsByUsername,
  getPostById,
  getAllPublicPosts,
  editPostById,
  removePostById
};
