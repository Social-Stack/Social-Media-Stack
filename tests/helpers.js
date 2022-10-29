require("dotenv").config()
const request = require("supertest");
const app = require("../app")

const testLoginUser = async({ username, password }) => {
  const { body: validatedUser } = await request(app)
    .post("/api/users/login")
    .send({
      username,
      password
    });
  return validatedUser;
}

module.exports = {
  testLoginUser
}