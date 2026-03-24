import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { defineCustomElements } from "@ui-platform/web-components/loader";
import { applyTheme, lightTheme } from "@ui-platform/core";

defineCustomElements();
applyTheme(lightTheme);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
