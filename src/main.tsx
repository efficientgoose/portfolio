import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;
// Drop the build-time HTML (see scripts/prerender.js); React renders the live page fresh.
root.replaceChildren();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
