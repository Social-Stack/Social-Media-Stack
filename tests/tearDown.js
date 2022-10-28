const client = require("../db/client");
const chalk = require("chalk");
const { dropTables } = require("../db/seedData");

const tearDown = async ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  console.log(chalk.green("Testing complete."));
  await dropTables();
  client.end();
};

module.exports = tearDown;
