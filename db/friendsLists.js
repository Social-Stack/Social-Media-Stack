const client = require('./client');

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
    //throw error;ror;
  }
};

const getFriendsByUserId = async (id) => {
  try {
    const { rows: friends } = await client.query(`
        SELECT *
        FROM friendslists
        JOIN users
        ON friendslists."friendId" = users.id
        WHERE "userId"=${id};
        `);
    for (let i = 0; i < friends.length; i++) {
      delete friends[i].password;
    }
    return friends;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const getFriendsListByUserId = async (id) => {
  try {
    const { rows: friends } = await client.query(`
        SELECT "friendId"
        FROM friendslists
        WHERE "userId"=${id};
        `);
    const friendsIdArr = [];
    for (let i = 0; i < friends.length; i++) {
      const friend = friends[i];
      friendsIdArr.push(friend.friendId);
    }
    return friendsIdArr;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

const isMyFriend = async (id, username) => {
  try {
    const { rows: friends } = await client.query(`
        SELECT *
        FROM friendslists
        JOIN users
        ON friendslists."friendId" = users.id
        WHERE "userId"=${id};
        `);
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].username === username) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    //throw error;ror;
  }
};

module.exports = {
  addFriends,
  removeFriend,
  getFriendsByUserId,
  getFriendsListByUserId,
  isMyFriend
};
