const client = require("./client");

const createComment = async ({ authorId, postId, time, text }) => {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
      INSERT INTO comments ("authorId", "postId", time, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [authorId, postId, time, text]
    );
    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateComment = async ({ commentId, newTime, text }) => {
  try {
    const {
      rows: [comment],
    } = await client.query(`
      UPDATE comments
      SET time = ${newTime}, 
        text = ${text}
      WHERE id = ${commentId}
      RETURNING *;
    `);
    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    const {
      rows: [deletedComment],
    } = await client.query(`
      DELETE FROM comments
      WHERE id = ${commentId}
      RETURNING *;
    `);
    return deletedComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Removing for now, leaving code for future realizations

// const getCommentsByPostId = async(postId) => {
//   try {
//     const { rows: comments } = await client.query(`
//       SELECT comments.* , U.firstname, U.lastname, U."picUrl"
//       FROM comments
//       INNER JOIN users U
//       ON U.id = comments."authorId"
//       WHERE "postId" = ${postId}
//       ORDER BY comments.time ASC;
//     `)
//     return comments
//   } catch (error) {
//     console.error(error)
//     throw error;
//   }
// }

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  // getCommentsByPostId
};
