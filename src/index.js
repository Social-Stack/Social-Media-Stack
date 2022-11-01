import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header, Register, Login, NewsFeed } from "./components";


const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    const usernameExists = localStorage.getItem("username");
    if (loggedInUser) {
      setLoggedIn(true);
      setToken(loggedInUser)
    }
    if (usernameExists) {
      setUsername(usernameExists);
    }
  }, []);

  return (
    <div>
      <Header
        setToken={setToken}
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        username={username}
      />
      <Routes>
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
        <Route path="/newsfeed" element={<NewsFeed token={token} />} />
      </Routes>
    </div>
  );
};

root.render(
  <Router>
    <App />
  </Router>
);
