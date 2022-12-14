import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyUserInfo } from "../api";
import "../stylesheets/Header.css";
import NotificationIcon from "./Notifications/NotificationIcon";

const Header = ({ setLoggedIn, loggedIn, setUsername, username }) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profile pic");
    localStorage.removeItem("userId");
    setUserInfo({});
    setLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const _userInfo = await getMyUserInfo(token);
      setUserInfo(_userInfo);
    };
    fetchData();
  }, [loggedIn]);

  return (
    <div className="header">
      <Link id="logo" to={loggedIn ? "/newsfeed" : "/"}>
        Social Dev Stack
      </Link>
      {loggedIn && userInfo.picUrl ? (
        <div>
          <nav id="header-links">
            <Link to={`/profile/${username}`}>
              <img id="profile-pic" src={userInfo.picUrl} />
            </Link>
            <Link to="/messages">Messages </Link>
            <Link to="/notifications">
              <NotificationIcon token={token} />
            </Link>
            <Link to="/login" onClick={logout}>
              Logout
            </Link>
          </nav>
        </div>
      ) : (
        <div>
          <nav id="header-links">
            <Link>Login/Register</Link>
          </nav>
        </div>
      )}
      <div onClick={toggleHamburger} className="hamburger">
        <div className="burger burger1" />
        <div className="burger burger2" />
        <div className="burger burger3" />
      </div>

      <style jsx="true">
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
            background-color: #a4161a;
            /* background-color: rgb(240, 3, 3); */
            height: 72px;
            width: 100%;
            margin-bottom: 10px;
            /* text-decoration: none; */
          }
          
          #header-links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            // color: #f5f3f4; 
            font-family: "Barlow", sans-serif;
            
          }
          
          #header-links:last-child {
            padding-right: 10px;
          }
          
          #header-links a {
            text-decoration: none;
            color: #f5f3f4;
            padding: 0px 5px;
          }
          
          #logo {
            padding-left: 10px;
            text-decoration: none;
            color: #FFFFFF;
            font-family: "Poppins", sans-serif;
            font-weight: bold;
            font-size: 30px;
            // background: -webkit-linear-gradient(120deg, #FFFFFF, #333, #FFFFFF, #333);
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
          }
          
          .hamburger {
            display: none;
            width: 2rem;
            height: 50px;
            padding-top: 10px;
            margin-right: 10px;
            /* justify-content: space-around; */
            flex-flow: column nowrap;
            z-index: 10;
          }
          
          .burger {
            width: 35px;
            height: 3px;
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

            .header {
              width: 100%;
              min-width: 320px;
              height: 48px;
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

            #header-links a {
              text-decoration: none;
              color: #000;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header;
