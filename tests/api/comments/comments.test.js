require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
const { createUser } = require("../../../db");
const { testLoginUser } = require("../../helpers");

describe("api/comments", () => {
  let user = {};
  let validUser = {};
  let post = {};
  let comment = {};
  let token = "";

  const seedTestData = async() => {
    const _user = await createUser({
      firstname: "C API Tests",
      lastname: "C API Testerson",
      username: "TestPerson6",
      password: "supersecret12345",
      email: "C.API.123.User@gmail.com"
    })
    const _validUser = await createUser({
      firstname: "C API Tests2",
      lastname: "C API Testerson2",
      username: "Test_McGee",
      password: "supersecret1234",
      email: "C.API.123.User2@gmail.com"
    })
    // CONTINUE HERE
    const _post = await createPost({
      userId: _user.id,
      text: "Postin' time!",
      time: new Date(),
      isPublic: true
    })
    const _comment = await createComment({
      authorId: _user.id,
      postId: _post.id,
      time: new Date(),
      text: "Back to coding"
    })
    const _token = await testLoginUser({
      username: _validUser.username,
      password: _validUser.password
    })
    user = await _user;
    validUser = await _validUser;
    post = await _post;
    comment = await _comment;
    token = await _token;
  }
})