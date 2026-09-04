import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pannello from "./Pannello.jsx";
import Iscrizione from "./Iscrizione.jsx";
import Login from "./Login.jsx";
import Admin from "./Admin.jsx";
import Privacy from "./Privacy.jsx";
import Recensione from "./Recensione.jsx";

/* clickeventi.it            -> sito cliente
   clickeventi.it/?pannello  -> demo pannello fornitore */
const params = window.location.search;
const isPanel = params.includes("pannello");
const isSignup = params.includes("iscrizione");
const isLogin = params.includes("accedi");
const isAdmin = params.includes("admin");
const isPrivacy = params.includes("privacy");
const tokenRec = new URLSearchParams(params).get("recensione");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {tokenRec ? <Recensione token={tokenRec} /> : isPrivacy ? <Privacy /> : isAdmin ? <Admin /> : isSignup ? <Iscrizione /> : isLogin ? <Login /> : isPanel ? <Pannello /> : <App />}
  </React.StrictMode>
);
