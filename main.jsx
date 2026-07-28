import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pannello from "./Pannello.jsx";
import Iscrizione from "./Iscrizione.jsx";

/* clickeventi.it            -> sito cliente
   clickeventi.it/?pannello  -> demo pannello fornitore */
const params = window.location.search;
const isPanel = params.includes("pannello");
const isSignup = params.includes("iscrizione");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isSignup ? <Iscrizione /> : isPanel ? <Pannello /> : <App />}
  </React.StrictMode>
);
