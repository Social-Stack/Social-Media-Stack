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

const checkIfUpvoted = async({
  commentId,
  userId
}) => {
  const { rows: [upvote] } = await client.query(`
    SELECT *
    FROM comment_upvotes
    WHERE "commentId" = ${commentId}
        AND "userId" = ${userId}
    RETURNING *;
  `)
  return upvote ? true : false
}

const removeUpvoteFromComment = async({
  commentId,
  userId
}) => {
  try {
    const { rows: [upvote] } = await client.query(`
      DELETE FROM comment_upvotes
      WHERE "commentId" = ${commentId}
        AND "userId" = ${userId}
      RETURNING *;
    `);
    return upvote;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getCommentUpvotesById = async(commentId) => {
  try {
    const { rows: upvotesArr } = await client.query(`
      SELECT "userId"
      FROM comment_upvotes
      WHERE "commentId" = ${commentId}
      ORDER BY "userId" ASC;
    `)
    return { upvoteCount: upvotes.length, upvotesArr }
  } catch (error) {
    console.error(error)
    throw error;
  }
}


module.exports = {
  addUpvoteToComment,
  removeUpvoteFromComment,
  getCommentUpvotesById,
  checkIfUpvoted
}