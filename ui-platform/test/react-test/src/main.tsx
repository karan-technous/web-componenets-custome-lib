import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastProvider } from "@karan9186/react";
import { defineCustomElements } from "@karan9186/web-components/loader";
// import {applyTheme,darkTheme} from "@karan9186/web-components"
defineCustomElements();

// applyTheme(darkTheme);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);
