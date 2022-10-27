const client = require("../db/client");
const chalk = require("chalk");

const tearDown = async ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  console.log(chalk.green("Testing complete."));
  await client.query(
    `
    DELETE FROM upvotes;
    DELETE FROM friendslists;
    DELETE FROM messages;
    DELETE FROM posts;
    DELETE FROM users;
    `
  );
  client.end();
};

module.exports = tearDown;
