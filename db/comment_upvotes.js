const client = require("./client")

const addUpvoteToComment = async({
  commentId,
  userId
}) => {
  try {
    const { rows: [upvote] } = await client.query(`
      INSERT INTO comment_upvotes
        ("commentId", "userId")
      VALUES 
        (${commentId}, ${userId})
      RETURNING *;
    `);
    return upvote;
  } catch (error) {
    console.error(error);
    throw error;    
  }
}

const removeUpvoteFromComment = async({
  commendId,
  userId
}) => {
  try {
    const { rows: [upvote] } = await client.query(`
      DELETE FROM comment_upvotes
      WHERE "commentId" = ${commendId}
        AND "userId" = ${userId}
      RETURNING *;
    `);
    return upvote;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  addUpvoteToComment,
  removeUpvoteFromComment
}