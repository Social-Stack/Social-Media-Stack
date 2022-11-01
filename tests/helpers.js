require("dotenv").config()
const request = require("supertest");
const app = require("../app")

const testLoginUser = async({ username, password }) => {
  console.log("UNPW", username, password)
  const { body: validatedUser } = await request(app)
    .post("/api/users/login")
    .send({
      username,
      password
    });
    console.log("VU", validatedUser)
  return validatedUser;
}

module.exports = {
  testLoginUser
}