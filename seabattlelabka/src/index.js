import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import OpponentTable from "./opponentTable";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <OpponentTable />
    <App />
  </React.StrictMode>
);
