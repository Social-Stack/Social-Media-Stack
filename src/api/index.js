const BASE_URL = "http://localhost:4000/api";

//Register
export const registerUser = async (user) => {
  console.log("USER", user);
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
        email: user.email,
        picUrl: user.picUrl,
      }),
    });
    const result = await response.json();
    console.log("RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

//Login
export const loginUser = async (user) => {
  console.log("USER", user);
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    });
    const result = await response.json();
    console.log("RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};
