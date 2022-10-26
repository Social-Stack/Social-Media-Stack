import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = ({ setUsername, setLoggedIn, loggedIn }) => {
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState({ username: "", password: "" });

  const handleChange = (event) => {
    setUser((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const setInfo = (result) => {
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.user.username);
    localStorage.setItem("profile pic", result.user.picUrl);
    setLoggedIn(true);
    setUsername(result.user.username);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await loginUser(user);
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
        <form id="login" className="form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>
              <h2>Login</h2>
            </legend>
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
              <button className="form-btn" type="submit">
                Login
              </button>
              <div className="form-redirect-text">
                Not a member?{" "}
                <Link className="form-redirect-link" to="/register">
                  Sign Up!
                </Link>
              </div>
            </div>
            <div className="error">
              <h4>{error && `${errorMessage}`}</h4>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
};

export default Login;
