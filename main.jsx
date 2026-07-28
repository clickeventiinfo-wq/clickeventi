import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pannello from "./Pannello.jsx";
import Iscrizione from "./Iscrizione.jsx";
import Login from "./Login.jsx";

/* clickeventi.it            -> sito cliente
   clickeventi.it/?pannello  -> demo pannello fornitore */
const params = window.location.search;
const isPanel = params.includes("pannello");
const isSignup = params.includes("iscrizione");
const isLogin = params.includes("accedi");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isSignup ? <Iscrizione /> : isLogin ? <Login /> : isPanel ? <Pannello /> : <App />}
  </React.StrictMode>
);
