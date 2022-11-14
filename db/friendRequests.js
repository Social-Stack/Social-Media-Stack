const client = require("./client");
const { addFriends } = require("./friendsLists");
const { createFriendReqNoti, removeNotiById } = require("./notifications");
const { getUserById, getUserByUsername } = require("./users");

const requestFriend = async (id1, id2) => {
  try {
    const { rows: [friendReq] } = await client.query(`
        INSERT INTO friendrequests ("userId", "requestedFriendId")
        VALUES ($1, $2)
        RETURNING *;        
        `,
      [id1, id2]
    );
    const friend1 = await getUserById(id1);
    const friend2 = await getUserById(id2);
    if(friendReq && friend2){
      await createFriendReqNoti({reqUserId: id2, actionUser: friend1 })
    }
    return friendReq;
  } catch (error) {
    console.error(error);
  }
};
const denyFriend = async (id1, id2) => {
  try {
    const {rows: [denial]} = await client.query(`
    DELETE FROM friendrequests
    WHERE "userId"=$1 AND "requestedFriendId"=$2
    RETURNING *;
    `,[id1, id2]);
    return denial;
  } catch (error) {
    console.error(error);
  }
}
const myPendingRequestByUsername = async(id, username) => {
  try {
    const {id: friendId } = await getUserByUsername(username);
    const {rows: requests} = await client.query(`
    SELECT *
    FROM friendrequests
    WHERE "userId"=$1 AND "requestedFriendId"=$2;
    `, [id, friendId]);
    return requests.length > 0;
  } catch (error) {
    console.error(error);
  }
}
const amIPending = async(id, friendUsername) => {
  try {
    const {id:friendId } = await getUserByUsername(friendUsername);
    const {rows: requests} = await client.query(`
    SELECT *
    FROM friendrequests
    WHERE "userId"=$1 AND "requestedFriendId"=$2;
    `, [friendId, id]);
    return requests.length > 0;
  } catch (error){
    console.error(error)
  }
}

const acceptFriend = async (id1, id2) => {
    await addFriends(id1,id2);
    //clear request notification;
    //send new accepted notification;
}

module.exports = {
    requestFriend,
    acceptFriend,
    denyFriend,
    myPendingRequestByUsername,
    amIPending
}