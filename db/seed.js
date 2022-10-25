const client = require("./client");
const { rebuildDB } = require('./seedData');
const chalk = require("chalk")

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());