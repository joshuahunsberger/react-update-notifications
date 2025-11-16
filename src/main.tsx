import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// This must match the 'base' in vite.config.ts
const REPO_NAME = "react-update-notifications";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={`/${REPO_NAME}`}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
