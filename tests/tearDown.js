const client = require('../db/client');
const chalk = require('chalk');

const tearDown = async ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  await client.end();
  console.log(chalk.green("Testing complete."));
}

module.exports = tearDown;