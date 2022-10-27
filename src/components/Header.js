import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/Header.css";

const Header = ({ loggedIn, username }) => {
  let navigate = useNavigate();
  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profile pic");
    setLoggedIn(false);
    setUsername("");
  };
  const picture = localStorage.getItem("profile pic");

  return (
    <div className="header">
      <Link id="logo" to="/newsfeed">
        Social Stack
      </Link>
      {loggedIn ? (
        <div>
          <nav id="header-links">
            {/* <Link to="/profile">Profile</Link> | {""} */}
            {/* {isAdmin ? <Link to="admin">Admin | {""}</Link> : null} */}
            {/* <div> */}
            <img id="profile-pic" src={picture} />
            {/* </div> */}
            <Link onClick={logout}>Logout {username}</Link>
          </nav>
        </div>
      ) : (
        <div>
          <nav id="header-links">
            <Link to="/login">Login/Register</Link> |
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
