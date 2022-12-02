require('dotenv').config();

const { Pool } = require('pg');

const DATABASE_URL = process.env.DB_URL;
const PASSWORD = process.env.DB_PW;

const client = new Pool({
  user: 'user',
  host: 'db.bit.io',
  database: DATABASE_URL,
  password: PASSWORD, // key from bit.io database page connect menu
  port: 5432,
  ssl: true
});

module.exports = client;
