import React from "react";
import { createRoot } from "react-dom/client";
import PlayerApp from "./PlayerApp";
import "./main.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlayerApp />
  </React.StrictMode>,
);
