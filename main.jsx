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
import { Bacheca, PubblicaAnnuncio } from "./Bacheca.jsx";

/* ============================================================
   Quale pagina mostrare, in base all'indirizzo:

     clickeventi.it              sito per i clienti
     ?bacheca                    annunci per eventi
     ?pubblica                   modulo per pubblicare un annuncio
     ?iscrizione                 registrazione professionisti
     ?accedi                     accesso
     ?pannello                   area del professionista
     ?admin                      area amministratore
     ?privacy                    informativa
     ?reimposta                  nuova password
     ?recensione=CODICE          recensione dopo l'evento
     ?proposta=CODICE            risposta a una proposta

   I parametri vengono letti uno per uno: così un valore che
   contiene il nome di un'altra pagina (per esempio
   "ritorno=/?bacheca") non manda il visitatore altrove.
   ============================================================ */

const q = new URLSearchParams(window.location.search);
const c = (nome) => q.has(nome);

const tokenRecensione = q.get("recensione");
const tokenProposta = q.get("proposta");
const reimposta = c("reimposta") || window.location.hash.includes("type=recovery");

function Pagina() {
  if (tokenProposta) return <Proposta token={tokenProposta} />;
  if (tokenRecensione) return <Recensione token={tokenRecensione} />;
  if (reimposta) return <Reimposta />;
  if (c("pubblica")) return <PubblicaAnnuncio />;
  if (c("bacheca") || c("lavoro")) return <Bacheca />;
  if (c("privacy")) return <Privacy />;
  if (c("admin")) return <Admin />;
  if (c("accedi")) return <Login />;
  if (c("iscrizione")) return <Iscrizione />;
  if (c("pannello")) return <Pannello />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Pagina />
  </React.StrictMode>
);
