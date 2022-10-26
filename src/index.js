import { createRoot } from "react-dom/client";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register, Login, Header } from "./components";

const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <Header
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        username={username}
      />
      <Routes>
        <Route path="/register" element={<Register />} />
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
        {/* <Route path="/newsfeed" element={<NewsFeed />} /> */}
      </Routes>
    </div>
  );
};

root.render(
  <Router>
    <App />
  </Router>
);
