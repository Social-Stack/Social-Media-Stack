const client = require('../db/client');
const { rebuildDB } = require('../db/seedData')
const chalk = require('chalk');

const tearDown = async({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  console.log(chalk.green("Testing complete."));
  await client.query(
    `
      DELETE FROM users;
      DELETE FROM posts;
      DELETE FROM messages;
      DELETE FROM friendslists;
      DELETE FROM upvotes;
    `
  )
  client.end();
}

module.exports = tearDown;