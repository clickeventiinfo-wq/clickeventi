import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pannello from "./Pannello.jsx";

/* clickeventi.it            -> sito cliente
   clickeventi.it/?pannello  -> demo pannello fornitore */
const isPanel = window.location.search.includes("pannello");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isPanel ? <Pannello /> : <App />}
  </React.StrictMode>
);
