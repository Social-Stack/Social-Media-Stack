import { useState } from "react";
import { Navigate } from "react-router";
import { registerUser } from "../api";

const Register = ({ setUsername, setLoggedIn, loggedIn, setToken }) => {
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  //   const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    picUrl: "",
  });

  const handleChange = (event) => {
    setUser((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const setInfo = (result) => {
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.user.username);
    setToken(result.token);
    setLoggedIn(true);
    setUsername(result.user.username);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await registerUser(user);
    result.token && setInfo(result);
    setError(result.error);
    setErrorMessage(result.message);
  };

  console.log(user);
  return (
    <div>
      {loggedIn ? (
        <Navigate to="/newsfeed" />
      ) : (
        <form id="register" className="form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>
              <h2>Register</h2>
            </legend>
            All Fields Are Required
            <div>
              <input
                type="text"
                name="username"
                required
                minLength={5}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <input
                type="text"
                name="firstname"
                required
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastname"
                required
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
            <div>
              <input
                type="text"
                name="email"
                required
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="text"
                name="picUrl"
                required
                onChange={handleChange}
                placeholder="Profile Picture URL"
              />
            </div>
            <button className="form-btn" type="submit">
              Register!
            </button>
            <div className="error">
              <h4>{error && `${errorMessage}`}</h4>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
};
export default Register;
