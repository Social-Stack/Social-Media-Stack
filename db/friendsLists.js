const client = require("./client");

const addFriends = async (id1, id2) => {
  try {
    const { rows: friends } = await client.query(
      `
        INSERT INTO friendslists ("userId", "friendId")
        VALUES ($1, $2), ($2, $1)
        RETURNING *;        
        `,
      [id1, id2]
    );
    return friends ? Number(id2) : null;
  } catch (error) {
    console.error(error);
  }
};

const removeFriend = async (id1, id2) => {
  try {
    const { rows: deletedfriends } = await client.query(
      `
        DELETE from friendslists
        WHERE "userId" = $1 AND "friendId" = $2 OR
        "userId" = $2 AND "friendId" = $1
        RETURNING *;        
        `,
      [id1, id2]
    );
    return deletedfriends;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFriendsByUserId = async (id) => {
  try {
    const { rows: friends } = await client.query(`
        SELECT *
        FROM friendslists
        WHERE "userId"=${id};
        `);
    return friends;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addFriends,
  removeFriend,
  getFriendsByUserId,
};
