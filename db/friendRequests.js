const client = require("./client");
const { addFriends } = require("./friendsLists");
const { createFriendReqNoti } = require("./notifications");
const { getUserById } = require("./users");

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

const acceptFriend = async (id1, id2) => {
    await addFriends(id1,id2);
    //clear request notification;
    //send new accepted notification;
}

module.exports = {
    requestFriend,
    acceptFriend
}