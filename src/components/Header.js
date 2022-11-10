import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/Header.css";

const Header = ({ setLoggedIn, loggedIn, setUsername, username, setToken }) => {
  // const navigate = useNavigate();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profile pic");
    localStorage.removeItem("userId");
    setToken("");
    setLoggedIn(false);
    setUsername("");
    // navigate("/login");
  };
  const picture = localStorage.getItem("profile pic");

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div className="header">
      <Link id="logo" to={loggedIn ? "/newsfeed" : "/"}>
        Social Stack
      </Link>
      {loggedIn ? (
        <div>
          <nav id="header-links">
            <Link to={`/profile/${username}`}>
              <img id="profile-pic" src={picture} />
            </Link>
            {/* <Link to="/profile">Profile</Link> | {""} */}
            {/* {isAdmin ? <Link to="admin">Admin | {""}</Link> : null} */}
            {/* <div> */}
            {/* <img id="profile-pic" src={require(`./Assets/defaultPic.png`)} /> offline mode for Fred in the sky */}
            {/* </div> */}
            <Link to="/messages">Messages </Link>
            <Link to="/login" onClick={logout}>
              Logout {username}
            </Link>
          </nav>
        </div>
      ) : (
        <div>
          <nav id="header-links">
            <Link to="/login">Login/Register</Link>
          </nav>
        </div>
      )}
      <div onClick={toggleHamburger} className="hamburger">
        <div className="burger burger1" />
        <div className="burger burger2" />
        <div className="burger burger3" />
      </div>

      <style jsx>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Barlow&family=Poppins:wght@600&display=swap");

          #profile-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 5px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            /* background-color: rgb(240, 3, 3); */
            height: 10%;
            /* text-decoration: none; */
          }
          
          #header-links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: black;
            font-family: "Barlow", sans-serif;
          }
          
          #header-links:last-child {
            padding-right: 10px;
          }
          
          #header-links a {
            text-decoration: none;
            color: black;
            padding: 0px 5px;
          }
          
          #logo {
            padding-left: 10px;
            text-decoration: none;
            color: black;
            font-family: "Poppins", sans-serif;
            font-weight: bold;
            font-size: 20px;
          }
          
          .hamburger {
            display: none;
            width: 2rem;
            height: 3rem;
            padding-top: 10px;
            margin-right: 10px;
            /* justify-content: space-around; */
            flex-flow: column nowrap;
            z-index: 10;
          }
          
          .burger {
            width: 2rem;
            height: 0.25rem;
            border-radius: 10px;
            background-color: black;
            margin-bottom: 10px;
            transform-origin: 1px;
            transition: all 0.3s linear;
          }

          .burger1 {
            transform: ${hamburgerOpen ? "rotate(45deg)" : "rotate(0)"};
          }

          .burger2 {
            transform: ${hamburgerOpen ? "translateX(100%)" : "translateX(0)"};
            opacity: ${hamburgerOpen ? 0 : 1};
          }
          
          .burger3 {
            transform: ${hamburgerOpen ? "rotate(-45deg)" : "rotate(0)"};
          }

          @media (max-width: 768px) {
            .hamburger {
              display: block;
              padding-top: 20px;
              margin-left: 10px;
              z-index: 6;
            }
            
            #header-links {
              display: ${hamburgerOpen ? "inline-flex;" : "none;"}
              background-color: rgb(245, 244, 244);
              height: 55vh;
              width: 55vw;
              margin-top: 20px;
              padding-top: 10px;
              padding-bottom: 5px;
              padding-left: 10px;
              position: fixed;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header;
