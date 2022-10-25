const client = require("./client");
const chalk = require("chalk");
const {
  createUser,
} = require("./");

client.connect();


const createTables = async() => {
  console.log(chalk.green("BUILDING TABLES..."))
    try{
        await createTableUsers();
        await createTablePosts();
        await createTableUpvotes();
        await createTableMessages();
        await createTableFriendsLists();

    console.log(chalk.green("FINISHED BUILDING TABLES"))
    } catch (error){
      console.log(chalk.red("ERROR BUILDING TABLES!"))
      throw error;
    }
}

const dropTables = async() => {
  console.log(chalk.green("DROPPING TABLES..."))
    try{
        await client.query(`
        DROP TABLE IF EXISTS friendslists;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS upvotes;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log(chalk.green("FINISHED DROPPING TABLES"))
    } catch (error){
      console.error(chalk.red("ERROR DROPPING TABLES!"))
      throw error;
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
                "picUrl" VARCHAR(255) NOT NULL,
                "isAdmin" boolean DEFAULT false
            );
        `);
    } catch (error) {
        console.error(chalk.red("error during create users table"));
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
        console.error(chalk.red("error during create posts table"));
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
        console.error(chalk.red("error during create upvotes table"));
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
        console.error(chalk.red("error during create friendslist table"));
        throw error;
    }
}

const createInitialusers = async() => {
  console.log(chalk.green("CREATING INITIAL USERS..."));
  try {
    // Seeding like this so that our users don't swap places like when we seed using promise.All
    const albertSeed = 
      {
        firstname: "Al",
        lastname: "Bert",
        email: "Al.Bert@gmail.com",
        username: "albert",
        password: "bertie99",
        picUrl: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc5ODc5NjY5ODU0NjQzMzIy/gettyimages-3091504.jpg",
        isadmin: true,
    }
    const sandraSeed = 
      {
        firstname: "San",
        lastname: "Dra",
        email: "San.Dra@gmail.com",
        username: "sandra",
        password: "sandra123",
        picUrl: "https://images.hellomagazine.com/imagenes/celebrities/20220804147350/sandra-bullock-rare-admission-partner-bryan-randall-kids/0-717-450/sandra-bullock-bryan-randall-relationship-t.jpg",
    }
    const glamgalSeed =
      {
        firstname: "Glam",
        lastname: "Gal",
        email: "Glam.Gal@gmail.com",
        username: "glamgal",
        password: "glamgal123",
        picUrl: "https://pbs.twimg.com/profile_images/569955623136022528/F9qYeDFk_400x400.png",
    }
    console.log(chalk.blueBright("SEEDING USERS... ", albertSeed, sandraSeed, glamgalSeed));

    const albert = await createUser(albertSeed);
    const sandra = await createUser(sandraSeed);
    const glamgal = await createUser(glamgalSeed);

    console.log(chalk.yellowBright("SEEDED USERS: ", albert, sandra, glamgal));
    console.log(chalk.green("FINISHED CREATING USERS!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING USERS" , error));
    throw error;
  }
}

const rebuildDB = async () => {
  try {
      await dropTables();
      await createTables();
      await createInitialusers();
      
    } catch (error) {
      console.error(chalk.red("error rebuilding the db!"));
      throw error;
    }
  };
  
module.exports = {
  rebuildDB
};