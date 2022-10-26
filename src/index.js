import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Register, Login, NewsFeed } from "./components";

const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    const usernameExists = localStorage.getItem("username");
    if (loggedInUser) {
      setLoggedIn(true);
    }
    if (usernameExists) {
      setUsername(usernameExists);
    }
  }, []);

  return (
    <div>
      <Header
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        username={username}
      />
      <Routes>
        <Route
          path="/register"
          element={
            <Register
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
              setUsername={setUsername}
              setLoggedIn={setLoggedIn}
              loggedIn={loggedIn}
            />
          }
        />
        <Route path="/newsfeed" element={<NewsFeed />} />
      </Routes>
    </div>
  );
};

root.render(
  <Router>
    <App />
  </Router>
);
