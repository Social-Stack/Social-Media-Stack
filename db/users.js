const client = require("./client");
const bcrypt = require("bcrypt");

const createUser = async({
  firstname,
  lastname,
  username,
  password,
  email,
  picUrl = "https://i.ibb.co/ZJjmKmj/person-icon-red-3.png",
  isAdmin = false
}) => {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users (firstname, lastname, username, password, email, "picUrl", "isAdmin")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `,
      [firstname, lastname, username, hashedPassword, email, picUrl, isAdmin]
    );

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateUser = async ({ id, ...fields}) => {
  if (fields.password) {
    const SALT_COUNT = 10;
    fields.password = await bcrypt.hash(fields.password, SALT_COUNT);
  }
  const columns = Object.keys(fields)
  .map((key, idx) => `"${key}" = $${idx + 1}`)
  .join(", ")

  if (!columns || !columns.length) {
    return;
  }

  try {
    const {
      rows: [user],
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
    throw error;
  }
}

const getUserByUsername = async (username) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username = "${username}";
      `
    );
    
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getUserById = async (id) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE id = ${id};
      `
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getUserByEmail = async (email) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE email = ${email};
      `
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const authenticateUser = async ({ username, password }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username = "${username}";
      `
    );
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createUser,
  updateUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  authenticateUser,
}