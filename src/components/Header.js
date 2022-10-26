import { Link, useNavigate } from "react-router-dom";

const Header = ({ loggedIn, username }) => {
  let navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    //   localStorage.removeItem("admin");
    // localStorage.removeItem("username");
    setLoggedIn(false);
    setUsername("");
    //   setPassword("");
    navigate("/");
  };
  return (
    <div id="header">
      <Link to="/">Social Stack</Link>
      {loggedIn ? (
        <>
          <nav id="links">
            {/* <Link to="/profile">Profile</Link> | {""} */}
            {/* {isAdmin ? <Link to="admin">Admin | {""}</Link> : null} */}
            <Link to="/" onClick={logout}>
              Logout {username}
            </Link>
          </nav>
        </>
      ) : (
        <>
          <nav id="links">
            <Link to="/login">Login/Register</Link> |
          </nav>
        </>
      )}
    </div>
  );
};

export default Header;
