const client = require("./client");

const createFriendReqNoti = async ({reqUserId, actionUser }) => {
    try {
        const text = `${actionUser.firstname} ${actionUser.lastname} has sent you a Friend Request`;
        const type = "friendRequest";
        const url = `profile/${actionUser.username}`;
        const { rows: [notification]} = await client.query(`
            INSERT INTO notifications ("userId", type, text, url, "miscId", seen)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
          [reqUserId, type, text, url, actionUser.id, false]);
        return notification;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const seenByNotiId = async(notiId) => {
    try {
        const { rows: [notification] } = await client.query(`
        UPDATE notifications
        SET seen = true
        WHERE id=${notiId}
        RETURNING *;
        `);
        return notification;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const seenAllByUserId = async(userId) => {
    try {
        const { rows: notification } = await client.query(`
        UPDATE notifications
        SET seen = true
        WHERE "userId"=${userId}
        RETURNING *;
        `);
        return notification;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getNotisByUserId = async(userId) => {
    try {
        const { rows: notis } = await client.query(`
        SELECT *
        FROM notifications
        WHERE "userId"=${userId};
        `);
        return notis;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getNotiByFriendRequest = async(userId, friendId)=> {
    try {
        const { rows: [noti] } = await client.query(`
        SELECT *
        FROM notifications
        WHERE "userId"=$1 AND "miscId"=$2;
        `,[userId, friendId]);
        return noti;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getUnseenNotisByUserId = async(userId) => {
    try {
        const { rows: notis } = await client.query(`
        SELECT *
        FROM notifications
        WHERE "userId"=${userId} AND seen = false;
        `);
        return notis;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const removeNotiById = async (id) => {
    try {
        const { rows: [notis] } = await client.query(`
        DELETE from notifications
        WHERE id=${id}
        RETURNING *;
        `);
        return notis;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = {
    createFriendReqNoti,
    seenByNotiId,
    seenAllByUserId,
    getNotisByUserId,
    getNotiByFriendRequest,
    getUnseenNotisByUserId,
    removeNotiById
};
