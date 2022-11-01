require("dotenv").config()
const request = require("supertest");
const app = require("../../../app");
const { createUser } = require("../../../db");


const fakeUserData = {
  firstname: "Tywin",
  lastname: "Lannister",
  username: "ProtectorOfTheRealm",
  password: "TheLion1234",
  email: "Ser.T.Lannister@gmail.com",
  picUrl: "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346"
}

const fakeNewUserData = {
  firstname: "Tywin",
  lastname: "Lannister",
  username: "ProtectorOfTheRealm1",
  password: "TheLion1234",
  confirmPassword: "TheLion1234",
  email: "Ser.T.Lannister1@gmail.com",
  picUrl: "https://static.wikia.nocookie.net/gameofthrones/images/7/71/Tywin_Lannister_4x08.jpg/revision/latest/scale-to-width-down/348?cb=20170830015346"
}

describe("api/users", () => {
  
  describe("POST users/login", () => {

    it("Logs the user in when provided correct information & returns JSON web token", async() => {

      await createUser(fakeUserData);

      const response = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })

      await expect(response.body).toMatchObject({
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
        });
      const response2 = await request(app)
      .post("/api/users/login")
      .send({
        username: fakeUserData.username,
        password: "FakePassword"
      });

      await expect(response1.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
      await expect(response2.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      });
    });

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

      await expect(response1.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
      await expect(response2.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String)
      })
    })
  })
  describe("POST users/register", () => {

    it("Creates a new user", async() => {

      const response = await request(app)
        .post("/api/users/register")
        .send(fakeNewUserData)

      await expect(response.body).toMatchObject({
        user: expect.any(Object),
        success: expect.any(String),
        token: expect.any(String)
      })
    })

    it("Returns correct error if Username already exists", async() => {
      fakeNewUserData.username = "ProtectorOfTheRealm";

      const response = await request(app)
        .post("/api/users/register")
        .send(fakeNewUserData)

      await expect(response.body).toMatchObject({
        error: expect.stringContaining("Username"),
        message: expect.stringContaining("is already taken")
      })
    })

    it("Returns correct error if E-mail already exists", async() => {
      fakeNewUserData.username = "DiffName"
      fakeNewUserData.email = "Ser.T.Lannister@gmail.com"

      const response = await request(app)
        .post("/api/users/register")
        .send(fakeNewUserData)

      await expect(response.body).toMatchObject({
        error: expect.stringContaining("E-mail"),
        message: expect.stringContaining("is already taken")
      })
    })
  })
  describe("PATCH users/:username/edit", () => {

    it("Updates only the received fields & returns the user", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        });
      const token = body.token;
      
      const response = await request(app)
        .patch(`/api/users/${fakeUserData.username}/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstname: "Tyrant",
          picUrl: "https://www.fake-url.com"
        });

      await expect(response.body).toMatchObject({
        userInputs: {
          firstname: "Tyrant",
          picUrl: "https://www.fake-url.com"
        },
        success: expect.any(String)
      });
    });

    it("Returns the proper error when password !== confirmPassword", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const response = await request(app)
        .patch(`/api/users/${fakeUserData.username}/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "newpassword",
          confirmPassword: "newpasswrd"
      });

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining("Password")
      });
    });

    it("Returns the proper error when password.length < 8", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const response = await request(app)
        .patch(`/api/users/${fakeUserData.username}/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "newpass",
          confirmPassword: "newpass"
      });

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining("8")
      });
    });

    it("Returns the proper error when no fields are submitted", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const response = await request(app)
        .patch(`/api/users/${fakeUserData.username}/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      await expect(response.body).toMatchObject({
        error: expect.any(String),
        message: "You must update at least one field before submission"
      });
    });

    it("Does not allow a user to update another user's information", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const response = await request(app)
        .patch("/api/users/randomuser/edit")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "test@test.test"
        });
      
      await expect(response.body).toMatchObject({
        error: expect.stringContaining("Unauthorized"),
        message: expect.any(String)
      });
      await expect(response.status).toEqual(403);
    });

    it("Returns the proper error when E-mail is taken", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const { email } = await createUser({
        firstname: "Tom",
        lastname: "Anderson",
        username: "MySpaceTom",
        password: "Tommy12345",
        email: "T.Anderson@gmail.com"
      })
      console.log("EMAIL", email)

      const response = await request(app)
        .patch(`/api/users/${fakeUserData.username}/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          email
        })

      await expect(response.body).toMatchObject({
        error: expect.stringContaining("E-mail"),
        message: expect.stringContaining(email)
      });
    });
  });
  describe("GET users/me", () => {

    it("Returns the current authorized user's information", async() => {
      const { body } = await request(app)
        .post("/api/users/login")
        .send({
          username: fakeUserData.username,
          password: fakeUserData.password
        })
      const token = body.token;

      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)

      await expect(response.body).toMatchObject({
        id: expect.any(Number),
        firstname: "Tyrant",
        lastname: "Lannister",
        username: "ProtectorOfTheRealm",
        email: "Ser.T.Lannister@gmail.com",
        picUrl: "https://www.fake-url.com"
      });
    });
  });
});
