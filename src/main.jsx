import { createRoot } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);
