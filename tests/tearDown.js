const client = require('../db/client');
const chalk = require('chalk');
const db = require('../db');

const tearDown = ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  console.log(chalk.green("Testing complete."));
  client.end();
}

module.exports = tearDown;