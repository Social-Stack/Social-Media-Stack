const client = require("./client");

const addUpvoteToPost = async (postId, userId) => {
  try {
    const {
      rows: [upvote],
    } = await client.query(
      `
        INSERT INTO post_upvotes ("postId", "userId")
        VALUES ($1, $2)
        RETURNING *;
    `,
      [postId, userId]
    );
    return upvote;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const checkIfUpvotedPost = async (postId, userId) => {
  try {
    const {
      rows: [upvote],
    } = await client.query(
      `
        SELECT *
        FROM post_upvotes
        WHERE "postId" = $1 AND "userId" = $2;
    `,
      [postId, userId]
    );
    return upvote ? true : false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeUpvoteFromPost = async (postId, userId) => {
  try {
    const {
      rows: [upvote],
    } = await client.query(`
        DELETE FROM post_upvotes
        WHERE "postId" = $1 AND "userId" = $2
        RETURNING *;
    `);
    return upvote;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPostUpvotesById = async (postId) => {
  try {
    const { rows: upvotesArr } = await client.query(
      `
            SELECT "userId"
            FROM post_upvotes
            WHERE "postId" = $1
            ORDER BY "userId" ASC;
        `,
      [postId]
    );
    return { upvotes: upvotesArr.length, upvoterIds: upvotesArr };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addUpvoteToPost,
  checkIfUpvotedPost,
  removeUpvoteFromPost,
  getPostUpvotesById,
};
