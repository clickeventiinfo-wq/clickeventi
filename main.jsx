import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pannello from "./Pannello.jsx";
import Iscrizione from "./Iscrizione.jsx";
import Login from "./Login.jsx";
import Admin from "./Admin.jsx";
import Privacy from "./Privacy.jsx";
import Recensione from "./Recensione.jsx";
import Reimposta from "./Reimposta.jsx";
import Proposta from "./Proposta.jsx";

/* clickeventi.it            -> sito cliente
   clickeventi.it/?pannello  -> demo pannello fornitore */
const params = window.location.search;
const isPanel = params.includes("pannello");
const isSignup = params.includes("iscrizione");
const isLogin = params.includes("accedi");
const isAdmin = params.includes("admin");
const isPrivacy = params.includes("privacy");
const tokenRec = new URLSearchParams(params).get("recensione");
const tokenProp = new URLSearchParams(params).get("proposta");
const isReimposta = params.includes("reimposta") || window.location.hash.includes("type=recovery");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {tokenProp ? <Proposta token={tokenProp} /> : isReimposta ? <Reimposta /> : tokenRec ? <Recensione token={tokenRec} /> : isPrivacy ? <Privacy /> : isAdmin ? <Admin /> : isSignup ? <Iscrizione /> : isLogin ? <Login /> : isPanel ? <Pannello /> : <App />}
  </React.StrictMode>
);
