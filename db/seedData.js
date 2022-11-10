const client = require("./client");
const chalk = require("chalk");

const {
  createUser,
  createPost,
  createMessage,
  addFriends,
} = require("./");
const { createComment, updateComment } = require("./comments");
const { addUpvoteToComment } = require("./comment_upvotes");
const { requestFriend, acceptFriend } = require("./friendRequests");
const { getNotisByUserId, seenByNotiId } = require("./notifications");

const createTables = async () => {
  console.log(chalk.green("BUILDING TABLES..."));
  try {
    await createTableUsers();
    await createTablePosts();
    await createTablePostUpvotes();
    await createTableComments();
    await createTableCommentUpvotes();
    await createTableMessages();
    await createTableFriendRequests();
    await createTableFriendsLists();
    await createTableNotifications();

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
        DROP TABLE IF EXISTS notifications;
        DROP TABLE IF EXISTS friendslists;
        DROP TABLE IF EXISTS friendrequests;
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
               text VARCHAR(1020) NOT NULL,
               "isPublic" BOOLEAN DEFAULT false NOT NULL,
               time TIMESTAMPTZ NOT NULL,
               "updateTime" TIMESTAMPTZ DEFAULT null
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
        text VARCHAR(2040) NOT NULL,
        "updateTime" TIMESTAMPTZ DEFAULT null
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
const createTableFriendRequests = async () => {
  try {
    await client.query(`
            CREATE TABLE friendrequests(
                "userId" INTEGER REFERENCES users(id),
                "requestedFriendId" INTEGER REFERENCES users(id),
                UNIQUE ("userId", "requestedFriendId")
            );
        `);
  } catch (error) {
    console.error(chalk.red("error during create friendsrequests table"));
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
const createTableNotifications = async () => {
  try {
    await client.query(`
            CREATE TABLE notifications(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                type VARCHAR(40) NOT NULL,
                text VARCHAR(255) NOT NULL,
                url VARCHAR(255) DEFAULT NULL,
                seen boolean DEFAULT false
            );
        `);
  } catch (error) {
    console.error(chalk.red("error during create notifications table"));
    throw error;
  }
};


//data

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

    const nadiaSeed = {
      firstname: "Nadia",
      lastname: "DuBell",
      username: "nadiadubell",
      password: "nadiadubell",
      email: "nadia.dubell@fakemail.com",
      isAdmin: true,
    };

    const fredSeed = {
      firstname: "Fred",
      lastname: "Davis",
      username: "editfred",
      password: "editfred",
      email: "fred.davis@fakemail.com",
      isAdmin: true,
    };

    const sangSeed = {
      firstname: "Sang",
      lastname: "Lee",
      username: "bornsinner",
      password: "bornsinner",
      email: "sang.lee@fakemail.com",
      isAdmin: true,
    };

    const cjSeed = {
      firstname: "CJ",
      lastname: "Fritz",
      username: "wandernaut",
      password: "wandernaut",
      email: "cj.fritz@fakemail.com",
      isAdmin: true,
    };

    console.log(
      chalk.blueBright("SEEDING USERS... ", albertSeed, sandraSeed, glamgalSeed)
    );

    const albert = await createUser(albertSeed);
    const sandra = await createUser(sandraSeed);
    const glamgal = await createUser(glamgalSeed);
    await createUser(nadiaSeed);
    await createUser(fredSeed);
    await createUser(sangSeed);
    await createUser(cjSeed);

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

    const seedPost4 = {
      userId: 4,
      text: "Will code for coffee",
      time: new Date(),
      isPublic: true,
    };

    const seedPost5 = {
      userId: 5,
      text: "Hey everyone! I was just thinking that we should keep coding and become the best developers and engineers the web has ever seen!",
      time: new Date(),
      isPublic: true,
    };

    const seedPost6 = {
      userId: 6,
      text: "Cat ipsum dolor sit amet, plop down in the middle where everybody walks or kitty loves pigs. Drool massacre a bird in the living room and then look like the cutest and most innocent animal on the planet and scratch me there, elevator butt be superior. My slave human didn't give me any food so i pooped on the floor relentlessly pursues moth, dead stare with ears cocked so run off table persian cat jump eat fish.",
      time: new Date(),
      isPublic: true,
    };

    const seedPost7 = {
      userId: 7,
      text: "Cat ipsum dolor sit amet, demand to be let outside at once, and expect owner to wait for me as i think about it yet open the door, let me out, let me out, let me-out, let me-aow, let meaow, meaow! intrigued by the shower find a way to fit in tiny box. Stinky cat scratch me now! stop scratching me! so see owner, run in terror so the fat cat sat on the mat bat away with paws but sugar, my siamese, stalks me (in a good way), day and night .",
      time: new Date(),
      isPublic: true,
    };

    const seedPost8 = {
      userId: 2,
      text: "Cat ipsum dolor sit amet, at four in the morning wake up owner meeeeeeooww scratch at legs and beg for food then cry and yowl until they wake up at two pm jump on window and sleep while observing the bootyful cat next door that u really like but who already has a boyfriend end up making babies with her and let her move in. Rub against owner because nose is wet Gate keepers of hell for walk on keyboard for scamper yet poop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls.",
      time: new Date(),
      isPublic: true,
    };

    const seedPost9 = {
      userId: 6,
      text: "Cat ipsum dolor sit amet, ask to go outside and ask to come inside and ask to go outside and ask to come inside, but hiiiiiiiiii feed me now, jump off balcony, onto stranger's head. Purr like a car engine oh yes, there is my human slave woman she does best pats ever that all i like about her hiss meow destroy the blinds leave buried treasure in the sandbox for the toddlers shake treat bag, for freak human out make funny noise mow mow mow mow mow mow success now attack human pee on walls it smells like breakfast but shed everywhere shed everywhere stretching attack your ankles chase the red dot, hairball run catnip eat the grass sniff.",
      time: new Date(),
      isPublic: true,
    };

    const seedPost10 = {
      userId: 7,
      text: "Cat ipsum dolor sit amet, ask to be pet then attack owners hand stuff and things instead of drinking water from the cat bowl, make sure to steal water from the toilet refuse to leave cardboard box. Chase little red dot someday it will be mine! chew iPad power cord catto munch salmono but attack like a vicious monster.",
      time: new Date(),
      isPublic: true,
    };

    const seedPost11 = {
      userId: 3,
      text: "Cat ipsum dolor sit amet, vommit food and eat it again. Sit and stare drink water out of the faucet cat meoooow i iz master of hoomaan, not hoomaan master of i, oooh damn dat dog hiss at vacuum cleaner scratch me now! stop scratching me! claws in your leg so fish i must find my red catnip fishy fish. Groom forever, stretch tongue and leave it slightly out, blep chase red laser dot. Headbutt owner's knee. Russian blue be superior bleghbleghvomit my furball really tie the room together dead stare with ears cocked.",
      time: new Date(),
      isPublic: true,
    };

    console.log(
      chalk.blueBright("SEEDING POSTS...", seedPost1, seedPost2, seedPost3)
    );

    const post1 = await createPost(seedPost1);
    const post2 = await createPost(seedPost2);
    const post3 = await createPost(seedPost3);
    await createPost(seedPost4)
    await createPost(seedPost5)
    await createPost(seedPost6)
    await createPost(seedPost7)
    await createPost(seedPost8)
    await createPost(seedPost9)
    await createPost(seedPost10)
    await createPost(seedPost11)

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
      authorId: 5,
      postId: 5,
      time: new Date(),
      text: "As a child, Marco Schädler played music together with his father. At the age of nine, he became a temporary organist in the parish church of Triesenberg, and in Triesen. He was organist until 1998. From 1982 to 1988, he held a part-time position as a piano teacher at the Liechtenstein Music School. He has been a freelance artist and composer since 1988 (theater and ballet music, masses, orchestras, choral and chamber music, sound installations for film and various performances)."
    }

    const seedComment4 = {
      authorId: 3,
      postId: 8,
      time: "2022-10-24 11:06:00+00:00",
      text: "We did it!",
    };

    const seedComment5 = {
      authorId: 3,
      postId: 7,
      time: new Date(),
      text: "This may just be the coolest thing I have ever seen in my entire life. No joke. Not even kidding. Super serious.",
    };

    const seedComment6 = {
      authorId: 6,
      postId: 10,
      time: new Date(),
      text: "What the heck?! No way you made this, you stole this code from someone else that stole this code!",
    };
    
    const seedComment7 = {
      authorId: 4,
      postId: 2,
      time: new Date(),
      text: "Congrats!",
    };

    const seedComment8 = {
      authorId: 3,
      postId: 1,
      time: new Date(),
      text: "Ain't that just the neatest thing I ever done did see",
    };
    
    const seedComment9 = {
      authorId: 7,
      postId: 10,
      time: new Date(),
      text: "You can tell it's an Aspin by the way it is 🌲",
    };
    
    const seedComment10 = {
      authorId: 4,
      postId: 4,
      time: new Date(),
      text: "An evergreen tree, which keeps green leaves all year round. Depicted as a tall, dark green, cone-shaped tree with shaggy, layered leaves, as a pine or fir, showing a brown trunk.",
    };
    
    const seedComment11 = {
      authorId: 3,
      postId: 9,
      time: new Date(),
      text: "May be decorated in the form of a 🎄 Christmas Tree. May also be used to represent various types of trees, forests, northern climates, nature, winter, and the Christmas season.",
    };
    
    const seedComment12 = {
      authorId: 2,
      postId: 6,
      time: new Date(),
      text: "✨ B E L I E V E ✨ AND YOU SHALL ✨ A C H I E V E ✨",
    };
    
    const seedComment13 = {
      authorId: 6,
      postId: 2,
      time: new Date(),
      text: "Perhaps you have wondered how predictable machines like computers can generate randomness. In reality, most random numbers used in computer programs are pseudo-random, which means they are generated in a predictable fashion using a mathematical formula. This is fine for many purposes, but it may not be random in the way you expect if you're used to dice rolls and lottery drawings.",
    };
    
    const seedComment14 = {
      authorId: 4,
      postId: 9,
      time: new Date(),
      text: "Hi, i want to downgrade my windows 10. The problem is that i want to save my data from my external hdd which in my case is D: drive and when im gonna downgrade windows its gonna format all my drives. I only have 2 hard drives one is for windows and files the other is for my games that take alot of time and space to download. How can i save my D drives files i dont care about the C drive one, because thats the one that has windows on it and needs to be reinstalled.",
    };

    const seedComment15 = {
      authorId: 5,
      postId: 1,
      time: new Date(),
      text: "Ovula is a genus of sea snails, marine gastropod mollusks in the family Ovulidae.",
    };

    const seedComment16 = {
      authorId: 4,
      postId: 1,
      time: new Date(),
      text: "The 1989 UK Athletics Championships was the national championship in outdoor track and field for the United Kingdom held at Monkton Stadium, Jarrow. It was the first time that the event was held in North East England. The men's 10,000 metres was dropped from the programme and replaced by a 3000 metres event. Strong winds affected the jumps programme and several of the sprint races.",
    };

    const seedComment17 = {
      authorId: 3,
      postId: 3,
      time: new Date(),
      text: "Marques del Duero was a first-class gunboat, or 'aviso', built by La Seyne in France. She was laid down on 20 January 1875, launched on 3 May 1875, and completed the same year. She was designed to fight against the Carlists in the Mediterranean and the Bay of Biscay during the Third Carlist War, patrolling off Carlist ports to intercept contraband and blockade the ports, and also providing despatch services between Spanish Navy forces operating off various ports, hence her Spanish designation of aviso, meaning 'warning.' She had an iron hull with a very prominent ram bow, was coal-fired, was rigged as a schooner, and could carry 89 tons of coal. She was reclassified as a third-class gunboat in 1895.",
    };

    const seedComment18 = {
      authorId: 6,
      postId: 6,
      time: new Date(),
      text: "Heinrich Burkowitz (31 January 1892 - November 1918) was a German sprinter. He competed at the 1912 Summer Olympics. He was killed in action in November 1918, while fighting in World War I.",
    };

    const seedComment19 = {
      authorId: 7,
      postId: 7,
      time: new Date(),
      text: "Hubble search for transition comets (Transition Comets—UV Search for OH Emissions in Asteroids) was a study involving amateur astronomers and the use of the Hubble Space Telescope, one of only six studies involving amateur astronomers approved by NASA. In the beginning years of the Hubble Space Telescope (HST) project, NASA and Congress were interested in finding ways for amateur astronomers to participate in HST research. The director of the Space Telescope Science Institute (STScI), Riccardo Giacconi, decided to allocate some of his Directors Discretionary time to amateur observing programs. In December 1985, the leaders of seven national amateur astronomy organizations met at STScI in Baltimore to discuss the participation of amateur astronomers in the HST project. The team used the Hubble Space Telescope to perform a spectroscopic search for OH emission from five asteroids. OH emission would indicate that the asteroids were once comets. 944 Hidalgo and 2201 Oljato move in elliptical, comet-like orbits. 182 Elsa, 224 Oceana, and 899 Jokaste are main-belt asteroids. The last three have been observed with coma (Kresak, 1977). Concurrently with the spectroscopic study, ground-based visual observations were carried out by 80 amateur astronomers in 22 countries.",
    };

    const seedComment20 = {
      authorId: 4,
      postId: 4,
      time: new Date(),
      text: "The 20th Utah Senate District is located in Weber County and includes Utah House Districts 6, 7, 8, 9, 11 and 12. The current State Senator representing the 20th district is Gregg Buxton. Buxton was elected to the Utah Senate in 2016 and re-elected in 2020.",
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
    await createComment(seedComment4);
    await createComment(seedComment5);
    await createComment(seedComment6);
    await createComment(seedComment7);
    await createComment(seedComment8);
    await createComment(seedComment9);
    await createComment(seedComment10);
    await createComment(seedComment11);
    await createComment(seedComment12);
    await createComment(seedComment13);
    await createComment(seedComment14);
    await createComment(seedComment15);
    await createComment(seedComment16);
    await createComment(seedComment17);
    await createComment(seedComment18);
    await createComment(seedComment19);
    await createComment(seedComment20);

    console.log(
      chalk.yellowBright("SEEDED COMMENTS: ", comment1, comment2, comment3)
    );
    
    const updatedComment = await updateComment({
      commentId: comment1.id,
      time: new Date(),
      text: "What a neat update."
    });

    console.log(
      "UPDATED COMMENT: ", updatedComment
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

    const seedCommentUpvote4 = {
      commentId: 3,
      userId: 4,
    };

    const seedCommentUpvote5 = {
      commentId: 6,
      userId: 5,
    };

    const seedCommentUpvote6 = {
      commentId: 19,
      userId: 7,
    };

    const seedCommentUpvote7 = {
      commentId: 3,
      userId: 3,
    };

    const seedCommentUpvote8 = {
      commentId: 4,
      userId: 6,
    };

    const seedCommentUpvote9 = {
      commentId: 6,
      userId: 4,
    };

    const seedCommentUpvote10 = {
      commentId: 2,
      userId: 5,
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
    await addUpvoteToComment(seedCommentUpvote4);
    await addUpvoteToComment(seedCommentUpvote5);
    await addUpvoteToComment(seedCommentUpvote6);
    await addUpvoteToComment(seedCommentUpvote7);
    await addUpvoteToComment(seedCommentUpvote8);
    await addUpvoteToComment(seedCommentUpvote9);
    await addUpvoteToComment(seedCommentUpvote10);

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
    const seedMessage4 = {
      sendingUserId: 2,
      recipientUserId: 1,
      time: "2022-10-25 11:08:00+00:00",
      text: "Sandra says hi!",
    };
    const seedMessage5 = {
      sendingUserId: 3,
      recipientUserId: 4,
      time: new Date(),
      text: "I found this answer by looking in %USERPROFILE%\AppData\Local\rancher-desktop\logs\wsl-exec.log which revealed: WSL 2 requires an update to its kernel component.",
    };

    const seedMessage6 = {
      sendingUserId: 5,
      recipientUserId: 3,
      time: new Date(),
      text: "I am getting the below error when installing the latest stable Rancher Desktop in my Virtual Machine. Could someone please help?",
    };

    const seedMessage7 = {
      sendingUserId: 1,
      recipientUserId: 7,
      time: new Date(),
      text: "I have been using Ubuntu 20.04 on WSL2 daily for the past one year. Yesterday I ran sudo apt update && sudo apt upgrade in the Ubuntu distro.",
    };

    const seedMessage8 = {
      sendingUserId: 7,
      recipientUserId: 3,
      time: new Date(),
      text: "Managed to solve it by removing NAS storage entry in /etc/fstab. Ubuntu in WSL2 will fail to start if the connection to NAS storage fail.",
    };

    const seedMessage9 = {
      sendingUserId: 2,
      recipientUserId: 6,
      time: new Date(),
      text: "Hey! How are you?",
    };

    const seedMessage10 = {
      sendingUserId: 1,
      recipientUserId: 7,
      time: new Date(),
      text: "Sounds good, see ya then",
    };

    const seedMessage11 = {
      sendingUserId: 5,
      recipientUserId: 2,
      time: new Date(),
      text: "Hey! Dinner soon?",
    };

    const seedMessage12 = {
      sendingUserId: 2,
      recipientUserId: 5,
      time: new Date(),
      text: "In this video I cover everything you need to know about the useContext hook. I go over all the main use cases for useContext as well as many common mistakes that developers make.",
    };

    const seedMessage13 = {
      sendingUserId: 4,
      recipientUserId: 1,
      time: new Date(),
      text: "Subbed to see more of this series, good job so far man",
    };

    const seedMessage14 = {
      sendingUserId: 6,
      recipientUserId: 5,
      time: new Date(),
      text: "You've got a bug here: in order to scroll to the bottom of the left sidebar you need to scroll all the comments first",
    };

    const seedMessage15 = {
      sendingUserId: 3,
      recipientUserId: 7,
      time: new Date(),
      text: "Redux is for managing state while Context is for passing state to components. You can use either one or both together.",
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
    const message4 = await createMessage(seedMessage4);
    const message5 = await createMessage(seedMessage5);
    await createMessage(seedMessage6);
    await createMessage(seedMessage7);
    await createMessage(seedMessage8);
    await createMessage(seedMessage9);
    await createMessage(seedMessage10);
    await createMessage(seedMessage11);
    await createMessage(seedMessage12);
    await createMessage(seedMessage13);
    await createMessage(seedMessage14);
    await createMessage(seedMessage15);

    console.log(
      chalk.yellowBright(
        "SEEDED MESSAGES",
        message1,
        message2,
        message3,
        message4,
        message5
      )
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
    await addFriends(2, 5);
    await addFriends(7, 4);
    await addFriends(6, 2);
    await addFriends(4, 6);
    await requestFriend(1,5);
    await requestFriend(7,5);
    await requestFriend(6,5);
    await requestFriend(4,5);
    await requestFriend(5,3);

    console.log(
      chalk.yellowBright(
        "SEEDED FRIENDSLIST",
        friendsList1,
        friendsList2,
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
    await requestFriend(3,2)

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
