const { Pool } = require('pg');

const DEV_MODE = process.env.REACT_APP_DEV_MODE;
const DATABASE_URL = process.env.DB_URL;
const PASSWORD = process.env.DB_PW;

if (DEV_MODE) {
  const connectionString = 'https://localhost:5432/stack-social';

  const client = new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined
  });
  module.exports = client;
} else {
  const client = new Pool({
    user: 'ndubell01',
    host: 'db.bit.io',
    database: DATABASE_URL,
    password: PASSWORD, // key from bit.io database page connect menu
    port: 5432,
    ssl: true
  });
  module.exports = client;
}
