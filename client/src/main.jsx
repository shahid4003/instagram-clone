import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QueryWrapper from "./wrapper/QueryWrapper.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryWrapper>
      <App />
    </QueryWrapper>
  </StrictMode>,
);
