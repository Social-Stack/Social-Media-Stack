import { createRoot } from "react-dom/client";
import { Register } from "./components";

const container = document.getElementById("app");
const root = createRoot(container);

const App = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

root.render(<App />);
