/**
 * @file main.tsx
 * @description React bootstrap for nzpolitik
 * @onboarding
 * - Mounts App inside BrowserRouter; basename strips trailing slash (GitHub Pages /nzpolitik)
 * - Global CSS: index.css
 * - Dependencies: react, react-dom, react-router-dom
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
