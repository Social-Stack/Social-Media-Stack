require("dotenv").config()
const request = require("supertest");
const app = require("../../app")
const client = require("../.././db/client");
const jwt = require("jsonwebtoken");
const { createUser } = require("../../db");
const { JWT_SECRET = 'NoTelling' } = process.env;


const fakeUserData = {
  firstname: "Tywin",
  lastname: "Lannister",
  username: "ProtectorOfTheRealm",
  password: "TheLion",
  email: "Ser.T.Lannister@gmail.com",
  picUrl: "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346"
}

const fakeNewUserData = {
  firstname: "Tywin",
  lastname: "Lannister",
  username: "ProtectorOfTheRealm1",
  password: "TheLion",
  email: "Ser.T.Lannister1@gmail.com",
  picUrl: "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346"
}

describe("api/users", () => {
  
  describe("POST api/users/login", () => {

    it("Logs the user in when provided correct information & returns JSON web token", async() => {

      await createUser(fakeUserData);

      const response = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })

      expect(response.body).toMatchObject({
        user: expect.any(Object),
        message: expect.any(String),
        token: expect.any(String)
      });
    })
      
    it("Returns proper error if provided incorrect information", async() => {

      const response1 = await request(app)
        .post("/api/users/login")
        .send({
          username: "FakeName",
          password: fakeUserData.password
        })
      const response2 = await request(app)
      .post("/api/users/login")
      .send({
        username: fakeUserData.username,
        password: "FakePassword"
      })

      expect(response1.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
      expect(response2.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    })

    it("Returns proper error if missing credentials", async() => {

      const response1 = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username
        })
      const response2 = await request(app)
      .post("/api/users/login")
      .send({
        password: fakeUserData.password
      })

      expect(response1.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
      expect(response2.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
    })
  })
  describe("POST api/users/register", () => {

    it("Creates a new user", async() => {

      const response = await request(app)
        .post("/api/users/register")
        .send(fakeNewUserData)

      expect(response.body).toMatchObject({
        user: expect.any(Object),
        success: expect.any(String),
        token: expect.any(String)
      })
    })
    
  })
})