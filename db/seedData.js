const client = require("./client");
const chalk = require("chalk");

const {
  createUser,
  createPost,
  createMessage,
  getUserByEmail,
  addFriends,
} = require("./");
const { createComment } = require("./comments");
const { addUpvoteToComment } = require("./comment_upvotes");

const createTables = async () => {
  console.log(chalk.green("BUILDING TABLES..."));
  try {
    await createTableUsers();
    await createTablePosts();
    await createTablePostUpvotes();
    await createTableComments();
    await createTableCommentUpvotes();
    await createTableMessages();
    await createTableFriendsLists();

    console.log(chalk.green("FINISHED BUILDING TABLES"));
  } catch (error) {
    console.error(chalk.red("ERROR BUILDING TABLES!", error));
    throw error;
  }
};

const dropTables = async () => {
  console.log(chalk.green("DROPPING TABLES..."));
  try {
    await client.query(`
        DROP TABLE IF EXISTS friendslists;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS comment_upvotes;
        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS post_upvotes;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log(chalk.green("FINISHED DROPPING TABLES"));
  } catch (error) {
    console.error(chalk.red("ERROR DROPPING TABLES!", error));
    throw error;
  }
};

const createTableUsers = async () => {
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
};
const createTablePosts = async () => {
  try {
    await client.query(`
            CREATE TABLE posts(
               id SERIAL PRIMARY KEY,
               "userId" INTEGER REFERENCES users(id),
               text VARCHAR(255) NOT NULL,
               "isPublic" BOOLEAN DEFAULT false NOT NULL,
               time TIMESTAMPTZ NOT NULL
            );
        `);
  } catch (error) {
    console.error(chalk.red("error during create posts table"));
    throw error;
  }
};
const createTablePostUpvotes = async () => {
  try {
    await client.query(`
            CREATE TABLE post_upvotes(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "postId" INTEGER REFERENCES posts(id),
                UNIQUE ("userId", "postId")
            ); 
        `);
  } catch (error) {
    console.error(chalk.red("error during create upvotes table"));
    throw error;
  }
};
const createTableComments = async () => {
  try {
    await client.query(`
      CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id),
        "postId" INTEGER REFERENCES posts(id),
        time TIMESTAMPTZ NOT NULL,
        text VARCHAR(400) NOT NULL
      );
    `);
  } catch (error) {
    console.error(chalk.red("error during create comments table", error));
    throw error;
  }
};
const createTableCommentUpvotes = async () => {
  try {
    await client.query(`
            CREATE TABLE comment_upvotes(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "commentId" INTEGER REFERENCES comments(id),
                UNIQUE ("userId", "commentId")
            ); 
        `);
  } catch (error) {
    console.error(chalk.red("error during create upvotes table"));
    throw error;
  }
};
const createTableMessages = async () => {
  try {
    await client.query(`
            CREATE TABLE messages(
                id SERIAL PRIMARY KEY,
                "sendingUserId" INTEGER REFERENCES users(id),
                "recipientUserId" INTEGER REFERENCES users(id),
                time TIMESTAMPTZ NOT NULL,
                text VARCHAR(255) NOT NULL
            );
        `);
  } catch (error) {
    console.error("error during create messages table");
    throw error;
  }
};
const createTableFriendsLists = async () => {
  try {
    await client.query(`
            CREATE TABLE friendslists(
                "userId" INTEGER REFERENCES users(id),
                "friendId" INTEGER REFERENCES users(id),
                UNIQUE ("userId", "friendId")
            );
        `);
  } catch (error) {
    console.error(chalk.red("error during create friendslist table"));
    throw error;
  }
};

const createInitialUsers = async () => {
  console.log(chalk.green("CREATING INITIAL USERS..."));
  try {
    // Seeding like this so that our users don't swap places like when we seed using promise.All
    const albertSeed = {
      firstname: "Al",
      lastname: "Bert",
      username: "albert",
      password: "bertie99",
      email: "Al.Bert@gmail.com",
      picUrl:
        "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc5ODc5NjY5ODU0NjQzMzIy/gettyimages-3091504.jpg",
      isAdmin: true,
    };
    const sandraSeed = {
      firstname: "San",
      lastname: "Dra",
      username: "sandra",
      password: "sandra123",
      email: "San.Dra@gmail.com",
      picUrl:
        "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc5OTUwNjI0MDU2NTUwNTIy/gettyimages-1074346390-square.jpg",
    };
    const glamgalSeed = {
      firstname: "Glam",
      lastname: "Gal",
      username: "glamgal",
      password: "glamgal123",
      email: "Glam.Gal@gmail.com",
      picUrl:
        "https://pbs.twimg.com/profile_images/569955623136022528/F9qYeDFk_400x400.png",
    };
    console.log(
      chalk.blueBright("SEEDING USERS... ", albertSeed, sandraSeed, glamgalSeed)
    );

    const albert = await createUser(albertSeed);
    const sandra = await createUser(sandraSeed);
    const glamgal = await createUser(glamgalSeed);

    console.log(chalk.yellowBright("SEEDED USERS: ", albert, sandra, glamgal));
    console.log(chalk.green("FINISHED CREATING USERS!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING USERS", error));
    throw error;
  }
};

const createInitialPosts = async () => {
  console.log(chalk.green("CREATING INITIAL POSTS..."));

  try {
    const seedPost1 = {
      userId: 1,
      text: "This is the first post in social stack!",
      isPublic: true,
      time: "2022-10-25 10:46:00+00:00",
    };

    const seedPost2 = {
      userId: 2,
      text: "Hey checkout this code!!!",
      time: "2022-10-25 10:46:00+00:00",
      isPublic: true,
    };

    const seedPost3 = {
      userId: 3,
      text: "Please hire us!",
      time: "2022-10-25 10:46:00+00:00",
    };

    console.log(
      chalk.blueBright("SEEDING POSTS...", seedPost1, seedPost2, seedPost3)
    );

    const post1 = await createPost(seedPost1);
    const post2 = await createPost(seedPost2);
    const post3 = await createPost(seedPost3);

    console.log(chalk.yellowBright("SEEDED POSTS: ", post1, post2, post3));
    console.log(chalk.green("FINISHED CREATING POSTS!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING POSTS", error));
    throw error;
  }
};

const createInitialComments = async () => {
  console.log(chalk.green("CREATING INITIAL COMMENTS..."));

  try {
    const seedComment1 = {
      authorId: 1,
      postId: 1,
      time: "2022-10-25 11:06:00+00:00",
      text: "Look what I can do!!!",
    };

    const seedComment2 = {
      authorId: 2,
      postId: 1,
      time: "2022-10-26 11:06:00+00:00",
      text: "Great job, everyone!",
    };

    const seedComment3 = {
      authorId: 1,
      postId: 2,
      time: "2022-10-24 11:06:00+00:00",
      text: "We did it!",
    };

    console.log(
      chalk.blueBright(
        "SEEDING COMMENTS...",
        seedComment1,
        seedComment2,
        seedComment3
      )
    );

    const comment1 = await createComment(seedComment1);
    const comment2 = await createComment(seedComment2);
    const comment3 = await createComment(seedComment3);

    console.log(
      chalk.yellowBright("SEEDED COMMENTS: ", comment1, comment2, comment3)
    );
    console.log(chalk.green("FINISHED CREATING COMMENTS!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING COMMENTS", error));
    throw error;
  }
};

const createInitialCommentUpvotes = async () => {
  console.log(chalk.green("CREATING INITIAL COMMENT UPVOTES..."));

  try {
    const seedCommentUpvote1 = {
      commentId: 1,
      userId: 1,
    };

    const seedCommentUpvote2 = {
      commentId: 1,
      userId: 2,
    };

    const seedCommentUpvote3 = {
      commentId: 2,
      userId: 1,
    };

    console.log(
      chalk.blueBright(
        "SEEDING COMMENT UPVOTES...",
        seedCommentUpvote1,
        seedCommentUpvote2,
        seedCommentUpvote3
      )
    );

    const upvote1 = await addUpvoteToComment(seedCommentUpvote1);
    const upvote2 = await addUpvoteToComment(seedCommentUpvote2);
    const upvote3 = await addUpvoteToComment(seedCommentUpvote3);

    console.log(
      chalk.yellowBright("SEEDED COMMENT UPVOTES: ", upvote1, upvote2, upvote3)
    );
    console.log(chalk.green("FINISHED CREATING COMMENT UPVOTES!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING COMMENT UPVOTES", error));
    throw error;
  }
};

const createInitialMessages = async () => {
  console.log(chalk.green("CREATING INITIAL MESSAGES..."));

  try {
    const seedMessage1 = {
      sendingUserId: 1,
      recipientUserId: 2,
      time: "2022-10-25 11:06:00+00:00",
      text: "Spammy spam spam",
    };

    const seedMessage2 = {
      sendingUserId: 2,
      recipientUserId: 1,
      time: "2022-10-25 11:08:00+00:00",
      text: "Spammy spam spam spam spam",
    };

    const seedMessage3 = {
      sendingUserId: 3,
      recipientUserId: 1,
      time: "2022-10-25 11:08:00+00:00",
      text: "Please hire me!",
    };

    console.log(
      chalk.blueBright(
        "SEEDING MESSAGES...",
        seedMessage1,
        seedMessage2,
        seedMessage3
      )
    );

    const message1 = await createMessage(seedMessage1);
    const message2 = await createMessage(seedMessage2);
    const message3 = await createMessage(seedMessage3);

    console.log(
      chalk.yellowBright("SEEDED MESSAGES", message1, message2, message3)
    );
    console.log(chalk.green("FINISHED CREATING MESSAGES!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING MESSAGES", error));
    throw error;
  }
};

const createInitialFriendsList = async () => {
  console.log(chalk.green("CREATING INITIAL FREINDSLIST..."));

  try {
    const friendsList1 = await addFriends(1, 2);
    const friendsList2 = await addFriends(1, 3);
    const friendsList3 = await addFriends(2, 3);

    console.log(
      chalk.yellowBright(
        "SEEDED FRIENDSLIST",
        friendsList1,
        friendsList2,
        friendsList3
      )
    );

    console.log(chalk.green("FINISHED CREATING FRIENDSLIST!"));
  } catch (error) {
    console.error(chalk.red("ERROR SEEDING FRIENDSLIST", error));
    throw error;
  }
};

const rebuildDB = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialComments();
    await createInitialCommentUpvotes();
    await createInitialMessages();
    await createInitialFriendsList();
  } catch (error) {
    console.error(chalk.red("error rebuilding the db!", error));
    throw error;
  }
};

module.exports = {
  createInitialUsers,
  createInitialPosts,
  createInitialComments,
  createInitialCommentUpvotes,
  createInitialMessages,
  createInitialFriendsList,
  rebuildDB,
  createTables,
  dropTables,
};
