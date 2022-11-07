import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import "../stylesheets/Register.css";

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
    localStorage.setItem("userId", result.user.id);
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
    <div id="register-container">
      {loggedIn ? (
        <Navigate to="/newsfeed" />
      ) : (
        <form id="register" className="signup-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>Create A New Account</h1>
          </div>
          <div id="req-text">* Required</div>
          <div className="register-form-body">
            {/* <div className="form-group"> */}
            {/* <label htmlFor="firstname" className="label-title">
                  Username
                </label> */}
            <input
              type="text"
              name="username"
              className="form-input"
              required
              minLength={5}
              onChange={handleChange}
              placeholder="Username *"
            />
            {/* </div> */}
            <div>
              <input
                type="password"
                name="password"
                className="form-input"
                required
                minLength={8}
                onChange={handleChange}
                placeholder="Password *"
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                required
                minLength={8}
                onChange={handleChange}
                placeholder="Confirm Password *"
              />
            </div>
            <div>
              <input
                type="text"
                name="firstname"
                className="form-input"
                required
                onChange={handleChange}
                placeholder="First Name *"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastname"
                className="form-input"
                required
                onChange={handleChange}
                placeholder="Last Name *"
              />
            </div>
            <div>
              <input
                type="text"
                name="email"
                className="form-input"
                required
                onChange={handleChange}
                placeholder="Email *"
              />
            </div>
            <div>
              <input
                type="text"
                name="picUrl"
                className="form-input"
                onChange={handleChange}
                placeholder="Profile Picture URL"
              />
            </div>
          </div>
          <div className="form-footer">
            <span className="form-redirect-text">
              Already a member?{" "}
              <Link className="form-redirect-link" to="/login">
                Login!
              </Link>
            </span>
            <button className="form-btn" type="submit">
              Register!
            </button>
            <div className="error">
              <h3>{error && `${errorMessage}`}</h3>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default Register;
