const client = require('../db/client');
const chalk = require('chalk');
const { 
  createTables, 
  dropTables 
} = require('../db/seedData');

const setup = async () => {
  console.log(chalk.blueBright("Jest Setup in Progress"));

  // await client.connect();
  await dropTables();
  await createTables();
}

module.exports = setup;