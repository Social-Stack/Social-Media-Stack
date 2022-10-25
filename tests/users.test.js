const { 
  createUser,
  updateUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  authenticateUser 
} = require("../db");
const client = require("../db");
const bcrypt = require("bcrypt");


describe("DB Users", () =>{

  describe("createUser", () => {
    const fakeUserData = {
      firstname: "Jon",
      lastname: "Snow",
      username: "WardenOfTheNorth",
      password: "dragonRider",
      email: "J.Snow@gmail.com"
    }
    
    it("Creates & returns the user", async() => {
      const _user = await createUser(fakeUserData);
      const user = await getUserById(_user.id);


      expect(user.username).toBe(fakeUserData.username);
    })

    it("Encrypts the password", async() => {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT * FROM users,
        WHERE email = ${fakeUserData.email};
        `
      );

      const passwordsMatch = await bcrypt.compare(
        fakeUserData.password,
        user.password
      );

      expect(passwordsMatch).toBe(true);
    })

    it("Defaults isAdmin to false when not provided a value", async() => {
      const user = getUserByEmail(fakeUserData.email);

      expect(user.isAdmin).toBe(false);
    })

    it("Does update isAdmin to true when provided a true value", async() => {
      const fakeAdminData = {
        firstname: "Tyrion",
        lastname: "Lannister",
        username: "PaysHisDebts",
        password: "ihatemydad",
        email: "T.Lannister@gmail.com",
        isAdmin: true
      }
      const _admin = createUser(fakeAdminData);
      const admin = getUserById(_admin.id);

      expect(admin.isAdmin).toBe(true);
    })

    it("Defaults picUrl to placeholder when not provided a value", async() => {
      const user = getUserByEmail(fakeUserData.email);

      expect(user.picUrl).toBe("https://i.ibb.co/ZJjmKmj/person-icon-red-3.png");
    })

    it("Does update picUrl when provided a value", async() => {
      const _fakeUserData = {
        firstname: "Theon",
        lastname: "Greyjoy",
        username: "WeDoNotSow",
        password: "ihatemydadtoo",
        email: "T.Greyjoy@gmail.com",
        picUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Theon_Greyjoy-Alfie_Allen.jpg"
      }

      const _user = await createUser(_fakeUserData);
      const user = await getUserById(_user.id);

      expect(user.picUrl).toBe("https://upload.wikimedia.org/wikipedia/en/5/51/Theon_Greyjoy-Alfie_Allen.jpg")
    })
  })
})