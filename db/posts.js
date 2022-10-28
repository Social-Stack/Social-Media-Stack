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
    SELECT posts.id, posts.text, posts."userId", posts.time, U.firstname, U.lastname, U."picUrl" as "profilePic"
    FROM posts
    INNER JOIN users U
    ON U.id = posts."userId"
    WHERE "isPublic" = true;
    `);
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const editPostById = async ({id, ...fields}) => {
  try {
    const setString = Object.keys(fields)
    .map((key, idx) => `"${key}" = $${idx+1}`)
    .join(", ");

    const {
      rows: [post],
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
    throw error;
  }
};

const removePostById = async(id) => {
  try{
    const _post = getPostById(id);
    if(_post){
      await client.query(`
      DELETE FROM posts
      WHERE id = ${id};
      `)
    }
    return _post;
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
  removePostById
};
