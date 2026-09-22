import { useState, useEffect } from "react";
import { Check, X, Loader2, CalendarDays, MapPin, Package, PartyPopper } from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Risposta a una controproposta
   Si apre dal link inviato al cliente: clickeventi.it/?proposta=CODICE
   Mostra il nuovo prezzo proposto dal professionista e permette
   di accettarlo o rifiutarlo.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;--ok:#1E9E6A;--ok-soft:#E7F6EF}
    *{box-sizing:border-box;margin:0;padding:0}
    .pr-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .pr-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .pr-wrap{max-width:520px;margin:0 auto;padding:0 20px}
    .pr-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .pr-logo em{font-style:normal;color:var(--accent)}
    .pr-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:30px;margin:26px 0}
    .pr-card h1{font-family:'Sora',sans-serif;font-size:23px;line-height:1.3;margin-bottom:8px}
    .pr-sub{color:var(--grigio);font-size:14.5px;line-height:1.6;margin-bottom:20px}
    .pr-forn{display:flex;align-items:center;gap:13px;background:var(--bg2);border-radius:13px;padding:13px;margin-bottom:18px}
    .pr-forn img{width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0}
    .pr-ini{width:52px;height:52px;border-radius:12px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;font:700 18px 'Sora',sans-serif;flex-shrink:0}
    .pr-forn b{font-family:'Sora',sans-serif;font-size:16px;display:block}
    .pr-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--grigio);margin-bottom:18px}
    .pr-meta span{display:inline-flex;align-items:center;gap:6px}
    .pr-prezzi{background:var(--bg2);border-radius:13px;padding:18px;margin-bottom:18px;text-align:center}
    .pr-vecchio{font-size:14.5px;color:var(--grigio);text-decoration:line-through;margin-bottom:6px}
    .pr-nuovo{font-family:'Sora',sans-serif;font-size:34px;font-weight:700;color:var(--ok)}
    .pr-risp{font-size:13px;color:var(--ok);font-weight:600;margin-top:6px}
    .pr-msg{border-left:3px solid var(--accent);padding:6px 0 6px 14px;margin-bottom:22px;font-size:14.5px;line-height:1.6;color:#3A3552;font-style:italic}
    .pr-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:12px;font:600 15.5px 'Work Sans',sans-serif;padding:14px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink);text-decoration:none;margin-top:10px}
    .pr-btn.ok{background:var(--accent);border-color:var(--accent);color:#fff}
    .pr-btn.ok:hover{background:#7A5CE8}
    .pr-btn:disabled{opacity:.6;cursor:default}
    .pr-err{color:#C0392B;font-size:13.5px;margin-top:14px;font-weight:600;text-align:center}
    .pr-nota{font-size:12.5px;color:var(--grigio);margin-top:16px;text-align:center;line-height:1.5}
    .pr-center{text-align:center;padding:80px 20px;color:var(--grigio)}
    .pr-ok{text-align:center;padding:20px 0}
    .pr-ok svg{color:var(--accent);margin-bottom:14px}
    .pr-spin{animation:pr-rot 1s linear infinite}@keyframes pr-rot{to{transform:rotate(360deg)}}
  `}</style>
);

const dataIt = (s) => s ? new Date(s).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "data da definire";
const iniziali = (n) => (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function Proposta({ token }) {
  const [stato, setStato] = useState("check");   // check | form | conclusa | errore
  const [dati, setDati] = useState(null);
  const [esito, setEsito] = useState(null);      // true = accettata
  const [errore, setErrore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("proposta_da_token", { p_token: token });
      if (error || !data?.ok) { setStato("errore"); setErrore("Questo link non è valido o è scaduto."); return; }
      setDati(data);
      if (data.stato !== "controproposta") {
        setEsito(data.stato === "accettata");
        setStato("conclusa");
        return;
      }
      setStato("form");
    })();
  }, [token]);

  const rispondi = async (accetta) => {
    setErrore(""); setSaving(true);
    const { data, error } = await supabase.rpc("rispondi_proposta", { p_token: token, p_accetta: accetta });
    setSaving(false);
    if (error) { setErrore("Non è stato possibile registrare la risposta. Riprova."); return; }
    if (!data?.ok) { setErrore(data?.errore || "Qualcosa è andato storto."); return; }
    setEsito(accetta); setStato("conclusa");
  };

  const risparmio = dati ? (dati.totale_iniziale || 0) - (dati.nuovo_prezzo || 0) : 0;

  return (
    <div className="pr-root"><Style />
      <header className="pr-head">
        <div className="pr-wrap"><a href="/" className="pr-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="pr-wrap">
        {stato === "check" && <div className="pr-center"><Loader2 size={26} className="pr-spin" /></div>}

        {stato === "errore" && (
          <div className="pr-card" style={{ textAlign: "center" }}>
            <h1>Link non valido</h1>
            <p className="pr-sub">{errore} Per assistenza scrivi a info@clickeventi.it</p>
            <a href="/" className="pr-btn ok">Torna al sito</a>
          </div>
        )}

        {stato === "conclusa" && (
          <div className="pr-card pr-ok">
            {esito ? <PartyPopper size={42} /> : <Check size={42} />}
            <h1>{esito ? "Proposta accettata" : "Risposta registrata"}</h1>
            <p className="pr-sub" style={{ marginTop: 8 }}>
              {esito
                ? <>Abbiamo avvisato {dati?.fornitore || "il professionista"}: verrai ricontattato per definire gli ultimi dettagli.</>
                : <>Abbiamo comunicato la tua risposta. Se vuoi, puoi cercare altri professionisti per il tuo evento.</>}
            </p>
            <a href="/" className="pr-btn ok">Torna al sito</a>
          </div>
        )}

        {stato === "form" && dati && (
          <div className="pr-card">
            <h1>Una nuova proposta per te</h1>
            <p className="pr-sub">
              Il professionista ha esaminato la tua richiesta e propone condizioni diverse.
            </p>

            <div className="pr-forn">
              {dati.foto ? <img src={dati.foto} alt={dati.fornitore} /> : <div className="pr-ini">{iniziali(dati.fornitore)}</div>}
              <div>
                <b>{dati.fornitore}</b>
                <small style={{ color: "var(--grigio)", fontSize: 13 }}>{dati.pacchetto || "Pacchetto"}</small>
              </div>
            </div>

            <div className="pr-meta">
              <span><CalendarDays size={13} /> {dataIt(dati.data)}</span>
              {dati.localita && <span><MapPin size={13} /> {dati.localita}</span>}
              {dati.evento && <span><Package size={13} /> {dati.evento}</span>}
            </div>

            <div className="pr-prezzi">
              <div className="pr-vecchio">Preventivo iniziale: {dati.totale_iniziale} €</div>
              <div className="pr-nuovo">{dati.nuovo_prezzo} €</div>
              {risparmio > 0 && <div className="pr-risp">Risparmi {risparmio} €</div>}
            </div>

            {dati.messaggio && <div className="pr-msg">"{dati.messaggio}"</div>}

            {errore && <div className="pr-err">{errore}</div>}

            <button className="pr-btn ok" onClick={() => rispondi(true)} disabled={saving}>
              {saving ? <><Loader2 size={17} className="pr-spin" /> Attendere…</> : <><Check size={17} /> Accetto la proposta</>}
            </button>
            <button className="pr-btn" onClick={() => rispondi(false)} disabled={saving}>
              <X size={17} /> Non mi interessa
            </button>

            <p className="pr-nota">
              Accettando, il professionista verrà avvisato e ti contatterà per definire gli ultimi dettagli.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
