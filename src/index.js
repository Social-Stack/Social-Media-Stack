import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faTrash,
  faMessage,
  faArrowUp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  Header,
  Register,
  Login,
  NewsFeed,
  NotificationPage,
  Messages,
  Comments,
  FullpageFriendsLists,
  Footer,
  Profile,
} from "./components";

const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    const usernameExists = localStorage.getItem("username");
    if (loggedInUser) {
      setLoggedIn(true);
      setToken(loggedInUser);
    }
    if (usernameExists) {
      setUsername(usernameExists);
    }
  }, []);

  return (
    <div>
      <Header
        token={token}
        setToken={setToken}
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        username={username}
        setUsername={setUsername}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Login
              setToken={setToken}
              setUsername={setUsername}
              setLoggedIn={setLoggedIn}
              loggedIn={loggedIn}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              setToken={setToken}
              setUsername={setUsername}
              setLoggedIn={setLoggedIn}
              loggedIn={loggedIn}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
              setUsername={setUsername}
              setLoggedIn={setLoggedIn}
              loggedIn={loggedIn}
            />
          }
        />
        <Route
          path="/newsfeed"
          element={<NewsFeed token={token} element={<Comments />} />}
        />
        <Route
          path="/notifications"
          element={<NotificationPage token={token} />}
        />
        <Route path="/messages" element={<Messages token={token} />} />
        <Route
          path="/friendslists/:username"
          element={<FullpageFriendsLists token={token} />}
        />
        <Route path="/profile/:username" element={<Profile token={token} />} />
      </Routes>
      {loggedIn ? null : <Footer />}
    </div>
  );
};

library.add(fab, faTrash, faMessage, faArrowUp, faMagnifyingGlass);
root.render(
  <Router>
    <App />
  </Router>
);
