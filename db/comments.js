const client = require("./client");
const { getPostById } = require("./posts");

const createComment = async({
  authorId,
  postId,
  time,
  text
}) => {
  try {
    const { rows: [comment] } = await client.query(`
      INSERT INTO comments ("authorId", "postId", time, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [authorId, postId, time, text]
    );
    return comment;
  } catch (error) {
    console.error(error);
  }
}

const updateComment = async({
  commentId,
  time,
  text
}) => {
  try {
    const { rows: [comment] } = await client.query(`
      UPDATE comments
      SET time = $1,
        text = $2
      WHERE id = ${commentId}
      RETURNING *;
    `, [time, text])
    return comment;
  } catch (error) {
    console.error(error);
  }
}

const deleteComment = async(commentId) => {
  try {
    const { rows: [deletedComment] } = await client.query(`
      DELETE FROM comments
      WHERE id = ${commentId}
      RETURNING *;
    `);
    return deletedComment;
  } catch (error) {
    console.error(error);
  }
}

const getCommentsByPostId = async(postId) => {
  try {
    const post = await getPostById(postId);
    if (!post) {
      return;
    }
    const { rows: comments } = await client.query(`
      SELECT C.* , U.firstname, U.lastname, U."picUrl"
      FROM comments C
      JOIN users U
      ON U.id = C."authorId"
      WHERE C."postId" = ${postId}
      ORDER BY C.time ASC;
    `);
    return comments ? comments : [];
  } catch (error) {
    console.error(error);
  }
}

const getCommentById = async(id) => {
  try {
    const { rows: [comment] } = await client.query(`
      SELECT *
      FROM comments
      WHERE id=${id};
    `);
    return comment;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentsByPostId
}
