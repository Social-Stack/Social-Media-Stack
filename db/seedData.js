const client = require("./client");


const createTables = async() => {
    try{
        await createTableUsers();
        await createTablePosts();
        await createTableUpvotes();
        await createTableMessages();
        await createTableFriendsLists();
    } catch (err){
        throw err;
    }
}

const dropTables = async() => {
    try{
        await client.query(`
        DROP TABLE IF EXISTS friendslists;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS upvotes;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    } catch (err){
        throw err;
    }
}

const createTableUsers = async() => {
    try {
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                firstname VARCHAR(50) NOT NULL,
                lastname VARCHAR(50) NOT NULL,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                "isAdmin" boolean DEFAULT false
            );
        `);
    } catch (error) {
        console.error("error during create users table")
        throw error;
    }
}
const createTablePosts = async() => {
    try {
        await client.query(`
            CREATE TABLE posts(
               id SERIAL PRIMARY KEY,
               "userId" INTEGER REFERENCES users(id),
               text VARCHAR(255) NOT NULL,
               time TIMESTAMPTZ NOT NULL,
            );
        `);
    } catch (error) {
        console.error("error during create posts table")
        throw error;
    }
}
const createTableUpvotes = async() => {
    try {
        await client.query(`
            CREATE TABLE upvotes(
                "userId" INTEGER REFERENCES users(id),
                "postId" INTEGER REFERENCES posts(id),
                CONSTRAINT UC_upvotes UNIQUE ("userId", "postId")
            ); 
        `);
    } catch (error) {
        console.error("error during create upvotes table")
        throw error;
    }
}
const createTableMessages = async() => {
    try {
        await client.query(`
            CREATE TABLE messages(
                id SERIAL PRIMARY KEY,
                "sendingUserId" REFERENCES users(id),
                "recipientUserId" REFERENCES users(id),
                time TIMESTAMPTZ NOT NULL,
                text VARCHAR(255) NOT NULL
            );
        `);
    } catch (error) {
        console.error("error during create messages table")
        throw error;
    }
}
const createTableFriendsLists = async() => {
    try {
        await client.query(`
            CREATE TABLE friendslists(
                "userId" REFERENCES users(id),
                "friendId" REFERENCES users(id),
                CONSTRAINT UC_friendslists ("userId", "friendId")
            );
        `);
    } catch (error) {
        console.error("error during create friendslist table")
        throw error;
    }
}


const rebuildDB = async () => {
    try {
      await dropTables();
      await createTables();
      
    } catch (error) {
      console.error("error rebuilding the db!");
      throw error;
    }
  };
  
  rebuildDB()
    .catch(console.error)
    .finally(() => client.end());