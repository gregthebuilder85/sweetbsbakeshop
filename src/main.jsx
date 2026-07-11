import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/theme.css";

// Hosted over http(s) -> clean URLs (BrowserRouter).
// Single-file / file:// / sandboxed preview -> hash URLs so routing can't throw.
let useHash = false;
try {
  const forced = typeof __USE_HASH__ !== "undefined" && __USE_HASH__;
  const p = window.location.protocol;
  useHash = forced || (p !== "http:" && p !== "https:");
} catch (e) {
  useHash = true;
}
const Router = useHash ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
