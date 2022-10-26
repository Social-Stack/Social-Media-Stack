import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register, Login } from "./components";

const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
};

root.render(
  <Router>
    <App />
  </Router>
);
