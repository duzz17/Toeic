import React from "react";
import { createRoot } from "react-dom/client";
import "./review-store.js";
import App from "./part3.tsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
