const { 
  createUser,
  updateUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  authenticateUser 
} = require("../../../db");
const client = require("../../../db/client");
const bcrypt = require("bcrypt");

const fakeUserData = {
  firstname: "Jon",
  lastname: "Snow",
  username: "WardenOfTheNorth",
  password: "dragonRider",
  email: "J.Snow@gmail.com"
}

describe("DB Users", () =>{


  describe("createUser", () => {
    
    it("Creates & returns the user", async() => {
      const _user = await createUser(fakeUserData);
      const user = await getUserById(_user.id);


      expect(user.username).toBe(fakeUserData.username);
    });

    it("Encrypts the password", async() => {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT * 
        FROM users
        WHERE email = '${fakeUserData.email}';
        `
      );

      const passwordsMatch = await bcrypt.compare(
        fakeUserData.password,
        user.password
      );

      expect(passwordsMatch).toBe(true);
    });

    it("Defaults isAdmin to false when not provided a value", async() => {
      const user = await getUserByEmail(fakeUserData.email);

      expect(user.isAdmin).toBe(false);
    });

    it("Does update isAdmin to true when provided a true value", async() => {
      const fakeAdminData = {
        firstname: "Tyrion",
        lastname: "Lannister",
        username: "PaysHisDebts",
        password: "ihatemydad",
        email: "T.Lannister@gmail.com",
        isAdmin: true
      }
      const _admin = await createUser(fakeAdminData);
      const admin = await getUserById(_admin.id);

      expect(admin.isAdmin).toBe(true);
    });

    it("Defaults picUrl to placeholder when not provided a value", async() => {
      const user = await getUserByEmail(fakeUserData.email);

      expect(user.picUrl).toBe("https://i.ibb.co/ZJjmKmj/person-icon-red-3.png");
    });

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

      expect(user.picUrl).toBe("https://upload.wikimedia.org/wikipedia/en/5/51/Theon_Greyjoy-Alfie_Allen.jpg");
    });
  });

  describe("updateUser", () => {

    it("Updates & returns the user", async() => {

      const fakeUpdateFields = {
        id: 1,
        firstname: "Son",
        lastname: "Jnow",
        username: "WotS",
        password: "1234asdf",
        email: "Snow.J@gmail.com",
        picUrl: "https://www.test.com",
        isAdmin: true
      }
      
      const _user = await updateUser(fakeUpdateFields);
      const user = await getUserById(_user.id);

      expect(user.firstname).toBe(fakeUpdateFields.firstname);
      expect(user.lastname).toBe(fakeUpdateFields.lastname);
      expect(user.username).toBe(fakeUpdateFields.username);
      expect(user.email).toBe(fakeUpdateFields.email);
      expect(user.picUrl).toBe(fakeUpdateFields.picUrl);
      expect(user.isAdmin).toBe(fakeUpdateFields.isAdmin);
    });

    it("Updates only the fields received", async() => {
      const fakeUpdateFields = {
        id: 1,
        username: "JonJon",
        picUrl: "https://myimage.img"
      }
      await updateUser(fakeUpdateFields);
      const user = await getUserById(1);

      expect(user.username).toBe(fakeUpdateFields.username);
      expect(user.picUrl).toBe(fakeUpdateFields.picUrl);
    });
  });
  describe("getUserByUsername", () => {

    it("Returns the correct user", async() => {
      const user = await getUserByUsername("JonJon");

      expect(user.username).toBe("JonJon");
    });

    it("Does not return the password", async() => {
      const user = await getUserByUsername("JonJon");

      expect(user.password).toBe(undefined);
    });
  });

  describe("getUserById", () => {
    it("Returns the correct user", async() => {
      const user = await getUserById(1);

      expect(user.id).toBe(1);
    });

    it("Does not return the password", async() => {
      const user = await getUserById(1);

      expect(user.password).toBe(undefined);
    });
  });
  
  describe("getUserByEmail", () => {
    it("Returns the correct user", async() => {
      const user = await getUserByEmail("Snow.J@gmail.com");

      expect(user.email).toBe("Snow.J@gmail.com");
    });

    it("Does not return the password", async() => {
      const user = await getUserByEmail("Snow.J@gmail.com");

      expect(user.password).toBe(undefined);
    });
  });
  describe("authenticateUser", () => {

    it("Returns the user when password verifies", async() => {
      const truthyUserData = {
        username: "JonJon",
        password: "1234asdf"
      }

      const user = await authenticateUser(truthyUserData);
      expect(user.username).toBe("JonJon");
    });

    it("Does not return a user when password doesn't verify", async() => {
      const falsyUserData = {
        username: "JonJon",
        password: "fdsa4321"
      }

      const user = await authenticateUser(falsyUserData);

      expect(user).toBe(undefined);
    });

    it("Does not return the password", async() => {
      const truthyUserData = {
        username: "JonJon",
        password: "1234asdf"
      }

      const user = await authenticateUser(truthyUserData);

      expect(user.password).toBe(undefined);
    })
  });
});