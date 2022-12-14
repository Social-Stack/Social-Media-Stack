const client = require('./client');
const bcrypt = require('bcrypt');

const createUser = async ({
  firstname,
  lastname,
  username,
  password,
  email,
  picUrl = 'https://i.ibb.co/LY0hMGq/person-icon-red-3-edit.jpg',
  isAdmin = false
}) => {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const time = new Date();

    const {
      rows: [user]
    } = await client.query(
      `
        INSERT INTO users (firstname, lastname, username, password, email, "picUrl", "lastActive", "isAdmin")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `,
      [
        firstname,
        lastname,
        username,
        hashedPassword,
        email,
        picUrl,
        time,
        isAdmin
      ]
    );
    return user;
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

const updateUser = async ({ id, ...fields }) => {
  if (fields.password) {
    const SALT_COUNT = 10;
    fields.password = await bcrypt.hash(fields.password, SALT_COUNT);
  }
  const columns = Object.keys(fields)
    .map((key, idx) => `"${key}" = $${idx + 1}`)
    .join(', ');

  if (!columns || !columns.length) {
    return;
  }

  try {
    const {
      rows: [user]
    } = await client.query(
      `
        UPDATE users
        SET ${columns}
        WHERE id = ${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

const getUserByUsername = async (username) => {
  try {
    const {
      rows: [user]
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username = '${username}';
      `
    );

    if (!user) {
      return;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

const getUserById = async (id) => {
  try {
    const {
      rows: [user]
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE id = ${id};
      `
    );

    if (!user) {
      return;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

const getUserByEmail = async (email) => {
  try {
    const {
      rows: [user]
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE email = '${email}';
      `
    );

    if (!user) {
      return;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
    ror;
  }
};

const updateActive = async (id) => {
  const time = new Date();
  try {
    const {
      rows: [user]
    } = await client.query(
      `
    UPDATE users
    SET "lastActive" = $1
    WHERE id=${id}
    RETURNING *;
    `,
      [time]
    );
    return user;
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

const authenticateUser = async ({ username, password }) => {
  if (!username || !password) {
    return;
  }
  try {
    const {
      rows: [user]
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username = '${username}';
      `
    );
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        delete user.password;
        return user;
      }
    }
  } catch (error) {
    console.error(error);
    // //throw error;ror;
  }
};

module.exports = {
  createUser,
  updateUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  updateActive,
  authenticateUser
};
