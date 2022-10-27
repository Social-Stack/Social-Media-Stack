const client = require("./client")

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
    throw error;
  }
}

const updateComment = async({
  id,
  newTime,
  text
}) => {
  try {
    const { rows: [comment] } = await client.query(`
      UPDATE comments
      SET time = ${newTime}, 
        text = ${text}
      WHERE id = ${id}
      RETURNING *;
    `)
    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteComment = async(commentId) => {
  try {
    const { rows: [deletedComment] } = await client.query(`
      DELETE FROM messages
      WHERE id = ${commentId}
      RETURNING *;
    `)
    return deletedComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment
}